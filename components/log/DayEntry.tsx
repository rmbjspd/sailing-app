import type { CSSProperties } from "react";
import { ArrowRight, Anchor, ChevronDown, Sparkles, TriangleAlert, BedDouble } from "lucide-react";
import type { ItineraryDay } from "@/lib/types";
import { legStyle } from "@/lib/data/legStyle";
import { Disclosure } from "./Disclosure";
import { dayDistanceEquiv, dayDistanceLabel, dayTrack, isStationary, maxDayEquiv, placeName, shortDate, lastDayNumber } from "./model";
import styles from "./log.module.css";

const pad = (n: number) => String(n).padStart(2, "0");
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

function DistanceGauge({ day, color, large = false }: { day: ItineraryDay; color: string; large?: boolean }) {
  const dist = dayDistanceLabel(day);
  if (!dist) return null;
  const pct = (dayDistanceEquiv(day) / maxDayEquiv) * 100;
  return (
    <span className="flex items-center gap-3">
      <span
        aria-hidden
        className={`relative h-[3px] overflow-hidden rounded-full bg-white/[0.07] ${large ? "w-36" : "w-24 md:w-28"}`}
      >
        <span
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 10px ${color}` }}
        />
      </span>
      <span>
        <span className={`num text-ink ${large ? "text-lg" : "text-[15px]"}`}>{dist.value}</span>
        <span className="ml-1 text-ink-3">{dist.unit === "nm" ? "nm" : "mi"}</span>
        <span className="sr-only">{dist.unit === "nm" ? " nautical miles" : " statute miles (canal)"}</span>
      </span>
    </span>
  );
}

/** Thumbnail of the day's actual track, north up, scaled to fit. */
function Track({ day, className = "" }: { day: number; className?: string }) {
  const t = dayTrack(day);
  if (!t) return null;
  const [x, y, w, h] = t.box;
  const side = Math.max(w, h * 1.5, 24);
  const vw = side * 1.6, vh = vw / 1.5;
  const cx = x + w / 2, cy = y + h / 2;
  const pts = t.d.slice(1).split("L");
  const [sx, sy] = pts[0].split(" ").map(Number);
  const [ex, ey] = pts[pts.length - 1].split(" ").map(Number);
  const u = vw / 72; // one screen px in track units
  return (
    <div aria-hidden className={`overflow-hidden rounded-xl border border-line bg-[linear-gradient(rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.035)_1px,transparent_1px)] bg-[size:12px_12px] ${className}`}>
    <svg viewBox={`${cx - vw / 2} ${cy - vh / 2} ${vw} ${vh}`} className="h-full w-full">
      <path d={t.d} fill="none" stroke={t.color} strokeOpacity={0.25} strokeWidth={6 * u} strokeLinecap="round" strokeLinejoin="round" />
      <path d={t.d} fill="none" stroke={t.color} strokeWidth={1.5 * u} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={sx} cy={sy} r={2.5 * u} fill="var(--abyss)" stroke={t.color} strokeWidth={1.25 * u} />
      <circle cx={ex} cy={ey} r={3 * u} fill={t.color} />
    </svg>
    </div>
  );
}

function LockPips({ locks, color }: { locks: number; color: string }) {
  if (!locks) return null;
  return (
    <span className="flex items-center gap-2.5">
      <span aria-hidden className="flex items-center gap-[3px]">
        {Array.from({ length: locks }, (_, i) => (
          <span key={i} className="h-3 w-[5px] rounded-[2px]" style={{ background: color, opacity: 0.9 }} />
        ))}
      </span>
      <span className="text-ink-2">
        <span className="num text-ink">{locks}</span> {locks === 1 ? "lock" : "locks"}
      </span>
    </span>
  );
}

function Notables({ day, open = false }: { day: ItineraryDay; open?: boolean }) {
  const both = day.highlights.length > 0 && day.warnings.length > 0;
  return (
    <div className={`grid items-start gap-3 ${both ? "md:grid-cols-2" : ""} ${open ? "" : "pt-4"}`}>
      {day.highlights.length > 0 && (
        <div className="rounded-2xl border border-line bg-white/[0.025] p-4 md:p-5">
          <p className="eyebrow mb-3 flex items-center gap-2 !text-glow">
            <Sparkles className="size-3.5" strokeWidth={1.75} aria-hidden /> Highlights
          </p>
          <ul className="space-y-2.5">
            {day.highlights.map((h, i) => (
              <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-ink-2">
                <span aria-hidden className="mt-[9px] size-1.5 shrink-0 rounded-full bg-glow shadow-[0_0_8px_var(--glow)]" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {day.warnings.length > 0 && (
        <div className="rounded-2xl border border-alert/25 bg-alert/[0.05] p-4 md:p-5">
          <p className="eyebrow mb-3 flex items-center gap-2 !text-alert">
            <TriangleAlert className="size-3.5" strokeWidth={1.75} aria-hidden /> Hazards
          </p>
          <ul className="space-y-2.5">
            {day.warnings.map((w, i) => (
              <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-[#f3c3bc]">
                <span aria-hidden className="mt-[8px] h-[7px] w-[7px] shrink-0 rotate-45 border border-alert" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function DayEntry({ day }: { day: ItineraryDay }) {
  const s = legStyle(day.leg);
  const stationary = isStationary(day);
  const arrival = day.day === lastDayNumber;
  const from = placeName(day.from), to = placeName(day.to);
  const vars = { "--leg": s.color } as CSSProperties;
  const hid = `day-${day.day}-h`;

  if (arrival) {
    return (
      <article
        id={`day-${day.day}`}
        data-step={`day:${day.day}`}
        tabIndex={-1}
        aria-labelledby={hid}
        className="relative pb-6 pl-14 pt-10 outline-none md:pl-20"
        style={vars}
      >
        <div aria-hidden className="absolute left-0 top-12 grid size-11 place-items-center">
          <span className="absolute inset-0 rounded-full pulse-glow" style={{ boxShadow: `0 0 0 1px ${s.color}, 0 0 40px 6px ${s.color}66` }} />
          <span className={`${styles.node} num relative grid size-11 place-items-center rounded-full border bg-abyss text-[13px]`}>
            {pad(day.day)}
          </span>
        </div>
        <div className={`${styles.arrivalGlow} relative overflow-hidden rounded-[28px] border p-6 md:p-10`} style={{ borderColor: `${s.color}55` }}>
          <div aria-hidden className="spectrum-line absolute inset-x-0 top-0 !h-px opacity-80" />
          <Track day={day.day} className="absolute right-6 top-6 h-16 w-24 md:right-10 md:top-10 md:h-20 md:w-32" />
          <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 pr-24">
            <span style={{ color: s.color }}>Landfall</span>
            <span aria-hidden className="h-px w-6 bg-line-strong" />
            <span className="num">Day {day.day}</span>
            <span className="num">{shortDate(day.day)}</span>
          </p>
          <h3 id={hid} className="mt-5 font-display text-[clamp(2.4rem,5vw,4.25rem)] font-light leading-[0.95] text-ink">
            <span className="text-ink-2">{from}</span>
            <ArrowRight aria-label="to" className="mx-3 inline size-[0.55em] -translate-y-[0.08em]" strokeWidth={1.25} style={{ color: s.color }} />
            <em className="whitespace-nowrap">{to}</em>
          </h3>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px]">
            <DistanceGauge day={day} color={s.color} large />
            <span className="flex min-w-0 items-center gap-2 text-ink-2">
              <BedDouble className="size-4 shrink-0 text-ink-3" strokeWidth={1.5} aria-hidden />
              <span className="sr-only">Overnight:</span>
              {day.overnight}
            </span>
          </div>
          <p className="mt-6 max-w-[62ch] font-display text-[19px] font-light leading-[1.6] text-ink/90">{day.notes}</p>
          <div className="mt-8">
            <Notables day={day} open />
          </div>
        </div>
      </article>
    );
  }

  const notableCount = day.highlights.length + day.warnings.length;

  return (
    <article
      id={`day-${day.day}`}
      data-step={`day:${day.day}`}
      tabIndex={-1}
      aria-labelledby={hid}
      className={`${styles.rise} relative py-7 pl-14 outline-none md:py-9 md:pl-20`}
      style={vars}
    >
      {/* node on the spine */}
      <div
        aria-hidden
        className={`${styles.node} num absolute left-0 top-7 grid size-11 place-items-center rounded-full border bg-abyss text-[13px] md:top-9 ${
          stationary ? "border-dashed" : ""
        }`}
        style={stationary ? ({ "--node": "var(--brass)" } as CSSProperties) : undefined}
      >
        {stationary ? <Anchor className="size-4" strokeWidth={1.5} /> : pad(day.day)}
      </div>

      {!stationary && (
        <Track day={day.day} className="absolute right-0 top-7 h-12 w-[72px] md:top-9 md:h-14 md:w-[84px]" />
      )}
      <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 pr-20 pt-0.5 md:pr-24">
        <span className="num">Day {day.day}</span>
        <span aria-hidden className="h-px w-5 bg-line-strong" />
        <span className="num">{shortDate(day.day)}</span>
        {stationary && <span className="!text-brass">· Harbour day</span>}
      </p>

      <h3 id={hid} className={`${styles.title} mt-2.5 pr-16 font-display md:pr-24 text-[clamp(1.55rem,2.5vw,2.05rem)] font-light leading-[1.08] text-ink/85`}>
        {stationary ? (
          to
        ) : (
          <>
            {from}
            <ArrowRight aria-label="to" className="mx-2 inline size-[0.6em] -translate-y-[0.06em]" strokeWidth={1.25} style={{ color: s.color }} />
            {to}
          </>
        )}
      </h3>
      {stationary && from !== to && <p className="mt-1 text-[13px] text-ink-3">{from}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[13px]">
        {stationary ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-brass/30 bg-brass/[0.07] px-3 py-1 text-[12px] text-brass">
            <Anchor className="size-3.5" strokeWidth={1.75} aria-hidden /> Lay day · no passage
          </span>
        ) : (
          <DistanceGauge day={day} color={s.color} />
        )}
        <LockPips locks={day.locks} color={s.color} />
      </div>
      <p className="mt-3 flex items-start gap-2 text-[13px] text-ink-3">
        <BedDouble className="mt-[1px] size-4 shrink-0" strokeWidth={1.5} aria-hidden />
        <span>
          <span className="sr-only">Overnight: </span>
          {day.overnight}
        </span>
      </p>

      <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.7] text-ink-2">{day.notes}</p>

      {notableCount > 0 && (
        <Disclosure
          listen
          className="mt-5"
          buttonClassName="inline-flex min-h-11 items-center gap-4 rounded-full border border-line bg-white/[0.02] pl-4 pr-3 text-[13px] text-ink-2 transition-colors hover:border-line-strong hover:bg-white/[0.04] hover:text-ink aria-expanded:border-line-strong"
          summary={
            <>
              {day.highlights.length > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-glow" strokeWidth={1.75} aria-hidden />
                  {plural(day.highlights.length, "highlight")}
                </span>
              )}
              {day.warnings.length > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <TriangleAlert className="size-3.5 text-alert" strokeWidth={1.75} aria-hidden />
                  {plural(day.warnings.length, "hazard")}
                </span>
              )}
              <ChevronDown className="size-4 text-ink-3 transition-transform duration-300 group-aria-expanded:rotate-180" strokeWidth={1.75} aria-hidden />
            </>
          }
        >
          <Notables day={day} />
        </Disclosure>
      )}
    </article>
  );
}
