import { test, expect, type Page } from "@playwright/test";
import { type BoxNode } from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import { siteFromRoot, emptyPageRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
const { auditDoc } = require("../../scripts/uat/page-audit.js") as { auditDoc: (o: object) => { warn: string[] } };

/**
 * THE PAGE AUDIT'S WHITESPACE CHECKS — S-2 (2) and (3) (box-builder-spacing.feature, "The sweep's audit measures both").
 * The audit is the sweep's critic, so it is tested like code (docs/RISKS.md R5): it must say NOTHING about a page at its
 * defaults, and it must flag each way the space can be taken away. Pages go through the shipping export.
 */
const auditOf = async (page: Page, blocks: BoxNode[], width: number) => {
  const root = emptyPageRoot(); root.children = blocks; // the app's own page root — the test helper `createRoot` has a 600px floor no page has
  const site = siteFromRoot(root);
  await page.setViewportSize({ width, height: 900 });
  await page.setContent(renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }), { waitUntil: "domcontentloaded" });
  return (await page.evaluate(`(${auditDoc.toString()})({})`) as { warn: string[] }).warn.filter((w) => w.startsWith("W7"));
};
const text = (patch: Partial<BoxNode> = {}) => blockForKind("text", { text: "Words that must never touch an edge.", ...patch } as Partial<BoxNode>);
const section = (patch: Partial<BoxNode>, kids: BoxNode[]) => blockForKind("container", { ...patch, children: kids } as Partial<BoxNode>);

for (const width of [375, 768, 1280, 1920]) {
  test.describe(`at ${width}`, () => {
    test("a page at its defaults: nothing to report", async ({ page }) => {
      expect(await auditOf(page, [
        blockForKind("heading"), text(),
        section({ background: "var(--eu-color-primary-50)" }, [text()]), section({ background: "var(--eu-color-surface)" }, [text()]),
        blockForKind("card"), blockForKind("button"), blockForKind("stat"), blockForKind("alert"),
      ], width)).toEqual([]);
    });

    test("a section with its gutter set to 0: words closer than 1rem to the page edge (W7a)", async ({ page }) => {
      const found = await auditOf(page, [section({ padding: 0 }, [text()])], width);
      expect(found.join("\n")).toMatch(/^W7a \d+ runs of words closer than 1rem to the page edge/m);
    });

    test("a coloured box with its inner spacing set to 0: words touching its edge (W7a)", async ({ page }) => {
      const found = await auditOf(page, [section({}, [section({ background: "var(--eu-color-primary-50)", padding: 0 }, [text()])])], width);
      expect(found.join("\n")).toMatch(/^W7a \d+ runs of words touching the edge of their coloured box/m);
    });

    test("two sections with their space set to 0: words closer than 1rem (W7b)", async ({ page }) => {
      const tight = { paddingTop: 0, paddingBottom: 0 };
      // Two blocks straight on the page, each a section of it.
      const found = await auditOf(page, [text(tight), text(tight)], width);
      expect(found.join("\n")).toMatch(/^W7b 1 sections whose words are closer than 1rem/m);
    });
  });
}
