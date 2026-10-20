/**
 * BATCH LE-15k · THE APP half of the HEADED pass (checklist K10, and K18 for LE15k-4: Replace picture and Edit text by a finger): the site editor's WebView on the tablet and the phone, REAL
 * touches (adb input), read over CDP. The School home page added by taps; a section selected by a tap and named a Section;
 * ⋮ → Show spacing shows every space (a finger has no hover); a quick-link card's bottom edge dragged by a REAL finger: every card
 * grows, the bar offers "Just this one instead", a tap on it leaves only that card taller. Made from uat-le15d-emulator.js.
 *   node scripts/uat/uat-le15k-emulator.js tablet|phone     (Metro on 8081, `next start -p 3100` serving .next-b, the emulator booted)
 */
const fs = require('fs'); const path = require('path');
const u = require('./adb-ui.js'); const { editorPage, touch, webviewBox } = require('./e5d-lib.js');
const W = require('../../config/inspector.json'); const T = W.sections, SEL = W.selection;
const which = process.argv[2] || 'phone';
const d = process.env.SERIAL || (which === 'tablet' ? 'emulator-5554' : 'emulator-5556');
const port = which === 'tablet' ? 9301 : 9302;
const OUT = path.join(__dirname, 'logs', 'le15k'); fs.mkdirSync(OUT, { recursive: true });
const results = []; const ok = (line, pass, seen) => { results.push({ which, line, pass: !!pass, seen }); console.log(`${pass ? 'PASS' : 'FAIL'} [${which}] ${line} — ${seen}`); };
const shot = (tag) => u.shot(d, path.join(OUT, `emu-${which}-${tag}.png`));

