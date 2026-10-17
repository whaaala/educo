/**
 * BATCH LE-12 · THE APP half of the HEADED pass (U7's app line in docs/TASK_TREE.md): the site editor's WebView on the phone
 * (emulator-5556) and the tablet (emulator-5554). Built through the editor's own UI with REAL touches (adb input); read over CDP.
 * A Stack with a Heading, its Proportion 16:9 and the heading's Max width 30rem; a Grid "3 across" set to As many as fit — then the
 * app's Preview: the Stack 16:9, the heading ≤ 480, the cards as many across as fit at the card width, nothing wider than the screen.
 *   node scripts/uat/uat-le12-emulator.js phone|tablet     (Metro on 8081, `next start -p 3100`, the emulator booted)
 */
const fs = require('fs'); const path = require('path');
const u = require('./adb-ui.js'); const { editorPage, touch } = require('./e5d-lib.js');
const LAYOUT = require('../../config/layout.json'); const S = require('../../config/inspector.json').sizes;
const which = process.argv[2] || 'phone';
const d = process.env.SERIAL || (which === 'tablet' ? 'emulator-5554' : 'emulator-5556'); // SERIAL: an emulator booted alone takes 5554
const port = which === 'tablet' ? 9301 : 9302;
const OUT = path.join(__dirname, 'logs', 'le12'); fs.mkdirSync(OUT, { recursive: true });
const results = []; const ok = (line, pass, seen) => { results.push({ which, line, pass: !!pass, seen }); console.log(`${pass ? 'PASS' : 'FAIL'} [${which}] ${line} — ${seen}`); };
const shot = (tag) => u.shot(d, path.join(OUT, `emu-${which}-${tag}.png`));
const sel = (page) => page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);
const stored = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1') || 'null'));
/** What a block holds for `k` on any screen — the app edits the screen it is on. */
const own = (n, k) => n?.[k] ?? Object.values(n?.responsive || {}).map((r) => r?.[k]).find((v) => v !== undefined);
const find = (st, id) => { let n = null; const w = (x) => { if (x.id === id) n = x; (x.children || []).forEach(w); }; st.pages.forEach((p) => w(p.root)); return n; };

