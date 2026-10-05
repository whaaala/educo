// #78 — rows of four or more columns (decided with the user 2026-09-27): ONE row on a desktop, a laptop and a wide
// screen · at most three per line on a tablet, balanced (4 → 2+2, 5 → 3+2, 6 → 3+3, 7 → 3+2+2) · stacked on a phone.
// HEADED UAT: every row is BUILT through the UI (drops from the blocks panel, text dragged into each stack), then read
// at every canvas size, dragged on the tablet and back, reloaded, and opened in the real Preview at every width.
// usage: node scripts/uat/uat78.js --headed [--jobs=5] [--only=4,6]
const H = require('./h.js');
const P = require('./pages.js').helpers;
const fs = require('fs'); const path = require('path');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const JOBS = +arg('jobs', 5);
const COUNTS = arg('only', '3,4,5,6,7').split(',').map(Number);
const WINDOWS = [{ w: 1520, h: 720, name: '1536x864' }, { w: 1350, h: 625, name: '1366x768' }]; // the page area of each real screen
const PRESETS = [
  { name: 'Mobile (375px)', rung: 'phone' }, { name: 'Tablet (768px)', rung: 'tablet' }, { name: 'Laptop (1024px)', rung: 'one' },
  { name: 'Desktop (1280px)', rung: 'one' }, { name: 'Wide (1920px)', rung: 'one' }, { name: 'Full width', rung: 'one' },
];
const PREVIEW = [{ w: 375, rung: 'phone' }, { w: 768, rung: 'tablet' }, { w: 1024, rung: 'one' }, { w: 1280, rung: 'one' }, { w: 1920, rung: 'one' }];
const balanced = (n) => { const lines = Math.ceil(n / 3), each = Math.floor(n / lines), extra = n % lines; return Array.from({ length: lines }, (_, i) => each + (i < extra ? 1 : 0)); };
const want = (n, rung) => rung === 'phone' ? Array(n).fill(1) : rung === 'tablet' ? (n >= 4 ? balanced(n) : null) : [n];
const LOG = path.join(__dirname, 'uat78.log'); fs.writeFileSync(LOG, '');
const log = (s) => { console.log(s); fs.appendFileSync(LOG, s + '\n'); };

/** Lines as the eye reads them: blocks grouped by their top edge, left to right. */
const linesOf = (row) => { const by = {}; row.kids.forEach((k) => { const t = Object.keys(by).find((x) => Math.abs(+x - k.t) <= 2) ?? k.t; (by[t] = by[t] || []).push(k); }); return Object.keys(by).map(Number).sort((a, b) => a - b).map((t) => by[t].sort((a, b) => a.l - b.l)); };
const counts = (row) => linesOf(row).map((l) => l.length);
/** Every line full (its last block reaches the row's end) — no hole where a block could have been. */
const holes = (row) => linesOf(row).filter((l) => row.inner - (l[l.length - 1].l + l[l.length - 1].w) > 2).map((l) => Math.round(row.inner - (l[l.length - 1].l + l[l.length - 1].w)));

