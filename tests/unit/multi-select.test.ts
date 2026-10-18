/**
 * ED-13 · several blocks together (BATCH LE-14; tests/features/components/website/box-builder-multiselect.feature).
 * Trees built as the UI builds them: each block in its own row band, every commit through `normalizeRowBands`.
 */
import { describe, it, expect } from "vitest";
import { type BoxNode, createContainer, createElement, insertBox, normalizeRowBands, mixedFields, moveBlocks } from "@/lib/box-model";

const heading = (id: string, extra: Partial<BoxNode> = {}) => createElement("heading", { id, text: id, width: "auto", ...extra } as Partial<BoxNode>);
function page(...blocks: BoxNode[]): BoxNode {
  let root = createContainer("column", { id: "root", padding: 0, gap: 0, children: [] } as Partial<BoxNode>);
  for (const b of blocks) root = normalizeRowBands(insertBox(root, "root", root.children!.length, b));
  return root;
}
const reading = (n: BoxNode): string[] => (n.children ?? []).flatMap((c) => (c.type === "container" ? reading(c) : [c.id]));

describe("ED-13 a field the blocks differ in reads Mixed", () => {
  const root = page(heading("a", { radius: 12, opacity: 80 }), heading("b", { opacity: 80 }));
  it("rounded corners differ → mixed; see-through is shared → not", () => {
    expect(mixedFields(root, ["a", "b"], "base", ["radius", "opacity"])).toEqual(["radius"]);
  });
  it("a phone value counts on the phone screen only", () => {
    const r = page(heading("a", { responsive: { phone: { opacity: 40 } } } as Partial<BoxNode>), heading("b"));
    expect(mixedFields(r, ["a", "b"], "base", ["opacity"])).toEqual([]);
    expect(mixedFields(r, ["a", "b"], "phone", ["opacity"])).toEqual(["opacity"]);
  });
});

describe("ED-13 the arrows move every selected block together", () => {
  const root = page(heading("a"), heading("b"), heading("c"), heading("d"));
  it("b and c move down one place together, in their order", () => {
    expect(reading(normalizeRowBands(moveBlocks(root, ["b", "c"], 1)))).toEqual(["a", "d", "b", "c"]);
  });
  it("…and up", () => {
    expect(reading(normalizeRowBands(moveBlocks(root, ["c", "b"], -1)))).toEqual(["b", "c", "a", "d"]);
  });
  it("nothing moves when one of them is already at the end", () => {
    expect(moveBlocks(root, ["c", "d"], 1)).toBe(root);
    expect(moveBlocks(root, ["a", "c"], -1)).toBe(root);
  });
});
