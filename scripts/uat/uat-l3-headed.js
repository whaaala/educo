// HEADED UAT — BATCH L-3's pass (RULE X / Z): six windows side by side, each a theme, the page BUILT THROUGH THE UI (RULE Y).
// Per window: a heading, a Divider under it (R-23) with its thickness / colour set through the Inspector, a "table of ticks"
// row (words + three icon cells, c-11c: never rearranged on a tablet) and a row of four cells of words (rearranged 2 + 2).
// Then at Mobile 375 · Tablet 768 · Laptop 1024 · Desktop 1280 · Wide 1920, on the canvas AND in the Preview:
//   Divider: an <hr>, role separator, one line (height 0 + its top border), no UA margin, no inset side borders, the
//            thickness asked for, its colour, canvas == Preview
//   rows:    lines counted by overlap, as the audit does
//   NODE_PATH=node_modules node scripts/uat/uat-l3-headed.js
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const OUT = path.join(__dirname, 'logs', 'uat-l3'); fs.mkdirSync(OUT, { recursive: true });
const RUNGS = [[375, 'Mobile (375px)'], [768, 'Tablet (768px)'], [1024, 'Laptop (1024px)'], [1280, 'Desktop (1280px)'], [1920, 'Wide (1920px)']];
// six windows: every theme, two of them twice with a thick line so both a hairline and a heavy line are seen
const WINDOWS = [['Light', 1], ['Dark', 4], ['Midnight', 8], ['Purple Dream', 2], ['Light', 12], ['Dark', 20]];

// what a reader gets from the divider and the two rows, in one engine (canvas: data-box-id, Preview: .bx-<id>)
const read = ([engine, ids]) => {
  const el = (id) => engine === 'canvas' ? document.querySelector(`[data-box-id="${id}"]`) : document.querySelector(`.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')}`);
  const box = el(ids.div); const hr = box && (box.tagName === 'HR' ? box : box.querySelector('hr'));
  const Z = engine === 'canvas' ? (document.querySelector('[data-box-id]').closest('[data-canvas-scale]')?.dataset.canvasScale * 1 || 1) : 1;
  const lines = (rowId) => { const r = el(rowId); if (!r) return null; const ks = [...r.children].filter((k) => k.getBoundingClientRect().width > 0); const out = [];
    for (const k of ks) { const q = k.getBoundingClientRect(); const l = out.find((x) => q.top < x.b - 2 && q.bottom > x.t + 2); if (l) { l.n++; l.b = Math.max(l.b, q.bottom); } else out.push({ t: q.top, b: q.bottom, n: 1 }); }
    return out.map((x) => x.n).join('+'); };
  if (!hr) return { hr: null, ticks: lines(ids.ticks), words: lines(ids.words) };
  const c = getComputedStyle(hr); const r = hr.getBoundingClientRect();
  return { hr: hr.tagName, role: hr.getAttribute('role') || 'separator(implicit)', h: +(r.height / Z).toFixed(2), w: Math.round(r.width / Z),
    mt: c.marginTop, mb: c.marginBottom, top: `${c.borderTopWidth} ${c.borderTopStyle} ${c.borderTopColor}`, sides: [c.borderRightStyle, c.borderBottomStyle, c.borderLeftStyle].join('/'),
    ticks: lines(ids.ticks), words: lines(ids.words),
    // L3-r: the line starts level with the heading's words, at every thickness
    inset: Math.round((r.left - el(ids.head).getBoundingClientRect().left) / Z) };
};

