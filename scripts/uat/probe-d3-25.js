// D3-25 probe: two stacks side by side with words, the left one dragged wider, the right one hidden on the phone — at the
// Mobile chip, is the left stack's text as wide as its stack? Built through the UI (RULE Y), three runs in parallel.
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
async function run(i) {
  const { browser, page } = await H.open({ headed: true, w: 1280, h: 800, pos: [i * 420, 0] });
  try {
    await H.panel(page, true);
    const a = await P.first(page, 'Stack'); const at = await P.into(page, a, 'Text'); const b = await P.beside(page, a, 'Stack'); await P.into(page, b, 'Text');
    await H.panel(page, false); await I.text(page, at, 'Words on the left');
    await H.select(page, a); await H.dragEdge(page, 'right', 140);
    const m = async (when) => page.evaluate(([a, at, when]) => { const r = (id) => document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); return `${when}: stack ${Math.round(r(a).width)} · text ${Math.round(r(at).width)}×${Math.round(r(at).height)}`; }, [a, at, when]);
    const out = [await m('desktop')];
    await page.getByRole('button', { name: 'Mobile (375px)' }).first().click(); await page.waitForTimeout(700); out.push(await m('mobile, both shown'));
    await H.select(page, b); await I.tab(page, 'Per-device'); await page.getByLabel(/Hidden on (mobile|phone)/i).first().check(); await page.waitForTimeout(500);
    out.push(await m('mobile, right hidden'));
    await page.reload(); await page.waitForTimeout(1500); await page.getByRole('button', { name: 'Mobile (375px)' }).first().click(); await page.waitForTimeout(700); out.push(await m('after reload'));
    const st = await page.evaluate((at) => { const f = (n) => n.id === at ? n : (n.children || []).map(f).find(Boolean); const n = f(JSON.parse(localStorage.getItem('educo_box_site_v1')).pages[0].root); return JSON.stringify({ width: n.width, mobile: n.mobile, responsive: n.responsive }); }, at);
    out.push('stored text: ' + st);
    await page.screenshot({ path: `scripts/uat/logs/d3-25-${i}.png` });
    return out.join('\n  ');
  } finally { await browser.close(); }
}
Promise.all([0, 1, 2].map(run)).then((r) => r.forEach((x, i) => console.log(`run ${i}:\n  ${x}`)));
