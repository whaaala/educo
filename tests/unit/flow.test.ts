/**
 * BATCH LE-13 · flow and overlap — words round a picture (FL-3), a sideways strip (FL-6), a section over the one above (PO-4).
 * Both paths: the canvas draws with `containerStyle` / `childStyle`, the export publishes the same through `renderSitePage`.
 * Scenarios: tests/features/components/website/box-builder-flow.feature.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { createContainer, createElement, makeRowBand, insertBox, normalizeRowBands, childStyle, containerStyle, clampRowWidths, flowsWords, flowQueryCss, gridQueryCss, canWrapWords, canOverlapUp, stripsAnywhere, findBox, type BoxNode } from "@/lib/box-model";
import { emptyPageRoot, siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import LAYOUT from "@/config/layout.json";
import { PARAGRAPH_MEASURE } from "@/lib/educo-ui/base";
import INSPECTOR from "@/config/inspector.json";

const F = LAYOUT.flow;
/** LE13-6: a picture is a share of the line, never more than config's share of the words' reading width. */
const capped = (w: string) => `min(${w}, calc(${PARAGRAPH_MEASURE} * ${F.wrapMeasureShare}))`;
const text = (id: string) => createElement("text", { id, text: "The head teacher writes to every family at the start of each term." });
const pic = (extra: Partial<BoxNode> = {}) => createElement("image", { id: "pic", src: "photo.jpg", imgW: 400, imgH: 300, wrapAround: "start", ...extra });
/** A Stack as the builder makes it: every block in a band of its own (`normalizeRowBands`). */
const stackOf = (...kids: BoxNode[]) => normalizeRowBands(createContainer("column", { id: "st", children: kids }));
const bandOf = (st: BoxNode, id: string) => st.children!.find((b) => b.children?.some((k) => k.id === id))!;
const page = (...kids: BoxNode[]) => { let root = emptyPageRoot(); kids.forEach((k, i) => { root = insertBox(root, root.id, i, makeRowBand([k])); }); return normalizeRowBands(root); };
const published = (root: BoxNode) => { const s = siteFromRoot(root); return renderSitePage(s, DEFAULT_THEME, s.pages[0].id); };
const ruleOf = (html: string, id: string) => (html.match(new RegExp(`\\.bx-${id}\\{[^}]*\\}`, "g")) ?? []).join("");

