import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage, openInspector } from "./helpers/seed-site";
import { type BoxNode, normalizeRowBands } from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import { emptyPageRoot, siteFromRoot } from "@/lib/box-site";

/**
 * FLOATING A PARENT — the children come with it, and un-floating puts everything back.
 *
 * Behaviours: tests/features/components/website/box-builder-floating.feature.
 *
 * The rule, in the user's words: floating a grid floats everything inside it, in the arrangement it already
 * had; un-floating returns it all to exactly where it was; and any single child can float on its own.
 *
 * The bug this guards: `unfloatBox` also cleared the PARENT's `min-height`, to "drop the reserved height".
 * No such reservation is ever stored — `floatingReserve` is derived at render time — so what it actually
 * deleted was the height the user had set on the section themselves. Float a grid inside a 400px section and
 * return it, and the section collapsed to its content: the grid came back at 60px instead of 400.
 */

async function seed(page: Page) {
  const cell = (id: string, bg: string, text: string) => ({
    id, type: "container", layout: "flex", direction: "column", padding: 0, gap: 0, width: "100%",
    colSpan: 6, background: bg, minHeight: 60, children: [{ id: `t${id}`, type: "text", text, width: "auto" }],
  });
  await seedSite(page, sitePage([
    // The section has a height the USER set. Nothing about floating may ever take it away.
    { id: "sec", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 400,
      background: "#eef2ff", children: [
        { id: "grid", type: "container", layout: "grid", columns: 12, gap: 0, padding: 0, width: "100%",
          background: "#c7d2fe", children: [cell("c0", "#bbf7d0", "left"), cell("c1", "#fde68a", "right")] },
      ] },
  ]));
  await page.waitForSelector('[data-box-id="grid"]', { timeout: 15000 });
  await page.waitForTimeout(300);
}

/** In PAGE px, from the canvas frame's corner (E-2): the canvas is drawn scaled, so a screen px is not a page px. */
const geo = (page: Page, id: string) =>
  page.locator(`[data-box-id="${id}"]`).evaluate((el) => {
    const f = el.closest<HTMLElement>("[data-canvas-scale]")!, s = Number(f.dataset.canvasScale) || 1;
    const r = el.getBoundingClientRect(), o = f.getBoundingClientRect();
    return { x: Math.round((r.left - o.left) / s), y: Math.round((r.top - o.top) / s), w: Math.round(r.width / s), h: Math.round(r.height / s) };
  });

/** The stored node, minus its children — what float/un-float wrote, with no rendering in the way. */
const nodeOf = (page: Page, id: string) =>
  page.evaluate((id) => {
    const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
    const find = (n: Record<string, unknown>): Record<string, unknown> | null => {
      if (n.id === id) return n;
      for (const c of (n.children as Record<string, unknown>[]) ?? []) { const f = find(c); if (f) return f; }
      return null;
    };
    const n = find(site.pages[0].root);
    if (!n) return null;
    const { children, ...rest } = n; void children;
    return rest;
  }, id);

/** Click until `id` is the selection — the depth decides how many clicks, so a fixed count cannot work. */
async function select(page: Page, id: string, at: string) {
  const b = (await page.locator(`[data-box-id="${at}"]`).boundingBox())!;
  for (let i = 0; i < 5; i++) {
    const sel = await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
    if (sel === id) break;
    await page.mouse.click(b.x + b.width * 0.5, b.y + b.height * 0.6);
    await page.waitForTimeout(180);
  }
  expect(await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null)).toBe(id);
}

