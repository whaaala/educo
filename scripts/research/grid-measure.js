// PAGE GRID research (AC-37b, RULE RS / RULE MAP): open EVERY item of a gallery list, the way a visitor meets it, and
// measure the column grid it is built on — on the gallery page AND on the live site it links to.
//   node grid-measure.js <list.json> <out.json> <profile-root> --shots=<dir> [--jobs=6] [--follow]
// A list entry is an Awwwards /inspiration/ or /sites/ page, a Dribbble /shots/ page, or a live URL.
//   · GALLERY: title, description, tags, the recording / shot images (screenshot), the item's own live link, and its
//     related items (recorded; with --follow the grid / layout / column ones are queued too — one level, RULE R)
//   · LIVE SITE at 1440 · 1024 · 768 · 375: every CSS grid (columns, gaps, subgrid, named lines), framework column classes
//     (Bootstrap col-*, Tailwind grid-cols / col-span), the outer gutter and max content width, full-bleed blocks, and the
//     VISIBLE grid — the left / right edges of every text and media block, and how many sit on a 12-column half-step
// Six headed windows, each its own fresh profile; resumable (items already in <out.json> are skipped).
const { chromium } = require(require.resolve('playwright', { paths: [process.cwd()] }));
const fs = require('fs');
const path = require('path');
const [,, listFile, outFile, profRoot] = process.argv;
const arg = (k, d) => (process.argv.find(a => a.startsWith(`--${k}=`)) || '').slice(k.length + 3) || d;
const JOBS = +arg('jobs', 6);
const SHOTS = arg('shots', null);
const FOLLOW = process.argv.includes('--follow');
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const done = fs.existsSync(outFile) ? [...new Map(JSON.parse(fs.readFileSync(outFile, 'utf8')).filter(r => !r.err && !(r.noLiveSite && /awwwards/.test(r.item)) && !(/dribbble/.test(r.item) && !(r.shotImages || []).length)).map(r => [r.item, r])).values()] : [];
const seen = new Set(done.map(d => d.item));
const queue = JSON.parse(fs.readFileSync(listFile, 'utf8')).filter(u => !seen.has(u));
const retried = new Set();
const challenged = new Set();
const PACE = +arg('pace', 0); // ms to wait after each gallery page — polite pacing for a site that rate-limits
const followed = new Map(done.filter(r => r.followedFrom).map(r => [r.item, r.followedFrom]));
const save = () => fs.writeFileSync(outFile, JSON.stringify(done, null, 1));
const slug = (u) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/[^a-z0-9]+/gi, '-').slice(0, 90);
const WIDTHS = [1440, 1024, 768, 375];
const ONTOPIC = /grid|column|layout|bento|editorial|magazine|portfolio|composition|asymmetr|bleed/i;

