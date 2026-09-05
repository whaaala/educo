import { describe, it, expect } from "vitest";
import { coerceSite } from "@/lib/box-site";
import {
  createContainer, createGrid, createElement, createRoot, createComponent,
  addItem, removeItem, moveItem, updateItem, addChildItem, updateChildItem, removeChildItem, moveChildItem, sanitizeCssDeclarations, expandScopedCss, ACCORDION_CSS_PARTS, itemOverrideCss, itemHasOverride, itemFloatReserveRem, richBody, plainBody, isEmptyBox,
  findBox, findParent, isAncestor, updateBox, insertBox, removeBox, moveBoxStep, moveBox,
  containerStyle, childStyle, paddingCSS, marginCSS, sizeToCSS, flexForWidth, fillMainAxis, u, newBoxId, dropIndexAmong,
  makeRowBand, normalizeRowBands, clampRowWidths, widthPct,
  isFloating, floatBox, unfloatBox, groupBoxes, ungroupBoxes, alignInRow, alignInRowOf, bringToFront, sendToBack, bringForward, sendBackward, floatingZRange, cloneBox,
  isCssBg, bgImageLayer, renderAlertHTML, bgShowThroughCss,
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
    expect(acc.width).toBe("auto");                 // RULE L: sizes to its content; Full/Custom are opt-in
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
    const out = itemOverrideCss(".it", it, { mobileReset: true });
    expect(out).toContain(".it{position:absolute !important;left:12rem !important;top:6rem !important;z-index:10 !important;");
    expect(out).toContain("@media (max-width:480px){.it{position:static !important;left:auto !important;top:auto !important;}}");
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
    // content-sized width RULE L gives it.
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
      expect(row.children![0].width).toBe("auto");                          // RULE L: content-sized, never clamped
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
    expect(a.height).toBe("200px");        // a floating card gets a DEFINITE height (not a min-height floor)
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
    const mh = containerStyle(sec).minHeight as number;
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
