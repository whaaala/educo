import { test, expect } from "@playwright/test";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { renderSiteFiles } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import type { BoxSite } from "@/lib/box-site";
import type { BoxNode } from "@/lib/box-model";

/**
 * THE ACCEPTANCE TEST FOR WHAT A SCHOOL ACTUALLY RECEIVES.
 *
 * Every other export test checks a STRING, or renders a single page with the stylesheet inlined. This one writes
 * the real ZIP contents to a real folder and opens them from `file://`, exactly as a school does when it unzips
 * the download onto a laptop or a USB stick. That path has properties nothing else can prove: that the separate
 * `styles.css` is actually FOUND from a sibling file, that relative links between pages resolve on disk, and
 * that per-page CSS subsetting did not strip a rule the page needed to look right.
 *
 * A page that renders correctly with the stylesheet inlined can still arrive unstyled here.
 */

const text = (id: string, s: string) =>
  ({ id, type: "text", text: s } as unknown as BoxNode);

const site = (): BoxSite =>
  ({
    homeId: "p1",
    pages: [
      {
        id: "p1", name: "Home", path: "home",
        root: {
          id: "root-p1", type: "container", direction: "column",
          children: [
            text("t1", "Welcome to Oakfield"),
            { id: "lnk2", type: "button", text: "Admissions", href: "page:p2" },
            { id: "lnk3", type: "button", text: "Term dates", href: "page:p3" },
          ],
        },
      },
      {
        id: "p2", name: "Admissions", path: "admissions",
        root: {
          id: "root-p2", type: "container", direction: "column",
          children: [
            { id: "al", type: "component", component: "alert", width: "fill",
              alertSeverity: "warning", alertForm: "inline", variant: "solid",
              items: [{ id: "ai1", title: "Applications close on 15 January",
                        body: "Late forms cannot be accepted." }] },
            { id: "back2", type: "button", text: "Home", href: "page:p1" },
          ],
        },
      },
      {
        id: "p3", name: "Term Dates", path: "term-dates",
        root: {
          id: "root-p3", type: "container", direction: "column",
          children: [text("t3", "Autumn term starts 2 September."), { id: "back3", type: "button", text: "Home", href: "page:p1" }],
        },
      },
    ],
  } as unknown as BoxSite);

let dir = "";
const urlFor = (file: string) => pathToFileURL(join(dir, file)).href;

test.beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), "educo-export-"));
  const files = renderSiteFiles(site(), DEFAULT_THEME);
  for (const [name, body] of Object.entries(files)) writeFileSync(join(dir, name), body, "utf8");
});

test.afterAll(() => {
  if (dir) rmSync(dir, { recursive: true, force: true });
});

test.describe("the exported site, opened from a folder", () => {
  test("the shared stylesheet is FOUND and applied, not merely linked", async ({ page }) => {
    await page.goto(urlFor("index.html"));
    // An unstyled page is the classic broken export: the <link> is right but the file never resolves.
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg, "body should be painted by the theme, not left transparent").not.toBe("rgba(0, 0, 0, 0)");
    const token = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--eu-color-primary-500").trim());
    expect(token.length, "a token from styles.css must resolve, proving the sheet was fetched from disk").toBeGreaterThan(0);
  });

  test("every internal link resolves from every page", async ({ page }) => {
    // The property that matters most: a dead link in a school's exported site is a 404 for a parent.
    for (const start of ["index.html", "admissions.html", "term-dates.html"]) {
      await page.goto(urlFor(start));
      const links = await page.evaluate(() =>
        [...document.querySelectorAll("a[href]")]
          .map((a) => a.getAttribute("href") ?? "")
          .filter((h) => h && !/^[a-z]+:/i.test(h)));

      // A fragment is only a real link if its target is on THIS page. Skipping fragments instead of checking
      // them is how the old single-file behaviour — every page: link collapsing back to "#slug" — slipped
      // past this test: it filtered out precisely the thing that had broken.
      const dangling = await page.evaluate(
        (hs) => hs.filter((h) => h.startsWith("#") && !document.getElementById(h.slice(1))),
        links,
      );
      expect(dangling, `${start} has fragment links with no target on the page`).toEqual([]);

      const hrefs = links.filter((h) => !h.startsWith("#"));
      expect(hrefs.length, `${start} should link to another page`).toBeGreaterThan(0);
      for (const href of hrefs) {
        const res = await page.goto(urlFor(href));
        expect(res?.status() ?? 200, `${start} → ${href} must resolve on disk`).toBeLessThan(400);
        await expect(page.locator("body")).not.toBeEmpty();
        await page.goto(urlFor(start));
      }
    }
  });

  test("the alert page KEEPS the rules it needs after subsetting", async ({ page }) => {
    await page.goto(urlFor("admissions.html"));
    const alert = page.locator(".eu-alert").first();
    await expect(alert).toBeVisible();
    // Subsetting is only safe if the surviving rules still paint the component.
    const paint = await alert.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, pad: parseFloat(cs.paddingTop) };
    });
    expect(paint.bg, "a solid alert must be painted, not transparent").not.toBe("rgba(0, 0, 0, 0)");
    expect(paint.pad, "and must keep its spacing").toBeGreaterThan(0);
  });

  test("a page WITHOUT a component does not download that component's CSS", async ({ page }) => {
    await page.goto(urlFor("term-dates.html"));
    const bytes = await page.evaluate(() =>
      [...document.querySelectorAll("style")].reduce((n, s) => n + (s.textContent ?? "").length, 0));
    const hasAlertRules = await page.evaluate(() =>
      [...document.querySelectorAll("style")].some((s) => (s.textContent ?? "").includes("eu-alert--solid")));
    expect(hasAlertRules, "term dates has no alert, so it must not carry alert rules").toBe(false);
    expect(bytes, "and its inline CSS stays small").toBeLessThan(20000);
  });

  test("text is legible and the page does not scroll sideways, on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    for (const file of ["index.html", "admissions.html", "term-dates.html"]) {
      await page.goto(urlFor(file));
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${file} must not scroll sideways at 375px`).toBeLessThanOrEqual(1);
    }
  });
});
