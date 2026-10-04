import type { CSSProperties } from "react";
import type { ChartData } from "./model";
import styles from "./log.module.css";

// The whole passage as a single luminous signature behind the page title:
// the real route geometry, leg by leg, drawing itself in on load.
export function HeroRoute({ chart, className = "" }: { chart: ChartData; className?: string }) {
  const [x, y, w, h] = chart.routeBox;
  const p = 40;
  return (
    <svg
      aria-hidden
      className={`${styles.heroRoute} ${className}`}
      viewBox={`${x - p} ${y - p} ${w + 2 * p} ${h + 2 * p}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {chart.legs.map((l, i) => (
        <g key={l.legId} style={{ "--i": i, "--c": l.color } as CSSProperties}>
          <path d={l.d} pathLength={1} className={styles.heroHalo} stroke={l.color} />
          <path d={l.d} pathLength={1} className={styles.heroPath} stroke={l.color} />
        </g>
      ))}
      {chart.stops.map((s, i) => (
        <circle
          key={s.id}
          cx={s.x}
          cy={s.y}
          r={i === 0 || i === chart.stops.length - 1 ? 7 : 3.5}
          fill={s.color}
          className={styles.heroDot}
          style={{ "--i": chart.legs.findIndex(l => l.legId === s.leg) } as CSSProperties}
        />
      ))}
    </svg>
  );
}
