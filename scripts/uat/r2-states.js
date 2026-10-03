// AREA V · RULE MAP step 3d — STATES / EFFECTS / TRANSITIONS at every level, both ways, WCAG first. HEADED, a real mouse and
// keyboard. Each random tree (r2-axes.js STATES) is put in ONE stage and driven:
//   UP     — the button's own hover shows, also inside a card with its own hover (hover the button vs hover the card only)
//   DOWN   — where the card DRIVES its button, hovering only the card changes the button
//   PRESS  — pressing the button shows the press (where set)
//   FOCUS  — Tab reaches the button and a focus ring of ≥ 2px is drawn (WCAG 2.4.7) — on every tree
//   REDUCED MOTION — with `prefers-reduced-motion: reduce`, every level's transition is instant (WCAG 2.3.3)
//   NODE_PATH=node_modules node scripts/uat/r2-states.js [--n=30] [--seed=1]
const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright');
const { stateTrees, page } = require('./r2-axes.js'); const { diffRatio, VISIBLE, setDecoder } = require('./r2-combos.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const N = +arg('n', 30), SEED = +arg('seed', 1);
const OUT = path.join(__dirname, '..', '..', 'docs', 'web-anatomy', 'area-v', 'specimens');
const settle = (pg) => pg.waitForTimeout(450); // the slowest transition is 320ms

(async () => {
  const browser = await chromium.launch({ headless: false, args: ['--force-device-scale-factor=1'] });
  const pg = await browser.newPage({ viewport: { width: 900, height: 500 }, deviceScaleFactor: 1 }); setDecoder(await browser.newPage());
  const trees = stateTrees(N, SEED);
  fs.writeFileSync(path.join(OUT, 'states.html'), page('AREA V · states at every level (hover, press, Tab)', trees.map((t) => ({ id: t.id, css: t.css, html: t.html, labels: t.labels }))));
  const fails = []; let checks = 0;
  for (const t of trees) {
    await pg.emulateMedia({ reducedMotion: 'no-preference' });
    await pg.setContent(page('one', [{ id: t.id, css: t.css, html: t.html }]), { waitUntil: 'load' }); await settle(pg);
    const stage = await pg.$('[data-demo]'); const btn = await pg.$(`[data-tree="${t.id}"] [data-level="button"]`); const card = await pg.$(`[data-tree="${t.id}"] [data-level="card"]`);
    const shot = async () => (await stage.screenshot()).toString('base64');
    await pg.mouse.move(5, 5); await settle(pg); const rest = await shot();
    const cb = await card.boundingBox(); await pg.mouse.move(cb.x + 6, cb.y + 6); await settle(pg); const cardOnly = await shot(); // the card's corner: card hovered, button not
    const bb = await btn.boundingBox(); await pg.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await settle(pg); const onButton = await shot();
    // UP: the button's own hover shows even though its card is hovered too
    if (t.pick['button.hover']) { checks++; if (await diffRatio(cardOnly, onButton) < VISIBLE / 3) fails.push(`${t.id} UP: the button's "${t.labels['button.hover']}" hover did not show inside its hovered card`); }
    // DOWN: a card that drives its button changes it when only the card is hovered
    if (t.pick['card.drives']) { checks++; await pg.mouse.move(5, 5); await settle(pg); /* R2-21: REST means the mouse is away — on the button it already hovers the card */ const bRest = await btn.evaluate((e) => getComputedStyle(e).filter); await pg.mouse.move(cb.x + 6, cb.y + 6); await settle(pg); const bCard = await btn.evaluate((e) => getComputedStyle(e).filter); if (bRest === bCard) fails.push(`${t.id} DOWN: hovering the card did not reach its button (filter ${bCard})`); }
    // the card's own hover
    if (t.pick['card.hover']) { checks++; if (await diffRatio(rest, cardOnly) < VISIBLE / 3) fails.push(`${t.id} card "${t.labels['card.hover']}" hover showed nothing`); }
    // PRESS
    if (t.pick['button.press']) { checks++; await pg.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await settle(pg); const before = await btn.evaluate((e) => getComputedStyle(e).transform); await pg.mouse.down(); await settle(pg); const during = await btn.evaluate((e) => getComputedStyle(e).transform); await pg.mouse.up(); if (before === during) fails.push(`${t.id} PRESS: pressing changed nothing (${during})`); }
    // FOCUS — by keyboard, as a keyboard user reaches it
    checks++; await pg.mouse.move(5, 5); await pg.evaluate(() => document.activeElement && document.activeElement.blur()); await pg.keyboard.press('Tab'); await settle(pg);
    const f = await pg.evaluate(() => { const a = document.activeElement; const c = getComputedStyle(a); return { level: a.dataset.level, style: c.outlineStyle, width: parseFloat(c.outlineWidth) }; });
    if (f.level !== 'button' || f.style === 'none' || f.width < 2) fails.push(`${t.id} FOCUS: Tab reached ${f.level || 'nothing'}, outline ${f.style} ${f.width}px`);
    // REDUCED MOTION — every level's transition instant
    checks++; await pg.emulateMedia({ reducedMotion: 'reduce' });
    const durs = await pg.$$eval(`[data-tree="${t.id}"] [data-level]`, (els) => els.map((e) => Math.max(...getComputedStyle(e).transitionDuration.split(',').map(parseFloat))));
    if (durs.some((d) => d > 0.01)) fails.push(`${t.id} REDUCED MOTION: transitions still ${durs.join(', ')}s`);
  }
  console.log(`states at every level: ${N} trees · ${checks} checks · ${fails.length} failed`);
  for (const x of fails.slice(0, 30)) console.log('  ' + x);
  fs.writeFileSync(path.join(OUT, 'states-proof.json'), JSON.stringify({ at: new Date().toISOString(), n: N, seed: SEED, checks, fails }, null, 1));
  await browser.close();
})();
