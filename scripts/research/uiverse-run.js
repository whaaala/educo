// Every uiverse element OPENED and RUN locally from its open-source code (github.com/uiverse-io/galaxy, MIT):
//   node uiverse-run.js <galaxy-dir> <out.json> <shots-dir> [--jobs=4]
// Each element is loaded on its own page (no network) and driven like a person would: at rest (what animates by
// itself), HOVER, PRESS, keyboard FOCUS (is it visible?), CLICK (toggles / checkboxes) — what changed on the element,
// its children and their ::before / ::after, a shot per state; then under REDUCED MOTION (what still runs); and
// whether the control has an accessible name. Resumable. Raw material for motion/08-component-effects.md.
const { chromium } = require(require.resolve('playwright', { paths: [process.cwd()] }));
const fs = require('fs'); const path = require('path');
const [,, galaxy, outFile, shots] = process.argv;
const JOBS = +((process.argv.find(a => a.startsWith('--jobs=')) || '').slice(7) || 4);
fs.mkdirSync(shots, { recursive: true });
const files = fs.readdirSync(galaxy, { withFileTypes: true }).filter(d => d.isDirectory() && !d.name.startsWith('.'))
  .flatMap(d => fs.readdirSync(path.join(galaxy, d.name)).filter(f => f.endsWith('.html')).map(f => ({ cat: d.name, file: f })));
// An element that errored is run again on a restart; a closed browser stops the run instead of recording (R-11).
const done = (fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : []).filter(r => !r.err);
const have = new Set(done.map(r => r.cat + '/' + r.file));
const queue = files.filter(f => !have.has(f.cat + '/' + f.file));
const save = () => fs.writeFileSync(outFile, JSON.stringify(done, null, 1));

// Every element's look, with its ::before / ::after, so a change in a pseudo-element is seen too.
const LOOK = () => {
  const props = ['transform', 'opacity', 'color', 'backgroundColor', 'backgroundImage', 'boxShadow', 'clipPath', 'filter', 'width', 'height', 'borderColor', 'outlineStyle', 'outlineWidth', 'letterSpacing', 'textDecorationLine', 'scale', 'translate', 'rotate'];
  const out = [];
  for (const el of [...document.body.querySelectorAll('*')].slice(0, 300)) for (const pe of [null, '::before', '::after']) {
    const cs = getComputedStyle(el, pe); if (pe && (cs.content === 'none' || cs.content === 'normal')) { out.push(null); continue; }
    out.push(props.map(p => cs[p]).join('|'));
  }
  return out;
};
const DIFF = (a, b) => { const names = ['transform', 'opacity', 'color', 'background', 'bg-image', 'shadow', 'clip', 'filter', 'width', 'height', 'border', 'outline', 'outline-w', 'letter-spacing', 'underline', 'scale', 'translate', 'rotate']; const ch = new Set(); let n = 0;
  b.forEach((s, i) => { if (!s || !a[i] || s === a[i]) return; n++; const x = a[i].split('|'), y = s.split('|'); y.forEach((v, k) => { if (v !== x[k]) ch.add((i % 3 === 1 ? '::before ' : i % 3 === 2 ? '::after ' : '') + names[k]); }); }); return { n, what: [...ch] }; };

