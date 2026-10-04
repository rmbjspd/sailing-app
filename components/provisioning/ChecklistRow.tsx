"use client";
import { motion, useReducedMotion } from "motion/react";
import type { ChecklistItem } from "@/lib/types";
import { PRIORITY_LABEL, type Priority } from "./categories";
import css from "./provisioning.module.css";

// One stowable item. A real <input type="checkbox"> (visually hidden) drives a
// custom box, so keyboard, screen readers and form semantics come for free;
// the whole row is the label for a generous touch target. The locker colour
// comes from the panel's --c custom property; fills/borders are themed in CSS
// and only the "pop" is animated here.

const PRIORITY_DOT: Record<Priority, string> = {
  critical: `bg-alert ${css.critDot}`,
  important: "bg-brass",
  nice: "border border-ink-3 bg-transparent",
};
const PRIORITY_TEXT: Record<Priority, string> = {
  critical: "text-alert",
  important: "text-brass",
  nice: "text-ink-3",
};

export function ChecklistRow({
  item, checked, ready, onToggle,
}: {
  item: ChecklistItem;
  checked: boolean;
  ready: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();
  const spring = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 520, damping: 22 };
  const p = item.priority;

  return (
    <label
      className="group/row relative flex min-h-[52px] cursor-pointer items-start gap-4 rounded-2xl px-3 py-3.5 transition-colors duration-200 hover:bg-tint/[0.035] sm:px-4"
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={!ready}
        onChange={onToggle}
      />
      {/* The box */}
      <span
        aria-hidden
        className="relative mt-[1px] grid size-[22px] shrink-0 place-items-center rounded-[7px] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-glow"
      >
        {!ready ? (
          <span className="shimmer absolute inset-0 rounded-[7px] border border-line bg-tint/[0.04]" />
        ) : (
          <motion.span
            className={`${css.box} absolute inset-0 rounded-[7px] border`}
            data-checked={checked}
            initial={false}
            animate={{ scale: checked ? [0.78, 1.12, 1] : 1 }}
            transition={reduce ? { duration: 0 } : { duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
        {ready && (
          <svg viewBox="0 0 16 16" className="relative size-[14px]">
            <motion.path
              d="M3.2 8.4 L6.6 11.6 L12.8 4.6"
              className={css.tick}
              fill="none"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
              transition={checked ? { ...spring, delay: reduce ? 0 : 0.06 } : { duration: 0.12 }}
            />
          </svg>
        )}
        {/* Hover hint ring */}
        {ready && !checked && (
          <span
            className={`${css.hoverRing} pointer-events-none absolute inset-0 rounded-[7px] opacity-0 transition-opacity duration-200 group-hover/row:opacity-100`}
          />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block text-[15px] leading-snug decoration-1 underline-offset-2 transition-[color,text-decoration-color] duration-300 ${
            checked
              ? "text-ink-3 line-through decoration-ink-3/70"
              : "text-ink decoration-transparent"
          }`}
        >
          {item.label}
        </span>
        {(p || item.notes) && (
          <span className={`mt-1.5 block text-[13px] leading-relaxed transition-opacity duration-300 ${checked ? "opacity-60" : ""}`}>
            {p && (
              <span className={`mr-2 inline-flex items-center gap-1.5 align-[1px] font-mono text-[10px] uppercase tracking-[0.16em] ${PRIORITY_TEXT[p]}`}>
                <span className={`inline-block size-[5px] rounded-full ${PRIORITY_DOT[p]}`} />
                {PRIORITY_LABEL[p]}
              </span>
            )}
            {item.notes && <span className="text-ink-3">{item.notes}</span>}
          </span>
        )}
      </span>
    </label>
  );
}
