// Every sound is synthesised live; there are no audio files.
// Rain on roofs and water, the lap of the current, paper being folded, a tanpura drone tuned to
// Raag Megh (the raag of rain clouds), and a note from the same raag for every lamp you light,
// so a good run plays a little melody. Thunder arrives after the flash. Temple bells as you pass.

const SA = 146.83; // D3
const MEGH = [1, 9 / 8, 4 / 3, 3 / 2, 16 / 9, 2, 9 / 4, 8 / 3, 3];
const PHRASE = [2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 5, 4, 5, 6, 7, 6, 5, 3, 4, 2, 3, 1, 0];

export class Sound {
  ctx: AudioContext | null = null;
  enabled = false;
  private master!: GainNode;
  private verbIn!: GainNode;
  private noise!: AudioBuffer;
  private hiss!: GainNode; private body!: GainNode; private roof!: GainNode;
  private lap!: GainNode; private lapF!: BiquadFilterNode;
  private blow!: GainNode;
  private drone!: GainNode;
  private crickets!: GainNode;
  private tickAcc = 0;
  private note = 0;
  private droneT = 0;
  private droneString = 0;
  private cricketT = 0;
  // --- the score ---
  private music!: GainNode;
  private flute!: OscillatorNode; private flute2!: OscillatorNode; private fluteGain!: GainNode; private fluteVib!: GainNode; private fluteBreath!: GainNode; private fluteBP!: BiquadFilterNode;
  private padGain!: GainNode; private padF!: BiquadFilterNode;
  private nextBeat = 0; private beat = 0; private nextNote = 0; private phraseLeft = 0; private deg = 7;
  private section = 0;
  private intensity = 0;
  musicOn = true;

