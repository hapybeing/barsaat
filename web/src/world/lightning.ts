import * as THREE from 'three';
import { mat } from './common';

// Bolts are grown by midpoint displacement with forks, drawn as camera-facing ribbons, and
// restrike two or three times the way real lightning flickers along one channel.
export class Lightning {
  mesh: THREE.Mesh;
  private geo = new THREE.BufferGeometry();
  private life = 0;
  private strobes: number[] = [];
  flash = 0;
  dir = new THREE.Vector3(0, 1, -1);
  distance = 1;
  private uA = { value: 0 };

  constructor() {
    const m = mat({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { uA: this.uA },
      vertex: /* glsl */ `
        attribute float aW;
        varying float vW;
        void main() { vW = aW; gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); }`,
      fragment: /* glsl */ `
        uniform float uA;
        varying float vW;
        void main() {
          float core = smoothstep(1.0, 0.0, abs(vW));
          vec3 c = mix(vec3(0.55, 0.5, 1.0), vec3(1.0), core * core);
          gl_FragColor = vec4(c * core * uA, 1.0);
        }`,
    });
    this.mesh = new THREE.Mesh(this.geo, m);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = -5;
    this.mesh.visible = false;
  }

  strike(cam: THREE.Vector3, forward: THREE.Vector3) {
    // somewhere ahead and to one side, 120-320 m away
    const ang = (Math.random() - 0.5) * 1.6;
    const dist = 120 + Math.random() * 200;
    const f = forward.clone().setY(0).normalize();
    const side = new THREE.Vector3(-f.z, 0, f.x);
    const ground = cam.clone().addScaledVector(f, Math.cos(ang) * dist).addScaledVector(side, Math.sin(ang) * dist).setY(-2);
    const top = ground.clone().add(new THREE.Vector3((Math.random() - 0.5) * 60, 110 + Math.random() * 40, (Math.random() - 0.5) * 60));
    this.distance = dist / 340;  // seconds-ish of thunder delay, scaled
    this.dir.copy(top).sub(cam).normalize();

    const segs: [THREE.Vector3, THREE.Vector3, number][] = [];
    const grow = (a: THREE.Vector3, b: THREE.Vector3, w: number, depth: number, rough: number) => {
      if (depth === 0) { segs.push([a, b, w]); return; }
      const mid = a.clone().lerp(b, 0.5);
      const len = a.distanceTo(b);
      mid.add(new THREE.Vector3((Math.random() - 0.5), (Math.random() - 0.5) * 0.4, (Math.random() - 0.5)).multiplyScalar(len * rough));
      grow(a, mid, w, depth - 1, rough);
      grow(mid, b, w, depth - 1, rough);
      if (depth >= 3 && Math.random() < 0.3) {
        const fork = mid.clone().add(b.clone().sub(mid).applyAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() - 0.5) * 2).multiplyScalar(0.6 + Math.random() * 0.4));
        fork.y = Math.min(fork.y, mid.y - 5);
        grow(mid, fork, w * 0.45, depth - 2, rough * 1.1);
      }
    };
    grow(top, ground, 1, 7, 0.32);

    const pos: number[] = [], wv: number[] = [];
    const toCam = new THREE.Vector3();
    for (const [a, b, w] of segs) {
      toCam.copy(cam).sub(a).normalize();
      const d = b.clone().sub(a).normalize();
      const s = new THREE.Vector3().crossVectors(d, toCam).normalize().multiplyScalar(0.9 * w + 0.25);
      const A0 = a.clone().add(s), A1 = a.clone().sub(s), B0 = b.clone().add(s), B1 = b.clone().sub(s);
      pos.push(A0.x, A0.y, A0.z, A1.x, A1.y, A1.z, B0.x, B0.y, B0.z, A1.x, A1.y, A1.z, B1.x, B1.y, B1.z, B0.x, B0.y, B0.z);
      wv.push(1, -1, 1, -1, -1, 1);
    }
    this.geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    this.geo.setAttribute('aW', new THREE.Float32BufferAttribute(wv, 1));
    this.life = 0;
    this.strobes = [0, 0.07 + Math.random() * 0.05, 0.19 + Math.random() * 0.1];
    if (Math.random() < 0.5) this.strobes.push(0.36 + Math.random() * 0.1);
    this.mesh.visible = true;
  }

  update(dt: number, gentle: boolean) {
    this.life += dt;
    let a = 0;
    for (const t0 of this.strobes) { const x = this.life - t0; if (x >= 0) a = Math.max(a, Math.exp(-x * 22)); }
    const end = this.strobes.length ? this.strobes[this.strobes.length - 1] + 0.4 : 0;
    if (this.life > end) this.mesh.visible = false;
    this.uA.value = a * 2.2;
    const target = a * (gentle ? 0.35 : 1.0);
    this.flash = Math.max(target, this.flash - dt * 3.5);
  }
}
