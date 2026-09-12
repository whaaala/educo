import { test, expect, type Page } from "@playwright/test";
import type { BoxNode } from "@/lib/box-model";
import { siteFromRoot } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import { DEFAULT_THEME } from "@/lib/site-storage";
import { HOVER_EFFECTS, REVEAL_EFFECTS } from "@/lib/interactions";
import { ALL_COMPONENTS } from "@/lib/component-catalogue";
import { blockForKind } from "@/lib/box-presets";

/**
 * One page, rendered through the SHIPPING export path.
 *
 * These used to call `renderSiteHTML`, which put every page in one document. The app no longer emits that
 * shape — so the tests were validating a code path that could not reach a user, which is exactly the failure
 * these invariants exist to catch. `inlineShared` is set because `setContent` has no styles.css to fetch.
 */
const exportDoc = (root: BoxNode) => {
  const site = siteFromRoot(root);
  return renderSitePage(site, DEFAULT_THEME, site.homeId, { inlineShared: true });
};

/**
 * INTERACTIONS — hover & focus (Round 1a).
 *
 * Only a browser can judge this. A unit test can confirm the CSS text contains ":hover", which says nothing
 * about whether anything actually happens — the same blind spot that let the container queries sit dead for
 * weeks. So every assertion here is a MEASURED change in computed style, on the canvas and on the exported page.
 */

const CANVAS = "/website/box-demo";

