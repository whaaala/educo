"use client";

/**
 * Properties panel for the selected BoxNode. Containers expose their layout engine (flex/grid) and
 * all layout + background controls; elements expose content/type styling. Reuses the shared matrix
 * ColorPickerPopover (portalled) for every colour, so backgrounds/overlays match the rest of Educo.
 */

import { useRef } from "react";
import { Rows3, Columns3, Grid3x3, Upload, Trash2, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import type { SiteTheme } from "@/lib/site-storage";
import type { BoxNode, FlexAlign, FlexJustify } from "@/lib/box-model";
import { isContainer } from "@/lib/box-model";
import { ColorPickerPopover, colorToCSS } from "@/components/shared/ColorPalettePicker";

const inputCls = "w-full text-sm px-2.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-transparent text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none";
const label = "text-[11px] font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300";
const section = "text-[11px] font-semibold uppercase tracking-wide text-gray-400 pt-1";
const seg = "flex-1 flex items-center justify-center gap-1 py-1.5 text-xs rounded-md";

function Range({ title, value, min, max, fallback, onChange, unit = "px" }: { title: string; value?: number; min: number; max: number; fallback: number; onChange: (n: number) => void; unit?: string }) {
  const v = value ?? fallback;
  return <label className="block"><span className={label}>{title}: {v}{unit}</span><input type="range" min={min} max={max} value={v} onChange={(e) => onChange(Number(e.target.value))} aria-label={title} className="w-full mt-1" /></label>;
}

function ColorRow({ title, value, fallback, onSelect, mode = "matrix" }: { title: string; value?: string; fallback: string; onSelect: (c: string) => void; mode?: "matrix" | "both" }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className={label}>{title}</span>
      <ColorPickerPopover selectedColor={value || fallback} onSelect={onSelect} mode={mode} label={title} align="right" width={272} portal>
        <button aria-label={title} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm" style={{ background: colorToCSS(value || fallback) }} />
      </ColorPickerPopover>
    </div>
  );
}

