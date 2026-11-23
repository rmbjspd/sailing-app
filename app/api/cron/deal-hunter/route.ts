import type { NextRequest } from "next/server";
import { runDealScan } from "@/lib/cron/dealHunter";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // requires Vercel Pro

export async function GET(request: NextRequest) {
  // The GitHub Actions scheduler sends Authorization: Bearer <CRON_SECRET>.
  // Set the same CRON_SECRET in Vercel env vars and in the repo's Actions
  // secrets.
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // Without this check an unset secret made the expected header the literal
    // "Bearer undefined" — guessable, and indistinguishable from a mismatch.
    return Response.json(
      { error: "CRON_SECRET is not set in this deployment's environment variables" },
      { status: 503 }
    );
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runDealScan();
    console.log("[deal-hunter]", result);
    return Response.json(result);
  } catch (err) {
    console.error("[deal-hunter] scan failed:", err);
    // The route is behind CRON_SECRET, so returning the reason is safe, and it
    // puts e.g. a missing database column straight into the workflow log.
    const detail = err instanceof Error ? err.message : String(err);
    return Response.json({ error: "Scan failed", detail }, { status: 500 });
  }
}
