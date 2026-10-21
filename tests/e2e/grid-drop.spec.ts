import { test, expect, type Page } from "@playwright/test";
import { clearSite } from "./helpers/seed-site";
import INSPECTOR from "../../config/inspector.json";
import LAYOUT from "../../config/layout.json";

/**
 * A GRID FOR EVERY STACK — THE GRID IS HOW A BLOCK IS DROPPED (BATCH LE-15o — tests/features/components/website/grid-drop.feature;
 * signed by the user 2026-10-21). Built the way a person builds it: the blocks panel, a Side by side, Stacks in it and one below;
 * that one carried by a mouse beside the others.
 */
test.use({ viewport: { width: 1600, height: 950 } });
const coarse = (page: Page) => page.evaluate(() => matchMedia("(pointer: coarse)").matches);
const tile = (page: Page, name: string) => page.locator('[role="button"]', { hasText: new RegExp(`^${name}`) }).first();
const COLS = 12;

/** The Side by side's blocks as columns of twelve (their drawn widths). */
const lineCols = (page: Page) => page.evaluate((C) => {
  const rows = Array.from(document.querySelectorAll<HTMLElement>("[data-box-id]")).filter((b) => getComputedStyle(b).flexDirection.startsWith("row") && /Drop a block here/.test(b.textContent || "") && b.querySelectorAll(":scope > [data-box-id]").length >= 2);
  const row = rows[rows.length - 1], W = row.getBoundingClientRect().width;
  return Array.from(row.querySelectorAll<HTMLElement>(":scope > [data-box-id]")).map((k) => Math.round((k.getBoundingClientRect().width / W) * C * 100) / 100);
}, COLS);

/** A Side by side holding `stacks` Stacks, then (with `loose`) one more Stack on the page below it, nothing selected — every one
 *  clicked in from the blocks panel. */
async function build(page: Page, stacks: number, loose = false) {
  await clearSite(page);
  await page.waitForSelector('[aria-label="Open blocks panel"]', { timeout: 20000 });
  await page.waitForTimeout(600);
  await page.keyboard.press("b"); await page.waitForTimeout(600);
  await tile(page, "Side by side").click(); await page.waitForTimeout(700);
  for (let i = 0; i < stacks; i++) { await tile(page, "Stack").click(); await page.waitForTimeout(700); }
  if (loose) { // nothing selected: the panel adds to the page, below the Side by side
    await page.mouse.click(700, 700); await page.waitForTimeout(300);
    if (!(await tile(page, "Stack").isVisible())) { await page.keyboard.press("b"); await page.waitForTimeout(500); }
    await tile(page, "Stack").click(); await page.waitForTimeout(700);
  }
  await page.keyboard.press("Escape"); await page.waitForTimeout(300);
}

test.beforeEach(async ({ page }) => { test.skip(await coarse(page), "a mouse's carry; a finger's is the headed pass"); test.setTimeout(90_000); });

test("LE-15o (2) · Stacks clicked into a Side by side share its line in whole columns of twelve", async ({ page }) => {
  await build(page, 3);
  const cols = await lineCols(page);
  expect(cols.length, "three Stacks on the line").toBe(3);
  for (const c of cols) expect(Math.abs(c - Math.round(c)), `each a whole number of columns: ${cols}`).toBeLessThan(0.15);
});

