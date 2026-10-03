// L-3 L3-p — A WRAPPED CELL DRAWN AT ITS FLOOR ON THE LIVE CANVAS, FILLING ITS LINE AFTER A RELOAD. Page 223's shape BUILT
// THROUGH THE UI (RULE Y): a row of words + 3 icon cells inside a MAIN column beside a sidebar, sized with the harness's
// own sizeColumns (which widens to Desktop when the row is wrapped, drags, then goes back to Full width). Each cell is
// measured as a SHARE of its row (zoom-free — the canvas zoom changes on reload), with its computed flex and min-width,
// at every rung, LIVE and then RELOADED. Six variants side by side (RULE Z).
//   NODE_PATH=node_modules BASE=http://localhost:3400 node scripts/uat/probe-l3p.js
const H = require('./h.js'); const P = require('./pages.js').helpers; const { Builder } = require('./build-page.js');
// [main share, sidebar share | null = no sidebar, the row's shares]
const VARIANTS = [[70, 30, [70, 10, 10, 10]], [75, 25, [70, 10, 10, 10]], [66, 34, [70, 10, 10, 10]], [null, null, [70, 10, 10, 10]], [70, 30, [60, 15, 15, 10]], [70, 30, [40, 40, 10, 10]]];
const RUNGS = [/^Tablet/, /^Laptop/, /^Desktop/, /^Wide/];
const cells = (page, ids) => page.evaluate((ids) => ids.map((id) => {
  const e = document.querySelector(`[data-box-id="${id}"]`); const row = e.parentElement.getBoundingClientRect(); const r = e.getBoundingClientRect(); const c = getComputedStyle(e);
  return `${(100 * r.width / row.width).toFixed(1)}%[${c.flex}|min ${c.minWidth}${e.style.cssText.match(/flex[^;]*/g) ? '' : ''}]`;
}).join(' '), ids);
async function at(page, ids) { const out = []; for (const r of RUNGS) { await page.getByRole('button', { name: r }).first().click(); await page.waitForTimeout(700); out.push(`${r.source.slice(1)} ${await cells(page, ids)}`); } return out; }
async function one([mainS, sideS, shares], slot) {
  const tag = `[${mainS ?? 'flat'}/${sideS ?? '-'} · ${shares.join('·')}]`;
  const { browser, page, errs } = await H.open({ headed: true, w: 1100, h: 800, pos: [(slot % 3) * 620, Math.floor(slot / 3) * 520] });
  page.setDefaultTimeout(15000);
  try {
    await H.panel(page, true);
    const sec = await P.first(page, 'Stack');
    let host = sec;
    if (mainS) {
      const cols = await P.row(page, await P.into(page, sec, 'Stack'), ['Stack']);
      await P.into(page, cols[1], 'Text'); // the sidebar holds words, like 223's aside
      await new Builder(page).sizeColumns(cols, [mainS, sideS]);
      host = cols[0];
    }
    const first = await P.into(page, host, 'Stack');
    const cols = await P.row(page, first, ['Stack', 'Stack', 'Stack']);
    await P.into(page, cols[0], process.env.FIRST || 'Stat');
    for (const c of cols.slice(1)) await P.into(page, c, 'Icon');
    const b = new Builder(page); await b.sizeColumns(cols, shares);
    console.log(`${tag} gaps: ${(page.__gaps || []).join(' | ') || 'none'} · widened ${page.__widerToSize || 0}`);
    const live = await at(page, cols);
    await page.reload(); await page.waitForTimeout(2500);
    const re = await at(page, cols);
    live.forEach((l, i) => console.log(`${tag} LIVE   ${l}\n${tag} RELOAD ${re[i]}${l === re[i] ? '   (same)' : '   ← DIFFERENT'}`));
    if (errs.length) console.log(`${tag} page errors: ${errs.join(' | ')}`);
    await page.screenshot({ path: `scripts/uat/logs/l3p-${slot}.png` });
  } catch (e) { console.log(`${tag} FAILED ${e.message.split('\n')[0]}`); await page.screenshot({ path: `scripts/uat/logs/l3p-${slot}-fail.png` }).catch(() => {}); }
  finally { await browser.close(); }
}
const PICK = (process.argv.find((x) => x.startsWith('--variants=')) || '').split('=')[1]?.split(',').map(Number);
(async () => { await Promise.all(VARIANTS.map((v, i) => [v, i]).filter(([, i]) => !PICK || PICK.includes(i)).map(([v, i]) => one(v, i))); })();
