// LIVE STRUCTURE EXTRACTOR — opens a real site in a browser and measures its rendered layout.
// usage: node extract.js <url> [<url>...]  [--jobs=4] [--out=dir]   → writes <out>/<host>.txt per site
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
const OUT = arg('out', path.join(__dirname, 'sites')); fs.mkdirSync(OUT, { recursive: true });
const JOBS = +arg('jobs', 4);
const urls = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const VIEWS = [{ n: 'D', w: 1440, h: 900 }, { n: 'T', w: 768, h: 1024 }, { n: 'M', w: 375, h: 812 }];

/** Runs IN the page: the layout tree, measured. */
function measure() {
  const MIN = 48, vw = document.documentElement.clientWidth;
  const vis = (e) => { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; const r = e.getBoundingClientRect(); return r.width >= MIN && r.height >= 24; };
  const kidsOf = (e) => Array.from(e.children).filter((c) => !['SCRIPT', 'STYLE', 'NOSCRIPT', 'svg', 'SVG', 'LINK', 'META'].includes(c.tagName) && vis(c));
  const comp = (e) => {
    const t = e.tagName;
    if (/^H[1-3]$/.test(t)) return 'heading'; if (t === 'P') return 'text'; if (t === 'IMG' || t === 'PICTURE') return 'image'; if (t === 'VIDEO' || t === 'IFRAME') return 'video';
    if (t === 'FORM') return 'form'; if (t === 'NAV') return 'nav'; if (t === 'BUTTON' || (t === 'A' && /btn|button|cta/i.test(e.className))) return 'button'; if (t === 'CANVAS') return 'canvas';
    return null;
  };
  const pos = (e) => { const p = getComputedStyle(e).position; return p === 'sticky' || p === 'fixed' ? `[${p}]` : p === 'absolute' ? '[float]' : ''; };
  // Collapse wrappers: descend while an element has exactly ONE visible child covering ~its box.
  const unwrap = (e) => { let x = e; for (let i = 0; i < 12; i++) { const k = kidsOf(x); if (k.length !== 1 || pos(x)) break; const a = x.getBoundingClientRect(), b = k[0].getBoundingClientRect(); if (Math.abs(a.width - b.width) > 24 || Math.abs(a.height - b.height) > 60) break; x = k[0]; } return x; };
  const lines = (els) => { const rs = els.map((e) => e.getBoundingClientRect()); const out = []; rs.forEach((r, i) => { const l = out.find((L) => L.some((j) => rs[j].top < r.bottom - 4 && r.top < rs[j].bottom - 4)); if (l) l.push(i); else out.push([i]); }); return { out, rs }; };
  const node = (e0, depth) => {
    const e = unwrap(e0); const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    const c = comp(e); const p = pos(e);
    const kids = kidsOf(e).filter((k) => !['absolute'].includes(getComputedStyle(k).position) || k.getBoundingClientRect().width > r.width * 0.3);
    const bleed = Math.round(r.width) >= vw - 2 ? ' full' : '';
    if (c && (depth > 1 || !kids.length)) return `${c}${p}`;
    if (!kids.length || depth > 7) return c ? `${c}${p}` : `block${p}`;
    const { out, rs } = lines(kids);
    const pct = (i) => Math.round((rs[i].width / Math.max(1, r.width)) * 100);
    let head;
    if (cs.display.includes('grid')) {
      const cols = cs.gridTemplateColumns.split(' ').filter(Boolean).length; const rowsN = out.length;
      const spans = kids.map((k, i) => { const w = rs[i].width / Math.max(1, r.width / cols); return Math.round(w); }).filter((s) => s > 1);
      head = `GRID(${cols}×${rowsN}${spans.length ? ', spans ' + [...new Set(spans)].join('/') : ''})`;
    } else if (out.length === 1 && kids.length > 1) head = `ROW(${kids.length}: ${out[0].map(pct).join('/')})`;
    else if (out.every((L) => L.length === 1)) head = `STACK`;
    else head = `WRAP(${out.map((L) => L.length).join('+')}: ${out.map((L) => L.map(pct).join('/')).join(' | ')})`;
    const inner = kids.slice(0, 14).map((k) => node(k, depth + 1));
    return `${head}${p}${bleed}[${inner.join(', ')}${kids.length > 14 ? ', …' : ''}]`;
  };
  const root = document.querySelector('main') ? document.body : document.body;
  const bands = kidsOf(root).length === 1 ? kidsOf(unwrap(root)) : kidsOf(root);
  const flat = []; bands.forEach((b) => { const k = kidsOf(unwrap(b)); if (b.tagName === 'MAIN' || (k.length > 1 && lines(k).out.length === k.length && b.getBoundingClientRect().height > window.innerHeight * 1.5)) flat.push(...k); else flat.push(b); });
  // ── EFFECTS & BEHAVIOUR — what the page DOES, not only how it is laid out ──
  const all = Array.from(document.querySelectorAll('body *'));
  const pinned = all.filter((e) => { const p = getComputedStyle(e).position; return (p === 'sticky' || p === 'fixed') && vis(e); })
    .map((e) => { const r = e.getBoundingClientRect(); const p = getComputedStyle(e).position; const role = e.tagName === 'HEADER' || e.querySelector('nav') ? 'header/nav' : r.height > window.innerHeight * 0.8 ? 'full-height' : r.top > window.innerHeight * 0.6 ? 'bottom-bar' : r.width < 200 && r.height < 200 ? 'bubble/button' : 'panel'; return `${p}:${role}@${Math.round(r.width)}x${Math.round(r.height)}`; });
  const snap = all.some((e) => getComputedStyle(e).scrollSnapType !== 'none') || getComputedStyle(document.documentElement).scrollSnapType !== 'none';
  const hScroll = all.filter((e) => { const cs = getComputedStyle(e); return (cs.overflowX === 'auto' || cs.overflowX === 'scroll') && e.scrollWidth > e.clientWidth + 20 && e.clientWidth > 200; }).length;
  const anim = all.filter((e) => { const cs = getComputedStyle(e); return cs.animationName !== 'none' || (cs.transitionDuration && cs.transitionDuration !== '0s'); }).length;
  const libs = ['gsap', 'ScrollTrigger', 'Lenis', 'lenis', 'LocomotiveScroll', 'THREE', 'Swiper', 'barba', 'Flip', 'Splitting', 'Webflow', 'Framer', 'lottie', 'bodymovin']
    .filter((k) => k in window);
  const fx = {
    pinned: [...new Set(pinned)].slice(0, 8), scrollSnap: snap, horizontalScrollers: hScroll, animatedOrTransitioned: anim,
    canvas: document.querySelectorAll('canvas').length, video: document.querySelectorAll('video').length,
    marquee: all.filter((e) => /marquee|ticker/i.test(e.className?.toString?.() || '')).length > 0,
    smoothScroll: document.documentElement.classList.contains('lenis') || !!document.querySelector('[data-scroll-container]'),
    libs,
  };
  return { fx, title: document.title, h: document.documentElement.scrollHeight, bands: flat.slice(0, 40).map((b, i) => `B${i + 1} ${Math.round(b.getBoundingClientRect().height)}px: ${node(b, 0)}`) };
}

