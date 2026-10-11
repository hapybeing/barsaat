import * as THREE from 'three';
import '@fontsource/tiro-devanagari-hindi/400.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import './style.css';
import { shared, MAX_LIGHTS } from './world/common';
import { makeSky } from './world/sky';
import { makeWater } from './world/water';
import { makeRain } from './world/rain';
import { Banks, wallHeights, type Light } from './world/banks';
import { makeBoat, SHEET_H } from './world/boat';
import { Glows } from './world/glows';
import { Diyas } from './world/diyas';
import { Lightning } from './world/lightning';
import { makeSkyline } from './world/skyline';
import { centre, halfWidth, slope, weights, rainAt, clearAt, fogAt, speedAt, rigAt, chapterAt, STARTS, END } from './world/path';
import { Page } from './page';
import { Sound } from './audio';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const params = new URLSearchParams(location.search);
const DEBUG = params.has('debug');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------- renderer

const canvas = $<HTMLCanvasElement>('world');
let renderer: THREE.WebGLRenderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', alpha: false });
} catch {
  document.documentElement.classList.add('no-gl');
  throw new Error('WebGL unavailable');
}
const maxDpr = Math.min(window.devicePixelRatio || 1, Number(params.get('dpr')) || 1.5);
let dpr = Math.min(maxDpr, 1.25);
renderer.setPixelRatio(dpr);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1, 0.05, 1200);

const sky = makeSky();
const water = makeWater();
const rain = makeRain(5000);
const banks = new Banks();
const staticGlows = new Glows(3200);
const flameGlows = new Glows(320, true);
const haloGlows = new Glows(340);
const diyas = new Diyas(260);
const lightning = new Lightning();
const skyline = makeSkyline();
scene.add(sky, skyline.mesh, water.mesh, banks.root, diyas.bowls, lightning.mesh, rain.mesh, staticGlows.mesh, haloGlows.mesh, flameGlows.mesh);

const page = new Page($<HTMLCanvasElement>('page'));
const paperTex = new THREE.CanvasTexture(page.canvas);
paperTex.colorSpace = THREE.SRGBColorSpace;
paperTex.anisotropy = 4;
const boat = makeBoat(paperTex);
const boatGroup = new THREE.Group();
boatGroup.add(boat.mesh);
boatGroup.visible = false;
scene.add(boatGroup);

const sound = new Sound();

// ---------------------------------------------------------------- state

type Mode = 'gate' | 'page' | 'fold' | 'sail' | 'finale' | 'drift';
let mode: Mode = 'gate';
let modeT = 0;
let time = 0;
let s = 4;                 // distance travelled along the river
let u = 0, uT = 0, uVel = 0;
let speed = 1.2;
let blow = 0;
let soak = 0;
let lit = 0;
let flashOn = true;
let nextStrike = 6;
let driftT = 0;
let lastChapter = -1;
let templeRung = new Set<number>();
let autopilot = params.has('auto');
let hintDiyaShown = false;
let firstStrike = -1;

const boatPos = new THREE.Vector3();
const camPos = new THREE.Vector3(0, 1, 0);
const camLook = new THREE.Vector3(0, 0, -10);
const tmp = new THREE.Vector3();
const tmp2 = new THREE.Vector3();

// the boat's wake path, for the procession of lamps
const TRAIL_STEP = 0.12;
const trail: THREE.Vector3[] = [];
let trailAcc = 0;
const trailAt = (dist: number) => {
  const f = dist / TRAIL_STEP;
  const i = Math.floor(f);
  if (!trail.length) return boatPos.clone();
  const a = trail[Math.min(i, trail.length - 1)], b = trail[Math.min(i + 1, trail.length - 1)];
  return tmp2.copy(a).lerp(b, f - i).clone();
};

diyas.onCatch = () => {
  lit++;
  sound.ignite();
  $('count').textContent = toDeva(lit);
  $('hud').classList.add('is-on');
  $('hud').classList.remove('pulse'); void $('hud').offsetWidth; $('hud').classList.add('pulse');
  if (lit === 1) hint('');
};

const toDeva = (n: number) => String(n).replace(/\d/g, d => '०१२३४५६७८९'[+d]);

// ---------------------------------------------------------------- input

