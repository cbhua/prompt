/* Self-hosted syntax highlighting; load the library only on pages with code boxes. */
(function () {
    'use strict';
    var blocks = Array.from(document.querySelectorAll('.page-main pre'));
    if (!blocks.length) { return; }
    var base = new URL('../vendor/highlight/', document.currentScript.src);
    var aliases = { sh: 'bash', zsh: 'bash', shell: 'bash', toml: 'ini', tex: 'latex', text: 'plaintext' };

    function languageFor(pre) {
        var code = pre.querySelector('code');
        var match = ((code ? code.className : '') + ' ' + pre.className).match(/\blanguage-([\w-]+)/);
        var language = match ? match[1].toLowerCase() : 'plaintext';
        return aliases[language] || language;
    }

    function loadScript(name) {
        return new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.src = new URL(name, base).href;
            script.onload = resolve;
            script.onerror = function () { reject(new Error('Could not load ' + name)); };
            document.head.appendChild(script);
        });
    }

    var core = window.hljs ? Promise.resolve() : loadScript('highlight.min.js');
    core.then(function () {
        var languages = new Set(blocks.map(languageFor));
        return Promise.all(['vim', 'latex'].filter(function (language) {
            return languages.has(language) && !window.hljs.getLanguage(language);
        }).map(function (language) { return loadScript(language + '.min.js'); }));
    }).then(function () {
        blocks.forEach(function (pre) {
            var language = languageFor(pre);
            if (!window.hljs.getLanguage(language)) { return; }
            var code = pre.querySelector('code');
            if (!code) {
                code = document.createElement('code');
                code.textContent = pre.textContent;
                pre.replaceChildren(code);
            }
            code.classList.add('language-' + language);
            window.hljs.highlightElement(code);
        });
    }).catch(function (error) {
        // Plain code remains readable if a library asset cannot be loaded.
        console.warn('Code highlighting unavailable:', error);
    });
}());
