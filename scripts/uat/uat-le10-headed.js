// HEADED UAT — BATCH LE-10 · where am I (ED-2; docs/TASK_TREE.md "BATCH LE-10", checklist H1 … H6). Every state BUILT
// THROUGH THE UI (RULE Y): palette tiles dropped into each other, blocks selected by clicking (click, click again goes inside),
// the trail clicked, tapped and keyed; localStorage only READ. Six visible windows; every width of screens.js (RULE Z).
//   trail   H1 · H2  Stack › Side by side › Heading: the trail named, the Heading current; a click on each selects it
//   escape  H3       Escape walks out through exactly the blocks the trail named
//   top     H4       a Heading on the page: no trail · a block in a Grid: the trail names the Grid · Ctrl+Z keeps it right
//   keys    H5       Tab reaches each crumb with a ring, Enter selects, focus on the new name, Tab carries on in the Inspector
//   chrome  H6       four editor themes × 375 · 768 · 1280 · 1536: a five-deep trail readable, wrapped not clipped
//   widths  H6       every width of screens.js: nothing sideways; a touch phone: ≥ 44 px targets, a tap selects, the sheet stays
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le10-headed.js [--only=trail,keys]
const path = require('path'); const fs = require('fs');
const H = require('./h.js');
const { WIDTHS } = require('./screens.js');
const { sleep, deselect, band, into, ins, expandInspector, tileThen, nodeOf, parentOf, allIds } = require('./uat-rx3-headed.js');
const { CONTRAST } = require('./uat-le13-headed.js');
const T = require('../../config/inspector.json').trail;
const OUT = path.join(__dirname, 'logs', 'le10'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const results = [];
const rec = (job, id, ok, ev) => { results.push({ job, id, ok, ev }); console.log(`[${job}] ${id} ${ok ? 'PASS' : 'FAIL'} · ${ev}`); };
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') }).catch(() => {});

const nav = (page) => ins(page).getByRole('navigation', { name: T.label });
/** What the Inspector's header says, and the trail's parts: [names…], the one marked current. */
async function header(page) {
  // LE10-3: with the drawer already open on a phone, "Expand inspector" still sits UNDER it (a person never sees it) — open it only when shut
  if (!(await ins(page).isVisible().catch(() => false))) await expandInspector(page);
  const line = ins(page).getByText(new RegExp(`^${T.lead}`)).first();
  const text = (await line.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
  const has = await nav(page).count();
  const crumbs = has ? await nav(page).getByRole('button').allInnerTexts() : [];
  const current = await ins(page).locator('[aria-current="location"]').allInnerTexts();
  return { text, has: !!has, crumbs, current };
}
const crumb = (page, name) => nav(page).getByRole('button', { name, exact: true });
/** Stack › Side by side › Heading, from the palette (each dropped INTO the one before). */
async function nest(page, depth = 3) {
  const tiles = ['Side by side', 'Stack', 'Side by side'];
  const ids = [await band(page, 'Stack')];
  for (let i = 0; i < depth - 2; i++) ids.push(await into(page, ids[ids.length - 1], tiles[i]));
  ids.push(await into(page, ids[ids.length - 1], 'Heading'));
  await H.panel(page, false);
  return ids;
}
/** A phone's route (LE10-4): select the host, open the blocks sheet, Add it → Inside, tap the tile. Returns the new block's id. */
async function addInside(page, host, tile) {
  const before = new Set(await allIds(page));
  await H.panel(page, false); await H.select(page, host); await H.panel(page, true);
  await page.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: 'Inside' }).first().tap();
  await page.locator('[draggable="true"]').filter({ hasText: new RegExp('^\\s*' + tile) }).first().tap(); await sleep(page, 600);
  // LE10-6: a tile with styles asks "Add Heading as…" first — a person picks Default
  const style = page.getByRole('menuitem').first(); if (await style.isVisible().catch(() => false)) { await style.tap(); await sleep(page, 900); }
  await H.panel(page, false);
  // the block the tile made — not the row band a Stack wraps it in
  for (const id of (await allIds(page)).filter((x) => !before.has(x))) { const n = await nodeOf(page, id); if (!n.rowBand) return id; }
  throw new Error(`Inside → ${tile} added nothing into ${host.slice(-4)}`);
}
const names = (n) => ['Stack', 'Side by side', 'Stack', 'Side by side'].slice(0, n);

