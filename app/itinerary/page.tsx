import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { PageHero, CountUp } from "@/components/kit";
import { itinerary } from "@/lib/data/itinerary";
import { legStyle } from "@/lib/data/legStyle";
import { formatVoyageDateRange, dateForDay } from "@/lib/data/voyage";
import { LogScrolly } from "@/components/log/LogScrolly";
import { Chapter } from "@/components/log/Chapter";
import { Coda } from "@/components/log/Coda";
import { HeroRoute } from "@/components/log/HeroRoute";
import {
  buildChapters, buildChartData, buildDaySummaries, buildLegSummaries, placeName, voyageTotals,
} from "@/components/log/model";
import styles from "@/components/log/log.module.css";

export const metadata: Metadata = {
  title: "Ship’s Log — S/V Sabbatical",
  description:
    "The day-by-day log of a 35-day passage from Chicago to Old Saybrook: every leg, berth, lock, highlight and hazard, with the captain’s briefing for each chapter.",
};

export default function ItineraryPage() {
  const t = voyageTotals;
  const chapters = buildChapters();
  const chart = buildChartData();
  const days = buildDaySummaries();
  const legs = buildLegSummaries();
  const first = itinerary[0], last = itinerary[itinerary.length - 1];
  const year = dateForDay(t.dayStart).getUTCFullYear();

  const stats: { k: string; v: number; unit?: string }[] = [
    { k: "Days", v: t.sailingDays },
    { k: "Open water", v: t.distanceNm, unit: "nm" },
    { k: "Canal", v: t.distanceMi, unit: "mi" },
    { k: "Locks", v: t.locks },
  ];

  return (
    <div className="overflow-x-clip pb-28 md:pb-0">
      <div className="relative">
      <HeroRoute
        chart={chart}
        className="pointer-events-none absolute -right-[18%] top-20 w-[125%] opacity-30 [mask-image:linear-gradient(90deg,transparent,black_40%)] md:right-[1%] md:top-[92px] md:w-[min(56vw,800px)] md:opacity-50 [[data-theme=day]_&]:opacity-35 [[data-theme=day]_&]:md:opacity-75"
      />
      <PageHero
        eyebrow={<>Ship&rsquo;s log &middot; Summer {year}</>}
        title={<>The Ship&rsquo;s <em>Log</em></>}
        lede={
          <>
            {t.sailingDays} days, {legs.length} chapters and {t.locks} locks, from {placeName(first.from)}&rsquo;s
            lakefront to the mouth of the Connecticut River at {placeName(last.to)} — every passage, berth and
            hazard, set down one day at a time. Scroll, and the chart keeps pace.
          </>
        }
        aside={
          <div className="glass w-full rounded-[26px] p-6 lg:w-[360px]">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
              {stats.map(s => (
                <div key={s.k}>
                  <dt className="eyebrow !text-[10px]">{s.k}</dt>
                  <dd className="mt-2 flex items-baseline gap-1.5 text-ink">
                    <CountUp value={s.v} className="text-[34px] font-light leading-none" />
                    {s.unit && <span className="num text-[12px] text-ink-3">{s.unit}</span>}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 border-t border-line pt-4">
              <p className="num flex justify-between text-[11px] text-ink-3">
                <span>{formatVoyageDateRange(t.dayStart, t.dayEnd)}, {year}</span>
                <span>{legs.length} legs</span>
              </p>
            </div>
          </div>
        }
      >
        {/* chapter index: the voyage as a spectrum, legs proportional to days */}
        <nav aria-label="Chapters" className="mt-14 md:mt-20">
          {/* phones: proportional slivers are too thin to tap, so use a chip grid */}
          <ol className="grid grid-cols-4 gap-2 md:hidden">
            {legs.map(l => {
              const s = legStyle(l.legId);
              return (
                <li key={l.legId}>
                  <a
                    href={`#leg-${l.legId}`}
                    className="flex min-h-11 items-center gap-1.5 rounded-xl border px-2.5 text-[12px]"
                    style={{ borderColor: s.border, background: s.bg, color: s.color }}
                    aria-label={`Chapter ${s.numeral}: ${s.label}, ${l.dates}`}
                  >
                    <span className="num opacity-80">{s.numeral}</span>
                    <span className="truncate text-ink-2">{s.short}</span>
                  </a>
                </li>
              );
            })}
          </ol>
          <ol className="hidden gap-[3px] overflow-hidden md:flex">
            {legs.map(l => {
              const s = legStyle(l.legId);
              const n = l.dayEnd - l.dayStart + 1;
              return (
                <li key={l.legId} style={{ flex: n + 0.8 }} className="min-w-0">
                  <a
                    href={`#leg-${l.legId}`}
                    className="group block rounded-md pb-2 outline-offset-4"
                    aria-label={`Chapter ${s.numeral}: ${s.label}, ${l.dates}`}
                  >
                    <span
                      aria-hidden
                      className={`${styles.glow} block h-[3px] rounded-full transition-all duration-500 group-hover:h-[6px]`}
                      style={{ background: s.color, "--c": s.color, "--glow-r": "14px", "--glow-a": "33%" } as CSSProperties}
                    />
                    <span aria-hidden className="mt-3 hidden min-w-0 md:block">
                      <span className="num block text-[10px] text-ink-3 transition-colors group-hover:text-ink-2">{s.numeral}</span>
                      <span className="mt-1 block truncate text-[12.5px] text-ink-2 transition-colors group-hover:text-ink">{s.short}</span>
                      <span className="num mt-0.5 block truncate text-[10.5px] text-ink-4">{l.dates}</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      </PageHero>
      </div>

      <LogScrolly chart={chart} days={days} legs={legs}>
        {chapters.map(c => (
          <Chapter key={c.leg.legId} chapter={c} />
        ))}
        <Coda />
      </LogScrolly>
    </div>
  );
}
