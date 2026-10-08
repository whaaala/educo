// PROBE — BATCH E-5b: what a finger's top handle, a corner, a still tap and a floating block actually do (headed, built through
// the UI). NODE_PATH=node_modules node scripts/uat/probe-e5b.js [touch=1] [w=393] [h=851]
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:3100';
const [touchArg = '1', W = '393', H = '851'] = process.argv.slice(2);
const touch = touchArg === '1';
(async () => {
  const browser = await chromium.launch({ headless: false, args: ['--force-device-scale-factor=1'] });
  const ctx = await browser.newContext({ viewport: { width: +W, height: +H }, hasTouch: touch, isMobile: touch && +W < 600, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.text().startsWith('EV ')) console.log(m.text()); });
  await page.goto(BASE + '/website/box-demo'); await page.evaluate(() => localStorage.clear()); await page.reload();
  await page.waitForFunction(() => { const b = [...document.querySelectorAll('button')].find((x) => x.getAttribute('aria-label') === 'Open blocks panel'); return !!b && Object.keys(b).some((k) => k.startsWith('__reactProps')); });
  await page.waitForTimeout(800);
  const press = (l) => (touch ? l.tap() : l.click());
  const add = async (tile, look) => { await press(page.getByRole('button', { name: 'Open blocks panel' })); await page.waitForTimeout(400); await press(page.getByRole('button', { name: new RegExp(`^Add ${tile}( —|$)`) }).first()); await page.waitForTimeout(400); if (look) { const i = page.getByRole('menuitem', { name: look, exact: true }).first(); if (await i.isVisible().catch(() => false)) await press(i); } await page.waitForTimeout(400); const c = page.getByRole('button', { name: 'Close blocks panel' }); if (await c.isVisible().catch(() => false)) await press(c); };
  await add('Heading', 'Default'); await add('Stack'); await add('Divider', 'Default');
  const root = () => page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1')).pages[0].root);
  const flat = (n) => [n, ...(n.children ?? []).flatMap(flat)];
  const r0 = await root(); const stack = flat(r0).find((n) => n.type === 'container' && !n.rowBand && n !== r0 && !n.children?.length).id;
  const el = page.locator(`[data-box-id="${stack}"]`);
  for (let i = 0; i < 4 && !(await el.evaluate((e) => e.classList.contains('outline-indigo-500'))); i++) { const b = await el.boundingBox(); await page.mouse.click(b.x + b.width - 30, b.y + b.height - 20); await page.waitForTimeout(250); }
  console.log('selected', await el.evaluate((e) => e.classList.contains('outline-indigo-500')));
  await page.evaluate(() => { for (const t of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'mousedown', 'mouseup']) document.addEventListener(t, (e) => { if (t !== 'pointermove' || Math.random() < 0.2) console.log(`EV ${t} ${e.pointerType ?? ''} ${(e.target.getAttribute?.('aria-label') ?? e.target.tagName)} ${Math.round(e.clientX)},${Math.round(e.clientY)}`); }, true); });
  const fingerDrag = async (from, to, n = 10) => {
    if (!touch) { await page.mouse.move(from.x, from.y); await page.mouse.down(); for (let i = 1; i <= n; i++) await page.mouse.move(from.x + (to.x - from.x) * i / n, from.y + (to.y - from.y) * i / n); await page.mouse.up(); return; }
    const cdp = await ctx.newCDPSession(page); const P = (p) => [{ x: Math.round(p.x), y: Math.round(p.y), id: 1 }];
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: P(from) });
    for (let i = 1; i <= n; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: P({ x: from.x + (to.x - from.x) * i / n, y: from.y + (to.y - from.y) * i / n }) }); await page.waitForTimeout(16); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await cdp.detach();
  };
  const hb = async (name) => { const b = await page.locator(`[aria-label="Resize ${name}"]`).first().boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, b }; };
  const what = async (p) => page.evaluate(({ x, y }) => document.elementsFromPoint(x, y).slice(0, 4).map((e) => e.getAttribute('aria-label') || e.getAttribute('data-box-id') || e.tagName).join(' > '), p);
  for (const name of ['top edge', 'bottom-right corner']) {
    const h = await hb(name); const b0 = await el.boundingBox();
    console.log(`\n== ${name} at ${Math.round(h.x)},${Math.round(h.y)} — under it: ${await what(h)}`);
    await fingerDrag(h, name === 'top edge' ? { x: h.x, y: h.y + 25 } : { x: h.x - 30, y: h.y + 25 });
    await page.waitForTimeout(400);
    const b1 = await el.boundingBox(); console.log('box', JSON.stringify(b0), '→', JSON.stringify(b1));
    const n = flat(await root()).find((x) => x.id === stack); console.log('stored', JSON.stringify({ w: n.width, h: n.height, minH: n.minHeight, mt: n.marginTop, resp: n.responsive }));
  }
  const before = await page.evaluate(() => localStorage.getItem('educo_box_site_v1'));
  const h = await hb('bottom edge'); console.log(`\n== still tap bottom edge — under it: ${await what(h)}`);
  await fingerDrag(h, h, 1); await page.waitForTimeout(400);
  const after = await page.evaluate(() => localStorage.getItem('educo_box_site_v1'));
  const diff = (a, b, at = '') => { if (JSON.stringify(a) === JSON.stringify(b)) return; if (a && b && typeof a === 'object' && typeof b === 'object') { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diff(a[k], b[k], `${at}.${k}`); return; } console.log('changed', at, JSON.stringify(a), '→', JSON.stringify(b)); };
  if (before !== after) diff(JSON.parse(before), JSON.parse(after)); else console.log('unchanged');
  console.log('selected now', await page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id')));
  await page.waitForTimeout(1500); await browser.close();
})();
