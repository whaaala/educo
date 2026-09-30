// HEADED UAT — E0-g (tier-99 page 337): "the canvas offered the drop and added nothing" into an empty coloured Stack at
// the end of a section. The section rebuilt THROUGH THE UI as the page had it: a Stack holding a Heading, a Stack of two
// Texts, and an empty coloured Stack; then a Text dragged into that empty Stack. Repeated, to see if it is every time.
//   NODE_PATH=node_modules node scripts/uat/probe-e0g.js [--pos=0,0] [--tries=3]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const OUT = path.join(__dirname, 'probe-e0g-out'); fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const pos = arg('pos', '0,0').split(',').map(Number);
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 720, pos });
  page.setDefaultTimeout(12000); let ok = 0, bad = 0;
  try {
    await H.panel(page, true);
    const head0 = await P.first(page, 'Stack'); await P.into(page, head0, 'Heading'); // a first section above, as on the page
    for (let t = 0; t < +arg('tries', '3'); t++) {
      const sec = await P.tileAfter(page, head0, 'Stack');
      const h = await P.into(page, sec, 'Heading');
      const inner = await P.under(page, h, 'Stack'); const a = await P.into(page, inner, 'Text'); await P.under(page, a, 'Text');
      const empty = await P.under(page, inner, 'Stack');
      await H.panel(page, false); await I.background(page, empty, '#fde8e8'); await page.keyboard.press('Escape'); await H.panel(page, true);
      try { await P.into(page, empty, 'Text'); ok++; console.log(`  try ${t + 1}: the Text landed in the coloured Stack`); }
      catch (e) { bad++; console.log(`  try ${t + 1}: FAILED — ${e.message.split('\n')[0]}`); await page.screenshot({ path: path.join(OUT, `fail-${t + 1}.png`) }); fs.writeFileSync(path.join(OUT, `fail-${t + 1}-tree.txt`), await H.tree(page)); }
    }
  } catch (e) { console.log('CRASH ' + e.message.split('\n')[0] + ' at ' + (page.__step || '?')); await page.screenshot({ path: path.join(OUT, 'crash.png') }).catch(() => {}); }
  if (errs.length) console.log('page errors: ' + [...new Set(errs)].join(' | '));
  console.log(`E0-g: ${ok} landed, ${bad} failed`);
  await browser.close();
})();
