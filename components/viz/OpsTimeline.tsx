"use client";
import { useState } from "react";
import type { CriticalOp, VizDay } from "@/lib/data/vizModel";
import { GRID, INK, SIG } from "./parts";
import { useDrawIn } from "./useDrawIn";
import { useViz } from "./VizContext";
import s from "./viz.module.css";

// "Dead Reckoning": the six operations you cannot be late for, pinned to the
// 35-day calendar, with the brief for each below.

const toneColor = (t: CriticalOp["tone"]) => (t === "brass" ? SIG.brass : t === "alert" ? SIG.alert : SIG.glow);

function lanes(ops: CriticalOp[]) {
  // Ranges sit on the upper lane; single-day operations on the lower lane.
  return ops.map(op => ({ op, lane: op.dayEnd > op.dayStart ? 1 : 0 }));
}

export function OpsTimeline({ ops, days }: { ops: CriticalOp[]; days: VizDay[] }) {
  const [ref, phase] = useDrawIn<HTMLDivElement>();
  const { activeDay, setActiveDay } = useViz();
  const [activeOp, setActiveOp] = useState<string | null>(null);
  const sorted = [...ops].sort((a, b) => a.dayStart - b.dayStart || a.dayEnd - b.dayEnd);
  const num = new Map(sorted.map((o, i) => [o.id, i + 1]));

  const enter = (op: CriticalOp) => { setActiveOp(op.id); setActiveDay(op.dayStart); };
  const leave = () => { setActiveOp(null); setActiveDay(null); };

  return (
    <div ref={ref} className={s.fig} data-phase={phase}>
      <div className="hidden md:block">
        <Timeline ops={sorted} days={days} num={num} activeOp={activeOp} activeDay={activeDay} onEnter={enter} onLeave={leave} />
      </div>
      <div className="md:hidden">
        <Timeline ops={sorted} days={days} num={num} activeOp={activeOp} activeDay={activeDay} onEnter={enter} onLeave={leave} compact />
      </div>
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((op, i) => {
          const c = toneColor(op.tone);
          const on = activeOp === op.id;
          const d0 = days.find(d => d.day === op.dayStart)!;
          const d1 = days.find(d => d.day === op.dayEnd)!;
          const when = op.dayAlt ? `Days ${op.dayStart} & ${op.dayAlt}` : op.dayEnd > op.dayStart ? `Days ${op.dayStart}–${op.dayEnd}` : `Day ${op.dayStart}`;
          const dates = op.dayAlt
            ? `${d0.dateShort} · ${days.find(d => d.day === op.dayAlt)!.dateShort}`
            : op.dayEnd > op.dayStart ? `${d0.dateShort} – ${d1.dateShort}` : d0.dateLabel;
          return (
            <li key={op.id}
              className={`${s.fade} relative rounded-2xl border p-5 transition-colors duration-300 ${on ? "border-[var(--line-strong)] bg-[rgb(255_255_255/0.05)]" : "border-line bg-[rgb(255_255_255/0.02)]"}`}
              style={{ ["--d" as string]: `${0.3 + i * 0.07}s` }}
              tabIndex={0}
              onPointerEnter={() => enter(op)} onPointerLeave={leave} onFocus={() => enter(op)} onBlur={leave}>
              <span className="absolute inset-x-5 top-0 h-px" style={{ background: `linear-gradient(90deg, ${c}, transparent)` , opacity: on ? 1 : 0.5 }} />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow flex items-center gap-2.5 !tracking-[0.16em]">
                    <span className="num grid size-5 place-items-center rounded-full border text-[10px]" style={{ borderColor: c, color: c }}>{num.get(op.id)}</span>
                    <span className="num">{when}</span>
                  </p>
                  <h4 className="mt-3 font-display text-[26px] font-light leading-none text-ink">{op.title}</h4>
                  <p className="mt-1.5 text-[12.5px] text-ink-3">{op.where} · <span className="num">{dates}</span></p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="num text-[22px] leading-none" style={{ color: c }}>{op.figure}</p>
                  <p className="mt-1.5 max-w-[7.5rem] text-[10.5px] leading-tight text-ink-3">{op.figureLabel}</p>
                </div>
              </div>
              <p className="mt-4 text-[13.5px] leading-relaxed text-ink-2">{op.body}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Timeline({
  ops, days, num, activeOp, activeDay, onEnter, onLeave, compact = false,
}: {
  ops: CriticalOp[]; days: VizDay[]; num: Map<string, number>; activeOp: string | null; activeDay: number | null;
  onEnter: (op: CriticalOp) => void; onLeave: () => void; compact?: boolean;
}) {
  const W = compact ? 380 : 1200;
  const H = compact ? 150 : 196;
  const m = compact ? { l: 10, r: 10 } : { l: 4, r: 4 };
  const n = days.length;
  const slot = (W - m.l - m.r) / n;
  const cx = (day: number) => m.l + (day - 0.5) * slot;
  const yRibbon = compact ? 98 : 136;
  const laneY = compact ? [70, 40] : [100, 52];
  const L = lanes(ops);
  const labelEvery = compact ? 7 : 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" role="img"
      aria-label={`Timeline of ${ops.length} critical operations across the ${n}-day voyage`}>
      {/* day grid + ribbon */}
      {days.map((d) => {
        const on = activeDay === d.day;
        return (
          <g key={d.day} aria-hidden>
            {on && <rect x={cx(d.day) - slot / 2} y={8} width={slot} height={yRibbon + 4} fill="rgb(94 242 214 / 0.07)" rx={3} />}
            <line x1={cx(d.day) - slot / 2} x2={cx(d.day) - slot / 2} y1={laneY[1] - 22} y2={yRibbon - 4} stroke={GRID} />
            <rect className={s.growX} style={{ ["--d" as string]: `${d.day * 0.012}s` }} x={cx(d.day) - slot / 2 + 0.75} y={yRibbon} width={slot - 1.5} height={compact ? 5 : 6} rx={1.5}
              fill={d.color} fillOpacity={d.nm > 0 ? 0.9 : 0.35} />
            {(d.day === 1 || d.day % labelEvery === 0 || d.day === n) && (
              <text x={cx(d.day)} y={yRibbon + (compact ? 20 : 22)} textAnchor="middle" fontSize={compact ? 9 : 9.5} className="num" fill={on ? SIG.glow : INK.ink3}>{d.day}</text>
            )}
            {(d.day === 1 || d.dateShort.endsWith(" 1") || d.day === n || (!compact && (d.day - 1) % 7 === 0)) && (
              <text x={cx(d.day)} y={yRibbon + (compact ? 36 : 40)} textAnchor="middle" fontSize={compact ? 8.5 : 9} letterSpacing="0.1em" className="font-mono" fill={d.dateShort.endsWith(" 1") ? SIG.brass : INK.ink4}>
                {d.dateShort.toUpperCase()}
              </text>
            )}
          </g>
        );
      })}

      {/* operations */}
      {L.map(({ op, lane }, i) => {
        const c = toneColor(op.tone);
        const on = activeOp === op.id;
        const y = laneY[lane];
        const k = num.get(op.id)!;
        const range = op.dayEnd > op.dayStart;
        const x0 = cx(op.dayStart), x1 = cx(op.dayEnd);
        return (
          <g key={op.id} className={`${s.fade} ${s.hit}`} style={{ ["--d" as string]: `${0.6 + i * 0.1}s`, opacity: activeOp && !on ? 0.4 : 1, transition: "opacity .25s" }}
            onPointerEnter={() => onEnter(op)} onPointerLeave={onLeave}>
            {range ? (
              <>
                <rect x={x0 - slot / 2 + 3} y={y - 8} width={x1 - x0 + slot - 6} height={16} rx={8} fill={c} fillOpacity={on ? 0.32 : 0.16} stroke={c} strokeOpacity={0.7} />
                <line x1={x0 - slot / 2 + 3} x2={x0 - slot / 2 + 3} y1={y + 8} y2={yRibbon - 2} stroke={c} strokeOpacity={0.35} strokeDasharray="1 2" />
                <line x1={x1 + slot / 2 - 3} x2={x1 + slot / 2 - 3} y1={y + 8} y2={yRibbon - 2} stroke={c} strokeOpacity={0.35} strokeDasharray="1 2" />
              </>
            ) : (
              <>
                <line x1={x0} x2={x0} y1={y + 6} y2={yRibbon - 2} stroke={c} strokeOpacity={0.5} />
                <path d={`M${x0},${y - 6} L${x0 + 6},${y} L${x0},${y + 6} L${x0 - 6},${y} Z`} fill={on ? c : "#03060c"} stroke={c} strokeWidth={1.25} />
              </>
            )}
            {op.dayAlt && (
              <>
                <path d={`M${x0 + 8},${y} L${cx(op.dayAlt) - 8},${y}`} stroke={c} strokeOpacity={0.4} strokeDasharray="2 3" />
                <line x1={cx(op.dayAlt)} x2={cx(op.dayAlt)} y1={y + 6} y2={yRibbon - 2} stroke={c} strokeOpacity={0.5} />
                <path d={`M${cx(op.dayAlt)},${y - 6} L${cx(op.dayAlt) + 6},${y} L${cx(op.dayAlt)},${y + 6} L${cx(op.dayAlt) - 6},${y} Z`} fill={on ? c : "#03060c"} stroke={c} strokeWidth={1.25} />
              </>
            )}
            {/* badge + label */}
            {compact ? (
              <g>
                <circle cx={range ? (x0 + x1) / 2 : x0} cy={y - (range ? 0 : 16)} r={7} fill="#03060c" stroke={c} />
                <text x={range ? (x0 + x1) / 2 : x0} y={y - (range ? 0 : 16) + 3.2} textAnchor="middle" fontSize={9} className="num" fill={c}>{k}</text>
              </g>
            ) : (
              <text x={range ? x0 - slot / 2 + 12 : x0 + 12} y={range ? y + 4 : y - 10} fontSize={12} fill={INK.ink}>
                <tspan className="num" fontSize={10} fill={c}>{k} </tspan>{op.title}
              </text>
            )}
            <rect x={range ? x0 - slot / 2 : x0 - slot / 2} y={y - 26} width={range ? x1 - x0 + slot : Math.max(slot, compact ? 18 : 110)} height={yRibbon - y + 26} fill="transparent" />
          </g>
        );
      })}
    </svg>
  );
}
