/**
 * BATCH LE-15l · THE APP half of the HEADED pass (checklist L7): a template is only a start, by a FINGER, in the site editor's
 * WebView on the tablet and the phone — REAL touches (adb input), read over CDP. The School home page added by taps; the
 * "Hello, and welcome" section moved down by its bar's arrow; the hero's "Open day…" words made a Quote under Meaning; the
 * quick-link grid selected draws the page grid (the user's decision 2026-10-20). Made from uat-le15k-emulator.js.
 *   node scripts/uat/uat-le15l-emulator.js tablet|phone     (Metro on 8081, `next start -p 3100` serving .next-b, the emulator booted)
 */
const fs = require('fs'); const path = require('path');
const u = require('./adb-ui.js'); const { editorPage, touch } = require('./e5d-lib.js');
const W = require('../../config/inspector.json'); const T = W.sections, M = W.meaning;
const which = process.argv[2] || 'phone';
const d = process.env.SERIAL || (which === 'tablet' ? 'emulator-5554' : 'emulator-5556');
const port = which === 'tablet' ? 9301 : 9302;
const OUT = path.join(__dirname, 'logs', 'le15l'); fs.mkdirSync(OUT, { recursive: true });
const results = []; const ok = (line, pass, seen) => { results.push({ which, line, pass: !!pass, seen }); console.log(`${pass ? 'PASS' : 'FAIL'} [${which}] ${line} — ${seen}`); };
const shot = (tag) => u.shot(d, path.join(OUT, `emu-${which}-${tag}.png`));

