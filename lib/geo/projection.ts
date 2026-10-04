// Shared geographic frame for every 3D / 2D chart of the voyage.
//
// The terrain texture (public/geo/terrain.png, baked by scripts/geo/bake-terrain.py)
// is an equirectangular lng/lat grid over BBOX. World space is a flat plane in
// "degrees of latitude" units (1 unit ≈ 111 km) with longitude compressed by
// cos(LAT0) so shapes aren't stretched:  +x = east, -z = north, +y = up.
//
// Keep BBOX in sync with scripts/geo/bake-terrain.py.

export const BBOX = { lngMin: -89.0, lngMax: -71.0, latMin: 40.0, latMax: 47.5 } as const;

export const LAT0 = (BBOX.latMin + BBOX.latMax) / 2;
export const LNG0 = (BBOX.lngMin + BBOX.lngMax) / 2;
export const COS_LAT0 = Math.cos((LAT0 * Math.PI) / 180);

/** World-space width/depth of the terrain plane. */
export const WORLD_W = (BBOX.lngMax - BBOX.lngMin) * COS_LAT0;
export const WORLD_D = BBOX.latMax - BBOX.latMin;

/** Terrain texture metadata. */
export const TERRAIN = {
  url: "/geo/terrain.png",
  width: 2048,
  height: 1181,
  /** elevation (m) = (R*256 + G) / ELEV_SCALE - ELEV_OFFSET */
  elevScale: 4,
  elevOffset: 1000,
} as const;

/** Metres → world units (before vertical exaggeration). */
export const METRES_TO_UNITS = 1 / 111_000;

/** [lng, lat] → world [x, z] on the ground plane. */
export function project(lng: number, lat: number): [number, number] {
  return [(lng - LNG0) * COS_LAT0, -(lat - LAT0)];
}

/** world [x, z] → [lng, lat]. */
export function unproject(x: number, z: number): [number, number] {
  return [x / COS_LAT0 + LNG0, -z + LAT0];
}

/** [lng, lat] → texture UV (0..1, v=0 at south edge, matching three.js flipY=true). */
export function lngLatToUV(lng: number, lat: number): [number, number] {
  return [
    (lng - BBOX.lngMin) / (BBOX.lngMax - BBOX.lngMin),
    (lat - BBOX.latMin) / (BBOX.latMax - BBOX.latMin),
  ];
}

/** Great-circle distance in nautical miles. */
export function haversineNm(a: [number, number], b: [number, number]): number {
  const R = 3440.065; // earth radius, nm
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
