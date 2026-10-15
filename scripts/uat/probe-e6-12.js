// E6-12: a Heading at the very top of a page made now (no space) moves ~1px up when made Floating. Built through the UI.
const H = require('./h.js');
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1280, h: 900 });
  await H.panel(page, true); await H.clickTile(page, 'Heading'); await H.panel(page, false); await page.waitForTimeout(500);
  const id = await page.evaluate(() => [...document.querySelectorAll('[data-box-id]')].pop().dataset.boxId);
  await H.select(page, id);
  const at = () => page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); const r = e.getBoundingClientRect(); const p = e.parentElement.closest('[data-box-id]'); const pr = p?.getBoundingClientRect();
    return { y: +r.top.toFixed(2), x: +r.left.toFixed(2), h: +r.height.toFixed(2), parent: p?.dataset.boxId.slice(-4), parentTop: pr && +pr.top.toFixed(2), parentH: pr && +pr.height.toFixed(2), style: { top: e.style.top, left: e.style.left, position: getComputedStyle(e).position } }; }, id);
  const a = await at(); console.log('before', JSON.stringify(a));
  let fl = page.getByRole('button', { name: 'Floating', exact: true }).first();
  if (!(await fl.isVisible())) { await page.getByRole('button', { name: /^Placement/ }).first().click(); fl = page.getByRole('button', { name: 'Floating', exact: true }).first(); }
  await fl.scrollIntoViewIfNeeded(); await fl.click();
  for (const t of [50, 200, 600]) { await page.waitForTimeout(t); console.log(`after +${t}ms`, JSON.stringify(await at())); }
  const stored = await page.evaluate((id) => { for (const k of Object.keys(localStorage)) { const v = localStorage.getItem(k); const i = v?.indexOf(id); if (i > 0) return v.slice(i - 10, i + 400); } return null; }, id);
  console.log('stored', stored?.match(/"top":[^,]*|"left":[^,]*|"position":[^,]*/g));
  console.log('errors', errs); await browser.close();
})();
