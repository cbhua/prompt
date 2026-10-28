// Install jsdom outside the repo; run with NODE_PATH pointing to its node_modules.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const init = fs.readFileSync(path.join(root, 'js/code-highlighting.js'), 'utf8');

async function highlight(html) {
    const dom = new JSDOM(html, { url: 'https://example.com/prompt/pages/test.html', runScripts: 'outside-only' });
    const document = dom.window.document;
    const loaded = [];
    Object.defineProperty(document, 'currentScript', {
        value: { src: 'https://example.com/prompt/js/code-highlighting.js' }
    });
    const append = document.head.appendChild.bind(document.head);
    document.head.appendChild = function (script) {
        assert.ok(script.src.startsWith('https://example.com/prompt/vendor/highlight/'));
        const name = new URL(script.src).pathname.split('/').pop();
        loaded.push(name);
        const result = append(script);
        queueMicrotask(function () {
            dom.window.eval(fs.readFileSync(path.join(root, 'vendor/highlight', name), 'utf8'));
            script.onload();
        });
        return result;
    };
    const before = Array.from(document.querySelectorAll('.page-main pre'), pre => pre.textContent);
    const templates = Array.from(document.querySelectorAll('script[type="text/template"], script[type="application/json"]'), el => el.textContent);
    dom.window.eval(init);
    await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual(Array.from(document.querySelectorAll('.page-main pre'), pre => pre.textContent), before);
    assert.deepEqual(Array.from(document.querySelectorAll('script[type="text/template"], script[type="application/json"]'), el => el.textContent), templates);
    return { dom, loaded };
}

(async function () {
    let count = 0;
    const coloredLanguages = new Set();
    for (const filename of fs.readdirSync(path.join(root, 'pages')).filter(name => name.endsWith('.html'))) {
        const { dom, loaded } = await highlight(fs.readFileSync(path.join(root, 'pages', filename), 'utf8'));
        const blocks = dom.window.document.querySelectorAll('.page-main pre');
        if (!blocks.length) { assert.equal(loaded.length, 0); }
        for (const pre of blocks) {
            const code = pre.querySelector('code.hljs');
            assert.ok(code, filename + ': code block did not highlight');
            if (code.querySelector('span')) {
                coloredLanguages.add(code.className.match(/language-(\w+)/)[1]);
            }
            count++;
        }
        dom.window.close();
    }
    for (const language of ['bash', 'ini', 'vim', 'markdown', 'latex']) {
        assert.ok(coloredLanguages.has(language), 'No syntax tokens for ' + language);
    }
    const fixture = new JSDOM('<div class="page-main"><pre><code class="language-bash"></code></pre><pre><code class="language-unknown">unchanged</code></pre></div>');
    fixture.window.document.querySelector('code').textContent = 'echo "<img src=x onerror=evil()><script>evil()</script>"';
    const { dom } = await highlight(fixture.serialize());
    assert.equal(dom.window.document.querySelector('pre code').querySelector('img, script'), null);
    assert.equal(dom.window.document.querySelector('.language-unknown').textContent, 'unchanged');
    fixture.window.close();
    dom.window.close();
    console.log('Verified ' + count + ' code boxes: syntax tokens, unchanged text/templates, safe escaping, and lazy loading.');
})().catch(error => { console.error(error); process.exitCode = 1; });
