"use client";
// Unlinked diagnostic: renders each piece of the 3D voyage world on its own in a
// small canvas and reports whether it produced pixels, so a GPU-specific black
// screen can be bisected from one page load. Visit /gpu-test and screenshot it.
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { loadTerrain, type TerrainData } from "@/components/world/terrain";
import { buildRoute, type RouteModel } from "@/components/world/route";
import TerrainMesh from "@/components/world/TerrainMesh";
import RouteLine from "@/components/world/RouteLine";
import Beacons from "@/components/world/Beacons";

type Result = { name: string; status: string; detail: string };
type Ctx = { terrain: TerrainData; route: RouteModel };

const flatVert = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const mkPlane = (frag: string, vert = flatVert, uniforms: Record<string, THREE.IUniform> = {}) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[6, 4, 8, 8]} />
    <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />
  </mesh>
);

const TESTS: { name: string; note: string; scene: (c: Ctx) => React.ReactNode }[] = [
  { name: "A clear colour only", note: "expects flat cream", scene: () => null },
  { name: "B flat shader", note: "expects flat red", scene: () => mkPlane(`void main(){ gl_FragColor = vec4(1.0,0.1,0.1,1.0); }`) },
  {
    name: "C fragment samples R8 texture",
    note: "water mask, expects shades",
    scene: ({ terrain }) =>
      mkPlane(`uniform sampler2D t; varying vec2 vUv; void main(){ gl_FragColor = vec4(vec3(texture2D(t, vUv).r),1.0); }`, flatVert, { t: { value: terrain.waterTex } }),
  },
  {
    name: "D fragment samples half-float texture",
    note: "elevation, expects shades",
    scene: ({ terrain }) =>
      mkPlane(`uniform sampler2D t; varying vec2 vUv; void main(){ gl_FragColor = vec4(vec3(texture2D(t, vUv).r / 600.0),1.0); }`, flatVert, { t: { value: terrain.elevTex } }),
  },
  {
    name: "E vertex samples half-float texture",
    note: "expects flat green",
    scene: ({ terrain }) =>
      mkPlane(
        `void main(){ gl_FragColor = vec4(0.1,0.8,0.2,1.0); }`,
        `uniform sampler2D t; void main(){ vec3 p = position; p.z += texture2D(t, uv).r * 0.00001; gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0); }`,
        { t: { value: terrain.elevTex } },
      ),
  },
  {
    name: "F fragment NaN check (pow of negative)",
    note: "expects flat blue; black = pow(neg) gives NaN",
    scene: () => mkPlane(`varying vec2 vUv; void main(){ float x = vUv.x - 0.5; float p = pow(x, 2.0); gl_FragColor = vec4(0.2, 0.4, isnan(p) ? 0.0 : 1.0, 1.0); }`),
  },
  {
    name: "G fragment smoothstep reversed edges",
    note: "expects gradient",
    scene: () => mkPlane(`varying vec2 vUv; void main(){ float s = smoothstep(0.8, 0.2, vUv.x); gl_FragColor = vec4(s, 0.3, 0.3, 1.0); }`),
  },
  {
    name: "H fragment fwidth iso lines",
    note: "expects stripes",
    scene: () =>
      mkPlane(`varying vec2 vUv; float iso(float v, float w){ float fw = fwidth(v); float d = abs(fract(v-0.5)-0.5); return 1.0 - smoothstep(0.0, fw*w, d); }
      void main(){ float a = iso(vUv.x*10.0, 1.0); float b = iso(5.0, 1.0); gl_FragColor = vec4(a, b, 0.3, 1.0); }`),
  },
  { name: "I TerrainMesh (small mesh)", note: "full terrain shader, 96x56", scene: ({ terrain }) => <TerrainMesh terrain={terrain} segments={[96, 56]} day /> },
  { name: "J TerrainMesh (production mesh)", note: "full terrain shader, 900x520", scene: ({ terrain }) => <TerrainMesh terrain={terrain} segments={[900, 520]} day /> },
  { name: "K RouteLine", note: "route tube over background", scene: ({ route }) => <RouteLineProbe route={route} /> },
  { name: "L Beacons", note: "waypoint beacons over background", scene: ({ route }) => <BeaconsProbe route={route} /> },
];

function RouteLineProbe({ route }: { route: RouteModel }) {
  const progress = useRef(1);
  return <RouteLine route={route} progress={progress} day />;
}
function BeaconsProbe({ route }: { route: RouteModel }) {
  const active = useRef(3);
  return <Beacons route={route} activeIndex={active} day />;
}

