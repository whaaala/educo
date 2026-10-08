import { test, expect, type Page, type CDPSession } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";
import { type BoxNode as BN, createContainer, markPageGrid, normalizeRowBands, makeRowBand } from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import { emptyPageRoot, siteFromRoot } from "@/lib/box-site";

/**
 * BUILDING ON A PHONE — BATCH E-5a, the user's decisions D1 · D3 · D4 · D5 · D6 (research: docs/web-anatomy/phone-editing.md).
 * Behaviours: tests/features/components/website/phone-editing.feature. Runs on every project: the phone asserts the phone,
 * the rest assert that nothing changed for them.
 */
const phone = (page: Page) => (page.viewportSize()?.width ?? 1280) < 600;
/** Where the block toolbar docks at the bottom: a phone, and a finger under 1024 (E-5c research rec. 4, E5c-5). */
const docksBar = (page: Page) => phone(page) || (!!test.info().project.use.hasTouch && (page.viewportSize()?.width ?? 1280) < 1024);
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
/** `position` for an EMPTY box: its centre is its "+", which adds rather than selects (E5a-9, E5b-1). */
async function tapBlock(page: Page, id: string, position?: { x: number; y: number }) {
  const el = page.locator(`[data-box-id="${id}"]`);
  for (let i = 0; i < 4; i++) {
    if (await el.evaluate((e) => e.classList.contains("outline-indigo-500"))) return;
    if (test.info().project.use.hasTouch) await el.tap({ position }); else await el.click({ position });
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
    } else if (g.vw < 1024) {
      // E-5c T1: a tablet edits at its own width too, on its rung — Tablet upright, Laptop from 900
      expect(g.z, "a tablet is drawn at 1:1, not the desktop page shrunk").toBe(1);
      await page.getByRole("button", { name: "More", exact: true }).click(); // a tablet has the phone's one-row bar too (E5c-2)
      const own = page.getByRole("button", { name: g.vw < 900 ? /^Tablet/ : /^Laptop/ }).first();
      await expect(own, "the tablet's own rung is the one being edited").toHaveAttribute("aria-pressed", "true");
      await expect(mobile, "a tablet does not switch to Mobile").toHaveAttribute("aria-pressed", "false");
      await page.keyboard.press("Escape");
    } else {
      await expect(mobile, "a larger screen does not switch to Mobile").toHaveAttribute("aria-pressed", "false");
      await expect(page.getByRole("button", { name: /^Full width/ }).first(), "from 1024 the desktop page, as before").toHaveAttribute("aria-pressed", "true");
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
    } else if (vw < 1024) {
      // E-5c T3: a tablet has the phone's sheet, capped at 32rem and centred
      expect(Math.round(r.y + r.height), "a tablet's sheet rises from the bottom edge").toBeGreaterThanOrEqual(vh - 1);
      expect(r.width, "no wider than 32rem").toBeLessThanOrEqual(512.5);
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
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
    } else if ((page.viewportSize()?.width ?? 1280) < 1024) {
      // E-5c T1 (C3): a tablet writes its own rung, and the desktop page is untouched
      const rung = (page.viewportSize()?.width ?? 0) < 900 ? "tabletPortrait" : "tabletLandscape";
      expect(b.responsive?.[rung]?.width, `the ${rung} rung's own width`).toBe("50%");
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
  let clicked = 0;
  for (const edge of ["top-left corner", "bottom-right corner", "bottom edge", "right edge"]) {
    const h = await page.locator(`[aria-label="Resize ${edge}"]`).first().boundingBox();
    if (!h) continue; // a finger's handle in the screen edge's Back strip is not drawn (E5d-3) — the others are clicked
    clicked += 1;
    await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2);
    await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up(); await page.waitForTimeout(250);
    expect(await page.evaluate(() => localStorage.getItem("educo_box_site_v1")), `a still click on the ${edge}`).toBe(before);
  }
  expect(clicked, "at least three handles were there to click").toBeGreaterThanOrEqual(3);
});

/**
 * E5b-3 · A CORNER LETS ITS BLOCK FOLLOW ITS BAND, AND A STILL PRESS COMMITS NOTHING AT ITS RELEASE EITHER. A corner drag kept the
 * `flex-start` anchor for good (only a pure top / bottom drag released it), so the block stopped following its band; and a still
 * press on a handle ran the release's write — which is how it showed: a tap after a corner drag rewrote the page. Every screen.
 * The second half seeds the leftover the corner used to leave (RULE Y: reproduced through the UI first, `probe-e5b.js`).
 */
