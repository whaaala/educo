// MEASURE A DRAG — BATCH LE-15n (tests/features/components/website/drag-feel.feature). The user, 2026-10-21: "right now it seems
// very lagging… it needs to be smooth… instant". Measured, not judged by eye: the page is made through the UI (Add page → School
// home), a section is dragged the way a person drags it there — a mouse by its grip, a finger by a long press — for two seconds past
// its neighbours, and the page records every frame, every task over 50 ms, and how long the drop line takes to follow a move.
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/measure-drag.js [--w=1600] [--finger] [--cpu=4] [--name=x]
// Run it ALONE on the machine: six other windows make every number worse.
const path = require('path'); const fs = require('fs');
const H = require('./h.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const W = +arg('w', 1600), FINGER = process.argv.includes('--finger'), CPU = +arg('cpu', 1);
const NAME = arg('name', `${W}${FINGER ? '-finger' : ''}${CPU > 1 ? `-cpu${CPU}` : ''}`);
const OUT = path.join(__dirname, 'logs', 'drag-feel'); fs.mkdirSync(OUT, { recursive: true });
const T = require('../../config/inspector.json').sections;
const wait = (page, ms) => page.waitForTimeout(ms);

(async () => {
  if (CPU > 1) process.env.CPU_SLOW = String(CPU);
  const { browser, page } = await H.open({ headed: true, w: W, h: 900, touch: FINGER });
  // the page a person makes
  const more = page.getByRole('button', { name: 'More', exact: true });
  if (!(await page.getByRole('button', { name: 'Add page', exact: true }).first().isVisible().catch(() => false))) { await more.click(); await wait(page, 400); }
  await page.getByRole('button', { name: 'Add page', exact: true }).first().click();
  const d = page.getByRole('dialog', { name: T.addPageTitle }); await d.waitFor(); await wait(page, 1200);
  await d.getByRole('textbox').fill('Drag'); await d.getByRole('button', { name: /^Add School home,/ }).click(); await wait(page, 2500);
  // the "Hello, and welcome" section, selected by clicking it, as a person does
  const sec = await page.evaluate(() => { const s = Array.from(document.querySelectorAll('h2')).find((e) => /Hello, and/.test(e.textContent || '')).closest('section'); s.scrollIntoView({ block: 'start' }); return s.getAttribute('data-box-id'); });
  await wait(page, 500);
  for (let i = 0; i < 8; i++) {
    const sel = await page.evaluate(() => document.querySelector('[data-chrome-mirror]')?.getAttribute('data-chrome-mirror'));
    if (sel === sec) break;
    if (sel) { await page.keyboard.press('Escape'); await wait(page, 200); continue; }
    const b = await page.locator(`[data-box-id="${sec}"]`).boundingBox(); await page.mouse.click(b.x + b.width - 12, b.y + 24); await wait(page, 300);
  }
  // the recorder: every frame, every long task, and each move → the drop line following it
  await page.evaluate(() => {
    const R = (window.__drag = { frames: [], long: [], lag: [], moves: 0 }); let last = performance.now(), lastMove = 0, lastLine = '';
    // cheap on purpose: the inline style, not getComputedStyle on every child of <body> — the measuring must not cost what it measures
    const line = () => { const m = Array.from(document.body.children).find((e) => e.style.position === 'fixed' && /shadow-\[0_0_10px/.test(e.className)); return m ? `${m.style.left},${m.style.top},${m.style.width}` : ''; };
    addEventListener('pointermove', () => { R.moves++; if (!lastMove) lastMove = performance.now(); }, true);
    R.slow = []; addEventListener('pointerdown', () => { R.down = performance.now(); }, true); addEventListener('touchstart', () => { R.down = performance.now(); }, true);
    const tick = (t) => { if (t - last > 50) R.slow.push({ ms: Math.round(t - last), afterPress: R.down ? Math.round(last - R.down) : null }); R.frames.push(t - last); last = t; const l = line(); if (l !== lastLine) { if (lastMove) R.lag.push(performance.now() - lastMove); lastLine = l; lastMove = 0; } if (!R.stop) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
    try { new PerformanceObserver((l) => R.long.push(...l.getEntries().map((e) => Math.round(e.duration)))).observe({ type: 'longtask' }); } catch { /* no long-task timing here */ }
  });
  const s = await page.locator(`[data-box-id="${sec}"]`).boundingBox();
  let from;
  const g = page.getByRole('toolbar', { name: 'Block toolbar' }).getByLabel('Drag to move');
  if (await g.isVisible().catch(() => false)) { const r = await g.boundingBox(); from = { x: r.x + r.width / 2, y: r.y + r.height / 2 }; } else from = { x: s.x + s.width * 0.7, y: Math.max(s.y, 80) + 40 };
  const vh = await page.evaluate(() => innerHeight), to = { x: from.x + 40, y: Math.min(vh - 120, from.y + 420) };
  const steps = 120, cdp = FINGER ? await page.context().newCDPSession(page) : null; // 120 moves over ~2 s, a person's pace
  // --profile: the drag's JavaScript summed by function (the CPU profile's self time), so the cause is measured, not guessed
  const prof = process.argv.includes('--profile') ? await page.context().newCDPSession(page) : null;
  if (prof) { await prof.send('Profiler.enable'); await prof.send('Profiler.setSamplingInterval', { interval: 200 }); await prof.send('Profiler.start'); }
  const LIFT = process.argv.includes('--lift'); // --profile --lift: only the press and the first ten moves — the moment the block lifts
  const touch = (type, p) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: p ? [{ x: Math.round(p.x), y: Math.round(p.y), id: 1 }] : [] });
  if (FINGER) { await touch('touchStart', from); await wait(page, 650); } else { await page.mouse.move(from.x, from.y); await page.mouse.down(); }
  const t0 = Date.now();
  for (let i = 1; i <= steps; i++) {
    const p = { x: from.x + ((to.x - from.x) * i) / steps, y: from.y + ((to.y - from.y) * Math.sin((Math.PI / 2) * (i / steps))) };
    if (FINGER) await touch('touchMove', p); else await page.mouse.move(p.x, p.y);
    await wait(page, 16);
    if (LIFT && i === 10) break;
  }
  const took = Date.now() - t0;
  await page.keyboard.press('Escape'); if (FINGER) { await touch('touchEnd'); await cdp.detach(); } else await page.mouse.up();
  const R = await page.evaluate(() => { window.__drag.stop = true; return window.__drag; });
  let top = null;
  if (prof) {
    const { profile } = await prof.send('Profiler.stop');
    const byId = new Map(profile.nodes.map((n) => [n.id, n])), self = new Map();
    const dt = profile.timeDeltas; profile.samples.forEach((id, i) => { const n = byId.get(id); const f = n.callFrame; const k = `${f.functionName || '(anonymous)'} ${f.url.split('/').pop()}:${f.lineNumber + 1}`; self.set(k, (self.get(k) || 0) + (dt[i] || 0) / 1000); });
    top = [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([k, ms]) => `${Math.round(ms)} ms  ${k}`);
    // who forces the layout: the time of each measuring call, given to the function that called it
    const parent = new Map(); profile.nodes.forEach((n) => (n.children || []).forEach((c) => parent.set(c, n.id))); const by = new Map();
    profile.samples.forEach((id, i) => { const n = byId.get(id); if (!/getBoundingClientRect|getComputedStyle|elementsFromPoint/.test(n.callFrame.functionName)) return; const p = byId.get(parent.get(id)); const f = p ? p.callFrame : { functionName: '?', url: '', lineNumber: -1 }; const k = `${n.callFrame.functionName} ← ${f.functionName || '(anonymous)'} :${f.lineNumber + 1}`; by.set(k, (by.get(k) || 0) + (dt[i] || 0) / 1000); });
    top.push('— forced layout, by caller —', ...[...by.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15).map(([k, ms]) => `${Math.round(ms)} ms  ${k}`));
  }
  const q = (a, p) => { const s2 = [...a].sort((x, y) => x - y); return s2.length ? Math.round(s2[Math.min(s2.length - 1, Math.floor(p * s2.length))] * 10) / 10 : null; };
  const frames = R.frames.slice(1);
  const res = { name: NAME, width: W, finger: FINGER, cpu: CPU, moves: R.moves, ms: took,
    frame: { n: frames.length, median: q(frames, 0.5), p95: q(frames, 0.95), max: q(frames, 1), over16: frames.filter((f) => f > 17).length, over33: frames.filter((f) => f > 34).length },
    longTasks: { n: R.long.length, max: R.long.length ? Math.max(...R.long) : 0, total: R.long.reduce((a, b) => a + b, 0) },
    lineLag: { n: R.lag.length, median: q(R.lag, 0.5), p95: q(R.lag, 0.95), max: q(R.lag, 1) }, slowFrames: R.slow, top };
  fs.writeFileSync(path.join(OUT, `${NAME}.json`), JSON.stringify(res, null, 1));
  console.log(JSON.stringify(res));
  await browser.close();
})();
