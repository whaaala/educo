import { test, expect, type Page } from "@playwright/test";
import { seedSite } from "./helpers/seed-site";
import type { BoxNode } from "@/lib/box-model";
import { normalizeSite, type BoxSite } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";

/**
 * THE ARRIVAL — what a pinned block BECOMES once the page has moved under it. Step 2b.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature.
 *
 * Measured by scrolling, never by reading the CSS: the whole reason pinning shipped inert is that its unit
 * tests asserted the declarations were present, and every one of those claims was true while nothing stuck.
 * So each arrival here is read off the COMPUTED STYLE of a real bar, at rest and again after the page has
 * moved — on the published page and on the canvas, which must agree.
 *
 * Seeded bare: the builder's own band pass shapes every tree, the same one the exporter runs.
 */

const bar = (extra: Record<string, unknown>) => ({
  id: "nav", type: "container", direction: "column", width: "100%", gap: 0,
  padding: 16, minHeight: 64, background: "#0d3b1e", pin: "top", children: [],
  ...extra,
} as unknown as BoxNode);
const page3000 = () => ({ id: "body1", type: "container", direction: "column", width: "100%", padding: 0, gap: 0, minHeight: 3000, background: "#4d8c0f", children: [] } as unknown as BoxNode);
const bare = (children: BoxNode[]) =>
  ({ id: "root", type: "container", direction: "column", padding: 0, gap: 0, children } as unknown as BoxNode);
const asSite = (root: BoxNode) => ({ homeId: "p1", pages: [{ id: "p1", name: "Home", path: "/", root }] });

type Look = { shadow: string; bg: string; backdrop: string; height: number; running: string[] };

/** Open the exported page and read the bar at rest, then again after the page has moved. */
async function arrivalInExport(page: Page, node: BoxNode, scrollTo = 300): Promise<{ rest: Look; moved: Look }> {
  const site = normalizeSite(asSite(bare([node, page3000()])) as unknown as BoxSite, 0);
  const html = renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
  const path = `/__arrive_${Math.random().toString(36).slice(2)}`;
  await page.route(`**${path}`, (r) => r.fulfill({ contentType: "text/html", body: html }));
  await page.goto(path);
  await page.waitForTimeout(350);
  return page.evaluate(async (to) => {
    const el = document.querySelector<HTMLElement>(".bx-nav")!;
    const read = () => {
      const s = getComputedStyle(el);
      return {
        shadow: s.boxShadow, bg: s.backgroundColor, backdrop: s.backdropFilter || (s as unknown as { webkitBackdropFilter?: string }).webkitBackdropFilter || "none",
        height: Math.round(el.getBoundingClientRect().height),
        running: el.getAnimations().map((a) => (a as unknown as { animationName?: string }).animationName ?? "?"),
      };
    };
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 250));
    const rest = read();
    window.scrollTo(0, to);
    await new Promise((r) => setTimeout(r, 350));
    return { rest, moved: read() };
  }, scrollTo);
}

/** The same bar on the CANVAS, scrolled in the editor's own scroller. */
async function arrivalOnCanvas(page: Page, node: BoxNode): Promise<{ rest: Look; moved: Look }> {
  await seedSite(page, asSite(bare([node, page3000()])));
  await page.waitForSelector('[data-box-id="nav"]', { state: "attached", timeout: 30000 });
  await page.waitForTimeout(800);
  return page.evaluate(async () => {
    const el = document.querySelector<HTMLElement>('[data-box-id="nav"]')!;
    let scroller: HTMLElement | null = el.parentElement;
    while (scroller && !(scroller.scrollHeight > scroller.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(scroller).overflowY))) {
      scroller = scroller.parentElement;
    }
    const read = () => {
      const s = getComputedStyle(el);
      return {
        shadow: s.boxShadow, bg: s.backgroundColor, backdrop: s.backdropFilter || "none",
        height: Math.round(el.getBoundingClientRect().height),
        running: el.getAnimations().map((a) => (a as unknown as { animationName?: string }).animationName ?? "?"),
      };
    };
    if (scroller) scroller.scrollTop = 0;
    await new Promise((r) => setTimeout(r, 250));
    const rest = read();
    if (scroller) scroller.scrollTop = 300;
    await new Promise((r) => setTimeout(r, 350));
    return { rest, moved: read() };
  });
}