test.describe("floating a parent and putting it back", () => {
  test("the children float WITH the parent, in the arrangement they already had", async ({ page }) => {
    await seed(page);
    const before = { c0: await geo(page, "c0"), c1: await geo(page, "c1") };
    await select(page, "grid", "c0");
    await page.keyboard.press("Alt+f");
    await page.waitForTimeout(400);

    expect((await nodeOf(page, "grid"))!.position, "the grid is on the floating layer").toBe("absolute");
    // Its cells are still its cells: same widths, still side by side, still in order.
    const after = { c0: await geo(page, "c0"), c1: await geo(page, "c1") };
    expect(after.c0.w, "the left cell keeps its width").toBe(before.c0.w);
    expect(after.c1.w, "and so does the right one").toBe(before.c1.w);
    expect(after.c1.x - after.c0.x, "and they keep their spacing, side by side").toBe(before.c1.x - before.c0.x);
    expect(await nodeOf(page, "c0"), "a child of a floating parent is NOT itself floated").toMatchObject({ colSpan: 6 });
    expect(((await nodeOf(page, "c0")) as Record<string, unknown>).position, "it stays in the flow inside its parent").toBeUndefined();
  });

  test("un-floating puts everything back exactly where it was", async ({ page }) => {
    await seed(page);
    const before = { grid: await geo(page, "grid"), c0: await geo(page, "c0"), c1: await geo(page, "c1"), node: await nodeOf(page, "grid") };
    await select(page, "grid", "c0");
    await page.keyboard.press("Alt+f");
    await page.waitForTimeout(400);
    await page.keyboard.press("Alt+f");
    await page.waitForTimeout(400);

    expect(await nodeOf(page, "grid"), "the tree is byte-for-byte what it was").toEqual(before.node);
    expect(await geo(page, "grid"), "and so is the grid on screen").toEqual(before.grid);
    expect(await geo(page, "c0"), "and every cell in it").toEqual(before.c0);
    expect(await geo(page, "c1")).toEqual(before.c1);
  });

  test("the section's OWN height survives a float round trip", async ({ page }) => {
    // The bug, stated on its own: the height belongs to the section, not to the float.
    await seed(page);
    await select(page, "grid", "c0");
    await page.keyboard.press("Alt+f");
    await page.waitForTimeout(400);
    await page.keyboard.press("Alt+f");
    await page.waitForTimeout(400);
    expect((await nodeOf(page, "sec"))!.minHeight, "nobody asked for this to be removed").toBe(400);
    expect((await geo(page, "sec")).h, "and the section is still that tall").toBeGreaterThanOrEqual(400);
  });

  /**
   * THE BLOCK'S OWN SIZE, which is the same bug one level down and was found the same way — by a user.
   *
   * Floating turns a block into a card: it writes a definite height and drops the block's own `minHeight`.
   * Putting it back deleted BOTH, so the size the user had set before they ever floated it was gone.
   * Measured: a 120px stack came back 49px tall — the height of the text inside it — and floating it again
   * started from 49. Two or three cycles and an empty box has nothing left to see or to click: "when I
   * float it again, I don't see the stack any more".
   */
  test("the BLOCK's own height survives a round trip, and survives doing it twice", async ({ page }) => {
    await seed(page);
    await select(page, "sec", "sec");
    for (const round of [1, 2]) {
      await page.keyboard.press("Alt+f");
      await page.waitForTimeout(450);
      expect((await nodeOf(page, "sec"))!.position, `round ${round}: it never floated`).toBe("absolute");
      await page.keyboard.press("Alt+f");
      await page.waitForTimeout(450);
      /**
       * BOTH the stored floor and the rendered height. The first version of this asserted only the rendered
       * height and PASSED with the fix switched off, while the section had already collapsed to 60px — a
       * guard that cannot fail is the bug, not the proof.
       */
      expect((await nodeOf(page, "sec"))!.minHeight, `round ${round}: the height the user set is gone`).toBe(400);
      expect((await geo(page, "sec")).h, `round ${round}: it came back short`).toBeGreaterThanOrEqual(396);
    }
  });

  test("a size set WHILE it floats is kept when it goes back — that one is the user's own", async ({ page }) => {
    await seed(page);
    await select(page, "sec", "sec");
    await page.keyboard.press("Alt+f");
    await page.waitForTimeout(400);
    await openInspector(page);
    const height = page.getByLabel("Height", { exact: true }).first();
    await height.fill("260px");
    await height.press("Enter");
    await page.waitForTimeout(400);
    await page.keyboard.press("Alt+f");
    await page.waitForTimeout(450);
    const after = (await geo(page, "sec")).h;
    expect(after, `it came back ${after}px; 260 was asked for`).toBeGreaterThanOrEqual(250);
  });

  test("an individual child can float on its own, leaving its siblings alone", async ({ page }) => {
    await seed(page);
    const siblingBefore = await geo(page, "c1");
    await select(page, "c0", "c0");
    await page.keyboard.press("Alt+f");
    await page.waitForTimeout(400);

    expect((await nodeOf(page, "c0"))!.position, "just this cell floats").toBe("absolute");
    expect(((await nodeOf(page, "c1")) as Record<string, unknown>).position, "its sibling does not").toBeUndefined();
    expect(((await nodeOf(page, "grid")) as Record<string, unknown>).position, "and neither does the grid around them").toBeUndefined();
    expect((await geo(page, "c1")).w, "the sibling is still the width it was").toBe(siblingBefore.w);
  });
});

