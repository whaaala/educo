"use client";

/**
 * Shared "clean & airy" UI primitives for the Box Builder (toolbar, blocks palette, inspector). One visual
 * language: hairline borders, soft surfaces, pill segmented controls, ghost buttons, generous spacing.
 * Theme-safe via `dark:` (which also applies under midnight/purple, since those carry the `dark` class).
 */

import { useState, useEffect, useLayoutEffect, useRef, type ReactNode, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { CHROME_Z } from "@/lib/educo-ui/stacking";

/** A quiet ghost button (icon and/or text) with an optional active state + tooltip. `primary` = the one CTA. */
export function ToolBtn({ onClick, title, ariaLabel, active, disabled, primary, children }: {
  onClick?: () => void; title?: string; ariaLabel?: string; active?: boolean; disabled?: boolean; primary?: boolean; children: ReactNode;
}) {
  const base = "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const look = primary
    ? "bg-brand text-brand-fg shadow-sm hover:brightness-105"
    : active
      ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
      : "text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-white/10";
  return <button onClick={onClick} title={title} aria-label={ariaLabel} aria-pressed={active} disabled={disabled} className={`${base} ${look}`}>{children}</button>;
}

/** A thin vertical divider between toolbar groups. */
export const ToolDivider = () => <div aria-hidden className="w-px h-5 bg-line mx-1 shrink-0" />;

export type SegOption<T extends string> = { value: T; label?: string; Icon?: LucideIcon; title?: string };

/** A pill segmented control (single choice). Options can be icon-only, text, or both. */
export function Segmented<T extends string>({ value, onChange, options, ariaLabel, full }: {
  value: T; onChange: (v: T) => void; options: SegOption<T>[]; ariaLabel?: string; full?: boolean;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className={`inline-flex items-center gap-0.5 rounded-xl bg-surface-2 p-1 ${full ? "w-full" : ""}`}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          // AN ICON-ONLY OPTION HAS NO NAME WITHOUT THIS. Every segment carried a `title` and nothing else, and
          // a `title` is only the LAST fallback an accessible name is computed from — a tooltip that a screen
          // reader may announce, may truncate, and that a keyboard user never sees at all. The device chips
          // (Mobile / Tablet / Laptop / Desktop / Wide) are the whole toolbar's worth of icon-only buttons in
          // this app, so "the preview width" was effectively unnamed. Labelled segments already have their text
          // as the name and are unaffected.
          <button key={o.value} onClick={() => onChange(o.value)} title={o.title ?? o.label}
            aria-label={o.label ? undefined : (o.title ?? o.value)} aria-pressed={on}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${full ? "flex-1" : ""} ${on ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"}`}>
            {o.Icon && <o.Icon className="w-3.5 h-3.5" />}{o.label && <span>{o.label}</span>}
          </button>
        );
      })}
    </div>
  );
}

/**
 * THE TABLE PICKER — choose a layout by pointing at its shape.
 *
 * The same gesture as inserting a table in a word processor: sweep across the little grid and the cells light
 * up, click and you get that many across and that many down. It is the front door to the layout system,
 * because "four across, three down" is a shape a person can see, while "each block spans three of twelve" is
 * one they have to work out.
 *
 * Only the column counts that divide the twelve are offered — five across cannot be twelfths (12/5 is 2.4),
 * and a row of five where two are quietly wider is worse than not offering five at all. `columns` is passed
 * in rather than assumed here so the ladder stays in one place.
 *
 * Keyboard-reachable as a real grid: arrows move the size, Enter picks it, so it is never a mouse-only
 * control (WCAG 2.1.1). The live region says the current shape out loud for a screen reader.
 */
