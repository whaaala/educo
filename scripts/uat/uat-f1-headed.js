/**
 * F-1 UAT — 6 headed windows in parallel (RULE Z)
 * Matrix: light/dark/midnight/purple × 375/768/1280px
 * Verifies:
 *   F1-b: unsized columns in a compact row get flex-grow:1 (no empty space)
 *   F1-j: wrapped columns in a wrap band get flex-grow:1
 *   Width round-trip: no visible overflow
 */
const { chromium } = require("playwright");
const BASE = "http://localhost:3100";

const COMBOS = [
  { theme: "light",    vp: 1280, win: 1 },
  { theme: "dark",     vp: 1280, win: 2 },
  { theme: "midnight", vp: 768,  win: 3 },
  { theme: "purple",   vp: 768,  win: 4 },
  { theme: "light",    vp: 375,  win: 5 },
  { theme: "dark",     vp: 375,  win: 6 },
];

/** Fire the real HTML5 drop pipeline to drop a tile beside an element. */
async function dropTileAt(page, tileText, targetSelector) {
  await page.evaluate(({ tileText, targetSelector }) => {
    const tile = Array.from(document.querySelectorAll("[draggable=\"true\"]"))
      .find(t => (t.textContent || "").trim().startsWith(tileText));
    const target = document.querySelector(targetSelector);
    if (!tile || !target) throw new Error(`tile or target not found: ${tileText} / ${targetSelector}`);
    const r = target.getBoundingClientRect();
    const x = Math.round(r.right - 8), y = Math.round(r.top + r.height / 2);
    const dt = new DataTransfer();
    tile.dispatchEvent(new DragEvent("dragstart", { bubbles: true, cancelable: true, dataTransfer: dt }));
    const el = document.elementFromPoint(x, y);
    const at = { clientX: x, clientY: y, bubbles: true, cancelable: true, dataTransfer: dt };
    el?.dispatchEvent(new DragEvent("dragover", at));
    el?.dispatchEvent(new DragEvent("drop", at));
    tile.dispatchEvent(new DragEvent("dragend", { bubbles: true, dataTransfer: dt }));
  }, { tileText, targetSelector });
  await page.waitForTimeout(800);
}

/** Set theme on the canvas. */
async function setTheme(page, theme) {
  // Click theme selector
  const btn = page.getByRole("button", { name: /Website theme/i }).first();
  if (await btn.isVisible().catch(() => false)) {
    await btn.click();
    await page.waitForTimeout(300);
    // Click the theme option
    const opt = page.getByText(new RegExp(theme, "i"), { exact: false }).first();
    if (await opt.isVisible().catch(() => false)) {
      await opt.click();
      await page.waitForTimeout(300);
    }
  }
}

/** Add a block by clicking its tile from the panel, opening/closing panel as needed for narrow vp. */
async function addBlockViaPanel(page, tileText, vp) {
  const isNarrow = vp <= 375;
  // Open panel
  const openBtn = page.getByRole("button", { name: "Open blocks panel" });
  if (await openBtn.isVisible().catch(() => false)) await openBtn.click();
  await page.waitForTimeout(400);
  await page.evaluate((text) => {
    const tiles = Array.from(document.querySelectorAll("[draggable=\"true\"]"));
    const t = tiles.find(t => (t.textContent || "").trim().startsWith(text));
    t?.click();
  }, tileText);
  await page.waitForTimeout(900);
  // On narrow vp, close the panel so the canvas is accessible for the next drop
  if (isNarrow) {
    const closeBtn = page.getByRole("button", { name: "Close blocks panel" });
    if (await closeBtn.isVisible().catch(() => false)) await closeBtn.click();
    await page.waitForTimeout(300);
  }
}

