# 05 · Entrance and exit animation in CSS today

How a thing arrives and leaves: `@starting-style`, `transition-behavior: allow-discrete`, animating `display` and
`content-visibility`, `overlay`, `<dialog>` and popover open/close, `interpolate-size` / `calc-size()` for
`height: auto`, `<details>` with `::details-content`, and exit-before-removal. Each technique is marked against the
builder (HAVE / PARTIAL / GAP), with file:line evidence. Gaps are numbered **EX-n**.

Compiled 2026-10-02. **This extends** [../motion-effects.md](../motion-effects.md). That file already holds:
the one-line mention that `@starting-style` + `allow-discrete` gives an entrance (§2), the `view()` entrance with an
IntersectionObserver fallback (§4 "Fade / rise…"), the overlay-menu note "use `<dialog>` or popover with
`@starting-style`" (§4, §9), and the accordion note "`::details-content` + `interpolate-size`, or `0fr → 1fr`" (§4).
**New here:** the exact mechanics and ordering traps, browser support measured from MDN's compat data on this date
(including the Firefox and Safari holes those one-liners hid), the exit side of every pattern, the keyframe
alternative, and a code-verified audit of the builder.

---

## Sources and completeness

Browser versions come from MDN's browser-compat-data (`mdn/browser-compat-data`, main branch, fetched 2026-10-02),
not from the prose of each page, because the prose lags.

