#!/usr/bin/env python3
"""
Bake the 3D voyage terrain texture: public/geo/terrain.png

Sources (public domain / open):
  - Elevation + bathymetry: AWS Terrain Tiles (Terrarium encoding), zoom 8.
    https://registry.opendata.aws/terrain-tiles/
  - Coastlines + lakes: Natural Earth 10m land / lakes (public domain).

Output: an equirectangular grid covering BBOX (lng/lat linear), RGBA:
  R,G = elevation in metres, encoded  v = round((elev + 1000) * 4)  as 16-bit big-endian
  B   = water mask (0 = land, 255 = water), anti-aliased
  A   = 255
Run:  python3 scripts/geo/bake-terrain.py   (needs pillow, numpy; caches downloads in ./.geo-cache)
"""
import io, json, math, os, sys, urllib.request
import numpy as np
from PIL import Image, ImageDraw

# Keep in sync with lib/geo/projection.ts
LNG_MIN, LNG_MAX = -89.0, -71.0
LAT_MIN, LAT_MAX = 40.0, 47.5
OUT_W = 2048
LAT0 = (LAT_MIN + LAT_MAX) / 2
OUT_H = round(OUT_W * (LAT_MAX - LAT_MIN) / ((LNG_MAX - LNG_MIN) * math.cos(math.radians(LAT0))))
Z = 8
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CACHE = os.path.join(ROOT, ".geo-cache")
os.makedirs(CACHE, exist_ok=True)

def fetch(url, name):
    p = os.path.join(CACHE, name)
    if not os.path.exists(p):
        print("fetch", url, file=sys.stderr)
        with urllib.request.urlopen(url) as r, open(p, "wb") as f:
            f.write(r.read())
    return p

def tile_xy(lng, lat, z):
    n = 2 ** z
    x = (lng + 180) / 360 * n
    y = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n
    return x, y

# ── 1. Elevation mosaic (web mercator) ──────────────────────────────────────
x0, y0 = tile_xy(LNG_MIN, LAT_MAX, Z)
x1, y1 = tile_xy(LNG_MAX, LAT_MIN, Z)
tx0, ty0, tx1, ty1 = int(x0), int(y0), int(x1), int(y1)
mosaic = np.zeros(((ty1 - ty0 + 1) * 256, (tx1 - tx0 + 1) * 256), dtype=np.float32)
for ty in range(ty0, ty1 + 1):
    for tx in range(tx0, tx1 + 1):
        p = fetch(f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{Z}/{tx}/{ty}.png", f"t{Z}_{tx}_{ty}.png")
        a = np.asarray(Image.open(p).convert("RGB"), dtype=np.float32)
        e = a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
        mosaic[(ty - ty0) * 256:(ty - ty0 + 1) * 256, (tx - tx0) * 256:(tx - tx0 + 1) * 256] = e

# Resample mosaic onto the equirectangular output grid (bilinear).
lngs = LNG_MIN + (np.arange(OUT_W) + 0.5) / OUT_W * (LNG_MAX - LNG_MIN)
lats = LAT_MAX - (np.arange(OUT_H) + 0.5) / OUT_H * (LAT_MAX - LAT_MIN)
n = 2 ** Z
px = ((lngs + 180) / 360 * n - tx0) * 256 - 0.5
lr = np.radians(lats)
py = ((1 - np.log(np.tan(lr) + 1 / np.cos(lr)) / math.pi) / 2 * n - ty0) * 256 - 0.5
PX, PY = np.meshgrid(px, py)
ix, iy = np.floor(PX).astype(int), np.floor(PY).astype(int)
fx, fy = PX - ix, PY - iy
H, W = mosaic.shape
ix0, iy0 = np.clip(ix, 0, W - 1), np.clip(iy, 0, H - 1)
ix1, iy1 = np.clip(ix + 1, 0, W - 1), np.clip(iy + 1, 0, H - 1)
elev = (mosaic[iy0, ix0] * (1 - fx) * (1 - fy) + mosaic[iy0, ix1] * fx * (1 - fy)
        + mosaic[iy1, ix0] * (1 - fx) * fy + mosaic[iy1, ix1] * fx * fy)

# ── 2. Water mask from Natural Earth (rasterised at 3x for anti-aliasing) ──
SS = 3
def to_px(lng, lat):
    return ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN) * OUT_W * SS,
            (LAT_MAX - lat) / (LAT_MAX - LAT_MIN) * OUT_H * SS)

def draw_geojson(draw, path, fill):
    gj = json.load(open(path))
    for f in gj["features"]:
        g = f["geometry"]
        polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        for poly in polys:
            for ri, ring in enumerate(poly):
                xs = [c[0] for c in ring]; ys = [c[1] for c in ring]
                if max(xs) < LNG_MIN - 1 or min(xs) > LNG_MAX + 1 or max(ys) < LAT_MIN - 1 or min(ys) > LAT_MAX + 1:
                    continue
                pts = [to_px(x, y) for x, y in ring]
                draw.polygon(pts, fill=fill if ri == 0 else (255 - fill))

NE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/"
land = fetch(NE + "ne_10m_land.geojson", "ne_10m_land.geojson")
lakes = fetch(NE + "ne_10m_lakes.geojson", "ne_10m_lakes.geojson")
mask = Image.new("L", (OUT_W * SS, OUT_H * SS), 255)  # start as water
d = ImageDraw.Draw(mask)
draw_geojson(d, land, 0)     # land
draw_geojson(d, lakes, 255)  # lakes back to water
mask = mask.resize((OUT_W, OUT_H), Image.LANCZOS)
# Soften the edge over ~2 px so the 0.5 iso-contour of the bilinearly-sampled
# mask (the rendered shoreline) is smooth instead of stair-stepped.
from PIL import ImageFilter
mask = mask.filter(ImageFilter.GaussianBlur(1.1))
water = np.asarray(mask, dtype=np.float32)

# Land pixels below 0 m (DEM noise along coasts) clamp to 1 m; keep bathymetry under water.
elev = np.where(water < 128, np.maximum(elev, 1.0), elev)

v = np.clip(np.round((elev + 1000) * 4), 0, 65535).astype(np.uint32)
out = np.zeros((OUT_H, OUT_W, 4), dtype=np.uint8)
out[..., 0] = (v >> 8) & 255
out[..., 1] = v & 255
out[..., 2] = water.astype(np.uint8)
out[..., 3] = 255
os.makedirs(os.path.join(ROOT, "public/geo"), exist_ok=True)
Image.fromarray(out, "RGBA").save(os.path.join(ROOT, "public/geo/terrain.png"), optimize=True)
print(f"wrote public/geo/terrain.png {OUT_W}x{OUT_H}  elev range {elev.min():.0f}..{elev.max():.0f} m", file=sys.stderr)

# Debug preview (hillshade-ish) to scratch for eyeballing
prev = np.clip((elev + 400) / 2000 * 255, 0, 255).astype(np.uint8)
rgb = np.stack([prev, prev, np.maximum(prev, (water > 128) * 160).astype(np.uint8)], -1)
Image.fromarray(rgb).save(os.path.join(CACHE, "preview.png"))
