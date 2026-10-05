// PROBE G-1 #15 — four Stats on a page-grid row wrap 3 + 1 at ≈ 600px in the Preview. Built through the UI, measured.
//   NODE_PATH=node_modules node scripts/uat/probe-g1-stats.js
const H = require('./h.js'); const P = require('./pages.js').helpers;
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1240, h: 820 });
  try {
    await H.panel(page, true);
    const s1 = await P.first(page, 'Stack'); await P.into(page, s1, 'Stat');
    let prev = s1; for (let i = 0; i < 3; i++) { const s = await P.beside(page, prev, 'Stack'); await P.into(page, s, 'Stat'); prev = s; }
    await H.panel(page, false);
    const row = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).parentElement.closest('[data-box-id]').getAttribute('data-box-id'), s1);
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe'); await page.waitForTimeout(1500); await page.keyboard.press('h');
    for (const wd of [560, 600, 640, 700]) {
      await page.setViewportSize({ width: wd, height: 800 }); await page.waitForTimeout(500);
      let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
      if (inner !== wd) { await page.setViewportSize({ width: 2 * wd - inner, height: 800 }); await page.waitForTimeout(300); f = await (await page.$('iframe')).contentFrame(); }
      const m = await f.evaluate((id) => {
        const band = document.querySelector(`.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')}`); const br = band.getBoundingClientRect(); const cs = getComputedStyle(band);
        const host = band.parentElement; const hr = host.getBoundingClientRect();
        const cols = [...band.children].map((k) => { const r = k.getBoundingClientRect(); const v = k.querySelector('h1,h2,h3,h4,h5,h6,[class*="value"]'); const vr = v && document.createRange(); if (vr) vr.selectNodeContents(v);
          return { top: Math.round(r.top), w: +r.width.toFixed(1), minW: getComputedStyle(k).minWidth, flex: getComputedStyle(k).flex, num: vr ? +vr.getBoundingClientRect().width.toFixed(1) : null, numFont: v && getComputedStyle(v).fontSize }; });
        const rules = []; for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) if (r.conditionText && r.cssText.includes(id.replace(/[^A-Za-z0-9_-]/g, '-').slice(-4))) rules.push(r.conditionText); } catch {} }
        return { band: { w: +br.width.toFixed(1), padL: cs.paddingLeft, ctype: cs.containerType }, host: { w: +hr.width.toFixed(1), ctype: getComputedStyle(host).containerType }, rem: parseFloat(getComputedStyle(document.documentElement).fontSize), cols, queries: [...new Set(rules)] };
      }, row);
      console.log(wd, JSON.stringify(m));
    }
  } finally { await browser.close(); }
})();
