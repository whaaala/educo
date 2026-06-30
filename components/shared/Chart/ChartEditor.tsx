"use client";

/**
 * ChartEditor — adaptive data/style panel for the reusable Chart.
 *
 * The panel reshapes itself to the chart type: single-series charts edit `data`,
 * multi-series charts edit `series` + `categories`, scatter/bubble edit `scatter`
 * points, the gauge edits a single value + max. Type switching seeds sensible data
 * for the new type while preserving styling.
 *
 * Surface-agnostic: hand it a ChartSpec and onUpdate and it works in the slide
 * editor, the work document, or anywhere.
 */

import React from "react";
import { createPortal } from "react-dom";
import {
  type ChartSpec, type ChartDatum, type ChartSeries, type ScatterPoint, type ChartTextStyle,
  type ChartType, CHART_TYPE_GROUPS, CHART_TYPE_LABELS,
  isMultiSeries, isScatter, isCircular, isCartesian, defaultChartData, defaultChartOptions,
} from "@/lib/chart-types";
import { categorical, hslToHex } from "./palette";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { FONT_OPTIONS } from "@/components/shared/TextFormatToolbar";
import {
  AlignLeft, AlignCenter, AlignRight,
  AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd,
} from "lucide-react";

const ic = "w-3.5 h-3.5";
const TITLE_ALIGN_ICON = {
  left: <AlignLeft className={ic} />, center: <AlignCenter className={ic} />, right: <AlignRight className={ic} />,
};
const TITLE_VALIGN_ICON = {
  top: <AlignVerticalJustifyStart className={ic} />, middle: <AlignVerticalJustifyCenter className={ic} />, bottom: <AlignVerticalJustifyEnd className={ic} />,
};

