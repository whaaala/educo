import { test, expect, type Page } from "@playwright/test";
import { seedSite } from "./helpers/seed-site";
import type { BoxNode } from "@/lib/box-model";

/**
 * A COLOURED BAND YOU LEFT EMPTY IS THE SAME SIZE IN THE EDITOR AND ON THE PAGE.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * Reported with screenshots: a band added at the top of a page, given a colour and left empty, showed in the
 * builder and was missing from the preview. It was not missing. It was a THIRD of its size — and against a
 * tall row of cells directly underneath, a third is indistinguishable from gone. Measured, editor → page:
 *
 *     a band with a background, empty                 128px → 40px
 *     a band with a background, holding an empty box  128px → 40px
 *     a band with a background, holding an empty grid 128px → 40px
 *
 * Both halves are asserted TOGETHER, in one run, because the defect only exists in the difference: each side
 * was internally consistent and neither number is wrong on its own. A guard that measured only the exported
 * page would have to be told what to expect, and whoever wrote it would have written 40.
 */

const band = (extra: Record<string, unknown>): BoxNode =>
  ({ id: "topband", type: "container", direction: "column", width: "100%", padding: 0, gap: 0, ...extra } as unknown as BoxNode);

const pageWith = (top: BoxNode) => ({
  homeId: "p1",
  pages: [{ id: "p1", name: "Home", path: "/", root: {
    id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
      top,
      { id: "under", type: "container", direction: "column", width: "100%", minHeight: 200, background: "#22b8cf", padding: 0, gap: 0 },
    ],
  } }],
});

/** The band's height in the builder, and then in the preview — which renders the REAL exported page. */
async function bothSides(page: Page, top: BoxNode) {
  await seedSite(page, pageWith(top));
  await page.waitForSelector('[data-box-id="topband"]', { timeout: 30000 });
  await page.waitForTimeout(400);
  const editor = await page.evaluate(() => Math.round(document.querySelector('[data-box-id="topband"]')!.getBoundingClientRect().height));
  await page.click('button:has-text("Preview")');
  await page.waitForSelector('iframe[title="Site preview"]', { timeout: 15000 });
  await page.waitForTimeout(900);
  const published = await page.evaluate(() => {
    const d = (document.querySelector('iframe[title="Site preview"]') as HTMLIFrameElement).contentDocument!;
    const el = d.querySelector(".bx-topband");
    return el ? Math.round(el.getBoundingClientRect().height) : -1;
  });
  return { editor, published };
}

test.describe("an empty coloured band is not lost on the way to the page", () => {
  // Every way of being empty that the builder can actually produce: nothing at all, a box you added and have
  // not filled yet, and a grid you added and have not filled yet. "Empty" is about what APPEARS, never about
  // whether the children array happens to have something in it — which is what the first version checked.
  const EMPTY: [name: string, kids: BoxNode[]][] = [
    ["nothing at all", []],
    ["an empty box", [{ id: "k1", type: "container", direction: "column", width: "100%", padding: 0, gap: 0, children: [] } as unknown as BoxNode]],
    ["an empty grid", [{ id: "k2", type: "container", direction: "row", layout: "grid", columns: 3, width: "100%", padding: 0, gap: 0, children: [] } as unknown as BoxNode]],
    ["an empty box inside an empty box", [{ id: "k3", type: "container", direction: "column", width: "100%", padding: 0, gap: 0,
      children: [{ id: "k4", type: "container", direction: "column", width: "100%", padding: 0, gap: 0, children: [] }] } as unknown as BoxNode]],
  ];

  for (const [name, kids] of EMPTY) {
    test(`a coloured band holding ${name} is the size the builder showed`, async ({ page }) => {
      const { editor, published } = await bothSides(page, band({ background: "#f4a460", children: kids }));
      expect(published, `the builder showed ${editor}px and the page rendered ${published}px`).toBeGreaterThan(editor - 8);
      expect(published, "and it is a band you can see, not a sliver").toBeGreaterThanOrEqual(120);
    });
  }

  test("a height you set yourself still wins — the floor never overrides you", async ({ page }) => {
    // The floor exists so an empty band is visible, not so the builder can argue about its size.
    const { editor, published } = await bothSides(page, band({ background: "#f4a460", minHeight: 24, children: [] }));
    expect(editor, "the builder honours it").toBeLessThan(40);
    expect(published, "and so does the page").toBeLessThan(40);
  });

  test("a band with real content in it takes its height from the content, not the floor", async ({ page }) => {
    // The other direction, which a careless floor would break: 8rem must not be forced onto a band that has
    // something in it, or every text band on every page would suddenly be 128px tall.
    const { published } = await bothSides(page, band({ background: "#f4a460",
      children: [{ id: "t", type: "text", text: "Welcome", width: "100%" } as unknown as BoxNode] }));
    expect(published, "a line of text does not make a 128px band").toBeLessThan(90);
    expect(published, "but it is still on the page").toBeGreaterThan(8);
  });
});
