// Z1-b · DOES AN ITEM'S SELECTION RING AND TOOLBAR SIT ON THE ITEM WHEN THE CANVAS IS FITTED BELOW 100%?
// Built through the UI (RULE Y): an Accordion from the palette, the device chosen, the block selected, an item clicked;
// the ring (ItemCrudLayer) is compared with the item it outlines.
// Usage: NODE_PATH=node_modules node scripts/uat/probe-z1b.js --device="Wide (1920px)" --slot=0
const H = require('./h.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
const DEVICE = arg('device', 'Full width'), slot = +arg('slot', 0);

(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 900, pos: [(slot % 3) * 500, Math.floor(slot / 3) * 420] });
  try {
    await H.panel(page, true);
    await H.clickTile(page, 'Accordion');
    await H.panel(page, false);
    await page.locator(`button[title="${DEVICE}"]`).first().click(); await page.waitForTimeout(900);
    // A person clicks the block, then the item they want (a second click goes inside).
    const item = page.locator('[data-eu-item]').nth(1);
    await item.scrollIntoViewIfNeeded();
    for (let i = 0; i < 3; i++) { await item.click({ position: { x: 30, y: 12 } }); await page.waitForTimeout(400); if (await page.getByRole('toolbar', { name: 'Edit this item' }).count()) break; }
    const r = await page.evaluate(() => {
      const ring = document.querySelector('div.ring-indigo-500\\/60');
      const bar = document.querySelector('[role="toolbar"][aria-label="Edit this item"]');
      const items = Array.from(document.querySelectorAll('[data-eu-item]'));
      if (!ring) return { none: true };
      const a = ring.getBoundingClientRect();
      // The item it outlines: the one whose box overlaps the ring most — or, if it is drawn elsewhere, the nearest.
      const b = items.map((e) => e.getBoundingClientRect()).sort((p, q) => (Math.abs(p.top - a.top) + Math.abs(p.left - a.left)) - (Math.abs(q.top - a.top) + Math.abs(q.left - a.left)))[0];
      const target = items[1].getBoundingClientRect();
      const t = bar ? bar.getBoundingClientRect() : null;
      return { zoom: items[1].currentCSSZoom, dTop: Math.round(a.top - target.top), dLeft: Math.round(a.left - target.left), dW: Math.round(a.width - target.width), dH: Math.round(a.height - target.height), barGap: t ? Math.round(t.left - target.right) : null, near: !!b };
    });
    await page.screenshot({ path: require('path').join(__dirname, `probe-z1b-${DEVICE.replace(/\W+/g, '')}.png`) });
    if (r.none) { console.log(`NO RING · ${DEVICE} · the item was not selected`); return; }
    const ok = Math.abs(r.dTop) <= 3 && Math.abs(r.dLeft) <= 3 && Math.abs(r.dW) <= 3 && Math.abs(r.dH) <= 3;
    console.log(`${ok ? 'ON THE ITEM' : 'OFF THE ITEM'} · ${DEVICE} · zoom ${r.zoom} · ring vs item: top ${r.dTop} left ${r.dLeft} width ${r.dW} height ${r.dH}px · toolbar ${r.barGap}px right of the item · ${errs.length} page errors`);
  } catch (e) { console.log(`FAILED · ${DEVICE} · ${e.message.split('\n')[0]}`); }
  finally { await browser.close(); }
})();
