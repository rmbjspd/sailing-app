// View-model for the "Voyage in Numbers" data visualisations (components/viz).
// Everything here is DERIVED from itinerary.ts / stats.ts / voyage.ts /
// waterProfile.ts — no figure is typed in twice. The x-axis unit used by every
// chart is cumulative "nm-equivalent" distance (canal statute miles converted
// with the same factor stats.ts uses), so a day's width is its real distance.

import { itinerary } from "./itinerary";
import { legGroups, tripTotals } from "./stats";
import { legStyle, LEG_ORDER } from "./legStyle";
import { dateForDay } from "./voyage";
import { TRACK_FLOOR_FT } from "./vizBathymetry";
import {
  LAKE_BASINS, LAKE_DATUM_FT, NM_PER_MI, placedLocks, lockLiftTotals, type PlacedLock,
} from "./waterProfile";

export interface VizDay {
  day: number;
  legId: string;
  color: string;
  from: string;
  to: string;
  overnight: string;
  /** Unified distance, nm (canal statute miles converted). */
  nm: number;
  /** Distance as the itinerary states it ("53 nm" / "40 mi"). */
  distanceLabel: string;
  locks: number;
  layover: boolean;
  /** Cumulative nm-equivalent at start / end of the day. */
  x0: number;
  x1: number;
  /** "Sat, Jun 19" */
  dateLabel: string;
  /** "Jun 19" */
  dateShort: string;
  weekday: string;
}

const fmtDate = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString("en-US", { ...o, timeZone: "UTC" });

/** Strip the state/province suffix for compact labels: "St. Joseph, MI" → "St. Joseph". */
export function shortPlace(s: string): string {
  return s.replace(/,\s*[A-Z]{2}\b.*$/, "").replace(/\s*\(.*\)$/, "").trim();
}

export function vizDays(): VizDay[] {
  let x = 0;
  return itinerary.map((d) => {
    const nm = d.distanceNm + (d.distanceMi ?? 0) * NM_PER_MI;
    const date = dateForDay(d.day);
    const out: VizDay = {
      day: d.day,
      legId: d.leg,
      color: legStyle(d.leg).color,
      from: d.from,
      to: d.to,
      overnight: d.overnight,
      nm,
      distanceLabel: d.distanceMi ? `${d.distanceMi} mi` : d.distanceNm ? `${d.distanceNm} nm` : "Layover",
      locks: d.locks,
      layover: nm === 0,
      x0: x,
      x1: x + nm,
      dateLabel: fmtDate(date, { weekday: "short", month: "short", day: "numeric" }),
      dateShort: fmtDate(date, { month: "short", day: "numeric" }),
      weekday: fmtDate(date, { weekday: "short" }),
    };
    x += nm;
    return out;
  });
}

export interface VizLeg {
  legId: string;
  label: string;
  short: string;
  numeral: string;
  color: string;
  inland: boolean;
  dayStart: number;
  dayEnd: number;
  days: number;
  nm: number;
  locks: number;
  x0: number;
  x1: number;
  shareDistance: number;
  shareDays: number;
  /** nm per calendar day on the leg (layovers included). */
  pace: number;
}

export function vizLegs(): VizLeg[] {
  const totals = tripTotals();
  const totalDays = totals.sailingDays;
  let x = 0;
  return legGroups().map((g) => {
    const s = legStyle(g.legId);
    const days = g.dayEnd - g.dayStart + 1;
    const leg: VizLeg = {
      legId: g.legId, label: s.label, short: s.short, numeral: s.numeral, color: s.color, inland: s.inland,
      dayStart: g.dayStart, dayEnd: g.dayEnd, days,
      nm: g.distanceNmEquiv, locks: g.locks,
      x0: x, x1: x + g.distanceNmEquiv,
      shareDistance: g.distanceNmEquiv / totals.distanceNmEquiv,
      shareDays: days / totalDays,
      pace: g.distanceNmEquiv / days,
    };
    x += g.distanceNmEquiv;
    return leg;
  }).sort((a, b) => LEG_ORDER.indexOf(a.legId as never) - LEG_ORDER.indexOf(b.legId as never));
}

// ─── Water-surface profile ─────────────────────────────────────────────────

/** Approximate river reaches between the lakes (statute miles → nm). */
const ST_CLAIR_RIVER_NM = 39 * NM_PER_MI;  // Port Huron → Lake St. Clair
const DETROIT_RIVER_NM = 28 * NM_PER_MI;   // Lake St. Clair → Lake Erie

