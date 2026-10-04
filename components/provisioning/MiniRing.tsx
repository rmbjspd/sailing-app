"use client";
import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import css from "./provisioning.module.css";

// Small progress ring for the category rail. Fills in the locker's colour and
// turns into a solid seal with a check when the locker is fully stowed.
export function MiniRing({ frac, color, size = 30, ready = true }: { frac: number; color: string; size?: number; ready?: boolean }) {
  const reduce = useReducedMotion();
  const r = size / 2 - 2.5;
  const complete = ready && frac >= 1;
  return (
    <span
      className="relative inline-grid shrink-0 place-items-center"
      style={{ width: size, height: size, "--c": color } as React.CSSProperties}
      aria-hidden
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeOpacity={0.28} strokeWidth={2.5} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill={complete ? color : "transparent"}
          fillOpacity={complete ? 0.16 : 0}
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: ready ? frac : 0, opacity: ready && frac > 0 ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 20 }}
          className={frac > 0 ? css.ringGlow : undefined}
        />
      </svg>
      {complete && <Check className="relative size-3" strokeWidth={3} style={{ color }} />}
    </span>
  );
}