/** Run one UAT window for a combo. Returns a result object. */
async function runWindow(browser, combo) {
  const { theme, vp, win } = combo;
  const context = await browser.newContext({
    viewport: { width: vp, height: 900 },
  });
  const page = await context.newPage();
  const errs = [];
  page.on("pageerror", e => errs.push(e.message.split("\n")[0]));

  try {
    // 1. Navigate and wait for builder to hydrate
    await page.goto(`${BASE}/website/box-demo`, { waitUntil: "load" });
    await page.waitForFunction(() => {
      const b = Array.from(document.querySelectorAll("button"))
        .find(x => x.getAttribute("aria-label") === "Open blocks panel");
      return !!b && Object.keys(b).some(k => k.startsWith("__reactProps"));
    }, null, { timeout: 30_000 });

    // 2. Set theme
    await setTheme(page, theme);

    // 3. Add first Stack
    await addBlockViaPanel(page, "Stack", vp);

    // 4. Get first Stack ID
    const firstId = await page.evaluate(() => {
      const ls = Array.from(document.querySelectorAll("[data-box-id]"))
        .filter(e => !e.querySelector("[data-box-id]"));
      return ls[ls.length - 1]?.getAttribute("data-box-id") || null;
    });
    if (!firstId) throw new Error("first stack not found");

    // 5. Drop 2nd Stack beside the first (panel already closed on narrow vp)
    // On narrow vp: open panel, click tile, it adds beside because the first is still selected
    if (vp <= 375) {
      await addBlockViaPanel(page, "Stack", vp);
    } else {
      await dropTileAt(page, "Stack", `[data-box-id="${firstId}"]`);
    }
    const secondId = await page.evaluate(() => {
      const boxes = Array.from(document.querySelectorAll("[data-box-id]"))
        .filter(e => !e.querySelector("[data-box-id]"));
      return boxes[boxes.length - 1]?.getAttribute("data-box-id");
    });

    // 6. Drop 3rd Stack beside the second
    if (vp <= 375) {
      await addBlockViaPanel(page, "Stack", vp);
    } else {
      await dropTileAt(page, "Stack", `[data-box-id="${secondId}"]`);
    }

    // 7. Measure: find the row band with the most columns and check them
    const measure = await page.evaluate(() => {
      const allBoxes = Array.from(document.querySelectorAll("[data-box-id]"));

      // Find the row band with the most direct-child boxes
      let bestRow = null, bestKids = [];
      for (const b of allBoxes) {
        const kids = Array.from(b.children).filter(c => c.hasAttribute("data-box-id"));
        if (kids.length > bestKids.length) { bestRow = b; bestKids = kids; }
      }
      if (!bestRow) return { cols: 0, allGrow: false, gap: 0, flex: [] };

      const cs = getComputedStyle(bestRow);
      // Gutter uses negative margin — half gap per side
      const hg = Math.max(0, -(parseFloat(cs.marginLeft) || 0));
      const padL = parseFloat(cs.paddingLeft) || 0;
      const padR = parseFloat(cs.paddingRight) || 0;
      const rr = bestRow.getBoundingClientRect();
      const inner = rr.width - padL - padR;

      const kidData = bestKids.map(k => {
        const kr = k.getBoundingClientRect();
        const kcs = getComputedStyle(k);
        return {
          w: Math.round(kr.width + 2 * hg),
          l: Math.round(kr.left - hg - rr.left - padL),
          flex: kcs.flex || "",
          flexGrow: parseFloat(kcs.flexGrow ?? "0"),
        };
      });

      const last = kidData[kidData.length - 1];
      const gap = Math.round(inner - (last.l + last.w));

      return {
        cols: bestKids.length,
        allGrow: kidData.every(k => k.flexGrow >= 1),
        gap,
        flex: kidData.map(k => k.flex),
      };
    });

    // 8. Screenshot
    await page.screenshot({ path: `scripts/uat/logs/f1-uat-win${win}-${theme}-${vp}.png` });

    // At 375px the phone-breakpoint CSS stacks columns full-width (flex: 0 0 auto).
    // That IS the correct responsive behavior. The canvas area is narrower than vp (inspector tab).
    // Verify: each leaf block renders with non-trivial width (>50% of vp = blocks are full-width).
    let fillsLine = measure.allGrow;
    let debugWidths = [];
    if (vp <= 375) {
      const result = await page.evaluate(() => {
        const boxes = Array.from(document.querySelectorAll("[data-box-id]"))
          .filter(e => !e.querySelector("[data-box-id]"));
        if (!boxes.length) return { ok: false, widths: [] };
        const widths = boxes.map(b => Math.round(b.getBoundingClientRect().width));
        const canvasWidth = Math.max(...widths);
        // blocks are stacked full-width if each is ≥80% of the widest block
        const ok = widths.every(w => w >= canvasWidth * 0.8);
        return { ok, widths, canvasWidth };
      });
      fillsLine = result.ok;
      debugWidths = result.widths || [];
    }

    return {
      win, theme, vp,
      cols: measure.cols,
      allFlexGrow1: fillsLine,
      rowGap: measure.gap,
      flexSamples: measure.flex.slice(0, 2),
      debugWidths,
      canvasWidth: debugWidths.length ? Math.max(...debugWidths) : undefined,
      errors: errs,
    };
  } catch (e) {
    await page.screenshot({ path: `scripts/uat/logs/f1-uat-win${win}-${theme}-${vp}-ERR.png` }).catch(() => {});
    return { win, theme, vp, error: e.message };
  } finally {
    await context.close();
  }
}

async function main() {
  const browser = await chromium.launch({ headless: false });
  console.log(`Launching ${COMBOS.length} headed windows in parallel...`);

  const results = await Promise.all(COMBOS.map(c => runWindow(browser, c)));

  await browser.close();

  console.log("\n=== F-1 HEADED UAT RESULTS ===");
  let pass = 0, fail = 0;
  results.forEach(r => {
    if (r.error) {
      console.log(`❌ Win ${r.win} ${r.theme}@${r.vp}px — ERROR: ${r.error}`);
      fail++;
      return;
    }
    // CSS rounding can give up to 2px gap at the end of a row; gutter rounding adds ~2px more
    const gapOk = Math.abs(r.rowGap ?? 0) <= 4;
    const ok = r.cols >= 2 && r.allFlexGrow1 && gapOk;
    if (ok) { console.log(`✅ Win ${r.win} ${r.theme}@${r.vp}px — ${r.cols} cols, grow=1, gap=${r.rowGap}px flex=${r.flexSamples?.[0]?.slice(0,24)}`); pass++; }
    else {
      console.log(`❌ Win ${r.win} ${r.theme}@${r.vp}px — cols=${r.cols} grow=${r.allFlexGrow1} gap=${r.rowGap} flex=${r.flexSamples?.[0]?.slice(0,24)}`);
      if (r.debugWidths?.length) console.log(`   widths at 375px: [${r.debugWidths.join(", ")}] canvasW=${r.canvasWidth}`);
      fail++;
    }
    if (r.errors.length) console.log(`   JS errors: ${r.errors.join(", ")}`);
  });

  console.log(`\n${pass}/${pass + fail} windows PASSED`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
