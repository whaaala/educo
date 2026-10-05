// HEADED PROBE (RULE Y): two blocks the sweep kept flagging, built through the UI and measured in both engines —
//   A · a LIST block: 8px taller on the canvas than in the Preview on every page (ul/li margins, padding, line-height)
//   B · four STATS in a 70% main column: the number "1,000+" broke across lines although the column has a min-content floor
//   NODE_PATH=node_modules node scripts/uat/probe-t5.js
const fs = require('fs'); const path = require('path');
const H = require('./h.js'); const P = require('./pages.js').helpers; const { Builder } = require('./build-page.js');
const OUT = path.join(__dirname, 'probe-t5-out'); fs.mkdirSync(OUT, { recursive: true });
const measure = (engine) => (function () {
  const q = engine === 'canvas' ? '[data-box-id]' : '[class*="bx-"]';
  const idOf = (e) => engine === 'canvas' ? e.getAttribute('data-box-id') : (Array.from(e.classList).find((c) => c.startsWith('bx-')) || '').slice(3);
  const pick = (cs, keys) => Object.fromEntries(keys.map((k) => [k, cs[k]]));
  const out = { lists: [], stats: [] };
  for (const ul of Array.from(document.querySelectorAll('ul, ol'))) { const b = ul.closest(q); if (!b) continue; const li = ul.querySelector('li'); if (!li) continue;
    out.lists.push({ block: idOf(b).slice(-4), blockH: Math.round(b.getBoundingClientRect().height), ulH: Math.round(ul.getBoundingClientRect().height), ul: pick(getComputedStyle(ul), ['marginTop', 'marginBottom', 'paddingTop', 'paddingBottom', 'paddingLeft', 'lineHeight', 'fontSize', 'rowGap', 'display']), li: pick(getComputedStyle(li), ['marginTop', 'marginBottom', 'paddingTop', 'paddingBottom', 'lineHeight', 'fontSize', 'display']), liH: Math.round(li.getBoundingClientRect().height), items: ul.children.length, wrapperChildren: Array.from(b.children).map((c) => c.tagName + (c.className ? '.' + String(c.className).split(' ').slice(0, 2).join('.') : '') + ':' + Math.round(c.getBoundingClientRect().height)) }); }
  for (const v of Array.from(document.querySelectorAll('.eu-stat__value'))) { const stat = v.closest('.eu-stat'); const b = v.closest(q); const col = b && b.parentElement ? b.parentElement.closest(q) : null;
    const r = v.getBoundingClientRect(); const lines = new Set(); const rng = document.createRange(); rng.selectNodeContents(v); for (const x of Array.from(rng.getClientRects())) lines.add(Math.round(x.top));
    out.stats.push({ block: b ? idOf(b).slice(-4) : '?', text: (v.textContent || '').trim(), valueW: Math.round(r.width), lines: lines.size, fontSize: getComputedStyle(v).fontSize, statW: Math.round(stat.getBoundingClientRect().width), stat: pick(getComputedStyle(stat), ['containerType', 'minWidth', 'width', 'display']), blockW: b ? Math.round(b.getBoundingClientRect().width) : null, block: b ? pick(getComputedStyle(b), ['minWidth', 'flex', 'width', 'overflow', 'containerType']) : null, col: col ? { id: idOf(col).slice(-4), w: Math.round(col.getBoundingClientRect().width), ...pick(getComputedStyle(col), ['minWidth', 'flex', 'width']) } : null }); }
  return out;
})();

(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1520, h: 720, pos: [0, 0] });
  page.setDefaultTimeout(10000); const R = {};
  try {
    await H.panel(page, true);
    const sec = await P.first(page, 'Stack');
    const main = await P.into(page, sec, 'Stack'); const aside = await P.beside(page, main, 'Stack');
    const list = await P.into(page, aside, 'List'); void list;
    const b = new Builder(page); await b.sizeColumns([main, aside], [70, 30]); await H.panel(page, true);
    const c0 = await P.into(page, main, 'Stack'); const cols = await P.row(page, c0, ['Stack', 'Stack', 'Stack']);
    for (const c of cols) await P.into(page, c, 'Stat');
    await H.panel(page, false);
    await page.getByRole('button', { name: 'Desktop (1280px)' }).first().click(); await page.waitForTimeout(700);
    R.canvas = await page.evaluate(measure, 'canvas');
    await page.screenshot({ path: path.join(OUT, 'canvas.png') });
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click();
    await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500); await page.keyboard.press('h'); await page.waitForTimeout(400);
    await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(500);
    let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== 1280) { await page.setViewportSize({ width: 1280 + (1280 - inner), height: 900 }); await page.waitForTimeout(400); f = await (await page.$('iframe')).contentFrame(); }
    R.preview = await f.evaluate(measure, 'preview');
    await page.screenshot({ path: path.join(OUT, 'preview.png') });
  } catch (e) { R.crash = e.message; await page.screenshot({ path: path.join(OUT, 'crash.png') }).catch(() => {}); }
  fs.writeFileSync(path.join(OUT, 'probe.json'), JSON.stringify(R, null, 1));
  console.log(JSON.stringify(R, null, 1));
  await browser.close();
})();
