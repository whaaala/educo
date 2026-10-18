/**
 * BATCH LE-13 · THE APP half of the HEADED pass (U5's app line in docs/TASK_TREE.md): the site editor's WebView on the tablet
 * (emulator-5554) and the phone (emulator-5556). Built through the editor's own UI with REAL touches (adb input); read over CDP.
 * A Stack holding a picture and words, the picture set Wrap words round it → Start; then a Side by side at the end of the page set
 * When it doesn't fit → Scroll sideways and Overlap the section above → the first step — then the app's Preview: the words beside
 * the picture where the Stack is at least config flow.wrapBelowRem wide (under it where narrower), one line that scrolls, the
 * section pulled up over the one above by the step, nothing sideways.
 *   node scripts/uat/uat-le13-emulator.js tablet|phone     (Metro on 8081, `next start -p 3100`, the emulator booted)
 */
const fs = require('fs'); const path = require('path');
const u = require('./adb-ui.js'); const { editorPage, touch } = require('./e5d-lib.js');
const F = require('../../config/inspector.json').flow; const FLOW = require('../../config/layout.json').flow;
const which = process.argv[2] || 'phone';
const d = process.env.SERIAL || (which === 'tablet' ? 'emulator-5554' : 'emulator-5556'); // SERIAL: an emulator booted alone takes 5554
const port = which === 'tablet' ? 9301 : 9302;
const OUT = path.join(__dirname, 'logs', 'le13'); fs.mkdirSync(OUT, { recursive: true });
const results = []; const ok = (line, pass, seen) => { results.push({ which, line, pass: !!pass, seen }); console.log(`${pass ? 'PASS' : 'FAIL'} [${which}] ${line} — ${seen}`); };
const shot = (tag) => u.shot(d, path.join(OUT, `emu-${which}-${tag}.png`));
const sel = (page) => page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);
const stored = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1') || 'null'));
/** What the screen being edited stored — the app edits the screen it is on, over a base default (LE4-5). */
const own = (n, k) => { const r = Object.values(n?.responsive || {}).map((x) => x?.[k]).find((v) => v !== undefined); return r !== undefined ? r : n?.[k]; };
const find = (st, id) => { let n = null; const w = (x) => { if (x.id === id) n = x; (x.children || []).forEach(w); }; st.pages.forEach((p) => w(p.root)); return n; };

