import { test, expect, type Page } from "@playwright/test";
import { type BoxNode } from "@/lib/box-model";
import { ALL_COMPONENTS } from "@/lib/component-catalogue";
import { blockForKind } from "@/lib/box-presets";
import { siteFromRoot } from "@/lib/box-site";
import { renderSiteHTML } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * EXPORT LAYOUT INVARIANTS — the same geometric guarantees as component-layout-invariants.spec.ts, but on the
 * page a VISITOR actually gets, and at phone and tablet widths.
 *
 * Why a second harness. The canvas harness runs on the desktop project only, because the builder canvas is not
 * usable at a phone frame — an editor with panels, rulers and drag handles is a desktop tool. That is a fair
 * reason to skip narrow viewports THERE, but it left the responsive guarantees unchecked at exactly the widths
 * they exist for. The exported page has no such excuse: it is a plain zero-JS document, so it can be rendered
 * straight into the browser with `setContent` and measured at any width.
 *
 * This file is therefore the one that can prove the things the canvas cannot:
 *   • no horizontal overflow at 375px — the classic responsive failure, invisible to any unit test;
 *   • the MOBILE-FIRST cascade really is mobile-first (base = phone, wider screens add), rather than merely
 *     containing the right `@media` strings, which is all a string assertion can tell you; and
 *   • a floated item rejoins the normal stack below the `sm` rung instead of hanging off the page.
 *
 * It is deliberately indifferent to HOW the CSS achieves any of it.
 */

// Derived, never re-typed: a component added to ALL_COMPONENTS is covered here automatically.
const COMPONENTS = ALL_COMPONENTS;

/** The three frames the project targets (CLAUDE.md): phone, tablet, desktop. */
const VIEWPORTS = [
  { label: "phone 375", width: 375, height: 812 },
  { label: "tablet 768", width: 768, height: 1024 },
  { label: "desktop 1280", width: 1280, height: 800 },
] as const;

const MIN_READABLE_PX = 9; // MIN_CONTENT_SCALE (0.6) of a 16px root, less a rounding allowance
const SM_PX = 40 * 16; // the `sm` rung (40em) where free placement starts applying

type Geometry = {
  docScrollW: number; docClientW: number; overflowX: number; overflowY: number; pieces: number;
  boxW: number; boxH: number; boxLeft: number; boxRight: number; boxBottom: number;
  compW: number; compH: number; compRight: number; compBottom: number;
  sectionLeft: number; sectionRight: number;
  fontPx: number;
};

/** Render a node through the real exporter and load the result as a standalone page. */
async function renderExport(page: Page, node: BoxNode, viewport: { width: number; height: number }) {
  const root: BoxNode = {
    id: "root", type: "container", direction: "column",
    children: [{ id: "band", type: "container", direction: "row", rowBand: true, width: "fill", children: [node] }],
  } as BoxNode;
  const html = renderSiteHTML(siteFromRoot(root), DEFAULT_THEME);
  await page.setViewportSize(viewport);
  // `domcontentloaded`, not `load`: the export links Google Fonts and this suite must not depend on the
  // network. Fallback faces are enough — nothing here measures a glyph, only box geometry and font-size.
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#tgt", { timeout: 10_000 });
}

