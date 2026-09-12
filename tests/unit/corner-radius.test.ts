import { describe, it, expect } from "vitest";
import { radiusCSS, isClipped, type BoxNode } from "@/lib/box-model";
import { blockForKind, tableGrid } from "@/lib/box-presets";
import { COMPONENT_CATALOGUE } from "@/lib/component-catalogue";
import { renderPageHTML } from "@/lib/box-export";
import { siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * CORNER RADIUS IS A RULE, NOT A FEATURE — and this is what holds every block to it.
 *
 * The rule: NOTHING is rounded until someone asks. Every block — a grid cell, a section, a heading, a photo,
 * a component we have and every component we have not written yet — accepts a radius on all four corners at
 * once AND on each corner on its own. See CLAUDE.md ("Corner radius") for the statement of it.
 *
 * The suite ENUMERATES the palette rather than listing cases by hand, so a component added next month is
 * covered the day it appears in the catalogue. A rule nobody can forget to follow is worth more than a rule
 * written down: a per-component test would simply not exist for the component nobody remembered to write it
 * for, which is how the alt text, the fonts and the container queries each shipped broken.
 */

/** Every kind the blocks palette can add: the primitives plus every catalogue component. */
const PRIMITIVES = ["container", "row", "grid", "heading", "text", "button", "list", "image", "video", "divider", "spacer", "icon", "embed"];
const ALL_KINDS = [...PRIMITIVES, ...COMPONENT_CATALOGUE.map((c) => c.name)];

/** The CSS a page emits for a tree, with the block rules and any component styles together. */
const cssFor = (node: BoxNode): string => {
  const root = { id: "root", type: "container", direction: "column", children: [node] } as unknown as BoxNode;
  const site = siteFromRoot(root);
  return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
};

describe("nothing is rounded until someone asks", () => {
  it("no LAYOUT block or plain element arrives with a corner radius of its own", () => {
    // The boxes a page is built out of start square. A design-system COMPONENT is a different thing — a Card
    // is rounded because that is what a Card looks like, chosen the moment somebody added a Card — so those
    // are excluded here by name rather than by a blanket exception, and the list is short enough to read.
    for (const kind of PRIMITIVES) {
      const node = blockForKind(kind);
      expect(radiusCSS(node), `${kind} must start square`).toBeUndefined();
    }
  });

  it("a grid and its cells start square", () => {
    const grid = blockForKind("grid");
    expect(radiusCSS(grid)).toBeUndefined();
    for (const cell of grid.children ?? []) expect(radiusCSS(cell)).toBeUndefined();
    // …and so does every cell the table picker makes, which is the path a person actually uses.
    for (const cell of tableGrid(3, 2).children ?? []) expect(radiusCSS(cell)).toBeUndefined();
  });

  it("a component's own rounding is its DESIGN, and every corner of it can still be overridden", () => {
    // Stated rather than assumed: a Card is round because a Card is round. What matters for the rule is that
    // the user can take it back — all four corners at once, or one of them.
    const card = blockForKind("card");
    expect(radiusCSS(card), "a Card looks like a Card").toBe("16px 16px 16px 16px");
    // Squaring it off writes a real 0 rather than removing the property — which is the point, because the
    // component's own stylesheet would otherwise put its rounding straight back.
    expect(radiusCSS(blockForKind("card", { radius: 0 })), "and can be squared off").toBe("0px 0px 0px 0px");
    expect(radiusCSS(blockForKind("card", { radiusTopLeft: 0 }))).toBe("0px 16px 16px 16px");
  });

  it("the rounding that DOES appear is a look somebody chose, never a default", () => {
    // The Card / Outline / Tinted style presets carry a radius on purpose — there it is part of a look the
    // user picked from the gallery, which is the opposite of a value hiding inside a new block.
    const plain = blockForKind("container");
    expect(radiusCSS(plain)).toBeUndefined();
    expect(radiusCSS(blockForKind("container", { radius: 16 }))).toBe("16px 16px 16px 16px");
  });
});

describe("every block takes a radius on all four corners, and on each corner alone", () => {
  it("all at once", () => {
    for (const kind of ALL_KINDS) {
      const node = blockForKind(kind, { radius: 14 });
      expect(radiusCSS(node), `${kind} must accept one radius for every corner`).toBe("14px 14px 14px 14px");
    }
  });

  it("each corner on its own, overriding the all-corners value", () => {
    for (const kind of ALL_KINDS) {
      const node = blockForKind(kind, { radius: 10, radiusTopLeft: 0, radiusTopRight: 30, radiusBottomRight: 4, radiusBottomLeft: 22 });
      expect(radiusCSS(node), `${kind} must accept a value per corner`).toBe("0px 30px 4px 22px");
    }
    // A single corner with no all-corners value leaves the other three square, rather than rounding them.
    expect(radiusCSS(blockForKind("container", { radiusTopLeft: 18 }))).toBe("18px 0px 0px 0px");
  });

  it("reaches the PUBLISHED page for every kind, not only the stored data", () => {
    // The half that matters to a visitor. A component paints its own box (`componentBoxCss`) while everything
    // else is styled on its wrapper — two different emitters, so both are checked here rather than assumed to
    // agree. A component whose CSS never carried the radius would look square on the live site while the
    // panel said otherwise, which is the "control that appears to work" defect this project keeps meeting.
    for (const kind of ALL_KINDS) {
      const html = cssFor(blockForKind(kind, { radius: 10, radiusTopLeft: 0, radiusTopRight: 30, radiusBottomRight: 4, radiusBottomLeft: 22 }));
      expect(html, `${kind} must publish its corner radius`).toContain("border-radius:0px 30px 4px 22px");
    }
  });

  it("a rounded block clips what is inside it, so a photo cannot square off the corner", () => {
    for (const kind of ["container", "grid", "image"]) {
      expect(isClipped(blockForKind(kind, { radius: 12 })), `${kind} must clip when rounded`).toBe(true);
      expect(isClipped(blockForKind(kind, { radiusBottomLeft: 12 })), `${kind} must clip on one corner too`).toBe(true);
    }
  });
});

describe("the emitter is shared, so the canvas and the export cannot disagree", () => {
  it("one function decides the value for every block and both renderers use it", () => {
    // `radiusCSS` is the only place the four corners are resolved. The canvas (decorStyle), the export
    // (decorCss) and a component's own box (componentBoxCss) all call it, which is why "canvas = export" holds
    // here without a second assertion per block type.
    const node = blockForKind("card", { radius: 5, radiusTopRight: 25 });
    const value = radiusCSS(node)!;
    expect(value).toBe("5px 25px 5px 5px");
    expect(renderPageHTML({ id: "r", type: "container", direction: "column", children: [node] } as unknown as BoxNode, DEFAULT_THEME))
      .toContain(`border-radius:${value}`);
  });
});
