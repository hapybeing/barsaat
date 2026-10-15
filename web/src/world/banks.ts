import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mat } from './common';
import { centre, halfWidth, weights, hash, hash2, STARTS } from './path';
import { facade, PALETTE } from './facades';

// Lit windows, shared by the walls and by their reflections in the water.
export const windowGLSL = /* glsl */ `
vec3 windowLight(float along, float y, float side) {
  if (y < 1.7) return vec3(0.0);
  side = side > 0.0 ? 1.0 : -1.0; // interpolated values wobble; hash inputs must be exact
  vec2 g = vec2(along / 2.3 + side * 0.37, (y - 1.7) / 2.7);
  vec2 id = floor(g);
  vec2 f = fract(g);
  float h = hash21(id + side * 37.0);
  float inWin = step(0.27, f.x) * step(f.x, 0.73) * step(0.18, f.y) * step(f.y, 0.72);
  float lit = step(0.6, h);
  vec3 c = mix(vec3(1.0, 0.52, 0.22), vec3(1.0, 0.82, 0.55), fract(h * 7.3));
  if (h > 0.94) c = vec3(0.45, 0.62, 1.0) * (0.75 + 0.25 * sin(uTime * 9.0 + h * 50.0) * sin(uTime * 2.3));
  if (h > 0.6 && h < 0.66) c = vec3(0.55, 0.75, 0.7); // a tube light
  float bars = 0.85 + 0.15 * smoothstep(0.3, 0.7, f.y);
  float curtain = mix(1.0, 0.45, step(0.5, fract(h * 13.0)) * smoothstep(0.35, 0.55, f.x));
  return c * inWin * lit * bars * curtain * 1.1;
}
`;

export type Light = { p: THREE.Vector3; c: THREE.Vector3; size: number; flicker: number; glowOnly?: boolean };

const CHUNK = 30;
const PROFILE_N = 26;

const at = (s: number, side: number, off: number, y: number) =>
  new THREE.Vector3(centre(s) + side * (halfWidth(s) + off), y, -s);

/** cross-section of one bank at s: PROFILE_N points (outward offset, height) */
function profile(s: number, side: number): [number, number][] {
  const w = weights(s);
  const houseH = 5.2 + Math.floor(hash(Math.floor((s + side * 3.1) / 6.3) + side * 91) * 5) * 1.0;
  const lane: [number, number][] = [[0, -1.5], [0, houseH]];
  const canal: [number, number][] = [[0, -1.5], [0, 1.05], [0.45, 1.05], [0.45, 0.75]];
  const left = side < 0;
  const ghat: [number, number][] = [[0, -1.5]];
  if (left) {
    // eleven stone steps up to a platform
    for (let k = 0; k < 11; k++) { const x = k * 0.85, y = 0.1 + k * 0.42; ghat.push([x, y], [x + 0.85, y]); }
  } else ghat.push([0, 0.35], [8, 0.9]);
  const open: [number, number][] = [[0, -1.5], [0, 0.2], [30, 0.6]];
  const pad = (p: [number, number][], far: number) => {
    const last = p[p.length - 1];
    const out = p.slice();
    while (out.length < PROFILE_N - 1) out.push([last[0], last[1]]);
    out.push([far, last[1]]);
    return out;
  };
  const P = [pad(lane, 40), pad(canal, 60), pad(ghat, 80), pad(open, 160)];
  const r: [number, number][] = [];
  for (let i = 0; i < PROFILE_N; i++) {
    let x = 0, y = 0;
    for (let c = 0; c < 4; c++) { x += P[c][i][0] * w[c]; y += P[c][i][1] * w[c]; }
    r.push([x, y]);
  }
  return r;
}

// --- materials ------------------------------------------------------------------------------