test("a corner drag lets the block follow its band, and a still press on a handle writes nothing", async ({ page }) => {
  const row = (kids: unknown[]) => sitePage([{ id: "band-1", type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, children: kids }]);
  await seedSite(page, row([
    { id: "L", type: "container", direction: "column", width: "50%", minHeight: 160, background: "#c7d2fe", children: [] },
    { id: "R", type: "container", direction: "column", width: "50%", minHeight: 160, background: "#bbf7d0", children: [] },
  ]));
  await page.waitForSelector('[data-box-id="R"]'); await page.waitForTimeout(400);
  const r = (await page.locator('[data-box-id="L"]').boundingBox())!;
  await page.mouse.click(r.x + r.width * 0.3, r.y + r.height * 0.3); await page.waitForTimeout(300);
  const c = (await page.locator('[aria-label="Resize bottom-right corner"]').first().boundingBox())!;
  await page.mouse.move(c.x + c.width / 2, c.y + c.height / 2); await page.mouse.down();
  await page.mouse.move(c.x + c.width / 2 - 10, c.y + c.height / 2 + 20, { steps: 6 }); await page.mouse.move(c.x + c.width / 2 - 10, c.y + c.height / 2 + 40, { steps: 6 });
  await page.mouse.up(); await page.waitForTimeout(400);
  const L = JSON.stringify(flat(await stored(page)).find((n) => n.id === "L"));
  expect.soft(L, "the corner's height anchor was released — the block follows its band again").not.toContain('"alignSelf":"flex-start"');

  await seedSite(page, row([
    { id: "L", type: "container", direction: "column", width: "50%", minHeight: 160, alignSelf: "flex-start", background: "#c7d2fe", children: [] },
    { id: "R", type: "container", direction: "column", width: "50%", minHeight: 200, background: "#bbf7d0", children: [] },
  ]));
  await page.waitForSelector('[data-box-id="R"]'); await page.waitForTimeout(400);
  const before = await page.evaluate(() => localStorage.getItem("educo_box_site_v1"));
  const q = (await page.locator('[data-box-id="L"]').boundingBox())!;
  await page.mouse.click(q.x + q.width * 0.3, q.y + q.height * 0.3); await page.waitForTimeout(300);
  const h = (await page.locator('[aria-label="Resize bottom edge"]').first().boundingBox())!;
  await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up(); await page.waitForTimeout(300);
  expect.soft(await page.evaluate(() => localStorage.getItem("educo_box_site_v1")), "a still press on the bottom edge wrote nothing").toBe(before);
});

/**
 * E5b-16 · WHILE A GRID CELL'S EDGE IS HELD, THE PAGE KEEPS ITS SHAPE. The live preview painted every cell's stored `grid-column`
 * and the stored row tracks, overriding the stylesheet that stacks a narrow grid into one column — so mid-drag the cells jumped
 * side by side, the page got 250px shorter and the editor's scroll was clamped (measured on a 360 phone, mouse and finger alike).
 * Built through the sheet (RULE Y), as `probe-scroll2.js` reproduced it; a phone, where a 2-across grid is one column.
 */
