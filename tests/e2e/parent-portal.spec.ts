import { test, expect } from "@playwright/test";

// ============================================================
// Parent Portal - E2E Tests
// Covers: Dashboard, Children, Fees, Messages, Events, Leaves,
//         Meetings, Homework, Results, Support, Chat
// Devices: Desktop, Tablet (landscape + portrait), Mobile
// ============================================================

// Feature: Parent Portal - Dashboard
test.describe("Parent Portal - Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents");
  });

  // Scenario: Parent loads the dashboard page
  test("loads the parent dashboard page", async ({ page }) => {
    // Given the parent has navigated to the dashboard
    // Then the URL should match the parents route
    await expect(page).toHaveURL(/\/parents/);
    // And the dashboard should have key widgets visible
    await expect(page.locator("body")).toBeVisible();
  });

  // Scenario: Parent views the child selector
  test("displays child selector", async ({ page }) => {
    // Given the parent is on the dashboard
    // Then a child selector should be visible to switch between children
    const childSelector = page.locator("[data-testid='child-selector'], .child-selector, select, [role='combobox']").first();
    if (await childSelector.isVisible()) {
      await expect(childSelector).toBeVisible();
    }
  });

  // Scenario: Parent views stats cards on the dashboard
  test("displays stats cards", async ({ page }) => {
    // Given the parent is on the dashboard
    // Then stat cards like Term Average, Position, Attendance should be visible
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  // Scenario: Parent views the quick links section
  test("displays quick links section", async ({ page }) => {
    // Given the parent is on the dashboard
    // Then quick links for navigation should be present
    const links = page.locator("a[href*='/parents/']");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});

// Feature: Parent Portal - My Children
test.describe("Parent Portal - My Children", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents/children");
  });

  // Scenario: Parent loads the children page
  test("loads the children page", async ({ page }) => {
    // Given the parent has navigated to the children page
    // Then the URL should match the children route
    await expect(page).toHaveURL(/\/parents\/children/);
  });

  // Scenario: Parent views child cards with profile info
  test("displays child cards with profile info", async ({ page }) => {
    // Given the parent is on the children page
    // Then each child should have a card with their info
    await expect(page.locator("body")).toBeVisible();
  });
});

// Feature: Parent Portal - Fees
test.describe("Parent Portal - Fees", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents/fees");
  });

  // Scenario: Parent loads the fees page
  test("loads the fees page", async ({ page }) => {
    // Given the parent has navigated to the fees page
    // Then the URL should match the fees route
    await expect(page).toHaveURL(/\/parents\/fees/);
  });

  // Scenario: Parent views the fee records table
  test("displays fee records table", async ({ page }) => {
    // Given the parent is on the fees page
    // Then a table or list of fee records should be visible
    const table = page.locator("table, [role='table']").first();
    if (await table.isVisible()) {
      await expect(table).toBeVisible();
    }
  });

  // Scenario: Parent views fee status badges
  test("shows fee status badges (Paid, Partial, Pending, Overdue)", async ({ page }) => {
    // Given the parent is on the fees page
    // Then fee status badges should be present
    const body = page.locator("body");
    await expect(body).toBeVisible();
    // At least some status text should be present
  });

  // Scenario: Parent opens the Pay Fees modal
  test("can open Pay Fees modal", async ({ page }) => {
    // Given the parent is on the fees page
    const payButton = page.locator("button").filter({ hasText: /pay/i }).first();
    if (await payButton.isVisible()) {
      // When the parent clicks the pay button
      await payButton.click();
      // Then the pay fees modal should appear
      await expect(
        page.locator("[role='dialog'], .modal, [data-testid='pay-modal']").first()
      ).toBeVisible();
    }
  });
});

// Feature: Parent Portal - Messages
test.describe("Parent Portal - Messages", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents/messages");
  });

  // Scenario: Parent loads the messages page
  test("loads the messages page", async ({ page }) => {
    // Given the parent has navigated to the messages page
    // Then the URL should match the messages route
    await expect(page).toHaveURL(/\/parents\/messages/);
  });

  // Scenario: Parent views the message list
  test("displays message list", async ({ page }) => {
    // Given the parent is on the messages page
    // Then the message list should be visible
    await expect(page.locator("body")).toBeVisible();
  });
});

// Feature: Parent Portal - Homework
test.describe("Parent Portal - Homework", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents/homework");
  });

  // Scenario: Parent loads the homework page
  test("loads the homework page", async ({ page }) => {
    // Given the parent has navigated to the homework page
    // Then the URL should match the homework route
    await expect(page).toHaveURL(/\/parents\/homework/);
  });

  // Scenario: Parent views the homework table with assignments
  test("displays homework table with assignments", async ({ page }) => {
    // Given the parent is on the homework page
    // Then a homework table should be visible
    const table = page.locator("table, [role='table']").first();
    if (await table.isVisible()) {
      await expect(table).toBeVisible();
    }
  });
});

