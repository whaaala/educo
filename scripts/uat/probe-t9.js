// HEADED PROBE (RULE Y): a tile released on the SELECTED block's floating toolbar (tier 99, c-5 — pages 33 and 163:
// "the canvas offered the drop and added nothing", released on <button> "Block actions"). A heading is selected, its
// toolbar hangs under it, over the text below; a Stack is dropped just under that text.
//   NODE_PATH=node_modules node scripts/uat/probe-t9.js
const fs = require('fs'); const path = require('path');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js'); const { Builder } = require('./build-page.js');
const OUT = path.join(__dirname, 'probe-t9-out'); fs.mkdirSync(OUT, { recursive: true });

const scene = (page, ids) => page.evaluate((ids) => {
  const rect = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return `${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}×${Math.round(r.height)}`; };
  return { selected: document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id')?.slice(-4) ?? null, toolbar: rect(document.querySelector('[role="toolbar"][aria-label="Block toolbar"]')),
    blocks: Object.fromEntries(ids.map((id) => [id.slice(-4), rect(document.querySelector(`[data-box-id="${id}"]`))])), count: document.querySelectorAll('[data-box-id]').length };
}, ids);

(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 720, pos: [0, 0] });
  page.setDefaultTimeout(10000); const R = {}; let n = 0;
  const shot = (name) => page.screenshot({ path: path.join(OUT, `${++n}-${name}.png`) });
  try {
    await H.panel(page, true);
    const hdr = await P.first(page, 'Stack'); await P.into(page, hdr, 'Heading');
    const sec = await P.tileAfter(page, hdr, 'Stack');
    const h = await new Builder(page).addLine(sec, 'Heading', null);
    if (!process.argv.includes('--no-words')) { await H.panel(page, false); await I.text(page, h, 'What we offer'); await H.panel(page, true); }
    const t = await P.under(page, h, 'Text');
    // the state the dresser is in when it drops the next line: the heading SELECTED, as typing its words left it
    await H.panel(page, false); await H.select(page, h); await H.panel(page, true);
    R.before = await scene(page, [h, t]); await shot('before');
    R.state = await page.evaluate(() => ({ active: document.activeElement?.tagName + (document.activeElement?.getAttribute('contenteditable') ? '[contenteditable]' : ''), editing: !!document.querySelector('[contenteditable="true"]'), flag: document.body.hasAttribute('data-box-drag-in'), viewport: innerWidth + 'x' + innerHeight, panel: !!document.querySelector('[aria-label="Close blocks panel"]') })); console.log('STATE', JSON.stringify(R.state));
    console.log('BEFORE', JSON.stringify(R.before));
    fs.writeFileSync(path.join(OUT, 'stored.json'), await page.evaluate(() => localStorage.getItem('educo_box_site_v1') || '{}'));
    // every point across the bottom edge of the text — where a person lets go to put a block under it
    const v = await H.visibleRect(page, t); R.tries = [];
    for (const fx of [0.5, 0.1, 0.25, 0.75, 0.9]) {
      const x = Math.round(v.l + v.w * fx), y = Math.round(v.b - 5); const before = R.tries.length ? (await scene(page, [h, t])).count : R.before.count;
      await H.dropTile(page, 'Stack', x, y); await page.waitForTimeout(900);
      const after = (await scene(page, [h, t])).count;
      R.tries.push({ at: `${x},${y}`, under: page.__dropAt, offered: page.__dropOffered, added: after - before });
      console.log(`DROP at ${x},${y} · released ${page.__dropAt} · offered ${page.__dropOffered} · blocks added ${after - before}`);
      await shot(`drop-${Math.round(fx * 100)}`);
      if (after > before) { await page.keyboard.press('Control+z'); await page.waitForTimeout(500); await H.panel(page, false); await H.select(page, h); await H.panel(page, true); }
    }
  } catch (e) { R.crash = e.message; console.log('CRASH', e.message.split('\n')[0]); await shot('crash').catch(() => {}); }
  if (errs.length) console.log('PAGE ERRORS', errs.join(' / '));
  fs.writeFileSync(path.join(OUT, 'probe.json'), JSON.stringify(R, null, 1));
  await browser.close();
})();