test("LE-15o (1)(3) · carried beside two Stacks: the columns fade in, a band of 4 of 12 shows where it lands, and it lands there", async ({ page }) => {
  await build(page, 2, true);
  const at = await page.evaluate(() => {
    const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
    const lines = site.pages[0].root.children as { children?: { id: string }[] }[];
    const text = lines[lines.length - 1].children![0].id; // the loose Stack: the page's last line holds it
    const r = (el: Element) => { const q = el.getBoundingClientRect(); return { x: q.x, y: q.y, w: q.width, h: q.height }; };
    const rows = Array.from(document.querySelectorAll<HTMLElement>("[data-box-id]")).filter((b) => getComputedStyle(b).flexDirection.startsWith("row") && /Drop a block here/.test(b.textContent || "") && b.querySelectorAll(":scope > [data-box-id]").length >= 2);
    const row = rows[rows.length - 1];
    return { text: r(document.querySelector(`[data-box-id="${CSS.escape(text)}"]`)!), row: r(row), last: r(row.lastElementChild!) };
  });
  const from = { x: at.text.x + Math.min(40, at.text.w / 2), y: at.text.y + at.text.h / 2 }, to = { x: at.last.x + 10, y: at.last.y + at.last.h / 2 }; // the last Stack's LEFT strip: before it (its right edge is the line's own — LE15o-c)
  await page.mouse.click(from.x, from.y); await page.waitForTimeout(300);
  await page.mouse.move(from.x, from.y); await page.mouse.down();
  for (let k = 1; k <= 20; k++) { await page.mouse.move(from.x + ((to.x - from.x) * k) / 20, from.y + ((to.y - from.y) * k) / 20); await page.waitForTimeout(25); }
  // the loose Stack stands on the page as a section does: over another page block it moves up or down the page, and held still it
  // goes in (LE15n-d2, the user's "Reorder; hold still = inside") — so a person holds it there
  await page.waitForTimeout(LAYOUT.drag.intoHoldMs + 300);
  const during = await page.evaluate(() => {
    const g = document.querySelector<HTMLElement>("[data-drag-columns]")!, band = Array.from(document.body.children).find((e) => /bg-indigo-500\/15/.test((e as HTMLElement).className)) as HTMLElement | undefined;
    return { columns: getComputedStyle(g).opacity, words: document.querySelector("[data-drop-words]")?.textContent ?? "", band: band ? band.getBoundingClientRect().width : 0 };
  });
  await page.mouse.up(); await page.waitForTimeout(700);
  const after = await lineCols(page), gone = await page.evaluate(() => getComputedStyle(document.querySelector("[data-drag-columns]")!).opacity);
  expect(during.columns, "the columns of the box under the pointer are drawn while it is carried").toBe("1");
  expect(during.words, "the chip says its size in columns").toContain(INSPECTOR.drop.columns.replace("{n}", "4").replace("{cols}", String(COLS)));
  expect(Math.abs(during.band - (at.row.w * 4) / COLS), `the band is 4 of 12 of the line (${during.band} of ${at.row.w})`).toBeLessThan(4);
  expect(after, "it lands where the band was: three on the line, 4 of 12 each").toEqual([4, 4, 4]);
  expect(gone, "the columns fade away once it lands").toBe("0");
});

test("LE15o-c · the right edge of a line's last block is the END of that line (the user: \"End of the line wins\")", async ({ page }) => {
  await build(page, 2, true);
  const at = await page.evaluate(() => {
    const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
    const lines = site.pages[0].root.children as { children?: { id: string }[] }[];
    const r = (el: Element) => { const q = el.getBoundingClientRect(); return { x: q.x, y: q.y, w: q.width, h: q.height }; };
    const rows = Array.from(document.querySelectorAll<HTMLElement>("[data-box-id]")).filter((b) => getComputedStyle(b).flexDirection.startsWith("row") && /Drop a block here/.test(b.textContent || "") && b.querySelectorAll(":scope > [data-box-id]").length >= 2);
    return { loose: r(document.querySelector(`[data-box-id="${CSS.escape(lines[lines.length - 1].children![0].id)}"]`)!), last: r(rows[rows.length - 1].lastElementChild!) };
  });
  const from = { x: at.loose.x + 40, y: at.loose.y + at.loose.h / 2 }, to = { x: at.last.x + at.last.w - 8, y: at.last.y + at.last.h / 2 };
  await page.mouse.click(from.x, from.y); await page.waitForTimeout(300);
  await page.mouse.move(from.x, from.y); await page.mouse.down();
  for (let k = 1; k <= 20; k++) { await page.mouse.move(from.x + ((to.x - from.x) * k) / 20, from.y + ((to.y - from.y) * k) / 20); await page.waitForTimeout(25); }
  await page.waitForTimeout(LAYOUT.drag.intoHoldMs + 300); // held still: in, not up or down the page (LE15n-d2)
  const words = await page.evaluate(() => document.querySelector("[data-drop-words]")?.textContent ?? "");
  await page.mouse.up(); await page.waitForTimeout(700);
  expect(words, "the chip names the end of the line, in columns").toMatch(/^After · Stack.* · 4 of 12$/);
  expect(await lineCols(page), "three on the line, the carried one last, 4 of 12 each").toEqual([4, 4, 4]);
});
