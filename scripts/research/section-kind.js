// THE KIND OF A SECTION — what a band of a real page is FOR (hero, pricing, footer…), named from the features
// `extract.js` measures per band (LE-15: the crawl knew each band's shape, not its kind). The words and counts are in
// config/research.json `sectionKinds` (RULE CFG).
//   sectionKind(feat, i, n, prevKind) → one of KINDS   (i = the band's index, n = the bands on the page)
const { words: WORDS, thresholds: T, utilityPrefixes } = require('../../config/research.json').sectionKinds;

const KINDS = ['header', 'hero', 'features', 'media', 'gallery', 'logos', 'stats', 'testimonials', 'pricing', 'faq', 'team', 'blog', 'events', 'cta', 'contact', 'newsletter', 'footer', 'image', 'text', 'decor', 'other'];
// A word matches at a word / class-name boundary: "work" names a gallery, "workshop" does not.
const RE = Object.fromEntries(Object.entries(WORDS).map(([k, ws]) => [k, new RegExp(`(^|[^a-z0-9])(${ws.map((w) => w.replace(/[-]/g, '[-_ ]?')).join('|')})($|[^a-z0-9])`)]));
// A site's OWN class names only — a utility (`pointer-events-none`, `md:text-…`) names nothing (LE15-9: 421 × `pointer-events-none`
// made one site's bands "events").
const UTIL = new RegExp(`^(${utilityPrefixes.join('|')})(-|$)`);
const ownClasses = (cls) => cls.split(/\s+/).filter((t) => t && !t.includes(':') && !t.includes('[') && !UTIL.test(t)).join(' ');
// The order a class name is trusted in: the specific kinds before the broad ones ("pricing-cta" is pricing).
const CLASS_ORDER = ['footer', 'header', 'pricing', 'faq', 'testimonials', 'newsletter', 'contact', 'logos', 'stats', 'team', 'events', 'blog', 'gallery', 'hero', 'cta', 'features', 'media'];

function sectionKind(f, i, n, prevKind) {
  const g = (k) => f[k] || 0; const words = g('words');
  const cls = ownClasses((f.cls || '').toLowerCase());
  const first = i === 0 || (i === 1 && prevKind === 'header');
  if (f.tag === 'footer' || (i === n - 1 && g('links') >= T.footerMinLinks)) return 'footer';
  // A short bar holding the navigation, wherever it sits — Framer's floating and bottom bars too (LE15-11).
  if ((f.tag === 'header' || g('nav')) && g('h') <= T.headerMaxPx) return 'header';
  // A layer with nothing to read or see — a background, an overlay, a mask (LE15-8: 900px "bands" of a fixed backdrop).
  if (!words && !g('img') && !g('video') && !(f.motion && (f.motion.video || f.motion.canvas))) return 'decor';
  for (const k of CLASS_ORDER) if (RE[k].test(cls)) return k;
  if (g('prices') >= T.pricesMin) return 'pricing';
  if (g('details') >= T.detailsMin) return 'faq';
  if (g('quote')) return 'testimonials';
  if (g('email') && g('fields') <= T.newsletterMaxFields && !g('textarea')) return 'newsletter';
  if (g('fields') >= T.contactMinFields || g('textarea')) return 'contact';
  if (g('smallImg') >= T.logosMinSmallImages && words <= T.logosMaxWords) return 'logos';
  if (g('numbers') >= T.statsMinNumbers && words <= T.statsMaxWords) return 'stats';
  if (g('img') >= T.galleryMinImages && words <= T.galleryMaxWords) return 'gallery';
  if (first && (g('h1') || g('h') >= 600)) return 'hero';
  const heads = (f.heads || []).join(' ').toLowerCase();
  for (const k of CLASS_ORDER) if (k !== 'header' && k !== 'footer' && RE[k].test(heads)) return k;
  if (g('h') <= T.ctaMaxPx && g('buttons') && (f.heads || []).length && words <= T.ctaMaxWords) return 'cta';
  if (g('smallHeads') >= T.featuresMinSmallHeadings) return 'features';
  if (g('img') && words >= T.mediaMinWords) return 'media';
  if (g('img') && words < T.mediaMinWords) return 'image'; // a full-width picture or illustration (LE15-13)
  if (words >= T.textMinWords) return 'text';
  return 'other';
}

// THE SECTIONS OF A PAGE, not its wrappers (LE15-8: a Framer page's "band 0" was the whole 3,000px page): a band taller than
// one and a half screens whose children stack one under another is split into them, again, up to `depth` levels — but only
// when two or more children are section-sized (`minPx`; LE15-12: a column of 26px paragraphs became 60 "sections"). Pure —
// the accessors come from the page (section-kinds.js injects it beside extract.js measure()).
function deepen(bands, acc, depth = 4) {
  if (!depth) return bands; let split = false; const out = [];
  for (const b of bands) { const k = acc.kids(b); if (k.filter((x) => acc.height(x) >= (acc.minPx || 0)).length > 1 && acc.height(b) > acc.vh * 1.5 && acc.stacked(k)) { out.push(...k); split = true; } else out.push(b); }
  return split ? deepen(out, acc, depth - 1) : out;
}

module.exports = { sectionKind, KINDS, deepen };