(async () => {
  for (const p of ['8081', '3100']) u.adb(d, ['reverse', `tcp:${p}`, `tcp:${p}`]);
  u.shell(d, 'am force-stop host.exp.exponent'); await u.sleep(1500);
  u.shell(d, 'am start -a android.intent.action.VIEW -d exp://localhost:8081/--/site-editor'); await u.sleep(15000);
  if (u.find(d, 'Continue')) { u.tap(d, 'Continue'); await u.sleep(1000); }
  // LE13-18 · Expo Go now and then sends its task to the back ~4s after the link opens (logcat: moveTaskToBack) — open it again, once, and say so
  let { browser, page } = await editorPage(d, port, 60000).catch(async () => {
    console.log(`NOTE [${which}] the editor did not come up — opening the link again`);
    u.shell(d, 'am start -a android.intent.action.VIEW -d exp://localhost:8081/--/site-editor'); await u.sleep(15000);
    return editorPage(d, port, 90000);
  });
  await page.evaluate(() => { localStorage.removeItem('educo_box_site_v1'); location.reload(); }).catch(() => {}); // an EMPTY site, as BATCH E-5d
  await u.sleep(2000); await browser.close().catch(() => {});
  ({ browser, page } = await editorPage(d, port, 60000));
  // LE13b-14 · once, after a cold boot, the editor took over 90 s to show its blocks panel (Metro had bundled in 18 s) — measured here
  const t0 = Date.now(); await page.waitForFunction(() => !!document.querySelector('[aria-label="Open blocks panel"]'), null, { timeout: 90000 });
  console.log(`NOTE [${which}] the editor was ready ${((Date.now() - t0) / 1000).toFixed(1)} s after its reload`);
  const errors = []; page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
  const tap = async (loc) => { await loc.scrollIntoViewIfNeeded().catch(() => {}); await u.sleep(300); await touch(d, page, loc); await u.sleep(900); };
  const addBlock = async (tile, where) => {
    await page.evaluate(() => document.activeElement?.blur?.());
    await tap(page.getByRole('button', { name: 'Open blocks panel' }));
    const dlg = page.getByRole('dialog', { name: 'Blocks' }); const scope = (await dlg.isVisible().catch(() => false)) ? dlg : page;
    if (where) { const w = scope.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: where, exact: true }).first(); if (await w.isVisible().catch(() => false)) await tap(w); }
    await tap(scope.getByRole('button', { name: new RegExp(`^Add ${tile}( —|$)`) }).first());
    if (await page.getByRole('menuitem').count()) await tap(page.getByRole('menuitem').first());
    const shut = page.getByRole('button', { name: /^Close (blocks panel|the blocks panel)$|^Close$/ }).first(); if (await shut.isVisible().catch(() => false)) await tap(shut);
    return sel(page);
  };
  const inspector = async (section) => {
    for (const tab of ['Layout', 'Design']) {
      const t = page.getByRole('tab', { name: tab }).first();
      for (let i = 0; i < 4 && !(await t.isVisible().catch(() => false)); i++) { const exp = page.getByRole('button', { name: 'Expand inspector' }); if (await exp.isVisible().catch(() => false)) await tap(exp); else await u.sleep(800); }
      if (!(await t.isVisible().catch(() => false))) continue;
      await tap(t); const head = page.getByRole('button', { name: new RegExp(`^\\s*${section}\\s*$`) }).first();
      if (await head.count()) { if ((await head.getAttribute('aria-expanded')) === 'false') await tap(head); return; }
    }
    throw new Error(`no ${section} section`);
  };
  const close = async () => { const col = page.getByRole('button', { name: /Collapse inspector|Close inspector/ }).first(); if (await col.isVisible().catch(() => false)) await tap(col); };
  const selectBlock = async (id) => { await close(); for (let i = 0; i < 4 && (await sel(page)) !== id; i++) await tap(page.locator(`[data-box-id="${id}"]`).first()); if ((await sel(page)) !== id) throw new Error(`could not select ${id.slice(-4)}`); };
  const choose = async (group, choice) => tap(page.getByRole('group', { name: group, exact: true }).getByRole('button', { name: choice, exact: true }).first());

  const stack = await addBlock('Stack');
  const pic = await addBlock('Image', 'Inside');
  // the picture fills the Stack, so there is no Stack left to tap: the words go AFTER the picture, as a person adds them
  const text = await addBlock('Text', 'After');
  await selectBlock(pic); await inspector('Position'); await choose(F.wrap, F.wrapChoices.start); shot('wrap');
  // LE-13b · the Circle style and Words follow → Its round corners, with touches
  await choose(F.shape, F.shapeChoices.round); shot('words-follow');
  // LE-13c · Space round it, a touch on the middle of its slider (a step of the spacing scale, not the default)
  await tap(page.getByRole('slider', { name: F.gap, exact: true }).first()); shot('space-round');
  const gap = own(find(await stored(page), pic), 'wrapGap');
  ok('LE-13c Space round it set with a touch: a step of its own stored on the spacing scale', typeof gap === 'number' && gap > 0 && gap <= FLOW.wrapGapMax, `wrapGap ${gap}`);
  await tap(page.getByRole('tab', { name: 'Design' }).first()); await tap(page.getByRole('group', { name: 'Style presets' }).getByRole('button', { name: 'Circle style' }).first()); await close();
  const row = await addBlock('Side by side', 'End');
  await selectBlock(row).catch(() => {}); await inspector('Arrange');
  await choose(F.fit, F.fitChoices.scroll); await choose(F.overlap, F.overlapSteps[0]); shot('strip-overlap'); await close();
  const st = await stored(page);
  ok('made in the app with touches: the picture Wrap → Start, the Circle style, Words follow → Its round corners, the Side by side Scroll sideways and Overlap → the first step',
    own(find(st, pic), 'wrapAround') === 'start' && own(find(st, pic), 'wrapShape') === 'round' && own(find(st, pic), 'radius') >= 999 && own(find(st, row), 'scrollX') === true && own(find(st, row), 'overlapUp') === FLOW.overlapSteps[0],
    `${own(find(st, pic), 'wrapAround')} · ${own(find(st, pic), 'wrapShape')} · radius ${own(find(st, pic), 'radius')} · scrollX ${own(find(st, row), 'scrollX')} · overlapUp ${own(find(st, row), 'overlapUp')}`);
  // the app's Preview
  let fr = null;
  for (let i = 0; i < 3 && !fr; i++) { await tap(page.getByRole('button', { name: /^\s*Preview\s*$/ }).first()); await page.waitForSelector('iframe', { timeout: 8000 }).catch(() => {}); await u.sleep(2500); fr = page.frames().find((f) => f !== page.mainFrame()) || null; }
  const m = await fr.evaluate(([s, p, t, w]) => {
    const r = (id) => { const q = document.querySelector(`.bx-${id}`)?.getBoundingClientRect(); return q && { l: +q.left.toFixed(1), r: +q.right.toFixed(1), t: +q.top.toFixed(1), b: +q.bottom.toFixed(1), w: +q.width.toFixed(1) }; };
    const row = document.querySelector(`.bx-${w}`); const band = row.parentElement; const above = band.previousElementSibling;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    // the first LINE of words: a text run's own rectangle (LE13-17 — a range over the element returned the <p>'s box first)
    const tw = document.createTreeWalker(document.querySelector(`.bx-${t}`), NodeFilter.SHOW_TEXT); let n, line = null;
    while (!line && (n = tw.nextNode())) { if (!n.textContent.trim()) continue; const range = document.createRange(); range.selectNodeContents(n); line = [...range.getClientRects()].find((x) => x.width > 1) || null; }
    const pc = getComputedStyle(document.querySelector(`.bx-${p}`));
    return { shape: pc.shapeOutside, space: { shape: parseFloat(pc.shapeMargin) || 0, side: parseFloat(pc.marginInlineEnd), fl: pc.float }, vw: document.documentElement.clientWidth, sw: document.documentElement.scrollWidth, rem, s: r(s), p: r(p), line: line && { l: line.left, t: line.top },
      ox: getComputedStyle(row).overflowX, wrap: getComputedStyle(row).flexWrap, overlap: above ? +(above.getBoundingClientRect().bottom - row.getBoundingClientRect().top).toFixed(1) : null };
  }, [stack, pic, text, row]);
  const hide = page.getByRole('button', { name: 'Hide the preview controls' }).first(); if (await hide.isVisible().catch(() => false)) await tap(hide);
  await u.sleep(800); shot('preview');
  const floats = m.s.w >= FLOW.wrapBelowRem * m.rem;
  // LE-13b: round — the first line starts inside where its box and the gap would put it (LE13b-12: not the bare box edge)
  const wrapOk = m.shape === 'border-box' && (floats ? m.line.t < m.p.b && m.line.l < m.p.r + FLOW.wrapGapRem * m.rem - 1 : m.line.t >= m.p.b - 1 && Math.abs(m.p.w - (m.p.b - m.p.t)) <= 1.5); // LE13b-11 / -13: under it, and the Circle stays round
  ok(`the app's Preview (${m.vw}px): the words ${floats ? 'BESIDE the round picture, following its curve' : 'under the picture, which stops floating and stays round'}`, wrapOk, JSON.stringify({ shape: m.shape, s: m.s, p: m.p, line: m.line }));
  // LE-13c: where it floats, the space round the curve and beside it is the picture's own — not the default 1rem
  ok(`LE-13c the app's Preview: ${floats ? 'the space round the curve is the picture\'s own, the same beside it' : 'the picture takes the line (no space to lay out)'}`,
    !floats || (m.space.shape > 0 && Math.abs(m.space.shape - m.space.side) <= 0.5 && Math.abs(m.space.shape - FLOW.wrapGapRem * m.rem) > 0.5), JSON.stringify(m.space));
  ok('the Side by side is one line that scrolls, pulled up over the section above by the step; nothing sideways',
    m.ox === 'auto' && m.wrap === 'nowrap' && Math.abs(m.overlap - FLOW.overlapSteps[0] * m.rem) <= 1.5 && m.sw <= m.vw, JSON.stringify({ ox: m.ox, wrap: m.wrap, overlap: m.overlap, sw: m.sw, vw: m.vw }));
  ok('no console errors in the editor', !errors.length, errors.join(' | ') || 'none');
  await browser.close().catch(() => {});
  fs.writeFileSync(path.join(OUT, `emu-${which}.json`), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.pass); console.log(`SUMMARY [${which}] ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error('ERR', e.message.split('\n')[0]); shot('ERR'); process.exit(1); });
