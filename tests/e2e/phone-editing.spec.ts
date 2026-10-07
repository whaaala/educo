import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * BUILDING ON A PHONE — BATCH E-5a, the user's decisions D1 · D3 · D4 · D5 · D6 (research: docs/web-anatomy/phone-editing.md).
 * Behaviours: tests/features/components/website/phone-editing.feature. Runs on every project: the phone asserts the phone,
 * the rest assert that nothing changed for them.
 */
const phone = (page: Page) => (page.viewportSize()?.width ?? 1280) < 600;
const stored = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}").pages[0].root);
type N = { id: string; type?: string; text?: string; rowBand?: boolean; children?: N[]; responsive?: Record<string, Record<string, unknown>> };
const flat = (n: N): N[] => [n, ...(n.children ?? []).flatMap(flat)];
/** The page's blocks in order, bands skipped — the three words, and NEW for an added (empty) Stack. */
const texts = (root: N) => flat(root).filter((n) => n.text || (n !== root && n.type === "container" && !n.rowBand && !n.children?.length))
  .map((n) => n.text ?? "NEW");

async function threeBlocks(page: Page) {
  // Three LINES down the page — the shape three palette adds make (each block on a band of its own); the headed pass builds it
  // through the UI, this regression guard pins it (RULE Y).
  const band = (id: string, kid: unknown) => ({ id: `band-${id}`, type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, children: [kid] });
  const s = sitePage([]);
  s.pages[0].root.children = [
    band("a", { id: "a", type: "heading", text: "Alpha", width: "auto" }),
    band("b", { id: "b", type: "text", text: "Bravo", width: "auto" }),
    band("c", { id: "c", type: "text", text: "Charlie", width: "auto" }),
  ];
  await seedSite(page, s, undefined, { phoneScreen: true });
  await page.waitForSelector('[data-box-id="c"]', { timeout: 15000 });
  await page.waitForTimeout(400);
}
async function tapBlock(page: Page, id: string) {
  const el = page.locator(`[data-box-id="${id}"]`);
  for (let i = 0; i < 4; i++) {
    if (await el.evaluate((e) => e.classList.contains("outline-indigo-500"))) return;
    if (test.info().project.use.hasTouch) await el.tap(); else await el.click();
    await page.waitForTimeout(150);
  }
  await expect(el).toHaveClass(/outline-indigo-500/);
}

