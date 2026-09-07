/**
 * Unified box model for the website builder (Framer/Webflow/Wix-style).
 *
 * Everything on the page is a **BoxNode** in a tree:
 *  - a **container** lays out its children with flexbox (row/column, gap, align, justify, wrap)
 *  - an **element** is a leaf (text, heading, button, image).
 *
 * Because layout is pure flow (flex), boxes can NEVER overlap and reflow responsively by design —
 * the two rules the product cares about. All tree operations here are pure/immutable so they are
 * trivially testable and safe to use with React state + undo.
 */

import type { CSSProperties } from "react";
import { isRegistryComponent, defaultComponentFields, defaultComponentWidth, componentIsColumn } from "@/lib/educo-ui/registry";
import { iconSvg } from "@/lib/educo-ui/icon-svg";
import { BREAKPOINTS_EM } from "@/lib/educo-ui/base";
import { hasItemEffects, itemEffectsCss } from "@/lib/interactions";
import { PAGE_Z, clampPageZ } from "@/lib/educo-ui/stacking";

export type BoxType = "container" | "text" | "heading" | "button" | "image" | "video" | "icon" | "divider" | "list" | "embed" | "spacer" | "component";

/** One row of an accordion component (title + body, plus optional media thumbnail / right-aligned meta). */
/** Point-and-click styling for one PART (the header, or the content/body) of a single accordion item. */
/** Four optional sides, in rem — used for an item's padding and margin (RULE P). */
export type Side4 = { t?: number; r?: number; b?: number; l?: number };

/** The CSS for one Side4, or "" when nothing is set. `prop` is "padding" or "margin". */
export function side4Css(prop: "padding" | "margin", s?: Side4): string {
  if (!s) return "";
  const sides: [keyof Side4, string][] = [["t", "top"], ["r", "right"], ["b", "bottom"], ["l", "left"]];
  return sides
    .filter(([k]) => s[k] != null)
    .map(([k, name]) => `${prop}-${name}:${s[k]}rem !important;`)
    .join("");
}

export interface AccPartStyle {
  color?: string;        // text colour
  background?: string;   // background colour
  fontFamily?: string;   // CSS font stack (from the font library)
  fontSize?: string;     // rem string, e.g. "1.8rem" (scales with base size; legacy "18px" still honoured)
  align?: "left" | "center" | "right"; // horizontal alignment within the header / content area
  pos?: { x: number; y: number };      // free nudge (rem) of the content up/down/left/right within its area
  // RULE A — a capability built for one part is the baseline for every part. These arrived for action buttons
  // and apply to titles, bodies and metas too, because there is no reason a heading should be less styleable
  // than a button sitting beneath it.
  fontWeight?: number;                 // 100–900
  letterSpacing?: string;              // rem/em string
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  radius?: string;                     // corner rounding, rem string ("999rem" for a pill)
  padding?: string;                    // shorthand, e.g. "0.6rem 1.2rem"
  border?: string;                     // shorthand, e.g. "1px solid #888"
}

/**
 * A button or link on a message. The galleries we studied are full of these — cookie consent (Manage /
 * Accept), a promo bar with a code, "Update information", "Learn more →", "Try again / Dismiss" — and the
 * Alert had no way to carry one at all, which was the single biggest gap in the component.
 *
 * `kind` is the emphasis, not the colour: the severity still supplies the colour, so an action inherits the
 * meaning of the message it sits on.
 */
export interface ItemAction {
  id: string;
  label: string;
  href?: string;        // external URL, "#anchor", or "page:<id>" — same vocabulary as a button block
  newTab?: boolean;
  kind?: "primary" | "secondary" | "link"; // filled · outlined · plain text with an arrow
  /** Point-and-click styling — colour, background, font, weight, size, shape, padding, border. */
  style?: AccPartStyle;
  /** Anything the controls do not cover, as sanitised declarations. */
  css?: string;
}

export interface ComponentItem {
  id: string;
  title: string;
  body: string;
  meta?: string;    // right-aligned price / count / badge
  icon?: string;    // leading icon (name from the icon library) shown before the title
  iconColor?: string; // icon colour (overrides the default brand tint)
  iconSize?: string;  // icon size, rem string e.g. "1.4rem"
  iconAlign?: "start" | "center" | "end"; // vertical alignment of the icon within the header row
  iconDx?: number;    // free-move icon horizontally (rem)
  iconDy?: number;    // free-move icon vertically (rem)
  media?: string;   // leading thumbnail (URL / data URL)
  mediaAlt?: string; // alt text for the image (a11y/SEO); empty = decorative (alt="")
  open?: boolean;   // open by default
  anchor?: string;  // per-item link slug → exported as id on the <details> so #slug scrolls to + opens this item
  category?: string; // optional category — a heading is shown before the first item of each category group
  num?: string;     // custom leading number / badge (overrides the auto-counter in numbered/big-number/step designs)
  float?: { x: number; y: number; z?: number }; // detached & positioned freely (rem offsets in the accordion box; z = layer)
  group?: string;   // items sharing a group id move together when dragged; individual items move on their own
  children?: ComponentItem[]; // nested sub-accordion inside this item's body (one level of nesting)
  // RULE P — the space around and inside an item, four sides each, in rem. Applies to every component's
  // items (and to a single-message component's one message), so spacing is never a CSS-box-only job.
  pad?: Side4;      // padding INSIDE the item — space between its edge and its text
  margin?: Side4;   // margin OUTSIDE the item — space between it and its neighbours
  /** Buttons or links on this message. Carbon limits a TOAST to one; a banner or inline may carry two. */
  actions?: ItemAction[];
  // ── Interactions, per ITEM (RULE A) ──
  // Hover and entrance shipped for every BLOCK. An accordion row or an alert message could carry neither, so
  // five announcements had to react and arrive as one lump. Same named effects, same emitters — see
  // lib/interactions.ts — so an item's Lift is the block's Lift.
  /** Named hover/focus effect from HOVER_EFFECTS. */
  hoverEffect?: string;
  /** Named entrance effect from REVEAL_EFFECTS — how this one item arrives. */
  revealEffect?: string;
  /** Play this item's entrance when it scrolls into view, rather than on load. */
  revealScroll?: boolean;
  css?: string;     // per-ITEM Advanced CSS declarations (sanitised) — override this one item's styling
  // Dedicated per-item styling for the header + content, set via the Inspector's colour/font controls
  // (no CSS typing). Composed into scoped, !important rules so they win over the chosen design variant.
  headerStyle?: AccPartStyle;
  bodyStyle?: AccPartStyle;
}

export type FlexDir = "row" | "column";
export type FlexAlign = "start" | "center" | "end" | "stretch";
export type FlexJustify = "start" | "center" | "end" | "between" | "around";

/**
 * The shape of a band's top or bottom edge.
 *
 * `slope` cuts a straight diagonal, `curve` an arc. Each has a direction: a slope falls to the right or to the
 * left, a curve bulges outward or is scooped inward. Five values rather than a shape plus three modifiers,
 * because a person picks a picture, not a set of parameters — and the gallery can then show five pictures.
 */
export type BandEdge = "slope-right" | "slope-left" | "curve-out" | "curve-in";

/**
 * The rungs a block can be styled at (Phase 2).
 *
 * `base` IS the desktop rung — it is the node's own properties, which is what every saved page already means
 * by them. Renaming it would migrate every stored site for no gain, so it keeps the name it has and this
 * comment carries the fact.
 *
 * WHY THIS GREW. The builder's preview already offered five widths — Mobile, Tablet, Laptop, Desktop, Wide —
 * while the model held three layers, and the mapping collapsed Laptop, Desktop AND Wide onto `base`. So a
 * teacher who switched to Wide, saw something they wanted to fix and adjusted it was silently editing the
 * layer that drives every screen from 900px up, including the Desktop view they had just tuned. Nothing said
 * so. That is the same defect as the dead container queries and the inert z-index: a control that appears to
 * do one thing and does another.
 */
export type Breakpoint = "base" | "phone" | "tabletPortrait" | "tabletLandscape" | "wide";

/** A slot that can hold overrides — every rung except the base, which lives on the node itself. */
export type OverrideRung = Exclude<Breakpoint, "base">;

/**
 * The two slots the three-layer model used. They are still READ, so no saved page changes appearance and no
 * migration runs: `tablet` covered both tablet orientations (it was the only tablet layer there was) and
 * `mobile` was the phone. New edits write the new names, and a new name wins where both exist.
 */
export type LegacyRung = "tablet" | "mobile";

/** Where a rung's overrides are stored, oldest slot first so a newer one wins on merge. */
const RUNG_SLOTS: Record<OverrideRung, (OverrideRung | LegacyRung)[]> = {
  wide: ["wide"],
  tabletLandscape: ["tablet", "tabletLandscape"],
  tabletPortrait: ["tabletPortrait"],
  phone: ["mobile", "phone"],
};

/**
 * What a rung inherits, in the order the overrides apply.
 *
 * The cascade runs from the base OUTWARDS, narrower screens inheriting each other the way they always have —
 * a phone still starts from the tablet look. `wide` is its own branch off the base: a big desktop is not a
 * narrowed anything, and making it inherit the tablet chain would have been backwards.
 */
const RUNG_CASCADE: Record<Breakpoint, (OverrideRung | LegacyRung)[]> = {
  base: [],
  wide: ["wide"],
  tabletLandscape: ["tablet", "tabletLandscape"],
  tabletPortrait: ["tablet", "tabletLandscape", "tabletPortrait"],
  phone: ["tablet", "tabletLandscape", "tabletPortrait", "mobile", "phone"],
};

/** The rungs in ladder order, narrowest first — the order a mobile-first stylesheet emits them. */
export const BP_ORDER: Breakpoint[] = ["phone", "tabletPortrait", "tabletLandscape", "base", "wide"];

/** A per-breakpoint style/geometry override — a shallow patch of style props (never structure/children). */
export type ResponsiveOverride = Partial<Omit<BoxNode, "id" | "type" | "children" | "responsive">>;

/** Every stored override slot, new names and the two legacy ones. */
export type ResponsiveMap = Partial<Record<OverrideRung | LegacyRung, ResponsiveOverride>>;

export interface BoxNode {
  id: string;
  type: BoxType;

  // ── container layout (ignored on elements) ──
  layout?: "flex" | "grid"; // layout engine for children (default flex)
  direction?: FlexDir;      // flex-direction (default column) — flex only
  gap?: number;             // px between children (both engines)
  // Space ACROSS and DOWN, separately. One number cannot express the commonest grid of all — cards that want
  // room between the columns and less between the rows — and a person who wants that has no way to say it.
  // Each falls back to `gap`, so a row that never touches these behaves exactly as it always has.
  gapX?: number;            // px between COLUMNS (falls back to `gap`)
  gapY?: number;            // px between ROWS (falls back to `gap`)
  align?: FlexAlign;        // align-items (cross axis)
  alignSelf?: "flex-start" | "flex-end" | "center" | "stretch"; // this box's OWN cross-axis alignment (overrides parent align) — set by edge-anchored resize to pin the far edge
  justify?: FlexJustify;    // justify-content (main axis) — flex only
  wrap?: boolean;           // flex-wrap — flex only
  columns?: number;         // grid: number of equal columns
  padding?: number;         // px inner padding (all sides)
  paddingTop?: number; paddingRight?: number; paddingBottom?: number; paddingLeft?: number; // per-side overrides
  margin?: number;          // px outer margin (all sides)
  marginTop?: number; marginRight?: number; marginBottom?: number; marginLeft?: number;     // per-side overrides
  radius?: number;          // px corner radius (all corners)
  radiusTopLeft?: number; radiusTopRight?: number; radiusBottomRight?: number; radiusBottomLeft?: number; // per-corner overrides
  opacity?: number;         // 0–100 (%), default 100 (fully opaque)
  rotate?: number;          // rotation in degrees (visual only; doesn't affect flow)
  // ── border + shadow ──
  borderWidth?: number;     // px; 0/undefined = no border
  borderColor?: string;     // hex/gradient token (solid colour used for the border)
  borderStyle?: "solid" | "dashed" | "dotted";
  shadow?: "sm" | "md" | "lg" | "xl"; // preset drop shadow (undefined = none)
  // ── background (layered: base fill → image → overlay, content renders on top) ──
  background?: string;      // base fill: colour hex or "gradient:#a:#b"
  bgImage?: string;         // background image: a data/http URL, OR a raw CSS gradient/pattern value (see isCssBg)
  bgSize?: string;          // background-size for a photo: "cover" | "contain" | "auto" | "100% 100%" | any CSS
  bgPosition?: string;      // background-position: "center" | "top" | "left top" | "50% 20%" | any CSS
  bgRepeat?: string;        // background-repeat: "no-repeat" | "repeat" | "repeat-x" | "repeat-y" | "space" | "round"
  bgAttach?: "fixed";       // background-attachment: "fixed" gives a parallax-style locked background
  bgTile?: string;          // pattern tile size (background-size) — when set, the bgImage repeats instead of covering
  bgOverlay?: string;       // overlay drawn over the image (colour hex or gradient) for readability

  // ── sizing (any node) ──
  width?: string;           // "auto" | "fill" | "<n>%" | "<n>px" — flex child
  height?: string;          // "auto" | "fill" | "<n>px"
  minHeight?: number;       // px
  colSpan?: number;         // grid child: columns to span
  rowSpan?: number;         // grid child: rows to span
  // ── the twelve-column grid (Phase 2) ──
  // Where a block SITS in its row. `colSpan` is how many tracks it covers, `colStart` which track it begins at
  // — CSS `grid-column-start`, 1-based, which is the OFFSET control. It is deliberately an absolute start
  // rather than Bootstrap's relative margin trick: a start also gives deliberate overlap for free, and it is
  // one number a test can assert instead of a margin that depends on what came before it.
  // Every one of these lives on BoxNode, so `responsive` carries them per rung with no extra machinery — which
  // is the whole point, because "image above the text on a phone, beside it on a desktop" IS a per-rung order.
  colStart?: number;        // grid child: 1-based track to begin at (undefined = auto-place after the previous)
  // The DOWN axis, so placement is explicit on BOTH. Start-and-span on two axes is what makes the model a
  // superset of rectangular placement: anything you can sketch on graph paper, the grid can express — a card
  // straddling two rows, a photo bleeding down past its neighbours, a deliberately broken grid. Rows are
  // IMPLICIT (the grid makes as many as it needs), so there is no row count to clamp against, unlike columns.
  rowStart?: number;        // grid child: 1-based row to begin at (undefined = auto-place)
  order?: number;           // BOTH engines: sequence position, lower first (undefined = document order)
  justifySelf?: "start" | "center" | "end" | "stretch"; // grid child: its own alignment ACROSS its cell
  justifyItems?: "start" | "center" | "end" | "stretch"; // grid CONTAINER: where every block sits in its cell
  push?: "start" | "end" | "both"; // auto-margin idiom: shove just THIS one left / right / to the middle
  // WHERE THIS BLOCK SITS IN ITS PARENT, said once and read the same everywhere: nine positions, from
  // top-left to bottom-right. `placeCSS` turns the pair into whatever the parent's engine and direction
  // actually need — which is the whole point, because that mapping is what nobody should have to hold in
  // their head. It supersedes `push` (still read, so no saved page changes).
  placeX?: "start" | "center" | "end"; // across the parent
  placeY?: "start" | "center" | "end"; // down the parent
  clip?: boolean;           // allow sizing SMALLER than content (min:0) and hide overflow; default off = hug content
  baseFont?: number;        // page root only: the global base unit in px (default 10); rendered as rem so it scales with the browser font size (WCAG)
  rowBand?: boolean;        // structural ROW band: a direct child of the page root that lays its sections out side-by-side (the page is a vertical stack of these)
  // Does this band run edge to edge, or sit its content on the page's measure? "band" (the default) is what
  // every band did before this existed. "contained" keeps the background full-bleed and insets only the
  // content — a full-width colour or photo with the text still on the measure, which is most school sections.
  sectionWidth?: "band" | "contained";
  /**
   * How tall this box is, measured against the SCREEN rather than its contents — the full-screen hero, and
   * the split-screen that fills the window. Phase 2 of the Layout System.
   *
   * A FLOOR, never a cap (`min-height`): a hero whose words outgrow the screen gets taller rather than
   * hiding them, which on a phone is the difference between a headline and half a headline.
   */
  screenHeight?: "half" | "full";
  /**
   * The SHAPE of a section's top and bottom edge — straight, sloped, or curved. Phase 2 of the Layout System.
   *
   * The plan called this the clearest case of "the capability exists, only the control is missing": the model
   * could already do it through per-block Advanced CSS, which in practice means a teacher typing `clip-path`,
   * which in practice means it never happens.
   */
  edgeTop?: BandEdge;
  edgeBottom?: BandEdge;
  /** How deep the shape cuts, as a percentage of the band's height. Default 6. */
  edgeDepth?: number;

  // ── free / floating position (escape the flow: lift a section onto its OWN layer to OVERLAP others) ──
  position?: "flow" | "absolute"; // default "flow" (in the row-band stack); "absolute" = free-floating layer
  left?: number;            // absolute only: X offset as % of the positioning parent's content box (responsive)
  top?: number;             // absolute only: Y offset as % of the positioning parent's content box
  zIndex?: number;          // absolute only: stacking order among floating siblings (higher = on top)
  locked?: boolean;         // EDITOR-ONLY: freeze position + size (no drag / no resize / no nudge). Still selectable + content-editable. No effect on the exported site.
  group?: boolean;          // this container is a GROUP (created via "Group") — moves/locks as one unit; ungroup dissolves it.
  contentX?: "start" | "center" | "end"; // component only: horizontal position of the content inside the component
  contentY?: "start" | "center" | "end"; // component only: vertical position of the content inside the component

  // ── interactions (Round 1a: hover & focus) ──
  /** Named hover/focus effect from HOVER_EFFECTS — every block and component can have one. Pure CSS. */
  hoverEffect?: string;
  /** Named entrance effect from REVEAL_EFFECTS — how the block arrives. Pure CSS. */
  revealEffect?: string;
  /** Play the entrance when the block scrolls into view, rather than on load. */
  revealScroll?: boolean;
  /** Apply the entrance to this container's direct CHILDREN, each a beat later. */
  revealStagger?: boolean;

  // ── responsive ──
  hidden?: boolean;         // hide this box (per breakpoint via `responsive`, or everywhere at the base)
  responsive?: ResponsiveMap; // per-rung style overrides (see Breakpoint / RUNG_CASCADE)

  // ── element content ──
  text?: string;
  href?: string;          // button/link target: external URL, "#anchor", or "page:<id>"
  newTab?: boolean;       // open the link in a new tab
  anchor?: string;        // a named anchor on ANY box — rendered as its id so links can scroll to it
  src?: string;           // image / video URL (data URL for uploads)
  // What the image SAYS, for someone who cannot see it — and for search engines. The export hardcoded alt="",
  // which tells a screen reader the picture is decorative and to skip it, so every photo a school added was
  // silently invisible to those readers (WCAG 1.1.1). Empty is still correct for a genuinely decorative image,
  // but it must be the user's choice rather than the only possibility.
  alt?: string;
  // Load this image immediately rather than when it nears the viewport. Off by default (lazy), which is right
  // for everything below the fold; a HERO image needs it on, or the top of the page is briefly empty.
  eager?: boolean;
  // The image's INTRINSIC pixel size, measured once when it is uploaded. It is not a size control — the user
  // never sets these — it is what the file actually is, which the browser otherwise only learns once the bytes
  // have arrived. Emitted as the `width`/`height` attributes and (when the height is "auto") as an
  // `aspect-ratio`, so the box is reserved before the photo loads and the text beneath it never jumps.
  imgW?: number;
  imgH?: number;
  icon?: string;          // lucide icon name (icon element)
  html?: string;          // raw HTML/iframe (embed element)
  listItems?: string[];   // list element items
  listStyle?: "bullet" | "number"; // list element marker
  color?: string;
  fontSize?: number;
  bold?: boolean;
  textAlign?: "left" | "center" | "right";
  // ── typography (text / heading / button) ──
  fontFamily?: string;      // CSS font-family stack; falls back to the theme font
  fontWeight?: number;      // 100–900; overrides the bold boolean when set
  lineHeight?: number;      // unitless multiplier (e.g. 1.5)
  letterSpacing?: number;   // px (can be negative)
  italic?: boolean;
  underline?: boolean;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";

