import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { seedSite, sitePage } from "./helpers/seed-site";

/**
 * RULE AF — WHAT A PUBLISHED PAGE WEIGHS, AND HOW IT LOADS ON A SLOW PHONE (BATCH L-6 changes (2) (3)).
 *
 * The builder's own Export is pressed, its site.zip served with gzip as a host does, and the page opened at a 360 phone and again on
 * Chrome's Slow 3G (`scripts/uat/page-weight.js`, the same check every dressed page of the sweep gets). The budgets are data:
 * `config/budgets.json`. The second test runs the SAME checks with a budget no page can meet, so they are proven able to fail.
 */
// the harness module is CommonJS, shared with the sweep scripts
const { weigh, BUDGET } = require("../../scripts/uat/page-weight.js") as {
  weigh: (p: import("@playwright/test").Page, b?: unknown) => Promise<{ numbers: Record<string, number | null>; findings: string[] }>;
  BUDGET: { page: Record<string, unknown>; slow3g: Record<string, unknown> };
};

const photo = (f: string) => `data:image/jpeg;base64,${readFileSync(join(__dirname, "..", "..", "scripts", "uat", "img", f)).toString("base64")}`;
const crest = `data:image/png;base64,${readFileSync(join(__dirname, "..", "..", "scripts", "uat", "img", "logo.png")).toString("base64")}`;
const col = (id: string, children: unknown[], extra: Record<string, unknown> = {}) => ({ id, type: "container", direction: "column", padding: 0, gap: 0, width: "100%", children, ...extra });
// imgW / imgH: the picture's own size, which the Upload stores (the export writes them as width / height)
const page = () => sitePage([
  col("hdr", [{ id: "mark", type: "image", src: crest, imgW: 64, imgH: 64, alt: "Hillside School crest", eager: true, width: "auto" }, { id: "name", type: "heading", text: "Hillside School", width: "auto" }], { tag: "header" }),
  col("hero", [{ id: "h1", type: "heading", text: "Welcome to our school", width: "auto" }, { id: "pic", type: "image", src: photo("landscape.jpg"), imgW: 1200, imgH: 800, alt: "Pupils in the garden", width: "100%" }]),
  col("body", [{ id: "p", type: "text", text: "Our pupils learn in small classes where every teacher knows every child by name.", width: "auto" }, { id: "pic2", type: "image", src: photo("wide.jpg"), imgW: 1600, imgH: 700, alt: "The playing field", width: "100%" }]),
  col("ftr", [{ id: "f", type: "text", text: "Hillside School · 1 School Lane", width: "auto" }], { tag: "footer" }),
]);

test.describe("a published page weighs what a slow phone can afford (RULE AF)", () => {
  test.beforeEach(async ({ page: p }, info) => {
    test.skip(info.project.name !== "desktop-chrome", "it opens its own 360px phone; one project is enough");
    test.setTimeout(240_000);
    await seedSite(p, page());
    await p.waitForSelector('[data-box-id="pic"]', { timeout: 20000 });
  });

  test("within budget: the HTML + CSS + JS, the first view at 360, the pictures, the fonts, and the first paint on Slow 3G", async ({ page: p }) => {
    const { numbers, findings } = await weigh(p);
    expect(findings, JSON.stringify(numbers)).toEqual([]);
    expect(numbers.htmlCssJsKb, "measured something").toBeGreaterThan(0);
    expect(numbers.slow3gFirstPaintS, "painted on Slow 3G").not.toBeNull();
  });

  test("the same checks FAIL a budget no page can meet — they are not vacuous", async ({ page: p }) => {
    const tight = { page: { ...BUDGET.page, htmlCssJsKbCompressed: 1, firstViewKb: 1, imageOversize: 0.01 }, slow3g: { ...BUDGET.slow3g, firstBandSeconds: 0.01 } };
    const { findings } = await weigh(p, tight);
    for (const code of ["W1", "W2", "W5", "W8"]) expect(findings.some((f) => f.startsWith(code)), `${code} in ${JSON.stringify(findings)}`).toBe(true);
  });
});
