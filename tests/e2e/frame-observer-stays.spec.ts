import { test, expect } from "@playwright/test";
import { seedSite, sitePage } from "./helpers/seed-site";
import type { BoxNode } from "@/lib/box-model";

/**
 * TYPING NEVER RE-CREATES THE CANVAS FRAME'S RESIZE OBSERVER (L-3 change 1 — React error #185, 2026-10-02).
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature — "Typing fast on a slow phone never
 * crashes the builder".
 *
 * Reproduced through the UI first (`scripts/uat/probe-l3b.js`: page 332 built by the palette, 3 × 150 characters typed
 * into 12 blocks, CPU slowed 3×): React #185 in every stressed window, 13 of 13 thrown from ONE place — the
 * ResizeObserver on the canvas frame (`app/website/box-demo/page.tsx`). Its effect depended on `site`, which changes on
 * every key, so every key tore the observer down and made a new one; a new observer always reports once, and each
 * report set the frame height again (6,216px, the same value 30 times running, zoom and room unchanged). Under fast
 * typing those updates stacked past React's limit of 50.
 *
 * The page is SEEDED here only to pin that repro (RULE Y). Asserted: the number of observers watching the frame does
 * not grow with typing.
 */
const page1 = () => sitePage([
  { id: "sec", type: "container", direction: "column", width: "100%",
    children: [{ id: "h", type: "heading", text: "Riverside Primary School", width: "100%" } as unknown as BoxNode] } as unknown as BoxNode,
]);

test("typing 40 characters creates no new observer on the canvas frame", async ({ page }) => {
  await page.addInitScript(() => {
    const RO = window.ResizeObserver; (window as unknown as { __frameObservers: number }).__frameObservers = 0;
    window.ResizeObserver = class extends RO {
      observe(target: Element, opts?: ResizeObserverOptions) {
        if (target.hasAttribute("data-canvas-scale")) (window as unknown as { __frameObservers: number }).__frameObservers++;
        return super.observe(target, opts);
      }
    };
  });
  await seedSite(page, page1());
  const words = page.locator('[data-box-id="h"] [contenteditable]').first();
  await words.click();
  const count = () => page.evaluate(() => (window as unknown as { __frameObservers: number }).__frameObservers);
  const before = await count();
  expect(before).toBeGreaterThan(0); // the frame IS observed — a guard that counts nothing cannot fail
  await page.keyboard.type(" and its forty extra letters!", { delay: 30 });
  await page.waitForTimeout(800);
  expect(await count(), "observers made while typing").toBe(before);
});