// In the page: the grid a visitor sees and the grid the CSS declares.
const MEASURE = () => {
  const vw = innerWidth; const out = { vw, scrollW: document.documentElement.scrollWidth };
  const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 30 && r.height > 8 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05 && r.right > 0 && r.left < vw; };
  const all = [...document.body.querySelectorAll('*')];
  out.cssGrids = all.filter(e => /grid/.test(getComputedStyle(e).display) && vis(e)).slice(0, 40).map(e => {
    const s = getComputedStyle(e); const r = e.getBoundingClientRect();
    const tpl = s.gridTemplateColumns; const decl = e.style.gridTemplateColumns;
    return { el: e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).slice(0, 3).join('.') : ''),
      x: Math.round(r.x), w: Math.round(r.width), cols: tpl === 'none' ? 0 : tpl.split(' ').filter(t => /px$/.test(t)).length,
      tpl: tpl.slice(0, 200), named: /\[/.test(tpl), subgrid: /subgrid/.test(s.gridTemplateColumns + decl) || /subgrid/.test(e.getAttribute('style') || ''),
      colGap: s.columnGap, rowGap: s.rowGap, kids: e.children.length,
      spans: [...e.children].slice(0, 12).map(c => { const cs = getComputedStyle(c); return cs.gridColumnStart + '/' + cs.gridColumnEnd; }) };
  });
  // Rules in the stylesheets that name lines, use subgrid, minmax / auto-fit, or span (what the CSS SAYS, not just the result)
  const rules = []; try { for (const sh of document.styleSheets) { let rs; try { rs = sh.cssRules; } catch { continue; }
    const walk = (list) => { for (const r of list) { if (r.cssRules) walk(r.cssRules); const t = r.cssText || '';
      if (/grid-template-columns|grid-column|subgrid|grid-area/.test(t) && rules.length < 60) rules.push((r.parentRule && r.parentRule.conditionText ? '@media ' + r.parentRule.conditionText + ' ' : '') + t.slice(0, 300)); } };
    walk(rs); } } catch {}
  out.gridRules = rules;
  const cls = {}; for (const e of all) { const c = typeof e.className === 'string' ? e.className : ''; for (const k of c.split(/\s+/)) if (/^(col(-[a-z]{2})?(-\d+|-auto)?|row|container(-fluid)?|grid-cols-\d+|col-span-\d+|col-start-\d+|[a-z]{2}:grid-cols-\d+|[a-z]{2}:col-span-\d+|w-\d+\/12|span-\d+)$/.test(k)) cls[k] = (cls[k] || 0) + 1; }
  out.frameworkClasses = cls;
  // The visible grid: edges of leaf-ish text and media blocks
  const blocks = all.filter(e => vis(e) && (/^(P|H1|H2|H3|H4|H5|H6|LI|IMG|VIDEO|PICTURE|FIGURE|BUTTON|BLOCKQUOTE|svg)$/i.test(e.tagName) || (e.children.length === 0 && (e.textContent || '').trim().length > 2))).slice(0, 1500);
  const L = [], R = []; let bleed = 0;
  for (const e of blocks) { const r = e.getBoundingClientRect(); if (r.width >= vw - 2 && /IMG|VIDEO|PICTURE|FIGURE|svg/i.test(e.tagName)) { bleed++; continue; } L.push(Math.round(r.left)); R.push(Math.round(r.right)); }
  const clusters = (xs) => { const m = {}; for (const x of xs) { const k = Math.round(x / 4) * 4; m[k] = (m[k] || 0) + 1; } return Object.entries(m).map(([x, n]) => [+x, n]).sort((a, b) => b[1] - a[1]); };
  const lc = clusters(L), rc = clusters(R);
  const textL = L.filter(x => x >= 0); const gutter = textL.length ? Math.min(...textL) : null;
  const content = { left: gutter, right: R.length ? Math.max(...R.filter(x => x <= vw)) : null };
  out.gutter = gutter; out.contentRight = content.right; out.contentWidth = content.right - content.left; out.fullBleedMedia = bleed;
  out.leftEdges = lc.slice(0, 14); out.rightEdges = rc.slice(0, 10);
  // How many distinct left edges (seen 2+ times) sit on a half-step of 12 columns across the content box
  const span = content.right - content.left; const strong = lc.filter(([, n]) => n >= 2);
  const pos = strong.map(([x]) => +(((x - content.left) / span) * 12).toFixed(2));
  out.edgesIn12ths = pos; out.on12half = strong.length ? +(pos.filter(p => Math.abs(p * 2 - Math.round(p * 2)) <= 0.2).length / strong.length).toFixed(2) : null;
  out.distinctStrongEdges = strong.length;
  return out;
};

