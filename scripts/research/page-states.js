// WHAT EVERY PAGE DOES — hover, keyboard focus, opening, scroll, reduced motion, its elements, its flow (LE-15, the user
// 2026-10-19: "the components, the flow, the effects… the hover over… HTML elements… so we don't have to come back").
// Run by section-kinds.js in the same archive pass, at the desktop size, after the layout is measured:
//   states(page, cfg) → sites/<site>/<page>.states.json        flow(page, index) → sites/<site>/flow.json
// The limits and the kinds tried are in config/research.json `states` (RULE CFG).

/** Two style snapshots ({ self, parent, "child:n" } → { prop: value }) → only what changed, before and after. */
function styleDiff(a, b) {
  const out = {};
  for (const k of Object.keys(b)) { const ch = {}; for (const [p, v] of Object.entries(b[k] || {})) if ((a[k] || {})[p] !== v) ch[p] = [(a[k] || {})[p], v]; if (Object.keys(ch).length) out[k] = ch; }
  return out;
}
/** One of each look-alike (same tag and classes), with how many there were; at most `max`. */
function distinct(xs, max) {
  const by = new Map(); for (const x of xs) { if (!by.has(x.sig)) by.set(x.sig, { ...x, alike: 0 }); by.get(x.sig).alike++; }
  return [...by.values()].slice(0, max);
}

// ── IN THE PAGE (each is passed to page.evaluate, so each stands alone) ──
/** Every tag, ARIA role and key attribute on the page, counted. */
function CENSUS(attrs) {
  const tags = {}, roles = {}, at = {};
  for (const e of document.querySelectorAll('*')) {
    const t = e.tagName.toLowerCase(); tags[t] = (tags[t] || 0) + 1;
    const r = e.getAttribute('role'); if (r) roles[r] = (roles[r] || 0) + 1;
    for (const a of attrs || []) if (e.hasAttribute(a)) at[a] = (at[a] || 0) + 1;
  }
  return { tags, roles, attrs: at };
}
/** The interactive things to try, marked data-educo-t so the browser side can reach each one. */
function TARGETS(cfg) {
  const seen = new Set(); const out = [];
  for (const [kind, sel] of Object.entries(cfg.hoverKinds)) {
    let els = []; try { els = [...document.querySelectorAll(sel)]; } catch { continue; }
    for (const e of els) {
      const r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4 || seen.has(e)) continue; seen.add(e);
      const id = String(out.length); e.setAttribute('data-educo-t', id);
      out.push({ id, kind, sig: `${kind}|${e.tagName.toLowerCase()}.${(e.getAttribute('class') || '').trim().split(/\s+/).sort().join('.')}`, text: (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 60) });
    }
  }
  return out;
}
/** The target's styles, its parent's and its first children's, for the properties compared — and its own timing. */
function SNAP({ sel, props, children }) {
  const e = document.querySelector(sel); if (!e) return null;
  const read = (el) => { const cs = getComputedStyle(el); return Object.fromEntries(props.map((p) => [p, cs.getPropertyValue(p)])); };
  const out = { self: read(e) }; if (e.parentElement) out.parent = read(e.parentElement);
  [...e.querySelectorAll('*')].slice(0, children).forEach((c, i) => { out[`child:${i}`] = read(c); });
  const cs = getComputedStyle(e);
  return { styles: out, timing: { transition: `${cs.transitionProperty} ${cs.transitionDuration} ${cs.transitionTimingFunction} ${cs.transitionDelay}`, animation: cs.animationName !== 'none' ? `${cs.animationName} ${cs.animationDuration} ${cs.animationTimingFunction}` : '' } };
}
/** Marks what is visible now; with `after`, lists what became visible since (an opened menu, panel, answer). */
function VISIBLE(after) {
  const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && +cs.opacity > 0; };
  const all = [...document.querySelectorAll('body *')].slice(0, 4000);
  if (!after) { all.forEach((el) => { if (vis(el)) el.setAttribute('data-educo-v', ''); }); return null; }
  const fresh = all.filter((el) => vis(el) && !el.hasAttribute('data-educo-v') && !el.parentElement?.closest('[data-educo-new]'));
  fresh.forEach((el) => el.setAttribute('data-educo-new', ''));
  return { count: fresh.length, top: fresh.slice(0, 3).map((el) => { const r = el.getBoundingClientRect(); return { tag: el.tagName.toLowerCase(), cls: (el.getAttribute('class') || '').slice(0, 80), w: Math.round(r.width), h: Math.round(r.height), fixed: getComputedStyle(el).position === 'fixed' }; }) };
}
/** Every element's moving properties and place — compared across scroll steps (as cp-tag.js LOOK does). */
function LOOK() {
  return [...document.querySelectorAll('body *')].slice(0, 3000).map((el) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    return [el.tagName.toLowerCase() + '.' + (el.getAttribute('class') || '').split(' ')[0], cs.transform, cs.opacity, cs.clipPath, cs.filter, cs.position, Math.round(r.top)]; });
}
const ANIMATED = () => [...document.querySelectorAll('body *')].filter((e) => { const cs = getComputedStyle(e); return cs.animationName !== 'none' && cs.animationPlayState !== 'paused'; }).length;

