// A DRESSED, REAL PAGE — built through the UI (RULE Y), following the deck's section components (RULE C) and the HTML
// semantics research: a header with a menu (and a phone-only "☰ Menu" placeholder), a hero, the BODY taken from a real
// crawled page of the same type (layout-grammar.js) with each section given a ROLE and real components, an optional
// sidebar, a call-to-action band and a footer — landmarks set through the Inspector's "Meaning" control, alternating band
// colours, edge-to-edge and centred sections. Missing components are PLACEHOLDERS from docs/COMPONENT_GAPS.md.
const path = require('path');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const { Builder } = require('./build-page.js');

const COPY = {
  school: 'Hillside School',
  nav: ['About', 'Admissions', 'News', 'Contact'],
  hero: ['A school where every child is known', 'Small classes, big ambitions — and a timetable built around curiosity from the very first week.'],
  cta: ['Come and see us', 'Open mornings run every Tuesday in term time. Book a place in two minutes.'],
  foot: [['Visit', ['Term dates', 'Open mornings', 'Find us']], ['Learning', ['Curriculum', 'Clubs', 'Library']], ['Families', ['Letters home', 'Uniform', 'Lunch menu']], ['Contact', ['Office', 'Admissions', 'Careers']]],
};
const SECTION_TITLES = ['What we offer', 'Life at Hillside', 'Our results', 'From the classroom', 'Meet the team', 'Dates for your diary', 'How to apply'];
const TINT = { Light: '#eef2ff', Dark: '#1f2937', Midnight: '#0f1f3d', 'Purple Dream': '#2e1065' };
const INK = { Light: '#1e3a8a', Dark: '#111827', Midnight: '#020617', 'Purple Dream': '#3b0764' };

/** A photo into every empty image, the way a person uploads. */
const photos = (page) => H.fillImages(page);

async function addHeroTile(page, afterId, kind) {
  const before = await P.ids(page);
  const files = ['landscape', 'wide', 'portrait'].map((n) => path.join(__dirname, 'img', `${n}.jpg`));
  page.__step = `addHero(${kind})`;
  let picked = false;
  for (let attempt = 0; attempt < 2 && !picked; attempt++) {
    if (attempt) { page.__heroRetries = (page.__heroRetries || 0) + 1; await page.keyboard.press('Escape'); await page.waitForTimeout(400); }
    await H.panel(page, false); await H.select(page, afterId); await H.panel(page, true);
    const tile = page.locator('[draggable="true"]').filter({ hasText: new RegExp('^\\s*' + kind) }).first();
    await tile.scrollIntoViewIfNeeded(); await tile.click();
    // the photo drop-zone ("Choose photos — You can pick many at once"), NOT the disabled "Choose photos first" button
    const zone = page.getByRole('button', { name: /^\s*(Choose photos|Add more photos)\s*You can pick/ }).first();
    if (!(await zone.waitFor({ state: 'visible', timeout: 4000 }).then(() => true).catch(() => false))) continue;
    await page.waitForTimeout(300);
    const fc = await Promise.all([page.waitForEvent('filechooser', { timeout: 4000 }), zone.click()]).then(([f]) => f).catch(() => null);
    if (!fc) { await page.screenshot({ path: path.join(__dirname, 'hero-no-chooser.png') }); continue; }
    await fc.setFiles(files); picked = true;
  }
  if (!picked) throw new Error(`the ${kind} photo picker never opened (twice) — see hero-no-chooser.png`);
  await page.waitForTimeout(1200);
  // …and "Add hero" only once the photos have loaded and it is ENABLED — a person waits for it to light up
  // EXACT name: "starts with Add hero" also matched the palette tile ("Add Hero — drag onto the page…"), and clicking
  // the tile closed the popover instead of adding the hero.
  // "Add hero" for one photo, "Add hero of 3" for a rotating one (GallerySetupMenu MODE_COPY) — an exact "Add rotating hero"
  // matched nothing, so both carousel pages of the sweep "never became available" (#124).
  const add = page.getByRole('button', { name: /^Add hero( of \d+)?$/ }).first();
  // Three photographs are downscaled in the browser before the button lights up — under six windows at once that took
  // longer than the 10s first allowed (a sweep page failed on "never became available"); a person simply waits.
  for (let k = 0; k < 120 && !(await add.isEnabled().catch(() => false)); k++) await page.waitForTimeout(250);
  if (!(await add.isEnabled().catch(() => false))) throw new Error(`"Add ${kind.toLowerCase()}" never became available after choosing photos`);
  await add.click(); await page.waitForTimeout(1200);
  return (await P.newestLeaf(page, before)).id;
}

