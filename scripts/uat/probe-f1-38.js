// F-1: tier-80 page 38's 92.44 / 7.55 hand-sized lines (text | icon) at Tablet — canvas vs Preview. HEADED, the tree the UI built.
// Probes band i-1p (the FAQ row band inside k-1m).
const fs = require('fs'); const path = require('path'); const H = require('./h.js');
const dump = ([sel, Zsel]) => {
  const band = [...document.querySelectorAll(sel)].find((e) => (e.dataset.boxId || e.className || '').toString().includes('i-1p') && !(e.dataset.boxId || '').endsWith('i-1o'));
  if (!band) return 'no band i-1p';
  const Z = Zsel ? (band.closest('[data-canvas-scale]')?.dataset.canvasScale * 1 || 1) : 1;
  const br = band.getBoundingClientRect(); const c = getComputedStyle(band);
  // Also capture parent (k-1m) for its width
  const parent = band.parentElement; const pc = parent ? getComputedStyle(parent) : null; const pbr = parent ? parent.getBoundingClientRect() : null;
  return {
    parent: parent ? `id:${parent.dataset.boxId||'?'} w${Math.round((pbr?.width||0)/Z)} pad${pc?.paddingLeft}/${pc?.paddingRight} gut${pc?.getPropertyValue('--bx-gut')||'none'}` : 'no parent',
    band: `w${Math.round(br.width/Z)} css-w:${c.width} pad${c.paddingLeft}/${c.paddingRight} ml${c.marginLeft} mr${c.marginRight} maxW${c.maxWidth} gut:${c.getPropertyValue('--bx-gut')||'?'} boxU:${c.getPropertyValue('--box-u')||'?'}`,
    kids: [...band.children].map((k) => { const s = getComputedStyle(k); const r = k.getBoundingClientRect(); return `top${Math.round((r.top-br.top)/Z)} w${Math.round(r.width/Z)} flex(${s.flex}) min${s.minWidth} max${s.maxWidth} ml${s.marginLeft} mr${s.marginRight}`; })
  };
};
(async () => {
  const site = fs.readFileSync(path.join(__dirname, 'dressed-out', 'page-38.site.json'), 'utf8');
  const { browser, page } = await H.open({ headed: true, w: 1520, h: 720 });
  await page.evaluate((s) => localStorage.setItem('educo_box_site_v1', s), site); await page.reload(); await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Tablet (768px)' }).first().click(); await page.waitForTimeout(900);
  console.log('canvas ', JSON.stringify(await page.evaluate(dump, ['[data-box-id]', true])));
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe'); await page.waitForTimeout(1500); await page.keyboard.press('h');
  await page.setViewportSize({ width: 768, height: 720 }); await page.waitForTimeout(500); let f = await (await page.$('iframe')).contentFrame();
  const inner = await f.evaluate(() => document.documentElement.clientWidth); if (inner !== 768) { await page.setViewportSize({ width: 768 + 768 - inner, height: 720 }); await page.waitForTimeout(400); f = await (await page.$('iframe')).contentFrame(); }
  console.log('preview', JSON.stringify(await f.evaluate(dump, ['[class*="bx-"]', false])));
  await browser.close();
})();
