/**
 * BATCH LE-4 · the alignment panel, its basics — Across / Down with Fill (AC-27), even spacing and wrapped lines (AC-25),
 * baseline (AL-5), push to the far end (AL-6) and the room a push needs (LE4-1).
 * Scenarios: tests/features/components/website/box-builder-alignment.feature. The controls: BoxInspector.test.tsx "LE-4".
 */
import { describe, it, expect } from "vitest";
import { createContainer, createGrid, createElement, makeRowBand, insertBox, normalizeRowBands, markPageGrid, childStyle, containerStyle, placeCSS, parentFlowOf, type BoxNode } from "@/lib/box-model";
import { emptyPageRoot, siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import WORDS from "@/config/inspector.json";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const text = (id: string, extra: Partial<BoxNode> = {}) => createElement("text", { id, text: "Some words", ...extra });
const row = (kids: BoxNode[] = [], extra: Partial<BoxNode> = {}) => createContainer("row", { id: "r", children: kids, ...extra });
const stack = (kids: BoxNode[] = [], extra: Partial<BoxNode> = {}) => createContainer("column", { id: "c", children: kids, ...extra });
const published = (...kids: BoxNode[]) => {
  const root = emptyPageRoot(); const page = markPageGrid(normalizeRowBands(insertBox(root, root.id, 0, makeRowBand(kids))));
  const s = siteFromRoot(page); return renderSitePage(s, DEFAULT_THEME, s.pages[0].id);
};
const css = (html: string, id: string) => [...html.matchAll(new RegExp(`\\.bx-${id}\\{([^}]*)\\}`, "g"))].map((m) => m[1]).join(";");

describe("AC-27 · Across / Down with Fill", () => {
  it("Fill on the parent's cross axis stretches the block and gives up its cross size", () => {
    expect(placeCSS(text("a", { placeY: "stretch" }), row())).toMatchObject({ alignSelf: "stretch", height: "auto" });
    expect(placeCSS(text("a", { placeX: "stretch" }), stack())).toMatchObject({ alignSelf: "stretch", width: "auto" });
  });
  it("Fill on the parent's main axis grows into the free room (no auto margin)", () => {
    const s = placeCSS(text("a", { placeX: "stretch" }), row());
    expect(s.flex).toBe("1 1 auto");
    expect(s.marginLeft).toBeUndefined();
    expect(placeCSS(text("a", { placeY: "stretch" }), stack()).flex).toBe("1 1 auto");
  });
  it("in a grid cell Fill is justify-self / align-self stretch", () => {
    expect(placeCSS(text("a", { placeX: "stretch", placeY: "stretch" }), createGrid(3))).toMatchObject({ justifySelf: "stretch", alignSelf: "stretch" });
  });
  it("Fill wins over the hug a block gets in a row (childStyle applies the place last)", () => {
    expect(childStyle(text("a", { placeY: "stretch" }), row([], { align: "center" })).alignSelf).toBe("stretch");
  });
  it("the published page carries it — an element and a container", () => {
    const html = published(text("pe", { placeX: "end" }), stack([text("pc-t")], { id: "pc", placeY: "stretch" }));
    expect(css(html, "pc")).toMatch(/align-self:stretch/);
    expect(css(html, "pe")).toMatch(/margin-left:auto/);
  });
});

describe("AC-25 · even spacing and wrapped lines", () => {
  it("Even spacing is space-evenly; Space around stays space-around (a saved page keeps its look)", () => {
    expect(containerStyle(row([], { justify: "evenly" })).justifyContent).toBe("space-evenly");
    expect(containerStyle(row([], { justify: "around" })).justifyContent).toBe("space-around");
  });
  it("wrapped lines: unset stays stretch (every saved page), each choice its own align-content", () => {
    expect(containerStyle(row([], { wrap: true })).alignContent).toBe("stretch");
    const want = { start: "flex-start", center: "center", end: "flex-end", between: "space-between", evenly: "space-evenly", stretch: "stretch" } as const;
    for (const [v, c] of Object.entries(want)) expect(containerStyle(row([], { wrap: true, alignContent: v as BoxNode["alignContent"] })).alignContent).toBe(c);
  });
  it("a stored value that is not one of them falls back to stretch (a trust boundary)", () => {
    expect(containerStyle(row([], { wrap: true, alignContent: "sideways" as unknown as BoxNode["alignContent"] })).alignContent).toBe("stretch");
  });
  it("the published page carries both", () => {
    const html = published(row([text("w1"), text("w2")], { id: "pw", wrap: true, justify: "evenly", alignContent: "end" }));
    expect(css(html, "pw")).toMatch(/justify-content:space-evenly/);
    expect(css(html, "pw")).toMatch(/align-content:flex-end/);
  });
});

describe("AL-5 · baseline", () => {
  it("Text lines up is align-items: baseline on a row and a grid, and its blocks follow it instead of hugging the top", () => {
    expect(containerStyle(row([], { align: "baseline" })).alignItems).toBe("baseline");
    expect(containerStyle(createGrid(3, { align: "baseline" } as Partial<BoxNode>)).alignItems).toBe("baseline");
    expect(childStyle(text("a"), row([], { align: "baseline" })).alignSelf).toBe("baseline");
  });
  it("the published page carries it", () => {
    expect(css(published(row([text("b1"), text("b2")], { id: "pb", align: "baseline" })), "pb")).toMatch(/align-items:baseline/);
  });
});

describe("AL-6 · push to the far end, and LE4-1 · the room it needs", () => {
  it("a push is the main-axis end: an auto margin before it", () => {
    expect(placeCSS(text("a", { placeX: "end" }), row()).marginLeft).toBe("auto");
    expect(placeCSS(text("a", { placeY: "end" }), stack()).marginTop).toBe("auto");
  });
  it("LE4-1: a sibling of a pushed block does not grow into the room the push needs", () => {
    const pushed = text("p", { placeY: "end" }); const other = createContainer("column", { id: "o", children: [text("o-t")] });
    const parent = stack([other, pushed], { height: "20rem" });
    expect(childStyle(other, parent).flex).toBe("0 0 auto");
    // the control: with no push the sibling keeps its fill-and-follow grow
    expect(childStyle(other, stack([other, text("p")], { height: "20rem" })).flex).toBe("1 1 auto");
  });
  it("the legacy push counts too — on a row, the only axis its left / right margins move", () => {
    const other = text("o"); // a block with no width (a container's default Fill is a width the person keeps — RX3-22)
    expect(childStyle(other, row([other, text("p", { push: "end" })], { width: "100%" })).flex).toBe("0 0 auto");
    expect(childStyle(other, row([other, text("p")], { width: "100%" })).flex).toBe("1 1 auto");
  });
});

describe("LE4-4 · a block alone in its row band: its Down is its band's", () => {
  // every stacked block is wrapped in a band of its own (`normalizeRowBands`), so its Down acted inside a band only as tall as itself
  const card = (btn: Partial<BoxNode>) => normalizeRowBands(stack([text("t"), createElement("button", { id: "b", text: "Go", ...btn })], { id: "card", height: "20rem" }));
  const bandOf = (c: BoxNode, id: string) => c.children!.find((k) => k.children?.some((x) => x.id === id))!;
  it("a pushed button's band takes the free room above it (margin-top: auto) and its sibling's band does not grow", () => {
    const c = card({ placeY: "end" }); const b = bandOf(c, "b"), t = bandOf(c, "t");
    expect(b.rowBand).toBe(true);
    expect(childStyle(b, c).marginTop).toBe("auto");
    expect(childStyle(t, c).flex).not.toBe("1 1 auto");
  });
  it("Down Fill: the band grows; Middle: auto above and below; per screen", () => {
    expect(childStyle(bandOf(card({ placeY: "stretch" }), "b"), card({ placeY: "stretch" })).flex).toBe("1 1 auto");
    const m = childStyle(bandOf(card({ placeY: "center" }), "b"), card({ placeY: "center" })); expect([m.marginTop, m.marginBottom]).toEqual(["auto", "auto"]);
    const c = card({ responsive: { phone: { placeY: "end" } } }); const b = bandOf(c, "b");
    expect(childStyle(b, c, "phone").marginTop).toBe("auto"); expect(childStyle(b, c, "base").marginTop).toBeUndefined();
  });
  it("the Inspector reads a lone block's parent as the stack around its band (parentFlowOf) — so Push writes Down", () => {
    const c = card({}); const root = createContainer("column", { id: "root", children: [c] });
    expect(parentFlowOf(root, "b")).toBe("column");
    const two = createContainer("column", { id: "root2", children: [makeRowBand([text("x"), text("y")])] });
    expect(parentFlowOf(two, "x")).toBe("row"); // a band of two IS a row of blocks
    expect(parentFlowOf(createContainer("row", { id: "sbs", children: [text("z")] }), "z")).toBe("row");
    expect(parentFlowOf(createGrid(3, { children: [text("g")] }), "g")).toBe("grid");
  });
  it("a band of two keeps its own place (the lone block's Down only)", () => {
    const row2 = makeRowBand([text("x", { placeY: "end" }), text("y")]); const c = stack([row2], { height: "20rem" });
    expect(childStyle(row2, c).marginTop).toBeUndefined();
  });
  it("the published page carries it", () => {
    const page = (btn: Partial<BoxNode>) => published(stack([text("pt"), createElement("button", { id: "pbt", text: "Go", ...btn })], { id: "pcard", height: "20rem" }));
    const bandPushed = /\.bx-[\w-]+\{display:flex;flex-direction:row;[^}]*margin-top:auto/;
    expect(page({ placeY: "end" })).toMatch(bandPushed);
    expect(page({})).not.toMatch(bandPushed); // the control
  });
});

describe("the words come from config/inspector.json (RULE CFG)", () => {
  it("every choice has its words", () => {
    const A = WORDS.align;
    expect(Object.keys(A.justify)).toEqual(["start", "center", "end", "between", "around", "evenly"]);
    expect(Object.keys(A.lineUp)).toEqual(["stretch", "start", "center", "end", "baseline"]);
    expect(Object.keys(A.wrappedChoices)).toEqual(["stretch", "start", "center", "end", "between", "evenly"]);
    expect(Object.keys(A.acrossChoices)).toEqual(["auto", "start", "center", "end", "stretch"]);
    expect(Object.keys(A.downChoices)).toEqual(["auto", "start", "center", "end", "stretch"]);
    for (const k of ["across", "down", "push", "pushHint", "wrappedLines", "wrappedHint", "placeHint"] as const) expect(A[k]).toBeTruthy();
  });
  it("LE4-3: no component types an alignment phrase of its own — a word copied back into code fails here", () => {
    const A = WORDS.align;
    const phrases = [...new Set([A.push, A.wrappedLines, ...[A.justify, A.lineUp, A.inCell, A.wrappedChoices].flatMap((o) => Object.values(o)), "Even gaps"])].filter((p) => / /.test(p));
    expect(phrases.length).toBeGreaterThanOrEqual(6);
    for (const f of ["components/website/box/BoxInspector.tsx", "components/website/box/BulkInspector.tsx"]) {
      const src = readFileSync(join(process.cwd(), f), "utf8").replace(/\r\n/g, "\n");
      for (const p of phrases) expect(src.includes(`"${p}"`), `${f} types "${p}"`).toBe(false);
    }
  });
});