const JOBS = {
  async trail(page, J) {
    const [st, sbs, h] = await nest(page);
    await H.select(page, h); let s = await header(page); await shot(page, 'H1-trail-1366');
    rec(J, 'H1 the Heading: "Editing: Stack › Side by side › Heading", the Heading current', s.has && JSON.stringify(s.crumbs) === JSON.stringify(['Stack', 'Side by side']) && /heading/i.test(s.current.join()) && s.text.replace(/\s/g, '').toLowerCase() === `${T.lead}StackSidebysideHeading`.toLowerCase(), JSON.stringify(s));
    rec(J, 'H1 no row band and no page in the trail (only the blocks I made)', s.crumbs.length === 2, `crumbs ${s.crumbs.length}: ${s.crumbs.join(' › ')}`);
    await crumb(page, 'Stack').click(); await sleep(page, 500); s = await header(page); await shot(page, 'H2-stack-selected');
    rec(J, 'H2 click "Stack": the Stack selected on the canvas, the Inspector reads "Editing: Stack", no trail', (await H.selected(page)) === st && !s.has && /stack/i.test(s.text), `selected ${(await H.selected(page) || 'none').slice(-4)} (stack ${st.slice(-4)}) · "${s.text}"`);
    const own = await ins(page).getByRole('button', { name: /Add a block inside/ }).count();
    rec(J, "H2 …with the Stack's own controls (Add a block inside)", own > 0, `Add a block inside: ${own}`);
    await H.select(page, h); await crumb(page, 'Side by side').click(); await sleep(page, 500); s = await header(page);
    rec(J, 'H2 click "Side by side" from the Heading: it is selected, the trail now "Stack"', (await H.selected(page)) === sbs && JSON.stringify(s.crumbs) === '["Stack"]', `selected ${(await H.selected(page) || 'none').slice(-4)} (sbs ${sbs.slice(-4)}) · ${JSON.stringify(s)}`);
  },

  async escape(page, J) {
    const [st, sbs, h] = await nest(page);
    await H.select(page, h); const s = await header(page);
    const want = [sbs, st, null]; const got = [];
    // the canvas takes Escape when the page has the focus — put it back on the page as a person's click does
    for (let i = 0; i < 3; i++) { await page.locator('body').press('Escape'); await sleep(page, 350); got.push(await H.selected(page)); }
    rec(J, `H3 Escape from the Heading walks out through the trail (${s.crumbs.slice().reverse().join(' → ')} → nothing)`, JSON.stringify(got) === JSON.stringify(want), `got ${got.map((x) => (x || 'none').slice(-4)).join(' → ')} · want ${want.map((x) => (x || 'none').slice(-4)).join(' → ')}`);
  },

  async top(page, J) {
    const h = await band(page, 'Heading'); await H.panel(page, false); await H.select(page, h); let s = await header(page);
    await shot(page, 'H4-top');
    rec(J, 'H4 a Heading on the page: "Editing: Heading", no trail', !s.has && /heading/i.test(s.text), JSON.stringify(s));
    await deselect(page);
    // LE10-2: the Grid tile asks for a layout first (the picker) — a person picks one
    const fresh = await tileThen(page, 'Grid', async () => { await page.getByText('Two equal', { exact: true }).first().click(); }); await H.panel(page, false);
    let g = null; for (const id of fresh) if ((await nodeOf(page, id))?.layout === 'grid') g = id;
    let cell = null; for (const id of fresh) if ((await parentOf(page, id))?.id === g) { cell = id; break; }
    await H.select(page, cell); s = await header(page); await shot(page, 'H4-grid');
    rec(J, 'H4 a cell of a Grid: the trail names the Grid', !!g && s.has && s.crumbs[s.crumbs.length - 1] === 'Grid', `grid ${g} · ${JSON.stringify(s)}`);
    await crumb(page, 'Grid').click(); await sleep(page, 500);
    rec(J, 'H4 click "Grid": the Grid is selected', (await H.selected(page)) === g, `selected ${(await H.selected(page) || 'none').slice(-4)} (grid ${(g || 'none').slice(-4)})`);
    await page.locator('body').press('Control+z'); await sleep(page, 600); // selecting is not an edit: undo takes back the Grid, not the selection
    const gone = !(await page.locator(`[data-box-id="${g}"]`).count());
    rec(J, 'H4 selecting from the trail is not an edit — Ctrl+Z undoes the last real change (the Grid)', gone, `the Grid gone after Ctrl+Z: ${gone}`);
  },

  async keys(page, J) {
    const [, sbs, h] = await nest(page);
    await H.select(page, h); await header(page);
    const target = crumb(page, 'Side by side');
    let reached = false; for (let i = 0; i < 80 && !reached; i++) { await page.keyboard.press('Tab'); reached = await target.evaluate((e) => e === document.activeElement).catch(() => false); }
    const ring = reached && await target.evaluate((e) => getComputedStyle(e).outlineStyle !== 'none' && parseFloat(getComputedStyle(e).outlineWidth) > 0);
    await shot(page, 'H5-focus');
    rec(J, 'H5 Tab reaches "Side by side" in the trail, its focus ring drawn', reached && ring, `reached ${reached} · ring ${ring}`);
    const back = await crumb(page, 'Stack').count();
    await page.keyboard.press('Enter'); await sleep(page, 600);
    const focus = await page.evaluate(() => ({ text: document.activeElement?.textContent, cur: document.activeElement?.getAttribute('aria-current') }));
    rec(J, 'H5 Enter selects the Side by side; the focus lands on its name (current)', (await H.selected(page)) === sbs && focus.text === 'Side by side' && focus.cur === 'location' && back === 1, `selected ${(await H.selected(page) || 'none').slice(-4)} (sbs ${sbs.slice(-4)}) · focus ${JSON.stringify(focus)}`);
    await page.keyboard.press('Tab'); await sleep(page, 200);
    const inside = await page.evaluate(() => !!document.activeElement?.closest('aside[aria-label="Inspector"]'));
    rec(J, 'H5 the next Tab carries on inside the Inspector', inside, `next focus inside the Inspector: ${inside}`);
  },

  async chrome(page, J) {
    const base = process.env.BASE || 'http://localhost:3100';
    for (const theme of ['light', 'dark', 'midnight', 'purple']) {
      await page.evaluate(() => sessionStorage.removeItem('kept')).catch(() => {});
      await page.goto(`${base}/website/box-demo?theme=${theme}`); await page.waitForFunction(() => !!document.querySelector('[data-box-id]'), null, { timeout: 60000 }); await sleep(page, 1200);
      await page.setViewportSize({ width: 1366, height: 860 }); await sleep(page, 400);
      const ids = await nest(page, 5); const h = ids[ids.length - 1];
      for (const w of [375, 768, 1280, 1536]) {
        await page.setViewportSize({ width: w, height: 860 }); await sleep(page, 500);
        let ok = true; const ev = [];
        try {
          await H.select(page, h); const s = await header(page);
          if (JSON.stringify(s.crumbs) !== JSON.stringify(names(4))) { ok = false; ev.push(`crumbs ${s.crumbs.join(' › ')}`); }
          const c = await crumb(page, 'Stack').first().evaluate(CONTRAST); ev.push(`crumb ${c}:1`); if (c < 4.5) ok = false;
          const cc = await ins(page).locator('[aria-current="location"]').evaluate(CONTRAST); ev.push(`current ${cc}:1`); if (cc < 4.5) ok = false;
          const clip = await nav(page).evaluate((n) => { const a = n.closest('aside').getBoundingClientRect(); const lis = [...n.querySelectorAll('li')].map((l) => l.getBoundingClientRect()); return { out: lis.some((r) => r.right > a.right + 1 || r.left < a.left - 1), lines: new Set(lis.map((r) => Math.round(r.top))).size, side: document.documentElement.scrollWidth > innerWidth }; });
          ev.push(`lines ${clip.lines}, clipped ${clip.out}, sideways ${clip.side}`); if (clip.out || clip.side) ok = false;
          if (w === 375 || w === 1536) await shot(page, `H6-${theme}-${w}`);
          await crumb(page, 'Stack').first().click(); await sleep(page, 500);
          const sel = await H.selected(page); ev.push(`click selects the outer Stack ${sel === ids[0]}`); if (sel !== ids[0]) ok = false;
        } catch (e) { ok = false; ev.push(e.message.split('\n').filter((l) => /Timeout|intercepts|visible|stable|viewport|outside/.test(l)).slice(0, 3).join(' / ')); await shot(page, `H6-ERR-${theme}-${w}`); }
        rec(J, `H6 ${theme} · ${w}: a five-deep trail readable, wrapped not clipped, a click selects`, ok, ev.join(' · '));
      }
    }
  },

  async widths(page, J) {
    const ids = await nest(page, 5); const h = ids[ids.length - 1];
    const bad = [];
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 860 }); await sleep(page, 250);
      try {
        if ((await H.selected(page)) !== h) await H.select(page, h);
        const s = await header(page);
        const m = await nav(page).evaluate((n) => { const a = n.closest('aside').getBoundingClientRect(); return { out: [...n.querySelectorAll('li')].some((l) => { const r = l.getBoundingClientRect(); return r.right > a.right + 1 || r.left < a.left - 1; }), side: document.documentElement.scrollWidth > innerWidth }; });
        if (s.crumbs.length !== 4 || m.out || m.side) bad.push(`${w}: ${s.crumbs.length} crumbs, clipped ${m.out}, sideways ${m.side}`);
      } catch (e) { bad.push(`${w}: ${e.message.split('\n')[0]}`); }
    }
    rec(J, `H6 every width of screens.js (${WIDTHS.length}): the trail whole, nothing clipped or sideways`, !bad.length, bad.join(' · ') || 'every width');
    // a touch phone (coarse pointer, no hover), its own context: the same build, the trail TAPPED
    const browser = page.context().browser();
    const ctx = await browser.newContext({ viewport: { width: 393, height: 851 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    const tp = await ctx.newPage(); const errs = []; tp.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
    await tp.goto((process.env.BASE || 'http://localhost:3100') + '/website/box-demo', { waitUntil: 'load' });
    await tp.waitForFunction(() => !!document.querySelector('[data-box-id]'), null, { timeout: 60000 }); await sleep(tp, 1500);
    try {
      const st = await band(tp, 'Stack'); const sbs = await addInside(tp, st, 'Side by side'); const hd = await addInside(tp, sbs, 'Heading');
      const tids = [st, sbs, hd]; await H.select(tp, hd); const s = await header(tp); await shot(tp, 'H6-touch-393');
      const hts = await nav(tp).getByRole('button').evaluateAll((bs) => bs.map((b) => Math.round(b.getBoundingClientRect().height)));
      rec(J, 'H6 touch phone 393: every crumb at least 44 px tall', hts.length === 2 && hts.every((x) => x >= 44), `heights ${hts.join(', ')} · ${JSON.stringify(s.crumbs)}`);
      await crumb(tp, 'Stack').tap(); await sleep(tp, 600);
      const sheet = await ins(tp).isVisible();
      rec(J, 'H6 touch phone: a tap on "Stack" selects it; the Inspector sheet stays open on it', (await H.selected(tp)) === tids[0] && sheet, `selected ${(await H.selected(tp) || 'none').slice(-4)} (stack ${tids[0].slice(-4)}) · sheet ${sheet}`);
    } catch (e) { rec(J, 'H6 touch phone', false, e.message.split('\n')[0]); await shot(tp, 'H6-touch-ERR'); }
    rec(J, 'H6 touch phone console', !errs.length, errs.join(' | ') || 'no errors');
    await ctx.close();
  },
};

(async () => {
  const jobs = Object.keys(JOBS).filter((n) => !ONLY.length || ONLY.includes(n));
  let slot = 0; const queue = [...jobs];
  const worker = async (s) => {
    while (queue.length) {
      const J = queue.shift();
      const { browser, page, errs } = await H.open({ headed: true, w: 1366, h: 860, pos: [(s % 3) * 620, Math.floor(s / 3) * 480] });
      try { await JOBS[J](page, J); } catch (e) { rec(J, 'ERROR', false, `${e.message.split('\n')[0]}`); await shot(page, `ERR-${J}`); }
      rec(J, 'console', !errs.length, errs.join(' | ') || 'no errors');
      await browser.close();
    }
  };
  await Promise.all(Array.from({ length: Math.min(6, jobs.length) }, () => worker(slot++)));
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.ok);
  console.log(`SUMMARY ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})();
