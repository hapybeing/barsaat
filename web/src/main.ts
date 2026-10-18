import './fonts';
import './style.css';
import Lenis from 'lenis';
import { Folio, PLATES, SKY } from './gl/folio';
import { Score } from './audio';
import { RouteMap } from './map';
import { applyLang, initialLang, t as tr, lang, type Lang } from './i18n';

// One clock, one state. Scroll position → per-section targets → eased state → GL, DOM, sound.

const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector(s) as T;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const url = new URL(location.href);
const DEBUG = url.searchParams.has('debug');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch = matchMedia('(pointer: coarse)').matches;

// ---------------------------------------------------------------- sections → targets
type Target = { plate: number; map: number; full: number; show: number; rain: number; slant: number; storm: number; dusk: number; clear: number; dry: number; burst: number; msg: number; ch: number; end: number };
const sections = [...document.querySelectorAll<HTMLElement>('.sec')];
const targets: Target[] = [];
{
  let last = 0;
  for (const s of sections) {
    const d = s.dataset;
    const p = d.plate === 'map' || d.plate === 'none' ? last : Number(d.plate ?? last);
    last = p;
    targets.push({
      plate: p, map: d.plate === 'map' ? 1 : 0, show: d.plate === 'none' ? 0 : 1, full: Number(d.full ?? 0),
      rain: Number(d.rain ?? 0), slant: Number(d.slant ?? 0.1), storm: Number(d.storm ?? 0), dusk: Number(d.dusk ?? 0),
      clear: Number(d.clear ?? 0), dry: Number(d.dry ?? 0), burst: Number(d.burst ?? 0), msg: Number(d.msg ?? 0), ch: Number(d.ch ?? 0), end: Number(d.end ?? 0),
    });
  }
}
let tops: number[] = [], heights: number[] = [];
const measure = () => { tops = sections.map(s => s.offsetTop); heights = sections.map(s => s.offsetHeight); };

const S = { full: 1, show: 1, rain: 0, slant: 0.1, storm: 0.2, dusk: 0, clear: 0, dry: 1, burst: 0, msg: 0, end: 0, map: 0, wet: 0, load: 0, wind: 0 };
let plateA = 0, plateB = 0, mix = 0, chapter = 0, secIndex = 0, secT = 0;

// ---------------------------------------------------------------- GL
const canvas = $<HTMLCanvasElement>('#gl');
let folio: Folio | null = null;
try { folio = new Folio(canvas); } catch (e) { console.warn('WebGL unavailable', e); document.body.classList.add('no-gl'); }
const score = new Score();
const map = new RouteMap($<SVGSVGElement>('#map'));

// ---------------------------------------------------------------- language
const langButtons = [...document.querySelectorAll<HTMLButtonElement>('.lang-b')];
function setLang(l: Lang) {
  applyLang(l);
  langButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === l)));
  document.dispatchEvent(new Event('relabel'));
}
langButtons.forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang as Lang)));

// ---------------------------------------------------------------- layout
const quality = { dpr: Number(url.searchParams.get('dpr')) || (touch ? 1.25 : 1.5), slow: 0 };
const geo = { band: 22, folio: { x: 0, y: 0, w: 0, h: 0 }, opaqueTop: 0, portrait: false };
function layout() {
  const vw = innerWidth, vh = innerHeight;
  const portrait = vh > vw * 1.05 || vw < 760;
  geo.portrait = portrait;
  const band = Math.round(clamp(Math.min(vw, vh) * 0.028, 13, 30));
  geo.band = band;
  const root = document.documentElement.style;
  if (!portrait) {
    const m = Math.max(26, vh * 0.06);
    let h = vh - 2 * m - 2 * (band + 7);
    let w = Math.min(h * 0.74, vw * 0.44);
    h = Math.min(h, w / 0.62);
    const x = vw - w - band - 7 - Math.max(vw * 0.05, 40);
    const y = (vh - h) / 2;
    geo.folio = { x, y, w, h };
    geo.opaqueTop = 0;
    const colx = Math.max(150 + vw * 0.02, vw * 0.14);
    const colw = Math.min(560, x - band - 7 - colx - vw * 0.05);
    root.setProperty('--colx', `${colx}px`);
    root.setProperty('--colw', `${Math.max(280, colw)}px`);
  } else {
    const m = Math.round(clamp(vw * 0.05, 14, 34));
    const x = m + band + 7, w = vw - 2 * x;
    const y = 54 + band + 7;
    const h = Math.min(vh * 0.48, w * 1.3);
    geo.folio = { x, y, w, h };
    geo.opaqueTop = y + h + band + 7 + 18;
    root.setProperty('--frameTop', `${geo.opaqueTop}px`);
  }
  folio?.resize(vw, vh, Math.min(devicePixelRatio || 1, quality.dpr));
  measure();
}