const pointer = { down: false, x: 0.5, y: 0.5, heldFor: 0, id: -1 };
const keys = { left: false, right: false, space: false };
canvas.addEventListener('pointerdown', e => {
  if (mode !== 'sail' && mode !== 'drift') return;
  pointer.down = true; pointer.id = e.pointerId; pointer.heldFor = 0;
  pointer.x = e.clientX / innerWidth; pointer.y = e.clientY / innerHeight;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', e => {
  if (!pointer.down || e.pointerId !== pointer.id) return;
  pointer.x = e.clientX / innerWidth; pointer.y = e.clientY / innerHeight;
});
for (const ev of ['pointerup', 'pointercancel'] as const) canvas.addEventListener(ev, e => { if (e.pointerId === pointer.id) pointer.down = false; });
addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
  if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
  if (e.key === ' ') { keys.space = true; if (mode === 'sail' || mode === 'drift') e.preventDefault(); }
});
addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
  if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
  if (e.key === ' ') keys.space = false;
});

// ---------------------------------------------------------------- words

const CAPTIONS = [
  { hi: 'छतों का पानी, गली की नदी', en: 'Every roof empties into the lane.' },
  { hi: 'पुलों के नीचे, बत्तियों के बीच', en: 'Under the bridges, between the lamps.' },
  { hi: 'और आसमान फट पड़ा', en: 'Then the sky broke open.' },
  { hi: 'फिर, ख़ामोशी', en: 'And then, quiet.' },
];
let captionTimer = 0;
function caption(i: number) {
  const el = $('caption');
  el.querySelector('.hi')!.textContent = CAPTIONS[i].hi;
  el.querySelector('.en')!.textContent = CAPTIONS[i].en;
  el.classList.add('is-on');
  $('live').textContent = CAPTIONS[i].en;
  clearTimeout(captionTimer);
  captionTimer = window.setTimeout(() => el.classList.remove('is-on'), 5200);
}
let hintTimer = 0;
function hint(text: string, ms = 5000) {
  const el = $('hint');
  if (!text) { el.classList.remove('is-on'); return; }
  el.textContent = text; el.classList.add('is-on');
  clearTimeout(hintTimer);
  hintTimer = window.setTimeout(() => el.classList.remove('is-on'), ms);
}

// ---------------------------------------------------------------- flow

function enter(withSound: boolean) {
  if (withSound) sound.start();
  setSoundButton();
  $('gate').classList.add('is-gone');
  $('controls').hidden = false;
  setTimeout(() => showPage(), 500);
}
function showPage() {
  mode = 'page'; modeT = 0;
  $('paper').classList.add('is-on');
  Promise.all([document.fonts.load('30px "Tiro Devanagari Hindi"', 'दिनांक बरसात'), document.fonts.load('italic 44px "Cormorant Garamond"')])
    .then(() => { if (page.inked === 0) page.clear(); }).catch(() => {});
  $('paper').setAttribute('aria-hidden', 'false');
}
function fold() {
  if (mode !== 'page') return;
  page.ensureWriting();
  paperTex.needsUpdate = true;
  const r = page.canvas.getBoundingClientRect();
  placeSheet(r);
  $('paper').classList.add('is-folding');
  boatGroup.visible = true;
  boat.uniforms.uFold.value = 0;
  boat.uniforms.uUnlit.value = 1;
  boatGroup.scale.setScalar(1);
  mode = 'fold'; modeT = 0;
  sound.crinkle(2.6);
  const el = $('paper');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.style.transition = 'none';
    el.classList.remove('is-on', 'is-folding'); el.setAttribute('aria-hidden', 'true');
    requestAnimationFrame(() => { el.style.transition = ''; });
  }));
}

const sheetPose = { pos: new THREE.Vector3(), quat: new THREE.Quaternion() };
function placeSheet(r: DOMRect) {
  // put the 3D sheet exactly where the paper was on screen, so the swap is invisible
  const vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const frac = r.height / innerHeight;
  const D = SHEET_H / (frac * vh);
  const cx = (r.left + r.width / 2) / innerWidth * 2 - 1;
  const cy = -((r.top + r.height / 2) / innerHeight * 2 - 1);
  camera.updateMatrixWorld();
  tmp.set(cx * vh * camera.aspect / 2 * D, cy * vh / 2 * D, -D).applyMatrix4(camera.matrixWorld);
  sheetPose.pos.copy(tmp);
  sheetPose.quat.copy(camera.quaternion).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(1.2)));
  boatGroup.position.copy(sheetPose.pos);
  boatGroup.quaternion.copy(sheetPose.quat);
}

