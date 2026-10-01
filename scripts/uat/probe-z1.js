// Z-1 HEADED UAT — the batch checklist in docs/TASK_TREE.md, built through the UI (RULE Y), one window per case.
//   --theme=Light|Dark|Midnight|"Purple Dream"   the editor AND the website in that theme, every checklist line
//   --case=narrow                                 the toolbar at 375 · 768 · 1280 browser widths
//   --case=browser200                             the builder at 200% BROWSER zoom (a 760×450 CSS viewport at 2× pixels)
// Usage: NODE_PATH=node_modules node scripts/uat/probe-z1.js --theme=Dark --slot=1
const H = require('./h.js');
const P = require('./pages.js').helpers;
const path = require('path');
const { chromium } = require('playwright');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
const THEME = arg('theme', 'Light'), CASE = arg('case', 'theme'), slot = +arg('slot', 0);
const BASE = process.env.BASE || 'http://localhost:3100';
const out = []; const fail = [];
const check = (ok, line, seen) => { (ok ? out : fail).push(`${ok ? 'OK  ' : 'FAIL'} ${line} — ${seen}`); };
const tag = CASE === 'theme' ? THEME.replace(/\W+/g, '') : CASE;
const shot = (page, n) => page.screenshot({ path: path.join(__dirname, 'probe-z1-out', `${tag}-${n}.png`) });
require('fs').mkdirSync(path.join(__dirname, 'probe-z1-out'), { recursive: true });

const zoomOf = (page) => page.evaluate(() => document.querySelector('[data-box-id]').closest('[data-canvas-scale]')?.dataset.canvasScale * 1);
const readout = (page) => page.getByRole('group', { name: 'Canvas zoom' }).locator('button').nth(1).innerText();
const pick = async (page, label) => { await page.getByRole('group', { name: 'Canvas zoom' }).locator('button').nth(1).click(); await page.getByRole('option', { name: label }).first().click(); await page.waitForTimeout(350); };
const lum = (rgb) => { const [r, g, b] = rgb.match(/[\d.]+/g).slice(0, 3).map(Number).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };

async function themeCase() {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 900, pos: [(slot % 3) * 500, Math.floor(slot / 3) * 420] });
  try {
    if (THEME !== 'Light') {
      await page.getByRole('button', { name: 'Website theme' }).first().click(); await page.waitForTimeout(300);
      await page.getByRole('menuitemradio', { name: new RegExp(THEME) }).first().click(); await page.waitForTimeout(400);
      await page.getByRole('button', { name: 'Change theme' }).first().click(); await page.waitForTimeout(300);
      await page.getByRole('menuitemradio', { name: new RegExp(THEME) }).first().click(); await page.waitForTimeout(400);
    }
    // A page built through the palette: a heading, a text, an accordion and a stack, then Wide (fitted below 100%).
    await H.panel(page, true);
    for (const t of ['Heading', 'Text', 'Accordion']) await H.clickTile(page, t);
    const stack = await P.first(page, 'Stack');
    for (let i = 0; i < 6; i++) await H.clickTile(page, 'Text');
    await H.panel(page, false);
    await page.locator('button[title="Wide (1920px)"]').first().click(); await page.waitForTimeout(600);
    const sc = page.locator('[data-canvas-scroller]'); const scb = await sc.boundingBox();
    const over = () => page.mouse.move(scb.x + 300, scb.y + 300);

    // (1) controls: readout, menu by keyboard, limits, names, contrast
    check(/^Fit · \d+%$/.test(await readout(page)), '(1) readout while fitted', await readout(page));
    const ro = page.getByRole('group', { name: 'Canvas zoom' }).locator('button').nth(1);
    await ro.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(300);
    const menuOpen = await page.getByRole('listbox').count();
    const opts = await page.getByRole('option').allInnerTexts();
    await page.keyboard.press('Escape'); await page.waitForTimeout(250);
    check(menuOpen === 1 && opts.some((o) => o === '150%') && opts.some((o) => /^Fit/.test(o)), '(1) menu opens from the keyboard, lists Fit…400%', `${menuOpen} listbox · ${opts.join(' | ')}`);
    check(!(await page.getByRole('listbox').count()), '(1) Escape closes the menu', `${await page.getByRole('listbox').count()} open`);
    await pick(page, '150%'); check(await readout(page) === '150%', '(1) choosing 150% from the menu', `${await readout(page)} · page zoom ${await zoomOf(page)}`);
    const plus = page.getByRole('button', { name: 'Zoom canvas in' }), minus = page.getByRole('button', { name: 'Zoom canvas out' });
    for (let i = 0; i < 12 && await plus.isEnabled(); i++) await plus.click();
    check(await readout(page) === '400%' && await plus.isDisabled(), '(1) + stops at 400%', await readout(page));
    for (let i = 0; i < 14 && await minus.isEnabled(); i++) await minus.click();
    check(await readout(page) === '25%' && await minus.isDisabled(), '(1) − stops at 25%', await readout(page));
    const contrast = await page.evaluate(() => { const g = document.querySelector('[role=group][aria-label="Canvas zoom"]'); const ro = g.querySelectorAll('button')[1]; let bg = 'rgba(0, 0, 0, 0)', e = ro; while (e && /rgba\(0, 0, 0, 0\)|transparent/.test(bg)) { bg = getComputedStyle(e).backgroundColor; e = e.parentElement; } return { fg: getComputedStyle(ro).color, bg }; });
    const L1 = lum(contrast.fg), L2 = lum(contrast.bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    check(ratio >= 4.5, '(1) readout text contrast ≥ 4.5:1', `${ratio.toFixed(2)} (${contrast.fg} on ${contrast.bg})`);
    await shot(page, '1-controls');

    // (5) the editor's chrome keeps its screen size: an accordion item's toolbar and a block's resize handle
    const sizes = [];
    for (const z of ['25%', '50%', '100%', '200%', '400%']) {
      if (z === '25%') { await pick(page, /^Fit/); for (let i = 0; i < 14 && await minus.isEnabled(); i++) await minus.click(); } else await pick(page, z);
      const item = page.locator('[data-eu-item]').nth(1);
      await item.evaluate((e) => e.scrollIntoView({ block: 'center', inline: 'center' })); await page.waitForTimeout(250);
      const bar = page.getByRole('toolbar', { name: 'Edit this item' });
      for (let i = 0; i < 3 && !(await bar.count()); i++) { const b = await item.boundingBox(); const top = Math.max(b.y, scb.y + 4); const left = Math.max(b.x, scb.x + 4); await page.mouse.click(left + Math.min(30, (Math.min(b.x + b.width, scb.x + scb.width) - left) / 3), top + Math.min(8, (Math.min(b.y + b.height, scb.y + scb.height) - top) / 3)); await page.waitForTimeout(350); } // the part of a tall item that is on screen
      const tb = await bar.boundingBox().catch(() => null);
      const btn = await bar.locator('button').last().boundingBox().catch(() => null);
      const hd = await page.locator('[aria-label="Resize right edge"]').first().boundingBox().catch(() => null);
      sizes.push({ z, bar: tb && Math.round(tb.height), btn: btn && Math.round(Math.min(btn.width, btn.height)), handle: hd && Math.round(hd.height) });
      if (z === '200%') await shot(page, '5-chrome-200');
    }
    const bars = sizes.map((s) => s.bar).filter(Boolean), hds = sizes.map((s) => s.handle).filter(Boolean), btns = sizes.map((s) => s.btn).filter(Boolean);
    check(bars.length === 5 && Math.max(...bars) - Math.min(...bars) <= 2, '(5) item toolbar the same height at 25–400%', JSON.stringify(sizes));
    check(btns.length === 5 && Math.min(...btns) >= 24, '(5) item toolbar buttons ≥ 24px', btns.join(' · '));
    check(hds.length >= 4 && Math.max(...hds) - Math.min(...hds) <= 2, '(5) resize handle the same size', hds.join(' · '));
    await page.keyboard.press('Escape');

    // (4) at 400%: reach all four edges; Space+drag and middle-drag pan; a space typed in a text block is a space
    await pick(page, '400%');
    const edges = await page.evaluate(async () => { const s = document.querySelector('[data-canvas-scroller]'), f = document.querySelector('[data-box-id]').closest('[style*="container-type"]'); const r = () => { const a = f.getBoundingClientRect(), b = s.getBoundingClientRect(); return { l: a.left - b.left, r: b.right - a.right, t: a.top - b.top, b: b.bottom - a.bottom }; }; const w = () => new Promise((res) => setTimeout(res, 120)); s.scrollLeft = 0; s.scrollTop = 0; await w(); const tl = r(); s.scrollLeft = 1e7; s.scrollTop = 1e7; await w(); const br = r(); return { left: tl.l, top: tl.t, right: br.r, bottom: br.b }; });
    check(edges.left >= -1 && edges.top >= -1 && edges.right >= -1 && edges.bottom >= -1, '(4) all four page edges reachable at 400%', JSON.stringify(Object.fromEntries(Object.entries(edges).map(([k, v]) => [k, Math.round(v)]))));
    await page.evaluate(() => { const s = document.querySelector('[data-canvas-scroller]'); s.scrollLeft = 600; s.scrollTop = 300; });
    await over(); const s0 = await sc.evaluate((e) => [e.scrollLeft, e.scrollTop]);
    await page.keyboard.down('Space'); await page.mouse.down(); await page.mouse.move(scb.x + 200, scb.y + 220, { steps: 6 }); await page.mouse.up(); await page.keyboard.up('Space');
    const s1 = await sc.evaluate((e) => [e.scrollLeft, e.scrollTop]);
    check(Math.abs(s1[0] - s0[0] - 100) <= 3 && Math.abs(s1[1] - s0[1] - 80) <= 3, '(4) Space + drag pans', `moved ${Math.round(s1[0] - s0[0])}, ${Math.round(s1[1] - s0[1])} (expected 100, 80)`);
    await over(); await page.mouse.down({ button: 'middle' }); await page.mouse.move(scb.x + 250, scb.y + 300, { steps: 6 }); await page.mouse.up({ button: 'middle' });
    const s2 = await sc.evaluate((e) => [e.scrollLeft, e.scrollTop]);
    check(Math.abs(s2[0] - s1[0] - 50) <= 3, '(4) middle-drag pans', `moved ${Math.round(s2[0] - s1[0])}, ${Math.round(s2[1] - s1[1])} (expected 50, 0)`);
    await pick(page, '100%');
    const txt = page.locator('[data-box-id] p').first();
    await txt.evaluate((e) => e.scrollIntoView({ block: 'center', inline: 'center' }));
    await txt.dblclick(); await page.waitForTimeout(300); await page.keyboard.press('End'); await page.keyboard.type(' zz'); await page.waitForTimeout(200);
    const typed = await page.evaluate(() => document.activeElement?.textContent || '');
    await page.keyboard.press('Escape'); await page.mouse.click(scb.x + 5, scb.y + scb.height - 5);
    check(/ zz$/.test(typed.trim()) || typed.includes(' zz'), '(4) Space typed in a text block is a space', JSON.stringify(typed.slice(-12)));

    // (2)+(3) keys on the canvas and the wheel round the pointer, here in this theme
    await over(); await page.keyboard.press('Control+Digit0'); await page.waitForTimeout(250); const k0 = await zoomOf(page);
    await page.keyboard.press('Shift+Digit1'); await page.waitForTimeout(250);
    check(Math.abs(k0 - 1) < 0.01 && /^Fit/.test(await readout(page)), '(2) Ctrl 0 → 100%, Shift 1 → Fit', `${k0} → ${await readout(page)}`);

    // (7) at 50 · 100 · 200 · 400%: a block dropped into the stack lands; the site file never holds a zoom
    const site0 = await page.evaluate(() => localStorage.getItem('educo_box_site_v1'));
    await H.panel(page, true); // the tiles are dragged from the Blocks panel
    let landed = 0;
    for (const z of ['50%', '100%', '200%', '400%']) {
      await pick(page, z);
      const before = await page.locator('[data-box-id]').count();
      await H.dropInto(page, 'Heading', stack).catch((e) => fail.push(`FAIL (7) drop at ${z} — ${e.message.split('\n')[0]}`));
      await page.waitForTimeout(400);
      if ((await page.locator('[data-box-id]').count()) > before) landed++;
    }
    check(landed === 4, '(7) a block dropped into the stack lands at 50 · 100 · 200 · 400%', `${landed} of 4`);
    const site1 = await page.evaluate(() => localStorage.getItem('educo_box_site_v1'));
    check(!/canvasZoom|"zoom"/.test(site1 || '') && site0 !== null, '(6) the saved site holds no zoom', `${(site1 || '').length} chars, no zoom key`);

    // (6) reload keeps Wide's zoom; Mobile opens at Fit
    await pick(page, '150%');
    await page.reload(); await page.waitForTimeout(2500);
    await page.locator('button[title="Wide (1920px)"]').first().click(); await page.waitForTimeout(500);
    const r1 = await readout(page);
    await page.locator('button[title="Mobile (375px)"]').first().click(); await page.waitForTimeout(500);
    check(r1 === '150%' && /^Fit/.test(await readout(page)), '(6) Wide kept 150% after a reload; Mobile at Fit', `${r1} · ${await readout(page)}`);

    // (8) the Preview is untouched by the zoom, and after closing it the shortcuts still work (Z1-e)
    await page.locator('button[title="Wide (1920px)"]').first().click(); await page.waitForTimeout(400);
    await page.getByRole('button', { name: /^Preview/ }).first().click(); await page.waitForTimeout(1200);
    await shot(page, '8-preview');
    const prevZoom = await page.evaluate(() => Array.from(document.querySelectorAll('*')).filter((e) => getComputedStyle(e).zoom && getComputedStyle(e).zoom !== '1').length);
    await page.keyboard.press('Escape'); await page.waitForTimeout(900);
    if (await page.getByRole('button', { name: /Close preview|Back to editor|Exit preview/ }).count()) await page.getByRole('button', { name: /Close preview|Back to editor|Exit preview/ }).first().click();
    await page.waitForTimeout(800);
    const scb2 = await page.locator('[data-canvas-scroller]').boundingBox();
    await page.mouse.move(scb2.x + 300, scb2.y + 300); await page.keyboard.press('Control+Digit0'); await page.waitForTimeout(300);
    check(prevZoom === 0, '(8) nothing in the Preview carries a CSS zoom', `${prevZoom} elements`);
    check(Math.abs((await zoomOf(page)) - 1) < 0.01, '(8) after the Preview, Ctrl 0 still works on the canvas', `${await zoomOf(page)}`);
    await shot(page, '9-end');
    check(errs.length === 0, 'no page errors', errs.slice(0, 3).join(' | ') || '0');
  } catch (e) { fail.push(`FAIL crashed — ${e.message.split('\n')[0]}`); await shot(page, 'crash').catch(() => {}); }
  finally { await browser.close(); }
}

