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
import { RUNG_MEASURE, RUNG_PX, type RungName } from "@/lib/educo-ui/layout";
import { hasItemEffects, itemEffectsCss, revealEffect, REVEAL_DUR, REVEAL_EASE, REVEAL_VIEW_RANGE } from "@/lib/interactions";
import { PAGE_Z, clampPageZ } from "@/lib/educo-ui/stacking";
import { remLen, SHADOW_SCALE } from "@/lib/educo-ui/tokens";
import { colorToCSS } from "@/components/shared/ColorPalettePicker";

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
  /**
   * How the grid's ROWS are measured. Absent (the default) is `Even` — every row shares the height, which is
   * what every saved page already does and what `gridAutoRows: minmax(min-content, 1fr)` expresses.
   *
   * `"masonry"` is the gallery mode: the row track stops being a row and becomes a fine measuring UNIT
   * (`MASONRY_ROW_REM`), and each cell claims however many of those units its content is tall. That is what
   * lets a column of photos stagger instead of every picture being letterboxed to its row's height — while
   * the twelve columns, the spans, the offsets and the reading order all keep working, which is the whole
   * reason this is a row option rather than CSS `columns`.
   */
  rowFlow?: "even" | "masonry";
  /**
   * SHOW ONE AT A TIME — a pager, as a MODE on any container rather than a Gallery component.
   *
   * With it on, the container's own children stop being a stack or a grid and become PAGES: one fills the
   * box, the next sits beside it, and the visitor swipes, scrolls or arrows between them. Each page is
   * therefore an ordinary box the user hand-designed, which is the entire reason this is a mode. A
   * component's content is a flat `ComponentItem` (title, body, one media URL, no `BoxNode` anywhere), so
   * a component could hold a list of captions and never a designed page — and inside one, the twelve
   * columns, the spans, the offsets and every other control would stop applying.
   *
   * The mechanism is CSS scroll-snap and nothing else, so the baseline is genuinely zero JavaScript:
   * every page is real DOM in reading order, touch swipe and trackpad work, and with the strip focusable
   * the arrow keys page through it. Measured in a browser before this was built (see `pagerScript`) —
   * that much needs no script at all.
   */
  pager?: boolean;
  /** Which way of moving between pages is offered. Absent means dots. */
  pagerNav?: PagerNav;
  /**
   * Seconds between automatic advances. Absent or 0 means it does not advance on its own, which is the
   * default because movement nobody asked for is the thing this most easily gets wrong.
   *
   * Turning it on is what adds the auto-advance half of `pagerScript`, and that script pauses on hover and
   * on keyboard focus — a carousel a reader cannot hold still to read is a WCAG 2.2.2 failure.
   */
  pagerAuto?: number;
  /**
   * Masonry only, opt IN: measure the real rendered heights on the page and set the spans exactly.
   *
   * Off by default, because the default has to be zero JavaScript. With it off the spans are worked out from
   * what the model already knows (a photo's intrinsic shape, a block's stated height) — which is exact for a
   * contained band and close for an edge-to-edge one. With it on, a small guarded script corrects them after
   * layout, on resize, and as fonts and images land. It is progressive enhancement, never a second mechanism:
   * with scripting off the page still gets the staggered, never-cropped layout underneath.
   */
  rowMeasure?: boolean;
  padding?: number;         // px inner padding (all sides)
  paddingTop?: number; paddingRight?: number; paddingBottom?: number; paddingLeft?: number; // per-side overrides
  margin?: number;          // px outer margin (all sides)
  marginTop?: number; marginRight?: number; marginBottom?: number; marginLeft?: number;     // per-side overrides
  radius?: number;          // px corner radius (all corners)
  radiusTopLeft?: number; radiusTopRight?: number; radiusBottomRight?: number; radiusBottomLeft?: number; // per-corner overrides
  opacity?: number;         // 0–100 (%), default 100 (fully opaque) — the BOX's own paint, not its contents
  fadeContents?: boolean;   // opt in: fade everything inside this box too (real CSS opacity, from here down)
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

  /**
   * PINNING — the block stays visible while the page scrolls past it. Phase 3 of the Layout System.
   *
   * `position: sticky`, said once: which edge of the screen it holds itself against. Undefined is the
   * default and means what it has always meant — the block scrolls away with everything else.
   *
   * It is a per-rung control like every other layout decision, which is the point: a sidebar that follows
   * you down a desktop is useful, and the same sidebar pinned on a phone eats a screen that has none to
   * spare. Set it at the base and turn it off at `phone`.
   */
  pin?: "top" | "bottom" | "left" | "right"
      | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** How far from that edge it comes to rest, in px (emitted as rem). Default 0 — flush against the edge. */
  pinOffset?: number;
  /**
   * WHICH KIND of staying put — and they are genuinely different things, not a preference.
   *
   * `sticky` (the default, and what every page saved before this field existed means) keeps the block in the
   * flow: it holds against its edge while its PARENT is on screen and leaves with the parent, so it occupies
   * real space and can never cover the footer.
   *
   * `fixed` takes the block out of the document entirely and measures it against the VIEWPORT. It holds
   * whatever you scroll, ignores its column and its gutters, reserves no space — so the page runs underneath
   * it — and it can sit in a corner, which sticky cannot. A cookie bar, a back-to-top button, a chat bubble.
   *
   * Absent means `sticky`, so not one saved page changes the day this ships.
   */
  hold?: "sticky" | "fixed";
  /**
   * HOW IT ARRIVES once the page has moved — Step 2b of the Layout System.
   *
   * A bar that looks the same held as it did sitting in the page tells the reader nothing about what just
   * happened. These are the five changes worth making, and absent means NOTHING changes: rule 11, nothing
   * arrives that nobody asked for.
   */
  pinArrival?: "shadow" | "solid" | "glass" | "rule" | "condense";
  /** How much scrolling the arrival takes to complete, in the fluid base unit. Default 12 (~120px). */
  pinArrivalAfter?: number;
  /**
   * WHERE A FLOATED BLOCK HOLDS ON SCREEN — px from the top-left of the box it is measured against.
   *
   * A block placed freely stores `left`/`top` as a PERCENTAGE of the section it sits in. Lifted to the
   * window those percentages mean something else entirely: measured, a block resting 720px down a tall
   * section landed at 240px once fixed, because 30% of a 2400px section is not 30% of an 800px window.
   * So the moment a floated block is set to float on screen, its place is measured and kept here in a unit
   * that means the same in both boxes. `left`/`top` are untouched, so returning it puts it back exactly.
   */
  pinX?: number;
  pinY?: number;

  // ── free / floating position (escape the flow: lift a section onto its OWN layer to OVERLAP others) ──
  position?: "flow" | "absolute"; // default "flow" (in the row-band stack); "absolute" = free-floating layer
  /**
   * WHAT THE BLOCK WAS BEFORE IT WAS LIFTED — so putting it back is a round trip and not an edit.
   *
   * Floating turns a block into a card: it writes a definite height and drops the block's own `minHeight`.
   * Returning it used to delete both, which threw the ORIGINAL size away — measured, a 120px stack came
   * back 49px tall (the height of its text), and floating it again started from that. Two or three cycles
   * and an empty box has nothing left to see or click, which is exactly what a user reported.
   *
   * `sized` records what the float itself wrote, so a size the USER changed while it floated can be told
   * apart from the one the builder wrote — theirs is kept, the builder's is undone.
   */
  floatFrom?: { width?: string; height?: string; minHeight?: number; clip?: boolean; sized?: string; sizedMin?: number };
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

/**
 * What to CALL a container, in the one place that decides it.
 *
 * A container is a single object that wears three arrangements — down the page, across it, or both at once —
 * and switching between them is one click in "Arrange as". So the name has to follow the arrangement, or the
 * block is called one thing in the palette, another in the inspector, and a third on the drag preview.
 *
 * It was exactly that: the inspector and the canvas each computed "Grid" / "Row" / "Section" from their own
 * copy of this expression, and the palette called the same blocks Section / Columns / Row. UAT found four
 * separate complaints in that one gap. One resolver, so they cannot drift again — and so a rename lands
 * everywhere at once.
 *
 * These are the names a USER sees. The stored `layout` and `direction` are untouched.
 */
export function containerLabel(node: BoxNode): string {
  if (node.layout === "grid") return "Grid";
  return (node.direction ?? "column") === "row" ? "Side by side" : "Stack";
}

/**
 * What to CALL a block when a warning has to name it — “the Card around it”, “the Grid around it”.
 *
 * `containerLabel` answers for containers and would call a Card a “Stack”, which is worse than saying
 * nothing: the user would look for a Stack and find none. A component is named for what it is, and the
 * null case is carried here so both pin warnings read from one function rather than each guarding it.
 */
export function blockedByLabel(node: BoxNode | null): string | null {
  if (!node) return null;
  if (node.type === "component" && node.component) {
    return node.component.charAt(0).toUpperCase() + node.component.slice(1);
  }
  return isContainer(node) ? containerLabel(node) : "block";
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

/** Block types that draw a line rather than occupy a band — they have no height worth the name. */
const NO_HEIGHT_OF_ITS_OWN = new Set<BoxType>(["divider"]);

/** A measured rectangle, as the editor's selection chrome mirrors it. */
export type MirrorBox = { left: number; top: number; width: number; height: number };

/**
 * SHOULD THE SELECTION CHROME TAKE THIS NEW MEASUREMENT, or has the layout stopped settling?
 *
 * The editor mirrors a selected block's rectangle so its toolbar and handles sit on it. Measuring happens
 * after every render, because a block's geometry changes without any prop changing — a longer heading, a
 * reflow, a drag in progress. That makes a cycle: measure → setState → render → measure.
 *
 * Deferring the re-measure to the next frame stops React counting the updates as nested, and was believed
 * to be the whole fix. It is not: it breaks the COUNTING, not the CYCLE. A layout that never settles — a
 * grid whose rows are partly `auto` and partly `1fr` can disagree with itself by a fraction of a pixel
 * indefinitely — produces a different answer every frame and the chain runs on until React gives up with
 * "Maximum update depth exceeded". That crash was reported twice.
 *
 * So the chase is given a budget: chasing a value that keeps changing spends it, and the layout holding
 * still gives it back. When it runs out the mirror keeps the last rectangle it had.
 *
 * ── WHICH RECTANGLE "HOLDING STILL" IS MEASURED AGAINST, AND WHY IT IS NOT THE OBVIOUS ONE ──────────
 *
 * The first version asked "does this measurement match the one the chrome is DISPLAYING?" — and that
 * wrecked every resize, which is the one gesture the mirror exists to follow. Two faults, one root:
 *
 *   · A drag commits a tree PER FRAME, so its loop runs take → quiet → take → quiet. Exactly ONE quiet
 *     frame per move. Requiring two (added to close an alternating-oscillation loophole) meant the budget
 *     was never restored during a drag at all: eight mousemoves, about 130ms, and the handles stopped.
 *   · Worse, the freeze was PERMANENT. Once it stops taking, the displayed rectangle is stale by
 *     definition, so it can never again match a block that is still moving — the way back was sealed by
 *     the same comparison that closed the road. Reported with the handles marooned some 550px from the
 *     block they belonged to, and only re-selecting the block cleared it.
 *
 * Both dissolve once the two questions are asked separately, because they were never the same question:
 *
 *   · `settled` — has the LAYOUT stopped changing? This measurement against the LAST MEASUREMENT, taken
 *     or not. It keeps advancing while the chase is abandoned, so a layout that finally holds still is
 *     always noticed, and one that alternates forever never reads as settled.
 *   · `showing` — is the CHROME already drawn there? That decides whether an update is needed at all.
 *
 * A settle then both restores the budget AND takes the measurement, which is the way back: however badly
 * a chase was abandoned, the chrome lands on the block the moment the block stops moving.
 *
 * Pure and exported so the rule can be tested. The browser condition that triggers the runaway has
 * resisted every attempt to reproduce — including a drag driven at 120 events/sec with sub-pixel jitter —
 * so testing the DECISION is the only honest guard available for that half of it. The half the user hit
 * is driven in a real browser by `tests/e2e/chrome-follows-resize.spec.ts`.
 */
export type MirrorChase = { churn: number; seen: MirrorBox | null };

export function shouldTakeMirrorBox(
  prev: MirrorBox | null,
  next: MirrorBox | null,
  state: MirrorChase,
  maxChurn: number,
): { take: boolean; state: MirrorChase } {
  const near = (a: number, b: number) => Math.abs(a - b) < 0.5;
  const same = (a: MirrorBox | null, b: MirrorBox | null) =>
    a && b
      ? near(a.left, b.left) && near(a.top, b.top) && near(a.width, b.width) && near(a.height, b.height)
      : a === b;

  const settled = same(state.seen, next);   // the layout gave the same answer twice running
  const showing = same(prev, next);         // the chrome is already drawn on it

  // Nothing to update. A repeat measurement still counts as the layout holding still.
  if (showing) return { take: false, state: { churn: settled ? 0 : state.churn, seen: next } };
  // It held still, and the chrome is somewhere else: catch up, and start the budget fresh.
  if (settled) return { take: true, state: { churn: 0, seen: next } };
  // Still moving with the budget gone — keep the last rectangle rather than chase a layout arguing with
  // itself. `seen` keeps advancing, so the branch above brings the chrome back the moment it does settle.
  if (state.churn >= maxChurn) return { take: false, state: { churn: state.churn, seen: next } };
  return { take: true, state: { churn: state.churn + 1, seen: next } };
}

/**
 * A GRID with nothing in it to give it height — every cell empty and unsized.
 *
 * A grid's rows are `minmax(min-content, 1fr)`: they SHARE whatever height the grid has. Given one (a grid
 * with its own `min-height`, or one stretched by its parent) that works out. Given none — a grid sitting in
 * a stack that hugs its content — there is nothing to share: the cells are 0, so the grid is 0, so the stack
 * holding it collapses with it. Measured: a Grid added inside a child stack left the stack under 8px.
 */
export function gridHasNothingToShare(node: BoxNode): boolean {
  if (node.layout !== "grid") return false;
  const cells = node.children ?? [];
  return cells.length > 0 && cells.every((c) => isEmptyBox(c) && c.minHeight == null && c.height == null);
}

/**
 * Does this box hold nothing that gives it height?
 *
 * Broader than `isEmptyBox`, and the difference is the case it exists for: a stack whose only content is a
 * DIVIDER is not empty, but a divider is a 2px line, so the stack came out 2px tall. Correct arithmetic and
 * useless in practice — at 2px the box cannot be clicked, selected or dragged by any of its handles, which
 * is the same "too small to grab" failure the empty-box floor was written for.
 *
 * Recursive, because the wrapping is: `normalizeRowBands` puts every child of a content container inside a
 * band of its own, so the thing directly under a stack is usually another container rather than the divider.
 */
export function holdsNothingTall(node: BoxNode): boolean {
  if (!isContainer(node)) return NO_HEIGHT_OF_ITS_OWN.has(node.type);
  const kids = node.children ?? [];
  /**
   * AN EMPTY CONTAINER IS NOT A THIN LINE, and conflating the two broke a deliberate rule.
   *
   * Written first as "no children, or every child holds nothing tall", this returned true for a box holding
   * an EMPTY GRID — the grid's cells have no children, so the whole chain read as height-less and the box
   * got a floor. That contradicts a contract with its own tests: "a box holding an empty grid shrinks too —
   * its cells' hints do not hold it open", which exists so a box can be dragged small.
   *
   * Emptiness is `isEmptyBox`'s question and is answered elsewhere. This one is narrower: does the box hold
   * something that DRAWS but has no height — a divider — and nothing else? An empty box is not that.
   */
  if (!kids.length) return false;
  return kids.every(holdsNothingTall);
}

// ── See-through ─────────────────────────────────────────────────────────────
//
// CSS `opacity` is a GROUP operation: it fades the element and everything inside it, and a child cannot opt
// out — no value of `opacity` on a child can undo a parent's. That is not what "make this grid see-through"
// means to anyone. What they mean is "let the page show through THIS BOX", with the cards and words inside it
// untouched.
//
// So a box's see-through is applied to ITS OWN PAINT — the background, the overlay, the border — by putting
// the alpha into those colours. Nothing inside is affected, at any depth, and the rule is the same for every
// box: a child made see-through protects its own content exactly as its parent does.
//
// `fadeContents` is the opt-in for the other meaning, and it IS real CSS opacity: fade this box and
// everything in it, from here down. One box's choice, not something inherited by accident.

/** A box holding CONTENT fades only its own paint; anything else (an element, or `fadeContents`) fades whole. */
export function fadesPaintOnly(node: BoxNode): boolean {
  if (node.opacity === undefined || node.opacity === 100) return false;
  if (node.fadeContents) return false;
  return isContainer(node) || node.type === "component";
}

/** The alpha a box's own paint is drawn at: 0–1, and 1 whenever the fade is whole-box or absent. */
export function paintAlpha(node: BoxNode): number {
  return fadesPaintOnly(node) ? Math.max(0, Math.min(100, node.opacity ?? 100)) / 100 : 1;
}

/** The `opacity` a box actually publishes — only when the fade is meant to take the contents with it. */
export function boxOpacity(node: BoxNode): number | undefined {
  if (node.opacity === undefined || node.opacity === 100) return undefined;
  return fadesPaintOnly(node) ? undefined : node.opacity / 100;
}

/**
 * One colour, drawn at `alpha`. Handles the three things a colour can be here: a `gradient:a:b` pair, a
 * token/`var()`/named colour, and a hex.
 *
 * `color-mix(in srgb, C x%, transparent)` is the general form and works for a var() or a named colour, which
 * cannot be picked apart. A hex is converted directly — shorter, and it survives anywhere `color-mix` might
 * not (a very old browser opening an exported page renders a plain rgba instead of nothing).
 */
export function fadeColor(color: string, alpha: number): string {
  if (alpha >= 1) return color;
  if (color.startsWith("gradient:")) {
    const [, a, b] = color.split(":");
    return `gradient:${fadeColor(a ?? "#000", alpha)}:${fadeColor(b ?? "#000", alpha)}`;
  }
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].split("").map((c) => c + c).join("") : hex[1];
    const n = parseInt(h, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${Math.round(alpha * 1000) / 1000})`;
  }
  return `color-mix(in srgb, ${color} ${Math.round(alpha * 1000) / 10}%, transparent)`;
}

/**
 * A box's paint colours, already faded — the ONE place both the canvas and the export get them from.
 *
 * When the box paints an IMAGE the whole background stack moves to a `::before` layer that carries the
 * opacity itself (see `paintLayerCss`), so the background and overlay are handed back EMPTY here: leaving
 * them on the element would paint the stack twice, once faded and once faded again. The border is not part
 * of the background stack, so it always fades in its own colour.
 */
export function fadedPaint(node: BoxNode): { background?: string; bgOverlay?: string; borderColor?: string } {
  const a = paintAlpha(node);
  const border = a >= 1 ? node.borderColor : node.borderColor ? fadeColor(node.borderColor, a) : undefined;
  if (paintsViaLayer(node)) return { background: undefined, bgOverlay: undefined, borderColor: border };
  if (a >= 1) return { background: node.background, bgOverlay: node.bgOverlay, borderColor: border };
  return {
    background: node.background ? fadeColor(node.background, a) : undefined,
    bgOverlay: node.bgOverlay ? fadeColor(node.bgOverlay, a) : undefined,
    borderColor: border,
  };
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
    /**
     * `height: "auto"` — NOT a stored pixel. A picture's shape is a fact to be discovered, not a default.
     *
     * It used to be born carrying `260px`, and because `imageSizing` rightly lets a stated height win, that
     * birth default beat the photograph's own measured shape for ever. Measured through the real route:
     * add an Image block from the menu, upload a 4:3 photograph, and the block still said `260px` while
     * `imgW: 4, imgH: 3` sat beside it unused — rendered 1024×260, cropped to a letterbox at every screen
     * size. The very same photograph DROPPED onto the canvas came out at its natural 4:3, because that path
     * passes `height: "auto"` explicitly. Two routes, two answers, and the common one was wrong.
     *
     * `"auto"` is not a size: `sizeToCSS` returns undefined for it, so `imageSizing` still falls back to the
     * 260px letterbox while the shape is genuinely unknown, and still crops to any height the user types.
     * All that changes is that a shape we DO know is no longer overruled by a number nobody chose.
     */
    case "image": return { ...base, src: "", width: "100%", height: "auto", ...overrides };
    // 315px was the 16:9 height of a 560px embed. In rem it follows the reader, like every other size here.
    case "video": return { ...base, src: "", width: "100%", height: remLen(315), ...overrides };
    case "icon": return { ...base, icon: "Star", fontSize: 32, ...overrides };
    case "divider": return { ...base, width: "fill", ...overrides };
    case "list": return { ...base, listStyle: "bullet", listItems: ["First item", "Second item", "Third item"], fontSize: 16, ...overrides };
    case "embed": return { ...base, width: "100%", height: "260px", html: "", ...overrides };
    case "spacer": return { ...base, width: "100%", height: remLen(48), ...overrides };
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
 * A box's whole background stack — overlay over image over base fill — as one style object.
 *
 * THE ONE COMPOSER. The canvas and the exporter each had their own copy of this, character for character,
 * which is the shape every canvas≠export bug in this project has taken. It is also what the see-through
 * PAINT LAYER needs: to fade a background image you have to reproduce the stack exactly, and a third copy
 * would have been a third thing to keep in step.
 *
 * `colors` decides which values are read — the faded ones for the element, the raw ones for a paint layer
 * that carries its own opacity.
 */
export function backgroundCss(node: BoxNode, colors?: { background?: string; bgOverlay?: string }, forLayer = false): CSSProperties {
  // When the paint has moved to a `::before`, the ELEMENT paints nothing: the image layer is composed from
  // `node.bgImage` rather than from the colours, so emptying the colours alone left the box still drawing the
  // photograph at full strength underneath the faded copy on the layer — the same picture, twice.
  if (!forLayer && paintsViaLayer(node)) return {};
  const c = colors ?? { background: node.background, bgOverlay: node.bgOverlay };
  const s: CSSProperties = {};
  const layers: string[] = [];
  const asGradient = (v: string) => { const css = colorToCSS(v); return css.startsWith("linear-gradient") ? css : `linear-gradient(${css}, ${css})`; };
  if (c.bgOverlay) layers.push(asGradient(c.bgOverlay));
  if (node.bgImage) layers.push(bgImageLayer(node.bgImage)); // gradient/pattern passes through; URL gets url("…")
  const baseGrad = c.background?.startsWith("gradient:");
  if (baseGrad && !node.bgImage) layers.push(colorToCSS(c.background!));
  if (layers.length) {
    s.backgroundImage = layers.join(", ");
    if (node.bgImage) {
      s.backgroundSize = node.bgTile ?? (node.bgSize ?? "cover");       // a pattern tiles at its tile size…
      s.backgroundPosition = node.bgPosition ?? (node.bgTile ? "0 0" : "center");
      s.backgroundRepeat = node.bgRepeat ?? (node.bgTile ? "repeat" : "no-repeat"); // …and repeats; a photo covers once
      if (node.bgAttach) s.backgroundAttachment = node.bgAttach;
    } else { s.backgroundPosition = "center"; s.backgroundRepeat = "no-repeat"; }
  }
  if (c.background && !baseGrad) s.backgroundColor = colorToCSS(c.background);
  return s;
}

/**
 * A background IMAGE cannot be faded by putting alpha in a colour — there is no such thing as a per-layer
 * opacity in CSS, and every alternative that works on the element itself (`opacity`, `mask`, `filter`) takes
 * the contents down with it, which is the whole thing we are avoiding.
 *
 * So the paint moves off the element and onto its `::before`, which carries the opacity by itself. The
 * pseudo-element is not a child, so nothing inside the box is touched, and neither renderer needs an extra
 * `<div>`: both already emit per-node CSS rules (the canvas injects one scoped stylesheet, the export writes
 * `.bx-…` rules), so this is the same rule text in both places.
 */
export function paintsViaLayer(node: BoxNode): boolean {
  return fadesPaintOnly(node) && !!node.bgImage;
}

/**
 * The `::before` rule that carries a see-through box's paint, plus what the box itself needs for it to sit
 * in the right place. Empty for every box that does not need a layer.
 *
 * The layer sits one tier BELOW the flow (`PAGE_Z.behind`), which puts it behind the box's own content;
 * `isolation:isolate` then makes the box a stacking context, so that tier stops HERE and the layer can never
 * keep falling until it lands behind some ANCESTOR's background, where it would be invisible. `inset:0` and
 * `border-radius:inherit` keep it exactly the shape of the box, including rounded corners and any per-corner
 * radius, and `pointer-events:none` keeps it out of the way of clicks and drags.
 */
export function paintLayerCss(selector: string, node: BoxNode): string {
  if (!paintsViaLayer(node)) return "";
  const bg = backgroundCss(node, undefined, true); // the RAW colours — the layer own opacity does the fading
  const decls = Object.entries(bg)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`)
    .join(";");
  const a = paintAlpha(node);
  return `${selector}{position:relative;isolation:isolate}`
    + `${selector}::before{content:"";position:absolute;inset:0;z-index:${PAGE_Z.behind};pointer-events:none;`
    + `border-radius:inherit;opacity:${a};${decls}}`;
}

