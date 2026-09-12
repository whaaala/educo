"use client";

/**
 * Slider — a reusable, labelled range control (corner radius, opacity, sizes, spacing, …). Shows the
 * live value with an optional unit. Responsive (full-width), theme-aware (light/dark/midnight/purple),
 * keyboard accessible (arrow keys via the native range input) and screen-reader labelled. Use this
 * everywhere a numeric value is chosen on a continuum instead of a raw `<input type="range">`.
 */

import { useId } from "react";

export interface SliderProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Suffix shown next to the value, e.g. "px" or "%". */
  unit?: string;
  /** Show the numeric value on the right of the label row (default true). */
  showValue?: boolean;
  /** Custom formatter for the displayed value; overrides unit. */
  formatValue?: (value: number) => string;
  disabled?: boolean;
  className?: string;
}

export default function Slider({
  label, value, onChange, min = 0, max = 100, step = 1, unit = "",
  showValue = true, formatValue, disabled = false, className = "",
}: SliderProps) {
  const id = useId();
  const display = formatValue ? formatValue(value) : `${value}${unit}`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <label htmlFor={id} className="text-xs font-medium text-gray-600 dark:text-gray-300 midnight:text-slate-300 purple:text-purple-200">
              {label}
            </label>
          )}
          {showValue && (
            <span className="font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400 midnight:text-slate-400 purple:text-purple-300">{display}</span>
          )}
        </div>
      )}
      <input
        id={id} type="range" min={min} max={max} step={step} value={value} disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#22262e] dark:accent-blue-500 midnight:bg-cyan-500/15 midnight:accent-cyan-500 purple:bg-pink-500/15 purple:accent-pink-500"
        aria-label={label}
        aria-valuetext={display}
      />
    </div>
  );
}
