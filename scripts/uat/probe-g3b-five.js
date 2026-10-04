// PROBE G3b-5: five cards built through the UI — where do they sit in the Preview at each width? (headed)
const H = require('./h.js'); const P = require('./pages.js').helpers;
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1240, h: 820, pos: [0, 0] });
  await H.panel(page, true);
  const cols = [await P.first(page, 'Stack')]; for (let i = 0; i < 4; i++) cols.push(await P.beside(page, cols[cols.length - 1], 'Stack'));
  for (const c of cols) await P.into(page, c, 'Card');
  await H.panel(page, false);
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe'); await page.waitForTimeout(1200); await page.keyboard.press('h');
  for (const w of [700, 850, 899, 900, 950, 1100, 1199, 1200, 1280, 1536]) {
    await page.setViewportSize({ width: w, height: 800 }); await page.waitForTimeout(300);
    let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== w) { await page.setViewportSize({ width: 2 * w - inner, height: 800 }); await page.waitForTimeout(250); f = await (await page.$('iframe')).contentFrame(); }
    const r = await f.evaluate((ids) => ids.map((id) => { const e = document.querySelector(`.bx-${id}`); const q = e.getBoundingClientRect(); return `${Math.round(q.left)}+${Math.round(q.width)}@${Math.round(q.top)} ${getComputedStyle(e).gridColumnEnd}`; }), cols);
    console.log(w, r.join(' | '));
  }
  await browser.close();
})();
