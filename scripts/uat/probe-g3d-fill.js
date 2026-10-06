// PROBE G3d-5 — why a photo two rows tall does not fill its block on the canvas. Built through the UI (RULE Y), then the computed
// chain block → band → picture box → picture is printed, on the canvas and in the Preview.
//   NODE_PATH=node_modules node scripts/uat/probe-g3d-fill.js
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1240, h: 820 });
  await H.panel(page, true);
  const ph = await P.first(page, 'Stack'); const img = await P.into(page, ph, 'Image');
  const a = await P.beside(page, ph, 'Stack'); const ta = await P.into(page, a, 'Text');
  const b = await P.beside(page, a, 'Stack'); const tb = await P.into(page, b, 'Text');
  await H.panel(page, false); await H.fillImages(page);
  await I.text(page, ta, 'Our school opened in 1987 with forty pupils and two classrooms. Today more than six hundred children learn here, from nursery to the final year.');
  for (const t of [ta, tb]) await I.text(page, t, 'Our school opened in 1987 with forty pupils and two classrooms. Today more than six hundred children learn here, from nursery to the final year, taught by teachers who know every one of them by name. Parents are welcome every Friday.');
  await page.getByRole('button', { name: 'Desktop (1280px)' }).first().click(); await page.waitForTimeout(600);
  for (const id of [ph, a, b]) { await H.select(page, id); await I.tab(page, 'Design'); await I.section(page, 'Size'); await page.getByRole('group', { name: 'Width' }).getByRole('button', { name: 'Custom' }).click(); const f = page.getByLabel('Custom width', { exact: true }).first(); await f.fill('50%'); await f.blur(); await page.waitForTimeout(400); }
  await H.select(page, ph); await I.tab(page, 'Design'); await I.section(page, 'Size'); const r = page.getByLabel('Rows tall', { exact: true }).first(); await r.fill('2'); await r.blur(); await page.waitForTimeout(800);
  const chain = (doc, sel) => doc.evaluate((sel) => {
    const out = []; let e = document.querySelector(sel);
    for (let i = 0; e && i < 8; i++, e = e.parentElement) { const s = getComputedStyle(e), q = e.getBoundingClientRect();
      out.push(`${e.tagName.toLowerCase()}${e.getAttribute('data-box-id') ? '#' + e.getAttribute('data-box-id').slice(-5) : ''}.${(e.className && e.className.baseVal === undefined ? e.className : '').toString().slice(0, 40)} h=${q.height.toFixed(0)} disp=${s.display} dir=${s.flexDirection} flex=${s.flex} alignSelf=${s.alignSelf} height=${e.style.height} --bx-fill=${s.getPropertyValue('--bx-fill')}`); }
    return out;
  }, sel);
  console.log('CANVAS'); console.log((await page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"] img`); return !!e; }, img)));
  console.log((await chain(page, `[data-box-id="${img}"] img`)).join('\n'));
  console.log('block b bottom', (await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect().bottom, b)).toFixed(0));
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe'); await page.waitForTimeout(1500);
  const f = await (await page.$('iframe')).contentFrame();
  console.log('PREVIEW'); console.log((await chain(f, `.bx-${img.replace(/[^A-Za-z0-9_-]/g, '-')} img`)).join('\n'));
  await browser.close();
})();
