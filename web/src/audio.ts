// Every sound in Barsaat is synthesised: no audio files.
// Rain bed, drops ticking on the glass, the squeak of a finger, breath, thunder that arrives
// after the flash, a temple bell when the storm clears, crickets at night.

export class Sound {
  ctx: AudioContext | null = null;
  enabled = false;
  private master!: GainNode;
  private verb!: ConvolverNode;
  private verbIn!: GainNode;
  private noise!: AudioBuffer;
  private hiss!: GainNode; private body!: GainNode; private roof!: GainNode;
  private squeakGain!: GainNode; private squeakOsc!: OscillatorNode; private squeakBP!: BiquadFilterNode; private squeakLfo!: OscillatorNode;
  private breathGain!: GainNode;
  private cricketGain!: GainNode;
  private tickAcc = 0;
  private cricketT = 0;

  start() {
    if (this.ctx) { this.ctx.resume(); this.enabled = true; this.fadeMaster(0.9); return; }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx;
    this.enabled = true;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.ratio.value = 3;
    comp.connect(ctx.destination);
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(comp);
    this.fadeMaster(0.9, 2.5);

    // a small room: generated impulse response
    this.verb = ctx.createConvolver();
    this.verb.buffer = this.impulse(2.8, 2.6);
    this.verbIn = ctx.createGain();
    this.verbIn.gain.value = 0.35;
    this.verbIn.connect(this.verb);
    this.verb.connect(this.master);

    // brown-ish noise, 4 s loop
    const len = ctx.sampleRate * 4;
    this.noise = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = this.noise.getChannelData(ch);
      let b = 0;
      for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; b = (b + 0.02 * w) / 1.02; d[i] = w * 0.6 + b * 3.5; }
    }

    // rain: three layers, mixed by intensity
    this.hiss = this.layer('highpass', 4200, 0.4);
    this.body = this.layer('lowpass', 900, 0.7);
    this.roof = this.layer('bandpass', 1800, 1.2);

    // squeak: a bowed, stick-slip tone that follows finger speed
    this.squeakOsc = ctx.createOscillator();
    this.squeakOsc.type = 'sawtooth';
    this.squeakBP = ctx.createBiquadFilter();
    this.squeakBP.type = 'bandpass'; this.squeakBP.Q.value = 14; this.squeakBP.frequency.value = 1200;
    const slip = ctx.createGain(); slip.gain.value = 0.5;
    this.squeakLfo = ctx.createOscillator(); this.squeakLfo.type = 'square'; this.squeakLfo.frequency.value = 38;
    const lfoAmt = ctx.createGain(); lfoAmt.gain.value = 0.5;
    this.squeakLfo.connect(lfoAmt).connect(slip.gain);
    this.squeakGain = ctx.createGain(); this.squeakGain.gain.value = 0;
    this.squeakOsc.connect(this.squeakBP).connect(slip).connect(this.squeakGain);
    this.squeakGain.connect(this.master);
    this.squeakGain.connect(this.verbIn);
    this.squeakOsc.start(); this.squeakLfo.start();

    // breath: soft band of noise
    const bsrc = this.loop();
    const bbp = ctx.createBiquadFilter(); bbp.type = 'bandpass'; bbp.frequency.value = 520; bbp.Q.value = 0.8;
    this.breathGain = ctx.createGain(); this.breathGain.gain.value = 0;
    bsrc.connect(bbp).connect(this.breathGain).connect(this.master);

    this.cricketGain = ctx.createGain(); this.cricketGain.gain.value = 0;
    this.cricketGain.connect(this.master);
    this.cricketGain.connect(this.verbIn);
  }

  stop() {
    this.enabled = false;
    if (this.ctx) this.fadeMaster(0, 0.6);
  }

  private fadeMaster(v: number, t = 0.8) {
    if (!this.ctx) return;
    const g = this.master.gain, now = this.ctx.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(v, now + t);
  }

  private impulse(sec: number, decay: number) {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * sec);
    const b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return b;
  }

  private loop() {
    const s = this.ctx!.createBufferSource();
    s.buffer = this.noise; s.loop = true;
    s.loopStart = Math.random() * 2;
    s.start(0, Math.random() * 3);
    return s;
  }

  private layer(type: BiquadFilterType, freq: number, q: number) {
    const ctx = this.ctx!;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); g.gain.value = 0;
    this.loop().connect(f).connect(g).connect(this.master);
    return g;
  }

  private set(p: AudioParam, v: number, tc = 0.25) { p.setTargetAtTime(v, this.ctx!.currentTime, tc); }

  /** called every frame */
  update(dt: number, rain: number, fingerSpeed: number, fingerOnGlass: boolean, breathing: boolean, writing: boolean, night: number) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    this.set(this.hiss.gain, 0.03 + rain * 0.16, 1.5);
    this.set(this.body.gain, 0.05 + rain * rain * 0.42, 1.5);
    this.set(this.roof.gain, rain * 0.06, 1.5);

    // squeak only when the finger moves at a squeaky speed
    let sq = 0, pitch = 900;
    if (fingerOnGlass || writing) {
      const v = writing ? 520 : fingerSpeed;
      sq = Math.min(1, Math.max(0, (v - 120) / 900)) * (writing ? 0.05 : 0.11);
      pitch = 700 + Math.min(1400, v * 0.6);
    }
    this.set(this.squeakGain.gain, sq, 0.03);
    this.set(this.squeakOsc.frequency, pitch * 0.5, 0.05);
    this.set(this.squeakBP.frequency, pitch, 0.05);
    this.set(this.squeakLfo.frequency, 22 + Math.min(50, fingerSpeed / 40), 0.05);

    this.set(this.breathGain.gain, breathing ? 0.22 : 0, breathing ? 0.25 : 0.35);

    // drops ticking on the pane, close and stereo
    this.tickAcc += dt * (rain * rain * 26 + rain * 4);
    while (this.tickAcc > 1) { this.tickAcc -= 1; this.tick(); }

    // crickets once the storm has passed
    this.set(this.cricketGain.gain, night * 0.05, 2);
    if (night > 0.05) {
      this.cricketT -= dt;
      if (this.cricketT <= 0) { this.cricketT = 0.6 + Math.random() * 1.6; this.cricket(); }
    }
    void ctx;
  }

  private tick() {
    const ctx = this.ctx!;
    const t = ctx.currentTime + Math.random() * 0.05;
    const src = ctx.createBufferSource(); src.buffer = this.noise;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2500 + Math.random() * 4500; f.Q.value = 6;
    const g = ctx.createGain();
    const pan = ctx.createStereoPanner(); pan.pan.value = Math.random() * 2 - 1;
    const v = 0.05 + Math.random() * 0.12;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(v, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04 + Math.random() * 0.05);
    src.connect(f).connect(g).connect(pan).connect(this.master);
    src.start(t, Math.random() * 3, 0.12);
  }

  private cricket() {
    const ctx = this.ctx!;
    const t0 = ctx.currentTime;
    const pan = ctx.createStereoPanner(); pan.pan.value = Math.random() * 1.6 - 0.8;
    pan.connect(this.cricketGain);
    const chirps = 3 + Math.floor(Math.random() * 3);
    const freq = 4300 + Math.random() * 500;
    for (let i = 0; i < chirps; i++) {
      const t = t0 + i * 0.07;
      const o = ctx.createOscillator(); o.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.5, t + 0.01); g.gain.linearRampToValueAtTime(0, t + 0.045);
      o.connect(g).connect(pan);
      o.start(t); o.stop(t + 0.06);
    }
  }

  /** thunder arrives after the flash: ~3 s per km */
  thunder(distance: number) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime + distance * 1.2 + 0.15;
    const dur = 4 + distance * 1.5;
    const src = ctx.createBufferSource(); src.buffer = this.noise; src.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.9;
    lp.frequency.setValueAtTime(distance < 1 ? 2400 : 900, t);
    lp.frequency.exponentialRampToValueAtTime(90, t + dur);
    const g = ctx.createGain();
    const peak = Math.min(1, 1.1 / (0.5 + distance)) * 0.9;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + (distance < 1 ? 0.05 : 0.5));
    // rolling: a few swells as the sound reflects off the far bank
    for (let i = 1; i < 4; i++) g.gain.linearRampToValueAtTime(peak * (0.4 + Math.random() * 0.5) / i, t + dur * i / 4.5);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(lp).connect(g);
    g.connect(this.master); g.connect(this.verbIn);
    src.start(t, Math.random() * 3); src.stop(t + dur + 0.1);
  }

  /** a temple bell across the river: inharmonic partials, long decay, distant */
  bell() {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const ring = (t: number, base: number, amp: number) => {
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
      const out = ctx.createGain(); out.gain.value = amp;
      lp.connect(out); out.connect(this.master); out.connect(this.verbIn);
      const partials: [number, number, number][] = [[0.5, 0.35, 7], [1, 0.5, 5], [1.183, 0.25, 4], [1.506, 0.22, 3.5], [2, 0.18, 3], [2.514, 0.12, 2.4], [2.662, 0.1, 2], [3.011, 0.07, 1.6]];
      for (const [r, a, d] of partials) {
        const o = ctx.createOscillator(); o.frequency.value = base * r;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g).connect(lp); o.start(t); o.stop(t + d + 0.1);
      }
    };
    const t = ctx.currentTime + 0.1;
    ring(t, 392, 0.16);
    ring(t + 2.6, 392, 0.12);
    ring(t + 5.4, 392, 0.09);
  }

  /** the little "plip" when you first touch the glass */
  touch() {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(1500, t); o.frequency.exponentialRampToValueAtTime(600, t + 0.08);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.08, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(g).connect(this.master); o.start(t); o.stop(t + 0.15);
  }
}