function startSail() {
  mode = 'sail'; modeT = 0;
  speed = speedAt(s);
  diyas.startAt(s);
  firstStrike = 1.6;
  sound.splash();
  hint(matchMedia('(pointer: coarse)').matches ? 'Touch and hold to steer. Holding longer blows it along.' : 'Hold the mouse to steer, or use the arrow keys. Space blows it along.', 6500);
}

function finale() {
  mode = 'finale'; modeT = 0;
  hint('');
}

function showEnd() {
  const el = $('end');
  $('end-lit').textContent = lit
    ? `Your boat led ${lit} ${lit === 1 ? 'lamp' : 'lamps'} out to open water.`
    : 'Your boat made it to open water on its own.';
  el.classList.add('is-on');
  el.setAttribute('aria-hidden', 'false');
  $('live').textContent = $('end-lit').textContent || '';
}

function restart() {
  $('end').classList.remove('is-on');
  $('end').setAttribute('aria-hidden', 'true');
  s = 4; u = 0; uT = 0; speed = 1.2; soak = 0; lit = 0; driftT = 0; lastChapter = -1;
  templeRung = new Set(); hintDiyaShown = false;
  trail.length = 0;
  banks.reset(); banks.prime(s);
  diyas.reset();
  boatGroup.visible = false;
  $('hud').classList.remove('is-on');
  $('count').textContent = toDeva(0);
  page.clear(); paperTex.needsUpdate = true;
  showPage();
}

function drift() {
  $('end').classList.remove('is-on');
  $('end').setAttribute('aria-hidden', 'true');
  mode = 'drift'; modeT = 0; driftT = 0;
}

function postcard() {
  render();
  const shot = renderer.domElement;
  const W = 1600, H = Math.round(1600 * shot.height / shot.width);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d')!;
  g.drawImage(shot, 0, 0, W, H);
  const grad = g.createLinearGradient(0, H * 0.6, 0, H);
  grad.addColorStop(0, 'rgba(10,10,18,0)'); grad.addColorStop(1, 'rgba(10,10,18,0.75)');
  g.fillStyle = grad; g.fillRect(0, 0, W, H);
  g.fillStyle = '#ece4d2'; g.textAlign = 'left';
  g.font = `${Math.round(W * 0.06)}px "Tiro Devanagari Hindi", serif`;
  g.fillText('बरसात', W * 0.05, H - W * 0.075);
  g.font = `italic ${Math.round(W * 0.022)}px "Cormorant Garamond", serif`;
  g.fillText(lit ? `a paper boat and ${lit} ${lit === 1 ? 'lamp' : 'lamps'}` : 'a paper boat', W * 0.05, H - W * 0.035);
  g.textAlign = 'right';
  g.fillText('hapybeing.github.io/barsaat', W * 0.95, H - W * 0.035);
  c.toBlob(b => {
    if (!b) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = 'barsaat.png';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }, 'image/png');
}

// ---------------------------------------------------------------- simulation

const qa = new THREE.Quaternion(), qb = new THREE.Quaternion();
const boatQuatWater = new THREE.Quaternion();
const yAxis = new THREE.Vector3(0, 1, 0), xAxis = new THREE.Vector3(1, 0, 0), zAxis = new THREE.Vector3(0, 0, 1);

function waterPose(sv: number, uv: number, out: THREE.Vector3, q: THREE.Quaternion, roll: number, t: number) {
  out.set(centre(sv) + uv, 0.005 + Math.sin(t * 2.1) * 0.008, -sv);
  const heading = Math.atan(slope(sv) + uVel / Math.max(speed, 0.5) * 0.6);
  q.setFromAxisAngle(yAxis, Math.PI / 2 - heading)
    .multiply(qa.setFromAxisAngle(xAxis, roll + Math.sin(t * 1.7) * 0.05))
    .multiply(qb.setFromAxisAngle(zAxis, Math.sin(t * 1.3 + 1) * 0.04));
}

