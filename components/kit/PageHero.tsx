import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

// Shared opener for interior pages (Ship's Log, Provisioning, Journal, Crew).
// Clears the floating nav, sets the big editorial title, and offers a slot on
// the right (or below on mobile) for a stat cluster or primary action.
export function PageHero({
  eyebrow, title, lede, aside, children,
}: {
  eyebrow: ReactNode; title: ReactNode; lede?: ReactNode; aside?: ReactNode; children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-32 pb-12 md:pt-40 md:pb-16">
      <div className="graticule pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Reveal>
              <p className="eyebrow mb-6 flex items-center gap-3">
                <span className="spectrum-line w-10" />
                {eyebrow}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-display text-[clamp(3rem,8vw,7.5rem)] font-light leading-[0.9] text-ink">
                {title}
              </h1>
            </Reveal>
            {lede && (
              <Reveal delay={0.12}>
                <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-ink-2">{lede}</p>
              </Reveal>
            )}
          </div>
          {aside && <Reveal delay={0.18} className="shrink-0">{aside}</Reveal>}
        </div>
        {children}
      </div>
    </section>
  );
}