  start() {
    if (this.ctx) { this.ctx.resume(); this.enabled = true; this.fade(0.9); return; }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx; this.enabled = true;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 3;
    comp.connect(ctx.destination);
    this.master = ctx.createGain(); this.master.gain.value = 0; this.master.connect(comp);
    this.fade(0.9, 2.5);
    const verb = ctx.createConvolver(); verb.buffer = this.impulse(3.4, 2.4);
    this.verbIn = ctx.createGain(); this.verbIn.gain.value = 0.4;
    this.verbIn.connect(verb); verb.connect(this.master);

    const len = ctx.sampleRate * 4;
    this.noise = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = this.noise.getChannelData(ch); let b = 0;
      for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; b = (b + 0.02 * w) / 1.02; d[i] = w * 0.6 + b * 3.5; }
    }
    this.hiss = this.layer('highpass', 4000, 0.4);
    this.body = this.layer('lowpass', 850, 0.7);
    this.roof = this.layer('bandpass', 2100, 1.4);
    // the current lapping at paper: slow-wobbling low noise
    this.lapF = ctx.createBiquadFilter(); this.lapF.type = 'lowpass'; this.lapF.frequency.value = 380; this.lapF.Q.value = 3;
    this.lap = ctx.createGain(); this.lap.gain.value = 0;
    this.loop().connect(this.lapF).connect(this.lap).connect(this.master);
    // breath, when you hold to blow the boat along
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 600; bp.Q.value = 0.7;
    this.blow = ctx.createGain(); this.blow.gain.value = 0;
    this.loop().connect(bp).connect(this.blow).connect(this.master);
    this.drone = ctx.createGain(); this.drone.gain.value = 0;
    this.drone.connect(this.master); this.drone.connect(this.verbIn);
    this.crickets = ctx.createGain(); this.crickets.gain.value = 0;
    this.crickets.connect(this.master); this.crickets.connect(this.verbIn);
    this.buildScore();
  }

  // ------------------------------------------------------------------ the score
  // A continuous piece in Raag Megh: tanpura and a warm pad underneath always, a bansuri that
  // improvises phrases on top, and tabla in keherwa (8 beats) once the boat reaches the canal,
  // with a deep dhol in the storm. It thins to flute and drone when the sky clears.

  private buildScore() {
    const ctx = this.ctx!;
    this.music = ctx.createGain(); this.music.gain.value = 0.85;
    this.music.connect(this.master);
    const musicVerb = ctx.createGain(); musicVerb.gain.value = 0.55;
    this.music.connect(musicVerb); musicVerb.connect(this.verbIn);
    this.drone.disconnect(); this.drone.connect(this.music);

    // pad: Sa and Pa, low, slowly breathing
    this.padF = ctx.createBiquadFilter(); this.padF.type = 'lowpass'; this.padF.frequency.value = 500; this.padF.Q.value = 0.7;
    this.padGain = ctx.createGain(); this.padGain.gain.value = 0;
    this.padF.connect(this.padGain).connect(this.music);
    for (const [f, d] of [[SA / 2, -4], [SA / 2, 4], [SA * 0.75, 0], [SA, -6], [SA, 6]] as const) {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = d;
      const g = ctx.createGain(); g.gain.value = 0.06;
      o.connect(g).connect(this.padF); o.start();
    }
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
    const lg = ctx.createGain(); lg.gain.value = 220;
    lfo.connect(lg).connect(this.padF.frequency); lfo.start();

    // bansuri: one breathing voice that glides between notes
    this.flute = ctx.createOscillator(); this.flute.type = 'sine';
    this.flute2 = ctx.createOscillator(); this.flute2.type = 'triangle';
    const vib = ctx.createOscillator(); vib.frequency.value = 5.2;
    this.fluteVib = ctx.createGain(); this.fluteVib.gain.value = 0;
    vib.connect(this.fluteVib); this.fluteVib.connect(this.flute.frequency); this.fluteVib.connect(this.flute2.frequency);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
    this.fluteGain = ctx.createGain(); this.fluteGain.gain.value = 0;
    const g2 = ctx.createGain(); g2.gain.value = 0.25;
    this.flute.connect(lp); this.flute2.connect(g2).connect(lp);
    lp.connect(this.fluteGain).connect(this.music);
    this.fluteBP = ctx.createBiquadFilter(); this.fluteBP.type = 'bandpass'; this.fluteBP.Q.value = 3;
    this.fluteBreath = ctx.createGain(); this.fluteBreath.gain.value = 0;
    this.loop().connect(this.fluteBP).connect(this.fluteBreath).connect(this.music);
    this.flute.start(); this.flute2.start(); vib.start();
    this.nextBeat = ctx.currentTime + 0.5; this.nextNote = ctx.currentTime + 1.5;
  }

  /** section: 0 gate/page, 1 lane, 2 canal, 3 storm, 4 open water/drift */
  setSection(n: number) { this.section = n; }

  private scheduleScore() {
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    const sec = this.section;
    const target = this.musicOn ? 1 : 0;
    this.intensity += (target - this.intensity) * 0.02;
    this.set(this.music.gain, this.musicOn ? 0.85 : 0, 0.8);
    this.set(this.padGain.gain, [0.5, 0.45, 0.4, 0.5, 0.6][sec] * 0.5, 3);
    this.set(this.drone.gain, [0.09, 0.1, 0.1, 0.11, 0.12][sec], 2.5);

    const bpm = [64, 72, 80, 92, 60][sec];
    const beatLen = 60 / bpm;
    // tabla, keherwa: dha ge na ti | na ka dhi na
    while (this.nextBeat < now + 0.25) {
      const t = this.nextBeat;
      const b = this.beat % 8;
      if (sec === 2 || sec === 3) {
        const loud = sec === 3 ? 1.25 : 0.8;
        const pat = ['dha', 'ge', 'na', 'ti', 'na', 'ka', 'dhi', 'na'][b];
        if (pat === 'dha' || pat === 'ge' || pat === 'dhi') this.bayan(t, loud * (pat === 'ge' ? 0.7 : 1));
        if (pat !== 'ge') this.dayan(t, loud * (pat === 'ka' ? 0.5 : pat === 'ti' ? 0.7 : 1), pat === 'ka');
        if (sec === 3 && (b === 0 || b === 4)) this.dhol(t);
        if (sec === 3 && b % 2 === 1 && Math.random() < 0.4) this.dayan(t + beatLen / 2, 0.5, true); // fills
      }
      this.beat++;
      this.nextBeat += beatLen;
    }

    // bansuri phrases: a walk on Megh's notes, landing on Sa or Pa, then a breath
    while (this.nextNote < now + 0.3) {
      const t = this.nextNote;
      const busy = [0.55, 0.75, 0.85, 0.7, 0.6][sec];
      if (this.phraseLeft <= 0) {
        this.phraseLeft = 3 + Math.floor(Math.random() * 6);
        this.fluteRest(t);
        this.nextNote += beatLen * (2 + Math.floor(Math.random() * 3)) / busy;
        continue;
      }
      const SC = [1 / 2, 9 / 16, 2 / 3, 3 / 4, 8 / 9, 1, 9 / 8, 4 / 3, 3 / 2, 16 / 9, 2, 9 / 4];
      const step = [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)];
      this.deg = Math.max(2, Math.min(SC.length - 1, this.deg + step + (this.deg > 9 ? -1 : this.deg < 4 ? 1 : 0)));
      this.phraseLeft--;
      let durBeats = [0.5, 1, 1, 1, 1.5, 2][Math.floor(Math.random() * 6)];
      if (this.phraseLeft === 0) { this.deg = Math.random() < 0.6 ? 5 : 8; durBeats = 3 + Math.random() * 2; }
      this.fluteNote(t, SA * 2 * SC[this.deg], durBeats * beatLen);
      this.nextNote += durBeats * beatLen;
    }
  }

  private fluteNote(t: number, f: number, dur: number) {
    this.flute.frequency.setTargetAtTime(f, t, 0.035);
    this.flute2.frequency.setTargetAtTime(f, t, 0.035);
    this.fluteBP.frequency.setTargetAtTime(f * 2, t, 0.05);
    const g = this.fluteGain.gain;
    g.cancelScheduledValues(t);
    g.setTargetAtTime(0.11, t, 0.04);
    g.setTargetAtTime(0.085, t + 0.15, 0.3);
    this.fluteBreath.gain.setTargetAtTime(0.018, t, 0.03);
    this.fluteBreath.gain.setTargetAtTime(0.006, t + 0.12, 0.2);
    // vibrato blooms on long notes
    this.fluteVib.gain.setTargetAtTime(0, t, 0.02);
    this.fluteVib.gain.setTargetAtTime(f * 0.012, t + Math.min(0.5, dur * 0.4), 0.25);
  }

  private fluteRest(t: number) {
    this.fluteGain.gain.setTargetAtTime(0, t, 0.25);
    this.fluteBreath.gain.setTargetAtTime(0, t, 0.2);
    this.fluteVib.gain.setTargetAtTime(0, t, 0.2);
  }

  private bayan(t: number, amp: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(78, t); o.frequency.exponentialRampToValueAtTime(112, t + 0.12); o.frequency.exponentialRampToValueAtTime(95, t + 0.5);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.32 * amp, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    o.connect(g).connect(this.music); o.start(t); o.stop(t + 0.75);
  }

  private dayan(t: number, amp: number, muted: boolean) {
    const ctx = this.ctx!;
    const f = SA * 2;
    const out = ctx.createGain(); out.gain.value = 0.12 * amp; out.connect(this.music);
    for (const [r, a, d] of [[1, 1, muted ? 0.06 : 0.45], [2.0, 0.5, muted ? 0.04 : 0.25], [3.0, 0.3, 0.12], [4.2, 0.15, 0.06]] as const) {
      const o = ctx.createOscillator(); o.frequency.value = f * r;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a, t + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(out); o.start(t); o.stop(t + d + 0.02);
    }
    const src = ctx.createBufferSource(); src.buffer = this.noise;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3000;
    const ng = ctx.createGain(); ng.gain.setValueAtTime(0.5, t); ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    src.connect(hp).connect(ng).connect(out); src.start(t, Math.random() * 3, 0.05);
  }

  private dhol(t: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.35);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.55, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    o.connect(g).connect(this.music); o.start(t); o.stop(t + 0.65);
  }

  stop() { this.enabled = false; if (this.ctx) this.fade(0, 0.6); }

  private fade(v: number, t = 0.8) {
    if (!this.ctx) return;
    const g = this.master.gain, now = this.ctx.currentTime;
    g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); g.linearRampToValueAtTime(v, now + t);
  }

  private impulse(sec: number, decay: number) {
    const ctx = this.ctx!, len = Math.floor(ctx.sampleRate * sec);
    const b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); }
    return b;
  }

  private loop() {
    const s = this.ctx!.createBufferSource(); s.buffer = this.noise; s.loop = true;
    s.start(0, Math.random() * 3); return s;
  }

  private layer(type: BiquadFilterType, freq: number, q: number) {
    const ctx = this.ctx!;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); g.gain.value = 0;
    this.loop().connect(f).connect(g).connect(this.master);
    return g;
  }

  private set(p: AudioParam, v: number, tc = 0.25) { p.setTargetAtTime(v, this.ctx!.currentTime, tc); }

  /** every frame. lane: 0..1 how enclosed we are; music: 0..1 drone level */
  update(dt: number, rain: number, lane: number, speed: number, blowing: boolean, music: number, night: number) {
    if (!this.ctx || !this.enabled) return;
    this.set(this.hiss.gain, 0.03 + rain * 0.2, 1.2);
    this.set(this.body.gain, 0.05 + rain * 0.42, 1.2);
    this.set(this.roof.gain, rain * lane * 0.12, 1.2);
    this.set(this.lap.gain, 0.1 + Math.min(1, speed / 6) * 0.14, 0.4);
    this.set(this.lapF.frequency, 260 + 160 * Math.sin(this.ctx.currentTime * 1.3) + speed * 30, 0.2);
    this.set(this.blow.gain, blowing ? 0.2 : 0, blowing ? 0.2 : 0.4);
    this.set(this.crickets.gain, night * 0.05, 2);

    // drops on tin roofs and on the paper, close by
    this.tickAcc += dt * (rain * rain * (18 + lane * 20) + rain * 3);
    while (this.tickAcc > 1) { this.tickAcc -= 1; this.tick(lane); }

    this.droneT -= dt;
    if (this.droneT <= 0) { this.droneT = 1.15; this.pluckDrone(); }
    this.scheduleScore();
    void music;
    if (night > 0.05) {
      this.cricketT -= dt;
      if (this.cricketT <= 0) { this.cricketT = 0.5 + Math.random() * 1.4; this.cricket(); }
    }
  }

  private tick(lane: number) {
    const ctx = this.ctx!;
    const t = ctx.currentTime + Math.random() * 0.05;
    const src = ctx.createBufferSource(); src.buffer = this.noise;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass';
    const tin = Math.random() < lane * 0.5;
    f.frequency.value = tin ? 3200 + Math.random() * 2500 : 1800 + Math.random() * 4000; f.Q.value = tin ? 14 : 5;
    const g = ctx.createGain();
    const pan = ctx.createStereoPanner(); pan.pan.value = Math.random() * 2 - 1;
    const v = (tin ? 0.08 : 0.05) + Math.random() * 0.08;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (tin ? 0.12 : 0.04) + Math.random() * 0.05);
    src.connect(f).connect(g).connect(pan).connect(this.master);
    src.start(t, Math.random() * 3, 0.2);
  }

  /** tanpura: Pa, Sa, Sa, low Sa, plucked in turn, each a buzzing sawtooth with a long decay */
  private pluckDrone() {
    const ctx = this.ctx!;
    const freqs = [SA * 0.75, SA, SA, SA / 2];
    const f0 = freqs[this.droneString++ % 4];
    const t = ctx.currentTime;
    const out = ctx.createGain(); out.gain.value = 1;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 6;
    lp.frequency.setValueAtTime(3200, t); lp.frequency.exponentialRampToValueAtTime(700, t + 3.5);
    for (const det of [-2.5, 2.5]) {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f0; o.detune.value = det;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.18, t + 0.04); g.gain.exponentialRampToValueAtTime(0.0001, t + 4.6);
      o.connect(g).connect(lp); o.start(t); o.stop(t + 4.7);
    }
    lp.connect(out).connect(this.drone);
  }

  /** a note of Megh for every lamp that catches */
  ignite() {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const ratio = MEGH[PHRASE[this.note++ % PHRASE.length]];
    const f = SA * 2 * ratio;
    const t = ctx.currentTime + 0.01;
    const pan = ctx.createStereoPanner(); pan.pan.value = (Math.random() - 0.5) * 0.6;
    const out = ctx.createGain(); out.gain.value = 0.16;
    out.connect(pan); pan.connect(this.master); pan.connect(this.verbIn);
    // a struck string: a few partials, the upper ones dying first (santoor-ish)
    for (const [r, a, d] of [[1, 1, 2.6], [2, 0.4, 1.4], [3, 0.18, 0.8], [4.02, 0.08, 0.5]] as const) {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f * r;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(out); o.start(t); o.stop(t + d + 0.05);
    }
    // a breath of the flame catching
    const src = ctx.createBufferSource(); src.buffer = this.noise;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.8;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0, t); g.gain.linearRampToValueAtTime(0.06, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    src.connect(bp).connect(g).connect(this.master); src.start(t, Math.random() * 3, 0.5);
  }

  /** paper being creased: bursts of crackle */
  crinkle(seconds: number) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const n = Math.floor(seconds * 9);
    for (let i = 0; i < n; i++) {
      const t = ctx.currentTime + Math.random() * seconds;
      const src = ctx.createBufferSource(); src.buffer = this.noise;
      const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1500 + Math.random() * 3000;
      const g = ctx.createGain(); const v = 0.05 + Math.random() * 0.12;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03 + Math.random() * 0.1);
      src.connect(f).connect(g).connect(this.master); src.start(t, Math.random() * 3, 0.2);
    }
  }

  splash() {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const src = ctx.createBufferSource(); src.buffer = this.noise;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
    lp.frequency.setValueAtTime(2600, t); lp.frequency.exponentialRampToValueAtTime(200, t + 0.6);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0, t); g.gain.linearRampToValueAtTime(0.4, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
    src.connect(lp).connect(g); g.connect(this.master); g.connect(this.verbIn);
    src.start(t, Math.random() * 3, 1);
  }

  bump() {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(50, t + 0.15);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    o.connect(g).connect(this.master); o.start(t); o.stop(t + 0.25);
    this.crinkle(0.25);
  }

  thunder(distance: number) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime + distance * 1.4 + 0.15;
    const dur = 4 + distance * 2;
    const src = ctx.createBufferSource(); src.buffer = this.noise; src.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.9;
    lp.frequency.setValueAtTime(distance < 0.5 ? 2200 : 900, t); lp.frequency.exponentialRampToValueAtTime(80, t + dur);
    const g = ctx.createGain(); const peak = Math.min(1, 0.9 / (0.4 + distance)) * 0.85;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + (distance < 0.5 ? 0.05 : 0.45));
    for (let i = 1; i < 4; i++) g.gain.linearRampToValueAtTime(peak * (0.4 + Math.random() * 0.5) / i, t + dur * i / 4.5);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(lp).connect(g); g.connect(this.master); g.connect(this.verbIn);
    src.start(t, Math.random() * 3); src.stop(t + dur + 0.1);
  }

  bell(pan = 0) {
    if (!this.ctx || !this.enabled) return;
    const ctx = this.ctx, t = ctx.currentTime + 0.05;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3000;
    const p = ctx.createStereoPanner(); p.pan.value = pan;
    const out = ctx.createGain(); out.gain.value = 0.14;
    lp.connect(out).connect(p); p.connect(this.master); p.connect(this.verbIn);
    const base = SA * 4;
    for (const [r, a, d] of [[0.5, 0.35, 6], [1, 0.5, 4.5], [1.183, 0.25, 3.5], [1.506, 0.22, 3], [2, 0.18, 2.5], [2.514, 0.12, 2], [2.662, 0.1, 1.8]] as const) {
      const o = ctx.createOscillator(); o.frequency.value = base * r;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(lp); o.start(t); o.stop(t + d + 0.1);
    }
  }

  private cricket() {
    const ctx = this.ctx!, t0 = ctx.currentTime;
    const pan = ctx.createStereoPanner(); pan.pan.value = Math.random() * 1.6 - 0.8; pan.connect(this.crickets);
    const freq = 4300 + Math.random() * 500;
    for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
      const t = t0 + i * 0.07;
      const o = ctx.createOscillator(); o.frequency.value = freq;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.5, t + 0.01); g.gain.linearRampToValueAtTime(0, t + 0.045);
      o.connect(g).connect(pan); o.start(t); o.stop(t + 0.06);
    }
  }
}