function step(dt: number) {
  time += dt; modeT += dt;
  const w = weights(s);
  const hw = halfWidth(s);

  if (mode === 'gate' || mode === 'page') {
    s += 0.7 * dt; // the world drifts behind the gate and the page
  }

  if (mode === 'fold') {
    const FOLD = 2.6, TURN = 1.7;
    boat.uniforms.uFold.value = Math.min(1, modeT / FOLD) * 1.0;
    if (modeT > FOLD) {
      // lift, turn to face downstream, and set it on the water just ahead of the camera
      const k = Math.min(1, (modeT - FOLD) / TURN);
      const e = k * k * (3 - 2 * k);
      const rig = rigAt(s);
      const landS = s + rig.back;
      waterPose(landS, u, tmp, boatQuatWater, 0, time);
      boatGroup.position.lerpVectors(sheetPose.pos, tmp, e);
      boatGroup.position.y += Math.sin(e * Math.PI) * 0.25;
      boatGroup.quaternion.slerpQuaternions(sheetPose.quat, boatQuatWater, e);
      boatGroup.scale.setScalar(1 + e * 0.5);
      boat.uniforms.uUnlit.value = 1 - e;
      if (k >= 1) { s = landS; boatPos.copy(tmp); startSail(); }
    }
  }

  if (mode === 'sail' || mode === 'finale' || mode === 'drift') {
    // steering
    const usable = Math.max(0.2, hw - 0.38);
    if (pointer.down) {
      pointer.heldFor += dt;
      uT = THREE.MathUtils.clamp((pointer.x - 0.5) * 2.3, -1, 1) * Math.min(usable, 6 + hw * 0.15);
    }
    if (keys.left) uT -= dt * Math.max(2.5, hw * 0.4);
    if (keys.right) uT += dt * Math.max(2.5, hw * 0.4);
    if (autopilot && mode === 'sail') {
      // QA and the idle demo: aim for the nearest dark lamp ahead
      let best: number | null = null, bd = 1e9;
      for (const d of diyas.list) if (d.state === 0) { const ahead = -d.z - s; if (ahead > 1 && ahead < 30 && ahead < bd) { bd = ahead; best = d.x - centre(-d.z); } }
      if (best !== null) uT = best;
    }
    if (mode === 'finale' || mode === 'drift') uT *= 1 - dt * 0.3;
    uT = THREE.MathUtils.clamp(uT, -usable, usable);
    const prevU = u;
    u += (uT - u) * (1 - Math.exp(-dt * 2.4));
    if (Math.abs(u) > usable) {
      if (Math.abs(uVel) > 0.6) sound.bump();
      u = Math.sign(u) * usable;
    }
    uVel = (u - prevU) / Math.max(dt, 1e-4);

    blow += ((pointer.down && pointer.heldFor > 0.45) || keys.space ? 1 : 0) - blow > 0 ? dt * 2 : -dt * 1.2;
    blow = THREE.MathUtils.clamp(blow, 0, 1);
    let target = speedAt(s) * (1 + blow * 0.55);
    if (mode === 'finale') target = 1.4;
    if (mode === 'drift') target = 1.1 + blow * 1.2;
    speed += (target - speed) * (1 - Math.exp(-dt * 1.2));
    s += speed * dt;

    const roll = THREE.MathUtils.clamp(-uVel * 0.12, -0.35, 0.35);
    waterPose(s, u, boatPos, boatQuatWater, roll, time);
    boatGroup.position.copy(boatPos);
    boatGroup.quaternion.copy(boatQuatWater);

    trailAcc += speed * dt;
    while (trailAcc > TRAIL_STEP) { trailAcc -= TRAIL_STEP; trail.unshift(boatPos.clone()); if (trail.length > 600) trail.pop(); }

    soak = Math.min(0.7, soak + rainAt(s) * dt * 0.0025);
    if (mode === 'sail' && s >= END) finale();
    if (mode === 'finale' && modeT > 6.5 && !$('end').classList.contains('is-on')) showEnd();
    if (mode === 'drift') driftT += dt;

    // chapter captions
    const ch = chapterAt(s);
    if (ch !== lastChapter && mode === 'sail') { if (lastChapter !== -1 || modeT < 1) caption(ch); lastChapter = ch; }
    if (!hintDiyaShown && mode === 'sail' && diyas.list.some(d => d.state === 0 && -d.z - s < 22 && -d.z - s > 4)) {
      hintDiyaShown = true; hint('Steer through the dark lamps to light them.', 6000);
    }
    for (const ts of banks.temples) if (!templeRung.has(ts) && Math.abs(ts - s) < 3) { templeRung.add(ts); sound.bell(-0.6); setTimeout(() => sound.bell(-0.55), 2600); }
  }

  // weather
  let r = rainAt(s);
  let clear = clearAt(s);
  if (mode === 'drift') { const cyc = 0.5 - 0.5 * Math.cos(driftT / 30); r = cyc * 0.45; clear = 1 - cyc * 0.6; }
  shared.uRain.value = r;
  shared.uClear.value = clear;
  shared.uWet.value = Math.max(0.35, Math.min(1, r * 1.4 + 0.3));
  shared.uFogDensity.value = mode === 'drift' ? 0.009 + r * 0.01 : fogAt(s);
  const fog = new THREE.Color('#1d1b26').lerp(new THREE.Color('#0f1424'), clear);
  shared.uFogColor.value.copy(fog);
  shared.uAmbient.value.setRGB(0.11, 0.105, 0.14).lerp(new THREE.Color(0.07, 0.09, 0.15), clear);

  // lightning: in the late canal and the ghat, the storm's heart
  if (firstStrike > 0 && mode === 'sail') { firstStrike -= dt; if (firstStrike <= 0) { strike(); nextStrike = 7; } }
  const storm = Math.max(0, w[2] * (1 - clear)) + w[1] * 0.3 + w[0] * 0.25;
  if ((mode === 'sail' || mode === 'gate' || mode === 'page') && storm > 0.2) {
    nextStrike -= dt * storm;
    if (nextStrike <= 0) { strike(); nextStrike = 4 + Math.random() * 8; }
  }
  lightning.update(dt, !flashOn || reduceMotion);
  shared.uFlash.value = lightning.flash;
  shared.uFlashDir.value.copy(lightning.dir);
  shared.uTime.value = time;

  // diyas
  if (mode !== 'fold') diyas.spawn(s);
  diyas.update(dt, s, boatPos, trailAt, time);

  banks.update(s);
  boat.uniforms.uSoak.value = soak;

  // sound: the beds every frame, and the score follows the journey
  const section = mode === 'gate' || mode === 'page' || mode === 'fold' ? 0 : mode === 'finale' || mode === 'drift' ? 4 : [1, 2, 3, 4][chapterAt(s)];
  sound.setSection(section);
  sound.update(dt, r, w[0], mode === 'sail' || mode === 'drift' ? speed : 0.6, blow > 0.3, 1, clear * (mode === 'drift' || mode === 'finale' || w[3] > 0.5 ? 1 : 0));
  skyline.uniforms.uFar.value = w[0] * 1 + w[1] * 1 + w[2] * 0.95 + w[3] * 0.3;
  water.uniforms.uFar.value = (w[1] + w[2] * 0.95 + w[3] * 0.3);
  boat.uniforms.uGlow.value = Math.min(0.5, diyas.following * 0.05);
}

