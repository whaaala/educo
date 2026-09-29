// THE PAGE AUDIT — run inside the real Preview (the exported page) at one width. Every check comes from the stored
// research (docs/web-anatomy/: design-foundation rules, html-semantics, media-performance); the number in each message
// is the check's number in the research digest. `err` = the builder guarantees it (a failure is a builder bug);
// `warn` = it depends on what the user wrote (reported, not failed).
// Returns { err: string[], warn: string[], geo: { [id]: {l,w,t,h} } }.
function auditDoc(opts) {
  // W is the CONTENT width (what a block can use); MW is what a MEDIA QUERY sees (the window, scrollbar included — CSS
  // `(min-width)` is evaluated on it). The rung a page is drawn at is decided by MW: at a 616px window with a 17px
  // scrollbar the content is 599px and the page is, correctly, on the TABLET rung.
  const W = document.documentElement.clientWidth; const MW = window.innerWidth; const err = []; const warn = [];
  // Measured from the top — a stuck header overlaps whatever the previous size left scrolled under it.
  window.scrollTo(0, 0);
  const px = (v) => parseFloat(v) || 0;
  const visible = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const blocks = Array.from(document.querySelectorAll('[class*="bx-"]')).filter(visible);
  const idOf = (e) => (Array.from(e.classList).find((c) => c.startsWith('bx-')) || '').slice(3);
  /** One offending element, described so the finding points at something: tag, its block, size, font, a few words. */
  const ex = (e, extra = '') => { const b = e.closest('[class*="bx-"]'); const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
    return `<${e.tagName.toLowerCase()} in ${b ? idOf(b).slice(-4) : '?'} ${Math.round(r.width)}×${Math.round(r.height)} ${cs.fontSize} "${(e.textContent || '').trim().slice(0, 24)}"${extra}>`; };
  const geo = {}; const br = document.body.getBoundingClientRect();
  for (const e of blocks) { const r = e.getBoundingClientRect(); geo[idOf(e)] = { l: ((r.left - br.left) / br.width) * 100, w: (r.width / br.width) * 100, t: r.top + scrollY, h: r.height, vh: !!e.closest('[style*="svh"], [style*="vh"]') }; }

  // ── LAYOUT ──
  const ov = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  if (ov > 1) err.push(`L1 page scrolls sideways by ${ov}px`);
  for (const m of document.querySelectorAll('img, video, iframe, svg')) {
    if (!visible(m) || !m.parentElement) continue; const r = m.getBoundingClientRect(); const p = m.parentElement.getBoundingClientRect();
    const inBlock = m.closest('[class*="bx-"]'); const bid = inBlock ? idOf(inBlock).slice(-4) : '?';
    if (r.width > p.width + 1) err.push(`L2 ${m.tagName.toLowerCase()} wider than its box (${Math.round(r.width)} > ${Math.round(p.width)}) in ${bid}`);
    // THE LINE'S ONE PIXEL OF SLACK IS NOT "OFF THE PAGE" (decision 1D): the last column of a line that holds a hand-sized
    // column lends 0.0625rem at its end — 1px, 1.5px at 150% text — so a picture filling that column ends that far past the
    // row, plus the half pixel a share rounds to. Measured on the 12 pages that reported it: 1–2px, every one, and the
    // page does not scroll sideways on any of them (L1). Anything further is still an error.
    if (r.right > W + parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 + 0.5) err.push(`L2 ${m.tagName.toLowerCase()} runs off the page — ${Math.round(r.width)}px wide at x=${Math.round(r.left)} in ${bid} (block ${Math.round(inBlock ? inBlock.getBoundingClientRect().width : 0)}px)`);
  }
  // overlaps between blocks that are neither nested nor floating
  // …and nothing INSIDE a pinned block either: a sticky header's band carries the pin (`bandCarriesPin`), so the header
  // block itself is `static` — but it moves with the band, and overlapping the page it scrolled over is what a pin does.
  const pinned = (e) => { for (let x = e; x && x !== document.body; x = x.parentElement) if (['absolute', 'fixed', 'sticky'].includes(getComputedStyle(x).position)) return true; return false; };
  const flow = blocks.filter((e) => !pinned(e));
  const rects = flow.map((e) => [e, e.getBoundingClientRect()]);
  let overlaps = 0; const ovEx = [];
  for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
    const [a, ra] = rects[i], [b, rb] = rects[j]; if (a.contains(b) || b.contains(a)) continue;
    const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left), oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
    if (ox > 2 && oy > 2) { overlaps++; if (ovEx.length < 3) ovEx.push(`${idOf(a).slice(-4)}×${idOf(b).slice(-4)}`); }
  }
  if (overlaps) err.push(`L3 ${overlaps} overlapping blocks (${ovEx.join(' ')})`);
  // content spilling out of its block (text or a child wider/taller than the block that holds it, with no clip)
  let spill = 0; const spEx = [];
  for (const e of flow) { const cs = getComputedStyle(e); if (cs.overflow !== 'visible') continue; const r = e.getBoundingClientRect();
    for (const k of e.children) { if (!visible(k) || ['absolute', 'fixed'].includes(getComputedStyle(k).position)) continue; const q = k.getBoundingClientRect(); if (q.right > r.right + 2 || q.left < r.left - 2) { spill++; if (spEx.length < 3) spEx.push(`${idOf(e).slice(-4)} ${Math.round(r.width)}px holds ${k.tagName.toLowerCase()}${k.className.includes('bx-') ? ' ' + idOf(k).slice(-4) : ''} ${Math.round(q.width)}px`); break; } } }
  if (spill) err.push(`L4 ${spill} blocks whose content spills out sideways (${spEx.join(' ')})`);
  // rows: on a phone nothing sits side by side narrower than a readable column; on a tablet no line holds more than three (#78)
  const rows = flow.filter((e) => getComputedStyle(e).flexDirection === 'row' && getComputedStyle(e).display.includes('flex'));
  for (const row of rows) {
    const kids = Array.from(row.children).filter((k) => k.className.includes('bx-') && visible(k) && !['absolute', 'fixed', 'sticky'].includes(getComputedStyle(k).position)); // a sticky aside is pinned, not wrapped
    if (kids.length < 2) continue; const lines = {};
    kids.forEach((k) => { const t = Math.round(k.getBoundingClientRect().top); const key = Object.keys(lines).find((x) => Math.abs(x - t) <= 2) ?? t; (lines[key] = lines[key] || []).push(k); });
    for (const ks of Object.values(lines)) {
      const containers = ks.filter((k) => k.querySelector('[class*="bx-"]'));
      if (MW < 600 && containers.length > 1 && Math.min(...containers.map((k) => k.getBoundingClientRect().width)) < 150) err.push(`L5 phone: ${containers.length} columns squeezed side by side in ${idOf(row).slice(-4)} (${containers.map((k) => Math.round(k.getBoundingClientRect().width)).join('/')}px)`);
      if (MW >= 600 && MW < 900 && opts.rowBands && row.children.length >= 4 && ks.length > 3 && containers.length === ks.length) err.push(`L6 tablet: ${ks.length} columns on one line in ${idOf(row).slice(-4)} (at most 3, #78)`);
    }
  }
  // collapsed: a block with content that has no size
  // `innerText`, not `textContent`: a band whose only child is hidden on this device (a phone-only "☰ Menu") has words in
  // the DOM and nothing on screen — it is empty here, not collapsed.
  // …and `checkVisibility`, because inside a hidden ANCESTOR an element is not rendered at all: its own display is still
  // "flex" and `innerText` then falls back to `textContent` — the menu's inner band read as "collapsed" on every phone size.
  for (const e of Array.from(document.querySelectorAll('[class*="bx-"]'))) { const r = e.getBoundingClientRect(); if ((e.checkVisibility ? e.checkVisibility() : getComputedStyle(e).display !== 'none') && e.innerText.trim() && (r.width < 2 || r.height < 2)) { err.push(`L7 a block with content collapsed to ${Math.round(r.width)}×${Math.round(r.height)} (${idOf(e).slice(-4)})`); break; } }

  // WORDS BROKEN ACROSS LINES (#102): a word is one Range; if it lands on two lines, the box was narrower than the word.
  let broken = 0; const brEx = [];
  for (const e of Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, a, span')).filter(visible)) {
    for (const n of e.childNodes) {
      if (n.nodeType !== 3) continue; const t = n.textContent; const re = /\S{4,}/g; let m;
      while ((m = re.exec(t))) { const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length); const tops = new Set(Array.from(r.getClientRects()).map((q) => Math.round(q.top))); if (tops.size > 1) { broken++; if (brEx.length < 3) brEx.push(`"${m[0]}" in ${idOf(e.closest('[class*="bx-"]') || e).slice(-4)} ${Math.round(e.getBoundingClientRect().width)}px`); } }
    }
  }
  if (broken) err.push(`L8 ${broken} words broken across lines — ${brEx.join(' ')}`);

  // ── TYPOGRAPHY ──
  const texts = Array.from(document.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, a, button, span, blockquote')).filter((e) => visible(e) && Array.from(e.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim()));
  const body = texts.filter((e) => /^(P|LI|BLOCKQUOTE)$/.test(e.tagName));
  const small = body.filter((e) => px(getComputedStyle(e).fontSize) < 15.5);
  if (small.length) err.push(`T9 ${small.length} paragraphs below 16px — ${small.slice(0, 3).map((e) => ex(e)).join(' ')}`);
  const thin = texts.filter((e) => +getComputedStyle(e).fontWeight < 400);
  if (thin.length) err.push(`T12 ${thin.length} text elements lighter than 400`);
  const long = body.filter((e) => { const cs = getComputedStyle(e); const cw = e.getBoundingClientRect().width - px(cs.paddingLeft) - px(cs.paddingRight); return cw / (px(cs.fontSize) * 0.5) > 80; });
  if (long.length) err.push(`T13 ${long.length} paragraphs longer than ~75 characters a line (${Math.round(long[0].getBoundingClientRect().width)}px wide at ${Math.round(px(getComputedStyle(long[0]).fontSize))}px)`);
  const lhBad = body.filter((e) => { const cs = getComputedStyle(e); const r = px(cs.lineHeight) / px(cs.fontSize); return cs.lineHeight !== 'normal' && (r < 1.45 || r > 2.05); });
  if (lhBad.length) err.push(`T14 ${lhBad.length} paragraphs with line-height outside 1.5–2 (${(px(getComputedStyle(lhBad[0]).lineHeight) / px(getComputedStyle(lhBad[0]).fontSize)).toFixed(2)})`);
  if (texts.some((e) => getComputedStyle(e).textAlign === 'justify')) err.push('T15 justified text');
  const fams = new Set(texts.map((e) => getComputedStyle(e).fontFamily.split(',')[0].trim().replace(/["']/g, '')));
  if (fams.size > 2) warn.push(`T17 ${fams.size} typefaces (${[...fams].join(', ')})`);
  const sizes = new Set(texts.map((e) => Math.round(px(getComputedStyle(e).fontSize))));
  if (sizes.size > 10) warn.push(`T18 ${sizes.size} distinct font sizes`);

  // ── HIERARCHY ──
  const hs = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).filter(visible);
  // The body size a heading is held against is the COMMON paragraph size, not the largest: a lead paragraph or a pull
  // quote is allowed to be bigger than a card's title, and measuring against the max called every card title on a page
  // "smaller than the body text" the moment one lead paragraph existed.
  const bodyPx = (() => { if (!body.length) return 16; const n = {}; for (const e of body) { const s = Math.round(px(getComputedStyle(e).fontSize)); n[s] = (n[s] || 0) + 1; } return +Object.entries(n).sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0]; })();
  const lvl = (h) => +h.tagName[1];
  for (let i = 0; i < hs.length; i++) for (let j = 0; j < hs.length; j++) if (lvl(hs[i]) < lvl(hs[j]) && px(getComputedStyle(hs[i]).fontSize) + 0.5 < px(getComputedStyle(hs[j]).fontSize)) { err.push(`H26 an h${lvl(hs[i])} (${Math.round(px(getComputedStyle(hs[i]).fontSize))}px) is smaller than an h${lvl(hs[j])} (${Math.round(px(getComputedStyle(hs[j]).fontSize))}px)`); i = hs.length; break; }
  // A heading is held against the body text AROUND it — the paragraphs of the nearest block that holds any — not against a
  // paragraph elsewhere on the page: a card's title (19px) beside its own 16px description is right, even when a lead
  // paragraph in a wide band reads 22px. Only a heading with no paragraphs anywhere near it falls back to the page's size.
  const localBody = (h) => { for (let x = h.parentElement; x; x = x.parentElement) { const ps = Array.from(x.querySelectorAll('p, li, blockquote')).filter((e) => visible(e) && e !== h && (e.textContent || '').trim()); if (ps.length) { const n = {}; for (const e of ps) { const s = Math.round(px(getComputedStyle(e).fontSize)); n[s] = (n[s] || 0) + 1; } return +Object.entries(n).sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0]; } } return bodyPx; };
  const tinyH = hs.filter((h) => px(getComputedStyle(h).fontSize) < localBody(h) - 0.5);
  if (tinyH.length) err.push(`H26 ${tinyH.length} headings smaller than the body text around them — ${tinyH.slice(0, 3).map((e) => ex(e, ` vs ${Math.round(localBody(e))}px body`)).join(' ')}`);
  const h1 = hs.find((h) => h.tagName === 'H1');
  if (h1 && W >= 1024 && px(getComputedStyle(h1).fontSize) < 40) warn.push(`H11 the h1 is ${Math.round(px(getComputedStyle(h1).fontSize))}px at ${W}px (the rules ask for ≥50)`);

  // ── COLOUR / CONTRAST ──
  // ANY CSS colour → sRGB by painting it into one pixel and reading it back. The theme tokens are OKLCH; reading the
  // digits of "oklch(0.97 0.01 250)" as if they were r, g, b made this check report contrast that was not there.
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true });
  const rgbOf = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return { r: d[0], g: d[1], b: d[2], a: d[3] }; };
  const lum = (c) => { const { r, g, b } = rgbOf(c); return [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0); };
  const bgOf = (e) => { for (let x = e; x; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.backgroundImage !== 'none') return null; if (cs.backgroundColor && rgbOf(cs.backgroundColor).a > 242) return cs.backgroundColor; } return getComputedStyle(document.body).backgroundColor && rgbOf(getComputedStyle(document.body).backgroundColor).a > 242 ? getComputedStyle(document.body).backgroundColor : 'rgb(255,255,255)'; };
  let lowC = 0; const lowEx = [];
  for (const e of texts) { const rr = e.getBoundingClientRect(); if (rr.right <= 0 || rr.left >= W) continue; // parked off-screen (the skip link until focused): nobody reads it there
    const bg = bgOf(e); if (!bg) continue; const a = lum(getComputedStyle(e).color), b = lum(bg); if (a == null || b == null) continue; const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); const large = px(getComputedStyle(e).fontSize) >= 24 || (px(getComputedStyle(e).fontSize) >= 18.6 && +getComputedStyle(e).fontWeight >= 700); if (ratio < (large ? 3 : 4.5)) { lowC++; if (lowEx.length < 3) lowEx.push(ex(e, ` ${ratio.toFixed(2)}:1 ${getComputedStyle(e).color} on ${bg}`)); } }
  if (lowC) err.push(`C29 ${lowC} text elements below WCAG contrast — ${lowEx.join(' ')}`);

  // ── SEMANTICS (viewport-independent: the caller runs these once) ──
  if (opts.semantics) {
    const mains = document.querySelectorAll('main:not([hidden])'); if (mains.length !== 1) err.push(`S34 ${mains.length} <main> landmarks (want exactly 1)`);
    const top = (sel) => Array.from(document.querySelectorAll(sel)).filter((e) => !e.parentElement.closest('article,aside,main,nav,section')).length;
    if (top('header') > 1) err.push(`S35 ${top('header')} page-level <header>s`); if (top('footer') > 1) err.push(`S35 ${top('footer')} page-level <footer>s`);
    const h1s = document.querySelectorAll('h1').length; if (h1s !== 1) err.push(`S36 ${h1s} <h1> (want exactly 1)`);
    const all = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')); for (let i = 1; i < all.length; i++) if (lvl(all[i]) > lvl(all[i - 1]) + 1) { err.push(`S37 heading level skipped: h${lvl(all[i - 1])} → h${lvl(all[i])}`); break; }
    const empty = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6,a,button')).filter((e) => !e.textContent.trim() && !e.getAttribute('aria-label') && !e.getAttribute('aria-labelledby') && !e.querySelector('img[alt]:not([alt=""])'));
    if (empty.length) err.push(`S38 ${empty.length} empty ${[...new Set(empty.map((e) => e.tagName.toLowerCase()))].join('/')}`);
    const noAlt = document.querySelectorAll('img:not([alt])').length; if (noAlt) err.push(`S39 ${noAlt} images with no alt`);
    const unsized = Array.from(document.querySelectorAll('img')).filter((i) => !(i.hasAttribute('width') && i.hasAttribute('height')) && getComputedStyle(i).aspectRatio === 'auto' && getComputedStyle(i.parentElement).aspectRatio === 'auto').length;
    if (unsized) warn.push(`S40 ${unsized} images without width/height or aspect-ratio (layout shift)`);
    if (!document.documentElement.getAttribute('lang')) err.push('S42 no <html lang>');
    if (!document.title.trim()) err.push('S43 no <title>');
    const ids = Array.from(document.querySelectorAll('[id]')).map((e) => e.id); if (new Set(ids).size !== ids.length) err.push('S51 duplicate ids');
    const noName = Array.from(document.querySelectorAll('section')).filter((s) => !s.querySelector('h1,h2,h3,h4,h5,h6') && !s.getAttribute('aria-label') && !s.getAttribute('aria-labelledby')).length;
    if (noName) err.push(`S46 ${noName} <section>s with no heading or name`);
    const focusable = document.querySelector('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    // The link's target is INSIDE the automatic <main> (a focusable `<span id="main">` at its start — a `display:contents`
    // main has no box to focus), or it is an explicit <main id="main"> itself. Both land the reader in the main content.
    const main = document.querySelector('main'); const href = focusable?.getAttribute('href') || '';
    const target = href.startsWith('#') ? document.getElementById(href.slice(1)) : null;
    if (!focusable || !main || !target || !(target === main || main.contains(target))) err.push('S44 the first thing focusable is not a skip link to <main>');
    if (document.querySelector('font, center, marquee, blink, big, tt, frame, frameset')) err.push('S52 an obsolete element');
    const lcp = Array.from(document.querySelectorAll('img[fetchpriority="high"]')).length; if (lcp > 1) err.push(`S41 ${lcp} images marked fetchpriority=high`);
  }
  return { err, warn, geo, height: document.documentElement.scrollHeight };
}

/** Rule 16: widths/gaps in %, everything else rem/em — a pixel is allowed only as a 1px hairline (or 0). */
function pixelFindings(html) {
  const css = (html.match(/<style[^>]*>([\s\S]*?)<\/style>/g) || []).join('\n') + '\n' + (html.match(/style="[^"]*"/g) || []).join('\n');
  const found = {}; const re = /([a-z-]+)\s*:\s*[^;{}"]*?(-?\d*\.?\d+)px/gi; let m;
  while ((m = re.exec(css))) { const v = Math.abs(parseFloat(m[2])); if (v === 0 || v === 1) continue; const k = `${m[1]}:${m[2]}px`; found[k] = (found[k] || 0) + 1; }
  return Object.entries(found).sort((a, b) => b[1] - a[1]);
}

/** On the CANVAS at one device preset: every row band's lines — holes, overflow, gaps (h.js rowProblems), and a canvas that scrolls sideways. */
async function canvasAudit(page) {
  return page.evaluate(() => {
    const out = []; const root = document.querySelector('[data-box-id]'); if (!root) return ['no canvas'];
    const Z = root.currentCSSZoom || 1;
    const rows = Array.from(document.querySelectorAll('[data-box-id]')).filter((e) => getComputedStyle(e).flexDirection === 'row' && getComputedStyle(e).display.includes('flex'));
    for (const row of rows) {
      const cs = getComputedStyle(row); const r = row.getBoundingClientRect();
      // A rect is measured in SCREEN px (the canvas is zoomed to fit, "Fitted to screen · 82%") while a computed padding is
      // LAYOUT px — so the padding is scaled by the zoom before the two are put in one sum. Unscaled, a 96px contained-band
      // inset at 82% read as a line running 17px "into its padding" (and 158px at 55%), on the canvas only, on every page.
      const padR = parseFloat(cs.paddingRight) * Z;
      // …and not a STICKY child either: "Sticks when reached" moves the aside's rect down the page as it scrolls, so it read as a
      // second LINE under the main column and the main column's free space as a HOLE the aside's exact width — at every
      // preset, on every page with a sticky sidebar (tier 80 and 95). It has not wrapped; it is pinned by design.
      const kids = Array.from(row.children).filter((k) => k.hasAttribute('data-box-id') && !['absolute', 'fixed', 'sticky'].includes(getComputedStyle(k).position) && k.getBoundingClientRect().width > 0);
      const lines = {}; kids.forEach((k) => { const t = Math.round(k.getBoundingClientRect().top); const key = Object.keys(lines).find((x) => Math.abs(x - t) <= 2) ?? t; (lines[key] = lines[key] || []).push(k); });
      for (const ks of Object.values(lines)) { const right = Math.max(...ks.map((k) => k.getBoundingClientRect().right)); const edge = r.right - padR; if (right > edge + 2) out.push(`a line of ${row.getAttribute('data-box-id').slice(-4)} runs ${Math.round(right - edge)}px past its row's content edge${right <= r.right ? ' (into its padding)' : ''}`); }
      const tops = Object.keys(lines).map(Number).sort((a, b) => a - b);
      for (let i = 0; i + 1 < tops.length; i++) { const ks = lines[tops[i]]; const free = (r.right - padR) - Math.max(...ks.map((k) => k.getBoundingClientRect().right)); const next = lines[tops[i + 1]][0]; const nextW = next.getBoundingClientRect().width; const gap = (parseFloat(cs.columnGap) || 0) * Z;
        // A block floored at its longest word (`min-width: min-content` — sized by hand, or on a line of four or more) needs the
        // width it is DRAWN at, not 14rem: with the 14rem assumption a 300px column waiting under 230px of free space read as a
        // hole, and it could never have fitted. Only a 14rem-floored block may be assumed to shrink to 14rem.
        const needs = getComputedStyle(next).minWidth === 'min-content' ? nextW : Math.min(nextW, 224 * Z);
        if (free >= needs + gap + 2 && free > 40) out.push(`HOLE ${Math.round(free / Z)}px at the end of a line of ${row.getAttribute('data-box-id').slice(-4)} while a block waits below`); }
    }
    const sc = document.scrollingElement; if (sc.scrollWidth - sc.clientWidth > 1) out.push(`the editor scrolls sideways by ${sc.scrollWidth - sc.clientWidth}px`);
    const collapsed = Array.from(document.querySelectorAll('[data-box-id]')).filter((e) => { const r = e.getBoundingClientRect(); return e.textContent.trim() && (r.width < 2 || r.height < 2) && getComputedStyle(e).display !== 'none'; }).length;
    if (collapsed) out.push(`${collapsed} blocks with content collapsed to nothing`);
    return out;
  });
}

module.exports = { auditDoc, pixelFindings, canvasAudit };
