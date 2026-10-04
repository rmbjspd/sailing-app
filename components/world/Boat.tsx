"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { RouteModel } from "./route";

// A stylised sloop, deliberately oversized so it reads at chart scale. It rides
// the route at `progress`, heading along the smoothed tangent, heeling and
// pitching gently. When `mastDown` is set (Erie Canal) the rig is lowered onto
// the deck — as it really is between Tonawanda and Catskill.
export default function Boat({
  route, progress, scale = 0.075, mastDown,
}: {
  route: RouteModel;
  progress: React.RefObject<number>;
  scale?: number;
  mastDown?: React.RefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const rig = useRef<THREE.Group>(null);
  const heading = useRef(new THREE.Quaternion());
  const tmp = useMemo(() => ({ p: new THREE.Vector3(), a: new THREE.Vector3(), b: new THREE.Vector3(), m: new THREE.Matrix4(), q: new THREE.Quaternion(), up: new THREE.Vector3(0, 1, 0) }), []);

  const hull = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.5);
    s.bezierCurveTo(0.17, 0.25, 0.2, -0.15, 0.13, -0.45);
    s.lineTo(-0.13, -0.45);
    s.bezierCurveTo(-0.2, -0.15, -0.17, 0.25, 0, 0.5);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.09, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 3, curveSegments: 16 });
    g.rotateX(Math.PI / 2); // shape Y → -Z (bow forward = -Z), extrude down
    g.translate(0, 0.05, 0);
    return g;
  }, []);
  const main = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute([0, 0.12, -0.02, 0, 0.98, -0.02, 0, 0.12, -0.36], 3));
    g.computeVertexNormals();
    return g;
  }, []);
  const jib = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute([0, 0.12, 0.04, 0, 0.9, 0.02, 0, 0.12, 0.42], 3));
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame(({ clock }, dt) => {
    const g = group.current;
    if (!g) return;
    const f = THREE.MathUtils.clamp(progress.current ?? 0, 0, 1);
    route.curve.getPointAt(f, tmp.p);
    route.curve.getPointAt(Math.max(0, f - 0.004), tmp.a);
    route.curve.getPointAt(Math.min(1, f + 0.004), tmp.b);
    const dir = tmp.b.sub(tmp.a);
    dir.y = 0;
    if (dir.lengthSq() > 1e-10) {
      tmp.m.lookAt(new THREE.Vector3(), dir.normalize().negate(), tmp.up);
      tmp.q.setFromRotationMatrix(tmp.m);
      heading.current.slerp(tmp.q, Math.min(1, dt * 5));
    }
    const t = clock.elapsedTime;
    g.position.copy(tmp.p);
    g.position.y += Math.sin(t * 1.7) * 0.0012;
    g.quaternion.copy(heading.current);
    g.rotateZ(Math.sin(t * 0.9) * 0.06 + 0.08);
    g.rotateX(Math.sin(t * 1.3) * 0.03);
    if (rig.current) {
      const down = mastDown?.current ?? 0;
      rig.current.rotation.x += (down * -1.45 - rig.current.rotation.x) * Math.min(1, dt * 3);
      rig.current.position.y = 0.06 - down * 0.04;
    }
  });

  return (
    <group ref={group} scale={scale}>
      <mesh geometry={hull}>
        <meshStandardMaterial color="#e9eef4" roughness={0.35} metalness={0.1} emissive="#9fb6cc" emissiveIntensity={0.08} />
      </mesh>
      <mesh position={[0, 0.07, -0.1]}>
        <boxGeometry args={[0.16, 0.06, 0.22]} />
        <meshStandardMaterial color="#c9d4e0" roughness={0.5} />
      </mesh>
      <group ref={rig} position={[0, 0.06, 0]}>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.008, 0.012, 1.0, 6]} />
          <meshStandardMaterial color="#d9e2ec" />
        </mesh>
        <mesh geometry={main}>
          <meshStandardMaterial color="#fff6e8" emissive="#ffe2b8" emissiveIntensity={0.28} side={THREE.DoubleSide} roughness={0.8} />
        </mesh>
        <mesh geometry={jib}>
          <meshStandardMaterial color="#fff6e8" emissive="#ffd9a6" emissiveIntensity={0.22} side={THREE.DoubleSide} roughness={0.8} />
        </mesh>
        <pointLight position={[0, 1.05, 0]} color="#ff5d5d" intensity={0.22} distance={0.5} />
      </group>
    </group>
  );
}
