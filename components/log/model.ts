// Server-side view model for the Ship's Log. Everything here is derived from
// lib/data/* (itinerary, waypoints, route, stats, voyage) — nothing is
// hardcoded — and the result is plain serialisable data, so the client chart
// island receives precomputed geometry instead of importing the data files.
import { itinerary } from "@/lib/data/itinerary";
import { waypoints } from "@/lib/data/waypoints";
import { routeSegments } from "@/lib/data/routePath";
import { legGroups, tripTotals, formatLegDistance, type LegStats } from "@/lib/data/stats";
import { legStyle } from "@/lib/data/legStyle";
import { legGuides, type LegGuide } from "@/lib/data/legGuides";
import { dateForDay, formatVoyageDateRange } from "@/lib/data/voyage";
import { BBOX } from "@/lib/geo/projection";
import type { ItineraryDay } from "@/lib/types";

/** Pixel frame of /geo/chart-dark.webp (same equirectangular frame as BBOX). */
export const CHART_W = 2048;
export const CHART_H = 1181;

export function toChart(lng: number, lat: number): [number, number] {
  return [
    ((lng - BBOX.lngMin) / (BBOX.lngMax - BBOX.lngMin)) * CHART_W,
    ((BBOX.latMax - lat) / (BBOX.latMax - BBOX.latMin)) * CHART_H,
  ];
}

const r1 = (n: number) => Math.round(n * 10) / 10;

// ── Units ────────────────────────────────────────────────────────────────────
const totals = tripTotals();
/** nm per statute mile, recovered from the stats module's own conversion. */
const NM_PER_MI = totals.distanceMi > 0 ? (totals.distanceNmEquiv - totals.distanceNm) / totals.distanceMi : 1;

export function dayDistanceEquiv(d: ItineraryDay): number {
  return d.distanceNm + (d.distanceMi ?? 0) * NM_PER_MI;
}

export function dayDistanceLabel(d: ItineraryDay): { value: number; unit: "nm" | "mi" } | null {
  if (d.distanceMi && d.distanceMi > 0) return { value: d.distanceMi, unit: "mi" };
  if (d.distanceNm > 0) return { value: d.distanceNm, unit: "nm" };
  return null;
}

/** A day spent in harbour: no miles made good, whatever the from/to wording. */
export function isStationary(d: ItineraryDay): boolean {
  return d.distanceNm === 0 && !(d.distanceMi && d.distanceMi > 0);
}

const dateFmtShort = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
const dateFmtLong = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
export const shortDate = (day: number) => dateFmtShort.format(dateForDay(day));
export const longDate = (day: number) => dateFmtLong.format(dateForDay(day));

/** Strip the trailing ", ST" state/province code for compact chart labels. */
export const placeName = (s: string) => s.replace(/,\s*[A-Z]{2}$/, "");

/** Decimal degrees → 45°50′N 84°37′W */
export function formatLatLng(lat: number, lng: number): string {
  const f = (v: number, pos: string, neg: string) => {
    const a = Math.abs(v);
    const deg = Math.floor(a);
    const min = Math.round((a - deg) * 60);
    return `${deg}°${String(min).padStart(2, "0")}′${v >= 0 ? pos : neg}`;
  };
  return `${f(lat, "N", "S")} ${f(lng, "E", "W")}`;
}

// ── Route geometry ───────────────────────────────────────────────────────────
interface Vertex { x: number; y: number; leg: string }

const vertices: Vertex[] = routeSegments.flatMap((seg, i) =>
  (i === 0 ? seg.coords : seg.coords.slice(1)).map(([lng, lat]) => {
    const [x, y] = toChart(lng, lat);
    return { x, y, leg: seg.leg };
  }),
);

/** Overnight stops in voyage order: departure (day 0) then each waypoint. */
const orderedStops = [...waypoints].sort((a, b) => a.day - b.day);

/** The waypoint where the boat sleeps at the end of `day` (layovers reuse the last). */
function stopIndexForDay(day: number): number {
  let idx = 0;
  orderedStops.forEach((w, i) => { if (w.day <= day) idx = i; });
  return idx;
}

// Snap each stop to its nearest route vertex, never moving backwards along the path.
const stopVertex: number[] = [];
{
  let from = 0;
  for (const w of orderedStops) {
    const [x, y] = toChart(w.lng, w.lat);
    let best = from, bestD = Infinity;
    for (let i = from; i < vertices.length; i++) {
      const d = (vertices[i].x - x) ** 2 + (vertices[i].y - y) ** 2;
      if (d < bestD) { bestD = d; best = i; }
    }
    stopVertex.push(best);
    from = best;
  }
}

const pathD = (pts: { x: number; y: number }[]) =>
  pts.map((p, i) => `${i ? "L" : "M"}${r1(p.x)} ${r1(p.y)}`).join("");

