#!/usr/bin/env python3
"""
Generate lib/data/routePath.ts: a water-following track of the voyage.

For each overnight passage (consecutive waypoints in lib/data/waypoints.ts) we
find the least-cost path through navigable water on the same grid as
public/geo/terrain.png — Natural Earth lakes/coast plus the canal and river
channels in waterways.py — with a cost that rises close to shore, so open-water
legs keep a sensible couple of miles off rather than scraping the beach. The
pixel path is smoothed, simplified and re-verified to stay in water.

Run after bake-terrain.py:  python3 scripts/geo/bake-route.py   (needs scikit-image, scipy)
"""
import math, os, re, sys
import numpy as np
from PIL import Image
from scipy import ndimage
from skimage.graph import MCP_Geometric

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from waterways import rasterize  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LNG_MIN, LNG_MAX, LAT_MIN, LAT_MAX = -89.0, -71.0, 40.0, 47.5
INLAND = {"st-clair", "erie-canal", "hudson"}
LEG_ORDER = ["lake-michigan", "north-channel", "lake-huron", "st-clair", "lake-erie", "erie-canal", "hudson", "sound-saybrook"]

# Extra waypoints for passages where the cheapest water path isn't the one sailed.
VIA = {
    # Mackinac → Drummond: through the Les Cheneaux / De Tour Passage, not round Bois Blanc's south side
    "drummond-island": [(-84.35, 45.93), (-83.92, 45.975)],
}

a = np.asarray(Image.open(os.path.join(ROOT, "public/geo/terrain.png")))
H, W = a.shape[:2]
water = a[..., 2] > 127
chan = np.asarray(rasterize(W, H, 3.0)) > 0
# The visible channel (as burned into terrain.png) — the path should ride it.
centre = np.asarray(rasterize(W, H, 1.8, ss=3).resize((W, H), Image.LANCZOS)) > 110
nav = water | chan
dist = ndimage.distance_transform_edt(nav)  # px to nearest land
# Base cost 1; strong penalty within ~3 px (≈2 km) of shore on open water.
cost = 1.0 + 7.0 * np.exp(-(dist - 1.0) / 2.2)
cost[chan & ~water] = 5.0           # channel margin: only to bridge gaps
cost[centre & ~water] = 1.3         # channel centreline: the way through
cost[~nav] = np.inf
# What the reader sees as water (terrain.png mask incl. burned channels):
# smoothing and simplification must keep the line inside it.
visible = water | centre
Bf = a[..., 2].astype(np.float32)

def vis_at(r, c):
    """Bilinear water-mask value at continuous (row, col), pixel centres at +0.5 — as the shader samples it."""
    y, x = r - 0.5, c - 0.5
    y0, x0 = int(np.floor(y)), int(np.floor(x))
    y0 = min(max(y0, 0), H - 2); x0 = min(max(x0, 0), W - 2)
    fy, fx = y - y0, x - x0
    return (Bf[y0, x0] * (1 - fx) * (1 - fy) + Bf[y0, x0 + 1] * fx * (1 - fy)
            + Bf[y0 + 1, x0] * (1 - fx) * fy + Bf[y0 + 1, x0 + 1] * fx * fy) / 255

def centre_on_water(pix):
    """Continuous coords for a pixel path. In narrow water (channels, river mouths)
    each point moves to the intensity-weighted centre of the visible water around it."""
    out = []
    for r, c in pix:
        if dist[r, c] > 4:
            out.append((r + 0.5, c + 0.5)); continue
        r0, r1, c0, c1 = max(r - 2, 0), min(r + 3, H), max(c - 2, 0), min(c + 3, W)
        w = Bf[r0:r1, c0:c1] ** 2
        if w.sum() <= 0:
            out.append((r + 0.5, c + 0.5)); continue
        ys, xs = np.mgrid[r0:r1, c0:c1]
        out.append((float((w * (ys + 0.5)).sum() / w.sum()), float((w * (xs + 0.5)).sum() / w.sum())))
    return out

def to_px(lng, lat):
    return (LAT_MAX - lat) / (LAT_MAX - LAT_MIN) * H, (lng - LNG_MIN) / (LNG_MAX - LNG_MIN) * W

def to_ll(r, c):
    """continuous (row, col) — pixel j spans [j, j+1) — to lng/lat"""
    return LNG_MIN + c / W * (LNG_MAX - LNG_MIN), LAT_MAX - r / H * (LAT_MAX - LAT_MIN)

def snap(lng, lat, radius=14):
    r, c = (int(v) for v in to_px(lng, lat))
    if nav[r, c]:
        return r, c
    r0, c0 = max(r - radius, 0), max(c - radius, 0)
    sub = nav[r0:r + radius + 1, c0:c + radius + 1]
    ys, xs = np.nonzero(sub)
    if not len(ys):
        raise SystemExit(f"no water within {radius}px of {lng},{lat}")
    k = np.argmin((ys + r0 - r) ** 2 + (xs + c0 - c) ** 2)
    return int(ys[k] + r0), int(xs[k] + c0)

def path(a_px, b_px):
    m = MCP_Geometric(cost, fully_connected=True)
    m.find_costs([a_px], [b_px])
    return m.traceback(b_px)

def smooth(pts, win):
    """Moving average that is only accepted where the smoothed point stays in water."""
    p = np.array(pts, dtype=float)
    if len(p) < 3:
        return p
    out = p.copy()
    for i in range(1, len(p) - 1):
        lo, hi = max(0, i - win), min(len(p), i + win + 1)
        q = p[lo:hi].mean(0)
        if vis_at(*q) >= 0.45 or vis_at(*q) >= vis_at(*p[i]):
            out[i] = q
    return out

