// PROBE — U3's canvas with the panel closed: do the heading, the Yoruba paragraph and a third Text (set to Lora) overlap?
const H = require('./h.js'); const I = require('./inspector.js'); const path = require('path');
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1536, h: 864 });
  const sel = () => page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id'));
  const add = async (t) => { await H.panel(page, true); await H.clickTile(page, t); await H.panel(page, false); return sel(); };
  const h = await add('Heading'), t = await add('Text'); await I.text(page, t, 'Ẹ kú àárọ̀ ọmọ ṣe. Ụlọ akwụkwọ ị. Ɓarka ɗa ƙ. Ɛte sɛn ɔ ŋ?'); await I.text(page, h, 'Ẹ káàbọ̀ — Ɓarka — Ɛyɛ');
  const t2 = await add('Text'); await I.text(page, t2, 'Mine is Lora.');
  await page.mouse.click(700, 600); await page.waitForTimeout(500);
  const r = await page.evaluate((ids) => ids.map((id) => { const b = document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)]; }), [h, t, t2]);
  const hit = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
  console.log(JSON.stringify({ rects: r, overlap: [hit(r[0], r[1]), hit(r[0], r[2]), hit(r[1], r[2])] }));
  await page.screenshot({ path: path.join(__dirname, 'logs', 'a1b-probe', 'overlap.png') }); await browser.close();
})();