/** Every paint-layer rule in a tree, for the one stylesheet the canvas injects. */
export function treePaintLayerCss(node: BoxNode, scopeFor: (id: string) => string): string {
  return paintLayerCss(scopeFor(node.id), node)
    + (node.children ?? []).map((c) => treePaintLayerCss(c, scopeFor)).join("");
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
  const wholeFade = boxOpacity(node); if (wholeFade !== undefined) d.push(`opacity:${wholeFade}`);
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
  /**
   * AT THE WALL THE EDGE STOPS. It does not grow out of the far side.
   *
   * This used to add whatever was dragged past the page top onto the HEIGHT, so the block kept growing —
   * downward. The reasoning was that a handle which does nothing feels broken, and a block flush against
   * the page top is the common case for a first block. Measured on exactly that block: dragging the top
   * edge UP by 80px moved the top edge 0px and the BOTTOM edge 80px DOWN. The user is holding one edge and
   * watching the opposite one move away from them, in the opposite direction to the drag.
   *
   * RULE 19 settles it, and settles it against the old reading: "the edge you grab is the ONLY one that
   * moves; the opposite edge stays fixed… where the partner cannot give, the edge stops; it does not grow
   * out of the far side." A dead handle at the wall is the honest answer — there is nowhere above the page
   * for the edge to go, and growing the other end is not the same gesture.
   */
  return { top, height: Math.round(startBotPx - top) };
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

/**
 * Does anything in this tree hold itself FIXED? The same question `treeHasToast` asks, for the same reason.
 *
 * A toast has been `position: fixed` all along, and the canvas already answers it by making the page root a
 * containing block — so the toast pins to the PAGE FRAME while editing and to the viewport once published.
 * Identical CSS, and it can never float over the editor's own toolbar where nobody could click it.
 *
 * A user-held fixed block needs exactly that, so it asks through the same door rather than growing a second
 * mechanism beside it. The irony is worth keeping: a containing block is what BREAKS fixed by accident
 * everywhere else in this file, and it is what CONTAINS it on purpose here.
 */
export function treeHasFixedHold(node: BoxNode): boolean {
  if (node.pin && node.hold === "fixed") return true;
  return (node.children ?? []).some(treeHasFixedHold);
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
/**
 * Put `node` UNDER (or over) the block `id`, by turning that block's SLOT into a vertical Stack.
 *
 * "One tall block on the left, two stacked beside it on the right" is an ordinary page and the model has
 * always been able to hold it — a row band whose second child is a column of two. What there was no way to
 * DO was reach it: a band is a row, a row only knows side-by-side, so a block dropped under one of its
 * columns was read as "another column" and wedged in beside. The model reached further than the controls,
 * and the lever for that is always more controls, never more model.
 *
 * So the column is created on demand: the block you aimed under is lifted into a new Stack together with the
 * newcomer, and the Stack takes its place — same slot, same width, so nothing else on the line moves. Its
 * NEIGHBOUR is not touched at all, which is the property that makes this safe to do automatically.
 *
 * The inner block goes to `width: 100%` because it now measures against the Stack rather than the band; the
 * Stack carries the width it used to have, so the line is unchanged.
 */
export function stackWithBlock(root: BoxNode, id: string, node: BoxNode, before = false): BoxNode {
  const target = findBox(root, id);
  const info = findParent(root, id);
  if (!target || !info) return root;
  const column = createContainer("column", { width: target.width ?? "100%", padding: 0, gap: 0, align: "stretch", justify: "start" });
  const inner: BoxNode = { ...target, width: "100%" };
  /**
   * THE NEWCOMER TAKES THE SPACE THAT IS ACTUALLY THERE.
   *
   * You aim at a gap under a short column because you can SEE the gap — so arriving at a courtesy 8rem and
   * leaving the rest of it empty is the builder ignoring the thing you pointed at. `height: "fill"` is the
   * model's existing way of saying "take what is left on this axis" (`flexForWidth` turns it into
   * `1 1 0%`), so the block fills the column down to the height its taller neighbour sets.
   *
   * Only when the block has no height of its own: a size somebody set is a decision, and this must not
   * overrule one. Dragging its height afterwards writes a real height and takes the fill off — which is the
   * user's own statement of the rule: it should fill "unless I resize the height of it".
   */
  /**
   * THE BANDS ARE BUILT HERE, and that is what makes the fill land on the right axis.
   *
   * `normalizeRowBands` wraps every child of a content container in a row band of its own. Inside a row,
   * height is the CROSS axis — so `height: "fill"` written on the BLOCK is not a main-axis instruction at
   * all, and the band around it stayed `flex: 0 0 auto` and zero pixels tall. The block was there, correct,
   * and invisible.
   *
   * Making the bands here puts the fill on the band, where height IS the main axis of the column holding
   * it, and leaves the block to stretch inside its band as any block does.
   */
  // BOTH halves, because the two axes are different questions. The BAND takes the leftover height of the
  // column (`height: "fill"` is main-axis there), and the block takes the height of its band (`100%` is
  // cross-axis there). With only the first the band filled and the block sat 40px tall inside it, which
  // looks exactly like the bug it was meant to fix.
  const fills = !(node.height || node.minHeight);
  const newBand = makeRowBand([fills ? { ...node, height: "100%" } : node], 0);
  if (fills) newBand.height = "fill";
  const keepBand = makeRowBand([inner], 0);
  column.children = before ? [newBand, keepBand] : [keepBand, newBand];
  return insertBox(removeBox(root, id), info.parent.id, info.index, column);
}

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
  /**
   * A ROW THAT WRAPS IS ALLOWED TO ADD UP TO MORE THAN 100%. That is what wrapping IS.
   *
   * This rescaled every row whose widths exceeded the line, to stop a row running off the page. For a row
   * that cannot wrap that is right. For a row band it is exactly wrong, because a band wraps
   * (`flexWrap: node.wrap || node.rowBand ? "wrap"`), so the overflow was never going to leave the page —
   * it was going to become a second line.
   *
   * The cost was that a block could not be widened past its neighbours at all: push the boundary and the
   * sum went over 100, this rescaled everything back down, and the drag was undone on commit. "Make this
   * one full width and let the other drop below" — the ordinary way a person rearranges two columns — was
   * unreachable, and so was its reverse, because nothing had moved to reverse.
   *
   * Leaving a wrapping row alone makes both directions fall out of the layout itself: widen and the
   * neighbour goes to the next line; narrow and it comes back, with nothing remembered and nothing moved.
   */
  if (row.rowBand || row.wrap) return row;
  return fitRowWidths(row);
}

/**
 * Scale a row's widths down so they fit on ONE line — the old `clampRowWidths`, now called deliberately
 * instead of on every commit.
 *
 * The difference is everything. As an invariant it made the wrap impossible: widen a block past its
 * neighbours and the sum went over 100, this pulled it straight back, and the drag was undone on commit.
 * As a step taken at INSERT time it does the job it was always for — a block dropped beside one that
 * already fills the line has to come from somewhere, so the line is shared out — while a width the user
 * dragged is left exactly as they set it, free to push a neighbour onto the next line.
 */
export function fitRowWidths(row: BoxNode): BoxNode {
  const kids = row.children ?? [];
  if (!kids.length) return row;
  const sum = kids.reduce((s, k) => s + widthPct(k.width), 0);
  if (sum <= 100) return row;
  const f = 100 / sum;
  return { ...row, children: kids.map((k) => ({ ...k, width: `${Math.max(3, Math.round(widthPct(k.width) * f))}%` })) };
}

/** Share out the widths of the band `bandId` so its children fit on one line. Used when a block is added. */
export function fitBand(root: BoxNode, bandId: string): BoxNode {
  const band = findBox(root, bandId);
  if (!band?.rowBand) return root;
  const fitted = fitRowWidths(band);
  return fitted === band ? root : updateBox(root, bandId, { children: fitted.children });
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
  // Remembered BEFORE the card sizing is written over it — the whole point is to be able to undo exactly this.
  const was = findBox(root, id);
  const floatFrom: NonNullable<BoxNode["floatFrom"]> = {
    width: was?.width, height: was?.height, minHeight: was?.minHeight, clip: was?.clip,
    sized: sizing.height as string | undefined, sizedMin: sizing.minHeight as number | undefined,
  };
  let next = moveBox(root, id, targetParentId, tp?.children?.length ?? 0);
  next = updateBox(next, id, {
    floatFrom,
    // A free-floating layer is a fixed-size CARD: a DEFINITE height (not a min-height floor that content can grow
    // past) so the box, its parent's reserved height, and the export all agree on exactly how tall it is. `clip`
    // lets the width AND height handles shrink it below its content.
    position: "absolute", left: geom.left, top: geom.top, zIndex: z, ...sizing,
    alignSelf: undefined, margin: undefined, marginTop: undefined, marginRight: undefined, marginBottom: undefined, marginLeft: undefined,
  });
  return next;
}

/** Return `id` to the normal flow (drop its floating position); normalizeRowBands re-docks it as a row.
 *  Undoes the float's side-effects so nothing leaks back into the flow: the auto-applied `clip` is cleared and a
 *  COMPONENT returns to full width (its compact fixed px width existed only for the floating card).
 *
 *  IT TOUCHES NOTHING BUT THIS BOX. Returning a block to the flow used to also wipe its PARENT's `minHeight`,
 *  to "drop the reserved height so no tall empty gap remains" — but no such reservation is ever stored.
 *  `floatingReserve` is DERIVED at render time (`max(node.minHeight, floatingReserve(node))`), so the reserve
 *  disappears by itself the moment nothing inside is floating. What that line actually deleted was the height
 *  the user had set on the section, months earlier and for their own reasons: float a grid inside a 400px
 *  section, return it, and the section collapsed to its content — so the grid came back at 60px instead of the
 *  400 it had filled. Floating and un-floating is a round trip; it has to land where it started. */
/**
 * PUT IT BACK — and putting it back is a ROUND TRIP, never an edit.
 *
 * This used to delete the height AND the `minHeight`, on the reasoning that both were the float's doing.
 * Only one of them was: floating writes a definite height and clears the block's own floor, so deleting
 * both threw away a size the user had set long before they ever floated it. Measured on a 120px stack:
 * float, put back, and it returned 49px tall — the height of the text inside it. Float it again and the
 * next round trip started from 49. An empty box ends up with nothing left to see or to click, which is
 * what "I don't see the stack any more" was.
 *
 * So `floatFrom` is restored, with one exception that matters more than the rule: if the block was RESIZED
 * while it floated, that size is the user's own and is kept — as a floor, so content can still grow it.
 *
 * The pin's free placement goes too. `pinX`/`pinY` are where a FLOATING block holds on screen; back in the
 * layout the block holds against an edge instead, and stale coordinates would place it somewhere nobody
 * chose. The pin itself is kept: "floats on screen" is a decision about scrolling, not about placement.
 */
export function unfloatBox(root: BoxNode, id: string): BoxNode {
  const node = findBox(root, id);
  const patch: Partial<BoxNode> = {
    position: undefined, left: undefined, top: undefined, zIndex: undefined, clip: undefined,
    minHeight: undefined, height: undefined, floatFrom: undefined, pinX: undefined, pinY: undefined,
  };
  const was = node?.floatFrom;
  if (was) {
    const resized = node?.height !== was.sized || node?.minHeight !== was.sizedMin;
    if (resized) {
      // Their size, kept as a floor rather than a hard height, so the box can still grow with its content.
      // `lenToPx` is this file's own converter — it understands rem as well as px, which is the whole
      // reason it exists: reading only px silently treated every rem height as "no height".
      const kept = lenToPx(node?.height, rootFontPx());
      patch.minHeight = node?.minHeight ?? (kept != null ? Math.round(kept) : was.minHeight);
    } else {
      patch.width = was.width;
      patch.height = was.height;
      patch.minHeight = was.minHeight;
      patch.clip = was.clip;
    }
  }
  // A COMPONENT returns to full width — its compact fixed px width was only ever for the card.
  if (node?.type === "component") patch.width = "100%";
  return updateBox(root, id, patch);
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
  // A stored `null` is a CLEAR made at this rung (see `updateBoxResponsive`): it resolves to the default,
  // which is ABSENT — never to a null value that a `!== undefined` check downstream would take for a setting.
  for (const k of Object.keys(ov) as (keyof ResponsiveOverride)[]) if (ov[k] === null) ov[k] = undefined;
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
  /**
   * A CLEAR AT A RUNG IS STORED AS `null`, because `undefined` does not survive being saved.
   *
   * Every control that goes back to its default writes `undefined` — "Scrolls away", "Fit content", no
   * entrance. At the base that is right: absent IS the default. At a rung it must OVERRIDE the base, and
   * `{ pin: undefined }` did, for exactly as long as the tab stayed open: `JSON.stringify` drops the key, so
   * the save held `{ phone: {} }` and the reload brought the desktop's pin back onto the phone. "Stop pinning
   * this on phones" — the spec's whole answer to a header eating a small screen — could not be kept.
   * `resolveResponsive` turns the `null` back into absent, so nothing downstream ever sees one.
   */
  const stored = Object.fromEntries(Object.entries(patch).map(([k, v]) => [k, v === undefined ? null : v])) as ResponsiveOverride;
  return updateBox(root, id, { responsive: { ...node.responsive, [bp]: { ...prev, ...stored } } });
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

/**
 * Preset drop shadows (elevation scale). Kept subtle + theme-neutral (soft black).
 *
 * IN `rem`, LIKE EVERY OTHER SIZE. An elevation is part of the design: when a reader enlarges their browser
 * text the card grows, and a shadow still measured in device pixels becomes a hairline under a large card
 * rather than the lift it was drawn to be. `1px` offsets and spreads are left alone — a hairline is one
 * device pixel by definition, which is the one case the units rule admits px for.
 */
/**
 * The elevation scale — ONE definition, which lives with the other design tokens and is re-exported here.
 *
 * It was declared in both places, byte for byte. Moving shadows to rem changed only this copy, so every block
 * lifted in rem while every design-system component (`--eu-shadow-*`) stayed in pixels — invisible until a
 * card and a section sat side by side at a large text size. The name stays so nothing that imports it has to
 * change; the values can no longer diverge because there is only one set.
 */
export const SHADOW_CSS: Record<NonNullable<BoxNode["shadow"]>, string> = SHADOW_SCALE;

/** Per-corner border-radius (px) → CSS, falling back to the all-corners `radius`. Undefined when none set. */
export function radiusCSS(node: BoxNode): string | undefined {
  const r = node.radius;
  const tl = node.radiusTopLeft ?? r, tr = node.radiusTopRight ?? r, br = node.radiusBottomRight ?? r, bl = node.radiusBottomLeft ?? r;
  if (tl == null && tr == null && br == null && bl == null) return undefined;
  /**
   * IN `rem`, BECAUSE A CORNER IS PART OF THE DESIGN AND THE DESIGN FOLLOWS THE READER.
   *
   * This emitted raw pixels for its whole life, and because rule 3 makes it the ONE resolver every block and
   * every future component goes through, that was every rounded corner in the product pinned to a size that
   * ignores a reader who has enlarged their browser text — while the text beside it grew. A 16px radius on a
   * card whose type has doubled is not the same design; it is a tighter one.
   *
   * Fixing it in the single resolver is the whole value of having a single resolver: nothing had to be found,
   * and a component added tomorrow inherits it by existing.
   */
  return `${remLen(tl ?? 0)} ${remLen(tr ?? 0)} ${remLen(br ?? 0)} ${remLen(bl ?? 0)}`;
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
    [TYPO_VAR.size]: textUnit(), // fluid like everything else, but never below a readable floor — see `textUnit`
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
/**
 * How narrow a cell may get before the row must shed a column, in rem.
 *
 * `12rem` is 192px at a default browser, which is about the narrowest a card with a heading and a line of
 * text reads properly. In REM rather than px so the whole decision follows the reader's own text size: a
 * person who has enlarged their browser text gets fewer columns sooner, which is the point of the rule.
 */
export const CELL_MIN_REM = 12;

/**
 * How many blocks a row puts ACROSS at the stored count — which is not the track count.
 *
 * A twelve-track row of span-4 cells is THREE across, and the difference is the whole reason the old cap was
 * wrong: it reduced tracks, and reducing 12 tracks to 2 turns three cards into two.
 */
function acrossAt(node: BoxNode, cols: number, bp: Breakpoint): number {
  const kids = node.children ?? [];
  // RESOLVED at this rung: a cell can carry a per-rung span, and the count across is what decides whether a
  // cell would be too narrow. Reading the base span would answer for a layout that is not on screen.
  const spans = kids.map((c) => Math.max(1, Math.round(resolveResponsive(c, bp).colSpan ?? 1)));
  const span = spans.length ? Math.min(...spans) : 1;
  return Math.max(1, Math.floor(cols / span));
}

export function gridColumnsAt(node: BoxNode, bp: Breakpoint = "base"): number {
  const cols = gridColumns(node);
  if (setAtRung(node, "columns", bp)) return cols;
  if (bp === "phone") return 1;
  if (bp === "tabletPortrait") {
    /**
     * THE CAP IS ABOUT HOW NARROW A CELL WOULD GET, NOT ABOUT A NUMBER — and capping by the number was wrong.
     *
     * `Math.min(cols, 2)` sheared every row to two across on a tablet held upright, whatever it held. For a
     * twelve-cell row that is right and necessary. For a THREE-CARD row — the commonest layout on a school
     * site, and Scenario B of this project's own guide — it is not: three cards do not tile two columns, so
     * one is orphaned and the result is wrong whichever way the orphan is treated. Both were rendered and
     * looked at, at 760px:
     *
     *   • orphan left as it fell → half a row of the section's background beside it. Reported, with a
     *     screenshot, as the grid "not fully expanding on the width".
     *   • orphan stretched to fill → a full-width card carrying one line of text, twice the width of its
     *     siblings. It reads as a mistake rather than a design.
     *
     * And three across at that width was neither: three equal 250px cards, balanced, nothing left over. The
     * cells were never too narrow, so there was never anything to fix by capping them.
     *
     * So the question asked is the one the cap always meant: at the NARROWEST width this rung covers, would a
     * cell fall below what can be read? If it would not, the row keeps its shape. `RUNG_PX.tabletPortrait` is
     * that width, taken from the ladder rather than re-typed.
     */
    const across = acrossAt(node, cols, bp);
    const cellPx = RUNG_PX.tabletPortrait / across;
    if (cellPx >= CELL_MIN_REM * 16) return cols;
    return Math.min(cols, 2);
  }
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
/**
 * Has the RESPONSIVE LADDER narrowed this grid's track at `bp` — rather than the user stating the count?
 *
 * The distinction decides whether the cells' stored placement is still speaking the same language as the
 * track they are being placed into. Shared, so the canvas, the export and the guards give one answer.
 */
export function gridReflowsAt(parent: BoxNode, bp: Breakpoint = "base"): boolean {
  // Stated AT this rung — so the count is not the base's, whatever number it happens to be.
  if (setAtRung(parent, "columns", bp)) return true;
  return gridColumnsAt(parent, bp) !== gridColumns(parent); // …or the ladder narrowed it by itself
}

/**
 * A child's effective span and start at a rung, in that rung's own track units.
 *
 * WHEN THE LADDER NARROWS THE TRACK, EXPLICIT PLACEMENT IS DROPPED AND THE CELLS AUTO-FLOW.
 *
 * This is the half that was missing, and it made blocks VANISH. Spans were re-fitted proportionally, but a
 * `colStart` written in twelve-column units was merely rescaled and then clamped into the narrow track — and
 * a clamp is not an injection. Measured on three cells at columns 1 / 5 / 9 (span 4), reported by a user who
 * watched the top of their page empty out as they dragged the preview narrower:
 *
 *   1400px → columns 1, 5, 9     three cells across, correct
 *    820px → columns 1, 2, 2     the second cell sits UNDER the third — one block invisible
 *    580px → columns 1, 1, 1     all three in one cell — only the LAST one can be seen
 *
 * Nothing overflowed and nothing errored: two blocks were simply painted on top of each other, which is
 * indistinguishable from having been deleted. Auto-placement cannot rescue them, because placement that is
 * stated explicitly is honoured exactly — including when it is stated on top of something else.
 *
 * So at a rung the ladder narrowed, a placed cell becomes an auto-placed one and the grid flows it after the
 * cell before it — which is precisely what an UNPLACED cell has always done correctly at the same widths.
 * The span still rescales (a third of twelve is a third of two), so the row keeps its proportions; only the
 * absolute position, which can no longer be expressed in the narrower track, is given up.
 *
 * WHOSE UNITS IS A PLACEMENT WRITTEN IN? The track it was AUTHORED AGAINST — which is the cell's own
 * question, never the row's.
 *
 * This was first written as "the user's own column count at that rung is not touched: there they are already
 * speaking in the rung's units." That is true of the COUNT and false of the CELLS. Setting Columns on a
 * device is a control the guide actively recommends — and nobody restates every cell's *Start at column*
 * while doing it. So a row of three cells at columns 1 / 5 / 9 of twelve, given `columns: 3` on a tablet,
 * had all three starts taken at face value and clamped into a three-track row:
 *
 *     span  = min(3, 4)               = 3   → every cell fills the row
 *     start = min(3 − 3 + 1, 1|5|9)   = 1   → every cell begins in column 1
 *
 * All three landed in the same cell, drawn one on top of another, and only the last could be seen. Swept
 * across every width, it began at 820px and never recovered. It is the same defect as the ladder case
 * below, reached by the one route that had been deliberately exempted from the fix.
 *
 * So the rule is per-CELL, and it is the only rule that holds in both directions: a span or start the CHILD
 * states at this rung is already in this rung's units and is honoured exactly; one inherited from the base
 * is written in the BASE row's units, so when the track differs the span is rescaled proportionally and the
 * start is given up — the cell auto-flows, which is what an unplaced cell has always done correctly.
 */
export function gridPlacementAt(parent: BoxNode, child: BoxNode, bp: Breakpoint = "base"): { track: number; span: number; start: number | null } {
  const track = gridColumnsAt(parent, bp);
  const stored = gridColumns(parent);
  const reflow = gridReflowsAt(parent, bp);
  /**
   * `stored` IS ALREADY THE RUNG'S COUNT when the row states one there — `gridColumnsAt` is handed a
   * RESOLVED node, so `node.columns` has been overwritten by the override and the base number is gone. The
   * first attempt at this fix compared `track` with `stored`, found them equal, concluded nothing had
   * changed, and left every placement at face value: the bug survived the fix untouched.
   *
   * There is nothing to rescale proportionally in that case, so the span is only CLAMPED to the track. A
   * quarter of twelve becomes the whole of a three-track row, the starts are given up, and the cells flow
   * one per row — wider than ideal, and every one of them visible, which is the property that matters.
   */
  const fit = (v: number) => (reflow && track !== stored && !setAtRung(child, "colSpan", bp) ? Math.max(1, Math.round((v * track) / stored)) : v);
  const span = Math.min(track, fit(Math.max(1, Math.round(child.colSpan ?? 1))));
  if (child.colStart == null) return { track, span, start: null };
  if (reflow && !setAtRung(child, "colStart", bp)) return { track, span, start: null };
  // Clamped to a track the block can actually FINISH inside, so it never lands in an implicit column and
  // stretches the row past the edge of the screen.
  const raw = Math.round(child.colStart);
  return { track, span, start: Math.min(track - span + 1, Math.max(1, raw)) };
}

/**
 * THE LAST ROW FILLS. When the responsive ladder narrows a grid's track, the cells must still tile the row.
 *
 * Reported from a real page, with a screenshot: a 3×3 grid inside a dark stack, previewed narrower, showed a
 * column of content with the stack's background filling the rest — "the three rows and three columns doesn't
 * fully expand on the width". Measured on the exported page across ten widths, and it is not that layout, it
 * is ARITHMETIC:
 *
 *     width 620–880 → the ladder caps the track at 2 (tablet portrait)
 *     3 cards        → 2 up, 1 alone, HALF A ROW of background
 *     9 cells        → 4 rows of 2, 1 alone, same
 *     4 cards        → 2 up, 2 up, fills — which is why nobody had seen it
 *
 * Any count that does not divide by the narrowed track leaves an orphan, and that includes the three-card row
 * this project's own guide teaches as Scenario B. The 2-across cap is deliberate and tested ("two up, and the
 * third wraps"), so the fix is not to change the ladder: the wrapped cell STRETCHES to fill what is left.
 *
 * ONLY WHEN THE LADDER REFLOWED, never at a width the user laid out themselves. A row of two span-4 cells in a
 * twelve-column grid leaves a third of the row empty on purpose, and filling that would be the builder
 * arguing with a design. `gridReflowsAt` is the same test every other rung-aware resolver asks.
 *
 * Returns the span this child should take, which is its ordinary span except for the one cell that ends a
 * short final row.
 */
export function gridSpanAt(parent: BoxNode, child: BoxNode, bp: Breakpoint = "base"): number {
  const own = gridPlacementAt(parent, child, bp).span;
  if (parent.layout !== "grid") return own;
  /**
   * THE LADDER NARROWED IT, AND THE PERSON DID NOT ASK FOR THIS COUNT — both halves, and the first version of
   * this line had neither.
   *
   * It asked `gridReflowsAt`, which looked like the right question and is not: `setAtRung(node, key, "base")`
   * returns TRUE unconditionally, because the base IS the node's own value. So `gridReflowsAt` is true at base
   * for every grid that has ever been given a column count — harmless where it is used for PLACEMENT, which
   * also requires the track to have actually changed, and not harmless here. Measured: a deliberate
   * two-thirds row at 1440px had its second cell stretched to `span 8` and the empty third filled in.
   *
   * The guard that caught it is the one written for exactly this — "a layout the person made themselves is
   * left alone" — which is why it was written at the same time as the rule rather than afterwards.
   *
   * And a count stated AT a rung is a decision too: three columns asked for on a phone with four cells leaves
   * a short last row, and that is the person's arithmetic, not the ladder's.
   */
  const narrowed = !setAtRung(parent, "columns", bp) && gridColumnsAt(parent, bp) < gridColumns(parent);
  if (!narrowed) return own;
  if (isMasonry(parent, bp)) return own; // a masonry track is a measuring unit, not a row to fill
  const kids = (parent.children ?? []).filter((c) => !isFloating(c) && !resolveResponsive(c, bp).hidden);
  if (kids.length < 2) return own; // one cell already spans what it was given
  const track = gridColumnsAt(parent, bp);
  // The same walk `gridRowTracks` makes, so the two cannot disagree about where a row breaks.
  let used = 0;
  for (const c of kids) {
    const span = gridPlacementAt(parent, c, bp).span;
    if (used + span > track) used = 0;
    used += span;
  }
  if (used === 0 || used >= track) return own;      // the final row filled by itself
  if (kids[kids.length - 1].id !== child.id) return own; // only the cell that ends it stretches
  return Math.min(track, own + (track - used));
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
  // MASONRY has no rows to name. The track is a fine measuring unit rather than a row, so an explicit list —
  // one entry per "row", each `auto` or an even share — would both mean nothing and fight the unit.
  if (isMasonry(node, bp)) return null;
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

// ── MASONRY (Phase 2, the last item) ─────────────────────────────────────────
//
// ONE control, two mechanisms. In Arrange, on a grid: Row heights · (Even) (Follow the picture).
//
// `Even` is today's behaviour exactly — a saved page renders through the identical path, because `rowFlow` is
// absent on every node that exists. `Follow the picture` is masonry, and it is built in two layers:
//
//   B — the STATIC spans, always on. The row track becomes a fine measuring unit and each cell claims as many
//       units as its content is tall. Zero JavaScript, correct reading order, no cropping.
//   C — `rowMeasure`, opt in. A small script measures the real heights and corrects the spans.
//
// WHY NOT CSS `columns`, which is what "masonry" usually means: inside a `columns` container the twelve-column
// grid stops existing — no `grid-column`, so no spans, no offsets, no order, no edge-dragging. It is not a row
// option, it is a mode where everything else in Phase 2 switches off. (The reading order is fine, contrary to
// the usual telling: document order is preserved and reads coherently down each column. The real problem is
// that people SCAN a gallery left-to-right while the content runs top-to-bottom, so numbered captions and
// newest-first ordering read wrong.)

/**
 * The fine unit a masonry grid measures its rows in, in `rem`.
 *
 * Small enough that rounding a cell up to a whole number of units is invisible (half a step, ≤4px at the
 * default root size), large enough that a tall page does not ask the browser for thousands of tracks.
 * In `rem` rather than px so a reader who has enlarged their browser font gets a grid that enlarges with them
 * — the same reason the rung ladder is in `em`.
 */
// ── SHOW ONE AT A TIME ────────────────────────────────────────────────────────────────────────────────
//
// A pager built on CSS scroll-snap, with the navigation as REAL LINKS to REAL SECTIONS. What that buys,
// measured in a browser before any of it was written:
//   • swipe on touch, trackpad, and — once the strip is focusable — one page per arrow key, with the page
//     itself never moving. All of that with NO JavaScript whatsoever.
//   • every page in the document, in reading order, so a screen reader and a search engine get the words
//     whether or not anything runs.
//
// And the one thing it does NOT buy, which is why `pagerScript` exists: a bare anchor link nudges the
// whole page. Measured — 240px of vertical scroll even with the strip already entirely in view, 900px
// with it below the fold, because a fragment navigation scrolls every scrollable ancestor and not just
// the nearest one. `scroll-margin-block` does not suppress it (tried). Six lines of script do.

/** How a visitor is offered a way between pages. */
export type PagerNav = "dots" | "arrows" | "both" | "none";

/** Is this container showing one child at a time? */
export const isPager = (node: BoxNode): boolean => !!node.pager && isContainer(node);

/**
 * The id a page is reachable by — one function, so a dot's `href` and the page's `id` cannot drift.
 *
 * A bookmark the user set on the page WINS, because they chose it and may already have linked to it from
 * somewhere else. Only a page without one gets the generated id, and generating it from the node id means
 * it is stable across edits: renaming or restyling a page never breaks a link to it.
 */
export const pagerSlideId = (slide: BoxNode): string => slide.anchor || `slide-${slide.id}`;

/**
 * The container's own declarations when it is a pager.
 *
 * `grid-auto-columns: 100%` is what makes a page a PAGE — it fills the box regardless of what is in it, so
 * a slide with one line of text and a slide with a photograph are the same width and snap the same way.
 * `overflow-y: hidden` matters as much as the `x`: without it a tall page turns the strip into a
 * two-directional scroller and the snap points fight the vertical scroll.
 */
export function pagerStripCss(): CSSProperties {
  return {
    display: "grid",
    gridAutoFlow: "column",
    gridAutoColumns: "100%",
    gridTemplateColumns: "none", // a 12-column template underneath would fight the page columns
    overflowX: "auto",
    overflowY: "hidden",
    scrollSnapType: "x mandatory",
    // Smooth is set here and UNDONE for reduced motion in the shared sheet — CSS does not do that for us.
    // Measured: under `prefers-reduced-motion: reduce` the computed value was still `smooth`.
    scrollBehavior: "smooth",
  };
}

/** What a PAGE gets, as a child of a pager. */
export function pagerSlideCss(): CSSProperties {
  // `min-width: 0` because a grid item's automatic minimum is its content, which would let a wide page
  // push the strip wider than the box instead of scrolling inside it — the horizontal-scrollbar bug this
  // project has guarded against in four other places.
  return { scrollSnapAlign: "start", scrollSnapStop: "always", minWidth: 0 };
}

/**
 * The navigation, as ONE emitter both renderers use — the same arrangement as `alertActionsHTML`.
 *
 * Every control is a real `<a href="#slide-…">` to a real section, so with no script it still works: the
 * browser scrolls the strip to that page. The script upgrades it (see `pagerScript`); it is not required
 * by it. Styled inline rather than through a class so the markup is self-contained and identical in the
 * builder and the export with no stylesheet to keep in step.
 */
export function pagerNavHTML(node: BoxNode): string {
  if (!isPager(node)) return "";
  const nav = node.pagerNav ?? "dots";
  if (nav === "none") return "";
  const slides = node.children ?? [];
  if (slides.length < 2) return ""; // one page is not a pager; offering controls would be a lie
  const wants = (k: "dots" | "arrows") => nav === k || nav === "both";

  // A DOT IS A REAL LINK TO A REAL PAGE, and it works with nothing running: the browser scrolls the strip
  // to that section. The script only upgrades it (no page nudge, and it marks which one you are on).
  //
  // THEY ARE EMITTED EVEN WHEN ONLY ARROWS WERE ASKED FOR, and then hidden by the script. Arrows cannot
  // work without it — "one back from where I am" needs to know where you are — so an arrows-only nav with
  // no script rendered a bar containing two hidden arrows and nothing else: no way to move at all except
  // by swiping, and nothing whatsoever for a keyboard. The dots are the floor everything else stands on;
  // the moment the script runs it hides them and the user gets the arrows they chose.
  const fallbackOnly = !wants("dots");
  const dots = wants("dots") || wants("arrows")
    ? `<div${fallbackOnly ? " data-eu-pager-dots-fallback" : ""} style="display:flex;gap:.5rem;align-items:center">`
      + slides.map((s, i) =>
        // WHITE WITH A DARK RING, not `currentColor`, and not a theme token. These sit over a photograph
        // the user chose, so nothing the theme knows can predict what is behind them — and `currentColor`
        // is worse than it sounds here: a dot is an `<a>`, so it inherits the LINK colour, which came out
        // indigo on a dark navy hero. White reads on a dark photograph, the ring reads on a pale one, and
        // between them the pair is legible on any picture at all.
        `<a href="#${pagerSlideId(s)}" data-eu-pager-dot="${i}" aria-label="Show ${i + 1} of ${slides.length}"`
        + ` style="width:.7rem;height:.7rem;border-radius:999px;background:#fff;opacity:.55;`
        + `box-shadow:0 0 0 1px rgba(0,0,0,.45)"></a>`).join("")
      + `</div>`
    : "";

  // AN ARROW MEANS "one back from wherever I am", and no static href can say that — there is no current
  // page until something scrolls. So arrows ship HIDDEN and the script reveals them; with nothing running
  // a reader gets the dots, which are honest, instead of two buttons that jump somewhere arbitrary.
  //
  // Deliberately NO `display` in the inline style: an inline `display` beats the `hidden` attribute's UA
  // rule, so the thing would be hidden in name and visible on the page.
  const arrow = (dir: "prev" | "next") =>
    `<a href="#" hidden data-eu-pager-${dir} aria-label="${dir === "prev" ? "Show the previous one" : "Show the next one"}"`
    // Same reasoning as the dots: white on a soft dark disc, so it reads over any photograph, rather
    // than `currentColor` — which on an `<a>` is the link colour and came out indigo on a navy hero.
    + ` style="width:2.25rem;height:2.25rem;border-radius:999px;border:1px solid rgba(255,255,255,.7);`
    + `background:rgba(0,0,0,.3);text-align:center;line-height:2.15rem;text-decoration:none;color:#fff">`
    + `${dir === "prev" ? "&#8249;" : "&#8250;"}</a>`;
  const body = wants("arrows") ? `${arrow("prev")}${dots}${arrow("next")}` : dots;

  // `<nav>` rather than a bare div: it is a set of links between the parts of one thing, which is what the
  // landmark is for, and it gives a screen-reader user a way to skip past it.
  //
  // POSITIONED OVER THE BOTTOM OF THE BOX, not stacked underneath it. In flow it sat after the strip, so
  // on a FULL-SCREEN hero — the case this was built for — the strip was one whole screen tall and the dots
  // landed below the fold: a pager whose only visible control was off the screen. Over the box it works
  // for both shapes, and it is also simply what a carousel looks like. The box is `position: relative`
  // (see `containerStyle`), so this is its bottom edge and not the page's.
  // INSET FROM THE BOTTOM, and the number is not taste. A full-screen page is `100svh` measured from the
  // top of the VIEWPORT, but it starts below whatever the page puts above it — and the export puts a site
  // nav there. Measured on a real published page at 1280×800: the nav is 57px, so the page's bottom edge
  // lands 65px past the fold and controls flush against it were entirely INVISIBLE to a visitor who had
  // not scrolled. A rotating hero whose only control is off the screen is not a rotating hero.
  //
  // `clamp(1rem, 9vh, 5rem)` is 72px at 800 tall, 97px at 1080 and 36px on a phone — it clears a header
  // at every size, scales instead of being tuned to one, and floating the dots above the edge is what a
  // carousel looks like anyway.
  return `<nav data-eu-pager-nav aria-label="Choose which one to show"`
    + ` style="position:absolute;left:0;right:0;bottom:clamp(1rem,9vh,5rem);display:flex;gap:.75rem;`
    + `justify-content:center;align-items:center;pointer-events:none">`
    + `<span style="display:flex;gap:.75rem;align-items:center;pointer-events:auto">${body}</span></nav>`;
}

/**
 * One pager, wired up. Exported as a FUNCTION so the builder can run the very same code the page gets —
 * `pagerScript` ships this function's own source, exactly as masonry does. One algorithm, not two.
 *
 * Everything here is an upgrade on something that already works without it:
 *   • the dots are already links; this stops them NUDGING THE PAGE. Measured before it existed: clicking
 *     one scrolled the document 240px even with the strip fully in view, because a fragment navigation
 *     scrolls every scrollable ancestor. `scroll-margin-block` does not suppress that — this does.
 *     `replaceState` keeps the page bookmarkable, which `preventDefault` alone throws away.
 *   • the arrows ship hidden, because "one back from where I am" is not something a static href can say.
 *   • the current dot gets `aria-current`, which nothing can express in CSS alone.
 *   • auto-advance PAUSES on hover and on keyboard focus (WCAG 2.2.2 — a moving thing a reader cannot
 *     hold still to read is a failure), and never runs at all for a reader who asked for less motion.
 */
export function pagerWire(strip: HTMLElement): void {
  const d = document as Document;
  const win = window as Window;
  const slides = Array.prototype.filter.call(strip.children, (c: Element) => (c as HTMLElement).dataset.euSlide !== undefined) as HTMLElement[];
  if (slides.length < 2) return;
  const nav = strip.parentElement ? strip.parentElement.querySelector("[data-eu-pager-nav]") as HTMLElement | null : null;
  const still = win.matchMedia && win.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const at = () => Math.round(strip.scrollLeft / Math.max(1, strip.clientWidth));
  const go = (i: number) => {
    const n = (i + slides.length) % slides.length;
    strip.scrollTo({ left: slides[n].offsetLeft - strip.offsetLeft, behavior: still ? "auto" : "smooth" });
  };
  if (nav) {
    nav.querySelectorAll("[data-eu-pager-dot]").forEach((a, i) => a.addEventListener("click", (e) => {
      e.preventDefault();
      go(i);
      try { history.replaceState(null, "", (a as HTMLAnchorElement).getAttribute("href")); } catch { /* a file:// page cannot */ }
    }));
    const arrow = (sel: string, step: number) => {
      const el = nav.querySelector(sel) as HTMLElement | null;
      if (!el) return;
      el.hidden = false; // it was hidden because without this script it could not mean anything
      el.style.display = "block";
      el.addEventListener("click", (e) => { e.preventDefault(); go(at() + step); });
    };
    arrow("[data-eu-pager-prev]", -1);
    arrow("[data-eu-pager-next]", 1);
    // The dots were only there in case this never ran (see `pagerNavHTML`). It has, so the user gets the
    // arrows-only navigation they actually chose.
    const spare = nav.querySelector("[data-eu-pager-dots-fallback]") as HTMLElement | null;
    if (spare) spare.hidden = true;
    const mark = () => {
      const now = at();
      nav.querySelectorAll("[data-eu-pager-dot]").forEach((a, i) => {
        const on = i === now;
        (a as HTMLElement).style.opacity = on ? "1" : "0.55";
        if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    };
    strip.addEventListener("scroll", () => { win.clearTimeout((strip as unknown as { _m?: number })._m); (strip as unknown as { _m?: number })._m = win.setTimeout(mark, 90); });
    mark();
  }
  const every = Number(strip.dataset.euPagerAuto || 0);
  if (!every || still) return;
  let timer = 0;
  const stop = () => { win.clearInterval(timer); timer = 0; };
  const start = () => { if (!timer) timer = win.setInterval(() => { if (!d.hidden) go(at() + 1); }, every * 1000); };
  // Pause while it is being read or operated, and pick up again when it is not. `focusin` covers the
  // keyboard: tabbing INTO a slide has to stop it just as surely as hovering does.
  strip.addEventListener("mouseenter", stop);
  strip.addEventListener("mouseleave", start);
  strip.addEventListener("focusin", stop);
  strip.addEventListener("focusout", start);
  if (nav) { nav.addEventListener("mouseenter", stop); nav.addEventListener("mouseleave", start); }
  start();
}

/** The pager's script, shipped as this file's own function — so the page runs what the builder ran. */
export function pagerScript(): string {
  return `<script>(function(){if(window.__euPager)return;window.__euPager=1;
var wire=${String(pagerWire)};
function all(){document.querySelectorAll('[data-eu-pager]').forEach(function(s){try{wire(s);}catch(e){}});}
if(document.readyState==='loading')addEventListener('DOMContentLoaded',all);else all();
})();<\/script>`;
}

export const MASONRY_ROW_REM = 0.5;

/**
 * The smallest an EMPTY, UNSIZED box may render — the floor that stops a block you just added from being
 * too small to see or to grab. See the long note in `childStyle` for what it is defending against.
 *
 * 2.5rem (40px at the default root) is chosen against the thing that has to work: a block carries four edge
 * handles and four corner handles, each about 8px. Below roughly 32px they overlap and there is no part of
 * the block left to click that is not a handle, so it cannot be selected OR resized. 40px leaves a usable
 * band in the middle, and is still small enough that six of them barely move a parent somebody sized.
 *
 * In `rem`, never px, per the Responsive Field Guide — a reader who has raised their browser font gets a
 * bigger floor too, which is exactly right, because their handles are bigger as well.
 */
export const EMPTY_BOX_MIN = "2.5rem";

/**
 * The shape assumed for a cell whose height CANNOT be known statically — a card, a caption, any text.
 *
 * Something has to be assumed or such a cell claims one unit and renders 8px tall, which is not "approximate",
 * it is broken. 4:3 is the shape most gallery content actually is. This is exactly the case the inspector
 * surfaces the "measure on the page" tick-box for: the assumption is a floor to stand on, not an answer.
 */
export const MASONRY_DEFAULT_RATIO = 3 / 4;

/** Is this grid running as masonry at this rung? */
export function isMasonry(node: BoxNode, bp: Breakpoint = "base"): boolean {
  if (node.layout !== "grid" || node.rowFlow !== "masonry") return false;
  // A ONE-COLUMN grid has nothing to stagger: masonry is what happens when neighbouring columns can run at
  // different heights, and with a single column the blocks simply stack — which the even rows already do,
  // correctly, with no measuring unit and no rounding. So the phone rung (where `gridColumnsAt` collapses to
  // one) renders a masonry gallery as a plain stack, which is also what a person wants on a phone.
  return gridColumnsAt(node, bp) > 1;
}

/**
 * The page column's width at a rung, in px — the width a contained band's grid actually gets.
 *
 * THIS IS WHY B IS EXACT RATHER THAN APPROXIMATE. `RUNG_MEASURE` caps a contained column at 34/52/68/76rem,
 * and every one of those caps sits BELOW its own rung's starting width (600/900/1200/1800). So above the phone
 * the container is a CONSTANT within each rung, and a span worked out per rung is precise for every screen in
 * it. An EDGE-TO-EDGE band is the approximate case — its width tracks the viewport, so the gaps grow with the
 * window, and that is what `rowMeasure` (C) is for.
 *
 * Null on the phone rung, which has no cap; masonry is a plain stack there anyway (see `isMasonry`).
 */
export function masonryContainerPx(bp: Breakpoint = "base"): number | null {
  // `Breakpoint` says `base` where `RungName` says `desktop` — the ONE place that correspondence is written.
  const rung: RungName = bp === "base" ? "desktop" : bp;
  const measure = RUNG_MEASURE[rung];
  if (!measure) return null;
  return parseFloat(measure) * 16;
}

/**
 * What shape this cell's content is, as height ÷ width.
 *
 * Read off the first picture found INSIDE the cell, because a grid child is a cell container and the photo
 * lives in it — `imgW`/`imgH` are measured once at upload, so the shape is already known without loading a
 * byte. Anything else falls back to `MASONRY_DEFAULT_RATIO`.
 */
export function masonryRatio(node: BoxNode): number {
  const found = firstIntrinsic(node);
  return found ? (found.imgH ?? 1) / (found.imgW ?? 1) : MASONRY_DEFAULT_RATIO;
}

function firstIntrinsic(node: BoxNode): BoxNode | null {
  if (hasIntrinsicSize(node)) return node;
  for (const c of node.children ?? []) {
    const f = firstIntrinsic(c);
    if (f) return f;
  }
  return null;
}

/** How wide one cell of `colSpan` tracks is, in a `track`-column grid `containerPx` wide with `gapX` between. */
export function masonryCellPx(containerPx: number, track: number, colSpan: number, gapXpx: number): number {
  const t = Math.max(1, Math.round(track));
  const s = Math.min(t, Math.max(1, Math.round(colSpan)));
  const col = (containerPx - (t - 1) * gapXpx) / t;
  return Math.max(0, col * s + (s - 1) * gapXpx);
}

/**
 * How tall this cell is going to be, in px, given the width it will have.
 *
 * A STATED height wins over the assumed shape — it is a fact rather than a guess, and it is the commonest
 * fact there is, because an image block is created with one (260px) until somebody sets it to `auto`. Only a
 * px height can be used: a percentage is a share of a row height that masonry has deliberately stopped having.
 */
export function masonryCellHeightPx(cell: BoxNode, cellPx: number): number {
  const padV = (cell.paddingTop ?? cell.padding ?? 0) + (cell.paddingBottom ?? cell.padding ?? 0);
  const stated = statedPx(cell.height) ?? cell.minHeight ?? null;
  if (stated != null) return Math.max(0, stated + padV);
  return Math.max(0, cellPx * masonryRatio(cell) + padV);
}

/** A height token as px, or null when it is not a plain pixel length ("auto", "fill", "50%"). */
function statedPx(token?: string): number | null {
  if (!token || token === "auto" || token === "fill") return null;
  const m = /^(-?[\d.]+)px$/.exec(token.trim());
  return m ? parseFloat(m[1]) : null;
}

/**
 * How many row UNITS a cell of this height claims, with `gapY` of air beneath it.
 *
 * The gap is spent as EMPTY UNITS rather than as `row-gap`, and that choice is the whole numerical stability
 * of B. The textbook recipe keeps the gap on the container and solves `n = ceil((H + G) / (R + G))` — where
 * the assumed gap appears once per track, so being a few px out about it is multiplied by n and a 300px photo
 * lands 90px wrong. Here the container's `row-gap` is 0 on masonry, the allotment is exactly `n × R`, and the
 * gap is one addend that a small error cannot compound. (It has to be an estimate at all because the builder's
 * spacing unit is deliberately FLUID — `u()` is a `clamp()` that tracks the frame's width.)
 */
export function masonrySpanUnits(heightPx: number, gapYpx: number, rowPx = MASONRY_ROW_REM * 16): number {
  const r = rowPx > 0 ? rowPx : MASONRY_ROW_REM * 16;
  return Math.max(1, Math.ceil(Math.max(0, heightPx) / r) + Math.ceil(Math.max(0, gapYpx) / r));
}

/**
 * The whole pipeline: how many row units this child claims in this masonry parent at this rung.
 *
 * Null whenever masonry is not running (so `childStyle` falls straight back to the ordinary `rowSpan` path)
 * or when the width cannot be known — the phone rung, where there is no measure and no masonry either.
 */
export function masonryRowSpan(parent: BoxNode, child: BoxNode, bp: Breakpoint = "base"): number | null {
  if (!isMasonry(parent, bp)) return null;
  const containerPx = masonryContainerPx(bp);
  if (containerPx == null) return null;
  const padH = (parent.paddingLeft ?? parent.padding ?? 0) + (parent.paddingRight ?? parent.padding ?? 0);
  const gapX = parent.gapX ?? parent.gap ?? 16;
  const gapY = parent.gapY ?? parent.gap ?? 16;
  const { track, span } = gridPlacementAt(parent, child, bp);
  const cellPx = masonryCellPx(Math.max(0, containerPx - padH), track, span, gapX);
  return masonrySpanUnits(masonryCellHeightPx(child, cellPx), gapY);
}

/** The down-gap, expressed in row units — what a cell adds to its own height to leave air beneath it. */
export function masonryGapUnits(node: BoxNode, rowPx = MASONRY_ROW_REM * 16): number {
  const r = rowPx > 0 ? rowPx : MASONRY_ROW_REM * 16;
  return Math.ceil(Math.max(0, node.gapY ?? node.gap ?? 16) / r);
}

/**
 * C — "measure on the page". The gap in row units when this grid opted in, null when it did not.
 *
 * Both renderers put it on the grid element as `data-eu-masonry`, which is at once the marker the script
 * looks for and the one number it cannot measure: the down-gap is spent as empty row units rather than as
 * `row-gap`, so it is not in the computed style to be read back.
 *
 * It takes no rung: the marker is the same at every width, and the script works the rest out from the page
 * itself. (Known small gap, written down rather than left to be found: a Space down set only at ONE rung is
 * not reflected here, so a measured gallery uses the base rung's spacing allowance at every width. It shifts
 * a gap by a few pixels and nothing else, because the heights — the part that matters — are measured.)
 */
export function masonryMeasureAttr(node: BoxNode): number | null {
  if (!node.rowMeasure || node.layout !== "grid" || node.rowFlow !== "masonry") return null;
  return masonryGapUnits(node);
}

/**
 * ONE measuring pass over a masonry grid, as plain DOM.
 *
 * THE CANVAS CALLS THIS FUNCTION AND THE EXPORT SHIPS ITS SOURCE — literally, via `String(...)` in
 * `masonryMeasureScript`. That is not a trick for its own sake: the canvas is React and the export is a static
 * document, so anything they are each "meant to" do the same way is a canvas ≠ export bug waiting to happen,
 * and this project has paid for that four times. Here there is one algorithm, and changing it changes both.
 *
 * It is progressive enhancement over B, never a replacement: with scripting off the static spans already give
 * a staggered layout that never crops, and this only makes the gaps exact.
 */
export function masonryMeasurePass(grid: HTMLElement): void {
  const kids = Array.from(grid.children) as HTMLElement[];
  const cs = getComputedStyle(grid);
  // `grid-template-columns` computes to the USED track sizes, one per track — so this is the real column
  // count at the real width, not a guess from a breakpoint. Under two columns there is nothing to stagger
  // (the phone rung), and any spans left over from a wider screen have to be handed back or the stack keeps
  // a desktop's ruler.
  const cols = cs.gridTemplateColumns.split(" ").filter(Boolean).length;
  // The unit is the FLOOR of `minmax(<unit>, auto)`, so it is read out of the value rather than parsed off the
  // front of it. A grid that is not masonry has no px length there at all (`minmax(min-content, 1fr)`), which
  // is the second half of the same check.
  const found = /([0-9.]+)px/.exec(cs.gridAutoRows);
  const unit = found ? parseFloat(found[1]) : 0;
  if (cols < 2 || !(unit > 0)) { for (const el of kids) el.style.removeProperty("grid-row"); return; }
  const gapUnits = parseInt(grid.getAttribute("data-eu-masonry") || "0", 10) || 0;
  // Release every span BEFORE reading any height: a cell still holding last pass's span would measure the
  // height that span gave it, and the layout would ratchet instead of settle. The first read below flushes
  // all of the releases at once, so this costs one reflow rather than one per cell.
  for (const el of kids) el.style.removeProperty("grid-row");
  for (const el of kids) {
    const h = el.getBoundingClientRect().height;
    el.style.setProperty("grid-row", "span " + Math.max(1, Math.ceil(h / unit) + gapUnits));
  }
}

/**
 * The opt-in script the export ships for C — one guarded global for every measured gallery on the page.
 *
 * Zero JS stays the default: nothing here is emitted unless someone ticked "measure on the page". It re-runs
 * whenever a height it measured could have changed — the window resizing, the web fonts arriving, a photo
 * decoding — because each of those lands after the first pass and each of them silently invalidates it.
 */
export function masonryMeasureScript(): string {
  return `<script>(function(){if(window.__euMasonry)return;window.__euMasonry=1;
var pass=${String(masonryMeasurePass)};
var queued=0;
function all(){queued=0;var g=document.querySelectorAll('[data-eu-masonry]');for(var i=0;i<g.length;i++){try{pass(g[i]);}catch(e){}}}
function soon(){if(queued)return;queued=1;requestAnimationFrame(all);}
soon();
addEventListener('resize',soon);
addEventListener('load',soon);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(soon).catch(function(){});
document.querySelectorAll('[data-eu-masonry] img').forEach(function(i){if(!i.complete)i.addEventListener('load',soon);i.addEventListener('error',soon);});
})();</script>`;
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

/**
 * The longest edge a photograph is stored at, and the quality it is encoded with.
 *
 * NOT a preference — the difference between a gallery that works and one that destroys the page.
 * An upload is kept as a `data:` URL inside the saved site, and a browser gives that store about 5MB.
 * Measured: one 3000×2000 photograph straight off a phone is **1,260 KB** as a data URL, so **four** of
 * them fill the entire store and the fifth throws. A twelve-photograph gallery could not exist.
 *
 * 1600px is chosen against the page, not the camera: the widest a picture is ever drawn here is one
 * column of the largest container (76rem ≈ 1216px), and 1600 leaves headroom for a dense screen without
 * storing pixels nothing can show. It is also simply the right thing to publish — a school site that
 * ships 3000px photographs to a phone is the single heaviest mistake this builder could make.
 */
export const PHOTO_MAX_EDGE = 1600;
export const PHOTO_QUALITY = 0.82;

/**
 * Read a chosen file and return it as a data URL that is safe to store — downscaled and re-encoded.
 *
 * Total by design, like `measureImage`: anything that cannot be decoded or drawn comes back as the
 * ORIGINAL bytes rather than as an error, because losing a picture the user chose is worse than storing
 * a large one. The caller still learns the size it ended up, so it can say so.
 *
 * A picture already within the cap is still re-encoded when that makes it smaller, and kept as-is when
 * it does not — so a small PNG logo with sharp edges is never silently turned into a blurry JPEG.
 */
export async function importPhoto(file: File): Promise<{ src: string; imgW?: number; imgH?: number; bytes: number; originalBytes: number }> {
  const original = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("unreadable"));
    r.readAsDataURL(file);
  }).catch(() => "");
  if (!original) return { src: "", bytes: 0, originalBytes: file.size };

  const dims = await measureImage(original);
  const fallback = { src: original, ...dims, bytes: original.length, originalBytes: original.length };
  if (typeof document === "undefined" || !dims.imgW || !dims.imgH) return fallback;

  const scale = Math.min(1, PHOTO_MAX_EDGE / Math.max(dims.imgW, dims.imgH));
  const w = Math.max(1, Math.round(dims.imgW * scale));
  const h = Math.max(1, Math.round(dims.imgH * scale));
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("decode"));
      i.src = original;
    });
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return fallback;
    // A photograph scaled in one step aliases badly; the browser's own smoothing is what avoids that.
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, w, h);
    // Transparency must survive, so anything with an alpha channel stays PNG-like (WebP keeps alpha too).
    const type = /^data:image\/(png|gif|svg)/i.test(original) ? "image/webp" : "image/jpeg";
    const out = canvas.toDataURL(type, PHOTO_QUALITY);
    // `toDataURL` silently falls back to PNG when a type is unsupported, which can be BIGGER than the
    // original — so the re-encode is only kept when it actually won.
    if (!out.startsWith("data:image/") || out.length >= original.length) return fallback;
    return { src: out, imgW: w, imgH: h, bytes: out.length, originalBytes: original.length };
  } catch {
    return fallback;
  }
}

