import { test, expect, type Page } from "@playwright/test";

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
  await page.goto("/website/box-demo");
  await page.evaluate(() => {
    const cell = (id: string, bg: string, text: string) => ({
      id, type: "container", layout: "flex", direction: "column", padding: 0, gap: 0, width: "100%",
      colSpan: 6, background: bg, minHeight: 60, children: [{ id: `t${id}`, type: "text", text, width: "auto" }],
    });
    const site = { pages: [{ id: "p1", name: "Home", path: "/", root: {
      id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
        { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, children: [
          // The section has a height the USER set. Nothing about floating may ever take it away.
          { id: "sec", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 400,
            background: "#eef2ff", children: [
              { id: "grid", type: "container", layout: "grid", columns: 12, gap: 0, padding: 0, width: "100%",
                background: "#c7d2fe", children: [cell("c0", "#bbf7d0", "left"), cell("c1", "#fde68a", "right")] },
            ] },
        ] },
      ] } }], homeId: "p1" };
    localStorage.setItem("educo_box_site_v1", JSON.stringify(site));
    localStorage.setItem("educo_box_site_cleaned_v1", "1");
  });
  await page.reload();
  await page.waitForSelector('[data-box-id="grid"]', { timeout: 15000 });
  await page.waitForTimeout(300);
}

const geo = (page: Page, id: string) =>
  page.locator(`[data-box-id="${id}"]`).evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
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
