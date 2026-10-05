// L-3 L3-t — canvas ≠ Preview in HEIGHT on page 333 at Mobile. The page's saved final tree (built through the UI by
// uat-pages, RULE Y: it only pins that repro), at canvas Mobile and in the Preview at 375: every block's height on both,
// and the SOURCES — blocks that differ while none of their children do (ancestors only inherit the gap).
//   NODE_PATH=node_modules BASE=… node scripts/uat/probe-l3t.js [--page=333] [--w=375] [--tree=final.site]
const fs = require('fs'); const path = require('path'); const H = require('./h.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const PG = arg('page', '333'), W = +arg('w', '375');
const PRESET = { 375: 'Mobile', 768: 'Tablet', 1024: 'Laptop', 1280: 'Desktop', 1920: 'Wide' };
(async () => {
  const site = fs.readFileSync(path.join(__dirname, 'dressed99-out', `page-${PG}.${arg('tree', 'final.site')}.json`), 'utf8');
  const { browser, page } = await H.open({ headed: true, w: 1520, h: 900 });
  await page.evaluate((s) => localStorage.setItem('educo_box_site_v1', s), site); await page.reload(); await page.waitForTimeout(3000);
  await page.getByRole('button', { name: new RegExp('^' + PRESET[W]) }).first().click(); await page.waitForTimeout(900);
  // canvas: id → height (layout px), its block-children ids, and what it is
  const canvas = await page.evaluate(() => {
    const Z = document.querySelector('[data-box-id]').closest('[data-canvas-scale]')?.dataset.canvasScale * 1 || 1; const out = {};
    for (const e of document.querySelectorAll('[data-box-id]')) {
      const id = e.dataset.boxId.replace(/[^A-Za-z0-9_-]/g, '-');
      const kids = [...e.querySelectorAll('[data-box-id]')].filter((k) => k.parentElement.closest('[data-box-id]') === e).map((k) => k.dataset.boxId.replace(/[^A-Za-z0-9_-]/g, '-'));
      out[id] = { h: e.getBoundingClientRect().height / Z, kids, what: (e.textContent || '').trim().slice(0, 40), cs: (() => { const c = getComputedStyle(e); return `pad ${c.paddingTop}/${c.paddingBottom} mar ${c.marginTop}/${c.marginBottom} lh ${c.lineHeight} fs ${c.fontSize}`; })() };
    }
    return out;
  });
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click();
  await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500);
  await page.keyboard.press('h'); await page.waitForTimeout(300);
  await page.setViewportSize({ width: W, height: 900 }); await page.waitForTimeout(600);
  let f = await (await page.$('iframe')).contentFrame();
  const inner = await f.evaluate(() => document.documentElement.clientWidth);
  if (inner !== W) { await page.setViewportSize({ width: W + (W - inner), height: 900 }); await page.waitForTimeout(400); f = await (await page.$('iframe')).contentFrame(); }
  const prev = await f.evaluate(() => { const out = {}; for (const e of document.querySelectorAll('[class*="bx-"]')) { const id = ([...e.classList].find((c) => c.startsWith('bx-')) || '').slice(3); const c = getComputedStyle(e); out[id] = { h: e.getBoundingClientRect().height, cs: `pad ${c.paddingTop}/${c.paddingBottom} mar ${c.marginTop}/${c.marginBottom} lh ${c.lineHeight} fs ${c.fontSize}` }; } return out; });
  const diff = (id) => canvas[id] && prev[id] && Math.abs(canvas[id].h - prev[id].h) > 4;
  const sources = Object.keys(canvas).filter((id) => diff(id) && !canvas[id].kids.some(diff));
  console.log(`page ${PG} at ${W}: ${Object.keys(canvas).filter(diff).length} blocks differ in height; ${sources.length} sources`);
  for (const id of sources.slice(0, 12)) console.log(`  ${id.slice(-6)} canvas ${canvas[id].h.toFixed(1)} vs preview ${prev[id].h.toFixed(1)} · "${canvas[id].what}"\n     canvas  ${canvas[id].cs}\n     preview ${prev[id].cs}`);
  await browser.close();
})();