async function measure(page: Page): Promise<Geometry> {
  return page.evaluate(() => {
    const box = document.querySelector("#tgt") as HTMLElement;
    // A TREE component has no `.eu-*` element — it is containers and elements — so `comp` falls back to the
    // box and the comp-vs-box checks would compare the box with itself. Overflow and a child count are what
    // actually mean something for both shapes, so they are measured here and asserted for every component.
    const comp = (box.querySelector('[class*="eu-"]') ?? box) as HTMLElement;
    const section = (box.closest("section") ?? document.body) as HTMLElement;
    const b = box.getBoundingClientRect(), c = comp.getBoundingClientRect(), s = section.getBoundingClientRect();
    const text = (box.querySelector("[class*='__title'], [class*='__value'], [class*='__text'], [class*='__body']") ?? comp) as HTMLElement;
    const de = document.documentElement;
    return {
      docScrollW: de.scrollWidth, docClientW: de.clientWidth,
      overflowX: box.scrollWidth - box.clientWidth, overflowY: box.scrollHeight - box.clientHeight,
      pieces: box.querySelectorAll("*").length,
      boxW: b.width, boxH: b.height, boxLeft: b.left, boxRight: b.right, boxBottom: b.bottom,
      compW: c.width, compH: c.height, compRight: c.right, compBottom: c.bottom,
      sectionLeft: s.left, sectionRight: s.right,
      fontPx: parseFloat(getComputedStyle(text).fontSize),
    };
  });
}

/** One place, so every component, state and viewport is judged identically. */
function assertInvariants(g: Geometry, where: string) {
  // 1. THE responsive failure: a page the reader has to scroll sideways to read. Unit tests cannot see this.
  expect(g.docScrollW - g.docClientW, `${where}: the page must not scroll horizontally`).toBeLessThanOrEqual(1);

  // 2. Content never spills out of its own box (RULE O).
  expect(g.compRight - g.boxRight, `${where}: content must not spill past its box`).toBeLessThanOrEqual(2);
  expect(g.compBottom - g.boxBottom, `${where}: content must not spill below its box`).toBeLessThanOrEqual(2);

  // 3. The block stays inside the page band (RULE H).
  expect(g.sectionLeft - g.boxLeft, `${where}: must not escape the page on the left`).toBeLessThanOrEqual(2);
  expect(g.boxRight - g.sectionRight, `${where}: must not escape the page on the right`).toBeLessThanOrEqual(2);

  // 4. Text never shrinks below the readable floor (RULE O).
  expect(g.fontPx, `${where}: text must stay readable`).toBeGreaterThanOrEqual(MIN_READABLE_PX);

  // 5. Content stays inside its own box — the check that actually bites for a TREE component, where there is
  //    no single `.eu-*` element to compare against.
  expect(g.overflowX, `${where}: content must not overflow its box horizontally`).toBeLessThanOrEqual(1);
  expect(g.overflowY, `${where}: content must not overflow its box vertically`).toBeLessThanOrEqual(1);

  // 6. It actually rendered something — a component that silently produced an empty box would otherwise pass
  //    every geometric check above.
  expect(g.pieces, `${where}: the component must render its pieces`).toBeGreaterThan(0);

  // 7. Nothing collapses to nothing.
  expect(g.boxW, `${where}: box must have a real width`).toBeGreaterThan(8);
  expect(g.boxH, `${where}: box must have a real height`).toBeGreaterThan(8);
}