// ---------------------------------------------------------------- scroll
const lenis = !touch && !reduce ? new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, anchors: true, autoRaf: false }) : null;
let scrollY = 0, vel = 0;
const readScroll = () => { const y = lenis ? lenis.scroll : window.scrollY; vel = lerp(vel, y - scrollY, 0.2); scrollY = y; };
const goTo = (target: string | number, duration = 1.8) => {
  if (lenis) lenis.scrollTo(target as any, { duration });
  else if (typeof target === 'number') scrollTo({ top: target, behavior: reduce ? 'auto' : 'smooth' });
  else document.querySelector(target)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
};

// ---------------------------------------------------------------- message
const msgEl = $<HTMLTextAreaElement>('#msg');
const msgNEl = () => $('#msg-n');
const msgN = { set textContent(v: string) { const e = msgNEl(); if (e) e.textContent = v; } };
const letter = $<HTMLFormElement>('#letter');
let message = '';
const enc = (s: string) => btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const dec = (s: string) => { try { return new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))); } catch { return ''; } };
const arrived = location.hash.startsWith('#m=') ? dec(location.hash.slice(3)).replace(/[\u0000-\u001f]/g, ' ').slice(0, 140) : '';
const fallbackMsg = () => tr('placeholder');
function setMessage(m: string) {
  message = (m.trim() || fallbackMsg()).slice(0, 140);
  document.fonts.load('400 60px Kalam').catch(() => null).then(() => folio?.writeMessage(message));
  $('#msg-sr').textContent = tr('writtenOn') + message;
}
msgEl.addEventListener('input', () => { msgN.textContent = String(msgEl.value.length); });
letter.addEventListener('submit', e => {
  e.preventDefault();
  setMessage(msgEl.value);
  letter.classList.add('sent');
  letter.querySelector('button')!.textContent = tr('carrying');
  goTo('#boonda-baandi', 2.2);
});
if (arrived) {
  msgEl.value = arrived; msgEl.readOnly = true; msgN.textContent = String(arrived.length);
}
let typed = false;
msgEl.addEventListener('input', () => { typed = true; });
function relabel() {
  msgEl.placeholder = tr('placeholder');
  if (arrived) { $('.letter-k').textContent = tr('arrivedK'); letter.querySelector('button')!.textContent = tr('flyNorth'); }
  else if (letter.classList.contains('sent')) letter.querySelector('button')!.textContent = tr('carrying');
  chip.querySelector('.chip-t')!.textContent = score.on ? tr('soundOn') : tr('soundOff');
  msgN.textContent = String(msgEl.value.length);
  if (!typed && !arrived && !letter.classList.contains('sent')) setMessage('');
}
document.addEventListener('relabel', relabel);

