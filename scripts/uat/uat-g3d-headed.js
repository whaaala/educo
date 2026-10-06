// HEADED UAT — BATCH G-3d · the user's three phone decisions (RULE X / Y / Z). SIX windows at all times (a pool that refills),
// every page BUILT THROUGH THE UI, the real Preview read at EVERY screen of scripts/uat/screens.js at 100 / 150 / 200 % text.
// Checklist: docs/TASK_TREE.md BATCH G-3d (U1 … U8).
//   A1 U1  paragraph + photo 40 %: the photo under the words below 600, beside from 1200 — canvas and Preview      (Light)
//   A2 U1  article + sidebar 30 %: the sidebar under it below 600                                                    (Dark)
//   B1 U2  four Stats: two across on every phone ≥ 320                                                                (Midnight)
//   B2 U2  six logos: 2 across to 479, 3 to 599, all six from 600 (100 % text)                                       (Purple Dream)
//   C  U3  a page saved before the page grid (marks taken out of storage, as G-1's slice O): the photo stays beside  (Light)
//   D  U4/5 the third of three halves: the whole phone line; "To line" at Mobile wins; Undo; reload                 (Dark)
//   E-* U6/7/8 a photo two rows tall fills its block; the switch off / Undo / reload; where it does not apply; themes
//   NODE_PATH=node_modules node scripts/uat/uat-g3d-headed.js [--only=A1,E-Dark]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const { SCREENS } = require('./screens.js');
const OUT = path.join(__dirname, 'logs', 'uat-g3d'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const KEY = 'educo_box_site_v1';
const POOL = 6;

const DEV = { Mobile: 'Mobile (375px)', Tablet: 'Tablet (768px)', Laptop: 'Laptop (1024px)', Desktop: 'Desktop (1280px)', Wide: 'Wide (1920px)', Full: 'Full width' };
const chip = async (page, dev) => { page.__step = `chip ${dev}`; await page.getByRole('button', { name: DEV[dev] }).first().click(); await page.waitForTimeout(700); };
const rectOf = (page, id) => page.evaluate((id) => { const r = document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); return { l: r.left, r: r.right, w: r.width, t: r.top, h: r.height, b: r.bottom }; }, id);
const sideways = (f) => f.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
async function editorTheme(page, name) { if (name === 'Light') return; await page.getByRole('button', { name: 'Change theme' }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(name) }).first().click(); await page.waitForTimeout(500); }
const size = async (page, id) => { await H.select(page, id); await I.tab(page, 'Design'); await I.section(page, 'Size'); };
const field = async (page, name, v) => { const f = page.getByLabel(name, { exact: true }).first(); await f.scrollIntoViewIfNeeded(); await f.fill(String(v)); await f.blur(); await page.waitForTimeout(600); };
const widths = async (page, pairs) => { await chip(page, 'Desktop'); for (const [id, w] of pairs) { await size(page, id); await page.getByRole('group', { name: 'Width' }).getByRole('button', { name: 'Custom' }).click(); await page.waitForTimeout(300); await field(page, 'Custom width', w); } };
const LONG = 'Our school opened in 1987 with forty pupils and two classrooms. Today more than six hundred children learn here, from nursery to the final year, taught by teachers who know every one of them by name.';

