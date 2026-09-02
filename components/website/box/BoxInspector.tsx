"use client";

/**
 * Properties panel for the selected block — "clean & airy" design, organised into TABS (Design · Content ·
 * Per-device) with collapsible cards. Every label is PLAIN LANGUAGE (a normal user, not a developer):
 * "Free arrange / Grid", "Top-to-bottom / Side-by-side", "Inner/Outer spacing", "See-through", "Tilt", etc.
 * — the real CSS still runs under the hood. Colours reuse the shared ColorPickerPopover.
 */

import { useState, useRef } from "react";
import { Plus, Rows3, Columns3, Upload, AlignLeft, AlignCenter, AlignRight, Layers, Move, BringToFront, SendToBack, ChevronUp, ChevronDown, Italic, Underline, LayoutGrid, Maximize2, Sparkles, Paintbrush, Ruler, Link2, Type as TypeIcon, MonitorSmartphone, Bookmark } from "lucide-react";
import type { SiteTheme } from "@/lib/site-storage";
import type { BoxNode, FlexAlign, FlexJustify } from "@/lib/box-model";
import { isContainer, isFloating, addAccItem, removeAccItem, moveAccItem, updateAccItem } from "@/lib/box-model";
import { ACCORDION_DESIGNS, ACCORDION_DESIGN_COUNT } from "@/lib/educo-ui/accordions";
import { familyOptions } from "@/lib/educo-ui/fonts";
import { getPresets, presetKindFor } from "@/lib/box-presets";
import { ICON_SET, ICON_NAMES } from "./icons";
import { Tabs, Accordion, Segmented, type SegOption } from "./ui";
import EducoColorField from "@/components/shared/EducoColorField";
import Slider from "@/components/shared/Slider";
import CompactField from "@/components/shared/CompactField";
import CompactSelect from "@/components/shared/CompactSelect";
import CompactTextarea from "@/components/shared/CompactTextarea";

const label = "text-[0.6875rem] font-medium text-gray-500 dark:text-gray-400";

const toRem = (px: number) => +(px / 10).toFixed(2);
const fromRem = (rem: number) => Math.round(rem * 10);

// Plain-language option lists (value = the real CSS token, label = what the user reads).
const JUSTIFY_OPTS: [FlexJustify, string][] = [["start", "Start"], ["center", "Center"], ["end", "End"], ["between", "Spread out"], ["around", "Even gaps"]];
const ALIGN_OPTS: [FlexAlign, string][] = [["stretch", "Fill"], ["start", "Start"], ["center", "Center"], ["end", "End"]];
const WEIGHT_OPTS: [string, string][] = [["", "Auto"], ["300", "Light"], ["400", "Normal"], ["500", "Medium"], ["600", "Semibold"], ["700", "Bold"], ["800", "Extra bold"], ["900", "Black"]];
const TRANSFORM_OPTS: [NonNullable<BoxNode["textTransform"]>, string][] = [["none", "Normal"], ["uppercase", "UPPERCASE"], ["lowercase", "lowercase"], ["capitalize", "Capitalise"]];
const SHADOW_OPTS: SegOption<string>[] = [{ value: "none", label: "None" }, { value: "sm", label: "Soft" }, { value: "md", label: "Medium" }, { value: "lg", label: "Strong" }, { value: "xl", label: "Bold" }];

// Reuses the shared <Slider> (labelled range control) instead of a raw <input type="range">.
function Range({ title, value, min, max, fallback, onChange, unit = "px" }: { title: string; value?: number; min: number; max: number; fallback: number; onChange: (n: number) => void; unit?: string }) {
  const v = value ?? fallback;
  return <Slider label={title} value={v} min={min} max={max} onChange={onChange} formatValue={unit === "rem" ? (x) => `${toRem(x)}rem` : (x) => `${x}${unit}`} />;
}

// A labelled colour control that reuses the design-system OKLCH palette picker (spectrum + palettes + hex).
// When `onClear` is given, the picker offers a "None (transparent)" choice and shows a checkerboard when unset.
function ColorRow({ title, value, fallback, onSelect, onClear }: { title: string; value?: string; fallback: string; onSelect: (c: string) => void; onClear?: () => void; mode?: "matrix" | "both" }) {
  return <EducoColorField label={title} ariaLabel={title} value={onClear ? (value ?? "") : (value || fallback)} onChange={onSelect} onClear={onClear} />;
}

