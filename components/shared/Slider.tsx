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
  /**
   * SP-4 (BATCH LE-12) · a SCALE: the thumb moves on these values only, ascending — a drag and the arrow keys alike (the spacing
   * scale, as the canvas handles step). A value between them reads as it is until it is moved.
   */
  steps?: readonly number[];
}

export default function Slider({
  label, value, onChange, min = 0, max = 100, step = 1, unit = "",
  showValue = true, formatValue, disabled = false, className = "", steps,
}: SliderProps) {
  const id = useId();
  const display = formatValue ? formatValue(value) : `${value}${unit}`;

  /**
   * THE TRACK STRETCHES TO HOLD THE VALUE IT IS GIVEN. A native range input clamps its THUMB to `max` but
   * says nothing about it, so a value past the end draws identically to `max` while the readout beside it
   * shows the real number — the control contradicting itself.
   *
   * Measured, and the reason this exists: a stack whose height had run away to 114.6rem showed its "Band
   * height" thumb hard against the right-hand end of a 0–45rem track. The thumb said 45, the readout said
   * 114.6, and the first nudge of the thumb would have silently snapped the real height down to 45. The
   * runaway was invisible in the one control that was displaying it.
   */
  const lo = Math.min(min, value);
  const hi = Math.max(max, value);
  // on a scale the range is the scale's places; the nearest place to the value is where the thumb sits
  const at = steps?.length ? steps.reduce((best, v, i) => (Math.abs(v - value) < Math.abs(steps[best] - value) ? i : best), 0) : -1;

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
        id={id} type="range" disabled={disabled}
        {...(steps?.length ? { min: 0, max: steps.length - 1, step: 1, value: at } : { min: lo, max: hi, step, value })}
        onChange={(e) => onChange(steps?.length ? steps[Number(e.target.value)] : Number(e.target.value))}
        className="h-2 pointer-coarse:h-11 pointer-coarse:bg-clip-content pointer-coarse:py-[1.125rem] w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#22262e] dark:accent-blue-500 midnight:bg-cyan-500/15 midnight:accent-cyan-500 purple:bg-pink-500/15 purple:accent-pink-500"
        aria-label={label}
        aria-valuetext={display}
      />
    </div>
  );
}