def rdp(p, eps):
    if len(p) < 3:
        return p
    a_, b_ = p[0], p[-1]
    ab = b_ - a_
    n = np.hypot(*ab) or 1e-9
    d = np.abs(ab[0] * (p[:, 1] - a_[1]) - ab[1] * (p[:, 0] - a_[0])) / n
    i = int(np.argmax(d))
    if d[i] > eps:
        return np.vstack([rdp(p[: i + 1], eps)[:-1], rdp(p[i:], eps)])
    return np.vstack([a_, b_])

def seg_ok(p, q):
    n = int(max(abs(q[0] - p[0]), abs(q[1] - p[1])) * 2) + 2
    for t in np.linspace(0, 1, n):
        r, c = p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t
        if vis_at(r, c) < 0.4:
            return False
    return True

def simplify_safe(p, eps):
    """RDP, but never let a simplified chord cut across land."""
    s = rdp(p, eps)
    out = [s[0]]
    idx = {tuple(v): i for i, v in enumerate(map(tuple, p))}
    for q in s[1:]:
        prev = out[-1]
        if seg_ok(prev, q):
            out.append(q)
        else:  # fall back to the dense points between them
            i0, i1 = idx[tuple(prev)], idx[tuple(q)]
            out.extend(p[i0 + 1:i1 + 1])
    return np.array(out)

# ── Waypoints in day order ───────────────────────────────────────────────────
src = open(os.path.join(ROOT, "lib/data/waypoints.ts")).read()
wps = []
for m in re.finditer(r'\{ id: "([^"]+)", name: "([^"]+)".*?lat: (-?[\d.]+), lng: (-?[\d.]+), day: (\d+), leg: "([a-z-]+)"', src):
    wps.append(dict(id=m.group(1), name=m.group(2), lat=float(m.group(3)), lng=float(m.group(4)), day=int(m.group(5)), leg=m.group(6)))
wps.sort(key=lambda w: w["day"])

legs = {k: [] for k in LEG_ORDER}
for prev, w in zip(wps, wps[1:]):
    stops = [(prev["lng"], prev["lat"])] + VIA.get(w["id"], []) + [(w["lng"], w["lat"])]
    pix = []
    for (l0, a0), (l1, a1) in zip(stops, stops[1:]):
        seg = path(snap(l0, a0), snap(l1, a1))
        pix.extend(seg if not pix else seg[1:])
    sm = smooth(centre_on_water(pix), 3)
    sm = smooth(sm, 2)
    simp = simplify_safe(sm, 0.45)
    ll = [to_ll(r, c) for r, c in simp]
    nm = sum(math.hypot((b[0] - a_[0]) * math.cos(math.radians(43.75)), b[1] - a_[1]) * 60 for a_, b in zip(ll, ll[1:]))
    print(f"day {w['day']:2d} {prev['name'][:22]:22s} → {w['name'][:24]:24s} {nm:6.1f} nm  {len(ll):4d} pts", file=sys.stderr)
    seg_pts = legs[w["leg"]]
    legs[w["leg"]] = seg_pts + (ll if not seg_pts else ll[1:])

# ── Emit TypeScript ──────────────────────────────────────────────────────────
def fmt(pts):
    rows, row = [], []
    for lng, lat in pts:
        row.append(f"[{lng:.4f}, {lat:.4f}]")
        if len(row) == 6:
            rows.append("      " + ", ".join(row) + ","); row = []
    if row:
        rows.append("      " + ", ".join(row) + ",")
    return "\n".join(rows)

out = ['''/**
 * Water-following track of the S/V Sabbatical voyage, Chicago → Old Saybrook.
 *
 * GENERATED by scripts/geo/bake-route.py — do not edit by hand. Each overnight
 * passage (lib/data/waypoints.ts) is a least-cost path through navigable water
 * (Natural Earth coast + lakes, plus the canal and river channels in
 * scripts/geo/waterways.py), kept a mile or two off the beach on open water,
 * then smoothed and simplified with every chord re-checked to stay in water.
 *
 * Each coordinate is [longitude, latitude] in WGS-84. Organised by leg so inland
 * legs (canal/river) can be styled distinctly.
 */

export type RouteLeg =
  | "lake-michigan"
  | "north-channel"
  | "lake-huron"
  | "st-clair"
  | "lake-erie"
  | "erie-canal"
  | "hudson"
  | "sound-saybrook";

export interface RouteSegment {
  leg: RouteLeg;
  /** true = inland canal / river (styled differently from open water) */
  inland: boolean;
  /** ordered [lng, lat] pairs */
  coords: [number, number][];
}

export const routeSegments: RouteSegment[] = [''']
for i, leg in enumerate(LEG_ORDER):
    pts = legs[leg]
    if i > 0 and legs[LEG_ORDER[i - 1]]:  # share the joining point with the previous leg
        pts = [legs[LEG_ORDER[i - 1]][-1]] + pts
    out.append(f"  {{\n    leg: \"{leg}\",\n    inland: {'true' if leg in INLAND else 'false'},\n    coords: [\n{fmt(pts)}\n    ],\n  }},")
out.append('''];

/**
 * All route coordinates as a single flat array [lng, lat] for GeoJSON LineString use.
 * Segments share their endpoint with the next segment's start, so we de-duplicate.
 */
export const fullRoutePath: [number, number][] = routeSegments.flatMap(
  (seg, i) => (i === 0 ? seg.coords : seg.coords.slice(1))
);
''')
open(os.path.join(ROOT, "lib/data/routePath.ts"), "w").write("\n".join(out))
print("wrote lib/data/routePath.ts", file=sys.stderr)
