// npm install --prefix /private/tmp/prompt-highlight-tests playwright@1.56.1
// NODE_PATH=/private/tmp/prompt-highlight-tests/node_modules node scripts/audit_styles.cjs
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const sourceURL = process.argv[2] || 'http://127.0.0.1:8767/';
const templateURL = process.argv[3] || 'http://127.0.0.1:8766/';
const selectors = ['body', '.page-main', 'main .container', 'main h1', 'main h2', 'main h3',
    'main p', 'main a', 'main ul', 'main ol', 'main li', 'main strong', 'main blockquote',
    'main cite', 'main pre', 'main code', 'main table', 'main .table-caption', 'main th',
    'main td', 'main figure', 'main img', 'main figcaption', 'footer', '.footer-below',
    'footer details', 'footer select'];
const props = ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight',
    'letterSpacing', 'color', 'backgroundColor', 'marginTop', 'marginBottom', 'marginLeft',
    'marginRight', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
    'borderTopWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderRightWidth',
    'borderTopColor', 'borderBottomColor', 'borderRadius', 'boxShadow', 'textAlign',
    'textDecorationLine', 'whiteSpace', 'overflowX', 'overflowY', 'width', 'maxWidth'];

(async function () {
    const browser = await chromium.launch({
        executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless: true, chromiumSandbox: true
    });
    try {
        const target = await browser.newPage();
        const source = await browser.newPage();
        await source.route('https://**', request => request.abort());
        await source.goto(sourceURL);
        const errors = [];
        target.on('pageerror', error => errors.push(error.message));
        target.on('requestfailed', request => errors.push(request.url()));
        for (const file of ['index.html', 'template.html']) {
            for (const width of [320, 390, 768, 1440, 1920, 2560]) {
                for (const page of [source, target]) await page.setViewportSize({ width, height: 950 });
                await target.goto(new URL(file, templateURL).href);
                await target.waitForSelector('pre code.hljs');
                await target.evaluate(() => document.fonts.ready);
                await target.evaluate(async () => {
                    for (const image of document.images) image.loading = 'eager';
                    await Promise.all([...document.images].map(image => image.decode()));
                });
                // Source CSS plus the same explicit user-approved report overrides.
                // Contents geometry and manual settings remain target-only.
                let html = await target.content();
                html = html.replace(/<script\b[\s\S]*?<\/script>/g, '');
                html = html.replace(/<link\b[^>]*href="css\/(?:template|settings)\.css"[^>]*>/g, '');
                html = html.replace(/(<link\b[^>]*href=")([^"]+)(")/g,
                    (_, prefix, href, suffix) => prefix + new URL(href, href === 'css/report.css' ? templateURL : sourceURL).href + suffix);
                html = html.replace('<head>', '<head><base href="' + templateURL + '">');
                await source.setContent(html);
                await source.evaluate(() => document.fonts.ready);
                for (const page of [source, target]) {
                    const loaded = await page.evaluate(() => [...document.fonts]
                        .filter(font => font.status === 'loaded').map(font => font.family));
                    assert.ok(loaded.some(name => name.includes('Lucida')), 'Actual Lucida webfont did not load');
                    assert.ok(loaded.some(name => name.includes('Code Latin')), 'Actual Maple webfont did not load');
                }
                const compare = async selector => {
                    const read = page => page.locator(selector).evaluateAll((elements, props) =>
                        elements.map(element => Object.fromEntries(props.map(prop =>
                            [prop, getComputedStyle(element)[prop]]))), props);
                    assert.deepEqual(await read(target), await read(source), file + ' ' + width + ' ' + selector);
                };
                for (const selector of selectors) await compare(selector);
                const report = await target.evaluate(() => {
                    const figure = document.querySelector('.report-table');
                    const table = figure.querySelector('table');
                    const caption = figure.querySelector('.table-caption');
                    const rect = element => element.getBoundingClientRect();
                    const quote = document.querySelector('blockquote');
                    return {
                        captionWidth: rect(caption).width, contentWidth: rect(figure.parentElement).width,
                        tableCenter: rect(table).x + rect(table).width / 2,
                        figureCenter: rect(figure).x + rect(figure).width / 2,
                        tableWidth: rect(table).width, figureWidth: rect(figure).width,
                        radius: getComputedStyle(table).borderRadius,
                        header: getComputedStyle(table.querySelector('thead th')).backgroundColor,
                        quoteFamily: getComputedStyle(quote).fontFamily,
                        quoteStyle: getComputedStyle(quote).fontStyle,
                        quoteMark: getComputedStyle(quote, '::before').content,
                        italicLoaded: [...document.fonts].some(font => font.family.includes('Lucida') && font.style === 'italic' && font.status === 'loaded'),
                        labelled: table.getAttribute('aria-labelledby') === caption.id,
                        captions: [...document.querySelectorAll('main figcaption')].map(element => ({
                            width: rect(element).width, parentWidth: rect(element.parentElement).width,
                            align: getComputedStyle(element).textAlign,
                            color: getComputedStyle(element).color,
                            padding: getComputedStyle(element).padding
                        })),
                        cites: [...document.querySelectorAll('main cite')].map(element => ({
                            size: getComputedStyle(element).fontSize,
                            style: getComputedStyle(element).fontStyle,
                            color: getComputedStyle(element).color
                        })),
                        bodySize: getComputedStyle(document.body).fontSize,
                        brandColor: getComputedStyle(document.querySelector('.navbar-brand')).color,
                        bodyColor: getComputedStyle(document.body).color,
                        quoteRuleColor: getComputedStyle(quote).borderLeftColor,
                        quoteMarkColor: getComputedStyle(quote, '::before').color,
                        headingRule: getComputedStyle(document.querySelector('main h1')).borderBottom,
                        headingWidth: rect(document.querySelector('main h1')).width,
                        tableBottomSpace: getComputedStyle(figure).marginBottom,
                        math: [...document.querySelectorAll('main p[role="math"]')].map(element => ({
                            size: getComputedStyle(element).fontSize,
                            align: getComputedStyle(element).textAlign,
                            numbered: /\(\d+\)/.test(element.textContent)
                        })),
                        excerptSize: getComputedStyle(quote.querySelector('p')).fontSize
                    };
                });
                assert.ok(Math.abs(report.captionWidth - report.contentWidth) < 1);
                assert.ok(Math.abs(report.tableCenter - report.figureCenter) < 1);
                if (width >= 768) assert.ok(report.tableWidth < report.figureWidth);
                assert.equal(report.radius, '8px');
                assert.equal(report.header, 'rgb(245, 244, 237)');
                assert.ok(report.quoteFamily.includes('Lucida'));
                assert.equal(report.quoteStyle, 'italic');
                assert.ok(report.quoteMark.includes('“'));
                assert.ok(report.italicLoaded);
                assert.ok(report.labelled);
                for (const caption of report.captions) {
                    assert.ok(Math.abs(caption.width - caption.parentWidth) < 1);
                    assert.equal(caption.align, 'center');
                    assert.equal(caption.color, report.captions[0].color);
                    assert.equal(caption.padding, report.captions[0].padding);
                }
                for (const cite of report.cites) {
                    assert.equal(cite.size, report.bodySize);
                    assert.equal(cite.style, 'italic');
                    assert.equal(cite.color, report.bodyColor);
                }
                assert.equal(report.excerptSize, report.bodySize);
                assert.equal(report.quoteRuleColor, report.brandColor);
                assert.equal(report.quoteMarkColor, report.brandColor);
                assert.equal(report.headingRule, '1px solid rgb(136, 136, 136)');
                assert.ok(Math.abs(report.headingWidth - report.contentWidth) < 1);
                assert.ok(Math.abs(parseFloat(report.tableBottomSpace) - parseFloat(report.bodySize) * 1.5) < 0.1);
                for (const math of report.math) {
                    assert.equal(math.align, 'center');
                    assert.ok(Math.abs(parseFloat(math.size) - parseFloat(report.bodySize) * 1.2) < 0.1);
                    assert.equal(math.numbered, false);
                }
                if (width >= 768) {
                    for (const selector of ['#mainNav', '#mainNav > .container', '.navbar-brand', '.contents-button']) {
                        await compare(selector);
                    }
                } else {
                    assert.deepEqual(await target.locator('.navbar-brand').boundingBox(),
                        await source.locator('.navbar-brand').boundingBox(), 'Mobile title position drifted');
                }
                assert.ok(await target.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
                assert.equal(await target.locator('#contents-popover a').count(), await target.locator('main h2, main h3').count());
                assert.equal(await target.locator('main nav').count(), 0);
                const contents = target.getByRole('button', { name: 'Contents' });
                await contents.click();
                assert.ok(await target.locator('#contents-popover').evaluate(element => element.matches(':popover-open')));
                const popup = await target.locator('#contents-popover').boundingBox();
                assert.ok(popup.x >= 0 && popup.x + popup.width <= width + 1);
                await target.keyboard.press('Escape');
                assert.equal(await target.locator('#contents-popover').evaluate(element => element.matches(':popover-open')), false);
                await contents.click();
                await target.locator('.navbar-brand').click();
                assert.equal(await target.locator('#contents-popover').evaluate(element => element.matches(':popover-open')), false);
                await contents.focus(); await target.keyboard.press('Space');
                await target.locator('#contents-popover a').first().click();
                assert.equal(await target.locator('#contents-popover').evaluate(element => element.matches(':popover-open')), false);
                console.log(file, width, selectors.length + ' component groups match source + approved overrides; report and navigation passed');
            }
        }
        assert.deepEqual(errors, []);
        await target.setViewportSize({ width: 1440, height: 1000 });
        await target.goto(templateURL);
        await target.waitForSelector('pre code.hljs');
        await target.screenshot({ path: '/private/tmp/artifact-exact-desktop.png', fullPage: true });
        await target.setViewportSize({ width: 390, height: 950 });
        await target.goto(templateURL);
        await target.waitForSelector('pre code.hljs');
        await target.evaluate(async () => {
            await document.fonts.ready;
            for (const image of document.images) image.loading = 'eager';
            await Promise.all([...document.images].map(image => image.decode()));
        });
        await target.screenshot({ path: '/private/tmp/artifact-exact-mobile.png', fullPage: true });
        console.log('All style and interaction checks passed.');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
