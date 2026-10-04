// Per-leg presentation tokens. Single source of truth shared by every view
// (home, 3D world, ship's log, crew manifest, data viz) so a leg is always the
// same colour everywhere.
//
// Two palettes, one per theme (see app/globals.css and lib/theme.ts):
//   night — a "dawn → dusk" spectral journey tuned to glow on the dark chart
//   day   — the same hues, deepened to read as ink on khaki chart paper (AA)
//
// `color` / `bg` / `border` are CSS values that follow the active theme
// (`var(--leg-…)`), safe for style props and SVG fill/stroke. Never append
// hex-alpha to them — use `alpha(color, 0.3)`. WebGL and anything else that
// needs a literal colour uses `hex` / `hexDay` (or `legHex(id, theme)`).
export interface LegStyle {
  /** Full display name */
  label: string;
  /** Compact name for tight spaces (chips, axis labels) */
  short: string;
  /** Roman-numeral chapter number, I–VIII */
  numeral: string;
  /** One-line poetic descriptor used in chapter headers */
  tagline: string;
  /** Kept for backwards compatibility; not rendered in the redesigned UI */
  emoji: string;
  /** Theme-aware leg colour: `var(--leg-<id>)` */
  color: string;
  /** Same as color; legacy name used by crew roster view models */
  accent: string;
  /** Theme-aware translucent fill for chips/panels */
  bg: string;
  /** Theme-aware translucent border for chips/panels */
  border: string;
  /** Open water vs inland canal/river — affects route styling */
  inland: boolean;
  /** Literal night-palette colour (WebGL, canvas) */
  hex: string;
  /** Literal day-palette colour (WebGL, canvas) */
  hexDay: string;
}

export type Theme = "day" | "night";

/** Translucent version of any CSS colour (works with var(): uses color-mix). */
export function alpha(color: string, a: number): string {
  return `color-mix(in srgb, ${color} ${Math.round(a * 1000) / 10}%, transparent)`;
}

function leg(
  id: string, label: string, short: string, numeral: string, tagline: string, emoji: string,
  hex: string, hexDay: string, inland = false,
): LegStyle {
  const color = `var(--leg-${id})`;
  return {
    label, short, numeral, tagline, emoji, inland, hex, hexDay,
    color, accent: color,
    bg: alpha(color, 0.1),
    border: alpha(color, 0.3),
  };
}

export const LEG_STYLE: Record<string, LegStyle> = {
  "lake-michigan":  leg("lake-michigan",  "Lake Michigan",              "Michigan",   "I",    "A freshwater sea, 300 miles of open fetch",        "🌊", "#5aa9ff", "#2a64a3"),
  "north-channel":  leg("north-channel",  "North Channel · Manitoulin", "N. Channel", "II",   "Pink granite, gin-clear water, dark skies",        "🍁", "#3ee0b5", "#14705a"),
  "lake-huron":     leg("lake-huron",     "Lake Huron",                 "Huron",      "III",  "The long Ontario shore south",                     "💧", "#7fd8ff", "#196e8c"),
  "st-clair":       leg("st-clair",       "St. Clair · Detroit River",  "St. Clair",  "IV",   "Freighter country, two knots of free speed",       "🚢", "#9d8cff", "#5f55c4"),
  "lake-erie":      leg("lake-erie",      "Lake Erie",                  "Erie",       "V",    "Shallow, quick-tempered, island-strewn",           "⛈️", "#c77dff", "#8146b5"),
  "erie-canal":     leg("erie-canal",     "Erie Canal",                 "Canal",      "VI",   "Mast down, 34 locks from Lake Erie to the Hudson", "⚓", "#ffb547", "#875408", true),
  "hudson":         leg("hudson",         "Hudson River",               "Hudson",     "VII",  "Riding the ebb past the Palisades",                "🌉", "#ff8a5c", "#a3441d", true),
  "sound-saybrook": leg("sound-saybrook", "Long Island Sound",          "The Sound",  "VIII", "Beam reach east to the Connecticut River",         "⛵", "#ff5d8f", "#b8345f"),
};

export const LEG_ORDER = [
  "lake-michigan", "north-channel", "lake-huron", "st-clair",
  "lake-erie", "erie-canal", "hudson", "sound-saybrook",
] as const;

const FALLBACK = leg("fallback", "", "", "", "", "", "#5ef2d6", "#256591");

export function legStyle(legId: string): LegStyle {
  return LEG_STYLE[legId] ?? { ...FALLBACK, label: legId, short: legId };
}

/** Literal hex for a leg in the given theme (WebGL / canvas). */
export function legHex(legId: string, theme: Theme): string {
  const s = legStyle(legId);
  return theme === "day" ? s.hexDay : s.hex;
}
