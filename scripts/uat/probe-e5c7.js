// PROBE E5c-7: a floating Heading dragged above the page's top edge (the first band) — what the Preview shows: is any of it cut off?
const E = require('./uat-e5b-headed.js');
const [W, H, TOUCH] = (process.argv[2] || '1280x800x0').split('x').map(Number);
(async () => {
  const { browser, page } = await E.open(W, H, 0, false, !!TOUCH);
  const ids = await E.build(page);
  await E.U1float(page, (w, p, d) => console.log(p ? 'SAW ' : 'FAIL', w, d || ''), `${W}`, ids);
  const n = E.flat(await E.stored(page)).find((x) => x.id === ids.head);
  console.log('stored', JSON.stringify({ left: n.left, top: n.top, r: n.responsive }));
  await E.press(page, page.getByRole('button', { name: 'Preview', exact: true }).first()); await page.waitForSelector('iframe'); await page.waitForTimeout(1500);
  const f = await (await page.$('iframe')).contentFrame();
  const r = await f.evaluate(() => { const h = [...document.querySelectorAll('h1,h2,h3')].find((e) => /New heading/.test(e.textContent)); const b = h.getBoundingClientRect(); return { top: b.top + scrollY, bottom: b.bottom + scrollY, docTop: 0 }; });
  console.log('preview heading', JSON.stringify(r), r.top < 0 ? 'CUT OFF ABOVE THE PAGE' : 'whole');
  await page.screenshot({ path: `scripts/uat/logs/probe-e5c7-${W}.png` });
  await browser.close();
})();
