"use client";
import { useState } from "react";
import type { VizLeg } from "@/lib/data/vizModel";
import { INK, fmt, pct } from "./parts";
import { useDrawIn } from "./useDrawIn";
import { useViz } from "./VizContext";
import s from "./viz.module.css";

// "Where the miles go": each leg's share of the distance (top) ribboned to its
// share of the days (bottom). A ribbon that widens on the way down is a leg
// that eats more calendar than chart.

const GAP = 2;

function segments(legs: VizLeg[], key: "shareDistance" | "shareDays", a: number, b: number) {
  const span = b - a - GAP * (legs.length - 1);
  let x = a;
  return legs.map((l) => {
    const w = l[key] * span;
    const seg = { leg: l, x0: x, x1: x + w };
    x += w + GAP;
    return seg;
  });
}

export function LegShare({ legs, totalNm, totalDays, compact = false }: { legs: VizLeg[]; totalNm: number; totalDays: number; compact?: boolean }) {
  const [ref, phase] = useDrawIn<HTMLDivElement>();
  const { setActiveDay } = useViz();
  const canal = legs.find(l => l.legId === "erie-canal") ?? legs[0];
  const [hover, setHover] = useState<string | null>(null);
  const focus = legs.find(l => l.legId === hover) ?? null;

  const enter = (l: VizLeg) => { setHover(l.legId); };
  const leave = () => { setHover(null); setActiveDay(null); };

  if (compact) {
    // Vertical: distance column on the left, days column on the right.
    const W = 380, H = 600, top = 44, bot = H - 20;
    const xa = 132, xb = 236, bw = 16;
    const A = segments(legs, "shareDistance", top, bot);
    const B = segments(legs, "shareDays", top, bot);
    return (
      <div ref={ref} className={s.fig} data-phase={phase}>
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Share of distance versus share of days for each leg">
          <RibbonDefs legs={legs} dir="h" />
          <text x={xa + bw / 2} y={18} textAnchor="middle" fontSize={9.5} letterSpacing="0.14em" className="font-mono" fill={INK.ink3}>DISTANCE</text>
          <text x={xa + bw / 2} y={32} textAnchor="middle" fontSize={9.5} className="num" fill={INK.ink2}>{fmt(totalNm)} nm</text>
          <text x={xb + bw / 2} y={18} textAnchor="middle" fontSize={9.5} letterSpacing="0.14em" className="font-mono" fill={INK.ink3}>DAYS</text>
          <text x={xb + bw / 2} y={32} textAnchor="middle" fontSize={9.5} className="num" fill={INK.ink2}>{totalDays}</text>
          {legs.map((l, i) => {
            const a = A[i], b = B[i];
            const on = hover === l.legId;
            const dim = hover && !on;
            const mid = xa + bw + (xb - xa - bw) / 2;
            return (
              <g key={l.legId} style={{ opacity: dim ? 0.35 : 1, transition: "opacity .25s" }}>
                <path className={`${s.fade} ${s.ribbon}`} style={{ ["--d" as string]: `${0.4 + i * 0.06}s`, ["--c" as string]: l.color }}
                  d={`M${xa + bw},${a.x0} C${mid},${a.x0} ${mid},${b.x0} ${xb},${b.x0} L${xb},${b.x1} C${mid},${b.x1} ${mid},${a.x1} ${xa + bw},${a.x1} Z`}
                  fill={`url(#rib-h-${l.legId})`} fillOpacity={on ? 1 : 0.6} />
                <rect className={s.growY} style={{ ["--d" as string]: `${i * 0.05}s` }} x={xa} y={a.x0} width={bw} height={a.x1 - a.x0} rx={2} fill={l.color} />
                <rect className={s.growY} style={{ ["--d" as string]: `${0.2 + i * 0.05}s` }} x={xb} y={b.x0} width={bw} height={b.x1 - b.x0} rx={2} fill={l.color} />
                {a.x1 - a.x0 >= 30 ? (
                  <>
                    <text x={xa - 10} y={(a.x0 + a.x1) / 2 - 1} textAnchor="end" fontSize={11.5} fill={INK.ink}>
                      <tspan className="font-mono" fill={l.color} fontSize={10}>{l.numeral} </tspan>{l.short}
                    </text>
                    <text x={xa - 10} y={(a.x0 + a.x1) / 2 + 12} textAnchor="end" fontSize={10} className="num" fill={INK.ink3}>{pct(l.shareDistance)} · {fmt(l.nm)} nm</text>
                  </>
                ) : (
                  <text x={xa - 10} y={(a.x0 + a.x1) / 2 + 4} textAnchor="end" fontSize={11} fill={INK.ink}>
                    <tspan className="font-mono" fill={l.color} fontSize={10}>{l.numeral} </tspan>{l.short}
                    <tspan className="num" fill={INK.ink3} fontSize={10}> {pct(l.shareDistance)}</tspan>
                  </text>
                )}
                {b.x1 - b.x0 >= 30 ? (
                  <>
                    <text x={xb + bw + 10} y={(b.x0 + b.x1) / 2 - 1} fontSize={11.5} className="num" fill={INK.ink}>{l.days} d · {pct(l.shareDays)}</text>
                    <text x={xb + bw + 10} y={(b.x0 + b.x1) / 2 + 12} fontSize={10} className="num" fill={INK.ink3}>{fmt(l.pace)} nm/day</text>
                  </>
                ) : (
                  <text x={xb + bw + 10} y={(b.x0 + b.x1) / 2 + 4} fontSize={11} className="num" fill={INK.ink}>
                    {l.days} d · {pct(l.shareDays)}<tspan fill={INK.ink3} fontSize={10}> · {fmt(l.pace)}/day</tspan>
                  </text>
                )}
                <rect x={0} y={Math.min(a.x0, b.x0)} width={W} height={Math.max(a.x1, b.x1) - Math.min(a.x0, b.x0)} fill="transparent"
                  tabIndex={0} role="button" aria-label={`${l.label}: ${pct(l.shareDistance)} of the distance, ${pct(l.shareDays)} of the days`}
                  className={s.hit} onPointerEnter={() => enter(l)} onFocus={() => enter(l)} onPointerLeave={leave} onBlur={leave}
                  onClick={() => setHover(h => (h === l.legId ? null : l.legId))} />
              </g>
            );
          })}
        </svg>
        <Readout leg={focus ?? canal} />
      </div>
    );
  }

  const W = 1200, H = 300, l0 = 0, r0 = W;
  const yA = 58, yB = 214, bh = 18;
  const A = segments(legs, "shareDistance", l0, r0);
  const B = segments(legs, "shareDays", l0, r0);
  return (
    <div ref={ref} className={s.fig} data-phase={phase}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" role="img" aria-label="Share of distance versus share of days for each leg">
        <RibbonDefs legs={legs} dir="v" />
        <text x={0} y={14} fontSize={10} letterSpacing="0.16em" className="font-mono" fill={INK.ink3}>
          SHARE OF DISTANCE <tspan className="num" fill={INK.ink2} letterSpacing="0">· {fmt(totalNm)} nm</tspan>
        </text>
        <text x={0} y={H - 4} fontSize={10} letterSpacing="0.16em" className="font-mono" fill={INK.ink3}>
          SHARE OF DAYS <tspan className="num" fill={INK.ink2} letterSpacing="0">· {totalDays}</tspan>
        </text>
        {legs.map((l, i) => {
          const a = A[i], b = B[i];
          const on = hover === l.legId;
          const dim = hover && !on;
          const ym = (yA + bh + yB) / 2;
          const wa = a.x1 - a.x0, wb = b.x1 - b.x0;
          return (
            <g key={l.legId} style={{ opacity: dim ? 0.32 : 1, transition: "opacity .25s" }}>
              <path className={`${s.fade} ${s.ribbon}`} style={{ ["--d" as string]: `${0.5 + i * 0.07}s`, ["--c" as string]: l.color }}
                d={`M${a.x0},${yA + bh} C${a.x0},${ym} ${b.x0},${ym} ${b.x0},${yB} L${b.x1},${yB} C${b.x1},${ym} ${a.x1},${ym} ${a.x1},${yA + bh} Z`}
                fill={`url(#rib-v-${l.legId})`} fillOpacity={on ? 1 : 0.6} />
              <rect className={s.growX} style={{ ["--d" as string]: `${i * 0.06}s` }} x={a.x0} y={yA} width={wa} height={bh} rx={3} fill={l.color} />
              <rect className={s.growX} style={{ ["--d" as string]: `${0.25 + i * 0.06}s` }} x={b.x0} y={yB} width={wb} height={bh} rx={3} fill={l.color} />
              <text x={a.x0 + 2} y={yA - 10} fontSize={11.5} fill={INK.ink}>
                <tspan className="font-mono" fontSize={10} fill={l.color}>{l.numeral}</tspan>
                {wa > 90 && <tspan dx={5}>{l.short}</tspan>}
              </text>
              <text x={a.x0 + 2} y={yA + bh + 16} fontSize={11} className="num" fill={INK.ink2}>{pct(l.shareDistance)}</text>
              <text x={b.x0 + 2} y={yB - 7} fontSize={11} className="num" fill={INK.ink2}>{pct(l.shareDays)}</text>
              <text x={b.x0 + 2} y={yB + bh + 17} fontSize={11.5} className="num" fill={INK.ink}>{l.days} d</text>
              {wb > 70 && <text x={b.x0 + 2} y={yB + bh + 32} fontSize={10} className="num" fill={INK.ink3}>{fmt(l.pace)} nm/day</text>}
              <path d={`M${a.x0},${yA - 26} L${a.x1},${yA - 26} L${a.x1},${yA + bh} C${a.x1},${ym} ${b.x1},${ym} ${b.x1},${yB} L${b.x1},${yB + bh + 36} L${b.x0},${yB + bh + 36} L${b.x0},${yB} C${b.x0},${ym} ${a.x0},${ym} ${a.x0},${yA + bh} Z`}
                fill="transparent" tabIndex={0} role="button" className={s.hit}
                aria-label={`${l.label}: ${pct(l.shareDistance)} of the distance, ${pct(l.shareDays)} of the days, ${fmt(l.pace)} nautical miles a day`}
                onPointerEnter={() => enter(l)} onFocus={() => enter(l)} onPointerLeave={leave} onBlur={leave} />
            </g>
          );
        })}
      </svg>
      <Readout leg={focus ?? canal} />
    </div>
  );
}

