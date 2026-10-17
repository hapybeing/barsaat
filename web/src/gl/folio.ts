import * as THREE from 'three';
import { vert, frag, MAX_SEG } from './shader';
import border from '../border.json';

export const PLATES = ['p1-ramagiri', 'p3-reva', 'p4-ujjain', 'p5-ganga', 'p6-himalaya', 'p7-alaka'];
// where the cover-crop should centre on each plate, and where its sky ends (for lightning and cranes)
const FOCUS: [number, number][] = [[0.42, 0.42], [0.5, 0.5], [0.55, 0.42], [0.5, 0.45], [0.5, 0.42], [0.55, 0.62]];
export const SKY = [0.5, 0.26, 0.33, 0.25, 0.36, 0.34];

type Tex = { img: THREE.Texture; mask: THREE.Texture; size: THREE.Vector2; ready: boolean };

export class Folio {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  mat: THREE.ShaderMaterial;
  u: Record<string, THREE.IUniform>;
  tex: Tex[] = [];
  blank: THREE.Texture;
  msgCanvas = document.createElement('canvas');
  msgTex: THREE.CanvasTexture;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' });
    this.renderer.setClearColor(0x000000, 0);
    this.blank = new THREE.DataTexture(new Uint8Array([20, 19, 18, 255]), 1, 1);
    this.blank.needsUpdate = true;
    this.msgCanvas.width = 1024; this.msgCanvas.height = 384;
    this.msgTex = new THREE.CanvasTexture(this.msgCanvas);
    this.msgTex.generateMipmaps = true;
    this.msgTex.minFilter = THREE.LinearMipmapLinearFilter;
    const segs: THREE.Vector4[] = [];
    for (let i = 0; i < MAX_SEG; i++) segs.push(new THREE.Vector4());
    const v2 = (x = 0, y = 0) => ({ value: new THREE.Vector2(x, y) });
    this.u = {
      uRes: v2(1, 1), uWin: { value: new THREE.Vector4(0, 0, 1, 1) },
      uArch: { value: 0 }, uBand: { value: 22 }, uBorderAsp: { value: border.aspect }, uOpaqueTop: { value: 0 }, uShow: { value: 1 }, uPx: { value: 1 },
      tA: { value: this.blank }, mA: { value: this.blank }, uSizeA: v2(880, 1200), uFocA: v2(0.5, 0.5),
      tB: { value: this.blank }, mB: { value: this.blank }, uSizeB: v2(880, 1200), uFocB: v2(0.5, 0.5),
      uMix: { value: 0 }, tBorder: { value: this.blank },
      tMsg: { value: this.msgTex }, uMsgRect: { value: new THREE.Vector4(0.1, 0.3, 0.8, 0.3) }, uMsg: { value: 0 }, uMsgT: { value: 0 },
      uTime: { value: 0 }, uRain: { value: 0 }, uSlant: { value: 0 }, uStorm: { value: 0 }, uWet: { value: 0 }, uDusk: { value: 0 },
      uClear: { value: 0 }, uDry: { value: 0 }, uWind: { value: 0 }, uBurst: { value: 0 }, uMap: { value: 0 }, uCalm: { value: 0 },
      uPar: v2(), uFlash: { value: 0 },
      uSeg: { value: segs }, uSegN: { value: 0 }, uBoltT: { value: 0 }, uBoltA: { value: 0 },
      uCrane: { value: -1 }, uDim: { value: 0 }, uCraneY: { value: 0.12 },
    };
    this.mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms: this.u, depthTest: false, depthWrite: false, transparent: true });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.mat);
    quad.frustumCulled = false;
    this.scene.add(quad);
    for (let i = 0; i < PLATES.length; i++) this.tex.push({ img: this.blank, mask: this.blank, size: new THREE.Vector2(880, 1200), ready: false });
  }

  private load(url: string) {
    return new Promise<THREE.Texture>((res, rej) => {
      new THREE.TextureLoader().load(url, t => {
        t.colorSpace = THREE.NoColorSpace;
        t.generateMipmaps = true;
        t.minFilter = THREE.LinearMipmapLinearFilter;
        t.anisotropy = 2;
        res(t);
      }, undefined, rej);
    });
  }

  async loadBorder() {
    const t = await this.load('./folio/border.webp');
    t.wrapS = THREE.RepeatWrapping;
    t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; // no seams from mip bleeding across the repeat
    this.u.tBorder.value = t;
    this.renderer.initTexture(t);
  }

  async loadPlate(i: number) {
    if (this.tex[i].ready) return;
    const [img, mask] = await Promise.all([this.load(`./plates/${PLATES[i]}.webp`), this.load(`./plates/${PLATES[i]}-mask.webp`)]);
    const im = img.image as HTMLImageElement;
    this.tex[i] = { img, mask, size: new THREE.Vector2(im.naturalWidth || 880, im.naturalHeight || 1200), ready: true };
    this.renderer.initTexture(img); this.renderer.initTexture(mask);
  }

  setPlates(a: number, b: number, mix: number) {
    const A = this.tex[a] ?? this.tex[0], B = this.tex[b] ?? A;
    this.u.tA.value = A.img; this.u.mA.value = A.mask; (this.u.uSizeA.value as THREE.Vector2).copy(A.size);
    (this.u.uFocA.value as THREE.Vector2).set(...(FOCUS[a] ?? [0.5, 0.5]));
    this.u.tB.value = B.img; this.u.mB.value = B.mask; (this.u.uSizeB.value as THREE.Vector2).copy(B.size);
    (this.u.uFocB.value as THREE.Vector2).set(...(FOCUS[b] ?? [0.5, 0.5]));
    this.u.uMix.value = a === b ? 0 : mix;
  }

  /** draw the visitor's message, by hand, onto the glass texture */
  writeMessage(text: string) {
    const c = this.msgCanvas, g = c.getContext('2d')!;
    g.fillStyle = '#000'; g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
    const words = text.trim().split(/\s+/);
    let size = 92;
    let lines: string[] = [];
    for (; size > 40; size -= 4) {
      g.font = `400 ${size}px Kalam, cursive`;
      lines = []; let line = '';
      for (const w of words) {
        const t = line ? line + ' ' + w : w;
        if (g.measureText(t).width > c.width * 0.9 && line) { lines.push(line); line = w; } else line = t;
      }
      if (line) lines.push(line);
      if (lines.length * size * 1.15 <= c.height * 0.92) break;
    }
    const lh = size * 1.12;
    lines.forEach((l, i) => g.fillText(l, c.width / 2, c.height / 2 + (i - (lines.length - 1) / 2) * lh));
    this.msgTex.needsUpdate = true;
  }

  resize(w: number, h: number, dpr: number) {
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    (this.u.uRes.value as THREE.Vector2).set(w, h);
    this.u.uPx.value = dpr;
  }

  bolt(skyLimit: number) {
    const segs = this.u.uSeg.value as THREE.Vector4[];
    let x = 0.2 + Math.random() * 0.6, y = 0.0;
    const end = Math.max(0.2, skyLimit * (0.8 + Math.random() * 0.35));
    const n = 8 + Math.floor(Math.random() * 3);
    let k = 0;
    const pts: [number, number][] = [[x, y]];
    for (let i = 0; i < n; i++) { x += (Math.random() - 0.5) * 0.09; y += end / n; pts.push([x, y]); }
    for (let i = 0; i < pts.length - 1 && k < MAX_SEG; i++) segs[k++].set(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
    const f = 2 + Math.floor(Math.random() * 4);
    let fx = pts[f][0], fy = pts[f][1];
    const dir = Math.random() > 0.5 ? 1 : -1;
    for (let i = 0; i < 3 && k < MAX_SEG; i++) {
      const nx = fx + dir * 0.04 + (Math.random() - 0.5) * 0.03, ny = fy + (end / n) * 0.8;
      segs[k++].set(fx, fy, nx, ny); fx = nx; fy = ny;
    }
    this.u.uSegN.value = k;
  }

  render() { this.renderer.render(this.scene, this.camera); }
}
