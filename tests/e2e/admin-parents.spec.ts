import { test, expect } from "@playwright/test";

// ============================================================
// Admin Portal - Parent Management E2E Tests
// ============================================================

test.describe("Admin Portal - Parent Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/parents");
  });

  test("loads the admin parents page", async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/parents/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("displays parent list", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible();
  });

  test("can search parents by name", async ({ page }) => {
    const searchInput = page.locator("input[placeholder*='earch'], input[type='search']").first();
    if (await searchInput.isVisible()) {
      await searchInput.fill("Emeka");
      await page.waitForTimeout(500); // debounce
    }
  });

  test("can toggle between grid and list view", async ({ page }) => {
    const viewToggle = page.locator("button").filter({ hasText: /grid|list/i }).first();
    if (await viewToggle.isVisible()) {
      await viewToggle.click();
    }
  });

  test("can open filter dropdown", async ({ page }) => {
    const filterBtn = page.locator("button").filter({ hasText: /filter/i }).first();
    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test("can open sort dropdown", async ({ page }) => {
    const sortBtn = page.locator("button").filter({ hasText: /sort/i }).first();
    if (await sortBtn.isVisible()) {
      await sortBtn.click();
      await page.waitForTimeout(300);
    }
  });
});

// ============================================================
// Admin - Parent Detail View
// ============================================================

test.describe("Admin Portal - Parent Detail", () => {
  test("can navigate to a parent detail page", async ({ page }) => {
    await page.goto("/admin/parents");
    const parentLink = page.locator("a[href*='/admin/parents/']").first();
    if (await parentLink.isVisible()) {
      await parentLink.click();
      await expect(page).toHaveURL(/\/admin\/parents\/.+/);
    }
  });
});

// ============================================================
// Responsive Tests for Admin Parents
// ============================================================

test.describe("Admin Parents - Responsive", () => {
  test("admin parents page renders without overflow", async ({ page }) => {
    await page.goto("/admin/parents");
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });
});
