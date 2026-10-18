// PROBE — LE14-2 … 5 reproduced THROUGH THE UI (RULE Y): a Heading, a Heading and a Text from the palette, each in its band,
// both picked by a marquee, Ctrl+G, then Ctrl+Shift+G. localStorage only READ.
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/probe-le14-group.js
const path = require('path'); const fs = require('fs');
const H = require('./h.js');
const { sleep, band, nodeOf, parentOf } = require('./uat-rx3-headed.js');
const OUT = path.join(__dirname, 'logs', 'le14'); fs.mkdirSync(OUT, { recursive: true });
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') }).catch(() => {});
const brief = (n) => n && { id: n.id.slice(-4), type: n.type, layout: n.layout, group: n.group, position: n.position, width: n.width, gap: n.gap, kids: (n.children || []).map((c) => c.id.slice(-4)) };

(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1366, h: 860 });
  try {
    // two Headings and a Text, each on the page in its own band (the reading order: h1, h2, the Text)
    const h1 = await band(page, 'Heading'); const h2 = await band(page, 'Heading'); const tx = await band(page, 'Text');
    await H.panel(page, false); const st = (await parentOf(page, h1)).id; const rootId = (await parentOf(page, st)).id; const order = async () => { const r = await nodeOf(page, rootId); const ids = []; const w = (n) => { if (n.type !== 'container') ids.push(n.id === h1 ? 'h1' : n.id === h2 ? 'h2' : n.id === tx ? 'text' : n.type); else if (n.group) ids.push(`[group ${n.position || 'in flow'} gap ${n.gap}`); (n.children || []).forEach(w); }; w(r); return ids.join(' · '); };
    console.log('READING ORDER before', await order());
    const stParent = await parentOf(page, st);
    console.log('BEFORE stack', JSON.stringify(brief(await nodeOf(page, st))), 'in', stParent.id.slice(-4));
    console.log('BEFORE h1', JSON.stringify(brief(await nodeOf(page, h1))), 'parent', (await parentOf(page, h1)).id.slice(-4));
    console.log('BEFORE h2', JSON.stringify(brief(await nodeOf(page, h2))), 'parent', (await parentOf(page, h2)).id.slice(-4));
    await shot(page, 'probe-1-before');
        const r1 = await page.locator(`[data-box-id="${h1}"]`).boundingBox(), r2 = await page.locator(`[data-box-id="${h2}"]`).boundingBox();
    const pg = await page.locator('[data-box-id]').first().boundingBox();
    // from the room on the RIGHT of the page (the top left holds the blocks button) to just left of the Headings
    const x0 = pg.x + pg.width + 16, y0 = r1.y - 4, x1 = Math.min(r1.x, r2.x) - 4, y1 = r2.y + r2.height + 2;
    await page.keyboard.press('Escape');
    await page.mouse.move(x0, y0); await page.mouse.down(); await page.mouse.move((x0 + x1) / 2, (y0 + y1) / 2, { steps: 8 }); await page.mouse.move(x1, y1, { steps: 8 }); await page.mouse.up(); await sleep(page, 500);
    const sel = await page.evaluate(() => Array.from(document.querySelectorAll('.outline-indigo-500')).map((e) => e.getAttribute('data-box-id')).filter(Boolean));
    console.log('MARQUEE selected', sel.map((x) => x.slice(-4)), 'bulk inspector', await page.getByRole('button', { name: /Group these/ }).count());
    await shot(page, 'probe-2-marquee');
    await page.keyboard.press('Control+g'); await sleep(page, 800);
    await shot(page, 'probe-3-grouped');
    let g = await parentOf(page, h1); while (g && !g.group) g = await parentOf(page, g.id);
    console.log('GROUP', JSON.stringify(brief(g)), 'in', (await parentOf(page, g.id))?.id.slice(-4), '(the stack was', st.slice(-4) + ')');
    console.log('AFTER h1', JSON.stringify(brief(await nodeOf(page, h1))), 'AFTER h2', JSON.stringify(brief(await nodeOf(page, h2))));
    console.log('READING ORDER grouped', await order());
    await H.select(page, g.id); await page.keyboard.press('Control+Shift+g'); await sleep(page, 800);
    await shot(page, 'probe-4-ungrouped');
    console.log('UNGROUP h1 parent', (await parentOf(page, h1))?.id.slice(-4), JSON.stringify(brief(await nodeOf(page, h1))));
    console.log('UNGROUP h2 parent', (await parentOf(page, h2))?.id.slice(-4), JSON.stringify(brief(await nodeOf(page, h2))));
    console.log('READING ORDER ungrouped', await order());
  } catch (e) { console.log('ERROR', e.message.split('\n')[0]); await shot(page, 'probe-ERR'); }
  console.log('console', errs.join(' | ') || 'no errors');
  await browser.close();
})();