function strike() {
  camera.getWorldDirection(tmp);
  lightning.strike(camera.position, tmp);
  sound.thunder(lightning.distance);
}

// ---------------------------------------------------------------- camera

function updateCamera(dt: number) {
  const rig = rigAt(s);
  let back = rig.back, h = rig.h, look = 7;
  if (mode === 'finale' || mode === 'drift') {
    const k = Math.min(1, modeT / 9);
    const e = k * k * (3 - 2 * k);
    back = THREE.MathUtils.lerp(rig.back, 6.5, e);
    h = THREE.MathUtils.lerp(rig.h, 3.0, e);
    look = THREE.MathUtils.lerp(7, 30, e);
  }
  const cs = s - back;
  const sway = reduceMotion ? 0 : Math.sin(time * 0.4) * 0.08;
  tmp.set(centre(cs) + u * 0.6 + sway, h + (reduceMotion ? 0 : Math.sin(time * 0.9) * 0.03), -cs);
  const k = 1 - Math.exp(-dt * (mode === 'fold' ? 1.0 : 3.0));
  if (mode === 'fold') { /* hold still while the paper folds */ } else camPos.lerp(tmp, k);
  tmp.set(centre(s + look) + u * 0.7, mode === 'finale' || mode === 'drift' ? 1.2 : 0.15 + h * 0.25, -(s + look));
  if (mode !== 'fold') camLook.lerp(tmp, k);
  camera.position.copy(camPos);
  camera.lookAt(camLook);
}

