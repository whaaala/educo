// Measure every site of a list LIVE, the way a visitor meets it — the raw material of the MOTION LIBRARY
// (docs/web-anatomy/motion/LIBRARY.md), captured ONCE for the builder's layout, its components AND the Educo app.
//   node aw-measure.js <list.json> <out.json> <chrome-profile-dir> [--shots=<dir>] [--jobs=6] [--extra]
// A list entry is a gallery item (Awwwards /sites/ or /inspiration/, Made in Webflow, One Page Love — its "Visit" /
// "Preview" is followed) or a live URL. Per site, on DESKTOP (1440×900):
//   · INTRO: shots at 0.7s and at load, any full-screen cover (preloader) and when it went
//   · libraries · CSS features · every sticky / fixed element · GSAP pin-spacers · weight (cache off) · keyboard focus look
//   · HOW it is done: the CSS rules, @keyframes and script calls that make the motion, verbatim
//   · TIMING: every transition / animation duration, easing, property and name in use, + script eases / durations
//   · SCROLL: a no-scroll control, then five steps — WHICH elements change and HOW (translate · scale · rotate · fade ·
//     clip · filter, move as a ratio of the scroll), frames per second and long tasks while scrolling
//   · HOVER on up to 8 elements: what changed on it / its children / its parent, its own timing, a 3-frame strip;
//     the :hover / :focus-visible rules and whether they are gated by (hover: hover)
//   · CURSOR: an element that follows the pointer · SHADOWS: every distinct box-shadow
//   · MENU: open it (frame strip), Escape — does it close, does focus return
//   · PAGE TRANSITION: click an internal link, view transitions hooked, full-screen overlay sampled for 1.5s
// then REDUCED MOTION (prefers-reduced-motion: reduce — what still moves) and PHONE (360×740, touch, Android UA, CPU
// 4× slower: held bars, scroll changes, fps, the phone menu). Real Chrome (Cloudflare stops plain Chromium),
// persistent profile, N windows, resumable, failures retried (R-8).
const { chromium } = require(require.resolve('playwright', { paths: [process.cwd()] }));
const fs = require('fs');
const [,, listFile, outFile, profile] = process.argv;
const extra = process.argv.includes('--extra') ? ['https://www.awwwards.com/inspiration/scroll-rosehip','https://www.awwwards.com/inspiration/horizontal-scrolling-page-studio-illicit','https://www.awwwards.com/inspiration/scroll-overview-quechua-2025-lookbook','https://www.awwwards.com/inspiration/scroll-based-animations-g-s','https://www.awwwards.com/inspiration/work-page-emma-is-social','https://www.awwwards.com/inspiration/homepage-on-scroll-melvin-winkeler','https://www.awwwards.com/inspiration/infinite-scroll-photo-archive-theatre-memory','https://www.awwwards.com/inspiration/homepage-animation-type-one-ventures'] : [];
const sites = [...new Set(JSON.parse(fs.readFileSync(listFile, 'utf8')).concat(extra))];
// A record that failed (timeout, navigation) is NOT done: it is retried, and run again on a restart (R-8).
const failed = (r) => !!r.err || (!r.kb && !r.noLiveSite && !r.navErr);
const done = (fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : []).filter(r => !failed(r));
const tries = {};
const seen = new Set(done.map(d => d.aw));
// A live site already measured under ANOTHER source (a site sits in a category, a collection and a Webflow list) is
// not measured twice: its record points there instead (`sameAs`). Built from every run file beside this one.
const path = require('path');
const measuredSites = new Map();
for (const f of fs.readdirSync(path.dirname(outFile)).filter(f => f.endsWith('.json') && path.join(path.dirname(outFile), f) !== path.resolve(outFile))) {
  try { for (const r of JSON.parse(fs.readFileSync(path.join(path.dirname(outFile), f), 'utf8'))) if (r && r.site && r.kb && !r.sameAs) measuredSites.set(r.site.replace(/\/$/, ''), f); } catch {}
}
const JOBS = +((process.argv.find(a => a.startsWith('--jobs=')) || '').slice(7) || 6);
const save = () => fs.writeFileSync(outFile, JSON.stringify(done, null, 1));
const SHOTS = (process.argv.find(a => a.startsWith('--shots=')) || '').slice(8) || null;
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const slug = (u) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/[^a-z0-9]+/gi, '-').slice(0, 80);
const ANDROID_UA = 'Mozilla/5.0 (Linux; Android 13; SM-A145F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36';

// In the page: remember every element's transform / opacity / clip / filter, or compare with what was remembered.
const SNAP = (mode) => {
  const parse = (t) => {
    if (!t || t === 'none') return [0, 0, 1, 0];
    const v = t.slice(t.indexOf('(') + 1, -1).split(',').map(Number);
    const [a, b, c, d, tx, ty] = v.length === 16 ? [v[0], v[1], v[4], v[5], v[12], v[13]] : v;
    return [tx, ty, Math.hypot(a, b), Math.atan2(b, a) * 180 / Math.PI, Math.hypot(c, d)];
  };
  const read = (el) => { const cs = getComputedStyle(el); return { t: parse(cs.transform), o: +cs.opacity, c: cs.clipPath, f: cs.filter, top: el.getBoundingClientRect().top }; };
  const all = [...document.querySelectorAll('body *')].slice(0, 5000);
  if (mode === 'before') { window.__awS = new Map(all.map(el => [el, read(el)])); window.__awY = scrollY; return all.length; }
  const dy = scrollY - (window.__awY || 0); const kinds = {}; const samples = []; let changed = 0;
  for (const [el, a] of window.__awS || []) {
    if (!el.isConnected) continue;
    const b = read(el); const k = [];
    const mx = b.t[0] - a.t[0], my = b.t[1] - a.t[1];
    if (Math.abs(mx) + Math.abs(my) > 2) k.push('translate');
    if (Math.abs(b.t[2] - a.t[2]) > 0.01 || Math.abs((b.t[4] || 1) - (a.t[4] || 1)) > 0.01) k.push('scale');
    if (Math.abs(b.t[3] - a.t[3]) > 0.5) k.push('rotate');
    if (Math.abs(b.o - a.o) > 0.05) k.push('fade');
    if (b.c !== a.c) k.push('clip');
    if (b.f !== a.f) k.push('filter');
    if (!k.length) continue;
    changed++; for (const x of k) kinds[x] = (kinds[x] || 0) + 1;
    if (samples.length < 30) {
      const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      samples.push({ k: k.join('+'), tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 50), txt: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40),
        img: !!(el.matches('img,video,canvas,picture') || el.querySelector('img,video,canvas')), w: Math.round(r.width), h: Math.round(r.height),
        moveRatio: dy ? Math.round(my / dy * 100) / 100 : null, scale: [Math.round(a.t[2] * 100) / 100, Math.round(b.t[2] * 100) / 100], op: [a.o, b.o], clip: b.c !== a.c ? [a.c.slice(0, 50), b.c.slice(0, 50)] : undefined,
        timing: cs.transitionDuration !== '0s' ? cs.transitionDuration + ' ' + cs.transitionTimingFunction : cs.animationName !== 'none' ? cs.animationName + ' ' + cs.animationDuration + ' ' + cs.animationTimingFunction : '' });
    }
  }
  return { changed, kinds, samples, scrolled: Math.round(dy) };
};
// Anything fixed / absolute covering ≥25% of the window (preloader, menu panel, transition overlay).
const COVER = () => {
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el); if (cs.position !== 'fixed' && cs.position !== 'absolute') continue;
    const r = el.getBoundingClientRect(); const vis = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
    if (vis < innerWidth * innerHeight * 0.25 || cs.visibility === 'hidden' || +cs.opacity < 0.05) continue;
    // OPAQUE = it actually hides what is under it: a solid-ish background, a picture, or media filling it. A see-through
    // full-screen wrapper is not a preloader or an overlay (R-18 counted them: 69% "intro covers" were really 38%).
    const a = (cs.backgroundColor.match(/rgba?\(([^)]+)\)/) || [, '0,0,0,0'])[1].split(',').map(Number);
    const opaque = (a.length < 4 || a[3] > 0.5) && cs.backgroundColor !== 'transparent' || cs.backgroundImage !== 'none' || /^(IMG|VIDEO|CANVAS)$/.test(el.tagName) || !!el.querySelector(':scope > img, :scope > video, :scope > canvas');
    out.push({ tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 40), cov: Math.round(vis / (innerWidth * innerHeight) * 100), opaque, z: cs.zIndex, bg: cs.backgroundColor, o: cs.opacity, t: cs.transform.slice(0, 50), c: cs.clipPath.slice(0, 50), txt: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40) });
    if (out.length > 3) break;
  }
  return out;
};
const HELD = () => [...document.querySelectorAll('body *')].filter(el => { const p = getComputedStyle(el).position; return (p === 'sticky' || p === 'fixed') && el.offsetHeight > 1 && el.offsetWidth > 1; }).slice(0, 12)
  .map(el => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return { pos: cs.position, tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 40), txt: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40), top: cs.top, bottom: cs.bottom, w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.top) }; });
