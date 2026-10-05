// HEADED PROBE (RULE Y): an OVER-LONG drag on a line of four — does the edge stop where the partner runs out (rule 19),
// or is nothing written at all? Builds a section with four equal columns through the UI, drags the first column's right
// edge far past what its neighbour can give, and prints the stored widths before and after.
//   NODE_PATH=node_modules node scripts/uat/probe-t4.js [--dx=150]
const fs = require('fs'); const path = require('path');
const H = require('./h.js'); const P = require('./pages.js').helpers;
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
const OUT = path.join(__dirname, 'probe-t4-out'); fs.mkdirSync(OUT, { recursive: true });
const stored = (page, ids) => page.evaluate((ids) => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const out = {}; const walk = (n) => { if (ids.includes(n.id)) out[n.id.slice(-4)] = { width: n.width, byHand: !!n.widthByHand }; for (const c of n.children || []) walk(c); }; walk(s.pages[0].root); return out; }, ids);
const drawn = (page, ids) => page.evaluate((ids) => ids.map((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); const r = e.getBoundingClientRect(); const p = e.parentElement.getBoundingClientRect(); return `${id.slice(-4)}:${Math.round(r.left - p.left)}+${Math.round(r.width)}@top${Math.round(r.top - p.top)}`; }), ids);

(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1520, h: 720, pos: [0, 0] });
  page.setDefaultTimeout(10000); const R = {};
  try {
    await H.panel(page, true);
    const sec = await P.first(page, 'Stack');
    const c0 = await P.into(page, sec, 'Stack'); const cols = await P.row(page, c0, ['Stack', 'Stack', 'Stack']);
    for (const c of cols) await P.into(page, c, 'Text');
    await H.panel(page, false);
    R.before = { stored: await stored(page, cols), drawn: await drawn(page, cols) };
    await H.select(page, cols[0]);
    const dx = +arg('dx', 150);
    await H.dragEdge(page, 'right', dx); await page.waitForTimeout(600);
    R.after = { dx, stored: await stored(page, cols), drawn: await drawn(page, cols) };
    // …and a modest drag, for comparison
    await H.select(page, cols[0]); await H.dragEdge(page, 'right', 40); await page.waitForTimeout(600);
    R.afterSmall = { dx: 40, stored: await stored(page, cols), drawn: await drawn(page, cols) };
    await page.screenshot({ path: path.join(OUT, 'after.png') });
  } catch (e) { R.crash = e.message; await page.screenshot({ path: path.join(OUT, 'crash.png') }).catch(() => {}); }
  fs.writeFileSync(path.join(OUT, 'probe.json'), JSON.stringify(R, null, 1));
  console.log(JSON.stringify(R, null, 1));
  await browser.close();
})();
