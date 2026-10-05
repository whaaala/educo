import { describe, it, expect } from "vitest";
import { createContainer, createElement, makeRowBand, childStyle, containerStyle, u, type BoxNode } from "@/lib/box-model";

/**
 * LINKS ARE ALWAYS SPACED, AND THE PERSON CHOOSES HOW MUCH (user, 2026-09-27).
 * Behaviours: tests/features/components/website/box-builder-content.feature ("Links side by side are always spaced…").
 * The line holding links side by side cannot be selected (it is scaffolding), so its spacing comes from the block it sits
 * in — the menu or list the person CAN select: its "Space across" and "Space down".
 */
const links = (n: number) => Array.from({ length: n }, (_, i) => createElement("link", { id: `l${i}`, text: `L${i}` } as Partial<BoxNode>));
const menu = (extra: Partial<BoxNode> = {}, kids = links(4)) => { const line = makeRowBand(kids, 0); line.id = "line"; return { line, list: createContainer("column", { id: "list", tag: "ul", gap: 0, children: [line], ...extra } as Partial<BoxNode>) }; };
const get = (s: object, k: string) => (s as Record<string, unknown>)[k];

describe("the space between links", () => {
  it("side by side: 2rem across and 0.75rem down (when they wrap) until the person chooses", () => {
    const { line, list } = menu();
    const s = childStyle(line, list);
    expect(get(s, "columnGap")).toBe("2rem"); expect(get(s, "rowGap")).toBe("0.75rem");
  });
  it("on a phone, 1rem across so a line of links fits rather than leaving one alone (F-1, the user 2026-10-01); every other rung 2rem", () => {
    const { line, list } = menu();
    expect(get(childStyle(line, list, "phone"), "columnGap")).toBe("1rem");
    for (const bp of ["tabletPortrait", "tabletLandscape", "base", "wide"] as const) expect(get(childStyle(line, list, bp), "columnGap")).toBe("2rem");
  });
  it("on a phone, a space the person chose is kept", () => {
    const { line, list } = menu({ gapX: 40 });
    expect(get(childStyle(line, list, "phone"), "columnGap")).toBe(u(40));
  });
  it("\"Space across\" and \"Space down\" on the menu set them — separately", () => {
    const { line, list } = menu({ gapX: 40, gapY: 8 });
    const s = childStyle(line, list);
    expect(get(s, "columnGap")).toBe(u(40)); expect(get(s, "rowGap")).toBe(u(8));
  });
  it("\"Space between blocks\" on the menu sets both", () => {
    const { line, list } = menu({ gap: 24 });
    const s = childStyle(line, list);
    expect(get(s, "columnGap")).toBe(u(24)); expect(get(s, "rowGap")).toBe(u(24));
  });
  it("buttons count as menu items too (a call to action beside the links)", () => {
    const { line, list } = menu({}, [...links(2), createElement("button", { id: "b" } as Partial<BoxNode>)]);
    expect(get(childStyle(line, list), "columnGap")).toBe("2rem");
  });
  it("a row of COLUMNS is untouched — its widths are shares of the line, and a gap would wrap it", () => {
    const cols = [createContainer("column", { id: "a", width: "50%" } as Partial<BoxNode>), createContainer("column", { id: "b", width: "50%" } as Partial<BoxNode>)];
    const { line, list } = menu({}, cols);
    expect(get(childStyle(line, list), "columnGap")).toBeUndefined();
  });
  it("one link alone on its line has nothing to be spaced from", () => {
    const { line, list } = menu({}, links(1));
    expect(get(childStyle(line, list), "columnGap")).toBeUndefined();
  });
  it("a list of links one per LINE is spaced down 0.75rem by default, and by \"Space down\" when chosen", () => {
    const vertical = (extra: Partial<BoxNode> = {}) => createContainer("column", { id: "list", tag: "ul", gap: 0, children: links(3).map((l) => makeRowBand([l], 0)), ...extra } as Partial<BoxNode>);
    expect(get(containerStyle(vertical()), "rowGap")).toBe("0.75rem");
    expect(get(containerStyle(vertical({ gapY: 20 })), "rowGap")).toBe(u(20));
    // not a list: a plain stack keeps its own spacing (0 until someone asks, Core Rule 3)
    expect(get(containerStyle(createContainer("column", { gap: 0, children: links(3).map((l) => makeRowBand([l], 0)) } as Partial<BoxNode>)), "rowGap")).toBeUndefined();
  });
});

describe("…and the published page carries it", () => {
  it("links dropped side by side STRAIGHT ON THE PAGE are one section: the line keeps the gutter, the links none (F1-d)", async () => {
    const { siteFromRoot } = await import("@/lib/box-site");
    const { renderSitePage } = await import("@/lib/box-export");
    const { DEFAULT_THEME } = await import("@/lib/site-storage");
    const { pageBandInset, isSectionContentIn, SPACE_DEFAULT } = await import("@/lib/box-model");
    const line = makeRowBand(links(4)); line.id = "line";
    const root = createContainer("column", { id: "page", children: [line] } as Partial<BoxNode>);
    const html = renderSitePage(siteFromRoot(root, "P"), DEFAULT_THEME, "P", { inlineShared: true });
    const rule = (id: string) => [...html.matchAll(new RegExp(`\\.bx-${id}\\{([^}]*)\\}`, "g"))].map((m) => m[1]).join(";");
    for (let i = 0; i < 4; i++) expect(rule(`l${i}`), `link ${i} carries the page gutter as its own padding`).not.toMatch(/padding-left:calc/);
    expect(rule("line")).toContain(`padding-left:${u(SPACE_DEFAULT.gutter)}`);
    expect(pageBandInset(line, true)).toMatchObject({ paddingTop: u(SPACE_DEFAULT.section), paddingBottom: u(SPACE_DEFAULT.section) });
    expect(isSectionContentIn(root, "l0"), "the inspector must agree: a menu link is not a page section").toBe(false);
  });
  it("the exported menu line has 1rem across on a phone, 2rem from a tablet up, 0.75rem down, and the chosen value once set", async () => {
    const { siteFromRoot } = await import("@/lib/box-site");
    const { renderSitePage } = await import("@/lib/box-export");
    const { DEFAULT_THEME } = await import("@/lib/site-storage");
    const doc = (list: BoxNode) => { const site = siteFromRoot(createContainer("column", { id: "page", children: [list] } as Partial<BoxNode>), "P"); return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }); };
    const lineRule = (html: string) => (html.match(/\.bx-line\{([^}]*)\}/) ?? ["", ""])[1];
    const plain = lineRule(doc(menu().list));
    // mobile-first: the phone's 1rem is the base rule (F-1), 2rem arrives at the tablet rung and up
    expect(plain).toMatch(/column-gap:1rem/); expect(plain).toMatch(/row-gap:0\.75rem/);
    expect(doc(menu().list)).toMatch(/@media \(min-width:37\.5em\)\{\.bx-line\{column-gap:2rem/);
    expect(lineRule(doc(menu({ gapX: 40 }).list))).toContain(`column-gap:${u(40)}`);
  });
});
