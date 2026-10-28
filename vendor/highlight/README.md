# highlight.js 11.12.0

Self-hosted common browser bundle plus Vim and LaTeX grammars. Distributed under the BSD 3-Clause license in `LICENSE`.

Source: https://github.com/highlightjs/highlight.js/tree/11.12.0

Pinned upstream assets:

- https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.12.0/highlight.min.js
- https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.12.0/languages/vim.min.js
- https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.12.0/languages/latex.min.js

`js/code-highlighting.js` loads these files only when a page has code boxes, and loads additional grammars only when needed. Shell/Zsh use the Bash grammar, and TOML uses the INI grammar's TOML support. Explicit language labels avoid misclassifying ordinary prose. Unknown languages remain plain text. Highlighter markup changes presentation only; prompt copying reads the original Markdown templates.

Syntax colors are maintained in `css/main.css`. Do not modify the upstream minified files.

Regression check (test dependencies stay outside the repository):

```sh
npm install --prefix /private/tmp/prompt-highlight-tests --no-audit --no-fund jsdom@27.0.1
NODE_PATH=/private/tmp/prompt-highlight-tests/node_modules node scripts/test_code_highlighting.cjs
```
