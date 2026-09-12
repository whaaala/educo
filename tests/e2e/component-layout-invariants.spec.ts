import { test, expect, type Page } from "@playwright/test";
import { ALL_COMPONENTS } from "@/lib/component-catalogue";
import { blockForKind } from "@/lib/box-presets";

/**
 * LAYOUT INVARIANTS — the guard that catches the class of regression the sizing work kept producing.
 *
 * Every sizing bug in this area came from the same three gaps:
 *   1. a change was verified only in the case it was made for, and quietly broke a neighbouring guarantee;
 *   2. the unit tests asserted MECHANISMS (`height:100%`, `left:6rem`), so changing the mechanism just meant
 *      updating the assertion — the guard never actually guarded anything; and
 *   3. nothing exercised COMBINATIONS, yet every conflict lived in a pair of operations (set a height, then
 *      change the width; float an item, then resize the block).
 *
 * So this file asserts GEOMETRIC GUARANTEES — facts about the rendered box, which jsdom cannot see — across a
 * matrix of states and, crucially, across pairs of operations. It is deliberately indifferent to HOW the CSS
 * achieves them: flex, percentages or anything else may change freely, and these must keep passing.
 *
 * If you add a component, add it to COMPONENTS. If you add a sizing feature, add a STATE — not a new mechanism
 * assertion somewhere else.
 */

// Derived, never re-typed: a component added to ALL_COMPONENTS is covered here automatically.
const COMPONENTS = ALL_COMPONENTS;

/** The five things that must be true of a component's box, whatever the CSS behind them. */
type Geometry = {
  boxW: number; boxH: number; compW: number; compH: number; overflowX: number; overflowY: number; pieces: number;
  pageLeft: number; pageRight: number; pageTop: number;
  boxLeft: number; boxRight: number; boxTop: number; boxBottom: number;
  compBottom: number; compRight: number;
  fontPx: number;
};

const MIN_READABLE_PX = 9; // MIN_CONTENT_SCALE (0.6) of a 16px root, less a rounding allowance

/**
 * Wait for the target box to exist AND to have rendered its content. A TREE component (Card/Quote/Stat/Badge/
 * Rating) has no `.eu-root` — that element only exists for `component` nodes — so the old wait hung for five
 * of the seven. One helper, so the two places that reload cannot drift apart again.
 */
async function waitForRendered(page: Page) {
  await page.waitForSelector('[data-box-id="tgt"]', { timeout: 15000 });
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-box-id="tgt"]');
    return !!el && el.querySelectorAll("*").length > 0;
  }, undefined, { timeout: 15000 });
}

async function seed(page: Page, node: Record<string, unknown>) {
  await page.evaluate((n) => {
    const rid = () => "b" + Math.random().toString(36).slice(2, 9);
    const site = {
      pages: [{ id: "p1", name: "Home", path: "/", root: { id: "root", type: "container", direction: "column", children: [
        { id: rid(), type: "container", direction: "row", rowBand: true, width: "fill", children: [n] },
      ] } }],
      homeId: "p1",
    };
    localStorage.setItem("educo_box_site_v1", JSON.stringify(site));
    localStorage.setItem("educo_box_site_cleaned_v1", "1");
  }, node);
  await page.reload();
  await waitForRendered(page);
  await page.waitForTimeout(250); // let fonts/icons settle so measurements are stable
}

async function measure(page: Page): Promise<Geometry> {
  return page.evaluate(() => {
    const box = document.querySelector('[data-box-id="tgt"]') as HTMLElement;
    // A TREE component (Card/Quote/Stat/Badge/Rating) has no `.eu-*` element, so fall back to the box and
    // rely on the overflow + piece-count checks below, which are meaningful for both shapes.
    const comp = (box.querySelector('[class*="eu-"]:not(.eu-root)') ?? box) as HTMLElement;
    const pageEl = document.querySelectorAll("[data-box-id]")[0] as HTMLElement;
    const b = box.getBoundingClientRect(), c = comp.getBoundingClientRect(), p = pageEl.getBoundingClientRect();
    const text = (box.querySelector("[class*='__title'], [class*='__value'], [class*='__text']") ?? comp) as HTMLElement;
    return {
      boxW: b.width, boxH: b.height, compW: c.width, compH: c.height,
      overflowX: box.scrollWidth - box.clientWidth, overflowY: box.scrollHeight - box.clientHeight,
      pieces: box.querySelectorAll("*").length,
      pageLeft: p.left, pageRight: p.right, pageTop: p.top,
      boxLeft: b.left, boxRight: b.right, boxTop: b.top, boxBottom: b.bottom,
      compBottom: c.bottom, compRight: c.right,
      fontPx: parseFloat(getComputedStyle(text).fontSize),
    };
  });
}

