import { redirect } from "next/navigation";
import { hasValidSession } from "@/lib/crew/auth";
import { LoginForm } from "@/components/crew/LoginForm";

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

  return (
    <div className="parchment-page min-h-[calc(100vh-4rem)] flex items-start justify-center">
      <div className="w-full max-w-md px-4 py-16">
        <div className="treasure-frame p-7">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">⚓</div>
            <h1
              className="font-[family-name:var(--font-pirata)] text-3xl"
              style={{ color: "hsl(var(--navy))" }}
            >
              Crew Manifest
            </h1>
            <p className="text-sm mt-1 italic" style={{ color: "hsl(var(--muted-foreground))" }}>
              Hands wishing to sign aboard — enter the ship&rsquo;s password.
            </p>
          </div>
          <LoginForm from={from} initialError={initialError} />
        </div>
      </div>
    </div>
  );
}
