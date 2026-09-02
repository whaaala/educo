"use client";

/**
 * CompactSelect — a small, labelled dropdown sized for dense side-panels (the Box Builder inspector). Unlike a
 * raw <select> it renders a fully CUSTOM, theme-styled menu (so it looks the same in every browser and theme),
 * portaled to <body> and positioned with fixed coords so a narrow/overflow-clipped panel can never cut it off.
 * Pass flat `options` or grouped `optionGroups`. Keyboard + screen-reader accessible (labelled combobox +
 * listbox/option roles, Escape to close). Light/dark/midnight/purple.
 */

import { useId, useRef, useState, useLayoutEffect, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { COMPACT_INPUT_CLS, COMPACT_LABEL_CLS } from "./CompactField";

export interface CompactSelectOption { value: string; label: string }
export interface CompactSelectGroup { group: string; items: CompactSelectOption[] }

export interface CompactSelectProps {
  label?: ReactNode;
  ariaLabel?: string;
  value: string;
  onChange: (value: string) => void;
  options?: CompactSelectOption[];
  optionGroups?: CompactSelectGroup[];
  placeholder?: string;
  disabled?: boolean;
}

export default function CompactSelect({ label, ariaLabel, value, onChange, options, optionGroups, placeholder, disabled = false }: CompactSelectProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top?: number; bottom?: number; width: number } | null>(null);

  const flat = optionGroups ? optionGroups.flatMap((g) => g.items) : (options ?? []);
  const selected = flat.find((o) => o.value === value);
  const aria = ariaLabel ?? (typeof label === "string" ? label : undefined);

  // Position the portaled menu under (or above, when cramped) the trigger, clamped to the viewport.
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const below = window.innerHeight - r.bottom;
    const openUp = below < 280 && r.top > below;
    setPos(openUp
      ? { left: r.left, bottom: window.innerHeight - r.top + 4, width: r.width }
      : { left: r.left, top: r.bottom + 4, width: r.width });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!menuRef.current?.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onScroll = (e: Event) => { if (menuRef.current?.contains(e.target as Node)) return; setOpen(false); };
    const onResize = () => setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); window.removeEventListener("scroll", onScroll, true); window.removeEventListener("resize", onResize); };
  }, [open]);

  const renderOpt = (o: CompactSelectOption) => (
    <button key={o.value} type="button" role="option" aria-selected={o.value === value}
      onClick={() => { onChange(o.value); setOpen(false); }}
      className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs text-left rounded-md transition-colors ${o.value === value ? "bg-indigo-600 text-white" : "text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-100 dark:hover:bg-white/10 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"}`}>
      <span className="flex-1 truncate">{o.label}</span>
      {o.value === value && <Check className="w-3 h-3 shrink-0" />}
    </button>
  );

  const trigger = (
    <button ref={btnRef} type="button" id={id} aria-haspopup="listbox" aria-expanded={open} aria-label={aria} disabled={disabled}
      onClick={() => setOpen((o) => !o)}
      className={`${COMPACT_INPUT_CLS} flex items-center justify-between gap-2 text-left disabled:opacity-50 disabled:cursor-not-allowed`}>
      <span className={`truncate ${selected ? "" : "text-gray-400"}`}>{selected?.label ?? placeholder ?? ""}</span>
      <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
  );

  const menu = open && pos ? createPortal(
    <div ref={menuRef} role="listbox" aria-label={aria}
      style={{ position: "fixed", left: pos.left, top: pos.top, bottom: pos.bottom, width: pos.width, maxHeight: 260 }}
      className="z-[10000] overflow-y-auto overscroll-contain rounded-lg border border-gray-200 dark:border-white/10 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-[#14171f] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] shadow-xl ring-1 ring-black/5 p-1">
      {optionGroups
        ? optionGroups.map((g) => (
          <div key={g.group}>
            <div className="px-2 pt-1.5 pb-0.5 text-[0.5625rem] font-semibold uppercase tracking-wide text-gray-400">{g.group}</div>
            {g.items.map(renderOpt)}
          </div>
        ))
        : (options ?? []).map(renderOpt)}
    </div>,
    document.body,
  ) : null;

  if (!label) return <>{trigger}{menu}</>;
  return (
    <label className="block" htmlFor={id}>
      <span className={COMPACT_LABEL_CLS}>{label}</span>
      {trigger}
      {menu}
    </label>
  );
}
