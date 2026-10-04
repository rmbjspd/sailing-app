"use client";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ChevronsUpDown, Map as MapIcon, ChevronUp } from "lucide-react";
import { VoyageChart, type Box, type ChartView } from "./VoyageChart";
import { alpha } from "@/lib/data/legStyle";
import type { ChartData, DaySummary, LegSummary } from "./model";
import styles from "./log.module.css";

// The scrollytelling island: tracks which log entry sits at the reading line,
// drives the sticky chart + readout from it, and offers a day scrubber. The
// log itself (children) is static server markup and the source of truth.

type Step = { kind: "overview" } | { kind: "leg"; leg: number } | { kind: "day"; day: number } | { kind: "coda" };

function parseStep(v: string | undefined): Step {
  if (!v) return { kind: "overview" };
  const [k, n] = v.split(":");
  if (k === "leg") return { kind: "leg", leg: Number(n) };
  if (k === "day") return { kind: "day", day: Number(n) };
  if (k === "coda") return { kind: "coda" };
  return { kind: "overview" };
}

const fmtN = (n: number) => Math.round(n).toLocaleString("en-US");

export function LogScrolly({
  chart, days, legs, children,
}: {
  chart: ChartData; days: DaySummary[]; legs: LegSummary[]; children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [stepKey, setStepKey] = useState<string | undefined>(undefined);
  const [hiRes, setHiRes] = useState(false);
  const [compact, setCompact] = useState(false);
  const [mapOpen, setMapOpen] = useState(true);
  const [allOpen, setAllOpen] = useState(false);
  const [inLog, setInLog] = useState(false);
  const [scrub, setScrub] = useState<number | null>(null);
  const step = useMemo(() => parseStep(stepKey), [stepKey]);
  const lastDay = days[days.length - 1].day;

  // Viewport class: big raster + framed legs on desktop, boat-follow strip on phones.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => { setHiRes(mq.matches); setCompact(!mq.matches); };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Reading-line tracker: a 1%-tall band ~42% down the viewport.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
    let active: HTMLElement | null = null;
    const activate = (el: HTMLElement | null) => {
      if (el === active) return;
      active?.removeAttribute("data-active");
      el?.setAttribute("data-active", "");
      active = el;
      setStepKey(el?.dataset.step);
      setScrub(null); // the scrubber hands control back once the log catches up
    };
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) activate(el);
          else if (el === active && e.rootBounds && e.boundingClientRect.top > e.rootBounds.top) {
            // scrolled back up past the start of the active step
            activate(els[els.indexOf(el) - 1] ?? null);
          }
        }
      },
      { rootMargin: "-42% 0px -57% 0px" },
    );
    els.forEach(el => io.observe(el));
    const vis = new IntersectionObserver(([e]) => setInLog(e.isIntersecting), { rootMargin: "-30% 0px -30% 0px" });
    vis.observe(root);
    return () => { io.disconnect(); vis.disconnect(); };
  }, []);

  const jumpTo = useCallback((target: string, immediate = false) => {
    const el = document.getElementById(target);
    if (!el) return;
    const offset = -window.innerHeight * 0.36;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(el, { offset, immediate: immediate || reduce, duration: 1.4 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: immediate || reduce ? "auto" : "smooth" });
    if (!immediate) el.focus({ preventScroll: true });
  }, []);

  const jumpToDay = useCallback((day: number, immediate = false) => jumpTo(`day-${day}`, immediate), [jumpTo]);

  const onSelectStop = useCallback((i: number) => {
    const s = chart.stops[i];
    if (s.day === 0) jumpTo(`leg-${legs[0].legId}`);
    else jumpToDay(s.day);
  }, [chart.stops, legs, jumpTo, jumpToDay]);

  const toggleAll = () => {
    const next = !allOpen;
    setAllOpen(next);
    window.dispatchEvent(new CustomEvent("log:expand-all", { detail: next }));
  };

  // ── derive the chart view from the step ────────────────────────────────────
  const view: ChartView = useMemo(() => {
    const legEnds = chart.legs.map((_, i) => chart.stopOfDay[legs[i].dayEnd]);
    const legStops = (li: number) => {
      const a = chart.stopOfDay[legs[li].dayStart - 1], b = chart.stopOfDay[legs[li].dayEnd];
      return Array.from({ length: b - a + 1 }, (_, k) => a + k);
    };
    if (step.kind === "leg") {
      const L = legs[step.leg];
      return {
        drawn: L.dayStart - 1, boat: chart.stopOfDay[L.dayStart - 1], current: null,
        labels: legStops(step.leg), frame: chart.legs[step.leg].box,
      };
    }
    if (step.kind === "day") {
      const d = days[step.day - 1];
      const box = chart.legs[d.legIndex].box;
      const boat = chart.stops[chart.stopOfDay[d.day]];
      // ease the frame a little toward the boat so every day moves the camera
      const [x, y, w, h] = box;
      const k = 0.28, sh = 0.9;
      const cx = x + w / 2 + (boat.x - (x + w / 2)) * k, cy = y + h / 2 + (boat.y - (y + h / 2)) * k;
      const frame: Box = [cx - (w * sh) / 2, cy - (h * sh) / 2, w * sh, h * sh];
      return {
        drawn: d.day, boat: chart.stopOfDay[d.day], current: d.stationary ? null : d.day,
        labels: legStops(d.legIndex), frame,
      };
    }
    if (step.kind === "coda") {
      return { drawn: lastDay, boat: chart.stopOfDay[lastDay], current: null, labels: [...new Set([chart.stopOfDay[lastDay], 0, ...legEnds])], frame: chart.routeBox };
    }
    return { drawn: 0, boat: 0, current: null, labels: [...new Set([chart.stopOfDay[lastDay], ...legEnds])], frame: chart.routeBox };
  }, [step, chart, days, legs, lastDay]);

  const activeDay = step.kind === "day" ? step.day : step.kind === "coda" ? lastDay : step.kind === "leg" ? legs[step.leg].dayStart - 1 : 0;
  const legIndex = step.kind === "day" ? days[step.day - 1].legIndex : step.kind === "leg" ? step.leg : -1;
  const leg = legIndex >= 0 ? legs[legIndex] : null;
  const sum = activeDay > 0 ? days[activeDay - 1] : null;

  // ── readout copy ───────────────────────────────────────────────────────────
  let eyebrow = "Before departure";
  let heading = `${days[0].from} → ${days[days.length - 1].to}`;
  let sub = `${days[0].dateLong.replace(/, \d{4}$/, "")} – ${days[days.length - 1].dateLong}`;
  if (step.kind === "leg" && leg) {
    eyebrow = `Chapter · ${leg.dates}`;
    heading = leg.label;
    sub = `${leg.dayStart === leg.dayEnd ? `Day ${leg.dayStart}` : `Days ${leg.dayStart}–${leg.dayEnd}`} · ${leg.distance}`;
  } else if (step.kind === "day" && sum) {
    eyebrow = `Day ${sum.day} of ${lastDay}`;
    heading = sum.stationary ? `In harbour · ${sum.to}` : `${sum.from} → ${sum.to}`;
    sub = sum.dateLong;
  } else if (step.kind === "coda") {
    eyebrow = "Landfall";
    heading = `${days[days.length - 1].to}`;
    sub = `${sum?.dateLong ?? ""}`;
  }
  const boatStop = chart.stops[view.boat];
  const logged = sum ? sum : { cumNm: 0, cumMi: 0, cumLocks: 0 };
  const accent = leg?.color ?? "var(--glow)";

  const chartTitle = "Chart of the voyage, Chicago to Old Saybrook";
  const chartDesc = `The route follows the log as you scroll. Now showing: ${eyebrow} — ${heading}. Every detail on this chart is also in the day-by-day list.`;

  const scrubValue = scrub ?? Math.max(activeDay, 1);

  const scrubber = (
    <div className="relative">
      <div aria-hidden className="flex h-9 items-end gap-[3px] pb-2">
        {days.map((d, i) => {
          const past = d.day <= activeDay;
          const cur = d.day === scrubValue && (scrub !== null || activeDay > 0);
          const c = legs[d.legIndex].color;
          const newLeg = i > 0 && days[i - 1].legIndex !== d.legIndex;
          return (
            <span
              key={d.day}
              className={`flex-1 rounded-[1.5px] transition-all duration-500 ${newLeg ? "ml-[3px]" : ""} ${cur ? styles.glow : ""}`}
              style={{
                "--c": c,
                background: c,
                opacity: cur ? 1 : past ? 0.9 : 0.22,
                height: cur ? 24 : d.stationary ? 6 : past ? 14 : 10,
              } as CSSProperties}
            />
          );
        })}
      </div>
      <input
        type="range"
        min={1}
        max={lastDay}
        step={1}
        value={scrubValue}
        aria-label="Jump to day"
        aria-valuetext={`Day ${scrubValue}: ${days[scrubValue - 1].stationary ? `in harbour at ${days[scrubValue - 1].to}` : `${days[scrubValue - 1].from} to ${days[scrubValue - 1].to}`}`}
        className={`${styles.range} absolute inset-x-0 -top-1 h-11 w-full`}
        onPointerDown={() => setScrub(scrubValue)}
        onChange={e => {
          const d = Number(e.target.value);
          setScrub(d);
          jumpToDay(d, true);
        }}
        onBlur={() => setScrub(null)}
      />
    </div>
  );

  return (
    <div
      ref={rootRef}
      className="relative mx-auto flex max-w-7xl flex-col px-4 md:px-8 lg:flex-row-reverse lg:gap-10 xl:gap-16"
    >
      {/* ── Chart panel: sticky strip on phones, sticky column on desktop ── */}
      <aside
        aria-label="Voyage chart and position"
        className="@container sticky top-0 z-30 -mx-4 md:-mx-8 lg:top-24 lg:mx-0 lg:w-[45%] lg:shrink-0 lg:self-start"
      >
        <div
          className={`${styles.strip} glass-strong overflow-hidden rounded-b-3xl border-t-0 lg:rounded-[28px] lg:border-t`}
          style={{ "--accent": accent } as CSSProperties}
        >
          {/* map */}
          <div
            className={`${styles.mapPanel} relative overflow-hidden transition-[height] duration-500 ${
              mapOpen ? "h-[clamp(150px,40vw,240px)]" : "h-0"
            } lg:h-[min(80cqw,calc(100dvh_-_27rem))] lg:max-h-[540px] lg:min-h-[240px]`}
          >
            <VoyageChart
              data={chart}
              view={{ ...view, follow: compact && step.kind !== "overview" && step.kind !== "coda" }}
              onSelectStop={onSelectStop}
              hiRes={hiRes}
              compact={compact}
              title={chartTitle}
              desc={chartDesc}
            />
            {/* vignette + instrument chrome */}
            <div aria-hidden className={`${styles.vignette} pointer-events-none absolute inset-0`} />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 hidden items-center justify-between px-5 pt-4 lg:flex">
              <span className="eyebrow flex items-center gap-2 text-ink-3">
                <span className="size-1.5 rounded-full bg-glow pulse-glow" /> Position
              </span>
              <span className="num text-[11px] text-ink-2">{boatStop.coord}</span>
            </div>
          </div>

          {/* readout */}
          <div className="relative px-4 pb-3 pt-3 lg:px-6 lg:pb-5 lg:pt-5">
            <div aria-hidden className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
            <div className="flex items-start gap-3">
              <div key={stepKey ?? "overview"} className={`${styles.swap} min-w-0 flex-1`} aria-live="off">
                <p className="eyebrow flex items-center gap-2 !text-[10px] lg:!text-[11px]" style={{ color: leg ? accent : undefined }}>
                  {leg && <span className="num opacity-70">{leg.numeral}</span>}
                  {leg && <span aria-hidden className="h-px w-4" style={{ background: accent }} />}
                  <span>{eyebrow}</span>
                </p>
                <p className="mt-1.5 truncate font-display text-[19px] font-light leading-tight text-ink lg:mt-2 lg:whitespace-normal lg:text-[26px]">
                  {heading}
                </p>
                <p className="num mt-1 hidden text-[11px] text-ink-3 lg:block">{sub}</p>
              </div>
              <button
                type="button"
                onClick={() => setMapOpen(o => !o)}
                aria-expanded={mapOpen}
                aria-label={mapOpen ? "Hide chart" : "Show chart"}
                className="-mr-1 grid size-11 shrink-0 place-items-center rounded-full border border-line text-ink-2 transition hover:border-line-strong hover:text-ink lg:hidden"
              >
                {mapOpen ? <ChevronUp className="size-4" strokeWidth={1.75} /> : <MapIcon className="size-4" strokeWidth={1.75} />}
              </button>
            </div>

            {/* running totals */}
            <dl className="mt-5 hidden grid-cols-3 gap-4 border-t border-line pt-4 lg:grid">
              {[
                ["Today", sum && step.kind === "day" ? sum.dist ?? "Harbour" : "—"],
                ["Logged", `${fmtN(logged.cumNm)} nm${logged.cumMi ? ` + ${fmtN(logged.cumMi)} mi` : ""}`],
                ["Locks", `${logged.cumLocks}`],
              ].map(([k, v]) => (
                <div key={k} className="min-w-0">
                  <dt className="eyebrow !text-[10px]">{k}</dt>
                  <dd className="num mt-1.5 truncate text-[15px] text-ink">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-2 lg:mt-5">{scrubber}</div>

            <div className="mt-3 hidden items-center justify-between lg:flex">
              <span className="num text-[11px] text-ink-3">
                Day {String(Math.max(activeDay, 0)).padStart(2, "0")} / {lastDay}
              </span>
              <button
                type="button"
                onClick={toggleAll}
                aria-pressed={allOpen}
                className="inline-flex min-h-9 items-center gap-2 rounded-full border border-line px-3.5 text-[12px] text-ink-2 transition hover:border-line-strong hover:text-ink"
              >
                <ChevronsUpDown className="size-3.5" strokeWidth={1.75} />
                {allOpen ? "Fold every entry" : "Open every entry"}
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>

      {/* ── Edge rail (wide screens): the 35 days as a vertical spectrum ── */}
      <div
        aria-hidden
        className={`fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end transition-opacity duration-500 min-[1400px]:flex 2xl:right-8 ${
          inLog ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {days.map((d, i) => {
          const L = legs[d.legIndex];
          const cur = d.day === activeDay;
          const past = d.day <= activeDay;
          const newLeg = i > 0 && days[i - 1].legIndex !== d.legIndex;
          return (
            <button
              key={d.day}
              type="button"
              tabIndex={-1}
              onClick={() => jumpToDay(d.day)}
              className={`group relative flex h-[13px] w-10 items-center justify-end ${newLeg ? "mt-2" : ""}`}
              title={`Day ${d.day} · ${d.stationary ? d.to : `${d.from} → ${d.to}`}`}
            >
              {cur && (
                <span className="num absolute right-9 rounded-full bg-abyss/80 px-2 py-0.5 text-[10px] text-ink backdrop-blur-sm" style={{ boxShadow: `0 0 0 1px ${alpha(L.color, 0.4)}` }}>
                  {String(d.day).padStart(2, "0")}
                </span>
              )}
              <span
                className={`block h-[2px] rounded-full transition-all duration-500 group-hover:w-6 group-hover:opacity-100 ${cur ? styles.glow : ""}`}
                style={{
                  "--c": L.color,
                  background: L.color,
                  width: cur ? 28 : past ? 16 : 10,
                  opacity: cur ? 1 : past ? 0.85 : 0.3,
                } as CSSProperties}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
