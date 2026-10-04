// Theme constants and the pre-paint script, in a plain (non-client) module so
// the server layout can inline the script. See lib/theme.ts.
import type { Theme } from "@/lib/data/legStyle";

export const THEME_STORAGE_KEY = "sv-theme";
/** Local hours (fractional) when the day chart starts and ends. */
export const DAY_START = 6.5;
export const DAY_END = 19.5;

export function themeForTime(d = new Date()): Theme {
  const h = d.getHours() + d.getMinutes() / 60;
  return h >= DAY_START && h < DAY_END ? "day" : "night";
}

/** Inline, dependency-free version for the pre-paint <script>. Keep in sync. */
export const THEME_SCRIPT = `(function(){try{var p=localStorage.getItem("${THEME_STORAGE_KEY}")||"auto";if(p!=="day"&&p!=="night")p="auto";var d=new Date(),h=d.getHours()+d.getMinutes()/60;var t=p==="auto"?(h>=${DAY_START}&&h<${DAY_END}?"day":"night"):p;var e=document.documentElement;e.dataset.theme=t;e.dataset.themePref=p;}catch(_){document.documentElement.dataset.theme="night";}})();`;

