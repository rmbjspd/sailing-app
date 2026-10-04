import { itinerary } from "@/lib/data/itinerary";
import { dateForDay } from "@/lib/data/voyage";
import type { ItineraryDay, JournalEntry } from "@/lib/types";

// Date + voyage-day helpers for the Logbook. Entry dates are stored as plain
// "YYYY-MM-DD" strings (from <input type="date">); they are treated as calendar
// dates in UTC so a viewer west of Greenwich never sees them slip a day.

export const VOYAGE_DAYS: ItineraryDay[] = itinerary.filter(d => d.day > 0);
export const LAST_DAY = Math.max(...VOYAGE_DAYS.map(d => d.day));

export function itineraryDay(day: number): ItineraryDay | undefined {
  return day > 0 ? itinerary.find(d => d.day === day) : undefined;
}

/** "YYYY-MM-DD" for a voyage day. */
export function isoForDay(day: number): string {
  return dateForDay(day).toISOString().slice(0, 10);
}

/** Voyage day for a "YYYY-MM-DD" date, or 0 when outside the voyage. */
export function dayForIso(iso: string): number {
  const d = parseEntryDate(iso);
  if (!d) return 0;
  for (const v of VOYAGE_DAYS) if (isoForDay(v.day) === iso.slice(0, 10)) return v.day;
  return 0;
}

/** Today's local calendar date as "YYYY-MM-DD". */
export function todayIso(): string {
  const now = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

export function parseEntryDate(value: string): Date | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  const d = m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatEntryDate(value: string, opts: Intl.DateTimeFormatOptions): string {
  const d = parseEntryDate(value);
  return d ? d.toLocaleDateString("en-US", { ...opts, timeZone: "UTC" }) : "Undated";
}

/** Short place name: "St. Joseph, MI" → "St. Joseph". */
export function placeShort(name: string): string {
  return name.replace(/,\s*[A-Z]{2}$/, "");
}

/** "Leland → Mackinac Island", or "Layover · Mackinac Island". */
export function routeLabel(d: ItineraryDay): string {
  const from = placeShort(d.from);
  const to = placeShort(d.to);
  return from === to ? `Layover · ${to}` : `${from} → ${to}`;
}

export function wordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

/** Sort key: calendar date, then voyage day, then creation time. */
export function compareEntries(a: JournalEntry, b: JournalEntry): number {
  return (
    (a.date || "").localeCompare(b.date || "") ||
    (a.day || 0) - (b.day || 0) ||
    (a.createdAt || "").localeCompare(b.createdAt || "")
  );
}
