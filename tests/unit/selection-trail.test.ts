import { describe, it, expect } from "vitest";
import { createContainer, createElement, selectionChain, type BoxNode } from "@/lib/box-model";

// ED-2 (BATCH LE-10) — tests/features/components/website/box-builder-where-am-i.feature. The Inspector's trail and
// Escape both read `selectionChain`; this pins what it returns for a tree shaped the way the UI builds one: every block
// a Stack holds sits in a row band of its own (LE9-3), and so does every section of the page.
const band = (child: BoxNode, id: string) => createContainer("row", { id, rowBand: true, children: [child] });
const heading = createElement("heading", { id: "h", text: "Welcome" });
const sbs = createContainer("row", { id: "sbs", children: [heading] });
const stack = createContainer("column", { id: "stack", children: [band(sbs, "b2")] });
const root = createContainer("column", { id: "root", children: [band(stack, "b1")] });

describe("selectionChain — the trail the Inspector shows", () => {
  it("names the blocks round the selection outermost first, ending with the selection", () => {
    expect(selectionChain(root, "h")).toEqual(["stack", "sbs", "h"]);
  });

  it("leaves out the page itself and every structural row band", () => {
    const chain = selectionChain(root, "h");
    expect(chain).not.toContain("root");
    expect(chain).not.toContain("b1");
    expect(chain).not.toContain("b2");
  });

  it("a block at the top of the page is a trail of one — nothing around it to name", () => {
    expect(selectionChain(root, "stack")).toEqual(["stack"]);
  });

  it("a block that is not on the page has no trail", () => {
    expect(selectionChain(root, "gone")).toEqual([]);
  });
});
