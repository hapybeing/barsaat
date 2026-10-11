import * as THREE from 'three';
import { mat } from './common';

// Rain as streaks in a box that wraps around the camera. Each instance is a camera-facing
// sliver; the vertex shader does all the motion, so the CPU cost is zero.
export function makeRain(max = 5000) {
  const base = new THREE.PlaneGeometry(1, 1);
  base.translate(0, -0.5, 0);
  const geo = new THREE.InstancedBufferGeometry();
  geo.index = base.index;
  geo.setAttribute('position', base.getAttribute('position'));
  geo.setAttribute('uv', base.getAttribute('uv'));
  const seed = new Float32Array(max * 4);
  for (let i = 0; i < max; i++) {
    seed[i * 4] = Math.random(); seed[i * 4 + 1] = Math.random(); seed[i * 4 + 2] = Math.random(); seed[i * 4 + 3] = Math.random();
  }
  geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seed, 4));
  geo.instanceCount = max;
  const uniforms = { uWind: { value: new THREE.Vector2(0.15, 0.0) }, uBox: { value: new THREE.Vector3(26, 16, 34) }, uVel: { value: new THREE.Vector3() } };
  const m = mat({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertex: /* glsl */ `
      attribute vec4 aSeed;
      uniform vec2 uWind;
      uniform vec3 uBox;
      uniform vec3 uVel;
      varying float vA;
      varying vec2 vUv;
      void main() {
        float speed = 9.0 + aSeed.w * 3.0;
        vec3 fall = vec3(uWind.x, -1.0, uWind.y) * speed;
        // relative to the camera, the boat's motion adds to the slant
        vec3 rel = fall - uVel;
        vec3 shift = vec3(0.0, 0.0, -uBox.z * 0.25); // more of the box ahead of us
        vec3 p = aSeed.xyz * uBox + fall * uTime - cameraPosition - shift;
        p = mod(p, uBox) - uBox * 0.5 + shift;
        vec3 world = cameraPosition + p;
        float len = 0.28 + 0.18 * aSeed.w;
        vec3 dir = normalize(rel);
        vec3 toCam = normalize(cameraPosition - world);
        vec3 side = normalize(cross(dir, toCam)) * 0.012 * (1.0 + length(p) * 0.04);
        vec3 pos = world + side * (position.x * 2.0) - dir * position.y * len;
        vA = smoothstep(0.6, 2.2, length(p)) * (1.0 - smoothstep(10.0, 17.0, length(p)));
        vA *= step(world.y, 14.0) * step(-0.05, world.y);
        vUv = uv;
        gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
      }`,
    fragment: /* glsl */ `
      varying float vA;
      varying vec2 vUv;
      void main() {
        float a = vA * smoothstep(0.0, 0.5, vUv.y) * (1.0 - abs(vUv.x - 0.5) * 2.0);
        vec3 c = (uAmbient * 2.2 + vec3(0.5, 0.45, 0.4) * 0.25 + uFlash * 1.2);
        gl_FragColor = vec4(c * a * 0.55, 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(geo, m);
  mesh.frustumCulled = false;
  mesh.renderOrder = 5;
  return { mesh, geo, uniforms, max };
}
