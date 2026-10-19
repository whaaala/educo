/**
 * BATCH LE-15i · THE APP half of the HEADED pass (S9): the site editor's WebView on the tablet and the phone, REAL touches (adb
 * input), read over CDP. Two plain sections added by a tap — their space SHARED in the Preview measured on the device (SG-2); then
 * Page settings → Page grid… by touch (LE15i-2: the panel must open on the app's compact bar), the space between sections moved by a
 * tap — every section's bottom the same, the shared top still 0 (SG-1).
 *   node scripts/uat/uat-le15i-emulator.js tablet|phone     (Metro on 8081, `next start -p 3100` serving .next-b, the emulator booted)
 */
const fs = require('fs'); const path = require('path');
const u = require('./adb-ui.js'); const { editorPage, touch } = require('./e5d-lib.js');
const T = require('../../config/inspector.json').sections;
const SS = require('../../config/inspector.json').sectionSpace;
const which = process.argv[2] || 'phone';
const d = process.env.SERIAL || (which === 'tablet' ? 'emulator-5554' : 'emulator-5556');
const port = which === 'tablet' ? 9301 : 9302;
const OUT = path.join(__dirname, 'logs', 'le15i'); fs.mkdirSync(OUT, { recursive: true });
const results = []; const ok = (line, pass, seen) => { results.push({ which, line, pass: !!pass, seen }); console.log(`${pass ? 'PASS' : 'FAIL'} [${which}] ${line} — ${seen}`); };
const shot = (tag) => u.shot(d, path.join(OUT, `emu-${which}-${tag}.png`));
const site = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1') || 'null'));
const cls = (id) => '.bx-' + id.replace(/[^A-Za-z0-9_-]/g, '-');

(async () => {
  for (const p of ['8081', '3100']) u.adb(d, ['reverse', `tcp:${p}`, `tcp:${p}`]);
  console.log(`DEVICE [${which}] ${d}: ${String(u.shell(d, 'wm size')).trim()}`); // LE15b-19: name the device by its screen
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
  const add = async (cat, name) => {
    await tap(page.getByRole('button', { name: 'Open blocks panel' }));
    await tap(page.getByRole('tab', { name: T.tab, exact: true }));
    await page.getByRole('tablist', { name: T.categories }).waitFor({ timeout: 30000 });
    await tap(page.getByRole('tablist', { name: T.categories }).getByRole('tab', { name: new RegExp(`^${cat}`) })); await u.sleep(2000);
    await tap(page.getByRole('button', { name: new RegExp(`^Add ${name},`) }).first());
    const c = page.getByRole('button', { name: 'Close blocks panel' }); if (await c.isVisible().catch(() => false)) await tap(c);
  };
  await add('Hero', 'Words beside a picture'); await add('Features', 'Three icon points beside a photo');
  const ids = (await site(page)).pages[0].root.children.map((b) => b.children?.[0]).filter((n) => n?.sectionFrom).map((n) => n.id);
  ok('two plain sections added by a tap', ids.length === 2, `${ids.length}`);
  const measure = async () => {
    await page.evaluate(() => document.activeElement?.blur?.());
    await tap(page.getByRole('button', { name: 'Preview', exact: true }).first()); await u.sleep(3000);
    const f = await (await page.$('iframe')).contentFrame();
    const m = await f.evaluate((sels) => ({ w: innerWidth, over: document.documentElement.scrollWidth - document.documentElement.clientWidth, p: sels.map((s) => { const e = document.querySelector(s); const c = e && getComputedStyle(e); return c ? [parseFloat(c.paddingTop), parseFloat(c.paddingBottom)].map((x) => Math.round(x * 10) / 10) : null; }) }), ids.map(cls));
    await tap(page.getByRole('button', { name: /Exit preview/ }).first()); await u.sleep(1200);
    return m;
  };
  const a = await measure();
  ok('SG-2 in the Preview on the device: the second section\'s top shared (0), the first\'s bottom kept', a.p[1]?.[0] === 0 && a.p[0]?.[1] > 0, `${JSON.stringify(a.p)} at ${a.w}`);
  shot('preview-shared');
  // SG-1 by touch: Page settings → Page grid… (LE15i-2), the slider tapped
  const ps = page.getByRole('button', { name: 'Page settings' }).first();
  if (!(await ps.isVisible().catch(() => false))) await tap(page.getByRole('button', { name: 'More', exact: true }).first());
  await tap(page.getByRole('button', { name: 'Page settings' }).first());
  await tap(page.getByRole('button', { name: /Page grid…/ }).first());
  const grid = page.locator('[role=dialog][aria-label="Page grid"]');
  const open = await grid.isVisible().catch(() => false);
  ok('Page settings → Page grid… opens the panel on the app (LE15i-2)', open, open ? 'shown' : 'NOT SHOWN');
  shot('page-grid');
  if (open) {
    await tap(grid.getByLabel(SS.label)); // LE15i-7: the shared touch helper maps the WebView's place on the screen (a raw adb tap missed it)
    const v = (await site(page)).pageGrid?.sectionSpace;
    await page.keyboard.press('Escape').catch(() => {}); const c = page.getByRole('button', { name: /Close|Done/ }).first(); if (await c.isVisible().catch(() => false)) await tap(c);
    const m = await measure();
    ok('SG-1 by touch: the space set, both sections the same bottom, the shared top still 0', v > 0 && m.p[0][1] === m.p[1][1] && m.p[1][0] === 0 && m.p[0][0] === m.p[0][1], `stored ${v} · ${JSON.stringify(m.p)}`);
    ok('the Preview does not scroll sideways', m.over <= 1, `${m.over}px at ${m.w}`);
    shot('preview-site-space');
  }
  ok('no console errors in the editor', !errors.length, errors.join(' | ') || 'none');
  await browser.close().catch(() => {});
  fs.writeFileSync(path.join(OUT, `emu-${which}.json`), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.pass); console.log(`SUMMARY [${which}] ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error(`ERROR [${which}] ${e.message.split('\n')[0]}`); process.exit(1); });
