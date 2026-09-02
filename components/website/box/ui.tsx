"use client";

/**
 * Shared "clean & airy" UI primitives for the Box Builder (toolbar, blocks palette, inspector). One visual
 * language: hairline borders, soft surfaces, pill segmented controls, ghost buttons, generous spacing.
 * Theme-safe via `dark:` (which also applies under midnight/purple, since those carry the `dark` class).
 */

import { useState, useEffect, useLayoutEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, type LucideIcon } from "lucide-react";

/** A quiet ghost button (icon and/or text) with an optional active state + tooltip. `primary` = the one CTA. */
export function ToolBtn({ onClick, title, ariaLabel, active, disabled, primary, children }: {
  onClick?: () => void; title?: string; ariaLabel?: string; active?: boolean; disabled?: boolean; primary?: boolean; children: ReactNode;
}) {
  const base = "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const look = primary
    ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
    : active
      ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
      : "text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-white/10";
  return <button onClick={onClick} title={title} aria-label={ariaLabel} aria-pressed={active} disabled={disabled} className={`${base} ${look}`}>{children}</button>;
}

/** A thin vertical divider between toolbar groups. */
export const ToolDivider = () => <div aria-hidden className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-1 shrink-0" />;

export type SegOption<T extends string> = { value: T; label?: string; Icon?: LucideIcon; title?: string };

/** A pill segmented control (single choice). Options can be icon-only, text, or both. */
export function Segmented<T extends string>({ value, onChange, options, ariaLabel, full }: {
  value: T; onChange: (v: T) => void; options: SegOption<T>[]; ariaLabel?: string; full?: boolean;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className={`inline-flex items-center gap-0.5 rounded-xl bg-gray-100 dark:bg-white/5 p-1 ${full ? "w-full" : ""}`}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)} title={o.title ?? o.label} aria-pressed={on}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${full ? "flex-1" : ""} ${on ? "bg-white dark:bg-white/15 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 shadow-sm" : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:text-gray-800 dark:hover:text-gray-200 midnight:hover:text-cyan-100 purple:hover:text-pink-100"}`}>
            {o.Icon && <o.Icon className="w-3.5 h-3.5" />}{o.label && <span>{o.label}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Top-level UNDERLINE tabs (WordPress-style Page/Block). */
export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string }[]; value: T; onChange: (id: T) => void }) {
  return (
    <div role="tablist" aria-label="Inspector sections" className="flex gap-4 border-b border-gray-200 dark:border-white/10">
      {tabs.map((t) => {
        const on = t.id === value;
        return (
          <button key={t.id} role="tab" aria-selected={on} onClick={() => onChange(t.id)}
            className={`relative py-2 text-xs font-semibold transition-colors ${on ? "text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50" : "text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 hover:text-gray-700 dark:hover:text-gray-200 midnight:hover:text-cyan-100 purple:hover:text-pink-100"}`}>
            {t.label}
            {on && <span aria-hidden className="absolute left-0 right-0 -bottom-px h-0.5 bg-indigo-600 rounded-full" />}
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

  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    // Close when the PAGE scrolls (the anchor would go stale) — but IGNORE scrolling INSIDE the menu itself.
    const onScroll = (e: Event) => { if (ref.current && ref.current.contains(e.target as Node)) return; onClose(); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onClose);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); window.removeEventListener("scroll", onScroll, true); window.removeEventListener("resize", onClose); };
  }, [onClose]);

  return createPortal(
    <div
      ref={ref}
      role="menu"
      aria-label={ariaLabel}
      style={style}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className="z-[9999] overflow-y-auto overscroll-contain rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#14171f] shadow-2xl ring-1 ring-black/5 p-1.5"
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
      className={`w-full flex items-center gap-2.5 px-2 py-1.5 text-xs text-left rounded-lg disabled:opacity-40 disabled:cursor-not-allowed ${danger ? "text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40" : "text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-100 dark:hover:bg-white/10"}`}
    ><Icon className={`w-3.5 h-3.5 ${danger ? "text-red-400" : "text-gray-400"}`} /><span className="flex-1">{label}</span>{hint && <kbd aria-hidden="true" className="text-[0.5625rem] font-sans text-gray-400">{hint}</kbd>}</button>
  );
}

export const MenuHeader = ({ children }: { children: ReactNode }) => <div className="px-2 pt-1 pb-1 text-[0.5625rem] font-semibold uppercase tracking-wide text-gray-400">{children}</div>;
export const MenuSep = () => <div className="h-px bg-gray-100 dark:bg-white/10 my-1 mx-1" />;

/** A collapsible section — FLAT (a hairline divider, no card) for a clean WordPress-style settings list. */
export function Accordion({ title, icon: Icon, defaultOpen = true, children }: { title: string; icon?: LucideIcon; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 dark:border-white/5">
      <button onClick={() => setOpen((v) => !v)} aria-expanded={open} className="w-full flex items-center gap-2 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:text-gray-800 dark:hover:text-gray-200 midnight:hover:text-cyan-100 purple:hover:text-pink-100">
        {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />}
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? "" : "-rotate-90"}`} strokeWidth={1.75} />
      </button>
      {open && <div className="pb-3.5 space-y-3">{children}</div>}
    </div>
  );
}
