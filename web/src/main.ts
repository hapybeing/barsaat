import '@fontsource/tiro-devanagari-hindi/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import './style.css';
import { Renderer } from './gl/renderer';
import { Rain } from './sim/drops';
import { Weather, type PhaseName } from './weather';
import { Hand } from './input';
import { Writer, type Line } from './writer';
import { Sound } from './audio';

const $ = <T extends HTMLElement>(s: string) => document.querySelector(s) as T;
const root = document.documentElement;
const canvas = $<HTMLCanvasElement>('#glass');
const gate = $<HTMLElement>('#gate');
const live = $<HTMLElement>('#live');
const controls = $<HTMLElement>('#controls');
const btnSound = $<HTMLButtonElement>('#btn-sound');
const btnFlash = $<HTMLButtonElement>('#btn-flash');
const btnInfo = $<HTMLButtonElement>('#btn-info');
const about = $<HTMLDialogElement>('#about');

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = matchMedia('(pointer: coarse)').matches;

// the poem: one line per turn of the weather
const POEM: Partial<Record<PhaseName, Line>> = {
  build: { hi: 'गंगा आज ऊँची बह रही है', en: 'The Ganga runs high tonight.' },
  downpour: { hi: 'बिजली ने घाट को एक पल देखा', en: 'Lightning looked at the ghat, once.' },
  ease: { hi: 'जो लिखा, बारिश ने पढ़ लिया', en: 'Whatever I wrote, the rain read.' },
  clear: { hi: 'अब दीये बहने दो', en: 'Now let the lamps float.' },
  night: { hi: 'फिर बरसेगा', en: 'It will rain again.' },
};
const TITLE: Line = { hi: 'बरसात', en: 'a window in Bhagalpur' };
const PLACES: { x: number; y: number; align: 'left' | 'center' | 'right' }[] = [
  { x: 0.07, y: 0.2, align: 'left' },
  { x: 0.93, y: 0.34, align: 'right' },
  { x: 0.07, y: 0.3, align: 'left' },
  { x: 0.93, y: 0.2, align: 'right' },
];

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.decoding = 'async';
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

function fallback(reason: string) {
  root.classList.add('nogl');
  root.dataset.reason = reason;
  gate.classList.add('is-fallback');
}

