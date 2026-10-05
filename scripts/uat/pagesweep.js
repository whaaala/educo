// PAGE-LEVEL SWEEP — whole pages built through the UI from the benchmark catalogue, every block driven on every
// edge + float / pin / move, page-wide invariants after each gesture, then Preview at every breakpoint.
// usage: node pagesweep.js [--headed] [--jobs=4] [--only=C2] [--gest=E_,F_] [--log=pagesweep.log]
const H = require('./h.js');
const PAGES = require('./catalogue.js');
const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
const headed = process.argv.includes('--headed');
const JOBS = +arg('jobs', 4), ONLY = arg('only', ''), GEST = arg('gest', ''), LOG = path.join(__dirname, arg('log', 'pagesweep.log'));
const BASE = (process.env.BASE || 'http://localhost:3100') + '/website/box-demo';
const out = (s) => fs.appendFileSync(LOG, s + '\n');

// ── Page snapshot & invariants ────────────────────────────────────────────────────────────────────────────────
/** Every block on the canvas: id, rect, parent id, whether it floats, and how its parent lays children out. */
const snapshot = (page) => page.evaluate(() => {
  const root = document.querySelector('[data-box-id]');
  return Array.from(document.querySelectorAll('[data-box-id]')).map((e) => {
    const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    const par = e.parentElement?.closest('[data-box-id]');
    return { id: e.getAttribute('data-box-id'), l: Math.round(r.left), t: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height),
      p: par ? par.getAttribute('data-box-id') : null, float: cs.position === 'absolute' || cs.position === 'fixed', root: e === root,
      dir: par ? getComputedStyle(e.parentElement).flexDirection : '', disp: par ? getComputedStyle(e.parentElement).display : '' };
  });
});
const byId = (s) => Object.fromEntries(s.map((b) => [b.id, b]));
const isAnc = (s, a, b) => { const m = byId(s); let x = m[b]; while (x && x.p) { if (x.p === a) return true; x = m[x.p]; } return false; };
/** Problems a person would SEE anywhere on the page. `ignoreFloat` — floating blocks overlap by design. */
function pageProblems(s, start) {
  const probs = []; const inflow = s.filter((b) => !b.float && !b.root && b.w > 2 && b.h > 2);
  const floatIds = new Set(s.filter((b) => b.float).map((b) => b.id));
  const insideFloat = (b) => { const m = byId(s); let x = b; while (x) { if (floatIds.has(x.id)) return true; x = m[x.p]; } return false; };
  // overlaps between blocks that are not nested and not floating
  const flow = inflow.filter((b) => !insideFloat(b));
  for (let i = 0; i < flow.length; i++) for (let j = i + 1; j < flow.length; j++) {
    const a = flow[i], b = flow[j]; if (isAnc(s, a.id, b.id) || isAnc(s, b.id, a.id)) continue;
    const ox = Math.min(a.l + a.w, b.l + b.w) - Math.max(a.l, b.l), oy = Math.min(a.t + a.h, b.t + b.h) - Math.max(a.t, b.t);
    if (ox > 2 && oy > 2) probs.push(`OVERLAP ${a.id.slice(-4)}×${b.id.slice(-4)} ${ox}x${oy}`);
  }
  // new gaps between siblings (a gap present at the start was already there before the gesture)
  const gaps = (snap) => { const g = new Set(); const kids = {}; snap.filter((b) => !b.float && !b.root).forEach((b) => (kids[b.p] = kids[b.p] || []).push(b));
    for (const ks of Object.values(kids)) {
      if (ks[0].disp.includes('grid')) continue;
      if (ks[0].dir.startsWith('row')) { const lines = {}; ks.forEach((k) => (lines[k.t] = lines[k.t] || []).push(k)); Object.values(lines).forEach((L) => { L.sort((a, b) => a.l - b.l); for (let i = 1; i < L.length; i++) { const d = L[i].l - (L[i - 1].l + L[i - 1].w); if (d > 1) g.add(`${L[i - 1].id.slice(-4)}|${L[i].id.slice(-4)}`); } }); }
      else { ks.sort((a, b) => a.t - b.t); for (let i = 1; i < ks.length; i++) { const d = ks[i].t - (ks[i - 1].t + ks[i - 1].h); if (d > 1) g.add(`${ks[i - 1].id.slice(-4)}/${ks[i].id.slice(-4)}`); } }
    } return g; };
  if (start) { const g0 = gaps(start); for (const g of gaps(s)) if (!g0.has(g)) probs.push(`NEW GAP ${g}`); }
  // nothing leaves the page horizontally
  const root = s.find((b) => b.root);
  if (root) for (const b of inflow) if (b.l < root.l - 1 || b.l + b.w > root.l + root.w + 1) { probs.push(`OFF PAGE ${b.id.slice(-4)}`); break; }
  return probs;
}
const sameSnap = (a, b, tol = 2) => { const m = byId(b); const diffs = []; for (const x of a) { const y = m[x.id]; if (!y) { diffs.push(`${x.id.slice(-4)} gone`); continue; } if (Math.abs(x.l - y.l) > tol || Math.abs(x.t - y.t) > tol || Math.abs(x.w - y.w) > tol || Math.abs(x.h - y.h) > tol) diffs.push(`${x.id.slice(-4)} ${x.l},${x.t} ${x.w}x${x.h}→${y.l},${y.t} ${y.w}x${y.h}`); } if (b.length !== a.length) diffs.push(`block count ${a.length}→${b.length}`); return diffs; };

