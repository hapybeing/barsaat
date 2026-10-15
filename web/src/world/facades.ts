import * as THREE from 'three';
import { centre, halfWidth, slope, hash } from './path';
import type { Light } from './banks';

// Facades: the part that makes a wall a street. Concrete sunshades (chajjas) over every window,
// grilles, sills, balconies with railings and washing, AC boxes, drainpipes, shop shutters
// and glowing signboards at street level, parapets and black water tanks on the roofs.

export const PALETTE = ['#5f8f8a', '#b87a6a', '#c4a46a', '#7f8f5a', '#6a7fa6', '#a89f94', '#c9b8a0', '#9a6a8a'];
const SIGNS = [[1.0, 0.25, 0.35], [0.2, 0.9, 0.75], [0.35, 0.95, 0.35], [1.0, 0.7, 0.2], [0.5, 0.55, 1.0], [1.0, 0.95, 0.85]];
const GLASS_LIT = ['#ffb066', '#ffd49a', '#ffc27a', '#f2e6c8', '#9fd8ff'];

export type Adder = (g: THREE.BufferGeometry, m: THREE.Matrix4, color: THREE.ColorRepresentation, emit?: number, win?: number) => void;

const box = new THREE.BoxGeometry(1, 1, 1);
const cyl = new THREE.CylinderGeometry(0.5, 0.5, 1, 10);
const blob = new THREE.IcosahedronGeometry(0.5, 0);
const q = new THREE.Quaternion();
const e = new THREE.Euler();
const v = new THREE.Vector3();
const sc = new THREE.Vector3();

/** a point on a bank: along the river at s, `off` metres out from the water's edge (negative = over the water) */
export const bankPoint = (s: number, side: number, off: number, y: number) =>
  new THREE.Vector3(centre(s) + side * (halfWidth(s) + off), y, -s);

export type FacadeOpts = {
  ground: 'flood' | 'shop' | 'plinth';
  balcony: number;  // chance per upper floor
  tank: number;     // chance of a roof tank
  detail: number;   // 0..1, fewer small parts far away
};

/**
 * Dress one house front. sMid/width: the house's span along the river. off: how far the front
 * face sits from the water's edge. baseY: street level. H: height of the front.
 */