export function TablePicker({ columns, maxRows = 6, onPick, label = "Choose a layout" }: {
  columns: number[]; maxRows?: number; onPick: (cols: number, rows: number) => void; label?: string;
}) {
  // `hover` holds an INDEX into `columns`, not a column count. That is the point: the first version drew
  // twelve uniform squares and snapped a sweep back to the nearest count that divides the twelve — so six of
  // the twelve could never be chosen, and landing on one silently gave you a different layout. One cell per
  // OFFERED count means every position is reachable and nothing is quietly rounded. The counts are printed
  // under the columns so a cell's meaning is never something to work out.
  const [hover, setHover] = useState<{ ci: number; r: number }>({ ci: 1, r: 1 });
  const cols = columns[Math.min(hover.ci, columns.length - 1)] ?? 1;
  const rows = hover.r;
  const total = cols * rows;
  const onKey = (e: ReactKeyboardEvent) => {
    const k = e.key;
    if (k === "Enter" || k === " ") { e.preventDefault(); onPick(cols, rows); return; }
    const d = k === "ArrowRight" ? [1, 0] : k === "ArrowLeft" ? [-1, 0] : k === "ArrowDown" ? [0, 1] : k === "ArrowUp" ? [0, -1] : null;
    if (!d) return;
    e.preventDefault();
    setHover((h) => ({ ci: Math.min(columns.length - 1, Math.max(0, h.ci + d[0])), r: Math.min(maxRows, Math.max(1, h.r + d[1])) }));
  };
  return (
    <div>
      <p className="mb-1.5 text-[0.6875rem] leading-snug text-muted">
        Move across the squares to set the columns and rows, then click.
      </p>
      {/* FIXED SIZE, ALWAYS. The version before this drew only the chosen cells, so the box grew as you swept
          downwards — which made the menu's scrollbar appear, which narrowed the content, which moved the cells
          under the pointer, which changed the row, which resized the box again. It flickered without stopping.
          A grid that never changes size cannot feed back into the pointer, and it is also the shape everyone
          already knows from inserting a table: every cell visible, the chosen region lit. */}
      <div
        role="grid"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKey}
        className="inline-grid gap-1 rounded-xl bg-surface-2 p-1.5 outline-none ring-1 ring-line focus-visible:ring-2 focus-visible:ring-brand"
        style={{ gridTemplateColumns: `repeat(${columns.length}, 2.1rem)`, gridTemplateRows: `repeat(${maxRows}, 1.15rem)` }}
      >
        {Array.from({ length: columns.length * maxRows }, (_, i) => {
          const ci = i % columns.length, r = Math.floor(i / columns.length) + 1;
          const on = ci <= hover.ci && r <= rows;
          return (
            <button
              key={i}
              role="gridcell"
              aria-label={`${columns[ci]} across, ${r} down`}
              aria-selected={on}
              onMouseEnter={() => setHover({ ci, r })}
              onFocus={() => setHover({ ci, r })}
              onClick={() => onPick(columns[ci], r)}
              className={`rounded-[4px] transition-colors ${on ? "bg-brand" : "bg-surface ring-1 ring-line hover:ring-brand/40"}`}
            />
          );
        })}
      </div>
      {/* What each column actually MEANS. Without this a sweep to the fifth square gives six columns and the
          jump from 4 to 6 to 12 looks like a bug rather than the only counts twelve divides into. */}
      <div aria-hidden className="mt-1 inline-grid gap-1 px-1.5" style={{ gridTemplateColumns: `repeat(${columns.length}, 2.1rem)` }}>
        {columns.map((c, i) => (
          <span key={c} className={`text-center text-[0.625rem] tabular-nums transition-colors ${i === hover.ci ? "font-bold text-brand" : "text-muted"}`}>{c}</span>
        ))}
      </div>
      <p aria-live="polite" className="mt-1.5 flex items-baseline gap-1.5 text-[0.75rem]">
        <span className="font-semibold text-ink">{cols} across × {rows} down</span>
        <span className="text-muted">· {total} cell{total === 1 ? "" : "s"}</span>
      </p>
    </div>
  );
}

