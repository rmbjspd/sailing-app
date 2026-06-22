"use client";
import { useMemo, useState } from "react";
import Map, { Marker, Popup, NavigationControl, Source, Layer } from "react-map-gl/mapbox";
import type { Feature, LineString } from "geojson";
import { waypoints } from "@/lib/data/waypoints";
import type { Waypoint } from "@/lib/types";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Single canonical voyage: Chicago → Old Saybrook, in day order.
const orderedWaypoints = [...waypoints].sort((a, b) => a.day - b.day);

export default function TripMap() {
  const [popup, setPopup] = useState<Waypoint | null>(null);

  // Ordered voyage path connecting the stops in day order.
  const routeLine: Feature<LineString> = useMemo(
    () => ({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: orderedWaypoints.map(w => [w.lng, w.lat]) },
    }),
    [],
  );

  // Graceful fallback when the Mapbox token is missing (e.g. unset on a deploy)
  // — without it react-map-gl renders a blank/erroring canvas.
  if (!TOKEN) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 parchment-page">
        <div className="treasure-frame rounded-lg max-w-md text-center p-8 pt-9">
          <p className="text-5xl mb-3" aria-hidden="true">🧭</p>
          <p className="font-[family-name:var(--font-pirata)] text-2xl text-[hsl(var(--navy))] mb-2">
            Chart Unavailable
          </p>
          <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-4 italic">
            The navigation charts need a Mapbox token to render. Set{" "}
            <code className="not-italic font-[family-name:var(--font-typewriter)] text-xs bg-[hsl(var(--parchment-mid))] px-1 py-0.5 rounded">
              NEXT_PUBLIC_MAPBOX_TOKEN
            </code>{" "}
            and reload to bring the seas back.
          </p>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            The full route is still charted in the{" "}
            <a href="/itinerary" className="font-semibold underline" style={{ color: "hsl(var(--teal))" }}>
              Ship&rsquo;s Log
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Route label */}
      <div className="absolute top-3 left-3 z-10 bg-white rounded-lg shadow-md px-3 py-1.5">
        <span className="text-sm font-medium text-[hsl(213,74%,28%)]">⛵ Chicago → Old Saybrook</span>
      </div>

      <Map
        mapboxAccessToken={TOKEN}
        initialViewState={{ longitude: -80, latitude: 42, zoom: 4.5 }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        onClick={() => setPopup(null)}
      >
        <NavigationControl position="top-right" />

        {/* Ordered voyage route line */}
        <Source id="route" type="geojson" data={routeLine}>
          <Layer
            id="route-line"
            type="line"
            layout={{ "line-join": "round", "line-cap": "round" }}
            paint={{
              "line-color": "hsl(213, 74%, 28%)",
              "line-width": 2.5,
              "line-opacity": 0.65,
              "line-dasharray": [2, 1.5],
            }}
          />
        </Source>

        {/* Waypoint markers */}
        {orderedWaypoints.map(wp => (
          <Marker
            key={wp.id}
            longitude={wp.lng}
            latitude={wp.lat}
            anchor="center"
            onClick={e => { e.originalEvent.stopPropagation(); setPopup(wp); }}
          >
            <div
              className={`cursor-pointer transition-transform hover:scale-125 ${
                wp.isLayover ? "text-[hsl(38,92%,50%)]" : "text-[hsl(213,74%,28%)]"
              }`}
              title={wp.name}
            >
              <div className={`w-3 h-3 rounded-full border-2 border-white shadow-md ${
                wp.isLayover ? "bg-[hsl(38,92%,50%)]" : "bg-[hsl(213,74%,28%)]"
              }`} />
            </div>
          </Marker>
        ))}

        {/* Popup */}
        {popup && (
          <Popup
            longitude={popup.lng}
            latitude={popup.lat}
            anchor="bottom"
            onClose={() => setPopup(null)}
            closeButton={true}
            maxWidth="280px"
          >
            <div className="p-1">
              <p className="font-semibold text-sm">{popup.name}, {popup.state}</p>
              <p className="text-xs text-gray-500 mt-0.5">Day {popup.day} · {popup.leg.replace(/-/g, " ")}</p>
              {popup.marina && <p className="text-xs mt-1">⚓ {popup.marina}</p>}
              {popup.fuel && <span className="inline-block text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded mr-1 mt-1">⛽ Fuel</span>}
              {popup.pumpout && <span className="inline-block text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded mt-1">🚿 Pump-out</span>}
              {popup.notes && <p className="text-xs text-gray-600 mt-1.5 border-t pt-1.5">{popup.notes}</p>}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
