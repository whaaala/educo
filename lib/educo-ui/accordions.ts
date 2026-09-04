/**
 * The catalogue of Educo UI accordion DESIGNS, grouped by family. Single source of truth shared by the
 * builder inspector (design picker for a placed accordion) and the /website/educo-blocks gallery, so the
 * two never drift. Each `id` is the variant class suffix ("" = the default "Boxed" look, "--panel", …); the
 * CSS for every id lives in `lib/educo-ui/components.ts` under `.eu-accordion<id>`.
 */

export type AccordionDesign = { id: string; label: string };
export type AccordionDesignGroup = { group: string; items: AccordionDesign[] };

export const ACCORDION_DESIGNS: AccordionDesignGroup[] = [
  { group: "Signature — distinct designs", items: [
    { id: "--horizontal", label: "Horizontal" }, { id: "--panel", label: "Solid panel" }, { id: "--index", label: "Index tile" },
    { id: "--bignum", label: "Big number" }, { id: "--ring", label: "Ring step" }, { id: "--bubble", label: "Chat bubble" },
    { id: "--qa", label: "Q & A" }, { id: "--callout", label: "Callout" }, { id: "--float", label: "Float" },
    { id: "--folder", label: "Folder tabs" }, { id: "--news", label: "Editorial" }, { id: "--menu", label: "Menu pills" },
    { id: "--enclosed", label: "Enclosed card" }, { id: "--invert", label: "Dark glossy" }, { id: "--grid", label: "Two-column" },
    { id: "--quote", label: "Quote" }, { id: "--glass", label: "Glass" }, { id: "--timeline", label: "Timeline" },
    { id: "--alt", label: "Alternating" }, { id: "--stripe", label: "Colour stripe" }, { id: "--spotlight", label: "Spotlight" },
    { id: "--corner", label: "Folded corner" }, { id: "--split", label: "Split (media panel)" },
  ] },
  { group: "Indicator", items: [
    { id: "--chevron", label: "Chevron" }, { id: "--arrow", label: "Arrow" }, { id: "--plus-circle", label: "Plus-circle" },
    { id: "--tag", label: "Tag dot" }, { id: "--switch", label: "Switch" }, { id: "--left", label: "Left-aligned" },
  ] },
  { group: "Shape & border", items: [
    { id: "", label: "Boxed" }, { id: "--flush", label: "Flush" }, { id: "--separated", label: "Separated" },
    { id: "--pill", label: "Pill" }, { id: "--square", label: "Square" }, { id: "--divided", label: "Divided" },
    { id: "--outline", label: "Outline" }, { id: "--elevated", label: "Elevated" }, { id: "--dashed", label: "Dashed" },
  ] },
  { group: "Open-state colour", items: [
    { id: "--filled", label: "Filled" }, { id: "--accent", label: "Accent" }, { id: "--brand-header", label: "Brand header" },
    { id: "--body-tint", label: "Body tint" }, { id: "--gradient", label: "Gradient (open)" }, { id: "--gradient-full", label: "Gradient bars" },
  ] },
  { group: "Numbered", items: [
    { id: "--numbered", label: "Numbered" }, { id: "--stepper", label: "Stepper" },
  ] },
  { group: "Quiet & minimal", items: [
    { id: "--ghost", label: "Ghost" }, { id: "--line", label: "Line" }, { id: "--minimal", label: "Minimal" },
    { id: "--underline", label: "Underline" }, { id: "--soft", label: "Soft" },
  ] },
  { group: "Density & rhythm", items: [
    { id: "--large", label: "Large" }, { id: "--compact", label: "Compact" }, { id: "--zebra", label: "Zebra" }, { id: "--rail", label: "Rail" },
  ] },
];

/** Total number of accordion designs on offer. */
export const ACCORDION_DESIGN_COUNT = ACCORDION_DESIGNS.reduce((n, g) => n + g.items.length, 0);
