import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

// Editorial section opener: mono eyebrow, oversized Fraunces title (wrap
// emphasis in <em> for the soft italic), optional lede paragraph.
export function SectionHeader({
  eyebrow, title, lede, align = "left", className = "",
}: {
  eyebrow?: ReactNode; title: ReactNode; lede?: ReactNode; align?: "left" | "center"; className?: string;
}) {
  const center = align === "center";
  return (
    <header className={`${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && (
        <Reveal>
          <p className={`eyebrow mb-5 flex items-center gap-3 ${center ? "justify-center" : ""}`}>
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--ink-3)]" />
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.75rem)] font-light leading-[0.95] text-ink">
          {title}
        </h2>
      </Reveal>
      {lede && (
        <Reveal delay={0.12}>
          <p className={`mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-2 ${center ? "mx-auto" : ""}`}>
            {lede}
          </p>
        </Reveal>
      )}
    </header>
  );
}