test.describe("building on a phone (E-5a)", () => {
  test("D1 — a phone edits at its own width, 1:1; everything else keeps today's canvas", async ({ page }) => {
    await threeBlocks(page);
    const g = await page.evaluate(() => {
      const f = document.querySelector<HTMLElement>("[data-canvas-scale]")!;
      return { z: Number(f.dataset.canvasScale), w: f.getBoundingClientRect().width, vw: innerWidth };
    });
    const mobile = page.getByRole("button", { name: /^Mobile/ }).first();
    if (phone(page)) {
      expect(g.z, "drawn at 1:1, not shrunk").toBe(1);
      expect(g.w, "and across the phone, not a 375px page in a corner").toBeGreaterThan(g.vw * 0.75);
      await page.getByRole("button", { name: "More", exact: true }).click(); // the screen sizes are in More on a phone (E5a-16)
      await expect(mobile, "the Mobile device is the one being edited").toHaveAttribute("aria-pressed", "true");
      await page.keyboard.press("Escape");
    } else {
      await expect(mobile, "a larger screen does not switch to Mobile").toHaveAttribute("aria-pressed", "false");
    }
  });

  test("D3 — the blocks panel is a bottom sheet on a phone, the page still showing above it", async ({ page }) => {
    await threeBlocks(page);
    await page.getByRole("button", { name: "Open blocks panel" }).click();
    const dialog = page.getByRole("dialog", { name: "Blocks" });
    await expect(dialog).toBeVisible();
    const r = (await dialog.boundingBox())!;
    const vh = page.viewportSize()!.height, vw = page.viewportSize()!.width;
    if (phone(page)) {
      expect(Math.round(r.y + r.height), "it rises from the bottom edge").toBeGreaterThanOrEqual(vh - 1);
      expect(r.height, "at most 60 % of the screen, so the page shows above it").toBeLessThanOrEqual(vh * 0.6 + 1);
      expect(Math.round(r.width), "the width of the phone").toBeGreaterThanOrEqual(vw - 1);
      await page.goBack();
      await expect(dialog, "Back puts it away").toBeHidden();
      expect(page.url(), "and does not leave the builder").toContain("box-demo");
    } else {
      expect(r.y, "elsewhere it is today's panel, at the top").toBeLessThan(vh / 3);
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
    }
  });

  test("D3 — Before · After · Inside · Start · End put the block where they say", async ({ page }) => {
    await threeBlocks(page);
    const add = async (where: string | null) => {
      await page.getByRole("button", { name: "Open blocks panel" }).click();
      if (where) await page.getByRole("group", { name: "Where the block goes" }).getByRole("button", { name: where, exact: true }).click();
      await page.getByRole("button", { name: "Add Stack", exact: true }).click();
      await page.waitForTimeout(300);
      if (await page.getByRole("dialog", { name: "Blocks" }).isVisible()) await page.keyboard.press("Escape");
    };
    await tapBlock(page, "b");
    await add("Before");
    expect(texts(await stored(page)), "Before Bravo").toEqual(["Alpha", "NEW", "Bravo", "Charlie"]);
    await tapBlock(page, "a");
    await add("Start");
    expect(texts(await stored(page)), "Start — above everything").toEqual(["NEW", "Alpha", "NEW", "Bravo", "Charlie"]);
    await tapBlock(page, "c");
    await add(null); // the default: After
    expect(texts(await stored(page)), "a plain add goes after the selection").toEqual(["NEW", "Alpha", "NEW", "Bravo", "Charlie", "NEW"]);
  });

  test("D4 — the toolbar arrows move a block, and stop at the ends", async ({ page }) => {
    await threeBlocks(page);
    await tapBlock(page, "a");
    const bar = page.getByRole("toolbar", { name: "Block toolbar" });
    await expect(bar.getByRole("button", { name: "Move up" }), "nothing above the first block").toBeDisabled();
    await bar.getByRole("button", { name: "Move down" }).click();
    await page.waitForTimeout(250);
    expect(texts(await stored(page))).toEqual(["Bravo", "Alpha", "Charlie"]);
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(250);
    expect(texts(await stored(page)), "and the keyboard does the same").toEqual(["Bravo", "Charlie", "Alpha"]);
    await page.keyboard.press("Control+z");
    await page.waitForTimeout(250);
    expect(texts(await stored(page)), "Undo puts it back").toEqual(["Bravo", "Alpha", "Charlie"]);
  });

  test("D5 — ½ on a phone writes the phone only", async ({ page }) => {
    await threeBlocks(page);
    await tapBlock(page, "b");
    if (!(await page.getByRole("group", { name: "Width" }).first().isVisible())) {
      await page.getByRole("button", { name: "Expand inspector" }).click();
      await page.waitForTimeout(300);
    }
    const width = page.getByRole("group", { name: "Width" }).first();
    await width.scrollIntoViewIfNeeded();
    await width.getByRole("button", { name: "½" }).click();
    await page.waitForTimeout(300);
    const b = flat(await stored(page)).find((n) => n.id === "b") as N & { width?: string };
    if (phone(page)) {
      expect(b.responsive?.phone?.width, "the phone's own width").toBe("50%");
      expect(b.width, "the desktop untouched").toBe("auto");
    } else expect(b.width === "50%" || Object.values(b.responsive ?? {}).some((r) => r.width === "50%"), "written at the screen being edited").toBe(true);
  });

  test("D6 — every block-toolbar button is a finger's size on a touch screen, a mouse's elsewhere", async ({ page }) => {
    await threeBlocks(page);
    await tapBlock(page, "b");
    const sizes = await page.getByRole("toolbar", { name: "Block toolbar" }).locator("button").evaluateAll((bs) =>
      bs.map((b) => { const r = b.getBoundingClientRect(); return Math.min(r.width, r.height); }));
    const coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
    expect(sizes.length).toBeGreaterThan(2);
    if (coarse) expect(Math.min(...sizes), "44 × 44 for a finger").toBeGreaterThanOrEqual(44);
    else expect(Math.max(...sizes), "compact for a mouse").toBeLessThan(32);
  });
});

/**
 * A HANDLE CLICKED WITHOUT MOVING CHANGES NOTHING (E5a-8). The block path pinned the block — its height, its alignment — the
 * moment a handle was pressed, and committed it then: a still click kept it, and a block tapped by mistake held a height nobody
 * chose (measured: a grid's corner, 128px stored, its empty cells could no longer be dragged smaller). Every handle, every screen.
 */
