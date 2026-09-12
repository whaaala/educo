"use client";

/**
 * ColorField — a reusable, labelled colour field: a live swatch that opens the native colour picker,
 * an editable hex input, and (where supported) a screen eyedropper. Accepts ANY hex — unlike
 * ColorPalettePicker, which offers a fixed grid of presets. Responsive, theme-aware (light/dark/
 * midnight/purple), keyboard + screen-reader accessible. Use this everywhere a single colour is chosen.
 */

import { useEffect, useId, useState } from "react";
import { Pipette, Wand2 } from "lucide-react";
import ErrorMessage from "./ErrorMessage";
import { contrastRatio, nearestAccessibleColor } from "@/lib/educo-ui/color";

export interface ColorFieldProps {
  label: string;
  value: string;                         // hex, e.g. "#4f46e5"
  onChange: (hex: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpText?: string;
  /** Show the screen eyedropper button when the browser supports the EyeDropper API (default true). */
  eyedropper?: boolean;
  /** When set, shows a live WCAG contrast badge (this colour vs `contrastBg`) + a one-click accessible fix. */
  contrastBg?: string;
  /** Grade the contrast for large text (≥3:1) instead of body text (≥4.5:1). */
  largeText?: boolean;
  className?: string;
}

const HEX_RE = /^#?[0-9a-fA-F]{6}$/;
const HEX3_RE = /^#?[0-9a-fA-F]{3}$/;

/** Normalise any accepted hex to a "#rrggbb" lowercase string; returns null if unparseable. */
function normalizeHex(raw: string): string | null {
  const t = raw.trim();
  if (HEX_RE.test(t)) return `#${t.replace(/^#/, "").toLowerCase()}`;
  if (HEX3_RE.test(t)) {
    const h = t.replace(/^#/, "");
    return `#${h.split("").map((c) => c + c).join("").toLowerCase()}`;
  }
  return null;
}

export default function ColorField({
  label, value, onChange, disabled = false, required = false, error, helpText,
  eyedropper = true, contrastBg, largeText = false, className = "",
}: ColorFieldProps) {
  const id = useId();
  const [text, setText] = useState(value);
  const [hasEyeDropper, setHasEyeDropper] = useState(false);

  // Keep the text box in sync when the value changes from outside (presets, reset, …).
  useEffect(() => setText(value), [value]);
  useEffect(() => { setHasEyeDropper(typeof window !== "undefined" && "EyeDropper" in window); }, []);

  const normalized = normalizeHex(value) ?? "#000000";

  const commitText = (raw: string) => {
    const n = normalizeHex(raw);
    if (n) onChange(n);
    else setText(value); // revert invalid entry to the last good value
  };

  const pickWithEyeDropper = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await new (window as any).EyeDropper().open();
      if (res?.sRGBHex) onChange(res.sRGBHex);
    } catch { /* user cancelled */ }
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-xs font-medium text-gray-600 dark:text-gray-300 midnight:text-slate-300 purple:text-purple-200">
        {label}{required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
      </label>
      <div className={`flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 dark:border-gray-700 dark:bg-[#1a1d24] midnight:border-cyan-500/20 midnight:bg-[#0f1428] purple:border-pink-500/20 purple:bg-purple-900/30 ${disabled ? "opacity-50" : ""}`}>
        {/* Swatch = the native colour picker trigger */}
        <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md ring-1 ring-inset ring-black/10 dark:ring-white/15" style={{ background: normalized }}>
          <input
            type="color" value={normalized} disabled={disabled}
            onChange={(e) => onChange(e.target.value.toLowerCase())}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            aria-label={`${label} colour picker`}
            tabIndex={-1}
          />
        </span>
        <input
          id={id} type="text" inputMode="text" value={text} disabled={disabled}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => commitText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") commitText((e.target as HTMLInputElement).value); }}
          className="w-full min-w-0 bg-transparent font-mono text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-200 midnight:text-slate-200 purple:text-purple-100"
          placeholder="#000000"
          aria-label={`${label} hex value`}
          aria-invalid={!!error}
        />
        {eyedropper && hasEyeDropper && (
          <button
            type="button" onClick={pickWithEyeDropper} disabled={disabled}
            className="shrink-0 rounded-md p-1 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:bg-[#22262e] dark:hover:text-gray-200 midnight:text-slate-400 midnight:hover:bg-cyan-500/10 purple:text-purple-300 purple:hover:bg-pink-500/10"
            aria-label={`Pick ${label} colour from screen`}
            title="Pick colour from screen"
          >
            <Pipette className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      {/* WCAG contrast checker + one-click accessible fix (app-wide guardrail) */}
      {contrastBg && (() => {
        const min = largeText ? 3 : 4.5;
        const ratio = contrastRatio(normalized, contrastBg);
        const ok = ratio >= min;
        const grade = ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA Large" : "Fail";
        return (
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 shrink-0 rounded ring-1 ring-inset ring-black/10 dark:ring-white/15" style={{ background: contrastBg }} aria-hidden="true" />
              <span className="font-mono tabular-nums text-gray-500 dark:text-gray-400 midnight:text-slate-400 purple:text-purple-300">{ratio.toFixed(2)}:1</span>
              <span className={`rounded px-1.5 py-0.5 font-bold text-white ${ok ? "bg-green-600" : ratio >= 3 ? "bg-amber-500" : "bg-red-600"}`}>{grade}</span>
            </span>
            {!ok && !disabled && (
              <button
                type="button"
                onClick={() => onChange(nearestAccessibleColor(normalized, contrastBg, min))}
                className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10 midnight:text-cyan-400 midnight:hover:bg-cyan-500/10 purple:text-pink-400 purple:hover:bg-pink-500/10"
                title={`Nudge ${label} to the nearest shade that meets WCAG ${largeText ? "AA large (3:1)" : "AA (4.5:1)"}`}
              >
                <Wand2 className="h-3 w-3" aria-hidden="true" /> Fix contrast
              </button>
            )}
          </div>
        );
      })()}
      {error ? <ErrorMessage message={error} /> : helpText ? (
        <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-slate-400 purple:text-purple-300">{helpText}</p>
      ) : null}
    </div>
  );
}
