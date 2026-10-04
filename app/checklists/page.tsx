import type { Metadata } from "next";
import { ProvisioningBoard } from "@/components/provisioning/ProvisioningBoard";

export const metadata: Metadata = {
  title: "Provisioning — S/V Sabbatical",
  description:
    "Every item that needs to be aboard before departure from Chicago: safety gear, navigation, spares, tender, medical, galley and rigging — with live readiness tracking.",
};

export default function ChecklistsPage() {
  return <ProvisioningBoard />;
}
