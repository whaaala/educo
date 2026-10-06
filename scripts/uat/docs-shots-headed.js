// BATCH D-3 (1) — the pictures in docs/guide/layout-story.md and layout-reference.md, taken from the real builder.
// Six HEADED windows; every state BUILT THROUGH THE UI (RULE Y); each picture resized to the width it is shown at and saved
// as WebP in docs/guide/img/ (RULE AF weight). Checklist: docs/TASK_TREE.md BATCH D-3, V1–V3.
//   NODE_PATH=node_modules node scripts/uat/docs-shots-headed.js [--only=A,C]
const path = require('path'); const fs = require('fs'); const sharp = require('sharp');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const IMG = path.join(__dirname, '../../docs/guide/img'); fs.mkdirSync(IMG, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const report = [];

/** A picture of the window (or of `clip`, a rect or a selector), resized to `width` at most, saved as docs/guide/img/<name>.webp. */
async function snap(page, name, { clip = null, width = 800 } = {}) {
  let rect = clip;
  // A whole-window shot ends a little under the page's last block (D3-24: half of each picture was empty canvas)
  if (!clip) { const vp = page.viewportSize(); const foot = await page.evaluate(() => Math.max(0, ...[...document.querySelectorAll('[data-box-id]')].map((e) => e.getBoundingClientRect().bottom)));
    rect = { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, Math.max(360, Math.ceil(foot) + 48)) }; }
  if (typeof clip === 'string') { const b = await page.locator(clip).first().boundingBox(); rect = b && { x: Math.max(0, b.x), y: Math.max(0, b.y), width: b.width, height: Math.min(b.height, page.viewportSize().height - Math.max(0, b.y)) }; }
  const buf = await page.screenshot(rect ? { clip: rect } : {});
  const out = path.join(IMG, `${name}.webp`);
  const meta = await sharp(buf).metadata();
  await sharp(buf).resize({ width: Math.min(width, meta.width) }).webp({ quality: 78 }).toFile(out);
  const kb = Math.round(fs.statSync(out).size / 1024); report.push(`${name}.webp ${Math.min(width, meta.width)}px ${kb} KB${kb > 80 ? '  OVER 80 KB' : ''}`);
}
const chip = async (page, name) => { await page.getByRole('button', { name }).first().click(); await page.waitForTimeout(700); };
const deselect = async (page) => { await page.keyboard.press('Escape'); await page.keyboard.press('Escape'); await page.waitForTimeout(300); };
/** The real Preview at a phone: the page a visitor sees, its bar hidden with H. */
async function previewAt(page, w, h, name) {
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1200);
  await page.keyboard.press('h'); await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(900);
  const f = await (await page.$('iframe')).contentFrame();
  const foot = await f.evaluate(() => Math.max(0, ...[...document.querySelectorAll('body *')].filter((e) => e.children.length === 0 && e.getBoundingClientRect().height > 0).map((e) => e.getBoundingClientRect().bottom)));
  await snap(page, name, { width: w, clip: { x: 0, y: 0, width: w, height: Math.min(h, Math.max(320, Math.ceil(foot) + 32)) } });
  await page.setViewportSize({ width: 1280, height: 800 }); await page.keyboard.press('h'); await page.waitForTimeout(300);
  await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {}); await page.waitForTimeout(700);
}
const words = (page, id, w) => I.text(page, id, w);

