import { test, expect } from "@playwright/test";
import type { BoxNode } from "@/lib/box-model";
import { normalizeSite, siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { PRESETS_FLAT } from "@/lib/preview-devices";

/**
 * EVERY SCREEN IN THE CATALOGUE, not a sample of it.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * Asked for directly: "get all the screen sizes… all of the different models… and make sure everything
 * works in all of the models, all of the sizes." A catalogue of sixty devices in a menu is a promise, and
 * the only way to keep it is to walk the list — so this ENUMERATES `PRESETS_FLAT`, the very list the person
 * chooses from, exactly as the corner-radius guard enumerates the component catalogue. A device added to
 * that file is covered here the day it appears, with nothing to remember.
 *
 * What is asserted is the thing that actually breaks: the page never scrolls SIDEWAYS. A layout that
 * overflows horizontally is the one responsive failure a visitor cannot work around — they cannot see the
 * right-hand edge of a page on a phone, and on a 320px screen that is most of it.
 */

/** A real 4:3 PNG (4×3 px, scaled by the layout), so the browser has a genuine picture to decode. */
const PNG_4x3 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAAHElEQVQI12P8//8/AzbAxIAHDGnJ/1gBIyPjMAAA//8DAIzBBRq3ZQ1cAAAAAElFTkSuQmCC";

const blk = (id: string, h: number, bg: string, extra: Record<string, unknown> = {}, children: BoxNode[] = []) =>
  ({ id, type: "container", direction: "column", width: "100%", padding: 0, gap: 0, minHeight: h, background: bg, children, ...extra } as unknown as BoxNode);

/** A page with the shapes that break first: a twelve-column row, a wide block, a floated card, text. */
const testPage = (): BoxNode => ({
  id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: [
    blk("nav", 64, "#0d3b1e", { pin: "top", hold: "fixed" }, [
      { id: "brand", type: "heading", text: "Fairfield Primary School", width: "auto", color: "#ffffff" } as unknown as BoxNode,
    ]),
    blk("hero", 320, "#8c0f52", {}, [
      { id: "h1", type: "heading", text: "Welcome to our school", width: "100%", color: "#ffffff" } as unknown as BoxNode,
    ]),
    {
      id: "cards", type: "container", layout: "grid", columns: 12, width: "100%", padding: 0, gap: 0, background: "#f8fafc",
      children: [
        blk("c1", 160, "#e0f2fe", { colSpan: 4 }),
        blk("c2", 160, "#fce7f3", { colSpan: 4 }),
        blk("c3", 160, "#dcfce7", { colSpan: 4 }),
      ],
    } as unknown as BoxNode,
    /**
     * A ROW PLACED BY HAND — every cell given a `colStart` AND a `rowStart`, which is what the "Grid cell"
     * panel writes. The `cards` row above uses spans only, and spans alone re-fit correctly at every rung:
     * it passed this suite the whole time three hand-placed cells were being drawn on top of one another at
     * any width below 900px. A catalogue of sixty screens proves nothing about a shape it does not contain.
     */
    {
      id: "placed", type: "container", layout: "grid", columns: 12, width: "100%", padding: 0, gap: 0, background: "#fef3c7",
      children: [
        blk("p1", 80, "#d4a017", { colSpan: 4, colStart: 1, rowStart: 1 }),
        blk("p2", 80, "#d417c4", { colSpan: 4, colStart: 5, rowStart: 1 }),
        blk("p3", 80, "#0f8c8c", { colSpan: 4, colStart: 9, rowStart: 1 }),
      ],
    } as unknown as BoxNode,
    /**
     * BODY COPY, because the first version of this fixture had only headings — and headings carry their own
     * `clamp()` off the type scale, so they were never the ones that shrank. The block text did.
     */
    blk("copy", 120, "#ffffff", {}, [
      { id: "body", type: "text", text: "Term starts on the fourth of September. Please collect the reading list from the school office before the end of the week.", width: "100%" } as unknown as BoxNode,
    ]),
    /**
     * A PHOTOGRAPH, for the same reason as the body copy: media has to hold its proportions on every screen.
     *
     * `imgW`/`imgH` are set because a real picture always has them — the builder measures every upload and
     * every pasted URL. The first version of this fixture left them out, which is not a state a user can
     * reach, and it therefore tested the unknown-shape PLACEHOLDER (a deliberate 260px letterbox) instead of
     * the behaviour being asserted.
     */
    blk("shot", 0, "#ffffff", {}, [
      { id: "photo", type: "image", src: PNG_4x3, imgW: 4, imgH: 3, alt: "The school hall", width: "100%" } as unknown as BoxNode,
    ]),
    blk("free", 120, "#b45309", { position: "absolute", left: 60, top: 20, width: "40%" }),
    /**
     * A BLOCK WIDER THAN A PHONE, deliberately. The first version of this fixture held only full-width and
     * twelve-column blocks — nothing that could overflow — so removing the export's `max-width: 100%` on
     * purpose changed nothing and the guard passed. A test of "does it fit" needs something that does not.
     */
    blk("wide", 90, "#7c3aed", { width: "900px" }),
    blk("foot", 140, "#1f2937"),
  ],
} as unknown as BoxNode);

test.describe("the page holds up on every screen in the catalogue", () => {
  test("no screen makes the page scroll sideways, and nothing spills past the edge", async ({ page }) => {
    test.slow(); // sixty viewports in one page — still a single load, but it is not a quick test
    const site = normalizeSite(siteFromRoot(testPage()), 0);
    const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
    await page.route("**/__every_screen", (r) => r.fulfill({ contentType: "text/html", body: html }));
    await page.goto("/__every_screen");
    await page.waitForTimeout(300);

    const failures: string[] = [];
    const textSizes: { w: number; px: number; label: string }[] = [];
    const photoWidths: { w: number; px: number; label: string }[] = [];
    for (const d of PRESETS_FLAT) {
      // Capped at what a test browser will accept; the catalogue goes up to a 32:9 super-ultrawide.
      await page.setViewportSize({ width: Math.min(d.w, 3840), height: Math.min(d.h, 2160) });
      await page.waitForTimeout(60);
      const r = await page.evaluate(() => {
        const doc = document.documentElement;
        const widest = [...document.querySelectorAll<HTMLElement>("[class*='bx-']")]
          .map((el) => Math.round(el.getBoundingClientRect().right))
          .reduce((a, b) => Math.max(a, b), 0);
        /**
         * …AND NOTHING IS HIDDEN UNDERNEATH A SIBLING. Overflow is the failure a visitor can SEE; this is the
         * one they cannot — a block drawn under another looks exactly like a block that was never added, which
         * is how it was reported ("the yellow and the other two stacks just disappear"). Only the hand-placed
         * row is checked, because overlap is what free placement is FOR everywhere else on the page.
         */
        const cells = ["p1", "p2", "p3"].map((id) => ({ id, el: document.querySelector<HTMLElement>(`.bx-${id}`) }));
        const covered: string[] = [];
        for (let a = 0; a < cells.length; a++) {
          const x = cells[a].el?.getBoundingClientRect();
          if (!x || x.width < 1 || x.height < 1) { covered.push(`${cells[a].id} is not on the page`); continue; }
          for (let b = a + 1; b < cells.length; b++) {
            const y = cells[b].el?.getBoundingClientRect();
            if (!y) continue;
            if (x.left < y.right - 0.5 && y.left < x.right - 0.5 && x.top < y.bottom - 0.5 && y.top < x.bottom - 0.5) {
              covered.push(`${cells[a].id} is hidden under ${cells[b].id}`);
            }
          }
        }
        /**
         * …AND A PAGE SHORTER THAN THE SCREEN ENDS IN ITS OWN COLOUR.
         *
         * Measured on an iPad Pro 11 before the fix: the content ended at 410px and 800 pixels of white
         * followed it, under a dark footer — two thirds of the screen, and it reads as a block nobody added.
         * The document now carries the colour of the band that ends the page, so the page simply finishes.
         * Nothing is stretched and nothing is inserted; this asserts the COLOUR, never a height.
         */
        const last = document.querySelector<HTMLElement>(".bx-foot");
        let edge = "";
        if (last) {
          const lr = last.getBoundingClientRect();
          const below = window.innerHeight - lr.bottom;
          if (below > 4) {
            const want = getComputedStyle(last).backgroundColor;
            const got = getComputedStyle(document.documentElement).backgroundColor;
            if (got !== want) edge = `${Math.round(below)}px below the page is ${got}, but the page ends in ${want}`;
          }
        }
        /**
         * …AND THE WORDS ARE STILL BIG ENOUGH TO READ.
         *
         * Reported as content "becoming smaller" as the preview narrows, and measured on the exported page:
         * body copy came out at 11.2px on every phone and on a Fold opened to 619px, 12.3px on a tablet, and
         * only reached 16px past 1024px. The cause was the reading size being the SPACING unit times 1.6 —
         * and a spacing unit is supposed to close up on a narrow screen. Text is not.
         *
         * A floor rather than a fixed size, because fluid was never the problem: this is checked together
         * with the growth assertion below, so holding the bottom cannot be traded for a page whose type never
         * responds at all.
         */
        const bodyEl = document.querySelector<HTMLElement>(".bx-body p") ?? document.querySelector<HTMLElement>(".bx-body");
        const textPx = bodyEl ? Math.round(parseFloat(getComputedStyle(bodyEl).fontSize) * 100) / 100 : null;
        /**
         * …AND THE PICTURE KEEPS ITS PROPORTIONS. Flexible media is the third ingredient of the field guide,
         * and the failure it prevents is a photograph squashed out of shape or hanging off the right-hand
         * edge. A 4:3 picture is 4:3 on a 320px phone and on a 4K monitor; only its size changes.
         */
        const img = document.querySelector<HTMLImageElement>(".bx-photo img") ?? document.querySelector<HTMLImageElement>("img");
        const ir = img?.getBoundingClientRect();
        const photo = ir && ir.width > 0
          ? { w: Math.round(ir.width), h: Math.round(ir.height), right: Math.round(ir.right), ratio: Math.round((ir.width / ir.height) * 100) / 100 }
          : null;
        return { scrollW: doc.scrollWidth, clientW: doc.clientWidth, widest, innerW: window.innerWidth, covered, edge, textPx, photo };
      });
      if (r.scrollW > r.clientW + 1) failures.push(`${d.label}: scrolls sideways (${r.scrollW} > ${r.clientW})`);
      if (r.widest > r.innerW + 1) failures.push(`${d.label}: a block reaches ${r.widest} in a ${r.innerW}px screen`);
      for (const c of r.covered) failures.push(`${d.label}: ${c}`);
      if (r.edge) failures.push(`${d.label}: ${r.edge}`);
      if (r.textPx == null) failures.push(`${d.label}: the body text block is not on the page at all`);
      else {
        textSizes.push({ w: Math.min(d.w, 3840), px: r.textPx, label: d.label });
        if (r.textPx < 16) failures.push(`${d.label}: body text is ${r.textPx}px — too small to read`);
      }
      if (r.photo == null) failures.push(`${d.label}: the photograph is not on the page at all`);
      else {
        photoWidths.push({ w: Math.min(d.w, 3840), px: r.photo.w, label: d.label });
        if (Math.abs(r.photo.ratio - 4 / 3) > 0.02) failures.push(`${d.label}: the 4:3 photograph renders ${r.photo.ratio}:1 (${r.photo.w}×${r.photo.h})`);
        if (r.photo.right > r.innerW + 1) failures.push(`${d.label}: the photograph reaches ${r.photo.right} in a ${r.innerW}px screen`);
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);

    /**
     * AND IT STILL GROWS. The floor above is satisfiable by pinning the type to one size for ever, which
     * would trade one responsive failure for another — a phone-sized page on a 4K monitor. So the narrowest
     * screen in the catalogue and the widest must not agree.
     */
    const narrow = textSizes.reduce((a, b) => (b.w < a.w ? b : a));
    const wide = textSizes.reduce((a, b) => (b.w > a.w ? b : a));
    expect(wide.px, `type is frozen: ${narrow.label} (${narrow.w}px) and ${wide.label} (${wide.w}px) both render ${wide.px}px`)
      .toBeGreaterThan(narrow.px);

    // The picture has to flex too — a fixed-width photo passes the ratio check and still ruins the page.
    const pNarrow = photoWidths.reduce((a, b) => (b.w < a.w ? b : a));
    const pWide = photoWidths.reduce((a, b) => (b.w > a.w ? b : a));
    expect(pWide.px, `the photograph does not flex: ${pNarrow.label} and ${pWide.label} both render it ${pWide.px}px wide`)
      .toBeGreaterThan(pNarrow.px);
  });

  test("the list itself is real — every entry has a name and a believable size", async () => {
    // A catalogue is only as good as its numbers: a typo here would claim a layout was checked on a screen
    // that does not exist. The bounds are the narrowest phone in use and the widest desktop sold.
    for (const d of PRESETS_FLAT) {
      expect(d.label, `${d.id} has no name`).toBeTruthy();
      expect(d.w, `${d.label} is ${d.w}px wide`).toBeGreaterThanOrEqual(320);
      expect(d.w, `${d.label} is ${d.w}px wide`).toBeLessThanOrEqual(5120);
      // 568 is the iPhone 5 / SE (1st gen), the shortest screen anyone still browses on.
      expect(d.h, `${d.label} is ${d.h}px tall`).toBeGreaterThanOrEqual(568);
    }
    expect(new Set(PRESETS_FLAT.map((d) => d.id)).size, "two devices share an id").toBe(PRESETS_FLAT.length);
    expect(PRESETS_FLAT.length, "the catalogue covers phones, foldables, tablets, laptops and monitors").toBeGreaterThan(40);
  });
});
