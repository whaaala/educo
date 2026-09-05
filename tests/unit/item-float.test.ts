import { describe, it, expect } from "vitest";
import {
  itemOverrideCss, itemFloatContextCss, itemFloatReserveRem, itemIsFloating, isMultiItemComponent, hasItemParts,
  itemHasOverride, side4Css,
  COMPONENT_ITEM_PARTS, COMPONENT_PARTS, COMPONENT_ITEM_SEL, createComponent, createContainer, FLOAT_MIN_VISIBLE_REM,
  type ComponentItem, type BoxNode,
} from "@/lib/box-model";
import { renderSiteHTML } from "@/lib/box-export";
import { siteFromRoot } from "@/lib/box-site";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { BREAKPOINTS_EM } from "@/lib/educo-ui/base";

// RULE N — float / position / group items and their inner parts is a CROSS-COMPONENT baseline, not an
// accordion feature. Every component with item PARTS inherits it, so these loop the registry: a new component
// is covered the moment it registers its part selectors.
//
// Note "has item parts" is not the same question as "holds a list". The Alert is a single message — it has
// parts to style and position, but no list to add to or reorder (user decision, 2026-09-05).
const WITH_PARTS = Object.keys(COMPONENT_ITEM_PARTS);
const MULTI_ITEM = WITH_PARTS;

const plain = (): ComponentItem => ({ id: "i1", title: "T", body: "B" });
const floated = (): ComponentItem => ({ id: "i1", title: "T", body: "B", float: { x: 6, y: 3, z: 2 } });

describe("RULE N — every multi-item component can float and place its items", () => {
  it("registers the same components for parts, CSS parts and item selectors", () => {
    expect(WITH_PARTS.length).toBeGreaterThanOrEqual(2); // accordion + alert today
    for (const name of WITH_PARTS) {
      expect(COMPONENT_PARTS[name], `${name}: user-CSS part map`).toBeTruthy();
      expect(COMPONENT_ITEM_SEL[name], `${name}: item selector`).toBeTruthy();
      expect(hasItemParts(name), `${name}: has item parts`).toBe(true);
    }
  });

  it("separates 'has item parts' from 'holds a list the user manages'", () => {
    expect(isMultiItemComponent("accordion")).toBe(true);  // a list: add / reorder / delete
    expect(isMultiItemComponent("alert")).toBe(false);     // a single message — parts, but no list
    expect(hasItemParts("alert")).toBe(true);              // …its parts are still styleable + positionable
    expect(isMultiItemComponent("card")).toBe(false);      // single-object components have neither
    expect(hasItemParts("card")).toBe(false);
  });

  for (const component of MULTI_ITEM) {
    it(`${component}: nothing floats by default — an item stays in the normal stack`, () => {
      const css = itemOverrideCss(".it", plain(), { component });
      expect(itemIsFloating(plain())).toBe(false);
      expect(css).not.toContain("position:absolute");
    });

    it(`${component}: a floated item is absolutely placed at its X/Y in rem, with its layer`, () => {
      const css = itemOverrideCss(".it", floated(), { component });
      expect(css).toContain("position:absolute !important");
      // X is emitted through a min() clamp so an over-large value can never push the item out of the box.
      expect(css).toContain(`left:min(6rem, calc(100% - ${FLOAT_MIN_VISIBLE_REM}rem)) !important`);
      expect(css).toContain("top:3rem !important");
      expect(css).toContain("z-index:2 !important");
    });

    it(`${component}: on a narrow screen a floated item stays in the normal stack`, () => {
      // MOBILE-FIRST: the stack is the BASE and placement is ADDED from the `sm` rung up, in `em` (field guide
      // ingredient ④). There is deliberately no "undo it on phones" rule — there is nothing to undo.
      const css = itemOverrideCss(".it", floated(), { component, stackOnNarrow: true });
      expect(css).toContain(`@media (min-width:${BREAKPOINTS_EM.sm}em)`);
      expect(css).not.toContain("max-width:480px");   // never desktop-first
      expect(css).not.toMatch(/@media \([^)]*\d+px\)/); // never a px breakpoint
      expect(css.indexOf("position:absolute")).toBeGreaterThan(css.indexOf("@media")); // placement is INSIDE the query
    });

    it(`${component}: floats can be suppressed (the editor's mobile preview)`, () => {
      expect(itemOverrideCss(".it", floated(), { component, skipFloat: true })).not.toContain("position:absolute");
    });

    it(`${component}: the inner PARTS take their own X/Y within the item`, () => {
      const parts = COMPONENT_ITEM_PARTS[component];
      const css = itemOverrideCss(".it", {
        ...plain(),
        headerStyle: { pos: { x: 2, y: -1 } },
        bodyStyle: { pos: { x: 0, y: 3 } },
      }, { component });
      expect(css).toContain(`.it${parts.title}{position:relative !important;transform:translate(2rem,-1rem) !important;}`);
      expect(css).toContain(`.it${parts.body}{position:relative !important;transform:translate(0rem,3rem) !important;}`);
    });

    it(`${component}: the item's icon is styled on that component's own icon element`, () => {
      const parts = COMPONENT_ITEM_PARTS[component];
      const css = itemOverrideCss(".it", { ...plain(), iconColor: "#f59e0b", iconDx: 1 }, { component });
      expect(css).toContain(`.it${parts.icon}{`);
      expect(css).toContain("translate(1rem, 0rem)");
    });
  }

  it("the box reserves height for what floats, so nothing is ever clipped", () => {
    expect(itemFloatReserveRem([plain()])).toBe(0); // nothing floats ⇒ no reserve at all
    expect(itemFloatContextCss([plain()], ".box")).toBe("");

    const ctx = itemFloatContextCss([floated()], ".box");
    expect(ctx).toContain(".box{position:relative;min-height:");
    expect(itemFloatReserveRem([floated()])).toBe(9); // the lowest float + a nominal item height
  });

  it("no space is reserved until placement actually applies (mobile-first)", () => {
    const ctx = itemFloatContextCss([floated()], ".box", { stackOnNarrow: true });
    expect(ctx).toBe(`@media (min-width:${BREAKPOINTS_EM.sm}em){.box{position:relative;min-height:9rem}}`);
  });
});

