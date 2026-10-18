// HEADED UAT — BATCH LE-9 · Page check, the reading order (SE-4; docs/TASK_TREE.md "BATCH LE-9", checklist H1 … H6). Every state
// BUILT THROUGH THE UI (RULE Y): palette tiles, the words typed, Position → Order on the Mobile / Full width chip, Hidden on a
// screen, Placement → Floating; localStorage only READ. Six visible windows; the Preview at every width of screens.js (RULE Z).
//   phone   H1  the Button at Mobile Order −1: named, on phones, a suggestion, Show me selects it; canvas == Preview at every width
//   every   H2  Order −1 at Full width: one line, "every screen"; first at every width
//   back    H3  emptied on phones: gone (null); undo / redo; reload; the badge
//   carry   H4  a block alone in its section, among three sections: named, Show me selects IT
//   quiet   H5  Order 5 on the last · Floating at −1 · Hidden on phones at −1 on phones: no line
//   chrome  H6  four editor themes × 375 · 768 · 1280 · 1536: readable, nothing clipped, Tab → Show me → Enter, Escape
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le9-headed.js [--only=phone,chrome]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const I = require('./inspector.js');
const { WIDTHS } = require('./screens.js');
const { nodeOf, sleep, deselect, band, into, under, at, ins, field, chip, btn, pvOpen, pvAt, pvClose, cls } = require('./uat-rx3-headed.js');
const PC = require('../../config/page-check.json').readingOrder;
const PHONE_TO = require('../../config/layout.json').rungs.tabletPortrait.from; // the first width that is no longer a phone
const OUT = path.join(__dirname, 'logs', 'le9'); fs.mkdirSync(OUT, { recursive: true });
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
// LE9-1: the contrast measure LE-13's pass proved across the four themes (layered, part-see-through backgrounds), reused
const { CONTRAST } = require('./uat-le13-headed.js');
async function bar(page) { const more = page.getByRole('button', { name: 'More', exact: true }); if (await more.isVisible().catch(() => false)) { await more.click(); const d = page.getByRole('dialog', { name: 'More' }); await d.waitFor(); await sleep(page, 250); return d; } return page; }
async function openCheck(page) {
  await deselect(page); await H.panel(page, false);
  await (await bar(page)).getByRole('button', { name: /^Page check/ }).first().click();
  const dlg = page.getByRole('dialog').filter({ hasText: 'Page check' }).first();
  await dlg.waitFor({ timeout: 10000 });
  await page.waitForFunction(() => !/Checking the page|Measuring the page/.test(document.querySelector('[role="dialog"]')?.textContent || ''), null, { timeout: 60000 });
  return dlg;
}
const closeCheck = async (page) => { await page.keyboard.press('Escape'); await sleep(page, 400); };
/** The reading-order lines in the open check: their words, and the list item each sits in. */
const lead = PC.message.split('{screens}')[0]; // "On "
const tail = PC.message.split('{block}')[1].slice(0, 30); // " is shown in a different place…"
const orderLines = (dlg) => dlg.locator('li').filter({ hasText: tail.trim() });
async function order(page, id, v, chipName) { await chip(page, chipName); await at(page, id, 'Design', 'Position'); await field(page, 'Order', v); }
const words = async (page, id, t) => { await I.text(page, id, t); await sleep(page, 300); };
/** The blocks' tops, in the order asked: the canvas, or the Preview frame. */
const cTops = (page, ids) => page.evaluate((ids) => ids.map((i) => Math.round(document.querySelector(`[data-box-id="${i}"]`).getBoundingClientRect().top)), ids);
const pTops = (f, ids) => f.evaluate((s) => s.map((x) => Math.round(document.querySelector(x).getBoundingClientRect().top)), ids.map(cls));
/** Every width of screens.js: is `id` drawn above `ref` exactly where `firstAt(w)` says? */
async function sweepFirst(page, id, ref, firstAt, tag) {
  const bad = []; await pvOpen(page);
  for (const w of WIDTHS) {
    const f = await pvAt(page, w); const [a, b] = await pTops(f, [id, ref]); const sw = await f.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    if ((a < b) !== firstAt(w)) bad.push(`${w}: ${a < b ? 'first' : 'in place'}`); if (sw) bad.push(`${w}: sideways`);
    if (w === 375 || w === 1280) await pvShot(page, `${tag}-preview-${w}`);
  }
  await pvClose(page, 1366); return bad;
}

