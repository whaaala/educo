"use client";

/**
 * Chart — a reusable, presentation-agnostic chart renderer.
 *
 * Renders ANY of the 19 supported chart types as ONE logical-viewBox SVG that scales
 * uniformly (editor, thumbnail, slideshow, work document). Every text element is an
 * editable "label": its content, position (free-drag) and font (whole-chart default +
 * per-label override) can all be changed when `editing` is on.
 *
 * It has NO slide/document dependencies — hand it a ChartSpec and (optionally) an
 * onUpdate callback and it works anywhere.
 */

import React from "react";
import TextFormatToolbar from "@/components/shared/TextFormatToolbar";
import {
  type ChartSpec, type ChartTextStyle, type ChartLabelOverride, isCircular, isMultiSeries,
} from "@/lib/chart-types";
import {
  type HSL, type ChartThemeName, hexToHsl, css, lighten, darken, categorical, mono, chartTheme, gradId,
} from "./palette";
import {
  polar, sectorPath, arcPath, roundedTopRect, roundedRightRect, smoothPath,
  niceCeil, axisTicks, tokenize,
} from "./geometry";

export type { ChartSpec } from "@/lib/chart-types";

interface LabelSpec {
  id: string; text: string; x: number; y: number;
  anchor: "start" | "middle" | "end";
  baseline?: "middle" | "central" | "alphabetic" | "hanging";
  size: number; color: string; weight?: number;
}

