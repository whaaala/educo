// PAGE ANATOMY — everything a website is made of, measured once in a real browser so we never re-crawl for it:
// HTML5 semantics + ARIA landmarks, navigation / sidebars, components, motion, design system, breakpoints, units.
// `anatomy` runs INSIDE the page (page.evaluate). Pure DOM + CSSOM; no network.
function anatomy() {
  const vw = document.documentElement.clientWidth, vh = window.innerHeight;
  const all = Array.from(document.querySelectorAll('body *'));
  const visible = (e) => { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const rect = (e) => { const r = e.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
  const txt = (e, n = 40) => (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, n);
  const count = (sel) => document.querySelectorAll(sel).length;
  const pos = (e) => getComputedStyle(e).position;

  // ── 1. SEMANTICS ─────────────────────────────────────────────────────────────────────────────────────────────
  const TAGS = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article', 'figure', 'figcaption', 'details', 'summary', 'dialog', 'form', 'table', 'address', 'time', 'picture', 'video', 'audio', 'iframe', 'canvas', 'svg', 'button', 'input', 'select', 'textarea', 'label', 'fieldset', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'dl'];
  const semantics = Object.fromEntries(TAGS.map((t) => [t, count(t)]).filter(([, n]) => n));
  const ROLES = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'region', 'dialog', 'alertdialog', 'alert', 'status', 'tablist', 'tab', 'tabpanel', 'switch', 'checkbox', 'radio', 'slider', 'menu', 'menubar', 'menuitem', 'listbox', 'combobox', 'button', 'link', 'img', 'list', 'listitem', 'grid', 'progressbar', 'tooltip', 'feed', 'marquee'];
  const roles = Object.fromEntries(ROLES.map((r) => [r, count(`[role="${r}"]`)]).filter(([, n]) => n));
  // The landmark OUTLINE, top to bottom — the skeleton of the page.
  const landmarkSel = 'header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="search"]';
  const outline = Array.from(document.querySelectorAll(landmarkSel)).filter(visible)
    .filter((e) => !e.parentElement.closest(landmarkSel) || e.tagName === 'NAV')
    .map((e) => { const r = rect(e); return `${e.tagName.toLowerCase()}${e.getAttribute('role') ? '[' + e.getAttribute('role') + ']' : ''}${e.getAttribute('aria-label') ? '("' + e.getAttribute('aria-label').slice(0, 24) + '")' : ''} @${r.x},${r.y} ${r.w}x${r.h}${['sticky', 'fixed'].includes(pos(e)) ? ' [' + pos(e) + ']' : ''}`; }).slice(0, 25);
  const headings = Array.from(document.querySelectorAll('h1,h2,h3')).filter(visible).slice(0, 20).map((h) => `${h.tagName}:${txt(h, 50)}`);
  const lang = document.documentElement.lang || '';
  const skipLink = Array.from(document.querySelectorAll('a[href^="#"]')).some((a) => /skip/i.test(a.textContent || ''));

  // ── 2. NAVIGATION ────────────────────────────────────────────────────────────────────────────────────────────
  const navEls = Array.from(document.querySelectorAll('nav, [role="navigation"]'));
  const navs = navEls.map((n) => {
    const r = n.getBoundingClientRect(); const links = Array.from(n.querySelectorAll('a')).filter(visible);
    const ys = new Set(links.map((a) => Math.round(a.getBoundingClientRect().top / 8))); const xs = new Set(links.map((a) => Math.round(a.getBoundingClientRect().left / 8)));
    const where = r.top + scrollY < vh * 0.25 ? 'top' : r.top + scrollY > document.documentElement.scrollHeight - vh ? 'footer' : r.width < vw * 0.35 && r.height > vh * 0.5 ? (r.left < vw / 2 ? 'side-left' : 'side-right') : 'in-page';
    const dropdown = !!n.querySelector('ul ul, ol ol, [aria-haspopup], [aria-expanded]');
    const mega = Array.from(n.querySelectorAll('ul ul, [role="menu"], [class*="mega" i], [class*="dropdown" i]')).some((d) => d.querySelectorAll('a').length > 8);
    return { label: n.getAttribute('aria-label') || '', where, visible: visible(n), links: links.length, orientation: ys.size <= 2 && xs.size > 2 ? 'row' : xs.size <= 2 && ys.size > 2 ? 'column' : 'mixed', dropdown, mega, pinned: ['sticky', 'fixed'].includes(pos(n)) || !!n.closest('[style*="sticky"], header') && ['sticky', 'fixed'].includes(pos(n.closest('header') || n)), breadcrumb: /bread/i.test(n.getAttribute('aria-label') || n.className.toString()) };
  });
  // Hamburger: a visible button that controls hidden navigation (aria-expanded / aria-controls / menu-ish label).
  const hamburger = Array.from(document.querySelectorAll('button, [role="button"], a')).filter(visible)
    .some((b) => (b.hasAttribute('aria-expanded') || b.hasAttribute('aria-controls')) && /menu|nav|burger|toggle/i.test((b.getAttribute('aria-label') || '') + ' ' + b.className + ' ' + txt(b, 20)));
  const headerEl = document.querySelector('header, [role="banner"]');
  const header = headerEl ? { ...rect(headerEl), position: pos(headerEl), transparent: getComputedStyle(headerEl).backgroundColor.replace(/\s/g, '').endsWith(',0)') || getComputedStyle(headerEl).backgroundColor === 'transparent', rows: new Set(Array.from(headerEl.querySelectorAll('a, button')).filter(visible).map((a) => Math.round(a.getBoundingClientRect().top / 20))).size } : null;

  // ── 3. SIDEBARS ──────────────────────────────────────────────────────────────────────────────────────────────
  const sidebars = Array.from(document.querySelectorAll('aside, [role="complementary"], body *')).filter((e) => {
    if (!visible(e)) return false; const r = e.getBoundingClientRect();
    if (e.tagName === 'ASIDE' || e.getAttribute('role') === 'complementary') return true;
    return r.width > 120 && r.width < vw * 0.34 && r.height > vh * 1.2 && e.parentElement && getComputedStyle(e.parentElement).display.match(/flex|grid/) && e.parentElement.getBoundingClientRect().width > r.width * 2;
  }).slice(0, 6).map((e) => { const r = e.getBoundingClientRect(); return { tag: e.tagName.toLowerCase(), side: r.left + r.width / 2 < vw / 2 ? 'left' : 'right', widthPct: Math.round((r.width / vw) * 100), heightVh: +(r.height / vh).toFixed(1), sticky: ['sticky', 'fixed'].includes(pos(e)) || Array.from(e.querySelectorAll('*')).slice(0, 40).some((k) => pos(k) === 'sticky') }; });

  // ── 4. COMPONENTS ────────────────────────────────────────────────────────────────────────────────────────────
  const cls = (e) => (e.className && e.className.toString ? e.className.toString() : '');
  const byClass = (re) => all.filter((e) => re.test(cls(e))).length;
  // Cards: 3+ visible siblings of the same tag+size holding an image/heading and text.
  const cardGroups = []; const seen = new Set();
  for (const p of all) {
    const kids = Array.from(p.children).filter(visible); if (kids.length < 3 || seen.has(p)) continue;
    const sig = (k) => `${k.tagName}:${Math.round(k.getBoundingClientRect().width / 10)}`;
    const groups = {}; kids.forEach((k) => (groups[sig(k)] = groups[sig(k)] || []).push(k));
    const g = Object.values(groups).find((ks) => ks.length >= 3 && ks.every((k) => k.querySelector('img,picture,svg,h2,h3,h4') && (k.textContent || '').trim().length > 10));
    if (g) { seen.add(p); const r = g[0].getBoundingClientRect(); cardGroups.push({ n: g.length, widthPct: Math.round((r.width / vw) * 100), perRow: new Set(g.map((k) => Math.round(k.getBoundingClientRect().top / 10))).size ? Math.round(g.length / new Set(g.map((k) => Math.round(k.getBoundingClientRect().top / 10))).size) : 0, hasImage: !!g[0].querySelector('img,picture'), link: !!g[0].querySelector('a') || g[0].tagName === 'A' }); }
    if (cardGroups.length >= 10) break;
  }
  const components = {
    accordion: count('details') + all.filter((e) => e.hasAttribute('aria-expanded') && e.getAttribute('aria-controls') && !e.closest('nav')).length,
    tabs: count('[role="tablist"]'),
    carousel: count('[aria-roledescription="carousel"]') + byClass(/swiper|slick|splide|carousel|glide|embla|flickity|keen-slider/i) > 0 ? Math.max(1, count('[aria-roledescription="carousel"]')) : 0,
    dialog: count('dialog, [role="dialog"], [aria-modal="true"]'),
    switch: count('[role="switch"]') + all.filter((e) => e.tagName === 'INPUT' && e.type === 'checkbox' && /toggle|switch/i.test(cls(e) + cls(e.parentElement || e))).length,
    breadcrumb: count('[aria-label*="bread" i], [class*="breadcrumb" i]'),
    pagination: count('[aria-label*="pagination" i], [class*="pagination" i]'),
    badge: byClass(/\bbadge|\bpill|\btag\b|\bchip/i),
    table: count('table'),
    forms: Array.from(document.querySelectorAll('form')).map((f) => Array.from(f.querySelectorAll('input,select,textarea')).map((i) => i.type || i.tagName.toLowerCase()).join('+')).slice(0, 6),
    search: count('input[type="search"], [role="search"]'),
    video: count('video') + Array.from(document.querySelectorAll('iframe')).filter((f) => /youtube|vimeo|wistia/.test(f.src)).length,
    map: Array.from(document.querySelectorAll('iframe')).filter((f) => /maps|mapbox/.test(f.src)).length + byClass(/mapbox|leaflet|gm-style/i),
    marquee: byClass(/marquee|ticker/i),
    cookieBanner: all.filter((e) => /cookie|consent|gdpr/i.test(cls(e) + ' ' + (e.id || '')) && visible(e)).length > 0,
    backToTop: Array.from(document.querySelectorAll('a[href="#"], a[href="#top"], button')).some((b) => /top/i.test(b.getAttribute('aria-label') || txt(b, 15))),
    cards: cardGroups,
  };

  // ── 5. MOTION ────────────────────────────────────────────────────────────────────────────────────────────────
  const trans = {}; const anims = {};
  for (const e of all.slice(0, 4000)) {
    const cs = getComputedStyle(e);
    if (cs.transitionDuration && cs.transitionDuration !== '0s') { const k = `${cs.transitionProperty.split(',')[0]} ${cs.transitionDuration.split(',')[0]} ${cs.transitionTimingFunction.split(',')[0].replace(/cubic-bezier\(([^)]*)\)/, 'cb($1)')}`; trans[k] = (trans[k] || 0) + 1; }
    if (cs.animationName && cs.animationName !== 'none') anims[cs.animationName] = (anims[cs.animationName] || 0) + 1;
  }
  const keyframes = new Set(); let reducedMotion = false, containerQueries = 0, viewTransitions = false; const bps = new Set();
  const unitCount = { px: 0, rem: 0, em: 0, pct: 0, vw: 0, vh: 0, cqw: 0, clamp: 0 };
  const walkRules = (rules) => { for (const r of Array.from(rules || [])) {
    if (r.type === 7 || r.constructor.name === 'CSSKeyframesRule') keyframes.add(r.name);
    if (r.media && r.media.mediaText) { const m = r.media.mediaText; if (/prefers-reduced-motion/.test(m)) reducedMotion = true; (m.match(/(min|max)-width:\s*([\d.]+)(px|em|rem)/g) || []).forEach((x) => bps.add(x.replace(/\s/g, ''))); }
    if (r.constructor.name === 'CSSContainerRule') containerQueries++;
    if (r.style) { const t = r.style.cssText; unitCount.px += (t.match(/\d(px)/g) || []).length; unitCount.rem += (t.match(/\drem/g) || []).length; unitCount.em += (t.match(/\dem\b/g) || []).length; unitCount.pct += (t.match(/\d%/g) || []).length; unitCount.vw += (t.match(/\dvw/g) || []).length; unitCount.vh += (t.match(/\d[sdl]?vh/g) || []).length; unitCount.cqw += (t.match(/\dcq[iwhb]/g) || []).length; unitCount.clamp += (t.match(/clamp\(/g) || []).length; if (/view-transition-name/.test(t)) viewTransitions = true; }
    if (r.cssRules) walkRules(r.cssRules);
  } };
  for (const sh of Array.from(document.styleSheets)) { try { walkRules(sh.cssRules); } catch { /* cross-origin sheet */ } }
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => `${k} ×${v}`);
  const motion = {
    transitions: top(trans, 10), animations: top(anims, 10), keyframes: [...keyframes].slice(0, 20), reducedMotion, viewTransitions,
    smoothScroll: getComputedStyle(document.documentElement).scrollBehavior === 'smooth' || document.documentElement.classList.contains('lenis') || !!document.querySelector('[data-scroll-container]'),
    scrollSnap: all.some((e) => getComputedStyle(e).scrollSnapType !== 'none'),
    libs: ['gsap', 'ScrollTrigger', 'Lenis', 'lenis', 'LocomotiveScroll', 'THREE', 'Swiper', 'barba', 'Splitting', 'lottie', 'AOS', 'anime', 'Motion', 'Webflow', 'Framer'].filter((k) => k in window),
  };

  // ── 6. DESIGN SYSTEM ─────────────────────────────────────────────────────────────────────────────────────────
  const fonts = {}, sizes = {}, colours = {}, bgs = {}, radii = {}, spaces = {};
  for (const e of all.slice(0, 3000)) {
    if (!visible(e)) continue; const cs = getComputedStyle(e);
    if ((e.childNodes[0] && e.childNodes[0].nodeType === 3 && e.textContent.trim())) { const f = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(); fonts[f] = (fonts[f] || 0) + 1; sizes[cs.fontSize] = (sizes[cs.fontSize] || 0) + 1; colours[cs.color] = (colours[cs.color] || 0) + 1; }
    if (cs.backgroundColor && !cs.backgroundColor.endsWith(', 0)') && cs.backgroundColor !== 'transparent') bgs[cs.backgroundColor] = (bgs[cs.backgroundColor] || 0) + 1;
    if (cs.borderTopLeftRadius !== '0px') radii[cs.borderTopLeftRadius] = (radii[cs.borderTopLeftRadius] || 0) + 1;
    for (const p of [cs.paddingTop, cs.marginBottom, cs.rowGap]) if (p && p !== '0px' && p !== 'normal') spaces[p] = (spaces[p] || 0) + 1;
  }
  const design = {
    fonts: top(fonts, 5), typeScale: Object.keys(sizes).map(parseFloat).sort((a, b) => a - b).filter((v, i, a) => i === 0 || v - a[i - 1] > 0.5).map((v) => v + 'px'),
    textColours: top(colours, 8), backgrounds: top(bgs, 8), radii: top(radii, 6), spacing: top(spaces, 10),
    rootFontSize: getComputedStyle(document.documentElement).fontSize,
  };

  return {
    lang, skipLink, title: document.title.slice(0, 90), metaDescription: !!document.querySelector('meta[name="description"]'),
    semantics, roles, outline, headings, navs, hamburger, header, sidebars, components, motion, design,
    breakpoints: [...bps].sort(), units: unitCount, containerQueries,
  };
}
module.exports = { anatomy };
