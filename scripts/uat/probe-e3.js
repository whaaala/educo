// BATCH E-3 measurements (HEADLESS probe, not a UAT). node scripts/uat/probe-e3.js <wheel|select> [base]
const { chromium, devices } = require("playwright");
const BASE = process.argv[3] || "http://localhost:3100";
const what = process.argv[2];
const PROJECTS = {
  desktop: { ...devices["Desktop Chrome"] },
  landscape: { viewport: { width: 1024, height: 768 }, deviceScaleFactor: 2, isMobile: false, hasTouch: true },
  portrait: { viewport: { width: 768, height: 1024 }, deviceScaleFactor: 2, isMobile: false, hasTouch: true },
  phone: { ...devices["Pixel 5"] },
};
const seed = (site) => {
  localStorage.setItem("educo_box_site_v1", JSON.stringify(site));
  localStorage.setItem("educo_box_site_cleaned_v1", "1");
};
const page1 = (kids) => ({ pages: [{ id: "p1", name: "Home", path: "/", root: { id: "root", type: "container", direction: "column", padding: 0, gap: 0, children: kids } }], homeId: "p1" });

(async () => {
  const browser = await chromium.launch();
  for (const [name, opts] of Object.entries(PROJECTS)) {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    if (what === "wheel") {
      await page.setViewportSize({ width: 1520, height: 900 });
      await page.addInitScript(seed, page1([
        { id: "box", type: "container", direction: "column", width: "30%", padding: 24, background: "#e0e7ff", children: [{ id: "h", type: "heading", text: "Open day", width: "100%" }] },
        { id: "tall", type: "container", direction: "column", width: "100%", minHeight: 1800, children: [] },
      ]));
      await page.goto(BASE + "/website/box-demo");
      await page.waitForSelector('[data-box-id="box"]');
      await page.locator('button[title="Desktop (1280px)"]').first().click();
      await page.waitForTimeout(500);
      const z = () => page.evaluate(() => Number(document.querySelector("[data-box-id]").closest("[data-canvas-scale]")?.dataset.canvasScale) || 1);
      await page.evaluate(() => { window.__d = []; window.addEventListener("wheel", (e) => window.__d.push([e.deltaY, e.deltaMode, e.ctrlKey]), { capture: true, passive: true }); });
      const z0 = await z();
      const h = await page.locator('[data-box-id="h"]').boundingBox();
      await page.mouse.move(h.x + 30, h.y + h.height / 2);
      await page.keyboard.down("Control"); await page.mouse.wheel(0, -400); await page.keyboard.up("Control");
      await page.waitForTimeout(400);
      const inspector = await page.locator('aside[aria-label="Inspector"]').count();
      console.log(name, JSON.stringify({ z0, z1: await z(), events: await page.evaluate(() => window.__d), inspector, dpr: await page.evaluate(() => devicePixelRatio) }));
    }
    if (what === "select") {
      const mid = process.argv[4] === "mid";
      await page.addInitScript(seed, page1([
        mid
          ? { id: "sec", type: "container", direction: "column", padding: 0, gap: 0, width: "100%", minHeight: 300, background: "#eef2ff", children: [{ id: "h", type: "heading", text: "Riverside Primary School", width: "100%" }] }
          : { id: "sec", type: "container", direction: "column", padding: 24, gap: 0, width: "100%", background: "#eef2ff", children: [{ id: "h", type: "heading", text: "Welcome to Riverside School", width: "100%" }] },
      ]));
      await page.goto(BASE + "/website/box-demo");
      await page.waitForSelector('[data-box-id="h"]');
      await page.waitForTimeout(500);
      const sel = () => page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
      const h = await page.locator('[data-box-id="h"]').boundingBox();
      const log = [];
      for (let i = 0; i < 4; i++) {
        const x = mid ? h.x + h.width * 0.5 : h.x + h.width - 8, y = h.y + h.height / 2;
        const top = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? (e.getAttribute("aria-label") || e.closest("[data-box-id]")?.getAttribute("data-box-id") || e.tagName) : null; }, [x, y]);
        await page.mouse.click(x, y); await page.waitForTimeout(250);
        log.push({ top, sel: await sel() });
      }
      const scale = await page.evaluate(() => Number(document.querySelector("[data-canvas-scale]")?.dataset.canvasScale) || 1);
      console.log(name, JSON.stringify({ scale, h: { w: Math.round(h.width), hgt: Math.round(h.height) }, log }));
    }
    await ctx.close();
  }
  await browser.close();
})();
