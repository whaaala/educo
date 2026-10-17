/**
 * BATCH LE-3 · THE APP half of the HEADED pass (U7's app line in docs/TASK_TREE.md): the site editor's WebView on the phone
 * (emulator-5556) and the tablet (emulator-5554). Built through the editor's own UI with REAL touches (adb input); read over CDP.
 * A section with a heading, a Grid "3 across" whose Column 1 is Set 20rem and Column 2 Fit content, and the site's Content width
 * Centred — then the app's Preview: the column 320 where 3 across (one column on a phone), the heading on the one centred column,
 * nothing wider than the screen.
 *   node scripts/uat/uat-le3-emulator.js phone|tablet     (Metro on 8081, `next start -p 3100`, the emulator booted)
 */
const fs = require('fs'); const path = require('path');
const u = require('./adb-ui.js'); const { editorPage, touch } = require('./e5d-lib.js');
const LAYOUT = require('../../config/layout.json'); const WORDS = require('../../config/inspector.json').widths;
const which = process.argv[2] || 'phone';
const d = which === 'tablet' ? 'emulator-5554' : 'emulator-5556'; const port = which === 'tablet' ? 9301 : 9302;
const OUT = path.join(__dirname, 'logs', 'le3'); fs.mkdirSync(OUT, { recursive: true });
const results = []; const ok = (line, pass, seen) => { results.push({ which, line, pass: !!pass, seen }); console.log(`${pass ? 'PASS' : 'FAIL'} [${which}] ${line} — ${seen}`); };
const shot = (tag) => u.shot(d, path.join(OUT, `emu-${which}-${tag}.png`));
const sel = (page) => page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);
const stored = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1') || 'null'));

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
  const tap = async (loc) => { await loc.scrollIntoViewIfNeeded().catch(() => {}); await u.sleep(300); await touch(d, page, loc); await u.sleep(900); }; // a person scrolls to it first
  const addBlock = async (tile, where) => {
    await page.evaluate(() => document.activeElement?.blur?.());
    await tap(page.getByRole('button', { name: 'Open blocks panel' }));
    const dlg = page.getByRole('dialog', { name: 'Blocks' }); const scope = (await dlg.isVisible().catch(() => false)) ? dlg : page;
    if (where) { const w = scope.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: where, exact: true }).first(); if (await w.isVisible().catch(() => false)) await tap(w); }
    await tap(scope.getByRole('button', { name: new RegExp(`^Add ${tile}( —|$)`) }).first());
    const three = page.locator('[role="menu"][aria-label="Choose a layout"] [aria-label="3 across, 1 down"]');
    if (await three.isVisible().catch(() => false)) await tap(three);
    else if (await page.getByRole('menuitem').count()) await tap(page.getByRole('menuitem').first());
    const shut = page.getByRole('button', { name: /^Close (blocks panel|the blocks panel)$|^Close$/ }).first(); if (await shut.isVisible().catch(() => false)) await tap(shut); // the tablet's side panel stays open
    return sel(page);
  };
  const inspector = async (tab, section) => {
    const t = page.getByRole('tab', { name: tab }).first();
    for (let i = 0; i < 4 && !(await t.isVisible().catch(() => false)); i++) { const exp = page.getByRole('button', { name: 'Expand inspector' }); if (await exp.isVisible().catch(() => false)) await tap(exp); else await u.sleep(800); }
    await tap(t);
    if (section) { const head = page.getByRole('button', { name: new RegExp(`^\\s*${section}\\s*$`) }).first(); if ((await head.getAttribute('aria-expanded')) === 'false') await tap(head); }
  };
  const close = async () => { const col = page.getByRole('button', { name: /Collapse inspector|Close inspector/ }).first(); if (await col.isVisible().catch(() => false)) await tap(col); };
  const pick = async (label, option) => { const b = page.getByRole('button', { name: label, exact: true }).first(); await b.scrollIntoViewIfNeeded(); await tap(b); await tap(page.getByRole('option', { name: option }).first()); };

  // a section: a Stack with a Heading
  await addBlock('Stack'); const heading = await addBlock('Heading', 'Inside');
  // a Grid "3 across", Column 1 Set 20rem, Column 2 Fit content — the columns a person sees (LE3-3)
  await addBlock('Grid', 'End');
  const st0 = await stored(page); let g = null; const walk = (x) => { if (x.layout === 'grid') g = g || x; (x.children || []).forEach(walk); }; st0.pages.forEach((p) => walk(p.root));
  const cells = (g?.children || []).map((c) => c.id);
  // the Grid is selected as it is added; its Column widths are under the tab this screen's Inspector has (Layout, or Design)
  const hasLayout = await page.getByRole('tab', { name: 'Layout' }).first().isVisible().catch(() => false);
  await inspector(hasLayout ? 'Layout' : 'Design');
  await pick('Column 1 width', WORDS.colChoices.set);
  const f1 = page.getByLabel('Column 1: set width').first(); await f1.fill('20rem'); await f1.blur(); await u.sleep(800);
  await pick('Column 2 width', WORDS.colChoices.fit); shot('columns'); await close();
  // the site's content width: Layout guides → Page grid → Content width → Centred (in the More sheet on a phone)
  let lg = page.getByRole('button', { name: 'Layout guides' }).first();
  if (!(await lg.isVisible().catch(() => false))) { await tap(page.getByRole('button', { name: /^More/ }).first()); lg = page.getByRole('button', { name: 'Layout guides' }).first(); }
  await tap(lg); const dlg = page.getByRole('dialog', { name: 'Page grid' });
  if (!(await dlg.isVisible().catch(() => false))) await tap(lg);
  await tap(dlg.getByRole('group', { name: WORDS.contentWidth }).getByRole('button', { name: WORDS.contentChoices.centred, exact: true })); shot('content-width');
  await page.keyboard.press('Escape'); await u.sleep(500);
  const more = page.getByRole('dialog', { name: 'More' }); if (await more.isVisible().catch(() => false)) await tap(more.getByRole('button', { name: /^Close/ }).first());
  await u.sleep(800); shot('canvas');
  // the canvas too: the heading on the one centred column of the page being edited (page px — the canvas may be zoomed)
  const cv = await page.evaluate((h) => { const z = Number(document.querySelector('[data-canvas-scale]')?.dataset.canvasScale) || 1; const root = document.querySelector('[data-box-id]'); const a = root.getBoundingClientRect(), b = document.querySelector(`[data-box-id="${h}"]`).getBoundingClientRect(); return { page: Math.round(a.width / z), at: Math.round((b.left - a.left) / z) }; }, heading);
  ok('the canvas: the heading on the centred column', Math.abs(cv.at - Math.max(0, (cv.page - LAYOUT.contentWidth.startRem * 16) / 2)) <= 2, JSON.stringify(cv));
  const st = await stored(page); let gs = null; const w2 = (x) => { if (x.id === g.id) gs = x; (x.children || []).forEach(w2); }; st.pages.forEach((p) => w2(p.root));
  ok('made in the app with touches: Column widths 20rem · fit · share, the site Content width Centred', JSON.stringify(gs?.colSizes) === JSON.stringify(['20rem', 'fit', null]) && st.pageGrid?.contentWidth === LAYOUT.contentWidth.startRem, `${JSON.stringify(gs?.colSizes)} · ${JSON.stringify(st.pageGrid)}`);
  // the app's Preview
  let fr = null;
  for (let i = 0; i < 3 && !fr; i++) { await tap(page.getByRole('button', { name: /^\s*Preview\s*$/ }).first()); await page.waitForSelector('iframe', { timeout: 8000 }).catch(() => {}); await u.sleep(2500); fr = page.frames().find((f) => f !== page.mainFrame()) || null; }
  const m = await fr.evaluate(([h, cs]) => { const r = (id) => document.querySelector(`.bx-${id}`)?.getBoundingClientRect(); return { vw: document.documentElement.clientWidth, sw: document.documentElement.scrollWidth, h: Math.round(r(h)?.left ?? -1), cells: cs.map((c) => ({ l: Math.round(r(c)?.left ?? -1), t: Math.round(r(c)?.top ?? -1), w: +(r(c)?.width ?? -1).toFixed(1) })) }; }, [heading, cells]);
  shot('preview');
  const across = m.cells.every((c) => Math.abs(c.t - m.cells[0].t) <= 2);
  const wantH = Math.max(0, (m.vw - LAYOUT.contentWidth.startRem * 16) / 2);
  ok(`the app's Preview (${m.vw}px): ${across ? 'three across, Column 1 320' : 'one column, each the full width'}; the heading on the centred column; nothing sideways`,
    m.sw <= m.vw && Math.abs(m.h - wantH) <= 1.5 && (across ? Math.abs(m.cells[0].w - 320) <= 1.5 : m.cells.every((c) => Math.abs(c.w - m.cells[0].w) <= 1.5)), JSON.stringify(m));
  ok('no console errors in the editor', !errors.length, errors.join(' | ') || 'none');
  await browser.close().catch(() => {});
  fs.writeFileSync(path.join(OUT, `emu-${which}.json`), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.pass); console.log(`SUMMARY [${which}] ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error('ERR', e.message.split('\n')[0]); shot('ERR'); process.exit(1); });