async function job(n, win, slot) {
  const pos = [(slot % 3) * 520, Math.floor(slot / 3) * 460];
  const { browser, page, errs } = await H.open({ headed: true, w: win.w, h: win.h, pos });
  const probs = []; const tag = `${n} cols @${win.name}`;
  try {
    await H.panel(page, true);
    const c0 = await P.first(page, 'Stack');
    await P.row(page, c0, Array(n - 1).fill('Stack'));
    await H.panel(page, false);
    await H.fillStacks(page);
    const ids = (await H.rowOf(page, c0)).kids.map((k) => k.id);
    if (ids.length !== n) probs.push(`built ${ids.length} columns, not ${n}`);
    const check = async (label, rung) => {
      const row = await H.rowOf(page, c0); const c = counts(row); const w = want(n, rung);
      const bad = [];
      if (w && JSON.stringify(c) !== JSON.stringify(w)) bad.push(`lines ${c.join('+')} (want ${w.join('+')})`);
      const h = holes(row); if (h.length && rung !== 'one') bad.push(`hole ${h.join(',')}px`);
      bad.push(...H.rowProblems(row).filter((p) => !p.startsWith('HOLE')));
      if (bad.length) { probs.push(`${label}: ${bad.join('; ')}`); await H.shot(page, `uat78-${n}-${win.name}-${label.replace(/[^a-z0-9]+/gi, '_')}.png`); }
      return row;
    };
    // 1 — the canvas at every size
    for (const p of PRESETS) { await page.getByRole('button', { name: p.name }).first().click(); await page.waitForTimeout(700); await check(p.name, p.rung); }
    await H.shot(page, `uat78-${n}-${win.name}-fullwidth.png`);
    // 2 — on the tablet: drag the first column's right edge in and back out, the way a hand does
    await page.getByRole('button', { name: 'Tablet (768px)' }).first().click(); await page.waitForTimeout(700);
    const t0 = await check('tablet before drag', 'tablet');
    await H.shot(page, `uat78-${n}-${win.name}-tablet.png`);
    await H.select(page, c0);
    await H.dragEdge(page, 'right', -60); const tIn = await check('tablet after -60', 'tablet');
    await H.dragEdge(page, 'right', 60); const tBack = await check('tablet after +60 back', 'tablet');
    const w0 = t0.kids.find((k) => k.id === c0).w, w1 = tIn.kids.find((k) => k.id === c0).w, w2 = tBack.kids.find((k) => k.id === c0).w;
    if (n >= 4 && !(w1 < w0 - 20)) probs.push(`tablet drag did not narrow the column (${w0} → ${w1})`);
    if (Math.abs(w2 - w0) > 2) probs.push(`tablet round trip did not come home (${w0} → ${w1} → ${w2})`);
    await page.keyboard.press('Escape');
    // 3 — the desktop is untouched by the tablet drag, and it all survives a reload
    await page.getByRole('button', { name: 'Desktop (1280px)' }).first().click(); await page.waitForTimeout(700);
    await check('desktop after tablet drag', 'one');
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(2500);
    await page.getByRole('button', { name: 'Tablet (768px)' }).first().click(); await page.waitForTimeout(700);
    await check('tablet after reload', 'tablet');
    // 4 — the real Preview at every width: what a visitor sees
    for (const r of PREVIEW) {
      await page.setViewportSize({ width: r.w, height: 800 });
      await page.getByRole('button', { name: 'Preview', exact: true }).first().click();
      await page.waitForSelector('iframe', { timeout: 15000 }); await page.waitForTimeout(1500);
      let frame = await (await page.$('iframe')).contentFrame();
      const inner = await frame.evaluate(() => document.documentElement.clientWidth);
      if (inner !== r.w) { await page.setViewportSize({ width: r.w + (r.w - inner), height: 800 }); await page.waitForTimeout(700); frame = await (await page.$('iframe')).contentFrame(); }
      const row = await frame.evaluate((ids) => {
        const els = ids.map((id) => document.querySelector('.bx-' + id.replace(/[^A-Za-z0-9_-]/g, '-')));
        const band = els[0].parentElement; const br = band.getBoundingClientRect();
        return { inner: Math.round(br.width), gap: parseFloat(getComputedStyle(band).columnGap) || 0, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          kids: els.map((e, i) => { const r = e.getBoundingClientRect(); return { id: ids[i], l: Math.round(r.left - br.left), t: Math.round(r.top - br.top), w: Math.round(r.width), h: Math.round(r.height) }; }) };
      }, ids);
      const c = counts(row); const w = want(n, r.rung); const bad = [];
      if (w && JSON.stringify(c) !== JSON.stringify(w)) bad.push(`lines ${c.join('+')} (want ${w.join('+')})`);
      const h = holes(row); if (h.length && r.rung !== 'one') bad.push(`hole ${h.join(',')}px`);
      if (row.overflow > 1) bad.push(`sideways overflow ${row.overflow}px`);
      if (bad.length) { probs.push(`Preview ${r.w}: ${bad.join('; ')}`); }
      // The Preview bar floats OVER the page (by design); a short test page sits entirely under it. Hide it (H) to look.
      await page.keyboard.press('h'); await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(__dirname, `uat78-${n}-${win.name}-preview-${r.w}.png`) });
      await page.setViewportSize({ width: win.w, height: win.h });
      await page.goto((process.env.BASE || 'http://localhost:3100') + '/website/box-demo', { waitUntil: 'load' }); await page.waitForTimeout(2000);
    }
    if (errs.length) probs.push(`page errors: ${[...new Set(errs)].join(' / ')}`);
  } catch (e) { probs.push('ERR ' + e.message.split('\n')[0]); await H.shot(page, `uat78-${n}-${win.name}-err.png`).catch(() => {}); }
  finally { await browser.close(); }
  log(`${probs.length ? 'FAIL' : 'ok  '} ${tag}${probs.length ? '\n    ' + probs.join('\n    ') : ''}`);
  return probs.length;
}

(async () => {
  const jobs = []; for (const n of COUNTS) for (const w of WINDOWS) jobs.push([n, w]);
  let i = 0, fails = 0;
  await Promise.all(Array.from({ length: Math.min(JOBS, jobs.length) }, async (_, slot) => { while (i < jobs.length) { const [n, w] = jobs[i++]; fails += (await job(n, w, slot)) ? 1 : 0; } }));
  log(`DONE — HEADED UAT #78: ${jobs.length - fails}/${jobs.length} passed`);
})();
