import { describe, it, expect } from "vitest";
import { placeCSS, childStyle, createContainer, createGrid, createElement, type BoxNode } from "@/lib/box-model";

/**
 * WHERE A BLOCK SITS IN ITS PARENT — nine positions, one control.
 *
 * Behaviours: tests/features/components/website/box-builder-columns.feature.
 *
 * The pair (`placeX`, `placeY`) is what a person means — top-left, centre, bottom-right. Turning it into CSS
 * is the part that used to be four separate controls, because the property that moves a block changes with
 * the parent's engine AND, in flex, with its direction. This suite pins all three cases, since a mapping that
 * is right for a grid and wrong for a row is exactly the kind of bug the old controls had: one of them was
 * labelled for the wrong axis in the commonest case on the page.
 */

const block = (place: Partial<BoxNode>) => createElement("heading", { text: "x", ...place } as Partial<BoxNode>);
const place = (parent: BoxNode, x?: BoxNode["placeX"], y?: BoxNode["placeY"]) => placeCSS(block({ placeX: x, placeY: y }), parent);

describe("a GRID cell — both axes belong to the child", () => {
  const grid = createGrid(12);
  it("across is justify-self, down is align-self", () => {
    expect(place(grid, "start", "start")).toEqual({ justifySelf: "start", alignSelf: "flex-start" });
    expect(place(grid, "center", "center")).toEqual({ justifySelf: "center", alignSelf: "center" });
    expect(place(grid, "end", "end")).toEqual({ justifySelf: "end", alignSelf: "flex-end" });
  });
});

describe("a flex ROW — down is the child's own axis, across needs an auto margin", () => {
  const row = createContainer("row");
  it("down is align-self", () => {
    expect(place(row, undefined, "start").alignSelf).toBe("flex-start");
    expect(place(row, undefined, "center").alignSelf).toBe("center");
    expect(place(row, undefined, "end").alignSelf).toBe("flex-end");
  });
  it("across is an AUTO MARGIN, which moves this block and leaves its neighbours alone", () => {
    expect(place(row, "end").marginLeft).toBe("auto");
    expect(place(row, "start").marginRight).toBe("auto");
    const centred = place(row, "center");
    expect(centred.marginLeft).toBe("auto");
    expect(centred.marginRight).toBe("auto");
  });
});

describe("a flex COLUMN — the same two facts with the axes swapped", () => {
  const col = createContainer("column");
  it("across is align-self — NOT down, which is what the old label got wrong", () => {
    expect(place(col, "start").alignSelf).toBe("flex-start");
    expect(place(col, "center").alignSelf).toBe("center");
    expect(place(col, "end").alignSelf).toBe("flex-end");
  });
  it("down is an auto margin on the block axis", () => {
    expect(place(col, undefined, "end").marginTop).toBe("auto");
    expect(place(col, undefined, "start").marginBottom).toBe("auto");
    const centred = place(col, undefined, "center");
    expect(centred.marginTop).toBe("auto");
    expect(centred.marginBottom).toBe("auto");
  });
});

describe("it stays out of the way until asked", () => {
  it("emits nothing at all when no position is set", () => {
    expect(placeCSS(block({}), createContainer("column"))).toEqual({});
    expect(placeCSS(block({}), createGrid(12))).toEqual({});
    expect(placeCSS(block({}), createContainer("row"))).toEqual({});
  });

  it("one axis alone is honoured without inventing the other", () => {
    const only = place(createContainer("column"), "end");
    expect(only.alignSelf).toBe("flex-end");
    expect(only.marginTop).toBeUndefined();
    expect(only.marginBottom).toBeUndefined();
  });
});

describe("it reaches the block's real style, and wins over what it replaces", () => {
  it("comes through childStyle in both engines", () => {
    const col = createContainer("column");
    expect(childStyle(block({ placeX: "center", placeY: "end" }), col).alignSelf).toBe("center");
    expect(childStyle(block({ placeX: "center", placeY: "end" }), col).marginTop).toBe("auto");
    const grid = createGrid(12);
    expect(childStyle(block({ placeX: "end", placeY: "center" }), grid).justifySelf).toBe("end");
    expect(childStyle(block({ placeX: "end", placeY: "center" }), grid).alignSelf).toBe("center");
  });

  it("overrides the older per-axis controls rather than fighting them", () => {
    // `push` and the hug-to-content `alignSelf` are still read for pages that already use them, but a block
    // TOLD where to sit goes there — two mechanisms disagreeing is how a control stops meaning anything.
    const s = childStyle(block({ push: "end", placeX: "start", placeY: "center" }), createContainer("row"));
    expect(s.marginRight, "the position decides, not the older push").toBe("auto");
    expect(s.alignSelf).toBe("center");
  });

  it("leaves a page that only uses the old push exactly as it was", () => {
    const s = childStyle(block({ push: "end" }), createContainer("row"));
    expect(s.marginLeft).toBe("auto");
    expect(s.justifySelf).toBeUndefined();
  });
});
