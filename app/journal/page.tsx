import type { Metadata } from "next";
import { Logbook } from "@/components/journal/Logbook";

export const metadata: Metadata = {
  title: "The Logbook — S/V Sabbatical",
  description:
    "A day-by-day journal of the 35-day passage from Chicago to Old Saybrook — each entry tied to its voyage day, leg and landfall.",
};

export default function JournalPage() {
  return <Logbook />;
}
