import { describe, it, expect } from "vitest";
import { createContainer, createElement, makeRowBand, type BoxNode } from "@/lib/box-model";
import { siteFromRoot, addPage, emptyPageRoot } from "@/lib/box-site";
import { styleString, renderPageHTML, renderSiteHTML, downloadHTML } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

describe("box-export — static HTML", () => {
  it("styleString serialises a style object (kebab props, px on bare numbers, unitless kept)", () => {
    expect(styleString({ backgroundColor: "#fff", minHeight: 40, opacity: 0.5, zIndex: 3 }))
      .toBe("background-color:#fff;min-height:40px;opacity:0.5;z-index:3");
  });

  it("renders elements to their tags with content", () => {
    const root = createContainer("column", {
      id: "r",
      children: [makeRowBand([createContainer("column", {
        id: "sec",
        children: [
          makeRowBand([createElement("heading", { text: "Hello" } as Partial<BoxNode>)]),
          makeRowBand([createElement("list", { listStyle: "number", listItems: ["a", "b"] } as Partial<BoxNode>)]),
          makeRowBand([createElement("button", { text: "Go", href: "https://x.com", newTab: true } as Partial<BoxNode>)]),
        ],
      } as Partial<BoxNode>)])],
    } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    expect(html).toContain("<h2");
    expect(html).toContain("Hello");
    expect(html).toContain("<ol");
    expect(html).toContain("<li>a</li>");
    expect(html).toContain('target="_blank"');
  });

  it("escapes text content", () => {
    const root = createContainer("column", { id: "r", children: [makeRowBand([createElement("text", { text: "<script>x</script>" } as Partial<BoxNode>)])] } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>x");
  });

  it("hidden boxes are omitted from the export", () => {
    const root = createContainer("column", { id: "r", children: [makeRowBand([createElement("text", { id: "t", text: "secret", hidden: true } as Partial<BoxNode>)])] } as Partial<BoxNode>);
    expect(renderPageHTML(root, DEFAULT_THEME)).not.toContain("secret");
  });

  it("renderSiteHTML emits one doc with a nav + a <section> per page, and resolves page: links to #slug", () => {
    let site = siteFromRoot(emptyPageRoot(), "Home");
    const about = addPage(site, "About", emptyPageRoot()); site = about.site;
    // a button on Home linking to the About page
    const home = site.pages[0];
    const btn = createElement("button", { text: "About us", href: `page:${about.id}` } as Partial<BoxNode>);
    home.root.children = [makeRowBand([createContainer("column", { children: [makeRowBand([btn])] } as Partial<BoxNode>)])];

    const html = renderSiteHTML(site, DEFAULT_THEME);
    expect(html).toContain("<!doctype html>");
    expect(html).toContain("<nav>");
    expect(html).toContain('<section id="home">');
    expect(html).toContain('<section id="about">');
    expect(html).toContain('href="#about"'); // the page: link resolved to the About slug
  });

  it("downloadHTML is a safe no-op when the DOM/URL APIs are unavailable", () => {
    expect(() => downloadHTML("<html></html>")).not.toThrow();
  });
});
