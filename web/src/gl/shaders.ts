// GLSL for Barsaat. Conventions:
//  - Simulation space is CSS pixels, y down (same as pointer events).
//  - Render targets are y-up (GL); every pass converts with p = vec2(uv.x, 1.0 - uv.y) * uView.
//  - Water map is premultiplied: rgb = (normal.xy*0.5+0.5, thickness) * coverage, a = coverage.
//    That lets "fade" and "erase" be plain blends without corrupting the normals.

const H = `#version 300 es
precision highp float;
`;

export const QUAD_VS = `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

// ---------- drops (instanced sprites into the water map) ----------
export const DROP_VS = `#version 300 es
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aDrop; // x, y, rx, ry (CSS px)
uniform vec2 uView;
out vec2 vP;
void main() {
  vP = aCorner;
  vec2 pos = aDrop.xy + aCorner * aDrop.zw;
  gl_Position = vec4(pos.x / uView.x * 2.0 - 1.0, 1.0 - pos.y / uView.y * 2.0, 0.0, 1.0);
}`;

export const DROP_FS = H + `
in vec2 vP;
uniform int uMode;       // 0 water, 1 erase
uniform float uStrength;
out vec4 o;
void main() {
  // a drop on glass is flatter at the top and heavier at the bottom
  vec2 q = vP;
  q.y *= q.y > 0.0 ? 0.92 : 1.08; // q.y > 0 is the lower half (CSS y down maps to -y in clip; corner +1 = lower)
  float r = length(q);
  if (r > 1.0) discard;
  float a = smoothstep(1.0, 0.78, r);
  if (uMode == 1) { o = vec4(0.0, 0.0, 0.0, a * uStrength); return; }
  a *= uStrength;
  float h = sqrt(max(1.0 - r * r, 0.0));
  vec2 n = q * (0.55 + 0.45 * r);   // steeper near the rim
  n.y = -n.y;                        // to y-up texture space
  o = vec4(vec3(n * 0.5 + 0.5, h) * a, a);
}`;

export const FADE_FS = H + `
uniform float uK;
out vec4 o;
void main() { o = vec4(0.0, 0.0, 0.0, uK); }`;

export const BLIT_FS = H + `
in vec2 vUv;
uniform sampler2D uTex;
out vec4 o;
void main() { o = texture(uTex, vUv); }`;

// ---------- fog simulation (ping-pong) ----------
// r = condensation on the glass, g = fresh breath (whiter, evaporates fast)
export const FOG_FS = H + `
in vec2 vUv;
uniform sampler2D uPrev;
uniform sampler2D uWater;
uniform sampler2D uText;
uniform vec2 uView;
uniform float uDt;
uniform float uRegrow;
uniform float uTime;
uniform vec4 uSeg[12];
uniform float uSegR[12];
uniform int uSegN;
uniform vec4 uBreath;      // x, y, strength, radius
uniform float uTextFront;  // reveal front in uv.x
uniform float uTextOn;
uniform float uInit;
out vec4 o;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float capsule(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  vec2 p = vec2(vUv.x, 1.0 - vUv.y) * uView;
  vec4 prev = texture(uPrev, vUv);
  float f = prev.r, b = prev.g;
  if (uInit > 0.5) { f = 0.86 + 0.14 * vnoise(p * 0.01); b = 0.0; }

  // condensation regrows unevenly: faster at the bottom and edges of the pane, as real glass does
  float grain = 0.55 + 0.45 * vnoise(p * 0.02 + uTime * 0.01);
  float edge = 1.0 + 0.6 * smoothstep(0.55, 1.0, vUv.y < 0.5 ? 1.0 - vUv.y * 2.0 : 0.0);
  f += uRegrow * uDt * (1.0 - f) * grain * edge;

  // breath fades quickly back into ordinary condensation
  float evap = b * min(1.0, uDt * 0.22);
  b -= evap;
  f = max(f, min(1.0, f + evap * 0.3));

  // water on the glass cuts through fog (runners leave clear channels)
  vec4 w = texture(uWater, vUv);
  float wet = smoothstep(0.76, 0.95, w.a); // live drops and runners, not the fine beads
  float cut = wet * min(1.0, uDt * 9.0);
  f *= 1.0 - cut; b *= 1.0 - cut;

  // the finger
  for (int i = 0; i < 12; i++) {
    if (i >= uSegN) break;
    float r = uSegR[i];
    float d = capsule(p, uSeg[i].xy, uSeg[i].zw);
    // ragged edge: a finger never leaves a perfect line
    float rag = (vnoise(p * 0.18) - 0.5) * r * 0.35;
    float m = 1.0 - smoothstep(r * 0.55, r, d + rag);
    f *= 1.0 - m * 0.97;
    b *= 1.0 - m;
  }

  // breath
  if (uBreath.z > 0.0) {
    float d = length(p - uBreath.xy);
    float m = 1.0 - smoothstep(uBreath.w * 0.25, uBreath.w, d + (vnoise(p * 0.05) - 0.5) * uBreath.w * 0.5);
    b = min(1.0, b + m * uBreath.z * uDt * 2.4);
  }

  // words written by the invisible finger
  if (uTextOn > 0.0) {
    float t = texture(uText, vec2(vUv.x, 1.0 - vUv.y)).a;
    float front = uTextFront + (vnoise(p * 0.08) - 0.5) * 0.012;
    float m = t * smoothstep(front, front - 0.004, vUv.x) * uTextOn;
    f *= 1.0 - m;
    b *= 1.0 - m;
  }

  o = vec4(clamp(f, 0.0, 1.0), clamp(b, 0.0, 1.0), 0.0, 1.0);
}`;

// ---------- composite ----------
export const COMPOSITE_FS = H + `
in vec2 vUv;
uniform sampler2D uPlate;
uniform sampler2D uBlur;
uniform sampler2D uFog;
uniform sampler2D uWater;
uniform vec2 uRes;          // drawing buffer px
uniform vec2 uView;         // CSS px
uniform vec4 uCover;        // plate uv = uv * uCover.xy + uCover.zw (y down)
uniform float uTime;
uniform float uFlash;       // lightning exposure 0..1
uniform float uDark;        // storm darkness 0..1
uniform float uRain;        // rain intensity 0..1 (streaks outside)
uniform vec4 uLamps[14];    // plate uv x, y, intensity, size
uniform int uLampN;
uniform vec4 uBolt[10];     // lightning segments in plate uv
uniform int uBoltN;
uniform float uGrille;      // grille visibility
uniform float uReveal;      // intro fade from black
out vec4 o;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }

