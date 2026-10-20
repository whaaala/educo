// HEADED UAT — BATCH LE-15k · editing a section: the handles apart and named, only the dragged edge moves, cards one or all
// (docs/TASK_TREE.md BATCH LE-15k CHECKLIST K1–K9, K12; box-builder-spacing.feature "On every side, the size, inner-space and outer-space
// handles are in three different places", "A selected block shows its size first…", "Show spacing…", "A card in a grid of cards…").
// Six windows side by side, one slice of the checklist each. Every state BUILT THROUGH THE UI (RULE Y): Add page → the School home
// template, blocks selected by clicking them, edges dragged by the pointer; localStorage only READ.
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le15k-headed.js [--only=apart,cards]
const path = require('path'); const fs = require('fs');
const H = require('./h.js');
const { WIDTHS } = require('./screens.js');
const { sleep, pvOpen, pvClose, pvAt } = require('./uat-rx3-headed.js');
const { auditDoc } = require('./page-audit.js');
const LAYOUT = require('../../config/layout.json');
const WORDS = require('../../config/inspector.json');
const T = WORDS.sections, SEL = WORDS.selection;
const RUNGS = { tp: LAYOUT.rungs.tabletPortrait.from, tl: LAYOUT.rungs.tabletLandscape.from }; // RULE CFG
const OUT = path.join(__dirname, 'logs', 'le15k'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const results = [];
const rec = (job, id, ok, ev) => { results.push({ job, id, ok, ev }); console.log(`[${job}] ${id} ${ok ? 'PASS' : 'FAIL'} · ${ev}`); };
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') }).catch(() => {});

/** The School home page, made the way a person makes it: Add page (in More under 1024) → the template. */
async function home(page) {
  const add = page.getByRole('button', { name: 'Add page', exact: true }).first();
  if (!(await add.isVisible().catch(() => false))) { await page.getByRole('button', { name: 'More', exact: true }).first().click(); await sleep(page, 400); }
  await page.getByRole('button', { name: 'Add page', exact: true }).first().click();
  const d = page.getByRole('dialog', { name: T.addPageTitle }); await d.waitFor(); await sleep(page, 1800);
  await d.getByRole('textbox').fill('Home 2'); await d.getByRole('button', { name: /^Add School home,/ }).click();
  await page.getByText(/Open day on Saturday/).first().waitFor(); await sleep(page, 1200);
}
const BLOCKS = {
  section: [(p) => p.getByText(/Open day on Saturday/).first(), (el) => el.tagName === 'SECTION'],
  title: [(p) => p.getByText(/Welcome to/).first(), (el) => /^H[1-6]$/.test(el.tagName) || (!!el.querySelector('h1,h2') && !el.querySelector('p'))],
  button: [(p) => p.getByText('Book your place').first(), (el) => (el.textContent || '').trim() === 'Book your place' && !!el.querySelector('a,button')],
  card: [(p) => p.getByText('Term dates').first(), (el) => !!el.querySelector('svg') && (el.textContent || '').trim() === 'Term dates'],
  picture: [(p) => p.locator('[data-box-id] img').nth(1), (el) => !!el.querySelector('img') && !(el.textContent || '').trim()],
};
/** Click it as many times as a person must (the section first, then inside), centred in the window first. */
async function pick(page, name) {
  const [loc, is] = BLOCKS[name]; const t = loc(page);
  await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
  await t.evaluate((e) => e.scrollIntoView({ block: 'center', inline: 'center' })); await sleep(page, 300);
  for (let i = 0; i < 6; i++) {
    await t.click(); await sleep(page, 350);
    const ok = await page.evaluate((src) => { const id = document.querySelector('[data-chrome-mirror]')?.getAttribute('data-chrome-mirror'); const el = id && document.querySelector(`[data-box-id="${CSS.escape(id)}"]`); return !!el && new Function('el', `return (${src})(el)`)(el); }, is.toString());
    if (ok) { await page.mouse.move(2, 2); await sleep(page, 250); return true; }
  }
  return false;
}
const sel = (page) => page.evaluate(() => { const id = document.querySelector('[data-chrome-mirror]')?.getAttribute('data-chrome-mirror'); const e = id && document.querySelector(`[data-box-id="${CSS.escape(id)}"]`); if (!e) return null; const r = e.getBoundingClientRect(); return { id, t: r.top, b: r.bottom, l: r.left, r: r.right, w: r.width, h: r.height }; });
async function drag(page, label, dx, dy) {
  const b = await page.locator(`[aria-label="Resize ${label}"]`).first().boundingBox(); if (!b) return null;
  const x = b.x + b.width / 2, y = b.y + b.height / 2; await page.mouse.move(x, y); await page.mouse.down();
  let chip = '';
  for (let i = 1; i <= 15; i++) { await page.mouse.move(x + (dx * i) / 15, y + (dy * i) / 15); await sleep(page, 16); if (i === 14) chip = await page.locator('[data-span-live]').innerText().catch(() => ''); }
  await page.mouse.move(x + dx, y + dy); await page.mouse.up(); await sleep(page, 600); return chip;
}
/** Every handle on screen, what each one is and where; and what a pointer lands on 2 and 24px outside each edge. */
const handles = (page) => page.evaluate(() => {
  const id = document.querySelector('[data-chrome-mirror]')?.getAttribute('data-chrome-mirror'); const B = document.querySelector(`[data-box-id="${CSS.escape(id)}"]`).getBoundingClientRect();
  const tb = document.querySelector('[data-chrome-mirror] [role="toolbar"]'); const out = [];
  const box = (k, e) => { const r = e.getBoundingClientRect(); return { k, x: r.x, y: r.y, w: r.width, h: r.height }; };
  document.querySelectorAll('[aria-label^="Resize "]').forEach((e) => { const r = e.getBoundingClientRect(); if (!r.width) return; const k = e.getAttribute('aria-label').slice(7); let grab = '';
    if (/ edge$/.test(k)) { const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
      grab = [2, 24].map((d) => { const [x, y] = /top/.test(k) ? [cx, B.top - d] : /bottom/.test(k) ? [cx, B.bottom + d] : /left/.test(k) ? [B.left - d, cy] : [B.right + d, cy]; const t = document.elementFromPoint(x, y);
        // LE15k-aa: only inside the visible canvas — the Inspector or the floating blocks button over the canvas's edge is the editor's own
        const cv = document.querySelector('[data-canvas-scroller]').getBoundingClientRect(), inCanvas = x > cv.left && x < cv.right && y > cv.top && y < cv.bottom;
        const chrome = t && !t.closest('[data-canvas-scroller]') && !t.closest('[data-chrome-mirror]');
        return !inCanvas || chrome || t === e || (t && tb && tb.contains(t)) || (t && t.hasAttribute('data-handle-hit')) ? '' : `${d}px:${t?.getAttribute('aria-label') || t?.tagName}`; }).join(' ').trim(); }
    out.push({ ...box('size ' + k, e), grab }); });
  document.querySelectorAll('[data-space-handle]').forEach((e) => { const r = e.getBoundingClientRect(); if (r.width) out.push(box('space ' + e.getAttribute('data-space-handle'), e)); });
  return { B: { x: B.x, y: B.y, w: B.width, h: B.height }, out, bands: document.querySelectorAll('[data-space-band]').length, labels: Array.from(document.querySelectorAll('[data-space-band] > span')).map((e) => box('label', e)) };
});
const gapOf = (a, b) => Math.max(Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w), Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h));
function apart(s) {
  const bad = [];
  for (let i = 0; i < s.out.length; i++) for (let j = i + 1; j < s.out.length; j++) { const a = s.out[i], b = s.out[j], same = a.k.startsWith('size') && b.k.startsWith('size');
    const g = gapOf(a, b); if (same ? g <= 0 : g < 8) bad.push(`${a.k}↔${b.k} ${g.toFixed(1)}`); }
  for (const l of s.labels) for (const h of s.out) if (gapOf(l, h) <= 0) bad.push(`label over ${h.k}`);
  for (const h of s.out) if (h.grab) bad.push(`${h.k} grab ${h.grab}`);
  return bad;
}
async function spacing(page, label) {
  const bar = page.getByRole('button', { name: label, exact: true });
  if (await bar.isVisible().catch(() => false)) await bar.click();
  else { await page.getByRole('button', { name: 'Block actions' }).first().click(); await page.getByRole('menuitem', { name: new RegExp(`^${label}`) }).click(); }
  await page.mouse.move(2, 2); await sleep(page, 300);
}

