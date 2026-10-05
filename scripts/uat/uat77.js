// #77 — a row sized with TWO edges: a later out-and-back on edge 1 must leave every other column where it was, and
// edge 2's own round trip must still come home afterwards. HEADED UAT, built through the UI.
// Matrix: 3 · 4 columns × 1536×864 · 1366×768 screens × Full width · Desktop · Laptop × out-and-back of 20 · 60 · 150px.
// usage: node scripts/uat/uat77.js --headed [--jobs=6]
const H = require('./h.js');
const { first, row } = require('./pages.js').helpers;
const fs = require('fs'); const path = require('path');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const JOBS = +arg('jobs', 6);
const WINDOWS = [{ w: 1520, h: 720, name: '1536x864' }, { w: 1350, h: 625, name: '1366x768' }];
const CANVAS = ['Full width', 'Desktop (1280px)', 'Laptop (1024px)'];
const STEPS = [20, 60, 150];
const LOG = path.join(__dirname, 'uat77.log'); fs.writeFileSync(LOG, '');
const log = (s) => { console.log(s); fs.appendFileSync(LOG, s + '\n'); };
const widths = async (page, ids) => (await H.rowOf(page, ids[0])).kids.map((k) => ({ w: k.w, t: k.t }));
const fmt = (ws) => ws.map((k) => `${k.w}${k.t > 5 ? '↓' : ''}`).join('/');
const differs = (a, b) => a.some((k, i) => Math.abs(k.w - b[i].w) > 2 || Math.abs(k.t - b[i].t) > 2);

async function job(n, win, canvas, slot) {
  const { browser, page, errs } = await H.open({ headed: true, w: win.w, h: win.h, pos: [(slot % 3) * 520, Math.floor(slot / 3) * 460] });
  const probs = []; const tag = `${n} cols @${win.name} ${canvas}`;
  try {
    await page.getByRole('button', { name: canvas }).first().click(); await page.waitForTimeout(700);
    await H.panel(page, true);
    const a = await first(page, 'Stack'); const ids = await row(page, a, Array(n - 1).fill('Stack'));
    await H.panel(page, false); await H.fillStacks(page); await H.panel(page, false);
    // size edge 1 to 30% of the row, then edge 2 to 60% — two different edges, as a user lays out 30 / 30 / 40
    for (const [i, t] of [[0, 0.3], [1, 0.6]]) { const r = await H.rowOf(page, ids[0]); const k = r.kids.find((q) => q.id === ids[i]); await H.select(page, ids[i]); await H.dragEdge(page, 'right', Math.round(t * r.inner - (k.l + k.w))); }
    const sized = await widths(page, ids);
    for (const step of STEPS) {
      const before = await widths(page, ids);
      await H.select(page, ids[0]); await H.dragEdge(page, 'right', step);
      const out = await widths(page, ids);
      await H.select(page, ids[0]); await H.dragEdge(page, 'right', -step);
      const back = await widths(page, ids);
      if (differs(back, before)) { probs.push(`edge 1 ±${step}: ${fmt(before)} → ${fmt(out)} → ${fmt(back)}`); await H.shot(page, `uat77-${n}-${win.name}-${canvas.replace(/\W+/g, '')}-${step}.png`); }
      const rp = H.rowProblems(await H.rowOf(page, ids[0])); if (rp.length) probs.push(`after ±${step}: ${rp.join('; ')}`);
    }
    // edge 2's OWN round trip still comes home: take it out and back
    await H.select(page, ids[1]); await H.dragEdge(page, 'right', 50); await H.select(page, ids[1]); await H.dragEdge(page, 'right', -50);
    const e2 = await widths(page, ids);
    if (differs(e2, sized)) probs.push(`edge 2 ±50 afterwards: ${fmt(sized)} → ${fmt(e2)}`);
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(2500);
    await page.getByRole('button', { name: canvas }).first().click(); await page.waitForTimeout(700);
    const rl = await widths(page, ids);
    if (differs(rl, e2)) probs.push(`reload changed it: ${fmt(e2)} → ${fmt(rl)}`);
    await H.shot(page, `uat77-${n}-${win.name}-${canvas.replace(/\W+/g, '')}-end.png`);
    if (errs.length) probs.push('page errors: ' + [...new Set(errs)].join(' / '));
  } catch (e) { probs.push('ERR ' + e.message.split('\n')[0]); }
  finally { await browser.close(); }
  log(`${probs.length ? 'FAIL' : 'ok  '} ${tag}${probs.length ? '\n    ' + probs.join('\n    ') : ''}`);
  return probs.length ? 1 : 0;
}

(async () => {
  const jobs = []; for (const n of [3, 4]) for (const w of WINDOWS) for (const c of CANVAS) jobs.push([n, w, c]);
  let i = 0, fails = 0;
  await Promise.all(Array.from({ length: Math.min(JOBS, jobs.length) }, async (_, slot) => { while (i < jobs.length) { const j = jobs[i++]; fails += await job(...j, slot); } }));
  log(`DONE — HEADED UAT #77: ${jobs.length - fails}/${jobs.length} passed`);
})();
