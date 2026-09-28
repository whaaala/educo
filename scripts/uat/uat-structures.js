// HEADED UAT — EVERY row/grid shape real sites use (docs/layout-benchmark/rowshapes.json, from the crawl), most common
// first. Each shape is BUILT THROUGH THE UI and sized by DRAGGING EDGES, then: buildable? · every inner edge round-trips ·
// Preview at 375 / 768 / 1024 / 1280 / 1920 (no sideways overflow, stacks on a phone, canvas == Preview at desktop).
//   NODE_PATH=node_modules node scripts/uat/uat-structures.js [--top=31] [--from=0] [--jobs=6]
const fs = require('fs'); const path = require('path');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const SHAPES = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'docs', 'layout-benchmark', 'rowshapes.json'), 'utf8'));
const FROM = +arg('from', 0), TOP = +arg('top', 31), JOBS = +arg('jobs', 6);

/** "row of 2 (40/60) +nested columns repeated" → a build spec. */
function spec(shape) {
  const m = shape.match(/^(row|grid) of (\d+\+?) \(([^)]+)\)(.*)$/); if (!m) return null;
  const n = m[2] === '6+' ? 6 : +m[2];
  let shares = m[3] === 'equal' || m[3] === 'many' ? Array(n).fill(100 / n) : m[3].split('/').map(Number);
  if (shares.some((x) => x <= 0) || shares.length !== n) return null; // "100/0" is not a layout
  const sum = shares.reduce((x, y) => x + y, 0); shares = shares.map((x) => (x / sum) * 100); // labels are rounded buckets (30/50/30 = 110%): scale to a real line
  return { kind: m[1], n, shares, nested: /nested/.test(m[4]), repeated: /repeated/.test(m[4]) };
}
const list = SHAPES.slice(FROM, FROM + TOP).map((s, i) => ({ ...s, idx: FROM + i, spec: spec(s.shape) })).filter((s) => s.spec);

