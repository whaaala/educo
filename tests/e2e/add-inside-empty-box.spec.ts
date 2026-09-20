import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * AN EMPTY BOX OFFERS A WAY TO PUT SOMETHING IN IT.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * The empty box has always said "Empty — drag a block in, or click to add", and the second half of that
 * sentence was not true. The + beside it was a `<span>` inside a `pointer-events-none` hint, so an empty
 * box contained exactly ZERO buttons: measured, three clicks on one opened no menu, added no child, and
 * did nothing but select the box. A control that says what it does and does not do it is the defect this
 * project keeps meeting, and this one was written into the interface in words.
 *
 * It matters more since the palette began adding SIBLINGS: putting a block inside another is now a
 * deliberate act, and the empty box is where someone looks for it.
 *
 * The tests assert the ACTION, never the markup. A button that exists and does nothing would satisfy any
 * check for a button, which is exactly how this got here.
 */

async function seedEmptyStack(page: Page) {
  await seedSite(page, sitePage([
    { id: "A", type: "container", direction: "column", padding: 0, gap: 0, width: "60%", minHeight: 180, background: "#c7d2fe", children: [] },
  ]));
  await page.waitForSelector('[data-box-id="A"]', { timeout: 15000 });
  await page.waitForTimeout(400);
}

/** How many children `A` holds, read from the stored tree. */
const childCount = (page: Page) =>
  page.evaluate(() => {
    const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
    const find = (n: Record<string, unknown>): Record<string, unknown> | null =>
      n.id === "A" ? n : ((n.children as Record<string, unknown>[]) ?? []).reduce<Record<string, unknown> | null>((a, c) => a ?? find(c), null);
    return ((find(site.pages[0].root)?.children as unknown[]) ?? []).length;
  });

const addButton = (page: Page) => page.locator(`[data-box-id="A"] button[aria-label="Choose a block to add inside"]`);