class Dresser {
  constructor(page, recipe, log = () => {}) { this.page = page; this.r = recipe; this.log = log; this.placeholders = new Set(); this.sections = []; }
  get t() { return this.r.theme; }
  async words(id, text) { return I.text(this.page, id, text); }
  async band(id, { bg, width } = {}) {
    if (width) await I.contentWidth(this.page, id, width);
    if (bg) await I.background(this.page, id, bg);
  }

  // ── HEADER · navigation (deck C1) ──
  async header() {
    const p = this.page;
    const hdr = await P.first(p, 'Stack');
    const logo = await P.into(p, hdr, 'Heading');
    const cta = await P.beside(p, logo, 'Button');
    const menuBtn = this.r.hamburger ? await P.beside(p, logo, 'Button') : null;      // lands between logo and cta
    const nav = await P.beside(p, logo, 'Stack');                                      // …and the menu right after the logo
    // A MENU IS A LIST OF LINKS (user, 2026-09-27): <nav> (Meaning: Menu) › <ul> (Meaning: List) › a Link per item.
    const list = await P.into(p, nav, 'Stack');
    let b = await P.into(p, list, 'Link'); const links = [b];
    for (let i = 1; i < COPY.nav.length; i++) { b = await P.beside(p, b, 'Link'); links.push(b); }
    this.placeholders.add('Navigation component (menu built from Links; no dropdowns or overlay yet)');
    await H.panel(p, false);
    await this.words(logo, COPY.school); await this.words(cta, 'Apply now');
    for (let i = 0; i < links.length; i++) await this.words(links[i], COPY.nav[i]);
    await I.meaning(p, hdr, 'Page header'); await I.meaning(p, nav, 'Menu'); await I.meaning(p, list, 'List');
    for (const l of links) await I.textToggle(p, l, 'Underline', false); // a menu's links are told apart by place, not underline
    // The menu HUGS its links, as a person sizes a real header: dropped beside the logo it arrived at 70.5% of the band,
    // and logo + 70.5% + "Apply now" is wider than a tablet (202 + 541 + 111 > 768, measured) — so the button wrapped
    // onto a second line at 768px (#101). That is the row doing what it is told; the page was the thing to correct.
    await I.widthMode(p, nav, 'Fit');
    if (this.r.header === 'sticky') await I.sticky(p, hdr);
    if (this.r.header === 'two-rows') {
      const sub = await P.tileAfter(p, hdr, 'Stack'); const sl = await P.into(p, sub, 'Stack');
      let s = await P.into(p, sl, 'Link'); const subs = [s];
      for (let i = 0; i < 2; i++) { s = await P.beside(p, s, 'Link'); subs.push(s); }
      await H.panel(p, false); for (const [i, id] of subs.entries()) { await this.words(id, ['Term dates', 'Letters home', 'Lunch menu'][i]); await I.textToggle(p, id, 'Underline', false); }
      await I.meaning(p, sub, 'Menu'); await I.meaning(p, sl, 'List'); this.last = sub;
    } else this.last = hdr;
    if (menuBtn) {
      await this.words(menuBtn, '☰ Menu'); this.placeholders.add('Hamburger / overlay menu');
      await I.phoneOnly(p, nav, { hideOnPhone: true }); await I.phoneOnly(p, menuBtn, { onlyOnPhone: true });
    }
    await H.panel(p, true);
    this.sections.push({ role: 'header', id: hdr });
  }

  // ── HERO (deck C2) ──
  async hero() {
    const p = this.page; const kind = this.r.hero; if (kind === 'none') return;
    let id;
    if (kind === 'photo' || kind === 'carousel') {
      id = await addHeroTile(p, this.last, kind === 'photo' ? 'Hero' : 'Rotating hero');
      if (kind === 'carousel') this.placeholders.add('Carousel (Rotating hero stands in)');
    } else {
      id = await P.tileAfter(p, this.last, 'Stack');
      if (kind === 'split') {
        const text = await P.into(p, id, 'Stack'); const img = await P.beside(p, text, 'Image');
        const h = await P.into(p, text, 'Heading'); const t = await P.under(p, h, 'Text'); const b1 = await P.under(p, t, 'Button'); const b2 = await P.beside(p, b1, 'Button');
        await H.panel(p, false); await this.words(h, COPY.hero[0]); await this.words(t, COPY.hero[1]); await this.words(b1, 'Book a visit'); await this.words(b2, 'Prospectus');
        await new Builder(p).sizeColumns([text, img], [55, 45]); await H.panel(p, false);
        await this.band(id, { bg: TINT[this.t], width: 'Edge to edge' });
        await I.textSize(p, h, 48); // the page title is the biggest words on the page — in a 55% column its default size fell under the section headings (Rule #7)
      } else { // banner — a coloured band, words centred in a measured column
        const h = await P.into(p, id, 'Heading'); const t = await P.under(p, h, 'Text'); const b1 = await P.under(p, t, 'Button');
        await H.panel(p, false); await this.words(h, COPY.hero[0]); await this.words(t, COPY.hero[1]); await this.words(b1, 'Book a visit');
        await this.band(id, { bg: INK[this.t], width: 'Centred column' });
        await I.textSize(p, h, 48);
      }
      await H.panel(p, true);
    }
    this.sections.push({ role: 'hero', id }); this.last = id;
  }

