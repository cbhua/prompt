#!/usr/bin/env python3
"""Build setup preview pages from the Markdown sources (stdlib only)."""
import json
from html import escape
from pathlib import Path
from render_setup_markdown import render

ROOT = Path(__file__).resolve().parents[1]
PAGE_TITLES = {
    'macos': 'Config MacOS',
    'ghostty': 'Config Ghostty',
    'oh-my-zsh': 'Config Oh My Zsh',
    'herdr': 'Config Herdr',
    'lazyvim': 'Config LazyVim',
    'vim': 'Config Vim',
    'ghostty-ssh': 'Config Ghostty over SSH',
}


def build():
    catalog = json.loads((ROOT / 'catalog.json').read_text())
    # Reuse the site's navigation and theme without changing the paper forms.
    template = (ROOT / 'pages/write-learning-note.html').read_text()
    header = template[:template.index('    <section class="success">')]
    footer_start = template.index('    <!-- Footer -->')
    footer_end = template.index('    <!-- Markdown Template -->')
    footer = template[footer_start:footer_end]
    for entry in catalog:
        if not entry['editable']:
            continue
        markdown = (ROOT / entry['source']).read_text()
        title = escape(PAGE_TITLES.get(entry['slug'], entry['title']))
        # The page heading already names the prompt; render only its body.
        body = markdown.split('\n', 1)[1].lstrip('\n') if markdown.startswith('# ') else markdown
        content = f'''    <section class="success" id="maincontent">
        <div class="container">
            <div class="sec">{title}</div>
            <br/>
            <div class="page-main setup-content">
{render(body)}
            </div>
            <div class="copy-actions setup-copy-actions">
                <button id="copyPromptBtn" class="btn btn-success btn-sm" type="button">Copy Prompt</button>
                <span id="copyStatus" class="copy-status" aria-live="polite"></span>
            </div>
        </div>
    </section>
'''
        page = header.replace('<html lang="en">', '<html lang="zh-CN">').replace(
            '<title>Write the Learning Notes</title>', f'<title>{title} | Prompt Collection</title>')
        template_json = json.dumps(markdown, ensure_ascii=False).replace("<", "\\u003c")
        page += content + footer + f'<script type="application/json" id="setupPromptTemplate">{template_json}</script>\n' + '''    <script src="../js/prompt-builder.js"></script>
    <script src="../js/setup-prompts.js"></script>
</body>
</html>
'''
        page = '\n'.join(line.rstrip() for line in page.splitlines()) + '\n'
        (ROOT / entry['page']).write_text(page)
        print(entry['page'])


if __name__ == '__main__':
    build()