test("a still click on any handle leaves the page exactly as it was", async ({ page }) => {
  await seedSite(page, sitePage([
    { id: "L", type: "container", direction: "column", width: "50%", minHeight: 160, background: "#c7d2fe", children: [] },
    { id: "R", type: "container", direction: "column", width: "50%", minHeight: 160, background: "#bbf7d0", children: [] },
  ]));
  await page.waitForSelector('[data-box-id="R"]'); await page.waitForTimeout(400);
  const before = await page.evaluate(() => localStorage.getItem("educo_box_site_v1"));
  const r = (await page.locator('[data-box-id="L"]').boundingBox())!;
  await page.mouse.click(r.x + r.width * 0.3, r.y + r.height * 0.3); await page.waitForTimeout(300);
  for (const edge of ["top-left corner", "bottom-right corner", "bottom edge", "right edge"]) {
    const h = (await page.locator(`[aria-label="Resize ${edge}"]`).first().boundingBox())!;
    await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2);
    await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up(); await page.waitForTimeout(250);
    expect(await page.evaluate(() => localStorage.getItem("educo_box_site_v1")), `a still click on the ${edge}`).toBe(before);
  }
});

/**
 * A FINGER'S TOOLBAR NEVER STICKS OUT ABOVE THE PAGE (E5a-11). The bar goes below a block that has no room above it, and "room"
 * was the mouse bar's 32 + 16px; a finger's bar is 52px tall, so a block 48–68px down the page hung its bar over the app's
 * header — c-20 again, on every touch screen. A block placed in exactly that band, on every screen: the bar stays on the page.
 */
test("the selected block's toolbar never sticks out above the page", async ({ page }) => {
  const s = sitePage([]);
  s.pages[0].root.children = [
    { id: "band-top", type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, children: [{ id: "spacer", type: "container", direction: "column", width: "100%", minHeight: 58, padding: 0, gap: 0, children: [{ id: "s0", type: "text", text: "·", width: "auto" }] }] },
    { id: "band-h", type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, children: [{ id: "h", type: "heading", text: "Sports day results", width: "auto" }] },
  ];
  await seedSite(page, s, undefined, { phoneScreen: true });
  await page.waitForSelector('[data-box-id="h"]'); await page.waitForTimeout(400);
  const h = page.locator('[data-box-id="h"]');
  for (let i = 0; i < 4 && !(await h.evaluate((e) => e.classList.contains("outline-indigo-500"))); i++) {
    const b = (await h.boundingBox())!; await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(200);
  }
  await page.waitForTimeout(300);
  const g = await page.evaluate(() => ({
    bar: document.querySelector('[role="toolbar"][aria-label="Block toolbar"]')!.getBoundingClientRect().top,
    page: document.querySelector('[data-box-id="root"]')!.getBoundingClientRect().top,
    block: document.querySelector('[data-box-id="h"]')!.getBoundingClientRect().top,
  }));
  expect(g.bar, `the bar starts on the page (block ${Math.round(g.block - g.page)}px down)`).toBeGreaterThanOrEqual(g.page - 1);
});

/**
 * THE PHONE'S BAR IS ONE ROW, THE REST IN "MORE" (E5a-16, the user 2026-10-07). Wrapped, it took four rows — ~250px of a 360 × 640
 * phone — and its tabs and chips were under a finger's size. Elsewhere the bar is what it was, and there is no More.
 */
test("a phone's top bar is one row, and More holds the rest", async ({ page }) => {
  await threeBlocks(page);
  const h = await page.evaluate(() => Math.round(document.querySelector("header")!.getBoundingClientRect().height));
  const more = page.getByRole("button", { name: "More", exact: true });
  if (!phone(page)) { await expect(more, "no More where the bar has room").toHaveCount(0); return; }
  expect(h, "one row (a finger's row is 65px)").toBeLessThanOrEqual(72);
  await more.click();
  const sheet = page.getByRole("dialog", { name: "More" });
  for (const name of ["Export", "Reset", "Layout guides", "Add page", "Page settings"]) await expect(sheet.getByRole("button", { name, exact: true })).toBeVisible();
  await expect(sheet.getByRole("group", { name: "Preview screen size" })).toBeVisible();
});

/**
 * ON A PHONE THE BLOCK TOOLBAR DOCKS AT THE BOTTOM (E5a-14). Hanging over the page, a finger's bar covered most of the block under
 * it, so a tap meant for that block landed on the bar. Elsewhere it stays by its block.
 */
test("on a phone the block toolbar docks at the bottom of the screen", async ({ page }) => {
  await threeBlocks(page);
  await tapBlock(page, "a");
  const g = await page.evaluate(() => {
    const t = document.querySelector('[role="toolbar"][aria-label="Block toolbar"]')!.getBoundingClientRect();
    const a = document.querySelector('[data-box-id="a"]')!.getBoundingClientRect();
    return { barBottom: t.bottom, vh: innerHeight, gapToBlock: Math.min(Math.abs(t.bottom - a.top), Math.abs(t.top - a.bottom)) };
  });
  if (phone(page)) expect(g.barBottom, "docked at the bottom edge").toBeGreaterThan(g.vh - 40);
  else expect(g.gapToBlock, "by its block, as before").toBeLessThan(40);
});
