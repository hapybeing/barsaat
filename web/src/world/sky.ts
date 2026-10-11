import * as THREE from 'three';
import { mat } from './common';

// A dome that follows the camera. Storm clouds lit from below by the town and from inside by
// lightning; when the storm clears they tear open onto stars and a low moon.
export function makeSky() {
  const geo = new THREE.SphereGeometry(450, 48, 24);
  const m = mat({
    side: THREE.BackSide,
    depthWrite: false,
    vertex: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_Position = p.xyww;
      }`,
    fragment: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vec3 d = normalize(vDir);
        float h = d.y;
        // night gradient: sodium glow at the horizon, ink at the zenith
        vec3 zen = mix(vec3(0.035, 0.04, 0.075), vec3(0.02, 0.03, 0.07), uClear);
        vec3 hor = mix(vec3(0.20, 0.15, 0.17), vec3(0.09, 0.10, 0.17), uClear);
        vec3 col = mix(hor, zen, smoothstep(-0.02, 0.45, h));

        // clouds on a plane above us
        vec2 uv = d.xz / max(h + 0.12, 0.05) * 0.9;
        uv += vec2(uTime * 0.012, uTime * 0.02);
        float c = fbm(uv * 1.3) * 0.65 + fbm(uv * 3.1 + 4.0) * 0.35;
        float cover = mix(0.25, 0.92, uClear);
        float cl = smoothstep(cover - 0.2, cover + 0.25, c);
        float under = 0.35 + 0.65 * fbm(uv * 2.0 - 3.0);
        vec3 cloud = mix(vec3(0.07, 0.065, 0.085), vec3(0.28, 0.2, 0.2), (1.0 - smoothstep(0.0, 0.5, h)) * under);
        // lightning lights the clouds from inside, strongest toward the bolt
        float toward = pow(max(dot(normalize(d), normalize(uFlashDir)), 0.0), 3.0);
        cloud += vec3(0.62, 0.62, 0.85) * uFlash * (0.25 + 1.4 * toward) * under;
        col = mix(col, cloud, cl * smoothstep(-0.05, 0.05, h));

        // stars and the moon, only through gaps once it clears
        float gap = (1.0 - cl) * uClear;
        vec2 sg = d.xz / (h + 0.3) * 160.0;
        vec2 cell = floor(sg);
        float r = hash21(cell);
        float star = step(0.985, r) * smoothstep(0.5, 0.05, length(fract(sg) - 0.5 - (vec2(hash21(cell + 3.1), hash21(cell + 7.7)) - 0.5) * 0.6));
        star *= 0.5 + 0.5 * sin(uTime * (1.0 + r * 4.0) + r * 40.0);
        col += vec3(0.85, 0.88, 1.0) * star * gap * smoothstep(0.05, 0.3, h) * 1.4;
        vec3 moonDir = normalize(vec3(-0.45, 0.22, -1.0));
        float md = dot(d, moonDir);
        col += vec3(1.0, 0.95, 0.85) * smoothstep(0.99955, 0.99975, md) * uClear * (0.4 + 0.6 * (1.0 - cl));
        col += vec3(0.35, 0.38, 0.5) * pow(max(md, 0.0), 180.0) * uClear * 0.6;
        col += vec3(0.12, 0.13, 0.2) * pow(max(md, 0.0), 12.0) * uClear * 0.35;

        // haze toward the horizon joins the fog
        col = mix(col, uFogColor * (1.0 + uFlash * 0.6), smoothstep(0.18, -0.03, h) * 0.9);
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(geo, m);
  mesh.frustumCulled = false;
  mesh.renderOrder = -10;
  return mesh;
}
