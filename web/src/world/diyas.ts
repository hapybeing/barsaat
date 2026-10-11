import * as THREE from 'three';
import { mat } from './common';
import { centre, halfWidth, hash, STARTS, END } from './path';

// Clay lamps. Dark ones float in the boat's way; steer close and they catch, then fall in
// behind you. By the open water you are leading a procession of your own lights.
// Lit lamps released from the ghat drift past on the current.

export type Diya = {
  x: number; z: number; y: number;
  state: 0 | 1 | 2 | 3; // 0 dark, 1 catching, 2 following the boat, 3 drifting lit
  t: number;            // time in state
  k: number;            // place in the procession
  seed: number;
  vx: number; vz: number;
};

const SPACING = 0.46;

export class Diyas {
  list: Diya[] = [];
  following = 0;
  bowls: THREE.InstancedMesh;
  private nextDark = STARTS[1] - 30;
  private nextFree = STARTS[2] - 20;
  private m4 = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private v = new THREE.Vector3();
  private sc = new THREE.Vector3();
  onCatch: (d: Diya) => void = () => {};

  constructor(public max = 260) {
    const pts = [new THREE.Vector2(0.0, 0), new THREE.Vector2(0.05, 0.0), new THREE.Vector2(0.075, 0.025), new THREE.Vector2(0.08, 0.045), new THREE.Vector2(0.06, 0.04), new THREE.Vector2(0.0, 0.03)];
    const g = new THREE.LatheGeometry(pts, 10);
    const m = mat({
      vertex: /* glsl */ `
        varying vec3 vW; varying vec3 vN;
        void main() {
          vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
          vW = w.xyz; vN = normalize(mat3(modelMatrix * instanceMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragment: /* glsl */ `
        varying vec3 vW; varying vec3 vN;
        void main() {
          vec3 n = normalize(vN);
          vec3 alb = vec3(0.42, 0.2, 0.11);
          vec3 lit = uAmbient * 1.4 + pointLights(vW, n) * 1.6 + uFlash * 0.5;
          gl_FragColor = vec4(applyFog(alb * lit, length(cameraPosition - vW)), 1.0);
        }`,
    });
    this.bowls = new THREE.InstancedMesh(g, m, max);
    this.bowls.frustumCulled = false;
    this.bowls.count = 0;
  }

  reset() {
    this.list = []; this.following = 0;
    this.nextDark = STARTS[1] - 30; this.nextFree = STARTS[2] - 20;
  }

  /** spawn ahead of the boat as it goes */
  spawn(s: number) {
    while (this.nextDark < s + 120 && this.nextDark < END + 60) {
      const z = this.nextDark;
      const hw = halfWidth(z);
      const reach = Math.min(hw * 0.72, 4.2);
      // sometimes in little clusters, so a good line catches several
      const n = hash(z * 3.1) > 0.75 ? 3 : 1;
      const u0 = (hash(z * 1.7) * 2 - 1) * reach;
      for (let i = 0; i < n; i++) this.add({ x: centre(z) + u0 + (i - 1) * 0.5, z: -(z + i * 1.4), y: 0, state: 0, t: 0, k: 0, seed: hash(z + i), vx: 0, vz: 0 });
      this.nextDark += 7 + hash(z * 5.3) * 7;
    }
    while (this.nextFree < s + 160 && this.nextFree < STARTS[3] + 40) {
      const z = this.nextFree;
      const hw = halfWidth(z);
      this.add({ x: centre(z) + (hash(z * 2.9) * 2 - 1) * hw * 0.85, z: -z, y: 0, state: 3, t: 0, k: 0, seed: hash(z * 7.7), vx: 0, vz: -0.9 - hash(z) * 0.6 });
      this.nextFree += 1.6 + hash(z * 4.1) * 2.5;
    }
  }

  private add(d: Diya) {
    if (this.list.length >= this.max) {
      // recycle the oldest one that isn't following us
      const i = this.list.findIndex(o => o.state !== 2 && o.state !== 1);
      if (i < 0) return;
      this.list.splice(i, 1);
    }
    this.list.push(d);
  }

  update(dt: number, s: number, boat: THREE.Vector3, trail: (dist: number) => THREE.Vector3, time: number) {
    const keep: Diya[] = [];
    for (const d of this.list) {
      d.t += dt;
      if (d.state === 0 || d.state === 3) {
        // drift on the current, bob on the chop
        d.x += d.vx * dt; d.z += d.vz * dt;
        const dz = -d.z;
        const c = centre(dz), hw = halfWidth(dz) - 0.25;
        if (d.x > c + hw) d.x = c + hw; if (d.x < c - hw) d.x = c - hw;
        if (d.state === 0) {
          const dx = d.x - boat.x, dzz = d.z - boat.z;
          if (dx * dx + dzz * dzz < 0.85 * 0.85) { d.state = 1; d.t = 0; d.k = this.following++; this.onCatch(d); }
        }
      } else {
        // catching, then sliding into place in the line behind the boat
        const target = trail(0.55 + d.k * SPACING);
        const sway = Math.sin(time * 0.9 + d.k * 0.7) * Math.min(0.25, d.k * 0.02);
        const tx = target.x + sway, tz = target.z;
        const ease = 1 - Math.exp(-dt * (d.state === 1 ? 2.5 : 5));
        d.x += (tx - d.x) * ease; d.z += (tz - d.z) * ease;
        if (d.state === 1 && d.t > 1.2) d.state = 2;
      }
      d.y = 0.008 + Math.sin(time * 1.7 + d.seed * 30) * 0.01;
      if (-d.z > s - 40 || d.state === 2 || d.state === 1) keep.push(d);
    }
    this.list = keep;

    let i = 0;
    for (const d of this.list) {
      if (i >= this.max) break;
      this.q.setFromAxisAngle(this.v.set(Math.sin(d.seed * 9), 0, Math.cos(d.seed * 9)).normalize(), Math.sin(time * 1.3 + d.seed * 20) * 0.08);
      this.m4.compose(this.v.set(d.x, d.y, d.z), this.q, this.sc.set(1, 1, 1));
      this.bowls.setMatrixAt(i++, this.m4);
    }
    this.bowls.count = i;
    this.bowls.instanceMatrix.needsUpdate = true;
  }

  /** how bright a lamp's flame is, 0..1 */
  flame(d: Diya) {
    if (d.state === 0) return 0;
    if (d.state === 1) return Math.min(1, d.t / 0.6);
    return 1;
  }
}
