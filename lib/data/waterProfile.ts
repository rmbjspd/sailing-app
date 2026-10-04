// Water-surface profile of the voyage: every lake level and every lock between
// Lake Michigan and the Atlantic, in the order S/V Sabbatical meets them
// (eastbound). Powers the "Staircase to the Sea" chart (components/viz).
//
// ─── Sources ────────────────────────────────────────────────────────────────
// [LWD]  Great Lakes chart datum (Low Water Datum, IGLD 1985) — USACE / NOAA:
//        Michigan–Huron 577.5 ft, St. Clair 572.3 ft, Erie 569.2 ft. Real summer
//        levels typically run 1–3 ft above datum (Mich–Huron monthly record
//        range 576.0–582.4 ft, 2013 / 1986).
// [EPA]  US EPA "Physical Features of the Great Lakes": max / mean depth —
//        Michigan 925 / 279 ft, Huron 750 / 195 ft, Erie 210 / 62 ft.
// [OB]   OffshoreBlue "Erie Canal Locks — IDs, Locations, Lifts, Distances"
//        (offshoreblue.com/cruise/erie-canal-locks.php), lifts and lock-to-lock
//        statute miles, cross-checked against NYS Canal Corporation notices
//        (canals.ny.gov): 34 chambers E-2…E-35, no E-1 and no E-31, E-28 split
//        into 28A/28B; canal = 338.75 SM from Lock E-2 to the Niagara River at
//        Tonawanda.
// [WF]   Waterford Flight (E-2…E-6): 168.9 ft in 1.52 mi — the greatest lift
//        in the shortest distance of any lock flight in the United States.
// [RS]   Rome summit level 420.4 ft (upper pool of E-21), Oneida Lake ≈369 ft.
// [BR]   Black Rock Lock (USACE, Buffalo): lift up to ~6 ft, varies with Erie.
// [TL]   Troy Federal Lock (USACE): 520 × 45 ft chamber, ~14 ft lift to tidewater.
//
// ─── Method ─────────────────────────────────────────────────────────────────
// Canal pool elevations are reconstructed by chaining the published lifts from
// two anchors — tidewater (0 ft) at the bottom of the Troy lock, climbing west,
// and Lake Erie datum minus the Black Rock lift, descending east — meeting on
// the Seneca River pool between E-24 and E-23 (the canal's low point west of
// Rome). The two chains close to within ~2.5 ft; the difference is split there,
// so drawn pools are good to a few feet on a 577-ft scale. Lifts shown to the
// reader are always the published figures.

import { itinerary } from "./itinerary";

export const NM_PER_MI = 0.868976;

/** Great Lakes chart datum, ft above sea level [LWD]. */
export const LAKE_DATUM_FT = {
  michiganHuron: 577.5,
  stClair: 572.3,
  erie: 569.2,
} as const;

/** Rome summit level, published upper pool of E-21 [RS]. */
export const ROME_SUMMIT_FT = 420.4;

export interface LakeBasin {
  legId: string;
  name: string;
  maxDepthFt: number;
  meanDepthFt: number;
  surfaceFt: number;
}

/** Basin depths [EPA]. Not along-track: the deepest point of each lake. */
export const LAKE_BASINS: LakeBasin[] = [
  { legId: "lake-michigan", name: "Lake Michigan", maxDepthFt: 925, meanDepthFt: 279, surfaceFt: LAKE_DATUM_FT.michiganHuron },
  { legId: "lake-huron", name: "Lake Huron", maxDepthFt: 750, meanDepthFt: 195, surfaceFt: LAKE_DATUM_FT.michiganHuron },
  { legId: "lake-erie", name: "Lake Erie", maxDepthFt: 210, meanDepthFt: 62, surfaceFt: LAKE_DATUM_FT.erie },
];

export type LockDir = "up" | "down";

export interface LockSpec {
  id: string;          // "E-17", "Black Rock", "Troy"
  name: string;
  place: string;
  liftFt: number;      // published lift [OB/BR/TL]
  dir: LockDir;        // for an EASTBOUND boat
  operator: "NYS Canal Corp." | "USACE";
  flight?: "Lockport" | "Waterford";
  /** One-line, verified note for tooltips. */
  note?: string;
}

/**
 * Canal locks in eastbound order, with the published statute-mile distance to
 * the NEXT lock eastward (distances from [OB], read in the E-2→E-35 direction).
 */
