// HEADED UAT — E0-b/E0-c (tier-99 page 145): the burger header, built THROUGH THE UI by the dresser's own code, then every
// block's place measured on the canvas and in the Preview at 1280 — which blocks disagree, and by how much.
//   NODE_PATH=node_modules node scripts/uat/probe-e0b.js [--burger=1] [--sticky=1]
const fs = require('fs'); const path = require('path');
const H = require('./h.js'); const { Dresser } = require('./dress.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const OUT = path.join(__dirname, 'probe-e0b-out'); fs.mkdirSync(OUT, { recursive: true });
const W = +arg('w', 1280); const PRESET = { 375: 'Mobile (375px)', 1280: 'Desktop (1280px)', 1920: 'Wide (1920px)', 1024: 'Laptop (1024px)', 768: 'Tablet (768px)' }[W];
const ZOOM = arg('zoom', ''); const THEME = arg('theme', 'Light'); // --theme=Light|Dark|Midnight|"Purple Dream": the editor AND the site
const tag = `b${arg('burger', '1')}s${arg('sticky', '1')}w${W}${ZOOM ? `z${ZOOM}` : ''}${THEME === 'Light' ? '' : THEME.replace(/W+/g, '')}`;
const where = ([engine]) => {
  const Z = engine === 'canvas' ? (document.querySelector('[data-box-id]').closest('[data-canvas-scale]')?.dataset.canvasScale * 1 || 1) : 1;
  const page = engine === 'canvas' ? document.querySelector('[data-box-id]') : document.querySelector('.eu-root') || document.body;
  const pr = page.getBoundingClientRect(); const out = {};
  const all = engine === 'canvas' ? [...document.querySelectorAll('[data-box-id]')].map((e) => [e.getAttribute('data-box-id'), e]) : [...document.querySelectorAll('[class*="bx-"]')].map((e) => [(e.className.match(/bx-([A-Za-z0-9_-]+)/) || [])[1], e]);
  for (const [id, e] of all) { if (!id) continue; const r = e.getBoundingClientRect(); if (!r.width) continue; const cs = getComputedStyle(e);
    out[id] = { l: +((r.left - pr.left) / Z).toFixed(1), w: +(r.width / Z).toFixed(1), h: +(r.height / Z).toFixed(1), t: +((r.top - pr.top) / Z).toFixed(1), pad: [cs.paddingLeft, cs.paddingRight].join('/'), gap: cs.columnGap, jc: cs.justifyContent, txt: (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 14), fl: cs.flex, mw: cs.maxWidth, wd: e.style.width }; }
  return out;
};
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 900 });
  page.setDefaultTimeout(12000);
  try {
    if (THEME !== 'Light') for (const b of ['Website theme', 'Change theme']) { await page.getByRole('button', { name: b }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(THEME) }).first().click(); await page.waitForTimeout(400); }
    await H.panel(page, true);
    const d = new Dresser(page, { hamburger: arg('burger', '1') === '1', header: arg('sticky', '1') === '1' ? 'sticky' : 'scrolls', theme: THEME });
    await d.header(); await H.panel(page, false); await page.keyboard.press('Escape');
    fs.writeFileSync(path.join(OUT, `${tag}-tree.txt`), await H.tree(page));
    // the site as the UI built it — what tests/e2e/canvas-scale-parity.spec.ts pins (L-2, e-4)
    fs.writeFileSync(path.join(OUT, `${tag}-site.json`), await page.evaluate(() => localStorage.getItem('educo_box_site_v1') || ''));
    await page.getByRole('button', { name: PRESET }).first().click(); await page.waitForTimeout(900);
    // --zoom=100: measure the canvas at 100% too — the canvas zoom changes how its words are measured (L-2, e-4)
    if (ZOOM) { await page.getByRole('group', { name: 'Canvas zoom' }).locator('button').nth(1).click(); await page.getByRole('option', { name: `${ZOOM}%`, exact: true }).first().click(); await page.waitForTimeout(600); }
    const c = await page.evaluate(where, ['canvas']); await page.screenshot({ path: path.join(OUT, `${tag}-canvas.png`) });
    // the line of links: its INLINE style as React left it on the canvas
    console.log('  canvas links line: ' + await page.evaluate(() => { const a = [...document.querySelectorAll('[data-box-id]')].find((e) => e.getAttribute('data-box-id') && [...e.children].filter((k) => k.tagName === 'A' || k.querySelector?.(':scope > a')).length >= 2 && getComputedStyle(e).flexDirection === 'row'); if (!a) return 'not found'; const kids = [...a.children].map((k) => k.getBoundingClientRect()); const z = a.closest('[data-canvas-scale]')?.dataset.canvasScale * 1 || 1; const R = a.getBoundingClientRect(); const cs = getComputedStyle(a);
      // screen px: the line's content box vs what its items need on one line (their widths + the gaps between them)
      const need = kids.reduce((s, k) => s + k.width, 0) + (kids.length - 1) * parseFloat(cs.columnGap) * z;
      return `${a.getAttribute('data-box-id').slice(-4)} zoom=${z} line=${R.width.toFixed(4)} need=${need.toFixed(4)} kids=${kids.map((k) => k.width.toFixed(4)).join(',')} tops=${kids.map((k) => Math.round(k.top)).join(',')}`; }));
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500); await page.keyboard.press('h');
    await page.setViewportSize({ width: W, height: 900 }); await page.waitForTimeout(500);
    let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== W) { await page.setViewportSize({ width: W + (W - inner), height: 900 }); await page.waitForTimeout(400); f = await (await page.$('iframe')).contentFrame(); }
    const v = await f.evaluate(where, ['preview']); await page.screenshot({ path: path.join(OUT, `${tag}-preview.png`) });
    fs.writeFileSync(path.join(OUT, `${tag}-export.html`), await (await page.$('iframe')).getAttribute('srcdoc') || '');
    let n = 0;
    // L2-a: a wrap in BOTH engines is no difference, yet still a fault — check the menu's line on each side on its own.
    // L2-d: and how much of the header's line its items span (logo's left edge to the last button's right edge).
    const bar = (engine) => { const sel = engine === 'canvas' ? '[data-box-id]' : '[class*="bx-"]'; const all = [...document.querySelectorAll(sel)];
      const byText = (w) => all.find((e) => (e.innerText || '').trim() === w && e.getClientRects().length);
      const tops = ['About', 'Admissions', 'News', 'Contact'].map((w) => { const e = byText(w); return e ? Math.round(e.getBoundingClientRect().top) : null; });
      const logo = byText('Hillside School'), cta = byText('Apply now'); let line = logo; while (line && !(line.parentElement && line.parentElement.contains(cta) && line.contains(cta))) line = line.parentElement;
      // per VISUAL ROW (L2-e): on a phone "Apply now" wraps under the logo, and logo-to-button across two rows read as 69% empty
      const L = line.getBoundingClientRect(); const rows = new Map();
      // rows are items that OVERLAP vertically (L2-h): centred items have different tops, so a top-keyed row split one line
      for (const k of line.children) { const r = k.getBoundingClientRect(); if (!r.width) continue; let row = [...rows.values()].find((w) => r.top < w.b && r.bottom > w.t);
        if (!row) { row = { t: r.top, b: r.bottom, l: Infinity, r: -Infinity }; rows.set(rows.size, row); } row.t = Math.min(row.t, r.top); row.b = Math.max(row.b, r.bottom); row.l = Math.min(row.l, r.left); row.r = Math.max(row.r, r.right); }
      const lr = logo.getBoundingClientRect(); const first = [...rows.values()].find((w) => lr.top < w.b && lr.bottom > w.t);
      return { tops, rows: rows.size, spans: +((first.r - first.l) / L.width * 100).toFixed(1), gapRight: +((L.right - first.r) / L.width * 100).toFixed(1), gapLeft: +((first.l - L.left) / L.width * 100).toFixed(1) }; };
    for (const [engine, doc] of [['preview', f], ['canvas', null]]) {
      const r = engine === 'canvas' ? await (async () => { await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {}); await page.waitForTimeout(600); return page.evaluate(bar, 'canvas'); })().catch((e) => ({ err: e.message })) : await doc.evaluate(bar, 'preview');
      if (r.err) { console.log(`  ${engine}: could not measure the header (${r.err.split('\n')[0]})`); continue; }
      const wrapped = new Set(r.tops.filter((t) => t != null)).size > 1;
      if (wrapped) n++;
      console.log(`  ${engine} menu ${wrapped ? 'WRAPPED' : 'one line'} (tops ${r.tops.join(',')}) · header line: items span ${r.spans}% · empty left ${r.gapLeft}% · empty right ${r.gapRight}%`);
    }
    for (const id of Object.keys(c)) { const a = c[id], b = v[id.replace(/[^A-Za-z0-9_-]/g, '-')];
      if (!b) { console.log(`  canvas only: ${id.slice(-4)} "${a.txt}"`); continue; }
      if (Math.abs(a.l - b.l) > 3 || Math.abs(a.w - b.w) > 3 || Math.abs(a.h - b.h) > 3) { n++; console.log(`  DIFFER ${id.slice(-4)} "${a.txt}": canvas l=${a.l} w=${a.w} h=${a.h} pad=${a.pad} gap=${a.gap} flex=${a.fl} maxW=${a.mw} style.w=${a.wd} | preview l=${b.l} w=${b.w} h=${b.h} pad=${b.pad} gap=${b.gap} flex=${b.fl} maxW=${b.mw}`); } }
    console.log(`${tag}: ${n} blocks differ at ${W}`);
  } catch (e) { console.log('CRASH ' + e.message.split('\n')[0]); await page.screenshot({ path: path.join(OUT, `${tag}-crash.png`) }).catch(() => {}); }
  if (errs.length) console.log('page errors: ' + [...new Set(errs)].join(' | '));
  await browser.close();
})();
