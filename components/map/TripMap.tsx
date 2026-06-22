"use client";
import { useMemo, useState } from "react";
import Map, { Marker, Popup, NavigationControl, Source, Layer } from "react-map-gl/mapbox";
import type { LayerProps } from "react-map-gl/mapbox";
import type { FeatureCollection, LineString } from "geojson";
import { waypoints } from "@/lib/data/waypoints";
import { routeSegments } from "@/lib/data/routePath";
import type { Waypoint } from "@/lib/types";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Single canonical voyage: Chicago → Old Saybrook, in day order.
const orderedWaypoints = [...waypoints].sort((a, b) => a.day - b.day);

// Build two GeoJSON line features: open-water legs and inland (canal/river) legs.
function buildRouteGeoJSON(): {
  openWater: FeatureCollection<LineString>;
  inland: FeatureCollection<LineString>;
} {
  const openWaterCoords: [number, number][][] = [];
  const inlandCoords: [number, number][][] = [];

  for (const seg of routeSegments) {
    if (seg.inland) {
      inlandCoords.push(seg.coords);
    } else {
      openWaterCoords.push(seg.coords);
    }
  }

  const toFC = (coordArrays: [number, number][][]): FeatureCollection<LineString> => ({
    type: "FeatureCollection",
    features: coordArrays.map(coords => ({
      type: "Feature",
      geometry: { type: "LineString", coordinates: coords },
      properties: {},
    })),
  });

  return { openWater: toFC(openWaterCoords), inland: toFC(inlandCoords) };
}

// Layer paint styles
const openWaterLayer: LayerProps = {
  id: "route-open-water",
  type: "line",
  paint: {
    "line-color": "#1a3a6b",   // deep navy — matches hsl(213,74%,28%)
    "line-width": 2.5,
    "line-opacity": 0.85,
    "line-dasharray": [6, 3],
  },
};

const inlandLayer: LayerProps = {
  id: "route-inland",
  type: "line",
  paint: {
    "line-color": "#8B5E3C",   // warm amber-brown for canal/river legs
    "line-width": 2,
    "line-opacity": 0.80,
    "line-dasharray": [4, 4],
  },
};

export default function TripMap() {
  const [popup, setPopup] = useState<Waypoint | null>(null);
  const { openWater, inland } = useMemo(buildRouteGeoJSON, []);

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
      <div
        className="absolute top-3 left-3 z-10 rounded-lg shadow-md px-3 py-1.5"
        style={{ background: "hsl(40, 60%, 96%)", border: "1px solid hsl(213, 74%, 28%, 0.25)" }}
      >
        <span className="text-sm font-medium" style={{ color: "hsl(213, 74%, 28%)" }}>
          ⛵ Chicago → Old Saybrook
        </span>
      </div>

      <Map
        mapboxAccessToken={TOKEN}
        initialViewState={{ longitude: -80, latitude: 42, zoom: 4.5 }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        onClick={() => setPopup(null)}
      >
        <NavigationControl position="top-right" />

        {/* Water-following route lines */}
        <Source id="route-open-water" type="geojson" data={openWater}>
          <Layer {...openWaterLayer} />
        </Source>
        <Source id="route-inland" type="geojson" data={inland}>
          <Layer {...inlandLayer} />
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

        {/* Popup — parchment-themed */}
        {popup && (
          <Popup
            longitude={popup.lng}
            latitude={popup.lat}
            anchor="bottom"
            onClose={() => setPopup(null)}
            closeButton={true}
            maxWidth="300px"
          >
            <div
              className="p-2 rounded"
              style={{
                background: "hsl(40, 60%, 96%)",
                color: "hsl(213, 74%, 20%)",
                fontFamily: "inherit",
              }}
            >
              <p className="font-semibold text-sm" style={{ color: "hsl(213, 74%, 22%)" }}>
                {popup.name}, {popup.state}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "hsl(213, 40%, 45%)" }}>
                Day {popup.day} · {popup.leg.replace(/-/g, " ")}
              </p>
              {popup.marina && (
                <p className="text-xs mt-1" style={{ color: "hsl(213, 50%, 35%)" }}>
                  ⚓ {popup.marina}
                </p>
              )}
              <div className="flex flex-wrap gap-1 mt-1">
                {popup.fuel && (
                  <span
                    className="inline-block text-xs px-1.5 py-0.5 rounded"
                    style={{ background: "hsl(38, 92%, 88%)", color: "hsl(38, 70%, 30%)" }}
                  >
                    ⛽ Fuel
                  </span>
                )}
                {popup.pumpout && (
                  <span
                    className="inline-block text-xs px-1.5 py-0.5 rounded"
                    style={{ background: "hsl(213, 60%, 88%)", color: "hsl(213, 70%, 30%)" }}
                  >
                    🚿 Pump-out
                  </span>
                )}
              </div>
              {popup.notes && (
                <p
                  className="text-xs mt-1.5 border-t pt-1.5"
                  style={{ color: "hsl(213, 35%, 40%)", borderColor: "hsl(213, 30%, 80%)" }}
                >
                  {popup.notes}
                </p>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
