// Z-1 HEADED UAT, the remaining checklist lines — built through the UI (RULE Y):
//   Shift 2 zooms to the selected block · Shift 1 typed inside a text block types "!" · a block held on screen holds at
//   200% · the drop marker is the same size at 50% and 200% · a two-finger pinch zooms (a touch tablet, 1024×768).
const H = require('./h.js');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:3100';
const out = [];
const check = (ok, line, seen) => out.push(`${ok ? 'OK  ' : 'FAIL'} ${line} — ${seen}`);
const zoomOf = (page) => page.evaluate(() => document.querySelector('[data-box-id]').closest('[data-canvas-scale]')?.dataset.canvasScale * 1);
const pick = async (page, label) => { await page.getByRole('group', { name: 'Canvas zoom' }).locator('button').nth(1).click(); await page.getByRole('option', { name: label }).first().click(); await page.waitForTimeout(350); };

(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 900, pos: [1000, 420] });
  try {
    await H.panel(page, true);
    const before = await page.evaluate(() => Array.from(document.querySelectorAll('[data-box-id]')).map((e) => e.getAttribute('data-box-id')));
    await H.clickTile(page, 'Heading');
    const heading = (await H.leaves(page)).map((l) => l.id).find((id) => !before.includes(id));
    for (let i = 0; i < 16; i++) await H.clickTile(page, 'Text');
    await page.locator('button[title="Wide (1920px)"]').first().click(); await page.waitForTimeout(500);
    const scb = await page.locator('[data-canvas-scroller]').boundingBox();

    // The drop marker while a tile is carried over the page, at 50% and at 200% (it is drawn on the page, outside the zoom).
    // THE DROP LINE while a Text tile is carried to the heading — through `H.dropTile`, the drag every working probe uses
    // (L2-m: a hand-made drag here lost its dragover events part-way, at the old build too, so the line never appeared and
    // the stuck drag then swallowed Shift 2). An observer records the glowing line's thickness each time it is drawn.
    const marker = async () => {
      await page.evaluate(() => { window.__lines = []; window.__lineObs?.disconnect(); window.__lineObs = new MutationObserver(() => {
        for (const c of document.body.children) if (c.getAttribute('aria-hidden') === 'true' && /shadow-\[0_0_10px/.test(c.className)) { const r = c.getBoundingClientRect(); window.__lines.push(Math.round(Math.min(r.width, r.height))); } });
        window.__lineObs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] }); });
      const target = await page.locator(`[data-box-id="${heading}"]`).boundingBox();
      const x = Math.max(target.x, scb.x + 360) + 40, y = Math.min(Math.max(target.y + target.height - 3, scb.y + 12), scb.y + scb.height - 12); // inside the visible canvas
      await H.dropTile(page, 'Text', Math.round(x), Math.round(y)).catch(() => {});
      const seen = await page.evaluate(() => { window.__lineObs.disconnect(); return window.__lines; });
      return seen.length ? { h: Math.min(...seen), samples: seen.length } : null;
    };
    // the heading brought into view AFTER each zoom (L2-m): scrolled first, the zoom round the view's middle moved it away
    // — at 200% the probe aimed at (−376, −1082), off screen, and at 50% under the toolbar
    const centre = () => page.locator(`[data-box-id="${heading}"]`).evaluate((e) => e.scrollIntoView({ block: 'center', inline: 'center' }));
    await pick(page, '50%'); await centre(); await page.waitForTimeout(300); const m50 = await marker();
    await pick(page, '200%'); await centre(); await page.waitForTimeout(300); const m200 = await marker();
    check(m50 && m200 && Math.abs(m50.h - m200.h) <= 2, '(5) the drop line is the same thickness at 50% and 200%', `${JSON.stringify(m50)} · ${JSON.stringify(m200)}`);
    await H.panel(page, false);

    // Shift 2: the selected heading fills the view.
    await pick(page, /^Fit/);
    await H.select(page, heading);
    // …then out of its WORDS (L2-m): the select click landed on the heading's text and put a caret there, so Shift 2 typed
    // "@" into it — right, keys typed into text never zoom (Z-1). A person presses Escape, which leaves the words and keeps
    // the block selected (#87), then Shift 2.
    if (await page.evaluate(() => document.activeElement?.isContentEditable)) { await page.keyboard.press('Escape'); await page.waitForTimeout(200); }
    await page.mouse.move(scb.x + 600, scb.y + 400);
    console.log('  before Shift 2: focus ' + await page.evaluate(() => { const a = document.activeElement; window.__k2 = []; addEventListener('keydown', (e) => window.__k2.push(`${e.key} prevented=${e.defaultPrevented} on <${e.target.tagName.toLowerCase()}${e.target.getAttribute('aria-label') ? `[${e.target.getAttribute('aria-label')}]` : ''}>`)); return `${a.tagName.toLowerCase()}${a.getAttribute('aria-label') ? `[${a.getAttribute('aria-label')}]` : ''}${a.getAttribute('role') ? ` role=${a.getAttribute('role')}` : ''}`; }) + ` in block ${await page.evaluate(() => document.activeElement.closest('[data-box-id]')?.getAttribute('data-box-id')?.slice(-4))} · selected ${(await H.selected(page))?.slice(-4)} · heading ${heading.slice(-4)}`);
    await page.keyboard.press('Shift+Digit2'); await page.waitForTimeout(500);
    console.log('  keys: ' + JSON.stringify(await page.evaluate(() => window.__k2)));
    const hb = await page.locator(`[data-box-id="${heading}"]`).boundingBox();
    const z2 = await zoomOf(page);
    check(z2 > 1 && hb.x >= scb.x - 2 && hb.x + hb.width <= scb.x + scb.width + 2 && hb.width > scb.width * 0.5, '(2) Shift 2 zooms to the selected block, in view', `zoom ${z2.toFixed(2)} · heading ${Math.round(hb.width)}px wide at x ${Math.round(hb.x)} in a ${Math.round(scb.width)}px view`);

    // Shift 1 typed inside a text block types "!" and does not zoom.
    const zBefore = await zoomOf(page);
    const p = page.locator('[data-box-id] p').first(); await p.evaluate((e) => e.scrollIntoView({ block: 'center', inline: 'center' }));
    await p.dblclick(); await page.waitForTimeout(300); await page.keyboard.press('End'); await page.keyboard.press('Shift+Digit1'); await page.waitForTimeout(250);
    const typed = await page.evaluate(() => document.activeElement?.textContent || '');
    check(typed.trim().endsWith('!') && Math.abs((await zoomOf(page)) - zBefore) < 0.001, '(2) Shift 1 in a text block types "!" and nothing zooms', `${JSON.stringify(typed.slice(-8))} · zoom ${zBefore.toFixed(2)} → ${(await zoomOf(page)).toFixed(2)}`);
    await page.keyboard.press('Escape'); await page.mouse.click(scb.x + 5, scb.y + scb.height - 5);

    // A block held on screen holds at 200% (Z1-a at a zoom the user chose).
    await pick(page, '200%');
    await H.select(page, heading);
    await page.getByRole('button', { name: 'Floating', exact: true }).click(); await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Floats on screen option' }).click(); await page.waitForTimeout(500);
    const held = await page.evaluate(async (id) => { const el = document.querySelector(`[data-box-id="${id}"]`), sc = document.querySelector('[data-canvas-scroller]'); sc.scrollTop = 150; await new Promise((r) => setTimeout(r, 350)); const a = el.getBoundingClientRect().top; sc.scrollTop = 550; await new Promise((r) => setTimeout(r, 350)); return { travelled: Math.round(a - el.getBoundingClientRect().top), scrolled: Math.round(sc.scrollTop - 150) }; }, heading);
    check(held.scrolled > 250 && Math.abs(held.travelled) < 6, '(7) a block held on screen holds at 200%', `travelled ${held.travelled}px over a ${held.scrolled}px scroll`);
    check(errs.length === 0, 'no page errors', errs.slice(0, 2).join(' | ') || '0');
  } catch (e) { out.push(`FAIL crashed — ${e.message.split('\n')[0]}`); } finally { await browser.close(); }

  // A two-finger pinch on a touch tablet (1024×768): fingers apart zoom in.
  const tb = await chromium.launch({ headless: false, args: ['--window-position=1000,0'] });
  const ctx = await tb.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: false });
  const tp = await ctx.newPage();
  try {
    await tp.goto(BASE + '/website/box-demo'); await tp.waitForTimeout(4500);
    const sc = await tp.locator('[data-canvas-scroller]').boundingBox();
    const z0 = await zoomOf(tp);
    const cdp = await ctx.newCDPSession(tp);
    const cx = sc.x + sc.width / 2, cy = sc.y + 250;
    const tps = (d) => [{ x: cx - d, y: cy, id: 1 }, { x: cx + d, y: cy, id: 2 }];
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: tps(40) });
    for (let d = 40; d <= 120; d += 10) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: tps(d) }); await tp.waitForTimeout(30); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await tp.waitForTimeout(400);
    const z1 = await zoomOf(tp);
    check(z1 > z0 * 1.5, '(3) a two-finger pinch zooms in on a touch tablet', `${z0} → ${z1}`);
  } catch (e) { out.push(`FAIL pinch crashed — ${e.message.split('\n')[0]}`); } finally { await tb.close(); }
  console.log(`== extra: ${out.filter((l) => l.startsWith('OK')).length} OK, ${out.filter((l) => l.startsWith('FAIL')).length} FAIL`);
  for (const l of out) console.log('  ' + l);
})();