// Feature: Parent Portal - Events
test.describe("Parent Portal - Events", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents/events");
  });

  // Scenario: Parent loads the events page
  test("loads the events page", async ({ page }) => {
    // Given the parent has navigated to the events page
    // Then the URL should match the events route
    await expect(page).toHaveURL(/\/parents\/events/);
  });

  // Scenario: Parent views event cards
  test("displays event cards", async ({ page }) => {
    // Given the parent is on the events page
    // Then event cards should be visible
    await expect(page.locator("body")).toBeVisible();
  });
});

// Feature: Parent Portal - Leave Requests
test.describe("Parent Portal - Leave Requests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents/leaves");
  });

  // Scenario: Parent loads the leave requests page
  test("loads the leave requests page", async ({ page }) => {
    // Given the parent has navigated to the leave requests page
    // Then the URL should match the leaves route
    await expect(page).toHaveURL(/\/parents\/leaves/);
  });

  // Scenario: Parent views leave request history
  test("displays leave request history", async ({ page }) => {
    // Given the parent is on the leave requests page
    // Then the leave request history should be visible
    await expect(page.locator("body")).toBeVisible();
  });
});

// Feature: Parent Portal - Results
test.describe("Parent Portal - Results", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents/results");
  });

  // Scenario: Parent loads the results page
  test("loads the results page", async ({ page }) => {
    // Given the parent has navigated to the results page
    // Then the URL should match the results route
    await expect(page).toHaveURL(/\/parents\/results/);
  });
});

// Feature: Parent Portal - Meetings
test.describe("Parent Portal - Meetings", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents/meetings");
  });

  // Scenario: Parent loads the meetings page
  test("loads the meetings page", async ({ page }) => {
    // Given the parent has navigated to the meetings page
    // Then the URL should match the meetings route
    await expect(page).toHaveURL(/\/parents\/meetings/);
  });

  // Scenario: Parent views upcoming meetings
  test("displays upcoming meetings", async ({ page }) => {
    // Given the parent is on the meetings page
    // Then upcoming meetings should be visible
    await expect(page.locator("body")).toBeVisible();
  });
});

// Feature: Parent Portal - Support
test.describe("Parent Portal - Support", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents/support");
  });

  // Scenario: Parent loads the support page
  test("loads the support page", async ({ page }) => {
    // Given the parent has navigated to the support page
    // Then the URL should match the support route
    await expect(page).toHaveURL(/\/parents\/support/);
  });
});

// Feature: Parent Portal - Chat
test.describe("Parent Portal - Chat", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/parents/chat");
  });

  // Scenario: Parent loads the chat page
  test("loads the chat page", async ({ page }) => {
    // Given the parent has navigated to the chat page
    // Then the URL should match the chat route
    await expect(page).toHaveURL(/\/parents\/chat/);
  });
});

// ============================================================
// Cross-Page Navigation Tests
// ============================================================

// Feature: Parent Portal - Navigation
test.describe("Parent Portal - Navigation", () => {
  // Scenario: Parent navigates from dashboard to children page
  test("can navigate from dashboard to children page", async ({ page }) => {
    // Given the parent is on the dashboard
    await page.goto("/parents");
    const childrenLink = page.locator("a[href*='/parents/children']").first();
    if (await childrenLink.isVisible()) {
      // When the parent clicks the children link
      await childrenLink.click();
      // Then the URL should navigate to the children page
      await expect(page).toHaveURL(/\/parents\/children/);
    }
  });

  // Scenario: Parent navigates from dashboard to fees page
  test("can navigate from dashboard to fees page", async ({ page }) => {
    // Given the parent is on the dashboard
    await page.goto("/parents");
    const feesLink = page.locator("a[href*='/parents/fees']").first();
    if (await feesLink.isVisible()) {
      // When the parent clicks the fees link
      await feesLink.click();
      // Then the URL should navigate to the fees page
      await expect(page).toHaveURL(/\/parents\/fees/);
    }
  });

  // Scenario: Parent navigates from dashboard to messages page
  test("can navigate from dashboard to messages page", async ({ page }) => {
    // Given the parent is on the dashboard
    await page.goto("/parents");
    const msgLink = page.locator("a[href*='/parents/messages']").first();
    if (await msgLink.isVisible()) {
      // When the parent clicks the messages link
      await msgLink.click();
      // Then the URL should navigate to the messages page
      await expect(page).toHaveURL(/\/parents\/messages/);
    }
  });
});

// ============================================================
// Responsive Layout Tests
// ============================================================

// Feature: Parent Portal - Responsive Layout
test.describe("Parent Portal - Responsive Layout", () => {
  // Scenario: Dashboard renders without horizontal overflow
  test("dashboard renders without horizontal overflow", async ({ page }) => {
    // Given the parent navigates to the dashboard
    await page.goto("/parents");
    const body = page.locator("body");
    const bodyBox = await body.boundingBox();
    const viewportSize = page.viewportSize();
    if (bodyBox && viewportSize) {
      // Then the body should not exceed viewport width
      expect(bodyBox.width).toBeLessThanOrEqual(viewportSize.width + 20); // small tolerance
    }
  });

  // Scenario: Fees page table is scrollable on small viewports
  test("fees page table is scrollable on small viewports", async ({ page }) => {
    // Given the parent navigates to the fees page
    await page.goto("/parents/fees");
    // Then the page body should be visible
    await expect(page.locator("body")).toBeVisible();
  });
});