/** Width: Fit content / Full width / Custom (% or px). */
function WidthControl({ node, onPatch }: { node: BoxNode; onPatch: (p: Partial<BoxNode>) => void }) {
  const w = node.width ?? "auto";
  const isCustom = w !== "auto" && w !== "fill";
  const mode = w === "auto" ? "auto" : w === "fill" ? "fill" : "custom";
  return (
    <div className="space-y-1.5">
      <span className={label}>Width</span>
      <Segmented full ariaLabel="Width" value={mode} onChange={(m) => onPatch({ width: m === "auto" ? "auto" : m === "fill" ? "fill" : isCustom ? w : "50%" })}
        options={[{ value: "auto", label: "Fit" }, { value: "fill", label: "Full" }, { value: "custom", label: "Custom" }]} />
      {isCustom && <CompactField ariaLabel="Custom width" value={w} onChange={(v) => onPatch({ width: v })} placeholder="50% or 240px" />}
    </div>
  );
}

/** All-sides slider + four per-side overrides (Top/Right/Bottom/Left). Used for inner & outer spacing. */
function SideSpacing({ title, node, base, sides, onPatch, max = 96 }: {
  title: string; node: BoxNode; base: keyof BoxNode; sides: [keyof BoxNode, keyof BoxNode, keyof BoxNode, keyof BoxNode]; onPatch: (p: Partial<BoxNode>) => void; max?: number;
}) {
  const g = (node[base] as number | undefined) ?? 0;
  const setPx = (k: keyof BoxNode, px: number) => onPatch({ [k]: px } as Partial<BoxNode>);
  const setRem = (k: keyof BoxNode, v: string) => onPatch({ [k]: v === "" ? undefined : fromRem(Number(v)) } as Partial<BoxNode>);
  const [t, r, b, l] = sides;
  return (
    <div className="space-y-1.5">
      <Slider label={title} value={g} min={0} max={max} onChange={(n) => setPx(base, n)} formatValue={(x) => `${toRem(x)}rem`} />
      <div className="grid grid-cols-4 gap-1">
        {([["Top", t], ["Right", r], ["Bottom", b], ["Left", l]] as const).map(([lab, key]) => (
          <label key={lab} className="flex flex-col items-center gap-0.5">
            <span className="text-[0.5625rem] uppercase tracking-wide text-gray-400">{lab}</span>
            <input type="number" step={0.1} min={0} value={node[key] !== undefined ? toRem(node[key] as number) : ""} placeholder={String(toRem(g))} onChange={(e) => setRem(key, e.target.value)} aria-label={`${title} ${lab.toLowerCase()}`} className="w-full text-xs px-1 py-1 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent text-center outline-none focus:ring-1 focus:ring-indigo-400" />
          </label>
        ))}
      </div>
    </div>
  );
}

const iconBtn = (on: boolean) => `p-1.5 rounded-md ${on ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"}`;