(async () => {
  for (const p of ['8081', '3100']) u.adb(d, ['reverse', `tcp:${p}`, `tcp:${p}`]);
  console.log(`DEVICE [${which}] ${d}: ${String(u.shell(d, 'wm size')).trim()}`); // the serials can swap — say which it really is
  u.shell(d, 'am force-stop host.exp.exponent'); await u.sleep(1500);
  u.shell(d, 'am start -a android.intent.action.VIEW -d exp://localhost:8081/--/site-editor'); await u.sleep(15000);
  if (u.find(d, 'Continue')) { u.tap(d, 'Continue'); await u.sleep(1000); }
  let { browser, page } = await editorPage(d, port, 60000).catch(async () => {
    u.shell(d, 'am start -a android.intent.action.VIEW -d exp://localhost:8081/--/site-editor'); await u.sleep(15000);
    return editorPage(d, port, 90000);
  });
  await page.evaluate(() => { localStorage.removeItem('educo_box_site_v1'); location.reload(); }).catch(() => {});
  await u.sleep(2000); await browser.close().catch(() => {});
  ({ browser, page } = await editorPage(d, port, 60000));
  await page.waitForFunction(() => !!document.querySelector('[aria-label="Open blocks panel"]'), null, { timeout: 90000 });
  const errors = []; page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
  const tap = async (loc) => { await loc.evaluate((e) => e.scrollIntoView({ block: 'center' })).catch(() => {}); await u.sleep(400); await touch(d, page, loc); await u.sleep(900); };
  const selectedTag = () => page.evaluate(() => { const id = document.querySelector('[data-chrome-mirror]')?.getAttribute('data-chrome-mirror'); const e = id && document.querySelector(`[data-box-id="${CSS.escape(id)}"]`); return e ? { id, tag: e.tagName, text: (e.textContent || '').trim().slice(0, 30), grid: getComputedStyle(e).display === 'grid' } : null; });
  const keyboardAway = () => u.shell(d, 'input keyevent 111');

  // the School home page, by taps (Add page is in More on a phone or tablet)
  const add = page.getByRole('button', { name: 'Add page', exact: true }).first();
  if (!(await add.isVisible().catch(() => false))) await tap(page.getByRole('button', { name: 'More', exact: true }).first());
  await tap(page.getByRole('button', { name: 'Add page', exact: true }).first());
  const dlg = page.getByRole('dialog', { name: T.addPageTitle }); await dlg.waitFor({ timeout: 30000 }); await u.sleep(2500);
  await tap(dlg.getByRole('button', { name: /^Add School home,/ }));
  await page.getByText(/Open day on Saturday/).first().waitFor({ timeout: 30000 }); await u.sleep(1500);

  // 1 · the "Hello, and welcome" section moved down by its bar's arrow
  const order = () => page.evaluate(() => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); return s.pages[s.pages.length - 1].root.children.map((c) => c.id).join(' '); });
  for (let i = 0; i < 3 && (await selectedTag())?.tag !== 'SECTION'; i++) { await tap(page.getByText(/Hello, and/).first()); keyboardAway(); await u.sleep(500); }
  const sec = await selectedTag(); const o0 = await order();
  const down = page.getByRole('toolbar', { name: 'Block toolbar' }).getByRole('button', { name: 'Move down' });
  if (await down.isVisible().catch(() => false)) await tap(down);
  await u.sleep(1200); const o1 = await order(); shot('section-moved');
  ok('a finger on the bar\'s "Move down" moves the section down', sec?.tag === 'SECTION' && o0 !== o1, `selected ${sec?.tag} "${sec?.text}" · page order ${o0 === o1 ? 'UNCHANGED' : 'changed'}`);

  // 2 · the hero's "Open day…" words made a Quote under Meaning
  const words = page.getByText(/Open day on Saturday/).first();
  for (let i = 0; i < 5 && !/^Open day/.test((await selectedTag())?.text || '') ; i++) { await tap(words); keyboardAway(); await u.sleep(500); }
  const openIns = async () => { for (let i = 0; i < 4 && !(await page.locator('aside[aria-label="Inspector"]').isVisible().catch(() => false)); i++) { const e = page.getByRole('button', { name: 'Expand inspector' }); if (await e.isVisible().catch(() => false)) await tap(e); else await u.sleep(800); } };
  await openIns();
  const meaning = page.locator('aside[aria-label="Inspector"]').getByRole('button', { name: /^Meaning/ }).first();
  if ((await meaning.getAttribute('aria-expanded').catch(() => 'true')) !== 'true') await tap(meaning);
  const what = page.locator('aside[aria-label="Inspector"]').getByLabel('What is this block').first();
  if ((await what.evaluate((e) => e.tagName).catch(() => '')) === 'SELECT') await what.selectOption(M.text[1].value).catch(() => {});
  else { await tap(what); await tap(page.getByRole('option', { name: M.text[1].label }).first()); }
  await u.sleep(1200); shot('quote');
  const quoted = await page.evaluate(() => !!Array.from(document.querySelectorAll('blockquote')).find((e) => /Open day/.test(e.textContent || '')));
  ok('a finger chooses "Quote" under Meaning: the words are a <blockquote>', quoted, `blockquote ${quoted}`);
  const close = page.getByRole('button', { name: 'Collapse inspector' }); if (await close.isVisible().catch(() => false)) await tap(close);

  // 3 · the quick-link grid selected draws the page grid
  const card = page.getByText('Term dates').first();
  for (let i = 0; i < 5 && !(await selectedTag())?.grid; i++) { await tap(card); keyboardAway(); await u.sleep(500); }
  const g = await selectedTag(); const guides = await page.locator('[data-layout-guides]').count(); shot('grid-guides');
  ok('a grid selected by a finger draws the page grid', !!g?.grid && guides > 0, `selected a ${g?.grid ? 'grid' : g?.tag} · guides ${guides}`);

  ok('no console errors in the editor', !errors.length, errors.join(' | ') || 'none');
  await browser.close().catch(() => {});
  fs.writeFileSync(path.join(OUT, `emu-${which}.json`), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.pass); console.log(`SUMMARY [${which}] ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error(`ERROR [${which}] ${e.message.split('\n')[0]}`); process.exit(1); });
