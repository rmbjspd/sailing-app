import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CountUp } from "@/components/kit";
import { itinerary } from "@/lib/data/itinerary";
import { legGroups } from "@/lib/data/stats";
import { legStyle } from "@/lib/data/legStyle";
import { voyageTotals, placeName } from "./model";

// Closing coda after the arrival: the logbook totals and the voyage as one
// spectrum line. Reaching it pulls the chart back to the whole passage.
const WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

export function Coda() {
  const t = voyageTotals;
  const legs = legGroups();
  const first = itinerary[0], last = itinerary[itinerary.length - 1];
  const stats: { v: number; k: string; d?: number; pre?: string }[] = [
    { v: t.sailingDays, k: "Days" },
    { v: t.distanceNm, k: "Nautical miles" },
    { v: t.distanceMi, k: "Canal miles" },
    { v: t.locks, k: "Locks" },
    { v: legs.length, k: "Chapters" },
  ];

  return (
    <section
      id="landfall"
      data-step="coda"
      tabIndex={-1}
      aria-labelledby="landfall-h"
      className="relative isolate pb-40 pt-28 outline-none md:pb-48 md:pt-40"
    >
      <div aria-hidden className="pointer-events-none absolute -left-[100vw] -right-[100vw] inset-y-0 -z-10 bg-[radial-gradient(45%_60%_at_35%_30%,rgb(255_93_143_/_0.10),transparent_70%)]">
        <div className="spectrum-line absolute inset-x-0 top-0 !h-px opacity-60" />
      </div>

      <p className="eyebrow flex items-center gap-3">
        <span className="spectrum-line w-10" aria-hidden />
        The log, closed
      </p>
      <h2 id="landfall-h" className="mt-6 font-display text-[clamp(2.8rem,6vw,5.25rem)] font-light leading-[0.92] text-ink">
        One wake, <em className="text-spectrum">{WORDS[legs.length] ?? legs.length} waters.</em>
      </h2>
      <p className="mt-7 max-w-[56ch] text-[17px] leading-relaxed text-ink-2">
        From {placeName(first.from)} to {placeName(last.to)}: {t.distanceNm.toLocaleString("en-US")} nautical miles of
        open water, {t.distanceMi} statute miles of canal and {t.locks} locks, in {t.sailingDays} days. Scroll back
        up and the chart will sail it again.
      </p>

      <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-8 md:gap-x-12">
        {stats.map(s => (
          <div key={s.k}>
            <dt className="eyebrow whitespace-nowrap !text-[10px]">{s.k}</dt>
            <dd className="mt-2 text-[clamp(1.9rem,3.2vw,2.6rem)] font-light leading-none text-ink">
              <CountUp value={s.v} />
            </dd>
          </div>
        ))}
      </dl>

      {/* the voyage as one line, legs proportional to days */}
      <div className="mt-14">
        <div className="flex h-2 gap-[3px]" aria-hidden>
          {legs.map(l => (
            <span
              key={l.legId}
              className="rounded-full"
              style={{ flex: l.days.length, background: legStyle(l.legId).color, boxShadow: `0 0 12px ${legStyle(l.legId).color}66` }}
            />
          ))}
        </div>
        <ol className="mt-3 flex gap-[3px]">
          {legs.map(l => (
            <li key={l.legId} style={{ flex: l.days.length }} className="min-w-0">
              <a
                href={`#leg-${l.legId}`}
                className="num block truncate rounded py-1 text-[10px] text-ink-3 transition-colors hover:text-ink"
                aria-label={`Chapter ${legStyle(l.legId).numeral}: ${legStyle(l.legId).label}`}
              >
                {legStyle(l.legId).numeral}
              </a>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-14 flex flex-wrap gap-3">
        <Link
          href="/map"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-medium text-abyss transition hover:bg-white"
        >
          Fly the 3D chart <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden />
        </Link>
        <Link
          href="/checklists"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-5 text-[14px] text-ink-2 transition hover:border-ink-3 hover:text-ink"
        >
          Provisioning lists <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
