// HEADED PROBE — BATCH LE-2: reproduce before fixing (RULE Y, every state built through the UI). Each job in its own window.
//   perscreen  LE2-1 · a Text, a Heading, a Button styled at Mobile: canvas at Mobile vs the Preview at 375 and 1280
//   screen     LE2-3 · a Full-screen Stack: canvas at Mobile (block ÷ scale vs the canvas view) vs the Preview at 375 × 812
//   column     L-8   · a Stack of three Images: the last one's bottom edge dragged up — the space below it, after release / reload / Preview
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/probe-le2.js [--only=column]
const path = require('path'); const fs = require('fs');
const H = require('./h.js');
const X = require('./uat-rx3-headed.js'); const { sleep, nodeOf, deselect, band, at, ins, pvOpen, pvAt, pvClose, chip, slider, cls } = X;
const OUT = path.join(__dirname, 'logs', 'le2-probe'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const shot = (page, n) => page.screenshot({ path: path.join(OUT, n + '.png') }).catch(() => {});
const log = (...a) => console.log(...a);
async function hexIn(page, label, v) { const h = ins(page).getByLabel(`${label} hex value`).first(); await h.scrollIntoViewIfNeeded(); await h.fill(v); await h.press('Enter'); await h.blur(); await sleep(page, 400); }
const inner = (page, id) => page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); const k = e?.querySelector('h1,h2,h3,h4,p,a') || e; const c = getComputedStyle(k); return `${k.tagName} color ${c.color} size ${c.fontSize} bg ${c.backgroundColor}`; }, id);
const pinner = (f, id) => f.evaluate((s) => { const e = document.querySelector(s); const k = e?.querySelector('h1,h2,h3,h4,p,a') || e; const c = getComputedStyle(k); return `${k.tagName} color ${c.color} size ${c.fontSize} bg ${c.backgroundColor}`; }, cls(id));

