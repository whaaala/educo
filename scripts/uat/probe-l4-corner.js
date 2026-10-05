// HEADED PROBE (RULE Y) for L4-l — a Heading's TOP-RIGHT CORNER dragged (-30, -20) and back leaves it taller. Built through
// the UI at Desktop in a 1240 window (a scaled canvas, where L-4's pass found it); after each gesture: the drawn rect and
// what the drag STORED on the heading (read from the saved tree, never written).
//   NODE_PATH=node_modules node scripts/uat/probe-l4-corner.js [--corner="top-right"] [--dx=-30] [--dy=-20] [--pos=0,0]
const H = require('./h.js'); const P = require('./pages.js').helpers;
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const CORNER = arg('corner', 'top-right'); const DX = +arg('dx', -30), DY = +arg('dy', -20); const POS = arg('pos', '0,0').split(',').map(Number);
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1240, h: 820, pos: POS }); page.setDefaultTimeout(15000);
  try {
    await H.panel(page, true); const sec = await P.first(page, 'Stack'); const head = await P.into(page, sec, 'Heading'); await P.under(page, head, 'Text');
    await H.panel(page, false); await page.getByRole('button', { name: 'Desktop (1280px)' }).first().click(); await page.waitForTimeout(700); await H.select(page, head);
    const state = async (tag) => { const r = await page.evaluate((id) => { const b = document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); let n = null; const walk = (x) => { if (x.id === id) n = x; (x.children || []).forEach(walk); }; walk(s.pages[0].root); const { id: _i, text: _t, ...rest } = n; return { rect: [b.left, b.top, b.width, b.height].map(Math.round), stored: rest }; }, head); console.log(tag.padEnd(8), JSON.stringify(r)); return r; };
    const label = `Resize ${CORNER} corner`;
    const r0 = await state('start');
    const h = await page.locator(`[aria-label="${label}"]`).first().boundingBox(); const cx = h.x + h.width / 2, cy = h.y + h.height / 2;
    for (const [x, y, tag] of [[DX, DY, 'out'], [0, 0, 'back']]) {
      const s = await page.locator(`[aria-label="${label}"]`).first().boundingBox(); const sx = s.x + s.width / 2, sy = s.y + s.height / 2;
      await page.mouse.move(sx, sy); await page.mouse.down();
      for (let i = 1; i <= 10; i++) { await page.mouse.move(sx + ((cx + x - sx) * i) / 10, sy + ((cy + y - sy) * i) / 10); await page.waitForTimeout(15); }
      await page.mouse.up(); await page.waitForTimeout(500); await state(tag);
    }
    const r2 = await state('end');
    console.log(`RESULT ${CORNER} (${DX},${DY}): ${r2.rect.map((v, i) => v - r0.rect[i]).join(',')} · page errors ${errs.length}`);
    await page.screenshot({ path: `scripts/uat/logs/uat-l4/corner-${CORNER}.png` });
  } catch (e) { console.log('FAILED', page.__step, e.message.split('\n')[0]); }
  await browser.close();
})();