(async () => {
  for (const p of ['8081', '3100']) u.adb(d, ['reverse', `tcp:${p}`, `tcp:${p}`]);
  console.log(`DEVICE [${which}] ${d}: ${String(u.shell(d, 'wm size')).trim()}`); // LE15b-19: the serials can swap — say which it really is
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
  // into view inside whatever scrolls it (the ⋮ menu is taller than a tablet's window, and scrolls) — as a finger scrolls to it
  const tap = async (loc) => { await loc.evaluate((e) => e.scrollIntoView({ block: 'center' })).catch(() => {}); await u.sleep(400); await touch(d, page, loc); await u.sleep(900); };
  const dpr = await page.evaluate(() => window.devicePixelRatio); const wv = webviewBox(d);
  const scr = (x, y) => [Math.round(wv.left + x * dpr), Math.round(wv.top + y * dpr)];

  // the School home page, by taps (Add page is in More on a phone or tablet, E5a-16)
  const add = page.getByRole('button', { name: 'Add page', exact: true }).first();
  if (!(await add.isVisible().catch(() => false))) await tap(page.getByRole('button', { name: 'More', exact: true }).first());
  await tap(page.getByRole('button', { name: 'Add page', exact: true }).first());
  const dlg = page.getByRole('dialog', { name: T.addPageTitle }); await dlg.waitFor({ timeout: 30000 }); await u.sleep(2500);
  await tap(dlg.getByRole('button', { name: /^Add School home,/ }));
  await page.getByText(/Open day on Saturday/).first().waitFor({ timeout: 30000 }); await u.sleep(1500);

  // a section, selected by a tap
  await tap(page.getByText(/Open day on Saturday/).first());
  const ed = await page.getByText(/^Editing:/).first().locator('xpath=..').innerText().catch(() => '');
  const isSection = await page.evaluate(() => { const id = document.querySelector('[data-chrome-mirror]')?.getAttribute('data-chrome-mirror'); return document.querySelector(`[data-box-id="${id}"]`)?.tagName === 'SECTION'; });
  ok('a tap on the hero selects its section, named a Section', isSection && (/Section/.test(ed) || !ed), `selected a ${isSection ? 'section' : 'block'} · "${ed.split('\n')[0]}"`);
  const rest = await page.locator('[data-space-band]').count();
  // ⋮ opened as a person opens it — tapped again if it did not open (a tap a scroll swallowed)
  const menu = async (label) => {
    const btn = page.getByRole('button', { name: 'Block actions' }).first();
    for (let i = 0; i < 3 && (await btn.getAttribute('aria-expanded')) !== 'true'; i++) await tap(btn);
    await tap(page.getByRole('menuitem', { name: new RegExp(`^${label}`) }));
  };
  if (!process.env.SKIPSP) await menu(SEL.showSpacing);
  await page.waitForFunction(() => document.querySelectorAll('[data-space-band]').length > 1, null, { timeout: 3000 }).catch(() => {});
  const shown = await page.locator('[data-space-band]').count(); shot('spacing-shown');
  ok('⋮ → Show spacing shows every space with its words (a finger has no hover)', rest === 0 && shown > 1, `${rest} at rest → ${shown} shown`);
  if (!process.env.SKIPSP) await menu(SEL.hideSpacing);

  // a quick-link card's bottom edge, dragged by a REAL finger
  const card = page.getByText('Term dates').first();
  for (let i = 0; i < 4; i++) {
    await tap(card);
    const isCard = await page.evaluate(() => { const id = document.querySelector('[data-chrome-mirror]')?.getAttribute('data-chrome-mirror'); const e = document.querySelector(`[data-box-id="${id}"]`); return !!e && !!e.querySelector('svg') && e.textContent.trim() === 'Term dates'; });
    if (isCard) break;
  }
  const heights = () => page.evaluate(() => { const id = document.querySelector('[data-chrome-mirror]')?.getAttribute('data-chrome-mirror'); const me = document.querySelector(`[data-box-id="${id}"]`); return me ? Array.from(me.parentElement.children).map((c) => ({ me: c === me, h: c.getBoundingClientRect().height, t: c.getBoundingClientRect().top })) : null; });
  // the canvas settled first: a scroll still running moves the handle away from where the finger is sent
  await page.waitForFunction(() => new Promise((r) => { const s = document.querySelector('[data-canvas-scroller]') || document.scrollingElement; const y0 = s.scrollTop; setTimeout(() => r(s.scrollTop === y0), 300); }), null, { timeout: 5000 }).catch(() => {});
  await u.sleep(500);
  const a = await heights(); const h = await page.locator('[aria-label="Resize bottom edge"]').first().boundingBox();
  const hit = await page.locator('[data-handle-hit="s"]').first().boundingBox().catch(() => null);
  const from = hit || h; const [x0, y0] = scr(from.x + from.width / 2, from.y + from.height / 2);
  u.shell(d, `input swipe ${x0} ${y0} ${x0} ${y0 + Math.round(60 * dpr)} 900`); await u.sleep(1500);
  const z = await heights(); const mi = a ? a.findIndex((c) => c.me) : -1;
  const grew = !!a && !!z && z.every((c, i) => c.h - a[i].h > 20);
  ok('a finger on a card\'s bottom edge grows every card together', grew, a && z ? z.map((c, i) => Math.round(c.h - a[i].h)).join(',') : 'no selection');
  const bar = page.locator('[data-one-or-all]'); const barText = await bar.innerText().catch(() => '');
  shot('bar');
  ok('the bar offers "Just this one instead"', barText.includes(SEL.justThisOne), barText.replace(/\n/g, ' ') || 'no bar');
  if (barText) {
    await tap(bar.getByRole('button', { name: SEL.justThisOne }));
    const one = await heights();
    const others = one ? one.map((c, i) => ({ ...c, i })).filter((c) => Math.abs(c.t - one[mi].t) > 2) : [];
    ok('a tap on it: the card stays selected and only it keeps the height', !!one && one[mi].h - a[mi].h > 20 && others.every((c) => Math.abs(c.h - a[c.i].h) < 2), one ? `this +${Math.round(one[mi].h - a[mi].h)} · others ${others.map((c) => Math.round(c.h - a[c.i].h)).join(',')}` : 'selection lost');
    shot('just-this-one');
  }
  // K18 (LE15k-4) · the two named buttons by a REAL finger: "Replace picture" on the hero opens the phone's own photo chooser;
  // "Edit text" on the title puts the caret in its words and the keyboard comes up
  const selected = () => page.evaluate(() => { const id = document.querySelector('[data-chrome-mirror]')?.getAttribute('data-chrome-mirror'); const e = id && document.querySelector(`[data-box-id="${CSS.escape(id)}"]`); return e ? e.tagName + (e.querySelector('p') ? ':p' : '') : ''; });
  const bar2 = () => page.getByRole('toolbar', { name: 'Block toolbar' });
  await page.keyboard.press('Escape').catch(() => {}); await page.keyboard.press('Escape').catch(() => {}); await u.sleep(500);
  for (let i = 0; i < 4 && (await selected()) !== 'SECTION:p'; i++) await tap(page.getByText(/Open day on Saturday/).first());
  u.shell(d, 'input keyevent 111'); await u.sleep(600); // a tap on the words opens the keyboard; put it away as a person does
  const rp = bar2().getByRole('button', { name: SEL.replacePicture });
  const rpSeen = await rp.isVisible().catch(() => false);
  if (rpSeen) await tap(rp);
  await u.sleep(2500);
  const focus = String(u.shell(d, 'dumpsys window | grep -E "mCurrentFocus|mFocusedApp"')).trim();
  shot('replace-picture-chooser');
  const chooser = /documentsui|photopicker|mediaprovider|gallery|PickActivity/i.test(focus);
  ok('a tap on "Replace picture" on the hero opens the phone\'s photo chooser', rpSeen && chooser, `button ${rpSeen} · ${focus.split('\n')[0].slice(0, 120)}`);
  if (chooser) { u.shell(d, 'input keyevent 4'); await u.sleep(1500); } // Back: nothing chosen, nothing changed
  for (let i = 0; i < 5 && !/^H[1-6]/.test(await selected()); i++) { await tap(page.getByText(/Welcome to/).first()); u.shell(d, 'input keyevent 111'); await u.sleep(500); }
  const et = bar2().getByRole('button', { name: SEL.editText });
  const etSeen = await et.isVisible().catch(() => false);
  if (etSeen) await tap(et);
  await u.sleep(1200);
  const caret = await page.evaluate(() => !!document.activeElement && document.activeElement.isContentEditable && /Welcome/.test(document.activeElement.textContent));
  const kb = /mInputShown=true/.test(String(u.shell(d, 'dumpsys input_method | grep mInputShown')));
  shot('edit-text');
  ok('a tap on "Edit text" on the title: the caret in its words, the keyboard up', etSeen && caret && kb, `button ${etSeen} · caret ${caret} · keyboard ${kb}`);
  u.shell(d, 'input keyevent 111'); await u.sleep(500);
  ok('no console errors in the editor', !errors.length, errors.join(' | ') || 'none');
  await browser.close().catch(() => {});
  fs.writeFileSync(path.join(OUT, `emu-${which}.json`), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.pass); console.log(`SUMMARY [${which}] ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error(`ERROR [${which}] ${e.message.split('\n')[0]}`); process.exit(1); });
