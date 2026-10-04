"use client";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export type DrawPhase = "static" | "hidden" | "shown";

/**
 * Scroll-triggered draw-in for a figure. The server (and reduced-motion users,
 * and anything already on screen at load) gets the complete static figure;
 * only a figure that starts below the fold is armed ("hidden") and released
 * ("shown") as it scrolls into view. Pair with the .fig/.wipe/.draw/... classes
 * in viz.module.css via `data-phase={phase}`.
 */
export function useDrawIn<T extends HTMLElement = HTMLDivElement>(margin = "0px 0px -18% 0px") {
  const ref = useRef<T>(null);
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<DrawPhase>("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || typeof IntersectionObserver === "undefined") return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return;
    let raf = requestAnimationFrame(() => setPhase("hidden"));
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        cancelAnimationFrame(raf);
        // two frames so the hidden state is committed before the transition
        raf = requestAnimationFrame(() => {
          raf = requestAnimationFrame(() => setPhase("shown"));
        });
        io.disconnect();
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduce, margin]);

  return [ref, phase] as const;
}