describe("RULE N — the exported site carries the placement, with no JavaScript", () => {
  /** A page holding one component whose second item is detached and placed. */
  function pageWith(component: string): BoxNode {
    // The floated item is FIRST, so this holds for a single-message component (which renders only item 0)
    // as well as for a list.
    const node = createComponent(component, {
      id: "tgt",
      items: [
        { id: "b", title: "Floated", body: "Placed freely", float: { x: 6, y: 3, z: 1 } },
        { id: "a", title: "Stacked", body: "Normal flow" },
      ],
    } as Partial<BoxNode>);
    return createContainer("column", { id: "page", children: [createContainer("row", { id: "row", rowBand: true, children: [node] })] });
  }

  for (const component of MULTI_ITEM) {
    it(`${component}: export places the floated item and reserves room for it`, () => {
      const html = renderSiteHTML(siteFromRoot(pageWith(component)), DEFAULT_THEME);
      expect(html).toContain("position:absolute !important");
      expect(html).toContain(`left:min(6rem, calc(100% - ${FLOAT_MIN_VISIBLE_REM}rem)) !important`);
      expect(html).toMatch(/position:relative;min-height:\d+(\.\d+)?rem/);
    });

    it(`${component}: the export keeps the stack as its base and adds placement above \`sm\``, () => {
      const html = renderSiteHTML(siteFromRoot(pageWith(component)), DEFAULT_THEME);
      expect(html).toContain(`@media (min-width:${BREAKPOINTS_EM.sm}em)`);
      expect(html).not.toContain("max-width:480px");
    });
  }
});

