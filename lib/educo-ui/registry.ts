/**
 * Educo UI COMPONENT REGISTRY — the single, extensible source of truth for design-system components that
 * render as ONE clean node (no wrapper container), exactly like the accordion. Each entry declares:
 *   • `slots`   — the editable content fields (auto-generate the inspector's Content editor)
 *   • `variants`— the design looks offered in the inspector
 *   • `render`  — pure fn → the component's `.eu-*` HTML (used by BOTH the canvas and the export, so the
 *                 editor is always a true WYSIWYG of the published site)
 *
 * To add a FUTURE component: add one entry here + its `.eu-<name>` CSS in components.ts. No other code changes —
 * the palette, canvas, export and inspector all read from this registry. Colours come from CSS tokens only.
 */

import { iconSvg } from "./icon-svg";

export type SlotType = "text" | "textarea" | "url" | "number" | "icon";
export type Slot = { key: string; label: string; type: SlotType; default: string | number; min?: number; max?: number };
export type ComponentVariant = { id: string; label: string }; // id is the class SUFFIX, e.g. "--raised" ("" = default)
export type ComponentDef = {
  name: string;
  label: string;
  slots: Slot[];
  variants: ComponentVariant[];
  /** Small-content components (badge, rating, stat) HUG their content by default — a wide full-width box around
   *  a pill / stars / a number reads as an unwanted "container". Block components (card/quote) stay full-width. */
  hug?: boolean;
  /** Pure: content fields + variant suffix → the component's inner `.eu-*` HTML. */
  render: (f: Record<string, string | number>, variant: string) => string;
};

/** The default width token for a component: hugging ones size to content, the rest fill the row. */
export function defaultComponentWidth(name: string): string {
  return COMPONENT_REGISTRY[name]?.hug ? "auto" : "100%";
}

/** Escape HTML so user content can't break the markup (this string is injected into the canvas AND the export). */
const esc = (s: unknown): string =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** N filled + (max−N) empty stars as inline SVGs (currentColor + em-sized, per the field guide — no icon font). */
function stars(value: number, max: number): string {
  const star = (filled: boolean) =>
    `<svg class="eu-rating__star${filled ? " is-on" : ""}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">` +
    `<path fill="currentColor" d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 7.1-1.01L12 2z"/></svg>`;
  const n = Math.max(0, Math.min(Math.round(value), max));
  return Array.from({ length: max }, (_, i) => star(i < n)).join("");
}

