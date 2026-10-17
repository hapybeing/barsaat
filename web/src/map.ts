import data from './mapdata.json';

// The road north, drawn like an old survey sheet: land in a pale wash, the monsoon's onset lines
// dashed across it (filling in as you scroll), and the poem's route in gold with the cloud riding it.
// Coastline only, no political borders.

const NS = 'http://www.w3.org/2000/svg';
const X0 = data.box[0], Y1 = data.box[3], K = data.k;
const P = (lon: number, lat: number): [number, number] => [(lon - X0) * 25, (Y1 - lat) * 25 / K];

const ONSET: [string, [number, number][]][] = [
  ['1 June', [[73.5, 12.6], [75.6, 11.2], [77.4, 9.6], [78.6, 8.2]]],
  ['5 June', [[72.9, 15.1], [75.5, 14.6], [78.2, 13.6], [80.6, 13.4], [84.6, 17.6], [89.5, 22.6], [93.2, 24.6], [96.2, 27.4]]],
  ['10 June', [[72.6, 19.1], [75.2, 18.5], [78.2, 17.6], [82.2, 18.2], [85.9, 21.3], [88.2, 24.2], [90.4, 26.6]]],
  ['15 June', [[70.2, 21.6], [74.1, 21.6], [78.1, 22.1], [82.2, 23.2], [85.2, 25.2], [88.2, 26.9]]],
  ['20 June', [[69.2, 22.6], [73.1, 23.6], [77.1, 24.2], [81.1, 25.6], [84.2, 27.2]]],
  ['25 June', [[70.1, 24.1], [74.1, 25.6], [77.1, 27.1], [79.1, 28.6], [81.1, 29.6]]],
  ['30 June', [[69.6, 26.1], [72.6, 27.6], [75.6, 29.6], [77.6, 31.6], [79.1, 32.6]]],
  ['8 July', [[68.6, 26.6], [70.1, 28.6], [72.6, 30.6], [74.6, 32.6], [76.1, 34.1]]],
];
const ROUTE: [number, number, string?][] = [
  [79.3, 21.4, "Rama's peak"], [81.0, 22.4], [81.75, 22.7], [80.3, 23.0, 'the Reva'], [77.8, 23.5], [75.8, 23.2, 'Ujjain'],
  [76.3, 25.5], [76.8, 28.0], [76.85, 29.9], [78.15, 29.95, 'the Ganga'], [79.4, 30.5], [80.6, 30.9], [81.3, 31.07, 'Kailasa · Alaka'],
];

const smooth = (pts: [number, number][]) => {
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
};
const el = (tag: string, attrs: Record<string, string | number>, parent?: Element) => {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  parent?.appendChild(e);
  return e;
};

export class RouteMap {
  svg: SVGSVGElement;
  private onset: SVGPathElement[] = [];
  private labels: SVGTextElement[] = [];
  private route: SVGPathElement;
  private routeLen = 1;
  private stops: { g: SVGGElement; at: number }[] = [];
  private cloud: SVGGElement;

