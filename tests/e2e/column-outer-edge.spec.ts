import { test, expect, type Page } from "@playwright/test";

/**
 * L-8 (BATCH LE-2) · A SPACE OPENED AT THE OUTER EDGE OF A COLUMN STAYS — rule 4 of the agreed layout rules, down a column.
 * Behaviours: tests/features/components/website/box-builder-fills-space.feature.
 *
 * BUILT THROUGH THE INTERFACE (RULE Y): a Stack tile, then three Image tiles put Inside it — the shape the builder makes
 * (each picture in its own row band), not a hand-written tree. Measured before the fix: the last picture's bottom edge
 * dragged up 80px stored a floor (`minHeight`) and drew the picture exactly as tall as before — no shrink, no space.
 */

const openPanel = async (page: Page) => { await page.getByRole("button", { name: "Open blocks panel" }).click(); await page.waitForTimeout(700); };
const closePanel = async (page: Page) => { const b = page.getByRole("button", { name: "Close blocks panel" }); if (await b.isVisible().catch(() => false)) { await b.click(); await page.waitForTimeout(500); } };
const clickTile = async (page: Page, text: string) => {
  await page.evaluate((t) => {
    const tile = Array.from(document.querySelectorAll<HTMLElement>('[draggable="true"]')).find((e) => (e.textContent || "").trim().startsWith(t));
    if (!tile) throw new Error(`no tile ${t}`);
    tile.click();
  }, text);
  await page.waitForTimeout(800);
};
const selectedId = (page: Page) => page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
/** Click the block until it is the selected one — each click goes one box deeper, as a person keeps clicking. */
async function select(page: Page, id: string) {
  for (let i = 0; i < 8 && (await selectedId(page)) !== id; i++) {
    const b = await page.locator(`[data-box-id="${id}"]`).boundingBox();
    if (!b) break;
    await page.mouse.click(b.x + b.width * 0.75, b.y + b.height * 0.75); await page.waitForTimeout(250);
  }
  expect(await selectedId(page)).toBe(id);
}
const deselect = async (page: Page) => { for (let i = 0; i < 4 && (await selectedId(page)); i++) { await page.keyboard.press("Escape"); await page.waitForTimeout(150); } };
const stored = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem("educo_box_site_v1") || "null"));
async function dragBottom(page: Page, dy: number) {
  const h = await page.locator('[aria-label="Resize bottom edge"]').first().boundingBox();
  expect(h, "the bottom edge's handle").not.toBeNull();
  const cx = h!.x + h!.width / 2, cy = h!.y + h!.height / 2;
  await page.mouse.move(cx, cy); await page.mouse.down();
  for (let i = 1; i <= 14; i++) { await page.mouse.move(cx, cy + (dy * i) / 14); await page.waitForTimeout(14); }
  await page.mouse.move(cx, cy + dy); await page.mouse.up(); await page.waitForTimeout(800);
}
/** The Stack, its pictures, and the space below the last — in PAGE px (÷ the canvas scale). */
const geo = (page: Page, stack: string, pics: string[]) => page.evaluate(([s, ps]) => {
  const z = +(document.querySelector("[data-canvas-scale]")?.getAttribute("data-canvas-scale") || 1);
  const r = (id: string) => document.querySelector(`[data-box-id="${id}"]`)!.getBoundingClientRect();
  const st = r(s as string), last = r((ps as string[])[(ps as string[]).length - 1]);
  return { stackH: st.height / z, picH: (ps as string[]).map((p) => r(p).height / z), below: (st.bottom - last.bottom) / z };
}, [stack, pics] as const);

async function build(page: Page) {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.addInitScript(() => { try { if (!sessionStorage.getItem("l8")) { localStorage.clear(); sessionStorage.setItem("l8", "1"); } } catch { /* private mode */ } });
  await page.goto("/website/box-demo", { waitUntil: "load" }); await page.waitForTimeout(2500);
  await openPanel(page); await clickTile(page, "Stack");
  const stack = (await selectedId(page))!; // a tile selects what it added
  // the first picture INSIDE the Stack, the next two AFTER the picture just added (it is selected) — one under another
  for (const where of ["Inside", "After", "After"]) {
    await page.getByRole("group", { name: "Where the block goes" }).getByRole("button", { name: where }).first().click(); await page.waitForTimeout(250);
    await clickTile(page, "Image");
  }
  await closePanel(page);
  const find = (n: { id: string; children?: unknown[] }): { id: string; type: string; rowBand?: boolean; children?: unknown[] } | null => { if (n.id === stack) return n as never; for (const c of (n.children ?? []) as { id: string }[]) { const f = find(c); if (f) return f; } return null; };
  const kids = ((find((await stored(page)).pages[0].root)!.children ?? []) as { id: string; type: string; rowBand?: boolean; children?: { id: string; type: string }[] }[]).flatMap((k) => (k.rowBand ? k.children ?? [] : [k]));
  expect(kids.map((k) => k.type)).toEqual(["image", "image", "image"]);
  return { stack, pics: kids.map((k) => k.id) };
}

test.describe("L-8 · the outer edge of a column", () => {
  test("the last picture's bottom edge up opens a space below it that stays — and dragged back, it closes", async ({ page }) => {
    const errs: string[] = []; page.on("pageerror", (e) => errs.push(e.message.split("\n")[0]));
    const { stack, pics } = await build(page);
    const g0 = await geo(page, stack, pics);
    await select(page, pics[2]); await dragBottom(page, -80);
    const g1 = await geo(page, stack, pics);
    expect(g0.picH[2] - g1.picH[2], "the picture got shorter by about the drag").toBeGreaterThan(60);
    expect(g1.below, "a space opened below it, at the edge dragged").toBeGreaterThan(60);
    expect(Math.abs(g1.stackH - g0.stackH), "the Stack kept its height").toBeLessThan(4);
    expect(Math.abs(g1.picH[0] - g0.picH[0]) + Math.abs(g1.picH[1] - g0.picH[1]), "the pictures above did not change").toBeLessThan(2);

    await page.reload(); await page.waitForSelector(`[data-box-id="${pics[2]}"]`); await page.waitForTimeout(1500);
    const g2 = await geo(page, stack, pics);
    expect(Math.abs(g2.below - g1.below), "the space is still there after a reload").toBeLessThan(2);

    await deselect(page); await select(page, pics[2]); await dragBottom(page, 80);
    const g3 = await geo(page, stack, pics);
    expect(g3.below, "dragged back, the space closes").toBeLessThan(4);
    expect(Math.abs(g3.picH[2] - g0.picH[2]), "…and the picture is its old height (A → B → A)").toBeLessThan(4);
    expect(errs).toEqual([]);
  });

  test("a picture between two others hands its height to the one below — no space between them", async ({ page }) => {
    const { stack, pics } = await build(page);
    const g0 = await geo(page, stack, pics);
    await select(page, pics[0]); await dragBottom(page, -60);
    const g1 = await geo(page, stack, pics);
    expect(g0.picH[0] - g1.picH[0], "the first got shorter").toBeGreaterThan(40);
    expect(g1.picH[1] - g0.picH[1], "the one below grew by what it gave up").toBeGreaterThan(40);
    expect(Math.abs(g1.stackH - g0.stackH), "the Stack kept its height").toBeLessThan(4);
    expect(Math.abs(g1.below - g0.below), "no space opened anywhere").toBeLessThan(2);
  });
});
