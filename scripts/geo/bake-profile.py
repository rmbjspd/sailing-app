#!/usr/bin/env python3
"""
Bake the along-track lake / sea FLOOR under the keel used by Fig. 1A "The
staircase to the sea": lib/data/vizBathymetry.ts

Sources:
  - public/geo/terrain.png      bed elevation (m, relative to sea level) — lake and
                                sea floors from NOAA NCEI ETOPO 2022 (15" grid)
  - public/geo/water-level.png  water-surface elevation (m) of each water body
  - scripts/geo/waterways.py    canal / river channels burned into the mask: too
                                narrow for ETOPO to resolve a bed → no-data
  - lib/data/routePath.ts       the water-following track (bake-route.py)
  - lib/data/waypoints.ts       overnight stops, used to split the track into days

Output, per voyage day: [t (0..1 through the day's run), floor elevation in ft
relative to sea level | null]. The chart takes depth under the keel as its own
water surface (Great Lakes chart datum) minus this floor. water-level.png is only
used to reject pixels with no real bathymetry (bed ≈ surface: ETOPO carries no
floor for Lake St. Clair or Oneida Lake) and shoreline slivers; its lake levels
come from the median shore elevation and sit a few metres high, so they are not
used for the depth itself.
Run:  python3 scripts/geo/bake-profile.py      (needs pillow, numpy, scipy)
"""
import math, os, re, sys
import numpy as np
from PIL import Image
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
from waterways import rasterize  # noqa: E402

LNG_MIN, LNG_MAX, LAT_MIN, LAT_MAX = -89.0, -71.0, 40.0, 47.5  # lib/geo/projection.ts BBOX
FT = 3.28084
STEP_NM = 0.5      # sampling interval along the track
MIN_DEPTH_FT = 3   # anything shallower is a shoreline / harbour pixel artefact

img = np.asarray(Image.open(os.path.join(ROOT, "public/geo/terrain.png")).convert("RGBA")).astype(np.float64)
H, W = img.shape[:2]
bed = (img[..., 0] * 256 + img[..., 1]) / 4 - 1000
water = img[..., 2] > 127
level = np.asarray(Image.open(os.path.join(ROOT, "public/geo/water-level.png")).convert("L")).astype(np.float64)
assert level.shape == bed.shape, "water-level.png must match terrain.png"
# Same channel mask bake-water.py uses: canal/river pixels carry no real bed —
# except where the channel line crosses genuinely wide water (Lake St. Clair,
# Oneida Lake, the Tappan Zee), i.e. pixels at least 2 px inside the shoreline.
chan = ndimage.binary_dilation(np.asarray(rasterize(W, H, 1.8)) > 0, iterations=2)
wide = ndimage.binary_erosion(water, iterations=2)
open_water = water & (~chan | wide)


def floor_at(lng, lat):
    """Bed elevation (ft, vs sea level) at lng/lat: bilinear over the neighbours that are open
    water with real bathymetry; None if there aren't enough."""
    fx = (lng - LNG_MIN) / (LNG_MAX - LNG_MIN) * W - 0.5
    fy = (LAT_MAX - lat) / (LAT_MAX - LAT_MIN) * H - 0.5
    x0, y0 = int(math.floor(fx)), int(math.floor(fy))
    tx, ty = fx - x0, fy - y0
    acc = wsum = 0.0
    for dx, dy, w in ((0, 0, (1 - tx) * (1 - ty)), (1, 0, tx * (1 - ty)), (0, 1, (1 - tx) * ty), (1, 1, tx * ty)):
        x, y = min(max(x0 + dx, 0), W - 1), min(max(y0 + dy, 0), H - 1)
        if open_water[y, x] and w > 0 and (level[y, x] - bed[y, x]) * FT >= MIN_DEPTH_FT:
            acc += bed[y, x] * w
            wsum += w
    if wsum < 0.5:  # mostly land / channel / no-bathymetry around this point
        return None
    return round(acc / wsum * FT)


