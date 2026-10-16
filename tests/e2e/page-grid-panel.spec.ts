import { test, expect, type Page } from "@playwright/test";
import LAYOUT from "../../config/layout.json";
const DOCK = LAYOUT.editor.dockFrom; // the editor docks its panels from here (config/layout.json, RULE CFG)

/**
 * THE PAGE GRID PANEL SHOWS WHAT IT CHANGES (E-6; tests/features/components/website/box-builder-spacing.feature).
 *
 * The user, 2026-10-15: "any changes applied… does not show up on the grid straight away… I don't exactly know what I'm doing".
 * Measured through the UI (scripts/uat/probe-e6-5.js / probe-e6-7.js): the sliders were live, but on a page of full-width blocks
 * two of them moved nothing, nothing said which space was moving, and the panel lay over the right of the page (E6-7) — on a
 * phone it hung off the screen's left edge (E6-8). Built through the UI: blocks from the palette, the panel from its button.
 */
test.beforeEach(() => { test.skip(test.info().project.name !== "desktop-chrome", "sets its own windows"); });

async function open(page: Page, w: number, h: number, tiles: string[]) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto("/website/box-demo");
  await page.waitForFunction(() => { const b = [...document.querySelectorAll("button")].find((x) => x.getAttribute("aria-label") === "Open blocks panel"); return !!b && Object.keys(b).some((k) => k.startsWith("__reactProps")); }, null, { timeout: 60000 });
  await page.evaluate(() => { for (const k of Object.keys(localStorage)) localStorage.removeItem(k); });
  await page.reload(); await page.waitForTimeout(800);
  for (const t of tiles) {
    const opener = page.getByRole("button", { name: "Open blocks panel" }); // a phone closes the blocks sheet once a block is added
    if (await opener.isVisible().catch(() => false)) { await opener.click(); await page.waitForTimeout(400); }
    await page.locator('[draggable="true"]').filter({ hasText: new RegExp(`^\\s*${t}`) }).first().click(); await page.waitForTimeout(400);
  }
  const close = page.getByRole("button", { name: "Close blocks panel" });
  if (await close.isVisible().catch(() => false)) { await close.click(); await page.waitForTimeout(300); }
  await page.mouse.click(2, h - 4);
  const more = page.getByRole("button", { name: "More", exact: true }); // a phone / tablet bar keeps Guides in the More sheet
  if (await more.isVisible().catch(() => false)) { await more.click(); await page.getByRole("dialog", { name: "More" }).waitFor(); }
  await page.getByRole("button", { name: "Layout guides" }).filter({ visible: true }).first().click();
  const panel = page.locator('[role=dialog][aria-label="Page grid"]'); await panel.waitFor(); await page.waitForTimeout(300);
  return panel;
}

for (const [w, h] of [[375, 812], [768, 1024], [1024, 768], [1280, 800], [1536, 864], [1897, 1000]] as const) {
  test(`at ${w}: the panel is all on screen, and never over the page it changes where there is room beside it (E6-7, E6-8)`, async ({ page }) => {
    const panel = await open(page, w, h, ["Stack"]);
    await panel.evaluate((d) => d.scrollIntoView({ block: "end" })); // the More sheet scrolls; a person scrolls it to the panel's end
    const m = await page.evaluate(() => {
      const p = document.querySelector('[role=dialog][aria-label="Page grid"]')!.getBoundingClientRect();
      const g = document.querySelector("[data-layout-guides]")!; const sc = g.closest("[data-canvas-scroller]")!.getBoundingClientRect(); const r = g.getBoundingClientRect();
      const l = Math.max(r.left, sc.left), rt = Math.min(r.right, sc.right), t = Math.max(r.top, sc.top), b = Math.min(r.bottom, sc.bottom);
      return { p: [p.left, p.top, p.right, p.bottom], vw: innerWidth, vh: innerHeight, over: Math.max(0, Math.min(p.right, rt) - Math.max(p.left, l)) * Math.max(0, Math.min(p.bottom, b) - Math.max(p.top, t)) };
    });
    expect(m.p[0], "its left edge on screen").toBeGreaterThanOrEqual(0);
    expect(m.p[2], "its right edge on screen").toBeLessThanOrEqual(m.vw);
    expect(m.p[3], "its bottom reachable").toBeLessThanOrEqual(m.vh + 1);
    if (w >= DOCK) expect(m.over, "it covers none of the page").toBe(0);
  });
}

test("each space slider shades the space it moves, with its size, and the rows slider spaces the page's own rows (E6-5)", async ({ page }) => {
  const panel = await open(page, 1897, 1000, ["Stack", "Stack"]);
  const shade = (kind: string) => page.locator(`[data-space-shade="${kind}"] [data-shade]`);
  const rows = panel.getByLabel("Space between rows", { exact: true });
  const tops = () => page.evaluate(() => [...document.querySelectorAll("[data-box-id]")].map((e) => Math.round(e.getBoundingClientRect().top)));
  const before = await tops();
  await rows.focus(); for (let i = 0; i < 24; i++) await rows.press("ArrowRight");
  await expect(shade("rowGap")).toHaveCount(1); // the one gap between the two Stacks
  await expect(shade("rowGap").first()).toContainText(/rem$/);
  expect(await tops(), "the second Stack moved down").not.toEqual(before);
  const side = panel.getByLabel("Side space (padding)", { exact: true });
  await side.focus(); for (let i = 0; i < 24; i++) await side.press("ArrowRight");
  await expect(page.locator('[data-space-shade="rowGap"]')).toHaveCount(0); // one space at a time
  await expect(shade("side")).toHaveCount(4); // left, right, top, bottom
  await page.mouse.click(2, 996); // focus leaves the panel's sliders…
  await expect(page.locator("[data-space-shade]")).toHaveCount(0); // …and the shade goes with it
});

test("the lines a person SEES follow the columns, the row height and the rows at once — no scroll needed (E6-9, E6-10, E6-11)", async ({ page }) => {
  const panel = await open(page, 1916, 990, ["Stack"]);
  const drawn = () => page.evaluate(() => { const l = document.querySelector("[data-guide-lines]")!; const k = [...l.children].map((c) => c.getBoundingClientRect());
    return { v: k.filter((r) => r.width <= 1 && r.height > 5).length, h: k.filter((r) => r.height <= 1 && r.width > 5).length }; });
  const rowsOn = panel.getByLabel("Row lines in the guides"); if (!(await rowsOn.isChecked())) await rowsOn.check();
  const v0 = (await drawn()).v;
  for (let i = 0; i < 3; i++) await panel.getByLabel(/Columns on .*: one more/).first().click();
  await expect.poll(async () => (await drawn()).v, { timeout: 2000 }).toBe(v0 + 3); // three more column lines, drawn
  const h0 = (await drawn()).h;
  const height = panel.getByLabel("Row height", { exact: true }); await height.focus();
  for (let i = 0; i < 4; i++) await height.press("ArrowLeft"); // 1.5rem → 0.5rem: three times the lines
  await expect.poll(async () => (await drawn()).h, { timeout: 2000 }).toBeGreaterThan(h0);
  await panel.getByLabel("Rows on this page", { exact: true }).fill("4");
  // four rows: three lines between them (a fourth may sit ON the page's bottom edge, where the last row ends)
  await expect.poll(async () => [3, 4].includes((await drawn()).h), { timeout: 2000 }).toBe(true);
});
