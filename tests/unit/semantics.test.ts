import { describe, it, expect } from "vitest";
import { resolvePage, pageCheck, corrections } from "@/lib/semantics";
import type { BoxNode } from "@/lib/box-model";

/** Behaviours: tests/features/components/website/box-builder-semantics.feature */
let n = 0;
const box = (p: Partial<BoxNode> = {}, children: BoxNode[] = []): BoxNode => ({ id: p.id ?? `b${++n}`, type: "container", children, ...p } as BoxNode);
const band = (child: BoxNode, p: Partial<BoxNode> = {}) => box({ rowBand: true, ...p }, [child]);
const heading = (text: string, p: Partial<BoxNode> = {}): BoxNode => ({ id: p.id ?? `h${++n}`, type: "heading", text, ...p } as BoxNode);
const page = (...kids: BoxNode[]) => box({ id: "root" }, kids);
const lvl = (sem: ReturnType<typeof resolvePage>, id: string) => sem.byId.get(id)?.level;

describe("A1 — the main region is automatic", () => {
  it("a page with nothing marked: everything is main", () => {
    const s = resolvePage(page(box({ id: "a" }), box({ id: "b" })));
    expect(s.mainWrap).toEqual({ start: 0, end: 2 });
  });
  it("leading header bands and trailing footer bands stay outside main — marked on the band or the one block inside it", () => {
    const s = resolvePage(page(band(box({ tag: "header" })), box({ id: "x" }), box({ id: "y" }), box({ tag: "footer" })));
    expect(s.mainWrap).toEqual({ start: 1, end: 3 });
  });
  it("a block marked Main is used instead, and a second one is demoted — and says so", () => {
    const s = resolvePage(page(box({ id: "m1", tag: "main" }), box({ id: "m2", tag: "main" })));
    expect(s.mainWrap).toBeNull();
    expect(s.byId.get("m1")!.tag).toBe("main");
    expect(s.byId.get("m2")!.tag).toBe("div");
    expect(corrections(s).map((c) => c.id)).toContain("m2");
  });
  it("a Main inside a section is not allowed: demoted, and the automatic main takes over", () => {
    const s = resolvePage(page(box({ tag: "section" }, [heading("Hi"), box({ id: "m", tag: "main" })])));
    expect(s.byId.get("m")!.tag).toBe("div");
    expect(s.mainWrap).not.toBeNull();
  });
  it("a page header in the MIDDLE of the page is published as a plain block", () => {
    const s = resolvePage(page(box({ id: "a" }), box({ id: "hdr", tag: "header" }), box({ id: "b" })));
    expect(s.byId.get("hdr")!.tag).toBe("div");
    expect(s.byId.get("hdr")!.corrected).toMatch(/top of the page/);
  });
});

