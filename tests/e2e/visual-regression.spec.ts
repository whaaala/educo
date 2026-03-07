import { test, expect, type Page } from "@playwright/test";

// Helper: navigate and wait for stable render
async function goto(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  // Wait for animations to settle
  await page.waitForTimeout(500);
}

// Viewport presets used across tests
const viewports = {
  desktop: { width: 1280, height: 720 },
  tabletLandscape: { width: 1024, height: 768 },
  tabletPortrait: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
};

// ─── Root App — Visual Regression ───────────────────────────

// Feature: Root App - Visual Regression
test.describe("Root App — Visual Regression", () => {
  // ─── Dashboard / Home ────────────────────────
  for (const [name, vp] of Object.entries(viewports)) {
    // Scenario: Home page renders correctly on each viewport
    test(`home page renders correctly on ${name} (${vp.width}x${vp.height})`, async ({
      page,
    }) => {
      // Given the viewport is set to the target dimensions
      await page.setViewportSize(vp);
      // And the user navigates to the home page
      await goto(page, "/");
      // Then the page body should be visible
      await expect(page.locator("body")).toBeVisible();
      // And the screenshot should match the baseline
      await expect(page).toHaveScreenshot(`home-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }

  // ─── Parent Messages ─────────────────────────
  for (const [name, vp] of Object.entries(viewports)) {
    // Scenario: Parent messages page renders correctly on each viewport
    test(`parent messages page on ${name}`, async ({ page }) => {
      // Given the viewport is set to the target dimensions
      await page.setViewportSize(vp);
      // And the user navigates to the parent messages page
      await goto(page, "/parents/messages");
      // Then the page body should be visible
      await expect(page.locator("body")).toBeVisible();
      // And the screenshot should match the baseline
      await expect(page).toHaveScreenshot(`parent-messages-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }

  // ─── Parent Chat ─────────────────────────────
  for (const [name, vp] of Object.entries(viewports)) {
    // Scenario: Parent chat page renders correctly on each viewport
    test(`parent chat page on ${name}`, async ({ page }) => {
      // Given the viewport is set to the target dimensions
      await page.setViewportSize(vp);
      // And the user navigates to the parent chat page
      await goto(page, "/parents/chat");
      // Then the page body should be visible
      await expect(page.locator("body")).toBeVisible();
      // And the screenshot should match the baseline
      await expect(page).toHaveScreenshot(`parent-chat-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }

  // ─── Whiteboard ──────────────────────────────
  for (const [name, vp] of Object.entries(viewports)) {
    // Scenario: Whiteboard page renders correctly on each viewport
    test(`whiteboard page on ${name}`, async ({ page }) => {
      // Given the viewport is set to the target dimensions
      await page.setViewportSize(vp);
      // And the user navigates to the whiteboard page
      await goto(page, "/whiteboard");
      // Then the page body should be visible
      await expect(page.locator("body")).toBeVisible();
      // And the screenshot should match the baseline
      await expect(page).toHaveScreenshot(`whiteboard-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }

  // ─── Communication Settings ──────────────────
  for (const [name, vp] of Object.entries(viewports)) {
    // Scenario: Communication settings page renders correctly on each viewport
    test(`communication settings on ${name}`, async ({ page }) => {
      // Given the viewport is set to the target dimensions
      await page.setViewportSize(vp);
      // And the user navigates to the communication settings page
      await goto(page, "/settings/communication");
      // Then the page body should be visible
      await expect(page.locator("body")).toBeVisible();
      // And the screenshot should match the baseline
      await expect(page).toHaveScreenshot(`comm-settings-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }
});

// ─── Admin App — Visual Regression ──────────────────────────

// Feature: Admin App - Visual Regression
test.describe("Admin App — Visual Regression", () => {
  // ─── Admin Dashboard ─────────────────────────
  for (const [name, vp] of Object.entries(viewports)) {
    // Scenario: Admin dashboard renders correctly on each viewport
    test(`admin dashboard on ${name}`, async ({ page }) => {
      // Given the viewport is set to the target dimensions
      await page.setViewportSize(vp);
      // And the admin navigates to the dashboard
      await goto(page, "/admin");
      // Then the page body should be visible
      await expect(page.locator("body")).toBeVisible();
      // And the screenshot should match the baseline
      await expect(page).toHaveScreenshot(`admin-dashboard-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }

  // ─── Admin Parent Messages ───────────────────
  for (const [name, vp] of Object.entries(viewports)) {
    // Scenario: Admin parent messages page renders correctly on each viewport
    test(`admin parent messages on ${name}`, async ({ page }) => {
      // Given the viewport is set to the target dimensions
      await page.setViewportSize(vp);
      // And the admin navigates to the parent messages page
      await goto(page, "/admin/parents/messages");
      // Then the page body should be visible
      await expect(page.locator("body")).toBeVisible();
      // And the screenshot should match the baseline
      await expect(page).toHaveScreenshot(`admin-messages-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }

  // ─── Admin Parent Chat ───────────────────────
  for (const [name, vp] of Object.entries(viewports)) {
    // Scenario: Admin parent chat page renders correctly on each viewport
    test(`admin parent chat on ${name}`, async ({ page }) => {
      // Given the viewport is set to the target dimensions
      await page.setViewportSize(vp);
      // And the admin navigates to the parent chat page
      await goto(page, "/admin/parents/chat");
      // Then the page body should be visible
      await expect(page.locator("body")).toBeVisible();
      // And the screenshot should match the baseline
      await expect(page).toHaveScreenshot(`admin-chat-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }

  // ─── Admin Whiteboard ────────────────────────
  for (const [name, vp] of Object.entries(viewports)) {
    // Scenario: Admin whiteboard page renders correctly on each viewport
    test(`admin whiteboard on ${name}`, async ({ page }) => {
      // Given the viewport is set to the target dimensions
      await page.setViewportSize(vp);
      // And the admin navigates to the whiteboard page
      await goto(page, "/admin/whiteboard");
      // Then the page body should be visible
      await expect(page.locator("body")).toBeVisible();
      // And the screenshot should match the baseline
      await expect(page).toHaveScreenshot(`admin-whiteboard-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }

  // ─── Admin Communication Settings ────────────
  for (const [name, vp] of Object.entries(viewports)) {
    // Scenario: Admin communication settings page renders correctly on each viewport
    test(`admin communication settings on ${name}`, async ({ page }) => {
      // Given the viewport is set to the target dimensions
      await page.setViewportSize(vp);
      // And the admin navigates to the communication settings page
      await goto(page, "/admin/settings/communication");
      // Then the page body should be visible
      await expect(page.locator("body")).toBeVisible();
      // And the screenshot should match the baseline
      await expect(page).toHaveScreenshot(`admin-comm-settings-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }

  // ─── Admin Tenant Create ─────────────────────
  for (const [name, vp] of Object.entries(viewports)) {
    // Scenario: Admin tenant create page renders correctly on each viewport
    test(`admin tenant create page on ${name}`, async ({ page }) => {
      // Given the viewport is set to the target dimensions
      await page.setViewportSize(vp);
      // And the admin navigates to the tenant create page
      await goto(page, "/admin/tenants/create");
      // Then the page body should be visible
      await expect(page.locator("body")).toBeVisible();
      // And the screenshot should match the baseline
      await expect(page).toHaveScreenshot(`admin-tenant-create-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }
});

// ─── Theme Visual Regression ────────────────────────────────

// Feature: Theme Visual Regression
test.describe("Theme Visual Regression", () => {
  // Test the same page across all 4 themes
  const themes = ["light", "dark", "midnight", "purple"] as const;

  for (const theme of themes) {
    // Scenario: Home page renders correctly in each theme
    test(`home page in ${theme} theme`, async ({ page }) => {
      // Given the viewport is set to desktop dimensions
      await page.setViewportSize(viewports.desktop);
      // And the user navigates to the home page
      await goto(page, "/");
      // When the theme is applied to the document element
      if (theme !== "light") {
        await page.evaluate((t) => {
          document.documentElement.classList.add("dark");
          if (t !== "dark") {
            document.documentElement.classList.add(t);
          }
        }, theme);
        await page.waitForTimeout(300);
      }
      // Then the screenshot should match the baseline for the theme
      await expect(page).toHaveScreenshot(`home-theme-${theme}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }

  for (const theme of themes) {
    // Scenario: Admin messages page renders correctly in each theme
    test(`admin messages page in ${theme} theme`, async ({ page }) => {
      // Given the viewport is set to desktop dimensions
      await page.setViewportSize(viewports.desktop);
      // And the admin navigates to the parent messages page
      await goto(page, "/admin/parents/messages");
      // When the theme is applied to the document element
      if (theme !== "light") {
        await page.evaluate((t) => {
          document.documentElement.classList.add("dark");
          if (t !== "dark") {
            document.documentElement.classList.add(t);
          }
        }, theme);
        await page.waitForTimeout(300);
      }
      // Then the screenshot should match the baseline for the theme
      await expect(page).toHaveScreenshot(`admin-messages-theme-${theme}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }
});

// ─── Component Interaction States ───────────────────────────

// Feature: Interactive State Screenshots
test.describe("Interactive State Screenshots", () => {
  // Scenario: Compose message page form layout on desktop
  test("compose message page — form layout on desktop", async ({ page }) => {
    // Given the viewport is set to desktop dimensions
    await page.setViewportSize(viewports.desktop);
    // And the admin navigates to the compose message page
    await goto(page, "/admin/parents/messages/compose");
    // Then the page body should be visible
    await expect(page.locator("body")).toBeVisible();
    // And the screenshot should match the baseline
    await expect(page).toHaveScreenshot("compose-message-desktop.png", {
      maxDiffPixelRatio: 0.05,
      fullPage: true,
    });
  });

  // Scenario: Compose message page form layout on mobile
  test("compose message page — form layout on mobile", async ({ page }) => {
    // Given the viewport is set to mobile dimensions
    await page.setViewportSize(viewports.mobile);
    // And the admin navigates to the compose message page
    await goto(page, "/admin/parents/messages/compose");
    // Then the page body should be visible
    await expect(page.locator("body")).toBeVisible();
    // And the screenshot should match the baseline
    await expect(page).toHaveScreenshot("compose-message-mobile.png", {
      maxDiffPixelRatio: 0.05,
      fullPage: true,
    });
  });

  // Scenario: Compose chat page form layout on tablet
  test("compose chat page — form layout on tablet", async ({ page }) => {
    // Given the viewport is set to tablet portrait dimensions
    await page.setViewportSize(viewports.tabletPortrait);
    // And the admin navigates to the compose chat page
    await goto(page, "/admin/parents/chat/compose");
    // Then the page body should be visible
    await expect(page.locator("body")).toBeVisible();
    // And the screenshot should match the baseline
    await expect(page).toHaveScreenshot("compose-chat-tablet-portrait.png", {
      maxDiffPixelRatio: 0.05,
      fullPage: true,
    });
  });
});
