"use client";
import { useEffect } from "react";
import { applyTheme } from "@/lib/theme";

// Re-evaluates the time-of-day theme every minute (and when the tab returns
// to the foreground), so an open page turns over at dawn and dusk.
export default function ThemeClock() {
  useEffect(() => {
    applyTheme();
    const id = window.setInterval(() => applyTheme(), 60_000);
    const onVis = () => { if (!document.hidden) applyTheme(); };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("storage", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("storage", onVis);
    };
  }, []);
  return null;
}
