/**
 * render-svg — the ONE pure, platform-agnostic static chart renderer.
 *
 * `chartToSvgString(spec, opts)` turns any ChartSpec (all 19 types) into a complete, standalone
 * SVG string, using ONLY the shared core (types · geometry · palette). No DOM, no React, no
 * react-native — so the exact same output powers:
 *
 *   • the React Native app   (react-native-svg `<SvgXml xml={…} />`)
 *   • work-document embeds    (contentEditable HTML)
 *   • exports                 (PDF / pptx / email — static markup)
 *   • server-side rendering   (no react-dom needed)
 *
 * The interactive web editor keeps its own React renderer (components/shared/Chart/Chart.tsx)
 * because editing needs live event handling; everything STATIC shares this file.
 *
 * The flat style here is deliberately simple and clean; the web editor's 3D extrusion is a
 * web-only nicety (`threeD` degrades gracefully to flat here).
 */

import {
  type ChartSpec,
  isMultiSeries, isCircular, isScatter,
} from "./types";
import {
  chartTheme, categorical, css, hexToHsl, lighten, darken, type HSL, type ChartThemeName,
} from "./palette";
import {
  sectorPath, arcPath, smoothPath, roundedTopRect, axisTicks, niceCeil, polar,
} from "./geometry";

export interface ChartSvgOptions {
  /** Rendered aspect ratio (width / height). Keeps the logical viewBox undistorted. */
  aspect?: number;
  theme?: ChartThemeName;
  /** Unique id seed so multiple charts on one page don't share gradient ids. */
  uid?: string;
}

// ── tiny SVG string helpers ───────────────────────────────────────────────
const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const n = (v: number) => (Number.isFinite(v) ? Math.round(v * 100) / 100 : 0);

// The core geometry (sectorPath / arcPath / polar) works in RADIANS, clockwise from -PI/2 (12
// o'clock). Author angles in degrees for readability, convert once here.
const TAU = Math.PI * 2;