vec2 plateUv(vec2 uv) { return vec2(uv.x, 1.0 - uv.y) * uCover.xy + uCover.zw; }

float segDist(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * h);
}

// the world outside, before any glass
vec3 world(vec2 pu, float blur) {
  vec3 sharp = texture(uPlate, pu).rgb;
  vec3 soft = texture(uBlur, pu).rgb;
  vec3 c = mix(sharp, soft, blur);
  // storm grade: deeper, cooler; the plate is dusk already
  float sky = smoothstep(0.42, 0.18, pu.y);
  c *= mix(1.0, 0.72, uDark);
  c = mix(c, c * vec3(0.86, 0.9, 1.08), uDark * 0.6);
  // rain falling outside, between us and the river
  if (uRain > 0.01) {
    vec2 rp = pu * vec2(220.0, 9.0) + vec2(pu.y * 22.0, -uTime * 7.5);
    float s = smoothstep(0.985, 1.0, hash(floor(rp))) * smoothstep(0.0, 0.5, fract(rp.y)) * (1.0 - fract(rp.y));
    c += vec3(0.55, 0.6, 0.7) * s * uRain * 0.18 * (1.0 - blur * 0.6);
  }
  // floating diyas and their streaks on the water
  vec2 asp = vec2(uCover.x / uCover.y * uView.x / uView.y, 1.0); // plate px aspect
  for (int i = 0; i < 14; i++) {
    if (i >= uLampN) break;
    vec4 L = uLamps[i];
    vec2 d = (pu - L.xy) * vec2(1.79, 1.0);
    float size = L.w * (1.0 + blur * 2.5);
    float core = exp(-dot(d, d) / (size * size));
    vec2 dr = d - vec2(0.0, size * 3.0);
    float refl = exp(-(dr.x * dr.x) / (size * size * 0.6) - (dr.y * dr.y) / (size * size * 30.0)) * step(0.0, d.y);
    c += vec3(1.0, 0.6, 0.24) * L.z * (core * 1.1 + refl * 0.3);
  }
  // lightning: the whole scene lit for a heartbeat, sky most of all
  if (uFlash > 0.0) {
    c = c * (1.0 + uFlash * (1.4 + sky * 2.2)) + vec3(0.5, 0.55, 0.75) * uFlash * (0.05 + sky * 0.22);
    float bolt = 0.0;
    for (int i = 0; i < 10; i++) {
      if (i >= uBoltN) break;
      float d = segDist(pu * vec2(1.79, 1.0), uBolt[i].xy * vec2(1.79, 1.0), uBolt[i].zw * vec2(1.79, 1.0));
      bolt += exp(-d * mix(900.0, 160.0, blur)) * 1.2 + exp(-d * 40.0) * 0.12;
    }
    c += vec3(0.8, 0.85, 1.0) * bolt * uFlash;
  }
  return c;
}

