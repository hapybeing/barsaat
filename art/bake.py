"""Bake the painted plates for the site.

Each plate is normalised to 880x1200 (portrait folio), saved as WebP, and gets a
mask texture (half res) that tells the shader which pixels are alive:
  R = sky / cloud   (billows, drifts)
  G = water         (flows, glints)
  B = foliage       (sways in the wind)
Also bakes the floral border strip (tileable) and the gallery images.
"""
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
import os, json

W, H = 880, 1200
ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, '../web/public/plates')
os.makedirs(OUT, exist_ok=True)

PLATES = {
    'p1-ramagiri': dict(sky=0.50, hold=[(0.10, 0.36, 0.32, 0.52)], water=[(0.0, 0.70, 0.5, 1.0)], wl=0.62),
    'p3-reva':     dict(sky=0.26, water=[(0.2, 0.30, 0.8, 1.0)], wl=0.52),
    'p4-ujjain':   dict(sky=0.33, water=[], wl=0.6),
    'p5-ganga':    dict(sky=0.25, water=[(0.0, 0.50, 1.0, 1.0)], wl=0.58),
    'p6-himalaya': dict(sky=0.36, water=[(0.0, 0.42, 1.0, 1.0)], wl=0.74),
    'p7-alaka':    dict(sky=0.34, water=[], wl=0.70, inset=0.04),
}

def fit(im, inset=0.0):
    w, h = im.size
    if inset:
        im = im.crop((int(w * inset), int(h * inset), int(w * (1 - inset)), int(h * (1 - inset))))
        w, h = im.size
    target = W / H
    if w / h > target:
        nw = int(h * target); x0 = (w - nw) // 2
        im = im.crop((x0, 0, x0 + nw, h))
    else:
        nh = int(w / target); y0 = (h - nh) // 2
        im = im.crop((0, y0, w, y0 + nh))
    return im.resize((W, H), Image.LANCZOS)

for name, cfg in PLATES.items():
    im = fit(Image.open(os.path.join(ROOT, f'{name}.png')).convert('RGB'), cfg.get('inset', 0))
    im.save(f'{OUT}/{name}.webp', quality=86, method=6)
    a = np.asarray(im.resize((W // 2, H // 2), Image.LANCZOS)).astype(np.float32) / 255
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(-1), a.min(-1)
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    sat = np.where(mx > 0, (mx - mn) / (mx + 1e-5), 0)
    h_, w_ = lum.shape
    yy = np.linspace(0, 1, h_)[:, None] * np.ones((1, w_))
    xx = np.ones((h_, 1)) * np.linspace(0, 1, w_)[None, :]
    green = (g > r * 1.05) & (g > b * 0.95) & (sat > 0.22)
    skyish = (~green) & ((b >= r * 0.92) | (sat < 0.2) | (lum < 0.25))
    sky = skyish & (yy < cfg['sky'])
    sky = ndi.binary_opening(sky, iterations=2)
    lab, n = ndi.label(sky)
    top = set(np.unique(lab[: max(3, int(h_ * 0.06))])) - {0}
    sky = np.isin(lab, list(top))
    for x0, y0, x1, y1 in cfg.get('hold', []):
        sky &= ~((xx >= x0) & (xx <= x1) & (yy >= y0) & (yy <= y1))
    skyf = ndi.gaussian_filter(sky.astype(np.float32), 3) * np.clip((cfg['sky'] - yy) / 0.08, 0, 1)
    wbox = np.zeros_like(lum, dtype=bool)
    for x0, y0, x1, y1 in cfg['water']:
        wbox |= (xx >= x0) & (xx <= x1) & (yy >= y0) & (yy <= y1)
    water = wbox & (sat < 0.28) & (lum > cfg['wl'] - 0.25) & ~green
    water = ndi.binary_opening(water, iterations=1)
    waterf = ndi.gaussian_filter(water.astype(np.float32), 1.5)
    fol = green & (yy > cfg['sky'] * 0.6)
    folf = ndi.gaussian_filter(fol.astype(np.float32), 1.2)
    m = (np.clip(np.stack([skyf, waterf, folf], -1), 0, 1) * 255).astype(np.uint8)
    Image.fromarray(m).save(f'{OUT}/{name}-mask.webp', quality=90, method=6)
    Image.fromarray(m).save(os.path.join(ROOT, f'../shots/mask-{name}.png'))
    print(name, 'sky %.2f water %.3f fol %.3f' % (skyf.mean(), waterf.mean(), folf.mean()))

# border strip: find the dark band, keep it with its gold rules, make it tile
im = Image.open(os.path.join(ROOT, 'border-strip.png')).convert('RGB')
a = np.asarray(im).astype(np.float32) / 255
rowlum = a.mean(axis=(1, 2))
dark = np.where(rowlum < 0.45)[0]
y0, y1 = max(0, dark.min() - 1), min(a.shape[0], dark.max() + 2)
band = a[y0:y1, 30:-30].copy()
n = 60
wgt = np.linspace(0, 1, n)[None, :, None]
band[:, -n:] = band[:, -n:] * (1 - wgt) + band[:, :n] * wgt
band = band[:, :-n] if False else band
img = Image.fromarray((band * 255).astype(np.uint8))
bh = 548
img = img.resize((int(img.width * bh / img.height), bh), Image.LANCZOS)
os.makedirs(os.path.join(ROOT, '../web/public/folio'), exist_ok=True)
img.save(os.path.join(ROOT, '../web/public/folio/border.webp'), quality=86, method=6)
json.dump({'aspect': img.width / img.height}, open(os.path.join(ROOT, '../web/src/border.json'), 'w'))
print('border', img.size, 'rows', y0, y1)

# gallery
G = os.path.join(ROOT, '../web/public/gallery'); os.makedirs(G, exist_ok=True)
for f in ['cma-bhadon-barahmasa-kangra', 'cma-teej-swinging-marwar', 'met-setmalar-ragini-malwa', 'met-krishna-gopis-shelter-rain-jaipur', 'met-madhumadhavi-ragini-marwar']:
    g = Image.open(os.path.join(ROOT, f'../research/refs/{f}.jpg')).convert('RGB'); g.thumbnail((1000, 1000), Image.LANCZOS)
    g.save(f'{G}/{f}.webp', quality=84, method=6); print(f, g.size)
