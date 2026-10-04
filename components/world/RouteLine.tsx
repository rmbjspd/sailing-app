"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { RouteModel } from "./route";

// The voyage line: a slim tube coloured by leg. Sailed water burns bright (HDR,
// so bloom catches it) with a slow pulse running east; water still ahead is a
// faint dashed chart line. A white-hot head marks the boat.
const vert = /* glsl */ `
  uniform float uRadius;
  uniform float uProgress;
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    // Rebuild the tube around its centreline with a radius that grows with
    // camera distance, so the line keeps a near-constant on-screen weight from
    // the chase cam to the full overview.
    vec3 centre = position - normal * uRadius;
    float d = distance((modelMatrix * vec4(centre, 1.0)).xyz, cameraPosition);
    float ahead = step(uProgress, uv.x);
    vec3 p = centre + normal * uRadius * clamp(d * 0.55, 0.35, 4.0) * mix(1.0, 0.55, ahead);
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const frag = /* glsl */ `
  uniform sampler2D uLegCol;
  uniform float uProgress;
  uniform float uTime;
  uniform float uAhead;
  uniform float uGlow;
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    float f = vUv.x;
    vec3 c = texture2D(uLegCol, vec2(f, 0.5)).rgb;
    float done = step(f, uProgress);
    float head = exp(-abs(f - uProgress) * 1600.0);
    float pulse = exp(-pow((fract(f * 5.0 - uTime * 0.12) - 0.5) * 16.0, 2.0)) * done;
    vec3 col = c * (done * (uGlow + pulse * 1.6) + (1.0 - done) * 0.9) + vec3(1.0, 0.97, 0.9) * head * 1.6;
    float dash = step(0.5, fract(f * 900.0));
    float alpha = max(done, (1.0 - done) * dash * uAhead);
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
  }
`;

export default function RouteLine({
  route, progress, radius = 0.005, ahead = 0.9, glow = 2.2,
}: {
  route: RouteModel;
  /** route fraction 0..1, read every frame */
  progress: React.RefObject<number>;
  radius?: number;
  ahead?: number;
  glow?: number;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => new THREE.TubeGeometry(route.curve, 3000, radius, 6, false), [route, radius]);
  const uniforms = useMemo(() => ({
    uLegCol: { value: route.legColorTex },
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uAhead: { value: ahead },
    uGlow: { value: glow },
    uRadius: { value: radius },
  }), [route, ahead, glow, radius]);
  useFrame((_, dt) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += Math.min(dt, 0.1);
    mat.current.uniforms.uProgress.value = progress.current ?? 0;
  });
  return (
    <mesh geometry={geometry} renderOrder={2}>
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent depthWrite={false} />
    </mesh>
  );
}