// ── IN NODE ──
async function states(p, cfg) {
  const out = { census: await p.evaluate(CENSUS, cfg.censusAttrs), targets: [], scroll: null, reducedMotion: null };
  // A link is never followed: the page must stay where it is while its parts are tried.
  await p.evaluate(() => document.addEventListener('click', (e) => { const a = e.target.closest && e.target.closest('a[href]'); if (a) e.preventDefault(); }, true));
  await p.keyboard.press('Shift'); // keyboard modality, so a focus shows its :focus-visible look
  const all = await p.evaluate(TARGETS, cfg); const picked = distinct(all, cfg.maxTargets);
  for (const t of picked) {
    const sel = `[data-educo-t="${t.id}"]`; const el = await p.$(sel); if (!el) continue;
    try {
      await el.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => {});
      const snap = () => p.evaluate(SNAP, { sel, props: cfg.props, children: cfg.childrenCompared });
      const before = await snap(); const box = await el.boundingBox(); if (!before || !box) continue;
      await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await p.waitForTimeout(cfg.hoverWaitMs);
      const hover = await snap(); await p.mouse.move(1, 1); await p.waitForTimeout(cfg.focusWaitMs);
      await p.evaluate((s) => document.querySelector(s)?.focus?.(), sel); await p.waitForTimeout(cfg.focusWaitMs);
      const focus = await snap(); await p.evaluate(() => document.activeElement?.blur?.());
      const rec = { kind: t.kind, sig: t.sig, alike: t.alike, text: t.text, timing: before.timing, hover: styleDiff(before.styles, hover.styles), focus: styleDiff(before.styles, focus.styles) };
      if (cfg.clickKinds.includes(t.kind)) {
        await p.evaluate(VISIBLE, false);
        const exp0 = await el.getAttribute('aria-expanded').catch(() => null);
        await el.click({ timeout: 1500 }).catch(() => {}); await p.waitForTimeout(cfg.clickWaitMs);
        const opened = await p.evaluate(VISIBLE, true); const exp1 = await el.getAttribute('aria-expanded').catch(() => null);
        await p.keyboard.press('Escape'); await p.waitForTimeout(cfg.clickWaitMs);
        const closedByEscape = (await p.evaluate(() => document.querySelectorAll('[data-educo-new]').length ? [...document.querySelectorAll('[data-educo-new]')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).length : 0)) === 0;
        rec.open = { ariaExpanded: [exp0, exp1], appeared: opened, closedByEscape };
        if (!closedByEscape) await el.click({ timeout: 1500 }).catch(() => {});
        await p.evaluate(() => document.querySelectorAll('[data-educo-v],[data-educo-new]').forEach((e) => { e.removeAttribute('data-educo-v'); e.removeAttribute('data-educo-new'); }));
      }
      out.targets.push(rec);
    } catch (e) { out.targets.push({ kind: t.kind, sig: t.sig, err: e.message.slice(0, 80) }); }
  }
  // SCROLL: what moves, step by step, and how.
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(cfg.scrollWaitMs);
  let prev = await p.evaluate(LOOK); const steps = [];
  for (let s = 0; s < cfg.scrollSteps; s++) {
    await p.mouse.wheel(0, 700); await p.waitForTimeout(cfg.scrollWaitMs); const now = await p.evaluate(LOOK);
    const what = {}; let n = 0; const names = ['transform', 'opacity', 'clip-path', 'filter', 'position'];
    now.forEach((r, i) => { const o = prev[i]; if (!o || o[0] !== r[0]) return; const ch = names.filter((_, k) => o[k + 1] !== r[k + 1]); const held = o[5] !== 'static' && o[6] === r[6] && r[5] !== 'static';
      if (held) ch.push('held'); if (ch.length) { n++; const key = `${r[0]}: ${ch.join('+')}`; what[key] = (what[key] || 0) + 1; } });
    steps.push({ changed: n, what: Object.entries(what).sort((a, b) => b[1] - a[1]).slice(0, 10) }); prev = now;
  }
  out.scroll = steps;
  // REDUCED MOTION: what still animates when the reader asks for less.
  const moving = await p.evaluate(ANIMATED); await p.emulateMedia({ reducedMotion: 'reduce' }); await p.waitForTimeout(400);
  out.reducedMotion = { animatingBefore: moving, animatingWithReduce: await p.evaluate(ANIMATED) }; await p.emulateMedia({ reducedMotion: null });
  await p.evaluate(() => window.scrollTo(0, 0));
  return out;
}