def hav_nm(a, b):
    R = 3440.065
    la1, la2 = math.radians(a[1]), math.radians(b[1])
    dla, dln = la2 - la1, math.radians(b[0] - a[0])
    h = math.sin(dla / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin(dln / 2) ** 2
    return 2 * R * math.asin(math.sqrt(h))


# ── Parse route segments + waypoints straight from the TS sources ────────────
route_src = open(os.path.join(ROOT, "lib/data/routePath.ts")).read()
segments = {}
for m in re.finditer(r'leg:\s*"([a-z-]+)",\s*inland:\s*\w+,\s*coords:\s*\[(.*?)\n\s*\],', route_src, re.S):
    pts = [(float(a), float(b)) for a, b in re.findall(r'\[\s*(-?[\d.]+),\s*(-?[\d.]+)\s*\]', m.group(2))]
    segments[m.group(1)] = pts
assert len(segments) == 8, f"expected 8 route legs, parsed {list(segments)}"

wp_src = open(os.path.join(ROOT, "lib/data/waypoints.ts")).read()
waypoints = [(float(lat), float(lng), int(day), leg) for lat, lng, day, leg in re.findall(
    r'lat:\s*(-?[\d.]+),\s*lng:\s*(-?[\d.]+),\s*day:\s*(\d+),\s*leg:\s*"([a-z-]+)"', wp_src)]
by_day = {d: (lng, lat) for lat, lng, d, _ in waypoints}

out = {}
for leg, pts in segments.items():
    dense = [pts[0]]
    for a, b in zip(pts, pts[1:]):
        n = max(1, int(math.ceil(hav_nm(a, b) / STEP_NM)))
        for i in range(1, n + 1):
            dense.append((a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n))
    cum = [0.0]
    for a, b in zip(dense, dense[1:]):
        cum.append(cum[-1] + hav_nm(a, b))
    nearest = lambda p: int(np.argmin([hav_nm(p, q) for q in dense]))  # noqa: E731
    for d in sorted(x for _, _, x, lg in waypoints if lg == leg):
        p = max([x for x in by_day if x < d], default=None)
        if p is None or by_day[p] == by_day[d]:
            continue  # layover
        i0, i1 = nearest(by_day[p]), nearest(by_day[d])
        if i1 <= i0:
            continue
        span = cum[i1] - cum[i0]
        out[d] = [(round((cum[i] - cum[i0]) / span, 4), floor_at(*dense[i])) for i in range(i0, i1 + 1)]

# Days with no resolvable bed at all (pure canal/river) are omitted.
out = {d: rows for d, rows in out.items() if any(v is not None for _, v in rows)}

lines = [
    "// AUTO-GENERATED by scripts/geo/bake-profile.py — do not edit by hand.",
    "// Lake / sea floor under the keel along the routePath.ts track, per voyage day:",
    "// bed elevation in ft relative to sea level (negative = below the sea), from",
    "// public/geo/terrain.png (NOAA NCEI ETOPO 2022 lake and sea floors).",
    "// t = 0..1 through the day's run; null = no data (canal / river channel too",
    "// narrow for ETOPO to resolve, a lake ETOPO carries no floor for, or a",
    f"// shoreline pixel). Sampled every {STEP_NM} nm.",
    "",
    "export const TRACK_FLOOR_FT: Record<number, [number, number | null][]> = {",
]
for d in sorted(out):
    body = ", ".join(f"[{t}, {'null' if v is None else v}]" for t, v in out[d])
    lines.append(f"  {d}: [{body}],")
lines += ["};", ""]
dst = os.path.join(ROOT, "lib/data/vizBathymetry.ts")
open(dst, "w").write("\n".join(lines))
for d in sorted(out):
    vs = [v for _, v in out[d] if v is not None]
    print(f"day {d:2d}: {len(out[d]):4d} samples, {len(vs):4d} with floor, lowest {min(vs):5d} ft, highest {max(vs):5d} ft")
print("wrote", dst, os.path.getsize(dst), "bytes")