export interface ProfileLock extends PlacedLock {
  x: number;
}

export interface SurfacePoint { x: number; ft: number; legId: string }

export interface FloorSample { x: number; ft: number; depthFt: number; day: number; legId: string }
export interface SeabedRun { legId: string; day: number; pts: FloorSample[] }

/** Ignore floor samples shallower than this under the chart's surface (shore pixels). */
const MIN_KEEL_FT = 6;

export interface WaterModel {
  days: VizDay[];
  legs: VizLeg[];
  locks: ProfileLock[];
  /** Water-surface polyline, eastbound; locks are vertical steps (duplicate x). */
  surface: SurfacePoint[];
  /** Lake / sea floor under the keel (ETOPO 2022), contiguous runs split at no-data gaps. */
  seabed: SeabedRun[];
  /** Deepest water under the keel on the whole voyage. */
  deepest: FloorSample;
  /** Under-keel depth summary per open-water leg that has floor data. */
  legDepth: { legId: string; label: string; color: string; meanFt: number; max: FloorSample; nm: number }[];
  /** Track distance (nm) over lake floor that lies below sea level. */
  belowSeaNm: number;
  /** Published basin depths [EPA], kept as reference marks. */
  basins: { legId: string; name: string; x0: number; x1: number; surfaceFt: number; floorFt: number; maxDepthFt: number; meanDepthFt: number }[];
  totalNm: number;
  lift: ReturnType<typeof lockLiftTotals>;
  /** Mast-down span (unstep day start → re-step day end). */
  mast: { downDay: number; upDay: number; x0: number; x1: number };
}

export function waterModel(): WaterModel {
  const days = vizDays();
  const legs = vizLegs();
  const byDay = new Map(days.map(d => [d.day, d]));
  const placed = placedLocks();
  const locks: ProfileLock[] = placed.map((l) => {
    const d = byDay.get(l.day)!;
    return { ...l, x: d.x0 + l.t * d.nm };
  });

  const surface: SurfacePoint[] = [];
  const push = (x: number, ft: number, legId: string) => surface.push({ x, ft, legId });

  const stClairDay = days.find(d => d.legId === "st-clair")!;
  const erieFirst = days.find(d => d.legId === "lake-erie")!;
  const stClairLakeStart = stClairDay.x0 + ST_CLAIR_RIVER_NM;
  // Detroit City Marina sits at the head of the Detroit River, so the river's
  // fall to Lake Erie happens at the start of the first Erie day.
  const detroitEnd = erieFirst.x0 + DETROIT_RIVER_NM;

  // Upper lakes
  push(0, LAKE_DATUM_FT.michiganHuron, "lake-michigan");
  for (const lg of legs) {
    if (["lake-michigan", "north-channel", "lake-huron"].includes(lg.legId)) push(lg.x1, LAKE_DATUM_FT.michiganHuron, lg.legId);
  }
  // Connecting rivers: St. Clair River falls to Lake St. Clair, Detroit River to Erie.
  push(stClairLakeStart, LAKE_DATUM_FT.stClair, "st-clair");
  push(stClairDay.x1, LAKE_DATUM_FT.stClair, "st-clair");
  push(detroitEnd, LAKE_DATUM_FT.erie, "lake-erie");
  // Steps through every lock.
  for (const l of locks) {
    push(l.x, l.fromFt, l.day >= 28 && l.id === "Troy" ? "hudson" : legIdForX(days, l.x));
    push(l.x, l.toFt, legIdForX(days, l.x + 1e-6));
  }
  const total = days[days.length - 1].x1;
  // Hudson + Sound are tidewater.
  const sound = legs.find(l => l.legId === "sound-saybrook")!;
  push(sound.x0, 0, "hudson");
  push(total, 0, "sound-saybrook");

  // Floor under the keel (baked from terrain.png / ETOPO 2022). A sample at or
  // above the chart's own water surface (a shoreline pixel whose datum differs
  // by a few feet) is treated as no data rather than drawn as dry land.
  const seabed: SeabedRun[] = [];
  const all: FloorSample[] = [];
  for (const [dayStr, samples] of Object.entries(TRACK_FLOOR_FT)) {
    const d = byDay.get(Number(dayStr));
    if (!d || d.nm === 0) continue;
    let run: SeabedRun | null = null;
    for (const [t, floor] of samples) {
      const x = d.x0 + t * d.nm;
      const surf = surfaceAt(surface, x);
      if (floor == null || floor > surf - MIN_KEEL_FT) { run = null; continue; }
      const p: FloorSample = { x, ft: floor, depthFt: surf - floor, day: d.day, legId: d.legId };
      all.push(p);
      if (!run) { run = { legId: d.legId, day: d.day, pts: [] }; seabed.push(run); }
      run.pts.push(p);
    }
  }
  seabed.sort((a, b) => a.pts[0].x - b.pts[0].x);
  const deepest = all.reduce((a, b) => (b.depthFt > a.depthFt ? b : a));
  const step = (run: SeabedRun, i: number) => (i ? run.pts[i].x - run.pts[i - 1].x : 0);
  const belowSeaNm = seabed.filter(r => !legStyle(r.legId).inland && r.legId !== "sound-saybrook")
    .reduce((acc, r) => acc + r.pts.reduce((a, p, i) => a + (p.ft < 0 ? step(r, i) : 0), 0), 0);
  const legDepth = legs.filter(l => !l.inland).flatMap((l) => {
    const pts = all.filter(p => p.legId === l.legId);
    if (!pts.length) return [];
    return [{
      legId: l.legId, label: l.label, color: l.color,
      meanFt: pts.reduce((a, p) => a + p.depthFt, 0) / pts.length,
      max: pts.reduce((a, b) => (b.depthFt > a.depthFt ? b : a)),
      nm: l.nm,
    }];
  });

  const basins = LAKE_BASINS.map((b) => {
    const lg = legs.find(l => l.legId === b.legId)!;
    return {
      legId: b.legId, name: b.name, x0: lg.x0, x1: lg.x1, surfaceFt: b.surfaceFt,
      floorFt: b.surfaceFt - b.maxDepthFt, maxDepthFt: b.maxDepthFt, meanDepthFt: b.meanDepthFt,
    };
  });

  const canal = legs.find(l => l.legId === "erie-canal")!;
  const hudson = legs.find(l => l.legId === "hudson")!;
  const upDayN = hudson.dayStart;
  const mast = {
    downDay: canal.dayStart, upDay: upDayN,
    x0: byDay.get(canal.dayStart)!.x0, x1: byDay.get(upDayN)!.x1,
  };

  return { days, legs, locks, surface, seabed, deepest, legDepth, belowSeaNm, basins, totalNm: total, lift: lockLiftTotals(placed), mast };
}

