"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { project } from "@/lib/geo/projection";
import type { TerrainData } from "./terrain";
import { surfaceY } from "./route";

// Water-body names set flat on the water like an engraved chart: wide-tracked
// Fraunces italic, ghosted so they read as cartography, not UI.
const WATERS: { name: string; lng: number; lat: number; size: number; rot?: number }[] = [
  { name: "Lake Michigan", lng: -87.05, lat: 43.2, size: 0.17, rot: 1.45 },
  { name: "Lake Huron", lng: -82.35, lat: 44.55, size: 0.17, rot: 1.2 },
  { name: "Georgian Bay", lng: -80.75, lat: 45.15, size: 0.09, rot: 0.6 },
  { name: "North Channel", lng: -82.75, lat: 46.12, size: 0.065, rot: -0.12 },
  { name: "Lake Superior", lng: -86.2, lat: 47.25, size: 0.15 },
  { name: "Lake Erie", lng: -81.15, lat: 42.18, size: 0.13, rot: -0.45 },
  { name: "Lake Ontario", lng: -77.75, lat: 43.6, size: 0.12, rot: -0.1 },
  { name: "Atlantic Ocean", lng: -72.6, lat: 40.35, size: 0.14, rot: -0.15 },
  { name: "Long Island Sound", lng: -72.95, lat: 41.08, size: 0.045, rot: -0.2 },
];

const PLACES: { name: string; lng: number; lat: number }[] = [
  { name: "CHICAGO", lng: -87.62, lat: 41.88 },
  { name: "DETROIT", lng: -83.05, lat: 42.33 },
  { name: "BUFFALO", lng: -78.88, lat: 42.89 },
  { name: "ALBANY", lng: -73.76, lat: 42.65 },
  { name: "NEW YORK", lng: -74.0, lat: 40.71 },
  { name: "OLD SAYBROOK", lng: -72.38, lat: 41.29 },
  { name: "TORONTO", lng: -79.38, lat: 43.65 },
  { name: "MONTRÉAL", lng: -73.57, lat: 45.5 },
];

const _fwd = new THREE.Vector3();

export default function Labels({ terrain, opacity = 1, day = false }: { terrain: TerrainData; opacity?: number; day?: boolean }) {
  // Every label turns (about the vertical) to stay upright for the current
  // camera heading, so nothing reads upside-down when the boat sails south.
  const turners = useRef<(THREE.Group | null)[]>([]);
  const yaw = useRef<number | null>(null);
  useFrame(({ camera }, dt) => {
    camera.getWorldDirection(_fwd);
    if (Math.hypot(_fwd.x, _fwd.z) < 0.05) return;
    const target = Math.atan2(-_fwd.x, -_fwd.z);
    if (yaw.current == null) yaw.current = target;
    let d = target - yaw.current;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    yaw.current += d * (1 - Math.exp(-3 * Math.min(dt, 0.1)));
    for (const g of turners.current) if (g) g.rotation.y = yaw.current;
  });
  let n = 0;
  const reg = () => { const i = n++; return (g: THREE.Group | null) => { turners.current[i] = g; }; };
  return (
    <group>
      {WATERS.map((w) => {
        const [x, z] = project(w.lng, w.lat);
        const y = surfaceY(terrain, w.lng, w.lat) + 0.004;
        return (
          <group key={w.name} ref={reg()} position={[x, y, z]}>
          <Text
            font="/fonts/fraunces-light-italic.ttf"
            rotation={[-Math.PI / 2, 0, (w.rot ?? 0) * 0.5]}
            fontSize={w.size}
            letterSpacing={0.12}
            color={day ? "#2f5f80" : "#8fc3dc"}
            fillOpacity={(day ? 0.5 : 0.32) * opacity}
            anchorX="center"
            anchorY="middle"
            renderOrder={1}
          >
            {w.name}
          </Text>
          </group>
        );
      })}
      {PLACES.map((p) => {
        const [x, z] = project(p.lng, p.lat);
        const y = surfaceY(terrain, p.lng, p.lat) + 0.03;
        return (
          <group key={p.name} ref={reg()} position={[x, y, z]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.012, 16]} />
              <meshBasicMaterial color={day ? "#83581a" : "#f4b860"} transparent opacity={0.7 * opacity} toneMapped={false} />
            </mesh>
            <Text
              font="/fonts/geist-mono.ttf"
              position={[0.035, 0.002, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.045}
              letterSpacing={0.22}
              color={day ? "#5e3f12" : "#f4d7a6"}
              fillOpacity={(day ? 0.75 : 0.62) * opacity}
              anchorX="left"
              anchorY="middle"
            >
              {p.name}
            </Text>
          </group>
        );
      })}
    </group>
  );
}