/** flex behaviour for a child inside a flex parent, derived from its main-size token.
 *  An explicit size is a FIXED share (no grow/shrink) so a section keeps exactly the width you give it —
 *  you can resize it narrower to open space, and drop another section into that space. `fill` grows to
 *  take whatever is left. Dropping a section beside another sets its width to the leftover so it fits. */
/**
 * Is this child ALONE on its line, once a wrapping row has packed its children?
 *
 * The reason this is computed rather than left to `flex-grow: 1` is a regression it caused within minutes:
 * grow spends whatever is LEFT OVER on a line, and narrowing a block is exactly how a line comes to have
 * space left over. So a block dragged narrower had the space handed straight back to it and would not
 * shrink at all — "I can no longer decrease the width of a stack from the right".
 *
 * Flexbox packs greedily, so the same walk here tells us what it will do: fill a line until the next child
 * would take it past 100%, then start another. A child that ends up on a line by itself is the only case
 * that should grow — it has room beside it that nothing else is asking for.
 *
 * AND ONLY ON A LINE IT WAS PUSHED ONTO (`lineIndex > 0`). This is the second correction, and the symptom
 * was a dead end rather than a cosmetic one. Widen a block until its neighbour wraps away and that block is
 * then alone on the FIRST line — so it grew to fill the row whatever its stored width said. Narrowing it
 * changed the stored number and nothing on screen: 100% → 88.43% while it still rendered 864px. The next
 * drag measured that same inflated edge, computed the same answer, and the block could never be narrowed
 * again. Widening was a one-way door, and the neighbour could never be brought back up.
 *
 * The first line is where the user is working and must show the width they set. A LATER line exists only
 * because something was pushed onto it, and there the fill is what they asked for — "when they move to the
 * bottom, they should occupy the width of that row".
 */