const CANAL: (LockSpec & { toNextMi: number })[] = [
  { id: "E-35", name: "Lock E-35", place: "Lockport", liftFt: 24.5, dir: "down", operator: "NYS Canal Corp.", flight: "Lockport", toNextMi: 0.05,
    note: "Upper of the Lockport pair — the modern locks sit beside the 1840s ‘Flight of Five’." },
  { id: "E-34", name: "Lock E-34", place: "Lockport", liftFt: 24.6, dir: "down", operator: "NYS Canal Corp.", flight: "Lockport", toNextMi: 64.2,
    note: "Then 64 miles without another lock." },
  { id: "E-33", name: "Lock E-33", place: "Henrietta (Rochester)", liftFt: 25.4, dir: "down", operator: "NYS Canal Corp.", toNextMi: 1.3 },
  { id: "E-32", name: "Lock E-32", place: "Pittsford", liftFt: 25.1, dir: "down", operator: "NYS Canal Corp.", toNextMi: 16.1,
    note: "No Lock E-31 exists — the next chamber is E-30." },
  { id: "E-30", name: "Lock E-30", place: "Macedon", liftFt: 16.4, dir: "down", operator: "NYS Canal Corp.", toNextMi: 2.98 },
  { id: "E-29", name: "Lock E-29", place: "Palmyra", liftFt: 16.0, dir: "down", operator: "NYS Canal Corp.", toNextMi: 9.79 },
  { id: "E-28B", name: "Lock E-28B", place: "Newark", liftFt: 12.0, dir: "down", operator: "NYS Canal Corp.", toNextMi: 3.98 },
  { id: "E-28A", name: "Lock E-28A", place: "Lyons", liftFt: 19.5, dir: "down", operator: "NYS Canal Corp.", toNextMi: 1.28 },
  { id: "E-27", name: "Lock E-27", place: "Lyons", liftFt: 12.5, dir: "down", operator: "NYS Canal Corp.", toNextMi: 12.05 },
  { id: "E-26", name: "Lock E-26", place: "Clyde", liftFt: 6.0, dir: "down", operator: "NYS Canal Corp.", toNextMi: 5.83 },
  { id: "E-25", name: "Lock E-25", place: "Mays Point", liftFt: 6.0, dir: "down", operator: "NYS Canal Corp.", toNextMi: 30.69,
    note: "Montezuma marshes; the Cayuga–Seneca Canal branches south nearby." },
  { id: "E-24", name: "Lock E-24", place: "Baldwinsville", liftFt: 11.0, dir: "down", operator: "NYS Canal Corp.", toNextMi: 18.77,
    note: "Down to the Seneca River — the canal’s low point west of Rome." },
  { id: "E-23", name: "Lock E-23", place: "Brewerton", liftFt: 7.1, dir: "up", operator: "NYS Canal Corp.", toNextMi: 28.91,
    note: "The first lock that lifts you UP — toward Oneida Lake." },
  { id: "E-22", name: "Lock E-22", place: "New London", liftFt: 25.1, dir: "up", operator: "NYS Canal Corp.", toNextMi: 1.3 },
  { id: "E-21", name: "Lock E-21", place: "New London", liftFt: 25.0, dir: "up", operator: "NYS Canal Corp.", toNextMi: 18.1,
    note: "Top of the climb: the Rome summit level, ~420 ft." },
  { id: "E-20", name: "Lock E-20", place: "Whitesboro", liftFt: 16.0, dir: "down", operator: "NYS Canal Corp.", toNextMi: 10.28,
    note: "Leaving the summit — downhill all the way to the sea from here." },
  { id: "E-19", name: "Lock E-19", place: "Frankfort", liftFt: 21.0, dir: "down", operator: "NYS Canal Corp.", toNextMi: 11.85 },
  { id: "E-18", name: "Lock E-18", place: "Jacksonburg", liftFt: 20.0, dir: "down", operator: "NYS Canal Corp.", toNextMi: 4.2 },
  { id: "E-17", name: "Lock E-17", place: "Little Falls", liftFt: 40.5, dir: "down", operator: "NYS Canal Corp.", toNextMi: 7.97,
    note: "The highest single lift on the Erie Canal." },
  { id: "E-16", name: "Lock E-16", place: "St. Johnsville", liftFt: 20.5, dir: "down", operator: "NYS Canal Corp.", toNextMi: 6.72 },
  { id: "E-15", name: "Lock E-15", place: "Fort Plain", liftFt: 8.0, dir: "down", operator: "NYS Canal Corp.", toNextMi: 3.35 },
  { id: "E-14", name: "Lock E-14", place: "Canajoharie", liftFt: 8.0, dir: "down", operator: "NYS Canal Corp.", toNextMi: 7.83 },
  { id: "E-13", name: "Lock E-13", place: "Yosts", liftFt: 8.0, dir: "down", operator: "NYS Canal Corp.", toNextMi: 9.68 },
  { id: "E-12", name: "Lock E-12", place: "Tribes Hill", liftFt: 11.0, dir: "down", operator: "NYS Canal Corp.", toNextMi: 4.57 },
  { id: "E-11", name: "Lock E-11", place: "Amsterdam", liftFt: 12.0, dir: "down", operator: "NYS Canal Corp.", toNextMi: 4.05 },
  { id: "E-10", name: "Lock E-10", place: "Cranesville", liftFt: 15.0, dir: "down", operator: "NYS Canal Corp.", toNextMi: 5.95 },
  { id: "E-9", name: "Lock E-9", place: "Rotterdam", liftFt: 15.0, dir: "down", operator: "NYS Canal Corp.", toNextMi: 5.03 },
  { id: "E-8", name: "Lock E-8", place: "Scotia", liftFt: 14.0, dir: "down", operator: "NYS Canal Corp.", toNextMi: 10.97 },
  { id: "E-7", name: "Lock E-7", place: "Vischer Ferry", liftFt: 27.0, dir: "down", operator: "NYS Canal Corp.", toNextMi: 10.92 },
  { id: "E-6", name: "Lock E-6", place: "Crescent · Waterford Flight", liftFt: 33.0, dir: "down", operator: "NYS Canal Corp.", flight: "Waterford", toNextMi: 0.28,
    note: "Top of the Waterford Flight: once in, you run all five." },
  { id: "E-5", name: "Lock E-5", place: "Waterford Flight", liftFt: 33.3, dir: "down", operator: "NYS Canal Corp.", flight: "Waterford", toNextMi: 0.27 },
  { id: "E-4", name: "Lock E-4", place: "Waterford Flight", liftFt: 34.5, dir: "down", operator: "NYS Canal Corp.", flight: "Waterford", toNextMi: 0.51 },
  { id: "E-3", name: "Lock E-3", place: "Waterford Flight", liftFt: 34.5, dir: "down", operator: "NYS Canal Corp.", flight: "Waterford", toNextMi: 0.46 },
  { id: "E-2", name: "Lock E-2", place: "Waterford", liftFt: 33.6, dir: "down", operator: "NYS Canal Corp.", flight: "Waterford", toNextMi: 0,
    note: "Bottom of the Flight and the eastern end of the Erie Canal." },
];