/** The site's FLOW, from its home page: the menu and footer as label → address → the page type the crawl gave it. */
async function flow(p, pages) {
  const type = new Map(pages.map((x) => [x.url.replace(/\/$/, ''), x.type]));
  const links = await p.evaluate(() => ['header, nav, [role=navigation]', 'footer, [role=contentinfo]'].map((sel) => [...document.querySelectorAll(sel)].flatMap((r) => [...r.querySelectorAll('a[href]')])
    .map((a) => ({ label: (a.innerText || a.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 60), href: a.href.split('#')[0] }))));
  const tag = (l) => ({ ...l, type: type.get(l.href.replace(/\/$/, '')) || (/^https?:/.test(l.href) && !l.href.includes(new URL(p.url()).host) ? 'external' : '') });
  return { menu: links[0].map(tag), footer: links[1].map(tag), pages };
}

// ── CAUGHT AS THE PAGE MAKES THEM (an init script, before any of the page's own code) ──
/** Canvas kinds, the shader code a WebGL effect compiles, and View Transitions — into window.__educo. */
function INIT(cfg) {
  const rec = (window.__educo = { ctx: [], shaders: [], vt: 0 });
  const gc = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (t, ...a) { const c = gc.call(this, t, ...a); if (c && !this.__educoT) { this.__educoT = t; rec.ctx.push({ t, w: this.width, h: this.height }); } return c; };
  for (const P of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) if (P && P.prototype.shaderSource) {
    const ss = P.prototype.shaderSource; P.prototype.shaderSource = function (sh, src) { if (rec.shaders.length < cfg.maxShaders) rec.shaders.push(String(src).slice(0, cfg.shaderMaxChars)); return ss.call(this, sh, src); };
  }
  if (document.startViewTransition) { const vt = document.startViewTransition.bind(document); document.startViewTransition = (...a) => { rec.vt++; return vt(...a); }; }
}

