"use client";

/**
 * IconPicker — a reusable, themed visual icon chooser. Shows the SELECTED icon on the trigger, opens a
 * portaled popover with a SEARCH box + a scrollable GRID of the real icons (so users see what they pick).
 * Backed by the full icon library (`ALL_ICON_NAMES` + `iconSvg`, thousands of icons). Results are capped
 * per render for performance and the popover clamps inside the viewport. Keyboard: Tab/Enter/Escape.
 *
 * Reuse it anywhere an icon is chosen (accordion item icon, the Icon block, future components).
 */

import { useState, useRef, useLayoutEffect, useEffect, useMemo, useReducer } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search, X, Sparkles } from "lucide-react";
import { iconSvg, ALL_ICON_NAMES, onIconsLoaded, warmIcons, iconSourceOf, type IconSource } from "@/lib/educo-ui/icon-svg";

const CAP = 300; // max tiles rendered at once (search narrows to what you need)

// Browsing filters. `source` narrows to one library; `test` is a keyword match on the icon name.
type Category = { label: string; test: RegExp | null; source?: IconSource };
const CATEGORIES: Category[] = [
  { label: "All", test: null },
  // Neutral, function-first filters (no vendor names needed). "Brands" = company/social logos, which the
  // keyword filters can't catch by name; every other library's general icons are reachable via All + keywords.
  { label: "Brands", test: null, source: "simple" },
  { label: "Arrows", test: /arrow|chevron|corner|move|redo|undo|refresh|repeat|shuffle|expand|shrink/i },
  { label: "Communication", test: /mail|message|chat|phone|send|bell|at-?sign|inbox|reply|voicemail|contact/i },
  { label: "Media", test: /play|pause|stop|music|video|camera|image|photo|film|mic|volume|headphone|speaker|podcast|radio|disc/i },
  { label: "Files", test: /file|folder|download|upload|clipboard|book|save|archive|paperclip|copy|scissors|printer/i },
  { label: "Commerce", test: /shopping|cart|credit|wallet|dollar|euro|pound|tag|gift|package|store|receipt|coins|banknote|percent|badge/i },
  { label: "Weather", test: /sun|moon|cloud|rain|snow|wind|leaf|tree|droplet|flame|star|umbrella|thermo|sunrise|sunset|rainbow/i },
  { label: "Tech", test: /cpu|server|database|monitor|smartphone|laptop|wifi|bluetooth|battery|terminal|code|mouse|keyboard|hard-?drive|usb|plug|chip/i },
  { label: "People", test: /user|users|person|smile|heart|contact|baby|accessibility|footprints|hand/i },
  { label: "Maps", test: /map|pin|navigation|compass|globe|route|flag|milestone|locate|signpost/i },
  { label: "Shapes", test: /circle|square|triangle|hexagon|diamond|octagon|shapes|dot|grid|layout/i },
  { label: "Editing", test: /edit|pen|pencil|brush|paint|eraser|type|bold|italic|underline|align|list|highlighter|palette|ruler/i },
  { label: "Charts", test: /chart|graph|trend|activity|gauge|pie|bar|line|analytics|percent/i },
  { label: "Security", test: /lock|unlock|key|shield|eye|fingerprint|scan|verified|alert|ban/i },
];

// Strip the source prefix for a friendlier label ("si-github" → "github").
const prettyName = (n: string) => n.replace(/^(si|ms|ion)-/, "").replace(/_/g, " ");

