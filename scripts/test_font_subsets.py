"""Run: python3 -m unittest discover -s scripts -p 'test_font_subsets.py'."""
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import build_font_subsets as fonts


class ContentTests(unittest.TestCase):
    def test_html_templates_attributes_and_frontend_sources(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            (root / 'index.html').write_text(
                '<p>汉 English &amp; 中文</p><input placeholder="填" aria-label="写">'
                '<script type="application/json">"\\u5b57\\ud840\\udc00"</script>')
            for directory, name, text in (
                    ('js', 'messages.js', '"\\u590d"'),
                    ('prompt', 'example.md', '提示'),
                    ('css', 'main.css', '.x::after { content: "好"; }'),
                    ('vendor', 'ignored.html', '龘'),
                    ('artifacts_template', 'ignored.html', '麤'),
                    ('.cache', 'ignored.html', '齉')):
                (root / directory).mkdir()
                (root / directory / name).write_text(text)
            chars = set(fonts.collect_characters(root))
            self.assertTrue(set(map(ord, '汉中文填写字复提示好&')) <= chars)
            self.assertIn(0x20000, chars)
            self.assertNotIn(ord('龘'), chars)
            self.assertNotIn(ord('齉'), chars)
            self.assertNotIn(ord('麤'), chars)
            self.assertTrue(set(range(0x20, 0x7F)) <= chars)

    def test_latin_does_not_enter_chinese_faces(self):
        for character in 'ABCabcéＡｚ':
            self.assertFalse(fonts.is_cjk(ord(character)), character)
        for character in '中文，。〇㐀':
            self.assertTrue(fonts.is_cjk(ord(character)), character)
        self.assertTrue(fonts.is_cjk(0x20000))


class DeploymentTests(unittest.TestCase):
    def test_current_artifacts_pass_and_new_characters_are_rejected(self):
        fonts.check()
        with patch.object(fonts, 'collect_characters', return_value=fonts.collect_characters() + [0x9F98]):
            with self.assertRaisesRegex(ValueError, 'Website text'):
                fonts.check()

    def test_corrupted_artifact_is_rejected(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            manifest = json.loads(fonts.MANIFEST.read_text())
            manifest['artifacts'] = {'broken.woff2': fonts.digest(b'original')}
            (root / 'manifest.json').write_text(json.dumps(manifest))
            (root / 'broken.woff2').write_bytes(b'changed')
            with patch.object(fonts, 'MANIFEST', root / 'manifest.json'), patch.object(fonts, 'ROOT', root):
                with self.assertRaisesRegex(ValueError, 'Missing or changed'):
                    fonts.check()


class GeneratedFontTests(unittest.TestCase):
    def test_chinese_and_latin_glyph_coverage_and_notice_metadata(self):
        try:
            from fontTools.ttLib import TTFont
        except ImportError:
            self.skipTest('Install scripts/requirements-fonts.txt to inspect WOFF2 files')
        manifest = json.loads(fonts.MANIFEST.read_text())
        config = json.loads(fonts.CONFIG.read_text())
        groups = {face['id']: face['group'] for face in config['faces']}
        allowed_missing = {face['id']: {int(value.removeprefix('U+'), 16)
                                       for value in face.get('allow_missing', [])}
                           for face in config['faces']}
        required_cjk = {cp for cp in manifest['characters'] if fonts.is_cjk(cp)}
        for face in manifest['faces']:
            with self.subTest(face=face['id']):
                font = TTFont(fonts.OUTPUT / (face['id'] + '.woff2'))
                actual = set(font.getBestCmap())
                self.assertEqual(actual, set(face['characters']))
                if groups[face['id']] == 'cjk':
                    self.assertTrue(required_cjk - allowed_missing[face['id']] <= actual)
                    self.assertFalse(actual & set(range(0x20, 0x7F)))
                else:
                    self.assertFalse(actual & required_cjk)
                    self.assertTrue(set(map(ord, 'English123')) <= actual)
                self.assertTrue(font['name'].getDebugName(0))
                self.assertTrue(font['name'].getDebugName(13))
                font.close()

    def test_maple_mono_keeps_fixed_width_and_code_features(self):
        try:
            from fontTools.ttLib import TTFont
        except ImportError:
            self.skipTest('Install scripts/requirements-fonts.txt to inspect WOFF2 files')
        latin = TTFont(fonts.OUTPUT / 'maple-mono-regular.woff2')
        chinese = TTFont(fonts.OUTPUT / 'maple-mono-cn-regular.woff2')
        widths = {latin['hmtx'][latin.getBestCmap()[ord(c)]][0] for c in ' AiW0=>'}
        self.assertEqual(len(widths), 1)
        latin_width = widths.pop() / latin['head'].unitsPerEm
        for c in '中文':
            width = chinese['hmtx'][chinese.getBestCmap()[ord(c)]][0] / chinese['head'].unitsPerEm
            self.assertAlmostEqual(width, 2 * latin_width)
        self.assertIn('GSUB', latin)
        self.assertIn('calt', {r.FeatureTag for r in latin['GSUB'].table.FeatureList.FeatureRecord})
        latin.close()
        chinese.close()


if __name__ == '__main__':
    unittest.main()