// A cookie banner covers what we came to see (ledger #4): answer it the way a visitor would — reject if offered, else accept
const dismissCookies = async (p) => {
  // …and a newsletter / pop-up dialog is closed the same way (ledger #12 — Street Art News, ECC)
  // No bare "x": it matched Dribbble's X (Twitter) link, the click LEFT the shot after its first image (ledger #19). Close
  // controls are looked for only inside an open dialog, and a click that leaves the page is undone.
  const before = p.url();
  for (const re of [/^\s*(reject all|decline|deny|only necessary|necessary only|do not consent)\s*$/i, /^\s*(accept all|accept|allow all|agree|i agree|got it|ok|okay|consent)\s*$/i, /^\s*(close|×|✕|no,? thanks|dismiss|not now|close dialog|close popup)\s*$/i]) {
    // Awwwards' "Reject all" is a link and "Accept all" a styled div — a button-only search missed both (ledger #4, re-opened)
    // in EVERY frame: ECC's newsletter pop-up lives in a HubSpot iframe (ledger #16)
    for (const f of p.frames()) {
      const closing = re.source.includes('close');
      const scope = closing && f === p.mainFrame() ? f.locator('[role=dialog], [aria-modal=true], dialog[open], [class*="modal" i], [class*="popup" i]') : f;
      for (const b of [scope.getByRole('button', { name: re }).first(), scope.getByRole('link', { name: re }).first(), scope.getByText(re).first(), ...(closing ? [scope.locator('[aria-label*="close" i], [class*="close" i]').first()] : [])]) {
        if (!(await b.isVisible().catch(() => false))) continue;
        await b.click({ timeout: 3000 }).catch(() => {}); await p.waitForTimeout(800);
        if (new URL(p.url()).hostname !== new URL(before).hostname || p.url().split('#')[0] !== before.split('#')[0]) { await p.goto(before, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(() => {}); await p.waitForTimeout(1500); continue; }
        return true;
      }
    }
  }
  await p.keyboard.press('Escape').catch(() => {});
  return false;
};

// A loading screen (preloader) covers the page for its first seconds (ledger #12 — Grégory Lallé, Aqua Dev were captured
// on theirs): wait, up to 12 s, while a fixed layer with almost no words covers the middle of the screen
const waitLoader = async (p) => {
  for (let i = 0; i < 16; i++) {
    const covered = await p.evaluate(() => {
      // EVERY fixed layer, not only the one under the pointer: a loader with pointer-events:none is not hit (re-opened once)
      for (const e of document.querySelectorAll('body *')) {
        const s = getComputedStyle(e); if (s.position !== 'fixed' || s.visibility === 'hidden' || s.display === 'none' || +s.opacity <= 0.5) continue;
        const r = e.getBoundingClientRect();
        if (r.width < innerWidth * 0.9 || r.height < innerHeight * 0.9 || (e.innerText || '').trim().length >= 40 || e.querySelector('img[src], video, canvas')) continue;
        // opaque itself, or holding a full-size opaque panel (Grégory Lallé: a clear `.loader` over a white `.loader-bg`
        // that fades after ≈12 s — re-opened twice)
        const opaque = (x) => { const xs = getComputedStyle(x); const xr = x.getBoundingClientRect(); return xs.backgroundColor !== 'rgba(0, 0, 0, 0)' && +xs.opacity > 0.5 && xr.width >= innerWidth * 0.9 && xr.height >= innerHeight * 0.9; };
        if (opaque(e) || [...e.querySelectorAll('*')].some(opaque)) return true;
      }
      return false;
    }).catch(() => false);
    if (!covered) return; await p.waitForTimeout(1000);
  }
};

const visitGallery = async (p, item) => {
  await p.goto(item, { waitUntil: 'domcontentloaded', timeout: 45000 }); await p.waitForTimeout(3000);
  await dismissCookies(p);
  return p.evaluate((ONTOPIC_SRC) => {
    const ONT = new RegExp(ONTOPIC_SRC, 'i'); const host = location.hostname;
    const off = (a) => !a.href.includes(host) && /^https?:/.test(a.href) && !/twitter|facebook|linkedin|pinterest|instagram|x\.com|behance|google|apple\.com|cdn/.test(a.href);
    const label = (a) => ((a.innerText || '') + ' ' + (a.getAttribute('aria-label') || '')).trim();
    const links = [...document.querySelectorAll('a[href]')];
    // The item's own link: a "Visit" label, else an outside link written as a web address (Awwwards inspiration items
    // name the site as "thirdweb.studio" with no "Visit" label — ledger #1)
    const visit = links.filter(off).find(a => /visit (site|website|resource)|view (site|website|live)|live site|launch/i.test(label(a)))
      || (/awwwards/.test(host) ? links.filter(off).find(a => /^[a-z0-9-]+(\.[a-z0-9-]+)+\/?$/i.test((a.innerText || '').trim())) : null);
    const sitePage = /awwwards/.test(host) ? (links.find(a => /\/sites\/[^/]+$/.test(a.getAttribute('href') || '')) || {}).href || null : null;
    const desc = (document.querySelector('.shot-description-container, [class*="shot-description"], .inspiration-description, meta[name=description]') || {});
    const text = (desc.content || desc.innerText || '').trim().slice(0, 1500);
    const descLinks = /dribbble/.test(host) ? [...document.querySelectorAll('[class*="description"] a[href]')].filter(off).map(a => a.href) : [];
    const tags = [...new Set(links.filter(a => /\/tags\/|\/inspiration\/.*tag|\/search\//.test(a.getAttribute('href') || '')).map(a => (a.innerText || '').trim()).filter(t => t && t.length < 40))].slice(0, 30);
    // Only OTHER items — never this item's own parts (its colors.aco download, '#' anchors: ledger #7)
    const here = location.href.split(/[?#]/)[0];
    const ownId = (/\/shots\/(\d+)/.exec(here) || [])[1];
    const related = [...new Set(links.map(a => a.href.split(/[?#]/)[0]).filter(h => h.includes(host) && h !== here
      && (/\/inspiration\/[^/]+$/.test(h) || (/\/shots\/\d+[^/]*$/.test(h) && (/\/shots\/(\d+)/.exec(h) || [])[1] !== ownId))))];
    const media = [...document.querySelectorAll('video source, video, img')].map(v => v.currentSrc || v.src).filter(u => u && /^https?:/.test(u) && !/avatar|logo|icon|profile/i.test(u)).slice(0, 8);
    const designer = (document.querySelector('[class*="shot-user"] a, .user-name a, [rel=author], a[href*="/users/"]') || {}).innerText || '';
    return { title: document.title.replace(/ [|-] (Awwwards|Dribbble).*/i, ''), designer: designer.trim(), text, tags, site: visit ? visit.href : (descLinks[0] || null), sitePage, descLinks, related: related.slice(0, 40), relatedOnTopic: related.filter(h => ONT.test(h)), media };
  }, ONTOPIC.source);
};

const root = (h) => h.replace(/^www\./, '').split('.')[0].slice(0, 3);
const measureSite = async (p, rec, item) => {
  rec.live = {};
  for (const w of WIDTHS) {
    await p.setViewportSize({ width: w, height: w === 375 ? 812 : 900 });
    // …and a site that sends a NARROW window elsewhere (Ceram → AliExpress at 375) is caught at that width (ledger #18)
    if (w !== 1440) await p.waitForTimeout(1500); /* a resize-triggered redirect takes a moment */
    if (w !== 1440 && root(new URL(p.url()).hostname) !== root(new URL(rec.site).hostname)) { rec.deadPage = true; rec.deadTitle = `redirected at ${w} to ${new URL(p.url()).hostname}`; delete rec.live; return; }
    if (w === 1440) {
      const resp = await p.goto(rec.site, { waitUntil: 'domcontentloaded', timeout: 45000 });
      // a dead page is recorded as dead, never measured as if it were the site (ledger #13 — three 404s were)
      rec.liveStatus = resp ? resp.status() : null;
      const t = await p.title().catch(() => '');
      if ((resp && resp.status() >= 400) || /\b404\b|not found/i.test(t)) { rec.deadPage = true; rec.deadTitle = t; delete rec.live; return; }
      // a PARKED domain, or one that now sends you to an unrelated site, is not the design either (ledger #18 — Ceram was
      // parked at 1440 and redirected to AliExpress at 375). A move within the same name (eccarchitectural → ecc) is kept.
      const landed = new URL(p.url()).hostname;
      if (root(landed) !== root(new URL(rec.site).hostname)) rec.redirectedTo = landed;
      const parked = await p.evaluate(() => /domain (is )?(for sale|parked)|buy this domain|this domain may be for sale|parkingcrew|sedo|godaddy\.com\/domain/i.test(document.body.innerText + ' ' + document.title)).catch(() => false);
      if (parked || rec.redirectedTo) { rec.deadPage = true; rec.deadTitle = parked ? 'parked domain' : 'redirected to ' + landed; delete rec.live; return; }
      await p.waitForTimeout(4000); await waitLoader(p); await dismissCookies(p); await dismissCookies(p);
    } else await p.waitForTimeout(1200);
    // A page that scrolls inside its OWN container (smooth-scroll libraries, full-screen sections) does not move when the
    // window is scrolled: drive it with the wheel like a visitor, measuring and photographing each screen (ledger #5)
    const ownScroller = await p.evaluate(() => document.scrollingElement.scrollHeight <= innerHeight + 50);
    if (ownScroller) {
      rec.ownScroller = true; const steps = [];
      await p.mouse.move(w / 2, (w === 375 ? 812 : 900) / 2);
      for (let s = 1; s <= 8; s++) {
        const m = await p.evaluate(MEASURE); steps.push(m);
        if (SHOTS && (w === 1440 || w === 375)) await p.screenshot({ path: `${SHOTS}/${slug(item)}-live-${w}-s${s}.jpg`, type: 'jpeg', quality: 50 }).catch(() => {});
        await p.mouse.wheel(0, (w === 375 ? 812 : 900) * 0.9); await p.waitForTimeout(1300);
      }
      // the record keeps the first screen's numbers, plus every grid and edge seen on any screen
      const m0 = steps[0]; const seenG = new Set(m0.cssGrids.map(g => g.el + g.tpl));
      for (const m of steps.slice(1)) for (const g of m.cssGrids) if (!seenG.has(g.el + g.tpl)) { seenG.add(g.el + g.tpl); m0.cssGrids.push(g); }
      m0.screens = steps.map(m => ({ on12half: m.on12half, edgesIn12ths: m.edgesIn12ths, gutter: m.gutter, fullBleedMedia: m.fullBleedMedia }));
      rec.live[w] = m0;
      await p.goto(rec.site, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(() => {}); await p.waitForTimeout(2500);
      continue;
    }
    // Photograph it SCREEN BY SCREEN as a visitor scrolls (ledger #12): a single tall capture showed scroll-revealed
    // sections as black / empty and stopped at 7000 px. Measured at the top after the walk, so lazy sections exist.
    const vh = w === 375 ? 812 : 900;
    const total = await p.evaluate(() => document.scrollingElement.scrollHeight);
    const screens = Math.min(45, Math.ceil(total / (vh * 0.9))); /* 12 cut Aqua Dev short, 30 cut Street Art News at the phone (38) — ledger #17 */
    for (let s = 1; s <= screens; s++) {
      await p.evaluate((y) => scrollTo(0, y), (s - 1) * vh * 0.9); await p.waitForTimeout(900);
      if (SHOTS && (w === 1440 || w === 375)) await p.screenshot({ path: `${SHOTS}/${slug(item)}-live-${w}-s${s}.jpg`, type: 'jpeg', quality: 50 }).catch(() => {});
    }
    if (screens < Math.ceil(total / (vh * 0.9))) rec[`screensCut${w}`] = Math.ceil(total / (vh * 0.9));
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(600);
    rec.live[w] = await p.evaluate(MEASURE);
  }
};

(async () => {
  const worker = async (n) => {
    const ctx = await chromium.launchPersistentContext(path.join(profRoot, `grid-${n}`), { headless: false, channel: 'chrome', viewport: { width: 1440, height: 900 },
      args: ['--disable-blink-features=AutomationControlled', `--window-position=${(n % 3) * 640},${Math.floor(n / 3) * 520}`, '--window-size=640,520'] });
    const p = ctx.pages()[0] || await ctx.newPage();
    while (queue.length) {
      // marked seen when TAKEN, not when finished — else --follow re-queues an item another window is still on (ledger #2)
      const item = queue.shift(); seen.add(item); const rec = { item, at: new Date().toISOString() };
      try {
        if (/awwwards\.com|dribbble\.com/.test(item)) {
          await p.setViewportSize({ width: 1440, height: 900 });
          // A site asking "are you human" is stepped back from, never bypassed (scripts/research/README.md): the item is
          // recorded as challenged, the host is left alone for the rest of the run (ledger #11 — Dribbble, after ~20 shots)
          const host = new URL(item).hostname;
          if (challenged.has(host)) { rec.err = 'challenge (host stepped back)'; seen.add(item); done.push(rec); save(); continue; }
          Object.assign(rec, await visitGallery(p, item));
          if (/human verification|just a moment|are you (a )?human|verify you are/i.test(rec.title || '')) {
            challenged.add(host); rec.err = 'challenge'; done.push(rec); save(); console.log(`[w${n}] CHALLENGE ${host} — stepping back`); continue;
          }
          if (PACE) await p.waitForTimeout(PACE);
          if (SHOTS) await p.screenshot({ path: `${SHOTS}/${slug(item)}-gallery.jpg`, type: 'jpeg', quality: 60, fullPage: false }).catch(() => {});
          // An Awwwards inspiration item IS its own media: every slide of the top carousel (.gallery-element__media), never a
          // video further down — those are RELATED items (ledger #4, #9). Images saved whole; each video opened on its own
          // and three frames taken.
          if (SHOTS && /awwwards/.test(item)) {
            rec.media = await p.evaluate(() => [...new Set([...document.querySelectorAll('.gallery-element__media')].flatMap(e => {
              if (e.tagName === 'IMG') return [e.dataset.src || e.currentSrc || e.src];
              if (e.tagName === 'VIDEO') return [e.currentSrc || e.src || (e.querySelector('source') || {}).src];
              return [...e.querySelectorAll('img, video, source')].map(m => m.dataset.src || m.currentSrc || m.src);
            }).filter(u => u && /^https?:/.test(u) && !/blank\.mp4/.test(u)))]);
            rec.recordingFrames = [];
            for (const [i, u] of rec.media.slice(0, 6).entries()) {
              if (/\.(mp4|webm|mov)(\?|$)/i.test(u)) {
                await p.goto(u, { waitUntil: 'load', timeout: 45000 }).catch(() => {});
                const v = p.locator('video').first();
                const dur = await v.evaluate(e => new Promise(r => { if (e.readyState >= 1) r(e.duration); else { e.onloadedmetadata = () => r(e.duration); setTimeout(() => r(e.duration || 0), 10000); } })).catch(() => 0);
                for (const f of [0.15, 0.5, 0.85]) {
                  if (dur) await v.evaluate((e, t) => new Promise(r => { e.pause(); e.onseeked = r; e.currentTime = t; setTimeout(r, 4000); }), dur * f).catch(() => {});
                  const n = `${slug(item)}-m${i + 1}-f${Math.round(f * 100)}.jpg`;
                  await v.screenshot({ path: `${SHOTS}/${n}`, type: 'jpeg', quality: 70 }).then(() => rec.recordingFrames.push(n)).catch(() => {});
                }
              } else {
                const r = await p.request.get(u).catch(() => null);
                if (r && r.ok()) { const n = `${slug(item)}-m${i + 1}${(/\.(png|webp|gif)/i.exec(u) || ['.jpg'])[0]}`; fs.writeFileSync(`${SHOTS}/${n}`, await r.body()); rec.recordingFrames.push(n); }
              }
            }
          }
          // A Dribbble shot IS its images: scroll so every one loads, then capture each WHOLE (ledger #3 — the viewport
          // shot cut the design off, caught one before it loaded, and missed every image below the first)
          if (SHOTS && /dribbble/.test(item)) {
            await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 250)); } scrollTo(0, 0); });
            await p.waitForTimeout(1500);
            // any big video, not only one inside <main> — Pickle's video sits outside it (ledger #34); size filters below
            const imgs = p.locator('main img, .shot-page-container img, [class*="media-content"] img, [class*="shot-media"] img, video');
            const n = await imgs.count(); rec.shotImages = [];
            for (let i = 0, k = 0; i < n && k < 12; i++) {
              const el = imgs.nth(i); const box = await el.boundingBox().catch(() => null);
              if (!box || box.width < 500 || box.height < 200) continue;
              // the image FILE — a screenshot can catch a carousel mid-transition (ledger #14). Its own address with the
              // resize query replaced: a srcset holds commas INSIDE its URLs, and splitting on them built a 404 (ledger #15)
              // a VIDEO shot: three frames, the video opened on its own (ledger #34 — Pickle's shot is a video, 0 frames)
              if (await el.evaluate(e => e.tagName === 'VIDEO').catch(() => false)) {
                const vsrc = await el.evaluate(e => e.currentSrc || e.src || (e.querySelector('source') || {}).src).catch(() => null);
                if (vsrc) {
                  const back = p.url(); await p.goto(vsrc, { waitUntil: 'load', timeout: 45000 }).catch(() => {});
                  const v = p.locator('video').first(); const dur = await v.evaluate(x => new Promise(r => { if (x.readyState >= 1) r(x.duration); else { x.onloadedmetadata = () => r(x.duration); setTimeout(() => r(x.duration || 0), 10000); } })).catch(() => 0);
                  for (const fr of [0.15, 0.5, 0.85]) {
                    if (dur) await v.evaluate((x, t) => new Promise(r => { x.pause(); x.onseeked = r; x.currentTime = t; setTimeout(r, 4000); }), dur * fr).catch(() => {});
                    const f = `${slug(item)}-img${++k}.jpg`; await v.screenshot({ path: `${SHOTS}/${f}`, type: 'jpeg', quality: 75 }).then(() => rec.shotImages.push(f)).catch(() => {});
                  }
                  await p.goto(back, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(() => {}); await p.waitForTimeout(2000);
                }
                continue;
              }
              const src = await el.evaluate(e => e.tagName === 'IMG' ? (e.currentSrc || e.src).split('?')[0] + '?resize=1600x1200' : null).catch(() => null);
              const resp = src && /^https?:/.test(src) ? await p.request.get(src).catch(() => null) : null;
              if (resp && resp.ok()) { const f = `${slug(item)}-img${++k}${(/\.(png|webp|gif)/i.exec(src) || ['.jpg'])[0]}`; fs.writeFileSync(`${SHOTS}/${f}`, await resp.body()); rec.shotImages.push(f); continue; }
              await el.scrollIntoViewIfNeeded().catch(() => {}); await p.waitForTimeout(1500);
              const f = `${slug(item)}-img${++k}.jpg`;
              await el.screenshot({ path: `${SHOTS}/${f}`, type: 'jpeg', quality: 70 }).then(() => rec.shotImages.push(f)).catch(() => {});
            }
          }
          // only AFTER the item's own media is captured: the live link may sit on its /sites/ page (ledger #10)
          if (!rec.site && rec.sitePage) {
            await p.goto(rec.sitePage, { waitUntil: 'domcontentloaded', timeout: 45000 }); await p.waitForTimeout(2500);
            rec.site = await p.evaluate(() => { const v = [...document.querySelectorAll('a[href]')].find(a => /visit (site|resource|website)/i.test(a.innerText || '') && !a.href.includes(location.hostname)); return v ? v.href : null; });
          }
          // ONE level (RULE R): only the user's own items queue their related ones, never a followed item (ledger #6)
          if (followed.has(item)) rec.followedFrom = followed.get(item);
          else if (FOLLOW) for (const r of rec.relatedOnTopic || []) if (!seen.has(r) && !queue.includes(r)) { queue.push(r); followed.set(r, item); rec.queued = (rec.queued || 0) + 1; }
        } else rec.site = item;
        if (rec.site) await measureSite(p, rec, item); else rec.noLiveSite = true;
      } catch (e) {
        rec.err = String(e.message || e).slice(0, 200);
        // a page that navigated itself mid-measure (ceram.studio) gets one more try (ledger #8)
        if (!retried.has(item) && /context was destroyed|Timeout/i.test(rec.err)) { retried.add(item); queue.push(item); console.log(`[w${n}] retry ${item}`); continue; }
      }
      seen.add(item); done.push(rec); save();
      console.log(`[w${n}] ${done.length} ${rec.err ? 'ERR ' + rec.err : 'ok'} ${item} -> ${rec.site || '-'} | 12-fit@1440 ${rec.live && rec.live[1440] ? rec.live[1440].on12half : '-'} | left: ${queue.length}`);
    }
    await ctx.close();
  };
  await Promise.all(Array.from({ length: JOBS }, (_, n) => worker(n)));
  console.log('DONE', done.length);
})();
