// The score, synthesised live. No samples.
//  - a tanpura made of real plucked strings (Karplus-Strong in a delay loop): Pa Sa' Sa' Sa
//  - a bowed, sarangi-like voice improvising on Raag Megh (calm) and Miyan ki Malhar (storm),
//    with meend (glides) between notes and andolan (slow sway) on komal ga
//  - jal tarang: rain drops tuned to the raga
//  - rain beds, tin roof, frogs, crickets, a peacock, and thunder as pakhawaj + rumble

const SA = 146.83; // D3
const R: Record<string, number> = { S: 1, r: 16 / 15, R: 9 / 8, g: 6 / 5, G: 5 / 4, m: 4 / 3, P: 3 / 2, d: 8 / 5, D: 5 / 3, n: 9 / 5, N: 15 / 8 };
const f = (note: string) => {
  const base = R[note[0]];
  const oct = note.includes("'") ? 2 : note.includes('.') ? 0.5 : 1;
  return SA * 2 * base * oct; // the voice sings an octave above the drone
};
const MEGH = [
  ['R', 'R', 'S'], ['n.', 'S'], ['m', 'R', 'P'], ['m', 'R', 'n.', 'S'], ['P', 'n', "S'"], ["S'", 'n', 'P'],
  ['m', 'P', 'n', 'P', 'm', 'R'], ['R', 'm', 'P', 'n', "S'"], ["R'", "S'", 'n', 'P'], ['P', 'm', 'R', 'S'],
];
const MALHAR = [
  ['m', 'R', 'P'], ['n', 'D', 'N', "S'"], ["S'", 'n', 'P'], ['m', 'P', 'g', 'm', 'R', 'S'], ['R', 'P', 'm', 'P'],
  ['g', 'm', 'R', 'S'], ['D', 'n', 'P'], ['m', 'R', 'm', 'P', 'D', 'N', "S'"], ["S'", 'D', 'n', 'P', 'm', 'P', 'g', 'm', 'R', 'S'],
];
const JAL = ['S', 'R', 'm', 'P', 'n', "S'", "R'"];

export class Score {
  ctx: AudioContext | null = null;
  on = false;
  private master!: GainNode; private music!: GainNode; private fx!: GainNode; private verb!: ConvolverNode; private verbIn!: GainNode;
  private noise!: AudioBuffer;
  private hiss!: GainNode; private body!: GainNode; private tin!: GainNode; private tinF: BiquadFilterNode[] = [];
  private voice!: OscillatorNode; private voice2!: OscillatorNode; private vGain!: GainNode; private vib!: GainNode; private vF!: BiquadFilterNode;
  private tanT = 0; private tanI = 0; private noteT = 0; private phrase: string[] = [];
  private dropT = 0; private frogT = 0; private crickT = 0; private peaT = 10;
  state = { rain: 0, storm: 0, ch: 0, clear: 0, tin: 0, frogs: 0, msg: 0 };