  // ── Educo UI design-system component instance (type === "component") ──
  // A component reads its whole look from CSS tokens (--eu-color-*, --eu-radius-*, …), so a single set of
  // per-instance `tokenOverrides` re-skins ANY component — including ones not built yet — with no extra code.
  /** Which catalogue component this TREE was built from ("card" | "quote" | "stat" | "badge" | "rating").
   *  A tree preset is structurally just a container/element, so this is what lets the inspector recognise it
   *  and offer that component's design gallery. Absent on hand-built boxes and on `component` nodes. */
  preset?: string;
  component?: string;                       // which eu-component: "accordion" | "alert"
  variant?: string;                         // design variant class suffix, e.g. "--panel" ("" = default look)
  items?: ComponentItem[];               // accordion content (component === "accordion")
  /**
   * The Accordion's look is several orthogonal axes, exactly like the Alert's (RULE T). `variant` carries the
   * DESIGN; these carry the modifiers, so "Timeline" and "Numbered" can both be true — which one exclusive
   * field made impossible. See lib/educo-ui/accordions.ts.
   */
  accIndicator?: string;
  accFrame?: string;
  accRhythm?: string;
  accOpenColour?: string;
  accNumbering?: string;
  accDensity?: string;

  accMultiOpen?: boolean;                   // accordion: allow more than one panel open at once
  accShowAll?: boolean;                      // accordion: show "Expand all / Collapse all" controls (opt-in; adds a tiny script to the export)
  accFaqSchema?: boolean;                    // accordion: emit schema.org FAQPage JSON-LD on export (SEO rich results)
  accSearch?: boolean;                       // accordion: show a live search/filter box above the items (opt-in; small script)
  accSplitMedia?: string;                    // accordion "--split" design: the beside-the-items media/visual panel image URL
  alertSeverity?: string;                    // alert: info | success | warning | danger | neutral | brand (accent + default icon + role)
  alertForm?: string;                        // alert form factor: inline | banner | callout | toast
  alertDismiss?: boolean;                     // alert: show a per-item dismiss (×) button (opt-in; adds a tiny export script)
  /**
   * The Alert's look is SEVERAL orthogonal axes, not one exclusive list. `variant` carries the DESIGN (the
   * overall look); these carry the modifiers, so "Ticket" and "Compact" can both be true — which one exclusive
   * field made impossible. See lib/educo-ui/alerts.ts for why, and RULE T for the rule it produced.
   */
  /** Where the actions sit: under the message (default) or on the right, vertically centred. */
  alertActionPlacement?: "below" | "right";
  alertShape?: string;
  alertBorder?: string;
  alertIconStyle?: string;
  alertDensity?: string;
  alertEmphasis?: string;
  alertLayout?: string;

  /** Alert TOAST form: which corner it floats in. Ignored unless `alertForm === "toast"`. */
  alertToast?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Alert: hide itself after N seconds (0/undefined = stays until dismissed). Opt-in; adds a small script. */
  alertAutoSeconds?: number;
  /** Alert: once dismissed, stay dismissed on this visitor's next visit. Opt-in; adds a small script. */
  alertPersist?: boolean;
  componentFields?: Record<string, string | number>; // registry-component content (card/quote/stat/badge/rating/…)
  contentScale?: number;                    // component: shrink the text so the content fits a box smaller than it (1 = normal, floors at MIN_CONTENT_SCALE)
  tokenOverrides?: Record<string, string>;  // CSS custom-property overrides, e.g. { "--eu-color-brand": "#5b5bd6" }
  advancedCss?: string;                     // raw CSS declarations applied to the instance (sanitized before export)

  // ── children (containers only) ──
  children?: BoxNode[];
}

let _seq = 0;
/** Unique-ish id. Timestamp keeps ids sortable; the counter guarantees uniqueness within a tick. */
export function newBoxId(): string {
  _seq = (_seq + 1) % 1_000_000;
  return `box-${Date.now().toString(36)}-${_seq.toString(36)}`;
}

export function isContainer(node: BoxNode): boolean {
  return node.type === "container";
}

/** Lifted out of the flow onto its own free-floating layer (can overlap siblings)? */
export function isFloating(node: BoxNode): boolean {
  return node.position === "absolute";
}

/**
 * Responsive Field Guide — "STACK on narrow": a floating box collapses back into normal flow (full-width,
 * content-height) on MOBILE, so it can never clip its content or exceed its parent on a phone. The one
 * exception is when the user has DELIBERATELY re-pinned it on mobile (set left/top/position in the mobile
 * override) — then we honour their explicit placement instead of auto-stacking.
 */
export function floatStacksOnMobile(node: BoxNode): boolean {
  if (!isFloating(node)) return false;
  // Every slot the PHONE rung owns, legacy included — a page pinned under the three-layer model must keep
  // its explicit placement rather than silently starting to auto-stack.
  const m = { ...(node.responsive?.mobile ?? {}), ...(node.responsive?.phone ?? {}) };
  const pinned = m.left != null || m.top != null || m.position != null || m.width != null || m.height != null;
  return !pinned;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/** A box with nothing inside — no children, no text, no image. It can shrink to ~1px. */
export function isEmptyBox(node: BoxNode): boolean {
  return (node.children?.length ?? 0) === 0 && !node.text && !node.src && node.type !== "component";
}

// ── Factories ───────────────────────────────────────────────────────────────

/**
 * A container. NO SPACE OF ANY KIND until someone asks for it.
 *
 * `gap: 16` and `padding: 24` used to be born into every container, which meant a grid's rows and columns
 * arrived with white bands between them that nobody had chosen — and, being real stored values, they showed
 * up in the controls as though they had been. Space is a decision: the builder offers it three ways (the gap
 * between blocks, inner spacing per side, outer spacing per side) and all three now start at zero.
 *
 * Saved pages are untouched: these were written INTO every node at creation, so an existing box carries its
 * own 16 and 24 and keeps them. Only newly added blocks start flush.
 */
export function createContainer(direction: FlexDir = "column", overrides: Partial<BoxNode> = {}): BoxNode {
  return {
    id: newBoxId(),
    type: "container",
    layout: "flex",
    direction,
    gap: 0,
    align: "stretch",
    justify: "start",
    wrap: direction === "row",
    padding: 0,
    width: "fill",
    children: [],
    ...overrides,
  };
}

/**
 * A grid container with `columns` equal columns. Children can span via colSpan/rowSpan.
 *
 * FULL WIDTH, NO PADDING, BY DEFAULT — of the page when it sits on the page, of its cell when it sits inside
 * one, and the same at every depth. A grid is a way of DIVIDING space, so it should start by occupying all of
 * the space it was given; the inherited 24px inset made every nested grid narrower than its parent, and a grid
 * inside a grid inside a grid quietly lost its width three times over with nothing on screen to say why.
 * Spacing at the top, right, bottom and left is then the user's decision, in Inner spacing — a choice they
 * make, rather than a default they have to find and undo.
 */
export function createGrid(columns = 3, overrides: Partial<BoxNode> = {}): BoxNode {
  return createContainer("row", { layout: "grid", columns, wrap: false, width: "100%", padding: 0, ...overrides });
}

export function createElement(type: Exclude<BoxType, "container">, overrides: Partial<BoxNode> = {}): BoxNode {
  const base: BoxNode = { id: newBoxId(), type, width: "auto" };
  switch (type) {
    case "heading": return { ...base, text: "New heading", fontSize: 32, bold: true, ...overrides };
    case "button": return { ...base, text: "Button", href: "#", ...overrides };
    case "image": return { ...base, src: "", width: "100%", height: "260px", ...overrides };
    case "video": return { ...base, src: "", width: "100%", height: "315px", ...overrides };
    case "icon": return { ...base, icon: "Star", fontSize: 32, ...overrides };
    case "divider": return { ...base, width: "fill", ...overrides };
    case "list": return { ...base, listStyle: "bullet", listItems: ["First item", "Second item", "Third item"], fontSize: 16, ...overrides };
    case "embed": return { ...base, width: "100%", height: "260px", html: "", ...overrides };
    case "spacer": return { ...base, width: "100%", height: "48px", ...overrides };
    default: return { ...base, type: "text", text: "New text — click to edit.", ...overrides };
  }
}

// ── Educo UI components ──────────────────────────────────────────────────────

/** Three starter rows for a fresh accordion. */
export function defaultAccordionItems(): ComponentItem[] {
  return [
    { id: newBoxId(), title: "What is your return policy?", body: "Answer — click to edit. Returns are accepted within 30 days of purchase.", open: true },
    { id: newBoxId(), title: "How long does shipping take?", body: "Answer — click to edit. Most orders arrive within 3–5 business days." },
    { id: newBoxId(), title: "Do you ship internationally?", body: "Answer — click to edit. Yes, we ship to most countries worldwide." },
  ];
}

/** Create an Educo UI component instance (type "component"). Component-specific defaults live here.
 *  Accordion keeps its bespoke item model; every other component draws its default content fields from the
 *  registry, so ADDING a future component needs no change here — just a registry entry + its CSS. */
export function createComponent(component: string, overrides: Partial<BoxNode> = {}): BoxNode {
  // RULE L: a newly added component sizes to its content (see defaultComponentWidth). Full/Custom stay opt-in.
  const base: BoxNode = { id: newBoxId(), type: "component", component, variant: "", width: "auto" };
  if (component === "accordion") return { ...base, items: defaultAccordionItems(), accMultiOpen: false, ...overrides };
  if (component === "alert") return { ...base, items: defaultAlertItems(), alertSeverity: "info", alertForm: "inline", alertDismiss: false, ...overrides };
  if (isRegistryComponent(component)) return { ...base, width: defaultComponentWidth(component), componentFields: defaultComponentFields(component), ...overrides };
  return { ...base, ...overrides };
}

/**
 * The user's TYPOGRAPHY (font family / weight / capitalisation / style / spacing — NOT size) as CSS declarations,
 * to inject as a HIGH-SPECIFICITY rule on a component's text so the inspector's controls actually override the
 * component's own built-in styling (e.g. a card title's bold heading font). Size is handled separately (the
 * component's text is `em`-based, so it scales from the wrapper's font-size). Only user-set props are emitted.
 */
export function componentTextCss(node: BoxNode): string {
  const d: string[] = [];
  if (node.fontFamily) d.push(`font-family:${node.fontFamily}`);
  if (node.fontWeight) d.push(`font-weight:${node.fontWeight}`);
  else if (node.bold) d.push(`font-weight:700`);
  if (node.textTransform && node.textTransform !== "none") d.push(`text-transform:${node.textTransform}`);
  if (node.italic) d.push(`font-style:italic`);
  if (node.letterSpacing != null) d.push(`letter-spacing:${node.letterSpacing}px`);
  if (node.lineHeight) d.push(`line-height:${node.lineHeight}`);
  return d.join(";");
}

/**
 * The user's BOX styling (border, corner radius, shadow, background, rotation) as CSS declarations, to inject
 * directly onto the component's OWN element (`.eu-<component>`) instead of a surrounding wrapper box — so the
 * inspector's Design controls style the component ITSELF (the card, the pill, the quote…), not a container
 * around it. Only user-set props are emitted (defaults keep the component's built-in look).
 */
/** A bgImage value that is a raw CSS gradient/pattern (linear/radial/conic…), not an image URL. */
export function isCssBg(v?: string): boolean {
  return !!v && /(^|[\s,])(repeating-)?(linear|radial|conic)-gradient\s*\(/i.test(v.trim());
}
/** The `background-image` layer for a bgImage value — gradients/patterns pass through; URLs get url("…"). */
export function bgImageLayer(v: string): string {
  const s = v.trim();
  return isCssBg(s) ? s : `url("${s.replace(/["\\]/g, "")}")`;
}

/**
 * How far a component's text may be shrunk to fit a box smaller than its natural content (RULE G).
 * Dragging past this stops — text never becomes unreadable, so a component can't be squashed into nothing.
 */
export const MIN_CONTENT_SCALE = 0.6;

/**
 * How many lines of wrapped text still read as "tidy". A component's COMFORTABLE width is the width at which
 * its content wraps to about this many lines; narrower than that, the text scales down instead of rewrapping
 * into an ever-taller column (RULE O, width half). Never narrower than the content's longest single word.
 */
export const COMFORTABLE_LINES = 2;

/** The width below which a component's text should start scaling, from its one-line and longest-word widths. */
export function comfortableWidth(maxContentPx: number, minContentPx: number): number {
  return Math.max(minContentPx, Math.ceil(maxContentPx / COMFORTABLE_LINES));
}

/** Clamp a requested content scale into the readable range. */
export function clampContentScale(scale: number): number {
  return Math.min(1, Math.max(MIN_CONTENT_SCALE, Number.isFinite(scale) ? scale : 1));
}

export function componentBoxCss(node: BoxNode): string {
  const d: string[] = [];
  // SIZE: the component element FILLS its box when the box is given a definite size (Full / Custom width, or a
  // resized height) so resizing the block actually resizes the component. When width is "auto" (Fit) it keeps
  // hugging its content. box-sizing so an added border never overflows the box.
  // INNER SPACING: padding applies to the component's OWN element (with border-box so it stays INSIDE the box —
  // the component still fills the node box exactly, so the selection edges match). Per-side falls back to `padding`.
  const pt = node.paddingTop ?? node.padding, pr = node.paddingRight ?? node.padding, pb = node.paddingBottom ?? node.padding, pl = node.paddingLeft ?? node.padding;
  const hasPad = [pt, pr, pb, pl].some((v) => v != null);
  const sized = (node.width && node.width !== "auto") || node.height || node.minHeight;
  if (node.borderWidth || sized || hasPad) d.push("box-sizing:border-box");
  if (hasPad) d.push(`padding:${u(pt ?? 0)} ${u(pr ?? 0)} ${u(pb ?? 0)} ${u(pl ?? 0)}`);
  // SHRINK-TO-FIT (RULE G): when the box has been dragged smaller than the component's natural content, the
  // text scales down to fit rather than being cropped. `em` so every inherited size inside the component
  // follows proportionally, and it stops at MIN_CONTENT_SCALE so the result is always still readable.
  if (node.contentScale != null && node.contentScale < 1) d.push(`font-size:${clampContentScale(node.contentScale)}em`);
  if (node.width && node.width !== "auto") d.push("width:100%");
  // RULE O — a resized height is a FLOOR, not a cap: `min-height`, never `height`. A hard height became a
  // cap the content could outgrow later (narrow the block and the text rewraps taller), and the extra spilled
  // out below the box — the container's bottom edge sitting ABOVE the component. As a floor the box always
  // contains its component: shrinking is still possible because the text scales to fit (contentScale).
  if (node.height || node.minHeight) d.push("height:100%");
  if (node.borderWidth) d.push(`border:${node.borderWidth}px ${node.borderStyle ?? "solid"} ${node.borderColor ?? "rgba(0,0,0,0.15)"}`);
  const br = radiusCSS(node); if (br) d.push(`border-radius:${br}`);
  if (node.shadow) d.push(`box-shadow:${SHADOW_CSS[node.shadow]}`);
  if (node.background) d.push(`background:${node.background}`);
  if (node.bgImage) {
    const size = node.bgTile ?? (node.bgSize ?? "cover");
    const pos = node.bgPosition ?? (node.bgTile ? "0 0" : "center");
    const rep = node.bgRepeat ?? (node.bgTile ? "repeat" : "no-repeat");
    d.push(`background-image:${bgImageLayer(node.bgImage)};background-size:${size};background-position:${pos};background-repeat:${rep}`);
    if (node.bgAttach) d.push(`background-attachment:${node.bgAttach}`);
  }
  if (node.rotate) d.push(`transform:rotate(${node.rotate}deg)`);
  if (node.opacity !== undefined && node.opacity !== 100) d.push(`opacity:${node.opacity / 100}`);
  // CONTENT POSITION: place the content inside the component (X = horizontal, Y = vertical) regardless of whether
  // the component stacks in a column or a row — map X/Y to the right flex axis (justify vs align) per component.
  if (node.contentX || node.contentY) {
    const flex = (v?: string) => (v === "center" ? "center" : v === "end" ? "flex-end" : "flex-start");
    const col = componentIsColumn(node.component);
    if (node.contentX) d.push(`${col ? "align-items" : "justify-content"}:${flex(node.contentX)}`);
    if (node.contentY) d.push(`${col ? "justify-content" : "align-items"}:${flex(node.contentY)}`);
  }
  return d.join(";");
}

/**
 * Insert a NEW item directly after `afterId` (or at the end when it is missing/unknown). Used by the on-canvas
 * "add item" action so a new row appears next to the one you are working on rather than at the bottom.
 * Shared by every multi-item component (RULE I).
 */
export function addItemAfter(node: BoxNode, afterId?: string): BoxNode {
  const items = [...(node.items ?? [])];
  const item: ComponentItem = { id: newBoxId(), title: "New item", body: "Click to edit." };
  const i = afterId ? items.findIndex((it) => it.id === afterId) : -1;
  if (i < 0) items.push(item); else items.splice(i + 1, 0, item);
  return { ...node, items };
}

/** Copy an item (fresh ids for it and every sub-item) and place the copy right after the original. */
export function duplicateItem(node: BoxNode, itemId: string): BoxNode {
  const items = [...(node.items ?? [])];
  const i = items.findIndex((it) => it.id === itemId);
  if (i < 0) return node;
  const freshIds = (it: ComponentItem): ComponentItem => ({
    ...it, id: newBoxId(), children: it.children?.map(freshIds),
  });
  items.splice(i + 1, 0, freshIds(items[i]));
  return { ...node, items };
}

/** Duplicate a SUB-item under its parent — sub-items are never less editable than the top level (RULE F). */
export function duplicateChildItem(node: BoxNode, parentId: string, childId: string): BoxNode {
  return mapChildren(node, parentId, (kids) => {
    const i = kids.findIndex((c) => c.id === childId);
    if (i < 0) return kids;
    const out = [...kids];
    out.splice(i + 1, 0, { ...kids[i], id: newBoxId(), children: kids[i].children?.map((c) => ({ ...c, id: newBoxId() })) });
    return out;
  });
}

/** Immutably patch one accordion item on a component node. */
export function updateItem(node: BoxNode, itemId: string, patch: Partial<ComponentItem>): BoxNode {
  return { ...node, items: (node.items ?? []).map((it) => (it.id === itemId ? { ...it, ...patch } : it)) };
}
/** Append a fresh accordion item. */
export function addItem(node: BoxNode): BoxNode {
  const item: ComponentItem = { id: newBoxId(), title: "New question", body: "Answer — click to edit." };
  return { ...node, items: [...(node.items ?? []), item] };
}
/** Remove an accordion item (keeps at least zero; UI guards the last one). */
export function removeItem(node: BoxNode, itemId: string): BoxNode {
  return { ...node, items: (node.items ?? []).filter((it) => it.id !== itemId) };
}
/** Move an accordion item one step up (-1) or down (+1). */
export function moveItem(node: BoxNode, itemId: string, dir: -1 | 1): BoxNode {
  const items = [...(node.items ?? [])];
  const i = items.findIndex((it) => it.id === itemId);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= items.length) return node;
  [items[i], items[j]] = [items[j], items[i]];
  return { ...node, items: items };
}

// ── Nested sub-item CRUD (one level): operate on a parent item's `children` array ──
function mapChildren(node: BoxNode, parentId: string, fn: (kids: ComponentItem[]) => ComponentItem[]): BoxNode {
  return { ...node, items: (node.items ?? []).map((it) => (it.id === parentId ? { ...it, children: fn(it.children ?? []) } : it)) };
}
/** Append a fresh sub-item to a parent item. */
export function addChildItem(node: BoxNode, parentId: string): BoxNode {
  return mapChildren(node, parentId, (kids) => [...kids, { id: newBoxId(), title: "Sub-question", body: "Answer — click to edit." }]);
}
/** Update one sub-item. */
export function updateChildItem(node: BoxNode, parentId: string, childId: string, patch: Partial<ComponentItem>): BoxNode {
  return mapChildren(node, parentId, (kids) => kids.map((c) => (c.id === childId ? { ...c, ...patch } : c)));
}
/** Remove one sub-item. */
export function removeChildItem(node: BoxNode, parentId: string, childId: string): BoxNode {
  return mapChildren(node, parentId, (kids) => kids.filter((c) => c.id !== childId));
}
/** Move a sub-item one step up (-1) or down (+1). */
export function moveChildItem(node: BoxNode, parentId: string, childId: string, dir: -1 | 1): BoxNode {
  return mapChildren(node, parentId, (kids) => {
    const arr = [...kids]; const i = arr.findIndex((c) => c.id === childId); const j = i + dir;
    if (i < 0 || j < 0 || j >= arr.length) return kids;
    [arr[i], arr[j]] = [arr[j], arr[i]]; return arr;
  });
}

/**
 * Sanitize a block of raw CSS DECLARATIONS (what a user types in the Advanced-CSS box) so it is safe to inline.
 * We keep only `property: value;` pairs and hard-reject anything that could break out of the declaration
 * context or fetch remotely: braces/at-rules/selectors, `</…>`, `expression()`, `javascript:` and any `url(…)`
 * that isn't a `data:` URL. Returns a normalized "prop: val; prop: val;" string (never null).
 */
/**
 * Properties whose animation forces the browser through LAYOUT on every frame.
 *
 * Animating `width`, `height`, `top` or `margin` makes the browser recompute the position of everything
 * around the element, repaint it, and only then composite — sixty times a second. `transform`, `opacity` and
 * `filter` skip layout and paint entirely and run on the compositor thread.
 *
 * This is not a matter of taste. It is what protects <b>INP</b> (Interaction to Next Paint) and <b>CLS</b>, two
 * Core Web Vitals, and it is most visible on the cheap laptops and older phones a school's audience actually
 * uses. The built-in effect catalogue only ever offers compositor-friendly properties — but it does so by
 * convention, and Advanced CSS is a free-text box, so the rule needs a gate rather than a good intention.
 */
const LAYOUT_ANIMATION_PROPS = new Set([
  "all",
  "width", "height", "min-width", "min-height", "max-width", "max-height", "inline-size", "block-size",
  "top", "right", "bottom", "left", "inset", "inset-inline", "inset-block",
  "margin", "margin-top", "margin-right", "margin-bottom", "margin-left", "margin-inline", "margin-block",
  "padding", "padding-top", "padding-right", "padding-bottom", "padding-left", "padding-inline", "padding-block",
  "border-width", "border-top-width", "border-right-width", "border-bottom-width", "border-left-width",
  "font-size", "line-height", "letter-spacing",
  "flex", "flex-basis", "flex-grow", "flex-shrink",
  "gap", "row-gap", "column-gap", "grid-template-columns", "grid-template-rows",
]);

/** Does this `transition`/`animation` value name a property that would be animated through layout? */
export function animatesLayout(property: string, value: string): boolean {
  const p = property.toLowerCase();
  if (!/^(transition|transition-property|animation|animation-name)$/.test(p)) return false;
  // Values are space- and comma-separated: "transform 0.3s, opacity .2s". Splitting on those and comparing
  // whole tokens is exact — a substring match would flag "transform" for containing "for".
  return value.toLowerCase().split(/[ ,]+/).some((tok) => LAYOUT_ANIMATION_PROPS.has(tok));
}

/**
 * A node's Advanced CSS as a style OBJECT, for the React canvas.
 *
 * The export appends these declarations to every node's own rule, so they beat the node's generated styles.
 * The canvas writes those generated styles INLINE, and an inline style beats any stylesheet rule — so the
 * canvas could not apply Advanced CSS the way the component branches do (a scoped style tag). Outside those
 * branches it did not apply it at all: typing `padding: 2rem` on a section did nothing while you edited it,
 * then appeared on the published site. Returning an object lets the canvas merge it into the same inline
 * style, last, which reproduces the export's precedence exactly.
 *
 * Custom properties keep their `--name`; standard properties are camel-cased, which is what React expects.
 */
export function advancedCssStyle(node: BoxNode): Record<string, string> {
  const out: Record<string, string> = {};
  for (const decl of sanitizeCssDeclarations(node.advancedCss).split(";")) {
    const i = decl.indexOf(":");
    if (i <= 0) continue;
    const prop = decl.slice(0, i).trim();
    const value = decl.slice(i + 1).trim();
    if (!prop || !value) continue;
    out[prop.startsWith("--") ? prop : prop.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase())] = value;
  }
  return out;
}