$('#share').addEventListener('click', async () => {
  const link = `${location.origin}${location.pathname}${lang === 'hi' ? '?lang=hi' : ''}#m=${enc(message)}`;
  const out = $('#share-out');
  try {
    if (navigator.share) { await navigator.share({ title: tr('shareTitle'), url: link }); out.textContent = tr('shareSent'); return; }
  } catch { /* cancelled */ }
  try { await navigator.clipboard.writeText(link); out.textContent = tr('shareCopied'); }
  catch { out.textContent = link; }
});
$('#again').addEventListener('click', e => { e.preventDefault(); goTo(0, 3); });

// ---------------------------------------------------------------- ladder
const ladderLinks = [...document.querySelectorAll<HTMLAnchorElement>('.ladder a')];
ladderLinks.forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  const id = a.getAttribute('href')!;
  goTo(id);
  history.replaceState(null, '', id);
}));

// ---------------------------------------------------------------- sound
const chip = $<HTMLButtonElement>('#sound');
async function setSound(v: boolean) {
  try { if (v) await score.start(); } catch { v = false; }
  score.setOn(v);
  chip.setAttribute('aria-pressed', String(v));
  chip.querySelector('.chip-t')!.textContent = v ? tr('soundOn') : tr('soundOff');
}
chip.addEventListener('click', () => setSound(!score.on));

// ---------------------------------------------------------------- lightning
let flash = 0, boltT = 0, boltA = 0, boltAge = 99, nextStrike = 6;
function strike(near = false) {
  if (!folio) return;
  folio.bolt(SKY[plateA] ?? 0.4);
  boltAge = 0; boltT = 0;
  score.thunder(near ? 0.05 : 0.2 + Math.random() * 0.6);
}
let holding = false, holdT = 0, holdTimer = 0, downY = 0;
const holdHint = $('#hold-hint');
const interactive = (t: EventTarget | null) => t instanceof Element && !!t.closest('a,button,textarea,input,label,.verse,.prose,.note,.letter,.g-track,.chrome,.ladder');
addEventListener('pointerdown', e => {
  if (interactive(e.target) || e.button > 0 || !document.body.classList.contains('entered')) return;
  downY = e.clientY;
  holdTimer = window.setTimeout(() => { holding = true; holdT = 0; strike(true); score.swell(); }, 340);
});
const release = () => { clearTimeout(holdTimer); holding = false; };
addEventListener('pointerup', release); addEventListener('pointercancel', release);
addEventListener('pointermove', e => { if (!holding && Math.abs(e.clientY - downY) > 8) clearTimeout(holdTimer); });
addEventListener('scroll', () => { if (!holding) clearTimeout(holdTimer); }, { passive: true });
addEventListener('keydown', e => { if (e.key === 't' && !e.repeat && !(e.target instanceof HTMLTextAreaElement)) { holding = true; holdT = 0; strike(true); score.swell(); } });
addEventListener('keyup', e => { if (e.key === 't') holding = false; });
addEventListener('contextmenu', e => { if (!interactive(e.target)) e.preventDefault(); });

const par = { x: 0, y: 0, tx: 0, ty: 0 };
addEventListener('pointermove', e => { par.tx = (e.clientX / innerWidth - 0.5) * 2; par.ty = (e.clientY / innerHeight - 0.5) * 2; });

