// Every pen of CodePen tags, OPENED, RUN and READ — page by page (RULE R: every item is opened, run and read).
//   node cp-tag.js <outDir> <profile> <shotsDir> <tag> [<tag>…]
// For each listing page (?cursor=), EVERY pen on it is opened before the next page: run live in its preview, its
// sticky / fixed elements read from the DOM, two scroll steps and a hover compared (what moved, and how), two
// screenshots, and its FULL html / css / js saved → <outDir>/<tag>.json. Resumable (pens already read are skipped).
const { chromium } = require(require.resolve('playwright', { paths: [process.cwd()] }));
const fs = require('fs'); const path = require('path'); const { how } = require('./cp-how.js');
const [,, outDir, profile, shots, ...tags] = process.argv;
const cursor = (n) => Buffer.from(`d=1&o=0&p=${n}`).toString('base64');
fs.mkdirSync(outDir, { recursive: true }); fs.mkdirSync(shots, { recursive: true });
const JOBS = 2; // CodePen is one origin: six windows at once is what raises its human check (R-2)
const rest_ = (ms) => new Promise(r => setTimeout(r, ms + Math.random() * ms));
// CodePen's "verify you are human" page. Never solved by script: the run PAUSES and a person ticks it once in the
// visible window; the clearance cookie then lives in the persistent profile (R-2).
const challenged = (p) => p.evaluate(() => /just a moment|verify you are human|attention required/i.test(document.title + ' ' + (document.body?.innerText || '').slice(0, 400)) || !!document.querySelector('iframe[src*="challenges.cloudflare.com"]')).catch(() => true);
async function clear(p, again) {
  if (!(await challenged(p))) return;
  console.log('\x07HUMAN CHECK — please tick "Verify you are human" in the CodePen window. Waiting…');
  for (let i = 0; i < 600 && await challenged(p); i++) await new Promise(r => setTimeout(r, 1000));
  console.log('cleared'); if (again) await again();
}
const go = async (p, url) => { const nav = () => p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(() => {}); await nav(); await p.waitForTimeout(2500); await clear(p, nav); };
const safe = async (fn, d) => { for (let i = 0; i < 3; i++) { try { return await fn(); } catch { await new Promise(r => setTimeout(r, 1500)); } } return d; };

// In the pen's preview: the held elements, and every element's transform / opacity / clip / filter / top.
const LOOK = () => {
  const held = []; const all = [...document.querySelectorAll('body *')].slice(0, 3000);
  const st = all.map(el => { const cs = getComputedStyle(el);
    if ((cs.position === 'sticky' || cs.position === 'fixed') && held.length < 10) held.push({ pos: cs.position, tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 40), txt: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40), top: cs.top, bottom: cs.bottom, z: cs.zIndex, h: el.offsetHeight });
    return [el.tagName.toLowerCase() + '.' + (el.className || '').toString().split(' ')[0], cs.transform, cs.opacity, cs.clipPath, cs.filter, cs.backgroundColor, cs.color, cs.boxShadow, Math.round(el.getBoundingClientRect().top)]; });
  return { held, st, docH: document.documentElement.scrollHeight, vh: innerHeight };
};
const NAMES = ['transform', 'opacity', 'clip-path', 'filter', 'background', 'color', 'shadow', 'top'];
const diff = (a, b) => { const out = {}; let n = 0; b.st.forEach((s, i) => { const o = a.st[i]; if (!o || o[0] !== s[0]) return; const ch = NAMES.filter((_, k) => o[k + 1] !== s[k + 1]); if (ch.length) { n++; const key = s[0] + ': ' + ch.join('+'); out[key] = (out[key] || 0) + 1; } }); return { n, what: Object.entries(out).sort((x, y) => y[1] - x[1]).slice(0, 12) }; };