if (!process.argv.find((a) => a.startsWith('--one='))) {
  const { spawn } = require('child_process'); const queue = [...list]; let running = 0; const results = []; const t0 = Date.now();
  const next = () => {
    if (!queue.length) { if (!running) done(); return; }
    const s = queue.shift(); running++;
    const c = spawn(process.execPath, [__filename, `--one=${s.idx}`, `--slot=${s.idx % JOBS}`], { env: process.env });
    let out = ''; c.stdout.on('data', (d) => { out += d; }); c.stderr.on('data', (d) => { out += d; });
    c.on('exit', () => { running--; results.push(out); process.stdout.write(`.${s.idx}`); next(); });
  };
  const done = () => {
    console.log(`\n\n${results.length} shapes in ${Math.round((Date.now() - t0) / 1000)}s`);
    const all = results.join('\n'); console.log(all.split('\n').filter((l) => /^\[|BUG|OK/.test(l)).join('\n'));
  };
  for (let k = 0; k < JOBS; k++) next();
  return;
}

const H = require('./h.js');
const { first, row, grid } = require('./pages.js').helpers;
const idx = +arg('one', 0); const slot = +arg('slot', 0);
const S = list.find((x) => x.idx === idx) || { ...SHAPES[idx], idx, spec: spec(SHAPES[idx].shape) };
const bugs = []; const log = (s) => console.log(s); const bug = (s) => { bugs.push(s); log(`  BUG ${S.shape}: ${s}`); };

(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 720, pos: [slot * 14, slot * 14] });
  const sp = S.spec; log(`[${idx}] ${S.shape} (${S.count} on real sites)`);
  try {
    await H.panel(page, true);
    // ── BUILD, through the palette ──
    let ids;
    if (sp.kind === 'grid') {
      const g = await grid(page, sp.n, sp.repeated ? 2 : 1);
      ids = await page.evaluate((g) => { const el = document.querySelector(`[data-box-id="${g}"]`); const host = el.closest('[style*="grid"]') || el.parentElement; return Array.from(host.children).map((c) => c.getAttribute('data-box-id')).filter(Boolean); }, g);
    } else {
      const a = await first(page, 'Stack'); ids = await row(page, a, Array(sp.n - 1).fill('Stack'));
      if (sp.repeated) { const b = await first(page, 'Stack'); await row(page, b, Array(sp.n - 1).fill('Stack')); }
    }
    if (sp.nested) { // columns INSIDE the first column: a stack dropped in, and another beside it
      await H.dropInto(page, 'Stack', ids[0]);
      const inner = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"] [data-box-id]`)?.getAttribute('data-box-id'), ids[0]);
      if (inner) await row(page, inner, ['Stack']);
    }
    await H.panel(page, false); await H.fillStacks(page); await H.panel(page, false);
    // ── SIZE IT by dragging each inner edge to the target proportion, left to right, as a person does ──
    if (sp.kind === 'row') {
      for (let i = 0; i < sp.n - 1; i++) {
        const r = await H.rowOf(page, ids[0]); const k = r.kids.find((q) => q.id === ids[i]); if (!k) break;
        const target = (sp.shares.slice(0, i + 1).reduce((a, b) => a + b, 0) / 100) * r.inner;
        const d = Math.round(target - (k.l + k.w));
        if (Math.abs(d) > 2) { await H.select(page, ids[i]); await H.dragEdge(page, 'right', d); }
      }
      const r = await H.rowOf(page, ids[0]); const line = r.kids.filter((q) => ids.includes(q.id));
      const got = line.map((q) => Math.round((q.w / r.inner) * 100));
      const off = got.map((g, i) => Math.abs(g - sp.shares[i]));
      const oneLine = new Set(line.map((q) => q.t)).size === 1;
      log(`  built: ${got.join('/')} (target ${sp.shares.map(Math.round).join('/')}) ${oneLine ? 'on one line' : 'WRAPPED'}`);
      if (!oneLine) bug(`could not be built on one line at a 1024px page (${got.join('/')})`);
      else if (Math.max(...off) > 3) bug(`built ${got.join('/')} for a target of ${sp.shares.map(Math.round).join('/')}`);
      // ── ROUND TRIP every inner edge ──
      for (let i = 0; i < sp.n - 1; i++) {
        const before = await H.rowOf(page, ids[0]);
        for (const d of [60, -60]) { await H.select(page, ids[i]); await H.dragEdge(page, 'right', d); }
        const after = await H.rowOf(page, ids[0]);
        const same = before.kids.every((k) => { const e = after.kids.find((q) => q.id === k.id); return e && Math.abs(e.w - k.w) <= 2 && Math.abs(e.t - k.t) <= 2; });
        const probs = H.rowProblems(after);
        if (!same) bug(`edge ${i + 1} round trip did not return (${before.kids.map((k) => k.w).join('/')} → ${after.kids.map((k) => k.w).join('/')})`);
        if (probs.length) bug(`edge ${i + 1}: ${probs.join('; ')}`);
      }
    }
    await page.screenshot({ path: path.join(__dirname, `uatshape-${idx}-canvas.png`) });
    // ── PREVIEW at every size ──
    const canvas = await H.rowOf(page, ids[0]);
    const cShares = canvas.kids.filter((q) => ids.includes(q.id)).map((q) => (q.w / canvas.inner) * 100);
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click();
    await page.waitForSelector('iframe', { timeout: 15000 }); await page.waitForTimeout(1200);
    for (const w of [375, 768, 1024, 1280, 1920]) {
      await page.setViewportSize({ width: w, height: 800 }); await page.waitForTimeout(700);
      const f = await (await page.$('iframe')).contentFrame();
      const pv = await f.evaluate((ids) => {
        const d = document.documentElement; const els = ids.map((id) => document.querySelector('.bx-' + id.replace(/[^A-Za-z0-9_-]/g, '-'))).filter(Boolean);
        const rs = els.map((e) => e.getBoundingClientRect()); const pr = els[0]?.parentElement?.getBoundingClientRect();
        return { overflow: d.scrollWidth - d.clientWidth, lines: new Set(rs.map((r) => Math.round(r.top))).size, shares: pr ? rs.map((r) => (r.width / pr.width) * 100) : [], minW: Math.min(...rs.map((r) => r.width)) };
      }, ids);
      if (pv.overflow > 1) bug(`Preview ${w}: page scrolls sideways by ${pv.overflow}px`);
      if (w === 375 && pv.lines < Math.min(sp.n, 2) && sp.n > 1 && pv.minW < 150) bug(`Preview 375: ${sp.n} columns squeezed side by side (narrowest ${Math.round(pv.minW)}px) instead of stacking`);
      if (w === 1280 && pv.lines === 1 && cShares.length === pv.shares.length) {
        const diff = Math.max(...pv.shares.map((s, i) => Math.abs(s - cShares[i])));
        // The desktop scrollbar's share is the one accepted difference (#41) — see PREVIEW_SHARE_TOL in h.js.
        if (diff > H.PREVIEW_SHARE_TOL) bug(`Preview 1280 differs from the canvas by ${diff.toFixed(1)}% (${pv.shares.map(Math.round).join('/')} vs ${cShares.map(Math.round).join('/')})`);
      }
      if (w === 375) await page.screenshot({ path: path.join(__dirname, `uatshape-${idx}-preview375.png`) });
    }
  } catch (e) { bug('harness: ' + e.message.split('\n')[0]); }
  if (errs.length) bug('console errors: ' + errs.join(' | '));
  if (!bugs.length) log(`  OK ${S.shape}`);
  await browser.close();
})();
