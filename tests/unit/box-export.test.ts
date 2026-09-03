import { describe, it, expect } from "vitest";
import { createContainer, createElement, createComponent, makeRowBand, type BoxNode } from "@/lib/box-model";
import { siteFromRoot, addPage, emptyPageRoot } from "@/lib/box-site";
import { styleString, renderPageHTML, renderSiteHTML, renderPageDocument, downloadHTML } from "@/lib/box-export";
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
    expect(html).toContain('<nav class="eu-site-nav">');
    expect(html).toContain('<section id="home">');
    expect(html).toContain('<section id="about">');
    expect(html).toContain('href="#about"'); // the page: link resolved to the About slug
  });

  it("Phase 0.4 — export is self-contained: Educo UI stylesheet inlined + body scoped under .eu-root", () => {
    const site = siteFromRoot(emptyPageRoot(), "Home");
    const html = renderSiteHTML(site, DEFAULT_THEME);
    expect(html).toContain('<body class="eu-root">'); // scoped so styles never leak
    expect(html).toContain("--eu-color-primary-500:#"); // tokens inlined
    expect(html).toContain(".eu-container");            // base stylesheet inlined
    expect(html).toContain(".eu-btn");                  // component styles inlined
    expect(html).not.toMatch(/https?:\/\/[^"']*\.css/); // no external stylesheet links
  });

  it("renderPageDocument wraps a single page as a self-contained document", () => {
    const root = createContainer("column", { children: [makeRowBand([createElement("heading", { text: "Solo" } as Partial<BoxNode>)])] } as Partial<BoxNode>);
    const doc = renderPageDocument(root, DEFAULT_THEME, "My Page");
    expect(doc).toContain("<!doctype html>");
    expect(doc).toContain("<title>My Page</title>");
    expect(doc).toContain('<body class="eu-root">');
    expect(doc).toContain("Solo");
  });

  it("renders an accordion component as native <details> with its variant class + items", () => {
    const acc = createComponent("accordion", {
      variant: "--panel",
      accItems: [
        { id: "i1", title: "Q one", body: "A one", meta: "$10", open: true },
        { id: "i2", title: "Q two", body: "A two" },
      ],
    } as Partial<BoxNode>);
    const root = createContainer("column", { children: [makeRowBand([acc])] } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    expect(html).toContain('class="eu-accordion eu-accordion--panel"');
    expect(html).toContain('<details class="eu-accordion__item" open');
    expect(html).toContain('<summary class="eu-accordion__header">Q one');
    expect(html).toContain('<span class="eu-accordion__meta">$10</span>');
    expect(html).toContain('<div class="eu-accordion__body">A two</div>');
    expect(html).toContain('name="acc-'); // single-open grouping by default
  });

  it("multi-open accordion drops the shared name; token overrides + advanced CSS reach the wrapper", () => {
    const acc = createComponent("accordion", {
      accMultiOpen: true,
      tokenOverrides: { "--eu-color-brand": "#ff0088" },
      advancedCss: "letter-spacing: .04em; } body{display:none} ; @import url(evil.css)",
      accItems: [{ id: "i1", title: "T", body: "B" }],
    } as Partial<BoxNode>);
    const root = createContainer("column", { children: [makeRowBand([acc])] } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    expect(html).not.toContain('name="acc-');                 // multi-open → no grouping
    expect(html).toContain("--eu-color-brand:#ff0088");       // token override inlined
    expect(html).toContain("letter-spacing: .04em;");         // safe declaration kept
    expect(html).not.toContain("display:none");               // selector breakout stripped
    expect(html).not.toContain("@import");                    // at-rule stripped
  });

  it("applies component typography (font family + size) to the wrapper so it cascades into items", () => {
    const acc = createComponent("accordion", {
      fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, letterSpacing: 1,
      accItems: [{ id: "i1", title: "T", body: "B" }],
    } as Partial<BoxNode>);
    const root = createContainer("column", { children: [makeRowBand([acc])] } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    expect(html).toContain("font-family:Georgia, serif");
    expect(html).toContain("font-weight:700");
    expect(html).toContain("letter-spacing:1px");
  });

  it("escapes accordion content (no HTML injection through titles/bodies)", () => {
    const acc = createComponent("accordion", { accItems: [{ id: "i1", title: "<img src=x onerror=alert(1)>", body: "<b>x</b>" }] } as Partial<BoxNode>);
    const root = createContainer("column", { children: [makeRowBand([acc])] } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    expect(html).toContain("&lt;img src=x");
    expect(html).not.toContain("<img src=x onerror");
  });

  it("escapes double quotes in style values so quoted fonts / data-URL images can't break the HTML attribute", () => {
    // a font stack with quotes + a background image data URL — both used to corrupt the document
    expect(styleString({ fontFamily: '"Playfair Display", serif' }))
      .toBe("font-family:&quot;Playfair Display&quot;, serif");
    const s = styleString({ backgroundImage: 'url("data:image/png;base64,AAAA")' });
    expect(s).toContain("&quot;data:image/png;base64,AAAA&quot;");
    expect(s).not.toMatch(/url\("/); // no raw double-quote that would close style="…"
  });

  it("a background image + quoted font on a node produce a well-formed style attribute", () => {
    const acc = createComponent("accordion", { fontFamily: '"Playfair Display", serif', accItems: [{ id: "i", title: "T", body: "B" }] } as Partial<BoxNode>);
    const sec = createContainer("column", { bgImage: "data:image/png;base64,AAAA", children: [makeRowBand([acc])] } as Partial<BoxNode>);
    const html = renderPageHTML(sec, DEFAULT_THEME);
    expect(html).toContain("&quot;Playfair Display&quot;");
    expect(html).toContain("background-image:url(&quot;data:image/png;base64,AAAA&quot;)");
    // every style attribute is closed properly (no stray unescaped quote inside a style="…")
    for (const m of html.matchAll(/style="([^"]*)"/g)) expect(m[1]).not.toContain('"');
  });

  it("Responsive Field Guide: no box overflows its container (max-width:100%) and the body can't scroll sideways", () => {
    const acc = createComponent("accordion", { width: "500px", accItems: [{ id: "i", title: "T", body: "B" }] } as Partial<BoxNode>);
    const root = createContainer("column", { children: [makeRowBand([acc])] } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    // every rendered box caps at its container so a fixed 500px card shrinks on a phone (never a scrollbar)
    for (const m of html.matchAll(/style="([^"]*)"/g)) expect(m[1]).toContain("max-width:100%");
    // the exported document body never scrolls horizontally
    const doc = renderPageDocument(createContainer("column", {} as Partial<BoxNode>), DEFAULT_THEME, "P");
    expect(doc).toContain("html,body{max-width:100%;overflow-x:hidden}");
  });

  it("downloadHTML is a safe no-op when the DOM/URL APIs are unavailable", () => {
    expect(() => downloadHTML("<html></html>")).not.toThrow();
  });
});