/**
 * A FLOAT NEVER LEAVES THE PAGE (E5c-7). A floating block may hang half over its parent's edge (overlap is a design), but a
 * floating Heading in the first band was dragged — by a finger in the E-5c headed pass, then by a mouse in a probe — above the
 * page's top: the published page cut its words off ("New" gone). Drag and the arrow keys now stop at the page's top, left and right.
 */
test("a floating block stops at the page's top edge — dragged or arrowed — and the Preview shows all of it (E5c-7)", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop-chrome", "the mouse and the keyboard; the finger's own pass is uat-e5c-headed.js");
  // narrow, so it wraps to several lines: half of it is taller than the page's top space (the UI's case: a two-line heading). The
  // UI-built case — floated from the Inspector inside the palette's padded band, on a tablet — is the headed check "E5c-7 …" in
  // uat-e5c-headed.js (a seed did not reproduce it, RULE Y)
  await seedSite(page, sitePage([{ id: "band-h", type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0,
    children: [{ id: "h", type: "heading", text: "Open day results", fontSize: 40, width: "12%", position: "absolute", left: 4, top: 4 }] }]));
  const h = page.locator('[data-box-id="h"]');
  await h.waitFor(); await page.waitForTimeout(300);
  const pageTop = () => page.locator('[data-box-id="root"]').evaluate((e) => e.getBoundingClientRect().top);
  await h.click({ position: { x: 6, y: 6 } });
  const grip = page.getByRole("toolbar", { name: "Block toolbar" }).getByLabel("Drag to move");
  const g = (await grip.boundingBox())!;
  await page.mouse.move(g.x + g.width / 2, g.y + g.height / 2); await page.mouse.down();
  await page.mouse.move(g.x + g.width / 2, g.y - 200, { steps: 12 }); await page.mouse.up(); await page.waitForTimeout(300);
  expect((await h.boundingBox())!.y, "dragged up past the page: it stops at the page's top").toBeGreaterThanOrEqual((await pageTop()) - 1);
  for (let i = 0; i < 20; i++) await page.keyboard.press("Shift+ArrowUp");
  await page.waitForTimeout(300);
  expect((await h.boundingBox())!.y, "arrowed up: it stops there too").toBeGreaterThanOrEqual((await pageTop()) - 1);
  await page.getByRole("button", { name: "Preview", exact: true }).first().click();
  const f = page.frameLocator("iframe").first();
  await expect(f.getByText("Open day results")).toBeVisible();
  expect(await f.getByText("Open day results").evaluate((e) => e.getBoundingClientRect().top + scrollY), "the visitor sees all of it").toBeGreaterThanOrEqual(-1);
});

/**
 * A FLOAT IS PLACED WHERE IT IS DRAWN (E5c-8). The browser places an absolute box from its parent's PADDING box; the float maths
 * measured from the content box. On the real page (its default inner space), a Heading made Floating jumped ~17px right and ~12px
 * up, a still press on its grip moved it up again, and the page-edge limit (E5c-7) was 16px off. Found through the UI
 * (probe-e5c8.js, a mouse at 1280 and a finger at 962); pinned here with the page's real defaults and the palette's Heading.
 */
