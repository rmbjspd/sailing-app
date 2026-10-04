"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { legStyle } from "@/lib/data/legStyle";
import type { RouteModel } from "./route";

// Overnight stops as light beacons: a thin vertical beam fading upward plus a
// ripple ring on the water. Stops already reached glow in their leg colour;
// the one the boat is at (or heading to) pulses.
const beamVert = /* glsl */ `
  varying float vY;
  void main() { vY = uv.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const beamFrag = /* glsl */ `
  uniform vec3 uColor; uniform float uIntensity; uniform float uDay;
  varying float vY;
  void main() {
    float a = pow(1.0 - vY, 2.2) * uIntensity * mix(1.0, 0.85, uDay);
    gl_FragColor = vec4(uColor * mix(0.6 + uIntensity * 1.6, 1.0, uDay), a);
    #include <colorspace_fragment>
  }
`;
const ringVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const ringFrag = /* glsl */ `
  uniform vec3 uColor; uniform float uTime; uniform float uIntensity; uniform float uActive; uniform float uDay;
  varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 2.0;
    float core = smoothstep(0.22, 0.12, r);
    float ring = 0.0;
    for (int i = 0; i < 2; i++) {
      float ph = fract(uTime * 0.45 + float(i) * 0.5);
      ring += exp(-pow((r - ph) * 18.0, 2.0)) * (1.0 - ph);
    }
    float a = core * (0.5 + uIntensity) + ring * uActive * 0.9;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor * mix(1.0 + core * 2.0 * uIntensity, 1.0, uDay), min(a, 1.0));
    #include <colorspace_fragment>
  }
`;

function Beacon({
  stop, index, activeIndex, size, onSelect, day,
}: {
  stop: RouteModel["stops"][number];
  index: number;
  activeIndex: React.RefObject<number>;
  size: number;
  onSelect?: (id: string) => void;
  day: boolean;
}) {
  const beam = useRef<THREE.ShaderMaterial>(null);
  const ring = useRef<THREE.ShaderMaterial>(null);
  // Night: additive light beams. Day: ink-coloured markers with normal blending
  // (additive light vanishes on paper).
  const color = useMemo(() => new THREE.Color(day ? legStyle(stop.leg).hexDay : legStyle(stop.leg).hex), [stop.leg, day]);
  const blending = day ? THREE.NormalBlending : THREE.AdditiveBlending;
  const beamU = useMemo(() => ({ uColor: { value: color }, uIntensity: { value: 0.2 }, uDay: { value: day ? 1 : 0 } }), [color, day]);
  const ringU = useMemo(() => ({ uColor: { value: color }, uTime: { value: index * 0.37 }, uIntensity: { value: 0.2 }, uActive: { value: 0 }, uDay: { value: day ? 1 : 0 } }), [color, index, day]);
  const terminal = stop.day === 0 || index === -1;
  useFrame((_, dt) => {
    const a = activeIndex.current ?? -1;
    const visited = index <= a;
    const isActive = index === a || index === a + 1;
    const target = isActive ? 1 : visited ? 0.55 : 0.12;
    if (beam.current) {
      const u = beam.current.uniforms.uIntensity;
      u.value += (target - u.value) * Math.min(1, dt * 4);
    }
    if (ring.current) {
      ring.current.uniforms.uTime.value += dt;
      const u = ring.current.uniforms.uIntensity;
      u.value += (target - u.value) * Math.min(1, dt * 4);
      const ua = ring.current.uniforms.uActive;
      ua.value += ((index === a ? 1 : 0) - ua.value) * Math.min(1, dt * 4);
    }
  });
  const h = (terminal ? 0.42 : 0.26) * size;
  return (
    <group position={stop.pos}>
      <mesh position={[0, h / 2, 0]} renderOrder={3}>
        <cylinderGeometry args={[0.0035 * size, 0.0035 * size, h, 8, 1, true]} />
        <shaderMaterial ref={beam} vertexShader={beamVert} fragmentShader={beamFrag} uniforms={beamU} transparent depthWrite={false} blending={blending} key={day ? "d" : "n"} />
      </mesh>
      {onSelect && (
        <mesh
          position={[0, h / 2, 0]}
          onClick={(e) => { e.stopPropagation(); onSelect(stop.id); }}
          onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { document.body.style.cursor = ""; }}
        >
          <cylinderGeometry args={[0.035 * size, 0.035 * size, h, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} renderOrder={3}>
        <planeGeometry args={[0.14 * size, 0.14 * size]} />
        <shaderMaterial ref={ring} vertexShader={ringVert} fragmentShader={ringFrag} uniforms={ringU} transparent depthWrite={false} blending={blending} key={day ? "d" : "n"} />
      </mesh>
    </group>
  );
}

export default function Beacons({ route, activeIndex, size = 1, onSelect, day = false }: { route: RouteModel; activeIndex: React.RefObject<number>; size?: number; onSelect?: (id: string) => void; day?: boolean }) {
  return (
    <group>
      {route.stops.map((s, i) => (
        <Beacon key={s.id} stop={s} index={i} activeIndex={activeIndex} size={size} onSelect={onSelect} day={day} />
      ))}
    </group>
  );
}
