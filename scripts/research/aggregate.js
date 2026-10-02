// Condense every finished research run into ONE compact summary the library is written from (the raw runs are
// gigabytes; nobody should read them to write an entry):
//   node aggregate.js <educo-research-dir> <out.md>   → <out.md> + <educo-research-dir>/aggregate.json
// Sites (aw-measure runs): libraries · CSS features · held elements · what scroll does · hover changes · timing ·
// menus · page transitions · intros · cursors · reduced motion · phone · shadows · focus — each as a SHARE of the
// measured sites, with example sites. uiverse: per category, what hover / press / focus / click do, timing, a11y.
// CodePen: per tag, the techniques in the code and what moved.
const fs = require('fs'); const path = require('path');
const [,, X, outMd] = process.argv;
const runs = path.join(X, 'runs');
const read = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };
const pct = (n, d) => d ? Math.round(n / d * 100) + '%' : '—';
const top = (m, n = 10) => Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n);
const inc = (m, k, by = 1) => { m[k] = (m[k] || 0) + by; };
const median = (a) => { const s = a.filter(x => x != null && !isNaN(x)).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const secs = (v) => { const m = String(v).match(/([\d.]+)(ms|s)/); return m ? (m[2] === 'ms' ? +m[1] : +m[1] * 1000) : null; };

const out = { sources: {}, sites: {}, uiverse: {}, codepen: {} };
// ---- sites ----
const siteFiles = fs.readdirSync(runs).filter(f => f.endsWith('.json') && !/saturated|uiverse|getcssscan|trial/.test(f));
const all = [];
for (const f of siteFiles) {
  const d = read(path.join(runs, f)); if (!Array.isArray(d)) continue;
  const ok = d.filter(r => r && r.kb > 0 && !r.err);
  const sat = read(path.join(runs, f.replace(/\.json$/, '.saturated.json')));
  out.sources[f.replace(/\.json$/, '')] = { records: d.length, measured: ok.length, sameAs: d.filter(r => r.sameAs).length, noLiveSite: d.filter(r => r.noLiveSite).length, saturatedAt: sat ? sat.at : null };
  for (const r of ok) all.push({ src: f.replace(/\.json$/, ''), r });
}
const N = all.length; const S = { n: N };
const ex = {}; const addEx = (k, it) => { (ex[k] = ex[k] || []).length < 5 && ex[k].push(`${it.r.title || ''} — ${it.r.site} (${it.src})`); };
const count = (key, test) => { let n = 0; for (const it of all) if (test(it.r)) { n++; addEx(key, it); } S[key] = `${n} (${pct(n, N)})`; };
for (const lib of ['gsap', 'scrollTrigger', 'lenis', 'locomotive', 'barba', 'swup', 'three', 'canvas', 'framer', 'webflow', 'lottie', 'split', 'swiper', 'motion', 'aos', 'next', 'nuxt', 'astro']) count('lib:' + lib, r => r.libs && r.libs[lib]);
for (const k of ['animTimeline', 'viewTimeline', 'scrollTimeline', 'viewTransition', 'crossDocVT', 'scrollSnap', 'sticky', 'fixed', 'clipPath', 'mask', 'keyframes', 'startingStyle', 'reducedMotion', 'hoverMedia', 'focusVisible', 'hasSel', 'backdrop', 'mixBlend', 'marquee', 'linearEase', 'scrollState', 'anchorPos', 'containerQ']) count('css:' + k, r => r.cssF && r.cssF[k] > 0);
count('held:any sticky element', r => r.stickyEls > 0);
count('held:any fixed element', r => r.fixedEls > 0);
count('held:pinned scroll section (sticky in a parent ≥1.8 screens)', r => r.tallPins > 0);
count('held:GSAP pin-spacer', r => (r.pinSpacers || []).length > 0);
// R-19: a top bar is a held element at the top of the window, nearly full width and under 200px tall
  const topBar = (h) => h.y <= 10 && h.w >= 1200 && h.h > 20 && h.h < 200;
  count('held:glass (backdrop-filter) TOP bar', r => (r.held || []).some(h => topBar(h) && h.blur));
count('held:FIXED top bar with links', r => (r.held || []).some(h => h.pos === 'fixed' && h.hasNav && topBar(h)));
count('held:STICKY top bar with links', r => (r.held || []).some(h => h.pos === 'sticky' && h.hasNav && topBar(h)));
count('css:marquee @keyframes (named marquee / ticker / scroll-x)', r => ((r.how && r.how.keyframes) || []).some(k => /@keyframes\s+[\w-]*(marquee|ticker|scroll-?x|loop)/i.test(k)));
count('css:a REAL scroll timeline (scroll() / view() / named, in a rule)', r => ((r.how && r.how.css && r.how.css.timeline) || []).some(k => /scroll\(|view\(|timeline:\s*--/.test(k)));
for (const k of ['translate', 'scale', 'rotate', 'fade', 'clip', 'filter']) count('scroll:' + k, r => (r.scroll || []).some(s => s.kinds && s.kinds[k]));
count('scroll:parallax (moves 0.1–0.9 of the scroll)', r => (r.scroll || []).some(s => (s.samples || []).some(x => x.moveRatio != null && Math.abs(x.moveRatio) > 0.1 && Math.abs(x.moveRatio) < 0.9)));
count('idle:moves with no scroll (carousel / marquee / loop)', r => r.idle && r.idle.changed > 0);
const opaque = (c) => c.opaque != null ? c.opaque : !/rgba\(\d+, \d+, \d+, 0(\.[0-4]\d*)?\)|transparent/.test(c.bg || '');
count('intro:OPAQUE full-screen cover at 0.7s (preloader / intro)', r => r.intro && r.intro.at700 && (r.intro.at700.cover || []).some(c => c.cov > 80 && opaque(c)));
count('intro:that cover is gone by load', r => r.intro && r.intro.at700 && (r.intro.at700.cover || []).some(c => c.cov > 80 && opaque(c)) && !((r.intro.atLoad && r.intro.atLoad.cover) || []).some(c => c.cov > 80 && opaque(c)));
count('cursor:custom cursor follows the pointer', r => r.cursor && (r.cursor.followers || []).length > 0);
count('cursor:native cursor hidden', r => r.cursorNone);
count('text:split headings (letters / words in spans)', r => r.splitText > 0);
const hov = {}; let hovN = 0; for (const it of all) for (const h of (it.r.hover && it.r.hover.results) || []) { hovN++; for (const c of h.changed || []) inc(hov, c); }
S['hover:elements hovered'] = hovN; S['hover:what changes (share of hovered elements)'] = top(hov, 20).map(([k, v]) => `${k} ${pct(v, hovN)}`);
count('hover:rules gated by (hover: hover)', r => r.hover && r.hover.hoverMediaGated > 0);
const pt = {}; for (const it of all) if (it.r.pageTransition) { let k = it.r.pageTransition.kind; if (/overlay/.test(k) && !(it.r.pageTransition.frames || []).some(f => (f.cover || []).some(c => opaque(c) && c.cov > 80 && c.z !== 'auto' && +c.z > 0))) k = k === 'spa + overlay' ? 'spa swap' : 'full load'; /* R-20: a see-through "overlay" was no overlay */ inc(pt, k); addEx('pt:' + k, it); } S['page transition kinds'] = top(pt).map(([k, v]) => `${k} ${pct(v, N)}`);
const found = all.filter(it => it.r.menu && it.r.menu.found); S['menu:button found (desktop)'] = `${found.length} (${pct(found.length, N)})`;
  const opened = (m) => m.didOpen != null ? m.didOpen : (m.opened && m.opened.expanded === 'true') || (m.frames || []).some(f => (f.cover || []).filter(c => opaque(c) && c.cov > 40).length > 0);
  // R-17: only menus measured by the fixed probe (didOpen recorded) — the old records cannot say whether a menu opened
  const probed = found.filter(it => it.r.menu.didOpen != null); S['menu:measured by the fixed probe'] = `${probed.length} of ${found.length}`;
  const menus = probed.filter(it => it.r.menu.didOpen); S['menu:actually OPENED when clicked'] = `${menus.length} of ${probed.length}`;
S['menu:Escape closes it'] = pct(menus.filter(it => it.r.menu.escapeCloses).length, menus.length);
S['menu:focus returns to the button'] = pct(menus.filter(it => it.r.menu.focusReturned).length, menus.length);
S['menu:page scroll locked while open'] = pct(menus.filter(it => it.r.menu.opened && it.r.menu.opened.scrollLocked).length, menus.length);
S['menu:aria-expanded set'] = pct(menus.filter(it => it.r.menu.button && it.r.menu.button.expanded != null).length, menus.length);
const pm = all.filter(it => it.r.phone && it.r.phone.innerWidth === 360 && it.r.phone.menu && it.r.phone.menu.found); S['phone:menu button found'] = `${pm.length} (${pct(pm.length, N)})`;
const focus = all.flatMap(it => (it.r.focus || []).filter(Boolean)); S['focus:Tab stops with a visible ring'] = pct(focus.filter(f => f.visible).length, focus.length);
count('focus:skip link first', r => (r.focus || []).some(f => f && f.skipLink));
const rmN = all.filter(it => it.r.reducedMotion); S['reduced motion:measured'] = rmN.length;
S['reduced motion:still moves on scroll when asked not to'] = pct(rmN.filter(it => (it.r.reducedMotion.scroll || []).some(s => s && s.changed)).length, rmN.length);
S['reduced motion:CSS mentions prefers-reduced-motion'] = pct(all.filter(it => it.r.cssF && it.r.cssF.reducedMotion > 0).length, N);
const ph = all.filter(it => it.r.phone && !it.r.phone.err && it.r.phone.innerWidth === 360); // R-16: only true phone passes S['phone:measured'] = ph.length;
S['phone:sideways overflow at 360px'] = pct(ph.filter(it => it.r.phone.overflowX || it.r.phone.forcedWider).length, ph.length);
S['phone:menu actually opens'] = pct(ph.filter(it => it.r.phone.menu && it.r.phone.menu.didOpen).length, ph.filter(it => it.r.phone.menu && it.r.phone.menu.found).length);
S['phone:held elements (median)'] = median(ph.map(it => (it.r.phone.held || []).length));
S['phone:long tasks while scrolling, ms (median, CPU 4×)'] = median(ph.map(it => it.r.phone.longTaskMs));
S['desktop:long tasks while scrolling, ms (median)'] = median(all.map(it => it.r.scrollPerf && it.r.scrollPerf.longTaskMs));
S['weight KB (median)'] = median(all.map(it => it.r.kb)); S['weight ≤ 1 MB'] = pct(all.filter(it => it.r.kb <= 1024).length, N);
const dur = {}, ease = {}, prop = {}, anim = {}, sEase = {}; const durMs = [];
for (const it of all) { const t = it.r.timing || {};
  for (const [v, c] of t.transitionDuration || []) for (const d of String(v).split(',')) { const ms = secs(d); if (ms) { inc(dur, ms + 'ms', c); durMs.push(ms); } }
  for (const [v, c] of t.transitionEase || []) for (const e of String(v).split(/,(?![^(]*\))/)) inc(ease, e.trim(), c);
  for (const [v, c] of t.transitionProperty || []) for (const p of String(v).split(',')) inc(prop, p.trim(), c);
  for (const [v, c] of t.animationDuration || []) { const ms = secs(v); if (ms) inc(anim, ms + 'ms', c); }
  for (const [v, c] of t.scriptEases || []) inc(sEase, String(v).replace(/^ease\s*:\s*/, ''), c); }
S['timing:transition durations (count of elements)'] = top(dur, 12); S['timing:transition duration median ms'] = median(durMs);
S['timing:easings'] = top(ease, 12); S['timing:properties transitioned'] = top(prop, 12); S['timing:animation durations'] = top(anim, 10); S['timing:script (GSAP) eases'] = top(sEase, 12);
const sh = {}; for (const it of all) for (const [v, c] of it.r.shadows || []) inc(sh, v, 1); S['shadows:most used (sites)'] = top(sh, 15);
out.sites = S; out.examples = ex;
// ---- uiverse ----
const ui = read(path.join(runs, 'uiverse.json')) || [];
const cats = {}; for (const r of ui.filter(r => !r.err && !r.empty)) (cats[r.cat] = cats[r.cat] || []).push(r);
for (const [c, rs] of Object.entries(cats)) { const h = {}, pr = {}, cl = {}, tm = {}; for (const r of rs) { (r.hover && r.hover.what || []).forEach(k => inc(h, k)); (r.press && r.press.what || []).forEach(k => inc(pr, k)); (r.click && r.click.what || []).forEach(k => inc(cl, k)); if (r.hoverTiming) inc(tm, r.hoverTiming.replace(/^\S+\s/, '')); }
  out.uiverse[c] = { n: rs.length, hoverChanges: pct(rs.filter(r => r.hover && r.hover.n).length, rs.length), hoverWhat: top(h, 8), pressWhat: top(pr, 6), clickWhat: top(cl, 6), hoverTiming: top(tm, 6), animatesAtRest: pct(rs.filter(r => (r.atRest || []).length).length, rs.length), keyboardReachable: pct(rs.filter(r => r.focus && r.focus.reachable).length, rs.length), visibleFocusRing: pct(rs.filter(r => r.focus && r.focus.visibleRing).length, rs.length), unnamedControls: pct(rs.filter(r => r.unnamedControls > 0).length, rs.length), stillRunsUnderReducedMotion: pct(rs.filter(r => r.reducedRunning > 0).length, rs.length), cssReduced: pct(rs.filter(r => r.cssReduced).length, rs.length), cssHoverGate: pct(rs.filter(r => r.cssHoverGate).length, rs.length) }; }
// ---- codepen ----
const cpDir = path.join(path.dirname(X), 'educo', 'docs', 'web-anatomy', 'codepen', 'raw');
const TECH = { sticky: /position:\s*sticky/, fixed: /position:\s*fixed/, timeline: /animation-timeline/, view: /view\(\)|view-timeline/, snap: /scroll-snap/, vt: /view-transition/, starting: /@starting-style/, clip: /clip-path/, has: /:has\(/, backdrop: /backdrop-filter/, keyframes: /@keyframes/, io: /IntersectionObserver/, scrollListener: /addEventListener\(\s*['"]scroll/, raf: /requestAnimationFrame/, gsap: /gsap|ScrollTrigger/, jquery: /\$\(|jQuery/, reduced: /prefers-reduced-motion/, hoverGate: /\(hover:\s*hover\)/, focusVisible: /:focus-visible/ };
if (fs.existsSync(cpDir)) for (const f of fs.readdirSync(cpDir).filter(f => f.endsWith('.json') && !f.endsWith('.list.json'))) {
  const d = (read(path.join(cpDir, f)) || []).filter(r => r && !r.err && r.code); if (!d.length) continue;
  const t = {}; for (const r of d) { const code = (r.code.html || '') + (r.code.css || '') + (r.code.js || ''); for (const [k, re] of Object.entries(TECH)) if (re.test(code)) inc(t, k); }
  out.codepen[f.replace(/\.json$/, '')] = { pens: d.length, techniques: top(t, 19).map(([k, v]) => `${k} ${pct(v, d.length)}`), held: pct(d.filter(r => (r.held || []).length).length, d.length), movedOnScroll: pct(d.filter(r => r.onScroll && r.onScroll.n).length, d.length), changedOnHover: pct(d.filter(r => r.onHover && r.onHover.n).length, d.length) }; }
fs.writeFileSync(path.join(X, 'aggregate.json'), JSON.stringify(out, null, 1));
// ---- markdown ----
const L = [`# Research runs — the measured summary`, ``, `Generated by \`scripts/research/aggregate.js\` on ${new Date().toISOString().slice(0, 16)} from \`C:\\Users\\eyite\\educo-research\\runs\`. Regenerate it, never edit it. Shares are of the sites MEASURED (live, cache off, desktop 1440 + phone 360 CPU 4×). Examples per line: \`educo-research/aggregate.json\` → \`examples\`.`, ``, `## Sources`, ``, `| Source | Records | Measured | Same site as another source | No live site | Saturated at |`, `|---|---|---|---|---|---|`];
for (const [k, v] of Object.entries(out.sources)) L.push(`| ${k} | ${v.records} | ${v.measured} | ${v.sameAs} | ${v.noLiveSite} | ${v.saturatedAt || '— (every item)'} |`);
L.push('', `## Live sites — ${N} measured`, '');
for (const [k, v] of Object.entries(S)) L.push(`- **${k}** — ${Array.isArray(v) ? v.map(x => Array.isArray(x) ? `${x[0]} (${x[1]})` : x).join(' · ') : v}`);
L.push('', '## uiverse — every element run locally', '', '| Category | n | Hover changes | Animates at rest | Keyboard reachable | Visible focus ring | Unnamed controls | Runs under reduced motion | Hover gated |', '|---|---|---|---|---|---|---|---|---|');
for (const [c, v] of Object.entries(out.uiverse)) L.push(`| ${c} | ${v.n} | ${v.hoverChanges} | ${v.animatesAtRest} | ${v.keyboardReachable} | ${v.visibleFocusRing} | ${v.unnamedControls} | ${v.stillRunsUnderReducedMotion} | ${v.cssHoverGate} |`);
L.push('');
for (const [c, v] of Object.entries(out.uiverse)) L.push(`- **${c}** — hover: ${v.hoverWhat.map(x => x.join(' ')).join(', ')} · press: ${v.pressWhat.map(x => x.join(' ')).join(', ')} · click: ${v.clickWhat.map(x => x.join(' ')).join(', ')} · timing: ${v.hoverTiming.map(x => x.join(' ×')).join(', ')}`);
L.push('', '## CodePen — per tag (every pen opened, run, its full code read)', '', '| Tag | Pens | Held | Moved on scroll | Changed on hover | Techniques in the code |', '|---|---|---|---|---|---|');
for (const [t, v] of Object.entries(out.codepen)) L.push(`| ${t} | ${v.pens} | ${v.held} | ${v.movedOnScroll} | ${v.changedOnHover} | ${v.techniques.join(' · ')} |`);
fs.writeFileSync(outMd, L.join('\n') + '\n'); console.log('sites', N, 'uiverse', ui.length, 'codepen tags', Object.keys(out.codepen).length, '→', outMd);
