// HEADED UAT — the user's CHECK (2026-09-30, from a screenshot of the E-0 run: "Meet the team", star icons in columns as
// tall as the quotes beside them): a block dropped UNDER an icon in a grid cell lands under it IN THAT CELL — not as a
// new cell — on the canvas and in the Preview at every rung. Built THROUGH THE UI.
//   NODE_PATH=node_modules node scripts/uat/probe-icon-cell.js [--theme=Light] [--pos=0,0]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers;
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const THEME = arg('theme', 'Light');
const OUT = path.join(__dirname, 'probe-icon-cell-out', THEME.replace(/\s/g, '')); fs.mkdirSync(OUT, { recursive: true });
const RUNGS = [[375, 'Mobile (375px)'], [768, 'Tablet (768px)'], [1024, 'Laptop (1024px)'], [1280, 'Desktop (1280px)'], [1920, 'Wide (1920px)']];
const findings = []; const bad = (m) => { findings.push(m); console.log('  FINDING ' + m); }; const ok = (m) => console.log('  saw ' + m);
const kids = (page, id) => page.evaluate((id) => [...document.querySelector(`[data-box-id="${id}"]`).querySelectorAll(':scope > [data-box-id]')].map((e) => e.getAttribute('data-box-id')), id);
const geo = ([engine, ids]) => {
  const Z = engine === 'canvas' ? (document.querySelector('[data-box-id]').closest('[data-canvas-scale]')?.dataset.canvasScale * 1 || 1) : 1;
  const el = (id) => engine === 'canvas' ? document.querySelector(`[data-box-id="${id}"]`) : document.querySelector(`.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')}`);
  const o = {}; for (const [k, id] of Object.entries(ids)) { const e = el(id); if (!e) { o[k] = null; continue; } const r = e.getBoundingClientRect(); o[k] = { l: r.left / Z, r: r.right / Z, t: r.top / Z, b: r.bottom / Z }; }
  return o;
};
(async () => {
  const pos = arg('pos', '0,0').split(',').map(Number);
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 900, pos });
  page.setDefaultTimeout(12000);
  try {
    if (THEME !== 'Light') { await page.getByRole('button', { name: 'Website theme' }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(THEME) }).first().click(); await page.waitForTimeout(500); }
    await H.panel(page, true);
    const sec = await P.first(page, 'Stack'); const head = await P.into(page, sec, 'Heading');
    await H.panel(page, false); await H.select(page, head); await H.panel(page, true);
    const grid = await P.grid(page, 3, 1);
    const cells = await kids(page, grid);
    if (cells.length !== 3) bad(`the grid picker made ${cells.length} cells, not 3`);
    const icon = await P.into(page, cells[0], 'Icon'); await P.into(page, cells[1], 'Quote'); await P.into(page, cells[2], 'Quote');
    await page.screenshot({ path: path.join(OUT, 'before.png') });
    // THE CHECK: a Text dropped just under the icon
    // WHAT THE DROP EVENT DOES (E0-g): where it lands, and whether the canvas took it (it calls preventDefault)
    await page.evaluate(() => { window.__dnd = []; const rec = (phase) => (e) => { if (e.type === 'dragover' && phase !== 'window-bubble') return; const t = e.target; window.__dnd.push({ phase, type: e.type, target: `${t.tagName}${t.getAttribute && t.getAttribute('data-box-id') ? '#' + t.getAttribute('data-box-id') : ''} in ${t.closest ? (t.closest('[data-box-id]') || {}).getAttribute?.('data-box-id') : ''}`, prevented: e.defaultPrevented, types: [...(e.dataTransfer?.types || [])].join(',') }); };
      document.addEventListener('dragover', (e) => { window.__lastT = e.target; }, true);
      document.addEventListener('dragend', () => { window.__dnd.push({ lastTargetStillInPage: !!window.__lastT?.isConnected, lastTarget: window.__lastT?.tagName }); }, true);
      for (const ty of ['dragover', 'drop', 'dragend', 'dragleave']) { document.addEventListener(ty, rec('capture'), true); window.addEventListener(ty, rec('window-bubble'), false); } });
    let text;
    try { text = await P.under(page, icon, 'Text'); }
    finally { console.log('  drag events: ' + JSON.stringify(await page.evaluate(() => window.__dnd.filter((x) => x.type === 'drop' || 'lastTargetStillInPage' in x).concat([{ lastOvers: window.__dnd.filter((x) => x.type === 'dragover').slice(-4), count: window.__dnd.length }])))); }
    await H.panel(page, false); await page.keyboard.press('Escape');
    const after = await kids(page, grid);
    const home = await page.evaluate(([t, c]) => !!document.querySelector(`[data-box-id="${c}"] [data-box-id="${t}"]`), [text, cells[0]]);
    if (after.length !== 3) bad(`dropping under the icon made the grid ${after.length} cells (a new cell?)`); else ok('the grid still has 3 cells');
    if (!home) bad('the Text did not land in the icon\'s cell'); else ok('the Text is in the icon\'s cell');
    fs.writeFileSync(path.join(OUT, 'tree.txt'), await H.tree(page));
    const ids = { icon, text, cell: cells[0], q: cells[1] };
    const check = (where, w, g) => {
      if (!g.text || !g.icon) { bad(`${where} ${w}: text or icon missing`); return; }
      if (g.text.t < g.icon.b - 1) bad(`${where} ${w}: the Text is not below the icon (text top ${g.text.t.toFixed(1)}, icon bottom ${g.icon.b.toFixed(1)})`);
      else if (g.text.l < g.cell.l - 1 || g.text.r > g.cell.r + 1) bad(`${where} ${w}: the Text runs outside the icon's cell`);
      else ok(`${where} ${w}: the Text sits ${(g.text.t - g.icon.b).toFixed(1)}px under the icon, inside its cell`);
    };
    for (const [w, preset] of RUNGS) { await page.getByRole('button', { name: preset }).first().click(); await page.waitForTimeout(700); check('canvas', w, await page.evaluate(geo, ['canvas', ids])); if (w === 1280) await page.screenshot({ path: path.join(OUT, 'canvas-1280.png') }); }
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500); await page.keyboard.press('h');
    for (const [w] of RUNGS) {
      await page.setViewportSize({ width: w, height: 900 }); await page.waitForTimeout(500);
      const f = await (await page.$('iframe')).contentFrame(); check('Preview', w, await f.evaluate(geo, ['preview', ids]));
      if (w === 1280) console.log('  chain at 1280: ' + await f.evaluate(([icon, text]) => { const out = []; const sel = (id) => document.querySelector(`.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')}`);
        for (const id of [icon, text]) { let e = sel(id); for (let k = 0; k < 3 && e; k++, e = e.parentElement) { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); out.push(`${(e.className.match(/bx-[\w-]+/) || ['?'])[0].slice(-5)} t=${r.top.toFixed(0)} b=${r.bottom.toFixed(0)} h=${r.height.toFixed(0)} flex=${c.flex} pad=${c.paddingTop}/${c.paddingBottom} m=${c.marginTop}/${c.marginBottom} gap=${c.rowGap} jc=${c.justifyContent}`); } out.push('|'); }
        return out.join(' ; '); }, [icon, text]));
      await page.screenshot({ path: path.join(OUT, `preview-${w}.png`) });
    }
  } catch (e) { bad('CRASH ' + e.message.split('\n')[0] + ' at ' + (page.__step || '?')); await page.screenshot({ path: path.join(OUT, 'crash.png') }).catch(() => {}); }
  if (errs.length) bad('page errors: ' + [...new Set(errs)].join(' | '));
  console.log(`\nHEADED UAT icon-cell · ${THEME}: ${findings.length} findings`);
  await browser.close(); process.exitCode = findings.length ? 1 : 0;
})();
