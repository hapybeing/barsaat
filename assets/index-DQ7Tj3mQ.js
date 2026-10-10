var nt=Object.defineProperty;var ot=(r,e,a)=>e in r?nt(r,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):r[e]=a;var o=(r,e,a)=>ot(r,typeof e!="symbol"?e+"":e,a);function _(r,e,a){const i=(s,h)=>{const c=r.createShader(s);if(r.shaderSource(c,h),r.compileShader(c),!r.getShaderParameter(c,r.COMPILE_STATUS)){const l=r.getShaderInfoLog(c);throw r.deleteShader(c),new Error("shader: "+l)}return c},t=r.createProgram();if(r.attachShader(t,i(r.VERTEX_SHADER,e)),r.attachShader(t,i(r.FRAGMENT_SHADER,a)),r.linkProgram(t),!r.getProgramParameter(t,r.LINK_STATUS))throw new Error("link: "+r.getProgramInfoLog(t));return t}function P(r,e,a){const i={};for(const t of a)i[t]=r.getUniformLocation(e,t);return i}function rt(r,e,a,i=r.LINEAR,t=null){const s=r.createTexture();return r.bindTexture(r.TEXTURE_2D,s),r.texImage2D(r.TEXTURE_2D,0,r.RGBA8,e,a,0,r.RGBA,r.UNSIGNED_BYTE,t),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,i),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,i),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),s}function O(r,e,a){const i=rt(r,e,a),t=r.createFramebuffer();return r.bindFramebuffer(r.FRAMEBUFFER,t),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,i,0),r.clearColor(0,0,0,0),r.clear(r.COLOR_BUFFER_BIT),r.bindFramebuffer(r.FRAMEBUFFER,null),{fbo:t,tex:i,w:e,h:a}}function z(r,e){e&&(r.deleteFramebuffer(e.fbo),r.deleteTexture(e.tex))}function tt(r,e){const a=r.createTexture();return r.bindTexture(r.TEXTURE_2D,a),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.texImage2D(r.TEXTURE_2D,0,r.RGBA8,r.RGBA,r.UNSIGNED_BYTE,e),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),a}function k(r,e,a,i){r.activeTexture(r.TEXTURE0+e),r.bindTexture(r.TEXTURE_2D,a),r.uniform1i(i,e)}const I=`#version 300 es
precision highp float;
`,X=`#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,ht=`#version 300 es
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aDrop; // x, y, rx, ry (CSS px)
uniform vec2 uView;
out vec2 vP;
void main() {
  vP = aCorner;
  vec2 pos = aDrop.xy + aCorner * aDrop.zw;
  gl_Position = vec4(pos.x / uView.x * 2.0 - 1.0, 1.0 - pos.y / uView.y * 2.0, 0.0, 1.0);
}`,ct=I+`
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
}`,lt=I+`
uniform float uK;
out vec4 o;
void main() { o = vec4(0.0, 0.0, 0.0, uK); }`,ut=I+`
in vec2 vUv;
uniform sampler2D uTex;
out vec4 o;
void main() { o = texture(uTex, vUv); }`,ft=I+`
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
}`,dt=I+`
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
}`,mt=1376,pt=768,vt=.6;class xt{constructor(e,a,i){o(this,"gl");o(this,"canvas");o(this,"progDrop");o(this,"uDrop");o(this,"progFade");o(this,"uFade");o(this,"progBlit");o(this,"uBlit");o(this,"progFog");o(this,"uFog");o(this,"progComp");o(this,"uComp");o(this,"vaoQuad");o(this,"vaoDrop");o(this,"instBuf");o(this,"inst",new Float32Array(4*4096));o(this,"plate");o(this,"blur");o(this,"textTex");o(this,"fogA",null);o(this,"fogB",null);o(this,"beads",null);o(this,"water",null);o(this,"fogInit",!0);o(this,"view",{w:1,h:1});o(this,"dpr",1);o(this,"simScale",.5);o(this,"segArr",new Float32Array(48));o(this,"segR",new Float32Array(12));this.canvas=e;const t=e.getContext("webgl2",{antialias:!1,alpha:!1,premultipliedAlpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1});if(!t)throw new Error("no webgl2");this.gl=t,this.progDrop=_(t,ht,ct),this.uDrop=P(t,this.progDrop,["uView","uMode","uStrength"]),this.progFade=_(t,X,lt),this.uFade=P(t,this.progFade,["uK"]),this.progBlit=_(t,X,ut),this.uBlit=P(t,this.progBlit,["uTex"]),this.progFog=_(t,X,ft),this.uFog=P(t,this.progFog,["uPrev","uWater","uText","uView","uDt","uRegrow","uTime","uSeg","uSegR","uSegN","uBreath","uTextFront","uTextOn","uInit"]),this.progComp=_(t,X,dt),this.uComp=P(t,this.progComp,["uPlate","uBlur","uFog","uWater","uRes","uView","uCover","uTime","uFlash","uDark","uRain","uLamps","uLampN","uBolt","uBoltN","uGrille","uReveal"]),this.vaoQuad=t.createVertexArray(),this.vaoDrop=t.createVertexArray(),t.bindVertexArray(this.vaoDrop);const s=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,s),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),this.instBuf=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.instBuf),t.bufferData(t.ARRAY_BUFFER,this.inst.byteLength,t.DYNAMIC_DRAW),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,4,t.FLOAT,!1,0,0),t.vertexAttribDivisor(1,1),t.bindVertexArray(null),this.plate=tt(t,a),this.blur=tt(t,i),this.textTex=rt(t,1,1)}resize(e,a,i){const t=this.gl;this.view={w:e,h:a},this.dpr=i,this.canvas.width=Math.round(e*i),this.canvas.height=Math.round(a*i);const s=Math.max(64,Math.round(e*this.simScale)),h=Math.max(64,Math.round(a*this.simScale)),c=this.fogA,l=O(t,s,h),u=O(t,s,h);c?(t.useProgram(this.progBlit),t.bindFramebuffer(t.FRAMEBUFFER,l.fbo),t.viewport(0,0,s,h),k(t,0,c.tex,this.uBlit.uTex),t.bindVertexArray(this.vaoQuad),t.drawArrays(t.TRIANGLES,0,3)):this.fogInit=!0,z(t,this.fogA),z(t,this.fogB),this.fogA=l,this.fogB=u,z(t,this.beads),z(t,this.water),this.beads=O(t,s,h),this.water=O(t,s,h)}setDpr(e){this.dpr=e,this.canvas.width=Math.round(this.view.w*e),this.canvas.height=Math.round(this.view.h*e)}setText(e){const a=this.gl;a.bindTexture(a.TEXTURE_2D,this.textTex),a.texImage2D(a.TEXTURE_2D,0,a.RGBA8,a.RGBA,a.UNSIGNED_BYTE,e)}stamps(e,a,i){const t=this.gl;let s=0;for(;s<e.length;){const h=Math.min(e.length-s,this.inst.length/4);for(let c=0;c<h;c++){const l=e[s+c];this.inst[c*4]=l.x,this.inst[c*4+1]=l.y,this.inst[c*4+2]=l.rx,this.inst[c*4+3]=l.ry}t.bindBuffer(t.ARRAY_BUFFER,this.instBuf),t.bufferSubData(t.ARRAY_BUFFER,0,this.inst,0,h*4),t.uniform1i(this.uDrop.uMode,a),t.uniform1f(this.uDrop.uStrength,i),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,h),s+=h}}render(e,a,i=!0){const t=this.gl,{w:s,h}=this.view,c=this.beads,l=this.water;t.bindFramebuffer(t.FRAMEBUFFER,c.fbo),t.viewport(0,0,c.w,c.h),t.enable(t.BLEND),t.blendFunc(t.ZERO,t.ONE_MINUS_SRC_ALPHA),t.useProgram(this.progFade),t.uniform1f(this.uFade.uK,Math.min(1,a.dt*.05)),t.bindVertexArray(this.vaoQuad),t.drawArrays(t.TRIANGLES,0,3),t.useProgram(this.progDrop),t.uniform2f(this.uDrop.uView,s,h),t.bindVertexArray(this.vaoDrop),e.erase.length&&this.stamps(e.erase,1,1),t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),e.beads.length&&this.stamps(e.beads,0,.45),t.bindFramebuffer(t.FRAMEBUFFER,l.fbo),t.viewport(0,0,l.w,l.h),t.disable(t.BLEND),t.useProgram(this.progBlit),k(t,0,c.tex,this.uBlit.uTex),t.bindVertexArray(this.vaoQuad),t.drawArrays(t.TRIANGLES,0,3),t.enable(t.BLEND),t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.useProgram(this.progDrop),t.uniform2f(this.uDrop.uView,s,h),t.bindVertexArray(this.vaoDrop);const u=e.fill(this.inst);u&&(t.bindBuffer(t.ARRAY_BUFFER,this.instBuf),t.bufferSubData(t.ARRAY_BUFFER,0,this.inst,0,u*4),t.uniform1i(this.uDrop.uMode,0),t.uniform1f(this.uDrop.uStrength,1),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,u)),t.disable(t.BLEND);const n=Math.min(12,a.segs.length);for(let b=0;b<n;b++){const g=a.segs[a.segs.length-n+b];this.segArr.set([g.x0,g.y0,g.x1,g.y1],b*4),this.segR[b]=g.r}const m=this.fogA,v=this.fogB;t.bindFramebuffer(t.FRAMEBUFFER,v.fbo),t.viewport(0,0,v.w,v.h),t.useProgram(this.progFog);const d=this.uFog;if(k(t,0,m.tex,d.uPrev),k(t,1,l.tex,d.uWater),k(t,2,this.textTex,d.uText),t.uniform2f(d.uView,s,h),t.uniform1f(d.uDt,a.dt),t.uniform1f(d.uRegrow,a.regrow),t.uniform1f(d.uTime,a.time),t.uniform4fv(d.uSeg,this.segArr),t.uniform1fv(d.uSegR,this.segR),t.uniform1i(d.uSegN,n),a.breath?t.uniform4f(d.uBreath,a.breath.x,a.breath.y,a.breath.s,a.breath.r):t.uniform4f(d.uBreath,0,0,0,1),t.uniform1f(d.uTextFront,a.textFront),t.uniform1f(d.uTextOn,a.textOn),t.uniform1f(d.uInit,this.fogInit?1:0),this.fogInit=!1,t.bindVertexArray(this.vaoQuad),t.drawArrays(t.TRIANGLES,0,3),this.fogA=v,this.fogB=m,!i)return;t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,this.canvas.width,this.canvas.height),t.useProgram(this.progComp);const p=this.uComp;k(t,0,this.plate,p.uPlate),k(t,1,this.blur,p.uBlur),k(t,2,this.fogA.tex,p.uFog),k(t,3,l.tex,p.uWater),t.uniform2f(p.uRes,this.canvas.width,this.canvas.height),t.uniform2f(p.uView,s,h);const y=this.cover(s,h);t.uniform4f(p.uCover,y[0],y[1],y[2],y[3]),t.uniform1f(p.uTime,a.time),t.uniform1f(p.uFlash,a.flash),t.uniform1f(p.uDark,a.dark),t.uniform1f(p.uRain,a.rain),t.uniform4fv(p.uLamps,a.lamps),t.uniform1i(p.uLampN,a.lampN),t.uniform4fv(p.uBolt,a.bolt),t.uniform1i(p.uBoltN,a.boltN),t.uniform1f(p.uGrille,0),t.uniform1f(p.uReveal,a.reveal),t.drawArrays(t.TRIANGLES,0,3)}cover(e,a){const i=e/a,t=mt/pt;if(i>t){const c=t/i;return[1,c,0,(1-c)*.55]}const s=i/t,h=Math.min(1-s,Math.max(0,vt-s/2));return[s,1,h,0]}toPlate(e,a){const i=this.cover(this.view.w,this.view.h);return[e/this.view.w*i[0]+i[2],a/this.view.h*i[1]+i[3]]}debugRead(){const e=this.gl,a={};for(const[i,t]of[["fog",this.fogA],["water",this.water],["beads",this.beads]]){const s=new Uint8Array(4);e.bindFramebuffer(e.FRAMEBUFFER,t.fbo),e.readPixels(t.w>>1,t.h>>1,1,1,e.RGBA,e.UNSIGNED_BYTE,s),a[i]=Array.from(s)}return e.bindFramebuffer(e.FRAMEBUFFER,null),{...a,dpr:this.dpr,cw:this.canvas.width,view:this.view}}lose(){this.gl.getExtension("WEBGL_lose_context")?.loseContext()}}const gt=520;class bt{constructor(){o(this,"drops",[]);o(this,"beads",[]);o(this,"erase",[]);o(this,"w",1);o(this,"h",1);o(this,"scale",1);o(this,"spawnAcc",0);o(this,"beadAcc",0);o(this,"grid",new Map)}resize(e,a){this.w=e,this.h=a,this.scale=Math.min(1.25,Math.max(.75,Math.sqrt(e*a)/1e3)),this.drops=this.drops.filter(i=>i.x<e&&i.y<a)}step(e,a,i,t){this.beads.length=0,this.erase.length=0;const s=this.scale,h=this.w*this.h/1e6;for(this.spawnAcc+=e*a*a*30*h+e*a*6*h;this.spawnAcc>=1&&this.drops.length<gt;){this.spawnAcc-=1;const m=(Math.random()<.12+i*.14?3+Math.random()*(3.5+i*4):1.6+Math.random()*2.2)*s;this.drops.push({x:Math.random()*this.w,y:Math.random()*this.h*1.02-this.h*.02,r:m,vy:0,vx:0,stall:Math.random()*.6,trail:0,seed:Math.random(),dead:!1})}for(this.spawnAcc>4&&(this.spawnAcc=0),this.beadAcc+=e*(.15+a)*260*h;this.beadAcc>=1;){this.beadAcc-=1;const n=(.6+Math.random()*1.4)*s;this.beads.push({x:Math.random()*this.w,y:Math.random()*this.h,rx:n,ry:n})}const c=4.2*s;for(const n of this.drops)if(!n.dead){if(n.r>c){if(n.stall>0)n.stall-=e,n.vy*=.5;else{const d=900*(n.r-c)/c+60;n.vy=Math.min(n.vy+d*e,140+n.r*40),Math.random()<e*(2.2-Math.min(2,n.r/c))&&(n.stall=.08+Math.random()*.5)}n.vx+=(Math.sin(n.y*.05+n.seed*20)*30+t*40-n.vx)*Math.min(1,e*3);const m=n.vy*e;n.y+=m,n.x+=n.vx*e*(n.vy/200),n.trail+=m;const v=n.r*(1.2+Math.random()*1.2);if(n.trail>v&&n.vy>20){n.trail=0;const d=n.r*(.14+Math.random()*.2);Math.random()<.6&&this.beads.push({x:n.x+(Math.random()-.5)*n.r*.4,y:n.y-n.r*1.4,rx:d,ry:d*1.1}),n.r*=.993}n.vy>10&&this.erase.push({x:n.x,y:n.y-m*.5,rx:n.r*.9,ry:n.r*.9+m*.5})}else n.r-=e*.015,n.r<.8&&(n.dead=!0);n.y-n.r>this.h&&(n.dead=!0)}const l=24*s,u=this.grid;u.clear();for(const n of this.drops){if(n.dead)continue;const m=(n.x/l|0)*7919+(n.y/l|0),v=u.get(m);v?v.push(n):u.set(m,[n])}for(const n of this.drops){if(n.dead)continue;const m=n.x/l|0,v=n.y/l|0;for(let d=-1;d<=1;d++)for(let p=-1;p<=1;p++){const y=u.get((m+d)*7919+v+p);if(y)for(const b of y){if(b===n||b.dead||n.dead)continue;const g=b.x-n.x,x=b.y-n.y,A=(n.r+b.r)*.8;if(g*g+x*x<A*A){const[T,M]=n.r>=b.r?[n,b]:[b,n],q=T.r*T.r+M.r*M.r;T.r=Math.min(Math.sqrt(q),14*s),T.x=(T.x*T.r+M.x*M.r*.4)/(T.r+M.r*.4),T.vy=Math.max(T.vy,M.vy),T.stall=Math.min(T.stall,.05),M.dead=!0}}}}this.drops.length>64&&this.drops.some(n=>n.dead)&&(this.drops=this.drops.filter(n=>!n.dead))}wipe(e,a,i,t,s){const h=Math.hypot(i-e,t-a),c=Math.max(1,Math.ceil(h/(s*.6)));for(let u=0;u<=c;u++){const n=u/c;this.erase.push({x:e+(i-e)*n,y:a+(t-a)*n,rx:s*.85,ry:s*.85})}const l=s*s;for(const u of this.drops){if(u.dead)continue;const n=i-e,m=t-a,v=Math.max(0,Math.min(1,((u.x-e)*n+(u.y-a)*m)/Math.max(n*n+m*m,1e-4))),d=e+n*v-u.x,p=a+m*v-u.y;d*d+p*p<l&&(u.dead=!0)}}fill(e){let a=0;for(const i of this.drops){if(i.dead)continue;if(a*4+4>e.length)break;const t=1+Math.min(.5,i.vy/400);e[a*4]=i.x,e[a*4+1]=i.y,e[a*4+2]=i.r/Math.sqrt(t),e[a*4+3]=i.r*t,a++}return a}}const U=[{name:"arrive",dur:26,rain:.3,size:.2,regrow:.12,dark:.15,lamps:0,storm:0},{name:"build",dur:30,rain:.62,size:.5,regrow:.13,dark:.35,lamps:0,storm:.2},{name:"downpour",dur:42,rain:1,size:1,regrow:.17,dark:.75,lamps:0,storm:1},{name:"ease",dur:24,rain:.4,size:.5,regrow:.08,dark:.45,lamps:.2,storm:.15},{name:"clear",dur:48,rain:.04,size:.1,regrow:.025,dark:.1,lamps:1,storm:0},{name:"night",dur:18,rain:.12,size:.2,regrow:.07,dark:.3,lamps:.7,storm:0}],B=(r,e,a)=>r+(e-r)*a;class wt{constructor(){o(this,"t",0);o(this,"index",0);o(this,"phaseT",0);o(this,"rain",.3);o(this,"size",.2);o(this,"regrow",.1);o(this,"dark",.15);o(this,"lampLevel",0);o(this,"storm",0);o(this,"flash",0);o(this,"boltN",0);o(this,"bolt",new Float32Array(40));o(this,"lamps",[]);o(this,"lampData",new Float32Array(56));o(this,"flashesAllowed",!0);o(this,"onPhase",()=>{});o(this,"onLightning",()=>{});o(this,"onBell",()=>{});o(this,"nextStrike",8);o(this,"flashEnv",null);o(this,"bellDone",!1);o(this,"lampN",0)}get phase(){return U[this.index].name}start(){this.onPhase(this.phase)}skip(){this.phaseT=U[this.index].dur}step(e){this.t+=e,this.phaseT+=e;const a=U[this.index];this.phaseT>=a.dur&&(this.phaseT=0,this.index=(this.index+1)%U.length,this.phase==="clear"&&(this.bellDone=!1),this.onPhase(this.phase));const i=U[this.index],t=1-Math.exp(-e/6);this.rain=B(this.rain,i.rain,t),this.size=B(this.size,i.size,t),this.regrow=B(this.regrow,i.regrow,t),this.dark=B(this.dark,i.dark,t),this.lampLevel=B(this.lampLevel,i.lamps,1-Math.exp(-e/10)),this.storm=B(this.storm,i.storm,t),this.lightning(e),this.updateLamps(e),this.phase==="clear"&&!this.bellDone&&this.phaseT>6&&(this.bellDone=!0,this.onBell())}lightning(e){if(this.storm>.3&&(this.nextStrike-=e,this.nextStrike<=0&&(this.nextStrike=7+Math.random()*9,this.strike())),this.flashEnv){const a=this.flashEnv;a.t+=e;let i=0;for(const t of a.peaks){const s=a.t-t;s>=0&&(i=Math.max(i,Math.exp(-s*9)*(s<.04?s/.04:1)))}this.flash=this.flashesAllowed?i*.85:i*.18,a.t>1.2&&(this.flashEnv=null,this.flash=0,this.boltN=0)}}strike(){const e=[0,.16+Math.random()*.06];if(Math.random()<.5&&e.push(.42+Math.random()*.1),this.flashEnv={t:0,peaks:e},this.boltN=0,Math.random()<.7){let a=.12+Math.random()*.6,i=.04;const t=.38+Math.random()*.04,s=10;for(let h=0;h<s;h++){const c=a+(Math.random()-.5)*.045,l=i+(t-.04)/s*(.7+Math.random()*.6);if(this.bolt.set([a,i,c,Math.min(l,t)],h*4),a=c,i=l,this.boltN++,l>=t)break}}this.onLightning(.4+Math.random()*2.2)}updateLamps(e){const a=Math.round(this.lampLevel*13);this.lamps.length<a&&Math.random()<e*.6&&this.lamps.push({x:.45+Math.random()*.13,y:.6+Math.random()*.08,vx:-(.004+Math.random()*.004),phase:Math.random()*6.28,life:0,size:.0016+Math.random()*.0012});for(const t of this.lamps)t.life+=e,t.x+=t.vx*e,t.y+=Math.sin(this.t*.4+t.phase)*25e-5*e+.0012*e;this.lamps=this.lamps.filter(t=>t.x>-.05&&t.y<.98&&(this.lampLevel>.05||t.life<120));let i=0;for(const t of this.lamps.slice(0,14)){const s=Math.min(1,t.life/4),h=.82+.18*Math.sin(this.t*13+t.phase*3)*Math.sin(this.t*7.3+t.phase);this.lampData.set([t.x,t.y,s*h*Math.min(1,this.lampLevel*1.5+.2),t.size],i*4),i++}this.lampN=i}}class yt{constructor(e,a){o(this,"segs",[]);o(this,"speed",0);o(this,"breath",null);o(this,"breathing",!1);o(this,"touched",!1);o(this,"wipedDistance",0);o(this,"onFirstTouch",()=>{});o(this,"fingers",new Map);o(this,"rawSpeed",0);o(this,"breathR",0);o(this,"key",{x:0,y:0,active:!1,dx:0,dy:0,space:!1});o(this,"radius",20);o(this,"down",e=>{e.preventDefault();try{this.el.setPointerCapture(e.pointerId)}catch{}const a=performance.now();this.fingers.set(e.pointerId,{x:e.clientX,y:e.clientY,lastMove:a,downAt:a,still:!0,startX:e.clientX,startY:e.clientY}),this.radius=e.pointerType==="touch"?Math.max(18,Math.min(30,(e.width||30)*.6)):17,this.touched||(this.touched=!0,this.onFirstTouch()),this.addSeg(e.clientX,e.clientY,e.clientX,e.clientY,this.radius*.8)});o(this,"move",e=>{const a=this.fingers.get(e.pointerId);if(!a)return;e.preventDefault();const i=typeof e.getCoalescedEvents=="function"?e.getCoalescedEvents():[],t=i.length?i:[e];for(const s of t){const h=s.clientX-a.x,c=s.clientY-a.y,l=Math.hypot(h,c);if(l<.5)continue;const u=s.timeStamp||performance.now(),n=l/Math.max(1,u-a.lastMove)*1e3,m=this.radius*(1.08-Math.min(.3,n/6e3));this.addSeg(a.x,a.y,s.clientX,s.clientY,m),this.rawSpeed=Math.max(this.rawSpeed,n),this.wipedDistance+=l,a.x=s.clientX,a.y=s.clientY,a.lastMove=u}Math.hypot(a.x-a.startX,a.y-a.startY)>10&&(a.still=!1)});o(this,"up",e=>{this.fingers.delete(e.pointerId)});o(this,"keydown",e=>{const a=e.target;if(a&&(a.tagName==="BUTTON"||a.tagName==="A"||a.closest("dialog")))return;const i=this.key,t={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};t[e.key]?(e.preventDefault(),i.active||(i.active=!0,i.x=innerWidth/2,i.y=innerHeight/2),i.dx=t[e.key][0]||i.dx*(t[e.key][1]?1:0),i.dy=t[e.key][1]||i.dy*(t[e.key][0]?1:0),this.touched||(this.touched=!0,this.onFirstTouch())):e.key===" "&&(e.preventDefault(),i.active||(i.active=!0,i.x=innerWidth/2,i.y=innerHeight/2),i.space=!0)});o(this,"keyup",e=>{const a=this.key;(e.key==="ArrowLeft"||e.key==="ArrowRight")&&(a.dx=0),(e.key==="ArrowUp"||e.key==="ArrowDown")&&(a.dy=0),e.key===" "&&(a.space=!1)});this.el=e,this.wipe=a,e.addEventListener("pointerdown",this.down,{passive:!1}),e.addEventListener("pointermove",this.move,{passive:!1}),e.addEventListener("pointerup",this.up),e.addEventListener("pointercancel",this.up),e.addEventListener("pointerleave",this.up),e.addEventListener("contextmenu",i=>i.preventDefault()),addEventListener("keydown",this.keydown),addEventListener("keyup",this.keyup)}addSeg(e,a,i,t,s){const h={x0:e,y0:a,x1:i,y1:t,r:s};this.segs.push(h),this.wipe(h)}update(e){const a=performance.now(),i=this.key;if(i.active&&(i.dx||i.dy)){const c=Math.max(0,Math.min(innerWidth,i.x+i.dx*420*e)),l=Math.max(0,Math.min(innerHeight,i.y+i.dy*420*e));this.addSeg(i.x,i.y,c,l,20),this.rawSpeed=Math.max(this.rawSpeed,420),this.wipedDistance+=Math.hypot(c-i.x,l-i.y),i.x=c,i.y=l}let t=0,s=0,h=!1;for(const c of this.fingers.values())c.still&&a-c.downAt>350&&(h=!0,t=c.x,s=c.y);i.space&&(h=!0,t=i.x,s=i.y),this.breathing=h,h?(this.breathR=Math.min(130,this.breathR+e*160),this.breath={x:t,y:s,s:1,r:30+this.breathR}):(this.breathR=Math.max(0,this.breathR-e*400),this.breath=null),this.speed+=(this.rawSpeed-this.speed)*Math.min(1,e*14),this.rawSpeed*=Math.max(0,1-e*20)}flush(){this.segs.length=0}get fingerDown(){return this.fingers.size>0||this.key.active&&(this.key.dx!==0||this.key.dy!==0)}}const Tt='"Tiro Devanagari Hindi", "Noto Serif Devanagari", serif',et='"Cormorant Garamond", Georgia, serif';class At{constructor(){o(this,"canvas",document.createElement("canvas"));o(this,"ctx",this.canvas.getContext("2d"));o(this,"front",0);o(this,"on",0);o(this,"writing",!1);o(this,"x0",0);o(this,"x1",1);o(this,"t",0);o(this,"dur",1);o(this,"hold",1.4);o(this,"active",!1);o(this,"onUpload",()=>{});o(this,"onStart",()=>{})}write(e,a,i,t=1){const s=Math.min(2,devicePixelRatio||1)*.75,h=Math.round(a.w*s),c=Math.round(a.h*s);(this.canvas.width!==h||this.canvas.height!==c)&&(this.canvas.width=h,this.canvas.height=c);const l=this.ctx;l.clearRect(0,0,h,c),l.textBaseline="alphabetic",l.textAlign=i.align,l.fillStyle="#fff",l.strokeStyle="#fff",l.lineJoin="round",l.lineCap="round";const u=Math.min(a.w,a.h*1.3)*s*t;let n=i.y*c;const m=i.x*h;let v=1/0,d=-1/0;const p=g=>{const x=l.measureText(g).width,A=i.align==="left"?m:i.align==="center"?m-x/2:m-x;v=Math.min(v,A),d=Math.max(d,A+x)},y=h*(i.align==="center"?.86:.7),b=(g,x,A)=>{l.font=g(x);const T=l.measureText(A).width;return T>y&&(x*=y/T,l.font=g(x)),x};if(e.hi){const g=b(x=>`${x}px ${Tt}`,u*.1,e.hi);l.lineWidth=g*.055,l.strokeText(e.hi,m,n),l.fillText(e.hi,m,n),p(e.hi),n+=g*.78}if(e.en){const g=b(x=>`italic 500 ${x}px ${et}`,u*(e.hi?.044:.06),e.en);l.lineWidth=g*.07,l.strokeText(e.en,m,n),l.fillText(e.en,m,n),p(e.en)}if(e.hint){const g=b(x=>`italic 500 ${x}px ${et}`,u*.04,e.hint);l.lineWidth=g*.08,l.fillText(e.hint,m,n),l.strokeText(e.hint,m,n),p(e.hint)}this.x0=v/h-.01,this.x1=d/h+.01,this.dur=Math.max(1.2,(this.x1-this.x0)*4.2),this.t=0,this.active=!0,this.onUpload(this.canvas),this.onStart()}step(e){if(!this.active){this.on=0,this.writing=!1;return}this.t+=e;const a=Math.min(1,this.t/this.dur),i=1-Math.pow(1-a,1.6);this.front=this.x0+(this.x1-this.x0)*i,this.writing=a<1,this.on=this.t<this.dur+this.hold?1:0,this.on||(this.active=!1)}get busy(){return this.active}}class Mt{constructor(){o(this,"ctx",null);o(this,"enabled",!1);o(this,"master");o(this,"verb");o(this,"verbIn");o(this,"noise");o(this,"hiss");o(this,"body");o(this,"roof");o(this,"squeakGain");o(this,"squeakOsc");o(this,"squeakBP");o(this,"squeakLfo");o(this,"breathGain");o(this,"cricketGain");o(this,"tickAcc",0);o(this,"cricketT",0)}start(){if(this.ctx){this.ctx.resume(),this.enabled=!0,this.fadeMaster(.9);return}const e=window.AudioContext||window.webkitAudioContext;if(!e)return;const a=new e;this.ctx=a,this.enabled=!0;const i=a.createDynamicsCompressor();i.threshold.value=-16,i.ratio.value=3,i.connect(a.destination),this.master=a.createGain(),this.master.gain.value=0,this.master.connect(i),this.fadeMaster(.9,2.5),this.verb=a.createConvolver(),this.verb.buffer=this.impulse(2.8,2.6),this.verbIn=a.createGain(),this.verbIn.gain.value=.35,this.verbIn.connect(this.verb),this.verb.connect(this.master);const t=a.sampleRate*4;this.noise=a.createBuffer(2,t,a.sampleRate);for(let u=0;u<2;u++){const n=this.noise.getChannelData(u);let m=0;for(let v=0;v<t;v++){const d=Math.random()*2-1;m=(m+.02*d)/1.02,n[v]=d*.6+m*3.5}}this.hiss=this.layer("highpass",4200,.4),this.body=this.layer("lowpass",900,.7),this.roof=this.layer("bandpass",1800,1.2),this.squeakOsc=a.createOscillator(),this.squeakOsc.type="sawtooth",this.squeakBP=a.createBiquadFilter(),this.squeakBP.type="bandpass",this.squeakBP.Q.value=14,this.squeakBP.frequency.value=1200;const s=a.createGain();s.gain.value=.5,this.squeakLfo=a.createOscillator(),this.squeakLfo.type="square",this.squeakLfo.frequency.value=38;const h=a.createGain();h.gain.value=.5,this.squeakLfo.connect(h).connect(s.gain),this.squeakGain=a.createGain(),this.squeakGain.gain.value=0,this.squeakOsc.connect(this.squeakBP).connect(s).connect(this.squeakGain),this.squeakGain.connect(this.master),this.squeakGain.connect(this.verbIn),this.squeakOsc.start(),this.squeakLfo.start();const c=this.loop(),l=a.createBiquadFilter();l.type="bandpass",l.frequency.value=520,l.Q.value=.8,this.breathGain=a.createGain(),this.breathGain.gain.value=0,c.connect(l).connect(this.breathGain).connect(this.master),this.cricketGain=a.createGain(),this.cricketGain.gain.value=0,this.cricketGain.connect(this.master),this.cricketGain.connect(this.verbIn)}stop(){this.enabled=!1,this.ctx&&this.fadeMaster(0,.6)}fadeMaster(e,a=.8){if(!this.ctx)return;const i=this.master.gain,t=this.ctx.currentTime;i.cancelScheduledValues(t),i.setValueAtTime(i.value,t),i.linearRampToValueAtTime(e,t+a)}impulse(e,a){const i=this.ctx,t=Math.floor(i.sampleRate*e),s=i.createBuffer(2,t,i.sampleRate);for(let h=0;h<2;h++){const c=s.getChannelData(h);for(let l=0;l<t;l++)c[l]=(Math.random()*2-1)*Math.pow(1-l/t,a)}return s}loop(){const e=this.ctx.createBufferSource();return e.buffer=this.noise,e.loop=!0,e.loopStart=Math.random()*2,e.start(0,Math.random()*3),e}layer(e,a,i){const t=this.ctx,s=t.createBiquadFilter();s.type=e,s.frequency.value=a,s.Q.value=i;const h=t.createGain();return h.gain.value=0,this.loop().connect(s).connect(h).connect(this.master),h}set(e,a,i=.25){e.setTargetAtTime(a,this.ctx.currentTime,i)}update(e,a,i,t,s,h,c){if(!this.ctx||!this.enabled)return;this.ctx,this.set(this.hiss.gain,.03+a*.16,1.5),this.set(this.body.gain,.05+a*a*.42,1.5),this.set(this.roof.gain,a*.06,1.5);let l=0,u=900;if(t||h){const n=h?520:i;l=Math.min(1,Math.max(0,(n-120)/900))*(h?.05:.11),u=700+Math.min(1400,n*.6)}for(this.set(this.squeakGain.gain,l,.03),this.set(this.squeakOsc.frequency,u*.5,.05),this.set(this.squeakBP.frequency,u,.05),this.set(this.squeakLfo.frequency,22+Math.min(50,i/40),.05),this.set(this.breathGain.gain,s?.22:0,s?.25:.35),this.tickAcc+=e*(a*a*26+a*4);this.tickAcc>1;)this.tickAcc-=1,this.tick();this.set(this.cricketGain.gain,c*.05,2),c>.05&&(this.cricketT-=e,this.cricketT<=0&&(this.cricketT=.6+Math.random()*1.6,this.cricket()))}tick(){const e=this.ctx,a=e.currentTime+Math.random()*.05,i=e.createBufferSource();i.buffer=this.noise;const t=e.createBiquadFilter();t.type="bandpass",t.frequency.value=2500+Math.random()*4500,t.Q.value=6;const s=e.createGain(),h=e.createStereoPanner();h.pan.value=Math.random()*2-1;const c=.05+Math.random()*.12;s.gain.setValueAtTime(0,a),s.gain.linearRampToValueAtTime(c,a+.002),s.gain.exponentialRampToValueAtTime(1e-4,a+.04+Math.random()*.05),i.connect(t).connect(s).connect(h).connect(this.master),i.start(a,Math.random()*3,.12)}cricket(){const e=this.ctx,a=e.currentTime,i=e.createStereoPanner();i.pan.value=Math.random()*1.6-.8,i.connect(this.cricketGain);const t=3+Math.floor(Math.random()*3),s=4300+Math.random()*500;for(let h=0;h<t;h++){const c=a+h*.07,l=e.createOscillator();l.frequency.value=s;const u=e.createGain();u.gain.setValueAtTime(0,c),u.gain.linearRampToValueAtTime(.5,c+.01),u.gain.linearRampToValueAtTime(0,c+.045),l.connect(u).connect(i),l.start(c),l.stop(c+.06)}}thunder(e){if(!this.ctx||!this.enabled)return;const a=this.ctx,i=a.currentTime+e*1.2+.15,t=4+e*1.5,s=a.createBufferSource();s.buffer=this.noise,s.loop=!0;const h=a.createBiquadFilter();h.type="lowpass",h.Q.value=.9,h.frequency.setValueAtTime(e<1?2400:900,i),h.frequency.exponentialRampToValueAtTime(90,i+t);const c=a.createGain(),l=Math.min(1,1.1/(.5+e))*.9;c.gain.setValueAtTime(0,i),c.gain.linearRampToValueAtTime(l,i+(e<1?.05:.5));for(let u=1;u<4;u++)c.gain.linearRampToValueAtTime(l*(.4+Math.random()*.5)/u,i+t*u/4.5);c.gain.exponentialRampToValueAtTime(1e-4,i+t),s.connect(h).connect(c),c.connect(this.master),c.connect(this.verbIn),s.start(i,Math.random()*3),s.stop(i+t+.1)}bell(){if(!this.ctx||!this.enabled)return;const e=this.ctx,a=(t,s,h)=>{const c=e.createBiquadFilter();c.type="lowpass",c.frequency.value=2600;const l=e.createGain();l.gain.value=h,c.connect(l),l.connect(this.master),l.connect(this.verbIn);const u=[[.5,.35,7],[1,.5,5],[1.183,.25,4],[1.506,.22,3.5],[2,.18,3],[2.514,.12,2.4],[2.662,.1,2],[3.011,.07,1.6]];for(const[n,m,v]of u){const d=e.createOscillator();d.frequency.value=s*n;const p=e.createGain();p.gain.setValueAtTime(0,t),p.gain.linearRampToValueAtTime(m,t+.004),p.gain.exponentialRampToValueAtTime(1e-4,t+v),d.connect(p).connect(c),d.start(t),d.stop(t+v+.1)}},i=e.currentTime+.1;a(i,392,.16),a(i+2.6,392,.12),a(i+5.4,392,.09)}touch(){if(!this.ctx||!this.enabled)return;const e=this.ctx,a=e.currentTime,i=e.createOscillator();i.type="sine",i.frequency.setValueAtTime(1500,a),i.frequency.exponentialRampToValueAtTime(600,a+.08);const t=e.createGain();t.gain.setValueAtTime(.08,a),t.gain.exponentialRampToValueAtTime(1e-4,a+.12),i.connect(t).connect(this.master),i.start(a),i.stop(a+.15)}}const E=r=>document.querySelector(r),J=document.documentElement,W=E("#glass"),H=E("#gate"),Rt=E("#live"),Et=E("#controls"),$=E("#btn-sound"),K=E("#btn-flash"),kt=E("#btn-info"),N=E("#about"),at=matchMedia("(prefers-reduced-motion: reduce)").matches,G=matchMedia("(pointer: coarse)").matches,Ft={build:{hi:"गंगा आज ऊँची बह रही है",en:"The Ganga runs high tonight."},downpour:{hi:"बिजली ने घाट को एक पल देखा",en:"Lightning looked at the ghat, once."},ease:{hi:"जो लिखा, बारिश ने पढ़ लिया",en:"Whatever I wrote, the rain read."},clear:{hi:"अब दीये बहने दो",en:"Now let the lamps float."},night:{hi:"फिर बरसेगा",en:"It will rain again."}},Dt={hi:"बरसात",en:"a window in Bhagalpur"},it=[{x:.07,y:.2,align:"left"},{x:.93,y:.34,align:"right"},{x:.07,y:.3,align:"left"},{x:.93,y:.2,align:"right"}];function st(r){return new Promise((e,a)=>{const i=new Image;i.decoding="async",i.onload=()=>e(i),i.onerror=a,i.src=r})}function j(r){J.classList.add("nogl"),J.dataset.reason=r,H.classList.add("is-fallback")}async function St(){const r=Promise.race([Promise.all([document.fonts.load('48px "Tiro Devanagari Hindi"',"बरसात"),document.fonts.load('italic 500 32px "Cormorant Garamond"'),document.fonts.load('500 32px "Cormorant Garamond"')]),new Promise(f=>setTimeout(f,2500))]);let e,a;try{[e,a]=await Promise.all([st("./plate.jpg"),st("./plate-blur.jpg")])}catch{j("image");return}let i;try{i=new xt(W,e,a)}catch(f){j(String(f.message||f));return}await r;const t=new bt,s=new wt,h=new At,c=new Mt,l=new yt(W,f=>t.wipe(f.x0,f.y0,f.x1,f.y1,f.r));h.onUpload=f=>i.setText(f),at&&(s.flashesAllowed=!1);const u=new URLSearchParams(location.search);let n=Math.min(devicePixelRatio||1,G?1.25:1.5);u.has("debug")&&u.get("dpr")&&(n=Number(u.get("dpr")));const m=()=>{const f=innerWidth,w=innerHeight;i.resize(f,w,n),t.resize(f,w)};m();let v=0,d=innerWidth,p=innerHeight;addEventListener("resize",()=>{clearTimeout(v),v=window.setTimeout(()=>{G&&innerWidth===d&&Math.abs(innerHeight-p)<innerHeight*.2||(d=innerWidth,p=innerHeight,m())},120)});const y=[];let b=0;const g=(f,w=it[b++%it.length],R=1)=>{y.push({line:f,place:w,scale:R});const S=[f.hi,f.en,f.hint].filter(Boolean).join(" — ");Rt.textContent=S};let x=!1,A=!1,T=0;s.onPhase=f=>{const w=Ft[f];w&&x&&g(w)},s.onLightning=f=>c.thunder(f),s.onBell=()=>c.bell(),l.onFirstTouch=()=>c.touch();const M=f=>{x||(x=!0,T=performance.now(),f&&c.start(),q(f),H.classList.add("is-gone"),H.setAttribute("aria-hidden","true"),Et.hidden=!1,setTimeout(()=>{H.hidden=!0,W.focus({preventScroll:!0})},1400),setTimeout(()=>g(Dt,{x:.5,y:.36,align:"center"},1.5),700),setTimeout(()=>{l.touched||g({hint:G?"wipe the glass with your finger":"wipe the glass — drag across it"},{x:.5,y:.8,align:"center"})},6500),s.start())};E("#enter-sound").addEventListener("click",()=>M(!0)),E("#enter-quiet").addEventListener("click",()=>M(!1));const q=f=>{$.setAttribute("aria-pressed",String(f)),$.querySelector(".label").textContent=f?"Sound on":"Sound off"};$.addEventListener("click",()=>{c.enabled?c.stop():c.start(),q(c.enabled)});const Z=()=>{K.setAttribute("aria-pressed",String(s.flashesAllowed)),K.querySelector(".label").textContent=s.flashesAllowed?"Lightning flashes on":"Lightning flashes softened"};if(Z(),K.addEventListener("click",()=>{s.flashesAllowed=!s.flashesAllowed,Z()}),kt.addEventListener("click",()=>N.showModal()),N.addEventListener("click",f=>{f.target===N&&N.close()}),new URLSearchParams(location.search).has("debug")){const f=window;f.__strike=()=>s.strike(),f.__probe=()=>({...i.debugRead(),flash:s.flash,reveal:D,drops:t.drops.length}),f.__ff=w=>{const R=.03333333333333333;for(let S=0;S<w*30;S++){if(s.step(R),t.step(R,s.rain,s.size,.1),h.step(R),!h.busy&&y.length){const F=y.shift();h.write(F.line,i.view,F.place,F.scale)}i.render(t,{dt:R,time:performance.now()/1e3,segs:[],breath:null,regrow:s.regrow,flash:0,dark:s.dark,rain:s.rain,lamps:s.lampData,lampN:s.lampN,bolt:s.bolt,boltN:0,textFront:h.front,textOn:h.on,reveal:1},!1)}return s.phase}}addEventListener("keydown",f=>{f.key==="n"&&x&&!N.open&&s.skip()});let Y=performance.now(),D=0,L=0,V=0,C=!0;const Q=f=>{if(!C)return;requestAnimationFrame(Q);const w=Math.max(0,Math.min(.05,(f-Y)/1e3));Y=f,w>.024?(L++,V=0):w<.0175&&(V++,L=Math.max(0,L-1)),L>45&&n>.7&&!u.has("debug")&&(n=Math.max(.7,n*.85),i.setDpr(n),L=0),V>600&&n<Math.min(devicePixelRatio||1,G?1.25:1.5)&&(n=Math.min(n/.85,G?1.25:1.5),i.setDpr(n),V=0),x&&s.step(w);const R=x?s.rain:.22;if(t.step(w*(at?.6:1),R,x?s.size:.15,.1),l.update(w),!h.busy&&y.length){const F=y.shift();h.write(F.line,i.view,F.place,F.scale)}h.step(w),x&&!A&&l.wipedDistance>1400&&f-T>16e3&&!h.busy&&y.length===0&&(A=!0,g({hint:"hold still to breathe on it"},{x:.5,y:.9,align:"center"})),D=Math.min(1,D+w*.7),i.render(t,{dt:w,time:f/1e3,segs:l.segs,breath:l.breath,regrow:x?s.regrow:.1,flash:s.flash,dark:x?s.dark:.15,rain:R,lamps:s.lampData,lampN:s.lampN,bolt:s.bolt,boltN:s.flash>0?s.boltN:0,textFront:h.front,textOn:h.on,reveal:D*D*(3-2*D)}),l.flush();const S=s.phase==="clear"||s.phase==="night"?Math.min(1,s.lampLevel):0;c.update(w,R,l.speed,l.fingerDown,l.breathing,h.writing,S)};requestAnimationFrame(Q),J.classList.add("ready"),document.addEventListener("visibilitychange",()=>{document.hidden?(C=!1,c.ctx?.suspend()):(C=!0,Y=performance.now(),c.enabled&&c.ctx?.resume(),requestAnimationFrame(Q))}),W.addEventListener("webglcontextlost",f=>{f.preventDefault(),C=!1,j("context lost")})}St();
