import { compile, uniforms, target, freeTarget, imageTexture, bindTex, texture, type GL, type Target } from './util';
import { QUAD_VS, DROP_VS, DROP_FS, FADE_FS, BLIT_FS, FOG_FS, COMPOSITE_FS } from './shaders';
import type { Rain, Stamp } from '../sim/drops';

export interface Seg { x0: number; y0: number; x1: number; y1: number; r: number }

export interface FrameInput {
  dt: number;
  time: number;
  segs: Seg[];
  breath: { x: number; y: number; s: number; r: number } | null;
  regrow: number;
  flash: number;
  dark: number;
  rain: number;
  lamps: Float32Array; lampN: number;
  bolt: Float32Array; boltN: number;
  textFront: number; textOn: number;
  reveal: number;
}

const PLATE_W = 1376, PLATE_H = 768;
const PLATE_FOCUS_X = 0.6; // the temple sits here; portrait crops keep it

export class Renderer {
  readonly gl: GL;
  private canvas: HTMLCanvasElement;
  private progDrop: WebGLProgram; private uDrop;
  private progFade: WebGLProgram; private uFade;
  private progBlit: WebGLProgram; private uBlit;
  private progFog: WebGLProgram; private uFog;
  private progComp: WebGLProgram; private uComp;
  private vaoQuad: WebGLVertexArrayObject;
  private vaoDrop: WebGLVertexArrayObject;
  private instBuf: WebGLBuffer;
  private inst = new Float32Array(4 * 4096);
  private plate: WebGLTexture; private blur: WebGLTexture;
  private textTex: WebGLTexture;
  private fogA: Target | null = null; private fogB: Target | null = null;
  private beads: Target | null = null; private water: Target | null = null;
  private fogInit = true;
  view = { w: 1, h: 1 };
  dpr = 1;
  private simScale = 0.5;
  private segArr = new Float32Array(12 * 4);
  private segR = new Float32Array(12);

  constructor(canvas: HTMLCanvasElement, plate: HTMLImageElement, blur: HTMLImageElement) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
    if (!gl) throw new Error('no webgl2');
    this.gl = gl;

    this.progDrop = compile(gl, DROP_VS, DROP_FS); this.uDrop = uniforms(gl, this.progDrop, ['uView', 'uMode', 'uStrength'] as const);
    this.progFade = compile(gl, QUAD_VS, FADE_FS); this.uFade = uniforms(gl, this.progFade, ['uK'] as const);
    this.progBlit = compile(gl, QUAD_VS, BLIT_FS); this.uBlit = uniforms(gl, this.progBlit, ['uTex'] as const);
    this.progFog = compile(gl, QUAD_VS, FOG_FS);
    this.uFog = uniforms(gl, this.progFog, ['uPrev', 'uWater', 'uText', 'uView', 'uDt', 'uRegrow', 'uTime', 'uSeg', 'uSegR', 'uSegN', 'uBreath', 'uTextFront', 'uTextOn', 'uInit'] as const);
    this.progComp = compile(gl, QUAD_VS, COMPOSITE_FS);
    this.uComp = uniforms(gl, this.progComp, ['uPlate', 'uBlur', 'uFog', 'uWater', 'uRes', 'uView', 'uCover', 'uTime', 'uFlash', 'uDark', 'uRain', 'uLamps', 'uLampN', 'uBolt', 'uBoltN', 'uGrille', 'uReveal'] as const);

    this.vaoQuad = gl.createVertexArray()!;

