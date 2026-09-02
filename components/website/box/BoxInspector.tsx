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
import { FONT_CHOICES } from "@/lib/site-storage";
import type { BoxNode, FlexAlign, FlexJustify } from "@/lib/box-model";
import { isContainer, isFloating } from "@/lib/box-model";
import { getPresets, presetKindFor } from "@/lib/box-presets";
import { ICON_SET, ICON_NAMES } from "./icons";
import { Tabs, Accordion, Segmented, type SegOption } from "./ui";
import { ColorPickerPopover, colorToCSS } from "@/components/shared/ColorPalettePicker";

const inputCls = "w-full text-sm px-2.5 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none";
const label = "text-[0.6875rem] font-medium text-gray-500 dark:text-gray-400";

const toRem = (px: number) => +(px / 10).toFixed(2);
const fromRem = (rem: number) => Math.round(rem * 10);

// Plain-language option lists (value = the real CSS token, label = what the user reads).
const JUSTIFY_OPTS: [FlexJustify, string][] = [["start", "Start"], ["center", "Center"], ["end", "End"], ["between", "Spread out"], ["around", "Even gaps"]];
const ALIGN_OPTS: [FlexAlign, string][] = [["stretch", "Fill"], ["start", "Start"], ["center", "Center"], ["end", "End"]];
const WEIGHT_OPTS: [string, string][] = [["", "Auto"], ["300", "Light"], ["400", "Normal"], ["500", "Medium"], ["600", "Semibold"], ["700", "Bold"], ["800", "Extra bold"], ["900", "Black"]];
const TRANSFORM_OPTS: [NonNullable<BoxNode["textTransform"]>, string][] = [["none", "Normal"], ["uppercase", "UPPERCASE"], ["lowercase", "lowercase"], ["capitalize", "Capitalise"]];
const SHADOW_OPTS: SegOption<string>[] = [{ value: "none", label: "None" }, { value: "sm", label: "Soft" }, { value: "md", label: "Medium" }, { value: "lg", label: "Strong" }, { value: "xl", label: "Bold" }];
const FONT_LABEL = (f: string) => f.replace(/['"]/g, "").split(",")[0];

function Range({ title, value, min, max, fallback, onChange, unit = "px" }: { title: string; value?: number; min: number; max: number; fallback: number; onChange: (n: number) => void; unit?: string }) {
  const v = value ?? fallback;
  const disp = unit === "rem" ? `${toRem(v)}rem` : `${v}${unit}`;
  return <label className="block"><span className={label}>{title}: {disp}</span><input type="range" min={min} max={max} value={v} onChange={(e) => onChange(Number(e.target.value))} aria-label={title} className="w-full mt-1 accent-indigo-600" /></label>;
}

function ColorRow({ title, value, fallback, onSelect, mode = "matrix" }: { title: string; value?: string; fallback: string; onSelect: (c: string) => void; mode?: "matrix" | "both" }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className={label}>{title}</span>
      <ColorPickerPopover selectedColor={value || fallback} onSelect={onSelect} mode={mode} label={title} align="right" width={272} portal>
        <button aria-label={title} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm" style={{ background: colorToCSS(value || fallback) }} />
      </ColorPickerPopover>
    </div>
  );
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
      {isCustom && <input value={w} onChange={(e) => onPatch({ width: e.target.value })} placeholder="50% or 240px" aria-label="Custom width" className={inputCls} />}
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
      <label className="block"><span className={label}>{title}: {toRem(g)}rem (all sides)</span>
        <input type="range" min={0} max={max} value={g} onChange={(e) => setPx(base, Number(e.target.value))} aria-label={`${title} all sides`} className="w-full mt-1 accent-indigo-600" />
      </label>
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
                      <label key={key} className="flex flex-col gap-0.5"><span className={label}>{lab}</span>
                        <input type="number" step={0.5} value={node[key] !== undefined ? Math.round((node[key] as number) * 10) / 10 : 0} onChange={(e) => onPatch({ [key]: Number(e.target.value) })} aria-label={`${lab} position`} className={inputCls} />
                      </label>
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
                  <label className="block"><span className={label}>Position blocks</span>
                    <select value={node.justify ?? "start"} onChange={(e) => onPatch({ justify: e.target.value as FlexJustify })} aria-label="Position blocks" className={inputCls}>
                      {JUSTIFY_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><input type="checkbox" checked={!!node.wrap} onChange={(e) => onPatch({ wrap: e.target.checked })} /> Let blocks wrap to a new line</label>
                </>
              )}
              <label className="block"><span className={label}>Line up (across)</span>
                <select value={node.align ?? "stretch"} onChange={(e) => onPatch({ align: e.target.value as FlexAlign })} aria-label="Line up" className={inputCls}>
                  {ALIGN_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
              <Range title="Space between blocks" value={node.gap} min={0} max={64} fallback={16} onChange={(n) => onPatch({ gap: n })} unit="rem" />
            </Accordion>
          )}

          {inGrid && (
            <Accordion title="Grid cell" icon={LayoutGrid}>
              <div className="grid grid-cols-2 gap-2">
                <label className="block"><span className={label}>Columns wide</span>
                  <input type="number" min={1} max={12} value={node.colSpan ?? 1} onChange={(e) => onPatch({ colSpan: Math.max(1, Number(e.target.value) || 1) })} aria-label="Columns wide" className={inputCls} />
                </label>
                <label className="block"><span className={label}>Rows tall</span>
                  <input type="number" min={1} max={12} value={node.rowSpan ?? 1} onChange={(e) => onPatch({ rowSpan: Math.max(1, Number(e.target.value) || 1) })} aria-label="Rows tall" className={inputCls} />
                </label>
              </div>
            </Accordion>
          )}

          <Accordion title="Size" icon={Maximize2}>
            <WidthControl node={node} onPatch={onPatch} />
            <label className="block"><span className={label}>Height</span>
              <input value={node.height ?? ""} onChange={(e) => onPatch({ height: e.target.value || undefined })} placeholder="auto, 300px or 40vh" aria-label="Height" className={inputCls} />
            </label>
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
              <label className="block"><span className={label}>Border style</span>
                <select value={node.borderStyle ?? "solid"} onChange={(e) => onPatch({ borderStyle: e.target.value as BoxNode["borderStyle"] })} aria-label="Border style" className={inputCls}>
                  {[["solid", "Solid"], ["dashed", "Dashed"], ["dotted", "Dotted"]].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
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
            <ColorRow title="Background colour" value={node.background} fallback={theme.surface} onSelect={(c) => onPatch({ background: c })} mode="both" />
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
              <input value={node.anchor ?? ""} onChange={(e) => onPatch({ anchor: e.target.value.replace(/\s+/g, "-").toLowerCase() || undefined })} placeholder="e.g. pricing → link with #pricing" aria-label="Bookmark name" className={inputCls} />
              <span className="text-[0.5625rem] text-gray-400">Give this block a name so a button can jump straight to it.</span>
            </label>
          </Accordion>

          {container ? (
            <p className="text-xs text-gray-400 text-center px-2 py-4">This is a container. Drag blocks from the left onto it, or use “Add a block inside”.</p>
          ) : (
            <>
              <Accordion title="Content" icon={TypeIcon}>
                {(node.type === "text" || node.type === "heading" || node.type === "button") && (
                  <label className="block"><span className={label}>Text</span>
                    <textarea value={node.text ?? ""} onChange={(e) => onPatch({ text: e.target.value })} rows={2} aria-label="Text" className={inputCls} />
                  </label>
                )}
                {node.type === "button" && (
                  <>
                    <label className="block"><span className={label}>Link (web address or #bookmark)</span>
                      <input value={node.href ?? ""} onChange={(e) => onPatch({ href: e.target.value })} placeholder="https://… or #pricing" aria-label="Link" className={inputCls} />
                    </label>
                    {pages && pages.filter((p) => p.id !== currentPageId).length > 0 && (
                      <label className="block"><span className={label}>…or jump to a page</span>
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
                  <label className="block"><span className={label}>Video link</span>
                    <input value={node.src ?? ""} onChange={(e) => onPatch({ src: e.target.value })} placeholder="YouTube, Vimeo or .mp4 link" aria-label="Video URL" className={inputCls} />
                    <span className="text-[0.5625rem] text-gray-400">YouTube/Vimeo links play automatically; a direct .mp4 plays inline.</span>
                  </label>
                )}
                {node.type === "embed" && (
                  <label className="block"><span className={label}>Embed code</span>
                    <textarea value={node.html ?? ""} onChange={(e) => onPatch({ html: e.target.value })} rows={4} placeholder="Paste an <iframe> or any HTML" aria-label="Embed code" className={`${inputCls} font-mono text-[0.6875rem]`} />
                  </label>
                )}
                {node.type === "icon" && (
                  <>
                    <div className="space-y-1.5">
                      <span className={label}>Choose an icon</span>
                      <input value={iconQuery} onChange={(e) => setIconQuery(e.target.value)} placeholder="Search icons…" aria-label="Search icons" className={inputCls} />
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
                    <label className="block"><span className={label}>Items (one per line)</span>
                      <textarea value={(node.listItems ?? []).join("\n")} onChange={(e) => onPatch({ listItems: e.target.value.split("\n") })} rows={4} aria-label="List items" className={inputCls} />
                    </label>
                  </>
                )}
              </Accordion>

              {textual && (
                <Accordion title="Text style" icon={TypeIcon}>
                  <Range title="Text size" value={node.fontSize} min={10} max={72} fallback={node.type === "heading" ? 32 : 16} onChange={(n) => onPatch({ fontSize: n })} unit="rem" />
                  <ColorRow title="Text colour" value={node.color} fallback={theme.text} onSelect={(c) => onPatch({ color: c })} />
                  <label className="block"><span className={label}>Font</span>
                    <select value={node.fontFamily ?? ""} onChange={(e) => onPatch({ fontFamily: e.target.value || undefined })} aria-label="Font" className={inputCls}>
                      <option value="">Theme default</option>
                      {FONT_CHOICES.map((f) => <option key={f} value={f}>{FONT_LABEL(f)}</option>)}
                    </select>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block"><span className={label}>Boldness</span>
                      <select value={node.fontWeight?.toString() ?? ""} onChange={(e) => onPatch({ fontWeight: e.target.value === "" ? undefined : Number(e.target.value) })} aria-label="Boldness" className={inputCls}>
                        {WEIGHT_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </label>
                    <label className="block"><span className={label}>Capitalisation</span>
                      <select value={node.textTransform ?? "none"} onChange={(e) => onPatch({ textTransform: e.target.value as BoxNode["textTransform"] })} aria-label="Capitalisation" className={inputCls}>
                        {TRANSFORM_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block"><span className={label}>Line spacing</span>
                      <input type="number" step={0.05} min={0.8} max={3} value={node.lineHeight ?? ""} placeholder="auto" onChange={(e) => onPatch({ lineHeight: e.target.value === "" ? undefined : Number(e.target.value) })} aria-label="Line spacing" className={inputCls} />
                    </label>
                    <label className="block"><span className={label}>Letter spacing</span>
                      <input type="number" step={0.5} value={node.letterSpacing ?? ""} placeholder="0px" onChange={(e) => onPatch({ letterSpacing: e.target.value === "" ? undefined : Number(e.target.value) })} aria-label="Letter spacing" className={inputCls} />
                    </label>
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