// ---------------------------------------------------------------- threshold
const threshold = $('#threshold');
const gauge = $('.gauge-fill');
const mm = $('#mm');
let loaded = 0;
const bump = () => { loaded++; const p = loaded / 4; gauge.style.width = `${p * 100}%`; mm.textContent = String(Math.round(p * 100)); };
async function boot() {
  const fonts = Promise.all([document.fonts.load('400 40px "Tiro Devanagari Hindi"', 'बरसात'), document.fonts.load('italic 300 20px Fraunces'), document.fonts.load('400 16px Mukta')]).catch(() => null).then(bump);
  const border = (folio?.loadBorder() ?? Promise.resolve()).catch(() => null).then(bump);
  const p0 = (folio?.loadPlate(0) ?? Promise.resolve()).catch(() => null).then(bump);
  const p5 = (folio?.loadPlate(5) ?? Promise.resolve()).catch(() => null).then(bump);
  await Promise.all([fonts, border, p0, p5]);
  (async () => { for (const i of [1, 2, 3, 4]) await folio?.loadPlate(i).catch(() => null); })();
  $('.th-enter').hidden = false;
  ($('#enter-sound') as HTMLButtonElement).focus({ preventScroll: true });
  if (DEBUG && url.searchParams.has('auto')) enter(false);
}
function enter(withSound: boolean) {
  threshold.classList.add('gone');
  threshold.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('is-loading');
  document.body.classList.add('entered');
  measure();
  if (withSound) setSound(true);
  if (arrived) {
    const a = $('#arrival'); a.hidden = false;
    setTimeout(() => { a.style.transition = 'opacity 1.4s'; a.style.opacity = '0'; setTimeout(() => (a.hidden = true), 1500); }, 2600);
  }
}
$('#enter-sound').addEventListener('click', () => enter(true));
$('#enter-quiet').addEventListener('click', () => enter(false));

// ---------------------------------------------------------------- frame loop
let last = performance.now(), time = 0, frames = 0, fpsT = 0, fps = 60, acc = 0;
let craneT = -1, craneNext = 4;
const burstSec = $('.sec-burst');
const mapIndex = sections.findIndex(s => s.classList.contains('sec-map'));
const loadBar = $('.load-bar span');
let lastCh = -1, lastLoad = -1;
const setClass = (el: Element, c: string, v: boolean) => { if (el.classList.contains(c) !== v) el.classList.toggle(c, v); };
function frame(now: number) {
  requestAnimationFrame(frame);
  const raw = (now - last) / 1000;
  last = now;
  acc += raw;
  if (acc < 1 / 62) return; // hold ~60 fps on 120/144 Hz screens
  const dt = Math.min(0.05, acc);
  acc = 0;
  time += dt;
  if (lenis) lenis.raf(now);
  readScroll();
  step(dt);
  frames++; fpsT += dt;
  if (fpsT > 1) {
    fps = frames / fpsT; frames = 0; fpsT = 0;
    if (fps < (touch ? 50 : 40) && quality.dpr > 0.75 && time > 4 && !url.searchParams.get('dpr')) { if (++quality.slow > 2) { quality.dpr = Math.max(0.75, quality.dpr - 0.25); quality.slow = 0; layout(); } } else quality.slow = 0;
  }
  if (DEBUG) debugLine();
}

