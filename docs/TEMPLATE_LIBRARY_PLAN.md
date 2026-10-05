# Template Library — one original template for EVERY crawled site

> **Status: DECIDED by the user 2026-09-27, NOT STARTED.** Do not begin until the prerequisites below are done —
> the user's words: *"I don't want you to do it now… we still need to finish [Task] one… write it down so I can tell
> another session to do it without having them to remember."*

## What the user wants

**Every single crawled site becomes a template** — not a few dozen, not a few hundred: all of them (≈475 sites,
≈4,100 pages at the time of writing, and any crawled later). Each template is **similar to its site but not a copy**:
the same slickness, the same kind of transitions and motion, the same structure and flow, "every way the way they
are" — then anyone (schools first, but any kind of organisation) can pick it from a gallery, change the content,
and publish it as their website.

A site with several pages (home, about, contact, blog…) becomes a **multi-page template** with those pages.

## The quality bar — as good as the site it came from, and BETTER

The user, 2026-09-27: *"it doesn't compromise quality, it doesn't compromise slickness — as a matter of fact it
actually makes it better than what we are getting inspiration from."* A template is **never** a simplified or rougher
version of its source. It is not done until it **matches or beats the source on every line below**, and beats it on
the ones marked ★:

| Measure | The bar |
|---|---|
| **Slickness / polish** | At least as refined: spacing rhythm, alignment, type hierarchy, image treatment, hover and focus states all as considered as the source's — judged side by side with the source screenshots, at every size. |
| **Motion & transitions** | Every *kind* of motion the source has (scroll reveals, sticky/parallax, hover, page and menu transitions, marquees…) is present, at least as smooth — **plus** a proper reduced-motion version, which most sources lack. ★ |
| **Responsiveness** | Correct and designed at every rung (375 · 768 · 1024 · 1280 · 1920 + device presets) — many sources only really work on desktop. ★ |
| **Accessibility** | WCAG 2.1 AA: real landmarks and heading order, contrast asserted, keyboard and focus, alt text, skip link. ★ |
| **Performance** | Inside the budgets in `docs/web-anatomy/media-performance.md` (LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms), self-hosted fonts, no third-party requests on load. ★ |
| **Editability** | Every block, text, image and colour editable in the builder, and it stays slick after a user changes the content. ★ |
| **Design foundation** | Follows RULE F (Web Design Rules #1–#10, personalities) — which is itself a reason it can come out better than a site that breaks them. |

**The check, per template:** its screenshots beside the source's at each size, scored on every row above. Any row
below the source is a bug in the ledger — fixed before the template is marked done, never shipped as "close enough".
Being original is never an excuse to be plainer: the look is different, the quality is equal or higher.

## What "similar but not a copy" means — the line every template must stay on

Taking a site's **structure and approach** is fine; taking its **expression** is not. The Webflow and Framer
templates are paid products and every awwwards site belongs to its owner.

| Take from the site (allowed) | Never take (not allowed) |
|---|---|
| The page list and page types | Its HTML, CSS or JavaScript |
| The section order and layout rhythm (e.g. split hero → logo strip → 3 features → testimonial → pricing → FAQ → footer) | Its text, headlines, names, logos, brand marks |
| Which components it uses (accordion, carousel, tabs, cards…) | Its photos, illustrations, icons, videos, fonts files |
| The *kind* of motion (fade-up on scroll, sticky header, parallax hero, marquee, hover lift) and its pace | Its exact colour palette + type pairing + distinctive signature element together — the "look" someone would recognise |
| Header behaviour (fixed, transparent, hamburger), sidebars, density, whitespace level | Anything that makes a visitor think it IS that site |
| Its personality (serious/elegant, minimalist, bold, calm, startup, playful, plain — RULE F) | |

Each template gets its **own** colours (our OKLCH tokens), type pairing (our font library), imagery (licensed or
generated for us), placeholder copy written for the template's audience, and icons (our set). Two templates made
from two different sites must look like two different products. **When in doubt, move further away** — especially
for paid Webflow/Framer templates.

## Where the source material is

| What | Where |
|---|---|
| One line per page: source · category · site · page · type · landmarks · headings · header · sidebars · components · section sequence · breakpoints | `docs/layout-benchmark/pages.tsv` (in the repo) |
| Per-page structure (`*.anatomy.json`: landmarks, outline with positions, navs, header, sidebars, components, **motion**, design, breakpoints, units — at desktop `D`, tablet `T`, mobile `M`), page text, **screenshot** | `C:\Users\eyite\educo-uat-harness\sites\<host>\` (outside git) |
| Raw HTML of every page (to read how a transition or layout is done — never to copy) | `C:\Users\eyite\educo-uat-harness\archive\<host>\` (outside git) |
| Which site came from where (awwwards category, Webflow/Framer template page) | `scripts/research/harvest*.tsv`; each site's `index.json` |
| How the data was gathered / regenerated | `scripts/research/README.md` (`crawl.js`, `summarise.js`) |
| Motion and transitions research | `docs/web-anatomy/motion-effects.md`, `awwwards-motion-survey.md` |
| Components, semantics, page regions | `docs/web-anatomy/` (README is the register) |
| The design foundation every template must follow (RULE F) | `docs/web-anatomy/design-foundation/` |
| Page-structure catalogue | `docs/LAYOUT_BENCHMARK.md` |

## Prerequisites — all must be done first

1. **Task 1 closed** (layout, resize, semantics, Preview at every size) and merged.
2. **The semantic layer built** (plan: https://claude.ai/artifact/21gRsmKjw9RZTgdVbqNMmQ — A1/B1/C1).
3. **A template feature in the builder**: a gallery that SHOWS each template (RULE S), "use this template" creating a
   new multi-page site from it, and every block editable afterwards. Needs its own plan artifact + user approval
   (component workflow, rule 13).
4. **Every component and motion effect the templates need exists in the builder.** A site that uses something the
   builder cannot make yet is a GAP to build first (recorded, never skipped or faked).
5. The design-foundation write-ups (RULE F) finished.

## How each template is made (per site)

1. Open the site's rows in `pages.tsv`, its `*.anatomy.json` and its screenshots. Note: pages, section order, layout,
   components, header/nav behaviour, motion, personality, density.
2. Write its **template brief** (one short block in the tracker): structure to follow, personality, the audience it is
   re-imagined for (school, charity, business, portfolio…), and the original look (tokens, fonts, imagery direction).
3. Build it **in the builder, through the UI** (RULE Y) — the template is a builder site, never imported HTML.
4. Semantics correct (landmarks, heading levels), tokens only, rem/%, responsive at every rung, reduced-motion
   fallback for every transition.
5. **Test like everything else:** UAT → Preview at 375 / 768 / 1024 / 1280 / 1920 + device presets → every
   combination (RULE Q/Z, 80/20), headed, real window sizes, screenshots read. Canvas == Preview.
6. **Distinctness check:** side by side with the source screenshot — same structure and feel, clearly a different
   design. Also distinct from every other template (RULE T).
7. Mark it done in the tracker.

## Tracking and order

- A tracker (to create when this starts: `docs/templates/TRACKER.md` or a published Artifact with a shared database)
  lists **every site** from `pages.tsv` with: source, category, pages, status (todo / brief / built / tested / done),
  gaps found.
- **80/20 order:** start with the structures and categories that recur most (and education/schools early), so the
  most useful templates exist first — but the goal is **all of them**.
- Batch by category; each batch is its own branch and PR (rule 9).
