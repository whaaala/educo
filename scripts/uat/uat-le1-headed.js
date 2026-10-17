// HEADED UAT — BATCH LE-1 · adding blocks, and the Page check (docs/TASK_TREE.md, "BATCH LE-1", checklist U1 … U6).
// Every state BUILT THROUGH THE UI (RULE Y): palette tiles, "+ Add a block inside", the Inspector, the device buttons, the Page
// check dialog. The one seeded shape is U3's: a page saved before E5b-3, which today's UI can no longer make (RULE Y's exception).
// Six visible windows; a queue of jobs, each window refilled when its job ends. The Preview at every width of screens.js (RULE Z).
//   addInside   U1 · three "+ Add a block inside" on a Stack and on a Side by side; Undo; Tab + Enter
//   sbs         U2 · Side by side then Text, Image, Button — inside, one line; Where → After goes below; Preview at every width
//   regress     U2 · a Stack still gets the block after it; a grid cell still receives it
//   stale       U3 · an old page's stale pin released on load; a sized pin kept
//   space       U4 · W7a page edge · coloured box · W7b sections — listed, Show me, cleared by adding the space; four themes
//   narrow      U5 · a Grid set to four across on phones — a heading too narrow is named; one across clears it
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le1-headed.js [--only=sbs,space]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers;
const { WIDTHS } = require('./screens.js');
const X = require('./uat-rx3-headed.js'); const { sleep, nodeOf, deselect, band, at, ins, pvOpen, pvAt, pvClose } = X;
const OUT = path.join(__dirname, 'logs', 'le1'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const THEMES = ['Light', 'Dark', 'Midnight', 'Purple'];
const results = [];
const rec = (job, id, ok, ev) => { results.push({ job, id, ok, ev }); console.log(`[${job}] ${id} ${ok ? 'PASS' : 'FAIL'} · ${ev}`); };
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') }).catch(() => {});
const site = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1') || 'null'));
const kidsOf = async (page, id) => ((await nodeOf(page, id))?.children || []);
/** The blocks a container holds, looking through the row band the builder wraps each one in inside a Stack. */
const blocksOf = async (page, id) => (await kidsOf(page, id)).flatMap((k) => (k.rowBand ? k.children || [] : [k]));
const atEnd = async (page) => { await H.panel(page, true); const e = page.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: 'End' }); if (await e.count()) { await e.first().click(); await sleep(page, 250); } };
const tops = (page, ids) => page.evaluate((ids) => ids.map((i) => Math.round(document.querySelector(`[data-box-id="${i}"]`)?.getBoundingClientRect().top ?? -1)), ids);
const addInside = async (page) => { await ins(page).getByRole('button', { name: /Add a block inside/ }).first().click(); await sleep(page, 700); };
const selectedId = (page) => H.selected(page);
/** The top bar's controls — on a phone-width editor they sit under "More" (E-5a), so open it first. */
async function bar(page) { const more = page.getByRole('button', { name: 'More', exact: true }); if (await more.isVisible().catch(() => false)) { await more.click(); const d = page.getByRole('dialog', { name: 'More' }); await d.waitFor(); await sleep(page, 250); return d; } return page; }
async function appTheme(page, name) { await (await bar(page)).getByRole('button', { name: 'Change theme' }).first().click(); await sleep(page, 300); await page.getByRole('menuitemradio', { name: new RegExp('^\\s*' + name) }).first().click(); await sleep(page, 500); }
async function openCheck(page) {
  await deselect(page); await H.panel(page, false);
  await (await bar(page)).getByRole('button', { name: /^Page check/ }).first().click();
  const dlg = page.getByRole('dialog').filter({ hasText: 'Page check' }).first();
  await dlg.waitFor({ timeout: 10000 });
  await page.waitForFunction(() => !/Checking the page|Measuring the page/.test(document.querySelector('[role="dialog"]')?.textContent || ''), null, { timeout: 60000 });
  return dlg;
}
const kinds = (dlg) => dlg.locator('[data-space-kind]').evaluateAll((ls) => ls.map((l) => ({ kind: l.getAttribute('data-space-kind'), text: l.textContent })));
const closeCheck = async (page) => { await page.keyboard.press('Escape'); await sleep(page, 400); };

