/* Copy the original Markdown behind the rendered setup prompt. */
(function () {
    'use strict';
    var markdown = JSON.parse(document.getElementById('setupPromptTemplate').textContent);
    var button = document.getElementById('copyPromptBtn');
    button.addEventListener('click', function () {
        var text = markdown.trim();
        if (!text) {
            PromptBuilder.setStatus('Nothing to copy.', true);
            return;
        }
        PromptBuilder.copyToClipboard(text).then(function () {
            PromptBuilder.setStatus('Copied!');
        }).catch(function () {
            PromptBuilder.setStatus('Copy failed. Select and copy the text manually.', true);
        });
    });
}());
