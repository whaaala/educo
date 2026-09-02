/**
 * Educo UI — colour engine.
 *
 * We COMPUTE colour ramps in OKLCH (perceptually uniform, so each shade step looks evenly spaced) but
 * OUTPUT plain hex, so every visitor's browser renders correctly — including older ones with no OKLCH
 * support. Pure functions, no dependencies. Conversion math from Björn Ottosson's OKLab.
 */

// Shade labels follow the Tailwind convention but extend both ends: 25 (lighter than 50, barely-tinted
// white) through 1000 (darker than 950, near-black), at 25/50 intervals. Labels are just names for
// lightness steps — the real range is bounded by white (L→1) and black (L→0), so ~23 steps is the
// practical maximum before neighbours look identical. The classic 50–950 names are kept inside the scale.
export type Shade = number;
export type Ramp = Record<Shade, string>;
export const SHADES: Shade[] = [
  25, 50, 75, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 975, 1000,
];

export interface RGB { r: number; g: number; b: number } // 0–255
export interface OKLCH { L: number; C: number; h: number } // L 0–1, C 0+, h 0–360

const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));

// ── hex ↔ rgb ────────────────────────────────────────────────────────────────
export function hexToRgb(hex: string): RGB {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length === 8) h = h.slice(0, 6); // drop alpha
  const n = parseInt(h || "000000", 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
export function rgbToHex({ r, g, b }: RGB): string {
  const to = (v: number) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

// ── sRGB gamma ↔ linear ──────────────────────────────────────────────────────
const toLinear = (c: number) => { const x = c / 255; return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); };
const toGamma = (x: number) => { const c = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055; return clamp(c) * 255; };

// ── linear sRGB ↔ OKLab ↔ OKLCH ──────────────────────────────────────────────
export function rgbToOklch(rgb: RGB): OKLCH {
  const r = toLinear(rgb.r), g = toLinear(rgb.g), b = toLinear(rgb.b);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
  const C = Math.hypot(a, bb);
  let h = (Math.atan2(bb, a) * 180) / Math.PI; if (h < 0) h += 360;
  return { L, C, h };
}
export function oklchToRgb({ L, C, h }: OKLCH): RGB {
  const hr = (h * Math.PI) / 180;
  const a = C * Math.cos(hr), b = C * Math.sin(hr);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
  return { r: toGamma(clamp(r)), g: toGamma(clamp(g)), b: toGamma(clamp(bl)) };
}

export const hexToOklch = (hex: string): OKLCH => rgbToOklch(hexToRgb(hex));
export const oklchToHex = (c: OKLCH): string => rgbToHex(oklchToRgb(c));

// ── Ramp: 50→950 from one brand colour ───────────────────────────────────────
// Target lightness per step (light→dark) + a chroma curve (colour is most saturated mid-scale, calmer at
// the near-white and near-black ends). Hue is kept from the seed. Output is hex → universal support.
// One entry per SHADES step (25 → 1000). Lightness runs near-white → near-black; chroma peaks mid-scale
// and eases off at the pale and dark ends. Both arrays MUST stay the same length as SHADES.
const L_TARGET = [0.985, 0.971, 0.954, 0.936, 0.910, 0.882, 0.845, 0.806, 0.765, 0.723, 0.680, 0.637, 0.596, 0.554, 0.516, 0.478, 0.441, 0.404, 0.368, 0.332, 0.259, 0.205, 0.150];
const C_SCALE = [0.20, 0.30, 0.37, 0.44, 0.52, 0.60, 0.69, 0.78, 0.85, 0.92, 0.97, 1.00, 1.00, 1.00, 0.97, 0.93, 0.88, 0.83, 0.75, 0.68, 0.55, 0.48, 0.42];

// Fail loudly if the tuning arrays ever drift out of sync with the shade list.
if (L_TARGET.length !== SHADES.length || C_SCALE.length !== SHADES.length) {
  throw new Error(`Educo UI colour: L_TARGET (${L_TARGET.length}) and C_SCALE (${C_SCALE.length}) must match SHADES (${SHADES.length}).`);
}

export function rampFromHex(hex: string): Ramp {
  const { C, h } = hexToOklch(hex);
  const out = {} as Ramp;
  SHADES.forEach((shade, i) => { out[shade] = oklchToHex({ L: L_TARGET[i], C: C * C_SCALE[i], h }); });
  return out;
}

// ── WCAG contrast (used by the theme editor's accessibility checker) ──────────
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}
/** WCAG contrast ratio between two colours (1–21). AA body text needs ≥ 4.5, large ≥ 3, AAA ≥ 7. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a), lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}
export const passesAA = (fg: string, bg: string, large = false) => contrastRatio(fg, bg) >= (large ? 3 : 4.5);
