/**
 * RC-7 · change a container's kind and keep its content (BATCH LE-14; tests/features/components/website/box-builder-container-kind.feature).
 * Trees built as the UI builds them: a Stack's blocks each in a row band, a Side by side's blocks bare, a Grid's blocks its cells;
 * every commit through `normalizeRowBands`.
 */
import { describe, it, expect } from "vitest";
import { type BoxNode, type ContainerKind, createContainer, createElement, insertBox, normalizeRowBands, findBox, changeKind, kindOf } from "@/lib/box-model";

const heading = (id: string, extra: Partial<BoxNode> = {}) => createElement("heading", { id, text: id, width: "auto", ...extra } as Partial<BoxNode>);
const commit = (r: BoxNode) => normalizeRowBands(r);
const KIND: Record<ContainerKind, Partial<BoxNode>> = {
  stack: { direction: "column" },
  row: { direction: "row", wrap: true },
  grid: { layout: "grid", direction: "row", columns: 3 },
};
/** A page holding one container of `kind` (id "box") with `kids` in it. */
function pageWith(kind: ContainerKind, ...kids: BoxNode[]): BoxNode {
  let root = createContainer("column", { id: "root", padding: 0, gap: 0, children: [] } as Partial<BoxNode>);
  root = commit(insertBox(root, "root", 0, createContainer(kind === "stack" ? "column" : "row", { id: "box", padding: 0, gap: 0, ...KIND[kind], children: [] } as Partial<BoxNode>)));
  for (const k of kids) root = commit(insertBox(root, "box", findBox(root, "box")!.children!.length, k));
  return root;
}
const leaves = (n: BoxNode): string[] => (n.children ?? []).flatMap((c) => (c.type === "container" && !["a", "b", "c"].includes(c.id) ? leaves(c) : [c.id]));

describe("RC-7 every kind becomes every other, its blocks kept in order", () => {
  const kinds: ContainerKind[] = ["stack", "row", "grid"];
  for (const from of kinds) for (const to of kinds) if (from !== to) {
    it(`${from} → ${to}`, () => {
      const start = pageWith(from, heading("a"), heading("b"), heading("c"));
      expect(kindOf(findBox(start, "box")!)).toBe(from);
      const { root } = changeKind(start, "box", to);
      const box = findBox(commit(root), "box")!;
      expect(kindOf(box)).toBe(to);
      expect(leaves(box)).toEqual(["a", "b", "c"]);
      // a Stack bands its blocks; a line and a grid hold them bare
      expect(box.children!.every((c) => !!c.rowBand === (to === "stack"))).toBe(true);
    });
  }
  it("the same kind, a row band or a block: nothing changes", () => {
    const start = pageWith("stack", heading("a"));
    expect(changeKind(start, "box", "stack").root).toBe(start);
    expect(changeKind(start, "a", "row").root).toBe(start);
  });
});

describe("RC-7 nothing moves that need not, and what is left behind is named", () => {
  it("a Stack of two Stacks becomes a Side by side whose two share the line (LE14-8)", () => {
    const s = (id: string) => createContainer("column", { id, children: [] } as Partial<BoxNode>);
    const { root } = changeKind(pageWith("stack", s("a"), s("b")), "box", "row");
    const box = findBox(commit(root), "box")!;
    expect(box.children!.map((c) => c.width)).toEqual(["50%", "50%"]);
  });
  it("a Side by side of three becomes a Grid of three columns", () => {
    const { root } = changeKind(pageWith("row", heading("a", { width: "33.33%" }), heading("b", { width: "33.33%" }), heading("c", { width: "33.33%" })), "box", "grid");
    expect(findBox(root, "box")!.columns).toBe(3);
  });
  it("a Stack becomes a Grid of one column: nothing moves", () => {
    expect(findBox(changeKind(pageWith("stack", heading("a"), heading("b")), "box", "grid").root, "box")!.columns).toBe(1);
  });
  it("a Grid whose block spans two columns becomes a Stack: the spans are named as left behind", () => {
    const { root, dropped } = changeKind(pageWith("grid", heading("a", { colSpan: 2 }), heading("b")), "box", "stack");
    expect(dropped).toEqual(["spans"]);
    expect(findBox(root, "a")!.colSpan).toBeUndefined();
    expect(findBox(root, "box")!.columns).toBeUndefined();
  });
  it("shares of a line are named when they stop meaning anything", () => {
    expect(changeKind(pageWith("row", heading("a", { width: "40%" }), heading("b", { width: "60%" })), "box", "stack").dropped).toEqual(["widths"]);
    expect(changeKind(pageWith("stack", heading("a"), heading("b")), "box", "row").dropped).toEqual([]);
  });
});
