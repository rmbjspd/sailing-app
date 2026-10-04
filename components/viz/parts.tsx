import type { ReactNode } from "react";

// Small presentational pieces shared by the figures. No hooks — safe in both
// server and client components.

// Theme-following colours. The custom properties live on `.root` in
// viz.module.css (night values = the original Night Chart literals; day values
// = ink on chart paper), so SVG fill/stroke attributes follow the theme with
// no React branching.
export const INK = { ink: "var(--vz-ink)", ink2: "var(--vz-ink2)", ink3: "var(--vz-ink3)", ink4: "var(--vz-ink4)" } as const;
export const SIG = { glow: "var(--vz-glow)", brass: "var(--vz-brass)", alert: "var(--vz-alert)" } as const;
export const GRID = "var(--vz-grid)";
export const GRID_STRONG = "var(--vz-grid-strong)";
/** Fill for knocked-out markers (hollow dots, badges): the page surface. */
export const KNOCK = "var(--vz-knock)";
/** Cross-highlight band for the active day. */
export const HILITE = "var(--vz-hilite)";
/** Theme overlay (white at night, ink-navy by day) at the given alpha. */
export const tint = (a: number) => `rgb(var(--tint) / ${a})`;

export const fmt = (n: number, d = 0) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

export const pct = (n: number) => `${Math.round(n * 100)}%`;

/** Editorial figure opener: "Fig. 1" kicker, display title, dek. */
export function FigureHeader({
  num, kicker, title, dek, aside,
}: { num: string; kicker: string; title: ReactNode; dek?: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow mb-4 flex items-center gap-3">
          <span className="num text-brass">Fig. {num}</span>
          <span className="h-px w-6 bg-[var(--line-strong)]" />
          {kicker}
        </p>
        <h3 className="font-display text-[clamp(2rem,4.2vw,3.4rem)] font-light leading-[0.95] text-ink">{title}</h3>
        {dek && <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-2 md:text-base">{dek}</p>}
      </div>
      {aside}
    </div>
  );
}

/** A compact stat: big mono figure, unit, label. */
export function Stat({ value, unit, label, tone = "ink" }: { value: ReactNode; unit?: string; label: ReactNode; tone?: "ink" | "brass" | "glow" }) {
  const c = tone === "brass" ? "text-brass" : tone === "glow" ? "text-glow" : "text-ink";
  return (
    <div className="min-w-0">
      <p className={`num text-2xl leading-none md:text-[28px] ${c}`}>
        {value}
        {unit && <span className="ml-1 text-sm text-ink-3">{unit}</span>}
      </p>
      <p className="mt-2 text-[12px] leading-snug text-ink-3">{label}</p>
    </div>
  );
}

/**
 * SVG callout: a dot on the data, an elbow leader, and a two-tier label
 * (mono kicker + sans line(s)). `side` picks which way the text runs.
 */
export function Callout({
  x, y, tx, ty, kicker, lines, tone = "ink", side = "right", className, dot = true, style,
}: {
  x: number; y: number; tx: number; ty: number;
  kicker?: string; lines: string[];
  tone?: "ink" | "brass" | "glow" | "alert";
  side?: "right" | "left";
  className?: string;
  dot?: boolean;
  style?: React.CSSProperties;
}) {
  const col = tone === "brass" ? SIG.brass : tone === "glow" ? SIG.glow : tone === "alert" ? SIG.alert : INK.ink2;
  const dir = side === "right" ? 1 : -1;
  const anchor = side === "right" ? "start" : "end";
  const lx = tx + dir * 6;
  return (
    <g className={className} style={style} aria-hidden>
      <path d={`M${x},${y} L${x},${ty} L${tx},${ty}`} fill="none" stroke={col} strokeOpacity={0.55} strokeWidth={0.75} />
      {dot && <circle cx={x} cy={y} r={2.5} fill={KNOCK} stroke={col} strokeWidth={1.25} />}
      {kicker && (
        <text x={lx} y={ty - 5} textAnchor={anchor} className="font-mono" fontSize={9.5} letterSpacing="0.12em" fill={col}>
          {kicker.toUpperCase()}
        </text>
      )}
      {lines.map((l, i) => (
        <text key={i} x={lx} y={ty + 10 + i * 14} textAnchor={anchor} fontSize={12} fill={i === 0 ? INK.ink : INK.ink2}>
          {l}
        </text>
      ))}
    </g>
  );
}

/** Numbered badge used to key annotations to a list on small screens. */
export function KeyBadge({ x, y, n, tone = "brass" }: { x: number; y: number; n: number; tone?: "brass" | "glow" | "ink" }) {
  const col = tone === "brass" ? SIG.brass : tone === "glow" ? SIG.glow : INK.ink2;
  return (
    <g aria-hidden>
      <circle cx={x} cy={y} r={7.5} fill={KNOCK} stroke={col} strokeWidth={1} />
      <text x={x} y={y + 3.2} textAnchor="middle" fontSize={9} className="font-mono" fill={col}>{n}</text>
    </g>
  );
}