export default function Chart({
  spec, aspect = 1.6, theme, editing, onUpdate, uid: uidProp, className, style,
}: {
  spec: ChartSpec;
  /** rendered pixel width / height — keeps the logical viewBox undistorted. */
  aspect?: number;
  /** surface mode — grid/axis/label colours follow the app theme. Default light. */
  theme?: ChartThemeName;
  editing?: boolean;
  onUpdate?: (patch: Partial<ChartSpec>) => void;
  uid?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [selected, setSelected] = React.useState<string | null>(null);
  React.useEffect(() => { if (!editing) setSelected(null); }, [editing]);
  // Hydration-stable, per-instance unique id for gradient defs. We ALWAYS fold in
  // useId() — even when a caller passes a stable uid — because the same chart object
  // is rendered in several places at once (canvas, thumbnail, slideshow). Sharing one
  // id across instances created duplicate <linearGradient> ids, and url(#id) binds to
  // the first match (often an off-screen 0×0 render), leaving fills invisible.
  const autoId = React.useId().replace(/:/g, "");
  const uid = uidProp ? `${uidProp}-${autoId}` : autoId;

  const a = Math.max(0.3, aspect);
  const VW = 1000, VH = Math.max(140, Math.round(VW / a));
  const F = VW / 38;                 // base font unit
  const lineW = VW / 320;
  const font = spec.font || {};
  const type = spec.chartType;
  const T = chartTheme(theme);       // grid / axis / label colours for the surface

  const labels: LabelSpec[] = [];
  const defs: React.ReactNode[] = [];

  // gradient def per HSL colour — modern top-light → deep look
  const usedGrads = new Set<string>();
  const grad = (c: HSL, key: string, vertical = true): string => {
    const id = gradId(uid, key);
    if (!usedGrads.has(key)) {
      usedGrads.add(key);
      defs.push(
        <linearGradient key={key} id={id} x1="0" y1="0" x2={vertical ? "0" : "1"} y2={vertical ? "1" : "0"}>
          <stop offset="0%" stopColor={css(lighten(c, 12))} />
          <stop offset="55%" stopColor={css(c)} />
          <stop offset="100%" stopColor={css(darken(c, 8))} />
        </linearGradient>,
      );
    }
    return `url(#${id})`;
  };

  // ── 3D helpers (the threeD toggle affects EVERY chart type) ──
  const D3 = !!spec.threeD;
  // Soft drop shadow for "floating 3D" types (line, area, radar, scatter, bubble).
  if (D3) defs.push(
    <filter key="d3" id={gradId(uid, "d3")} x="-20%" y="-20%" width="140%" height="170%">
      <feDropShadow dx="0" dy={F * 0.55} stdDeviation={F * 0.5} floodColor="rgba(15,23,42,0.30)" />
    </filter>,
  );
  const shadow3D = D3 ? `url(#${gradId(uid, "d3")})` : undefined;
  // Radial "sphere" gradient for bubbles / markers in 3D.
  const sphere = (c: HSL, key: string): string => {
    const id = gradId(uid, key);
    if (!usedGrads.has(key)) {
      usedGrads.add(key);
      defs.push(
        <radialGradient key={key} id={id} cx="36%" cy="30%" r="78%">
          <stop offset="0%" stopColor={css(lighten(c, 24))} />
          <stop offset="60%" stopColor={css(c)} />
          <stop offset="100%" stopColor={css(darken(c, 16))} />
        </radialGradient>,
      );
    }
    return `url(#${id})`;
  };
  // Isometric depth (logical units), scaled to chart size.
  const dep3 = D3 ? F * 0.55 : 0;
  // Reusable extruded vertical bar (top + right side faces + front). gradKey is shared
  // across same-series bars; rkey is the unique React key.
  const vBar3D = (x: number, yb: number, w: number, y1: number, c: HSL, gradKey: string, rkey: string) => (
    <g key={rkey}>
      <path d={`M${x + w},${y1} L${x + w + dep3},${y1 - dep3} L${x + w + dep3},${yb - dep3} L${x + w},${yb} Z`} fill={css(darken(c, 18))} />
      <path d={`M${x},${yb} L${x + dep3},${yb - dep3} L${x + w + dep3},${yb - dep3} L${x + w},${yb} Z`} fill={css(lighten(c, 8))} />
      <rect x={x} y={yb} width={w} height={y1 - yb} rx={Math.min(F * 0.3, w * 0.1)} fill={grad(c, gradKey)} />
    </g>
  );
  // Reusable extruded ribbon under a line — gives the stroke a solid 3D thickness.
  const lineRibbon = (pts: { x: number; y: number }[], c: HSL, rkey: string) => {
    if (dep3 <= 0 || pts.length < 2) return null;
    const back = [...pts].reverse().map(pt => `L${pt.x},${pt.y + dep3}`).join(" ");
    return <path key={rkey} d={`${smoothPath(pts)} L${pts[pts.length - 1].x},${pts[pts.length - 1].y + dep3} ${back} Z`} fill={css(darken(c, 15))} opacity={0.92} />;
  };

  // ── header (title + subtitle), placed together by titleAlign / titleVAlign ──
  const hasTitle = !!(spec.title && spec.title.trim());
  const hasSub = !!(spec.subtitle && spec.subtitle.trim());
  const hAlign = spec.titleAlign || "left";
  const hVAlign = spec.titleVAlign || "top";
  const hx = hAlign === "center" ? VW / 2 : hAlign === "right" ? VW - F * 1.2 : F * 1.2;
  const hAnchor: "start" | "middle" | "end" = hAlign === "center" ? "middle" : hAlign === "right" ? "end" : "start";
  // Only a top-aligned header reserves vertical space; middle/bottom float over the plot.
  const headerH = (hVAlign === "top" && (hasTitle || hasSub))
    ? (hasTitle ? F * 1.9 : 0) + (hasSub ? F * 1.25 : 0) + F * 0.5
    : (hasTitle || hasSub ? F * 0.3 : F * 0.5);

  // Legend placement: circular charts read best with a vertical list to the RIGHT
  // (not crammed in a row at the very bottom); multi-series sit in a centred row.
  const legendNeeded = !!spec.showLegend && (isMultiSeries(type) || isCircular(type) || type === "combo");
  const seriesNames = (spec.series || []).map(s => s.name);
  const legendItems = isCircular(type)
    ? (spec.data || []).map((d, i) => ({ name: d.label, color: d.color, i }))
    : seriesNames.map((name, i) => ({ name, color: spec.series?.[i]?.color, i }));
  const legendSide: "right" | "bottom" | null = legendNeeded ? (isCircular(type) ? "right" : "bottom") : null;
  const legendW = legendSide === "right" ? Math.min(VW * 0.34, F * 10) : 0;
  const legendH = legendSide === "bottom" ? F * 1.7 : 0;

  const top = headerH, bottom = VH - legendH;
  const plotRight = VW - legendW;     // circular geometry centres within this

  // Place the title/subtitle block now that the plot box (top/bottom) is known.
  {
    const blockH = (hasTitle ? F * 1.5 : 0) + (hasSub ? F * 1.15 : 0);
    let titleY: number;
    if (hVAlign === "middle") titleY = (top + bottom) / 2 - blockH / 2 + F * 1.1;
    else if (hVAlign === "bottom") titleY = bottom - blockH - F * 0.2 + F * 1.1;
    else titleY = F * 1.5;
    if (hasTitle) labels.push({ id: "title", text: spec.title!, x: hx, y: titleY, anchor: hAnchor, size: F * 1.35, color: T.labelStrong, weight: 700 });
    if (hasSub) labels.push({ id: "subtitle", text: spec.subtitle!, x: hx, y: titleY + (hasTitle ? F * 1.2 : 0), anchor: hAnchor, size: F * 0.9, color: T.labelSoft });
  }

  // ── geometry, dispatched per type ──
  let geom: React.ReactNode = null;
  const cats = spec.categories && spec.categories.length ? spec.categories : (spec.data || []).map(d => d.label);

  if (type === "pie" || type === "donut") geom = renderPie();
  else if (type === "radialBar") geom = renderRadial();
  else if (type === "gauge") geom = renderGauge();
  else if (type === "waffle") geom = renderWaffle();
  else if (type === "funnel") geom = renderFunnel();
  else if (type === "radar") geom = renderRadar();
  else if (type === "scatter" || type === "bubble") geom = renderScatter();
  else if (type === "bar") geom = renderBar();
  else if (type === "groupedBar" || type === "stackedBar") geom = renderMultiBar();
  else if (type === "histogram") geom = renderHistogram();
  else if (type === "line" || type === "area") geom = renderLineArea();
  else if (type === "multiLine" || type === "stackedArea") geom = renderMultiLine();
  else if (type === "combo") geom = renderCombo();
  else geom = renderColumn();

  // ── legend (shared) ──
  let legend: React.ReactNode = null;
  if (legendSide && legendItems.length) {
    const pal = categorical(spec.accent, Math.max(1, legendItems.length));
    const sw = F * 0.78, swR = F * 0.24;   // swatch size / radius
    if (legendSide === "right") {
      // Vertical list, centred against the chart height.
      const items = legendItems.slice(0, 12);
      const rowH = F * 1.55;
      const blockH = items.length * rowH;
      const startY = Math.max(top + F, (top + bottom) / 2 - blockH / 2);
      const lx = plotRight + F * 0.6;
      legend = items.map((it, idx) => {
        const ly = startY + idx * rowH;
        const color = it.color || css(pal[it.i] || pal[0]);
        labels.push({ id: `leg:${it.i}`, text: it.name, x: lx + sw + F * 0.5, y: ly + sw * 0.85, anchor: "start", size: F * 0.85, color: T.label });
        return <rect key={`lg${idx}`} x={lx} y={ly} width={sw} height={sw} rx={swR} fill={color} />;
      });
    } else {
      // Centred horizontal row at the bottom. Approximate each item's width from its
      // label length so the whole row is balanced rather than left-dumped.
      const items = legendItems.slice(0, 6);
      const widths = items.map(it => sw + F * 0.5 + (it.name.length * F * 0.46) + F * 1.2);
      const totalW = widths.reduce((s, w) => s + w, 0);
      let x = (VW - totalW) / 2;
      const ly = bottom + F * 1.0;
      legend = items.map((it, idx) => {
        const color = it.color || css(pal[it.i] || pal[0]);
        const sx = x; x += widths[idx];
        labels.push({ id: `leg:${it.i}`, text: it.name, x: sx + sw + F * 0.5, y: ly + sw * 0.85, anchor: "start", size: F * 0.85, color: T.label });
        return <rect key={`lg${idx}`} x={sx} y={ly} width={sw} height={sw} rx={swR} fill={color} />;
      });
    }
  }

  // ── label resolve / drag / style (shared) ──
  // Horizontal/vertical snap anchors within the chart box (used by align/valign).
  const alignX = { left: F * 1.2, center: VW / 2, right: VW - F * 1.2 };
  const alignAnchor = { left: "start" as const, center: "middle" as const, right: "end" as const };
  const valignY = { top: F * 1.6, middle: (top + bottom) / 2, bottom: VH - F * 0.8 };
  const resolve = (s: LabelSpec) => {
    const ov = spec.labels?.[s.id] || {};
    const st = ov.style || {};
    // align/valign snap the base position (then drag dx/dy still applies on top)
    const baseX = ov.align ? alignX[ov.align] : s.x;
    const anchor = ov.align ? alignAnchor[ov.align] : s.anchor;
    const baseY = ov.valign ? valignY[ov.valign] : s.y;
    const baseline = ov.valign === "middle" ? "middle" : (ov.valign === "bottom" ? "alphabetic" : (s.baseline || "alphabetic"));
    return {
      text: ov.text ?? s.text,
      x: baseX + (ov.dx || 0), y: baseY + (ov.dy || 0),
      anchor, baseline,
      fontFamily: st.fontFamily || font.fontFamily || "Inter, sans-serif",
      fontSize: st.fontSize ?? (s.size * (font.fontSize || 1)),
      fill: st.color || font.color || s.color,
      fontWeight: (st.bold ?? font.bold ?? (s.weight === 700)) ? 700 : 400,
      fontStyle: (st.italic ?? font.italic) ? "italic" : "normal",
    };
  };
  const startLabelDrag = (e: React.MouseEvent, id: string) => {
    if (!editing || !onUpdate) return;
    e.preventDefault(); e.stopPropagation();
    setSelected(id);
    const svg = svgRef.current; if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const sx = VW / rect.width, sy = VH / rect.height;
    const startX = e.clientX, startY = e.clientY;
    const ov = spec.labels?.[id] || {};
    const baseDx = ov.dx || 0, baseDy = ov.dy || 0;
    const move = (ev: MouseEvent) => onUpdate({ labels: { ...spec.labels, [id]: { ...ov, dx: baseDx + (ev.clientX - startX) * sx, dy: baseDy + (ev.clientY - startY) * sy } } });
    const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
    document.addEventListener("mousemove", move); document.addEventListener("mouseup", up);
  };
  const setLabelStyle = (id: string, patch: Partial<ChartTextStyle>) => {
    const ov = spec.labels?.[id] || {};
    onUpdate?.({ labels: { ...spec.labels, [id]: { ...ov, style: { ...ov.style, ...patch } } } });
  };
  // align/valign live on the override itself (not under style)
  const setLabelMeta = (id: string, patch: Partial<ChartLabelOverride>) => {
    const ov = spec.labels?.[id] || {};
    onUpdate?.({ labels: { ...spec.labels, [id]: { ...ov, ...patch } } });
  };

  return (
    <div className={`w-full h-full select-none ${className || ""}`}
      style={{ background: "transparent", ...style }}>
      <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none">
        <defs>{defs}</defs>
        {geom}
        {legend}
        {labels.map((s) => {
          const r = resolve(s);
          return (
            <text key={s.id} data-chart-label={s.id}
              x={r.x} y={r.y} textAnchor={r.anchor} dominantBaseline={r.baseline}
              fontFamily={r.fontFamily} fontSize={r.fontSize} fill={r.fill} fontWeight={r.fontWeight} fontStyle={r.fontStyle}
              style={{ pointerEvents: editing ? "auto" : "none", cursor: editing ? "move" : "default" }}
              onMouseDown={(e) => startLabelDrag(e, s.id)}
              onClick={editing ? (e) => { e.stopPropagation(); setSelected(s.id); } : undefined}>
              {r.text}
            </text>
          );
        })}
      </svg>

      {editing && selected && onUpdate && (() => {
        const el = svgRef.current?.querySelector(`[data-chart-label="${selected}"]`) as SVGTextElement | null;
        if (!el) return null;
        const full = spec.labels?.[selected] || {};
        const ov = full.style || {};
        return (
          <TextFormatToolbar
            anchorRect={el.getBoundingClientRect()}
            fontFamily={ov.fontFamily || font.fontFamily || "Inter, sans-serif"}
            fontSize={Math.round(ov.fontSize ?? (font.fontSize ? 26 * font.fontSize : 26))}
            bold={ov.bold ?? font.bold ?? false}
            italic={ov.italic ?? font.italic ?? false}
            textColor={ov.color || font.color || T.labelStrong}
            align={full.align || "left"}
            verticalAlign={full.valign || "top"}
            showAlign showVerticalAlign showWrap={false} showFillColor={false} showUnderline={false}
            onFontFamilyChange={(v) => setLabelStyle(selected, { fontFamily: v })}
            onFontSizeChange={(v) => setLabelStyle(selected, { fontSize: v })}
            onBold={() => setLabelStyle(selected, { bold: !(ov.bold ?? font.bold) })}
            onItalic={() => setLabelStyle(selected, { italic: !(ov.italic ?? font.italic) })}
            onTextColorChange={(c) => setLabelStyle(selected, { color: c })}
            onAlignChange={(v) => setLabelMeta(selected, { align: v })}
            onVerticalAlignChange={(v) => setLabelMeta(selected, { valign: v })}
            onClose={() => setSelected(null)}
          />
        );
      })()}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Per-type renderers (closures over labels/defs/geom helpers above)
  // ─────────────────────────────────────────────────────────────────────────

  function cartesianPlot(padLeftExtra = 0) {
    const padL = (spec.showAxes ? F * 2.8 : F * 0.6) + padLeftExtra;
    const padR = F * 1.4, padB = F * 2.0;
    return { x0: padL, x1: VW - padR, y0: top + F * 0.5, y1: bottom - padB };
  }

  function yScaleFns(maxVal: number, minVal = 0) {
    const yMin0 = spec.yMin ?? Math.min(0, minVal);
    const yMax0 = spec.yMax ?? Math.max(niceCeil(Math.max(maxVal, 1)), yMin0 + 1);
    const { min: yMin, max: yMax, ticks } = axisTicks(yMin0, yMax0, spec.yStep);
    return { yMin, yMax, ticks };
  }

  function gridAndAxes(p: { x0: number; x1: number; y0: number; y1: number }, ticks: number[], scaleY: (v: number) => number) {
    return (
      <>
        {spec.showGrid && ticks.map((t, i) => <line key={`g${i}`} x1={p.x0} y1={scaleY(t)} x2={p.x1} y2={scaleY(t)} stroke={T.grid} strokeWidth={lineW} />)}
        {spec.showAxes && <line x1={p.x0} y1={p.y0} x2={p.x0} y2={p.y1} stroke={T.axis} strokeWidth={lineW} />}
        <line x1={p.x0} y1={p.y1} x2={p.x1} y2={p.y1} stroke={T.axis} strokeWidth={lineW} />
      </>
    );
  }

  function pushYTicks(p: { x0: number }, ticks: number[], scaleY: (v: number) => number) {
    if (!spec.showAxes) return;
    ticks.forEach((t, i) => labels.push({ id: `y:${i}`, text: String(t), x: p.x0 - F * 0.5, y: scaleY(t) + F * 0.3, anchor: "end", size: F * 0.78, color: T.labelSoft }));
  }

  function renderColumn() {
    const data = spec.data;
    const p = cartesianPlot();
    const total = data.reduce((s, d) => s + (Number(d.value) || 0), 0) || 1;
    const { yMin, yMax, ticks } = yScaleFns(Math.max(...data.map(d => Number(d.value) || 0), 1));
    const scaleY = (v: number) => p.y1 - ((v - yMin) / (yMax - yMin || 1)) * (p.y1 - p.y0);
    const cols = categorical(spec.accent, data.length);
    const slot = (p.x1 - p.x0) / data.length, barW = slot * 0.52;
    return (
      <>
        {gridAndAxes(p, ticks, scaleY)}
        {pushYTicks(p, ticks, scaleY)}
        {data.map((d, i) => {
          const v = Number(d.value) || 0, yb = scaleY(v);
          const x = p.x0 + i * slot + (slot - barW) / 2;
          const c = d.color ? hexToHsl(d.color) : cols[i];
          const pct = Math.round(v / total * 100);
          const dep = spec.threeD ? barW * 0.26 : 0;   // isometric depth
          labels.push({ id: `x:${i}`, text: d.label, x: x + barW / 2 + dep / 2, y: p.y1 + F * 1.35, anchor: "middle", size: F * 0.9, color: T.label });
          if (spec.showValues) labels.push({ id: `v:${i}`, text: d.customLabel ? tokenize(d.customLabel, d.label, v, pct) : String(v), x: x + barW / 2 + dep / 2, y: yb - F * 0.55 - dep, anchor: "middle", size: F * 0.95, color: T.labelStrong, weight: 700 });
          if (dep > 0) {
            return (
              <g key={i}>
                <path d={`M${x + barW},${p.y1} L${x + barW + dep},${p.y1 - dep} L${x + barW + dep},${yb - dep} L${x + barW},${yb} Z`} fill={css(darken(c, 18))} />
                <path d={`M${x},${yb} L${x + dep},${yb - dep} L${x + barW + dep},${yb - dep} L${x + barW},${yb} Z`} fill={css(lighten(c, 8))} />
                <rect x={x} y={yb} width={barW} height={p.y1 - yb} rx={Math.min(F * 0.3, barW * 0.1)} fill={grad(c, `col${i}`)} />
              </g>
            );
          }
          return <path key={i} d={roundedTopRect(x, yb, barW, p.y1 - yb, barW * 0.18)} fill={grad(c, `col${i}`)} />;
        })}
      </>
    );
  }

  function renderBar() {
    // Horizontal bars: categories run down the LEFT (Y axis), values run along the
    // BOTTOM (X axis). Both the X-axis scale and the vertical gridlines honour the toggles.
    const data = spec.data;
    const padL = F * 0.6, x0 = padL + maxLabelW(data.map(d => d.label), F * 0.85);
    const padB = spec.showAxes ? F * 1.9 : F * 0.8;
    const x1 = VW - F * 2.6, y0 = top + F * 0.4, y1 = bottom - padB;
    const total = data.reduce((s, d) => s + (Number(d.value) || 0), 0) || 1;
    const vMin0 = spec.yMin ?? 0;
    const vMax0 = spec.yMax ?? Math.max(niceCeil(Math.max(...data.map(d => Number(d.value) || 0), 1)), vMin0 + 1);
    const { min: vMin, max: vMax, ticks: vTicks } = axisTicks(vMin0, vMax0, spec.yStep);
    const scaleX = (v: number) => x0 + ((v - vMin) / (vMax - vMin || 1)) * (x1 - x0);
    const cols = categorical(spec.accent, data.length);
    const slot = (y1 - y0) / data.length, barH = slot * 0.56;
    return (
      <>
        {/* value gridlines (vertical) */}
        {spec.showGrid && vTicks.map((t, i) => <line key={`g${i}`} x1={scaleX(t)} y1={y0} x2={scaleX(t)} y2={y1} stroke={T.grid} strokeWidth={lineW} />)}
        {/* X axis (bottom) + value tick labels */}
        {spec.showAxes && <line x1={x0} y1={y1} x2={x1} y2={y1} stroke={T.axis} strokeWidth={lineW} />}
        {spec.showAxes && vTicks.forEach((t, i) => labels.push({ id: `xt:${i}`, text: String(t), x: scaleX(t), y: y1 + F * 1.15, anchor: "middle", size: F * 0.72, color: T.labelSoft }))}
        {/* Y axis (left) */}
        <line x1={x0} y1={y0} x2={x0} y2={y1} stroke={T.axis} strokeWidth={lineW} />
        {data.map((d, i) => {
          const v = Number(d.value) || 0, bw = Math.max(0, scaleX(v) - x0);
          const y = y0 + i * slot + (slot - barH) / 2;
          const c = d.color ? hexToHsl(d.color) : cols[i];
          const pct = Math.round(v / total * 100);
          labels.push({ id: `x:${i}`, text: d.label, x: x0 - F * 0.55, y: y + barH / 2 + F * 0.32, anchor: "end", size: F * 0.88, color: T.label });
          if (spec.showValues) labels.push({ id: `v:${i}`, text: d.customLabel ? tokenize(d.customLabel, d.label, v, pct) : String(v), x: x0 + bw + dep3 + F * 0.5, y: y + barH / 2 + F * 0.32 - dep3 / 2, anchor: "start", size: F * 0.95, color: T.labelStrong, weight: 700 });
          if (dep3 > 0) {
            return (
              <g key={i}>
                <path d={`M${x0},${y} L${x0 + dep3},${y - dep3} L${x0 + bw + dep3},${y - dep3} L${x0 + bw},${y} Z`} fill={css(lighten(c, 8))} />
                <path d={`M${x0 + bw},${y} L${x0 + bw + dep3},${y - dep3} L${x0 + bw + dep3},${y + barH - dep3} L${x0 + bw},${y + barH} Z`} fill={css(darken(c, 18))} />
                <rect x={x0} y={y} width={bw} height={barH} rx={Math.min(F * 0.3, barH * 0.2)} fill={grad(c, `bar${i}`, false)} />
              </g>
            );
          }
          return <path key={i} d={roundedRightRect(x0, y, bw, barH, barH * 0.3)} fill={grad(c, `bar${i}`, false)} />;
        })}
      </>
    );
  }

  function renderMultiBar() {
    const series = spec.series || [];
    const p = cartesianPlot();
    const stacked = type === "stackedBar";
    const colMax = cats.map((_, ci) => {
      const vals = series.map(s => Number(s.values[ci]) || 0);
      return stacked ? vals.reduce((a, b) => a + b, 0) : Math.max(...vals, 0);
    });
    const { yMin, yMax, ticks } = yScaleFns(Math.max(...colMax, 1));
    const scaleY = (v: number) => p.y1 - ((v - yMin) / (yMax - yMin || 1)) * (p.y1 - p.y0);
    const pal = stacked ? mono(spec.accent, series.length) : categorical(spec.accent, series.length);
    const slot = (p.x1 - p.x0) / cats.length;
    return (
      <>
        {gridAndAxes(p, ticks, scaleY)}
        {pushYTicks(p, ticks, scaleY)}
        {cats.map((cat, ci) => {
          const groupX = p.x0 + ci * slot;
          labels.push({ id: `x:${ci}`, text: cat, x: groupX + slot / 2, y: p.y1 + F * 1.35, anchor: "middle", size: F * 0.9, color: T.label });
          if (stacked) {
            const barW = slot * 0.5, x = groupX + (slot - barW) / 2;
            const stackTop = scaleY(colMax[ci]);
            let acc = 0;
            const segs = series.map((s, si) => {
              const v = Number(s.values[ci]) || 0;
              const yTop = scaleY(acc + v), yBot = scaleY(acc); acc += v;
              const c = s.color ? hexToHsl(s.color) : pal[si];
              return <rect key={`${ci}-${si}`} x={x} y={yTop} width={barW} height={Math.max(0, yBot - yTop)} fill={grad(c, `sb${si}`)} rx={si === series.length - 1 ? barW * 0.12 : 0} />;
            });
            if (dep3 > 0) {
              // one extrude around the whole stacked column, behind the segments
              const topC = (series[series.length - 1].color ? hexToHsl(series[series.length - 1].color!) : pal[series.length - 1]);
              return (
                <g key={`st${ci}`}>
                  <path d={`M${x + barW},${p.y1} L${x + barW + dep3},${p.y1 - dep3} L${x + barW + dep3},${stackTop - dep3} L${x + barW},${stackTop} Z`} fill={css(darken(pal[0], 22))} />
                  <path d={`M${x},${stackTop} L${x + dep3},${stackTop - dep3} L${x + barW + dep3},${stackTop - dep3} L${x + barW},${stackTop} Z`} fill={css(lighten(topC, 8))} />
                  {segs}
                </g>
              );
            }
            return segs;
          }
          const innerW = slot * 0.72, bw = innerW / series.length;
          return series.map((s, si) => {
            const v = Number(s.values[ci]) || 0, yb = scaleY(v);
            const x = groupX + (slot - innerW) / 2 + si * bw;
            const c = s.color ? hexToHsl(s.color) : pal[si];
            if (spec.showValues) labels.push({ id: `v:${ci}:${si}`, text: String(v), x: x + bw / 2 + dep3 / 2, y: yb - F * 0.4 - dep3, anchor: "middle", size: F * 0.72, color: T.label });
            if (dep3 > 0) return vBar3D(x + bw * 0.08, yb, bw * 0.84, p.y1, c, `gb${si}`, `${ci}-${si}`);
            return <path key={`${ci}-${si}`} d={roundedTopRect(x + bw * 0.08, yb, bw * 0.84, p.y1 - yb, bw * 0.18)} fill={grad(c, `gb${si}`)} />;
          });
        })}
      </>
    );
  }

  function renderHistogram() {
    const data = spec.data;
    const p = cartesianPlot();
    const { yMin, yMax, ticks } = yScaleFns(Math.max(...data.map(d => Number(d.value) || 0), 1));
    const scaleY = (v: number) => p.y1 - ((v - yMin) / (yMax - yMin || 1)) * (p.y1 - p.y0);
    const c = hexToHsl(spec.accent);
    const slot = (p.x1 - p.x0) / data.length;
    return (
      <>
        {gridAndAxes(p, ticks, scaleY)}
        {pushYTicks(p, ticks, scaleY)}
        {data.map((d, i) => {
          const v = Number(d.value) || 0, yb = scaleY(v);
          const x = p.x0 + i * slot;
          labels.push({ id: `x:${i}`, text: d.label, x: x + slot / 2 + dep3 / 2, y: p.y1 + F * 1.3, anchor: "middle", size: F * 0.78, color: T.label });
          if (spec.showValues) labels.push({ id: `v:${i}`, text: String(v), x: x + slot / 2 + dep3 / 2, y: yb - F * 0.4 - dep3, anchor: "middle", size: F * 0.8, color: T.label });
          // histogram bars touch (no gap), thin separators
          if (dep3 > 0) return vBar3D(x + lineW, yb, slot - lineW * 2, p.y1, c, "hist", `h${i}`);
          return <rect key={i} x={x + lineW} y={yb} width={slot - lineW * 2} height={p.y1 - yb} fill={grad(c, "hist")} />;
        })}
      </>
    );
  }

  function renderLineArea() {
    const data = spec.data;
    const p = cartesianPlot();
    const isArea = type === "area";
    const { yMin, yMax, ticks } = yScaleFns(Math.max(...data.map(d => Number(d.value) || 0), 1));
    const scaleY = (v: number) => p.y1 - ((v - yMin) / (yMax - yMin || 1)) * (p.y1 - p.y0);
    const n = data.length;
    const pts = data.map((d, i) => ({ x: p.x0 + (n === 1 ? (p.x1 - p.x0) / 2 : (i / (n - 1)) * (p.x1 - p.x0)), y: scaleY(Number(d.value) || 0) }));
    const c = hexToHsl(spec.accent);
    const path = smoothPath(pts);
    const fillId = gradId(uid, "area");
    if (isArea) defs.push(
      <linearGradient key="area" id={fillId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={css(c)} stopOpacity={0.35} />
        <stop offset="100%" stopColor={css(c)} stopOpacity={0.02} />
      </linearGradient>,
    );
    data.forEach((d, i) => {
      labels.push({ id: `x:${i}`, text: d.label, x: pts[i].x, y: p.y1 + F * 1.3, anchor: "middle", size: F * 0.88, color: T.label });
      if (spec.showValues) labels.push({ id: `v:${i}`, text: String(Number(d.value) || 0), x: pts[i].x, y: pts[i].y - F * 0.75, anchor: "middle", size: F * 0.85, color: T.labelStrong, weight: 700 });
    });
    return (
      <>
        {gridAndAxes(p, ticks, scaleY)}
        {pushYTicks(p, ticks, scaleY)}
        {isArea && <path d={`${path} L${pts[n - 1].x},${p.y1} L${pts[0].x},${p.y1} Z`} fill={`url(#${fillId})`} />}
        {/* 3D: an extruded ribbon under the line gives it a solid depth */}
        {lineRibbon(pts, c, "lr")}
        <path d={path} fill="none" stroke={css(c)} strokeWidth={lineW * 2.6} strokeLinejoin="round" strokeLinecap="round" filter={shadow3D} />
        {pts.map((pt, i) => D3
          ? <circle key={i} cx={pt.x} cy={pt.y} r={F * 0.52} fill={sphere(c, "lmk")} />
          : <circle key={i} cx={pt.x} cy={pt.y} r={F * 0.42} fill="#fff" stroke={css(c)} strokeWidth={lineW * 1.6} />)}
      </>
    );
  }

  function renderMultiLine() {
    const series = spec.series || [];
    const p = cartesianPlot();
    const stacked = type === "stackedArea";
    const colTotals = cats.map((_, ci) => series.reduce((a, s) => a + (Number(s.values[ci]) || 0), 0));
    const maxV = stacked ? Math.max(...colTotals, 1) : Math.max(...series.flatMap(s => s.values.map(v => Number(v) || 0)), 1);
    const { yMin, yMax, ticks } = yScaleFns(maxV);
    const scaleY = (v: number) => p.y1 - ((v - yMin) / (yMax - yMin || 1)) * (p.y1 - p.y0);
    const n = cats.length;
    const xAt = (i: number) => p.x0 + (n === 1 ? (p.x1 - p.x0) / 2 : (i / (n - 1)) * (p.x1 - p.x0));
    const pal = categorical(spec.accent, series.length);
    cats.forEach((cat, ci) => labels.push({ id: `x:${ci}`, text: cat, x: xAt(ci), y: p.y1 + F * 1.3, anchor: "middle", size: F * 0.85, color: T.label }));
    const acc = cats.map(() => 0);
    return (
      <>
        {gridAndAxes(p, ticks, scaleY)}
        {pushYTicks(p, ticks, scaleY)}
        {series.map((s, si) => {
          const c = s.color ? hexToHsl(s.color) : pal[si];
          if (stacked) {
            const lower = cats.map((_, ci) => acc[ci]);
            cats.forEach((_, ci) => acc[ci] += Number(s.values[ci]) || 0);
            const upPts = cats.map((_, ci) => ({ x: xAt(ci), y: scaleY(acc[ci]) }));
            const loPts = cats.map((_, ci) => ({ x: xAt(ci), y: scaleY(lower[ci]) })).reverse();
            const fillId = gradId(uid, `sa${si}`);
            defs.push(<linearGradient key={`sa${si}`} id={fillId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={css(c)} stopOpacity={0.55} /><stop offset="100%" stopColor={css(c)} stopOpacity={0.25} /></linearGradient>);
            return <path key={si} d={`${smoothPath(upPts)} L${loPts.map(p2 => `${p2.x},${p2.y}`).join(" L")} Z`} fill={`url(#${fillId})`} stroke={css(c)} strokeWidth={lineW} />;
          }
          const pts = cats.map((_, ci) => ({ x: xAt(ci), y: scaleY(Number(s.values[ci]) || 0) }));
          return (
            <g key={si}>
              {lineRibbon(pts, c, `mlr${si}`)}
              <path d={smoothPath(pts)} fill="none" stroke={css(c)} strokeWidth={lineW * 2.4} strokeLinejoin="round" strokeLinecap="round" filter={shadow3D} />
              {pts.map((pt, i) => D3
                ? <circle key={i} cx={pt.x} cy={pt.y} r={F * 0.46} fill={sphere(c, `mmk${si}`)} />
                : <circle key={i} cx={pt.x} cy={pt.y} r={F * 0.36} fill="#fff" stroke={css(c)} strokeWidth={lineW * 1.4} />)}
            </g>
          );
        })}
      </>
    );
  }

  function renderCombo() {
    const series = spec.series || [];
    const p = cartesianPlot();
    const maxV = Math.max(...series.flatMap(s => s.values.map(v => Number(v) || 0)), 1);
    const { yMin, yMax, ticks } = yScaleFns(maxV);
    const scaleY = (v: number) => p.y1 - ((v - yMin) / (yMax - yMin || 1)) * (p.y1 - p.y0);
    const pal = categorical(spec.accent, series.length);
    const slot = (p.x1 - p.x0) / cats.length;
    const barSeries = series.filter(s => (s.kind ?? "bar") === "bar");
    cats.forEach((cat, ci) => labels.push({ id: `x:${ci}`, text: cat, x: p.x0 + ci * slot + slot / 2, y: p.y1 + F * 1.3, anchor: "middle", size: F * 0.88, color: T.label }));
    return (
      <>
        {gridAndAxes(p, ticks, scaleY)}
        {pushYTicks(p, ticks, scaleY)}
        {series.map((s, si) => {
          const c = s.color ? hexToHsl(s.color) : pal[si];
          const kind = s.kind ?? "bar";
          if (kind === "bar") {
            const innerW = slot * 0.5, bw = innerW / Math.max(1, barSeries.length);
            const bi = barSeries.indexOf(s);
            return cats.map((_, ci) => {
              const v = Number(s.values[ci]) || 0, yb = scaleY(v);
              const x = p.x0 + ci * slot + (slot - innerW) / 2 + bi * bw;
              if (dep3 > 0) return vBar3D(x + bw * 0.08, yb, bw * 0.84, p.y1, c, `cb${si}`, `${si}-${ci}`);
              return <path key={`${si}-${ci}`} d={roundedTopRect(x + bw * 0.08, yb, bw * 0.84, p.y1 - yb, bw * 0.2)} fill={grad(c, `cb${si}`)} />;
            });
          }
          const pts = cats.map((_, ci) => ({ x: p.x0 + ci * slot + slot / 2, y: scaleY(Number(s.values[ci]) || 0) }));
          return (
            <g key={si}>
              {lineRibbon(pts, c, `clr${si}`)}
              <path d={smoothPath(pts)} fill="none" stroke={css(c)} strokeWidth={lineW * 2.6} strokeLinejoin="round" strokeLinecap="round" filter={shadow3D} />
              {pts.map((pt, i) => D3
                ? <circle key={i} cx={pt.x} cy={pt.y} r={F * 0.5} fill={sphere(c, `cmk${si}`)} />
                : <circle key={i} cx={pt.x} cy={pt.y} r={F * 0.4} fill="#fff" stroke={css(c)} strokeWidth={lineW * 1.6} />)}
            </g>
          );
        })}
      </>
    );
  }

  function renderPie() {
    const data = spec.data;
    const areaW = legendSide === "right" ? plotRight : VW;
    // For 3D we tilt the disc (squash Y) and extrude a base, so reserve a little vertical room.
    const squash = spec.threeD ? 0.66 : 1;
    const cx = areaW / 2, cy = (top + bottom) / 2 - (spec.threeD ? F * 0.6 : 0);
    const r = Math.min(areaW, (bottom - top) / (spec.threeD ? 1.35 : 1)) * 0.46;
    const rInner = type === "donut" ? r * 0.6 : 0;
    const depth = spec.threeD ? r * 0.22 : 0;
    const total = data.reduce((s, d) => s + (Number(d.value) || 0), 0) || 1;
    const cols = categorical(spec.accent, data.length);
    const sy = (y: number) => cy + (y - cy) * squash;   // squash a y toward the centre line
    let ang = -Math.PI / 2;
    const slices = data.map((d, i) => {
      const frac = (Number(d.value) || 0) / total;
      const a0 = ang, a1 = ang + frac * Math.PI * 2; ang = a1;
      const c = d.color ? hexToHsl(d.color) : cols[i];
      return { d, i, a0, a1, mid: (a0 + a1) / 2, frac, pct: Math.round(frac * 100), c };
    });
    slices.forEach((s) => {
      if (spec.showValues && s.frac > 0.025) {
        const lr = rInner > 0 ? (rInner + r) / 2 : r * 0.64;
        const pt = polar(cx, cy, lr, s.mid);
        labels.push({ id: `seg:${s.i}`, text: s.d.customLabel ? tokenize(s.d.customLabel, s.d.label, Number(s.d.value) || 0, s.pct) : `${s.pct}%`, x: pt.x, y: sy(pt.y), anchor: "middle", baseline: "middle", size: F * 0.95, color: T.onAccent, weight: 700 });
      }
    });
    return (
      <g transform={spec.threeD ? `translate(${cx} ${cy}) scale(1 ${squash}) translate(${-cx} ${-cy})` : undefined}>
        {/* extruded base + side wall for depth */}
        {depth > 0 && slices.map((s) => <path key={`base${s.i}`} d={sectorPath(cx, cy + depth, r, rInner, s.a0, s.a1)} fill={css(darken(s.c, 26))} />)}
        {depth > 0 && slices.map((s) => <path key={`wall${s.i}`} d={`M${polar(cx, cy, r, s.a0).x},${polar(cx, cy, r, s.a0).y} L${polar(cx, cy, r, s.a0).x},${polar(cx, cy, r, s.a0).y + depth} A${r},${r} 0 ${s.a1 - s.a0 > Math.PI ? 1 : 0} 1 ${polar(cx, cy, r, s.a1).x},${polar(cx, cy, r, s.a1).y + depth} L${polar(cx, cy, r, s.a1).x},${polar(cx, cy, r, s.a1).y} Z`} fill={css(darken(s.c, 16))} />)}
        {/* top disc */}
        {slices.map((s) => <path key={s.i} d={sectorPath(cx, cy, r, rInner, s.a0, s.a1)} fill={grad(s.c, `pie${s.i}`)} stroke={T.onAccent} strokeWidth={lineW * 1.4} />)}
        {type === "donut" && (() => {
          const sum = data.reduce((a, d) => a + (Number(d.value) || 0), 0);
          labels.push({ id: "center", text: String(sum), x: cx, y: sy(cy - F * 0.1), anchor: "middle", baseline: "middle", size: F * 1.6, color: T.labelStrong, weight: 700 });
          labels.push({ id: "centerSub", text: "Total", x: cx, y: sy(cy + F * 1.1), anchor: "middle", baseline: "middle", size: F * 0.8, color: T.labelSoft });
          return null;
        })()}
      </g>
    );
  }

  function renderRadial() {
    const data = spec.data;
    const areaW = legendSide === "right" ? plotRight : VW;
    const cx = areaW / 2, cy = (top + bottom) / 2;
    const maxR = Math.min(areaW, bottom - top) * 0.44;
    const total = Math.max(...data.map(d => Number(d.value) || 0), 1);
    const cols = categorical(spec.accent, data.length);
    const ringW = maxR / (data.length + 1.2);
    return (
      <>
        {data.map((d, i) => {
          const rr = maxR - i * ringW * 1.12;
          const v = Number(d.value) || 0, frac = v / total;
          const c = d.color ? hexToHsl(d.color) : cols[i];
          const a0 = -Math.PI / 2, a1 = a0 + frac * Math.PI * 2;
          // category names come from the legend; show only the % at the ring's start
          if (!spec.showLegend) labels.push({ id: `x:${i}`, text: d.label, x: F * 1.0, y: cy - maxR + i * ringW * 1.12 + ringW * 0.4 + F * 0.3, anchor: "start", size: F * 0.7, color: T.label });
          if (spec.showValues) labels.push({ id: `v:${i}`, text: d.customLabel ? tokenize(d.customLabel, d.label, v, Math.round(frac * 100)) : `${Math.round(frac * 100)}%`, x: cx + 2, y: cy - rr + ringW * 0.35, anchor: "start", baseline: "middle", size: F * 0.7, color: T.labelStrong, weight: 700 });
          return (
            <g key={i}>
              {D3 && <path d={arcPath(cx, cy + dep3, rr, a0, a1)} fill="none" stroke={css(darken(c, 18))} strokeWidth={ringW * 0.78} strokeLinecap="round" />}
              <path d={arcPath(cx, cy, rr, 0, Math.PI * 2 - 0.001)} fill="none" stroke={T.track} strokeWidth={ringW * 0.78} strokeLinecap="round" />
              <path d={arcPath(cx, cy, rr, a0, a1)} fill="none" stroke={css(c)} strokeWidth={ringW * 0.78} strokeLinecap="round" filter={shadow3D} />
            </g>
          );
        })}
      </>
    );
  }

  function renderGauge() {
    const v = Number(spec.data[0]?.value) || 0;
    const max = spec.gaugeMax ?? niceCeil(v);
    const cx = VW / 2, cy = bottom - F * 0.5;
    const r = Math.min(VW * 0.42, (bottom - top) * 0.85);
    const a0 = Math.PI, a1 = 2 * Math.PI;              //半圆 left→right
    const frac = Math.max(0, Math.min(1, v / (max || 1)));
    const c = hexToHsl(spec.accent);
    const tickV = polar(cx, cy, r, a0 + frac * Math.PI);
    labels.push({ id: "v:0", text: spec.data[0]?.customLabel ? tokenize(spec.data[0].customLabel!, spec.data[0].label, v, Math.round(frac * 100)) : String(v), x: cx, y: cy - F * 0.6, anchor: "middle", size: F * 2.0, color: T.labelStrong, weight: 700 });
    labels.push({ id: "x:0", text: spec.data[0]?.label || "", x: cx, y: cy + F * 1.1, anchor: "middle", size: F * 0.9, color: T.labelSoft });
    labels.push({ id: "gmin", text: "0", x: cx - r, y: cy + F * 0.9, anchor: "middle", size: F * 0.7, color: T.labelSoft });
    labels.push({ id: "gmax", text: String(max), x: cx + r, y: cy + F * 0.9, anchor: "middle", size: F * 0.7, color: T.labelSoft });
    return (
      <>
        {D3 && <path d={arcPath(cx, cy + dep3, r, a0, a0 + frac * Math.PI)} fill="none" stroke={css(darken(c, 20))} strokeWidth={r * 0.18} strokeLinecap="round" />}
        <path d={arcPath(cx, cy, r, a0, a1)} fill="none" stroke={T.track} strokeWidth={r * 0.18} strokeLinecap="round" />
        <path d={arcPath(cx, cy, r, a0, a0 + frac * Math.PI)} fill="none" stroke={grad(c, "gauge", false)} strokeWidth={r * 0.18} strokeLinecap="round" filter={shadow3D} />
        {D3
          ? <circle cx={tickV.x} cy={tickV.y} r={r * 0.08} fill={sphere(c, "gknob")} />
          : <circle cx={tickV.x} cy={tickV.y} r={r * 0.06} fill="#fff" stroke={css(c)} strokeWidth={lineW * 2} />}
      </>
    );
  }

  function renderWaffle() {
    const data = spec.data;
    const total = data.reduce((s, d) => s + (Number(d.value) || 0), 0) || 1;
    const side = Math.min(VW * 0.62, bottom - top);
    const ox = (VW - side) / 2 - (spec.showLegend ? side * 0.28 : 0), oy = top + (bottom - top - side) / 2;
    const cell = side / 10, gap = cell * 0.14;
    const cols = categorical(spec.accent, data.length);
    // assign 100 cells proportionally
    const counts = data.map(d => Math.round((Number(d.value) || 0) / total * 100));
    const cellColors: string[] = [];
    data.forEach((d, i) => { for (let k = 0; k < counts[i]; k++) cellColors.push(d.color ? d.color : css(cols[i])); });
    while (cellColors.length < 100) cellColors.push(T.track);
    const rects: React.ReactNode[] = [];
    for (let idx = 0; idx < 100; idx++) {
      const row = Math.floor(idx / 10), col = idx % 10;
      const cx0 = ox + col * cell + gap / 2, cy0 = oy + (9 - row) * cell + gap / 2, cs = cell - gap;
      if (D3) {
        // small 3D tile: lighter top edge + darker right edge + face
        const d2 = cs * 0.22, fill = cellColors[idx];
        rects.push(
          <g key={idx}>
            <path d={`M${cx0},${cy0} L${cx0 + d2},${cy0 - d2} L${cx0 + cs + d2},${cy0 - d2} L${cx0 + cs},${cy0} Z`} fill={fill} opacity={0.55} />
            <path d={`M${cx0 + cs},${cy0} L${cx0 + cs + d2},${cy0 - d2} L${cx0 + cs + d2},${cy0 + cs - d2} L${cx0 + cs},${cy0 + cs} Z`} fill={fill} opacity={0.8} />
            <rect x={cx0} y={cy0} width={cs} height={cs} rx={cs * 0.18} fill={fill} />
          </g>,
        );
      } else {
        rects.push(<rect key={idx} x={cx0} y={cy0} width={cs} height={cs} rx={cs * 0.18} fill={cellColors[idx]} />);
      }
    }
    if (spec.showValues) data.forEach((d, i) => {
      const pct = Math.round((Number(d.value) || 0) / total * 100);
      labels.push({ id: `seg:${i}`, text: d.customLabel ? tokenize(d.customLabel, d.label, Number(d.value) || 0, pct) : `${d.label} ${pct}%`, x: ox + side + cell * 0.6, y: oy + cell + i * cell * 1.4, anchor: "start", baseline: "middle", size: F * 0.85, color: T.label });
    });
    return <>{rects}</>;
  }

  function renderFunnel() {
    const data = spec.data;
    const maxV = Math.max(...data.map(d => Number(d.value) || 0), 1);
    const cx = VW / 2;
    const fullW = Math.min(VW * 0.6, VW - F * 8);
    const x0 = cx - fullW / 2, x1 = cx + fullW / 2;
    const h = (bottom - top - F) / data.length, gap = h * 0.16;
    const cols = mono(spec.accent, data.length);
    const total = data.reduce((s, d) => s + (Number(d.value) || 0), 0) || 1;
    return (
      <>
        {data.map((d, i) => {
          const v = Number(d.value) || 0;
          const wTop = (v / maxV) * fullW;
          const nextV = i < data.length - 1 ? Number(data[i + 1].value) || 0 : v;
          const wBot = (nextV / maxV) * fullW;
          const y = top + F * 0.5 + i * h;
          const c = d.color ? hexToHsl(d.color) : cols[i];
          const xt0 = cx - wTop / 2, xt1 = cx + wTop / 2, xb0 = cx - wBot / 2, xb1 = cx + wBot / 2;
          const yb = y + h - gap;
          const pct = Math.round(v / total * 100);
          labels.push({ id: `x:${i}`, text: d.label, x: x0 - F * 0.6, y: y + (h - gap) / 2, anchor: "end", baseline: "middle", size: F * 0.82, color: T.label });
          if (spec.showValues) labels.push({ id: `v:${i}`, text: d.customLabel ? tokenize(d.customLabel, d.label, v, pct) : String(v), x: cx, y: y + (h - gap) / 2 - (dep3 ? dep3 / 2 : 0), anchor: "middle", baseline: "middle", size: F * 0.95, color: T.onAccent, weight: 700 });
          if (dep3 > 0) {
            // extruded slab: lighter top face + the front trapezoid
            return (
              <g key={i}>
                <path d={`M${xt0},${y} L${xt0 + dep3},${y - dep3} L${xt1 + dep3},${y - dep3} L${xt1},${y} Z`} fill={css(lighten(c, 8))} />
                <path d={`M${xt1},${y} L${xt1 + dep3},${y - dep3} L${xb1 + dep3},${yb - dep3} L${xb1},${yb} Z`} fill={css(darken(c, 20))} />
                <path d={`M${xt0},${y} L${xt1},${y} L${xb1},${yb} L${xb0},${yb} Z`} fill={grad(c, `fn${i}`)} />
              </g>
            );
          }
          return <path key={i} d={`M${xt0},${y} L${xt1},${y} L${xb1},${yb} L${xb0},${yb} Z`} fill={grad(c, `fn${i}`)} />;
        })}
      </>
    );
  }

  function renderRadar() {
    const series = spec.series || [];
    const axes = cats;
    const cx = VW / 2, cy = (top + bottom) / 2;
    const r = Math.min(VW, bottom - top) * 0.4;
    const maxV = Math.max(...series.flatMap(s => s.values.map(v => Number(v) || 0)), 1);
    const niceMax = niceCeil(maxV);
    const angAt = (i: number) => -Math.PI / 2 + (i / axes.length) * Math.PI * 2;
    const pal = categorical(spec.accent, series.length);
    const rings = 4;
    return (
      <>
        {/* web */}
        {Array.from({ length: rings }, (_, ri) => {
          const rr = r * ((ri + 1) / rings);
          const pts = axes.map((_, i) => polar(cx, cy, rr, angAt(i)));
          return <polygon key={`ring${ri}`} points={pts.map(p => `${p.x},${p.y}`).join(" ")} fill="none" stroke={T.grid} strokeWidth={lineW} />;
        })}
        {axes.map((ax, i) => {
          const pe = polar(cx, cy, r, angAt(i));
          const pl = polar(cx, cy, r + F * 0.9, angAt(i));
          labels.push({ id: `x:${i}`, text: ax, x: pl.x, y: pl.y, anchor: Math.abs(pl.x - cx) < 4 ? "middle" : pl.x > cx ? "start" : "end", baseline: "middle", size: F * 0.78, color: T.label });
          return <line key={`ax${i}`} x1={cx} y1={cy} x2={pe.x} y2={pe.y} stroke={T.grid} strokeWidth={lineW} />;
        })}
        {series.map((s, si) => {
          const c = s.color ? hexToHsl(s.color) : pal[si];
          const pts = axes.map((_, i) => polar(cx, cy, r * ((Number(s.values[i]) || 0) / niceMax), angAt(i)));
          return (
            <g key={si}>
              {D3 && <polygon points={pts.map(p => `${p.x},${p.y + dep3}`).join(" ")} fill={css(darken(c, 16))} fillOpacity={0.28} />}
              <polygon points={pts.map(p => `${p.x},${p.y}`).join(" ")} fill={css(c)} fillOpacity={0.18} stroke={css(c)} strokeWidth={lineW * 2} strokeLinejoin="round" filter={shadow3D} />
              {pts.map((p, i) => D3
                ? <circle key={i} cx={p.x} cy={p.y} r={F * 0.42} fill={sphere(c, `rmk${si}`)} />
                : <circle key={i} cx={p.x} cy={p.y} r={F * 0.3} fill={css(c)} />)}
            </g>
          );
        })}
      </>
    );
  }

  function renderScatter() {
    const points = spec.scatter || [];
    const p = cartesianPlot();
    const xs = points.map(pt => pt.x), ys = points.map(pt => pt.y);
    const xMax = niceCeil(Math.max(...xs, 1)), yMaxV = niceCeil(Math.max(...ys, 1));
    const { yMin, yMax, ticks } = yScaleFns(yMaxV);
    const scaleY = (v: number) => p.y1 - ((v - yMin) / (yMax - yMin || 1)) * (p.y1 - p.y0);
    const scaleX = (v: number) => p.x0 + (v / (xMax || 1)) * (p.x1 - p.x0);
    const c = hexToHsl(spec.accent);
    const xTicks = 5;
    return (
      <>
        {gridAndAxes(p, ticks, scaleY)}
        {pushYTicks(p, ticks, scaleY)}
        {Array.from({ length: xTicks + 1 }, (_, i) => {
          const xv = (xMax / xTicks) * i;
          labels.push({ id: `xt:${i}`, text: String(Math.round(xv)), x: scaleX(xv), y: p.y1 + F * 1.2, anchor: "middle", size: F * 0.72, color: T.labelSoft });
          return null;
        })}
        {points.map((pt, i) => {
          const cc = pt.color ? hexToHsl(pt.color) : c;
          const rr = type === "bubble" ? Math.max(F * 0.5, (pt.size || 10) / 2) : F * 0.55;
          const px = scaleX(pt.x), py = scaleY(pt.y);
          if (pt.label && spec.showValues) labels.push({ id: `pl:${i}`, text: pt.label, x: px, y: py - rr - F * 0.3, anchor: "middle", size: F * 0.72, color: T.label });
          if (D3) return (
            <g key={i}>
              <ellipse cx={px} cy={py + rr * 0.9} rx={rr * 0.85} ry={rr * 0.3} fill="rgba(15,23,42,0.22)" />
              <circle cx={px} cy={py} r={rr} fill={sphere(cc, `bub${i}`)} />
            </g>
          );
          return <circle key={i} cx={px} cy={py} r={rr} fill={css(cc)} fillOpacity={type === "bubble" ? 0.6 : 0.85} stroke={css(darken(cc, 10))} strokeWidth={lineW} />;
        })}
      </>
    );
  }

  function maxLabelW(strs: string[], size: number): number {
    return Math.min(VW * 0.32, Math.max(0, ...strs.map(s => s.length)) * size * 0.56);
  }
}
