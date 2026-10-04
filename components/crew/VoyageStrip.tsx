"use client";
import { Lock } from "lucide-react";
import { alpha, legStyle } from "@/lib/data/legStyle";
import type { RosterLeg } from "@/lib/crew/types";
import { dayCount, dayLabel } from "./crewFormat";
import styles from "./crew.module.css";

// The whole passage as one line: each leg's width is proportional to its days,
// with its berths as pips beneath. Desktop columns are themselves the jump
// links; on phones the proportional bar is a read-only scale and an even row
// of numerals below it carries the (≥44px) targets.
export function VoyageStrip({ legs, onJump }: { legs: RosterLeg[]; onJump: (legId: string) => void }) {
  const days = legs.map((l) => dayCount(l.dayRange));
  const totalDays = days.reduce((a, b) => a + b, 0);
  const first = legs[0];
  const last = legs[legs.length - 1];

  return (
    <nav aria-label="Legs at a glance" className="mt-14 md:mt-20">
      <div className="mb-4 flex items-end justify-between gap-4">
        <p className="eyebrow">The passage at a glance</p>
        <p className="eyebrow hidden sm:block">
          <span className="num text-ink-2">{totalDays}</span> days ·{" "}
          <span className="num text-ink-2">{legs.length}</span> legs ·{" "}
          <span className="num text-ink-2">{first?.capacity ?? 3}</span> berths each
        </p>
      </div>

      {/* ── Desktop / tablet: proportional, clickable ─────────────────── */}
      <ol
        className="hidden gap-1.5 md:grid"
        style={{ gridTemplateColumns: days.map((d) => `minmax(48px, ${d}fr)`).join(" ") }}
      >
        {legs.map((leg) => {
          const s = legStyle(leg.legId);
          const status = leg.closed
            ? "reserved"
            : leg.spotsRemaining === 0
              ? "full crew"
              : `${leg.spotsRemaining} of ${leg.capacity} berths open`;
          return (
            <li key={leg.legId} className="@container min-w-0">
              <button
                type="button"
                onClick={() => onJump(leg.legId)}
                aria-label={`Leg ${s.numeral}, ${leg.title}: ${status}. Jump to leg.`}
                className="group flex w-full flex-col gap-2.5 rounded-xl px-1 pb-2 pt-1.5 text-left transition-colors hover:bg-tint/[0.04]"
              >
                <span className="flex min-w-0 items-baseline gap-2 px-1">
                  <span className="num text-[11px] font-medium" style={{ color: s.color }}>{s.numeral}</span>
                  <span className="hidden truncate text-[12.5px] text-ink-2 transition-colors group-hover:text-ink @min-[96px]:inline">
                    {s.short}
                  </span>
                </span>
                <span
                  className={`relative block h-2 w-full overflow-hidden rounded-full transition-[box-shadow] ${leg.closed ? styles.hatch : styles.glowBar}`}
                  style={{
                    background: leg.closed ? alpha(s.color, 0.15) : s.color,
                    ["--c" as string]: s.color,
                  }}
                />
                <span className="flex items-center justify-between gap-2 px-1">
                  <Pips leg={leg} color={s.color} />
                  <span className="num hidden text-[10.5px] text-ink-3 @min-[110px]:inline">{leg.dayRange}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* ── Phone: proportional scale (read-only) + even targets ──────── */}
      <div className="md:hidden">
        <div className="flex h-2 gap-[3px]" aria-hidden>
          {legs.map((leg, i) => {
            const s = legStyle(leg.legId);
            return (
              <span
                key={leg.legId}
                className={`h-full rounded-full ${leg.closed ? styles.hatch : ""}`}
                style={{ flex: `${days[i]} 1 0`, background: leg.closed ? alpha(s.color, 0.2) : s.color }}
              />
            );
          })}
        </div>
        <ol className="mt-2 grid grid-cols-8">
          {legs.map((leg) => {
            const s = legStyle(leg.legId);
            const status = leg.closed
              ? "reserved"
              : leg.spotsRemaining === 0
                ? "full crew"
                : `${leg.spotsRemaining} of ${leg.capacity} berths open`;
            return (
              <li key={leg.legId}>
                <button
                  type="button"
                  onClick={() => onJump(leg.legId)}
                  aria-label={`Leg ${s.numeral}, ${leg.title}: ${status}. Jump to leg.`}
                  className="flex min-h-[52px] w-full flex-col items-center justify-center gap-1.5 rounded-lg active:bg-tint/[0.05]"
                >
                  <span className="num text-[10.5px] font-medium" style={{ color: s.color }}>{s.numeral}</span>
                  <Pips leg={leg} color={s.color} small />
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-line pt-3">
        <span className="eyebrow !text-[10px]">
          <span className="num text-ink-3">{first?.dateRange.split(/[–-]/)[0].trim()}</span>
          <span className="hidden sm:inline"> · {first ? dayLabel(first.dayRange.split(/[–-]/)[0]) : ""}</span>
        </span>
        <span className="eyebrow hidden !text-[10px] items-center gap-4 md:flex">
          <Legend swatch={<span className="size-2 rounded-full bg-ink-2" />} label="Crew aboard" />
          <Legend swatch={<span className="size-2 rounded-full border border-ink-3" />} label="Open berth" />
          <Legend swatch={<Lock className="size-2.5" strokeWidth={2} />} label="Reserved" />
        </span>
        <span className="eyebrow !text-[10px]">
          <span className="num text-ink-3">{last ? lastDate(last.dateRange) : ""}</span>
        </span>
      </div>
    </nav>
  );
}

function lastDate(range: string): string {
  // "Jul 20–23" → "Jul 23"; "Jun 30 – Jul 2" → "Jul 2"; "Jul 3" → "Jul 3"
  const parts = range.split(/\s*[–-]\s*/);
  if (parts.length === 1) return parts[0];
  const end = parts[parts.length - 1];
  return /^\d+$/.test(end) ? `${parts[0].split(" ")[0]} ${end}` : end;
}

function Legend({ swatch, label }: { swatch: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-ink-3">
      {swatch}
      {label}
    </span>
  );
}

function Pips({ leg, color, small = false }: { leg: RosterLeg; color: string; small?: boolean }) {
  const size = small ? "size-[5px]" : "size-1.5";
  if (leg.closed) {
    return <Lock className={small ? "size-2.5 text-ink-4" : "size-3 text-ink-4"} strokeWidth={2} aria-hidden />;
  }
  return (
    <span className="flex items-center gap-[3px]" aria-hidden>
      {Array.from({ length: leg.capacity }, (_, i) => {
        const taken = i < leg.taken;
        return (
          <span
            key={i}
            className={`${size} rounded-full ${taken ? styles.glowDot : ""}`}
            style={
              taken
                ? { background: color, ["--c" as string]: color }
                : { boxShadow: `inset 0 0 0 1px ${alpha(color, 0.6)}` }
            }
          />
        );
      })}
    </span>
  );
}
