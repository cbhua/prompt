#!/usr/bin/env python3
"""Copy the real Prompt assets byte-for-byte, or verify the stored snapshot."""
import argparse
import hashlib
import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = [
    'css/main.css', 'css/font-family.css', 'vendor/bootstrap/css/bootstrap.min.css',
    'js/font-preferences.js', 'js/code-highlighting.js',
    'scripts/build_font_subsets.py', 'scripts/font-sources.json', 'scripts/requirements-fonts.txt',
    'vendor/highlight/highlight.min.js', 'vendor/highlight/vim.min.js',
    'vendor/highlight/latex.min.js', 'vendor/highlight/LICENSE',
]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-root', type=Path, default=ROOT.parent)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    manifest_path = ROOT / 'source-manifest.json'
    if args.check:
        manifest = json.loads(manifest_path.read_text())
        for relative, expected in manifest.items():
            if sha(ROOT / relative) != expected:
                raise ValueError(f'Packaged source asset changed: {relative}')
            if sha(args.source_root / relative) != expected:
                raise ValueError(f'Prompt source changed; synchronize again: {relative}')
        print(f'{len(manifest)} original assets match the Prompt source byte-for-byte.')
    else:
        assets = ASSETS + [str(path.relative_to(args.source_root))
                           for path in (args.source_root / 'vendor/font-awesome').rglob('*') if path.is_file()]
        for relative in assets:
            target = ROOT / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(args.source_root / relative, target)
        manifest_path.write_text(json.dumps({relative: sha(ROOT / relative) for relative in assets}, indent=2) + '\n')


if __name__ == '__main__':
    try:
        main()
    except (OSError, ValueError) as error:
        print(error, file=sys.stderr)
        sys.exit(1)