export default function ChartEditor({ spec, anchorRect, onUpdate, onClose }: {
  spec: ChartSpec;
  anchorRect: DOMRect;
  onUpdate: (patch: Partial<ChartSpec>) => void;
  onClose: () => void;
}) {
  if (typeof document === "undefined") return null;
  const type = spec.chartType;
  const font = spec.font || {};
  const multi = isMultiSeries(type);
  const scatter = isScatter(type);
  const circular = isCircular(type);
  const cartesian = isCartesian(type);

  // ── mutators ──
  const setDatum = (i: number, patch: Partial<ChartDatum>) => onUpdate({ data: spec.data.map((d, j) => j === i ? { ...d, ...patch } : d) });
  const addDatum = () => onUpdate({ data: [...spec.data, { label: `Item ${spec.data.length + 1}`, value: 10 }] });
  const removeDatum = (i: number) => onUpdate({ data: spec.data.length > 1 ? spec.data.filter((_, j) => j !== i) : spec.data });

  const cats = spec.categories || [];
  const series = spec.series || [];
  const setCat = (i: number, v: string) => onUpdate({ categories: cats.map((c, j) => j === i ? v : c) });
  const addCat = () => onUpdate({ categories: [...cats, `Cat ${cats.length + 1}`], series: series.map(s => ({ ...s, values: [...s.values, 0] })) });
  const removeCat = (i: number) => cats.length > 1 && onUpdate({ categories: cats.filter((_, j) => j !== i), series: series.map(s => ({ ...s, values: s.values.filter((_, j) => j !== i) })) });
  const setSeries = (i: number, patch: Partial<ChartSeries>) => onUpdate({ series: series.map((s, j) => j === i ? { ...s, ...patch } : s) });
  const setSeriesVal = (si: number, ci: number, v: number) => onUpdate({ series: series.map((s, j) => j === si ? { ...s, values: s.values.map((x, k) => k === ci ? v : x) } : s) });
  const addSeries = () => onUpdate({ series: [...series, { name: `Series ${series.length + 1}`, values: cats.map(() => 0), kind: type === "combo" ? "line" : undefined }] });
  const removeSeries = (i: number) => series.length > 1 && onUpdate({ series: series.filter((_, j) => j !== i) });

  const setPoint = (i: number, patch: Partial<ScatterPoint>) => onUpdate({ scatter: (spec.scatter || []).map((p, j) => j === i ? { ...p, ...patch } : p) });
  const addPoint = () => onUpdate({ scatter: [...(spec.scatter || []), { x: 50, y: 50, size: 16 }] });
  const removePoint = (i: number) => onUpdate({ scatter: (spec.scatter || []).filter((_, j) => j !== i) });

  const setFont = (patch: Partial<ChartTextStyle>) => onUpdate({ font: { ...font, ...patch } });

  const switchType = (t: ChartType) => {
    const seed = defaultChartData(t);
    const opts = defaultChartOptions(t);
    // Reseed data for the new type and clear per-label overrides (drags/sizes/colours)
    // — they were keyed to the old chart's labels and would otherwise leak across types.
    onUpdate({ chartType: t, labels: {}, ...opts, ...seed });
  };

  const total = spec.data.reduce((s, d) => s + (Number(d.value) || 0), 0) || 1;

  // ── positioning (always kept inside the viewport, responsive on small screens) ──
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const panelW = Math.min(300, vw - 16);
  // prefer right of the chart, else left, else clamp into view
  let left = anchorRect.right + 10;
  if (left + panelW > vw - 8) left = anchorRect.left - panelW - 10;
  if (left < 8) left = Math.max(8, Math.min(anchorRect.left, vw - panelW - 8));
  left = Math.max(8, Math.min(left, vw - panelW - 8));
  const maxH = Math.min(Math.round(vh * 0.88), vh - 16);
  const topPos = Math.max(8, Math.min(anchorRect.top, vh - maxH - 8));

  const inputCls = "flex-1 min-w-0 px-2 py-1 text-[12px] rounded-md border border-gray-200 dark:border-gray-600 midnight:border-gray-600 purple:border-purple-700 dark:bg-[#1a1d24] midnight:bg-[#10131a] purple:bg-[#241a33] dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-400";
  const numCls = "w-14 px-1.5 py-1 text-[12px] rounded-md border border-gray-200 dark:border-gray-600 midnight:border-gray-600 purple:border-purple-700 dark:bg-[#1a1d24] midnight:bg-[#10131a] purple:bg-[#241a33] dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-400 text-right flex-shrink-0";
  const chip = (active: boolean) => `px-2 py-1 text-[11px] rounded-md cursor-pointer transition-colors ${active ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#181c24] purple:bg-[#2c2140] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2f38]"}`;
  const lbl = "text-[10px] uppercase tracking-wide text-gray-400 font-semibold";

  return createPortal(
    <>
      <div className="fixed inset-0 z-[10000]" onMouseDown={onClose} />
      <div
        role="dialog" aria-label="Edit chart"
        className="fixed z-[10001] overflow-y-auto rounded-xl bg-white dark:bg-[#0f1115] midnight:bg-[#0b0e14] purple:bg-[#1c1430] shadow-2xl border border-gray-200 dark:border-gray-700 midnight:border-gray-700 purple:border-purple-800 p-3"
        style={{ top: topPos, left, width: panelW, maxHeight: maxH }}
        // The panel portals to <body>, so React would otherwise bubble these events to the
        // canvas's click-to-deselect handler and close the chart. Keep them inside the panel.
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-semibold text-gray-700 dark:text-gray-200">Edit chart</span>
          <button onClick={onClose} aria-label="Close chart editor" className="text-gray-400 hover:text-red-500 text-[14px] leading-none cursor-pointer">✕</button>
        </div>

        {/* Chart type picker, grouped */}
        {CHART_TYPE_GROUPS.map(g => (
          <div key={g.group} className="mb-1.5">
            <div className={`${lbl} mb-1`}>{g.group}</div>
            <div className="flex flex-wrap gap-1">
              {g.types.map(t => (
                <button key={t} className={chip(type === t)} aria-pressed={type === t} onClick={() => switchType(t)}>{CHART_TYPE_LABELS[t]}</button>
              ))}
            </div>
          </div>
        ))}

        {/* Option toggles */}
        <div className="flex flex-wrap gap-1 my-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-700">
          <button className={chip(!!spec.threeD)} onClick={() => onUpdate({ threeD: !spec.threeD })}>3D</button>
          {!scatter && type !== "radar" && <button className={chip(!!spec.showValues)} onClick={() => onUpdate({ showValues: !spec.showValues })}>Values</button>}
          {cartesian && <button className={chip(!!spec.showAxes)} onClick={() => onUpdate({ showAxes: !spec.showAxes })}>Axes</button>}
          {cartesian && <button className={chip(!!spec.showGrid)} onClick={() => onUpdate({ showGrid: !spec.showGrid })}>Grid</button>}
          {(circular || multi || type === "combo") && <button className={chip(!!spec.showLegend)} onClick={() => onUpdate({ showLegend: !spec.showLegend })}>Legend</button>}
        </div>

        <input className={`${inputCls} mb-1.5 w-full`} placeholder="Chart title (optional)" value={spec.title || ""} onChange={(e) => onUpdate({ title: e.target.value })} />
        <input className={`${inputCls} mb-1.5 w-full`} placeholder="Subtitle (optional)" value={spec.subtitle || ""} onChange={(e) => onUpdate({ subtitle: e.target.value })} />
        {/* Title/subtitle position — horizontal (left/center/right) + vertical (top/middle/bottom) */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-0.5" role="group" aria-label="Title horizontal position">
            {(["left", "center", "right"] as const).map(a => (
              <button key={a} className={chip((spec.titleAlign || "left") === a)} aria-label={`Title ${a}`} aria-pressed={(spec.titleAlign || "left") === a} onClick={() => onUpdate({ titleAlign: a })}>{TITLE_ALIGN_ICON[a]}</button>
            ))}
          </div>
          <span className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
          <div className="flex gap-0.5" role="group" aria-label="Title vertical position">
            {(["top", "middle", "bottom"] as const).map(v => (
              <button key={v} className={chip((spec.titleVAlign || "top") === v)} aria-label={`Title ${v}`} aria-pressed={(spec.titleVAlign || "top") === v} onClick={() => onUpdate({ titleVAlign: v })}>{TITLE_VALIGN_ICON[v]}</button>
            ))}
          </div>
        </div>

        {/* Whole-chart font — uses the SAME shared CustomDropdown + font list as the rest of the app */}
        <div className={`${lbl} mb-1`}>Font (all labels)</div>
        <div className="flex items-center gap-1 mb-1">
          <div className="flex-1 min-w-0">
            <CustomDropdown
              value={font.fontFamily || "Inter, sans-serif"}
              options={FONT_OPTIONS}
              onChange={(v) => setFont({ fontFamily: String(v) })}
            />
          </div>
          <div className="w-20 flex-shrink-0">
            <CustomDropdown
              value={font.fontSize ?? 1}
              options={[0.7, 0.85, 1, 1.15, 1.3, 1.5].map(s => ({ label: `${Math.round(s * 100)}%`, value: s }))}
              onChange={(v) => setFont({ fontSize: Number(v) })}
            />
          </div>
        </div>
        <div className="flex items-center gap-1 mb-3">
          <button className={chip(!!font.bold)} aria-label="Bold all labels" onClick={() => setFont({ bold: !font.bold })} style={{ fontWeight: 700 }}>B</button>
          <button className={chip(!!font.italic)} aria-label="Italic all labels" onClick={() => setFont({ italic: !font.italic })} style={{ fontStyle: "italic" }}>I</button>
          <input type="color" aria-label="Label colour" className="w-7 h-7 p-0 border-0 rounded cursor-pointer bg-transparent" value={font.color || "#334155"} onChange={(e) => setFont({ color: e.target.value })} />
          <span className="text-[10px] text-gray-400">Tip: click any label on the chart to style or drag it.</span>
        </div>

        {/* Y-axis override (cartesian) */}
        {cartesian && (
          <div className="mb-3">
            <div className={`${lbl} mb-1`}>Y-axis (blank = auto)</div>
            <div className="flex items-center gap-1">
              <input className={numCls} type="number" placeholder="min" aria-label="Y min" value={spec.yMin ?? ""} onChange={(e) => onUpdate({ yMin: e.target.value === "" ? undefined : Number(e.target.value) })} />
              <input className={numCls} type="number" placeholder="max" aria-label="Y max" value={spec.yMax ?? ""} onChange={(e) => onUpdate({ yMax: e.target.value === "" ? undefined : Number(e.target.value) })} />
              <input className={numCls} type="number" placeholder="step" aria-label="Y step" value={spec.yStep ?? ""} onChange={(e) => onUpdate({ yStep: e.target.value === "" ? undefined : Number(e.target.value) })} />
            </div>
          </div>
        )}

        {/* ── Data section, per shape ── */}
        {type === "gauge" ? (
          <>
            <div className={`${lbl} mb-1`}>Gauge</div>
            <div className="flex items-center gap-1 mb-1">
              <input className={inputCls} aria-label="Gauge label" value={spec.data[0]?.label || ""} onChange={(e) => setDatum(0, { label: e.target.value })} placeholder="Label" />
              <input className={numCls} type="number" aria-label="Gauge value" value={spec.data[0]?.value ?? 0} onChange={(e) => setDatum(0, { value: Number(e.target.value) })} />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-gray-400">Max</span>
              <input className={numCls} type="number" aria-label="Gauge max" value={spec.gaugeMax ?? 100} onChange={(e) => onUpdate({ gaugeMax: Number(e.target.value) })} />
            </div>
          </>
        ) : scatter ? (
          <>
            <div className={`${lbl} mb-1`}>Points (x, y{type === "bubble" ? ", size" : ""})</div>
            <div className="space-y-1.5">
              {(spec.scatter || []).map((pt, i) => (
                <div key={i} className="flex items-center gap-1">
                  {type === "bubble" && <input className={`${inputCls} text-[11px]`} aria-label={`Point ${i + 1} label`} value={pt.label || ""} onChange={(e) => setPoint(i, { label: e.target.value })} placeholder="label" />}
                  <input className={numCls} type="number" aria-label={`Point ${i + 1} x`} value={pt.x} onChange={(e) => setPoint(i, { x: Number(e.target.value) })} />
                  <input className={numCls} type="number" aria-label={`Point ${i + 1} y`} value={pt.y} onChange={(e) => setPoint(i, { y: Number(e.target.value) })} />
                  {type === "bubble" && <input className={numCls} type="number" aria-label={`Point ${i + 1} size`} value={pt.size ?? 16} onChange={(e) => setPoint(i, { size: Number(e.target.value) })} />}
                  <button onClick={() => removePoint(i)} aria-label={`Remove point ${i + 1}`} className="text-gray-300 hover:text-red-500 text-[13px] px-0.5 cursor-pointer flex-shrink-0">✕</button>
                </div>
              ))}
            </div>
            <button onClick={addPoint} className="mt-2 w-full py-1 text-[12px] rounded-md border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-[#22262e] cursor-pointer">+ Add point</button>
          </>
        ) : multi ? (
          <>
            <div className={`${lbl} mb-1`}>Categories (X axis)</div>
            <div className="flex flex-wrap gap-1 mb-2">
              {cats.map((c, i) => (
                <div key={i} className="flex items-center gap-0.5 bg-gray-100 dark:bg-[#22262e] rounded-md pl-1">
                  <input className="w-16 bg-transparent text-[11px] px-1 py-0.5 outline-none dark:text-gray-100" aria-label={`Category ${i + 1}`} value={c} onChange={(e) => setCat(i, e.target.value)} />
                  <button onClick={() => removeCat(i)} aria-label={`Remove category ${i + 1}`} className="text-gray-300 hover:text-red-500 text-[11px] px-1 cursor-pointer">✕</button>
                </div>
              ))}
              <button onClick={addCat} aria-label="Add category" className="text-[11px] px-2 py-0.5 rounded-md border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 cursor-pointer">+</button>
            </div>
            <div className={`${lbl} mb-1`}>Series</div>
            <div className="space-y-2">
              {series.map((s, si) => {
                const pal = categorical(spec.accent, series.length)[si];
                return (
                  <div key={si} className="border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 space-y-1">
                    <div className="flex items-center gap-1">
                      <input type="color" aria-label={`Series ${si + 1} colour`} className="w-6 h-6 p-0 border-0 rounded cursor-pointer flex-shrink-0 bg-transparent" value={s.color || hslToHex(pal.h, pal.s, pal.l)} onChange={(e) => setSeries(si, { color: e.target.value })} />
                      <input className={inputCls} aria-label={`Series ${si + 1} name`} value={s.name} onChange={(e) => setSeries(si, { name: e.target.value })} placeholder="Series name" />
                      {type === "combo" && (
                        <select aria-label={`Series ${si + 1} kind`} className="w-16 px-1 py-1 text-[11px] rounded-md border border-gray-200 dark:border-gray-600 dark:bg-[#1a1d24] dark:text-gray-100" value={s.kind || "bar"} onChange={(e) => setSeries(si, { kind: e.target.value as ChartSeries["kind"] })}>
                          <option value="bar">Bar</option><option value="line">Line</option><option value="area">Area</option>
                        </select>
                      )}
                      <button onClick={() => removeSeries(si)} aria-label={`Remove series ${si + 1}`} className="text-gray-300 hover:text-red-500 text-[13px] px-0.5 cursor-pointer flex-shrink-0">✕</button>
                    </div>
                    <div className="flex flex-wrap gap-1 pl-7">
                      {cats.map((c, ci) => (
                        <div key={ci} className="flex flex-col items-center">
                          <span className="text-[9px] text-gray-400">{c.slice(0, 4)}</span>
                          <input className="w-11 px-1 py-0.5 text-[11px] text-right rounded border border-gray-200 dark:border-gray-600 dark:bg-[#1a1d24] dark:text-gray-100" aria-label={`Series ${si + 1} ${c}`} type="number" value={s.values[ci] ?? 0} onChange={(e) => setSeriesVal(si, ci, Number(e.target.value))} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={addSeries} className="mt-2 w-full py-1 text-[12px] rounded-md border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-[#22262e] cursor-pointer">+ Add series</button>
          </>
        ) : (
          <>
            {/* Horizontal bar charts put the categories on the Y axis, vertical charts on the X axis. */}
            <div className={`${lbl} mb-1`}>{circular ? "Segments" : type === "bar" ? "Data (Y axis)" : "Data (X axis)"}</div>
            <div className="space-y-2">
              {spec.data.map((d, i) => {
                const pal = categorical(spec.accent, spec.data.length)[i];
                return (
                  <div key={i} className="space-y-1 border-b border-gray-100 dark:border-gray-700 pb-1.5 last:border-0">
                    <div className="flex items-center gap-1">
                      <input type="color" aria-label={`Item ${i + 1} colour`} className="w-6 h-6 p-0 border-0 rounded cursor-pointer flex-shrink-0 bg-transparent" value={d.color || hslToHex(pal.h, pal.s, pal.l)} onChange={(e) => setDatum(i, { color: e.target.value })} />
                      <input className={inputCls} aria-label={`Item ${i + 1} label`} value={d.label} onChange={(e) => setDatum(i, { label: e.target.value })} placeholder="Label" />
                      <input className={numCls} type="number" aria-label={`Item ${i + 1} value`} value={d.value} onChange={(e) => setDatum(i, { value: Number(e.target.value) })} />
                      {circular && <span className="text-[10px] text-gray-400 w-7 text-right flex-shrink-0">{Math.round((Number(d.value) || 0) / total * 100)}%</span>}
                      <button onClick={() => removeDatum(i)} aria-label={`Remove item ${i + 1}`} className="text-gray-300 hover:text-red-500 text-[13px] px-0.5 cursor-pointer flex-shrink-0">✕</button>
                    </div>
                    <input className={`${inputCls} w-full text-[11px]`} aria-label={`Item ${i + 1} custom label`} value={d.customLabel || ""} onChange={(e) => setDatum(i, { customLabel: e.target.value })} placeholder="Label text — e.g. Sales {percent}%" />
                  </div>
                );
              })}
            </div>
            <button onClick={addDatum} className="mt-2 w-full py-1 text-[12px] rounded-md border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-[#22262e] cursor-pointer">+ Add {circular ? "segment" : "data point"}</button>
          </>
        )}
      </div>
    </>,
    document.body,
  );
}