/** The invariants themselves — one place, so every state and every component is judged identically. */
function assertInvariants(g: Geometry, where: string) {
  // 1. The component FILLS its box — no empty gap the user did not ask for (RULE G).
  expect(Math.abs(g.compH - g.boxH), `${where}: component should fill the box height`).toBeLessThanOrEqual(2);

  // 2. Content NEVER spills out of the box (RULE O) — the bottom edge above the component is the bug we hit.
  expect(g.compBottom - g.boxBottom, `${where}: content must not spill below the box`).toBeLessThanOrEqual(2);
  expect(g.compRight - g.boxRight, `${where}: content must not spill past the box`).toBeLessThanOrEqual(2);

  // 3. Nothing escapes the page, in any direction (RULE H).
  expect(g.pageLeft - g.boxLeft, `${where}: must not escape the page on the left`).toBeLessThanOrEqual(2);
  expect(g.boxRight - g.pageRight, `${where}: must not escape the page on the right`).toBeLessThanOrEqual(2);
  expect(g.pageTop - g.boxTop, `${where}: must not escape the page at the top`).toBeLessThanOrEqual(2);

  // 4. Text never shrinks below the readable floor (RULE O).
  expect(g.fontPx, `${where}: text must stay readable`).toBeGreaterThanOrEqual(MIN_READABLE_PX);

  // 5. Content stays inside its own box, and the component actually rendered — both meaningful for a TREE
  //    component, where there is no single `.eu-*` element to compare the box against.
  expect(g.overflowX, `${where}: content must not overflow its box horizontally`).toBeLessThanOrEqual(1);
  expect(g.pieces, `${where}: the component must render its pieces`).toBeGreaterThan(0);

  // 6. Nothing collapses to nothing.
  expect(g.boxW, `${where}: box must have a real width`).toBeGreaterThan(8);
  expect(g.boxH, `${where}: box must have a real height`).toBeGreaterThan(8);
}

// Each case reloads a heavy dev page, so run them one at a time: in parallel the dev server simply cannot
// serve 60+ reloads at once and every case times out, which looks like a failure but tells you nothing.
test.describe.configure({ mode: "serial" });
test.setTimeout(60_000);

