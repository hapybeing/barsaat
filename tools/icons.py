"""Icons for Barsaat: a single raindrop on dusk glass. Run: python3 tools/icons.py"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
OUT = Path(__file__).resolve().parent.parent / 'web' / 'public'

def drop(size):
    s = size * 4
    im = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    # dusk glass
    for y in range(s):
        t = y / s
        c = (int(38 + 30 * t), int(36 + 14 * t), int(64 - 10 * t), 255)
        d.line([(0, y), (s, y)], fill=c)
    mask = Image.new('L', (s, s), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * 0.22), fill=255)
    # amber lamp glow low down
    glow = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse([s * 0.3, s * 0.72, s * 0.7, s * 0.92], fill=(240, 166, 90, 150))
    im = Image.alpha_composite(im, glow.filter(ImageFilter.GaussianBlur(s * 0.06)))
    # the drop
    d = ImageDraw.Draw(im)
    cx, cy, r = s * 0.5, s * 0.56, s * 0.2
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(233, 228, 218, 255))
    d.polygon([(cx - r * 0.86, cy - r * 0.5), (cx, cy - r * 2.1), (cx + r * 0.86, cy - r * 0.5)], fill=(233, 228, 218, 255))
    d.ellipse([cx - r * 0.55, cy - r * 0.35, cx - r * 0.15, cy + r * 0.05], fill=(255, 255, 255, 255))
    im.putalpha(Image.composite(im.getchannel('A'), Image.new('L', (s, s), 0), mask))
    return im.resize((size, size), Image.LANCZOS)

for name, size in [('favicon-32.png', 32), ('apple-touch-icon.png', 180), ('icon-512.png', 512)]:
    drop(size).save(OUT / name)
(OUT / 'favicon.svg').write_text('''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#262440"/><stop offset="1" stop-color="#443236"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="url(#g)"/><ellipse cx="32" cy="56" rx="14" ry="5" fill="#f0a65a" opacity=".45"/><path d="M32 9.5 C32 9.5 19.2 26 19.2 35.8 a12.8 12.8 0 0 0 25.6 0 C44.8 26 32 9.5 32 9.5z" fill="#e9e4da"/><ellipse cx="26.5" cy="35" rx="2.6" ry="3.4" fill="#fff"/></svg>''')
print('icons ok')
