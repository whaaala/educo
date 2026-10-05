// G3b-28 · PROBE (through the UI, headed): slice B's order — an Alt drag at Desktop, then a plain snapped drag at Full width — logging
// the stored width / free margin and where the gap lands, step by step. Two windows: with and without the Alt drag first.
const H = require('./h.js'); const P = require('./pages.js').helpers;
const chip = async (page, name) => { await page.getByRole('button', { name }).first().click(); await page.waitForTimeout(700); };
const rectOf = (page, id) => page.evaluate((id) => { const r = document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); return { l: r.left, r: r.right }; }, id);
const lines = (page) => page.evaluate(() => { const c = [...document.querySelectorAll('[data-guide-col]')].map((x) => x.getBoundingClientRect()); return [...c.map((q) => q.left), c[c.length - 1].right]; });
const stored = (page, id) => page.evaluate((id) => { const f = (n) => [n, ...(n.children || []).flatMap(f)]; const n = f(JSON.parse(localStorage.getItem('educo_box_site_v1')).pages[0].root).find((x) => x.id === id); return JSON.stringify({ w: n.width, fi: n.freeInset, r: n.responsive }); }, id);
async function drag(page, x0, y0, x1, mods) { for (const m of mods) await page.keyboard.down(m); await page.mouse.move(x0, y0); await page.mouse.down(); for (let i = 1; i <= 14; i++) { await page.mouse.move(x0 + ((x1 - x0) * i) / 14, y0); await page.waitForTimeout(15); } await page.mouse.up(); for (const m of mods) await page.keyboard.up(m); await page.waitForTimeout(600); }
(async () => {
  await Promise.all([true, false].map(async (altFirst, i) => {
    const { browser, page } = await H.open({ headed: true, w: 1240, h: 820, pos: [i * 640, 0] }); const log = (m) => console.log(`[${altFirst ? 'Alt first' : 'no Alt'}] ${m}`);
    await H.panel(page, true); const a = await P.first(page, 'Stack'); await P.into(page, a, 'Text'); const b = await P.beside(page, a, 'Stack'); await P.into(page, b, 'Image'); await H.panel(page, false);
    await page.getByRole('button', { name: 'Layout guides', exact: true }).first().click(); await page.keyboard.press('Escape');
    if (altFirst) { await chip(page, 'Desktop (1280px)'); await H.select(page, a); const h = await H.handleOf(page, 'right'); const ls = await lines(page); await drag(page, h.x + h.width / 2, h.y + h.height / 2, ls[5] + 0.3 * (ls[6] - ls[5]), ['Alt']); log('after Alt at Desktop: ' + await stored(page, a)); }
    await chip(page, 'Full width'); await H.select(page, a);
    let ls = await lines(page); const r0 = await rectOf(page, a), b0 = await rectOf(page, b); const h = await H.handleOf(page, 'right'); const cx = h.x + h.width / 2;
    log(`Full before: box ${r0.l.toFixed(1)}…${r0.r.toFixed(1)} · b ${b0.l.toFixed(1)} · handle ${cx.toFixed(1)} · lines ${ls.slice(3, 8).map((v) => v.toFixed(1)).join(' ')} · ${await stored(page, a)}`);
    const target = ls[5] + 0.3 * (ls[6] - ls[5]) + (b0.l - r0.r) / 2;
    await drag(page, cx, h.y + h.height / 2, target, []);
    ls = await lines(page); const r1 = await rectOf(page, a), b1 = await rectOf(page, b);
    log(`Full after plain drag to ${target.toFixed(1)}: box ${r1.l.toFixed(1)}…${r1.r.toFixed(1)} · b ${b1.l.toFixed(1)} · gap mid ${((r1.r + b1.l) / 2).toFixed(1)} vs line 5 ${ls[5].toFixed(1)} · ${await stored(page, a)}`);
    await browser.close();
  }));
})();