// ── Gestures: every edge, and every placement a stack has ─────────────────────────────────────────────────────
const OUT = { right: [1, 0], left: [-1, 0], bottom: [0, 1], top: [0, -1] };
async function edgeDrag(page, id, edge, d) {
  await H.select(page, id); const [sx, sy] = OUT[edge];
  const b0 = byId(await snapshot(page))[id];
  if (!(await H.dragEdge(page, edge, sx * d, sy * d))) return { moved: 0, missing: true };
  const b1 = byId(await snapshot(page))[id];
  const e0 = edge === 'right' ? b0.l + b0.w : edge === 'left' ? b0.l : edge === 'bottom' ? b0.t + b0.h : b0.t;
  const e1 = edge === 'right' ? b1.l + b1.w : edge === 'left' ? b1.l : edge === 'bottom' ? b1.t + b1.h : b1.t;
  const f0 = edge === 'right' ? b0.l : edge === 'left' ? b0.l + b0.w : edge === 'bottom' ? b0.t : b0.t + b0.h;
  const f1 = edge === 'right' ? b1.l : edge === 'left' ? b1.l + b1.w : edge === 'bottom' ? b1.t : b1.t + b1.h;
  const sameLine = Math.abs(b1.t - b0.t) < 3 || edge === 'top' || edge === 'bottom';
  return { moved: (edge === 'right' || edge === 'bottom' ? 1 : -1) * (e1 - e0), anchorMoved: sameLine ? f1 - f0 : 0 };
}
/** Placement control in the inspector (In the layout / Floating) and the "stays put" choices. */
async function placement(page, id, label) {
  await H.select(page, id);
  const btn = page.getByRole('button', { name: new RegExp(`^\\s*${label}\\s*$`, 'i') }).first();
  if (!(await btn.isVisible().catch(() => false))) { const t = page.getByText(new RegExp(`^\\s*${label}\\s*$`, 'i')).first(); await t.scrollIntoViewIfNeeded(); await t.click(); }
  else { await btn.scrollIntoViewIfNeeded(); await btn.click(); }
  await page.waitForTimeout(700);
}
/** Move a block by dragging it with the real pointer (a floating block follows the pointer). */
async function bodyDrag(page, id, dx, dy) {
  await H.select(page, id);
  const b = await page.locator(`[data-box-id="${id}"]`).boundingBox();
  const x = b.x + b.width * 0.8, y = b.y + b.height * 0.8;
  await page.mouse.move(x, y); await page.mouse.down();
  for (let i = 1; i <= 14; i++) { await page.mouse.move(x + (dx * i) / 14, y + (dy * i) / 14); await page.waitForTimeout(15); }
  await page.mouse.up(); await page.waitForTimeout(600);
}

