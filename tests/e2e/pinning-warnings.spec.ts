import { test, expect, type Page } from "@playwright/test";
import { seedSite } from "./helpers/seed-site";
import type { BoxNode } from "@/lib/box-model";

/**
 * THE TWO WARNINGS APPEAR — which one of them never has.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * `pinBlockedBy` was written, documented and declared as a prop on the Inspector, and **no caller ever
 * passed it**. The "this will not hold" message could not render, so the one silent failure the feature
 * knew how to explain went on being silent. Built, reachable in the source, unreachable in the product —
 * the same class as the registry render path and the 47 dead CSS classes before it.
 *
 * Both warnings exist for failures with no other symptom:
 *
 *   · a clipping ancestor makes a scroll container, so a STICKY block inside it never sticks;
 *   · a transform, a container-type or a backdrop-filter makes a containing block, so a FIXED block inside
 *     it holds against that box instead of the window.
 *
 * Neither errors. Neither is guessable. A test that the message RENDERS is therefore the feature.
 */

const box = (id: string, extra: Record<string, unknown> = {}, children: BoxNode[] = []) => ({
  id, type: "container", direction: "column", width: "100%", padding: 0, gap: 0,
  minHeight: 120, background: "#4d8c0f", children, ...extra,
} as unknown as BoxNode);

const band = (id: string, kids: BoxNode[]) => ({
  id, type: "container", direction: "row", rowBand: true, width: "fill", padding: 0, gap: 0, children: kids,
} as unknown as BoxNode);

async function select(page: Page, id: string) {
  const b = (await page.locator(`[data-box-id="${id}"]`).boundingBox())!;
  for (let i = 0; i < 8; i++) {
    const sel = await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
    if (sel === id) return;
    await page.mouse.click(b.x + b.width * 0.5, b.y + b.height * 0.5);
    await page.waitForTimeout(220);
  }
  throw new Error(`could not select ${id}`);
}

const seed = (page: Page) => seedSite(page, { homeId: "p1", pages: [{ id: "p1", name: "Home", path: "/", root: {
  id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
    band("b1", [box("plain", { minHeight: 300 }, [box("stickyOk", { pin: "top", minHeight: 80 })])]),
    // A rounded ancestor CLIPS, which makes a scroll container — the sticky failure nobody would guess.
    band("b2", [box("rounded", { radius: 24, minHeight: 300 }, [box("stickyBlocked", { pin: "top", minHeight: 80 })])]),
    // A tilted ancestor carries a transform, which captures a FIXED descendant.
    band("b3", [box("tilted", { rotate: 3, minHeight: 300 }, [box("fixedBlocked", { pin: "top", hold: "fixed", minHeight: 80 })])]),
  ],
} }] });

test.describe("the pinning warnings", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("a clipping ancestor is NAMED for a sticky block", async ({ page }) => {
    await seed(page);
    await page.waitForSelector('[data-box-id="stickyBlocked"]', { timeout: 30000 });
    await page.waitForTimeout(600);
    await select(page, "stickyBlocked");
    const warn = page.getByText(/This will not hold/i);
    await expect(warn, "the warning renders at all — it never did before today").toBeVisible();
    await expect(warn, "and it names the block, not “something above this”").toContainText(/Stack|Grid|Side by side/);
  });

  test("a clear chain shows NO warning — it can fail as well as pass", async ({ page }) => {
    await seed(page);
    await page.waitForSelector('[data-box-id="stickyOk"]', { timeout: 30000 });
    await page.waitForTimeout(600);
    await select(page, "stickyOk");
    await expect(page.getByText(/This will not hold/i)).toHaveCount(0);
  });

  test("a capturing ancestor is NAMED for a fixed block", async ({ page }) => {
    await seed(page);
    await page.waitForSelector('[data-box-id="fixedBlocked"]', { timeout: 30000 });
    await page.waitForTimeout(600);
    await select(page, "fixedBlocked");
    await expect(page.getByText(/will not stay on screen/i), "the fixed warning renders").toBeVisible();
  });

  test("the mechanism control offers both, and the anchor follows it", async ({ page }) => {
    await seed(page);
    await page.waitForSelector('[data-box-id="stickyOk"]', { timeout: 30000 });
    await page.waitForTimeout(600);
    await select(page, "stickyOk");

    // Sticky offers the two edges a vertical scroll can mean.
    await expect(page.getByRole("button", { name: "Top", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Left", exact: true }), "no sides while sticky").toHaveCount(0);

    await page.getByRole("button", { name: "Floats on screen option" }).click();
    await page.waitForTimeout(400);
    // Fixed opens the sides and the corners, because all eight mean something against the viewport.
    await expect(page.getByRole("button", { name: "Left", exact: true }), "fixed offers the sides").toBeVisible();
    await expect(page.getByRole("button", { name: "↘", exact: true }), "…and the corners").toBeVisible();
  });
});
