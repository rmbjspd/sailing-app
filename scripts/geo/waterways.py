"""
Navigable channels too narrow for the Natural Earth 10m coastline/lake mask
(~700 m per pixel): the Erie Canal, the rivers it follows, and the river
passages on the route. Shared by bake-terrain.py (burned into the water mask so
they render as water) and bake-route.py (so the route can be pathfound through
them).

Primary source: OpenStreetMap (ODbL, (c) OpenStreetMap contributors), fetched
from the OSM API as whole waterway relations/ways — the New York State Canal
System's Erie Canal relation (including the Seneca, Oneida and Mohawk river
sections it follows), the St. Clair, Detroit, upper Niagara and Hudson rivers,
the Black Rock Channel and the East River. The only hand-traced piece is the
~3 km Little Current channel, which OSM maps as a strait point.

Fallback (if the OSM API is unreachable and nothing is cached): Natural Earth
10m rivers + a few hand-traced connectors.
"""
import json, os, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CACHE = os.path.join(ROOT, ".geo-cache")
NE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/"

# (file, feature name, optional lng/lat clip box)
NE_LINES = [
    ("ne_10m_rivers_north_america.geojson", "Erie Canal", None),
    ("ne_10m_rivers_north_america.geojson", "Oneida River - Erie Canal", None),
    ("ne_10m_rivers_lake_centerlines.geojson", "Mohawk", (-75.6, -73.6, 42.7, 43.25)),
    ("ne_10m_rivers_lake_centerlines.geojson", "Hudson", (-74.2, -73.5, 41.2, 42.85)),
    ("ne_10m_rivers_lake_centerlines.geojson", "St. Clair", None),
]

# Hand-traced connectors, [lng, lat]
HAND = {
    "Detroit River": [
        (-82.93, 42.355), (-82.965, 42.345), (-82.99, 42.335), (-83.03, 42.322), (-83.06, 42.31),
        (-83.095, 42.285), (-83.115, 42.255), (-83.13, 42.21), (-83.135, 42.17), (-83.13, 42.12),
        (-83.125, 42.07), (-83.12, 42.03),
    ],
    "Black Rock Channel / upper Niagara": [
        (-78.885, 42.872), (-78.898, 42.895), (-78.905, 42.915), (-78.906, 42.935), (-78.912, 42.955),
        (-78.918, 42.975), (-78.915, 42.995), (-78.90, 43.012), (-78.885, 43.022),
    ],
    "Little Current channel": [(-81.975, 45.97), (-81.95, 45.975), (-81.925, 45.979), (-81.895, 45.983)],
    "Seneca River (Erie Canal)": [
        (-76.74, 43.03), (-76.70, 43.035), (-76.64, 43.055), (-76.58, 43.07), (-76.52, 43.09),
        (-76.48, 43.115), (-76.44, 43.125), (-76.40, 43.135), (-76.36, 43.15), (-76.333, 43.158),
        (-76.30, 43.175), (-76.28, 43.19),
    ],
    "Lower Hudson": [
        (-73.95, 41.31), (-73.955, 41.26), (-73.94, 41.21), (-73.915, 41.17), (-73.89, 41.10),
        (-73.90, 41.05), (-73.92, 40.98), (-73.94, 40.90), (-73.955, 40.85), (-73.985, 40.80),
        (-74.01, 40.76), (-74.02, 40.72), (-74.025, 40.70),
    ],
    "East River": [
        (-74.015, 40.700), (-73.998, 40.705), (-73.975, 40.708), (-73.968, 40.718), (-73.965, 40.74),
        (-73.960, 40.752), (-73.947, 40.765), (-73.933, 40.775), (-73.92, 40.783), (-73.90, 40.790),
        (-73.87, 40.795), (-73.84, 40.800), (-73.81, 40.805), (-73.79, 40.808), (-73.77, 40.81),
    ],
}


def _fetch(name):
    os.makedirs(CACHE, exist_ok=True)
    p = os.path.join(CACHE, name)
    if not os.path.exists(p):
        with urllib.request.urlopen(NE + name) as r, open(p, "wb") as f:
            f.write(r.read())
    return p


