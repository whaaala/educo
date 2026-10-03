// HEADED PROBE (RULE Y) for L4-m — a grid in a band made with "Add a band" draws 5 across on the canvas and ONE PER LINE in
// the Preview. Built through the UI; in the Preview at 1280: the grid's columns, and every ancestor that is a size
// container (the box its @container rules measure), with its width.
//   NODE_PATH=node_modules node scripts/uat/probe-l4-m.js [--via=band|section] [--pos=0,0]
const H = require('./h.js'); const P = require('./pages.js').helpers;
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const VIA = arg('via', 'band'); const POS = arg('pos', '0,0').split(',').map(Number);
const look = (id) => { const g = document.querySelector(`.bx-${id}`) || document.querySelector(`[data-box-id="${id}"]`); if (!g) return null; const out = { cols: getComputedStyle(g).gridTemplateColumns.split(' ').length, w: Math.round(g.getBoundingClientRect().width), containers: [] };
  for (let e = g.parentElement; e; e = e.parentElement) { const c = getComputedStyle(e); if (c.containerType !== 'normal') out.containers.push(`${e.tagName.toLowerCase()}.${[...e.classList].slice(0, 2).join('.')} ${c.containerType} ${Math.round(e.getBoundingClientRect().width)}px`); }
  return out; };
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1240, h: 820, pos: POS }); page.setDefaultTimeout(15000);
  try {
    let host;
    if (VIA === 'band') { const before = await P.ids(page); await page.getByRole('button', { name: 'Add a band' }).first().click(); await page.waitForTimeout(700); host = (await P.newestLeaf(page, before)).id; }
    else { await H.panel(page, true); const sec = await P.first(page, 'Stack'); host = await P.into(page, sec, 'Stack'); }
    await H.panel(page, true); const before = await P.ids(page); await H.dropInto(page, 'Grid', host);
    await page.locator('[role="gridcell"][aria-label="5 across, 1 down"]').click(); await page.waitForTimeout(800);
    const g = (await P.newestLeaf(page, before)).id; await H.panel(page, false);
    await page.getByRole('button', { name: 'Desktop (1280px)' }).first().click(); await page.waitForTimeout(700);
    console.log('canvas ', JSON.stringify(await page.evaluate(look, g)));
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe'); await page.waitForTimeout(1500); await page.keyboard.press('h');
    await page.setViewportSize({ width: 1280, height: 820 }); await page.waitForTimeout(500);
    let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== 1280) { await page.setViewportSize({ width: 2560 - inner, height: 820 }); await page.waitForTimeout(400); f = await (await page.$('iframe')).contentFrame(); }
    console.log('preview', JSON.stringify(await f.evaluate(look, g.replace(/[^A-Za-z0-9_-]/g, '-'))));
    const rules = await f.evaluate((id) => Array.from(document.querySelectorAll('style')).map((s) => s.textContent).join('\n').split('@container').filter((r) => r.includes(id)).map((r) => r.slice(0, 160)), g.replace(/[^A-Za-z0-9_-]/g, '-'));
    console.log('queries', JSON.stringify(rules));
    await page.screenshot({ path: `scripts/uat/logs/uat-l4/m-${VIA}.png` });
  } catch (e) { console.log('FAILED', page.__step, e.message.split('\n')[0]); }
  console.log('page errors', errs.length); await browser.close();
})();
