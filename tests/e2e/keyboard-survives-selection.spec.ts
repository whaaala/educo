import { test, expect, type Page } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";
import type { BoxNode } from "@/lib/box-model";

/**
 * SELECTING A BLOCK LEAVES THE KEYBOARD WORKING.
 *
 * Behaviours: tests/features/components/website/box-builder-floating.feature.
 *
 * The bug, which hid every canvas shortcut at once and made no sound doing it:
 *
 * Clicking a container selects it — but the click also lands on whatever is inside it, and a text block's
 * `contentEditable` span takes focus. The two then disagree. Measured, after a single click on a section:
 *
 *     selection: "sec"      document.activeElement: SPAN, editable, inside block "tc1"
 *
 * The canvas key handler refuses to act whenever focus is in editable text — correctly, since nobody wants
 * Delete removing a section mid-word. With the caret stranded in a block the person never touched, that
 * refusal fired for someone who was not typing at all: **Alt+F, Delete, Ctrl+D, Ctrl+C and every arrow key
 * silently did nothing.** It was reported as a section that simply would not float.
 *
 * So this asserts the property rather than the one shortcut that was noticed — SEVERAL shortcuts, after a
 * plain click, on a container that has text inside it. Any future regression takes the whole set down
 * together, which is what made the original so hard to see.
 */

const page1 = () => sitePage([
  {
    id: "sec", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 400,
    background: "#eef2ff", children: [
      { id: "inner", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 60, background: "#bbf7d0",
        children: [{ id: "words", type: "text", text: "some words", width: "auto" }] },
    ],
  } as unknown as BoxNode,
]);

/** What the editor thinks is selected, and where the caret actually is. */
const state = (page: Page) => page.evaluate(() => {
  const ae = document.activeElement as HTMLElement | null;
  return {
    selection: document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null,
    editingBlock: ae?.isContentEditable ? (ae.closest("[data-box-id]")?.getAttribute("data-box-id") ?? null) : null,
  };
});

const storedNode = (page: Page, id: string) => page.evaluate((id) => {
  const site = JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}");
  const find = (n: Record<string, unknown>): Record<string, unknown> | null => {
    if (n.id === id) return n;
    for (const c of (n.children as Record<string, unknown>[]) ?? []) { const f = find(c); if (f) return f; }
    return null;
  };
  return find(site.pages[0].root);
}, id);

/** Click the section once, the way a person does — landing on the text inside it is the whole point. */
async function selectSection(page: Page) {
  const b = (await page.locator('[data-box-id="sec"]').boundingBox())!;
  for (let i = 0; i < 5; i++) {
    if ((await state(page)).selection === "sec") return;
    await page.mouse.click(b.x + b.width * 0.5, b.y + b.height * 0.2); // over the text block inside it
    await page.waitForTimeout(200);
  }
  expect((await state(page)).selection, "the section could not be selected at all").toBe("sec");
}

