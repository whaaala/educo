// PROBE — BATCH LE-11: what the Preview holds for a header that slides away and one that keeps its last row (read only).
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/probe-le11.js
const H = require('./h.js'); const I = require('./inspector.js');
const X = require('./uat-rx3-headed.js'); const { sleep, deselect, at, ins, pvOpen, pvAt, chip, frame } = X;
const selected = (page) => page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);
async function where(page, c) { await H.panel(page, true); const b = page.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: c, exact: true }).first(); if (await b.isVisible().catch(() => false)) { await b.click(); await sleep(page, 250); } }
async function tile(page, t) { await H.panel(page, true); await H.clickTile(page, t); const d = page.locator('[role="menu"][aria-label^="Add "]').getByRole('menuitem', { name: 'Default' }); if (await d.isVisible().catch(() => false)) { await d.click(); await sleep(page, 700); } return selected(page); }
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1366, h: 860 });
  await deselect(page); await where(page, 'End'); const hdr = await tile(page, 'Stack');
  await where(page, 'Inside'); const top = await tile(page, 'Text'); await where(page, 'After'); const menu = await tile(page, 'Text');
  await I.meaning(page, hdr, 'Page header'); await I.sticky(page, hdr);
  for (let i = 0; i < 5; i++) { await deselect(page); await where(page, 'End'); const s = await tile(page, 'Stack'); await at(page, s, 'Layout'); await ins(page).getByRole('group', { name: 'Screen height' }).getByRole('button', { name: 'Full screen' }).first().click(); await sleep(page, 300); }
  await at(page, hdr, 'Design', 'Placement');
  await ins(page).getByRole('checkbox', { name: 'Keep only the last row on screen' }).check(); await sleep(page, 400);
  await ins(page).getByRole('group', { name: 'When you scroll down' }).getByRole('button', { name: 'Slides away', exact: true }).click(); await sleep(page, 400);
  await chip(page, 'Desktop (1280px)'); await pvOpen(page); await pvAt(page, 1280); const f = await frame(page);
  console.log(JSON.stringify(await f.evaluate(([h, t, m]) => {
    const pinned = [...document.querySelectorAll('[data-eu-pin]')].map((e) => ({ tag: e.tagName, cls: e.className.slice(0, 60), attrs: [...e.attributes].map((a) => a.name).filter((n) => n.startsWith('data-eu')), top: getComputedStyle(e).top, skip: e.style.getPropertyValue('--eu-pin-skip'), pos: getComputedStyle(e).position }));
    const r = (id) => { const e = document.querySelector(`.bx-${id}`); return e ? [Math.round(e.getBoundingClientRect().top), Math.round(e.getBoundingClientRect().height)] : null; };
    return { head: !!window.__euHead, stack: !!window.__euPinStack, scripts: document.scripts.length, pinned, hdr: r(h), top: r(t), menu: r(m) };
  }, [hdr, top, menu])));
  const ifr = await page.$('iframe'); const bb = await ifr.boundingBox(); await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
  for (const dy of [900, 900, -300]) { await page.mouse.wheel(0, dy); await sleep(page, 800); console.log('after', dy, JSON.stringify(await f.evaluate(() => { const e = document.querySelector('[data-eu-away]'); return { y: scrollY, gone: e.hasAttribute('data-eu-gone'), tr: getComputedStyle(e).transform, act: document.activeElement?.tagName }; }))); }
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
