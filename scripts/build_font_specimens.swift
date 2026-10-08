// macOS-only build helper; visitors only receive the generated SVG files.
// Run: swift scripts/build_font_specimens.swift
import Foundation
import CoreText
import CoreGraphics

struct Specimen {
    let slug: String
    let family: String
    let file: URL
    let lines: [String]
    let size: CGFloat
}

let root = URL(fileURLWithPath: #filePath).deletingLastPathComponent().deletingLastPathComponent()
let userFonts = FileManager.default.homeDirectoryForCurrentUser.appendingPathComponent("Library/Fonts")
let english = ["Education does for the mind,", "experience does for the soul."]
let chinese = ["伟大和平庸消耗的心力相同。"]
let specimens = [
    Specimen(slug: "cmu-serif", family: "CMU Serif", file: userFonts.appendingPathComponent("cmunrm.ttf"), lines: english, size: 40),
    Specimen(slug: "lucida-grande", family: "Lucida Grande", file: URL(fileURLWithPath: "/System/Library/Fonts/LucidaGrande.ttc"), lines: english, size: 36),
    Specimen(slug: "lxgw-neo-zhisong", family: "LXGW Neo ZhiSong", file: userFonts.appendingPathComponent("LXGWNeoZhiSong.ttf"), lines: chinese, size: 46),
    Specimen(slug: "glow-sans", family: "Glow Sans SC", file: userFonts.appendingPathComponent("GlowSansSC-Normal-Regular.otf"), lines: chinese, size: 46),
]

func number(_ n: CGFloat) -> String {
    let rounded = (n * 100).rounded() / 100
    return String(format: "%.2f", locale: Locale(identifier: "en_US_POSIX"), Double(rounded))
        .replacingOccurrences(of: #"\.?0+$"#, with: "", options: .regularExpression)
}

func xml(_ text: String) -> String {
    text.replacingOccurrences(of: "&", with: "&amp;")
        .replacingOccurrences(of: "<", with: "&lt;")
        .replacingOccurrences(of: ">", with: "&gt;")
}

let output = root.appendingPathComponent("assets/font-specimens")
try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
for specimen in specimens {
    guard let descriptors = CTFontManagerCreateFontDescriptorsFromURL(specimen.file as CFURL) as? [CTFontDescriptor],
          let descriptor = descriptors.first(where: {
              let font = CTFontCreateWithFontDescriptor($0, specimen.size, nil)
              return CTFontCopyFamilyName(font) as String == specimen.family
                  && !((CTFontCopyName(font, kCTFontStyleNameKey) as String?) ?? "").localizedCaseInsensitiveContains("bold")
          }) else {
        fatalError("Missing expected font \(specimen.family) at \(specimen.file.path)")
    }
    let font = CTFontCreateWithFontDescriptor(descriptor, specimen.size, nil)
    var paths = [String]()
    for (lineIndex, text) in specimen.lines.enumerated() {
        let attributed = NSAttributedString(string: text, attributes: [NSAttributedString.Key(kCTFontAttributeName as String): font])
        let line = CTLineCreateWithAttributedString(attributed)
        let width = CGFloat(CTLineGetTypographicBounds(line, nil, nil, nil))
        precondition(width <= 704, "Specimen exceeds its viewBox")
        let x = (760 - width) / 2
        let baseline: CGFloat = specimen.lines.count == 1 ? 94 : CGFloat(65 + lineIndex * 56)
        for run in CTLineGetGlyphRuns(line) as! [CTRun] {
            let runFont = (CTRunGetAttributes(run) as NSDictionary)[kCTFontAttributeName] as! CTFont
            precondition(CTFontCopyPostScriptName(runFont) as String == CTFontCopyPostScriptName(font) as String,
                         "Unexpected fallback font in specimen")
            let count = CTRunGetGlyphCount(run)
            var glyphs = [CGGlyph](repeating: 0, count: count)
            var positions = [CGPoint](repeating: .zero, count: count)
            CTRunGetGlyphs(run, CFRange(location: 0, length: 0), &glyphs)
            CTRunGetPositions(run, CFRange(location: 0, length: 0), &positions)
            for i in 0..<count {
                precondition(glyphs[i] != 0, "Missing glyph")
                guard let path = CTFontCreatePathForGlyph(runFont, glyphs[i], nil) else { continue }
                var commands = ""
                func point(_ p: CGPoint) -> String {
                    "\(number(x + positions[i].x + p.x)) \(number(baseline - positions[i].y - p.y))"
                }
                path.applyWithBlock { ptr in
                    let e = ptr.pointee
                    switch e.type {
                    case .moveToPoint: commands += "M" + point(e.points[0])
                    case .addLineToPoint: commands += "L" + point(e.points[0])
                    case .addQuadCurveToPoint: commands += "Q" + point(e.points[0]) + " " + point(e.points[1])
                    case .addCurveToPoint: commands += "C" + point(e.points[0]) + " " + point(e.points[1]) + " " + point(e.points[2])
                    case .closeSubpath: commands += "Z"
                    @unknown default: fatalError("Unknown path element")
                    }
                }
                paths.append("<path d=\"\(commands)\"/>")
            }
        }
    }
    let svg = """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 160" width="760" height="160" role="img" aria-labelledby="title desc">
    <title id="title">\(xml(specimen.family))</title>
    <desc id="desc">\(xml(specimen.lines.joined(separator: " ")))</desc>
    <g fill="#333333">\(paths.joined())</g>
    </svg>

    """
    try svg.write(to: output.appendingPathComponent(specimen.slug + ".svg"), atomically: true, encoding: .utf8)
    print("\(specimen.slug).svg — \(svg.utf8.count) bytes — \(CTFontCopyPostScriptName(font))")
}