/** Canal length, Lock E-2 → Niagara River at Tonawanda [OB]. */
export const CANAL_LENGTH_MI = 338.75;

/** Statute miles east of Tonawanda for each canal lock (derived from [OB] spacing). */
function canalMileposts(): number[] {
  // Walk back from E-2 (at CANAL_LENGTH_MI) using each lock's distance to the next.
  const pos = new Array<number>(CANAL.length);
  pos[CANAL.length - 1] = CANAL_LENGTH_MI;
  for (let i = CANAL.length - 2; i >= 0; i--) pos[i] = pos[i + 1] - CANAL[i].toNextMi;
  return pos;
}

/**
 * Overnight stops on the canal, in statute miles east of Tonawanda — estimated
 * from the lock mileposts above (e.g. Brewerton village sits ~2.5 mi east of
 * E-23). Day 21 has no nearby lock to pin it, so the itinerary's own 40 mi is
 * used. Used only to place locks within the right day; the chart's day widths
 * always follow itinerary.ts distances.
 */
export const CANAL_OVERNIGHT_MI: Record<number, number> = {
  20: 0,       // Tonawanda (mast-down day)
  21: 40,      // Medina / Brockport — itinerary figure
  22: 85.6,    // Pittsford, ~1.5 mi east of E-32
  23: 188,     // Brewerton, ~2.5 mi east of E-23
  24: 208.5,   // Sylvan Beach, east end of Oneida Lake (~6 mi before E-22)
  25: 247,     // Ilion, ~3 mi east of E-19
  26: 301.8,   // Amsterdam Riverlink Park, ~1.5 mi east of E-11
  27: CANAL_LENGTH_MI, // Waterford, foot of the Flight
};

/** Black Rock Lock sits ~7.4 statute mi upstream of Tonawanda (E-35 → Black Rock ≈ 26 mi [OB]). */
export const BLACK_ROCK_BEFORE_TONAWANDA_MI = 7.4;
/** Troy Federal Lock sits ~2.5 statute mi below the Waterford Flight. */
export const TROY_BELOW_WATERFORD_MI = 2.5;