const FPS_START = () => { window.__fr = 0; window.__lt0 = window.__lt || 0; window.__frOn = 1; window.__ft0 = performance.now(); const tick = () => { window.__fr++; if (window.__frOn) requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
// Frames per second is NOT recorded: with several windows open Chrome slows the frames of covered windows, so a
// number here would be false (R-9 — a 330 KB page read 2 fps). Long tasks are real main-thread time and are kept;
// smoothness is measured in its own one-window pass on the shortlisted techniques.
const FPS_END = () => { window.__frOn = 0; return { longTaskMs: Math.round((window.__lt || 0) - window.__lt0) }; };

(async () => {
  const ctx = await chromium.launchPersistentContext(profile, { headless: false, channel: 'chrome', viewport: { width: 1440, height: 900 },
    args: ['--disable-blink-features=AutomationControlled', '--disable-renderer-backgrounding', '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows'] });
  await ctx.addInitScript(() => {
    // Same-document view transitions, from the very first script; cross-document via pagereveal; long tasks.
    window.__vt = 0;
    const hook = () => { const o = document.startViewTransition; if (o && !o.__aw) { const f = function (...a) { window.__vt++; return o.apply(document, a); }; f.__aw = 1; document.startViewTransition = f; } };
    hook(); document.addEventListener('DOMContentLoaded', hook);
    addEventListener('pagereveal', (e) => { window.__vtCross = !!e.viewTransition; });
    window.__lt = 0; try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt += e.duration; }).observe({ type: 'longtask', buffered: true }); } catch {}
  });
  // SATURATION (the user, 2026-10-02: "do we need 25,000 items?" — no): with --saturate=N a source is run in RANDOM
// order and stops once N items in a row add nothing new to what the source has shown (a library, a CSS feature, a kind
// of scroll change, a hover change, a page-transition kind, a menu behaviour, a held-element kind, a phone behaviour).
// Without it (the user's own links) every item is run.
const SAT = +((process.argv.find(a => a.startsWith('--saturate=')) || '').slice(11) || 0);
const known = new Set(); let streak = 0;
// R2-34: --signature=surface saturates on what R-2 asks (texture / overlay / glass / shadow), not on motion — on a texture
// category a new MENU pattern kept resetting the streak, so "saturated" would never have meant saturated on texture
const SURFACE_SIG = process.argv.includes('--signature=surface');
const surfaceSignature = (r) => {
  const s = []; const d = r.surfaceDom || {};
  for (const k of Object.keys(d.fe || {})) s.push('fe:' + k);
  if (d.canvas) s.push('canvas');
  for (const b of d.big || []) s.push('big:' + (/gradient/.test(b.bg) ? (/url/.test(b.bg) ? 'gradient+image' : 'gradient') : /svg/.test(b.bg) ? 'svg' : /\.(png|gif)/i.test(b.bg) ? 'tile-image' : 'photo') + ':' + (/no-repeat/.test(b.repeat) ? 'single' : 'tiled') + (b.blend && !/^normal(, normal)*$/.test(b.blend) ? ':blend' : '') + (b.mix !== 'normal' ? ':mix' : '') + (+b.opacity < 1 ? ':translucent' : ''));
  for (const k of ['gradient', 'noiseSvg', 'filterUrl', 'blendMode', 'mixBlend', 'backdrop', 'clipPath', 'mask']) if ((r.cssF || {})[k]) s.push('css:' + k);
  const rules = ((r.how && r.how.css && r.how.css.surface) || []).join('\n');
  for (const [k, re] of Object.entries({ conic: /conic-gradient/, radial: /radial-gradient/, repeating: /repeating-/, layeredShadow: /box-shadow:[^;]*\),[^;]*\)/, insetShadow: /inset/, textShadow: /text-shadow/ })) if (re.test(rules)) s.push('rule:' + k);
  return s;
};
const signature = (r) => {
  if (SURFACE_SIG) return surfaceSignature(r);
  const s = [];
  for (const [k, v] of Object.entries(r.libs || {})) if (v) s.push('lib:' + k);
  for (const [k, v] of Object.entries(r.cssF || {})) if (v) s.push('css:' + k);
  for (const st of r.scroll || []) for (const k of Object.keys(st.kinds || {})) s.push('scroll:' + k);
  for (const h of (r.hover && r.hover.results) || []) for (const c of h.changed || []) s.push('hover:' + c);
  if (r.pageTransition) s.push('pt:' + r.pageTransition.kind);
  if (r.menu && r.menu.found) s.push('menu:esc-' + r.menu.escapeCloses + ':focus-' + r.menu.focusReturned + ':lock-' + !!(r.menu.opened && r.menu.opened.scrollLocked));
  for (const h of r.held || []) s.push('held:' + h.pos + ':' + (h.hasNav ? 'nav' : h.hasImg ? 'media' : 'other') + (h.blur ? ':glass' : ''));
  if (r.intro && r.intro.at700 && r.intro.at700.cover && r.intro.at700.cover.some(c => c.cov > 80)) s.push('intro:cover');
  if (r.cursor && r.cursor.followers && r.cursor.followers.length) s.push('cursor:follower');
  if (r.reducedMotion) s.push('rm:' + ((r.reducedMotion.scroll || []).some(x => x && x.changed) ? 'still-moves' : 'stills'));
  if (r.phone) { s.push('phone:held-' + Math.min(3, (r.phone.held || []).length)); if (r.phone.overflowX) s.push('phone:overflow'); if (r.phone.menu && r.phone.menu.found) s.push('phone:menu'); }
  return s;
};
for (const r of done) for (const k of signature(r)) known.add(k);
const queue = sites.filter(s => !seen.has(s));
if (SAT) for (let i = queue.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [queue[i], queue[j]] = [queue[j], queue[i]]; }
  const worker = async () => {
    const p = await ctx.newPage();
    const cdp = await ctx.newCDPSession(p);
    // Weight must be what a first visitor downloads — never the persistent profile's cache (R-1).
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true }).catch(() => {});
    while (queue.length) {
      const aw = queue.shift(); const rec = { aw, measuredAt: new Date().toISOString() };
      const guard = setTimeout(() => p.goto('about:blank').catch(() => {}), 300000);
      const shot = (n, clip) => SHOTS && p.screenshot({ path: `${SHOTS}/${slug(aw)}-${n}.jpg`, type: 'jpeg', quality: 55, clip }).then(() => `${slug(aw)}-${n}.jpg`).catch(() => null);
      try {
        if (/awwwards\.com|webflow\.com\/made-in-webflow|onepagelove\.com/.test(aw)) {
          await p.goto(aw, { waitUntil: 'domcontentloaded', timeout: 40000 }); await p.waitForTimeout(2000);
          Object.assign(rec, await p.evaluate(() => {
            // The item's OWN link, in order of trust: the gallery's "Visit site / website" button (One Page Love keeps it
            // in .review-header), then "Preview" (Made in Webflow). Never "Launch website": that is One Page Love's list
            // of OTHER sites under the review — taking it measured a recommended site instead of the item (R-15).
            const host = location.hostname;
            const off = (a) => !a.href.includes(host) && /^https?:/.test(a.href) && !/twitter|facebook|linkedin|pinterest|instagram/.test(a.href);
            const label = (a) => ((a.innerText || '') + ' ' + (a.getAttribute('aria-label') || '')).trim();
            const links = [...document.querySelectorAll('.review-header a[href], a[href]')].filter(off);
            // …and on Made in Webflow, the item's own `*.webflow.io` site, wherever it is linked — a CLONEABLE page has no
            // "Preview" label (R-2, 2026-10-03: 12 of 12 overlay items went unmeasured), and its description names the site.
            const wfLive = /webflow\.com$/.test(host) ? (links.find(a => /^https:\/\/[^/]+\.webflow\.io\b/.test(a.href)) || (() => { const m = /https:\/\/[a-z0-9-]+\.webflow\.io[^\s"')]*/i.exec((document.querySelector('meta[name=description]') || {}).content + ' ' + document.body.innerText); return m ? { href: m[0] } : null; })()) : null;
            const visit = links.find(a => /^\s*visit (site|website|resource)\b/i.test(label(a))) || links.find(a => /^\s*(preview|view (site|website|live)|live site)\b/i.test(label(a))) || wfLive;
            const tags = [...new Set([...document.querySelectorAll('a[href*="/websites/"], a[href*="/inspiration/"], a[href*="tag"]')].map(a => (a.innerText || '').trim()).filter(t => t && t.length < 30))].slice(0, 40);
            // An inspiration item is a RECORDING of the effect: keep the video, and the site's own Awwwards page (R-5).
            const vids = [...document.querySelectorAll('video source, video')].map(v => v.src || v.currentSrc).filter(u => u && /^https?:/.test(u)).slice(0, 2);
            // Awwwards only: on Made in Webflow `a[href*="/sites/"]` is the "Clone" button (dashboard/sites/new — a sign-up page)
            const sitePage = /awwwards\.com$/.test(host) ? (document.querySelector('main a[href*="/sites/"], a[href*="/sites/"]') || {}).href || null : null;
            return { title: document.title.replace(/ - Awwwards.*/, ''), site: visit ? visit.href : null, sitePage, vids, tags, desc: (document.querySelector('meta[name=description]') || {}).content || '' };
          }));
          if (!rec.site && rec.sitePage) {
            await p.goto(rec.sitePage, { waitUntil: 'domcontentloaded', timeout: 40000 }); await p.waitForTimeout(2000);
            rec.site = await p.evaluate(() => { const v = [...document.querySelectorAll('a[href]')].find(a => /visit (site|resource)/i.test(a.innerText || '') && !a.href.includes(location.hostname)); return v ? v.href : null; });
          }
          if (!rec.site) rec.noLiveSite = true;
        } else rec.site = aw;
        const already = rec.site && measuredSites.get(rec.site.replace(/\/$/, ''));
        if (already) { rec.sameAs = already; rec.kb = -1; }
        else if (rec.site) {
          let bytes = 0, reqs = 0; const onFin = async (r) => { reqs++; try { const s = await r.sizes(); bytes += s.responseBodySize + s.responseHeadersSize; } catch {} };
          p.on('requestfinished', onFin);
          const t0 = Date.now();
          // INTRO: what a visitor sees while it loads (preloader, intro animation).
          await p.goto(rec.site, { waitUntil: 'commit', timeout: 45000 }).catch(e => rec.navErr = e.message.slice(0, 80));
          await p.waitForTimeout(700);
          rec.intro = { at700: { shot: await shot('00-intro-0.7s'), cover: await p.evaluate(COVER).catch(() => []) } };
          await p.waitForLoadState('load', { timeout: 45000 }).catch(e => rec.navErr = rec.navErr || e.message.slice(0, 80));
          rec.loadMs = Date.now() - t0;
          rec.intro.atLoad = { shot: await shot('01-intro-load'), cover: await p.evaluate(COVER).catch(() => []) };
          await p.waitForTimeout(3500);
          const info = await p.evaluate(async () => {
            const w = window; const html = document.documentElement;
            const scripts = [...document.scripts].map(s => s.src).filter(Boolean);
            const inline = [...document.scripts].filter(s => !s.src).map(s => s.textContent).join('\n').slice(0, 400000);
            const libs = { gsap: !!w.gsap || scripts.some(s => /gsap|greensock/i.test(s)), scrollTrigger: !!w.ScrollTrigger || scripts.some(s => /scrolltrigger/i.test(s)), lenis: !!w.Lenis || html.classList.contains('lenis') || scripts.some(s => /lenis/i.test(s)), locomotive: html.classList.contains('has-scroll-smooth') || scripts.some(s => /locomotive/i.test(s)), barba: !!w.barba || scripts.some(s => /barba/i.test(s)) || !!document.querySelector('[data-barba]'), swup: !!w.swup || scripts.some(s => /swup/i.test(s)) || !!document.querySelector('#swup, .transition-fade'), taxi: !!document.querySelector('[data-taxi]'), highway: !!document.querySelector('[data-router-wrapper]'), three: !!w.THREE || scripts.some(s => /three(\.module)?(\.min)?\.js|webgl|ogl/i.test(s)), canvas: !!document.querySelector('canvas'), framer: !!document.querySelector('[data-framer-name], #__framer-badge-container'), webflow: !!w.Webflow || !!document.querySelector('[data-wf-page]'), lottie: !!w.lottie || !!w.bodymovin || !!document.querySelector('lottie-player, dotlottie-player'), split: scripts.some(s => /split/i.test(s)) || /SplitText|SplitType|splitting/i.test(inline), swiper: !!w.Swiper || !!document.querySelector('.swiper'), motion: scripts.some(s => /framer-motion|motion\.dev|\/motion@/i.test(s)), animejs: !!w.anime || scripts.some(s => /anime(\.min)?\.js/i.test(s)), aos: !!w.AOS || !!document.querySelector('[data-aos]'), next: !!w.__NEXT_DATA__ || !!document.querySelector('#__next') || !!w.next, nuxt: !!w.__NUXT__ || !!w.$nuxt, astro: !!document.querySelector('astro-island') };
            let css = '';
            for (const sh of document.styleSheets) { try { css += [...sh.cssRules].map(r => r.cssText).join('\n'); } catch { if (sh.href) { try { css += await (await fetch(sh.href)).text(); } catch {} } } if (css.length > 3e6) break; }
            const has = (re) => (css.match(re) || []).length;
            const cssF = { animTimeline: has(/animation-timeline/g), viewTimeline: has(/view-timeline|view\(\)/g), scrollTimeline: has(/scroll-timeline|scroll\(\)/g), viewTransition: has(/view-transition/g), crossDocVT: has(/@view-transition/g), scrollSnap: has(/scroll-snap-type/g), sticky: has(/position:\s*sticky/g), fixed: has(/position:\s*fixed/g), clipPath: has(/clip-path/g), mask: has(/mask-image|mask:/g), keyframes: has(/@keyframes/g), startingStyle: has(/@starting-style/g), allowDiscrete: has(/allow-discrete/g), reducedMotion: has(/prefers-reduced-motion/g), hoverMedia: has(/\(hover:\s*hover\)/g), focusVisible: has(/:focus-visible/g), hasSel: has(/:has\(/g), mixBlend: has(/mix-blend-mode/g), backdrop: has(/backdrop-filter/g), marquee: has(/marquee|ticker/gi), linearEase: has(/linear\(/g), scrollState: has(/scroll-state/g), anchorPos: has(/anchor-name|position-anchor/g), containerQ: has(/@container/g), noiseSvg: has(/feTurbulence/g), gradient: has(/gradient\(/g), filterUrl: has(/filter:\s*url\(/g), blendMode: has(/background-blend-mode/g) };
            const jsReduced = /prefers-reduced-motion/.test(inline);
            // HOW it is done: the CSS rules and script calls that make the motion, verbatim (capped per kind).
            const rules = (re, n) => [...new Set((css.match(new RegExp('[^{}]*\\{[^{}]*(' + re + ')[^{}]*\\}', 'g')) || []).map(s => s.trim().slice(0, 400)))].slice(0, n);
            // R2-26: the SURFACE too (texture / overlay / glass / shadow sites) — the measurer recorded only motion, so 78 texture sites held nothing about texture
            const how = { css: { surface: rules('gradient\\(|filter:\\s*url|backdrop-filter|blend-mode|background-image:\\s*url|box-shadow:[^;]*,', 12), sticky: rules('position:\\s*sticky', 6), fixed: rules('position:\\s*fixed', 6), timeline: rules('animation-timeline|view-timeline|scroll-timeline|animation-range', 8), viewTransition: rules('view-transition', 8), clip: rules('clip-path|mask-image', 6), snap: rules('scroll-snap', 4), starting: rules('@starting-style|allow-discrete', 4), reduced: (css.match(/@media[^{]*prefers-reduced-motion[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g) || []).map(s => s.slice(0, 500)).slice(0, 3) },
              keyframes: (css.match(/@keyframes\s+[\w-]+\s*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g) || []).map(s => s.slice(0, 300)).slice(0, 12) };
            let code = inline; for (const s of scripts.filter(s => new URL(s, location.href).origin === location.origin).slice(0, 8)) { try { code += '\n' + (await (await fetch(s)).text()).slice(0, 2e6); } catch {} }
            how.js = [...new Set((code.match(/.{0,160}(ScrollTrigger\.create|scrollTrigger\s*:|pin\s*:\s*(true|['"`])|scrub\s*:|startViewTransition|barba\.init|new Swup|new Lenis|IntersectionObserver|data-scroll-speed|requestAnimationFrame).{0,240}/g) || []).map(s => s.trim()))].slice(0, 16);
            // TIMING: what durations / easings / properties the page really uses (the raw material of motion tokens).
            const tally = {}; const inc = (k, v) => { if (!v || v === '0s' || v === 'none' || v === 'all') return; (tally[k] = tally[k] || {})[v] = (tally[k][v] || 0) + 1; };
            for (const el of [...document.querySelectorAll('body *')].slice(0, 5000)) { const cs = getComputedStyle(el);
              if (cs.transitionDuration !== '0s') { inc('transitionDuration', cs.transitionDuration); inc('transitionEase', cs.transitionTimingFunction); inc('transitionProperty', cs.transitionProperty); inc('transitionDelay', cs.transitionDelay); }
              if (cs.animationName !== 'none') { inc('animationName', cs.animationName); inc('animationDuration', cs.animationDuration); inc('animationEase', cs.animationTimingFunction); } }
            const timing = {}; for (const k in tally) timing[k] = Object.entries(tally[k]).sort((a, b) => b[1] - a[1]).slice(0, 12);
            const cnt = (re) => { const m = {}; for (const x of code.match(re) || []) m[x] = (m[x] || 0) + 1; return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 12); };
            timing.scriptEases = cnt(/ease\s*:\s*["'`][\w.()\-,\s]{2,40}["'`]/g);
            timing.scriptDurations = cnt(/duration\s*:\s*[\d.]+/g);
            let stickyEls = 0, fixedEls = 0, tallPins = 0; const held = [];
            const desc = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { tag: el.tagName.toLowerCase(), role: el.getAttribute('role') || '', cls: (el.className || '').toString().slice(0, 60), txt: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60), top: cs.top, bottom: cs.bottom, left: cs.left, z: cs.zIndex, w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.top), bg: cs.backgroundColor, blur: cs.backdropFilter !== 'none' ? cs.backdropFilter : '', blend: cs.mixBlendMode !== 'normal' ? cs.mixBlendMode : '', hasNav: !!el.querySelector('nav, a'), hasImg: !!el.querySelector('img, video, canvas') }; };
            for (const el of document.querySelectorAll('body *')) { const cs = getComputedStyle(el); if (cs.position === 'sticky') { stickyEls++; const par = el.parentElement; const tall = par && par.offsetHeight > innerHeight * 1.8; if (tall) tallPins++; if (held.length < 14) held.push({ pos: 'sticky', parentH: par ? Math.round(par.offsetHeight / innerHeight * 10) / 10 + 'vh-units' : '', ...desc(el) }); } else if (cs.position === 'fixed' && el.offsetHeight > 1 && el.offsetWidth > 1) { fixedEls++; if (held.length < 14) held.push({ pos: 'fixed', ...desc(el) }); } }
            const pinSpacers = [...document.querySelectorAll('.pin-spacer')].slice(0, 6).map(s => ({ h: Math.round(s.offsetHeight / innerHeight * 10) / 10, child: (s.firstElementChild?.className || '').toString().slice(0, 50), txt: (s.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60) }));
            const sections = [...document.querySelectorAll('section, [class*="section"]')].length;
            const splitText = [...document.querySelectorAll('h1, h2')].filter(h => h.querySelectorAll('span, div').length > 6).length;
            const surfaceDom = (() => { const fe = {}; for (const e of document.querySelectorAll('filter *')) fe[e.tagName] = (fe[e.tagName] || 0) + 1; const big = [...document.querySelectorAll('body *')].filter((e) => { const cs = getComputedStyle(e); return /url\(|gradient\(/.test(cs.backgroundImage) && e.offsetWidth * e.offsetHeight > innerWidth * innerHeight * 0.3; }).slice(0, 6).map((e) => { const cs = getComputedStyle(e); return { tag: e.tagName.toLowerCase(), bg: cs.backgroundImage.slice(0, 200), size: cs.backgroundSize, repeat: cs.backgroundRepeat, blend: cs.backgroundBlendMode, mix: cs.mixBlendMode, opacity: cs.opacity }; }); return { fe, canvas: document.querySelectorAll('canvas').length, big }; })();
            return { surfaceDom, how, timing, libs, cssF, jsReduced, stickyEls, fixedEls, tallPins, held, pinSpacers, sections, splitText, docH: html.scrollHeight, vh: innerHeight, cursorNone: getComputedStyle(document.body).cursor === 'none', lang: html.lang, h1: (document.querySelector('h1')?.innerText || '').trim().slice(0, 80) };
          }).catch(e => ({ err: e.message.slice(0, 80) }));
          // KEYBOARD: what focus looks like on the first four Tab stops.
          info.focus = [];
          for (let k = 0; k < 4; k++) { await p.keyboard.press('Tab'); await p.waitForTimeout(250);
            info.focus.push(await p.evaluate(() => { const a = document.activeElement; if (!a || a === document.body) return null; const cs = getComputedStyle(a); const r = a.getBoundingClientRect();
              return { tag: a.tagName.toLowerCase(), txt: (a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 30), outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor, offset: cs.outlineOffset, shadow: cs.boxShadow.slice(0, 80), visible: (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none', onScreen: r.bottom > 0 && r.top < innerHeight, skipLink: /skip/i.test(a.innerText || '') }; }).catch(() => null)); }
          await p.evaluate(() => document.activeElement && document.activeElement.blur()).catch(() => {});
          // SCROLL — control first: what changes with NO scroll (carousels, loaders, marquees).
          await p.evaluate(SNAP, 'before').catch(() => {}); await p.waitForTimeout(900);
          info.idle = await p.evaluate(SNAP, 'after').catch(e => ({ err: e.message.slice(0, 60) }));
          info.scroll = [];
          await shot('0-top');
          for (let k = 1; k <= 5; k++) {
            await p.evaluate(SNAP, 'before').catch(() => {});
            await p.mouse.wheel(0, 900); await p.waitForTimeout(900);
            info.scroll.push(await p.evaluate(SNAP, 'after').catch(e => ({ err: e.message.slice(0, 60) })));
            if (k === 2 || k === 5) await shot(`${k}-scroll`);
          }
          // Smoothness on its OWN scroll: the snapshots above walk 5,000 elements and would block the frames (R-9).
          info.scrollPerf = await perfScroll(p);
          info.scrollChanged = info.scroll.reduce((n, s) => n + (s.changed || 0), 0);
          info.scrolledTo = await p.evaluate(() => Math.round(scrollY)).catch(() => -1);
          p.off('requestfinished', onFin);
          Object.assign(rec, info, { kb: Math.round(bytes / 1024), reqs });
          await p.evaluate(() => scrollTo(0, 0)).catch(() => {}); await p.waitForTimeout(600);
          rec.hover = await hoverProbe(p, shot).catch(e => ({ err: e.message.slice(0, 80) }));
          rec.cursor = await cursorProbe(p).catch(e => ({ err: e.message.slice(0, 80) }));
          rec.shadows = await p.evaluate(() => { const m = {}; for (const el of [...document.querySelectorAll('body *')].slice(0, 5000)) { const s = getComputedStyle(el).boxShadow; if (s !== 'none') m[s] = (m[s] || 0) + 1; } return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 15); }).catch(() => []);
          rec.menu = await menuProbe(p, shot, 'menu').catch(e => ({ err: e.message.slice(0, 80) }));
          rec.pageTransition = await pageTransition(p, () => shot('6-transition')).catch(e => ({ err: e.message.slice(0, 80) }));
          // REDUCED MOTION: the same page, the visitor asking for less motion — what still moves?
          await p.emulateMedia({ reducedMotion: 'reduce' });
          await p.goto(rec.site, { waitUntil: 'load', timeout: 45000 }).catch(() => {}); await p.waitForTimeout(3000);
          const rmIdleB = await p.evaluate(SNAP, 'before').catch(() => 0); await p.waitForTimeout(900);
          const rmIdle = await p.evaluate(SNAP, 'after').catch(() => null);
          const rmScroll = [];
          for (let k = 0; k < 2; k++) { await p.evaluate(SNAP, 'before').catch(() => {}); await p.mouse.wheel(0, 900); await p.waitForTimeout(900); rmScroll.push(await p.evaluate(SNAP, 'after').catch(() => null)); }
          rec.reducedMotion = { idle: rmIdle && { changed: rmIdle.changed, kinds: rmIdle.kinds }, scroll: rmScroll.map(s => s && { changed: s.changed, kinds: s.kinds }), shot: await shot('7-reduced'), normalScrollChanged: (info.scroll || []).slice(0, 2).reduce((n, s) => n + (s.changed || 0), 0), elementsSeen: rmIdleB };
          await p.emulateMedia({ reducedMotion: 'no-preference' });
          // PHONE: 360×740, touch, Android, CPU 4× slower — a low-cost phone (RULE AF).
          rec.phone = await phonePass(p, cdp, rec.site, shot).catch(e => ({ err: e.message.slice(0, 80) }));
        }
      } catch (e) { rec.err = e.message.slice(0, 100); }
      clearTimeout(guard);
      // R2-33: a closed BROWSER is not a failed site — it ran through 765 queued sites in seconds, each "failed", and printed DONE.
      // Stop at once, loudly; a rerun resumes (failed records are retried)
      if (/has been closed|Browser closed|Target closed/i.test(rec.err || '')) { save(); console.log(`BROWSER CLOSED after ${done.length} measured — stopped (R2-33); rerun the same command to resume`); process.exit(2); }
      await p.emulateMedia({ reducedMotion: 'no-preference' }).catch(() => {});
      if (failed(rec) && (tries[aw] = (tries[aw] || 0) + 1) < 3) { queue.push(aw); console.log('retry later', aw, (rec.err || '').slice(0, 50)); continue; }
      if (rec.site && rec.kb > 0) measuredSites.set(rec.site.replace(/\/$/, ''), path.basename(outFile));
      if (SAT && rec.kb > 0) {
        rec.novel = signature(rec).filter(k => !known.has(k)); rec.novel.forEach(k => known.add(k));
        streak = rec.novel.length ? 0 : streak + 1;
        if (streak >= SAT && queue.length) { console.log(`SATURATED after ${done.length + 1} items: ${SAT} in a row added nothing new (${known.size} things known); ${queue.length} not run`); fs.writeFileSync(outFile.replace(/\.json$/, '.saturated.json'), JSON.stringify({ at: done.length + 1, known: [...known].sort(), skipped: queue.length }, null, 1)); queue.length = 0; }
      }
      done.push(rec); save(); console.log(done.length, '/', sites.length, rec.title || '', rec.site, rec.kb, rec.pageTransition && rec.pageTransition.kind, '| menu', rec.menu && rec.menu.found, '| phone', rec.phone && rec.phone.fps);
    }
    await p.close();
  };
  // --patch=phone: re-measure ONLY the phone pass of records already measured (R-16 — their phone data was desktop).
  if (process.argv.includes('--patch=phone')) {
    const needMenu = (r) => r.menu && r.menu.found && r.menu.didOpen == null;
    const todo = done.filter(r => r.site && r.kb > 0 && (!(r.phone && r.phone.innerWidth === 360) || needMenu(r)));
    console.log('phone re-measure:', todo.length);
    await Promise.all(Array.from({ length: JOBS }, async () => {
      const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: true }).catch(() => {});
      while (todo.length) {
        const r = todo.shift();
        const shot = (n, clip) => SHOTS && p.screenshot({ path: `${SHOTS}/${slug(r.aw)}-${n}.jpg`, type: 'jpeg', quality: 55, clip }).then(() => `${slug(r.aw)}-${n}.jpg`).catch(() => null);
        // The DESKTOP menu again with the fixed probe (R-17: the old records cannot say whether a menu opened).
        if (needMenu(r)) {
          await p.goto(r.site, { waitUntil: 'load', timeout: 45000 }).catch(() => {}); await p.waitForTimeout(2500);
          r.menu = await menuProbe(p, shot, 'menu').catch(e => ({ err: e.message.slice(0, 80) }));
        }
        r.phone = await Promise.race([phonePass(p, cdp, r.site, shot), new Promise(res => setTimeout(() => res({ err: 'phone pass timed out' }), 120000))]).catch(e => ({ err: e.message.slice(0, 80) }));
        save(); console.log('phone', r.site, r.phone.innerWidth || r.phone.err, (r.phone.held || []).length, r.phone.menu && r.phone.menu.didOpen);
      }
      await p.close();
    }));
    save(); console.log('DONE phone patch'); await ctx.close(); return;
  }
  await Promise.all(Array.from({ length: JOBS }, worker));
  save(); console.log('DONE', done.length); await ctx.close();
})();

// Frames per second and long tasks over a plain scroll back up the page — nothing of ours running meanwhile.
async function perfScroll(p) {
  await p.evaluate(FPS_START).catch(() => {});
  for (let k = 0; k < 6; k++) { await p.mouse.wheel(0, -500); await p.waitForTimeout(300); }
  return await p.evaluate(FPS_END).catch(() => null);
}

async function phonePass(p, cdp, site, shot) {
  // Playwright's own viewport emulation OVERRIDES a raw CDP device-metrics override, so the CDP-only version measured
  // the desktop page every time (R-16: phone "held" elements were 1,425px wide). Set Playwright's viewport first,
  // then the mobile flags over it, and CHECK the page really is 360 wide — never record a phone pass that is not.
  await p.setViewportSize({ width: 360, height: 740 });
  const emulate = async () => {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 360, height: 740, deviceScaleFactor: 2, mobile: true });
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    await cdp.send('Emulation.setUserAgentOverride', { userAgent: ANDROID_UA });
  };
  await emulate();
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  try {
    await p.goto(site, { waitUntil: 'load', timeout: 60000 }).catch(() => {}); await p.waitForTimeout(3500);
    // The SCREEN must be 360 (emulation on); the PAGE may still lay out wider — a real phone finding (it forces a
    // sideways scroll), recorded as pageWidth, not a failure.
    const dims = () => p.evaluate(() => ({ screen: screen.width, page: innerWidth })).catch(() => ({}));
    let d = await dims();
    if (d.screen !== 360) { await emulate(); await p.reload({ waitUntil: 'load', timeout: 60000 }).catch(() => {}); await p.waitForTimeout(3000); d = await dims(); }
    if (d.screen !== 360) return { err: `phone emulation failed: screen ${d.screen}` };
    const out = { innerWidth: 360, pageWidth: d.page, forcedWider: d.page > 360, touch: await p.evaluate(() => matchMedia('(pointer: coarse)').matches).catch(() => null), shotTop: await shot('8-phone-top'), held: await p.evaluate(HELD).catch(() => []), hoverMedia: await p.evaluate(() => matchMedia('(hover: hover)').matches).catch(() => null),
      overflowX: await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1).catch(() => null) };
    out.scroll = [];
    for (let k = 0; k < 3; k++) { await p.evaluate(SNAP, 'before').catch(() => {}); await p.mouse.wheel(0, 700); await p.waitForTimeout(1000); const s = await p.evaluate(SNAP, 'after').catch(() => null); out.scroll.push(s && { changed: s.changed, kinds: s.kinds, samples: s.samples.slice(0, 6) }); }
    Object.assign(out, await perfScroll(p));
    out.heldAfterScroll = await p.evaluate(HELD).catch(() => []);
    out.shotScrolled = await shot('9-phone-scrolled');
    await p.evaluate(() => scrollTo(0, 0)).catch(() => {}); await p.waitForTimeout(500);
    out.menu = await menuProbe(p, shot, 'phone-menu').catch(e => ({ err: e.message.slice(0, 60) }));
    return out;
  } finally {
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }).catch(() => {});
    await cdp.send('Emulation.clearDeviceMetricsOverride').catch(() => {});
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: false }).catch(() => {});
    await cdp.send('Emulation.setUserAgentOverride', { userAgent: '' }).catch(() => {});
    await p.setViewportSize({ width: 1440, height: 900 }).catch(() => {});
  }
}

async function menuProbe(p, shot, tag) {
  const btn = await p.evaluate(() => {
    const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 8 && r.height > 8 && r.top >= 0 && r.top < innerHeight && cs.visibility !== 'hidden' && +cs.opacity > 0.05; };
    const cands = [...document.querySelectorAll('button[aria-expanded], [aria-controls][role=button], button[aria-label*="menu" i], [class*=burger], [class*=hamburger], [class*=menu-toggle], [class*=nav-toggle], [class*=menu-btn], [class*=menu-button], [class*=MenuButton]')]
      .concat([...document.querySelectorAll('button, a, [role=button]')].filter(e => /^\s*(menu|open menu)\s*$/i.test(e.innerText || e.getAttribute('aria-label') || '')));
    const el = cands.find(vis); if (!el) return null;
    el.setAttribute('data-aw-menu', '1'); const r = el.getBoundingClientRect();
    return { tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 40), label: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 30), expanded: el.getAttribute('aria-expanded'), x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }).catch(() => null);
  if (!btn) return { found: false };
  const before = await p.evaluate(COVER).catch(() => []);
  await p.mouse.click(btn.x, btn.y).catch(() => {});
  const frames = [];
  for (const ms of [150, 400, 900]) { await p.waitForTimeout(ms === 150 ? 150 : ms === 400 ? 250 : 500); frames.push({ ms, shot: await shot(`${tag}-${ms}`), cover: await p.evaluate(COVER).catch(() => []) }); }
  const opened = await p.evaluate(() => { const b = document.querySelector('[data-aw-menu]'); const a = document.activeElement; return { expanded: b && b.getAttribute('aria-expanded'), focusIn: a && a !== document.body && a !== b ? (a.tagName.toLowerCase() + ' ' + (a.innerText || '').trim().slice(0, 20)) : null, scrollLocked: getComputedStyle(document.body).overflow === 'hidden' || getComputedStyle(document.documentElement).overflow === 'hidden' }; }).catch(() => ({}));
  const sample = await p.evaluate(() => { const b = document.querySelector('[data-aw-menu]'); if (!b) return null; const panel = document.getElementById(b.getAttribute('aria-controls') || '') || [...document.querySelectorAll('nav, [class*=menu]')].find(e => { const r = e.getBoundingClientRect(); return r.width > innerWidth * 0.3 && r.height > innerHeight * 0.3; }); if (!panel) return null; const cs = getComputedStyle(panel); return { tag: panel.tagName.toLowerCase(), cls: (panel.className || '').toString().slice(0, 40), transition: cs.transitionProperty + ' ' + cs.transitionDuration + ' ' + cs.transitionTimingFunction, transform: cs.transform.slice(0, 50), clip: cs.clipPath.slice(0, 50), links: panel.querySelectorAll('a').length }; }).catch(() => null);
  await p.keyboard.press('Escape'); await p.waitForTimeout(700);
  const after = await p.evaluate(() => { const b = document.querySelector('[data-aw-menu]'); return { expanded: b && b.getAttribute('aria-expanded'), focusBack: document.activeElement === b }; }).catch(() => ({}));
  const coverAfter = await p.evaluate(COVER).catch(() => []);
  // Did the menu OPEN at all? Escape and focus return are only judged on a menu that opened — the first version
  // counted 98 menus that never opened as "Escape closes it" (R-17: 76% was really 47%).
  const opaqueN = (cs) => cs.filter(c => c.opaque && c.cov > 40).length;
  const didOpen = opened.expanded === 'true' || frames.some(f => opaqueN(f.cover) > opaqueN(before)) || !!(sample && sample.links > 2 && btn.expanded !== 'true');
  const escCloses = didOpen ? (opaqueN(coverAfter) <= opaqueN(before) && after.expanded !== 'true') : null;
  if (didOpen && !escCloses) { await p.mouse.click(btn.x, btn.y).catch(() => {}); await p.waitForTimeout(700); }
  return { found: true, didOpen, button: btn, frames, opened, panel: sample, escapeCloses: escCloses, focusReturned: didOpen ? after.focusBack : null, coverBefore: before.length };
}

async function cursorProbe(p) {
  const pts = [[300, 300], [900, 450], [600, 700]]; const seen = [];
  for (const [x, y] of pts) { await p.mouse.move(x, y, { steps: 6 }); await p.waitForTimeout(450);
    seen.push(await p.evaluate(([x, y]) => [...document.querySelectorAll('body *')].filter(el => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return (cs.position === 'fixed' || cs.position === 'absolute') && r.width > 2 && r.width < 220 && r.height < 220; })
      .map(el => { const r = el.getBoundingClientRect(); return { k: el.tagName.toLowerCase() + '.' + (el.className || '').toString().split(' ')[0].slice(0, 30), d: Math.round(Math.hypot(r.left + r.width / 2 - x, r.top + r.height / 2 - y)), w: Math.round(r.width), blend: getComputedStyle(el).mixBlendMode }; }).filter(e => e.d < 90), [x, y]).catch(() => [])); }
  const count = {}; for (const s of seen) for (const e of s) count[e.k] = (count[e.k] || 0) + 1;
  const followers = Object.entries(count).filter(([, n]) => n >= 2).map(([k]) => seen.flat().find(e => e.k === k));
  return { followers: followers.slice(0, 3) };
}

async function hoverProbe(p, shot) {
  const targets = await p.evaluate(() => {
    const seen = new Set(); const out = [];
    for (const el of document.querySelectorAll('a, button, [role=button], [class*=card], [class*=btn], [class*=item] img, figure, li a')) {
      const r = el.getBoundingClientRect(); if (r.width < 20 || r.height < 12 || r.top < 0 || r.bottom > innerHeight || r.left < 0 || r.right > innerWidth) continue;
      const k = el.tagName + (el.className || '').toString().split(' ')[0]; if (seen.has(k)) continue; seen.add(k);
      el.setAttribute('data-aw-h', out.length); out.push({ i: out.length, x: r.left + r.width / 2, y: r.top + r.height / 2, box: { x: Math.max(0, r.left - 30), y: Math.max(0, r.top - 30), width: Math.min(innerWidth - Math.max(0, r.left - 30), r.width + 60), height: Math.min(innerHeight - Math.max(0, r.top - 30), r.height + 60) }, what: el.tagName.toLowerCase() + '.' + (el.className || '').toString().split(' ')[0].slice(0, 30), txt: (el.innerText || '').trim().slice(0, 30) });
      if (out.length >= 8) break;
    }
    return out;
  });
  const read = (i) => p.evaluate((i) => { const el = document.querySelector(`[data-aw-h="${i}"]`); if (!el) return null;
    const one = (e) => { const cs = getComputedStyle(e); return { transform: cs.transform, opacity: cs.opacity, color: cs.color, background: cs.backgroundColor + ' ' + cs.backgroundImage.slice(0, 60), shadow: cs.boxShadow, clip: cs.clipPath, filter: cs.filter, underline: cs.textDecorationLine + ' ' + cs.backgroundSize, border: cs.borderColor, scale: cs.scale, translate: cs.translate }; };
    const cs = getComputedStyle(el);
    return { el: one(el), kids: [...el.querySelectorAll('*')].slice(0, 12).map(one), parent: el.parentElement ? one(el.parentElement) : null, cursor: cs.cursor, timing: cs.transitionProperty + ' ' + cs.transitionDuration + ' ' + cs.transitionTimingFunction + ' ' + cs.transitionDelay }; }, i);
  const cmp = (a, b) => { const ch = []; if (!a || !b) return ch; for (const k in b.el) if (a.el[k] !== b.el[k]) ch.push('self:' + k); b.kids.forEach((x, j) => { for (const k in x) if (a.kids[j] && a.kids[j][k] !== x[k]) ch.push('child:' + k); }); if (b.parent) for (const k in b.parent) if (a.parent[k] !== b.parent[k]) ch.push('parent:' + k); return [...new Set(ch)]; };
  const results = []; let strips = 0;
  for (const t of targets) {
    await p.mouse.move(5, 5); await p.waitForTimeout(250);
    const a = await read(t.i); await p.mouse.move(t.x, t.y);
    // A 3-frame strip of the first three hovers that change something: the motion, not just its end.
    const frames = [];
    if (strips < 3) { await p.waitForTimeout(80); frames.push(await shot(`h${t.i}-080`, t.box)); await p.waitForTimeout(170); frames.push(await shot(`h${t.i}-250`, t.box)); await p.waitForTimeout(400); }
    else await p.waitForTimeout(650);
    const b = await read(t.i); const changed = cmp(a, b);
    if (frames.length) { if (changed.length) { frames.push(await shot(`h${t.i}-650`, t.box)); strips++; } }
    results.push({ on: t.what, txt: t.txt, changed, timing: b && b.timing, cursor: b && b.cursor, frames: changed.length ? frames.filter(Boolean) : [] });
  }
  const rules = await p.evaluate(() => { let n = 0; const out = []; for (const sh of document.styleSheets) { let rs; try { rs = sh.cssRules; } catch { continue; } for (const r of rs) { if (r.selectorText && /:hover|:focus-visible/.test(r.selectorText)) { n++; if (out.length < 15) out.push(r.cssText.slice(0, 260)); } } } return { n, sample: out }; }).catch(() => ({}));
  const touchGate = await p.evaluate(() => { let n = 0; for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) if (r.media && /hover:\s*hover|pointer:\s*fine/.test(r.media.mediaText)) n++; } catch {} } return n; }).catch(() => 0);
  return { results, hoverRules: rules, hoverMediaGated: touchGate };
}

async function pageTransition(p, shotMid) {
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(800);
  const link = await p.evaluate(() => {
    const here = location.pathname.replace(/\/$/, '');
    const a = [...document.querySelectorAll('a[href]')].find(a => { const r = a.getBoundingClientRect(); if (!r.width || !r.height || r.top < 0 || r.top > innerHeight) return false;
      try { const u = new URL(a.href); return u.origin === location.origin && u.pathname.replace(/\/$/, '') !== here && !u.hash && !/\.(pdf|jpe?g|png|zip)$/i.test(u.pathname) && a.target !== '_blank'; } catch { return false; } });
    if (!a) return null; a.setAttribute('data-aw-click', '1'); return { href: a.href, txt: (a.innerText || '').trim().slice(0, 40) };
  });
  if (!link) return { kind: 'no-internal-link' };
  await p.evaluate(() => { window.__awDoc = 1; window.__vt = 0; });
  await p.evaluate(SNAP, 'before').catch(() => {});
  const fromUrl = p.url();
  await p.locator('[data-aw-click]').first().click({ timeout: 4000, noWaitAfter: true }).catch(() => p.evaluate(() => document.querySelector('[data-aw-click]').click()));
  const frames = [];
  for (let t = 0; t < 1500; t += 100) {
    frames.push(await p.evaluate((ms) => {
      if (!window.__awDoc) return { ms, newDoc: true, url: location.href };
      const cover = [];
      for (const el of document.querySelectorAll('body *')) {
        const cs = getComputedStyle(el); if (cs.position !== 'fixed' && cs.position !== 'absolute') continue;
        const r = el.getBoundingClientRect(); const vis = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
        if (vis < innerWidth * innerHeight * 0.25 || cs.visibility === 'hidden' || +cs.opacity < 0.05) continue;
        const a = (cs.backgroundColor.match(/rgba?\(([^)]+)\)/) || [, '0,0,0,0'])[1].split(',').map(Number);
        const opaque = (a.length < 4 || a[3] > 0.5) && cs.backgroundColor !== 'transparent' || cs.backgroundImage !== 'none' || /^(IMG|VIDEO|CANVAS)$/.test(el.tagName); // R-18
        cover.push({ tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 40), cov: Math.round(vis / (innerWidth * innerHeight) * 100), opaque, z: cs.zIndex, bg: cs.backgroundColor, o: cs.opacity, t: cs.transform.slice(0, 50), c: cs.clipPath.slice(0, 50), timing: cs.transitionDuration + ' ' + cs.transitionTimingFunction });
        if (cover.length > 3) break;
      }
      return { ms, url: location.href, vt: window.__vt, cover };
    }, t).catch(() => ({ ms: t, navigating: true })));
    if (t === 300) await shotMid();
    await p.waitForTimeout(100);
  }
  await p.waitForTimeout(1000);
  const end = await p.evaluate(() => ({ url: location.href, sameDoc: !!window.__awDoc, vt: window.__vt || 0, vtCross: !!window.__vtCross, focus: document.activeElement ? document.activeElement.tagName.toLowerCase() : null, title: document.title })).catch(() => ({}));
  const moved = end.sameDoc ? await p.evaluate(SNAP, 'after').catch(() => null) : null;
  const vt = end.vt || frames.some(f => f.vt);
  const overlay = frames.some(f => f.cover && f.cover.some(c => c.opaque && c.z !== 'auto' && +c.z > 0 && c.cov > 80));
  const kind = end.url === fromUrl ? 'no-navigation' : vt ? 'view-transition (same document)' : end.vtCross ? 'view-transition (cross document)' : end.sameDoc ? (overlay ? 'spa + overlay' : 'spa swap') : (overlay ? 'full load + overlay before leaving' : 'full load');
  return { kind, link, toUrl: end.url, focusAfter: end.focus, titleAfter: end.title, frames: frames.filter((f, i) => i % 2 === 0 || f.cover?.length), moved: moved && { changed: moved.changed, kinds: moved.kinds, samples: moved.samples.slice(0, 12) } };
}
