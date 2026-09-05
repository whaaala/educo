"use client";

/**
 * Properties panel for the selected block — "clean & airy" design, organised into TABS (Design · Content ·
 * Per-device) with collapsible cards. Every label is PLAIN LANGUAGE (a normal user, not a developer):
 * "Free arrange / Grid", "Top-to-bottom / Side-by-side", "Inner/Outer spacing", "See-through", "Tilt", etc.
 * — the real CSS still runs under the hood. Colours reuse the shared ColorPickerPopover.
 */

import { useState, useRef } from "react";
import { Plus, X, Rows3, Columns3, Upload, AlignLeft, AlignCenter, AlignRight, Layers, Move, BringToFront, SendToBack, ChevronUp, ChevronDown, Italic, Underline, LayoutGrid, Maximize2, Sparkles, Paintbrush, Ruler, Link2, Type as TypeIcon, MonitorSmartphone, Bookmark, Lock, LockOpen } from "lucide-react";
import type { SiteTheme } from "@/lib/site-storage";
import type { BoxNode, FlexAlign, FlexJustify, AccPartStyle } from "@/lib/box-model";
import { isContainer, isFloating, isCssBg, addItem, removeItem, moveItem, updateItem, addChildItem, updateChildItem, removeChildItem, moveChildItem , isMultiItemComponent } from "@/lib/box-model";
import { ACCORDION_DESIGNS, ACCORDION_DESIGN_COUNT } from "@/lib/educo-ui/accordions";
import { COMPONENT_REGISTRY, isRegistryComponent, defaultComponentFields } from "@/lib/educo-ui/registry";
import { presetVariants, applyPresetVariant } from "@/lib/component-catalogue";
import { familyOptions } from "@/lib/educo-ui/fonts";
import { getPresets, presetKindFor } from "@/lib/box-presets";
import IconPicker from "@/components/shared/IconPicker";
import BackgroundPicker from "@/components/shared/BackgroundPicker";
import GradientEditor, { parseGradient } from "@/components/shared/GradientEditor";
import { Tabs, Accordion, Segmented, type SegOption } from "./ui";
import EducoColorField from "@/components/shared/EducoColorField";
import Slider from "@/components/shared/Slider";
import CompactField, { COMPACT_INPUT_CLS } from "@/components/shared/CompactField";
import CompactSelect from "@/components/shared/CompactSelect";
import CompactTextarea from "@/components/shared/CompactTextarea";

const label = "text-[0.6875rem] font-semibold text-muted";
// A clean, token-driven selectable chip (Styles / design variations) — re-skins with every theme.
const chipCls = (on: boolean) => `px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${on ? "border-brand bg-brand/10 text-brand" : "border-line text-ink hover:border-brand/50 hover:bg-brand/5 hover:text-brand"}`;

const toRem = (px: number) => +(px / 10).toFixed(2);
const fromRem = (rem: number) => Math.round(rem * 10);

// Plain-language option lists (value = the real CSS token, label = what the user reads).
const JUSTIFY_OPTS: [FlexJustify, string][] = [["start", "Start"], ["center", "Center"], ["end", "End"], ["between", "Spread out"], ["around", "Even gaps"]];
const ALIGN_OPTS: [FlexAlign, string][] = [["stretch", "Fill"], ["start", "Start"], ["center", "Center"], ["end", "End"]];

// Alert-component choosers (used in the inspector top + the ask-on-add chooser). Mirror the plan's taxonomy.
const ALERT_SEVERITIES = [
  { value: "info", label: "Info" }, { value: "success", label: "Success" }, { value: "warning", label: "Warning" },
  { value: "danger", label: "Danger" }, { value: "neutral", label: "Neutral" }, { value: "brand", label: "Brand" },
];
const ALERT_FORMS = [
  { value: "inline", label: "Inline" }, { value: "banner", label: "Banner (full width)" }, { value: "callout", label: "Callout" }, { value: "toast", label: "Toast (stacked)" },
];
const ALERT_TREATMENTS: { id: string; label: string }[] = [
  { id: "", label: "Soft" }, { id: "--solid", label: "Solid" }, { id: "--outline", label: "Outline" }, { id: "--accent", label: "Left accent" },
  { id: "--top", label: "Top accent" }, { id: "--card", label: "Card" }, { id: "--glass", label: "Glass" },
];
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


/** Point-and-click styling for ONE part (Header or Content) of a single accordion item:
 *  text colour, background colour, font family, font size — no CSS typing required. */