function step(dt: number) {
  const vh = innerHeight;
  const focus = scrollY + vh * 0.55;
  let i = 0;
  while (i < sections.length - 1 && tops[i + 1] <= focus) i++;
  secIndex = i;
  const t = clamp((focus - tops[i]) / Math.max(1, heights[i]));
  secT = t;
  const A = targets[i], B = targets[Math.min(sections.length - 1, i + 1)];
  const k = smooth(0.72, 1.0, t);
  const T = (key: keyof Target) => lerp(A[key], B[key], k);
  const e = 1 - Math.exp(-dt * (reduce ? 20 : 4));
  const ef = 1 - Math.exp(-dt * 12);
  S.full = lerp(S.full, T('full'), ef * 1.6 > 1 ? 1 : ef * 1.6);
  S.show = lerp(S.show, T('show'), ef);
  S.map = lerp(S.map, T('map'), ef);
  S.storm = lerp(S.storm, T('storm'), e);
  S.dusk = lerp(S.dusk, T('dusk'), e);
  S.clear = lerp(S.clear, T('clear'), e);
  S.dry = lerp(S.dry, T('dry'), e);
  S.end = lerp(S.end, T('end'), ef);
  S.burst = lerp(S.burst, A.burst ? smooth(0.05, 0.55, t) : 0, ef);
  S.msg = lerp(S.msg, A.msg ? smooth(0.0, 0.2, t) * (1 - smooth(0.88, 1, t)) : 0, ef);
  const speed = Math.abs(vel) / Math.max(0.001, dt) / vh;
  S.wind = lerp(S.wind, reduce ? 0 : clamp(vel / Math.max(0.001, dt) / vh * 0.25, -1, 1), 0.08);
  if (A.ch && speed < 0.05) S.load = Math.min(1, S.load + dt * 0.035); else S.load = Math.max(0, S.load - dt * (0.02 + speed * 0.02));
  const rainT = T('rain') * (0.75 + S.load * 0.5) + (holding ? 0.35 : 0);
  S.rain = lerp(S.rain, clamp(rainT), e);
  S.slant = lerp(S.slant, T('slant') + (holding ? 0.2 : 0), e);
  S.wet = S.clear > 0.5 ? lerp(S.wet, 0.25, 1 - Math.exp(-dt * 0.4)) : lerp(S.wet, Math.max(S.wet, S.rain * 1.1), 1 - Math.exp(-dt * 0.6));
  plateA = A.plate; plateB = B.plate; mix = A.plate !== B.plate ? k : 0;
  if (A.ch) chapter = A.ch; else if (i < 2) chapter = 0;
  setClass(document.body, 'is-full', S.full > 0.5 && S.show > 0.5 && S.map < 0.5);

  boltAge += dt;
  if (holding) { holdT += dt; if (holdT > 1.1) { holdT = 0; strike(true); } }
  nextStrike -= dt * (S.storm > 0.45 ? (S.storm - 0.4) * 2.2 : 0) * (reduce ? 0 : 1);
  if (nextStrike <= 0 && S.show > 0.5 && S.map < 0.5 && S.msg < 0.1) { strike(); nextStrike = 3 + Math.random() * 6; }
  boltT = clamp(boltAge / 0.14);
  boltA = boltAge < 0.5 ? 1 : Math.max(0, 1 - (boltAge - 0.5) / 0.5);
  const f1 = Math.exp(-boltAge * 7), f2 = boltAge > 0.13 ? Math.exp(-(boltAge - 0.13) * 9) * 0.7 : 0;
  flash = reduce ? 0 : Math.min(1.2, f1 + f2);

  if (craneT >= 0) { craneT += dt / 16; if (craneT > 1) craneT = -1; }
  else { craneNext -= dt; if (craneNext <= 0 && S.show > 0.5 && S.map < 0.5 && S.storm < 0.8) { craneT = 0; craneNext = 18 + Math.random() * 16; } }

  par.x = lerp(par.x, reduce ? 0 : par.tx, 0.04); par.y = lerp(par.y, reduce ? 0 : par.ty, 0.04);

  const fl = geo.folio, B2 = geo.band + 8;
  const fe = S.full * S.full * (3 - 2 * S.full);
  const full = { x: -B2 - 2, y: -B2 - 2, w: innerWidth + 2 * B2 + 4, h: innerHeight + 2 * B2 + 4 };
  const win = { x: lerp(fl.x, full.x, fe), y: lerp(fl.y, full.y, fe), w: lerp(fl.w, full.w, fe), h: lerp(fl.h, full.h, fe) };

  if (folio) {
    const u = folio.u;
    (u.uWin.value as any).set(win.x, win.y, win.w, win.h);
    u.uArch.value = 1 - fe;
    u.uBand.value = geo.band;
    u.uOpaqueTop.value = geo.portrait ? geo.opaqueTop * (1 - fe) : 0;
    u.uShow.value = S.show;
    folio.setPlates(plateA, plateB, mix);
    u.uTime.value = time;
    u.uRain.value = S.rain * S.show;
    u.uSlant.value = S.slant;
    u.uStorm.value = S.storm;
    u.uWet.value = S.wet;
    u.uDusk.value = S.dusk;
    u.uClear.value = S.clear;
    u.uDry.value = S.dry;
    u.uWind.value = S.wind;
    u.uBurst.value = S.burst;
    u.uMap.value = S.map;
    u.uCalm.value = reduce ? 1 : 0;
    (u.uPar.value as any).set(par.x, par.y);
    u.uFlash.value = flash * (1 - S.map) * S.show;
    u.uBoltT.value = boltT; u.uBoltA.value = boltA * (1 - S.map) * S.show;
    u.uCrane.value = craneT; u.uCraneY.value = Math.max(0.06, (SKY[plateA] ?? 0.3) * 0.35);
    u.uMsg.value = S.msg;
    u.uDim.value = S.end;
    u.uMsgT.value = A.msg ? smooth(0.12, 0.6, t) : 0;
    (u.uMsgRect.value as any).set(0.08, geo.portrait ? 0.16 : 0.2, 0.84, 0.32);
    folio.render();
  }

  const mapEl = map.svg;
  if (S.map > 0.01) {
    const inset = Math.min(win.w, win.h) * 0.05;
    const archTop = Math.min(win.w * 0.36, win.h * 0.22) * (1 - fe) * 0.45;
    mapEl.style.opacity = String(S.map); mapEl.style.visibility = 'visible';
    mapEl.style.left = `${win.x + inset}px`; mapEl.style.top = `${win.y + inset + archTop}px`;
    mapEl.style.width = `${win.w - 2 * inset}px`; mapEl.style.height = `${win.h - 2 * inset - archTop}px`;
    map.set(clamp((scrollY + vh * 0.5 - tops[mapIndex]) / Math.max(1, heights[mapIndex] - vh * 0.3)));
  } else { mapEl.style.opacity = '0'; mapEl.style.visibility = 'hidden'; }

  setClass(burstSec, 'in', S.burst > 0.6);
  if (chapter !== lastCh) { lastCh = chapter; ladderLinks.forEach(a => a.classList.toggle('on', Number(a.dataset.ch) === chapter)); }
  const lw = Math.round(S.load * 100); if (lw !== lastLoad) { lastLoad = lw; loadBar.style.width = `${lw}%`; }
  setClass(holdHint, 'show', A.ch >= 4 && A.ch <= 6 && S.full < 0.5 && S.show > 0.5);

  Object.assign(score.state, { rain: S.rain, storm: S.storm, ch: chapter, clear: S.clear, msg: S.msg, full: S.full, show: S.show });
  score.update(dt);
}

