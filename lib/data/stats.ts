import { itinerary } from "./itinerary";
import { ROUTE_LEGS, type RouteOption } from "./waypoints";
import type { ItineraryDay } from "../types";

// Derived voyage statistics. itinerary.ts is the single source of truth; every
// distance / lock / day-range figure shown in the app is computed here so the
// numbers can never drift out of sync with the day-by-day plan again.

const NM_PER_STATUTE_MILE = 0.868976;

export interface LegStats {
  legId: string;
  days: ItineraryDay[];
  dayStart: number;
  dayEnd: number;
  distanceNm: number; // open-water nautical miles
  distanceMi: number; // canal statute miles
  locks: number;
  /** unified distance in nm (canal statute miles converted) for trip totals */
  distanceNmEquiv: number;
}

export function daysForRoute(route: RouteOption): ItineraryDay[] {
  return itinerary.filter(d => d.route === "both" || d.route === route);
}

/** Itinerary days grouped into consecutive legs, with stats per leg. */
export function legGroupsForRoute(route: RouteOption): LegStats[] {
  const groups: LegStats[] = [];
  for (const day of daysForRoute(route)) {
    const last = groups[groups.length - 1];
    if (last && last.legId === day.leg) last.days.push(day);
    else
      groups.push({
        legId: day.leg, days: [day],
        dayStart: 0, dayEnd: 0, distanceNm: 0, distanceMi: 0, locks: 0, distanceNmEquiv: 0,
      });
  }
  for (const g of groups) {
    const dayNums = g.days.map(d => d.day);
    g.dayStart = Math.min(...dayNums);
    g.dayEnd = Math.max(...dayNums);
    g.distanceNm = g.days.reduce((s, d) => s + d.distanceNm, 0);
    g.distanceMi = g.days.reduce((s, d) => s + (d.distanceMi ?? 0), 0);
    g.locks = g.days.reduce((s, d) => s + d.locks, 0);
    g.distanceNmEquiv = g.distanceNm + g.distanceMi * NM_PER_STATUTE_MILE;
  }
  return groups;
}

export interface TripTotals {
  distanceNm: number;       // sum of open-water nm
  distanceMi: number;       // sum of canal statute mi
  distanceNmEquiv: number;  // unified nm-equivalent
  locks: number;
  dayStart: number;
  dayEnd: number;
  sailingDays: number;      // distinct day numbers
}

export function tripTotals(route: RouteOption): TripTotals {
  const days = daysForRoute(route);
  const legs = legGroupsForRoute(route);
  const dayNums = days.map(d => d.day).filter(d => d > 0);
  return {
    distanceNm: legs.reduce((s, l) => s + l.distanceNm, 0),
    distanceMi: legs.reduce((s, l) => s + l.distanceMi, 0),
    distanceNmEquiv: legs.reduce((s, l) => s + l.distanceNmEquiv, 0),
    locks: legs.reduce((s, l) => s + l.locks, 0),
    dayStart: Math.min(...dayNums),
    dayEnd: Math.max(...dayNums),
    sailingDays: new Set(dayNums).size,
  };
}

export const ROUTE_OPTIONS = Object.keys(ROUTE_LEGS) as RouteOption[];

/** Human-readable distance for a leg: "≈275 nm" or canal "338 mi" form. */
export function formatLegDistance(leg: LegStats): string {
  if (leg.distanceMi > 0 && leg.distanceNm === 0) return `${Math.round(leg.distanceMi)} mi`;
  if (leg.distanceMi > 0) return `${Math.round(leg.distanceNm)} nm + ${Math.round(leg.distanceMi)} mi`;
  return `${Math.round(leg.distanceNm)} nm`;
}