const JOBS = {
  async perscreen(page) {
    const t = await band(page, 'Text'); const h = await band(page, 'Heading'); const b = await band(page, 'Button');
    await chip(page, 'Mobile (375px)');
    for (const id of [t, h]) { await at(page, id, 'Content', 'Text style'); await hexIn(page, 'Text colour', '#c00000'); await slider(page, 'Text size', 40); }
    await at(page, b, 'Design', 'Background'); await hexIn(page, 'Background colour', '#007a00');
    // LE2-4: an effect chosen at Mobile — where is it stored, and does the published page carry it?
    await at(page, b, 'Design', 'Outline & effects'); await ins(page).getByRole('button', { name: 'Lift hover effect' }).first().click(); await sleep(page, 400);
    for (const id of [t, h, b]) log('[perscreen] stored', id, JSON.stringify((await nodeOf(page, id)).responsive || {}));
    for (const id of [t, h, b]) log('[perscreen] canvas Mobile', id, await inner(page, id));
    await shot(page, 'perscreen-canvas-mobile');
    await chip(page, 'Desktop (1280px)');
    for (const id of [t, h, b]) log('[perscreen] canvas Desktop', id, await inner(page, id));
    await pvOpen(page);
    for (const w of [375, 1280]) { const f = await pvAt(page, w); for (const id of [t, h, b]) log(`[perscreen] Preview ${w}`, id, await pinner(f, id)); await shot(page, 'perscreen-preview-' + w); }
    { const f = await pvAt(page, 375); log('[perscreen] Preview: hover rule for the Button', await f.evaluate((c) => Array.from(document.querySelectorAll('style')).map((x) => x.textContent).join('').includes(c + ':hover') || /hover/.test(Array.from(document.querySelectorAll('style')).map((x) => x.textContent).join('').split(c).slice(1).join('').slice(0, 400)), cls(b))); }
    await pvClose(page, 1366);
  },
  async screen(page) {
    const s = await band(page, 'Stack'); await at(page, s, 'Layout');
    await ins(page).getByRole('group', { name: 'Screen height' }).getByRole('button', { name: 'Full screen' }).first().click().catch(async () => { await ins(page).getByRole('radio', { name: 'Full screen' }).first().click(); });
    await sleep(page, 600); log('[screen] stored', JSON.stringify((await nodeOf(page, s)).screenHeight));
    await chip(page, 'Mobile (375px)'); await deselect(page);
    const m = await page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); const z = +(document.querySelector('[data-canvas-scale]')?.getAttribute('data-canvas-scale') || 1); const sc = e.closest('[data-canvas-scale]'); let p = e.parentElement; while (p && !(p.scrollHeight > p.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(p).overflowY))) p = p.parentElement; return { blockH: Math.round(e.getBoundingClientRect().height / z), scale: z, view: p ? Math.round(p.clientHeight / z) : null, inner: innerHeight, canvasH: getComputedStyle(sc || document.body).getPropertyValue('--canvas-h') }; }, s);
    log('[screen] canvas at Mobile', JSON.stringify(m)); await shot(page, 'screen-canvas-mobile');
    await pvOpen(page); const f = await pvAt(page, 375, 812); const r = await f.evaluate((c) => ({ h: Math.round(document.querySelector(c).getBoundingClientRect().height), vh: innerHeight }), cls(s));
    log('[screen] Preview 375×812', JSON.stringify(r)); await shot(page, 'screen-preview'); await pvClose(page, 1366);
  },
  async column(page) {
    const s = await band(page, 'Stack');
    for (let i = 0; i < 3; i++) { await H.panel(page, false); await H.select(page, s); await H.panel(page, true); const w = page.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: 'Inside' }); if (await w.count()) await w.first().click(); await sleep(page, 250); await H.clickTile(page, 'Image'); }
    const kids = (await nodeOf(page, s)).children.flatMap((k) => (k.rowBand ? k.children : [k])); log('[column] kids', kids.map((k) => k.type).join(','));
    const last = kids[kids.length - 1].id;
    const geo = () => page.evaluate(([s, l]) => { const z = +(document.querySelector('[data-canvas-scale]')?.getAttribute('data-canvas-scale') || 1); const a = document.querySelector(`[data-box-id="${s}"]`).getBoundingClientRect(); const b = document.querySelector(`[data-box-id="${l}"]`).getBoundingClientRect(); return { stackH: Math.round(a.height / z), lastH: Math.round(b.height / z), below: Math.round((a.bottom - b.bottom) / z) }; }, [s, last]);
    log('[column] before', JSON.stringify(await geo()));
    await H.panel(page, false); await H.select(page, last); await sleep(page, 300);
    await H.dragEdge(page, 'bottom', 0, -80); await sleep(page, 800);
    log('[column] after release', JSON.stringify(await geo()), 'stored', JSON.stringify((({ minHeight, height, marginBottom, alignSelf }) => ({ minHeight, height, marginBottom, alignSelf }))(await nodeOf(page, last))));
    await shot(page, 'column-after');
    await page.reload(); await page.waitForSelector(`[data-box-id="${last}"]`); await sleep(page, 1200);
    log('[column] after reload', JSON.stringify(await geo()));
    await pvOpen(page); for (const w of [375, 1280]) { const f = await pvAt(page, w); log(`[column] Preview ${w}`, JSON.stringify(await f.evaluate(([a, b]) => { const x = document.querySelector(a).getBoundingClientRect(); const y = document.querySelector(b).getBoundingClientRect(); return { stackH: Math.round(x.height), lastH: Math.round(y.height), below: Math.round(x.bottom - y.bottom) }; }, [cls(s), cls(last)]))); }
    await shot(page, 'column-preview'); await pvClose(page, 1366);
  },
};

(async () => {
  const names = Object.keys(JOBS).filter((n) => !ONLY.length || ONLY.includes(n));
  await Promise.all(names.map(async (J, s) => {
    const { browser, page, errs } = await H.open({ headed: true, w: 1366, h: 860, pos: [(s % 3) * 620, Math.floor(s / 3) * 480] });
    try { await JOBS[J](page); } catch (e) { log(`[${J}] ERROR`, e.message.split('\n')[0]); await shot(page, 'ERR-' + J); }
    log(`[${J}] console`, errs.join(' | ') || 'no errors'); await browser.close();
  }));
})();
