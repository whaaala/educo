// HEADED UAT — #144 (L-2): a block in a GRID CELL, inside the band that holds a narrowing grid (a size container) set to "Floats on screen", built
// THROUGH THE UI. Before: the Inspector warned "This will not stay on screen" though every engine keeps it on screen.
// After: no warning, and in the Preview it holds while the page scrolls.
//   NODE_PATH=node_modules node scripts/uat/probe-144-ui.js [--theme=Dark]
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const THEME = arg('theme', 'Light');
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 900 });
  page.setDefaultTimeout(12000);
  try {
    if (THEME !== 'Light') for (const b of ['Website theme', 'Change theme']) { await page.getByRole('button', { name: b }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(THEME) }).first().click(); await page.waitForTimeout(400); }
    await H.panel(page, true);
    // a Text in the first cell of a 3-across Grid: the band holding a grid that narrows is a size container
    // (`hostsNarrowingGrid`) — the case the Inspector warned about (#144)
    const stack = await P.first(page, 'Stack'); const before = await P.ids(page);
    await H.dropInto(page, 'Grid', stack); await page.locator('[role="gridcell"][aria-label="3 across, 1 down"]').click(); await page.waitForTimeout(700);
    const g = (await P.newestLeaf(page, before)).id;
    const cells = await page.evaluate((id) => [...document.querySelector(`[data-box-id="${id}"]`).children].map((k) => k.getAttribute('data-box-id')).filter(Boolean), g);
    const t = await P.into(page, cells[0], 'Text');
    let below = stack; for (let i = 0; i < 8; i++) below = await P.under(page, below, 'Text'); // a page long enough to scroll
    await H.panel(page, false);
    await H.select(page, t); await I.tab(page, 'Design'); await I.section(page, 'Placement');
    await page.getByRole('option', { name: /Floats on screen/ }).or(page.getByRole('radio', { name: /Floats on screen/ })).or(page.getByRole('button', { name: /Floats on screen/ })).first().click().catch(async () => {
      // a CompactSelect: open it first
      await page.getByRole('button', { name: /Scrolls away|Sticks when reached|Floats on screen/ }).first().click(); await page.waitForTimeout(250);
      await page.getByRole('option', { name: /Floats on screen/ }).first().click();
    });
    await page.waitForTimeout(400);
    const warn = await page.locator('aside[aria-label="Inspector"]').getByText(/will not stay on screen/).count();
    const held = await page.evaluate((id) => { const n = JSON.parse(localStorage.getItem('educo_box_site_v1')); let hit = null; const walk = (b) => { if (b.id === id) hit = b; (b.children || []).forEach(walk); }; n.pages.forEach((p) => walk(p.root)); return hit && `${hit.pin || '-'}/${hit.hold || '-'}`; }, t);
    console.log(`  Inspector warning shown: ${warn ? 'YES' : 'no'} · the block's setting: ${held}`);
    // …and the CANVAS draws it holding too: scroll the canvas and watch the block on screen
    await page.keyboard.press('Escape'); await page.waitForTimeout(200);
    // at 200% the page is taller than the window, so the canvas really scrolls (at Fit it did not: "scrolled 0px")
    await page.getByRole('group', { name: 'Canvas zoom' }).locator('button').nth(1).click(); await page.getByRole('option', { name: '200%', exact: true }).first().click(); await page.waitForTimeout(600);
    const onCanvas = await page.evaluate(async (id) => { const sc = document.querySelector('[data-canvas-scroller]'); const el = document.querySelector(`[data-box-id="${id}"]`);
      const a = Math.round(el.getBoundingClientRect().top); sc.scrollTop += 300; await new Promise((r) => setTimeout(r, 400)); const b = Math.round(el.getBoundingClientRect().top);
      return `canvas: block top ${a}px → after scrolling the canvas ${b}px (${sc.scrollTop < 100 ? 'NOT TESTED — the canvas did not scroll' : Math.abs(a - b) <= 2 ? 'HOLDS' : 'scrolls away'}, scrolled ${sc.scrollTop}px)`; }, t);
    console.log(`  ${onCanvas}`);
    await page.screenshot({ path: `scripts/uat/logs/p144-${THEME.replace(/\W+/g, '')}${process.env.BASE ? process.env.BASE.slice(-4) : ''}-inspector.png` });
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500);
    const f = await (await page.$('iframe')).contentFrame();
    const r = await f.evaluate(async () => { const el = [...document.querySelectorAll('[class*="bx-"]')].find((e) => getComputedStyle(e).position === 'fixed'); if (!el) return 'no fixed block in the Preview';
      const a = Math.round(el.getBoundingClientRect().top); window.scrollTo(0, 600); await new Promise((res) => setTimeout(res, 300)); const b = Math.round(el.getBoundingClientRect().top);
      return `fixed block top ${a}px → after a 600px scroll ${b}px (${a === b ? 'HOLDS' : 'moved'})`; });
    console.log(`  Preview: ${r}`);
    await page.screenshot({ path: `scripts/uat/logs/p144-${THEME.replace(/\W+/g, '')}${process.env.BASE ? process.env.BASE.slice(-4) : ''}-preview.png` });
  } catch (e) { console.log('CRASH ' + e.message.split('\n')[0]); }
  if (errs.length) console.log('page errors: ' + [...new Set(errs)].join(' | '));
  await browser.close();
})();
