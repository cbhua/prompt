# Font gallery maintenance

`pages/font-family.html` is a static collection linked from the homepage's Others section. It is separate from the prompt catalog because it has no prompt to copy.

## Specimen assets

The four images in `assets/font-specimens/` contain SVG paths, not SVG text or embedded fonts. Visitors do not need the fonts installed to view the specimens. Each specimen has a fixed viewBox, descriptive title, and the sample sentence in its description and HTML alt text. Cards display only a centered font name and its specimen, without categories or weight labels. Chinese font names use their Chinese names. The images reserve their dimensions to avoid layout shifts, and the lower images use native lazy loading. Live page text uses the site's self-hosted webfont subsets; see [font-subsets.md](font-subsets.md). Font preferences and notices follow the cards.

These are fixed sample artworks, not reusable font distributions. Original font project/vendor links are recorded below for maintenance.

## Rebuild on macOS

Install the desired fonts locally, then run from the repository root:

```sh
swift -module-cache-path /private/tmp/prompt-swift-module-cache scripts/build_font_specimens.swift
```

The helper uses Core Text to shape the sample sentences (including kerning), verifies the selected font and missing glyphs, and converts the glyph outlines to SVG paths rounded to two decimal places. It reads:

- `~/Library/Fonts/cmunrm.ttf` — CMU Serif Roman.
- `/System/Library/Fonts/LucidaGrande.ttc` — Lucida Grande Regular.
- `~/Library/Fonts/LXGWNeoZhiSong.ttf` — LXGW Neo ZhiSong Regular.
- `~/Library/Fonts/GlowSansSC-Normal-Regular.otf` — Glow Sans SC Normal Regular.

Full font files stay on the local computer. Generated SVG artwork and small WOFF2 subsets belong in this repository. Commit regenerated SVGs when changing the samples, and regenerate the webfont subsets after changing site text. GitHub Pages serves the checked-in HTML/CSS/SVG/WOFF2 directly and does not run Swift.

## Choosing a format

For a few fixed samples, outlined SVG is crisp at different display sizes and removes the visitor's font download. SVG `<text>` alone still requires the font and may silently fall back. Outlined text cannot be edited or selected as ordinary text; the gallery retains accessible sample text in each image's alt attribute.

For many long samples or an interactive text editor, consider a licensed WOFF2 subset instead. Paths repeat glyph geometry and are not always the smallest option at scale. Raster AVIF/WebP previews can also be smaller for dense artwork, at the cost of resolution-dependent text sharpness. Measure actual asset sizes before choosing.

Font sources:

- CMU: https://cm-unicode.sourceforge.io/
- Lucida: https://lucidafonts.com/
- LXGW Neo ZhiSong: https://github.com/lxgw/LxgwNeoZhiSong
- Glow Sans: https://github.com/welai/glow-sans
