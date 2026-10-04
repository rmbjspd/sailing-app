"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, RotateCcw } from "lucide-react";
import type { ChecklistGroup, ChecklistItem } from "@/lib/types";
import { categoryMeta } from "./categories";
import { ChecklistRow } from "./ChecklistRow";
import css from "./provisioning.module.css";

// A locker: glass panel, coloured icon seal, progress bar, and its items. When
// the last item goes in, the seal throws a small ring-burst (motion-safe only).

export function CategoryPanel({
  group, index, visibleItems, isChecked, ready, onToggle, onReset, celebrate, emptyMessage,
}: {
  group: ChecklistGroup;
  index: number;
  visibleItems: ChecklistItem[];
  isChecked: (id: string) => boolean;
  ready: boolean;
  onToggle: (item: ChecklistItem) => void;
  onReset: () => void;
  celebrate: number | null;
  emptyMessage: string;
}) {
  const reduce = useReducedMotion();
  const meta = categoryMeta(group);
  const Icon = meta.icon;
  const total = group.items.length;
  const done = group.items.filter(i => isChecked(i.id)).length;
  const complete = ready && done === total;
  const critLeft = group.items.filter(i => i.priority === "critical" && !isChecked(i.id)).length;
  const pct = ready ? done / total : 0;
  const headingId = `locker-${group.id}`;

  return (
    <section
      aria-labelledby={headingId}
      id={`locker-panel-${group.id}`}
      // Colour wash from the seal, warming when the locker is complete. Pure
      // gradients (no blurred layers / clipping) keep long panels cheap to paint.
      className={`${css.panel} relative scroll-mt-28 rounded-[26px] border border-line`}
      data-complete={complete}
      style={{ "--c": meta.color } as React.CSSProperties}
    >
      <header className="relative px-4 pb-4 pt-5 sm:px-7 sm:pt-7">
        <div className="flex items-start gap-4">
          {/* Seal */}
          <div className="relative shrink-0">
            <span
              className={`${css.seal} grid size-12 place-items-center rounded-2xl border`}
              data-complete={complete}
            >
              {complete
                ? <Check className="size-5" strokeWidth={2.25} />
                : <Icon className="size-5" strokeWidth={1.6} />}
            </span>
            <AnimatePresence>
              {celebrate !== null && !reduce && <Burst key={celebrate} />}
            </AnimatePresence>
          </div>

          <div className="min-w-0 flex-1">
            <p className="eyebrow num">
              Locker {String(index + 1).padStart(2, "0")}
              <span className="mx-2 text-ink-4">/</span>
              {total} items
            </p>
            <h2 id={headingId} className="font-display mt-1.5 text-[26px] font-light leading-[1.05] text-ink sm:text-[30px]">
              {group.title}
            </h2>
          </div>

          <div className="flex shrink-0 items-start gap-1 sm:gap-2">
            <div className="hidden text-right sm:block">
              {ready ? (
                <p className="num text-[22px] leading-none text-ink">
                  {done}<span className="text-ink-4">/{total}</span>
                </p>
              ) : (
                <span className="shimmer block h-6 w-14 rounded-md bg-tint/[0.05]" />
              )}
              <p className={`eyebrow mt-1.5 !text-[10px] ${complete ? "!text-ok" : ""}`}>{complete ? "All stowed" : "Stowed"}</p>
            </div>
            <button
              type="button"
              onClick={onReset}
              disabled={!ready || done === 0}
              aria-label={`Reset ${group.title}`}
              title={`Reset ${group.title}`}
              className="grid size-11 place-items-center rounded-full text-ink-3 transition-colors hover:bg-tint/[0.06] hover:text-ink disabled:pointer-events-none disabled:opacity-30"
            >
              <RotateCcw className="size-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-5 flex items-center gap-3">
          <div className={`${css.track} relative h-[3px] flex-1 overflow-hidden rounded-full`}>
            <motion.div
              className={`${css.bar} absolute inset-y-0 left-0 rounded-full`}
              initial={false}
              animate={{ width: `${pct * 100}%`, opacity: pct > 0 ? 1 : 0 }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 20 }}
            />
          </div>
          <p className="num w-10 text-right text-xs text-ink-3 sm:hidden">{ready ? `${done}/${total}` : "—"}</p>
          {ready && critLeft > 0 && (
            <p className="hidden shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-alert sm:flex">
              <span className="size-[5px] rounded-full bg-alert" />
              <span className="num">{critLeft}</span> critical left
            </p>
          )}
        </div>
      </header>

      <div className="relative px-1.5 pb-3 sm:px-3 sm:pb-4">
        <div className="hairline mx-3 mb-1 opacity-60" />
        {visibleItems.length === 0 ? (
          <p className="flex items-center gap-3 px-4 py-6 text-sm text-ink-3">
            <Check className="size-4 text-ok" strokeWidth={2} />
            {emptyMessage}
          </p>
        ) : (
          <ul>
            <AnimatePresence initial={false}>
              {visibleItems.map(item => (
                <motion.li
                  key={item.id}
                  layout={reduce ? false : "position"}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0, transition: { duration: 0.32, delay: reduce ? 0 : 0.45, ease: [0.65, 0, 0.35, 1] } }}
                  transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <ChecklistRow
                    item={item}
                    checked={isChecked(item.id)}
                    ready={ready}
                    onToggle={() => onToggle(item)}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </section>
  );
}

// Ring-burst: an expanding halo plus a scatter of sparks from the seal.
// Reads the locker colour from the panel's --c.
function Burst() {
  const sparks = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2);
  return (
    <motion.span
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      aria-hidden
    >
      <motion.span
        className="absolute inset-0 rounded-2xl border-2"
        style={{ borderColor: "var(--c)" }}
        initial={{ scale: 1, opacity: 0.9 }}
        animate={{ scale: 2.6, opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        className={`${css.burstHalo} absolute inset-0 rounded-full`}
        initial={{ scale: 0.6, opacity: 1 }}
        animate={{ scale: 3.2, opacity: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
      {sparks.map((a, i) => (
        <motion.span
          key={i}
          className={`${css.spark} absolute left-1/2 top-1/2 size-1.5 -ml-[3px] -mt-[3px] rounded-full`}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: Math.cos(a) * (46 + (i % 3) * 10), y: Math.sin(a) * (46 + (i % 3) * 10), opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.9 + (i % 3) * 0.12, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </motion.span>
  );
}
