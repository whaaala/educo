import { test, expect } from "@playwright/test";
import type { BoxNode } from "@/lib/box-model";
import { siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * ADVANCED CSS ON A PLAIN BLOCK — canvas = export.
 *
 * The canvas used to apply Advanced CSS only inside the component branches (accordion, alert, registry). On a
 * section, heading or text it did nothing while you edited and then appeared on the published site: the worst
 * shape of this bug, because the builder tells you the change did not work.
 */

const CSS = "padding: var(--eu-gap-section); letter-spacing: 0.2em;";

const measure = (sel: string) => (page: import("@playwright/test").Page) =>
  page.locator(sel).evaluate((el) => {
    const c = getComputedStyle(el);
    return { padding: Math.round(parseFloat(c.paddingTop)), tracking: c.letterSpacing };
  });

test.describe("Advanced CSS on a plain block", () => {
  test("the EXPORT applies it", async ({ page }) => {
    const root = { id: "root", type: "container", direction: "column", children: [
      { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", children: [
        { id: "sec", anchor: "sec", type: "container", direction: "column", width: "fill", advancedCss: CSS,
          children: [{ id: "t", type: "text", text: "Term dates" }] },
      ] },
    ] } as unknown as BoxNode;
    const site = siteFromRoot(root);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.setContent(renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }),
      { waitUntil: "domcontentloaded" });
    const m = await measure("#sec")(page);
    expect(m.padding, "the token must resolve, not fall back to 0").toBeGreaterThan(20);
    expect(m.tracking).not.toBe("normal");
  });

  test("the CANVAS applies it too, and to the same value", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/website/box-demo");
    await page.evaluate((css) => {
      const site = { homeId: "p1", pages: [{ id: "p1", name: "Home", path: "/", root: {
        id: "root", type: "container", direction: "column", children: [
          { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", children: [
            { id: "sec", type: "container", direction: "column", width: "fill", advancedCss: css,
              children: [{ id: "t", type: "text", text: "Term dates" }] },
          ] },
        ] } }] };
      localStorage.setItem("educo_box_site_v1", JSON.stringify(site));
      localStorage.setItem("educo_box_site_cleaned_v1", "1");
    }, CSS);
    await page.reload();
    await page.waitForSelector('[data-box-id="sec"]', { timeout: 20000 });

    const m = await measure('[data-box-id="sec"]')(page);
    expect(m.padding, "Advanced CSS must apply while editing, not only once published").toBeGreaterThan(20);
    expect(m.tracking).not.toBe("normal");

    // And it must resolve to the SAME number the token computes to here — proving the var resolved rather
    // than the padding coming from somewhere else.
    const expected = await page.evaluate(() => {
      const root = document.querySelector(".eu-tokens") as HTMLElement;
      const d = document.createElement("div");
      d.style.cssText = "position:absolute;visibility:hidden;width:var(--eu-gap-section)";
      root.appendChild(d);
      const w = d.getBoundingClientRect().width;
      d.remove();
      return Math.round(w);
    });
    expect(Math.abs(m.padding - expected)).toBeLessThanOrEqual(1);
  });
});
