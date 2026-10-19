/**
 * BATCH LE-15f · THE APP half of the HEADED pass (F12 in docs/TASK_TREE.md): the site editor's WebView on the tablet (emulator-5554)
 * and the phone (emulator-5556), REAL touches (adb input), read over CDP: a ready-made hero added by a tap, its Finish tapped in the
 * Inspector, "Bold" tapped — the section takes Bold and keeps its words; Ctrl+Z has no key here, so Undo is tapped.
 *   node scripts/uat/uat-le15f-emulator.js tablet|phone     (Metro on 8081, `next start -p 3100` serving .next-b, the emulator booted)
 */
const fs = require('fs'); const path = require('path');
const u = require('./adb-ui.js'); const { editorPage, touch } = require('./e5d-lib.js');
const T = require('../../config/inspector.json').sections;
const which = process.argv[2] || 'phone';
const d = process.env.SERIAL || (which === 'tablet' ? 'emulator-5554' : 'emulator-5556');
const port = which === 'tablet' ? 9301 : 9302;
const OUT = path.join(__dirname, 'logs', 'le15f'); fs.mkdirSync(OUT, { recursive: true });
const results = []; const ok = (line, pass, seen) => { results.push({ which, line, pass: !!pass, seen }); console.log(`${pass ? 'PASS' : 'FAIL'} [${which}] ${line} — ${seen}`); };
const shot = (tag) => u.shot(d, path.join(OUT, `emu-${which}-${tag}.png`));
const site = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1') || 'null'));

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
  const FIN = require('../../config/section-finishes.json');
  await tap(page.getByRole('button', { name: 'Open blocks panel' }));
  await tap(page.getByRole('tab', { name: T.tab, exact: true }));
  await page.getByRole('tablist', { name: T.categories }).waitFor({ timeout: 30000 });
  await tap(page.getByRole('tablist', { name: T.categories }).getByRole('tab', { name: /^Hero/ }));
  await u.sleep(2000);
  await tap(page.getByRole('button', { name: /^Add Centred words, one button,/ }).first());
  const close = page.getByRole('button', { name: 'Close blocks panel' }); if (await close.isVisible().catch(() => false)) await tap(close);
  const sec = () => site(page).then((s) => { let hit = null; const w = (n) => { if (!hit && n.sectionFrom) hit = n; (n.children || []).forEach(w); }; w(s.pages[0].root); return hit; });
  const before = await sec();
  const selNow = await page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);
  if (selNow !== before.id) { await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`)?.scrollIntoView({ block: 'center' }), before.id); await tap(page.locator(`[data-box-id="${before.id}"]:visible`).first()); }
  const openIns = async () => { for (let i = 0; i < 4 && !(await page.locator('aside[aria-label="Inspector"]').isVisible().catch(() => false)); i++) { const e = page.getByRole('button', { name: 'Expand inspector' }); if (await e.isVisible().catch(() => false)) await tap(e); else await u.sleep(800); } };
  await openIns();
  const fin = page.locator('aside[aria-label="Inspector"]').getByRole('button', { name: T.finishOnPage });
  ok('the Inspector shows the Finish of the section', await fin.isVisible().catch(() => false) || (await fin.count()) > 0, (await fin.innerText().catch(() => 'NONE')).trim());
  await tap(fin); await tap(page.getByRole('option', { name: 'Bold', exact: true }));
  await u.sleep(1200); shot('bold');
  const after = await sec(); const h = (n) => (n.type === 'heading' ? n : (n.children || []).map(h).find(Boolean));
  ok('a finish chosen by touch: the section is Bold, its words kept', after.sectionFinish === 'bold' && h(after).fontSize === FIN.bold.roles.title.size && h(after).text === h(before).text, `${after.sectionFinish} · ${h(after).fontSize}px · "${h(after).text}"`);
  await page.evaluate(() => document.activeElement?.blur?.());
  await tap(page.getByRole('button', { name: /^Undo/ }).first()); await u.sleep(1000);
  ok('Undo by touch puts the old finish back', (await sec()).sectionFinish === before.sectionFinish, (await sec()).sectionFinish);
  ok('no console errors in the editor', !errors.length, errors.join(' | ') || 'none');
  await browser.close().catch(() => {});
  fs.writeFileSync(path.join(OUT, `emu-${which}.json`), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.pass); console.log(`SUMMARY [${which}] ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error(`ERROR [${which}] ${e.message.split('\n')[0]}`); process.exit(1); });
