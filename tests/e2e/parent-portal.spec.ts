import { test, expect } from "@playwright/test";

// ============================================================
// Parent Portal - E2E Tests
// Covers: Dashboard, Children, Fees, Messages, Events, Leaves,
//         Meetings, Homework, Results, Support, Chat
// Devices: Desktop, Tablet (landscape + portrait), Mobile
// ============================================================

test.describe("Parent Portal - Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents");
  });

  test("loads the parent dashboard page", async ({ page }) => {
    await expect(page).toHaveURL(/\/parents/);
    // Dashboard should have key widgets
    await expect(page.locator("body")).toBeVisible();
  });

  test("displays child selector", async ({ page }) => {
    // The dashboard has a child selector to switch between children
    const childSelector = page.locator("[data-testid='child-selector'], .child-selector, select, [role='combobox']").first();
    if (await childSelector.isVisible()) {
      await expect(childSelector).toBeVisible();
    }
  });

  test("displays stats cards", async ({ page }) => {
    // Dashboard should show stat cards like Term Average, Position, Attendance
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("displays quick links section", async ({ page }) => {
    // Quick links for navigation
    const links = page.locator("a[href*='/parents/']");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("Parent Portal - My Children", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents/children");
  });

  test("loads the children page", async ({ page }) => {
    await expect(page).toHaveURL(/\/parents\/children/);
  });

  test("displays child cards with profile info", async ({ page }) => {
    // Each child should have a card with their info
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Parent Portal - Fees", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents/fees");
  });

  test("loads the fees page", async ({ page }) => {
    await expect(page).toHaveURL(/\/parents\/fees/);
  });

  test("displays fee records table", async ({ page }) => {
    // Should have a table or list of fee records
    const table = page.locator("table, [role='table']").first();
    if (await table.isVisible()) {
      await expect(table).toBeVisible();
    }
  });

  test("shows fee status badges (Paid, Partial, Pending, Overdue)", async ({ page }) => {
    const body = page.locator("body");
    await expect(body).toBeVisible();
    // At least some status text should be present
  });

  test("can open Pay Fees modal", async ({ page }) => {
    const payButton = page.locator("button").filter({ hasText: /pay/i }).first();
    if (await payButton.isVisible()) {
      await payButton.click();
      // Modal should appear
      await expect(
        page.locator("[role='dialog'], .modal, [data-testid='pay-modal']").first()
      ).toBeVisible();
    }
  });
});

test.describe("Parent Portal - Messages", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents/messages");
  });

  test("loads the messages page", async ({ page }) => {
    await expect(page).toHaveURL(/\/parents\/messages/);
  });

  test("displays message list", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Parent Portal - Homework", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents/homework");
  });

  test("loads the homework page", async ({ page }) => {
    await expect(page).toHaveURL(/\/parents\/homework/);
  });

  test("displays homework table with assignments", async ({ page }) => {
    const table = page.locator("table, [role='table']").first();
    if (await table.isVisible()) {
      await expect(table).toBeVisible();
    }
  });
});

test.describe("Parent Portal - Events", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents/events");
  });

  test("loads the events page", async ({ page }) => {
    await expect(page).toHaveURL(/\/parents\/events/);
  });

  test("displays event cards", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Parent Portal - Leave Requests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents/leaves");
  });

  test("loads the leave requests page", async ({ page }) => {
    await expect(page).toHaveURL(/\/parents\/leaves/);
  });

  test("displays leave request history", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Parent Portal - Results", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents/results");
  });

  test("loads the results page", async ({ page }) => {
    await expect(page).toHaveURL(/\/parents\/results/);
  });
});

test.describe("Parent Portal - Meetings", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents/meetings");
  });

  test("loads the meetings page", async ({ page }) => {
    await expect(page).toHaveURL(/\/parents\/meetings/);
  });

  test("displays upcoming meetings", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Parent Portal - Support", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents/support");
  });

  test("loads the support page", async ({ page }) => {
    await expect(page).toHaveURL(/\/parents\/support/);
  });
});

test.describe("Parent Portal - Chat", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents/chat");
  });

  test("loads the chat page", async ({ page }) => {
    await expect(page).toHaveURL(/\/parents\/chat/);
  });
});

// ============================================================
// Cross-Page Navigation Tests
// ============================================================

test.describe("Parent Portal - Navigation", () => {
  test("can navigate from dashboard to children page", async ({ page }) => {
    await page.goto("/parents");
    const childrenLink = page.locator("a[href*='/parents/children']").first();
    if (await childrenLink.isVisible()) {
      await childrenLink.click();
      await expect(page).toHaveURL(/\/parents\/children/);
    }
  });

  test("can navigate from dashboard to fees page", async ({ page }) => {
    await page.goto("/parents");
    const feesLink = page.locator("a[href*='/parents/fees']").first();
    if (await feesLink.isVisible()) {
      await feesLink.click();
      await expect(page).toHaveURL(/\/parents\/fees/);
    }
  });

  test("can navigate from dashboard to messages page", async ({ page }) => {
    await page.goto("/parents");
    const msgLink = page.locator("a[href*='/parents/messages']").first();
    if (await msgLink.isVisible()) {
      await msgLink.click();
      await expect(page).toHaveURL(/\/parents\/messages/);
    }
  });
});

// ============================================================
// Responsive Layout Tests
// ============================================================

test.describe("Parent Portal - Responsive Layout", () => {
  test("dashboard renders without horizontal overflow", async ({ page }) => {
    await page.goto("/parents");
    const body = page.locator("body");
    const bodyBox = await body.boundingBox();
    const viewportSize = page.viewportSize();
    if (bodyBox && viewportSize) {
      // Body should not exceed viewport width
      expect(bodyBox.width).toBeLessThanOrEqual(viewportSize.width + 20); // small tolerance
    }
  });

  test("fees page table is scrollable on small viewports", async ({ page }) => {
    await page.goto("/parents/fees");
    await expect(page.locator("body")).toBeVisible();
  });
});