/**
 * TWO WAYS A BROWSER SAYS "nothing here", both learnt from it rather than assumed.
 *
 * A box-shadow ANIMATED from `none` does not compute to `none`: it computes to a fully transparent, zero-size
 * shadow, because an animation needs a value to interpolate between. Reading the literal string would have
 * failed a feature that works.
 */
const flat = (shadow: string) => shadow === "none" || /^rgba\(0, 0, 0, 0\) 0px 0px 0px 0px/.test(shadow);
/**
 * How opaque a computed colour is — and it is NOT always `rgba(...)`.
 *
 * This project's colours are OKLCH tokens, so a browser hands back `oklab(0.31 -0.06 0.03 / 0.72)`. A parser
 * that only knew `rgba(...)` read that as fully opaque and failed a perfectly good frosted bar. Alpha lives
 * after the slash in the modern syntax, and is the fourth number in `rgba()`.
 */
const alpha = (colour: string) => {
  const slash = colour.match(/\/\s*([\d.]+%?)\s*\)/);
  if (slash) return slash[1].endsWith("%") ? Number(slash[1].slice(0, -1)) / 100 : Number(slash[1]);
  const parts = colour.match(/[\d.]+/g) ?? [];
  if (colour.startsWith("rgba") && parts.length === 4) return Number(parts[3]);
  return parts.length ? 1 : 0;
};