const bankMat = mat({
  vertex: /* glsl */ `
    attribute float aWin;
    attribute float aStone;
    attribute float aSide;
    varying vec3 vW; varying vec3 vN; varying float vWin; varying float vStone; varying float vSide;
    void main() {
      vec4 w = modelMatrix * vec4(position, 1.0);
      vW = w.xyz; vN = normal; vWin = aWin; vStone = aStone; vSide = aSide;
      gl_Position = projectionMatrix * viewMatrix * w;
    }`,
  fragment: /* glsl */ `
    varying vec3 vW; varying vec3 vN; varying float vWin; varying float vStone; varying float vSide;
    const vec3 PAL[8] = vec3[8](vec3(0.373, 0.561, 0.541), vec3(0.722, 0.478, 0.416), vec3(0.769, 0.643, 0.416), vec3(0.498, 0.561, 0.353), vec3(0.416, 0.498, 0.651), vec3(0.659, 0.624, 0.580), vec3(0.788, 0.722, 0.627), vec3(0.604, 0.416, 0.541));
    ${windowGLSL}
    void main() {
      vec3 n = normalize(vN);
      float vert = 1.0 - abs(n.y);
      // limewashed plaster in faded colours, streaked by years of monsoons
      float sd = vSide > 0.0 ? 1.0 : -1.0;
      float house = floor((-vW.z + sd * 3.1) / 6.3);
      float ph = fract(sin(house * 12.9898 + sd * 78.233) * 43758.5453);
      int pi = int(floor(ph * 8.0));
      vec3 wash = PAL[0];
      for (int i = 1; i < 8; i++) if (i == pi) wash = PAL[i];
      wash *= 0.62;
      // patches where the plaster has fallen off and the brick shows
      float peel = smoothstep(0.62, 0.66, fbm(vW.yz * vec2(0.6, 0.35) + vec2(vW.x * 0.3, house)));
      vec2 bk = vec2((-vW.z) / 0.23 + floor(vW.y / 0.075) * 0.5, vW.y / 0.075);
      float mortar = step(0.88, fract(bk.x)) + step(0.8, fract(bk.y));
      vec3 brick = mix(vec3(0.42, 0.2, 0.14), vec3(0.32, 0.27, 0.23), min(mortar, 1.0));
      wash = mix(wash, brick, peel * smoothstep(0.5, 2.0, vW.y));
      float streak = fbm(vec2(vW.x * 0.3 - vW.z * 0.9, vW.y * 0.25) * vec2(3.0, 0.4));
      vec3 alb = wash * (0.5 + 0.55 * streak) * (1.0 - 0.35 * smoothstep(0.55, 0.9, fbm(vec2(-vW.z * 2.0, vW.y * 0.15))));
      // posters and painted ads pasted on the lane walls, peeling in the rain
      {
        float u = -vW.z / 2.4 + sd * 0.37;
        float cid = floor(u);
        float hp = fract(sin(cid * 91.7 + sd * 13.1) * 43758.5453);
        vec2 pf = vec2(fract(u), (vW.y - 1.3) / 1.5);
        float inP = step(0.6, hp) * step(0.12, pf.x) * step(pf.x, 0.88) * step(0.0, pf.y) * step(pf.y, 1.0) * vert;
        float torn = step(0.35, vnoise(vec2(pf.x * 9.0, pf.y * 7.0) + cid));
        if (inP * torn > 0.5) {
          int ci = int(floor(fract(hp * 7.3) * 6.0));
          vec3 pc = vec3(0.75, 0.2, 0.15);
          if (ci == 1) pc = vec3(0.85, 0.7, 0.2); else if (ci == 2) pc = vec3(0.15, 0.45, 0.7);
          else if (ci == 3) pc = vec3(0.85, 0.82, 0.75); else if (ci == 4) pc = vec3(0.2, 0.55, 0.3); else if (ci == 5) pc = vec3(0.8, 0.4, 0.6);
          // headline bar, rows of type, a face-sized blob
          float rows = step(0.55, fract(pf.y * 9.0)) * step(0.2, pf.y) * step(pf.y, 0.62) * step(0.2, pf.x) * step(pf.x, 0.8);
          float head = step(0.72, pf.y) * step(pf.y, 0.9) * step(0.18, pf.x) * step(pf.x, 0.82);
          vec3 ink = mix(vec3(0.05), vec3(0.95, 0.9, 0.8), step(0.5, fract(hp * 3.1)));
          pc = mix(pc, ink, max(rows * 0.8, head));
          alb = pc * (0.55 + 0.4 * fbm(vW.yz * 3.0)) * 0.7;
        }
      }
      alb = mix(alb, vec3(0.12, 0.15, 0.10), smoothstep(1.2, 0.0, vW.y) * 0.8); // moss at the waterline
      vec3 stone = vec3(0.48, 0.40, 0.33) * (0.7 + 0.5 * fbm(vW.xz * 1.7));
      alb = mix(alb, stone, vStone);
      alb = mix(alb * 0.55, alb, vert); // tops and steps catch less of the light from the lane
      alb *= mix(1.0, 0.62, uWet);       // wet surfaces go dark

      vec3 lit = uAmbient * 2.2 + uFogColor * 1.1 + vec3(0.06, 0.05, 0.06) * smoothstep(0.0, 6.0, vW.y) + vec3(0.55, 0.55, 0.75) * uFlash * (0.4 + 0.6 * max(dot(n, normalize(uFlashDir)), 0.0));
      vec3 pl = pointLights(vW, n);
      lit += pl / (1.0 + pl * 0.7);
      // light spilling up from the lit street and the water below, and a cool sky from above
      lit += vec3(0.16, 0.11, 0.07) * smoothstep(5.0, 0.0, vW.y) + vec3(0.05, 0.06, 0.09) * max(n.y, 0.0);
      vec3 col = alb * lit;
      // wet sheen from the lamps
      vec3 V = normalize(cameraPosition - vW);
      col += pointLights(vW, reflect(-V, n)) * 0.04 * uWet;
      if (abs(n.z) < 0.35 && vert > 0.7 && vWin > 0.01) col += windowLight(-vW.z, vW.y, vSide) * vWin;
      col = applyFog(col, length(cameraPosition - vW));
      gl_FragColor = vec4(col, 1.0);
    }`,
});

