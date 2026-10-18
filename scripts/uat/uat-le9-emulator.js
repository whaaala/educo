/**
 * BATCH LE-9 · THE APP half of the HEADED pass (H7 in docs/TASK_TREE.md): the site editor's WebView on the tablet (emulator-5554)
 * and the phone (emulator-5556). Built through the editor's own UI with REAL touches (adb input); read over CDP. A Stack holding a
 * Heading, a Text and a Button; the Button's Order −1 on the screen being edited (Position → Order, the number typed); the Page
 * check names the Button on that screen as a suggestion, and Show me selects it; the app's Preview draws it first.
 *   node scripts/uat/uat-le9-emulator.js tablet|phone     (Metro on 8081, `next start -p 3100`, the emulator booted)
 */
const fs = require('fs'); const path = require('path');
const u = require('./adb-ui.js'); const { editorPage, touch } = require('./e5d-lib.js');
const PC = require('../../config/page-check.json').readingOrder;
const which = process.argv[2] || 'phone';
const d = process.env.SERIAL || (which === 'tablet' ? 'emulator-5554' : 'emulator-5556'); // SERIAL: an emulator booted alone takes 5554
const port = which === 'tablet' ? 9301 : 9302;
const OUT = path.join(__dirname, 'logs', 'le9'); fs.mkdirSync(OUT, { recursive: true });
const results = []; const ok = (line, pass, seen) => { results.push({ which, line, pass: !!pass, seen }); console.log(`${pass ? 'PASS' : 'FAIL'} [${which}] ${line} — ${seen}`); };
const shot = (tag) => u.shot(d, path.join(OUT, `emu-${which}-${tag}.png`));
const sel = (page) => page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);
const stored = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1') || 'null'));
const find = (st, id) => { let n = null; const w = (x) => { if (x.id === id) n = x; (x.children || []).forEach(w); }; st.pages.forEach((p) => w(p.root)); return n; };
const tail = PC.message.split('{block}')[1].slice(0, 30).trim();
const require_desk = require('../../config/layout.json').rungs.desktop.from; // the editor's width from which it edits the base

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
  // LE13b-14 / LE13c-6 (→ BATCH A-4) · the first run after a cold boot — measured here
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
  const inspector = async (section) => {
    for (const tab of ['Layout', 'Design']) {
      const t = page.getByRole('tab', { name: tab }).first();
      for (let i = 0; i < 4 && !(await t.isVisible().catch(() => false)); i++) { const exp = page.getByRole('button', { name: 'Expand inspector' }); if (await exp.isVisible().catch(() => false)) await tap(exp); else await u.sleep(800); }
      if (!(await t.isVisible().catch(() => false))) continue;
      await tap(t); const head = page.getByRole('button', { name: new RegExp(`^\\s*${section}\\s*$`) }).first();
      if (await head.count()) { if ((await head.getAttribute('aria-expanded')) === 'false') await tap(head); return; }
    }
    throw new Error(`no ${section} section`);
  };
  const close = async () => { const col = page.getByRole('button', { name: /Collapse inspector|Close inspector/ }).first(); if (await col.isVisible().catch(() => false)) await tap(col); };
  const bar = async () => { const more = page.getByRole('button', { name: 'More', exact: true }); if (await more.isVisible().catch(() => false)) { await tap(more); return page.getByRole('dialog', { name: 'More' }); } return page; };

  const stack = await addBlock('Stack');
  const h = await addBlock('Heading', 'Inside');
  await addBlock('Text', 'After');
  const b = await addBlock('Button', 'After');
  // the Button's Order: a touch on the field, the number typed on the keyboard the field brings up
  await inspector('Position'); const f = page.getByLabel('Order', { exact: true }).first(); await tap(f);
  await page.keyboard.type('-1'); await page.keyboard.press('Enter'); await u.sleep(800); await page.evaluate(() => document.activeElement?.blur?.()); await u.sleep(500);
  shot('order'); await close();
  // LE9-4: the app edits the screen it is on (LE4-5) — a phone's slot, but a 1280-wide tablet IS a desktop screen: the base
  const vw = await page.evaluate(() => innerWidth); const desk = vw >= require_desk;
  const n = find(await stored(page), b); const slot = Object.entries(n?.responsive || {}).find(([, v]) => v?.order === -1)?.[0];
  ok(`the Button's Order −1 set with a touch and the keyboard, on the screen being edited (${vw}px: ${desk ? 'the base' : 'its own slot'})`, desk ? n.order === -1 && !slot : !!slot && n.order == null, `stored on ${slot ?? 'base'} (base ${n?.order})`);
  await tap((await bar()).getByRole('button', { name: /^Page check/ }).first());
  const dlg = page.getByRole('dialog').filter({ hasText: 'Page check' }).first(); await dlg.waitFor({ timeout: 15000 });
  await page.waitForFunction(() => !/Checking the page|Measuring the page/.test(document.querySelector('[role="dialog"]')?.textContent || ''), null, { timeout: 60000 });
  const line = dlg.locator('li').filter({ hasText: tail }); const said = await line.allTextContents(); shot('check');
  ok('the Page check names the Button on that screen, as a suggestion', said.length === 1 && /Button/.test(said[0]) && said[0].includes('a suggestion'), said.join(' ‖ ') || 'no line');
  await tap(line.first().getByRole('button', { name: 'Show me' }));
  ok('Show me (a touch) selects the Button', (await sel(page)) === b, `selected ${await sel(page)} (button ${b})`);
  await close();
  let fr = null;
  for (let i = 0; i < 3 && !fr; i++) { await tap(page.getByRole('button', { name: /^\s*Preview\s*$/ }).first()); await page.waitForSelector('iframe', { timeout: 8000 }).catch(() => {}); await u.sleep(2500); fr = page.frames().find((x) => x !== page.mainFrame()) || null; }
  const m = await fr.evaluate(([hh, bb]) => ({ h: document.querySelector(`.bx-${hh}`)?.getBoundingClientRect().top, b: document.querySelector(`.bx-${bb}`)?.getBoundingClientRect().top, vw: document.documentElement.clientWidth, sw: document.documentElement.scrollWidth }), [h, b]);
  const hide = page.getByRole('button', { name: 'Hide the preview controls' }).first(); if (await hide.isVisible().catch(() => false)) await tap(hide);
  await u.sleep(800); shot('preview');
  ok(`the app's Preview (${m.vw}px): the Button drawn above the Heading; nothing sideways`, m.b < m.h && m.sw <= m.vw, JSON.stringify(m));
  ok('no console errors in the editor', !errors.length, errors.join(' | ') || 'none');
  void stack;
  await browser.close().catch(() => {});
  fs.writeFileSync(path.join(OUT, `emu-${which}.json`), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.pass); console.log(`SUMMARY [${which}] ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error('ERR', e.message.split('\n')[0]); shot('ERR'); process.exit(1); });
