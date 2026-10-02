import { describe, it, expect } from "vitest";
import { coerceSite } from "@/lib/box-site";
import { BREAKPOINTS_EM } from "@/lib/educo-ui/base";
import {
  createContainer, createGrid, createElement, createComponent,
  addItem, removeItem, moveItem, updateItem, addChildItem, updateChildItem, removeChildItem, moveChildItem, sanitizeCssDeclarations, expandScopedCss, ACCORDION_CSS_PARTS, itemOverrideCss, itemHasOverride, itemFloatReserveRem, richBody, plainBody, isEmptyBox,
  findBox, findParent, isAncestor, updateBox, insertBox, removeBox, deleteBox, stackWithBlock, moveBoxStep, moveBox,
  containerStyle, childStyle, paddingCSS, marginCSS, sizeToCSS, flexForWidth, fillMainAxis, u, newBoxId, dropIndexAmong, EMPTY_BOX_MIN, fitRowWidths,
  makeRowBand, normalizeRowBands, clampRowWidths, widthPct, fitBand, packRowLines, allocateLine, aloneOnItsLine, blockTypography,
  isFloating, floatBox, unfloatBox, groupBoxes, ungroupBoxes, alignInRow, alignInRowOf, bringToFront, sendToBack, bringForward, sendBackward, floatingZRange, cloneBox,
  isCssBg, bgImageLayer, renderAlertHTML, bgShowThroughCss,
  radiusCSS, isClipped, SHADOW_CSS, videoEmbedSrc,
  resolveResponsive, updateBoxResponsive, hasOverride, clearOverride, BP_ORDER,
  remLen, hostSizedFor, restForDrag, balancedLines, tabletPlaces, onManyColumnLine, columnFloorRem,
  type BoxNode,
} from "@/lib/box-model";