void main() {
  vec2 uv = vUv;
  vec2 px = 1.0 / uView;
  vec2 pu = plateUv(uv);

  vec4 fogS = texture(uFog, uv);
  float fog = max(fogS.r, fogS.g);
  float breath = fogS.g;

  // gradient of the fog: a wiped stroke has a slightly wet, brighter rim
  float fx = texture(uFog, uv + vec2(px.x * 3.0, 0.0)).r - texture(uFog, uv - vec2(px.x * 3.0, 0.0)).r;
  float fy = texture(uFog, uv + vec2(0.0, px.y * 3.0)).r - texture(uFog, uv - vec2(0.0, px.y * 3.0)).r;
  float rim = clamp(length(vec2(fx, fy)) * 2.2, 0.0, 1.0);

  // water on the glass
  vec4 w = texture(uWater, uv);
  float cov = w.a;
  vec3 wd = w.a > 0.003 ? w.rgb / w.a : vec3(0.5, 0.5, 0.0);
  vec2 n = wd.xy * 2.0 - 1.0;
  float h = wd.z;

  // glass: through clear patches you see the world nearly sharp; through fog, blurred and lifted
  vec3 clear = world(pu, 0.12);
  vec3 blurred = world(pu, 1.0);
  float lum = dot(blurred, vec3(0.299, 0.587, 0.114));
  vec3 scatter = mix(blurred, vec3(lum), 0.35) * 1.05 + vec3(0.045, 0.05, 0.062) + vec3(0.03, 0.035, 0.045) * (1.0 + uFlash * 4.0);
  scatter += vec3(0.05, 0.05, 0.055) * breath;                                     // breath is whiter
  scatter += (hash(uv * uRes + floor(uTime * 0.0)) - 0.5) * 0.035 * fog;          // micro-beads of condensation
  vec3 col = mix(clear, scatter, smoothstep(0.04, 0.7, fog));
  col += vec3(0.07, 0.065, 0.06) * rim * (0.4 + fog);

  // drops are lenses: each one shows a small, upside-down, sharp world
  if (cov > 0.01) {
    vec2 refr = pu - vec2(n.x, -n.y) * (0.06 + 0.1 * h) * vec2(uCover.x, uCover.y) * 0.9;
    vec3 inDrop = world(refr, 0.0);
    inDrop = inDrop * 1.08 + 0.015;
    float rimDark = smoothstep(0.55, 0.0, h);
    inDrop *= 1.0 - rimDark * 0.32;
    // highlights: the room lamp (behind you, up left) and the sky
    vec3 N = normalize(vec3(n * 1.4, 1.0));
    float spec = pow(max(dot(N, normalize(vec3(-0.45, 0.55, 0.7))), 0.0), 60.0);
    float sky = pow(max(dot(N, normalize(vec3(0.2, 0.9, 0.35))), 0.0), 18.0);
    inDrop += vec3(1.0, 0.86, 0.66) * spec * 0.9 + vec3(0.55, 0.6, 0.8) * sky * 0.12 * (1.0 + uFlash * 6.0);
    col = mix(col, inDrop, smoothstep(0.0, 0.6, cov));
  }

  // the room: warm lamp reflected faintly in the glass, darker corners
  vec2 sp = uv * uView;
  vec2 lampP = vec2(0.12, 0.9) * uView;
  float lampGlow = exp(-length(sp - lampP) / (0.45 * max(uView.x, uView.y)));
  col += vec3(0.09, 0.06, 0.035) * lampGlow * (0.6 + 0.4 * fog);

  // slim iron grille in front of the glass, out of focus
  if (uGrille > 0.0) {
    float bars = uView.x > uView.y ? 4.0 : 3.0;
    float bw = max(uView.x, uView.y) * 0.0032;
    float xx = sp.x / uView.x * bars;
    float dx = abs(fract(xx) - 0.5) * uView.x / bars;
    float soft = 3.5;
    float bar = 1.0 - smoothstep(bw, bw + soft, dx);
    bar *= step(0.5, xx) * step(xx, bars - 0.5);
    float g = bar * uGrille;
    vec3 iron = vec3(0.03, 0.026, 0.024) + vec3(0.16, 0.1, 0.06) * lampGlow * (1.0 - dx / (bw + soft));
    col = mix(col, iron, g * 0.9);
  }

  // vignette + wooden frame shadow
  vec2 e = abs(uv - 0.5) * 2.0;
  float vig = smoothstep(1.45, 0.35, length(e * vec2(0.85, 1.0)));
  col *= mix(0.55, 1.0, vig);
  float frame = smoothstep(0.985, 1.0, max(e.x, e.y));
  col = mix(col, vec3(0.03, 0.022, 0.016), frame);

  // gentle filmic curve keeps midtones readable at tablet brightness
  col = col / (1.0 + col * 0.35) * 1.12;
  col = pow(max(col, 0.0), vec3(0.92));
  col += (hash(uv * uRes + fract(uTime) * 61.0) - 0.5) / 255.0 * 2.0; // dither
  o = vec4(col * uReveal, 1.0);
}`;
