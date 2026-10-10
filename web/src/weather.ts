// The one clock in Barsaat. Everything that changes over the evening reads from here:
// the drop spawner, fog regrowth, the grade, lightning, lamps, the poem and the sound mix.

export type PhaseName = 'arrive' | 'build' | 'downpour' | 'ease' | 'clear' | 'night';

interface Phase { name: PhaseName; dur: number; rain: number; size: number; regrow: number; dark: number; lamps: number; storm: number }

export const PHASES: Phase[] = [
  { name: 'arrive',   dur: 26, rain: 0.30, size: 0.2, regrow: 0.12, dark: 0.15, lamps: 0, storm: 0 },
  { name: 'build',    dur: 30, rain: 0.62, size: 0.5, regrow: 0.13, dark: 0.35, lamps: 0, storm: 0.2 },
  { name: 'downpour', dur: 42, rain: 1.00, size: 1.0, regrow: 0.17, dark: 0.75, lamps: 0, storm: 1 },
  { name: 'ease',     dur: 24, rain: 0.40, size: 0.5, regrow: 0.08, dark: 0.45, lamps: 0.2, storm: 0.15 },
  { name: 'clear',    dur: 48, rain: 0.04, size: 0.1, regrow: 0.025, dark: 0.1, lamps: 1, storm: 0 },
  { name: 'night',    dur: 18, rain: 0.12, size: 0.2, regrow: 0.07, dark: 0.3, lamps: 0.7, storm: 0 },
];

export interface Lamp { x: number; y: number; vx: number; phase: number; life: number; size: number }

const smooth = (a: number, b: number, k: number) => a + (b - a) * k;

export class Weather {
  t = 0;               // seconds into the loop
  index = 0;
  phaseT = 0;
  rain = 0.3; size = 0.2; regrow = 0.1; dark = 0.15; lampLevel = 0; storm = 0;
  flash = 0;
  boltN = 0;
  bolt = new Float32Array(10 * 4);
  lamps: Lamp[] = [];
  lampData = new Float32Array(14 * 4);
  flashesAllowed = true;
  onPhase: (p: PhaseName) => void = () => {};
  onLightning: (distance: number) => void = () => {};
  onBell: () => void = () => {};
  private nextStrike = 8;
  private flashEnv: { t: number; peaks: number[] } | null = null;
  private bellDone = false;

  get phase(): PhaseName { return PHASES[this.index].name; }

  start() { this.onPhase(this.phase); }

  /** jump ahead (keyboard "n" for testing and for impatient people) */
  skip() { this.phaseT = PHASES[this.index].dur; }

  step(dt: number) {
    this.t += dt;
    this.phaseT += dt;
    const ph = PHASES[this.index];
    if (this.phaseT >= ph.dur) {
      this.phaseT = 0;
      this.index = (this.index + 1) % PHASES.length;
      if (this.phase === 'clear') this.bellDone = false;
      this.onPhase(this.phase);
    }
    const cur = PHASES[this.index];
    const k = 1 - Math.exp(-dt / 6); // parameters ease over ~6 s, so phases blend into each other
    this.rain = smooth(this.rain, cur.rain, k);
    this.size = smooth(this.size, cur.size, k);
    this.regrow = smooth(this.regrow, cur.regrow, k);
    this.dark = smooth(this.dark, cur.dark, k);
    this.lampLevel = smooth(this.lampLevel, cur.lamps, 1 - Math.exp(-dt / 10));
    this.storm = smooth(this.storm, cur.storm, k);

    this.lightning(dt);
    this.updateLamps(dt);

    if (this.phase === 'clear' && !this.bellDone && this.phaseT > 6) { this.bellDone = true; this.onBell(); }
  }

  private lightning(dt: number) {
    if (this.storm > 0.3) {
      this.nextStrike -= dt;
      if (this.nextStrike <= 0) {
        this.nextStrike = 7 + Math.random() * 9;
        this.strike();
      }
    }
    if (this.flashEnv) {
      const e = this.flashEnv;
      e.t += dt;
      // two or three flickers, never faster than ~8 Hz, total under 0.7 s, then a long gap: photosensitivity-safe
      let f = 0;
      for (const p of e.peaks) { const d = e.t - p; if (d >= 0) f = Math.max(f, Math.exp(-d * 9) * (d < 0.04 ? d / 0.04 : 1)); }
      this.flash = this.flashesAllowed ? f * 0.85 : f * 0.18;
      if (e.t > 1.2) { this.flashEnv = null; this.flash = 0; this.boltN = 0; }
    }
  }

  strike() {
    const peaks = [0, 0.16 + Math.random() * 0.06];
    if (Math.random() < 0.5) peaks.push(0.42 + Math.random() * 0.1);
    this.flashEnv = { t: 0, peaks };
    // a bolt in the sky over the far bank (plate uv). Sometimes it's behind the clouds: just the flash.
    this.boltN = 0;
    if (Math.random() < 0.7) {
      let x = 0.12 + Math.random() * 0.6, y = 0.04;
      const end = 0.38 + Math.random() * 0.04;
      const steps = 10;
      for (let i = 0; i < steps; i++) {
        const nx = x + (Math.random() - 0.5) * 0.045;
        const ny = y + (end - 0.04) / steps * (0.7 + Math.random() * 0.6);
        this.bolt.set([x, y, nx, Math.min(ny, end)], i * 4);
        x = nx; y = ny;
        this.boltN++;
        if (ny >= end) break;
      }
    }
    this.onLightning(0.4 + Math.random() * 2.2);
  }

  private updateLamps(dt: number) {
    // diyas set out from the ghat steps and drift downstream (to the left) on the swollen river
    const want = Math.round(this.lampLevel * 13);
    if (this.lamps.length < want && Math.random() < dt * 0.6) {
      this.lamps.push({ x: 0.45 + Math.random() * 0.13, y: 0.6 + Math.random() * 0.08, vx: -(0.004 + Math.random() * 0.004), phase: Math.random() * 6.28, life: 0, size: 0.0016 + Math.random() * 0.0012 });
    }
    for (const l of this.lamps) {
      l.life += dt;
      l.x += l.vx * dt;
      l.y += Math.sin(this.t * 0.4 + l.phase) * 0.00025 * dt + 0.0012 * dt; // spreading a little toward us
    }
    this.lamps = this.lamps.filter(l => l.x > -0.05 && l.y < 0.98 && (this.lampLevel > 0.05 || l.life < 120));
    let i = 0;
    for (const l of this.lamps.slice(0, 14)) {
      const fadeIn = Math.min(1, l.life / 4);
      const flicker = 0.82 + 0.18 * Math.sin(this.t * 13 + l.phase * 3) * Math.sin(this.t * 7.3 + l.phase);
      this.lampData.set([l.x, l.y, fadeIn * flicker * Math.min(1, this.lampLevel * 1.5 + 0.2), l.size], i * 4);
      i++;
    }
    this.lampN = i;
  }
  lampN = 0;
}
