// Small, pure presentation helpers for the crew manifest (client-safe).

/** Two-letter monogram: first + last word initials, unicode-aware. */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  const first = (w: string) => Array.from(w)[0] ?? "";
  if (words.length === 1) return Array.from(words[0]).slice(0, 2).join("").toUpperCase();
  return (first(words[0]) + first(words[words.length - 1])).toUpperCase();
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

/** Number of voyage days in a roster dayRange like "1–6" or "15". */
export function dayCount(dayRange: string): number {
  const [a, b] = dayRange.split(/[–-]/).map((n) => Number(n.trim()));
  if (!Number.isFinite(a)) return 1;
  return Number.isFinite(b) ? Math.max(1, b - a + 1) : 1;
}

export function dayLabel(dayRange: string): string {
  return /[–-]/.test(dayRange) ? `Days ${dayRange}` : `Day ${dayRange}`;
}

/** mailto:/tel: link for a free-text contact, when it plainly is one. */
export function contactHref(contact: string): string | null {
  const c = contact.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)) return `mailto:${c}`;
  if (/^\+?[\d\s().-]{7,}$/.test(c) && (c.match(/\d/g)?.length ?? 0) >= 7)
    return `tel:${c.replace(/[^\d+]/g, "")}`;
  return null;
}

const WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
export function numberWord(n: number, capital = false): string {
  const w = WORDS[n] ?? String(n);
  return capital ? w.charAt(0).toUpperCase() + w.slice(1) : w;
}

/** "Oct 4" — fixed to UTC so server and client always agree. */
export function signedOn(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}