describe("box-model — Educo UI component instances", () => {
  it("createComponent('accordion') makes a component node with starter items", () => {
    const acc = createComponent("accordion");
    expect(acc.type).toBe("component");
    expect(acc.component).toBe("accordion");
    expect(acc.variant).toBe("");
    expect(acc.width).toBe("100%");                 // F-1: fills its line; Hug/Custom are opt-in
    expect((acc.items ?? []).length).toBeGreaterThanOrEqual(3);
    expect(isEmptyBox(acc)).toBe(false);            // never treated as an empty (shrinkable) box
  });

  it("accordion item helpers add / remove / move / update immutably", () => {
    const a = createComponent("accordion", { items: [{ id: "x", title: "one", body: "b1" }] } as Partial<BoxNode>);
    const added = addItem(a);
    expect(added.items!.length).toBe(2);
    expect(a.items!.length).toBe(1);             // original untouched

    const renamed = updateItem(added, "x", { title: "ONE", meta: "$5" });
    expect(renamed.items![0]).toMatchObject({ title: "ONE", meta: "$5" });
    expect(added.items![0].title).toBe("one");   // immutable

    const moved = moveItem(renamed, renamed.items![1].id, -1);
    expect(moved.items![0].id).toBe(renamed.items![1].id);

    const removed = removeItem(moved, "x");
    expect(removed.items!.some((it) => it.id === "x")).toBe(false);
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

  it("expandScopedCss: bare declarations style the scope itself (and always win via !important)", () => {
    expect(expandScopedCss("background: #fef3c7; color: red", ".item", ACCORDION_CSS_PARTS))
      .toBe(".item{background: #fef3c7 !important; color: red !important;}");
  });

  it("expandScopedCss: part blocks target inner parts — text, background, colour of ANY part", () => {
    const out = expandScopedCss(
      "background:#111; title { color:#fff } body { background:#222 } icon { color:#0f0 } meta { color:#ff0 } media { border-radius:8px }",
      ".it", ACCORDION_CSS_PARTS,
    );
    expect(out).toContain(".it{background:#111 !important;}");
    expect(out).toContain(".it .eu-accordion__header{color:#fff !important;}");   // title → header text
    expect(out).toContain(".it .eu-accordion__body{background:#222 !important;}"); // body/answer
    expect(out).toContain(".it .eu-accordion__header::after{color:#0f0 !important;}"); // icon marker
    expect(out).toContain(".it .eu-accordion__meta{color:#ff0 !important;}");
    expect(out).toContain(".it .eu-accordion__media{border-radius:8px !important;}");
  });

  it("expandScopedCss: friendly aliases resolve (content→body, header/summary→header, root→item)", () => {
    expect(expandScopedCss("content { color:red }", ".x", ACCORDION_CSS_PARTS)).toBe(".x .eu-accordion__body{color:red !important;}");
    expect(expandScopedCss("summary { color:red }", ".x", ACCORDION_CSS_PARTS)).toBe(".x .eu-accordion__header{color:red !important;}");
    expect(expandScopedCss("root { color:red }", ".x", ACCORDION_CSS_PARTS)).toBe(".x{color:red !important;}");
  });

  it("expandScopedCss: an existing !important is not doubled", () => {
    expect(expandScopedCss("color: red !important", ".x", ACCORDION_CSS_PARTS)).toBe(".x{color: red !important;}");
  });

  it("expandScopedCss: unknown parts and unsafe declarations are dropped (safe)", () => {
    expect(expandScopedCss("evilpart { color:red }", ".x", ACCORDION_CSS_PARTS)).toBe("");     // not allow-listed
    expect(expandScopedCss("title { color:red; background:url(https://x/y) }", ".x", ACCORDION_CSS_PARTS))
      .toBe(".x .eu-accordion__header{color:red !important;}");                                 // remote url stripped
    expect(expandScopedCss("body { position:fixed } head { display:none }", ".x", ACCORDION_CSS_PARTS))
      .toBe(".x .eu-accordion__body{position:fixed !important;}");                              // 'head' not a part
    expect(expandScopedCss("", ".x", ACCORDION_CSS_PARTS)).toBe("");
    expect(expandScopedCss(undefined, ".x", ACCORDION_CSS_PARTS)).toBe("");
  });

  it("expandScopedCss: with no parts map, only bare declarations survive", () => {
    expect(expandScopedCss("color: red; title { color:#fff }", ".x")).toBe(".x{color: red !important;}");
  });

  it("richBody: safe markdown-lite → links / bold / italic / lists / paragraphs; HTML is escaped first", () => {
    expect(richBody("See [our docs](https://x.com/a) for **more** *now*."))
      .toBe('<p>See <a href="https://x.com/a" target="_blank" rel="noopener noreferrer">our docs</a> for <strong>more</strong> <em>now</em>.</p>');
    expect(richBody("- one\n- two")).toBe("<ul><li>one</li><li>two</li></ul>");
    expect(richBody("a\n\nb")).toBe("<p>a</p><p>b</p>");
    // injection is neutralised (escaped) — no live tag, and non-http links are NOT linkified
    expect(richBody("<script>alert(1)</script> [x](javascript:alert(1))"))
      .toBe("<p>&lt;script&gt;alert(1)&lt;/script&gt; [x](javascript:alert(1))</p>");
    expect(richBody("")).toBe("");
  });

  it("plainBody: strips the rich markup for JSON-LD / meta", () => {
    expect(plainBody("See [docs](https://x.com) for **more**.")).toBe("See docs for more.");
  });

  it("nested sub-item CRUD: add / update / move / remove children under a parent item", () => {
    let n = createComponent("accordion", { id: "a", items: [{ id: "p", title: "Parent", body: "" }] } as Partial<BoxNode>);
    n = addChildItem(n, "p"); n = addChildItem(n, "p");
    expect(n.items![0].children).toHaveLength(2);
    const [c1, c2] = n.items![0].children!;
    n = updateChildItem(n, "p", c1.id, { title: "First" });
    expect(n.items![0].children![0].title).toBe("First");
    n = moveChildItem(n, "p", c1.id, 1); // c1 down → order c2, c1
    expect(n.items![0].children!.map((c) => c.id)).toEqual([c2.id, c1.id]);
    n = removeChildItem(n, "p", c2.id);
    expect(n.items![0].children!.map((c) => c.id)).toEqual([c1.id]);
  });

  it("itemHasOverride: true when the item has header/body styling OR raw CSS, false when bare", () => {
    expect(itemHasOverride({ id: "i", title: "t", body: "b" })).toBe(false);
    expect(itemHasOverride({ id: "i", title: "t", body: "b", headerStyle: { color: "#111" } })).toBe(true);
    expect(itemHasOverride({ id: "i", title: "t", body: "b", bodyStyle: { background: "#eee" } })).toBe(true);
    expect(itemHasOverride({ id: "i", title: "t", body: "b", css: "color: red;" })).toBe(true);
    expect(itemHasOverride({ id: "i", title: "t", body: "b", headerStyle: {} })).toBe(false); // empty style = nothing
  });

  it("itemOverrideCss: point-and-click Header/Content colour+font compile to scoped !important rules", () => {
    const out = itemOverrideCss(".it", {
      id: "i", title: "t", body: "b",
      headerStyle: { color: "#b45309", background: "#fef3c7", fontFamily: "Georgia, serif", fontSize: "26px" },
      bodyStyle: { color: "#334155", background: "#fff7ed" },
    });
    expect(out).toContain(".it .eu-accordion__header{");
    expect(out).toContain("color: #b45309 !important;");
    expect(out).toContain("background: #fef3c7 !important;");
    expect(out).toContain("font-family: Georgia, serif !important;");
    expect(out).toContain("font-size: 26px !important;");
    expect(out).toContain(".it .eu-accordion__body{color: #334155 !important; background: #fff7ed !important;}");
  });

  it("itemOverrideCss: content ALIGN — header aligns via flex (justify-content), body via text-align", () => {
    expect(itemHasOverride({ id: "i", title: "t", body: "b", headerStyle: { align: "center" } })).toBe(true);
    const out = itemOverrideCss(".it", { id: "i", title: "t", body: "b", headerStyle: { align: "right" }, bodyStyle: { align: "center" } });
    expect(out).toContain(".it .eu-accordion__header{text-align: right !important; justify-content: flex-end !important;}");
    expect(out).toContain(".it .eu-accordion__body{text-align: center !important;}");
  });

  it("itemOverrideCss: FREE positioning — header moves the title, content moves the text area (rem, gap kept)", () => {
    expect(itemHasOverride({ id: "i", title: "t", body: "b", headerStyle: { pos: { x: 1, y: 1 } } })).toBe(true);
    const out = itemOverrideCss(".it", { id: "i", title: "t", body: "b", headerStyle: { pos: { x: 2, y: -1 } }, bodyStyle: { pos: { x: 0, y: 3 } } });
    expect(out).toContain(".it .eu-accordion__title{position:relative !important;transform:translate(2rem,-1rem) !important;}");
    expect(out).toContain(".it .eu-accordion__body{position:relative !important;transform:translate(0rem,3rem) !important;}");
  });

  it("renderAlertHTML: multi-item, severity accent + role, recursive sub-items, dismiss opt-in", () => {
    const node = createComponent("alert", { alertSeverity: "danger", alertDismiss: true, variant: "--solid",
      items: [{ id: "a", title: "Oops", body: "Broke.", children: [{ id: "a1", title: "Detail", body: "more" }] }] } as Partial<BoxNode>);
    const html = renderAlertHTML(node);
    expect(html).toContain("eu-alert eu-alert--danger eu-alert--solid eu-al-a");
    expect(html).toContain('role="alert"');            // danger → assertive
    expect(html).toContain("eu-alert__title");
    expect(html).toContain("eu-alert__sub");            // recursive sub-item (Rule F)
    expect(html).toContain("data-eu-dismiss");
    const info = createComponent("alert", { alertSeverity: "info", alertDismiss: false } as Partial<BoxNode>);
    expect(renderAlertHTML(info)).toContain('role="status"'); // info → polite
    expect(renderAlertHTML(info)).not.toContain("data-eu-dismiss");
  });

  it("bgShowThroughCss (reusable, all components): a block background makes items transparent so it shows through", () => {
    const withBg = createComponent("alert", { bgImage: "linear-gradient(90deg,#f00,#00f)" } as Partial<BoxNode>);
    expect(bgShowThroughCss(withBg, ".s .eu-alert")).toContain("background:transparent");
    expect(bgShowThroughCss(createComponent("alert", {} as Partial<BoxNode>), ".s .eu-alert")).toBe(""); // no bg → no override
    // works the same for the accordion (any component in COMPONENT_ITEM_SEL)
    const acc = createComponent("accordion", { background: "#eee" } as Partial<BoxNode>);
    expect(bgShowThroughCss(acc, ".s .eu-accordion__item")).toContain("background:transparent");
  });

  it("bgImageLayer: gradients/patterns pass through raw; image URLs get url(\"…\") wrapping", () => {
    expect(isCssBg("linear-gradient(135deg, #a, #b)")).toBe(true);
    expect(isCssBg("radial-gradient(currentColor 1.5px, transparent 1.6px)")).toBe(true);
    expect(isCssBg("repeating-linear-gradient(45deg, currentColor 0, transparent 50%)")).toBe(true);
    expect(isCssBg("https://x/y.jpg")).toBe(false);
    expect(isCssBg("data:image/png;base64,AAA")).toBe(false);
    expect(bgImageLayer("linear-gradient(135deg, #a, #b)")).toBe("linear-gradient(135deg, #a, #b)"); // no url()
    expect(bgImageLayer("https://x/y.jpg")).toBe('url("https://x/y.jpg")');
    expect(bgImageLayer('a"b\\c')).toBe('url("abc")'); // sanitises quotes/backslashes
  });

  it("itemOverrideCss: per-item ICON — colour, size, align and free-move all compile onto .eu-accordion__icon", () => {
    expect(itemHasOverride({ id: "i", title: "t", body: "b", iconDx: 2 })).toBe(true);
    expect(itemHasOverride({ id: "i", title: "t", body: "b", iconAlign: "end" })).toBe(true);
    const out = itemOverrideCss(".it", { id: "i", title: "t", body: "b", icon: "Star", iconColor: "#f0f", iconSize: "1.4rem", iconAlign: "end", iconDx: 2, iconDy: -1 });
    expect(out).toContain(".it .eu-accordion__icon{");
    expect(out).toContain("color: #f0f !important");
    expect(out).toContain("font-size: 1.4rem !important");
    expect(out).toContain("align-self: end !important");
    expect(out).toContain("transform: translate(2rem, -1rem) !important");
  });

  it("itemOverrideCss: structured styling AND the raw CSS box both apply (structured first)", () => {
    const out = itemOverrideCss(".it", { id: "i", title: "t", body: "b", headerStyle: { color: "#111" }, css: "icon { color: #0f0 }" });
    expect(out.indexOf(".eu-accordion__header{color: #111")).toBeGreaterThanOrEqual(0);
    expect(out).toContain(".it .eu-accordion__header::after{color: #0f0 !important;}");
    expect(out.indexOf("header{color: #111")).toBeLessThan(out.indexOf("::after")); // structured emitted before raw
  });

  it("itemOverrideCss: a custom per-item number overrides the auto-counter (::before content), safely quoted", () => {
    expect(itemHasOverride({ id: "i", title: "t", body: "b", num: "7" })).toBe(true);
    const out = itemOverrideCss(".it", { id: "i", title: "t", body: "b", num: "A1" });
    expect(out).toBe('.it .eu-accordion__header::before{content: "A1" !important;}');
    // quotes/backslashes in the value are escaped → the `"` can't close the string and start a new rule
    const evil = itemOverrideCss(".it", { id: "i", title: "t", body: "b", num: '3" } html { display:none' });
    expect(evil).toBe('.it .eu-accordion__header::before{content: "3\\" } html { display:none" !important;}');
    expect((evil.match(/::before\{/g) || []).length).toBe(1);   // exactly ONE rule — no breakout rule created
  });

  it("itemOverrideCss: a FLOATED item is absolutely placed at (x,y) rem; reverts to the stack on mobile export", () => {
    const it = { id: "i", title: "t", body: "b", float: { x: 12, y: 6, z: 10 } };
    expect(itemHasOverride(it)).toBe(true);
    const out = itemOverrideCss(".it", it, { stackOnNarrow: true });
    // X goes through a min() clamp so an over-large placement can never push the item out of its component box,
    // and the whole placement sits INSIDE a mobile-first `min-width` query in `em` — the stack is the base.
    expect(out).toContain("position:absolute !important;left:min(12rem, calc(100% - 8rem)) !important;top:6rem !important;z-index:10 !important;");
    expect(out).toContain(`@media (min-width:${BREAKPOINTS_EM.tabletPortrait}em){.it{position:absolute`);
    expect(out).not.toContain("max-width:480px");
    // canvas can skip the float (mobile preview) without touching the other overrides
    expect(itemOverrideCss(".it", { ...it, headerStyle: { color: "#111" } }, { skipFloat: true })).toBe(".it .eu-accordion__header{color: #111 !important;}");
  });

  it("itemFloatReserveRem: reserves the lowest float + a nominal item height; 0 when nothing floats", () => {
    expect(itemFloatReserveRem([{ id: "a", title: "", body: "" }])).toBe(0);
    expect(itemFloatReserveRem([
      { id: "a", title: "", body: "", float: { x: 2, y: 10 } },
      { id: "b", title: "", body: "", float: { x: 2, y: 4 } },
    ])).toBe(16); // max y (10) + 6
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

  it("adding SEVERAL blocks to the page (append + normalize) stacks each in its OWN row — never grouped", () => {
    // Mirrors the builder's add path: append bare items to the root, then normalize. Every block must land in
    // its OWN row band (no shared parent, no width-clamping) — the guarantee behind race-safe adds — keeping the
    // full width F-1 gives it (a card fills its line; it is never clamped).
    let root = createContainer("column", { id: "root", children: [] } as Partial<BoxNode>);
    for (const id of ["a", "b", "c", "d"]) {
      root = insertBox(root, "root", root.children?.length ?? 0, createComponent("card", { id } as Partial<BoxNode>));
      root = normalizeRowBands(root, 0); // normalize after each add, exactly like commit does
    }
    expect(root.children!.length).toBe(4);                                  // four separate rows
    for (const row of root.children!) {
      expect(row.rowBand).toBe(true);
      expect(row.children!.length).toBe(1);                                 // one block per row — never grouped
      expect(row.children![0].type).toBe("component");
      expect(row.children![0].width).toBe("100%");                          // F-1: fills its line, never clamped
      expect(row.children![0].children).toBeUndefined();                    // the component is a single node
    }
  });

  it("groupBoxes wraps selected boxes in ONE floating group container (children in-flow, full-width); ungroup reverses it", () => {
    let root = createContainer("column", { id: "root", children: [] } as Partial<BoxNode>);
    for (const id of ["a", "b", "c"]) { root = insertBox(root, "root", root.children?.length ?? 0, createComponent("card", { id } as Partial<BoxNode>)); root = normalizeRowBands(root, 0); }
    const grouped = groupBoxes(root, ["a", "c"], { left: 12, top: 8, width: "40%", height: 300 });
    // 'a' and 'c' left the flow; a new floating GROUP holds them; 'b' stays a normal row
    expect(findParent(grouped, "a")!.parent.group).toBe(true);
    const group = grouped.children!.find((r) => r.group)!;
    expect(group).toBeTruthy();
    expect(group.position).toBe("absolute");                 // it FLOATS (movable as one unit)
    expect(group.left).toBe(12); expect(group.top).toBe(8); expect(group.width).toBe("40%");
    expect(group.children!.map((c) => c.id)).toEqual(["a", "c"]); // document order preserved
    expect(group.children!.every((c) => c.position === undefined && c.width === "100%")).toBe(true); // in-flow inside
    expect(findBox(grouped, "b")).toBeTruthy();              // 'b' untouched
    // ungroup → the two return to the flow, group gone
    const back = ungroupBoxes(grouped, group.id);
    expect(back.children!.some((r) => r.group)).toBe(false);
    expect(findBox(back, "a")).toBeTruthy(); expect(findBox(back, "c")).toBeTruthy();
    expect(findBox(back, "a")!.position).toBeUndefined();     // back in normal flow
  });

  it("alignInRow positions a (hugging) block by setting its parent row's justify; alignInRowOf reads it back", () => {
    let root = createContainer("column", { id: "root", children: [] } as Partial<BoxNode>);
    root = insertBox(root, "root", 0, createElement("heading", { id: "h", text: "Hi" } as Partial<BoxNode>));
    root = normalizeRowBands(root, 0); // heading now lives in its own row band
    expect(alignInRowOf(root, "h")).toBe("start");            // default = left
    const centered = alignInRow(root, "h", "center");
    expect(findParent(centered, "h")!.parent.justify).toBe("center"); // parent row centres it
    expect(alignInRowOf(centered, "h")).toBe("center");
    expect(alignInRowOf(alignInRow(centered, "h", "end"), "h")).toBe("end");
  });

  it("cloneBox deep-copies a GROUP with fresh ids for the container AND every descendant (independent copy)", () => {
    const group = createContainer("column", { id: "g", group: true, position: "absolute", left: 10, top: 10, children: [createElement("text", { id: "a" } as Partial<BoxNode>), createElement("icon", { id: "b" } as Partial<BoxNode>)] } as unknown as Partial<BoxNode>);
    const copy = cloneBox(group);
    expect(copy.group).toBe(true); expect(copy.position).toBe("absolute"); // still a floating group
    const ids = [copy.id, ...(copy.children ?? []).map((c) => c.id)];
    expect(new Set(ids).size).toBe(3);                 // all ids unique
    expect(ids).not.toContain("g"); expect(ids).not.toContain("a"); expect(ids).not.toContain("b"); // none reused
    expect((copy.children ?? []).map((c) => c.type)).toEqual(["text", "icon"]); // contents preserved
  });

  it("groupBoxes needs at least two boxes (a single selection is a no-op)", () => {
    let root = createContainer("column", { id: "root", children: [] } as Partial<BoxNode>);
    root = insertBox(root, "root", 0, createComponent("card", { id: "a" } as Partial<BoxNode>));
    expect(groupBoxes(root, ["a"], { left: 0, top: 0, width: "50%", height: 100 })).toBe(root);
  });

  it("a row that WRAPS is left over-full on purpose; one that cannot wrap is still scaled to fit", () => {
    /**
     * THIS ASSERTED THE OPPOSITE, and the opposite made wrapping impossible.
     *
     * `clampRowWidths` used to scale EVERY over-full row back to 100%, on every commit. For a row that
     * cannot wrap that is right — it is what stops content running off the page. For a ROW BAND it was
     * exactly wrong, because a band wraps: the overflow was never going to leave the page, it was going to
     * become a second line.
     *
     * The cost was that a block could not be widened past its neighbours at all. Push the boundary, the sum
     * went over 100, this pulled it straight back, and the drag was undone the moment it was committed.
     * "Make this one full width and let the other drop below" was unreachable — and so was its reverse,
     * because nothing had moved to reverse.
     *
     * Sharing a full line out is still needed when a block is ADDED to one; that is now `fitRowWidths`,
     * called at insert time (`fitBand`) rather than held as an invariant over every commit.
     */
    const band = makeRowBand([
      createContainer("column", { id: "a", width: "100%" } as Partial<BoxNode>),
      createContainer("column", { id: "b", width: "100%" } as Partial<BoxNode>),
    ], 0);
    // A BAND wraps, so it keeps what it was given — the second block goes to the next line.
    expect(clampRowWidths(band)).toBe(band);

    // A row that CANNOT wrap is still scaled to fit, which is what the clamp is for. `wrap: false` has to be
    // stated: `createContainer("row")` turns wrapping ON by default, so a plain row is a wrapping one.
    const nowrap = createContainer("row", {
      id: "nowrap",
      wrap: false,
      children: [
        createContainer("column", { id: "c", width: "100%" } as Partial<BoxNode>),
        createContainer("column", { id: "d", width: "100%" } as Partial<BoxNode>),
      ],
    } as Partial<BoxNode>);
    expect(clampRowWidths(nowrap).children!.map((c) => c.width)).toEqual(["50%", "50%"]);

    // And the sharing-out itself still exists, for the moment a block is added to a full line.
    expect(fitRowWidths(band).children!.map((c) => c.width)).toEqual(["50%", "50%"]);

    // A row already within one line is returned untouched, wrapping or not.
    const ok = makeRowBand([createContainer("column", { id: "e", width: "40%" } as Partial<BoxNode>)], 0);
    expect(clampRowWidths(ok)).toBe(ok);
    expect(fitRowWidths(ok)).toBe(ok);

    // normalizeRowBands leaves a band's deliberate overflow alone.
    const root = createContainer("column", { id: "root", children: [band] } as Partial<BoxNode>);
    expect(normalizeRowBands(root, 0).children![0].children!.map((c) => c.width)).toEqual(["100%", "100%"]);
  });

  /** Behaviours: box-builder-layout.feature — "A block dropped onto a full line takes an equal share of THAT line". */
  describe("fitBand — a drop shares out only the line it lands on", () => {
    const col = (id: string, width: string) => createContainer("column", { id, width } as Partial<BoxNode>);
    const pageWith = (kids: BoxNode[]) => createContainer("column", { id: "root", children: [makeRowBand(kids, 0)] } as Partial<BoxNode>);
    const widthsOf = (root: BoxNode) => root.children![0].children!.map((c) => c.width);
    const sumOf = (ws: (string | undefined)[]) => ws.reduce((s, w) => s + widthPct(w), 0);
    const drop = (kids: BoxNode[], at: number, fresh: BoxNode) => {
      const root = pageWith(kids);
      const bandId = root.children![0].id;
      return fitBand(insertBox(root, bandId, at, fresh), bandId, fresh.id);
    };

    it("a third block on a full 50/50 line makes thirds, not 25/25/50", () => {
      const ws = widthsOf(drop([col("a", "50%"), col("b", "50%")], 2, col("n", "100%")));
      ws.forEach((w) => expect(widthPct(w)).toBeCloseTo(33.33, 1));
      expect(sumOf(ws)).toBeLessThanOrEqual(100);
    });

    it("a fourth makes quarters — and the line NEVER adds up past 100 (it wrapped at 101%)", () => {
      let kids = [col("a", "50%"), col("b", "50%")];
      for (const id of ["n1", "n2"]) {
        const root = drop(kids, kids.length, col(id, "100%"));
        kids = root.children![0].children!;
        expect(sumOf(kids.map((k) => k.width))).toBeLessThanOrEqual(100);
      }
      kids.forEach((k) => expect(widthPct(k.width)).toBeCloseTo(25, 1));
      expect(packRowLines(kids)).toEqual([0, 0, 0, 0]);
    });

    it("the blocks already there keep their proportions", () => {
      const ws = widthsOf(drop([col("a", "20%"), col("b", "80%")], 1, col("n", "100%"))).map(widthPct);
      expect(ws[1]).toBeCloseTo(33.33, 1);            // the newcomer's equal share
      expect(ws[2] / ws[0]).toBeCloseTo(4, 1);         // 20 : 80 survives
    });

    it("a HUGGING block (a Stat) dropped onto a FULL line takes an equal share too — it has nowhere to hug", () => {
      const ws = widthsOf(drop([col("a", "50%"), col("b", "50%")], 2, col("n", "auto")));
      ws.forEach((w) => expect(widthPct(w)).toBeCloseTo(33.33, 1));
    });

    it("…but on a line WITH room it keeps hugging", () => {
      const root = pageWith([col("a", "40%")]);
      const bandId = root.children![0].id;
      const withNew = insertBox(root, bandId, 1, col("n", "auto"));
      expect(fitBand(withNew, bandId, "n")).toBe(withNew);
    });

    it("a line with room is left alone — the drop already sized the newcomer to it", () => {
      const root = pageWith([col("a", "40%")]);
      const bandId = root.children![0].id;
      const withNew = insertBox(root, bandId, 1, col("n", "60%"));
      expect(fitBand(withNew, bandId, "n")).toBe(withNew);
    });

    it("only the line it lands on is shared — a block the user pushed to the next line keeps its width", () => {
      const ws = widthsOf(drop([col("a", "50%"), col("b", "50%"), col("c", "70%")], 1, col("n", "100%")));
      expect(ws[3]).toBe("70%");
      expect(sumOf(ws.slice(0, 3))).toBeLessThanOrEqual(100);
    });
  });

  /** Behaviours: box-builder-layout.feature — "A heading looks the same in the editor as on the published page". */
  describe("blockTypography — the one typography resolver the canvas and the export share", () => {
    const el = (p: Partial<BoxNode> = {}) => createElement("heading", p);
    it("a heading is TIGHT by default — the 1.15 the published page always had, now on the canvas too", () => {
      const t = blockTypography(el(), "heading", 600);
      expect(t.lineHeight).toBe("var(--eu-leading-tight, 1.15)");
      expect(t.letterSpacing).toBe("var(--eu-tracking-tight, -0.025em)");
      expect(t.textWrap).toBe("balance");
    });
    it("body text is NORMAL, and is not tracked or balanced", () => {
      const t = blockTypography(el(), "body", 400);
      expect(t.lineHeight).toBe("var(--eu-leading-normal, 1.5)");
      expect(t.letterSpacing).toBeUndefined();
      expect(t.textWrap).toBeUndefined();
    });
    it("a value the user set wins — and letter spacing is rem, never px (rule 16)", () => {
      const t = blockTypography(el({ lineHeight: 2, letterSpacing: 4 } as Partial<BoxNode>), "heading", 600);
      expect(t.lineHeight).toBe(2);
      expect(String(t.letterSpacing)).toMatch(/rem$/);
    });
  });

  describe("allocateLine — widening one block in a full row (#43)", () => {
    const F = (id: string, rest: number, floor = 8, gap = 0) => ({ id, rest, floor, gap });
    const sum = (r: ReturnType<typeof allocateLine>, fs: { id: string; gap: number }[]) =>
      r.own + fs.filter((f) => !r.wrapped.includes(f.id)).reduce((s, f) => s + r.widths.get(f.id)!.width + f.gap, 0);

    it("the reported case: a row of four, the first widened 25→35 — the next one gives, nothing jumps", () => {
      const fs = [F("b", 25), F("c", 25), F("d", 25)];
      const r = allocateLine(35, 100, fs);
      expect(r.own).toBe(35);               // not 100 — the jump that was the bug
      expect(r.wrapped).toEqual([]);
      expect(r.widths.get("b")).toEqual({ width: 15, rest: 25 }); // nearest gives first, remembers its rest
      expect(r.widths.get("c")).toEqual({ width: 25, rest: undefined });
      expect(r.widths.get("d")).toEqual({ width: 25, rest: undefined });
    });
    it("once the nearest is at its floor, the next one gives", () => {
      const r = allocateLine(50, 100, [F("b", 25, 10), F("c", 25, 10), F("d", 25, 10)]);
      expect(r.widths.get("b")!.width).toBe(10);
      expect(r.widths.get("c")!.width).toBe(15);
      expect(r.widths.get("d")!.width).toBe(25);
    });
    it("when floors no longer fit, the LAST wraps first, keeping its rest width", () => {
      const r = allocateLine(80, 100, [F("b", 25, 10), F("c", 25, 10), F("d", 25, 10)]);
      expect(r.wrapped).toEqual(["d"]);
      expect(r.widths.get("d")).toEqual({ width: 25 });
      expect(r.widths.get("b")!.width + r.widths.get("c")!.width).toBeCloseTo(20, 1);
    });
    it("only when nothing can stay beside it does the dragged block fill the line", () => {
      const r = allocateLine(95, 100, [F("b", 25, 10)]);
      expect(r.wrapped).toEqual(["b"]);
      expect(r.own).toBe(100);
    });
    it("with its neighbours ALREADY below, it narrows a step at a time instead of filling the line (#45)", () => {
      const fs = [F("b", 50, 22)];
      const r = allocateLine(90, 100, fs, { fillWhenAlone: false });
      expect(r.own).toBe(90);
      expect(r.wrapped).toEqual(["b"]);
      expect(allocateLine(90, 100, fs).own).toBe(100); // the default: pushed off during this drag → fill
      expect(allocateLine(70, 100, fs, { fillWhenAlone: false }).wrapped).toEqual([]); // room for its floor → back up
    });
    /**
     * SEPARATE drags, carrying the stored state from one to the next exactly as the canvas does: which blocks share
     * the line at the start of a drag, each one's rest width, and a block on a later line only coming up at its rest.
     */
    const replay = (n: number, steps: number[], floor = 22.4) => {
      const start = 100 / (n + 1);
      let own = start;
      let st = Array.from({ length: n }, (_, i) => ({ id: `f${i}`, w: start, rest: undefined as number | undefined }));
      for (const d of steps) {
        let used = own, open = true;
        const same = st.map((f) => { used += f.w; open = open && used <= 100.5; return open; });
        const fs = st.map((f, k) => ({ id: f.id, rest: f.rest ?? f.w, gap: 0, floor: same[k] || k === 0 ? Math.min(floor, f.rest ?? f.w) : (f.rest ?? f.w) }));
        const r = allocateLine(own + d, 100, fs, { fillWhenAlone: same.some(Boolean) });
        own = r.own;
        st = st.map((f, k) => {
          if (!same[k] && r.wrapped.includes(f.id)) return f;
          const w = r.widths.get(f.id)!;
          return { id: f.id, w: w.width, rest: w.rest };
        });
      }
      return { own, st, start };
    };
    /** Nudge out `k` times, then nudge back until the edge is where it STARTED — a user drags back to the spot, not
     *  back the same number of times (a nudge that pushed everything off fills the line, so the counts differ). */
    const outAndBack = (n: number, step: number, k: number, extra: number[] = []) => {
      const out = replay(n, Array(k).fill(step));
      const back: number[] = [];
      let at = out.own;
      while (at - step > out.start + 1e-9) { back.push(-step); at -= step; }
      back.push(out.start - at);
      return replay(n, [...Array(k).fill(step), ...back, ...extra]);
    };
    it.each([1, 2, 3, 4, 5])("a round trip of SEPARATE drags comes home — %i followers, every step size and distance (#45)", (n) => {
      for (const step of [1, 4, 8, 12, 20]) for (const k of [1, 2, 3, 6, 10]) {
        const { own, st, start } = outAndBack(n, step, k);
        expect(own, `step ${step} × ${k}`).toBeCloseTo(start, 1);
        st.forEach((f) => { expect(f.w, `${f.id} step ${step} × ${k}`).toBeCloseTo(start, 0); expect(f.rest, `${f.id} step ${step} × ${k}`).toBeUndefined(); });
      }
    });
    it("…and a long drag out and back after the nudges comes home too", () => {
      const { own, st, start } = outAndBack(3, 8, 6, [48, -48]);
      expect(own).toBeCloseTo(start, 1);
      st.forEach((f) => expect(f.w).toBeCloseTo(start, 0));
    });
    /** A row where ANY block can be dragged, carrying width, rest and squeeze time between drags as the canvas does. */
    type B = { id: string; w: number; rest?: number; at?: number; owed?: number; wrapBy?: string; restBy?: string };
    const dragAt = (row: B[], k: number, delta: number, stamp: number): B[] => {
      const before = row.slice(0, k).reduce((s, b) => s + b.w, 0);
      // each follower's rest as the canvas passes it: its memory only when THIS block's drag made it (#77)
      const own = (b: B) => restForDrag(b, b.w, row[k].id);
      const fs = row.slice(k + 1).map((b) => ({ id: b.id, rest: own(b).rest, cur: b.w, gap: 0, floor: Math.min(22.4, own(b).rest), at: own(b).at }));
      const r = allocateLine(row[k].w + delta, 100 - before, fs);
      return row.map((b, i) => {
        if (i === k) return { id: b.id, w: r.own };
        if (i < k) return b;
        const w = r.widths.get(b.id)!;
        if (own(b).foreign && Math.abs(w.width - b.w) < 0.05) return b; // untouched: another drag's memory is kept whole
        return { id: b.id, w: w.width, rest: w.rest, at: w.rest !== undefined ? (own(b).at ?? stamp) : undefined, restBy: w.rest !== undefined ? row[k].id : undefined };
      });
    };
    const widths = (row: B[]) => row.map((b) => b.w);
    /** #77, as built through the UI: three columns sized 30 / 30 / 40 by dragging edge 1 then edge 2. */
    const sized303040 = () => {
      let row: B[] = [{ id: "a", w: 33.33 }, { id: "b", w: 33.33 }, { id: "c", w: 33.34 }];
      row = dragWrap(row, 0, -3.33, 1);   // edge 1 to 30%: b takes the space across the joined edge
      row = dragWrap(row, 1, -6.67, 2);   // edge 2 to 60%: c takes it, remembering its 33.34 (b's memory)
      return row;
    };
    it("#77: a later out-and-back on edge 1 leaves column 3 alone — every step size", () => {
      for (const step of [1, 3, 5.85, 10, 20]) {
        let row = sized303040();
        const start = widths(row);
        expect(start.map((w) => Math.round(w))).toEqual([30, 30, 40]);
        row = dragWrap(row, 0, step, 3);
        // the NEAREST gives first: column 3 is untouched while column 2 still has room above its floor
        if (step <= start[1] - FLOOR) expect(row[2].w, `step ${step}: the nearest gives first, not column 3`).toBeCloseTo(start[2], 1);
        else expect(row[1].w, `step ${step}: column 2 gives down to its floor first`).toBeCloseTo(FLOOR, 1);
        row = dragWrap(row, 0, -step, 4);
        widths(row).forEach((w, i) => expect(w, `step ${step}, column ${i + 1}`).toBeCloseTo(start[i], 1));
      }
    });
    it("#77: …and edge 2's OWN round trip still comes home afterwards — its memory was kept", () => {
      let row = sized303040();
      row = dragWrap(row, 0, 5.85, 3); row = dragWrap(row, 0, -5.85, 4);
      row = dragWrap(row, 1, 6.67, 5);   // edge 2 back to where it began
      expect(row[1].w).toBeCloseTo(36.67, 1);
      expect(row[2].w).toBeCloseTo(33.34, 1);
      expect(row[2].rest).toBeUndefined();
    });
    it("#77: nudged out several times and back, and far enough that the others wrap — comes home to what was drawn", () => {
      for (const [step, n] of [[4, 3], [8, 6]] as const) {
        const row0 = sized303040();
        let row = row0; let t = 10;
        for (let i = 0; i < n; i++) row = dragWrap(row, 0, step, t++);
        for (let i = 0; i < 40 && Math.abs(Math.max(row[0].w, FLOOR) - Math.max(row0[0].w, FLOOR)) > 0.01; i++) {
          const d = Math.max(row0[0].w, FLOOR) - Math.max(row[0].w, FLOOR);
          row = dragWrap(row, 0, Math.sign(d) * Math.min(step, Math.abs(d)), t++);
        }
        expect(drawn(row), `${n} × ${step}`).toEqual(drawn(row0));
      }
    });
    it("restForDrag: a rest is spent only by the drag that made it; an older one with no owner is honoured as before", () => {
      expect(restForDrag({ rest: 33, at: 1, restBy: "b" }, 40, "a")).toEqual({ rest: 40, at: undefined, foreign: true });
      expect(restForDrag({ rest: 33, at: 1, restBy: "a" }, 40, "a")).toEqual({ rest: 33, at: 1, foreign: false });
      expect(restForDrag({ rest: 33, at: 1 }, 40, "a")).toEqual({ rest: 33, at: 1, foreign: false });
      expect(restForDrag({}, 40, "a")).toEqual({ rest: 40, at: undefined, foreign: false });
    });
    it("a block squeezed by an EARLIER drag does not take this drag's space back — the round trip returns exactly (#53)", () => {
      let row: B[] = [{ id: "a", w: 33.33 }, { id: "b", w: 33.33 }, { id: "c", w: 33.33 }];
      row = dragAt(row, 1, 8, 1);                             // the user widens the MIDDLE block: c is squeezed
      const start = widths(row);
      expect(row[2].rest).toBeDefined();
      for (const d of [4, 4, 4]) row = dragAt(row, 0, d, 2); // then the FIRST block, out…
      for (const d of [-4, -4, -4]) row = dragAt(row, 0, d, 3); // …and back to the pixel it started from
      widths(row).forEach((w, i) => expect(w, `block ${i}`).toBeCloseTo(start[i], 1));
    });
    it("…and a single drag of the first block that goes nowhere changes nothing at all", () => {
      let row: B[] = [{ id: "a", w: 33.33 }, { id: "b", w: 33.33 }, { id: "c", w: 33.33 }];
      row = dragAt(row, 1, 8, 1);
      const start = widths(row);
      widths(dragAt(row, 0, 0, 2)).forEach((w, i) => expect(w, `block ${i}`).toBeCloseTo(start[i], 1));
    });
    /** The same row, now WRAPPING as the browser does: lines packed on max(width, floor), blocks on later lines come
     *  up only at the width they hold, a wrapped block keeps its width and memory — exactly what the canvas passes. */
    const FLOOR = 22.4;
    const dragWrap = (row: B[], k: number, delta: number, stamp: number, floor = FLOOR): B[] => {
      const eff = (b: B) => Math.max(b.w, floor);
      let used = 0, line = 0; const lineOf = row.map((b, i) => { if (i && used + eff(b) > 100.5) { line++; used = 0; } used += eff(b); return line; });
      const lineStart = row.findIndex((_, i) => lineOf[i] === lineOf[k]);
      const before = row.slice(lineStart, k).reduce((s, b) => s + eff(b), 0);
      const after = row.slice(k + 1);
      const fs = after.map((b, j) => {
        const same = lineOf[k + 1 + j] === lineOf[k];
        const cur = Math.max(b.w, floor), mine = restForDrag({ ...b, rest: b.rest === undefined ? undefined : Math.max(b.rest, floor) }, cur, row[k].id), rest = mine.rest;
        return { id: b.id, rest, cur, gap: 0, at: mine.at, foreign: mine.foreign, floor: Math.min(floor, rest), pending: same || b.wrapBy === row[k].id, late: !same && j !== 0 && b.wrapBy !== row[k].id };
      });
      const startKept = after.filter((_, j) => lineOf[k + 1 + j] === lineOf[k]).length;
      const own0 = Math.max(row[k].w, floor);
      const endSpace = Math.max(0, 100 - before - own0 - fs.filter((_, j) => lineOf[k + 1 + j] === lineOf[k]).reduce((s2, f) => s2 + f.cur, 0));
      const r = allocateLine(own0 + delta, 100 - before, fs, { fillWhenAlone: startKept > 0, endSpace, own0, owed: row[k].owed ?? 0 });
      return row.map((b, i) => {
        if (i === k) return { id: b.id, w: r.own, owed: r.owed || undefined };
        if (i < k) return b;
        const same = lineOf[i] === lineOf[k];
        if (!same && r.wrapped.includes(b.id)) return b;       // already below, still below: untouched
        const w = r.widths.get(b.id)!;
        const wrapBy = r.wrapped.includes(b.id) ? (same ? row[k].id : b.wrapBy) : undefined;
        const f = fs[i - k - 1];
        if (f.foreign && Math.abs(w.width - f.cur) < 0.05 && wrapBy === b.wrapBy) return b; // another drag's memory, untouched
        return { id: b.id, w: w.width, rest: w.rest, at: w.rest !== undefined ? (f.at ?? stamp) : undefined, restBy: w.rest !== undefined ? row[k].id : undefined, wrapBy };
      });
    };
    const outBack = (row0: B[], k: number, step: number, n: number) => {
      let row = row0; let t = 10;
      for (let i = 0; i < n; i++) row = dragWrap(row, k, step, t++);
      const target = Math.max(row0[k].w, FLOOR);
      for (let i = 0; i < 40 && Math.abs(Math.max(row[k].w, FLOOR) - target) > 0.01; i++) {
        const d = target - Math.max(row[k].w, FLOOR);
        row = dragWrap(row, k, Math.sign(d) * Math.min(Math.abs(step), Math.abs(d)), t++); // |step|: an INWARD first move comes back OUT
      }
      return row;
    };
    const drawn = (row: B[]) => row.map((b) => Math.round(Math.max(b.w, FLOOR) * 10) / 10);

    it("packRowLines packs on what is DRAWN when given the floor — five 20% stacks at a 21.875% floor wrap the fifth (#58)", () => {
      const kids = Array.from({ length: 5 }, (_, i) => createContainer("column", { id: `s${i}`, width: "20%" } as Partial<BoxNode>));
      expect(packRowLines(kids)).toEqual([0, 0, 0, 0, 0]);
      expect(packRowLines(kids, 21.875)).toEqual([0, 0, 0, 0, 1]);
    });
    it("narrowing hands space to the NEIGHBOUR across the joined edge when nothing is owed to the end — the agreed rule", () => {
      const r = allocateLine(40, 100, [{ id: "b", rest: 50, cur: 50, floor: 22.4, gap: 0 }], { endSpace: 0, own0: 50, owed: 0 });
      expect(r.widths.get("b")!.width).toBe(60);
    });
    it("with THREE on a full line, narrowing the first gives to the SECOND (the joined edge), not the last (#60)", () => {
      const r = allocateLine(23.33, 100, [
        { id: "b", rest: 33.33, cur: 33.33, floor: 22.4, gap: 0 },
        { id: "c", rest: 33.34, cur: 33.34, floor: 22.4, gap: 0 },
      ], { endSpace: 0, own0: 33.33, owed: 0 });
      expect(r.widths.get("b")!.width).toBeCloseTo(43.33, 1);
      expect(r.widths.get("c")!.width).toBeCloseTo(33.34, 1);
    });
    it("…but first pays back what this block once took from the END of the line (#59)", () => {
      const r = allocateLine(40, 100, [{ id: "b", rest: 30, cur: 30, floor: 22.4, gap: 0 }], { endSpace: 20, own0: 50, owed: 20 });
      expect(r.widths.get("b")!.width).toBe(30);                     // the neighbour is not handed anything
      expect(r.owed).toBe(10);                                            // 10 of the 20 went back to the end
    });
    it("widening a row that has empty space at its end SPENDS that space first — the neighbour does not balloon into it (#59)", () => {
      // 30 + 30 on a line leaves 40 empty; widen the first by 10 → the neighbour stays 30 and 30 stays empty
      const r = allocateLine(40, 100, [{ id: "b", rest: 30, cur: 30, floor: 22.4, gap: 0 }], { endSpace: 40, own0: 30 });
      expect(r.own).toBe(40);
      expect(r.widths.get("b")).toEqual({ width: 30, rest: undefined });
    });
    it("a wrapped block keeps the width it HELD and its memory, not its rest (#53)", () => {
      const r = allocateLine(90, 100, [{ id: "c", rest: 33.34, cur: 21.87, floor: 21.87, gap: 0, at: 1 }]);
      expect(r.wrapped).toEqual(["c"]);
      expect(r.widths.get("c")).toEqual({ width: 21.87, rest: 33.34 });
    });
    it.each([
      ["the 'unequal' row, first block far out and back (both followers wrap)", [{ id: "a", w: 33.33 }, { id: "b", w: 44.27 }, { id: "c", w: 22.4, rest: 33.34, at: 1 }], 0, 8, 6],
      ["the 'unequal' row, middle block out and back", [{ id: "a", w: 33.33 }, { id: "b", w: 44.27 }, { id: "c", w: 22.4, rest: 33.34, at: 1 }], 1, 8, 6],
      ["five 20% stacks at a 22.4% floor (the fifth already below), first out and back (#58)", Array.from({ length: 5 }, (_, i) => ({ id: `s${i}`, w: 20 })), 0, 8, 6],
      ["five 20% stacks, middle out and back", Array.from({ length: 5 }, (_, i) => ({ id: `s${i}`, w: 20 })), 2, 8, 6],
      ["five 20% stacks, one long drag and back", Array.from({ length: 5 }, (_, i) => ({ id: `s${i}`, w: 20 })), 0, 48, 1],
      ["two blocks with room at the end (the last narrowed earlier), first out and back (#59)", [{ id: "a", w: 30 }, { id: "b", w: 30 }], 0, 8, 6],
      ["three with room at the end, middle out and back", [{ id: "a", w: 25 }, { id: "b", w: 25 }, { id: "c", w: 25 }], 1, 8, 4],
      ["a full 50/50 pair, first IN and back out — the joined edge", [{ id: "a", w: 50 }, { id: "b", w: 50 }], 0, -8, 3],
      ["a block an EARLIER drag pushed below stays below; the first's round trip returns (#62, 'unequal' at 1366)", [{ id: "a", w: 33.33 }, { id: "b", w: 66.67 }, { id: "c", w: 33.33, wrapBy: "b" }], 0, 8, 3],
    ] as [string, B[], number, number, number][])("%s comes home to what was drawn", (_name, row0, k, step, n) => {
      const end = outBack(row0, k, step, n);
      expect(drawn(end)).toEqual(drawn(row0));
    });
    it("dragging back to where it started returns every width exactly", () => {
      const fs = [F("b", 25), F("c", 25), F("d", 25)];
      allocateLine(70, 100, fs);
      const r = allocateLine(25, 100, fs);
      expect(r.own).toBe(25);
      fs.forEach((f) => expect(r.widths.get(f.id)).toEqual({ width: 25, rest: undefined }));
    });
    it("gaps count against the line", () => {
      const r = allocateLine(40, 100, [F("b", 30, 10, 5), F("c", 25, 10, 5)]);
      expect(r.wrapped).toEqual([]);
      expect(sum(r, [F("b", 30, 10, 5), F("c", 25, 10, 5)])).toBeCloseTo(100, 1);
    });

    // The enumerated matrix: 1–4 followers × unequal rests × floors × gaps × every drag position, 0→room.
    const rows: ReturnType<typeof F>[][] = [];
    for (const n of [1, 2, 3, 4]) for (const floor of [5, 12]) for (const gap of [0, 2]) for (const shape of ["equal", "unequal"]) {
      const rest = (i: number) => shape === "equal" ? (100 - 20) / n - gap : [30, 20, 15, 10][i] - gap;
      rows.push(Array.from({ length: n }, (_, i) => F(`f${i}`, rest(i), Math.min(floor, rest(i)), gap)));
    }
    it.each(rows.map((fs, i) => [i, fs] as const))("matrix row %i holds every invariant at every drag position", (_i, fs) => {
      let prevKept = Infinity;
      for (let own = 0; own <= 100; own += 2.5) {
        const r = allocateLine(own, 100, fs);
        const kept = fs.filter((f) => !r.wrapped.includes(f.id));
        // wrapped blocks are always a SUFFIX (flex order)
        expect(r.wrapped).toEqual(fs.slice(kept.length).map((f) => f.id));
        // no hole, no overflow: the line is exactly full
        if (kept.length) expect(sum(r, fs)).toBeGreaterThan(99.9 - 0.05 * fs.length);
        expect(sum(r, fs)).toBeLessThanOrEqual(100.001);
        // the dragged block gets what it asked for unless nothing could stay beside it
        if (kept.length) expect(r.own).toBeCloseTo(Math.min(own, 100), 1); else if (fs.length) expect(r.own).toBe(100);
        // nobody below its floor; only the last one on the line may exceed its rest
        kept.forEach((f, i) => {
          const w = r.widths.get(f.id)!;
          expect(w.width).toBeGreaterThanOrEqual(Math.min(f.floor, f.rest) - 0.01);
          if (i < kept.length - 1) expect(w.width).toBeLessThanOrEqual(f.rest + 0.01);
          expect(w.rest !== undefined).toBe(Math.abs(w.width - f.rest) > 0.05);
        });
        // a block wraps ONLY when it could not stay: the first wrapped one's floor did not fit beside the rest
        if (kept.length < fs.length) {
          const used = Math.min(own, 100) + kept.reduce((s, f) => s + Math.min(f.floor, f.rest) + f.gap, 0);
          const next = fs[kept.length];
          expect(used + Math.min(next.floor, next.rest) + next.gap).toBeGreaterThan(100);
        }
        // widening never brings a wrapped block back
        expect(kept.length).toBeLessThanOrEqual(prevKept);
        prevKept = kept.length;
      }
    });
  });

  describe("packRowLines — where a wrapping row breaks, from the stored widths", () => {
    const col = (id: string, width?: string) => createContainer("column", { id, width } as Partial<BoxNode>);
    it("fills a line to 100% then starts the next", () => {
      expect(packRowLines([col("a", "50%"), col("b", "50%"), col("c", "30%")])).toEqual([0, 0, 1]);
      expect(packRowLines([col("a", "100%"), col("b", "30.47%")])).toEqual([0, 1]);
    });
    it("a line breaks exactly where a BROWSER breaks it — even a hair over 100% wraps (#69)", () => {
      // This used to allow 100.5 ("a hair over is still one line"). A browser allows nothing: flex lines break on each
      // block's full basis, so 50.3 + 50.1 is two lines on the page — and the model disagreed with every page it drew.
      expect(packRowLines([col("a", "50%"), col("b", "50%")])).toEqual([0, 0]);
      expect(packRowLines([col("a", "66.66%"), col("b", "33.34%")])).toEqual([0, 0]);
      expect(packRowLines([col("a", "50.3%"), col("b", "50.1%")])).toEqual([0, 1]);
      expect(packRowLines([col("a", "66.67%"), col("b", "33.34%")])).toEqual([0, 1]);
    });
    it("a block pushed onto its own line fills it — until the user sizes it by hand (rule 2)", () => {
      const row = makeRowBand([col("a", "100%"), col("b", "30%")], 0);
      const [, b] = row.children!;
      expect(childStyle(b, row).flex).toBe("1 1 30%");                               // never resized: fills
      // sized by hand IN the row (the shape the UI makes): its own stored line is 30% — space the person left — so it keeps it
      const handRow = makeRowBand([col("a", "100%"), { ...col("b", "30%"), widthByHand: true }], 0);
      expect(childStyle(handRow.children![1], handRow).flex).toBe("0 1 30%");
    });
    it("a gap on the line counts toward it, as the browser counts it", () => {
      const gapped = createContainer("column", { id: "b", width: "50%", marginLeftPct: 10 } as Partial<BoxNode>);
      expect(packRowLines([col("a", "50%"), gapped])).toEqual([0, 1]);
      expect(packRowLines([col("a", "40%"), gapped])).toEqual([0, 0]);
    });
    it("a block with no width takes a whole line", () => {
      expect(packRowLines([col("a", "50%"), col("b")])).toEqual([0, 1]);
    });
    it("aloneOnItsLine reads the same packing — only a block pushed onto a LATER line by itself", () => {
      const row = makeRowBand([col("a", "100%"), col("b", "30%")], 0);
      const [a, b] = row.children!;
      expect(aloneOnItsLine(row, a)).toBe(false);   // first line: shows the width the user set
      expect(aloneOnItsLine(row, b)).toBe(true);
      const three = makeRowBand([col("a", "100%"), col("b", "30%"), col("c", "30%")], 0);
      expect(aloneOnItsLine(three, three.children![1])).toBe(false);
    });
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

  it("childStyle: a Fit (auto-width) element HUGS in a column — it is pinned to the start, never stretched", () => {
    const col = createContainer("column"); // default align = stretch (would stretch a width:auto child to full width)
    // An element that hugs (width auto, the "Fit" default) must NOT be stretched to full width — align-self pins it.
    expect(childStyle(createElement("heading", { width: "auto" } as Partial<BoxNode>), col).alignSelf).toBe("flex-start");
    expect(childStyle(createElement("text", {} as Partial<BoxNode>), col).alignSelf).toBe("flex-start"); // text base width is auto
    // A definite width (Full/Custom) fills/uses its size — no hug pin.
    expect(childStyle(createElement("text", { width: "100%" } as Partial<BoxNode>), col).alignSelf).toBeUndefined();
    expect(childStyle(createElement("text", { width: "50%" } as Partial<BoxNode>), col).alignSelf).toBeUndefined();
    // A CONTAINER (section) still stretches to fill its row/column — only element/component blocks hug.
    expect(childStyle(createContainer("column", {} as Partial<BoxNode>), col).alignSelf).toBeUndefined();
    // An explicit alignSelf (edge-anchored resize) is never overwritten.
    expect(childStyle(createElement("heading", { width: "auto", alignSelf: "flex-end" } as Partial<BoxNode>), col).alignSelf).toBe("flex-end");
    // An explicit parent alignment is honoured (centre-aligned hugging child follows it).
    expect(childStyle(createElement("heading", { width: "auto" } as Partial<BoxNode>), createContainer("column", { align: "center" } as Partial<BoxNode>)).alignSelf).toBe("center");
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
    // two columns: a gutter lies BETWEEN columns, a band of one has none (L2-b)
    const band = makeRowBand([0, 1].map(() => createContainer("column", { width: "40%", children: [createElement("text", {} as Partial<BoxNode>)] } as Partial<BoxNode>)));
    // the row band itself allows wrapping (so it reflows instead of cramming)
    expect(containerStyle(band).flexWrap).toBe("wrap");
    // a non-clipped section inside it keeps a usable minimum → wraps to a new line rather than shrinking below ~14rem
    const section = band.children![0];
    // …less the one gap its slot gives up to the band's gutter (S1-a)
    expect(childStyle(section, band).minWidth).toBe("min(100% - var(--bx-gut), 14rem)"); // the band's one gutter (E0-e)
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
    // An empty section with NO explicit floor gets the VISIBLE floor rather than zero.
    //
    // This half used to assert 0, and that zero was the bug: in a parent that has been given a height, the
    // children divide it, so six empty blocks added one at a time measured 159 · 79 · 53 · 40 · 32 · 26px —
    // and at 26px a block is entirely covered by its own eight resize handles. A box nobody has sized must
    // stay big enough to see and to grab; a box somebody HAS sized keeps their number, which is the
    // assertion above. See `EMPTY_BOX_MIN` and the note in `childStyle`.
    const bare = childStyle(createContainer("column", {} as Partial<BoxNode>), parent);
    expect(bare.minHeight).toBe(EMPTY_BOX_MIN);
    // `clip` is the explicit "let this shrink past its content" opt-in, and it still reaches zero.
    const clippedBare = childStyle(createContainer("column", { clip: true } as Partial<BoxNode>), parent);
    expect(clippedBare.minHeight).toBe(0);
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

/**
 * A page saved under the THREE-LAYER model, which is what every stored site currently is.
 *
 * Nothing here may change appearance when the ladder grew to five rungs, and nothing may need a migration:
 * `tablet` was the only tablet layer there was, so it still covers both orientations, and `mobile` is the
 * phone. These tests were written for the old model and are kept exactly because of that — they are now the
 * backward-compatibility suite.
 */
describe("box-model — a page saved under the three-layer model still resolves", () => {
  const node = () => createContainer("column", {
    id: "n", width: "100%", direction: "row",
    responsive: { tablet: { width: "80%" }, mobile: { width: "100%", direction: "column" } },
  } as Partial<BoxNode>);

  it("resolveResponsive returns the base at 'base', and cascades tablet→phone otherwise", () => {
    expect(resolveResponsive(node(), "base").width).toBe("100%");
    expect(resolveResponsive(node(), "base").direction).toBe("row");
    expect(resolveResponsive(node(), "tabletLandscape").width).toBe("80%");
    expect(resolveResponsive(node(), "tabletLandscape").direction).toBe("row"); // tablet didn't override direction → base
    expect(resolveResponsive(node(), "phone").width).toBe("100%");
    expect(resolveResponsive(node(), "phone").direction).toBe("column"); // phone override wins
  });

  it("the legacy tablet layer still covers BOTH tablet orientations", () => {
    // It was the only tablet layer that existed, so narrowing it to one orientation would silently change how
    // every saved page looks on a portrait tablet.
    expect(resolveResponsive(node(), "tabletLandscape").width).toBe("80%");
    expect(resolveResponsive(node(), "tabletPortrait").width).toBe("80%");
  });

  it("the phone inherits the tablet where the phone doesn't override", () => {
    const n = createContainer("column", { id: "n", gap: 10, responsive: { tablet: { gap: 20 }, mobile: {} } } as Partial<BoxNode>);
    expect(resolveResponsive(n, "phone").gap).toBe(20); // from tablet
  });

  it("a new edit at the phone wins over the legacy value, without rewriting it", () => {
    let t = createContainer("column", { id: "n", width: "100%", responsive: { mobile: { width: "90%" } } } as Partial<BoxNode>);
    t = updateBoxResponsive(t, "n", { width: "30%" }, "phone");
    expect(findBox(t, "n")!.responsive!.mobile!.width).toBe("90%"); // untouched
    expect(resolveResponsive(findBox(t, "n")!, "phone").width).toBe("30%");
  });

  it("clearing a rung clears its LEGACY slot too, or 'reset' would appear to do nothing", () => {
    const n = node();
    const root = { ...createContainer("column", { id: "root" } as Partial<BoxNode>), children: [n] };
    const cleared = clearOverride(root, "n", "phone");
    expect(hasOverride(findBox(cleared, "n")!, "phone")).toBe(false);
    expect(resolveResponsive(findBox(cleared, "n")!, "phone").direction).toBe("row"); // back to the base
  });

  it("hasOverride + clearOverride manage a rung's overrides", () => {
    const n = node();
    expect(hasOverride(n, "base")).toBe(false);
    expect(hasOverride(n, "tabletLandscape")).toBe(true);
    const cleared = clearOverride({ ...createContainer("column", { id: "root" } as Partial<BoxNode>), children: [n] }, "n", "tabletLandscape");
    expect(hasOverride(findBox(cleared, "n")!, "tabletLandscape")).toBe(false);
    expect(hasOverride(findBox(cleared, "n")!, "phone")).toBe(true); // the phone layer is kept
  });
});

describe("box-model — the five-rung ladder", () => {
  it("every rung has its own layer: editing one does not touch another", () => {
    // The defect this replaced: Laptop, Desktop and Wide all wrote to `base`, so tuning the Wide view
    // rewrote every screen from 900px up — including the Desktop view you had just tuned.
    let t = createContainer("column", { id: "n", width: "100%" } as Partial<BoxNode>);
    t = updateBoxResponsive(t, "n", { width: "70%" }, "wide");
    t = updateBoxResponsive(t, "n", { width: "60%" }, "tabletLandscape");

    expect(resolveResponsive(findBox(t, "n")!, "base").width).toBe("100%");          // desktop untouched
    expect(resolveResponsive(findBox(t, "n")!, "wide").width).toBe("70%");
    expect(resolveResponsive(findBox(t, "n")!, "tabletLandscape").width).toBe("60%");
  });

  it("wide branches off the base — it is not a narrowed anything", () => {
    const n = createContainer("column", {
      id: "n", gap: 10, responsive: { tabletLandscape: { gap: 4 }, phone: { gap: 2 } },
    } as Partial<BoxNode>);
    expect(resolveResponsive(n, "wide").gap).toBe(10); // the base, NOT the tablet chain
  });

  it("narrower rungs still inherit each other, in ladder order", () => {
    const n = createContainer("column", {
      id: "n", gap: 32, responsive: { tabletLandscape: { gap: 16 }, tabletPortrait: { gap: 8 } },
    } as Partial<BoxNode>);
    expect(resolveResponsive(n, "tabletLandscape").gap).toBe(16);
    expect(resolveResponsive(n, "tabletPortrait").gap).toBe(8);
    expect(resolveResponsive(n, "phone").gap).toBe(8); // inherits tablet portrait
  });

  it("updateBoxResponsive writes to the base at 'base', else into that rung's own slot", () => {
    let t = createContainer("column", { id: "n", width: "100%" } as Partial<BoxNode>);
    t = updateBoxResponsive(t, "n", { width: "50%" }, "base");
    expect(findBox(t, "n")!.width).toBe("50%");
    t = updateBoxResponsive(t, "n", { width: "30%" }, "phone");
    expect(findBox(t, "n")!.width).toBe("50%");                       // base unchanged
    expect(findBox(t, "n")!.responsive!.phone!.width).toBe("30%");    // override stored
    expect(resolveResponsive(findBox(t, "n")!, "phone").width).toBe("30%");
  });

  it("BP_ORDER is the ladder, narrowest first — the order a mobile-first sheet emits", () => {
    expect(BP_ORDER).toEqual(["phone", "tabletPortrait", "tabletLandscape", "base", "wide"]);
  });
});

describe("box-model — content types", () => {
  it("createElement builds the new element types with sensible defaults", () => {
    expect(createElement("video").height).toBe(remLen(315)); // rem, never px — Core Rule 16
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
    expect(radiusCSS(createContainer("column", { radius: 12 } as Partial<BoxNode>))).toBe([12,12,12,12].map((n) => remLen(n)).join(" "));
    const s = radiusCSS(createContainer("column", { radius: 12, radiusTopLeft: 0, radiusBottomRight: 40 } as Partial<BoxNode>));
    expect(s).toBe([0,12,40,12].map((n) => remLen(n)).join(" ")); // TL, TR(=radius), BR, BL(=radius)
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
    expect(a.height).toBe("12.5rem");  // in REM, not px (field guide ②) — 200 / 16        // a floating card gets a DEFINITE height (not a min-height floor)
    expect(a.minHeight).toBeUndefined();
    expect(a.zIndex).toBe(1); // first floating child → z 1
    expect(a.marginLeft).toBeUndefined(); expect(a.alignSelf).toBeUndefined(); // flow-only styling cleared
    expect(a.clip).toBe(true); // a floating card can be resized (W+H) below its content
    // It became a DIRECT child of the positioning parent (out of its row band).
    expect(findParent(next, "a")!.parent.id).toBe("sec");
  });

  it("floatBox does NOT store a reserved height on the parent (no leak) — the parent's height is computed instead", () => {
    const next = floatBox(tree(), "a", "sec", 0, 10, "50%", 220);
    expect(findBox(next, "sec")!.minHeight).toBeUndefined(); // nothing stored
    // …but containerStyle GROWS the parent at render time so it CONTAINS the floating child (never spills out)
    const sec = findBox(next, "sec")!;
    // The reserve is EMITTED in rem (field guide ②), so read it back through the unit rather than assuming px.
    const mh = parseFloat(containerStyle(sec).minHeight as string) * 16;
    expect(containerStyle(sec).minHeight as string).toMatch(/rem$/);
    expect(mh).toBeGreaterThanOrEqual(220);                  // ≥ the floated child's height
    // unfloating removes the containment automatically (no floating child → no reserve, no tall gap)
    expect(containerStyle(findBox(unfloatBox(next, "a"), "sec")!).minHeight).toBeUndefined();
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
    // AND TOUCHES NOTHING ELSE. This used to clear the PARENT's min-height too, on the reasoning that the
    // parent held a reserved height for the float which would otherwise leave a tall gap. No such reservation
    // is ever stored: `floatingReserve` is DERIVED at render time, so it releases itself the moment nothing
    // inside is floating. What the clause could actually reach was the height the user had set on the section
    // themselves — indistinguishable from a leak, and far more likely. Float a grid inside a 400px section and
    // return it, and the section collapsed to its content: measured in a browser, a grid that had filled 400px
    // came back at 60. A float round trip has to land where it started.
    const floated = updateBox(floatBox(tree(), "a", "sec", 12, 8, "60%", 200), "sec", { minHeight: 400 });
    const back = unfloatBox(floated, "a");
    const a = findBox(back, "a")!;
    expect(isFloating(a)).toBe(false);
    expect(a.position).toBeUndefined(); expect(a.left).toBeUndefined(); expect(a.top).toBeUndefined(); expect(a.zIndex).toBeUndefined();
    expect(a.clip).toBeUndefined();                                  // the auto float-clip is cleared
    expect(findBox(back, "sec")!.minHeight, "the parent's own height is none of un-float's business").toBe(400);
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

describe("accItems → items rename: old documents still open with their content (migration)", () => {
  // The field is shared by every multi-item component now, so it is just `items`. Documents saved under the old
  // name must still load — without the migration an older page would open with no items at all.
  it("renames accItems to items anywhere in a saved site", () => {
    const saved = {
      homeId: "p1",
      pages: [{ id: "p1", name: "Home", path: "/", root: {
        id: "root", type: "container", children: [
          { id: "a", type: "component", component: "accordion", accItems: [{ id: "i1", title: "Q", body: "A" }] },
          { id: "b", type: "container", children: [
            { id: "c", type: "component", component: "alert", accItems: [{ id: "i2", title: "Heads up", body: "M" }] },
          ] },
        ],
      } }],
    };
    const site = coerceSite(JSON.parse(JSON.stringify(saved)))!;
    expect(site).not.toBeNull();
    const acc = site.pages[0].root.children![0];
    const alert = site.pages[0].root.children![1].children![0];
    expect(acc.items?.[0].title).toBe("Q");
    expect(alert.items?.[0].title).toBe("Heads up");
    expect((acc as unknown as Record<string, unknown>).accItems).toBeUndefined();
    expect((alert as unknown as Record<string, unknown>).accItems).toBeUndefined();
  });

  it("migrates nested sub-items too, and leaves new documents untouched", () => {
    const withKids = { homeId: "p1", pages: [{ id: "p1", name: "H", path: "/", root: {
      id: "root", type: "container", children: [
        { id: "a", type: "component", component: "accordion",
          accItems: [{ id: "i1", title: "Q", body: "A", children: [{ id: "k1", title: "Sub", body: "B" }] }] },
      ] } }] };
    const migrated = coerceSite(JSON.parse(JSON.stringify(withKids)))!;
    expect(migrated.pages[0].root.children![0].items?.[0].children?.[0].title).toBe("Sub");

    const modern = { homeId: "p1", pages: [{ id: "p1", name: "H", path: "/", root: {
      id: "root", type: "container", children: [
        { id: "a", type: "component", component: "alert", items: [{ id: "i1", title: "New", body: "A" }] },
      ] } }] };
    expect(coerceSite(modern)!.pages[0].root.children![0].items?.[0].title).toBe("New");
  });
});

/**
 * A ROW STILL FILLS ITS WIDTH AFTER ONE OF ITS BLOCKS IS REMOVED.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * Reported by the user as empty space beside a stack that no dragging would close. Measured: three blocks at
 * 20% · 20% · 60% filled the row exactly, and deleting the middle one left the other two still saying 20% and
 * 60% — **197px of the row simply dead**, permanently. A drag cannot recover it either, because a drag moves
 * the boundary BETWEEN two blocks and faithfully preserves their total; that is right for a drag and no use
 * at all here.
 */
describe("removing a block from a row hands its width back", () => {
  const row = (kids: Array<Partial<BoxNode>>): BoxNode => ({
    id: "band", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0,
    children: kids.map((k) => ({ type: "container", direction: "column", padding: 0, gap: 0, children: [], ...k })),
  } as unknown as BoxNode);
  const widths = (n: BoxNode) => (n.children ?? []).map((c) => c.width);

  it("shares the freed width IN PROPORTION, so the blocks keep their relationship", () => {
    const before = row([{ id: "a", width: "20%" }, { id: "b", width: "20%" }, { id: "c", width: "60%" }]);
    expect(widths(deleteBox(before, "b")), "20 and 60 become 25 and 75, still totalling 100").toEqual(["25%", "75%"]);
  });

  it("the row totals 100% again whichever block goes", () => {
    const before = row([{ id: "a", width: "25%" }, { id: "b", width: "25%" }, { id: "c", width: "50%" }]);
    for (const gone of ["a", "b", "c"]) {
      const after = deleteBox(before, gone);
      const total = (after.children ?? []).reduce((s, c) => s + parseFloat(String(c.width)), 0);
      expect(Math.round(total), `removing ${gone} left the row at ${total}%`).toBe(100);
    }
  });

  it("a single survivor takes the whole row", () => {
    const before = row([{ id: "a", width: "30%" }, { id: "b", width: "70%" }]);
    expect(widths(deleteBox(before, "a"))).toEqual(["100%"]);
  });

  /**
   * IT STANDS DOWN WHERE PERCENTAGES ARE NOT THE LANGUAGE. These are the cases a fix that simply rewrote every
   * sibling would break, and each is a real arrangement rather than a hypothetical.
   */
  it("leaves a COLUMN alone — stacked blocks do not share a width", () => {
    const col: BoxNode = { id: "stack", type: "container", direction: "column", padding: 0, gap: 0, children: [
      { id: "a", type: "container", direction: "column", width: "40%", padding: 0, gap: 0, children: [] },
      { id: "b", type: "container", direction: "column", width: "60%", padding: 0, gap: 0, children: [] },
    ] } as unknown as BoxNode;
    expect(widths(deleteBox(col, "a"))).toEqual(["60%"]);
  });

  it("leaves a GRID alone — a grid places by colSpan, not by width", () => {
    const grid: BoxNode = { id: "g", type: "container", layout: "grid", columns: 12, direction: "row", padding: 0, gap: 0, children: [
      { id: "a", type: "container", direction: "column", width: "20%", colSpan: 4, padding: 0, gap: 0, children: [] },
      { id: "b", type: "container", direction: "column", width: "20%", colSpan: 8, padding: 0, gap: 0, children: [] },
    ] } as unknown as BoxNode;
    expect(widths(deleteBox(grid, "a"))).toEqual(["20%"]);
  });

  it("leaves the row alone when a sibling is Fit or Full — it already takes up the slack", () => {
    const before = row([{ id: "a", width: "20%" }, { id: "b", width: "auto" }, { id: "c", width: "60%" }]);
    expect(widths(deleteBox(before, "a"))).toEqual(["auto", "60%"]);
  });

  it("removing a block DEEPER in the tree does not touch the row it is not in", () => {
    const before = row([{ id: "a", width: "30%" }, { id: "b", width: "70%", children: [
      { id: "deep", type: "container", direction: "column", width: "50%", padding: 0, gap: 0, children: [] },
    ] as unknown as BoxNode[] }]);
    expect(widths(deleteBox(before, "deep")), "the row is unchanged").toEqual(["30%", "70%"]);
  });
});

/**
 * …AND MOVING A BLOCK MUST NOT HEAL ANYTHING. The mistake this pair exists to stop coming back.
 *
 * `moveBox` is `removeBox` followed by `insertBox`, and so are "turn this slot into a column" and grouping.
 * Putting the row-healing inside `removeBox` therefore fired on every one of them: dragging a block within
 * the page redistributed its siblings' widths and then put the block back, leaving the row over 100%. Two
 * browser guards caught it in one gate — `stack-under-column.spec.ts`, "the neighbour did not move or resize"
 * and "it took the room that was there".
 *
 * Deleting is the only operation that leaves a gap behind, so it is the only one that closes it.
 */
describe("removeBox stays dumb, because everything that restructures is built on it", () => {
  const row = (kids: Array<Partial<BoxNode>>): BoxNode => ({
    id: "band", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0,
    children: kids.map((k) => ({ type: "container", direction: "column", padding: 0, gap: 0, children: [], ...k })),
  } as unknown as BoxNode);
  const widths = (n: BoxNode) => (n.children ?? []).map((c) => c.width);

  it("removeBox leaves every other width exactly as it was", () => {
    const before = row([{ id: "a", width: "20%" }, { id: "b", width: "20%" }, { id: "c", width: "60%" }]);
    expect(widths(removeBox(before, "b")), "the survivors are untouched").toEqual(["20%", "60%"]);
  });

  it("so a MOVE within the row leaves the row adding up to exactly what it did", () => {
    const before = row([{ id: "a", width: "20%" }, { id: "b", width: "20%" }, { id: "c", width: "60%" }]);
    const after = moveBox(before, "c", "band", 0); // drag the wide one to the front
    const total = (after.children ?? []).reduce((s, k) => s + parseFloat(String(k.width)), 0);
    expect(Math.round(total), `the row came to ${total}% after a move`).toBe(100);
    expect(widths(after), "and each block kept its own width").toEqual(["60%", "20%", "20%"]);
  });
});

/**
 * DROPPING INTO THE HOLE A BLOCK'S OWN MARGIN OPENED — the newcomer takes the hole, nothing moves.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * Reported by the user, twice, and the second time exactly: *"I cannot add a stack… wherever there's an empty
 * space"*, and then *"nothing appears and it breaks the positions of the stacks"*.
 *
 * Dragging a block's TOP edge down opens a `margin-top` — deliberately, where the block sits BESIDE a
 * neighbour rather than below one, because there no single block owns that edge. But a margin is not a box.
 * There is nothing in that space to drop into, and a drop aimed at it hit the band.
 *
 * It did then add a block, and made both of the things the user described happen at once: the margin rode
 * along on `{ ...target }` into the new column, so the hole was STILL THERE and the newcomer sat above it.
 * Measured in a browser: the existing stack was pushed from y=287 to y=336 while the 199px hole remained.
 */
describe("a block dropped into a margin hole takes the hole", () => {
  const withHole = (holePx: number): BoxNode => ({
    id: "band", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0,
    children: [
      { id: "left", type: "container", direction: "column", padding: 0, gap: 0, width: "28%", minHeight: 320, children: [] },
      { id: "right", type: "container", direction: "column", padding: 0, gap: 0, width: "72%", minHeight: 72, marginTop: holePx, children: [] },
    ],
  } as unknown as BoxNode);
  const newcomer = (): BoxNode => createContainer("column", { id: "fresh" } as Partial<BoxNode>);
  /** The column `stackWithBlock` puts in the target's place. */
  const columnFor = (tree: BoxNode) => (tree.children ?? []).find((c) => c.id !== "left")!;

  /**
   * IT FILLS THE HOLE RATHER THAN BEING SIZED TO IT, and that is not a detail — it is the difference between
   * a fix that works at one window width and one that works at all of them. Spacing is emitted in the
   * builder's FLUID unit and a size is not: measured, a stored `200` renders as a margin of 157.2px at 1024,
   * 182.8px at 1280 and 198.8px at 1440, while a `minHeight` of 200 is 200px at every one. The first version
   * of this handed the newcomer `minHeight: 200` and it drifted at every width but one.
   */
  it("the newcomer FILLS the hole — it is never sized from the stored number", () => {
    const after = stackWithBlock(withHole(199), "right", newcomer(), true);
    const band = (columnFor(after).children ?? [])[0];
    expect(band.height, "it takes the space that is there").toBe("fill");
    expect(band.minHeight, "a fixed size would match the fluid margin at exactly one width").toBeUndefined();
  });

  it("…and the target's margin is cleared, so it does not move", () => {
    const after = stackWithBlock(withHole(199), "right", newcomer(), true);
    const keep = (columnFor(after).children ?? [])[1];
    const moved = (keep.children ?? [])[0];
    expect(moved.id).toBe("right");
    expect(moved.marginTop, "the hole was handed over, not duplicated").toBe(0);
  });

  it("the newcomer goes FIRST — into the hole, not under the block", () => {
    const after = stackWithBlock(withHole(199), "right", newcomer(), true);
    const order = (columnFor(after).children ?? []).map((b) => (b.children ?? [])[0]?.id);
    expect(order).toEqual(["fresh", "right"]);
  });

  /**
   * WITH NO HOLE IT MUST STILL FILL, which is the behaviour the drop already had and the one a user aims at
   * when they point at the gap under a short column. A fix that gave every newcomer a fixed height would pass
   * the three cases above and silently undo that.
   */
  it("with no margin it fills too — the behaviour a user aims at under a short column", () => {
    const after = stackWithBlock(withHole(0), "right", newcomer(), true);
    const band = (columnFor(after).children ?? [])[0];
    expect(band.height, "no hole to take, so it takes what is left").toBe("fill");
    expect(band.minHeight).toBeUndefined();
  });

  it("dropping BELOW is untouched — there is no hole under a block's top margin", () => {
    const after = stackWithBlock(withHole(199), "right", newcomer(), false);
    const order = (columnFor(after).children ?? []).map((b) => (b.children ?? [])[0]?.id);
    expect(order).toEqual(["right", "fresh"]);
    const keep = (columnFor(after).children ?? [])[0];
    expect((keep.children ?? [])[0].marginTop, "the margin above it is still its own").toBe(199);
  });
});

/**
 * A BAND STOPS FILLING ONCE THE BLOCK INSIDE IT HAS BEEN GIVEN A HEIGHT.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * A block dropped beside another is wrapped in a band marked `height: "fill"`, so it takes the space that is
 * really there instead of arriving at a courtesy size. `stackWithBlock` already states the rule that has to
 * follow — *"dragging its height afterwards writes a real height and takes the fill off"* — but the height is
 * written on the BLOCK and the fill lives on the BAND, so the band never found out.
 *
 * Reported by the user with a screenshot: shrink the stack you just dropped and the one below it stays put.
 * Measured — the newcomer went 400 → 300 while its band held all 400, leaving a **100px hole** and the block
 * below stranded at y=488. With the fill spent, the block below rides up and the leftover pools at the bottom
 * of the column, which is where it can be built on.
 */
describe("a band's fill is spent once its block is sized", () => {
  const column = (): BoxNode => createContainer("column", { id: "col" } as Partial<BoxNode>);
  const band = (only: Partial<BoxNode>): BoxNode => ({
    ...createContainer("column", { id: "band", rowBand: true, height: "fill" } as Partial<BoxNode>),
    children: [createContainer("column", { id: "inner", ...only } as Partial<BoxNode>)],
  });

  it("fills while the block inside it has no height of its own", () => {
    // `100%` is what the drop writes so the block stretches INSIDE its band — it is not a height someone set.
    expect(childStyle(band({ height: "100%" }), column()).flex, "still filling").toBe("1 1 0%");
  });

  it("stops filling once that block is given a min-height — the user dragged it", () => {
    expect(childStyle(band({ height: "100%", minHeight: 300 }), column()).flex).not.toBe("1 1 0%");
  });

  it("stops filling for a real height too, not only a min-height", () => {
    expect(childStyle(band({ height: "18rem" }), column()).flex).not.toBe("1 1 0%");
  });

  /**
   * THE CASES A BLUNTER RULE WOULD BREAK. Each is a band that must go on filling, and a fix that simply
   * dropped every `fill` would pass the three above while quietly undoing the behaviour the drop exists for.
   */
  it("a band holding SEVERAL blocks still fills — no single block speaks for it", () => {
    const many: BoxNode = {
      ...createContainer("column", { id: "band", rowBand: true, height: "fill" } as Partial<BoxNode>),
      children: [
        createContainer("column", { id: "a", minHeight: 100 } as Partial<BoxNode>),
        createContainer("column", { id: "b" } as Partial<BoxNode>),
      ],
    };
    expect(childStyle(many, column()).flex).toBe("1 1 0%");
  });

  it("a plain block that is not a band is untouched", () => {
    const notABand = createContainer("column", { id: "x", height: "fill", minHeight: 300 } as Partial<BoxNode>);
    expect(childStyle(notABand, column()).flex, "only a BAND carries this fill").toBe("1 1 0%");
  });

  it("and in a ROW the rule changes nothing — there height is the cross axis", () => {
    const row = createContainer("row", { id: "row" } as Partial<BoxNode>);
    // The PROPERTY, not a literal: sizing the block must make no difference at all when the main axis is width.
    expect(childStyle(band({ height: "100%", minHeight: 300 }), row).flex)
      .toBe(childStyle(band({ height: "100%" }), row).flex);
  });
});

/**
 * WHO IS GIVEN THEIR HEIGHT BY SOMETHING ELSE?
 *
 * `hostSizedFor` answers it for a node's children, and the canvas and the export BOTH call it — so the two
 * agree by construction rather than by luck. Two cases were missing, and together they left a hole a user
 * could see: a band that has been given a height did not say so, and a section a row stretches did not pass
 * the answer on. Measured in a browser: the band 300 → 366, the column inside it 300 → 366, and the last row
 * in that column still 120 — a 66px hole above the stack below.
 */
describe("box-model — hostSizedFor: who is handed their height", () => {
  const band = (extra: Partial<BoxNode> = {}) => createContainer("row", { id: "band", rowBand: true, align: "stretch", ...extra } as Partial<BoxNode>);
  const col = (extra: Partial<BoxNode> = {}) => createContainer("column", { id: "col", ...extra } as Partial<BoxNode>);

  it("a band with no height of its own passes the question through, as it always did", () => {
    expect(hostSizedFor(band(), false, null)).toBe(false);
    expect(hostSizedFor(band(), true, null)).toBe(true);
  });

  it("a band that HAS been given a height answers yes — it stretches what is inside it", () => {
    expect(hostSizedFor(band({ minHeight: 366 }), false, null)).toBe(true);
    expect(hostSizedFor(band({ height: "30rem" }), false, null)).toBe(true);
  });

  it("a section in a stretching row passes the answer DOWN to its own rows", () => {
    // The column stores nothing; the band above it is what has the height.
    expect(hostSizedFor(col(), true, band({ minHeight: 366 }))).toBe(true);
  });

  /**
   * IT ANSWERS YES EVEN WHEN THE ROW STORES NOTHING — which is the opposite of what this test asserted when
   * it was written a few hours earlier, and the change is deliberate.
   *
   * A row hands its children its own height HOWEVER that height arose, and most of the time it arose from
   * the tallest child with nothing stored anywhere. Requiring a stored number missed exactly that case:
   * drag one stack's bottom edge down, the band grows because that stack is now the tallest, the column
   * beside it stretches to match, and the rows inside that column go on hugging — a 200px hole under the
   * last one.
   */
  it("…and says so even when the row stores no height, because the tallest child gave it one", () => {
    expect(hostSizedFor(col(), false, band())).toBe(true);
  });

  it("a row told to align its children some other way is handing out no height", () => {
    expect(hostSizedFor(col(), true, createContainer("row", { id: "r", align: "start" } as Partial<BoxNode>))).toBe(false);
  });

  it("a column parent is unchanged — it stacks its children, it does not stretch them", () => {
    expect(hostSizedFor(col(), true, createContainer("column", { id: "outer", minHeight: 400 } as Partial<BoxNode>))).toBe(false);
  });

  it("a block with its own height always answers for itself", () => {
    expect(hostSizedFor(col({ minHeight: 200 }), false, createContainer("column", { id: "outer" } as Partial<BoxNode>))).toBe(true);
  });
});


describe("the column floor (#75): 14rem untouched · 3rem sized by hand · full width on a phone", () => {
  const band = (kids: BoxNode[]) => makeRowBand(kids, 0);
  it("each column's floor, at each screen", () => {
    // With content: an EMPTY column is an editor-only drop target and deliberately has no floor.
    const txt = () => createElement("text", { text: "Words" } as Partial<BoxNode>);
    const row = band([createContainer("column", { id: "u", width: "50%", children: [txt()] } as Partial<BoxNode>), createContainer("column", { id: "h", width: "10%", widthByHand: true, children: [txt()] } as Partial<BoxNode>)]);
    const [u, h] = row.children!;
    expect(childStyle(u, row, "base").minWidth).toBe("min(100%, 14rem)");
    // drawn no narrower than its own longest word (#102) — it can still be DRAGGED to 3rem, see the canvas tests
    expect(childStyle(h, row, "base").minWidth).toBe("min-content");
    expect(childStyle(h, row, "tabletPortrait").minWidth).toBe("min-content");
    expect(childStyle(u, row, "phone").minWidth).toBe("100%");
    expect(childStyle(h, row, "phone").minWidth).toBe("100%");
  });
  it("packRowLines packs each column on its OWN floor", () => {
    const kids = [createContainer("column", { id: "a", width: "10%", widthByHand: true } as Partial<BoxNode>), createContainer("column", { id: "b", width: "90%" } as Partial<BoxNode>)];
    expect(packRowLines(kids, (k) => (k.widthByHand ? 4.7 : 21.9))).toEqual([0, 0]);
    expect(packRowLines(kids, 21.9)).toEqual([0, 1]); // one floor for all would wrap a 10% label column
  });
});

describe("rows of four or more (#78): one row on a desktop and a laptop · at most three per line on a tablet · stacked on a phone", () => {
  const txt = () => createElement("text", { text: "Words" } as Partial<BoxNode>);
  const cols = (widths: string[], extra: Partial<BoxNode>[] = []) => makeRowBand(widths.map((w, i) => createContainer("column", { id: `c${i}`, width: w, children: [txt()], ...(extra[i] ?? {}) } as Partial<BoxNode>)), 0);
  const even = (n: number) => cols(Array.from({ length: n }, () => `${+(100 / n).toFixed(4)}%`));
  const basisPct = (flex: unknown) => parseFloat(String(flex).split(" ")[2]);
  /** The lines the browser makes of flex bases in %: a column goes down when it no longer fits (what flex-wrap does). */
  const wrapByBasis = (row: BoxNode, bp: "tabletPortrait") => {
    const out: number[] = []; let used = 0;
    for (const k of row.children!) { const w = basisPct(childStyle(k, row, bp).flex); if (used && used + w > 100.0001) { out.push(0); used = 0; } if (!out.length) out.push(0); out[out.length - 1]++; used += w; }
    return out;
  };

  it("balancedLines: as few lines as three across allows, as even as they can be", () => {
    expect(balancedLines(3)).toEqual([3]);
    expect(balancedLines(4)).toEqual([2, 2]);
    expect(balancedLines(5)).toEqual([3, 2]);
    expect(balancedLines(6)).toEqual([3, 3]);
    expect(balancedLines(7)).toEqual([3, 2, 2]);
    expect(balancedLines(8)).toEqual([3, 3, 2]);
    expect(balancedLines(9)).toEqual([3, 3, 3]);
    expect(balancedLines(12)).toEqual([3, 3, 3, 3]);
  });

  it("on a desktop, a laptop and a wide screen a column on a line of 4+ floors at 3rem — so the line is never broken", () => {
    for (const n of [4, 5, 6, 8]) for (const bp of ["base", "tabletLandscape", "wide"] as const) {
      const row = even(n);
      for (const k of row.children!) expect(childStyle(k, row, bp).minWidth, `${n} at ${bp}`).toBe("min-content");
    }
  });

  it("a line of three or fewer keeps the 14rem reflow floor, at every rung but the phone", () => {
    const row = even(3);
    for (const bp of ["base", "tabletLandscape", "tabletPortrait", "wide"] as const) expect(childStyle(row.children![0], row, bp).minWidth).toBe("min(100%, 14rem)");
    expect(tabletPlaces(row, "tabletPortrait")).toBeNull();
  });

  it("on a tablet held upright, the line is rearranged to the balanced counts, each line full", () => {
    for (const [n, want] of [[4, [2, 2]], [5, [3, 2]], [6, [3, 3]], [7, [3, 2, 2]], [8, [3, 3, 2]]] as const) {
      const row = even(n);
      expect(wrapByBasis(row, "tabletPortrait"), `${n} columns`).toEqual(want);
      // every line adds up to (just under) the whole row — no hole at the end of a line
      let i = 0;
      for (const across of want) { const sum = row.children!.slice(i, i + across).reduce((t, k) => t + basisPct(childStyle(k, row, "tabletPortrait").flex), 0); i += across; expect(sum).toBeGreaterThan(99.99); expect(sum).toBeLessThanOrEqual(100); }
    }
  });

  it("uneven columns keep their proportions within their tablet line", () => {
    const row = cols(["10%", "40%", "25%", "25%"]);
    const b = row.children!.map((k) => basisPct(childStyle(k, row, "tabletPortrait").flex));
    expect(b[0]).toBeCloseTo(20, 2); expect(b[1]).toBeCloseTo(80, 2); expect(b[2]).toBeCloseTo(50, 2); expect(b[3]).toBeCloseTo(50, 2);
  });

  it("a gap between the columns is a gutter: each slot is its share of the line, and gives up one gap (S1-a)", () => {
    const row = even(6); row.gap = 20;
    const f = String(childStyle(row.children![0], row, "tabletPortrait").flex);
    expect(f).toBe(`1 1 calc((100% - 0%) * 0.33333 - ${u(20)})`);
  });

  it("a gap-margin on the line is taken out too", () => {
    const row = cols(["20%", "20%", "20%", "20%"], [{}, { marginLeftPct: 20 } as Partial<BoxNode>]);
    const b = row.children!.map((k) => basisPct(childStyle(k, row, "tabletPortrait").flex));
    expect(b[0] + b[1]).toBeCloseTo(80, 2);
  });

  it("the tablet arrangement is the tablet's alone — a laptop, a desktop and a phone are not rearranged", () => {
    const row = even(6);
    for (const bp of ["base", "tabletLandscape", "wide", "phone"] as const) expect(tabletPlaces(row, bp), bp).toBeNull();
    expect(childStyle(row.children![0], row, "phone").minWidth).toBe("100%");
  });

  it("a width set AT the tablet wins; the rest of ITS line shares what it leaves, and the other lines stay put", () => {
    let row = even(6);
    row = { ...row, children: row.children!.map((k, i) => (i === 0 ? { ...k, responsive: { tabletPortrait: { width: "60%" } } } : k)) };
    const places = tabletPlaces(row, "tabletPortrait")!;
    expect(places.has("c0")).toBe(false);
    // the lines are still counted over all six (3 + 3): the two free columns on line one share the 40% it leaves,
    // and line two is untouched — a tablet drag must never reshuffle the lines after it
    expect([...places.values()].map((p) => p.across)).toEqual([2, 2, 3, 3, 3]);
    expect(basisPct(childStyle(row.children![1], row, "tabletPortrait").flex)).toBeCloseTo(20, 2);
    expect(basisPct(childStyle(row.children![3], row, "tabletPortrait").flex)).toBeCloseTo(33.333, 2);
    const r0 = resolveResponsive(row.children![0], "tabletPortrait");
    expect(childStyle(r0, row, "tabletPortrait").flex).toBe("0 1 60%");
  });

  it("a row the user already wrapped is rearranged LINE BY LINE — and only the lines of four or more", () => {
    // 4 × 25% then 3 × 33%: the first stored line becomes 2 + 2, the second is left as three
    const row = cols(["25%", "25%", "25%", "25%", "33%", "33%", "33%"]);
    const places = tabletPlaces(row, "tabletPortrait")!;
    expect([...places.keys()]).toEqual(["c0", "c1", "c2", "c3"]);
    expect(onManyColumnLine(row, "c0")).toBe(true);
    expect(onManyColumnLine(row, "c5")).toBe(false);
    expect(columnFloorRem(row, row.children![5])).toBe(14);
  });

  it("a hidden or floating column does not count towards the four", () => {
    const row = cols(["25%", "25%", "25%", "25%"], [{}, {}, {}, { hidden: true } as Partial<BoxNode>]);
    expect(onManyColumnLine(row, "c0")).toBe(false);
    expect(tabletPlaces(row, "tabletPortrait")).toBeNull();
  });

  it("only a ROW BAND is rearranged — a plain row the user built is left alone", () => {
    const row = { ...even(5), rowBand: false };
    expect(tabletPlaces(row, "tabletPortrait")).toBeNull();
    expect(onManyColumnLine(row, "c0")).toBe(false);
  });
});