test.describe("Component layout invariants", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/website/box-demo");
    await page.evaluate(() => {
      ["educo_box_site_v1", "educo_box_demo_v9", "educo_box_site_cleaned_v1"].forEach((k) => localStorage.removeItem(k));
    });
  });

  for (const component of COMPONENTS) {
    // THE REAL INSERTION PATH. This used to hand-write `{type:"component", component}`, which the palette
    // never creates for Card/Quote/Stat/Badge/Rating — they are inserted as editable TREES. So five of the
    // seven components were being measured on a code path no user ever reaches, and the guarantees this file
    // claims to enforce did not actually cover them. `blockForKind` is what the palette click and the drag
    // both call, so building through it is the only way these invariants mean what they say.
    const base = {
      ...blockForKind(component),
      id: "tgt",
      ...(component === "alert" ? { alertSeverity: "info", alertForm: "inline" } : {}),
      ...(component === "alert" || component === "accordion"
        ? { items: [{ id: "i1", title: "Heads up", body: "This is a message — say something useful here." }] }
        : {}),
    } as Record<string, unknown>;

    // Single states: each on its own must satisfy every invariant.
    const STATES: [string, Record<string, unknown>][] = [
      ["natural", {}],
      ["full width", { width: "fill" }],
      ["fit width", { width: "auto" }],
      ["tall", { width: "fill", height: "300px" }],
      ["shorter than content", { width: "fill", height: "48px", contentScale: 0.6 }],
      ["narrow", { width: "18%" }],
      ["narrow + short", { width: "18%", height: "50px", contentScale: 0.6 }],
    ];

    for (const [label, patch] of STATES) {
      test(`${component}: ${label}`, async ({ page }) => {
        await seed(page, { ...base, ...patch });
        assertInvariants(await measure(page), `${component} / ${label}`);
      });
    }

    // THE COMBINATION that produced every regression: a height set at one width, then the width changed.
    // The box must grow to keep containing its content rather than cropping or letting it spill.
    test(`${component}: height set, then width narrowed (the regression pair)`, async ({ page }) => {
      await seed(page, { ...base, width: "fill", height: "90px" });
      const wide = await measure(page);
      assertInvariants(wide, `${component} / height set while wide`);

      await page.evaluate(() => {
        const raw = JSON.parse(localStorage.getItem("educo_box_site_v1")!);
        const walk = (n: { id: string; children?: unknown[] }): Record<string, unknown> | null =>
          n.id === "tgt" ? (n as Record<string, unknown>)
            : ((n.children ?? []) as { id: string; children?: unknown[] }[]).reduce<Record<string, unknown> | null>((a, c) => a || walk(c), null);
        walk(raw.pages[0].root)!.width = "30%";
        localStorage.setItem("educo_box_site_v1", JSON.stringify(raw));
      });
      await page.reload();
      await waitForRendered(page);
      await page.waitForTimeout(250);
      assertInvariants(await measure(page), `${component} / then narrowed`);
    });
  }

  // A floated item is positioned freely, and must still obey the same containment rules (RULE N).
  for (const component of ["alert", "accordion"] as const) {
    for (const [label, x, y] of [["near", 4, 2], ["far", 60, 10], ["absurd", 500, 200]] as const) {
      test(`${component}: floated item — ${label}`, async ({ page }) => {
        await seed(page, {
          id: "tgt", type: "component", component, width: "fill",
          ...(component === "alert" ? { alertSeverity: "info", alertForm: "inline" } : {}),
          items: [
            { id: "i1", title: "Floated", body: "Placed freely", float: { x, y, z: 1 } },
            { id: "i2", title: "Stacked", body: "Normal flow" },
          ],
        });
        const inside = await page.evaluate(() => {
          const boxSel = document.querySelector(".eu-alert-stack, .eu-accordion") as HTMLElement;
          const item = document.querySelector("[data-eu-item]") as HTMLElement;
          const b = boxSel.getBoundingClientRect(), i = item.getBoundingClientRect();
          return { overRight: i.right - b.right, overLeft: b.left - i.left, width: i.width };
        });
        expect(inside.overRight, `${component}/${label}: floated item must stay inside its component`).toBeLessThanOrEqual(2);
        expect(inside.overLeft, `${component}/${label}: floated item must stay inside its component`).toBeLessThanOrEqual(2);
        expect(inside.width, `${component}/${label}: floated item must not collapse`).toBeGreaterThan(40);
      });
    }
  }

  /**
   * DESIGN TOKENS reach the design-system TREES, not just `.eu-root` components.
   *
   * The tokens are injected scoped to a selector, and only COMPONENT wrappers carry `.eu-root`. The trees
   * (Card, Quote, Stat, Badge, Rating) are ordinary containers that paint themselves with `var(--eu-color-*)`,
   * so a Tinted card measured `rgba(0,0,0,0)` on the canvas while the EXPORT rendered it correctly — the export
   * emits its tokens at `:root`. Canvas = export was quietly broken for every tree preset using a ramp colour.
   *
   * Only a browser can see this: to a unit test the stored node still says `background: var(--eu-color-primary-50)`
   * and looks perfectly correct.
   */
  test("a ramp token painted on a design-system tree actually resolves on the canvas", async ({ page }) => {
    await page.goto("/website/box-demo");
    await seed(page, {
      id: "tgt", type: "container", preset: "card", direction: "column", width: "100%",
      padding: 24, gap: 12, radius: 16, borderWidth: 0,
      background: "var(--eu-color-primary-50)",
      children: [{ id: "h", type: "heading", text: "Card title", fontSize: 22, bold: true, color: "var(--eu-color-text)" }],
    });
    const seen = await page.evaluate(() => {
      const el = document.querySelector('[data-box-id="tgt"]') as HTMLElement;
      const cs = getComputedStyle(el);
      return { token: cs.getPropertyValue("--eu-color-primary-50").trim(), background: cs.backgroundColor };
    });
    expect(seen.token, "the colour ramp must be defined where the tree can see it").not.toBe("");
    expect(seen.background, "a tinted tree must not render transparent").not.toBe("rgba(0, 0, 0, 0)");
  });

  /**
   * CONTAINER QUERIES fire against the COMPONENT's own width, not the page's.
   *
   * This is a geometric guarantee like the rest, and it needs a real browser: an element cannot query its own
   * `container-type`, so `.eu-alert{container-type:inline-size}` + `@container{.eu-alert{...}}` compiled fine,
   * shipped, and silently measured the PAGE. A 205px alert stayed `nowrap` while every unit test passed. The
   * only proof is asking the browser what a narrow component actually computed.
   */
  test("a narrow component responds to ITS OWN width, not the page's", async ({ page }) => {
    await page.goto("/website/box-demo");
    // Same page, same viewport — only the component is narrow. If the query measured the page (which is wide),
    // both of these would come back `nowrap` and the responsive rule would be dead.
    await seed(page, { id: "tgt", type: "component", component: "alert", width: "18rem",
      alertSeverity: "info", alertForm: "inline", items: [{ id: "i1", title: "Heads up", body: "This is an alert" }] });
    const narrow = await page.evaluate(() => {
      const a = document.querySelector(".eu-alert") as HTMLElement;
      return { wrap: getComputedStyle(a).flexWrap, width: a.getBoundingClientRect().width };
    });
    expect(narrow.width, "the alert really is narrower than the 22rem breakpoint").toBeLessThan(22 * 16);
    expect(narrow.wrap, "a narrow component must apply its own container-query rule").toBe("wrap");

    await seed(page, { id: "tgt", type: "component", component: "alert", width: "fill",
      alertSeverity: "info", alertForm: "inline", items: [{ id: "i1", title: "Heads up", body: "This is an alert" }] });
    const wide = await page.evaluate(() => {
      const a = document.querySelector(".eu-alert") as HTMLElement;
      return { wrap: getComputedStyle(a).flexWrap, width: a.getBoundingClientRect().width };
    });
    // Asserted against the MEASURED width rather than a hardcoded "nowrap": in a narrow frame a full-width
    // alert is itself under 22rem and correctly wraps. The invariant is that the rule tracks the COMPONENT's
    // width — so this stays true if this harness is ever run at another viewport.
    expect(wide.wrap, "the rule must follow the component's own width, whatever the viewport").toBe(
      wide.width < 22 * 16 ? "wrap" : "nowrap",
    );
    expect(wide.width, "a full-width alert is wider than a 20% one").toBeGreaterThan(narrow.width);
  });

  test("a hug-to-content component still sizes to its text (containment must stay off there)", async ({ page }) => {
    // The trade-off recorded in blockContainmentCss: intrinsic width and inline-size containment cannot coexist.
    // If containment ever leaks onto a hug block, this collapses to roughly its padding.
    await page.goto("/website/box-demo");
    await seed(page, { id: "tgt", type: "component", component: "alert", width: "auto",
      alertSeverity: "info", alertForm: "inline", items: [{ id: "i1", title: "Heads up", body: "This is an alert message" }] });
    const w = await page.evaluate(() => (document.querySelector(".eu-alert") as HTMLElement).getBoundingClientRect().width);
    expect(w, "a hug block must be as wide as its content, not its padding").toBeGreaterThan(160);
  });
});
