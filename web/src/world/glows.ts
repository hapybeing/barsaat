import * as THREE from 'three';
import { mat } from './common';

// Soft halos for every light source: the rain-scattered bloom around a bulb, without a
// post-processing pass. One draw call per set.
export class Glows {
  mesh: THREE.Mesh;
  private geo: THREE.InstancedBufferGeometry;
  private pos: Float32Array; private col: Float32Array; private size: Float32Array; private flick: Float32Array;
  private aPos: THREE.InstancedBufferAttribute; private aCol: THREE.InstancedBufferAttribute;
  private aSize: THREE.InstancedBufferAttribute; private aFlick: THREE.InstancedBufferAttribute;
  count = 0;

  constructor(public max: number, flame = false) {
    const base = new THREE.PlaneGeometry(1, 1);
    this.geo = new THREE.InstancedBufferGeometry();
    this.geo.index = base.index;
    this.geo.setAttribute('position', base.getAttribute('position'));
    this.geo.setAttribute('uv', base.getAttribute('uv'));
    this.pos = new Float32Array(max * 3); this.col = new Float32Array(max * 3);
    this.size = new Float32Array(max); this.flick = new Float32Array(max);
    this.aPos = new THREE.InstancedBufferAttribute(this.pos, 3); this.aCol = new THREE.InstancedBufferAttribute(this.col, 3);
    this.aSize = new THREE.InstancedBufferAttribute(this.size, 1); this.aFlick = new THREE.InstancedBufferAttribute(this.flick, 1);
    for (const a of [this.aPos, this.aCol, this.aSize, this.aFlick]) a.setUsage(THREE.DynamicDrawUsage);
    this.geo.setAttribute('aPos', this.aPos); this.geo.setAttribute('aCol', this.aCol);
    this.geo.setAttribute('aSize', this.aSize); this.geo.setAttribute('aFlick', this.aFlick);
    this.geo.instanceCount = 0;
    const m = mat({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uFlame: { value: flame ? 1 : 0 } },
      vertex: /* glsl */ `
        attribute vec3 aPos; attribute vec3 aCol; attribute float aSize; attribute float aFlick;
        uniform float uFlame;
        varying vec2 vUv; varying vec3 vC; varying float vF;
        void main() {
          vec4 mv = viewMatrix * vec4(aPos, 1.0);
          float fl = 1.0 + aFlick * (0.18 * sin(uTime * 17.0 + aPos.x * 9.0) + 0.12 * sin(uTime * 31.0 + aPos.z * 5.0));
          vec2 sz = vec2(1.0, mix(1.0, 1.9, uFlame)) * aSize * fl;
          // flames grow toward the camera's up; halos are round
          mv.xy += position.xy * sz + vec2(0.0, uFlame * sz.y * 0.35);
          vUv = uv; vC = aCol; vF = fl;
          float d = -mv.z;
          vC *= 1.0 - smoothstep(170.0, 230.0, d);
          gl_Position = projectionMatrix * mv;
        }`,
      fragment: /* glsl */ `
        uniform float uFlame;
        varying vec2 vUv; varying vec3 vC; varying float vF;
        void main() {
          vec2 q = vUv - 0.5;
          float a;
          vec3 c = vC;
          if (uFlame > 0.5) {
            // a teardrop flame with a hot core
            q.y += 0.1;
            float r = length(q * vec2(1.0, 0.55 + (q.y + 0.5) * 0.9));
            a = smoothstep(0.32, 0.0, r);
            c = mix(c, vec3(1.0, 0.95, 0.8), smoothstep(0.12, 0.0, r));
          } else {
            float r = length(q) * 2.0;
            a = exp(-r * r * 9.0) * 0.9 + exp(-r * 3.5) * 0.25;
            a *= 1.0 - smoothstep(0.85, 1.0, r);
            // rain scatters more light into the halo
            a *= 0.7 + uRain * 0.5;
          }
          // in the fog, halos dim slower than the lamps themselves
          gl_FragColor = vec4(c * a, 1.0);
        }`,
    });
    this.mesh = new THREE.Mesh(this.geo, m);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 8;
  }

  begin() { this.count = 0; }
  push(p: THREE.Vector3, c: THREE.Vector3, size: number, flicker: number) {
    if (this.count >= this.max) return;
    const i = this.count++;
    this.pos[i * 3] = p.x; this.pos[i * 3 + 1] = p.y; this.pos[i * 3 + 2] = p.z;
    this.col[i * 3] = c.x; this.col[i * 3 + 1] = c.y; this.col[i * 3 + 2] = c.z;
    this.size[i] = size; this.flick[i] = flicker;
  }
  end() {
    this.geo.instanceCount = this.count;
    for (const a of [this.aPos, this.aCol, this.aSize, this.aFlick]) a.needsUpdate = true;
  }
}