export const COMPONENT_REGISTRY: Record<string, ComponentDef> = {
  card: {
    name: "card", label: "Card",
    slots: [
      { key: "icon", label: "Icon", type: "icon", default: "" },
      { key: "image", label: "Image URL", type: "url", default: "" },
      { key: "title", label: "Title", type: "text", default: "Card title" },
      { key: "body", label: "Body", type: "textarea", default: "A short description for this card goes right here." },
      { key: "buttonText", label: "Button", type: "text", default: "Learn more" },
      { key: "buttonHref", label: "Button link", type: "url", default: "#" },
    ],
    variants: [
      { id: "", label: "Default" }, { id: "--flat", label: "Flat" }, { id: "--raised", label: "Raised" },
    ],
    render: (f, v) => {
      const media = f.image ? `<img class="eu-card__media" src="${esc(f.image)}" alt="" />` : "";
      const icon = f.icon ? `<span class="eu-card__icon" aria-hidden="true">${iconSvg(String(f.icon))}</span>` : "";
      const btn = f.buttonText ? `<a class="eu-btn eu-btn--primary eu-card__action" href="${esc(f.buttonHref || "#")}">${esc(f.buttonText)}</a>` : "";
      return `<div class="eu-card${v}">${media}${icon}<div class="eu-card__title">${esc(f.title)}</div><div class="eu-card__body">${esc(f.body)}</div>${btn}</div>`;
    },
  },
  quote: {
    name: "quote", label: "Quote",
    slots: [
      { key: "text", label: "Quote", type: "textarea", default: "This changed everything for us — we couldn't be happier." },
      { key: "author", label: "Author", type: "text", default: "Happy Customer" },
    ],
    variants: [
      { id: "", label: "Default" }, { id: "--bordered", label: "Bordered" }, { id: "--large", label: "Large" },
    ],
    render: (f, v) =>
      `<figure class="eu-quote${v}"><blockquote class="eu-quote__text">${esc(f.text)}</blockquote>` +
      `${f.author ? `<figcaption class="eu-quote__author">— ${esc(f.author)}</figcaption>` : ""}</figure>`,
  },
  stat: {
    name: "stat", label: "Stat", hug: true,
    slots: [
      { key: "icon", label: "Icon", type: "icon", default: "" },
      { key: "value", label: "Value", type: "text", default: "1,000+" },
      { key: "label", label: "Label", type: "text", default: "Happy customers" },
    ],
    variants: [
      { id: "", label: "Default" }, { id: "--brand", label: "Brand" }, { id: "--big", label: "Big" },
    ],
    render: (f, v) => {
      const icon = f.icon ? `<span class="eu-stat__icon" aria-hidden="true">${iconSvg(String(f.icon))}</span>` : "";
      return `<div class="eu-stat${v}">${icon}<div class="eu-stat__value">${esc(f.value)}</div><div class="eu-stat__label">${esc(f.label)}</div></div>`;
    },
  },
  badge: {
    name: "badge", label: "Badge", hug: true,
    slots: [
      { key: "icon", label: "Icon", type: "icon", default: "" },
      { key: "text", label: "Text", type: "text", default: "New" },
    ],
    variants: [
      { id: "", label: "Neutral" }, { id: "--brand", label: "Brand" }, { id: "--success", label: "Success" },
      { id: "--warning", label: "Warning" }, { id: "--danger", label: "Danger" }, { id: "--info", label: "Info" },
    ],
    render: (f, v) => {
      const icon = f.icon ? `<span class="eu-badge__icon" aria-hidden="true">${iconSvg(String(f.icon))}</span>` : "";
      return `<span class="eu-badge${v}">${icon}${esc(f.text)}</span>`;
    },
  },
  rating: {
    name: "rating", label: "Rating", hug: true,
    slots: [
      { key: "value", label: "Stars", type: "number", default: 4, min: 0, max: 10 },
      { key: "max", label: "Out of", type: "number", default: 5, min: 1, max: 10 },
    ],
    variants: [{ id: "", label: "Default" }, { id: "--brand", label: "Brand" }],
    render: (f, v) => {
      const max = Math.max(1, Number(f.max) || 5);
      const val = Number(f.value) || 0;
      return `<div class="eu-rating${v}" role="img" aria-label="${esc(val)} out of ${esc(max)} stars">${stars(val, max)}</div>`;
    },
  },
};

/** Is this component name backed by the registry (renders as a single clean node)? */
export function isRegistryComponent(name: string | undefined): boolean {
  return !!name && name in COMPONENT_REGISTRY;
}

/** Whether a component lays its content out in a COLUMN (stacked) vs a ROW — so "Content position" can map the
 *  horizontal/vertical intent to the right flex axis (justify vs align) for each component. */
const COLUMN_COMPONENTS = new Set(["card", "quote", "stat", "accordion"]);
export function componentIsColumn(name: string | undefined): boolean {
  return !!name && COLUMN_COMPONENTS.has(name);
}

/** Default content fields for a component (from its slot defaults). */
export function defaultComponentFields(name: string): Record<string, string | number> {
  const def = COMPONENT_REGISTRY[name];
  if (!def) return {};
  return Object.fromEntries(def.slots.map((s) => [s.key, s.default]));
}

/** Render a registry component's inner HTML (the `.eu-*` markup) from a node's fields + variant. */
export function renderComponent(name: string, fields: Record<string, string | number> | undefined, variant: string | undefined): string {
  const def = COMPONENT_REGISTRY[name];
  if (!def) return "";
  const merged = { ...defaultComponentFields(name), ...(fields ?? {}) };
  return def.render(merged, variant ?? "");
}
