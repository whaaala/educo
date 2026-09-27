# Web Anatomy — the research register

> **CLAUDE.md RULE R — the research is the reference.** Before building any builder feature, read what this
> research says about it and build to that. Captured once, extended forever: a new source is studied, expanded
> online and **stored here** — never re-researched from scratch. The builder is **general-purpose** (schools first,
> decoupled later), so this research covers websites in general, with school requirements as one layer.

## What is stored, and where

| Area | File | What it answers |
|---|---|---|
| HTML semantics | [html-semantics.md](html-semantics.md) | Every HTML element (Living Standard + MDN + ARIA-in-HTML / HTML-AAM), landmarks, heading outline, what a builder block may *be* (`section`, `article`, `nav`…), 20 features newer than the "HTML5" label with support, a 33-point export checklist |
| Components & interaction | [components.md](components.md) | 83 components — anatomy, variants, keyboard, ARIA, phone behaviour, block kind — from the WAI-ARIA APG, Open UI, GOV.UK, Material 3, Carbon |
| Motion & effects | [motion-effects.md](motion-effects.md) | Transitions, animations, easing/duration tokens, scroll-driven & sticky effects, View Transitions (incl. cross-document for a static export), reduced motion, WCAG motion rules, award-site techniques  |
| Media & performance | [media-performance.md](media-performance.md) | Images (srcset/sizes/picture, AVIF/WebP, width/height + aspect-ratio, lazy vs eager, LCP image, alt text), backgrounds, video/audio (autoplay, captions, WCAG 1.2/1.4.2/2.2.2), embed facades + privacy (UK GDPR/PECR, Google Fonts ruling), self-hosted font loading, a Core Web Vitals budget and 26 export-enforceable builder rules |
| Page regions & education | [regions-and-education.md](regions-and-education.md) | Header / navigation / footer / sidebar variants with NN/g evidence; what UK schools must publish (DfE), the accessibility statement; six real school sites; a recommended school site map |
| Page structures | [../LAYOUT_BENCHMARK.md](../LAYOUT_BENCHMARK.md) | Named whole-page layouts, section patterns and page types; the real-site benchmark; coverage |
| Real-site crawl | [../layout-benchmark/sites/](../layout-benchmark/sites/) | Per site: `index.json` (pages + types); per page at desktop/tablet/phone: `*.txt` (layout tree + effects), `*.anatomy.json` (semantics, roles, landmark outline, navigation, sidebars, components, motion, design tokens, breakpoints, units), `*.jpg` |
| Raw page archive *(local, not in git)* | `C:\Users\eyite\educo-uat-harness\archive\<site>\*.html.gz` | The full HTML of every crawled page — answer a later question from here, not by crawling again |
| Tools *(local)* | `C:\Users\eyite\educo-uat-harness\` | `harvest.js` (awwwards), `crawl.js` + `extract.js` + `anatomy.js` (every page, full anatomy), and the builder test harness |

## Sources the user has given (studied, or being studied)

| Date | Source | Used for | Status |
|---|---|---|---|
| 2026-09-26 | https://www.awwwards.com/ — every category, Sites of the Day/Month/Year | Real-site structures, all page types | 110 site URLs harvested (15 of 26 categories so far); first 42 sites crawled (223 pages, full anatomy); crawling all 110 now; harvest resuming slowly for the 11 missing categories, the award collections and the structure tags |
| 2026-09-27 | https://developer.mozilla.org/en-US/docs/Glossary/Semantics | HTML semantics | Done → html-semantics.md |
| 2026-09-27 | https://developer.mozilla.org/en-US/docs/Glossary/HTML5 | "HTML5" = the WHATWG Living Standard | Done → html-semantics.md §0 |
| 2026-09-27 | https://www.awwwards.com/awwwards/collections/transitions/ | Transitions on award-winning sites | Done → motion-effects.md + awwwards-motion-survey.md |
| 2026-09-27 | https://developer.mozilla.org/en-US/blog/view-transitions-beginner-guide/ | View Transitions (same- and cross-document) | Done → motion-effects.md |
| 2026-09-27 | https://css-tricks.com/scroll-driven-sticky-heading/ | Scroll-driven + sticky patterns | Done → motion-effects.md |
| 2026-09-27 | https://www.awwwards.com/websites/animation/ | Animation techniques on award sites | Done → motion-effects.md |
| 2026-09-27 | https://webflow.com/templates | Complete multi-page template sites, every category | 125 templates harvested across 25 of 26 categories (category → card → details → Preview → the live <name>.webflow.io site); crawl of every page type queued |
| 2026-09-27 | https://themeforest.net/ | Theme demos — pages, components, transitions | Next: listings + item pages (allowed by robots.txt); demo sites only where an item page links to them directly — `*/full_screen_preview/` is disallowed by robots.txt and is not used; no bot-protection circumvention |

## Also drawn on (by the research itself)
WHATWG HTML Living Standard · W3C ARIA in HTML · HTML-AAM · W3C WAI-ARIA Authoring Practices Guide · Open UI ·
GOV.UK Design System · Material 3 · IBM Carbon · Nielsen Norman Group · Smashing Magazine · web.dev · MDN layout
cookbook · DfE "what schools must publish online" · Public Sector Bodies Accessibility Regulations 2018. Each
document cites its URLs section by section.

## Adding a source
1. Record it in the table above (date, link, what it is for).
2. Study it properly, then expand from it online.
3. Store the result in the matching file here (or a new one, linked from this register) with cited URLs.
4. If it is a site to crawl: harvest politely (respect robots.txt, a visitor's pace), crawl every page type with
   `crawl.js`, and the structure + anatomy land in `docs/layout-benchmark/sites/`.
