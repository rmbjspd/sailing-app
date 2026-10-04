"use client";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Fade-and-rise on first scroll into view. `delay` in seconds; stagger lists by
// passing i * 0.05. Respects prefers-reduced-motion (renders static).
export function Reveal({
  children, delay = 0, y = 24, className, as = "div",
}: {
  children: ReactNode; delay?: number; y?: number; className?: string;
  as?: "div" | "section" | "li" | "span" | "article" | "header";
}) {
  const reduce = useReducedMotion();
  const M = motion[as];
  if (reduce) return <M className={className}>{children}</M>;
  return (
    <M
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}
