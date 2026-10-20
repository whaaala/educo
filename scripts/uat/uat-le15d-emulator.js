/**
 * BATCH LE-15d · THE APP half of the HEADED pass (checklist D12): the site editor's WebView on the tablet and the phone, REAL
 * touches (adb input), read over CDP. For each of the six new categories: its chip tapped, its tiles drawn (the count the config
 * promises), one layout added by a tap. Then the Preview, measured on the device: nothing sideways, no card alone on a line, a
 * time / date beside its item, and a question opened by a real tap. Made from uat-le15c-emulator.js.
 *   node scripts/uat/uat-le15d-emulator.js tablet|phone     (Metro on 8081, `next start -p 3100` serving .next-b, the emulator booted)
 */
const fs = require('fs'); const path = require('path');
const u = require('./adb-ui.js'); const { editorPage, touch, webviewBox } = require('./e5d-lib.js');
const T = require('../../config/inspector.json').sections;
const CATS = require('../../config/sections.json').categories.filter((c) => c.batch === 'LE-15d');
// one layout per category: List's dated agenda is the one whose dates must stay beside their items; the rest their first
const PICK = { list: 'list-term-dates' };
const which = process.argv[2] || 'phone';
const d = process.env.SERIAL || (which === 'tablet' ? 'emulator-5554' : 'emulator-5556');
const port = which === 'tablet' ? 9301 : 9302;
const OUT = path.join(__dirname, 'logs', 'le15d'); fs.mkdirSync(OUT, { recursive: true });
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
    if (cat.id === 'faq') shot('faq-tiles');
    await tap(page.getByRole('button', { name: new RegExp(`^Add ${re(def.name)},`) }).first());
    await closePanel();
    const s = await site(page); const ids = []; walk(s.pages[0].root, (x) => { if (x.sectionFrom) ids.push(x.sectionFrom); });
    ok(`${cat.label}: "${def.name}" added by a tap`, ids.includes(def.id), ids.join(', '));
  }
  shot('canvas');
  // what to measure, from the saved page: every auto-fit grid, every row of a fixed-width time / date beside its item, the accordion
  const s = await site(page); const plan = { grids: [], beside: [], faq: null };
  walk(s.pages[0].root, (n) => {
    if (n.layout === 'grid' && n.minCard && (n.children || []).length >= 2) plan.grids.push(n.children.map((c) => c.id));
    const k = n.children || [];
    if (n.direction === 'row' && k.length === 2 && k[0].type !== 'image' && typeof k[0].width === 'string' && /rem$/.test(k[0].width) && k[1].width === 'fill') plan.beside.push([k[0].id, k[1].id]);
    if (n.component === 'accordion' && !plan.faq) plan.faq = n.id;
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
    let under = 0; for (const [a, b] of plan.beside) { const x = r(a), y = r(b); if (x && y && (y.left < x.right - 1 || y.top > x.bottom - 1)) under++; }
    return { mw, over, lone, grids: plan.grids.length, under, beside: plan.beside.length };
  }, [plan]);
  ok('the Preview does not scroll sideways', m.over <= 1, `${m.over}px at ${m.mw}`);
  ok('no card alone on a line', m.lone === 0, `${m.lone} of ${m.grids} grids at ${m.mw}`);
  ok('a time / date stays beside its item (B23)', m.beside > 0 && m.under === 0, `${m.under} of ${m.beside} went under`);
  // a question opened by a REAL tap on its summary
  if (plan.faq) {
    const sum = f.locator(`.bx-${plan.faq} details > summary`).nth(1); await sum.scrollIntoViewIfNeeded(); await u.sleep(800);
    const before = await sum.evaluate((x) => x.parentElement.open);
    const dpr = await page.evaluate(() => window.devicePixelRatio); const wv = webviewBox(d); const box = await sum.boundingBox();
    u.shell(d, `input tap ${Math.round(wv.left + (box.x + box.width / 2) * dpr)} ${Math.round(wv.top + (box.y + box.height / 2) * dpr)}`); await u.sleep(1200);
    const after = await sum.evaluate((x) => x.parentElement.open);
    ok('a tap on a question opens its answer', !before && after, `${before} → ${after}`);
    shot('faq-open');
  } else ok('a tap on a question opens its answer', false, 'no accordion on the page');
  shot('preview');
  ok('no console errors in the editor', !errors.length, errors.join(' | ') || 'none');
  await browser.close().catch(() => {});
  fs.writeFileSync(path.join(OUT, `emu-${which}.json`), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.pass); console.log(`SUMMARY [${which}] ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error(`ERROR [${which}] ${e.message.split('\n')[0]}`); process.exit(1); });