test.describe("Export layout invariants", () => {
  for (const component of COMPONENTS) {
    // THE REAL INSERTION PATH. This used to hand-write `{type:"component", component}`, which the palette
    // never creates for Card/Quote/Stat/Badge/Rating — they are inserted as editable TREES. So five of the
    // seven components were being measured on a code path no user ever reaches, and the guarantees this file
    // claims to enforce did not actually cover them. `blockForKind` is what the palette click and the drag
    // both call, so building through it is the only way these invariants mean what they say.
    const base = {
      ...blockForKind(component),
      id: "tgt", anchor: "tgt",
      ...(component === "alert" ? { alertSeverity: "info", alertForm: "inline" } : {}),
      ...(component === "alert" || component === "accordion"
        ? { items: [{ id: "i1", title: "Heads up", body: "This is a message — say something useful here." }] }
        : {}),
    } as unknown as BoxNode;

    const STATES: [string, Record<string, unknown>][] = [
      ["natural", {}],
      ["full width", { width: "fill" }],
      ["fit width", { width: "auto" }],
      ["tall", { width: "fill", height: "18.75rem" }],
      ["narrow", { width: "18%" }],
    ];

    for (const [label, patch] of STATES) {
      for (const vp of VIEWPORTS) {
        test(`${component}: ${label} @ ${vp.label}`, async ({ page }) => {
          await renderExport(page, { ...base, ...patch } as BoxNode, vp);
          assertInvariants(await measure(page), `${component} / ${label} / ${vp.label}`);
        });
      }
    }
  }

  /**
   * MOBILE-FIRST, proven by behaviour rather than by grepping the stylesheet for "min-width".
   *
   * The export used to emit a DESKTOP base that narrow screens undid with `@media (max-width:...)`. Inverting it
   * is only meaningful if the phone actually gets the stacked layout, so this asks the browser at each width.
   */
  test("a floated item is in the normal stack on a phone and placed from the sm rung up", async ({ page }) => {
    // The ACCORDION, not the alert: the alert is a single message (user decision, 2026-09-05) and is no longer a
    // list, so an "item float" on it has nothing to select. The accordion is the multi-item component.
    const node = {
      id: "tgt", type: "component", component: "accordion", anchor: "tgt", width: "fill",
      items: [
        { id: "i1", title: "Floated", body: "Placed freely", float: { x: 6, y: 2, z: 1 } },
        { id: "i2", title: "Stacked", body: "Normal flow" },
      ],
    } as unknown as BoxNode;

    for (const vp of VIEWPORTS) {
      await renderExport(page, node, vp);
      const seen = await page.evaluate(() => {
        const item = document.querySelector(".eu-accordion__item") as HTMLElement | null;
        if (!item) return null;
        const de = document.documentElement;
        return {
          position: getComputedStyle(item).position,
          overflowPx: de.scrollWidth - de.clientWidth,
          right: item.getBoundingClientRect().right,
          docW: de.clientWidth,
        };
      });
      // Asserted, never skipped: an earlier draft of this test quietly passed at every width because its
      // selector matched nothing, which is worse than no test at all.
      expect(seen, `${vp.label}: the floated item must be present to be judged`).not.toBeNull();
      const placed = vp.width >= SM_PX;
      expect(seen!.position, `${vp.label}: ${placed ? "placement applies" : "the stack is the base"}`).toBe(
        placed ? "absolute" : "static",
      );
      // Whichever branch applies, the item must stay on the page — the failure this rule exists to prevent.
      expect(seen!.overflowPx, `${vp.label}: a floated item must never push the page sideways`).toBeLessThanOrEqual(1);
      expect(seen!.right - seen!.docW, `${vp.label}: a floated item must stay within the page`).toBeLessThanOrEqual(2);
    }
  });

  /**
   * The per-device cascade: a value set for one device must win at that device's width and nowhere else. This is
   * what "the base rule is the phone layout" buys, and the only honest way to check it is to read back the
   * computed value at each width.
   */
  test("per-device overrides land at the width they were made for", async ({ page }) => {
    // A container, not a component: a background belongs to the BOX, which is also where the per-device
    // overrides are stored and where the exporter emits the cascading rules.
    const node = {
      id: "tgt", type: "container", direction: "column", anchor: "tgt", width: "fill", minHeight: 80,
      background: "#ff0000",
      responsive: { tablet: { background: "#00ff00" }, mobile: { background: "#0000ff" } },
      children: [],
    } as unknown as BoxNode;

    const want: Record<string, string> = {
      "phone 375": "rgb(0, 0, 255)",
      "tablet 768": "rgb(0, 255, 0)",
      "desktop 1280": "rgb(255, 0, 0)",
    };
    for (const vp of VIEWPORTS) {
      await renderExport(page, node, vp);
      const bg = await page.evaluate(() => getComputedStyle(document.querySelector("#tgt") as HTMLElement).backgroundColor);
      expect(bg, `${vp.label}: the override for this device must win here`).toBe(want[vp.label]);
    }
  });
});
