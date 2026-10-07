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
    await dropAt(page, a.x + a.width / 2, a.y + a.height - Math.min(12, a.height * 0.1)); // inside the bottom strip (25% of the DRAWN height) at any canvas scale (E4-9)
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
    await dropAt(page, a.x + a.width / 2, a.y + a.height - Math.min(12, a.height * 0.1)); // inside the bottom strip (25% of the DRAWN height) at any canvas scale (E4-9)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });
});

/**
 * LETTING GO OVER THE EDITOR'S OWN CHROME.
 *
 * REGRESSION GUARD, seeded: first reproduced THROUGH THE UI (scripts/uat/probe-t9.js) — a heading selected, its toolbar
 * hanging over the text below, a Stack dragged from the panel and let go "just under the text": on the toolbar three
 * times out of three nothing was added, beside it the block was. Fifteen real pages of the tier-99 sweep failed on it.
 *
 * A REAL DRAG, with the pointer — never `elementFromPoint` followed by a synthetic drop: that asks where the release
 * lands BEFORE any drag has happened, which is precisely the moment the fix does not apply to.
 */
test.describe("a block let go over the selected block's toolbar lands on the page beneath it", () => {
  // THE TREE THE UI BUILT, as the probe stored it — a header band, then a section whose heading and text each sit in a
  // band of their own and hug their words. In the window the sweep uses: with the blocks panel docked the page is fitted
  // to 77%, and the toolbar of the selected heading hangs over the first 74px of the text.
  test.use({ viewport: { width: 1520, height: 720 } });
  const band = (id: string, child: unknown) => ({ id, type: "container", layout: "flex", direction: "row", gap: 0, align: "stretch", justify: "start", wrap: false, padding: 0, width: "fill", rowBand: true, children: [child] });
  const stack = (id: string, children: unknown[]) => ({ id, type: "container", layout: "flex", direction: "column", gap: 0, align: "stretch", justify: "start", wrap: false, padding: 0, width: "100%", children });
  async function seedHeadingOverText(page: Page, headerPx?: number) {
    await seedSite(page, { homeId: "p1", pages: [{ id: "p1", name: "Home", path: "/", root: { id: "root", type: "container", layout: "flex", direction: "column", gap: 0, align: "stretch", justify: "start", wrap: false, padding: 0, width: "fill", baseFont: 10, children: [
      // `headerPx` (E2-8): how far down the heading sits — the toolbar needs 48 SCREEN px above a block, so where it lands depends on the scale
      band("b1", { ...stack("hdr", [band("b1a", { id: "logo", type: "heading", width: "auto", text: "New heading", fontSize: 32, bold: true })]), minHeight: headerPx }),
      band("b2", stack("S", [
        band("bh", { id: "H", type: "heading", width: "auto", text: "What we offer", fontSize: 32, bold: true }),
        band("bt", { id: "T", type: "text", width: "auto", text: "New text — click to edit." }),
      ])),
    ] } }] });
    await page.waitForSelector('[data-box-id="T"]', { timeout: 15000 });
    await page.waitForTimeout(350);
    // THE PANEL FIRST, THEN THE SELECTION: the bar chooses its side from where the block is, and the panel moves the block.
    await page.getByRole("button", { name: "Open blocks panel" }).click(); await page.waitForTimeout(700);
    for (let i = 0; i < 6; i++) {
      if (await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id")) === "H") break;
      const h = (await page.locator('[data-box-id="H"]').boundingBox())!;
      await page.mouse.click(h.x + h.width / 2, h.y + h.height / 2); await page.waitForTimeout(250);
    }
  }
  const blocks = (page: Page) => page.evaluate(() => document.querySelectorAll("[data-box-id]").length);
  /** Pick the Stack tile up, carry it across the page in steps, and let go at (x, y). */
  async function carryStackTo(page: Page, x: number, y: number) {
    const tile = page.locator('[draggable="true"]').filter({ hasText: /^\s*Stack/ }).first();
    const t = (await tile.boundingBox())!;
    const from = { x: t.x + t.width / 2, y: t.y + t.height / 2 };
    await page.mouse.move(from.x, from.y); await page.mouse.down();
    for (let i = 1; i <= 16; i++) { await page.mouse.move(from.x + ((x - from.x) * i) / 16, from.y + ((y - from.y) * i) / 16); await page.waitForTimeout(20); }
    await page.waitForTimeout(80); await page.mouse.up(); await page.waitForTimeout(900);
  }

  test("every control of the toolbar, one after another: the block is added each time", async ({ page }) => {
    await seedHeadingOverText(page);
    const controls = await page.evaluate(() => Array.from(document.querySelectorAll('[role="toolbar"][aria-label="Block toolbar"] > *'))
      .filter((e) => e.getBoundingClientRect().width > 0) // only what is SHOWN: the grip is not offered to a finger (E-5a)
      .map((e) => { const r = e.getBoundingClientRect(); return { name: e.getAttribute("aria-label") || e.textContent || e.tagName, x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) }; }));
    expect(controls.length, "the toolbar is there, with its controls").toBeGreaterThanOrEqual(3);
    const text = (await page.locator('[data-box-id="T"]').boundingBox())!;
    const over = controls.filter((c) => c.y > text.y - 4 && c.y < text.y + text.height + 30);
    expect(over.length, "and it hangs over the line below — or this proves nothing").toBe(controls.length);
    for (const c of controls) {
      const before = await blocks(page);
      await carryStackTo(page, c.x, c.y);
      expect(await blocks(page), `let go on "${c.name}" at ${c.x},${c.y}`).toBeGreaterThan(before);
      await page.keyboard.press("Control+z"); await page.waitForTimeout(400);
      expect(await blocks(page), "undone, ready for the next").toBe(before);
    }
  });

  test("the toolbar takes the side that has room when the page is refitted — it never sticks out over the top of the page", async ({ page }) => {
    // SELECTED FIRST, the panel docked afterwards: the page is refitted to 77%, the heading moves up to within 48px of
    // the top of the page, and a bar that had chosen "above" was left hanging over the page's top edge (c-20).
    await seedHeadingOverText(page, 62); // 55 screen px above it at 0.89 (panel shut), 41 docked at ~0.66 — either side of the bar's 48
    await page.getByRole("button", { name: "Close blocks panel" }).click(); await page.waitForTimeout(700);
    await page.keyboard.press("Escape"); await page.waitForTimeout(200);
    const h = (await page.locator('[data-box-id="H"]').boundingBox())!;
    for (let i = 0; i < 6 && await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id")) !== "H"; i++) { await page.mouse.click(h.x + h.width / 2, h.y + h.height / 2); await page.waitForTimeout(250); }
    const where = async () => page.evaluate(() => { const z = document.querySelector<HTMLElement>("[data-canvas-scale]")?.dataset.canvasScale; const bar = document.querySelector('[role="toolbar"][aria-label="Block toolbar"]')!.getBoundingClientRect(); const top = document.querySelector('[data-box-id="root"]')!.getBoundingClientRect().top; const b = document.querySelector('[data-box-id="H"]')!.getBoundingClientRect(); return { z, barTop: Math.round(bar.top), pageTop: Math.round(top), blockTop: Math.round(b.top), below: bar.top >= b.bottom - 2 }; });
    const open = await where();
    // A FINGER'S BAR IS 52px and needs 68 above (E5a-11); there the RULE is asserted in both states, whatever the scale puts the
    // block at — above with room, below without, never over the top of the page. The mouse keeps the c-20 proof exactly.
    if (await page.evaluate(() => matchMedia("(pointer: coarse)").matches)) {
      for (const [state, w] of [["closed", open], ["opened", (await page.getByRole("button", { name: "Open blocks panel" }).click(), await page.waitForTimeout(900), await where())]] as const) {
        expect(w.below, `${state}: the bar is below exactly when there is under 68px above (${w.blockTop - w.pageTop}px, scale ${w.z})`).toBe(w.blockTop - w.pageTop < 68);
        expect(w.barTop, `${state}: and no part of it is above the page`).toBeGreaterThanOrEqual(w.pageTop);
      }
      return;
    }
    expect(open.blockTop - open.pageTop, `with the panel closed there is room above the block — or this proves nothing (scale ${open.z})`).toBeGreaterThanOrEqual(48); // the bar's 32 + the 16 that clears the handles (E2-8)
    expect(open.below, "so the bar sits above it").toBe(false);
    await page.getByRole("button", { name: "Open blocks panel" }).click(); await page.waitForTimeout(900);
    const docked = await where();
    expect(docked.blockTop - docked.pageTop, `docked, the block is within 48px of the top of the page (scale ${docked.z})`).toBeLessThan(48);
    expect(docked.below, "so the bar has moved below it").toBe(true);
    expect(docked.barTop, "and no part of it is above the page").toBeGreaterThanOrEqual(docked.pageTop);
  });

  test("and the toolbar is a toolbar again the moment the drag is over", async ({ page }) => {
    await seedHeadingOverText(page);
    const bar = page.locator('[role="toolbar"][aria-label="Block toolbar"]');
    const b = (await bar.boundingBox())!;
    await carryStackTo(page, b.x + b.width / 2, b.y + b.height / 2);
    expect(await page.evaluate(() => document.body.hasAttribute("data-box-drag-in")), "the flag came down with the drop").toBe(false);
    await page.keyboard.press("Control+z"); await page.waitForTimeout(400);
    const actions = page.getByRole("button", { name: "Block actions" }).first();
    await actions.click();
    await expect(page.getByRole("menu").first(), "its menu opens on a click").toBeVisible();
  });
});