function legIdForX(days: VizDay[], x: number): string {
  for (const d of days) if (d.nm > 0 && x >= d.x0 && x <= d.x1) return d.legId;
  return days[days.length - 1].legId;
}

/** Water level at x (ft), interpolating the surface polyline (last match wins at steps). */
export function surfaceAt(surface: SurfacePoint[], x: number): number {
  for (let i = surface.length - 1; i > 0; i--) {
    const a = surface[i - 1], b = surface[i];
    if (x >= a.x && x <= b.x) {
      if (b.x === a.x) return b.ft;
      return a.ft + (b.ft - a.ft) * ((x - a.x) / (b.x - a.x));
    }
  }
  return surface[surface.length - 1].ft;
}

// ─── Daily-rhythm facts ─────────────────────────────────────────────────

export interface ClockFacts {
  longest: VizDay;
  busiestLockDays: VizDay[];
  restDays: VizDay[];
  movingAvg: number;
}

export function clockFacts(days: VizDay[]): ClockFacts {
  const longest = days.reduce((a, b) => (b.nm > a.nm ? b : a));
  const maxLocks = Math.max(...days.map(d => d.locks));
  const moving = days.filter(d => d.nm > 0);
  return {
    longest,
    busiestLockDays: days.filter(d => d.locks === maxLocks),
    restDays: days.filter(d => d.nm === 0),
    movingAvg: moving.reduce((a, d) => a + d.nm, 0) / moving.length,
  };
}

// ─── Critical operations ("Dead Reckoning") ───────────────────────────────

export interface CriticalOp {
  id: string;
  title: string;
  where: string;
  dayStart: number;
  dayEnd: number;
  /** Optional second point (e.g. customs out & back). */
  dayAlt?: number;
  figure: string;
  figureLabel: string;
  body: string;
  tone: "brass" | "alert" | "glow";
}