describe("RULE N — a floated item always stays INSIDE its component box", () => {
  // The bug this guards: components set `container-type: inline-size` for their container queries, which makes
  // an element's width independent of its contents. On an absolutely-positioned item that collapsed it to a
  // narrow column of one-word-per-line text which then spilled out of the component. And when a stored X was
  // wider than the box, `calc(100% - X)` went negative and the item collapsed and overhung the right edge.
  for (const component of MULTI_ITEM) {
    it(`${component}: a floated item sizes to its content instead of collapsing`, () => {
      const css = itemOverrideCss(".it", floated(), { component });
      expect(css).toContain("container-type:normal !important");
    });

    it(`${component}: a floated item can never be wider than the room beside it`, () => {
      const css = itemOverrideCss(".it", floated(), { component });
      expect(css).toContain("max-width:calc(100% - min(6rem, calc(100% - 8rem))) !important");
    });

    it(`${component}: an X beyond the box is clamped so the item stays visible and inside`, () => {
      // 500rem is far wider than any component box; the placement must still land inside it.
      const css = itemOverrideCss(".it", { ...plain(), float: { x: 500, y: 2 } }, { component });
      expect(css).toContain(`left:min(500rem, calc(100% - ${FLOAT_MIN_VISIBLE_REM}rem)) !important`);
      expect(css).not.toMatch(/max-width:calc\(100% - 500rem\)/); // never a negative width
    });

    it(`${component}: on a narrow screen NO placement CSS applies at all`, () => {
      // Mobile-first means there is nothing to undo: every placement declaration lives inside the min-width
      // query, so a narrow viewport simply never sees them and the item stays in the normal stack.
      const css = itemOverrideCss(".it", floated(), { component, stackOnNarrow: true });
      const outsideQuery = css.slice(0, css.indexOf("@media"));
      expect(outsideQuery).not.toContain("position:absolute");
      expect(outsideQuery).not.toContain("left:");
      expect(css).not.toContain("position:static"); // no undo rule needed, so none is emitted
    });
  }
});

describe("RULE P — every item's spacing is adjustable on all four sides", () => {
  // Padding (inside the item) and margin (around it), in rem, for the items of ANY component — a
  // single-message component's one message included. Emitted by the shared per-item emitter, so a new
  // component inherits it with no extra code.
  for (const component of WITH_PARTS) {
    it(`${component}: padding and margin compile to scoped, winning rules`, () => {
      const css = itemOverrideCss(".it", {
        ...plain(),
        pad: { t: 1, r: 1.5, b: 2, l: 0.5 },
        margin: { t: 0.25, b: 0.75 },
      }, { component });
      expect(css).toContain("padding-top:1rem !important;");
      expect(css).toContain("padding-right:1.5rem !important;");
      expect(css).toContain("padding-bottom:2rem !important;");
      expect(css).toContain("padding-left:0.5rem !important;");
      expect(css).toContain("margin-top:0.25rem !important;");
      expect(css).toContain("margin-bottom:0.75rem !important;");
    });

    it(`${component}: only the sides you set are emitted — the rest keep the design's own spacing`, () => {
      const css = itemOverrideCss(".it", { ...plain(), pad: { l: 3 } }, { component });
      expect(css).toContain("padding-left:3rem !important;");
      expect(css).not.toContain("padding-top");
      expect(css).not.toContain("margin-");
    });

    it(`${component}: an item with only spacing still gets its scoped class`, () => {
      // …otherwise the rule would be written for a selector that is never on the element.
      expect(itemHasOverride({ ...plain(), pad: { t: 1 } })).toBe(true);
      expect(itemHasOverride({ ...plain(), margin: { b: 1 } })).toBe(true);
      expect(itemHasOverride(plain())).toBe(false);
    });
  }

  it("side4Css is empty when nothing is set, so no stray rules are emitted", () => {
    expect(side4Css("padding", undefined)).toBe("");
    expect(side4Css("padding", {})).toBe("");
    expect(side4Css("margin", { r: 2 })).toBe("margin-right:2rem !important;");
  });
});
