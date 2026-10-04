"use client";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

// Cross-chart highlight: hovering a day (or a lock, or an operation) in one
// figure lights the same day in the others.
interface VizCtx {
  activeDay: number | null;
  setActiveDay: (d: number | null) => void;
}

const Ctx = createContext<VizCtx>({ activeDay: null, setActiveDay: () => {} });

export function VizProvider({ children }: { children: ReactNode }) {
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const value = useMemo(() => ({ activeDay, setActiveDay }), [activeDay]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useViz() {
  return useContext(Ctx);
}
