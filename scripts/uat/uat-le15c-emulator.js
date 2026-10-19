/**
 * BATCH LE-15c · THE APP half of the HEADED pass: the site editor's WebView on the tablet and the phone, REAL touches (adb
 * input), read over CDP. For each of the six new categories: its chip tapped, its tiles drawn (the count the config promises),
 * one layout added by a tap. Then the Preview, measured on the device: nothing sideways, no card alone on a line, the gallery's
 * big picture first on a phone and spanning on a tablet held sideways, a slideshow one slide wide and swiped.
 *   node scripts/uat/uat-le15c-emulator.js tablet|phone     (Metro on 8081, `next start -p 3100` serving .next-b, the emulator booted)
 */
const fs = require('fs'); const path = require('path');
const u = require('./adb-ui.js'); const { editorPage, touch, webviewBox } = require('./e5d-lib.js');
const T = require('../../config/inspector.json').sections;
const RUNGS = require('../../config/layout.json').rungs; const TP = RUNGS.tabletPortrait.from; // RULE CFG
const CATS = require('../../config/sections.json').categories.filter((c) => c.batch === 'LE-15c');
// one layout per category: the gallery's spanning one and a slideshow are the ones measured below; the rest their first
const PICK = { gallery: 'gal-big-beside-four' };
const which = process.argv[2] || 'phone';
const d = process.env.SERIAL || (which === 'tablet' ? 'emulator-5554' : 'emulator-5556');
const port = which === 'tablet' ? 9301 : 9302;
const OUT = path.join(__dirname, 'logs', 'le15c'); fs.mkdirSync(OUT, { recursive: true });
const results = []; const ok = (line, pass, seen) => { results.push({ which, line, pass: !!pass, seen }); console.log(`${pass ? 'PASS' : 'FAIL'} [${which}] ${line} — ${seen}`); };
const shot = (tag) => u.shot(d, path.join(OUT, `emu-${which}-${tag}.png`));
const site = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1') || 'null'));
const re = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const walk = (n, f) => { f(n); (n.children || []).forEach((c) => walk(c, f)); };

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
    const defs = require(`../../config/sections/${cat.id}.json`).sections; const def = defs.find((s) => s.id === PICK[cat.id]) || defs[0];
    await tap(page.getByRole('button', { name: 'Open blocks panel' }));
    await tap(page.getByRole('tab', { name: T.tab, exact: true }));
    await page.getByRole('tablist', { name: T.categories }).waitFor({ timeout: 30000 });
    await tap(page.getByRole('tablist', { name: T.categories }).getByRole('tab', { name: new RegExp(`^${re(cat.label)}`) }));
    await u.sleep(2500);
    const n = await page.locator('button[aria-label^="Add "] iframe').count();
    ok(`${cat.label}: the chip tapped shows its ${cat.count} tiles`, n === cat.count, `${n} tiles`);
    if (cat.id === 'gallery') shot('gallery-tiles');
    await tap(page.getByRole('button', { name: new RegExp(`^Add ${re(def.name)},`) }).first());
    await closePanel();
    const s = await site(page); const ids = []; walk(s.pages[0].root, (x) => { if (x.sectionFrom) ids.push(x.sectionFrom); });
    ok(`${cat.label}: "${def.name}" added by a tap`, ids.includes(def.id), ids.join(', '));
  }
  shot('canvas');
  // what to measure, from the saved page: every auto-fit grid, the gallery's spanning grid, the slideshow's strip
  const s = await site(page); const plan = { grids: [], span: null, pager: null };
  walk(s.pages[0].root, (n) => {
    if (n.layout === 'grid' && n.minCard && (n.children || []).length >= 2) plan.grids.push(n.children.map((c) => c.id));
    if (n.layout === 'grid' && !n.minCard && !plan.span && (n.children || []).some((c) => (c.colSpan || 1) > 1)) plan.span = n.children.map((c) => c.id);
    if (n.pager && !plan.pager) plan.pager = n.id;
  });
  // the Preview, on this device
  await page.evaluate(() => document.activeElement?.blur?.());
  await tap(page.getByRole('button', { name: 'Preview', exact: true }).first()); await u.sleep(3000);
  const f = await (await page.$('iframe')).contentFrame();
  const m = await f.evaluate(([plan]) => {
    const r = (id) => { const e = document.querySelector(`.bx-${id}`); return e ? e.getBoundingClientRect() : null; };
    const mw = window.innerWidth; const over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    let lone = 0;
    for (const g of plan.grids) { const rs = g.map(r).filter(Boolean); if (rs.length < 2) continue; const top = Math.round(rs[0].top); const across = rs.filter((x) => Math.abs(Math.round(x.top) - top) <= 1).length; if (across > 1 && rs.length % across) lone++; }
    let big = null;
    if (plan.span) { const rs = plan.span.map(r).filter(Boolean); big = { first: rs.every((x) => x.top >= rs[0].top - 1), wider: rs[0].width > rs[1].width * 1.6 }; }
    const strip = plan.pager && document.querySelector(`.bx-${plan.pager} [data-eu-pager]`);
    const slides = strip ? Array.from(strip.children).filter((c) => c.getBoundingClientRect().width > 0) : [];
    return { mw, over, lone, grids: plan.grids.length, big, pager: strip ? { scrolls: strip.scrollWidth > strip.clientWidth + 1, wide: slides.every((c) => Math.abs(c.getBoundingClientRect().width - strip.clientWidth) <= 2) } : null };
  }, [plan]);
  ok('the Preview does not scroll sideways', m.over <= 1, `${m.over}px at ${m.mw}`);
  ok('no card alone on a line', m.lone === 0, `${m.lone} of ${m.grids} grids at ${m.mw}`);
  ok(m.mw < TP ? 'the gallery\'s big picture comes first on the phone' : 'the gallery\'s big picture comes first and spans', !!m.big && m.big.first && (m.mw < TP || m.big.wider), JSON.stringify(m.big));
  ok('the slideshow shows one slide at a time', !!m.pager && m.pager.scrolls && m.pager.wide, JSON.stringify(m.pager));
  // a real swipe on the slideshow moves it one slide
  if (plan.pager) {
    const strip = f.locator(`.bx-${plan.pager} [data-eu-pager]`).first(); await strip.scrollIntoViewIfNeeded(); await u.sleep(800);
    const before = await strip.evaluate((e) => e.scrollLeft);
    // the shared touch helper's sum (LE15i-7): the WebView's place on the screen + the box (page px, the iframe included) × dpr
    const dpr = await page.evaluate(() => window.devicePixelRatio); const wv = webviewBox(d); const box = await strip.boundingBox();
    const y = Math.round(wv.top + (box.y + box.height / 2) * dpr);
    const xa = Math.round(wv.left + (box.x + box.width * 0.8) * dpr), xb = Math.round(wv.left + (box.x + box.width * 0.2) * dpr);
    u.shell(d, `input swipe ${xa} ${y} ${xb} ${y} 300`); await u.sleep(1500);
    const after = await strip.evaluate((e) => e.scrollLeft);
    ok('a swipe moves the slideshow on', after > before, `${before} → ${after}`);
  }
  shot('preview');
  ok('no console errors in the editor', !errors.length, errors.join(' | ') || 'none');
  await browser.close().catch(() => {});
  fs.writeFileSync(path.join(OUT, `emu-${which}.json`), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.pass); console.log(`SUMMARY [${which}] ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error(`ERROR [${which}] ${e.message.split('\n')[0]}`); process.exit(1); });
