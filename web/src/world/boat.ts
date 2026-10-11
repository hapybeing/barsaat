import * as THREE from 'three';
import { mat } from './common';

// The boat is folded from the very page the visitor wrote on. Every vertex knows two places:
// where it sits on the flat sheet, and where it sits on the boat. The fold is a staggered,
// arcing blend between the two, so the writing travels with the paper.

export const SHEET_W = 0.62;
export const SHEET_H = 0.8;

type PatchFn = (s: number, t: number) => [number, number, number];

function patch(nS: number, nT: number, v0: number, v1: number, fn: PatchFn, flipT: boolean, out: { flat: number[]; boat: number[]; uv: number[]; delay: number[]; idx: number[] }) {
  const start = out.flat.length / 3;
  for (let j = 0; j <= nT; j++) for (let i = 0; i <= nS; i++) {
    const s = i / nS, t = j / nT;
    const v = flipT ? v1 - t * (v1 - v0) : v0 + t * (v1 - v0);
    const u = s;
    out.uv.push(u, v);
    out.flat.push((u - 0.5) * SHEET_W, (v - 0.5) * SHEET_H, 0);
    const p = fn(s, t);
    out.boat.push(p[0], p[1], p[2]);
    // outer strips fold first, the middle (the sail) last
    out.delay.push(Math.min(1, Math.abs(v - 0.5) * 2) * -0.35 + 0.35 + Math.abs(u - 0.5) * 0.12);
  }
  for (let j = 0; j < nT; j++) for (let i = 0; i < nS; i++) {
    const a = start + j * (nS + 1) + i, b = a + 1, c = a + nS + 1, d = c + 1;
    out.idx.push(a, b, c, b, d, c);
  }
}

export function makeBoat(tex: THREE.Texture) {
  const out = { flat: [] as number[], boat: [] as number[], uv: [] as number[], delay: [] as number[], idx: [] as number[] };
  const L = 0.3, l = 0.14, H = 0.13, Z = 0.085;
  // near hull: bottom strip of the page
  patch(16, 5, 0.0, 0.3, (s, t) => {
    const half = l + (L - l) * t;
    const bulge = Math.sin(s * Math.PI) * 0.012 * t;
    return [(s - 0.5) * 2 * half, t * H, t * Z + bulge];
  }, false, out);
  // near sail: the middle of the page, where people write
  patch(16, 8, 0.3, 0.65, (s, t) => {
    const half = 0.2 * (1 - t);
    return [(s - 0.5) * 2 * half, H + t * 0.24, 0.042 * (1 - t) + 0.002];
  }, false, out);
  // far sail
  patch(16, 5, 0.65, 0.82, (s, t) => {
    const half = 0.2 * t;
    return [(s - 0.5) * 2 * half, H + (1 - t) * 0.24, -0.042 * t - 0.002];
  }, false, out);
  // far hull
  patch(16, 5, 0.82, 1.0, (s, t) => {
    const k = 1 - t;
    const half = l + (L - l) * (1 - k);
    return [(s - 0.5) * 2 * half, (1 - k) * H, -(1 - k) * Z];
  }, true, out);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(out.flat, 3));
  geo.setAttribute('aBoat', new THREE.Float32BufferAttribute(out.boat, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(out.uv, 2));
  geo.setAttribute('aDelay', new THREE.Float32BufferAttribute(out.delay, 1));
  geo.setIndex(out.idx);

  const uniforms = { uFold: { value: 0 }, uTex: { value: tex }, uSoak: { value: 0 }, uGlow: { value: 0 }, uUnlit: { value: 1 } };
  const m = mat({
    uniforms,
    side: THREE.DoubleSide,
    vertex: /* glsl */ `
      attribute vec3 aBoat;
      attribute float aDelay;
      uniform float uFold;
      varying vec2 vUv; varying vec3 vW; varying vec3 vLocal;
      void main() {
        float e = clamp((uFold - aDelay) / 0.65, 0.0, 1.0);
        e = e * e * (3.0 - 2.0 * e);
        vec3 p = mix(position, aBoat, e);
        // paper lifts and curls as it travels
        p.z += sin(e * 3.14159) * (0.08 + 0.1 * abs(uv.y - 0.5));
        p.y += sin(e * 3.14159) * 0.04 * sin(uv.x * 6.0);
        vUv = uv; vLocal = p;
        vec4 w = modelMatrix * vec4(p, 1.0);
        vW = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragment: /* glsl */ `
      uniform sampler2D uTex;
      uniform float uSoak;
      uniform float uGlow;
      uniform float uUnlit;
      varying vec2 vUv; varying vec3 vW; varying vec3 vLocal;
      void main() {
        vec3 paper = texture2D(uTex, vUv).rgb;
        vec3 n = normalize(cross(dFdx(vW), dFdy(vW)));
        vec3 V = normalize(cameraPosition - vW);
        if (dot(n, V) < 0.0) n = -n;
        // soaking: the waterline creeps up the hull, wet paper darkens and goes translucent
        float wetLine = 0.03 + uSoak * 0.11 + 0.01 * sin(vLocal.x * 30.0 + uTime * 2.0);
        float wet = max(smoothstep(wetLine + 0.02, wetLine - 0.01, vLocal.y), uSoak * 0.35);
        vec3 alb = mix(paper, paper * vec3(0.55, 0.58, 0.62), wet);
        // paper always reads as paper: a cool fill from the sky on top of whatever lamps are near
        vec3 lit = uAmbient * 2.2 + vec3(0.2, 0.2, 0.24) + vec3(0.6, 0.6, 0.8) * uFlash * 0.9;
        lit += pointLights(vW, n) * 1.4;
        // light through thin paper from the lamps you carry
        lit += vec3(1.0, 0.6, 0.3) * uGlow * (0.5 + 0.5 * (1.0 - abs(dot(n, V))));
        vec3 col = alb * lit;
        col = mix(col, paper * 0.96, uUnlit);
        col = applyFog(col, length(cameraPosition - vW) * (1.0 - uUnlit));
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(geo, m);
  mesh.frustumCulled = false;
  return { mesh, uniforms };
}
