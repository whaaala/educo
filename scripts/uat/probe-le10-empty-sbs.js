// PROBE (LE10-4): on a phone an empty Side by side dropped into a Stack measured 0 px wide, so nothing could be dropped into it.
// Built through the UI at the phone's width, with and without touch; its box, its band's box, the stored node, a screenshot.
const { chromium } = require('playwright');
const H = require('./h.js');
const { sleep, band, into, nodeOf } = require('./uat-rx3-headed.js');
const BASE = process.env.BASE || 'http://localhost:3100';
async function run(name, opts, build) {
  const browser = await chromium.launch({ headless: false, args: ['--force-device-scale-factor=1'] });
  const ctx = await browser.newContext({ deviceScaleFactor: 1, ...opts }); const page = await ctx.newPage();
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('kept')) { localStorage.clear(); sessionStorage.setItem('kept', '1'); } } catch {} });
  await page.goto(BASE + '/website/box-demo'); await page.waitForFunction(() => !!document.querySelector('[data-box-id]'), null, { timeout: 60000 }); await sleep(page, 1500);
  try {
    const st = await band(page, 'Stack'); let sbs;
    if (build === 'into') sbs = await into(page, st, 'Side by side');
    else { await page.setViewportSize({ width: 1366, height: 860 }); await sleep(page, 500); sbs = await into(page, st, 'Side by side'); await page.setViewportSize(opts.viewport); await sleep(page, 600); }
    await H.panel(page, false); await sleep(page, 400);
    const m = await page.evaluate(([s, b]) => { const r = (id) => { const e = document.querySelector(`[data-box-id="${id}"]`); if (!e) return null; const q = e.getBoundingClientRect(); return [q.x, q.y, q.width, q.height].map(Math.round); }; return { stack: r(s), sbs: r(b) }; }, [st, sbs]);
    console.log(name, build, JSON.stringify(m), JSON.stringify(await nodeOf(page, sbs)).slice(0, 300));
  } catch (e) { console.log(name, build, 'ERROR', e.message.split('\n')[0]); }
  await page.screenshot({ path: `scripts/uat/logs/le10/probe-sbs-${name}-${build}.png` });
  await browser.close();
}
(async () => {
  await Promise.all([
    run('touch393', { viewport: { width: 393, height: 851 }, isMobile: true, hasTouch: true }, 'into'),
    run('mouse375', { viewport: { width: 375, height: 860 } }, 'into'),
    run('mouse768', { viewport: { width: 768, height: 860 } }, 'into'),
    run('touch393', { viewport: { width: 393, height: 851 }, isMobile: true, hasTouch: true }, 'wide'),
  ]);
})();
