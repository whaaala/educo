/** geometry — pure maths helpers shared by every chart renderer. */

export const polar = (cx: number, cy: number, r: number, ang: number) => ({
  x: cx + r * Math.cos(ang),
  y: cy + r * Math.sin(ang),
});

/** Pie / donut sector path (a0..a1 in radians, clockwise from -PI/2 = 12 o'clock). */
export function sectorPath(cx: number, cy: number, rOuter: number, rInner: number, a0: number, a1: number): string {
  const o0 = polar(cx, cy, rOuter, a0), o1 = polar(cx, cy, rOuter, a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  if (rInner <= 0) return `M${cx},${cy} L${o0.x},${o0.y} A${rOuter},${rOuter} 0 ${large} 1 ${o1.x},${o1.y} Z`;
  const i1 = polar(cx, cy, rInner, a1), i0 = polar(cx, cy, rInner, a0);
  return `M${o0.x},${o0.y} A${rOuter},${rOuter} 0 ${large} 1 ${o1.x},${o1.y} L${i1.x},${i1.y} A${rInner},${rInner} 0 ${large} 0 ${i0.x},${i0.y} Z`;
}

/** Arc stroke path (radial-bar / gauge tracks) — no fill, just the outer arc. */
export function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const p0 = polar(cx, cy, r, a0), p1 = polar(cx, cy, r, a1);
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  const sweep = a1 > a0 ? 1 : 0;
  return `M${p0.x},${p0.y} A${r},${r} 0 ${large} ${sweep} ${p1.x},${p1.y}`;
}

/** Rounded-top rectangle (rounds only the two top corners — modern bar caps). */
export function roundedTopRect(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.min(r, w / 2, h);
  if (h <= 0) return "";
  return `M${x},${y + h} L${x},${y + rr} Q${x},${y} ${x + rr},${y} L${x + w - rr},${y} Q${x + w},${y} ${x + w},${y + rr} L${x + w},${y + h} Z`;
}

/** Rounded-right rectangle (horizontal bars). */
export function roundedRightRect(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.min(r, h / 2, w);
  if (w <= 0) return "";
  return `M${x},${y} L${x + w - rr},${y} Q${x + w},${y} ${x + w},${y + rr} L${x + w},${y + h - rr} Q${x + w},${y + h} ${x + w - rr},${y + h} L${x},${y + h} Z`;
}

/** Smooth (Catmull-Rom → cubic Bézier) path through points for line/area charts. */
export function smoothPath(pts: { x: number; y: number }[], tension = 0.5): string {
  if (pts.length < 2) return pts.length ? `M${pts[0].x},${pts[0].y}` : "";
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + ((p2.x - p0.x) / 6) * tension;
    const c1y = p1.y + ((p2.y - p0.y) / 6) * tension;
    const c2x = p2.x - ((p3.x - p1.x) / 6) * tension;
    const c2y = p2.y - ((p3.y - p1.y) / 6) * tension;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

/**
 * Build axis ticks safely. Guards against a zero/negative/absurdly-small step (which
 * would otherwise loop forever and throw "RangeError: Invalid array length") by
 * forcing a positive range + step and capping the tick count.
 */
export function axisTicks(min: number, max: number, step?: number): { min: number; max: number; ticks: number[] } {
  const MAX = 200;
  let lo = Number.isFinite(min) ? min : 0;
  let hi = Number.isFinite(max) ? max : lo + 1;
  if (!(hi > lo)) hi = lo + 1;                       // ensure a positive range
  let s = step && step > 0 ? step : (hi - lo) / 4;
  if (!(s > 0)) s = (hi - lo) / 4 || 1;              // ensure a positive step
  if ((hi - lo) / s > MAX) s = (hi - lo) / MAX;      // never produce more than MAX ticks
  const ticks: number[] = [];
  for (let v = lo, i = 0; v <= hi + 1e-6 && i <= MAX; v += s, i++) ticks.push(Math.round(v * 100) / 100);
  return { min: lo, max: hi, ticks };
}

/** "Nice" upper bound for an auto Y-axis (1/2/5 × 10ⁿ). */
export function niceCeil(v: number): number {
  if (v <= 0) return 10;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / mag;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * mag;
}

export const SLIDE_ASPECT = 16 / 9;

/** Tokenise a custom label template: {label} {value} {percent}. */
export function tokenize(template: string, label: string, value: number, percent: number): string {
  return template
    .replace(/\{label\}/g, label)
    .replace(/\{value\}/g, String(value))
    .replace(/\{percent\}/g, String(percent));
}
