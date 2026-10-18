/**
 * ED-12 · group / ungroup IN PLACE (BATCH LE-14; tests/features/components/website/box-builder-group.feature).
 * The trees are built as the UI builds them: every block dropped on the page or in a Stack sits in its own row band, and
 * every commit runs `normalizeRowBands` (app/website/box-demo/page.tsx commit) — so the guards do too.
 */
import { describe, it, expect } from "vitest";
import {
  type BoxNode, createContainer, createElement, insertBox, normalizeRowBands, makeRowBand, findBox, findParent,
  groupBoxes, ungroupBoxes, canGroup, groupAround,
} from "@/lib/box-model";

const heading = (id: string, width = "auto") => createElement("heading", { id, text: id, width } as Partial<BoxNode>);
const text = (id: string) => createElement("text", { id, text: id, width: "auto" } as Partial<BoxNode>);
/** A page of blocks one under the other, each in its own band — as the palette drops them. */
function page(...blocks: BoxNode[]): BoxNode {
  let root = createContainer("column", { id: "root", padding: 0, gap: 0, children: [] } as Partial<BoxNode>);
  for (const b of blocks) root = normalizeRowBands(insertBox(root, "root", root.children!.length, b));
  return root;
}
/** The leaves in reading order. */
const reading = (n: BoxNode): string[] => (n.children ?? []).flatMap((c) => (c.type === "container" ? reading(c) : [c.id]));
const groupOf = groupAround;
const commit = (r: BoxNode) => normalizeRowBands(r);

describe("ED-12 group in place, one under the other", () => {
  const start = page(heading("h1"), heading("h2"), text("t"));
  const grouped = commit(groupBoxes(start, ["h1", "h2"]));
  const g = groupOf(grouped, "h1")!;

  it("one group holds both Headings, the page still reads h1 · h2 · t (LE14-2)", () => {
    expect(g).toBeTruthy();
    expect(groupOf(grouped, "h2")?.id).toBe(g.id);
    expect(reading(grouped)).toEqual(["h1", "h2", "t"]);
  });
  it("the group does not float and sits where the first Heading was (LE14-2)", () => {
    expect(g.position).toBeUndefined();
    expect(g.left).toBeUndefined(); expect(g.top).toBeUndefined(); expect(g.zIndex).toBeUndefined();
    const band = findParent(grouped, g.id)!.parent;
    expect(findParent(grouped, band.id)!.parent.id).toBe("root");
    expect(findParent(grouped, band.id)!.index).toBe(0);
  });
  it("the group adds no gap, padding, margin or background, and no fixed height (LE14-3, LE14-6)", () => {
    expect(g.gap ?? 0).toBe(0);
    expect(g.padding ?? 0).toBe(0);
    expect(g.margin ?? 0).toBe(0);
    expect(g.background).toBeUndefined();
    expect(g.height).toBeUndefined(); expect(g.minHeight).toBeUndefined();
  });
  it("each Heading keeps its own width (LE14-4)", () => {
    expect(findBox(grouped, "h1")!.width).toBe("auto");
    expect(findBox(grouped, "h2")!.width).toBe("auto");
  });
  it("ungroup gives back the page it started from — same blocks, same places, same widths (LE14-4, LE14-5)", () => {
    expect(commit(ungroupBoxes(grouped, g.id))).toEqual(start);
  });
});

describe("ED-12 group in place, side by side", () => {
  // three blocks on one line of the page, each a third of it
  const start = (() => {
    let root = createContainer("column", { id: "root", padding: 0, gap: 0, children: [] } as Partial<BoxNode>);
    root = insertBox(root, "root", 0, makeRowBand([heading("a", "25%"), heading("b", "25%"), heading("c", "50%")]));
    return commit(root);
  })();
  const grouped = commit(groupBoxes(start, ["a", "b"]));
  const g = groupOf(grouped, "a")!;

  it("the group sits on the line in their place, a side by side as wide as their two shares", () => {
    const line = findParent(grouped, g.id)!;
    expect(line.parent.rowBand).toBe(true);
    expect(line.index).toBe(0);
    expect(line.parent.children!.map((k) => k.id)).toEqual([g.id, "c"]);
    expect(g.direction).toBe("row");
    expect(g.width).toBe("50%");
  });
  it("each block keeps its place and size: 25 % of the line = 50 % of a group half the line wide", () => {
    expect(g.children!.map((k) => k.id)).toEqual(["a", "b"]);
    expect(findBox(grouped, "a")!.width).toBe("50%");
    expect(findBox(grouped, "b")!.width).toBe("50%");
    expect(g.gap ?? 0).toBe(0);
  });
  it("ungroup gives back the line exactly", () => {
    expect(commit(ungroupBoxes(grouped, g.id))).toEqual(start);
  });
});

describe("ED-12 what cannot be grouped", () => {
  it("blocks in two different sections cannot be grouped, and groupBoxes leaves the page alone", () => {
    let root = page(createContainer("column", { id: "s1", children: [] } as Partial<BoxNode>), createContainer("column", { id: "s2", children: [] } as Partial<BoxNode>));
    root = commit(insertBox(root, "s1", 0, heading("x")));
    root = commit(insertBox(root, "s2", 0, heading("y")));
    expect(canGroup(root, ["x", "y"])).toBe(false);
    expect(groupBoxes(root, ["x", "y"])).toBe(root);
  });
  it("one block alone is not a group", () => {
    const root = page(heading("h1"), heading("h2"));
    expect(canGroup(root, ["h1"])).toBe(false);
    expect(groupBoxes(root, ["h1"])).toBe(root);
  });
  it("two blocks one under the other in the same section can", () => {
    expect(canGroup(page(heading("h1"), heading("h2")), ["h2", "h1"])).toBe(true);
  });
});

describe("ED-12 a group saved before this change", () => {
  it("a floating group at the page root ungroups into the flow where it was", () => {
    const old = createContainer("column", { id: "g", group: true, position: "absolute", left: 10, top: 10, zIndex: 3, gap: 12, children: [heading("p", "100%"), heading("q", "100%")] } as Partial<BoxNode>);
    let root = page(text("t"));
    root = insertBox(root, "root", 1, old);
    const back = commit(ungroupBoxes(root, "g"));
    expect(reading(back)).toEqual(["t", "p", "q"]);
    expect(findBox(back, "p")!.position).toBeUndefined();
    expect(findBox(back, "g")).toBeNull();
  });
});
