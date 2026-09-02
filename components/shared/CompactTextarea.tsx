"use client";

/**
 * CompactTextarea — a small, labelled multi-line input sized for dense side-panels (the Box Builder inspector).
 * The full-size FormTextarea (attachments, counters, auto-grow) is overkill here. Themed for
 * light/dark/midnight/purple, a11y-labelled. Use for text content, embed/HTML, custom CSS, list items, etc.
 */

import { useId, type ReactNode } from "react";
import { COMPACT_INPUT_CLS, COMPACT_LABEL_CLS } from "./CompactField";

export interface CompactTextareaProps {
  label?: ReactNode;
  ariaLabel?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  /** Extra classes on the textarea (e.g. `font-mono`). */
  textareaClassName?: string;
  helpText?: ReactNode;
}

export default function CompactTextarea({ label, ariaLabel, value, onChange, placeholder, rows = 3, disabled = false, textareaClassName = "", helpText }: CompactTextareaProps) {
  const id = useId();
  const aria = ariaLabel ?? (typeof label === "string" ? label : undefined);
  const ta = (
    <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} disabled={disabled} aria-label={aria} className={`${COMPACT_INPUT_CLS} ${textareaClassName}`} />
  );
  if (!label) return ta;
  return (
    <label className="block" htmlFor={id}>
      <span className={COMPACT_LABEL_CLS}>{label}</span>
      {ta}
      {helpText && <span className="text-[0.5625rem] text-gray-400">{helpText}</span>}
    </label>
  );
}