const JOBS = {
  async addInside(page, J) {
    for (const [what, tile] of [['Stack', 'Stack'], ['Side by side', 'Side by side']]) {
      const host = await band(page, tile); await at(page, host, 'Layout');
      for (let i = 0; i < 3; i++) await addInside(page);
      const kids = await blocksOf(page, host), nested = kids.filter((k) => (k.children || []).length);
      rec(J, `U1 ${what}: three clicks, three blocks inside it`, kids.length === 3 && !nested.length, `${kids.length} children, ${nested.length} with children of their own`);
      rec(J, `U1 ${what}: the last one is selected`, (await selectedId(page)) === kids[2]?.id, String(await selectedId(page)));
      if (what === 'Side by side') { const t = await tops(page, kids.map((k) => k.id)); rec(J, 'U1 Side by side: the three share its line', new Set(t).size === 1, t.join(',')); }
      await shot(page, `U1-${what.replace(/ /g, '')}`);
      await deselect(page); await page.keyboard.press('Control+z'); await sleep(page, 600);
      rec(J, `U1 ${what}: one Undo removes one`, (await blocksOf(page, host)).length === 2, String((await blocksOf(page, host)).length));
      // the keyboard: Tab to the button, Enter
      await at(page, host, 'Layout'); const b = ins(page).getByRole('button', { name: /Add a block inside/ }).first(); await b.focus(); await page.keyboard.press('Enter'); await sleep(page, 700);
      rec(J, `U1 ${what}: Enter on the focused button adds one`, (await blocksOf(page, host)).length === 3, String((await blocksOf(page, host)).length));
    }
    await page.setViewportSize({ width: 375, height: 812 }); await sleep(page, 800);
    const s = await band(page, 'Stack'); await at(page, s, 'Layout'); for (let i = 0; i < 3; i++) await addInside(page);
    const k = await blocksOf(page, s); rec(J, 'U1 at a 375 editor: three inside, none nested', k.length === 3 && !k.some((x) => (x.children || []).length), `${k.length}`);
    await shot(page, 'U1-375');
  },

  async sbs(page, J) {
    const row = await band(page, 'Side by side');
    for (const t of ['Text', 'Image', 'Button']) { await H.panel(page, true); await H.clickTile(page, t); }
    const kids = await kidsOf(page, row);
    rec(J, 'U2 Text, Image, Button land INSIDE the Side by side', kids.length === 3, kids.map((k) => k.type).join(','));
    const t = await tops(page, kids.map((k) => k.id)); rec(J, 'U2 they share its line on the canvas', new Set(t).size === 1, t.join(','));
    await shot(page, 'U2-canvas');
    // Where → After: the next one below the row
    await H.panel(page, false); await H.select(page, row); await H.panel(page, true);
    await page.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: 'After' }).first().click().catch(async () => { await page.getByRole('radio', { name: 'After' }).first().click(); });
    await sleep(page, 300); await H.clickTile(page, 'Text');
    rec(J, 'U2 Where → After puts the next block BELOW, not inside', (await kidsOf(page, row)).length === 3, String((await kidsOf(page, row)).length));
    // the Preview at every width: the three inside the row, nothing sideways
    const f0 = await pvOpen(page); let bad = [];
    for (const w of WIDTHS) {
      const f = await pvAt(page, w);
      const r = await f.evaluate((ids) => { const els = ids.map((i) => document.querySelector('.bx-' + i)); const row = els[0]?.parentElement?.closest('[class*="bx-"]'); return { inRow: els.every((e) => e && row && row.contains(e)), over: document.documentElement.scrollWidth - document.documentElement.clientWidth }; }, kids.map((k) => k.id));
      if (!r.inRow || r.over > 0) bad.push(`${w}:${r.inRow ? '' : 'out'}${r.over > 0 ? 'over' + r.over : ''}`);
    }
    void f0; rec(J, `U2 Preview at all ${WIDTHS.length} widths: all three in the row, nothing sideways`, !bad.length, bad.join(' ') || 'ok');
    await shot(page, 'U2-preview'); await pvClose(page, 1366);
  },

  async regress(page, J) {
    const stack = await band(page, 'Stack'); await H.panel(page, false); await H.select(page, stack); await H.panel(page, true); await H.clickTile(page, 'Text');
    rec(J, 'U2 a selected Stack gets the Text AFTER it', (await kidsOf(page, stack)).length === 0, `${(await kidsOf(page, stack)).length} inside`);
    await deselect(page); await H.panel(page, true); const g = await P.grid(page, 2, 1); const cell = (await kidsOf(page, g))[0].id; // P.grid returns the grid
    await H.panel(page, false); await H.select(page, cell); await H.panel(page, true); await H.clickTile(page, 'Text');
    rec(J, 'U2 a selected grid cell RECEIVES the Text', (await kidsOf(page, cell)).length === 1, `${(await kidsOf(page, cell)).length} inside`);
    await shot(page, 'U2-regress');
  },

  async stale(page, J) {
    // RULE Y's exception: the shape a page saved before E5b-3 holds — a block in a row pinned to the top with no height of its own
    const s = await site(page); const root = s.pages[0].root;
    const mk = (id, extra = {}) => ({ id, type: 'container', direction: 'column', width: 'fill', children: [{ id: id + 't', type: 'text', text: 'Words ' + id }], ...extra });
    const row = { id: 'oldrow', type: 'container', direction: 'row', rowBand: true, children: [mk('stalepin', { alignSelf: 'flex-start' }), mk('sizedpin', { alignSelf: 'flex-start', minHeight: 120 }), mk('tall', { minHeight: 320 })] };
    root.children = [...(root.children || []), row];
    await page.evaluate((s) => localStorage.setItem('educo_box_site_v1', JSON.stringify(s)), s);
    await page.reload(); await page.waitForFunction(() => !!document.querySelector('[data-box-id="oldrow"]'), null, { timeout: 60000 }); await sleep(page, 1200);
    const r = await page.evaluate(() => Object.fromEntries(['oldrow', 'stalepin', 'sizedpin'].map((i) => [i, Math.round(document.querySelector(`[data-box-id="${i}"]`).getBoundingClientRect().height)])));
    // the store is written back on the next edit; the canvas draws the released tree now
    rec(J, 'U3 the stale pin is released: the block follows its row', Math.abs(r.stalepin - r.oldrow) <= 2, `block ${r.stalepin} / row ${r.oldrow}`);
    rec(J, 'U3 a pin WITH its height keeps it: shorter than its row', r.sizedpin < r.oldrow - 10, `block ${r.sizedpin} / row ${r.oldrow}`);
    await shot(page, 'U3-stale');
  },

  async space(page, J) {
    const boxed = await band(page, 'Stack'); await at(page, boxed, 'Design', 'Background');   // a coloured box, first, so nothing lands in it
    await ins(page).getByRole('button', { name: 'Background colour palette' }).first().click(); await sleep(page, 300);
    await page.locator('[role=dialog] button[title^="#f3f4f6"]').first().click(); await page.keyboard.press('Escape'); await sleep(page, 300);
    rec(J, 'U4 built: the box has a background', !!(await nodeOf(page, boxed))?.background, String((await nodeOf(page, boxed))?.background));
    await H.panel(page, false); await H.select(page, boxed); await H.panel(page, true); await page.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: 'Inside' }).first().click(); await sleep(page, 300);
    await H.clickTile(page, 'Text');                                                            // words touching that coloured box
    rec(J, 'U4 built: a Text inside the coloured box', (await kidsOf(page, boxed)).length === 1, String((await kidsOf(page, boxed)).length));
    for (let i = 0; i < 2; i++) { await atEnd(page); await H.clickTile(page, 'Text'); }         // words at the page edge, two sections touching (Where → End)
    await shot(page, 'U4-built');
    for (const w of [1280, 375]) {
      await page.setViewportSize({ width: w, height: 860 }); await sleep(page, 800);
      const dlg = await openCheck(page); const k = await kinds(dlg);
      const has = (x) => k.some((i) => i.kind === x);
      const edge = has('words-near-edge') || /touch its left or right edge/.test(await dlg.innerText());
      rec(J, `U4 ${w}: words at the page edge listed`, edge, k.map((i) => i.kind).join(','));
      rec(J, `U4 ${w}: words touching their coloured box listed`, has('words-touch-box'), k.map((i) => i.kind).join(','));
      rec(J, `U4 ${w}: two sections whose words touch listed`, has('sections-close'), k.map((i) => i.kind).join(','));
      rec(J, `U4 ${w}: each names the screens it happens on`, k.every((i) => /phones|tablets|desktops|wide screens/.test(i.text)), k.map((i) => i.text).join(' | '));
      // the editor's theme is set where its switch is in the bar (1280), then the check is read at this width
      for (const t of THEMES) { await closeCheck(page); await page.setViewportSize({ width: 1280, height: 860 }); await sleep(page, 400); await appTheme(page, t); await page.setViewportSize({ width: w, height: 860 }); await sleep(page, 600); await openCheck(page); await shot(page, `U4-${w}-${t}`); }
      await closeCheck(page); await page.setViewportSize({ width: 1280, height: 860 }); await sleep(page, 400); await appTheme(page, 'Light'); await page.setViewportSize({ width: w, height: 860 }); await sleep(page, 400);
    }
    // Show me selects the block
    let dlg = await openCheck(page);
    const item = dlg.locator('[data-space-kind="words-touch-box"]').first();
    await item.getByRole('button', { name: 'Show me' }).click(); await sleep(page, 900);
    const sel = await selectedId(page); const inBox = sel && (await page.evaluate(([b, s]) => !!document.querySelector(`[data-box-id="${b}"]`)?.contains(document.querySelector(`[data-box-id="${s}"]`)), [boxed, sel]));
    rec(J, 'U4 Show me selects that block', !!inBox, String(sel));
    // space added at a 375 editor is the PHONE's (LE1-6: measured from 375, every width used to read as 375)
    const pad = async () => { await at(page, boxed, 'Design', 'Spacing'); const f = ins(page).getByRole('slider', { name: 'Inner spacing' }).first(); await f.focus(); for (let i = 0; i < 20; i++) await page.keyboard.press('ArrowRight'); await sleep(page, 600); };
    await page.setViewportSize({ width: 375, height: 860 }); await sleep(page, 800); await pad();
    dlg = await openCheck(page); let k2 = await kinds(dlg); let tb = k2.find((i) => i.kind === 'words-touch-box');
    rec(J, 'U4 space for phones only (a 375 editor): still listed for the wider screens, no longer for phones', !!tb && !/phones/.test(tb.text) && /desktops/.test(tb.text), tb ? tb.text.slice(0, 160) : 'not listed');
    await closeCheck(page); await page.setViewportSize({ width: 1280, height: 860 }); await sleep(page, 800); await pad();
    dlg = await openCheck(page); k2 = await kinds(dlg);
    rec(J, 'U4 space on the desktop too: "touching its box" is gone', !k2.some((i) => i.kind === 'words-touch-box'), k2.map((i) => i.text.slice(0, 90)).join(' | ') || 'none');
    await shot(page, 'U4-cleared'); await closeCheck(page);
  },

  async narrow(page, J) {
    await deselect(page); await H.panel(page, true); const gridId = await P.grid(page, 4, 1); // P.grid returns the grid
    for (const k of await kidsOf(page, gridId)) { await H.panel(page, false); await H.select(page, k.id); await H.panel(page, true); await H.clickTile(page, 'Heading'); } // a selected cell receives
    await page.getByRole('button', { name: /^Mobile/ }).first().click(); await sleep(page, 900);
    await at(page, gridId, 'Layout'); const cols = ins(page).getByRole('group', { name: 'Columns' });
    rec(J, 'U5 at Phone the Columns control claims no desktop count (the phone draws one across)', (await cols.getByRole('button', { name: 'Quarters' }).first().getAttribute('aria-pressed')) === 'false', 'Quarters pressed=' + await cols.getByRole('button', { name: 'Quarters' }).first().getAttribute('aria-pressed'));
    await cols.getByRole('button', { name: 'Thirds' }).first().click(); await sleep(page, 800); await shot(page, 'U5-mobile-thirds');
    const cells = (await kidsOf(page, gridId)).map((k) => k.id); const t = await tops(page, cells);
    rec(J, 'U5 Thirds at Phone draws three across on the canvas', t.filter((v) => v === t[0]).length === 3, t.join(','));
    await cols.getByRole('button', { name: 'Twelve' }).first().click(); await sleep(page, 800); await shot(page, 'U5-mobile-twelve'); // each cell its desktop quarter (3 of 12): four across, ~90px — "heading" no longer fits
    let dlg = await openCheck(page); let k = await kinds(dlg);
    const broken = k.filter((i) => i.kind === 'words-broken');
    rec(J, 'U5 a heading too narrow for its words on phones is listed', broken.length > 0 && /phones/.test(broken[0]?.text || ''), broken.map((i) => i.text.slice(0, 80)).join(' | ') || 'none');
    await shot(page, 'U5-check'); await closeCheck(page);
    // one across on phones: it fits
    await at(page, gridId, 'Layout'); const rng = ins(page).getByRole('slider', { name: /Columns in the row/ }).first();
    if (await rng.count()) { await rng.focus(); await page.keyboard.press('Home'); await sleep(page, 700); }
    dlg = await openCheck(page); k = await kinds(dlg);
    rec(J, 'U5 one across on phones: nothing too narrow', !k.some((i) => i.kind === 'words-broken'), k.map((i) => i.kind).join(',') || 'none');
    await closeCheck(page);
  },
};

(async () => {
  const names = Object.keys(JOBS).filter((n) => !ONLY.length || ONLY.includes(n));
  let slot = 0; const queue = [...names];
  const worker = async (s) => {
    while (queue.length) {
      const J = queue.shift();
      const { browser, page, errs } = await H.open({ headed: true, w: 1366, h: 860, pos: [(s % 3) * 620, Math.floor(s / 3) * 480] });
      try { await JOBS[J](page, J); } catch (e) { rec(J, 'ERROR', false, e.message.split('\n')[0]); await shot(page, `ERR-${J}`); }
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