const propMat = mat({
  vertex: /* glsl */ `
    attribute vec3 color;
    attribute float aEmit;
    attribute float aWin;
    varying vec3 vW; varying vec3 vN; varying vec3 vC; varying float vE; varying float vWin;
    void main() {
      vec4 w = modelMatrix * vec4(position, 1.0);
      vW = w.xyz; vN = normal; vC = color; vE = aEmit; vWin = aWin;
      gl_Position = projectionMatrix * viewMatrix * w;
    }`,
  fragment: /* glsl */ `
    varying vec3 vW; varying vec3 vN; varying vec3 vC; varying float vE; varying float vWin;
    ${windowGLSL}
    void main() {
      vec3 n = normalize(vN);
      vec3 alb = vC * mix(1.0, 0.65, uWet) * (0.8 + 0.4 * vnoise(vW.xz * 2.0 + vW.y));
      vec3 lit = uAmbient * 2.2 + uFogColor * 1.1 + vec3(0.55, 0.55, 0.75) * uFlash * (0.4 + 0.6 * max(dot(n, normalize(uFlashDir)), 0.0));
      lit += vec3(0.07, 0.08, 0.11) * max(n.y, 0.0) + vec3(0.12, 0.08, 0.05) * smoothstep(9.0, 0.0, vW.y) * (0.4 + 0.6 * max(-n.y, 0.3));
      vec3 pl = pointLights(vW, n);
      lit += pl / (1.0 + pl * 0.7);
      alb *= 0.75;
      vec3 col = alb * lit + vC * vE * (0.9 + 0.1 * sin(uTime * 13.0 + vW.x * 4.0));
      if (vWin > 0.5 && abs(n.y) < 0.3) {
        float along = abs(n.x) > abs(n.z) ? -vW.z : vW.x;
        col += windowLight(along, vW.y, sign(n.x + n.z)) * 0.9;
      }
      col = applyFog(col, length(cameraPosition - vW));
      gl_FragColor = vec4(col, 1.0);
    }`,
});

const spoutMat = mat({
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
  vertex: /* glsl */ `
    varying vec3 vW; varying vec2 vUv;
    void main() { vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragment: /* glsl */ `
    varying vec3 vW; varying vec2 vUv;
    void main() {
      float edge = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
      float streaks = vnoise(vec2(vUv.x * 9.0, vUv.y * 3.0 + uTime * 9.0));
      float a = edge * (0.25 + 0.6 * streaks) * (0.4 + 0.6 * uRain);
      vec3 col = (uAmbient * 1.6 + pointLights(vW, vec3(0.0, 0.0, 1.0)) * 1.3 + uFlash * 0.6) * vec3(0.8, 0.85, 0.9);
      col = applyFog(col, length(cameraPosition - vW));
      gl_FragColor = vec4(col, a * 0.75);
    }`,
});

const cableMat = mat({
  vertex: /* glsl */ `varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.0); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,
  fragment: /* glsl */ `varying vec3 vW; void main(){ vec3 c = vec3(0.01) + uFlash * 0.05; gl_FragColor = vec4(applyFog(c, length(cameraPosition - vW)), 1.0); }`,
});

// --- prop builder ---------------------------------------------------------------------------

class Props {
  parts: THREE.BufferGeometry[] = [];
  add(g: THREE.BufferGeometry, m: THREE.Matrix4, color: THREE.ColorRepresentation, emit = 0, win = 0) {
    const geo = (g.index ? g.toNonIndexed() : g.clone()).applyMatrix4(m);
    geo.deleteAttribute('uv');
    if (!geo.getAttribute('normal')) geo.computeVertexNormals();
    const n = geo.getAttribute('position').count;
    const c = new THREE.Color(color);
    const col = new Float32Array(n * 3), e = new Float32Array(n).fill(emit), w = new Float32Array(n).fill(win);
    for (let i = 0; i < n; i++) { col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('aEmit', new THREE.BufferAttribute(e, 1));
    geo.setAttribute('aWin', new THREE.BufferAttribute(w, 1));
    this.parts.push(geo);
  }
  build() { return this.parts.length ? mergeGeometries(this.parts, false) : null; }
}

const M = (pos: THREE.Vector3, rotY = 0, sx = 1, sy = 1, sz = 1) =>
  new THREE.Matrix4().compose(pos, new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rotY, 0)), new THREE.Vector3(sx, sy, sz));

