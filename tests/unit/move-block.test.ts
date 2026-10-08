/**
 * THE ARROWS ON A BLOCK — `moveBlock` / `canMoveBlock` / `moveAxis` (BATCH E-5a, D4 — the user's decision).
 * Alone on its line → the line moves up / down the page; sharing a line → it moves along it; Move to top / bottom.
 */
import { describe, it, expect } from "vitest";
import { createContainer, createElement, insertBox, makeRowBand, findParent, moveBlock, canMoveBlock, moveAxis, type BoxNode } from "@/lib/box-model";
import { emptyPageRoot } from "@/lib/box-site";

const page = (...bands: BoxNode[]): BoxNode => bands.reduce((p, b, i) => insertBox(p, p.id, i, b), emptyPageRoot());
const order = (parent: BoxNode) => (parent.children ?? []).map((c) => c.id);

describe("moveBlock", () => {
  const a = createElement("text"), b = createElement("text"), c = createElement("text"), d = createElement("text");
  const root = page(makeRowBand([a]), makeRowBand([b]), makeRowBand([c, d]));
  const bandIds = order(root);

  it("a block alone on its line moves its LINE down the page", () => {
    const next = moveBlock(root, a.id, 1);
    expect(order(next)).toEqual([bandIds[1], bandIds[0], bandIds[2]]);
    expect(moveAxis(root, a.id)).toBe("vertical");
  });
  it("…and up", () => expect(order(moveBlock(root, b.id, -1))).toEqual([bandIds[1], bandIds[0], bandIds[2]]));
  it("Move to bottom / top", () => {
    expect(order(moveBlock(root, a.id, "last"))).toEqual([bandIds[1], bandIds[2], bandIds[0]]);
    expect(order(moveBlock(root, b.id, "first"))).toEqual([bandIds[1], bandIds[0], bandIds[2]]);
  });
  it("a block SHARING a line moves along it, left / right", () => {
    expect(moveAxis(root, d.id)).toBe("horizontal");
    const next = moveBlock(root, d.id, -1);
    expect(order(findParent(next, d.id)!.parent)).toEqual([d.id, c.id]);
    expect(order(next)).toEqual(bandIds); // the lines themselves did not move
  });
  it("at the ends nothing moves, and the arrow says so", () => {
    expect(canMoveBlock(root, a.id, -1)).toBe(false);
    expect(canMoveBlock(root, a.id, "first")).toBe(false);
    expect(moveBlock(root, a.id, -1)).toBe(root);
    expect(canMoveBlock(root, c.id, -1)).toBe(false);
    expect(canMoveBlock(root, c.id, 1)).toBe(true);
  });
  it("inside a stack, up / down among its siblings", () => {
    const h = createElement("heading"), t = createElement("text");
    const s = createContainer("column", { children: [h, t] });
    const r = page(makeRowBand([s]));
    expect(moveAxis(r, t.id)).toBe("vertical");
    expect(order(findParent(moveBlock(r, t.id, -1), t.id)!.parent)).toEqual([t.id, h.id]);
  });
});
