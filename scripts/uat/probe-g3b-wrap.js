// PROBE G3b-6: two stacks, widen the first until the neighbour wraps, narrow by 60 — what is STORED, and what is drawn? (headed)
const H = require('./h.js'); const P = require('./pages.js').helpers;
const KEY = 'educo_box_site_v1';
const dump = async (page, a, b, what) => {
  const st = await page.evaluate(([k, a, b]) => { const f = (n, id) => n.id === id ? n : (n.children || []).map((c) => f(c, id)).find(Boolean); const r = JSON.parse(localStorage.getItem(k)).pages[0].root; const pick = (n) => ({ width: n.width, restWidth: n.restWidth, wrapBy: n.wrapBy, widthByHand: n.widthByHand, empty: !(n.children || []).length, mlp: n.marginLeftPct }); return [pick(f(r, a)), pick(f(r, b))]; }, [KEY, a, b]);
  const dr = await page.evaluate(([a, b]) => [a, b].map((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); const q = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { l: Math.round(q.left), w: Math.round(q.width), t: Math.round(q.top), minW: cs.minWidth, gc: cs.gridColumnEnd }; }), [a, b]);
  console.log(what, JSON.stringify(st), JSON.stringify(dr));
};
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1600, h: 1000, pos: [0, 0] });
  await H.panel(page, true); const a = await P.first(page, 'Stack'); const b = await P.beside(page, a, 'Stack'); await H.panel(page, false);
  await H.select(page, a); await dump(page, a, b, 'start ');
  const drag = async (dx) => { const h = await H.handleOf(page, 'right'); const cx = h.x + h.width / 2, cy = h.y + h.height / 2; await page.mouse.move(cx, cy); await page.mouse.down(); for (let i = 1; i <= 12; i++) { await page.mouse.move(cx + (dx * i) / 12, cy); await page.waitForTimeout(12); } await page.mouse.up(); await page.waitForTimeout(500); };
  await drag(400); await dump(page, a, b, '+400  '); await drag(400); await dump(page, a, b, '+800  ');
  for (let i = 1; i <= 3; i++) { await drag(-60); await dump(page, a, b, `-60 #${i}`); }
  await browser.close();
})();
