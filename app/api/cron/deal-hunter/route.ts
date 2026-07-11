import type { NextRequest } from "next/server";
import { runDealScan } from "@/lib/cron/dealHunter";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // requires Vercel Pro

export async function GET(request: NextRequest) {
  // Vercel injects Authorization: Bearer <CRON_SECRET> on scheduled calls.
  // Set CRON_SECRET in your Vercel environment variables.
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runDealScan();
    console.log("[deal-hunter]", result);
    return Response.json(result);
  } catch (err) {
    console.error("[deal-hunter] scan failed:", err);
    return Response.json({ error: "Scan failed" }, { status: 500 });
  }
}