export function aloneOnItsLine(parent: BoxNode, child: BoxNode): boolean {
  const kids = (parent.children ?? []).filter((k) => !isFloating(k) && !k.hidden);
  if (kids.length < 2) return false;                    // the only child already fills the row by other means
  let line: BoxNode[] = [];
  let used = 0;
  let lineIndex = 0;
  for (const k of kids) {
    const w = widthPct(k.width) || 100;
    // A hair over 100 is still one line — percentages that round to 100.4 are meant to be a full line.
    if (line.length && used + w > 100.5) {
      if (line.some((n) => n.id === child.id)) return lineIndex > 0 && line.length === 1;
      line = []; used = 0; lineIndex++;
    }
    line.push(k); used += w;
  }
  return lineIndex > 0 && line.length === 1 && line.some((n) => n.id === child.id);
}

export function flexForWidth(token?: string, fillsItsLine = false): string | undefined {
  if (token === "fill") return "1 1 0%";
  if (!token || token === "auto") return "0 0 auto";
  /**
   * `fillsItsLine` — A BLOCK ALONE ON A LINE GROWS TO FILL IT; one that shares a line keeps its share.
   *
   * Both halves come from the single `1` in the grow position, and that is the whole trick: `flex-grow`
   * only ever spends space that is LEFT OVER on a line. Two blocks at 50% leave none, so they stay at 50%
   * and "a resized block is exactly the size you set" still holds. A block wrapped onto a line by itself
   * leaves 50% over, so it takes it.
   *
   * That is what makes widening a block and narrowing it again symmetrical: the neighbour drops to the next
   * line and spreads to fill it, then comes back up to its own share, and nothing was moved or remembered
   * to achieve either. Only row bands ask for this — a row that cannot wrap has no "alone on its line".
   */
  return `${fillsItsLine ? 1 : 0} 1 ${token}`; // fixed share, but MAY SHRINK to fit — so a row's sections can never run off the page
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

/**
 * Re-exported from the token module, where it now lives beside the radius and shadow scales that need it.
 * Defined only there, so the token system and the block model convert lengths the same way by construction.
 */
export { remLen };

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
  /**
   * THE IDEAL TERM CARRIES A `rem`, AND IT DID NOT USED TO — which is how the whole page stopped listening to
   * the reader's own text size.
   *
   * It was a bare `1cqw`. The floor and the ceiling are rem, so they follow a reader who has enlarged their
   * browser text — but between them, which is nearly always, the unit was 1% of the CONTAINER and knew nothing
   * about font size at all. Measured on the exported page at 1280px wide:
   *
   *     reader 16px → section padding 2.56px      reader 24px → 2.56px      reader 32px → 2.8px
   *
   * Setting the browser to 24px changed the spacing of the page by NOTHING. Text scaled (it has its own rem
   * floor); every gap, pad, radius and offset in the product did not. That is the opposite of what
   * `--box-u` exists for, and it silently failed the accessibility promise the 62.5% note in the Responsive
   * Field Guide makes explicitly — the whole design is supposed to scale WITH the reader's preference.
   *
   * The Field Guide's own formula was right all along and this was not following it: `clamp(2rem, 1rem + 5vw,
   * 4.5rem)` — the ideal is a rem PLUS a viewport term, never a viewport term alone.
   *
   * SPLIT HALF AND HALF at the reference width, so the unit is unchanged where it was calibrated: at a
   * 1000px container with a 16px reader, `base/32 rem` = base/2 px and `base/20 cqw` = base/2 px, which sum
   * to exactly the `baseFontPx` this has always resolved to. Narrower and wider it now moves a little less
   * with the container and a great deal more with the reader, which is the trade this is for.
   */
  const { remHalf, cqwHalf } = baseUnitParts(baseFontPx);
  return `clamp(${lo}rem, calc(${remHalf}rem + ${cqwHalf}cqw), ${hi}rem)`;
}