// ---------------------------------------------------------------- debug
let dbg: HTMLElement | null = null;
function debugLine() {
  if (!dbg) { dbg = document.createElement('pre'); dbg.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:99;margin:0;font:11px/1.3 monospace;color:#fff;background:#0009;padding:6px 8px;pointer-events:none'; document.body.appendChild(dbg); }
  dbg.textContent = `sec ${secIndex} t ${secT.toFixed(2)} ch ${chapter} ${PLATES[plateA]}→${PLATES[plateB]} mix ${mix.toFixed(2)} full ${S.full.toFixed(2)} rain ${S.rain.toFixed(2)} storm ${S.storm.toFixed(2)} fps ${fps.toFixed(0)} dpr ${quality.dpr}`;
}
(window as any).__barsaat = { jump: (y: number) => { lenis ? lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y); }, strike, S, sections, get fps() { return fps; }, enter, setSound, score };

let lastW = innerWidth, lastH = innerHeight;
addEventListener('resize', () => {
  // on phones/tablets the browser bar sliding in and out changes the height by a little; re-laying
  // out the canvas for that causes a hitch mid-scroll, so only react to real changes
  if (touch && innerWidth === lastW && Math.abs(innerHeight - lastH) < 160) { measure(); return; }
  lastW = innerWidth; lastH = innerHeight;
  layout();
});
new ResizeObserver(measure).observe(document.querySelector('main')!);
// verses, notes and prose rise in as they enter
if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.verse, .prose, .note, .eyebrow, .fine, .try, .letter, .g-head, .g-item').forEach(el => { el.classList.add('rise'); io.observe(el); });
}
setLang(initialLang());
layout();
boot();
requestAnimationFrame(frame);
