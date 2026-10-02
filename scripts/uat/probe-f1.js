// HEADED UAT — BATCH F-1 (the page uses its space). Each case is BUILT THROUGH THE UI, then measured on the canvas at the
// device presets and in the real Preview at the rungs. One theme per window; six windows side by side.
//   NODE_PATH=node_modules node scripts/uat/probe-f1.js --case=acc|accdrag|cols|outer|deleted|links [--theme=Dark] [--slot=0]
const fs = require('fs'); const path = require('path');
const H = require('./h.js'); const P = require('./pages.js').helpers;
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const CASE = arg('case', 'acc'), THEME = arg('theme', 'Light'), SLOT = +arg('slot', 0);
const OUT = path.join(__dirname, 'probe-f1-out'); fs.mkdirSync(OUT, { recursive: true });
const tag = `${CASE}-${THEME.replace(/\W+/g, '')}`;
const PRESETS = { 375: 'Mobile (375px)', 768: 'Tablet (768px)', 1024: 'Laptop (1024px)', 1280: 'Desktop (1280px)', 1920: 'Wide (1920px)' };
const lines = []; let bad = 0;
const check = (ok, what) => { lines.push(`${ok ? 'OK  ' : 'FAIL'} ${what}`); if (!ok) bad++; };

/** Each block's width as a share of its parent's CONTENT box, its line (top), on the canvas or in the Preview. */
const measure = ([ids, engine]) => {
  const el = (id) => engine === 'canvas' ? document.querySelector(`[data-box-id="${id}"]`) : document.querySelector(`.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')}`);
  const out = {};
  // The COMPONENT, not the leaf a drop reports (F1-f): climb to the block whose parent block is a band of the page.
  const blockSel = engine === 'canvas' ? '[data-box-id]' : '[class*="bx-"]';
  const pageRoot = document.querySelector(blockSel);
  const column = (e) => { for (let x = e; x; x = x.parentElement?.closest(blockSel)) { const band = x.parentElement?.closest(blockSel); if (band && band.parentElement?.closest(blockSel) === pageRoot) return x; } return e; };
  for (const id of ids) { const e0 = el(id); if (!e0) { out[id] = null; continue; } const e = column(e0);
    // the band's line: the nearest flex-row ancestor (a drop onto the page lands in a band)
    let p = e.parentElement; while (p && !(getComputedStyle(p).display.includes('flex') && getComputedStyle(p).flexDirection === 'row') && p.parentElement) p = p.parentElement;
    const cs = getComputedStyle(p); const pr = p.getBoundingClientRect(); const r = e.getBoundingClientRect();
    const Z = engine === 'canvas' ? (e.closest('[data-canvas-scale]')?.dataset.canvasScale * 1 || 1) : 1;
    const inner = pr.width - (parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)) * Z;
    out[id] = { share: r.width / inner, w: r.width / Z, top: Math.round(r.top / Z), left: Math.round((r.left - pr.left) / Z), right: Math.round((pr.right - r.right) / Z), gap: parseFloat(cs.columnGap) || 0 }; }
  return out;
};
const atPreset = async (page, w) => { await page.getByRole('button', { name: PRESETS[w] }).first().click(); await page.waitForTimeout(800); };
const openPreview = async (page) => { await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500); await page.keyboard.press('h'); };
const frameAt = async (page, w) => { await page.setViewportSize({ width: w, height: 900 }); await page.waitForTimeout(450); let f = await (await page.$('iframe')).contentFrame();
  const inner = await f.evaluate(() => document.documentElement.clientWidth); if (inner !== w) { await page.setViewportSize({ width: w + (w - inner), height: 900 }); await page.waitForTimeout(350); f = await (await page.$('iframe')).contentFrame(); } return f; };

