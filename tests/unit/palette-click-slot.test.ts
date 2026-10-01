/**
 * WHERE A PALETTE CLICK PUTS THE NEW BLOCK — `paletteClickSlot` (BATCH L-1 · e-1).
 *
 * Found through the UI (`scripts/uat/probe-l1e1.js`, 3 of 3): an Image that is a CELL of a grid was selected, the Stack
 * tile was clicked, and nothing appeared — the Stack had been inserted as the Image's child, which an image never draws.
 * The rule: after the selection; inside only a grid or a CONTAINER grid cell.
 */
import { describe, it, expect } from "vitest";
import { createContainer, createElement, insertBox, findParent, paletteClickSlot, type BoxNode } from "@/lib/box-model";
import { emptyPageRoot } from "@/lib/box-site";

const pageWith = (b: BoxNode): BoxNode => { const p = emptyPageRoot(); return insertBox(p, p.id, 0, b); };
const grid = (cells: BoxNode[]): BoxNode => createContainer("row", { layout: "grid", columns: 12, children: cells });

describe("paletteClickSlot", () => {
  it("an IMAGE grid cell gets the new block AFTER it — the next cell — never inside it (e-1)", () => {
    const img = createElement("image");
    const g = grid([createContainer("column"), img, createContainer("column")]);
    const root = pageWith(g);
    const slot = paletteClickSlot(root, img.id);
    expect(slot.parentId).not.toBe(img.id);
    expect(slot).toEqual({ parentId: findParent(root, img.id)!.parent.id, index: findParent(root, img.id)!.index + 1 });
  });

  it("a TEXT grid cell likewise gets it after, as the next cell", () => {
    const txt = createElement("text");
    const g = grid([txt]);
    const root = pageWith(g);
    expect(paletteClickSlot(root, txt.id)).toEqual({ parentId: findParent(root, txt.id)!.parent.id, index: 1 });
  });

  it("a CONTAINER grid cell still receives the block inside (\"add a grid within a grid\")", () => {
    const cell = createContainer("column", { children: [createElement("text")] });
    const root = pageWith(grid([cell]));
    expect(paletteClickSlot(root, cell.id)).toEqual({ parentId: cell.id, index: 1 });
  });

  it("a selected GRID receives the block as its next cell", () => {
    const g = grid([createContainer("column"), createContainer("column")]);
    const root = pageWith(g);
    expect(paletteClickSlot(root, g.id)).toEqual({ parentId: g.id, index: 2 });
  });

  it("nothing selected: the end of the page", () => {
    const root = emptyPageRoot();
    expect(paletteClickSlot(root, null)).toEqual({ parentId: root.id, index: root.children?.length ?? 0 });
  });
});
