"use client";

/**
 * CompactField — a small, labelled text/number input sized for dense side-panels (the Box Builder inspector,
 * property panels, toolbars) where the full-size FormInput (with its icon badge + tall padding) is too big.
 * One shared atom instead of raw <input>: themed for light/dark/midnight/purple, keyboard + screen-reader
 * labelled. Use `label` for a stacked label; omit it and pass `ariaLabel` for a bare input inside a grid cell.
 */

import { useId, type ReactNode } from "react";

export const COMPACT_INPUT_CLS =
  "w-full text-sm px-2.5 py-2 rounded-lg border border-gray-200 dark:border-white/10 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-transparent text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 focus:ring-2 focus:ring-indigo-500 outline-none";
export const COMPACT_LABEL_CLS =
  "text-[0.6875rem] font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300";

export interface CompactFieldProps {
  label?: ReactNode;
  ariaLabel?: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number";
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /** Extra classes merged onto the input (e.g. `text-center`). */
  inputClassName?: string;
  /** Stack the label centred + tiny (grid-cell style) instead of the default left-aligned label. */
  center?: boolean;
  helpText?: ReactNode;
}

export default function CompactField({
  label, ariaLabel, value, onChange, type = "text", placeholder,
  min, max, step, disabled = false, inputClassName = "", center = false, helpText,
}: CompactFieldProps) {
  const id = useId();
  const aria = ariaLabel ?? (typeof label === "string" ? label : undefined);
  const input = (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      aria-label={aria}
      className={`${COMPACT_INPUT_CLS} ${inputClassName}`}
    />
  );
  if (!label) return input;
  return (
    <label className={center ? "flex flex-col items-center gap-0.5" : "block"} htmlFor={id}>
      <span className={center ? "text-[0.5625rem] uppercase tracking-wide text-gray-400" : COMPACT_LABEL_CLS}>{label}</span>
      {input}
      {helpText && <span className="text-[0.5625rem] text-gray-400">{helpText}</span>}
    </label>
  );
}