/** Width control: Auto / Fill / Custom (% or px). */
function WidthControl({ node, onPatch }: { node: BoxNode; onPatch: (p: Partial<BoxNode>) => void }) {
  const w = node.width ?? "auto";
  const isCustom = w !== "auto" && w !== "fill";
  return (
    <div className="space-y-1.5">
      <span className={label}>Width</span>
      <div className="flex gap-1 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700">
        {(["auto", "fill"] as const).map((opt) => (
          <button key={opt} onClick={() => onPatch({ width: opt })} className={`${seg} ${w === opt ? "bg-indigo-600 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>{opt === "auto" ? "Auto" : "Fill"}</button>
        ))}
        <button onClick={() => onPatch({ width: isCustom ? w : "50%" })} className={`${seg} ${isCustom ? "bg-indigo-600 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>Custom</button>
      </div>
      {isCustom && <input value={w} onChange={(e) => onPatch({ width: e.target.value })} placeholder="50% or 240px" aria-label="Custom width" className={inputCls} />}
    </div>
  );
}

/** Spacing control: a general "all sides" slider plus four per-side inputs (Top/Right/Bottom/Left)
 *  that override the general value. Used for both padding and margin. */
function SideSpacing({ title, node, base, sides, onPatch, max = 96 }: {
  title: string; node: BoxNode; base: keyof BoxNode; sides: [keyof BoxNode, keyof BoxNode, keyof BoxNode, keyof BoxNode]; onPatch: (p: Partial<BoxNode>) => void; max?: number;
}) {
  const g = (node[base] as number | undefined) ?? 0;
  const set = (k: keyof BoxNode, v: string) => onPatch({ [k]: v === "" ? undefined : Number(v) } as Partial<BoxNode>);
  const [t, r, b, l] = sides;
  return (
    <div className="space-y-1.5">
      <label className="block"><span className={label}>{title}: {g}px (all sides)</span>
        <input type="range" min={0} max={max} value={g} onChange={(e) => set(base, e.target.value)} aria-label={`${title} all sides`} className="w-full mt-1" />
      </label>
      <div className="grid grid-cols-4 gap-1">
        {([["Top", t], ["Right", r], ["Bottom", b], ["Left", l]] as const).map(([lab, key]) => (
          <label key={lab} className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] uppercase tracking-wide text-gray-400">{lab}</span>
            <input type="number" min={0} value={(node[key] as number | undefined) ?? ""} placeholder={String(g)} onChange={(e) => set(key, e.target.value)} aria-label={`${title} ${lab.toLowerCase()}`} className="w-full text-xs px-1 py-1 rounded border border-gray-200 dark:border-gray-700 bg-transparent text-center outline-none focus:ring-1 focus:ring-indigo-400" />
          </label>
        ))}
      </div>
    </div>
  );
}

export default function BoxInspector({ node, theme, onPatch }: {
  node: BoxNode;
  theme: SiteTheme;
  onPatch: (patch: Partial<BoxNode>) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const container = isContainer(node);
  const isGrid = node.layout === "grid";

  return (
    <div className="p-4 space-y-3">
      <div className="text-[11px] text-gray-400">Editing a <b>{container ? (isGrid ? "Grid" : node.direction === "row" ? "Row" : "Stack") : node.type}</b> block.</div>

      {/* ── Layout (containers) ── */}
      {container && (
        <>
          <div className={section}>Layout</div>
          <div className="flex gap-1 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700">
            <button onClick={() => onPatch({ layout: "flex" })} className={`${seg} ${!isGrid ? "bg-indigo-600 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}><Columns3 className="w-3.5 h-3.5" /> Flex</button>
            <button onClick={() => onPatch({ layout: "grid" })} className={`${seg} ${isGrid ? "bg-indigo-600 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}><Grid3x3 className="w-3.5 h-3.5" /> Grid</button>
          </div>

          {isGrid ? (
            <Range title="Columns" value={node.columns} min={1} max={6} fallback={3} onChange={(n) => onPatch({ columns: n })} unit="" />
          ) : (
            <>
              <div className="flex gap-1 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700">
                <button onClick={() => onPatch({ direction: "column" })} className={`${seg} ${node.direction !== "row" ? "bg-indigo-600 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}><Rows3 className="w-3.5 h-3.5" /> Stack</button>
                <button onClick={() => onPatch({ direction: "row" })} className={`${seg} ${node.direction === "row" ? "bg-indigo-600 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}><Columns3 className="w-3.5 h-3.5" /> Row</button>
              </div>
              <label className="block"><span className={label}>Justify (main axis)</span>
                <select value={node.justify ?? "start"} onChange={(e) => onPatch({ justify: e.target.value as FlexJustify })} className={inputCls}>
                  {["start", "center", "end", "between", "around"].map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><input type="checkbox" checked={!!node.wrap} onChange={(e) => onPatch({ wrap: e.target.checked })} /> Wrap to next line</label>
            </>
          )}
          <label className="block"><span className={label}>Align (cross axis)</span>
            <select value={node.align ?? "stretch"} onChange={(e) => onPatch({ align: e.target.value as FlexAlign })} className={inputCls}>
              {["stretch", "start", "center", "end"].map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
          <Range title="Gap (between children)" value={node.gap} min={0} max={64} fallback={16} onChange={(n) => onPatch({ gap: n })} />
          <SideSpacing title="Padding (inside)" node={node} base="padding" sides={["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]} onPatch={onPatch} />
        </>
      )}
      <SideSpacing title="Margin (outside)" node={node} base="margin" sides={["marginTop", "marginRight", "marginBottom", "marginLeft"]} onPatch={onPatch} />

      {/* ── Size ── */}
      <div className={section}>Size</div>
      <WidthControl node={node} onPatch={onPatch} />
      <label className="block"><span className={label}>Height</span>
        <input value={node.height ?? ""} onChange={(e) => onPatch({ height: e.target.value || undefined })} placeholder="auto, 320px or fill" aria-label="Height" className={inputCls} />
      </label>
      <Range title="Corner radius" value={node.radius} min={0} max={40} fallback={0} onChange={(n) => onPatch({ radius: n })} />
      <Range title="Opacity" value={node.opacity} min={0} max={100} fallback={100} onChange={(n) => onPatch({ opacity: n })} unit="%" />

      {/* ── Background ── */}
      <div className={section}>Background</div>
      <ColorRow title="Fill (colour / gradient)" value={node.background} fallback={theme.surface} onSelect={(c) => onPatch({ background: c })} mode="both" />
      <button onClick={() => fileRef.current?.click()} className="w-full flex items-center justify-center gap-2 text-sm px-3 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-200"><Upload className="w-3.5 h-3.5" /> {node.bgImage ? "Replace background image" : "Background image"}</button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" aria-label="Upload background image" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => onPatch({ bgImage: String(r.result) }); r.readAsDataURL(f); e.target.value = ""; }} />
      {node.bgImage && (
        <>
          <div className="flex gap-1 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700">
            {(["cover", "contain"] as const).map((s) => <button key={s} onClick={() => onPatch({ bgSize: s })} className={`${seg} ${(node.bgSize ?? "cover") === s ? "bg-indigo-600 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>{s}</button>)}
          </div>
          <ColorRow title="Image overlay" value={node.bgOverlay} fallback="#00000066" onSelect={(c) => onPatch({ bgOverlay: c })} mode="both" />
          <button onClick={() => onPatch({ bgImage: undefined, bgOverlay: undefined })} className="text-[11px] text-red-500 hover:underline">Remove background image</button>
        </>
      )}

      {/* ── Element content ── */}
      {!container && (
        <>
          <div className={section}>Content</div>
          {node.type !== "image" && (
            <label className="block"><span className={label}>Text</span>
              <textarea value={node.text ?? ""} onChange={(e) => onPatch({ text: e.target.value })} rows={2} className={inputCls} />
            </label>
          )}
          {node.type === "button" && (
            <label className="block"><span className={label}>Link (URL)</span>
              <input value={node.href ?? ""} onChange={(e) => onPatch({ href: e.target.value })} placeholder="https://…" className={inputCls} />
            </label>
          )}
          {node.type !== "image" && (
            <>
              <Range title="Font size" value={node.fontSize} min={10} max={72} fallback={node.type === "heading" ? 32 : 16} onChange={(n) => onPatch({ fontSize: n })} />
              <ColorRow title="Text colour" value={node.color} fallback={theme.text} onSelect={(c) => onPatch({ color: c })} />
              <div className="flex items-center justify-between">
                <span className={label}>Align</span>
                <div className="flex gap-1">
                  {([["left", AlignLeft], ["center", AlignCenter], ["right", AlignRight]] as const).map(([a, Icon]) => (
                    <button key={a} onClick={() => onPatch({ textAlign: a })} aria-label={`Align ${a}`} className={`p-1.5 rounded-md ${(node.textAlign ?? "left") === a ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}><Icon className="w-4 h-4" /></button>
                  ))}
                </div>
              </div>
              {node.type === "heading" && <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><input type="checkbox" checked={node.bold ?? true} onChange={(e) => onPatch({ bold: e.target.checked })} /> Bold</label>}
            </>
          )}
        </>
      )}
    </div>
  );
}
