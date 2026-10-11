// A page from a school notebook, ruled in blue with a red margin. The visitor writes on it
// with a finger, and this same canvas becomes the paper of the boat.

export const TEX_W = 1024;
export const TEX_H = 1321; // the sheet's aspect, 0.62 x 0.8

const INK = '#1f2f6b';

export class Page {
  canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private drawing = false;
  private last: { x: number; y: number; t: number } | null = null;
  private width = 6;
  inked = 0; // how much has been written, in px of stroke
  onInk: () => void = () => {};

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    canvas.width = TEX_W; canvas.height = TEX_H;
    this.ctx = canvas.getContext('2d')!;
    this.clear();
    canvas.addEventListener('pointerdown', e => this.down(e));
    canvas.addEventListener('pointermove', e => this.move(e));
    for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) canvas.addEventListener(ev, () => this.up());
  }

  clear() {
    const c = this.ctx;
    // paper: warm off-white with a little tooth and a darker edge
    c.fillStyle = '#ece4d2';
    c.fillRect(0, 0, TEX_W, TEX_H);
    const img = c.getImageData(0, 0, TEX_W, TEX_H);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 9;
      d[i] += n; d[i + 1] += n; d[i + 2] += n * 0.8;
    }
    c.putImageData(img, 0, 0);
    const vg = c.createRadialGradient(TEX_W / 2, TEX_H / 2, TEX_H * 0.3, TEX_W / 2, TEX_H / 2, TEX_H * 0.75);
    vg.addColorStop(0, 'rgba(120,90,50,0)'); vg.addColorStop(1, 'rgba(120,90,50,0.18)');
    c.fillStyle = vg; c.fillRect(0, 0, TEX_W, TEX_H);
    // ruling
    c.strokeStyle = 'rgba(70,110,190,0.42)'; c.lineWidth = 2;
    for (let y = 150; y < TEX_H - 30; y += 52) { c.beginPath(); c.moveTo(0, y); c.lineTo(TEX_W, y); c.stroke(); }
    c.strokeStyle = 'rgba(200,60,70,0.55)'; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(118, 0); c.lineTo(118, TEX_H); c.stroke();
    c.beginPath(); c.moveTo(124, 0); c.lineTo(124, TEX_H); c.stroke();
    // the little date box every Indian notebook page has
    c.fillStyle = 'rgba(40,50,90,0.55)';
    c.font = '30px "Tiro Devanagari Hindi", serif';
    c.textAlign = 'right';
    c.fillText('दिनांक ............', TEX_W - 50, 100);
    c.textAlign = 'left';
    this.inked = 0;
  }

  private pt(e: PointerEvent) {
    const r = this.canvas.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * TEX_W, y: ((e.clientY - r.top) / r.height) * TEX_H, t: performance.now() };
  }

  private down(e: PointerEvent) {
    e.preventDefault();
    this.canvas.setPointerCapture(e.pointerId);
    this.drawing = true;
    this.last = this.pt(e);
    this.width = 7;
    this.dot(this.last.x, this.last.y);
  }

  private move(e: PointerEvent) {
    if (!this.drawing || !this.last) return;
    const events = (e.getCoalescedEvents?.() || [e]);
    for (const ev of events) {
      const p = this.pt(ev);
      const dx = p.x - this.last.x, dy = p.y - this.last.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 1.5) continue;
      const speed = dist / Math.max(1, p.t - this.last.t);
      // a ballpoint: thinner when fast, a touch of ink pooling when slow
      const target = Math.max(3.5, Math.min(9, 9 - speed * 2.2));
      this.width += (target - this.width) * 0.35;
      const c = this.ctx;
      c.strokeStyle = INK; c.lineCap = 'round'; c.lineJoin = 'round';
      c.lineWidth = this.width;
      c.globalAlpha = 0.9;
      c.beginPath(); c.moveTo(this.last.x, this.last.y); c.lineTo(p.x, p.y); c.stroke();
      c.globalAlpha = 1;
      this.inked += dist;
      this.last = p;
    }
    this.onInk();
  }

  private dot(x: number, y: number) {
    const c = this.ctx;
    c.fillStyle = INK; c.globalAlpha = 0.9;
    c.beginPath(); c.arc(x, y, 3.5, 0, Math.PI * 2); c.fill();
    c.globalAlpha = 1;
  }

  private up() { this.drawing = false; this.last = null; }

  /** if nothing was written, the page writes itself */
  ensureWriting() {
    if (this.inked > 60) return;
    const c = this.ctx;
    c.save();
    c.translate(TEX_W * 0.52, TEX_H * 0.53);
    c.rotate(-0.06);
    c.fillStyle = INK;
    c.textAlign = 'center';
    c.font = '150px "Tiro Devanagari Hindi", serif';
    c.globalAlpha = 0.88;
    c.fillText('बरसात', 0, 0);
    c.font = 'italic 44px "Cormorant Garamond", serif';
    c.fillText('take me to the sea', 0, 86);
    c.restore();
    this.inked = 999;
  }
}
