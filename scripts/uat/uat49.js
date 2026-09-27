// HEADED UAT — #49 (canvas shrunk to fit a real screen; drags exact at any zoom; handles clipped) and
// #48 (phone: the Inspector slides over the page). Built through the UI, real window sizes, screenshots read.
//   NODE_PATH=node_modules node scripts/uat/uat49.js          ← every part at once, one visible window each
//   NODE_PATH=node_modules node scripts/uat/uat49.js --job=N  ← one part
const JOBS = ['Full width', 'Laptop (1024px)', 'Desktop (1280px)', 'Wide (1920px)', 'CLIP', 'PHONE'];
const jobArg = process.argv.find((a) => a.startsWith('--job='));
if (!jobArg) {
  const { spawn } = require('child_process'); let left = JOBS.length; const all = [];
  JOBS.forEach((_, j) => {
    const c = spawn(process.execPath, [__filename, `--job=${j}`], { env: process.env });
    let out = ''; c.stdout.on('data', (d) => { out += d; }); c.stderr.on('data', (d) => { out += d; });
    c.on('exit', () => { all[j] = out; if (--left === 0) { console.log(all.join('\n')); } });
  });
  return;
}
const JOB = JOBS[Number(jobArg.slice(6))];
const H = require('./h.js');
const { first, row } = require('./pages.js').helpers;
const OUT = __dirname;
const bugs = []; const log = (s) => console.log(s);
const bug = (s) => { bugs.push(s); log('  BUG ' + s); };

const measure = (page, id) => page.evaluate((id) => {
  const el = document.querySelector(`[data-box-id="${id}"]`); const r = el.getBoundingClientRect();
  const frame = el.closest('[style*="container-type"]') || el.closest('[style*="inline-size"]');
  const scroller = (() => { let s = el.parentElement; while (s && !/(auto|scroll)/.test(getComputedStyle(s).overflow + getComputedStyle(s).overflowX)) s = s.parentElement; return s; })();
  const aside = document.querySelector('aside[aria-label="Inspector"]');
  const fitted = Array.from(document.querySelectorAll('[role="status"]')).map((e) => e.textContent).find((t) => /Fitted/.test(t || '')) || null;
  return {
    l: r.left, r: r.right, t: r.top, b: r.bottom, w: r.width, h: r.height,
    zoom: el.currentCSSZoom ?? null,
    frameR: frame ? frame.getBoundingClientRect().right : null,
    asideL: aside ? aside.getBoundingClientRect().left : null,
    sideways: scroller ? scroller.scrollWidth - scroller.clientWidth : null,
    fitted,
  };
}, id);