/**
 * The UNEVEN splits, shown as the shapes they are.
 *
 * They were a text list — "Sidebar left · 4 · 8" beside a sparkle icon — which asks a person to picture a
 * layout from two numbers. A layout picker should show layouts (RULE S: every design is a visual preview,
 * never a text chip), so each one draws its own proportions and the name sits underneath.
 */
export function SplitGallery({ splits, onPick }: {
  splits: { id: string; label: string; spans: number[] }[];
  onPick: (id: string) => void;
}) {
  return (
    <div role="group" aria-label="Uneven splits" className="grid grid-cols-2 gap-1.5">
      {splits.map((s) => {
        // The label carries the proportions after a "·" for the text list; the picture says it better, so the
        // name alone is shown and the numbers become the tooltip.
        const name = s.label.split("·")[0].trim();
        return (
          <button
            key={s.id}
            onClick={() => onPick(s.id)}
            title={s.label}
            aria-label={s.label}
            className="group rounded-lg p-1.5 text-left transition-colors hover:bg-brand/[0.07] focus-visible:outline-2 focus-visible:outline-brand"
          >
            <span aria-hidden className="flex h-8 gap-1 rounded-md bg-surface-2 p-1 ring-1 ring-line transition-colors group-hover:ring-brand/40">
              {s.spans.map((n, i) => (
                <span key={i} style={{ flex: n }} className="rounded-[3px] bg-brand/70 transition-colors group-hover:bg-brand" />
              ))}
            </span>
            <span className="mt-1 block truncate text-[0.6875rem] font-medium text-muted transition-colors group-hover:text-ink">{name}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Top-level UNDERLINE tabs (WordPress-style Page/Block). */
export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string }[]; value: T; onChange: (id: T) => void }) {
  return (
    <div role="tablist" aria-label="Inspector sections" className="flex gap-4 border-b border-line">
      {tabs.map((t) => {
        const on = t.id === value;
        return (
          <button key={t.id} role="tab" aria-selected={on} onClick={() => onChange(t.id)}
            className={`relative py-2 text-xs font-semibold transition-colors ${on ? "text-ink" : "text-muted hover:text-ink"}`}>
            {t.label}
            {on && <span aria-hidden className="absolute left-0 right-0 -bottom-px h-0.5 bg-brand rounded-full" />}
          </button>
        );
      })}
    </div>
  );
}

// ── Dropdown menu (portaled, smart-positioned, internally scrollable) ─────────
type AnchorRect = { top: number; left: number; bottom: number; right: number };

/**
 * A dropdown menu portaled to <body> so a small box can never clip it. It positions itself relative to the
 * anchor button and FLIPS above when there isn't room below, CLAMPS to the viewport, and caps its height so
 * it always fits — scrolling INTERNALLY. Closes on outside-click, Escape, page-scroll or resize, but NOT
 * when you scroll INSIDE the menu (the bug that made it vanish). Give it MenuItem/MenuHeader/MenuSep children.
 */
export function PortalMenu({ anchor, onClose, width = 200, ariaLabel, children }: { anchor: AnchorRect; onClose: () => void; width?: number; ariaLabel?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({ position: "fixed", left: -9999, top: -9999, width });

  useLayoutEffect(() => {
    const vw = window.innerWidth, vh = window.innerHeight, gap = 6;
    const left = Math.max(8, Math.min(anchor.left, vw - width - 8));
    const below = vh - anchor.bottom - gap - 8;
    const above = anchor.top - gap - 8;
    const openUp = below < 300 && above > below; // flip above when cramped below
    setStyle(openUp
      ? { position: "fixed", left, bottom: vh - anchor.top + gap, maxHeight: Math.max(180, above), width }
      : { position: "fixed", left, top: anchor.bottom + gap, maxHeight: Math.max(180, below), width });
  }, [anchor.top, anchor.left, anchor.bottom, anchor.right, width]);

  // SUBSCRIBE ONCE, and read the latest `onClose` through a ref (the refs + `[]` pattern this codebase uses
  // for every global handler). Depending on `onClose` looked harmless and swallowed the FIRST Escape on every
  // menu the canvas opens: `onClose` is an inline arrow, so it is a new function each render; the canvas has
  // its own document-level Escape handler which re-renders (Escape also steps the selection out); and a
  // listener REMOVED while an event is being dispatched is never called for that event, while one ADDED then
  // is not called either. So the menu's own Escape listener was torn down and rebuilt mid-flight and simply
  // missed the key. Pressing Escape a second time worked, which is exactly how it looked in use: nothing
  // happens, then it does. A stable listener cannot be caught in that window.
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const close = () => closeRef.current();
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    // Close when the PAGE scrolls (the anchor would go stale) — but IGNORE scrolling INSIDE the menu itself.
    const onScroll = (e: Event) => { if (ref.current && ref.current.contains(e.target as Node)) return; close(); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", close);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); window.removeEventListener("scroll", onScroll, true); window.removeEventListener("resize", close); };
  }, []);

  return createPortal(
    <div
      ref={ref}
      role="menu"
      aria-label={ariaLabel}
      style={{ ...style, zIndex: CHROME_Z.menu }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      /* `scrollbar-gutter: stable` reserves the scrollbar's width whether or not one is showing. Without it,
         content that grows past the menu's height makes a scrollbar appear, which narrows the content, which
         moves whatever is under the pointer — and a hover-driven control can then feed back into itself and
         flicker without stopping. The gutter costs a few pixels and removes the whole class of problem. */
      className="overflow-y-auto overscroll-contain rounded-xl border border-line bg-surface shadow-2xl ring-1 ring-black/5 p-1.5 [scrollbar-gutter:stable]"
    >{children}</div>,
    document.body,
  );
}

/** A row in a PortalMenu. */
export function MenuItem({ onClick, Icon, label, danger, disabled, hint }: { onClick: () => void; Icon: LucideIcon; label: string; danger?: boolean; disabled?: boolean; hint?: string }) {
  return (
    <button
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2 py-1.5 text-xs text-left rounded-lg disabled:opacity-40 disabled:cursor-not-allowed ${danger ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40" : "text-ink hover:bg-surface-2"}`}
    ><Icon className={`w-3.5 h-3.5 ${danger ? "text-red-400" : "text-muted"}`} /><span className="flex-1">{label}</span>{hint && <kbd aria-hidden="true" className="text-[0.5625rem] font-sans text-muted">{hint}</kbd>}</button>
  );
}

export const MenuHeader = ({ children }: { children: ReactNode }) => <div className="px-2 pt-1 pb-1 text-[0.5625rem] font-semibold uppercase tracking-wide text-muted">{children}</div>;
export const MenuSep = () => <div className="h-px bg-line my-1 mx-1" />;

/** A collapsible section — a hairline-divided settings list with the section icon in a soft tinted square. */
export function Accordion({ title, icon: Icon, defaultOpen = true, children }: { title: string; icon?: LucideIcon; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 dark:border-white/5">
      <button onClick={() => setOpen((v) => !v)} aria-expanded={open} className="group w-full flex items-center gap-2.5 py-2.5">
        {Icon && (
          <span className="grid place-items-center w-6 h-6 rounded-lg bg-gray-100 dark:bg-white/5 midnight:bg-cyan-500/10 purple:bg-pink-500/10 text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/15 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
            <Icon className="w-3.5 h-3.5" strokeWidth={2} />
          </span>
        )}
        <span className="flex-1 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 midnight:group-hover:text-cyan-100 purple:group-hover:text-pink-100 transition-colors">{title}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-transform ${open ? "" : "-rotate-90"}`} strokeWidth={2} />
      </button>
      {open && <div className="pb-4 space-y-3">{children}</div>}
    </div>
  );
}