(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 720, pos: [(SLOT % 3) * 480, Math.floor(SLOT / 3) * 420] });
  page.setDefaultTimeout(12000);
  try {
    if (THEME !== 'Light') for (const b of ['Website theme', 'Change theme']) { await page.getByRole('button', { name: b }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(THEME) }).first().click(); await page.waitForTimeout(400); }
    await H.panel(page, true);
    let ids = []; let fills = {}; // id → true (fills its line) | false (hugs by nature)
    if (CASE === 'acc' || CASE === 'accdrag') {
      const a = await P.first(page, 'Accordion'); ids.push(a); fills[a] = true;
      if (CASE === 'acc') for (const [t, f] of [['Alert', true], ['Stat', false], ['Badge', false], ['Rating', false]]) { const n = await P.under(page, ids[0], t); ids.push(n); fills[n] = f; } // each straight under the Accordion — a Rating dropped on a Badge lands INSIDE it
    }
    if (CASE === 'cols' || CASE === 'outer' || CASE === 'deleted') {
      const c1 = await P.first(page, 'Stack'); const row = await P.row(page, c1, CASE === 'outer' ? ['Stack'] : ['Stack', 'Stack']);
      for (const c of row) await P.into(page, c, 'Text');
      ids = row;
    }
    if (CASE === 'links') { const l1 = await P.first(page, 'Link'); ids = await P.row(page, l1, ['Link', 'Link', 'Link']); }
    await H.panel(page, false); await page.keyboard.press('Escape');

    if (CASE === 'accdrag') { // the person sizes it: the right edge in by 300px at Desktop — that width is theirs
      await atPreset(page, 1280); await H.select(page, ids[0]); const before = (await page.evaluate(measure, [ids, 'canvas']))[ids[0]];
      await H.dragEdge(page, 'right', -300); await page.waitForTimeout(400);
      const after = (await page.evaluate(measure, [ids, 'canvas']))[ids[0]];
      check(after.w < before.w - 200, `dragged in: ${Math.round(before.w)} → ${Math.round(after.w)}px`);
      await page.reload(); await page.waitForTimeout(2500); await atPreset(page, 1280);
      const re = (await page.evaluate(measure, [ids, 'canvas']))[ids[0]];
      check(Math.abs(re.w - after.w) < 3, `after a reload it keeps ${Math.round(after.w)}px (${Math.round(re.w)})`);
      fills = { [ids[0]]: false }; // from here it must NOT fill: the space beside it is chosen
    }
    if (CASE === 'outer') { // the outer (right) edge of the last column in by 150px: the space opens THERE and stays
      await atPreset(page, 1280); const m0 = await page.evaluate(measure, [ids, 'canvas']);
      await H.select(page, ids[1]); await H.dragEdge(page, 'right', -150); await page.waitForTimeout(400);
      const m1 = await page.evaluate(measure, [ids, 'canvas']);
      check(Math.abs(m1[ids[0]].w - m0[ids[0]].w) < 2, `the first column keeps ${Math.round(m0[ids[0]].w)}px (${Math.round(m1[ids[0]].w)})`);
      check(Math.abs(m1[ids[1]].left - m0[ids[1]].left) < 2, `the dragged column's LEFT edge stays (${m0[ids[1]].left} → ${m1[ids[1]].left})`);
      check(m1[ids[1]].right > 120, `the space is at the outer edge: ${m1[ids[1]].right}px`);
    }
    if (CASE === 'deleted') { // three columns, the middle one deleted: the two left take the line — no hole
      await atPreset(page, 1280); await H.select(page, ids[1]); await page.keyboard.press('Delete'); await page.waitForTimeout(500); ids = [ids[0], ids[2]];
      const m = await page.evaluate(measure, [ids, 'canvas']); const used = m[ids[0]].share + m[ids[1]].share;
      check(used > 0.95, `two columns left use ${Math.round(used * 100)}% of the line`);
      // a joined-edge drag in that band opens no gap beside the other column (rule 3)
      await H.select(page, ids[0]); await H.dragEdge(page, 'right', 60); await page.waitForTimeout(400);
      const m2 = await page.evaluate(measure, [ids, 'canvas']); const used2 = m2[ids[0]].share + m2[ids[1]].share;
      check(used2 > 0.95 && m2[ids[0]].w > m[ids[0]].w + 40, `joined edge +60: ${Math.round(m[ids[0]].w)} → ${Math.round(m2[ids[0]].w)}px, line still ${Math.round(used2 * 100)}% used`);
    }

    // ── every rung: canvas, then Preview ──
    const verdict = (m, where, w) => {
      if (CASE === 'acc' || CASE === 'accdrag') for (const id of ids) { const s = m[id]; if (!s) { check(false, `${where} ${w}: ${id.slice(-4)} missing`); continue; }
        check(fills[id] ? s.share > 0.97 : CASE === 'accdrag' ? s.share < 0.9 : s.share < 0.6, `${where} ${w}: ${id.slice(-4)} ${fills[id] ? 'fills' : CASE === 'accdrag' ? 'keeps its dragged width' : 'hugs'} — ${Math.round(s.share * 100)}% of its line`); }
      if (CASE === 'cols' || CASE === 'deleted') { const byLine = {}; for (const id of ids) { const s = m[id]; (byLine[s.top] = byLine[s.top] || []).push(s); }
        for (const [t, ss] of Object.entries(byLine)) { const used = ss.reduce((n, s) => n + s.share, 0); check(used > 0.93, `${where} ${w}: line at ${t} — ${ss.length} column(s) use ${Math.round(used * 100)}%`); } }
      if (CASE === 'links') { const tops = new Set(ids.map((id) => m[id].top)); check(tops.size === 1, `${where} ${w}: four links on ${tops.size} line(s), gap ${m[ids[0]].gap}px`); }
    };
    const rungs = CASE === 'links' ? [375, 768, 1280] : CASE === 'cols' ? [375, 768, 1024, 1280, 1920] : [375, 768, 1280, 1920];
    for (const w of rungs) { await atPreset(page, w); verdict(await page.evaluate(measure, [ids, 'canvas']), 'canvas', w); await page.screenshot({ path: path.join(OUT, `${tag}-canvas-${w}.png`) }); }
    await openPreview(page);
    for (const w of [...rungs, ...(CASE === 'cols' ? [620, 899] : [])]) { const f = await frameAt(page, w); verdict(await f.evaluate(measure, [ids, 'preview']), 'Preview', w); await page.screenshot({ path: path.join(OUT, `${tag}-preview-${w}.png`) }); }
  } catch (e) { check(false, 'CRASH ' + e.message.split('\n')[0]); await page.screenshot({ path: path.join(OUT, `${tag}-crash.png`) }).catch(() => {}); }
  if (errs.length) check(false, 'page errors: ' + [...new Set(errs)].join(' | '));
  fs.writeFileSync(path.join(OUT, `${tag}.txt`), lines.join('\n'));
  console.log(`${tag}: ${lines.length - bad}/${lines.length} OK${bad ? ' — ' + lines.filter((l) => l.startsWith('FAIL')).join(' · ') : ''}`);
  await browser.close();
})();
