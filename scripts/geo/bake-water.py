#!/usr/bin/env python3
"""
Bake public/geo/water-level.png — the water SURFACE elevation (metres, 0–255,
8-bit grayscale) for every water body in terrain.png, so the 3D world can float
each lake at its true level (Superior ≈183 m, Michigan–Huron ≈176, Erie ≈174,
Ontario ≈75, the Atlantic 0) while terrain.png keeps the real lake-floor
bathymetry underneath. Values are spread into adjacent land (nearest water
body) so bilinear sampling is clean along shorelines.

Method: label connected water regions; a region's surface = median elevation of
the land ring just outside it (shores sit a few metres above the water), with
regions touching the open Atlantic forced to 0.
Run after bake-terrain.py:  python3 scripts/geo/bake-water.py   (needs scipy)
"""
import os
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
a = np.asarray(Image.open(os.path.join(ROOT, "public/geo/terrain.png")), dtype=np.float32)
elev = (a[..., 0] * 256 + a[..., 1]) / 4 - 1000
water = a[..., 2] > 127
H, W = water.shape

labels, n = ndimage.label(water)
surface = np.zeros_like(elev)
sizes = ndimage.sum(water, labels, range(1, n + 1))
for i in range(1, n + 1):
    region = labels == i
    if sizes[i - 1] < 4:
        continue
    ys, xs = np.nonzero(region)
    y0, y1, x0, x1 = max(ys.min() - 4, 0), min(ys.max() + 5, H), max(xs.min() - 4, 0), min(xs.max() + 5, W)
    sub = region[y0:y1, x0:x1]
    ring = ndimage.binary_dilation(sub, iterations=3) & ~sub & ~water[y0:y1, x0:x1]
    shore = elev[y0:y1, x0:x1][ring]
    lvl = float(np.percentile(shore, 25)) if shore.size else 0.0
    # Open ocean: big region with deep bathymetry well below sea level near the SE edge.
    if region[H - 1, W - 1] or (elev[region].min() < -40 and lvl < 30):
        lvl = 0.0
    surface[region] = max(lvl, 0.0)
    if sizes[i - 1] > 5000:
        cy, cx = int(ys.mean()), int(xs.mean())
        lng = -89 + cx / W * 18; lat = 47.5 - cy / H * 7.5
        print(f"region {i:4d} size {int(sizes[i-1]):7d} centre ({lng:.1f},{lat:.1f}) surface {lvl:6.1f} m  floor {elev[region].min():.0f} m")

# Spread each water level into the land (nearest water pixel) for clean filtering.
_, (iy, ix) = ndimage.distance_transform_edt(~water, return_indices=True)
spread = surface[iy, ix]
Image.fromarray(np.clip(np.round(spread), 0, 255).astype(np.uint8), "L").save(
    os.path.join(ROOT, "public/geo/water-level.png"), optimize=True)
print("wrote public/geo/water-level.png")