export function facade(add: Adder, lights: Light[], seed: number, sMid: number, width: number, side: number, off: number, baseY: number, H: number, o: FacadeOpts) {
  const yaw = -side * Math.PI / 2 - Math.atan(slope(sMid));
  // local frame: x along the river, y up, z out of the wall toward the water
  const place = (along: number, y: number, out: number, sx: number, sy: number, sz: number, g: THREE.BufferGeometry, color: THREE.ColorRepresentation, emit = 0) => {
    const s = sMid + along;
    const p = bankPoint(s, side, off - out, baseY + y);
    q.setFromEuler(e.set(0, yaw, 0));
    add(g, new THREE.Matrix4().compose(p, q, sc.set(sx, sy, sz)), color, emit);
  };
  const r = (k: number) => hash(seed * 13.7 + k * 7.31);

  // ground floor
  if (o.ground === 'shop') {
    const lit = r(1) > 0.35;
    place(0, 1.25, 0.04, width * 0.78, 2.4, 0.06, box, lit ? '#2a2620' : '#3a3d42', lit ? 0.35 : 0);
    if (r(2) > 0.3) {
      const c = SIGNS[Math.floor(r(3) * SIGNS.length)];
      const col = new THREE.Color(c[0], c[1], c[2]);
      place(0, 2.75, 0.08, width * 0.8, 0.55, 0.08, box, col, 1.4);
      lights.push({ p: bankPoint(sMid, side, off - 0.6, baseY + 2.75), c: new THREE.Vector3(c[0], c[1], c[2]).multiplyScalar(1.3), size: 1.3, flicker: r(4) > 0.8 ? 1 : 0 });
    }
    place(0, 3.15, 0.35, width * 0.92, 0.08, 0.7, box, '#2c2a28'); // awning slab
  } else if (o.ground === 'flood') {
    // the lane has flooded the ground floor; a door stands in the water
    const door = r(5) > 0.5;
    if (door) {
      const dx = width * (r(6) - 0.5) * 0.4;
      place(dx, 1.0, 0.02, 1.1, 2.1, 0.06, box, '#3b2f27');
      place(width * (r(6) - 0.5) * 0.4, 2.2, 0.1, 1.4, 0.08, 0.25, box, '#2d2b29');
    }
  }

  // upper floors
  const floorH = 2.85;
  const first = o.ground === 'plinth' ? 0.6 : 3.3;
  const cols = width > 5 ? 2 : 1;
  let f = 0;
  for (let y = first; y + 2.3 < H; y += floorH, f++) {
    const balcony = r(10 + f) < o.balcony && f >= 0 && o.detail > 0.3;
    for (let c = 0; c < cols; c++) {
      const a = cols === 1 ? 0 : (c === 0 ? -0.24 : 0.24) * width;
      const k = 20 + f * 5 + c;
      const lit = r(k) > 0.5;
      const glass = lit ? GLASS_LIT[Math.floor(r(k + 1) * GLASS_LIT.length)] : '#10151c';
      if (balcony && c === 0 && cols === 2) {
        // a door onto the balcony instead of a window
        place(a, y + 1.05, 0.0, 0.95, 2.05, 0.1, box, '#1a1714');
        place(a, y + 1.05, 0.04, 0.8, 1.9, 0.03, box, glass, lit ? 1.25 : 0.06);
        continue;
      }
      place(a, y + 1.25, 0.0, 1.15, 1.45, 0.12, box, '#1b1a18');           // frame
      place(a, y + 1.25, 0.05, 0.95, 1.25, 0.03, box, glass, lit ? 0.95 : 0.06); // glass
      if (lit && r(k + 2) > 0.5) place(a + 0.22, y + 1.25, 0.07, 0.42, 1.2, 0.02, box, '#6b3b2b', 0.25); // curtain
      if (o.detail > 0.5) {
        place(a, y + 2.13, 0.22, 1.5, 0.07, 0.5, box, '#3a3733');        // chajja
        place(a, y + 0.47, 0.08, 1.25, 0.07, 0.18, box, '#3a3733');       // sill
        if (r(k + 3) > 0.45) for (let b = -2; b <= 2; b++) place(a + b * 0.2, y + 1.25, 0.12, 0.025, 1.3, 0.025, box, '#121212'); // grille
        if (r(k + 4) > 0.82) place(a + 0.75, y + 0.35, 0.18, 0.75, 0.48, 0.32, box, '#8d9194'); // AC box
      }
    }
    if (balcony) {
      const bw = cols === 2 ? width * 0.42 : width * 0.7;
      const ba = cols === 2 ? -0.24 * width : 0;
      place(ba, y, 0.4, bw, 0.14, 0.8, box, '#46423d');
      place(ba, y + 0.95, 0.78, bw, 0.05, 0.05, box, '#151515');
      for (let b = 0; b <= 6; b++) place(ba - bw / 2 + (b / 6) * bw, y + 0.5, 0.78, 0.03, 0.9, 0.03, box, '#151515');
      if (r(40 + f) > 0.4) {
        // washing left out in the rain
        for (let w = 0; w < 4; w++) {
          const cl = PALETTE[Math.floor(r(50 + w + f) * PALETTE.length)];
          place(ba - bw * 0.35 + w * bw * 0.22, y + 1.75, 0.62, 0.32, 0.55 + r(60 + w) * 0.3, 0.02, box, cl);
        }
        place(ba, y + 2.05, 0.62, bw * 0.95, 0.015, 0.015, box, '#111');
      }
      if (r(70 + f) > 0.5) place(ba + bw * 0.38, y + 0.35, 0.6, 0.4, 0.45, 0.4, blob, '#20321f'); // a potted tulsi
    }
  }

  // roofline
  place(0, H - 0.05, -0.05, width + 0.02, 0.5, 0.25, box, '#3d3934');
  if (r(80) < o.tank) place(width * (r(81) - 0.5) * 0.5, H + 0.75, -1.2, 1.1, 1.2, 1.1, cyl, '#0c0c0d');
  if (o.detail > 0.5 && r(82) > 0.55) place(width * 0.5 - 0.1, H / 2, 0.1, 0.12, H, 0.12, cyl, '#2b2d2f'); // drainpipe
  if (o.detail > 0.5 && r(83) > 0.8) place(-width * 0.2, H + 1.1, -0.8, 0.04, 2.2, 0.04, box, '#222'); // antenna mast
  void v;
}
