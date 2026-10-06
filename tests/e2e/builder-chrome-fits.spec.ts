import { test, expect } from "@playwright/test";

/**
 * THE EDITOR'S OWN TOOLBAR FITS ON THE SCREEN — every control, at every width.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * Found by looking at the builder at 375px and 768px, which nothing had ever done: every guard in this repo
 * drives the CANVAS, and the canvas is only half of what a person uses. What the screenshots showed:
 *
 *   • 375px — "Add a band" wrapped onto three lines inside a 56px bar, the page tab read "Hom", and Preview,
 *     Export, Reset and the device chips were simply not on the screen at all.
 *   • 768px — the whole right-hand group (device chips, base size, both theme switchers) sat past the right
 *     edge, reachable only by scrolling the entire PAGE sideways.
 *
 * A control that cannot be reached is a control that is not there, so this asserts the property directly:
 * NAME every control the toolbar offers, and require each one to be inside the window. Naming them, rather
 * than counting or sampling, is what makes the guard specific — a control that disappears is named in the
 * failure, and a control added later is added to this list.
 *
 * The widths run from the narrowest phone in use to a desktop, and the desktop end matters as much as the
 * phone end: the remedy for a cramped bar is to let it wrap, and a bar that wrapped at 1280px would be a
 * regression of its own.
 */

/** Every control in the header, by its accessible name. Add to this when the toolbar gains one. */
const CONTROLS = [
  "Add a band", "Undo", "Redo", "Preview", "Export", "Reset",
  "Preview screen size", "Canvas zoom", "Zoom canvas in", "Zoom canvas out", "Base size (px)", "Website theme", "Change theme",
  "Add page", "Page settings", "Layout guides",
];

