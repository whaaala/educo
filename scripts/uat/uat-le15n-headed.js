// HEADED UAT — BATCH LE-15n · drag that feels like picking it up (tests/features/components/website/drag-feel.feature, "The same
// on every screen"). EVERY screen of scripts/uat/screens.js, six visible windows at a time (RULE Z). On each, the page is made
// through the UI (Add page → School home) and the welcome stack's quote is carried below the head's name the way a person there
// carries it: under the dock line a FINGER (a 250 ms hold, real touch events), above it a MOUSE pressing on the block (no grip).
// Seen and recorded: the copy following, the name making room (or a line showing the place), the chip's words, where it lands;
// then, with a mouse, carried again and put back with Escape — nothing moved. A screenshot is taken while it is held.
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le15n-headed.js [--only=375,1600]
const path = require('path'); const fs = require('fs');
const H = require('./h.js');
const { SCREENS, EDGE } = require('./screens.js');
const T = require('../../config/inspector.json').sections;
const OUT = path.join(__dirname, 'logs', 'le15n'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean).map(Number);
const wait = (page, ms) => page.waitForTimeout(ms);
const results = [];
const rec = (s, what, ok, seen) => { results.push({ screen: s.label, w: s.w, what, ok, seen }); console.log(`[${s.w}×${s.h}] ${what} ${ok ? 'WORKS' : 'NOT'} · ${seen}`); };

async function makePage(page) {
  const add = page.getByRole('button', { name: 'Add page', exact: true }).first();
  if (!(await add.isVisible().catch(() => false))) { await page.getByRole('button', { name: 'More', exact: true }).first().click(); await wait(page, 400); }
  await page.getByRole('button', { name: 'Add page', exact: true }).first().click();
  const d = page.getByRole('dialog', { name: T.addPageTitle }); await d.waitFor(); await wait(page, 1200);
  await d.getByRole('textbox').fill('Drag'); await d.getByRole('button', { name: /^Add School home,/ }).click(); await wait(page, 2500);
  if (await page.getByRole('dialog', { name: 'More' }).isVisible().catch(() => false)) await page.keyboard.press('Escape');
}
/** The welcome stack: its quote and the head's name, by their words; the order of its lines. */
const find = (page) => page.evaluate(() => {
  const leaf = (re) => Array.from(document.querySelectorAll('[data-box-id]')).find((e) => re.test((e.textContent || '').trim()) && !e.querySelector('[data-box-id]'));
  const h = leaf(/^A welcome from our head/i), q = leaf(/^“Every child/), n = leaf(/^Mrs Ngozi/);
  let s = h.parentElement.closest('[data-box-id]'); while (s.querySelectorAll(':scope > [data-box-id]').length < 4) s = s.parentElement.closest('[data-box-id]');
  s.scrollIntoView({ block: 'center' });
  return { stack: s.getAttribute('data-box-id'), quote: q.getAttribute('data-box-id'), name: n.getAttribute('data-box-id') };
});
const rectOf = (page, id) => page.evaluate((id) => { const r = document.querySelector(`[data-box-id="${CSS.escape(id)}"]`).getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }, id);
const order = (page, stack) => page.evaluate((s) => Array.from(document.querySelector(`[data-box-id="${CSS.escape(s)}"]`).querySelectorAll(':scope > [data-box-id]')).map((k) => (k.textContent || '').trim().slice(0, 4)), stack);
const selected = (page) => page.evaluate(() => document.querySelector('[data-chrome-mirror]')?.getAttribute('data-chrome-mirror') || null);

