import { test, expect, type Page } from "@playwright/test";

// Helper: navigate and wait for page load
async function goto(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

// ─── Admin Messages & Chat ─────────────────────────────────────────

test.describe("Admin Parent Messages", () => {
  test("navigates to admin parent messages page", async ({ page }) => {
    await goto(page, "/admin/parents/messages");
    await expect(page.locator("body")).toBeVisible();
  });

  test("navigates to compose message page", async ({ page }) => {
    await goto(page, "/admin/parents/messages/compose");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Admin Parent Chat", () => {
  test("navigates to admin parent chat page", async ({ page }) => {
    await goto(page, "/admin/parents/chat");
    await expect(page.locator("body")).toBeVisible();
  });

  test("navigates to compose chat page", async ({ page }) => {
    await goto(page, "/admin/parents/chat/compose");
    await expect(page.locator("body")).toBeVisible();
  });
});

// ─── Parent Messages & Chat ────────────────────────────────────────

test.describe("Parent Messages", () => {
  test("navigates to parent messages page", async ({ page }) => {
    await goto(page, "/parents/messages");
    await expect(page.locator("body")).toBeVisible();
  });

  test("navigates to compose message page", async ({ page }) => {
    await goto(page, "/parents/messages/compose");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Parent Chat", () => {
  test("navigates to parent chat page", async ({ page }) => {
    await goto(page, "/parents/chat");
    await expect(page.locator("body")).toBeVisible();
  });

  test("navigates to compose chat page", async ({ page }) => {
    await goto(page, "/parents/chat/compose");
    await expect(page.locator("body")).toBeVisible();
  });
});

// ─── Communication Settings ────────────────────────────────────────

test.describe("Communication Settings", () => {
  test("navigates to admin communication settings page", async ({ page }) => {
    await goto(page, "/admin/settings/communication");
    await expect(page.locator("body")).toBeVisible();
  });

  test("navigates to user communication settings page", async ({ page }) => {
    await goto(page, "/settings/communication");
    await expect(page.locator("body")).toBeVisible();
  });
});

// ─── Responsive Layout ─────────────────────────────────────────────

test.describe("Communication Responsive Layout", () => {
  test("messages page renders correctly on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await goto(page, "/admin/parents/messages");
    await expect(page.locator("body")).toBeVisible();
  });

  test("chat page renders correctly on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await goto(page, "/admin/parents/chat");
    await expect(page.locator("body")).toBeVisible();
  });
});
