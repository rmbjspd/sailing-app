"use client";
import { useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type DrawPhase = "static" | "hidden" | "shown";

// useLayoutEffect warns during SSR; this hook only arms on the client anyway.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** A figure whose top is within this many viewport heights of the fold is "near view". */
const NEAR_VIEW = 1.25;
/** Hard ceiling: a near-view figure is released this long after mount even if the observer is starved. */
const FALLBACK_MS = 1200;

/**
 * Scroll-triggered draw-in for a figure. The server (and reduced-motion users,
 * and anything already on screen at load) gets the complete static figure.
 * A figure that starts below the fold is armed ("hidden") synchronously before
 * first paint, so there is no blank-axes flash, and released ("shown") when it
 * scrolls into view. Two safety nets keep it from getting stuck hidden: a
 * figure in or near view at mount is released within FALLBACK_MS no matter
 * what, and every scroll re-checks the position in case the observer is
 * starved on a slow device. Pair with the .fig/.wipe/.draw/... classes in
 * viz.module.css via `data-phase={phase}`.
 */
export function useDrawIn<T extends HTMLElement = HTMLDivElement>(margin = "0px 0px -18% 0px") {
  const ref = useRef<T>(null);
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<DrawPhase>("static");

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduce || typeof IntersectionObserver === "undefined") return;
    const vh = window.innerHeight;
    const top = el.getBoundingClientRect().top;
    if (top < vh * 0.85) return; // already on screen: stay static (complete)

    // Arm before paint — no rAF gap between the static and hidden states.
    setPhase("hidden");
    let done = false;
    let raf = 0;
    const release = () => {
      if (done) return;
      done = true;
      cleanup();
      // one frame so the hidden state is committed before the transition runs
      raf = requestAnimationFrame(() => setPhase("shown"));
    };
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) release(); }, { rootMargin: margin });
    io.observe(el);
    // Observer-independent check on scroll (cheap: one rect read, passive).
    const onScroll = () => { if (el.getBoundingClientRect().top < window.innerHeight * 0.9) release(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    // Near view at mount → guaranteed fully drawn within FALLBACK_MS.
    const timer = top < vh * (1 + NEAR_VIEW) ? window.setTimeout(release, FALLBACK_MS) : 0;
    function cleanup() {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (timer) window.clearTimeout(timer);
    }
    return () => {
      cleanup();
      cancelAnimationFrame(raf);
    };
  }, [reduce, margin]);

  return [ref, phase] as const;
}
