// L-3 c-11b — WHAT STORES A ROW OVER 100%? A row of four columns BUILT THROUGH THE UI (RULE Y) the way the tier-99 pages
// hold one — words in the first, one icon in each of the other three — dragged to the crawl's shares with the harness's own
// sizeColumns, then the stored widths and their sum read back. Six variants side by side (RULE Z).
//   NODE_PATH=node_modules DEBUG=1 node scripts/uat/probe-c11b.js
const H = require('./h.js'); const P = require('./pages.js').helpers; const { Builder } = require('./build-page.js');
const VARIANTS = [[70, 10, 10, 10], [70.04, 9.99, 10.14, 10.02], [60, 15, 15, 10], [10, 10, 10, 70], [40, 40, 10, 10], [25, 25, 40, 10]];
const stored = (page, ids) => page.evaluate((ids) => {
  const site = JSON.parse(localStorage.getItem('educo_box_site_v1') || '{}'); const out = {};
  const walk = (n) => { if (!n || typeof n !== 'object') return; if (ids.includes(n.id)) out[n.id] = { w: n.width, ml: n.marginLeftPct, hand: n.widthByHand }; for (const v of Object.values(n)) { if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') walk(v); } };
  walk(site); return ids.map((id) => out[id]);
}, ids);
async function one(shares, slot) {
  const { browser, page, errs } = await H.open({ headed: true, w: +(process.argv.find((x) => x.startsWith('--w=')) || '--w=1100').slice(4), h: 800, pos: [(slot % 3) * 620, Math.floor(slot / 3) * 520] });
  page.setDefaultTimeout(15000);
  try {
    await H.panel(page, true);
    const sec = await P.first(page, 'Stack');
    const cols = await P.row(page, sec, ['Stack', 'Stack', 'Stack']);
    await P.into(page, cols[0], 'Heading');
    for (const c of cols.slice(1)) await P.into(page, c, 'Icon');
    await new Builder(page).sizeColumns(cols, shares);
    // L3-p: the LIVE canvas vs the same tree RELOADED, at Tablet — each cell's computed flex and drawn width
    const cells = (ids) => page.evaluate((ids) => ids.map((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); const c = getComputedStyle(e); return `${id.slice(-3)} ${c.flexGrow}/${c.flexShrink} w${Math.round(e.getBoundingClientRect().width)}`; }).join(' · '), ids);
    if (process.argv.includes('--live')) {
      await page.getByRole('button', { name: /^Tablet/ }).first().click(); await page.waitForTimeout(800);
      const live = await cells(cols);
      await page.reload(); await page.waitForTimeout(2500); await page.getByRole('button', { name: /^Tablet/ }).first().click(); await page.waitForTimeout(800);
      const re = await cells(cols);
      console.log(`[${shares.join(' · ')}] Tablet LIVE   ${live}\n[${shares.join(' · ')}] Tablet RELOAD ${re}${live === re ? '   (same)' : '   ← DIFFERENT'}`);
    }
    const s = await stored(page, cols);
    const sum = s.reduce((t, k) => t + (parseFloat(k?.w) || 0) + (k?.ml ?? 0), 0);
    console.log(`[${shares.join(' · ')}] stored ${s.map((k) => `${k?.w}${k?.ml ? '+ml' + k.ml : ''}${k?.hand ? '(hand)' : ''}`).join(' · ')} = ${sum.toFixed(2)}%${sum > 100.001 ? '   ← OVER 100' : ''}${errs.length ? ' · page errors: ' + errs.join(' | ') : ''}`);
  } catch (e) { console.log(`[${shares.join(' · ')}] FAILED ${e.message.split('\n')[0]}`); }
  finally { await browser.close(); }
}
// --variants=0,1,2: a slice, when the machine has room for only some windows
const PICK = (process.argv.find((x) => x.startsWith('--variants=')) || '').split('=')[1]?.split(',').map(Number);
(async () => { await Promise.all(VARIANTS.map((v, i) => [v, i]).filter(([, i]) => !PICK || PICK.includes(i)).map(([v, i]) => one(v, i))); })();