test.describe("the + inside an empty box", () => {
  test("is a real button, not a picture of one", async ({ page }) => {
    await seedEmptyStack(page);
    expect(await addButton(page).count(), "the empty box has an add control").toBe(1);
    // The hint around it is deliberately `pointer-events: none`, so the button has to opt back in or it is
    // unclickable however real it looks — which is precisely what it was.
    const clickable = await addButton(page).evaluate((el) => getComputedStyle(el).pointerEvents !== "none");
    expect(clickable, "…and the pointer can actually reach it").toBe(true);
  });

  test("opens a menu of things that can go inside", async ({ page }) => {
    await seedEmptyStack(page);
    await addButton(page).click();
    await page.waitForTimeout(400);
    const menu = page.locator('[role="menu"][aria-label="Add a block inside"]');
    await expect(menu, "a menu opens").toBeVisible();
    expect(await menu.getByRole("menuitem").count(), "with blocks to choose from").toBeGreaterThan(2);
  });

  test("picking one actually puts a block INSIDE the box", async ({ page }) => {
    // The assertion that matters. Everything above is satisfied by a button that opens an inert menu.
    await seedEmptyStack(page);
    expect(await childCount(page), "it starts empty").toBe(0);

    await addButton(page).click();
    await page.waitForTimeout(400);
    await page.locator('[role="menu"][aria-label="Add a block inside"]').getByRole("menuitem").first().click();
    await page.waitForTimeout(700);

    expect(await childCount(page), "a block went inside").toBeGreaterThan(0);
    // …and it is visible in there, not collapsed to nothing.
    const kid = await page.evaluate(() => {
      const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
      const find = (n: Record<string, unknown>): Record<string, unknown> | null =>
        n.id === "A" ? n : ((n.children as Record<string, unknown>[]) ?? []).reduce<Record<string, unknown> | null>((a, c) => a ?? find(c), null);
      const walk = (n: Record<string, unknown>): string => {
        const kids = (n.children as Record<string, unknown>[]) ?? [];
        return kids.length ? walk(kids[0]) : (n.id as string);
      };
      const a = find(site.pages[0].root)!;
      return walk((a.children as Record<string, unknown>[])[0]);
    });
    const box = await page.locator(`[data-box-id="${kid}"]`).boundingBox();
    expect(box, "the block that landed inside is on the page").not.toBeNull();
    expect(box!.height, "…and big enough to see").toBeGreaterThan(20);
  });

  test("EVERY item in the menu adds, and the arrival is visible", async ({ page }) => {
    /**
     * "None of the options works" — and every one of them did. The block landed in the tree each time; it
     * was simply impossible to see. A new block is transparent, has no content, and exactly fills the empty
     * box it went into, so the only thing that could have announced it was the selection moving — and
     * `addChild` deliberately did not move it ("so you can keep adding", which is right for a box that
     * already holds something and useless for one that does not).
     *
     * So each item is checked for BOTH: it changed the tree, and it changed something a person can see.
     * Asserting only the first is what let "every item works and every item looks broken" stand.
     */
    for (const label of ["Stack", "Side by side", "Heading", "Text", "Button"]) {
      await seedEmptyStack(page);
      expect(await childCount(page), `${label}: starts empty`).toBe(0);

      await addButton(page).click();
      await page.waitForTimeout(350);
      await page.locator('[role="menu"][aria-label="Add a block inside"]')
        .getByRole("menuitem", { name: new RegExp(`^${label}$`) }).first().click();
      await page.waitForTimeout(600);

      expect(await childCount(page), `${label}: a block went inside`).toBe(1);
      // The visible half: the selection is now on the block that just arrived, not still on its parent.
      const sel = await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
      expect(sel, `${label}: the selection moved to what just landed, so you can see it happened`).not.toBe("A");
      expect(sel, `${label}: …and something is selected`).not.toBeNull();
    }
  });

  test("a Grid added inside arrives with a CELL in it, not as an empty shell", async ({ page }) => {
    /**
     * The same drift as the Stack, one item further down the menu. This route built `createGrid(3)` —
     * three columns and nothing in them — while the palette built a real one. `blockForKind`'s own comment
     * names the failure: "an empty shell with no cell to click, nothing to resize and nowhere to put
     * anything". A grid you cannot put anything into is not a grid.
     */
    await seedEmptyStack(page);
    await addButton(page).click();
    await page.waitForTimeout(350);
    await page.locator('[role="menu"][aria-label="Add a block inside"]')
      .getByRole("menuitem", { name: /^Grid$/ }).first().click();
    await page.waitForTimeout(400);
    // A Grid asks for its shape first — see the test below. One across, one down is the undivided answer.
    await page.locator('[role="menu"][aria-label="Choose a layout"]').locator('[aria-label="1 across, 1 down"]').click();
    await page.waitForTimeout(700);

    const grid = await page.evaluate(() => {
      const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
      let found: Record<string, unknown> | null = null;
      const walk = (n: Record<string, unknown>) => {
        if (!found && n.layout === "grid") found = n;
        ((n.children as Record<string, unknown>[]) ?? []).forEach(walk);
      };
      walk(site.pages[0].root);
      const g = found as Record<string, unknown> | null;
      return g && { id: g.id as string, cells: ((g.children as unknown[]) ?? []).length };
    });
    expect(grid, "a grid was added").not.toBeNull();
    expect(grid!.cells, "…with at least one cell to click and put things in").toBeGreaterThan(0);
    const box = await page.locator(`[data-box-id="${grid!.id}"]`).boundingBox();
    expect(box, "and it is on the page").not.toBeNull();
  });

  test("a box that ALREADY has content also hands the selection to what just landed", async ({ page }) => {
    /**
     * THIS ASSERTED THE OPPOSITE, on the reasoning that a block added to a box with content in it is
     * plainly visible and the selection is better left where it is. That reasoning does not survive a grid:
     * two transparent 50px cells look exactly like one transparent 100px cell, because the grid shares its
     * height out rather than growing. It was reported as "the highlighted ones are not working" — and every
     * one of them worked.
     *
     * "Can you see it?" is not a question about whether the parent already had children, so the answer
     * cannot be conditional on that. The selection moves every time.
     */
    await seedSite(page, sitePage([
      { id: "A", type: "container", direction: "column", padding: 0, gap: 0, width: "60%", minHeight: 240, background: "#c7d2fe",
        children: [{ id: "kid", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 60, background: "#a5b4fc", children: [] }] },
    ]));
    await page.waitForSelector('[data-box-id="kid"]', { timeout: 15000 });
    await page.waitForTimeout(400);
    const a = (await page.locator('[data-box-id="A"]').boundingBox())!;
    await page.mouse.click(a.x + a.width * 0.1, a.y + a.height * 0.95);
    await page.waitForTimeout(300);
    const before = await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);

    // Add through the block's actions menu, the route that serves a box with content in it.
    await page.getByRole("button", { name: /Block actions/i }).first().click();
    await page.waitForTimeout(350);
    await page.getByRole("menuitem", { name: /^Text$/ }).first().click();
    await page.waitForTimeout(600);

    const now = await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
    expect(now, "the selection moved to the block that just landed").not.toBe(before);
    expect(now, "…and something is selected").not.toBeNull();
  });

  test("a box that already HAS content can still be added into, from the canvas", async ({ page }) => {
    /**
     * The + in the middle of an empty box only exists while the box IS empty. The moment something goes in,
     * the hint and its button are gone — so putting a SECOND thing inside had no route on the canvas at all
     * and you had to know about the inspector. That matters more now a palette click adds a sibling:
     * nesting is a deliberate act, and a control that vanishes the first time you use it is no control.
     *
     * So every container carries "Add a block inside this one" on its toolbar. Asserted by the RESULT —
     * a button that exists and adds nothing would pass any check for a button.
     */
    await seedSite(page, sitePage([
      { id: "A", type: "container", direction: "column", padding: 0, gap: 0, width: "60%", minHeight: 240, background: "#c7d2fe",
        children: [{ id: "kid", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 60, background: "#a5b4fc", children: [] }] },
    ]));
    await page.waitForSelector('[data-box-id="kid"]', { timeout: 15000 });
    await page.waitForTimeout(400);
    // Select A (not the child) — click low and to the left, away from the kid at the top.
    const a = (await page.locator('[data-box-id="A"]').boundingBox())!;
    for (let i = 0; i < 4; i++) {
      if (await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null) === "A") break;
      await page.mouse.click(a.x + a.width * 0.1, a.y + a.height * 0.95);
      await page.waitForTimeout(220);
    }

    const before = await childCount(page);
    const add = page.getByRole("button", { name: /Add a block inside this one/i });
    expect(await add.count(), "the toolbar offers it even though the box is not empty").toBeGreaterThan(0);
    await add.first().click();
    await page.waitForTimeout(350);
    await page.locator('[role="menu"][aria-label="Add a block inside"]')
      .getByRole("menuitem", { name: /^Text$/ }).first().click();
    await page.waitForTimeout(700);
    expect(await childCount(page), "a second block went inside").toBe(before + 1);
  });

  test("adding inside a GRID gives a cell you can actually see", async ({ page }) => {
    /**
     * Reported as "the highlighted ones are not working" — Side by side and Grid, with a GRID selected.
     * Every one of them worked: the cell went into the tree each time, at a real size.
     *
     * THE CAUSE WAS FEEDBACK, NOT SIZE, and it is worth recording because the first diagnosis was wrong.
     * A floor was added to this branch of `childStyle` on the assumption that a new cell measured zero —
     * and mutation-testing it showed the floor changed nothing, because a grid's rows already share the
     * grid's height between them. What actually happened is that the grid does not GROW: two transparent
     * 50px cells look exactly like one transparent 100px cell. Nothing was wrong with the block; there was
     * simply no way to tell it had arrived.
     *
     * Fixed where feedback belongs — the selection moves to what just landed — and this test holds the
     * other half: whatever the menu adds is a real, visible size in a grid as well as in a stack.
     */
    /**
     * ONE ADD PER FRESH PAGE, rather than three onto the same grid.
     *
     * Adding hands the selection to what just landed — which is the point — so a loop on one page has to
     * put the selection back on the grid between items, and it cannot: clicking a grid that now has
     * children selects a CHILD, and clicking again goes deeper still. The later items ended up inside some
     * small nested block and measured zero, which reads as the feature failing when it is the fixture
     * drifting. Re-seeding keeps each item's measurement about that item.
     */
    for (const label of ["Stack", "Side by side", "Grid"]) {
      await seedSite(page, sitePage([
        { id: "G", type: "container", layout: "grid", columns: 12, padding: 0, gap: 0, width: "100%", minHeight: 200, children: [
          { id: "c1", type: "container", direction: "column", colSpan: 12, padding: 0, gap: 0, background: "#c7d2fe", children: [] },
        ] },
      ]));
      await page.waitForSelector('[data-box-id="G"]', { timeout: 15000 });
      await page.waitForTimeout(450);
      const g = (await page.locator('[data-box-id="G"]').boundingBox())!;
      for (let i = 0; i < 5; i++) {
        if (await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null) === "G") break;
        await page.mouse.click(g.x + g.width / 2, g.y + g.height / 2);
        await page.waitForTimeout(220);
      }
      const before = await page.evaluate(() => {
        const s = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
        const out: string[] = [];
        const walk = (n: Record<string, unknown>) => { out.push(n.id as string); ((n.children as Record<string, unknown>[]) ?? []).forEach(walk); };
        walk(s.pages[0].root);
        return out;
      });
      await page.getByRole("button", { name: /Add a block inside this one/i }).first().click();
      await page.waitForTimeout(350);
      await page.locator('[role="menu"][aria-label="Add a block inside"]')
        .getByRole("menuitem", { name: new RegExp(`^${label}$`) }).first().click();
      await page.waitForTimeout(450);
      // A Grid asks for its shape before it is inserted; the others land straight away.
      const shape = page.locator('[role="menu"][aria-label="Choose a layout"]');
      if (await shape.count()) {
        await shape.locator('[aria-label="2 across, 1 down"]').click();
        await page.waitForTimeout(400);
      }
      await page.waitForTimeout(400);

      const known = new Set(before);
      const added = await page.evaluate(() => {
        const s = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
        const out: string[] = [];
        const walk = (n: Record<string, unknown>) => { out.push(n.id as string); ((n.children as Record<string, unknown>[]) ?? []).forEach(walk); };
        walk(s.pages[0].root);
        return out;
      });
      const fresh = added.filter((i) => !known.has(i));
      expect(fresh.length, `${label}: something was added`).toBeGreaterThan(0);
      const boxes = [];
      for (const id of fresh) boxes.push(await page.locator(`[data-box-id="${id}"]`).boundingBox());
      const tallest = Math.max(...boxes.map((b) => b?.height ?? 0));
      expect(tallest, `${label}: the new cell is big enough to see and to grab`).toBeGreaterThanOrEqual(39);
    }
  });

  test("a Grid added inside ASKS how many across and down, like the palette does", async ({ page }) => {
    /**
     * "I should be able to add a grid inside a stack with as many rows and columns as I want."
     *
     * Both "Add inside" menus inserted a grid outright — a fixed one-cell 1×1 — while the same Grid from
     * the palette opened a shape picker. There is a whole spec on the palette's two routes both opening it:
     * "dragging a tile says WHERE a layout goes; it does not say what the layout IS, and the builder must
     * not answer that for you." This third route quietly answered it.
     */
    await seedEmptyStack(page);
    await addButton(page).click();
    await page.waitForTimeout(350);
    await page.locator('[role="menu"][aria-label="Add a block inside"]')
      .getByRole("menuitem", { name: /^Grid$/ }).first().click();
    await page.waitForTimeout(450);

    const picker = page.locator('[role="menu"][aria-label="Choose a layout"]');
    await expect(picker, "it asks for the shape rather than choosing one for you").toBeVisible();
    expect(await childCount(page), "…and nothing is inserted until the question is answered").toBe(0);

    await picker.locator('[aria-label="3 across, 2 down"]').click();
    await page.waitForTimeout(700);

    const grid = await page.evaluate(() => {
      const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
      let found: Record<string, unknown> | null = null;
      const walk = (n: Record<string, unknown>) => {
        if (!found && n.layout === "grid") found = n;
        ((n.children as Record<string, unknown>[]) ?? []).forEach(walk);
      };
      walk(site.pages[0].root);
      const g = found as Record<string, unknown> | null;
      return g && { cells: ((g.children as unknown[]) ?? []).length, id: g.id as string };
    });
    expect(grid, "a grid was added").not.toBeNull();
    expect(grid!.cells, "three across and two down is six cells — the shape asked for").toBe(6);
    const box = await page.locator(`[data-box-id="${grid!.id}"]`).boundingBox();
    expect(box!.height, "and it is a real size inside the stack, not collapsed").toBeGreaterThan(20);
  });

  test("a stack holding only a DIVIDER is still big enough to grab", async ({ page }) => {
    /**
     * A divider is a 2px line, so a stack whose only content is one came out 2px tall — correct arithmetic
     * and useless in practice: at 2px the box cannot be clicked, selected, or dragged by any of its eight
     * handles. The same "too small to grab" failure the empty-box floor was written for, in a box that is
     * not technically empty.
     *
     * The floor goes on the CONTAINER, never on the divider: the line still draws at 2px and the published
     * page is unchanged — it is the box around it that has to be reachable.
     */
    await seedSite(page, sitePage([
      { id: "P", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 260, background: "#eef2ff", children: [
        { id: "C", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", background: "#c7d2fe",
          children: [{ id: "d", type: "divider", width: "fill", children: [] }] },
        { id: "tail", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 80, background: "#a5b4fc", children: [] },
      ] },
    ]));
    await page.waitForSelector('[data-box-id="d"]', { timeout: 15000 });
    await page.waitForTimeout(450);

    const c = (await page.locator('[data-box-id="C"]').boundingBox())!;
    const d = (await page.locator('[data-box-id="d"]').boundingBox())!;
    expect(c.height, "the stack around it is grabbable").toBeGreaterThanOrEqual(39);
    expect(d.height, "…while the divider is still a thin line").toBeLessThan(8);
    expect(d.width, "…spanning its container, as the published page draws it").toBeGreaterThan(c.width - 8);
  });

  test("a Grid inside a CHILD stack does not collapse the stack — the reported case", async ({ page }) => {
    /**
     * "The inner child is not working — the whole layout of the inner child breaks the page."
     *
     * A grid's rows share whatever height the GRID has. Inside a stack that hugs its content there is
     * nothing to share: the cells are 0, so the grid is 0, so the stack collapses. Measured: a Grid added
     * inside a child stack left the stack and three of its descendants under 8px.
     *
     * The floor it needs has to coexist with the opposite rule — `empty-box-height` asserts "a box holding
     * an EMPTY GRID shrinks too", so a box can be dragged small. Squeezing that box gives it an explicit
     * height, and a courtesy yields to a size somebody chose. That is why the signal is `hostSized`, the
     * nearest REAL container above (bands are scaffolding and carry no height) rather than "any ancestor":
     * here the OUTER stack is sized, so the broader question answers yes and the collapse would survive it.
     */
    await seedSite(page, sitePage([
      { id: "P", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 240, background: "#eef2ff", children: [
        { id: "C", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", background: "#c7d2fe", children: [
          { id: "G", type: "container", layout: "grid", columns: 12, padding: 0, gap: 0, children: [
            { id: "g1", type: "container", direction: "column", colSpan: 6, padding: 0, gap: 0, children: [] },
            { id: "g2", type: "container", direction: "column", colSpan: 6, padding: 0, gap: 0, children: [] },
            { id: "g3", type: "container", direction: "column", colSpan: 6, padding: 0, gap: 0, children: [] },
            { id: "g4", type: "container", direction: "column", colSpan: 6, padding: 0, gap: 0, children: [] },
          ] },
        ] },
      ] },
    ]));
    await page.waitForSelector('[data-box-id="G"]', { timeout: 15000 });
    await page.waitForTimeout(450);

    for (const id of ["C", "G", "g1", "g4"]) {
      const b = await page.locator(`[data-box-id="${id}"]`).boundingBox();
      expect(b, `${id} is on the page`).not.toBeNull();
      expect(b!.height, `${id} has not collapsed`).toBeGreaterThanOrEqual(19);
    }
    // ONE FLOOR PER ROW: a 2×2 asks for two rows' worth, or its cells are back under the grabbable size.
    const g = (await page.locator('[data-box-id="G"]').boundingBox())!;
    expect(g.height, "two rows get two floors, not one shared between them").toBeGreaterThanOrEqual(79);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
      "and nothing spills sideways").toBe(true);
  });

  test("clicking the BOX itself still just selects it", async ({ page }) => {
    // The direction that keeps the fix honest: making the pill clickable must not turn every click on a
    // block into an add. Selecting a box is the commonest thing anyone does with one.
    await seedEmptyStack(page);
    const a = (await page.locator('[data-box-id="A"]').boundingBox())!;
    await page.mouse.click(a.x + a.width * 0.2, a.y + a.height * 0.8); // well away from the centred pill
    await page.waitForTimeout(350);
    expect(await childCount(page), "nothing was added").toBe(0);
    expect(await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null),
      "the box is selected, which is what a click on a block means").toBe("A");
  });
});
