/**
 * Prompt Builder - Reusable JavaScript for building prompts from Q&A forms
 * 
 * Usage:
 * 1. Include this script in your HTML
 * 2. Call PromptBuilder.init() with configuration
 * 3. Ensure your page has:
 *    - A container with class 'page-main'
 *    - Textareas with class 'prompt-textarea'
 *    - A button with id 'copyPromptBtn'
 *    - A status span with id 'copyStatus'
 */

(function() {
    'use strict';

    var PromptBuilder = {
        config: {
            markdownTemplateId: null
        },

        /**
         * Initialize the prompt builder
         * @param {Object} options - Configuration options
         * @param {string} options.markdownTemplateId - ID of the script tag containing the markdown template
         */
        init: function(options) {
            if (options) {
                this.config.markdownTemplateId = options.markdownTemplateId || null;
            }

            document.addEventListener('DOMContentLoaded', function() {
                var btn = document.getElementById('copyPromptBtn');
                if (btn) {
                    btn.addEventListener('click', PromptBuilder.onCopyClick);
                }
            });
        },

        /**
         * Get the markdown template from the script tag
         * @returns {string} The markdown template
         */
        getMarkdownTemplate: function() {
            if (!this.config.markdownTemplateId) {
                return null;
            }
            var templateEl = document.getElementById(this.config.markdownTemplateId);
            if (!templateEl) {
                console.warn('Markdown template not found: ' + this.config.markdownTemplateId);
                return null;
            }
            return templateEl.textContent || templateEl.innerText || '';
        },

        /**
         * Build the complete prompt by replacing Answer blocks in the markdown template
         * @returns {string} The complete prompt text
         */
        buildPrompt: function() {
            // Get the markdown template
            var template = this.getMarkdownTemplate();
            if (!template) {
                return '';
            }

            // Find all textareas to get their values
            var textareas = document.querySelectorAll('textarea.prompt-textarea');
            var answers = [];
            for (var i = 0; i < textareas.length; i++) {
                answers.push(textareas[i].value.trim());
            }

            // Replace each "Answer" block in the template with the corresponding answer
            // The pattern is: ```\nAnswer\n```
            var answerPattern = /```\s*\n\s*Answer\s*\n\s*```/g;
            var result = template;
            var answerIndex = 0;

            result = result.replace(answerPattern, function(match) {
                if (answerIndex < answers.length) {
                    var answer = answers[answerIndex];
                    answerIndex++;
                    // If answer is empty, keep the placeholder, otherwise replace with answer
                    if (answer) {
                        return '```\n' + answer + '\n```';
                    } else {
                        return match; // Keep the original "Answer" placeholder if empty
                    }
                }
                return match; // Keep original if no more answers
            });

            return result.trim();
        },

        /**
         * Copy text to clipboard
         * @param {string} text - Text to copy
         * @returns {Promise} Promise that resolves when copy is complete
         */
        copyToClipboard: function(text) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                return navigator.clipboard.writeText(text);
            }
            return new Promise(function(resolve, reject) {
                try {
                    var ta = document.createElement('textarea');
                    ta.value = text;
                    ta.style.position = 'fixed';
                    ta.style.left = '-9999px';
                    document.body.appendChild(ta);
                    ta.focus();
                    ta.select();
                    var ok = document.execCommand('copy');
                    document.body.removeChild(ta);
                    ok ? resolve() : reject(new Error('execCommand failed'));
                } catch (e) {
                    reject(e);
                }
            });
        },

        /**
         * Set status message
         * @param {string} msg - Status message
         * @param {boolean} isError - Whether this is an error message
         */
        setStatus: function(msg, isError) {
            var el = document.getElementById('copyStatus');
            if (!el) return;
            el.textContent = msg;
            el.className = 'copy-status' + (isError ? ' error' : ' success');
            window.setTimeout(function() {
                el.textContent = '';
                el.className = 'copy-status';
            }, 2400);
        },

        /**
         * Handle copy button click
         */
        onCopyClick: function() {
            var content = PromptBuilder.buildPrompt();
            if (!content) {
                PromptBuilder.setStatus('Nothing to copy.', true);
                return;
            }
            PromptBuilder.copyToClipboard(content)
                .then(function() {
                    PromptBuilder.setStatus('Copied!');
                })
                .catch(function() {
                    PromptBuilder.setStatus('Copy failed.', true);
                });
        }
    };

    // Make PromptBuilder available globally
    window.PromptBuilder = PromptBuilder;

})();