  constructor(svg: SVGSVGElement) {
    this.svg = svg;
    const vb = [P(67, 36.5), P(98.5, 6.5)];
    svg.setAttribute('viewBox', `${vb[0][0]} ${vb[0][1]} ${vb[1][0] - vb[0][0]} ${vb[1][1] - vb[0][1]}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    const defs = el('defs', {}, svg);
    const hatch = el('pattern', { id: 'wash', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(35)' }, defs);
    el('line', { x1: 0, y1: 0, x2: 0, y2: 6, stroke: '#b9a27a', 'stroke-width': 1, opacity: 0.35 }, hatch);
    el('path', { d: data.land, fill: '#dccaa6', stroke: '#5a4b3a', 'stroke-width': 1.3, 'stroke-linejoin': 'round' }, svg);
    el('path', { d: data.land, fill: 'url(#wash)' }, svg);

    const og = el('g', {}, svg);
    for (const [label, pts] of ONSET) {
      const p = el('path', { d: smooth(pts.map(([a, b]) => P(a, b))), fill: 'none', stroke: '#2b4a7a', 'stroke-width': 2.2, 'stroke-dasharray': '7 6', 'stroke-linecap': 'round', opacity: 0 }, og) as SVGPathElement;
      this.onset.push(p);
      const [lx, ly] = P(pts[0][0], pts[0][1]);
      const t = el('text', { x: lx - 8, y: ly + 4, 'text-anchor': 'end', fill: '#2b4a7a', 'font-family': 'Mukta, sans-serif', 'font-size': 17, 'font-weight': 600, opacity: 0 }, og) as SVGTextElement;
      t.textContent = label;
      this.labels.push(t);
    }

    const routePts = ROUTE.map(([a, b]) => P(a, b));
    const under = el('path', { d: smooth(routePts), fill: 'none', stroke: '#3a2a14', 'stroke-width': 8, opacity: 0.2, 'stroke-linecap': 'round' }, svg) as SVGPathElement;
    this.route = el('path', { d: smooth(routePts), fill: 'none', stroke: '#c9a24a', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, svg) as SVGPathElement;
    under.style.display = 'none';
    let acc = 0;
    const segLen: number[] = [0];
    for (let i = 1; i < routePts.length; i++) { acc += Math.hypot(routePts[i][0] - routePts[i - 1][0], routePts[i][1] - routePts[i - 1][1]); segLen.push(acc); }
    ROUTE.forEach(([, , name], i) => {
      if (!name) return;
      const [x, y] = routePts[i];
      const g = el('g', { opacity: 0 }, svg) as SVGGElement;
      el('circle', { cx: x, cy: y, r: 6, fill: '#b8392a', stroke: '#f4f0e7', 'stroke-width': 2 }, g);
      const right = i < 6;
      const t = el('text', { x: x + (right ? 12 : -12), y: y + 6, 'text-anchor': right ? 'start' : 'end', fill: '#2a241c', 'font-family': 'Fraunces, serif', 'font-style': 'italic', 'font-size': 22 }, g);
      t.textContent = name;
      this.stops.push({ g, at: segLen[i] / acc });
    });
    this.cloud = el('g', {}, svg) as SVGGElement;
    for (const [dx, dy, r] of [[-12, 2, 10], [0, -6, 13], [13, 0, 10], [4, 5, 9]]) el('circle', { cx: dx, cy: dy, r, fill: '#2a2b38', stroke: '#c9a24a', 'stroke-width': 1.5 }, this.cloud);
    const cart = el('g', {}, svg);
    const [cx, cy] = P(88.5, 13.2);
    el('rect', { x: cx - 120, y: cy - 34, width: 240, height: 74, fill: '#efe3c9', stroke: '#b8923c', 'stroke-width': 2 }, cart);
    const ct = el('text', { x: cx, y: cy - 4, 'text-anchor': 'middle', 'font-family': 'Fraunces, serif', 'font-style': 'italic', 'font-size': 26, fill: '#2a241c' }, cart);
    ct.textContent = 'The road north';
    const cs = el('text', { x: cx, y: cy + 24, 'text-anchor': 'middle', 'font-family': 'Mukta, sans-serif', 'font-size': 14, fill: '#5a4b3a', 'letter-spacing': 1 }, cart);
    cs.textContent = 'route in gold · onset dashed';
    requestAnimationFrame(() => { this.routeLen = this.route.getTotalLength() || 1; under.style.display = ''; this.set(0); });
  }

  /** p: 0..1 through the map chapter */
  set(p: number) {
    const L = this.routeLen;
    const rp = Math.min(1, Math.max(0, (p - 0.08) / 0.8));
    this.route.style.strokeDasharray = `${L}`;
    this.route.style.strokeDashoffset = `${L * (1 - rp)}`;
    this.onset.forEach((o, i) => {
      const a = Math.min(1, Math.max(0, (p - 0.04 - i * 0.075) / 0.08));
      o.setAttribute('opacity', (a * 0.85).toFixed(3));
      this.labels[i].setAttribute('opacity', a.toFixed(3));
    });
    for (const s of this.stops) s.g.setAttribute('opacity', rp >= s.at - 0.01 ? '1' : '0');
    if (L > 1) {
      const pt = this.route.getPointAtLength(L * rp);
      this.cloud.setAttribute('transform', `translate(${pt.x},${pt.y - 16})`);
    }
  }
}
