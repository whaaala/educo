import { describe, it, expect } from "vitest";
import { renderSiteFiles, SHARED_STYLESHEET } from "@/lib/box-export";
import { COMPONENT_CSS } from "@/lib/educo-ui/components";
import { BASE_CSS } from "@/lib/educo-ui/base";
import { DEFAULT_THEME } from "@/lib/site-storage";
import type { BoxSite } from "@/lib/box-site";
import type { BoxNode } from "@/lib/box-model";

/**
 * WHAT A VISITOR DOWNLOADS, ASSERTED.
 *
 * The sizes below were already being measured — in comments, in commit messages, in a paragraph of a handoff
 * note. A number nobody asserts is a number that drifts: a page grows 300 bytes at a time and no single change
 * ever looks like the one that did it.
 *
 * These budgets exist ahead of the grid work in Phase 2 precisely because that work adds CSS to EVERY page.
 * Without a ceiling, "the pages got bigger" is something we find out from a school on a rural connection.
 *
 * Each budget is the measured size plus deliberate headroom, so ordinary work never trips it and a step change
 * always does. When one fails, the question is "is this growth worth it?" — and the answer may well be yes, in
 * which case the budget is raised IN THE SAME CHANGE, with the reason. It is a conversation, not a wall.
 *
 * Fonts are deliberately outside every budget: an embedded typeface is 30–100 KB of somebody else's bytes,
 * chosen by the school, and averaging it in would drown the only thing here we control.
 *
 * See tests/features/components/website/box-builder-performance.feature.
 */

const KB = 1024;
const bytes = (s: string) => new TextEncoder().encode(s).length;

const page = (id: string, name: string, path: string, children: unknown[] = []) => ({
  id, name, path,
  root: { id: `root-${id}`, type: "container", direction: "column", children } as unknown as BoxNode,
});

/** The floor: a page of words. Whatever this costs, EVERY page costs. */
const textSite = (): BoxSite => ({
  homeId: "p1",
  pages: [page("p1", "Welcome", "home", [
    { id: "h", type: "heading", text: "Welcome to our school" },
    { id: "t", type: "text", text: "We are a primary school in the town centre." },
  ])],
} as unknown as BoxSite);

/** A realistic busy page: an alert, an accordion of five items, a card, an image. */
const richSite = (): BoxSite => ({
  homeId: "p1",
  pages: [page("p1", "Admissions", "home", [
    { id: "al", type: "component", component: "alert", alertSeverity: "warning", alertForm: "banner",
      items: [{ id: "a1", title: "Applications close on Friday", body: "Late forms cannot be accepted." }] },
    { id: "ac", type: "component", component: "accordion",
      items: Array.from({ length: 5 }, (_, i) => ({
        id: `i${i}`, title: `Question ${i + 1}`, body: "A reasonably long answer to a common question.",
      })) },
    { id: "cd", type: "component", component: "card", componentFields: { title: "Open day", body: "Come and see us." } },
    { id: "im", type: "image", src: "photo.jpg", alt: "The school gates", imgW: 1600, imgH: 900 },
  ])],
} as unknown as BoxSite);

/**
 * Budgets in BYTES. Each carries a note saying what it protects, so a future reader raising one knows what
 * they are trading away.
 */
const BUDGETS = {
  /** Every visitor downloads this once. It is the design system minus the components, which are subsetted.
   *  Measured 8.1 KB. */
  sharedStylesheet: 12 * KB,
  /** A page of words. The number that must not creep — it is the tax on the whole site. Measured 1.4 KB, so
   *  this is roughly double: enough for the grid's per-page rules, not enough to hide a step change. */
  textPage: 3 * KB,
  /** A busy page with four components on it. Measured 9.9 KB. */
  richPage: 16 * KB,
  /** The component library as authored. Subsetting means a page never ships all of it, but it bounds the
   *  worst case and keeps the library from growing without anyone noticing. */
  componentLibrary: 80 * KB,
  /** The element/base layer, which is NOT subsetted — it goes to every page whole. */
  baseLayer: 12 * KB,
};

