import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage, pressHeader } from "./helpers/seed-site";

/**
 * A BLOCK HIDDEN ON A DEVICE IS GONE FROM THE CANVAS AT THAT DEVICE (decided with the user 2026-09-28, #132) —
 * behaviours in tests/features/components/website/box-builder-responsive.feature.
 *
 * Seeded regression guard for a repro found through the UI: on every dressed page with a phone-only "☰ Menu", the
 * canvas at the Mobile preset drew the hidden menu faintly, so the header wrapped onto two lines (89px) while the
 * published page had one (38px). Now the hidden block takes no space, exactly as on the published page, and
 * "Show hidden blocks" brings it back faintly so it can be selected and un-hidden.
 */
const link = (id: string, text: string) => ({ id, type: "link", text, href: "/x", width: "auto" });
async function seed(page: Page) {
  await seedSite(page, sitePage([
    { id: "logo", type: "heading", text: "Hillside School", width: "auto" },
    { id: "menu", type: "container", direction: "column", width: "50%", padding: 0, gap: 0, responsive: { phone: { hidden: true } }, children: [
      { id: "line", type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0, children: [link("l1", "About"), link("l2", "Admissions"), link("l3", "News"), link("l4", "Contact")] },
    ] },
    { id: "cta", type: "button", text: "Apply now", width: "auto" },
  ]));
  await page.waitForSelector('[data-box-id="logo"]', { timeout: 30000 });
  await page.waitForTimeout(400);
}
const box = (page: Page, id: string) => page.locator(`[data-box-id="${id}"]`).boundingBox();

test.describe("hidden on a device → gone from the canvas at that device", () => {
  test("at the Mobile preset the hidden menu has no box, the header keeps one line, and the toggle brings it back faintly", async ({ page }) => {
    await seed(page);
    await pressHeader(page, "Mobile (375px)"); await page.waitForTimeout(600);
    expect(await page.locator('[data-box-id="menu"]').count(), "the hidden block is not drawn at all").toBe(0);
    const logo = (await box(page, "logo"))!, cta = (await box(page, "cta"))!;
    expect(Math.abs(logo.y - cta.y), "logo and button share one line — nothing hidden pushed the button down").toBeLessThan(4);
    await pressHeader(page, "Show hidden blocks"); await page.waitForTimeout(400);
    const menu = page.locator('[data-box-id="menu"]');
    expect(await menu.count(), "asked for, the hidden block is drawn").toBe(1);
    expect(parseFloat(await menu.evaluate((e) => getComputedStyle(e).opacity)), "…faintly").toBeLessThan(0.5);
    await pressHeader(page, "Show hidden blocks"); await page.waitForTimeout(300);
    expect(await menu.count(), "and gone again").toBe(0);
  });
  test("at the Desktop preset the same block is simply there", async ({ page }) => {
    await seed(page);
    await pressHeader(page, "Desktop (1280px)"); await page.waitForTimeout(600);
    const menu = page.locator('[data-box-id="menu"]');
    expect(await menu.count()).toBe(1);
    expect(parseFloat(await menu.evaluate((e) => getComputedStyle(e).opacity))).toBe(1);
  });
});