/**
 * THE FLUID UNIT'S FOUR NUMBERS, IN ONE PLACE — because there are two consumers and they must never drift.
 *
 * `baseUnit()` writes them as a CSS `clamp()`; the canvas's `measureBoxU` resolves the same formula to a live
 * pixel value so an edge-anchored drag can convert a measured offset into the stored unit. Those were two
 * hand-written copies of one rule, and the day the CSS gained its rem term the JavaScript kept the old bare
 * `cqw` — so the drag did its arithmetic in a unit the page was not using, and the anchored bottom edge
 * drifted 3px. Rule 19, broken a fourth time, by a seam rather than by the resize logic.
 *
 * One definition, two renderings of it. The same remedy the Hub records for every other case of this:
 * collapse onto one emitter rather than fix both.
 */
export function baseUnitParts(baseFontPx = 10): { loRem: number; hiRem: number; remHalf: number; cqwHalf: number } {
  return {
    loRem: +((baseFontPx * 0.7) / 16).toFixed(4),   // rem floor (≈0.7× base)
    hiRem: +((baseFontPx * 1.4) / 16).toFixed(4),   // rem ceiling (≈1.4× base)
    remHalf: +(baseFontPx / 32).toFixed(4),         // half the unit, in rem — follows the READER
    cqwHalf: +(baseFontPx / 20).toFixed(4),         // the other half, in cqw — follows the CONTAINER
  };
}

/** A body-text floor, in rem, below which no reading size may be emitted — the browser's own default. */
export const TEXT_FLOOR_REM = 1;

/**
 * READING SIZE IS NOT A SPACING SIZE — the same lesson as `scrollLen` above, on the axis that matters most.
 *
 * `--box-u` is the right unit for a gap or a padding: on a narrow screen those SHOULD close up. Text must
 * not, and while the text size was simply `u(16)` it did, all the way down. Measured on the exported page at
 * ten widths:
 *
 *     320px → 11.2px    375px → 11.2px    414px → 11.2px    619px → 11.2px    768px → 12.3px
 *     1024px → 16.4px   1280px → 20.5px   1536px → 22.4px   1920px → 22.4px
 *
 * Every phone, and a Fold opened out, rendered body copy at 11.2px — and the roles are multiples of this
 * one value, so a button label came out at 0.875 × 11.2 = 9.8px. Reported as content "becoming smaller" as
 * the preview narrows, which is exactly what it was doing.
 *
 * The fluid growth is kept, because that part was right: text still tracks the container's width through
 * `cqw`, and still tops out at the same ceiling, so nothing changes at 1024px and above. Only the bottom is
 * held — at `1rem`, the reader's own default size, so it honours a browser text setting instead of
 * overriding it. Above ~1000px the fluid term wins and this floor is invisible.
 *
 * `max()` rather than a wider `clamp()` on purpose: the ceiling already lives inside `--box-u`, so the floor
 * is the only thing being added, and a page's `baseFont` still scales the whole ramp.
 */
