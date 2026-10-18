// The soundtrack: real recordings, mixed live by the story.
//  - Raag Megh Malhar (calm chapters) and Miyan ki Malhar (the storm), excerpts of NCERT's
//    "Rag Ras Barse" recordings (CC BY 3.0), crossfaded by the storm level.
//  - Three rain beds (veranda drizzle → steady rain → full storm) crossfaded by rain intensity.
//  - Thunder: real strikes, placed at a distance (delay + low-pass) or right overhead.
//  - The room: when you read inside the folio the rain is heard through a window (muffled);
//    when the painting goes full-bleed the window opens.
// Nothing plays until the visitor chooses sound. Everything fades; nothing starts abruptly.

type Bed = { gain: GainNode; buf: AudioBuffer | null; src: AudioBufferSourceNode | null };

const FILES = ['rain-light', 'rain-mid', 'storm', 'megh', 'miyan', 'koel', 'thunder-0', 'thunder-1', 'thunder-2', 'thunder-3'] as const;
type Name = typeof FILES[number];

const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export class Score {
  ctx: AudioContext | null = null;
  on = false;
  private master!: GainNode;
  private ambience!: GainNode;
  private window!: BiquadFilterNode;
  private music!: GainNode;
  private beds = new Map<Name, Bed>();
  private bufs = new Map<Name, AudioBuffer>();
  private lastThunder = 0;
  state = { rain: 0, storm: 0, ch: 0, clear: 0, msg: 0, full: 1, show: 1 };

  async start() {
    if (this.ctx) { if (this.ctx.state !== 'running') await this.ctx.resume(); return; }
    const ctx = new AudioContext({ latencyHint: 'playback' });
    this.ctx = ctx;
    // gentle safety limiter, never pumping
    const lim = ctx.createDynamicsCompressor();
    lim.threshold.value = -8; lim.knee.value = 6; lim.ratio.value = 6; lim.attack.value = 0.01; lim.release.value = 0.4;
    this.master = ctx.createGain(); this.master.gain.value = 0;
    this.master.connect(lim).connect(ctx.destination);
    this.window = ctx.createBiquadFilter(); this.window.type = 'lowpass'; this.window.frequency.value = 2400; this.window.Q.value = 0.5;
    this.ambience = ctx.createGain(); this.ambience.gain.value = 1;
    this.ambience.connect(this.window).connect(this.master);
    this.music = ctx.createGain(); this.music.gain.value = 1;
    this.music.connect(this.master);
    for (const n of ['rain-light', 'rain-mid', 'storm', 'koel'] as Name[]) this.beds.set(n, this.bed(this.ambience));
    for (const n of ['megh', 'miyan'] as Name[]) this.beds.set(n, this.bed(this.music));
    void this.loadAll();
  }

  private bed(out: AudioNode): Bed {
    const gain = this.ctx!.createGain(); gain.gain.value = 0; gain.connect(out);
    return { gain, buf: null, src: null };
  }

  private async loadAll() {
    // first what the opening needs, then the rest
    const order: Name[] = ['rain-light', 'megh', 'koel', 'rain-mid', 'thunder-0', 'thunder-1', 'storm', 'miyan', 'thunder-2', 'thunder-3'];
    for (const n of order) {
      try {
        const res = await fetch(`./sound/${n}.m4a`);
        const buf = await this.ctx!.decodeAudioData(await res.arrayBuffer());
        this.bufs.set(n, buf);
        const b = this.beds.get(n);
        if (b) { b.buf = buf; this.play(b, n === 'koel' ? false : true); }
      } catch (e) { console.warn('sound', n, e); }
    }
  }

  private play(b: Bed, loop: boolean) {
    if (!b.buf || b.src) return;
    const s = this.ctx!.createBufferSource();
    s.buffer = b.buf; s.loop = loop;
    s.connect(b.gain);
    s.start(0, loop ? Math.random() * b.buf.duration * 0.5 : 0);
    if (!loop) s.onended = () => { b.src = null; };
    b.src = s;
  }

  setOn(v: boolean) {
    this.on = v;
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(v ? 1.0 : 0, t + (v ? 3.5 : 0.6));
  }

  /** a real thunder strike; near = overhead (held press), otherwise somewhere over the hills */
  thunder(distance = 0.4) {
    if (!this.ctx || !this.on) return;
    const now = this.ctx.currentTime;
    if (now - this.lastThunder < 1.2) return;
    this.lastThunder = now;
    const picks = (['thunder-0', 'thunder-1', 'thunder-2', 'thunder-3'] as Name[]).filter(n => this.bufs.has(n));
    if (!picks.length) return;
    const buf = this.bufs.get(picks[Math.floor(Math.random() * picks.length)])!;
    const s = this.ctx.createBufferSource(); s.buffer = buf; s.playbackRate.value = 0.92 + Math.random() * 0.14;
    const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 9000 - distance * 7500;
    const g = this.ctx.createGain(); g.gain.value = 0.9 - distance * 0.55;
    const pan = this.ctx.createStereoPanner(); pan.pan.value = (Math.random() - 0.5) * 0.8;
    s.connect(lp).connect(g).connect(pan).connect(this.master);
    // sound travels: a far strike arrives a moment after its flash
    s.start(now + 0.05 + distance * 1.8);
  }

  /** held press: the window opens and the storm leans in */
  swell() { this.thunder(0.02); }

  update(_dt: number) {
    if (!this.ctx || !this.on) return;
    const t = this.ctx.currentTime, s = this.state;
    const set = (n: Name, v: number, tc = 1.2) => { const b = this.beds.get(n); if (b) b.gain.gain.setTargetAtTime(v, t, tc); };
    const r = s.rain;
    const duck = (1 - s.msg * 0.75) * (0.35 + 0.65 * s.show);
    // rain beds, never all at once; at most two overlap in a crossfade
    set('rain-light', 0.55 * smooth(0.02, 0.12, r) * (1 - smooth(0.35, 0.55, r)) * duck);
    set('rain-mid', 0.5 * smooth(0.3, 0.5, r) * (1 - smooth(0.72, 0.9, r)) * duck);
    set('storm', 0.62 * smooth(0.7, 0.9, r) * duck);
    // the koel sings in the heat before the rain, and once more when it clears
    const koel = (s.ch <= 1 && r < 0.2 ? 1 : 0) + (s.clear > 0.6 && s.msg < 0.3 ? 0.8 : 0);
    set('koel', 0.35 * Math.min(1, koel) * s.show, 2.5);
    const kb = this.beds.get('koel');
    if (kb && kb.buf && !kb.src && koel > 0) this.play(kb, true);
    // music: Megh when calm, Miyan ki Malhar when the storm rises
    const stormy = smooth(0.5, 0.75, s.storm);
    const mv = 0.62 * (0.75 + 0.25 * s.full) * (s.show > 0.5 ? 1 : 0.7);
    set('megh', mv * (1 - stormy), 2.5);
    set('miyan', mv * stormy, 2.5);
    // the window: muffled inside the folio, open when the painting fills the screen
    this.window.frequency.setTargetAtTime(1800 + 9000 * s.full * s.full, t, 0.6);
  }
}
