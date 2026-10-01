// HEADED UAT — BATCH L-1 · e-1 (L1-2): the S-1 repro of "the canvas offered the drop and added nothing", built THROUGH
// THE UI: a row of three columns, a 3×2 grid added after the 3rd column, an Image clicked with the grid selected (it
// landed INSIDE the grid as a 7th cell), then a Stack — once by clicking its tile with the image selected, once by a REAL
// mouse drag just under the image. Repeated, to see whether it is every time.
//   NODE_PATH=node_modules node scripts/uat/probe-l1e1.js [--pos=0,0] [--tries=3]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers;
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const THEME = arg('theme', 'Light');
const OUT = path.join(__dirname, 'probe-l1e1-out', THEME.replace(/\s/g, '')); fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const pos = arg('pos', '0,0').split(',').map(Number);
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 720, pos });
  page.setDefaultTimeout(12000); let ok = 0, bad = 0;
  const attempt = async (label, t, fn) => {
    try { const id = await fn(); ok++; console.log(`  try ${t + 1} ${label}: landed (${id.slice(-4)})`); return id; }
    catch (e) { bad++; console.log(`  try ${t + 1} ${label}: FAILED — ${e.message.split('\n')[0]}`); await page.screenshot({ path: path.join(OUT, `fail-${t + 1}-${label}.png`) }); fs.writeFileSync(path.join(OUT, `fail-${t + 1}-${label}-tree.txt`), await H.tree(page)); return null; }
  };
  try {
    if (THEME !== 'Light') { // the top bar's "Website theme" menu, as a user picks it
      await page.getByRole('button', { name: 'Website theme' }).first().click(); await page.waitForTimeout(300);
      await page.getByRole('menuitemradio', { name: new RegExp(THEME) }).first().click(); await page.waitForTimeout(500);
    }
    await H.panel(page, true);
    let last = await P.first(page, 'Stack'); await P.into(page, last, 'Heading');
    for (let t = 0; t < +arg('tries', '3'); t++) {
      const c1 = await P.tileAfter(page, last, 'Stack'); const cols = await P.row(page, c1, ['Stack', 'Stack']);
      for (const c of cols) await P.into(page, c, 'Text');
      await H.panel(page, false); await H.select(page, cols[2]); await H.panel(page, true); const grid = await P.grid(page, 3, 2);
      const img = await P.tileAfter(page, grid, 'Image');
      const inGrid = await page.evaluate(([g, i]) => !!document.querySelector(`[data-box-id="${g}"]`)?.contains(document.querySelector(`[data-box-id="${i}"]`)), [grid, img]);
      console.log(`  try ${t + 1}: the Image ${inGrid ? 'landed INSIDE the grid' : 'landed after the grid'}`);
      const st = await attempt('click-Stack', t, () => P.tileAfter(page, img, 'Stack'));
      if (st) { // what a user SEES: the Stack is the grid's next cell, right after the image, with a real size
        const m = await page.evaluate(([g, i, s]) => { const q = (id) => document.querySelector(`[data-box-id="${id}"]`); const S = q(s), I = q(i), G = q(g);
          const kids = Array.from(G.querySelectorAll(':scope [data-box-id]')).filter((e) => e.parentElement.closest('[data-box-id]') === G).map((e) => e.getAttribute('data-box-id'));
          const r = S.getBoundingClientRect(); return { inImage: I.contains(S), cellAfterImage: kids.indexOf(s) === kids.indexOf(i) + 1, w: Math.round(r.width), h: Math.round(r.height) }; }, [grid, img, st]);
        const good = !m.inImage && m.cellAfterImage && m.w > 20 && m.h > 20;
        if (!good) { bad++; ok--; }
        console.log(`  try ${t + 1}: the clicked Stack is ${m.inImage ? 'INSIDE THE IMAGE' : 'not in the image'}, ${m.cellAfterImage ? 'the grid cell after it' : 'NOT the next cell'}, ${m.w}×${m.h}px — ${good ? 'OK' : 'WRONG'}`);
        await page.screenshot({ path: path.join(OUT, `try-${t + 1}-clicked-stack.png`) });
      }
      await attempt('drag-under-Stack', t, () => P.under(page, img, 'Stack'));
      last = grid;
    }
  } catch (e) { console.log('CRASH ' + e.message.split('\n')[0] + ' at ' + (page.__step || '?')); await page.screenshot({ path: path.join(OUT, 'crash.png') }).catch(() => {}); }
  // THE PREVIEW, as a visitor gets it, at four rungs: the grid's cells in order and none of them inside a picture.
  if (arg('preview', '0') === '1') try {
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click();
    await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500);
    await page.keyboard.press('h'); await page.waitForTimeout(400); // the bar floats over the page — step it aside
    for (const w of [375, 768, 1280, 1920]) {
      await page.setViewportSize({ width: w, height: 720 }); await page.waitForTimeout(600); // as uat-pages.js frameAt sizes it
      const fr = await (await page.$('iframe')).contentFrame();
      const m = await fr.evaluate(() => ({ imgKids: Array.from(document.querySelectorAll('img, picture')).filter((i) => i.children.length && i.querySelector('div,section')).length, overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 }));
      console.log(`  Preview ${w}: ${m.imgKids ? 'a block INSIDE a picture' : 'no block inside a picture'} · ${m.overflow ? 'SIDEWAYS OVERFLOW' : 'no sideways overflow'}`);
      if (m.imgKids || m.overflow) bad++;
      await page.screenshot({ path: path.join(OUT, `preview-${w}.png`) });
    }
  } catch (e) { console.log('  Preview check failed: ' + e.message.split('\n')[0]); }
  if (errs.length) console.log('page errors: ' + [...new Set(errs)].join(' | '));
  console.log(`L1-2: ${ok} landed, ${bad} failed`);
  await browser.close();
})();