describe("FL-3 · words wrap round a picture", () => {
  it("the Stack flows (a formatting context of its own) and asks its OWN width; its bands of one block are blocks", () => {
    const st = stackOf(pic(), text("t1"), text("t2"));
    expect(flowsWords(st)).toBe(true);
    expect(containerStyle(st)).toMatchObject({ display: "flow-root", containerType: "inline-size" });
    const band = childStyle(bandOf(st, "t1"), st);
    // LE13-1's root cause: a flex band is a formatting context, so words never wrapped; and align-content ≠ normal makes a block one too
    expect(band).toMatchObject({ display: "block", alignContent: "normal" });
    expect(flowsWords(stackOf(pic({ wrapAround: undefined }), text("t1")))).toBe(false);
  });
  it("the picture floats to its LOGICAL side at config's share of the line, the words kept off its open side and its foot", () => {
    const st = stackOf(pic(), text("t1"));
    const s = childStyle(findBox(st, "pic")!, bandOf(st, "pic"), "base", false, st);
    expect(s).toMatchObject({ float: "inline-start", zIndex: 1 /* LE13-8: above the words' blocks, which span its area */, width: capped(F.wrapWidth), marginInlineEnd: `${F.wrapGapRem}rem`, marginInlineStart: "0rem", marginBottom: `${F.wrapGapRem}rem` });
    const e = stackOf(pic({ wrapAround: "end" }), text("t1"));
    expect(childStyle(findBox(e, "pic")!, bandOf(e, "pic"), "base", false, e)).toMatchObject({ float: "inline-end", marginInlineStart: `${F.wrapGapRem}rem`, marginInlineEnd: "0rem" });
  });
  it("its own share when it has one (a rem, or a % short of the line); a new picture's 100% takes config's", () => {
    for (const [w, want] of [["30%", "30%"], ["12rem", "12rem"], ["100%", F.wrapWidth], ["fill", F.wrapWidth]] as const) {
      const st = stackOf(pic({ width: w }), text("t1"));
      expect(childStyle(findBox(st, "pic")!, bandOf(st, "pic"), "base", false, st).width).toBe(capped(want));
    }
  });
  it("Off, anything else stored (a trust boundary), and Off on one screen: no float, the Stack a flex column as before", () => {
    for (const w of [undefined, "off", "left"] as const) {
      const st = stackOf(pic({ wrapAround: w as BoxNode["wrapAround"] }), text("t1"));
      expect(childStyle(findBox(st, "pic")!, bandOf(st, "pic"), "base", false, st).float).toBeUndefined();
      expect(containerStyle(st).display).toBe("flex");
    }
    const st = stackOf(pic({ responsive: { phone: { wrapAround: "off" } } }), text("t1"));
    expect(childStyle(findBox(st, "pic")!, bandOf(st, "pic"), "phone", false, st).float).toBeUndefined();
    expect(containerStyle(st, "phone").display).toBe("flex");
    expect(childStyle(findBox(st, "pic")!, bandOf(st, "pic"), "base", false, st).float).toBe("inline-start");
  });
  it("below config's width of its Stack the picture takes the whole line (a container query, the same rule on both paths)", () => {
    const st = stackOf(pic(), text("t1"));
    const q = flowQueryCss(bandOf(st, "pic"), (id) => `#${id}`);
    expect(q).toBe(`@container (max-width:${F.wrapBelowRem - 0.01}rem){#pic{float:none !important;width:100% !important;margin-inline:0 !important}}`);
    expect(gridQueryCss("#b", bandOf(st, "pic"), (id) => `#${id}`, (c) => c)).toContain(q); // the canvas's and the export's emitter
    expect(flowQueryCss(bandOf(stackOf(pic({ wrapAround: undefined }), text("t1")), "pic"), (id) => id)).toBe("");
  });
  it("LE13-19: wrapped on ONE screen only (the app edits the phone's), the narrow Stack still gives the picture the whole line", () => {
    for (const bp of ["phone", "tabletPortrait", "mobile"] as const) {
      const st = stackOf(pic({ wrapAround: undefined, responsive: { [bp]: { wrapAround: "start" } } } as Partial<BoxNode>), text("t1"));
      expect(flowQueryCss(bandOf(st, "pic"), (id) => `#${id}`), bp).toContain("float:none !important");
    }
  });
  it("the Stack's space between blocks survives the flow, as the top margin of every band after the first", () => {
    const st = stackOf(pic(), text("t1"));
    const gapped = { ...st, gap: 16 };
    expect(childStyle(bandOf(st, "t1"), gapped).marginTop).toBeTruthy();
    expect(childStyle(bandOf(st, "pic"), gapped).marginTop).toBeUndefined();
  });
  it("published: the flow, the float and the query reach the page", () => {
    const html = published(page(stackOf(pic(), text("t1"), text("t2"))));
    expect(ruleOf(html, "st")).toContain("display:flow-root");
    expect(ruleOf(html, "pic")).toContain("float:inline-start");
    expect(html).toContain(`@container (max-width:${F.wrapBelowRem - 0.01}rem)`);
  });
  it("offered only on a picture alone on its line in a Stack (U4)", () => {
    const root = page(stackOf(pic(), text("t1")), createContainer("row", { id: "sbs", children: [createElement("image", { id: "p2" }), text("t3")] }), createContainer("column", { id: "g", layout: "grid", columns: 2, children: [createElement("image", { id: "p3" })] }));
    expect(canWrapWords(root, "pic")).toBe(true);
    expect(canWrapWords(root, "t1")).toBe(false);
    expect(canWrapWords(root, "p2")).toBe(false);
    expect(canWrapWords(root, "p3")).toBe(false);
  });
});

describe("FL-6 · a sideways strip", () => {
  const cards = (n = 6, extra: Partial<BoxNode> = {}) => Array.from({ length: n }, (_, i) => createContainer("column", { id: `c${i}`, width: `${Math.round(100 / n)}%`, children: [text(`ct${i}`)], ...extra }));
  const sbs = (extra: Partial<BoxNode> = {}) => createContainer("row", { id: "sbs", children: cards(), scrollX: true, ...extra });
  it("one line that scrolls sideways and snaps, the swipe kept off the page", () => {
    expect(containerStyle(sbs())).toMatchObject({ flexWrap: "nowrap", overflowX: "auto", overflowY: "hidden", scrollSnapType: "x mandatory", overscrollBehaviorX: "contain" });
    expect(containerStyle(sbs({ scrollX: undefined, wrap: true })).flexWrap).toBe("wrap");
  });
  it("each block keeps config's width (a peek on a phone) or its own rem width, and lands at the start", () => {
    const p = sbs();
    expect(childStyle(p.children![0], p)).toMatchObject({ flex: `0 0 ${F.stripCard}`, width: F.stripCard, minWidth: 0, scrollSnapAlign: "start" });
    const own = { ...p, children: [{ ...p.children![0], width: "20rem" }] };
    expect(childStyle(own.children[0], own).flex).toBe("0 0 20rem");
  });
  it("per screen: a strip on the phone only, wrapped lines on a desktop", () => {
    const p = sbs({ scrollX: undefined, wrap: true, responsive: { phone: { scrollX: true } } });
    expect(containerStyle(p, "phone").overflowX).toBe("auto");
    expect(containerStyle(p, "base").flexWrap).toBe("wrap");
    expect(childStyle(p.children![0], p, "base").scrollSnapAlign).toBeUndefined();
    expect(stripsAnywhere(p)).toBe(true);
  });
  it("its widths are never re-fitted to one line (clampRowWidths leaves it alone)", () => {
    const p = sbs({ wrap: false, children: cards(3, { width: "60%" }) });
    expect(clampRowWidths(p)).toBe(p);
    expect(clampRowWidths({ ...p, scrollX: undefined })).not.toBe(p); // the guard can fail: the same row without the strip IS re-fitted
  });
  it("published: a named, focusable region with the strip's CSS", () => {
    const html = published(page(sbs()));
    expect(html).toMatch(new RegExp(`tabindex="0" role="region" aria-label="${INSPECTOR.flow.stripLabel}" class="bx-sbs`));
    expect(ruleOf(html, "sbs")).toContain("overflow-x:auto");
    expect(ruleOf(html, "c0")).toContain("scroll-snap-align:start");
    expect(published(page(sbs({ scrollX: undefined })))).not.toContain('role="region"');
  });
});

