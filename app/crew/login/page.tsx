import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { hasValidSession } from "@/lib/crew/auth";
import { LoginForm } from "@/components/crew/LoginForm";
import { ChartBackdrop } from "@/components/crew/ChartBackdrop";
import Mark from "@/components/chrome/Mark";
import { itinerary } from "@/lib/data/itinerary";
import { legGroups, tripTotals } from "@/lib/data/stats";
import { dateForDay } from "@/lib/data/voyage";
import styles from "@/components/crew/crew.module.css";

export const dynamic = "force-dynamic";

export const metadata = { title: "Sign In | Crew Manifest" };

export default async function CrewLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  if (await hasValidSession()) redirect("/crew");

  const sp = await searchParams;
  const from = typeof sp.from === "string" && sp.from.startsWith("/crew") ? sp.from : "/crew";
  const initialError =
    sp.error === "rate"
      ? "Too many attempts — try again in a few minutes."
      : sp.error === "1"
        ? "Incorrect password."
        : null;

  // Boarding-pass details, all derived from the voyage plan.
  const totals = tripTotals();
  const origin = itinerary[0].from;
  const destination = itinerary[itinerary.length - 1].to;
  const [originCity, originRegion] = origin.split(",").map((s) => s.trim());
  const [destCity, destRegion] = destination.split(",").map((s) => s.trim());
  const departs = dateForDay(totals.dayStart).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
  });
  const days = totals.dayEnd - totals.dayStart + 1;
  const legs = legGroups().length;

  return (
    <div className="relative isolate flex min-h-dvh items-center justify-center px-4 pb-32 pt-28 md:pb-16 md:pt-28">
      <ChartBackdrop />

      <div className="relative z-10 w-full max-w-[452px]">
        {/* ── Stub: the voyage ─────────────────────────────────────────── */}
        <section
          aria-labelledby="crew-login-title"
          className={`glass-strong rounded-t-[28px] border-b-0 px-6 pb-7 pt-6 sm:px-8 ${styles.stubTop}`}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full border border-line bg-white/[0.04]">
                <Mark className="size-7" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-[15px] text-ink">S/V Sabbatical</span>
                <span className="eyebrow block !text-[9.5px]">Crew boarding pass</span>
              </span>
            </span>
            <span className="eyebrow !text-[9.5px] text-right">
              Summer<br />
              <span className="num text-ink-2">{dateForDay(1).getUTCFullYear()}</span>
            </span>
          </div>

          <h1
            id="crew-login-title"
            className="mt-8 font-display text-[clamp(2.75rem,11vw,3.6rem)] font-light leading-[0.92] text-ink"
          >
            Come <em className="text-glow">aboard</em>
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
            <span className="sm:hidden">
              Enter the ship&rsquo;s password to open the manifest and claim a berth.
            </span>
            <span className="hidden sm:inline">
              The crew manifest is kept below decks. Enter the ship&rsquo;s password to see who&rsquo;s
              sailing which leg&nbsp;&mdash; and to claim a berth of your own.
            </span>
          </p>

          {/* From → To */}
          <div className="mt-7 grid grid-cols-[auto_1fr_auto] items-end gap-3">
            <div>
              <p className="eyebrow !text-[9.5px]">From</p>
              <p className="mt-1.5 font-display text-2xl leading-none text-ink">{originCity}</p>
              <p className="eyebrow mt-1.5 !text-[9.5px] !tracking-[0.18em]">{originRegion}</p>
            </div>
            <div className="relative mb-[22px] flex h-3 items-center" aria-hidden>
              <span className="size-1.5 shrink-0 rounded-full bg-[var(--leg-1)]" />
              <span className={`h-full flex-1 ${styles.course}`} />
              <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-ink-2" fill="currentColor">
                <path d="M12.6 3v13.5H20zM11 6v10.5H5.2z" opacity="0.9" />
                <path d="M3 19c3-1.6 6 1.6 9 0s6-1.6 9 0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <span className={`h-full flex-1 ${styles.course}`} />
              <span className="size-1.5 shrink-0 rounded-full bg-[var(--leg-8)]" />
            </div>
            <div className="text-right">
              <p className="eyebrow !text-[9.5px]">To</p>
              <p className="mt-1.5 font-display text-2xl leading-none text-ink">{destCity}</p>
              <p className="eyebrow mt-1.5 !text-[9.5px] !tracking-[0.18em]">{destRegion}</p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
            {[
              ["Departs", departs],
              ["Passage", `${days} days`],
              ["Legs", `${legs}`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow !text-[9.5px]">{k}</dt>
                <dd className="num mt-1.5 text-[13px] text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Perforation */}
        <div className="relative h-0" aria-hidden>
          <div className="absolute inset-x-6 -top-px border-t border-dashed border-line-strong" />
        </div>

        {/* ── Stub: the gate ───────────────────────────────────────────── */}
        <section
          aria-label="Sign in"
          className={`glass-strong rounded-b-[28px] border-t-0 px-6 pb-7 pt-7 sm:px-8 ${styles.stubBottom}`}
        >
          <LoginForm from={from} initialError={initialError} />
          <p className="mt-6 text-center text-[13px] leading-relaxed text-ink-3">
            Shared with friends of the boat. Lost the password? Ask the skipper.
          </p>
        </section>

        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-[13px] text-ink-3 transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" strokeWidth={1.75} />
            Back to the voyage
          </Link>
        </div>
      </div>
    </div>
  );
}
