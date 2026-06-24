// Voyage-wide calendar metadata. Day numbering in itinerary.ts is contiguous
// 1..N; this anchors Day 1 to a real date so any view can show calendar dates
// without hardcoding them per leg. UTC math throughout to avoid timezone
// off-by-one when the server and viewer are in different zones.

/** Day 1 of the voyage (ISO date, UTC). */
export const VOYAGE_START_DATE = "2027-06-19";

const START_MS = Date.UTC(2027, 5, 19); // June is month index 5
const DAY_MS = 86_400_000;

/** The calendar date for a given voyage day number (Day 1 = VOYAGE_START_DATE). */
export function dateForDay(day: number): Date {
  return new Date(START_MS + (day - 1) * DAY_MS);
}

function fmt(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

/**
 * Human-readable calendar range for a span of voyage days:
 *   same month → "Jun 25–30", cross-month → "Jun 30 – Jul 2", single → "Jul 15".
 */
export function formatVoyageDateRange(dayStart: number, dayEnd: number): string {
  const start = dateForDay(dayStart);
  const end = dateForDay(dayEnd);
  if (dayStart === dayEnd) return fmt(start);
  // Same calendar month → don't repeat the month name on the end.
  if (start.getUTCMonth() === end.getUTCMonth()) {
    return `${fmt(start)}–${end.getUTCDate()}`; // en-dash
  }
  return `${fmt(start)} – ${fmt(end)}`;
}