describe("PO-4 · a section over the one above", () => {
  const hero = () => createContainer("column", { id: "hero", background: "#224488", paddingBottom: 16, children: [text("hl")] });
  const cards = (extra: Partial<BoxNode> = {}) => createContainer("row", { id: "sec", overlapUp: F.overlapSteps[1], children: [0, 1, 2].map((i) => createContainer("column", { id: `k${i}`, children: [text(`kt${i}`)] })), ...extra });
  const bands = (root: BoxNode) => root.children!.filter((b) => b.rowBand);
  it("the section's band is pulled up by the step and drawn in front; the section above grows by as much at its foot", () => {
    const root = page(hero(), cards());
    const [b1, b2] = bands(root);
    const x = F.overlapSteps[1];
    expect(childStyle(b2, root)).toMatchObject({ marginTop: `-${x}rem`, position: "relative", zIndex: 1 });
    expect(String(childStyle(findBox(root, "hero")!, b1, "base", false, root).paddingBottom)).toMatch(new RegExp(`^calc\\(.+ \\+ ${x}rem\\)$`));
    expect(childStyle(b1, root).marginTop).toBeUndefined();
  });
  it("only a step of config's; Off on one screen; nothing without one", () => {
    // LE13-2: ONE page per value — a band of another page is found nowhere in this one, which made this check unable to fail
    for (const bad of [5, -4, 0]) { const r = page(hero(), cards({ overlapUp: bad })); expect(childStyle(bands(r)[1], r).marginTop).toBeUndefined(); }
    const root = page(hero(), cards({ responsive: { phone: { overlapUp: 0 } } }));
    expect(childStyle(bands(root)[1], root, "phone").marginTop).toBeUndefined();
    expect(childStyle(findBox(root, "hero")!, bands(root)[0], "phone", false, root).paddingBottom).toBeUndefined();
    expect(childStyle(bands(root)[1], root, "base").marginTop).toBe(`-${F.overlapSteps[1]}rem`);
  });
  it("published: both halves reach the page", () => {
    const html = published(page(hero(), cards()));
    expect(html).toContain(`margin-top:-${F.overlapSteps[1]}rem`);
    expect(ruleOf(html, "hero")).toContain(`+ ${F.overlapSteps[1]}rem)`);
  });
  it("offered on a section of the page with one above it, never the first", () => {
    const root = page(hero(), cards());
    expect(canOverlapUp(root, "hero")).toBe(false);
    expect(canOverlapUp(root, "sec")).toBe(true);
    expect(canOverlapUp(root, "k0")).toBe(false);
  });
});

describe("RULE CFG · the numbers and words live in config", () => {
  const src = (f: string) => readFileSync(f, "utf8").replace(/\r\n/g, "\n");
  it("config/layout.json flow and config/inspector.json flow agree, one word per step", () => {
    expect(INSPECTOR.flow.overlapSteps).toHaveLength(F.overlapSteps.length);
  });
  it("no flow value is typed into the engine or the Inspector", () => {
    const model = src("lib/box-model.ts");
    const flow = model.slice(model.indexOf("// ── Flow and overlap (BATCH LE-13)"), model.indexOf("/** A block that takes its parent's main-axis free room"));
    expect(flow.length).toBeGreaterThan(500);
    for (const v of [F.stripCard, F.wrapWidth, `${F.wrapBelowRem}`, `${F.wrapGapRem}rem`, ...F.overlapSteps.map((n) => `${n}rem`)]) expect(flow).not.toContain(v);
    const insp = src("components/website/box/BoxInspector.tsx");
    for (const w of [INSPECTOR.flow.wrap, INSPECTOR.flow.fit, INSPECTOR.flow.overlap, INSPECTOR.flow.fitChoices.scroll]) expect(insp).not.toContain(w);
  });
});