const JOBS = {
  // K1 · apart and named, at five widths: each its own window, one after the other (the builder opens differently under 1024)
  async apart(_p, J, open) {
    for (const [w, h] of [[375, 812], [768, 1024], [1280, 900], [1536, 864], [1920, 1000]]) {
      const { browser, page, errs } = await open(w, h);
      try {
        await home(page); const bad = [];
        for (const b of Object.keys(BLOCKS)) {
          if (!(await pick(page, b))) { bad.push(`${b}: not selectable`); continue; }
          const idle = await handles(page); if (idle.bands) bad.push(`${b}: ${idle.bands} spaces drawn at rest`);
          bad.push(...apart(idle).map((x) => `${b}: ${x}`));
          await spacing(page, SEL.showSpacing); const all = await handles(page); bad.push(...apart(all).map((x) => `${b} (shown): ${x}`));
          if (b === 'section' && !all.bands) bad.push('section: Show spacing drew nothing');
          if (b === 'title') await shot(page, `K1-title-shown-${w}`);
          await spacing(page, SEL.hideSpacing);
        }
        rec(J, `K1 at ${w}: five blocks, handles apart, size handles outside and grabbed 2–24px out, at rest and with every space shown`, !bad.length, bad.slice(0, 6).join(' | ') || 'apart');
        rec(J, `K12 at ${w}: no console errors`, !errs.length, errs.join(' | ') || 'none');
      } catch (e) { rec(J, `ERROR at ${w}`, false, e.message.split('\n')[0]); await shot(page, `ERR-apart-${w}`); }
      await browser.close();
    }
  },
  // K2 · K3 · K7 · K9 · the words, the switch, the keys, the name, the themes
  async words(page, J) {
    await home(page); await pick(page, 'section');
    const ed = await page.getByText(/^Editing:/).first().locator('xpath=..').innerText().catch(() => '');
    rec(J, 'K7 a section is called a Section (Inspector)', /Editing:\s*Section/.test(ed), ed.split('\n')[0]);
    const s0 = await handles(page); rec(J, 'K2 at rest: no space drawn', s0.bands === 0, `${s0.bands} drawn`);
    const top = await page.locator('[aria-label="Resize top edge"]').boundingBox(); await page.mouse.move(top.x + top.width / 2, top.y + top.height / 2); await sleep(page, 250);
    const tipH = await page.locator('[data-span-live]').innerText().catch(() => '');
    const right = await page.locator('[aria-label="Resize right edge"]').boundingBox(); await page.mouse.move(right.x + right.width / 2, right.y + right.height / 2); await sleep(page, 250);
    const tipW = await page.locator('[data-span-live]').innerText().catch(() => '');
    rec(J, 'K2 an edge says what it does', tipH === SEL.tipHeight && tipW === SEL.tipWidth, `"${tipH}" · "${tipW}"`);
    await shot(page, 'K2-edge-words');
    await page.mouse.move(s0.B.x + s0.B.w * 0.6, s0.B.y + 6); await sleep(page, 300);
    const zone = await page.evaluate(() => Array.from(document.querySelectorAll('[data-space-band]')).map((b) => `${b.getAttribute('data-space-band')}:${b.textContent}`));
    rec(J, 'K2 in the space inside its top: that space alone, in words', zone.length === 1 && zone[0].startsWith('paddingTop:') && zone[0].includes(SEL.spaceInside), zone.join(' | '));
    await shot(page, 'K2-space-inside');
    await page.mouse.move(2, 2); await sleep(page, 250);
    // the words hold the caret after a click on them, and keys go to the words (LE8-6, LE15k-v): picked by its empty space, as a person does
    await page.mouse.click(s0.B.x + 12, s0.B.y + 12); await page.mouse.move(2, 2); await sleep(page, 300);
    await page.keyboard.press(SEL.spacingKey); await sleep(page, 300); const k1 = (await handles(page)).bands;
    await page.keyboard.press(SEL.spacingKey); await sleep(page, 300); const k2 = (await handles(page)).bands;
    rec(J, `K3 ${SEL.spacingKey} shows every space, and again hides them`, k1 > 1 && k2 === 0, `${k1} → ${k2}`);
    await spacing(page, SEL.showSpacing); const b1 = await handles(page); await shot(page, 'K3-every-space');
    await spacing(page, SEL.hideSpacing); const b2 = await handles(page);
    rec(J, 'K3 "Show spacing" on the bar shows every space with its words, none over a handle; "Hide spacing" hides them', b1.bands > 1 && !apart(b1).length && b2.bands === 0, `${b1.bands} → ${b2.bands} · ${apart(b1).join(' | ') || 'apart'}`);
    await page.getByRole('button', { name: 'Block actions' }).first().click(); const inMenu = await page.getByRole('menuitem', { name: new RegExp(`^${SEL.showSpacing}`) }).isVisible().catch(() => false); await page.keyboard.press('Escape');
    rec(J, 'K3 "Show spacing" is in ⋯ too', inMenu, inMenu ? 'there' : 'missing');
    await pick(page, 'section');
    await page.evaluate(() => document.querySelector('[data-space-handle="paddingTop"]')?.focus()); await sleep(page, 250); // LE15k-y: after the redraw
    const focus = await page.evaluate(() => { const h = document.querySelector('[data-space-handle="paddingTop"]'); return h ? `${document.activeElement === h} ${getComputedStyle(h).opacity}` : 'no handle'; });
    rec(J, 'K3 Tab reaches a space handle, and a focused one shows', focus === 'true 1', focus);
    // K9 · the words in four themes: the edge's words, a space's words, and the bar (every colour read through a 1px canvas, so an
    // oklch() colour measures as it is drawn)
    const ratio = (sel) => page.locator(sel).first().evaluate((e) => {
      const cv = document.createElement('canvas'); cv.width = cv.height = 1; const x = cv.getContext('2d');
      const rgb = (c) => { x.clearRect(0, 0, 1, 1); x.fillStyle = '#000'; x.fillStyle = c; x.fillRect(0, 0, 1, 1); return Array.from(x.getImageData(0, 0, 1, 1).data).slice(0, 3); };
      const L = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }, lum = (c) => 0.2126 * L(c[0]) + 0.7152 * L(c[1]) + 0.0722 * L(c[2]);
      let bgEl = e; while (bgEl && getComputedStyle(bgEl).backgroundColor === 'rgba(0, 0, 0, 0)') bgEl = bgEl.parentElement;
      const a = lum(rgb(getComputedStyle(e).color)), b = lum(rgb(bgEl ? getComputedStyle(bgEl).backgroundColor : '#fff'));
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    }).catch(() => 0);
    const out = [];
    for (const th of ['Light', 'Dark', 'Midnight', 'Purple']) {
      // the EDITOR's theme (its chrome, the bar) — "Change theme"; the "Light ▾" beside it is the website's (LE15k-aq)
      await page.getByRole('button', { name: 'Change theme', exact: true }).first().click(); await sleep(page, 200);
      await page.getByRole('menuitemradio', { name: new RegExp(`^${th}`) }).first().click(); await sleep(page, 500);

      await pick(page, 'section'); const tb = await page.locator('[aria-label="Resize top edge"]').boundingBox(); await page.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2); await sleep(page, 200);
      const edgeW = await ratio('[data-span-live]');
      const B = (await handles(page)).B; await page.mouse.move(B.x + B.w * 0.6, B.y + 6); await sleep(page, 300);
      const spaceW = await ratio('[data-space-band] > span');
      await pick(page, 'card'); await drag(page, 'bottom edge', 0, 30); await sleep(page, 300);
      const barW = await ratio('[data-one-or-all] > span');
      const barBg = await page.locator('[data-one-or-all]').first().evaluate((e) => getComputedStyle(e).backgroundColor).catch(() => '?');
      if (th === 'Dark') await shot(page, 'K9-dark-bar');
      await page.keyboard.press('Escape'); await page.keyboard.press('Control+z'); await sleep(page, 400);
      out.push(`${th} (bar on ${barBg.replace(/\s+/g, '')}) edge ${edgeW.toFixed(2)} · space ${spaceW.toFixed(2)} · bar ${barW.toFixed(2)}`);
    }
    rec(J, "K9 the edge words, a space's words and the bar readable in four themes (≥ 4.5 : 1)", out.every((x) => { const v = [...x.matchAll(/(?:edge|space|bar) (\d+\.\d+)/g)].map((m) => parseFloat(m[1])); return v.length === 3 && v.every((n) => n >= 4.5); }), out.join(' | '));
  },
  // K4 · only the dragged edge moves, or it stops
  async edges(page, J) {
    await home(page); const bad = []; let chips = 0, said = 0, wholes = 0, labelled = 0;
    for (const b of ['section', 'title', 'button', 'picture']) {
      for (const [edge, d] of [['top', -60], ['top', 60], ['bottom', 60], ['bottom', -60], ['left', -60], ['left', 60], ['right', 60], ['right', -60]]) {
        // the picture is one of a grid of pictures: its sides set how many go across, for all (the user's Q2 / Q3) — judged as K6 judges cards
        if (b === 'picture' && /left|right/.test(edge)) continue;
        if (!(await pick(page, b))) { bad.push(`${b} not selectable`); break; }
        const a = await sel(page); const chip = await drag(page, `${edge} edge`, /left|right/.test(edge) ? d : 0, /top|bottom/.test(edge) ? d : 0); const z = await sel(page);
        if (chip && /×/.test(chip)) chips++; if (/as small as its content/.test(chip || '')) said++; if (chip && (chip.startsWith(SEL.spaceAbove) || chip.startsWith(SEL.spaceLeft))) labelled++;
        if (!a || !z) { bad.push(`${b} ${edge}: lost`); continue; }
        const moved = { top: z.t - a.t, bottom: z.b - a.b, left: z.l - a.l, right: z.r - a.r };
        const others = Object.entries(moved).filter(([k, v]) => k !== edge && Math.abs(v) > 2);
        // the user's Q5: past what is inside it, the block MOVES as a whole — the far edge goes the same way, its size kept, the sides still
        const opp = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[edge], side = /top|bottom/.test(edge) ? ['left', 'right'] : ['top', 'bottom'];
        // (it may first shrink to what is inside it, then move: the far edge goes the same way, never further than the dragged one)
        const asWhole = Math.abs(moved[edge]) > 2 && Math.sign(moved[opp]) === Math.sign(moved[edge]) && Math.abs(moved[opp]) <= Math.abs(moved[edge]) + 3 && side.every((k) => Math.abs(moved[k]) <= 2);
        if (asWhole) wholes++;
        else if (others.length) bad.push(`${b} ${edge} ${d}: ${others.map(([k, v]) => `${k}${v > 0 ? '+' : ''}${Math.round(v)}`).join(' ')}`);
        await page.keyboard.press('Escape'); await page.keyboard.press('Control+z'); await sleep(page, 400);
      }
    }
    rec(J, 'K4 every edge of the section, title and button, and the top and bottom of a gallery picture, out and in: only that edge moves, it stops, or past its content the block moves as a whole (Q5)', !bad.length, bad.slice(0, 8).join(' | ') || `28 drags, the other edges held · ${wholes} moved the block as a whole`);
    rec(J, 'K4 a label beside the pointer while dragging: the size, or the space it is moving into', chips + labelled >= 20, `${chips} showed W × H · ${labelled} the space · ${said} "as small as its content"`);
  },
  // K5 · the centred title
  async centred(page, J) {
    await home(page); const out = []; let ok = true;
    for (const [edge, d] of [['left', -60], ['left', 60], ['right', 60], ['right', -60], ['bottom', 60]]) {
      await pick(page, 'title'); const a = await sel(page); await drag(page, `${edge} edge`, /left|right/.test(edge) ? d : 0, edge === 'bottom' ? d : 0); const z = await sel(page);
      const opp = { left: z.r - a.r, right: z.l - a.l, bottom: z.t - a.t }[edge], own = { left: z.l - a.l, right: z.r - a.r, bottom: z.b - a.b }[edge];
      out.push(`${edge} ${d}: own ${Math.round(own)} · other ${Math.round(opp)}`); if (Math.abs(opp) > 2 || Math.abs(own - d) > 3) ok = false;
      await page.keyboard.press('Escape'); await page.keyboard.press('Control+z'); await sleep(page, 400);
      const back = await (async () => { await pick(page, 'title'); return sel(page); })(); if (Math.abs(back.l - a.l) > 2 || Math.abs(back.r - a.r) > 2 || Math.abs(back.h - a.h) > 2) { ok = false; out.push(`${edge}: Ctrl+Z did not put it back`); }
    }
    await shot(page, 'K5-centred');
    rec(J, 'K5 the centred title: each edge follows the pointer, the other side holds, Ctrl+Z puts it back', ok, out.join(' | '));
  },
  // K6 · cards: every edge, all together, the bar
  async cards(page, J) {
    await home(page);
    const offeredOf = (t, n) => t.includes(SEL.allCards.replace('{n}', String(n))) && t.includes(SEL.justThisOne);
    const cards = () => page.evaluate(() => { const id = document.querySelector('[data-chrome-mirror]')?.getAttribute('data-chrome-mirror'); const me = id && document.querySelector(`[data-box-id="${CSS.escape(id)}"]`); if (!me) return null;
      return Array.from(me.parentElement.children).map((c) => { const r = c.getBoundingClientRect(); return { me: c === me, t: r.top, b: r.bottom, l: r.left, r: r.right, h: r.height, w: r.width }; }); });
    for (const [edge, d] of [['bottom', 50], ['top', 30], ['top', -30], ['right', -150], ['left', 150]]) {
      await pick(page, 'card'); const a = await cards(); const chip = await drag(page, `${edge} edge`, /left|right/.test(edge) ? d : 0, /top|bottom/.test(edge) ? d : 0); const z = await cards();
      const mi = a.findIndex((c) => c.me), bar = page.locator('[data-one-or-all]'), barText = await bar.innerText().catch(() => '');
      let ok, ev;
      if (/top|bottom/.test(edge)) {
        const dh = z.map((c, i) => Math.round(c.h - a[i].h)); const held = edge === 'bottom' ? Math.abs(z[mi].t - a[mi].t) : Math.abs(z[mi].b - a[mi].b);
        // a drag its content stops changes nothing — and then nothing is offered (LE15k-t)
        const changed = dh.some((x) => Math.abs(x) > 2);
        ok = dh.every((x) => Math.abs(x - dh[0]) <= 2) && held <= 2 && (changed ? offeredOf(barText, a.length) : !barText);
        ev = `heights ${dh.join(',')} · the other edge moved ${Math.round(held)}${changed ? '' : ' · stopped by its content, nothing offered'}`;
      } else { const across = (cs) => cs.filter((c) => Math.abs(c.t - cs[0].t) < 2).length; ok = across(z) !== across(a) && offeredOf(barText, a.length); ev = `${across(a)} → ${across(z)} across · "${chip}"`; }
      rec(J, `K6 a card's ${edge} edge ${d > 0 ? '+' : ''}${d}: every card together; the bar offers "Just this one" when they changed`, ok, `${ev} · bar "${barText.replace(/\n/g, ' ')}"`);
      if (edge === 'bottom') {
        await shot(page, 'K6-bar');
        await bar.getByRole('button', { name: SEL.justThisOne }).click(); await sleep(page, 500); const one = await cards();
        const others = one.map((c, i) => ({ ...c, i })).filter((c) => Math.abs(c.t - one[mi].t) > 2);
        rec(J, 'K6 "Just this one": the card stays selected and only it keeps the height', !!one && one[mi].h - a[mi].h > 30 && others.every((c) => Math.abs(c.h - a[c.i].h) < 2), one ? `this +${Math.round(one[mi].h - a[mi].h)} · others ${others.map((c) => Math.round(c.h - a[c.i].h)).join(',')}` : 'selection lost');
        await shot(page, 'K6-just-this-one');
        await page.keyboard.press('Control+z'); await sleep(page, 500); const back = await cards();
        rec(J, 'K6 Ctrl+Z puts the cards back', !!back && back.every((c, i) => Math.abs(c.h - a[i].h) < 2), back ? back.map((c, i) => Math.round(c.h - a[i].h)).join(',') : 'selection lost');
      } else { await page.keyboard.press('Escape'); await page.keyboard.press('Control+z'); await sleep(page, 400); }
    }
    await pick(page, 'card'); await drag(page, 'bottom edge', 0, 40); const shown = await page.locator('[data-one-or-all]').count();
    await pick(page, 'section'); await sleep(page, 300); const after = await page.locator('[data-one-or-all]').count();
    rec(J, 'K6 another selection ends the offer', shown === 1 && after === 0, `${shown} → ${after}`);
  },
  // K13 · K14 · the user's own two cases (2026-10-20): moving the title by its edges, and words that fill a width given by hand
  async moves(page, J) {
    await home(page);
    const pos = () => page.getByText(/Welcome to/).first().evaluate((e) => { const b = e.closest('[data-box-id]').getBoundingClientRect(); return { t: b.top, b: b.bottom, l: b.left, r: b.right }; });
    const during = async (label, dx, dy) => {
      const h = await page.locator(`[aria-label="Resize ${label}"]`).first().boundingBox(); const x = h.x + h.width / 2, y = h.y + h.height / 2;
      await page.mouse.move(x, y); await page.mouse.down();
      for (let i = 1; i <= 15; i++) { await page.mouse.move(x + (dx * i) / 15, y + (dy * i) / 15); await sleep(page, 20); }
      const mid = await pos(), chip = await page.locator('[data-span-live]').innerText().catch(() => '');
      await page.mouse.up(); await sleep(page, 500); return { mid, chip };
    };
    await pick(page, 'title'); const a = await pos();
    const down = await during('top edge', 0, 80); const b = await pos();
    await shot(page, 'K13-title-moved-down');
    rec(J, 'K13 the title\'s top dragged down past its words: it moves down, seen while dragging, labelled', down.mid.t - a.t > 40 && b.t - a.t > 40 && Math.abs((b.b - b.t) - (a.b - a.t)) < 3 && down.chip.startsWith(SEL.spaceAbove), `top ${Math.round(a.t)} → ${Math.round(down.mid.t)} (dragging) → ${Math.round(b.t)} · height kept · "${down.chip}"`);
    // back up in the SAME movement: the space closes and the title is where it was (rule 7); a later drag up grows it into that space
    await page.keyboard.press('Control+z'); await sleep(page, 400);
    await pick(page, 'title'); { const h = await page.locator('[aria-label="Resize top edge"]').first().boundingBox(); const x = h.x + h.width / 2, y = h.y + h.height / 2;
      await page.mouse.move(x, y); await page.mouse.down(); for (let i = 1; i <= 10; i++) { await page.mouse.move(x, y + i * 8); await sleep(page, 20); }
      for (let i = 9; i >= 0; i--) { await page.mouse.move(x, y + i * 8); await sleep(page, 20); } await page.mouse.up(); await sleep(page, 400); }
    const c = await pos();
    rec(J, 'K13 dragged back up in the same movement, the space closes: the title is where it was', Math.abs(c.t - a.t) < 3 && Math.abs(c.b - a.b) < 3, `top ${Math.round(c.t)} (was ${Math.round(a.t)})`);
    await pick(page, 'title'); const right = await during('left edge', 500, 0); const d = await pos();
    rec(J, 'K13 its left edge dragged right past its words: it slides right, labelled', d.l - a.l > 100 && right.chip.startsWith(SEL.spaceLeft), `left ${Math.round(a.l)} → ${Math.round(d.l)} · "${right.chip}"`);
    await page.keyboard.press('Escape'); await page.keyboard.press('Control+z'); await sleep(page, 400); // the slide only — more takes the page's own template back
    // K14
    const lines = () => page.getByText(/Open day on Saturday/).first().evaluate((e) => Math.round(e.getBoundingClientRect().height / parseFloat(getComputedStyle(e).lineHeight)));
    const words = page.getByText(/Open day on Saturday/).first(); await words.evaluate((e) => e.scrollIntoView({ block: 'center' }));
    for (let i = 0; i < 2; i++) { await words.click(); await sleep(page, 400); } await page.mouse.move(2, 2);
    const l0 = await lines(); await during('right edge', 200, 0); const l1 = await lines();
    await shot(page, 'K14-open-day-one-line');
    const f = await pvOpen(page); await sleep(page, 800); await pvAt(page, 1280, 820); await sleep(page, 300);
    const pvLines = await f.evaluate(() => { const p = Array.from(document.querySelectorAll('p')).find((e) => /Open day on Saturday/.test(e.textContent)); return p ? Math.round(p.getBoundingClientRect().height / parseFloat(getComputedStyle(p).lineHeight)) : 0; });
    await pvClose(page, 1280);
    rec(J, 'K14 "Open day…" widened by hand: one line on the canvas and in the Preview (1280)', l0 >= 2 && l1 === 1 && pvLines === 1, `canvas ${l0} → ${l1} lines · Preview ${pvLines}`);
  },
  // K8 · the Preview after the drags, at every width
  async preview(page, J) {
    await home(page);
    await pick(page, 'title'); await drag(page, 'right edge', -80, 0);
    await pick(page, 'section'); await drag(page, 'bottom edge', 0, 60);
    await pick(page, 'card'); await drag(page, 'bottom edge', 0, 40); await page.locator('[data-one-or-all]').getByRole('button', { name: SEL.justThisOne }).click(); await sleep(page, 500);
    // LE15k-z: a share of its section, read the same way on the canvas as in the Preview, not px across two page widths
    const share = () => { const h = Array.from(document.querySelectorAll('h1,h2')).find((e) => /Welcome to/.test(e.textContent)); const s = h && h.closest('section'); return h && s ? h.getBoundingClientRect().width / s.getBoundingClientRect().width : 0; };
    const canvasShare = await page.evaluate(share);
    const f0 = await pvOpen(page); await sleep(page, 900);
    const errs = {}; const warns = new Set();
    for (const w of WIDTHS) { const f = await pvAt(page, w, 820); await sleep(page, 120); const a = await f.evaluate(auditDoc, { rowBands: true, rungs: RUNGS }); for (const e of a.err) (errs[e.replace(/\d+px|\d+(\.\d+)?/g, '#')] ||= []).push(w); a.warn.forEach((x) => warns.add(x.split(' ')[0])); }
    const listed = Object.entries(errs).map(([m, ws]) => `${m} @ ${ws.length === WIDTHS.length ? 'all' : ws.join(',')}`).join(' | ');
    rec(J, `K8 the page audit is clean at all ${WIDTHS.length} widths after the drags`, !Object.keys(errs).length, listed || `clean · warnings: ${[...warns].join(' ') || 'none'}`);
    const f = await pvAt(page, 1280, 820); await sleep(page, 400);
    const pvShare = await f.evaluate(share);
    for (const w of [375, 1280]) { await pvAt(page, w, 820); await sleep(page, 300); await shot(page, `K8-preview-${w}`); }
    await pvClose(page, 1280);
    rec(J, 'K8 the narrowed title takes the same share of the hero in the Preview as on the canvas (1280)', pvShare > 0 && Math.abs(pvShare - canvasShare) < 0.04, `canvas ${(canvasShare * 100).toFixed(1)}% · Preview ${(pvShare * 100).toFixed(1)}%`);
    void f0;
  },
};

(async () => {
  const jobs = Object.keys(JOBS).filter((n) => !ONLY.length || ONLY.includes(n));
  let slot = 0; const queue = [...jobs];
  const worker = async (s) => {
    const pos = [(s % 3) * 620, Math.floor(s / 3) * 480];
    while (queue.length) {
      const J = queue.shift();
      if (J === 'apart') { await JOBS.apart(null, J, (w, h) => H.open({ headed: true, w, h, pos })); continue; }
      const { browser, page, errs } = await H.open({ headed: true, w: J === 'cards' || J === 'moves' ? 1920 : J === 'edges' ? 1536 : 1280, h: J === 'edges' ? 864 : J === 'moves' ? 980 : 900, pos });
      try { await JOBS[J](page, J); } catch (e) { rec(J, 'ERROR', false, e.message.split('\n')[0]); await shot(page, `ERR-${J}`); }
      rec(J, 'K12 console', !errs.length, errs.join(' | ') || 'no errors');
      await browser.close();
    }
  };
  await Promise.all(Array.from({ length: Math.min(6, jobs.length) }, () => worker(slot++)));
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.ok);
  console.log(`SUMMARY ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})();