test("a block made Floating stays exactly where it was, a still press on its grip moves nothing, and it stops at the page's top (E5c-8)", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop-chrome", "the mouse; the finger's own pass is uat-e5c-headed.js");
  const head = { ...blockForKind("heading"), width: "12%" } as BoxNode; // narrow: two lines, taller than the page's top space
  await seedSite(page, siteFromRoot(normalizeRowBands({ ...emptyPageRoot(), children: [head] } as BoxNode)));
  const h = page.locator(`[data-box-id="${head.id}"]`);
  await h.waitFor(); await page.waitForTimeout(300);
  const at = async () => { const b = (await h.boundingBox())!; return { x: b.x, y: b.y }; };
  await h.click({ position: { x: 6, y: 6 } });
  const a = await at();
  let fl = page.getByRole("button", { name: "Floating", exact: true }).first();
  if (!(await fl.isVisible())) { await page.getByRole("button", { name: /^Placement/ }).first().click(); fl = page.getByRole("button", { name: "Floating", exact: true }).first(); }
  await fl.scrollIntoViewIfNeeded(); await fl.click(); await page.waitForTimeout(400);
  const b = await at();
  // up / down not at all; across only by the 2 % inset a float keeps from its parent's edge (floatBox, by design), never outward
  await expect.poll(async () => Math.abs((await at()).y - a.y), { message: `made Floating, it did not move up or down (${JSON.stringify({ a, b })})` }).toBeLessThan(0.75); // 1.57 before the settle (E5c-8), 0.1 after
  const pageW = await page.evaluate(() => document.querySelector("[data-canvas-scale] [data-box-id]")!.getBoundingClientRect().width);
  expect(b.x - a.x, "…and across, only the 2 % inset").toBeGreaterThanOrEqual(-0.5);
  expect(b.x - a.x, "…and across, only the 2 % inset").toBeLessThanOrEqual(pageW * 0.02 + 1);
  await h.click({ position: { x: 6, y: 6 } });
  const grip = page.getByRole("toolbar", { name: "Block toolbar" }).getByLabel("Drag to move");
  const g = (await grip.boundingBox())!;
  await page.mouse.move(g.x + g.width / 2, g.y + g.height / 2); await page.mouse.down();
  await page.mouse.up(); // pressed and let go without moving (a 1px wiggle lets the 6px snap act, by design)
  await page.waitForTimeout(300);
  const c = await at();
  expect(Math.max(Math.abs(c.x - b.x), Math.abs(c.y - b.y)), `a still press on the grip moved nothing (${JSON.stringify({ b, c })})`).toBeLessThan(1.5);
  // E5c-9: grown by its corner, its top stays — this float sets its page's height itself (the reserve), and its top is a % of it
  await h.click({ position: { x: 6, y: 6 } });
  const t0 = (await at()).y, k = (await page.locator('[aria-label="Resize bottom-right corner"]').first().boundingBox())!;
  await page.mouse.move(k.x + k.width / 2, k.y + k.height / 2); await page.mouse.down();
  await page.mouse.move(k.x + k.width / 2 - 20, k.y + k.height / 2 + 60, { steps: 10 }); await page.mouse.up(); await page.waitForTimeout(400);
  expect(Math.abs((await at()).y - t0), "grown by its corner, its top stayed (rule 19)").toBeLessThan(1);
  await page.mouse.move(g.x + g.width / 2, g.y + g.height / 2); await page.mouse.down();
  await page.mouse.move(g.x + g.width / 2, g.y - 200, { steps: 12 }); await page.mouse.up(); await page.waitForTimeout(300);
  const pageTop = await page.locator(`[data-box-id="${(await page.evaluate(() => JSON.parse(localStorage.getItem("educo_box_site_v1")!).pages[0].root.id))}"]`).evaluate((e) => e.getBoundingClientRect().top);
  expect((await at()).y, "dragged up past the page: it stops at the page's top (E5c-7, on the padded page)").toBeGreaterThanOrEqual(pageTop - 1);
});
