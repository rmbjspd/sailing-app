#!/usr/bin/env python3
"""Audit lib/data/routePath.ts against the water mask: report every run of the
route that crosses land, per leg, and write a diagnostic image to .geo-cache/."""
import json, os, re, sys, math
import numpy as np
from PIL import Image, ImageDraw
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LNG_MIN, LNG_MAX, LAT_MIN, LAT_MAX = -89.0, -71.0, 40.0, 47.5

def load_route(path):
    src = open(path).read()
    legs = []
    for m in re.finditer(r'leg:\s*"([a-z-]+)",\s*inland:\s*(true|false),\s*coords:\s*\[(.*?)\n\s*\],', src, re.S):
        pts = [(float(a), float(b)) for a, b in re.findall(r'\[\s*(-?[\d.]+),\s*(-?[\d.]+)\s*\]', m.group(3))]
        legs.append((m.group(1), m.group(2) == "true", pts))
    return legs

a = np.asarray(Image.open(os.path.join(ROOT, "public/geo/terrain.png")))
water = a[..., 2].astype(np.float32) / 255
H, W = water.shape
def px(lng, lat): return (lng - LNG_MIN) / (LNG_MAX - LNG_MIN) * W, (LAT_MAX - lat) / (LAT_MAX - LAT_MIN) * H
def wat(lng, lat):
    # bilinear, like the shader samples it
    x, y = px(lng, lat); x -= 0.5; y -= 0.5
    x0, y0 = int(np.floor(x)), int(np.floor(y)); fx, fy = x - x0, y - y0
    x0 = min(max(x0, 0), W - 2); y0 = min(max(y0, 0), H - 2)
    return (water[y0, x0] * (1 - fx) * (1 - fy) + water[y0, x0 + 1] * fx * (1 - fy)
            + water[y0 + 1, x0] * (1 - fx) * fy + water[y0 + 1, x0 + 1] * fx * fy)

route_file = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "lib/data/routePath.ts")
legs = load_route(route_file)
total_land = 0.0
for leg, inland, pts in legs:
    runs = []; cur = None; land_nm = 0.0; tot = 0.0
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        seg = math.hypot((x1 - x0) * math.cos(math.radians(43.75)), y1 - y0) * 60
        n = max(2, int(seg / 0.2))
        for k in range(n):
            t = k / n; lng = x0 + (x1 - x0) * t; lat = y0 + (y1 - y0) * t
            step = seg / n; tot += step
            if wat(lng, lat) < 0.35:
                land_nm += step
                if cur is None: cur = [lng, lat, 0.0]
                cur[2] += step
            elif cur is not None:
                runs.append(cur); cur = None
    if cur: runs.append(cur)
    big = [r for r in runs if r[2] > 0.6]
    total_land += land_nm
    print(f"{leg:16s} inland={inland!s:5s} {tot:6.0f} nm  over land {land_nm:5.1f} nm  ({len(big)} runs >0.6nm)")
    for r in sorted(big, key=lambda r: -r[2])[:8]:
        print(f"    {r[2]:5.1f} nm starting near ({r[1]:.3f}, {r[0]:.3f})")
print(f"TOTAL over land: {total_land:.1f} nm")

# diagnostic image
img = Image.fromarray(np.stack([water * 60 + 20, water * 90 + 25, water * 140 + 35], -1).astype(np.uint8)).convert("RGB")
d = ImageDraw.Draw(img)
for leg, inland, pts in legs:
    xy = [px(*p) for p in pts]
    d.line(xy, fill=(255, 180, 60) if inland else (255, 255, 255), width=2)
    for x, y in xy: d.ellipse((x - 2, y - 2, x + 2, y + 2), fill=(255, 80, 80))
img.save(os.path.join(ROOT, ".geo-cache/route-audit.png"))
