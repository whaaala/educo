"use client";

/**
 * EducoColorField — the design-system colour control. A compact labelled swatch + hex field + screen
 * eyedropper that opens a portaled popover of the Educo OKLCH palette: the token-studio's brand PALETTES
 * and the full colour SPECTRUM (every hue run through the same OKLCH ramp engine), plus a neutrals row.
 * Use this everywhere a solid colour is chosen in the builder so every picker offers the same new palette.
 * Themed (light/dark/midnight/purple), keyboard + screen-reader labelled, portaled so a narrow panel can't
 * clip it. For an optional WCAG guardrail pass `contrastBg` (shows the live ratio + a one-click fix).
 */

import { useId, useRef, useState, useMemo, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";
import { Pipette, Palette as PaletteIcon, Wand2 } from "lucide-react";
import { SPECTRUM, PALETTES } from "@/lib/educo-ui/palettes";
import { rampFromHex, contrastRatio, nearestAccessibleColor, type Shade } from "@/lib/educo-ui/color";
import { COMPACT_LABEL_CLS } from "./CompactField";

const GRID_SHADES: Shade[] = [75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const NEUTRALS = ["#ffffff", "#f3f4f6", "#d1d5db", "#9ca3af", "#6b7280", "#374151", "#111827", "#000000"];

function normalizeHex(v: string): string | null {
  const s = v.trim().replace(/^#?/, "");
  if (/^[0-9a-fA-F]{3}$/.test(s)) return "#" + s.split("").map((c) => c + c).join("").toLowerCase();
  if (/^[0-9a-fA-F]{6}$/.test(s)) return "#" + s.toLowerCase();
  return null;
}

const CHECKER = "repeating-conic-gradient(#c9ced6 0% 25%, #ffffff 0% 50%) 50% / 10px 10px";

export interface EducoColorFieldProps {
  label?: string;
  ariaLabel?: string;
  value: string;
  onChange: (hex: string) => void;
  contrastBg?: string;
  largeText?: boolean;
  /** When provided, the picker offers a "None (transparent)" choice that calls this to clear the colour. */
  onClear?: () => void;
}

export default function EducoColorField({ label, ariaLabel, value, onChange, contrastBg, largeText = false, onClear }: EducoColorFieldProps) {
  const id = useId();
  const aria = ariaLabel ?? label ?? "colour";
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(value);
  const [hasEye, setHasEye] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top?: number; bottom?: number; width: number } | null>(null);

  useEffect(() => setText(value === "transparent" ? "" : value), [value]);
  useEffect(() => { setHasEye(typeof window !== "undefined" && "EyeDropper" in window); }, []);

  // OKLCH ramps are computed once (not per-render/keystroke).
  const spectrum = useMemo(() => SPECTRUM.map((h) => ({ name: h.name, ramp: rampFromHex(h.hex) })), []);
  const presets = useMemo(() => PALETTES.slice(0, 30), []);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const below = window.innerHeight - r.bottom;
    const openUp = below < 360 && r.top > below;
    const width = Math.max(r.width, 236);
    setPos(openUp ? { left: r.left, bottom: window.innerHeight - r.top + 6, width } : { left: r.left, top: r.bottom + 6, width });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!popRef.current?.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onScroll = (e: Event) => { if (popRef.current?.contains(e.target as Node)) return; setOpen(false); };
    const onResize = () => setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); window.removeEventListener("scroll", onScroll, true); window.removeEventListener("resize", onResize); };
  }, [open]);

  const isNone = !value || value === "transparent";
  const normalized = normalizeHex(value) ?? "#000000";
  const commit = (raw: string) => { const n = normalizeHex(raw); if (n) onChange(n); else setText(value); };
  const pickEyedropper = async () => {
    try { const res = await new (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper().open(); if (res?.sRGBHex) onChange(res.sRGBHex); } catch { /* cancelled */ }
  };

  const ratio = contrastBg ? contrastRatio(normalized, contrastBg) : null;
  const min = largeText ? 3 : 4.5;

  return (
    <div className="flex flex-col gap-1">
      {label && <span className={COMPACT_LABEL_CLS}>{label}</span>}
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-white/10 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0f1428] purple:bg-purple-900/30 px-2 py-1.5">
        <button ref={btnRef} type="button" onClick={() => setOpen((o) => !o)} aria-label={`${aria} swatch`} aria-haspopup="dialog" aria-expanded={open}
          className="h-7 w-7 shrink-0 rounded-md ring-1 ring-inset ring-black/10 dark:ring-white/15" style={{ background: isNone ? CHECKER : normalized }} title={isNone ? "No colour" : normalized} />
        <input id={id} type="text" value={text} onChange={(e) => setText(e.target.value)} onBlur={(e) => commit(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") commit((e.target as HTMLInputElement).value); }}
          aria-label={`${aria} hex value`} placeholder="#000000"
          className="w-full min-w-0 bg-transparent font-mono text-sm text-gray-700 dark:text-gray-200 midnight:text-slate-200 purple:text-purple-100 outline-none placeholder:text-gray-400" />
        {hasEye && (
          <button type="button" onClick={pickEyedropper} aria-label={`Pick ${aria} from screen`} title="Pick from screen"
            className="shrink-0 rounded-md p-1 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-white/10"><Pipette className="h-4 w-4" /></button>
        )}
        <button type="button" onClick={() => setOpen((o) => !o)} aria-label={`${aria} palette`} title="Open palette"
          className="shrink-0 rounded-md p-1 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-white/10"><PaletteIcon className="h-4 w-4" /></button>
      </div>

      {ratio != null && (
        <div className="flex items-center justify-between gap-2 text-[0.5625rem]">
          <span className={ratio >= min ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}>
            WCAG {ratio.toFixed(2)}:1 {ratio >= min ? "✓ AA" : "· low"}
          </span>
          {ratio < min && (
            <button type="button" onClick={() => onChange(nearestAccessibleColor(normalized, contrastBg!, min))} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-500"><Wand2 className="h-3 w-3" /> Fix contrast</button>
          )}
        </div>
      )}

      {open && pos && createPortal(
        <div ref={popRef} role="dialog" aria-label={`${aria} palette`}
          style={{ position: "fixed", left: pos.left, top: pos.top, bottom: pos.bottom, width: pos.width, maxHeight: 360 }}
          className="z-[10000] overflow-y-auto overscroll-contain rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#14171f] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] shadow-2xl ring-1 ring-black/5 p-2 space-y-2">
          {onClear && (
            <button type="button" onClick={() => { onClear(); setOpen(false); }} aria-label={`Clear ${aria} — no colour`}
              className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-md ${isNone ? "bg-indigo-600 text-white" : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"}`}>
              <span className="h-4 w-4 rounded-[3px] ring-1 ring-inset ring-black/10" style={{ background: CHECKER }} />
              <span className="flex-1 text-left">None (transparent)</span>
            </button>
          )}
          <div className="text-[0.5625rem] font-semibold uppercase tracking-wide text-gray-400">Palettes</div>
          <div className="flex flex-wrap gap-1">
            {presets.map((p) => (
              <button key={p.name} type="button" title={`${p.name} (${p.patch.primary})`} onClick={() => onChange(p.patch.primary!)}
                className="h-5 w-5 rounded-md ring-1 ring-inset ring-black/10 dark:ring-white/15" style={{ background: p.patch.primary }} />
            ))}
          </div>
          <div className="text-[0.5625rem] font-semibold uppercase tracking-wide text-gray-400">Spectrum · OKLCH</div>
          <div className="space-y-0.5">
            {spectrum.map((h) => (
              <div key={h.name} className="flex gap-0.5">
                {GRID_SHADES.map((s) => (
                  <button key={s} type="button" title={`${h.name} ${s} · ${h.ramp[s]}`} onClick={() => onChange(h.ramp[s])}
                    className="h-4 flex-1 rounded-[3px] transition-transform hover:scale-110 hover:ring-1 hover:ring-black/20" style={{ background: h.ramp[s] }} />
                ))}
              </div>
            ))}
          </div>
          <div className="text-[0.5625rem] font-semibold uppercase tracking-wide text-gray-400">Neutrals</div>
          <div className="flex gap-0.5">
            {NEUTRALS.map((n) => (
              <button key={n} type="button" title={n} onClick={() => onChange(n)} className="h-4 flex-1 rounded-[3px] ring-1 ring-inset ring-black/10 dark:ring-white/10" style={{ background: n }} />
            ))}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