const SLICES = {
  // §1 the three shapes · §2 a photo beside words (canvas + Preview phone) · §6½ space by default
  async A(page) {
    await H.panel(page, true);
    const s = await P.first(page, 'Stack'); const h = await P.into(page, s, 'Heading');
    const t = await P.under(page, s, 'Stack'); const tx = await P.into(page, t, 'Text'); const im = await P.beside(page, t, 'Image');
    await H.panel(page, false); await H.fillImages(page);
    await words(page, h, 'Year 6 — our class page'); await words(page, tx, 'This term we are learning about rivers: where they start, how they shape the land, and why towns grow beside them. Our trip to the river is on the 14th.');
    await H.select(page, t); await H.dragEdge(page, 'right', 120); await deselect(page);
    await snap(page, 'story-photo-beside-desktop');
    await previewAt(page, 375, 760, 'story-photo-beside-phone');
    await H.select(page, h); await I.tab(page, 'Design'); await I.section(page, 'Spacing');
    await page.getByRole('button', { name: /^\s*Spacing\s*$/i }).first().evaluate((e) => e.scrollIntoView({ block: 'start' })); await page.waitForTimeout(300);
    await snap(page, 'story-spacing-default', { clip: 'aside[aria-label="Inspector"]', width: 360 });
    void im;
  },
  // §3 three cards across (canvas + Preview phone)
  async B(page) {
    await H.panel(page, true);
    const s = await P.first(page, 'Stack'); const h = await P.into(page, s, 'Heading');
    await H.panel(page, false); await H.select(page, s); await H.panel(page, true);
    const g = await P.grid(page, 3, 1); await H.panel(page, false);
    await words(page, h, 'Our clubs');
    const cells = await page.evaluate((gid) => [...document.querySelector(`[data-box-id="${gid}"]`).querySelectorAll(':scope > [data-box-id]')].map((e) => e.getAttribute('data-box-id')), g);
    await H.panel(page, true); for (const c of cells.slice(0, 3)) await P.into(page, c, 'Card'); await H.panel(page, false);
    await H.fillImages(page); await deselect(page);
    await snap(page, 'story-cards-desktop');
    await previewAt(page, 375, 760, 'story-cards-phone');
  },
  // §4 a sidebar that stays put (canvas with Placement open + Preview phone)
  async C(page) {
    await H.panel(page, true);
    const a = await P.first(page, 'Stack'); const ah = await P.into(page, a, 'Heading'); const at = await P.under(page, ah, 'Text');
    const side = await P.beside(page, a, 'Stack'); const sh = await P.into(page, side, 'Heading'); const st = await P.under(page, sh, 'Text');
    await H.panel(page, false);
    await words(page, ah, 'Term dates 2026–27'); await words(page, at, 'Autumn term starts on Monday 7 September and ends on Friday 18 December. Half term is the week of 26 October. Spring term starts on Tuesday 5 January…');
    await words(page, sh, 'In this section'); await words(page, st, 'Term dates · Uniform · Lunch menu · Clubs');
    await H.select(page, a); await H.dragEdge(page, 'right', 160);
    await I.meaning(page, a, 'Main content'); await I.meaning(page, side, 'Sidebar'); await I.sticky(page, side);
    await snap(page, 'story-sidebar-desktop');
    await deselect(page); await previewAt(page, 375, 760, 'story-sidebar-phone');
  },
  // §5 a drag with its live label · §6 hidden on one device
  async D(page) {
    await H.panel(page, true);
    const a = await P.first(page, 'Stack'); const at = await P.into(page, a, 'Text'); const b = await P.beside(page, a, 'Stack'); const bt = await P.into(page, b, 'Text');
    await H.panel(page, false);
    await words(page, at, 'Words on the left'); await words(page, bt, 'Words on the right');
    const wOf = (id) => page.evaluate((id) => Math.round(document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect().width), id);
    const w0 = await wOf(a);
    await H.select(page, a); const hd = await H.handleOf(page, 'right'); const cx = hd.x + hd.width / 2, cy = hd.y + hd.height / 2;
    await page.mouse.move(cx, cy); await page.mouse.down(); for (let i = 1; i <= 10; i++) { await page.mouse.move(cx + 14 * i, cy); await page.waitForTimeout(20); }
    const live = await page.evaluate(() => document.querySelector('[data-span-live]')?.textContent ?? null);
    // D3-26: the real pointer resting over a headed window sends its own mousemove during the screenshot — back to the target first
    await snap(page, 'story-drag-edge'); await page.mouse.move(cx + 140, cy); await page.mouse.up(); await page.waitForTimeout(400);
    report.push(`D3-25 drag: before ${w0} · grabbed at x ${Math.round(cx)} · live "${live}" · after ${await wOf(a)} · chip ${await page.evaluate(() => document.querySelector('[data-span-chip]')?.textContent ?? null)}`);
    await chip(page, 'Mobile (375px)'); await H.select(page, b); await I.tab(page, 'Per-device');
    const c = page.getByLabel(/Hidden on (mobile|phone)/i).first(); await c.check(); await c.evaluate((e) => e.scrollIntoView({ block: 'center' })); await page.waitForTimeout(400);
    report.push('D3-25 ' + await page.evaluate(([a, at]) => { const r = (id) => document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); return `stack ${Math.round(r(a).width)} text ${Math.round(r(at).width)}x${Math.round(r(at).height)}`; }, [a, at]));
    await snap(page, 'story-hide-mobile', { clip: { x: 0, y: 0, width: 1280, height: 800 } }); // the Inspector's box is the point
    await I.tab(page, 'Design'); await chip(page, 'Full width');
  },
  // §6¾ the page grid: guides, Shift half-lines, the Page grid panel
  async E(page) {
    await H.panel(page, true);
    const s = await P.first(page, 'Stack'); await P.into(page, s, 'Heading'); const im = await P.beside(page, s, 'Image');
    const c1 = await P.tileAfter(page, im, 'Card'); const c2 = await P.beside(page, c1, 'Card'); await P.beside(page, c2, 'Card');
    await H.panel(page, false); await H.fillImages(page);
    await page.getByRole('button', { name: 'Layout guides', exact: true }).first().click(); await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    await H.select(page, c2); await snap(page, 'story-page-grid-guides');
    await page.keyboard.down('Shift'); await page.waitForTimeout(300); await snap(page, 'story-page-grid-shift'); await page.keyboard.up('Shift');
    await deselect(page);
    const box = await page.locator('[data-canvas-scroller]').boundingBox();
    await page.mouse.click(box.x + 8, box.y + box.height - 8, { button: 'right' }); await page.getByRole('menuitem', { name: 'Page grid…' }).click();
    await page.waitForSelector('[role="dialog"][aria-label="Page grid"]'); await page.waitForTimeout(400);
    await snap(page, 'ref-page-grid-panel', { clip: '[role="dialog"][aria-label="Page grid"]', width: 420 });
  },
  // the reference's panels · §11 the editor on a tablet
  async F(page) {
    const zb = await page.getByRole('group', { name: 'Canvas zoom' }).boundingBox(); // the bar ends under its second row
    await snap(page, 'ref-top-bar', { clip: { x: 0, y: 0, width: 1280, height: Math.ceil(zb.y + zb.height + 8) }, width: 800 });
    await H.panel(page, true); await page.waitForTimeout(400);
    const pr = await page.evaluate(() => { const p = [...document.querySelectorAll('*')].find((e) => /^\s*Add a block/.test(e.firstChild?.textContent || '') && e.getBoundingClientRect().width < 500); const c = p && (p.closest('[class*="fixed"], [class*="absolute"]') || p); const r = c.getBoundingClientRect(); return { x: Math.max(0, r.left), y: Math.max(0, r.top), width: r.width, height: Math.min(r.height, innerHeight - r.top) }; });
    await snap(page, 'ref-blocks-panel', { clip: pr, width: 340 });
    const s = await P.first(page, 'Stack'); const h = await P.into(page, s, 'Heading'); await P.under(page, h, 'Text');
    await H.panel(page, false); await words(page, h, 'Welcome to Hillside Primary');
    await H.select(page, s);
    const tb = await page.locator('[role="toolbar"]').first().boundingBox();
    await snap(page, 'ref-block-toolbar', { clip: { x: Math.max(0, tb.x - 12), y: Math.max(0, tb.y - 12), width: tb.width + 24, height: tb.height + 24 }, width: 600 });
    await I.tab(page, 'Design'); await snap(page, 'ref-inspector-design', { clip: 'aside[aria-label="Inspector"]', width: 360 });
    await H.select(page, h); await I.tab(page, 'Content'); await snap(page, 'ref-inspector-content', { clip: 'aside[aria-label="Inspector"]', width: 360 });
    await I.tab(page, 'Per-device'); await snap(page, 'ref-inspector-device', { clip: 'aside[aria-label="Inspector"]', width: 360 });
    await I.tab(page, 'Design');
  },
  // V4 — the §2 / §4 tip: "Whole line" at the Mobile chip puts the photo under the words on a phone, and nowhere else
  async H(page) {
    await H.panel(page, true);
    const t = await P.first(page, 'Stack'); const tx = await P.into(page, t, 'Text'); const im = await P.beside(page, t, 'Image');
    await H.panel(page, false); await H.fillImages(page);
    await words(page, tx, 'This term we are learning about rivers: where they start, how they shape the land, and why towns grow beside them.');
    await chip(page, 'Mobile (375px)'); await H.select(page, im); await I.tab(page, 'Design'); await I.section(page, 'Size');
    const wl = page.getByRole('button', { name: 'Whole line', exact: true }).first(); await wl.scrollIntoViewIfNeeded(); await wl.click(); await page.waitForTimeout(500);
    await deselect(page); await chip(page, 'Full width');
    const desk = await page.evaluate(([a, b]) => { const r = (id) => document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); return r(b).left > r(a).right - 2; }, [t, im]);
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe'); await page.waitForTimeout(1200);
    await page.setViewportSize({ width: 375, height: 760 }); await page.waitForTimeout(900);
    const f = await (await page.$('iframe')).contentFrame();
    const under = await f.evaluate(() => { const im = document.querySelector('img'); const p = [...document.querySelectorAll('p')].find((e) => e.textContent.includes('rivers')); return im && p ? im.getBoundingClientRect().top >= p.getBoundingClientRect().bottom - 1 : null; });
    report.push(`V4 tip: Whole line at Mobile → on the phone Preview the photo is under the words: ${under} · on the desktop canvas still beside: ${desk}`);
  },
  // §11 the editor on a tablet — OPENED at 768, as on an iPad (the Inspector starts closed below 64em)
  async G(page) {
    await H.panel(page, true); const s = await P.first(page, 'Stack'); const h = await P.into(page, s, 'Heading');
    await H.panel(page, false); await words(page, h, 'Welcome to Hillside Primary');
    await page.getByRole('button', { name: 'Collapse inspector' }).click().catch(() => {}); await page.waitForTimeout(400);
    await H.select(page, h); await snap(page, 'story-tablet-editor', { width: 384 });
    await page.getByRole('button', { name: 'Expand inspector' }).click(); await page.waitForTimeout(600);
    await snap(page, 'story-tablet-inspector', { width: 384 });
  },
};

(async () => {
  const names = Object.keys(SLICES).filter((k) => !ONLY.length || ONLY.includes(k));
  const res = await Promise.all(names.map(async (k, i) => {
    const { browser, page, errs } = await H.open({ headed: true, w: k === 'G' ? 768 : 1280, h: k === 'G' ? 1024 : 800, pos: [(i % 3) * 420, Math.floor(i / 3) * 440] });
    try { await SLICES[k](page); return `${k} ok${errs.length ? ' · page errors: ' + errs.join(' | ') : ''}`; }
    catch (e) { await page.screenshot({ path: path.join(__dirname, 'logs', `d3-fail-${k}.png`) }).catch(() => {}); return `${k} FAILED at ${page.__step || '?'}: ${e.message.split('\n')[0]}`; }
    finally { await browser.close(); }
  }));
  console.log(res.join('\n')); console.log(report.sort().join('\n'));
})();
