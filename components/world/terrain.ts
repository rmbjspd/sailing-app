// Terrain data loader for the 3D world.
//
// Decodes the baked rasters (see scripts/geo/bake-*.py) into:
//   - elevation (metres, lake floors included) as a half-float texture + CPU array
//   - water mask (0..1, anti-aliased shoreline)
//   - water surface level (metres) — each lake floats at its true height
// Rows are flipped on decode so row 0 = SOUTH, matching three.js UV v=0.
import * as THREE from "three";
import { TERRAIN } from "@/lib/geo/projection";

export interface TerrainData {
  width: number;
  height: number;
  /** elevation in metres, row 0 = south */
  elev: Float32Array;
  /** water mask 0..1, row 0 = south */
  water: Float32Array;
  /** water surface level in metres, row 0 = south */
  level: Float32Array;
  elevTex: THREE.DataTexture;
  waterTex: THREE.DataTexture;
  levelTex: THREE.DataTexture;
}

async function decode(url: string): Promise<{ data: Uint8ClampedArray; w: number; h: number }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`terrain fetch failed: ${url} ${res.status}`);
  const blob = await res.blob();
  const bmp = await createImageBitmap(blob, { colorSpaceConversion: "none", premultiplyAlpha: "none" });
  const canvas = document.createElement("canvas");
  canvas.width = bmp.width;
  canvas.height = bmp.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true, colorSpace: "srgb" })!;
  ctx.drawImage(bmp, 0, 0);
  const { data } = ctx.getImageData(0, 0, bmp.width, bmp.height);
  bmp.close();
  return { data, w: canvas.width, h: canvas.height };
}

let cache: Promise<TerrainData> | null = null;

export function loadTerrain(): Promise<TerrainData> {
  if (!cache) cache = build().catch((e) => { cache = null; throw e; });
  return cache;
}

async function build(): Promise<TerrainData> {
  const [t, l] = await Promise.all([decode(TERRAIN.url), decode("/geo/water-level.png")]);
  const { w, h } = t;
  const n = w * h;
  const elev = new Float32Array(n);
  const water = new Float32Array(n);
  const level = new Float32Array(n);
  const elevHalf = new Uint16Array(n);
  const waterBytes = new Uint8Array(n);
  const levelBytes = new Uint8Array(n);
  for (let y = 0; y < h; y++) {
    const src = (h - 1 - y) * w; // flip: row 0 = south
    const dst = y * w;
    for (let x = 0; x < w; x++) {
      const si = (src + x) * 4;
      const di = dst + x;
      const e = (t.data[si] * 256 + t.data[si + 1]) / TERRAIN.elevScale - TERRAIN.elevOffset;
      elev[di] = e;
      elevHalf[di] = THREE.DataUtils.toHalfFloat(e);
      water[di] = t.data[si + 2] / 255;
      waterBytes[di] = t.data[si + 2];
      const lv = l.data[si]; // grayscale → R
      level[di] = lv;
      levelBytes[di] = lv;
    }
  }
  const mk = (data: Uint8Array | Uint16Array, type: THREE.TextureDataType) => {
    const tex = new THREE.DataTexture(data, w, h, THREE.RedFormat, type);
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearFilter;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = false;
    tex.colorSpace = THREE.NoColorSpace;
    tex.needsUpdate = true;
    return tex;
  };
  return {
    width: w, height: h, elev, water, level,
    elevTex: mk(elevHalf, THREE.HalfFloatType),
    waterTex: mk(waterBytes, THREE.UnsignedByteType),
    levelTex: mk(levelBytes, THREE.UnsignedByteType),
  };
}

/** Bilinear sample of a row-0-south grid at UV (0..1). */
export function sampleGrid(grid: Float32Array, w: number, h: number, u: number, v: number): number {
  const x = Math.min(Math.max(u * w - 0.5, 0), w - 1.001);
  const y = Math.min(Math.max(v * h - 0.5, 0), h - 1.001);
  const x0 = Math.floor(x), y0 = Math.floor(y);
  const fx = x - x0, fy = y - y0;
  const i = y0 * w + x0;
  return (
    grid[i] * (1 - fx) * (1 - fy) + grid[i + 1] * fx * (1 - fy) +
    grid[i + w] * (1 - fx) * fy + grid[i + w + 1] * fx * fy
  );
}
