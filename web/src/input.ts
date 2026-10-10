// Your finger on the glass. Turns pointer (and keyboard) input into wipe segments and breath.
// Multi-touch works: each finger wipes. Holding still breathes a cloud onto the pane.

import type { Seg } from './gl/renderer';

interface Finger { x: number; y: number; lastMove: number; downAt: number; still: boolean; startX: number; startY: number }

export class Hand {
  segs: Seg[] = [];
  speed = 0;                 // smoothed px/s of the fastest finger, drives the squeak
  breath: { x: number; y: number; s: number; r: number } | null = null;
  breathing = false;
  touched = false;           // has the user touched the glass yet
  wipedDistance = 0;
  onFirstTouch: () => void = () => {};
  private fingers = new Map<number, Finger>();
  private rawSpeed = 0;
  private breathR = 0;
  private key = { x: 0, y: 0, active: false, dx: 0, dy: 0, space: false };
  private radius = 20;

  constructor(private el: HTMLElement, private wipe: (s: Seg) => void) {
    el.addEventListener('pointerdown', this.down, { passive: false });
    el.addEventListener('pointermove', this.move, { passive: false });
    el.addEventListener('pointerup', this.up);
    el.addEventListener('pointercancel', this.up);
    el.addEventListener('pointerleave', this.up);
    el.addEventListener('contextmenu', e => e.preventDefault());
    addEventListener('keydown', this.keydown);
    addEventListener('keyup', this.keyup);
  }

  private down = (e: PointerEvent) => {
    e.preventDefault();
    try { this.el.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    const now = performance.now();
    this.fingers.set(e.pointerId, { x: e.clientX, y: e.clientY, lastMove: now, downAt: now, still: true, startX: e.clientX, startY: e.clientY });
    this.radius = e.pointerType === 'touch' ? Math.max(18, Math.min(30, (e.width || 30) * 0.6)) : 17;
    if (!this.touched) { this.touched = true; this.onFirstTouch(); }
    this.addSeg(e.clientX, e.clientY, e.clientX, e.clientY, this.radius * 0.8);
  };

  private move = (e: PointerEvent) => {
    const f = this.fingers.get(e.pointerId);
    if (!f) return;
    e.preventDefault();
    const events = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : [];
    const pts = events.length ? events : [e];
    for (const p of pts) {
      const dx = p.clientX - f.x, dy = p.clientY - f.y;
      const d = Math.hypot(dx, dy);
      if (d < 0.5) continue;
      // faster strokes press lighter and leave a slightly narrower line
      const now = p.timeStamp || performance.now();
      const v = d / Math.max(1, now - f.lastMove) * 1000;
      const r = this.radius * (1.08 - Math.min(0.3, v / 6000));
      this.addSeg(f.x, f.y, p.clientX, p.clientY, r);
      this.rawSpeed = Math.max(this.rawSpeed, v);
      this.wipedDistance += d;
      f.x = p.clientX; f.y = p.clientY; f.lastMove = now;
    }
    if (Math.hypot(f.x - f.startX, f.y - f.startY) > 10) f.still = false;
  };

  private up = (e: PointerEvent) => { this.fingers.delete(e.pointerId); };

  private keydown = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement;
    if (t && (t.tagName === 'BUTTON' || t.tagName === 'A' || t.closest('dialog'))) return;
    const k = this.key;
    const dirs: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (dirs[e.key]) {
      e.preventDefault();
      if (!k.active) { k.active = true; k.x = innerWidth / 2; k.y = innerHeight / 2; }
      k.dx = dirs[e.key][0] || k.dx * (dirs[e.key][1] ? 1 : 0);
      k.dy = dirs[e.key][1] || k.dy * (dirs[e.key][0] ? 1 : 0);
      if (!this.touched) { this.touched = true; this.onFirstTouch(); }
    } else if (e.key === ' ') {
      e.preventDefault();
      if (!k.active) { k.active = true; k.x = innerWidth / 2; k.y = innerHeight / 2; }
      k.space = true;
    }
  };

  private keyup = (e: KeyboardEvent) => {
    const k = this.key;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') k.dx = 0;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') k.dy = 0;
    if (e.key === ' ') k.space = false;
  };

  private addSeg(x0: number, y0: number, x1: number, y1: number, r: number) {
    const s = { x0, y0, x1, y1, r };
    this.segs.push(s);
    this.wipe(s);
  }

  /** call once per frame before rendering */
  update(dt: number) {
    const now = performance.now();
    // keyboard finger
    const k = this.key;
    if (k.active && (k.dx || k.dy)) {
      const nx = Math.max(0, Math.min(innerWidth, k.x + k.dx * 420 * dt));
      const ny = Math.max(0, Math.min(innerHeight, k.y + k.dy * 420 * dt));
      this.addSeg(k.x, k.y, nx, ny, 20);
      this.rawSpeed = Math.max(this.rawSpeed, 420);
      this.wipedDistance += Math.hypot(nx - k.x, ny - k.y);
      k.x = nx; k.y = ny;
    }

    // breath: a finger held still for 0.35 s, or the space bar
    let bx = 0, by = 0, holding = false;
    for (const f of this.fingers.values()) {
      if (f.still && now - f.downAt > 350) { holding = true; bx = f.x; by = f.y; }
    }
    if (k.space) { holding = true; bx = k.x; by = k.y; }
    this.breathing = holding;
    if (holding) {
      this.breathR = Math.min(130, this.breathR + dt * 160);
      this.breath = { x: bx, y: by, s: 1, r: 30 + this.breathR };
    } else {
      this.breathR = Math.max(0, this.breathR - dt * 400);
      this.breath = null;
    }

    this.speed += (this.rawSpeed - this.speed) * Math.min(1, dt * 14);
    this.rawSpeed *= Math.max(0, 1 - dt * 20);
  }

  /** after rendering: segments were consumed */
  flush() { this.segs.length = 0; }

  get fingerDown() { return this.fingers.size > 0 || this.key.active && (this.key.dx !== 0 || this.key.dy !== 0); }
}