export default function IconPicker({ value, onChange, ariaLabel = "Icon", allowClear = true }: {
  value?: string;
  onChange: (v: string | undefined) => void;
  ariaLabel?: string;
  allowClear?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(0); // index into CATEGORIES
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [pos, setPos] = useState<{ left: number; top?: number; bottom?: number; width: number; maxH: number } | null>(null);
  const [, rerender] = useReducer((x) => x + 1, 0); // re-render when a lazy icon source arrives

  // When a lazy source (Brands/Google/Ionicons) finishes loading, repaint the tiles.
  useEffect(() => onIconsLoaded(() => rerender()), []);
  // Make sure a currently-selected non-lucide icon shows on the trigger even before the popover opens.
  useEffect(() => { if (value) warmIcons([value]); }, [value]);

  const { results, total } = useMemo(() => {
    const query = q.trim().toLowerCase();
    const c = CATEGORIES[cat];
    const all = ALL_ICON_NAMES.filter((n) =>
      (!query || n.toLowerCase().includes(query)) &&
      (!c?.test || c.test.test(n)) &&
      (!c?.source || iconSourceOf(n) === c.source));
    return { results: all.slice(0, CAP), total: all.length };
  }, [q, cat]);

  // Lazy-load the SVGs for whatever tiles are visible (their source may not be in memory yet).
  useEffect(() => { if (open) warmIcons(results); }, [open, results]);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const margin = 10, gap = 6;
    const width = Math.min(Math.max(r.width, 340), window.innerWidth - margin * 2); // never wider than the screen
    const left = Math.max(margin, Math.min(r.left, window.innerWidth - width - margin));
    const below = window.innerHeight - r.bottom - gap - margin; // room under the trigger
    const above = r.top - gap - margin;                          // room over the trigger
    const openUp = above > below;                                // drop toward whichever side has more room
    const maxH = Math.max(220, Math.min(openUp ? above : below, 512)); // fit the viewport; cap at 32rem
    setPos(openUp
      ? { left, bottom: window.innerHeight - r.top + gap, width, maxH }
      : { left, top: r.bottom + gap, width, maxH });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    const onDown = (e: MouseEvent) => { if (!popRef.current?.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btnRef.current?.focus(); } };
    const onScroll = (e: Event) => { if (!popRef.current?.contains(e.target as Node)) setOpen(false); };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    return () => { window.removeEventListener("mousedown", onDown); window.removeEventListener("keydown", onKey); window.removeEventListener("scroll", onScroll, true); };
  }, [open]);

  const svg = value ? iconSvg(value) : "";

  return (
    <>
      <button ref={btnRef} type="button" aria-label={ariaLabel} aria-haspopup="dialog" aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center gap-2.5 rounded-xl border border-line/70 bg-surface-2 px-2.5 py-2 text-sm text-ink transition-all hover:border-brand/50 hover:bg-surface focus:border-brand focus:ring-2 focus:ring-brand/25 outline-none">
        <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand [&_svg]:h-4 [&_svg]:w-4">
          {svg ? <span dangerouslySetInnerHTML={{ __html: svg }} /> : <Sparkles className="h-4 w-4 text-muted" />}
        </span>
        <span className={`flex-1 truncate text-left ${value ? "font-medium" : "text-muted"}`}>{value ? prettyName(value) : "Choose an icon"}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:text-ink" style={{ transform: open ? "rotate(180deg)" : undefined }} />
      </button>

      {open && pos && createPortal(
        <div ref={popRef} role="dialog" aria-label={`${ariaLabel} picker`}
          style={{ position: "fixed", left: pos.left, top: pos.top, bottom: pos.bottom, width: pos.width, maxHeight: pos.maxH }}
          className="z-[70] flex animate-[iconpicker-in_140ms_ease-out] flex-col overflow-hidden rounded-[1.25rem] border border-line/60 bg-surface/95 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.35)] ring-1 ring-black/5 backdrop-blur-xl">
          <style>{`@keyframes iconpicker-in{from{opacity:0;transform:translateY(-6px) scale(.98)}to{opacity:1;transform:none}}`}</style>
          {/* search — prominent, focus-glow */}
          <div className="px-3.5 pt-3.5 pb-2.5">
            <div className="flex w-full items-center gap-2.5 rounded-2xl bg-surface-2 px-3.5 py-2.5 ring-1 ring-line/60 transition-all focus-within:bg-surface focus-within:ring-2 focus-within:ring-brand/40">
              <Search className="h-4 w-4 shrink-0 text-brand/70" />
              <input ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${ALL_ICON_NAMES.length.toLocaleString()} icons…`}
                aria-label="Search icons" className="w-full bg-transparent text-sm text-ink placeholder:text-muted outline-none" />
              {q && <button type="button" aria-label="Clear search" onClick={() => setQ("")} className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-surface-3 text-muted transition-colors hover:bg-brand/15 hover:text-brand"><X className="h-3 w-3" /></button>}
            </div>
          </div>
          {/* categories — wrap so EVERY category is visible at once; refined segmented pills */}
          <div role="tablist" aria-label="Icon categories" className="flex flex-wrap gap-1 border-b border-line/50 px-3.5 pb-3">
            {CATEGORIES.map((c, ci) => (
              <button key={c.label} type="button" role="tab" aria-selected={ci === cat} onClick={() => setCat(ci)}
                className={`rounded-full px-2.5 py-1 text-[0.75rem] font-medium leading-none transition-all ${ci === cat ? "bg-brand text-brand-fg shadow-sm shadow-brand/30" : "text-muted hover:bg-surface-2 hover:text-ink"}`}>{c.label}</button>
            ))}
          </div>
          {/* icon grid — borderless tiles, soft hover lift */}
          <div className="grid min-h-0 flex-1 grid-cols-7 gap-1 overflow-y-auto px-3 py-3 [scrollbar-width:thin]">
            {allowClear && (
              <button type="button" title="No icon" aria-label="No icon" onClick={() => { onChange(undefined); setOpen(false); }}
                className={`flex aspect-square items-center justify-center rounded-xl text-muted transition-all hover:-translate-y-0.5 hover:bg-surface-2 hover:text-ink ${!value ? "bg-brand/12 text-brand ring-1 ring-brand/50" : ""}`}>
                <X className="h-4 w-4" />
              </button>
            )}
            {results.map((n) => {
              const svgN = iconSvg(n);
              return (
                <button key={n} type="button" title={prettyName(n)} aria-label={prettyName(n)} aria-pressed={n === value}
                  onClick={() => { onChange(n); setOpen(false); }}
                  className={`flex aspect-square items-center justify-center rounded-xl text-ink/85 transition-all hover:-translate-y-0.5 hover:bg-brand/12 hover:text-brand hover:shadow-sm [&_svg]:h-[1.2rem] [&_svg]:w-[1.2rem] ${n === value ? "bg-brand/12 text-brand ring-1 ring-brand/50" : ""}`}>
                  {svgN ? <span aria-hidden dangerouslySetInnerHTML={{ __html: svgN }} />
                    : <span aria-hidden className="h-4 w-4 animate-pulse rounded bg-surface-3" />}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t border-line/50 bg-surface-2/40 px-3.5 py-2 text-[0.6875rem] text-muted">
            <span>{total === 0 ? "No icons match — try another word." : total > CAP ? `Showing ${CAP} of ${total.toLocaleString()}` : `${total.toLocaleString()} icon${total === 1 ? "" : "s"}`}</span>
            {total > CAP && <span className="text-brand/70">keep typing to narrow ↑</span>}
          </div>
        </div>, document.body)}
    </>
  );
}