// ---------------------------------------------------------------- lights

const lightPool: { l: Light; d: number }[] = [];
const diyaLight = (x: number, y: number, z: number, b: number): Light => ({ p: new THREE.Vector3(x, y, z), c: new THREE.Vector3(1.0, 0.55, 0.22).multiplyScalar(b), size: 0.5, flicker: 1 });

function updateLights() {
  if (banks.dirty) {
    staticGlows.begin();
    for (const l of banks.lights) staticGlows.push(l.p, l.c, l.size * (l.glowOnly ? 1 : 1.6), l.flicker);
    staticGlows.end();
    banks.dirty = false;
  }
  flameGlows.begin(); haloGlows.begin();
  const lamps: Light[] = [];
  for (const d of diyas.list) {
    const f = diyas.flame(d);
    tmp.set(d.x, d.y + 0.06, d.z);
    if (f > 0) {
      flameGlows.push(tmp, new THREE.Vector3(1.0, 0.62, 0.25).multiplyScalar(1.6 * f), 0.07 * f, 1);
      haloGlows.push(tmp, new THREE.Vector3(1.0, 0.5, 0.18).multiplyScalar(0.55 * f), 0.75 * f, 1);
      lamps.push(diyaLight(d.x, d.y + 0.1, d.z, 0.9 * f));
    } else {
      // an ember on the wick, so you can see where the dark ones are
      const p = 0.5 + 0.5 * Math.sin(time * 2.2 + d.seed * 20);
      haloGlows.push(tmp, new THREE.Vector3(0.9, 0.35, 0.12).multiplyScalar(0.18 + p * 0.12), 0.32, 0);
      flameGlows.push(tmp, new THREE.Vector3(1.0, 0.35, 0.1).multiplyScalar(0.5), 0.018, 0);
    }
  }
  flameGlows.end(); haloGlows.end();

  // the sixteen lights that matter most right now light the world and the water
  camera.getWorldDirection(tmp);
  const focus = tmp.multiplyScalar(6).add(camera.position);
  lightPool.length = 0;
  for (const l of banks.lights) if (!l.glowOnly) lightPool.push({ l, d: l.p.distanceToSquared(focus) / (l.c.x + 0.2) });
  for (const l of lamps) lightPool.push({ l, d: l.p.distanceToSquared(focus) / (l.c.x + 0.2) });
  lightPool.sort((a, b) => a.d - b.d);
  for (let i = 0; i < MAX_LIGHTS; i++) {
    const e = lightPool[i];
    if (e) {
      shared.uLightPos.value[i].copy(e.l.p);
      const fl = e.l.flicker ? 0.85 + 0.15 * Math.sin(time * 15 + e.l.p.x * 7) : 1;
      shared.uLightCol.value[i].copy(e.l.c).multiplyScalar(fl);
    } else { shared.uLightPos.value[i].set(0, -999, 0); shared.uLightCol.value[i].set(0, 0, 0); }
  }
}

// ---------------------------------------------------------------- frame

function render() {
  sky.position.copy(camera.position);
  water.mesh.position.set(Math.round(camera.position.x / 10) * 10, 0, Math.round(camera.position.z / 10) * 10);
  water.uniforms.uBoat.value.copy(boatGroup.visible && mode !== 'fold' ? boatPos : tmp.set(0, -99, 0));
  const heading = Math.atan(slope(s));
  water.uniforms.uBoatFwd.value.set(Math.sin(heading), -Math.cos(heading));
  water.uniforms.uBoatSpeed.value = mode === 'sail' || mode === 'finale' || mode === 'drift' ? speed : 0;
  const cs = -camera.position.z;
  water.uniforms.uRiver.value.set(centre(cs + 6), 0, halfWidth(cs + 6), 0);
  const [wl, wr] = wallHeights(cs + 6);
  water.uniforms.uWalls.value.set(wl, wr);
  water.uniforms.uWindows.value = weights(cs + 6)[0];
  rain.geo.instanceCount = Math.floor(rain.max * Math.min(1, shared.uRain.value * 1.15) * quality);
  rain.uniforms.uVel.value.set(0, 0, -speed);
  renderer.render(scene, camera);
}

