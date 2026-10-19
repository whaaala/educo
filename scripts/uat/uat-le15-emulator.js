/**
 * BATCH LE-15 · THE APP half of the HEADED pass (U12 in docs/TASK_TREE.md): the site editor's WebView on the tablet (emulator-5554)
 * and the phone (emulator-5556), driven with REAL touches (adb input), read over CDP. The Sections tab in the blocks sheet: a tap adds a
 * section and the sheet closes; Save as my section (the name typed); Make global; Add a page from a template.
 *   node scripts/uat/uat-le15-emulator.js tablet|phone     (Metro on 8081, `next start -p 3100` serving .next-b, the emulator booted)
 */
const fs = require('fs'); const path = require('path');
const u = require('./adb-ui.js'); const { editorPage, touch } = require('./e5d-lib.js');
const T = require('../../config/inspector.json').sections;
const which = process.argv[2] || 'phone';
const d = process.env.SERIAL || (which === 'tablet' ? 'emulator-5554' : 'emulator-5556');
const port = which === 'tablet' ? 9301 : 9302;
const OUT = path.join(__dirname, 'logs', 'le15'); fs.mkdirSync(OUT, { recursive: true });
const results = []; const ok = (line, pass, seen) => { results.push({ which, line, pass: !!pass, seen }); console.log(`${pass ? 'PASS' : 'FAIL'} [${which}] ${line} — ${seen}`); };
const shot = (tag) => u.shot(d, path.join(OUT, `emu-${which}-${tag}.png`));
const site = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1') || 'null'));
const textOf = (n) => [n.text || '', ...(n.children || []).map(textOf)].join(' ');

