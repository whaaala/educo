import { describe, it, expect } from "vitest";
import {
  createContainer, createGrid, createElement, createRoot, createComponent,
  addAccItem, removeAccItem, moveAccItem, updateAccItem, sanitizeCssDeclarations, isEmptyBox,
  findBox, findParent, isAncestor, updateBox, insertBox, removeBox, moveBoxStep, moveBox,
  containerStyle, childStyle, paddingCSS, marginCSS, sizeToCSS, flexForWidth, fillMainAxis, u, newBoxId, dropIndexAmong,
  makeRowBand, normalizeRowBands, clampRowWidths, widthPct,
  isFloating, floatBox, unfloatBox, bringToFront, sendToBack, bringForward, sendBackward, floatingZRange,
  radiusCSS, isClipped, SHADOW_CSS, videoEmbedSrc,
  resolveResponsive, updateBoxResponsive, hasOverride, clearOverride,
  type BoxNode,
} from "@/lib/box-model";

describe("box-model — Educo UI component instances", () => {
  it("createComponent('accordion') makes a component node with starter items", () => {
    const acc = createComponent("accordion");
    expect(acc.type).toBe("component");
    expect(acc.component).toBe("accordion");
    expect(acc.variant).toBe("");
    expect(acc.width).toBe("100%");                 // fills the section it's dropped into
    expect((acc.accItems ?? []).length).toBeGreaterThanOrEqual(3);
    expect(isEmptyBox(acc)).toBe(false);            // never treated as an empty (shrinkable) box
  });

  it("accordion item helpers add / remove / move / update immutably", () => {
    const a = createComponent("accordion", { accItems: [{ id: "x", title: "one", body: "b1" }] } as Partial<BoxNode>);
    const added = addAccItem(a);
    expect(added.accItems!.length).toBe(2);
    expect(a.accItems!.length).toBe(1);             // original untouched

    const renamed = updateAccItem(added, "x", { title: "ONE", meta: "$5" });
    expect(renamed.accItems![0]).toMatchObject({ title: "ONE", meta: "$5" });
    expect(added.accItems![0].title).toBe("one");   // immutable

    const moved = moveAccItem(renamed, renamed.accItems![1].id, -1);
    expect(moved.accItems![0].id).toBe(renamed.accItems![1].id);

    const removed = removeAccItem(moved, "x");
    expect(removed.accItems!.some((it) => it.id === "x")).toBe(false);
  });

  it("sanitizeCssDeclarations keeps safe declarations and rejects breakouts / remote urls", () => {
    expect(sanitizeCssDeclarations("color: red; letter-spacing: .02em"))
      .toBe("color: red; letter-spacing: .02em;");
    expect(sanitizeCssDeclarations("color:red} body{display:none")).toBe("");      // selector breakout
    expect(sanitizeCssDeclarations("@import url(evil.css)")).toBe("");             // at-rule
    expect(sanitizeCssDeclarations("background: url(https://x/y.png)")).toBe("");  // remote url
    expect(sanitizeCssDeclarations("background: url('data:image/png;base64,AA')"))
      .toContain("background:");                                                    // data: url allowed
    expect(sanitizeCssDeclarations(undefined)).toBe("");
  });
});

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

  it("makeRowBand builds a full-width side-by-side row band", () => {
    const row = makeRowBand([createContainer("column", { id: "s1" } as Partial<BoxNode>)], 0);
    expect(row.rowBand).toBe(true);
    expect(row.direction).toBe("row");
    expect(row.width).toBe("fill");
    expect(row.wrap).toBe(false);
    expect(row.children!.map((c) => c.id)).toEqual(["s1"]);
  });

  it("normalizeRowBands wraps a bare section in its own row but leaves existing rows alone; idempotent", () => {
    const existing = makeRowBand([createContainer("column", { id: "a" } as Partial<BoxNode>)], 0);
    const root = createContainer("column", {
      id: "root",
      children: [createContainer("column", { id: "bare", width: "40%" } as Partial<BoxNode>), existing],
    } as Partial<BoxNode>);
    const norm = normalizeRowBands(root, 0);
    expect(norm.children!.length).toBe(2);
    expect(norm.children![0].rowBand).toBe(true);              // bare section got wrapped in a row
    expect(norm.children![0].children![0].id).toBe("bare");    // section keeps its identity
    expect(norm.children![0].children![0].width).toBe("100%"); // and fills its new solo row
    expect(norm.children![1].id).toBe(existing.id);            // existing row untouched
    expect(normalizeRowBands(norm, 0)).toEqual(norm);          // idempotent
  });

  it("clampRowWidths scales an over-full row's sections down so they never exceed 100% (no off-page overflow)", () => {
    const row = makeRowBand([
      createContainer("column", { id: "a", width: "100%" } as Partial<BoxNode>),
      createContainer("column", { id: "b", width: "100%" } as Partial<BoxNode>),
    ], 0);
    const clamped = clampRowWidths(row);
    expect(clamped.children!.map((c) => c.width)).toEqual(["50%", "50%"]); // 200% → scaled to 50/50
    // a valid row (≤100%) is returned untouched
    const ok = makeRowBand([createContainer("column", { id: "c", width: "40%" } as Partial<BoxNode>)], 0);
    expect(clampRowWidths(ok)).toBe(ok);
    // normalizeRowBands applies the clamp across all rows
    const root = createContainer("column", { id: "root", children: [row] } as Partial<BoxNode>);
    const norm = normalizeRowBands(root, 0);
    expect(norm.children![0].children!.map((c) => c.width)).toEqual(["50%", "50%"]);
  });

  it("normalizeRowBands RESPECTS the user's margins on every section (never strips them)", () => {
    const row = makeRowBand([
      createContainer("column", { id: "a", width: "40%", marginLeft: 200 } as Partial<BoxNode>),
      createContainer("column", { id: "b", width: "40%", marginLeft: 300 } as Partial<BoxNode>),
    ], 0);
    const root = createContainer("column", { id: "root", children: [row] } as Partial<BoxNode>);
    const norm = normalizeRowBands(root, 0);
    expect(norm.children![0].children![0].marginLeft).toBe(200); // kept
    expect(norm.children![0].children![1].marginLeft).toBe(300); // kept (not stripped)
  });

  it("normalizeRowBands PRUNES empty rows (no stray '+ Add' band left behind after a delete)", () => {
    const full = makeRowBand([createContainer("column", { id: "s", width: "100%" } as Partial<BoxNode>)], 0);
    const empty = makeRowBand([], 0);
    const root = createContainer("column", { id: "root", children: [full, empty] } as Partial<BoxNode>);
    const norm = normalizeRowBands(root, 0);
    expect(norm.children!.length).toBe(1);          // the empty row is gone
    expect(norm.children![0].id).toBe(full.id);     // the real row remains
  });

  it("widthPct reads a section's share for row-fullness maths", () => {
    expect(widthPct("40%")).toBe(40);
    expect(widthPct("fill")).toBe(100);
    expect(widthPct(undefined)).toBe(100);
    expect(widthPct("120px")).toBe(100); // non-% → treated as full
  });

  it("dropIndexAmong picks the slot before the first child the pointer hasn't passed", () => {
    const mids = [10, 30, 50]; // three children centred at 10, 30, 50 along the drag axis
    expect(dropIndexAmong(mids, 0)).toBe(0);   // before the first
    expect(dropIndexAmong(mids, 20)).toBe(1);  // between 1st and 2nd
    expect(dropIndexAmong(mids, 40)).toBe(2);  // between 2nd and 3rd
    expect(dropIndexAmong(mids, 999)).toBe(3); // past the last → append
    expect(dropIndexAmong([], 5)).toBe(0);     // empty container → first slot
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
    expect(childStyle(createElement("text", { width: "50%" } as Partial<BoxNode>), parent).flex).toBe("0 1 50%"); // fixed share, may shrink to fit
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

  it("a child with no main-size FILLS a DEFINITE-height parent (follows it), but HUGS a hug-content parent", () => {
    const noHeight = createElement("text", {} as Partial<BoxNode>); // no explicit height
    // column parent WITH a set height → the child fills + follows it (shrinks when the parent shrinks)
    expect(childStyle(noHeight, createContainer("column", { height: "40vh" } as Partial<BoxNode>)).flex).toBe("1 1 auto");
    // column parent that HUGS (no set height, e.g. the page) → the child hugs, so the parent grows with content
    expect(childStyle(noHeight, createContainer("column", {} as Partial<BoxNode>)).flex).toBe("0 0 auto");
  });

  it("hugs content by default; `clip` drops the flex minimum so a box can be forced smaller", () => {
    const parent = createContainer("column");
    const hug = childStyle(createElement("text", {} as Partial<BoxNode>), parent);
    expect(hug.minHeight).toBeUndefined(); // default: can't be smaller than content
    const clipped = childStyle(createElement("text", { clip: true } as Partial<BoxNode>), parent);
    expect(clipped.minHeight).toBe(0);
    expect(clipped.minWidth).toBe(0);
  });

  it("Responsive Field Guide: a ROW BAND wraps, and its sections keep a min width so they STACK on narrow screens", () => {
    const band = makeRowBand([createContainer("column", { width: "40%", children: [createElement("text", {} as Partial<BoxNode>)] } as Partial<BoxNode>)]);
    // the row band itself allows wrapping (so it reflows instead of cramming)
    expect(containerStyle(band).flexWrap).toBe("wrap");
    // a non-clipped section inside it keeps a usable minimum → wraps to a new line rather than shrinking below ~14rem
    const section = band.children![0];
    expect(childStyle(section, band).minWidth).toBe("min(100%, 14rem)");
    // a CLIPPED (explicitly resized) section still drops to 0 — reflow never overrides an intentional resize
    const clipped = childStyle(createContainer("column", { width: "40%", clip: true } as Partial<BoxNode>), band);
    expect(clipped.minWidth).toBe(0);
  });

  it("an EMPTY box with an EXPLICIT resize floor keeps that floor (childStyle must NOT zero it) — the height-resize regression", () => {
    const parent = createContainer("row"); // sections live inside a row band
    // An empty section (no children) that the user resized taller → minHeight set. isEmptyBox is true, but
    // the explicit floor must survive so the height edit is actually visible (the bug: it got zeroed).
    const resized = childStyle(createContainer("column", { minHeight: 180 } as Partial<BoxNode>), parent);
    expect(resized.minHeight).not.toBe(0);   // the floor is preserved (comes from containerStyle, not zeroed here)
    // An empty section with NO explicit floor still drops its content-min so it can shrink with the parent.
    const bare = childStyle(createContainer("column", {} as Partial<BoxNode>), parent);
    expect(bare.minHeight).toBe(0);
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
    expect(flexForWidth("40%")).toBe("0 1 40%"); // fixed share but may SHRINK to fit (never overflows off the page)
    expect(flexForWidth("auto")).toBe("0 0 auto");
    expect(flexForWidth(undefined)).toBe("0 0 auto");
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

describe("box-model — responsive per-breakpoint overrides", () => {
  const node = () => createContainer("column", {
    id: "n", width: "100%", direction: "row",
    responsive: { tablet: { width: "80%" }, mobile: { width: "100%", direction: "column" } },
  } as Partial<BoxNode>);

  it("resolveResponsive returns the base at 'base', and cascades tablet→mobile otherwise", () => {
    expect(resolveResponsive(node(), "base").width).toBe("100%");
    expect(resolveResponsive(node(), "base").direction).toBe("row");
    expect(resolveResponsive(node(), "tablet").width).toBe("80%");
    expect(resolveResponsive(node(), "tablet").direction).toBe("row"); // tablet didn't override direction → base
    expect(resolveResponsive(node(), "mobile").width).toBe("100%");
    expect(resolveResponsive(node(), "mobile").direction).toBe("column"); // mobile override wins
  });

  it("mobile inherits tablet where mobile doesn't override", () => {
    const n = createContainer("column", { id: "n", gap: 10, responsive: { tablet: { gap: 20 }, mobile: {} } } as Partial<BoxNode>);
    expect(resolveResponsive(n, "mobile").gap).toBe(20); // from tablet
  });

  it("updateBoxResponsive writes to the base at 'base', else into that breakpoint's override (base untouched)", () => {
    let t = createContainer("column", { id: "n", width: "100%" } as Partial<BoxNode>);
    t = updateBoxResponsive(t, "n", { width: "50%" }, "base");
    expect(findBox(t, "n")!.width).toBe("50%");
    t = updateBoxResponsive(t, "n", { width: "30%" }, "mobile");
    expect(findBox(t, "n")!.width).toBe("50%");                        // base unchanged
    expect(findBox(t, "n")!.responsive!.mobile!.width).toBe("30%");    // override stored
    expect(resolveResponsive(findBox(t, "n")!, "mobile").width).toBe("30%");
  });

  it("hasOverride + clearOverride manage a breakpoint's overrides", () => {
    const n = node();
    expect(hasOverride(n, "base")).toBe(false);
    expect(hasOverride(n, "tablet")).toBe(true);
    const cleared = clearOverride({ ...createContainer("column", { id: "root" } as Partial<BoxNode>), children: [n] }, "n", "tablet");
    expect(hasOverride(findBox(cleared, "n")!, "tablet")).toBe(false);
    expect(hasOverride(findBox(cleared, "n")!, "mobile")).toBe(true); // mobile kept
  });
});

describe("box-model — content types", () => {
  it("createElement builds the new element types with sensible defaults", () => {
    expect(createElement("video").height).toBe("315px");
    expect(createElement("icon").icon).toBe("Star");
    expect(createElement("list").listStyle).toBe("bullet");
    expect(createElement("list").listItems?.length).toBe(3);
    expect(createElement("embed").html).toBe("");
    expect(createElement("divider").width).toBe("fill");
  });

  it("videoEmbedSrc turns YouTube/Vimeo links into embeds, null for a direct file", () => {
    expect(videoEmbedSrc("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    expect(videoEmbedSrc("https://youtu.be/dQw4w9WgXcQ")).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    expect(videoEmbedSrc("https://vimeo.com/123456789")).toBe("https://player.vimeo.com/video/123456789");
    expect(videoEmbedSrc("https://cdn.example.com/clip.mp4")).toBeNull();
    expect(videoEmbedSrc(undefined)).toBeNull();
  });
});

describe("box-model — decoration (border / shadow / corners)", () => {
  it("radiusCSS falls back to the all-corners radius, then honours per-corner overrides", () => {
    expect(radiusCSS(createContainer("column", {} as Partial<BoxNode>))).toBeUndefined(); // nothing set
    expect(radiusCSS(createContainer("column", { radius: 12 } as Partial<BoxNode>))).toBe("12px 12px 12px 12px");
    const s = radiusCSS(createContainer("column", { radius: 12, radiusTopLeft: 0, radiusBottomRight: 40 } as Partial<BoxNode>));
    expect(s).toBe("0px 12px 40px 12px"); // TL, TR(=radius), BR, BL(=radius)
  });

  it("isClipped is true when clipped OR rounded (so overflow is hidden)", () => {
    expect(isClipped(createContainer("column", {} as Partial<BoxNode>))).toBe(false);
    expect(isClipped(createContainer("column", { clip: true } as Partial<BoxNode>))).toBe(true);
    expect(isClipped(createContainer("column", { radius: 8 } as Partial<BoxNode>))).toBe(true);
    expect(isClipped(createContainer("column", { radiusTopLeft: 8 } as Partial<BoxNode>))).toBe(true);
  });

  it("SHADOW_CSS exposes the four elevation presets", () => {
    expect(Object.keys(SHADOW_CSS)).toEqual(["sm", "md", "lg", "xl"]);
    expect(SHADOW_CSS.lg).toContain("rgba");
  });
});

describe("box-model — floating layers (free overlap)", () => {
  // A section with two child blocks (each already wrapped in its own row band).
  const tree = () => createContainer("column", {
    id: "sec",
    children: [
      makeRowBand([createContainer("column", { id: "a", width: "100%" } as Partial<BoxNode>)]),
      makeRowBand([createContainer("column", { id: "b", width: "100%" } as Partial<BoxNode>)]),
    ],
  } as Partial<BoxNode>);

  it("floatBox lifts a box onto its own layer: absolute, positioned, sheds flow styling, z above siblings", () => {
    const next = floatBox(tree(), "a", "sec", 12, 8, "60%", 200);
    const a = findBox(next, "a")!;
    expect(isFloating(a)).toBe(true);
    expect(a.position).toBe("absolute");
    expect(a.left).toBe(12); expect(a.top).toBe(8);
    expect(a.width).toBe("60%");
    expect(a.minHeight).toBe(200);
    expect(a.zIndex).toBe(1); // first floating child → z 1
    expect(a.marginLeft).toBeUndefined(); expect(a.alignSelf).toBeUndefined(); // flow-only styling cleared
    expect(a.clip).toBe(true); // a floating card can be resized (W+H) below its content
    // It became a DIRECT child of the positioning parent (out of its row band).
    expect(findParent(next, "a")!.parent.id).toBe("sec");
  });

  it("floatBox does NOT inflate the parent's height (no reserved-height leak / tall empty sections)", () => {
    const next = floatBox(tree(), "a", "sec", 0, 10, "50%", 220);
    expect(findBox(next, "sec")!.minHeight).toBeUndefined();
  });

  it("a second float stacks ABOVE the first (zIndex increments)", () => {
    let next = floatBox(tree(), "a", "sec", 0, 0, "50%", 100);
    next = floatBox(next, "b", "sec", 20, 20, "50%", 100);
    expect(findBox(next, "a")!.zIndex).toBe(1);
    expect(findBox(next, "b")!.zIndex).toBe(2);
  });

  it("floatBox refuses to drop a box into itself / a descendant", () => {
    const t = createContainer("column", { id: "outer", children: [createContainer("column", { id: "inner" } as Partial<BoxNode>)] } as Partial<BoxNode>);
    expect(floatBox(t, "outer", "inner", 0, 0, "50%", 50)).toBe(t); // no-op
  });

  it("bringToFront / sendToBack restack among floating siblings only", () => {
    let next = floatBox(tree(), "a", "sec", 0, 0, "50%", 100);   // z1
    next = floatBox(next, "b", "sec", 10, 10, "50%", 100);       // z2
    next = sendToBack(next, "b");
    expect(findBox(next, "b")!.zIndex!).toBeLessThan(findBox(next, "a")!.zIndex!);
    next = bringToFront(next, "b");
    expect(findBox(next, "b")!.zIndex!).toBeGreaterThan(findBox(next, "a")!.zIndex!);
  });

  it("unfloatBox returns the box to the flow (drops position/left/top/z) and undoes the float's side-effects", () => {
    // even a parent that carries a leaked minHeight (from an older reserve) is released on unfloat → no tall gap
    const floated = updateBox(floatBox(tree(), "a", "sec", 12, 8, "60%", 200), "sec", { minHeight: 400 });
    const back = unfloatBox(floated, "a");
    const a = findBox(back, "a")!;
    expect(isFloating(a)).toBe(false);
    expect(a.position).toBeUndefined(); expect(a.left).toBeUndefined(); expect(a.top).toBeUndefined(); expect(a.zIndex).toBeUndefined();
    expect(a.clip).toBeUndefined();                                  // the auto float-clip is cleared
    expect(findBox(back, "sec")!.minHeight).toBeUndefined();         // any leaked parent gap is released
  });

  it("unfloatBox restores a COMPONENT to full width (its compact fixed px width was only for the floating card)", () => {
    const sec = createContainer("column", { id: "s", children: [createComponent("accordion", { id: "c", width: "500px" } as Partial<BoxNode>)] } as Partial<BoxNode>);
    const floated = floatBox(sec, "c", "s", 0, 0, "500px", 300);
    expect(findBox(floated, "c")!.width).toBe("500px");
    expect(findBox(unfloatBox(floated, "c"), "c")!.width).toBe("100%"); // back to responsive
  });

  it("normalizeRowBands keeps a floating child OUT of the flow — not wrapped in a row band, not pruned", () => {
    const floated = floatBox(tree(), "a", "sec", 12, 8, "60%", 200);
    const norm = normalizeRowBands(floated, 0);
    // 'a' stays a DIRECT child of the section (absolute), never re-wrapped into a row band.
    const aParent = findParent(norm, "a")!.parent;
    expect(aParent.id).toBe("sec");
    expect(aParent.rowBand).toBeFalsy();
    expect(findBox(norm, "a")!.position).toBe("absolute");
    // 'b' is still a flow section inside a (kept) row band.
    expect(findParent(norm, "b")!.parent.rowBand).toBe(true);
  });

  it("bringForward / sendBackward move a floating box ONE layer and keep z sequential (presentation ordering)", () => {
    // three floating siblings a<b<c by z
    const p = createContainer("column", { id: "p", children: [
      createContainer("column", { id: "a", position: "absolute", zIndex: 1 } as Partial<BoxNode>),
      createContainer("column", { id: "b", position: "absolute", zIndex: 2 } as Partial<BoxNode>),
      createContainer("column", { id: "c", position: "absolute", zIndex: 3 } as Partial<BoxNode>),
    ] } as Partial<BoxNode>);
    // bring 'a' forward one → order becomes b,a,c → z 1,2,3
    let next = bringForward(p, "a");
    expect(findBox(next, "b")!.zIndex).toBe(1);
    expect(findBox(next, "a")!.zIndex).toBe(2);
    expect(findBox(next, "c")!.zIndex).toBe(3);
    // send 'c' backward one → order b,c,a → but starting from the ORIGINAL p: c(3)→ swaps with b(2)
    next = sendBackward(p, "c");
    expect(findBox(next, "c")!.zIndex).toBe(2);
    expect(findBox(next, "b")!.zIndex).toBe(3);
  });

  it("bringForward is a no-op at the TOP and sendBackward a no-op at the BOTTOM", () => {
    const p = createContainer("column", { id: "p", children: [
      createContainer("column", { id: "a", position: "absolute", zIndex: 1 } as Partial<BoxNode>),
      createContainer("column", { id: "b", position: "absolute", zIndex: 2 } as Partial<BoxNode>),
    ] } as Partial<BoxNode>);
    expect(bringForward(p, "b")).toBe(p); // b already on top
    expect(sendBackward(p, "a")).toBe(p); // a already at bottom
  });

  it("floatingZRange reports the min/max z among floating children (0 when none)", () => {
    expect(floatingZRange(createContainer("column"))).toEqual({ min: 0, max: 0 });
    const p = createContainer("column", { children: [
      createContainer("column", { position: "absolute", zIndex: 3 } as Partial<BoxNode>),
      createContainer("column", { position: "absolute", zIndex: 7 } as Partial<BoxNode>),
      createContainer("column", {}), // flow child ignored
    ] } as Partial<BoxNode>);
    expect(floatingZRange(p)).toEqual({ min: 3, max: 7 });
  });
});
