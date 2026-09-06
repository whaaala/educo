import { test, expect } from "@playwright/test";

/**
 * PREVIEW, after the multi-page rewrite.
 *
 * The question this answers: can a user still see every page of their site? Yes — but the mechanism changed,
 * and the new one is more faithful. Preview used to show one long document of every page stacked as sections;
 * now it shows the REAL exported page, one at a time, and the site's own nav walks between them.
 *
 * Only a browser can judge this: the nav links point at files a srcdoc iframe cannot navigate to, so the
 * click interception either works or the preview is a dead end.
 */
test.describe("Multi-page preview", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/website/box-demo");
    await page.evaluate(() => {
      const rid = () => "b" + Math.random().toString(36).slice(2, 9);
      const mk = (id: string, name: string, path: string, text: string) => ({
        id, name, path,
        root: { id: `root-${id}`, type: "container", direction: "column", children: [
          { id: rid(), type: "container", direction: "row", rowBand: true, width: "fill", children: [
            { id: rid(), type: "heading", text, fontSize: 28, bold: true },
          ] },
        ] },
      });
      const site = { homeId: "p1", pages: [
        mk("p1", "Home", "home", "Welcome to our school"),
        mk("p2", "Admissions", "admissions", "How to apply"),
        mk("p3", "Term Dates", "term-dates", "When we are open"),
      ] };
      localStorage.setItem("educo_box_site_v1", JSON.stringify(site));
      localStorage.setItem("educo_box_site_cleaned_v1", "1");
    });
    await page.reload();
    await page.waitForSelector('[data-box-id]', { timeout: 20000 });
    await page.getByRole("button", { name: /preview/i }).first().click();
    await page.waitForTimeout(1500);
  });

  test("preview shows ONE real page, not every page stacked together", async ({ page }) => {
    const frame = page.frameLocator('iframe[title="Site preview"]');
    await expect(frame.locator("h1, h2, h3, div").filter({ hasText: "Welcome to our school" }).first()).toBeVisible();
    // The old preview put every page in one document. If Admissions is here, we regressed.
    await expect(frame.locator("body")).not.toContainText("How to apply");
  });

  test("the site's OWN nav walks through every page", async ({ page }) => {
    const frame = page.frameLocator('iframe[title="Site preview"]');
    // the nav carries real filenames — exactly what ships
    await expect(frame.locator('.eu-site-nav a[href="admissions.html"]')).toBeVisible();

    await frame.locator('.eu-site-nav a[href="admissions.html"]').click();
    await page.waitForTimeout(1200);
    await expect(frame.locator("body")).toContainText("How to apply");

    await frame.locator('.eu-site-nav a[href="term-dates.html"]').click();
    await page.waitForTimeout(1200);
    await expect(frame.locator("body")).toContainText("When we are open");

    await frame.locator('.eu-site-nav a[href="index.html"]').click();
    await page.waitForTimeout(1200);
    await expect(frame.locator("body"), "and back home again").toContainText("Welcome to our school");
  });

  test("the current page is marked for a screen reader, and it follows you", async ({ page }) => {
    const frame = page.frameLocator('iframe[title="Site preview"]');
    await expect(frame.locator('.eu-site-nav a[aria-current="page"]')).toHaveAttribute("href", "index.html");
    await frame.locator('.eu-site-nav a[href="term-dates.html"]').click();
    await page.waitForTimeout(1200);
    await expect(frame.locator('.eu-site-nav a[aria-current="page"]')).toHaveAttribute("href", "term-dates.html");
  });

  test("the page renders styled — the shared stylesheet reaches the iframe", async ({ page }) => {
    // The export LINKS styles.css; a srcdoc iframe has no such file, so preview inlines it. If that inlining
    // ever broke, the preview would render as unstyled HTML while the export looked fine.
    const frame = page.frameLocator('iframe[title="Site preview"]');
    const nav = frame.locator(".eu-site-nav");
    const styled = await nav.evaluate((n) => {
      const c = getComputedStyle(n);
      return { display: c.display, position: c.position, bg: c.backgroundColor };
    });
    expect(styled.display, "the nav is laid out, not a bare list").toBe("flex");
    expect(styled.position).toBe("sticky");
    expect(styled.bg, "and painted from the theme").not.toBe("rgba(0, 0, 0, 0)");
  });
});