/** The link a page transition is recorded on: the site's own, to a page the archive holds, the menu's first. */
function pickLink(links, here, archived) {
  const norm = (u) => u.replace(/[#?].*$/, '').replace(/\/$/, '');
  const own = links.filter((l) => norm(l.href) !== norm(here) && archived.has(norm(l.href)));
  return (own.find((l) => l.inNav) || own[0] || {}).href || null;
}

/** Each canvas: its kind, size, a few frames and whether it moves; the shader code; the libraries in use. */
async function canvases(p, cfg, libs, dir, name) {
  const fs = require('fs'); const out = { canvases: [], shaders: [], libraries: [] };
  const info = await p.evaluate(({ max, libs }) => ({
    libs: libs.filter((k) => k in window), shaders: (window.__educo || {}).shaders || [], vt: (window.__educo || {}).vt || 0,
    list: [...document.querySelectorAll('canvas')].map((c, i) => { c.setAttribute('data-educo-c', String(i)); const r = c.getBoundingClientRect(); return { i, t: c.__educoT || '', w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top + scrollY) }; })
      .filter((c) => c.w > 20 && c.h > 20).sort((a, b) => b.w * b.h - a.w * a.h).slice(0, max) }), { max: cfg.maxCanvases, libs });
  out.libraries = info.libs; out.shaders = info.shaders; out.viewTransitionsCalled = info.vt;
  for (const c of info.list) {
    const el = await p.$(`[data-educo-c="${c.i}"]`); if (!el) continue;
    await el.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => {});
    const shots = []; let prev = null; let moving = false;
    for (let f = 0; f < cfg.frames; f++) {
      const buf = await el.screenshot({ type: 'jpeg', quality: 50, timeout: 3000 }).catch(() => null);
      if (buf) { const file = `media/${name}-canvas${c.i}-${f}.jpg`; fs.writeFileSync(`${dir}/${file}`, buf); shots.push(file); if (prev && !prev.equals(buf)) moving = true; prev = buf; }
      await p.waitForTimeout(cfg.frameGapMs);
    }
    out.canvases.push({ ...c, moving, shots });
  }
  return out;
}

/** A page TRANSITION, live: a menu link clicked (its page served from the archive), frames from the click on,
 *  a full-screen cover or curtain, View Transitions, a reload or only the content changing, and how long it took. */
async function transition(p, here, archived, cfg, dir, name) {
  const fs = require('fs');
  const links = await p.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.href, inNav: !!a.closest('header, nav, [role=navigation]') })));
  const href = pickLink(links, here, archived); if (!href) return { none: 'no link to another archived page' };
  const sel = await p.evaluate((h) => { const a = [...document.querySelectorAll('a[href]')].find((x) => x.href === h); if (!a) return null; a.setAttribute('data-educo-go', ''); return '[data-educo-go]'; }, href);
  if (!sel) return { none: 'link gone' };
  let reloaded = false; const onNav = (fr) => { if (fr === p.mainFrame()) reloaded = true; }; p.on('framenavigated', onNav);
  const COVER = () => [...document.querySelectorAll('body *')].filter((e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return (cs.position === 'fixed' || cs.position === 'absolute') && r.width >= innerWidth * 0.9 && r.height >= innerHeight * 0.9 && cs.visibility !== 'hidden' && +cs.opacity > 0.05 && e.tagName !== 'CANVAS'; }).slice(0, 3).map((e) => ({ tag: e.tagName.toLowerCase(), cls: (e.getAttribute('class') || '').slice(0, 80), opacity: getComputedStyle(e).opacity, transform: getComputedStyle(e).transform, clip: getComputedStyle(e).clipPath }));
  const t0 = Date.now(); const frames = [];
  await p.click(sel, { timeout: 3000, noWaitAfter: true }).catch(() => {});
  for (const at of cfg.frameTimesMs) {
    const wait = at - (Date.now() - t0); if (wait > 0) await p.waitForTimeout(wait);
    const buf = await p.screenshot({ type: 'jpeg', quality: 45 }).catch(() => null);
    const file = buf ? `media/${name}-transition-${at}ms.jpg` : null; if (buf) fs.writeFileSync(`${dir}/${file}`, buf);
    frames.push({ at, file, url: p.url(), cover: await p.evaluate(COVER).catch(() => 'navigating') });
  }
  await p.waitForLoadState('load', { timeout: cfg.settleMs }).catch(() => {}); p.off('framenavigated', onNav);
  const vt = await p.evaluate(() => (window.__educo || {}).vt || 0).catch(() => 0);
  return { from: here, to: href, arrivedAt: p.url(), kind: reloaded ? 'page load' : p.url() !== here ? 'content swap (no reload)' : 'none', ms: Date.now() - t0, viewTransitions: vt, frames };
}

module.exports = { styleDiff, distinct, CENSUS, states, flow, INIT, pickLink, canvases, transition };