function RibbonDefs({ legs, dir }: { legs: VizLeg[]; dir: "h" | "v" }) {
  return (
    <defs>
      {legs.map((l) => (
        <linearGradient key={l.legId} id={`rib-${dir}-${l.legId}`} x1={0} y1={0} x2={dir === "h" ? 1 : 0} y2={dir === "v" ? 1 : 0}>
          <stop className={s.ribEnd} offset={0} stopColor={l.color} stopOpacity={0.55} />
          <stop className={s.ribMid} offset={0.5} stopColor={l.color} stopOpacity={0.16} />
          <stop className={s.ribEnd} offset={1} stopColor={l.color} stopOpacity={0.55} />
        </linearGradient>
      ))}
    </defs>
  );
}

function Readout({ leg }: { leg: VizLeg }) {
  const ratio = leg.shareDays / leg.shareDistance;
  return (
    <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-line pt-4" aria-live="polite">
      <p className="text-[14px] text-ink">
        <span className="num mr-2 text-[12px]" style={{ color: leg.color }}>{leg.numeral}</span>{leg.label}
      </p>
      <p className="num text-[12.5px] text-ink-2">{fmt(leg.nm)} nm · {leg.days} days · {fmt(leg.pace)} nm/day{leg.locks ? ` · ${leg.locks} locks` : ""}</p>
      <p className="text-[12.5px] text-ink-3">
        {ratio > 1.15 ? "Slow miles: takes " : ratio < 0.87 ? "Big miles: takes " : "Takes "}
        <span className="num text-ink-2">{fmt(ratio, 1)}×</span> its share of the calendar.
      </p>
    </div>
  );
}
