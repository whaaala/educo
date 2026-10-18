// PROBE (LE10-4): at 768, where does the drag-into helper aim on an empty Stack, and what covers the rest of it?
const H = require('./h.js');
const { sleep, band } = require('./uat-rx3-headed.js');
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 768, h: 860 });
  const st = await band(page, 'Stack'); await H.panel(page, true); await sleep(page, 600);
  const box = await page.evaluate((id) => { const r = document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); return [r.left, r.right].map(Math.round); }, st);
  const r = await H.reach(page, st);
  const panel = await page.evaluate(() => { const e = [...document.querySelectorAll('[draggable="true"]')][0]?.closest('aside,[role="dialog"],section'); const q = e?.getBoundingClientRect(); return q ? [q.left, q.right].map(Math.round) : null; });
  console.log(JSON.stringify({ stack: box, visible: { l: Math.round(r.l), w: Math.round(r.w) }, aimX: Math.round(r.l + r.w / 2), rightStripFrom: box[1] - 48, panel }));
  await page.screenshot({ path: 'scripts/uat/logs/le10/probe-reach-768.png' });
  await browser.close();
})();