async function one([theme, thick], slot) {
  const findings = []; const bad = (m) => { findings.push(m); console.log(`  [${theme} ${thick}px] FINDING ${m}`); };
  const { browser, page, errs } = await H.open({ headed: true, w: 1240, h: 820, pos: [(slot % 3) * 640, Math.floor(slot / 3) * 520] });
  page.setDefaultTimeout(15000);
  try {
    if (theme !== 'Light') { await page.getByRole('button', { name: 'Website theme' }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(theme) }).first().click(); await page.waitForTimeout(500); }
    await H.panel(page, true);
    const sec = await P.first(page, 'Stack'); const head = await P.into(page, sec, 'Heading');
    const div = await P.under(page, head, 'Divider');
    // the thickness through the Inspector's Thickness slider (keyboard: Home = 1, then Right × (thick - 1))
    // a person opens the Divider's Content tab, where its Line colour and Thickness live
    await H.panel(page, false); await H.select(page, div); await I.tab(page, 'Content');
    const slider = page.getByRole('slider', { name: /^Thickness/ }).first();
    await slider.scrollIntoViewIfNeeded(); await slider.focus(); await page.keyboard.press('Home'); for (let i = 1; i < thick; i++) await page.keyboard.press('ArrowRight');
    await H.panel(page, true);
    const ticks = await P.under(page, div, 'Stack'); const t = await P.row(page, ticks, ['Stack', 'Stack', 'Stack']);
    await P.into(page, t[0], 'Text'); for (const c of t.slice(1)) await P.into(page, c, 'Icon');
    // under the DIVIDER (above the ticks): "under" a cell of the ticks row drops INSIDE that cell
    const words = await P.under(page, div, 'Stack'); const w = await P.row(page, words, ['Stack', 'Stack', 'Stack']);
    for (const c of w) await P.into(page, c, 'Text');
    const rowOf = async (id) => page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).parentElement.closest('[data-box-id]').getAttribute('data-box-id'), id);
    const ids = { div, head, ticks: await rowOf(t[0]), words: await rowOf(w[0]) };
    await H.panel(page, false); await page.keyboard.press('Escape');
    const want = `${thick === 1 ? 1 : thick}`; const seen = {};
    const check = (where, wd, g) => {
      seen[`${where} ${wd}`] = g;
      if (g.hr !== 'HR') return bad(`${where} ${wd}: the Divider is not an <hr> (${g.hr})`);
      if (g.mt !== '0px' || g.mb !== '0px') bad(`${where} ${wd}: UA margin left on the <hr> (${g.mt} / ${g.mb})`);
      if (Math.abs(g.inset) > 1) bad(`${where} ${wd}: the line starts ${g.inset}px from the heading's words (L3-r)`);
      if (g.sides !== 'none/none/none') bad(`${where} ${wd}: inset side borders (${g.sides})`);
      if (Math.abs(parseFloat(g.top) - +want) > 0.6) bad(`${where} ${wd}: thickness ${g.top}, asked ${want}px`);
      if (g.ticks !== '4' && wd >= 600) bad(`${where} ${wd}: the table of ticks is ${g.ticks}, should stay one line (c-11c)`);
      if (wd >= 600 && wd < 900 && g.words !== '2+2') bad(`${where} ${wd}: four cells of words are ${g.words} on a tablet, not 2+2 (#78)`);
    };
    for (const [wd, preset] of RUNGS) { await page.getByRole('button', { name: preset }).first().click(); await page.waitForTimeout(700); check('canvas', wd, await page.evaluate(read, ['canvas', ids])); }
    await page.screenshot({ path: path.join(OUT, `${theme.replace(/\s/g, '')}-${thick}-canvas.png`) });
    // the accessibility tree: a separator, on the canvas
    if (!(await page.getByRole('separator').count())) bad('no separator in the accessibility tree (canvas)');
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500); await page.keyboard.press('h');
    for (const [wd] of RUNGS) {
      await page.setViewportSize({ width: wd, height: 820 }); await page.waitForTimeout(500);
      let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
      if (inner !== wd) { await page.setViewportSize({ width: 2 * wd - inner, height: 820 }); await page.waitForTimeout(400); f = await (await page.$('iframe')).contentFrame(); }
      const g = await f.evaluate(read, ['preview', ids]); check('Preview', wd, g);
      const c = seen[`canvas ${wd}`];
      if (c && (c.top !== g.top || Math.abs(c.h - g.h) > 0.6)) bad(`canvas ≠ Preview at ${wd}: ${c.top} h${c.h} vs ${g.top} h${g.h}`);
      if (wd === 1280) { await page.screenshot({ path: path.join(OUT, `${theme.replace(/\s/g, '')}-${thick}-preview.png`) }); if (!(await f.getByRole('separator').count())) bad('no separator in the accessibility tree (Preview)'); }
    }
    console.log(`[${theme} ${thick}px] ${findings.length ? findings.length + ' FINDINGS' : 'CLEAN'} · canvas 1280 ${JSON.stringify(seen['canvas 1280'])} · page errors ${errs.length}${errs.length ? ': ' + errs.join(' | ') : ''}`);
  } catch (e) { console.log(`[${theme} ${thick}px] FAILED at ${page.__step}: ${e.message.split('\n')[0]}`); await page.screenshot({ path: path.join(OUT, `${theme.replace(/\s/g, '')}-${thick}-FAILED.png`) }).catch(() => {}); }
  finally { await browser.close(); }
}
(async () => { await Promise.all(WINDOWS.map((w, i) => one(w, i))); })();