export const BLACK_ROCK: LockSpec = {
  id: "Black Rock", name: "Black Rock Lock", place: "Buffalo", liftFt: 6, dir: "down", operator: "USACE",
  note: "Steps around the Niagara River’s current; the lift varies with Lake Erie’s level.",
};
export const TROY: LockSpec = {
  id: "Troy", name: "Troy Federal Lock", place: "Troy", liftFt: 14, dir: "down", operator: "USACE",
  note: "The last lock. Below it the Hudson is tidal — sea level, 150 miles inland.",
};

export interface PlacedLock extends LockSpec {
  /** Voyage day on which the lock is transited. */
  day: number;
  /** Fraction (0..1) through that day's run. */
  t: number;
  /** Water surface before / after the lock, ft above sea level (reconstructed). */
  fromFt: number;
  toFt: number;
  /** Canal milepost east of Tonawanda (canal locks only). */
  canalMi?: number;
}

/** Every lock on the voyage, eastbound, with day placement and pool elevations. */
export function placedLocks(): PlacedLock[] {
  const posts = canalMileposts();
  const days = Object.keys(CANAL_OVERNIGHT_MI).map(Number).sort((a, b) => a - b);

  // Pool chains. West: Erie datum − Black Rock, then down/up the published lifts.
  const west: number[] = [];
  let lvl = LAKE_DATUM_FT.erie - BLACK_ROCK.liftFt;
  const lowIdx = CANAL.findIndex(l => l.id === "E-23"); // Seneca River pool is above E-23
  for (let i = 0; i < lowIdx; i++) { lvl += CANAL[i].dir === "down" ? -CANAL[i].liftFt : CANAL[i].liftFt; west.push(lvl); }
  // East: tidewater + Troy, climbing back west through the lifts.
  const eastAfter = new Array<number>(CANAL.length);
  let e = TROY.liftFt;
  for (let i = CANAL.length - 1; i >= lowIdx; i--) {
    eastAfter[i] = e;
    e += CANAL[i].dir === "down" ? CANAL[i].liftFt : -CANAL[i].liftFt;
  }
  // `e` is now the Seneca River pool seen from the east; west[lowIdx-1] from the west.
  const closure = west[lowIdx - 1] - e;
  // Split the closure: shift the west chain down by half, east chain up by half.
  const after = CANAL.map((_, i) => (i < lowIdx ? west[i] - closure / 2 : eastAfter[i] + closure / 2));

  const out: PlacedLock[] = [];
  // Black Rock: on the last Lake Erie day, ~7.4 mi short of Tonawanda.
  const erieDay = itinerary.filter(d => d.leg === "lake-erie").at(-1)!;
  out.push({
    ...BLACK_ROCK, day: erieDay.day,
    t: 1 - (BLACK_ROCK_BEFORE_TONAWANDA_MI * NM_PER_MI) / Math.max(erieDay.distanceNm, 1),
    fromFt: LAKE_DATUM_FT.erie, toFt: LAKE_DATUM_FT.erie - BLACK_ROCK.liftFt - closure / 2,
  });
  CANAL.forEach((l, i) => {
    const mi = posts[i];
    let day = days[days.length - 1];
    for (let k = 1; k < days.length; k++) if (mi <= CANAL_OVERNIGHT_MI[days[k]]) { day = days[k]; break; }
    const prevMi = CANAL_OVERNIGHT_MI[days[days.indexOf(day) - 1]];
    const t = (mi - prevMi) / (CANAL_OVERNIGHT_MI[day] - prevMi);
    const { toNextMi: _skip, ...spec } = l;
    void _skip;
    out.push({
      ...spec, day, t: Math.min(Math.max(t, 0), 1), canalMi: mi,
      fromFt: i === 0 ? LAKE_DATUM_FT.erie - BLACK_ROCK.liftFt - closure / 2 : after[i - 1],
      toFt: after[i],
    });
  });
  // Troy: on the first Hudson day, ~2.5 mi below Waterford.
  const hudsonDay = itinerary.find(d => d.leg === "hudson")!;
  out.push({
    ...TROY, day: hudsonDay.day,
    t: (TROY_BELOW_WATERFORD_MI * NM_PER_MI) / Math.max(hudsonDay.distanceNm, 1),
    fromFt: out[out.length - 1].toFt, toFt: 0,
  });
  return out;
}

/** Published-lift sums, for headline figures. */
export function lockLiftTotals(locks: PlacedLock[] = placedLocks()) {
  const down = locks.filter(l => l.dir === "down");
  const up = locks.filter(l => l.dir === "up");
  return {
    count: locks.length,
    downCount: down.length,
    upCount: up.length,
    downFt: down.reduce((s, l) => s + l.liftFt, 0),
    upFt: up.reduce((s, l) => s + l.liftFt, 0),
  };
}
