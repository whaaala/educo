import { test, expect, type Page } from "@playwright/test";
import { type BoxNode, createContainer } from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import { siteFromRoot, emptyPageRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { measureSpace, CHECK_WIDTHS, type SpaceKind } from "@/lib/space-check";

/**
 * LE-1 (S-3): THE PAGE CHECK'S MEASURED SPACE — `measureSpace` on the shipping export, at every width the check uses.
 * The same shapes `page-audit-whitespace.spec.ts` holds the sweep's audit to, plus a column too narrow for its words.
 * It must say NOTHING about a spaced page, and name the right block for each way the space is taken away.
 * The UI half (built through the builder, read in the dialog) is `scripts/uat/uat-le1-headed.js`.
 */
const spaced = { padding: 24 };
const kindsOf = async (page: Page, blocks: BoxNode[], width: number) => {
  const root = emptyPageRoot(); root.children = blocks;
  const site = siteFromRoot(root);
  await page.setViewportSize({ width, height: 900 });
  await page.setContent(renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true }), { waitUntil: "domcontentloaded" });
  return (await page.evaluate(`(${measureSpace.toString()})(document)`)) as { id: string; kind: SpaceKind }[];
};
const text = (patch: Partial<BoxNode> = {}) => blockForKind("text", { text: "Words that must never touch an edge.", ...patch } as Partial<BoxNode>);
const section = (patch: Partial<BoxNode>, kids: BoxNode[]) => blockForKind("container", { ...patch, children: kids } as Partial<BoxNode>);

for (const { px: width } of CHECK_WIDTHS) {
  test.describe(`at ${width}`, () => {
    test("a page with space everywhere: nothing", async ({ page }) => {
      const found = await kindsOf(page, [section(spaced, [text()]), section({ ...spaced, background: "var(--eu-color-primary-50)" }, [text()])], width);
      expect(found).toEqual([]);
    });

    test("words at the page edge are named (W7a)", async ({ page }) => {
      const s = section({ padding: 0 }, [text()]), id = s.children![0].id; // a section gives its blocks their own ids
      const found = await kindsOf(page, [s], width);
      expect(found).toContainEqual({ id, kind: "words-near-edge" });
    });

    test("words touching their coloured box are named (W7a)", async ({ page }) => {
      const s = section(spaced, [section({ background: "var(--eu-color-primary-50)", padding: 0 }, [text()])]), id = s.children![0].children![0].id;
      const found = await kindsOf(page, [s], width);
      expect(found).toContainEqual({ id, kind: "words-touch-box" });
    });

    test("two sections whose words touch are named (W7b)", async ({ page }) => {
      const tight = { paddingTop: 0, paddingBottom: 0, paddingLeft: 24, paddingRight: 24 };
      const a = text(tight);
      const found = await kindsOf(page, [a, text(tight)], width);
      expect(found).toContainEqual({ id: a.id, kind: "sections-close" });
    });
  });
}

// An untouched row or grid gives up columns rather than break a word (L-4 c-8) — so the case a person can make is a column count
// SET for phones by hand ("your setting wins", G3b-11): four across at 360 breaks "Extracurricular".
test("a column too narrow for its words is named at the narrowest phone, and not where it fits", async ({ page }) => {
  const long = text({ text: "Extracurricular" });
  const row = createContainer("row", { layout: "grid", columns: 4, responsive: { phone: { columns: 4 } }, padding: 24, children: [long, text({ text: "a b" }), text({ text: "c d" }), text({ text: "e f" })].map((k) => ({ ...k, colSpan: 1 })) });
  const narrow = await kindsOf(page, [row], CHECK_WIDTHS[0].px);
  expect(narrow.filter((h) => h.kind === "words-broken").map((h) => h.id)).toContain(long.id);
  const wide = await kindsOf(page, [row], CHECK_WIDTHS[CHECK_WIDTHS.length - 1].px);
  expect(wide.filter((h) => h.kind === "words-broken")).toEqual([]);
});
