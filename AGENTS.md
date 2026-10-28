# Website maintenance

- After changing site HTML, prompt Markdown, or frontend text, generate any affected HTML first, then run `scripts/build_font_subsets.py` with a Python environment containing `scripts/requirements-fonts.txt`.
- The current local environment is `/private/tmp/prompt-fonts-venv`. If unavailable, create a virtual environment outside the repository and install the font requirements there.
- Run `python3 scripts/build_font_subsets.py --check` before completing a website content update. Commit regenerated `css/fonts.css`, `assets/fonts/*.woff2`, and `assets/fonts/manifest.json` with the content changes.
- Full font originals stay outside the repository. Font paths are configured in `scripts/font-sources.json`; maintenance details are in `docs/font-subsets.md`.
- Keep Latin characters out of Chinese font subsets and retain font notices. Keep the Font Family page's original IPA replacement option available when distributing the Song subset.
