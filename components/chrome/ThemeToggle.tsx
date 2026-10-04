"use client";
import { Sun, Moon, SunMoon } from "lucide-react";
import { setThemePref, useTheme, useThemePref, type ThemePref } from "@/lib/theme";

const NEXT: Record<ThemePref, ThemePref> = { auto: "day", day: "night", night: "auto" };
const LABEL: Record<ThemePref, string> = {
  auto: "Chart follows the time of day",
  day: "Day chart",
  night: "Night chart",
};

// One button cycling Auto → Day → Night. Auto shows a sun/moon glyph tinted
// for whichever chart the clock has chosen.
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const pref = useThemePref();
  const theme = useTheme();
  const Icon = pref === "day" ? Sun : pref === "night" ? Moon : SunMoon;
  return (
    <button
      type="button"
      onClick={() => setThemePref(NEXT[pref])}
      aria-label={`${LABEL[pref]}. Switch to ${LABEL[NEXT[pref]].toLowerCase()}.`}
      title={`${LABEL[pref]} — click for ${NEXT[pref] === "auto" ? "automatic" : NEXT[pref]}`}
      className={`grid size-11 place-items-center rounded-full transition-colors hover:bg-tint/[0.08] ${className}`}
    >
      <Icon className={`size-[18px] ${theme === "day" ? "text-brass" : "text-glow"}`} strokeWidth={1.75} />
      <span className="sr-only">{LABEL[pref]}</span>
    </button>
  );
}
