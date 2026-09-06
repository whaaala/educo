import { test, expect } from "@playwright/test";
import type { BoxNode } from "@/lib/box-model";
import { siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { PAGE_Z_CEILING, CHROME_Z_FLOOR } from "@/lib/educo-ui/stacking";

/**
 * THE TWO LADDERS — proven the only way that counts: by asking the browser what is actually on top.
 *
 * The unit guards assert what the numbers are. They cannot tell you whether a teacher can still click the
 * button that deletes the block they just covered, and that is the whole failure: "Bring to front" was
 * `max + 1` with no ceiling, so a float raised enough times rendered ON TOP of its own resize handles and
 * toolbar — controls you cannot reach with the mouse, because the thing you must click is underneath.
 *
 * Every assertion here is a HIT TEST (`elementFromPoint`), never a reading of the CSS. A z-index that is
 * present and inert is the defect this project keeps meeting.
 *
 * See tests/features/components/website/box-builder-stacking.feature.
 */

/** A page with one block floated onto its own layer, carrying a deliberately absurd stacking order. */
const floatedTree = (zIndex: number): BoxNode => ({
  id: "root", type: "container", direction: "column", children: [
    { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", children: [
      { id: "sec", type: "container", direction: "column", width: "fill", padding: 24, minHeight: 400, children: [
        { id: "flow", type: "text", text: "Ordinary flow text", width: "100%" },
        { id: "float", type: "container", direction: "column", position: "absolute",
          left: 5, top: 5, width: "60%", height: "220px", clip: true, zIndex,
          background: "#dbeafe", padding: 16, children: [
            { id: "ftext", type: "text", text: "A floating card", width: "100%" },
          ] },
      ] },
    ] },
  ],
} as unknown as BoxNode);

/**
 * The builder route is compiled on first request, which took 35s on a cold dev server and 5s on every run
 * after — so the FIRST test in a file fails and the rest pass, which reads like a flaky assertion and is not
 * one. The navigation gets its own budget rather than borrowing the whole test's.
 */
const FIRST_COMPILE_MS = 90_000;

async function openCanvas(page: import("@playwright/test").Page, root: BoxNode) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/website/box-demo", { timeout: FIRST_COMPILE_MS });
  await page.evaluate((tree) => {
    localStorage.setItem("educo_box_site_v1", JSON.stringify({
      homeId: "p1", pages: [{ id: "p1", name: "Home", path: "/", root: tree }],
    }));
    localStorage.setItem("educo_box_site_cleaned_v1", "1");
  }, root as unknown as Record<string, unknown>);
  await page.reload();
  await page.waitForSelector('[data-box-id="root"]', { timeout: 30000 });
  await page.waitForSelector('[data-box-id="float"]', { timeout: 20000 });
}

// A test must be allowed to outlast that first compile, or the budget above has nowhere to spend.
test.beforeEach(({}, testInfo) => testInfo.setTimeout(FIRST_COMPILE_MS + 30_000));

/** What the browser says is actually on top at a point — the only honest answer. */
async function topmostAt(page: import("@playwright/test").Page, x: number, y: number): Promise<string> {
  return page.evaluate(([px, py]) => {
    const el = document.elementFromPoint(px as number, py as number);
    if (!el) return "(nothing)";
    // Report the nearest meaningful ancestor: a chrome role, or the block it belongs to.
    const chrome = el.closest('[role="toolbar"], [role="dialog"], [aria-label^="Resize"]');
    if (chrome) return `chrome:${chrome.getAttribute("aria-label") ?? chrome.getAttribute("role")}`;
    const block = el.closest("[data-box-id]");
    return block ? `block:${block.getAttribute("data-box-id")}` : "(other)";
  }, [x, y]);
}

test.describe("a page can never cover the editor", () => {
  test("a float with an absurd stacking order is still selectable, and its toolbar stays on top", async ({ page }) => {
    // 500,000 is what "Bring to front" used to be able to reach. It is stored on the node, so this is the
    // pasted / imported / hand-edited path as well as the button's.
    await openCanvas(page, floatedTree(500_000));

    const float = page.locator('[data-box-id="float"]');
    await float.click();

    // The block's own toolbar appears above or below it. It must be hittable — that is the recovery path.
    const bar = page.getByRole("toolbar", { name: "Block toolbar" });
    await expect(bar).toBeVisible();
    const box = await bar.boundingBox();
    expect(box, "the selected block must offer a toolbar").not.toBeNull();

    const hit = await topmostAt(page, box!.x + box!.width / 2, box!.y + box!.height / 2);
    expect(hit, "the toolbar must be the thing under the pointer, not the block it controls").toContain("chrome:");
  });

  test("the resize handles of a raised float are reachable", async ({ page }) => {
    await openCanvas(page, floatedTree(500_000));
    await page.locator('[data-box-id="float"]').click();

    const handle = page.locator('[aria-label^="Resize"]').first();
    await expect(handle).toBeVisible();
    const hb = await handle.boundingBox();
    expect(hb).not.toBeNull();

    const hit = await topmostAt(page, hb!.x + hb!.width / 2, hb!.y + hb!.height / 2);
    expect(hit, "a handle covered by the block it resizes cannot be grabbed").toContain("chrome:");
  });

  test("the blocks panel opens over a raised float", async ({ page }) => {
    await openCanvas(page, floatedTree(500_000));
    await page.getByLabel("Open blocks panel").click();

    const panel = page.getByRole("dialog", { name: "Blocks" });
    await expect(panel).toBeVisible();
    const pb = await panel.boundingBox();
    const hit = await topmostAt(page, pb!.x + pb!.width / 2, pb!.y + 40);
    expect(hit, "the palette must sit over the page, whatever the page asked for").toContain("chrome:");
  });
});

