"""Generates the PDF Toolkit logo as PNG/ICNS (web icons + Mac app icon).

Same geometry as static/logo.svg (64×64 grid): navy tile, a faint back document,
a copper front document with folded corner and two cream text lines.

    python3 mac/make_icon.py
"""
import math
import os

from PIL import Image, ImageDraw

NAVY, COPPER, CREAM = (36, 43, 65), (196, 125, 69), (241, 241, 236)
BACK = tuple(round(n * 0.65 + c * 0.35) for n, c in zip(NAVY, CREAM))  # cream at 35 % on navy
SS = 4  # supersampling for smooth edges


def logo(size, inset=0.0):
    """Logo as RGBA image. inset = transparent margin per side (fraction), e.g. 0.1 for macOS."""
    S = size * SS
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    off = S * inset
    k = (S - 2 * off) / 64

    def P(x, y):
        return (off + x * k, off + y * k)

    def stroke(points, color, width):
        r = width * k / 2
        for (ax, ay), (bx, by) in zip(points, points[1:]):
            n = max(1, int(math.hypot(bx - ax, by - ay) / (r / 3)))
            for j in range(n + 1):
                px, py = ax + (bx - ax) * j / n, ay + (by - ay) * j / n
                d.ellipse((px - r, py - r, px + r, py + r), fill=color)

    d.rounded_rectangle((*P(0, 0), *P(64, 64)), radius=14 * k, fill=NAVY)
    back = [P(18, 15), P(35, 15), P(43, 23), P(43, 49), P(18, 49), P(18, 15)]
    stroke(back, BACK, 2.4)
    front = [P(24, 19), P(41, 19), P(49, 27), P(49, 53), P(24, 53)]
    d.polygon(front, fill=NAVY)
    stroke(front + [front[0]], COPPER, 3)
    stroke([P(41, 19), P(41, 27), P(49, 27)], COPPER, 3)
    stroke([P(30, 36), P(43, 36)], CREAM, 2.6)
    stroke([P(30, 42), P(39, 42)], CREAM, 2.6)
    return im.resize((size, size), Image.LANCZOS)


if __name__ == "__main__":
    here = os.path.dirname(os.path.abspath(__file__))
    root = os.path.dirname(here)
    icons = os.path.join(root, "web", "icons")
    os.makedirs(icons, exist_ok=True)
    for s in (64, 180, 192, 512):
        logo(s).save(os.path.join(icons, f"icon-{s}.png"), optimize=True)
    # maskable (Android): full-bleed navy background, logo slightly smaller
    m = Image.new("RGBA", (512, 512), NAVY + (255,))
    m.alpha_composite(logo(512, inset=0.1))
    m.save(os.path.join(icons, "icon-maskable-512.png"), optimize=True)
    # macOS app icon: 824/1024 tile with transparent margin
    logo(1024, inset=100 / 1024).save(os.path.join(here, "AppIcon.icns"),
                                       sizes=[(16, 16), (32, 32), (64, 64), (128, 128), (256, 256), (512, 512), (1024, 1024)])
    print("icons generated")
