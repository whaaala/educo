/**
 * pptx-map — PURE mapping helpers for the .pptx exporter.
 *
 * All the fiddly, testable conversions (HTML→text, colour normalisation, % → inches, our 19
 * chart types → PowerPoint's native chart kinds, shape-name mapping) live here with no
 * dependency on pptxgenjs or the DOM, so they can be unit-tested in isolation and reused.
 */

import type { ChartType } from "@/lib/chart";

/** PowerPoint's native chart kinds we target. */
export type PptxChartKind = "bar" | "line" | "area" | "pie" | "doughnut" | "scatter" | "radar";

/** Default 16:9 slide size in inches (matches PowerPoint's widescreen default). */
export const PPTX_W = 10;
export const PPTX_H = 5.625;

/** 0–100 percent → inches on the slide. */
export const pctX = (x: number, w = PPTX_W) => (Math.max(0, Math.min(100, x)) / 100) * w;
export const pctY = (y: number, h = PPTX_H) => (Math.max(0, Math.min(100, y)) / 100) * h;

/** Our object font sizes are px; PowerPoint text is points. */
export const pxToPt = (px: number) => Math.max(6, Math.round(px * 0.75));

/**
 * Normalise a CSS colour to a bare 6-digit hex (no '#') for pptxgenjs, or null when it should be
 * treated as no-fill (transparent / empty / gradients we can't express as a solid).
 */
export function toPptxColor(color?: string | null): string | null {
  if (!color) return null;
  const c = color.trim().toLowerCase();
  if (!c || c === "transparent" || c === "none" || c.startsWith("gradient")) return null;
  const named: Record<string, string> = { white: "FFFFFF", black: "000000", red: "FF0000", blue: "0000FF", green: "008000" };
  if (named[c]) return named[c];
  let hex = c.startsWith("#") ? c.slice(1) : c;
  if (/^[0-9a-f]{3}$/.test(hex)) hex = hex.split("").map((ch) => ch + ch).join(""); // #abc → aabbcc
  if (/^[0-9a-f]{6}$/.test(hex)) return hex.toUpperCase();
  if (/^[0-9a-f]{8}$/.test(hex)) return hex.slice(0, 6).toUpperCase(); // drop alpha
  const m = c.match(/^rgba?\(([^)]+)\)/);
  if (m) {
    const [r, g, b] = m[1].split(",").map((n) => parseInt(n, 10));
    if ([r, g, b].every((n) => Number.isFinite(n))) {
      return [r, g, b].map((n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0")).join("").toUpperCase();
    }
  }
  return null;
}

/** Strip HTML to plain text, preserving line breaks. Pure — no DOM needed. */
export function htmlToText(html?: string): string {
  if (!html) return "";
  return html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/\s*(p|div|h[1-6]|li|tr)\s*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

/** Map our 19 chart types to the closest native PowerPoint chart kind. */
export function toPptxChartKind(type: ChartType): PptxChartKind {
  switch (type) {
    case "bar": return "bar";
    case "column": case "groupedBar": case "stackedBar": case "histogram": case "waffle": case "funnel": case "gauge": case "combo": return "bar";
    case "line": case "multiLine": return "line";
    case "area": case "stackedArea": return "area";
    case "pie": return "pie";
    case "donut": case "radialBar": return "doughnut";
    case "scatter": case "bubble": return "scatter";
    case "radar": return "radar";
    default: return "bar";
  }
}

/** True when a native pptx chart should be stacked. */
export function isPptxStacked(type: ChartType): boolean {
  return type === "stackedBar" || type === "stackedArea";
}

/** True when bars should run horizontally (bar) rather than vertically (col). */
export function isPptxBarHorizontal(type: ChartType): boolean {
  return type === "bar";
}

/**
 * Map one of our shape keys to a pptxgenjs preset-geometry name. Unknown shapes fall back to a
 * rounded rectangle so nothing is lost.
 */
export function toPptxShape(shape: string): string {
  const map: Record<string, string> = {
    rect: "rect", "rect-round": "roundRect", square: "rect", "square-round": "roundRect",
    circle: "ellipse", ellipse: "ellipse",
    triangle: "triangle", "triangle-right": "rtTriangle", "triangle-iso": "triangle",
    diamond: "diamond", pentagon: "pentagon", hexagon: "hexagon", heptagon: "heptagon", octagon: "octagon",
    star: "star5", "star-4": "star4", "star-6": "star6",
    cross: "plus", heart: "heart", cloud: "cloud", lightning: "lightningBolt", moon: "moon",
    parallelogram: "parallelogram", trapezoid: "trapezoid", chevron: "chevron",
    "arrow-right": "rightArrow", "arrow-left": "leftArrow", "arrow-up": "upArrow", "arrow-down": "downArrow",
    "line-h": "line", "line-v": "line", "line-diag": "line",
  };
  return map[shape] || "roundRect";
}

/** Build native pptx chart series `[{ name, labels, values }]` from a ChartSpec-like object. */
export function toPptxChartData(spec: {
  chartType: ChartType;
  data?: { label: string; value: number }[];
  series?: { name: string; values: number[] }[];
  categories?: string[];
}): { name: string; labels: string[]; values: number[] }[] {
  const cats = spec.categories?.length ? spec.categories : (spec.data || []).map((d) => d.label);
  if (spec.series && spec.series.length) {
    return spec.series.map((s) => ({ name: s.name, labels: cats, values: s.values }));
  }
  return [{ name: "Series 1", labels: (spec.data || []).map((d) => d.label), values: (spec.data || []).map((d) => d.value) }];
}
