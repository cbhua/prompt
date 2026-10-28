# Exact Prompt template

1. Read TEMPLATE.md and README.md. User-edited requirements take precedence.
2. Copy this directory and use template.html as the output index.html. Replace only task content and explicitly requested changes.
3. Preserve css/main.css, css/font-family.css and vendor/bootstrap/css/bootstrap.min.css byte-for-byte. Do not reinterpret, distill or independently redesign their defaults. The copied source-manifest.json records their hashes.
4. css/settings.css is empty by default. Add overrides only at the user's explicit request. Do not add numeric defaults or invent weights, heading sizes, spacing, colors, card styles, figure borders, quote backgrounds or print themes.
5. Keep the existing Prompt structure: success, container, row, col-lg-12, page-main, setup-content, setup-table. Use existing Bootstrap styles for other requested report formats.
6. Header has only Template (or the requested title) and Contents, with no bottom rule and no inline body TOC. css/template.css handles the requested popover geometry and mobile control visibility. Its appearance comes from existing dropdown-menu rules.
7. Keep the original font and code-highlight scripts. Rebuild this output's subsets with scripts/build_font_subsets.py after content changes, then run --check. Keep full fonts outside the output and preserve font licenses and original IPA replacement support.
8. Verify source-copy hashes and actual browser styles for body, headings, paragraphs, lists, links, code, tables and footer, plus responsive layout and Contents interaction. Report material differences, never claim visual equivalence from a partial header check.

9. Explicit user-approved visual exceptions live in css/report.css: Claudette large quote + fine rule with Lucida Italic, shaded table header, rounded table frame, intrinsic centered table and full-content-width centered captions shared by images and tables. The entire blockquote (including paragraphs and cite) uses the body 1em font size and italic. Only the quote mark and vertical rule use navbar-brand red (#bb3322); cite text inherits normal text color. H1 uses the same 1px #888888 bottom rule and 0.5em padding as Prompt .sec. Display math is centered at 1.2em with no numbering; report-table has 1.5em bottom margin. Preserve these defaults; do not import unrelated Claudette styles. Use figure.report-table > figcaption.table-caption + div.setup-table > table, with table aria-labelledby pointing to the caption.

10. Do not render the font-preferences/license footer or add a replacement footer. Keep packaged font licenses and the underlying local IPA replacement support.
