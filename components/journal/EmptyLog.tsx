"use client";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { LegChip } from "@/components/kit";
import { alpha } from "@/lib/data/legStyle";
import { formatEntryDate, isoForDay, itineraryDay, routeLabel } from "./logFormat";
import css from "./journal.module.css";

// The blank first page: an open logbook in line-art — ruled lines on the left
// page with the first line half-written, a compass rose on the right — and an
// invitation to begin with Day 1.
export function EmptyLog({ onBegin, onBlank }: { onBegin: (day: number) => void; onBlank: () => void }) {
  const reduce = useReducedMotion();
  const day1 = itineraryDay(1);
  const draw = (delay: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 1.4, delay, ease: [0.65, 0, 0.35, 1] as const },
        };

  const rules = Array.from({ length: 7 }, (_, i) => 66 + i * 14);

  return (
    <div className="relative mx-auto max-w-2xl py-6 text-center sm:py-10">
      <div className={`mx-auto w-full max-w-[420px] ${reduce ? "" : "float-y"}`}>
        <svg viewBox="0 0 320 210" className="w-full overflow-visible" role="img" aria-label="An open logbook with a compass rose">
          <defs>
            <linearGradient id="log-spine" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="var(--glow)" stopOpacity="0.0" />
              <stop offset="0.5" stopColor="var(--glow)" stopOpacity="0.55" />
              <stop offset="1" stopColor="var(--glow)" stopOpacity="0.0" />
            </linearGradient>
            <radialGradient id="log-halo" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="var(--glow)" stopOpacity="0.16" />
              <stop offset="1" stopColor="var(--glow)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse className={css.halo} cx="160" cy="112" rx="170" ry="100" fill="url(#log-halo)" />

          {/* Page edges (thickness) */}
          {[8, 4].map(o => (
            <g key={o} stroke="var(--ink-4)" strokeWidth="1" fill="none" opacity={o === 8 ? 0.5 : 0.8}>
              <path d={`M160 ${44 + o} C120 ${32 + o} 72 ${32 + o} 28 ${40 + o} L28 ${172 + o} C72 ${164 + o} 120 ${164 + o} 160 ${176 + o}`} />
              <path d={`M160 ${44 + o} C200 ${32 + o} 248 ${32 + o} 292 ${40 + o} L292 ${172 + o} C248 ${164 + o} 200 ${164 + o} 160 ${176 + o}`} />
            </g>
          ))}
          {/* Pages */}
          <path className={css.page} d="M160 44 C120 32 72 32 28 40 L28 172 C72 164 120 164 160 176 Z" stroke="var(--ink-3)" strokeWidth="1.1" />
          <path className={css.page} d="M160 44 C200 32 248 32 292 40 L292 172 C248 164 200 164 160 176 Z" stroke="var(--ink-3)" strokeWidth="1.1" />
          <line x1="160" y1="44" x2="160" y2="176" stroke="url(#log-spine)" strokeWidth="1.5" />

          {/* Ruled lines + margin */}
          <line className={css.marginStroke} x1="52" y1="48" x2="52" y2="164" strokeWidth="0.8" />
          {rules.map(y => (
            <path key={y} className={css.ruleStroke} d={`M40 ${y} C80 ${y - 6} 120 ${y - 5} 150 ${y + 2}`} fill="none" strokeWidth="0.7" />
          ))}
          {/* The first line, half written */}
          <motion.path
            d="M58 59 c4 -5 7 4 11 -1 s6 -3 9 1 s7 -4 11 -1 s5 2 9 -2 s8 3 12 0"
            fill="none" stroke="var(--glow)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
            className={css.pen}
            {...draw(0.4)}
          />
          {/* Day / date header on the left page */}
          <text x="58" y="47" className="num" fontSize="6.5" letterSpacing="1.2" fill="var(--ink-3)">DAY 01</text>

          {/* Compass rose on the right page */}
          <g transform="translate(226 104)">
            <circle r="38" fill="none" stroke="var(--ink-4)" strokeWidth="0.8" />
            <circle r="30" fill="none" stroke="var(--ink-4)" strokeWidth="0.5" strokeDasharray="1 3" />
            {Array.from({ length: 32 }, (_, i) => {
              const a = (i / 32) * Math.PI * 2;
              const r0 = i % 4 === 0 ? 33 : 35.5;
              return (
                <line key={i}
                  x1={Math.round(Math.sin(a) * r0 * 100) / 100} y1={Math.round(-Math.cos(a) * r0 * 100) / 100}
                  x2={Math.round(Math.sin(a) * 38 * 100) / 100} y2={Math.round(-Math.cos(a) * 38 * 100) / 100}
                  stroke="var(--ink-3)" strokeWidth={i % 4 === 0 ? 0.9 : 0.5}
                />
              );
            })}
            <motion.path d="M0 -28 L5 -5 L28 0 L5 5 L0 28 L-5 5 L-28 0 L-5 -5 Z"
              fill={alpha("var(--brass)", 0.08)} stroke="var(--brass)" strokeWidth="0.9" strokeLinejoin="round" {...draw(0.1)} />
            <path d="M0 -28 L5 -5 L0 0 Z" fill="var(--brass)" opacity="0.85" />
            <path d="M-14 -14 L2 -2 L-2 2 Z M14 -14 L2 2 L-2 -2 Z M14 14 L-2 2 L2 -2 Z M-14 14 L2 2 L-2 -2 Z" fill="none" stroke="var(--ink-3)" strokeWidth="0.6" />
            <circle r="2" fill="var(--abyss)" stroke="var(--brass)" strokeWidth="0.8" />
            <text y="-44" textAnchor="middle" className="num" fontSize="7" fill="var(--brass)">N</text>
          </g>

          {/* Course line off the right page */}
          <motion.path d="M178 152 C200 140 214 150 236 142 S270 132 282 138" fill="none"
            stroke="var(--ink-3)" strokeWidth="0.9" strokeDasharray="2 3" {...draw(0.8)} />
          <circle cx="178" cy="152" r="2" fill="var(--leg-1)" />
          <circle cx="282" cy="138" r="2" fill="var(--leg-8)" />
        </svg>
      </div>

      <h2 className="font-display mt-8 text-[clamp(2rem,5vw,3rem)] font-light leading-[1.02] text-ink">
        The first page is <em className="text-brass">blank.</em>
      </h2>
      <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-ink-2">
        Every passage worth making is worth writing down &mdash; the wind, the light, the
        lock-keeper&rsquo;s name. Begin where the voyage does.
      </p>

      {day1 && (
        <button
          type="button"
          onClick={() => onBegin(1)}
          aria-label={`Begin the log with Day 1, ${formatEntryDate(isoForDay(1), { weekday: "long", month: "long", day: "numeric", year: "numeric" })}: ${routeLabel(day1)}`}
          className={`${css.begin} group mx-auto mt-8 flex w-full max-w-md items-center gap-4 rounded-2xl border border-line-strong p-4 text-left transition-[border-color,background-color,box-shadow] duration-300 sm:p-5`}
        >
          <span className="grid size-14 shrink-0 place-items-center rounded-xl border border-line bg-abyss/60">
            <span className="text-center leading-none">
              <span className="eyebrow block !text-[9px]">Day</span>
              <span className="num mt-1 block text-xl text-ink">01</span>
            </span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="num block text-[13px] text-ink-3">
              {formatEntryDate(isoForDay(1), { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span className="font-display mt-0.5 block truncate text-xl font-light text-ink">{routeLabel(day1)}</span>
            <span className="mt-2 block"><LegChip legId={day1.leg} size="sm" /></span>
          </span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-glow">
            <span className="hidden sm:inline">Begin</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.75} />
          </span>
        </button>
      )}
      <button
        type="button"
        onClick={onBlank}
        className="mt-4 min-h-11 rounded-full px-4 text-[13px] text-ink-3 underline decoration-ink-4 underline-offset-4 transition-colors hover:text-ink"
      >
        or start a blank page
      </button>
    </div>
  );
}