  // ── BODY — a real crawled page's sections, each dressed for its role ──
  async body(host) {
    const p = this.page; const b = new Builder(p, this.log); const ids = [];
    b.dress = true;
    for (const [i, s] of this.r.body.entries()) {
      let sec;
      if (host) { sec = i === 0 ? await P.into(p, host, 'Stack') : await b.addLine(host, 'Stack', ids[i - 1]); }
      else sec = await P.tileAfter(p, this.last, 'Stack');
      ids.push(sec); this.last = host ? this.last : sec;
      // EVERY SECTION OPENS WITH A HEADING (deck: a section component is titled; HTML: a <section> needs a heading or a
      // name). A crawled section that starts with a row of cards would otherwise have none — and on a page with no hero
      // the first card's title was published as the page's <h1> (#118). The words fit the page type.
      let after = null;
      if (!(s.tree.kind === 'stack' && s.tree.parts[0]?.kind === 'leaf')) {
        after = await b.addLine(sec, 'Heading', null);
        await H.panel(p, false); await this.words(after, SECTION_TITLES[(i + this.r.type.length) % SECTION_TITLES.length]); await H.panel(p, true);
      }
      const lastLine = await b.fill(s.tree, sec, { firstInSection: !after, sectionIndex: i + 1, dress: true }, after);
      // NO HERO: the first section's heading IS the page title, and a title is the biggest words on the page (Rule #7,
      // visual hierarchy) — a person sizes it up. Measured: left at the section size, the h1 read 24px under 31px h2s.
      if (i === 0 && this.r.hero === 'none') {
        // The heading BLOCK itself — the block the heading element sits in — never the band around it: a band is
        // scaffolding and cannot be selected (page 13 failed on exactly that, twice).
        const title = after ?? await p.evaluate((id) => document.querySelector(`[data-box-id="${id}"] h1, [data-box-id="${id}"] h2, [data-box-id="${id}"] h3`)?.closest('[data-box-id]')?.getAttribute('data-box-id') ?? null, sec);
        if (title) { await H.panel(p, false); await I.textSize(p, title, 44); await H.panel(p, true); }
      }
      void lastLine;
      if (!host) {
        await H.panel(p, false);
        await this.band(sec, { bg: i % 2 ? TINT[this.t] : undefined, width: s.width === 'full' ? 'Edge to edge' : 'Centred column' });
        await I.meaning(p, sec, 'Section'); await H.panel(p, true);
      }
      this.sections.push({ role: 'body', id: sec, structure: s.tree.kind });
    }
    return ids;
  }

  // ── TYPE-SPECIFIC placeholder sections (components the builder does not have yet) ──
  async typeSection() {
    const p = this.page; const type = this.r.type; let id = null;
    const after = async () => (id = await P.tileAfter(p, this.last, 'Stack'));
    if (type === 'contact' || type === 'admissions' || type === 'booking') {
      await after(); const h = await P.into(p, id, 'Heading'); const f = await P.under(p, h, 'Stack');
      let x = await P.into(p, f, 'Text'); for (let i = 0; i < 2; i++) x = await P.under(p, x, 'Text'); await P.under(p, x, 'Button');
      await H.panel(p, false); await this.words(h, type === 'contact' ? 'Send us a message' : 'Enquire about a place'); this.placeholders.add('Forms');
    } else if (type === 'events') {
      await after(); const h = await P.into(p, id, 'Heading'); await P.under(p, h, 'List');
      await H.panel(p, false); await this.words(h, 'Term dates'); this.placeholders.add('Calendar / term dates / events list');
    } else if (type === 'faq') {
      await after(); const h = await P.into(p, id, 'Heading'); await P.under(p, h, 'Accordion');
      await H.panel(p, false); await this.words(h, 'Questions parents ask');
    } else if (type === 'pricing') {
      await after(); const g = await P.into(p, id, 'Card'); await P.row(p, g, ['Card', 'Card']);
      await H.panel(p, false); this.placeholders.add('Pricing tables');
    } else if (type === 'blog-index' || type === 'listing' || type === 'work-index') {
      await after(); const a = await P.into(p, id, 'Card'); const r = await P.row(p, a, ['Card', 'Card']);
      const pg = await P.tileAfter(p, id, 'Stack'); let q = await P.into(p, pg, 'Link'); for (let i = 0; i < 3; i++) q = await P.beside(p, q, 'Link');
      await H.panel(p, false); this.placeholders.add('Pagination'); this.last = pg; void r;
    }
    if (id) { await I.meaning(p, id, 'Section'); await H.panel(p, true); if (this.last !== id && !['blog-index', 'listing', 'work-index'].includes(type)) this.last = id; this.sections.push({ role: 'type:' + type, id }); }
  }

