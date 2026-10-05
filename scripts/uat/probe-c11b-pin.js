// c-11b PINNED (RULE Y: reproduced through the UI first — `logs/c11b-debug.out`, the dresser's own drags): page 359's saved
// site with its 4-column row put back to the widths it had BEFORE the third drag (42.71 · 41.62 · 15.68 · 25.02, from the
// DEBUG log), then the third column's right edge dragged -51px through the UI at Desktop, as the dresser did. Prints the
// stored row and its sum. NODE_PATH=node_modules BASE=… node scripts/uat/probe-c11b-pin.js [--dx=-51]
const fs = require('fs'); const H = require('./h.js');
const DX = +(process.argv.find((x) => x.startsWith('--dx=')) || '--dx=-51').slice(5);
(async () => {
  const site = JSON.parse(fs.readFileSync('scripts/uat/dressed99-out/page-359.final.site.json', 'utf8'));
  let row = null; const find = (n) => { if (!n || typeof n !== 'object' || row) return; if (n.rowBand && (n.children || []).length === 4 && /42\.7/.test(n.children[0].width || '') && /41\.6/.test(n.children[1].width || '')) { row = n; return; } (n.children || []).forEach(find); };
  site.pages.forEach((p) => find(p.root));
  if (!row) { console.log('no row'); return; }
  const W = ['42.71%', '41.62%', '15.68%', '25.02%'];
  row.children.forEach((c, i) => { c.width = W[i]; c.widthByHand = true; delete c.restWidth; delete c.restAt; delete c.restBy; });
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 900 });
  await page.evaluate((s) => localStorage.setItem('educo_box_site_v1', s), JSON.stringify(site)); await page.reload(); await page.waitForTimeout(3000);
  await page.getByRole('button', { name: /^Desktop/ }).first().click(); await page.waitForTimeout(900);
  const third = row.children[2].id;
  await page.locator(`[data-box-id="${third}"]`).scrollIntoViewIfNeeded();
  await H.select(page, third); await H.dragEdge(page, 'right', DX); await page.waitForTimeout(600);
  const stored = await page.evaluate((ids) => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const w = {}; const walk = (n) => { if (!n || typeof n !== 'object') return; if (ids.includes(n.id)) w[n.id] = n.width; for (const v of Object.values(n)) { if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') walk(v); } }; walk(s); return ids.map((id) => w[id]); }, row.children.map((c) => c.id));
  const sum = stored.reduce((t, w) => t + (parseFloat(w) || 0), 0);
  console.log(`${process.env.BASE} dx ${DX}: ${stored.join(' + ')} = ${sum.toFixed(2)}%${sum > 100.001 ? '  ← OVER 100' : ''}${errs.length ? ' · errors ' + errs.join(' | ') : ''}`);
  await browser.close();
})();