const JOBS = {
  async phone(page, J) {
    const st = await band(page, 'Stack'); const h = await into(page, st, 'Heading'); const t = await under(page, h, 'Text'); const b = await under(page, t, 'Button');
    await words(page, h, 'Welcome to our school'); await words(page, t, 'We are open for the new term'); await words(page, b, 'Apply now');
    await order(page, b, -1, 'Mobile (375px)');
    const n = await nodeOf(page, b); rec(J, 'H1 stored: on phones only', n.responsive?.phone?.order === -1 && n.order == null, JSON.stringify({ order: n.order, phone: n.responsive?.phone }));
    const canvas = {}; for (const [c, w] of [['Mobile (375px)', 375], ['Tablet (768px)', 768], ['Desktop (1280px)', 1280]]) { await chip(page, c); const [tb, th] = await cTops(page, [b, h]); canvas[w] = tb < th; if (w === 375) await shot(page, 'H1-canvas-375'); }
    await chip(page, 'Full width');
    rec(J, 'H1 canvas: first at 375, in place at 768 / 1280', canvas[375] && !canvas[768] && !canvas[1280], JSON.stringify(canvas));
    const dlg = await openCheck(page); const ls = orderLines(dlg); const said = (await ls.allTextContents());
    await shot(page, 'H1-check');
    rec(J, 'H1 one line: "On phones", the Button with its words, a suggestion', said.length === 1 && said[0].startsWith(`${lead}phones`) && /Button/.test(said[0]) && said[0].includes('Apply now') && said[0].includes('a suggestion') && !said[0].includes('desktops'), said.join(' ‖ '));
    await ls.first().getByRole('button', { name: 'Show me' }).click(); await sleep(page, 600);
    const open = await page.getByRole('dialog').filter({ hasText: 'Page check' }).count();
    rec(J, 'H1 Show me selects the Button and closes the check', (await H.selected(page)) === b && !open, `selected ${await H.selected(page)} (button ${b}); check open ${open}`);
    const bad = await sweepFirst(page, b, h, (w) => w < PHONE_TO, 'H1');
    rec(J, `H1 Preview at all ${WIDTHS.length} widths: first below ${PHONE_TO}, in place from ${PHONE_TO}; no sideways`, !bad.length, bad.join(', ') || 'every width');
  },

  async every(page, J) {
    const st = await band(page, 'Stack'); const h = await into(page, st, 'Heading'); const t = await under(page, h, 'Text');
    await words(page, h, 'Our news'); await words(page, t, 'Term starts on Monday');
    await order(page, t, -1, 'Full width');
    const dlg = await openCheck(page); const said = await orderLines(dlg).allTextContents(); await shot(page, 'H2-check');
    rec(J, 'H2 one line, "every screen"', said.length === 1 && said[0].startsWith(`${lead}${PC.everyScreen}`) && said[0].includes('Term starts'), said.join(' ‖ '));
    await closeCheck(page);
    const bad = await sweepFirst(page, t, h, () => true, 'H2');
    rec(J, `H2 Preview at all ${WIDTHS.length} widths: first everywhere`, !bad.length, bad.join(', ') || 'every width');
  },

  async back(page, J) {
    const st = await band(page, 'Stack'); const h = await into(page, st, 'Heading'); const t = await under(page, h, 'Text');
    await words(page, t, 'Read me second');
    await order(page, t, -1, 'Mobile (375px)'); await chip(page, 'Full width');
    const count = async () => { const d = await openCheck(page); const n = await orderLines(d).count(); await closeCheck(page); return n; };
    const badge = async () => ((await (await bar(page)).getByRole('button', { name: /^Page check/ }).first().textContent()) || '').replace(/\s+/g, ' ').trim();
    const b0 = await badge(); rec(J, 'H3 the line is there; the badge counts it', (await count()) === 1, `badge "${b0}"`);
    await order(page, t, '', 'Mobile (375px)'); await chip(page, 'Full width');
    const n = await nodeOf(page, t); const b1 = await badge();
    rec(J, 'H3 emptied on phones: stored null, the line gone, the badge one fewer', n.responsive?.phone?.order === null && (await count()) === 0 && b1 !== b0, `phone ${JSON.stringify(n.responsive?.phone)}; badge "${b0}" → "${b1}"`);
    await deselect(page); await page.keyboard.press('Control+z'); await sleep(page, 600); const u = await count();
    await page.keyboard.press('Control+y'); await sleep(page, 600); const r = await count();
    await page.keyboard.press('Control+z'); await sleep(page, 600);
    await page.reload(); await page.waitForFunction(() => !!document.querySelector('[data-box-id]'), null, { timeout: 60000 }); await sleep(page, 1500);
    const kept = (await nodeOf(page, t))?.responsive?.phone?.order;
    rec(J, 'H3 undo brings it back, redo takes it away, reload keeps it', u === 1 && r === 0 && kept === -1 && (await count()) === 1, `undo ${u} · redo ${r} · after reload phone order ${kept}`);
  },

  async carry(page, J) {
    const a = await band(page, 'Text'); await words(page, a, 'Section one');
    const b = await band(page, 'Text'); await words(page, b, 'Section two');
    const c = await band(page, 'Text'); await words(page, c, 'Section three');
    await order(page, c, -1, 'Mobile (375px)'); await chip(page, 'Full width');
    const dlg = await openCheck(page); const ls = orderLines(dlg); const said = await ls.allTextContents(); await shot(page, 'H4-check');
    rec(J, 'H4 the Text alone in its section is named', said.length === 1 && said[0].includes('Section three'), said.join(' ‖ '));
    await ls.first().getByRole('button', { name: 'Show me' }).click(); await sleep(page, 600);
    rec(J, 'H4 Show me selects the Text, not its section', (await H.selected(page)) === c, `selected ${await H.selected(page)} (text ${c})`);
    const bad = await sweepFirst(page, c, a, (w) => w < PHONE_TO, 'H4');
    rec(J, `H4 Preview at all ${WIDTHS.length} widths: first below ${PHONE_TO}, in place from ${PHONE_TO}`, !bad.length, bad.join(', ') || 'every width');
  },

  async quiet(page, J) {
    const st = await band(page, 'Stack'); const h = await into(page, st, 'Heading'); const t = await under(page, h, 'Text'); const f = await under(page, t, 'Text'); const x = await under(page, f, 'Text');
    await words(page, t, 'Last but set to five'); await words(page, f, 'Floating words'); await words(page, x, 'Hidden on phones');
    // the last block at Order 5 changes nothing seen — but the block below it moves it; so the last is `x`, and `t` is checked alone after
    await order(page, x, 5, 'Full width');
    // LE9-2: a Floating block has no Order field (it is out of the flow), so the person's route is Order first, then Floating
    await order(page, f, -1, 'Full width'); await at(page, f, 'Design', 'Placement'); await btn(page, 'Floating', ins(page));
    let d = await openCheck(page); let said = await orderLines(d).allTextContents(); await closeCheck(page);
    rec(J, 'H5 Order 5 on the last, a Floating block at −1: no line', said.length === 0, said.join(' ‖ ') || 'none');
    // LE9-2: Hidden on a screen is on the Per-device tab (BoxInspector), not under a Design section
    await order(page, x, -1, 'Mobile (375px)'); await at(page, x, 'Per-device');
    const hide = ins(page).getByLabel(/Hidden on/).first(); await hide.scrollIntoViewIfNeeded(); await hide.check(); await sleep(page, 400); await chip(page, 'Full width');
    const nx = await nodeOf(page, x);
    d = await openCheck(page); said = await orderLines(d).allTextContents(); await shot(page, 'H5-check'); await closeCheck(page);
    rec(J, 'H5 Hidden on phones with Order −1 on phones: no line', nx.responsive?.phone?.hidden === true && said.length === 0, `phone ${JSON.stringify(nx.responsive?.phone)}; lines: ${said.join(' ‖ ') || 'none'}`);
  },

  async chrome(page, J) {
    const base = process.env.BASE || 'http://localhost:3100';
    for (const theme of ['light', 'dark', 'midnight', 'purple']) {
      await page.evaluate(() => sessionStorage.removeItem('kept')).catch(() => {});
      await page.goto(`${base}/website/box-demo?theme=${theme}`); await page.waitForFunction(() => !!document.querySelector('[data-box-id]'), null, { timeout: 60000 }); await sleep(page, 1200);
      await page.setViewportSize({ width: 1366, height: 860 }); await sleep(page, 400);
      const st = await band(page, 'Stack'); const h = await into(page, st, 'Heading'); const t = await under(page, h, 'Text'); await words(page, t, 'Moved on phones');
      await order(page, t, -1, 'Mobile (375px)'); await chip(page, 'Full width');
      for (const w of [375, 768, 1280, 1536]) {
        await page.setViewportSize({ width: w, height: 860 }); await sleep(page, 500);
        let ok = true; const ev = [];
        try {
          const d = await openCheck(page); const li = orderLines(d).first(); const p = li.locator('p').first();
          const c = await p.evaluate(CONTRAST); ev.push(`${c}:1`); if (c < 4.5) ok = false;
          const clip = await li.evaluate((e) => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 || r.left < -1 || e.scrollWidth > e.clientWidth + 1; }); ev.push(`clipped ${clip}`); if (clip) ok = false;
          if (w === 375 || w === 1536) await shot(page, `H6-${theme}-${w}`);
          let reached = false; for (let i = 0; i < 40 && !reached; i++) { await page.keyboard.press('Tab'); reached = await li.getByRole('button', { name: 'Show me' }).evaluate((e) => e === document.activeElement); }
          const ring = reached && await li.getByRole('button', { name: 'Show me' }).evaluate((e) => getComputedStyle(e).outlineStyle !== 'none' || getComputedStyle(e).boxShadow !== 'none');
          ev.push(`Tab reaches Show me ${reached}, focus shown ${ring}`); if (!reached || !ring) ok = false;
          await page.keyboard.press('Enter'); await sleep(page, 600);
          const s = await H.selected(page); ev.push(`Enter selects ${s === t}`); if (s !== t) ok = false;
          const d2 = await openCheck(page); await page.keyboard.press('Escape'); await sleep(page, 400);
          const gone = !(await d2.isVisible().catch(() => false)); ev.push(`Escape closes ${gone}`); if (!gone) ok = false;
        } catch (e) { ok = false; ev.push(e.message.split('\n')[0]); await shot(page, `H6-ERR-${theme}-${w}`); }
        rec(J, `H6 ${theme} · ${w}: readable, not clipped, Tab → Show me → Enter selects, Escape closes`, ok, ev.join(' · '));
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
      try { await JOBS[J](page, J); } catch (e) { rec(J, 'ERROR', false, `${e.message.split('\n')[0]}`); await shot(page, `ERR-${J}`); }
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
