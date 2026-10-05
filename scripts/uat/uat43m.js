// HEADED UAT MATRIX — right-edge resize in a row (#43 · #45 · #47). Built THROUGH THE UI; every combination:
// structures × screens (one window each) × target block × gesture × state (fresh / reloaded between out and back).
// Run all:  node uat43m.js --all   (six visible windows at a time)      One job:  node uat43m.js --job=3
const H = require('./h.js');
const { first, row } = require('./pages.js').helpers;
const { spawn } = require('child_process');
const fs = require('fs');

const STRUCTS = [
  { name: '2-stacks', tiles: ['Stack', 'Stack'] },
  { name: '3-stacks', tiles: ['Stack', 'Stack', 'Stack'] },
  { name: '4-stacks', tiles: ['Stack', 'Stack', 'Stack', 'Stack'] },
  { name: '5-stacks', tiles: ['Stack', 'Stack', 'Stack', 'Stack', 'Stack'] },
  { name: '4-stats', tiles: ['Stat', 'Stat', 'Stat', 'Stat'] },
  { name: 'mixed', tiles: ['Stack', 'Card', 'Stack'] },
  { name: 'unequal', tiles: ['Stack', 'Stack', 'Stack'], prep: { i: 1, d: 120 } },
  // room at the end: the LAST block narrowed from its right edge first, leaving empty space at the end of the row
  { name: 'room-at-end', tiles: ['Stack', 'Stack', 'Stack'], prep: { i: 2, d: -150 } },
];
// REAL WINDOWS — the size of a real screen, so the whole app (Inspector included) is on it and visible.
// 80/20: the user's own screen (1536×864 → a 1520×720 page) first, then a 1366×768 laptop.
const WINDOWS = [{ name: 'your-screen', w: 1520, h: 720 }, { name: 'laptop-1366', w: 1350, h: 640 }];
const SCREENS = ['Full width', 'Desktop (1280px)', 'Laptop (1024px)'];
const JOBS = WINDOWS.flatMap((win) => STRUCTS.flatMap((s) => SCREENS.map((sc) => ({ s, sc, win }))));
const GESTURES = [
  { name: 'nudge80x6', step: 80, n: 6 },
  { name: 'long480', step: 480, n: 1 },
  { name: 'nudge20x4', step: 20, n: 4 },
];
const STATES = ['fresh', 'reload'];

if (process.argv.includes('--all')) {
  // Six visible windows at once; each takes one structure × screen.
  const queue = JOBS.map((_, i) => i); let running = 0; const t0 = Date.now();
  const next = () => {
    if (!queue.length) { if (!running) summarise(t0); return; }
    const j = queue.shift(); running++;
    const slot = j % 6; const p = spawn(process.execPath, [__filename, `--job=${j}`, '--headed', `--slot=${slot}`], { stdio: 'ignore', env: process.env });
    p.on('exit', () => { running--; console.log(`job ${j} (${JOBS[j].s.name} @ ${JOBS[j].sc} in ${JOBS[j].win.name}) done`); next(); });
  };
  for (let k = 0; k < 6; k++) next();
  return;
}
function summarise(t0) {
  let combos = 0; const bugs = [];
  JOBS.forEach((_, j) => {
    const f = `${__dirname}/uat43m-${j}.json`;
    if (!fs.existsSync(f)) { bugs.push(`job ${j}: no result (crashed)`); return; }
    const r = JSON.parse(fs.readFileSync(f, 'utf8')); combos += r.combos; bugs.push(...r.bugs.map((b) => `${r.name} @ ${r.screen} in ${r.win}: ${b}`));
    if (r.errs.length) bugs.push(`${r.name} @ ${r.screen}: console errors ${r.errs.join(' | ')}`);
  });
  console.log(`\n${combos} combinations driven in ${Math.round((Date.now() - t0) / 1000)}s`);
  console.log('BUGS:', bugs.length ? '\n  ' + bugs.join('\n  ') : 'none');
}