async function preview(page, screens, fn, scale = 1) {
  page.__step = 'preview';
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1200); await page.keyboard.press('h');
  for (const { w, h } of screens) {
    await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(300);
    let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== w) { await page.setViewportSize({ width: 2 * w - inner, height: h }); await page.waitForTimeout(250); f = await (await page.$('iframe')).contentFrame(); }
    if (scale !== 1) { await f.evaluate((s) => { document.documentElement.style.fontSize = `${s * 100}%`; }, scale); await page.waitForTimeout(150); }
    await fn(f, w);
  }
  await page.setViewportSize({ width: 1240, height: 820 }); await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {}); await page.waitForTimeout(600);
}
const pubRect = (f, id) => f.evaluate((id) => { const e = document.querySelector(`.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')}`); if (!e) return null; const r = e.getBoundingClientRect(); return { l: r.left, r: r.right, w: r.width, t: r.top, h: r.height, b: r.bottom }; }, id);
const pageFaults = (f) => f.evaluate(() => {
  const out = [];
  for (const e of document.querySelectorAll('h1,h2,h3,h4,p,a,button,span')) if (e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflowX !== 'visible') { out.push(`broken: ${e.textContent.trim().slice(0, 16)}`); break; }
  for (const e of document.querySelectorAll('[class*="bx-"]')) {
    const kids = [...e.children].filter((k) => k.getBoundingClientRect().width > 0 && getComputedStyle(k).position === 'static');
    for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) { const A = kids[i].getBoundingClientRect(), B = kids[j].getBoundingClientRect(); if (A.left < B.right - 1 && B.left < A.right - 1 && A.top < B.bottom - 1 && B.top < A.bottom - 1) { out.push('overlap'); i = kids.length; break; } }
    if (getComputedStyle(e).display === 'grid' && kids.length > 1) {
      const tops = {}; for (const k of kids) { const t = Math.round(k.getBoundingClientRect().top); tops[t] = (tops[t] || 0) + 1; }
      const n = Object.values(tops); if (n.length > 1 && n.slice(0, -1).some((v) => v !== n[0])) out.push(`staircase ${n.join('+')}`);
    }
  }
  return out.slice(0, 3);
});
/** How many of `ids` share the first one's line (same top, ±1px) in the Preview. */
const acrossIn = async (f, ids) => { const rs = await Promise.all(ids.map((id) => pubRect(f, id))); return rs.filter((r) => r && Math.abs(r.t - rs[0].t) < 1).length; };
/** Every screen × 100 / 150 / 200 %: no sideways scroll, overlap, broken word or staircase; `at` adds the slice's own checks (100 % only). */
async function sweep(page, ok, label, at) {
  for (const scale of [1, 1.5, 2]) {
    const bad = [];
    await preview(page, SCREENS, async (f, w) => {
      if (await sideways(f) > 1) bad.push(`${w}: sideways`);
      for (const x of await pageFaults(f)) bad.push(`${w}: ${x}`);
      if (scale === 1 && at) { const m = await at(f, w); if (m) bad.push(`${w}: ${m}`); }
    }, scale);
    ok(`${label} · Preview at all ${SCREENS.length} screens, ${scale * 100} % text${scale === 1 && at ? ' (+ its own checks)' : ''}: no sideways scroll, overlap, broken word or staircase`, !bad.length, bad.slice(0, 6).join(' · '));
  }
}

/** A row of two Stacks of words / a photo, at the given widths — through the blocks panel. */
async function pair(page, second, [wa, wb]) {
  await H.panel(page, true);
  const a = await P.first(page, 'Stack'); const ta = await P.into(page, a, 'Text');
  const b = await P.beside(page, a, 'Stack'); const tb = await P.into(page, b, second);
  await H.panel(page, false);
  if (second === 'Image') await H.fillImages(page);
  await I.text(page, ta, LONG); if (second === 'Text') await I.text(page, tb, 'Term dates, the uniform list and the school calendar.');
  await widths(page, [[a, wa], [b, wb]]);
  return { a, b };
}