test.describe("the keyboard still works after a click selects a container", () => {
  test.beforeEach(async ({ page }) => {
    await seedSite(page, page1());
    await page.waitForSelector('[data-box-id="words"]', { timeout: 30000 });
    await page.waitForTimeout(400);
  });

  test("the caret does not stay behind in a block you did not select", async ({ page }) => {
    await selectSection(page);
    const s = await state(page);
    expect(s.selection, "the section is selected").toBe("sec");
    expect(s.editingBlock, `the caret was left inside "${s.editingBlock}" — every shortcut dies there`).toBeNull();
  });

  test("Alt+F floats it, and floats it back", async ({ page }) => {
    await selectSection(page);
    await page.keyboard.press("Alt+f");
    await page.waitForTimeout(450);
    expect((await storedNode(page, "sec"))?.position, "Alt+F did nothing at all").toBe("absolute");
    await page.keyboard.press("Alt+f");
    await page.waitForTimeout(450);
    expect((await storedNode(page, "sec"))?.position, "and back into the flow").toBeUndefined();
  });

  test("Ctrl+D duplicates it", async ({ page }) => {
    await selectSection(page);
    const boxes = () => page.evaluate(() => document.querySelectorAll("[data-box-id]").length);
    const before = await boxes();
    await page.keyboard.press("Control+d");
    await page.waitForTimeout(500);
    expect(await boxes(), "Ctrl+D added nothing").toBeGreaterThan(before);
  });

  test("Delete removes it", async ({ page }) => {
    await selectSection(page);
    await page.keyboard.press("Delete");
    await page.waitForTimeout(500);
    expect(await storedNode(page, "sec"), "Delete did nothing").toBeNull();
  });

  test("clicking around the page never sends React into a loop", async ({ page }) => {
    /**
     * THE FIRST FIX FOR THE STALE CARET TOOK THE EDITOR DOWN, and it was the user who found it:
     *
     *     Maximum update depth exceeded … ChromeMirror.useEffect.measure
     *
     * Blurring changes focus, which can change the selection, which re-ran the effect watching the
     * selection, which blurred again. A selection change is an EVENT, not a state to reconcile — it is
     * handled where the click happens now, once, with no render in the cycle.
     *
     * The assertion is on the CONSOLE rather than on any rectangle, because that is where this failure
     * appears: the page keeps rendering, the chrome keeps measuring, and the only outward sign is an error
     * overlay in front of everything the person was doing.
     */
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

    // Around the page the way a person moves: into the text, out to the box, out to the section, back in.
    for (const id of ["words", "inner", "sec", "words", "sec", "inner", "words"]) {
      const b = await page.locator(`[data-box-id="${id}"]`).boundingBox();
      if (!b) continue;
      await page.mouse.click(b.x + b.width * 0.4, b.y + b.height * 0.5);
      await page.waitForTimeout(220);
    }
    await page.waitForTimeout(800); // a loop needs a moment to be given up on
    expect(errors.filter((e) => /Maximum update depth/i.test(e)), "the render loop is back").toEqual([]);
    expect(errors, `the console is clean: ${errors.slice(0, 3).join(" | ")}`).toEqual([]);
  });

  test("ONE click into a text block, a pause, then typing — and the text lands", async ({ page }) => {
    /**
     * THIS IS THE TEST THAT WAS MISSING, AND THE REASON THE FIX FOR THE STALE CARET COULD EAT TYPING.
     *
     * The drill-in test below clicks up to FIVE times, stopping once the selection is the text block itself.
     * By then `owner === wanted` and the caret-clearing has nothing to object to — so it passed throughout,
     * while a person clicking ONCE lost what they typed. A guard that first manoeuvres the app into the one
     * state where the bug cannot happen is not a guard.
     *
     * One click is what starting to edit actually looks like, and the drill-down rule means that click
     * selects the outermost BAND, not the text — so the caret and the selection legitimately disagree, and
     * anything that "corrects" that disagreement throws the person's words away. Measured before the fix:
     * the text went nowhere in 2 of 3 attempts.
     *
     * The pause is load-bearing. Everything wrong here happened one frame after the click, so typing
     * immediately hid it; a person takes a moment to start typing, and so does this.
     */
    const b = (await page.locator('[data-box-id="words"]').boundingBox())!;
    await page.mouse.click(b.x + b.width * 0.3, b.y + b.height * 0.5);
    await page.waitForTimeout(700); // a person does not type in the same frame they click
    const s = await state(page);
    expect(s.editingBlock, `the caret was taken out of the text before a word could be typed (selection was "${s.selection}")`).toBe("words");
    await page.keyboard.type("HELLO");
    await page.waitForTimeout(400);
    await expect(page.locator('[data-box-id="words"]'), "the typing went nowhere").toContainText("HELLO");
  });

  test("clicking the empty part of a box does not hand the caret to the text inside it", async ({ page }) => {
    /**
     * THE BROWSER IS THE ONE PUTTING IT THERE. Clicking empty space inside a box means "put the caret in the
     * text near here" to Chrome: it looks for the nearest caret position to the point and focuses the
     * editable that holds it. Measured — the focus arrived 17ms after mousedown (that is mouseup), on the
     * original span, with no `.focus()` call and no Selection call anywhere in the trace.
     *
     * Blurring afterwards cannot win that race; three attempts measured it losing, one of them leaving the
     * caret stranded PERMANENTLY. The default action has to be refused instead.
     *
     * The assertion is on the STEADY state a second later, not on the frame after the click, because the
     * broken version cleared up correctly at first and only handed the caret back afterwards.
     */
    const b = (await page.locator('[data-box-id="sec"]').boundingBox())!;
    await page.mouse.click(b.x + b.width * 0.5, b.y + b.height * 0.85); // empty space well below the text
    await page.waitForTimeout(1000);
    const s = await state(page);
    expect(s.editingBlock, `the browser put the caret back into "${s.editingBlock}" — every shortcut dies there`).toBeNull();

    // And the shortcuts really are alive, which is the whole point of keeping the caret out.
    const boxes = () => page.evaluate(() => document.querySelectorAll("[data-box-id]").length);
    const before = await boxes();
    await page.keyboard.press("Control+d");
    await page.waitForTimeout(500);
    expect(await boxes(), "Ctrl+D did nothing, so the caret is still holding the keyboard").toBeGreaterThan(before);
  });

  test("…and typing in a text block is still typing", async ({ page }) => {
    // The guard above must not be bought by breaking the thing it protects. Drill in to the text itself.
    const b = (await page.locator('[data-box-id="words"]').boundingBox())!;
    for (let i = 0; i < 5; i++) {
      if ((await state(page)).selection === "words") break;
      await page.mouse.click(b.x + b.width * 0.3, b.y + b.height * 0.5);
      await page.waitForTimeout(220);
    }
    expect((await state(page)).editingBlock, "the caret belongs in the block you selected").toBe("words");
    await page.keyboard.type("ZZ");
    await page.waitForTimeout(400);
    await expect(page.locator('[data-box-id="words"]')).toContainText("ZZ");
  });
});
