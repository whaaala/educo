// PROBE (LE-10, HEADED pass 1): at 375 / 768 a click timed out after selecting a nested block — which button, and what covers it?
const H = require('./h.js');
const { sleep, band, into } = require('./uat-rx3-headed.js');
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1366, h: 860 });
  const st = await band(page, 'Stack'); const sbs = await into(page, st, 'Side by side'); const h = await into(page, sbs, 'Heading'); await H.panel(page, false);
  for (const w of [1366, 768, 375, 1366, 375]) {
    await page.setViewportSize({ width: w, height: 860 }); await sleep(page, 600);
    await H.select(page, h);
    const btns = await page.getByRole('button', { name: /inspector/i }).evaluateAll((bs) => bs.map((b) => { const r = b.getBoundingClientRect(); const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return { name: b.getAttribute('aria-label'), r: [r.x, r.y, r.width, r.height].map(Math.round), coveredBy: top === b || b.contains(top) ? null : (top?.outerHTML || '').slice(0, 160) }; }));
    const aside = await page.locator('aside[aria-label="Inspector"]').evaluate((a) => { const r = a.getBoundingClientRect(); return { r: [r.x, r.y, r.width, r.height].map(Math.round), vis: getComputedStyle(a).visibility }; }, undefined, { timeout: 3000 }).catch((e) => e.message.split('\n')[0]);
    const t = page.getByRole('button', { name: 'Expand inspector' }); const vis = await t.isVisible();
    const res = await t.click({ trial: true, timeout: 3000 }).then(() => 'clickable', (e) => e.message.split('\n').filter((l) => /intercept|visible|stable|viewport|outside|Timeout/.test(l)).slice(0, 4).join(' / '));
    console.log(w, JSON.stringify({ vis, btns, aside, res })); if (res === 'clickable') { await t.click(); await sleep(page, 400); }
    await page.screenshot({ path: `scripts/uat/logs/le10/probe-${w}.png` });
  }
  await browser.close();
})();
