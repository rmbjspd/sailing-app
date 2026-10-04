// Day / night theming.
//
// The theme follows the viewer's local clock by default: the day chart from
// DAY_START to DAY_END, the night chart otherwise. A viewer can pin Day or
// Night (stored per device). The pre-paint script in app/layout.tsx applies
// the theme before first paint (no flash); <ThemeClock/> re-evaluates every
// minute so an open tab turns over at dusk and dawn.
//
// DOM state: <html data-theme="day|night" data-theme-pref="auto|day|night">
"use client";
import { useSyncExternalStore } from "react";
import type { Theme } from "@/lib/data/legStyle";

export type { Theme };
export type ThemePref = "auto" | Theme;

import { THEME_STORAGE_KEY, themeForTime } from "./themeScript";
export { THEME_STORAGE_KEY, DAY_START, DAY_END, THEME_SCRIPT, themeForTime } from "./themeScript";

function readPref(): ThemePref {
  try {
    const p = localStorage.getItem(THEME_STORAGE_KEY);
    return p === "day" || p === "night" ? p : "auto";
  } catch {
    return "auto";
  }
}

export function applyTheme(pref: ThemePref = readPref()) {
  const el = document.documentElement;
  const t = pref === "auto" ? themeForTime() : pref;
  if (el.dataset.theme !== t) {
    // cross-fade colours when the chart turns over while the page is open
    el.classList.add("theme-fade");
    el.dataset.theme = t;
    window.setTimeout(() => el.classList.remove("theme-fade"), 900);
  }
  if (el.dataset.themePref !== pref) el.dataset.themePref = pref;
  const meta = document.querySelector('meta[name="theme-color"]');
  meta?.setAttribute("content", t === "day" ? "#efe8d6" : "#03060c");
}

export function setThemePref(pref: ThemePref) {
  try {
    if (pref === "auto") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {}
  applyTheme(pref);
}

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-theme-pref"] });
  return () => mo.disconnect();
}

/** Active theme. Server render assumes night; the client corrects after hydration. */
export function useTheme(): Theme {
  return useSyncExternalStore(
    subscribe,
    () => (document.documentElement.dataset.theme === "day" ? "day" : "night"),
    () => "night",
  );
}

export function useThemePref(): ThemePref {
  return useSyncExternalStore(
    subscribe,
    () => (document.documentElement.dataset.themePref as ThemePref) || "auto",
    () => "auto",
  );
}