export default function BoxInspector({ node, theme, onPatch, onAddChild, onFloat, onUnfloat, onLayer, canFloat = true, inGrid = false, breakpoint = "base", overridden = false, onResetOverride, pages, currentPageId }: {
  node: BoxNode;
  theme: SiteTheme;
  onPatch: (patch: Partial<BoxNode>) => void;
  onAddChild?: () => void;
  onFloat?: () => void;
  onUnfloat?: () => void;
  onLayer?: (dir: "front" | "forward" | "backward" | "back") => void;
  canFloat?: boolean;
  inGrid?: boolean;
  breakpoint?: "base" | "tablet" | "mobile";
  overridden?: boolean;
  onResetOverride?: () => void;
  pages?: { id: string; name: string }[];
  currentPageId?: string;
}) {
  const [tab, setTab] = useState<"design" | "content" | "device">("design");
  const [iconQuery, setIconQuery] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const presets = getPresets(presetKindFor(node), theme);
  const container = isContainer(node);
  const isGrid = node.layout === "grid";
  const floating = isFloating(node);
  const textual = node.type === "text" || node.type === "heading" || node.type === "button" || node.type === "list";
  const typeLabel = container ? (isGrid ? "Grid" : node.direction === "row" ? "Row" : "Section") : node.type;
  const align = (["left", "center", "right"] as const);
  const bpLabel = breakpoint === "mobile" ? "Mobile" : breakpoint === "tablet" ? "Tablet" : "";

  const AlignRow = () => (
    <div className="flex items-center justify-between">
      <span className={label}>Text align</span>
      <div className="flex gap-1">
        {([["left", AlignLeft], ["center", AlignCenter], ["right", AlignRight]] as const).map(([a, Icon]) => (
          <button key={a} onClick={() => onPatch({ textAlign: a })} aria-label={`Align ${a}`} className={iconBtn((node.textAlign ?? "left") === a)}><Icon className="w-4 h-4" /></button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-3 space-y-3">
      <div className="text-[0.6875rem] text-gray-400 px-1">Editing: <b className="text-gray-600 dark:text-gray-300 capitalize">{typeLabel}</b></div>

      {container && onAddChild && (
        <button onClick={onAddChild} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm">
          <Plus className="w-4 h-4" /> Add a block inside
        </button>
      )}

      {/* At tablet/mobile, changes here only affect that screen (content stays shared). */}
      {breakpoint !== "base" && (
        <div className="rounded-xl border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-2.5 space-y-1.5">
          <div className="text-[0.6875rem] font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1.5"><MonitorSmartphone className="w-3.5 h-3.5" /> Editing {bpLabel} — size &amp; layout only change here.</div>
          {overridden && onResetOverride && <button onClick={onResetOverride} className="text-[0.6875rem] text-amber-700 dark:text-amber-300 underline hover:no-underline">Reset {breakpoint} changes to default</button>}
        </div>
      )}

      {/* Style presets — pick a whole look in one tap (Filled/Outline button, Display/Eyebrow heading, …). */}
      {presets.length > 0 && (
        <div className="border-b border-gray-100 dark:border-white/5 pb-3 space-y-2">
          <div className="text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} /> Styles</div>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p) => <button key={p.id} onClick={() => onPatch(p.patch)} aria-label={`Style ${p.label}`} className="px-2.5 py-1 text-xs rounded-md border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition">{p.label}</button>)}
          </div>
        </div>
      )}

      <Tabs value={tab} onChange={setTab} tabs={[{ id: "design", label: "Design" }, { id: "content", label: "Content" }, { id: "device", label: "Per-device" }]} />

      {/* ─────────────── DESIGN ─────────────── */}
      {tab === "design" && (
        <div>
          {canFloat && (
            <Accordion title="Placement" icon={Move}>
              <Segmented full ariaLabel="Placement" value={floating ? "float" : "flow"} onChange={(v) => (v === "float" ? onFloat?.() : onUnfloat?.())}
                options={[{ value: "flow", label: "In the layout", Icon: Rows3 }, { value: "float", label: "Floating", Icon: Layers }]} />
              {floating && (
                <>
                  <p className="text-[0.625rem] text-gray-400 flex items-start gap-1"><Move className="w-3 h-3 mt-0.5 shrink-0" /> Drag it anywhere to overlap other blocks. Arrow keys nudge it.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {([["Left %", "left"], ["Top %", "top"]] as const).map(([lab, key]) => (
                      <CompactField key={key} label={lab} ariaLabel={`${lab} position`} type="number" step={0.5} value={node[key] !== undefined ? Math.round((node[key] as number) * 10) / 10 : 0} onChange={(v) => onPatch({ [key]: Number(v) })} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={label}>Front/back order <span className="text-gray-400 tabular-nums">({node.zIndex ?? 1})</span></span>
                    <div className="flex gap-1">
                      <button onClick={() => onLayer?.("back")} aria-label="Send to back" title="Send to back" className={iconBtn(false)}><SendToBack className="w-4 h-4" /></button>
                      <button onClick={() => onLayer?.("backward")} aria-label="Send backward" title="Back one" className={iconBtn(false)}><ChevronDown className="w-4 h-4" /></button>
                      <button onClick={() => onLayer?.("forward")} aria-label="Bring forward" title="Forward one" className={iconBtn(false)}><ChevronUp className="w-4 h-4" /></button>
                      <button onClick={() => onLayer?.("front")} aria-label="Bring to front" title="Bring to front" className={iconBtn(false)}><BringToFront className="w-4 h-4" /></button>
                    </div>
                  </div>
                </>
              )}
            </Accordion>
          )}

          {container && (
            <Accordion title="Arrange" icon={LayoutGrid}>
              <Segmented full ariaLabel="Arrange as" value={isGrid ? "grid" : "flex"} onChange={(v) => onPatch({ layout: v as "flex" | "grid" })}
                options={[{ value: "flex", label: "Free arrange" }, { value: "grid", label: "Grid" }]} />
              {isGrid ? (
                <Range title="Columns" value={node.columns} min={1} max={6} fallback={3} onChange={(n) => onPatch({ columns: n })} unit="" />
              ) : (
                <>
                  <Segmented full ariaLabel="Direction" value={node.direction === "row" ? "row" : "column"} onChange={(v) => onPatch({ direction: v as "row" | "column" })}
                    options={[{ value: "column", label: "Top-to-bottom", Icon: Rows3 }, { value: "row", label: "Side-by-side", Icon: Columns3 }]} />
                  <CompactSelect label="Position blocks" ariaLabel="Position blocks" value={node.justify ?? "start"} onChange={(v) => onPatch({ justify: v as FlexJustify })} options={JUSTIFY_OPTS.map(([v, l]) => ({ value: v, label: l }))} />
                  <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><input type="checkbox" checked={!!node.wrap} onChange={(e) => onPatch({ wrap: e.target.checked })} /> Let blocks wrap to a new line</label>
                </>
              )}
              <CompactSelect label="Line up (across)" ariaLabel="Line up" value={node.align ?? "stretch"} onChange={(v) => onPatch({ align: v as FlexAlign })} options={ALIGN_OPTS.map(([v, l]) => ({ value: v, label: l }))} />
              <Range title="Space between blocks" value={node.gap} min={0} max={64} fallback={16} onChange={(n) => onPatch({ gap: n })} unit="rem" />
            </Accordion>
          )}

          {inGrid && (
            <Accordion title="Grid cell" icon={LayoutGrid}>
              <div className="grid grid-cols-2 gap-2">
                <CompactField label="Columns wide" ariaLabel="Columns wide" type="number" min={1} max={12} value={node.colSpan ?? 1} onChange={(v) => onPatch({ colSpan: Math.max(1, Number(v) || 1) })} />
                <CompactField label="Rows tall" ariaLabel="Rows tall" type="number" min={1} max={12} value={node.rowSpan ?? 1} onChange={(v) => onPatch({ rowSpan: Math.max(1, Number(v) || 1) })} />
              </div>
            </Accordion>
          )}

          <Accordion title="Size" icon={Maximize2}>
            <WidthControl node={node} onPatch={onPatch} />
            <CompactField label="Height" ariaLabel="Height" value={node.height ?? ""} onChange={(v) => onPatch({ height: v || undefined })} placeholder="auto, 300px or 40vh" />
            <label className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
              <input type="checkbox" checked={!!node.clip} onChange={(e) => onPatch({ clip: e.target.checked })} className="mt-0.5" />
              <span>Trim to size <span className="text-gray-400">— by default a block grows to fit its content; tick this to force a smaller size and hide the overflow.</span></span>
            </label>
          </Accordion>

          <Accordion title="Spacing" icon={Ruler}>
            {container && <SideSpacing title="Inner spacing" node={node} base="padding" sides={["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]} onPatch={onPatch} />}
            <SideSpacing title="Outer spacing" node={node} base="margin" sides={["marginTop", "marginRight", "marginBottom", "marginLeft"]} onPatch={onPatch} />
          </Accordion>

          <Accordion title="Outline & effects" icon={Sparkles}>
            <Range title="Rounded corners" value={node.radius} min={0} max={64} fallback={0} onChange={(n) => onPatch({ radius: n })} />
            <div className="grid grid-cols-4 gap-1">
              {([["TL", "radiusTopLeft", "top-left"], ["TR", "radiusTopRight", "top-right"], ["BR", "radiusBottomRight", "bottom-right"], ["BL", "radiusBottomLeft", "bottom-left"]] as const).map(([lab, key, full]) => (
                <label key={key} className="flex flex-col items-center gap-0.5">
                  <span className="text-[0.5625rem] uppercase tracking-wide text-gray-400">{lab}</span>
                  <input type="number" min={0} value={node[key] !== undefined ? (node[key] as number) : ""} placeholder={String(node.radius ?? 0)} onChange={(e) => onPatch({ [key]: e.target.value === "" ? undefined : Number(e.target.value) } as Partial<BoxNode>)} aria-label={`Rounded corner ${full}`} className="w-full text-xs px-1 py-1 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent text-center outline-none focus:ring-1 focus:ring-indigo-400" />
                </label>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Range title="Border" value={node.borderWidth} min={0} max={16} fallback={0} onChange={(n) => onPatch({ borderWidth: n })} />
              <CompactSelect label="Border style" ariaLabel="Border style" value={node.borderStyle ?? "solid"} onChange={(v) => onPatch({ borderStyle: v as BoxNode["borderStyle"] })} options={[{ value: "solid", label: "Solid" }, { value: "dashed", label: "Dashed" }, { value: "dotted", label: "Dotted" }]} />
            </div>
            {!!node.borderWidth && <ColorRow title="Border colour" value={node.borderColor} fallback={theme.text} onSelect={(c) => onPatch({ borderColor: c })} />}
            <div className="space-y-1">
              <span className={label}>Shadow</span>
              <Segmented full ariaLabel="Shadow" value={node.shadow ?? "none"} onChange={(v) => onPatch({ shadow: v === "none" ? undefined : (v as BoxNode["shadow"]) })} options={SHADOW_OPTS} />
            </div>
            <Range title="Tilt" value={node.rotate} min={-180} max={180} fallback={0} onChange={(n) => onPatch({ rotate: n })} unit="°" />
            <Range title="See-through" value={node.opacity} min={0} max={100} fallback={100} onChange={(n) => onPatch({ opacity: n })} unit="%" />
          </Accordion>

          <Accordion title="Background" icon={Paintbrush}>
            <ColorRow title="Background colour" value={node.background} fallback={theme.surface} onSelect={(c) => onPatch({ background: c })} onClear={() => onPatch({ background: undefined })} />
            <button onClick={() => fileRef.current?.click()} className="w-full flex items-center justify-center gap-2 text-sm px-3 py-2 rounded-lg border border-dashed border-gray-300 dark:border-white/15 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200"><Upload className="w-3.5 h-3.5" /> {node.bgImage ? "Replace background image" : "Background image"}</button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" aria-label="Upload background image" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => onPatch({ bgImage: String(r.result) }); r.readAsDataURL(f); e.target.value = ""; }} />
            {node.bgImage && (
              <>
                <Segmented full ariaLabel="Image fit" value={node.bgSize ?? "cover"} onChange={(v) => onPatch({ bgSize: v as "cover" | "contain" })} options={[{ value: "cover", label: "Fill" }, { value: "contain", label: "Fit" }]} />
                <ColorRow title="Tint over image" value={node.bgOverlay} fallback="#00000066" onSelect={(c) => onPatch({ bgOverlay: c })} mode="both" />
                <button onClick={() => onPatch({ bgImage: undefined, bgOverlay: undefined })} className="text-[0.6875rem] text-red-500 hover:underline">Remove background image</button>
              </>
            )}
          </Accordion>
        </div>
      )}

      {/* ─────────────── CONTENT ─────────────── */}
      {tab === "content" && (
        <div>
          <Accordion title="Bookmark" icon={Bookmark} defaultOpen={!container}>
            <label className="block"><span className={label}>Bookmark name</span>
              <CompactField ariaLabel="Bookmark name" value={node.anchor ?? ""} onChange={(v) => onPatch({ anchor: v.replace(/\s+/g, "-").toLowerCase() || undefined })} placeholder="e.g. pricing → link with #pricing" />
              <span className="text-[0.5625rem] text-gray-400">Give this block a name so a button can jump straight to it.</span>
            </label>
          </Accordion>

          {container ? (
            <p className="text-xs text-gray-400 text-center px-2 py-4">This is a container. Drag blocks from the left onto it, or use “Add a block inside”.</p>
          ) : (
            <>
              <Accordion title="Content" icon={TypeIcon}>
                {(node.type === "text" || node.type === "heading" || node.type === "button") && (
                  <CompactTextarea label="Text" value={node.text ?? ""} onChange={(v) => onPatch({ text: v })} rows={2} />
                )}
                {node.type === "button" && (
                  <>
                    <CompactField label="Link (web address or #bookmark)" ariaLabel="Link" value={node.href ?? ""} onChange={(v) => onPatch({ href: v })} placeholder="https://… or #pricing" />
                    {pages && pages.filter((p) => p.id !== currentPageId).length > 0 && (
                      <CompactSelect label="…or jump to a page" ariaLabel="Link to page" value={node.href?.startsWith("page:") ? node.href : ""} onChange={(v) => onPatch({ href: v })}
                        options={[{ value: "", label: "— choose a page —" }, ...pages.filter((p) => p.id !== currentPageId).map((p) => ({ value: `page:${p.id}`, label: p.name }))]} />
                    )}
                    <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><input type="checkbox" checked={!!node.newTab} onChange={(e) => onPatch({ newTab: e.target.checked })} /> Open in a new tab</label>
                  </>
                )}
                {node.type === "video" && (
                  <CompactField label="Video link" ariaLabel="Video URL" value={node.src ?? ""} onChange={(v) => onPatch({ src: v })} placeholder="YouTube, Vimeo or .mp4 link" helpText="YouTube/Vimeo links play automatically; a direct .mp4 plays inline." />
                )}
                {node.type === "embed" && (
                  <CompactTextarea label="Embed code" value={node.html ?? ""} onChange={(v) => onPatch({ html: v })} rows={4} placeholder="Paste an <iframe> or any HTML" textareaClassName="font-mono text-[0.6875rem]" />
                )}
                {node.type === "icon" && (
                  <>
                    <div className="space-y-1.5">
                      <span className={label}>Choose an icon</span>
                      <CompactField ariaLabel="Search icons" value={iconQuery} onChange={setIconQuery} placeholder="Search icons…" />
                      <div className="grid grid-cols-6 gap-1 max-h-44 overflow-y-auto p-1 rounded-lg border border-gray-200 dark:border-white/10">
                        {ICON_NAMES.filter((n) => n.toLowerCase().includes(iconQuery.trim().toLowerCase())).map((name) => { const Ico = ICON_SET[name]; return <button key={name} onClick={() => onPatch({ icon: name })} aria-label={`Icon ${name}`} title={name} className={`aspect-square flex items-center justify-center rounded-md ${(node.icon ?? "Star") === name ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"}`}><Ico className="w-4 h-4" /></button>; })}
                      </div>
                    </div>
                    <Range title="Icon size" value={node.fontSize} min={12} max={120} fallback={32} onChange={(n) => onPatch({ fontSize: n })} unit="rem" />
                    <ColorRow title="Icon colour" value={node.color} fallback={theme.primary} onSelect={(c) => onPatch({ color: c })} />
                    <AlignRow />
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
                    <Segmented full ariaLabel="List style" value={node.listStyle ?? "bullet"} onChange={(v) => onPatch({ listStyle: v as "bullet" | "number" })} options={[{ value: "bullet", label: "Bulleted" }, { value: "number", label: "Numbered" }]} />
                    <CompactTextarea label="Items (one per line)" ariaLabel="List items" value={(node.listItems ?? []).join("\n")} onChange={(v) => onPatch({ listItems: v.split("\n") })} rows={4} />
                  </>
                )}
                {node.type === "component" && node.component === "accordion" && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={label}>Design</span>
                        <span className="text-[0.5625rem] text-gray-400">{ACCORDION_DESIGN_COUNT} styles · tap to apply</span>
                      </div>
                      {ACCORDION_DESIGNS.map((g) => (
                        <div key={g.group} className="space-y-1">
                          <div className="text-[0.5625rem] font-semibold uppercase tracking-wide text-gray-400/90">{g.group}</div>
                          <div className="flex flex-wrap gap-1" role="listbox" aria-label={`${g.group} accordion designs`}>
                            {g.items.map((v) => {
                              const on = (node.variant ?? "") === v.id;
                              return (
                                <button key={v.id || "boxed"} role="option" aria-selected={on} aria-label={`${v.label} design`} title={v.label}
                                  onClick={() => onPatch({ variant: v.id })}
                                  className={`px-2 py-1 rounded-md text-[0.6875rem] font-medium border transition-colors ${on ? "bg-indigo-600 border-transparent text-white" : "border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"}`}>
                                  {v.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><input type="checkbox" checked={!!node.accMultiOpen} onChange={(e) => onPatch({ accMultiOpen: e.target.checked })} /> Allow more than one open at once</label>
                    <div className="space-y-2">
                      <span className={label}>Items</span>
                      {(node.accItems ?? []).map((it, i) => (
                        <div key={it.id} className="rounded-lg border border-gray-200 dark:border-white/10 p-2 space-y-1.5">
                          <div className="flex items-center gap-1">
                            <div className="flex-1"><CompactField ariaLabel={`Item ${i + 1} title`} value={it.title} onChange={(v) => onPatch({ accItems: updateAccItem(node, it.id, { title: v }).accItems })} placeholder="Question / title" /></div>
                            <button onClick={() => onPatch({ accItems: moveAccItem(node, it.id, -1).accItems })} disabled={i === 0} aria-label="Move item up" className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                            <button onClick={() => onPatch({ accItems: moveAccItem(node, it.id, 1).accItems })} disabled={i === (node.accItems?.length ?? 0) - 1} aria-label="Move item down" className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                          </div>
                          <CompactTextarea ariaLabel={`Item ${i + 1} body`} value={it.body} onChange={(v) => onPatch({ accItems: updateAccItem(node, it.id, { body: v }).accItems })} rows={2} placeholder="Answer / body" />
                          <div className="grid grid-cols-2 gap-1">
                            <CompactField ariaLabel={`Item ${i + 1} meta`} value={it.meta ?? ""} onChange={(v) => onPatch({ accItems: updateAccItem(node, it.id, { meta: v || undefined }).accItems })} placeholder="Meta (e.g. $10)" />
                            <CompactField ariaLabel={`Item ${i + 1} image`} value={it.media ?? ""} onChange={(v) => onPatch({ accItems: updateAccItem(node, it.id, { media: v || undefined }).accItems })} placeholder="Image URL" />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><input type="checkbox" checked={!!it.open} onChange={(e) => onPatch({ accItems: updateAccItem(node, it.id, { open: e.target.checked || undefined }).accItems })} /> Open by default</label>
                            <button onClick={() => onPatch({ accItems: removeAccItem(node, it.id).accItems })} disabled={(node.accItems?.length ?? 0) <= 1} aria-label={`Remove item ${i + 1}`} className="text-xs text-red-500 hover:text-red-600 disabled:opacity-30">Remove</button>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => onPatch({ accItems: addAccItem(node).accItems })} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-gray-300 dark:border-white/15 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"><Plus className="w-3.5 h-3.5" /> Add item</button>
                    </div>
                  </>
                )}
              </Accordion>

              {node.type === "component" && (
                <Accordion title="Component colours" icon={Paintbrush}>
                  <p className="text-[0.625rem] text-gray-400 -mt-1">These re-skin the whole component — and any other Educo component — because they set its design tokens. Type a hex, use the native picker, or the eyedropper.</p>
                  {(() => {
                    const setTok = (k: string, hex: string) => onPatch({ tokenOverrides: { ...node.tokenOverrides, [k]: hex } });
                    const tok = (k: string) => node.tokenOverrides?.[k];
                    const bg = tok("--eu-color-surface") || theme.surface;
                    return (
                      <div className="space-y-2.5">
                        <EducoColorField label="Brand" value={tok("--eu-color-brand") || theme.primary} onChange={(hex) => setTok("--eu-color-brand", hex)} />
                        <EducoColorField label="Accent" value={tok("--eu-color-accent-500") || theme.accent} onChange={(hex) => setTok("--eu-color-accent-500", hex)} />
                        <EducoColorField label="Surface" value={tok("--eu-color-surface") || theme.surface} onChange={(hex) => setTok("--eu-color-surface", hex)} onClear={() => setTok("--eu-color-surface", "transparent")} />
                        <EducoColorField label="Background" value={tok("--eu-color-bg") || theme.background} onChange={(hex) => setTok("--eu-color-bg", hex)} onClear={() => setTok("--eu-color-bg", "transparent")} />
                        <EducoColorField label="Text" value={tok("--eu-color-text") || theme.text} onChange={(hex) => setTok("--eu-color-text", hex)} contrastBg={bg} />
                        <EducoColorField label="Muted text" value={tok("--eu-color-muted") || theme.textMuted} onChange={(hex) => setTok("--eu-color-muted", hex)} contrastBg={bg} />
                        <EducoColorField label="On-brand" value={tok("--eu-color-on-brand") || "#ffffff"} onChange={(hex) => setTok("--eu-color-on-brand", hex)} contrastBg={tok("--eu-color-brand") || theme.primary} />
                      </div>
                    );
                  })()}
                  {node.tokenOverrides && Object.keys(node.tokenOverrides).length > 0 && (
                    <button onClick={() => onPatch({ tokenOverrides: undefined })} className="text-xs text-indigo-600 hover:text-indigo-500">Reset colours</button>
                  )}
                </Accordion>
              )}

              {node.type === "component" && (
                <Accordion title="Typography" icon={TypeIcon}>
                  <CompactSelect label="Font" ariaLabel="Font" value={node.fontFamily ?? ""} onChange={(v) => onPatch({ fontFamily: v || undefined })}
                    options={[{ value: "", label: "Theme default" }, ...familyOptions()]} />
                  <Range title="Text size" value={node.fontSize} min={10} max={48} fallback={16} onChange={(n) => onPatch({ fontSize: n })} unit="rem" />
                  <div className="grid grid-cols-2 gap-2">
                    <CompactSelect label="Boldness" ariaLabel="Boldness" value={node.fontWeight?.toString() ?? ""} onChange={(v) => onPatch({ fontWeight: v === "" ? undefined : Number(v) })} options={WEIGHT_OPTS.map(([v, l]) => ({ value: v, label: l }))} />
                    <CompactSelect label="Capitalisation" ariaLabel="Capitalisation" value={node.textTransform ?? "none"} onChange={(v) => onPatch({ textTransform: v as BoxNode["textTransform"] })} options={TRANSFORM_OPTS.map(([v, l]) => ({ value: v, label: l }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <CompactField label="Line spacing" ariaLabel="Line spacing" type="number" step={0.05} min={0.8} max={3} value={node.lineHeight ?? ""} placeholder="auto" onChange={(v) => onPatch({ lineHeight: v === "" ? undefined : Number(v) })} />
                    <CompactField label="Letter spacing" ariaLabel="Letter spacing" type="number" step={0.5} value={node.letterSpacing ?? ""} placeholder="0px" onChange={(v) => onPatch({ letterSpacing: v === "" ? undefined : Number(v) })} />
                  </div>
                  <p className="text-[0.5625rem] text-gray-400">Font &amp; size cascade into every item. For text <em>colour</em>, use “Component colours → Text”.</p>
                </Accordion>
              )}

              {node.type === "component" && (
                <Accordion title="Advanced CSS" icon={Sparkles} defaultOpen={false}>
                  <CompactTextarea label="Custom CSS declarations" ariaLabel="Advanced CSS" value={node.advancedCss ?? ""} onChange={(v) => onPatch({ advancedCss: v || undefined })} rows={4} placeholder={"letter-spacing: .02em;\nbackdrop-filter: blur(6px);"} textareaClassName="font-mono text-[0.6875rem]"
                    helpText={<>One <code>property: value;</code> per line. Applied to the component; sanitised on export (no selectors, @-rules, or remote URLs).</>} />
                </Accordion>
              )}

              {textual && (
                <Accordion title="Text style" icon={TypeIcon}>
                  <Range title="Text size" value={node.fontSize} min={10} max={72} fallback={node.type === "heading" ? 32 : 16} onChange={(n) => onPatch({ fontSize: n })} unit="rem" />
                  <ColorRow title="Text colour" value={node.color} fallback={theme.text} onSelect={(c) => onPatch({ color: c })} />
                  <CompactSelect label="Font" ariaLabel="Font" value={node.fontFamily ?? ""} onChange={(v) => onPatch({ fontFamily: v || undefined })}
                    options={[{ value: "", label: "Theme default" }, ...familyOptions()]} />
                  <div className="grid grid-cols-2 gap-2">
                    <CompactSelect label="Boldness" ariaLabel="Boldness" value={node.fontWeight?.toString() ?? ""} onChange={(v) => onPatch({ fontWeight: v === "" ? undefined : Number(v) })} options={WEIGHT_OPTS.map(([v, l]) => ({ value: v, label: l }))} />
                    <CompactSelect label="Capitalisation" ariaLabel="Capitalisation" value={node.textTransform ?? "none"} onChange={(v) => onPatch({ textTransform: v as BoxNode["textTransform"] })} options={TRANSFORM_OPTS.map(([v, l]) => ({ value: v, label: l }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <CompactField label="Line spacing" ariaLabel="Line spacing" type="number" step={0.05} min={0.8} max={3} value={node.lineHeight ?? ""} placeholder="auto" onChange={(v) => onPatch({ lineHeight: v === "" ? undefined : Number(v) })} />
                    <CompactField label="Letter spacing" ariaLabel="Letter spacing" type="number" step={0.5} value={node.letterSpacing ?? ""} placeholder="0px" onChange={(v) => onPatch({ letterSpacing: v === "" ? undefined : Number(v) })} />
                  </div>
                  <AlignRow />
                  <div className="flex items-center gap-1">
                    <button onClick={() => onPatch({ bold: !(node.bold ?? (node.type === "heading")) })} aria-label="Bold" aria-pressed={node.bold ?? (node.type === "heading")} className={`px-2 py-1 rounded-md font-bold text-sm ${(node.bold ?? (node.type === "heading")) ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"}`}>B</button>
                    <button onClick={() => onPatch({ italic: !node.italic })} aria-label="Italic" aria-pressed={!!node.italic} className={iconBtn(!!node.italic)}><Italic className="w-4 h-4" /></button>
                    <button onClick={() => onPatch({ underline: !node.underline })} aria-label="Underline" aria-pressed={!!node.underline} className={iconBtn(!!node.underline)}><Underline className="w-4 h-4" /></button>
                  </div>
                </Accordion>
              )}
            </>
          )}
        </div>
      )}

      {/* ─────────────── PER-DEVICE ─────────────── */}
      {tab === "device" && (
        <div className="space-y-3">
          <p className="text-[0.6875rem] text-gray-400 flex items-start gap-1.5"><MonitorSmartphone className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {breakpoint === "base" ? "Switch the screen-size buttons at the top to Tablet or Mobile to fine-tune those sizes. Text and content stay the same everywhere." : `You're editing ${bpLabel}. Size, spacing and layout you change now only apply here.`}</p>
          <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><input type="checkbox" checked={!!node.hidden} onChange={(e) => onPatch({ hidden: e.target.checked || undefined })} /> Hidden {breakpoint === "base" ? "everywhere" : `on ${breakpoint}`}</label>
        </div>
      )}
    </div>
  );
}
