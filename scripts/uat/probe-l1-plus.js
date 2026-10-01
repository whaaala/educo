// HEADED UAT — BATCH L-1 · L1-7 (tier-99 page 2 on the e-1 build): "the canvas offered the drop and added nothing
// (into, a Heading) · released at … on <svg> in block u-1x". An EMPTY Stack shows "+ Empty — drag a block in"; its "+" is a
// button holding an SVG. Built THROUGH THE UI: an empty Stack, then a Text dragged with a REAL mouse and released ON that
// "+" icon — repeated. E0-g's class (a drop delivered to an SVG the page re-rendered under the pointer) or not.
//   NODE_PATH=node_modules node scripts/uat/probe-l1-plus.js [--pos=0,0] [--tries=4] [--tile=Heading]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers;
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const OUT = path.join(__dirname, 'probe-l1-plus-out'); fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 720, pos: arg('pos', '0,0').split(',').map(Number) });
  page.setDefaultTimeout(12000); let ok = 0, bad = 0; const TILE = arg('tile', 'Heading');
  try {
    await H.panel(page, true);
    let last = await P.first(page, 'Stack'); await P.into(page, last, 'Heading');
    for (let t = 0; t < +arg('tries', '4'); t++) {
      const empty = await P.tileAfter(page, last, 'Stack'); last = empty;
      await H.panel(page, false); await page.keyboard.press('Escape'); await H.panel(page, true);
      const p = await page.evaluate((id) => { const b = document.querySelector(`[data-box-id="${id}"]`); b.scrollIntoView({ block: 'center' });
        const s = b.querySelector('button[aria-label="Choose a block to add inside"] svg'); if (!s) return null; const r = s.getBoundingClientRect(); return [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)]; }, empty);
      if (!p) { console.log(`  try ${t + 1}: no "+" icon in the empty Stack`); continue; }
      const before = await P.ids(page);
      await H.dropTile(page, TILE, p[0], p[1]);
      await page.waitForTimeout(600);
      const inside = await page.evaluate(([id, was]) => Array.from(document.querySelectorAll(`[data-box-id="${id}"] [data-box-id]`)).some((e) => !was.includes(e.getAttribute('data-box-id'))), [empty, [...before]]);
      if (inside) { ok++; console.log(`  try ${t + 1}: released on the "+" at ${p} — the ${TILE} landed INSIDE the empty Stack`); }
      else { bad++; console.log(`  try ${t + 1}: released on the "+" at ${p} (${page.__dropAt}) — offered ${page.__dropOffered}, NOTHING added inside`); await page.screenshot({ path: path.join(OUT, `fail-${t + 1}.png`) }); }
    }
  } catch (e) { console.log('CRASH ' + e.message.split('\n')[0] + ' at ' + (page.__step || '?')); }
  if (errs.length) console.log('page errors: ' + [...new Set(errs)].join(' | '));
  console.log(`L1-7: ${ok} landed, ${bad} lost`);
  await browser.close();
})();
