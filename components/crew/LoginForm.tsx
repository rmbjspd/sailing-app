"use client";
import { useId, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAnimate, useReducedMotion } from "motion/react";
import { AlertTriangle, ArrowRight, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import styles from "./crew.module.css";

const noopSubscribe = () => () => {};

// Progressive enhancement: this is a real <form action method="POST"> so it
// works with JavaScript disabled (the handler 303-redirects). When JS is on we
// intercept, POST JSON, show inline errors + a loading state, and route on success.
export function LoginForm({ from, initialError }: { from: string; initialError: string | null }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(initialError);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [reveal, setReveal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [shakeScope, animate] = useAnimate<HTMLDivElement>();
  const errorId = useId();
  const inputId = useId();
  // The show/hide toggle needs JS; only render it once hydrated so the no-JS
  // form never shows a dead control.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  function fail(message: string) {
    setError(message);
    setBusy(false);
    if (!reduce && shakeScope.current) {
      animate(shakeScope.current, { x: [0, -9, 8, -5, 3, 0] }, { duration: 0.45, ease: "easeOut" });
    }
    requestAnimationFrame(() => inputRef.current?.select());
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/crew/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, from }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setDone(true);
        router.push(typeof data?.redirect === "string" ? data.redirect : from);
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      fail(data?.error ?? "Login failed.");
    } catch {
      fail("Network error — please try again.");
    }
  }

  return (
    <form action="/api/crew/login" method="POST" onSubmit={onSubmit}>
      <input type="hidden" name="from" value={from} />

      <label htmlFor={inputId} className="eyebrow mb-2.5 block !text-ink-2">
        Ship&rsquo;s password
      </label>
      <div ref={shakeScope} className="relative">
        <input
          ref={inputRef}
          style={{ outline: "none" }}
          id={inputId}
          name="password"
          type={reveal ? "text" : "password"}
          autoFocus
          required
          autoComplete="current-password"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Shared crew password"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`h-14 w-full rounded-2xl border pl-5 ${styles.well} text-[16px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-4 ${
            hydrated ? "pr-14" : "pr-5"
          } ${
            error
              ? "border-alert/70 focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--alert)_18%,transparent)]"
              : "border-line-strong focus:border-glow focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--glow)_20%,transparent)]"
          }`}
        />
        {hydrated && (
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            aria-label={reveal ? "Hide password" : "Show password"}
            aria-pressed={reveal}
            aria-controls={inputId}
            className="absolute right-1.5 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-xl text-ink-3 transition-colors hover:bg-tint/[0.06] hover:text-ink"
          >
            {reveal ? <EyeOff className="size-[18px]" strokeWidth={1.75} /> : <Eye className="size-[18px]" strokeWidth={1.75} />}
          </button>
        )}
      </div>

      {error && (
          <p
            id={errorId}
            role="alert"
            className={`mt-3 flex items-start gap-2.5 rounded-xl border border-alert/30 bg-alert/[0.08] px-3.5 py-2.5 text-[14px] leading-snug ${styles.alertText}`}
          >
            <AlertTriangle className="mt-px size-4 shrink-0 text-alert" strokeWidth={1.75} />
            {error}
          </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className={`group mt-5 flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-glow text-[15px] font-medium text-abyss transition-[transform,box-shadow,opacity] active:scale-[0.99] ${styles.cta} disabled:cursor-wait disabled:opacity-80`}
      >
        {done ? (
          <>
            <Check className="size-[18px]" strokeWidth={2} /> Welcome aboard
          </>
        ) : busy ? (
          <>
            <Loader2 className="size-[18px] animate-spin" strokeWidth={2} /> Checking your papers&hellip;
          </>
        ) : (
          <>
            Come aboard
            <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
          </>
        )}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {done ? "Signed in. Opening the crew manifest." : busy ? "Signing in…" : ""}
      </span>
    </form>
  );
}
