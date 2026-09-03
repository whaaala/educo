"use client";

/**
 * Blocks palette — the left insert panel. DRAG a block onto the page (a glowing drop line shows where), or
 * CLICK it to pick a style variation first. The variation picker is a PortalMenu (portaled to <body>) so it
 * is NEVER clipped by this panel's scroll area. Grouped, sleek, and collapsible. Plain-language names.
 */

import { useState } from "react";
import { Square, Grid3x3, Columns3, Type, Heading as HeadingIcon, MousePointerClick, Image as ImageIcon, Video, Sparkles, List, Minus, Code2, SeparatorHorizontal, Quote, SquareStack, BarChart3, Tag, Star, ChevronDown, PanelLeftClose, Plus, type LucideIcon } from "lucide-react";
import type { BoxNode } from "@/lib/box-model";
import type { SiteTheme } from "@/lib/site-storage";
import { getPresets } from "@/lib/box-presets";
import { PortalMenu, MenuItem, MenuHeader } from "./ui";

type Block = { kind: string; label: string; Icon: LucideIcon; hint: string };
const GROUPS: { name: string; blocks: Block[] }[] = [
  { name: "Layout", blocks: [
    { kind: "container", label: "Section", Icon: Square, hint: "A box you fill with anything" },
    { kind: "grid", label: "Columns", Icon: Grid3x3, hint: "Equal columns" },
    { kind: "row", label: "Row", Icon: Columns3, hint: "Items side by side" },
    { kind: "spacer", label: "Spacer", Icon: SeparatorHorizontal, hint: "Empty vertical space" },
    { kind: "divider", label: "Divider", Icon: Minus, hint: "A dividing line" },
  ] },
  { name: "Text", blocks: [
    { kind: "heading", label: "Heading", Icon: HeadingIcon, hint: "A big title" },
    { kind: "text", label: "Text", Icon: Type, hint: "A paragraph" },
    { kind: "button", label: "Button", Icon: MousePointerClick, hint: "A clickable button" },
    { kind: "list", label: "List", Icon: List, hint: "Bulleted or numbered" },
  ] },
  { name: "Media", blocks: [
    { kind: "image", label: "Image", Icon: ImageIcon, hint: "A picture" },
    { kind: "video", label: "Video", Icon: Video, hint: "YouTube, Vimeo or a file" },
    { kind: "icon", label: "Icon", Icon: Sparkles, hint: "A small symbol" },
    { kind: "embed", label: "Embed", Icon: Code2, hint: "Paste code / an iframe" },
  ] },
  { name: "Components", blocks: [
    { kind: "accordion", label: "Accordion", Icon: ChevronDown, hint: "Expandable Q&A / FAQ — 54 designs" },
    { kind: "card", label: "Card", Icon: SquareStack, hint: "Image + title + text + button" },
    { kind: "quote", label: "Quote", Icon: Quote, hint: "A testimonial quote" },
    { kind: "stat", label: "Stat", Icon: BarChart3, hint: "A big number + label" },
    { kind: "badge", label: "Badge", Icon: Tag, hint: "A small pill label" },
    { kind: "rating", label: "Rating", Icon: Star, hint: "Five stars" },
  ] },
];

type Anchor = { top: number; left: number; bottom: number; right: number };

export default function BlocksPanel({ theme, onDragKind, onPick, onCollapse }: {
  theme?: SiteTheme;
  onDragKind?: (kind: string | null) => void;
  onPick?: (kind: string, patch?: Partial<BoxNode>) => void; // click-to-add with an optional style variation
  onCollapse?: () => void;
}) {
  const [menu, setMenu] = useState<{ kind: string; label: string; anchor: Anchor } | null>(null);
  const variations = menu && theme ? getPresets(menu.kind, theme) : [];

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">Blocks</div>
          <p className="text-[0.6875rem] text-gray-400 mt-0.5">Drag onto the page, or click to pick a style.</p>
        </div>
        {onCollapse && <button onClick={onCollapse} aria-label="Hide blocks panel" title="Hide blocks" className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 shrink-0"><PanelLeftClose className="w-4 h-4" /></button>}
      </div>

      {GROUPS.map((group) => (
        <div key={group.name} className="space-y-1.5">
          <div className="text-[0.625rem] font-semibold uppercase tracking-wide text-gray-400/80 px-0.5">{group.name}</div>
          <div className="grid grid-cols-2 gap-1.5">
            {group.blocks.map((b) => {
              const hasVariations = !!theme && getPresets(b.kind, theme).length > 0;
              const active = menu?.kind === b.kind;
              return (
                <div
                  key={b.kind}
                  draggable
                  onDragStart={(e) => { e.dataTransfer.setData("application/x-box-block", b.kind); e.dataTransfer.effectAllowed = "copy"; onDragKind?.(b.kind); setMenu(null); }}
                  onDragEnd={() => onDragKind?.(null)}
                  onClick={(e) => {
                    if (hasVariations && onPick) { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); setMenu((m) => (m?.kind === b.kind ? null : { kind: b.kind, label: b.label, anchor: { top: r.top, left: r.left, bottom: r.bottom, right: r.right } })); }
                    else onPick?.(b.kind);
                  }}
                  title={b.hint}
                  role="button"
                  aria-label={`Add ${b.label} — drag onto the page or click to choose a style`}
                  aria-expanded={active}
                  className={`group flex flex-col items-center justify-center gap-2 rounded-lg border px-2 py-3.5 cursor-grab active:cursor-grabbing transition ${active ? "border-indigo-400 dark:border-indigo-500/50 bg-indigo-50/40 dark:bg-indigo-500/5" : "border-gray-200/70 dark:border-white/10 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-300 dark:hover:border-white/20"}`}
                >
                  <b.Icon className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" strokeWidth={1.6} />
                  <span className="text-[0.6875rem] font-medium text-gray-600 dark:text-gray-300">{b.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Variation picker — portaled so the palette's scroll area can never clip it. */}
      {menu && variations.length > 0 && (
        <PortalMenu anchor={menu.anchor} onClose={() => setMenu(null)} width={184} ariaLabel={`Add ${menu.label}`}>
          <MenuHeader>Add {menu.label} as…</MenuHeader>
          <MenuItem onClick={() => { onPick?.(menu.kind); setMenu(null); }} Icon={Plus} label="Default" />
          {variations.map((p) => <MenuItem key={p.id} onClick={() => { onPick?.(menu.kind, p.patch); setMenu(null); }} Icon={Sparkles} label={p.label} />)}
        </PortalMenu>
      )}
    </div>
  );
}
