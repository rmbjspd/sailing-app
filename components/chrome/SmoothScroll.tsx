"use client";
import { useEffect } from "react";
import Lenis from "lenis";

// Global inertial scroll. Disabled for reduced-motion users and on pages that
// opt out by adding `data-native-scroll` to <html> (e.g. full-screen 3D map).
// The instance is exposed on window.__lenis so scrollytelling components can
// read velocity or call scrollTo without a context provider.
declare global {
  interface Window { __lenis?: Lenis }
}

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, smoothWheel: true });
    window.__lenis = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
  return null;
}
