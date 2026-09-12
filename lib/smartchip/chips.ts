/**
 * smartchip — pure model + HTML builder for "smart chips" (Smart canvas).
 *
 * Smart chips are the inline, interactive pills Google Docs calls Smart canvas: a person, a file,
 * a place, a date, a status dropdown, a variable. They live inside contentEditable HTML as
 * `contenteditable="false"` spans carrying `data-*` so they survive save/load and can be made
 * interactive. This module is pure (no DOM) so the builder is unit-testable and reusable by any
 * editable surface — the work-document today, slide text boxes / comments later.
 */

export type SmartChipKind = "person" | "file" | "place" | "date" | "dropdown" | "variable";

export interface SmartChip {
  kind: SmartChipKind;
  /** Display text (the current value). */
  value: string;
  /** Optional label prefix (e.g. "Title"). */
  label?: string;
  /** Options for a dropdown chip. */
  options?: string[];
}

export const CHIP_CLASS = "educo-smart-chip";

/** Per-kind colour + icon (unicode) — inline so they persist in the stored HTML. */
const STYLE: Record<SmartChipKind, { bg: string; border: string; color: string; icon: string }> = {
  person: { bg: "#eef2ff", border: "#c7d2fe", color: "#3730a3", icon: "👤" },
  file: { bg: "#ecfeff", border: "#a5f3fc", color: "#155e75", icon: "📄" },
  place: { bg: "#f0fdf4", border: "#bbf7d0", color: "#166534", icon: "📍" },
  date: { bg: "#fef9c3", border: "#fde68a", color: "#854d0e", icon: "📅" },
  dropdown: { bg: "#f1f5f9", border: "#cbd5e1", color: "#334155", icon: "▾" },
  variable: { bg: "#faf5ff", border: "#e9d5ff", color: "#6b21a8", icon: "🔖" },
};

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Format a date the way a date chip reads, e.g. "Jan 2, 2025". Pure & locale-independent. */
export function formatChipDate(d: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/** Cycle a dropdown chip to its next option (wraps). Returns the next value. */
export function nextDropdownValue(current: string, options: string[]): string {
  if (!options.length) return current;
  const i = options.indexOf(current);
  return options[(i + 1) % options.length];
}

/**
 * Build the inline HTML for a chip. It is `contenteditable="false"` (an atomic inline unit) and
 * carries `data-chip` / `data-options` / `data-value` so a host can restyle or make it interactive.
 */
export function buildChipHtml(chip: SmartChip): string {
  const s = STYLE[chip.kind];
  const text = chip.label ? `${chip.label}: ${chip.value}` : chip.value;
  const caret = chip.kind === "dropdown" ? ' <span style="opacity:.6">▾</span>' : "";
  const icon = chip.kind === "dropdown" ? "" : `<span aria-hidden="true">${s.icon}</span> `;
  const dataOptions = chip.options?.length ? ` data-options="${esc(chip.options.join("|"))}"` : "";
  const cursor = chip.kind === "dropdown" ? "pointer" : "default";
  return (
    `<span class="${CHIP_CLASS}" contenteditable="false" data-chip="${chip.kind}" data-value="${esc(chip.value)}"${dataOptions}` +
    ` style="display:inline-flex;align-items:center;gap:4px;padding:1px 9px;border-radius:999px;` +
    `background:${s.bg};border:1px solid ${s.border};color:${s.color};font-size:12px;line-height:1.6;margin:0 2px;cursor:${cursor};white-space:nowrap;">` +
    `${icon}${esc(text)}${caret}</span>`
  );
}

/** Convenience: a status dropdown chip with the default options. */
export function statusChip(value = "Not started"): SmartChip {
  return { kind: "dropdown", value, options: ["Not started", "In progress", "Blocked", "Done"] };
}