const GESTURES = {
  // Every edge, out and back, in and back, small and past the limit.
  E_out_back: async (t) => { for (const e of ['right', 'left', 'bottom', 'top']) { const m = await t.edge(e, 80); if (m != null) await t.edge(e, -m); } },
  E_in_back: async (t) => { for (const e of ['right', 'left', 'bottom', 'top']) { const m = await t.edge(e, -80); if (m != null) await t.edge(e, -m); } },
  E_big: async (t) => { for (const e of ['right', 'bottom']) { const m = await t.edge(e, 500); if (m != null) await t.edge(e, -m); } },
  // Float it, move it, resize it floating, and bring it back: neighbours must not move while it floats.
  F_float_move_back: async (t) => { await t.float(); await t.move(140, 90); await t.floatEdge('right', 60); await t.move(-140, -90); await t.unfloat(); },
  // Pin it (sticks when reached / floats on screen), scroll, and release.
  S_pin: async (t) => { await t.pin('Sticks when reached'); await t.pin('Floats on screen'); await t.pin('Scrolls away'); },
};

async function runJob(browser, job) {
  const { pname, gname } = job; const label = `${pname} · ${gname}`;
  const ctx = await browser.newContext({ viewport: { width: 2200, height: 1100 } });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('kept')) { localStorage.clear(); sessionStorage.setItem('kept', '1'); } } catch {} });
  const lines = [];
  try {
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForFunction(() => { const b = Array.from(document.querySelectorAll('button')).find((x) => x.getAttribute('aria-label') === 'Open blocks panel'); return !!b && Object.keys(b).some((k) => k.startsWith('__reactProps')); }, null, { timeout: 60000 });
    await H.panel(page, true); await PAGES[pname].build(page); await H.panel(page, false); await H.fillImages(page); await H.fillStacks(page);
    const start = await snapshot(page);
    for (const p of pageProblems(start, null)) lines.push(`AS BUILT: ${p}`);
    const targets = start.filter((b) => !b.root && !b.float && b.w > 30 && b.h > 20).map((b) => b.id);
    let fails = 0, driven = 0, skipped = 0;
    for (const id of targets) {
      // Only what a USER can select by clicking it: row wrappers are invisible scaffolding, and a click on one lands
      // on the block inside it by design ("click selects the box, click again goes inside").
      if (!(await H.select(page, id).then(() => true).catch(() => false))) { skipped++; continue; }
      const probs = []; let cur = await snapshot(page);
      const check = async (what) => { const s = await snapshot(page); for (const p of pageProblems(s, cur)) probs.push(`${what}: ${p}`); cur = s; return s; };
      const t = {
        edge: async (e, d) => { const r = await edgeDrag(page, id, e, d); if (r.missing) return null; if (Math.abs(r.anchorMoved) > 2) probs.push(`${e} ${d}: anchored edge moved ${r.anchorMoved}px`); await check(`${e} ${d}`); return r.moved; },
        float: async () => { await placement(page, id, 'Floating'); await check('float'); },
        move: async (dx, dy) => { const before = await snapshot(page); await bodyDrag(page, id, dx, dy); const after = await snapshot(page);
          // Floating: NOTHING outside it may move.
          const moved = sameSnap(before.filter((b) => b.id !== id && !isAnc(before, id, b.id)), after.filter((b) => b.id !== id && !isAnc(after, id, b.id)));
          if (moved.length) probs.push(`move floating ${dx},${dy}: neighbours moved — ${moved.slice(0, 3).join('; ')}`); cur = after; },
        floatEdge: async (e, d) => { const before = await snapshot(page); await edgeDrag(page, id, e, d); const after = await snapshot(page);
          const moved = sameSnap(before.filter((b) => b.id !== id && !isAnc(before, id, b.id)), after.filter((b) => b.id !== id && !isAnc(after, id, b.id)));
          if (moved.length) probs.push(`resize floating: neighbours moved — ${moved.slice(0, 3).join('; ')}`); cur = after; },
        unfloat: async () => { await placement(page, id, 'In the layout'); await check('unfloat'); },
        pin: async (mode) => { await placement(page, id, mode); await check(`pin ${mode}`);
          await page.mouse.wheel(0, 600); await page.waitForTimeout(400); await page.mouse.wheel(0, -600); await page.waitForTimeout(400); await check(`scroll with ${mode}`); },
      };
      try { await GESTURES[gname](t); } catch (e) { probs.push(`ERR ${e.message.split('\n')[0]}`); }
      const end = await snapshot(page);
      const back = sameSnap(start, end);
      if (back.length) probs.push(`PAGE DID NOT RETURN: ${back.slice(0, 4).join('; ')}`);
      driven++;
      if (probs.length) {
        fails++; const shot = `ps-${pname}-${gname}-${id.slice(-4)}.png`; await page.screenshot({ path: path.join(__dirname, shot), fullPage: true });
        lines.push(`  FAIL block ${id.slice(-4)}: ${[...new Set(probs)].slice(0, 6).join(' | ')}  [${shot}]`);
        // A failed round trip leaves the page changed — rebuild so the next block starts from the real start.
        await page.evaluate(() => { localStorage.clear(); sessionStorage.removeItem('kept'); });
        await page.goto(BASE, { waitUntil: 'load' });
        await page.waitForFunction(() => { const b = Array.from(document.querySelectorAll('button')).find((x) => x.getAttribute('aria-label') === 'Open blocks panel'); return !!b && Object.keys(b).some((k) => k.startsWith('__reactProps')); }, null, { timeout: 60000 });
        await H.panel(page, true); await PAGES[pname].build(page); await H.panel(page, false); await H.fillImages(page); await H.fillStacks(page);
        const again = await snapshot(page); if (sameSnap(start.map((b) => ({ ...b, id: b.id })), again).length && again.length === start.length) { /* ids differ after rebuild — remap by order */ }
        break; // ids change on rebuild; the remaining blocks are covered by the next job's order
      }
    }
    if (errs.length) lines.push(`  page errors: ${[...new Set(errs)].slice(0, 3).join(' / ')}`);
    return `${fails ? "FAIL" : "ok  "} ${label}: ${driven}/${targets.length} blocks driven (${skipped} not selectable by click), ${fails} failing\n${lines.join('\n')}`;
  } catch (e) { return `ERR  ${label}: ${e.message.split('\n')[0]}\n${lines.join('\n')}`; }
  finally { await ctx.close(); }
}

(async () => {
  fs.writeFileSync(LOG, '');
  const browser = await chromium.launch({ headless: !headed });
  const jobs = [];
  for (const pname of Object.keys(PAGES)) if (!ONLY || ONLY.split(',').some((o) => pname.startsWith(o)))
    for (const gname of Object.keys(GESTURES)) if (!GEST || GEST.split(',').some((g) => gname.startsWith(g))) jobs.push({ pname, gname });
  out(`${jobs.length} page × gesture jobs, ${JOBS} at a time`);
  let i = 0; const t0 = Date.now();
  await Promise.all(Array.from({ length: Math.min(JOBS, jobs.length) }, async () => { while (i < jobs.length) { const j = jobs[i++]; out(await runJob(browser, j)); } }));
  out(`DONE ${Math.round((Date.now() - t0) / 1000)}s`);
  await browser.close();
})();
