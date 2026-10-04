// The voyage as a 3D curve on top of the terrain, plus the mappings between
// voyage day, waypoint and fraction-of-route that drive the story camera.
import * as THREE from "three";
import { routeSegments } from "@/lib/data/routePath";
import { waypoints } from "@/lib/data/waypoints";
import { itinerary } from "@/lib/data/itinerary";
import { legStyle, LEG_ORDER } from "@/lib/data/legStyle";
import { project, unproject, lngLatToUV } from "@/lib/geo/projection";
import { sampleGrid, type TerrainData } from "./terrain";
import { M2Y } from "./constants";
import type { Waypoint } from "@/lib/types";

export const ROUTE_LIFT = 0.012;

export interface RouteModel {
  curve: THREE.CatmullRomCurve3;
  /** sampled points (evenly spaced along arc length) */
  samples: THREE.Vector3[];
  /** fraction of route at which each leg starts/ends */
  legRanges: { legId: string; start: number; end: number }[];
  /** waypoints in day order with their route fraction and world position */
  stops: (Waypoint & { f: number; pos: THREE.Vector3 })[];
  /** 1×256 RGBA texture of leg colours along the route (u = fraction) */
  legColorTex: THREE.DataTexture;
  /** map a (fractional) voyage day 0..lastDay to route fraction */
  fractionForDay: (day: number) => number;
  /** inverse: route fraction to fractional voyage day */
  dayForFraction: (f: number) => number;
  lastDay: number;
}

/** Height of the visible surface (land or water) at lng/lat, in world Y. */
export function surfaceY(t: TerrainData, lng: number, lat: number): number {
  const [u, v] = lngLatToUV(lng, lat);
  const e = sampleGrid(t.elev, t.width, t.height, u, v);
  const l = sampleGrid(t.level, t.width, t.height, u, v);
  const w = sampleGrid(t.water, t.width, t.height, u, v);
  const land = Math.max(e, l);
  const s = THREE.MathUtils.smoothstep(w, 0.35, 0.65);
  return (land * (1 - s) + l * s) * M2Y;
}

export function buildRoute(t: TerrainData): RouteModel {
  // 1. Flatten the leg polylines, remembering which leg each vertex belongs to.
  const pts2: { lng: number; lat: number; leg: string }[] = [];
  for (const seg of routeSegments) {
    for (const [lng, lat] of seg.coords) {
      const last = pts2[pts2.length - 1];
      if (last && Math.abs(last.lng - lng) < 1e-6 && Math.abs(last.lat - lat) < 1e-6) continue;
      pts2.push({ lng, lat, leg: seg.leg });
    }
  }
  // 2. Smooth plan-view curve through them.
  const plan = new THREE.CatmullRomCurve3(
    pts2.map((p) => { const [x, z] = project(p.lng, p.lat); return new THREE.Vector3(x, 0, z); }),
    false, "centripetal",
  );
  plan.arcLengthDivisions = 4000;
  const N = 2400;
  const flat = plan.getSpacedPoints(N);
  // 3. Drape on the surface, then smooth the heights so the line glides.
  const ys = flat.map((p) => {
    const [lng, lat] = unproject(p.x, p.z);
    return surfaceY(t, lng, lat);
  });
  const sm = ys.map((_, i) => {
    let s = 0, c = 0;
    for (let k = -6; k <= 6; k++) { const j = i + k; if (j >= 0 && j < ys.length) { s += Math.max(ys[j], ys[i] - 0.004); c++; } }
    return Math.max(s / c, ys[i]);
  });
  const samples = flat.map((p, i) => new THREE.Vector3(p.x, sm[i] + ROUTE_LIFT, p.z));
  const curve = new THREE.CatmullRomCurve3(samples, false, "catmullrom", 0.2);
  curve.arcLengthDivisions = 6000;

  // 4. Leg ranges: assign each sample to the leg of the nearest original vertex (monotonic walk).
  const vtxF: number[] = [];
  {
    let si = 0;
    for (const p of pts2) {
      const [x, z] = project(p.lng, p.lat);
      let best = si, bd = Infinity;
      for (let i = si; i < Math.min(samples.length, si + 600); i++) {
        const d = (samples[i].x - x) ** 2 + (samples[i].z - z) ** 2;
        if (d < bd) { bd = d; best = i; }
      }
      si = best;
      vtxF.push(best / N);
    }
  }
  const legRanges: RouteModel["legRanges"] = [];
  for (let i = 0; i < pts2.length; i++) {
    const leg = pts2[i].leg;
    const last = legRanges[legRanges.length - 1];
    if (!last || last.legId !== leg) {
      if (last) last.end = vtxF[i - 1] ?? vtxF[i];
      legRanges.push({ legId: leg, start: last ? last.end : 0, end: vtxF[i] });
    } else last.end = vtxF[i];
  }
  legRanges[legRanges.length - 1].end = 1;

  // 5. Stops: nearest sample, walking forward so order is preserved.
  const ordered = [...waypoints].sort((a, b) => a.day - b.day);
  const stops: RouteModel["stops"] = [];
  {
    let si = 0;
    for (const w of ordered) {
      const [x, z] = project(w.lng, w.lat);
      let best = si, bd = Infinity;
      for (let i = si; i < samples.length; i++) {
        const d = (samples[i].x - x) ** 2 + (samples[i].z - z) ** 2;
        if (d < bd) { bd = d; best = i; }
      }
      si = best;
      stops.push({ ...w, f: best / N, pos: samples[best].clone() });
    }
  }
  stops[0].f = 0;
  stops[stops.length - 1].f = 1;

  // 6. Day ↔ fraction. Days without their own waypoint (layovers) hold position.
  const lastDay = Math.max(...itinerary.map((d) => d.day));
  const dayF: number[] = [];
  for (let d = 0; d <= lastDay; d++) {
    const s = [...stops].reverse().find((st) => st.day <= d);
    dayF.push(s ? s.f : 0);
  }
  const fractionForDay = (day: number) => {
    const d = THREE.MathUtils.clamp(day, 0, lastDay);
    const i = Math.floor(d);
    if (i >= lastDay) return dayF[lastDay];
    return THREE.MathUtils.lerp(dayF[i], dayF[i + 1], d - i);
  };
  const dayForFraction = (f: number) => {
    for (let d = 0; d < lastDay; d++) {
      if (f <= dayF[d + 1]) {
        const span = dayF[d + 1] - dayF[d];
        return d + (span > 1e-6 ? (f - dayF[d]) / span : 0);
      }
    }
    return lastDay;
  };

  // 7. Leg colour ramp texture.
  const W = 512;
  const col = new Uint8Array(W * 4);
  const c = new THREE.Color();
  for (let i = 0; i < W; i++) {
    const f = (i + 0.5) / W;
    const r = legRanges.find((lr) => f >= lr.start && f <= lr.end) ?? legRanges[legRanges.length - 1];
    c.set(legStyle(r.legId).color);
    col[i * 4] = Math.round(c.r * 255);
    col[i * 4 + 1] = Math.round(c.g * 255);
    col[i * 4 + 2] = Math.round(c.b * 255);
    col[i * 4 + 3] = 255;
  }
  const legColorTex = new THREE.DataTexture(col, W, 1, THREE.RGBAFormat);
  legColorTex.colorSpace = THREE.SRGBColorSpace;
  legColorTex.magFilter = THREE.LinearFilter;
  legColorTex.needsUpdate = true;

  return { curve, samples, legRanges, stops, legColorTex, fractionForDay, dayForFraction, lastDay };
}

export const LEGS = LEG_ORDER;
