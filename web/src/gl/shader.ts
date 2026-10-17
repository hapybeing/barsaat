// The whole folio is one full-screen fragment shader: the painted window, the frame around it
// (gold rules, floral border, spandrels of the arch), and everything alive inside the painting:
// breathing clouds, flowing water, swaying leaves, painted rain, gold lightning, cranes, the
// ink-bleed between chapters, the cloudburst, and the finale's writing on a misted window.

export const vert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

export const MAX_SEG = 14;

export const frag = /* glsl */ `
precision highp float;
varying vec2 vUv;

uniform vec2 uRes;
uniform vec4 uWin;
uniform float uArch;
uniform float uBand;
uniform float uBorderAsp;
uniform float uOpaqueTop;
uniform float uShow;
uniform float uPx;

uniform sampler2D tA; uniform sampler2D mA; uniform vec2 uSizeA; uniform vec2 uFocA;
uniform sampler2D tB; uniform sampler2D mB; uniform vec2 uSizeB; uniform vec2 uFocB;
uniform float uMix;
uniform sampler2D tBorder;
uniform sampler2D tMsg; uniform vec4 uMsgRect; uniform float uMsg; uniform float uMsgT;

uniform float uTime, uRain, uSlant, uStorm, uWet, uDusk, uClear, uDry, uWind, uBurst, uMap, uCalm;
uniform vec2 uPar;
uniform float uFlash;
uniform vec4 uSeg[${MAX_SEG}];
uniform float uSegN, uBoltT, uBoltA;
uniform float uCrane; uniform float uCraneY; uniform float uDim;

const vec3 PAPER = vec3(0.914, 0.851, 0.753);
const vec3 INK = vec3(0.075, 0.07, 0.065);
const vec3 GOLD = vec3(0.80, 0.63, 0.29);
const vec3 GOLDHI = vec3(0.95, 0.76, 0.31);
const vec3 INDIGO = vec3(0.105, 0.125, 0.25);

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float hash1(float n) { return fract(sin(n * 91.3458) * 47453.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }

vec2 coverUV(vec2 q, vec2 size, vec2 foc) {
  float ap = size.x / size.y;
  float aw = uWin.z / uWin.w;
  vec2 frac = aw > ap ? vec2(1.0, ap / aw) : vec2(aw / ap, 1.0);
  frac *= 0.955;
  vec2 c = clamp(foc, frac * 0.5, 1.0 - frac * 0.5);
  vec2 uv = c + (q - 0.5) * frac;
  return vec2(uv.x, 1.0 - uv.y); // textures are stored bottom-up
}

vec3 plate(sampler2D tex, sampler2D msk, vec2 uv, float t, out vec3 m) {
  m = texture2D(msk, uv).rgb;
  float calm = 1.0 - uCalm;
  uv += uPar * (0.004 + 0.01 * (1.0 - m.r)) * calm;
  vec2 f = vec2(fbm(uv * 3.0 + vec2(t * 0.035, 0.0)), fbm(uv * 3.0 + vec2(7.3, -t * 0.028))) - 0.5;
  uv += f * 0.014 * m.r * calm;
  float wn = noise(vec2(uv.x * 70.0, uv.y * 16.0 + t * 1.6));
  uv += vec2(0.0015, 0.0045) * (wn - 0.5) * m.g * calm;
  uv.x += sin(t * 1.4 + uv.y * 34.0 + uv.x * 11.0) * 0.0011 * m.b * (0.5 + abs(uWind) * 2.0) * calm;
  vec3 col = texture2D(tex, uv).rgb;
  float sh = smoothstep(0.42, 0.8, fbm(uv * 2.2 + vec2(t * 0.025, 0.0)));
  col *= 1.0 - m.r * 0.2 * sh * calm;
  float g = pow(noise(vec2(uv.x * 140.0, uv.y * 40.0 + t * 2.5)), 9.0);
  col += m.g * g * 0.5 * vec3(0.95, 0.97, 1.0) * calm;
  return col;
}

float rainLayer(vec2 p, float sc, float speed, float dens, float seed) {
  float a = -0.08 - uSlant * 0.42 - uWind * 0.35;
  float ca = cos(a), sa = sin(a);
  p = vec2(ca * p.x - sa * p.y, sa * p.x + ca * p.y);
  float cw = 7.0 * sc;
  float cid = floor(p.x / cw);
  float r1 = hash1(cid * 1.31 + seed), r2 = hash1(cid * 7.77 + seed), r3 = hash1(cid * 3.1 + seed * 2.0);
  float L = 46.0 * sc * (0.7 + r2 * 0.6);
  float y = p.y / L - uTime * speed * (0.8 + r1 * 0.5) * (1.0 - uCalm * 0.9) + r2 * 10.0;
  float row = floor(y / 3.0);
  float fy = fract(y / 3.0);
  float on = step(hash1(row * 1.7 + cid * 3.3 + seed), dens);
  float dx = abs(fract(p.x / cw) - (0.2 + r3 * 0.6)) * cw;
  float line = smoothstep(0.75 * sc, 0.0, dx);
  float body = smoothstep(0.0, 0.3, fy) * step(fy, 0.33);
  return line * body * on;
}

float segDist(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uRes;

  float x0 = uWin.x, y0 = uWin.y, w = uWin.z, h = uWin.w;
  vec2 c = vec2(x0 + w * 0.5, y0 + h * 0.5);
  vec2 dd = abs(px - c) - vec2(w, h) * 0.5;
  float dRect = max(dd.x, dd.y);
  float A = min(w * 0.36, h * 0.22) * uArch;
  float ys = y0 + A;
  float d = dRect;
  if (A > 0.5 && px.y < ys) {
    float R = (w * w * 0.25 + A * A) / w;
    vec2 cL = vec2(x0 + R, ys), cR = vec2(x0 + w - R, ys);
    float dArch = max(length(px - cL) - R, length(px - cR) - R);
    d = max(dArch, dRect);
  }

  vec3 col = PAPER;
  float alpha = 0.0;
  vec2 q = (px - uWin.xy) / uWin.zw;

  if (d < 0.0) {
    float t = uTime;
    vec3 ma, mb;
    vec2 uva = coverUV(q, uSizeA, uFocA);
    vec2 uvb = coverUV(q, uSizeB, uFocB);
    vec3 ca = plate(tA, mA, uva, t, ma);
    vec3 cb = ca; mb = ma;
    if (uMix > 0.001) cb = plate(tB, mB, uvb, t, mb);
    float n = fbm(q * vec2(3.2, 4.0) + 3.0) * 0.55 + (q.y * 0.35 + 0.1) + fbm(q * 14.0) * 0.08;
    float edge = uMix * 1.25 - 0.12;
    float k = smoothstep(n - 0.035, n + 0.035, edge);
    col = mix(ca, cb, k);
    vec3 m = mix(ma, mb, k);
    float inkLine = exp(-pow((edge - n) / 0.022, 2.0)) * step(0.001, uMix) * step(uMix, 0.999);
    col = mix(col, INK, inkLine * 0.75);

    if (uMap > 0.001) {
      vec3 sheet = vec3(0.93, 0.87, 0.76) * (0.92 + 0.08 * fbm(q * 6.0)) - 0.06 * smoothstep(0.3, 0.8, fbm(q * 3.0 + 9.0));
      sheet *= 1.0 - 0.18 * pow(length(q - 0.5) * 1.3, 3.0);
      col = mix(col, sheet, uMap);
    }

    float nm = 1.0 - uMap;
    col = mix(col, col * vec3(1.07, 1.0, 0.84) + vec3(0.03, 0.02, 0.0), uDry * 0.45 * nm);
    col = mix(col, col * col * 1.32 + col * 0.04, uWet * 0.42 * nm);
    col *= mix(vec3(1.0), vec3(1.06, 0.9, 0.88), uDusk * 0.35 * nm);
    col *= 1.0 - uStorm * (0.08 + 0.2 * (1.0 - q.y)) * nm;
    col = mix(col, col * vec3(0.96, 1.0, 1.08) + vec3(0.0, 0.01, 0.03), uClear * 0.25 * nm);

    if (uBoltA > 0.001) {
      vec2 pq = vec2(q.x * w, q.y * h);
      float bd = 1e5;
      for (int i = 0; i < ${MAX_SEG}; i++) {
        if (float(i) >= uSegN) break;
        vec4 s = uSeg[i];
        float dist = segDist(pq, s.xy * vec2(w, h), s.zw * vec2(w, h));
        if (float(i) / uSegN <= uBoltT) bd = min(bd, dist);
      }
      float core = smoothstep(2.4, 0.6, bd);
      float glow = exp(-bd / 22.0) * 0.55;
      col = mix(col, GOLDHI * 1.15, core * uBoltA);
      col += GOLDHI * glow * uBoltA * 0.6;
    }
    col += col * uFlash * (0.8 + 0.8 * m.r) + vec3(1.0, 0.86, 0.55) * uFlash * 0.1 * (1.0 - q.y);

    if (uCrane > 0.0 && uCrane < 1.0) {
      vec2 pq = vec2(q.x * w / h, q.y);
      for (int i = 0; i < 7; i++) {
        float fi = float(i);
        vec2 b = vec2(mix(-0.25, w / h + 0.25, uCrane) - fi * 0.045, uCraneY + fi * 0.022 + sin(uCrane * 6.0 + fi) * 0.004);
        float flap = sin(uTime * 7.0 + fi * 1.3) * 0.5 + 0.5;
        float s = 0.018;
        vec2 l = b + vec2(-s, -s * (0.15 + flap * 0.6));
        vec2 r = b + vec2(s * 0.9, -s * (0.15 + flap * 0.6));
        float dc = min(segDist(pq, b, l), segDist(pq, b, r));
        dc = min(dc, length(pq - b - vec2(0.006, 0.0)) - 0.0025);
        float bird = smoothstep(0.0028, 0.0008, dc);
        col = mix(col, vec3(0.97, 0.95, 0.9), bird * 0.95);
      }
    }

    if (uRain > 0.001) {
      float r = 0.0;
      r += rainLayer(px, 1.7, 0.9, uRain * 0.55, 1.0) * 0.32;
      r += rainLayer(px + 13.0, 1.05, 1.15, uRain * 0.7, 2.0) * 0.26;
      r += rainLayer(px + 31.0, 0.62, 1.4, uRain * 0.85, 3.0) * 0.2;
      col = mix(col, vec3(0.86, 0.88, 0.9), r * (0.6 + uRain * 0.6));
    }

    if (uBurst > 0.001) {
      float fl = fbm(q * vec2(4.0, 2.0) + vec2(0.0, -uTime * 0.6)) * 0.4 + q.y * 0.6;
      float inked = smoothstep(fl - 0.05, fl + 0.05, uBurst * 1.3 - 0.05);
      col = mix(col, INK * (0.9 + 0.3 * fbm(q * 9.0 + uTime * 0.2)), inked);
    }

    if (uMsg > 0.001) {
      vec2 mq = (q - uMsgRect.xy) / uMsgRect.zw;
      float inside = step(0.0, mq.x) * step(mq.x, 1.0) * step(0.0, mq.y) * step(mq.y, 1.0);
      vec2 mt = vec2(mq.x, 1.0 - mq.y);
      float sharp = texture2D(tMsg, mt).r * inside;
      float soft = texture2D(tMsg, mt, 2.5).r * inside;
      float reveal = smoothstep(mq.x - 0.02, mq.x + 0.02, uMsgT * 1.15 - 0.08 + mq.y * 0.05);
      float stroke = smoothstep(0.25, 0.6, sharp) * reveal;
      float bead = smoothstep(0.05, 0.3, soft) * (1.0 - smoothstep(0.55, 0.85, sharp)) * reveal;
      float colid = floor(mq.x * 90.0);
      float dl = hash1(colid * 2.7);
      float drip = step(0.82, dl) * smoothstep(0.35, 0.0, abs(fract(mq.x * 90.0) - 0.5)) * smoothstep(dl * 0.6 + uMsgT * 0.5, 0.0, mq.y - 0.55) * step(0.55, mq.y) * reveal * inside;
      vec3 fogged = texture2D(tA, uva, 3.5).rgb * 0.55 + vec3(0.36, 0.4, 0.48);
      float fogAmt = uMsg * 0.8 * (1.0 - stroke * 0.92);
      vec3 base = mix(col, fogged, fogAmt);
      vec2 grad = vec2(dFdx(soft), dFdy(soft));
      vec3 refr = texture2D(tA, uva + grad * 0.6).rgb;
      base = mix(base, refr * 1.15 + 0.05, bead * uMsg * 0.8);
      base += vec3(0.9, 0.95, 1.0) * clamp(-grad.y * 18.0 + grad.x * 6.0, 0.0, 1.0) * bead * uMsg * 0.6;
      base = mix(base, refr * 1.1 + 0.08, drip * uMsg * 0.7);
      col = base;
    }

    col *= 1.0 - uDim * 0.78 * smoothstep(0.1, 0.9, q.y);
    col *= 1.0 - 0.22 * pow(length((q - 0.5) * vec2(1.0, 0.9)) * 1.35, 3.0);
    col += (hash(px * 0.73 + fract(uTime)) - 0.5) * 0.035;
    alpha = 1.0;
    float rim = smoothstep(1.6, 0.4, abs(d + 1.2)) * uArch;
    col = mix(col, GOLD, rim * 0.9);
  } else {
    float dr = dRect;
    float B = uBand;
    if (dRect < 0.0) {
      vec3 sp = INDIGO * (0.85 + 0.25 * fbm(px * 0.03));
      float dots = step(0.86, hash(floor(px / 7.0))) * smoothstep(1.4, 0.4, length(fract(px / 7.0) - 0.5) * 7.0);
      sp = mix(sp, GOLD, dots * 0.8);
      float rule = smoothstep(1.5, 0.3, abs(d - 1.0));
      col = mix(sp, GOLD, rule);
      alpha = 1.0;
    } else if (dr < 4.0) {
      float r1 = smoothstep(1.0, 0.2, abs(dr - 0.8)), r2 = smoothstep(1.0, 0.2, abs(dr - 3.2));
      col = mix(vec3(0.16, 0.14, 0.12), GOLD, max(r1, r2));
      alpha = 1.0;
    } else if (dr < 4.0 + B) {
      float ox = max(x0 - px.x, px.x - (x0 + w));
      float oy = max(y0 - px.y, px.y - (y0 + h));
      float across = (dr - 4.0) / B;
      vec2 tuv;
      float scale = B * uBorderAsp;
      if (ox > oy) tuv = vec2(px.y / scale, px.x < c.x ? 1.0 - across : across);
      else tuv = vec2(px.x / scale, px.y < c.y ? 1.0 - across : across);
      col = texture2D(tBorder, tuv).rgb;
      alpha = 1.0;
    } else if (dr < 7.0 + B) {
      float r1 = smoothstep(1.0, 0.2, abs(dr - 5.6 - B));
      col = mix(vec3(0.16, 0.14, 0.12), GOLD, r1);
      alpha = smoothstep(7.0 + B, 6.0 + B, dr);
    }
    if (alpha < 1.0 && px.y < uOpaqueTop) {
      vec3 paper = PAPER * (0.97 + 0.04 * noise(px * 0.35)) - 0.015 * fbm(px * 0.01);
      float pa = smoothstep(uOpaqueTop, uOpaqueTop - 14.0, px.y);
      col = mix(paper, col, alpha);
      alpha = max(alpha, pa);
    }
  }
  alpha *= uShow;
  gl_FragColor = vec4(col * alpha, alpha);
}
`;
