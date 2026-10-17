import { test, expect } from "@playwright/test";
import type { BoxNode } from "@/lib/box-model";
import { seedSite } from "./helpers/seed-site";

/**
 * A BLOCK PICKED WITH THE POINTER TAKES THE KEYBOARD TOO (F1-c, found by the F-1 UAT pass through the UI): a block is not
 * focusable, so clicking it left the focus on the last control used — a device preset — and Z1-j rightly gives a focused
 * control its own keys. Switch to Desktop, click a block, press Delete: nothing happened. Seeded only to pin the shape the
 * UI repro built (RULE Y).
 */
const stack = (id: string): BoxNode => ({
  id, type: "container", direction: "column", width: "100%", minHeight: 160, children: [
    { id: `${id}-t`, type: "text", text: `Words in ${id}`, width: "auto" } as unknown as BoxNode,
  ],
} as unknown as BoxNode);

for (const preset of ["Desktop (1280px)", "Tablet (768px)", "Mobile (375px)"]) {
  test(`after clicking "${preset}", a block clicked on the canvas is deleted by Delete`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await seedSite(page, { homeId: "p1", pages: [{ id: "p1", name: "Home", path: "/", root: { id: "root", type: "container", direction: "column", children: [stack("a"), stack("b")] } as unknown as BoxNode }] });
    await page.waitForSelector('[data-box-id="b"]', { timeout: 30000 });
    await page.getByRole("button", { name: preset }).first().click(); // the focus is now on that button
    await page.waitForTimeout(600);
    const box = (await page.locator('[data-box-id="b"]').boundingBox())!;
    await page.mouse.click(box.x + box.width * 0.8, box.y + box.height * 0.8); // the empty part of the stack, as a person clicks it
    await expect.poll(() => page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id")), { timeout: 3000, message: "the click did not select the stack" }).toBe("b");
    await page.keyboard.press("Delete");
    await expect(page.locator('[data-box-id="b"]'), "Delete did nothing: the focus stayed on the preset button").toHaveCount(0);
    await expect(page.locator('[data-box-id="a"]')).toHaveCount(1);
  });
}

/**
 * LE8-6 (found by the LE-8 HEADED pass, through the UI): after ticking a checkbox in the Inspector ("On every page"), Escape
 * did nothing — the canvas treated a focused checkbox as text being typed. A checkbox is a CONTROL (Z1-j): it keeps the keys
 * it uses (Space, Delete), and Escape steps out of the block as it does after a button. Seeded only to pin the UI repro.
 */
test("after ticking an Inspector checkbox, Escape steps out of the block — and Delete does not delete it", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const hdr = { ...stack("h"), tag: "header", shared: true } as unknown as BoxNode;
  await seedSite(page, { homeId: "p1", pages: [{ id: "p1", name: "Home", path: "/", root: { id: "root", type: "container", direction: "column", children: [hdr, stack("b")] } as unknown as BoxNode }] });
  await page.waitForSelector('[data-box-id="h"]', { timeout: 30000 });
  const box = (await page.locator('[data-box-id="h"]').boundingBox())!;
  await page.mouse.click(box.x + box.width * 0.8, box.y + box.height * 0.8);
  const sel = () => page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
  await expect.poll(sel, { timeout: 3000 }).toBe("h");
  const meaning = page.getByRole("button", { name: /^\s*Meaning\s*$/ }).first();
  if ((await meaning.getAttribute("aria-expanded")) === "false") await meaning.click();
  const cb = page.getByRole("checkbox", { name: "On every page" });
  await cb.click(); await expect(cb).not.toBeChecked(); // the focus is now on the checkbox
  await page.keyboard.press("Delete");
  await expect(page.locator('[data-box-id="h"]'), "Delete on a focused checkbox deleted the block").toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect.poll(sel, { timeout: 3000, message: "Escape with the checkbox focused did not step out" }).toBeNull();
});
