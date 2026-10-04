import Link from "next/link";
import Mark from "@/components/chrome/Mark";

export const metadata = { title: "Off the chart | S/V Sabbatical" };

export default function NotFound() {
  return (
    <section className="relative grid min-h-dvh place-items-center overflow-hidden px-5 pb-32 pt-28">
      <div className="graticule pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="relative max-w-lg text-center">
        <Mark className="mx-auto size-14 opacity-80" />
        <p className="eyebrow mt-8">404 · Position unknown</p>
        <h1 className="font-display mt-4 text-[clamp(3rem,10vw,6rem)] font-light leading-[0.9]">
          Off the <em>chart.</em>
        </h1>
        <p className="mt-6 text-[17px] leading-relaxed text-ink-2">
          There&rsquo;s no water charted at this address. Plot a course back to known ground.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-abyss hover:bg-white">The voyage</Link>
          <Link href="/map" className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 text-sm text-ink-2 hover:bg-white/5 hover:text-ink">Open the chart</Link>
        </div>
      </div>
    </section>
  );
}
