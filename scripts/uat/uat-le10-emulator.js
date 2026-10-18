/**
 * BATCH LE-10 · THE APP half of the HEADED pass (H7 in docs/TASK_TREE.md): the site editor's WebView on the tablet (emulator-5554)
 * and the phone (emulator-5556). Built through the editor's own UI with REAL touches (adb input); read over CDP. A Stack, a Side by
 * side Inside it, a Heading Inside that; the Inspector's trail names Stack › Side by side, each a finger-sized target, and a touch on
 * "Stack" selects the Stack.
 *   node scripts/uat/uat-le10-emulator.js tablet|phone     (Metro on 8081, `next start -p 3100`, the emulator booted)
 */
const fs = require('fs'); const path = require('path');
const u = require('./adb-ui.js'); const { editorPage, touch } = require('./e5d-lib.js');
const T = require('../../config/inspector.json').trail;
const which = process.argv[2] || 'phone';
const d = process.env.SERIAL || (which === 'tablet' ? 'emulator-5554' : 'emulator-5556'); // SERIAL: an emulator booted alone takes 5554
const port = which === 'tablet' ? 9301 : 9302;
const OUT = path.join(__dirname, 'logs', 'le10'); fs.mkdirSync(OUT, { recursive: true });
const results = []; const ok = (line, pass, seen) => { results.push({ which, line, pass: !!pass, seen }); console.log(`${pass ? 'PASS' : 'FAIL'} [${which}] ${line} — ${seen}`); };
const shot = (tag) => u.shot(d, path.join(OUT, `emu-${which}-${tag}.png`));
const sel = (page) => page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);

(async () => {
  for (const p of ['8081', '3100']) u.adb(d, ['reverse', `tcp:${p}`, `tcp:${p}`]);
  u.shell(d, 'am force-stop host.exp.exponent'); await u.sleep(1500);
  u.shell(d, 'am start -a android.intent.action.VIEW -d exp://localhost:8081/--/site-editor'); await u.sleep(15000);
  if (u.find(d, 'Continue')) { u.tap(d, 'Continue'); await u.sleep(1000); }
  // LE13-18 · Expo Go now and then sends its task to the back ~4s after the link opens — open it again, once, and say so
  let { browser, page } = await editorPage(d, port, 60000).catch(async () => {
    console.log(`NOTE [${which}] the editor did not come up — opening the link again`);
    u.shell(d, 'am start -a android.intent.action.VIEW -d exp://localhost:8081/--/site-editor'); await u.sleep(15000);
    return editorPage(d, port, 90000);
  });
  await page.evaluate(() => { localStorage.removeItem('educo_box_site_v1'); location.reload(); }).catch(() => {}); // an EMPTY site, as BATCH E-5d
  await u.sleep(2000); await browser.close().catch(() => {});
  ({ browser, page } = await editorPage(d, port, 60000));
  // LE13c-6 (→ BATCH A-4) · the first run after a cold boot — measured here
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
  const nav = page.locator('aside[aria-label="Inspector"]').getByRole('navigation', { name: T.label });
  const openInspector = async () => {
    for (let i = 0; i < 4 && !(await page.locator('aside[aria-label="Inspector"]').isVisible().catch(() => false)); i++) {
      const exp = page.getByRole('button', { name: 'Expand inspector' }); if (await exp.isVisible().catch(() => false)) await tap(exp); else await u.sleep(800);
    }
  };

  const stack = await addBlock('Stack');
  const sbs = await addBlock('Side by side', 'Inside');
  const h = await addBlock('Heading', 'Inside');
  await openInspector(); await u.sleep(600); shot('trail');
  const crumbs = await nav.getByRole('button').allInnerTexts();
  const current = await page.locator('aside[aria-label="Inspector"] [aria-current="location"]').allInnerTexts();
  ok('the Heading selected: the trail reads Stack › Side by side, the Heading current', (await sel(page)) === h && JSON.stringify(crumbs) === '["Stack","Side by side"]' && current.join() === 'Heading', `selected ${(await sel(page)) === h} · crumbs ${JSON.stringify(crumbs)} · current ${JSON.stringify(current)}`);
  const hts = await nav.getByRole('button').evaluateAll((bs) => bs.map((b) => Math.round(b.getBoundingClientRect().height)));
  ok('every name in the trail is a finger-sized target (≥ 44 px)', hts.length === 2 && hts.every((x) => x >= 44), `heights ${hts.join(', ')}`);
  await tap(nav.getByRole('button', { name: 'Stack', exact: true })); shot('stack');
  const head = (await page.locator('aside[aria-label="Inspector"]').getByText(new RegExp(`^${T.lead}`)).first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
  ok('a touch on "Stack" selects the Stack; the Inspector reads "Editing: Stack"', (await sel(page)) === stack && head === `${T.lead} Stack`, `selected ${(await sel(page)) === stack} · "${head}"`);
  ok('no console errors in the editor', !errors.length, errors.join(' | ') || 'none');
  void sbs;
  await browser.close().catch(() => {});
  fs.writeFileSync(path.join(OUT, `emu-${which}.json`), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.pass); console.log(`SUMMARY [${which}] ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error('ERR', e.message.split('\n')[0]); shot('ERR'); process.exit(1); });
