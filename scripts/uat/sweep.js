// RULE Q sweep for width resizing — every structure built through the UI (RULE Y), run in PARALLEL.
// usage: node sweep.js [--headed] [--jobs=6] [--only=S2] [--screens=desk,tab,phone] [--gest=G1,G3]
const H = require('./h.js');
const STRUCTS = require('./structs.js');
const fs = require('fs');
const { chromium } = require('playwright');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
const headed = process.argv.includes('--headed');
const JOBS = +arg('jobs', 6), ONLY = arg('only', ''), GEST = arg('gest', '');
const SCREENS = { desk: { vw: 1600, preset: '' }, laptop: { vw: 1600, preset: 'Laptop (1024px)' }, tab: { vw: 1600, preset: 'Tablet (768px)' }, phone: { vw: 1600, preset: 'Mobile (375px)' }, realtab: { vw: 900, preset: '' } };
const screens = arg('screens', 'desk').split(',');
const LOG = arg('log', 'sweep.log');

const GESTURES = {
  G1_out_back: async (t) => { const m = await t.drag(+120); await t.drag(-m); return t.backTo(); },
  G2_in_back: async (t) => { const m = await t.drag(-120); await t.drag(-m); return t.backTo(); },
  G3_wrap_back: async (t) => { await t.drag(+400); await t.drag(+400); await t.drag(-150); await t.dragToStart(); return t.backTo(); },
  G4_wobble: async (t) => { for (let i = 0; i < 5; i++) { const m = await t.drag(+40); await t.drag(-m); } return t.backTo(); },
  G5_wrap_then_nudge: async (t) => { await t.drag(+400); await t.drag(+400); for (let i = 0; i < 4; i++) await t.drag(-60); await t.dragToStart(); return t.backTo(); },
};

async function fresh(browser, scr) {
  const ctx = await browser.newContext({ viewport: { width: scr.vw, height: 1000 } });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('kept')) { localStorage.clear(); sessionStorage.setItem('kept', '1'); } } catch {} });
  await page.goto((process.env.BASE || 'http://localhost:3100') + '/website/box-demo', { waitUntil: 'load' });
  await page.waitForFunction(() => { const b = Array.from(document.querySelectorAll('button')).find((x) => x.getAttribute('aria-label') === 'Open blocks panel'); return !!b && Object.keys(b).some((k) => k.startsWith('__reactProps')); }, null, { timeout: 60000 });
  await page.waitForTimeout(800);
  return { ctx, page, errs };
}
async function build(page, sname, scr) {
  // Built at desktop, then viewed at the rung — what was built on one screen must hold on every other.
  await H.panel(page, true); const anyId = await STRUCTS[sname](page); await H.panel(page, false);
  if (scr.preset) { await page.getByRole('button', { name: scr.preset }).first().click(); await page.waitForTimeout(700); }
  return anyId;
}

