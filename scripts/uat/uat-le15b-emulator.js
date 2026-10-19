/**
 * BATCH LE-15b · THE APP half of the HEADED pass: the site editor's WebView on the tablet (emulator-5554) and the phone
 * (emulator-5556), REAL touches (adb input), read over CDP. For each of the six new categories: its chip tapped, its tiles drawn
 * (the count the config promises), one layout added by a tap. Then the Preview, measured on the device: a zig-zag's picture
 * before its words on the phone, four numbers two by two, nothing sideways.
 *   node scripts/uat/uat-le15b-emulator.js tablet|phone     (Metro on 8081, `next start -p 3100` serving .next-b, the emulator booted)
 */
const fs = require('fs'); const path = require('path');
const u = require('./adb-ui.js'); const { editorPage, touch } = require('./e5d-lib.js');
const T = require('../../config/inspector.json').sections;
const RUNGS = require('../../config/layout.json').rungs; const TP = RUNGS.tabletPortrait.from, TL = RUNGS.tabletLandscape.from; // RULE CFG
const CATS = require('../../config/sections.json').categories.filter((c) => c.batch === 'LE-15b');
// one layout per category, the ones whose reflow is measured below
const PICK = { about: 'about-founders', text: 'text-intro-list', features: 'feat-icon-row', spotlight: 'spot-zigzag-three', stats: 'stats-four', cta: 'cta-words-button' };
const which = process.argv[2] || 'phone';
const d = process.env.SERIAL || (which === 'tablet' ? 'emulator-5554' : 'emulator-5556');
const port = which === 'tablet' ? 9301 : 9302;
const OUT = path.join(__dirname, 'logs', 'le15b'); fs.mkdirSync(OUT, { recursive: true });
const results = []; const ok = (line, pass, seen) => { results.push({ which, line, pass: !!pass, seen }); console.log(`${pass ? 'PASS' : 'FAIL'} [${which}] ${line} — ${seen}`); };
const shot = (tag) => u.shot(d, path.join(OUT, `emu-${which}-${tag}.png`));
const site = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1') || 'null'));
const re = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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
  const closePanel = async () => { const c = page.getByRole('button', { name: 'Close blocks panel' }); if (await c.isVisible().catch(() => false)) await tap(c); };
  for (const cat of CATS) {
    const def = require(`../../config/sections/${cat.id}.json`).sections.find((s) => s.id === PICK[cat.id]);
    await tap(page.getByRole('button', { name: 'Open blocks panel' }));
    await tap(page.getByRole('tab', { name: T.tab, exact: true }));
    await page.getByRole('tablist', { name: T.categories }).waitFor({ timeout: 30000 });
    await tap(page.getByRole('tablist', { name: T.categories }).getByRole('tab', { name: new RegExp(`^${re(cat.label)}`) }));
    await u.sleep(2500);
    const n = await page.locator('button[aria-label^="Add "] iframe').count();
    ok(`${cat.label}: the chip tapped shows its ${cat.count} tiles`, n === cat.count, `${n} tiles`);
    if (cat.id === 'spotlight') shot('spotlight-tiles');
    await tap(page.getByRole('button', { name: new RegExp(`^Add ${re(def.name)},`) }).first());
    await closePanel();
    const s = await site(page); const ids = []; const w = (x) => { if (x.sectionFrom) ids.push(x.sectionFrom); (x.children || []).forEach(w); }; w(s.pages[0].root);
    ok(`${cat.label}: "${def.name}" added by a tap`, ids.includes(def.id), ids.join(', '));
  }
  shot('canvas');
  // the Preview, on this device
  await page.evaluate(() => document.activeElement?.blur?.());
  await tap(page.getByRole('button', { name: 'Preview', exact: true }).first()); await u.sleep(3000);
  const f = await (await page.$('iframe')).contentFrame();
  const m = await f.evaluate((tp) => {
    const mw = window.innerWidth; const over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const pic = Array.from(document.querySelectorAll('img')).find((i) => /Nursery children at play/.test(i.alt)); const words = Array.from(document.querySelectorAll('h2,h3')).find((h) => /Learning through play/.test(h.textContent));
    const first = pic && words ? (mw < tp ? pic.getBoundingClientRect().top < words.getBoundingClientRect().top : pic.getBoundingClientRect().left > words.getBoundingClientRect().left) : null;
    const stats = Array.from(document.querySelectorAll('p')).filter((p) => /^(820|18|94%|39)$/.test(p.textContent.trim())).map((p) => Math.round(p.getBoundingClientRect().top));
    return { mw, over, first, rows: new Set(stats).size, found: stats.length };
  }, TP);
  ok('the Preview does not scroll sideways', m.over <= 1, `${m.over}px at ${m.mw}`);
  ok(m.mw < TP ? 'a zig-zag shows its picture first on the phone' : 'a zig-zag keeps its picture beside its words', m.first === true, `${m.first} at ${m.mw}`);
  // LE15b-19: B16 — two by two below the tablet held sideways, one row from there up (the measurement decides, not the serial)
  ok(m.mw < TL ? 'four numbers two by two' : 'four numbers in one row', m.found === 4 && m.rows === (m.mw < TL ? 2 : 1), `${m.found} numbers in ${m.rows} rows at ${m.mw}`);
  shot('preview');
  ok('no console errors in the editor', !errors.length, errors.join(' | ') || 'none');
  await browser.close().catch(() => {});
  fs.writeFileSync(path.join(OUT, `emu-${which}.json`), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.pass); console.log(`SUMMARY [${which}] ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error(`ERROR [${which}] ${e.message.split('\n')[0]}`); process.exit(1); });
