import { describe, it, expect } from "vitest";
import { createContainer, createElement, insertBox, rowWithBlock, findBox, type BoxNode } from "@/lib/box-model";

/**
 * BESIDE A BLOCK IN A COLUMN (BATCH LE-15l LE15l-v — template-fully-editable.feature, "A Stack dropped beside the icon of a card").
 * Measured 2026-10-20: a quick-link card is a column (icon over words) with no row bands; a Stack dropped on the icon's right drew
 * its drop line BESIDE the icon and landed UNDER it. The block's slot becomes a Side by side holding both — `stackWithBlock`'s mirror.
 */
const card = (): BoxNode => {
  let c = createContainer("column", { id: "card", align: "center" });
  c = insertBox(c, "card", 0, createElement("icon", { id: "ic" }));
  return insertBox(c, "card", 1, createElement("text", { id: "words", text: "Term dates" }));
};
describe("rowWithBlock", () => {
  it("puts the newcomer beside the block, in a row that takes the block's place", () => {
    const out = rowWithBlock(card(), "ic", createContainer("column", { id: "new" }));
    const kids = findBox(out, "card")!.children!;
    expect(kids.map((k) => k.id === "words" ? "words" : k.direction)).toEqual(["row", "words"]);
    expect(kids[0].children!.map((k) => k.id)).toEqual(["ic", "new"]);
  });
  it("before = on the block's left", () => {
    const row = findBox(rowWithBlock(card(), "ic", createContainer("column", { id: "new" }), true), "card")!.children![0];
    expect(row.children!.map((k) => k.id)).toEqual(["new", "ic"]);
  });
  it("adds no space of its own (no space unless you add it)", () => {
    const row = findBox(rowWithBlock(card(), "ic", createContainer("column", { id: "new" })), "card")!.children![0];
    expect([row.padding ?? 0, row.gap ?? 0, row.margin ?? 0]).toEqual([0, 0, 0]);
  });
  it("an unknown block changes nothing", () => {
    const c = card(); expect(rowWithBlock(c, "nope", createContainer("column"))).toBe(c);
  });
});
