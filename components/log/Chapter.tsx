import type { CSSProperties } from "react";
import { ChevronDown, Compass, TriangleAlert, Wind, MapPin } from "lucide-react";
import { legStyle } from "@/lib/data/legStyle";
import { formatLegDistance } from "@/lib/data/stats";
import { formatVoyageDateRange } from "@/lib/data/voyage";
import type { LegGuide } from "@/lib/data/legGuides";
import { Disclosure } from "./Disclosure";
import { DayEntry } from "./DayEntry";
import { dayDistanceEquiv, dayDistanceLabel, isStationary, type Chapter as ChapterModel } from "./model";
import styles from "./log.module.css";

/** "Lake Michigan" → Lake <em>Michigan</em>; "North Channel · Manitoulin" → North Channel <em>· Manitoulin</em> */
function DisplayName({ label }: { label: string }) {
  const [a, b] = label.split(" · ");
  if (b) return <>{a} <em className="whitespace-nowrap text-ink-2">&middot;&nbsp;{b}</em></>;
  const words = label.split(" ");
  const last = words.pop();
  return <>{words.join(" ")} <em>{last}</em></>;
}

function Briefing({ guide, color }: { guide: LegGuide; color: string }) {
  const [lead, ...rest] = guide.captainIntro.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const hid = `brief-${guide.legId}`;
  return (
    <section aria-labelledby={hid} className="relative mt-10 overflow-hidden rounded-[26px] border border-line bg-gradient-to-b from-white/[0.045] to-white/[0.01]">
      <div aria-hidden className="absolute inset-y-6 left-0 w-[2px] rounded-full" style={{ background: color, boxShadow: `0 0 16px ${color}` }} />
      <div className="px-6 pb-2 pt-7 md:px-10 md:pt-9">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3 id={hid} className="eyebrow flex items-center gap-2.5 !text-ink-2">
            <Compass className="size-3.5" strokeWidth={1.75} aria-hidden style={{ color }} />
            Captain&rsquo;s briefing
          </h3>
          <p className="text-[12.5px] text-ink-3">{guide.subtitle}</p>
        </div>
        <p className={`${styles.dropcap} mt-6 font-display text-[17px] font-light leading-[1.65] text-ink/90 md:text-[19.5px]`}>
          {lead}
        </p>
      </div>

      <Disclosure
        label={`Full briefing: ${guide.title}`}
        buttonClassName="flex min-h-14 w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-white/[0.025] md:px-10"
        summary={
          <>
            <span className="h-px flex-1 bg-line" aria-hidden />
            <span className="text-[13px] text-ink-2 transition-colors group-hover:text-ink">
              <span className="group-aria-expanded:hidden">Continue the briefing</span>
              <span className="hidden group-aria-expanded:inline">Fold the briefing</span>
            </span>
            <span className="num hidden text-[11px] text-ink-3 sm:inline">
              {guide.sailingTips.length} tips · {guide.watchFor.length} hazards · {guide.bestStops.length} stops
            </span>
            <span className="grid size-8 place-items-center rounded-full border border-line text-ink-2 transition group-hover:border-line-strong">
              <ChevronDown className="size-4 transition-transform duration-300 group-aria-expanded:rotate-180" strokeWidth={1.75} aria-hidden />
            </span>
          </>
        }
        panelClassName="px-6 pb-8 md:px-10 md:pb-10"
      >
        <div className="space-y-4 pt-2">
          {rest.map((p, i) => (
            <p key={i} className="max-w-[68ch] text-[15.5px] leading-[1.75] text-ink-2">{p}</p>
          ))}
        </div>

        <div className="mt-9 grid gap-8 md:grid-cols-2 md:gap-10">
          <div>
            <h4 className="eyebrow mb-4 flex items-center gap-2 !text-glow">
              <Wind className="size-3.5" strokeWidth={1.75} aria-hidden /> Seamanship
            </h4>
            <ol className="space-y-4">
              {guide.sailingTips.map((t, i) => (
                <li key={i} className="grid grid-cols-[1.75rem_1fr] text-[14px] leading-relaxed text-ink-2">
                  <span className="num pt-[2px] text-[11px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h4 className="eyebrow mb-4 flex items-center gap-2 !text-alert">
              <TriangleAlert className="size-3.5" strokeWidth={1.75} aria-hidden /> Watch for
            </h4>
            <ul className="space-y-3">
              {guide.watchFor.map((w, i) => (
                <li key={i} className="rounded-xl border border-alert/20 bg-alert/[0.05] px-4 py-3 text-[14px] leading-relaxed text-[#f3c3bc]">
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <h4 className="eyebrow mb-4 flex items-center gap-2 !text-brass">
            <MapPin className="size-3.5" strokeWidth={1.75} aria-hidden /> Best stops
          </h4>
          <ul className="grid gap-3 sm:grid-cols-2">
            {guide.bestStops.map((b, i) => {
              const cut = b.indexOf(": ");
              const name = cut > 0 ? b.slice(0, cut) : null;
              const body = cut > 0 ? b.slice(cut + 2) : b;
              return (
                <li key={i} className="rounded-2xl border border-line bg-white/[0.02] p-4 sm:last:odd:col-span-2">
                  {name && <p className="font-display text-[17px] leading-snug text-ink">{name}</p>}
                  <p className={`text-[13.5px] leading-relaxed text-ink-2 ${name ? "mt-1.5" : ""}`}>{body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </Disclosure>
    </section>
  );
}

export function Chapter({ chapter }: { chapter: ChapterModel }) {
  const { leg, guide, index } = chapter;
  const s = legStyle(leg.legId);
  const underway = leg.days.filter(d => !isStationary(d)).length;
  const longest = leg.days.reduce((a, b) => (dayDistanceEquiv(b) > dayDistanceEquiv(a) ? b : a));
  const longestLabel = dayDistanceLabel(longest);
  const vars = { "--leg": s.color } as CSSProperties;

  const stats: [string, string][] = [
    ["Distance", formatLegDistance(leg)],
    ["Sailing days", `${underway} of ${leg.days.length}`],
    ["Locks", leg.locks ? String(leg.locks) : "None"],
    ["Longest day", longestLabel ? `${longestLabel.value} ${longestLabel.unit}` : "—"],
  ];

  return (
    <section aria-labelledby={`leg-${leg.legId}-h`} style={vars}>
      <header
        id={`leg-${leg.legId}`}
        data-step={`leg:${index}`}
        tabIndex={-1}
        className="relative isolate pb-6 pt-24 outline-none md:pt-36"
      >
        {/* full-bleed chapter band */}
        <div aria-hidden className={`${styles.band} pointer-events-none absolute -left-[100vw] -right-[100vw] bottom-0 top-0 -z-10`}>
          <div className={`${styles.bandLine} absolute inset-x-0 top-0 h-px`} />
        </div>

        <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1" style={{ color: s.color }}>
          <span>Chapter {s.numeral}</span>
          <span aria-hidden className="h-px w-8 bg-current opacity-50" />
          <span className="num !text-ink-3">Days {leg.dayStart}–{leg.dayEnd}</span>
          <span className="num !text-ink-3">{formatVoyageDateRange(leg.dayStart, leg.dayEnd)}</span>
        </p>

        <div aria-hidden className={`${styles.numeral} mt-6 select-none font-display text-[clamp(5.5rem,11vw,9rem)] font-light leading-[0.78] tracking-[-0.04em]`}>
          {s.numeral}
        </div>
        <h2 id={`leg-${leg.legId}-h`} className="mt-3 font-display text-[clamp(2.6rem,5.2vw,4.5rem)] font-light leading-[0.92] text-ink">
          <span className="sr-only">Chapter {s.numeral}: </span>
          <DisplayName label={s.label} />
        </h2>
        <p className="mt-5 max-w-xl font-display text-[19px] font-light italic leading-snug text-ink-2 md:text-[21px]">
          {s.tagline}
        </p>

        <dl className="mt-9 grid grid-cols-2 overflow-hidden rounded-2xl border border-line sm:grid-cols-4">
          {stats.map(([k, v], i) => (
            <div
              key={k}
              className={`bg-abyss/40 px-4 py-4 md:px-5 ${i % 2 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line sm:border-t-0" : ""} ${i === 2 ? "sm:border-l" : ""}`}
            >
              <dt className="eyebrow !text-[10px]">{k}</dt>
              <dd className="num mt-2 text-[17px] text-ink md:text-[19px]">{v}</dd>
            </div>
          ))}
        </dl>

        {guide && <Briefing guide={guide} color={s.color} />}
      </header>

      {/* the days, threaded on a glowing spine */}
      <div className="relative mt-6">
        <div aria-hidden className={`${styles.spine} absolute bottom-0 left-[21px] top-0 w-px`} />
        <ol className="relative" aria-label={`${s.label}, days ${leg.dayStart} to ${leg.dayEnd}`}>
          {leg.days.map(d => (
            <li key={d.day}>
              <DayEntry day={d} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
