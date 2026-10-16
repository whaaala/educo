// HEADED (RULE Y) — L6-4: on a ROW OF THE PAGE the Custom width says a rem is drawn as a share; with a % it says nothing.
// Built through the UI: two stacks side by side on a page-grid page, the first selected, Width → Custom, "3rem" typed, then "25%".
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/probe-l6-4.js
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1440, h: 900, pos: [0, 0] }); page.setDefaultTimeout(15000); let bad = 0;
  const hint = () => page.getByText(/On the page grid a width is a share of the columns/).count();
  try {
    await H.panel(page, true); const a = await P.first(page, 'Stack'); await P.beside(page, a, 'Stack'); await H.panel(page, false);
    await I.customWidth(page, a, '3rem'); await page.waitForTimeout(300);
    const n1 = await hint(); console.log(`3rem on a page row: hint shown ${n1 > 0}`); if (!n1) bad++;
    await page.screenshot({ path: 'scripts/uat/logs/uat-l6/l6-4-hint.png' });
    const f = page.getByLabel('Custom width').first(); await f.fill('25%'); await f.blur(); await page.waitForTimeout(300);
    const n2 = await hint(); console.log(`25% on a page row: hint shown ${n2 > 0}`); if (n2) bad++;
  } catch (e) { bad++; console.log('FAILED', page.__step, e.message.split('\n')[0]); }
  console.log(`RESULT ${bad ? 'BAD' : 'ok'} · page errors ${errs.length}`); await browser.close();
})();