describe("B1 — heading levels follow the page", () => {
  it("the first heading of the CONTENT is the H1 — not the school's name in the header", () => {
    const s = resolvePage(page(box({ tag: "header" }, [heading("Oakfield School", { id: "name" })]), box({}, [heading("Welcome", { id: "w" })]), box({}, [heading("News", { id: "news" })])));
    expect(lvl(s, "w")).toBe(1);
    expect(lvl(s, "name")).toBe(2);
    expect(lvl(s, "news")).toBe(2);
  });
  it("a heading inside a section sits one level below it", () => {
    const card = (id: string) => box({ tag: "article" }, [heading("Card", { id })]);
    const s = resolvePage(page(box({}, [heading("Welcome")]), box({ tag: "section" }, [heading("Our values", { id: "v" }), card("c1"), card("c2")])));
    expect(lvl(s, "v")).toBe(2);
    expect(lvl(s, "c1")).toBe(3);
    expect(lvl(s, "c2")).toBe(3);
  });
  it("never deeper than H6", () => {
    let inner: BoxNode = box({ tag: "section" }, [heading("deep", { id: "deep" })]);
    for (let i = 0; i < 8; i++) inner = box({ tag: "section" }, [heading(`l${i}`), inner]);
    const s = resolvePage(page(box({}, [heading("Top")]), inner));
    expect(lvl(s, "deep")).toBe(6);
  });
  it("a level set by hand is kept", () => {
    const s = resolvePage(page(box({}, [heading("Welcome"), heading("Detail", { id: "d", level: 4 })])));
    expect(lvl(s, "d")).toBe(4);
  });
  it("an empty heading is not published", () => {
    const s = resolvePage(page(box({}, [heading("  ", { id: "e" })])));
    expect(s.byId.get("e")!.omit).toBe(true);
  });
  it("no heading in the content: the first heading anywhere becomes the H1", () => {
    const s = resolvePage(page(box({ tag: "header" }, [heading("Oakfield", { id: "o" })]), box({ id: "body" })));
    expect(lvl(s, "o")).toBe(1);
  });
  // #118 — a self-contained piece never titles the page
  it("a card's title never becomes the page's title: the first heading OUTSIDE any article does", () => {
    const card = (id: string) => box({ tag: "article" }, [heading("Card title", { id })]);
    const s = resolvePage(page(box({ tag: "header" }, [heading("Oakfield", { id: "name" })]), box({ rowBand: true }, [card("c1"), card("c2"), card("c3")]), box({ tag: "section" }, [heading("What we offer", { id: "w" })])));
    expect(lvl(s, "w")).toBe(1);
    expect(lvl(s, "c1")).toBeGreaterThanOrEqual(2);
    expect(lvl(s, "name")).toBe(2);
  });
  it("…and a page whose content holds only cards titles itself with the header's name, not a card", () => {
    const card = (id: string) => box({ tag: "article" }, [heading("Card title", { id })]);
    const s = resolvePage(page(box({ tag: "header" }, [heading("Oakfield", { id: "name" })]), box({ rowBand: true }, [card("c1"), card("c2")])));
    expect(lvl(s, "name")).toBe(1);
    expect(lvl(s, "c1")).toBe(2);
    expect([...s.byId.values()].filter((v) => v.level === 1)).toHaveLength(1);
  });
  it("a quote's caption, a sidebar's heading and a menu's heading are self-contained too", () => {
    for (const tag of ["figure", "aside", "nav"] as const) {
      const s = resolvePage(page(box({ tag }, [heading("Inside", { id: "in" })]), box({}, [heading("Welcome", { id: "w" })])));
      expect(lvl(s, "w"), tag).toBe(1);
      expect(lvl(s, "in"), tag).toBeGreaterThanOrEqual(2);
    }
  });
  // #121 — the section the page title heads
  it("cards inside the section the H1 heads are H2, not H3 — no level is skipped", () => {
    const card = (id: string) => box({ tag: "article" }, [heading("Card", { id })]);
    const s = resolvePage(page(box({ tag: "section" }, [heading("What we offer", { id: "t" }), card("c1"), card("c2")]), box({ tag: "section" }, [heading("Next", { id: "n" }), card("c3")])));
    expect(lvl(s, "t")).toBe(1);
    expect(lvl(s, "c1")).toBe(2);
    expect(lvl(s, "n")).toBe(2);
    expect(lvl(s, "c3")).toBe(3);
  });
  it("…but a level the user set inside that section is kept", () => {
    const s = resolvePage(page(box({ tag: "section" }, [heading("Title", { id: "t" }), box({ tag: "article" }, [heading("Mine", { id: "m", level: 4 })])])));
    expect(lvl(s, "t")).toBe(1);
    expect(lvl(s, "m")).toBe(4);
  });
});

