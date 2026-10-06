import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * ZOOMING THE EDITOR CANVAS (BATCH Z-1, plan approved by the user 2026-10-01).
 * Behaviours: tests/features/components/website/box-builder-site.feature "Zooming the editor canvas".
 * The headed UAT builds its pages through the UI (scripts/uat/probe-z1.js); this regression guard seeds one plain box.
 */
const pageZoom = (page: Page) => page.evaluate(() => Number(document.querySelector("[data-box-id]")!.closest<HTMLElement>("[data-canvas-scale]")?.dataset.canvasScale) || 1);
const readout = (page: Page) => page.getByRole("group", { name: "Canvas zoom" }).locator("button").nth(1).innerText();
const siteJson = (page: Page) => page.evaluate(() => localStorage.getItem("educo_box_site_v1") ?? "");

async function open(page: Page, device = "Desktop (1280px)") {
  await page.setViewportSize({ width: 1520, height: 900 });
  await seedSite(page, sitePage([
    { id: "box", type: "container", direction: "column", width: "30%", padding: 24, background: "#e0e7ff", children: [
      { id: "h", type: "heading", text: "Open day", width: "100%" },
    ] },
    // A page taller than the window, as a real one is: zooming round a point needs room to scroll.
    { id: "tall", type: "container", direction: "column", width: "100%", minHeight: 1800, children: [] },
  ]));
  await page.waitForSelector('[data-box-id="box"]', { timeout: 15000 });
  await page.locator(`button[title="${device}"]`).first().click();
  await page.waitForTimeout(500);
}
const overCanvas = async (page: Page) => { const b = (await page.locator("[data-canvas-scroller]").boundingBox())!; await page.mouse.move(b.x + 150, b.y + 150); };

