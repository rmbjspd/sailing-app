"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { loadTerrain, type TerrainData } from "./terrain";
import { buildRoute, type RouteModel } from "./route";
import TerrainMesh from "./TerrainMesh";
import RouteLine from "./RouteLine";
import Beacons from "./Beacons";
import Boat from "./Boat";
import Labels from "./Labels";
import { StoryRig, ExploreRig, type StoryState } from "./rigs";
import StaticChart from "./StaticChart";
import { BG } from "./constants";

export type { StoryState };

export interface VoyageWorldProps {
  mode: "story" | "explore";
  /** story mode: mutable state read every frame (day + overview blend) */
  story?: React.RefObject<StoryState>;
  /** explore mode: stop to fly to (null = overview) */
  focusStopId?: string | null;
  /** explore mode: highlight route up to this day (default: whole route) */
  exploreDay?: number;
  /** explore mode: a beacon was clicked */
  onStopSelect?: (id: string) => void;
  onReady?: (route: RouteModel) => void;
  className?: string;
}

function hasWebGL2() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

/** Ticks a 0→1 ref once, for the intro sonar sweep. */
function Reveal({ value, duration = 3.4 }: { value: React.RefObject<number>; duration?: number }) {
  useFrame((_, dt) => {
    if ((value.current ?? 1) < 1) value.current = Math.min(1, (value.current ?? 0) + dt / duration);
  });
  return null;
}

function ExploreProgress({ route, day, progress, activeIndex }: { route: RouteModel; day?: number; progress: React.RefObject<number>; activeIndex: React.RefObject<number> }) {
  useFrame((_, dt) => {
    const target = day == null ? 1 : route.fractionForDay(day);
    progress.current = THREE.MathUtils.lerp(progress.current ?? 0, target, 1 - Math.exp(-7 * Math.min(dt, 0.1)));
    let ai = 0;
    for (let i = 0; i < route.stops.length; i++) if (route.stops[i].f <= (progress.current ?? 0) + 1e-4) ai = i;
    activeIndex.current = ai;
  });
  return null;
}

function Scene({ terrain, route, props, lowPower }: { terrain: TerrainData; route: RouteModel; props: VoyageWorldProps; lowPower: boolean }) {
  const progress = useRef(0);
  const activeIndex = useRef(0);
  const mastDown = useRef(0);
  const reveal = useRef(props.mode === "story" ? 0 : 1);
  const segments = useMemo<[number, number]>(() => (lowPower ? [512, 296] : [900, 520]), [lowPower]);

  return (
    <>
      <color attach="background" args={[BG]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-3, 5, -2]} intensity={1.6} color="#dfe9ff" />
      <TerrainMesh terrain={terrain} segments={segments} reveal={props.mode === "story" ? reveal : undefined} />
      <Labels terrain={terrain} />
      <RouteLine route={route} progress={progress} />
      <Beacons route={route} activeIndex={activeIndex} onSelect={props.mode === "explore" ? props.onStopSelect : undefined} />
      <Boat route={route} progress={progress} mastDown={mastDown} />
      {props.mode === "story" && props.story ? (
        <>
          <Reveal value={reveal} />
          <StoryRig route={route} story={props.story} progress={progress} activeIndex={activeIndex} mastDown={mastDown} />
        </>
      ) : (
        <>
          <ExploreProgress route={route} day={props.exploreDay} progress={progress} activeIndex={activeIndex} />
          <ExploreRig route={route} focusStopId={props.focusStopId} />
        </>
      )}
      <EffectComposer multisampling={lowPower ? 0 : 4}>
        <Bloom mipmapBlur intensity={0.95} luminanceThreshold={0.62} luminanceSmoothing={0.25} radius={0.72} />
        <Vignette eskil={false} offset={0.22} darkness={0.78} />
      </EffectComposer>
    </>
  );
}

// The 3D voyage world. Loads terrain + builds the route, then renders either
// the scroll-driven story camera or the free-explore chart camera. Falls back
// to a static night chart if WebGL2 is unavailable or loading fails.
export default function VoyageWorld(props: VoyageWorldProps) {
  const [data, setData] = useState<{ terrain: TerrainData; route: RouteModel } | null>(null);
  const [failed, setFailed] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(true);
  const host = useRef<HTMLDivElement>(null);
  const { onReady } = props;

  // Stop rendering entirely while the world is scrolled out of view (or the
  // tab is hidden) so the rest of the page gets the whole frame budget.
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, [webgl]);

  useEffect(() => {
    const ok = hasWebGL2();
    setWebgl(ok);
    if (!ok) return;
    const small = window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4;
    setLowPower(small);
    let cancelled = false;
    loadTerrain()
      .then((terrain) => {
        if (cancelled) return;
        const route = buildRoute(terrain);
        setData({ terrain, route });
        onReady?.(route);
      })
      .catch((e) => { console.error(e); if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [onReady]);

  if (webgl === false || failed) {
    return <StaticChart className={props.className} />;
  }

  return (
    <div ref={host} className={props.className} style={{ background: BG }}>
      {data && (
        <Canvas
          frameloop={visible ? "always" : "never"}
          dpr={lowPower ? [1, 1.5] : [1, 2]}
          gl={{ antialias: false, powerPreference: "high-performance", toneMapping: THREE.NoToneMapping, stencil: false }}
          camera={{ fov: 34, near: 0.01, far: 60, position: [1.2, 8.2, 6.6] }}
          aria-hidden
        >
          <PerformanceMonitor onDecline={() => setLowPower(true)} />
          <Suspense fallback={null}>
            <Scene terrain={data.terrain} route={data.route} props={props} lowPower={lowPower} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