    this.vaoDrop = gl.createVertexArray()!;
    gl.bindVertexArray(this.vaoDrop);
    const corner = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, corner);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    this.instBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.inst.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(1, 1);
    gl.bindVertexArray(null);

    this.plate = imageTexture(gl, plate);
    this.blur = imageTexture(gl, blur);
    this.textTex = texture(gl, 1, 1);
  }

  /** size everything; sims run at reduced resolution */
  resize(w: number, h: number, dpr: number) {
    const gl = this.gl;
    this.view = { w, h };
    this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    const sw = Math.max(64, Math.round(w * this.simScale)), sh = Math.max(64, Math.round(h * this.simScale));
    const oldFog = this.fogA;
    const fa = target(gl, sw, sh), fb = target(gl, sw, sh);
    if (oldFog) {
      // carry the fog over so a rotation doesn't reset the glass
      gl.useProgram(this.progBlit);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fa.fbo);
      gl.viewport(0, 0, sw, sh);
      bindTex(gl, 0, oldFog.tex, this.uBlit.uTex);
      gl.bindVertexArray(this.vaoQuad);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else this.fogInit = true;
    freeTarget(gl, this.fogA); freeTarget(gl, this.fogB);
    this.fogA = fa; this.fogB = fb;
    freeTarget(gl, this.beads); freeTarget(gl, this.water);
    this.beads = target(gl, sw, sh);
    this.water = target(gl, sw, sh);
  }

  /** change only the output resolution (adaptive quality); sims keep their state */
  setDpr(dpr: number) {
    this.dpr = dpr;
    this.canvas.width = Math.round(this.view.w * dpr);
    this.canvas.height = Math.round(this.view.h * dpr);
  }

  setText(canvas: HTMLCanvasElement) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.textTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  }

  private stamps(list: Stamp[], mode: number, strength: number) {
    const gl = this.gl;
    let i = 0;
    while (i < list.length) {
      const n = Math.min(list.length - i, this.inst.length / 4);
      for (let k = 0; k < n; k++) {
        const s = list[i + k];
        this.inst[k * 4] = s.x; this.inst[k * 4 + 1] = s.y; this.inst[k * 4 + 2] = s.rx; this.inst[k * 4 + 3] = s.ry;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, this.instBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.inst, 0, n * 4);
      gl.uniform1i(this.uDrop.uMode, mode);
      gl.uniform1f(this.uDrop.uStrength, strength);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, n);
      i += n;
    }
  }

  render(rain: Rain, f: FrameInput, composite = true) {
    const gl = this.gl;
    const { w, h } = this.view;
    const beads = this.beads!, water = this.water!;

    // 1) persistent bead layer: evaporate a little, erase runner paths, settle new beads
    gl.bindFramebuffer(gl.FRAMEBUFFER, beads.fbo);
    gl.viewport(0, 0, beads.w, beads.h);
    gl.enable(gl.BLEND);
    // fade and erase scale what's there (dst *= 1 - a); they must never add coverage
    gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(this.progFade);
    gl.uniform1f(this.uFade.uK, Math.min(1, f.dt * 0.05));
    gl.bindVertexArray(this.vaoQuad);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.useProgram(this.progDrop);
    gl.uniform2f(this.uDrop.uView, w, h);
    gl.bindVertexArray(this.vaoDrop);
    if (rain.erase.length) this.stamps(rain.erase, 1, 1);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    if (rain.beads.length) this.stamps(rain.beads, 0, 0.45); // beads stay below the fog-cutting threshold

    // 2) water map = beads + live drops
    gl.bindFramebuffer(gl.FRAMEBUFFER, water.fbo);
    gl.viewport(0, 0, water.w, water.h);
    gl.disable(gl.BLEND);
    gl.useProgram(this.progBlit);
    bindTex(gl, 0, beads.tex, this.uBlit.uTex);
    gl.bindVertexArray(this.vaoQuad);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(this.progDrop);
    gl.uniform2f(this.uDrop.uView, w, h);
    gl.bindVertexArray(this.vaoDrop);
    const n = rain.fill(this.inst);
    if (n) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.instBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.inst, 0, n * 4);
      gl.uniform1i(this.uDrop.uMode, 0);
      gl.uniform1f(this.uDrop.uStrength, 1);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, n);
    }
    gl.disable(gl.BLEND);

    // 3) fog step
    const segN = Math.min(12, f.segs.length);
    for (let i = 0; i < segN; i++) {
      const s = f.segs[f.segs.length - segN + i];
      this.segArr.set([s.x0, s.y0, s.x1, s.y1], i * 4);
      this.segR[i] = s.r;
    }
    const fogA = this.fogA!, fogB = this.fogB!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fogB.fbo);
    gl.viewport(0, 0, fogB.w, fogB.h);
    gl.useProgram(this.progFog);
    const u = this.uFog;
    bindTex(gl, 0, fogA.tex, u.uPrev);
    bindTex(gl, 1, water.tex, u.uWater);
    bindTex(gl, 2, this.textTex, u.uText);
    gl.uniform2f(u.uView, w, h);
    gl.uniform1f(u.uDt, f.dt);
    gl.uniform1f(u.uRegrow, f.regrow);
    gl.uniform1f(u.uTime, f.time);
    gl.uniform4fv(u.uSeg, this.segArr);
    gl.uniform1fv(u.uSegR, this.segR);
    gl.uniform1i(u.uSegN, segN);
    if (f.breath) gl.uniform4f(u.uBreath, f.breath.x, f.breath.y, f.breath.s, f.breath.r);
    else gl.uniform4f(u.uBreath, 0, 0, 0, 1);
    gl.uniform1f(u.uTextFront, f.textFront);
    gl.uniform1f(u.uTextOn, f.textOn);
    gl.uniform1f(u.uInit, this.fogInit ? 1 : 0);
    this.fogInit = false;
    gl.bindVertexArray(this.vaoQuad);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.fogA = fogB; this.fogB = fogA;

    if (!composite) return;
    // 4) composite to screen
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.progComp);
    const c = this.uComp;
    bindTex(gl, 0, this.plate, c.uPlate);
    bindTex(gl, 1, this.blur, c.uBlur);
    bindTex(gl, 2, this.fogA.tex, c.uFog);
    bindTex(gl, 3, water.tex, c.uWater);
    gl.uniform2f(c.uRes, this.canvas.width, this.canvas.height);
    gl.uniform2f(c.uView, w, h);
    const cov = this.cover(w, h);
    gl.uniform4f(c.uCover, cov[0], cov[1], cov[2], cov[3]);
    gl.uniform1f(c.uTime, f.time);
    gl.uniform1f(c.uFlash, f.flash);
    gl.uniform1f(c.uDark, f.dark);
    gl.uniform1f(c.uRain, f.rain);
    gl.uniform4fv(c.uLamps, f.lamps);
    gl.uniform1i(c.uLampN, f.lampN);
    gl.uniform4fv(c.uBolt, f.bolt);
    gl.uniform1i(c.uBoltN, f.boltN);
    gl.uniform1f(c.uGrille, 0); // tried a grille: it cut the view into columns, so the window stays open
    gl.uniform1f(c.uReveal, f.reveal);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /** object-fit: cover, keeping the temple in frame on portrait screens. Returns plate uv = uv*xy + zw. */
  cover(w: number, h: number): [number, number, number, number] {
    const sa = w / h, pa = PLATE_W / PLATE_H;
    if (sa > pa) {
      const sy = pa / sa;
      return [1, sy, 0, (1 - sy) * 0.55];
    }
    const sx = sa / pa;
    const ox = Math.min(1 - sx, Math.max(0, PLATE_FOCUS_X - sx / 2));
    return [sx, 1, ox, 0];
  }

  /** screen CSS px → plate uv, used to place lamps and bolts */
  toPlate(x: number, y: number): [number, number] {
    const c = this.cover(this.view.w, this.view.h);
    return [x / this.view.w * c[0] + c[2], y / this.view.h * c[1] + c[3]];
  }

  /** QA only: sample the simulation targets at the centre */
  debugRead() {
    const gl = this.gl, out: Record<string, number[]> = {};
    for (const [k, t] of [['fog', this.fogA], ['water', this.water], ['beads', this.beads]] as const) {
      const px = new Uint8Array(4);
      gl.bindFramebuffer(gl.FRAMEBUFFER, t!.fbo);
      gl.readPixels(t!.w >> 1, t!.h >> 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
      out[k] = Array.from(px);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { ...out, dpr: this.dpr, cw: this.canvas.width, view: this.view };
  }

  lose() {
    const ext = this.gl.getExtension('WEBGL_lose_context');
    ext?.loseContext();
  }
}
