// BATCH A-2 · HEADED UAT — the app's layout on the web sample page /app-preview/<role> (checklist U2–U5 in docs/TASK_TREE.md
// BATCH A-2, written before the build). Six visible windows, each a slice × a theme, refilled as they finish (RULE Z). Every
// edge, place and word read from config/ (RULE CFG) — the expected shell is M3's rule written against those edges.
//   S  every role × the screens around every edge (width and height) → bar · rail · sidebar, its places, More, aria-current, nothing sideways
//   K  keyboard only: the arrows along the shell, More by Enter, its arrows, Escape back to More, a press outside closes it
//   L  list-detail: phone push + Back (button and browser) at the same scroll, a pasted detail URL, the resize round trip, empty, missing
//   T  200 % browser text: the shell follows the CSS (em), nothing cut off or sideways
//   Run against a FRESH `next start` on :3100.   node scripts/uat/uat-a2-headed.js [--only=S,L]
const path = require('path'); const fs = require('fs'); const os = require('os');
const { chromium } = require('playwright');
const { SCREENS, EDGE } = require('./screens.js');
const LAYOUT = require('../../config/layout.json'); const SHELL = require('../../config/app-shell.json'); const LISTS = require('../../config/sample-lists.json');
const OUT = path.join(__dirname, 'logs', 'uat-a2'); fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const BASE = process.env.BASE || 'http://localhost:3100';
const MED = LAYOUT.heights.medium, BAR_MAX = LAYOUT.shell.barMax, MORE = SHELL.moreLabel;
/** How many places a bar holds legibly at a width (A2-22): as many as fit at barItemMin each, 2 to barMax. */
const fits = (w) => Math.max(2, Math.min(BAR_MAX, Math.floor(w / LAYOUT.shell.barItemMin)));
const want = (w, h) => (w < EDGE.TP || h < MED ? 'bar' : w >= EDGE.DT ? 'sidebar' : 'rail'); // M3 / NavigationSuiteScaffold, the user's decision
/** The page scrolls smoothly: wait until the scroll position has stopped moving before reading it. */
const settle = (page) => page.waitForFunction(() => new Promise((r) => { let a = scrollY; setTimeout(() => r(scrollY === a), 150); }), null, { polling: 200, timeout: 5000 }).catch(() => {});
const url = (role, p = '', theme = 'light') => `${BASE}/app-preview/${role}${p}?theme=${theme}`;