/** Render the same node through the real exporter and load it as a standalone page. */
async function loadExport(page: Page, node: BoxNode) {
  const root = { id: "root", type: "container", direction: "column", children: [
    { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", children: [node] },
  ] } as unknown as BoxNode;
  await page.setContent(exportDoc(root), { waitUntil: "domcontentloaded" });
  // `attached`, not `visible`: a toast is `position:fixed`, so its wrapper correctly collapses to zero size in
  // the flow — the visible element is the stack inside it.
  await page.waitForSelector("#tgt", { state: "attached", timeout: 10_000 });
}

/**
 * Load the export from a real http origin instead of `setContent`.
 *
 * `setContent` puts the page on `about:blank`, where `localStorage` throws SecurityError — which the alert
 * script correctly swallows, so PERSISTENCE silently did nothing and looked like a product bug. Anything that
 * touches storage has to be served from an origin to be judged at all.
 */
async function loadExportAtOrigin(page: Page, node: BoxNode) {
  const root = { id: "root", type: "container", direction: "column", children: [
    { id: "band", type: "container", direction: "row", rowBand: true, width: "fill", children: [node] },
  ] } as unknown as BoxNode;
  const html = exportDoc(root);
  await page.route("**/__export_fixture", (route) => route.fulfill({ contentType: "text/html", body: html }));
  await page.goto("http://localhost:3000/__export_fixture");
  await page.waitForSelector("#tgt", { state: "attached", timeout: 10_000 });
}

const cardWith = (hoverEffect: string) => ({
  id: "tgt", anchor: "tgt", type: "container", preset: "card", direction: "column",
  width: "60%", padding: 24, gap: 12, radius: 16, shadow: "md", borderWidth: 1,
  background: "var(--eu-color-surface)", hoverEffect,
  children: [{ id: "h", type: "heading", text: "Hover me", fontSize: 22, bold: true }],
});

/**
 * Everything an effect is allowed to change, compared as a whole so any effect registers.
 *
 * OUTLINE is excluded on the canvas: the editor draws its own hover outline on every block as an editing
 * affordance, so including it would report a change for the "None" effect — the editor's chrome, not the
 * user's design. The exported page has no such chrome, so there it is measured.
 */
const look = (sel: string, withOutline: boolean) =>
  `(() => { const c = getComputedStyle(document.querySelector('${sel}'));
    return [c.transform, c.boxShadow, c.opacity, c.filter${withOutline ? ", c.outlineWidth, c.outlineColor" : ""}].join(" | "); })()`;
const lookOf = (page: Page, sel: string, withOutline = true) =>
  page.evaluate(look(sel, withOutline)) as Promise<string>;

// The canvas cases reload the dev page once per effect, which the default 30s cannot cover — the same reason
// the layout harness raises its own limit. Serial, because parallel reloads of the dev server just time out.
test.describe.configure({ mode: "serial" });
test.setTimeout(150_000);

test.describe("Interactions — hover, focus and entrance (Rounds 1a + 1b)", () => {
  test("EVERY named effect actually changes the block on the canvas", async ({ page }) => {
    // The list is fixed precisely so this can assert all of it. An effect that silently does nothing is the
    // failure mode a named-effect menu invites, and the one this catches.
    //
    // ONE page holding one card per effect, rather than a reload per effect. Reloading the dev canvas eight
    // times made this the slowest test in the suite and a flaky one — it timed out when run straight after the
    // layout harness had been hammering the same dev server for ten minutes. Nothing is lost: hovering one card
    // cannot affect its siblings.
    await page.goto(CANVAS);
    const idFor = (fxId: string) => `tgt-${fxId || "none"}`;
    await page.evaluate((effects) => {
      const rid = () => "b" + Math.random().toString(36).slice(2, 9);
      const cards = effects.map((fx) => ({
        id: `tgt-${fx || "none"}`, type: "container", preset: "card", direction: "column",
        width: "30%", padding: 16, gap: 8, radius: 16, shadow: "md", borderWidth: 1,
        background: "var(--eu-color-surface)", hoverEffect: fx,
        children: [{ id: rid(), type: "heading", text: "Hover me", fontSize: 18, bold: true }],
      }));
      const site = { pages: [{ id: "p1", name: "Home", path: "/", root: { id: "root", type: "container", direction: "column", children: [
        { id: rid(), type: "container", direction: "row", rowBand: true, width: "fill", wrap: true, children: cards },
      ] } }], homeId: "p1" };
      localStorage.setItem("educo_box_site_v1", JSON.stringify(site));
      localStorage.setItem("educo_box_site_cleaned_v1", "1");
    }, HOVER_EFFECTS.map((f) => f.id));
    await page.reload();
    await page.waitForSelector(`[data-box-id="${idFor("")}"]`, { timeout: 20000 });
    await page.waitForTimeout(300);

    for (const fx of HOVER_EFFECTS) {
      const sel = `[data-box-id="${idFor(fx.id)}"]`;
      const el = page.locator(sel);
      const resting = await lookOf(page, sel, false);
      await el.hover();
      await page.waitForTimeout(320); // let the transition settle
      const hovered = await lookOf(page, sel, false);
      await page.mouse.move(2, 2);
      await page.waitForTimeout(320);
      const released = await lookOf(page, sel, false);

      // An OUTLINE-only effect cannot be measured here: the editor draws its own hover outline on every block,
      // so outline is excluded from the canvas comparison (see `look`) and this effect would read as "no
      // change". Its rule is asserted instead, and the export test — which has no editor chrome — proves the
      // behaviour. Worth knowing as a product point too: in the BUILDER an outline effect sits under the
      // editor's own hover outline, so it reads properly only in Preview or on the published page.
      const outlineOnly = fx.decls.split(";").filter(Boolean).every((d) => d.trim().startsWith("outline"));

      if (fx.id === "") {
        expect(hovered, "None must do nothing at all").toBe(resting);
      } else if (outlineOnly) {
        const css = await page.evaluate(() =>
          [...document.querySelectorAll("style")].map((n) => n.textContent ?? "").join(""));
        expect(css, `"${fx.label}" must still be wired up on the canvas`).toContain(`${sel}:hover`);
      } else {
        expect(hovered, `"${fx.label}" must visibly change the block on hover`).not.toBe(resting);
        expect(released, `"${fx.label}" must return to its resting look`).toBe(resting);
      }
    }
  });

  test("the EXPORT hovers identically — canvas = export", async ({ page }) => {
    for (const fx of HOVER_EFFECTS.filter((f) => f.id)) {
      await loadExport(page, cardWith(fx.id) as unknown as BoxNode);
      const resting = await lookOf(page, "#tgt");
      await page.locator("#tgt").hover();
      await page.waitForTimeout(320);
      const hovered = await lookOf(page, "#tgt");
      expect(hovered, `"${fx.label}" must work on the published page too`).not.toBe(resting);
    }
  });

  test("a page with no effects ships no interaction CSS at all", async ({ page }) => {
    await loadExport(page, cardWith("") as unknown as BoxNode);
    const css = await page.evaluate(() =>
      [...document.querySelectorAll("style")].map((s) => s.textContent ?? "").join(""));
    // Scoped to OUR block rules: the Educo UI stylesheet has its own `:hover` styles for buttons and accordion
    // headers, and those ship regardless. What must be absent is a hover rule for this block.
    expect(css, "no block hover rule when no effect is chosen").not.toMatch(/\.bx-[\w-]+:hover/);
    expect(css, "and no reduced-motion block for one either").not.toMatch(/prefers-reduced-motion[^}]*\}\s*\.bx-/);
  });

  test("KEYBOARD parity: focusing a control inside the block triggers the same effect", async ({ page }) => {
    // A hover a keyboard user can never see is an accessibility failure, so every effect also applies on
    // `:focus-visible` and on `:has(:focus-visible)` — the card responds when its own button takes focus.
    const node = { ...cardWith("lift"), children: [
      { id: "h", type: "heading", text: "Hover me", fontSize: 22, bold: true },
      { id: "b", type: "button", text: "Read more", href: "#" },
    ] };
    await loadExport(page, node as unknown as BoxNode);
    const resting = await lookOf(page, "#tgt");
    // The exported page has a sticky nav, so the first Tab lands there — walk until focus is inside the block.
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      if (await page.evaluate(() => !!document.activeElement?.closest("#tgt"))) break;
    }
    expect(await page.evaluate(() => !!document.activeElement?.closest("#tgt")),
      "the test must actually reach a control inside the block").toBe(true);
    await page.waitForTimeout(320);
    const focused = await lookOf(page, "#tgt");
    expect(focused, "the block must respond to keyboard focus, not only to a pointer").not.toBe(resting);
  });

  test("REDUCED MOTION removes the movement but keeps the feedback", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await loadExport(page, cardWith("lift") as unknown as BoxNode);
    const resting = await page.evaluate(() => getComputedStyle(document.querySelector("#tgt")!).transform);
    await page.locator("#tgt").hover();
    await page.waitForTimeout(320);
    const seen = await page.evaluate(() => {
      const c = getComputedStyle(document.querySelector("#tgt")!);
      return { transform: c.transform, boxShadow: c.boxShadow };
    });
    expect(seen.transform, "no movement for a reader who asked for none").toBe(resting);
    expect(seen.boxShadow, "but the block still shows it is interactive").not.toBe("none");
    await page.emulateMedia({ reducedMotion: null });
  });

  test("hover never breaks the page's geometry", async ({ page }) => {
    // A "grow" that pushes the page sideways would be a regression of the layout invariants, so it is asserted
    // here in the hovered state, which those harnesses never enter.
    await loadExport(page, cardWith("grow") as unknown as BoxNode);
    await page.locator("#tgt").hover();
    await page.waitForTimeout(320);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, "a hover effect must not make the page scroll sideways").toBeLessThanOrEqual(1);
  });

  test("TOAST floats in the corner it was told to — in the export AND on the canvas", async ({ page }) => {
    // "Toast" was selectable long before it did anything: its whole implementation was `align-items:stretch`
    // and a shadow. A form factor that is offered and not delivered is the same defect as a dead container
    // query, and only a browser can tell the difference.
    const toast = (corner: string) => ({
      id: "tgt", anchor: "tgt", type: "component", component: "alert", width: "auto",
      alertSeverity: "info", alertForm: "toast", alertToast: corner,
      items: [{ id: "i1", title: "Saved", body: "Your changes are live." }],
    });

    for (const corner of ["top-left", "top-right", "bottom-left", "bottom-right"]) {
      await loadExport(page, toast(corner) as unknown as BoxNode);
      const box = (await page.locator("#tgt .eu-alert-stack").boundingBox())!;
      const size = page.viewportSize()!;
      // "In the corner" means CLOSE TO TWO EDGES, which is what the gap measures. Comparing the toast's top
      // against the halfway line is not the same claim: a short toast pinned to the bottom of a short page
      // still has its top above the middle, and that is what made the first version of this fail on a true
      // placement. The gap is one space token (1rem), so allow a little for borders and rounding.
      const GAP = 28;
      const gapTop = box.y, gapLeft = box.x;
      const gapBottom = size.height - (box.y + box.height), gapRight = size.width - (box.x + box.width);
      expect(corner.startsWith("top") ? gapTop : gapBottom, `${corner}: vertical gap`).toBeLessThan(GAP);
      expect(corner.endsWith("left") ? gapLeft : gapRight, `${corner}: horizontal gap`).toBeLessThan(GAP);
      expect(await page.evaluate(() => getComputedStyle(document.querySelector("#tgt .eu-alert-stack")!).position)).toBe("fixed");
    }

    // On the CANVAS the identical rule must pin to the PAGE frame, never over the editor chrome. The page root
    // carries a transform, which makes it the containing block for a fixed descendant.
    await page.goto(CANVAS);
    await page.evaluate((n) => {
      const rid = () => "b" + Math.random().toString(36).slice(2, 9);
      const site = { pages: [{ id: "p1", name: "Home", path: "/", root: { id: "root", type: "container", direction: "column", children: [
        { id: rid(), type: "container", direction: "row", rowBand: true, width: "fill", children: [n] },
      ] } }], homeId: "p1" };
      localStorage.setItem("educo_box_site_v1", JSON.stringify(site));
      localStorage.setItem("educo_box_site_cleaned_v1", "1");
    }, toast("bottom-right"));
    await page.reload();
    // Same reason as the export: a fixed toast collapses its wrapper, so wait for it to exist.
    await page.waitForSelector('[data-box-id="tgt"]', { state: "attached", timeout: 20000 });
    await page.waitForTimeout(400);

    const placed = await page.evaluate(() => {
      const el = document.querySelector('[data-box-id="tgt"] .eu-alert-stack') as HTMLElement;
      const pageRoot = document.querySelectorAll("[data-box-id]")[0] as HTMLElement;
      const t = el.getBoundingClientRect(), p = pageRoot.getBoundingClientRect();
      return {
        position: getComputedStyle(el).position,
        insidePageRight: t.right <= p.right + 2,
        insidePageBottom: t.bottom <= p.bottom + 2,
        gapRight: p.right - t.right,
        gapBottom: p.bottom - t.bottom,
      };
    });
    expect(placed.position, "the canvas uses the same rule as the export").toBe("fixed");
    expect(placed.insidePageRight, "a toast must stay inside the page, not over the editor").toBe(true);
    expect(placed.insidePageBottom, "a toast must stay inside the page, not over the editor").toBe(true);
    expect(placed.gapRight, "pinned to the page's right edge").toBeLessThan(28);
    expect(placed.gapBottom, "pinned to the page's bottom edge").toBeLessThan(28);
  });

  test("AUTO-DISMISS hides the message, and PAUSES while the reader is engaging with it", async ({ page }) => {
    // An auto-hiding message that cannot be held still is a WCAG 2.2.1 (Timing Adjustable) failure, so the
    // pause is not a nicety — it is the part that makes the feature acceptable at all. Timing behaviour like
    // this cannot be judged from the emitted CSS; it has to be watched.
    const alert = (extra: Record<string, unknown>) => ({
      id: "tgt", anchor: "tgt", type: "component", component: "alert", width: "fill",
      alertSeverity: "info", alertForm: "inline", alertDismiss: true,
      items: [{ id: "i1", title: "Saved", body: "Your changes are live." }], ...extra,
    });

    await loadExport(page, alert({ alertAutoSeconds: 2 }) as unknown as BoxNode);
    expect(await page.locator("#tgt .eu-alert").count(), "it starts visible").toBe(1);
    expect(await page.locator("#tgt .eu-alert__progress").count(), "with a countdown bar").toBe(1);

    // Held under the pointer, it must still be there well past its own deadline.
    await page.locator("#tgt .eu-alert").hover();
    await page.waitForTimeout(3200);
    expect(await page.locator("#tgt .eu-alert").count(), "hovering must hold it open").toBe(1);

    // Released, it goes.
    await page.mouse.move(2, 2);
    await page.waitForTimeout(2800);
    expect(await page.locator("#tgt .eu-alert").count(), "and it hides once the reader moves away").toBe(0);
  });

  test("PERSISTENCE remembers a dismissal, and only when asked", async ({ page }) => {
    const alert = (extra: Record<string, unknown>) => ({
      id: "tgt", anchor: "tgt", type: "component", component: "alert", width: "fill",
      alertSeverity: "info", alertForm: "inline", alertDismiss: true,
      items: [{ id: "i1", title: "Saved", body: "Your changes are live." }], ...extra,
    });

    // WITHOUT persistence, a dismissal lasts only for that view.
    await loadExportAtOrigin(page, alert({}) as unknown as BoxNode);
    await page.locator("#tgt [data-eu-dismiss]").click();
    await page.waitForTimeout(300);
    expect(await page.locator("#tgt .eu-alert").count()).toBe(0);
    await loadExportAtOrigin(page, alert({}) as unknown as BoxNode);
    expect(await page.locator("#tgt .eu-alert").count(), "it comes back on the next visit").toBe(1);

    // WITH persistence, it stays gone.
    await loadExportAtOrigin(page, alert({ alertPersist: true }) as unknown as BoxNode);
    await page.locator("#tgt [data-eu-dismiss]").click();
    await page.waitForTimeout(300);
    await loadExportAtOrigin(page, alert({ alertPersist: true }) as unknown as BoxNode);
    await page.waitForTimeout(200);
    expect(await page.locator("#tgt .eu-alert").count(), "a remembered dismissal survives a reload").toBe(0);
  });

  test("ZERO-JS stays the default — nothing opted into means no script at all", async ({ page }) => {
    const plain = {
      id: "tgt", anchor: "tgt", type: "component", component: "alert", width: "fill",
      alertSeverity: "info", alertForm: "inline",
      items: [{ id: "i1", title: "Saved", body: "Your changes are live." }],
    };
    await loadExport(page, plain as unknown as BoxNode);
    const scripts = await page.evaluate(() =>
      [...document.querySelectorAll("script")].map((n) => n.textContent ?? "").join(""));
    expect(scripts, "an alert nobody asked to behave must ship no behaviour").not.toContain("__euAlert");
    expect(await page.locator("#tgt .eu-alert__progress").count(), "and no countdown bar").toBe(0);
  });

  test("ENTRANCE: every effect ends with the block fully VISIBLE — never stuck hidden", async ({ page }) => {
    // The one property that must never break. A reveal hides the block in its keyframes and animates to its
    // natural look, so the end state has to be fully opaque and unmoved. If an effect ever settled short of
    // that, a school's content would be permanently faded or offset on their live site.
    for (const fx of REVEAL_EFFECTS.filter((f) => f.from)) {
      await loadExport(page, { id: "tgt", anchor: "tgt", type: "container", direction: "column",
        width: "60%", padding: 24, background: "var(--eu-color-surface)", revealEffect: fx.id,
        children: [{ id: "h", type: "heading", text: "Hello", fontSize: 22, bold: true }] } as unknown as BoxNode);
      await page.waitForTimeout(900); // longer than the animation
      const settled = await page.evaluate(() => {
        const c = getComputedStyle(document.querySelector("#tgt")!);
        return { opacity: c.opacity, transform: c.transform, filter: c.filter };
      });
      expect(settled.opacity, `"${fx.label}" must end fully visible`).toBe("1");
      expect(["none", "matrix(1, 0, 0, 1, 0, 0)"], `"${fx.label}" must end unmoved`).toContain(settled.transform);
      // `animation-fill-mode: both` holds the interpolated end value, so a settled blur reads as "blur(0px)"
      // rather than "none". Both mean sharp — assert the RADIUS, not the spelling.
      const blur = /blur(([d.]+)px)/.exec(settled.filter);
      expect(blur ? Number(blur[1]) : 0, `"${fx.label}" must end unblurred`).toBe(0);
    }
  });

  test("ENTRANCE actually plays — the block starts hidden and becomes visible", async ({ page }) => {
    await loadExport(page, { id: "tgt", anchor: "tgt", type: "container", direction: "column",
      width: "60%", padding: 24, background: "var(--eu-color-surface)", revealEffect: "fade",
      children: [{ id: "h", type: "heading", text: "Hello", fontSize: 22, bold: true }] } as unknown as BoxNode);
    // Sampled immediately: the animation is mid-flight, so it must not already be at its resting opacity.
    const early = await page.evaluate(() => getComputedStyle(document.querySelector("#tgt")!).opacity);
    await page.waitForTimeout(900);
    const late = await page.evaluate(() => getComputedStyle(document.querySelector("#tgt")!).opacity);
    expect(Number(early), "it starts out of sight").toBeLessThan(1);
    expect(late, "and arrives").toBe("1");
  });

  test("REDUCED MOTION shows the content immediately, with no entrance at all", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await loadExport(page, { id: "tgt", anchor: "tgt", type: "container", direction: "column",
      width: "60%", padding: 24, background: "var(--eu-color-surface)", revealEffect: "rise",
      children: [{ id: "h", type: "heading", text: "Hello", fontSize: 22, bold: true }] } as unknown as BoxNode);
    const seen = await page.evaluate(() => {
      const c = getComputedStyle(document.querySelector("#tgt")!);
      return { opacity: c.opacity, animationName: c.animationName };
    });
    expect(seen.opacity, "visible straight away — no fade to sit through").toBe("1");
    expect(seen.animationName, "and no animation running").toBe("none");
    await page.emulateMedia({ reducedMotion: null });
  });

  test("STAGGER brings a container's children in one after another", async ({ page }) => {
    await loadExport(page, { id: "tgt", anchor: "tgt", type: "container", direction: "column",
      width: "60%", padding: 24, revealEffect: "rise", revealStagger: true, children: [
        { id: "a", type: "heading", text: "One", fontSize: 20 },
        { id: "b", type: "heading", text: "Two", fontSize: 20 },
        { id: "c", type: "heading", text: "Three", fontSize: 20 },
      ] } as unknown as BoxNode);
    const delays = await page.evaluate(() =>
      [...document.querySelectorAll("#tgt > *")].map((n) => getComputedStyle(n).animationDelay));
    expect(delays.length).toBeGreaterThanOrEqual(3);
    expect(delays[0]).toBe("0s");
    expect(delays[1], "the second child waits a beat").not.toBe("0s");
    expect(delays[2], "and the third waits longer").not.toBe(delays[1]);
    // and they all still end up visible
    await page.waitForTimeout(1200);
    const opacities = await page.evaluate(() =>
      [...document.querySelectorAll("#tgt > *")].map((n) => getComputedStyle(n).opacity));
    expect(new Set(opacities), "every child arrives").toEqual(new Set(["1"]));
  });

  test("EVERY component can carry an entrance — existing and future", async ({ page }) => {
    for (const component of ALL_COMPONENTS) {
      const node = { ...blockForKind(component), id: "tgt", anchor: "tgt", revealEffect: "fade",
        ...(component === "alert" || component === "accordion"
          ? { items: [{ id: "i1", title: "Heads up", body: "A message." }] } : {}) };
      await loadExport(page, node as unknown as BoxNode);
      await page.waitForTimeout(800);
      const seen = await page.evaluate(() => {
        const c = getComputedStyle(document.querySelector("#tgt")!);
        return { opacity: c.opacity, name: c.animationName };
      });
      expect(seen.name, `${component} must accept an entrance`).toContain("eu-reveal-fade");
      expect(seen.opacity, `${component} must end visible`).toBe("1");
    }
  });

  test("EVERY component can carry a hover effect — existing and future", async ({ page }) => {
    // It lives on the node, so this holds by construction; asserted across the catalogue so a future component
    // is covered the moment it is added there.
    for (const component of ALL_COMPONENTS) {
      const node = { ...blockForKind(component), id: "tgt", anchor: "tgt", hoverEffect: "glow",
        ...(component === "alert" || component === "accordion"
          ? { items: [{ id: "i1", title: "Heads up", body: "A message." }] } : {}) };
      await loadExport(page, node as unknown as BoxNode);
      const resting = await lookOf(page, "#tgt");
      await page.locator("#tgt").hover();
      await page.waitForTimeout(300);
      const hovered = await lookOf(page, "#tgt");
      expect(hovered, `${component} must support a hover effect`).not.toBe(resting);
    }
  });
});