describe("C1 — fixed for you, asked only for your words", () => {
  it("two unnamed menus are named by where they are", () => {
    const s = resolvePage(page(box({ tag: "header" }, [box({ id: "n1", tag: "nav" })]), box({}), box({ tag: "footer" }, [box({ id: "n2", tag: "nav" })])));
    expect(s.byId.get("n1")!.label).toBe("Main menu");
    expect(s.byId.get("n2")!.label).toBe("Footer menu");
  });
  it("one menu alone needs no name", () => {
    const s = resolvePage(page(box({ tag: "header" }, [box({ id: "n1", tag: "nav" })]), box({})));
    expect(s.byId.get("n1")!.label).toBeUndefined();
  });
  it("a section with no heading and no name is published as a plain block; with a name it stays a section", () => {
    const s = resolvePage(page(box({ id: "s1", tag: "section" }), box({ id: "s2", tag: "section", landmarkName: "News" })));
    expect(s.byId.get("s1")!.tag).toBe("div");
    expect(s.byId.get("s2")!.tag).toBe("section");
    expect(s.byId.get("s2")!.label).toBe("News");
  });
  it("the children of a list are its items", () => {
    const s = resolvePage(page(box({ tag: "ul" }, [box({ id: "i1" }), box({ id: "i2" })])));
    expect(s.byId.get("i1")!.listItem).toBe(true);
    expect(s.byId.get("i2")!.listItem).toBe(true);
  });
  it("the Page check asks ONLY for a person's words — a photo with no description, a button with no words", () => {
    const root = page(box({}, [
      { id: "img1", type: "image", src: "a.jpg" } as BoxNode,
      { id: "img2", type: "image", src: "b.jpg", alt: "" } as BoxNode,       // marked decorative: not asked
      { id: "img3", type: "image", src: "c.jpg", alt: "Pupils in the library" } as BoxNode,
      { id: "btn", type: "button", text: "" } as BoxNode,
      { id: "ok", type: "button", text: "Apply now" } as BoxNode,
    ]));
    const issues = pageCheck(root);
    expect(issues.map((i) => i.id).sort()).toEqual(["btn", "img1"]);
    expect(issues.every((i) => i.blocks)).toBe(true);
    expect(issues.find((i) => i.id === "img1")!.message).toMatch(/can't see it/);
  });
  it("a hand-set heading that jumps a level is a warning with its fix; automatic levels never jump", () => {
    const root = page(box({}, [heading("Welcome"), heading("Jumped", { id: "j", level: 4 })]));
    const issues = pageCheck(root);
    expect(issues).toEqual([expect.objectContaining({ id: "j", kind: "heading-jump", blocks: false, fix: { level: 2 } })]);
    expect(pageCheck(page(box({}, [heading("A"), heading("B"), box({ tag: "section" }, [heading("C"), box({ tag: "article" }, [heading("D")])])])))).toEqual([]);
  });
});

import { renderPageHTML } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { catalogueEntry } from "@/lib/component-catalogue";

describe("the EXPORT publishes the resolved semantics", () => {
  const html = (root: BoxNode) => renderPageHTML(root, DEFAULT_THEME);
  const count = (s: string, re: RegExp) => (s.match(re) ?? []).length;
  it("a skip link first, exactly one <main>, a <header>, and the content's first heading as the <h1>", () => {
    const out = html(page(box({ tag: "header" }, [heading("Oakfield")]), box({}, [heading("Welcome"), heading("News")]), box({ tag: "footer" })));
    expect(out.indexOf('class="eu-skip"')).toBeGreaterThan(-1);
    expect(out.indexOf('class="eu-skip"')).toBeLessThan(out.indexOf("<header"));
    expect(count(out, /<main\b/g)).toBe(1);
    // The skip link's target is a focusable marker at the start of main — the display:contents <main> cannot take focus (#72).
    expect(out).toContain('<main class="eu-main"><span id="main" tabindex="-1" class="eu-main-start"></span>');
    expect(out).toMatch(/<header\b/);
    expect(out).toMatch(/<footer\b/);
    expect(out).toMatch(/<h1\b[^>]*>Welcome<\/h1>/);
    expect(out).toMatch(/<h2\b[^>]*>News<\/h2>/);
    expect(out).toMatch(/<h2\b[^>]*>Oakfield<\/h2>/);
  });
  it("the header and footer sit OUTSIDE the <main>", () => {
    const out = html(page(box({ tag: "header" }), box({ id: "mid" }), box({ tag: "footer" })));
    const main = out.slice(out.indexOf("<main"), out.indexOf("</main>"));
    expect(main).not.toMatch(/<header|<footer/);
  });
  it("a block marked Main is the <main> itself — nothing is wrapped", () => {
    const out = html(page(box({ tag: "header" }), box({ tag: "main" }, [heading("Hi")])));
    expect(count(out, /<main\b/g)).toBe(1);
    expect(out).not.toMatch(/class="eu-main"/);
    expect(out).toMatch(/<main id="main" tabindex="-1" class="/);
  });
  it("a list publishes as a list with its blocks as items; an empty heading is left out", () => {
    const out = html(page(box({ tag: "ul" }, [box(), box()]), box({}, [heading("", { id: "gone" })])));
    expect(out).toMatch(/<ul[^>]*class="[^"]*eu-list/);
    expect(count(out, /<li\b/g)).toBe(2);
    expect(out).not.toMatch(/bx-gone/);
  });
  it("a named menu carries its name", () => {
    const out = html(page(box({ tag: "nav", landmarkName: "Main menu" })));
    expect(out).toMatch(/<nav[^>]*aria-label="Main menu"/);
  });
  it("a Card from the palette is an <article>, a Quote a <figure>", () => {
    expect(catalogueEntry("card")!.build().tag).toBe("article");
    expect(catalogueEntry("quote")!.build().tag).toBe("figure");
  });
});
