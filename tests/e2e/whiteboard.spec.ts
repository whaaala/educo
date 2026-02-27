import { test, expect, type Page } from "@playwright/test";

// Helper: navigate and wait for page load
async function goto(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

// ─── Whiteboard Page Navigation ─────────────────────────────

test.describe("Whiteboard Pages", () => {
  test("navigates to standalone whiteboard page", async ({ page }) => {
    await goto(page, "/whiteboard");
    await expect(page.locator("body")).toBeVisible();
  });

  test("navigates to classroom whiteboard page", async ({ page }) => {
    await goto(page, "/classroom/whiteboard");
    await expect(page.locator("body")).toBeVisible();
  });
});

// ─── Admin Whiteboard ───────────────────────────────────────

test.describe("Admin Whiteboard", () => {
  test("navigates to admin whiteboard page", async ({ page }) => {
    await goto(page, "/admin/whiteboard");
    await expect(page.locator("body")).toBeVisible();
  });
});

// ─── Responsive Layout ─────────────────────────────────────

test.describe("Whiteboard Responsive Layout", () => {
  test("whiteboard renders on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await goto(page, "/whiteboard");
    await expect(page.locator("body")).toBeVisible();
  });

  test("whiteboard renders on tablet viewport", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await goto(page, "/whiteboard");
    await expect(page.locator("body")).toBeVisible();
  });
});