(async () => {
  // ── A · the user's own screen (1536×864 → a 1520×720 page), every canvas size ──
  if (JOB !== 'PHONE') {
    const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 720, pos: [JOBS.indexOf(JOB) * 12, JOBS.indexOf(JOB) * 12] });
    await H.panel(page, true);
    const a = await first(page, 'Stack'); const ids = await row(page, a, ['Stack', 'Stack']);
    await H.panel(page, false); await H.fillStacks(page); await H.panel(page, false);
    for (const sc of JOB === 'CLIP' ? [] : [JOB]) {
      await page.getByRole('button', { name: sc }).first().click(); await page.waitForTimeout(700);
      const m0 = await measure(page, ids[0]);
      const tag = sc.replace(/[^A-Za-z0-9]+/g, '-');
      log(`\n[${sc}] zoom ${m0.zoom} · ${m0.fitted || 'not fitted'} · sideways ${m0.sideways}px · frame right ${Math.round(m0.frameR)} vs Inspector left ${Math.round(m0.asideL)}`);
      if (m0.sideways > 1) bug(`${sc}: canvas scrolls sideways by ${m0.sideways}px`);
      if (m0.asideL != null && m0.frameR > m0.asideL + 1) bug(`${sc}: page runs ${Math.round(m0.frameR - m0.asideL)}px under the Inspector`);
      if (m0.zoom < 0.999 && !m0.fitted) bug(`${sc}: shrunk to ${m0.zoom} but nothing says so`);
      await page.screenshot({ path: `${OUT}/uat49-A-${tag}.png` });
      // RIGHT edge: the edge follows the pointer exactly, out and back
      for (const d of [60, -60]) {
        await H.select(page, ids[0]); const before = await measure(page, ids[0]);
        await H.dragEdge(page, 'right', d); const after = await measure(page, ids[0]);
        const moved = after.r - before.r;
        log(`  right edge ${d > 0 ? '+' : ''}${d}: moved ${moved.toFixed(1)}px, left edge moved ${(after.l - before.l).toFixed(1)}px`);
        if (Math.abs(moved - d) > 2) bug(`${sc}: right edge moved ${moved.toFixed(1)}px for a ${d}px drag`);
        if (Math.abs(after.l - before.l) > 1) bug(`${sc}: the LEFT edge moved ${(after.l - before.l).toFixed(1)}px on a right-edge drag`);
      }
      // BOTTOM edge: the block grows exactly as far as the pointer went, out and back
      for (const d of [50, -50]) {
        await H.select(page, ids[0]); const before = await measure(page, ids[0]);
        await H.dragEdge(page, 'bottom', 0, d); const after = await measure(page, ids[0]);
        const grew = after.b - before.b;
        log(`  bottom edge ${d > 0 ? '+' : ''}${d}: moved ${grew.toFixed(1)}px, top moved ${(after.t - before.t).toFixed(1)}px`);
        if (Math.abs(grew - d) > 2) bug(`${sc}: bottom edge moved ${grew.toFixed(1)}px for a ${d}px drag`);
        if (Math.abs(after.t - before.t) > 1) bug(`${sc}: the TOP edge moved ${(after.t - before.t).toFixed(1)}px on a bottom-edge drag`);
      }
      await page.screenshot({ path: `${OUT}/uat49-A-${tag}-after.png` });
    }
    // ── B · handles never outside the canvas: make the page tall, select the top block, scroll it under the toolbar ──
    if (JOB === 'CLIP') {
    await page.getByRole('button', { name: 'Desktop (1280px)' }).first().click(); await page.waitForTimeout(500);
    // PRECONDITION FIRST (#50): the canvas must really scroll, or a clip check passes without testing anything.
    const room = () => page.evaluate((id) => { const el = document.querySelector(`[data-box-id="${id}"]`); let s = el.parentElement; while (s && !/(auto|scroll)/.test(getComputedStyle(s).overflow)) s = s.parentElement; return s.scrollHeight - s.clientHeight; }, ids[0]);
    // Made taller the way a user does it in one click each — "Add a band" — not by aiming drops behind the panel.
    await H.panel(page, false);
    for (let k = 0; k < 20 && (await room()) < 300; k++) { await page.getByRole('button', { name: 'Add a band' }).first().click(); await page.waitForTimeout(400); }
    await H.select(page, ids[0]);
    const clip = await page.evaluate((id) => {
      const el = document.querySelector(`[data-box-id="${id}"]`);
      let s = el.parentElement; while (s && !/(auto|scroll)/.test(getComputedStyle(s).overflow)) s = s.parentElement;
      // Put the selected block's top 60px ABOVE the canvas's top edge — under the toolbar.
      s.scrollTop += el.getBoundingClientRect().top - s.getBoundingClientRect().top + 60;
      return new Promise((res) => setTimeout(() => {
        const sr = s.getBoundingClientRect(); const mir = document.querySelector(`[data-chrome-mirror="${id}"]`);
        const handles = Array.from(document.querySelectorAll('[aria-label^="Resize"]')).map((h) => h.getBoundingClientRect());
        const above = handles.filter((r) => r.bottom < sr.top);
        // clip-path also clips hit-testing: a handle outside the canvas must be neither seen nor grabbable there.
        const leaks = above.filter((r) => { const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return hit && hit.getAttribute('aria-label')?.startsWith('Resize'); }).length;
        res({ scrolled: s.scrollTop, clipPath: mir ? getComputedStyle(mir).clipPath : null, above: above.length, leaks });
      }, 700));
    }, ids[0]);
    if (!clip.above) bug(`clip check did not reach its precondition — no handle above the canvas (scrolled ${clip.scrolled}px)`);
    // NEGATIVE CONTROL: take the clip off in the page — the same check must now see the handle, or it cannot fail.
    const unclipped = await page.evaluate((id) => {
      const mir = document.querySelector(`[data-chrome-mirror="${id}"]`); if (!mir) return -1;
      const was = mir.style.clipPath; mir.style.clipPath = 'none';
      let s = document.querySelector(`[data-box-id="${id}"]`).parentElement; while (s && !/(auto|scroll)/.test(getComputedStyle(s).overflow)) s = s.parentElement;
      const sr = s.getBoundingClientRect();
      const n = Array.from(document.querySelectorAll('[aria-label^="Resize"]')).map((h) => h.getBoundingClientRect()).filter((r) => r.bottom < sr.top)
        .filter((r) => { const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return hit && hit.getAttribute('aria-label')?.startsWith('Resize'); }).length;
      mir.style.clipPath = was; return n;
    }, ids[0]);
    log(`  negative control — clip removed: ${unclipped} handle(s) now show over the toolbar (must be > 0)`);
    if (!(unclipped > 0)) bug('negative control: with the clip removed the check still saw nothing — the check cannot fail');
    log(`\n[handles scrolled under the toolbar] clip ${clip.clipPath} · handles above the canvas ${clip.above} · of those still clickable/visible ${clip.leaks}`);
    if (clip.leaks) bug(`${clip.leaks} handle(s) drawn over the toolbar after scrolling`);
    if (!clip.clipPath || clip.clipPath === 'none') bug('the handle layer has no clip');
    await page.screenshot({ path: `${OUT}/uat49-B-scrolled.png` });
    }
    if (errs.length) bug('console errors: ' + errs.join(' | '));
    await browser.close();
  }
  // ── C · a phone-sized window: the page is there; the Inspector slides over it ──
  if (JOB === 'PHONE') {
    const { browser, page, errs } = await H.open({ headed: true, w: 393, h: 780, pos: [40, 0] });
    const s0 = await page.evaluate(() => {
      const f = document.querySelector('[style*="container-type"]'); const aside = document.querySelector('aside[aria-label="Inspector"]');
      return { frameW: f ? f.getBoundingClientRect().width : 0, inspectorOpen: !!aside };
    });
    log(`\n[phone 393] page width ${Math.round(s0.frameW)}px · Inspector open at start: ${s0.inspectorOpen}`);
    await page.screenshot({ path: `${OUT}/uat49-C-phone-start.png` });
    if (s0.frameW < 250) bug(`phone: the page is only ${Math.round(s0.frameW)}px wide`);
    if (s0.inspectorOpen) bug('phone: the Inspector starts open over the page');
    await page.getByRole('button', { name: 'Expand inspector' }).click(); await page.waitForTimeout(500);
    const s1 = await page.evaluate(() => {
      const f = document.querySelector('[style*="container-type"]'); const aside = document.querySelector('aside[aria-label="Inspector"]');
      const ar = aside?.getBoundingClientRect();
      return { frameW: f ? f.getBoundingClientRect().width : 0, aside: ar ? { l: ar.left, w: ar.width } : null, pos: aside ? getComputedStyle(aside).position : null };
    });
    log(`  opened: Inspector ${s1.aside ? `${Math.round(s1.aside.w)}px wide at ${Math.round(s1.aside.l)}, ${s1.pos}` : 'NOT SHOWN'} · page still ${Math.round(s1.frameW)}px`);
    await page.screenshot({ path: `${OUT}/uat49-C-phone-open.png` });
    if (!s1.aside) bug('phone: Expand inspector did not open it');
    if (s1.pos !== 'absolute') bug(`phone: the Inspector takes a column (${s1.pos}) instead of sliding over`);
    if (Math.abs(s1.frameW - s0.frameW) > 2) bug('phone: opening the Inspector squeezed the page');
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    const closed = await page.evaluate(() => !document.querySelector('aside[aria-label="Inspector"]'));
    log(`  Escape: ${closed ? 'closed' : 'STILL OPEN'}`);
    if (!closed) bug('phone: Escape did not close the Inspector');
    await page.getByRole('button', { name: 'Expand inspector' }).click(); await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Collapse inspector' }).click(); await page.waitForTimeout(300);
    const closed2 = await page.evaluate(() => !document.querySelector('aside[aria-label="Inspector"]'));
    log(`  close button: ${closed2 ? 'closed' : 'STILL OPEN'}`);
    if (!closed2) bug('phone: the close button did not close the Inspector');
    await page.screenshot({ path: `${OUT}/uat49-C-phone-closed.png` });
    if (errs.length) bug('console errors: ' + errs.join(' | '));
    await browser.close();
  }
  console.log(`\n=== ${JOB} — BUGS:`, bugs.length ? '\n  ' + bugs.join('\n  ') : 'none');
})();