export interface ChartStop {
  id: string; name: string; day: number; leg: string; color: string;
  x: number; y: number; coord: string; layover: boolean;
}
export interface ChartDayPath { day: number; leg: string; color: string; d: string }
export interface ChartLeg { legId: string; color: string; inland: boolean; d: string; box: [number, number, number, number] }
export interface ChartData {
  w: number; h: number;
  stops: ChartStop[];
  dayPaths: ChartDayPath[];
  legs: ChartLeg[];
  /** stop index (into stops) where the boat is at the end of each day; [0] = departure */
  stopOfDay: number[];
  routeBox: [number, number, number, number];
}

export interface DaySummary {
  day: number; legId: string; legIndex: number;
  from: string; to: string; date: string; dateLong: string;
  dist: string | null; locks: number; stationary: boolean;
  /** running totals at the end of this day */
  cumNm: number; cumMi: number; cumLocks: number;
}

export interface LegSummary {
  legId: string; numeral: string; label: string; color: string;
  dayStart: number; dayEnd: number; dates: string; distance: string;
}

function bbox(pts: { x: number; y: number }[]): [number, number, number, number] {
  const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
  const x0 = Math.min(...xs), y0 = Math.min(...ys);
  return [r1(x0), r1(y0), r1(Math.max(...xs) - x0), r1(Math.max(...ys) - y0)];
}

export function buildChartData(): ChartData {
  const stops: ChartStop[] = orderedStops.map(w => {
    const [x, y] = toChart(w.lng, w.lat);
    return {
      id: w.id, name: w.name, day: w.day, leg: w.leg, color: legStyle(w.leg).color,
      x: r1(x), y: r1(y), coord: formatLatLng(w.lat, w.lng),
      layover: !!w.isLayover,
    };
  });

  const lastDay = Math.max(...itinerary.map(d => d.day));
  const stopOfDay = Array.from({ length: lastDay + 1 }, (_, d) => stopIndexForDay(d));

  const dayPaths: ChartDayPath[] = [];
  for (const day of itinerary) {
    const a = stopOfDay[day.day - 1], b = stopOfDay[day.day];
    if (a === b) continue;
    const seg = vertices.slice(stopVertex[a], stopVertex[b] + 1);
    // Begin and end exactly on the stop markers.
    const pts = [stops[a], ...seg.slice(1, -1), stops[b]];
    dayPaths.push({ day: day.day, leg: day.leg, color: legStyle(day.leg).color, d: pathD(pts) });
  }

  const legs: ChartLeg[] = legGroups().map(g => {
    const a = stopOfDay[g.dayStart - 1], b = stopOfDay[g.dayEnd];
    const seg = vertices.slice(stopVertex[a], stopVertex[b] + 1);
    const pts = [stops[a], ...seg.slice(1, -1), stops[b]];
    const s = legStyle(g.legId);
    return { legId: g.legId, color: s.color, inland: s.inland, d: pathD(pts), box: bbox(pts) };
  });

  return { w: CHART_W, h: CHART_H, stops, dayPaths, legs, stopOfDay, routeBox: bbox(vertices) };
}

export function buildDaySummaries(): DaySummary[] {
  const legIds = legGroups().map(g => g.legId);
  let cumNm = 0, cumMi = 0, cumLocks = 0;
  return itinerary.map(d => {
    cumNm += d.distanceNm; cumMi += d.distanceMi ?? 0; cumLocks += d.locks;
    const dist = dayDistanceLabel(d);
    const stationary = isStationary(d);
    return {
      day: d.day, legId: d.leg, legIndex: legIds.indexOf(d.leg),
      from: placeName(d.from), to: placeName(d.to),
      date: shortDate(d.day), dateLong: longDate(d.day),
      dist: dist ? `${dist.value} ${dist.unit}` : null,
      locks: d.locks, stationary, cumNm, cumMi, cumLocks,
    };
  });
}

export function buildLegSummaries(): LegSummary[] {
  return legGroups().map(g => {
    const s = legStyle(g.legId);
    return {
      legId: g.legId, numeral: s.numeral, label: s.label, color: s.color,
      dayStart: g.dayStart, dayEnd: g.dayEnd,
      dates: formatVoyageDateRange(g.dayStart, g.dayEnd), distance: formatLegDistance(g),
    };
  });
}

// ── Leg chapters for the static list ─────────────────────────────────────────
export interface Chapter {
  leg: LegStats;
  guide?: LegGuide;
  index: number;
}

export function buildChapters(): Chapter[] {
  return legGroups().map((leg, index) => ({
    leg, index, guide: legGuides.find(g => g.legId === leg.legId),
  }));
}

let _chart: ChartData | null = null;
/** The real track sailed on `day`, for the inline thumbnail (null on lay days). */
export function dayTrack(day: number): { d: string; box: [number, number, number, number]; color: string } | null {
  _chart ??= buildChartData();
  const p = _chart.dayPaths.find(x => x.day === day);
  if (!p) return null;
  const pts = p.d.slice(1).split("L").map(t => {
    const [x, y] = t.split(" ").map(Number);
    return { x, y };
  });
  return { d: p.d, box: bbox(pts), color: p.color };
}

export { totals as voyageTotals };
export const maxDayEquiv = Math.max(...itinerary.map(dayDistanceEquiv));
export const lastDayNumber = Math.max(...itinerary.map(d => d.day));
