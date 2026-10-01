// HEADED UAT — #55: the blocks panel docks beside the page on a laptop screen and up; nothing is hidden under it.
// Every job in its own visible window, all at once:  NODE_PATH=node_modules node scripts/uat/uat55.js
const JOBS = [
  { name: 'A your-screen · Full width', w: 1520, h: 720, sc: 'Full width', kind: 'work' },
  { name: 'B your-screen · Desktop 1280', w: 1520, h: 720, sc: 'Desktop (1280px)', kind: 'fit' },
  { name: 'C laptop-1366 · Full width', w: 1350, h: 640, sc: 'Full width', kind: 'work' },
  { name: 'D phone 393', w: 393, h: 780, sc: null, kind: 'phone' },
];
const jobArg = process.argv.find((a) => a.startsWith('--job='));
if (!jobArg) {
  const { spawn } = require('child_process'); let left = JOBS.length; const all = [];
  JOBS.forEach((_, j) => {
    const c = spawn(process.execPath, [__filename, `--job=${j}`], { env: process.env });
    let out = ''; c.stdout.on('data', (d) => { out += d; }); c.stderr.on('data', (d) => { out += d; });
    c.on('exit', () => { all[j] = out; if (--left === 0) console.log(all.join('\n')); });
  });
  return;
}
const J = JOBS[Number(jobArg.slice(6))];
const H = require('./h.js');
const { first, row } = require('./pages.js').helpers;
const OUT = __dirname; const tag = J.name.replace(/[^A-Za-z0-9]+/g, '-');
const bugs = []; const log = (s) => console.log(s); const bug = (s) => { bugs.push(s); log('  BUG ' + s); };
const panelRight = (page) => page.evaluate(() => { const d = document.querySelector('[role="dialog"][aria-label="Blocks"]'); return d ? d.getBoundingClientRect().right : null; });
const lefts = (page, ids) => page.evaluate((ids) => ids.map((id) => document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect().left), ids);
const panelOpen = (page) => page.evaluate(() => !!document.querySelector('[role="dialog"][aria-label="Blocks"]'));