test("while a grid cell's edge is held, the cells keep their arrangement and the editor does not scroll", async ({ page }) => {
  test.skip(!phone(page), "a 2-across grid is one column only on a phone");
  await seedSite(page, sitePage([]), undefined, { phoneScreen: true });
  await page.waitForSelector('[aria-label="Open blocks panel"]'); await page.waitForTimeout(400);
  for (const [tile, layout] of [["Heading", null], ["Stack", null], ["Stack", null], ["Stack", null], ["Grid", "2 across, 1 down"]] as const) {
    await page.getByRole("button", { name: "Open blocks panel" }).tap();
    await page.getByRole("button", { name: new RegExp(`^Add ${tile}( —|$)`) }).first().tap(); await page.waitForTimeout(400);
    const look = page.getByRole("menuitem", { name: "Default", exact: true }).first();
    if (await look.isVisible().catch(() => false)) await look.tap();
    if (layout) await page.locator(`[role="menu"][aria-label="Choose a layout"] [aria-label="${layout}"]`).first().tap();
    await page.waitForTimeout(400);
    if (await page.getByRole("dialog", { name: "Blocks" }).isVisible()) await page.keyboard.press("Escape");
  }
  const r0 = (await stored(page)) as N & { layout?: string };
  const grid = flat(r0).find((n) => (n as { layout?: string }).layout === "grid")!;
  const [c1, c2] = grid.children!.map((c) => c.id);
  await tapBlock(page, c1, { x: 20, y: 12 }); await page.waitForTimeout(800);
  const scroller = () => page.evaluate(() => { let n = document.querySelector<HTMLElement>("[data-canvas-scale]"); while (n && !(/(auto|scroll)/.test(getComputedStyle(n).overflowY) && n.scrollHeight > n.clientHeight)) n = n.parentElement; return n ? n.scrollTop : -1; });
  await page.evaluate(() => { let n = document.querySelector<HTMLElement>("[data-canvas-scale]"); while (n && !(/(auto|scroll)/.test(getComputedStyle(n).overflowY) && n.scrollHeight > n.clientHeight)) n = n.parentElement; if (n) n.scrollTop = n.scrollHeight; });
  await page.waitForTimeout(400);
  const s0 = await scroller();
  expect(s0, "the editor scrolls, and is at its bottom").toBeGreaterThan(0);
  const stackedAt = () => page.evaluate(([a, b]) => { const p = document.querySelector(`[data-box-id="${a}"]`)!.getBoundingClientRect(), q = document.querySelector(`[data-box-id="${b}"]`)!.getBoundingClientRect(); return q.top >= p.bottom - 1 && Math.abs(q.left - p.left) < 2; }, [c1, c2]);
  expect(await stackedAt(), "a phone stacks the 2-across grid").toBe(true);
  const h = (await page.locator('[aria-label="Resize bottom edge"]').first().boundingBox())!;
  await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await page.mouse.down();
  for (let i = 1; i <= 8; i++) { await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2 + 5 * i); await page.waitForTimeout(16); }
  await page.waitForTimeout(100);
  const during = { scroll: await scroller(), stacked: await stackedAt() };
  await page.mouse.up(); await page.waitForTimeout(300);
  expect(during.stacked, "mid-drag the cells are still stacked").toBe(true);
  expect(during.scroll, "mid-drag the editor has not scrolled").toBe(s0);
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
 * phone — and its tabs and chips were under a finger's size. A tablet too (E5c-2, the user 2026-10-07); from 1024 the bar is what it was.
 */
test("a phone's (and a tablet's) top bar is one row, and More holds the rest", async ({ page }) => {
  await threeBlocks(page);
  const h = await page.evaluate(() => Math.round(document.querySelector("header")!.getBoundingClientRect().height));
  const more = page.getByRole("button", { name: "More", exact: true });
  if ((page.viewportSize()?.width ?? 1280) >= 1024) { await expect(more, "no More where the bar has room").toHaveCount(0); return; }
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
test("on a 360 phone the docked toolbar never runs under the blocks + (E5b-8)", async ({ page }) => {
  test.skip(!phone(page), "only a phone docks the toolbar");
  await page.setViewportSize({ width: 360, height: 640 }); // a Tecno / itel-class phone, the narrowest the research names
  const s = sitePage([]);
  s.pages[0].root.children = [band("band-S", [{ id: "S", type: "container", direction: "column", width: "100%", minHeight: 120, children: [] }])];
  await seedSite(page, s, undefined, { phoneScreen: true });
  await page.waitForSelector('[data-box-id="S"]'); await page.waitForTimeout(400);
  await tapBlock(page, "S", { x: 16, y: 12 }); // a Stack: its bar has the most buttons (+ inside)
  const g = await page.evaluate(() => {
    const bar = document.querySelector('[role="toolbar"][aria-label="Block toolbar"]')!.getBoundingClientRect();
    const plus = document.querySelector('[aria-label="Open blocks panel"]')!.getBoundingClientRect();
    const menu = document.querySelector('[role="toolbar"][aria-label="Block toolbar"] [aria-label="Block actions"]')!.getBoundingClientRect();
    return { barRight: bar.right, plusLeft: plus.left, menuRight: menu.right, barScrolls: document.querySelector('[role="toolbar"][aria-label="Block toolbar"]')!.scrollWidth > document.querySelector('[role="toolbar"][aria-label="Block toolbar"]')!.clientWidth + 1 };
  });
  expect(g.barRight, "the bar ends before the blocks +").toBeLessThanOrEqual(g.plusLeft);
  expect(g.barScrolls, "and every button fits, ⋮ included, with nothing scrolled out of sight").toBe(false);
  expect(g.menuRight, "⋮ is in sight").toBeLessThanOrEqual(g.plusLeft);
});

test("on a phone (and a finger's tablet) the block toolbar docks at the bottom of the screen", async ({ page }) => {
  await threeBlocks(page);
  await tapBlock(page, "a");
  const g = await page.evaluate(() => {
    const t = document.querySelector('[role="toolbar"][aria-label="Block toolbar"]')!.getBoundingClientRect();
    const a = document.querySelector('[data-box-id="a"]')!.getBoundingClientRect();
    return { barBottom: t.bottom, vh: innerHeight, gapToBlock: Math.min(Math.abs(t.bottom - a.top), Math.abs(t.top - a.bottom)) };
  });
  if (docksBar(page)) expect(g.barBottom, "docked at the bottom edge").toBeGreaterThan(g.vh - 40);
  else expect(g.gapToBlock, "by its block, as before").toBeLessThan(40);
});

/**
 * A FINGER DRAGS AND RESIZES — BATCH E-5b (E5a-1, D4, D6, E4-9). Real touch events through CDP, not the mouse: every resize and
 * drag listened to the mouse only, and a finger sends no mouse drag, so on a phone or a tablet nothing could be resized or
 * dragged at all. Only the touch projects run these; the mouse's own suites prove the mouse unchanged.
 */
type Pt = { x: number; y: number };
const touchAt = (cdp: CDPSession, type: "touchStart" | "touchMove" | "touchEnd", p?: Pt) =>
  cdp.send("Input.dispatchTouchEvent", { type, touchPoints: p ? [{ x: Math.round(p.x), y: Math.round(p.y), id: 1 }] : [] });
/** One finger down at the first point, held `holdMs`, moved through the rest, lifted. */
async function finger(page: Page, path: Pt[], { holdMs = 0, stepMs = 16 } = {}) {
  const cdp = await page.context().newCDPSession(page);
  await touchAt(cdp, "touchStart", path[0]);
  if (holdMs) await page.waitForTimeout(holdMs);
  for (const p of path.slice(1)) { await touchAt(cdp, "touchMove", p); await page.waitForTimeout(stepMs); }
  await touchAt(cdp, "touchEnd");
  await cdp.detach();
  await page.waitForTimeout(300);
}
/** A straight line in `n` steps — a finger's drag, not a jump. */
const line = (a: Pt, b: Pt, n = 10): Pt[] => Array.from({ length: n + 1 }, (_, i) => ({ x: a.x + ((b.x - a.x) * i) / n, y: a.y + ((b.y - a.y) * i) / n }));
const mid = (r: { x: number; y: number; width: number; height: number }): Pt => ({ x: r.x + r.width / 2, y: r.y + r.height / 2 });
const scrolled = (page: Page) => page.evaluate(() => [scrollY, ...Array.from(document.querySelectorAll("*")).map((e) => e.scrollTop)].join());
const band = (id: string, kids: unknown[]) => ({ id, type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, children: kids });

test.describe("a finger drags and resizes (E-5b)", () => {
  test.beforeEach(() => { test.skip(!test.info().project.use.hasTouch, "a finger needs a touch screen; the mouse suites cover the mouse"); });

  test("E5d-3 — no handle a finger can see lies in the screen edge's Back strip; the block still resizes from its other side", async ({ page }) => {
    test.skip(!test.info().project.use.hasTouch, "a mouse has no edge gesture");
    await threeBlocks(page);
    await tapBlock(page, "a");
    const shown = await page.locator('[aria-label^="Resize "]').evaluateAll((els) => els.filter((e) => e.getBoundingClientRect().width > 0)
      .map((e) => { const r = e.getBoundingClientRect(); return { l: e.getAttribute("aria-label"), x: Math.round(r.left + r.width / 2) }; }));
    const vw = page.viewportSize()!.width;
    // measured on the Pixel (gesture navigation): a swipe from x ≤ 23dp went Back and left the editor; from 30dp it did not.
    // 32 leaves a finger room to aim. A handle that would sit closer is NOT DRAWN (the user's decision 2026-10-08, E5d-10:
    // a gutter cost a 360 phone 32px; handles inside the block caught its own presses)
    for (const h of shown) expect(h.x >= 32 && h.x <= vw - 32, `${h.l} at x=${h.x} of ${vw}`).toBe(true);
    expect(shown.map((h) => h.l), "the block still resizes: its right edge and its bottom").toEqual(expect.arrayContaining(["Resize right edge", "Resize bottom edge"]));
    // a hidden handle takes its finger's hit area with it — nothing invisible waits in the strip
    const hidden = new Set(["w", "nw", "sw", "e", "ne", "se"].filter((e) => !shown.some((h) => h.l === `Resize ${({ w: "left edge", nw: "top-left corner", sw: "bottom-left corner", e: "right edge", ne: "top-right corner", se: "bottom-right corner" } as Record<string, string>)[e]}`)));
    const hits = await page.locator("[data-handle-hit]").evaluateAll((els) => els.filter((e) => e.getBoundingClientRect().width > 0).map((e) => e.getAttribute("data-handle-hit")));
    for (const e of hits) expect(hidden.has(e!), `hit area ${e} shows for a hidden handle`).toBe(false);
  });

  test("a finger resizes a block by its bottom handle; its top stays put and the page does not scroll", async ({ page }) => {
    const s = sitePage([]);
    s.pages[0].root.children = [band("band-L", [{ id: "L", type: "container", direction: "column", width: "50%", minHeight: 120, background: "#c7d2fe", children: [] }])];
    await seedSite(page, s, undefined, { phoneScreen: true });
    await page.waitForSelector('[data-box-id="L"]'); await page.waitForTimeout(400);
    await tapBlock(page, "L", { x: 16, y: 12 });
    const b0 = (await page.locator('[data-box-id="L"]').boundingBox())!;
    const h = mid((await page.locator('[aria-label="Resize bottom edge"]').first().boundingBox())!);
    const s0 = await scrolled(page);
    await finger(page, line(h, { x: h.x, y: h.y + 60 }));
    const b1 = (await page.locator('[data-box-id="L"]').boundingBox())!;
    expect(b1.height - b0.height, "the block grew with the finger").toBeGreaterThan(30);
    expect(Math.abs(b1.y - b0.y), "the top it was not held by stayed where it was (rule 19)").toBeLessThan(2);
    expect(await scrolled(page), "nothing scrolled under the finger").toBe(s0);
  });

  test("a finger drags a block by its grip where the toolbar sits by its block; a phone's docked bar has none", async ({ page }) => {
    await threeBlocks(page);
    await tapBlock(page, "a");
    const grip = page.getByRole("toolbar", { name: "Block toolbar" }).getByLabel("Drag to move");
    if (docksBar(page)) { await expect(grip, "a docked bar has no grip — a long press is the drag there (E5b-8)").toHaveCount(0); return; }
    await expect(grip, "the grip is offered to a finger").toBeVisible();
    const g = (await grip.boundingBox())!;
    expect(Math.min(g.width, g.height), "at a finger's size").toBeGreaterThanOrEqual(44);
    const c = (await page.locator('[data-box-id="c"]').boundingBox())!;
    await finger(page, line(mid(g), { x: c.x + c.width / 2, y: c.y + c.height - 2 }, 14));
    expect(texts(await stored(page)), "Alpha now under Charlie").toEqual(["Bravo", "Charlie", "Alpha"]);
  });

  test("E5c-5 — with a block selected, a finger can still tap the block above it: the bar never covers it", async ({ page }) => {
    // Found through the UI (uat-e5c-headed.js U2 at 800 / 962 / 1007): by its block, a Stack's 52px bar hid the Heading above, and a
    // tap on what showed of it was pulled onto the bar by Chrome's touch adjustment — the next grip drag moved the Stack instead.
    // The palette's own Heading and Stack (as the UI adds them), the Stack half wide and tall, at the commonest African tablet sideways.
    await page.setViewportSize({ width: 962, height: 601 });
    const stack = { ...blockForKind("container"), width: "50%", minHeight: 208 } as BN;
    const head = blockForKind("heading") as BN;
    const root = normalizeRowBands({ ...emptyPageRoot(), children: [head, stack] } as BN);
    await seedSite(page, siteFromRoot(root), undefined, { phoneScreen: true });
    const H = page.locator(`[data-box-id="${head.id}"]`), S = page.locator(`[data-box-id="${stack.id}"]`);
    await S.waitFor(); await page.waitForTimeout(400);
    await tapBlock(page, stack.id, { x: 16, y: 12 });
    const h = (await H.boundingBox())!;
    await page.touchscreen.tap(h.x + Math.min(40, h.width / 2), h.y + h.height / 2); await page.waitForTimeout(300);
    await expect(H, "one tap on the Heading selects it").toHaveClass(/outline-indigo-500/);
  });

  test("E5c-6 — on a tablet a finger moves a floating block by the docked bar's grip, on the tablet's own rung", async ({ page }) => {
    // Found through the UI (uat-e5c-headed.js U1, every tablet): the docked bar (E5c-5) had no grip, and a long press moves only a
    // block in the flow — a floating block could not be moved by a finger at all. A float keeps the grip in the docked bar.
    await page.setViewportSize({ width: 962, height: 601 });
    const head = { ...blockForKind("heading"), position: "absolute", left: 10, top: 10 } as BN;
    await seedSite(page, siteFromRoot(normalizeRowBands({ ...emptyPageRoot(), children: [head] } as BN)), undefined, { phoneScreen: true });
    await page.locator(`[data-box-id="${head.id}"]`).waitFor(); await page.waitForTimeout(400);
    await tapBlock(page, head.id, { x: 8, y: 8 });
    const grip = page.getByRole("toolbar", { name: "Block toolbar" }).getByLabel("Drag to move");
    await expect(grip, "the docked bar offers a floating block its grip").toBeVisible();
    const g = mid((await grip.boundingBox())!);
    await finger(page, line(g, { x: g.x + 40, y: g.y - 60 }));
    const n = flat(await stored(page)).find((x) => x.id === head.id) as N & { left?: number; top?: number };
    const r = n.responsive?.tabletLandscape as { left?: number; top?: number } | undefined;
    expect(r?.left !== undefined || r?.top !== undefined, `moved on the tablet's own rung: ${JSON.stringify(n.responsive)}`).toBe(true);
    expect([n.left, n.top], "the desktop page's position untouched").toEqual([10, 10]);
  });

  test("a long press lifts a block, its chip above the finger; a short tap and a swipe move nothing", async ({ page }) => {
    await threeBlocks(page);
    const a = mid((await page.locator('[data-box-id="a"]').boundingBox())!);
    await finger(page, [a], { holdMs: 120 });
    expect(texts(await stored(page)), "a tap moves nothing").toEqual(["Alpha", "Bravo", "Charlie"]);
    const c0 = (await page.locator('[data-box-id="c"]').boundingBox())!;
    await finger(page, line(a, { x: a.x, y: c0.y + c0.height - 2 }, 6), { stepMs: 8 });
    expect(texts(await stored(page)), "a swipe moves nothing").toEqual(["Alpha", "Bravo", "Charlie"]);
    const a1 = mid((await page.locator('[data-box-id="a"]').boundingBox())!);
    const c = (await page.locator('[data-box-id="c"]').boundingBox())!;
    const cdp = await page.context().newCDPSession(page);
    await touchAt(cdp, "touchStart", a1); await page.waitForTimeout(650);
    await touchAt(cdp, "touchMove", { x: a1.x, y: a1.y + 6 }); await page.waitForTimeout(100);
    const chipBottom = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('body > div[aria-hidden="true"]')]
      .find((d) => d.style.position === "fixed" && d.textContent)?.getBoundingClientRect().bottom ?? null);
    expect(chipBottom, "a chip shows the lifted block").not.toBeNull();
    expect(chipBottom!, "above the finger, 32px clear").toBeLessThanOrEqual(a1.y + 6 - 30);
    await touchAt(cdp, "touchMove", { x: 6, y: a1.y + 6 }); await page.waitForTimeout(100); // the finger at the screen's left edge
    const chipX = await page.evaluate(() => { const r = [...document.querySelectorAll<HTMLElement>('body > div[aria-hidden="true"]')].find((d) => d.style.position === "fixed" && d.textContent)!.getBoundingClientRect(); return { left: r.left, right: r.right, vw: innerWidth }; });
    expect(chipX.left, "the chip stays on the screen at its left edge (E5b-7)").toBeGreaterThanOrEqual(0);
    expect(chipX.right, "…and inside its right edge").toBeLessThanOrEqual(chipX.vw);
    for (const p of line({ x: a1.x, y: a1.y + 6 }, { x: c.x + c.width / 2, y: c.y + c.height - 2 }, 10)) { await touchAt(cdp, "touchMove", p); await page.waitForTimeout(16); }
    await touchAt(cdp, "touchEnd"); await cdp.detach(); await page.waitForTimeout(300);
    expect(texts(await stored(page)), "lifted and dropped under Charlie").toEqual(["Bravo", "Charlie", "Alpha"]);
  });

  /**
   * E5b-2 · E5b-4: a top edge lying over a HEADING. Chrome's touch adjustment moves a press to the nearest node "a tap is for",
   * and an editable span is one while a bare handle was not — so the press went to the words and was cancelled. And D6's 44px.
   */
  test("a finger holds a top handle that lies over a heading's words, and every handle is a finger's size", async ({ page }) => {
    // BUILT THROUGH THE SHEET (RULE Y) — the shape `probe-e5b.js` reproduced it in: a Heading, then a Stack under it.
    await seedSite(page, sitePage([]), undefined, { phoneScreen: true });
    await page.waitForSelector('[aria-label="Open blocks panel"]'); await page.waitForTimeout(400);
    for (const tile of ["Heading", "Stack"]) {
      await page.getByRole("button", { name: "Open blocks panel" }).tap();
      await page.getByRole("button", { name: new RegExp(`^Add ${tile}( —|$)`) }).first().tap(); await page.waitForTimeout(400);
      const look = page.getByRole("menuitem", { name: "Default", exact: true }).first();
      if (await look.isVisible().catch(() => false)) await look.tap();
      await page.waitForTimeout(300);
      if (await page.getByRole("dialog", { name: "Blocks" }).isVisible()) await page.keyboard.press("Escape");
    }
    const r0 = (await stored(page)) as N;
    const L = flat(r0).find((n) => n.type === "container" && !n.rowBand && n !== r0 && !n.children?.length)!.id;
    await tapBlock(page, L, { x: 16, y: 40 });
    const b0 = (await page.locator(`[data-box-id="${L}"]`).boundingBox())!;
    const h = mid((await page.locator('[aria-label="Resize top edge"]').first().boundingBox())!);
    await finger(page, line(h, { x: h.x, y: h.y + 30 }));
    const b1 = (await page.locator(`[data-box-id="${L}"]`).boundingBox())!;
    expect(b0.height - b1.height, "the top edge came down with the finger").toBeGreaterThan(15);
    expect(Math.abs(b1.y + b1.height - (b0.y + b0.height)), "the bottom it was not held by stayed (rule 19)").toBeLessThan(2);
    // Every handle has its hit area, 44 × 44, OUTSIDE the block (E5b-14) and UNDER the handles (E5b-15): a press on any handle's
    // centre is that handle, and a press in the block's middle is the block's.
    // (a handle in the screen edge's Back strip is not drawn, and neither is its hit area — E5d-3)
    const hit = await page.locator("[data-handle-hit]").evaluateAll((hs) => hs.filter((h) => h.getBoundingClientRect().width > 0).map((h) => { const r = h.getBoundingClientRect(); return Math.min(r.width, r.height); }));
    const drawn = await page.locator('[aria-label^="Resize "]').evaluateAll((hs) => hs.filter((h) => h.getBoundingClientRect().width > 0).length);
    expect(hit.length, "a hit area for each handle that is drawn").toBe(drawn);
    expect(drawn, "most of the 8 handles are drawn").toBeGreaterThanOrEqual(5);
    expect(Math.min(...hit), "every handle's hit area is 44 × 44 for a finger").toBeGreaterThanOrEqual(44);
    const own = await page.locator('[aria-label^="Resize "]').evaluateAll((hs) => hs.filter((h) => h.getBoundingClientRect().width > 0).map((h) => { const r = h.getBoundingClientRect(); return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === h; }));
    expect(own.every(Boolean), "a press on each handle's centre is that handle").toBe(true);
    const inside = await page.locator(`[data-box-id="${L}"]`).evaluate((el) => { const r = el.getBoundingClientRect(); return !!document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)?.closest("[data-handle-hit]"); });
    expect(inside, "no hit area lies over the block's own middle").toBe(false);
  });

  test("a drop strip is a finger's size: between a mouse's strip and a finger's, a tall box's bottom means BELOW it", async ({ page }) => {
    const s = sitePage([]);
    s.pages[0].root.children = [
      band("band-T", [{ id: "T", type: "text", text: "Tango", width: "auto" }]),
      band("band-R", [
        { id: "L", type: "container", direction: "column", width: "50%", minHeight: 200, background: "#c7d2fe", children: [] },
        { id: "R", type: "container", direction: "column", width: "50%", minHeight: 200, background: "#bbf7d0", children: [] }]),
    ];
    await seedSite(page, s, undefined, { phoneScreen: true });
    await page.waitForSelector('[data-box-id="R"]'); await page.waitForTimeout(400);
    const t = mid((await page.locator('[data-box-id="T"]').boundingBox())!);
    const r = (await page.locator('[data-box-id="R"]').boundingBox())!;
    const mouse = Math.min(r.height * 0.22, 22), fingerStrip = Math.max(mouse, Math.min(44, r.height / 3));
    expect(fingerStrip - mouse, "the box is tall enough for the two strips to differ").toBeGreaterThan(8);
    await finger(page, line(t, { x: r.x + r.width / 2, y: r.y + r.height - (mouse + fingerStrip) / 2 }, 12), { holdMs: 650 });
    const root = (await stored(page)) as N;
    // Anywhere in R's subtree, not only as its child: a block dropped inside a box is wrapped in a band of its own (E5b-5).
    expect(flat(flat(root).find((n) => n.id === "R")!).some((n) => n.id === "T"), "not dropped INSIDE the green box").toBe(false);
    expect(texts(root)[0], "Tango left the top of the page").not.toBe("Tango");
  });
});