(async () => {
  for (const p of ['8081', '3100']) u.adb(d, ['reverse', `tcp:${p}`, `tcp:${p}`]);
  u.shell(d, 'am force-stop host.exp.exponent'); await u.sleep(1500);
  u.shell(d, 'am start -a android.intent.action.VIEW -d exp://localhost:8081/--/site-editor'); await u.sleep(15000);
  if (u.find(d, 'Continue')) { u.tap(d, 'Continue'); await u.sleep(1000); }
  let { browser, page } = await editorPage(d, port, 60000).catch(async () => {
    console.log(`NOTE [${which}] the editor did not come up — opening the link again`);
    u.shell(d, 'am start -a android.intent.action.VIEW -d exp://localhost:8081/--/site-editor'); await u.sleep(15000);
    return editorPage(d, port, 90000);
  });
  await page.evaluate(() => { localStorage.removeItem('educo_box_site_v1'); localStorage.removeItem('educo:my-sections'); location.reload(); }).catch(() => {});
  await u.sleep(2000); await browser.close().catch(() => {});
  ({ browser, page } = await editorPage(d, port, 60000));
  await page.waitForFunction(() => !!document.querySelector('[aria-label="Open blocks panel"]'), null, { timeout: 90000 });
  const errors = []; page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
  const tap = async (loc) => { await loc.scrollIntoViewIfNeeded().catch(() => {}); await u.sleep(300); await touch(d, page, loc); await u.sleep(900); };
  const typeIn = async (loc, words) => { await tap(loc); await loc.fill(words); await u.sleep(400); };

  // the Sections tab in the sheet: a tap adds the section, and the sheet gets out of the way
  await tap(page.getByRole('button', { name: 'Open blocks panel' }));
  await tap(page.getByRole('tab', { name: T.tab, exact: true }));
  await page.getByRole('tablist', { name: T.categories }).waitFor({ timeout: 30000 });
  await tap(page.getByRole('tablist', { name: T.categories }).getByRole('tab', { name: /^Hero/ }));
  await u.sleep(2500); shot('sections');
  const tiles = await page.locator('button[aria-label^="Add "] iframe').count();
  ok('the Sections tab opens in the sheet with live tiles', tiles >= 10, `${tiles} tiles`);
  // a SHEET (phone, tablet upright) closes after an add; a DOCKED panel (tablet sideways, as on a computer) stays — by design
  const isSheet = await page.getByRole('dialog', { name: 'Blocks' }).evaluate((e) => getComputedStyle(e).position === 'fixed').catch(() => false);
  await tap(page.getByRole('button', { name: /^Add Centred words, one button,/ }).first());
  const s1 = await site(page); const added = s1 && s1.pages[0].root.children.some((b) => /Where curious minds grow/.test(textOf(b)));
  const panelShown = await page.getByRole('tablist', { name: T.categories }).isVisible().catch(() => false);
  const seen = await page.evaluate(() => { const h = Array.from(document.querySelectorAll('h1,h2')).find((x) => /Where curious minds grow/.test(x.textContent || '')); if (!h) return false; const r = h.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth; });
  ok(isSheet ? 'a tap adds the section, and the sheet closes so it can be seen' : 'a tap adds the section; the docked panel stays and the section is in view',
    added && (isSheet ? !panelShown : seen), `added ${added} · ${isSheet ? `sheet closed ${!panelShown}` : `docked, the section in view ${seen}`}`);
  shot('added');

  // Save as my section and Make global, from the Inspector, by touch
  const hero = s1.pages[0].root.children.map((b) => (b.children && b.children.length === 1 ? b.children[0] : b)).find((b) => /Where curious minds grow/.test(textOf(b)));
  // a section just added is already selected; otherwise touch the VISIBLE block (the phone canvas keeps a hidden copy to measure)
  const selNow = await page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);
  if (selNow !== hero.id) { await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`)?.scrollIntoView({ block: 'center' }), hero.id); await tap(page.locator(`[data-box-id="${hero.id}"]:visible`).first()); }
  const openIns = async () => { for (let i = 0; i < 4 && !(await page.locator('aside[aria-label="Inspector"]').isVisible().catch(() => false)); i++) { const e = page.getByRole('button', { name: 'Expand inspector' }); if (await e.isVisible().catch(() => false)) await tap(e); else await u.sleep(800); } };
  await openIns();
  await tap(page.locator('aside[aria-label="Inspector"]').getByRole('button', { name: T.save, exact: true }));
  await typeIn(page.getByRole('dialog', { name: T.saveTitle }).getByRole('textbox'), 'Our welcome');
  await tap(page.getByRole('dialog', { name: T.saveTitle }).getByRole('button', { name: T.saveConfirm, exact: true }));
  const mine = await page.evaluate(() => JSON.parse(localStorage.getItem('educo:my-sections') || '[]').map((s) => s.name));
  ok('Save as my section by touch: named, kept', mine.includes('Our welcome'), JSON.stringify(mine));
  await openIns();
  await tap(page.locator('aside[aria-label="Inspector"]').getByRole('button', { name: T.makeGlobal, exact: true }));
  await typeIn(page.getByRole('dialog', { name: T.makeGlobalTitle }).getByRole('textbox'), 'Welcome banner');
  await tap(page.getByRole('dialog', { name: T.makeGlobalTitle }).getByRole('button', { name: T.makeGlobal, exact: true }));
  await u.sleep(800); shot('global');
  const mark = await page.locator(`[data-box-id="${hero.id}"]:visible`).first().getAttribute('data-global');
  ok('Make global by touch: marked on the canvas', mark === 'Global · Welcome banner', mark || 'no mark');

  // Add a page from a template
  await page.evaluate(() => document.activeElement?.blur?.());
  const add = page.getByRole('button', { name: 'Add page', exact: true }).first();
  if (await add.isVisible().catch(() => false)) await tap(add); else { await tap(page.getByRole('button', { name: /More|Pages/ }).first()); await tap(page.getByRole('button', { name: 'Add page', exact: true }).first()); }
  await u.sleep(1200); shot('add-page-tap');
  const addBox = await add.boundingBox().catch(() => null); const vw = await page.evaluate(() => innerWidth);
  console.log(`NOTE [${which}] Add page at ${JSON.stringify(addBox)} in a ${vw}px editor`);
  const dlg = page.getByRole('dialog', { name: T.addPageTitle }); await dlg.waitFor({ timeout: 20000 }); await u.sleep(3000); shot('add-page');
  await typeIn(dlg.getByRole('textbox'), 'Welcome');
  await tap(dlg.getByRole('button', { name: /^Add School home,/ }));
  const s2 = await site(page); const pg = s2.pages.find((p) => p.name === 'Welcome');
  ok('Add a page from a template by touch: the page, with its sections', !!pg && pg.root.children.length >= 5, pg ? `${pg.root.children.length} bands` : 'no page');
  shot('template-page');
  ok('no console errors in the editor', !errors.length, errors.join(' | ') || 'none');
  await browser.close().catch(() => {});
  fs.writeFileSync(path.join(OUT, `emu-${which}.json`), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.pass); console.log(`SUMMARY [${which}] ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error(`ERROR [${which}] ${e.message.split('\n')[0]}`); process.exit(1); });