async function narrowCase() {
  for (const w of [375, 768, 1280]) {
    const { browser, page, errs } = await H.open({ headed: true, w, h: 800, pos: [(slot % 3) * 500, Math.floor(slot / 3) * 420] });
    try {
      const g = await page.getByRole('group', { name: 'Canvas zoom' }).boundingBox();
      const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      check(g && g.x >= 0 && g.x + g.width <= w, `(1) zoom controls inside a ${w}px window`, g ? `x ${Math.round(g.x)}–${Math.round(g.x + g.width)}` : 'not found');
      check(over <= 0, `(1) no sideways page scroll at ${w}px`, `${over}px`);
      await page.getByRole('button', { name: 'Zoom canvas in' }).click(); await page.waitForTimeout(300);
      check(/%$/.test(await readout(page)), `(1) + works at ${w}px`, await readout(page));
      await page.screenshot({ path: path.join(__dirname, 'probe-z1-out', `narrow-${w}.png`) });
      check(errs.length === 0, `no page errors at ${w}px`, errs.slice(0, 2).join(' | ') || '0');
    } catch (e) { fail.push(`FAIL ${w}px crashed — ${e.message.split('\n')[0]}`); } finally { await browser.close(); }
  }
}

async function browser200Case() {
  // 200% browser zoom = the CSS viewport halved at twice the pixels — what a low-vision user sets (WCAG 1.4.4).
  const browser = await chromium.launch({ headless: false, args: [`--window-position=${(slot % 3) * 500},${Math.floor(slot / 3) * 420}`] });
  const page = await browser.newPage({ viewport: { width: 760, height: 450 }, deviceScaleFactor: 2 });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
  try {
    await page.goto(BASE + '/website/box-demo', { waitUntil: 'load' }); await page.waitForTimeout(4000);
    const g = await page.getByRole('group', { name: 'Canvas zoom' }).boundingBox();
    check(g && g.x + g.width <= 760, '(9) zoom controls reachable at 200% browser zoom', g ? `x ${Math.round(g.x)}–${Math.round(g.x + g.width)}` : 'not found');
    const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    check(over <= 0, '(9) no sideways page scroll at 200% browser zoom', `${over}px`);
    await page.getByRole('button', { name: 'Open blocks panel' }).first().click(); await page.waitForTimeout(500);
    const panel = await page.getByRole('dialog', { name: 'Blocks' }).boundingBox().catch(() => null);
    check(panel && panel.width > 150, '(9) the Blocks panel opens and is usable', panel ? `${Math.round(panel.width)}×${Math.round(panel.height)}` : 'not found');
    await page.screenshot({ path: path.join(__dirname, 'probe-z1-out', 'browser200.png') });
    check(errs.length === 0, 'no page errors at 200% browser zoom', errs.slice(0, 2).join(' | ') || '0');
  } catch (e) { fail.push(`FAIL browser200 crashed — ${e.message.split('\n')[0]}`); } finally { await browser.close(); }
}

(async () => {
  if (CASE === 'narrow') await narrowCase(); else if (CASE === 'browser200') await browser200Case(); else await themeCase();
  console.log(`== ${tag}: ${out.length} OK, ${fail.length} FAIL`);
  for (const l of [...fail, ...out]) console.log('  ' + l);
})();