test.describe("the builder's toolbar fits the screen it is on", () => {
  test("every control is on screen from 375px to 1536px, and the page never scrolls sideways", async ({ page }) => {
    await page.goto("/website/box-demo");
    await page.waitForSelector("header", { timeout: 30000 });
    await page.waitForTimeout(600);

    const failures: string[] = [];
    const heights: { w: number; h: number }[] = [];

    // every 20px from 1280 to 1920 (E3-7: chosen widths missed 1480 – 1536 and 1700, where the bar wrapped)
    for (const w of [375, 414, 768, 1024, ...Array.from({ length: 33 }, (_, i) => 1280 + i * 20), 1366, 1536]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.waitForTimeout(250);
      const r = await page.evaluate((controls) => {
        const header = document.querySelector("header")!;
        const named = (name: string) => Array.from(header.querySelectorAll("button, input, [role='group']"))
          .find((e) => ((e.getAttribute("aria-label") || e.textContent || "").trim() === name));
        const missing: string[] = [];
        const offscreen: string[] = [];
        for (const name of controls) {
          const el = named(name);
          if (!el) { missing.push(name); continue; }
          const b = el.getBoundingClientRect();
          if (b.width === 0 || b.height === 0) { missing.push(`${name} (zero-sized)`); continue; }
          if (b.right > window.innerWidth + 1 || b.left < -1) {
            offscreen.push(`${name} spans ${Math.round(b.left)}..${Math.round(b.right)} in a ${window.innerWidth}px window`);
          }
        }
        return {
          missing, offscreen,
          headerH: Math.round(header.getBoundingClientRect().height),
          sideways: document.documentElement.scrollWidth > window.innerWidth + 1,
        };
      }, CONTROLS);

      heights.push({ w, h: r.headerH });
      for (const m of r.missing) failures.push(`${w}px: "${m}" is not in the toolbar`);
      for (const o of r.offscreen) failures.push(`${w}px: ${o}`);
      if (r.sideways) failures.push(`${w}px: the page scrolls sideways, so the toolbar is only reachable by dragging the page`);
    }
    expect(failures, failures.join("\n")).toEqual([]);

    /**
     * AND A DESKTOP STILL GETS ONE ROW. Wrapping is the remedy at a phone width and a defect at a desktop
     * one: a toolbar that takes three rows on a 1536px monitor has traded the bug for a worse one. 56px is
     * the single-row height the bar has always had.
     */
    // ONE ROW FROM 1280 (D3-32, the user 2026-10-06): two rows (92px) at 1280 / 1366 / 1440 until the five left-hand words folded to
    // icons below 1600, and the right-hand labels moved from 1700 to 1800 (E3-7)
    for (const d of heights.filter((x) => x.w >= 1280)) {
      expect(d.h, `the toolbar takes ${d.h}px on a ${d.w}px screen — it should still be one row`).toBeLessThanOrEqual(64);
    }
    const desktop = heights.find((x) => x.w === 1536)!;
    const phone = heights.find((x) => x.w === 375)!;
    expect(phone.h, "a phone needs MORE rows, not fewer — if this equals the desktop height nothing wrapped").toBeGreaterThan(desktop.h);
  });

  test("below 1600px the five words fold to icons, each keeping its name and its tooltip (D3-32)", async ({ page }) => {
    await page.goto("/website/box-demo");
    await page.waitForSelector("header", { timeout: 30000 });
    const WORDS = ["Add a band", "Page check", "Preview", "Export", "Reset"];
    for (const [w, shown] of [[1599, false], [1600, true]] as const) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.waitForTimeout(250);
      for (const name of WORDS) {
        const b = page.locator("header").getByRole("button", { name, exact: name !== "Page check" }).first();
        await expect(b, `${w}px: "${name}" is a button by that name`).toBeVisible();
        expect(await b.getAttribute("title"), `${w}px: "${name}" keeps its tooltip`).toBeTruthy();
        expect((await b.innerText()).includes(name), `${w}px: the word "${name}" ${shown ? "is" : "is not"} on the button`).toBe(shown);
      }
    }
  });

  test("the Page check opens from the keyboard, takes the focus, and Escape closes it; the page's keys wait (E3-9 / 10 / 11)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/website/box-demo");
    await page.waitForSelector("header", { timeout: 30000 });
    const blocks = () => page.locator("[data-box-id]").count();
    await page.locator("header").getByRole("button", { name: "Add a band" }).click();
    await page.waitForTimeout(500);
    const n = await blocks();
    const check = page.locator("header").getByRole("button", { name: "Page check" }).first();
    await check.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Page check" });
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate((d) => d.contains(document.activeElement)), "the focus went into the dialog").toBe(true);
    await page.keyboard.press("Control+z");
    await page.waitForTimeout(400);
    expect(await blocks(), "Ctrl+Z under the open dialog left the page alone").toBe(n);
    await page.keyboard.press("Escape");
    await expect(dialog, "ONE Escape closes it").toHaveCount(0);
    expect(await check.evaluate((b) => b === document.activeElement), "the focus is back on the button that opened it").toBe(true);
  });

  test("the Inspector follows the width at every crossing of 64em, as on load (E3-3, the user 2026-10-06)", async ({ page }) => {
    const docked = () => page.locator('aside[aria-label="Inspector"]').isVisible();
    await page.setViewportSize({ width: 768, height: 1000 });
    await page.goto("/website/box-demo");
    await page.waitForSelector("header", { timeout: 30000 });
    await page.waitForTimeout(500);
    expect(await docked(), "768: it starts as its tab").toBe(false);
    await page.setViewportSize({ width: 1024, height: 1000 }); await page.waitForTimeout(400);
    expect(await docked(), "widened to 1024 (the crossing itself): it docks open").toBe(true);
    await page.setViewportSize({ width: 1023, height: 1000 }); await page.waitForTimeout(400);
    expect(await docked(), "1023: its tab again").toBe(false);
    await page.getByRole("button", { name: "Expand inspector" }).click(); await page.waitForTimeout(300);
    await page.setViewportSize({ width: 900, height: 1000 }); await page.waitForTimeout(400);
    expect(await docked(), "tapped open, then narrower WITHOUT crossing: the tap holds").toBe(true);
    await page.setViewportSize({ width: 1280, height: 1000 }); await page.waitForTimeout(400);
    await page.getByRole("button", { name: "Collapse inspector" }).click(); await page.waitForTimeout(300);
    await page.setViewportSize({ width: 1440, height: 1000 }); await page.waitForTimeout(400);
    expect(await docked(), "collapsed by hand, wider without crossing: it stays collapsed").toBe(false);
  });
});
