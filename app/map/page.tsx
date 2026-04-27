"use client";
import dynamic from "next/dynamic";

const TripMap = dynamic(() => import("@/components/map/TripMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100">
      <p className="text-gray-500 text-sm">Loading map…</p>
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
