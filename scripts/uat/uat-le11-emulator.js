/**
 * BATCH LE-11 · THE APP half of the HEADED pass (U7's app line in docs/TASK_TREE.md): the site editor's WebView on the phone
 * (emulator-5556) and the tablet (emulator-5554). Built through the editor's own UI with REAL touches (adb input); read over CDP.
 * A held Page header set to "Slides away", three full-screen sections; in the app's Preview a FINGER swipe up the page takes the
 * header away, a swipe down brings it back.
 *   node scripts/uat/uat-le11-emulator.js phone|tablet     (Metro on 8081, `next start -p 3100`, the emulator booted)
 */
const fs = require('fs'); const path = require('path');
const u = require('./adb-ui.js'); const { editorPage, touch, webviewBox } = require('./e5d-lib.js');
const which = process.argv[2] || 'phone';
const d = which === 'tablet' ? 'emulator-5554' : 'emulator-5556'; const port = which === 'tablet' ? 9301 : 9302;
const OUT = path.join(__dirname, 'logs', 'le11'); fs.mkdirSync(OUT, { recursive: true });
const results = []; const ok = (line, pass, seen) => { results.push({ which, line, pass: !!pass, seen }); console.log(`${pass ? 'PASS' : 'FAIL'} [${which}] ${line} — ${seen}`); };
const shot = (tag) => u.shot(d, path.join(OUT, `emu-${which}-${tag}.png`));
const sel = (page) => page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);

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
  const tap = async (loc) => { await touch(d, page, loc); await u.sleep(900); };
  const addBlock = async (tile, where) => {
    await page.evaluate(() => document.activeElement?.blur?.());
    await tap(page.getByRole('button', { name: 'Open blocks panel' }));
    const dlg = page.getByRole('dialog', { name: 'Blocks' }); const scope = (await dlg.isVisible().catch(() => false)) ? dlg : page;
    if (where) { const w = scope.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: where, exact: true }).first(); if (await w.isVisible().catch(() => false)) await tap(w); }
    await tap(scope.getByRole('button', { name: new RegExp(`^Add ${tile}( —|$)`) }).first());
    if (await page.getByRole('menuitem').count()) await tap(page.getByRole('menuitem').first());
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
  // the header: a Stack, made the Page header, held at the top, sliding away
  const hdr = await addBlock('Stack');
  await inspector('Design', 'Meaning'); await tap(page.getByRole('button', { name: /^What is this block/ }).first()); await tap(page.getByRole('option', { name: /^\s*Page header/ }).first());
  await inspector('Design', 'Placement'); await tap(page.getByRole('radio', { name: /Sticks when reached/ }).or(page.getByRole('button', { name: /Sticks when reached/ })).first());
  await tap(page.getByRole('group', { name: 'When you scroll down' }).getByRole('button', { name: 'Slides away', exact: true }));
  await close(); await addBlock('Text', 'Inside');
  for (let i = 0; i < 3; i++) {
    const s = await addBlock('Stack', 'End');
    await inspector('Design'); await tap(page.getByRole('group', { name: 'Screen height' }).getByRole('button', { name: 'Full screen' }).first()); await close();
    void s;
  }
  const stored = await page.evaluate((id) => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1') || 'null'); let n = null; const w = (x) => { if (x.id === id) n = x; (x.children || []).forEach(w); }; s.pages.forEach((p) => w(p.root)); return n && { tag: n.tag, pin: n.pin ?? Object.values(n.responsive || {}).map((r) => r.pin).find(Boolean), pinAway: n.pinAway }; }, hdr); // a pin set on a phone is the phone's (per screen)
  ok('the header made in the app: Page header, held at the top, "Slides away"', stored?.tag === 'header' && stored?.pin === 'top' && stored?.pinAway === 'slide', JSON.stringify(stored));
  shot('editor');
  // the Preview: a finger swipes up the page, then down
  let fr = null;
  for (let i = 0; i < 3 && !fr; i++) { await tap(page.getByRole('button', { name: /^\s*Preview\s*$/ }).first()); await page.waitForSelector('iframe', { timeout: 8000 }).catch(() => {}); await u.sleep(2500); fr = page.frames().find((f) => f !== page.mainFrame()) || null; }
  const wv = webviewBox(d); const cx = wv.left + (wv.w >> 1), y1 = wv.top + Math.round(wv.h * 0.8), y2 = wv.top + Math.round(wv.h * 0.3);
  const state = () => fr.evaluate(() => { const e = document.querySelector('[data-eu-away]'); return e ? { gone: e.hasAttribute('data-eu-gone'), bottom: Math.round(e.getBoundingClientRect().bottom), y: Math.round(scrollY) } : null; });
  u.shell(d, `input swipe ${cx} ${y1} ${cx} ${y2} 400`); await u.sleep(1500); const down = await state(); shot('preview-gone');
  u.shell(d, `input swipe ${cx} ${y2} ${cx} ${y1 - Math.round(wv.h * 0.25)} 400`); await u.sleep(1500); const up = await state(); shot('preview-back');
  ok('the app\'s Preview: a finger swipe up the page takes the header away; a swipe down brings it back', !!down && down.gone && down.bottom <= 0 && !!up && !up.gone, JSON.stringify({ down, up }));
  ok('no console errors in the editor', !errors.length, errors.join(' | ') || 'none');
  await browser.close().catch(() => {});
  fs.writeFileSync(path.join(OUT, `emu-${which}.json`), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.pass); console.log(`SUMMARY [${which}] ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error('ERR', e.message.split('\n')[0]); shot('ERR'); process.exit(1); });