export function textUnit(): string {
  return `max(${TEXT_FLOOR_REM}rem, ${u(16)})`;
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
  // SHOW ONE AT A TIME. The node itself stays an ordinary BOX — its background, padding and height are
  // the box's, exactly as on any other container — and the scrolling strip is an element INSIDE it
  // (`pagerStripCss`). It has to be two elements: the navigation must sit outside the scroll container or
  // it scrolls away with the pages, and a child of the strip cannot sit outside it.
  if (isPager(node)) return { position: "relative", ...paddingCSS(node), minHeight: minH };
  if (node.layout === "grid") {
    // MASONRY changes exactly three of the declarations below and nothing else — the columns, the spans, the
    // offsets, the order and the reading order are all untouched, which is the whole reason it is a row option
    // rather than a mode. See the MASONRY block above `MASONRY_ROW_REM`.
    const masonry = isMasonry(node, bp);
    return {
      display: "grid",
      // Per RUNG, so a twelve-column row is twelve columns on a desktop and one on a phone (`gridColumnsAt`).
      gridTemplateColumns: `repeat(${gridColumnsAt(node, bp)}, minmax(0, 1fr))`,
      // The down-gap on a masonry grid is spent as EMPTY ROW UNITS by each cell's span, not as `row-gap` —
      // the number the user set still means exactly what it says, but it lands once per cell instead of once
      // per track, where an estimate of the fluid unit could compound (see `masonrySpanUnits`). Both longhands
      // are written, never the `gap` shorthand, so the property set matches at every rung and the export's
      // rung-to-rung diff has something to neutralise when a narrower rung stops being masonry.
      ...(masonry ? { columnGap: u(node.gapX ?? node.gap ?? 16), rowGap: "0px" } : gapCSS(node)),
      // A masonry cell HUGS its content. The tracks it spans are a ruler, not a row, so stretching to fill
      // them would stretch a photo to a number that was only ever a measurement of the photo.
      alignItems: masonry ? "start" : ALIGN_CSS[node.align ?? "stretch"],
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
      //
      // …unless this grid is a MASONRY gallery, where the row stops being a row: the track becomes a fine
      // fixed UNIT and a cell claims as many of them as it is tall. That single substitution is what makes the
      // pictures stagger, and it is why nothing else about the grid has to change.
      //
      // `minmax(<unit>, auto)` and NOT the bare unit, and that clause is what makes the static spans SAFE
      // rather than merely usually right. A fixed track cannot grow, so a cell that turns out taller than its
      // span simply paints over the one beneath it — and on an EDGE-TO-EDGE band the width is the viewport
      // rather than the measure, so it will turn out taller. With `auto` as the maximum, a cell that does not
      // fit makes its own tracks grow instead: an under-estimate costs a little evenness, an over-estimate
      // costs a little air, and neither can ever crop or overlap. When the span is right (a contained band,
      // where it is exact) the tracks stay at the unit and nothing about the stagger changes.
      gridAutoRows: masonry ? `minmax(${MASONRY_ROW_REM}rem, auto)` : "minmax(min-content, 1fr)",
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
    /**
     * WRAPPED LINES FILL THE BOX — and getting this wrong collapses everything dropped into a sized box.
     *
     * A row band always wraps, and on a wrapping flex container it is `align-content` that hands out the
     * cross-axis space, NOT `align-items`. With `flex-start` the single line hugs its content and every
     * spare pixel is left at the bottom; `align-items: stretch` then dutifully stretches the child to fill
     * a line that is already as short as the child. Two rules each right on their own, cancelling out.
     *
     * Measured: a Stack dropped into a 400px section landed 40px tall inside a band that was correctly
     * 400px — 360px of the box left empty, with nothing in the styles to say why. Reported as "it collapses
     * to the minimum height instead of taking the rest of the space".
     *
     * This was patched once for the case that was reported then — a nested GRID — by asking
     * `fillsGivenHeight`. That was too narrow by exactly one step: a grid is not the only thing that wants
     * the height it is given, every CONTAINER does. An element still hugs, because `childStyle` pins it to
     * the start of its line, so a heading sits in the same place either way.
     *
     * `stretch` is also the CSS default, so this is the browser's own answer rather than a second opinion:
     * where a line has no spare room the two are identical, and the only case they differ is the one the
     * user is complaining about.
     */
    alignContent: "stretch",
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

/**
 * Has the nearest REAL container above this block been given a height?
 *
 * "Real" excludes row bands, which are scaffolding: `normalizeRowBands` puts one around every child of a
 * content container, so the thing directly above a block is almost never the box a person thinks of as its
 * container. A band carries no height of its own and passes the question straight through.
 *
 * The distinction matters for exactly one rule — the floor under a grid that has nothing to share (see
 * `gridHasNothingToShare`) — and it has to be this narrow. "Any ancestor sized" is too broad: a grid inside
 * an unsized child stack, itself inside a stack somebody sized, would count as sized and collapse anyway,
 * which is the reported case. "The immediate parent" is too narrow: that is the band, always unsized.
 */
export function hostSizedFor(node: BoxNode, inheritedHostSized: boolean, parent?: BoxNode | null): boolean {
  if (node.rowBand) return inheritedHostSized;                        // scaffolding — pass it through
  const ownSize = node.minHeight != null || node.height != null || !!node.screenHeight;
  /**
   * A GRID CELL IS GIVEN ITS HEIGHT BY THE ROW, and stores nothing to say so.
   *
   * Every other box answers this question out of its own tokens, and a cell cannot: the rows are
   * `minmax(min-content, 1fr)`, so a cell in a grid that HAS a height is handed a share of it while its
   * own `height` and `minHeight` stay empty. Reading only the tokens therefore called every cell unsized,
   * and everything dropped into one hugged its content in a box with room to spare — measured: a Stack
   * dropped into a 200px cell sat at 40px with 160px left under it.
   *
   * It inherits rather than assuming: a grid with no height of its own has nothing to share out (see
   * `gridHasNothingToShare`), so its cells really are unsized and the floor that keeps them grabbable
   * still applies. Sized grid, sized cells; unsized grid, unsized cells.
   */
  if (parent?.layout === "grid") return inheritedHostSized || ownSize;
  return ownSize;
}

export function childStyle(child: BoxNode, parent: BoxNode, bp: Breakpoint = "base", hostSized = false): CSSProperties {
  const s: CSSProperties = {};
  // A PAGE of a pager, and nothing else: no span, no offset, no order. Its width comes from the strip
  // (`grid-auto-columns: 100%`), so any stored `colSpan` from before the mode was turned on is ignored
  // rather than re-fitted — which is what stops a grid that becomes a pager keeping half its old shape.
  if (isPager(parent)) return { ...pagerSlideCss(), ...placeCSS(child, parent) };
  if (parent.layout === "grid") {
    // Re-fitted to the track the row actually has AT THIS RUNG (see `gridPlacementAt`). A span of 8 left over
    // from a twelve-column desktop would otherwise generate implicit columns on a phone and blow the row's
    // width past the screen — the horizontal-scrollbar bug guarded against in three other places already.
    const { start } = gridPlacementAt(parent, child, bp);
    // …and the cell that ends a SHORT final row stretches to fill it, so a narrowed grid never leaves half a
    // row of the section's background showing beside the content. See `gridSpanAt`.
    const span = gridSpanAt(parent, child, bp);
    const place = start != null ? `${start} / span ${span}` : span > 1 ? `span ${span}` : undefined;
    if (place) s.gridColumn = place;
    // The down axis. On a MASONRY grid it is computed, not stored: the cell claims as many measuring units as
    // its content is tall (`masonryRowSpan`), which is the mechanism itself. "Rows tall" and "Start at row"
    // are hidden while masonry is on for exactly this reason — they would be describing a ruler.
    const masonrySpan = masonryRowSpan(parent, child, bp);
    if (masonrySpan != null) { s.gridRow = `span ${masonrySpan}`; }
    else {
      // No rung re-fit and no clamp: rows are implicit, so the grid simply makes as many as the placement asks
      // for — a block on row 4 of a two-row grid creates rows 3 and 4 rather than overflowing.
      //
      // …EXCEPT at a rung the ladder narrowed, where the row is given up together with the column. The two
      // halves of a placement only mean anything together: releasing the column while holding "row 1" pins
      // every cell of that row back into one row, and with the columns now auto they either pile up again or
      // generate implicit columns and push the page sideways. Both were measured. Dropping both is what lets
      // the grid do the one thing that works at these widths — flow the cells one after another.
      const rowSpan = Math.max(1, Math.round(child.rowSpan ?? 1));
      // Same per-cell question as the column: a row stated AT this rung is in this rung's terms and is kept.
      const rowGivenUp = gridReflowsAt(parent, bp) && !setAtRung(child, "rowStart", bp);
      const rowStart = child.rowStart == null || rowGivenUp ? null : Math.max(1, Math.round(child.rowStart));
      if (rowStart != null) s.gridRow = `${rowStart} / span ${rowSpan}`;
      else if (rowSpan > 1) s.gridRow = `span ${rowSpan}`;
    }
    if (child.justifySelf) s.justifySelf = child.justifySelf;
    if (child.alignSelf) s.alignSelf = child.alignSelf;
    const h = sizeToCSS(child.height);
    if (h) s.height = h;
    placeInSequence(s, child);
    // LAST, so the nine-point position wins over the older per-axis controls it replaces.
    Object.assign(s, placeCSS(child, parent));
    // …and pinning after even that: it writes `position`, which none of the above touches, and it must
    // land identically on a grid child and a flex child or "stays visible while scrolling" would depend
    // on which engine the parent happens to use.
    Object.assign(s, pinCSS(child, parent, bp));
    /**
     * AN EMPTY CELL KEEPS A FLOOR — and it took being wrong about this twice to pin down when it matters.
     *
     * A grid whose rows have a height to share (`minmax(min-content, 1fr)` inside a grid that was given a
     * `min-height`) hands every cell a share whatever the cell's own minimum says. Measured against such a
     * grid, removing this floor changes nothing, which is why it was first added on a guess, then withdrawn
     * as unprovable.
     *
     * The case it exists for is a grid with NO HEIGHT OF ITS OWN — one sitting inside a stack that hugs its
     * content. There is nothing to share out: an empty cell is 0, so the grid is 0, so the stack holding it
     * collapses too. Measured: adding a Grid inside a child stack left the child stack under 8px along with
     * three of its descendants. "The inner child breaks the page" was this.
     *
     * HEIGHT only. In a grid the width is the SPAN's job — `grid-column` decides it, and a `min-width` here
     * would fight the track rather than help it.
     */
    /**
     * NO FLOOR ON A GRID CELL — and this is an open question, not a settled one.
     *
     * A grid with no height of its own (one inside a stack that hugs) has nothing to share out, so its
     * empty cells are 0, the grid is 0, and the stack holding it collapses. That is real and measured:
     * adding a Grid inside a child stack left the stack under 8px.
     *
     * Flooring the cells fixes it and breaks something else — `empty-box-height` asserts "a box holding an
     * EMPTY GRID shrinks too — its cells' hints do not hold it open", which exists so a box can be dragged
     * small. A floor on the cells survives the box's own resize and stops it.
     *
     * Both are rules someone asked for, so the choice is not mine to make quietly. Left as it was until it
     * is decided; the collapse is recorded in the ledger rather than papered over.
     */
    return s;
  }
  const isRow = (parent.direction ?? "column") === "row";
  const mainToken = isRow ? child.width : child.height;   // grows/divides along the main axis
  const crossToken = isRow ? child.height : child.width;  // fixed size across the main axis
  const parentMain = isRow ? parent.width : parent.height;
  // "Definite" main size means the child should fill+follow it. For a column, an explicit height OR a
  // min-height (set by resizing the section's height) both count — so children fill/shrink with the floor.
  // …and a GRID CELL is definite too, though it stores nothing: the row hands it a height (`hostSizedFor`).
  // Without this clause a block dropped into a cell hugged its content and left the rest of the cell empty.
  const parentDefinite = (!!parentMain && parentMain !== "auto" && parentMain !== "fill") || (!isRow && !!parent.minHeight) || (!isRow && hostSized);
  // When the child has no explicit MAIN size and the parent's main axis is DEFINITE (e.g. a section with a
  // set height), the child FILLS + follows the parent (`1 1 auto`: grow to fill, shrink to fit, content
  // basis) — so shrinking the parent's height shrinks its children. Otherwise it hugs / uses its token
  // (keeps a hug-content parent, like the page, growing with content instead of stretching empty children).
  // A GRID FILLS WHAT IT IS PUT IN (see `fillsGivenHeight`). Only down the MAIN axis of a column parent —
  // `!isRow` — because in a row the main axis is width, and a grid should take its share of the width like
  // anything else, not all of it.
  const fillsMain = !isRow && fillsGivenHeight(child) && (!mainToken || mainToken === "auto");
  // A section of a ROW BAND fills its line ONLY when it is alone on it (`aloneOnItsLine`). Granting the grow
  // unconditionally looks equivalent and is not: grow spends leftover space, and narrowing a block is how a
  // line gets leftover space — so every block became un-shrinkable the moment it stopped sharing a full line.
  s.flex = fillsMain || ((!mainToken || mainToken === "auto") && parentDefinite)
    ? "1 1 auto"
    : flexForWidth(mainToken, !!parent.rowBand && isRow && aloneOnItsLine(parent, child));
  // A box can pin its OWN cross-axis alignment (used by edge-anchored resize to keep the far edge fixed
  // even when the parent centres/stretches its children).
  if (child.alignSelf) s.alignSelf = child.alignSelf;
  // By default a box HUGS its content (flex auto-minimum = content) — it can't be sized smaller than
  // what's inside it. When `clip` is on, OR the box is EMPTY (nothing inside), we drop the minimum so
  // it can be shrunk all the way down to ~1px (padding is clipped along with it).
  // A SCREEN HEIGHT counts as an explicit floor too. Without that clause an empty box lost it — and a hero is
  // empty right up until you put something in it, so "make this section full screen" appeared to do nothing
  // at the exact moment a person would try it.
  //
  // …BUT NOT ALL THE WAY TO NOTHING, unless the user asked for that.
  //
  // An empty box has nothing inside to hold it open, so with a zero minimum it collapses to whatever its
  // parent has spare — and in a parent that has been GIVEN a height, what it has spare is that height split
  // between however many children there are. Measured: six blocks added one at a time into a 200px stack
  // came out 159 · 79 · 53 · 40 · 32 · **26px**. At 26px you cannot tell what a block is, and its four
  // resize handles sit on top of one another, so the block you just added is neither visible nor grabbable.
  //
  // The same six added to an UNSIZED parent are 128px each and the parent grows to hold them — correct, and
  // the reason this hid for so long: every test for it, and the editor's own courtesy height, used a parent
  // nobody had resized. The bug lives entirely in the state a user reaches by resizing something, which is
  // to say the normal one.
  //
  // So the floor is small rather than generous — enough to see and to grab, not enough to fight a parent
  // somebody sized. A 200px stack with six blocks in it becomes 240px rather than 768px.
  //
  // TWO THINGS THE FLOOR MUST NEVER DO, and they are the reason for the conditions rather than a flat value:
  //   • override a size the user set. `minHeight`, `height` and `screenHeight` are all somebody's decision,
  //     and a decision wins however small it is.
  //   • override `clip`, which IS the explicit "let this shrink past its content" opt-in. It keeps its zero.
  // A box holding only ZERO-HEIGHT content gets the floor too, and for the same reason it exists: a stack
  // whose sole content is a divider came out 2px tall — correct arithmetic, and impossible to click, select
  // or drag by any of its handles. `holdsNothingTall` is the broader question, `isEmptyBox` the special case
  // of it, and only the empty one also wants its width floored.
  // A box holding only ZERO-HEIGHT content gets the floor too, for the reason the floor exists: a stack
  // whose sole content is a divider came out 2px tall — correct arithmetic, and impossible to click, select
  // or drag by any of its handles. `holdsNothingTall` is deliberately NARROW: whether a box is EMPTY is
  // `isEmptyBox`'s question, and treating the two as one floored a box holding an empty grid, which has a
  // rule of its own ("a box holding an empty grid shrinks too").
  if (!child.clip && !isEmptyBox(child) && holdsNothingTall(child)
      && child.minHeight == null && child.height == null && !child.screenHeight) {
    s.minHeight = EMPTY_BOX_MIN;
  }
  /**
   * A GRID WITH NOTHING TO SHARE KEEPS A FLOOR — unless you have sized the box it is in.
   *
   * That second clause is the whole design, and it took two attempts to find. Flooring the grid's CELLS
   * fixes the collapse and breaks a rule with its own tests: "a box holding an EMPTY GRID shrinks too", so
   * that a box can be dragged small. A floor on the cells survives the box's resize and blocks it.
   *
   * Reading the PARENT settles both. Squeeze the box and it gains an explicit height — a decision — so the
   * courtesy stands aside and the grid shrinks with it, exactly as that rule requires. Leave the box alone,
   * as a freshly added child stack is, and the grid keeps a height you can see and grab. One is a size
   * somebody chose; the other is the absence of one.
   */
  /**
   * A GRID WITH NOTHING TO SHARE KEEPS A FLOOR — unless you have sized the box it sits in.
   *
   * A grid's rows share whatever height the grid has. Given none — a grid in a stack that hugs its content
   * — there is nothing to share: the cells are 0, the grid is 0, and the stack collapses with it. Measured:
   * adding a Grid inside a child stack left the stack under 8px, reported as "the inner child breaks".
   *
   * The second clause is what lets this coexist with a rule that says the opposite. `empty-box-height`
   * asserts "a box holding an EMPTY GRID shrinks too", so a box can be dragged small; squeezing that box
   * gives it an explicit height, and a courtesy must always yield to a size somebody chose.
   *
   * `hostSized` and not "any ancestor sized" — see `hostSizedFor`. The reported case has an outer stack
   * that IS sized, so the broader question answers yes and the collapse survives it.
   */
  if (!hostSized && !child.clip && gridHasNothingToShare(child)
      && child.minHeight == null && child.height == null && !child.screenHeight) {
    /**
     * ONE FLOOR PER ROW, because the rows share whatever the grid gets.
     *
     * A single floor is the right answer for one row and the wrong one for four: a 2×2 grid handed 40px
     * splits it into two 20px rows, which is back under the size at which a cell can be seen or grabbed —
     * the very thing the floor exists to prevent. The grid asks for as much as its rows need.
     */
    const track = Math.max(1, gridColumns(child));
    const used = (child.children ?? []).reduce((n, c) => n + Math.max(1, Math.round(c.colSpan ?? 1)), 0);
    const rows = Math.max(1, Math.ceil(used / track));
    s.minHeight = rows > 1 ? `calc(${EMPTY_BOX_MIN} * ${rows})` : EMPTY_BOX_MIN;
  }
  if (child.clip || isEmptyBox(child)) {
    const floor = child.clip ? 0 : EMPTY_BOX_MIN;
    // Width: only where the user has not stated one. A stored width ("50%", "fill") is already an answer.
    s.minWidth = child.width == null || child.width === "auto" ? floor : 0;
    // Height: keep an EXPLICIT resize floor; only replace the content-min when there is none.
    if (child.minHeight == null && child.height == null && !child.screenHeight) s.minHeight = floor;
    else if (child.minHeight == null && !child.screenHeight) s.minHeight = 0;
  }
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
  // …and pinning after even that — see the matching line in the grid branch above.
  Object.assign(s, pinCSS(child, parent, bp));
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

// ── Pinning: a block that stays put while the page scrolls ───────────────────

/**
 * THE ONE RESOLVER for pinning — `radiusCSS`'s rule, for the same reason.
 *
 * The canvas and the export must agree about a pinned block or the builder is lying about the published
 * page, and they agree here by both calling `childStyle`, which calls this. Nothing else may write
 * `position: sticky`.
 *
 * `sticky` and not `fixed`, deliberately. A fixed block leaves the document entirely — it is measured
 * against the viewport, so it escapes its column, ignores the page's gutters and sits on top of whatever
 * scrolls beneath it. Sticky stays a member of its parent: it occupies its space in the flow, holds itself
 * against the named edge while its PARENT is on screen, and leaves with the parent. That is what "a sidebar
 * that follows you down the page" actually means, and it is also what makes it safe — a sticky block cannot
 * cover the footer, because it stops when its parent does.
 *
 * TWO THINGS ARE NOT NEGOTIABLE, and both are one-line clauses here:
 *
 *  1. **A floating block is never pinned.** `position: absolute` and `position: sticky` are the same
 *     property, so a block carrying both would have whichever the object spread wrote last — which is to
 *     say, whichever the reader of that code happened to order first. Free positioning wins, because the
 *     user placed that block by hand and sticky would silently move it.
 *
 *  2. **The edge is an offset, not a side.** `top` for a block pinned to the top, `bottom` for the bottom.
 *     Writing both (or neither) is how a sticky block ends up inert — present in the CSS, doing nothing —
 *     which is the defect class this project keeps meeting.
 *
 * `PAGE_Z.sticky` comes from the stacking ladder rather than a literal, so a pinned block sits above
 * ordinary flow content and still cannot reach the editor's chrome.
 */
/**
 * A WRAPPER BAND TAKES ON ITS ONLY CHILD'S PIN — because otherwise the child has nowhere to travel.
 *
 * The builder gives every top-level block its own band, so a user who pins a header produces
 * `root › band › header` where the band HUGS the header: parent 64px, child 64px, travel 0px. The header
 * is correctly `position: sticky` and scrolls away with the page, for the same reason a stretched rail does.
 *
 * Measured: alone in its band a pinned nav lost the whole 700px it was scrolled; with the pin moved up to
 * the band it moved 8px and held. The band's own parent is the page, which is as tall as the site.
 *
 * This is the shape of bug this project keeps meeting from ONE cause — a test that builds its tree by hand.
 * The guard for pinning put the header and the body in a single band, which is a page no user can make, and
 * every assertion in it passed while the real thing did nothing.
 *
 * Only a band that HUGS. A band carrying its own height gives its child real travel, and hoisting there
 * would change a working case into a different one — the whole band would stick instead of the block.
 * Returns the child whose pin is being carried, so both sides of the decision read from one function.
 *
 * AT THE RUNG BEING DRAWN. `resolveResponsive` resolves a node and not its children, so the band arrived with
 * its children as the DESKTOP had them. A pin set only on phones was therefore never carried — the block went
 * sticky inside a band that hugs it, the zero-travel shape above, and did nothing — while a pin turned OFF on
 * phones was still carried, so the band went on sticking. Resolving each child here is the whole fix.
 */
export function bandCarriesPin(band: BoxNode, bp: Breakpoint = "base"): BoxNode | null {
  if (!band.rowBand || band.pin || band.minHeight != null || band.height != null) return null;
  const inFlow = (band.children ?? []).map((k) => resolveResponsive(k, bp)).filter((k) => !isFloating(k));
  const only = inFlow.length === 1 ? inFlow[0] : null;
  // STICKY ONLY. The hoist exists to buy TRAVEL inside a parent, and a fixed block does not travel inside
  // anything — it is measured against the viewport. Hoisting it would move the pin onto a band that is not
  // the thing the user pinned, for no gain at all.
  return only?.pin && (only.hold ?? "sticky") === "sticky" ? only : null;
}

/** Which physical edges a pin names. A corner is two, which is why only `fixed` may use one. */
const PIN_EDGES: Record<NonNullable<BoxNode["pin"]>, ("top" | "right" | "bottom" | "left")[]> = {
  top: ["top"], right: ["right"], bottom: ["bottom"], left: ["left"],
  "top-left": ["top", "left"], "top-right": ["top", "right"],
  "bottom-left": ["bottom", "left"], "bottom-right": ["bottom", "right"],
};

/**
 * The one edge a STICKY block may hold, whatever the stored value says.
 *
 * Sticky is measured against a scroll container, and a page scrolls vertically — so `left`/`right` need a
 * horizontally scrolling parent, which is never what "a rail on the right" means, and a CORNER writes two
 * insets, which is precisely how a sticky block ends up inert (the clause above). The UI offers neither for
 * sticky, but the model can still hold one after a user switches from fixed back to sticky, so it resolves
 * here rather than trusting the control to have tidied up.
 */
const stickyEdge = (pin: NonNullable<BoxNode["pin"]>): "top" | "bottom" =>
  PIN_EDGES[pin].includes("bottom") ? "bottom" : "top";

/**
 * The marker both renderers put on a block that holds its place: which edge it is held against.
 *
 * It names the VERTICAL edge only, because that is the axis bars stack down. A block pinned to `left` or
 * `right` alone spans the height and has nothing to stack under, so it carries no marker and the pass never
 * sees it.
 *
 * The same standing-down rule as `pinCSS`: when a band is carrying the pin on its child's behalf, the marker
 * belongs on the band, since the band is the element that will actually be `fixed` or `sticky`.
 */
export function pinStackAttr(node: BoxNode, parent?: BoxNode, bp: Breakpoint = "base"): "top" | "bottom" | null {
  if (parent && bandCarriesPin(parent, bp)?.id === node.id) return null;
  const src = bandCarriesPin(node, bp) ?? node;
  if (!src.pin) return null;
  if (src.position === "absolute" || node.position === "absolute") return null;
  /**
   * ONLY "FLOATS ON SCREEN" STACKS — `hold: "fixed"` — AND NOT "STICKS WHEN REACHED".
   *
   * Scoped deliberately, and a guard caught the version that was not. A fixed block is held against the
   * WINDOW, so every fixed block on a page shares one coordinate space and "which is above which" has an
   * answer. A sticky block is held against its own scroll container and keeps its place in the layout, so two
   * sticky blocks in two different sections are never on screen as a pair — stacking them would move a block
   * for a collision that cannot happen.
   *
   * Reaching for them anyway did exactly that: a fixture with a sticky rail in one band and another in a
   * second band had its blocks shoved 160px down the page, and `pinning-warnings.spec.ts` failed because the
   * block it clicks was no longer where it had been drawn.
   *
   * Making sticky stack properly means asking WHICH scroll container each block resolves against — Step 2e's
   * shared resolver, which is not built. Until it is, this answers the case that was actually reported:
   * three bands all set to stay on screen, all held to the top, all on top of one another.
   */
  if ((src.hold ?? "sticky") !== "fixed") return null;
  // Bars queue DOWN a screen, never across it, so a pure left/right rail joins no stack.
  if (!PIN_EDGES[src.pin].some((e) => e === "top" || e === "bottom")) return null;
  return stickyEdge(src.pin);
}

/**
 * ONE measuring pass that stacks the pinned bars, as plain DOM.
 *
 * THE CANVAS CALLS THIS FUNCTION AND THE EXPORT SHIPS ITS SOURCE, exactly as `masonryMeasurePass` does, and
 * for the same reason: two implementations of one algorithm is a canvas ≠ export bug with a delay on it.
 *
 * WHY A MEASUREMENT IS UNAVOIDABLE. To put the second bar under the first, its offset must be the first
 * bar's RENDERED height — and CSS cannot ask that question. The two alternatives were considered and are
 * worse: summing the heights the user happened to TYPE is silently wrong for a bar whose height is just its
 * text (the common case) and wrong again at any width where that text wraps to a second line; and refusing to
 * stack at all leaves the reported bug in place.
 *
 * IT READS THE COMPUTED POSITION RATHER THAN THE MARKUP, which is what makes it right per device for free. A
 * bar whose pin is turned off at the phone rung still carries `data-eu-pin` — the attribute is static — but
 * its computed `position` is not `fixed` or `sticky` there, so it takes up no room in the stack. A guess from
 * the breakpoint would have had to be kept in step with the CSS; a measurement cannot drift from it.
 *
 * Setting the property cannot feed back into the measurement: `--eu-pin-above` moves a bar's inset, and an
 * inset does not change a height. One pass settles, and there is nothing here to ratchet.
 */
export function pinStackPass(root: ParentNode): void {
  const all = Array.from(root.querySelectorAll("[data-eu-pin]")) as HTMLElement[];
  // Cleared first, every time: a bar that has stopped being pinned at this width would otherwise keep the
  // offset it was given at the last one, and sit that far down the screen for no visible reason.
  for (const el of all) el.style.removeProperty("--eu-pin-above");
  for (const edge of ["top", "bottom"]) {
    const held = all.filter((el) => {
      if (el.getAttribute("data-eu-pin") !== edge) return false;
      /**
       * `absolute` IS ON THIS LIST BECAUSE THE CANVAS CANNOT USE `fixed` AT ALL.
       *
       * The builder's page frame declares `container-type: inline-size` — which is what makes container
       * queries work — and that makes it the containing block for anything fixed inside it. So the editor
       * renders a held block as `absolute` with a computed offset (`canvasFixedStyle`) instead.
       *
       * Measured before this line existed: on the exported page the three bars stacked correctly, and on the
       * canvas all three sat at the same 88px with `--eu-pin-above` never set — canvas ≠ export, in the
       * direction where the editor lies to you, which the Definition of Done forbids outright.
       *
       * Widening it costs nothing, because the filter has already required `data-eu-pin`, and that marker is
       * only ever written for a block that is pinned, held FIXED, and not freely positioned. So an absolute
       * element carrying this marker is a canvas-held bar and nothing else.
       */
      const p = getComputedStyle(el).position;
      return p === "fixed" || p === "sticky" || p === "absolute";
    });
    // Down the page for a top edge; up it for a bottom one — in both cases, nearest the edge is first.
    const order = edge === "top" ? held : held.slice().reverse();
    let above = 0;
    for (const el of order) {
      el.style.setProperty("--eu-pin-above", above + "px");
      above += el.getBoundingClientRect().height;
    }
  }
}

/**
 * The script the export ships for the stacking — one guarded global, in the established pattern.
 *
 * Zero JS stays the default: `pinStackNeeded` decides, and a page with fewer than two bars at one edge gets
 * nothing at all. It re-runs whenever a height it measured could have changed — the window resizing, the web
 * fonts landing — because each of those lands after the first pass and silently invalidates it.
 */
export function pinStackScript(): string {
  return `<script>(function(){if(window.__euPinStack)return;window.__euPinStack=1;
var pass=${String(pinStackPass)};
var queued=0;
function all(){queued=0;try{pass(document);}catch(e){}}
function soon(){if(queued)return;queued=1;requestAnimationFrame(all);}
soon();
addEventListener('resize',soon);
addEventListener('load',soon);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(soon).catch(function(){});
})();</script>`;
}

/**
 * Does this page actually stack pinned bars? Two or more held against the SAME edge, at any rung.
 *
 * Every rung is checked, not just the base: "a header on desktop and an announcement bar on phones" is two
 * bars that never meet, and shipping a script for it would be paying for nothing. The reverse matters more —
 * a stack that only exists at one rung still needs the script at that rung.
 */
const PIN_RUNGS: Breakpoint[] = ["base", "phone", "tabletPortrait", "tabletLandscape", "wide"];

/**
 * The marker for the MARKUP — which is written once and must serve every rung.
 *
 * The CSS is emitted per rung; the HTML is not. So this asks "is this block held at ANY width?", and the
 * script sorts out where it actually holds by reading the computed position at the width in front of it.
 *
 * Known limit, written down rather than left to be found: a block held at the TOP on a desktop and at the
 * BOTTOM on a phone can only carry one edge in one attribute, and takes the first rung that pins it. Nothing
 * in the Inspector encourages that, and the cost if someone does it is a bar that does not join the stack at
 * one rung — not a broken page.
 */
export function pinStackMarker(node: BoxNode, parent?: BoxNode): "top" | "bottom" | null {
  for (const bp of PIN_RUNGS) {
    const edge = pinStackAttr(node, parent, bp);
    if (edge) return edge;
  }
  return null;
}

export function pinStackNeeded(root: BoxNode): boolean {
  for (const bp of PIN_RUNGS) {
    const count = { top: 0, bottom: 0 };
    const walk = (n: BoxNode, parent?: BoxNode): void => {
      const edge = pinStackAttr(n, parent, bp);
      if (edge) count[edge]++;
      for (const k of n.children ?? []) walk(k, n);
    };
    walk(root);
    if (count.top > 1 || count.bottom > 1) return true;
  }
  return false;
}

export function pinCSS(node: BoxNode, parent?: BoxNode, bp: Breakpoint = "base"): CSSProperties {
  // The child half of the hoist above: it stands down so the band alone writes `position`.
  if (parent && bandCarriesPin(parent, bp)?.id === node.id) return {};
  // The band half: it pins on behalf of the child it wraps, at that child's edge and offset.
  const src = bandCarriesPin(node, bp) ?? node;
  if (!src.pin) return {};
  if (src.position === "absolute" || node.position === "absolute") return {}; // clause 1 — free positioning wins
  const fixed = (src.hold ?? "sticky") === "fixed";
  const offset = u(src.pinOffset ?? 0);
  const css: CSSProperties = { position: fixed ? "fixed" : "sticky", zIndex: PAGE_Z.sticky };
  /**
   * CLAUSE 5 — A FIXED BLOCK HAS TO BE GIVEN ITS WIDTH, because nothing else will.
   *
   * Out of flow, a block takes no size from the row, band or grid it came from: `flex-basis` and
   * `grid-column` simply do not reach it. Measured on BOTH engines before this line existed, a full-width
   * bar set to "Floats on screen" rendered **0px wide** — an invisible block on the canvas, unclickable, and
   * an invisible block on the published page. The feature shipped that way, and its guards passed, because
   * every one of them measured WHERE the bar was and never how wide.
   *
   * The floating (`position: absolute`) branch of both renderers has always written the width itself for
   * exactly this reason; fixed is the same shape of thing and now does it in the one resolver. A width of
   * `auto` is left alone: that is a block told to hug its content, and a chat bubble or an "Apply now"
   * button should be exactly as wide as what is in it.
   */
  if (fixed) {
    const w = sizeToCSS(src.width);
    if (w) css.width = w;
  }
  /**
   * CLAUSE 6 — TWO BARS HELD AT THE SAME EDGE SIT UNDER ONE ANOTHER, NOT ON TOP OF EACH OTHER.
   *
   * Reported by the user: three bands each set to stay on screen all pinned to the top and covered each
   * other, so two of the three were simply invisible. Every one of them is doing exactly what it was told —
   * "hold against the top" — and with one offset each, the top is where they all go.
   *
   * The vertical inset therefore carries `--eu-pin-above`: how much pinned bar is already stacked at this
   * edge. The horizontal insets of a CORNER do not, because bars stack down a screen and not across it.
   *
   * `var(--eu-pin-above, 0rem)` is the whole compatibility story. Nothing sets that property until the
   * measuring pass runs, so a page without it behaves precisely as it did before — the bars overlap, which is
   * the state this is improving on rather than a regression. See `pinStackPass` for why a measurement is
   * unavoidable here.
   */
  const stacked = `calc(var(--eu-pin-above, 0rem) + ${offset})`;
  const vertical = stickyEdge(src.pin);
  // Fixed may hold a corner — two insets against the viewport. Sticky gets exactly one, resolved above.
  if (fixed) for (const edge of PIN_EDGES[src.pin]) css[edge] = edge === vertical ? stacked : offset;
  else css[vertical] = stacked;
  /**
   * CLAUSE 3 — A BLOCK STRETCHED TO ITS PARENT'S HEIGHT HAS NOWHERE TO TRAVEL.
   *
   * Sticky moves a box WITHIN its parent. A row and a grid both hand their children the full height of the
   * line or the row (`align-items: stretch`, which is the initial value for both), so a pinned child is made
   * exactly as tall as the thing beside it and has zero room to move. The CSS is present and correct and the
   * block simply scrolls away — the same shape of silent failure as clause 2 above.
   *
   * Measured before this line existed: a 200px rail beside 2400px of content was itself 2400px tall, giving
   * it 0px of travel. It could not have held even with a working scroll container.
   *
   * Only where the parent WOULD stretch it. In a column the cross axis is horizontal, so `align-self` there
   * governs WIDTH — writing it would shrink a full-width pinned header to the width of its text, which is a
   * different bug in exchange for this one.
   *
   * It overrides a stretch the user may have set, and that is deliberate: stretching and pinning are not
   * both satisfiable, and pinning is the thing they asked for. `flex-start` rather than `start` to match
   * every other alignment this file writes; it is valid in grid too.
   */
  // …and only for STICKY. A fixed block is out of the flow, so its parent's alignment reaches it no more
  // than its parent's width does — writing `align-self` there would be a declaration about nothing.
  const stretchesChildren = !fixed && !!parent && (parent.layout === "grid" || (parent.direction ?? "column") === "row");
  if (stretchesChildren) css.alignSelf = "flex-start";
  return css;
}

// ── Arrival: what changes once the page has moved under a pinned block (Step 2b) ─────────────────────

export type PinArrival = NonNullable<BoxNode["pinArrival"]>;

/** The five arrivals, in the order they are offered. Absent is the default and changes nothing. */
export const PIN_ARRIVALS: { id: PinArrival; label: string; hint: string }[] = [
  { id: "shadow", label: "Shadow", hint: "lifts off the page" },
  { id: "solid", label: "Solid", hint: "fills in behind it" },
  { id: "glass", label: "Glass", hint: "frosted, with the page showing through" },
  { id: "rule", label: "Rule", hint: "a hairline underneath" },
  { id: "condense", label: "Condense", hint: "it gets shorter" },
];

/** How much scrolling an arrival takes by default, in px at ordinary text size — the distance Elementor uses. */
export const PIN_ARRIVAL_AFTER = 120;

/**
 * A SCROLL DISTANCE IS NOT A LAYOUT SIZE, and `u()` — the builder's fluid unit — is the wrong tool for it.
 *
 * Measured: `--box-u` resolves to `clamp(0.4375rem, 1cqw, 0.875rem)`, which is deliberately tied to the
 * CONTAINER'S WIDTH, so "50 units of scrolling" came out as 64px and an arrival the user had set to take
 * 500px of scroll was over in 64. Scrolling has nothing to do with how wide a box is.
 *
 * `remLen` instead — the file's existing px→rem converter: it scales with the reader's own text size, which
 * is what a scroll distance should follow, and it keeps the rule that no stored pixel reaches the page.
 */
const scrollLen = (px: number) => remLen(px);

/**
 * THE CANVAS CANNOT USE `position: fixed` AT ALL — and must still SHOW what it does.
 *
 * Reported by the user, and reproduced exactly: a block set to float on screen kept its place on the
 * published page and scrolled away in the editor, travelling the full 600px of a canvas scroll. The reason
 * is not a bug that can be removed. A fixed box is measured against the viewport UNLESS an ancestor carries
 * a transform, a filter or a `container-type` — and the builder's page frame declares
 * `container-type: inline-size`, because that is what makes container queries work at all. So inside the
 * canvas, fixed is always captured by the frame, which scrolls with the page. Removing the containment
 * would only hand the block to the frame above it; taking the container-type away would break every
 * component's responsiveness.
 *
 * So the canvas stops pretending and simulates instead: the block stays positioned in the page and is
 * offset by however far the canvas has been scrolled, which is what "it does not move on screen" means.
 * The export keeps real `position: fixed`; this is the editor's picture of it, from the same declarations.
 *
 * `translate` rather than `transform` for the bottom case: a block may carry a tilt, and `transform` is
 * where that lives — writing it here would silently erase it.
 */
export function canvasFixedStyle(css: CSSProperties): CSSProperties {
  if (css.position !== "fixed") return css;
  /**
   * THE PAGE IS INSET INSIDE THE CANVAS, AND THE OFFSET HAS TO PAY FOR IT.
   *
   * Reported second time round: a bar placed flush against the top of the page held with a visible gap
   * above it once the canvas was scrolled. The block is positioned inside the PAGE, and the page sits a
   * padding's width below the top of the scrolling area — so "the scroll" alone holds it level with where
   * the page's top edge used to be, not with the top of what is on screen. `--canvas-top` is that inset,
   * and taking it off puts the block against the visible edge, which is what the window does on the
   * published page. `max(0px, …)` keeps it honest before the page's top has scrolled away at all: there
   * the page top IS the top of the view, and the block belongs exactly where it was placed.
   */
  /**
   * …AND LESS WHERE THE BLOCK'S OWN HOLDER SITS. An absolute box is measured from its nearest POSITIONED
   * ancestor, which for a block in the layout is the band it lives in — not the page. A bar in the first
   * band is a few pixels from the page's top, so it looked right and the guard passed; a block further down
   * landed at its band instead, measured 1,488px down the page. `--holder-top` is that distance, written on
   * the element by the canvas, so every held block is measured from the same origin the window would use.
   */
  const scroll = "max(0px, var(--canvas-scroll, 0px) - var(--canvas-top, 0px)) - var(--holder-top, 0px)";
  const view = "var(--canvas-h, 100%)";
  const { bottom, ...rest } = css;
  const out: CSSProperties = { ...rest, position: "absolute" };
  if (bottom != null) {
    // Held against the bottom of the screen: the scroll, plus the height of the visible canvas, less the
    // distance from that edge — then pulled back by its own height, which only `translate` knows.
    out.top = `calc(${scroll} + ${view} - (${String(bottom)}))`;
    out.translate = "0 -100%";
  } else {
    out.top = `calc(${scroll} + (${String(css.top ?? "0px")}))`;
  }
  return out;
}

/**
 * A FLOATED BLOCK CAN STILL BE LIFTED TO THE WINDOW — and only to the window.
 *
 * Asked directly: "if I float a stack and then make it sticky or fixed, it should work, right?" For FIXED,
 * yes, and it was refused only because clause 1 threw away the pin for anything floating. Measured on a real
 * page: the same block emitted as `fixed` travelled 0px over a 900px scroll while the `absolute` one lost
 * the whole 900. Free placement and floating on screen are not in conflict — the place you dragged it to
 * simply becomes the place it holds.
 *
 * For STICKY they ARE in conflict, and the measurement says why rather than the spec: forced to `sticky`,
 * the block returns to its position in the FLOW and starts taking space again — it stops being where you
 * put it. Sticky holds a box relative to where it sits in the document, and a floated block does not sit
 * there. Making that work needs a zero-height sticky wrapper around it, a structural edit to the user's
 * tree — the same reason "hold until a block you choose" is deferred. The Inspector says so instead.
 */
export function floatHoldCSS(node: BoxNode): CSSProperties {
  if (!isFloating(node) || !node.pin || (node.hold ?? "sticky") !== "fixed") return {};
  const css: CSSProperties = { position: "fixed" };
  // Measured at the moment it was lifted, so it does not jump — see `pinX`/`pinY`. Absent (an older page,
  // or a tree built by hand) leaves the float's own left/top in place rather than moving it somewhere new.
  if (node.pinX != null) css.left = remLen(node.pinX);
  if (node.pinY != null) css.top = remLen(node.pinY);
  return css;
}

const ARRIVE_SHADOW = "0 0.6rem 1.4rem rgba(2, 6, 23, 0.20)";
const ARRIVE_RULE = "0 1px 0 0 var(--eu-color-border, #e2e7ee)";
const ARRIVE_SURFACE = "var(--eu-color-surface, #ffffff)";

/**
 * ONE SET OF KEYFRAMES PER ARRIVAL, and the per-block values ride in custom properties.
 *
 * A keyframes block per pinned block would be the easy way and the wrong one: the same page can pin several
 * blocks, and each would carry a near-identical copy of the same animation. The properties a block differs
 * in — the shadow it already had, the colour it fills to, the height it condenses from — are variables set
 * on the block itself, which is also what keeps the canvas and the export reading from one definition.
 */
const PIN_ARRIVAL_KEYFRAMES: Record<PinArrival, string> = {
  shadow: `@keyframes eu-arrive-shadow{from{box-shadow:var(--eu-arrive-rest,none)}to{box-shadow:var(--eu-arrive-on,${ARRIVE_SHADOW})}}`,
  rule: `@keyframes eu-arrive-rule{from{box-shadow:var(--eu-arrive-rest,none)}to{box-shadow:var(--eu-arrive-on,${ARRIVE_RULE})}}`,
  solid: `@keyframes eu-arrive-solid{from{background-color:transparent}to{background-color:var(--eu-arrive-bg,${ARRIVE_SURFACE})}}`,
  // Both spellings: Safari still needs the prefix, and a bar that is meant to be frosted must not simply be
  // transparent there — the background-color half carries the look on its own if the blur never applies.
  glass: `@keyframes eu-arrive-glass{from{background-color:transparent;-webkit-backdrop-filter:blur(0);backdrop-filter:blur(0)}`
    + `to{background-color:var(--eu-arrive-bg,color-mix(in srgb, ${ARRIVE_SURFACE} 72%, transparent));-webkit-backdrop-filter:blur(0.6rem);backdrop-filter:blur(0.6rem)}}`,
  condense: `@keyframes eu-arrive-condense{from{padding-block:var(--eu-arrive-pad-rest,0);min-height:var(--eu-arrive-h-rest,auto)}`
    + `to{padding-block:var(--eu-arrive-pad-on,0);min-height:var(--eu-arrive-h-on,auto)}}`,
};

/** The keyframes a page actually uses — emitted once, exactly like the entrance effects. */
export function pinArrivalKeyframes(used: Set<PinArrival | string>): string {
  return [...used].map((id) => PIN_ARRIVAL_KEYFRAMES[id as PinArrival] ?? "").join("");
}

/** The vertical padding a block rests at, in base units — both sides, per-side winning over the shorthand. */
const ownPadBlock = (node: BoxNode): number =>
  Math.max(node.paddingTop ?? node.padding ?? 0, node.paddingBottom ?? node.padding ?? 0);

/**
 * CONDENSE NEEDS SOMETHING TO CONDENSE. A bar whose height is simply its text has no padding and no
 * min-height, so "it gets shorter" would be a promise the page never keeps — and a control that appears to
 * work and does nothing is the defect this project meets most. The Inspector asks this and says so.
 */
export function pinArrivalHasEffect(node: BoxNode): boolean {
  if (!node.pinArrival) return false;
  if (node.pinArrival !== "condense") return true;
  return ownPadBlock(node) > 0 || (node.minHeight ?? 0) > 0;
}

/** A block's own colour, when it has a flat one to fill to — a gradient or a photo is not a colour. */
const flatColour = (bg?: string): string | null =>
  bg && !bg.startsWith("gradient:") && !bg.startsWith("url(") && !bg.includes("linear-gradient") ? bg : null;

/** The per-block variables one arrival needs: what it looks like at rest, and what it becomes. */
function arrivalVars(node: BoxNode, fx: PinArrival): string {
  const rest = node.shadow ? SHADOW_CSS[node.shadow] : "none";
  const add = (extra: string) => (rest === "none" ? extra : `${rest}, ${extra}`);
  switch (fx) {
    // The block KEEPS the shadow it already had and gains the arrival on top, rather than having its own
    // design overwritten by an effect — the two are different decisions.
    case "shadow": return `--eu-arrive-rest:${rest};--eu-arrive-on:${add(ARRIVE_SHADOW)}`;
    case "rule": return `--eu-arrive-rest:${rest};--eu-arrive-on:${add(ARRIVE_RULE)}`;
    case "solid": return `--eu-arrive-bg:${flatColour(node.background) ?? ARRIVE_SURFACE}`;
    case "glass": return `--eu-arrive-bg:color-mix(in srgb, ${flatColour(node.background) ?? ARRIVE_SURFACE} 72%, transparent)`;
    case "condense": {
      const pad = ownPadBlock(node), h = node.minHeight ?? 0;
      // 60% of itself, with a floor: the research is blunt that a bar on a phone lives between 48 and 56px,
      // and condensing past that trades one problem for a smaller tap target.
      const padOn = pad ? Math.max(pad * 0.4, 0) : 0;
      const hOn = h ? Math.max(h * 0.6, 48) : 0;
      return `--eu-arrive-pad-rest:${u(pad)};--eu-arrive-pad-on:${u(padOn)}`
        + (h ? `;--eu-arrive-h-rest:${u(h)};--eu-arrive-h-on:${u(Math.min(hOn, h))}` : "");
    }
  }
}

/**
 * ONE BLOCK'S ARRIVAL — the single resolver, called by the canvas and the exporter, like everything else
 * about pinning.
 *
 * The timeline is the SCROLL of the nearest scroll container over a distance, not `scroll-state(stuck:)`:
 * that would be the exact question to ask, and it is Chrome and Edge only at ~72%, needs a wrapper because
 * an element cannot query its own state, and would leave Safari and Firefox showing nothing. A scroll
 * timeline is ~84% and includes Firefox, and this codebase already ships one for entrances.
 *
 * It is emitted on the BLOCK, never on the band that may be carrying the pin: the band is transparent
 * scaffolding, so a colour filling in there would sit behind the block's own background and be invisible.
 * The trigger is the page's scroll, which does not care which element holds the position.
 */
export function pinArrivalCss(scope: string, node: BoxNode): string {
  const fx = node.pinArrival;
  if (!fx || !node.pin || !pinArrivalHasEffect(node)) return "";
  const after = scrollLen(node.pinArrivalAfter ?? PIN_ARRIVAL_AFTER);
  let css = `${scope}{${arrivalVars(node, fx)}}`;
  /**
   * AN ENTRANCE AND AN ARRIVAL ARE TWO DECISIONS, AND THE ELEMENT CAN ONLY HAVE ONE `animation-name` RULE.
   *
   * `revealCss` writes the entrance on this same block, so the rule emitted LAST takes the element over
   * completely. Measured in a browser with both chosen: the only animation running was the arrival, and the
   * entrance the user had picked was simply gone. Nothing errored, and the editor showed the same.
   *
   * Both are therefore declared here, in one rule, as the lists CSS was designed for — this rule is emitted
   * after the entrance's by both engines, so it is the one that stands. Staggered entrances are untouched:
   * those animate the block's CHILDREN, which never collide with the block's own arrival.
   */
  const rev = node.revealStagger ? null : revealEffect(node.revealEffect);
  const names = rev ? `eu-reveal-${rev.id},eu-arrive-${fx}` : `eu-arrive-${fx}`;
  const durs = rev ? `${REVEAL_DUR},auto` : "auto";
  const eases = rev ? `${REVEAL_EASE},linear` : "linear";
  const fills = rev ? "both,both" : "both";
  const timelines = rev ? `${node.revealScroll ? "view()" : "auto"},scroll()` : "scroll()";
  const ranges = rev ? `${node.revealScroll ? REVEAL_VIEW_RANGE : "normal"},0 ${after}` : `0 ${after}`;
  /**
   * LONGHANDS, and `animation-duration: auto` written out. The `animation` shorthand resets duration to 0s,
   * and a 0s animation on a progress timeline is finished before the range begins — the arrival would appear
   * fully applied from the very first pixel. `auto` is what makes the animation take the whole range.
   */
  css += `@supports (animation-timeline: scroll()){${scope}{`
    + `animation-name:${names};animation-duration:${durs};animation-timing-function:${eases};`
    + `animation-fill-mode:${fills};animation-timeline:${timelines};animation-range:${ranges}}}`;
  // Decorative, so reduced motion simply gets the resting look. Nothing is lost: the block is still pinned.
  css += `@media (prefers-reduced-motion:reduce){${scope}{animation:none !important}}`;
  return css;
}

/** Every arrival rule in a tree, plus one copy of each keyframes it needs — the canvas's half. */
export function treePinArrivalCss(node: BoxNode, scopeFor: (id: string) => string): string {
  const used = new Set<PinArrival>();
  const walk = (n: BoxNode): string => {
    if (n.pinArrival && pinArrivalHasEffect(n)) used.add(n.pinArrival);
    return pinArrivalCss(scopeFor(n.id), n) + (n.children ?? []).map(walk).join("");
  };
  const rules = walk(node);
  return rules ? pinArrivalKeyframes(used) + rules : "";
}

/**
 * Does an ancestor stop this block from ever being FIXED? The mirror of `pinBlockedBy`, and sharper.
 *
 * `position: fixed` is measured against the viewport — UNLESS an ancestor carries `transform`, `filter`,
 * `backdrop-filter`, `perspective`, `will-change` or `container-type`. Any one of those makes that ancestor
 * the containing block, and the fixed element quietly holds itself against a box halfway down the page
 * instead. No error, no warning; it simply stops staying on screen.
 *
 * This builder emits three of them, and none of the three looks like it has anything to do with pinning:
 *
 *   • `container-type: inline-size` on every COMPONENT that is not hugging — the container queries that let
 *     a Card tighten its own padding in a narrow column.
 *   • `transform: rotate()` on any block given a TILT.
 *   • `backdrop-filter` on the Alert's GLASS design.
 *
 * So "my fixed bar stopped working when I tilted the section" is a sentence a user could otherwise never
 * explain. Returns the nearest offending ancestor so the inspector can name the block rather than say
 * "something above this".
 */
/**
 * Does THIS block make its own frame, capturing any fixed descendant? One predicate, two callers.
 *
 * The warning that names the offender and the canvas that decides whether to SHOW a block holding have to
 * agree exactly, or the editor tells you a bar will not stay on screen while drawing it staying on screen.
 * `transform`, `container-type` and `backdrop-filter` all do it, and this builder emits all three: a tilt,
 * every non-hugging component, and the glass Alert.
 */
export function capturesFixed(node: BoxNode): boolean {
  if (node.rotate) return true;                                   // transform: rotate()
  if (node.type === "component" && !hugsContent(node)) return true; // container-type: inline-size
  return !!node.variant?.includes("glass");                        // backdrop-filter
}

export function fixedBlockedBy(root: BoxNode, id: string, bp: Breakpoint = "base"): BoxNode | null {
  const walk = (node: BoxNode, trail: BoxNode[]): BoxNode[] | null => {
    const path = [...trail, node];
    if (node.id === id) return path;
    for (const kid of node.children ?? []) {
      const hit = walk(kid, path);
      if (hit) return hit;
    }
    return null;
  };
  // Every node AT THE RUNG being edited — a tilt or a pin set only on phones is as real as a desktop one.
  const path = walk(root, [])?.map((n) => resolveResponsive(n, bp));
  if (!path) return null;
  const self = path[path.length - 1];
  if (!self.pin || (self.hold ?? "sticky") !== "fixed") return null;
  // Nearest first. The block's OWN transform is irrelevant — an element does not contain itself — and the
  // page root is excluded, since containing a fixed block to the page is what the canvas does deliberately.
  for (let i = path.length - 2; i >= 1; i--) {
    if (capturesFixed(path[i])) return path[i];
  }
  return null;
}

/**
 * Does an ancestor of this block stop it from ever sticking?
 *
 * `position: sticky` is measured against the nearest **scroll container**, and `overflow: hidden` makes one.
 * So a pinned block inside a clipped ancestor is pinned to a box that never scrolls: the CSS is present,
 * correct and completely inert. Nothing errors, nothing warns, and the block simply scrolls away.
 *
 * This is not a rare corner. The wrapper clips whenever `clip` is set **or the block has a corner radius**
 * (canvas and export both), so rounding a section — an ordinary thing to do — would quietly switch off a
 * sticky sidebar inside it. A teacher would have no way to connect the two.
 *
 * Returns the nearest offending ancestor, so the inspector can name it rather than say "something above".
 */
export function pinBlockedBy(root: BoxNode, id: string, bp: Breakpoint = "base"): BoxNode | null {
  // The chain from the root down to the block, or null when it is not in this tree.
  const walk = (node: BoxNode, trail: BoxNode[]): BoxNode[] | null => {
    const path = [...trail, node];
    if (node.id === id) return path;
    for (const kid of node.children ?? []) {
      const hit = walk(kid, path);
      if (hit) return hit;
    }
    return null;
  };
  const path = walk(root, [])?.map((n) => resolveResponsive(n, bp)); // at the rung — see fixedBlockedBy
  if (!path) return null;
  const self = path[path.length - 1];
  if (!self.pin) return null;
  // Nearest first, and the block's OWN clipping is irrelevant — it is an ANCESTOR's scroll container that
  // captures it. The root is excluded: the page itself is the thing being scrolled.
  for (let i = path.length - 2; i >= 1; i--) {
    const a = path[i];
    if (a.clip || radiusCSS(a)) return a;
  }
  return null;
}

/**
 * WHERE A STICKY BLOCK LETS GO — the box it travels inside, so the Inspector can say it in words.
 *
 * Sticky holds a box inside its containing block and nowhere else, so "until when does it hold?" has exactly
 * one true answer, and it is not "its section". The Inspector said that for months and it was wrong in the
 * case a user meets first: `normalizeRowBands` wraps EVERY block in a band of its own, the band hugs it, and
 * `bandCarriesPin` moves the pin up onto that band — whose parent, for a block placed straight on the page,
 * is the page. So a pinned header holds for the whole page, and the line underneath promised it would leave.
 *
 *   • `"page"` — the thing that sticks sits directly in the page: it holds to the very end.
 *   • `"row"`  — it shares a band with blocks beside it, and lets go when that row of blocks does.
 *   • a block  — the nearest real container around it, to be NAMED ("the Stack around it", "the Grid…").
 *
 * A GRID CELL IS THE LAST CASE, NOT THE ROW CASE — and that was measured, not reasoned. The first version of
 * this returned "row" for a grid cell on the strength of "a grid item's containing block is its grid area",
 * and the browser disagreed: a pinned cell in row 1 of a two-row grid was still held 900px into row 2, and
 * let go only when the whole grid did. Words written from the spec would have told the user the wrong thing.
 *
 * `null` when sticky does not apply at all: not pinned, held fixed (measured against the window, so it never
 * lets go), or floating (clause 1 of `pinCSS` — free positioning wins and the pin is ignored).
 */
export function pinScope(root: BoxNode, id: string, bp: Breakpoint = "base"): "page" | "row" | BoxNode | null {
  const walk = (node: BoxNode, trail: BoxNode[]): BoxNode[] | null => {
    const path = [...trail, node];
    if (node.id === id) return path;
    for (const kid of node.children ?? []) {
      const hit = walk(kid, path);
      if (hit) return hit;
    }
    return null;
  };
  const path = walk(root, [])?.map((n) => resolveResponsive(n, bp)); // at the rung — see fixedBlockedBy
  if (!path || path.length < 2) return null;
  const self = path[path.length - 1];
  if (!self.pin || (self.hold ?? "sticky") !== "sticky" || isFloating(self)) return null;
  const parent = path[path.length - 2];
  // The band carries the pin when it hugs this block alone — then the BAND is what sticks, inside ITS parent.
  const carried = bandCarriesPin(parent, bp)?.id === self.id;
  const container = carried ? path[path.length - 3] : parent;
  if (!container || container.id === root.id) return "page";
  if (container.rowBand) return "row";
  return container;
}

/** `pinScope` in the words the Inspector says: the page, the row, or the NAME of the block around it. */
export type PinScopeWords = "page" | "row" | { around: string };
export function pinScopeWords(root: BoxNode, id: string, bp: Breakpoint = "base"): PinScopeWords | null {
  const scope = pinScope(root, id, bp);
  if (scope === null || scope === "page" || scope === "row") return scope;
  return { around: blockedByLabel(scope) ?? "block" };
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
