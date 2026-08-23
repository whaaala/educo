import { describe, it, expect } from "vitest";
import {
  createContainer, createGrid, createElement, createRoot,
  findBox, findParent, isAncestor, updateBox, insertBox, removeBox, moveBoxStep, moveBox,
  containerStyle, childStyle, paddingCSS, marginCSS, sizeToCSS, flexForWidth, fillMainAxis, u, newBoxId,
  type BoxNode,
} from "@/lib/box-model";

describe("box-model — factories", () => {
  it("createContainer defaults to a flex column that fills its parent", () => {
    const c = createContainer();
    expect(c.type).toBe("container");
    expect(c.layout).toBe("flex");
    expect(c.direction).toBe("column");
    expect(c.width).toBe("fill");
    expect(c.children).toEqual([]);
  });

  it("createGrid makes a grid container with N columns", () => {
    const g = createGrid(3);
    expect(g.layout).toBe("grid");
    expect(g.columns).toBe(3);
  });

  it("createElement builds each leaf type with sensible defaults", () => {
    expect(createElement("heading").bold).toBe(true);
    expect(createElement("button").href).toBeTruthy();
    expect(createElement("image").src).toBe("");
    expect(createElement("text").text).toBeTruthy();
  });

  it("newBoxId is unique across rapid calls", () => {
    const ids = Array.from({ length: 200 }, () => newBoxId());
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("box-model — tree queries", () => {
  const leaf = createElement("text", { id: "leaf" } as Partial<BoxNode>);
  const inner = createContainer("row", { id: "inner", children: [leaf] } as Partial<BoxNode>);
  const root = createContainer("column", { id: "root", children: [inner] } as Partial<BoxNode>);

  it("findBox locates nodes at any depth", () => {
    expect(findBox(root, "leaf")?.id).toBe("leaf");
    expect(findBox(root, "nope")).toBeNull();
  });

  it("findParent returns the parent and index", () => {
    expect(findParent(root, "leaf")).toEqual({ parent: inner, index: 0 });
    expect(findParent(root, "root")).toBeNull();
  });

  it("isAncestor guards nesting a node into its own subtree", () => {
    expect(isAncestor(root, "root", "leaf")).toBe(true);
    expect(isAncestor(root, "leaf", "root")).toBe(false);
  });
});

describe("box-model — mutations are immutable and correct", () => {
  const build = () => createContainer("column", {
    id: "root",
    children: [createElement("text", { id: "a" } as Partial<BoxNode>), createElement("text", { id: "b" } as Partial<BoxNode>)],
  } as Partial<BoxNode>);

  it("updateBox merges a patch without mutating the original", () => {
    const root = build();
    const next = updateBox(root, "a", { text: "changed" });
    expect(findBox(next, "a")?.text).toBe("changed");
    expect(findBox(root, "a")?.text).not.toBe("changed"); // original untouched
  });

  it("insertBox adds a child at the given index", () => {
    const root = build();
    const next = insertBox(root, "root", 1, createElement("button", { id: "x" } as Partial<BoxNode>));
    expect(next.children!.map((c) => c.id)).toEqual(["a", "x", "b"]);
  });

  it("removeBox deletes a node anywhere in the tree", () => {
    const root = build();
    expect(removeBox(root, "a").children!.map((c) => c.id)).toEqual(["b"]);
  });

  it("moveBoxStep reorders within the parent", () => {
    const root = build();
    expect(moveBoxStep(root, "a", 1).children!.map((c) => c.id)).toEqual(["b", "a"]);
    expect(moveBoxStep(root, "a", -1).children!.map((c) => c.id)).toEqual(["a", "b"]); // clamped, no-op
  });

  it("moveBox reparents into another container", () => {
    const box = createContainer("column", {
      id: "root",
      children: [
        createElement("text", { id: "a" } as Partial<BoxNode>),
        createContainer("row", { id: "col", children: [] } as Partial<BoxNode>),
      ],
    } as Partial<BoxNode>);
    const next = moveBox(box, "a", "col", 0);
    expect(next.children!.map((c) => c.id)).toEqual(["col"]); // a left the root
    expect(findBox(next, "col")!.children!.map((c) => c.id)).toEqual(["a"]); // a now inside col
  });

  it("moveBox refuses to drop a container into its own descendant", () => {
    const box = createContainer("column", {
      id: "root",
      children: [createContainer("row", { id: "outer", children: [createContainer("row", { id: "innr", children: [] } as Partial<BoxNode>)] } as Partial<BoxNode>)],
    } as Partial<BoxNode>);
    expect(moveBox(box, "outer", "innr", 0)).toBe(box); // invalid → original tree returned
  });
});

describe("box-model — layout CSS mapping", () => {
  it("containerStyle produces flex CSS for a flex container", () => {
    const s = containerStyle(createContainer("row", { gap: 20, align: "center", justify: "between", wrap: true }));
    expect(s.display).toBe("flex");
    expect(s.flexDirection).toBe("row");
    expect(s.gap).toBe(u(20));
    expect(s.alignItems).toBe("center");
    expect(s.justifyContent).toBe("space-between");
    expect(s.flexWrap).toBe("wrap");
  });

  it("containerStyle produces grid CSS with N equal columns", () => {
    const s = containerStyle(createGrid(4, { gap: 12 }));
    expect(s.display).toBe("grid");
    expect(s.gridTemplateColumns).toBe("repeat(4, minmax(0, 1fr))");
    expect(s.gap).toBe(u(12));
  });

  it("childStyle carries flex width via flex-basis for a flex parent", () => {
    const parent = createContainer("row");
    expect(childStyle(createElement("text", { width: "fill" } as Partial<BoxNode>), parent).flex).toBe("1 1 0%");
    expect(childStyle(createElement("text", { width: "50%" } as Partial<BoxNode>), parent).flex).toBe("0 0 50%");
    expect(childStyle(createElement("text", { width: "auto" } as Partial<BoxNode>), parent).flex).toBe("0 0 auto");
  });

  it("childStyle divides the MAIN axis: height drives flex in a column, width in a row", () => {
    const col = createContainer("column");
    // in a column the main axis is height → height:"fill" makes it divide equally
    expect(childStyle(createElement("text", { height: "fill" } as Partial<BoxNode>), col).flex).toBe("1 1 0%");
    expect(childStyle(createElement("text", { height: "auto" } as Partial<BoxNode>), col).flex).toBe("0 0 auto");
    // cross axis (width) is applied as a plain size
    expect(childStyle(createElement("text", { width: "200px" } as Partial<BoxNode>), col).width).toBe("200px");

    const row = createContainer("row");
    expect(childStyle(createElement("text", { width: "fill" } as Partial<BoxNode>), row).flex).toBe("1 1 0%");
    expect(childStyle(createElement("text", { height: "120px" } as Partial<BoxNode>), row).height).toBe("120px");
  });

  it("hugs content by default; `clip` drops the flex minimum so a box can be forced smaller", () => {
    const parent = createContainer("column");
    const hug = childStyle(createElement("text", {} as Partial<BoxNode>), parent);
    expect(hug.minHeight).toBeUndefined(); // default: can't be smaller than content
    const clipped = childStyle(createElement("text", { clip: true } as Partial<BoxNode>), parent);
    expect(clipped.minHeight).toBe(0);
    expect(clipped.minWidth).toBe(0);
  });

  it("childStyle uses grid-column span for a grid parent", () => {
    const parent = createGrid(3);
    const s = childStyle(createElement("image", { colSpan: 2 } as Partial<BoxNode>), parent);
    expect(s.gridColumn).toBe("span 2");
    expect(s.flex).toBeUndefined(); // grid children don't use flex
  });

  it("sizeToCSS + flexForWidth translate width tokens", () => {
    expect(sizeToCSS("auto")).toBeUndefined();
    expect(sizeToCSS("fill")).toBe("100%");
    expect(sizeToCSS("240px")).toBe("240px");
    expect(flexForWidth("fill")).toBe("1 1 0%");
  });
});

describe("box-model — per-side spacing", () => {
  it("paddingCSS uses the general padding for every side by default (responsive rem)", () => {
    expect(paddingCSS(createContainer("column", { padding: 20 }))).toEqual({ paddingTop: u(20), paddingRight: u(20), paddingBottom: u(20), paddingLeft: u(20) });
  });

  it("paddingCSS lets a per-side value override just that side", () => {
    const s = paddingCSS(createContainer("column", { padding: 20, paddingLeft: 4, paddingTop: 60 }));
    expect(s).toEqual({ paddingTop: u(60), paddingRight: u(20), paddingBottom: u(20), paddingLeft: u(4) });
  });

  it("marginCSS falls back to the general margin and honours per-side overrides", () => {
    expect(marginCSS(createContainer("column", { margin: 12 }))).toEqual({ marginTop: u(12), marginRight: u(12), marginBottom: u(12), marginLeft: u(12) });
    expect(marginCSS(createContainer("column", { margin: 12, marginBottom: 40 })).marginBottom).toBe(u(40));
    expect(marginCSS(createContainer("column", {})).marginTop).toBeUndefined(); // no margin at all
  });

  it("containerStyle applies per-side padding (responsive rem)", () => {
    const s = containerStyle(createContainer("column", { padding: 10, paddingTop: 50 }));
    expect(s.paddingTop).toBe(u(50));
    expect(s.paddingBottom).toBe(u(10));
  });

  it("u() renders a px-at-base-10 size as a browser-relative rem calc (WCAG resize)", () => {
    expect(u(10)).toBe("calc(var(--box-u, 0.625rem) * 1)");
    expect(u(16)).toBe("calc(var(--box-u, 0.625rem) * 1.6)");
    expect(u(0)).toBe("calc(var(--box-u, 0.625rem) * 0)");
  });
});

describe("box-model — equal division (fillMainAxis)", () => {
  const page = () => createContainer("column", {
    id: "root",
    children: [
      createElement("text", { id: "a", height: "300px" } as Partial<BoxNode>),
      createElement("text", { id: "b", height: "fill" } as Partial<BoxNode>),
      createElement("text", { id: "c", height: "fill" } as Partial<BoxNode>),
    ],
  } as Partial<BoxNode>);

  it("sets every child's MAIN-axis size to fill so they divide the page equally", () => {
    const next = fillMainAxis(page(), "root");
    expect(next.children!.map((c) => c.height)).toEqual(["fill", "fill", "fill"]);
  });

  it("leaves the just-resized child fixed and reflows only the others", () => {
    const next = fillMainAxis(page(), "root", "a"); // keep 'a' at 300px, others fill remaining
    expect(next.children!.map((c) => [c.id, c.height])).toEqual([["a", "300px"], ["b", "fill"], ["c", "fill"]]);
  });

  it("uses the width token when the container is a row", () => {
    const rowPage = createContainer("row", { id: "r", children: [createElement("text", { id: "x", width: "200px" } as Partial<BoxNode>), createElement("text", { id: "y", width: "fill" } as Partial<BoxNode>)] } as Partial<BoxNode>);
    expect(fillMainAxis(rowPage, "r").children!.map((c) => c.width)).toEqual(["fill", "fill"]);
  });
});