| Source | What it holds | Read | Not read (why) |
|---|---|---|---|
| MDN `@starting-style` | syntax (standalone, nested), the 3 states, cascade order, transitions only, 4 examples (colour, display, popover + backdrop, add/remove from DOM), compat, see-also | all sections | ~~the `CSSStartingStyleRule` API page~~ — **closed 2026-10-02 (redo):** read; it is only the CSSOM wrapper (`CSSRule → CSSGroupingRule → CSSStartingStyleRule`), no own members, no demo, Baseline 2024. No builder use. |
| MDN `transition-behavior` | values, the `display`/`content-visibility` flip rule, popover example, compat | all | – |
| MDN `overlay` | browser-only property, use in transitions, example, compat | all | – |
| MDN `interpolate-size` | values, inheritance, keywords, reveal example, compat | all | – |
| MDN `calc-size()` | basis, `size` keyword, examples, limits | all | – |
| MDN `::details-content` | what it selects, fade example with `content-visibility allow-discrete`, compat | all | – |
| MDN Popover API guide ("Using the Popover API") | 24 sections: declarative, `command`/`commandfor`, auto/manual/hint, light dismiss, a11y, events, nesting, stacks, styling, `::backdrop`, anchor positioning, transition and keyframe animation | all | ~~anchor-positioning detail~~ — **closed 2026-10-02 (redo)** for the popover part only: the implicit anchor is lost when the popover leaves the top layer, so `overlay` must be in the transition list (web.dev "Popover and dialog"); the Chrome anchor-positioning article and its 10 pens are in the demo list. The positioning maths stays with layout. |
| MDN `<dialog>` | attributes incl. `closedby`, modal vs non-modal, methods, `method="dialog"`, `::backdrop`, a11y, transition + keyframe animation, invoker commands, compat | all | – |
| developer.chrome.com "Four new CSS features for smooth entry and exit animations" | display in keyframes, `transition-behavior`, `@starting-style`, `overlay`, dialog/popover code, nesting-order update (Chrome 130) | all | ~~linked specs~~ — **closed 2026-10-02 (redo):** css-transitions-2 and css-values-5 fetched for their examples only (they match MDN's). The 9 embedded pens and the jsfiddle were NOT in the first pass; now listed in `demos/ex.json`. |
| developer.chrome.com "Animate to height: auto" | `interpolate-size`, `calc-size()`, opt-in reason, examples, `@supports` fallback, layout cost | all | Chromium bug links — still NOT READ (bug threads, not teaching; no demo). The 6 embedded pens were missed the first time; now listed. |
| MDN browser-compat-data JSON | `starting-style`, `transition-behavior` (+ transitionable display / content-visibility), `overlay`, `interpolate-size`, `calc-size`, `details-content`, `dialog` (+ `closedby`), popover methods, `button.command`, `@view-transition` | all the keys listed | – |
| Code: `lib/interactions.ts`, `lib/box-model.ts`, `lib/box-export.ts`, `lib/educo-ui/components.ts`, `lib/educo-ui/base.ts`, `components/website/box/` | the builder's entrances, exits, accordion, dialogs | grepped and read at the lines cited | – |

**Added 2026-10-02 (redo) — sources read in the redo.** Route: every page was fetched as raw HTML with `curl`
(so iframe embeds and `data-slug-hash` pens are visible; the WebFetch summary drops them), converted to text and
read in full. MDN live samples have no standalone URL any more (`live.mdnplay.dev/…/runner.html` answers 400; the
playground builds them in the page), so they are listed as `page#sample-id`.

| Source | Read | Demos collected | Not read (why) |
|---|---|---|---|
| MDN `::backdrop` | all | 2 in-page samples | – (its prose still says "does not inherit" — stale, see C-2) |
| MDN `Animation.finished` | all | none | – |
| MDN "Using the Web Animations API" | all | 4 samples + collection `nqNJvD` | – |
| MDN "Using CSS transitions" / "Using CSS animations" | all | 4 + 6 samples | – |
| MDN Popover API overview, Invoker Commands API | all | `dom-examples/popover-api/` (9 pages) + `interest-invokers/` | – |
| MDN live-sample ids on @starting-style, transition-behavior, overlay, interpolate-size, calc-size(), ::details-content, `<dialog>`, Popover guide | re-scanned for every sample id | 25 samples | – (pages themselves read in the first pass) |
| developer.chrome.com "Four new CSS features…" | re-read with embeds | 9 pens + jsfiddle | – |
| developer.chrome.com "Animate to height: auto" | re-read with embeds | 6 pens | Chromium bug links |
| developer.chrome.com "Introducing the popover API" | all | 7 pens | – (its "animation coming later" note is dated 2023) |
| developer.chrome.com "Introducing command and commandfor" | all | none | – |
| developer.chrome.com "popover=hint" | all | 1 pen | – |
| developer.chrome.com "More options for styling `<details>`" | all | 8 pens | – |
| developer.chrome.com "Exclusive accordion" | all | 3 pens | – |
| developer.chrome.com "Changes to `::backdrop` inheritance" | all | 1 pen | – |
| developer.chrome.com "CSS anchor positioning API" | popover parts | anchor tool + collection + 10 pens | positioning maths (layout's) |
| developer.chrome.com "CSS scroll-triggered animations are coming" | all | 7 pens | – |
| developer.chrome.com "A customizable select" | `::picker` transition part | 6 pens + 2 collections | rest is form-component work |
| developer.chrome.com "Same-document view transitions" | add/remove list parts | 2 chrome.dev demos | the rest belongs to 03-page-transitions |
| developer.chrome.com "dialog light dismiss / closedby" | **404** (both guessed URLs) | – | covered instead by MDN `<dialog>`, Matuzović and the blink-dev intent |
| web.dev "Now in Baseline: animating entry effects" | all | 1 pen | – |
| web.dev Learn CSS "Popover and dialog" | all | 9 pens | – |
| web.dev "`<dialog>` and popover: Baseline layered UI patterns" | all | 1 pen | – |
| web.dev GUI challenges: toast, dialog, sidenav, split-button (articles) | all | 7 `gui-challenges.web.app/*/dist/` demos + 6 remix pens/fiddles | tooltip article (**404** on web.dev; its CSS read from GitHub `argyleink/gui-challenges/tooltips/tool-tip.css` instead) |
| nerdy.dev (Adam Argyle): starting-style everything · enter/exit stage effects · interpolate-size · details open/close · nice details · have a dialog · dialogs on top · pop-n-lock · steal this popover · CSS podcast ep 80 · custom select · onload + scroll combo · text replace · card stacks · UI transitions | all 15 (found via `nerdy.dev/sitemap.xml`) | 22 pens + 2 notebook pages + collection | podcast/video episodes (audio/video only) |
| bram.us: yellow fade · ::backdrop inherits · detect @starting-style · height:auto · styling details · animatable accordions talk · DevTools @starting-style · SDA + @starting-style · width/height on compositor · overscroll on dialog · scroll-triggered · details is not an accordion · auto view transitions | all 13 (found via the WordPress search API) | 19 pens + chrome.dev demo | the slide deck (slidr.io, images only) |
| Master.dev / Frontend Masters: In-N-Out parts 1–3 · Animating the dialog element · Scroll-locked dialogs · Dialog vs popover | all 6 | 15 pens (anon/editor embeds) | – |
| CSS-Tricks "CSS Grid can do auto height transitions" | all | 1 pen | – |
| Josh W. Comeau: interpolate-size snippet + newsletter | all | the snippet page (live playground) | – |
| Piccalilli "interpolate-size is progressive enhancement" | all | 3 pens | – |
| LogRocket "Animating dialog and popover with @starting-style" | all | 11 pens | – (repeats MDN/Chrome) |
| OpenReplay "Animate display: none" | all | none | – |
| Open UI popover explainer, invoker and interest-invoker explainers | animation, focus and a11y parts | none | design-history sections |
| Matuzović "Close requests, close watchers, and the dialog" | all | in-page samples | – |
| Scott O'Hara "A toast to an accessible toast" | all | 1 pen + `a11y_tooltips` | – |
| Paul Lewis "FLIP your animations" | all | none | – |
| Jake Archibald | blog index + RSS searched: no dialog/popover animation post exists; read "Fixing my tooltip accessibility mistake" (2026) | 1 demo | nothing else on topic |
| Smashing Magazine | searched; no on-topic article found | – | – |
| MDN browser-compat-data (re-fetched) | `:open`, `animation-trigger`, `timeline-trigger`, `animation-timeline`, `HTMLDialogElement.*`, `::backdrop`, `overscroll-behavior`, `sibling-index()`, `button.command`, `interestfor`, `popover.hint`, `Element.getAnimations` | – | – |

Dead links found inside sources: `evromalarkey.github.io/scrollsnap-drawer` (404, from the sidenav article) and
`open-props-ui.netlify.app/components/inputs/select.html` (404). Not put in the demo list.

---

## Browser support today (2026-10-02, MDN compat data)

| Feature | Chrome | Firefox | Safari | Status for a 2026 Android visitor |
|---|---|---|---|---|
| `@starting-style` | 117 | 129 | 17.5 | Baseline 2024 |
| `transition-behavior: allow-discrete` | 117 | 129 | 17.4 | Baseline 2024 |
| …transitioning **`display`** / `content-visibility` | 117 | **no** | 18 | **not in Firefox** |
| `display` inside `@keyframes` | 116 | (keyframes path works) | 18 | works where keyframes run |
| `overlay` | 117 | **no** | **no** | Chromium only |
| `interpolate-size` / `calc-size()` | 129 | **no** | **no** | Chromium only |
| `::details-content` | 131 | 143 | 18.4 | Baseline 2025 |
| `<dialog>` | 37 | 98 | 15.4 | widely available |
| `<dialog closedby>` | 134 | 141 | preview | not yet in Safari |
| Popover API | 114 | 125 | 17 | Baseline 2024 |
| `popover="hint"` | 151 | 153 | preview | falls back to `manual` |
| Invoker commands (`command`/`commandfor`) | 135 | 144 | 26.2 | newly available |
| Cross-document `@view-transition` | 126 | no | 18.2 | see motion-effects §7 |

**What this means for the builder.** Chrome on Android is the visitor's browser in Nigeria and Ghana, so the
Chromium-only features *will* run for most visitors — but every one must degrade to an instant change, never to a
broken one. The fallback in every case below is "it just appears / disappears", which is correct and accessible.

---

## Techniques

### 1. `@starting-style` — an entrance with no keyframes

- **Plain words:** gives a transition a "from" value for the moment an element first appears (first render, leaving
  `display: none`, or entering the top layer). Without it, transitions never run on first appearance.
- **CSS:**
  ```css
  .card { opacity: 1; translate: 0 0; transition: opacity var(--eu-dur-slow) var(--eu-ease-out), translate var(--eu-dur-slow) var(--eu-ease-out); }
  @starting-style { .card { opacity: 0; translate: 0 1rem; } }   /* AFTER the rule above: equal specificity */
  ```
- **Traps:** it must come *after* the normal rule (same specificity; Chrome 130 changed nesting order). It only feeds
  **transitions**; a keyframe animation needs none of it. Once an element has been shown, later hides go to the
  default state, not back to the starting style.
- **Fallback:** no support → no transition → element simply appears. Safe.
- **Reduced motion:** keep the opacity part, drop the translate (fade is not motion under 2.3.3; see 06).
- **Cost on a low-cost phone:** opacity + transform only = compositor. Cheap.
- **vs. the builder's keyframe entrance:** a keyframe `animation … both` with `from{…}` (what `revealCss` emits) is
  equivalent for page-load entrances and already works everywhere. `@starting-style` matters for things that appear
  *later*: a menu opening, an alert inserted, a filtered item returning.

### 2. `transition-behavior: allow-discrete` — animate `display` and `content-visibility`

- **Plain words:** lets a transition include `display`. The flip is moved so the element is visible for the whole
  animation: `none → block` flips at 0%, `block → none` flips at 100%. This is what makes an **exit** possible with
  CSS alone.
- **CSS:**
  ```css
  .panel { transition: opacity var(--eu-dur-base) var(--eu-ease-in), display var(--eu-dur-base) allow-discrete; }
  .panel[hidden-state] { opacity: 0; display: none; }
  ```
- **Traps:** the `transition` shorthand resets `transition-behavior` to `normal` — write `allow-discrete` per item
  (as above) or set the longhand *after* the shorthand.
- **Support trap (new):** the property parses in Firefox 129+, but Firefox does **not** transition `display`. Firefox
  users get an instant hide. Acceptable; never rely on the exit to finish a task.
- **Alternative that works more widely:** a keyframe exit with `display: none` at 100% (Chrome 116, Safari 18).

### 3. `overlay` — keep a closing dialog/popover in the top layer

- **Plain words:** a browser-set property. Adding `overlay … allow-discrete` to the transition list keeps the element
  in the top layer until its exit finishes; without it the exit is clipped and covered at once.
- **CSS:** `transition: opacity .2s, display .2s allow-discrete, overlay .2s allow-discrete;`
- **Support:** Chromium only. Elsewhere the exit is instant. Never set `overlay` yourself (it is ignored).

### 4. `<dialog>` and popover open/close

- **Plain words:** the platform's own modal and light-dismiss layers. Both open into the top layer, handle Escape, and
  (for `showModal()`) make the rest of the page `inert` and move focus in. Popovers with `popovertarget` need **no
  JavaScript**, which suits a static export.
- **CSS (transition form):**
  ```css
  dialog, [popover] {
    opacity: 0; translate: 0 1rem;
    transition: opacity var(--eu-dur-base) var(--eu-ease-in), translate var(--eu-dur-base) var(--eu-ease-in),
                display var(--eu-dur-base) allow-discrete, overlay var(--eu-dur-base) allow-discrete;
  }
  dialog:open, [popover]:popover-open {
    opacity: 1; translate: 0 0;
    transition-duration: var(--eu-dur-slow); transition-timing-function: var(--eu-ease-out);  /* enter slower than exit */
  }
  @starting-style { dialog:open, [popover]:popover-open { opacity: 0; translate: 0 1rem; } }
  dialog::backdrop { background: transparent; transition: background-color var(--eu-dur-base), display var(--eu-dur-base) allow-discrete, overlay var(--eu-dur-base) allow-discrete; }
  dialog:open::backdrop { background: color-mix(in oklab, var(--eu-color-text) 40%, transparent); }
  @starting-style { dialog:open::backdrop { background: transparent; } }
  @media (prefers-reduced-motion: reduce) { dialog, [popover] { translate: none; } }  /* fade stays */
  ```
- **Keyframe form:** `dialog:open { animation: eu-in … }` / `dialog { animation: eu-out … }` with `display` in the
  keyframes — no `@starting-style`, `allow-discrete` or `overlay` needed. Works in Safari 18 too.
- **Zero-JS open:** `<button popovertarget="menu">` (Baseline 2024) or `<button command="show-modal"
  commandfor="d">` (newly available; 135 / 144 / 26.2). For the export, popover is the safe zero-JS choice today; a
  modal dialog still needs one line of script (`showModal()`) where invoker commands are missing.
- **Accessibility traps:** a modal dialog needs a visible close button; focus returns to the opener on close (the
  platform does this for popovers opened by `popovertarget` and for `<dialog>` closed by the browser); do not put
  `tabindex` on `<dialog>`; `closedby="any"` (light dismiss) is not in Safari yet — keep a close button. The exit
  animation must not delay focus return (Atlassian: "move focus … at animation start").
- **Cost:** opacity/translate on one layer; `::backdrop` with `backdrop-filter: blur()` is a paint cost on a low-cost
  phone — prefer a flat tint.

### 5. `interpolate-size` and `calc-size()` — animate to `height: auto`

- **Plain words:** lets `height: 0 → auto` (and `min-content`, `fit-content`…) transition. `interpolate-size:
  allow-keywords` on `:root` turns it on for the page; `calc-size(auto, size + 1rem)` does it per declaration and
  allows maths.
- **CSS:** `:root { interpolate-size: allow-keywords; }  .more { height: 0; overflow: clip; transition: height var(--eu-dur-slow) var(--eu-ease-standard); }  .more.open { height: auto; }`
- **Support:** Chromium 129+ only. Firefox and Safari: instant. Wrap in `@supports (interpolate-size: allow-keywords)`
  only if the closed state would otherwise be wrong; usually it is not needed — the fallback is an instant jump.
- **Cost (important for RULE AF):** this animates **height — a layout property**, every frame, on the main thread. On a
  low-cost phone keep it to small regions (an accordion answer), short (≤ `slow`), one at a time. Never on a whole
  section. The builder's `LAYOUT_ANIMATION_PROPS` guard refuses user-typed layout animation
  (`lib/box-model.ts:1255`, used at `:1315`); a built-in accordion height animation would be a deliberate, named
  exception.
- **Older alternative:** `grid-template-rows: 0fr → 1fr` on a wrapper — works in every browser, also layout-bound.

### 6. `<details>` open/close with `::details-content`

- **Plain words:** `::details-content` selects the hidden part of a `<details>`. Since the browser hides it with
  `content-visibility`, a transition on `content-visibility … allow-discrete` keeps it visible while it fades out.
- **CSS:**
  ```css
  details::details-content {
    opacity: 0; block-size: 0; overflow-y: clip;
    transition: opacity var(--eu-dur-slow) var(--eu-ease-standard), block-size var(--eu-dur-slow) var(--eu-ease-standard),
                content-visibility var(--eu-dur-slow) allow-discrete;
  }
  details[open]::details-content { opacity: 1; block-size: auto; }   /* height part needs interpolate-size (Chromium) */
  @media (prefers-reduced-motion: reduce) { details::details-content { transition-property: opacity, content-visibility; } }
  ```
- **Support:** the selector is Baseline 2025 (131 / 143 / 18.4). The fade works in Chrome and Safari; Firefox does not
  transition `content-visibility`, so it opens and closes instantly. The height part is Chromium only.
- **Traps:** `find-in-page` and fragment links auto-open `<details>` (`hidden="until-found"` behaviour) — the animation
  must not block that. Keep the `<summary>` the only control; do not add a JS height tween.

### 7. Exit before removal (things that leave the page)

- **Plain words:** content that is removed — a dismissed alert, a closed toast, a filtered-out card — should leave
  without the rest of the page jumping, and without stranding keyboard focus.
- **CSS-first pattern:** set a "leaving" state with `opacity: 0; display: none` and `transition: … display …
  allow-discrete`, then remove the node on `transitionend` (or after the duration as a backstop); or use a keyframe
  with `display: none` at 100%. To close the gap smoothly, the height animation of §5 applies (Chromium) — otherwise
  the gap closes at once, which is fine.
- **Focus rule:** if the removed element contained focus, move focus to a sensible next target (the next alert, the
  region heading) **before** removal; otherwise focus falls to `<body>` and a keyboard or screen-reader user is lost.
- **Announcement:** a status region announces the removal ("Message dismissed") if it matters.

---

## The builder today — HAVE / PARTIAL / GAP

| Technique | State | Evidence (file:line) | Note |
|---|---|---|---|
| Entrance on load (keyframes, `from` only, `both`) | **HAVE** | `lib/interactions.ts:133-142` (`REVEAL_EFFECTS`: fade, rise, drop, from-left, from-right, zoom, sharpen), `:216-248` (`revealCss`), export at `lib/box-export.ts:510-511` | content is never hidden outside the animation (`:120-122`). Good. |
| Entrance on scroll into view | **HAVE** | `lib/interactions.ts:241-243` (`@supports (animation-timeline: view())`, range `entry 0% cover 28%` at `:214`) | without support it plays on load (Firefox today). |
| Stagger | **PARTIAL** | `lib/interactions.ts:236-239` — 90 ms × up to 10 items | last item starts 810 ms late; motion-effects §3 caps total stagger at ~500 ms / 60 ms per item. See EX-6. |
| Entrance + pinned arrival on one block | **HAVE** | `lib/box-model.ts:6339-6366` (one combined animation list) | – |
| Exit of anything | **GAP** | no exit effect in `REVEAL_EFFECTS`; no `allow-discrete`, `@starting-style` or `overlay` anywhere in `lib/`, `components/website/box/` (grep: 0 hits) | EX-1 |
| Alert dismiss / auto-dismiss | **PARTIAL** | `lib/box-model.ts:2024-2035` — inline `transition='opacity .18s,transform .18s'`, `setTimeout(remove,180)` | hard-coded duration (not a token), the page below jumps, and focus is not moved when the focused close button is removed. EX-2, EX-3. |
| Accordion open/close animation | **GAP** | `lib/educo-ui/components.ts:301-332` — native `<details>`, only the `+`/`−` sign and header colour transition; no `::details-content` | EX-4 |
| Horizontal accordion | **PARTIAL** | `lib/educo-ui/components.ts:468` — `transition: flex-grow` | animates a layout property, and `<details>` hides its content instantly, so the panel grows empty. EX-5. |
| `<dialog>` / popover (menu, lightbox, modal) | **GAP** | no `<dialog>`, `showModal` or `popover` in the engine or export (grep: 0 hits). Overlay menu is a component gap (`docs/COMPONENT_GAPS.md`, RULE C). | EX-7 (motion part only; the components themselves are component work) |
| `interpolate-size` / `calc-size()` | **GAP** | 0 hits | used by EX-4 / EX-2 if chosen |
| Reduced motion for entrances | **PARTIAL** | `lib/interactions.ts:245-246` → `animation:none` (no entrance at all); `lib/educo-ui/base.ts:145-147` → every animation and transition `.01ms` | removes the fade too; see MR-1 in 06. |
| Page-to-page entrance (View Transitions) | **GAP** | 0 hits for `@view-transition` | already recorded in motion-effects §7; not repeated here. |

---

## Gap list (entrance / exit)

| Id | Plain description | Sort |
|---|---|---|
| **EX-1** | Nothing can animate *out*. Add an exit to the effect model (fade / sink / slide, each ~0.75× its entrance, `ease-in`), emitted with `display … allow-discrete` or keyframes ending in `display:none`, for things that close or are removed. | DECIDE (which blocks can leave: alert, toast, menu, dialog, filtered items) |
| **EX-2** | The alert's dismiss uses a hard-coded `.18s` inline transition and `setTimeout(remove,180)` instead of the motion tokens and `transitionend`. | MUST |
| **EX-3** | Dismissing an alert removes the focused close button, so focus drops to `<body>`. Move focus to the next alert or the region before removal, and announce it. | MUST |
| **EX-4** | The accordion opens and closes instantly. Add a `::details-content` fade (all three engines) plus a height animation under `interpolate-size` (Chromium; others stay instant), reduced to fade-only under `reduce`. | DECIDE (fade only, or fade + height given the layout cost on low-end phones) |
| **EX-5** | The horizontal accordion transitions `flex-grow` (a layout property) while its content appears instantly — the panel widens empty. Either drop the transition or fade the content in after it. | MUST |
| **EX-6** | Stagger is 90 ms × 10 = 810 ms before the last item starts; cap it (60 ms per item, ≤ 500 ms total) using a `--eu-dur-stagger` token. | MUST |
| **EX-7** | When the menu / modal / lightbox components are built, they open and close with the §4 pattern (popover or `<dialog>`, `@starting-style`, `display` + `overlay` allow-discrete, enter slower than exit, fade-only under `reduce`, focus returned). | LATER (with those components; recorded so they are not built without it) |
| **EX-8** | UAT line: in Chrome, Firefox and Safari, open and close every animated thing (and reload) and confirm the fallback is an instant change, never a stuck half-state or hidden content. | CHECK |

---

## Added 2026-10-02 (redo) — corrections to the support table

Measured from MDN browser-compat-data, re-fetched 2026-10-02.

| Id | What changes | Support | Why it matters |
|---|---|---|---|
| C-1 | `:open` (used in §4's example as `dialog:open`) is **not** old. | Chrome 133 · Firefox 136 · **Safari 26.5** | iPhones on Safari 18 to 26.4 do not match `dialog:open`. Use `dialog[open]` for a dialog and `:popover-open` (Safari 17) for a popover. See EX-9. |
| C-2 | `::backdrop` now **inherits** from its dialog or popover. MDN's prose still says it does not. | Chrome 122 · Firefox 120 · Safari 17.4 | `--eu-*` tokens set on `:root` reach the backdrop. No duplicate token block is needed. |
| C-3 | `dialog.requestClose()` and `<button command="request-close">` | requestClose: 134 / 139 / 18.4 · command: 139 / 144 / 26.2 | A close that fires `cancel` first, so a form can say "unsaved changes". |
| C-4 | `interestfor` (hover or focus opens a popover with no script) | Chrome 142 only | The tooltip trigger of the future. Not for the export yet. |
| C-5 | Scroll-**triggered** animations: `timeline-trigger` + `animation-trigger` | Chrome 146 (BCD; the Chrome post says 145) · Firefox no · Safari no | Time-based "play when it enters, reverse when it leaves". See T-12 and EX-16. |
| C-6 | `animation-timeline: view()` | Chrome 115 · Firefox preview · **Safari 26** | The builder's scroll entrance now runs in Safari 26 too. Firefox still plays it on load. |
| C-7 | `overscroll-behavior` on a box that does not scroll | Chrome 144 | Scroll lock behind a modal with CSS alone (T-8). |
| C-8 | `sibling-index()` | Chrome 138 · Firefox 154 · Safari 26.2 | One rule can stagger any number of items (T-11). |
| C-9 | `Element.getAnimations()` | 84 / 75 / 13.1 | Safe to use in the export's small scripts for "wait for the exit, then remove". |

## Added 2026-10-02 (redo) — techniques the first pass did not hold

### T-1. The three states, in reverse source order (Master.dev "In-N-Out", Una Kravets, Adam Argyle)

- Every enter/exit has three styles: **on the way out** (the closed rule), **open**, and **on the way in**
  (`@starting-style`). Write them in that order. `@starting-style` adds no specificity, so it must come last.
- The way-in and way-out styles do not have to match. A readable choice: in from `scale: 1.1`, out to `scale: .9`,
  and the exit a little faster than the entry (Adam: `.5s` in, `.4s` out, `ease-out` on the exit).
- Transitions can be **interrupted**: closing a dialog half-way through opening reverses smoothly. Keyframes restart.
  Adam and the Open UI explainer both prefer transitions for dialog and popover for this reason.

### T-2. The keyframe-only route (Frontend Masters "Animating the dialog element")

- `dialog[open] { animation: open … }` works wherever `<dialog>` works. No `@starting-style` needed.
- For the exit you still need `transition: display … allow-discrete, overlay … allow-discrete` (both are set by the
  browser and cannot sit in keyframes), plus a separate `close` keyframe on the closed rule. The animation must be at
  least as long as that transition.
- **Trap:** a `close` keyframe on the closed rule also plays once on page load. Adam's GUI dialog adds a `loading`
  attribute and removes it after the first animations finish.

### T-3. Wait for the exit, then remove — without a magic number

- MDN's own sample removes the node with `setTimeout(…, 1000)`. That number must match the CSS by hand.
- Better (MDN `Animation.finished`, Adam's toast and dialog):
  ```js
  const done = (el) => Promise.allSettled(el.getAnimations().map((a) => a.finished));
  el.hidden = true;          // or add the "leaving" class
  await done(el);            // an empty list (reduced motion, no support) resolves at once
  el.remove();
  ```
- `allSettled`, not `all`: a cancelled animation rejects `finished`.
- `transitionend` is weaker: it does **not** fire when a transition is cancelled, and it fires once per property.
- Phone cost: none worth measuring; one promise per animation.

### T-4. A leaving element can still be clicked and focused

- With `allow-discrete`, the element stays `display: block` until the exit ends. For those 150–400 ms its buttons
  and links still take clicks and focus (CSSWG issue 8389, linked from the Open UI popover explainer).
- Fix: make it `inert` at the **start** of the exit (Adam's dialog sets `inert` on `close` and removes it on open).
  For a CSS-only exit, `pointer-events: none` in the leaving state stops the pointer; only `inert` stops the
  keyboard. See EX-10.

### T-5. An entrance keyframe can swallow a transition exit (Bramus, "Combining SDA with @starting-style")

- Animations sit above transitions in the cascade. With `animation-fill-mode: both`, the finished entrance keeps
  applying its implicit `to` keyframe, which reads the **end** value of the property, never the in-between one.
- Result: a transition on the same property (opacity, translate) jumps instead of animating.
- The builder's entrance uses `both` (`lib/interactions.ts:232`). Keyframes that only have `from` do not need the
  forwards half; `backwards` keeps the hold during the stagger delay and frees the property afterwards. See EX-11.
- Bramus's workaround when both must coexist: transition a registered custom property (`@property --loaded`) and
  read it in the keyframe's `to`.
- Adam's related trick ("A keyframe combo"): list the scroll-driven animation first and the load animation second;
  the load one sets only `from`, the scroll one only `to`, and the two blend.

### T-6. Close requests — Escape is not the only "close" (Matuzović; MDN `<dialog>`)

- A modal `<dialog>` and an `auto`/`hint` popover close on a **close request**: Esc, the **Android back button**, the
  TalkBack "back" gesture, a game-pad back button.
- A home-made `<div>` overlay gets none of these. On an Android phone (RULE AF's main visitor) the back button then
  leaves the page instead of closing the menu. See EX-15.
- `closedby="any" | "closerequest" | "none"` sets which closes are allowed. A modal defaults to `closerequest`.

### T-7. Focus on open and on close, done by the platform

- `showModal()` makes the rest of the page `inert`, adds `aria-modal`, moves focus in, and returns focus to the
  opener on close. A popover moves focus to its next tab stop and returns it on Esc or light dismiss.
- `autofocus` inside the dialog picks the first focus. Adam's advice: put it on **Cancel**, not Confirm.
- A popover does **not** trap focus and does not make the page inert. If the user must answer first, it is a
  dialog, not a popover (Frontend Masters "Dialog vs popover").
- Adam's dialog article notes that taking over `display` yourself (the old animation hack) loses the built-in focus
  return. The `allow-discrete` route keeps it, because the browser still runs `close()`.

### T-8. Scroll lock behind a modal

- Chrome 144 (Bramus): `dialog { overscroll-behavior: contain } dialog::backdrop { overflow: hidden; overscroll-behavior: contain }`.
  The `overflow: hidden` makes the backdrop a scroll container that does not scroll, so the page behind cannot move.
- Elsewhere (Chris Coyier): `html:has(dialog:modal) { overflow: hidden }`, paired with `scrollbar-gutter: stable` so
  the page does not shift sideways when the scrollbar goes. Apply it to `:modal` only — a non-modal dialog may want
  the page to scroll.

### T-9. Popover types: auto, hint, manual (Chrome "popover=hint", web.dev Learn)

| | light dismiss | closes others | nesting |
|---|---|---|---|
| `auto` (menus) | yes | other `auto` and `hint` | yes |
| `hint` (tooltips, hover cards) | yes | other `hint` only | joins the `auto` stack when opened inside one |
| `manual` (toasts) | no | nothing | – |

- `hint` falls back to `manual` where unsupported (Safari today): a tooltip still opens but does not auto-close.
- Popovers are hidden by `display: none`. Writing `[popover] { display: grid }` shows them all. Put the display on
  `:popover-open`.
- A popover positioned by its implicit anchor loses the anchor when it leaves the top layer, so `overlay` must be in
  the transition list or the exit jumps.

### T-10. Tooltips (GUI challenge "tooltips", Jake Archibald 2026, Scott O'Hara)

- Show after a short delay, hide at once: `transition-delay: 200ms` only on the shown state.
- Opacity plus a small translate, `.2s`, `pointer-events: none` on the tooltip.
- **Accessible name:** if the tooltip *is* the label of an icon button, connect it with `aria-labelledby`.
  `aria-describedby` only adds a description; an icon button with only a description has no name (Jake's 2026 bug,
  found by TetraLogical: JAWS read a neighbour's tooltip as well).

### T-11. Stagger without nine rules (Bramus)

- `transition-delay: calc(min(sibling-index(), 10) * 100ms)` — one line, any count, capped.
- Bramus caps it because with 138 items the last one waited 13.8 s. Same reason as EX-6's cap.
- Where `sibling-index()` is missing there is no delay; the items arrive together. Acceptable.

### T-12. Scroll-triggered vs scroll-driven entrances (Chrome, December 2025)

- **Scroll-driven** (`animation-timeline: view()`, what the builder emits) ties progress to the scrollbar: stop
  scrolling and it stops; scroll back and it plays backwards.
- **Scroll-triggered** (`timeline-trigger: --t view() entry 100% exit 0%` + `animation-trigger: --t play-forwards
  play-backwards`) starts a normal timed animation when the element crosses a line. It feels like the
  IntersectionObserver "reveal once" pattern, with no script.
- A narrower activation range and a wider active range stop flicker at the edge
  (`contain 15% contain 85% / entry 100% exit 0%`). `trigger-scope` is needed when one rule declares the trigger on
  many elements.
- Chromium only. Fallback: the animation plays on load.

### T-13. `<details>` in more detail (Chrome "More options for styling details", Bramus's talk, Adam's "Nice details")

- `display: flex | grid` now works on `<details>` (Chrome 131+). A **horizontal accordion** animates
  `::details-content { width: 0; transition: width .5s, content-visibility .5s allow-discrete }` to
  `[open]::details-content { width: 300px }` (pen `web-dot-dev/XWvBZNo`). This is the fix for EX-5: the content
  grows and appears with the item, instead of the item growing empty.
- `::details-content` is now `display: block` (it was `contents`). A body that relied on `height: 100%` can change.
- A **partly open** teaser: `content-visibility: visible` always, `height: 150px` → `calc-size(auto, size + .5rem)`.
- Detect it with `@supports selector(::details-content)`. Without support the accordion still works.
- Find-in-page and `#fragment` links still open a closed `<details>` (Chromium, per the HTML standard).
- Exclusive groups use a shared `name` attribute. The builder already does this (`lib/box-export.ts:201`).
- The older route that works everywhere: wrap the body in a grid and transition `grid-template-rows: 0fr → 1fr`
  (CSS-Tricks, Nelson Menezes). Also a layout animation.
- Piccalilli's version needs no `@supports`: closed height `calc(1lh + 2 × padding)`, open `auto`; browsers without
  `interpolate-size` just snap.
- Josh Comeau and Adam put `interpolate-size: allow-keywords` inside `@media (prefers-reduced-motion: no-preference)`.

### T-14. Toasts (GUI challenge "toast", Scott O'Hara, Open UI)

- Markup: `<output role="status">` inside one fixed group; the group has `pointer-events: none`.
- One element runs three animations: fade-in and slide-in (`.3s`), then fade-out delayed by the visible time.
  Under reduced motion the slide distance is `0`; the fade stays.
- When a new toast arrives and others are showing, the **group** is animated with FLIP: measure its height, append,
  measure again, play `translateY(old − new) → 0` for 150 ms with the Web Animations API. Only when motion is OK.
- Remove the toast after `Promise.allSettled(getAnimations().map(a => a.finished))` (T-3).
- **Accessibility (Scott O'Hara):** a toast should not hold an action. If it does, the same action must exist
  elsewhere on the page, or the toast becomes a non-modal dialog that does not time out. A live region reads
  "Message sent. Undo" with no hint that Undo is a button, and the toast may go before a keyboard user reaches it
  (WCAG 2.2.1).
- A popover is not a live region. `popover="manual"` gives the top layer, not the announcement.

### T-15. List items arriving and leaving (Chrome, Bramus, Master.dev part 3, Paul Lewis)

- Entry: `@starting-style` on the item (Bramus's "yellow fade": a newly inserted item starts `background: yellow`).
- With `interpolate-size`, `@starting-style { height: 0 }` lets items of different heights push the list open.
- Exit: add a leaving class with `opacity: 0; height: 0; display: none` and `allow-discrete`, then remove (T-3).
- View transitions do it with less CSS: give each item a `view-transition-name` (or `match-element`) and wrap the
  insert or remove in `document.startViewTransition()`. The neighbours slide into place on their own. Not
  interruptible. It belongs to 03-page-transitions; it is noted here as the cheapest "neighbours do not jump" fix.
- FLIP (Paul Lewis): measure First, apply Last, Invert with a transform, Play to zero. Do the measuring inside the
  100 ms after the tap, when the user will not notice.

### T-16. Other entry/exit patterns seen in the demos

- **Sidenav with no script** (GUI challenge): `<a href="#sidenav-open">` + `:target`. It slides in with
  `translateX`, and `visibility` is delayed only on the way out, so the closed menu is not in the tab order.
  Reduced motion sets the duration to `1ms`.
- **Split button menu** (GUI challenge): opens on `:focus-within`; the card fades and moves 5px; opacity still fades
  under reduced motion; script only syncs `aria-expanded`.
- **Customizable select** (Chrome 135+, `appearance: base-select`): `::picker(select)` animates exactly like a
  popover — `display` and `overlay` allow-discrete, `:open`, and `@starting-style`.
- **Form step reveal** (Adam): `.username:not(:has(:user-valid)) + .password { height: 0; opacity: 0 }` with
  `interpolate-size` — the next field grows in once the first is valid.

### T-17. Tooling and cost notes

- Chrome DevTools (143+) shows a pill on elements affected by `@starting-style`; clicking it forces the starting
  state. Use it during EX-8's UAT. Pseudo-elements cannot be forced yet; force the parent.
- `@starting-style` can be feature-detected in CSS (Bramus: a registered custom property with an endless transition
  delay and a space toggle). The builder does not need it — every fallback is "appear at once".
- Chrome 144 runs `width`/`height` animations on the compositor **only when the values do not change**. A real
  height animation (an accordion) is still main-thread work; §5's cost note stands.

## Added 2026-10-02 (redo) — the builder, checked again

| Point | State | Evidence (file:line) | Note |
|---|---|---|---|
| `@starting-style`, `allow-discrete`, `interpolate-size`, `::details-content`, `::backdrop`, `<dialog>`, `popover`, `getAnimations`, `transitionend`, `sibling-index`, `overscroll-behavior` anywhere in the engine | **GAP (still 0 hits)** | grep over `lib/interactions.ts lib/box-model.ts lib/box-export.ts lib/educo-ui/` | as in the first pass |
| Entrance fill mode | **PARTIAL** | `lib/interactions.ts:232` — `animation:… both` | blocks a later transition exit on the same property (T-5, EX-11) |
| Stagger | **PARTIAL** | `lib/interactions.ts:238` — nine `nth-child` rules, 90 ms each | `sibling-index()` would be one rule (T-11); EX-6 stands |
| Scroll entrance | **PARTIAL** | `lib/interactions.ts:242` — scroll-driven `view()` | rewinds on scroll-up; "play once" needs triggers (T-12, EX-16); time delays on a scroll timeline unchecked (EX-17) |
| Reduced motion for entrances | **PARTIAL** (unchanged) | `lib/interactions.ts:246`, `lib/educo-ui/base.ts:146` | MR-1 in 06 |
| Alert dismiss | **PARTIAL** | `lib/box-model.ts:2027` — inline `.18s`, `setTimeout(remove,180)` | EX-2 now has a better recipe (T-3); the leaving alert stays clickable and focusable (EX-10) |
| Alert role | **HAVE** | `lib/box-model.ts:1687` — `alert` for danger/warning, `status` otherwise | matches Scott O'Hara's advice |
| Auto-dismiss pauses on hover and focus | **HAVE** | `lib/box-model.ts:2020` (comment), `:2036` (listeners) | WCAG 2.2.1 |
| Toast position | **PARTIAL** | `lib/box-model.ts:1943-1957` — each toast block is its own `position:fixed` box at the same corner inset | two toast blocks in one corner sit on top of each other; nothing stacks them (EX-12, needs a browser check) |
| Toast + action + auto-dismiss | **GAP** | `lib/box-model.ts:1650` (a toast keeps one action) and `:1722` (auto seconds); nothing stops both together | T-14, EX-13 |
| Exclusive accordion | **HAVE** | `lib/box-export.ts:201` — shared `name` | – |
| Accordion item clips its content | **HAVE** | `lib/educo-ui/components.ts:307` — `overflow: hidden` | ready for a height animation (EX-4) |
| Horizontal accordion | **PARTIAL** (unchanged) | `lib/educo-ui/components.ts:468` — `transition: flex-grow` | the T-13 `::details-content` width pattern is the fix (EX-5) |

## Added 2026-10-02 (redo) — new gaps

| Id | Plain description | Sort |
|---|---|---|
| **EX-9** | This file's own §4 example writes `dialog:open`. Safari before 26.5 does not know `:open`, so the dialog would never fade in or out there. Use `dialog[open]` for dialogs and `:popover-open` for popovers when EX-7 is built. | MUST |
| **EX-10** | A thing that is leaving (alert, toast, menu, dialog) can still be clicked and tabbed to until its exit ends. Make it `inert` (and `pointer-events: none`) the moment the exit starts. Applies to EX-1, EX-2 and EX-7. | MUST |
| **EX-11** | The entrance uses `animation-fill-mode: both` (`lib/interactions.ts:232`). Any transition-based exit on the same property would jump instead of animating. Prove it in a browser, then switch to `backwards` (from-only keyframes need nothing more) or make every exit a keyframe. | CHECK |
| **EX-12** | Two toast blocks in the same corner are each `position: fixed` at the same spot (`lib/box-model.ts:1943-1957`), so they overlap. There is no shared toast area to stack them, and so nothing for a "make room" (FLIP) animation to act on. | CHECK (drive it in a browser; if they overlap it becomes MUST) |
| **EX-13** | A toast can carry an action button and auto-dismiss at the same time (`lib/box-model.ts:1650`, `:1722`). A keyboard or screen-reader user may not reach the button before it goes. Either a toast with an action never auto-dismisses, or the inspector says the action must also exist on the page. | DECIDE |
| **EX-14** | When modals arrive (EX-7), a fixed toast sits under the modal and becomes inert with the page. Decide then whether toasts move to the top layer (`popover="manual"`) and how they are announced (a popover is not a live region). | LATER |
| **EX-15** | Every overlay the builder ships (menu, lightbox, modal, cookie notice, toast with a close) must be a real `<dialog>` or `popover`, so Esc, the Android back button and the TalkBack back gesture close it. A home-made overlay makes the back button leave the page. | MUST (when those components are built) |
| **EX-16** | "Reveal on scroll" is scroll-driven: it rewinds when the visitor scrolls back up. Decide whether to offer "play once when seen" with scroll-triggered animations (Chrome only; falls back to on-load). | DECIDE |
| **EX-17** | With "reveal on scroll" and "one after another" both on, the stagger is written as time (`90ms`, `lib/interactions.ts:238`) on a scroll timeline (`:242`). Check in a browser whether the items still arrive one after another; if not, stagger with `animation-range` offsets instead. | CHECK |
| **EX-18** | When a modal is built, lock the page behind it: `overscroll-behavior: contain` on the dialog and its `::backdrop` (Chrome 144), with `html:has(dialog:modal){overflow:hidden}` + `scrollbar-gutter: stable` as the fallback. | LATER (with EX-7) |
| **EX-19** | When tooltips are built: `popover="hint"`, show after about 200 ms and hide at once, fade only under reduced motion, and name icon buttons with `aria-labelledby` (never only `aria-describedby`). | LATER |

**EX-2, refined (not a new gap):** replace `setTimeout(remove,180)` with T-3's `getAnimations().finished`, and the
inline `.18s` with the `--eu-dur-fast` token. Then reduced motion (`.01ms`, `lib/educo-ui/base.ts:146`) removes the
alert at once instead of after 180 ms.

**Demo list:** 213 live URLs (pens, chrome.dev demos, GitHub Pages, GUI-challenge builds, nerdy.dev notebooks, and
MDN live samples written as `page#sample-id`) are in the session scratchpad at `demos/ex.json`, for the browser pass
to open one by one.
