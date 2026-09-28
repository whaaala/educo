import { describe, it, expect } from "vitest";
import { createContainer, createElement, type BoxNode } from "@/lib/box-model";
import { siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { pageCheck } from "@/lib/semantics";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * A LINK BLOCK — words that go somewhere (user, 2026-09-27: "buttons are buttons, menus are menus").
 * Behaviours: tests/features/components/website/box-builder-content.feature ("A Link block is words that go somewhere").
 */
const page = (kids: BoxNode[]) => createContainer("column", { id: "page", children: kids } as Partial<BoxNode>);
const doc = (root: BoxNode) => { const site = siteFromRoot(root, "P"); return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }); };
const anchor = (html: string, text: string) => (html.match(new RegExp(`<a [^>]*>${text}</a>`)) ?? [""])[0];

describe("the Link block", () => {
  it("is created as words with a link, underlined — a link must not be told apart by colour alone (WCAG 1.4.1)", () => {
    const l = createElement("link");
    expect(l.type).toBe("link"); expect(l.text).toBe("New link"); expect(l.href).toBe("#"); expect(l.underline).toBe(true);
  });

  it("publishes a plain <a href> styled as words — in the brand colour, never a button's pill", () => {
    const a = anchor(doc(page([createElement("link", { text: "Term dates", href: "/term-dates" } as Partial<BoxNode>)])), "Term dates");
    expect(a).toMatch(/^<a href="\/term-dates"/);
    expect(a).toMatch(/text-decoration:underline/);
    expect(a).toMatch(/color:var\(--bx-link, var\(--eu-color-brand\)\)/); // the band's link colour, else the brand (#92)
    expect(a).not.toMatch(/border-radius|background|padding/); // none of a button's look
    expect(a).not.toMatch(/target=/);
  });

  it("opens a new tab only when asked, and then safely (rel=noopener)", () => {
    const a = anchor(doc(page([createElement("link", { text: "Ofsted report", href: "https://example.org", newTab: true } as Partial<BoxNode>)])), "Ofsted report");
    expect(a).toMatch(/^<a href="https:\/\/example\.org"/);
    expect(a).toMatch(/target="_blank" rel="noopener noreferrer"/);
  });

  it("the Underline toggle takes the underline off — for a menu", () => {
    const a = anchor(doc(page([createElement("link", { text: "About", underline: false } as Partial<BoxNode>)])), "About");
    expect(a, "the link is still published").toMatch(/^<a href=/);
    expect(a).not.toMatch(/text-decoration:underline/);
    // …and says so: a browser underlines every <a> by default, so "off" must be written, not left out (#106)
    expect(a).toMatch(/text-decoration:none/);
  });

  it("a link with no words stops publishing, like a button with none (Page check)", () => {
    const issues = pageCheck(page([createElement("link", { text: "" } as Partial<BoxNode>)]));
    expect(issues.some((i) => i.blocks && /link has no words/.test(i.message))).toBe(true);
  });
});

describe("a menu is a list of links (#104)", () => {
  // Measured through the UI: four links side by side in a block marked List published ONE <li> holding all four — the
  // invisible line that holds them side by side was the list's only child. Valid HTML allows only <li> inside <ul>, so
  // the LINE becomes the list and each block on it an item; it keeps the line's side-by-side layout.
  const links = (n: number) => Array.from({ length: n }, (_, i) => createElement("link", { id: `l${i}`, text: `Item ${i}`, href: `#i${i}`, underline: false } as Partial<BoxNode>));
  const navWith = (list: BoxNode) => page([createContainer("column", { id: "nav", tag: "nav", children: [list] } as Partial<BoxNode>)]);
  const itemsOf = (html: string) => { const ul = (html.match(/<ul[^>]*>([\s\S]*?)<\/ul>/) ?? ["", ""])[1]; return (ul.match(/<li[\s>]/g) ?? []).length; };
  it("four links on one line → <nav><ul> with four <li>", async () => {
    const { makeRowBand } = await import("@/lib/box-model");
    const list = createContainer("column", { id: "list", tag: "ul", children: [makeRowBand(links(4), 0)] } as Partial<BoxNode>);
    const html = doc(navWith(list));
    expect(html).toMatch(/<nav[^>]*>[\s\S]*<ul/);
    expect((html.match(/<ul/g) ?? []).length).toBe(1);
    expect(itemsOf(html)).toBe(4);
    // each item in its OWN <li>: the text sits between an <li> and the next </li>
    for (let i = 0; i < 4; i++) expect(html).toMatch(new RegExp(`<li[^>]*>(?:(?!</li>)[^])*Item ${i}(?:(?!</li>)[^])*</li>`));
  });
  it("a list one-per-line is unchanged: one <li> per line", async () => {
    const { makeRowBand } = await import("@/lib/box-model");
    const list = createContainer("column", { id: "list", tag: "ul", children: links(3).map((l) => makeRowBand([l], 0)) } as Partial<BoxNode>);
    expect(itemsOf(doc(navWith(list)))).toBe(3);
  });
});
