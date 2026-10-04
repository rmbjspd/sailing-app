"use client";
import { legGroups } from "@/lib/data/stats";
import { legStyle } from "@/lib/data/legStyle";
import { formatEntryDate, isoForDay, routeLabel } from "./logFormat";
import css from "./journal.module.css";

// The voyage as a row of pages: one cell per day, coloured by leg, lit when
// the day has an entry. Logged days jump to their entry; empty days open the
// composer for that day. Desktop: one continuous band grouped by leg.
// Phone: a 7-column calendar (35 days = exactly five weeks).

const LEGS = legGroups();

export function VoyageStrip({
  counts, ready, today, onPick,
}: {
  counts: Map<number, number>;
  ready: boolean;
  today: number;
  onPick: (day: number) => void;
}) {
  const logged = [...counts.keys()].filter(d => d > 0).length;
  const total = LEGS.reduce((n, l) => n + l.days.length, 0);

  const cell = (day: number, legId: string, variant: "band" | "grid") => {
    const it = LEGS.find(l => l.legId === legId)!.days.find(d => d.day === day)!;
    const s = legStyle(legId);
    const n = ready ? counts.get(day) ?? 0 : 0;
    const isToday = day === today;
    const label = `Day ${day}, ${formatEntryDate(isoForDay(day), { weekday: "short", month: "short", day: "numeric" })}: ${routeLabel(it)}. ${
      n ? `${n} ${n === 1 ? "entry" : "entries"} — jump to it` : "No entry yet — write one"
    }`;
    return (
      <button
        key={day}
        type="button"
        onClick={() => onPick(day)}
        aria-label={label}
        title={label}
        data-logged={n > 0}
        className={`${css.cell} group/cell relative grid place-items-center rounded-[7px] border transition-[transform,background-color,border-color,box-shadow] duration-300 hover:-translate-y-0.5 ${
          variant === "band" ? "h-10 min-w-0 flex-1" : "h-11"
        }`}
        style={{ "--c": s.color } as React.CSSProperties}
      >
        <span
          className={`num text-[10px] leading-none ${n ? `font-semibold ${css.cellNum}` : "text-ink-3 group-hover/cell:text-ink"}`}
        >
          {day}
        </span>
        {isToday && (
          <span className={`${css.dot} absolute -bottom-2 left-1/2 size-1 -translate-x-1/2 rounded-full bg-glow`} />
        )}
      </button>
    );
  };

  return (
    <div className="glass mt-12 rounded-[24px] px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="eyebrow">Voyage days</p>
        <p className="num text-xs text-ink-3">
          {ready ? (
            <><span className="text-ink">{logged}</span> of {total} days logged</>
          ) : (
            <span className="shimmer inline-block h-3 w-28 rounded bg-tint/[0.05] align-middle" />
          )}
        </p>
      </div>

      {/* Desktop band */}
      <div className="hidden gap-2.5 md:flex" role="group" aria-label="Voyage days">
        {LEGS.map(l => {
          const s = legStyle(l.legId);
          return (
            <div key={l.legId} className="min-w-0" style={{ flex: `${l.days.length} 1 0%` }}>
              <p className="mb-2 flex items-center gap-1.5 truncate font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: s.color }} title={s.label}>
                <span className={l.days.length >= 3 ? "opacity-60" : ""}>{s.numeral}</span>
                {l.days.length >= 3 && <span className="truncate">{s.short}</span>}
              </p>
              <div className="flex gap-1">{l.days.map(d => cell(d.day, l.legId, "band"))}</div>
            </div>
          );
        })}
      </div>

      {/* Phone calendar */}
      <div className="grid grid-cols-7 gap-1.5 md:hidden" role="group" aria-label="Voyage days">
        {LEGS.flatMap(l => l.days.map(d => cell(d.day, l.legId, "grid")))}
      </div>
    </div>
  );
}