(async () => {
  for (const p of ['8081', '3100']) u.adb(d, ['reverse', `tcp:${p}`, `tcp:${p}`]);
  u.shell(d, 'am force-stop host.exp.exponent'); await u.sleep(1500);
  u.shell(d, 'am start -a android.intent.action.VIEW -d exp://localhost:8081/--/site-editor'); await u.sleep(15000);
  if (u.find(d, 'Continue')) { u.tap(d, 'Continue'); await u.sleep(1000); }
  let { browser, page } = await editorPage(d, port, 120000);
  await page.evaluate(() => { localStorage.removeItem('educo_box_site_v1'); location.reload(); }).catch(() => {}); // an EMPTY site, as BATCH E-5d
  await u.sleep(2000); await browser.close().catch(() => {});
  ({ browser, page } = await editorPage(d, port, 60000));
  await page.waitForFunction(() => !!document.querySelector('[aria-label="Open blocks panel"]'), null, { timeout: 90000 });
  const errors = []; page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
  const tap = async (loc) => { await loc.scrollIntoViewIfNeeded().catch(() => {}); await u.sleep(300); await touch(d, page, loc); await u.sleep(900); };
  const addBlock = async (tile, where) => {
    await page.evaluate(() => document.activeElement?.blur?.());
    await tap(page.getByRole('button', { name: 'Open blocks panel' }));
    const dlg = page.getByRole('dialog', { name: 'Blocks' }); const scope = (await dlg.isVisible().catch(() => false)) ? dlg : page;
    if (where) { const w = scope.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: where, exact: true }).first(); if (await w.isVisible().catch(() => false)) await tap(w); }
    await tap(scope.getByRole('button', { name: new RegExp(`^Add ${tile}( —|$)`) }).first());
    const three = page.locator('[role="menu"][aria-label="Choose a layout"] [aria-label="3 across, 1 down"]');
    if (await three.isVisible().catch(() => false)) await tap(three);
    else if (await page.getByRole('menuitem').count()) await tap(page.getByRole('menuitem').first());
    const shut = page.getByRole('button', { name: /^Close (blocks panel|the blocks panel)$|^Close$/ }).first(); if (await shut.isVisible().catch(() => false)) await tap(shut);
    return sel(page);
  };
  const inspector = async (tab, section) => {
    const t = page.getByRole('tab', { name: tab }).first();
    for (let i = 0; i < 4 && !(await t.isVisible().catch(() => false)); i++) { const exp = page.getByRole('button', { name: 'Expand inspector' }); if (await exp.isVisible().catch(() => false)) await tap(exp); else await u.sleep(800); }
    await tap(t);
    if (section) { const head = page.getByRole('button', { name: new RegExp(`^\\s*${section}\\s*$`) }).first(); if ((await head.getAttribute('aria-expanded')) === 'false') await tap(head); }
  };
  const close = async () => { const col = page.getByRole('button', { name: /Collapse inspector|Close inspector/ }).first(); if (await col.isVisible().catch(() => false)) await tap(col); };
  const selectBlock = async (id) => { await close(); await tap(page.locator(`[data-box-id="${id}"]`).first()); };

  // a Stack holding a Heading: the Stack 16:9, the heading's Max width 30rem
  const stack = await addBlock('Stack'); const heading = await addBlock('Heading', 'Inside');
  // the heading fills its Stack, so a tap there selects the heading: it takes both (a tap cannot reach the Stack — LE12-3)
  await selectBlock(heading); await inspector('Design', 'Size');
  await tap(page.getByRole('button', { name: '16:9 proportion', exact: true }).first()); shot('proportion');
  const mw = page.getByLabel(S.maxWidth, { exact: true }).first(); await tap(mw); await mw.fill('30rem'); await mw.blur(); await u.sleep(800); shot('limits'); await close();
  // a Grid "3 across" → As many as fit
  const grid = await addBlock('Grid', 'End');
  const st0 = await stored(page); const g = find(st0, grid) || (() => { let x = null; const w = (n) => { if (n.layout === 'grid') x = n; (n.children || []).forEach(w); }; st0.pages.forEach((p) => w(p.root)); return x; })();
  const cells = (g?.children || []).map((c) => c.id);
  const hasLayout = await page.getByRole('tab', { name: 'Layout' }).first().isVisible().catch(() => false);
  await inspector(hasLayout ? 'Layout' : 'Design');
  await tap(page.getByRole('button', { name: S.modeChoices.fit, exact: true }).first()); shot('fit'); await close();
  const st = await stored(page);
  ok('made in the app with touches: the heading 16 / 9 with Max width 30rem, the Grid As many as fit',
    own(find(st, heading), 'ratio') === '16 / 9' && own(find(st, heading), 'maxWidth') === '30rem' && find(st, g.id)?.minCard === LAYOUT.sizes.autoFitStart,
    `${own(find(st, heading), 'ratio')} · ${own(find(st, heading), 'maxWidth')} · ${find(st, g.id)?.minCard}`);
  // the app's Preview
  let fr = null;
  for (let i = 0; i < 3 && !fr; i++) { await tap(page.getByRole('button', { name: /^\s*Preview\s*$/ }).first()); await page.waitForSelector('iframe', { timeout: 8000 }).catch(() => {}); await u.sleep(2500); fr = page.frames().find((f) => f !== page.mainFrame()) || null; }
  const m = await fr.evaluate(([, h, gid, cs]) => {
    const r = (id) => document.querySelector(`.bx-${id}`)?.getBoundingClientRect();
    const gap = parseFloat(getComputedStyle(document.querySelector(`.bx-${gid}`)).columnGap) || 0;
    return { vw: document.documentElement.clientWidth, sw: document.documentElement.scrollWidth, s: { w: +r(h).width.toFixed(1), h: +r(h).height.toFixed(1) }, h: +r(h).width.toFixed(1), g: +r(gid).width.toFixed(1), gap, cells: cs.map((c) => ({ t: Math.round(r(c).top), w: +r(c).width.toFixed(1) })), rem: parseFloat(getComputedStyle(document.documentElement).fontSize) };
  }, [stack, heading, g.id, cells]);
  shot('preview');
  const minCard = parseFloat(LAYOUT.sizes.autoFitStart) * m.rem, want = Math.max(1, Math.min(cells.length, Math.floor((m.g + m.gap) / (minCard + m.gap))));
  const across = m.cells.filter((c) => Math.abs(c.t - m.cells[0].t) <= 2).length;
  ok(`the app's Preview (${m.vw}px): the heading 16:9 and ≤ 30rem; ${want} card(s) across as fit at ${LAYOUT.sizes.autoFitStart}; nothing sideways`,
    m.sw <= m.vw && Math.abs(m.s.h - (m.s.w * 9) / 16) <= 2 && m.h <= 30 * m.rem + 1 && across === want && m.cells.every((c) => Math.abs(c.w - m.cells[0].w) <= 1.5), JSON.stringify({ ...m, want, across }));
  ok('no console errors in the editor', !errors.length, errors.join(' | ') || 'none');
  await browser.close().catch(() => {});
  fs.writeFileSync(path.join(OUT, `emu-${which}.json`), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.pass); console.log(`SUMMARY [${which}] ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error('ERR', e.message.split('\n')[0]); shot('ERR'); process.exit(1); });