  // ── CALL TO ACTION (deck C4) and FOOTER (deck C3) ──
  async cta() {
    const p = this.page; const id = await P.tileAfter(p, this.last, 'Stack');
    const h = await P.into(p, id, 'Heading'); const t = await P.under(p, h, 'Text'); const b = await P.under(p, t, 'Button');
    await H.panel(p, false); await this.words(h, COPY.cta[0]); await this.words(t, COPY.cta[1]); await this.words(b, 'Book an open morning');
    await this.band(id, { bg: INK[this.t], width: 'Centred column' }); await I.meaning(p, id, 'Section'); await H.panel(p, true);
    this.sections.push({ role: 'cta', id }); this.last = id;
  }
  async footer() {
    const p = this.page; const id = await P.tileAfter(p, this.last, 'Stack');
    const c0 = await P.into(p, id, 'Stack'); const cols = await P.row(p, c0, ['Stack', 'Stack', 'Stack']);
    // Each column: a heading and a LIST OF LINKS, one per line (<ul><li><a>) — a footer menu, not bulleted words.
    const heads = [], lists = [], links = [];
    for (const c of cols) {
      const h = await P.into(p, c, 'Heading'); heads.push(h);
      const l = await P.under(p, h, 'Stack'); lists.push(l);
      let a = await P.into(p, l, 'Link'); const col = [a];
      for (let k = 1; k < 3; k++) { a = await P.under(p, a, 'Link'); col.push(a); }
      links.push(col);
    }
    const legal = await new Builder(p).addLine(id, 'Text', c0);
    await H.panel(p, false);
    for (const [i, h] of heads.entries()) { await this.words(h, COPY.foot[i][0]); await I.meaning(p, lists[i], 'List'); for (const [k, a] of links[i].entries()) await this.words(a, COPY.foot[i][1][k]); }
    await this.words(legal, `© 2026 ${COPY.school} · Registered charity 000000 · Privacy · Accessibility`);
    await this.band(id, { bg: INK[this.t], width: 'Edge to edge' }); await I.meaning(p, id, 'Page footer'); await H.panel(p, true);
    this.sections.push({ role: 'footer', id });
  }

  // ── A SIDEBAR layout (deck D6): the body in a main column, a Sidebar beside it ──
  async withSidebar() {
    const p = this.page; const side = this.r.sidebar;
    const row = await P.tileAfter(p, this.last, 'Stack');
    const main = await P.into(p, row, 'Stack'); const aside = await P.beside(p, main, 'Stack');
    const ah = await P.into(p, aside, 'Heading'); await P.under(p, ah, 'List'); await P.under(p, ah, 'Card');
    await H.panel(p, false); await this.words(ah, 'In this section');
    await I.meaning(p, aside, 'Sidebar'); await I.meaning(p, main, 'Main content');
    if (side === 'right-sticky') await I.sticky(p, aside);
    // The MAIN column is the wide one on either side: [main, aside] = 75/25 for a left sidebar (the aside is then moved
    // before it). It was written [25, 75] — a 25% main column — and every left-sidebar page squeezed its body into a
    // quarter of the page (#128: broken words, wrapped stats, holes, all from the dresser, none from the engine).
    await new Builder(p).sizeColumns([main, aside], side === 'left' ? [75, 25] : [70, 30]);
    if (side === 'left') { /* a left sidebar: the aside is dragged before the main column with the keyboard — Ctrl+Up is move-up */ await H.select(p, aside); await p.keyboard.press('ArrowUp'); await p.waitForTimeout(300); }
    await H.panel(p, true);
    this.last = row; this.sections.push({ role: 'sidebar-layout', id: row });
    await this.body(main);
  }

  async build() {
    const p = this.page;
    if (this.r.theme !== 'Light') { // the top bar's "Website theme" menu (menuitemradio options)
      await p.getByRole('button', { name: 'Website theme' }).first().click(); await p.waitForTimeout(300);
      await p.getByRole('menuitemradio', { name: new RegExp(this.r.theme) }).first().click(); await p.waitForTimeout(500);
    }
    await H.panel(p, true);
    await this.header(); this.log('  header');
    await this.hero(); this.log('  hero');
    if (this.r.sidebar !== 'none') await this.withSidebar(); else await this.body(); this.log('  body');
    await this.typeSection(); this.log('  type section');
    await this.cta(); await this.footer(); this.log('  cta + footer');
    await H.panel(p, false);
    this.photos = await photos(p);
    return this;
  }
}
module.exports = { Dresser, COPY };