test.describe("canvas zoom", () => {
  test("− / + step along the ladder from Fit, and stop at 25% and 400%", async ({ page }) => {
    await open(page, "Wide (1920px)");
    expect(await readout(page)).toMatch(/^Fit · \d+%$/);
    const plus = page.getByRole("button", { name: "Zoom canvas in" }), minus = page.getByRole("button", { name: "Zoom canvas out" });
    for (let i = 0; i < 12; i++) if (await plus.isEnabled()) await plus.click();
    expect(await readout(page)).toBe("400%");
    await expect(plus).toBeDisabled();
    for (let i = 0; i < 14; i++) if (await minus.isEnabled()) await minus.click();
    expect(await readout(page)).toBe("25%");
    await expect(minus).toBeDisabled();
  });

  test("the shortcuts act on the canvas only while the pointer is on it", async ({ page }) => {
    await open(page);
    await overCanvas(page);
    await page.keyboard.press("Control+Digit0"); await page.waitForTimeout(200);
    expect(await pageZoom(page)).toBeCloseTo(1, 2);
    await page.keyboard.press("Control+Equal"); await page.waitForTimeout(200);
    expect(await pageZoom(page)).toBeCloseTo(1.25, 2);
    await page.keyboard.press("Shift+Digit1"); await page.waitForTimeout(200);
    expect(await readout(page)).toMatch(/^Fit/);
    const before = await pageZoom(page);
    const ins = (await page.locator('aside[aria-label="Inspector"]').boundingBox())!;
    await page.mouse.move(ins.x + 40, ins.y + 300);
    await page.keyboard.press("Control+Equal"); await page.waitForTimeout(200);
    expect(await pageZoom(page), "over the Inspector Ctrl + is the browser's, not the canvas's").toBeCloseTo(before, 3);
    // …and over the Blocks panel, which floats ON the canvas.
    await page.getByRole("button", { name: "Open blocks panel" }).first().click(); await page.waitForTimeout(400);
    const docked = await pageZoom(page); // a docked panel narrows the room, so Fit itself changes
    const bp = (await page.getByRole("dialog", { name: "Blocks" }).boundingBox())!;
    await page.mouse.move(bp.x + bp.width / 2, bp.y + bp.height / 2);
    await page.keyboard.press("Control+Equal"); await page.waitForTimeout(200);
    expect(await pageZoom(page), "over the Blocks panel Ctrl + is the browser's").toBeCloseTo(docked, 3);
    // …while over a SELECTED block — whose handles live in a layer outside the canvas — it is the canvas's (Z1-h).
    await page.getByRole("button", { name: "Close blocks panel" }).first().click(); await page.waitForTimeout(300);
    const box = (await page.locator('[data-box-id="box"]').boundingBox())!;
    await page.mouse.click(box.x + box.width - 20, box.y + box.height - 6); await page.waitForTimeout(300);
    const hd = (await page.locator('[aria-label="Resize right edge"]').first().boundingBox())!;
    await page.mouse.move(hd.x + hd.width / 2, hd.y + hd.height / 2);
    await page.keyboard.press("Control+Equal"); await page.waitForTimeout(200);
    expect(await pageZoom(page), "over a selected block's handle Ctrl + zooms the canvas").toBeGreaterThan(before + 0.05);
  });

  test("Ctrl + scroll zooms round the pointer; the plain wheel scrolls", async ({ page }) => {
    await open(page);
    const h = (await page.locator('[data-box-id="h"]').boundingBox())!;
    const px = h.x + 30, py = h.y + h.height / 2;
    await page.mouse.move(px, py);
    // 400 CSS px of wheel, as a real wheel turns at any screen density — under device emulation Playwright's delta arrives divided by
    // devicePixelRatio (measured, E3-4: −200 at DPR 2, −145 on the Pixel 5), so it is sent multiplied by it
    const dpr = await page.evaluate(() => devicePixelRatio);
    await page.keyboard.down("Control"); await page.mouse.wheel(0, -400 * dpr); await page.keyboard.up("Control");
    await page.waitForTimeout(400);
    const h2 = (await page.locator('[data-box-id="h"]').boundingBox())!;
    expect(await pageZoom(page)).toBeGreaterThan(1.2);
    // The heading's point that was under the pointer is still under it.
    const k = h2.width / h.width;
    expect(Math.abs(h2.x + 30 * k - px), "x drift").toBeLessThanOrEqual(2);
    expect(Math.abs(h2.y + (py - h.y) * k - py), "y drift").toBeLessThanOrEqual(2);
    const z = await pageZoom(page);
    await page.mouse.wheel(0, 200 * dpr); await page.waitForTimeout(300);
    expect(await pageZoom(page), "no Ctrl: the page scrolls, the zoom stays").toBeCloseTo(z, 3);
  });

  test("an edge dragged at 200% stores the size it would at 100%", async ({ page }) => {
    await open(page);
    await overCanvas(page);
    const width = async () => Number(((await siteJson(page)).match(/"id":"box"[^}]*?"width":"([\d.]+)%"/) ?? [])[1]);
    const dragRight = async (screenPx: number) => {
      const box = page.locator('[data-box-id="box"]');
      await box.evaluate((e) => e.scrollIntoView({ block: "center", inline: "center" }));
      const b = (await box.boundingBox())!;
      if (!(await page.locator('[aria-label="Resize right edge"]').count())) { await page.mouse.click(b.x + b.width - 30, b.y + b.height - 6); await page.waitForTimeout(300); }
      // The handles are re-measured a frame after a zoom or a scroll: under the full suite's load the handle was grabbed
      // where it WAS drawn, and the drag did nothing (30% → 30%). Wait until it sits on the block's right edge.
      await expect.poll(async () => {
        const [hb, bb] = [await page.locator('[aria-label="Resize right edge"]').first().boundingBox(), await box.boundingBox()];
        return hb && bb ? Math.abs(hb.x + hb.width / 2 - (bb.x + bb.width)) : 999;
      }, { timeout: 5000 }).toBeLessThan(12);
      const hd = (await page.locator('[aria-label="Resize right edge"]').first().boundingBox())!;
      const x = hd.x + hd.width / 2, y = hd.y + hd.height / 2;
      await page.mouse.move(x, y); await page.mouse.down();
      for (let i = 1; i <= 10; i++) await page.mouse.move(x + (screenPx * i) / 10, y);
      await page.mouse.up(); await page.waitForTimeout(400);
    };
    await page.keyboard.press("Control+Digit0"); await page.waitForTimeout(300);
    const w0 = await width();
    await dragRight(60);
    const at100 = await width();
    await page.keyboard.press("Control+z"); await page.waitForTimeout(300);
    expect(await width(), "undo put it back in one step").toBeCloseTo(w0, 1);
    await overCanvas(page);
    for (const _ of [1, 2, 3]) await page.keyboard.press("Control+Equal"); // 125 → 150 → 200%
    await page.waitForTimeout(300);
    expect(await pageZoom(page)).toBeCloseTo(2, 2);
    await dragRight(120);
    const at200 = await width();
    expect(at100, "the drag changed the width").toBeGreaterThan(w0 + 1);
    expect(Math.abs(at200 - at100), `${at100}% at 100% vs ${at200}% at 200%`).toBeLessThan(0.5);
  });

  test("the zoom is kept per device in this browser, never in the site", async ({ page }) => {
    await open(page);
    const site0 = await siteJson(page);
    await overCanvas(page);
    await page.keyboard.press("Control+Digit0"); await page.keyboard.press("Control+Equal"); await page.waitForTimeout(300);
    expect(await readout(page)).toBe("125%");
    expect(await siteJson(page), "zooming changed nothing in the saved site").toBe(site0);
    await page.reload(); await page.waitForSelector('[data-box-id="box"]');
    await page.locator('button[title="Desktop (1280px)"]').first().click(); await page.waitForTimeout(400);
    expect(await readout(page)).toBe("125%");
    await page.locator('button[title="Mobile (375px)"]').first().click(); await page.waitForTimeout(400);
    expect(await readout(page), "a device never zoomed opens at Fit").toMatch(/^Fit/);
  });

  test("with a block selected, a focused toolbar control keeps its own keys (Z1-j)", async ({ page }) => {
    await open(page);
    // The HEADING selected — a block with words, which Enter edits and Delete removes (the page itself has neither).
    const sel = () => page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
    const h = (await page.locator('[data-box-id="h"]').boundingBox())!;
    for (let i = 0; i < 4 && (await sel()) !== "h"; i++) { await page.mouse.click(h.x + h.width - 8, h.y + h.height / 2); await page.waitForTimeout(250); }
    expect(await sel(), "the heading is selected").toBe("h");
    // Enter on the focused zoom readout opens its menu — it used to start editing the selected block's words.
    await page.getByRole("group", { name: "Canvas zoom" }).locator("button").nth(1).focus();
    await page.keyboard.press("Enter"); await page.waitForTimeout(300);
    await expect(page.getByRole("listbox")).toHaveCount(1);
    expect(await page.evaluate(() => !!(document.activeElement as HTMLElement | null)?.isContentEditable), "the heading's words were not opened for editing").toBe(false);
    await page.keyboard.press("Escape"); await page.waitForTimeout(200);
    for (let i = 0; i < 4 && (await sel()) !== "h"; i++) { await page.mouse.click(h.x + h.width - 8, h.y + h.height / 2); await page.waitForTimeout(250); }
    // Delete on a focused toolbar button does not delete the selected block.
    await page.getByRole("button", { name: "Zoom canvas in" }).focus();
    await page.keyboard.press("Delete"); await page.waitForTimeout(300);
    await expect(page.locator('[data-box-id="h"]'), "the selected heading is still there").toHaveCount(1);
  });

  test("Space + drag pans the zoomed page", async ({ page }) => {
    await open(page, "Wide (1920px)");
    await overCanvas(page);
    await page.keyboard.press("Control+Digit0"); await page.keyboard.press("Control+Equal"); await page.keyboard.press("Control+Equal"); await page.waitForTimeout(300);
    const sc = page.locator("[data-canvas-scroller]");
    await sc.evaluate((e) => { e.scrollLeft = 400; e.scrollTop = 0; });
    const b = (await sc.boundingBox())!;
    await page.mouse.move(b.x + 400, b.y + 300);
    await page.keyboard.down("Space");
    await page.mouse.down(); await page.mouse.move(b.x + 250, b.y + 300, { steps: 6 }); await page.mouse.up();
    await page.keyboard.up("Space");
    expect(await sc.evaluate((e) => Math.round(e.scrollLeft))).toBe(550);
    expect(await page.locator(".outline-indigo-500").count(), "panning selected nothing and drew no box").toBe(0);
  });
});