type Attrs = Record<string, string | number | undefined>;
function tag(name: string, attrs: Attrs, inner = ""): string {
  const a = Object.entries(attrs)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${k}="${typeof v === "number" ? n(v) : esc(String(v))}"`)
    .join(" ");
  return inner ? `<${name} ${a}>${inner}</${name}>` : `<${name} ${a} />`;
}
const text = (t: string, x: number, y: number, size: number, color: string, anchor = "start", weight?: number) =>
  tag("text", {
    x, y, "font-size": size, fill: color, "text-anchor": anchor,
    "font-family": "Inter, system-ui, sans-serif", "font-weight": weight,
  }, esc(t));

/**
 * Build the full SVG string for a chart.
 */
export function chartToSvgString(spec: ChartSpec, opts: ChartSvgOptions = {}): string {
  const { aspect = 1.6, theme, uid = "c" } = opts;
  const type = spec.chartType;
  const T = chartTheme(theme);

  const a = Math.max(0.3, aspect);
  const VW = 1000, VH = Math.max(140, Math.round(VW / a));
  const F = VW / 38;

  const defs: string[] = [];
  const usedGrads = new Set<string>();
  const gradRef = (c: HSL, key: string, vertical = true): string => {
    const id = `cg-${uid}-${key}`;
    if (!usedGrads.has(key)) {
      usedGrads.add(key);
      defs.push(
        tag("linearGradient", { id, x1: 0, y1: 0, x2: vertical ? 0 : 1, y2: vertical ? 1 : 0 },
          tag("stop", { offset: "0%", "stop-color": css(lighten(c, 12)) }) +
          tag("stop", { offset: "55%", "stop-color": css(c) }) +
          tag("stop", { offset: "100%", "stop-color": css(darken(c, 8)) })),
      );
    }
    return `url(#${id})`;
  };

  const toHsl = (hex?: string, fallback?: HSL): HSL => (hex ? hexToHsl(hex) : fallback || hexToHsl(spec.accent));
  const palette = (count: number): HSL[] => categorical(spec.accent, Math.max(1, count));

  // ── header (title + subtitle) ──
  const parts: string[] = [];
  const hasTitle = !!(spec.title && spec.title.trim());
  const hasSub = !!(spec.subtitle && spec.subtitle.trim());
  const hAlign = spec.titleAlign || "left";
  const hx = hAlign === "center" ? VW / 2 : hAlign === "right" ? VW - F * 1.2 : F * 1.2;
  const hAnchor = hAlign === "center" ? "middle" : hAlign === "right" ? "end" : "start";
  const headerH = (hasTitle || hasSub) ? (hasTitle ? F * 1.9 : 0) + (hasSub ? F * 1.25 : 0) + F * 0.5 : F * 0.5;

  // ── legend geometry ──
  const legendNeeded = !!spec.showLegend && (isMultiSeries(type) || isCircular(type) || type === "combo");
  const legendItems = isCircular(type)
    ? (spec.data || []).map((d, i) => ({ name: d.label, i }))
    : (spec.series || []).map((s, i) => ({ name: s.name, i }));
  const legendSide: "right" | "bottom" | null = legendNeeded ? (isCircular(type) ? "right" : "bottom") : null;
  const legendW = legendSide === "right" ? Math.min(VW * 0.34, F * 10) : 0;
  const legendH = legendSide === "bottom" ? F * 1.7 : 0;

  const top = headerH, bottom = VH - legendH;
  const plotRight = VW - legendW;
  const plotLeft = F * 3.4;               // room for y-axis labels
  const plotW = plotRight - plotLeft - F;
  const plotH = bottom - top - F * 2;     // room for x-axis labels
  const plotBottom = bottom - F * 1.6;

  // title / subtitle text
  if (hasTitle) parts.push(text(spec.title!, hx, F * 1.7, F * 1.35, T.labelStrong, hAnchor, 700));
  if (hasSub) parts.push(text(spec.subtitle!, hx, F * 1.7 + (hasTitle ? F * 1.3 : 0), F * 0.9, T.labelSoft, hAnchor));

  const cats = spec.categories?.length ? spec.categories : (spec.data || []).map(d => d.label);

  // ── cartesian axis scaffold (grid + y ticks + x labels) ──
  function axisScaffold(maxV: number, minV = 0) {
    const ceil = niceCeil(maxV || 1);
    const { ticks } = axisTicks(minV, ceil, spec.yStep || undefined);
    const scaleY = (v: number) => plotBottom - ((v - minV) / (ceil - minV || 1)) * plotH;
    if (spec.showGrid !== false) {
      for (const t of ticks) {
        const y = scaleY(t);
        parts.push(tag("line", { x1: plotLeft, y1: y, x2: plotRight - F, y2: y, stroke: T.grid, "stroke-width": VW / 900 }));
        parts.push(text(String(t), plotLeft - F * 0.4, y + F * 0.3, F * 0.72, T.labelSoft, "end"));
      }
    }
    if (spec.showAxes !== false) {
      parts.push(tag("line", { x1: plotLeft, y1: top + F * 0.5, x2: plotLeft, y2: plotBottom, stroke: T.axis, "stroke-width": VW / 700 }));
      parts.push(tag("line", { x1: plotLeft, y1: plotBottom, x2: plotRight - F, y2: plotBottom, stroke: T.axis, "stroke-width": VW / 700 }));
    }
    return { scaleY, ceil };
  }
  const xLabel = (label: string, cx: number) => parts.push(text(label, cx, plotBottom + F * 1.15, F * 0.74, T.labelSoft, "middle"));

  // ─────────────────────────────────────────── per-type geometry
  const single = (spec.data || []);
  const series = (spec.series || []);

  if (isCircular(type)) {
    renderCircular();
  } else if (type === "gauge") {
    renderGauge();
  } else if (type === "waffle") {
    renderWaffle();
  } else if (type === "funnel") {
    renderFunnel();
  } else if (type === "radar") {
    renderRadar();
  } else if (isScatter(type)) {
    renderScatter();
  } else if (isMultiSeries(type) || type === "combo") {
    renderMulti();
  } else {
    renderSingle();      // column / bar / line / area / histogram
  }

  // ── legend ──
  if (legendSide && legendItems.length) {
    const pal = palette(legendItems.length);
    const items = legendItems.slice(0, 12);
    if (legendSide === "right") {
      const rowH = F * 1.55;
      const startY = Math.max(top + F, (top + bottom) / 2 - (items.length * rowH) / 2);
      const lx = plotRight + F * 0.6;
      items.forEach((it, idx) => {
        const ly = startY + idx * rowH;
        parts.push(tag("rect", { x: lx, y: ly - F * 0.62, width: F * 0.78, height: F * 0.78, rx: F * 0.24, fill: css(pal[idx % pal.length]) }));
        parts.push(text(it.name, lx + F * 1.1, ly, F * 0.82, T.label));
      });
    } else {
      const totalW = items.length * F * 5.2;
      let lx = VW / 2 - totalW / 2 + F * 0.5;
      const ly = VH - F * 0.6;
      items.forEach((it, idx) => {
        parts.push(tag("rect", { x: lx, y: ly - F * 0.62, width: F * 0.7, height: F * 0.7, rx: F * 0.2, fill: css(pal[idx % pal.length]) }));
        parts.push(text(it.name, lx + F, ly, F * 0.78, T.label));
        lx += F * 5.2;
      });
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="xMidYMid meet">` +
    (defs.length ? `<defs>${defs.join("")}</defs>` : "") +
    parts.join("") +
    `</svg>`;

  // ══════════════════════════════ renderers ══════════════════════════════
  function renderSingle() {
    const vals = single.map(d => d.value);
    const max = Math.max(1, ...vals);
    const isBarH = type === "bar";
    const pal = palette(single.length);

    if (isBarH) {
      // horizontal bars — value runs along X
      const rowH = plotH / Math.max(1, single.length);
      const bh = rowH * 0.62;
      const ceil = niceCeil(max);
      const scaleX = (v: number) => plotLeft + (v / ceil) * plotW;
      if (spec.showAxes !== false) parts.push(tag("line", { x1: plotLeft, y1: top + F * 0.5, x2: plotLeft, y2: plotBottom, stroke: T.axis, "stroke-width": VW / 700 }));
      single.forEach((d, i) => {
        const y = top + F + i * rowH + (rowH - bh) / 2;
        const c = toHsl(d.color, pal[i % pal.length]);
        const w = scaleX(d.value) - plotLeft;
        parts.push(tag("rect", { x: plotLeft, y, width: Math.max(1, w), height: bh, rx: Math.min(F * 0.3, bh * 0.4), fill: gradRef(c, `b${i}`, false) }));
        parts.push(text(d.label, plotLeft - F * 0.4, y + bh * 0.65, F * 0.72, T.labelSoft, "end"));
        if (spec.showValues !== false) parts.push(text(String(d.value), scaleX(d.value) + F * 0.3, y + bh * 0.65, F * 0.72, T.label));
      });
      return;
    }

    const { scaleY } = axisScaffold(max);
    if (type === "line" || type === "area") {
      const step = plotW / Math.max(1, single.length - 1);
      const pts = single.map((d, i) => ({ x: plotLeft + i * step, y: scaleY(d.value) }));
      const c = toHsl(undefined, palette(1)[0]);
      if (type === "area") {
        const areaPath = `${smoothPath(pts)} L${n(pts[pts.length - 1].x)},${n(plotBottom)} L${n(pts[0].x)},${n(plotBottom)} Z`;
        parts.push(tag("path", { d: areaPath, fill: gradRef(c, "area"), opacity: 0.35 }));
      }
      parts.push(tag("path", { d: smoothPath(pts), fill: "none", stroke: css(c), "stroke-width": VW / 220, "stroke-linecap": "round", "stroke-linejoin": "round" }));
      pts.forEach((p, i) => {
        parts.push(tag("circle", { cx: p.x, cy: p.y, r: F * 0.34, fill: css(c) }));
        xLabel(single[i].label, p.x);
        if (spec.showValues !== false) parts.push(text(String(single[i].value), p.x, p.y - F * 0.6, F * 0.68, T.label, "middle"));
      });
      return;
    }

    // column / histogram — vertical bars
    const slot = plotW / Math.max(1, single.length);
    const bw = slot * (type === "histogram" ? 0.94 : 0.62);
    single.forEach((d, i) => {
      const x = plotLeft + i * slot + (slot - bw) / 2;
      const y = scaleY(d.value);
      const c = toHsl(d.color, pal[i % pal.length]);
      parts.push(tag("path", { d: roundedTopRect(x, y, bw, plotBottom - y, Math.min(F * 0.35, bw * 0.12)), fill: gradRef(c, `b${i}`) }));
      xLabel(d.label, x + bw / 2);
      if (spec.showValues !== false) parts.push(text(String(d.value), x + bw / 2, y - F * 0.5, F * 0.7, T.label, "middle"));
    });
  }

  function renderMulti() {
    const stacked = type === "stackedBar" || type === "stackedArea";
    const lineFamily = type === "multiLine" || type === "stackedArea";
    const fillArea = type === "stackedArea"; // multiLine draws lines only
    const pal = palette(series.length);
    const colCount = cats.length;
    // max
    let max = 1;
    if (stacked) {
      for (let ci = 0; ci < colCount; ci++) max = Math.max(max, series.reduce((s, se) => s + (se.values[ci] || 0), 0));
    } else {
      max = Math.max(1, ...series.flatMap(s => s.values));
    }
    const { scaleY } = axisScaffold(max);
    const slot = plotW / Math.max(1, colCount);

    if (lineFamily) {
      cats.forEach((c, ci) => xLabel(c, plotLeft + ci * slot + slot / 2));
      const stepX = (ci: number) => plotLeft + ci * slot + slot / 2;
      const stackTop = new Array(colCount).fill(0);
      series.forEach((se, si) => {
        const c = toHsl(se.color, pal[si % pal.length]);
        const pts = cats.map((_, ci) => {
          const base = stacked ? stackTop[ci] : 0;
          const v = base + (se.values[ci] || 0);
          if (stacked) stackTop[ci] = v;
          return { x: stepX(ci), y: scaleY(stacked ? v : (se.values[ci] || 0)) };
        });
        if (fillArea) {
          const areaPath = `${smoothPath(pts)} L${n(pts[pts.length - 1].x)},${n(plotBottom)} L${n(pts[0].x)},${n(plotBottom)} Z`;
          parts.push(tag("path", { d: areaPath, fill: css(c), opacity: 0.28 }));
        }
        parts.push(tag("path", { d: smoothPath(pts), fill: "none", stroke: css(c), "stroke-width": VW / 240, "stroke-linecap": "round", "stroke-linejoin": "round" }));
      });
      return;
    }

    // grouped / stacked bars + combo (bars)
    const groupW = slot * 0.7;
    cats.forEach((c, ci) => xLabel(c, plotLeft + ci * slot + slot / 2));
    if (stacked) {
      const stackTop = new Array(colCount).fill(plotBottom);
      series.forEach((se, si) => {
        const c = toHsl(se.color, pal[si % pal.length]);
        cats.forEach((_, ci) => {
          const v = se.values[ci] || 0;
          const h = plotBottom - scaleY(v);
          const x = plotLeft + ci * slot + (slot - groupW) / 2;
          const y = stackTop[ci] - h;
          parts.push(tag("rect", { x, y, width: groupW, height: Math.max(0, h), fill: gradRef(c, `s${si}`) }));
          stackTop[ci] = y;
        });
      });
    } else {
      const bw = groupW / Math.max(1, series.length);
      series.forEach((se, si) => {
        const c = toHsl(se.color, pal[si % pal.length]);
        cats.forEach((_, ci) => {
          const v = se.values[ci] || 0;
          const x = plotLeft + ci * slot + (slot - groupW) / 2 + si * bw;
          const y = scaleY(v);
          parts.push(tag("path", { d: roundedTopRect(x, y, bw * 0.86, plotBottom - y, Math.min(F * 0.25, bw * 0.2)), fill: gradRef(c, `g${si}`) }));
        });
      });
    }
  }

  function renderCircular() {
    const data = single.length ? single : [{ label: "—", value: 1 }];
    const total = data.reduce((s, d) => s + Math.max(0, d.value), 0) || 1;
    const cx = plotLeft + (plotRight - plotLeft) / 2 - F, cy = top + (bottom - top) / 2;
    const R = Math.min((plotRight - plotLeft) / 2 - F, (bottom - top) / 2 - F);
    const inner = type === "donut" ? R * 0.58 : type === "radialBar" ? R * 0.42 : 0;
    const pal = palette(data.length);

    if (type === "radialBar") {
      const max = Math.max(1, ...data.map(d => d.value));
      const ringW = (R - inner) / Math.max(1, data.length);
      data.forEach((d, i) => {
        const rOuter = R - i * ringW - 2, rInner = rOuter - ringW * 0.7;
        const c = toHsl(d.color, pal[i % pal.length]);
        parts.push(tag("path", { d: sectorPath(cx, cy, rOuter, rInner, -Math.PI / 2, 1.5 * Math.PI), fill: T.track }));
        const end = -Math.PI / 2 + (d.value / max) * TAU;
        parts.push(tag("path", { d: sectorPath(cx, cy, rOuter, rInner, -Math.PI / 2, end), fill: css(c) }));
      });
      return;
    }

    let ang = -Math.PI / 2;
    data.forEach((d, i) => {
      const frac = Math.max(0, d.value) / total;
      const a1 = ang + frac * TAU;
      const c = toHsl(d.color, pal[i % pal.length]);
      parts.push(tag("path", { d: sectorPath(cx, cy, R, inner, ang, a1), fill: css(c) }));
      if (spec.showValues !== false && frac > 0.04) {
        const mid = (ang + a1) / 2;
        const lr = (R + inner) / 2;
        const p = polar(cx, cy, lr, mid);
        parts.push(text(`${Math.round(frac * 100)}%`, p.x, p.y + F * 0.3, F * 0.8, T.onAccent, "middle", 600));
      }
      ang = a1;
    });
    if (type === "donut") {
      parts.push(text(String(total), cx, cy + F * 0.2, F * 1.5, T.labelStrong, "middle", 700));
      parts.push(text("Total", cx, cy + F * 1.4, F * 0.75, T.labelSoft, "middle"));
    }
  }

  function renderGauge() {
    const val = single[0]?.value ?? 0;
    const max = spec.gaugeMax || niceCeil(val || 1);
    const cx = VW / 2, cy = bottom - F, R = Math.min(VW / 2 - F * 2, (bottom - top) - F);
    const inner = R * 0.62;
    parts.push(tag("path", { d: sectorPath(cx, cy, R, inner, Math.PI, TAU), fill: T.track }));
    const end = Math.PI + Math.min(1, val / max) * Math.PI;
    parts.push(tag("path", { d: sectorPath(cx, cy, R, inner, Math.PI, end), fill: css(palette(1)[0]) }));
    parts.push(text(String(val), cx, cy - F * 0.5, F * 1.8, T.labelStrong, "middle", 700));
    parts.push(text(`of ${max}`, cx, cy + F * 0.6, F * 0.8, T.labelSoft, "middle"));
  }

  function renderWaffle() {
    const data = single.length ? single : [{ label: "—", value: 1 }];
    const total = data.reduce((s, d) => s + Math.max(0, d.value), 0) || 1;
    const cells = 100, cols = 10;
    const size = Math.min((plotRight - plotLeft) / cols, (bottom - top) / cols) * 0.9;
    const gap = size * 0.12;
    const ox = plotLeft + ((plotRight - plotLeft) - cols * (size + gap)) / 2;
    const oy = top + F;
    const pal = palette(data.length);
    const counts = data.map(d => Math.round((Math.max(0, d.value) / total) * cells));
    let filled = 0, di = 0, remaining = counts[0] || 0;
    for (let i = 0; i < cells; i++) {
      while (remaining <= 0 && di < counts.length - 1) { di++; remaining = counts[di]; }
      const r = Math.floor(i / cols), col = i % cols;
      const c = filled < cells ? pal[di % pal.length] : hexToHsl("#e5e7eb");
      parts.push(tag("rect", { x: ox + col * (size + gap), y: oy + r * (size + gap), width: size, height: size, rx: size * 0.16, fill: css(c) }));
      remaining--; filled++;
    }
  }

  function renderFunnel() {
    const data = single.length ? single : [{ label: "—", value: 1 }];
    const max = Math.max(1, ...data.map(d => d.value));
    const h = (bottom - top - F) / data.length;
    const cx = plotLeft + (plotRight - plotLeft) / 2;
    const pal = palette(data.length);
    data.forEach((d, i) => {
      const wTop = (d.value / max) * (plotRight - plotLeft) * 0.9;
      const next = data[i + 1] ? (data[i + 1].value / max) * (plotRight - plotLeft) * 0.9 : wTop * 0.7;
      const y = top + F + i * h;
      const c = toHsl(d.color, pal[i % pal.length]);
      parts.push(tag("path", { d: `M${n(cx - wTop / 2)},${n(y)} L${n(cx + wTop / 2)},${n(y)} L${n(cx + next / 2)},${n(y + h * 0.86)} L${n(cx - next / 2)},${n(y + h * 0.86)} Z`, fill: css(c) }));
      parts.push(text(`${d.label}  ${d.value}`, cx, y + h * 0.5, F * 0.78, T.onAccent, "middle", 600));
    });
  }

  function renderRadar() {
    const axes = cats.length ? cats : (series[0]?.values || []).map((_, i) => `A${i + 1}`);
    const cnt = axes.length || 3;
    const cx = plotLeft + (plotRight - plotLeft) / 2 - F, cy = top + (bottom - top) / 2;
    const R = Math.min((plotRight - plotLeft) / 2 - F * 2, (bottom - top) / 2 - F);
    const max = Math.max(1, ...series.flatMap(s => s.values));
    const angleAt = (i: number) => -Math.PI / 2 + (TAU / cnt) * i;
    // rings + spokes
    for (let ring = 1; ring <= 4; ring++) {
      const rr = (R * ring) / 4;
      const pts = Array.from({ length: cnt }, (_, i) => polar(cx, cy, rr, angleAt(i)));
      parts.push(tag("polygon", { points: pts.map(p => `${n(p.x)},${n(p.y)}`).join(" "), fill: "none", stroke: T.grid, "stroke-width": VW / 900 }));
    }
    axes.forEach((ax, i) => {
      const p = polar(cx, cy, R, angleAt(i));
      parts.push(tag("line", { x1: cx, y1: cy, x2: p.x, y2: p.y, stroke: T.grid, "stroke-width": VW / 900 }));
      const lp = polar(cx, cy, R + F, angleAt(i));
      parts.push(text(ax, lp.x, lp.y, F * 0.66, T.labelSoft, "middle"));
    });
    const pal = palette(series.length);
    series.forEach((se, si) => {
      const c = toHsl(se.color, pal[si % pal.length]);
      const pts = se.values.map((v, i) => polar(cx, cy, (Math.max(0, v) / max) * R, angleAt(i)));
      parts.push(tag("polygon", { points: pts.map(p => `${n(p.x)},${n(p.y)}`).join(" "), fill: css(c), "fill-opacity": 0.25, stroke: css(c), "stroke-width": VW / 260 }));
    });
  }

  function renderScatter() {
    const pts = spec.scatter || [];
    const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
    const xMax = niceCeil(Math.max(1, ...xs)), yMax = niceCeil(Math.max(1, ...ys));
    const { scaleY } = axisScaffold(yMax);
    const scaleX = (v: number) => plotLeft + (v / xMax) * plotW;
    const pal = palette(Math.max(1, pts.length));
    const isBub = type === "bubble";
    pts.forEach((p, i) => {
      const c = toHsl(p.color, pal[i % pal.length]);
      const r = isBub ? Math.max(F * 0.4, Math.sqrt(p.size || 1) * F * 0.4) : F * 0.5;
      parts.push(tag("circle", { cx: scaleX(p.x), cy: scaleY(p.y), r, fill: css(c), "fill-opacity": isBub ? 0.7 : 1 }));
    });
  }
}
