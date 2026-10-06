import { test, expect } from "@playwright/test";

/**
 * D3-16 — RESET ASKS FIRST AND CAN BE UNDONE. Behaviours: tests/features/components/website/box-builder-site.feature.
 * Reset replaced every page and emptied the undo history in one click; a mis-click lost the whole site for good.
 */
const pages = (page: import("@playwright/test").Page) => page.evaluate(() => JSON.parse(localStorage.getItem("educo_box_site_v1") || "{}").pages?.length ?? 0);

test("Reset asks before starting the site over, and Undo brings every page back", async ({ page }) => {
  await page.goto("/website/box-demo");
  await page.getByRole("button", { name: "Add page" }).click();
  await expect.poll(() => pages(page)).toBe(2);

  await page.getByRole("button", { name: "Reset", exact: true }).click();
  // D3-18: announced as a dialog, by its name, with focus on the safe choice
  const dialog = page.getByRole("alertdialog", { name: "Start the whole site over?" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Cancel" })).toBeFocused();
  // D3-19: Escape closes it (an earlier keydown listener's re-render used to remove its handler mid-event)
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  expect(await pages(page)).toBe(2);

  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await dialog.getByRole("button", { name: "Start over" }).click();
  await expect.poll(() => pages(page)).toBe(1);

  await page.keyboard.press("Control+z");
  await expect.poll(() => pages(page)).toBe(2);
});
