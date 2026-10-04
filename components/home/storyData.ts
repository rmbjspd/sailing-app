// Pre-computed, serialisable data for the home-page voyage story. Everything is
// derived from lib/data so the story can never disagree with the Ship's Log.
import { itinerary } from "@/lib/data/itinerary";
import { legGroups, tripTotals, formatLegDistance } from "@/lib/data/stats";
import { legGuides } from "@/lib/data/legGuides";
import { legStyle } from "@/lib/data/legStyle";
import { waypoints } from "@/lib/data/waypoints";
import { formatVoyageDateRange } from "@/lib/data/voyage";

const NM_PER_MI = 0.868976;

export interface Chapter {
  legId: string;
  numeral: string;
  label: string;
  tagline: string;
  color: string;
  /** story position runs from dayFrom (previous overnight) to dayTo */
  dayFrom: number;
  dayTo: number;
  dateRange: string;
  distance: string;
  locks: number;
  days: number;
  lede: string;
  stops: string[];
}

export interface StoryData {
  chapters: Chapter[];
  /** cumulative nm-equivalent at the END of each day index 0..lastDay */
  cumNm: number[];
  /** cumulative locks at the end of each day */
  cumLocks: number[];
  /** overnight name for each day index (where the boat sleeps) */
  overnight: string[];
  lastDay: number;
  totals: { nm: number; days: number; locks: number; legs: number };
}

export function getStoryData(): StoryData {
  const groups = legGroups();
  const chapters: Chapter[] = groups.map((g) => {
    const s = legStyle(g.legId);
    const guide = legGuides.find((x) => x.legId === g.legId);
    const lede = guide ? guide.captainIntro.split(/(?<=[.!?])\s+/)[0] : s.tagline;
    return {
      legId: g.legId,
      numeral: s.numeral,
      label: s.label,
      tagline: s.tagline,
      color: s.color,
      dayFrom: g.dayStart - 1,
      dayTo: g.dayEnd,
      dateRange: formatVoyageDateRange(g.dayStart, g.dayEnd),
      distance: formatLegDistance(g),
      locks: g.locks,
      days: g.dayEnd - g.dayStart + 1,
      lede,
      stops: waypoints.filter((w) => w.leg === g.legId).map((w) => w.name.split(" / ")[0]),
    };
  });
  const totals = tripTotals();
  const lastDay = totals.dayEnd;
  const cumNm: number[] = [0];
  const cumLocks: number[] = [0];
  const overnight: string[] = [waypoints.find((w) => w.day === 0)?.name ?? "Chicago"];
  for (let d = 1; d <= lastDay; d++) {
    const today = itinerary.filter((x) => x.day === d);
    cumNm[d] = cumNm[d - 1] + today.reduce((s, x) => s + x.distanceNm + (x.distanceMi ?? 0) * NM_PER_MI, 0);
    cumLocks[d] = cumLocks[d - 1] + today.reduce((s, x) => s + x.locks, 0);
    const wp = [...waypoints].reverse().find((w) => w.day <= d);
    overnight[d] = wp?.name ?? "";
  }
  return {
    chapters, cumNm, cumLocks, overnight, lastDay,
    totals: { nm: Math.round(totals.distanceNmEquiv), days: lastDay, locks: totals.locks, legs: groups.length },
  };
}
