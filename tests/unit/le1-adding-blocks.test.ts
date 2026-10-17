/**
 * BATCH LE-1 · adding blocks (E2-20) and the stale `alignSelf` migration — pure rules, each written red first.
 * The UI half is driven HEADED in `scripts/uat/uat-le1-headed.js`.
 */
import { describe, it, expect } from "vitest";
import { createContainer, createElement, insertBox, findBox, paletteClickSlot, addInsideParent, releaseStaleAlignSelf, placeSharing, retrackGridAt, resolveResponsive, gridPlacementAt, type Breakpoint, type BoxNode } from "@/lib/box-model";
import { emptyPageRoot } from "@/lib/box-site";

const pageWith = (b: BoxNode): BoxNode => { const p = emptyPageRoot(); return insertBox(p, p.id, 0, b); };

describe("LE-1 · a palette click with a Side by side selected goes INSIDE it (E2-20)", () => {
  it("an EMPTY Side by side receives the block", () => {
    const row = createContainer("row");
    const root = pageWith(row);
    expect(paletteClickSlot(root, row.id)).toEqual({ parentId: row.id, index: 0 });
  });
  it("a Side by side holding blocks receives the next one at its end", () => {
    const row = createContainer("row", { children: [createElement("text")] });
    expect(paletteClickSlot(pageWith(row), row.id)).toEqual({ parentId: row.id, index: 1 });
  });
  it("with the block just added inside it selected, the next one lands BESIDE it, still inside the row", () => {
    const t = createElement("text");
    const row = createContainer("row", { children: [t] });
    expect(paletteClickSlot(pageWith(row), t.id)).toEqual({ parentId: row.id, index: 1 });
  });
  it("a Stack still gets the block AFTER it (palette-adds-after)", () => {
    const stack = createContainer("column");
    const root = pageWith(stack);
    expect(paletteClickSlot(root, stack.id).parentId).not.toBe(stack.id);
  });
  it("a band's row is not a Side by side — a band still sends the block below", () => {
    const band = createContainer("row", { rowBand: true, children: [createElement("text")] });
    expect(paletteClickSlot(pageWith(band), band.id).parentId).not.toBe(band.id);
  });
});

describe("LE1-3 · tiles clicked into a Side by side SHARE its line (found HEADED, probe-le1-sbs.js: the Button wrapped below)", () => {
  it("Text, Image, Button placed one after another take a third each", () => {
    const row = createContainer("row");
    let root = pageWith(row);
    for (const k of ["text", "image", "button"] as const) root = placeSharing(root, row.id, findBox(root, row.id)!.children?.length ?? 0, createElement(k));
    expect(findBox(root, row.id)!.children!.map((c) => c.width)).toEqual(["33.33%", "33.33%", "33.34%"]);
  });
  it("outside a Side by side a block is placed as it is", () => {
    const stack = createContainer("column");
    const t = createElement("text");
    expect(findBox(placeSharing(pageWith(stack), stack.id, 0, t), t.id)?.width).toBe(t.width);
  });
});

describe("LE-1 · \"+ Add a block inside\" repeated adds siblings, never nests (E2-20)", () => {
  it("with the block the last add-inside made selected, the next goes into the SAME parent", () => {
    const child = createContainer("column");
    const stack = createContainer("column", { children: [child] });
    const root = pageWith(stack);
    expect(addInsideParent(root, child.id, { parent: stack.id, child: child.id })).toBe(stack.id);
  });
  it("LE1-2: …also when the builder wrapped it in a row band, as it does inside a Stack (found HEADED, probe-le1-addinside.js)", () => {
    const child = createContainer("column");
    const stack = createContainer("column", { children: [createContainer("row", { rowBand: true, children: [child] })] });
    const root = pageWith(stack);
    expect(addInsideParent(root, child.id, { parent: stack.id, child: child.id })).toBe(stack.id);
  });
  it("a block the user selected themselves receives it", () => {
    const stack = createContainer("column");
    expect(addInsideParent(pageWith(stack), stack.id, null)).toBe(stack.id);
  });
  it("once the last-added block has moved elsewhere, it is a place of its own again", () => {
    const child = createContainer("column");
    const root = pageWith(createContainer("column", { children: [child] })); // moved into another block, not the one recorded
    expect(addInsideParent(root, child.id, { parent: "a-stack-it-left", child: child.id })).toBe(child.id);
  });
});

describe("LE-1 · a stale `alignSelf` is released on load (the #42 family)", () => {
  it("a block in a row pinned to the top with NO height of its own follows its row again", () => {
    const pinned = createContainer("column", { alignSelf: "flex-start" });
    const root = pageWith(createContainer("row", { children: [pinned, createContainer("column")] }));
    expect(findBox(releaseStaleAlignSelf(root), pinned.id)?.alignSelf).toBeUndefined();
  });
  it("a block in a column pinned left with NO width of its own spans its column again", () => {
    const pinned = createContainer("column", { alignSelf: "flex-start" });
    const root = pageWith(createContainer("column", { children: [pinned] }));
    expect(findBox(releaseStaleAlignSelf(root), pinned.id)?.alignSelf).toBeUndefined();
  });
  it("a block whose HEIGHT a drag set keeps its pin in a row", () => {
    const sized = createContainer("column", { alignSelf: "flex-start", minHeight: 8 });
    const root = pageWith(createContainer("row", { children: [sized] }));
    expect(findBox(releaseStaleAlignSelf(root), sized.id)?.alignSelf).toBe("flex-start");
  });
  it("a block whose WIDTH a drag set keeps its pin in a column", () => {
    const sized = createContainer("column", { alignSelf: "flex-start", width: "40%" });
    const root = pageWith(createContainer("column", { children: [sized] }));
    expect(findBox(releaseStaleAlignSelf(root), sized.id)?.alignSelf).toBe("flex-start");
  });
  it("a tree with no stale pin is returned as the SAME object (a saved page changes not one byte)", () => {
    const root = pageWith(createContainer("row", { children: [createContainer("column")] }));
    expect(releaseStaleAlignSelf(root)).toBe(root);
  });
});

describe("LE1-4 · a column count chosen for a screen is the count DRAWN there (found HEADED, probe-le1-cols.js)", () => {
  // the Grid tile's 4 × 1: twelve tracks, each cell spanning three
  const fourOfTwelve = () => createContainer("row", { layout: "grid", columns: 12, children: [0, 1, 2, 3].map(() => createContainer("column", { colSpan: 3 })) });
  const acrossAt = (root: BoxNode, gridId: string, bp: Breakpoint) => {
    const g = resolveResponsive(findBox(root, gridId)!, bp);
    const spans = g.children!.map((c) => gridPlacementAt(g, resolveResponsive(c, bp), bp));
    return Math.floor(spans[0].track / spans[0].span);
  };
  it("Thirds chosen at Phone draws three across on a phone", () => {
    const g = fourOfTwelve(); const root = pageWith(g);
    expect(acrossAt(retrackGridAt(root, g.id, 3, "phone"), g.id, "phone")).toBe(3);
  });
  it("…and leaves the desktop as it was", () => {
    const g = fourOfTwelve(); const root = pageWith(g);
    const after = retrackGridAt(root, g.id, 3, "phone");
    expect(findBox(after, g.id)!.columns).toBe(12);
    expect(findBox(after, g.id)!.children!.map((c) => c.colSpan)).toEqual([3, 3, 3, 3]);
  });
  it("at the base it is the ordinary retrack", () => {
    const g = fourOfTwelve(); const root = pageWith(g);
    expect(findBox(retrackGridAt(root, g.id, 6, "base"), g.id)!.columns).toBe(6);
  });
});
