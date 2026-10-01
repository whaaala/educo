import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "fs";
import { join } from "path";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * THE CANVAS IS LAID OUT AT 1:1, LIKE THE PREVIEW, AT EVERY ZOOM (BATCH L-2, e-4).
 * Behaviours: tests/features/components/website/box-builder-site.feature "Zooming the editor canvas".
 *
 * Found through the UI (`scripts/uat/probe-e0b.js --w=1920`, the dresser's burger header): drawn with CSS `zoom`, the
 * canvas laid the page out in shrunken sub-pixels, and at Wide fitted to 55% the menu that hugs its four links came out
 * 0.0125px short of them — "Contact" wrapped and the menu was 79px tall on the canvas, 63px in the Preview. It wrapped at
 * 1280 at 50% and 75% too. The fixture is that header exactly as the UI built it (RULE Y: seeded only to pin the repro).
 */
const SITE = JSON.parse(readFileSync(join(__dirname, "fixtures", "burger-header.site.json"), "utf8"));
const LINKS = ["About", "Admissions", "News", "Contact"];

async function open(page: Page, device: string) {
  await page.setViewportSize({ width: 1520, height: 900 });
  await seedSite(page, SITE);
  await page.waitForSelector("[data-box-id]", { timeout: 15000 });
  await page.locator(`button[title="${device}"]`).first().click();
  await page.waitForTimeout(600);
}
const pick = async (page: Page, label: string) => {
  await page.getByRole("group", { name: "Canvas zoom" }).locator("button").nth(1).click();
  await page.getByRole("option", { name: label, exact: true }).first().click();
  await page.waitForTimeout(500);
};
/** Each link's top (rounded screen px) and the menu line's height in LAYOUT px, as the canvas or the Preview draws them. */
const linksOf = (doc: Page | import("@playwright/test").Frame, engine: "canvas" | "preview") => doc.evaluate(([engine, words]) => {
  const all = [...document.querySelectorAll<HTMLElement>(engine === "canvas" ? "[data-box-id]" : '[class*="bx-"]')];
  const link = (w: string) => all.find((e) => (e.innerText || "").trim() === w)!; // the link BLOCK (an <a>, or its holder)
  const els = words.map(link);
  const css = (els[0] as HTMLElement & { currentCSSZoom?: number }).currentCSSZoom ?? 1;
  const Z = engine === "canvas" ? (Number(els[0].closest<HTMLElement>("[data-canvas-scale]")?.dataset.canvasScale) || 1) * css : 1;
  return { tops: els.map((e) => Math.round(e.getBoundingClientRect().top)), line: Math.round(els[0].parentElement!.getBoundingClientRect().height / Z), cssZoom: css, Z };
}, [engine, LINKS] as const);

test.describe("the canvas lays the page out as the Preview does", () => {
  for (const [device, zoom] of [["Wide (1920px)", "Fit"], ["Wide (1920px)", "50%"], ["Wide (1920px)", "75%"], ["Desktop (1280px)", "50%"], ["Desktop (1280px)", "75%"]] as const) {
    test(`the burger header's four links share one line at ${device}, ${zoom}`, async ({ page }) => {
      await open(page, device);
      if (zoom !== "Fit") await pick(page, zoom);
      const c = await linksOf(page, "canvas");
      expect(c.Z, "the canvas is drawn smaller than 1:1 here").toBeLessThan(1);
      expect(new Set(c.tops).size, `link tops ${c.tops.join(", ")}: "Contact" wrapped`).toBe(1);
      expect(c.cssZoom, "the page is laid out at 1:1 — scaled, never CSS-zoomed").toBe(1);
    });
  }

  /**
   * e-8 (tier-99 page 209), reproduced through the UI by `scripts/uat/probe-l2-acc.js`: on the canvas an answer was an
   * editable <span>, which the reading-width cap for paragraphs never reached — 539px on one line, where the Preview's <p>
   * stopped at 512 and wrapped. The open item was 24px taller in the Preview, and the Accordion hugged a narrower width.
   */
  for (const [device, w] of [["Tablet (768px)", 768], ["Desktop (1280px)", 1280]] as const) {
    test(`an FAQ's open answer is as tall and as wide on the canvas as in the Preview at ${device}`, async ({ page }) => {
      await page.setViewportSize({ width: 1520, height: 900 });
      await seedSite(page, JSON.parse(readFileSync(join(__dirname, "fixtures", "faq-accordion.site.json"), "utf8")));
      await page.waitForSelector("details", { timeout: 15000 });
      await page.locator(`button[title="${device}"]`).first().click(); await page.waitForTimeout(600);
      const open = (doc: Page | import("@playwright/test").Frame) => doc.evaluate(() => {
        const d = document.querySelector<HTMLElement>("details[open]")!, acc = d.closest<HTMLElement>(".eu-accordion")!;
        const Z = Number(d.closest<HTMLElement>("[data-canvas-scale]")?.dataset.canvasScale) || 1;
        return { h: Math.round(d.getBoundingClientRect().height / Z), w: Math.round(acc.getBoundingClientRect().width / Z) };
      });
      const c = await open(page);
      await page.getByRole("button", { name: "Preview", exact: true }).first().click();
      await page.waitForSelector('iframe[title="Site preview"]', { timeout: 15000 }); await page.waitForTimeout(800);
      await page.keyboard.press("h");
      await page.setViewportSize({ width: w, height: 900 }); await page.waitForTimeout(500);
      let f = (await (await page.$('iframe[title="Site preview"]'))!.contentFrame())!;
      const inner = await f.evaluate(() => document.documentElement.clientWidth);
      if (inner !== w) { await page.setViewportSize({ width: w + (w - inner), height: 900 }); await page.waitForTimeout(400); f = (await (await page.$('iframe[title="Site preview"]'))!.contentFrame())!; }
      expect(await f.evaluate(() => document.documentElement.clientWidth), "the Preview is the device's width").toBe(w);
      const v = await open(f);
      expect(Math.abs(c.h - v.h), `open item ${c.h}px drawn, ${v.h}px published`).toBeLessThanOrEqual(1);
      expect(Math.abs(c.w - v.w), `Accordion ${c.w}px drawn, ${v.w}px published`).toBeLessThanOrEqual(1);
    });
  }

  /**
   * L2-j (tier-99 page 2, built through the UI by the sweep): a word longer than its column — "welcomed" in a 66px grid
   * cell. The page breaks it (`overflow-wrap: break-word`, in the base CSS the canvas never loads); the canvas let it run
   * out of its cell on one line — the row 461px drawn, 534px published at 1024. Pinned here as a narrow column.
   */
  test("a word longer than its column breaks the same way on the canvas and in the Preview", async ({ page }) => {
    await page.setViewportSize({ width: 1520, height: 900 });
    await seedSite(page, sitePage([
      { id: "wide", type: "container", direction: "column", width: "94%", children: [{ id: "a", type: "text", text: "Short words.", width: "100%" }] },
      { id: "thin", type: "container", direction: "column", width: "6%", clip: true, children: [{ id: "w", type: "text", text: "Every family is welcomed by our teachers.", width: "100%" }] },
    ]));
    await page.waitForSelector('[data-box-id="w"]', { timeout: 15000 });
    await page.locator('button[title="Laptop (1024px)"]').first().click(); await page.waitForTimeout(600);
    const box = (doc: Page | import("@playwright/test").Frame, sel: string) => doc.evaluate((sel) => { const e = document.querySelector<HTMLElement>(sel)!;
      const Z = Number(e.closest<HTMLElement>("[data-canvas-scale]")?.dataset.canvasScale) || 1; const r = e.getBoundingClientRect();
      return { h: Math.round(r.height / Z), w: Math.round(r.width / Z) }; }, sel);
    const c = await box(page, '[data-box-id="w"]');
    await page.getByRole("button", { name: "Preview", exact: true }).first().click();
    await page.waitForSelector('iframe[title="Site preview"]', { timeout: 15000 }); await page.waitForTimeout(800);
    await page.keyboard.press("h");
    await page.setViewportSize({ width: 1024, height: 900 }); await page.waitForTimeout(500);
    let f = (await (await page.$('iframe[title="Site preview"]'))!.contentFrame())!;
    const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== 1024) { await page.setViewportSize({ width: 1024 + (1024 - inner), height: 900 }); await page.waitForTimeout(400); f = (await (await page.$('iframe[title="Site preview"]'))!.contentFrame())!; }
    const v = await box(f, ".bx-w");
    expect(Math.abs(c.h - v.h), `the thin column's words ${c.h}px tall drawn, ${v.h}px published`).toBeLessThanOrEqual(1);
  });

  test("at Wide, Fit: the menu line is as tall on the canvas as in the Preview", async ({ page }) => {
    await open(page, "Wide (1920px)");
    const c = await linksOf(page, "canvas");
    await page.getByRole("button", { name: "Preview", exact: true }).first().click();
    await page.waitForSelector('iframe[title="Site preview"]', { timeout: 15000 }); await page.waitForTimeout(800);
    await page.setViewportSize({ width: 1920, height: 900 }); await page.waitForTimeout(500);
    const f = (await (await page.$('iframe[title="Site preview"]'))!.contentFrame())!;
    const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== 1920) { await page.setViewportSize({ width: 1920 + (1920 - inner), height: 900 }); await page.waitForTimeout(400); }
    const v = await linksOf((await (await page.$('iframe[title="Site preview"]'))!.contentFrame())!, "preview");
    expect(new Set(v.tops).size, `Preview link tops ${v.tops.join(", ")}`).toBe(1);
    expect(Math.abs(c.line - v.line), `menu line ${c.line}px drawn, ${v.line}px published`).toBeLessThanOrEqual(1);
  });
});
