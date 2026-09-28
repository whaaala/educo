// HEADED UAT — the Link block (user, 2026-09-27), a menu of Links (#104), and a colour that stays where it was typed (#89).
// Built through the UI at the user's own screen and at 1366; the menu read back from the real Preview's HTML.
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
// a real school menu — seven links, enough to wrap on a phone so "Space down" can be seen
const NAMES = ['About', 'Admissions', 'News', 'Term dates', 'Clubs', 'Governors', 'Contact'];
const out = []; const say = (s) => { out.push(s); console.log(s); };
async function run(win) {
  const { browser, page, errs } = await H.open({ headed: true, w: win.w, h: win.h, pos: win.pos });
  const tag = `[${win.name}]`; const bad = [];
  await H.panel(page, true);
  // 1 — a Link from the palette, its words typed on the canvas, its address set in the Inspector
  const s = await P.first(page, 'Stack'); const l = await P.into(page, s, 'Link'); await H.panel(page, false);
  await I.text(page, l, 'Read our term dates'); await H.select(page, l); await I.tab(page, 'Content'); await I.section(page, 'Content');
  const f = page.getByLabel('Link', { exact: true }).first(); await f.fill('https://example.org/term-dates'); await f.blur(); await page.waitForTimeout(300);
  const url0 = page.url(); const lb = await page.locator(`[data-box-id="${l}"] a`).first().boundingBox();
  await page.mouse.click(lb.x + lb.width / 2, lb.y + lb.height / 2); await page.waitForTimeout(600);
  if (page.url() !== url0) bad.push('clicking the link in the editor navigated away');
  const look = await page.locator(`[data-box-id="${l}"] a`).first().evaluate((a) => { const c = getComputedStyle(a); return { deco: c.textDecorationLine, color: c.color, bg: c.backgroundColor, radius: c.borderRadius }; });
  if (look.deco !== 'underline') bad.push(`not underlined on the canvas (${look.deco})`);
  if (look.bg !== 'rgba(0, 0, 0, 0)') bad.push(`has a background like a button (${look.bg})`);
  // 2 — a menu of four Links: <nav> › <ul> › <li><a>
  await H.panel(page, true);
  const nav = await P.tileAfter(page, s, 'Stack'); const list = await P.into(page, nav, 'Stack');
  let b = await P.into(page, list, 'Link'); const links = [b]; for (let i = 0; i < NAMES.length - 1; i++) { b = await P.beside(page, b, 'Link'); links.push(b); }
  await H.panel(page, false);
  await I.meaning(page, nav, 'Menu'); await I.meaning(page, list, 'List');
  for (const [i, id] of links.entries()) { await I.text(page, id, NAMES[i]); await I.textToggle(page, id, 'Underline', false); }
  // 3 — #89: a colour typed for the menu, then a click on a link — the link must not be painted
  await I.background(page, nav, '#1e3a8a'); await H.select(page, links[0]);
  const linkBg = await page.evaluate((id) => { const x = JSON.parse(localStorage.getItem('educo_box_site_v1')); let bg = null; const w = (n) => { if (n.id === id) bg = n.background; (n.children || []).forEach(w); }; w(x.pages[0].root); return bg; }, links[0]);
  if (linkBg) bad.push(`#89: the link was painted ${linkBg} by the colour typed for the menu`);
  await H.shot(page, `uat-link-${win.name}-canvas.png`);
  // 4 — the real Preview: the markup, and Tab reaches a link with a visible ring
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe'); await page.waitForTimeout(1500); await page.keyboard.press('h');
  const fr = await (await page.$('iframe')).contentFrame();
  const m = await fr.evaluate(() => { const nav = document.querySelector('nav'); const ul = nav?.querySelector('ul'); const lis = ul ? Array.from(ul.children) : []; const a = document.querySelector('a[href="https://example.org/term-dates"]');
    return { nav: !!nav, ulCount: nav ? nav.querySelectorAll('ul').length : 0, liKids: lis.map((x) => x.tagName).join(','), liLinks: lis.map((li) => li.querySelectorAll('a').length).join(','), bullets: ul ? getComputedStyle(ul).listStyleType : '', menuDeco: lis.map((li) => getComputedStyle(li.querySelector('a')).textDecorationLine).join(','), row: lis.length > 1 ? Math.abs(lis[0].getBoundingClientRect().top - lis[1].getBoundingClientRect().top) < 3 : false, a: a ? { deco: getComputedStyle(a).textDecorationLine, text: a.textContent } : null }; });
  if (!m.nav || m.ulCount !== 1 || m.liKids !== NAMES.map(() => 'LI').join(',') || m.liLinks !== NAMES.map(() => '1').join(',')) bad.push(`menu markup: ${JSON.stringify(m)}`);
  if (m.bullets !== 'none') bad.push(`the menu shows bullets (${m.bullets})`);
  if (m.menuDeco !== NAMES.map(() => 'none').join(',')) bad.push(`menu links are underlined though Underline is off (${m.menuDeco})`);
  if (!m.row) bad.push('the menu links are not side by side in the Preview');
  if (!m.a || m.a.deco !== 'underline') bad.push(`the text link in the Preview: ${JSON.stringify(m.a)}`);
  await fr.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {});
  let ring = null;
  for (let k = 0; k < 8 && !ring; k++) { await page.keyboard.press('Tab'); ring = await fr.evaluate(() => { const a = document.activeElement; if (!a || a.tagName !== 'A' || !a.closest('nav')) return null; const c = getComputedStyle(a); return `${a.textContent} outline ${c.outlineStyle} ${c.outlineWidth}`; }); }
  if (!ring || /none|0px/.test(ring)) bad.push(`Tab did not reach a menu link with a visible ring (${ring})`);
  await page.screenshot({ path: require('path').join(__dirname, `uat-link-${win.name}-preview-focus.png`) });
  // 5 — SPACING: 2rem between the menu links by default; "Space across" on the list moves it; wrapped lines get "Space down"
  const gaps = (fr2) => fr2.evaluate(() => { const lis = Array.from(document.querySelector('nav ul').children).map((li) => li.querySelector('a').getBoundingClientRect()); return lis.slice(1).map((r, i) => Math.round(r.left - lis[i].right)); });
  const g0 = await gaps(fr); const rem = await fr.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
  if (g0.some((g) => Math.abs(g - 2 * rem) > 1.5)) bad.push(`default space between menu links is ${g0.join('/')}px, not 2rem (${2 * rem}px)`);
  const onDark = await fr.evaluate(() => {
    const a = document.querySelector('nav a');
    // Any CSS colour (the tokens are OKLCH) → sRGB, by having the browser paint it into one pixel and reading it back.
    const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true });
    const rgb = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return { r: d[0], g: d[1], b: d[2], a: d[3] }; };
    const lum = (c) => { const { r, g, b } = rgb(c); return [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0); };
    let bg = null; for (let x = a; x; x = x.parentElement) { const c = getComputedStyle(x).backgroundColor; if (rgb(c).a > 240) { bg = c; break; } }
    bg = bg || 'rgb(255, 255, 255)';
    const A = lum(getComputedStyle(a).color), B = lum(bg); return +((Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05)).toFixed(2); });
  if (onDark < 4.5) bad.push(`#92: menu links on the dark band have contrast ${onDark}:1`);
  await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {}); await page.waitForTimeout(800);
  await I.spacing(page, list, 'Space across', 48); await I.spacing(page, list, 'Space down', 20);
  // Spacing is written in the page's FLUID base unit (--box-u, 0.7–1.4× with width and text size), so "48" is 4.8 units
  // of whatever that unit is on the surface being measured — measured, not assumed.
  const unitPx = (fr2) => fr2.evaluate(() => { const p = document.createElement('div'); p.style.width = 'calc(var(--box-u, 0.625rem) * 4.8)'; (document.querySelector('nav ul') || document.body).appendChild(p); const w = p.getBoundingClientRect().width; p.remove(); return w; });
  const canvasGap = await page.evaluate((ids) => { const r = ids.map((id) => document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect()); const Z = document.querySelector('[data-box-id]').currentCSSZoom || 1; return Math.round((r[1].left - r[0].right) / Z); }, links);
  const canvasWant = await page.evaluate((id) => { const el = document.querySelector(`[data-box-id="${id}"]`).parentElement; const p = document.createElement('div'); p.style.width = 'calc(var(--box-u, 0.625rem) * 4.8)'; el.appendChild(p); const Z = document.querySelector('[data-box-id]').currentCSSZoom || 1; const w = p.getBoundingClientRect().width / Z; p.remove(); return Math.round(w); }, links[0]);
  if (Math.abs(canvasGap - canvasWant) > 2) bad.push(`after Space across = 48 units the canvas gap is ${canvasGap}px, want ${canvasWant}px`);
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe'); await page.waitForTimeout(1200); await page.keyboard.press('h');
  const fr1 = await (await page.$('iframe')).contentFrame(); const g1 = await gaps(fr1); const want1 = Math.round(await unitPx(fr1));
  if (g1.some((g) => Math.abs(g - want1) > 2)) bad.push(`after Space across = 48 units the Preview gaps are ${g1.join('/')}px, want ${want1}px`);
  await page.setViewportSize({ width: 375, height: 800 }); await page.waitForTimeout(700);
  const wrapped = await (await (await page.$('iframe')).contentFrame()).evaluate(() => { const r = Array.from(document.querySelector('nav ul').children).map((li) => li.getBoundingClientRect()); const tops = [...new Set(r.map((x) => Math.round(x.top)))].sort((p, q) => p - q); if (tops.length < 2) return null; const lineA = r.filter((x) => Math.round(x.top) === tops[0]); const lineB = r.filter((x) => Math.round(x.top) === tops[1]); return Math.round(Math.min(...lineB.map((x) => x.top)) - Math.max(...lineA.map((x) => x.bottom))); });
  const want20 = Math.round((await unitPx(await (await page.$('iframe')).contentFrame())) * 20 / 48);
  if (wrapped == null) bad.push('at 375 the four menu links did not wrap — nothing to measure Space down on');
  else if (Math.abs(wrapped - want20) > 2) bad.push(`at 375 the wrapped menu lines are ${wrapped}px apart, want Space down 20 units = ${want20}px`);
  await page.screenshot({ path: require('path').join(__dirname, `uat-link-${win.name}-preview-375.png`) });
  say(`  ${tag} spacing: default ${g0.join('/')}px · after 3rem across ${g1.join('/')}px (canvas ${canvasGap}) · wrapped lines ${wrapped}px apart at 375 · contrast on dark ${onDark}:1`);
  if (errs.length) bad.push('page errors: ' + errs.join(' | '));
  say(`${bad.length ? 'FAIL' : 'ok  '} ${tag} menu ${JSON.stringify(m.liKids)} · focus: ${ring}${bad.length ? '\n    ' + bad.join('\n    ') : ''}`);
  await browser.close(); return bad.length;
}
(async () => {
  const wins = [{ name: '1536x864', w: 1520, h: 720, pos: [0, 0] }, { name: '1366x768', w: 1350, h: 625, pos: [700, 0] }];
  const f = (await Promise.all(wins.map(run))).reduce((a, b) => a + b, 0);
  say(`DONE — HEADED UAT link/menu/#89: ${wins.length - (f ? 1 : 0)}/${wins.length}`);
})();
