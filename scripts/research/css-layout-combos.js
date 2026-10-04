// BATCH R-4 · RULE MAP steps 2–3 (docs/web-anatomy/css-layout/07-map.md §4). Two passes, six HEADED windows (RULE Z):
//  (1) EXAMPLE PER VALUE — every CORE value of the map alone, against the baseline, at 1280 and 360: it must do what it
//      says (the page's own __check) AND move the subject or the container by ≥ 4 px (RULE T: visibly different);
//  (2) COMBINATIONS — random values of every axis together, every screen of scripts/uat/screens.js at least once,
//      at 100 / 150 / 200 % text, LTR and RTL.
//   node scripts/research/css-layout-combos.js [--n=210] [--seed=1] [--shots=<dir>]
const { chromium } = require(require.resolve('playwright', { paths: [process.cwd()] }));
const { pathToFileURL } = require('url');
const fs = require('fs');
const { SCREENS } = require('../uat/screens.js');
const arg = (k, d) => (process.argv.find(a => a.startsWith(`--${k}=`)) || '').slice(k.length + 3) || d;
const N = Math.max(+arg('n', 210), SCREENS.length); let seed = +arg('seed', 1); const SHOTS = arg('shots', null);
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648; const pick = (a) => a[Math.floor(rnd() * a.length)];
const PAGE = pathToFileURL('docs/web-anatomy/css-layout/examples/combos.html').href;

const AXES = {
  place: ['span:0:6', 'span:3:4', 'span:4.5:5', 'se:2:9', 'last:5', 'full', 'bleed', 'bleedL', 'bleedR'],
  x: ['start', 'center', 'end', 'fill'], y: ['top', 'center', 'bottom', 'fill'],
  out: ['def', '0', '2s', 'pushEnd', 'pushBottom'], in: ['def', '0', '2'],
  size: ['free', 'square', '16x9', 'read', 'max20'], layer: ['flow', 'over', 'floatTR', 'cover'],
  cont: ['stack', 'spread', 'even', 'wrapmid', 'cardsfit', 'cardsfill', 'subgrid'], dir: ['ltr', 'rtl'],
};
const BASE = { place: 'full', x: 'fill', y: 'fill', out: 'def', in: 'def', size: 'free', layer: 'flow', cont: 'stack', dir: 'ltr', text: 100 };
const url = (c) => `${PAGE}?${new URLSearchParams(Object.entries(c).filter(([k]) => k in BASE)).toString()}`;

// (1) one case per CORE value, changed alone from the baseline, at a desktop and a phone width
const singles = [];
for (const [k, vals] of Object.entries(AXES)) for (const v of vals) if (v !== BASE[k]) for (const w of [1280, 360]) singles.push({ kind: 'value', axis: k, ...BASE, [k]: v, w, h: 900 });
// (2) random combinations; the screens shuffled so every one of them is used
const screens = [...SCREENS].sort(() => rnd() - 0.5);
const combos = Array.from({ length: N }, (_, i) => { const s = screens[i % screens.length]; const c = { kind: 'combo', w: s.w, h: s.h, label: s.label, text: pick([100, 100, 150, 200]) }; for (const [k, v] of Object.entries(AXES)) c[k] = pick(v); return c; });

// what a person SEES move: the subject's box and its words, the container's blocks, the header's links, the fees row
const rects = () => { const R = (e) => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; };
  const s = document.getElementById('subject'), cs = getComputedStyle(s), cap = parseFloat(cs.maxInlineSize);
  return { s: [...R(s), ...R(s.firstElementChild)], k: [...document.getElementById('holder').children, document.querySelector('header nav'), ...document.querySelectorAll('.fees > *')].map(R),
    capWider: cap > 0 && s.getBoundingClientRect().width < cap - 1 }; };
const moved = (a, b) => { const d = (p, q) => p.some((v, i) => Math.abs(v - q[i]) >= 4); return d(a.s, b.s) || a.k.length !== b.k.length || a.k.some((r, i) => d(r, b.k[i])); };

(async () => {
  const queue = [...singles, ...combos].map((c, i) => ({ ...c, i })); const fails = [], cannot = [], warns = []; let checks = 0; const base = {};
  const worker = async (n) => {
    const b = await chromium.launch({ headless: false, channel: 'chrome', args: [`--window-position=${(n % 3) * 640},${Math.floor(n / 3) * 520}`, '--window-size=640,520'] });
    const p = await b.newPage();
    const load = async (c) => { await p.setViewportSize({ width: c.w, height: c.h }); await p.goto(url(c)); await p.waitForTimeout(120); };
    while (queue.length) {
      const c = queue.shift();
      await load(c);
      const res = await p.evaluate(() => window.__check()); checks += res.length; warns.push(...(await p.evaluate(() => window.__warn)).map((w) => `#${c.i} ${c.w}px ${c.text}%: ${w}`));
      const bad = res.filter(r => !r[1]);
      if (c.kind === 'value') {   // RULE T: the value alone must change what is seen
        const now = await p.evaluate(rects);
        if (!base[c.w]) { await load({ ...BASE, w: c.w, h: 900 }); base[c.w] = await p.evaluate(rects); }
        checks++;
        if (!moved(now, base[c.w])) {
          if (now.capWider) cannot.push(`${c.axis}=${c[c.axis]} @${c.w}: the screen is narrower than the cap (measured: box < its max width)`);
          else bad.push(['visibly different from the baseline', false, 'nothing moved ≥ 4px']);
        }
      }
      const tag = c.kind === 'value' ? `${c.axis}=${c[c.axis]} @${c.w}` : `${c.place} x:${c.x} y:${c.y} out:${c.out} in:${c.in} ${c.size} ${c.layer} ${c.cont} ${c.dir} · ${c.w}×${c.h} ${c.label || ''} · ${c.text}%`;
      for (const [nm, , d] of bad) fails.push(`#${c.i} ${tag} · ${nm}${d ? ' — ' + d : ''}`);
      if (SHOTS) await p.screenshot({ path: `${SHOTS}/${c.kind}-${c.i}.jpg`, type: 'jpeg', quality: 55, fullPage: true });
      console.log(`[w${n}] #${c.i} ${tag} — ${bad.length} failed`);
    }
    await b.close();
  };
  await Promise.all(Array.from({ length: 6 }, (_, k) => worker(k)));
  console.log(`\n${checks} checks · ${singles.length} single values + ${combos.length} combinations over ${SCREENS.length} screens; ${fails.length} failed`);
  for (const c of cannot) console.log('  CANNOT HERE ' + c);
  console.log(`  ${warns.length} page-check WARNINGS (a person's own spacing)`); for (const w of warns.slice(0, 10)) console.log('  WARN ' + w);
  for (const f of fails.slice(0, 80)) console.log('  FAIL ' + f);
})();
