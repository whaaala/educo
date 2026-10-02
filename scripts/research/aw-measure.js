const { chromium } = require(require.resolve('playwright', { paths: [process.cwd()] }));
const fs = require('fs');
const [,, listFile, outFile, profile] = process.argv;
const extra = ['https://www.awwwards.com/inspiration/scroll-rosehip','https://www.awwwards.com/inspiration/horizontal-scrolling-page-studio-illicit','https://www.awwwards.com/inspiration/scroll-overview-quechua-2025-lookbook','https://www.awwwards.com/inspiration/scroll-based-animations-g-s','https://www.awwwards.com/inspiration/work-page-emma-is-social','https://www.awwwards.com/inspiration/homepage-on-scroll-melvin-winkeler','https://www.awwwards.com/inspiration/infinite-scroll-photo-archive-theatre-memory','https://www.awwwards.com/inspiration/homepage-animation-type-one-ventures'];
const sites = JSON.parse(fs.readFileSync(listFile, 'utf8')).concat(extra);
const done = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : [];
const seen = new Set(done.map(d => d.aw));
const save = () => fs.writeFileSync(outFile, JSON.stringify(done, null, 1));
(async () => {
  const ctx = await chromium.launchPersistentContext(profile, { headless: false, channel: 'chrome', viewport: { width: 1440, height: 900 }, args: ['--disable-blink-features=AutomationControlled'] });
  const queue = sites.filter(s => !seen.has(s));
  const worker = async () => {
    const p = await ctx.newPage();
    while (queue.length) {
      const aw = queue.shift(); const rec = { aw };
      try {
        await p.goto(aw, { waitUntil: 'domcontentloaded', timeout: 40000 }); await p.waitForTimeout(2000);
        Object.assign(rec, await p.evaluate(() => {
          const txt = (s) => (document.querySelector(s)?.innerText || '').trim();
          const visit = [...document.querySelectorAll('a')].find(a => /visit (site|resource)/i.test(a.innerText || '') && !/awwwards\.com/.test(a.href));
          const tags = [...new Set([...document.querySelectorAll('a[href*="/websites/"], a[href*="/inspiration/"] , a[href*="tag"]')].map(a => (a.innerText || '').trim()).filter(t => t && t.length < 30))].slice(0, 40);
          const vids = [...document.querySelectorAll('video source, video')].map(v => v.src || v.currentSrc).filter(u => u && !/blank/.test(u)).slice(0, 2);
          return { title: document.title.replace(/ - Awwwards.*/, ''), site: visit ? visit.href : null, tags, vids, desc: (document.querySelector('meta[name=description]') || {}).content || '' };
        }));
        if (rec.site) {
          let bytes = 0, reqs = 0; const onFin = async (r) => { reqs++; try { const s = await r.sizes(); bytes += s.responseBodySize + s.responseHeadersSize; } catch {} };
          p.on('requestfinished', onFin);
          const t0 = Date.now();
          await p.goto(rec.site, { waitUntil: 'load', timeout: 45000 }).catch(e => rec.navErr = e.message.slice(0, 80));
          rec.loadMs = Date.now() - t0; await p.waitForTimeout(3500);
          const snap = () => p.evaluate(() => { const m = {}; let i = 0; for (const el of document.querySelectorAll('body *')) { if (i++ > 4000) break; const cs = getComputedStyle(el); const k = el.tagName + i; m[k] = cs.transform + '|' + cs.opacity + '|' + cs.clipPath; } return m; });
          const before = await snap().catch(() => ({}));
          const info = await p.evaluate(async () => {
            const w = window; const html = document.documentElement;
            const scripts = [...document.scripts].map(s => s.src).filter(Boolean);
            const inline = [...document.scripts].filter(s => !s.src).map(s => s.textContent).join('\n').slice(0, 400000);
            const libs = { gsap: !!w.gsap || scripts.some(s => /gsap|greensock/i.test(s)), scrollTrigger: !!w.ScrollTrigger || scripts.some(s => /scrolltrigger/i.test(s)), lenis: !!w.Lenis || html.classList.contains('lenis') || scripts.some(s => /lenis/i.test(s)), locomotive: html.classList.contains('has-scroll-smooth') || scripts.some(s => /locomotive/i.test(s)), barba: !!w.barba || scripts.some(s => /barba/i.test(s)), swup: !!w.swup || scripts.some(s => /swup/i.test(s)), three: !!w.THREE || scripts.some(s => /three(\.module)?(\.min)?\.js|webgl|ogl/i.test(s)) || !!document.querySelector('canvas'), framer: !!document.querySelector('[data-framer-name], #__framer-badge-container') , webflow: !!w.Webflow || !!document.querySelector('[data-wf-page]'), lottie: !!w.lottie || !!w.bodymovin || !!document.querySelector('lottie-player, dotlottie-player'), split: scripts.some(s => /split/i.test(s)) || /SplitText|SplitType|splitting/i.test(inline), swiper: !!w.Swiper || !!document.querySelector('.swiper'), next: !!w.__NEXT_DATA__ || !!document.querySelector('#__next'), nuxt: !!w.__NUXT__, astro: !!document.querySelector('astro-island') };
            let css = '';
            for (const sh of document.styleSheets) { try { css += [...sh.cssRules].map(r => r.cssText).join('\n'); } catch { if (sh.href) { try { css += await (await fetch(sh.href)).text(); } catch {} } } if (css.length > 3e6) break; }
            const has = (re) => (css.match(re) || []).length;
            const cssF = { animTimeline: has(/animation-timeline/g), viewTimeline: has(/view-timeline|view\(\)/g), scrollTimeline: has(/scroll-timeline|scroll\(\)/g), viewTransition: has(/view-transition/g), scrollSnap: has(/scroll-snap-type/g), sticky: has(/position:\s*sticky/g), fixed: has(/position:\s*fixed/g), clipPath: has(/clip-path/g), keyframes: has(/@keyframes/g), reducedMotion: has(/prefers-reduced-motion/g), mixBlend: has(/mix-blend-mode/g), backdrop: has(/backdrop-filter/g), marquee: has(/marquee|ticker/gi) };
            const jsReduced = /prefers-reduced-motion/.test(inline);
            let stickyEls = 0, fixedEls = 0, tallPins = 0; const held = [];
            const desc = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { tag: el.tagName.toLowerCase(), role: el.getAttribute('role') || '', cls: (el.className || '').toString().slice(0, 60), txt: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60), top: cs.top, bottom: cs.bottom, left: cs.left, z: cs.zIndex, w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.top), bg: cs.backgroundColor, blur: cs.backdropFilter !== 'none' ? cs.backdropFilter : '', blend: cs.mixBlendMode !== 'normal' ? cs.mixBlendMode : '', hasNav: !!el.querySelector('nav, a'), hasImg: !!el.querySelector('img, video, canvas') }; };
            for (const el of document.querySelectorAll('body *')) { const cs = getComputedStyle(el); if (cs.position === 'sticky') { stickyEls++; const par = el.parentElement; const tall = par && par.offsetHeight > innerHeight * 1.8; if (tall) tallPins++; if (held.length < 14) held.push({ pos: 'sticky', parentH: par ? Math.round(par.offsetHeight / innerHeight * 10) / 10 + 'vh-units' : '', ...desc(el) }); } else if (cs.position === 'fixed' && el.offsetHeight > 1 && el.offsetWidth > 1) { fixedEls++; if (held.length < 14) held.push({ pos: 'fixed', ...desc(el) }); } }
            const pinSpacers = [...document.querySelectorAll('.pin-spacer')].slice(0, 6).map(s => ({ h: Math.round(s.offsetHeight / innerHeight * 10) / 10, child: (s.firstElementChild?.className || '').toString().slice(0, 50), txt: (s.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60) }));
            const sections = [...document.querySelectorAll('section, [class*="section"]')].length;
            return { libs, cssF, jsReduced, stickyEls, fixedEls, tallPins, held, pinSpacers, sections, docH: html.scrollHeight, vh: innerHeight, cursor: !!document.querySelector('[class*="cursor"]'), lang: html.lang, h1: (document.querySelector('h1')?.innerText || '').trim().slice(0, 80) };
          }).catch(e => ({ err: e.message.slice(0, 80) }));
          for (let k = 1; k <= 5; k++) { await p.mouse.wheel(0, 900); await p.waitForTimeout(700); }
          const after = await snap().catch(() => ({}));
          let changed = 0; for (const k in after) if (before[k] !== undefined && before[k] !== after[k]) changed++;
          info.scrollChanged = changed; info.scrolledTo = await p.evaluate(() => Math.round(scrollY)).catch(() => -1);
          p.off('requestfinished', onFin);
          Object.assign(rec, info, { kb: Math.round(bytes / 1024), reqs });
        }
      } catch (e) { rec.err = e.message.slice(0, 100); }
      done.push(rec); if (done.length % 5 === 0) { save(); console.log(done.length, rec.title, rec.site, rec.kb); }
    }
    await p.close();
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  save(); console.log('DONE', done.length); await ctx.close();
})();