/**
 * The shape the bug actually takes.
 *
 * A block's toolbar and handles are rendered INSIDE that block's wrapper, so they always clear the block they
 * belong to — which is why "select a float, is its own toolbar on top?" passes whether the clamp exists or
 * not. The exposure is a NEIGHBOUR: a second float raised above the first covers the first's controls, and the
 * two floats are siblings in one stacking context where the chrome ladder has no say at all.
 */
const twoFloats = (overZ: number): BoxNode => ({
  id: "root", type: "container", direction: "column", children: [
    { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", children: [
      { id: "sec", type: "container", direction: "column", width: "fill", padding: 24, minHeight: 500, children: [
        { id: "flow", type: "text", text: "Ordinary flow text", width: "100%" },
        { id: "under", type: "container", direction: "column", position: "absolute",
          left: 5, top: 30, width: "40%", height: "160px", clip: true, zIndex: 2,
          background: "#dbeafe", padding: 16, children: [
            { id: "utext", type: "text", text: "The one being edited", width: "100%" },
          ] },
        { id: "over", type: "container", direction: "column", position: "absolute",
          left: 5, top: 5, width: "70%", height: "300px", clip: true, zIndex: overZ,
          background: "#fee2e2", padding: 16, children: [
            { id: "otext", type: "text", text: "The one on top", width: "100%" },
          ] },
      ] },
    ] },
  ],
} as unknown as BoxNode);

test.describe("a neighbouring block cannot bury the controls of the one being edited", () => {
  test("selecting a covered float still gives reachable controls", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/website/box-demo", { timeout: FIRST_COMPILE_MS });
    await page.evaluate((tree) => {
      localStorage.setItem("educo_box_site_v1", JSON.stringify({
        homeId: "p1", pages: [{ id: "p1", name: "Home", path: "/", root: tree }],
      }));
      localStorage.setItem("educo_box_site_cleaned_v1", "1");
    }, twoFloats(500_000) as unknown as Record<string, unknown>);
    await page.reload();
    await page.waitForSelector('[data-box-id="under"]', { timeout: 30000 });

    // Select the buried block through the layers panel path — clicking it is exactly what the covering float
    // prevents, which is the bug, so the test must not depend on the thing under test.
    await page.evaluate(() => {
      const el = document.querySelector('[data-box-id="under"]') as HTMLElement | null;
      el?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      el?.click();
    });

    const bar = page.getByRole("toolbar", { name: "Block toolbar" });
    await expect(bar).toBeVisible();
    const box = await bar.boundingBox();
    const hit = await topmostAt(page, box!.x + box!.width / 2, box!.y + box!.height / 2);
    expect(hit, "a neighbour must not be able to bury the controls of the selected block").toContain("chrome:");
  });
});

test.describe("the stored value itself is brought into the ladder", () => {
  test("the canvas renders a clamped order, not the number it was given", async ({ page }) => {
    await openCanvas(page, floatedTree(500_000));
    const z = await page.locator('[data-box-id="float"]').evaluate((el) =>
      Number(getComputedStyle(el).zIndex));
    expect(z).toBeLessThanOrEqual(PAGE_Z_CEILING);
    expect(z).toBeLessThan(CHROME_Z_FLOOR);
  });

  test("canvas = export: the published page clamps it to the same value", async ({ page }) => {
    const root = floatedTree(500_000);
    await page.setViewportSize({ width: 1280, height: 900 });
    const site = siteFromRoot(root);
    await page.setContent(renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }),
      { waitUntil: "domcontentloaded" });

    const z = await page.locator(".bx-float").first().evaluate((el) => Number(getComputedStyle(el).zIndex));
    expect(z).toBeLessThanOrEqual(PAGE_Z_CEILING);
  });

  test("a modest order is left exactly alone — the clamp is a ceiling, not a rewrite", async ({ page }) => {
    await openCanvas(page, floatedTree(3));
    const z = await page.locator('[data-box-id="float"]').evaluate((el) =>
      Number(getComputedStyle(el).zIndex));
    expect(z).toBe(3);
  });
});