// SATURATION (the user, 2026-10-02): with --saturate=N, a tag or a list stops once N pens in a row add no technique
// not already seen in it — judged from the pen's FULL code and from what it did when run. The user's own tags
// (sticky-header, fixed-position) were read in full before this existed.
const SAT = +((process.argv.find(a => a.startsWith('--saturate=')) || '').slice(11) || 0);
const TECH = { sticky: /position:\s*sticky/, fixed: /position:\s*fixed/, timeline: /animation-timeline/, view: /view\(\)|view-timeline/, scrollFn: /scroll\(\)|scroll-timeline/, range: /animation-range/, snap: /scroll-snap/, vt: /view-transition/, starting: /@starting-style/, discrete: /allow-discrete/, clip: /clip-path/, mask: /mask(-image)?:/, has: /:has\(/, backdrop: /backdrop-filter/, keyframes: /@keyframes/, transition: /transition\s*:/, container: /@container/, scrollState: /scroll-state/, anchor: /anchor-name|position-anchor/, reduced: /prefers-reduced-motion/, hoverGate: /\(hover:\s*hover\)/, focusVisible: /:focus-visible/, io: /IntersectionObserver/, raf: /requestAnimationFrame/, gsap: /gsap|ScrollTrigger/, lenis: /Lenis/, svg: /<svg/, canvas: /<canvas|getContext\(/, popover: /popover/, dialog: /<dialog|showModal/, details: /<details/, linear: /linear\(/, shape: /shape\(/, trig: /\b(sin|cos|tan)\(/ };
const penSig = (r) => { const code = r.code ? (r.code.html || '') + (r.code.css || '') + (r.code.js || '') : ''; const s = Object.keys(TECH).filter(k => TECH[k].test(code)).map(k => 'code:' + k);
  for (const h of r.held || []) s.push('held:' + h.pos); // one key per PROPERTY, never per combination — combinations never run out, so nothing ever saturated (R-14)
  for (const [w] of (r.onScroll && r.onScroll.what) || []) for (const k of (w.split(': ')[1] || '').split('+')) s.push('scroll:' + k); for (const [w] of (r.onHover && r.onHover.what) || []) for (const k of (w.split(': ')[1] || '').split('+')) s.push('hover:' + k); return s; };
const saturation = () => { const known = new Set(); let streak = 0; return { seed: (rs) => rs.forEach(r => penSig(r).forEach(k => known.add(k))), add: (r) => { r.novel = penSig(r).filter(k => !known.has(k)); r.novel.forEach(k => known.add(k)); streak = r.novel.length ? 0 : streak + 1; return SAT && streak >= SAT; }, size: () => known.size }; };

async function readPen(p, url, tag) {
  const id = url.split('/').pop(); const rec = { url, tag };
  try {
    await go(p, /\/editor\//.test(url) ? url : url.replace('/pen/', '/full/')); await p.waitForTimeout(3500);
    rec.title = (await p.title()).replace(/ - CodePen$/, '');
    rec.code = await safe(() => p.evaluate(async (u) => { const get = async (ext) => { try { const r = await fetch(u + '.' + ext); return r.ok ? await r.text() : ''; } catch { return ''; } }; return { html: await get('html'), css: await get('css'), js: await get('js') }; }, url), {});
    // The preview is the biggest child frame on the page.
    let fr = null, area = 0;
    for (const f of p.frames()) { if (f === p.mainFrame()) continue; const box = await f.frameElement().then(e => e.boundingBox()).catch(() => null); if (box && box.width * box.height > area) { area = box.width * box.height; fr = f; } }
    if (!fr) { rec.noPreview = true; return rec; }
    const box = await fr.frameElement().then(e => e.boundingBox());
    const a = await fr.evaluate(LOOK); Object.assign(rec, { held: a.held, docH: a.docH, vh: a.vh });
    await p.screenshot({ path: path.join(shots, `${tag}-${id}-0.jpg`), type: 'jpeg', quality: 55 });
    // Scroll the preview twice, the way a visitor does.
    await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await p.mouse.wheel(0, 600); await p.waitForTimeout(800); await p.mouse.wheel(0, 600); await p.waitForTimeout(900);
    const c = await fr.evaluate(LOOK); rec.scrolled = await fr.evaluate(() => scrollY).catch(() => null);
    rec.onScroll = diff(a, c); rec.heldAfterScroll = c.held;
    await p.screenshot({ path: path.join(shots, `${tag}-${id}-1.jpg`), type: 'jpeg', quality: 55 });
    // Back to the top and hover the first link / button / card under the pointer.
    await fr.evaluate(() => scrollTo(0, 0)).catch(() => {}); await p.waitForTimeout(500);
    const target = await fr.evaluate(() => { const el = document.querySelector('a, button, [class*=card], [class*=btn], img, li'); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, what: el.tagName.toLowerCase() + '.' + (el.className || '').toString().split(' ')[0] }; }).catch(() => null);
    if (target) { const h0 = await fr.evaluate(LOOK); await p.mouse.move(box.x + target.x, box.y + target.y); await p.waitForTimeout(700); rec.onHover = { on: target.what, ...diff(h0, await fr.evaluate(LOOK)) }; }
  } catch (e) { rec.err = e.message.slice(0, 100); }
  // HOW it is done, written while the code is in hand — never a second pass (the user, 2026-10-02)
  if (!rec.err) rec.how = how(rec);
  return rec;
}

(async () => {
  const b = await chromium.launchPersistentContext(profile, { headless: false, channel: 'chrome', viewport: { width: 1400, height: 900 },
    args: ['--disable-blink-features=AutomationControlled', '--disable-renderer-backgrounding', '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows'] });
  // LIST mode — `list:<file.json>` reads every pen of a JSON list (the pens the research found inside articles).
  const listArg = tags.find(t => t.startsWith('list:'));
  if (listArg) {
    const file = listArg.slice(5); const name = path.basename(file).replace(/\.list\.json$|\.json$/, '');
    const f = path.join(outDir, name + '.json');
    const done = (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : []).filter(r => !r.err); const have = new Set(done.map(d => d.url)); // errored pens re-run (R-12)
    const todo = JSON.parse(fs.readFileSync(file, 'utf8')).filter(u => !have.has(u));
    if (SAT) for (let i = todo.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [todo[i], todo[j]] = [todo[j], todo[i]]; }
    const sat = saturation(); sat.seed(done);
    await Promise.all(Array.from({ length: JOBS }, async () => {
      const pen = await b.newPage();
      while (todo.length) { const u = todo.shift(); const rec = await readPen(pen, u, name);
        if (sat.add(rec) && todo.length) { console.log(`SATURATED ${name} after ${done.length + 1}: ${SAT} in a row added nothing (${sat.size()} known); ${todo.length} not run`); todo.length = 0; }
        done.push(rec); fs.writeFileSync(f, JSON.stringify(done, null, 1)); console.log(name, done.length, rec.title || u, '| held', (rec.held || []).length, '| scroll', rec.onScroll?.n ?? '-', '| hover', rec.onHover?.n ?? '-', rec.err || ''); await rest_(800); }
      await pen.close();
    }));
    await b.close(); return;
  }
  const q = [...tags];
  await Promise.all(Array.from({ length: Math.min(JOBS, q.length) }, async () => {
    const list = await b.newPage(); const pen = await b.newPage();
    while (q.length) {
      const tag = q.shift(); const f = path.join(outDir, tag + '.json');
      const done = (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : []).filter(r => !r.err); const have = new Set(done.map(d => d.url)); // errored pens re-run (R-12)
      const found = new Set(); const sat = saturation(); sat.seed(done); let stopTag = false;
      for (let pg = 1; pg < 5000; pg++) {
        await go(list, `https://codepen.io/tag/${tag}` + (pg > 1 ? `?cursor=${cursor(pg)}` : ''));
        await list.waitForSelector('a[href*="/pen/"]', { timeout: 12000 }).catch(() => {}); await rest_(1000);
        const got = await safe(() => list.evaluate(() => [...new Set([...document.querySelectorAll('a[href*="/pen/"]')].map(a => a.href.split('?')[0]))].filter(h => /codepen\.io\/(editor\/)?[^/]+\/pen\/[^/]+$/.test(h) && !/\/team\/codepen\//.test(h))), []);
        const fresh = got.filter(u => !found.has(u)); fresh.forEach(u => found.add(u));
        if (!fresh.length) { console.log('END', tag, 'page', pg, 'pens', found.size); break; }
        // EVERY pen on this page, opened before the next page.
        for (const u of fresh) {
          if (have.has(u)) continue;
          const rec = await readPen(pen, u, tag); rec.page = pg;
          if (sat.add(rec)) { console.log(`SATURATED ${tag} at page ${pg}: ${SAT} in a row added nothing (${sat.size()} known)`); stopTag = true; }
          done.push(rec); have.add(u); fs.writeFileSync(f, JSON.stringify(done, null, 1));
          console.log(tag, 'p' + pg, done.length, rec.title || u, '| held', (rec.held || []).length, '| scroll', rec.onScroll?.n ?? '-', '| hover', rec.onHover?.n ?? '-', rec.err || '');
          await rest_(800);
          if (stopTag) break;
        }
        if (stopTag) break;
      }
    }
    await list.close(); await pen.close();
  }));
  await b.close();
})();
