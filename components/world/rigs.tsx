"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";
import * as THREE from "three";
import type { MapControls as MapControlsImpl } from "three-stdlib";
import type { RouteModel } from "./route";

export interface StoryState {
  /** fractional voyage day, 0 (Chicago) → last day (Old Saybrook) */
  day: number;
  /** 0 = chase cam on the boat, 1 = whole-region overview */
  overview: number;
  /** world-space x offset of the overview framing (negative pushes the map right, leaving room for type) */
  pan?: number;
  /** distance multiplier for the overview framing (>1 pulls back) */
  zoom?: number;
  /** 0..1 weight of the hero "preview" in which the whole route draws itself */
  preview?: number;
}

export const PORTRAIT_OVERVIEW = {
  pos: new THREE.Vector3(-8.6, 23.5, 0.15),
  target: new THREE.Vector3(-0.45, 0, 0.15),
};

const damp = (a: number, b: number, lambda: number, dt: number) =>
  THREE.MathUtils.lerp(a, b, 1 - Math.exp(-lambda * dt));

export const OVERVIEW = {
  pos: new THREE.Vector3(0.9, 10.6, 8.4),
  target: new THREE.Vector3(0.5, 0, -0.35),
};

// Story camera: interpolates between a cinematic chase-cam riding behind the
// boat and a high oblique overview of the whole region, both damped so scroll
// jitter never reaches the lens. Also publishes route progress for the line,
// boat and beacons through shared refs.
export function StoryRig({
  route, story, progress, lineProgress, activeIndex, mastDown,
}: {
  route: RouteModel;
  story: React.RefObject<StoryState>;
  progress: React.RefObject<number>;
  /** how far the route line is lit (boat progress, or the hero preview draw) */
  lineProgress: React.RefObject<number>;
  activeIndex: React.RefObject<number>;
  mastDown: React.RefObject<number>;
}) {
  const introStart = useRef<number | null>(null);
  const { camera, pointer, size } = useThree();
  const look = useRef(OVERVIEW.target.clone());
  const tmp = useMemo(() => ({
    b: new THREE.Vector3(), a: new THREE.Vector3(), c: new THREE.Vector3(),
    dir: new THREE.Vector3(), side: new THREE.Vector3(), pos: new THREE.Vector3(), tgt: new THREE.Vector3(),
    up: new THREE.Vector3(0, 1, 0), smDir: new THREE.Vector3(1, 0, 0),
  }), []);
  const smoothF = useRef(0);
  const first = useRef(true);
  const portrait = size.width < size.height;

  useFrame(({ clock }, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const s = story.current ?? { day: 0, overview: 1 };
    const fTarget = route.fractionForDay(s.day);
    smoothF.current = first.current ? fTarget : damp(smoothF.current, fTarget, 3.2, dt);
    const f = THREE.MathUtils.clamp(smoothF.current, 0, 1);
    progress.current = f;
    // Hero preview: after the terrain sweep, the whole route draws itself in
    // ~4.5 s; scrolling into the story hands the line back to the boat.
    if (introStart.current == null) introStart.current = clock.elapsedTime;
    const draw = THREE.MathUtils.smootherstep(clock.elapsedTime - introStart.current, 2.2, 6.7);
    const pv = s.preview ?? 0;
    lineProgress.current = THREE.MathUtils.lerp(f, Math.max(f, draw), pv);

    // active stop = last stop reached
    let ai = 0;
    for (let i = 0; i < route.stops.length; i++) if (route.stops[i].f <= f + 1e-4) ai = i;
    activeIndex.current = ai;

    // mast is down on the Erie Canal (Tonawanda unstep → Catskill re-step)
    const canal = route.legRanges.find((l) => l.legId === "erie-canal");
    const inCanal = canal ? f > canal.start + 0.002 && f < canal.end + 0.012 : false;
    mastDown.current = damp(mastDown.current ?? 0, inCanal ? 1 : 0, 2.5, dt);

    // chase camera, heading from a wide window so corners are soft
    route.curve.getPointAt(f, tmp.b);
    route.curve.getPointAt(Math.max(0, f - 0.03), tmp.a);
    route.curve.getPointAt(Math.min(1, f + 0.03), tmp.c);
    tmp.dir.subVectors(tmp.c, tmp.a).setY(0);
    if (tmp.dir.lengthSq() < 1e-8) tmp.dir.set(1, 0, 0);
    tmp.dir.normalize();
    tmp.smDir.lerp(tmp.dir, first.current ? 1 : 1 - Math.exp(-1.6 * dt)).normalize();
    tmp.side.crossVectors(tmp.smDir, tmp.up).normalize();
    const back = portrait ? 1.35 : 1.05;
    const height = portrait ? 1.15 : 0.82;
    const chasePos = tmp.pos.copy(tmp.b).addScaledVector(tmp.smDir, -back).addScaledVector(tmp.side, 0.38);
    chasePos.y = tmp.b.y + height;
    const chaseTgt = tmp.tgt.copy(tmp.b).addScaledVector(tmp.smDir, 0.55);

    // overview with a slow breathing drift
    const t = clock.elapsedTime;
    const ov = THREE.MathUtils.smootherstep(s.overview, 0, 1);
    const pan = portrait ? 0 : (s.pan ?? 0);
    const ovPos = OVERVIEW.pos.clone().add(new THREE.Vector3(Math.sin(t * 0.07) * 0.6 + pan, Math.sin(t * 0.05) * 0.2, 0));
    // Portrait: look east along the voyage so it runs up the tall screen.
    if (portrait) ovPos.copy(PORTRAIT_OVERVIEW.pos).add(new THREE.Vector3(0, 0, Math.sin(t * 0.07) * 0.4));
    const ovTgt = OVERVIEW.target.clone().add(new THREE.Vector3(pan, 0, 0));
    if (portrait) ovTgt.copy(PORTRAIT_OVERVIEW.target);
    const zoom = portrait ? 1 : (s.zoom ?? 1);
    ovPos.sub(ovTgt).multiplyScalar(zoom).add(ovTgt);
    const desiredPos = chasePos.lerp(ovPos, ov);
    const desiredTgt = chaseTgt.lerp(ovTgt, ov);

    // pointer parallax
    desiredPos.x += pointer.x * 0.12;
    desiredPos.y += pointer.y * 0.06;

    if (first.current) {
      camera.position.copy(desiredPos);
      look.current.copy(desiredTgt);
      first.current = false;
    } else {
      const k = 1 - Math.exp(-2.6 * dt);
      camera.position.lerp(desiredPos, k);
      look.current.lerp(desiredTgt, k);
    }
    camera.lookAt(look.current);

    // Frame the boat in the open part of the screen: to the right of the
    // chapter panel on desktop, above the bottom sheet on phones.
    const persp = camera as THREE.PerspectiveCamera;
    const chase = 1 - ov;
    const ox = portrait ? 0 : -0.13 * size.width * chase;
    const oy = portrait ? 0.17 * size.height * chase : 0;
    if (Math.abs(ox) + Math.abs(oy) < 0.5) {
      if (persp.view) persp.clearViewOffset();
    } else {
      persp.setViewOffset(size.width, size.height, ox, oy, size.width, size.height);
    }
  });
  return null;
}

