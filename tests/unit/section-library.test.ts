import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import SECTIONS from "@/config/sections.json";
import FINISHES from "@/config/section-finishes.json";
import COPY from "@/config/section-copy.json";
import { buildSection, insertSection, restyleSection, nextFinish, FINISH_IDS, FINISH_CHOICES, WIREFRAME, type SectionDef, type SectionNode } from "@/lib/section-library";
import { renderSitePage } from "@/lib/box-export";
import { emptyPageRoot, type BoxSite } from "@/lib/box-site";
import { DEFAULT_THEME } from "@/lib/site-storage";
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
const sectionsOf = (id: string): SectionDef[] => (existsSync(file(id)) ? (JSON.parse(readFileSync(file(id), "utf8").replace(/\r\n/g, "\n")) as { sections: SectionDef[] }).sections : []);
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

describe("another finish for a section already on the page (BATCH LE-15f, RF-1)", () => {
  const RESTYLE = (FINISHES as unknown as { restyle: { look: string[]; content: string[] } }).restyle;
  const made = (finish: string) => (def: SectionDef) => buildSection(def, { finish: finish === WIREFRAME ? FINISH_IDS[0] : finish, wireframe: finish === WIREFRAME });
  const parts = (n: BoxNode) => { const m = new Map<string, BoxNode>(); walk(n, (x) => { if (x.sectionPart != null) m.set(x.sectionPart, x); }); return m; };
  const ALL = BUILT.flatMap((c) => sectionsOf(c.id));
  const byId = (id: string) => ALL.find((d) => d.id === id)!;
  // the same fields and values whatever order they were written in (ids aside)
  const canon = (n: BoxNode) => JSON.stringify(n, (k, v: unknown) => (k === "id" ? undefined : v && typeof v === "object" && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b))) : v));
  const find = (n: BoxNode, f: (x: BoxNode) => boolean) => { let hit: BoxNode | undefined; walk(n, (x) => { if (!hit && f(x)) hit = x; }); return hit!; };

  it("the choices are the Wireframe then the seven finishes, and Ctrl+Alt+F's next wraps round to the Wireframe", () => {
    expect(FINISH_CHOICES).toEqual([WIREFRAME, ...FINISH_IDS]);
    expect(nextFinish(WIREFRAME)).toBe(FINISH_IDS[0]);
    expect(nextFinish(FINISH_IDS[2])).toBe(FINISH_IDS[3]);
    expect(nextFinish(FINISH_IDS[FINISH_IDS.length - 1])).toBe(WIREFRAME);
    expect(nextFinish(undefined)).toBe(WIREFRAME);
  });

  it("a built section remembers where it came from: its layout and finish on the section, its part on every block it made", () => {
    for (const def of ALL) for (const f of FINISH_CHOICES) {
      const s = made(f)(def);
      expect(s.sectionFrom, def.id).toBe(def.id);
      expect(s.sectionFinish, def.id).toBe(f);
      walk(s, (n) => { if (!n.rowBand) expect(n.sectionPart, `${def.id} ${n.type}`).toBeTypeOf("string"); });
    }
  });

  it("every field a finish changes is listed as a look or as content in config/section-finishes.json (a new one is caught the day it appears)", () => {
    const listed = new Set([...RESTYLE.look, ...RESTYLE.content, "id", "children", "sectionFinish"]);
    for (const def of ALL) {
      const builds = FINISH_CHOICES.map((f) => parts(made(f)(def)));
      for (const [part, a] of builds[0]) for (const b of builds.slice(1).map((m) => m.get(part)!)) {
        for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
          if (JSON.stringify((a as unknown as Record<string, unknown>)[k]) !== JSON.stringify((b as unknown as Record<string, unknown>)[k])) expect(listed.has(k), `${def.id} ${part} "${k}"`).toBe(true);
        }
      }
    }
  });

  it("untouched, a section re-finished is exactly a fresh one in that finish — every layout, from every finish to every other", () => {
    for (const def of ALL) for (const from of FINISH_CHOICES) for (const to of FINISH_CHOICES) {
      expect(canon(restyleSection(made(from)(def), def, to)), `${def.id} ${from} → ${to}`).toBe(canon(made(to)(def)));
    }
  });

  it("what the person wrote stays: changed words, a replaced photo and a block of their own — and the look is the new finish's", () => {
    const def = byId("hero-split");
    for (const to of FINISH_CHOICES) {
      const s = made("calm")(def);
      const title = find(s, (n) => n.type === "heading");
      title.text = "Open day, 12 March";
      find(s, (n) => n.type === "image").src = "data:image/png;base64,MINE";
      const holder = find(s, (n) => n.type === "container" && !n.rowBand && n !== s && !!n.children?.length);
      holder.children = [...holder.children!, createElement("button", { text: "My own button", background: "red" })];
      const out = restyleSection(s, def, to);
      const fresh = made(to)(def);
      expect(find(out, (n) => n.type === "heading").text, to).toBe("Open day, 12 March");
      expect(find(out, (n) => n.type === "image").src, to).toBe("data:image/png;base64,MINE");
      expect(find(out, (n) => n.text === "My own button").background, `${to}: my button untouched`).toBe("red");
      expect(find(out, (n) => n.type === "heading").fontSize, to).toBe(find(fresh, (n) => n.type === "heading").fontSize);
      expect(find(out, (n) => n.type === "image").radius, to).toBe(find(fresh, (n) => n.type === "image").radius);
      expect(out.sectionFinish).toBe(to);
    }
  });

  it("what I styled myself that no finish ever sets stays: a background on a plain stack, a shadow on a title", () => {
    const def = byId("hero-split");
    const s = made("calm")(def);
    const stack = find(s, (n) => n.type === "container" && !n.rowBand && n !== s && !n.background);
    stack.background = "var(--eu-color-surface)";
    const title = find(s, (n) => n.type === "heading");
    title.shadow = "lg";
    const out = restyleSection(s, def, "bold");
    expect(find(out, (n) => n.id === stack.id).background).toBe("var(--eu-color-surface)");
    expect(find(out, (n) => n.id === title.id).shadow).toBe("lg");
  });

  it("my own photo behind words stays in the Wireframe, with its shade, and the words over it stay white", () => {
    const def = byId("hero-photo");
    const s = made("startup")(def);
    const behind = find(s, (n) => !!n.bgImage);
    behind.bgImage = "data:image/png;base64,MINE";
    const out = restyleSection(s, def, WIREFRAME);
    const kept = find(out, (n) => n.id === behind.id);
    expect(kept.bgImage).toBe("data:image/png;base64,MINE");
    expect(kept.bgOverlay, "the shade").toBe((FINISHES as unknown as { scrim: string }).scrim);
    expect(find(kept, (n) => n.type === "heading").color, "white words").toBe((FINISHES as unknown as { tones: { photo: { text: string } } }).tones.photo.text);
    // LE15f-4: EVERY block over the photo, however deep (the buttons sit in a row), keeps the photo's colours — the HEADED
    // screenshot showed "Learn more" dark on the photo while the title was white
    const photoTone = Object.values((FINISHES as unknown as { tones: { photo: Record<string, string> } }).tones.photo);
    const off: string[] = []; walk(kept, (n) => { if (n !== kept && n.color && !photoTone.includes(n.color)) off.push(`${n.type} ${n.color}`); if (n.type === "button" && n.background && n.background !== "transparent" && !photoTone.includes(n.background)) off.push(`button bg ${n.background}`); });
    expect(off, "every colour over my photo is the photo's").toEqual([]);
    // untouched, the wireframe has no photo, as the gallery's wireframe
    expect(find(restyleSection(made("startup")(def), def, WIREFRAME), (n) => n.id !== "" && !!n.bgImage)).toBeUndefined();
  });

  it("the section's memory is the editor's: none of it is written into the published page", () => {
    const def = byId("hero-split");
    const s = made("calm")(def);
    const site = { pages: [{ id: "p", name: "P", path: "p", root: emptyPageRoot(s) }], homeId: "p" } as BoxSite;
    const html = renderSitePage(site, DEFAULT_THEME, "p", { inlineShared: true });
    expect(html).toContain("<section");
    for (const word of ["sectionPart", "sectionFrom", "sectionFinish", "hero-split", '"calm"']) expect(html, word).not.toContain(word);
  });
});
