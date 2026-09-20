import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * A CLICK SELECTS THE OUTERMOST BLOCK; EACH FURTHER CLICK GOES ONE LEVEL DEEPER — AND THEN STOPS.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * Drilling by clicking is only useful if it runs one way. It used to WRAP: at the innermost block the next
 * click went back to the outermost, so on a parent holding one child, clicking repeatedly gave P → C → P →
 * C forever. A click was as likely to take you further out as further in, and nothing on screen said which
 * — reported as not being able to get back to the parent stack reliably.
 *
 * Starting over is what clicking empty canvas is for.
 */

const nested = () => sitePage([
  { id: "P", type: "container", direction: "column", padding: 24, gap: 0, width: "100%", minHeight: 300, background: "#eef2ff", children: [
    { id: "C", type: "container", direction: "column", padding: 24, gap: 0, width: "100%", minHeight: 200, background: "#c7d2fe", children: [
      { id: "G", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 100, background: "#a5b4fc", children: [] },
    ] },
  ] },
]);

const selected = (page: Page) =>
  page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);

/** Click the same spot — the middle of the innermost block — n times, reporting the selection each time. */
async function clickRepeatedly(page: Page, times: number) {
  const g = (await page.locator('[data-box-id="G"]').boundingBox())!;
  const out: (string | null)[] = [];
  for (let i = 0; i < times; i++) {
    await page.mouse.click(g.x + g.width / 2, g.y + g.height / 2);
    await page.waitForTimeout(250);
    out.push(await selected(page));
  }
  return out;
}

test.describe("clicking into nested blocks", () => {
  test("goes outermost → deeper → deeper, and STAYS at the innermost", async ({ page }) => {
    await seedSite(page, nested());
    await page.waitForSelector('[data-box-id="G"]', { timeout: 15000 });
    await page.waitForTimeout(450);

    const seen = await clickRepeatedly(page, 6);
    expect(seen[0], "the first click takes the outermost block").toBe("P");
    expect(seen[1], "the second goes one deeper").toBe("C");
    expect(seen[2], "the third goes one deeper again").toBe("G");
    // THE ASSERTION THE BUG IS ABOUT: it must not wrap back round to the outermost.
    expect(seen.slice(3), `it rests at the innermost (${seen.join(" → ")})`).toEqual(["G", "G", "G"]);
  });

  test("clicking empty canvas clears it, so the next click starts from the outermost again", async ({ page }) => {
    await seedSite(page, nested());
    await page.waitForSelector('[data-box-id="G"]', { timeout: 15000 });
    await page.waitForTimeout(450);
    await clickRepeatedly(page, 3);
    expect(await selected(page), "drilled all the way in").toBe("G");

    const p = (await page.locator('[data-box-id="P"]').boundingBox())!;
    await page.mouse.click(p.x + p.width / 2, p.y + p.height + 40); // below the page, on bare canvas
    await page.waitForTimeout(300);
    expect(await selected(page), "empty canvas clears the selection").toBeNull();

    const g = (await page.locator('[data-box-id="G"]').boundingBox())!;
    await page.mouse.click(g.x + g.width / 2, g.y + g.height / 2);
    await page.waitForTimeout(300);
    expect(await selected(page), "…and the next click starts from the top again").toBe("P");
  });
});