  async start() {
    if (this.ctx) { if (this.ctx.state !== 'running') await this.ctx.resume(); return; }
    const ctx = new AudioContext();
    this.ctx = ctx;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 3;
    this.master = ctx.createGain(); this.master.gain.value = 0;
    this.master.connect(comp).connect(ctx.destination);
    this.verb = ctx.createConvolver(); this.verb.buffer = this.impulse(3.6);
    this.verbIn = ctx.createGain();
    this.verbIn.connect(this.verb).connect(this.master);
    this.music = ctx.createGain(); this.music.gain.value = 0.55;
    this.music.connect(this.master);
    const mv = ctx.createGain(); mv.gain.value = 0.5; this.music.connect(mv).connect(this.verbIn);
    this.fx = ctx.createGain(); this.fx.gain.value = 0.9; this.fx.connect(this.master);
    const fv = ctx.createGain(); fv.gain.value = 0.25; this.fx.connect(fv).connect(this.verbIn);

    const len = ctx.sampleRate * 4;
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + w * 0.029591; b1 = 0.985 * b1 + w * 0.032534; b2 = 0.95 * b2 + w * 0.048056;
      d[i] = (b0 + b1 + b2 + w * 0.08) * 1.6;
    }
    const loop = () => { const s = ctx.createBufferSource(); s.buffer = this.noise; s.loop = true; s.start(0, Math.random() * 3); return s; };
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2600;
    this.hiss = ctx.createGain(); this.hiss.gain.value = 0;
    loop().connect(hp).connect(this.hiss).connect(this.fx);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 700; bp.Q.value = 0.5;
    this.body = ctx.createGain(); this.body.gain.value = 0;
    loop().connect(bp).connect(this.body).connect(this.fx);
    this.tin = ctx.createGain(); this.tin.gain.value = 0; this.tin.connect(this.fx);
    for (const fr of [920, 2150, 3400]) {
      const r = ctx.createBiquadFilter(); r.type = 'bandpass'; r.frequency.value = fr; r.Q.value = 18;
      r.connect(this.tin); this.tinF.push(r);
    }
    this.voice = ctx.createOscillator(); this.voice.type = 'sawtooth';
    this.voice2 = ctx.createOscillator(); this.voice2.type = 'triangle';
    const lfo = ctx.createOscillator(); lfo.frequency.value = 5.4;
    this.vib = ctx.createGain(); this.vib.gain.value = 0;
    lfo.connect(this.vib); this.vib.connect(this.voice.detune); this.vib.connect(this.voice2.detune);
    this.vF = ctx.createBiquadFilter(); this.vF.type = 'lowpass'; this.vF.frequency.value = 1500; this.vF.Q.value = 2;
    const formant = ctx.createBiquadFilter(); formant.type = 'peaking'; formant.frequency.value = 1100; formant.Q.value = 2; formant.gain.value = 7;
    const g1 = ctx.createGain(); g1.gain.value = 0.35; const g2 = ctx.createGain(); g2.gain.value = 0.7;
    this.vGain = ctx.createGain(); this.vGain.gain.value = 0;
    this.voice.connect(g1).connect(this.vF); this.voice2.connect(g2).connect(this.vF);
    this.vF.connect(formant).connect(this.vGain).connect(this.music);
    this.voice.start(); this.voice2.start(); lfo.start();
    this.voice.frequency.value = f('S'); this.voice2.frequency.value = f('S');
    this.noteT = ctx.currentTime + 2.5; this.tanT = ctx.currentTime + 0.2;
  }

  private impulse(sec: number) {
    const ctx = this.ctx!;
    const n = ctx.sampleRate * sec, b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.6); }
    return b;
  }

  setOn(v: boolean) {
    this.on = v;
    if (!this.ctx) return;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.setTargetAtTime(v ? 0.9 : 0, this.ctx.currentTime, v ? 0.6 : 0.2);
  }

  private pluck(freq: number, t: number, amp: number) {
    const ctx = this.ctx!;
    const burst = ctx.createBufferSource(); burst.buffer = this.noise;
    const bg = ctx.createGain(); bg.gain.setValueAtTime(amp, t); bg.gain.setValueAtTime(0, t + 0.02);
    const delay = ctx.createDelay(1); delay.delayTime.value = 1 / freq;
    const fb = ctx.createGain(); fb.gain.value = 0.994;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3800;
    const jw = ctx.createBiquadFilter(); jw.type = 'bandpass'; jw.Q.value = 3;
    jw.frequency.setValueAtTime(3200, t); jw.frequency.exponentialRampToValueAtTime(1300, t + 3.8);
    const jg = ctx.createGain(); jg.gain.value = 0.6;
    const out = ctx.createGain(); out.gain.setValueAtTime(0.5, t); out.gain.setTargetAtTime(0, t + 3.2, 0.6);
    burst.connect(bg).connect(delay); delay.connect(lp).connect(fb).connect(delay);
    lp.connect(out); lp.connect(jw).connect(jg).connect(out);
    out.connect(this.music);
    burst.start(t, Math.random() * 3, 0.03);
    setTimeout(() => { try { fb.disconnect(); out.disconnect(); } catch { /* gone */ } }, (t - ctx.currentTime + 5) * 1000);
  }

  private note(freq: number, t: number, dur: number, andolan: boolean) {
    const v = this.voice.frequency, v2 = this.voice2.frequency;
    v.cancelScheduledValues(t); v2.cancelScheduledValues(t);
    v.setTargetAtTime(freq, t, 0.09); v2.setTargetAtTime(freq * 1.002, t, 0.09);
    this.vGain.gain.cancelScheduledValues(t);
    this.vGain.gain.setTargetAtTime(0.16, t, 0.08);
    this.vGain.gain.setTargetAtTime(0.11, t + 0.25, 0.4);
    this.vib.gain.cancelScheduledValues(t);
    this.vib.gain.setTargetAtTime(0, t, 0.05);
    this.vib.gain.setTargetAtTime(andolan ? 32 : 9, t + Math.min(0.4, dur * 0.4), 0.3);
    this.vF.frequency.setTargetAtTime(1200 + this.state.storm * 900, t, 0.3);
  }

  private silence(t: number) { this.vGain.gain.setTargetAtTime(0, t, 0.35); this.vib.gain.setTargetAtTime(0, t, 0.3); }

  private drop(t: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator(); o.type = 'sine';
    const fr = f(JAL[Math.floor(Math.random() * JAL.length)]) * 2;
    o.frequency.setValueAtTime(fr * 1.04, t); o.frequency.exponentialRampToValueAtTime(fr, t + 0.05);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.05 + Math.random() * 0.04, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    const pan = ctx.createStereoPanner(); pan.pan.value = Math.random() * 1.6 - 0.8;
    o.connect(g).connect(pan).connect(this.fx); o.start(t); o.stop(t + 0.55);
  }

  private tinHit(t: number) {
    const ctx = this.ctx!;
    const s = ctx.createBufferSource(); s.buffer = this.noise;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.6, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    s.connect(g); this.tinF.forEach(r => g.connect(r)); s.start(t, Math.random() * 3, 0.06);
  }

  private frog(t: number) {
    const ctx = this.ctx!;
    const car = ctx.createOscillator(); car.frequency.value = 280 + Math.random() * 200;
    const mod = ctx.createOscillator(); mod.frequency.value = 38 + Math.random() * 20;
    const mg = ctx.createGain(); mg.gain.value = 140; mod.connect(mg).connect(car.frequency);
    const g = ctx.createGain(); g.gain.value = 0;
    const pan = ctx.createStereoPanner(); pan.pan.value = Math.random() * 2 - 1;
    car.connect(g).connect(pan).connect(this.fx);
    const n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) { const s = t + i * 0.16; g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(0.035, s + 0.02); g.gain.linearRampToValueAtTime(0, s + 0.1); }
    car.start(t); mod.start(t); car.stop(t + n * 0.16 + 0.1); mod.stop(t + n * 0.16 + 0.1);
  }

  private cricket(t: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator(); o.frequency.value = 4300 + Math.random() * 500;
    const g = ctx.createGain(); g.gain.value = 0;
    const pan = ctx.createStereoPanner(); pan.pan.value = Math.random() * 2 - 1;
    o.connect(g).connect(pan).connect(this.fx);
    for (let i = 0; i < 6; i++) { const s = t + i * 0.055; g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(0.012, s + 0.01); g.gain.linearRampToValueAtTime(0, s + 0.035); }
    o.start(t); o.stop(t + 0.4);
  }

  private peacock(t: number) {
    const ctx = this.ctx!;
    for (let k = 0; k < 2; k++) {
      const s = t + k * 0.55;
      const o = ctx.createOscillator(); o.type = 'sawtooth';
      o.frequency.setValueAtTime(420, s); o.frequency.exponentialRampToValueAtTime(880, s + 0.22); o.frequency.exponentialRampToValueAtTime(760, s + 0.4);
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1500; bp.Q.value = 4;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(0.06, s + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, s + 0.45);
      o.connect(bp).connect(g).connect(this.fx); o.start(s); o.stop(s + 0.5);
    }
  }

  thunder(distance = 0.3) {
    if (!this.ctx || !this.on) return;
    const ctx = this.ctx, t = ctx.currentTime + 0.05 + distance * 1.6;
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(78, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.5);
    const og = ctx.createGain(); og.gain.setValueAtTime(0, t); og.gain.linearRampToValueAtTime(0.7 * (1 - distance * 0.5), t + 0.01); og.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
    o.connect(og).connect(this.master); o.start(t); o.stop(t + 1.2);
    const s = ctx.createBufferSource(); s.buffer = this.noise;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(900 - distance * 500, t); lp.frequency.exponentialRampToValueAtTime(120, t + 4);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.9, t + 0.08 + distance * 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + 5 + distance * 2);
    s.connect(lp).connect(g).connect(this.master);
    const v = ctx.createGain(); v.gain.value = 0.4; g.connect(v).connect(this.verbIn);
    s.start(t, Math.random() * 2, 7);
  }

  swell() {
    if (!this.ctx || !this.on) return;
    this.phrase = [...MALHAR[Math.floor(Math.random() * MALHAR.length)]];
    this.noteT = this.ctx.currentTime + 0.05;
  }

  update(dt: number) {
    if (!this.ctx || !this.on) return;
    const ctx = this.ctx, t = ctx.currentTime, s = this.state;
    const set = (p: AudioParam, v: number, tc = 0.5) => p.setTargetAtTime(v, t, tc);
    set(this.hiss.gain, s.rain * 0.22 * (1 - s.msg * 0.6));
    set(this.body.gain, (0.04 + s.rain * 0.5) * (1 - s.msg * 0.6));
    set(this.tin.gain, s.tin * s.rain * 0.9, 0.8);

    while (this.tanT < t + 0.2) {
      const seq = [SA * 1.5, SA * 2, SA * 2, SA];
      this.pluck(seq[this.tanI % 4], this.tanT, 0.55);
      this.tanI++;
      this.tanT += this.tanI % 4 === 0 ? 1.6 : 1.05;
    }
    const malhar = s.storm > 0.55;
    const beat = malhar ? 0.42 : 0.62;
    while (this.noteT < t + 0.25) {
      if (s.msg > 0.5) { this.note(f('S'), this.noteT, 6, false); this.noteT += 8; this.phrase = []; continue; }
      if (!this.phrase.length) {
        this.silence(this.noteT);
        const pool = malhar ? MALHAR : MEGH;
        this.phrase = [...pool[Math.floor(Math.random() * pool.length)]];
        this.noteT += beat * (3 + Math.random() * 4) * (s.clear > 0.5 ? 2 : 1);
        continue;
      }
      const n = this.phrase.shift()!;
      const last = this.phrase.length === 0;
      const dur = beat * (last ? 3 + Math.random() * 2 : [1, 1, 1.5, 2, 0.75][Math.floor(Math.random() * 5)]);
      this.note(f(n), this.noteT, dur, n === 'g');
      this.noteT += dur;
    }
    this.dropT -= dt;
    if (this.dropT <= 0) { this.dropT = 0.15 + (1 - s.rain) * 1.2 + Math.random() * 0.4; if (s.rain > 0.05 && s.rain < 0.85) this.drop(t + 0.02); }
    if (s.tin > 0.1 && Math.random() < s.rain * dt * 30) this.tinHit(t + Math.random() * 0.05);
    this.frogT -= dt;
    if (this.frogT <= 0) { this.frogT = 0.6 + Math.random() * 2.2; if (s.frogs > 0.3) this.frog(t + 0.05); }
    this.crickT -= dt;
    if (this.crickT <= 0) { this.crickT = 0.4 + Math.random(); if (s.clear > 0.5) this.cricket(t + 0.05); }
    this.peaT -= dt;
    if (this.peaT <= 0) { this.peaT = 14 + Math.random() * 14; if (s.ch === 3 || s.ch === 4) this.peacock(t + 0.1); }
  }
}