(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: J.w, h: J.h, pos: [Number(jobArg.slice(6)) * 14, Number(jobArg.slice(6)) * 14] });
  log(`\n[${J.name}]`);
  try {
    if (J.kind === 'phone') {
      await H.panel(page, true);
      log(`  panel open: ${await panelOpen(page)}`);
      await page.mouse.click(J.w - 30, J.h - 30); await page.waitForTimeout(500);
      const still = await panelOpen(page);
      log(`  click outside → panel ${still ? 'STILL OPEN' : 'closed'}`);
      if (still) bug('phone: a click outside did not close the floating panel');
      await page.screenshot({ path: `${OUT}/uat55-${tag}.png` });
    } else {
      if (J.sc) { await page.getByRole('button', { name: J.sc }).first().click(); await page.waitForTimeout(600); }
      await H.panel(page, true);
      const a = await first(page, 'Stack'); const ids = await row(page, a, ['Stack', 'Stack', 'Stack']);
      await page.waitForTimeout(400);
      const pr = await panelRight(page); const ls = await lefts(page, ids);
      log(`  panel right edge ${Math.round(pr)} · blocks start at ${ls.map(Math.round).join(', ')}`);
      ls.forEach((l, i) => { if (l < pr - 1) bug(`block ${i + 1} starts ${Math.round(pr - l)}px under the open panel`); });
      await page.screenshot({ path: `${OUT}/uat55-${tag}-open.png` });
      if (J.kind === 'fit') {
        const m = await page.evaluate(() => { const f = document.querySelector('[style*="container-type"]'); const aside = document.querySelector('aside[aria-label="Inspector"]'); const st = Array.from(document.querySelectorAll('[role="status"]')).map((e) => e.textContent).find((t) => /Fitted/.test(t || '')); return { z: f.closest('[data-canvas-scale]')?.dataset.canvasScale * 1, l: f.getBoundingClientRect().left, r: f.getBoundingClientRect().right, insp: aside ? aside.getBoundingClientRect().left : null, st }; });
        log(`  page ${Math.round(m.l)}–${Math.round(m.r)} at zoom ${m.z.toFixed(2)} (${m.st}) · panel ends ${Math.round(pr)} · Inspector starts ${Math.round(m.insp)}`);
        if (m.l < pr - 1) bug('Desktop canvas starts under the open panel');
        if (m.r > m.insp + 1) bug('Desktop canvas runs under the Inspector');
        if (!m.st) bug('shrunk but not stated');
      }
      if (J.kind === 'work') {
        // Text into EVERY stack of the row, with the panel open — including the first.
        for (const [i, id] of ids.entries()) {
          await H.dropInto(page, 'Text', id);
          const inside = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).querySelectorAll('[data-box-id]').length, id);
          if (!inside) bug(`the Text meant for stack ${i + 1} did not go into it`);
        }
        const n = (await H.rowOf(page, ids[0])).kids.length;
        log(`  dropped Text into all 4 stacks → the row has ${n} blocks`);
        // #57 — the page must not change SHAPE because a panel opened: same lines, same proportions, open or shut.
        const shape = async () => { const r = await H.rowOf(page, ids[0]); const tops = new Set(r.kids.map((k) => k.t)); return { lines: tops.size, shares: r.kids.map((k) => Math.round((k.w / r.inner) * 100)).join('/') }; };
        const openShape = await shape();
        await page.getByRole('button', { name: 'Close blocks panel' }).click(); await page.waitForTimeout(600);
        const shutShape = await shape();
        log(`  row shape — panel open: ${openShape.lines} line(s) ${openShape.shares} · shut: ${shutShape.lines} line(s) ${shutShape.shares}`);
        if (openShape.lines !== 1) bug(`with the panel open the four-across row wrapped onto ${openShape.lines} lines`);
        if (openShape.lines !== shutShape.lines || openShape.shares !== shutShape.shares) bug('opening the panel changed the page\'s layout');
        await H.panel(page, true);
        if (n !== 4) bug(`the row has ${n} blocks after dropping into its 4 stacks`);
        // Clicking the page keeps the docked panel open and the page still.
        const before = await lefts(page, ids);
        await H.select(page, ids[2]);
        const after = await lefts(page, ids); const open = await panelOpen(page);
        log(`  clicked a block → panel ${open ? 'open' : 'CLOSED'} · page moved ${Math.round(after[0] - before[0])}px`);
        if (!open) bug('clicking the page closed the docked panel');
        if (Math.abs(after[0] - before[0]) > 1) bug('the page moved under the pointer on a click');
        await page.screenshot({ path: `${OUT}/uat55-${tag}-filled.png` });
        // Every way to close it, and the page slides back each time.
        for (const how of ['close button', 'Escape', 'B']) {
          if (!(await panelOpen(page))) await H.panel(page, true);
          await page.mouse.click(5, J.h - 5); // focus the page, outside any field
          if (how === 'close button') await page.getByRole('button', { name: 'Close blocks panel' }).click();
          else await page.keyboard.press(how === 'Escape' ? 'Escape' : 'b');
          await page.waitForTimeout(500);
          const shut = !(await panelOpen(page)); const l0 = (await lefts(page, ids))[0];
          log(`  ${how} → ${shut ? 'closed' : 'STILL OPEN'} · first block now starts at ${Math.round(l0)}`);
          if (!shut) bug(`${how} did not close the docked panel`);
        }
        await page.screenshot({ path: `${OUT}/uat55-${tag}-closed.png` });
      }
    }
  } catch (e) { bug('harness: ' + e.message.split('\n')[0]); await page.screenshot({ path: `${OUT}/uat55-${tag}-THROW.png` }).catch(() => {}); }
  if (errs.length) bug('console errors: ' + errs.join(' | '));
  log(`=== ${J.name} — BUGS: ${bugs.length ? '\n  ' + bugs.join('\n  ') : 'none'}`);
  await browser.close();
})();