// shared primitive shapes
const G = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 7),
  bulb: new THREE.SphereGeometry(0.5, 8, 6),
  canopy: new THREE.IcosahedronGeometry(1, 1),
  cone: new THREE.ConeGeometry(1, 1, 10, 1, true),
  shikhara: (() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 14; i++) {
      const t = i / 14;
      pts.push(new THREE.Vector2(1.55 * Math.pow(1 - t, 0.75) * (1 - 0.08 * Math.sin(t * 40)) + 0.12, t * 7.5));
    }
    return new THREE.LatheGeometry(pts, 8);
  })(),
  amalaka: new THREE.SphereGeometry(0.55, 12, 6).scale(1, 0.38, 1),
};
G.canopy.translate(0, 0, 0);

function bridge(hw: number) {
  const span = hw * 2 + 8;
  const s = new THREE.Shape();
  s.moveTo(-span / 2, -1.5); s.lineTo(span / 2, -1.5); s.lineTo(span / 2, 3.5); s.lineTo(-span / 2, 3.5); s.lineTo(-span / 2, -1.5);
  const hole = new THREE.Path();
  const rx = hw + 0.6, ry = 2.75;
  hole.moveTo(rx, -1.5);
  for (let i = 0; i <= 24; i++) { const a = (i / 24) * Math.PI; hole.lineTo(Math.cos(a) * rx, -1.5 + Math.sin(a) * (ry + 1.5)); }
  hole.lineTo(-rx, -1.5); hole.lineTo(rx, -1.5);
  s.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(s, { depth: 2.6, bevelEnabled: false, curveSegments: 6 });
  g.translate(0, 0, -1.3);
  return g;
}

// --- chunks ---------------------------------------------------------------------------------

type Chunk = { group: THREE.Group; lights: Light[]; temples: number[] };

export class Banks {
  root = new THREE.Group();
  chunks = new Map<number, Chunk>();
  lights: Light[] = [];
  temples: number[] = [];
  dirty = true;

  update(s: number) {
    const first = Math.floor((s - 20) / CHUNK), last = Math.floor((s + 230) / CHUNK);
    for (const [k, c] of this.chunks) if (k < first || k > last) {
      this.root.remove(c.group);
      c.group.traverse(o => { if ((o as THREE.Mesh).geometry) (o as THREE.Mesh).geometry.dispose(); });
      this.chunks.delete(k); this.dirty = true;
    }
    for (let k = Math.max(0, first); k <= last; k++) if (!this.chunks.has(k)) {
      const c = this.build(k); this.chunks.set(k, c); this.root.add(c.group); this.dirty = true;
      break; // at most one chunk per frame, so there's never a hitch
    }
    if (this.dirty) {
      this.lights = []; this.temples = [];
      for (const c of this.chunks.values()) { this.lights.push(...c.lights); this.temples.push(...c.temples); }
    }
  }

  /** build every chunk in range now (on start and after a jump) */
  prime(s: number) { for (let i = 0; i < 12; i++) this.update(s); }

  reset() {
    for (const c of this.chunks.values()) this.root.remove(c.group);
    this.chunks.clear(); this.dirty = true;
  }