export function criticalOps(): CriticalOp[] {
  const legs = vizLegs();
  const leg = (id: string) => legs.find(l => l.legId === id)!;
  const canal = leg("erie-canal");
  const hudson = leg("hudson");
  const sound = leg("sound-saybrook");
  const canalLockDays = itinerary.filter(d => d.leg === "erie-canal" && d.locks > 0).map(d => d.day);
  const firstCanada = itinerary.find(d => /,\s*ON\b/.test(d.to))!;
  const backToUS = itinerary.find(d => d.day > firstCanada.day && /,\s*MI\b/.test(d.to))!;
  const tidal = itinerary.filter(d => d.leg === "hudson" && d.distanceNm > 0).map(d => d.day);
  const lockDayCount = canalLockDays.length;

  // Figures quoted from the itinerary's own wording, so they can't drift.
  const allText = itinerary.flatMap(d => [...d.warnings, ...d.highlights, d.notes]).join(" \n ");
  const air = allText.match(/(\d+)\s*ft\s*(\d+)\s*in/);
  const lag = allText.match(/~?(\d+[–-]\d+)\s*hrs?\s*AFTER/i);
  const kn = allText.match(/(\d+[–-]\d+)\s*knots/i);

  return [
    {
      id: "unstep", title: "Mast down", where: `${shortPlace(itinerary.find(d => d.day === canal.dayStart)!.to)} · crane`,
      dayStart: canal.dayStart, dayEnd: canal.dayStart, figure: air ? `${air[1]}′${air[2]}″` : "—", figureLabel: "air-draft target",
      body: "Book the yard crane before you leave Erie. The mast rides on deck, padded and lashed, under every fixed bridge between here and the Hudson. Measure to the top of every antenna.",
      tone: "brass",
    },
    {
      id: "canal", title: "Canal transit", where: "Lockport → Waterford",
      dayStart: Math.min(...canalLockDays), dayEnd: Math.max(...canalLockDays),
      figure: String(canal.locks), figureLabel: `locks in ${lockDayCount} lock days`,
      body: "Twenty to thirty minutes a chamber, fenders on both sides, crew on lines fore and aft. Stage overnight so the Waterford Flight is run in the morning, with the whole day in hand.",
      tone: "glow",
    },
    {
      id: "restep", title: "Mast up", where: `${shortPlace(itinerary.find(d => d.day === hudson.dayStart)!.to)} · Hop-O-Nose`,
      dayStart: hudson.dayStart, dayEnd: hudson.dayStart, figure: String(hudson.dayStart - canal.dayStart + 1), figureLabel: "days as a motorboat",
      body: "Below the Troy lock and down to Catskill Creek, then back to a sailboat. Call ahead for the crane, and allow two to three hours to re-rig and reconnect the electronics.",
      tone: "brass",
    },
    {
      id: "customs", title: "Border clearances", where: `${shortPlace(firstCanada.to)} · ${shortPlace(backToUS.to.split("/").pop()!.trim())}`,
      dayStart: firstCanada.day, dayEnd: firstCanada.day, dayAlt: backToUS.day,
      figure: "2", figureLabel: "ports of entry",
      body: `Passports for everyone aboard. Phone CBSA on arrival at ${shortPlace(firstCanada.to)} (Day ${firstCanada.day}); report to US CBP at Port Huron on the way back (Day ${backToUS.day}). Nobody steps ashore until you're cleared.`,
      tone: "alert",
    },
    {
      id: "tides", title: "Hudson tides", where: "Troy → New York",
      dayStart: Math.min(...tidal), dayEnd: Math.max(...tidal),
      figure: lag ? `${lag[1].replace("-", "–")} h` : "—", figureLabel: "Troy lags the Battery",
      body: "High water at Troy comes five to six hours after high water at the Battery. Work from the Troy tables, not New York's, and leave on the ebb.",
      tone: "glow",
    },
    {
      id: "hellgate", title: "Hell Gate", where: "East River",
      dayStart: sound.dayStart, dayEnd: sound.dayStart,
      figure: kn ? `${kn[1].replace("-", "–")} kn` : "—", figureLabel: "peak current",
      body: "Arrive at or just before slack, with the ebb about to carry you east. Never try it against a strong current: the slack window is short, and the gate doesn't negotiate.",
      tone: "alert",
    },
  ];
}
