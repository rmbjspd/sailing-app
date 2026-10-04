"use client";
import { usePathname } from "next/navigation";
import Mark from "./Mark";

// Hidden on the full-screen chart, where it would sit under the canvas.
export default function Footer() {
  if (usePathname() === "/map") return null;
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 pb-32 pt-14 md:flex-row md:items-end md:justify-between md:px-8 md:pb-14">
        <div className="flex items-center gap-4">
          <Mark className="size-10" />
          <div>
            <p className="font-display text-xl">S/V Sabbatical</p>
            <p className="eyebrow mt-1">Chicago → Old Saybrook · Summer 2027</p>
          </div>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-ink-3">
          Terrain: AWS Terrain Tiles (SRTM, GMTED, NOAA coastal bathymetry). Coastlines &amp; lakes: Natural Earth.
          Lock data: NYS Canal Corporation &amp; USACE. Planning aid only — not for navigation.
        </p>
      </div>
    </footer>
  );
}
