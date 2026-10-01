// Z1-a · DOES A BLOCK HELD ON SCREEN STAY PUT WHEN THE CANVAS IS FITTED BELOW 100%?
// Built through the UI (RULE Y): a Stack and a column of Text blocks to make the page tall, the Stack set to Floating →
// "Floats on screen", then the device chosen (each window its own size) and the canvas scrolled 100 → 500px.
// Usage: NODE_PATH=node_modules node scripts/uat/probe-z1a.js --device="Wide (1920px)" --slot=0
const H = require('./h.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
const DEVICE = arg('device', 'Full width'), slot = +arg('slot', 0);

(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 900, pos: [(slot % 3) * 500, Math.floor(slot / 3) * 420] });
  try {
    await H.panel(page, true);
    const ids = () => page.evaluate(() => Array.from(document.querySelectorAll('[data-box-id]')).map((e) => e.getAttribute('data-box-id')));
    const before = await ids();
    await H.clickTile(page, 'Text');
    // The new Text is the block that holds: real words in it, so a click on it is not taken by an empty box's "+".
    const target = (await H.leaves(page)).map((l) => l.id).find((id) => !before.includes(id));
    for (let i = 0; i < 60; i++) await H.clickTile(page, 'Text');
    await H.panel(page, false);
    await H.select(page, target);
    await page.getByRole('button', { name: 'Floating', exact: true }).click(); await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Floats on screen option' }).click(); await page.waitForTimeout(500);
    await page.locator(`button[title="${DEVICE}"]`).first().click(); await page.waitForTimeout(900);
    const r = await page.evaluate(async (id) => {
      const el = document.querySelector(`[data-box-id="${id}"]`);
      const sc = document.querySelector('[data-canvas-scroller]');
      const frame = el.closest('[style*="container-type"]');
      const top = () => el.getBoundingClientRect().top;
      sc.scrollTop = 100; await new Promise((res) => setTimeout(res, 400)); const before = top(), s1 = sc.scrollTop;
      sc.scrollTop = 500; await new Promise((res) => setTimeout(res, 400)); const after = top(), s2 = sc.scrollTop;
      return { zoom: el.closest('[data-canvas-scale]')?.dataset.canvasScale * 1 ?? (frame && frame.style.zoom), scrolled: Math.round(s2 - s1), travelled: Math.round(before - after), pos: getComputedStyle(el).position };
    }, target);
    await page.screenshot({ path: require('path').join(__dirname, `probe-z1a-${DEVICE.replace(/\W+/g, '')}.png`) });
    const ok = r.scrolled > 250 && Math.abs(r.travelled) < 6;
    // On a phone a floating block goes back into the flow by design (`floatStacksOnMobile`) — not held, and not a drift.
    const verdict = r.pos === 'relative' ? 'IN THE FLOW (phone rule)' : ok ? 'HOLDS' : 'DRIFTS';
    console.log(`${verdict} · ${DEVICE} · zoom ${r.zoom} · scrolled ${r.scrolled}px · the held block travelled ${r.travelled}px · ${r.pos} · ${errs.length} page errors`);
  } catch (e) { console.log(`FAILED · ${DEVICE} · ${e.message.split('\n')[0]} (step: ${page.__step || '?'})`); }
  finally { await browser.close(); }
})();
