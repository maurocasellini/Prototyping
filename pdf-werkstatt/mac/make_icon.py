"""Erzeugt AppIcon.icns (Navy-Kachel, Dokument in Kupfer, Unterschrift in Creme)."""
import math
import os

from PIL import Image, ImageDraw

NAVY, COPPER, CREAM = (36, 43, 65), (176, 108, 56), (241, 241, 236)
S = 1024
SS = 4  # Supersampling für glatte Kanten


def icon():
    im = Image.new("RGBA", (S * SS, S * SS), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    k = SS
    # macOS-Raster: Kachel 824 px, zentriert, Radius ~185
    m = 100 * k
    d.rounded_rectangle((m, m, S * k - m, S * k - m), radius=185 * k, fill=NAVY)
    # Dokument mit umgeknickter Ecke
    x0, y0, x1, y1, fold = 330 * k, 250 * k, 694 * k, 774 * k, 120 * k
    w = 26 * k
    doc = [(x0, y0), (x1 - fold, y0), (x1, y0 + fold), (x1, y1), (x0, y1), (x0, y0)]
    d.line(doc, fill=COPPER, width=w, joint="curve")
    d.line([(x1 - fold, y0), (x1 - fold, y0 + fold), (x1, y0 + fold)], fill=COPPER, width=w, joint="curve")
    for pt in doc:
        d.ellipse((pt[0] - w / 2, pt[1] - w / 2, pt[0] + w / 2, pt[1] + w / 2), fill=COPPER)
    # Textzeilen
    def stroke(points, color, width):
        """Weiche Linie: Kreise entlang der Punkte (runde Enden, keine Zacken)."""
        r = width / 2
        for (ax, ay), (bx, by) in zip(points, points[1:]):
            n = max(1, int(math.hypot(bx - ax, by - ay) / (r / 3)))
            for j in range(n + 1):
                px, py = ax + (bx - ax) * j / n, ay + (by - ay) * j / n
                d.ellipse((px - r, py - r, px + r, py + r), fill=color)

    for i, ln in enumerate((0.62, 0.8, 0.48)):
        y = (390 + i * 66) * k
        stroke([(x0 + 72 * k, y), (x0 + 72 * k + (x1 - x0 - 144 * k) * ln, y)], COPPER, 15 * k)
    # Unterschrift (Creme) über der Grundlinie
    pts = []
    for i in range(240):
        t = i / 239
        x = 395 + t * 235
        y = 632 - 48 * math.sin(t * 10.5) * math.exp(-t * 1.4) - 14 * t
        pts.append((x * k, y * k))
    stroke(pts, CREAM, 15 * k)
    stroke([(392 * k, 694 * k), (632 * k, 694 * k)], CREAM, 7 * k)
    return im.resize((S, S), Image.LANCZOS)


if __name__ == "__main__":
    here = os.path.dirname(os.path.abspath(__file__))
    img = icon()
    img.save(os.path.join(here, "AppIcon.png"))
    img.save(os.path.join(here, "AppIcon.icns"), sizes=[(16, 16), (32, 32), (64, 64), (128, 128), (256, 256), (512, 512), (1024, 1024)])
    print("AppIcon.icns erstellt")
