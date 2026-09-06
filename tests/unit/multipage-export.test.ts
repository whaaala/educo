import { describe, it, expect } from "vitest";
import { renderSiteFiles, renderSitePage, fileNameFor, siteFileMap, SHARED_STYLESHEET } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import type { BoxSite } from "@/lib/box-site";
import type { BoxNode } from "@/lib/box-model";

/**
 * THE MULTI-PAGE EXPORT.
 *
 * The old exporter put every page in one document as a `<section id="slug">`, linked by `#fragment`. That cost
 * the things a school actually needs — findable pages, linkable pages, a page that prints on its own — so the
 * export now emits real files. These assert the properties a school depends on, not the implementation.
 */

const page = (id: string, name: string, path: string, children: unknown[] = []) => ({
  id, name, path,
  root: { id: `root-${id}`, type: "container", direction: "column", children } as unknown as BoxNode,
});

const site = (): BoxSite => ({
  homeId: "p1",
  pages: [
    page("p1", "Home", "home", [
      { id: "lnk", type: "button", text: "Admissions", href: "page:p2" },
    ]),
    page("p2", "Admissions", "admissions"),
    page("p3", "Term Dates", "term-dates"),
  ],
} as unknown as BoxSite);

describe("multi-page export", () => {
  it("emits one file per page, plus one shared stylesheet", () => {
    const files = renderSiteFiles(site(), DEFAULT_THEME);
    expect(Object.keys(files).sort()).toEqual(
      ["admissions.html", "index.html", "styles.css", "term-dates.html"].sort(),
    );
  });

  it("the HOME page is index.html, so a plain folder or a static host just works", () => {
    expect(fileNameFor({ id: "p1", path: "home" }, "p1")).toBe("index.html");
    expect(fileNameFor({ id: "p2", path: "admissions" }, "p1")).toBe("admissions.html");
  });

  it("slugs are made safe, because a page name is typed by a person", () => {
    expect(fileNameFor({ id: "x", path: "Term Dates & Holidays!" }, "home")).toBe("term-dates---holidays-.html");
    expect(fileNameFor({ id: "x", path: "" }, "home"), "an empty path still yields a usable file").toBe("x.html");
  });

  it("a page: link resolves to a FILE, not a fragment", () => {
    const files = renderSiteFiles(site(), DEFAULT_THEME);
    expect(files["index.html"]).toContain('href="admissions.html"');
    expect(files["index.html"], "no fragment links between pages any more").not.toContain('href="#admissions"');
  });

  it("every link is RELATIVE, so the export opens from a folder or a USB stick", () => {
    const files = renderSiteFiles(site(), DEFAULT_THEME);
    for (const [name, html] of Object.entries(files)) {
      if (!name.endsWith(".html")) continue;
      // A root-absolute href would 404 anywhere but the domain root.
      expect(html, `${name} must not use root-absolute links`).not.toMatch(/href="\/[a-z]/i);
    }
  });

  it("the nav appears on EVERY page and marks where the visitor is", () => {
    const files = renderSiteFiles(site(), DEFAULT_THEME);
    for (const name of ["index.html", "admissions.html", "term-dates.html"]) {
      expect(files[name], `${name} needs the nav`).toContain('class="eu-site-nav"');
      // aria-current is the only thing telling a screen-reader user which page they are on
      expect(files[name].match(/aria-current="page"/g)?.length, `${name}: exactly one current link`).toBe(1);
    }
    expect(files["admissions.html"]).toMatch(/<a href="admissions\.html" aria-current="page">/);
  });

  it("each page carries its OWN title — this is what search engines index", () => {
    const files = renderSiteFiles(site(), DEFAULT_THEME);
    expect(files["index.html"]).toContain("<title>Home</title>");
    expect(files["admissions.html"]).toContain("<title>Admissions</title>");
    expect(files["term-dates.html"]).toContain("<title>Term Dates</title>");
  });

  it("the SHARED sheet holds what every page needs, and only that", () => {
    const files = renderSiteFiles(site(), DEFAULT_THEME);
    for (const name of ["index.html", "admissions.html"]) {
      expect(files[name]).toContain(`<link rel="stylesheet" href="${SHARED_STYLESHEET}">`);
    }
    // tokens and the base layer are identical on every page, so they cache
    expect(files["styles.css"]).toContain("--eu-color-primary-500:#");
    expect(files["styles.css"]).toContain(".eu-band");
    // the component library is NOT here — 65 KB of which a page uses a fraction
    expect(files["styles.css"]).not.toContain(".eu-accordion__header");
  });

  it("a page carries only the component CSS it actually uses", () => {
    // The saving that justifies the split: a page of text and a table has no business shipping the accordion,
    // the alert, the rating and every form control.
    const withAlert: BoxSite = {
      homeId: "p1",
      pages: [page("p1", "Home", "home", [
        { id: "al", type: "component", component: "alert", alertSeverity: "info",
          items: [{ id: "i1", title: "Heads up", body: "A message." }] },
      ])],
    } as unknown as BoxSite;

    const rich = renderSiteFiles(withAlert, DEFAULT_THEME)["index.html"];
    const plain = renderSiteFiles(site(), DEFAULT_THEME)["term-dates.html"];

    expect(rich, "a page WITH an alert must carry the alert's rules").toContain(".eu-alert");
    expect(plain, "a page WITHOUT one must not").not.toContain(".eu-alert--solid");
    expect(plain.length, "so the plain page is meaningfully smaller").toBeLessThan(rich.length);
  });

  it("a page contains only its own content", () => {
    const files = renderSiteFiles(site(), DEFAULT_THEME);
    // The whole point: reading Term Dates must not download Admissions.
    expect(files["term-dates.html"]).not.toContain("root-p2");
    expect(files["index.html"]).not.toContain("root-p3");
  });

  it("the page map is keyed by id and holds finished filenames", () => {
    const m = siteFileMap(site());
    expect(m.get("p1")).toBe("index.html");
    expect(m.get("p2")).toBe("admissions.html");
  });

  describe("prefetching the rest of the site", () => {
    it("fetches the sibling pages while the browser is idle, so the next click is instant", () => {
      const home = renderSiteFiles(site(), DEFAULT_THEME)["index.html"];
      expect(home).toContain('<link rel="prefetch" href="admissions.html">');
      expect(home).toContain('<link rel="prefetch" href="term-dates.html">');
    });

    it("never prefetches the page the visitor is already reading", () => {
      const files = renderSiteFiles(site(), DEFAULT_THEME);
      expect(files["index.html"]).not.toContain('prefetch" href="index.html"');
      expect(files["admissions.html"]).not.toContain('prefetch" href="admissions.html"');
    });

    it("uses a <link>, because rel=prefetch on an <a> does nothing at all", () => {
      // The plan said to put it on the nav anchors. No browser acts on that — it would have looked shipped
      // and changed nothing. This asserts the form that actually works.
      const home = renderSiteFiles(site(), DEFAULT_THEME)["index.html"];
      expect(home).not.toMatch(/<a[^>]*rel="prefetch"/);
      expect(home.slice(0, home.indexOf("</head>"))).toContain('rel="prefetch"');
    });

    it("stays out of the PREVIEW, which has no base URL to resolve a filename against", () => {
      // Inside a srcdoc iframe every one of these would resolve to nothing and log a failed request per page
      // — noise that reports a bug where there is none.
      expect(renderSitePage(site(), DEFAULT_THEME, "p1", { inlineShared: true })).not.toContain('rel="prefetch"');
    });
  });
});
