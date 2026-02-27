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

test.describe("Root App — Visual Regression", () => {
  // ─── Dashboard / Home ────────────────────────
  for (const [name, vp] of Object.entries(viewports)) {
    test(`home page renders correctly on ${name} (${vp.width}x${vp.height})`, async ({
      page,
    }) => {
      await page.setViewportSize(vp);
      await goto(page, "/");
      await expect(page.locator("body")).toBeVisible();
      await expect(page).toHaveScreenshot(`home-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }

  // ─── Parent Messages ─────────────────────────
  for (const [name, vp] of Object.entries(viewports)) {
    test(`parent messages page on ${name}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await goto(page, "/parents/messages");
      await expect(page.locator("body")).toBeVisible();
      await expect(page).toHaveScreenshot(`parent-messages-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }

  // ─── Parent Chat ─────────────────────────────
  for (const [name, vp] of Object.entries(viewports)) {
    test(`parent chat page on ${name}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await goto(page, "/parents/chat");
      await expect(page.locator("body")).toBeVisible();
      await expect(page).toHaveScreenshot(`parent-chat-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }

  // ─── Whiteboard ──────────────────────────────
  for (const [name, vp] of Object.entries(viewports)) {
    test(`whiteboard page on ${name}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await goto(page, "/whiteboard");
      await expect(page.locator("body")).toBeVisible();
      await expect(page).toHaveScreenshot(`whiteboard-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }

  // ─── Communication Settings ──────────────────
  for (const [name, vp] of Object.entries(viewports)) {
    test(`communication settings on ${name}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await goto(page, "/settings/communication");
      await expect(page.locator("body")).toBeVisible();
      await expect(page).toHaveScreenshot(`comm-settings-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }
});

// ─── Admin App — Visual Regression ──────────────────────────

test.describe("Admin App — Visual Regression", () => {
  // ─── Admin Dashboard ─────────────────────────
  for (const [name, vp] of Object.entries(viewports)) {
    test(`admin dashboard on ${name}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await goto(page, "/admin");
      await expect(page.locator("body")).toBeVisible();
      await expect(page).toHaveScreenshot(`admin-dashboard-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }

  // ─── Admin Parent Messages ───────────────────
  for (const [name, vp] of Object.entries(viewports)) {
    test(`admin parent messages on ${name}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await goto(page, "/admin/parents/messages");
      await expect(page.locator("body")).toBeVisible();
      await expect(page).toHaveScreenshot(`admin-messages-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }

  // ─── Admin Parent Chat ───────────────────────
  for (const [name, vp] of Object.entries(viewports)) {
    test(`admin parent chat on ${name}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await goto(page, "/admin/parents/chat");
      await expect(page.locator("body")).toBeVisible();
      await expect(page).toHaveScreenshot(`admin-chat-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }

  // ─── Admin Whiteboard ────────────────────────
  for (const [name, vp] of Object.entries(viewports)) {
    test(`admin whiteboard on ${name}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await goto(page, "/admin/whiteboard");
      await expect(page.locator("body")).toBeVisible();
      await expect(page).toHaveScreenshot(`admin-whiteboard-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }

  // ─── Admin Communication Settings ────────────
  for (const [name, vp] of Object.entries(viewports)) {
    test(`admin communication settings on ${name}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await goto(page, "/admin/settings/communication");
      await expect(page.locator("body")).toBeVisible();
      await expect(page).toHaveScreenshot(`admin-comm-settings-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }

  // ─── Admin Tenant Create ─────────────────────
  for (const [name, vp] of Object.entries(viewports)) {
    test(`admin tenant create page on ${name}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await goto(page, "/admin/tenants/create");
      await expect(page.locator("body")).toBeVisible();
      await expect(page).toHaveScreenshot(`admin-tenant-create-${name}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }
});

// ─── Theme Visual Regression ────────────────────────────────

test.describe("Theme Visual Regression", () => {
  // Test the same page across all 4 themes
  const themes = ["light", "dark", "midnight", "purple"] as const;

  for (const theme of themes) {
    test(`home page in ${theme} theme`, async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await goto(page, "/");
      // Apply theme by adding class to document element
      if (theme !== "light") {
        await page.evaluate((t) => {
          document.documentElement.classList.add("dark");
          if (t !== "dark") {
            document.documentElement.classList.add(t);
          }
        }, theme);
        await page.waitForTimeout(300);
      }
      await expect(page).toHaveScreenshot(`home-theme-${theme}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }

  for (const theme of themes) {
    test(`admin messages page in ${theme} theme`, async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await goto(page, "/admin/parents/messages");
      if (theme !== "light") {
        await page.evaluate((t) => {
          document.documentElement.classList.add("dark");
          if (t !== "dark") {
            document.documentElement.classList.add(t);
          }
        }, theme);
        await page.waitForTimeout(300);
      }
      await expect(page).toHaveScreenshot(`admin-messages-theme-${theme}.png`, {
        maxDiffPixelRatio: 0.05,
        fullPage: true,
      });
    });
  }
});

// ─── Component Interaction States ───────────────────────────

test.describe("Interactive State Screenshots", () => {
  test("compose message page — form layout on desktop", async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await goto(page, "/admin/parents/messages/compose");
    await expect(page.locator("body")).toBeVisible();
    await expect(page).toHaveScreenshot("compose-message-desktop.png", {
      maxDiffPixelRatio: 0.05,
      fullPage: true,
    });
  });

  test("compose message page — form layout on mobile", async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await goto(page, "/admin/parents/messages/compose");
    await expect(page.locator("body")).toBeVisible();
    await expect(page).toHaveScreenshot("compose-message-mobile.png", {
      maxDiffPixelRatio: 0.05,
      fullPage: true,
    });
  });

  test("compose chat page — form layout on tablet", async ({ page }) => {
    await page.setViewportSize(viewports.tabletPortrait);
    await goto(page, "/admin/parents/chat/compose");
    await expect(page.locator("body")).toBeVisible();
    await expect(page).toHaveScreenshot("compose-chat-tablet-portrait.png", {
      maxDiffPixelRatio: 0.05,
      fullPage: true,
    });
  });
});