function AccPartDesign({ title, ariaPrefix, style, onChange, moveLabel = "content" }: { title: string; ariaPrefix: string; style?: AccPartStyle; onChange: (patch: Partial<AccPartStyle>) => void; moveLabel?: string }) {
  const s = style ?? {};
  return (
    <div className="space-y-1.5 rounded-lg border border-line p-1.5">
      <div className="text-[0.625rem] font-semibold uppercase tracking-wide text-muted">{title}</div>
      <div className="grid grid-cols-2 gap-1.5">
        <EducoColorField label="Text" ariaLabel={`${ariaPrefix} text colour`} value={s.color ?? ""} onChange={(hex) => onChange({ color: hex })} onClear={() => onChange({ color: undefined })} />
        <EducoColorField label="Fill" ariaLabel={`${ariaPrefix} background colour`} value={s.background ?? ""} onChange={(hex) => onChange({ background: hex })} onClear={() => onChange({ background: undefined })} />
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <CompactSelect label="Font" ariaLabel={`${ariaPrefix} font`} value={s.fontFamily ?? ""} onChange={(v) => onChange({ fontFamily: v || undefined })} options={[{ value: "", label: "Default" }, ...familyOptions()]} />
        {/* Size in REM (scales with the base size — Responsive Field Guide), entered as px-like number */}
        <CompactField label="Size" ariaLabel={`${ariaPrefix} size`} type="number" min={8} max={96} value={s.fontSize ? Math.round(parseFloat(s.fontSize) * (s.fontSize.endsWith("rem") ? 10 : 1)) : ""} placeholder="auto" onChange={(v) => onChange({ fontSize: v === "" ? undefined : `${toRem(Number(v))}rem` })} />
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[0.6875rem] text-muted">Align</span>
        <Segmented ariaLabel={`${ariaPrefix} position`} value={s.align ?? ""}
          onChange={(v) => onChange({ align: (v || undefined) as AccPartStyle["align"] })}
          options={[
            { value: "left", Icon: AlignLeft, title: "Left" },
            { value: "center", Icon: AlignCenter, title: "Center" },
            { value: "right", Icon: AlignRight, title: "Right" },
          ]} />
      </div>
      {/* Free positioning: nudge THIS part's content up/down/left/right within its area (rem). The gap to the
          other pieces in the row is preserved (transform shifts visually without collapsing the layout). */}
      <div className="grid grid-cols-2 gap-1.5">
        <CompactField label={`Move ${moveLabel} ← → (rem)`} ariaLabel={`${ariaPrefix} move X`} type="number" step={0.5} value={s.pos?.x ?? ""} placeholder="0"
          onChange={(v) => onChange({ pos: { x: v === "" ? 0 : Number(v), y: s.pos?.y ?? 0 } })} />
        <CompactField label={`Move ${moveLabel} ↑ ↓ (rem)`} ariaLabel={`${ariaPrefix} move Y`} type="number" step={0.5} value={s.pos?.y ?? ""} placeholder="0"
          onChange={(v) => onChange({ pos: { x: s.pos?.x ?? 0, y: v === "" ? 0 : Number(v) } })} />
      </div>
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

/**
 * RULE P — the four-sided spacing of ONE ITEM inside a component: padding (inside the item) and margin
 * (around it), in rem. Same shape and feel as the block-level `SideSpacing`, so it reads as the same control;
 * it writes to the shared `ComponentItem` fields, so every component's items get it — a single-message
 * component's one message included.
 */
function ItemSideSpacing({ title, value, ariaPrefix, onChange }: {
  title: string;
  value?: import("@/lib/box-model").Side4;
  ariaPrefix: string;
  onChange: (next: import("@/lib/box-model").Side4 | undefined) => void;
}) {
  const set = (k: "t" | "r" | "b" | "l", raw: string) => {
    const next = { ...(value ?? {}) };
    if (raw === "") delete next[k]; else next[k] = Number(raw);
    onChange(Object.keys(next).length ? next : undefined); // no keys ⇒ drop the field entirely
  };
  return (
    <div className="space-y-1">
      <span className="text-[0.6875rem] text-muted">{title}</span>
      <div className="grid grid-cols-4 gap-1">
        {([["Top", "t"], ["Right", "r"], ["Bottom", "b"], ["Left", "l"]] as const).map(([lab, k]) => (
          <label key={k} className="flex flex-col items-center gap-0.5">
            <span className="text-[0.5625rem] uppercase tracking-wide text-gray-400">{lab}</span>
            <input
              type="number" step={0.1} min={0}
              value={value?.[k] ?? ""}
              placeholder="0"
              aria-label={`${ariaPrefix} ${title.toLowerCase()} ${lab.toLowerCase()}`}
              onChange={(e) => set(k, e.target.value)}
              className="w-full text-xs px-1 py-1 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent text-center outline-none focus:ring-1 focus:ring-indigo-400"
            />
          </label>
        ))}
      </div>
    </div>
  );
}

const iconBtn = (on: boolean) => `p-1.5 rounded-lg transition-colors ${on ? "bg-brand/15 text-brand" : "text-muted hover:bg-surface-2 hover:text-ink"}`;

/** A tiny LIVE preview of one accordion design — the real `.eu-accordion` CSS, rendered small, so the design
 *  gallery is WYSIWYG. Non-interactive; scaled down so a 2-item accordion fits inside a picker tile. */
function AccPreview({ id }: { id: string }) {
  return (
    <span className="eu-root" aria-hidden="true" style={{ display: "block", width: "250%", transform: "scale(0.4)", transformOrigin: "top left", pointerEvents: "none", fontSize: "11px" }}>
      <span className={`eu-accordion eu-accordion${id}`} style={{ display: "grid", gap: "5px" }}>
        <details className="eu-accordion__item" open><summary className="eu-accordion__header">Question<span className="eu-accordion__meta">FAQ</span></summary><div className="eu-accordion__body">A short answer.</div></details>
        <details className="eu-accordion__item"><summary className="eu-accordion__header">Another question</summary></details>
      </span>
    </span>
  );
}

export default function BoxInspector({ node, theme, onPatch, onAddChild, onFloat, onUnfloat, onLayer, onAlignInRow, rowJustify, canFloat = true, inGrid = false, breakpoint = "base", overridden = false, onResetOverride, pages, currentPageId }: {
  node: BoxNode;
  theme: SiteTheme;
  onPatch: (patch: Partial<BoxNode>) => void;
  onAddChild?: () => void;
  onFloat?: () => void;
  onUnfloat?: () => void;
  onLayer?: (dir: "front" | "forward" | "backward" | "back") => void;
  onAlignInRow?: (justify: FlexJustify) => void; // position this block within its row (start/center/end)
  rowJustify?: FlexJustify;                        // its current position (parent row's justify-content)
  canFloat?: boolean;
  inGrid?: boolean;
  breakpoint?: "base" | "tablet" | "mobile";
  overridden?: boolean;
  onResetOverride?: () => void;
  pages?: { id: string; name: string }[];
  currentPageId?: string;
}) {
  const [tab, setTab] = useState<"design" | "content" | "device">("design");
  const [accSel, setAccSel] = useState<string[]>([]); // accordion items ticked for grouping
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
    <div className="p-3.5 space-y-3">
      <div className="text-[0.6875rem] text-muted px-0.5">Editing: <b className="text-ink capitalize">{typeLabel}</b></div>

      {container && onAddChild && (
        <button onClick={onAddChild} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-brand to-brand-600 text-brand-fg shadow-sm hover:brightness-105 transition">
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
        <div className="border-b border-gray-100 dark:border-white/5 pb-3.5 space-y-2">
          <div className="flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-wider text-muted">
            <span className="grid place-items-center w-6 h-6 rounded-lg bg-gray-100 dark:bg-white/5 text-muted"><Sparkles className="w-3.5 h-3.5" strokeWidth={2} /></span>
            Styles
          </div>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p) => <button key={p.id} onClick={() => onPatch(p.patch)} aria-label={`Style ${p.label}`} className={chipCls(false)}>{p.label}</button>)}
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
              <button
                onClick={() => onPatch({ locked: !node.locked })}
                aria-pressed={!!node.locked}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium border transition-colors ${node.locked ? "bg-amber-500 border-transparent text-white" : "border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"}`}
                title={node.locked ? "Unlock (Ctrl+L)" : "Lock position & size (Ctrl+L)"}
              >{node.locked ? <><LockOpen className="w-3.5 h-3.5" /> Unlock position &amp; size</> : <><Lock className="w-3.5 h-3.5" /> Lock position &amp; size</>}</button>
              {node.locked && <p className="text-[0.625rem] text-gray-400 flex items-start gap-1"><Lock className="w-3 h-3 mt-0.5 shrink-0" /> Frozen — can't be moved or resized. Content &amp; colours stay editable.</p>}
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
            {!container && onAlignInRow && (
              <div className="space-y-1">
                <span className={label}>Position in row</span>
                <Segmented full ariaLabel="Position in row" value={rowJustify ?? "start"} onChange={(v) => onAlignInRow(v as FlexJustify)}
                  options={[{ value: "start", label: "Left", Icon: AlignLeft }, { value: "center", label: "Center", Icon: AlignCenter }, { value: "end", label: "Right", Icon: AlignRight }]} />
              </div>
            )}
            {/* Typing a height (or clearing it) also clears any shrink a DRAG applied: the scale exists only to make
                content fit a box you dragged smaller than it, so a height set by hand starts from full-size text
                again. Without this the text stayed small with no visible reason once the height was cleared. */}
            <CompactField label="Height" ariaLabel="Height" value={node.height ?? ""} onChange={(v) => onPatch({ height: v || undefined, contentScale: undefined })} placeholder="auto, 300px or 40vh" />
            {node.contentScale != null && node.contentScale < 1 && (
              <div className="flex items-center justify-between gap-2 rounded-lg bg-surface-2 px-2 py-1.5">
                <span className="text-[0.6875rem] text-muted">
                  Text scaled to {Math.round(node.contentScale * 100)}% so it fits this size
                </span>
                <button
                  onClick={() => onPatch({ contentScale: undefined })}
                  aria-label="Reset text size to full"
                  className="text-[0.6875rem] font-semibold text-brand hover:underline"
                >
                  Reset
                </button>
              </div>
            )}
            {!container && (
              <div className="space-y-1">
                <span className={label}>Content position</span>
                <div className="inline-grid grid-cols-3 gap-0.5 p-1 rounded-lg border border-gray-200 dark:border-white/10">
                  {(["start", "center", "end"] as const).map((y) => (["start", "center", "end"] as const).map((x) => {
                    const on = (node.contentX ?? "start") === x && (node.contentY ?? "start") === y;
                    return (
                      <button key={`${y}-${x}`} aria-label={`Content ${y === "start" ? "top" : y === "end" ? "bottom" : "middle"} ${x === "start" ? "left" : x === "end" ? "right" : "center"}`}
                        onClick={() => onPatch({ contentX: x, contentY: y })}
                        className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${on ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"}`}>
                        <span className="block w-2 h-2 rounded-sm bg-current" />
                      </button>
                    );
                  }))}
                </div>
              </div>
            )}
            <label className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
              <input type="checkbox" checked={!!node.clip} onChange={(e) => onPatch({ clip: e.target.checked })} className="mt-0.5" />
              <span>Trim to size <span className="text-gray-400">— by default a block grows to fit its content; tick this to force a smaller size and hide the overflow.</span></span>
            </label>
          </Accordion>

          <Accordion title="Spacing" icon={Ruler}>
            {(container || node.type === "component") && <SideSpacing title="Inner spacing" node={node} base="padding" sides={["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]} onPatch={onPatch} />}
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
            {/* Band height — a friendly way to give an EMPTY section a visible height (so its background shows)
                without adding content. 0 = auto (hug content). Sets min-height so the section still grows. */}
            {container && (
              <Slider label="Band height" value={node.minHeight ?? 0} min={0} max={720} step={8}
                onChange={(n) => onPatch({ minHeight: n === 0 ? undefined : n })}
                formatValue={(x) => (x === 0 ? "auto" : `${toRem(x)}rem`)} />
            )}
            {/* Library of ready-made, self-contained gradients / mesh / patterns (the parallel of the icon library).
                NOTE: a <div>, NOT a <label> — a <label> wrapping the picker button would double-fire its click. */}
            <div className="space-y-1"><span className={label}>Background library</span>
              <BackgroundPicker ariaLabel="Background library" value={node.bgImage}
                onSelect={(p) => onPatch({ bgImage: p.css, bgTile: p.tile, bgSize: undefined })}
                onSelectPhoto={(url) => onPatch({ bgImage: url, bgTile: undefined, bgSize: "cover" })}
                onClear={() => onPatch({ bgImage: undefined, bgTile: undefined, bgOverlay: undefined })} />
            </div>
            {/* Photo: paste a URL or upload (data URL) */}
            <CompactField ariaLabel="Background image URL" value={node.bgImage && /^(https?:|data:)/.test(node.bgImage) ? node.bgImage : ""} placeholder="Paste an image URL…" onChange={(v) => onPatch({ bgImage: v || undefined, bgTile: undefined })} />
            <button onClick={() => fileRef.current?.click()} className="w-full flex items-center justify-center gap-2 text-sm px-3 py-2 rounded-lg border border-dashed border-gray-300 dark:border-white/15 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200"><Upload className="w-3.5 h-3.5" /> {node.bgImage ? "Replace with an upload" : "Upload an image"}</button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" aria-label="Upload background image" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => onPatch({ bgImage: String(r.result), bgTile: undefined }); r.readAsDataURL(f); e.target.value = ""; }} />
            {node.bgImage && (
              <>
                {/* Fit / position / repeat — how the background sits on the block. Applies to a photo/URL
                    (a tiled pattern manages its own size/repeat via its tile). */}
                {!node.bgTile && /^(https?:|data:)/.test(node.bgImage) && (
                  <>
                    <CompactSelect label="Fit" ariaLabel="Background size / fit" value={node.bgSize ?? "cover"} onChange={(v) => onPatch({ bgSize: v || undefined })}
                      options={[{ value: "cover", label: "Fill (cover)" }, { value: "contain", label: "Fit (contain)" }, { value: "auto", label: "Original size" }, { value: "100% 100%", label: "Stretch" }]} />
                    <div className="grid grid-cols-2 gap-1.5">
                      <CompactSelect label="Position" ariaLabel="Background position" value={node.bgPosition ?? "center"} onChange={(v) => onPatch({ bgPosition: v || undefined })}
                        options={[{ value: "center", label: "Center" }, { value: "top", label: "Top" }, { value: "bottom", label: "Bottom" }, { value: "left", label: "Left" }, { value: "right", label: "Right" }, { value: "left top", label: "Top-left" }, { value: "right top", label: "Top-right" }, { value: "left bottom", label: "Bottom-left" }, { value: "right bottom", label: "Bottom-right" }]} />
                      <CompactSelect label="Repeat" ariaLabel="Background repeat" value={node.bgRepeat ?? "no-repeat"} onChange={(v) => onPatch({ bgRepeat: v || undefined })}
                        options={[{ value: "no-repeat", label: "None" }, { value: "repeat", label: "Tile" }, { value: "repeat-x", label: "Tile across" }, { value: "repeat-y", label: "Tile down" }, { value: "space", label: "Space" }, { value: "round", label: "Round" }]} />
                    </div>
                  </>
                )}
                {/* Patterns: let the user retune tile size + repeat too */}
                {node.bgTile && (
                  <div className="grid grid-cols-2 gap-1.5">
                    <CompactField label="Tile size" ariaLabel="Pattern tile size" value={node.bgTile} placeholder="24px 24px" onChange={(v) => onPatch({ bgTile: v || undefined })} />
                    <CompactSelect label="Repeat" ariaLabel="Pattern repeat" value={node.bgRepeat ?? "repeat"} onChange={(v) => onPatch({ bgRepeat: v || undefined })}
                      options={[{ value: "repeat", label: "Tile" }, { value: "repeat-x", label: "Tile across" }, { value: "repeat-y", label: "Tile down" }, { value: "no-repeat", label: "Once" }]} />
                  </div>
                )}
                {/* Friendly VISUAL editor for a gradient (type, angle, colour swatches, live preview). Raw CSS is
                    tucked into an Advanced disclosure. Patterns (not a simple gradient) fall back to the CSS box. */}
                {isCssBg(node.bgImage) && (parseGradient(node.bgImage) ? (
                  <div className="space-y-1">
                    <span className={label}>Edit gradient</span>
                    <GradientEditor value={node.bgImage} onChange={(css) => onPatch({ bgImage: css })} />
                    <details className="mt-1">
                      <summary className="cursor-pointer list-none text-[0.625rem] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">Advanced — edit the CSS</summary>
                      <CompactTextarea ariaLabel="Background CSS" value={node.bgImage} rows={2} onChange={(v) => onPatch({ bgImage: v || undefined })} textareaClassName="font-mono text-[0.6875rem]" />
                    </details>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <span className={label}>Edit pattern CSS</span>
                    <CompactTextarea ariaLabel="Background CSS" value={node.bgImage} rows={3} onChange={(v) => onPatch({ bgImage: v || undefined })} placeholder="repeating-linear-gradient(45deg, currentColor 0 1px, transparent 0 50%)" textareaClassName="font-mono text-[0.6875rem]" />
                  </div>
                ))}
                {/* Fixed = parallax-style locked background (any image) */}
                <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <input type="checkbox" checked={node.bgAttach === "fixed"} onChange={(e) => onPatch({ bgAttach: e.target.checked ? "fixed" : undefined })} aria-label="Fixed background (parallax)" className="accent-indigo-600" />
                  Fixed (parallax scroll)
                </label>
                <ColorRow title="Tint over background" value={node.bgOverlay} fallback="#00000066" onSelect={(c) => onPatch({ bgOverlay: c })} mode="both" />
                <button onClick={() => onPatch({ bgImage: undefined, bgTile: undefined, bgOverlay: undefined, bgPosition: undefined, bgRepeat: undefined, bgAttach: undefined })} className="text-[0.6875rem] text-red-500 hover:underline">Remove background</button>
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

          {/* TREE components (Card/Quote/Stat/Badge/Rating): the design gallery for a node that is
              structurally just a container. It sits ABOVE the container/element split on purpose — every tree
              preset IS a container, so inside the element branch this rendered for nothing at all. They are
              built as editable trees so every inner piece gets the full inspector; this gives them back the
              design gallery that the registry defined and nothing reachable could apply. */}
          {presetVariants(node.preset).length > 1 && (
            <Accordion title="Design" icon={TypeIcon}>
              <div className="flex flex-wrap gap-1" role="group" aria-label={`${node.preset} designs`}>
                {presetVariants(node.preset).map((v) => {
                  const on = (node.variant ?? "") === v.id;
                  return (
                    <button key={v.id || "default"} aria-pressed={on} aria-label={`${v.label} design`} title={v.label}
                      onClick={() => { const { id: _id, type: _type, ...patch } = applyPresetVariant(node, v.id); onPatch(patch); }}
                      className={chipCls(on)}>
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </Accordion>
          )}
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
                      {/* Same reusable IconPicker as the accordion — all four libraries (lucide + Brands + Google + Ionicons). */}
                      <IconPicker ariaLabel="Icon" value={node.icon ?? "Star"} allowClear={false} onChange={(v) => onPatch({ icon: v ?? "Star" })} />
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
                {node.type === "component" && (node.component === "accordion" || node.component === "alert") && (() => {
                  const isAcc = node.component === "accordion";
                  // An Alert is a single message (user decision, 2026-09-05) — it has item PARTS to style, but
                  // no list to add to, reorder or delete from, so those controls are not offered for it.
                  const isList = isMultiItemComponent(node.component);
                  return (
                  <>
                    {isAcc && (<>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={label}>Design</span>
                        <span className="text-[0.5625rem] text-gray-400">{ACCORDION_DESIGN_COUNT} styles · tap to apply</span>
                      </div>
                      {ACCORDION_DESIGNS.map((g) => (
                        <div key={g.group} className="space-y-1.5">
                          <div className="text-[0.5625rem] font-bold uppercase tracking-wider text-muted px-0.5">{g.group}</div>
                          <div className="grid grid-cols-2 gap-2" role="group" aria-label={`${g.group} accordion designs`}>
                            {g.items.map((v) => {
                              const on = (node.variant ?? "") === v.id;
                              return (
                                <button key={v.id || "boxed"} aria-pressed={on} aria-label={`${v.label} design`} title={v.label}
                                  onClick={() => onPatch({ variant: v.id })}
                                  className={`group flex flex-col gap-1 rounded-xl border p-1.5 text-left transition-colors ${on ? "border-brand bg-brand/10 ring-1 ring-brand/40" : "border-line hover:border-brand/50 hover:bg-brand/5"}`}>
                                  <span className="block h-12 overflow-hidden rounded-lg border border-line bg-surface-2">
                                    <AccPreview id={v.id} />
                                  </span>
                                  <span className={`block text-[0.6875rem] font-semibold text-center truncate ${on ? "text-brand" : "text-ink"}`}>{v.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><input type="checkbox" checked={!!node.accMultiOpen} onChange={(e) => onPatch({ accMultiOpen: e.target.checked })} /> Allow more than one open at once</label>
                    <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><input type="checkbox" checked={!!node.accShowAll} onChange={(e) => onPatch({ accShowAll: e.target.checked })} /> Show “Expand all / Collapse all” controls</label>
                    <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><input type="checkbox" aria-label="Search box" checked={!!node.accSearch} onChange={(e) => onPatch({ accSearch: e.target.checked })} /> Show a search / filter box</label>
                    <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><input type="checkbox" aria-label="FAQ SEO markup" checked={!!node.accFaqSchema} onChange={(e) => onPatch({ accFaqSchema: e.target.checked })} /> This is a FAQ — add SEO rich‑results markup</label>
                    {node.variant === "--split" && (
                      <CompactField label="Split panel image" ariaLabel="Split panel image" value={node.accSplitMedia ?? ""} onChange={(v) => onPatch({ accSplitMedia: v || undefined })} placeholder="Image URL for the panel beside the items" />
                    )}
                    </>)}
                    {!isAcc && (
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between"><span className={label}>Design (treatment)</span><span className="text-[0.5625rem] text-gray-400">tap to apply</span></div>
                          <div className="grid grid-cols-2 gap-1.5" role="group" aria-label="Alert treatments">
                            {ALERT_TREATMENTS.map((t) => { const on = (node.variant ?? "") === t.id; return (
                              <button key={t.id || "soft"} type="button" aria-pressed={on} aria-label={`${t.label} treatment`} onClick={() => onPatch({ variant: t.id })}
                                className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors ${on ? "border-brand bg-brand/10 text-brand ring-1 ring-brand/40" : "border-line text-ink hover:border-brand/50 hover:bg-brand/5"}`}>{t.label}</button>
                            ); })}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <CompactSelect label="Severity" ariaLabel="Alert severity" value={node.alertSeverity ?? "info"} onChange={(v) => onPatch({ alertSeverity: v })} options={ALERT_SEVERITIES} />
                          <CompactSelect label="Form factor" ariaLabel="Alert form factor" value={node.alertForm ?? "inline"} onChange={(v) => onPatch({ alertForm: v })} options={ALERT_FORMS} />
                        </div>
                        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"><input type="checkbox" checked={!!node.alertDismiss} onChange={(e) => onPatch({ alertDismiss: e.target.checked })} aria-label="Show a dismiss (×) button" /> Show a dismiss (×) button on each</label>
                      </>
                    )}
                    <div className="space-y-2">
                      <span className={label}>Items</span>
                      {(isList ? (node.items ?? []) : (node.items ?? []).slice(0, 1)).map((it, i) => (
                        <div key={it.id} className="rounded-lg border border-gray-200 dark:border-white/10 p-2 space-y-1.5">
                          <div className="flex items-center gap-1">
                            <div className="flex-1"><CompactField ariaLabel={`Item ${i + 1} title`} value={it.title} onChange={(v) => onPatch({ items: updateItem(node, it.id, { title: v }).items })} placeholder="Question / title" /></div>
                            {isList && <button onClick={() => onPatch({ items: moveItem(node, it.id, -1).items })} disabled={i === 0} aria-label="Move item up" className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>}
                            {isList && <button onClick={() => onPatch({ items: moveItem(node, it.id, 1).items })} disabled={i === (node.items?.length ?? 0) - 1} aria-label="Move item down" className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>}
                          </div>
                          <CompactTextarea ariaLabel={`Item ${i + 1} body`} value={it.body} onChange={(v) => onPatch({ items: updateItem(node, it.id, { body: v }).items })} rows={2} placeholder="Answer / body — supports **bold**, *italic*, [links](https://…), and - bullet lists" />
                          <div className="grid grid-cols-2 gap-1">
                            <CompactField ariaLabel={`Item ${i + 1} meta`} value={it.meta ?? ""} onChange={(v) => onPatch({ items: updateItem(node, it.id, { meta: v || undefined }).items })} placeholder="Meta (e.g. $10)" />
                            <CompactField ariaLabel={`Item ${i + 1} image`} value={it.media ?? ""} onChange={(v) => onPatch({ items: updateItem(node, it.id, { media: v || undefined }).items })} placeholder="Image URL" />
                          </div>
                          {it.media ? <CompactField ariaLabel={`Item ${i + 1} image alt text`} value={it.mediaAlt ?? ""} onChange={(v) => onPatch({ items: updateItem(node, it.id, { mediaAlt: v || undefined }).items })} placeholder="Image alt text (describe it for accessibility / SEO; leave blank if decorative)" /> : null}
                          <IconPicker ariaLabel={`Item ${i + 1} icon`} value={it.icon} onChange={(v) => onPatch({ items: updateItem(node, it.id, { icon: v }).items })} />
                          {it.icon && (
                            <div className="space-y-1.5 rounded-lg border border-line p-1.5">
                              <div className="text-[0.625rem] font-semibold uppercase tracking-wide text-muted">Icon — colour · size · position</div>
                              <div className="grid grid-cols-2 gap-1.5">
                                <EducoColorField label="Icon colour" ariaLabel={`Item ${i + 1} icon colour`} value={it.iconColor ?? ""} onChange={(hex) => onPatch({ items: updateItem(node, it.id, { iconColor: hex }).items })} onClear={() => onPatch({ items: updateItem(node, it.id, { iconColor: undefined }).items })} />
                                <CompactField label="Icon size" ariaLabel={`Item ${i + 1} icon size`} type="number" min={8} max={96} value={it.iconSize ? Math.round(parseFloat(it.iconSize) * (it.iconSize.endsWith("rem") ? 10 : 1)) : ""} placeholder="auto" onChange={(v) => onPatch({ items: updateItem(node, it.id, { iconSize: v === "" ? undefined : `${toRem(Number(v))}rem` }).items })} />
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[0.6875rem] text-muted">Align</span>
                                <Segmented ariaLabel={`Item ${i + 1} icon align`} value={it.iconAlign ?? ""}
                                  onChange={(v) => onPatch({ items: updateItem(node, it.id, { iconAlign: (v || undefined) as "start" | "center" | "end" | undefined }).items })}
                                  options={[{ value: "start", Icon: AlignLeft, title: "Top" }, { value: "center", Icon: AlignCenter, title: "Middle" }, { value: "end", Icon: AlignRight, title: "Bottom" }]} />
                              </div>
                              <div className="grid grid-cols-2 gap-1.5">
                                <CompactField label="Move icon ← → (rem)" ariaLabel={`Item ${i + 1} icon move X`} type="number" step={0.5} value={it.iconDx ?? ""} placeholder="0" onChange={(v) => onPatch({ items: updateItem(node, it.id, { iconDx: v === "" ? undefined : Number(v) }).items })} />
                                <CompactField label="Move icon ↑ ↓ (rem)" ariaLabel={`Item ${i + 1} icon move Y`} type="number" step={0.5} value={it.iconDy ?? ""} placeholder="0" onChange={(v) => onPatch({ items: updateItem(node, it.id, { iconDy: v === "" ? undefined : Number(v) }).items })} />
                              </div>
                            </div>
                          )}
                          {/* Nested sub-accordion (one level) — a mini accordion inside this item's answer */}
                          <div className="rounded-lg border border-line p-1.5 space-y-1.5">
                            <div className="text-[0.625rem] font-semibold uppercase tracking-wide text-muted">Sub‑items (nested accordion)</div>
                            {(it.children ?? []).map((c, ci) => (
                              <div key={c.id} className="space-y-1 rounded-md border border-line p-1.5">
                                <div className="flex items-center gap-1">
                                  <div className="flex-1"><CompactField ariaLabel={`Item ${i + 1} sub-item ${ci + 1} title`} value={c.title} onChange={(v) => onPatch({ items: updateChildItem(node, it.id, c.id, { title: v }).items })} placeholder="Sub-question" /></div>
                                  <button onClick={() => onPatch({ items: moveChildItem(node, it.id, c.id, -1).items })} disabled={ci === 0} aria-label={`Move sub-item ${ci + 1} up`} className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                                  <button onClick={() => onPatch({ items: moveChildItem(node, it.id, c.id, 1).items })} disabled={ci === (it.children?.length ?? 0) - 1} aria-label={`Move sub-item ${ci + 1} down`} className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                                  <button onClick={() => onPatch({ items: removeChildItem(node, it.id, c.id).items })} aria-label={`Remove sub-item ${ci + 1}`} className="p-1 rounded text-red-500 hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
                                </div>
                                <CompactTextarea ariaLabel={`Item ${i + 1} sub-item ${ci + 1} body`} value={c.body} onChange={(v) => onPatch({ items: updateChildItem(node, it.id, c.id, { body: v }).items })} rows={2} placeholder="Answer — supports **bold**, [links](https://…)" />
                              </div>
                            ))}
                            <button aria-label={`Add sub-item to item ${i + 1}`} onClick={() => onPatch({ items: addChildItem(node, it.id).items })} className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md border border-dashed border-line text-[0.6875rem] text-muted hover:bg-surface-2"><Plus className="w-3 h-3" /> Add sub-item</button>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <CompactField ariaLabel={`Item ${i + 1} number`} value={it.num ?? ""} onChange={(v) => onPatch({ items: updateItem(node, it.id, { num: v || undefined }).items })} placeholder="Number / badge (e.g. 1, A, ★)" />
                            <CompactField ariaLabel={`Item ${i + 1} link name`} value={it.anchor ?? ""} onChange={(v) => onPatch({ items: updateItem(node, it.id, { anchor: v.replace(/\s+/g, "-").toLowerCase() || undefined }).items })} placeholder="Link name → #anchor (deep-link)" />
                          </div>
                          {isAcc && <CompactField ariaLabel={`Item ${i + 1} category`} value={it.category ?? ""} onChange={(v) => onPatch({ items: updateItem(node, it.id, { category: v || undefined }).items })} placeholder="Category — a heading groups items (e.g. Billing, Shipping)" />}
                          <AccPartDesign title={isAcc ? "Header — the title row" : "Title — the heading row"} moveLabel="title" ariaPrefix={`Item ${i + 1} header`} style={it.headerStyle}
                            onChange={(patch) => onPatch({ items: updateItem(node, it.id, { headerStyle: { ...(it.headerStyle ?? {}), ...patch } }).items })} />
                          <AccPartDesign title={isAcc ? "Content — the answer / text area" : "Message — the body text"} moveLabel="text" ariaPrefix={`Item ${i + 1} content`} style={it.bodyStyle}
                            onChange={(patch) => onPatch({ items: updateItem(node, it.id, { bodyStyle: { ...(it.bodyStyle ?? {}), ...patch } }).items })} />
                          {/* RULE N — detach & float: lift this item out of the stack and place it anywhere.
                              Available on EVERY multi-item component (accordion, alert, and future ones). */}
                          {(
                          <div className="rounded-lg border border-line p-1.5 space-y-1.5">
                            <label className="flex items-center gap-2 text-xs text-ink">
                              <input type="checkbox" aria-label={`Item ${i + 1} float`} checked={!!it.float}
                                onChange={(e) => onPatch({ items: updateItem(node, it.id, { float: e.target.checked ? (it.float ?? { x: 4, y: 4, z: 1 }) : undefined }).items })} />
                              Move freely — position within the {isAcc ? "accordion" : "component"}
                            </label>
                            {it.float && (
                              <>
                                <div className="grid grid-cols-2 gap-1.5">
                                  <CompactField label="X (rem)" ariaLabel={`Item ${i + 1} float X`} type="number" step={0.5} value={it.float.x} onChange={(v) => onPatch({ items: updateItem(node, it.id, { float: { ...it.float!, x: v === "" ? 0 : Number(v) } }).items })} />
                                  <CompactField label="Y (rem)" ariaLabel={`Item ${i + 1} float Y`} type="number" step={0.5} value={it.float.y} onChange={(v) => onPatch({ items: updateItem(node, it.id, { float: { ...it.float!, y: v === "" ? 0 : Number(v) } }).items })} />
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[0.6875rem] text-muted">Layer</span>
                                  <Segmented ariaLabel={`Item ${i + 1} layer`} value={(it.float.z ?? 1) >= 5 ? "front" : "back"}
                                    onChange={(v) => onPatch({ items: updateItem(node, it.id, { float: { ...it.float!, z: v === "front" ? 10 : 1 } }).items })}
                                    options={[{ value: "back", label: "Back" }, { value: "front", label: "Front" }]} />
                                </div>
                                <p className="text-[0.625rem] leading-snug text-muted">Drag the item on the canvas to place it — or type X/Y here. On phones it returns to the stack.</p>
                              </>
                            )}
                            <label className="flex items-center gap-2 text-[0.6875rem] text-muted">
                              <input type="checkbox" aria-label={`Item ${i + 1} group select`} checked={accSel.includes(it.id)}
                                onChange={(e) => setAccSel(e.target.checked ? [...accSel, it.id] : accSel.filter((x) => x !== it.id))} />
                              Select for group{it.group ? " · grouped" : ""}
                            </label>
                          </div>
                          )}
                          {/* RULE P — space inside and around THIS item, four sides each (rem). */}
                          <div className="rounded-lg border border-line p-1.5 space-y-1.5">
                            <ItemSideSpacing title="Space inside" ariaPrefix={`Item ${i + 1}`} value={it.pad}
                              onChange={(v) => onPatch({ items: updateItem(node, it.id, { pad: v }).items })} />
                            <ItemSideSpacing title="Space around" ariaPrefix={`Item ${i + 1}`} value={it.margin}
                              onChange={(v) => onPatch({ items: updateItem(node, it.id, { margin: v }).items })} />
                          </div>
                          <CompactTextarea ariaLabel={`Item ${i + 1} CSS`} value={it.css ?? ""} onChange={(v) => onPatch({ items: updateItem(node, it.id, { css: v || undefined }).items })} rows={3} placeholder={"More CSS for this item — change anything:\ntitle { letter-spacing: .02em; }\nicon { color: #f59e0b; }\nmedia { border-radius: 999px; }"} textareaClassName="font-mono text-[0.6875rem]" />
                          <p className="text-[0.625rem] leading-snug text-muted">The controls above cover colour + font. For anything else, plain lines style the whole item; use <code>title</code>, <code>body</code>, <code>icon</code>, <code>meta</code> or <code>media</code> {"{ … }"} to target one part.</p>
                          <div className="flex items-center justify-between">
                            {isAcc ? <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><input type="checkbox" checked={!!it.open} onChange={(e) => onPatch({ items: updateItem(node, it.id, { open: e.target.checked || undefined }).items })} /> Open by default</label> : <span />}
                            {isList ? <button onClick={() => onPatch({ items: removeItem(node, it.id).items })} disabled={(node.items?.length ?? 0) <= 1} aria-label={`Remove item ${i + 1}`} className="text-xs text-red-500 hover:text-red-600 disabled:opacity-30">Remove</button> : <span />}
                          </div>
                        </div>
                      ))}
                      {accSel.length >= 2 && (
                        <button aria-label="Group selected items" onClick={() => {
                          const gid = "g-" + Math.random().toString(36).slice(2, 8);
                          let stagger = 0; // cascade newly-floated members so they don't all land on the same spot
                          onPatch({ items: (node.items ?? []).map((it) => {
                            if (!accSel.includes(it.id)) return it;
                            const float = it.float ?? { x: 4, y: 4 + stagger * 5, z: 1 }; // keep existing positions; stagger fresh ones
                            if (!it.float) stagger++;
                            return { ...it, group: gid, float };
                          }) });
                          setAccSel([]);
                        }} className="w-full py-2 rounded-lg bg-brand text-brand-fg text-xs font-semibold hover:bg-brand-600">Group {accSel.length} items &amp; float together</button>
                      )}
                      {accSel.length >= 1 && (node.items ?? []).some((it) => accSel.includes(it.id) && it.group) && (
                        <button aria-label="Ungroup selected items" onClick={() => onPatch({ items: (node.items ?? []).map((it) => accSel.includes(it.id) ? { ...it, group: undefined } : it) })} className="w-full py-2 rounded-lg border border-line text-xs text-ink hover:bg-surface-2">Ungroup selected</button>
                      )}
                      {isList && <button onClick={() => onPatch({ items: addItem(node).items })} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-gray-300 dark:border-white/15 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"><Plus className="w-3.5 h-3.5" /> Add item</button>}
                    </div>
                  </>
                  );
                })()}
                {/* Registry components (Card/Quote/Stat/Badge/Rating/…): design variants + content fields, both
                    auto-generated from the component's registry entry — a future component needs NO inspector code. */}
                {node.type === "component" && isRegistryComponent(node.component) && (() => {
                  const def = COMPONENT_REGISTRY[node.component!];
                  const fields = node.componentFields ?? {};
                  const setField = (k: string, v: string | number) => onPatch({ componentFields: { ...defaultComponentFields(node.component!), ...fields, [k]: v } });
                  return (
                    <>
                      {def.variants.length > 1 && (
                        <div className="space-y-2">
                          <span className={label}>Design</span>
                          <div className="flex flex-wrap gap-1" role="group" aria-label={`${def.label} designs`}>
                            {def.variants.map((v) => {
                              const on = (node.variant ?? "") === v.id;
                              return (
                                <button key={v.id || "default"} aria-pressed={on} aria-label={`${v.label} design`} title={v.label}
                                  onClick={() => onPatch({ variant: v.id })}
                                  className={chipCls(on)}>
                                  {v.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      <div className="space-y-2">
                        <span className={label}>Content</span>
                        {def.slots.map((s) => (
                          s.type === "textarea"
                            ? <CompactTextarea key={s.key} label={s.label} ariaLabel={s.label} value={String(fields[s.key] ?? "")} onChange={(v) => setField(s.key, v)} rows={2} />
                            : s.type === "number"
                            ? <CompactField key={s.key} label={s.label} ariaLabel={s.label} type="number" min={s.min} max={s.max} value={Number(fields[s.key] ?? 0)} onChange={(v) => setField(s.key, Math.max(s.min ?? 0, Math.min(s.max ?? 9999, Number(v) || 0)))} />
                            : s.type === "icon"
                            ? <div key={s.key} className="space-y-1"><span className={label}>{s.label}</span>
                                <IconPicker ariaLabel={`${def.label} ${s.label}`} value={String(fields[s.key] ?? "") || undefined} onChange={(v) => setField(s.key, v ?? "")} />
                              </div>
                            : s.type === "select"
                            ? <CompactSelect key={s.key} label={s.label} ariaLabel={s.label} value={String(fields[s.key] ?? s.default)} onChange={(v) => setField(s.key, v)} options={s.options ?? []} />
                            : s.type === "boolean"
                            ? <label key={s.key} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                                <input type="checkbox" checked={!!Number(fields[s.key] ?? 0)} onChange={(e) => setField(s.key, e.target.checked ? 1 : 0)} aria-label={s.label} className="accent-indigo-600" /> {s.label}
                              </label>
                            : <CompactField key={s.key} label={s.label} ariaLabel={s.label} value={String(fields[s.key] ?? "")} onChange={(v) => setField(s.key, v)} placeholder={s.type === "url" ? "https://…" : undefined} />
                        ))}
                      </div>
                    </>
                  );
                })()}
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
                        <EducoColorField label="Brand" value={tok("--eu-color-brand") || theme.primary} onChange={(hex) => setTok("--eu-color-brand", hex)} contrastBg={tok("--eu-color-on-brand") || "#ffffff"} />
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
                  <CompactTextarea label="Custom CSS declarations" ariaLabel="Advanced CSS" value={node.advancedCss ?? ""} onChange={(v) => onPatch({ advancedCss: v || undefined })} rows={4}
                    placeholder={node.component === "accordion"
                      ? "Applies to EVERY item — change anything:\nborder-radius: 14px;\ntitle { color: #4338ca; }\nbody { background: #f5f3ff; }\nicon { color: #6366f1; }"
                      : "letter-spacing: .02em;\nbackdrop-filter: blur(6px);"}
                    textareaClassName="font-mono text-[0.6875rem]"
                    helpText={node.component === "accordion"
                      ? <>Plain lines style the accordion. Use <code>title</code>, <code>body</code>, <code>icon</code>, <code>meta</code> or <code>media</code> {"{ … }"} to restyle that part of every item. Sanitised on export.</>
                      : <>One <code>property: value;</code> per line. Applied to the component; sanitised on export (no selectors, @-rules, or remote URLs).</>} />
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
