"use client";
import { arc as d3arc } from "d3-shape";
import { useId, useMemo } from "react";
import type { ClockFacts, VizDay, VizLeg } from "@/lib/data/vizModel";
import { GRID, INK, SIG, fmt, tint } from "./parts";
import { useDrawIn } from "./useDrawIn";
import { useViz } from "./VizContext";
import s from "./viz.module.css";

// "35 Days": a voyage clock. One spoke per day, clockwise from the top;
// spoke length = distance made good, inner beads = locks, outer ring = leg.

function place(name: string, end: "to" | "from" = "to") {
  const parts = name.split(" or ")[0].split("/");
  const p = end === "to" ? parts[parts.length - 1] : parts[0];
  return p.replace(/,\s*[A-Z]{2}\b.*$/, "").replace(/\(.*\)/, "").trim();
}

export function VoyageClock({ days, legs, compact = false }: { days: VizDay[]; legs: VizLeg[]; compact?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const [ref, phase] = useDrawIn<HTMLDivElement>();
  const { activeDay, setActiveDay } = useViz();

  const S = 640, C = S / 2;
  const slots = days.length + 1; // one empty slot at 12 o'clock = start/finish notch
  const step = (Math.PI * 2) / slots;
  const ang = (i: number) => (i + 1) * step; // day index → slot centre angle
  const rCore = 98, rLock0 = 146, r0 = 156, rMax = compact ? 262 : 252;
  const maxNm = Math.max(...days.map(d => d.nm));
  const len = (nm: number) => r0 + (nm / maxNm) * (rMax - r0);
  const rLeg = compact ? 276 : 284;
  // Rounded so server and client trig agree to the last digit (hydration).
  const r2 = (n: number) => Math.round(n * 100) / 100;
  const pt = (a: number, r: number) => [r2(C + r * Math.sin(a)), r2(C - r * Math.cos(a))] as const;

  const arc = useMemo(() => d3arc<{ a0: number; a1: number; r0: number; r1: number }>()
    .startAngle(d => d.a0).endAngle(d => d.a1).innerRadius(d => d.r0).outerRadius(d => d.r1).cornerRadius(2.5).digits(2), []);
  const half = step * 0.34;
  const active = activeDay != null ? days.find(d => d.day === activeDay) : undefined;
  const gridNm = [25, 50, 75].filter(n => n < maxNm);

  const legArcs = legs.map((l) => {
    const i0 = days.findIndex(d => d.day === l.dayStart), i1 = days.findIndex(d => d.day === l.dayEnd);
    return { ...l, a0: ang(i0) - step / 2 + 0.012, a1: ang(i1) + step / 2 - 0.012 };
  });

  return (
    <div ref={ref} className={`${s.fig} relative mx-auto w-full`} data-phase={phase}
      onPointerLeave={() => setActiveDay(null)}>
      <svg viewBox={`0 0 ${S} ${S}`} className="block h-auto w-full overflow-visible" role="group"
        aria-labelledby={`${uid}-t`}>
        <title id={`${uid}-t`}>{`Voyage clock: each of the ${days.length} days as a spoke, clockwise from the top. Spoke length is distance; beads are locks.`}</title>

        {/* distance rings */}
        {gridNm.map((n) => (
          <g key={n} aria-hidden>
            <circle cx={C} cy={C} r={len(n)} fill="none" stroke={GRID} strokeDasharray="2 4" />
            <text x={C} y={C - len(n) + 3.5} textAnchor="middle" fontSize={compact ? 13 : 9.5} className="num" fill={INK.ink3}>{n}</text>
          </g>
        ))}
        <text x={C} y={C - rMax - 4} textAnchor="middle" fontSize={compact ? 13 : 9.5} className="num" fill={INK.ink3} aria-hidden>{Math.round(maxNm)} nm</text>
        <circle cx={C} cy={C} r={r0 - 2} fill="none" stroke={tint(0.1)} />
        <circle cx={C} cy={C} r={rCore} fill="none" stroke={tint(0.06)} />

        {/* start / finish notch */}
        <g aria-hidden>
          <line x1={C} x2={C} y1={C - rCore - 4} y2={C - rLeg - 10} stroke={SIG.brass} strokeOpacity={0.6} strokeDasharray="1 3" />
        </g>

        {/* leg ring */}
        {legArcs.map((l) => {
          const mid = (l.a0 + l.a1) / 2;
          const [lx, ly] = pt(mid, rLeg + (compact ? 22 : 16));
          return (
            <g key={l.legId} aria-hidden>
              <path d={arc({ a0: l.a0, a1: l.a1, r0: rLeg, r1: rLeg + 3 })!} transform={`translate(${C},${C})`} fill={l.color} />
              <text x={lx} y={ly + 4} textAnchor="middle" fontSize={compact ? 17 : 11} className="font-mono" fill={l.color}>{l.numeral}</text>
            </g>
          );
        })}

        {/* days */}
        {days.map((d, i) => {
          const a = ang(i);
          const on = active?.day === d.day;
          const dim = active && !on;
          const label = `Day ${d.day}, ${d.dateLabel}: ${d.layover ? `layover at ${place(d.to)}` : `${place(d.from, "from")} to ${place(d.to)}, ${d.distanceLabel}`}${d.locks ? `, ${d.locks} lock${d.locks > 1 ? "s" : ""}` : ""}.`;
          const [dx, dy] = pt(a, rMax + 12);
          const date = d.dateShort.split(" ");
          const isMonthStart = date[1] === "1" || i === 0;
          return (
            <g key={d.day} className={s.hit} role="button" tabIndex={0} aria-label={label} aria-pressed={on}
              onPointerEnter={() => setActiveDay(d.day)} onFocus={() => setActiveDay(d.day)} onBlur={() => setActiveDay(null)}
              onClick={() => setActiveDay(on ? null : d.day)}>
              <path d={arc({ a0: a - step / 2, a1: a + step / 2, r0: rCore, r1: rLeg })!} transform={`translate(${C},${C})`} fill="transparent" />
              <path className={s.focusRing} d={arc({ a0: a - step / 2, a1: a + step / 2, r0: rCore, r1: rLeg })!} transform={`translate(${C},${C})`} />
              <g style={{ opacity: dim ? 0.28 : 1, transition: "opacity .25s" }}>
                {d.nm > 0 ? (
                  <path className={s.grow} style={{ ["--ox" as string]: `${C}px`, ["--oy" as string]: `${C}px`, ["--sx" as string]: "0.6", ["--sy" as string]: "0.6", ["--d" as string]: `${i * 0.03}s` }}
                    d={arc({ a0: a - half, a1: a + half, r0, r1: len(d.nm) })!} transform={`translate(${C},${C})`}
                    fill={d.color} fillOpacity={on ? 1 : 0.88} stroke={on ? "var(--vz-spoke-on)" : "none"} strokeWidth={1} />
                ) : (
                  <circle cx={pt(a, r0 + 8)[0]} cy={pt(a, r0 + 8)[1]} r={4} fill="none" stroke={d.color} strokeWidth={1.25} />
                )}
                {d.locks > 0 && (
                  <g className={s.fade} style={{ ["--d" as string]: `${0.5 + i * 0.03}s` }}>
                    {Array.from({ length: d.locks }, (_, k) => {
                      const [bx, by] = pt(a, rLock0 - k * 5);
                      return <circle key={k} cx={bx} cy={by} r={1.7} fill={SIG.brass} />;
                    })}
                  </g>
                )}
                {!compact && (
                  <text x={dx} y={dy + 3.5} textAnchor="middle" fontSize={isMonthStart ? 9 : 8.5} className="num" fill={on ? SIG.glow : isMonthStart ? SIG.brass : INK.ink3}>
                    {isMonthStart ? `${date[0].toUpperCase()} ${date[1]}` : date[1]}
                  </text>
                )}
              </g>
            </g>
          );
        })}
      </svg>

      {/* core readout */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
        style={{ width: `${((rCore * 2 - 16) / S) * 100}%` }} aria-live="polite">
        {active ? (
          <>
            <span className="eyebrow !text-[9px] !tracking-[0.18em]" style={{ color: active.color }}>{active.weekday} · {active.dateShort}</span>
            <span className="font-display text-[clamp(1.9rem,4vw,3rem)] font-light leading-none text-ink">
              <span className="text-ink-3 text-[0.45em] align-top mr-0.5">D</span>{active.day}
            </span>
            <span className="num mt-1 text-[11px] text-ink-2 md:text-xs">{active.layover ? "layover" : active.distanceLabel}</span>
          </>
        ) : (
          <>
            <span className="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-light leading-none text-ink">{days.length}</span>
            <span className="eyebrow mt-1 !text-[9px]">days</span>
          </>
        )}
      </div>
    </div>
  );
}

/** Detail card that mirrors the clock's active day (or the default summary). */
export function ClockReadout({ days, facts, nmPerMi }: { days: VizDay[]; facts: ClockFacts; nmPerMi: number }) {
  const { activeDay, setActiveDay } = useViz();
  const d = activeDay != null ? days.find(x => x.day === activeDay) : undefined;
  const factRows: { k: string; v: string; day: number }[] = [
    { k: "Longest run", v: `Day ${facts.longest.day} · ${fmt(facts.longest.nm)} nm, ${place(facts.longest.from, "from")} → ${place(facts.longest.to)}`, day: facts.longest.day },
    ...facts.busiestLockDays.map(b => ({ k: "Most locks", v: `Day ${b.day} · ${b.locks} chambers, ${place(b.from, "from")} → ${place(b.to)}`, day: b.day })),
    ...facts.restDays.map(r => ({ k: "Stand-still", v: `Day ${r.day} · ${place(r.to)}`, day: r.day })),
  ];
  return (
    <div className="flex flex-col gap-6">
      <div className="glass min-h-[176px] rounded-2xl p-5" aria-live="polite">
        {d ? (
          <>
            <p className="eyebrow flex items-center justify-between">
              <span style={{ color: d.color }}>{d.dateLabel}</span>
              <span className="num">Day {d.day} / {days.length}</span>
            </p>
            <p className="mt-3 font-display text-2xl leading-tight text-ink">
              {d.layover ? place(d.to) : <>{place(d.from, "from")} <span className="text-ink-3">→</span> {place(d.to)}</>}
            </p>
            <div className="mt-4 flex gap-6">
              <div>
                <p className="num text-xl text-ink">{d.layover ? "0" : d.distanceLabel.split(" ")[0]}<span className="ml-1 text-xs text-ink-3">{d.layover ? "nm" : d.distanceLabel.split(" ")[1]}</span></p>
                <p className="text-[11px] text-ink-3">{d.layover ? "layover" : d.distanceLabel.endsWith("mi") ? `≈ ${fmt(d.nm)} nm` : "made good"}</p>
              </div>
              <div>
                <p className="num text-xl text-ink">{d.locks}</p>
                <p className="text-[11px] text-ink-3">locks</p>
              </div>
            </div>
            <p className="mt-3 text-[12.5px] leading-snug text-ink-3">{d.overnight}</p>
          </>
        ) : (
          <>
            <p className="eyebrow">How to read it</p>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
              Each spoke is one day, clockwise from the start notch at twelve o&rsquo;clock. Length is distance made good
              (canal miles converted at <span className="num">{nmPerMi.toFixed(3)}</span> nm per mile); <span className="text-brass">brass beads</span> are locks; hollow rings are days at rest.
              The outer ring marks the leg.
            </p>
          </>
        )}
      </div>
      <ul className="grid gap-px overflow-hidden rounded-2xl border border-line">
        {factRows.map((f) => (
          <li key={`${f.k}-${f.day}`}>
            <button type="button" className="flex min-h-11 w-full items-baseline gap-3 bg-tint/[0.02] px-4 py-2.5 text-left transition-colors hover:bg-tint/[0.05] focus-visible:bg-tint/[0.05]"
              onPointerEnter={() => setActiveDay(f.day)} onPointerLeave={() => setActiveDay(null)}
              onFocus={() => setActiveDay(f.day)} onBlur={() => setActiveDay(null)}
              onClick={() => setActiveDay(activeDay === f.day ? null : f.day)}>
              <span className="eyebrow w-24 shrink-0 !text-[9.5px]">{f.k}</span>
              <span className="num text-[12.5px] text-ink-2">{f.v}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
