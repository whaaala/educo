# Page transitions — View Transitions, overlay routers, prefetch/prerender

Research for the Educo builder (exported static multi-page sites). Compiled 2026-10-02.

**What this file adds to what is already stored.** [motion-effects.md](../motion-effects.md) §4 ("Page transitions",
"Mask / clip wipe") and §7 already hold: the two modes (same-document, cross-document), naming, the pseudo-element
tree, types and `:active-view-transition-type()`, a support table, and five copy-ready CSS patterns (fade, slide by
type, shared-element morph, mask wipe, still header). [awwwards-motion-survey.md](../awwwards-motion-survey.md) and
§9 hold the evidence (108 of 300 live award sites ship a page-transition library or View Transitions: Barba 50,
VT 48, Swup 12, Highway 4). **None of that is repeated here.** New in this file:

- exact support per browser **including the browsers that matter for RULE AF** (Samsung Internet, Opera Mini, UC);
- the rules that decide whether a cross-document transition runs at all (navigation types, 4 s timeout, main frame
  only — which means **the builder's `srcdoc` Preview cannot show one**);
- `pageswap` / `pagereveal`, `navigation.activation`, render blocking (`<link rel="expect">`), bfcache clean-up;
- Level-2 additions: `match-element`, nested groups (`view-transition-group`), element-scoped transitions,
  `document.activeViewTransition`, `waitUntil()`;
- how Barba and Swup work and what Swup's a11y plugin does (the focus/announce baseline a router must re-create);
- speculation rules (prefetch/prerender, eagerness, Save-Data) **against the export's current `<link rel=prefetch>`**;
- the builder audit (HAVE / PARTIAL / GAP) and gap ids PT-1…PT-11.

---

## Sources and completeness

| Source | What it holds | Read | Not read (reason) |
|---|---|---|---|
| MDN View Transition API (overview) | concepts, 3 interfaces, extensions (startViewTransition, PageRevealEvent, PageSwapEvent), HTML `rel=expect`, CSS at-rule/properties/pseudo-classes/pseudo-elements | all sections | — (redo 2026-10-02: the 5 demos and every other demo link collected into the demo list for the browser run; see "Added 2026-10-02 (redo)") |
| MDN "Using the View Transition API" | process (6 steps), pseudo tree, basic SPA + MPA, customising, per-element animation, JS control, pageswap/pagereveal profile example, render blocking | all 6 sections | — |
| MDN "View transition types" | types in SPA, `@view-transition types`, dynamic types in pageswap/pagereveal, `:active-view-transition-type()` | all | — |
| MDN "Element-scoped view transitions" | `Element.startViewTransition`, scope, concurrency, nesting, `transitionRoot` | all | — |
| MDN `@view-transition`, `view-transition-name`, `view-transition-class`, `Window: pagereveal` | syntax, conditions, Baseline banners | all | — (redo: `pageswap` page and `PageSwapEvent` READ) |
| caniuse `view-transitions`, `cross-document-view-transitions`, `link-rel-prefetch`, `speculationrules` | per-browser support | all | — |
| developer.chrome.com: cross-document, same-document, "What's new in view transitions (2025)", nested groups | opt-in, events, timeout, limits, types, debugging, Level-2 features with versions | all four | — (redo: I/O 2024 update, "SPA view transitions land" (the old "smooth transitions" post), Bramus's "Misconceptions" READ; web.dev's VT article is 404 now, the web.dev "Baseline newly available" post READ instead) |
| developer.chrome.com "Prerender pages" + MDN Speculation Rules API | prefetch vs prerender, list/document rules, eagerness, limits, Save-Data, unsafe URLs, `document.prerendering` | all | — (redo: Chrome "Implementing speculation rules for more complex sites" — the guidance page — READ; it is not framework-specific) |
| swup.js.org: how it works, options, a11y plugin, docs index | lifecycle, classes, `native` VT mode, history/scroll, focus + announce | those 4 pages | — (redo: all 61 sitemap pages READ, every plugin, theme, integration, demos and showcase) |
| barba.js.org: intro, browser support | markup, hooks, size, support | those 2 | — (redo: all 23 docs pages READ, plus `/examples/`; the `/showcase/` grid is filled by script and could not be read — see the redo table) |
| WCAG 2.2 Understanding 2.2.2, 2.3.1, 2.3.3 | already stored in motion-effects §2 | — | not re-read (stored) |

**Redo, 2026-10-02 — every source below was fetched in full and read; every demo link inside it went into
`scratchpad/demos/pt.json` (348 URLs) for the browser run.**

| Source | Read | Not read (reason · route used) |
|---|---|---|
| MDN reference pages: `ViewTransition` + `finished`, `ready`, `updateCallbackDone`, `skipTransition()`, `types`, `transitionRoot`, `waitUntil()`; `ViewTransitionTypeSet`; `CSSViewTransitionRule`; `Document.startViewTransition`, `Document.activeViewTransition`; `Element.startViewTransition`, `Element.activeViewTransition`; `Window: pageswap`, `PageSwapEvent`, `PageRevealEvent`; `::view-transition`, `-group()`, `-image-pair()`, `-old()`, `-new()`; `:active-view-transition`, `:active-view-transition-type()`; `view-transition-scope`; `rel` (expect); `NavigateEvent.hasUAVisualTransition`; `Document.prerendering`; `<script type=speculationrules>`; Speculation Rules API | all 36 | `view-transition-group` property page and `::view-transition-group-children()` page — **404 on MDN** (not written yet); their content is in the Chrome nested-groups doc |
| MDN blog "View transitions: a beginner's guide" (MPA) | all | — |
| MDN `dom-examples/view-transitions` repo (folder list) | all 7 demos listed | — |
| developer.chrome.com: element-scoped VT doc (Mar 2026), I/O 2024 update, "SPA view transitions land" (2023), misconceptions (Bramus), 2025 update (re-read for DevTools, timing, inheritance), "Implementing speculation rules" guidance, Prerender pages (re-read for `tag`, `target_hint`, `prerender_until_script`) | all | "Debugging view transitions" page — no such page exists (404); debugging content is in the 2025 update and the CSS-Tricks Part 1 article |
| view-transitions.chrome.dev (Bramus's demo site) + its repo `bramus/view-transitions-demos` (folder tree via GitHub HTML) | index + every `src/` folder | `tests/pageswap/` is not deployed (404) |
| Jake Archibald: `simple-vt-demos.jakearchibald.com` index (44 demos), "Handling aspect ratio changes" (2024) | all | jakearchibald.com has no other VT post (RSS checked). `simple-set-demos.glitch.me` now **redirects** to `simple-vt-demos.jakearchibald.com` (Glitch closed) |
| bram.us — 25 view-transition posts (feed `tag/view-transitions`, pages 1–5): attr vs match-element, toolkit, mock polyfill, position-area, two-phase with `precommitHandler`, feature explorer, nested groups, scoped, border-radius ×2, snapshot containing block, performant group animations, page interactivity, MPA deep dive, two snippets, two auto-trigger experiments, misconceptions, better capturing mode, meta-tag PSA, grid rearrange, talk pages | all text | talk recordings (video) not watched — the posts carry the slides' points |
| vtbag.dev (Martin Trapp, "Bag of Tricks") — 12 pages: fails-and-fixes, interactivity, examples, over-exposure, turn-signal, pseudo-smooth-scrolling, auto-names, levels, hide-and-seek, default animations, element-crossing, pointer | those 12 | the other 23 sitemap pages (Astro "fun with VT" course, tool manuals for inspection-chamber, cam-shaft, utensil-drawer, AI page) — tool docs, not new technique; their demos are in the list |
| chrome.dev view-transitions-toolkit (index + 8 demo pages) and view-transitions-mock | index pages | — |
| barba.js.org — all 23 docs pages + `/examples/` | all | **`/showcase/`**: the grid is filled by `js/main.js` from a source not in the page; no JSON endpoint found; web.archive.org was "Temporarily Offline" (503) and WebFetch is blocked from it. Showcase sites NOT collected |
| swup.js.org — all 61 sitemap pages (docs, every plugin, themes, integrations, demos, showcase) + showcase `.md` files in `swup/docs` | all | — |
| Codrops | READMEs of 29 page-transition repos in `github.com/codrops` (found by repo search: transition, page, view, reveal, overlay, loader, navigation, astro) | **tympanus.net returns 403** to curl and WebFetch, including the RSS feed and `/hub/tag/page-transition/`; web.archive.org offline. Articles NOT read. Route used: GitHub READMEs (demo URL + article id) and web search for 2023–2026 titles. Demo hosts `tympanus.net/Development/...` collected (28) |
| CSS-Tricks: "Cross-Document View Transitions" Part 1 + Part 2 (May 2026), "What on earth is the types descriptor", "7 view transitions recipes", "Why isn't my 3D view transition working", "Keeping the page interactive…", "Toe-dipping into view transitions", "Scroll-driven, scroll-triggered, scroll states and view transitions", "Page transitions for everyone" (swup) | all 9 | CodePen embeds in CSS-Tricks are anonymous prefill embeds; only 2 resolvable ids found |
| Smashing Magazine: "The View Transitions API And Delightful UI Animations" Part 1 + Part 2 (Adrian Bece) | all | — |
| web.dev "Same-document view transitions are now Baseline Newly available" (Oct 2025) | all | — |

---

## 1. Techniques

### 1.1 Cross-document View Transitions (MPA) — the one that fits a static export

- **Plain words:** when a visitor clicks a link to another page of the same site, the browser takes a picture of the old
  page, loads the new one, and animates between them. No script.
- **Minimal CSS** (in the stylesheet **both** pages load — for Educo that is the shared `styles.css`):
  ```css
  @media (prefers-reduced-motion: no-preference) { @view-transition { navigation: auto; } }
  ::view-transition-group(root) { animation-duration: var(--eu-dur-page, 300ms); }
  ```
- **When it runs:** same origin, no cross-origin redirect, navigation type `push`, `replace` or `traverse`
  (back/forward); a push/replace must come from a click in the page — **typing a URL or pressing reload does not
  animate**. **Main frame only** (iframes "coming"). If the new page has not rendered within **4 s** the transition is
  skipped (`TimeoutError`) and the page simply appears.
- **Events (optional JS):** `pageswap` fires on the old page just before its last frame; `pagereveal` fires on the new
  page before its first render (register it in a parser-blocking `<script>` in `<head>`). Both expose
  `e.viewTransition` (`types.add()`, `skipTransition()`, `ready`, `finished`) and `navigation.activation.from/entry.url`
  — that is how a back/forward-aware slide is chosen. Names set from script for one navigation must be removed after
  `finished`/`ready`, or a bfcache return finds duplicates.
- **Render blocking:** `<link rel="expect" href="#main" blocking="render">` holds the first paint until `#main` is
  parsed, so the "new" snapshot is not half a page. Chrome warns it costs LCP; use sparingly.
- **Support (caniuse, Oct 2026):** Chrome/Edge 126+, Safari 18.2+ (macOS and iOS), Chrome Android current — yes.
  **Firefox 144+ partial** (Firefox Android partial). **Samsung Internet (through v30), Opera Mini, UC Browser: no.**
  Global ≈ 88 %. MDN: `@view-transition` is *Limited availability* (not Baseline).
- **Fallback:** an unsupporting browser just navigates. Nothing to polyfill — progressive enhancement for free.
- **Reduced motion:** wrap the opt-in in `no-preference` (above). Note that Educo's global reduce rule
  (`.eu-root *` in `lib/educo-ui/base.ts:145`) **does not reach** `::view-transition-*`, which hang off `<html>`, so
  the transition needs its own guard.
- **Cost on a low-cost Android on 3G:** the animation itself is compositor-only (snapshots are textures; default fade is
  opacity). The real cost is **waiting**: the old page stays frozen until the new one can render. On 3G that is the
  same wait a normal navigation has, but if it passes 4 s the animation is dropped. Each named element is an extra
  snapshot texture in GPU memory — keep named elements to a handful.
- **Accessibility:** it is a real navigation, so the browser does what it always does: focus goes to the start of the
  new document and the screen reader reads the new `<title>`. Nothing to re-create. During the animation the page
  does not take input — keep it ≤ 400 ms. A big slide/wipe is motion (2.3.3); fade is not.
- **How common:** 48 of 300 award sites reference View Transitions; 30 of the 60 newest (2026) Animation-category sites
  do (motion-effects §9). It is the direction of travel.

### 1.2 Same-document View Transitions (SPA / in-page state change)

- **Plain words:** the same snapshot-and-animate, for a change inside one page — a tab switch, a filter, a slide.
- **Minimal JS:** `if (!document.startViewTransition) update(); else document.startViewTransition({ update, types:['next'] });`
- **Support:** **Baseline 2025 (newly available, Oct 2025)** — Chrome 111, Safari 18, Firefox 144; Samsung Internet 23+.
  `view-transition-class` and types: Chrome 125, Safari 18.2/18, Firefox 144 (Firefox 144 shipped without types at
  first). `match-element` auto-naming: Chrome 137, Safari 18.4, Firefox 144 (same-document only).
- **Level-2 extras (Chromium first):** nested groups `view-transition-group: contain | nearest | <name>` +
  `::view-transition-group-children()` so clipping/radius survive the morph (Chrome 140; not Firefox/Safari);
  element-scoped `el.startViewTransition()` — several at once, rest of page stays interactive (Chrome 147 stable);
  `document.activeViewTransition` (Chrome 142, Firefox 147, Safari 26.2); `ViewTransition.waitUntil()`.
- **Gotchas:** duplicate `view-transition-name` → `ready` rejects and the transition is skipped; transitions are skipped
  when the page is hidden; `hasUAVisualTransition` (on `NavigateEvent`) tells you the browser already animated a
  swipe-back, so do not animate twice.
- **Where Educo could use it:** the pager/slider, tabs and accordion components, a news filter. Cost and accessibility
  are as 1.1, plus: the script must move focus itself if the change replaces the focused element.

### 1.3 Shared-element morph

- **Plain words:** a picture on a list card flies into place as the big picture on the detail page.
- **How:** the same `view-transition-name` on both elements (one per page, unique); `view-transition-class` styles all of
  them with one rule; `object-fit: cover` on `::view-transition-old/new` keeps the aspect while it morphs (pattern 3 in
  motion-effects §7). In cross-document mode `match-element` is not available, so names must be written per item.
- **Cost:** one extra snapshot per morphing element. **Accessibility:** a morph is motion → plain fade under reduce.
- **Builder prerequisite:** the export must know "this card links to that page and shows that image". Today a card is
  just blocks with a link; there are no collections (news items, staff profiles) yet.

### 1.4 Overlay routers: Barba.js and Swup

- **How they work:** intercept same-site link clicks, `fetch` the next page, play a **leave** animation, swap only the
  marked container (`data-barba="container"` / `#swup`), play an **enter** animation, `history.pushState`. Header,
  audio players and canvases outside the container persist. Barba ≈ 7 kB gz, hooks per namespace; Swup uses classes
  (`html.is-changing / is-leaving / is-rendering`) and has `native: true`, which hands the animation to same-document
  View Transitions where supported (cydstumpel.nl runs exactly this, measured in §9).
- **What they break and must re-create:** the browser no longer navigates, so it no longer moves focus or announces the
  page. Swup's a11y plugin shows the baseline any router needs: an `aria-live` announcement "Navigated to: {title}"
  (from `main h1`, then `h1`, then `<title>`, then URL), focus reset to `<body>` (or the `#target` of an anchor), and
  `respectReducedMotion: true` (no animation, no smooth scroll). Barba's docs have **no** accessibility guidance.
- **Other costs:** a JS dependency on every page (RULE AF weight budget), analytics and third-party scripts must be
  told about virtual page views, scroll restoration on back becomes manual when history visits are animated.
- **Verdict for Educo:** not needed. Cross-document View Transitions give the same effect with zero JS, keep native
  focus/announce/scroll/bfcache, and degrade to a plain navigation. A router is only justified for something that must
  survive navigation (a playing audio/radio player) — a future component, not a page transition.

### 1.5 Speculation rules and prefetch — the companion

- **Why it belongs here:** a transition can only start when the next page can render. Fetching it early is what makes
  the transition feel instant, and on 3G it is what keeps it under the 4 s timeout.
- **`<link rel="prefetch" href="about.html">`** — fetch now at idle priority. Chrome, Edge, Firefox, Samsung: yes.
  **Safari and iOS: off by default. Opera Mini: no.** No eagerness control, and it does not look at Save-Data.
- **Speculation rules** —
  ```html
  <script type="speculationrules">
  {"prefetch":[{"where":{"href_matches":"/*"},"eagerness":"moderate"}]}
  </script>
  ```
  - `prefetch` = the HTML only (cheap); `prerender` = a whole hidden page with its images and scripts (costly — like an
    iframe).
  - Eagerness: **immediate** (as soon as seen; default for URL lists; Chrome caps 50 prefetch / 10 prerender);
    **eager** (desktop 10 ms hover; mobile 50 ms after the link enters the viewport); **moderate** (desktop 200 ms hover or
    pointerdown; mobile: viewport heuristics 500 ms after scrolling stops near the last tap); **conservative**
    (pointerdown/touchstart). Non-immediate kinds keep at most 2 at a time (FIFO).
  - Chrome **skips speculation under Save-Data, Energy Saver on low battery, low memory**, or if the user turned
    "Preload pages" off.
  - Support: Chrome/Edge 109+ (document rules 121+), Samsung Internet 21+, Opera; **Firefox no; Safari behind a flag**.
    Unsupported browsers ignore the script. CSP needs `'inline-speculation-rules'` if a CSP is set.
  - Never speculate URLs with side effects (sign-out, language switch, "add to cart", OTP sign-in) — a static school
    site has almost none, but a future form-result or payment page would.
- **For RULE AF:** `moderate` prefetch only fetches what the visitor is about to click, and turns itself off for
  visitors on Data Saver. Prerender is not appropriate for metered data.

---

## 2. The builder today (verified by grep)

| Piece | State | Evidence |
|---|---|---|
| Multi-page export, one HTML per page, same origin, shared `styles.css` | **HAVE** — the precondition for cross-document VT | `lib/box-export.ts:790` `renderSiteFiles`, `:696` `SHARED_STYLESHEET`, `:896` `pageDocument` |
| Each page has its own `<title>` (what a screen reader announces after navigation) | **HAVE** | `lib/box-export.ts:904` |
| Skip link + `<main id="main" tabindex="-1">` | **HAVE** — native focus/announce needs nothing more | `lib/box-export.ts:123` `SKIP_LINK_CSS`, `:492` |
| Global reduced-motion rule | **PARTIAL** — covers `.eu-root *` only; would not reach `::view-transition-*` on `<html>` | `lib/educo-ui/base.ts:145` |
| Motion tokens | **PARTIAL** — `fast 120 / base 200 / slow 320 / slower 500ms`; no `page` duration; `emphasized` is an overshoot curve (rename already proposed in motion-effects §3) | `lib/educo-ui/tokens.ts:47-53` |
| `@view-transition`, `view-transition-name/class`, `startViewTransition`, `pagereveal` | **GAP** — no match anywhere in `lib/`, `components/website/`, `app/` | grep, 2026-10-02 |
| Prefetch of sibling pages | **PARTIAL** — `<link rel="prefetch">` for **every** sibling page on every page view: no Safari/iOS effect, ignores Save-Data, fetches pages nobody clicks | `lib/box-export.ts:879` `prefetchLinks`, used at `:803` |
| Speculation rules | **GAP** | grep: no `speculationrules` |
| Preview can show a page transition | **GAP** — the Preview is a `srcdoc` iframe (`lib/box-export.ts:892` comment); cross-document VT runs in the main frame only | Chrome cross-document doc, "Limitations" |
| Shared-element morph source (list card ↔ detail page relation) | **GAP** — no collections/detail pages in the model | `lib/box-model.ts` has no collection type |
| SPA router (Barba/Swup) | not wanted — see 1.4 | — |

---

## 3. Gap list

| Id | Plain description | Sort |
|---|---|---|
| **PT-1** | Opt the exported site into cross-document View Transitions: `@view-transition { navigation: auto }` in `styles.css`, inside `(prefers-reduced-motion: no-preference)`, with the root fade retimed to the tokens. Zero JS, zero bytes of script. | **DECIDE** — on by default (fade only) or a site setting that starts off |
| **PT-2** | Its own reduced-motion guard: the opt-in lives inside `no-preference`, and `::view-transition-group(*)` gets `animation-duration: 0s` under `reduce`, because `base.ts:145` does not reach the pseudo-elements. | **MUST** (with PT-1) |
| **PT-3** | A `page` duration token (≈300 ms, ≤ 400 ms) and the token renames motion-effects §3 already proposed; the transition reads tokens, never a literal. | **MUST** (with PT-1) |
| **PT-4** | A short NAMED list of page-transition presets on the site (None · Fade · Slide · Wipe), built like `HOVER_EFFECTS`: data with `moves`, the exporter emits the reduce fallback. Slide/Wipe name the header (`view-transition-name: site-header`, group `animation:none`) so it stays still. Direction-aware slide needs a 3-line `pagereveal` script — decide whether one tiny script is acceptable. | **DECIDE** |
| **PT-5** | Replace prefetch-everything with speculation rules `prefetch` at `moderate` eagerness (turns off under Save-Data / battery saver; fetches only what is about to be clicked). Keep or drop `<link rel=prefetch>` as the Firefox path; never `prerender` by default. | **DECIDE** (RULE AF: data cost) |
| **PT-6** | The Preview cannot show a cross-document transition (srcdoc iframe = not the main frame, no real URLs). Either open the export in a real top-level tab served over http for the transition check, or state in the guide that the effect is seen only on the published site. | **DECIDE** + **CHECK** |
| **PT-7** | UAT lines for PT-1: back/forward animates; reload and typed URL do not; reduce → no animation; Firefox/Samsung Internet → plain navigation with no errors; focus lands at the document start and the screen reader reads the new title; swipe-back on iOS Safari / Chrome Android does not animate twice; a slow-3G navigation over 4 s just appears. | **CHECK** |
| **PT-8** | Uniqueness guard: any `view-transition-name` the exporter writes must be unique per page (a duplicate silently cancels the whole transition). A unit test over the exported HTML. | **MUST** (once anything is named) |
| **PT-9** | Shared-element morph (news card image → article hero, staff card → profile) needs collections and detail pages in the model first. | **LATER** (component: collections) |
| **PT-10** | Same-document View Transitions for in-page changes — pager slide, tabs, accordion, filtered lists — now Baseline (Oct 2025). | **LATER** (motion polish per component) |
| **PT-11** | Barba/Swup-style router: record the decision NOT to ship one; revisit only for a component that must survive navigation (e.g. a school radio/audio player), and then with Swup's a11y behaviour (announce, focus reset, reduced motion). | **LATER** |

---

## 4. Added 2026-10-02 (redo) — what the full read taught

Only what is NEW. Sections 1–3 and motion-effects §4 / §7 still hold. Builder claims below were checked with grep on
2026-10-02 and carry file:line.

### 4.1 Where the opt-in must live (vtbag "fails and fixes")

- **Fact:** Chrome checks `@view-transition { navigation: auto }` together with `pagereveal`, just before first render.
  The spec says it should wait for render-blocking stylesheets, but **Chrome may check before a large external
  stylesheet has loaded**. Symptom: "sometimes it animates, sometimes not; works with DevTools open".
- **Fix:** put the opt-in in a small inline `<style>` early in `<head>`, before the `<link rel=stylesheet>`.
  ```html
  <style>@media (prefers-reduced-motion: no-preference){@view-transition{navigation:auto}}</style>
  <link rel="stylesheet" href="styles.css">
  ```
- **Second fact:** in a cross-document transition **all pseudo-element styling comes from the page you arrive on** —
  even the exit animation of the page you left. The old page only decides which elements get names.
- **Educo today:** the opt-in planned in PT-1 would go in `styles.css`. That file **starts with the embedded fonts as
  data: URIs** (`lib/box-export.ts:813` — `[fontCss, sharedCss(theme), SITE_CHROME_CSS]`), so the rule would sit after
  the heaviest CSS on the site — exactly the unreliable case. `pageDocument` already writes a per-page `<style>` in
  `<head>` (`lib/box-export.ts:906`), but it comes after the `<link>` (`:901`, `:905`). → **PT-12**.
- **Cost on a 3G phone:** none extra; about 60 bytes per page.

### 4.2 Choosing the animation with zero JavaScript (CSS-Tricks "types descriptor", MDN blog)

- `@view-transition { navigation: auto; types: slide; }` — the **types of the page you arrive on** are the active
  types. So a page can say "arrive by sliding" with no script. It cannot know where the visitor came from, so it
  cannot do "back = reverse".
- The MDN beginner guide does the same with a different stylesheet per page (`index.css` has slide-to-right,
  `hobbies.css` has slide-from-right).
- **Support:** types — Chrome 125, Safari 18.2, Firefox 147 (Firefox 144–146 had view transitions without types).
- **Educo today:** PARTIAL — each page already has its own `<style>` (`lib/box-export.ts:906`), so a per-page
  "arrive with" choice is one line in that block. → **PT-13**.

### 4.3 Direction from page order (Chrome "Stack Navigator", vtbag Turn-Signal, view-transitions-toolkit)

- A small classic `<script>` in `<head>` (not `type=module` — that runs too late) listens to `pagereveal` and
  `pageswap`, compares `navigation.activation.from` and `.entry` (or their positions in a known page list) and adds a
  `forward` / `backward` type. Turn-Signal derives the order from a CSS selector over the nav links; the toolkit's
  "navigation types" module does the same from URL patterns.
- Without the Navigation API, the script still works for link clicks; only back/forward detection is lost.
- **Educo today:** the exporter knows the page order (`orderedPages`, `lib/box-export.ts:727`) and every filename
  (`siteFileMap`, `:706`). It ships no head script today (`pageDocument`, `:896-907`). → **PT-14** (decide: is a
  ~400-byte script acceptable for a direction-aware slide?).

### 4.4 Do not name what is off-screen, and do not name tall blocks (Bramus offscreen demo, vtbag pseudo-smooth-scrolling)

- **Problem 1 — the flying header.** Pattern 5 in motion-effects §7 names the header so it stays still. If the visitor
  has scrolled the header away, its old snapshot is above the viewport and the header **flies in** from the top.
- **CSS-only fix** (from `view-transitions.chrome.dev/scrolling/offscreen-elements/with-fix-manual/`, source read):
  give the name only while the element is in view, using a scroll-driven animation.
  ```css
  @keyframes eu-vt-name-in-view { from, to { view-transition-name: site-header; } }
  header { view-transition-name: none; animation: eu-vt-name-in-view linear both; animation-timeline: view(); }
  ```
  Support: `animation-timeline` Chrome 115, Safari 26. Firefox has no cross-document view transitions anyway. A
  pinned header is always in view, so it keeps its name.
- **Problem 2 — pseudo-smooth-scrolling.** If a tall element (for example `main`) is named and the visitor is scrolled
  down, the morph slides the old content up through the viewport. It looks like smooth scrolling and is motion the
  visitor did not ask for. **Rule: only `root` and the header/footer bars get names in a page transition.**
- **Educo today:** bars are known — a band with `tag === "header"` or `"footer"` (`lib/box-model.ts:2531`, `:4736`);
  pinned bars get `data-eu-pin` (`lib/box-export.ts:538`). → **PT-15**.

### 4.5 Cost on a low-cost Android — new facts

- **Snapshotting is cheap:** at most about two frames of delay on the old page; the data comes straight from the
  compositor (Chrome "misconceptions" article).
- **A morph is not cheap:** every `::view-transition-group(name)` animates `width` and `height`, which runs on the
  **main thread**, even when the size does not change (Bramus, "More performant group animations"). The root fade only
  animates the opacity of old/new. So **Fade is the safe default for phones; morphs cost**. The toolkit's
  `optimizeGroupAnimations()` swaps those keyframes for a `translate` when the size is unchanged.
- **Naming up front costs:** every named element is captured on every navigation. CSS-Tricks Part 2 reports stutter
  or skipped transitions on mid-range Android with a named product grid. The fix is to name **just in time** in
  `pageswap`/`pagereveal` and clear the names after `finished` (what Astro's `transition:name` does).
- **The opt-in can be gated by screen size:** `@media (min-width: 48rem) { @view-transition { navigation: auto } }`
  is valid. Phones could get plain navigation, or only the fade.
- **Mobile coordinates differ:** pseudo-elements are positioned against the *snapshot containing block*, which
  includes the URL bar; `getBoundingClientRect()` does not. Mixing them makes a jump on Android (Bramus). Matters only
  if a script writes keyframes.
- → **PT-16**.

### 4.6 The page is a sheet of glass while it animates (vtbag interactivity, Bramus, CSS-Tricks)

- During any document-scoped transition the `::view-transition` layer covers the page and takes every click.
  Snapshots are images; they have no listeners.
- For same-document component transitions clicks can pass through:
  `::view-transition { pointer-events: none }` + `:root { view-transition-name: none }`.
- **Element-scoped** transitions (Chrome 147, `el.startViewTransition()`) fix this properly: only the scope stops
  taking input; the scope keeps its `overflow` clipping (the UA sheet gives it `view-transition-name: root` and
  `view-transition-group: contain`); several can run at once; **fixed/sticky things and popovers outside the scope
  stay on top** — a document-scoped transition paints over them.
- **Educo today:** pinned bars (`data-eu-pin`, `lib/box-export.ts:538`) would be painted over by a document-scoped
  tab or slider transition. → **PT-17** (refines PT-10).

### 4.7 Emission trap: never scope the pseudo-elements (vtbag "Build")

- Tools that scope CSS turn `::view-transition-group(*)` into `::view-transition-group(*):where(.scope)`, which
  matches nothing — the pseudo-elements hang off `<html>`.
- **Educo today:** base rules are written under `.eu-root` (`lib/educo-ui/base.ts:145` is one) and the page body
  carries `class="eu-root"` (`lib/box-export.ts:907`). A view-transition rule written the same way would silently do
  nothing. → **PT-19**.

### 4.8 Debugging and UAT tools learned

- Log the outcome on every page while testing (CSS-Tricks Part 1):
  `addEventListener('pagereveal', e => e.viewTransition?.finished.catch(err => console.warn(err.name)))`.
  `TimeoutError` is the 4-second limit; `AbortError: Transition was skipped` is usually a missing opt-in on the
  arriving page.
- Chrome DevTools → Animations panel pauses and scrubs a running transition; since Chrome 139 it shows rules that
  target a `view-transition-class`.
- A transition with **no running animation ends right after the snapshots** (vtbag). So `animation-duration: 0s` on
  all groups under reduce is a correct "off" (PT-2 holds).
- Duplicate names: older engines skip the whole transition; vtbag notes newer versions may only ignore the duplicate.
  PT-8 still holds — a unit test is the only safe answer.
- Name characters: stick to `A–Z a–z 0–9 - _`, not starting with a digit; anything else needs `CSS.escape()`.
- → **PT-18**.

### 4.9 Reference details not in sections 1–3 (MDN reference pages, Chrome 2025 update)

- UA defaults: `::view-transition-group(*)` has `animation-duration: .25s; animation-fill-mode: both`; old/new are
  `inline-size: 100%; block-size: auto`, so aspect is kept — which is why text morphs "zoom". Jake's aspect-ratio post
  fixes it with `height: 100%` + `object-fit: none` + `overflow: clip`, or with nested groups.
- Since Chrome 140 old/new/image-pair **inherit all `animation-*` longhands** from the group, so setting duration and
  easing on the group is enough. `finished` no longer waits an extra frame (no flicker at the end).
- `::view-transition` is `position: fixed; inset: 0` in the UA sheet; Chrome 142 changes it to `absolute` (not
  visible).
- A named pseudo has the specificity of a type selector; `*` has zero.
- `updateCallbackDone` is fulfilled automatically for cross-document transitions.
- `skipTransition()` works from both `pageswap` and `pagereveal`.
- `CSSViewTransitionRule` exposes `navigation` and `types` to script (Limited availability).
- `document.activeViewTransition`: Chrome 142, Firefox 147, Safari 26.2. `NavigateEvent.hasUAVisualTransition` is
  **Baseline 2026** (January 2026).
- `view-transition-name: match-element` is same-document only (element identity differs across documents) and gives
  no name to target. `attr(data-id type(<custom-ident>))` gives real names but is Chromium-only today.
  `ident("card-" sibling-index())` is only a proposal.
- `document.prerendering` + `prerenderingchange` + `activationStart > 0` tell a page it was prerendered.

### 4.10 Speculation rules — the guidance page (Chrome, updated Oct 2025)

- Three ways to ship rules: an inline `<script type="speculationrules">` (fits a static export), injected by JS, or a
  `Speculation-Rules:` HTTP header pointing to a JSON file.
- **Start with prefetch**, and exclude side-effect URLs with `{"not": {"href_matches": "/logout"}}`; small static sites
  may go more eager. The next step it recommends — eager prefetch of the 1–2 likely next pages plus moderate prerender
  of the rest — is not for metered data (RULE AF).
- **Different from `<link rel=prefetch>`:** a speculated document is processed like a real navigation and held in
  memory (about 5 minutes), not just put in the HTTP cache.
- New fields: `tag` (sent as `Sec-Speculation-Tags`), `target_hint: "_blank"` (prerender only),
  `expects_no_vary_search`, and the coming `prerender_until_script`. None is needed for a static school site.
- **Measure wastage** on the arriving page with `activationStart`; the starting page cannot see it.
- Chrome may raise the mobile limit for eager/moderate prefetch from 2 to 5.
- → feeds **PT-5**; new measuring line **PT-20**.

### 4.11 Barba.js — the whole docs (23 pages + examples)

- **Model:** `data-barba="wrapper"` stays; `data-barba="container"` is swapped; `data-barba-namespace` names the page.
  The next container is **appended at the end of the wrapper**, so a cross-fade (`sync: true`) needs
  `position: absolute` on the containers.
- **Hooks in order:** beforeOnce · once · afterOnce · before · beforeLeave · leave · afterLeave · beforeEnter · enter ·
  afterEnter · after. Rules pick a transition by `from`/`to` namespace, route (`@barba/router`) or custom function.
- **No animation included** — GSAP, anime.js and others are the expected companions (more weight).
- **Strategies:** caches pages for the session; prefetches on hover by default; `@barba/prefetch` fetches links that
  **enter the viewport** (quicklink-style, IntersectionObserver, `limit`, `timeout`); the request timeout is 2 s by
  default — a slow page **aborts the transition**.
- **@barba/css** adds Vue-style classes (`barba-leave`, `-leave-active`, `-leave-to`, the same for enter and once).
- **@barba/head and @barba/preset are still "coming soon"**: Barba does **not** update `<head>` (styles, meta, scripts
  of the next page). Inline scripts run once only; analytics page views must be sent by hand in the `after` hook;
  scroll restoration on back must be handled by hand (`history.scrollRestoration = 'manual'`).
- **Accessibility:** no guidance anywhere in the docs (confirmed again on every page).
- **Support:** modern browsers without polyfills; the docs warn that polyfill.io is compromised.

### 4.12 Swup — every page (61)

- Classes on `<html>`: `is-changing`, `is-animating`, `is-leaving`, `is-rendering`, `to-[name]` (per link via
  `data-swup-animation`). Swup waits for CSS transitions on `[class*="transition-"]` elements.
- **`native: true`** hands the animation to same-document View Transitions.
- **Preload plugin:** on hover with a mouse, **on touchstart on phones (~80 ms gain)**, on keyboard focus; at most 5
  requests at once; viewport preloading optional.
- **Parallel plugin** keeps old and new pages together (slideshow, reveal). **Fragment plugin** swaps only a part
  (filters, tabs, modals). **Progress plugin** shows a bar after ~300 ms. **Head plugin** copies the next page's
  `<head>` assets and `lang`/`dir`, and can wait for new stylesheets. **Scroll plugin** handles anchors and offsets.
- **Common issues page:** the next page's stylesheets are not loaded without the Head plugin; screen readers are not
  told — use the A11y plugin; canonical tags go stale.
- **Support:** Chrome/Edge 80, Safari 13.1, iOS 13.4, Firefox 74.
- **Showcase:** 33 sites listed in `swup/docs/src/showcase/*.md`; all collected for the browser run.

### 4.13 Why a router is still wrong for Educo — now with a code reason

Barba and Swup swap the body container and **do not load the next page's own `<head>` styles** unless a head plugin
does it (Barba has none yet). An Educo page carries its component CSS, its block CSS and its backdrop in a per-page
`<style>` in `<head>` (`lib/box-export.ts:803`, `:906`), subsetted to that page. After a router swap the next page's
blocks would arrive **unstyled**. With section 1.4 this settles PT-11 as "do not ship".

### 4.14 Codrops (route: GitHub READMEs + web search; articles 403)

- 29 page-transition demos found, 2013–2026. Most older ones (PageTransitions 2013, MorphingPageTransition 2017,
  KineticTypePageTransition 2021, CoverPageTransition 2022, PageRevealEffects, PixelTransition, LayersAnimation…) are
  **single-document "page" effects**: an overlay, curtain, SVG morph or pixel grid covers the screen while content is
  swapped in the same document — built with anime.js or GSAP.
- Newer ones use real navigation: "Animating multi-page navigations with View Transitions and Astro" (2023,
  `codrops/astro-shop-view-transitions`, demo `astro-shop-ten.vercel.app`), "Custom page transitions in Astro with
  Barba.js and GSAP" (Apr 2026), "Scroll-revealed WebGL gallery with GSAP, Three.js, Astro and Barba" (Feb 2026),
  "Persistent page transitions with WebGPU" (Jun 2026), "Seamless 3D transitions with Webflow, GSAP and Three.js"
  (Mar 2026). Titles from search only — text not read.
- **For Educo:** the overlay / curtain / wipe *looks* can be made with `clip-path` on the root pseudo-elements, or a
  coloured `::view-transition` backdrop — no library. The WebGL and WebGPU versions break the RULE AF weight budget.
- 3D page flips do not work with `perspective` on `html` (CSS-Tricks "3D view transition"); put `perspective()` inside
  the `transform` instead.

### 4.15 Other things read and set aside

- **view-transitions-mock** (Bramus): a non-visual polyfill of the same-document JS API. Not needed for a static
  export; useful later if component scripts call `startViewTransition` and must not crash on old browsers.
- **Two-phase transitions** via the Navigation API `precommitHandler` (Chrome 141): animate into a loading state
  before the next page commits. SPA-only; LATER at most.
- **Auto-triggered transitions** with `MutationObserver` / `StyleObserver` (Bramus experiments): marked "do not use in
  production" by the author.
- **Element Crossing** (vtbag): carries open/closed state and form values across a cross-document navigation via
  `sessionStorage`. Not needed now; note for forms later.
- **Over-exposure:** a hand-written fade must keep `mix-blend-mode: plus-lighter` on the pair, and should not reuse
  the fade-out keyframes `reverse`d for the fade-in when timings differ.
- **Smashing a11y snippet:** `@media (prefers-reduced-motion) { ::view-transition-group(*), ::view-transition-old(*),
  ::view-transition-new(*) { animation: none !important; } }` — the same idea as PT-2, written unscoped (see PT-19).

### 4.16 New gaps (redo)

| Id | Plain description | Sort |
|---|---|---|
| **PT-12** | Put the cross-document opt-in in a tiny inline `<style>` at the very start of `<head>`, before the `styles.css` link — not inside `styles.css`, which starts with the embedded fonts (`lib/box-export.ts:813`) and is where Chrome may miss the rule. Keep the pseudo-element styling on every page, because the arriving page's CSS runs the whole animation. | **MUST** (with PT-1) |
| **PT-13** | A per-page "arrive with" choice (fade / slide / wipe) written as `@view-transition { types: … }` into the page's own `<style>` (`lib/box-export.ts:906`) — zero JavaScript. | **DECIDE** (part of PT-4) |
| **PT-14** | Direction-aware slide (back = reverse): one small classic head script reading `navigation.activation` against the exported page order (`orderedPages`, `lib/box-export.ts:727`). The only script page transitions would need. | **DECIDE** (yes/no to a ~400-byte script) |
| **PT-15** | Name only `root` and the header/footer bars (`tag` header/footer, `lib/box-model.ts:4736`); give a non-pinned header its name only while it is in view (`animation-timeline: view()` trick); never name `main` or tall sections. | **MUST** (with PT-4) |
| **PT-16** | Phone cost rule: Fade is the default and the only preset on narrow screens unless the user opts in; morphs (group width/height animations run on the main thread) are capped to a handful per page and named just in time. Decide whether to gate Slide/Wipe behind `min-width: 48rem`. | **DECIDE** (RULE AF) |
| **PT-17** | In-page component transitions (pager, tabs, filters — PT-10) use element-scoped `el.startViewTransition()` where supported, so pinned bars (`data-eu-pin`, `lib/box-export.ts:538`) and popovers stay on top and the rest of the page keeps taking clicks; otherwise an instant change. | **LATER** (with PT-10) |
| **PT-18** | UAT harness for page transitions: in test runs, log the `pagereveal` outcome (finished / `TimeoutError` / skipped) per navigation, on Fast and Slow 3G profiles and on a low-cost Android preset; read it in the sweep report. | **CHECK** (extends PT-7) |
| **PT-19** | Emit every view-transition rule **unscoped** (never under `.eu-root` like `lib/educo-ui/base.ts:145`), with a unit test that the exported CSS has `::view-transition-` selectors with no class prefix. | **MUST** (with PT-1) |
| **PT-20** | If PT-5 ships speculation rules: measure bytes fetched per page view and the share of prefetches used (`activationStart`) on the 360px phone profile, and report them beside the weight budget. | **CHECK** (RULE AF) |

**Still NOT READ after the redo:** the Codrops article texts (403, archive offline — demos and repos collected
instead); the Barba showcase list (script-filled, no endpoint, archive offline); 23 vtbag tool/course pages (tool
manuals); talk videos. Every live demo found is in `scratchpad/demos/pt.json` (348 URLs) for the browser half to open.