const job = Number(process.argv.find((a) => a.startsWith('--job='))?.slice(6));
if (!Number.isNaN(job)) (async () => {
  const { s, sc, win } = JOBS[job];
  const out = { name: s.name, screen: sc, win: win.name, combos: 0, bugs: [], log: [], errs: [], steps: [] };
  const save = () => fs.writeFileSync(`${__dirname}/uat43m-${job}.json`, JSON.stringify(out, null, 1));
  const slot = Number(process.argv.find((a) => a.startsWith('--slot='))?.slice(7) || 0);
  const { browser, page, errs } = await H.open({ headed: true, w: win.w, h: win.h, pos: [slot * 3, slot * 3] });
  out.errs = errs;
  try {
    await page.getByRole('button', { name: sc }).first().click(); await page.waitForTimeout(600);
    await H.panel(page, true);
    const a = await first(page, s.tiles[0]); const ids = await row(page, a, s.tiles.slice(1));
    await H.panel(page, false); await H.fillStacks(page); await H.panel(page, false);
    if (s.prep) { await H.select(page, ids[s.prep.i]); await H.dragEdge(page, 'right', s.prep.d); }
    const snap = async () => (await H.rowOf(page, ids[0]));
    const start = await snap();
    const shot = (tag) => page.screenshot({ path: `${__dirname}/uat43m-${job}-${tag}.png` });
    await shot('start');
    const targets = [['first', ids[0]], ['middle', ids[Math.floor(ids.length / 2)]], ['last', ids[ids.length - 1]]]
      .filter(([n], i, arr) => arr.findIndex(([, id]) => id === arr[i][1]) === i || n === 'first');
    const same = (x, y) => x.kids.every((k) => { const e = y.kids.find((q) => q.id === k.id); return e && Math.abs(e.w - k.w) <= 2 && Math.abs(e.t - k.t) <= 2; });
    const onlyCombo = process.argv.find((a) => a.startsWith('--combo='))?.slice(8);
    for (const [tn, tid] of targets) for (const g of GESTURES) for (const st of STATES) {
      const tag = `${tn}-${g.name}-${st}`;
      if (onlyCombo && tag !== onlyCombo) continue;
      out.lastStep = tag;
      const check = (r, where) => {
        const p = H.rowProblems(r);
        if (p.length) { out.bugs.push(`${tag} ${where}: ${p.join('; ')}`); return false; }
        return true;
      };
      const rightOf = (r) => { const k = r.kids.find((q) => q.id === tid); return k.l + k.w; };
      const startRight = rightOf(start);
      // OUT
      for (let i = 0; i < g.n; i++) {
        await H.select(page, tid);
        const before = await snap(); const bw = before.kids.find((q) => q.id === tid).w;
        await H.dragEdge(page, 'right', g.step);
        const r = await snap(); const me = r.kids.find((q) => q.id === tid);
        // The agreed exception (#43): when not even the next block's minimum fits beside it, that block moves down and the
        // dragged one FILLS TO THE END OF THE ROW. Accepted only when both are measured true; any other jump is a bug.
        const fillsToEnd = Math.abs(me.l + me.w - r.inner) < 3; // it ends exactly at the end of the row
        const movedDown = r.kids.some((q) => { const b0 = before.kids.find((z) => z.id === q.id); return b0 && q.t > b0.t + 2; });
        if (me.w - bw > g.step + 30 && !(fillsToEnd && movedDown)) out.bugs.push(`${tag} out ${i + 1}: JUMP ${bw}→${me.w} for a ${g.step}px drag`);
        out.steps.push(`${tag} out ${i + 1} +${g.step}: ${r.kids.map((k) => `${k.w}@${k.t}`).join(' ')}`);
        check(r, `out ${i + 1}`);
      }
      await shot(`${tag}-out`);
      if (st === 'reload') {
        await page.reload({ waitUntil: 'load' });
        await page.waitForFunction(() => { const b = Array.from(document.querySelectorAll('button')).find((x) => x.getAttribute('aria-label') === 'Open blocks panel'); return !!b && Object.keys(b).some((k) => k.startsWith('__reactProps')); }, null, { timeout: 60000 });
        await page.waitForTimeout(1000);
        await page.getByRole('button', { name: sc }).first().click(); await page.waitForTimeout(600);
      }
      // BACK — to the spot the edge started from, in steps no bigger than the gesture's
      for (let i = 0; i < 25; i++) {
        out.lastStep = `${tag} back ${i + 1}`;
        const r = await snap(); const d = startRight - rightOf(r);
        if (Math.abs(d) <= 1) break;
        await H.select(page, tid);
        await H.dragEdge(page, 'right', Math.sign(d) * Math.min(g.step, Math.abs(d)));
        const rb = await snap(); check(rb, `back ${i + 1}`);
        out.steps.push(`${tag} back ${i + 1} ${Math.round(d)}: ${rb.kids.map((k) => `${k.w}@${k.t}`).join(' ')}`);
      }
      const end = await snap();
      out.combos++;
      const ok = same(start, end);
      out.log.push(`${tag}: ${ok ? 'RETURNED' : 'DID NOT RETURN'}  ${end.kids.map((k) => `${k.w}@${k.t}`).join(' ')}`);
      if (!ok) { out.bugs.push(`${tag}: round trip did not return — start ${start.kids.map((k) => `${k.w}@${k.t}`).join(' ')} end ${end.kids.map((k) => `${k.w}@${k.t}`).join(' ')}`); await shot(`${tag}-FAIL`); save(); break; }
      save();
    }
  } catch (e) {
    out.bugs.push('harness: ' + e.message.split('\n')[0]);
    try { out.treeAtFailure = await H.tree(page); await page.screenshot({ path: `${__dirname}/uat43m-${job}-THROW.png` }); } catch {}
  }
  save(); await browser.close();
})();
