"""Render the Markdown constructs used by the setup prompts without dependencies."""
import re
from html import escape


def inline(text):
    code = []
    def keep_code(match):
        code.append('<code>' + escape(match.group(1)) + '</code>')
        return f'\x00{len(code) - 1}\x00'
    text = re.sub(r'`([^`]+)`', keep_code, text)
    text = escape(text)
    text = re.sub(r'\[([^\]]+)\]\((https?://[^\s)]+)\)', r'<a href="\2">\1</a>', text)
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
    return re.sub(r'\x00(\d+)\x00', lambda m: code[int(m.group(1))], text)


def render(markdown):
    lines = markdown.splitlines()
    result = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        if line.startswith('```'):
            code = []
            i += 1
            while i < len(lines) and not lines[i].startswith('```'):
                code.append(lines[i])
                i += 1
            result.append('<pre><code>' + escape('\n'.join(code)) + '</code></pre>')
            i += 1
            continue
        heading = re.match(r'^(#{1,6})\s+(.+)$', line)
        if heading:
            level = len(heading.group(1))
            result.append(f'<h{level}>{inline(heading.group(2))}</h{level}>')
            i += 1
            continue
        if line.startswith('|') and i + 1 < len(lines) and re.fullmatch(r'[| :\-]+', lines[i + 1]):
            def cells(row, tag):
                return ''.join(f'<{tag}>{inline(c.strip())}</{tag}>' for c in row.strip().strip('|').split('|'))
            table = ['<div class="setup-table"><table><thead><tr>' + cells(line, 'th') + '</tr></thead><tbody>']
            i += 2
            while i < len(lines) and lines[i].startswith('|'):
                table.append('<tr>' + cells(lines[i], 'td') + '</tr>')
                i += 1
            table.append('</tbody></table></div>')
            result.append('\n'.join(table))
            continue
        item = re.match(r'^(?:- |(\d+)\. )(.+)$', line)
        if item:
            ordered = item.group(1) is not None
            tag = 'ol' if ordered else 'ul'
            start = f' start="{item.group(1)}"' if ordered else ''
            result.append(f'<{tag}{start}>')
            while i < len(lines):
                item = re.match(r'^(?:- |(\d+)\. )(.+)$', lines[i])
                if not item or (item.group(1) is not None) != ordered:
                    break
                text = [item.group(2)]
                i += 1
                while i < len(lines) and lines[i].startswith('   ') and lines[i].strip():
                    text.append(lines[i].strip())
                    i += 1
                result.append('<li>' + inline(' '.join(text)) + '</li>')
            result.append(f'</{tag}>')
            continue
        paragraph = [line]
        i += 1
        while i < len(lines) and lines[i].strip() and not re.match(r'^(#{1,6}\s|```|\||- |\d+\. )', lines[i]):
            paragraph.append(lines[i])
            i += 1
        result.append('<p>' + inline(' '.join(paragraph)) + '</p>')
    return '\n'.join(result)
