import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import SECTIONS from "@/config/sections.json";
import FINISHES from "@/config/section-finishes.json";
import COPY from "@/config/section-copy.json";
import { buildSection, insertSection, FINISH_IDS, type SectionDef, type SectionNode } from "@/lib/section-library";
import { createContainer, createElement, makeRowBand, regionBlock, regionSpan, type BoxNode } from "@/lib/box-model";

/**
 * THE SECTION LIBRARY (BATCH LE-15, ED-4+ (2)) — box-builder-sections.feature.
 * Enumerates config/sections.json and every category file it names, so a section added later is covered the day it
 * appears (RULE CFG: a section is data; RULE S / T: each finish is visibly different; D5: only the design's own space).
 */

const ROOT = process.cwd();
type Category = { id: string; label: string; group: string; count: number; batch: string };
const CATS = SECTIONS.categories as Category[];
const file = (id: string) => join(ROOT, "config", "sections", `${id}.json`);
const sectionsOf = (id: string): SectionDef[] => (existsSync(file(id)) ? (JSON.parse(readFileSync(file(id), "utf8")) as { sections: SectionDef[] }).sections : []);
const BUILT = CATS.filter((c) => existsSync(file(c.id))); // a category of a later batch has no file yet
const walk = (n: BoxNode, f: (n: BoxNode) => void) => { f(n); n.children?.forEach((c) => walk(c, f)); };
const shape = (n: BoxNode): unknown => [n.type, n.tag ?? "", (n.children ?? []).map(shape)];
const look = (n: BoxNode): string => JSON.stringify(n, (k, v) => (k === "id" ? undefined : v));

