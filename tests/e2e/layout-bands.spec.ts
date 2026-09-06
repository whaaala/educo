import { test, expect, type Page } from "@playwright/test";
import { normalizeRowBands, type BoxNode } from "@/lib/box-model";
import { siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { RUNG_PX, RUNG_MEASURE } from "@/lib/educo-ui/layout";

/**
 * BAND OR CONTAINED — measured in a browser, because this is a claim about geometry.
 *
 * The unit tests prove the right classes are emitted. Only a browser can prove the thing that actually matters:
 * that a contained band still paints its background edge to edge while its content sits on the page's measure.
 * That combination is the most common section on a school site and the builder could not express it at all.
 */

const bandPage = (sectionWidth?: string) => {
  const root = {
    id: "root", type: "container", direction: "column",
    children: [{
      id: "band", anchor: "band", type: "container", direction: "row", rowBand: true, width: "fill",
      background: "#3355ff", sectionWidth,
      children: [{ id: "inner", anchor: "inner", type: "container", direction: "column", width: "fill",
        children: [{ id: "t", type: "text", text: "Welcome to Oakfield Primary" }] }],
    }],
  } as unknown as BoxNode;
  const site = siteFromRoot(root);
  return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
};

const load = async (page: Page, sectionWidth?: string) => {
  await page.setContent(bandPage(sectionWidth), { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#band", { state: "attached", timeout: 10_000 });
};

const box = (page: Page, sel: string) =>
  page.locator(sel).evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { left: r.left, right: r.right, width: r.width };
  });

test.describe("bands", () => {
  test("an edge-to-edge band spans the page, and so does its content", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await load(page);
    const band = await box(page, "#band");
    const inner = await box(page, "#inner");
    expect(band.width).toBeGreaterThan(1400);
    expect(inner.width, "nothing insets it — this is the default and the old behaviour").toBeGreaterThan(1400);
  });

  test("a CONTAINED band keeps its background full-bleed but insets its content", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await load(page, "contained");
    const band = await box(page, "#band");
    const inner = await box(page, "#inner");

    // The band itself still spans — that is what makes the background full-bleed.
    expect(band.width, "the background must still run edge to edge").toBeGreaterThan(1400);
    // …and it is genuinely painted, not merely wide.
    const bg = await page.locator("#band").evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe("rgba(0, 0, 0, 0)");

    // The content sits on the measure for this rung (1440px → the desktop rung).
    const measure = parseFloat(RUNG_MEASURE.desktop!) * 16;
    expect(inner.width).toBeLessThan(band.width);
    expect(Math.abs(inner.width - measure), `content should sit on the ${RUNG_MEASURE.desktop} measure`).toBeLessThan(2);

    // And it is CENTRED: equal air either side, or it reads as a mistake rather than a column.
    expect(Math.abs((inner.left - band.left) - (band.right - inner.right))).toBeLessThan(2);
  });

  test("the measure steps up one rung at a time", async ({ page }) => {
    // Asserts the column equals THIS rung's measure. An earlier version only checked the numbers increased,
    // which they do when nothing is contained at all — it passed against a completely broken layout.
    for (const rung of ["tabletPortrait", "tabletLandscape", "desktop"] as const) {
      const viewport = RUNG_PX[rung] + 120;
      await page.setViewportSize({ width: viewport, height: 900 });
      await load(page, "contained");
      const inner = (await box(page, "#inner")).width;
      const measure = parseFloat(RUNG_MEASURE[rung]!) * 16;
      expect(inner, `${rung}: the column must be capped, not the viewport`).toBeLessThan(viewport - 10);
      expect(Math.abs(inner - measure), `${rung} should sit on ${RUNG_MEASURE[rung]}`).toBeLessThan(2);
    }
  });

  test("on a phone the content keeps the page gutter and never touches the edge", async ({ page }) => {
    // The failure this guards: (100% - measure)/2 goes NEGATIVE below the measure, so without the max() the
    // text would run into the edge of the screen — worse than having no container at all.
    await page.setViewportSize({ width: 375, height: 812 });
    await load(page, "contained");
    const band = await box(page, "#band");
    const inner = await box(page, "#inner");
    expect(inner.left - band.left, "there must still be a gutter").toBeGreaterThanOrEqual(8);
    expect(inner.width).toBeLessThan(band.width);
  });

  test("the CANVAS contains the band exactly as the export does — canvas = export", async ({ page }) => {
    // The half that keeps breaking. The canvas renders React nodes, so it needs the layout layer injected
    // under its own root class; without that the band was contained in the published site and full-bleed
    // while you were editing it, and every class name would still have looked correct.
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto("/website/box-demo");
    await page.evaluate(() => {
      const site = { homeId: "p1", pages: [{ id: "p1", name: "Home", path: "/", root: {
        id: "root", type: "container", direction: "column", children: [{
          id: "band", type: "container", direction: "row", rowBand: true, width: "fill",
          background: "#3355ff", sectionWidth: "contained",
          children: [{ id: "inner", type: "container", direction: "column", width: "fill",
            children: [{ id: "t", type: "text", text: "Welcome to Oakfield Primary" }] }],
        }],
      } }] };
      localStorage.setItem("educo_box_site_v1", JSON.stringify(site));
      localStorage.setItem("educo_box_site_cleaned_v1", "1");
    });
    await page.reload();
    await page.waitForSelector('[data-box-id="band"]', { timeout: 20000 });

    const cls = (await page.locator('[data-box-id="band"]').getAttribute("class")) ?? "";
    expect(cls, "the canvas band must carry the layout classes").toContain("eu-band--contained");

    // Not a comparison of WIDTHS or of ratios: the canvas frame is deliberately narrower than the viewport, so
    // the same correct rule yields a different inset in each. What must match is the RULE — the band's padding
    // is max(page gutter, half the leftover beside the measure), evaluated against whatever width it has.
    const m = await page.evaluate(() => {
      const band = document.querySelector('[data-box-id="band"]') as HTMLElement;
      const inner = document.querySelector('[data-box-id="inner"]') as HTMLElement;
      const cs = getComputedStyle(band);
      const rootEl = document.querySelector(".eu-tokens") as HTMLElement;
      // The gutter is a clamp(), so its token text cannot be parsed as a number — give it to a probe element
      // and let the browser resolve it to px, which is the value the rule is actually using.
      const probe = document.createElement("div");
      probe.style.cssText = "position:absolute;visibility:hidden;width:var(--eu-gutter-page)";
      rootEl.appendChild(probe);
      const gutter = probe.getBoundingClientRect().width;
      probe.remove();
      return {
        bandW: band.getBoundingClientRect().width,
        innerW: inner.getBoundingClientRect().width,
        padL: parseFloat(cs.paddingLeft),
        padR: parseFloat(cs.paddingRight),
        gutter,
        measure: parseFloat(getComputedStyle(rootEl).getPropertyValue("--eu-measure")) * 16,
      };
    });

    expect(m.innerW, "the builder must inset the content, not run it edge to edge").toBeLessThan(m.bandW);
    expect(m.padL, "and inset it evenly").toBeCloseTo(m.padR, 0);
    const expected = Math.max(m.gutter, (m.bandW - m.measure) / 2);
    expect(Math.abs(m.padL - expected), "the canvas must apply the SAME rule the export does").toBeLessThan(2);
  });

  test("REGRESSION: a component's internal wrappers are not page sections", async ({ page }) => {
    // A Card is a container, and normalizeRowBands wraps the children of every container in a row band — so a
    // Card's image, heading, body and button each sit in one. They are structural plumbing, not sections of the
    // page, and marking them as bands put four page-wide band elements inside every card on every page.
    const card = {
      id: "card", anchor: "card", type: "container", direction: "column", width: "fill", children: [
        { id: "ci", type: "heading", text: "Open evening" },
        { id: "cb", type: "text", text: "Thursday 12 March, 6pm." },
      ],
    };
    // normalizeRowBands is what CREATES the inner bands, and it is what the builder runs on every edit. Without
    // it this tree keeps the single band written above, there is nothing to mis-mark, and the test passes
    // whether the bug is present or not — which is exactly what it did until a mutation run exposed it.
    const root = normalizeRowBands({ id: "root", type: "container", direction: "column", children: [
      { id: "sec", type: "container", direction: "row", rowBand: true, width: "fill", children: [card] },
    ] } as unknown as BoxNode, 0);
    const site = siteFromRoot(root);
    await page.setContent(renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }),
      { waitUntil: "domcontentloaded" });

    const inside = await page.locator("#card").evaluate((el) => el.querySelectorAll(".eu-band").length);
    expect(inside, "no band markup may appear inside a component").toBe(0);
    const total = await page.evaluate(() => document.querySelectorAll(".eu-band").length);
    expect(total, "exactly one band on the page: the section itself").toBe(1);
  });

  test("no band, contained or not, makes the page scroll sideways", async ({ page }) => {
    for (const w of [375, 768, 1024, 1280, 1920]) {
      for (const kind of [undefined, "contained"]) {
        await page.setViewportSize({ width: w, height: 900 });
        await load(page, kind);
        const overflow = await page.evaluate(() =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${kind ?? "band"} at ${w}px`).toBeLessThanOrEqual(1);
      }
    }
  });
});