  /** house fronts for the lane, rows of houses along the canal and on the ghat, boats, fairy lights */
  private streets(s0: number, s1: number, props: Props, lights: Light[]) {
    const add = props.add.bind(props);
    for (const side of [-1, 1]) {
      // the lane: house segments match the wall heights the bank ribbon uses
      const L = 6.3;
      for (let n = Math.floor((s0 + side * 3.1) / L); ; n++) {
        const a = n * L - side * 3.1, mid = a + L / 2;
        if (a >= s1) break;
        if (a < s0) continue;
        if (weights(mid)[0] < 0.55) continue;
        const H = 5.2 + Math.floor(hash(n + side * 91) * 5);
        facade(add, lights, n * 3 + side, mid, L - 0.02, side, 0, 0, H, { ground: 'flood', balcony: 0.45, tank: 0.7, detail: 1 });
        // a shop sign sticking out from the wall, lit
        if (hash(n * 4.1 + side) > 0.62) {
          const c = [[1, 0.3, 0.3], [0.3, 1, 0.8], [1, 0.8, 0.3], [0.5, 0.6, 1]][Math.floor(hash(n * 2.2 + side) * 4)];
          const sp = at(mid - 1.5, side, -0.45, 3.6);
          props.add(G.box, M(sp, 0, 0.7, 0.9, 0.06), new THREE.Color(c[0], c[1], c[2]).multiplyScalar(0.6), 1.2);
          props.add(G.box, M(sp, 0, 0.74, 0.12, 0.08), '#1a1a1a');
          props.add(G.box, M(at(mid - 1.5, side, -0.12, 4.12), 0, 0.7, 0.04, 0.04), '#151515');
          lights.push({ p: at(mid - 1.5, side, -0.6, 3.6), c: new THREE.Vector3(c[0], c[1], c[2]).multiplyScalar(0.9), size: 1.0, flicker: hash(n) > 0.85 ? 1 : 0 });
        }
      }
    }
    // things strung across the lane: washing, bunting, blue tarps
    for (let s = Math.ceil(s0 / 3) * 3; s < s1; s += 3) {
      const w = weights(s);
      if (w[0] < 0.6) continue;
      const hw = halfWidth(s);
      const h = hash(s * 1.37 + 5);
      const yaw = -Math.atan(centre(s + 0.5) - centre(s - 0.5));
      if (h < 0.22) {
        // washing line with clothes pegged on it
        const y = 3.6 + hash(s + 2) * 1.5;
        props.add(G.box, M(new THREE.Vector3(centre(s), y, -s), yaw, hw * 2 + 0.4, 0.012, 0.012), '#111');
        const k = 3 + Math.floor(hash(s + 3) * 4);
        for (let i = 0; i < k; i++) {
          const x = -hw + 0.3 + (i + hash(s + i)) * (hw * 2 - 0.6) / k;
          const ch = 0.45 + hash(s + i * 3) * 0.5;
          const sag = Math.cos((x / hw) * Math.PI / 2) * 0.25;
          props.add(G.box, M(new THREE.Vector3(centre(s) + x, y - sag - ch / 2, -s), yaw + (hash(s + i * 7) - 0.5) * 0.3, 0.34, ch, 0.015), new THREE.Color(PALETTE[Math.floor(hash(s * 3 + i) * PALETTE.length)]).multiplyScalar(0.5));
        }
      } else if (h < 0.34) {
        // festival bunting, small triangles in a sagging line
        const y = 4.6 + hash(s + 4) * 1.2;
        const cols = ['#c0392b', '#e1a730', '#2e86c1', '#27ae60', '#e8e0d0', '#8e44ad'];
        for (let i = 0; i <= 10; i++) {
          const t = i / 10, x = -hw + t * hw * 2;
          const sag = Math.sin(t * Math.PI) * 0.35;
          const p = new THREE.Vector3(centre(s) + x, y - sag - 0.12, -s);
          const m = new THREE.Matrix4().compose(p, new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, Math.PI / 4)), new THREE.Vector3(0.17, 0.17, 0.01));
          props.add(G.box, m, cols[i % cols.length]);
        }
        props.add(G.box, M(new THREE.Vector3(centre(s), y - 0.18, -s), yaw, hw * 2, 0.01, 0.01), '#222');
      } else if (h < 0.4 && hash(s + 9) > 0.3) {
        // a blue tarp sagging over the lane, rain drumming on it
        const y = 4.9 + hash(s + 6) * 1.0;
        const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.12 * (hash(s + 7) - 0.5), yaw, 0.06 * (hash(s + 8) - 0.5)));
        props.add(G.box, new THREE.Matrix4().compose(new THREE.Vector3(centre(s), y, -s), q, new THREE.Vector3(hw * 2 + 0.3, 0.03, 2.2)), hash(s + 10) > 0.3 ? '#2a5aa0' : '#a0522d');
      }
    }
    for (const side of [-1, 1]) {
      // the canal: a row of houses behind the walkway
      const C = 7.4;
      for (let n = Math.floor(s0 / C); ; n++) {
        const a = n * C, mid = a + C / 2;
        if (a >= s1) break;
        if (a < s0) continue;
        if (weights(mid)[1] < 0.5) continue;
        const r = hash(n * 5.1 + side * 17);
        if (r < 0.12) continue; // a gap: an alley, a tree
        const H = 5.5 + Math.floor(hash(n * 2.3 + side) * 4) * 1.7;
        const off = 2.6 + hash(n * 7.7 + side) * 1.2;
        const p = at(mid, side, off + 3.5, 0.75 + H / 2);
        const yaw = -Math.atan(centre(mid + 0.5) - centre(mid - 0.5));
        props.add(G.box, M(p, yaw, 7, H, C - 0.15), PALETTE[Math.floor(hash(n * 3.3 + side * 5) * PALETTE.length)]);
        facade(add, lights, n * 7 + side * 3, mid, C - 0.15, side, off, 0.75, H, { ground: hash(n + side * 9) > 0.45 ? 'shop' : 'plinth', balcony: 0.35, tank: 0.8, detail: 0.8 });
      }
      // the ghat: houses and dharamshalas above the steps on the left, low houses on the far bank
      const Gs = 9;
      for (let n = Math.floor(s0 / Gs); ; n++) {
        const a = n * Gs, mid = a + Gs / 2;
        if (a >= s1) break;
        if (a < s0) continue;
        if (weights(mid)[2] < 0.5) continue;
        if (side < 0) {
          const H = 7 + Math.floor(hash(n * 1.9) * 4) * 2.2;
          const off = 13.5 + hash(n * 4.4) * 2;
          const p = at(mid, side, off + 4, 4.3 + H / 2);
          props.add(G.box, M(p, 0, 8, H, Gs - 0.3), PALETTE[Math.floor(hash(n * 6.1) * PALETTE.length)]);
          facade(add, lights, n * 11, mid, Gs - 0.3, side, off, 4.3, H, { ground: 'plinth', balcony: 0.5, tank: 0.6, detail: 0.6 });
          // a wooden boat tied up at the bottom step
          if (hash(n * 8.8) > 0.4) {
            const bp = at(mid + 2, side, -0.9, 0.12);
            props.add(G.box, M(bp, 0.08, 1.1, 0.35, 4.2), '#3a2a1e');
            props.add(G.box, M(bp.clone().setY(0.32), 0.08, 1.15, 0.06, 4.3), '#4a3626');
          }
          // fairy lights strung along the steps, in strands that sag
          if (hash(n * 3.7) > 0.35) {
            const y0 = 3.2 + hash(n) * 0.8;
            const cols = [[1, 0.3, 0.25], [1, 0.8, 0.3], [0.35, 1, 0.5], [0.4, 0.6, 1]];
            for (let i = 0; i <= 22; i++) {
              const t = i / 22;
              const sp = a + t * Gs;
              const p2 = at(sp, side, 6.5 + Math.sin(t * Math.PI) * 0.4, y0 + 2.2 - Math.sin(t * Math.PI) * 0.7);
              const c = cols[i % 4];
              lights.push({ p: p2, c: new THREE.Vector3(c[0], c[1], c[2]).multiplyScalar(0.8), size: 0.32, flicker: 0, glowOnly: true });
            }
          }
        } else {
          const H = 4 + Math.floor(hash(n * 2.9 + 1) * 3) * 2;
          const off = 6 + hash(n * 5.5) * 10;
          const p = at(mid, side, off + 3, 0.9 + H / 2);
          props.add(G.box, M(p, 0, 6, H, Gs - 1), PALETTE[Math.floor(hash(n * 9.1) * PALETTE.length)]);
          facade(add, lights, n * 13 + 5, mid, Gs - 1, side, off, 0.9, H, { ground: 'plinth', balcony: 0.2, tank: 0.5, detail: 0.3 });
        }
      }
    }
  }

  private build(k: number): Chunk {
    const s0 = k * CHUNK, s1 = s0 + CHUNK;
    const group = new THREE.Group();
    const lights: Light[] = [];
    const temples: number[] = [];
    const props = new Props();

    // the two banks as ribbons of cross-sections every half metre
    for (const side of [-1, 1]) {
      const pos: number[] = [], win: number[] = [], stone: number[] = [];
      const step = 0.5, rows = Math.round(CHUNK / step) + 1;
      const sections: [number, number][][] = [];
      for (let i = 0; i < rows; i++) sections.push(profile(s0 + i * step, side));
      for (let i = 0; i < rows - 1; i++) {
        const sa = s0 + i * step, sb = sa + step;
        const wa = weights(sa), wb = weights(sb);
        for (let j = 0; j < PROFILE_N - 1; j++) {
          const a0 = sections[i][j], a1 = sections[i][j + 1], b0 = sections[i + 1][j], b1 = sections[i + 1][j + 1];
          const A = at(sa, side, a0[0], a0[1]), B = at(sa, side, a1[0], a1[1]), C = at(sb, side, b0[0], b0[1]), D = at(sb, side, b1[0], b1[1]);
          // wind so the faces look at the river
          const tri = side < 0 ? [A, C, B, B, C, D] : [A, B, C, B, D, C];
          for (const v of tri) pos.push(v.x, v.y, v.z);
          for (let q = 0; q < 6; q++) {
            const w = q < 2 || q === 3 ? wa : wb;
            win.push(0);
            stone.push(side < 0 ? w[2] : w[2] * 0.6);
          }
        }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('aWin', new THREE.Float32BufferAttribute(win, 1));
      g.setAttribute('aStone', new THREE.Float32BufferAttribute(stone, 1));
      g.setAttribute('aSide', new THREE.Float32BufferAttribute(new Float32Array(stone.length).fill(side), 1));
      g.computeVertexNormals();
      const m = new THREE.Mesh(g, bankMat);
      m.frustumCulled = false;
      group.add(m);
    }

    const warm = (i: number) => new THREE.Vector3(1.0, 0.62, 0.3).multiplyScalar(i);
    const cables: number[] = [];
    const spouts: number[] = [], spoutUv: number[] = [];

    for (let s = s0; s < s1; s += 1) {
      const w = weights(s);
      const r = hash(s * 1.31 + 7);
      const hw = halfWidth(s);

      // the lane: bulbs on brackets, drainpipes pouring off the roofs, cables overhead
      if (w[0] > 0.5) {
        if (Math.floor(s) % 13 === 0) {
          const side = hash(s) > 0.5 ? 1 : -1;
          const p = at(s, side, -0.35, 3.1 + hash(s + 2) * 1.2);
          props.add(G.bulb, M(p, 0, 0.13, 0.13, 0.13), '#ffd9a0', 2.2);
          props.add(G.box, M(at(s, side, -0.18, p.y + 0.12), 0, 0.36, 0.04, 0.04), '#222');
          lights.push({ p, c: warm(1.4), size: 1.2, flicker: hash(s + 5) > 0.85 ? 1 : 0 });
        }
        if (r > 0.9) {
          const side = hash(s + 9) > 0.5 ? 1 : -1;
          const top = 4.2 + hash(s + 4) * 2.5;
          const a = at(s, side, -0.25, top), b = at(s, side, -0.55, 0);
          const d = 0.07;
          // a falling sheet of water, two crossed quads
          for (const [ox, oz] of [[d, 0], [0, d]]) {
            spouts.push(a.x - ox, a.y, a.z - oz, a.x + ox, a.y, a.z + oz, b.x + ox * 2.5, b.y, b.z + oz * 2.5,
              a.x - ox, a.y, a.z - oz, b.x + ox * 2.5, b.y, b.z + oz * 2.5, b.x - ox * 2.5, b.y, b.z - oz * 2.5);
            spoutUv.push(0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1);
          }
          props.add(G.cyl, M(at(s, side, -0.12, top + 0.2), 0, 0.12, 0.6, 0.12), '#2a2622');
        }
        if (r < 0.12) {
          const y = 4.5 + hash(s + 3) * 3.5;
          const L = at(s, -1, -0.05, y), R = at(s + (hash(s) - 0.5) * 3, 1, -0.05, y + (hash(s + 1) - 0.5));
          let prev = L;
          for (let i = 1; i <= 10; i++) {
            const t = i / 10;
            const p = L.clone().lerp(R, t); p.y -= Math.sin(t * Math.PI) * 0.45;
            cables.push(prev.x, prev.y, prev.z, p.x, p.y, p.z); prev = p;
          }
        }
      }

      // the canal: lamp posts, trees, houses set back, a bridge now and then
      if (w[1] > 0.5) {
        if (Math.floor(s) % 17 === 0) {
          const side = Math.floor(s / 17) % 2 ? 1 : -1;
          const base = at(s, side, 0.25, 1.05);
          props.add(G.cyl, M(base.clone().setY(1.05 + 2.1), 0, 0.09, 4.2, 0.09), '#1b1d22');
          const head = at(s, side, -0.45, 5.15);
          props.add(G.box, M(at(s, side, -0.1, 5.25), 0, 0.75, 0.05, 0.05), '#1b1d22');
          props.add(G.bulb, M(head, 0, 0.17, 0.12, 0.17), '#ffe1b0', 2.6);
          lights.push({ p: head, c: warm(2.0), size: 1.6, flicker: 0 });
        }
        if (r > 0.72) {
          const side = hash(s + 11) > 0.5 ? 1 : -1;
          const p = at(s, side, 1.6 + hash(s + 12) * 5, 0.75);
          const h = 3 + hash(s + 13) * 3;
          props.add(G.cyl, M(p.clone().setY(0.75 + h / 2), 0, 0.25, h, 0.25), '#16130f');
          const cs = 1.6 + hash(s + 14) * 1.6;
          props.add(G.canopy, M(p.clone().setY(0.75 + h + cs * 0.4), hash(s) * 6, cs, cs * 0.8, cs), '#0f1a12');
          props.add(G.canopy, M(p.clone().add(new THREE.Vector3(cs * 0.5, h + cs * 0.1, 0.3)), hash(s + 1) * 6, cs * 0.7, cs * 0.6, cs * 0.7), '#122015');
        }
        if (Math.floor(s) % 95 === 40) {
          const g = bridge(hw);
          const p = new THREE.Vector3(centre(s), 0, -s);
          props.add(g, M(p, 0), '#3a3430');
          for (const side of [-1, 1]) {
            const lp = new THREE.Vector3(centre(s) + side * (hw + 0.4), 4.1, -s);
            props.add(G.bulb, M(lp, 0, 0.16, 0.16, 0.16), '#ffe0a8', 2.6);
            props.add(G.cyl, M(lp.clone().setY(3.75), 0, 0.06, 0.6, 0.06), '#15161a');
            lights.push({ p: lp, c: warm(2.2), size: 1.7, flicker: 0 });
          }
        }
      }

      // the ghat: temples, parasols, lamps on the steps; the far bank's lights
      if (w[2] > 0.5) {
        if (Math.floor(s) % 46 === 8) {
          const base = at(s, -1, 10.5, 4.3);
          props.add(G.box, M(base.clone().setY(4.3 + 0.9), 0, 4.2, 1.8, 4.2), '#4a3e34');
          props.add(G.box, M(base.clone().setY(4.3 + 2.4), 0, 3.4, 1.2, 3.4), '#55473b');
          props.add(G.shikhara, M(base.clone().setY(4.3 + 3.0), 0.3), '#5c4b3d');
          props.add(G.amalaka, M(base.clone().setY(4.3 + 10.4), 0, 1, 1, 1), '#5c4b3d');
          props.add(G.cyl, M(base.clone().setY(4.3 + 11.4), 0, 0.03, 1.8, 0.03), '#222');
          props.add(G.box, M(base.clone().add(new THREE.Vector3(0.35, 11.9, 0)), 0, 0.7, 0.4, 0.02), '#a2421c');
          const door = at(s, -1, 8.35, 5.2);
          props.add(G.box, M(door, 0, 0.05, 1.3, 0.8), '#ffb860', 2.4);
          lights.push({ p: door.clone().setX(door.x + 0.6), c: warm(3.2), size: 2.4, flicker: 1 });
          temples.push(s);
        }
        if (r > 0.86) {
          const k = Math.floor(hash(s + 21) * 9);
          const p = at(s, -1, k * 0.85 + 0.45, 0.1 + k * 0.42 + 0.01);
          const flame = p.clone().setY(p.y + 0.12);
          props.add(G.bulb, M(flame, 0, 0.05, 0.08, 0.05), '#ffc070', 3);
          lights.push({ p: flame, c: warm(0.9), size: 0.7, flicker: 1 });
        }
        if (Math.floor(s) % 11 === 3) {
          const k = 10 + Math.floor(hash(s + 30) * 3);
          const p = at(s, -1, Math.min(k, 10.5) * 0.85 + 0.3, 4.3);
          props.add(G.cyl, M(p.clone().setY(4.3 + 1.2), 0, 0.07, 2.4, 0.07), '#2b2520');
          props.add(G.cone, M(p.clone().setY(4.3 + 2.55), hash(s) * 3, 1.7, 0.65, 1.7), hash(s + 31) > 0.5 ? '#6b5a3c' : '#5a3f35');
        }
        if (r > 0.55) {
          const p = at(s, 1, 6 + hash(s + 50) * 40, 1.2 + hash(s + 51) * 3);
          lights.push({ p, c: warm(0.5 + hash(s + 52)).multiplyScalar(0.7), size: 0.9 + hash(s + 53), flicker: 0 });
        }
      }

      // open water: only the far shore, pricked with lights
      if (w[3] > 0.5 && r > 0.6) {
        const side = hash(s + 60) > 0.5 ? 1 : -1;
        const p = at(s, side, 2 + hash(s + 61) * 30, 0.8 + hash(s + 62) * 2);
        lights.push({ p, c: warm(0.4 + hash(s + 63) * 0.5), size: 1 + hash(s + 64), flicker: 0 });
      }
    }

    this.streets(s0, s1, props, lights);

    const pg = props.build();
    if (pg) { const m = new THREE.Mesh(pg, propMat); m.frustumCulled = false; group.add(m); }
    if (cables.length) {
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(cables, 3));
      const l = new THREE.LineSegments(g, cableMat); l.frustumCulled = false; group.add(l);
    }
    if (spouts.length) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(spouts, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(spoutUv, 2));
      const m = new THREE.Mesh(g, spoutMat); m.frustumCulled = false; m.renderOrder = 2; group.add(m);
    }
    void STARTS; void hash2;
    return { group, lights, temples };
  }
}

/** wall heights either side at s, for the water's reflections */
export function wallHeights(s: number): [number, number] {
  const top = (p: [number, number][]) => p.reduce((m, q) => (q[0] < 12 ? Math.max(m, q[1]) : m), 0);
  return [top(profile(s, -1)), top(profile(s, 1))];
}
