"use client";

/**
 * Properties panel for the selected BoxNode. Containers expose their layout engine (flex/grid) and
 * all layout + background controls; elements expose content/type styling. Reuses the shared matrix
 * ColorPickerPopover (portalled) for every colour, so backgrounds/overlays match the rest of Educo.
 */

import { useRef } from "react";
import { Plus, Rows3, Columns3, Grid3x3, Upload, Trash2, AlignLeft, AlignCenter, AlignRight, Layers, Move, BringToFront, SendToBack, ChevronUp, ChevronDown, Italic, Underline } from "lucide-react";
import type { SiteTheme } from "@/lib/site-storage";
import { FONT_CHOICES } from "@/lib/site-storage";
import type { BoxNode, FlexAlign, FlexJustify } from "@/lib/box-model";
import { isContainer, isFloating } from "@/lib/box-model";
import { ICON_SET, ICON_NAMES } from "./icons";

const SHADOWS = ["none", "sm", "md", "lg", "xl"] as const;
const FONT_LABEL = (f: string) => f.replace(/['"]/g, "").split(",")[0];
import { ColorPickerPopover, colorToCSS } from "@/components/shared/ColorPalettePicker";

const inputCls = "w-full text-sm px-2.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-transparent text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none";
const label = "text-[11px] font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300";
const section = "text-[11px] font-semibold uppercase tracking-wide text-gray-400 pt-1";
const seg = "flex-1 flex items-center justify-center gap-1 py-1.5 text-xs rounded-md";

// Stored sizes are in "px at base 10"; the base unit ≈ 10px, so REM (relative to the base) = value / 10.
const toRem = (px: number) => +(px / 10).toFixed(2);
const fromRem = (rem: number) => Math.round(rem * 10);

function Range({ title, value, min, max, fallback, onChange, unit = "px" }: { title: string; value?: number; min: number; max: number; fallback: number; onChange: (n: number) => void; unit?: string }) {
  const v = value ?? fallback;
  const disp = unit === "rem" ? `${toRem(v)}rem` : `${v}${unit}`; // rem = relative to the root base (responsive)
  return <label className="block"><span className={label}>{title}: {disp}</span><input type="range" min={min} max={max} value={v} onChange={(e) => onChange(Number(e.target.value))} aria-label={title} className="w-full mt-1" /></label>;
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
  const setPx = (k: keyof BoxNode, px: number) => onPatch({ [k]: px } as Partial<BoxNode>);
  const setRem = (k: keyof BoxNode, v: string) => onPatch({ [k]: v === "" ? undefined : fromRem(Number(v)) } as Partial<BoxNode>);
  const [t, r, b, l] = sides;
  return (
    <div className="space-y-1.5">
      <label className="block"><span className={label}>{title}: {toRem(g)}rem (all sides)</span>
        <input type="range" min={0} max={max} value={g} onChange={(e) => setPx(base, Number(e.target.value))} aria-label={`${title} all sides`} className="w-full mt-1" />
      </label>
      <div className="grid grid-cols-4 gap-1">
        {([["Top", t], ["Right", r], ["Bottom", b], ["Left", l]] as const).map(([lab, key]) => (
          <label key={lab} className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] uppercase tracking-wide text-gray-400">{lab}</span>
            <input type="number" step={0.1} min={0} value={node[key] !== undefined ? toRem(node[key] as number) : ""} placeholder={String(toRem(g))} onChange={(e) => setRem(key, e.target.value)} aria-label={`${title} ${lab.toLowerCase()} (rem)`} className="w-full text-xs px-1 py-1 rounded border border-gray-200 dark:border-gray-700 bg-transparent text-center outline-none focus:ring-1 focus:ring-indigo-400" />
          </label>
        ))}
      </div>
      <p className="text-[9px] text-gray-400 text-right -mt-0.5">values in rem (relative to the base)</p>
    </div>
  );
}

export default function BoxInspector({ node, theme, onPatch, onAddChild, onFloat, onUnfloat, onLayer, canFloat = true, inGrid = false, breakpoint = "base", overridden = false, onResetOverride, pages, currentPageId }: {
  node: BoxNode;
  theme: SiteTheme;
  onPatch: (patch: Partial<BoxNode>) => void;
  onAddChild?: () => void;
  onFloat?: () => void;          // lift this box out of the flow onto a free-floating layer
  onUnfloat?: () => void;        // dock it back into the flow
  onLayer?: (dir: "front" | "forward" | "backward" | "back") => void; // change stacking order among floating siblings
  canFloat?: boolean;            // false for the page root (nothing to float within)
  inGrid?: boolean;              // this box sits inside a GRID parent → expose column/row span
  breakpoint?: "base" | "tablet" | "mobile"; // which responsive breakpoint is being edited
  overridden?: boolean;          // does this box have an override at the current (non-base) breakpoint?
  onResetOverride?: () => void;  // clear this box's overrides at the current breakpoint
  pages?: { id: string; name: string }[]; // other pages, for link-to-page
  currentPageId?: string;        // the page being edited (excluded from the link-to-page list)
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const container = isContainer(node);
  const isGrid = node.layout === "grid";
  const floating = isFloating(node);
  const textual = node.type === "text" || node.type === "heading" || node.type === "button" || node.type === "list";

  return (
    <div className="p-4 space-y-3">
      <div className="text-[11px] text-gray-400">Editing a <b>{container ? (isGrid ? "Grid" : node.direction === "row" ? "Row" : "Section") : node.type}</b> block.</div>

      {/* Responsive banner: at tablet/mobile, edits create overrides for THAT size only (content stays shared). */}
      {breakpoint !== "base" && (
        <div className="rounded-lg border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 p-2 space-y-1.5">
          <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">Editing {breakpoint === "mobile" ? "Mobile" : "Tablet"} — size &amp; layout changes here apply only to this screen.</div>
          {overridden && onResetOverride && (
            <button onClick={onResetOverride} className="text-[11px] text-amber-700 dark:text-amber-300 underline hover:no-underline">Reset {breakpoint} overrides to base</button>
          )}
        </div>
      )}
      <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><input type="checkbox" checked={!!node.hidden} onChange={(e) => onPatch({ hidden: e.target.checked || undefined })} /> Hidden {breakpoint === "base" ? "everywhere" : `on ${breakpoint}`}</label>

      {container && onAddChild && (
        <button onClick={onAddChild} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700">
          <Plus className="w-4 h-4" /> Add section inside
        </button>
      )}

      {/* ── Position: in-flow (stacks, never overlaps) vs floating (its own layer, free to overlap) ── */}
      {canFloat && (
        <>
          <div className={section}>Position</div>
          <div className="flex gap-1 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700" role="group" aria-label="Position mode">
            <button onClick={() => onUnfloat?.()} aria-pressed={!floating} className={`${seg} ${!floating ? "bg-indigo-600 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}><Rows3 className="w-3.5 h-3.5" /> In-flow</button>
            <button onClick={() => onFloat?.()} aria-pressed={floating} className={`${seg} ${floating ? "bg-indigo-600 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}><Layers className="w-3.5 h-3.5" /> Floating</button>
          </div>
          {floating && (
            <>
              <p className="text-[10px] text-gray-400 flex items-start gap-1"><Move className="w-3 h-3 mt-0.5 shrink-0" /> Drag it anywhere to overlap other sections. Arrow keys nudge (Shift = bigger); Ctrl+] / Ctrl+[ change layer.</p>
              <div className="grid grid-cols-2 gap-2">
                {([["X", "left"], ["Y", "top"]] as const).map(([lab, key]) => (
                  <label key={key} className="flex flex-col gap-0.5"><span className={label}>{lab} (%)</span>
                    <input type="number" step={0.5} value={node[key] !== undefined ? Math.round((node[key] as number) * 10) / 10 : 0} onChange={(e) => onPatch({ [key]: Number(e.target.value) })} aria-label={`${lab} position (percent)`} className={inputCls} />
                  </label>
                ))}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className={label}>Layer <span className="text-gray-400 tabular-nums">({node.zIndex ?? 1})</span></span>
                <div className="flex gap-1">
                  <button onClick={() => onLayer?.("back")} aria-label="Send to back" title="Send to back" className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"><SendToBack className="w-4 h-4" /></button>
                  <button onClick={() => onLayer?.("backward")} aria-label="Send backward" title="Send backward (one layer)" className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronDown className="w-4 h-4" /></button>
                  <button onClick={() => onLayer?.("forward")} aria-label="Bring forward" title="Bring forward (one layer)" className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronUp className="w-4 h-4" /></button>
                  <button onClick={() => onLayer?.("front")} aria-label="Bring to front" title="Bring to front" className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"><BringToFront className="w-4 h-4" /></button>
                </div>
              </div>
            </>
          )}
        </>
      )}

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
          <Range title="Gap (between children)" value={node.gap} min={0} max={64} fallback={16} onChange={(n) => onPatch({ gap: n })} unit="rem" />
          <SideSpacing title="Padding (inside)" node={node} base="padding" sides={["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]} onPatch={onPatch} />
        </>
      )}
      <SideSpacing title="Margin (outside)" node={node} base="margin" sides={["marginTop", "marginRight", "marginBottom", "marginLeft"]} onPatch={onPatch} />

      {/* ── Grid cell (when the parent is a grid) ── */}
      {inGrid && (
        <>
          <div className={section}>Grid cell</div>
          <div className="grid grid-cols-2 gap-2">
            <label className="block"><span className={label}>Column span</span>
              <input type="number" min={1} max={12} value={node.colSpan ?? 1} onChange={(e) => onPatch({ colSpan: Math.max(1, Number(e.target.value) || 1) })} aria-label="Column span" className={inputCls} />
            </label>
            <label className="block"><span className={label}>Row span</span>
              <input type="number" min={1} max={12} value={node.rowSpan ?? 1} onChange={(e) => onPatch({ rowSpan: Math.max(1, Number(e.target.value) || 1) })} aria-label="Row span" className={inputCls} />
            </label>
          </div>
        </>
      )}

      {/* ── Size ── */}
      <div className={section}>Size</div>
      <WidthControl node={node} onPatch={onPatch} />
      <label className="block"><span className={label}>Height</span>
        <input value={node.height ?? ""} onChange={(e) => onPatch({ height: e.target.value || undefined })} placeholder="auto, 40vh or fill" aria-label="Height" className={inputCls} />
        <span className="text-[9px] text-gray-400">use vh (screen-relative) or auto/fill for responsive height</span>
      </label>
      <label className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
        <input type="checkbox" checked={!!node.clip} onChange={(e) => onPatch({ clip: e.target.checked })} className="mt-0.5" />
        <span>Clip to size <span className="text-gray-400">— by default a box hugs its content and can't be smaller; tick this to force a smaller size and hide the overflow.</span></span>
      </label>
      <Range title="Corner radius (all)" value={node.radius} min={0} max={64} fallback={0} onChange={(n) => onPatch({ radius: n })} />
      <div className="grid grid-cols-4 gap-1">
        {([["TL", "radiusTopLeft"], ["TR", "radiusTopRight"], ["BR", "radiusBottomRight"], ["BL", "radiusBottomLeft"]] as const).map(([lab, key]) => (
          <label key={key} className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] uppercase tracking-wide text-gray-400">{lab}</span>
            <input type="number" min={0} value={node[key] !== undefined ? (node[key] as number) : ""} placeholder={String(node.radius ?? 0)} onChange={(e) => onPatch({ [key]: e.target.value === "" ? undefined : Number(e.target.value) } as Partial<BoxNode>)} aria-label={`Corner radius ${lab}`} className="w-full text-xs px-1 py-1 rounded border border-gray-200 dark:border-gray-700 bg-transparent text-center outline-none focus:ring-1 focus:ring-indigo-400" />
          </label>
        ))}
      </div>
      <Range title="Opacity" value={node.opacity} min={0} max={100} fallback={100} onChange={(n) => onPatch({ opacity: n })} unit="%" />

      {/* ── Border & effects ── */}
      <div className={section}>Border &amp; effects</div>
      <div className="grid grid-cols-2 gap-2">
        <Range title="Border" value={node.borderWidth} min={0} max={16} fallback={0} onChange={(n) => onPatch({ borderWidth: n })} />
        <label className="block"><span className={label}>Style</span>
          <select value={node.borderStyle ?? "solid"} onChange={(e) => onPatch({ borderStyle: e.target.value as BoxNode["borderStyle"] })} className={inputCls}>
            {["solid", "dashed", "dotted"].map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
      </div>
      {!!node.borderWidth && <ColorRow title="Border colour" value={node.borderColor} fallback={theme.text} onSelect={(c) => onPatch({ borderColor: c })} />}
      <div className="space-y-1">
        <span className={label}>Shadow</span>
        <div className="flex gap-1 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700">
          {SHADOWS.map((s) => <button key={s} onClick={() => onPatch({ shadow: s === "none" ? undefined : s })} className={`${seg} uppercase ${(node.shadow ?? "none") === s ? "bg-indigo-600 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>{s}</button>)}
        </div>
      </div>
      <Range title="Rotation" value={node.rotate} min={-180} max={180} fallback={0} onChange={(n) => onPatch({ rotate: n })} unit="°" />

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

      {/* ── Anchor (a named scroll target ANY box can be linked to) ── */}
      <label className="block"><span className={label}>Anchor name (link target)</span>
        <input value={node.anchor ?? ""} onChange={(e) => onPatch({ anchor: e.target.value.replace(/\s+/g, "-").toLowerCase() || undefined })} placeholder="e.g. pricing → link with #pricing" aria-label="Anchor name" className={inputCls} />
      </label>

      {/* ── Element content ── */}
      {!container && (
        <>
          <div className={section}>Content</div>
          {(node.type === "text" || node.type === "heading" || node.type === "button") && (
            <label className="block"><span className={label}>Text</span>
              <textarea value={node.text ?? ""} onChange={(e) => onPatch({ text: e.target.value })} rows={2} className={inputCls} />
            </label>
          )}
          {node.type === "button" && (
            <>
              <label className="block"><span className={label}>Link (URL or #anchor)</span>
                <input value={node.href ?? ""} onChange={(e) => onPatch({ href: e.target.value })} placeholder="https://… or #pricing" className={inputCls} />
              </label>
              {pages && pages.filter((p) => p.id !== currentPageId).length > 0 && (
                <label className="block"><span className={label}>…or link to a page</span>
                  <select value={node.href?.startsWith("page:") ? node.href : ""} onChange={(e) => onPatch({ href: e.target.value })} aria-label="Link to page" className={inputCls}>
                    <option value="">— choose a page —</option>
                    {pages.filter((p) => p.id !== currentPageId).map((p) => <option key={p.id} value={`page:${p.id}`}>{p.name}</option>)}
                  </select>
                </label>
              )}
              <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><input type="checkbox" checked={!!node.newTab} onChange={(e) => onPatch({ newTab: e.target.checked })} /> Open in a new tab</label>
            </>
          )}
          {node.type === "video" && (
            <label className="block"><span className={label}>Video URL</span>
              <input value={node.src ?? ""} onChange={(e) => onPatch({ src: e.target.value })} placeholder="YouTube, Vimeo or .mp4 URL" aria-label="Video URL" className={inputCls} />
              <span className="text-[9px] text-gray-400">YouTube/Vimeo links embed automatically; a direct .mp4 plays inline.</span>
            </label>
          )}
          {node.type === "embed" && (
            <label className="block"><span className={label}>HTML / embed code</span>
              <textarea value={node.html ?? ""} onChange={(e) => onPatch({ html: e.target.value })} rows={4} placeholder="<iframe …> or any HTML" aria-label="HTML embed code" className={`${inputCls} font-mono text-[11px]`} />
            </label>
          )}
          {node.type === "icon" && (
            <>
              <div className="space-y-1">
                <span className={label}>Icon</span>
                <div className="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                  {ICON_NAMES.map((name) => {
                    const Ico = ICON_SET[name];
                    return <button key={name} onClick={() => onPatch({ icon: name })} aria-label={`Icon ${name}`} title={name} className={`aspect-square flex items-center justify-center rounded-md ${(node.icon ?? "Star") === name ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}><Ico className="w-4 h-4" /></button>;
                  })}
                </div>
              </div>
              <Range title="Icon size" value={node.fontSize} min={12} max={120} fallback={32} onChange={(n) => onPatch({ fontSize: n })} unit="rem" />
              <ColorRow title="Icon colour" value={node.color} fallback={theme.primary} onSelect={(c) => onPatch({ color: c })} />
              <div className="flex items-center justify-between">
                <span className={label}>Align</span>
                <div className="flex gap-1">
                  {([["left", AlignLeft], ["center", AlignCenter], ["right", AlignRight]] as const).map(([a, Icon]) => (
                    <button key={a} onClick={() => onPatch({ textAlign: a })} aria-label={`Align ${a}`} className={`p-1.5 rounded-md ${(node.textAlign ?? "left") === a ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}><Icon className="w-4 h-4" /></button>
                  ))}
                </div>
              </div>
            </>
          )}
          {node.type === "divider" && (
            <>
              <ColorRow title="Line colour" value={node.color} fallback={theme.textMuted} onSelect={(c) => onPatch({ color: c })} />
              <Range title="Thickness" value={node.borderWidth} min={1} max={20} fallback={2} onChange={(n) => onPatch({ borderWidth: n })} />
            </>
          )}
          {node.type === "list" && (
            <>
              <div className="flex gap-1 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700">
                {(["bullet", "number"] as const).map((s) => <button key={s} onClick={() => onPatch({ listStyle: s })} className={`${seg} ${(node.listStyle ?? "bullet") === s ? "bg-indigo-600 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>{s === "bullet" ? "Bulleted" : "Numbered"}</button>)}
              </div>
              <label className="block"><span className={label}>Items (one per line)</span>
                <textarea value={(node.listItems ?? []).join("\n")} onChange={(e) => onPatch({ listItems: e.target.value.split("\n") })} rows={4} aria-label="List items" className={inputCls} />
              </label>
            </>
          )}
          {textual && (
            <>
              <Range title="Font size" value={node.fontSize} min={10} max={72} fallback={node.type === "heading" ? 32 : 16} onChange={(n) => onPatch({ fontSize: n })} unit="rem" />
              <ColorRow title="Text colour" value={node.color} fallback={theme.text} onSelect={(c) => onPatch({ color: c })} />
              <label className="block"><span className={label}>Font family</span>
                <select value={node.fontFamily ?? ""} onChange={(e) => onPatch({ fontFamily: e.target.value || undefined })} className={inputCls}>
                  <option value="">Theme default</option>
                  {FONT_CHOICES.map((f) => <option key={f} value={f}>{FONT_LABEL(f)}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block"><span className={label}>Weight</span>
                  <select value={node.fontWeight ?? ""} onChange={(e) => onPatch({ fontWeight: e.target.value === "" ? undefined : Number(e.target.value) })} className={inputCls}>
                    <option value="">Auto</option>
                    {[300, 400, 500, 600, 700, 800, 900].map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                </label>
                <label className="block"><span className={label}>Transform</span>
                  <select value={node.textTransform ?? "none"} onChange={(e) => onPatch({ textTransform: e.target.value as BoxNode["textTransform"] })} className={inputCls}>
                    {["none", "uppercase", "lowercase", "capitalize"].map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="block"><span className={label}>Line height</span>
                  <input type="number" step={0.05} min={0.8} max={3} value={node.lineHeight ?? ""} placeholder="auto" onChange={(e) => onPatch({ lineHeight: e.target.value === "" ? undefined : Number(e.target.value) })} aria-label="Line height" className={inputCls} />
                </label>
                <label className="block"><span className={label}>Letter spacing</span>
                  <input type="number" step={0.5} value={node.letterSpacing ?? ""} placeholder="0px" onChange={(e) => onPatch({ letterSpacing: e.target.value === "" ? undefined : Number(e.target.value) })} aria-label="Letter spacing (px)" className={inputCls} />
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className={label}>Align</span>
                <div className="flex gap-1">
                  {([["left", AlignLeft], ["center", AlignCenter], ["right", AlignRight]] as const).map(([a, Icon]) => (
                    <button key={a} onClick={() => onPatch({ textAlign: a })} aria-label={`Align ${a}`} className={`p-1.5 rounded-md ${(node.textAlign ?? "left") === a ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}><Icon className="w-4 h-4" /></button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => onPatch({ bold: !(node.bold ?? (node.type === "heading")) })} aria-label="Bold" aria-pressed={node.bold ?? (node.type === "heading")} className={`px-2 py-1 rounded-md font-bold text-sm ${(node.bold ?? (node.type === "heading")) ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>B</button>
                <button onClick={() => onPatch({ italic: !node.italic })} aria-label="Italic" aria-pressed={!!node.italic} className={`p-1.5 rounded-md ${node.italic ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}><Italic className="w-4 h-4" /></button>
                <button onClick={() => onPatch({ underline: !node.underline })} aria-label="Underline" aria-pressed={!!node.underline} className={`p-1.5 rounded-md ${node.underline ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`}><Underline className="w-4 h-4" /></button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
