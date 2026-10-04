"use client";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { checklists } from "@/lib/data/checklists";
import { categoryMeta, CRITICAL_ITEMS, TOTAL_ITEMS } from "./categories";
import css from "./provisioning.module.css";

// The hero instrument: a segmented ring, one arc per locker (sized by item
// count, filled by how much is stowed), wrapped in a compass-style bezel. The
// inner hairline ring tracks the critical items only — the real gate on
// departure — and the readout below calls out how many are still ashore.

const SIZE = 280;
const C = SIZE / 2;
const R_OUTER = 112;
const R_CRIT = 92;
const GAP_DEG = 3.2;

function polar(r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  // Rounded so server and client agree to the digit (Math.cos can differ in the last ulp).
  const round = (n: number) => Math.round(n * 100) / 100;
  return [round(C + r * Math.cos(a)), round(C + r * Math.sin(a))] as const;
}
function arc(r: number, a0: number, a1: number) {
  const [x0, y0] = polar(r, a0);
  const [x1, y1] = polar(r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
}

const segments = (() => {
  const usable = 360 - GAP_DEG * checklists.length;
  let cursor = GAP_DEG / 2;
  return checklists.map(g => {
    const span = (g.items.length / TOTAL_ITEMS) * usable;
    const seg = { group: g, a0: cursor, a1: cursor + span, meta: categoryMeta(g) };
    cursor += span + GAP_DEG;
    return seg;
  });
})();

export function ReadinessGauge({
  isChecked, ready, onShowCritical,
}: {
  isChecked: (id: string) => boolean;
  ready: boolean;
  onShowCritical: () => void;
}) {
  const reduce = useReducedMotion();
  const done = checklists.reduce((n, g) => n + g.items.filter(i => isChecked(i.id)).length, 0);
  const pct = Math.round((done / TOTAL_ITEMS) * 100);
  const critLeft = CRITICAL_ITEMS.filter(i => !isChecked(i.id)).length;
  const critFrac = 1 - critLeft / CRITICAL_ITEMS.length;
  const spring = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 70, damping: 18 };

  // Where the outstanding critical items are, by locker — most first.
  const critByLocker = segments
    .map(({ group, meta }) => ({
      id: group.id, short: meta.short, color: meta.color,
      left: group.items.filter(i => i.priority === "critical" && !isChecked(i.id)).length,
      total: group.items.filter(i => i.priority === "critical").length,
    }))
    .filter(r => r.left > 0)
    .sort((a, b) => b.left - a.left);
  const maxLeft = Math.max(1, ...critByLocker.map(r => r.left));

  return (
    <div className="glass-strong relative w-full overflow-hidden rounded-[28px] p-5 sm:p-6 lg:w-[540px]">
      <div
        aria-hidden
        className={`${css.gaugeHalo} pointer-events-none absolute -left-16 -top-16 size-80 rounded-full opacity-50 blur-3xl`}
      />
      <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-stretch sm:gap-6">
      <div className="relative aspect-square w-full max-w-[224px] shrink-0 sm:w-[230px] sm:max-w-[250px]">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="size-full overflow-visible"
          role="img"
          aria-label={ready ? `${pct}% of provisioning stowed; ${critLeft} critical items outstanding` : "Loading readiness"}
        >
          <defs>
            <filter id="gauge-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <circle className={css.gaugeFace} cx={C} cy={C} r={133} />

          {/* Bezel ticks — every 5°, majors at the cardinal and inter-cardinal points */}
          {Array.from({ length: 72 }, (_, i) => {
            const deg = i * 5;
            const major = deg % 45 === 0;
            const [x0, y0] = polar(major ? 124 : 127, deg);
            const [x1, y1] = polar(132, deg);
            return (
              <line
                key={i}
                x1={x0} y1={y0} x2={x1} y2={y1}
                stroke={major ? "var(--ink-3)" : "var(--ink-4)"}
                strokeWidth={major ? 1.25 : 0.75}
                strokeLinecap="round"
              />
            );
          })}
          {(["N", "E", "S", "W"] as const).map((l, i) => {
            const [x, y] = polar(141, i * 90);
            return (
              <text key={l} x={x} y={y} textAnchor="middle" dominantBaseline="central"
                className="num" fontSize="8.5" letterSpacing="0.1em" fill="var(--ink-3)">{l}</text>
            );
          })}

          {/* Locker segments */}
          {segments.map(({ group, a0, a1, meta }) => {
            const d = arc(R_OUTER, a0, a1);
            const n = group.items.length;
            const frac = ready ? group.items.filter(i => isChecked(i.id)).length / n : 0;
            return (
              <g key={group.id}>
                <path d={d} fill="none" stroke={meta.color} strokeOpacity={0.16} strokeWidth={13} strokeLinecap="butt" />
                <motion.path
                  d={d}
                  fill="none"
                  stroke={meta.color}
                  strokeWidth={13}
                  strokeLinecap="round"
                  filter="url(#gauge-glow)"
                  className={css.arc}
                  initial={false}
                  animate={{ pathLength: frac, opacity: frac > 0 ? 1 : 0 }}
                  transition={spring}
                />
              </g>
            );
          })}

          {/* Critical ring */}
          <circle cx={C} cy={C} r={R_CRIT} fill="none" stroke="var(--alert)" strokeOpacity={0.22} strokeWidth={2} strokeDasharray="1.5 4.2" />
          <motion.circle
            cx={C} cy={C} r={R_CRIT}
            fill="none"
            stroke={critLeft === 0 ? "var(--ok)" : "var(--ink-2)"}
            strokeWidth={2}
            strokeLinecap="round"
            transform={`rotate(-90 ${C} ${C})`}
            initial={false}
            animate={{ pathLength: ready ? critFrac : 0, opacity: ready && critFrac > 0 ? 1 : 0 }}
            transition={spring}
          />
        </svg>

        {/* Centre readout */}
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            {ready ? (
              <p className="font-display text-[64px] font-light leading-none text-ink" aria-hidden>
                <span className="num tracking-[-0.04em]" style={{ fontFamily: "var(--font-display)" }}>{pct}</span>
                <span className="ml-0.5 align-top text-[22px] text-ink-3">%</span>
              </p>
            ) : (
              <span className="shimmer mx-auto block h-14 w-24 rounded-xl bg-tint/[0.05]" aria-hidden />
            )}
            <p className="eyebrow mt-2">Stowed</p>
          </div>
        </div>
      </div>

      {/* Headline insight */}
      <div className="relative flex w-full min-w-0 flex-1 flex-col sm:border-l sm:border-line sm:pl-6">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Readiness</p>
          <p className="eyebrow num">{ready ? `${done}/${TOTAL_ITEMS}` : "—"}</p>
        </div>
        {!ready ? (
          <span className="shimmer mt-4 block h-40 rounded-xl bg-tint/[0.04]" aria-hidden />
        ) : critLeft > 0 ? (
          <>
            <p className="mt-4 flex items-baseline gap-2.5">
              <span className="relative inline-flex size-2 -translate-y-2 self-center">
                <span className="pulse-glow absolute inset-0 rounded-full bg-alert" />
                <span className="absolute inset-0 rounded-full bg-alert" />
              </span>
              <span className="num text-[44px] leading-none tracking-[-0.04em] text-alert">{critLeft}</span>
              <span className="text-sm leading-tight text-ink-2">critical<br />still ashore</span>
            </p>
            <p className="mt-2 text-[13px] leading-snug text-ink-3">
              Of <span className="num">{CRITICAL_ITEMS.length}</span> that decide the departure date.
            </p>
            <ul className="mt-4 space-y-1.5" aria-label="Critical items outstanding by locker">
              {critByLocker.slice(0, 4).map(r => (
                <li key={r.id} className="flex items-center gap-2.5 text-[12px]">
                  <span className="w-[68px] shrink-0 truncate text-ink-2">{r.short}</span>
                  <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-tint/[0.07]">
                    <motion.span
                      className="absolute inset-y-0 left-0 rounded-full bg-alert/80"
                      initial={false}
                      animate={{ width: `${(r.left / maxLeft) * 100}%` }}
                      transition={spring}
                    />
                  </span>
                  <span className="num w-5 text-right text-ink-3">{r.left}</span>
                </li>
              ))}
              {critByLocker.length > 4 && (
                <li className="num text-[11px] text-ink-4">+{critByLocker.length - 4} more lockers</li>
              )}
            </ul>
            <button
              type="button"
              onClick={onShowCritical}
              className="group mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-alert/30 bg-alert/[0.08] px-4 text-[13px] font-medium text-alert transition-colors hover:bg-alert/[0.14] max-sm:mt-5 sm:translate-y-1"
            >
              Show what&rsquo;s outstanding
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
            </button>
          </>
        ) : (
          <div className="mt-4 flex flex-1 flex-col justify-center gap-3">
            <ShieldCheck className="size-8 text-ok" strokeWidth={1.5} />
            <p className="font-display text-2xl font-light leading-tight text-ink">
              Every critical item is <em className="text-ok">aboard.</em>
            </p>
            <p className="text-[13px] text-ink-3">Cleared to cast off. The rest is comfort.</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