async function open({ w, h, pos, font }) {
  const args = ['--force-device-scale-factor=1', `--window-position=${pos[0]},${pos[1]}`];
  if (!font) { const browser = await chromium.launch({ headless: false, args }); const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 }); return wire(browser, page, browser); }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'a2-')); fs.mkdirSync(path.join(dir, 'Default'));
  fs.writeFileSync(path.join(dir, 'Default', 'Preferences'), JSON.stringify({ webkit: { webprefs: { default_font_size: font } } }));
  const ctx = await chromium.launchPersistentContext(dir, { headless: false, args, viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  return wire(ctx, ctx.pages()[0] || (await ctx.newPage()), ctx);
}
function wire(owner, page, closer) { const errs = []; page.on('pageerror', (e) => errs.push(e.message.split('\n')[0])); return { page, errs, close: () => closer.close() }; }
async function go(page, u) { await page.goto(u, { waitUntil: 'load' }); await page.waitForSelector('nav[aria-label="Main"]', { timeout: 30000 }); await page.waitForTimeout(400); }
const shellOf = (page) => page.evaluate(() => document.querySelector('nav[aria-label="Main"]')?.dataset.shell ?? null);
const sideways = (page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const navOnScreen = (page) => page.evaluate(() => { const r = document.querySelector('nav[aria-label="Main"]').getBoundingClientRect(); return r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1 && r.width > 0 && r.height > 0; });
const placeLabels = (page) => page.evaluate(() => [...document.querySelectorAll('nav[aria-label="Main"] a')].map((a) => a.textContent.trim()));
const current = (page) => page.evaluate(() => document.querySelector('nav[aria-label="Main"] a[aria-current="page"]')?.textContent.trim() ?? null);
// A2-23: a word cut with an ellipsis IS cut — the check no longer excuses it; nor a third line hidden by the clamp
// …and a word SPLIT across two lines ("Dashboar d") is cut too: one word, more than one line box
const clipped = (page) => page.evaluate(() => [...document.querySelectorAll('nav[aria-label="Main"] a span, nav[aria-label="Main"] button span')].filter((s) => {
  if (s.scrollWidth > s.clientWidth + 1 || s.scrollHeight > s.clientHeight + 1) return true;
  const t = s.firstChild; if (!t || t.nodeType !== 3) return false;
  let at = 0; return t.textContent.split(' ').some((w) => { const r = document.createRange(); r.setStart(t, at); r.setEnd(t, at + w.length); at += w.length + 1; return new Set([...r.getClientRects()].map((x) => Math.round(x.top))).size > 1; });
}).length);

/** The screens around every edge (both sides, width and height), plus the presets of screens.js a phone / tablet / desktop has. */
const EDGES = [[EDGE.TP - 1, 960], [EDGE.TP, 960], [EDGE.TL - 1, 1024], [EDGE.TL, 1024], [EDGE.DT - 1, 900], [EDGE.DT, 900], [1024, MED - 1], [1024, MED], [800, 360]];
const PRESETS = SCREENS.filter((s) => s.label && !/starts|below/.test(s.label)).map((s) => [s.w, s.h]);

const SLICES = {
  async S(page, ok, theme, sliceOf) { // every role × its share of the screens
    const all = [...EDGES, ...PRESETS].filter((_, i) => i % 2 === sliceOf);
    for (const role of Object.keys(SHELL.roles)) {
      const items = SHELL.roles[role].items; const bad = [];
      for (const [w, h] of all) {
        await page.setViewportSize({ width: w, height: h }); await go(page, url(role, '', theme));
        const shell = await shellOf(page), exp = want(w, h), labels = await placeLabels(page);
        if (shell !== exp) bad.push(`${w}×${h}: ${shell}, want ${exp}`);
        const n = exp === 'bar' && items.length > fits(w) ? fits(w) - 1 : items.length;
        if (labels.length !== n) bad.push(`${w}×${h}: ${labels.length} places, want ${n}`);
        const hasMore = await page.getByRole('button', { name: MORE }).count();
        if (!!hasMore !== (exp === 'bar' && items.length > fits(w))) bad.push(`${w}×${h}: More ${hasMore ? 'shown' : 'missing'}`);
        if ((await current(page)) !== items[0].label) bad.push(`${w}×${h}: current ${await current(page)}`);
        if ((await sideways(page)) > 1) bad.push(`${w}×${h}: sideways`);
        if (!(await navOnScreen(page))) bad.push(`${w}×${h}: navigation off screen`);
        if ((await clipped(page)) > 0) bad.push(`${w}×${h}: a place's word cut`);
      }
      ok(`${theme} · ${role} at ${all.length} screens: bar under ${EDGE.TP} wide or ${MED} tall, rail, sidebar from ${EDGE.DT}; the places, More, the current one, all on screen`, !bad.length, bad.slice(0, 6).join(' · '));
      for (const [w, h] of [[375, 812], [1024, 768], [1440, 900]]) { await page.setViewportSize({ width: w, height: h }); await go(page, url(role, '', theme)); await page.screenshot({ path: path.join(OUT, `S-${theme}-${role}-${w}x${h}.png`) }); }
    }
  },
  async K(page, ok, theme) {
    const t = SHELL.roles.teacher.items;
    await page.setViewportSize({ width: 390, height: 844 }); await go(page, url('teacher', '', theme));
    const first = page.locator('nav[aria-label="Main"] a').first(); await first.focus();
    for (let i = 0; i < BAR_MAX - 1; i++) await page.keyboard.press('ArrowRight');
    ok(`${theme} · bar: the arrows walk to More`, await page.evaluate((m) => document.activeElement?.textContent.includes(m), MORE));
    await page.keyboard.press('ArrowRight'); ok(`${theme} · bar: past More they wrap to the first place`, (await page.evaluate(() => document.activeElement?.textContent.trim())) === t[0].label);
    await page.keyboard.press('End'); await page.keyboard.press('Enter'); await page.waitForTimeout(300);
    ok(`${theme} · More opens by Enter: a menu of the other ${t.length - (BAR_MAX - 1)}, focus on the first`, (await page.getByRole('menuitem').count()) === t.length - (BAR_MAX - 1) && (await page.evaluate(() => document.activeElement?.getAttribute('role'))) === 'menuitem');
    await page.keyboard.press('ArrowDown'); ok(`${theme} · its arrows move`, (await page.evaluate(() => document.activeElement?.textContent.trim())) === t[BAR_MAX].label);
    await page.keyboard.press('Escape'); await page.waitForTimeout(200);
    ok(`${theme} · Escape puts it away, focus back on More`, (await page.getByRole('menu').count()) === 0 && (await page.evaluate((m) => document.activeElement?.textContent.includes(m), MORE)));
    await page.keyboard.press('Enter'); await page.waitForTimeout(200); await page.mouse.click(200, 200); await page.waitForTimeout(200);
    ok(`${theme} · a press outside puts it away`, (await page.getByRole('menu').count()) === 0);
    await page.getByRole('button', { name: MORE }).focus(); // A2-20: a press outside leaves focus where it landed, so a keyboard user comes back to More
    await page.keyboard.press('Enter'); await page.waitForTimeout(200); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter'); await page.waitForTimeout(800);
    ok(`${theme} · Enter on a menu place goes there, and More is marked while you are on it`, page.url().includes(`/teacher${t[BAR_MAX].href}`) && /text-brand/.test(await page.getByRole('button', { name: MORE }).getAttribute('class')));
    await page.screenshot({ path: path.join(OUT, `K-${theme}-more.png`) });
    await page.setViewportSize({ width: 1024, height: 768 }); await go(page, url('teacher', '', theme));
    await page.locator('nav[aria-label="Main"] a').first().focus(); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter'); await page.waitForTimeout(800);
    ok(`${theme} · rail: ArrowDown + Enter go to the second place, now current`, (await current(page)) === t[1].label);
  },
  async L(page, ok, theme) {
    const t = SHELL.roles.teacher.items; const cls = t.find((p) => p.list === 'classes'); const rows = LISTS.lists.classes.rows; const W = LISTS.words;
    await page.setViewportSize({ width: 375, height: 300 }); await go(page, url('teacher', cls.href, theme)); // short, so the list really scrolls
    ok(`${theme} · phone: the list, every row marked "${SHELL.words.sample}"`, (await page.getByText(SHELL.words.sample, { exact: true }).count()) === rows.length);
    await page.evaluate(() => window.scrollTo(0, 120)); await page.waitForFunction(() => scrollY === 120, null, { timeout: 5000 }).catch(() => {}); const y0 = await page.evaluate(() => scrollY); // the smooth scroll has arrived
    ok(`${theme} · (precondition) the list is scrolled before a row is opened`, y0 > 40, `scrollY ${y0}`); // A2-20: a scroll that did not happen proved nothing
    // the row a person taps: one fully on screen (a half-hidden one is scrolled into view by Playwright first, which moves the list)
    const seen = await page.evaluate((ids) => ids.find((id) => { const r = document.querySelector(`a[href$="/${id}"]`)?.getBoundingClientRect(); return r && r.top >= 0 && r.bottom <= innerHeight - 80; }), rows.map((r) => r.id));
    const pick = rows.find((r) => r.id === seen) ?? rows[1];
    await page.locator(`a[href$="/${pick.id}"]`).click(); await page.waitForTimeout(700);
    ok(`${theme} · a row opens its own URL with its detail and Back`, page.url().includes(`${cls.href}/${pick.id}`) && (await page.getByRole('heading', { name: pick.title }).count()) === 1 && (await page.getByRole('link', { name: W.back }).count()) === 1);
    await page.getByRole('link', { name: W.back }).click(); await page.waitForTimeout(700); await settle(page);
    ok(`${theme} · Back → the list at the same scroll (${y0}px)`, !page.url().includes(pick.id) && Math.abs((await page.evaluate(() => scrollY)) - y0) <= 2, `scrollY ${await page.evaluate(() => scrollY)}`);
    await page.locator(`a[href$="/${pick.id}"]`).click(); await page.waitForTimeout(600); await page.goBack(); await page.waitForTimeout(700); await settle(page);
    ok(`${theme} · the browser's back does the same`, !page.url().includes(pick.id) && Math.abs((await page.evaluate(() => scrollY)) - y0) <= 2, `scrollY ${await page.evaluate(() => scrollY)}`);
    await go(page, url('teacher', `${cls.href}/${rows[2].id}`, theme));
    ok(`${theme} · a pasted detail URL opens on it (phone: detail with Back)`, (await page.getByRole('heading', { name: rows[2].title }).count()) === 1 && (await page.getByRole('link', { name: W.back }).count()) === 1);
    await page.setViewportSize({ width: 1280, height: 800 }); await page.waitForTimeout(500);
    ok(`${theme} · widened past ${EDGE.TL}: both panes, that row current, no Back`, (await page.locator('[aria-current="true"]').innerText()).includes(rows[2].title) && (await page.getByRole('link', { name: W.back }).count()) === 0);
    await page.screenshot({ path: path.join(OUT, `L-${theme}-1280.png`) });
    await page.setViewportSize({ width: 375, height: 812 }); await page.waitForTimeout(500);
    const keep1 = (await page.getByRole('heading', { name: rows[2].title }).count()) === 1;
    await page.setViewportSize({ width: 1280, height: 800 }); await page.waitForTimeout(500);
    ok(`${theme} · 1280 → 375 → 1280 keeps the open row`, keep1 && (await page.locator('[aria-current="true"]').innerText()).includes(rows[2].title));
    for (const [w, h] of [[EDGE.TL - 1, 1024], [EDGE.TL, 1024]]) { await page.setViewportSize({ width: w, height: h }); await go(page, url('teacher', cls.href, theme));
      ok(`${theme} · ${w}: ${w >= EDGE.TL ? 'two panes, the first row chosen' : 'one pane, the list'}`, (await page.getByRole('heading', { name: rows[0].title }).count()) === (w >= EDGE.TL ? 1 : 0)); }
    await go(page, url('teacher', t.find((p) => p.list === 'empty').href, theme));
    ok(`${theme} · an empty list says "${W.empty}"`, (await page.getByText(W.empty).count()) === 1);
    await go(page, url('teacher', `${cls.href}/nobody`, theme));
    ok(`${theme} · a row the list lacks says so`, (await page.getByRole('status').innerText()).includes(W.missing));
    await go(page, url('teacher', '/nowhere', theme));
    ok(`${theme} · a place not in the menu says so, with a way home`, (await page.getByText(SHELL.words.notInMenu).count()) === 1 && (await page.getByRole('link', { name: SHELL.words.backHome }).count()) === 1);
    await page.setViewportSize({ width: 375, height: 812 }); await go(page, url('admin', '/pupils', theme)); await page.screenshot({ path: path.join(OUT, `L-${theme}-375.png`) });
  },
  async T(page, ok, theme) { // 200 % browser text (Chrome's own font size, WCAG 1.4.4)
    const bad = [];
    for (const [w, h] of [[1280, 800], [1920, 1080], [375, 812], [1024, 768]]) {
      await page.setViewportSize({ width: w, height: h }); await go(page, url('teacher', '/classes', theme));
      const exp = want(w / 2, h / 2), shell = await shellOf(page);
      if (shell !== exp) bad.push(`${w}×${h}: ${shell}, want ${exp} (the CSS sees ${w / 2}×${h / 2} em-px)`);
      if ((await sideways(page)) > 1) bad.push(`${w}×${h}: sideways`); if (!(await navOnScreen(page))) bad.push(`${w}×${h}: navigation off screen`); if ((await clipped(page)) > 0) bad.push(`${w}×${h}: a place's word cut`);
      await page.screenshot({ path: path.join(OUT, `T-${theme}-${w}.png`) });
    }
    ok(`${theme} · 200 % text: the shell follows the text size as the CSS does; nothing sideways or off screen`, !bad.length, bad.join(' · '));
  },
};
const WINDOWS = [['S', 'light', 0], ['S', 'midnight', 1], ['K', 'dark'], ['K', 'purple'], ['L', 'light'], ['L', 'dark'], ['L', 'midnight'], ['L', 'purple'], ['T', 'light', null, 32], ['S', 'purple', 0], ['S', 'dark', 1], ['K', 'light']];
(async () => {
  const runs = WINDOWS.filter(([k]) => !ONLY.length || ONLY.includes(k)); const out = []; let next = 0;
  const slot = async (i) => {
    while (next < runs.length) {
      const [k, theme, sliceOf, font] = runs[next++];
      const { page, errs, close } = await open({ w: 1240, h: 820, pos: [(i % 3) * 640, Math.floor(i / 3) * 520], font });
      const ok = (what, pass, detail = '') => { const l = `${pass ? 'SAW ' : 'FAIL'} [${k}] ${what}${detail && !pass ? ' — ' + detail : ''}`; out.push(l); console.log(l); };
      try { await SLICES[k](page, ok, theme, sliceOf); }
      catch (e) { ok(`${k} ${theme} · ${e.message.split('\n')[0]}`, false); await page.screenshot({ path: path.join(OUT, `${k}-${theme}-error.png`) }).catch(() => {}); }
      ok(`${k} ${theme} · no page errors`, errs.length === 0, errs.join(' | '));
      await close();
    }
  };
  await Promise.all(Array.from({ length: 6 }, (_, i) => slot(i)));
  const fails = out.filter((l) => l.startsWith('FAIL'));
  console.log(`\n${out.length} checks, ${fails.length} failed`); for (const l of fails) console.log(l);
  fs.writeFileSync(path.join(OUT, 'result.txt'), out.join('\n'));
})();
