import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/crew/auth";
import { getRoster } from "@/lib/crew/roster";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await hasValidSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ legs: await getRoster() });
}
