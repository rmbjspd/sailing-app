import { legGroups } from "@/lib/data/stats";
import { LEG_STYLE } from "@/lib/data/legStyle";
import { formatVoyageDateRange } from "@/lib/data/voyage";

// Crew-facing leg metadata. Day ranges are derived from itinerary.ts (via
// legGroups) and presentation from the shared LEG_STYLE, so nothing here can
// drift from the voyage plan.

/** Crew berths available per leg, besides the captain. */
export const CREW_CAPACITY = 3;

/**
 * Legs closed to crew sign-up. Reserved — not open. The reason is intentionally
 * not recorded anywhere in the app.
 */
export const CLOSED_LEG_IDS: ReadonlySet<string> = new Set(["erie-canal"]);

export interface CrewLeg {
  legId: string;
  title: string;
  dayRange: string;  // e.g. "1–6" or "15"
  dateRange: string; // e.g. "Jun 19–24" — derived from the voyage start date
  accent: string;    // hsl() colour token for the leg card
  closed: boolean;
}

export function isLegClosed(legId: string): boolean {
  return CLOSED_LEG_IDS.has(legId);
}

export function isKnownLeg(legId: string): boolean {
  return legGroups().some((g) => g.legId === legId);
}

/** All legs in voyage order, with crew-relevant presentation + closed flag. */
export function crewLegs(): CrewLeg[] {
  return legGroups().map((g) => {
    const style = LEG_STYLE[g.legId];
    return {
      legId: g.legId,
      title: style?.label ?? g.legId,
      dayRange: g.dayStart === g.dayEnd ? `${g.dayStart}` : `${g.dayStart}–${g.dayEnd}`,
      dateRange: formatVoyageDateRange(g.dayStart, g.dayEnd),
      accent: style?.accent ?? "hsl(var(--teal))",
      closed: isLegClosed(g.legId),
    };
  });
}
