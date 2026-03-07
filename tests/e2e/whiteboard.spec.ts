import { test, expect, type Page } from "@playwright/test";

// Helper: navigate and wait for page load
async function goto(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

// ─── Whiteboard Page Navigation ─────────────────────────────

// Feature: Whiteboard pages are accessible via navigation
test.describe("Whiteboard Pages", () => {
  // Scenario: User navigates to standalone whiteboard page
  test("navigates to standalone whiteboard page", async ({ page }) => {
    // Given the user navigates to the whiteboard page
    await goto(page, "/whiteboard");
    // Then the page body should be visible
    await expect(page.locator("body")).toBeVisible();
  });

  // Scenario: User navigates to classroom whiteboard page
  test("navigates to classroom whiteboard page", async ({ page }) => {
    // Given the user navigates to the classroom whiteboard page
    await goto(page, "/classroom/whiteboard");
    // Then the page body should be visible
    await expect(page.locator("body")).toBeVisible();
  });
});

// ─── Admin Whiteboard ───────────────────────────────────────

// Feature: Admin whiteboard page is accessible
test.describe("Admin Whiteboard", () => {
  // Scenario: User navigates to admin whiteboard page
  test("navigates to admin whiteboard page", async ({ page }) => {
    // Given the user navigates to the admin whiteboard page
    await goto(page, "/admin/whiteboard");
    // Then the page body should be visible
    await expect(page.locator("body")).toBeVisible();
  });
});

// ─── Responsive Layout ─────────────────────────────────────

// Feature: Whiteboard renders correctly at various viewport sizes
test.describe("Whiteboard Responsive Layout", () => {
  // Scenario: Whiteboard renders on mobile viewport
  test("whiteboard renders on mobile viewport", async ({ page }) => {
    // Given the viewport is set to mobile size
    await page.setViewportSize({ width: 375, height: 812 });
    // And the user navigates to the whiteboard page
    await goto(page, "/whiteboard");
    // Then the page body should be visible
    await expect(page.locator("body")).toBeVisible();
  });

  // Scenario: Whiteboard renders on tablet viewport
  test("whiteboard renders on tablet viewport", async ({ page }) => {
    // Given the viewport is set to tablet size
    await page.setViewportSize({ width: 768, height: 1024 });
    // And the user navigates to the whiteboard page
    await goto(page, "/whiteboard");
    // Then the page body should be visible
    await expect(page.locator("body")).toBeVisible();
  });
});
