"use client";

/**
 * Header element inspector — the right-hand properties panel for a selected freeform header element
 * (logo, text, nav, or button). Gives full control: font family/size/colour, bold, link + page
 * target, button fill/label colours, and logo upload/background/size. Reuses ColorPickerPopover and
 * the shared FONT_CHOICES so nothing is re-invented. Purely prop-driven; edits flow up via onChange.
 */

import { useRef } from "react";
import { Trash2, Upload, ListTree, Link2 } from "lucide-react";
import type { HeaderEl, Page, SiteTheme } from "@/lib/site-storage";
import { FONT_CHOICES } from "@/lib/site-storage";
import { ColorPickerPopover, colorToCSS } from "@/components/shared/ColorPalettePicker";

const inputCls = "w-full text-sm px-2.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-transparent text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none";
const label = "text-[11px] font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300";
const section = "text-[11px] font-semibold uppercase tracking-wide text-gray-400 pt-1";

const TYPE_LABEL: Record<HeaderEl["type"], string> = { logo: "Logo", text: "Text", nav: "Navigation", button: "Button" };

/** A labelled swatch that opens the shared colour popover — the same full "matrix" palette the
 * docs/workspace editor uses (TextFormatToolbar), so header colours match the rest of the product. */
function ColorRow({ title, value, fallback, onSelect }: { title: string; value?: string; fallback: string; onSelect: (c: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className={label}>{title}</span>
      <ColorPickerPopover selectedColor={value || fallback} onSelect={onSelect} mode="matrix" label={title} align="right" width={272} portal>
        <button aria-label={title} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm" style={{ background: colorToCSS(value || fallback) }} />
      </ColorPickerPopover>
    </div>
  );
}

function FontRow({ value, fallback, onSelect }: { value?: string; fallback: string; onSelect: (f: string) => void }) {
  return (
    <label className="block"><span className={label}>Font family</span>
      <select value={value || fallback} onChange={(e) => onSelect(e.target.value)} className={inputCls}>
        {FONT_CHOICES.map((f) => <option key={f} value={f}>{f.split(",")[0].replace(/'/g, "")}</option>)}
      </select>
    </label>
  );
}

function SizeRow({ title, value, min, max, fallback, onChange }: { title: string; value?: number; min: number; max: number; fallback: number; onChange: (n: number) => void }) {
  const v = value ?? fallback;
  return (
    <label className="block"><span className={label}>{title}: {v}px</span>
      <input type="range" min={min} max={max} value={v} onChange={(e) => onChange(Number(e.target.value))} aria-label={title} className="w-full mt-1" />
    </label>
  );
}

/** Link editor: free URL or a page target ("page:<id>"), plus open-in-new-tab. */
function LinkRow({ el, pages, onChange }: { el: HeaderEl; pages: Page[]; onChange: (patch: Partial<HeaderEl>) => void }) {
  const isPage = el.href?.startsWith("page:");
  const pageId = isPage ? el.href!.slice(5) : "";
  return (
    <div className="space-y-1.5">
      <span className={label + " flex items-center gap-1"}><Link2 className="w-3 h-3" /> Link</span>
      <select
        value={isPage ? pageId : el.href ? "__url" : ""}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "") onChange({ href: undefined });
          else if (v === "__url") onChange({ href: el.href && !el.href.startsWith("page:") ? el.href : "https://" });
          else onChange({ href: `page:${v}` });
        }}
        className={inputCls}
      >
        <option value="">No link</option>
        <optgroup label="Go to page">
          {pages.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </optgroup>
        <option value="__url">Custom URL…</option>
      </select>
      {el.href && !isPage && (
        <input value={el.href} onChange={(e) => onChange({ href: e.target.value })} placeholder="https://example.com" className={inputCls} />
      )}
      {el.href && (
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 pt-0.5">
          <input type="checkbox" checked={!!el.newTab} onChange={(e) => onChange({ newTab: e.target.checked })} /> Open in a new tab
        </label>
      )}
    </div>
  );
}

export default function HeaderInspector({
  el, theme, pages, headerHeight, onChange, onDelete, onHeaderHeight, onOpenNav,
}: {
  el: HeaderEl;
  theme: SiteTheme;
  pages: Page[];
  headerHeight: number;
  onChange: (patch: Partial<HeaderEl>) => void;
  onDelete: () => void;
  onHeaderHeight: (h: number) => void;
  onOpenNav: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const onPickLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ src: String(reader.result) });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="p-4 space-y-3">
      <div className="text-[11px] text-gray-400">Editing the <b>{TYPE_LABEL[el.type]}</b> element. Drag it on the canvas to reposition.</div>

      {/* ── Logo ── */}
      {el.type === "logo" && (
        <>
          <div className={section}>Image</div>
          <button onClick={() => fileRef.current?.click()} className="w-full flex items-center justify-center gap-2 text-sm px-3 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-200">
            <Upload className="w-3.5 h-3.5" /> {el.src ? "Replace logo image" : "Upload logo image"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={onPickLogo} className="hidden" aria-label="Upload logo image" />
          {el.src && <button onClick={() => onChange({ src: undefined })} className="text-[11px] text-red-500 hover:underline">Remove image (use initial)</button>}

          <div className={section}>Background</div>
          <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <input type="checkbox" checked={el.bg === "transparent"} onChange={(e) => onChange({ bg: e.target.checked ? "transparent" : undefined })} /> Transparent (show header background)
          </label>
          {el.bg !== "transparent" && (
            <ColorRow title="Background colour" value={el.bg} fallback={theme.primary} onSelect={(c) => onChange({ bg: c })} />
          )}

          <div className={section}>Size</div>
          <SizeRow title="Width" value={el.width} min={20} max={200} fallback={36} onChange={(n) => onChange({ width: n })} />
          <SizeRow title="Height" value={el.height} min={20} max={120} fallback={36} onChange={(n) => onChange({ height: n })} />
        </>
      )}

      {/* ── Text ── */}
      {el.type === "text" && (
        <>
          <label className="block"><span className={label}>Text</span>
            <input value={el.text || ""} onChange={(e) => onChange({ text: e.target.value })} className={inputCls} />
          </label>
          <FontRow value={el.fontFamily} fallback={theme.headingFont} onSelect={(f) => onChange({ fontFamily: f })} />
          <SizeRow title="Font size" value={el.fontSize} min={9} max={56} fallback={18} onChange={(n) => onChange({ fontSize: n })} />
          <ColorRow title="Text colour" value={el.color} fallback={theme.text} onSelect={(c) => onChange({ color: c })} />
          <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <input type="checkbox" checked={!!el.bold} onChange={(e) => onChange({ bold: e.target.checked })} /> Bold
          </label>
          <LinkRow el={el} pages={pages} onChange={onChange} />
        </>
      )}

      {/* ── Button ── */}
      {el.type === "button" && (
        <>
          <label className="block"><span className={label}>Label</span>
            <input value={el.text || ""} onChange={(e) => onChange({ text: e.target.value })} className={inputCls} />
          </label>
          <FontRow value={el.fontFamily} fallback={theme.headingFont} onSelect={(f) => onChange({ fontFamily: f })} />
          <SizeRow title="Font size" value={el.fontSize} min={10} max={28} fallback={14} onChange={(n) => onChange({ fontSize: n })} />
          <ColorRow title="Background" value={el.bg} fallback={theme.primary} onSelect={(c) => onChange({ bg: c })} />
          <ColorRow title="Label colour" value={el.color} fallback="#ffffff" onSelect={(c) => onChange({ color: c })} />
          <LinkRow el={el} pages={pages} onChange={onChange} />
        </>
      )}

      {/* ── Nav ── */}
      {el.type === "nav" && (
        <>
          <FontRow value={el.fontFamily} fallback={theme.headingFont} onSelect={(f) => onChange({ fontFamily: f })} />
          <SizeRow title="Font size" value={el.fontSize} min={11} max={22} fallback={14} onChange={(n) => onChange({ fontSize: n })} />
          <SizeRow title="Item spacing" value={el.gap} min={8} max={64} fallback={28} onChange={(n) => onChange({ gap: n })} />
          <ColorRow title="Link colour" value={el.color} fallback={theme.textMuted} onSelect={(c) => onChange({ color: c })} />
          <button onClick={onOpenNav} className="w-full flex items-center justify-center gap-2 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-200">
            <ListTree className="w-3.5 h-3.5" /> Manage links & dropdowns
          </button>
          <p className="text-[11px] text-gray-400">Add pages, custom links and dropdown menus in the Navigation panel — they appear here automatically.</p>
        </>
      )}

      {/* ── Header band ── */}
      <div className={section}>Header band</div>
      <SizeRow title="Header height" value={headerHeight} min={56} max={140} fallback={78} onChange={onHeaderHeight} />

      {el.type !== "logo" && (
        <button onClick={onDelete} className="w-full flex items-center justify-center gap-2 text-sm px-3 py-2 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 mt-1">
          <Trash2 className="w-3.5 h-3.5" /> Delete element
        </button>
      )}
    </div>
  );
}