/**
 * THE EDITOR ON A TABLET — BATCH E-5c, the user's decisions T1 · T3 (research: docs/web-anatomy/tablet-and-app-editing.md).
 * Each test sets its own windows, so it runs once (desktop-chrome); the tablet projects run D1 / D5 above at 768 and 1024.
 */
test.describe("the editor on a tablet (E-5c)", () => {
  test.beforeEach(() => { test.skip(test.info().project.name !== "desktop-chrome", "sets its own windows"); });
  /** The pressed screen size — in the bar's More sheet under 1024 (E5a-16, E5c-2), opened and put away as a person does. */
  const pressed = async (page: Page) => {
    const more = page.getByRole("button", { name: "More", exact: true }), inMore = await more.isVisible();
    if (inMore) { await more.click(); await page.getByRole("dialog", { name: "More" }).waitFor(); }
    const d = await page.evaluate(() => (["Mobile", "Tablet", "Laptop", "Desktop", "Full width"] as const).find((t) => document.querySelector(`button[title^="${t}"]`)?.getAttribute("aria-pressed") === "true"));
    if (inMore) { await page.keyboard.press("Escape"); await expect(page.getByRole("dialog", { name: "More" })).toHaveCount(0); }
    return d;
  };
  const choose = async (page: Page, device: string) => {
    await page.getByRole("button", { name: "More", exact: true }).click();
    await page.getByRole("dialog", { name: "More" }).locator(`button[title^="${device}"]`).click();
    await page.keyboard.press("Escape"); await page.waitForTimeout(350);
  };
  const scale = (page: Page) => page.evaluate(() => Number(document.querySelector<HTMLElement>("[data-canvas-scale]")!.dataset.canvasScale));
  const inspectorDocked = (page: Page) => page.evaluate(() => { const e = document.querySelector('aside[aria-label="Inspector"]'); return !!e && getComputedStyle(e).position === "static"; });
  const barH = (page: Page) => page.evaluate(() => document.querySelector("header")!.getBoundingClientRect().height);

  test("T1 — the device follows the window at every line, a turned tablet included, and 1:1 below 1024", async ({ page }) => {
    await page.setViewportSize({ width: 601, height: 1007 });
    await threeBlocks(page);
    // [window, the device it edits]: 600 | 601 and 962 are the African tablets (T2). Under 1024 the Inspector is its tab and the
    // bar one row (E5c-4, E5c-2 — the user 2026-10-07); from 1024 the desktop page, the Inspector docked, the full bar
    const steps: [number, number, string][] = [[601, 1007, "Tablet"], [1007, 601, "Laptop"], [962, 601, "Laptop"], [899, 700, "Tablet"],
      [900, 700, "Laptop"], [1024, 768, "Full width"], [768, 1024, "Tablet"], [1023, 768, "Laptop"], [600, 900, "Tablet"], [599, 900, "Mobile"]];
    for (const [w, h, device] of steps) {
      await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(450);
      expect(await pressed(page), `${w} × ${h} edits ${device}`).toBe(device);
      if (device !== "Full width") expect(await scale(page), `${w} × ${h} is drawn 1:1`).toBe(1);
      expect(await inspectorDocked(page), `${w} × ${h}: the Inspector ${w >= 1024 ? "docked" : "a tab"}`).toBe(w >= 1024);
      if (w < 1024) expect(await barH(page), `${w} × ${h}: the bar is one row`).toBeLessThan(64);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${w} × ${h}: no sideways scroll`).toBe(true);
    }
  });

  test("T1 — the device control on a tablet still offers the desktop page, and back to 1:1", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await threeBlocks(page);
    await choose(page, "Desktop");
    expect(await scale(page), "the 1280 desktop page shrunk to fit").toBeLessThan(1);
    await choose(page, "Tablet");
    expect(await scale(page), "Tablet again: the tablet's own width").toBe(1);
  });

  test("T3 — the blocks panel on a tablet is the phone's sheet, capped at 32rem and centred", async ({ page }) => {
    for (const [w, h] of [[601, 1007], [768, 1024], [962, 601]] as const) {
      await page.setViewportSize({ width: w, height: h });
      await threeBlocks(page);
      await page.getByRole("button", { name: "Open blocks panel" }).click();
      await page.waitForTimeout(300);
      const s = (await page.getByRole("dialog", { name: "Blocks" }).boundingBox())!;
      expect(s.width, `${w}: no wider than 32rem`).toBeLessThanOrEqual(512.5);
      expect(Math.abs(s.x - (w - s.x - s.width)), `${w}: centred`).toBeLessThan(2);
      expect(Math.abs(s.y + s.height - h), `${w}: at the bottom of the screen`).toBeLessThan(2);
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog", { name: "Blocks" })).toHaveCount(0);
    }
  });

  test("E5c-1 — the Inspector's 'steps down to fit' reads the width the canvas is drawn at, not the device's nominal width", async ({ page }) => {
    // Reproduced through the UI first (uat-e5c-headed.js FS: three Stacks with words, side by side at a third): at 768 the 1:1 canvas
    // is ~656px and draws them one a line, while the note — reading 768 — said nothing. Pinned here with the same shape.
    const cols = ["33.33%", "33.33%", "33.33%"].map((w) => createContainer("column", { width: w, children: [blockForKind("text")] } as Partial<BN>));
    const root = markPageGrid(normalizeRowBands({ ...emptyPageRoot(), children: [makeRowBand(cols)] } as BN));
    await page.setViewportSize({ width: 768, height: 1024 });
    await seedSite(page, siteFromRoot(root), undefined, { phoneScreen: true });
    const [a, , c] = cols.map((k) => page.locator(`[data-box-id="${k.id}"]`));
    await a.waitFor(); await page.waitForTimeout(500);
    const ra = (await a.boundingBox())!, rc = (await c.boundingBox())!;
    expect(rc.y, "the 656px canvas draws the row one a line").toBeGreaterThanOrEqual(ra.y + ra.height - 1);
    await a.click({ position: { x: 4, y: 4 } });
    await page.getByRole("button", { name: "Expand inspector" }).click(); await page.waitForTimeout(300);
    const note = page.getByRole("note").filter({ hasText: "steps down to fit" }).first();
    if (!(await note.isVisible())) { const size = page.getByRole("button", { name: /^Size/ }).first(); await size.scrollIntoViewIfNeeded(); await size.click(); }
    await expect(note, "…and the Inspector says so").toContainText("on a line of its own");
  });
});