/** One carry: pick the quote (clicks), press — a finger's hold or a mouse — and move onto the name's lower edge. Returns a `drop` and an `esc`. */
async function carry(page, s, ids, finger) {
  await page.keyboard.press('Escape'); await page.keyboard.press('Escape'); await wait(page, 200);
  await page.evaluate((id) => document.querySelector(`[data-box-id="${CSS.escape(id)}"]`).scrollIntoView({ block: 'center' }), ids.stack); await wait(page, 400);
  const q = await rectOf(page, ids.quote), n = await rectOf(page, ids.name);
  for (let i = 0; i < 8 && (await selected(page)) !== ids.quote; i++) { await page.mouse.click(q.x + q.w * 0.7, q.y + q.h / 2); await wait(page, 300); }
  const from = { x: q.x + q.w * 0.7, y: q.y + q.h / 2 }, to = { x: from.x, y: n.y + n.h - 4 }, steps = 16;
  let cdp = null;
  const t = (type, p) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: p ? [{ x: Math.round(p.x), y: Math.round(p.y), id: 1 }] : [] });
  if (finger) { cdp = await page.context().newCDPSession(page); await t('touchStart', from); await wait(page, 320); } else { await page.mouse.move(from.x, from.y); await page.mouse.down(); }
  for (let k = 1; k <= steps; k++) { const p = { x: from.x, y: from.y + ((to.y - from.y) * k) / steps }; if (finger) await t('touchMove', p); else await page.mouse.move(p.x, p.y); await wait(page, 25); }
  await wait(page, 350); if (finger) await t('touchMove', to); else await page.mouse.move(to.x, to.y);
  const held = await page.evaluate(([nid]) => {
    const copy = document.querySelector('[data-drag-copy]'), words = document.querySelector('[data-drop-words]')?.textContent || '';
    const line = Array.from(document.body.children).find((e) => e.style.position === 'fixed' && /shadow-\[0_0_10px/.test(e.className));
    const lr = line && line.getBoundingClientRect();
    return { copy: !!copy, words, line: !!lr && lr.width > 0, nameY: document.querySelector(`[data-box-id="${CSS.escape(nid)}"]`).getBoundingClientRect().y };
  }, [ids.name]);
  held.nameMoved = held.nameY - n.y;
  return {
    held,
    drop: async () => { if (finger) { await t('touchEnd'); await cdp.detach(); } else await page.mouse.up(); await wait(page, 700); },
    esc: async () => { await page.keyboard.press('Escape'); if (finger) { await t('touchEnd'); await cdp.detach(); } else await page.mouse.up(); await wait(page, 700); },
  };
}

async function run(s, pos) {
  const finger = s.w < EDGE.DOCK; // under the dock line a person is a finger (LE15l-aj)
  const { browser, page, errs } = await H.open({ headed: true, w: s.w, h: s.h, pos, touch: finger });
  try {
    await makePage(page);
    const ids = await find(page);
    const before = await order(page, ids.stack);
    const c = await carry(page, s, ids, finger);
    await page.screenshot({ path: path.join(OUT, `${s.w}x${s.h}-held.png`) });
    await c.drop();
    const after = await order(page, ids.stack);
    const landed = after.indexOf('“Eve') === before.indexOf('Mrs ') && after.indexOf('Mrs ') === before.indexOf('“Eve');
    rec(s, `${finger ? 'a finger' : 'a mouse'} carries the quote below the name`, c.held.copy && (c.held.nameMoved < -10 || c.held.line) && !!c.held.words && landed,
      `copy ${c.held.copy} · the name moved ${Math.round(c.held.nameMoved)} px${c.held.line ? ' · a line shown' : ''} · chip "${c.held.words}" · ${before.join(' ')} → ${after.join(' ')}`);
    if (!finger) {
      const b2 = await order(page, ids.stack), e = await carry(page, s, ids, false);
      await e.esc();
      const a2 = await order(page, ids.stack), left = await page.locator('[data-drag-copy]').count();
      rec(s, 'carried and put back with Escape', a2.join() === b2.join() && left === 0, `${b2.join(' ')} → ${a2.join(' ')} · copies left ${left}`);
    }
  } catch (e) { rec(s, 'ran', false, 'ERROR ' + e.message.split('\n')[0].slice(0, 160)); await page.screenshot({ path: path.join(OUT, `${s.w}x${s.h}-ERR.png`) }).catch(() => {}); }
  rec(s, 'no console errors', !errs.length, errs.join(' | ').slice(0, 200) || 'none');
  await browser.close();
}

(async () => {
  const queue = SCREENS.filter((s) => !ONLY.length || ONLY.includes(s.w));
  let slot = 0;
  const worker = async (k) => { const pos = [(k % 3) * 620, Math.floor(k / 3) * 480]; while (queue.length) await run(queue.shift(), pos); };
  await Promise.all(Array.from({ length: Math.min(6, queue.length) }, () => worker(slot++)));
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
  console.log(`SUMMARY LE-15n headed: ${results.filter((r) => r.ok).length} WORK · ${results.filter((r) => !r.ok).length} NOT on ${SCREENS.filter((s) => !ONLY.length || ONLY.includes(s.w)).length} screens`);
})();