# (label, OSM element type, id, optional lng/lat clip box)
OSM = [
    ("Erie Canal (NYS Canal System)", "relation", 1823647, None),
    ("St. Clair River", "relation", 4229869, None),
    ("Detroit River", "relation", 7730524, None),
    ("Upper Niagara River", "relation", 2245991, (-79.2, -78.8, 42.8, 43.04)),
    ("Black Rock Channel", "way", 164030656, None),
    ("Black Rock Channel", "way", 164030655, None),
    ("Hudson River", "relation", 2148192, (-74.3, -73.5, 40.66, 42.82)),
    ("East River", "relation", 5912630, None),
]
OSM_API = "https://api.openstreetmap.org/api/0.6/"
HAND_ALWAYS = ["Little Current channel"]


def _osm_lines():
    out = []
    for label, kind, oid, clip in OSM:
        p = os.path.join(CACHE, f"osm-{kind}-{oid}.json")
        if not os.path.exists(p):
            req = urllib.request.Request(f"{OSM_API}{kind}/{oid}/full.json",
                                         headers={"User-Agent": "sailing-app-bake/1.0"})
            with urllib.request.urlopen(req, timeout=300) as r, open(p, "wb") as f:
                f.write(r.read())
        els = json.load(open(p))["elements"]
        nodes = {e["id"]: (e["lon"], e["lat"]) for e in els if e["type"] == "node"}
        for w in (e for e in els if e["type"] == "way"):
            pts = [nodes[n] for n in w["nodes"] if n in nodes]
            if clip:
                pts = [q for q in pts if clip[0] <= q[0] <= clip[1] and clip[2] <= q[1] <= clip[3]]
            if len(pts) >= 2:
                out.append((label, pts))
    return out


def channel_lines():
    """List of (name, [(lng, lat), ...]) polylines."""
    try:
        lines = _osm_lines()
        return lines + [(n, list(HAND[n])) for n in HAND_ALWAYS]
    except Exception as e:  # offline: fall back to Natural Earth + hand connectors
        print(f"waterways: OSM unavailable ({e}); using Natural Earth fallback")
    out = []
    for fname, feat, clip in NE_LINES:
        gj = json.load(open(_fetch(fname)))
        for ft in gj["features"]:
            g = ft["geometry"]
            if not g or ft["properties"].get("name") != feat:
                continue
            lines = g["coordinates"] if g["type"] == "MultiLineString" else [g["coordinates"]]
            for line in lines:
                pts = [(p[0], p[1]) for p in line]
                if clip:
                    pts = [p for p in pts if clip[0] <= p[0] <= clip[1] and clip[2] <= p[1] <= clip[3]]
                if len(pts) >= 2 and all(-89 <= p[0] <= -71 and 40 <= p[1] <= 47.5 for p in pts[:1]):
                    out.append((feat, pts))
    # Hand connectors: extend each end to the nearest vertex of the Natural
    # Earth lines (within ~5 km) so there's no gap at the junctions.
    ne_pts = [p for _, line in out for p in line]
    for name, pts in HAND.items():
        pts = list(pts)
        for end in (0, -1):
            x, y = pts[end]
            best = min(ne_pts, key=lambda q: (q[0] - x) ** 2 + (q[1] - y) ** 2, default=None)
            if best and (best[0] - x) ** 2 + (best[1] - y) ** 2 < 0.05 ** 2:
                if end == 0:
                    pts.insert(0, best)
                else:
                    pts.append(best)
        out.append((name, pts))
    return out


def rasterize(W, H, width_px, ss=1, bbox=(-89.0, -71.0, 40.0, 47.5)):
    """Draw all channels into an 'L' image of size (W*ss, H*ss)."""
    from PIL import Image, ImageDraw
    lng0, lng1, lat0, lat1 = bbox
    img = Image.new("L", (W * ss, H * ss), 0)
    d = ImageDraw.Draw(img)
    w = max(1, round(width_px * ss))
    for _, pts in channel_lines():
        xy = [((x - lng0) / (lng1 - lng0) * W * ss, (lat1 - y) / (lat1 - lat0) * H * ss) for x, y in pts]
        d.line(xy, fill=255, width=w, joint="curve")
        r = w / 2
        for x, y in (xy[0], xy[-1]):
            d.ellipse((x - r, y - r, x + r, y + r), fill=255)
    return img
