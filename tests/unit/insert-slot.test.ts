/**
 * WHERE A NEW BLOCK GOES, CHOSEN BY NAME — `insertSlot` / `defaultWhere` (BATCH E-5a, D3 — the user's decision).
 * Before · After · Inside · Start · End; the default is the plain click's rule (`paletteClickSlot`), named.
 */
import { describe, it, expect } from "vitest";
import { createContainer, createElement, insertBox, findParent, makeRowBand, insertSlot, defaultWhere, paletteClickSlot, type BoxNode } from "@/lib/box-model";
import { emptyPageRoot } from "@/lib/box-site";

const page = (...bands: BoxNode[]): BoxNode => bands.reduce((p, b, i) => insertBox(p, p.id, i, b), emptyPageRoot());

describe("insertSlot", () => {
  const a = createElement("text"), b = createElement("text");
  const stack = createContainer("column", { children: [createElement("heading")] });
  const root = page(makeRowBand([a]), makeRowBand([b, stack]));
  const bandOf = (id: string) => findParent(root, findParent(root, id)!.parent.id)!;

  it("AFTER a page block is a line of its own under its band, never beside it", () => {
    expect(insertSlot(root, a.id, "after")).toEqual({ parentId: root.id, index: bandOf(a.id).index + 1 });
  });
  it("BEFORE it is a line of its own above its band", () => {
    expect(insertSlot(root, b.id, "before")).toEqual({ parentId: root.id, index: bandOf(b.id).index });
  });
  it("INSIDE a container is its last child", () => {
    expect(insertSlot(root, stack.id, "inside")).toEqual({ parentId: stack.id, index: 1 });
  });
  it("INSIDE something that holds nothing (a text) falls back to AFTER", () => {
    expect(insertSlot(root, a.id, "inside")).toEqual(insertSlot(root, a.id, "after"));
  });
  it("inside a stack, before / after are its siblings", () => {
    const h = stack.children![0];
    expect(insertSlot(root, h.id, "before")).toEqual({ parentId: stack.id, index: 0 });
    expect(insertSlot(root, h.id, "after")).toEqual({ parentId: stack.id, index: 1 });
  });
  it("START and END are the page's, whatever is selected", () => {
    expect(insertSlot(root, b.id, "start")).toEqual({ parentId: root.id, index: 0 });
    expect(insertSlot(root, b.id, "end")).toEqual({ parentId: root.id, index: root.children!.length });
  });
  it("nothing selected — the end of the page", () => {
    expect(insertSlot(root, null, "after")).toEqual({ parentId: root.id, index: root.children!.length });
  });
});

describe("defaultWhere — the menu shows what a plain click does", () => {
  it("nothing selected → End", () => expect(defaultWhere(page(makeRowBand([createElement("text")])), null)).toBe("end"));
  it("a block → After, and After lands where the plain click does", () => {
    const t = createElement("text"); const root = page(makeRowBand([t]));
    expect(defaultWhere(root, t.id)).toBe("after");
    expect(insertSlot(root, t.id, "after")).toEqual(paletteClickSlot(root, t.id));
  });
  it("a grid → Inside, and Inside lands where the plain click does", () => {
    const g = createContainer("row", { layout: "grid", columns: 12, children: [createContainer("column")] });
    const root = page(makeRowBand([g]));
    expect(defaultWhere(root, g.id)).toBe("inside");
    expect(insertSlot(root, g.id, "inside")).toEqual(paletteClickSlot(root, g.id));
  });
});
