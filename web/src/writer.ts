// The invisible finger. Every word in Barsaat is written into the fog on the glass:
// the title, the hint, the poem, the credit. Text is rasterised once into a mask, and the fog
// pass clears it behind a wobbling "pen" front that sweeps left to right.

export interface Line { hi?: string; en?: string; hint?: string }

const HI_FONT = '"Tiro Devanagari Hindi", "Noto Serif Devanagari", serif';
const EN_FONT = '"Cormorant Garamond", Georgia, serif';

export class Writer {
  canvas = document.createElement('canvas');
  private ctx = this.canvas.getContext('2d')!;
  front = 0;
  on = 0;
  writing = false;
  private x0 = 0; private x1 = 1;
  private t = 0; private dur = 1; private hold = 1.4;
  private active = false;
  onUpload: (c: HTMLCanvasElement) => void = () => {};
  onStart: () => void = () => {};

  /** where on the glass the next line goes, as a fraction of the view */
  write(line: Line, view: { w: number; h: number }, place: { x: number; y: number; align: 'left' | 'center' | 'right' }, scale = 1) {
    const s = Math.min(2, devicePixelRatio || 1) * 0.75;
    const W = Math.round(view.w * s), H = Math.round(view.h * s);
    if (this.canvas.width !== W || this.canvas.height !== H) { this.canvas.width = W; this.canvas.height = H; }
    const c = this.ctx;
    c.clearRect(0, 0, W, H);
    c.textBaseline = 'alphabetic';
    c.textAlign = place.align;
    c.fillStyle = '#fff';
    c.strokeStyle = '#fff';
    c.lineJoin = 'round';
    c.lineCap = 'round';
    const base = Math.min(view.w, view.h * 1.3) * s * scale;
    let y = place.y * H;
    const x = place.x * W;
    let minX = Infinity, maxX = -Infinity;
    const measure = (text: string) => {
      const m = c.measureText(text).width;
      const left = place.align === 'left' ? x : place.align === 'center' ? x - m / 2 : x - m;
      minX = Math.min(minX, left); maxX = Math.max(maxX, left + m);
    };
    const maxW = W * (place.align === 'center' ? 0.86 : 0.7);
    const fit = (font: (sz: number) => string, size: number, text: string) => {
      c.font = font(size);
      const m = c.measureText(text).width;
      if (m > maxW) { size *= maxW / m; c.font = font(size); }
      return size;
    };
    if (line.hi) {
      const size = fit(sz => `${sz}px ${HI_FONT}`, base * 0.1, line.hi);
      c.lineWidth = size * 0.055; // a fingertip is wider than a pen
      c.strokeText(line.hi, x, y);
      c.fillText(line.hi, x, y);
      measure(line.hi);
      y += size * 0.78;
    }
    if (line.en) {
      const size = fit(sz => `italic 500 ${sz}px ${EN_FONT}`, base * (line.hi ? 0.044 : 0.06), line.en);
      c.lineWidth = size * 0.07;
      c.strokeText(line.en, x, y);
      c.fillText(line.en, x, y);
      measure(line.en);
    }
    if (line.hint) {
      const size = fit(sz => `italic 500 ${sz}px ${EN_FONT}`, base * 0.04, line.hint);
      c.lineWidth = size * 0.08;
      c.fillText(line.hint, x, y);
      c.strokeText(line.hint, x, y);
      measure(line.hint);
    }
    this.x0 = minX / W - 0.01; this.x1 = maxX / W + 0.01;
    this.dur = Math.max(1.2, (this.x1 - this.x0) * 4.2);
    this.t = 0;
    this.active = true;
    this.onUpload(this.canvas);
    this.onStart();
  }

  step(dt: number) {
    if (!this.active) { this.on = 0; this.writing = false; return; }
    this.t += dt;
    const k = Math.min(1, this.t / this.dur);
    // a hand slows into the end of a word
    const e = 1 - Math.pow(1 - k, 1.6);
    this.front = this.x0 + (this.x1 - this.x0) * e;
    this.writing = k < 1;
    this.on = this.t < this.dur + this.hold ? 1 : 0;
    if (!this.on) this.active = false;
  }

  get busy() { return this.active; }
}
