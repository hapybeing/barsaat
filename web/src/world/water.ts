import * as THREE from 'three';
import { mat, MAX_LIGHTS } from './common';
import { windowGLSL } from './banks';
import { skylineGLSL } from './skyline';

// The water is one flat plane that follows the camera. All its life is in the fragment shader:
// wind ripples, a ring for every raindrop, the boat's wake, the reflection of the walls (with
// their lit windows) and the sky, and long broken streaks under every lamp.
export function makeWater() {
  const geo = new THREE.PlaneGeometry(900, 900, 1, 1);
  geo.rotateX(-Math.PI / 2);
  const uniforms = {
    uBoat: { value: new THREE.Vector3() },
    uBoatFwd: { value: new THREE.Vector2(0, -1) },
    uBoatSpeed: { value: 4 },
    uRiver: { value: new THREE.Vector4(0, 0, 1, 0) }, // centre amp, unused, half width, unused
    uWalls: { value: new THREE.Vector2(8, 8) },        // left and right wall heights near camera
    uWindows: { value: 1 },
    uMurk: { value: new THREE.Color('#0b0d10') },
    uFar: { value: 1 },
  };
  const m = mat({
    uniforms,
    vertex: /* glsl */ `
      varying vec3 vWorld;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragment: /* glsl */ `
      uniform vec3 uBoat;
      uniform vec2 uBoatFwd;
      uniform float uBoatSpeed;
      uniform vec4 uRiver;
      uniform vec2 uWalls;
      uniform float uWindows;
      uniform vec3 uMurk;
      uniform float uFar;
      varying vec3 vWorld;
      ${windowGLSL}
      ${skylineGLSL}

      // one ring per cell; returns the slope it adds to the surface
      vec2 rings(vec2 p, float scale, float seed) {
        vec2 g = p / scale + seed;
        vec2 id = floor(g);
        vec2 f = fract(g) - 0.5;
        float h = hash21(id);
        float rate = 0.7 + h * 0.8;
        float cyc = uTime * rate + h * 13.0;
        float ph = fract(cyc);
        float alive = step(hash21(id + floor(cyc) * 1.37), uRain * 0.95);
        vec2 o = (vec2(hash21(id + 1.31), hash21(id + 2.71)) - 0.5) * 0.4;
        vec2 q = f - o;
        float d = length(q) + 1e-4;
        float r = ph * 0.45;
        float x = (d - r) * 38.0;
        float env = exp(-x * x * 0.08) * (1.0 - ph) * (1.0 - ph) * alive;
        return (q / d) * cos(x) * env;
      }

      float wakeH(vec2 p) {
        vec2 rel = p - uBoat.xz;
        vec2 right = vec2(-uBoatFwd.y, uBoatFwd.x);
        float along = -dot(rel, uBoatFwd);
        float lat = dot(rel, right);
        float a = max(along, 0.0);
        float edge = a * 0.36 + 0.04;
        float inside = smoothstep(edge + 0.12, edge - 0.05, abs(lat)) * step(-0.25, along);
        float fade = exp(-a * 0.32) * clamp(uBoatSpeed / 4.0, 0.0, 1.6);
        float div = sin((abs(lat) - a * 0.36) * 22.0 - a * 3.0) * smoothstep(0.35, 0.0, abs(abs(lat) - edge));
        float tra = sin(a * 9.0) * 0.5 * inside;
        return (div + tra) * fade * 0.016;
      }

      void main() {
        vec3 P = vWorld;
        vec3 V = normalize(cameraPosition - P);
        float dist = length(cameraPosition - P);

        // surface slope: wind chop + rain rings + wake
        vec2 sl = vec2(0.0);
        vec2 wp = P.xz * vec2(0.9, 0.55) + vec2(0.0, uTime * 0.5);
        float e = 0.08;
        float n0 = fbm(wp);
        sl += vec2(fbm(wp + vec2(e, 0.0)) - n0, fbm(wp + vec2(0.0, e)) - n0) / e * (0.05 + 0.05 * uRain);
        float near = smoothstep(60.0, 8.0, dist);
        sl += (rings(P.xz, 0.55, 0.0) + rings(P.xz, 0.38, 5.3) * 0.8) * (0.55 * near) * smoothstep(0.02, 0.2, uRain);
        float w0 = wakeH(P.xz);
        sl += vec2(wakeH(P.xz + vec2(0.04, 0.0)) - w0, wakeH(P.xz + vec2(0.0, 0.04)) - w0) / 0.04;
        vec3 N = normalize(vec3(-sl.x, 1.0, -sl.y));

        float fres = 0.025 + 0.975 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
        vec3 R = reflect(-V, N);
        R.y = abs(R.y);

        // what the reflection hits: a wall, or the sky
        vec3 hor = mix(vec3(0.20, 0.15, 0.17), vec3(0.09, 0.10, 0.17), uClear);
        vec3 zen = mix(vec3(0.035, 0.04, 0.075), vec3(0.02, 0.03, 0.07), uClear);
        vec3 refl = mix(hor, zen, smoothstep(0.0, 0.5, R.y)) * (1.0 + uFlash * 2.2);
        if (R.y < 0.35 && uFar > 0.01) {
          vec4 sk = skyline(R, uFar);
          refl = mix(refl, mix(sk.rgb, uFogColor, mix(0.55, 0.3, uClear)), sk.a);
        }
        float cx = uRiver.x;
        float hw = uRiver.z;
        float toWall = R.x > 0.0 ? (cx + hw - P.x) : (P.x - (cx - hw));
        float wallH = R.x > 0.0 ? uWalls.y : uWalls.x;
        float t = max(toWall, 0.0) / max(abs(R.x), 1e-3);
        float hitY = R.y * t;
        if (hitY < wallH && t < 140.0) {
          float hitZ = P.z + R.z * t;
          vec3 wallCol = vec3(0.03, 0.03, 0.04) * (1.0 + uFlash * 3.0);
          wallCol += windowLight(-hitZ, hitY, R.x > 0.0 ? 1.0 : -1.0) * uWindows * 0.9;
          refl = mix(refl, wallCol, smoothstep(wallH, wallH - 0.4, hitY));
        }
        // the moon, once it is out
        vec3 moonDir = normalize(vec3(-0.45, 0.22, -1.0));
        refl += vec3(1.0, 0.95, 0.85) * pow(max(dot(R, moonDir), 0.0), 900.0) * uClear * 3.0;

        vec3 col = uMurk * (0.6 + 0.4 * uAmbient * 3.0);
        col = mix(col, refl, fres);

        // lamps: broken streaks from glossy reflection on a rough surface
        for (int i = 0; i < ${MAX_LIGHTS}; i++) {
          vec3 Lv = uLightPos[i] - P;
          float ld = length(Lv);
          vec3 L = Lv / ld;
          vec3 H = normalize(L + V);
          float sp = pow(max(dot(N, H), 0.0), 220.0) * 3.2 + pow(max(dot(N, H), 0.0), 30.0) * 0.12;
          col += uLightCol[i] * sp / (1.0 + ld * 0.06);
          col += uLightCol[i] * 0.05 / (1.0 + ld * ld * 0.8); // glow pool
        }
        // foam right at the bow and in the wake
        float bd = length(P.xz - uBoat.xz);
        col += vec3(0.5, 0.52, 0.55) * smoothstep(0.35, 0.0, bd) * 0.06 * (uAmbient.b * 4.0 + uFlash);

        col = applyFog(col, dist);
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(geo, m);
  mesh.frustumCulled = false;
  return { mesh, uniforms };
}
