# Website fonts and content subsets

The website uses Lucida Grande for Latin sans-serif text, CMU Serif for Latin serif text, system fonts for Chinese sans-serif text (typically PingFang SC on macOS and Microsoft YaHei on Windows), and LXGW Neo ZhiSong (霞鹜新致宋) for Chinese serif text. `Lucida Grade` refers to the installed family named `Lucida Grande`. Chinese sans-serif text follows the site's original system fallback stack; Glow Sans is retained only as an outlined specimen in the font gallery.

The default is sans-serif, including navigation and forms. Code blocks, inline code, keyboard shortcuts, and sample output (`pre`, `code`, `kbd`, `samp`) use Maple Mono via `--font-mono`. The Latin subset comes from Maple Mono, and the Chinese subset comes from the installed Maple Mono NF CN files, maintaining the English/Chinese monospace proportions without distributing unused Nerd Font icons. Regular/bold and Latin italic faces are included, and the code font's OpenType features and ligatures are retained. Source paths and weights can be changed in `scripts/font-sources.json` before rebuilding.

Use `class="font-serif"` or `class="font-song"` for serif text; `font-sans` and `font-hei` select sans-serif text. These classes also work on a Chinese paragraph containing English: Latin characters use the English font. The font gallery's serif cards demonstrate the serif stack; SVG specimens remain fixed outlined artwork.

## Update after editing site content

Run once to install the build dependencies into a local environment outside the repository:

```sh
python3 -m venv /private/tmp/prompt-fonts-venv
/private/tmp/prompt-fonts-venv/bin/pip install -r scripts/requirements-fonts.txt
```

After editing website content, regenerate any affected HTML pages first, then rebuild the subsets:

```sh
# When computer setup Markdown has changed:
python3 scripts/build_setup_pages.py

# After all website content updates:
/private/tmp/prompt-fonts-venv/bin/python scripts/build_font_subsets.py
python3 scripts/build_font_subsets.py --check
```

Commit the updated HTML/CSS, `assets/fonts/*.woff2`, and `assets/fonts/manifest.json` together. The deployment workflow runs `--check` and refuses to deploy stale or modified generated files. The checker needs only Python's standard library; GitHub never needs the full fonts or the private Lucida license.

The source paths and TTC face indices are in `scripts/font-sources.json`. Defaults point to the installed fonts in `~/Library/Fonts` and `/System/Library/Fonts/LucidaGrande.ttc` (regular face 0, bold face 1). Edit these paths if the fonts are stored elsewhere. Lucida webfont redistribution was authorized by the site owner; build it only from originals covered by that authorization. Full font files and license purchase records stay outside the repository.

## How generation works

`scripts/build_font_subsets.py` scans all primary site HTML, including text, input placeholders, accessibility labels, inline templates and messages. The independent `artifacts_template/` directory is excluded and uses its own font builder and manifest. The primary builder also scans `prompt/**/*.md`, non-minified first-party `js/*.js`, and first-party CSS for generated content. Escaped Unicode is decoded. It retains printable ASCII for ordinary English form input, and splits Chinese glyphs and punctuation from the other characters. Chinese fonts contain no Latin letters; generated CSS `unicode-range` values enforce the separation as well as the font stack order.

Only codepoints supported by the source font are included. Missing Chinese site glyphs stop the build unless an explicit `allow_missing` entry selects system fallback for a known unsupported symbol. Maple Mono NF CN does not contain the fullwidth slash U+FF0F, so only that symbol is allowed to fall back; all existing Chinese characters remain covered. Emoji and symbols absent from an English source font use system fallbacks. Arbitrary new Chinese characters typed by a visitor are outside the static content subset and use local/system fallbacks. Rebuild when adding or removing site characters. Changing text using only the existing characters does not require new font files.

Subsets use WOFF2, preserve license/copyright metadata, and have distinct internal names. Regular, bold, and italic English faces are included. Chinese sans-serif text uses installed system fonts and needs no downloadable subset. LXGW Neo ZhiSong has one original weight; browsers synthesize its bold/italic styles. The build preserves source timestamps and records source hashes and character coverage, making repeat builds with the same fonts and pinned dependencies deterministic. All faces are prepared before existing artifacts are overwritten. Content hashes in font URLs refresh browser caches; browsers fetch only the faces actually used on a page, with `font-display: swap`.

## Notices and original IPA replacement

Licenses are distributed in `assets/fonts/licenses/`; CMU Serif and Glow Sans use SIL OFL 1.1. LXGW Neo ZhiSong uses IPA Font License 1.0. Its [embedding instructions](https://github.com/lxgw/lxgw/blob/main/documents/xizhi_embedding_instructions.md) require a way to replace the derived font with an original IPA font. The Font Family page provides a persistent choice between the embedded Song subset and a locally installed original IPA Mincho font, plus the official download instructions. Latin serif text remains CMU Serif under either choice. If no original IPA font is installed, the original-font option uses the system serif fallback.

For a downloaded copy of the site, another replacement method is to install an original IPA font from <https://moji.or.jp/ipafont/ipafontdownload/>, point the Song source path in `scripts/font-sources.json` to that original font, and rerun the build. The subset script and character manifest accompany the distributed derivative.

Sources:

- CMU Serif: <https://cm-unicode.sourceforge.io/>
- Lucida Grande: <https://lucidafonts.com/>
- Glow Sans: <https://github.com/welai/glow-sans>
- LXGW Neo ZhiSong: <https://github.com/lxgw/LxgwNeoZhiSong>
- FontTools subsetting: <https://fonttools.readthedocs.io/en/stable/subset/>
- Maple Mono: <https://github.com/subframe7536/maple-font>
