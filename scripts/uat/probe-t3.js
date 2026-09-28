// HEADED PROBE (RULE Y — built through the UI): SELECTION that the sweep could not make.
//   A · a column holding a Card: click the card's words, then Escape, Escape — does the selection step out to the column?
//   B · a grid cell holding a grid: click a nested cell three times — does each click go one level deeper?
// Prints what is selected and what holds the focus after every step.   NODE_PATH=node_modules node scripts/uat/probe-t3.js
const fs = require('fs'); const path = require('path');
const H = require('./h.js'); const P = require('./pages.js').helpers;
const OUT = path.join(__dirname, 'probe-t3-out'); fs.mkdirSync(OUT, { recursive: true });
const state = (page) => page.evaluate(() => ({ selected: document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id')?.slice(-4) ?? null, focus: (() => { const a = document.activeElement; return a ? `${a.tagName}${a.isContentEditable ? ' editable' : ''}${a.closest('[data-box-id]') ? ' in ' + a.closest('[data-box-id]').getAttribute('data-box-id').slice(-4) : ''}` : null; })() }));
const clickIn = async (page, id, fx, fy) => { const b = await page.locator(`[data-box-id="${id}"]`).boundingBox(); await page.mouse.click(b.x + b.width * fx, b.y + b.height * fy); await page.waitForTimeout(300); };

(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1520, h: 720, pos: [0, 0] });
  page.setDefaultTimeout(10000); const R = { A: [], B: [] };
  try {
    await H.panel(page, true);
    // A — a row of two columns, a Card in each (the crawl's "cards" row, as build-page makes it)
    const sec = await P.first(page, 'Stack');
    const col = await P.into(page, sec, 'Stack'); const col2 = await P.beside(page, col, 'Stack');
    const card = await P.into(page, col, 'Card'); await P.into(page, col2, 'Card');
    await H.panel(page, false);
    await page.mouse.click(10, 400); await page.waitForTimeout(200); // nothing selected
    R.A.push({ step: 'start', ...(await state(page)) });
    await clickIn(page, card, 0.5, 0.75); R.A.push({ step: 'click card words', ...(await state(page)) });
    await clickIn(page, card, 0.5, 0.75); R.A.push({ step: 'click again', ...(await state(page)) });
    await page.keyboard.press('Escape'); await page.waitForTimeout(200); R.A.push({ step: 'Escape', ...(await state(page)) });
    await page.keyboard.press('Escape'); await page.waitForTimeout(200); R.A.push({ step: 'Escape', ...(await state(page)) });
    await page.keyboard.press('Escape'); await page.waitForTimeout(200); R.A.push({ step: 'Escape', ...(await state(page)) });
    R.A.push({ want: { column: col.slice(-4), card: card.slice(-4) } });
    await page.screenshot({ path: path.join(OUT, 'A.png') });
    // B — a grid whose middle cell holds another grid with words in a cell
    await H.panel(page, true);
    const sec2 = await P.tileAfter(page, sec, 'Stack');
    const g = await P.grid(page, 3, 1); void sec2;
    const cells = await page.evaluate((id) => Array.from(document.querySelectorAll(`[data-box-id="${id}"] > [data-box-id]`)).map((e) => e.getAttribute('data-box-id')), g);
    await H.select(page, cells[1]); await H.panel(page, true);
    const inner = await P.grid(page, 2, 1);
    const icells = await page.evaluate((id) => Array.from(document.querySelectorAll(`[data-box-id="${id}"] > [data-box-id]`)).map((e) => e.getAttribute('data-box-id')), inner);
    const t = await P.into(page, icells[0], 'Text');
    await H.panel(page, false);
    await page.mouse.click(10, 400); await page.waitForTimeout(200);
    R.B.push({ step: 'start', want: { outerCell: cells[1].slice(-4), innerGrid: inner.slice(-4), innerCell: icells[0].slice(-4), text: t.slice(-4) } });
    for (let k = 1; k <= 5; k++) { await clickIn(page, icells[0], 0.8, 0.85); R.B.push({ step: `click ${k}`, ...(await state(page)) }); }
    await page.screenshot({ path: path.join(OUT, 'B.png') });
  } catch (e) { R.crash = e.message; await page.screenshot({ path: path.join(OUT, 'crash.png') }).catch(() => {}); }
  fs.writeFileSync(path.join(OUT, 'probe.json'), JSON.stringify(R, null, 1));
  console.log(JSON.stringify(R, null, 1));
  await browser.close();
})();
