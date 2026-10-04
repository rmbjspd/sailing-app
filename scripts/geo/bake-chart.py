#!/usr/bin/env python3
"""
Bake public/geo/chart-dark.webp (+ chart-dark-sm.webp): a dark, hillshaded
"night chart" raster of the voyage region, derived from public/geo/terrain.png.
Same equirectangular frame as lib/geo/projection.ts, so SVG overlays line up:
  x = (lng - lngMin) / (lngMax - lngMin) * W,  y = (latMax - lat) / (latMax - latMin) * H
Used for 2D mini-maps, the itinerary chart, and the no-WebGL fallback.
Run after bake-terrain.py:  python3 scripts/geo/bake-chart.py
"""
import os
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
a = np.asarray(Image.open(os.path.join(ROOT, "public/geo/terrain.png")), dtype=np.float32)
elev = (a[..., 0] * 256 + a[..., 1]) / 4 - 1000
water = a[..., 2] / 255.0
H, W = elev.shape

# Hillshade (sun from NW, 35° altitude), vertical exaggeration for drama
z = elev * 0.02
gy, gx = np.gradient(z)
slope = np.pi / 2 - np.arctan(np.hypot(gx, gy))
aspect = np.arctan2(-gx, gy)
az, alt = np.radians(315), np.radians(35)
shade = np.sin(alt) * np.sin(slope) + np.cos(alt) * np.cos(slope) * np.cos(az - aspect)
shade = np.clip(shade, 0, 1)

# Land: deep slate tinted by elevation, lit by hillshade
t = np.clip(elev / 1400, 0, 1)[..., None]
land_lo = np.array([22, 30, 44]); land_hi = np.array([58, 66, 82])
land = land_lo * (1 - t) + land_hi * t
land = land * (0.35 + 1.0 * shade[..., None])

# Water: near-black navy, slightly lighter in shallows (bathymetry relative to local surface)
surface = np.where(elev < 100, 0, 176)  # ocean vs great lakes (approx surface m)
depth = np.clip((surface - elev) / 250, 0, 1)[..., None]
sea_shallow = np.array([8, 22, 40]); sea_deep = np.array([2, 6, 14])
sea = sea_shallow * (1 - depth) + sea_deep * depth

w = water[..., None]
rgb = land * (1 - w) + sea * w

# Shoreline glow: edge of the water mask, blurred, in bioluminescent cyan
m = Image.fromarray((water * 255).astype(np.uint8))
edge = np.asarray(m.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(1.2)), dtype=np.float32) / 255
rgb = rgb + edge[..., None] * np.array([70, 200, 185]) * 0.75

img = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8))
out = os.path.join(ROOT, "public/geo")
img.save(os.path.join(out, "chart-dark.webp"), quality=88, method=6)
img.resize((W // 2, H // 2), Image.LANCZOS).save(os.path.join(out, "chart-dark-sm.webp"), quality=85, method=6)
print("wrote chart-dark.webp", W, H)

# ── Day chart: khaki chart paper, powder-blue water ──────────────────────────
lvl = np.asarray(Image.open(os.path.join(ROOT, "public/geo/water-level.png")), dtype=np.float32)
depth_m = np.clip(lvl - elev, 0, 400)
t = np.clip(elev / 1400, 0, 1)[..., None]
land_lo = np.array([236, 228, 207]); land_hi = np.array([205, 190, 156])
dland = land_lo * (1 - t) + land_hi * t
dland = dland * (0.72 + 0.36 * shade[..., None])
dn = np.clip(depth_m / 220, 0, 1)[..., None] ** 0.6
sea_sh = np.array([196, 222, 236]); sea_dp = np.array([128, 172, 204])
dsea = sea_sh * (1 - dn) + sea_dp * dn
# faint isobaths every 25 m where depth is real
iso = (np.abs(((depth_m + 12.5) % 25) - 12.5) < 0.9) & (depth_m > 6)
dsea = np.where(iso[..., None], dsea * 0.93, dsea)
day = dland * (1 - w) + dsea * w
day = day * (1 - edge[..., None] * 0.55) + np.array([52, 96, 128]) * edge[..., None] * 0.55
dimg = Image.fromarray(np.clip(day, 0, 255).astype(np.uint8))
dimg.save(os.path.join(out, "chart-day.webp"), quality=88, method=6)
dimg.resize((W // 2, H // 2), Image.LANCZOS).save(os.path.join(out, "chart-day-sm.webp"), quality=85, method=6)
print("wrote chart-day.webp", W, H)
