import { redirect } from "next/navigation";
import { hasValidSession } from "@/lib/crew/auth";
import { getRoster } from "@/lib/crew/roster";
import { CrewManifest } from "@/components/crew/CrewManifest";

export const dynamic = "force-dynamic";

export const metadata = { title: "Crew Manifest | S/V Sabbatical" };

export default async function CrewPage() {
  // Authoritative gate (proxy is only an optimistic presence check).
  if (!(await hasValidSession())) redirect("/crew/login?from=/crew");
  const legs = await getRoster();
  return <CrewManifest initialLegs={legs} />;
}