export function sanitizeCssDeclarations(raw?: string): string {
  if (!raw) return "";
  return raw
    .split(";")
    .map((decl) => decl.trim())
    .filter(Boolean)
    .filter((decl) => {
      if (/[{}<>]/.test(decl)) return false;                 // no selectors / at-rules / tag breakouts
      if (/@|expression\s*\(|javascript:|<\/?/i.test(decl)) return false;
      if (/url\s*\(/i.test(decl) && !/url\s*\(\s*['"]?data:/i.test(decl)) return false; // only data: urls
      const idx = decl.indexOf(":");
      if (idx <= 0) return false;                            // must be property: value
      const prop = decl.slice(0, idx).trim();
      if (!/^-{0,2}[a-zA-Z][a-zA-Z0-9-]*$/.test(prop)) return false; // a plausible CSS property / custom property
      // Refuse to animate a LAYOUT property — see LAYOUT_ANIMATION_PROPS. `transition: all` is refused too:
      // it sweeps in every layout property by definition, which is exactly the trap.
      if (animatesLayout(prop, decl.slice(idx + 1))) return false;
      return true;
    })
    .map((decl) => decl + ";")
    .join(" ");
}

/**
 * Named inner "parts" of the accordion that a user can target from a per-item OR whole-component
 * CSS override. Each value is the descendant selector suffix appended to the item/component scope.
 * Friendly aliases (title→header, content→body, root→item) match how a non-technical user thinks.
 * Adding a component's part map here is all it takes to give that component the same power.
 */
export const ACCORDION_CSS_PARTS: Record<string, string> = {
  item: "",                                 // the whole item (or, at component scope, the accordion box)
  root: "",
  header: " .eu-accordion__header",
  title: " .eu-accordion__header",          // the question text lives directly in the header
  summary: " .eu-accordion__header",
  body: " .eu-accordion__body",             // the answer
  content: " .eu-accordion__body",
  answer: " .eu-accordion__body",
  meta: " .eu-accordion__meta",             // the little right-aligned label (e.g. a price)
  media: " .eu-accordion__media",           // the item's image
  icon: " .eu-accordion__header::after",    // the +/− / chevron indicator
  marker: " .eu-accordion__header::after",
  number: " .eu-accordion__header::before", // the leading numeral / badge (numbered / big-number / step / ring / index designs)
  num: " .eu-accordion__header::before",
  badge: " .eu-accordion__header::before",
};

/**
 * Expand a user CSS override into fully-scoped rules so it can restyle ANY part of a component/item —
 * text, background, colour, borders, the icon, the image — not just the root element.
 *
 *   background: #fef3c7;              → applies to the item/component itself
 *   title { color: #b45309; }         → applies to that item's (or every item's) header text
 *   body  { background: #fff7ed; }    → the answer panel
 *   icon  { color: #f59e0b; }         → the +/− indicator
 *
 * SAFE: only allow-listed part names produce a selector; every declaration body still passes through
 * `sanitizeCssDeclarations` (no raw selectors, at-rules, script, or non-data: urls can break out).
 * Each declaration is marked `!important` so a user's override ALWAYS wins over the chosen design variant
 * (whose `[open] >` rules reach high specificity) — this is an explicit "change anything" field.
 * Returns a string of complete CSS rules (already including `scope{…}`), or "" when nothing is valid.
 */
export function expandScopedCss(raw: string | undefined, scope: string, parts?: Record<string, string>): string {
  if (!raw || !raw.trim()) return "";
  const rules: string[] = [];
  const loose: string[] = [];
  const blockRe = /([a-zA-Z][\w-]*)\s*\{([^{}]*)\}/g; // `part { declarations }` — no nested braces in CSS decls
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(raw)) !== null) {
    loose.push(raw.slice(last, m.index));            // text outside any block → declarations for the root
    last = blockRe.lastIndex;
    const part = m[1].toLowerCase();
    const decls = importantify(sanitizeCssDeclarations(m[2]));
    const suffix = parts && Object.prototype.hasOwnProperty.call(parts, part) ? parts[part] : undefined;
    if (decls && suffix !== undefined) rules.push(`${scope}${suffix}{${decls}}`);
  }
  loose.push(raw.slice(last));
  const looseDecls = importantify(sanitizeCssDeclarations(loose.join(" ")));
  if (looseDecls) rules.unshift(`${scope}{${looseDecls}}`);
  return rules.join("");
}

/** Append `!important` to every declaration in a sanitised "p: v; p2: v2;" string (idempotent). */
function importantify(decls: string): string {
  return decls
    .split(";")
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => (/!important$/i.test(d) ? d : `${d} !important`) + ";")
    .join(" ");
}

/** Turn a point-and-click AccPartStyle into a sanitised, !important declaration block (or "").
 *  `part` decides how "align" is applied: the header is a flexbox row (justify-content), the body is text. */
function accPartStyleDecls(s?: AccPartStyle, part?: "header" | "body"): string {
  if (!s) return "";
  const d: string[] = [];
  if (s.color) d.push(`color: ${s.color}`);
  if (s.background) d.push(`background: ${s.background}`);
  if (s.fontFamily) d.push(`font-family: ${s.fontFamily}`);
  if (s.fontSize) d.push(`font-size: ${s.fontSize}`);
  if (s.align) {
    d.push(`text-align: ${s.align}`);
    if (part === "header") d.push(`justify-content: ${s.align === "left" ? "flex-start" : s.align === "right" ? "flex-end" : "center"}`);
  }
  return importantify(sanitizeCssDeclarations(d.join("; ")));
}

/** True when an item carries ANY override (structured styling, a custom number, a float, OR raw CSS) — needs a scope class. */
export function itemHasOverride(it: ComponentItem): boolean {
  return !!it.pad || !!it.margin || !!(accPartStyleDecls(it.headerStyle, "header") || accPartStyleDecls(it.bodyStyle, "body") || it.headerStyle?.pos || it.bodyStyle?.pos || (it.num && it.num.trim()) || it.iconColor || it.iconSize || it.iconAlign || it.iconDx || it.iconDy || it.float || (it.css && it.css.trim()));
}

/**
 * Does this item need its own class in the markup?
 *
 * Styling overrides are one reason; an EFFECT is another, and it arrived later. The accordion only stamped
 * `eu-acc-i-<id>` when `itemHasOverride` was true, so an item whose only setting was a hover effect had no
 * selector for the rule to attach to — the effect would have been emitted and then matched nothing.
 */
export function itemNeedsClass(it: ComponentItem): boolean {
  return itemHasOverride(it) || hasItemEffects(it);
}

/** Is this item detached (floating) — and, for the canvas, is the current breakpoint one where floats apply? */
export function itemIsFloating(it: ComponentItem): boolean {
  return !!it.float;
}

/** Height (rem) an accordion must reserve so its floated items aren't clipped / don't overlap what follows.
 *  Approximate: the lowest floated top + a nominal item height. 0 when nothing floats. */
export function itemFloatReserveRem(items: ComponentItem[]): number {
  let max = 0;
  for (const it of items) if (it.float) max = Math.max(max, it.float.y + 6);
  return max;
}

/**
 * Render an accordion answer body as SAFE rich HTML from a tiny markdown-lite source:
 *   [text](https://url) → link · **bold** · *italic* · lines starting "- " → bullet list · blank line → paragraph.
 * HTML is escaped FIRST, so only the fixed set of tags below can ever be produced — no script/style injection.
 */
export function richBody(raw?: string): string {
  if (!raw || !raw.trim()) return "";
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const inline = (t: string) => esc(t)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, x, u) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${x}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  const out: string[] = [];
  let list: string[] = [];
  const flush = () => { if (list.length) { out.push(`<ul>${list.map((li) => `<li>${inline(li)}</li>`).join("")}</ul>`); list = []; } };
  for (const ln of raw.split(/\r?\n/)) {
    const m = ln.match(/^\s*-\s+(.*)/);
    if (m) { list.push(m[1]); continue; }
    flush();
    if (ln.trim()) out.push(`<p>${inline(ln)}</p>`);
  }
  flush();
  return out.join("");
}

/** Plain-text version of a rich body (tags stripped) — for JSON-LD / meta where markup isn't wanted. */
export function plainBody(raw?: string): string {
  return richBody(raw).replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
}

/** Quote a value for CSS `content:` safely (escape backslashes + quotes). */
function cssContentString(v: string): string {
  return `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/**
 * The per-item CSS custom properties that carry the item's ordinal to the numbered designs
 * (`--eu-n` = "1", "2"…; `--eu-n0` = "01", "02"…). The designs read these via `content: var(--eu-n0)`
 * instead of a CSS counter, so numbering is deterministic and identical in the editor AND the export
 * (CSS counters silently fail to accumulate in the editor's DOM). Returns { "--eu-n": "'1'", ... }.
 */
export function itemNumberVars(index: number): Record<string, string> {
  const n = index + 1;
  return { "--eu-n": `'${n}'`, "--eu-n0": `'${n < 10 ? `0${n}` : n}'` };
}

/**
 * The complete scoped CSS for one accordion item: the point-and-click Header/Content styling FIRST, then the
 * raw per-item CSS override (which can still target any part). `scope` is the item's selector
 * (e.g. `.eu-accordion .eu-acc-i-<id>`). Returns "" when the item has no overrides.
 */
/** How much of a detached item must always stay inside its component box, however far it is placed (rem). */
export const FLOAT_MIN_VISIBLE_REM = 8;

export function itemOverrideCss(
  scope: string,
  it: ComponentItem,
  opts?: { skipFloat?: boolean; stackOnNarrow?: boolean; component?: string },
): string {
  // RULE N — this emits an ITEM's scoped CSS for EVERY component: the structured selectors and the user-CSS
  // part vocabulary both come from the named component's maps. Defaults to the Accordion for existing callers.
  const name = opts?.component ?? "accordion";
  const P = COMPONENT_ITEM_PARTS[name] ?? COMPONENT_ITEM_PARTS.accordion;
  const cssParts = COMPONENT_PARTS[name] ?? ACCORDION_CSS_PARTS;
  const sel = (k: keyof ItemPartSelectors) => (P[k] ? `${scope}${P[k]}` : "");
  const h = accPartStyleDecls(it.headerStyle, "header");
  const b = accPartStyleDecls(it.bodyStyle, "body");
  // Free positioning of the CONTENT: the header's title moves within the header; the body (text area) moves
  // within the item. `transform: translate` keeps layout but shifts visually; the item's overflow keeps it inside.
  const hp = it.headerStyle?.pos, bp = it.bodyStyle?.pos;
  const titleSel = sel("title"), bodySel = sel("body");
  const pos = [
    hp && titleSel ? `${titleSel}{position:relative !important;transform:translate(${hp.x}rem,${hp.y}rem) !important;}` : "",
    bp && bodySel ? `${bodySel}{position:relative !important;transform:translate(${bp.x}rem,${bp.y}rem) !important;}` : "",
  ].filter(Boolean).join("");
  const numSel = sel("number");
  const num = it.num && it.num.trim() && numSel
    ? `${numSel}{content: ${cssContentString(it.num.trim())} !important;}`
    : "";
  // Per-item icon colour + size + alignment + free-move (the icon is an inline SVG using currentColor at 1em).
  const iconMove = (it.iconDx || it.iconDy) ? `transform: translate(${it.iconDx || 0}rem, ${it.iconDy || 0}rem)` : "";
  const iconAlignDecl = it.iconAlign ? `align-self: ${it.iconAlign}` : "";
  const iconDecls = importantify(sanitizeCssDeclarations([
    it.iconColor ? `color: ${it.iconColor}` : "",
    it.iconSize ? `font-size: ${it.iconSize}` : "",
    iconAlignDecl, iconMove,
  ].filter(Boolean).join("; ")));
  const iconSel = sel("icon");
  const iconRule = iconDecls && iconSel ? `${iconSel}{${iconDecls}}` : "";
  // Float: detach the item and place it at (x,y) rem. On mobile (export) it returns to the normal stack.
  let float = "";
  if (it.float && !opts?.skipFloat) {
    const { x, y, z } = it.float;
    // Two things keep a detached item INSIDE its component box (RULE H, at item level):
    //  • `container-type:normal` — components set `container-type:inline-size` for their container queries,
    //    which makes an element's width independent of its contents. On an absolutely-positioned item that
    //    collapsed it to a narrow column of one-word-per-line text that then spilled out of the box.
    //  • `max-width: calc(100% - Xrem)` — the item can never be wider than the room left to the right of
    //    where it was placed, so it cannot overhang the component's edge.
    // `left` is CLAMPED IN CSS so a placement can never put the item outside the box, whatever X is stored (a
    // typed-in or older value can exceed the box's width, and `calc(100% - X)` would then go negative and
    // collapse the item to nothing). `min()` keeps at least FLOAT_MIN_VISIBLE_REM of the item on screen, and
    // max-width fills exactly the room left beside it — pure CSS, so the export needs no JavaScript.
    const leftCss = `min(${x}rem, calc(100% - ${FLOAT_MIN_VISIBLE_REM}rem))`;
    const decls = `position:absolute !important;left:${leftCss} !important;top:${y}rem !important;${z != null ? `z-index:${Math.round(z)} !important;` : ""}margin:0 !important;width:auto !important;max-width:calc(100% - ${leftCss}) !important;container-type:normal !important;`;
    // MOBILE-FIRST (field guide, ingredient ④): the normal stack is the BASE and free placement is ADDED from
    // the `sm` rung upward, in `em` so a reader who has raised their browser font keeps the stacked layout for
    // longer. The previous form was the opposite — a desktop base undone by `@media (max-width:480px)`, which is
    // desktop-first, in px, and on a width that is not even on the ladder.
    float = opts?.stackOnNarrow
      ? `@media (min-width:${BREAKPOINTS_EM.tabletPortrait}em){${scope}{${decls}}}`
      : `${scope}{${decls}}`;
  }
  const headerSel = sel("header") || titleSel;
  // RULE P — the item's own spacing, four sides each. Emitted on the item scope so it applies whatever the
  // component is, and marked !important like the rest so it beats the chosen design's defaults.
  const spacing = side4Css("padding", it.pad) + side4Css("margin", it.margin);
  const spacingRule = spacing ? `${scope}{${spacing}}` : "";
  const structured = [
    spacingRule,
    num,
    iconRule,
    h && headerSel ? `${headerSel}{${h}}` : "",
    b && bodySel ? `${bodySel}{${b}}` : "",
    pos,
    float,
  ].filter(Boolean).join("");
  const raw = expandScopedCss(it.css, scope, cssParts);
  return [structured, raw].filter(Boolean).join("");
}

// ── Alert component (multi-item, mirrors the Accordion — reuses items + the item helpers) ──────────────
/** Per-item "More CSS" part targets for the ALERT (title/body/icon/meta/media → the alert's own class names). */
/**
 * ON-CANVAS ITEM CRUD (RULE I) — shared by EVERY component, the ones we have and every future one.
 *
 * A component's item markup opts in by stamping two things while the canvas is in edit mode:
 *   • `data-eu-item="<id>"` on each item's root element (plus `data-eu-parent` for a nested sub-item), and
 *   • `data-eu-part="title|body|meta"` + `contenteditable` on each editable text part.
 * The canvas then handles select / edit / add / duplicate / delete / reorder generically off those attributes,
 * so a new component gets full item CRUD on the page just by emitting them — nothing per-component to write.
 * Both attributes are EDITOR-ONLY: pass no `edit` and the exported markup is unchanged.
 */
export type ItemEditOpts = { parentId?: string };

/** `data-eu-item` (and `data-eu-parent` for a sub-item) for an item's root element — editor only. */
export function itemRootAttrs(id: string, edit?: ItemEditOpts): string {
  if (!edit) return "";
  return ` data-eu-item="${escAttr(id)}"${edit.parentId ? ` data-eu-parent="${escAttr(edit.parentId)}"` : ""}`;
}

/** `data-eu-part` + contenteditable for one editable text part of an item — editor only. */
export function itemPartAttrs(part: string, edit?: ItemEditOpts): string {
  return edit ? ` data-eu-part="${part}" contenteditable="true" spellcheck="false"` : "";
}

export const ALERT_CSS_PARTS: Record<string, string> = {
  item: "", root: "",
  title: " .eu-alert__title", heading: " .eu-alert__title",
  body: " .eu-alert__body", content: " .eu-alert__body", message: " .eu-alert__body",
  icon: " .eu-alert__icon", meta: " .eu-alert__meta", media: " .eu-alert__media",
};
/** Default icon (lucide name) per severity when the item hasn't chosen a custom one. */
export const ALERT_SEVERITY_ICON: Record<string, string> = {
  info: "Info", success: "CircleCheck", warning: "TriangleAlert", danger: "CircleX", neutral: "Bell", brand: "Megaphone",
};
function defaultAlertItems(): ComponentItem[] {
  return [{ id: newBoxId(), title: "Heads up", body: "This is an alert — say something useful here." }];
}
const ALERT_CLOSE_SVG = `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`;
/** AccPartStyle → an inline `style="…"` value for an alert part (colour/fill/font/size/align + free-move). */
export function alertPartInline(s?: AccPartStyle): string {
  if (!s) return "";
  const d: string[] = [];
  if (s.color) d.push(`color:${s.color}`);
  if (s.background) d.push(`background:${s.background}`);
  if (s.fontFamily) d.push(`font-family:${s.fontFamily}`);
  if (s.fontSize) d.push(`font-size:${s.fontSize}`);
  if (s.align) d.push(`text-align:${s.align}`);
  if (s.fontWeight) d.push(`font-weight:${s.fontWeight}`);
  if (s.letterSpacing) d.push(`letter-spacing:${s.letterSpacing}`);
  if (s.textTransform && s.textTransform !== "none") d.push(`text-transform:${s.textTransform}`);
  if (s.radius) d.push(`border-radius:${s.radius}`);
  if (s.padding) d.push(`padding:${s.padding}`);
  if (s.border) d.push(`border:${s.border}`);
  if (s.pos && (s.pos.x || s.pos.y)) d.push(`position:relative;transform:translate(${s.pos.x || 0}rem,${s.pos.y || 0}rem)`);
  return sanitizeCssDeclarations(d.join(";"));
}
/** Per-item icon inline style (colour/size/align/free-move) — same fields as the accordion icon controls. */
export function alertIconInline(it: ComponentItem): string {
  const d: string[] = [];
  if (it.iconColor) d.push(`color:${it.iconColor}`);
  if (it.iconSize) d.push(`font-size:${it.iconSize}`);
  if (it.iconAlign) d.push(`align-self:${it.iconAlign}`);
  if (it.iconDx || it.iconDy) d.push(`transform:translate(${it.iconDx || 0}rem,${it.iconDy || 0}rem)`);
  return sanitizeCssDeclarations(d.join(";"));
}
const escAttr = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/** One alert item → an `.eu-alert` row (recurses into children as nested `.eu-alert__sub` rows — Rule F). */
/**
 * The actions on a message, as real links or buttons.
 *
 * ACCESSIBILITY is the whole job here. An action with a destination is an <a> so it can be opened in a new tab,
 * copied, and read as a link; one without is a <button>, because a link that goes nowhere is a lie to a screen
 * reader. Every one is in the tab order by construction, and each label is the visible text, so nothing depends
 * on an aria- attribute that could drift from what is on screen.
 *
 * A TOAST gets at most ONE action (Carbon's rule): a floating message that auto-hides is the worst place to put
 * a decision, and two buttons in a corner toast is how people miss both.
 */
export function alertActionsHTML(actions: ItemAction[] | undefined, form: string): string {
  const list = (actions ?? []).filter((a) => a.label?.trim()).slice(0, form === "toast" ? 1 : 2);
  if (!list.length) return "";
  const one = (a: ItemAction) => {
    const kind = a.kind ?? "primary";
    const cls = `eu-alert__action eu-alert__action--${kind}`;
    const label = escAttr(a.label);
    // The controls first, then the user's own declarations — so Advanced CSS is the last word, as everywhere
    // else in the builder. Both go through the sanitiser: no selectors, no at-rules, no script.
    const inline = [alertPartInline(a.style), sanitizeCssDeclarations(a.css)].filter(Boolean).join(";");
    const styleAttr = inline ? ` style="${escAttr(inline)}"` : "";
    if (!a.href) return `<button type="button" class="${cls}"${styleAttr}>${label}</button>`;
    const tab = a.newTab ? ` target="_blank" rel="noopener noreferrer"` : "";
    return `<a class="${cls}" href="${escAttr(a.href)}"${tab}${styleAttr}>${label}</a>`;
  };
  return `<div class="eu-alert__actions">${list.map(one).join("")}</div>`;
}

function alertItemHTML(it: ComponentItem, sev: string, treat: string, dismiss: boolean, edit?: ItemEditOpts, auto = 0, persist = false, axes: string[] = [], form = "inline"): string {
  const iconName = it.icon || ALERT_SEVERITY_ICON[sev] || "Info";
  const icon = iconName ? `<span class="eu-alert__icon" aria-hidden="true"${alertIconInline(it) ? ` style="${alertIconInline(it)}"` : ""}>${iconSvg(iconName)}</span>` : "";
  const ts = alertPartInline(it.headerStyle), bs = alertPartInline(it.bodyStyle);
  // In the editor every text part is directly editable ON THE CANVAS (RULE I) — the body drops its rich markup
  // while editing so what you type is what you edit. Outside the editor these attributes are absent, so the
  // exported markup is exactly what it always was.
  const title = it.title || edit ? `<div class="eu-alert__title"${ts ? ` style="${ts}"` : ""}${itemPartAttrs("title", edit)}>${escAttr(it.title)}</div>` : "";
  const body = it.body || edit ? `<div class="eu-alert__body"${bs ? ` style="${bs}"` : ""}${itemPartAttrs("body", edit)}>${edit ? escAttr(it.body) : richBody(it.body)}</div>` : "";
  const meta = it.meta ? `<span class="eu-alert__meta"${itemPartAttrs("meta", edit)}>${escAttr(it.meta)}</span>` : "";
  // Same loading policy as every other image: the thumbnail's box is fixed in CSS so nothing shifts, but a
  // stack of messages should not fetch a picture for each one before the visitor has scrolled to them.
  const media = it.media ? `<img class="eu-alert__media" src="${escAttr(it.media)}" alt="${escAttr(it.mediaAlt ?? "")}" loading="lazy" decoding="async" />` : "";
  // Sub-items get the SAME treatment, recursively — no level is less editable than the top (RULE F/I).
  const kids = (it.children && it.children.length) ? `<div class="eu-alert__sub">${it.children.map((c) => alertItemHTML(c, sev, treat, false, edit ? { ...edit, parentId: it.id } : undefined, 0, false, axes)).join("")}</div>` : "";
  const close = dismiss ? `<button type="button" class="eu-alert__close" data-eu-dismiss aria-label="Dismiss">${ALERT_CLOSE_SVG}</button>` : "";
  // The countdown is a pure-CSS animation — no script needed to SHOW the time passing, only to act at the end.
  // It is `aria-hidden` because the remaining time is announced by nothing useful; the pause-on-hover behaviour
  // is what actually makes an auto-dismissing message usable (WCAG 2.2.1, Timing Adjustable).
  const progress = auto > 0 && !edit ? `<span class="eu-alert__progress" aria-hidden="true"></span>` : "";
  const role = sev === "danger" || sev === "warning" ? "alert" : "status";
  // design + every axis the user has set; each is its own class, so they compose instead of replacing.
  const cls = ["eu-alert", `eu-alert--${sev}`, treat ? `eu-alert${treat}` : "", ...axes.map((a) => `eu-alert${a}`), `eu-al-${it.id}`].filter(Boolean).join(" ");
  // The script's hooks are EXPORT-ONLY: an alert that auto-hides while you are editing it would be unusable,
  // and a persisted dismissal in the builder would make a block vanish with no way to bring it back.
  const behaviour = edit ? "" :
    `${auto > 0 ? ` data-eu-auto="${auto}"` : ""}${persist ? ` data-eu-persist` : ""}${auto > 0 || persist ? ` data-eu-id="${escAttr(it.id)}"` : ""}`;
  const actions = alertActionsHTML(it.actions, form);
  return `<div class="${cls}" role="${role}"${itemRootAttrs(it.id, edit)}${behaviour}>${media}${icon}<div class="eu-alert__content">${title}${body}${meta}${kids}</div>${actions}${close}${progress}</div>`;
}
export function collectAlertItemStyles(items: ComponentItem[] | undefined, out: string[], opts?: { skipFloat?: boolean; stackOnNarrow?: boolean }): void {
  for (const it of (items ?? []).slice(0, 1)) { // single message — styles for the one that renders
    // RULE N + per-part styling: the alert's items go through the SAME shared emitter as the accordion's, with
    // the alert's part map — so float/position, per-part colour/font/size, the icon rules and per-item CSS all
    // behave identically. Nested sub-items recurse, so no level is less capable than the top.
    const css = itemOverrideCss(`.eu-al-${it.id}`, it, { ...opts, component: "alert" });
    if (css) out.push(css);
    // This message's own hover / entrance. Emitted alongside the styling so both arrive in the same sheet,
    // and through the shared emitters so a message's Lift is identical to a block's Lift.
    const fx = itemEffectsCss(itemScope("alert", it.id), it);
    if (fx) out.push(fx);
    if (it.children) collectAlertItemStyles(it.children, out, opts);
  }
}
/** Render the whole Alert component to HTML (shared by the canvas AND the export — one clean node). */
export function renderAlertHTML(node: BoxNode, edit?: ItemEditOpts, opts?: { skipFloat?: boolean; stackOnNarrow?: boolean }): string {
  const sev = node.alertSeverity || "info";
  const treat = node.variant || "";
  const form = node.alertForm || "inline";
  const dismiss = !!node.alertDismiss;
  const styleOut: string[] = [];
  collectAlertItemStyles(node.items, styleOut, opts);
  const style = styleOut.length ? `<style>${styleOut.join("")}</style>` : "";
  // An Alert is a SINGLE message (see alertMessage) — only the first entry is rendered.
  const only = alertMessage(node);
  const auto = Math.max(0, Math.round(node.alertAutoSeconds ?? 0));
  // Each axis is optional; an unset one contributes nothing, so a default alert has exactly the classes it
  // had before this existed.
  const axes = [node.alertShape, node.alertBorder, node.alertIconStyle, node.alertDensity, node.alertEmphasis, node.alertLayout,
    node.alertActionPlacement === "right" ? "--actions-right" : ""]
    .filter((a): a is string => !!a);
  const items = only ? alertItemHTML(only, sev, treat, dismiss, edit, auto, !!node.alertPersist, axes, form) : "";
  // The duration is a CSS variable so the bar and the script agree on one number.
  const autoVar = auto > 0 ? ` style="--al-auto:${auto}s"` : "";
  return `${style}<div class="eu-alert-stack eu-alert-stack--${form}"${autoVar}>${items}</div>`;
}
/** The item CSS class for each component whose items paint their own surface — so a block background set on the
 *  WHOLE component can be made to show through those items. Add a component here and it inherits the behaviour. */
/**
 * The selectors the STRUCTURED per-item emitter writes to, per component. Deliberately separate from the
 * `*_CSS_PARTS` maps: those name the parts a USER can target in the per-item CSS box (where the accordion's
 * "icon" means its chevron marker), whereas these are where the point-and-click controls actually write.
 * A component with no such part simply omits the key — the rule is then skipped.
 */
export type ItemPartSelectors = { header?: string; title?: string; body?: string; icon?: string; number?: string };
export const COMPONENT_ITEM_PARTS: Record<string, ItemPartSelectors> = {
  accordion: {
    header: " .eu-accordion__header",
    title: " .eu-accordion__title",
    body: " .eu-accordion__body",
    icon: " .eu-accordion__icon",
    number: " .eu-accordion__header::before",
  },
  // The alert has no separate header row — its title IS the heading, so header and title are the same element.
  alert: {
    header: " .eu-alert__title",
    title: " .eu-alert__title",
    body: " .eu-alert__body",
    icon: " .eu-alert__icon",
  },
};

/**
 * RULE N — the per-component PART map, keyed by component name. Everything item-level and generic reads from
 * here: per-part styling, per-item CSS with part targeting, icon rules, and float/position. A NEW component
 * joins by adding its parts map here (and its item selector to COMPONENT_ITEM_SEL) — no new float code.
 */
export const COMPONENT_PARTS: Record<string, Record<string, string>> = {
  accordion: ACCORDION_CSS_PARTS,
  alert: ALERT_CSS_PARTS,
};

/**
 * Components that hold a LIST the user manages — they get item CRUD and the on-canvas item toolbar.
 *
 * The ALERT is deliberately NOT one (user decision, 2026-09-05): an alert is a single message. It still has
 * item PARTS (title / body / icon / meta) and so still appears in COMPONENT_PARTS for per-part styling, CSS
 * targeting and positioning — having parts and holding a list are different questions.
 */
export const MULTI_ITEM_COMPONENTS = new Set<string>(["accordion"]);

/** Does this component hold a LIST of items (so it gets add / duplicate / delete / reorder)? */
export function isMultiItemComponent(component?: string): boolean {
  return !!component && MULTI_ITEM_COMPONENTS.has(component);
}

/** Does this component expose editable item PARTS (per-part styling, per-item CSS, positioning)? */
export function hasItemParts(component?: string): boolean {
  return !!component && component in COMPONENT_PARTS;
}

/**
 * The single message an Alert shows. The model still stores an `items` array — shared with every other
 * item-bearing component — but only the first entry is ever rendered or edited, so an older document that
 * holds several is never silently rewritten; the extras simply stop showing.
 */
export function alertMessage(node: BoxNode): ComponentItem | null {
  return (node.items ?? [])[0] ?? null;
}

/**
 * RULE N — the positioning context a component's item box needs once ANY of its items float: it becomes the
 * offset parent and reserves height so a floated item is never clipped. Reverts on mobile, where floats return
 * to the normal stack. Shared by the canvas and the export so they cannot drift.
 */
export function itemFloatContextCss(items: ComponentItem[] | undefined, scope: string, opts?: { stackOnNarrow?: boolean }): string {
  const reserve = itemFloatReserveRem(items ?? []);
  if (reserve <= 0) return "";
  const decls = `position:relative;min-height:${reserve}rem`;
  // Mobile-first to match the float itself: no reserved space at all until placement actually applies.
  return opts?.stackOnNarrow
    ? `@media (min-width:${BREAKPOINTS_EM.tabletPortrait}em){${scope}{${decls}}}`
    : `${scope}{${decls}}`;
}

export const COMPONENT_ITEM_SEL: Record<string, string> = {
  accordion: ".eu-accordion__item",
  alert: ".eu-alert",
};

/**
 * The selector ONE item's own rules attach to.
 *
 * Written once because both renderers stamp the same per-item class, and the whole value of that is lost if
 * the canvas and the export each spell the selector themselves. A component joins by adding a line here.
 */
export const COMPONENT_ITEM_SCOPE: Record<string, (id: string) => string> = {
  accordion: (id) => `.eu-accordion .eu-acc-i-${id}`,
  alert: (id) => `.eu-al-${id}`,
};

export function itemScope(component: string | undefined, itemId: string): string {
  return component ? (COMPONENT_ITEM_SCOPE[component]?.(itemId) ?? "") : "";
}

/**
 * Every ITEM effect in a tree, as one stylesheet — what the canvas injects.
 *
 * The export emits these alongside each component's other item rules; the canvas has one sheet for the whole
 * page, so it needs a walker. Both call `itemEffectsCss` at `itemScope`, so an item's hover is identical in
 * the builder and on the published page.
 */
export function treeItemEffectsCss(node: BoxNode): string {
  const self = (node.items ?? [])
    .map((it) => {
      const scope = itemScope(node.component, it.id);
      return scope ? itemEffectsCss(scope, it) : "";
    })
    .join("");
  const kids = (node.children ?? []).map(treeItemEffectsCss).join("");
  return self + kids;
}
/** REUSABLE (all components + future ones): when the user gives a component a block background (gradient/pattern/
 *  photo/colour), let it SHOW by making its items' own surface transparent so the component background is visible
 *  behind the (still-styled) text. `itemSel` is the node-scoped selector for the items. "" when no block bg. */
/**
 * BLOCK SIZING RULE — the edge-anchored TOP resize, clamped to the page.
 *
 * Applies to EVERY block and EVERY component, the ones we have and every future one. A block must be resizable
 * from all four sides, and it must NEVER be resized to somewhere the user can no longer see it — dragging the
 * top edge upward grows the block by going negative on margin-top, so without a floor it slides up behind the
 * toolbar and both the block's top and its resize handle become unreachable.
 *
 * All coordinates are px in ONE space (the parent's content box). Behaviour:
 *  - normal: the TOP moves to follow the pointer and the BOTTOM stays exactly where it was (edge-anchored);
 *  - at the wall: once the top reaches `topFloorPx` (the page canvas top) it stops there, and the rest of the
 *    drag is added to the BOTTOM instead — so the block still grows by the full distance dragged rather than
 *    going dead, which matters because a block sitting flush against the page top is the common case;
 *  - shrinking is floored at `minHpx` so a block can never be collapsed away.
 */
export function resizeTopEdge(
  startTopPx: number, startBotPx: number, dy: number, minHpx: number, topFloorPx: number,
): { top: number; height: number } {
  const wantedTop = Math.min(startBotPx - minHpx, startTopPx + dy); // where the pointer asks the top to be
  const top = Math.max(topFloorPx, wantedTop);                      // …clamped to the page
  const overshoot = Math.max(0, topFloorPx - wantedTop);            // how far past the page top it asked for
  return { top, height: Math.round(startBotPx + overshoot - top) };
}

/**
 * Does this block HUG its content ("Fit" width) rather than being given a definite width?
 * Shared by the canvas + the export so both agree on when a component sizes to its contents.
 */
export function hugsContent(node: BoxNode): boolean {
  return !node.width || node.width === "auto";
}

/**
 * REUSABLE across components (RULE G/K/R — applies to every component we have and every future one):
 * where a block's container-query context lives.
 *
 * A component element cannot query its OWN `container-type` — a query resolves against the nearest ANCESTOR
 * container. So `.eu-alert{container-type:inline-size}` plus `@container{.eu-alert{...}}` silently measured the
 * PAGE instead of the alert: at a 205px-wide alert the `max-width:22rem` rule never fired. The same defect made
 * the card's `clamp(...,4cqi,...)` padding track the VIEWPORT rather than the card. Putting the containment on
 * the block BOX fixes both at once — the component becomes a descendant of a container that is exactly its own
 * width — with no change to any component's CSS (measured: flex-wrap nowrap -> wrap, alert width unchanged).
 *
 * The exception is a block that hugs its contents. Inline-size containment makes an element's width INDEPENDENT
 * of its contents, so the two cannot coexist on one subtree — measured directly: the same text is 252px wide
 * without containment and 16px (padding only) with it. That is CSS, not something we can patch, so while a block
 * hugs, containment is off and its queries fall back to their clamp floor. That degradation is sound: a hug
 * block is by definition exactly as wide as its content, which is the case those queries exist to handle.
 * `!important` because the component stylesheet's own rule is more specific.
 */
export function blockContainmentCss(node: BoxNode, scope: string): string {
  return hugsContent(node)
    ? `${scope},${scope} *{container-type:normal !important}`
    : `${scope}{container-type:inline-size}`;
}

export function bgShowThroughCss(node: BoxNode, itemSel: string): string {
  const hasBg = !!(node.bgImage || node.background || node.bgOverlay);
  return hasBg ? `${itemSel}{background:transparent !important;border-color:transparent !important;}` : "";
}
/**
 * TOAST placement — the thing "Toast" promised and did not do.
 *
 * The form factor was selectable in the inspector and its entire implementation was `align-items:stretch` plus
 * a shadow: no corner, no floating, nothing that makes a toast a toast. (Its label even said "stacked", left
 * over from the multi-item Alert that was dropped.) A control that offers a layout and silently does not
 * produce it is the same class of defect as the dead container queries.
 *
 * CANVAS = EXPORT, exactly: the rule is `position:fixed` in both. What differs is only which element counts
 * as "the viewport", and that is arranged without changing a single declaration — the canvas gives its PAGE ROOT
 * a transform, which makes it the containing block for fixed descendants (CSS Transforms §3). So on the
 * published page the toast pins to the viewport corner, and in the builder it pins to the page-frame corner,
 * from identical CSS. Positioning it `absolute` instead would have pinned it to the alert's OWN box, since every
 * block wrapper on the canvas is `position:relative` — a toast in the corner of itself.
 */
export const TOAST_CORNERS = ["top-left", "top-right", "bottom-left", "bottom-right"] as const;
export type ToastCorner = (typeof TOAST_CORNERS)[number];

export function alertToastCss(node: BoxNode, scope: string): string {
  if (node.alertForm !== "toast") return "";
  const corner: ToastCorner = (node.alertToast as ToastCorner) ?? "bottom-right";
  const [block, inline] = corner.split("-");
  const pos = "fixed";
  // `min()` keeps a toast readable on a phone without ever reaching the opposite edge.
  return (
    `${scope}{position:${pos} !important;` +
    `inset-block-${block === "top" ? "start" : "end"}:var(--eu-space-4, 1rem) !important;` +
    `inset-block-${block === "top" ? "end" : "start"}:auto !important;` +
    `inset-inline-${inline === "left" ? "start" : "end"}:var(--eu-space-4, 1rem) !important;` +
    `inset-inline-${inline === "left" ? "end" : "start"}:auto !important;` +
    `width:min(24rem, calc(100% - var(--eu-space-8, 2rem))) !important;` +
    `z-index:${PAGE_Z.toast} !important;margin:0 !important;}`
  );
}

/**
 * The class list for an accordion: its design plus every axis the user has set. One helper for the canvas AND
 * the export — two copies of this logic is exactly how a builder stops matching the site it publishes.
 */
/**
 * The layout classes a structural band carries.
 *
 * Lives here rather than in either renderer because the canvas and the export must agree — every time a class
 * has been computed twice in this codebase, the two copies have drifted and the builder has shown something
 * the exported site did not.
 *
 * `isPageSection` is not optional decoration. `rowBand` does NOT mean "a section of the page": normalizeRowBands
 * wraps the children of EVERY content container in a band, so the four items inside a Card are bands too. Without
 * this gate the layout classes landed on internal wrappers throughout every component — a Card's image, heading,
 * body and button each came out marked as a page-wide band. Only a band whose parent is the page root is a
 * section, and only a section can be told to run edge to edge or sit on the measure.
 */
export function bandClasses(node: BoxNode, isPageSection = false): string {
  if (!node.rowBand || !isPageSection) return "";
  return node.sectionWidth === "contained" ? "eu-band eu-band--contained" : "eu-band";
}

export function accordionClasses(node: BoxNode): string {
  const axes = [node.accIndicator, node.accFrame, node.accRhythm, node.accOpenColour, node.accNumbering, node.accDensity];
  return ["eu-accordion", node.variant ? `eu-accordion${node.variant}` : "", ...axes.filter(Boolean).map((a) => `eu-accordion${a}`)]
    .filter(Boolean).join(" ");
}

/** Does this tree contain a toast? The canvas uses this to make the PAGE the containing block for it. */
export function treeHasToast(node: BoxNode): boolean {
  if (node.component === "alert" && node.alertForm === "toast") return true;
  return (node.children ?? []).some(treeHasToast);
}

/** The opt-in dismiss script for the export (guarded global; canvas doesn't need it). */
export function alertDismissScript(node: BoxNode): string {
  const auto = Math.max(0, Math.round(node.alertAutoSeconds ?? 0));
  const persist = !!node.alertPersist;
  if (!node.alertDismiss && !auto && !persist) return "";

  // ONE guarded global for every alert on the page, in the established pattern (`window.__euAlert`), so ten
  // alerts still ship one copy. Zero-JS stays the default: nothing here is emitted unless the user opted into
  // dismiss, auto-dismiss or persistence.
  //
  // Auto-dismiss PAUSES while the pointer is over the alert or focus is inside it, matching the CSS countdown —
  // a message that vanishes mid-read is the classic WCAG 2.2.1 (Timing Adjustable) failure.
  // Persistence remembers per alert id in localStorage, wrapped in try/catch because a private window or
  // blocked storage must not take the page down with it.
  return `<script>(function(){if(window.__euAlert)return;window.__euAlert=1;
var K='eu-alert-dismissed:';
function hide(a,remember){if(remember){try{localStorage.setItem(K+(a.dataset.euId||''),'1');}catch(e){}}
a.style.transition='opacity .18s,transform .18s';a.style.opacity='0';setTimeout(function(){a.remove();},180);}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-eu-dismiss]');if(!b)return;
var a=b.closest('.eu-alert');if(a)hide(a,a.hasAttribute('data-eu-persist'));});
document.querySelectorAll('.eu-alert[data-eu-persist]').forEach(function(a){
try{if(localStorage.getItem(K+(a.dataset.euId||'')))a.remove();}catch(e){}});
document.querySelectorAll('.eu-alert[data-eu-auto]').forEach(function(a){
var ms=(parseFloat(a.getAttribute('data-eu-auto'))||0)*1000;if(!ms)return;var left=ms,t=null,at=0;
function go(){at=Date.now();t=setTimeout(function(){hide(a,a.hasAttribute('data-eu-persist'));},left);}
function hold(){if(t){clearTimeout(t);t=null;left-=Date.now()-at;}}
a.addEventListener('mouseenter',hold);a.addEventListener('focusin',hold);
a.addEventListener('mouseleave',go);a.addEventListener('focusout',go);go();});
})();</script>`;
}

/** Turn a YouTube/Vimeo URL into an embeddable iframe src; null for a direct video file (use <video>). */
export function videoEmbedSrc(url?: string): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

/** A blank page root: a single column container filling the canvas. */
export function createRoot(): BoxNode {
  return createContainer("column", { padding: 0, gap: 0, width: "fill", minHeight: 600 });
}

/** Deep-clone a subtree, assigning fresh ids to every node (for duplicate). */
export function cloneBox(node: BoxNode): BoxNode {
  return { ...node, id: newBoxId(), children: node.children?.map(cloneBox) };
}

/** Insert a duplicate of `id` right after it in its parent. Returns the new tree (+ new node id). */
export function duplicateBox(root: BoxNode, id: string): BoxNode {
  const info = findParent(root, id);
  const node = findBox(root, id);
  if (!info || !node) return root;
  return insertBox(root, info.parent.id, info.index + 1, cloneBox(node));
}

// ── Pure tree operations (immutable) ─────────────────────────────────────────

/** Depth-first search for a node by id. */
export function findBox(root: BoxNode, id: string): BoxNode | null {
  if (root.id === id) return root;
  for (const c of root.children ?? []) {
    const found = findBox(c, id);
    if (found) return found;
  }
  return null;
}

/** Locate a node's parent + index within the parent's children. Returns null for the root/missing. */
export function findParent(root: BoxNode, id: string): { parent: BoxNode; index: number } | null {
  for (const [i, c] of (root.children ?? []).entries()) {
    if (c.id === id) return { parent: root, index: i };
    const deeper = findParent(c, id);
    if (deeper) return deeper;
  }
  return null;
}

/** True if `ancestorId` is `id` or contains it (guards against dropping a node into itself). */
export function isAncestor(root: BoxNode, ancestorId: string, id: string): boolean {
  const a = findBox(root, ancestorId);
  return !!a && !!findBox(a, id);
}

/** Return a new tree with `patch` merged onto the node with `id`. */
export function updateBox(root: BoxNode, id: string, patch: Partial<BoxNode>): BoxNode {
  if (root.id === id) return { ...root, ...patch };
  if (!root.children) return root;
  return { ...root, children: root.children.map((c) => updateBox(c, id, patch)) };
}

/**
 * How wide a block should be when it is dropped into a grid that never told it.
 *
 * A grid child with no span is ONE column, and one column of twelve is a 66px sliver on a 1024px page — so
 * every block added to a twelve-column row landed looking broken, and the more useful the row's shape the
 * worse it looked. The block matches the LAST cell already there, which is what "another one like those"
 * means; an empty row gives it the whole width, because a lone block that fills its row is right far more
 * often than a lone block a twelfth wide.
 */
export function newCellSpan(grid: BoxNode): number {
  const kids = grid.children ?? [];
  const last = [...kids].reverse().find((k) => k.colSpan != null);
  return last?.colSpan ?? gridColumns(grid);
}

/**
 * The blocks a click could mean, outermost first — the path from the page down to what was actually under the
 * pointer, with the scaffolding removed.
 *
 * CLICK SELECTS THE BOX, CLICK AGAIN GOES INSIDE. The canvas used to select the DEEPEST block under the
 * pointer, which sounds right and is unusable: a cell with a paragraph in it could only be selected by
 * hitting its padding, because everywhere else the paragraph was on top. So the thing that owns a page's
 * layout AND (now) the styling its contents inherit was the hardest thing on the canvas to select. Stepping
 * down one level per click is what Figma and Canva do, and it makes the outer box — the one people mean far
 * more often — the easiest to hit.
 *
 * The page ROOT and the structural ROW BANDS are left out: they are scaffolding a user never chose to create,
 * and offering them as a selection step would add a click that lands on nothing they can see.
 */
export function selectionChain(root: BoxNode, id: string): string[] {
  const path: BoxNode[] = [];
  const walk = (n: BoxNode, trail: BoxNode[]): boolean => {
    const here = [...trail, n];
    if (n.id === id) { path.push(...here); return true; }
    return (n.children ?? []).some((c) => walk(c, here));
  };
  walk(root, []);
  return path.filter((n) => n.id !== root.id && !n.rowBand).map((n) => n.id);
}

/** Insert `node` into `parentId` at `index` (clamped). No-op if the parent is missing. */
export function insertBox(root: BoxNode, parentId: string, index: number, node: BoxNode): BoxNode {
  if (root.id === parentId) {
    const children = [...(root.children ?? [])];
    const at = Math.max(0, Math.min(index, children.length));
    children.splice(at, 0, node.colSpan == null && root.layout === "grid" ? { ...node, colSpan: newCellSpan(root) } : node);
    return { ...root, children };
  }
  if (!root.children) return root;
  return { ...root, children: root.children.map((c) => insertBox(c, parentId, index, node)) };
}

/** Remove the node with `id` (cannot remove the root). */
export function removeBox(root: BoxNode, id: string): BoxNode {
  if (!root.children) return root;
  return {
    ...root,
    children: root.children.filter((c) => c.id !== id).map((c) => removeBox(c, id)),
  };
}

/** Reorder a node within its own parent by one step (dir -1 up / +1 down). */
export function moveBoxStep(root: BoxNode, id: string, dir: -1 | 1): BoxNode {
  const info = findParent(root, id);
  if (!info) return root;
  const { parent, index } = info;
  const j = index + dir;
  const kids = parent.children!;
  if (j < 0 || j >= kids.length) return root;
  const next = [...kids];
  [next[index], next[j]] = [next[j], next[index]];
  return updateBox(root, parent.id, { children: next });
}

/**
 * Move `id` to be a child of `newParentId` at `index`. Guards against dropping a node into itself
 * or a descendant (which would detach the subtree). Returns the original tree if the move is invalid.
 */
export function moveBox(root: BoxNode, id: string, newParentId: string, index: number): BoxNode {
  if (id === newParentId || isAncestor(root, id, newParentId)) return root;
  const node = findBox(root, id);
  if (!node) return root;
  const from = findParent(root, id);
  // If moving within the same parent, account for the removal shifting indices.
  let target = index;
  if (from && from.parent.id === newParentId && from.index < index) target = index - 1;
  const without = removeBox(root, id);
  return insertBox(without, newParentId, target, node);
}

/**
 * Drag-and-drop geometry: given the midpoints of a container's children along the drag axis
 * (x for a row/grid, y for a column) and the pointer position on that axis, return the slot index
 * (0..mids.length) where a dropped block should be inserted — i.e. before the first child the pointer
 * hasn't passed yet, else at the end.
 */
export function dropIndexAmong(mids: number[], pointer: number): number {
  for (let i = 0; i < mids.length; i++) if (pointer < mids[i]) return i;
  return mids.length;
}

/** A structural ROW band: a full-width horizontal container that lays its sections out side-by-side.
 *  The page is a vertical stack of these. `gap` is the spacing between sections within the row. */
export function makeRowBand(children: BoxNode[] = [], gap = 0): BoxNode {
  const r = createContainer("row", { rowBand: true, width: "fill", padding: 0, gap, wrap: false, align: "stretch", justify: "start" });
  r.children = children;
  return r;
}

/** Percentage a section's width token represents (for "how full is this row" maths). fill/auto = 100. */
export function widthPct(token?: string): number {
  if (!token || token === "fill" || token === "auto") return 100;
  const n = parseFloat(token);
  return token.endsWith("%") && !Number.isNaN(n) ? n : 100;
}

/** Scale a row band's section WIDTHS down so their shares never sum past 100% — this is how a row shrinks
 *  its sections to fit as you add more (never wrapping). Only WIDTH is scaled: the user's margins / other
 *  styling are preserved. Rows already ≤100% are returned unchanged. */
export function clampRowWidths(row: BoxNode): BoxNode {
  const kids = row.children ?? [];
  if (!kids.length) return row;
  const sum = kids.reduce((s, k) => s + widthPct(k.width), 0);
  if (sum <= 100) return row;
  const f = 100 / sum;
  return { ...row, children: kids.map((k) => ({ ...k, width: `${Math.max(3, Math.round(widthPct(k.width) * f))}%` })) };
}

/** Canonicalize a container tree RECURSIVELY: every CONTENT container (the page root, a section, a block)
 *  is a vertical STACK whose direct children are all ROW BANDS; each row band is a nowrap row of items that
 *  shrink to fit. A bare item that lands directly under a content container (e.g. dropped between rows) is
 *  wrapped in its OWN full-width row → so dragging an item down makes a NEW row. Empty rows are pruned.
 *  Widths are clamped ≤100% (shrink-to-fit). The user's MARGINS are respected (never stripped). Items keep
 *  their id. Recurses into every item so a child-of-a-child behaves exactly the same. Idempotent in shape. */
export function normalizeRowBands(node: BoxNode, gap = 0): BoxNode {
  if (!isContainer(node)) return node; // leaf — nothing to organize
  if (node.rowBand) {
    // A ROW: recurse into its items (each may itself be a content container / leaf).
    return { ...node, children: (node.children ?? []).map((c) => normalizeRowBands(c, gap)) };
  }
  // A GRID's children ARE its cells, so they are never banded.
  //
  // Wrapping them put a flex row band between the grid and every block, which meant `grid-column` — the span,
  // the offset, the per-cell alignment — landed on a node the grid could not see. The panel said "Columns
  // wide: 4", the data said 4, the class was right, and the block was one track wide: a control that appears
  // to do one thing and does nothing, exactly like the container queries that sat dead for weeks. Only a
  // browser could catch it, because every test that builds a tree by hand skips this pass.
  if (node.layout === "grid") {
    return { ...node, children: (node.children ?? []).map((c) => normalizeRowBands(c, gap)) };
  }
  if (!node.children) return node;
  // A CONTENT container: its direct children must all be row bands.
  const rows: BoxNode[] = [];
  for (const c of node.children) {
    if (isFloating(c)) { rows.push(normalizeRowBands(c, gap)); continue; } // floating: keep as a direct child, OUT of the flow (never wrapped, clamped, or pruned)
    if (c.rowBand) {
      const row = clampRowWidths(normalizeRowBands(c, gap));
      if (row.children?.length) rows.push(row); // prune empty rows
    } else {
      // Bare item → wrap in its own new row. A CONTAINER (section) fills the row; an ELEMENT/COMPONENT keeps
      // its own width so it HUGS its content (a short heading / button is exactly as wide as its content, not a
      // full-width "container" box). Width is still user-editable via Fit / Full / Custom.
      const forced = isContainer(c) ? { ...c, width: "100%" } : c;
      rows.push(makeRowBand([normalizeRowBands(forced, gap)], gap));
    }
  }
  return { ...node, children: rows };
}

/**
 * Make a container's children divide the main axis equally by setting each one's main-axis size to
 * "fill". Pass `exceptId` to leave one child at its current (e.g. just-resized) size and let the rest
 * share the remaining space — the "resize others to fill the page" action.
 */
export function fillMainAxis(root: BoxNode, parentId: string, exceptId?: string): BoxNode {
  const parent = findBox(root, parentId);
  if (!parent?.children) return root;
  const key: "width" | "height" = (parent.direction ?? "column") === "row" ? "width" : "height";
  const children = parent.children.map((c) => (c.id === exceptId ? c : { ...c, [key]: "fill" }));
  return updateBox(root, parentId, { children });
}

// ── Free / floating layers (overlap) ─────────────────────────────────────────
// A floating box is lifted OUT of the row-band flow onto its own layer, positioned absolutely inside a
// "positioning parent" (a real content container, never a structural row band) so it can sit ON TOP of
// that parent's flow content and overlap its siblings. Geometry (left/top/width/height) is measured in
// the DOM by the canvas and passed in here; these ops stay pure so they're testable + undo-safe.

/**
 * The stacking order a FLOATING block actually renders at.
 *
 * Both renderers used to read `node.zIndex ?? 1` themselves, which is two copies of one decision — the shape
 * of every canvas ≠ export bug this project has met. It is also where the clamp has to live: clamping only
 * inside "Bring to front" protects the button and nothing else, so a tree that arrived by paste, import or a
 * hand-edited store still emitted its raw number. A guard caught exactly that, with a stored 40000 reaching
 * the published stylesheet. Here, every path in is covered by construction.
 */
export function floatZIndex(node: BoxNode): number {
  return clampPageZ(node.zIndex, PAGE_Z.raised);
}

/** Highest / lowest zIndex among a parent's FLOATING children (0 when there are none). */
export function floatingZRange(parent: BoxNode | null): { min: number; max: number } {
  const zs = (parent?.children ?? []).filter(isFloating).map((c) => c.zIndex ?? 1);
  return { min: zs.length ? Math.min(...zs) : 0, max: zs.length ? Math.max(...zs) : 0 };
}

/** Lift `id` onto a free-floating layer inside `targetParentId` at (left,top) % of that parent, with the
 *  given width token (% of parent) and height floor (px). It becomes a DIRECT child of the positioning
 *  parent (above its flow content), gets a zIndex over any floating siblings, and sheds its flow-only
 *  styling (alignSelf + margins). Pure. */
/**
 * RULE M — the gap (in % of the parent) a newly placed block keeps from its parent's left and top edges, so a
 * component added to the page never sits flush on the section's border. Sections themselves are exempt — they
 * ARE the band, so they start at the edge.
 */
export const PLACEMENT_INSET_PCT = 2;

/**
 * Clamp a float's geometry to its positioning parent (RULE H — applies to EVERY block and component, the ones we
 * have and every future one). A block may never be floated to somewhere outside the page: the width is capped at
 * the parent's width, then left/top are pulled back so the whole box stays inside. Percent in, percent out.
 */
export function clampFloatGeom(left: number, top: number, width: string, minInset = 0): { left: number; top: number; width: string } {
  const w = Math.min(100, widthPct(width));
  const isPct = !width || width === "fill" || width === "auto" || width.endsWith("%");
  // RULE M — a block placed onto the page is never flush against its parent's top-left corner: it keeps a small
  // gap so it reads as sitting IN the section rather than on its border. The inset is only ever applied when
  // there is room for it (a full-width block still starts at 0), and only at placement time — dragging a float
  // afterwards can still take it right to the edge.
  const inset = Math.max(0, Math.min(minInset, 100 - w));
  return {
    left: round1(Math.max(inset, Math.min(left, 100 - w))),
    top: round1(Math.max(minInset, top)),
    // Only a percentage width can be capped against the parent; a px/rem width is left exactly as measured.
    width: isPct ? `${round1(w)}%` : width,
  };
}

export function floatBox(root: BoxNode, id: string, targetParentId: string, left: number, top: number, width: string, height: number): BoxNode {
  if (id === targetParentId || isAncestor(root, id, targetParentId)) return root;
  const tp = findBox(root, targetParentId);
  const z = clampPageZ(floatingZRange(tp).max + 1);
  // PAGE BOUNDS (RULE H — every block, every component, now and in future): floating must never put a block
  // outside its positioning parent. A full-width block measures ~100% wide (plus the +1px safety margin), so
  // floating it at any left offset used to hang it off the right of the page. Cap the width to the parent, then
  // slide the offsets back inside — the block keeps its size and simply can't be placed out of view.
  const geom = clampFloatGeom(left, top, width, PLACEMENT_INSET_PCT);
  // RULE L — a block that SIZES TO ITS CONTENT keeps doing so once it floats. Freezing it into a fixed-size card
  // (definite width + height + clip) sized to the content it had AT THE MOMENT IT FLOATED is what made editing a
  // floated text block cut the text off: the box stayed 69x25 while the new text overflowed. So a hugging block
  // floats with NO frozen width, NO clip, and its measured height as a min-height FLOOR (which floatingReserve
  // already understands) instead of a hard height — the parent still reserves the right space, and the box grows
  // with whatever you type. A block the user has explicitly sized still becomes a fixed card, so its resize
  // handles can shrink it below its content as before.
  const hugging = hugsContent(findBox(root, id) ?? { id, type: "container" } as BoxNode);
  const sizing: Partial<BoxNode> = hugging
    ? { minHeight: Math.max(8, Math.round(height)), height: undefined, clip: undefined }
    : { width: geom.width, height: remLen(Math.max(8, Math.round(height)), rootFontPx()), minHeight: undefined, clip: true };
  let next = moveBox(root, id, targetParentId, tp?.children?.length ?? 0);
  next = updateBox(next, id, {
    // A free-floating layer is a fixed-size CARD: a DEFINITE height (not a min-height floor that content can grow
    // past) so the box, its parent's reserved height, and the export all agree on exactly how tall it is. `clip`
    // lets the width AND height handles shrink it below its content.
    position: "absolute", left: geom.left, top: geom.top, zIndex: z, ...sizing,
    alignSelf: undefined, margin: undefined, marginTop: undefined, marginRight: undefined, marginBottom: undefined, marginLeft: undefined,
  });
  return next;
}

/** Return `id` to the normal flow (drop its floating position); normalizeRowBands re-docks it as a row.
 *  Undoes the float's side-effects so nothing leaks back into the flow: the auto-applied `clip` is cleared, a
 *  COMPONENT returns to full width (its compact fixed px width existed only for the floating card), and — if it
 *  was the parent's LAST floating child — the parent's reserved `minHeight` is dropped so no tall empty gap remains. */
export function unfloatBox(root: BoxNode, id: string): BoxNode {
  const node = findBox(root, id);
  const info = findParent(root, id);
  // Drop everything the float set: geometry, the auto `clip`, and the card's `minHeight` (so the box hugs its
  // content again). A COMPONENT also returns to full width (its compact fixed px width was only for the card).
  const patch: Partial<BoxNode> = { position: undefined, left: undefined, top: undefined, zIndex: undefined, clip: undefined, minHeight: undefined, height: undefined };
  if (node?.type === "component") patch.width = "100%";
  let next = updateBox(root, id, patch);
  if (info) {
    const stillFloating = (findBox(next, info.parent.id)?.children ?? []).some((c) => c.id !== id && isFloating(c));
    if (!stillFloating) next = updateBox(next, info.parent.id, { minHeight: undefined });
  }
  return next;
}

/**
 * GROUP the given boxes into ONE floating container (slide-style). The selected boxes are lifted out of the
 * flow and placed IN-FLOW inside a new `group` container that floats at `geom` (a bounding box measured by the
 * canvas). The group then moves + locks as a SINGLE unit, and because its children are in normal flow inside it
 * (not absolutely pinned) the group reflows + STACKS on narrow like everything else (Responsive Field Guide).
 * Children keep document order. Pure; `ungroupBoxes` reverses it.
 */
export function groupBoxes(root: BoxNode, ids: string[], geom: { left: number; top: number; width: string; height: number }): BoxNode {
  const set = new Set(ids);
  const ordered: string[] = [];
  const collect = (n: BoxNode) => { if (set.has(n.id) && n.id !== root.id) ordered.push(n.id); (n.children ?? []).forEach(collect); };
  collect(root); // tree/document order so the group's stack matches what the user saw
  if (ordered.length < 2) return root; // need at least two boxes to form a group
  const byId = new Map(ordered.map((id) => [id, findBox(root, id)!]));
  const kids = ordered.map((id) => ({ ...byId.get(id)!, position: undefined, left: undefined, top: undefined, zIndex: undefined, width: "100%" }));
  let next = root;
  for (const id of ordered) next = removeBox(next, id); // pull each out of wherever it lives
  const z = clampPageZ(floatingZRange(next).max + 1);
  const group = createContainer("column", {
    group: true, position: "absolute", left: geom.left, top: geom.top,
    width: geom.width, height: remLen(Math.max(8, Math.round(geom.height)), rootFontPx()),
    zIndex: z, gap: 12, padding: 0, align: "stretch", wrap: false, children: kids,
  } as Partial<BoxNode>);
  return insertBox(next, next.id, next.children?.length ?? 0, group); // the group floats at the page root
}

/** UNGROUP: dissolve a `group` container, returning its children to the flow of the group's parent (they
 *  stack again as normal blocks). Pure. */
export function ungroupBoxes(root: BoxNode, groupId: string): BoxNode {
  const group = findBox(root, groupId);
  const info = findParent(root, groupId);
  if (!group || !info) return root;
  const kids = (group.children ?? []).map((c) => ({ ...c, position: undefined, left: undefined, top: undefined, zIndex: undefined, width: c.width ?? "100%" }));
  const children = (info.parent.children ?? []).flatMap((c) => (c.id === groupId ? kids : [c]));
  return updateBox(root, info.parent.id, { children });
}

/** Position a block within its own container (its row band / flex parent): sets the PARENT's justify-content
 *  so the child sits at the start / center / end. Because blocks now HUG their content, this is how you
 *  left / centre / right a heading, button, badge, etc. Fluid (justify-content, no fixed px) → Field-Guide-safe. */
export function alignInRow(root: BoxNode, id: string, justify: FlexJustify): BoxNode {
  const info = findParent(root, id);
  if (!info) return root;
  return updateBox(root, info.parent.id, { justify });
}

/** The block's current position within its container (its parent row's justify-content). */
export function alignInRowOf(root: BoxNode, id: string): FlexJustify {
  return findParent(root, id)?.parent.justify ?? "start";
}

/**
 * Set whether the SECTION at `id` runs edge to edge or sits on the page's measure.
 *
 * The setting belongs to the parent band, but a band is invisible scaffolding a user can never select —
 * clicking one selects the section inside it. So the control lives on the section and writes to the band,
 * exactly as `alignInRow` does. Returns the tree unchanged unless the parent really is a page-level band, so
 * a section nested inside a component can never rewrite a page section by accident.
 */
export function setSectionWidth(root: BoxNode, id: string, value: "band" | "contained"): BoxNode {
  const band = pageBandOf(root, id);
  if (!band) return root;
  return updateBox(root, band.id, { sectionWidth: value === "contained" ? "contained" : undefined });
}

/** What the section at `id` is currently set to — "band" unless its page-level band says otherwise. */
export function sectionWidthOf(root: BoxNode, id: string): "band" | "contained" {
  return pageBandOf(root, id)?.sectionWidth === "contained" ? "contained" : "band";
}

/** The PAGE-LEVEL band directly holding `id`, or null. Bands exist inside components too; those are not it. */
export function pageBandOf(root: BoxNode, id: string): BoxNode | null {
  const info = findParent(root, id);
  if (!info?.parent.rowBand) return null;
  const grand = findParent(root, info.parent.id);
  return grand && grand.parent.id === root.id ? info.parent : null;
}

/** Raise a floating box above all its floating siblings. */
export function bringToFront(root: BoxNode, id: string): BoxNode {
  const info = findParent(root, id);
  if (!info) return root;
  // Clamped, because `max + 1` climbs without limit: repeated presses on a page that already had a high float
  // used to walk the value up into the EDITOR's range, and a block sitting over its own resize handles and
  // toolbar cannot be recovered with the mouse. See lib/educo-ui/stacking.ts.
  return updateBox(root, id, { zIndex: clampPageZ(floatingZRange(info.parent).max + 1) });
}

/** Lower a floating box beneath all its floating siblings. */
export function sendToBack(root: BoxNode, id: string): BoxNode {
  const info = findParent(root, id);
  if (!info) return root;
  return updateBox(root, id, { zIndex: clampPageZ(floatingZRange(info.parent).min - 1) });
}

/** Swap a floating box ONE step up/down its floating siblings' stack (presentation "bring forward" /
 *  "send backward"). Sorts the floating siblings by z, swaps the target with its neighbour, then reassigns
 *  clean sequential z (1..n) so the order never drifts. No-op at the top (forward) / bottom (backward). */
function reorderFloat(root: BoxNode, id: string, dir: 1 | -1): BoxNode {
  const info = findParent(root, id);
  if (!info) return root;
  const order = (info.parent.children ?? []).filter(isFloating).slice().sort((a, b) => (a.zIndex ?? 1) - (b.zIndex ?? 1)).map((c) => c.id);
  const i = order.indexOf(id), j = i + dir;
  if (i < 0 || j < 0 || j >= order.length) return root;
  [order[i], order[j]] = [order[j], order[i]];
  return order.reduce((r, cid, k) => updateBox(r, cid, { zIndex: k + 1 }), root);
}

/** Raise a floating box one layer (above the next floating sibling up). */
export function bringForward(root: BoxNode, id: string): BoxNode { return reorderFloat(root, id, 1); }

/** Lower a floating box one layer (below the next floating sibling down). */
export function sendBackward(root: BoxNode, id: string): BoxNode { return reorderFloat(root, id, -1); }

// ── Responsive (per-breakpoint overrides) ────────────────────────────────────
// The tree stores BASE (desktop) values; `responsive.tablet` / `responsive.mobile` hold shallow style
// overrides that CASCADE down (mobile inherits tablet inherits base). Rendering resolves the effective
// node for the active breakpoint; editing at a breakpoint writes into that breakpoint's override so the
// base is never disturbed. Structure (children, id, type, position-mode, z) is shared across breakpoints.

/** The effective node at a rung: the base, with every slot the rung inherits merged over it in order. */
export function resolveResponsive(node: BoxNode, bp: Breakpoint): BoxNode {
  if (bp === "base" || !node.responsive) return node;
  const ov: ResponsiveOverride = {};
  for (const slot of RUNG_CASCADE[bp]) Object.assign(ov, node.responsive[slot] ?? {});
  return Object.keys(ov).length ? { ...node, ...ov } : node;
}

/** Merge `patch` into node `id` — at the BASE, or into the given rung's own slot when not base. */
export function updateBoxResponsive(root: BoxNode, id: string, patch: Partial<BoxNode>, bp: Breakpoint): BoxNode {
  if (bp === "base") return updateBox(root, id, patch);
  const node = findBox(root, id);
  if (!node) return root;
  // Always the NEW slot name: it is last in the rung's cascade, so it wins over anything the three-layer
  // model left behind without having to rewrite that older value.
  const prev = node.responsive?.[bp] ?? {};
  return updateBox(root, id, { responsive: { ...node.responsive, [bp]: { ...prev, ...patch } } });
}

/** Does this box carry any override OF ITS OWN at this rung? Inherited ones belong to the rung above. */
export function hasOverride(node: BoxNode, bp: Breakpoint): boolean {
  if (bp === "base") return false;
  return RUNG_SLOTS[bp].some((s) => Object.keys(node.responsive?.[s] ?? {}).length > 0);
}

/**
 * Drop this rung's overrides (revert the box to what it inherits here).
 *
 * It clears EVERY slot the rung owns, legacy included. Clearing only the new name would leave a page that had
 * been edited under the three-layer model looking unchanged after a "revert" — a control that does nothing,
 * which is the exact failure this whole area keeps producing.
 */
export function clearOverride(root: BoxNode, id: string, bp: Breakpoint): BoxNode {
  if (bp === "base") return root;
  const node = findBox(root, id);
  if (!node?.responsive) return root;
  const next: ResponsiveMap = { ...node.responsive };
  for (const slot of RUNG_SLOTS[bp]) delete next[slot];
  return updateBox(root, id, { responsive: Object.keys(next).length ? next : undefined });
}

// ── Decoration (border / shadow / corners / rotation) ────────────────────────

/** Preset drop shadows (elevation scale). Kept subtle + theme-neutral (soft black). */
export const SHADOW_CSS: Record<NonNullable<BoxNode["shadow"]>, string> = {
  sm: "0 1px 2px rgba(0,0,0,0.08), 0 1px 1px rgba(0,0,0,0.06)",
  md: "0 4px 8px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)",
  lg: "0 12px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)",
  xl: "0 24px 48px rgba(0,0,0,0.18), 0 8px 16px rgba(0,0,0,0.10)",
};

/** Per-corner border-radius (px) → CSS, falling back to the all-corners `radius`. Undefined when none set. */
export function radiusCSS(node: BoxNode): string | undefined {
  const r = node.radius;
  const tl = node.radiusTopLeft ?? r, tr = node.radiusTopRight ?? r, br = node.radiusBottomRight ?? r, bl = node.radiusBottomLeft ?? r;
  if (tl == null && tr == null && br == null && bl == null) return undefined;
  return `${tl ?? 0}px ${tr ?? 0}px ${br ?? 0}px ${bl ?? 0}px`;
}

/** Does this box round or clip its content (so overflow must be hidden)? */
export function isClipped(node: BoxNode): boolean {
  return !!node.clip || radiusCSS(node) != null;
}

// ── Flexbox style mapping ────────────────────────────────────────────────────

const ALIGN_CSS: Record<FlexAlign, string> = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch" };
const JUSTIFY_CSS: Record<FlexJustify, string> = {
  start: "flex-start", center: "center", end: "flex-end", between: "space-between", around: "space-around",
};

// ── Typography that CASCADES (set it on a box, everything inside follows) ────
//
// Set a font and a colour on a grid cell and every heading, paragraph, list, button and component inside it
// follows — and any one of them can still speak for itself and win. That is what CSS inheritance is for, and
// it did not work here for one reason: every block wrote its colour and family EXPLICITLY, falling back to
// the theme (`node.color || theme.textMuted`). An explicit value on the child always beats an inherited one,
// so a colour set on a cell reached nothing, and no amount of new UI would have changed that.
//
// It cannot simply be dropped, because the roles have DIFFERENT defaults — a heading is the strong colour, a
// paragraph the muted one — and a bare `inherit` would flatten them into one. So each role's default is a
// CUSTOM PROPERTY. Custom properties inherit, so a container that redefines them changes every block beneath
// it, while a block that writes a real value still wins over both. One mechanism, both behaviours.
//
// SIZE is proportional rather than absolute: the roles are multiples of one inherited base, so making a cell's
// text bigger scales its heading and its body together instead of collapsing them to the same size.
export const TYPO_VAR = {
  text: "--bx-text",
  muted: "--bx-text-muted",
  headingFont: "--bx-font-heading",
  bodyFont: "--bx-font-body",
  size: "--bx-text-size",
  headingWeight: "--bx-weight-heading",
  bodyWeight: "--bx-weight-body",
} as const;

/** A role's inherited default, as a `var()` a block can put straight in its own style. */
export const typoRole = {
  color: (role: "text" | "muted") => `var(${role === "muted" ? TYPO_VAR.muted : TYPO_VAR.text})`,
  font: (role: "heading" | "body") => `var(${role === "heading" ? TYPO_VAR.headingFont : TYPO_VAR.bodyFont})`,
  weight: (role: "heading" | "body", fallback: number) => `var(${role === "heading" ? TYPO_VAR.headingWeight : TYPO_VAR.bodyWeight}, ${fallback})`,
  /** `mult` is the role's share of the inherited text size — 2 for a heading, 1 for body, 0.875 for a button. */
  size: (mult: number) => (mult === 1 ? `var(${TYPO_VAR.size})` : `calc(var(${TYPO_VAR.size}) * ${mult})`),
} as const;

/** The role defaults a PAGE ROOT publishes, from the site theme. Everything below inherits these. */
export function typoRootVars(theme: { text: string; textMuted: string; headingFont: string; bodyFont: string }): CSSProperties {
  return {
    [TYPO_VAR.text]: theme.text,
    [TYPO_VAR.muted]: theme.textMuted,
    [TYPO_VAR.headingFont]: theme.headingFont,
    [TYPO_VAR.bodyFont]: theme.bodyFont,
    [TYPO_VAR.size]: u(16),
    [TYPO_VAR.headingWeight]: 600,
    [TYPO_VAR.bodyWeight]: 400,
  } as CSSProperties;
}

/**
 * What a CONTAINER hands down when its typography is set — the cascade, from a box to everything inside it.
 *
 * A colour or a family redefines BOTH role variables as well as its own property: both, because a cell told
 * to be green means its headings and its paragraphs, not one of them; and its own property too, so anything
 * that inherits plainly (a component's internal markup, raw text) follows as well.
 */
export function typoCascadeCss(node: BoxNode): CSSProperties {
  const s: Record<string, string | number> = {};
  if (node.color) { s[TYPO_VAR.text] = node.color; s[TYPO_VAR.muted] = node.color; s.color = node.color; }
  if (node.fontFamily) { s[TYPO_VAR.headingFont] = node.fontFamily; s[TYPO_VAR.bodyFont] = node.fontFamily; s.fontFamily = node.fontFamily; }
  if (node.fontSize != null) s[TYPO_VAR.size] = u(node.fontSize);
  if (node.fontWeight != null) { s[TYPO_VAR.headingWeight] = node.fontWeight; s[TYPO_VAR.bodyWeight] = node.fontWeight; s.fontWeight = node.fontWeight; }
  else if (node.bold) { s[TYPO_VAR.headingWeight] = 800; s[TYPO_VAR.bodyWeight] = 800; s.fontWeight = 800; }
  // These have no per-role default to preserve, so plain inheritance already carries them — they only have to
  // be emitted here and NOT hard-coded on the blocks below (which is what `textAlign: align` used to do).
  if (node.lineHeight != null) s.lineHeight = node.lineHeight;
  if (node.letterSpacing != null) s.letterSpacing = `${node.letterSpacing}px`;
  if (node.textTransform && node.textTransform !== "none") s.textTransform = node.textTransform;
  if (node.textAlign) s.textAlign = node.textAlign;
  if (node.italic) s.fontStyle = "italic";
  return s as CSSProperties;
}

// ── The twelve-column grid (Phase 2) ─────────────────────────────────────────

/**
 * Twelve, because it divides by 2, 3, 4 and 6 — every fraction a page layout actually asks for, which is why
 * every grid system since the print ones has landed on it. It is the count UNDERNEATH; what a teacher sees is
 * a named fraction (see `COLUMN_FRACTIONS`).
 */
export const GRID_MAX = 12;

/** A grid's stored track count, clamped to something a row can actually be. */
export const gridColumns = (node: BoxNode): number =>
  Math.min(GRID_MAX, Math.max(1, Math.round(node.columns ?? 3)));

/** The named fractions on top of the twelve underneath — what the inspector offers before the raw numbers. */
export const COLUMN_FRACTIONS: { label: string; num: number; den: number }[] = [
  { label: "Full", num: 1, den: 1 },
  { label: "Half", num: 1, den: 2 },
  { label: "Third", num: 1, den: 3 },
  { label: "Two-thirds", num: 2, den: 3 },
  { label: "Quarter", num: 1, den: 4 },
  { label: "Three-quarters", num: 3, den: 4 },
];

/** Which named fraction a span of `span` out of `track` IS, or null when it is not a named one. */
export function columnFractionOf(span: number, track: number): { num: number; den: number } | null {
  const f = COLUMN_FRACTIONS.find((c) => c.num * track === span * c.den);
  return f ? { num: f.num, den: f.den } : null;
}

/**
 * Has the user set this property AT this rung, or anywhere this rung inherits from?
 *
 * The resolved node cannot answer it — a value merged down from the base is indistinguishable from one typed
 * at the rung — but `responsive` survives `resolveResponsive` (it spreads the node), so the slots are still
 * readable here. Used for defaults that must yield the moment the user states an intent.
 */
function setAtRung(node: BoxNode, key: keyof ResponsiveOverride, bp: Breakpoint): boolean {
  if (bp === "base") return true; // the base IS the node's own value — always "set"
  return RUNG_CASCADE[bp].some((slot) => node.responsive?.[slot]?.[key] !== undefined);
}

/**
 * How many columns this grid actually SHOWS at a rung.
 *
 * STACK ON NARROW (Responsive Design Field Guide, ingredient ①). A twelve-column row is unreadable on a 375px
 * phone — and before this a grid kept every one of its columns at every width, so three cards stayed three
 * slivers side by side on a phone with nothing the builder could do about it. A grid the user has NOT given a
 * column count of its own at this rung therefore shows at most ONE column on a phone and TWO on a tablet held
 * upright, and `childStyle` clamps the spans to match so nothing spills into an implicit column.
 *
 * THE ESCAPE HATCH IS THE CONTROL ITSELF: set Columns while a narrow rung is selected and the override turns
 * the clamp off from that rung down — a two-up phone photo gallery is one click, and it is stated in data
 * rather than guessed at.
 */
export function gridColumnsAt(node: BoxNode, bp: Breakpoint = "base"): number {
  const cols = gridColumns(node);
  if (setAtRung(node, "columns", bp)) return cols;
  if (bp === "phone") return 1;
  if (bp === "tabletPortrait") return Math.min(cols, 2);
  return cols;
}

/**
 * A child's effective span and start at a rung, in that rung's own track units.
 *
 * The subtlety this exists for: when `gridColumnsAt` narrows a row it narrows the TRACK, but the child's span
 * is still written in the wide row's units. Simply clamping it makes every block as wide as the row — so a
 * three-card row on a tablet held upright stacked completely, which is the same as not having the rung at all
 * and made the two-column default worthless. Keeping the PROPORTION instead is what a person means: a third of
 * twelve is a third of two, which is one column, which is two cards across.
 *
 * When the USER has stated the count at this rung they are already speaking in that rung's units, so the span
 * is taken at face value and only clamped. Rescaling their number would be the builder arguing with them.
 */
export function gridPlacementAt(parent: BoxNode, child: BoxNode, bp: Breakpoint = "base"): { track: number; span: number; start: number | null } {
  const track = gridColumnsAt(parent, bp);
  const stored = gridColumns(parent);
  const rescale = track !== stored && !setAtRung(parent, "columns", bp);
  const fit = (v: number) => (rescale ? Math.max(1, Math.round((v * track) / stored)) : v);
  const span = Math.min(track, fit(Math.max(1, Math.round(child.colSpan ?? 1))));
  if (child.colStart == null) return { track, span, start: null };
  const raw = rescale
    ? Math.round(((Math.round(child.colStart) - 1) * track) / stored) + 1
    : Math.round(child.colStart);
  // Clamped to a track the block can actually FINISH inside, so it never lands in an implicit column and
  // stretches the row past the edge of the screen.
  return { track, span, start: Math.min(track - span + 1, Math.max(1, raw)) };
}

/**
 * An explicit row track list, but ONLY when some row has been given a height by hand.
 *
 * Two rules have to hold at once, and they pull against each other:
 *   • a row a user has dragged taller KEEPS that height;
 *   • every row they have NOT touched shares what is left, evenly.
 *
 * `grid-auto-rows` cannot say that — it is one value for every row, so a dragged row was levelled straight
 * back down by the `1fr` its neighbours were also claiming, and dragging a cell's edge appeared to do nothing
 * at all. Naming the tracks separates them: a sized row becomes `auto`, so its cells' own min-height decides
 * it, and every other row stays `minmax(min-content, 1fr)` — the same even share as before.
 *
 * Returns null when nothing has been sized (the uniform `grid-auto-rows` is then both correct and shorter),
 * and null when any child is placed EXPLICITLY by `rowStart`/`rowSpan` — the row a cell lands in is the
 * user's choice there, not something this walk can work out, and guessing it would move their blocks.
 */
export function gridRowTracks(node: BoxNode, bp: Breakpoint = "base"): string | null {
  const kids = node.children ?? [];
  if (!kids.length) return null;
  if (kids.some((c) => c.rowStart != null || (c.rowSpan ?? 1) > 1)) return null;
  const track = gridColumnsAt(node, bp);
  const rows: BoxNode[][] = [];
  let used = 0;
  for (const c of kids) {
    const span = gridPlacementAt(node, c, bp).span;
    if (!rows.length || used + span > track) { rows.push([]); used = 0; }
    rows[rows.length - 1].push(c);
    used += span;
  }
  // A row counts as SIZED when any cell in it carries a height of its own — which is what the vertical drag
  // writes, to every cell in the row at once, so the row grows as one piece.
  const sized = rows.map((r) => r.some((c) => c.minHeight != null || (c.height != null && c.height !== "auto")));
  if (!sized.some(Boolean)) return null;
  return sized.map((s) => (s ? "auto" : "minmax(min-content, 1fr)")).join(" ");
}

/**
 * Scale one node's grid placement (and every rung override of it) by `mul / div`. Starts scale about track 1.
 *
 * An ABSENT span is materialised on the way up, and that is the whole correctness of refining: a block with no
 * span stored is one column of whatever the row has, so a row of thirds refined to twelve leaves it meaning
 * one TWELFTH — the block silently shrinks to a quarter of the third it was. Writing the number down is what
 * makes "refining does not move anything" true rather than nearly true.
 *
 * An absent START stays absent: it means auto-place after the block before it, which lands in the same
 * relative position at any track count, so materialising it would pin something the user never pinned.
 */
function scalePlacement(node: BoxNode, mul: number, div: number): BoxNode {
  const sp = (v: number) => (v * mul) / div;
  const one = <T extends { colSpan?: number; colStart?: number }>(o: T, implicitSpan: boolean): T => {
    const next = { ...o };
    if (o.colSpan != null) next.colSpan = sp(o.colSpan);
    else if (implicitSpan && mul > div) next.colSpan = sp(1);
    if (o.colStart != null) next.colStart = sp(o.colStart - 1) + 1;
    return next;
  };
  const out = one(node, true);
  if (node.responsive) {
    const r: ResponsiveMap = { ...node.responsive };
    for (const slot of Object.keys(r) as (keyof ResponsiveMap)[]) {
      const ov = r[slot];
      // A rung slot with no span of its own INHERITS the base's, which the line above has just written down —
      // materialising it here too would freeze that rung to a value it was only ever borrowing.
      if (ov) r[slot] = one(ov, false);
    }
    out.responsive = r;
  }
  return out;
}

/** Does every stored placement on this node divide cleanly by `k`? (If not, coarsening would MOVE blocks.) */
function placementDivides(node: BoxNode, k: number): boolean {
  const ok = (o: { colSpan?: number; colStart?: number }) =>
    (o.colSpan == null || o.colSpan % k === 0) && (o.colStart == null || (o.colStart - 1) % k === 0);
  return ok(node) && Object.values(node.responsive ?? {}).every(ok);
}

/**
 * Re-cut a grid to a different number of columns WITHOUT moving anything.
 *
 * Going from three columns to twelve is not a layout change — it is the SAME layout described more finely — so
 * every child's span and start multiply by the same factor and the row stays pixel-identical. That is what
 * makes "make just this one a half" work inside a row of thirds: the row is refined to twelve first, and a
 * half is six of them.
 *
 * Coarsening (twelve back to three) is the exact inverse, and is only applied when every placement divides
 * cleanly. When it does not, the stored spans are LEFT ALONE and the render clamps them instead — so a round
 * trip restores the layout rather than quietly losing a column, which is what rewriting them would do.
 */
export function retrackGrid(node: BoxNode, columns: number): BoxNode {
  const from = gridColumns(node);
  const to = Math.min(GRID_MAX, Math.max(1, Math.round(columns)));
  if (to === from) return node;
  const kids = node.children ?? [];
  if (to % from === 0) return { ...node, columns: to, children: kids.map((c) => scalePlacement(c, to / from, 1)) };
  const k = from / to;
  if (from % to === 0 && kids.every((c) => placementDivides(c, k))) {
    return { ...node, columns: to, children: kids.map((c) => scalePlacement(c, 1, k)) };
  }
  return { ...node, columns: to };
}

/**
 * Give a grid child a named fraction of its row — the control the twelve columns exist to serve.
 *
 * A row of thirds cannot express a half, so at the BASE the row is refined to twelve first (`retrackGrid`,
 * which leaves it looking exactly as it did) and the half becomes six. That refinement changes the row's
 * CHILDREN, which a rung override cannot carry — a rung holds style, never structure — so at a rung only a
 * fraction the row can already express is written, and the inspector offers only those.
 *
 * Returns the tree unchanged when the block is not in a grid or the fraction is unreachable, so a caller can
 * commit the result unconditionally.
 */
export function setColumnFraction(root: BoxNode, id: string, num: number, den: number, bp: Breakpoint = "base"): BoxNode {
  const found = findParent(root, id);
  if (!found || found.parent.layout !== "grid") return root;
  let next = root;
  let track = gridColumns(found.parent);
  if (!canSetColumnFraction(track, den, bp)) return root;
  if (track % den !== 0) {
    next = updateBox(next, found.parent.id, retrackGrid(found.parent, GRID_MAX));
    track = GRID_MAX;
  }
  const colSpan = (track * num) / den;
  return bp === "base" ? updateBox(next, id, { colSpan }) : updateBoxResponsive(next, id, { colSpan }, bp);
}

/**
 * Can a row of `track` columns express this fraction — already, or by being refined to twelve at the base?
 *
 * Takes the COUNT rather than the row, so the inspector can ask it without holding the parent node and the
 * rule lives in exactly one place. A local copy of it in the panel is precisely how the device chips and the
 * rung ladder drifted apart before.
 */
export function canSetColumnFraction(track: number, den: number, bp: Breakpoint = "base"): boolean {
  return track % den === 0 || (bp === "base" && GRID_MAX % den === 0 && GRID_MAX % track === 0);
}

/** Convert a width/height token ("auto" | "fill" | "50%" | "200px") to a CSS length or undefined. */
export function sizeToCSS(token?: string): string | undefined {
  if (!token || token === "auto") return undefined;
  if (token === "fill") return "100%";
  return token; // already "<n>%" or "<n>px"
}

/** Does this image know what shape it really is? Both dimensions must be real pixels — an SVG with no
 *  intrinsic size reports 0 in some browsers and a made-up 300×150 in others, so 0 is the only safe reject. */
export function hasIntrinsicSize(node: BoxNode): boolean {
  return (node.imgW ?? 0) > 0 && (node.imgH ?? 0) > 0;
}

/**
 * How tall an image block is, and what shape to hold for it while it loads.
 *
 * An image has always been given a fixed height (260px unless the user typed one), because until now the
 * builder had no idea what shape the photo was — so "auto" in the Height field silently did nothing and every
 * picture was cropped to a letterbox. With the intrinsic size measured at upload, "auto" finally means
 * something: the box takes the photo's OWN shape, held open by `aspect-ratio` from the first paint, so nothing
 * below it moves when the bytes land (Cumulative Layout Shift).
 *
 * The fixed height still wins whenever one is set — cropping to a deliberate shape is a design choice, and
 * `object-fit: cover` is what makes it look right.
 */
export function imageSizing(node: BoxNode): { height: string; aspectRatio?: string } {
  const explicit = sizeToCSS(node.height);
  if (explicit) return { height: explicit };
  // No height asked for. Take the photo's own shape if we know it; otherwise fall back to the letterbox,
  // because an image of unknown shape with `height:auto` and `object-fit:cover` collapses to nothing.
  if (hasIntrinsicSize(node)) return { height: "auto", aspectRatio: `${node.imgW} / ${node.imgH}` };
  return { height: "260px" };
}

/** How long to wait for a decode before giving up and letting the picture through unmeasured. */
export const MEASURE_TIMEOUT_MS = 8000;

/**
 * Measure a picture's natural size, once, at the moment it is added.
 *
 * Done here rather than by reading the file's bytes because the browser already decodes every format it can
 * display — JPEG, PNG, WebP, AVIF, GIF — and a hand-written header parser would understand fewer of them and
 * be wrong about more. Resolves to `{}` rather than rejecting: an unmeasurable image is not an error, it just
 * keeps the fixed-height behaviour that existed before.
 */
export function measureImage(src: string): Promise<{ imgW?: number; imgH?: number }> {
  if (!src || typeof Image === "undefined") return Promise.resolve({});
  return new Promise((resolve) => {
    const img = new Image();
    let settled = false;
    // The upload WAITS on this before it puts the picture on the page, so the promise has to be total: a
    // decode that never finishes and never errors would mean a photo the user chose simply never appearing.
    // Measuring is an optimisation; showing the picture is not.
    const timer = setTimeout(() => done({}), MEASURE_TIMEOUT_MS);
    function done(v: { imgW?: number; imgH?: number }) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      img.onload = null; img.onerror = null;
      resolve(v);
    }
    img.onload = () => done(img.naturalWidth > 0 && img.naturalHeight > 0
      ? { imgW: img.naturalWidth, imgH: img.naturalHeight }
      : {});
    img.onerror = () => done({});
    img.src = src;
  });
}

/** flex behaviour for a child inside a flex parent, derived from its main-size token.
 *  An explicit size is a FIXED share (no grow/shrink) so a section keeps exactly the width you give it —
 *  you can resize it narrower to open space, and drop another section into that space. `fill` grows to
 *  take whatever is left. Dropping a section beside another sets its width to the leftover so it fits. */
export function flexForWidth(token?: string): string | undefined {
  if (token === "fill") return "1 1 0%";
  if (!token || token === "auto") return "0 0 auto";
  return `0 1 ${token}`; // fixed share, but MAY SHRINK to fit — so a row's sections can never overflow / run off the page
}

/**
 * Render a px-at-base-10 size as a browser-RELATIVE length off the page base unit (`--box-u`, ≈0.625rem
 * = 10px at the browser default). Because it's rem-based, sizes scale with the user's browser font size
 * — WCAG 1.4.4 (resize text) compliant. We never set an absolute px root font-size.
 */
/**
 * A CSS length in `rem`, from a pixel measurement (Responsive Design Field Guide, ingredient ②).
 * Sizes are STORED in rem, not px, so a reader who raises their browser's base font scales the whole design
 * with their preference instead of having it overridden. `rootPx` is the live root font size (16 by default).
 */
/**
 * A definite CSS length back to px, for layout maths. Understands `rem` (what the editor now writes) and `px`
 * (older documents), and returns null for anything relative — %, vh, auto — which has no fixed pixel value.
 * Anything that reasons about a stored size MUST go through this: reading only px silently treated every rem
 * height as "no height", which stopped a section reserving room for the block floating inside it.
 */
export function lenToPx(token: string | undefined, rootPx = 16): number | null {
  if (!token) return null;
  const n = parseFloat(token);
  if (Number.isNaN(n)) return null;
  if (token.endsWith("rem")) return n * (rootPx || 16);
  if (token.endsWith("px")) return n;
  return null;
}

/** Is this a definite length the layout can reason about (as opposed to %, vh or auto)? */
export function isDefiniteLen(token?: string): boolean {
  return lenToPx(token) !== null;
}

export function remLen(px: number, rootPx = 16): string {
  return `${Math.round((px / (rootPx || 16)) * 1000) / 1000}rem`;
}

/** The document's root font size — the basis for every rem the editor writes. */
export function rootFontPx(): number {
  if (typeof document === "undefined") return 16;
  return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
}

export function u(px: number): string {
  return `calc(var(--box-u, 0.625rem) * ${+(px / 10).toFixed(4)})`;
}

/**
 * The page base unit as a FLUID length: `clamp(minRem, cqw, maxRem)`.
 *  - the `cqw` middle scales with the container (canvas/screen) WIDTH — so text/spacing shrink on mobile
 *    and grow on desktop automatically;
 *  - the rem min/max keep it browser-relative (respects the user's font size) and bounded — WCAG-friendly.
 * At a ~1000px container, the unit ≈ baseFontPx (default 10px); it clamps to ~0.7×/1.4× at the extremes.
 */
export function baseUnit(baseFontPx = 10): string {
  const lo = +((baseFontPx * 0.7) / 16).toFixed(4);   // rem floor (≈0.7× base)
  const hi = +((baseFontPx * 1.4) / 16).toFixed(4);   // rem ceiling (≈1.4× base)
  const cqw = +(baseFontPx / 10).toFixed(4);          // 1cqw ≈ base at a 1000px-wide container
  return `clamp(${lo}rem, ${cqw}cqw, ${hi}rem)`;
}

/**
 * The space BETWEEN children, across and down.
 *
 * Emitted as the single `gap` when both axes agree, so a row that has never been given a per-axis value
 * produces exactly the declaration it always did. `column-gap`/`row-gap` appear only once someone asks for
 * them — which is the commonest grid there is: cards with air between the columns and less between the rows.
 */
export function gapCSS(node: BoxNode): CSSProperties {
  const base = node.gap ?? 16;
  const x = node.gapX ?? base, y = node.gapY ?? base;
  return x === y ? { gap: u(x) } : { columnGap: u(x), rowGap: u(y) };
}

/** Per-side padding CSS (responsive rem): a side override falls back to the general `padding`, then 0. */
export function paddingCSS(node: BoxNode): CSSProperties {
  const p = node.padding ?? 0;
  return {
    paddingTop: u(node.paddingTop ?? p),
    paddingRight: u(node.paddingRight ?? p),
    paddingBottom: u(node.paddingBottom ?? p),
    paddingLeft: u(node.paddingLeft ?? p),
  };
}

/** Per-side margin CSS (responsive rem): a side override falls back to the general `margin` (undefined = none). */
export function marginCSS(node: BoxNode): CSSProperties {
  const m = (side?: number) => { const v = side ?? node.margin; return v === undefined ? undefined : u(v); };
  return {
    marginTop: m(node.marginTop),
    marginRight: m(node.marginRight),
    marginBottom: m(node.marginBottom),
    marginLeft: m(node.marginLeft),
  };
}

/**
 * How tall a positioning parent must be so it still CONTAINS its floating children (which are out of the flow).
 * A floating child's `top` is a % of the parent's content height and its height is its `minHeight` (a floating
 * card is `clip`ped, so minHeight IS its height). Its bottom fits when contentH ≥ h/(1 − top). We compute that
 * from the STORED values only (no measuring, no stored reserve on the parent → nothing to leak) so the parent
 * always wraps its floating children AND re-computes automatically as you drag/resize them. Padding is added
 * back so the border-box stays tall enough. Returns 0 when there are no floating children.
 */
export function floatingReserve(node: BoxNode, bp: Breakpoint = "base"): number {
  let need = 0;
  for (const c of node.children ?? []) {
    if (!isFloating(c)) continue;
    // On MOBILE a float that stacks is back in normal flow — it grows the parent itself, so it needs NO
    // reserve (reserving here would leave a tall empty gap under the now-inline card).
    if (bp === "phone" && floatStacksOnMobile(c)) continue;
    const rc = bp === "base" ? c : resolveResponsive(c, bp); // its effective height/top at this breakpoint
    // A floating card has a DEFINITE `height` (px) — its true rendered height; fall back to minHeight for old data.
    const h = lenToPx(rc.height) ?? rc.minHeight ?? 0;
    const top = Math.min(Math.max(rc.top ?? 0, 0), 92); // cap so we never divide by ~0
    const n = h / (1 - top / 100);
    if (n > need) need = n;
  }
  if (need <= 0) return 0;
  const padV = (node.paddingTop ?? node.padding ?? 0) + (node.paddingBottom ?? node.padding ?? 0);
  return Math.round(need + padV);
}

/** The container's own layout CSS (flex or grid), as inline style. `bp` makes the floating reserve device-aware. */
export function containerStyle(node: BoxNode, bp: Breakpoint = "base"): CSSProperties {
  // Computed in px (measurements are px) but EMITTED in rem, per the field guide: a stored size must never
  // reach the page as a pixel value, or a reader who has raised their base font gets a box that ignores them.
  const minHpx = Math.max(node.minHeight ?? 0, floatingReserve(node, bp)) || undefined;
  const minH = combineMinHeight(minHpx == null ? undefined : remLen(minHpx), node.screenHeight);
  if (node.layout === "grid") {
    return {
      display: "grid",
      // Per RUNG, so a twelve-column row is twelve columns on a desktop and one on a phone (`gridColumnsAt`).
      gridTemplateColumns: `repeat(${gridColumnsAt(node, bp)}, minmax(0, 1fr))`,
      ...gapCSS(node),
      alignItems: ALIGN_CSS[node.align ?? "stretch"],
      // A grid's tracks are `1fr`, so they have already eaten every spare pixel and `justify-content` — which
      // distributes leftover TRACK space — can never do anything on one: the flex "Position blocks" control
      // was simply inert on a grid, the same class of defect as the dead container queries. Where a block sits
      // in its own CELL is `justify-items`, and it gets its own field rather than borrowing `justify`, because
      // `createContainer` writes `justify: "start"` on every container ever made — reading that as a choice
      // would have made every saved grid's children stop filling their cells overnight.
      ...(node.justifyItems ? { justifyItems: node.justifyItems } : {}),
      // THE ROWS SHARE THE HEIGHT EVENLY, AND NEVER CROP WHAT IS IN THEM.
      //
      // `minmax(min-content, 1fr)` is both halves of that in one value. The `1fr` gives every row an equal
      // share, so making the page or the section taller spreads the new space across the rows instead of
      // leaving a dead band at the bottom — and shrinking it takes the space back the same way. The
      // `min-content` floor is what stops the sharing ever going too far: a row can give up its share right
      // down to the height its content needs to be readable and no further, and an empty cell's content
      // needs nothing, so it collapses to the least it can be.
      //
      // Two defaults are wrong here and both were tried. `auto` rows with the browser's own `align-content`
      // hand ALL the spare height to the rows unequally. Packing them to the start instead makes every row
      // hug, which is tidy but leaves the height a person just dragged sitting unused underneath.
      //
      // (The horizontal axis already behaves: the columns are `minmax(0, 1fr)`, so a cell is its share of the
      // row, spread evenly, and it tracks the page's width by construction.)
      gridAutoRows: "minmax(min-content, 1fr)",
      // …and where a row HAS been given a height by hand, it keeps it while the others share what is left.
      // `grid-auto-rows` alone cannot express that: it is one value for every row, so a row dragged taller
      // was immediately levelled back down by the `1fr` its neighbours were also claiming. See `gridRowTracks`.
      ...(() => { const t = gridRowTracks(node, bp); return t ? { gridTemplateRows: t } : {}; })(),
      ...paddingCSS(node),
      minHeight: minH,
    };
  }
  return {
    display: "flex",
    flexDirection: node.direction ?? "column",
    ...gapCSS(node),
    alignItems: ALIGN_CSS[node.align ?? "stretch"],
    justifyContent: JUSTIFY_CSS[node.justify ?? "start"],
    // Responsive Field Guide: a ROW BAND always allows wrapping so its sections REFLOW (stack) on narrow
    // screens instead of shrinking to unreadable slivers. On desktop they still sit side-by-side (they fit).
    flexWrap: node.wrap || node.rowBand ? "wrap" : "nowrap",
    // Pack wrapped lines to the top so they never stretch apart and leave gaps between sections — EXCEPT when
    // this box exists to hold something that wants the height it is given (a grid, or a band holding one).
    //
    // A row band always wraps, and on a wrapping flex container `align-content: flex-start` makes each LINE
    // hug its content. `align-items: stretch` then stretches the child inside that line — which is already
    // zero tall — so a nested grid measured 0px inside a band that was itself correctly 500px. Two rules that
    // are each right on their own, cancelling each other out, and nothing in the class names said so.
    alignContent: fillsGivenHeight(node) ? "stretch" : "flex-start",
    ...paddingCSS(node),
    minHeight: minH,
  };
}

/**
 * A child's own sizing CSS, adapted to its PARENT's engine + direction.
 *  - grid parent: colSpan/rowSpan control the cell; height token honoured.
 *  - flex ROW parent:    main axis = width  → `width` drives flex (division); `height` is the cross size.
 *  - flex COLUMN parent: main axis = height → `height` drives flex (division); `width` is the cross size.
 * So a section with the MAIN-axis token set to "fill" divides that axis equally with its siblings.
 */
/**
 * Does this block want the height it is GIVEN, rather than hugging its own content?
 *
 * A grid does: dividing space is the whole job of a grid, so one dropped into a cell should take that cell's
 * height instead of sitting in the top of it and leaving the rest as a dead band.
 *
 * And so does a structural ROW BAND that exists only to hold one. That second clause is the entire bug, and it
 * is invisible from the tree a person thinks they built: `normalizeRowBands` puts a band between a cell and
 * whatever is inside it, so a nested grid is never a cell's direct child. Making the grid fill was therefore
 * not enough — the band above it went on hugging, and the grid dutifully filled a band that was already
 * collapsed. (It also explains why the first test of this passed while the app stayed broken: the test built
 * its tree by hand, without the bands the real builder inserts.)
 */
function fillsGivenHeight(node: BoxNode): boolean {
  if (!isContainer(node)) return false;
  if (node.layout === "grid") return true;
  const kids = node.children ?? [];
  return !!node.rowBand && kids.length === 1 && fillsGivenHeight(kids[0]);
}

export function childStyle(child: BoxNode, parent: BoxNode, bp: Breakpoint = "base"): CSSProperties {
  const s: CSSProperties = {};
  if (parent.layout === "grid") {
    // Re-fitted to the track the row actually has AT THIS RUNG (see `gridPlacementAt`). A span of 8 left over
    // from a twelve-column desktop would otherwise generate implicit columns on a phone and blow the row's
    // width past the screen — the horizontal-scrollbar bug guarded against in three other places already.
    const { span, start } = gridPlacementAt(parent, child, bp);
    const place = start != null ? `${start} / span ${span}` : span > 1 ? `span ${span}` : undefined;
    if (place) s.gridColumn = place;
    // The down axis. No rung re-fit and no clamp: rows are implicit, so the grid simply makes as many as the
    // placement asks for — a block on row 4 of a two-row grid creates rows 3 and 4 rather than overflowing.
    const rowSpan = Math.max(1, Math.round(child.rowSpan ?? 1));
    const rowStart = child.rowStart == null ? null : Math.max(1, Math.round(child.rowStart));
    if (rowStart != null) s.gridRow = `${rowStart} / span ${rowSpan}`;
    else if (rowSpan > 1) s.gridRow = `span ${rowSpan}`;
    if (child.justifySelf) s.justifySelf = child.justifySelf;
    if (child.alignSelf) s.alignSelf = child.alignSelf;
    const h = sizeToCSS(child.height);
    if (h) s.height = h;
    placeInSequence(s, child);
    // LAST, so the nine-point position wins over the older per-axis controls it replaces.
    Object.assign(s, placeCSS(child, parent));
    return s;
  }
  const isRow = (parent.direction ?? "column") === "row";
  const mainToken = isRow ? child.width : child.height;   // grows/divides along the main axis
  const crossToken = isRow ? child.height : child.width;  // fixed size across the main axis
  const parentMain = isRow ? parent.width : parent.height;
  // "Definite" main size means the child should fill+follow it. For a column, an explicit height OR a
  // min-height (set by resizing the section's height) both count — so children fill/shrink with the floor.
  const parentDefinite = (!!parentMain && parentMain !== "auto" && parentMain !== "fill") || (!isRow && !!parent.minHeight);
  // When the child has no explicit MAIN size and the parent's main axis is DEFINITE (e.g. a section with a
  // set height), the child FILLS + follows the parent (`1 1 auto`: grow to fill, shrink to fit, content
  // basis) — so shrinking the parent's height shrinks its children. Otherwise it hugs / uses its token
  // (keeps a hug-content parent, like the page, growing with content instead of stretching empty children).
  // A GRID FILLS WHAT IT IS PUT IN (see `fillsGivenHeight`). Only down the MAIN axis of a column parent —
  // `!isRow` — because in a row the main axis is width, and a grid should take its share of the width like
  // anything else, not all of it.
  const fillsMain = !isRow && fillsGivenHeight(child) && (!mainToken || mainToken === "auto");
  s.flex = fillsMain || ((!mainToken || mainToken === "auto") && parentDefinite) ? "1 1 auto" : flexForWidth(mainToken);
  // A box can pin its OWN cross-axis alignment (used by edge-anchored resize to keep the far edge fixed
  // even when the parent centres/stretches its children).
  if (child.alignSelf) s.alignSelf = child.alignSelf;
  // By default a box HUGS its content (flex auto-minimum = content) — it can't be sized smaller than
  // what's inside it. When `clip` is on, OR the box is EMPTY (nothing inside), we drop the minimum so
  // it can be shrunk all the way down to ~1px (padding is clipped along with it).
  // A SCREEN HEIGHT counts as an explicit floor too. Without that clause an empty box lost it — and a hero is
  // empty right up until you put something in it, so "make this section full screen" appeared to do nothing
  // at the exact moment a person would try it.
  if (child.clip || isEmptyBox(child)) { s.minWidth = 0; if (child.minHeight == null && !child.screenHeight) s.minHeight = 0; } // keep an EXPLICIT resize floor; only drop the content-min when there's none
  // ── Responsive Field Guide reflow ──
  // A section inside a ROW BAND keeps a usable minimum width (`min(100%, 14rem)`): its siblings stay side-by-side
  // while they fit, but once the row is too narrow for everyone at that minimum, it WRAPS — so on a phone the
  // sections stack (each ~14rem-or-full) instead of cramming into unreadable columns. Doesn't touch resize/grow.
  if (parent.rowBand && isRow && !child.clip && !isEmptyBox(child) && isContainer(child)) s.minWidth = "min(100%, 14rem)"; // only SECTIONS get the reflow floor; elements/components hug their content
  const crossCss = sizeToCSS(crossToken);
  // RULE O — inside a ROW a block's height is its CROSS size. For a self-painting block (component/button) that
  // must be a FLOOR, not a cap: a hard height here is what let the content spill out below the box after the
  // block was later narrowed and its text rewrapped taller. Shrinking still works — the text scales to fit.
  const selfSizing = child.type === "component" || child.type === "button";
  if (crossCss) {
    if (isRow) { if (selfSizing) s.minHeight = crossCss; else s.height = crossCss; }
    else s.width = crossCss;
  }
  // HUG, don't stretch: a BLOCK (element/component) with an auto cross-size ("Fit") must be exactly as big as its
  // content — the parent's default `align-items: stretch` would otherwise blow it up to the full cross axis, which
  // reads as an empty "wrapper" box around a short heading/button. Pin it to the start (or follow an explicit parent
  // alignment). Containers keep stretching (sections fill their row / share equal height); an explicit self-align
  // (edge-anchored resize) is never overwritten.
  if (!crossCss && !isContainer(child) && !child.alignSelf) {
    const pa = parent.align ?? "stretch";
    s.alignSelf = pa === "stretch" ? "flex-start" : ALIGN_CSS[pa];
  }
  placeInSequence(s, child);
  // LAST, so the nine-point position wins over the older per-axis controls it replaces (`push`, and the
  // hug-to-content `alignSelf` just above): a block told where to sit goes there.
  Object.assign(s, placeCSS(child, parent));
  return s;
}

/**
 * `order` and the PUSH idiom — the two placement controls that mean the same thing in both engines.
 *
 * ORDER is what makes "the photo above the words on a phone, beside them on a desktop" possible, and it was
 * simply not a field before: the only way to reorder anything was to move it in the tree, which moves it on
 * every screen at once. Set at one rung, it changes the sequence there and nowhere else.
 *
 * PUSH is an auto margin — the oldest idiom in flexbox and still the only one that moves a SINGLE item without
 * touching its siblings. It works inside a grid cell too, so one implementation serves both engines. Physical
 * sides rather than the logical ones deliberately: they land in the same slots as `marginCSS`, which runs
 * BEFORE this in both the canvas's wrapStyle and the export's styleAt, so a push cleanly overrides a margin
 * instead of the two silently coexisting as different properties that resolve to the same edge.
 */
function placeInSequence(s: CSSProperties, child: BoxNode): void {
  if (child.order != null) s.order = Math.round(child.order);
  if (child.push === "end" || child.push === "both") s.marginLeft = "auto";
  if (child.push === "start" || child.push === "both") s.marginRight = "auto";
}

/**
 * A box measured against the SCREEN — the full-screen hero, and the split-screen that fills the window.
 *
 * `svh`, not `vh`. On a phone the browser's own chrome hides as you scroll, and `100vh` is the height WITHOUT
 * it — so a "full screen" hero is taller than the screen actually is when the page first loads, and its last
 * line sits below the fold on the one device where that matters most. `svh` is the SMALL viewport height, the
 * conservative one: the section always fits on arrival, and grows into the extra room afterwards.
 *
 * A FLOOR, never a cap. When the box also carries its own minimum, the two are combined with CSS `max()` so
 * whichever is larger wins — a hero whose words outgrow the screen gets taller rather than hiding them.
 */
export function combineMinHeight(own: string | undefined, screen: BoxNode["screenHeight"]): string | undefined {
  const wanted = screen === "full" ? "100svh" : screen === "half" ? "50svh" : undefined;
  if (!wanted) return own;
  return own ? `max(${own}, ${wanted})` : wanted;
}

// ── Band edges: sloped and curved section boundaries ─────────────────────────

/** How many points approximate a curved edge. Sixteen is smooth at any width and still a short declaration. */
const CURVE_STEPS = 16;

/**
 * The points along one horizontal edge, left to right, as `[x%, y%]` pairs measured from the band's top.
 *
 * `depth` is the deepest the shape cuts, in percent of the band's height, and `base` is the edge it cuts from
 * (0 for the top, 100 for the bottom). Everything is a PERCENTAGE, which is what makes the shape survive any
 * width, any height and any breakpoint without a media query — the reason this is one `clip-path` rather than
 * an SVG the export would have to size.
 */
function edgePoints(shape: BandEdge | undefined, depth: number, base: 0 | 100): [number, number][] {
  const inward = base === 0 ? depth : -depth; // "down" from the top edge, "up" from the bottom one
  if (!shape) return [[0, base], [100, base]];
  if (shape === "slope-right") return [[0, base], [100, base + inward]];
  if (shape === "slope-left") return [[0, base + inward], [100, base]];
  // A cosine gives a single clean arch — flat at both ends, deepest in the middle — where a circle segment
  // would meet the sides at an angle and read as a lens rather than a curve.
  const sign = shape === "curve-out" ? -1 : 1;
  return Array.from({ length: CURVE_STEPS + 1 }, (_, i) => {
    const t = i / CURVE_STEPS;
    const y = base + sign * inward * (1 - Math.cos(t * Math.PI * 2)) / 2;
    return [t * 100, y] as [number, number];
  });
}

/**
 * A band's shaped top and/or bottom edge, as a single `clip-path`.
 *
 * BOTH edges in one polygon on purpose. `clip-path` is one property, so a diagonal top and a curved bottom
 * cannot be two declarations — and doing curves with `border-radius` instead (the other obvious route) would
 * collide with the corner-radius control, which owns that property. One polygon, built from percentages, is
 * the only form that lets the two edges be chosen independently AND stay responsive.
 *
 * The band keeps its full height: the shape CUTS the background, it does not move the content. A section that
 * shrank as you sloped it would be a layout control disguised as a decorative one.
 */
export function bandEdgeCSS(node: BoxNode): CSSProperties {
  if (!node.edgeTop && !node.edgeBottom) return {};
  const depth = Math.min(50, Math.max(0, node.edgeDepth ?? 6));
  const pts = [
    ...edgePoints(node.edgeTop, depth, 0),
    ...edgePoints(node.edgeBottom, depth, 100).reverse(), // right to left, closing the shape
  ];
  const round = (n: number) => Math.round(n * 100) / 100;
  return { clipPath: `polygon(${pts.map(([x, y]) => `${round(x)}% ${round(y)}%`).join(", ")})` };
}

/** `align-self` spelt the way flexbox wants it. */
const SELF_CSS = { start: "flex-start", center: "center", end: "flex-end" } as const;

/**
 * WHERE A BLOCK SITS IN ITS PARENT — nine positions, one control, whatever the parent happens to be.
 *
 * The pair (`placeX`, `placeY`) is what a person means: top-left, centre, bottom-right. Turning that into CSS
 * is where the confusion lived, because the answer changes with the engine AND, in flex, with the direction:
 *
 *   • a GRID cell — `justify-self` across, `align-self` down. Both axes belong to the child. Simple.
 *   • a flex ROW  — down is the CROSS axis (`align-self`); across is the MAIN axis, which a child can only
 *                   move itself along with an AUTO MARGIN.
 *   • a flex COLUMN — the same two facts with the axes swapped.
 *
 * That is four different properties for one idea, and picking the right one is not something a person building
 * a school website should have to reason about. Before this it was four separate controls whose meaning
 * quietly changed with the parent — one of them ("Line up (down)") was even labelled for the wrong axis in the
 * commonest case of all.
 *
 * Auto margins are used rather than the parent's `justify-content` on purpose: they move THIS block only, and
 * leave its siblings exactly where they were.
 */
export function placeCSS(child: BoxNode, parent: BoxNode): CSSProperties {
  const { placeX: x, placeY: y } = child;
  if (x == null && y == null) return {};
  const s: CSSProperties = {};
  if (parent.layout === "grid") {
    if (x) s.justifySelf = x;
    if (y) s.alignSelf = SELF_CSS[y];
    return s;
  }
  const isRow = (parent.direction ?? "column") === "row";
  const cross = isRow ? y : x;               // the axis the child owns outright
  const main = isRow ? x : y;                // the axis it can only move along with an auto margin
  if (cross) s.alignSelf = SELF_CSS[cross];
  if (main === "center") { if (isRow) { s.marginLeft = "auto"; s.marginRight = "auto"; } else { s.marginTop = "auto"; s.marginBottom = "auto"; } }
  else if (main === "end") { if (isRow) s.marginLeft = "auto"; else s.marginTop = "auto"; }
  else if (main === "start") { if (isRow) s.marginRight = "auto"; else s.marginBottom = "auto"; }
  return s;
}
