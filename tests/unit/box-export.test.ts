import { describe, it, expect } from "vitest";
import { createContainer, createElement, createComponent, makeRowBand, type BoxNode } from "@/lib/box-model";
import { siteFromRoot, emptyPageRoot } from "@/lib/box-site";
import { styleString, renderPageHTML, renderSiteFiles, renderSitePage, downloadSite } from "@/lib/box-export";
import { BREAKPOINTS_EM } from "@/lib/educo-ui/base";

/** The ladder, never a literal: a test that re-types `40em` stops testing the ladder the moment it moves. */
const atRungRe = (em: number) => new RegExp(`@media \\(min-width:${em}em\\)\\{(.*?)\\}\\}`, "s");

/** A single page as a finished document, through the shipping path. */
const pageDoc = (root: BoxNode, title = "Page") => {
  const site = siteFromRoot(root, title);
  return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
};
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

  it("background library exports self-contained: a gradient stays raw (no url()) and a pattern tiles", () => {
    const grad = createContainer("column", { id: "g", bgImage: "linear-gradient(135deg, #a, #b)",
      children: [makeRowBand([createElement("heading", { text: "x" } as Partial<BoxNode>)])] } as Partial<BoxNode>);
    const gHtml = renderPageHTML(grad, DEFAULT_THEME);
    expect(gHtml).toContain("linear-gradient(135deg, #a, #b)");
    expect(gHtml).not.toContain('url("linear-gradient'); // gradient is NOT wrapped in url()

    const pat = createContainer("column", { id: "p", bgImage: "radial-gradient(currentColor 1.5px, transparent 1.6px)", bgTile: "20px 20px",
      children: [makeRowBand([createElement("heading", { text: "x" } as Partial<BoxNode>)])] } as Partial<BoxNode>);
    const pHtml = renderPageHTML(pat, DEFAULT_THEME);
    expect(pHtml).toContain("background-size:20px 20px");
    expect(pHtml).toContain("background-repeat:repeat");
  });

  it("an EMPTY container that paints a background gets a visible min-height (so it isn't 0px in preview)", () => {
    const empty = createContainer("column", { id: "e", bgImage: "linear-gradient(90deg, #f00, #00f)", children: [] } as Partial<BoxNode>);
    expect(renderPageHTML(empty, DEFAULT_THEME)).toContain("min-height:8rem");
    // …but a container WITH content is left to size from its content (no forced band)
    const filled = createContainer("column", { id: "f", bgImage: "linear-gradient(90deg, #f00, #00f)",
      children: [makeRowBand([createElement("heading", { text: "x" } as Partial<BoxNode>)])] } as Partial<BoxNode>);
    expect(renderPageHTML(filled, DEFAULT_THEME)).not.toContain("min-height:8rem");
  });

  it("background fit options — size/position/repeat/attachment all export", () => {
    const n = createContainer("column", { id: "b", bgImage: "https://x/y.jpg", bgSize: "contain", bgPosition: "left top", bgRepeat: "repeat-x", bgAttach: "fixed",
      children: [makeRowBand([createElement("heading", { text: "x" } as Partial<BoxNode>)])] } as Partial<BoxNode>);
    const html = renderPageHTML(n, DEFAULT_THEME);
    expect(html).toContain("background-size:contain");
    expect(html).toContain("background-position:left top");
    expect(html).toContain("background-repeat:repeat-x");
    expect(html).toContain("background-attachment:fixed");
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

  it("the export is self-contained — the design system ships in the shared sheet, the page is scoped", () => {
    // Still self-contained, but SPLIT: the design system is identical on every page so it lives in styles.css
    // and caches once; only the page's own rules are inlined. Inlining it per page would repeat ~74 KB in
    // every file and defeat caching entirely.
    const site = siteFromRoot(emptyPageRoot(), "Home");
    const files = renderSiteFiles(site, DEFAULT_THEME);
    const html = files["index.html"];
    expect(html).toContain('<body class="eu-root">');  // scoped so styles never leak
    expect(html).toContain('<link rel="stylesheet" href="styles.css">');
    expect(files["styles.css"]).toContain("--eu-color-primary-500:#"); // tokens
    expect(files["styles.css"]).toContain(".eu-band");            // base
    // Components are NOT in the shared sheet: they are subsetted into each page, so a page ships only the
    // rules it uses. An empty page needs none of them.
    expect(files["styles.css"]).not.toContain(".eu-btn");
    expect(html).not.toMatch(/https?:\/\/[^"']*\.css/); // no external stylesheet links
  });

  it("a single page renders as a self-contained document", () => {
    const root = createContainer("column", { children: [makeRowBand([createElement("heading", { text: "Solo" } as Partial<BoxNode>)])] } as Partial<BoxNode>);
    const doc = pageDoc(root, "My Page");
    expect(doc).toContain("<!doctype html>");
    expect(doc).toContain("<title>My Page</title>");
    expect(doc).toContain('<body class="eu-root">');
    expect(doc).toContain("Solo");
  });

  it("renders an accordion component as native <details> with its variant class + items", () => {
    const acc = createComponent("accordion", {
      variant: "--panel",
      items: [
        { id: "i1", title: "Q one", body: "A one", meta: "$10", open: true },
        { id: "i2", title: "Q two", body: "A two" },
      ],
    } as Partial<BoxNode>);
    const root = createContainer("column", { children: [makeRowBand([acc])] } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    expect(html).toContain('class="eu-accordion eu-accordion--panel"');
    expect(html).toContain('<details class="eu-accordion__item" style="--eu-n:\'1\';--eu-n0:\'01\'" open');
    expect(html).toContain("--eu-n0:'02'");                     // 2nd item carries ordinal 02 (deterministic numbering)
    expect(html).toContain('<summary class="eu-accordion__header"><span class="eu-accordion__title">Q one');
    expect(html).toContain('<span class="eu-accordion__meta">$10</span>');
    expect(html).toContain('<div class="eu-accordion__body"><p>A two</p></div>');
    expect(html).toContain('name="acc-'); // single-open grouping by default
  });

  it("accordion is ZERO-JS by default, but 'Expand/Collapse all' adds opt-in controls + a scoped script", () => {
    const mk = (extra: Partial<BoxNode>) => createContainer("column", { id: "r", children: [makeRowBand([createComponent("accordion", { id: "acc", items: [{ id: "i1", title: "Q", body: "A" }], ...extra } as Partial<BoxNode>)])] } as Partial<BoxNode>);
    // OFF (default): no controls, no script
    const off = renderPageHTML(mk({}), DEFAULT_THEME);
    expect(off).not.toContain("data-eu-acc-all");
    expect(off).not.toContain("<script");
    // ON: two controls + a script scoped to THIS accordion's id
    const on = renderPageHTML(mk({ accShowAll: true }), DEFAULT_THEME);
    expect(on).toContain('data-eu-acc-all="open"');
    expect(on).toContain('data-eu-acc-all="close"');
    expect(on).toContain('id="eu-acc-acc"');
    expect(on).toContain("getElementById('eu-acc-acc')");
  });

  it("per-ITEM CSS can change ANY part of just that item (text, background, colour) and stays scoped + safe", () => {
    const acc = createComponent("accordion", { id: "acc", items: [
      // bare decl → the item; part blocks → that item's title/body/icon; a breakout attempt targeting the page.
      { id: "i1", title: "Q", body: "A", css: "background: #fef3c7; title { color: #b45309 } body { background: #fff7ed } icon { color: #f59e0b } html { display: none }" },
      { id: "i2", title: "Q2", body: "A2" },
    ] } as Partial<BoxNode>);
    const root = createContainer("column", { children: [makeRowBand([acc])] } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    expect(html).toContain('class="eu-accordion__item eu-acc-i-i1"');                         // scoping class on the item that has CSS
    expect(html).toContain(".eu-accordion .eu-acc-i-i1{background: #fef3c7 !important;}");     // bare decl → the item itself
    expect(html).toContain(".eu-accordion .eu-acc-i-i1 .eu-accordion__header{color: #b45309 !important;}"); // title text colour
    expect(html).toContain(".eu-accordion .eu-acc-i-i1 .eu-accordion__body{background: #fff7ed !important;}"); // body/answer background
    expect(html).toContain(".eu-accordion .eu-acc-i-i1 .eu-accordion__header::after{color: #f59e0b !important;}"); // the +/− icon colour
    expect(html).not.toContain("html {");                                                     // page-level breakout dropped (not a part)
    expect(html).not.toContain("eu-acc-i-i2");                                                // the untouched item gets no rule
  });

  it("split design: renders a media panel beside the items (safe url) and stacks via container query", () => {
    const acc = createComponent("accordion", { id: "acc", variant: "--split", accSplitMedia: "https://x.com/p.jpg", items: [{ id: "i1", title: "Q", body: "A" }] } as Partial<BoxNode>);
    const root = createContainer("column", { children: [makeRowBand([acc])] } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    expect(html).toContain("eu-accordion eu-accordion--split");
    expect(html).toContain(`<div class="eu-accordion__panel" style="background-image:url('https://x.com/p.jpg')"></div>`);
    // a non-http/js url is rejected (no background-image)
    const bad = createComponent("accordion", { id: "b", variant: "--split", accSplitMedia: "javascript:alert(1)", items: [{ id: "i1", title: "Q", body: "A" }] } as Partial<BoxNode>);
    expect(renderPageHTML(createContainer("column", { children: [makeRowBand([bad])] } as Partial<BoxNode>), DEFAULT_THEME)).toContain('<div class="eu-accordion__panel"></div>');
  });

  it("categories: a heading is emitted before the first item of each category group", () => {
    const acc = createComponent("accordion", { id: "acc", items: [
      { id: "i1", title: "A", body: "a", category: "Billing" },
      { id: "i2", title: "B", body: "b", category: "Billing" }, // same group → no second heading
      { id: "i3", title: "C", body: "c", category: "Shipping" }, // new group → heading
    ] } as Partial<BoxNode>);
    const root = createContainer("column", { children: [makeRowBand([acc])] } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    expect(html).toContain('<div class="eu-accordion__category">Billing</div>');
    expect(html).toContain('<div class="eu-accordion__category">Shipping</div>');
    expect((html.match(/eu-accordion__category">Billing/g) || []).length).toBe(1); // Billing heading once (grouped)
  });

  it("opt-in search: adds a filter box + a scoped filter script (accordion stays zero-JS otherwise)", () => {
    const mk = (extra: Partial<BoxNode>) => createContainer("column", { children: [makeRowBand([createComponent("accordion", { id: "acc", items: [{ id: "i1", title: "Q", body: "A" }], ...extra } as Partial<BoxNode>)])] } as Partial<BoxNode>);
    const off = renderPageHTML(mk({}), DEFAULT_THEME);
    expect(off).not.toContain("data-eu-acc-search");
    const on = renderPageHTML(mk({ accSearch: true }), DEFAULT_THEME);
    expect(on).toContain('class="eu-accordion__search"');
    expect(on).toContain('<input type="search" data-eu-acc-search');
    expect(on).toContain('class="eu-accordion__search-ico"');         // modern leading icon
    expect(on).toContain("data-eu-acc-empty");                        // no-results element
    expect(on).toContain('id="eu-acc-acc"');                          // accordion carries an id for the script
    expect(on).toContain("querySelector('[data-eu-acc-search]')");    // the scoped filter script
    expect(on).toContain(":scope > .eu-accordion__category");         // headings hidden while searching
  });

  it("nested sub-accordion: children render as an indented accordion inside the parent body", () => {
    const acc = createComponent("accordion", { id: "acc", items: [
      { id: "p", title: "Billing", body: "Overview.", children: [
        { id: "c1", title: "Refunds?", body: "Yes." }, { id: "c2", title: "Invoices?", body: "Monthly." },
      ] },
    ] } as Partial<BoxNode>);
    const root = createContainer("column", { children: [makeRowBand([acc])] } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    expect(html).toContain('<div class="eu-accordion eu-accordion--nested">');   // nested accordion inside the body
    expect(html).toContain('<span class="eu-accordion__title">Refunds?</span>');  // child rendered
    expect(html).toContain("<p>Monthly.</p>");                                     // child body is rich too
  });

  it("per-item icon renders inline SVG in the header (and the Icon block now exports too)", () => {
    const acc = createComponent("accordion", { id: "acc", items: [{ id: "i1", title: "Fast shipping", body: "…", icon: "Truck" }] } as Partial<BoxNode>);
    const root = createContainer("column", { children: [makeRowBand([acc])] } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    expect(html).toContain('<span class="eu-accordion__icon" aria-hidden="true"><svg'); // icon svg in the header
    expect(html).toContain('stroke="currentColor"');                                     // themeable (inherits colour)
    // the Icon block itself now exports an svg (was previously blank)
    const iconBlock = createContainer("column", { children: [makeRowBand([createElement("icon", { id: "ic", icon: "Star" } as Partial<BoxNode>)])] } as Partial<BoxNode>);
    expect(renderPageHTML(iconBlock, DEFAULT_THEME)).toContain("<svg");
  });

  it("rich body + FAQ SEO schema: markdown-lite renders to safe HTML, and FAQPage JSON-LD is opt-in", () => {
    const acc = createComponent("accordion", { id: "acc", accFaqSchema: true, items: [
      { id: "i1", title: "Do you ship?", body: "Yes — see [rates](https://x.com/r) and **note** the cutoff." },
    ] } as Partial<BoxNode>);
    const root = createContainer("column", { children: [makeRowBand([acc])] } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    expect(html).toContain('<a href="https://x.com/r" target="_blank" rel="noopener noreferrer">rates</a>'); // rich body link
    expect(html).toContain("<strong>note</strong>");
    expect(html).toContain('"@type":"FAQPage"');                    // JSON-LD present (opt-in)
    expect(html).toContain('"name":"Do you ship?"');
    expect(html).toContain('"text":"Yes — see rates and note the cutoff."'); // answer is PLAIN text in schema
    // schema off by default
    const off = createComponent("accordion", { id: "a2", items: [{ id: "x", title: "T", body: "B" }] } as Partial<BoxNode>);
    expect(renderPageHTML(createContainer("column", { children: [makeRowBand([off])] } as Partial<BoxNode>), DEFAULT_THEME)).not.toContain("FAQPage");
  });

  it("per-item deep-link: an item anchor becomes an id on its <details> + a hash-open script", () => {
    const acc = createComponent("accordion", { id: "acc", items: [
      { id: "i1", title: "Shipping", body: "…", anchor: "shipping" },
      { id: "i2", title: "Returns", body: "…" },
    ] } as Partial<BoxNode>);
    const root = createContainer("column", { children: [makeRowBand([acc])] } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    expect(html).toContain('id="shipping"');                                  // stable id on the item's <details>
    expect(html).toContain("closest('details.eu-accordion__item')");         // the deep-link open+scroll script
    expect(html).toContain("addEventListener('hashchange'");
    // no anchors → no script
    const plain = createComponent("accordion", { id: "a2", items: [{ id: "x", title: "T", body: "B" }] } as Partial<BoxNode>);
    const html2 = renderPageHTML(createContainer("column", { children: [makeRowBand([plain])] } as Partial<BoxNode>), DEFAULT_THEME);
    expect(html2).not.toContain("__euAccDeep");
  });

  it("multi-open accordion drops the shared name; token overrides + advanced CSS reach the wrapper", () => {
    const acc = createComponent("accordion", {
      accMultiOpen: true,
      tokenOverrides: { "--eu-color-brand": "#ff0088" },
      advancedCss: "letter-spacing: .04em; title { color: #fff } html { display: none } ; @import url(evil.css)",
      items: [{ id: "i1", title: "T", body: "B" }],
    } as Partial<BoxNode>);
    const root = createContainer("column", { children: [makeRowBand([acc])] } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    expect(html).not.toContain('name="acc-');                     // multi-open → no grouping
    expect(html).toContain("--eu-color-brand:#ff0088");           // token override inlined
    expect(html).toContain("letter-spacing: .04em !important;");             // safe bare declaration → the accordion box
    expect(html).toContain(".eu-accordion__header{color: #fff !important;}"); // `title{…}` restyles every item's header text
    expect(html).not.toContain("html {");                         // page-level breakout dropped (not a part)
    expect(html).not.toContain("@import");                        // at-rule stripped
  });

  it("applies component typography (font family + size) to the wrapper so it cascades into items", () => {
    const acc = createComponent("accordion", {
      fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, letterSpacing: 1,
      items: [{ id: "i1", title: "T", body: "B" }],
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
    const acc = createComponent("accordion", { items: [{ id: "i1", title: "<img src=x onerror=alert(1)>", body: "<b>x</b>" }] } as Partial<BoxNode>);
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
    const acc = createComponent("accordion", { fontFamily: '"Playfair Display", serif', items: [{ id: "i", title: "T", body: "B" }] } as Partial<BoxNode>);
    const sec = createContainer("column", { bgImage: "data:image/png;base64,AAAA", children: [makeRowBand([acc])] } as Partial<BoxNode>);
    const html = renderPageHTML(sec, DEFAULT_THEME);
    expect(html).toContain("&quot;Playfair Display&quot;");
    expect(html).toContain("background-image:url(&quot;data:image/png;base64,AAAA&quot;)");
    // every style attribute is closed properly (no stray unescaped quote inside a style="…")
    for (const m of html.matchAll(/style="([^"]*)"/g)) expect(m[1]).not.toContain('"');
  });

  it("Responsive Field Guide: no box overflows its container (max-width:100%) and the body can't scroll sideways", () => {
    const acc = createComponent("accordion", { width: "500px", items: [{ id: "i", title: "T", body: "B" }] } as Partial<BoxNode>);
    const root = createContainer("column", { children: [makeRowBand([acc])] } as Partial<BoxNode>);
    const html = renderPageHTML(root, DEFAULT_THEME);
    // styles are class rules (so media queries can override them); every base rule caps at its container
    for (const m of html.matchAll(/\.bx-[A-Za-z0-9_-]+\{([^}]*)\}/g)) expect(m[1]).toContain("max-width:100%");
    // No inline LAYOUT/paint styles a media query could never beat. CSS custom-property data vars (--eu-n ordinals) are exempt.
    for (const m of html.matchAll(/\sstyle="([^"]*)"/g))
      for (const decl of m[1].split(";").filter(Boolean)) expect(decl.trim().startsWith("--")).toBe(true);
    // the exported document body never scrolls horizontally
    const doc = pageDoc(createContainer("column", {} as Partial<BoxNode>), "P");
    expect(doc).toContain("html,body{max-width:100%;overflow-x:hidden}");
  });

  it("RESPONSIVE EXPORT is MOBILE-FIRST: the phone layout is the base rule and wider screens add to it", () => {
    // a container whose background is re-styled per device — background serialises literally (easy to assert)
    const sec = createContainer("column", {
      id: "s1", background: "#ff0000",
      responsive: { tablet: { background: "#00ff00" }, mobile: { background: "#0000ff" } },
      children: [makeRowBand([createElement("text", { text: "x" } as Partial<BoxNode>)])],
    } as Partial<BoxNode>);
    const root = createContainer("column", { id: "r", children: [sec] } as Partial<BoxNode>);
    const doc = pageDoc(root, "P");
    // Mobile-first: min-width queries, in em, on the documented ladder — never max-width, never px.
    expect(doc).toContain(`@media (min-width:${BREAKPOINTS_EM.tabletPortrait}em)`); // tablet and up
    expect(doc).toContain(`@media (min-width:${BREAKPOINTS_EM.desktop}em)`); // desktop and up
    expect(doc).not.toMatch(/@media \([^)]*max-width[^)]*\)/);
    expect(doc).not.toMatch(/@media \([^)]*\d+px\)/);
    // the BASE rule is the phone layout; each wider block adds only what changes at that width
    expect(doc).toMatch(/\.bx-s1\{[^}]*background-color:#0000ff/); // base = blue (mobile)
    const tabletBlock = doc.match(atRungRe(BREAKPOINTS_EM.tabletPortrait))?.[1] ?? "";
    const desktopBlock = doc.match(atRungRe(BREAKPOINTS_EM.desktop))?.[1] ?? "";
    expect(tabletBlock).toMatch(/\.bx-s1\{[^}]*background-color:#00ff00/); // tablet = green
    expect(desktopBlock).toMatch(/\.bx-s1\{[^}]*background-color:#ff0000/); // desktop = red
  });

  it('STACK on narrow is the BASE: a floating box is stacked by default and only floats from tablet up', () => {
    const floated = createContainer("column", {
      id: "f", position: "absolute", left: 10, top: 40, width: "50%", height: "300px",
      children: [makeRowBand([createElement("text", { text: "hi" } as Partial<BoxNode>)])],
    } as unknown as Partial<BoxNode>);
    const root = createContainer("column", { id: "r", children: [floated] } as Partial<BoxNode>);
    const doc = pageDoc(root, "P");
    // BASE = the phone layout: stacked, full-width, auto-height, and the parent reserves nothing.
    expect(doc).toMatch(/\.bx-f\{[^}]*position:relative/);
    expect(doc).toMatch(/\.bx-f\{[^}]*width:100%/);
    expect(doc).toMatch(/\.bx-f\{[^}]*height:auto/);
    // From tablet up it floats, and the parent reserves room for it — in rem, never px (field guide ②).
    const tabletBlock = doc.match(atRungRe(BREAKPOINTS_EM.tabletPortrait))?.[1] ?? "";
    expect(tabletBlock).toMatch(/\.bx-f\{[^}]*position:absolute/);
    expect(tabletBlock).toMatch(/\.bx-r\{[^}]*min-height:3\d(\.\d+)?rem/); // ≈500px / 16 = 31.25rem
  });

  it("a float the user PINNED on mobile (explicit position) is NOT auto-stacked", () => {
    const floated = createContainer("column", {
      id: "f", position: "absolute", left: 10, top: 40, width: "50%", height: "300px",
      responsive: { mobile: { top: 5 } }, // user deliberately repositioned it on mobile
    } as unknown as Partial<BoxNode>);
    const root = createContainer("column", { id: "r", children: [floated] } as Partial<BoxNode>);
    const doc = pageDoc(root, "P");
    // it stays floating on mobile — no forced position:relative / width:100% stack
    // Pinned: it stays absolutely positioned at EVERY width, so the base rule is not the stacked one.
    expect(doc).toMatch(/\.bx-f\{[^}]*position:absolute/);
    expect(doc).not.toMatch(/\.bx-f\{[^}]*position:relative/);
  });

  it("PREVIEW shows the real page — same links as the export, with the shared sheet inlined", () => {
    // The old preview put every page in one document and pinned <base> so `#home` stayed an in-page scroll.
    // There are no hash links between pages any more: preview renders the REAL file, and the builder
    // intercepts clicks on its nav. The one difference is that a srcdoc document has no styles.css to fetch,
    // so the shared sheet is inlined instead of linked.
    const site = siteFromRoot(emptyPageRoot(), "Home");
    const shipped = renderSiteFiles(site, DEFAULT_THEME)["index.html"];
    const previewed = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });

    expect(previewed).toContain("--eu-color-primary-500:#");        // inlined, because nothing can be fetched
    expect(previewed).not.toContain('<link rel="stylesheet"');
    expect(shipped).toContain('<link rel="stylesheet" href="styles.css">'); // linked, so it caches
    // the LINKS are identical — that is what makes the preview trustworthy
    expect(previewed).toContain('href="index.html"');
    expect(shipped).toContain('href="index.html"');
  });

  it("downloadSite is a safe no-op when the DOM/URL APIs are unavailable", () => {
    // It runs during SSR too, where there is no document to append a link to.
    expect(() => downloadSite({ "index.html": "<html></html>" })).not.toThrow();
  });
});
