// Build ONE section structure through the UI (build-page.js) and print the stored tree and every row's lines.
//   node scripts/uat/probe-section.js "<width>|<structure>" [--w=1520]
const H = require('./h.js'); const G = require('./layout-grammar.js'); const { Builder } = require('./build-page.js');
const src = process.argv[2]; const w = +(process.argv.find((a) => a.startsWith('--w='))?.slice(4) ?? 1520);
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w, h: 720 });
  await H.panel(page, true);
  const b = new Builder(page, console.log); await b.page_(G.parsePage(src)); await H.panel(page, false);
  console.log(await H.tree(page));
  const rows = await page.evaluate(() => Array.from(document.querySelectorAll('[data-box-id]')).filter((e) => getComputedStyle(e).flexDirection === 'row').map((row) => ({ id: row.getAttribute('data-box-id').slice(-4), w: Math.round(row.getBoundingClientRect().width),
    kids: Array.from(row.children).filter((k) => k.hasAttribute('data-box-id')).map((k) => { const r = k.getBoundingClientRect(); return `${k.getAttribute('data-box-id').slice(-4)}@${Math.round(r.left - row.getBoundingClientRect().left)},${Math.round(r.top - row.getBoundingClientRect().top)}:${Math.round(r.width)}`; }).join(' ') })));
  rows.filter((r) => r.kids.includes(' ')).forEach((r) => console.log(`row ${r.id} (${r.w}px): ${r.kids}`));
  await H.shot(page, 'probe-section.png'); if (errs.length) console.log('errs', errs.join(' | '));
  await browser.close();
})();
