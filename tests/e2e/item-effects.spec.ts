import { test, expect } from "@playwright/test";
import type { BoxNode } from "@/lib/box-model";
import { siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * AN ITEM REACTS AND ARRIVES ON ITS OWN — canvas = export, measured in a browser.
 *
 * The unit tests assert what the CSS says. Only a browser can answer whether hovering one accordion row moves
 * that row and leaves its neighbour alone, and whether the builder does the same thing the published page
 * does. That last part is where every interaction bug in this project has lived.
 *
 * See tests/features/components/website/box-builder-item-effects.feature.
 */

const rows = (patch: Record<string, unknown>) => [
  { id: "one", title: "First question", body: "First answer.", ...patch },
  { id: "two", title: "Second question", body: "Second answer." },
];

const accordionTree = (itemPatch: Record<string, unknown>, nodePatch: Record<string, unknown> = {}): BoxNode => ({
  id: "root", type: "container", direction: "column", children: [
    { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", children: [
      { id: "sec", type: "container", direction: "column", width: "fill", padding: 0, children: [
        { id: "acc", type: "component", component: "accordion", width: "fill",
          items: rows(itemPatch), ...nodePatch },
      ] },
    ] },
  ],
} as unknown as BoxNode);

/** Open the exported page for a tree. */
async function openExport(page: import("@playwright/test").Page, root: BoxNode) {
  const site = siteFromRoot(root);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.setContent(renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }),
    { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".eu-accordion__item");
}

/** Seed the builder with a tree and open the canvas on it. */
async function openCanvas(page: import("@playwright/test").Page, root: BoxNode) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/website/box-demo");
  await page.evaluate((tree) => {
    localStorage.setItem("educo_box_site_v1", JSON.stringify({
      homeId: "p1", pages: [{ id: "p1", name: "Home", path: "/", root: tree }],
    }));
    localStorage.setItem("educo_box_site_cleaned_v1", "1");
  }, root as unknown as Record<string, unknown>);
  await page.reload();
  await page.waitForSelector('[data-box-id="root"]', { timeout: 30000 });
  await page.waitForSelector('[data-box-id="acc"] .eu-accordion__item', { timeout: 20000 });
}

/** The row's vertical offset — "Lift" is a translateY, so this is what moves. */
const topOf = (page: import("@playwright/test").Page, nth: number) =>
  page.locator(".eu-accordion__item").nth(nth).evaluate((el) => Math.round(el.getBoundingClientRect().top));

test.describe("one item's own hover", () => {
  test("the EXPORT moves the hovered row and leaves its neighbour alone", async ({ page }) => {
    await openExport(page, accordionTree({ hoverEffect: "lift" }));

    const restedFirst = await topOf(page, 0);
    const restedSecond = await topOf(page, 1);

    await page.locator(".eu-accordion__item").first().hover();
    await page.waitForTimeout(260); // let the transition settle

    const liftedFirst = await topOf(page, 0);
    expect(liftedFirst, "the hovered row lifts").toBeLessThan(restedFirst);
    // The whole point of a per-ITEM effect: the row next to it does not move.
    expect(await topOf(page, 1), "its neighbour must not move").toBe(restedSecond);
  });

  test("the CANVAS does the same, which is the promise the builder makes", async ({ page }) => {
    await openCanvas(page, accordionTree({ hoverEffect: "lift" }));

    const rested = await topOf(page, 0);
    await page.locator(".eu-accordion__item").first().hover();
    await page.waitForTimeout(260);

    expect(await topOf(page, 0), "an effect that only works once published is a bug, not a feature")
      .toBeLessThan(rested);
  });

  test("a row with NO effect does not move when hovered", async ({ page }) => {
    await openExport(page, accordionTree({}));
    const rested = await topOf(page, 0);
    await page.locator(".eu-accordion__item").first().hover();
    await page.waitForTimeout(260);
    expect(await topOf(page, 0)).toBe(rested);
  });
});

test.describe("one item's own entrance", () => {
  test("it settles at its natural place — a reveal must never leave content hidden", async ({ page }) => {
    await openExport(page, accordionTree({ revealEffect: "rise" }));
    await page.waitForTimeout(900); // longer than --eu-dur-slow

    const settled = await page.locator(".eu-accordion__item").first().evaluate((el) => {
      const c = getComputedStyle(el);
      return { opacity: Number(c.opacity), transform: c.transform };
    });
    expect(settled.opacity, "fully opaque once it has arrived").toBe(1);
    expect(["none", "matrix(1, 0, 0, 1, 0, 0)"], "and unmoved").toContain(settled.transform);
  });
});

test.describe("stagger reaches the rows", () => {
  test("each row starts a beat after the one before it", async ({ page }) => {
    await openExport(page, accordionTree({}, { revealEffect: "rise", revealStagger: true }));

    const delays = await page.locator(".eu-accordion__item").evaluateAll(
      (els) => els.map((el) => getComputedStyle(el).animationDelay));
    expect(delays[0], "the first row arrives immediately").toBe("0s");
    expect(delays[1], "the second waits a beat").toBe("0.09s");
  });

  test("the component itself is NOT what animates", async ({ page }) => {
    // The bug: `scope > *` matched the block wrapper's children — a <style> tag and the whole accordion — so
    // ticking "one after another" animated the component as one lump and gave an invisible tag the first beat.
    await openExport(page, accordionTree({}, { revealEffect: "rise", revealStagger: true }));

    const accordionAnim = await page.locator(".eu-accordion").first()
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(accordionAnim, "the accordion as a whole must not animate").toBe("none");

    const rowAnim = await page.locator(".eu-accordion__item").first()
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(rowAnim, "the rows are what arrive").toBe("eu-reveal-rise");
  });
});