describe("the section library", () => {
  it("the open batch's categories hold exactly the layouts the config promises (D1: 302 in 27, LE-15 first)", () => {
    expect(CATS.length).toBe(27);
    expect(CATS.reduce((s, c) => s + c.count, 0)).toBe(302);
    for (const c of CATS.filter((c) => c.batch === "LE-15")) expect(sectionsOf(c.id).length, `${c.label}`).toBe(c.count);
  });

  it("every section id is unique across the library", () => {
    const ids = BUILT.flatMap((c) => sectionsOf(c.id).map((s) => s.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every section builds into ordinary blocks with unique ids, in the wireframe and in every finish", () => {
    expect(FINISH_IDS).toEqual(["serious", "minimalist", "plain", "bold", "calm", "startup", "playful"]);
    for (const c of BUILT) for (const def of sectionsOf(c.id)) for (const finish of FINISH_IDS) for (const wireframe of [true, false]) {
      const node = buildSection(def, { finish, wireframe });
      const ids: string[] = [];
      walk(node, (n) => { ids.push(n.id); expect(["container", "heading", "text", "button", "link", "image", "icon", "list", "divider"]).toContain(n.type); });
      expect(new Set(ids).size, `${def.id} ids`).toBe(ids.length);
      expect(node.type, `${def.id} is a block`).toBe("container");
      expect(["section", "header", "footer"], `${def.id} is a landmark`).toContain(node.tag);
    }
  });

  it("the wireframe and the designed version have the same structure; only the look and the words differ", () => {
    for (const c of BUILT) for (const def of sectionsOf(c.id)) {
      const wire = buildSection(def, { finish: "plain", wireframe: true });
      const designed = buildSection(def, { finish: "plain", wireframe: false });
      expect(shape(designed), def.id).toEqual(shape(wire));
    }
  });

  it("a wireframe's words are the placeholders in config/section-copy.json; the designed version keeps the school's words", () => {
    const def: SectionDef = { id: "t", name: "t", tree: { k: "section", c: [{ r: "title", t: "Welcome to Greenfield Academy" }, { r: "body", t: "A school for every child." }] } };
    const texts = (n: BoxNode) => { const out: string[] = []; walk(n, (x) => { if (x.text) out.push(x.text); }); return out; };
    expect(texts(buildSection(def, { finish: "plain", wireframe: true }))).toEqual([COPY.title, COPY.body]);
    expect(texts(buildSection(def, { finish: "plain", wireframe: false }))).toEqual(["Welcome to Greenfield Academy", "A school for every child."]);
  });

  it("the seven finishes are each visibly different, on every section that holds something (RULE T)", () => {
    // An EMPTY section (Blank) has nothing for a finish to dress: no words, no buttons, no picture — it is the one exempt.
    for (const c of BUILT) for (const def of sectionsOf(c.id).filter((d) => (d.tree.c ?? []).length > 0)) {
      const looks = FINISH_IDS.map((finish) => look(buildSection(def, { finish, wireframe: false })));
      expect(new Set(looks).size, def.id).toBe(FINISH_IDS.length);
    }
  });

  it("a finish's values are read from config/section-finishes.json, never typed in code", () => {
    const def: SectionDef = { id: "t", name: "t", tree: { k: "section", c: [{ r: "title", t: "Hello" }] } };
    for (const finish of FINISH_IDS) {
      let title: BoxNode | undefined;
      walk(buildSection(def, { finish, wireframe: false }), (n) => { if (n.type === "heading") title = n; });
      const want = (FINISHES as unknown as Record<string, { roles: { title: { size: number } } }>)[finish].roles.title.size;
      expect(title?.fontSize, finish).toBe(want);
    }
  });

  it("D5 · a section carries only the space its design gives: every block is made under no-space-unless-added", () => {
    for (const c of BUILT) for (const def of sectionsOf(c.id)) walk(buildSection(def, { finish: "calm", wireframe: false }), (n) => expect(n.bare, `${def.id} ${n.type}`).toBe(true));
  });

  it("a centred section centres its blocks as a person does: each block's band is set to Centre (measured on the canvas)", () => {
    const def: SectionDef = { id: "t", name: "t", tree: { k: "section", center: true, c: [{ r: "eyebrow", t: "Hi" }, { r: "title", t: "Hello" }, { r: "body", t: "Words" }] } };
    const sec = buildSection(def, { finish: "plain", wireframe: false });
    expect(sec.children!.length).toBe(3);
    for (const band of sec.children!) { expect(band.rowBand, "in a band").toBe(true); expect(band.justify, "centred").toBe("center"); }
    const left = buildSection({ ...def, tree: { ...def.tree, center: false } }, { finish: "plain", wireframe: false });
    for (const band of left.children!) expect(band.justify, "not centred").toBeUndefined();
  });

  it("a row of buttons that is not spread out hugs them, so they never stretch; a spread row keeps the line (measured on the sheet)", () => {
    const row = (justify?: "between") => buildSection({ id: "t", name: "t", tree: { k: "section", c: [{ k: "row", ...(justify ? { set: { justify } } : {}), c: [{ r: "button", t: "Apply" }, { r: "button2", t: "Visit" }] }] } }, { finish: "plain", wireframe: false });
    const kids = (s: BoxNode) => s.children![0].children![0].children!;
    // only the LAST is placed: a block placed at the start pushes whatever follows it to the far end (LE15-43, measured 500px)
    expect(kids(row()).map((b) => b.placeX), "the last placed at the start: no grow, nothing pushed").toEqual([undefined, "start"]);
    for (const b of kids(row("between"))) expect(b.placeX, "spread: Spread places them").toBeUndefined();
    const withStack = buildSection({ id: "t", name: "t", tree: { k: "section", c: [{ k: "row", c: [{ k: "stack", c: [{ r: "title", t: "Hi" }] }, { r: "image" }] }] } }, { finish: "plain", wireframe: false });
    for (const b of kids(withStack)) expect(b.placeX, "columns still share the line").toBeUndefined();
  });

  it("D1 (a) · a designed section moves (an entrance), a wireframe does not", () => {
    const def: SectionDef = { id: "t", name: "t", tree: { k: "section", c: [{ r: "title", t: "Hello" }, { r: "button", t: "Go" }] } };
    const reveals = (n: BoxNode) => { let k = 0; walk(n, (x) => { if (x.revealEffect) k++; }); return k; };
    for (const finish of FINISH_IDS) expect(reveals(buildSection(def, { finish, wireframe: false })), finish).toBeGreaterThan(0);
    expect(reveals(buildSection(def, { finish: "bold", wireframe: true }))).toBe(0);
  });
});

describe("adding a section to a page", () => {
  const page = () => {
    const header = createContainer("column", { tag: "header", shared: true }); header.children = [createElement("text", { text: "Old header" })];
    const a = createContainer("column"); const b = createContainer("column"); b.children = [createElement("text", { id: "inB", text: "in B" } as Partial<BoxNode>)];
    const footer = createContainer("column", { tag: "footer", shared: true });
    const root = createContainer("column", { id: "root" });
    root.children = [makeRowBand([header]), makeRowBand([a]), makeRowBand([b]), makeRowBand([footer])];
    return { root, a, b };
  };
  const tree = (k: "section" | "header" | "footer"): SectionNode => ({ k, c: [{ r: "title", t: k }] });
  const def = (k: "section" | "header" | "footer"): SectionDef => ({ id: k, name: k, tree: tree(k) });

  it("lands as a whole band straight after the band holding the selection, never inside it", () => {
    const { root } = page();
    const sec = buildSection(def("section"), { finish: "plain", wireframe: false });
    const out = insertSection(root, "inB", sec);
    expect(out.children!.length).toBe(5);
    expect(regionBlock(out.children![3])?.id ?? out.children![3].children?.[0]?.id).toBe(sec.id);
    expect(out.children![3].rowBand).toBe(true);
  });

  it("with nothing selected, lands at the end of the page, above the footer", () => {
    const { root } = page();
    const sec = buildSection(def("section"), { finish: "plain", wireframe: false });
    const out = insertSection(root, null, sec);
    expect(out.children![3].children![0].id).toBe(sec.id);
    expect(regionBlock(out.children![4])?.tag).toBe("footer");
  });

  it("dropped: it lands where it was let go between bands — never inside the header, never below the footer", () => {
    const sec = () => buildSection(def("section"), { finish: "plain", wireframe: false });
    const { root } = page();
    const dropped = sec(); const out = insertSection(root, null, dropped, 2);
    expect(out.children![2].children![0].id, "at the place").toBe(dropped.id);
    const top = sec(); expect(insertSection(root, null, top, 0).children![1].children![0].id, "not above the header").toBe(top.id);
    const end = sec(); const last = insertSection(root, null, end, 99);
    expect(regionBlock(last.children!.at(-1)!)?.tag, "the footer stays last").toBe("footer");
  });

  it("a ready-made header REPLACES the page's header, shown on every page; a footer its footer", () => {
    for (const which of ["header", "footer"] as const) {
      const { root } = page();
      const sec = buildSection(def(which), { finish: "plain", wireframe: false });
      const out = insertSection(root, null, sec);
      const [s, e] = regionSpan(out, which);
      expect(e - s, `one ${which}`).toBe(1);
      const block = regionBlock(out.children![s])!;
      expect(block.id).toBe(sec.id);
      expect(block.shared, `${which} on every page`).toBe(true);
      expect(out.children!.length).toBe(4);
    }
  });
});