function Probe({ onDone }: { onDone: (status: string, detail: string) => void }) {
  const n = useRef(0);
  const done = useRef(false);
  // A positive-priority subscriber switches off R3F's automatic render, so render by hand.
  useFrame(({ gl, scene, camera }) => {
    if (done.current) return;
    gl.render(scene, camera);
    n.current += 1;
    if (n.current < 30) return;
    done.current = true;
    const ctx = gl.getContext();
    const w = ctx.drawingBufferWidth, h = ctx.drawingBufferHeight;
    const px = new Uint8Array(4);
    const seen = new Set<string>();
    let nonCream = 0, black = 0;
    for (let i = 1; i <= 8; i++) for (let j = 1; j <= 8; j++) {
      ctx.readPixels(Math.floor((w * i) / 9), Math.floor((h * j) / 9), 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, px);
      seen.add(`${px[0] >> 3},${px[1] >> 3},${px[2] >> 3}`);
      if (Math.abs(px[0] - 0xef) > 12 || Math.abs(px[1] - 0xe8) > 12 || Math.abs(px[2] - 0xd6) > 12) nonCream++;
      if (px[0] + px[1] + px[2] < 24) black++;
    }
    const err = ctx.getError();
    const bg = scene.background instanceof THREE.Color ? `#${scene.background.getHexString()}` : "none";
    onDone(
      black > 56 ? "BLACK" : seen.size <= 1 ? "UNIFORM" : "OK",
      `${seen.size} distinct colours, ${nonCream}/64 not cream, ${black}/64 black, GL error ${err}, bg ${bg}`,
    );
  }, 2);
  return null;
}

function Stage({ ctx, index, onResult }: { ctx: Ctx; index: number; onResult: (r: Result) => void }) {
  const t = TESTS[index];
  return (
    <Canvas
      key={index}
      style={{ width: 320, height: 180, border: "1px solid #888" }}
      dpr={1}
      gl={{ antialias: false, powerPreference: "high-performance", toneMapping: THREE.NoToneMapping, stencil: false }}
      camera={{ fov: 34, near: 0.01, far: 60, position: [1.2, 8.2, 6.6] }}
      onCreated={({ scene, camera }) => {
        scene.background = new THREE.Color("#efe8d6");
        camera.lookAt(0, 0, 0);
      }}
    >
      <Suspense fallback={null}>{t.scene(ctx)}</Suspense>
      <Probe onDone={(status, detail) => onResult({ name: t.name, status, detail })} />
    </Canvas>
  );
}

export default function GpuTestPage() {
  const [ctx, setCtx] = useState<Ctx | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [index, setIndex] = useState(0);
  const [info, setInfo] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const orig = console.error;
    console.error = (...a: unknown[]) => { const m = a.map(String).join(" ").slice(0, 300); setTimeout(() => setErrors((x) => [...x, m]), 0); orig(...a); };
    try {
      const c = document.createElement("canvas");
      /* eslint-disable react-hooks/set-state-in-effect */
      const gl = c.getContext("webgl2");
      if (!gl) setInfo("no webgl2");
      else {
        const dbg = gl.getExtension("WEBGL_debug_renderer_info");
        setInfo([
          `renderer: ${dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)}`,
          `max texture ${gl.getParameter(gl.MAX_TEXTURE_SIZE)}, vertex texture units ${gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)}, max samples ${gl.getParameter(gl.MAX_SAMPLES)}`,
          `color_buffer_float ${!!gl.getExtension("EXT_color_buffer_float")}, float_linear ${!!gl.getExtension("OES_texture_float_linear")}`,
        ].join("\n"));
      }
      /* eslint-enable react-hooks/set-state-in-effect */
    } catch (e) { setInfo(String(e)); }
    loadTerrain(false).then((terrain) => setCtx({ terrain, route: buildRoute(terrain) })).catch((e) => setErr(String(e)));
    return () => { console.error = orig; };
  }, []);

  const report = useMemo(
    () => results.map((r) => `${r.status.padEnd(8)} ${r.name} — ${r.detail}`).join("\n") + (errors.length ? `\n\nconsole.error:\n${errors.join("\n")}` : ""),
    [results, errors],
  );

  return (
    <div style={{ padding: 24, fontFamily: "monospace", fontSize: 13, color: "#111", background: "#fff", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 18, marginBottom: 8 }}>3D GPU diagnostic</h1>
      <pre>{info}</pre>
      {err && <pre>terrain load failed: {err}</pre>}
      {ctx && index < TESTS.length && (
        <div style={{ margin: "12px 0" }}>
          Running {index + 1}/{TESTS.length}: {TESTS[index].name} ({TESTS[index].note})
          <Stage
            key={index}
            ctx={ctx}
            index={index}
            onResult={(r) => { setResults((x) => [...x, r]); setTimeout(() => setIndex((i) => i + 1), 50); }}
          />
        </div>
      )}
      {index >= TESTS.length && <p>Done. Screenshot or copy the block below.</p>}
      <pre style={{ whiteSpace: "pre-wrap", background: "#f3f3f3", padding: 12 }}>{report || "waiting…"}</pre>
    </div>
  );
}
