import { test, expect, type Page } from "@playwright/test";

/**
 * HOW SMALL A BOX CAN BE MADE — and what is allowed to stop it.
 *
 * Behaviours: tests/features/components/website/box-builder-columns.feature.
 *
 * The rule, in the user's words: an empty box must shrink to the very minimum, because the "Empty — drag a
 * block in" text inside it is a HINT, not content; and a box WITH content must shrink to whatever that
 * content permits, and no further.
 *
 * What was wrong: the hint was a real child with padding, an icon and a line of text, so it measured about
 * 90px — and that silently became the smallest an empty box could be. Dragging the height down wrote 8px into
 * the saved page while the canvas went on drawing 90px, so the editor showed a size nobody had chosen. Worse
 * one level down: a section holding an empty grid could not be shrunk at all, because the hints inside the
 * grid's cells held it open from the inside.
 *
 * A SIBLING BAND WITH REAL HEIGHT sits under the box in every test here, deliberately. The page has its own
 * minimum height, and a page whose only content is the box under test has that minimum stretch the box —
 * which looks exactly like a floor that will not budge, and is not one.
 */

type Kid = Record<string, unknown>;

async function seed(page: Page, target: Kid) {
  await page.goto("/website/box-demo");
  await page.evaluate((target) => {
    const site = { pages: [{ id: "p1", name: "Home", path: "/", root: {
      id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
        { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, children: [target] },
        // The rest of the page, so the page's own minimum height is not what we end up measuring.
        { id: "band2", type: "container", direction: "row", rowBand: true, width: "fill", gap: 0, padding: 0, children: [
          { id: "filler", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 500,
            background: "#fee2e2", children: [{ id: "ft", type: "text", text: "the rest of the page", width: "auto" }] },
        ] },
      ] } }], homeId: "p1" };
    localStorage.setItem("educo_box_site_v1", JSON.stringify(site));
    localStorage.setItem("educo_box_site_cleaned_v1", "1");
  }, target);
  await page.reload();
  await page.waitForSelector('[data-box-id="tgt"]', { timeout: 15000 });
  await page.waitForTimeout(300);
}

const heightOf = (page: Page, id: string) =>
  page.locator(`[data-box-id="${id}"]`).evaluate((el) => Math.round(el.getBoundingClientRect().height));

/**
 * Click until THIS box is the selection.
 *
 * A fixed number of clicks does not work: the first click takes the outermost box and each one after steps
 * one level further in, so the count depends on how deep the box is — and clicking twice on a section that
 * HAS content sails straight past it into the child.
 */
async function selectBox(page: Page, id: string) {
  const b = (await page.locator(`[data-box-id="${id}"]`).boundingBox())!;
  const x = b.x + b.width * 0.25, y = b.y + b.height * 0.5;
  for (let i = 0; i < 4; i++) {
    const sel = await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
    if (sel === id) break;
    await page.mouse.click(x, y);
    await page.waitForTimeout(150);
  }
  await expect(page.locator(`[data-box-id="${id}"]`)).toHaveClass(/outline-indigo-500/);
}

/** Drag the bottom edge upward by `px`, in steps so every move event fires. */
async function squeeze(page: Page, px: number) {
  const h = (await page.locator('[aria-label="Resize bottom edge"]').boundingBox())!;
  const x = h.x + h.width / 2, y = h.y + h.height / 2;
  await page.mouse.move(x, y); await page.mouse.down();
  for (let i = 1; i <= 12; i++) await page.mouse.move(x, y - (px * i) / 12);
  await page.mouse.up(); await page.waitForTimeout(300);
}

const emptySection = (extra: Record<string, unknown> = {}) => ({
  id: "tgt", type: "container", direction: "column", padding: 0, gap: 0, width: "100%",
  background: "#c7d2fe", children: [], ...extra,
});

const emptyGrid = (id: string, cellPrefix: string) => ({
  id, type: "container", layout: "grid", columns: 12, gap: 0, padding: 0, width: "100%",
  children: [0, 1].map((i) => ({
    id: `${cellPrefix}${i}`, type: "container", layout: "flex", direction: "column",
    padding: 0, gap: 0, width: "100%", colSpan: 6, background: ["#c7d2fe", "#bbf7d0"][i], children: [],
  })),
});

test.describe("how small a box can be made", () => {
  test("an EMPTY box that nobody has sized still shows itself", async ({ page }) => {
    // The other side of the rule, and the reason the hint could not simply be deleted: with the hint out of
    // the flow there is nothing inside to give an empty box height, so it would collapse to 0px — invisible,
    // unclickable, and impossible to drop anything into. It gets the same 8rem the exported page gives an
    // empty painted box, so the two agree.
    await seed(page, emptySection());
    expect(await heightOf(page, "tgt"), "a courtesy height, not a collapsed line").toBeGreaterThan(100);
  });

  test("an EMPTY box shrinks to almost nothing — the hint inside is not content", async ({ page }) => {
    await seed(page, emptySection());
    await selectBox(page, "tgt");
    await squeeze(page, 300);
    expect(await heightOf(page, "tgt"), "the hint must not hold it open").toBeLessThan(20);
  });

  test("a box with REAL content stops at the height its content needs", async ({ page }) => {
    // The limit has to be the CONTENT's, not a number the builder picked: one line of text, so about one
    // line tall — squeezed, but not squeezed into nothing.
    await seed(page, emptySection({ children: [{ id: "t", type: "text", text: "One short line.", width: "auto" }] }));
    const before = await heightOf(page, "tgt");
    await selectBox(page, "tgt");
    await squeeze(page, 300);
    const after = await heightOf(page, "tgt");
    expect(after, "it does shrink").toBeLessThanOrEqual(before);
    expect(after, "…but the line of text still fits").toBeGreaterThan(8);
    expect(after, "…and nothing else is padding it out").toBeLessThan(60);
  });

  test("a box holding an EMPTY GRID shrinks too — its cells' hints do not hold it open", async ({ page }) => {
    // The bug one level down. Every cell of the nested grid drew its own ~90px hint, so the section around
    // them could not be made smaller than the grid, whatever was dragged.
    await seed(page, emptySection({ children: [emptyGrid("inner", "n")] }));
    await selectBox(page, "tgt");
    await squeeze(page, 300);
    expect(await heightOf(page, "tgt"), "the section follows the drag").toBeLessThan(20);
    expect(await heightOf(page, "inner"), "and the empty grid inside it comes along").toBeLessThan(20);
  });

  test("a grid CELL's row shrinks to the row minimum", async ({ page }) => {
    await seed(page, emptyGrid("tgt", "c"));
    await selectBox(page, "c0");
    await squeeze(page, 300);
    expect(await heightOf(page, "c0"), "down to the sliver guard, not the hint").toBeLessThan(40);
  });

  test("what you dragged is what gets PUBLISHED", async ({ page }) => {
    // canvas = export. A height dragged down has to survive into the exported page — the empty-box floor the
    // exporter applies is a DEFAULT for a box nobody sized, and an explicit height must beat it.
    await seed(page, emptySection());
    await selectBox(page, "tgt");
    await squeeze(page, 300);
    const css = await page.evaluate(() => {
      const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
      const tgt = (n: Record<string, unknown>): Record<string, unknown> | null => {
        if (n.id === "tgt") return n;
        for (const c of (n.children as Record<string, unknown>[]) ?? []) { const f = tgt(c); if (f) return f; }
        return null;
      };
      return tgt(site.pages[0].root);
    });
    expect(css, "the box is in the saved page").toBeTruthy();
    expect(css!.minHeight as number, "and the height you dragged is what was stored").toBeLessThan(20);
  });
});