(async () => {
  const b = await chromium.launch({ headless: false, args: ['--disable-renderer-backgrounding', '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows'] });
  const ctx = await b.newContext({ viewport: { width: 700, height: 500 } });
  await ctx.route('**/*', r => r.request().url().startsWith('data:') ? r.continue() : r.abort()); // no network, ever
  await Promise.all(Array.from({ length: JOBS }, async () => {
    const p = await ctx.newPage();
    while (queue.length) {
      const it = queue.shift(); const rec = { cat: it.cat, file: it.file, author: it.file.split('_')[0] };
      const id = (it.cat + '-' + it.file.replace(/\.html$/, '')).replace(/[^a-z0-9-]+/gi, '-');
      try {
        const html = fs.readFileSync(path.join(galaxy, it.cat, it.file), 'utf8');
        rec.tags = ((html.match(/Tags:\s*([^*]+)\*\//) || [])[1] || '').trim();
        await p.emulateMedia({ reducedMotion: 'no-preference' });
        await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;height:100%}body{display:grid;place-items:center;background:#fff}</style></head><body>${html}</body></html>`, { timeout: 15000 });
        await p.waitForTimeout(500);
        const t = await p.evaluate(() => {
          const el = document.body.firstElementChild; if (!el) return null;
          const tgt = el.matches('label, button, a, input') ? el : (el.querySelector('button, a, input, label, [role=button]') || el);
          tgt.setAttribute('data-uv', '1'); const r = el.getBoundingClientRect(); const tr = tgt.getBoundingClientRect();
          const name = (n) => n.getAttribute('aria-label') || (n.labels && n.labels[0] && n.labels[0].innerText) || (n.innerText || '').trim() || n.getAttribute('title') || n.getAttribute('placeholder') || '';
          const ctrls = [...document.querySelectorAll('button, a, input, select, textarea, [role=button], [tabindex]')];
          return { box: { x: Math.max(0, r.left - 24), y: Math.max(0, r.top - 24), width: Math.min(700, r.width + 48), height: Math.min(500, r.height + 48) }, x: tr.left + tr.width / 2, y: tr.top + tr.height / 2,
            target: tgt.tagName.toLowerCase() + (tgt.type ? '[' + tgt.type + ']' : ''), controls: ctrls.length, unnamed: ctrls.filter(c => !name(c).trim()).length, divButtons: document.querySelectorAll('div[onclick], span[onclick]').length,
            atRest: document.getAnimations().map(a => ({ name: a.animationName || a.transitionProperty || 'script', dur: a.effect && a.effect.getTiming().duration, iter: a.effect && a.effect.getTiming().iterations, ease: a.effect && a.effect.getTiming().easing })).slice(0, 8) };
        });
        if (!t) { rec.empty = true; } else {
          Object.assign(rec, { target: t.target, controls: t.controls, unnamedControls: t.unnamed, divButtons: t.divButtons, atRest: t.atRest });
          const shot = (s) => p.screenshot({ path: path.join(shots, `${id}-${s}.jpg`), type: 'jpeg', quality: 60, clip: t.box }).then(() => `${id}-${s}.jpg`).catch(() => null);
          rec.shots = { rest: await shot('rest') };
          const rest = await p.evaluate(LOOK);
          await p.mouse.move(t.x, t.y); await p.waitForTimeout(150); rec.shots.hover150 = await shot('hover-150'); await p.waitForTimeout(450);
          const hov = await p.evaluate(LOOK); rec.hover = DIFF(rest, hov); rec.shots.hover = await shot('hover');
          rec.hoverTiming = await p.evaluate(() => { const e = document.querySelector('[data-uv]'); const cs = getComputedStyle(e); return cs.transitionProperty + ' ' + cs.transitionDuration + ' ' + cs.transitionTimingFunction; });
          await p.mouse.down(); await p.waitForTimeout(200); rec.press = DIFF(hov, await p.evaluate(LOOK)); rec.shots.press = await shot('press'); await p.mouse.up();
          await p.waitForTimeout(600); const afterClick = await p.evaluate(LOOK); rec.click = DIFF(rest, afterClick); rec.shots.click = await shot('click');
          await p.mouse.move(2, 2); await p.waitForTimeout(400);
          await p.setContent(await p.content()); await p.waitForTimeout(300); // fresh state for the keyboard
          const before = await p.evaluate(LOOK); await p.keyboard.press('Tab'); await p.waitForTimeout(400);
          rec.focus = await p.evaluate(() => { const a = document.activeElement; if (!a || a === document.body) return { reachable: false }; const cs = getComputedStyle(a); return { reachable: true, tag: a.tagName.toLowerCase(), outline: cs.outlineStyle + ' ' + cs.outlineWidth, visibleRing: (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none' }; });
          rec.focusChange = DIFF(before, await p.evaluate(LOOK)); rec.shots.focus = await shot('focus');
          await p.emulateMedia({ reducedMotion: 'reduce' }); await p.setContent(await p.content()); await p.waitForTimeout(400);
          rec.reducedRunning = await p.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length);
          rec.cssReduced = /prefers-reduced-motion/.test(html); rec.cssFocusVisible = /:focus-visible/.test(html); rec.cssHoverGate = /\(hover:\s*hover\)/.test(html);
        }
      } catch (e) { if (/has been closed/.test(e.message)) { queue.length = 0; break; } rec.err = e.message.slice(0, 100); }
      done.push(rec); if (done.length % 25 === 0) { save(); console.log(done.length, '/', files.length, rec.cat, rec.file); }
    }
    await p.close();
  }));
  save(); console.log('DONE', done.length); await b.close();
})();
