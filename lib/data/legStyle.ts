// Per-leg presentation tokens. Single source of truth shared by every view
// (home, 3D world, ship's log, crew manifest, data viz) so a leg is always the
// same colour everywhere. All days/distances are still derived from itinerary.ts.
//
// Palette: a "dawn → dusk" spectral journey — cool open-lake blues and jades
// warming through the canal's amber into the rose of the final landfall. Every
// colour is tuned to read on the dark night-chart background (L* ≈ 70–80).
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
  /** Primary leg colour (hex — safe for WebGL, SVG and CSS alike) */
  color: string;
  /** Same as color; legacy name used by crew roster view models */
  accent: string;
  /** Translucent fill for chips/panels on the dark background */
  bg: string;
  /** Translucent border for chips/panels on the dark background */
  border: string;
  /** Open water vs inland canal/river — affects route styling */
  inland: boolean;
}

function leg(
  label: string, short: string, numeral: string, tagline: string, emoji: string,
  color: string, inland = false,
): LegStyle {
  return {
    label, short, numeral, tagline, emoji, color, inland,
    accent: color,
    bg: `${color}1a`,
    border: `${color}4d`,
  };
}

export const LEG_STYLE: Record<string, LegStyle> = {
  "lake-michigan":  leg("Lake Michigan",              "Michigan",   "I",    "A freshwater sea, 300 miles of open fetch",       "🌊", "#5aa9ff"),
  "north-channel":  leg("North Channel · Manitoulin", "N. Channel", "II",   "Pink granite, gin-clear water, dark skies",       "🍁", "#3ee0b5"),
  "lake-huron":     leg("Lake Huron",                 "Huron",      "III",  "The long Ontario shore south",                    "💧", "#7fd8ff"),
  "st-clair":       leg("St. Clair · Detroit River",  "St. Clair",  "IV",   "Freighter country, two knots of free speed",      "🚢", "#9d8cff"),
  "lake-erie":      leg("Lake Erie",                  "Erie",       "V",    "Shallow, quick-tempered, island-strewn",          "⛈️", "#c77dff"),
  "erie-canal":     leg("Erie Canal",                 "Canal",      "VI",   "Mast down, 363 miles of locks and towpath",       "⚓", "#ffb547", true),
  "hudson":         leg("Hudson River",               "Hudson",     "VII",  "Riding the ebb past the Palisades",               "🌉", "#ff8a5c", true),
  "sound-saybrook": leg("Long Island Sound",          "The Sound",  "VIII", "Beam reach east to the Connecticut River",        "⛵", "#ff5d8f"),
};

export const LEG_ORDER = [
  "lake-michigan", "north-channel", "lake-huron", "st-clair",
  "lake-erie", "erie-canal", "hudson", "sound-saybrook",
] as const;

export function legStyle(legId: string): LegStyle {
  return LEG_STYLE[legId] ?? leg(legId, legId, "", "", "", "#5ef2d6");
}
