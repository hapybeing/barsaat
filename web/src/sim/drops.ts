// Rain on a window pane, simulated on the CPU in CSS pixels.
// Small drops cling. A drop that grows past its critical size slides, swallowing what it meets
// and leaving a trail of tiny beads, then stalls when friction wins. That stop-start
// stutter is what makes it read as real water rather than a particle effect.

export interface Drop {
  x: number; y: number;
  r: number;          // radius, px
  vy: number;         // px/s
  vx: number;
  stall: number;      // seconds left stuck
  trail: number;      // px travelled since last trail bead
  seed: number;
  dead: boolean;
}

export interface Stamp { x: number; y: number; rx: number; ry: number }

const MAX_DROPS = 520;

export class Rain {
  drops: Drop[] = [];
  beads: Stamp[] = [];      // micro-beads to stamp into the persistent bead layer this frame
  erase: Stamp[] = [];      // paths that wipe beads (runners and the finger)
  w = 1; h = 1;
  scale = 1;                // drop size scale for the screen
  private spawnAcc = 0;
  private beadAcc = 0;
  private grid = new Map<number, Drop[]>();

  resize(w: number, h: number) {
    this.w = w; this.h = h;
    this.scale = Math.min(1.25, Math.max(0.75, Math.sqrt(w * h) / 1000));
    this.drops = this.drops.filter(d => d.x < w && d.y < h);
  }

  /** intensity 0..1, size 0..1 (bigger drops in a downpour) */
  step(dt: number, intensity: number, size: number, wind: number) {
    this.beads.length = 0;
    this.erase.length = 0;
    const s = this.scale;
    const area = (this.w * this.h) / 1e6;

    // new drops land on the glass
    this.spawnAcc += dt * intensity * intensity * 30 * area + dt * intensity * 6 * area;
    while (this.spawnAcc >= 1 && this.drops.length < MAX_DROPS) {
      this.spawnAcc -= 1;
      const big = Math.random() < 0.12 + size * 0.14;
      const r = (big ? 3 + Math.random() * (3.5 + size * 4) : 1.6 + Math.random() * 2.2) * s;
      this.drops.push({ x: Math.random() * this.w, y: Math.random() * this.h * 1.02 - this.h * 0.02, r, vy: 0, vx: 0, stall: Math.random() * 0.6, trail: 0, seed: Math.random(), dead: false });
    }
    if (this.spawnAcc > 4) this.spawnAcc = 0;

    // fine mist of micro-beads settling everywhere
    this.beadAcc += dt * (0.15 + intensity) * 260 * area;
    while (this.beadAcc >= 1) {
      this.beadAcc -= 1;
      const r = (0.6 + Math.random() * 1.4) * s;
      this.beads.push({ x: Math.random() * this.w, y: Math.random() * this.h, rx: r, ry: r });
    }

    const crit = 4.2 * s;
    for (const d of this.drops) {
      if (d.dead) continue;
      if (d.r > crit) {
        if (d.stall > 0) {
          d.stall -= dt;
          d.vy *= 0.5;
        } else {
          const g = 900 * (d.r - crit) / crit + 60;
          d.vy = Math.min(d.vy + g * dt, 140 + d.r * 40);
          // friction: random catches on the glass
          if (Math.random() < dt * (2.2 - Math.min(2, d.r / crit))) d.stall = 0.08 + Math.random() * 0.5;
        }
        d.vx += ((Math.sin(d.y * 0.05 + d.seed * 20) * 30) + wind * 40 - d.vx) * Math.min(1, dt * 3);
        const dy = d.vy * dt;
        d.y += dy;
        d.x += d.vx * dt * (d.vy / 200);
        d.trail += dy;
        // a runner sheds water: beads behind it, and it slowly shrinks
        const gap = d.r * (1.2 + Math.random() * 1.2);
        if (d.trail > gap && d.vy > 20) {
          d.trail = 0;
          const br = d.r * (0.14 + Math.random() * 0.2);
          if (Math.random() < 0.6) this.beads.push({ x: d.x + (Math.random() - 0.5) * d.r * 0.4, y: d.y - d.r * 1.4, rx: br, ry: br * 1.1 });
          d.r *= 0.993;
        }
        if (d.vy > 10) this.erase.push({ x: d.x, y: d.y - dy * 0.5, rx: d.r * 0.9, ry: d.r * 0.9 + dy * 0.5 });
      } else {
        // evaporation of the tiniest
        d.r -= dt * 0.015;
        if (d.r < 0.8) d.dead = true;
      }
      if (d.y - d.r > this.h) d.dead = true;
    }

    // merging: a spatial hash keeps this O(n)
    const cell = 24 * s;
    const g = this.grid;
    g.clear();
    for (const d of this.drops) {
      if (d.dead) continue;
      const k = ((d.x / cell) | 0) * 7919 + ((d.y / cell) | 0);
      const list = g.get(k);
      if (list) list.push(d); else g.set(k, [d]);
    }
    for (const d of this.drops) {
      if (d.dead) continue;
      const cx = (d.x / cell) | 0, cy = (d.y / cell) | 0;
      for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) {
        const list = g.get((cx + ox) * 7919 + cy + oy);
        if (!list) continue;
        for (const e of list) {
          if (e === d || e.dead || d.dead) continue;
          const dx = e.x - d.x, dy = e.y - d.y;
          const rr = (d.r + e.r) * 0.8;
          if (dx * dx + dy * dy < rr * rr) {
            const [a, b] = d.r >= e.r ? [d, e] : [e, d];
            const area2 = a.r * a.r + b.r * b.r;
            a.r = Math.min(Math.sqrt(area2), 14 * s);
            a.x = (a.x * a.r + b.x * b.r * 0.4) / (a.r + b.r * 0.4);
            a.vy = Math.max(a.vy, b.vy);
            a.stall = Math.min(a.stall, 0.05);
            b.dead = true;
          }
        }
      }
    }
    if (this.drops.length > 64 && this.drops.some(d => d.dead)) this.drops = this.drops.filter(d => !d.dead);
  }

  /** the finger wipes water off the glass too */
  wipe(x0: number, y0: number, x1: number, y1: number, r: number) {
    const len = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(len / (r * 0.6)));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      this.erase.push({ x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t, rx: r * 0.85, ry: r * 0.85 });
    }
    const r2 = r * r;
    for (const d of this.drops) {
      if (d.dead) continue;
      // distance to segment
      const vx = x1 - x0, vy = y1 - y0;
      const t = Math.max(0, Math.min(1, ((d.x - x0) * vx + (d.y - y0) * vy) / Math.max(vx * vx + vy * vy, 1e-4)));
      const px = x0 + vx * t - d.x, py = y0 + vy * t - d.y;
      if (px * px + py * py < r2) d.dead = true;
    }
  }

  /** instance data: x, y, rx, ry. Runners stretch with speed. */
  fill(buf: Float32Array): number {
    let n = 0;
    for (const d of this.drops) {
      if (d.dead) continue;
      if (n * 4 + 4 > buf.length) break;
      const stretch = 1 + Math.min(0.5, d.vy / 400);
      buf[n * 4] = d.x; buf[n * 4 + 1] = d.y; buf[n * 4 + 2] = d.r / Math.sqrt(stretch); buf[n * 4 + 3] = d.r * stretch;
      n++;
    }
    return n;
  }
}
