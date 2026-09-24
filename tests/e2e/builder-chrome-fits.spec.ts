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
  "Preview screen size", "Base size (px)", "Website theme", "Change theme",
  "Add page", "Page settings",
];

test.describe("the builder's toolbar fits the screen it is on", () => {
  test("every control is on screen from 375px to 1536px, and the page never scrolls sideways", async ({ page }) => {
    await page.goto("/website/box-demo");
    await page.waitForSelector("header", { timeout: 30000 });
    await page.waitForTimeout(600);

    const failures: string[] = [];
    const heights: { w: number; h: number }[] = [];

    for (const w of [375, 414, 768, 1024, 1280, 1536]) {
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
    const desktop = heights.find((x) => x.w === 1536)!;
    expect(desktop.h, `the toolbar takes ${desktop.h}px on a 1536px screen — it should still be one row`).toBeLessThanOrEqual(64);
    const phone = heights.find((x) => x.w === 375)!;
    expect(phone.h, "a phone needs MORE rows, not fewer — if this equals the desktop height nothing wrapped").toBeGreaterThan(desktop.h);
  });
});