async function one(browser, url) {
  const host = new URL(url).host.replace(/^www\./, '');
  const lines = [`# ${url}`];
  for (const v of VIEWS) {
    const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36' });
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(3500);
      // Scroll through once so lazy sections render.
      await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); });
      await page.waitForTimeout(800);
      const m = await page.evaluate(measure);
      lines.push(`## ${v.n} ${v.w}px — "${m.title.slice(0, 60)}" · page ${m.h}px`, `FX ${JSON.stringify(m.fx)}`, ...m.bands);
      if (v.n === 'D') await page.screenshot({ path: path.join(OUT, `${host}.png`), fullPage: false });
    } catch (e) { lines.push(`## ${v.n} ${v.w}px — FAILED: ${e.message.split('\n')[0]}`); }
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, `${host}.txt`), lines.join('\n') + '\n');
  return `${host}: ${lines.filter((l) => l.startsWith('B')).length} band-lines`;
}

module.exports = { measure };
if (require.main === module) (async () => {
  const browser = await chromium.launch({ headless: !process.argv.includes('--headed') });
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(JOBS, urls.length) }, async () => { while (i < urls.length) { const u = urls[i++]; try { console.log(await one(browser, u)); } catch (e) { console.log(`${u}: ERR ${e.message.split('\n')[0]}`); } } }));
  await browser.close();
})();
