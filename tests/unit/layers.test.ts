/**
 * ED-2b · the layers tree's model (BATCH LE-14; tests/features/components/website/box-builder-layers.feature).
 * The page as the palette builds it: a Stack on the page with a Heading and a Text in it, a Button below — every block in
 * its own row band, every commit through `normalizeRowBands`.
 */
import { describe, it, expect } from "vitest";
import { type BoxNode, createContainer, createElement, insertBox, normalizeRowBands, layerRows, moveLayer } from "@/lib/box-model";

const commit = (r: BoxNode) => normalizeRowBands(r);
function page(): BoxNode {
  let root = createContainer("column", { id: "root", padding: 0, gap: 0, children: [] } as Partial<BoxNode>);
  root = commit(insertBox(root, "root", 0, createContainer("column", { id: "stack", children: [] } as Partial<BoxNode>)));
  root = commit(insertBox(root, "stack", 0, createElement("heading", { id: "heading", text: "Hi" } as Partial<BoxNode>)));
  root = commit(insertBox(root, "stack", 1, createElement("text", { id: "text", text: "Words" } as Partial<BoxNode>)));
  return commit(insertBox(root, "root", root.children!.length, createElement("button", { id: "button", text: "Go" } as Partial<BoxNode>)));
}
/** "stack ( heading · text ) · button" — the tree as the feature's examples write it. */
const read = (root: BoxNode): string => {
  const rows = layerRows(root);
  const at = (parent: string | null): string => rows.filter((r) => r.parentId === parent).map((r) => (r.kids ? `${r.node.id} ( ${at(r.node.id)} )` : r.node.id)).join(" · ");
  return at(null);
};

describe("ED-2b the tree lists the page", () => {
  it("in reading order, nested as built, with no row band", () => {
    const rows = layerRows(page());
    expect(rows.map((r) => [r.node.id, r.level, r.parentId, r.kids])).toEqual([["stack", 1, null, 2], ["heading", 2, "stack", 0], ["text", 2, "stack", 0], ["button", 1, null, 0]]);
    expect(rows.some((r) => r.node.rowBand)).toBe(false);
  });
});

describe("ED-2b a row dragged to a new place", () => {
  const cases: [string, "before" | "after" | "inside", string, string][] = [
    ["button", "before", "stack", "button · stack ( heading · text )"],
    ["text", "before", "heading", "stack ( text · heading ) · button"],
    ["button", "inside", "stack", "stack ( heading · text · button )"],
    ["heading", "after", "button", "stack ( text ) · button · heading"],
    ["heading", "after", "text", "stack ( text · heading ) · button"],
  ];
  for (const [row, where, target, order] of cases) {
    it(`${row} ${where} ${target} → ${order}`, () => { expect(read(commit(moveLayer(page(), row, target, where)))).toBe(order); });
  }
  it("never into itself, a block it holds, or a block that holds nothing", () => {
    const p = page();
    expect(moveLayer(p, "stack", "heading", "inside")).toBe(p);
    expect(moveLayer(p, "stack", "heading", "before")).toBe(p);
    expect(moveLayer(p, "stack", "stack", "after")).toBe(p);
    expect(moveLayer(p, "text", "button", "inside")).toBe(p);
  });
});
