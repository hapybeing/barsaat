import * as THREE from 'three';
import { mat } from './common';

// The city beyond the banks: two rings of building silhouettes around the camera, with lit
// windows, water tanks on the roofs and a red light blinking on the odd tower. Drawn in one
// shader on an open cylinder, and shared with the water so the skyline reflects.

export const skylineGLSL = /* glsl */ `
// height (in elevation units) and look of the skyline in direction d; returns vec4(col, cover)
vec4 skyline(vec3 d, float far) {
  float a = atan(d.z, d.x);
  float el = d.y / length(d.xz);
  vec4 res = vec4(0.0);
  for (int layer = 0; layer < 2; layer++) {
    float L = float(layer);
    float R = mix(260.0, 420.0, L);
    float x = a * R;                   // metres along the ring
    float w = mix(14.0, 22.0, L);
    float id = floor(x / w);
    float hb = hash1(id * 1.7 + L * 31.0);
    float h = (8.0 + hb * hb * 46.0 + step(0.93, hb) * 30.0) * mix(1.0, 0.8, L) * far;
    // stepped tops and a water tank on some roofs
    float fx = fract(x / w);
    h -= step(0.5, hash1(id + 3.3)) * step(0.62, fx) * 4.0;
    float tank = step(0.55, hash1(id + 9.1)) * step(abs(fx - 0.3), 0.05) * 1.8;
    float gap = step(0.04, fx) * step(fx, 0.97);
    float top = (h + tank * gap) / R;
    if (el < top * gap && res.a < 0.5) {
      float y = el * R;
      vec2 g = vec2(x / 2.6, y / 3.0);
      vec2 gi = floor(g);
      vec2 gf = fract(g);
      float lit = step(0.72, hash21(gi + id + L * 13.0)) * step(0.3, gf.x) * step(gf.x, 0.75) * step(0.3, gf.y) * step(gf.y, 0.8);
      vec3 base = mix(vec3(0.022, 0.022, 0.03), vec3(0.035, 0.032, 0.04), L) * (1.0 + uFlash * 2.0);
      vec3 wc = mix(vec3(1.0, 0.62, 0.3), vec3(0.8, 0.9, 1.0), step(0.85, hash21(gi + 5.0)));
      vec3 c = base + wc * lit * 0.55 * mix(1.0, 0.6, L);
      // aircraft light on tall towers
      float tall = step(0.93, hb);
      c += vec3(1.0, 0.1, 0.05) * tall * step(abs(fx - 0.5), 0.03) * step(top - 0.6 / R, el) * step(0.5, fract(uTime * 0.5 + id * 0.37)) * 3.0;
      res = vec4(c, 1.0);
    }
  }
  return res;
}
`;

export function makeSkyline() {
  const geo = new THREE.CylinderGeometry(250, 250, 140, 96, 1, true);
  geo.translate(0, 68, 0);
  const uniforms = { uFar: { value: 1 } };
  const m = mat({
    uniforms,
    side: THREE.BackSide,
    transparent: false,
    vertex: /* glsl */ `
      varying vec3 vRel; varying vec3 vW;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vW = w.xyz;
        vRel = w.xyz - cameraPosition;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragment: /* glsl */ `
      uniform float uFar;
      varying vec3 vRel; varying vec3 vW;
      ${skylineGLSL}
      void main() {
        vec3 d = normalize(vRel);
        vec4 s = skyline(d, uFar);
        if (s.a < 0.5) discard;
        // haze: the skyline sits in the fog, glowing faintly where the town's light is
        float haze = mix(0.62, 0.35, uClear);
        vec3 col = mix(s.rgb, uFogColor * (1.0 + uFlash * 0.8), haze - min(0.25, s.r * 0.4));
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(geo, m);
  mesh.frustumCulled = false;
  mesh.renderOrder = -8;
  return { mesh, uniforms };
}