test.describe("an arrival changes the bar, and only once the page has moved", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("NOTHING is the default — a pinned bar with no arrival looks the same after scrolling", async ({ page }) => {
    const { rest, moved } = await arrivalInExport(page, bar({}));
    expect(moved.shadow).toBe(rest.shadow);
    expect(moved.bg).toBe(rest.bg);
    expect(moved.height).toBe(rest.height);
    expect(moved.running, "nothing animates that nobody asked for").toHaveLength(0);
  });

  test("SHADOW lifts it off the page", async ({ page }) => {
    const { rest, moved } = await arrivalInExport(page, bar({ pinArrival: "shadow" }));
    expect(flat(rest.shadow), `flat while it is still in the page (${rest.shadow})`).toBe(true);
    expect(flat(moved.shadow), `and lifted once the page has moved under it (${moved.shadow})`).toBe(false);
  });

  test("SOLID fills in behind it", async ({ page }) => {
    const { rest, moved } = await arrivalInExport(page, bar({ pinArrival: "solid" }));
    expect(alpha(rest.bg), `see-through at rest (${rest.bg})`).toBeLessThan(0.1);
    expect(alpha(moved.bg), `filled in once it has taken hold (${moved.bg})`).toBeGreaterThan(0.9);
  });

  test("GLASS frosts it, with the page showing through", async ({ page }) => {
    const { rest, moved } = await arrivalInExport(page, bar({ pinArrival: "glass" }));
    expect(rest.backdrop === "none" || /blur\(0/.test(rest.backdrop), `no blur at rest (${rest.backdrop})`).toBe(true);
    expect(moved.backdrop, `frosted after the scroll (${moved.backdrop})`).toMatch(/blur\((?!0px)/);
    expect(alpha(moved.bg), "and still translucent, or it is just Solid").toBeLessThan(0.95);
  });

  test("RULE puts a hairline underneath — and it is not the Shadow", async ({ page }) => {
    const ruled = await arrivalInExport(page, bar({ pinArrival: "rule" }));
    const shadowed = await arrivalInExport(page, bar({ pinArrival: "shadow" }));
    expect(flat(ruled.rest.shadow)).toBe(true);
    expect(flat(ruled.moved.shadow)).toBe(false);
    expect(ruled.moved.shadow, "a hairline is not a lift").not.toBe(shadowed.moved.shadow);
  });

  test("CONDENSE makes it shorter, and the page does not jump while it does", async ({ page }) => {
    const { rest, moved } = await arrivalInExport(page, bar({ pinArrival: "condense" }));
    expect(moved.height, `it was ${rest.height}px and became ${moved.height}px`).toBeLessThan(rest.height - 8);
    // A bar that shrinks moves the content under it, which scroll anchoring can chase — the oscillation
    // people know from shrinking headers. Measured rather than assumed: the scroll position must settle.
    const settled = await page.evaluate(async () => {
      window.scrollTo(0, 60);
      await new Promise((r) => setTimeout(r, 400));
      const a = Math.round(window.scrollY);
      await new Promise((r) => setTimeout(r, 600));
      return { a, b: Math.round(window.scrollY) };
    });
    expect(Math.abs(settled.b - settled.a), `scroll drifted from ${settled.a} to ${settled.b}`).toBeLessThanOrEqual(2);
  });

  test("every arrival is visibly DIFFERENT from every other one (RULE T, measured)", async ({ page }) => {
    const looks: Record<string, string> = {};
    for (const fx of ["shadow", "solid", "glass", "rule", "condense"] as const) {
      const { moved } = await arrivalInExport(page, bar({ pinArrival: fx }));
      looks[fx] = `${moved.shadow}|${moved.bg}|${moved.backdrop}|${moved.height}`;
    }
    expect(new Set(Object.values(looks)).size, JSON.stringify(looks, null, 1)).toBe(5);
  });

  test("CANVAS and EXPORT agree — the editor cannot show an arrival the page will not play", async ({ page }) => {
    const exported = await arrivalInExport(page, bar({ pinArrival: "shadow" }));
    const canvas = await arrivalOnCanvas(page, bar({ pinArrival: "shadow" }));
    expect(flat(canvas.rest.shadow), `flat at rest in the editor too (${canvas.rest.shadow})`).toBe(true);
    expect(flat(canvas.moved.shadow), "and lifted after the canvas scrolls").toBe(false);
    expect(canvas.moved.shadow, "the same shadow, from the same resolver").toBe(exported.moved.shadow);
  });

  test("it COMBINES with the other axes — a bar that floats on screen, held to the bottom, still arrives", async ({ page }) => {
    const { rest, moved } = await arrivalInExport(page, bar({ hold: "fixed", pin: "bottom", pinArrival: "shadow" }));
    expect(flat(rest.shadow)).toBe(true);
    expect(flat(moved.shadow), "fixed + bottom + shadow are independent choices").toBe(false);
  });

  test("the distance it takes is the user's — a short one has finished where a long one has not", async ({ page }) => {
    const quick = await arrivalInExport(page, bar({ pinArrival: "solid", pinArrivalAfter: 40 }), 100);
    const slow = await arrivalInExport(page, bar({ pinArrival: "solid", pinArrivalAfter: 500 }), 100);
    expect(alpha(quick.moved.bg), `over 40px: done by 100px of scroll (${quick.moved.bg})`).toBeGreaterThan(0.9);
    expect(alpha(slow.moved.bg), `over 500px: only a fifth of the way there (${slow.moved.bg})`).toBeLessThan(0.5);
  });

  test("an ENTRANCE and an ARRIVAL are both kept — they are different decisions", async ({ page }) => {
    /**
     * Both write `animation-*` on the same block, so whichever rule the stylesheet emits last would silently
     * take the element over. The browser is asked what it is actually running, because a CSS assertion here
     * would be exactly the mistake this file exists to avoid.
     */
    const { moved } = await arrivalInExport(page, bar({ pinArrival: "shadow", revealEffect: "fade" }));
    expect(moved.running.join(","), `the browser is running: ${moved.running.join(", ") || "nothing"}`).toContain("eu-arrive-shadow");
    expect(moved.running.join(","), "…and the entrance the user also chose").toContain("eu-reveal-fade");
  });

  test("REDUCED MOTION silences it, and the bar still holds", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const { rest, moved } = await arrivalInExport(page, bar({ pinArrival: "shadow" }));
    expect(moved.shadow, "no arrival for a reader who asked for none").toBe(rest.shadow);
    const heldTop = await page.evaluate(() => Math.round(document.querySelector(".bx-nav")!.getBoundingClientRect().top));
    expect(heldTop, "and it is still pinned — the arrival is decoration, the pin is the feature").toBeLessThan(12);
    await page.emulateMedia({ reducedMotion: null });
  });
});
