// HEADED UAT — BATCH D-4: the published guide IS the docs site. Six windows over WHAT THE ARTIFACT HOLDS: every published
// file read back from the Artifact (its index.html already wrapped in the host's skeleton) into one folder, served at a deep
// non-root path, opened both straight and inside a strict sandboxed iframe (opaque origin, no storage) — the harshest way
// an Artifact can be framed. A file the page asks for that was never published is a 404 and FAILS the pass (D4-7).
// Every page, every picture, "On this page", links between pages, the ☰ menu, light / dark, every screen of screens.js.
//   NODE_PATH=node_modules node scripts/uat/uat-d4-docs-headed.js <folder of files read back from the Artifact>
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os'); const http = require('http');
const { SCREENS } = require('./screens.js');
const BUILD = path.resolve(process.argv[2]); const missing = new Set();
const OUT = path.join(__dirname, 'logs', 'uat-d4-docs'); fs.mkdirSync(OUT, { recursive: true });
const PORT = 4100; const DEEP = '/artifact/XSga5SRiwNEAAwXr8Rr4ZJ/v30/';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.ico': 'image/x-icon' };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/host.html') { res.writeHead(200, { 'content-type': 'text/html' });
    return res.end(`<!doctype html><style>html,body{margin:0;height:100%}iframe{border:0;width:100%;height:100%;display:block}</style><iframe sandbox="allow-scripts allow-popups" src="${DEEP}${new URLSearchParams(req.url.split('?')[1]).get('r') || ''}"></iframe>`); }
  if (u === '/favicon.ico') { res.writeHead(200, { 'content-type': 'image/x-icon' }); return fs.createReadStream(path.join(BUILD, 'img', 'favicon.ico')).pipe(res); } // the HOST's own icon, as claude.ai has
  const file = u.startsWith(DEEP) ? path.join(BUILD, u.slice(DEEP.length) || 'index.html') : '';
  if (!file.startsWith(BUILD) || !fs.existsSync(file)) { missing.add(u); res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' }); fs.createReadStream(file).pipe(res);
});
// The colours a reader actually gets: body vs html background, and the words' contrast on the body (WCAG relative luminance)
const paint = () => {
  const rgb = (s) => (/, 0\)$/.test(s) ? [255, 255, 255] : s.match(/[\d.]+/g).slice(0, 3).map(Number)); // transparent → the white canvas
  const lum = (s) => { const [r, g, b] = rgb(s).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const bg = getComputedStyle(document.body).backgroundColor; const page = getComputedStyle(document.documentElement).backgroundColor;
  const fg = getComputedStyle(document.querySelector('.markdown p') || document.body).color; const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return { theme: document.documentElement.dataset.theme, bg, page, fg, same: bg === page, ratio: (a + 0.05) / (b + 0.05) };
};
const PAGES = ['#/', '#/layout-reference', '#/website-builder', '#/website-builder-in-the-app'];
const CASES = [
  { w: 375, theme: 'light' }, { w: 375, theme: 'dark', frame: true }, { w: 768, theme: 'light', frame: true },
  { w: 1024, theme: 'dark' }, { w: 1536, theme: 'light', frame: true }, { w: 1280, theme: 'dark', font: 32 },
].map((c, i) => ({ ...c, sweep: SCREENS.filter((_, k) => k % 6 === i) }));

