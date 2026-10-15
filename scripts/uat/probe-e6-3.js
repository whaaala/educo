// E-6 (3) probe — the selected block's spacing bands and handles, BUILT THROUGH THE UI (RULE Y), HEADED.
// node scripts/uat/probe-e6-3.js --headed [width]
const H = require('./h.js'); const path = require('path'); const fs = require('fs');
const OUT = path.join(__dirname, 'e6-out'); fs.mkdirSync(OUT, { recursive: true });
const W = Number(process.argv.find((a) => /^\d+$/.test(a)) || 1280);
const stored = (page, id) => page.evaluate((id) => {
  const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); let hit = null;
  const walk = (n) => { if (n.id === id) hit = n; (n.children || []).forEach(walk); }; walk(s.pages[0].root);
  // a drag writes the screen the canvas shows (as the Inspector does): read what THAT screen gets
  if (hit) hit = Object.assign({}, hit, ...Object.values(hit.responsive || {}));
  const k = ['padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'margin', 'marginTop', 'marginBottom', 'gap', 'gapX', 'gapY'];
  return Object.fromEntries(k.filter((x) => hit && hit[x] !== undefined).map((x) => [x, hit[x]]));
}, id);
const handles = (page) => page.evaluate(() => [...document.querySelectorAll('[data-space-handle]')].map((h) => { const r = h.getBoundingClientRect(); return { k: h.dataset.spaceHandle, x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), w: Math.round(r.width), h: Math.round(r.height), now: h.getAttribute('aria-valuenow'), text: h.getAttribute('aria-valuetext') }; }));
const bands = (page) => page.evaluate(() => [...document.querySelectorAll('[data-space-band]')].map((b) => `${b.dataset.spaceBand}:${Math.round(b.getBoundingClientRect().width)}x${Math.round(b.getBoundingClientRect().height)}${b.textContent ? ' "' + b.textContent + '"' : ''}`));
async function drag(page, key, dx, dy, mods = [], shotName = null) {
  const h = (await handles(page)).find((x) => x.k === key); if (!h) throw new Error('no handle ' + key);
  for (const m of mods) await page.keyboard.down(m);
  await page.mouse.move(h.x, h.y); await page.mouse.down();
  for (let i = 1; i <= 12; i++) { await page.mouse.move(h.x + (dx * i) / 12, h.y + (dy * i) / 12); await page.waitForTimeout(15); }
  if (shotName) await page.screenshot({ path: path.join(OUT, shotName) });
  await page.mouse.up(); for (const m of mods.reverse()) await page.keyboard.up(m); await page.waitForTimeout(350);
}
const fails = []; const check = (ok, what) => { console.log(`${ok ? 'PASS' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: W, h: 900 });
  await H.panel(page, true); await H.clickTile(page, 'Stack'); await page.waitForTimeout(500);
  const stack = await page.evaluate(() => [...document.querySelectorAll('[data-box-id]')].find((e) => e.parentElement.closest('[data-box-id]') && !e.querySelector('[data-box-id]'))?.dataset.boxId);
  // the way a person fills it on any screen (the blocks sheet covers a tablet's canvas): select the empty Stack, its + (shown
  // only now it is selected, E-6 (4)) → Text; then the Stack's toolbar "Add a block inside this one" → Text, which goes under
  await H.panel(page, false); await H.select(page, stack);
  await page.locator(`[data-box-id="${stack}"] button[aria-label="Choose a block to add inside"]`).click(); await page.waitForTimeout(300);
  await page.locator('[role="menu"][aria-label="Add a block inside"]').getByRole('menuitem', { name: /^Text$/ }).click(); await page.waitForTimeout(600);
  await page.keyboard.press('Escape'); await H.select(page, stack);
  await page.getByRole('button', { name: 'Add a block inside this one' }).first().click(); await page.waitForTimeout(300);
  await page.locator('[role="menu"][aria-label="Add a block inside"]').getByRole('menuitem', { name: /^Text$/ }).click(); await page.waitForTimeout(600);
  await page.keyboard.press('Escape');
  console.log(await H.tree(page));
  await H.select(page, stack); await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, `e6-3-${W}-selected.png`) });
  console.log('handles', JSON.stringify(await handles(page)));
  console.log('stored at start', JSON.stringify(await stored(page, stack)));
  check(Object.keys(await stored(page, stack)).length === 0, 'a new Stack stores no space');
  const keys = (await handles(page)).map((h) => h.k);
  check(['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'marginTop', 'marginBottom', 'gapy'].every((k) => keys.includes(k)), 'a handle on every side, and the gap, at 0: ' + keys.join(' '));
  const y0 = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"] [data-box-id]`).getBoundingClientRect().top, stack);

  await drag(page, 'paddingTop', 0, 48, [], `e6-3-${W}-dragging.png`);
  let s = await stored(page, stack); check(s.paddingTop > 0 && [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96].includes(s.paddingTop) && Object.keys(s).length === 1, 'drag top inner → only paddingTop, on a step: ' + JSON.stringify(s));
  const y1 = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"] [data-box-id]`).getBoundingClientRect().top, stack);
  check(y1 - y0 > 20, `the first Text moved down ${Math.round(y1 - y0)}px`);
  console.log('bands', (await bands(page)).join(' | '));
  check((await bands(page)).some((b) => b.startsWith('paddingTop') && b.includes('rem')), 'the top band is drawn with its size in rem');
  await page.screenshot({ path: path.join(OUT, `e6-3-${W}-padtop.png`) });
  await page.keyboard.press('Control+z'); await page.waitForTimeout(400);
  check(Object.keys(await stored(page, stack)).length === 0, 'one Undo takes the whole drag back: ' + JSON.stringify(await stored(page, stack)));
  check((await H.selected(page)) === stack, 'the Stack is still selected after Undo');

  await drag(page, 'paddingLeft', 40, 0, ['Alt']);
  s = await stored(page, stack); check(s.paddingLeft > 0 && s.paddingLeft === s.paddingRight && s.paddingTop === undefined, 'Alt → left and right together: ' + JSON.stringify(s));
  await drag(page, 'paddingTop', 0, 30, ['Alt', 'Shift']);
  s = await stored(page, stack); check(s.paddingTop > 0 && s.paddingTop === s.paddingBottom && s.paddingTop === s.paddingLeft && s.paddingTop === s.paddingRight, 'Alt+Shift → all four: ' + JSON.stringify(s));
  const before = s.paddingBottom;
  await drag(page, 'paddingBottom', 0, -22, ['Shift']);
  s = await stored(page, stack); check([0, 8, 16, 24, 40, 64, 96].includes(s.paddingBottom) && s.paddingBottom !== before, `Shift → a bigger step: ${before} → ${s.paddingBottom}`);
  await drag(page, 'gapy', 0, 30);
  s = await stored(page, stack); check(s.gap > 0, 'the gap handle sets the gap: ' + JSON.stringify(s));
  await drag(page, 'marginBottom', 0, 30);
  s = await stored(page, stack); check(s.marginBottom > 0, 'the outer space below: ' + JSON.stringify(s));
  await page.screenshot({ path: path.join(OUT, `e6-3-${W}-all.png`) });

  // double-click the top inner band → 0
  const band = await page.evaluate(() => { const b = document.querySelector('[data-space-band="paddingTop"]'); const r = b.getBoundingClientRect(); return { x: r.x + r.width * 0.8, y: r.y + r.height / 2 }; });
  await page.mouse.dblclick(band.x, band.y); await page.waitForTimeout(400);
  s = await stored(page, stack); check(s.paddingTop === 0, 'double-click the band → 0: ' + JSON.stringify(s));
  check((await handles(page)).some((h) => h.k === 'paddingTop'), '…and its handle is still there');

  // the keyboard
  const order = await H.tree(page);
  await page.locator('[data-space-handle="paddingTop"]').focus();
  await page.keyboard.press('ArrowUp'); await page.waitForTimeout(200); const k1 = (await stored(page, stack)).paddingTop;
  await page.keyboard.press('Shift+ArrowUp'); await page.waitForTimeout(200); const k2 = (await stored(page, stack)).paddingTop;
  await page.keyboard.press('Home'); await page.waitForTimeout(200); const k3 = (await stored(page, stack)).paddingTop;
  check(k1 === 4 && k2 === 12 && k3 === 0, `keys: Arrow Up ${k1}, Shift+Arrow Up ${k2}, Home ${k3}`);
  check((await H.tree(page)) === order, 'the arrows moved the space, not the block');
  const ax = await page.locator('[data-space-handle="paddingTop"]').getAttribute('aria-valuetext');
  check(/Inner space, top: 0rem/.test(ax || ''), 'the slider says what it is: ' + ax);
  await page.screenshot({ path: path.join(OUT, `e6-3-${W}-end.png`) });
  check(errs.length === 0, 'no page errors: ' + errs.join(' | '));
  console.log(fails.length ? `\n${fails.length} FAILED` : '\nALL PASS');
  if (!process.argv.includes('--keep')) await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
