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
/** A component's ask-on-add, as a person meets it: click the tile, and the buttons it offers (Default first) and their box. */
async function ask(page, comp) {
  const tile = page.locator('[draggable="true"]').filter({ hasText: new RegExp('^\\s*' + comp) }).first();
  await tile.scrollIntoViewIfNeeded(); await tile.click(); await page.waitForTimeout(1500);
  return page.evaluate(() => { const d = [...document.querySelectorAll('button')].find((b) => b.innerText.trim() === 'Default' && b.getBoundingClientRect().width);
    if (!d) return null; let box = d.parentElement; while (box && box.querySelectorAll('button').length < 4) box = box.parentElement;
    const r = box.getBoundingClientRect();
    return { names: [...box.querySelectorAll('button')].map((b) => b.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean), rect: { x: r.left, y: r.top, width: r.width, height: Math.min(r.height, innerHeight - r.top) } }; });
}

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
    await H.panel(page, false); await H.select(page, h); await page.getByRole('button', { name: 'Expand inspector' }).click().catch(() => {}); await page.waitForTimeout(500); // starts closed below 64em (E1-2)
    await words(page, h, 'Welcome to Hillside Primary');
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
    await H.panel(page, false); await H.select(page, h); await page.getByRole('button', { name: 'Expand inspector' }).click().catch(() => {}); await page.waitForTimeout(500); // starts closed below 64em (E1-2)
    await words(page, h, 'Welcome to Hillside Primary');
    await page.getByRole('button', { name: 'Collapse inspector' }).click().catch(() => {}); await page.waitForTimeout(400);
    await H.select(page, h); await snap(page, 'story-tablet-editor', { width: 384 });
    await page.getByRole('button', { name: 'Expand inspector' }).click(); await page.waitForTimeout(600);
    await snap(page, 'story-tablet-inspector', { width: 384 });
  },

  // ── D-3 (2): the Website Builder guide's non-layout parts (W2 / W3) — each slice checks the words AND takes the picture ──
  // §2 the Blocks panel: docked on a laptop (the page moves over), the Text group's Link tile, the Accordion's hint (D3-33, D3-43)
  async I(page) {
    const pageX = () => page.evaluate(() => Math.round(document.querySelector('[data-box-id]').getBoundingClientRect().left));
    const x0 = await pageX();
    await H.panel(page, true); await page.waitForTimeout(500);
    const x1 = await pageX();
    const tiles = await page.locator('[draggable="true"]').allInnerTexts();
    report.push(`W2 §2 Blocks panel at 1280: the page's left edge ${x0} → ${x1} (docked, the page moved over: ${x1 > x0 + 100}) · Link tile: ${tiles.some((t) => /^\s*Link/.test(t))} · Accordion tile: "${(tiles.find((t) => /^\s*Accordion/.test(t)) || '').replace(/\s+/g, ' ').trim()}"`);
    await snap(page, 'guide-blocks-panel', { clip: { x: 0, y: 0, width: 1280, height: 800 }, width: 800 });
    await page.keyboard.press('b'); await page.waitForTimeout(400);
    report.push(`W2 §2 B closes the panel: ${!(await page.getByRole('button', { name: 'Close blocks panel' }).count())}`);
  },
  // §3 / §12 the Accordion: the starts it offers, its designs in the CONTENT tab, items reordered with ↑ / ↓ (D3-41, D3-43)
  async J(page) {
    await H.panel(page, true); const ch = await ask(page, 'Accordion');
    const offered = ch ? ch.names : [];
    report.push(`W2 §12 Accordion offers: ${offered.map((t) => t.replace(/\s+/g, ' ').trim()).join(' | ') || '(no menu)'}`);
    if (ch) { await snap(page, 'guide-accordion-starts', { clip: ch.rect, width: 420 }); await page.getByRole('menuitem', { name: 'Q & A', exact: true }).first().click(); await page.waitForTimeout(800); }
    await H.panel(page, false);
    const acc = await page.evaluate(() => [...document.querySelectorAll('[data-box-id]')].map((e) => e.getAttribute('data-box-id')).pop());
    await H.select(page, acc); await I.tab(page, 'Design');
    const ins = page.locator('aside[aria-label="Inspector"]'); const has = (n) => ins.getByRole('button', { name: n }).count();
    const inDesign = { typo: await has(/^s*Typography/), css: await has(/^s*Advanced CSS/) };
    await I.tab(page, 'Content'); await page.waitForTimeout(400);
    report.push(`W2 §5/§12 Design tab: Typography ${inDesign.typo} · Advanced CSS ${inDesign.css} — Content tab: Typography ${await has(/^s*Typography/)} · Advanced CSS ${await has(/^s*Advanced CSS/)} · "29 designs" ${await ins.getByText(/29 designs/).count()} · item arrows ${await ins.locator('button[aria-label^="Move"]').count()} · drag handles on items ${await ins.locator('[draggable="true"]').count()}`);
    await snap(page, 'guide-accordion-content', { clip: 'aside[aria-label="Inspector"]', width: 360 });
  },
  // §13 the Alert: what it asks, and its Severity names (D3-41)
  async K(page) {
    await H.panel(page, true); const ch = await ask(page, 'Alert');
    const offered = ch ? ch.names : [];
    report.push(`W2 §13 Alert asks: ${offered.map((t) => t.replace(/\s+/g, ' ').trim()).join(' | ') || '(no menu)'}`);
    if (ch) { await page.getByRole('menuitem', { name: 'Information', exact: true }).first().click(); await page.waitForTimeout(800); }
    await H.panel(page, false);
    const al = await page.evaluate(() => [...document.querySelectorAll('[data-box-id]')].map((e) => e.getAttribute('data-box-id')).pop());
    await H.select(page, al); await I.tab(page, 'Content'); await page.waitForTimeout(400);
    const sevEl = page.getByLabel('Alert severity').first(); await sevEl.scrollIntoViewIfNeeded();
    const sev = [await sevEl.evaluate((e) => e.tagName === 'SELECT' ? [...e.options].map((o) => o.text).join(' / ') : e.innerText)];
    report.push(`W2 §13 Severity options: ${sev.join(' ; ') || '(none found)'}`);
  },
  // §9 the website theme menu · §10 the Preview's bar and its hide arrow (D3-42)
  async L(page) {
    await page.getByRole('button', { name: /Website theme/ }).first().click(); await page.waitForTimeout(500);
    const menu = page.locator('[role="menu"], [role="listbox"], [role="dialog"]').last();
    report.push(`W2 §9 Website theme menu: ${(await menu.innerText().catch(() => '(none)')).replace(/\s+/g, ' ').slice(0, 160)}`);
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe'); await page.waitForTimeout(1200);
    const ifr = await page.locator('iframe').first().boundingBox();
    await snap(page, 'guide-preview-bar', { clip: { x: 0, y: 0, width: 1280, height: Math.max(80, Math.ceil(ifr.y) + 4) }, width: 800 });
    const hide = page.getByRole('button', { name: 'Hide the preview controls' });
    report.push(`W2 §10 Preview hide arrow: ${await hide.count()} · its text: "${((await hide.first().innerText().catch(() => '')) || '').trim()}"`);
    await page.keyboard.press('h'); await page.waitForTimeout(400);
    report.push(`W2 §10 H hides the bar → "Show the preview controls" present: ${await page.getByRole('button', { name: 'Show the preview controls' }).count()}`);
    await page.keyboard.press('h'); await page.getByRole('button', { name: /Exit preview/ }).first().click(); await page.waitForTimeout(500);
  },
  // §14b the Page check on a page with a picture not uploaded, a picture with no description, a link with no words · §10 Export
  async M(page) {
    await H.panel(page, true);
    const s = await P.first(page, 'Stack'); await P.into(page, s, 'Heading'); const im = await P.under(page, s, 'Image'); await P.beside(page, im, 'Image');
    await H.panel(page, false); await H.fillImages(page);
    await P.under(page, s, 'Image').catch(() => {}); await H.panel(page, false); // one left without a picture
    await page.getByRole('button', { name: /Page check/ }).first().click(); await page.waitForTimeout(600);
    const pc = page.locator('[role="dialog"]').last();
    report.push(`W2 §14b Page check: ${(await pc.innerText()).replace(/\s+/g, ' ').slice(0, 400)}`);
    const panelRect = await page.evaluate(() => { let e = [...document.querySelectorAll('h2, h3, [id]')].find((h) => h.textContent.trim() === 'Page check'); while (e && e.getBoundingClientRect().width < 360) e = e.parentElement;
      while (e && e.parentElement && e.parentElement.getBoundingClientRect().width < innerWidth * 0.9) e = e.parentElement; const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: Math.min(r.height, innerHeight - r.top) }; });
    await snap(page, 'guide-page-check', { clip: panelRect, width: 560 });
    await pc.getByRole('button', { name: /^Close/ }).first().click().catch(() => page.keyboard.press('Escape')); await page.waitForTimeout(400);
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), page.getByRole('button', { name: 'Export', exact: true }).first().click()]);
    const buf = fs.readFileSync(await dl.path()); const names = []; // the ZIP's central directory: signature 0x02014b50, name at +46
    for (let i = buf.indexOf(Buffer.from([0x50, 0x4b, 1, 2])); i >= 0; i = buf.indexOf(Buffer.from([0x50, 0x4b, 1, 2]), i + 4)) names.push(buf.slice(i + 46, i + 46 + buf.readUInt16LE(i + 28)).toString());
    report.push(`W2 §10 Export: ${dl.suggestedFilename()} holds ${names.join(', ')}`);
  },
  // D3-44 the gallery setup's ✕ on a photo: hidden at rest, shown on hovering the photo, always shown on a touch screen
  async N(page) {
    const tmp = path.join(__dirname, 'logs', 'd3-photos'); fs.mkdirSync(tmp, { recursive: true });
    const files = await Promise.all(['#c96', '#69c', '#9c6'].map(async (c, i) => { const f = path.join(tmp, `p${i}.png`); await sharp({ create: { width: 400, height: 300, channels: 3, background: c } }).png().toFile(f); return f; }));
    await H.panel(page, true); await H.clickTile(page, 'Photo gallery'); await page.waitForTimeout(600);
    await page.locator('input[type="file"]').first().setInputFiles(files); await page.waitForTimeout(2500);
    const x = page.getByRole('button', { name: /^Remove photo 1/ }); const op = () => x.evaluate((e) => getComputedStyle(e).opacity);
    const atRest = await op(); await page.locator('li:has(> button[aria-label^="Remove photo 1"]) img').hover(); await page.waitForTimeout(300);
    const onPhoto = await op();
    const menu = await page.evaluate(() => { const m = document.querySelector('button[aria-label^="Remove photo 1"]').closest('[role="dialog"], [role="menu"], div.fixed, div.absolute'); const r = m.getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: Math.min(r.height, innerHeight - r.top) }; });
    await snap(page, 'guide-gallery-setup', { clip: menu, width: 360 });
    // A touch screen, as a phone or tablet really is (hover: none, coarse pointer): its own context, the same steps by tapping
    const ctx = await page.context().browser().newContext({ viewport: { width: 1024, height: 768 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    const tp = await ctx.newPage(); await tp.goto((process.env.BASE || 'http://localhost:3100') + '/website/box-demo', { waitUntil: 'load' });
    await tp.getByRole('button', { name: 'Open blocks panel' }).waitFor(); await tp.waitForTimeout(1200);
    const media = await tp.evaluate(() => matchMedia('(hover: none)').matches);
    await tp.getByRole('button', { name: 'Open blocks panel' }).tap(); await tp.waitForTimeout(600);
    const tile = tp.locator('[draggable="true"]').filter({ hasText: /^s*Photo gallery/ }).first(); await tile.scrollIntoViewIfNeeded(); await tile.tap(); await tp.waitForTimeout(800);
    await tp.locator('input[type="file"]').first().setInputFiles(files); await tp.waitForTimeout(2500);
    const touch = await tp.getByRole('button', { name: /^Remove photo 1/ }).evaluate((e) => getComputedStyle(e).opacity);
    await tp.getByRole('button', { name: /^Remove photo 1/ }).tap(); await tp.waitForTimeout(400);
    const left = await tp.getByRole('button', { name: /^Remove photo/ }).count(); await ctx.close();
    report.push(`D3-44 the ✕ opacity: at rest ${atRest} · hovering the photo ${onPhoto} · touch screen (hover: none = ${media}) ${touch}, a tap removes it (${left} of 3 left) → ${atRest === '0' && onPhoto === '1' && media && touch === '1' && left === 2 ? 'PASS' : 'FAIL'}`);
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