// Explore camera: pan/zoom/tilt like a chart plotter, with smooth fly-to when a
// stop is selected. Constrained so you can't lose the map.
const EXPLORE_HOME = {
  pos: new THREE.Vector3(-0.35, 10.2, 8.3),
  target: new THREE.Vector3(-0.75, 0, -0.35),
};

export function ExploreRig({ route, focusStopId }: { route: RouteModel; focusStopId?: string | null }) {
  const controls = useRef<MapControlsImpl>(null);
  const { camera, size } = useThree();
  const home = useMemo(() => {
    // Phones: pull back and centre; desktop: leave room for the port list.
    if (size.width < size.height) return PORTRAIT_OVERVIEW;
    return EXPLORE_HOME;
  }, [size.width, size.height]);
  const fly = useRef<{ fromP: THREE.Vector3; fromT: THREE.Vector3; toP: THREE.Vector3; toT: THREE.Vector3; t: number } | null>(null);

  useEffect(() => {
    camera.position.copy(home.pos);
    controls.current?.target.copy(home.target);
    controls.current?.update();
  }, [camera, home]);

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const stop = focusStopId ? route.stops.find((s) => s.id === focusStopId) : null;
    const toT = stop ? stop.pos.clone() : home.target.clone();
    const toP = stop ? stop.pos.clone().add(new THREE.Vector3(0.35, 1.25, 1.35)) : home.pos.clone();
    fly.current = { fromP: camera.position.clone(), fromT: c.target.clone(), toP, toT, t: 0 };
  }, [focusStopId, route, camera, home]);

  useFrame((_, dt) => {
    const c = controls.current;
    const fl = fly.current;
    if (!c || !fl) return;
    fl.t = Math.min(1, fl.t + dt / 1.8);
    const e = fl.t < 0.5 ? 4 * fl.t ** 3 : 1 - (-2 * fl.t + 2) ** 3 / 2;
    camera.position.lerpVectors(fl.fromP, fl.toP, e);
    // arc up mid-flight for a sense of travel
    camera.position.y += Math.sin(e * Math.PI) * fl.fromP.distanceTo(fl.toP) * 0.25;
    c.target.lerpVectors(fl.fromT, fl.toT, e);
    c.update();
    if (fl.t >= 1) fly.current = null;
  });

  return (
    <MapControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={0.35}
      maxDistance={28}
      maxPolarAngle={1.25}
      screenSpacePanning={false}
      onStart={() => { fly.current = null; }}
    />
  );
}