server.listen(PORT, async () => {
  const res = await Promise.all(CASES.map(async (c, i) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'd4docs-')); fs.mkdirSync(path.join(dir, 'Default'));
    fs.writeFileSync(path.join(dir, 'Default', 'Preferences'), JSON.stringify({ webkit: { webprefs: { default_font_size: c.font || 16 } } }));
    const ctx = await chromium.launchPersistentContext(dir, { headless: false, viewport: { width: c.w, height: 860 }, colorScheme: c.theme, args: [`--window-position=${(i % 3) * 420},${Math.floor(i / 3) * 440}`, '--force-device-scale-factor=1'] });
    const page = ctx.pages()[0]; const out = []; const errors = [];
    const tag = `${c.w} ${c.theme}${c.frame ? ' iframe' : ''}${c.font ? ' 200%' : ''}`;
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); }); page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
    const ok = (pass, msg) => out.push(`${pass ? 'PASS' : 'FAIL'} ${tag} ${msg}`);
    const doc = () => (c.frame ? page.frames().find((f) => f !== page.mainFrame()) : page.mainFrame());
    const open = async (r) => { await page.goto('about:blank');
      await page.goto(c.frame ? `http://localhost:${PORT}/host.html?r=${encodeURIComponent(r)}` : `http://localhost:${PORT}${DEEP}${r}`);
      await doc().waitForSelector('.markdown h1, .markdown header h1', { timeout: 15000 }); await page.waitForTimeout(300); };
    const h1 = () => doc().evaluate(() => document.querySelector('.markdown h1')?.textContent.trim());
    const route = () => doc().evaluate(() => location.hash.split('#').slice(0, 2).join('#'));
    const menuOpen = () => doc().evaluate(() => !!document.querySelector('.navbar-sidebar--show'));
    page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); }); // which address (D4-2)
    try {
      const titles = {};
      for (const r of PAGES) {
        await open(r); titles[r] = await h1();
        // U1 opened straight from its own link — the right page, not "Page Not Found"
        ok(titles[r] && !/not found/i.test(titles[r]), `U1 ${r} opened straight: "${titles[r]}"`);
        // U2 every picture · U6 nothing sideways, tables scroll inside themselves
        const v = await doc().evaluate(async () => {
          const imgs = [...document.querySelectorAll('.markdown img')];
          for (const im of imgs) { im.loading = 'eager'; im.scrollIntoView(); await im.decode().catch(() => {}); }
          const col = document.querySelector('.markdown').getBoundingClientRect(); window.scrollTo(0, 0);
          return { n: imgs.length, broken: imgs.filter((im) => !im.naturalWidth).map((im) => im.getAttribute('src')),
            noAlt: imgs.filter((im) => !(im.alt || '').trim()).length, over: imgs.filter((im) => im.getBoundingClientRect().right > col.right + 1).length,
            links: [...document.querySelectorAll('.markdown a')].filter((a) => a.querySelector('img')).map((a) => a.href),
            side: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            cut: [...document.querySelectorAll('.markdown table')].filter((t) => t.scrollWidth > t.clientWidth + 1 && !/auto|scroll/.test(getComputedStyle(t).overflowX)).length };
        });
        ok(!v.broken.length && !v.noAlt && !v.over, `U2 ${r}: ${v.n} pictures, broken ${v.broken.length}, no alt ${v.noAlt}, past the column ${v.over}${v.broken.length ? ' ' + v.broken.join(' ') : ''}`);
        let dead = 0; for (const href of v.links) { const s = (await page.request.get(href)).status(); if (s !== 200) dead++; }
        ok(!dead, `U2 ${r}: ${v.links.length} pictures that are links, ${dead} that do not open`);
        ok(v.side <= 0 && !v.cut, `U6 ${r}: sideways ${v.side}px, tables cut off ${v.cut}`);
        // U5 the page wears its theme through the host's skeleton (D4-6): body = the theme's page colour, words ≥ 4.5:1
        const pc = await doc().evaluate(paint);
        ok(pc.theme === c.theme && pc.same && pc.ratio >= 4.5, `U5 ${r} ${pc.theme}: body ${pc.bg} = page ${pc.page} ${pc.same}, words ${pc.fg} ${pc.ratio.toFixed(1)}:1`);
        await page.screenshot({ path: path.join(OUT, `${i}-${c.w}-${c.theme}${c.frame ? '-iframe' : ''}${c.font ? '-200' : ''}-${r.slice(2) || 'story'}.png`) });
        // U3 "On this page": the first entry lands on its heading, the page stays
        const wide = await doc().evaluate(() => !!document.querySelector('.table-of-contents__link') && getComputedStyle(document.querySelector('.theme-doc-toc-desktop') || document.body).display !== 'none' && !!document.querySelector('.theme-doc-toc-desktop'));
        if (!wide) { const t = doc().locator('.theme-doc-toc-mobile button').first(); if (await t.count()) await t.click(); await page.waitForTimeout(300); }
        const link = doc().locator(wide ? '.theme-doc-toc-desktop .table-of-contents__link' : '.theme-doc-toc-mobile .table-of-contents__link').nth(1);
        if (await link.count()) {
          const id = decodeURIComponent((await link.getAttribute('href')).split('#').pop()); await link.click(); await page.waitForTimeout(700);
          const top = await doc().evaluate((x) => document.getElementById(x)?.getBoundingClientRect().top, id);
          ok(top !== undefined && top >= -2 && top < 200 && (await route()) === (r === '#/' ? '#/' : r), `U3 ${r}: "On this page" → #${id} at ${Math.round(top)}px, still on ${await route()}`);
        } else ok(false, `U3 ${r}: no "On this page" list`);
        // U3 a heading's own # link lands on that heading, the page stays
        const hl = doc().locator('.markdown h2 .hash-link').nth(2);
        if (await hl.count()) {
          const id = await hl.evaluate((a) => a.closest('h2').id); await doc().evaluate(() => window.scrollTo(0, 0));
          await hl.scrollIntoViewIfNeeded(); await hl.hover(); await hl.click(); await page.waitForTimeout(700);
          const top = await doc().evaluate((x) => document.getElementById(x).getBoundingClientRect().top, id);
          ok(top >= -2 && top < 200 && (await route()) === (r === '#/' ? '#/' : r), `U3 ${r}: the heading's # → #${id} at ${Math.round(top)}px, still on ${await route()}`);
        }
      }
      // U3 a link between pages lands on that page
      await open('#/'); const cross = doc().locator('.markdown a[href*="#/layout-reference"], .markdown a[href*="#/website-builder"]').first();
      if (await cross.count()) { const to = await cross.getAttribute('href'); await cross.click(); await page.waitForTimeout(600); const t = await h1();
        ok(Object.entries(titles).some(([k, v]) => k !== '#/' && v === t), `U3 story → ${to}: landed on "${t}"`); } else ok(false, 'U3 no link from the story to another page');
      // U1 every page from the sidebar (☰ on a phone), then Back / Forward
      await open('#/'); const seen = [];
      for (const r of PAGES.slice(1)) {
        const phone = await doc().locator('button.navbar__toggle').isVisible();
        if (phone) { await doc().locator('button.navbar__toggle').click(); await page.waitForTimeout(400); }
        const scope = phone ? '.navbar-sidebar' : '.theme-doc-sidebar-container';
        await doc().locator(`${scope} a.menu__link[href$="${r}"]`).first().click(); await page.waitForTimeout(600);
        const t = await h1(); seen.push(t); ok(t === titles[r] && (await route()) === r, `U1 ${r} from the ${phone ? '☰ menu' : 'sidebar'}: "${t}"`);
        if (phone) ok(!(await menuOpen()), 'U6 the ☰ menu closes after choosing a page'); // D4-5: was `a || b`, always true
      }
      // D4-4: Back / Forward run inside the document (page.goBack waits for a top-level load an iframe's hash change never makes)
      await doc().evaluate(() => history.back()); await page.waitForTimeout(600); const back = await h1();
      await doc().evaluate(() => history.forward()); await page.waitForTimeout(600); const fwd = await h1();
      ok(back === seen[seen.length - 2] && fwd === seen[seen.length - 1], `U1 Back → "${back}", Forward → "${fwd}"`);
      // U6 the ☰ menu closes on Esc (phone only)
      if (await doc().locator('button.navbar__toggle').isVisible()) { await doc().locator('button.navbar__toggle').click(); await page.waitForTimeout(400);
        const opened = await menuOpen(); await page.keyboard.press('Escape'); await page.waitForTimeout(400);
        ok(opened && !(await menuOpen()), `U6 the ☰ menu: opened ${opened}, closes on Esc`); }
      // U5 light / dark: follows the device first; the switch flips it; the choice survives a reload (not in a storage-less sandbox)
      await open('#/website-builder'); const first = await doc().evaluate(() => document.documentElement.dataset.theme);
      ok(first === c.theme, `U5 first visit follows the device: ${first}`);
      const phoneMenu = await doc().locator('button.navbar__toggle').isVisible(); // on a phone the switch is inside ☰
      if (phoneMenu) { await doc().locator('button.navbar__toggle').click(); await page.waitForTimeout(400); }
      const sw = doc().locator('button[class*="toggleButton"]:visible').first(); let now = first;
      for (let k = 0; k < 3 && now === first; k++) { await sw.click(); await page.waitForTimeout(250); now = await doc().evaluate(() => document.documentElement.dataset.theme); }
      if (phoneMenu) { await page.keyboard.press('Escape'); await page.waitForTimeout(400); }
      const pc = await doc().evaluate(paint);
      ok(now !== first && pc.same && pc.ratio >= 4.5, `U5 the switch flips ${first} → ${now}${phoneMenu ? ' (inside ☰)' : ''}: body ${pc.bg} = page ${pc.page} ${pc.same}, words ${pc.ratio.toFixed(1)}:1`);
      await page.screenshot({ path: path.join(OUT, `${i}-${c.w}-switched-${now}${c.frame ? '-iframe' : ''}.png`) });
      if (!c.frame) { await page.reload(); await doc().waitForSelector('.markdown h1'); const kept = await doc().evaluate(() => document.documentElement.dataset.theme); ok(kept === now, `U5 after a reload: ${kept}`); }
      // U6 every screen of this window's share of screens.js
      const bad = [];
      for (const s of c.sweep) { await page.setViewportSize({ width: s.w, height: s.h }); await page.waitForTimeout(150);
        const v = await doc().evaluate(() => ({ side: document.documentElement.scrollWidth - document.documentElement.clientWidth, cut: [...document.querySelectorAll('.markdown table')].filter((t) => t.scrollWidth > t.clientWidth + 1 && !/auto|scroll/.test(getComputedStyle(t).overflowX)).length }));
        if (v.side > 0 || v.cut) bad.push(`${s.label}: sideways ${v.side}px, ${v.cut} tables cut off`); }
      ok(!bad.length, `U6 ${c.sweep.length} screens of screens.js${bad.length ? ' — ' + bad.slice(0, 3).join(' · ') : ''}`);
    } catch (e) { ok(false, `crashed: ${String(e).split('\n')[0]}`); }
    // U7 no console errors on any page
    ok(!errors.length, `U7 console errors: ${errors.length}${errors.length ? ' — ' + [...new Set(errors)].slice(0, 3).join(' | ') : ''}`);
    await ctx.close(); fs.rmSync(dir, { recursive: true, force: true }); return out.join('\n');
  }));
  const all = `${res.join('\n')}\n${missing.size ? 'FAIL' : 'PASS'} U7 files the page asked for that the Artifact does not hold: ${missing.size}${missing.size ? ' — ' + [...missing].join(' ') : ''}`; console.log(all); console.log(`${(all.match(/^PASS/gm) || []).length} passed, ${(all.match(/^FAIL/gm) || []).length} failed`);
  server.close();
});
