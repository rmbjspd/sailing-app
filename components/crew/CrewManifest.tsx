"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "motion/react";
import { AlertTriangle, Loader2, LogOut, RefreshCw } from "lucide-react";
import { PageHero, Reveal } from "@/components/kit";
import type { RosterLeg } from "@/lib/crew/types";
import { VoyageStrip } from "./VoyageStrip";
import { LegPanel, type ActivePanel } from "./LegPanel";
import { numberWord } from "./crewFormat";
import styles from "./crew.module.css";

export function CrewManifest({ initialLegs }: { initialLegs: RosterLeg[] }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [legs, setLegs] = useState<RosterLeg[]>(initialLegs);
  const [loggingOut, setLoggingOut] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<ActivePanel>(null);
  const [joined, setJoined] = useState<{ id: string; name: string; legId: string } | null>(null);
  const joinTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (joinTimer.current) clearTimeout(joinTimer.current);
  }, []);

  const goLogin = useCallback(() => {
    router.push("/crew/login?from=/crew");
    router.refresh();
  }, [router]);

  // Refetch with a visible loading state and an error branch (CM-001): a failed
  // refresh must never leave the roster silently stale.
  const refetch = useCallback(async (): Promise<boolean> => {
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch("/api/crew/roster", { cache: "no-store" });
      if (res.status === 401) {
        goLogin();
        return false;
      }
      if (!res.ok) throw new Error("refresh failed");
      const data = await res.json();
      setLegs(data.legs as RosterLeg[]);
      return true;
    } catch {
      setError("Couldn’t refresh the roster — please reload the page.");
      return false;
    } finally {
      setRefreshing(false);
    }
  }, [goLogin]);

  const onJoined = useCallback((m: { id: string; name: string; legId: string }) => {
    setJoined(m);
    if (joinTimer.current) clearTimeout(joinTimer.current);
    joinTimer.current = setTimeout(() => setJoined(null), 6000);
  }, []);

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    await fetch("/api/crew/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).catch(() => {});
    router.push("/crew/login");
    router.refresh();
  }

  const jump = useCallback(
    (legId: string) => {
      const el = document.getElementById(`leg-${legId}`);
      if (!el) return;
      const lenis = window.__lenis;
      if (lenis && !reduce) lenis.scrollTo(el, { offset: -112, duration: 1.2 });
      else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      el.focus({ preventScroll: true });
    },
    [reduce],
  );

  const openLegs = legs.filter((l) => !l.closed);
  const berthsOpen = openLegs.reduce((s, l) => s + l.spotsRemaining, 0);
  const berthsTotal = openLegs.reduce((s, l) => s + l.capacity, 0);
  const legsWithRoom = openLegs.filter((l) => l.spotsRemaining > 0).length;
  const crewSigned = legs.reduce((s, l) => s + l.taken, 0);
  const capacity = legs[0]?.capacity ?? 3;

  const lede =
    openLegs.length === legs.length
      ? `All ${numberWord(legs.length)} legs are open to crew`
      : `${numberWord(openLegs.length, true)} of the ${numberWord(legs.length)} legs are open to crew`;

  return (
    <div className="pb-28 md:pb-24">
      <PageHero
        eyebrow="Crew Manifest · Summer 2027"
        title={
          <>
            The <em>Crew</em>
          </>
        }
        lede={
          <>
            {`${lede}, ${numberWord(capacity)} berths apiece. Choose your water, take a berth, and your name goes on the manifest — the plan on each leg shows who’s already aboard.`}
          </>
        }
        aside={
          <div className="glass w-full rounded-3xl p-6 lg:w-[360px]">
            <dl className="grid grid-cols-3 gap-4">
              <Stat label="Berths open" value={berthsOpen} of={berthsTotal} accent />
              <Stat label="Legs open" value={legsWithRoom} of={legs.length} />
              <Stat label="Crew signed" value={crewSigned} />
            </dl>
            <div className="hairline my-5" />
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-[12.5px] text-ink-3" role="status" aria-live="polite">
                {refreshing ? (
                  <>
                    <RefreshCw className="size-3.5 animate-spin text-glow" strokeWidth={1.75} />
                    Updating manifest…
                  </>
                ) : (
                  <>
                    <span className={`size-1.5 rounded-full bg-ok ${styles.glowDot}`} style={{ ["--c" as string]: "var(--ok)" }} aria-hidden />
                    Manifest up to date
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={logout}
                disabled={loggingOut}
                className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-line-strong px-4 text-[13px] text-ink-2 transition-colors hover:bg-tint/[0.05] hover:text-ink disabled:opacity-60"
              >
                {loggingOut ? (
                  <Loader2 className="size-4 animate-spin" strokeWidth={1.75} />
                ) : (
                  <LogOut className="size-4" strokeWidth={1.75} />
                )}
                {loggingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </div>
        }
      >
        <Reveal delay={0.24}>
          <VoyageStrip legs={legs} onJump={jump} />
        </Reveal>
      </PageHero>

      <section aria-labelledby="berth-plan-title" className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
        {error && (
          <div
            role="alert"
            className={`mb-6 flex flex-col gap-3 rounded-2xl border border-alert/30 bg-alert/[0.08] px-5 py-4 text-[14px] sm:flex-row sm:items-center sm:justify-between ${styles.alertText}`}
          >
            <span className="flex items-center gap-2.5">
              <AlertTriangle className="size-4 shrink-0 text-alert" strokeWidth={1.75} /> {error}
            </span>
            <button
              type="button"
              onClick={() => router.refresh()}
              className="min-h-[44px] shrink-0 self-start rounded-full border border-alert/40 px-5 font-medium text-ink transition-colors hover:bg-alert/10 sm:self-auto"
            >
              Reload
            </button>
          </div>
        )}

        <div className="mb-8 flex flex-col gap-2 md:mb-10 md:flex-row md:items-end md:justify-between">
          <h2 id="berth-plan-title" className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-light leading-none text-ink">
            Berth <em>plan</em>
          </h2>
          <p className="max-w-md text-[14px] leading-relaxed text-ink-3">
            Tap an open berth to sign aboard. Tap a shipmate to see how to reach them, or to withdraw.
          </p>
        </div>

        {/* Two independent columns (I–IV, V–VIII) so an expanded panel only
            pushes its own column; DOM order stays in voyage order for mobile
            and assistive tech. */}
        <div className="grid gap-5 md:gap-6 lg:grid-cols-2">
          {[legs.slice(0, Math.ceil(legs.length / 2)), legs.slice(Math.ceil(legs.length / 2))].map((col, c) => (
            <div key={c} className="flex flex-col gap-5 md:gap-6">
              {col.map((leg, i) => (
                <Reveal key={leg.legId} delay={(c * 0.06) + Math.min(i, 2) * 0.04} y={18}>
                  <LegPanel
                    leg={leg}
                    active={active}
                    setActive={setActive}
                    joinedId={joined?.legId === leg.legId ? joined.id : null}
                    onJoined={onJoined}
                    onChanged={refetch}
                    onUnauthorized={goLogin}
                  />
                </Reveal>
              ))}
            </div>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center text-[13px] leading-relaxed text-ink-3">
          Everyone signed in can see the full manifest, contact details included. To change a
          sign-up, withdraw it and sign aboard again.
        </p>
      </section>
    </div>
  );
}

function Stat({ label, value, of, accent }: { label: string; value: number; of?: number; accent?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="eyebrow !text-[9.5px] !tracking-[0.18em]">{label}</dt>
      <dd className="mt-2 flex items-baseline gap-1">
        <span className={`num text-[34px] font-light leading-none ${accent ? "text-glow" : "text-ink"}`}>{value}</span>
        {of !== undefined && <span className="num text-[12px] text-ink-3">/{of}</span>}
      </dd>
    </div>
  );
}
