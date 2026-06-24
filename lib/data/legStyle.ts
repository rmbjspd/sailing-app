// Per-leg presentation tokens (label, emoji, colour accents). Single source of
// truth shared by the voyage overview (app/page.tsx) and the crew manifest so
// the two never drift. All days/distances are still derived from itinerary.ts.
export interface LegStyle {
  label: string;
  emoji: string;
  accent: string;
  bg: string;
  border: string;
}

export const LEG_STYLE: Record<string, LegStyle> = {
  "lake-michigan":  { label: "Lake Michigan",              emoji: "🌊", accent: "hsl(210 65% 42%)", bg: "hsl(210 55% 90%)", border: "hsl(210 60% 68%)" },
  "north-channel":  { label: "North Channel · Manitoulin", emoji: "🍁", accent: "hsl(165 52% 36%)", bg: "hsl(165 38% 90%)", border: "hsl(165 48% 62%)" },
  "lake-huron":     { label: "Lake Huron",                 emoji: "💧", accent: "hsl(195 55% 38%)", bg: "hsl(195 45% 90%)", border: "hsl(195 50% 64%)" },
  "st-clair":       { label: "St. Clair · Detroit River",  emoji: "🚢", accent: "hsl(220 48% 40%)", bg: "hsl(220 40% 90%)", border: "hsl(220 44% 66%)" },
  "lake-erie":      { label: "Lake Erie",                  emoji: "⛈️", accent: "hsl(205 60% 40%)", bg: "hsl(205 50% 90%)", border: "hsl(205 55% 66%)" },
  "erie-canal":     { label: "Erie Canal",                 emoji: "⚓", accent: "hsl(42 78% 44%)",  bg: "hsl(42 60% 91%)",  border: "hsl(42 72% 64%)" },
  "hudson":         { label: "Hudson River",               emoji: "🌉", accent: "hsl(148 45% 34%)", bg: "hsl(148 35% 90%)", border: "hsl(148 42% 60%)" },
  "sound-saybrook": { label: "Long Island Sound",          emoji: "⛵", accent: "hsl(200 65% 40%)", bg: "hsl(200 50% 90%)", border: "hsl(200 60% 66%)" },
};