let quality = 1;
let last = performance.now();
let acc = 0, frames = 0, worstWindow = 0;
function frame(now: number) {
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
  last = now;
  step(dt);
  updateCamera(dt);
  updateLights();
  render();

  // adaptive resolution: hold ~45+ fps on a tablet
  acc += dt; frames++;
  if (acc > 2) {
    const fps = frames / acc;
    if (fps < 40 && dpr > 0.6) { dpr = Math.max(0.6, dpr - 0.15); renderer.setPixelRatio(dpr); resize(); quality = Math.max(0.5, quality - 0.1); }
    else if (fps > 57 && dpr < maxDpr) { dpr = Math.min(maxDpr, dpr + 0.1); renderer.setPixelRatio(dpr); resize(); quality = Math.min(1, quality + 0.1); }
    if (DEBUG) $('debug').textContent = `${fps.toFixed(0)} fps · dpr ${dpr.toFixed(2)} · s ${s.toFixed(0)} · ${mode} · lit ${lit}`;
    worstWindow = fps;
    acc = 0; frames = 0;
  }
  requestAnimationFrame(frame);
}

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.fov = w < h ? 74 : 58;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();

// ---------------------------------------------------------------- UI wiring

function setSoundButton() {
  const b = $('btn-sound');
  b.setAttribute('aria-pressed', String(sound.enabled));
  b.querySelector('.label')!.textContent = sound.enabled ? 'Sound on' : 'Sound off';
}
$('enter-sound').addEventListener('click', () => enter(true));
$('enter-quiet').addEventListener('click', () => enter(false));
$('btn-fold').addEventListener('click', fold);
$('btn-clear').addEventListener('click', () => { page.clear(); });
$('btn-sound').addEventListener('click', () => { sound.enabled ? sound.stop() : sound.start(); setSoundButton(); });
$('btn-flash').addEventListener('click', () => {
  flashOn = !flashOn;
  $('btn-flash').setAttribute('aria-pressed', String(flashOn));
  $('btn-flash').querySelector('.label')!.textContent = flashOn ? 'Lightning flashes on' : 'Lightning flashes soft';
});
$('btn-info').addEventListener('click', () => ($('about') as HTMLDialogElement).showModal());
$('btn-again').addEventListener('click', restart);
$('btn-drift').addEventListener('click', drift);
$('btn-card').addEventListener('click', postcard);
page.onInk = () => $('btn-fold').classList.add('is-ready');
document.addEventListener('visibilitychange', () => { if (document.hidden && sound.ctx) sound.ctx.suspend(); else if (sound.ctx && sound.enabled) sound.ctx.resume(); });

// ---------------------------------------------------------------- go

banks.prime(s);
updateCamera(1);
camPos.copy(camera.position);
document.documentElement.classList.add('ready');
requestAnimationFrame(t => { last = t; frame(t); });

// QA hooks
if (DEBUG) {
  $('debug').hidden = false;
  const w = window as unknown as Record<string, unknown>;
  w.__ff = (sec: number) => { const n = Math.round(sec * 30); for (let i = 0; i < n; i++) { step(1 / 30); updateCamera(1 / 30); } updateLights(); };
  w.__scene = scene;
  w.__go = (to: number) => { s = to; trail.length = 0; banks.reset(); banks.prime(s); diyas.reset(); diyas.startAt(s); updateCamera(1); camPos.copy(tmp); };
  w.__strike = strike;
  w.__auto = (on: boolean) => { autopilot = on; };
  w.__probe = () => ({ mode, s: Math.round(s), chapter: chapterAt(s), lit, following: diyas.following, diyas: diyas.list.length, lights: banks.lights.length, dpr, fps: worstWindow, rain: shared.uRain.value.toFixed(2) });
  w.__mode = () => mode;
}
void STARTS;
