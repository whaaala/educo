/**
 * BATCH LE-15h · THE APP half of the HEADED pass (H8): the site editor's WebView on the tablet and the phone, REAL touches (adb
 * input), read over CDP. The hero "Words beside a picture" added by a tap; its picture stored with the cap of
 * config/sections/hero.json; then the Preview, measured on the device: the picture no taller than the cap of the window, its
 * own 4:3 where the cap does not bite, nothing sideways.
 *   node scripts/uat/uat-le15h-emulator.js tablet|phone     (Metro on 8081, `next start -p 3100` serving .next-b, the emulator booted)
 */
const fs = require('fs'); const path = require('path');
const u = require('./adb-ui.js'); const { editorPage, touch } = require('./e5d-lib.js');
const T = require('../../config/inspector.json').sections;
const HERO = require('../../config/sections/hero.json');
const CAP = HERO.photoMaxHeight; const SHARE = parseFloat(CAP) / 100;
const which = process.argv[2] || 'phone';
const d = process.env.SERIAL || (which === 'tablet' ? 'emulator-5554' : 'emulator-5556');
const port = which === 'tablet' ? 9301 : 9302;
const OUT = path.join(__dirname, 'logs', 'le15h'); fs.mkdirSync(OUT, { recursive: true });
const results = []; const ok = (line, pass, seen) => { results.push({ which, line, pass: !!pass, seen }); console.log(`${pass ? 'PASS' : 'FAIL'} [${which}] ${line} — ${seen}`); };
const shot = (tag) => u.shot(d, path.join(OUT, `emu-${which}-${tag}.png`));
const site = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1') || 'null'));
const NAME = 'Words beside a picture'; const ALT = 'Pupils reading together in the library';

(async () => {
  for (const p of ['8081', '3100']) u.adb(d, ['reverse', `tcp:${p}`, `tcp:${p}`]);
  // LE15b-19: the serials can swap when the emulators start again — say which device this really is, from its screen
  console.log(`DEVICE [${which}] ${d}: ${String(u.shell(d, 'wm size')).trim()}`);
  u.shell(d, 'am force-stop host.exp.exponent'); await u.sleep(1500);
  u.shell(d, 'am start -a android.intent.action.VIEW -d exp://localhost:8081/--/site-editor'); await u.sleep(15000);
  if (u.find(d, 'Continue')) { u.tap(d, 'Continue'); await u.sleep(1000); }
  let { browser, page } = await editorPage(d, port, 60000).catch(async () => {
    console.log(`NOTE [${which}] the editor did not come up — opening the link again`);
    u.shell(d, 'am start -a android.intent.action.VIEW -d exp://localhost:8081/--/site-editor'); await u.sleep(15000);
    return editorPage(d, port, 90000);
  });
  await page.evaluate(() => { localStorage.removeItem('educo_box_site_v1'); location.reload(); }).catch(() => {});
  await u.sleep(2000); await browser.close().catch(() => {});
  ({ browser, page } = await editorPage(d, port, 60000));
  await page.waitForFunction(() => !!document.querySelector('[aria-label="Open blocks panel"]'), null, { timeout: 90000 });
  const errors = []; page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
  const tap = async (loc) => { await loc.scrollIntoViewIfNeeded().catch(() => {}); await u.sleep(300); await touch(d, page, loc); await u.sleep(900); };
  await tap(page.getByRole('button', { name: 'Open blocks panel' }));
  await tap(page.getByRole('tab', { name: T.tab, exact: true }));
  await page.getByRole('tablist', { name: T.categories }).waitFor({ timeout: 30000 });
  await tap(page.getByRole('tablist', { name: T.categories }).getByRole('tab', { name: /^Hero/ })); await u.sleep(2500);
  await tap(page.getByRole('button', { name: new RegExp(`^Add ${NAME},`) }).first());
  const c = page.getByRole('button', { name: 'Close blocks panel' }); if (await c.isVisible().catch(() => false)) await tap(c);
  const s = await site(page); let pic = null; const w = (x) => { if (x.type === 'image' && x.alt === ALT) pic = x; (x.children || []).forEach(w); }; w(s.pages[0].root);
  ok(`"${NAME}" added by a tap, its picture stored with Max height ${CAP}`, pic?.maxHeight === CAP, String(pic?.maxHeight));
  shot('canvas');
  await page.evaluate(() => document.activeElement?.blur?.());
  await tap(page.getByRole('button', { name: 'Preview', exact: true }).first()); await u.sleep(3000);
  const f = await (await page.$('iframe')).contentFrame();
  const m = await f.evaluate((alt) => {
    const i = Array.from(document.querySelectorAll('img')).find((x) => x.alt === alt); const r = i?.getBoundingClientRect();
    return { mw: innerWidth, ih: innerHeight, over: document.documentElement.scrollWidth - document.documentElement.clientWidth, w: r?.width ?? 0, h: r?.height ?? 0, fit: i ? getComputedStyle(i).objectFit : 'NONE' };
  }, ALT);
  const capped = m.h >= SHARE * m.ih - 1.5;
  ok(`the Preview: the picture no taller than ${CAP} of the window, cropped`, m.h > 0 && m.h <= SHARE * m.ih + 1.5 && m.fit === 'cover', `${Math.round(m.w)}×${Math.round(m.h)} in ${m.mw}×${m.ih} (cap ${Math.round(SHARE * m.ih)})`);
  ok('…its own 4:3 where the cap does not bite', capped || Math.abs(m.w / m.h - 4 / 3) < 0.02, capped ? 'capped' : (m.w / m.h).toFixed(3));
  ok('the Preview does not scroll sideways', m.over <= 1, `${m.over}px at ${m.mw}`);
  shot('preview');
  ok('no console errors in the editor', !errors.length, errors.join(' | ') || 'none');
  await browser.close().catch(() => {});
  fs.writeFileSync(path.join(OUT, `emu-${which}.json`), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.pass); console.log(`SUMMARY [${which}] ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error(`ERROR [${which}] ${e.message.split('\n')[0]}`); process.exit(1); });