async function runJob(browser, job) {
  const { sname, target, edge, gname, scrName } = job; const scr = SCREENS[scrName];
  const label = `${scrName.padEnd(6)} ${sname} · block ${target + 1} · ${edge} · ${gname}`;
  const { ctx, page, errs } = await fresh(browser, scr);
  try {
    const anyId = await build(page, sname, scr);
    const row0 = await H.rowOf(page, anyId); if (!row0) throw new Error('no row');
    if (target >= row0.kids.length) return null;
    const id = row0.kids[target].id;
    const probs = H.rowProblems(row0).map((p) => 'AS BUILT: ' + p);
    await H.select(page, id);
    const hs = await H.handleOf(page, edge); if (!hs) return `SKIP ${label}: no ${edge} handle`;
    const startX = hs.x + hs.width / 2, sgn = edge === 'right' ? 1 : -1;
    const t = {
      drag: async (d) => {
        const before = await H.rowOf(page, id); const me0 = before.kids.find((k) => k.id === id);
        await H.select(page, id);
        if (!(await H.dragEdge(page, edge, sgn * d))) { probs.push('handle vanished'); return 0; }
        const after = await H.rowOf(page, id); const me1 = after.kids.find((k) => k.id === id);
        if (me1.t === me0.t) {
          const f0 = edge === 'right' ? me0.l : me0.l + me0.w, f1 = edge === 'right' ? me1.l : me1.l + me1.w;
          if (Math.abs(f1 - f0) > 1) probs.push(`anchored edge moved ${f1 - f0}px on ${sgn * d}`);
        }
        for (const p of H.rowProblems(after)) probs.push(`after ${sgn * d}: ${p}`);
        const e0 = edge === 'right' ? me0.l + me0.w : me0.l, e1 = edge === 'right' ? me1.l + me1.w : me1.l;
        return me1.t === me0.t ? sgn * (e1 - e0) : d; // changed line (wrapped): the whole gesture counts
      },
      dragToStart: async () => { await H.select(page, id); const h = await H.handleOf(page, edge); await H.dragEdge(page, edge, startX - (h.x + h.width / 2)); },
      backTo: async () => { const r = await H.rowOf(page, id); if (!H.same(r, row0)) probs.push(`did not return: ${H.fmt(r)}  vs start ${H.fmt(row0)}`); },
    };
    await GESTURES[gname](t);
    if (errs.length) probs.push('page error: ' + errs[0]);
    if (!probs.length) return `ok   ${label}`;
    const file = `sw-${scrName}-${sname}-${target + 1}-${edge}-${gname}.png`;
    await H.shot(page, file);
    return `FAIL ${label}\n     ${[...new Set(probs)].slice(0, 5).join('\n     ')}\n     stored: ${JSON.stringify(await H.storedRow(page, id))}\n     shot: ${file}`;
  } catch (e) {
    try { await H.shot(page, `sw-err-${scrName}-${sname}-${target + 1}-${edge}-${gname}.png`); } catch {}
    return `ERR  ${label}: ${e.message.split('\n')[0]}`;
  } finally { await ctx.close(); }
}

(async () => {
  const browser = await chromium.launch({ headless: !headed });
  fs.writeFileSync(LOG, '');
  const out = (s) => { fs.appendFileSync(LOG, s + '\n'); };
  const snames = Object.keys(STRUCTS).filter((s) => !ONLY || ONLY.split(',').some((o) => s.startsWith(o)));
  // Phase 1 — how many blocks does each structure's row have? (built in parallel)
  const counts = {};
  await pool(snames.map((s) => async () => {
    const { ctx, page } = await fresh(browser, SCREENS.desk);
    try { const id = await build(page, s, SCREENS.desk); const r = await H.rowOf(page, id); counts[s] = r ? r.kids.length : 0; out(`built ${s}: ${counts[s]} blocks ${r ? H.fmt(r) : ''}`); }
    catch (e) { counts[s] = 0; out(`BUILD FAILED ${s}: ${e.message.split('\n')[0]}`); }
    finally { await ctx.close(); }
  }), JOBS);
  const jobs = [];
  for (const scrName of screens) for (const sname of snames) for (let target = 0; target < counts[sname]; target++)
    for (const edge of ['right', 'left']) for (const gname of Object.keys(GESTURES)) if (!GEST || GEST.split(',').some((g) => gname.startsWith(g))) jobs.push({ sname, target, edge, gname, scrName });
  out(`\n${jobs.length} combinations, ${JOBS} at a time\n`);
  let fails = 0, done = 0; const t0 = Date.now();
  await pool(jobs.map((j) => async () => { const r = await runJob(browser, j); done++; if (r) { if (!r.startsWith('ok') && !r.startsWith('SKIP')) fails++; out(r); } }), JOBS);
  out(`\nDONE ${done} combinations · ${fails} failing · ${Math.round((Date.now() - t0) / 1000)}s`);
  await browser.close();
})();

async function pool(tasks, n) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, tasks.length) }, async () => { while (i < tasks.length) { const k = i++; await tasks[k](); } }));
}
