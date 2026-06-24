"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Anchor,
  Lock,
  Loader2,
  ChevronDown,
  X,
  UserPlus,
  LogOut,
  Users,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FIELD_LIMITS, type RosterLeg, type RosterMember } from "@/lib/crew/types";

export function CrewManifest({ initialLegs }: { initialLegs: RosterLeg[] }) {
  const router = useRouter();
  const [legs, setLegs] = useState<RosterLeg[]>(initialLegs);
  const [loggingOut, setLoggingOut] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goLogin = useCallback(() => {
    router.push("/crew/login?from=/crew");
    router.refresh();
  }, [router]);

  // Refetch with a visible loading state and an error branch (CM-001): a failed
  // refresh must never leave the roster silently stale.
  const refetch = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch("/api/crew/roster", { cache: "no-store" });
      if (res.status === 401) {
        goLogin();
        return;
      }
      if (!res.ok) throw new Error("refresh failed");
      const data = await res.json();
      setLegs(data.legs as RosterLeg[]);
    } catch {
      setError("Couldn’t refresh the roster — please reload the page.");
    } finally {
      setRefreshing(false);
    }
  }, [goLogin]);

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

  const openLegs = legs.filter((l) => !l.closed);
  const totalOpen = openLegs.reduce((s, l) => s + l.spotsRemaining, 0);

  return (
    <div className="parchment-page min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h1
              className="font-[family-name:var(--font-pirata)] text-4xl"
              style={{ color: "hsl(var(--navy))" }}
            >
              Crew Manifest
            </h1>
            <p className="text-sm mt-1 italic" style={{ color: "hsl(var(--muted-foreground))" }}>
              Sign aboard for the legs you&rsquo;d like to crew. Each leg takes up to{" "}
              {legs[0]?.capacity ?? 3} hands.
            </p>
          </div>
          <button
            onClick={logout}
            disabled={loggingOut}
            aria-label="Sign out"
            className="flex items-center gap-1.5 px-3 min-h-[44px] rounded-md text-sm font-medium shrink-0 transition-colors hover:bg-black/[0.04] disabled:opacity-60"
            style={{ color: "hsl(var(--muted-foreground))", border: "1px solid hsl(var(--border))" }}
          >
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>

        <div
          className="flex items-center gap-2 text-xs mb-7"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          <Users className="w-3.5 h-3.5" />
          {totalOpen} berth{totalOpen === 1 ? "" : "s"} open across {openLegs.length} legs
          {refreshing && (
            <span className="flex items-center gap-1" role="status" aria-live="polite">
              <RefreshCw className="w-3 h-3 animate-spin" /> Updating…
            </span>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-center justify-between gap-3 rounded-md px-3 py-2.5 mb-5 text-sm"
            style={{ background: "hsl(0 60% 95%)", color: "hsl(0 65% 38%)", border: "1px solid hsl(0 55% 85%)" }}
          >
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </span>
            <button
              onClick={() => router.refresh()}
              className="font-semibold underline shrink-0 min-h-[36px] px-2"
            >
              Reload
            </button>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {legs.map((leg) => (
            <LegCard key={leg.legId} leg={leg} onChanged={refetch} onUnauthorized={goLogin} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LegCard({
  leg,
  onChanged,
  onUnauthorized,
}: {
  leg: RosterLeg;
  onChanged: () => Promise<void>;
  onUnauthorized: () => void;
}) {
  const full = !leg.closed && leg.spotsRemaining === 0;

  return (
    <Card className="overflow-hidden shadow-sm flex flex-col">
      <div className="h-1.5" style={{ background: leg.accent }} />
      <CardContent className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-semibold text-base" style={{ color: "hsl(var(--navy))" }}>
              {leg.title}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
              Day{leg.dayRange.includes("–") ? "s" : ""} {leg.dayRange} · {leg.dateRange}
            </p>
          </div>
          <BerthBadge leg={leg} full={full} />
        </div>

        {leg.closed ? (
          <ClosedNotice />
        ) : (
          <>
            <Roster
              members={leg.members}
              legTitle={leg.title}
              onChanged={onChanged}
              onUnauthorized={onUnauthorized}
            />
            <SignAboard
              leg={leg}
              full={full}
              onChanged={onChanged}
              onUnauthorized={onUnauthorized}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function BerthBadge({ leg, full }: { leg: RosterLeg; full: boolean }) {
  if (leg.closed) {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shrink-0"
        style={{ background: "hsl(42 50% 90%)", color: "hsl(36 45% 32%)" }}
      >
        <Lock className="w-3 h-3" /> Reserved
      </span>
    );
  }
  if (full) {
    return (
      <span
        className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold shrink-0"
        style={{ background: "hsl(0 50% 93%)", color: "hsl(0 55% 38%)" }}
      >
        Full crew
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold shrink-0"
      style={{ background: "hsl(165 45% 90%)", color: "hsl(165 55% 26%)" }}
    >
      {leg.spotsRemaining} of {leg.capacity} berth{leg.spotsRemaining === 1 ? "" : "s"} open
    </span>
  );
}

function ClosedNotice() {
  return (
    <div
      className="flex items-center gap-2 rounded-md px-3 py-3 text-sm italic"
      style={{ background: "hsl(42 40% 94%)", color: "hsl(36 35% 38%)" }}
    >
      <Lock className="w-4 h-4 shrink-0" />
      Reserved — not open for crew sign-up.
    </div>
  );
}

function Roster({
  members,
  legTitle,
  onChanged,
  onUnauthorized,
}: {
  members: RosterMember[];
  legTitle: string;
  onChanged: () => Promise<void>;
  onUnauthorized: () => void;
}) {
  if (members.length === 0) {
    return (
      <p className="text-xs italic" style={{ color: "hsl(var(--muted-foreground))" }}>
        No crew signed on yet — be the first.
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-1.5">
      {members.map((m) => (
        <MemberRow
          key={m.id}
          member={m}
          legTitle={legTitle}
          onChanged={onChanged}
          onUnauthorized={onUnauthorized}
        />
      ))}
    </ul>
  );
}

function MemberRow({
  member,
  legTitle,
  onChanged,
  onUnauthorized,
}: {
  member: RosterMember;
  legTitle: string;
  onChanged: () => Promise<void>;
  onUnauthorized: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState(false);

  async function withdraw() {
    if (busy) return;
    if (!window.confirm(`Withdraw ${member.name} from ${legTitle}?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/crew/signup/${member.id}`, { method: "DELETE" });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        await onChanged();
        return;
      }
      setBusy(false);
    } catch {
      setBusy(false);
    }
  }

  return (
    <li
      className="rounded-md"
      style={{ background: "hsl(var(--page-bg))", border: "1px solid hsl(var(--border))" }}
    >
      <div className="flex items-center gap-1">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="group flex items-center gap-1.5 flex-1 text-left px-3 min-h-[44px] rounded-md transition-colors hover:bg-black/[0.03]"
          aria-expanded={expanded}
          aria-label={
            expanded
              ? `Hide contact details for ${member.name}`
              : `Show contact details for ${member.name}`
          }
        >
          <ChevronDown
            className="w-4 h-4 shrink-0 transition-transform"
            style={{
              transform: expanded ? "rotate(180deg)" : "none",
              color: "hsl(var(--teal))",
            }}
          />
          <span
            className="text-sm font-medium group-hover:underline decoration-dotted underline-offset-2"
            style={{ color: "hsl(var(--card-foreground))" }}
          >
            {member.name}
          </span>
          {!expanded && (
            <span className="text-[0.65rem] ml-1" style={{ color: "hsl(var(--muted-foreground))" }}>
              contact
            </span>
          )}
        </button>
        <button
          onClick={withdraw}
          disabled={busy}
          title={`Withdraw ${member.name}`}
          aria-label={`Withdraw ${member.name} from ${legTitle}`}
          className="flex items-center justify-center w-11 h-11 shrink-0 rounded-md transition-colors hover:bg-[hsl(0_55%_93%)] disabled:opacity-50"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
        </button>
      </div>
      {expanded && (
        <div className="px-3 pb-2.5 pl-8 text-xs space-y-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
          <p>📨 {member.contact}</p>
          {member.note && <p className="italic">“{member.note}”</p>}
        </div>
      )}
    </li>
  );
}

function SignAboard({
  leg,
  full,
  onChanged,
  onUnauthorized,
}: {
  leg: RosterLeg;
  full: boolean;
  onChanged: () => Promise<void>;
  onUnauthorized: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (full) {
    return (
      <p className="text-xs italic mt-auto pt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
        This leg&rsquo;s crew is full.
      </p>
    );
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/crew/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ legId: leg.legId, name, contact, note }),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.status === 201) {
        setName("");
        setContact("");
        setNote("");
        setOpen(false);
        await onChanged();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "Could not sign up. Please try again.");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-auto flex items-center justify-center gap-1.5 min-h-[44px] rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
        style={{ background: "hsl(var(--teal))", color: "white" }}
      >
        <UserPlus className="w-4 h-4" /> Sign aboard
      </button>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "44px",
    border: "1.5px solid hsl(var(--border))",
    borderRadius: "6px",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    background: "hsl(var(--parchment))",
    color: "hsl(var(--card-foreground))",
    outline: "none",
  };

  return (
    <form onSubmit={submit} className="mt-auto flex flex-col gap-2 pt-1" aria-label={`Sign aboard for ${leg.title}`}>
      <input
        style={inputStyle}
        placeholder="Your name"
        aria-label="Your name"
        value={name}
        maxLength={FIELD_LIMITS.name}
        onChange={(e) => setName(e.target.value)}
        required
        autoFocus
      />
      <input
        style={inputStyle}
        placeholder="Email or phone"
        aria-label="Email or phone"
        value={contact}
        maxLength={FIELD_LIMITS.contact}
        onChange={(e) => setContact(e.target.value)}
        required
      />
      <textarea
        style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }}
        placeholder="Note (optional) — experience, dates, dietary…"
        aria-label="Note (optional)"
        value={note}
        maxLength={FIELD_LIMITS.note}
        onChange={(e) => setNote(e.target.value)}
      />
      {error && (
        <p
          role="alert"
          className="text-xs rounded-md px-2.5 py-1.5"
          style={{ background: "hsl(0 60% 95%)", color: "hsl(0 65% 38%)" }}
        >
          {error}
        </p>
      )}
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          className="px-3 min-h-[44px] rounded-md text-sm font-medium transition-colors hover:bg-black/[0.04]"
          style={{ color: "hsl(var(--muted-foreground))", border: "1px solid hsl(var(--border))" }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={busy}
          className="flex items-center gap-1.5 px-4 min-h-[44px] rounded-md text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: "hsl(var(--teal))", color: "white" }}
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Anchor className="w-4 h-4" />}
          {busy ? "Signing…" : "Confirm"}
        </button>
      </div>
    </form>
  );
}
