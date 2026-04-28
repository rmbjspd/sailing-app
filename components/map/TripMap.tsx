"use client";
import { useState } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/mapbox";
import { waypoints, ROUTE_LEGS, type RouteOption } from "@/lib/data/waypoints";
import type { Waypoint } from "@/lib/types";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;


export default function TripMap() {
  const [route, setRoute] = useState<RouteOption>("saybrook");
  const [popup, setPopup] = useState<Waypoint | null>(null);

  const visibleWaypoints = waypoints.filter(w => ROUTE_LEGS[route].includes(w.leg as any));

  return (
    <div className="relative w-full h-full">
      {/* Route toggle */}
      <div className="absolute top-3 left-3 z-10 bg-white rounded-lg shadow-md p-1 flex gap-1">
        {(["saybrook", "philly"] as RouteOption[]).map(opt => (
          <button
            key={opt}
            onClick={() => setRoute(opt)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              route === opt ? "bg-[hsl(213,74%,28%)] text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {opt === "saybrook" ? "⛵ Old Saybrook" : "🏛️ Philadelphia"}
          </button>
        ))}
      </div>

      <Map
        mapboxAccessToken={TOKEN}
        initialViewState={{ longitude: -80, latitude: 42, zoom: 4.5 }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        onClick={() => setPopup(null)}
      >
        <NavigationControl position="top-right" />

        {/* Waypoint markers */}
        {visibleWaypoints.map(wp => (
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
