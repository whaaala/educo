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

  it("a FILLED button paints its own shape once and fills+centres — no duplicate wrapper background behind it", () => {
    // A resized filled button must be ONE shape: the <a> fills the box (width/height 100%) and centres its label,
    // and its wrapper (bx-<id>) must NOT also paint the background (that produced a 'shape behind' on resize).
    const btn = createElement("button", { id: "btn", text: "Go", background: "#4f46e5", radius: 999, width: "200px", height: "120px" } as Partial<BoxNode>);
    const root = createContainer("column", { id: "r", children: [makeRowBand([btn])] } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    // The <a> fills + centres.
    expect(html).toMatch(/<a[^>]*style="[^"]*width:100%[^"]*height:100%[^"]*"/);
    expect(html).toContain("justify-content:center");
    expect(html).not.toContain("inline-flex"); // no longer a hugging inline pill
    // The <a> paints the background; the wrapper class rule must NOT (no duplicate shape behind).
    const wrapRule = html.match(/\.bx-btn\{([^}]*)\}/)?.[1] ?? "";
    expect(wrapRule).not.toMatch(/background/);
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

  it("renders registry components (Card/Quote/Stat/Badge/Rating) as single .eu-* nodes — no wrapper container", () => {
    const mk = (component: string, fields: Record<string, string | number>, variant = "") =>
      createComponent(component, { componentFields: { ...fields }, variant } as Partial<BoxNode>);
    const root = createContainer("column", { children: [makeRowBand([
      mk("card", { title: "My card", body: "Body copy", buttonText: "Go", buttonHref: "#x" }, "--raised"),
      mk("quote", { text: "Great!", author: "Sam" }, "--bordered"),
      mk("stat", { value: "2,500", label: "Users" }, "--brand"),
      mk("badge", { text: "Sale" }, "--danger"),
      mk("rating", { value: 3, max: 5 }),
    ])] } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    // Card = ONE .eu-card node with title/body/button; the variant is on the same element (no extra container)
    expect(html).toContain('<div class="eu-card--raised">');
    expect(html).toContain('<div class="eu-card__title">My card</div>');
    expect(html).toContain('<a class="eu-btn eu-btn--primary eu-card__action" href="#x">Go</a>');
    expect(html).toContain('<figure class="eu-quote--bordered">');
    expect(html).toContain("Great!");
    expect(html).toContain('<div class="eu-stat--brand">');
    expect(html).toContain('<div class="eu-stat__value">2,500</div>');
    expect(html).toContain('<span class="eu-badge--danger">Sale</span>');
    // rating: 3 filled stars (is-on) out of 5 SVGs
    expect((html.match(/eu-rating__star is-on/g) ?? []).length).toBe(3);
    expect((html.match(/eu-rating__star/g) ?? []).length).toBe(5);
  });

  it("escapes registry-component content (no HTML injection through fields)", () => {
    const card = createComponent("card", { componentFields: { title: "<img src=x onerror=alert(1)>", body: "b", buttonText: "", buttonHref: "" } } as Partial<BoxNode>);
    const html = renderPageHTML(createContainer("column", { children: [makeRowBand([card])] } as Partial<BoxNode>), DEFAULT_THEME);
    expect(html).toContain("&lt;img src=x");
    expect(html).not.toContain("<img src=x onerror");
  });

  it("a component's border/background style the COMPONENT ITSELF (injected on .eu-*), not a wrapper box", () => {
    const badge = createComponent("badge", { borderWidth: 4, borderColor: "#ff0000", radius: 20, background: "#00ff00", fontFamily: "Georgia, serif" } as Partial<BoxNode>);
    const root = createContainer("column", { children: [makeRowBand([badge])] } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    // a per-instance <style> targets `.bx-<id> .eu-badge` with the box + text styling
    expect(html).toMatch(/\.bx-[A-Za-z0-9_-]+ \.eu-badge\{[^}]*border:4px solid #ff0000/);
    expect(html).toMatch(/\.bx-[A-Za-z0-9_-]+ \.eu-badge\{[^}]*background:#00ff00/);
    expect(html).toMatch(/\.bx-[A-Za-z0-9_-]+ \.eu-badge[^{]*\{[^}]*font-family:Georgia, serif/);
    // the component's WRAPPER (bx- rule) carries NO border/background of its own
    const wrapRule = html.match(/\.bx-[A-Za-z0-9_-]+\{([^}]*)\}/)?.[1] ?? "";
    expect(wrapRule).not.toContain("border:4px");
    expect(wrapRule).not.toContain("background:#00ff00");
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
    // styles are class rules (so media queries can override them); every base rule caps at its container
    for (const m of html.matchAll(/\.bx-[A-Za-z0-9_-]+\{([^}]*)\}/g)) expect(m[1]).toContain("max-width:100%");
    expect(html).not.toMatch(/\sstyle="/); // no inline styles that a media query could never beat
    // the exported document body never scrolls horizontally
    const doc = renderPageDocument(createContainer("column", {} as Partial<BoxNode>), DEFAULT_THEME, "P");
    expect(doc).toContain("html,body{max-width:100%;overflow-x:hidden}");
  });

  it("RESPONSIVE EXPORT: per-device edits become @media rules (tablet ≤1024, mobile ≤480) that override base", () => {
    // a container whose background is re-styled per device — background serialises literally (easy to assert)
    const sec = createContainer("column", {
      id: "s1", background: "#ff0000",
      responsive: { tablet: { background: "#00ff00" }, mobile: { background: "#0000ff" } },
      children: [makeRowBand([createElement("text", { text: "x" } as Partial<BoxNode>)])],
    } as Partial<BoxNode>);
    const root = createContainer("column", { id: "r", children: [sec] } as Partial<BoxNode>);
    const doc = renderPageDocument(root, DEFAULT_THEME, "P");
    expect(doc).toContain("@media (max-width:1024px)"); // tablet block present
    expect(doc).toContain("@media (max-width:480px)");  // mobile block present
    expect(doc).toMatch(/\.bx-s1\{[^}]*background-color:#ff0000/); // base = red
    // pull out each media block and confirm the per-device override lands in the right one, scoped to .bx-s1
    const tabletBlock = doc.match(/@media \(max-width:1024px\)\{(.*?)\}\}/s)?.[1] ?? "";
    const mobileBlock = doc.match(/@media \(max-width:480px\)\{(.*?)\}\}/s)?.[1] ?? "";
    expect(tabletBlock).toMatch(/\.bx-s1\{[^}]*background-color:#00ff00/); // tablet = green
    expect(mobileBlock).toMatch(/\.bx-s1\{[^}]*background-color:#0000ff/); // mobile = blue
  });

  it('STACK on narrow: a floating box drops to full-width flow on mobile (never clips or exceeds its parent)', () => {
    const floated = createContainer("column", {
      id: "f", position: "absolute", left: 10, top: 40, width: "50%", height: "300px",
      children: [makeRowBand([createElement("text", { text: "hi" } as Partial<BoxNode>)])],
    } as unknown as Partial<BoxNode>);
    const root = createContainer("column", { id: "r", children: [floated] } as Partial<BoxNode>);
    const doc = renderPageDocument(root, DEFAULT_THEME, "P");
    // base: the float is absolutely positioned; parent reserves height so it stays contained on desktop
    expect(doc).toMatch(/\.bx-f\{[^}]*position:absolute/);
    expect(doc).toMatch(/\.bx-r\{[^}]*min-height:5\d\dpx/); // parent reserves ≈300/(1−0.40)=500px on desktop
    // mobile: it becomes relative, full-width, auto-height — and the parent drops its reserve (min-height:auto).
    // (base .bx-f is position:absolute, so a position:relative rule can only be the mobile stack override.)
    const mobileBlock = doc.match(/@media \(max-width:480px\)\{(.*?)\}\}/s)?.[1] ?? "";
    expect(mobileBlock).toMatch(/\.bx-f\{[^}]*position:relative/);
    expect(mobileBlock).toMatch(/\.bx-f\{[^}]*width:100%/);
    expect(mobileBlock).toMatch(/\.bx-f\{[^}]*height:auto/);
    expect(mobileBlock).toMatch(/\.bx-r\{[^}]*min-height:auto/);
  });

  it("a float the user PINNED on mobile (explicit position) is NOT auto-stacked", () => {
    const floated = createContainer("column", {
      id: "f", position: "absolute", left: 10, top: 40, width: "50%", height: "300px",
      responsive: { mobile: { top: 5 } }, // user deliberately repositioned it on mobile
    } as unknown as Partial<BoxNode>);
    const root = createContainer("column", { id: "r", children: [floated] } as Partial<BoxNode>);
    const doc = renderPageDocument(root, DEFAULT_THEME, "P");
    // it stays floating on mobile — no forced position:relative / width:100% stack
    expect(doc).not.toMatch(/@media \(max-width:480px\)\{[^}]*\.bx-f\{[^}]*position:relative/);
  });

  it("PREVIEW pins base to about:srcdoc so nav links scroll instead of reloading the app; DOWNLOAD does not", () => {
    const site = siteFromRoot(emptyPageRoot(), "Home");
    // preview variant (srcdoc iframe): base is pinned so `#home` stays an in-page fragment
    expect(renderSiteHTML(site, DEFAULT_THEME, { preview: true })).toContain('<base href="about:srcdoc">');
    // standalone download: NO srcdoc base (its own file URL is the correct base for the real file)
    expect(renderSiteHTML(site, DEFAULT_THEME)).not.toContain("about:srcdoc");
    // the nav link itself is still a same-document hash
    expect(renderSiteHTML(site, DEFAULT_THEME, { preview: true })).toContain('href="#home"');
  });

  it("downloadHTML is a safe no-op when the DOM/URL APIs are unavailable", () => {
    expect(() => downloadHTML("<html></html>")).not.toThrow();
  });
});
