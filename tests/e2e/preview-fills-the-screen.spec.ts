import { test, expect, type Page } from "@playwright/test";
import { seedSite, BUILDER_PATH } from "./helpers/seed-site";
import type { BoxNode } from "@/lib/box-model";

/**
 * THE PREVIEW IS THE VISITOR'S SCREEN, not a picture of a website sitting on a desk.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * Reported, with a screenshot: "when I preview, it doesn't follow the full width of my monitor… preview
 * should mirror exactly how a user sees the website, based by default on the screen that they have."
 * It did not: the stage carried 24px of padding and the frame carried rounded corners, a ring and a shadow,
 * so the page was letterboxed inside a card and handed a width no visitor's browser would give it. The bar
 * took another 48px off the top, which matters because "one screen tall" is a real design decision here.
 *
 * A DEVICE preset keeps the card — an iPhone should look like an iPhone — so the two cases are both
 * asserted, or "fix the frame" would simply become "lose the device".
 */

const page1 = (): BoxNode => ({
  id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
    { id: "band1", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0, children: [
      { id: "hero", type: "container", direction: "column", width: "100%", padding: 0, gap: 0, minHeight: 300, background: "#d8b4fe", children: [] },
    ] },
  ],
} as unknown as BoxNode);

async function openPreview(page: Page) {
  await seedSite(page, { homeId: "p1", pages: [{ id: "p1", name: "Home", path: "/", root: page1() }] }, BUILDER_PATH);
  await page.waitForSelector('[data-box-id="hero"]', { timeout: 30000 });
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: /Preview/ }).first().click();
  await page.waitForSelector("[data-preview-stage]", { timeout: 15000 });
  await page.waitForTimeout(600);
}

const frameBox = (page: Page) => page.evaluate(() => {
  const f = document.querySelector<HTMLElement>('iframe[title="Site preview"]')!;
  const b = f.getBoundingClientRect();
  return { x: Math.round(b.left), y: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height), radius: getComputedStyle(f).borderTopLeftRadius };
});

test.describe("the preview shows the screen the person is actually on", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Responsive fills the whole window — width AND height, with nothing around it", async ({ page }) => {
    await openPreview(page);
    // The bar shows itself first, then steps aside; the page keeps the whole window either way.
    await page.waitForTimeout(3000);
    const f = await frameBox(page);
    expect(f.w, `the page is ${f.w}px wide in a 1440px window`).toBeGreaterThanOrEqual(1436);
    expect(f.h, `and ${f.h}px tall in a 900px window`).toBeGreaterThanOrEqual(896);
    expect(f.x, "flush to the left edge").toBeLessThanOrEqual(2);
    expect(f.y, "and to the top — the bar no longer takes a slice out of it").toBeLessThanOrEqual(2);
    expect(f.radius, "no card corners: a browser window does not have them").toBe("0px");
  });

  test("the page inside gets that width too — the point of the whole thing", async ({ page }) => {
    await openPreview(page);
    await page.waitForTimeout(800);
    const inner = await page.evaluate(() => {
      const f = document.querySelector<HTMLIFrameElement>('iframe[title="Site preview"]')!;
      const d = f.contentDocument!;
      const hero = d.querySelector<HTMLElement>(".bx-hero")!;
      return { innerW: f.contentWindow!.innerWidth, heroW: Math.round(hero.getBoundingClientRect().width), heroLeft: Math.round(hero.getBoundingClientRect().left) };
    });
    expect(inner.innerW, "the page's own viewport is the window's").toBeGreaterThanOrEqual(1436);
    // The 8px body margin the exporter never reset: a full-width band was inset on every published page.
    expect(inner.heroLeft, "a full-width band starts at the very edge").toBeLessThanOrEqual(1);
    expect(inner.heroW, "and runs the whole way across").toBeGreaterThanOrEqual(inner.innerW - 1);
  });

  test("a DEVICE preset still looks like a device — framed, centred, its own size", async ({ page }) => {
    await openPreview(page);
    await page.getByRole("button", { name: /Preview screen size/ }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole("option", { name: /iPhone 16 Pro —/ }).first().click();
    await page.waitForTimeout(700);
    const f = await frameBox(page);
    expect(f.w, "it is the phone's width, not the window's").toBeLessThan(600);
    expect(f.radius, "and it keeps the card look").not.toBe("0px");
    expect(f.x, "centred, with the desk showing around it").toBeGreaterThan(200);
  });

  test("dragging an edge sweeps the width from BOTH sides, and names the rung it lands on", async ({ page }) => {
    await openPreview(page);
    await page.waitForTimeout(800);
    const before = await frameBox(page);
    const grip = page.locator('[data-preview-grip="left"]');
    const box = (await grip.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + 260, box.y + box.height / 2, { steps: 12 });
    await page.mouse.up();
    await page.waitForTimeout(400);

    const after = await frameBox(page);
    expect(after.w, `it narrowed from ${before.w} to ${after.w}`).toBeLessThan(before.w - 400);
    // Symmetric: both sides gave, so the page is still centred.
    const gapLeft = after.x, gapRight = 1440 - (after.x + after.w);
    expect(Math.abs(gapLeft - gapRight), `left gap ${gapLeft}, right gap ${gapRight} — it should stay centred`).toBeLessThanOrEqual(6);
    // And the readout says which rung that width is, which is what a sweep is for.
    await expect(page.locator("[data-preview-readout]")).toContainText(/Phone|Tablet|Desktop/);
  });

  test("double-clicking an edge gives the whole window back", async ({ page }) => {
    await openPreview(page);
    await page.waitForTimeout(800);
    const grip = page.locator('[data-preview-grip="right"]');
    const box = (await grip.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x - 300, box.y + box.height / 2, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(300);
    expect((await frameBox(page)).w).toBeLessThan(1200);

    await grip.dblclick();
    await page.waitForTimeout(400);
    expect((await frameBox(page)).w, "back to the full window").toBeGreaterThanOrEqual(1436);
  });
});
