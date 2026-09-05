"use client";

/**
 * Blocks palette — a FLOATING insert panel. A COMPACT launcher tucked in the left gutter (off the page) opens a
 * modern, spacious flyout that floats OVER the canvas (the canvas keeps its full width). Search to filter, category
 * tabs to jump, big tiles you DRAG onto the page (a glowing drop line shows where) or CLICK to pick a style.
 * Toggle with the launcher, the ✕, a click outside, Escape, or the keyboard (B toggles, / opens + focuses search).
 *
 * THEME-AWARE + no hardcoded colours: every surface/line/text/accent uses the Educo UI semantic tokens
 * (bg-surface, border-line, text-ink, text-muted, bg-brand…) so the panel re-skins with Light / Dark / Midnight /
 * Purple automatically. The variation picker is a PortalMenu (portaled to <body>) so the scroll area never clips it.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutPanelTop, Columns3, Rows3, MoveVertical, Minus,
  Heading as HeadingIcon, Pilcrow, MousePointerClick, ListOrdered,
  Image as ImageIcon, Film, Shapes, CodeXml,
  PanelTopOpen, LayoutGrid, MessageSquareQuote, Hash, BadgeCheck, Star, BellRing,
  Blocks, LayoutTemplate, Type, Images, Component, Search, X, Plus, Sparkles, type LucideIcon,
} from "lucide-react";
import type { BoxNode } from "@/lib/box-model";
import type { SiteTheme } from "@/lib/site-storage";
import { getPresets } from "@/lib/box-presets";
import { PortalMenu, MenuItem, MenuHeader } from "./ui";

type Block = { kind: string; label: string; Icon: LucideIcon; hint: string };
const GROUPS: { name: string; Icon: LucideIcon; blocks: Block[] }[] = [
  { name: "Layout", Icon: LayoutTemplate, blocks: [
    { kind: "container", label: "Section", Icon: LayoutPanelTop, hint: "A band you fill with anything" },
    { kind: "grid", label: "Columns", Icon: Columns3, hint: "Equal columns" },
    { kind: "row", label: "Row", Icon: Rows3, hint: "Items side by side" },
    { kind: "spacer", label: "Spacer", Icon: MoveVertical, hint: "Empty vertical space" },
    { kind: "divider", label: "Divider", Icon: Minus, hint: "A dividing line" },
  ] },
  { name: "Text", Icon: Type, blocks: [
    { kind: "heading", label: "Heading", Icon: HeadingIcon, hint: "A big title" },
    { kind: "text", label: "Text", Icon: Pilcrow, hint: "A paragraph" },
    { kind: "button", label: "Button", Icon: MousePointerClick, hint: "A clickable button" },
    { kind: "list", label: "List", Icon: ListOrdered, hint: "Bulleted or numbered" },
  ] },
  { name: "Media", Icon: Images, blocks: [
    { kind: "image", label: "Image", Icon: ImageIcon, hint: "A picture" },
    { kind: "video", label: "Video", Icon: Film, hint: "YouTube, Vimeo or a file" },
    { kind: "icon", label: "Icon", Icon: Shapes, hint: "A small symbol" },
    { kind: "embed", label: "Embed", Icon: CodeXml, hint: "Paste code / an iframe" },
  ] },
  { name: "Components", Icon: Component, blocks: [
    { kind: "accordion", label: "Accordion", Icon: PanelTopOpen, hint: "Expandable Q&A / FAQ — 54 designs" },
    { kind: "alert", label: "Alert", Icon: BellRing, hint: "Message / notice — 6 severities, dismissible" },
    { kind: "card", label: "Card", Icon: LayoutGrid, hint: "Image + title + text + button" },
    { kind: "quote", label: "Quote", Icon: MessageSquareQuote, hint: "A testimonial quote" },
    { kind: "stat", label: "Stat", Icon: Hash, hint: "A big number + label" },
    { kind: "badge", label: "Badge", Icon: BadgeCheck, hint: "A small pill label" },
    { kind: "rating", label: "Rating", Icon: Star, hint: "Five stars" },
  ] },
];

const TABS: { name: string; Icon: LucideIcon }[] = [
  { name: "All", Icon: Blocks },
  ...GROUPS.map((g) => ({ name: g.name, Icon: g.Icon })),
];

type Anchor = { top: number; left: number; bottom: number; right: number };

export default function BlocksPanel({ theme, onDragKind, onPick, defaultOpen = false }: {
  theme?: SiteTheme;
  onDragKind?: (kind: string | null) => void;
  onPick?: (kind: string, patch?: Partial<BoxNode>) => void; // click-to-add with an optional style variation
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [shown, setShown] = useState(defaultOpen); // drives the enter transition
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("All");
  const [menu, setMenu] = useState<{ kind: string; label: string; anchor: Anchor } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const variations = menu && theme ? getPresets(menu.kind, theme) : [];

  // Enter animation: mount, then flip `shown` on the next frame so the transition runs.
  useEffect(() => {
    if (!open) { setShown(false); return; }
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  // Click-outside closes (the panel floats over the canvas). Skipped while the portaled variation picker is open.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (menu) return;
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, menu]);

  // Keyboard: B toggles, / opens + focuses search, Esc closes. Ignored while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "Escape") { if (open) { setOpen(false); setMenu(null); } return; }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "b" || e.key === "B") { e.preventDefault(); setOpen((o) => !o); }
      else if (e.key === "/") { e.preventDefault(); setOpen(true); requestAnimationFrame(() => searchRef.current?.focus()); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Filter groups by the active tab, then each group's blocks by the search query. Empty groups drop out.
  const sections = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return GROUPS
      .filter((g) => tab === "All" || g.name === tab)
      .map((g) => ({ ...g, blocks: g.blocks.filter((b) => !needle || b.label.toLowerCase().includes(needle) || b.hint.toLowerCase().includes(needle)) }))
      .filter((g) => g.blocks.length > 0);
  }, [q, tab]);
  const showHeaders = tab === "All";

  const Tile = (b: Block) => {
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
        className={`group flex flex-col gap-2 rounded-xl p-2.5 cursor-grab active:cursor-grabbing transition-colors ${active ? "bg-brand/10 ring-1 ring-brand/40" : "hover:bg-brand/[0.06]"}`}
      >
        <span className={`grid place-items-center w-9 h-9 rounded-lg transition-colors ${active ? "bg-brand/15 text-brand" : "bg-surface-2 text-muted group-hover:bg-brand/10 group-hover:text-brand"}`}>
          <b.Icon className="w-[1.15rem] h-[1.15rem]" strokeWidth={1.75} />
        </span>
        <span className="min-w-0">
          <span className="block text-[0.8125rem] font-semibold text-ink truncate">{b.label}</span>
          <span className="block text-[0.6875rem] leading-snug text-muted line-clamp-2">{b.hint}</span>
        </span>
      </div>
    );
  };

  return (
    <>
      {/* ── Launcher (closed): a COMPACT icon tucked into the left gutter, off the page ── */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open blocks panel"
          aria-expanded={false}
          title="Add blocks (B)"
          className="absolute top-4 left-3 z-40 grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-brand to-brand-600 text-brand-fg shadow-lg ring-1 ring-black/5 hover:shadow-xl hover:scale-105 transition"
        >
          <Blocks className="w-5 h-5" strokeWidth={1.9} />
        </button>
      )}

      {/* ── Floating panel (open): a clean, theme-aware card over the canvas ── */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Blocks"
          className={`absolute top-4 left-3 z-50 flex w-[20rem] max-w-[calc(100%-1.5rem)] max-h-[calc(100%-2rem)] flex-col rounded-2xl border border-line bg-surface shadow-2xl shadow-black/10 overflow-hidden transition duration-200 ease-out motion-reduce:transition-none ${shown ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-2 scale-[0.98]"}`}
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 pt-3.5 pb-3">
            <span className="grid place-items-center w-8 h-8 rounded-xl bg-gradient-to-br from-brand to-brand-600 text-brand-fg shadow-sm"><Blocks className="w-[1.05rem] h-[1.05rem]" strokeWidth={1.9} /></span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-ink leading-tight">Add a block</div>
              <div className="text-[0.6875rem] text-muted leading-tight">Drag onto the page, or click to pick a style</div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close blocks panel" title="Close (Esc)" className="shrink-0 p-1.5 rounded-lg text-muted hover:text-ink hover:bg-surface-2 transition-colors"><X className="w-4 h-4" /></button>
          </div>

          {/* Search */}
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
              <input
                ref={searchRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="text"
                placeholder="Search blocks…"
                aria-label="Search blocks"
                className="w-full pr-8 py-2 rounded-xl text-[0.8125rem] text-ink bg-surface-2 border border-transparent focus:border-brand focus:bg-surface outline-none transition placeholder:text-muted"
                style={{ paddingLeft: "2.125rem" }}
              />
              {q && <button type="button" onClick={() => { setQ(""); searchRef.current?.focus(); }} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-muted hover:text-ink hover:bg-surface transition-colors"><X className="w-3.5 h-3.5" /></button>}
            </div>
          </div>

          {/* Category tabs */}
          <div className="px-4 pb-3 flex flex-wrap gap-1" role="tablist" aria-label="Block categories">
            {TABS.map((t) => {
              const on = tab === t.name;
              return (
                <button
                  key={t.name}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setTab(t.name)}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[0.75rem] font-semibold transition-colors ${on ? "bg-brand text-brand-fg shadow-sm" : "text-muted hover:text-ink hover:bg-surface-2"}`}
                >
                  <t.Icon className="w-3.5 h-3.5" strokeWidth={2} />
                  {t.name}
                </button>
              );
            })}
          </div>

          {/* Tiles */}
          <div className="px-3 pb-4 pt-0.5 overflow-y-auto flex-1 space-y-4">
            {sections.map((group) => (
              <div key={group.name} className="space-y-1.5">
                {showHeaders && (
                  <div className="flex items-center gap-1.5 px-2 text-[0.625rem] font-bold uppercase tracking-wider text-muted">
                    <group.Icon className="w-3 h-3" strokeWidth={2} />{group.name}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-1">{group.blocks.map(Tile)}</div>
              </div>
            ))}
            {sections.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-1.5 py-10 text-center">
                <Search className="w-6 h-6 text-muted/60" />
                <p className="text-[0.8125rem] font-medium text-muted">No blocks match “{q}”.</p>
                <button type="button" onClick={() => { setQ(""); setTab("All"); }} className="text-[0.75rem] font-semibold text-brand hover:underline">Clear search</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Variation picker — portaled so the panel's scroll area can never clip it. */}
      {menu && variations.length > 0 && (
        <PortalMenu anchor={menu.anchor} onClose={() => setMenu(null)} width={184} ariaLabel={`Add ${menu.label}`}>
          <MenuHeader>Add {menu.label} as…</MenuHeader>
          <MenuItem onClick={() => { onPick?.(menu.kind); setMenu(null); }} Icon={Plus} label="Default" />
          {variations.map((p) => <MenuItem key={p.id} onClick={() => { onPick?.(menu.kind, p.patch); setMenu(null); }} Icon={Sparkles} label={p.label} />)}
        </PortalMenu>
      )}
    </>
  );
}