/** Printed on every run: the point is to see the trend, not only the failure. */
function report(rows: [string, number, number][]) {
  const lines = rows.map(([name, actual, budget]) =>
    `  ${name.padEnd(22)} ${(actual / KB).toFixed(1).padStart(6)} KB / ${(budget / KB).toFixed(0).padStart(3)} KB  (${Math.round((actual / budget) * 100)}% of budget)`);
  console.log(`\nPerformance budgets\n${lines.join("\n")}\n`);
}

describe("performance budgets", () => {
  it("stays inside every budget, and says where it stands", () => {
    const textFiles = renderSiteFiles(textSite(), DEFAULT_THEME);
    const richFiles = renderSiteFiles(richSite(), DEFAULT_THEME);

    const measured: [string, number, number][] = [
      ["shared styles.css", bytes(textFiles[SHARED_STYLESHEET]), BUDGETS.sharedStylesheet],
      ["a page of text", bytes(textFiles["index.html"]), BUDGETS.textPage],
      ["a busy page", bytes(richFiles["index.html"]), BUDGETS.richPage],
      ["component library", bytes(COMPONENT_CSS), BUDGETS.componentLibrary],
      ["base layer", bytes(BASE_CSS), BUDGETS.baseLayer],
    ];
    report(measured);

    for (const [name, actual, budget] of measured) {
      expect(actual, `${name} is ${(actual / KB).toFixed(1)} KB, over its ${(budget / KB).toFixed(0)} KB budget. ` +
        "Either trim it, or raise the budget in this same change and say why.").toBeLessThanOrEqual(budget);
    }
  });

  it("a page of text carries almost no component CSS, which is what subsetting is FOR", () => {
    // Stated as a share of the library rather than a byte count: it is the ratio that proves the mechanism
    // works, and it holds however large the library grows.
    const html = renderSiteFiles(textSite(), DEFAULT_THEME)["index.html"];
    const inlineCss = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("");
    expect(bytes(inlineCss)).toBeLessThan(bytes(COMPONENT_CSS) * 0.05);
  });

  it("adding a second page costs only that page — the design system is not repeated", () => {
    // The whole justification for a separate styles.css. If a page ever inlined the shared sheet, this fails.
    const two: BoxSite = {
      homeId: "p1",
      pages: [textSite().pages[0], page("p2", "Contact", "contact", [{ id: "t2", type: "text", text: "Call us." }])],
    } as unknown as BoxSite;
    const files = renderSiteFiles(two, DEFAULT_THEME);
    expect(bytes(files["contact.html"])).toBeLessThan(bytes(files[SHARED_STYLESHEET]));
  });

  it("no page inlines the shared stylesheet, which would defeat caching entirely", () => {
    const files = renderSiteFiles(richSite(), DEFAULT_THEME);
    // The DEFINITION of a token belongs to the shared sheet alone. A page may of course REFERENCE it —
    // `var(--eu-color-primary-500)` is the whole point of the token layer — so this looks for the
    // declaration, not the name.
    expect(files[SHARED_STYLESHEET]).toContain("--eu-color-primary-500:");
    expect(files["index.html"]).not.toContain("--eu-color-primary-500:");
  });

  it("a page ships one accordion's rules, not every accordion design there is", () => {
    // The subsetter kept a chained selector whenever ANY of its classes was on the page, so
    // `.eu-accordion--invert .eu-accordion__item` shipped to every page with any accordion. It cost 27 KB on
    // the busy page above — more than two thirds of it — for rules that could never match.
    const html = renderSiteFiles(richSite(), DEFAULT_THEME)["index.html"];
    expect(html, "the accordion IS on this page").toContain("eu-accordion__item");
    for (const unusedVariant of ["eu-accordion--invert", "eu-accordion--gradient-full", "eu-accordion--corner", "eu-accordion--split"]) {
      expect(html, `${unusedVariant} is not used on this page`).not.toContain(unusedVariant);
    }
  });
});
