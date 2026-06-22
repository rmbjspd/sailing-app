"use client";
import dynamic from "next/dynamic";

const TripMap = dynamic(() => import("@/components/map/TripMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center parchment-page">
      <p className="text-[hsl(var(--navy))] text-sm">Loading map…</p>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)] w-full">
      <TripMap />
    </div>
  );
}
