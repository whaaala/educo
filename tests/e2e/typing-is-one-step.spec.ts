import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";
import type { BoxNode } from "@/lib/box-model";

/**
 * A BURST OF TYPING IS ONE STEP — one save, one Undo — AND NO WORD IS EVER LOST (c-12b, decided by the user 2026-10-02:
 * "measure first; if typing lags, a burst of typing is ONE Undo step… saved once typing stops… a pending save is written
 * on blur, page hide and before unload").
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature — "Typing fast on a slow phone never crashes
 * the builder" and "A burst of typing is one step".
 *
 * MEASURED FIRST (scripts/uat/probe-c12b.js, pages built through the UI): every key re-rendered the whole builder and
 * wrote the whole site to storage — 65 / 84 / 95 ms a key at 135 / 294 / 355 blocks, 185 / 279 / 353 ms with the CPU
 * slowed 3× (a low-cost phone), and React #185 in all three slowed windows after 150 characters. The page is SEEDED
 * here only to pin that repro (RULE Y).
 */
const page1 = () => sitePage([
  { id: "sec", type: "container", direction: "column", width: "100%",
    children: [{ id: "h", type: "heading", text: "Riverside", width: "100%" } as unknown as BoxNode] } as unknown as BoxNode,
]);
const KEY = "educo_box_site_v1";
const savedText = (page: Page) => page.evaluate((k) => {
  const s = JSON.parse(localStorage.getItem(k) || "null"); const find = (n: { id: string; text?: string; children?: unknown[] }): string | null => n.id === "h" ? (n.text ?? "") : (n.children ?? []).map((c) => find(c as never)).find((x) => x != null) ?? null;
  return s ? s.pages.map((p: { root: never }) => find(p.root)).find((x: string | null) => x != null) : null;
}, KEY);

async function countSaves(page: Page) {
  await page.addInitScript((k) => {
    const set = Storage.prototype.setItem; (window as unknown as { __saves: number }).__saves = 0;
    Storage.prototype.setItem = function (key: string, value: string) { if (key === k) (window as unknown as { __saves: number }).__saves++; return set.call(this, key, value); };
  }, KEY);
}
const saves = (page: Page) => page.evaluate(() => (window as unknown as { __saves: number }).__saves);
const words = (page: Page) => page.locator('[data-box-id="h"] [contenteditable]').first();

test("typing 40 characters saves the site at most twice, not once per key", async ({ page }) => {
  await countSaves(page);
  await seedSite(page, page1());
  await words(page).click(); await page.keyboard.press("End");
  const before = await saves(page);
  await page.keyboard.type(" Primary School, where every child counts", { delay: 20 });
  await page.waitForTimeout(1200); // the pause that ends the burst
  expect(await saves(page) - before, "saves during and after one burst").toBeLessThanOrEqual(2);
  expect(await savedText(page)).toBe("Riverside Primary School, where every child counts");
});

test("one Undo takes back the whole burst", async ({ page }) => {
  await seedSite(page, page1());
  await words(page).click(); await page.keyboard.press("End");
  await page.keyboard.type(" Primary School", { delay: 20 });
  await page.keyboard.press("Escape"); // out of the words: the block stays selected
  await page.keyboard.press("Control+z");
  await expect(words(page)).toHaveText("Riverside");
});

test("words typed just before the page closes are not lost", async ({ page }) => {
  await seedSite(page, page1());
  await words(page).click(); await page.keyboard.press("End");
  await page.keyboard.type(" Academy", { delay: 0 });
  await page.reload(); // no pause, no blur: the page is hidden while the burst is still open
  await expect(words(page)).toHaveText("Riverside Academy");
});
