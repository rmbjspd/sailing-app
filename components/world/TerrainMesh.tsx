"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WORLD_W, WORLD_D, project } from "@/lib/geo/projection";
import type { TerrainData } from "./terrain";
import { M2Y, BG, BG_DAY } from "./constants";

// The night-chart terrain: one big displaced plane whose fragment shader does
// all the cartography — hillshade from the real DEM, 100 m / 500 m contours on
// land, 25 m / 100 m isobaths on the lake floors, an animated moonlit water
// surface, a glowing shoreline, a 1° graticule, and slow cloud shadows.

const vert = /* glsl */ `
  uniform sampler2D uElev;
  uniform sampler2D uWater;
  uniform sampler2D uLevel;
  uniform float uM2Y;
  uniform vec2 uCell;
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    // Box-filter the DEM to the mesh cell size: sampling a 2048px heightmap at
    // fewer vertices otherwise aliases into needle-like spikes.
    vec2 o = uCell * 0.5;
    float e = (texture2D(uElev, uv).r * 2.0
      + texture2D(uElev, uv + vec2(o.x, o.y)).r + texture2D(uElev, uv + vec2(-o.x, o.y)).r
      + texture2D(uElev, uv + vec2(o.x, -o.y)).r + texture2D(uElev, uv + vec2(-o.x, -o.y)).r) / 6.0;
    float w = texture2D(uWater, uv).r;
    float l = texture2D(uLevel, uv).r * 255.0;
    float s = smoothstep(0.35, 0.65, w);
    float landH = mix(e, max(e, l), smoothstep(0.02, 0.3, w));
    float h = mix(landH, l, s) * uM2Y;
    vec4 wp = modelMatrix * vec4(position.x, position.y + h, position.z, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const frag = /* glsl */ `
  precision highp float;
  uniform sampler2D uElev;
  uniform sampler2D uWater;
  uniform sampler2D uLevel;
  uniform vec2 uTexel;
  uniform vec2 uWorld;
  uniform float uM2Y;
  uniform float uTime;
  uniform float uReveal;
  uniform vec2 uRevealOrigin;
  uniform vec3 uLight;
  uniform float uDay;
  uniform vec3 uFogN, uFogD;
  uniform vec3 uLandLoN, uLandLoD, uLandHiN, uLandHiD, uContourN, uContourD;
  uniform vec3 uWaterShallowN, uWaterShallowD, uWaterDeepN, uWaterDeepD;
  uniform vec3 uShoreN, uShoreD, uGratN, uGratD;
  uniform float uFogDensity;
  varying vec2 vUv;
  varying vec3 vWorld;

  // Night: lines glow (additive). Day: lines are ink laid on the paper (mix).
  vec3 mark(vec3 col, vec3 c, float a) {
    return mix(col + c * a, mix(col, c, clamp(a * 2.2, 0.0, 1.0)), uDay);
  }

  float hLand(vec2 uv) {
    float e = texture2D(uElev, uv).r;
    float w = texture2D(uWater, uv).r;
    return mix(e, max(e, texture2D(uLevel, uv).r * 255.0), smoothstep(0.02, 0.3, w));
  }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
    return v;
  }
  // Anti-aliased iso-line at integer values of v; fades out where lines get too dense.
  float iso(float v, float width) {
    float fw = fwidth(v);
    float d = abs(fract(v - 0.5) - 0.5);
    return (1.0 - smoothstep(0.0, fw * width, d)) * (1.0 - smoothstep(0.12, 0.45, fw));
  }

  void main() {
    vec3 uFog = mix(uFogN, uFogD, uDay);
    vec3 uLandLo = mix(uLandLoN, uLandLoD, uDay);
    vec3 uLandHi = mix(uLandHiN, uLandHiD, uDay);
    vec3 uContour = mix(uContourN, uContourD, uDay);
    vec3 uWaterShallow = mix(uWaterShallowN, uWaterShallowD, uDay);
    vec3 uWaterDeep = mix(uWaterDeepN, uWaterDeepD, uDay);
    vec3 uShore = mix(uShoreN, uShoreD, uDay);
    vec3 uGrat = mix(uGratN, uGratD, uDay);
    vec2 uv = vUv;
    float e = texture2D(uElev, uv).r;
    float w = texture2D(uWater, uv).r;
    float lvl = texture2D(uLevel, uv).r * 255.0;
    vec3 V = normalize(cameraPosition - vWorld);

    // ── Land ────────────────────────────────────────────────────────────
    vec2 dx = vec2(uTexel.x, 0.0), dy = vec2(0.0, uTexel.y);
    float sx = (hLand(uv + dx) - hLand(uv - dx)) * uM2Y / (2.0 * uTexel.x * uWorld.x);
    float sz = (hLand(uv + dy) - hLand(uv - dy)) * uM2Y / (2.0 * uTexel.y * uWorld.y);
    vec3 n = normalize(vec3(-sx, 1.0, sz));
    float landH = mix(e, max(e, lvl), smoothstep(0.02, 0.3, w));
    float t = clamp((landH - 120.0) / 1300.0, 0.0, 1.0);
    vec3 land = mix(uLandLo, uLandHi, pow(t, 0.75));
    float diff = max(dot(n, uLight), 0.0);
    float rim = pow(1.0 - max(dot(n, V), 0.0), 3.0);
    land *= mix(0.22 + diff * 1.25, 0.74 + diff * 0.36, uDay);
    land = mark(land, uContour, (rim * 0.10 + (1.0 - n.y) * 0.35) * (1.0 - uDay * 0.6));
    land = mark(land, uContour, iso(landH / 100.0, 1.0) * 0.07 + iso(landH / 500.0, 1.5) * 0.20);

    // ── Water ───────────────────────────────────────────────────────────
    // The source DEM only carries real bathymetry offshore (the Great Lakes
    // are flat at their surface), so isobaths are drawn only where depth is known.
    float depth = clamp(lvl - e, 0.0, 420.0);
    float known = smoothstep(10.0, 22.0, depth);
    float dn = pow(smoothstep(0.0, 120.0, depth), 0.6);
    vec3 lake = mix(uWaterShallow, uWaterDeep, 0.55);
    vec3 water = mix(lake, mix(uWaterShallow, uWaterDeep, dn), known);
    water = mark(water, uShore, (iso(depth / 10.0, 1.0) * 0.05 + iso(depth / 50.0, 1.4) * 0.12) * known);
    // broad, slow swell + fine ripples, lit by the moon
    vec2 wp = vWorld.xz * 9.0;
    float n1 = fbm(wp + vec2(uTime * 0.10, uTime * 0.07));
    float n2 = fbm(wp * 2.3 - vec2(uTime * 0.08, -uTime * 0.05));
    vec3 wn = normalize(vec3((n1 - 0.5) * 0.08, 1.0, (n2 - 0.5) * 0.08));
    vec3 H = normalize(uLight + V);
    float spec = pow(max(dot(wn, H), 0.0), 70.0);
    float fres = pow(1.0 - max(V.y, 0.0), 4.0);
    water += (vec3(0.55, 0.78, 1.0) * spec * 0.12 + vec3(0.04, 0.13, 0.2) * fres) * (1.0 - uDay * 0.6);
    water *= 0.9 + 0.2 * n1;

    // ── Compose ─────────────────────────────────────────────────────────
    float s = smoothstep(0.42, 0.58, w);
    vec3 col = mix(land, water, s);
    float fw = max(fwidth(w), 1e-4);
    float shore = 1.0 - smoothstep(0.0, fw * 1.1, abs(w - 0.5));
    col = mark(col, uShore, shore * mix(0.75, 0.42, uDay));

    // 1° graticule — the chart table
    float lng = -89.0 + uv.x * 18.0;
    float lat = 40.0 + uv.y * 7.5;
    col = mark(col, uGrat, max(iso(lng, 1.0), iso(lat, 1.0)) * mix(0.05, 0.07, uDay));

    // Drifting cloud shadows
    float cl = fbm(vWorld.xz * 0.38 + vec2(uTime * 0.010, uTime * 0.004));
    col *= mix(1.0, mix(0.58, 0.86, uDay), smoothstep(0.48, 0.78, cl));

    // Intro reveal: a sonar sweep expanding from the origin (Chicago)
    float r = length(vWorld.xz - uRevealOrigin);
    float front = uReveal * 18.0;
    float revealed = smoothstep(front, front - 1.2, r);
    float ring = exp(-pow((r - front) * 5.0, 2.0)) * step(uReveal, 0.999);
    col = mix(uFog, col, revealed);
    col = mark(col, uShore, ring * 0.9);

    // Soft vignette at the plane edges, then distance fog
    float edge = smoothstep(0.0, 0.07, uv.x) * smoothstep(1.0, 0.93, uv.x)
               * smoothstep(0.0, 0.10, uv.y) * smoothstep(1.0, 0.90, uv.y);
    col = mix(uFog, col, edge);
    float dist = length(cameraPosition - vWorld);
    float fog = 1.0 - exp(-pow(dist * uFogDensity, 2.0));
    col = mix(col, uFog, fog);

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export default function TerrainMesh({
  terrain, segments = [768, 444], reveal, day = false,
}: {
  terrain: TerrainData;
  segments?: [number, number];
  /** day chart (khaki / powder blue); cross-fades when it changes */
  day?: boolean;
  /** 0..1 intro reveal, read every frame */
  reveal?: React.RefObject<number>;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(WORLD_W, WORLD_D, segments[0], segments[1]);
    g.rotateX(-Math.PI / 2);
    // Generous bounds: displacement happens on the GPU.
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), WORLD_W);
    return g;
  }, [segments]);

  const uniforms = useMemo(() => {
    const c = (hex: string) => new THREE.Color(hex);
    return {
      uElev: { value: terrain.elevTex },
      uWater: { value: terrain.waterTex },
      uLevel: { value: terrain.levelTex },
      uTexel: { value: new THREE.Vector2(1 / terrain.width, 1 / terrain.height) },
      uWorld: { value: new THREE.Vector2(WORLD_W, WORLD_D) },
      uM2Y: { value: M2Y },
      uCell: { value: new THREE.Vector2(1 / segments[0], 1 / segments[1]) },
      uTime: { value: 0 },
      uReveal: { value: reveal ? 0 : 1 },
      uRevealOrigin: { value: new THREE.Vector2(...project(-87.62, 41.88)) },
      uLight: { value: new THREE.Vector3(-0.55, 0.62, -0.56).normalize() },
      uDay: { value: day ? 1 : 0 },
      uFogN: { value: c(BG) }, uFogD: { value: c(BG_DAY) },
      uFogDensity: { value: 0.052 },
      uLandLoN: { value: c("#0b1322") }, uLandLoD: { value: c("#ece4cc") },
      uLandHiN: { value: c("#3b4459") }, uLandHiD: { value: c("#c9b68f") },
      uContourN: { value: c("#6fa6c8") }, uContourD: { value: c("#6e5a36") },
      uWaterShallowN: { value: c("#0d3550") }, uWaterShallowD: { value: c("#c3deee") },
      uWaterDeepN: { value: c("#020711") }, uWaterDeepD: { value: c("#6f9fc4") },
      uShoreN: { value: c("#5ef2d6") }, uShoreD: { value: c("#2f5f80") },
      uGratN: { value: c("#f4b860") }, uGratD: { value: c("#8a6a35") },
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terrain, reveal, segments]);

  useFrame((_, dt) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += Math.min(dt, 0.1);
    const u = mat.current.uniforms.uDay;
    u.value += ((day ? 1 : 0) - u.value) * (1 - Math.exp(-3 * Math.min(dt, 0.1)));
    if (reveal) mat.current.uniforms.uReveal.value = reveal.current ?? 1;
  });

  return (
    <mesh geometry={geometry} frustumCulled={false}>
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} extensions={{ derivatives: true } as never} />
    </mesh>
  );
}
