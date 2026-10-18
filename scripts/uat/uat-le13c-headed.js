// HEADED UAT — BATCH LE-13c · Space round it, the gap between a wrapped picture and its words (docs/TASK_TREE.md, "BATCH LE-13c",
// checklist H1 … H7). Every state BUILT THROUGH THE UI (RULE Y): palette tiles, Position → Wrap words round it / Words follow / Space
// round it moved BY KEYBOARD (Home, →). Six visible windows; the Preview at every width of screens.js (RULE Z), its controls hidden
// for pictures; localStorage only READ. The builders and the line measurements are uat-le13-headed.js's own (reused, not copied).
//   gapStart  H1 · H3 · H7  Start: the default shown; a bigger step — the words beside and under move that far, every width, canvas ==
//                           Preview; 0 — right up to it; Back to default; undo / redo; reload keeps it
//   gapEnd    H2            End: the same on the other side
//   gapRound  H4            Its round corners: the lines keep the space from the curve (shape-margin)
//   gapCut    H4            A cut-out's outline: the lines keep the space from the disc
//   gapPhone  H5            a Desktop space and a Mobile space: each on its own screens
//   chrome    H6            only with the wrap; by keyboard; hint and button readable — four editor themes × 375 · 768 · 1280 · 1536
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le13c-headed.js [--only=gapStart,chrome]
const path = require('path'); const fs = require('fs');
const H = require('./h.js');
const { WIDTHS, EDGE } = require('./screens.js');
const { site, sleep, deselect, ins, pvOpen, pvAt, pvClose, chip } = require('./uat-rx3-headed.js');
const L = require('./uat-le13-headed.js');
const { photoStory, pick, sec, first, into, under, closeIns, rects, lines, canvasRects, canvasLines, wrapCheck, shapeCheck, circleStyle, circleOf, discPng, discOf, nodeIn, changed, CONTRAST, near, REM } = L;
const W = require('../../config/inspector.json').flow;
const FLOW = require('../../config/layout.json').flow;
const OUT = path.join(__dirname, 'logs', 'le13c'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const results = [];
const rec = (job, id, ok, ev) => { results.push({ job, id, ok, ev }); console.log(`[${job}] ${id} ${ok ? 'PASS' : 'FAIL'} · ${ev}`); };
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') }).catch(() => {});
async function pvShot(page, name) {
  const hide = page.getByRole('button', { name: 'Hide the preview controls' }); const hid = await hide.isVisible().catch(() => false);
  if (hid) { await hide.click(); await sleep(page, 300); }
  await shot(page, name);
  if (hid) { await page.getByRole('button', { name: 'Show the preview controls' }).click().catch(() => {}); await sleep(page, 300); }
}
const DEFAULT = FLOW.wrapGapRem * REM;
const stored = async (page, id) => nodeIn(await site(page), id).n;
const slider = (page) => ins(page).getByRole('slider', { name: W.gap, exact: true }).first();
/** Space round it BY KEYBOARD: focus, Home (0), then → one step of the spacing scale at a time until the stored value reaches `px`. */
async function setGap(page, pic, px, slot = (n) => n?.wrapGap) {
  await sec(page, pic, 'Position'); const s = slider(page); await s.scrollIntoViewIfNeeded(); await s.focus();
  await page.keyboard.press('Home'); await sleep(page, 300);
  for (let i = 0; i < 24; i++) { const v = slot(await stored(page, pic)); if (v != null && v >= px) return v; await page.keyboard.press('ArrowRight'); await sleep(page, 200); }
  return slot(await stored(page, pic));
}
/** The space as the browser lays it out: the margin on its open side, below, and round its shape (px), in the Preview or the canvas. */
const SPACE = (sel, side) => { const e = document.querySelector(sel); const c = getComputedStyle(e); return { side: parseFloat(side === 'start' ? c.marginInlineEnd : c.marginInlineStart), below: parseFloat(c.marginBottom), shape: parseFloat(c.shapeMargin) || 0, fl: c.float }; };
const pvSpace = (f, pic, side) => f.evaluate(`(${SPACE})(".bx-${pic}", "${side}")`);
const cvSpace = (page, pic, side) => page.evaluate(`(${SPACE})('[data-box-id="${pic}"]', "${side}")`);
/** The words' measured distance from the picture: the nearest beside-line, and whether a full line comes back before the space below ends. */
function measured(r, P, st, pic, side) {
  const all = P.flat(); const beside = all.filter((x) => x.t < r[pic].b - 2 && x.b > r[pic].t + 2);
  const near1 = beside.length ? (side === 'start' ? Math.min(...beside.map((x) => x.l)) - r[pic].r : r[pic].l - Math.max(...beside.map((x) => x.r))) : null;
  const back = all.filter((x) => (side === 'start' ? near(x.l, r[st].l, 3) : true) && x.t >= r[pic].t - 1 && (side === 'start' ? true : x.r > r[pic].l + 20) && x.t > r[pic].b - 2);
  return { beside: beside.length, near: near1 == null ? null : +near1.toFixed(1), firstBack: back.length ? Math.min(...back.map((x) => x.t)) : null };
}
/** Every width of screens.js: where it floats, the words keep exactly the laid-out space beside it and below; `want(w, m)` judges it. */
async function sweep(page, J, { st, pic, t }, side, label, tag, want, opts = {}) {
  const bad = []; let floated = 0, exact = 0; let f = await pvOpen(page);
  for (const w of WIDTHS) {
    f = await pvAt(page, w); const r = await rects(f, [st, pic, ...t]); const P = await Promise.all(t.map((id) => lines(f, id))); const m = await pvSpace(f, pic, side);
    const was = bad.length;
    if (r.sw > r.vw) bad.push(`${w}: sideways ${r.sw}`);
    if (m.fl !== 'none') {
      floated++;
      const x = want(w, m); if (x) bad.push(`${w}: ${x}`);
      if (opts.shape) bad.push(...shapeCheck(r, P, pic, side, opts.shape(r[pic]), true, t, m.shape).bad.map((b) => `${w}: ${b}`));
      else {
        bad.push(...wrapCheck(r, P, st, pic, side, t, m.side).bad.map((b) => `${w}: ${b}`));
        const g = measured(r, P, st, pic, side);
        // LE13c-3: at Start the lines begin AT the space; at End they are ragged on their right, so the space is a floor there
        // (wrapCheck holds it) and the longest line meets it on some widths — counted below
        if (g.near != null && near(g.near, m.side, 1.5)) exact++;
        else if (side === 'start' || g.near == null) bad.push(`${w}: the nearest word is ${g.near}px from the picture, the space is ${m.side}px`);
        if (g.firstBack != null && g.firstBack < r[pic].b + m.below - 1.5) bad.push(`${w}: a full line comes back at ${g.firstBack}, inside the space below (${r[pic].b} + ${m.below})`);
      }
      if (bad.length > was) { fs.writeFileSync(path.join(OUT, `${tag}-FAIL-${w}.json`), JSON.stringify({ r, P, m }, null, 1)); await pvShot(page, `${tag}-FAIL-${w}`); }
    }
    if ([375, 768, 1280, 1920].includes(w)) await pvShot(page, `${tag}-${w}`);
  }
  await pvClose(page, 1366);
  rec(J, `${label} at ${WIDTHS.length} widths (${floated} where it floats, the nearest word exactly the space away on ${exact}): the words keep the laid-out space beside and below it, never sideways`, !bad.length && floated > 0 && (opts.shape || exact > 0), bad.slice(0, 3).join(' | ') || 'ok');
}
/** canvas == Preview at 1280: the laid-out space, and the first lines' start (or end) relative to the Stack, within 2px. */
async function same(page, J, { st, pic, t }, side, label) {
  await chip(page, 'Desktop (1280px)'); await deselect(page); await sleep(page, 500);
  const cs = await cvSpace(page, pic, side); const cv = await canvasRects(page, [st]); const cl = await canvasLines(page, t[0]);
  let f = await pvOpen(page); f = await pvAt(page, 1280); const ps = await pvSpace(f, pic, side); const r = await rects(f, [st]); const pl = await lines(f, t[0]); await pvClose(page, 1366);
  const k = Math.min(cl.length, pl.length, 6); const d = [];
  for (let i = 0; i < k; i++) d.push(+(side === 'start' ? (cl[i].l - cv[st].l) - (pl[i].l - r[st].l) : (cv[st].r - cl[i].r) - (r[st].r - pl[i].r)).toFixed(1));
  rec(J, `${label} canvas == Preview at 1280: the space (${cs.side} / ${ps.side}px) and the first ${k} lines within 2px`, near(cs.side, ps.side, 1) && near(cs.shape, ps.shape, 1) && k >= 3 && d.every((x) => Math.abs(x) <= 2), `space ${cs.side}/${ps.side} · shape ${cs.shape}/${ps.shape} · lines ${d.join(' ')}`);
}
const bigger = (w, m) => (m.side > DEFAULT + 4 && near(m.below, m.side, 0.5) ? '' : `the space ${m.side} / ${m.below}px is not bigger than the default ${DEFAULT}px on both sides`);

const JOBS = {
  async gapStart(page, J) {
    const story = await photoStory(page); const { pic } = story;
    await pick(page, pic, 'Position', W.wrap, W.wrapChoices.start);
    const vt = await slider(page).getAttribute('aria-valuetext'); await shot(page, 'H1-default-inspector');
    rec(J, 'H1 Space round it shows the default', vt === `${W.gapDefault} · ${FLOW.wrapGapRem}rem` && (await stored(page, pic)).wrapGap == null, `"${vt}"`);
    const v = await setGap(page, pic, 32); await shot(page, 'H1-set-inspector');
    rec(J, 'H1 moved by keyboard to a bigger step: stored on the spacing scale', v >= 32 && v <= FLOW.wrapGapMax, `wrapGap ${v} · "${await slider(page).getAttribute('aria-valuetext')}"`);
    await same(page, J, story, 'start', 'H1');
    await sweep(page, J, story, 'start', 'H1 Start', 'H1-start', bigger);
    // H7 · undo / redo, then a reload keeps it
    await page.evaluate(() => document.activeElement?.blur()); await page.keyboard.press('Control+z'); await sleep(page, 500); const undone = (await stored(page, pic)).wrapGap;
    await page.keyboard.press('Control+y'); await sleep(page, 500); const redone = (await stored(page, pic)).wrapGap;
    rec(J, 'H7 undo steps the space back, redo forward', undone !== v && redone === v, `${v} → undo ${undone} → redo ${redone}`);
    await page.reload(); await page.waitForFunction(() => !!document.querySelector('[data-box-id]'), null, { timeout: 60000 }); await sleep(page, 1500);
    let f = await pvOpen(page); f = await pvAt(page, 1280); const kept = await pvSpace(f, pic, 'start'); await pvClose(page, 1366);
    rec(J, 'H7 after a reload the space is still there, in the store and the Preview', (await stored(page, pic)).wrapGap === v && kept.side > DEFAULT + 4, `wrapGap ${(await stored(page, pic)).wrapGap} · ${kept.side}px`);
    // H3 · 0: the words right up to it; Back to default: config's again
    await sec(page, pic, 'Position'); await slider(page).focus(); await page.keyboard.press('Home'); await sleep(page, 400);
    rec(J, 'H3 Home → 0 stored', (await stored(page, pic)).wrapGap === 0, `wrapGap ${(await stored(page, pic)).wrapGap}`);
    await sweep(page, J, story, 'start', 'H3 0', 'H3-zero', (w, m) => (m.side === 0 && m.below === 0 ? '' : `the space is ${m.side} / ${m.below}px, not 0`));
    await sec(page, pic, 'Position'); const back = ins(page).getByRole('button', { name: `${W.gap} — ${W.gapBack}`, exact: true });
    await back.focus(); await page.keyboard.press('Enter'); await sleep(page, 400);
    f = await pvOpen(page); f = await pvAt(page, 1280); const d = await pvSpace(f, pic, 'start'); await pvShot(page, 'H3-default-1280'); await pvClose(page, 1366);
    await sec(page, pic, 'Position'); // LE13c-4: the Preview deselected the picture — its Position again, for the button's own words
    rec(J, 'H3 Back to default (by keyboard): nothing stored, the default space again, the button now says so', (await stored(page, pic)).wrapGap === undefined && near(d.side, DEFAULT, 0.5) && (await back.isDisabled()) && (await back.textContent()) === W.gapAtDefault, `wrapGap ${(await stored(page, pic)).wrapGap} · ${d.side}px · "${await back.textContent()}"`);
  },

  async gapEnd(page, J) {
    const story = await photoStory(page); const { pic } = story;
    await pick(page, pic, 'Position', W.wrap, W.wrapChoices.end);
    const v = await setGap(page, pic, 48);
    rec(J, 'H2 End, moved by keyboard to a bigger step', v >= 48, `wrapGap ${v}`);
    await same(page, J, story, 'end', 'H2');
    await sweep(page, J, story, 'end', 'H2 End', 'H2-end', bigger);
  },

  async gapRound(page, J) {
    const story = await photoStory(page); const { pic } = story;
    await circleStyle(page, pic);
    await pick(page, pic, 'Position', W.wrap, W.wrapChoices.start);
    await pick(page, pic, 'Position', W.shape, W.shapeChoices.round);
    const v = await setGap(page, pic, 32);
    rec(J, 'H4 round corners with a space of its own', v >= 32 && (await stored(page, pic)).wrapShape === 'round', `wrapGap ${v}`);
    await same(page, J, story, 'start', 'H4 round');
    await sweep(page, J, story, 'start', 'H4 round, the space round the curve', 'H4-round', (w, m) => (near(m.shape, m.side, 0.5) && m.shape > DEFAULT + 4 ? '' : `shape-margin ${m.shape} vs the space ${m.side}`), { shape: circleOf });
  },

  async gapCut(page, J) {
    const story = await photoStory(page); const { pic } = story;
    await H.select(page, pic); await page.locator('input[aria-label="Upload image"]').last().setInputFiles(await discPng(page)); await sleep(page, 2500);
    await pick(page, pic, 'Position', W.wrap, W.wrapChoices.start);
    await pick(page, pic, 'Position', W.shape, W.shapeChoices.outline); await sleep(page, 800);
    const v = await setGap(page, pic, 24);
    const n = await stored(page, pic);
    rec(J, 'H4 a cut-out\'s outline with a space of its own', v >= 24 && /^polygon\(/.test(n.wrapOutline || ''), `wrapGap ${v} · ${String(n.wrapOutline).slice(0, 40)}…`);
    await same(page, J, story, 'start', 'H4 outline');
    await sweep(page, J, story, 'start', 'H4 outline, the space round the disc', 'H4-cut', (w, m) => (near(m.shape, m.side, 0.5) && m.shape > DEFAULT ? '' : `shape-margin ${m.shape} vs the space ${m.side}`), { shape: discOf });
  },

  async gapPhone(page, J) {
    const story = await photoStory(page); const { pic } = story;
    await pick(page, pic, 'Position', W.wrap, W.wrapChoices.start);
    await chip(page, 'Desktop (1280px)'); const desk = await setGap(page, pic, 48);
    await chip(page, 'Mobile (375px)'); const phone = await setGap(page, pic, 4, (n) => Object.values(n?.responsive || {}).map((o) => o?.wrapGap).find((x) => x !== undefined));
    await chip(page, 'Desktop (1280px)');
    const n = await stored(page, pic);
    rec(J, 'H5 a Desktop space and a Mobile space, each stored on its own screen', n.wrapGap === desk && phone < desk && Object.values(n.responsive || {}).some((o) => o?.wrapGap === phone), `base ${n.wrapGap} · ${JSON.stringify(n.responsive || {})}`);
    let small = 0, large = 0;
    await sweep(page, J, story, 'start', 'H5 per screen', 'H5-phone', (w, m) => {
      if (w < EDGE.TP) { small++; return m.side < DEFAULT ? '' : `a phone shows ${m.side}px, not the Mobile space`; }
      large++; return m.side > DEFAULT + 4 ? '' : `${w} shows ${m.side}px, not the Desktop space`;
    });
    rec(J, 'H5 both screens were seen floating (a phone wide enough to wrap, and the tablet up)', small > 0 && large > 0, `phone widths ${small} · tablet up ${large}`);
  },

  async chrome(page, J) {
    const base = process.env.BASE || 'http://localhost:3100';
    for (const theme of ['light', 'dark', 'midnight', 'purple']) {
      await page.evaluate(() => sessionStorage.removeItem('kept')).catch(() => {}); // h.js's start-empty runs again: each theme begins on an empty page
      await page.goto(`${base}/website/box-demo?theme=${theme}`); await page.waitForFunction(() => !!document.querySelector('[data-box-id]'), null, { timeout: 60000 }); await sleep(page, 1200);
      await page.setViewportSize({ width: 1366, height: 860 }); await sleep(page, 400);
      const st = await first(page, 'Stack'); const pic = await into(page, st, 'Image'); await under(page, pic, 'Text');
      for (const w of [375, 768, 1280, 1536]) {
        await page.setViewportSize({ width: w, height: 860 }); await sleep(page, 500);
        let ok = true; const ev = [];
        try {
          await closeIns(page); await sec(page, pic, 'Position');
          const none = await ins(page).getByRole('slider', { name: W.gap, exact: true }).count(); ev.push(`with the wrap off ${none}`); if (none) ok = false;
          const end = ins(page).getByRole('group', { name: W.wrap, exact: true }).getByRole('button', { name: W.wrapChoices.end, exact: true });
          await end.scrollIntoViewIfNeeded(); await end.focus(); await page.keyboard.press('Enter'); await sleep(page, 400);
          // LE13c-2: at 375 / 768 the editor edits the phone's / tablet's screen (LE4-5) — read the slot the key CHANGED
          const s = slider(page); await s.scrollIntoViewIfNeeded(); await s.focus(); const was = await stored(page, pic); await page.keyboard.press('ArrowRight'); await sleep(page, 400);
          const v = changed(was, await stored(page, pic), 'wrapGap'); ev.push(`→ ${v}`); if (typeof v !== 'number') ok = false;
          const focused = await s.evaluate((e) => e === document.activeElement && getComputedStyle(e).outlineStyle !== 'none'); ev.push(`focus shown ${focused}`); if (!focused) ok = false;
          const hint = await ins(page).getByText(W.gapHint).first().evaluate(CONTRAST); ev.push(`hint ${hint}:1`); if (hint < 4.5) ok = false;
          const back = ins(page).getByRole('button', { name: `${W.gap} — ${W.gapBack}`, exact: true });
          const bc = await back.evaluate(CONTRAST); ev.push(`button ${bc}:1`); if (bc < 4.5) ok = false;
          const clip = await ins(page).evaluate((a) => { const r = a.getBoundingClientRect(); const s = a.querySelector('input[type=range]').getBoundingClientRect(); return s.left < r.left - 1 || s.right > r.right + 1; }); ev.push(`clipped ${clip}`); if (clip) ok = false;
          if (w === 375 || w === 1536) await shot(page, `H6-${theme}-${w}`);
          const before = await stored(page, pic); await back.focus(); await page.keyboard.press('Enter'); await sleep(page, 400);
          // LE13c-5: on a phone / tablet screen a clear is stored as null (`updateBoxResponsive`: it resolves to the default)
          const after = changed(before, await stored(page, pic), 'wrapGap'); const says = await back.textContent();
          ev.push(`back ${after} "${says}"`); if (after != null || says !== W.gapAtDefault || !(await back.isDisabled())) ok = false;
          const off = ins(page).getByRole('group', { name: W.wrap, exact: true }).getByRole('button', { name: W.wrapChoices.off, exact: true });
          await off.focus(); await page.keyboard.press('Enter'); await sleep(page, 400);
          await page.keyboard.press('Escape'); await deselect(page);
        } catch (e) { ok = false; ev.push(e.message.split('\n')[0]); await shot(page, `H6-ERR-${theme}-${w}`); }
        rec(J, `H6 ${theme} · ${w}: only with the wrap; by keyboard; focus shown; hint and button readable; nothing clipped; Back to default`, ok, ev.join(' · '));
      }
    }
  },
};

(async () => {
  const names = Object.keys(JOBS).filter((n) => !ONLY.length || ONLY.includes(n));
  let slot = 0; const queue = [...names];
  const worker = async (s) => {
    while (queue.length) {
      const J = queue.shift();
      const { browser, page, errs } = await H.open({ headed: true, w: 1366, h: 860, pos: [(s % 3) * 620, Math.floor(s / 3) * 480] });
      try { await JOBS[J](page, J); } catch (e) { rec(J, 'ERROR', false, `${page.__step || ''} ${e.message.split('\n')[0]}`); await shot(page, `ERR-${J}`); }
      rec(J, 'console', !errs.length, errs.join(' | ') || 'no errors');
      await browser.close();
    }
  };
  await Promise.all(Array.from({ length: Math.min(6, names.length) }, () => worker(slot++)));
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.ok);
  console.log(`SUMMARY ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})();
