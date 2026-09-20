import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * WHERE A DROP LANDS, FOR EVERY PART OF A BLOCK.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * One rule on both axes, which is what makes it learnable:
 *
 *      THE EDGES PLACE THINGS AROUND A BLOCK; THE MIDDLE PLACES THEM INSIDE IT.
 *
 * Left and right strips → beside it. Top and bottom strips → above and below it, on their own line.
 * Everything in between → inside it.
 *
 * It is a spec rather than a comment because the half of it that was missing was completely missing: with a
 * block whose width had been reduced there was NO WAY AT ALL to put something below it. Measured, of four
 * sensible aims: one landed beside, two landed nested inside, and the fourth — below the band — did nothing
 * whatsoever, because the canvas is exactly as tall as its content and there was no surface there to drop on.
 * "Nothing happened" is the worst of the four, because it reads as the builder being broken.
 */

/** ONE block, narrowed — so there is a gap beside it AND a block to aim at. The shape that had no answer. */
async function seedNarrow(page: Page) {
  await seedSite(page, sitePage([
    { id: "A", type: "container", direction: "column", padding: 0, gap: 0, width: "50%", minHeight: 170, background: "#c7d2fe", children: [] },
  ]));
  await page.waitForSelector('[data-box-id="A"]', { timeout: 15000 });
  await page.waitForTimeout(350);
}

async function dropAt(page: Page, x: number, y: number) {
  await page.evaluate(({ x, y }) => {
    const dt = new DataTransfer();
    dt.setData("application/x-box-block", "container");
    const el = document.elementFromPoint(x, y);
    if (!el) return;
    const at = { clientX: x, clientY: y, bubbles: true, cancelable: true, dataTransfer: dt };
    el.dispatchEvent(new DragEvent("dragover", at));
    el.dispatchEvent(new DragEvent("drop", at));
  }, { x, y });
  await page.waitForTimeout(450);
}

/**
 * Where the new block ended up, as one of three words.
 *   "beside" — a second child of A's own band      "below" — a second band under it
 *   "inside" — a descendant of A                   "nowhere" — nothing was added at all
 */
async function placement(page: Page) {
  return page.evaluate(() => {
    const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
    const bands = (site.pages[0].root.children as Record<string, unknown>[]) ?? [];
    if (bands.length > 1) return "below";
    const kids = (bands[0]?.children as Record<string, unknown>[]) ?? [];
    if (kids.length > 1) return "beside";
    const a = kids[0];
    return ((a?.children as unknown[]) ?? []).length ? "inside" : "nowhere";
  });
}

test.describe("the edges place around a block, the middle places inside it", () => {
  test("the GAP beside it means beside", async ({ page }) => {
    await seedNarrow(page);
    const a = (await page.locator('[data-box-id="A"]').boundingBox())!;
    await dropAt(page, a.x + a.width + 120, a.y + a.height / 2);
    expect(await placement(page)).toBe("beside");
  });

  test("its RIGHT edge means beside, even with no gap to aim at", async ({ page }) => {
    await seedNarrow(page);
    const a = (await page.locator('[data-box-id="A"]').boundingBox())!;
    await dropAt(page, a.x + a.width - 10, a.y + a.height / 2);
    expect(await placement(page)).toBe("beside");
  });

  test("its MIDDLE means inside", async ({ page }) => {
    await seedNarrow(page);
    const a = (await page.locator('[data-box-id="A"]').boundingBox())!;
    await dropAt(page, a.x + a.width / 2, a.y + a.height / 2);
    expect(await placement(page)).toBe("inside");
  });

  test("its BOTTOM edge means below — on a line of its own", async ({ page }) => {
    // The one that had no answer at all. Before this it landed nested inside the block.
    await seedNarrow(page);
    const a = (await page.locator('[data-box-id="A"]').boundingBox())!;
    await dropAt(page, a.x + a.width / 2, a.y + a.height - 12);
    expect(await placement(page)).toBe("below");
  });

  test("BELOW the band means below — the canvas has somewhere to aim", async ({ page }) => {
    // This did nothing whatsoever: the page is exactly as tall as its content, so there was no canvas
    // beneath the last band and the drop never reached a handler. The editor now keeps room under the page
    // — on the CANVAS, outside the page root, so it adds nothing to the page and cannot reach the export.
    await seedNarrow(page);
    const a = (await page.locator('[data-box-id="A"]').boundingBox())!;
    const band = (await page.locator('[data-box-id="band"]').boundingBox())!;
    await dropAt(page, a.x + a.width / 2, band.y + band.height + 14);
    expect(await placement(page)).toBe("below");
  });

  test("the page the editor DRAWS is exactly as tall as the page", async ({ page }) => {
    /**
     * The room the editor keeps below the page for dropping must cost the page nothing.
     *
     * It was first added as `padding-bottom` on the canvas, and the white sheet a person reads as "the
     * page" is the canvas's PARENT — so the padding stretched the sheet. Measured: the page root was 160px
     * and the sheet drew 256px. Ninety-six pixels of page that were not page, on every page, by default —
     * and the first thing anyone asked was why the empty space was there.
     *
     * Canvas = export is usually about styling. This is the same rule about SIZE, and in the direction that
     * matters most: the editor flattering the result.
     */
    await seedNarrow(page);
    const sizes = await page.evaluate(() => {
      const root = document.querySelector("[data-box-id]") as HTMLElement;
      const canvas = root.closest(".eu-tokens") as HTMLElement;
      const sheet = canvas.parentElement as HTMLElement;
      return {
        root: root.getBoundingClientRect().height,
        canvas: canvas.getBoundingClientRect().height,
        sheet: sheet.getBoundingClientRect().height,
      };
    });
    expect(Math.round(sizes.canvas), "the canvas is the page, not the page plus room").toBe(Math.round(sizes.root));
    expect(Math.round(sizes.sheet), "and so is the white sheet drawn around it").toBe(Math.round(sizes.root));
  });

  test("nothing spills sideways whichever way it lands", async ({ page }) => {
    await seedNarrow(page);
    const a = (await page.locator('[data-box-id="A"]').boundingBox())!;
    await dropAt(page, a.x + a.width / 2, a.y + a.height - 12);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });
});