const SLICES = {};
// U1 — the photo beside a paragraph, and a sidebar beside an article
for (const [key, second, w, what] of [['A1', 'Image', ['60%', '40%'], 'photo 40 %'], ['A2', 'Text', ['70%', '30%'], 'sidebar 30 %']]) SLICES[key] = async (page, ok) => {
  const { a, b } = await pair(page, second, w);
  await chip(page, 'Mobile'); let ra = await rectOf(page, a), rb = await rectOf(page, b);
  ok(`U1 canvas Mobile · the ${what} goes under the words`, rb.t >= ra.b - 0.5 && Math.abs(rb.l - ra.l) < 1, `a ${ra.l.toFixed(0)},${ra.t.toFixed(0)}–${ra.b.toFixed(0)} · b ${rb.l.toFixed(0)},${rb.t.toFixed(0)}`);
  await page.screenshot({ path: path.join(OUT, `${key}-Mobile.png`) });
  await chip(page, 'Desktop'); ra = await rectOf(page, a); rb = await rectOf(page, b);
  ok(`U1 canvas Desktop · the ${what} beside the words`, Math.abs(rb.t - ra.t) < 1 && rb.l > ra.r - 1, `b at ${rb.l.toFixed(0)},${rb.t.toFixed(0)}`);
  await sweep(page, ok, `U1 ${what}`, async (f, w) => {
    const [pa, pb] = [await pubRect(f, a), await pubRect(f, b)];
    if (w < 600 && !(pb.t >= pa.b - 0.5)) return `${what} beside at ${w} (b.t ${pb.t.toFixed(0)} < a.b ${pa.b.toFixed(0)}, b ${pb.w.toFixed(0)}px wide)`;
    if (w >= 1200 && !(Math.abs(pb.t - pa.t) < 1)) return `${what} not beside at ${w}`;
    return null;
  });
};
// U2 — four Stats stay two across on a phone; six logos go 2 / 3 / 6 across
SLICES.B1 = async (page, ok) => {
  await H.panel(page, true);
  const ids = [await P.first(page, 'Stack')]; for (let i = 0; i < 3; i++) ids.push(await P.beside(page, ids[i], 'Stack'));
  for (const id of ids) await P.into(page, id, 'Stat');
  await H.panel(page, false); await widths(page, ids.map((id) => [id, '25%']));
  await chip(page, 'Mobile'); const rs = await Promise.all(ids.map((id) => rectOf(page, id)));
  ok('U2 canvas Mobile (375) · four Stats two across, two lines', Math.abs(rs[0].t - rs[1].t) < 1 && rs[2].t > rs[0].t + 1 && Math.abs(rs[2].t - rs[3].t) < 1, rs.map((r) => `${r.l.toFixed(0)},${r.t.toFixed(0)}`).join(' '));
  await page.screenshot({ path: path.join(OUT, 'B1-Mobile.png') });
  await sweep(page, ok, 'U2 four Stats', async (f, w) => { const n = await acrossIn(f, ids); return w < 600 && n !== 2 ? `${n} across at ${w}` : null; });
};
SLICES.B2 = async (page, ok) => {
  await H.panel(page, true);
  const ids = [await P.first(page, 'Image')]; for (let i = 0; i < 5; i++) ids.push(await P.beside(page, ids[i], 'Image'));
  await H.panel(page, false); await H.fillImages(page);
  const want = (w) => (w < 480 ? 2 : w < 600 ? 3 : 6);
  await chip(page, 'Mobile'); const rs = await Promise.all(ids.map((id) => rectOf(page, id)));
  ok('U2 canvas Mobile (375) · six logos two across', rs.filter((r) => Math.abs(r.t - rs[0].t) < 1).length === 2, rs.map((r) => `${r.l.toFixed(0)},${r.t.toFixed(0)}`).join(' '));
  await chip(page, 'Tablet'); const rt = await Promise.all(ids.map((id) => rectOf(page, id)));
  ok('U2 canvas Tablet (768) · all six across (the floor never steps 600+)', rt.every((r) => Math.abs(r.t - rt[0].t) < 1), rt.map((r) => r.t.toFixed(0)).join(' '));
  await page.screenshot({ path: path.join(OUT, 'B2-Mobile.png') });
  await sweep(page, ok, 'U2 six logos', async (f, w) => { const n = await acrossIn(f, ids); return n !== want(w) ? `${n} across at ${w} (want ${want(w)})` : null; });
};
// U3 — a page saved before the page grid is left as it was
SLICES.C = async (page, ok) => {
  const { a, b } = await pair(page, 'Image', ['60%', '40%']);
  await page.evaluate((k) => { const s = JSON.parse(localStorage.getItem(k)); const strip = (n) => { delete n.pageGrid; delete n.onPageGrid; delete n.pageRow; (n.children || []).forEach(strip); }; s.pages.forEach((p) => strip(p.root)); localStorage.setItem(k, JSON.stringify(s)); }, KEY);
  await page.reload(); await page.waitForTimeout(2500);
  const bad = []; let html = '';
  await preview(page, [375, 1280].map((w) => SCREENS.find((s) => s.w === w)), async (f, w) => {
    html = await f.content(); const [pa, pb] = [await pubRect(f, a), await pubRect(f, b)];
    // G3d-3: a saved page has always stacked on a phone (L-4) — "as before" is stacked. Byte-identity: g3d-saved-bytes.test.ts
    if (w === 375 && !(pb.t >= pa.b - 0.5)) bad.push(`375: the photo beside the words, b.t ${pb.t.toFixed(0)}`);
    if (w === 1280 && !(Math.abs(pb.t - pa.t) < 1)) bad.push('1280: not beside');
  });
  fs.writeFileSync(path.join(OUT, 'C-saved-site.json'), await page.evaluate((k) => localStorage.getItem(k), KEY));
  ok('U3 saved page · stacked at 375 as it always was, beside at 1280', !bad.length, bad.join(' · '));
  ok('U3 saved page · nothing of G-3d is published (no --bx-fill)', !html.includes('--bx-fill'));
};
// U4 / U5 — a block alone on its line takes the phone's whole line; a width set on the phone wins
SLICES.D = async (page, ok) => {
  await H.panel(page, true);
  const ids = [await P.first(page, 'Stack')]; for (let i = 0; i < 2; i++) ids.push(await P.beside(page, ids[i], 'Stack'));
  for (const id of ids) { const t = await P.into(page, id, 'Text'); ids.t = (ids.t || []).concat(t); }
  await H.panel(page, false); await widths(page, ids.map((id) => [id, '50%']));
  const [, , c] = ids;
  await chip(page, 'Desktop'); let r = await Promise.all(ids.map((id) => rectOf(page, id)));
  // G3d-2: alone on its line it gives up a different part of the side space than one of a pair (G3b-3) — the same share, not px
  ok('U4 canvas Desktop · two halves, the third alone and half the page on line 2', r[2].t > r[0].t + 1 && Math.abs(r[2].w / r[0].w - 1) < 0.05, r.map((x) => `${x.l.toFixed(0)}+${x.w.toFixed(0)}`).join(' '));
  for (const dev of ['Mobile', 'Tablet']) {
    await chip(page, dev); r = await Promise.all(ids.map((id) => rectOf(page, id)));
    const whole = Math.abs(r[2].w - r[0].w) < 1 && Math.abs(r[2].l - r[0].l) < 1 && r[0].t < r[1].t;
    ok(`U4 canvas ${dev} · the third block ${dev === 'Mobile' ? 'takes the whole line, like the stacked two' : 'is still half (only the phone widens it)'}`, dev === 'Mobile' ? whole : r[2].w < r[0].w * 0.75 || r[0].t === r[1].t, r.map((x) => `${x.l.toFixed(0)}+${x.w.toFixed(0)}`).join(' '));
  }
  await sweep(page, ok, 'U4 lone block', async (f, w) => {
    // G3d-4: measured against the PAGE, not the first block (at 599 the two halves still fit side by side)
    const p2 = await pubRect(f, c); const page = await f.evaluate(() => document.documentElement.clientWidth);
    if (w < 600 && p2.w < page - 2 * 20 - 1) return `third ${p2.w.toFixed(0)}px of a ${page}px page — not the whole line`;
    if (w >= 600 && p2.w > page * 0.55) return `third ${p2.w.toFixed(0)}px of ${page} — widened off the phone`;
    return null;
  });
  // U5: "To line" 4 of 6 at Mobile — the phone's own setting wins; Undo; reload
  // G3d-7: measured against the third's OWN whole line — a width set on the phone makes the fit rule stand aside for the whole row
  // (G3b-11), so the first block changes too
  await chip(page, 'Mobile'); const whole = (await rectOf(page, c)).w; await size(page, c); await field(page, 'To line', 4);
  r = await Promise.all(ids.map((id) => rectOf(page, id)));
  const half = (x) => Math.abs(x.w / whole - 0.5) < 0.08;
  ok('U5 Mobile · "To line" 4 set on the phone: the third block is half the line there', half(r[2]), `${r[2].w.toFixed(0)} of ${whole.toFixed(0)}`);
  await page.screenshot({ path: path.join(OUT, 'D-Mobile-half.png') });
  await page.keyboard.press('Control+z'); await page.waitForTimeout(600); r = await Promise.all(ids.map((id) => rectOf(page, id)));
  ok('U5 Mobile · one Undo gives the whole line back', Math.abs(r[2].w - whole) < 1, `${r[2].w.toFixed(0)} of ${whole.toFixed(0)}`);
  await page.keyboard.press('Control+y'); await page.waitForTimeout(600); await page.reload(); await page.waitForTimeout(2500); await chip(page, 'Mobile');
  r = await Promise.all(ids.map((id) => rectOf(page, id)));
  ok('U5 Mobile · Redo, reload: still half (stored on the phone)', half(r[2]), `${r[2].w.toFixed(0)} of ${whole.toFixed(0)}`);
  await chip(page, 'Desktop'); r = await Promise.all(ids.map((id) => rectOf(page, id)));
  ok('U5 Desktop · untouched by the phone setting (half)', Math.abs(r[2].w / r[0].w - 1) < 0.05);
};
// U6 / U7 / U8 — a photo two rows tall fills its block; the switch; where it does not apply; every editor theme
const sliceE = (theme) => async (page, ok) => {
  await H.panel(page, true);
  const ph = await P.first(page, 'Stack'); const img = await P.into(page, ph, 'Image');
  const a = await P.beside(page, ph, 'Stack'); const ta = await P.into(page, a, 'Text');
  const b = await P.beside(page, a, 'Stack'); const tb = await P.into(page, b, 'Text');
  // G3d-9: words taller than the photo beside it, so there IS height to fill (with short words the photo sets the rows)
  await H.panel(page, false); await H.fillImages(page); for (const t of [ta, tb]) await I.text(page, t, [LONG, LONG, LONG, LONG].join(' '));
  await widths(page, [[ph, '50%'], [a, '50%'], [b, '50%']]);
  await size(page, ph); await field(page, 'Rows tall', 2);
  const fit = async () => page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"] img`); const r = e.getBoundingClientRect(); return { h: r.height, w: r.width, fit: getComputedStyle(e).objectFit, nat: e.naturalWidth / e.naturalHeight }; }, img);
  // the block's INNER bottom: its own spacing (words never touch an edge) is not the picture's to fill (G3d-9)
  // …on the canvas scaled as it is drawn (`data-canvas-scale`): computed padding is unscaled (G3d-9)
  const inner = (doc, sel) => doc.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const s = getComputedStyle(e), Z = Number(e.closest('[data-canvas-scale]')?.dataset.canvasScale) || 1; return e.getBoundingClientRect().bottom - Z * (parseFloat(s.paddingBottom) + parseFloat(s.borderBottomWidth)); }, sel);
  const R = async () => ({ ph: await rectOf(page, ph), img: await rectOf(page, img), b: await rectOf(page, b), pic: await fit(), innerB: await inner(page, `[data-box-id="${ph}"]`) });
  await chip(page, 'Desktop'); let r = await R();
  ok(`U6 ${theme} Desktop · the photo fills its block two rows tall (to its inner bottom, taller than its own height)`, Math.abs(r.img.b - r.innerB) < 1.5 && r.img.h > r.pic.w / r.pic.nat + 10, `img ${r.img.t.toFixed(0)}–${r.img.b.toFixed(0)} · block inner bottom ${r.innerB.toFixed(0)} · own ${(r.pic.w / r.pic.nat).toFixed(0)}`);
  ok(`U6 ${theme} Desktop · cropped, never stretched (object-fit cover)`, r.pic.fit === 'cover', r.pic.fit);
  await page.screenshot({ path: path.join(OUT, `E-${theme}-fill.png`) });
  // U8: the switch — named, reachable by keyboard, readable
  await H.select(page, img); await I.tab(page, 'Content');
  const sw = page.getByRole('checkbox', { name: /Fill the block's height/ });
  ok(`U8 ${theme} · "Fill the block's height" is shown for this picture, on`, (await sw.count()) === 1 && await sw.isChecked());
  const contrast = await page.evaluate(() => {
    const l = [...document.querySelectorAll('label')].find((x) => /Fill the block's height/.test(x.textContent)); if (!l) return 0;
    const rgb = (c) => { const cv = document.createElement('canvas'); cv.width = cv.height = 1; const x = cv.getContext('2d'); x.fillStyle = c; x.fillRect(0, 0, 1, 1); return [...x.getImageData(0, 0, 1, 1).data].slice(0, 3); };
    // G3d-10: nothing painted all the way up is the page's own white, not black
    let bg = 'rgba(0, 0, 0, 0)', e = l; while (e && /rgba\(0, 0, 0, 0\)|transparent/.test(bg)) { bg = getComputedStyle(e).backgroundColor; e = e.parentElement; }
    if (/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) bg = 'rgb(255, 255, 255)';
    const lum = (c) => { const v = c.map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
    const [L1, L2] = [lum(rgb(getComputedStyle(l).color)), lum(rgb(bg))].sort((p, q) => q - p); return { r: (L1 + 0.05) / (L2 + 0.05), fg: getComputedStyle(l).color, bg };
  });
  ok(`U8 ${theme} · its words readable (≥ 4.5:1)`, contrast.r >= 4.5, `${contrast.r.toFixed(2)} · ${contrast.fg} on ${contrast.bg}`);
  await sw.focus(); await page.keyboard.press('Space'); await page.waitForTimeout(600);
  ok(`U8 ${theme} · Space on the focused switch turns it off`, !(await sw.isChecked()));
  r = await R();
  ok(`U7 ${theme} · off: the picture keeps its own height`, Math.abs(r.img.h - r.pic.w / r.pic.nat) < 2, `img ${r.img.h.toFixed(0)} · own ${(r.pic.w / r.pic.nat).toFixed(0)}`);
  await page.keyboard.press('Escape'); await page.mouse.click(5, 400); await page.keyboard.press('Control+z'); await page.waitForTimeout(700); r = await R();
  ok(`U7 ${theme} · one Undo: it fills again`, Math.abs(r.img.b - r.innerB) < 1.5 && r.img.h > r.pic.w / r.pic.nat + 10, `img bottom ${r.img.b.toFixed(0)} · inner ${r.innerB.toFixed(0)}`);
  await H.select(page, img); await I.tab(page, 'Content'); await sw.uncheck(); await page.waitForTimeout(600);
  await page.reload(); await page.waitForTimeout(2500); await chip(page, 'Desktop'); r = await R();
  await H.select(page, img); await I.tab(page, 'Content');
  ok(`U7 ${theme} · reload: still off (switch and picture)`, !(await sw.isChecked()) && Math.abs(r.img.h - r.pic.w / r.pic.nat) < 2, `img ${r.img.h.toFixed(0)}`);
  await sw.check(); await page.waitForTimeout(600);
  // the Preview: filled wherever the row is side by side; its own height where it stacks
  const own = (p) => p && p.w; let fills = 0, grew = 0;
  await sweep(page, ok, `U6 ${theme} photo two rows tall`, async (f) => {
    const [pi, pb] = [await f.evaluate((id) => { const e = document.querySelector(`.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')} img`); if (!e) return null; const q = e.getBoundingClientRect(); return { t: q.top, b: q.bottom, h: q.height, w: q.width, nat: e.naturalWidth / e.naturalHeight, fit: getComputedStyle(e).objectFit }; }, img), await pubRect(f, b)];
    if (!own(pi)) return 'no picture';
    const beside = pb && pb.t < pi.b - 1 && pb.l > pi.w;
    const ib = await inner(f, `.bx-${ph.replace(/[^A-Za-z0-9_-]/g, '-')}`);
    if (beside) { fills++; if (pi.h > pi.w / pi.nat + 5) grew++; if (Math.abs(pi.b - ib) > 1.5) return `beside but not filled (img ends ${pi.b.toFixed(0)}, block inner ${ib.toFixed(0)})`; }
    else if (Math.abs(pi.h - pi.w / pi.nat) > 2) return `stacked but not its own height (${pi.h.toFixed(0)} vs ${(pi.w / pi.nat).toFixed(0)})`;
    return pi.fit === 'cover' ? null : 'stretched';
  });
  ok(`U6 ${theme} · the Preview drew it side by side and filled, growing past its own height, on some screens`, fills > 0 && grew > 0, `${fills} side by side · ${grew} grown`);
  // U7: where it does not apply — "Rows tall" 1 → no switch; words beside the picture → no switch
  await size(page, ph); await field(page, 'Rows tall', 1); await H.select(page, img); await I.tab(page, 'Content');
  ok(`U7 ${theme} · one row tall: no switch`, (await sw.count()) === 0);
  await page.keyboard.press('Control+z'); await page.waitForTimeout(600);
  await chip(page, 'Mobile'); r = await R();
  ok(`U7 ${theme} Mobile · the row stacked: the picture its own height`, Math.abs(r.img.h - r.pic.w / r.pic.nat) < 2, `img ${r.img.h.toFixed(0)} · own ${(r.pic.w / r.pic.nat).toFixed(0)}`);
  await page.screenshot({ path: path.join(OUT, `E-${theme}-Mobile.png`) });
  await chip(page, 'Desktop'); await H.panel(page, true); await P.under(page, img, 'Text'); await H.panel(page, false);
  await H.select(page, img); await I.tab(page, 'Content');
  { const n = await sw.count(), q = await R(); ok(`U7 ${theme} · words added under the picture: no switch, the picture its own height`, n === 0 && Math.abs(q.img.h - q.pic.w / q.pic.nat) < 2, `switches ${n} · img ${q.img.h.toFixed(0)} · own ${(q.pic.w / q.pic.nat).toFixed(0)}`); }
};
for (const t of ['Light', 'Dark', 'Midnight', 'Purple Dream']) SLICES[`E-${t.replace(/\s/g, '')}`] = sliceE(t);

const WINDOWS = [['A1', 'Light'], ['A2', 'Dark'], ['B1', 'Midnight'], ['B2', 'Purple Dream'], ['C', 'Light'], ['D', 'Dark'], ['E-Light', 'Light'], ['E-Dark', 'Dark'], ['E-Midnight', 'Midnight'], ['E-PurpleDream', 'Purple Dream']];
(async () => {
  const runs = WINDOWS.filter(([k]) => !ONLY.length || ONLY.includes(k)); const out = []; let next = 0;
  // SIX WINDOWS AT ALL TIMES (RULE Z): each of six lanes takes the next slice the moment its window closes
  const lane = async (slot) => { for (let i = next++; i < runs.length; i = next++) {
    const [k, th] = runs[i];
    const { browser, page, errs } = await H.open({ headed: true, w: 1240, h: 820, pos: [(slot % 3) * 640, Math.floor(slot / 3) * 520] });
    const ok = (what, pass, detail = '') => { const l = `${pass ? 'SAW ' : 'FAIL'} [${k} · ${th}] ${what}${detail ? ' — ' + detail : ''}`; out.push(l); console.log(l); };
    try { await editorTheme(page, th); await SLICES[k](page, ok); await page.screenshot({ path: path.join(OUT, `${k}.png`) }); }
    catch (e) { ok(`step ${page.__step || '?'}: ${e.message.split('\n')[0]}`, false); await page.screenshot({ path: path.join(OUT, `${k}-error.png`) }).catch(() => {}); }
    if (errs.length) ok('page errors', false, errs.join(' | '));
    await browser.close();
  } };
  await Promise.all(Array.from({ length: Math.min(POOL, runs.length) }, (_, s) => lane(s)));
  const fails = out.filter((l) => l.startsWith('FAIL'));
  console.log(`\n${out.length} checks, ${fails.length} failed`); for (const l of fails) console.log(l);
})();