async function boot() {
  const fonts = Promise.race([
    Promise.all([
      document.fonts.load('48px "Tiro Devanagari Hindi"', 'बरसात'),
      document.fonts.load('italic 500 32px "Cormorant Garamond"'),
      document.fonts.load('500 32px "Cormorant Garamond"'),
    ]),
    new Promise(r => setTimeout(r, 2500)),
  ]);
  let plate: HTMLImageElement, blur: HTMLImageElement;
  try {
    [plate, blur] = await Promise.all([loadImage('./plate.jpg'), loadImage('./plate-blur.jpg')]);
  } catch { fallback('image'); return; }

  let r: Renderer;
  try { r = new Renderer(canvas, plate, blur); } catch (e) { fallback(String((e as Error).message || e)); return; }
  await fonts;

  const rain = new Rain();
  const weather = new Weather();
  const writer = new Writer();
  const sound = new Sound();
  const hand = new Hand(canvas, s => rain.wipe(s.x0, s.y0, s.x1, s.y1, s.r));
  writer.onUpload = c => r.setText(c);
  if (reduceMotion) weather.flashesAllowed = false;

  // device tier: the composite is the expensive pass, so output resolution is what adapts
  const qs = new URLSearchParams(location.search);
  let dpr = Math.min(devicePixelRatio || 1, coarse ? 1.25 : 1.5);
  if (qs.has('debug') && qs.get('dpr')) dpr = Number(qs.get('dpr'));
  const size = () => {
    const w = innerWidth, h = innerHeight;
    r.resize(w, h, dpr);
    rain.resize(w, h);
  };
  size();
  let rt = 0, lastW = innerWidth, lastH = innerHeight;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = window.setTimeout(() => {
      if (coarse && innerWidth === lastW && Math.abs(innerHeight - lastH) < innerHeight * 0.2) return;
      lastW = innerWidth; lastH = innerHeight;
      size();
    }, 120);
  });

  // ---- writing queue ----
  const queue: { line: Line; place: (typeof PLACES)[number]; scale: number }[] = [];
  let placeIdx = 0;
  const say = (line: Line, place = PLACES[placeIdx++ % PLACES.length], scale = 1) => {
    queue.push({ line, place, scale });
    const text = [line.hi, line.en, line.hint].filter(Boolean).join(' — ');
    live.textContent = text;
  };

  let entered = false;
  let hintBreath = false;
  let started = 0;
  weather.onPhase = p => { const l = POEM[p]; if (l && entered) say(l); };
  weather.onLightning = d => sound.thunder(d);
  weather.onBell = () => sound.bell();
  hand.onFirstTouch = () => sound.touch();

  const enter = (withSound: boolean) => {
    if (entered) return;
    entered = true;
    started = performance.now();
    if (withSound) sound.start();
    setSoundUi(withSound);
    gate.classList.add('is-gone');
    gate.setAttribute('aria-hidden', 'true');
    controls.hidden = false;
    setTimeout(() => { gate.hidden = true; canvas.focus({ preventScroll: true }); }, 1400);
    setTimeout(() => say(TITLE, { x: 0.5, y: 0.36, align: 'center' }, 1.5), 700);
    setTimeout(() => { if (!hand.touched) say({ hint: coarse ? 'wipe the glass with your finger' : 'wipe the glass — drag across it' }, { x: 0.5, y: 0.8, align: 'center' }); }, 6500);
    weather.start();
  };
  $<HTMLButtonElement>('#enter-sound').addEventListener('click', () => enter(true));
  $<HTMLButtonElement>('#enter-quiet').addEventListener('click', () => enter(false));

  const setSoundUi = (on: boolean) => { btnSound.setAttribute('aria-pressed', String(on)); btnSound.querySelector('.label')!.textContent = on ? 'Sound on' : 'Sound off'; };
  btnSound.addEventListener('click', () => {
    if (sound.enabled) sound.stop(); else sound.start();
    setSoundUi(sound.enabled);
  });
  const setFlashUi = () => { btnFlash.setAttribute('aria-pressed', String(weather.flashesAllowed)); btnFlash.querySelector('.label')!.textContent = weather.flashesAllowed ? 'Lightning flashes on' : 'Lightning flashes softened'; };
  setFlashUi();
  btnFlash.addEventListener('click', () => { weather.flashesAllowed = !weather.flashesAllowed; setFlashUi(); });
  btnInfo.addEventListener('click', () => about.showModal());
  about.addEventListener('click', e => { if (e.target === about) about.close(); });
  if (new URLSearchParams(location.search).has('debug')) {
    // QA hooks: the CPU-only test browser renders a few frames a second, so time can be fast-forwarded
    const w = window as unknown as Record<string, unknown>;
    w.__strike = () => weather.strike();
    w.__probe = () => ({ ...r.debugRead(), flash: weather.flash, reveal, drops: rain.drops.length });
    w.__ff = (sec: number) => {
      const dt = 1 / 30;
      for (let i = 0; i < sec * 30; i++) {
        weather.step(dt); rain.step(dt, weather.rain, weather.size, 0.1); writer.step(dt);
        if (!writer.busy && queue.length) { const q = queue.shift()!; writer.write(q.line, r.view, q.place, q.scale); }
        r.render(rain, { dt, time: performance.now() / 1000, segs: [], breath: null, regrow: weather.regrow, flash: 0, dark: weather.dark, rain: weather.rain, lamps: weather.lampData, lampN: weather.lampN, bolt: weather.bolt, boltN: 0, textFront: writer.front, textOn: writer.on, reveal: 1 }, false);
      }
      return weather.phase;
    };
  }
  addEventListener('keydown', e => { if (e.key === 'n' && entered && !about.open) weather.skip(); });

  // ---- frame loop ----
  let last = performance.now();
  let reveal = 0;
  let slow = 0, fast = 0;
  let running = true;
  const frame = (now: number) => {
    if (!running) return;
    requestAnimationFrame(frame);
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000)); // rAF can report a time before `last`
    last = now;

    // adaptive quality: drop output resolution if frames run long, recover slowly
    if (dt > 0.024) { slow++; fast = 0; } else if (dt < 0.0175) { fast++; slow = Math.max(0, slow - 1); }
    if (slow > 45 && dpr > 0.7 && !qs.has('debug')) { dpr = Math.max(0.7, dpr * 0.85); r.setDpr(dpr); slow = 0; }
    if (fast > 600 && dpr < Math.min(devicePixelRatio || 1, coarse ? 1.25 : 1.5)) { dpr = Math.min(dpr / 0.85, coarse ? 1.25 : 1.5); r.setDpr(dpr); fast = 0; }

    if (entered) weather.step(dt);
    const rainI = entered ? weather.rain : 0.22;
    rain.step(dt * (reduceMotion ? 0.6 : 1), rainI, entered ? weather.size : 0.15, 0.1);
    hand.update(dt);

    if (!writer.busy && queue.length) { const q = queue.shift()!; writer.write(q.line, r.view, q.place, q.scale); }
    writer.step(dt);

    if (entered && !hintBreath && hand.wipedDistance > 1400 && now - started > 16000 && !writer.busy && queue.length === 0) {
      hintBreath = true;
      say({ hint: 'hold still to breathe on it' }, { x: 0.5, y: 0.9, align: 'center' });
    }

    reveal = Math.min(1, reveal + dt * 0.7);
    r.render(rain, {
      dt, time: now / 1000,
      segs: hand.segs, breath: hand.breath,
      regrow: entered ? weather.regrow : 0.1,
      flash: weather.flash, dark: entered ? weather.dark : 0.15, rain: rainI,
      lamps: weather.lampData, lampN: weather.lampN,
      bolt: weather.bolt, boltN: weather.flash > 0 ? weather.boltN : 0,
      textFront: writer.front, textOn: writer.on,
      reveal: reveal * reveal * (3 - 2 * reveal),
    });
    hand.flush();
    const night = weather.phase === 'clear' || weather.phase === 'night' ? Math.min(1, weather.lampLevel) : 0;
    sound.update(dt, rainI, hand.speed, hand.fingerDown, hand.breathing, writer.writing, night);
  };
  requestAnimationFrame(frame);
  root.classList.add('ready');

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { running = false; sound.ctx?.suspend(); }
    else { running = true; last = performance.now(); if (sound.enabled) sound.ctx?.resume(); requestAnimationFrame(frame); }
  });
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); running = false; fallback('context lost'); });
}

boot();
