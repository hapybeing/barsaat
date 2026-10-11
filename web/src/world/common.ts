import * as THREE from 'three';

// Uniforms every material shares: one object, so updating it once a frame updates everything.
export const MAX_LIGHTS = 16;

export const shared = {
  uTime: { value: 0 },
  uFlash: { value: 0 },             // lightning, 0..~1.5
  uFlashDir: { value: new THREE.Vector3(0, 1, -1) },
  uFogColor: { value: new THREE.Color('#1a1d2b') },
  uFogDensity: { value: 0.03 },
  uAmbient: { value: new THREE.Color('#2a3048') },
  uRain: { value: 0.6 },
  uClear: { value: 0 },
  uWet: { value: 1 },
  uLightPos: { value: Array.from({ length: MAX_LIGHTS }, () => new THREE.Vector3(0, -999, 0)) },
  uLightCol: { value: Array.from({ length: MAX_LIGHTS }, () => new THREE.Vector3(0, 0, 0)) },
};

export const commonGLSL = /* glsl */ `
uniform float uTime;
uniform float uFlash;
uniform vec3 uFlashDir;
uniform vec3 uFogColor;
uniform float uFogDensity;
uniform vec3 uAmbient;
uniform float uRain;
uniform float uClear;
uniform float uWet;
uniform vec3 uLightPos[${MAX_LIGHTS}];
uniform vec3 uLightCol[${MAX_LIGHTS}];

float hash1(float n) { return fract(sin(n) * 43758.5453123); }
float hash21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1, 0)), u.x), mix(hash21(i + vec2(0, 1)), hash21(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) { s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; }
  return s;
}
vec3 applyFog(vec3 col, float dist) {
  float f = 1.0 - exp(-pow(uFogDensity * dist, 2.0));
  return mix(col, uFogColor * (1.0 + uFlash * 0.9), clamp(f, 0.0, 1.0));
}
// warm point lights, soft inverse-square, with a diffuse term
vec3 pointLights(vec3 p, vec3 n) {
  vec3 acc = vec3(0.0);
  for (int i = 0; i < ${MAX_LIGHTS}; i++) {
    vec3 d = uLightPos[i] - p;
    float r2 = dot(d, d);
    float ndl = max(dot(n, d * inversesqrt(r2 + 1e-4)), 0.0) * 0.8 + 0.2;
    acc += uLightCol[i] * ndl / (1.0 + r2 * 0.9);
  }
  return acc;
}
`;

export function mat(opts: { vertex: string; fragment: string; uniforms?: Record<string, THREE.IUniform>; transparent?: boolean; blending?: THREE.Blending; side?: THREE.Side; depthWrite?: boolean }) {
  return new THREE.ShaderMaterial({
    uniforms: { ...shared, ...(opts.uniforms || {}) },
    vertexShader: commonGLSL + opts.vertex,
    fragmentShader: commonGLSL + opts.fragment,
    transparent: opts.transparent ?? false,
    blending: opts.blending ?? THREE.NormalBlending,
    side: opts.side ?? THREE.FrontSide,
    depthWrite: opts.depthWrite ?? true,
  });
}
