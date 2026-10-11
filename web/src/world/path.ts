// The river is a function of distance travelled, s (metres). Everything that lines it is
// generated from s with a seeded hash, so a journey is endless, cheap, and the same every time
// for the same seed.

export const CH = {
  lane: 0,   // a gutter between houses, walls close on both sides
  canal: 1,  // an embanked canal with trees, lamp posts and bridges
  ghat: 2,   // a wide river; steps and temples on the left bank, the storm peaks
  open: 3,   // the banks fall away, the rain stops, stars
} as const;

/** where each chapter starts, in metres */
export const STARTS = [0, 210, 480, 820];
export const END = 1010; // the finale begins here
export const CHAPTER_NAMES = ['lane', 'canal', 'ghat', 'open'] as const;

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** weights of each chapter at s; they overlap for ~40 m at every boundary */
export function weights(s: number): [number, number, number, number] {
  const B = 22;
  const a = smooth(STARTS[1] - B, STARTS[1] + B, s);
  const b = smooth(STARTS[2] - B, STARTS[2] + B, s);
  const c = smooth(STARTS[3] - B * 1.6, STARTS[3] + B * 1.6, s);
  return [1 - a, a * (1 - b), b * (1 - c), c];
}

export function chapterAt(s: number) {
  let c = 0;
  for (let i = 0; i < STARTS.length; i++) if (s >= STARTS[i]) c = i;
  return c;
}

const mixW = (w: number[], v: number[]) => w[0] * v[0] + w[1] * v[1] + w[2] * v[2] + w[3] * v[3];

/** half-width of the water */
export function halfWidth(s: number) {
  return mixW(weights(s), [1.25, 3.6, 15, 70]);
}

/** lateral position of the river's centre line */
export function centre(s: number) {
  const w = weights(s);
  const amp = mixW(w, [2.2, 5, 14, 22]);
  return amp * (0.65 * Math.sin(s * 0.0125 + 0.4) + 0.35 * Math.sin(s * 0.031 + 2.1));
}

/** derivative of the centre line, for heading */
export function slope(s: number) {
  return (centre(s + 0.5) - centre(s - 0.5));
}

/** how hard it rains, 0..1 */
export function rainAt(s: number) {
  const base = mixW(weights(s), [0.62, 0.72, 1.0, 0.0]);
  const clear = smooth(STARTS[3] - 20, STARTS[3] + 110, s);
  return Math.max(0, base * (1 - clear) + (1 - clear) * weights(s)[3] * 0.5);
}

/** 0 while the storm lasts, 1 once the sky has cleared */
export function clearAt(s: number) {
  return smooth(STARTS[3] + 30, STARTS[3] + 170, s);
}

/** fog density by chapter (exp2) */
export function fogAt(s: number) {
  return mixW(weights(s), [0.034, 0.028, 0.017, 0.009]) * (1 - clearAt(s) * 0.5);
}

/** cruising speed, m/s */
export function speedAt(s: number) {
  return mixW(weights(s), [4.2, 4.6, 5.0, 4.4]);
}

/** camera rig per chapter: height above water and distance behind the boat */
export function rigAt(s: number) {
  const w = weights(s);
  return { h: mixW(w, [0.85, 1.15, 1.55, 1.9]), back: mixW(w, [2.5, 3.0, 3.6, 4.3]) };
}

// --- seeded hashing -------------------------------------------------------------------------

export function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}
export function hash2(a: number, b: number) {
  return hash(a * 17.13 + b * 93.71);
}
