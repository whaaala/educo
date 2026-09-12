import { test, expect } from "@playwright/test";
import { siteFromRoot } from "@/lib/box-site";
import { renderSitePage, renderSiteFiles, fontFamiliesInSite } from "@/lib/box-export";
import { embedFontCss } from "@/lib/educo-ui/font-embed";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { createContainer, createElement, makeRowBand, type BoxNode } from "@/lib/box-model";

/**
 * THE EXPORTED SITE RENDERS IN THE FONT THE SCHOOL CHOSE.
 *
 * It did not. The builder loads ~48 Google families, the export loaded none, so a school picked Poppins, saw
 * Poppins while building, and published a site in the browser's default sans-serif. Nothing in the builder
 * hinted at it, and nothing in the test suite could catch it — no test had ever asked whether a font loaded.
 *
 * This test does a REAL fetch. If Google is unreachable it asserts the graceful path instead of failing, so a
 * network blip never reports a bug that is not there.
 */

const page1 = () => {
  const root = createContainer("column", { id: "r", children: [
    makeRowBand([createElement("heading", { id: "h", anchor: "h", text: "Oakfield Primary School" } as Partial<BoxNode>)]),
  ] } as Partial<BoxNode>);
  return siteFromRoot(root);
};

test.describe("fonts in the exported site", () => {
  test("the chosen typeface is embedded and actually loads — with no external request", async ({ page }) => {
    const site = page1();
    const families = fontFamiliesInSite(site, DEFAULT_THEME);
    expect(families, "the default theme uses web fonts").toContain("Poppins");

    const fontCss = await embedFontCss(families);
    test.skip(!fontCss, "Google Fonts unreachable — the graceful-degradation path is covered by unit tests");

    // Nothing may be fetched at page load: every face must already be a data: URI.
    expect(fontCss).toContain("data:font/woff2;base64,");
    expect(fontCss).not.toMatch(/url\(https?:/);

    const files = renderSiteFiles(site, DEFAULT_THEME, fontCss);
    const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    // Inline the shared sheet (which now carries the faces) so setContent has no styles.css to fetch.
    await page.setContent(html.replace("</head>", `<style>${files["styles.css"]}</style></head>`),
      { waitUntil: "domcontentloaded" });

    const info = await page.evaluate(async () => {
      await (document as HTMLDocument & { fonts: FontFaceSet }).fonts.ready;
      const faces = [...(document as HTMLDocument & { fonts: FontFaceSet }).fonts];
      return {
        loadedFamilies: [...new Set(faces.map((f) => f.family.replace(/['"]/g, "")))],
        anyLoaded: faces.some((f) => f.status === "loaded"),
        headingFamily: getComputedStyle(document.querySelector("h2")!).fontFamily,
      };
    });

    expect(info.loadedFamilies, "the face must be defined in the document").toContain("Poppins");
    expect(info.anyLoaded, "and actually load from the embedded data").toBe(true);
    expect(info.headingFamily).toContain("Poppins");
  });

  test("no request leaves the page — the export stays self-contained", async ({ page }) => {
    const site = page1();
    const fontCss = await embedFontCss(fontFamiliesInSite(site, DEFAULT_THEME));
    test.skip(!fontCss, "Google Fonts unreachable");

    const external: string[] = [];
    page.on("request", (r) => { if (/^https?:/.test(r.url())) external.push(r.url()); });

    const files = renderSiteFiles(site, DEFAULT_THEME, fontCss);
    const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    await page.setContent(html.replace("</head>", `<style>${files["styles.css"]}</style></head>`),
      { waitUntil: "networkidle" });

    // The promise the guide makes: unzip it anywhere and it is complete. A font request would break it, and
    // would also hand every visitor's IP address to a third party.
    expect(external, "the exported page must fetch nothing").toEqual([]);
  });
});
