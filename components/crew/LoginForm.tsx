"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Anchor, Loader2 } from "lucide-react";

// Progressive enhancement: this is a real <form action method="POST"> so it
// works with JavaScript disabled (the handler 303-redirects). When JS is on we
// intercept, POST JSON, show inline errors + a loading state, and route on success.
export function LoginForm({ from, initialError }: { from: string; initialError: string | null }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(initialError);
  const [busy, setBusy] = useState(false);

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
        router.push(typeof data?.redirect === "string" ? data.redirect : from);
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Login failed.");
      setBusy(false);
    } catch {
      setError("Network error — please try again.");
      setBusy(false);
    }
  }

  return (
    <form action="/api/crew/login" method="POST" onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" name="from" value={from} />
      <label className="block">
        <span className="block text-sm font-semibold mb-1.5" style={{ color: "hsl(var(--navy))" }}>
          Ship&rsquo;s password
        </span>
        <input
          name="password"
          type="password"
          autoFocus
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter the shared crew password"
          className="w-full min-h-[44px] rounded-md px-3 outline-none focus:ring-2"
          style={{
            border: "1.5px solid hsl(var(--border))",
            background: "hsl(var(--parchment))",
            color: "hsl(var(--card-foreground))",
          }}
        />
      </label>

      {error && (
        <p
          role="alert"
          className="text-sm rounded-md px-3 py-2"
          style={{ background: "hsl(0 60% 95%)", color: "hsl(0 65% 38%)", border: "1px solid hsl(0 55% 85%)" }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ background: "hsl(var(--teal))", color: "white", boxShadow: "0 2px 8px hsl(var(--teal) / 0.35)" }}
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Anchor className="w-4 h-4" />}
        {busy ? "Signing in…" : "Come aboard"}
      </button>
    </form>
  );
}
