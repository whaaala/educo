import { test, expect } from "@playwright/test";
import { seedSite } from "./helpers/seed-site";

/**
 * PREVIEW, after the multi-page rewrite — and after the injected nav was taken out.
 *
 * The question this answers: can a user still see, and walk, every page of their site? Yes, by two routes,
 * and the split between them is the point. Preview shows the REAL exported page, one at a time.
 *
 * What changed: the builder used to PREPEND a `<nav class="eu-site-nav">` to every rendered page, and this
 * spec used to click it. That bar was the builder's furniture, not the user's design — unstylable,
 * unmovable, unremovable, and on a one-page site it rendered as a lone bold "Home" above the canvas that
 * read as a stray heading nobody had typed. So:
 *
 *   · INSIDE the page there is only what the user designed. If they want a header, they build one, and a
 *     block whose destination is `page:<id>` navigates exactly as the old bar did.
 *   · AROUND the page, the preview's own toolbar carries a tab per page. Chrome belongs there.
 *
 * Only a browser can judge either one: the links point at files a srcdoc iframe cannot navigate to, so the
 * click interception either works or the preview is a dead end.
 */
test.describe("Multi-page preview", () => {
  test.beforeEach(async ({ page }) => {
    const rid = () => "b" + Math.random().toString(36).slice(2, 9);
    /** A page with a heading — and, on the home page, a header the USER built out of `page:` links. */
    const mk = (id: string, name: string, path: string, text: string, links: [string, string][] = []) => ({
      id, name, path,
      root: { id: `root-${id}`, type: "container", direction: "column", children: [
        { id: rid(), type: "container", direction: "row", rowBand: true, width: "fill", children: [
          { id: rid(), type: "heading", text, fontSize: 28, bold: true },
          ...links.map(([label, target]) => ({ id: rid(), type: "button", text: label, href: `page:${target}` })),
        ] },
      ] },
    });
    await seedSite(page, { homeId: "p1", pages: [
      mk("p1", "Home", "home", "Welcome to our school", [["Admissions", "p2"], ["Term Dates", "p3"]]),
      mk("p2", "Admissions", "admissions", "How to apply", [["Home", "p1"]]),
      mk("p3", "Term Dates", "term-dates", "When we are open", [["Home", "p1"]]),
    ] });
    await page.waitForSelector("[data-box-id]", { timeout: 20000 });
    await page.getByRole("button", { name: /preview/i }).first().click();
    await page.waitForTimeout(1500);
  });

  test("preview shows ONE real page, not every page stacked together", async ({ page }) => {
    const frame = page.frameLocator('iframe[title="Site preview"]');
    await expect(frame.locator("h1, h2, h3, div").filter({ hasText: "Welcome to our school" }).first()).toBeVisible();
    // The old preview put every page in one document. If Admissions is here, we regressed.
    await expect(frame.locator("body")).not.toContainText("How to apply");
  });

  test("NOTHING is injected above the page — it is what the user designed", async ({ page }) => {
    const frame = page.frameLocator('iframe[title="Site preview"]');
    await expect(frame.locator(".eu-site-nav"), "the builder's old bar is gone").toHaveCount(0);
    // And the first thing in the document is the user's own band, not chrome in front of it.
    const firstText = await frame.locator("body *").first().textContent();
    expect(firstText ?? "", "the page opens on the user's content").toContain("Welcome to our school");
  });

  test("a header the USER built walks through every page", async ({ page }) => {
    const frame = page.frameLocator('iframe[title="Site preview"]');
    // `page:` destinations are resolved to the real filenames that ship — exactly what a visitor clicks.
    await expect(frame.locator('a[href="admissions.html"]')).toBeVisible();

    /**
     * THE CONTROLS ARE PUT AWAY FIRST, because this site's own header sits exactly where they do.
     *
     * The preview bar floats OVER the page — it has to, or the page would be handed a shorter viewport than
     * the visitor's and "one screen tall" would mean something different here than on the published site.
     * The cost is that the top ~48px of the page is behind it, and a nav a user built at the top of their
     * own header is in that strip. Playwright reports it as "subtree intercepts pointer events"; a person
     * sees their own menu not responding to a click.
     *
     * So the bar is dismissed the way a person dismisses it. This test used to pass without doing anything,
     * because the bar hid ITSELF after a couple of seconds — which is the behaviour that made the controls
     * unreachable in six other guards. Depending on it here was the same bug wearing a different hat.
     */
    await page.getByRole("button", { name: "Hide the preview controls" }).click();
    await expect(page.getByRole("button", { name: "Show the preview controls" })).toBeVisible();

    await frame.locator('a[href="admissions.html"]').click();
    await page.waitForTimeout(1200);
    await expect(frame.locator("body")).toContainText("How to apply");

    await frame.locator('a[href="index.html"]').click();
    await page.waitForTimeout(1200);
    await expect(frame.locator("body")).toContainText("Welcome to our school");

    await frame.locator('a[href="term-dates.html"]').click();
    await page.waitForTimeout(1200);
    await expect(frame.locator("body"), "and on to the third page").toContainText("When we are open");
  });

  test("the preview's OWN toolbar walks the pages too, without touching the design", async ({ page }) => {
    /**
     * The route that does not depend on the user having built a header yet — which is every site on the day
     * it is started. Chrome around the page, never inside it.
     */
    const frame = page.frameLocator('iframe[title="Site preview"]');
    const tabs = page.locator('nav[aria-label="Pages"]');

    await tabs.getByRole("button", { name: "Term Dates" }).click();
    await page.waitForTimeout(1000);
    await expect(frame.locator("body")).toContainText("When we are open");
    await expect(frame.locator(".eu-site-nav"), "still nothing injected into the page").toHaveCount(0);

    await tabs.getByRole("button", { name: /^Home/ }).click();
    await page.waitForTimeout(1000);
    await expect(frame.locator("body")).toContainText("Welcome to our school");
  });

  test("the page renders styled — the shared stylesheet reaches the iframe", async ({ page }) => {
    // The export LINKS styles.css; a srcdoc iframe has no such file, so preview inlines it. If that inlining
    // ever broke, the preview would render as unstyled HTML while the export looked fine. Asserted on the
    // user's own button, which used to be asserted on the injected nav — the one element that is now gone.
    const frame = page.frameLocator('iframe[title="Site preview"]');
    const styled = await frame.locator('a[href="admissions.html"]').evaluate((n) => {
      const c = getComputedStyle(n);
      return { display: c.display, bg: c.backgroundColor, radius: c.borderRadius };
    });
    expect(styled.display, "laid out, not a bare inline link").toBe("flex");
    expect(styled.bg, "and painted from the theme").not.toBe("rgba(0, 0, 0, 0)");
    expect(styled.radius, "with the button's own rounding applied").not.toBe("0px");
  });
});
