# Hover, focus and micro-interactions — with their touch and keyboard twins

Research for the Educo builder. Compiled 2026-10-02.

**What this file adds to what is already stored.** [motion-effects.md](../motion-effects.md) §4 already catalogues
lift/grow/press, glow/outline/brighten, tilt/magnetic/cursor, image zoom/Ken Burns, ripple/tick/shake and the focus-ring
transition, with tokens and reduced-motion notes; §6 rule 7 says "hover also fires on `:focus-visible`, gated by
`(hover:hover)`". [awwwards-motion-survey.md](../awwwards-motion-survey.md) holds 16 hover/cursor items and the
magnetism.fr / cuberto.com measurements. [components.md](../components.md) holds the Tooltip anatomy (APG, 1.4.13).
**None of that is repeated.** New here:

- the effects motion-effects does not cover: **underline grow, colour/background sweep, reveal-on-hover caption/overlay,
  icon nudge, group hover with `:has()`, hover cards with `interestfor`**;
- for every effect, its **touch twin** and **keyboard twin** written out;
- the exact semantics of `hover`/`any-hover`/`pointer`, the sticky-hover problem, `:has()` forgiveness;
- WCAG 1.4.13, 2.4.7/2.4.11/2.4.13, 2.5.2, 2.5.8 as they bear on hover and press;
- Material 3 state-layer opacities, Apple HIG pointer effects and motion rules;
- the magnetic-button reference implementation read from source (numbers, cost);
- the builder audit against `lib/interactions.ts` and gap ids HV-1…HV-14.

---

## Sources and completeness

| Source | What it holds | Read | Not read (reason) |
|---|---|---|---|
| MDN `:hover`, `:focus-visible`, `:has()`, `@media hover`, `@media pointer` | semantics, heuristics, Baseline, touch warnings, a11y notes | all sections | `any-hover`/`any-pointer` pages (one-line differences, stated on the hover/pointer pages) |
| WCAG 2.2 Understanding 1.4.13, 2.5.2, 2.5.8, 2.4.13 | conditions, exceptions, failures, related SCs (2.4.7, 2.4.11, 1.4.11) | all four | 2.5.1, 2.5.4, 2.5.7 (gestures, motion actuation, dragging) — not triggered by hover effects; 2.2.2/2.3.1/2.3.3 already stored |
| CSS-Tricks: "Cool hover effects that use background properties", "…CSS text-shadow", "…background clipping, masks and 3D"; "Solving sticky hover states with @media (hover: hover)" | 4 + 4 + 7 techniques, sticky-hover fix | all four, incl. the series links inside | comment threads (only the perf comment was used) |
| Codrops: Magnetic Buttons; Caption Hover Effects | magnetic follow; figcaption reveal | **article pages NOT READ — tympanus.net returns HTTP 403.** Magnetic Buttons read from its GitHub source (`codrops/MagneticButtons`, `src/js/demo1/buttonCtrl.js`); caption effects known only from search abstracts | live demos (403) |
| Open UI "Interest invokers" explainer; MDN `interest-delay` (via search) | `interestfor`, `popover=hint`, delays, touch, a11y mapping, 1.4.13 | explainer in full | MDN `interest` event page (same facts) |
| Material 3 | state layers, ripple | token file `_md-sys-state.scss` read | **m3.material.io pages NOT READ — rendered by JS, the fetch returned only the title.** Focus-indicator thickness/offset therefore not confirmed |
| Apple HIG Motion, Pointing devices (JSON data endpoints) | motion rules; highlight/lift/hover pointer effects, hit regions | both in full | ~~"Feedback" page~~ — **closed 2026-10-02 (redo)**, see below |

**Redo, 2026-10-02 — every line below was opened and read. Routes are given where the page is blocked.**

| Source | Read | Route / reason |
|---|---|---|
| MDN `@media any-hover`, `@media any-pointer` (the two NOT READ above) | **READ** in full | closes the MDN line above |
| MDN `:active`, `:focus`, `:focus-within`, `:has()` (examples + performance) | **READ** in full | — |
| MDN `interest-delay`, `popover` (`auto`/`hint`/`manual`), "Using interest invokers" | **READ** in full | the old `interestfor` attribute page is now **404**; its content lives in "Using interest invokers" |
| Open UI interest-invokers explainer (re-opened for links and recent changes) | **READ** | — |
| `mfreed7/interestfor` polyfill README | **READ** | GitHub raw |
| WCAG 2.2 Understanding 2.4.7, 2.4.11, 2.5.5 (new); 2.5.1, 2.5.4, 2.5.7 (the three skipped above) | **READ** in full | closes the WCAG line above |
| WCAG techniques C40, C41, C42, C45, G195, F78, F95, SCR39; links to C43, C44, G215, G216, G219, F105, F106, F108, F110 | **READ** (the first eight in full; the rest for title and working example) | — |
| Codrops — **all 82 hover/button/link/cursor/tooltip/click repos** in the `codrops` GitHub org (345 repos listed through the GitHub API, filtered by name and description) | **READ**: every README, every `index*.html`, and every local CSS/JS file each demo page loads (12 MB of source); key ones read line by line (Caption Hover Effects, Creative Link Effects, Line Hover Styles, Button Hover Styles, Hover Effect Ideas sets 1–2, Click Effects, Direction-Aware Hover, Proximity Feedback, Media Pop-up, Magnetic Buttons) | **articles NOT READ: tympanus.net returns 403 and its RSS feeds return 403; web.archive.org was "Temporarily Offline" (HTTP 503) on 2026-10-02.** The source code is the primary record and was read instead. Codrops demos from 2021 on that live outside the `codrops` org were **not** found |
| CSS-Tricks: "4 ways to animate the colour of a text link", "CSS link hover effects", "Direction-aware hover effects", "Focusing on focus styles", "Having a little fun with custom focus styles", "Copy the browser's native focus styles", "Interaction media features and their potential (for incorrect assumptions)", "Fancy image decorations" parts 1–3, `:has()` guide, star-rating part 2 (+ the 4 read before) | **READ** | two guessed URLs ("When CSS blend modes meet hover", "Animating link underlines") are **404** — not articles |
| Smashing: "Guide to keyboard accessibility part 1", "When CSS isn't enough: JS requirements for accessible components", "Animated microinteractions in mobile apps" | **READ** | Smashing "moar-buttons" playground: connection refused (kept in the demo list for the browser run) |
| Josh Comeau: 3D pushable button, "boop", sparkles | **READ** in full | no standalone demo URLs — the demos are embedded in the articles |
| Material 3 states, focus ring, ripple | **READ through source**: `material-web` `tokens/_md-sys-state.scss`, `tokens/_md-comp-focus-ring.scss`, `focus/internal/_focus-ring.scss`, `focus/internal/focus-ring.ts`, `ripple/internal/_ripple.scss`, `ripple/internal/ripple.ts` | **m3.material.io still JS-only** — the source is the spec. Closes the Material 3 line above |
| Apple HIG Feedback, Buttons, Focus and selection | **READ** in full | JSON endpoints `developer.apple.com/tutorials/data/design/human-interface-guidelines/<page>.json` |
| Carbon | **READ**: colour token page (interaction tokens) + source `packages/styles/scss/utilities/_focus-outline.scss` and `components/button/_button.scss` | `carbondesignsystem.com/patterns/interaction-states/` is **404** (page retired) |
| Atlassian | **READ through source**: `@atlaskit/focus-ring` (unpkg) and token names | `atlassian.design/foundations/focus-ring` is **404**; the Focusable page renders by JS (empty fetch) |
| Polaris | **READ through source**: `polaris-tokens/.../shadow.ts`, `motion.ts`, `polaris-react/.../Button.module.css` | `polaris-react.shopify.com` redirects to `shopify.dev/docs/api/polaris`, which no longer has an interaction-states page |
| Adrian Roselli "Avoid default browser focus styles"; Manuel Matuzo "box-shadow is no alternative to outline" (2026) | **READ** | Roselli's other focus posts are referenced but not linked from it — **NOT READ** |
| Sara Soueidan "A guide to designing accessible, WCAG-conformant focus indicators" | **READ** in full | — |
| Patrick Lauke touch/pointer test results | linked, **collected as demos**, not read as prose | — |
| Live demos | **320 URLs collected** (155 Codrops demo pages incl. every `indexN.html`, 141 CodePens, 9 WCAG working examples, APG, MDN examples, polyfill test, Material catalogue, Lauke tests) | written to the session's `scratchpad/demos/hv.json` for the browser run; **not opened here** (reading half only) |

---

## 1. Ground rules (apply to every effect below)

- **`@media (hover: hover)`** = the **primary** input can hover (mouse, trackpad). Touch phones report `none`.
  `any-hover` asks about *any* input (a tablet with a mouse). Baseline since Dec 2018. Hybrid devices may report `hover`
  while being used by touch, so hover can never be the only way to anything.
- **`@media (pointer: fine | coarse)`** = accuracy of the primary pointer. Use `coarse` to grow targets, `fine` to allow
  pointer-following effects (tilt, magnetic, cursor).
- **Sticky hover:** on touch, `:hover` may never match, match briefly, or **stay on until the next tap elsewhere**
  (MDN). A "Lift" card that stays lifted after a tap looks broken. Fix: put the `:hover` rule inside
  `@media (hover: hover)`; leave the `:focus-visible` rule outside it.
- **Keyboard twin = `:focus-visible`** (Baseline Mar 2022): shows for keyboard focus and always in text fields, not for
  mouse clicks. A container that is not focusable uses `:has(:focus-visible)` (or `:focus-within`) so a card reacts when
  its link is focused.
- **Touch twin = `:active`** (finger down) for press feedback, and **content shown by default** for anything hover
  would reveal — touch has no "before the click".
- **`:has()`** — Baseline Dec 2023; its argument list is *unforgiving*: an unsupported `:has()` voids the whole rule, so
  keep it in its own rule or inside `:is()`. Anchor it narrowly (`.grid:has(> .card:hover)`), never on `body`/`:root`.
- **Cost:** `transform`/`opacity` are compositor-only — free on a low-cost Android. `box-shadow`, `background-*`,
  `filter`, `text-shadow`, `clip-path` (outside Chromium) repaint; fine on a button, costly on a big card grid.
  Hover itself never fires on a phone, so hover-only paint costs nothing there — the press (`:active`) state is what a
  phone pays for.
- **Reference numbers:** Material 3 state layers — hover **8 %**, focus **12 %**, pressed **12 %**, dragged **16 %** of
  the content colour over the surface. Apple HIG: brief and precise feedback; avoid motion on interactions that
  happen often; let people cancel motion; pointer "highlight" for small transparent controls, "lift" (scale + shadow +
  specular) for small opaque ones, "hover" (scale/tint/shadow) for large ones; no magnetism on large elements; hit
  region padding ≈ 12 pt around bezelled controls, ≈ 24 pt around bare glyphs.

### WCAG that hover and press touch

| SC | Level | What it means for these effects |
|---|---|---|
| 1.4.13 Content on Hover or Focus | AA | Anything that **appears** on hover/focus (tooltip, caption, hover card, submenu) must be **dismissible** without moving the pointer/focus (Escape), **hoverable** (pointer can move onto it), **persistent** (stays until trigger removed or dismissed). Native `title` tooltips are exempt. |
| 2.4.7 Focus Visible | AA | Every focusable thing shows focus. |
| 2.4.11 Focus Not Obscured (Min) | AA | A sticky header/bar must not cover the focused element entirely (`scroll-padding-top`). |
| 2.4.13 Focus Appearance | AAA | Indicator ≥ a 2 CSS px perimeter, ≥ 3:1 change between focused and unfocused pixels. 1.4.11 (AA) separately needs 3:1 against adjacent colours. |
| 2.5.2 Pointer Cancellation | A | Act on the **up** event (click), never on pointerdown — a press animation on down is fine, the action is not. |
| 2.5.8 Target Size (Min) | AA | Targets ≥ 24 × 24 CSS px, or spaced so 24 px circles do not overlap; inline links in text exempt. 2.5.5 (AAA) = 44 × 44. |

---

## 2. Techniques

Each: what it is · minimal CSS · touch twin · keyboard twin · reduce · cost · traps · how common.

**2.1 Lift / grow** (stored in motion-effects §4; touch/keyboard twins added) — `transform: translateY(-.25rem)` /
`scale(1.03)`. Touch: none (or a slight `:active` press). Keyboard: same look on `:focus-visible`. Reduce: keep the
shadow/colour, drop the transform. Cost: compositor, but an animated `box-shadow` repaints — fade a pre-drawn shadow on
`::after` instead. Very common (cards, buttons).

**2.2 Shadow grow** — `box-shadow` from `--eu-shadow-sm` to `--eu-shadow-lg`. Touch: none. Keyboard: `:focus-visible`.
Not motion (2.3.3). Paint cost; use the `::after` opacity trick on grids. Common on cards.

**2.3 Tilt / 3D card** (stored) — JS `pointermove` → `--rx/--ry`, `transform: perspective(60rem) rotateX() rotateY()`,
cap ≈ 8°. Only under `(hover:hover) and (pointer:fine)` and `no-preference`. Touch/keyboard: none (static). Rare on
real sites outside portfolios.

**2.4 Image zoom inside a frame** — the frame clips, the picture scales:
```css
.frame { overflow: clip; }
.frame img { transition: transform var(--eu-dur-slower) var(--eu-ease-out); }
@media (hover: hover) { .frame:hover img { transform: scale(1.06); } }
.frame:has(:focus-visible) img { transform: scale(1.06); }
@media (prefers-reduced-motion: reduce) { .frame img { transform: none !important; } }
```
Touch: none — the picture is fully visible anyway. Cost: compositor (but a large image layer — fine for a few, avoid on
a 30-photo gallery). Trap: the zoom must target the `<img>`, not the block wrapper, or the frame grows instead. Very
common (news cards, galleries, staff photos).

**2.5 Colour / background sweep** (CSS-Tricks) — a gradient grows across the element:
```css
.sweep { background: linear-gradient(var(--eu-color-brand) 0 0) left / 0% 100% no-repeat;
         transition: background-size var(--eu-dur-base) var(--eu-ease-standard), color var(--eu-dur-base); }
@media (hover: hover) { .sweep:hover { background-size: 100% 100%; color: var(--eu-color-on-brand); } }
.sweep:focus-visible { background-size: 100% 100%; color: var(--eu-color-on-brand); }
```
Touch: `:active` instant fill. Not motion in 2.3.3 terms (colour), but check **contrast in both end states and the
midway frame** (text half on brand, half off). Paint cost — small elements only. Common on nav links and buttons.

**2.6 Underline grow** — the same trick at 0.1em high:
`background: linear-gradient(currentColor 0 0) left bottom / 0% .1em no-repeat` → `100% .1em`. Variants: grow from
centre, slide in from left and out to the right (asymmetric delays), `text-decoration-thickness` change (the cheapest:
`.eu-link:hover` already does this in `components.ts:297`). Trap: **a link that is not underlined at rest must be
distinguishable from text by something other than colour** (1.4.1) — the grow is decoration, not the cue. Touch: none.
Keyboard: `:focus-visible`. Very common on nav and footer links.

**2.7 Reveal on hover (caption / overlay)** — a caption slides up or an overlay fades in over an image.
Touch twin: **the caption is visible by default** under `(hover: none)`. Keyboard twin: reveal on
`:focus-within`/`:has(:focus-visible)`. Rule: never hide information (a name, a date, a price) behind hover; if the
revealed thing is real content and not a decoration, 1.4.13 applies (dismissible with Escape, hoverable, persistent).
The caption must exist in the DOM always (screen readers read it regardless). Common in galleries and portfolios
(Codrops "Caption Hover Effects" — article not readable, see completeness).

**2.8 Magnetic button** (read from Codrops source) — every frame a rAF loop measures the pointer's distance to the
button centre; inside **0.7 × button width** the button is pulled **0.3 ×** the offset, smoothed with **lerp 0.1**, and the
label counter-moves 0.6×; on enter/leave a GSAP timeline swaps the label. Writes `translate3d` (compositor) but **the
loop runs forever on every page view**, listens to `mousemove` only (no touch, no reduced-motion check). If offered:
`(hover:hover) and (pointer:fine)` + `no-preference` only, loop started on `pointerenter` of a zone and stopped when
settled, ≤ 0.3 × pull. Touch/keyboard: none. Award sites mainly (magnetism.fr, cuberto.com, survey §9).

**2.9 Custom cursor** (stored) — never hide the system cursor without an equivalent; `aria-hidden`; `pointer:fine`
only; off under reduce. Award sites only; not for school sites.

**2.10 Icon nudge** — an arrow inside a button or link moves `translateX(.25rem)` on hover/focus.
```css
.cta .icon { transition: transform var(--eu-dur-fast) var(--eu-ease-out); }
@media (hover: hover) { .cta:hover .icon { transform: translateX(.25rem); } }
.cta:focus-visible .icon { transform: translateX(.25rem); }
```
Mirror the direction under `:dir(rtl)` (RULE AF: Arabic). Reduce: none. Compositor. Very common on "Read more" links.

**2.11 Button press** (`:active`) — `transform: translateY(.0625rem) scale(.98)` at `--eu-dur-instant`, or a 12 %
state layer. This is the **touch** feedback a phone actually sees. Keyboard: Space/Enter fire `:active` on `<button>`
but not on `<a>` — fine, the click is the feedback. Trap (2.5.2): animate on down, act on up.

**2.12 Ripple** (stored in motion-effects §4 as FEEDBACK) — needs JS (pointer coordinates) and a pseudo-element per
press; Material keeps it, most non-Material sites do not. A state-layer press (2.11) gives the same "it registered"
cue with zero JS.

**2.13 Group hover with `:has()`** — dim the siblings of the hovered card:
`.grid:has(> .card:hover) > .card:not(:hover) { opacity: .6; }`, plus the `:focus-visible` twin. Touch: none (do not
dim on a tap). Opacity = compositor. Trap: dimmed text may fall below 4.5:1 — dim images, not text. Moderately common
(team grids, portfolios).

**2.14 Hover cards with `interestfor`** — `<a interestfor="card-1">` + `<div id="card-1" popover="hint">`: the browser shows
the card after `interest-delay-start` (0.25 s), hides it after `interest-delay-end` (0.15 s), on hover **and keyboard
focus**, Escape dismisses, the pointer can travel onto the card — 1.4.13 met by construction. Touch: long-press → "Show
details", or an opt-in `::interest-button`. Styling hooks `:interest-source` / `:interest-target`. **Chromium 142+ only**
(Oct 2025); WebKit and Mozilla neutral; the polyfill cannot do touch. Belongs to the future Tooltip/Hover-card component;
the fallback is a click-to-open `popover` (toggletip), which works everywhere.

---

## 3. The builder today (verified by grep)

| Piece | State | Evidence |
|---|---|---|
| Named hover/focus effects on every block and every component item | **HAVE** — Lift, Grow, Press, Glow, Outline, Brighten, Soften | `lib/interactions.ts:41-56`; field `hoverEffect` `lib/box-model.ts:110, 462`; items `lib/interactions.ts:177-194` |
| One emitter for canvas and export | **HAVE** | `lib/box-export.ts:501`; `components/website/box/BoxCanvas.tsx:3586`; inspector gallery `BoxInspector.tsx:1170, 1648` |
| Keyboard twin | **HAVE** — `:hover`, `:focus-visible`, `:has(:focus-visible)` as three separate rules (so an unsupported `:has` drops only its own rule) | `lib/interactions.ts:101` |
| Reduced motion | **HAVE** — moving effects drop `transform`, keep shadow/colour; plus the global `.01ms` rule | `lib/interactions.ts:106-108`; `lib/educo-ui/base.ts:145`; canvas copy `BoxCanvas.tsx:3551` |
| Focus ring | **HAVE** — `0.125rem` brand outline, offset, per-band override `--bx-focus`; no ring on mouse focus | `lib/educo-ui/base.ts:107-108` |
| Touch gating `(hover: hover)` | **GAP** — the `:hover` rule is emitted unconditionally → sticky Lift/Grow/Glow after a tap on phones | `lib/interactions.ts:101-103` |
| Press feedback on `:active` | **GAP** — "Press" is a *hover* look; nothing in the catalogue uses `:active` | `lib/interactions.ts:47-48` (grep `:active` in `lib/interactions.ts`: none) |
| Default hover/active on the Button and Link blocks | **GAP** — exported with inline styles and no class, so `.eu-btn--*:hover` (`lib/educo-ui/components.ts:21-27`) and `.eu-link:hover` (`:297`) never apply; only the base transition list exists (`base.ts:130`). The Card component's button does get `.eu-btn` (`lib/educo-ui/registry.ts:84`) | `lib/box-export.ts:140, 144` |
| Lift shadow colour | **PARTIAL** — hardcoded `rgba(0,0,0,.32)` instead of a shadow token (Core Rule 17) | `lib/interactions.ts:44` |
| Lift/Glow animate `box-shadow` | **PARTIAL** — paints each frame (motion-effects §4 already proposes the `::after` fade) | `lib/interactions.ts:43-50` |
| Motion tokens | **PARTIAL** — no `instant` (press) duration; `emphasized` is an overshoot (rename proposed in motion-effects §3) | `lib/educo-ui/tokens.ts:47-53` |
| Image zoom inside frame | **GAP** | no effect targets a child `<img>`; image export `lib/box-export.ts:151-155` |
| Underline grow / colour sweep / icon nudge | **GAP** | not in `HOVER_EFFECTS` |
| Reveal-on-hover caption/overlay | **GAP** | — |
| Group hover (`:has`) sibling dimming | **GAP** | — |
| Tilt / magnetic / custom cursor / ripple | **GAP** (intentionally absent so far) | — |
| Hover cards / tooltips (`interestfor`, popover) | **GAP** — component not built (anatomy stored in components.md) | — |
| Target size ≥ 24 px, focus not obscured by sticky bars | **PARTIAL** — sticky bars set `scroll-padding-top` (`lib/box-model.ts:5872`); target size not measured | `scripts/uat/page-audit.js` (no target-size check found) |

---

## 4. Gap list

| Id | Plain description | Sort |
|---|---|---|
| **HV-1** | Emit the `:hover` rule inside `@media (hover: hover)` (keep `:focus-visible` and `:has(:focus-visible)` outside), so a tapped card on a phone does not stay lifted. One change in `hoverCss`. | **MUST** |
| **HV-2** | "Press" belongs on `:active` (finger down / mouse down), at an `instant` duration — that is the only feedback a phone sees. Either move Press to `:active` or add an `:active` press to every effect that moves. | **MUST** |
| **HV-3** | Button and Link blocks have no default hover, focus-visible or active state because they are inline-styled with no class. Give them the design-system states (button: darken/state layer + press; link: underline thickness) by class, as the Card's button already has. | **MUST** |
| **HV-4** | Lift's shadow uses a hardcoded `rgba(0,0,0,.32)`; use a shadow token (Core Rule 17), and fade a pre-drawn shadow rather than animating `box-shadow` on large grids. | **MUST** (token) / **LATER** (perf part) |
| **HV-5** | Image zoom inside its frame (picture scales, frame clips) — the most common photo hover on real sites; needs an effect that targets the `<img>` child. | **DECIDE** (add to catalogue) |
| **HV-6** | Underline grow and colour sweep for links and nav items (CSS only, paint on small elements). | **DECIDE** |
| **HV-7** | Icon nudge for buttons/links that carry an arrow icon, mirrored in right-to-left pages. | **DECIDE** |
| **HV-8** | Reveal-on-hover caption/overlay — allowed only with the caption visible by default on touch, shown on keyboard focus, and the text always in the DOM. | **DECIDE** |
| **HV-9** | Group hover: dim the other cards in a grid (`:has()`), images only, never text below 4.5:1. | **LATER** (motion polish) |
| **HV-10** | Tilt, magnetic button, custom cursor — JS, `pointer:fine` + `no-preference` only, lazy, loop stopped when settled. Not for the default school catalogue. | **LATER** |
| **HV-11** | Ripple — use a state-layer press (HV-2) instead; ripple only if a Material-personality theme asks for it (RULE P). | **LATER** |
| **HV-12** | Hover cards / tooltips: build the Tooltip/Hover-card component on `popover` with click-to-open fallback; `interestfor` as an enhancement where supported; 1.4.13 by construction. | **LATER** (component) |
| **HV-13** | UAT lines: every effect on a real phone (tap → no stuck state; press visible), keyboard Tab (focus look = hover look, ring ≥ 3:1 in all four themes and on coloured bands), reduce on, focused element not hidden under a sticky bar, 150 % text. | **CHECK** |
| **HV-14** | Page audit measures target size (≥ 24 × 24 CSS px or spacing exception; inline links exempt) on every link/button at 360 px. | **CHECK** (page-audit line) |

---

## 5. Added 2026-10-02 (redo) — what the sources teach that §1–§4 did not

### 5.1 Media features, read in full

- **`any-hover`** (Baseline Dec 2018): `hover` if **any** input can hover. A phone with a Bluetooth mouse reports
  `hover: none` but `any-hover: hover`. **`any-pointer`** can match `fine` **and** `coarse` at once (a touch laptop);
  `none` only when no input points. MDN's example grows a checkbox under `any-pointer: coarse` and declares it last
  so coarse wins.
- **Which one gates hover?** `(hover: hover)` — the primary input. `any-hover` would turn hover back on for a tablet
  with a mouse in a drawer, and the sticky state returns. Use `any-pointer: coarse` only to **grow** targets.
- **The values change while the page is open** (CSS-Tricks, Patrick Lauke): a Surface goes from `fine/hover` to
  `coarse/none` when the keyboard comes off; an Apple Pencil or Samsung S-Pen **hovers** while reporting `coarse`.
  So media queries decide **looks** only, never **event listeners**. Script uses Pointer Events (`pointerType` per
  event) or listens to both. "If coarse use touchstart, else click" locks out the mouse on a tablet and the finger
  on a touch laptop.

### 5.2 `:active`, `:focus`, `:focus-within`, `:has()` details

- `:active` is the **primary** button only; it also matches **ancestors** of the pressed element and a control
  pressed through its `<label>`. Order **L-V-H-A** (`:link`, `:visited`, `:hover`, `:active`), or a later equal rule
  hides the press. Baseline Jul 2015.
- `:focus-within` (Baseline Jan 2020) matches through shadow trees. It also matches **mouse** focus — for a
  keyboard-only look use `:has(:focus-visible)` (as `hoverCss` already does).
- `:has()` (MDN): never nest `:has()`; no pseudo-elements inside it or as its anchor; use `>` / `+` to stop subtree
  walks (`.grid:has(> .card:hover)`), because every DOM change under a wide anchor re-runs the test. Inside `:is()` /
  `:where()` it becomes forgiving.

### 5.3 Interest invokers — the current state (MDN guide + explainer)

- Interest is shown by **hover, keyboard focus or a touch long-press**; **Escape** cancels all interest. Invokers:
  `<a>`, `<button>`, `<area>`, SVG `<a>`. Events `interest` / `loseinterest` (with `event.source`). Feature test:
  `Object.hasOwn(HTMLButtonElement.prototype, "interestForElement")`.
- `interest-delay: <start> <end>` (inherited; `normal` = browser default). MDN trick: once one hint is open, drop the
  start delay for its neighbours — `p:has(button:interest-source) button { interest-delay-start: 0s }`.
- One element may carry **both** `interestfor` (hover hint, `popover="hint"`) **and** `commandfor` (click popover).
  `hint` closes other hints but **not** `auto` popovers, so a tooltip can sit on an open menu.
- Explainer changes: touch gets a **"Show details"** item in the long-press menu, and an opt-in visible
  `::interest-button` (**not keyboard-focusable**). The old "partial interest" keyboard mode was **removed**
  ("Escape is always there").
- Fade-in pattern: `@starting-style` plus `transition: opacity …, overlay … allow-discrete, display … allow-discrete`.

### 5.4 WCAG — the parts not stored before

| SC | What it adds here |
|---|---|
| **2.4.7** Focus Visible | At least one mode where focus is **always** visible, never time-limited. A ring for mouse users is *recommended*, not required. Techniques: G149, G165, **G195**, C15, **C40**, **C45**, SCR31. Failures: **F55** (script blurs on focus), **F78** (outline removed, or a border/outline at rest that looks like the focus ring). |
| **2.4.11** Not Obscured (Min) | Only **entirely** hidden fails; partial is legal at AA. User-opened content passes if Escape/scroll reveals focus. Technique **C43** (`scroll-padding`); failure **F110** (sticky header/footer). |
| **2.4.13** Appearance (AAA) | Area of a 2 px perimeter: rectangle `4h+4w`, rounded rectangle `4h+4w−(16−4π)r`. An **inset** ring needs **3 px** to match a 2 px outset ring. Techniques G195, C40, **C41** (inner ring, `outline-offset: -4px`). |
| **2.5.1** Pointer Gestures (A) | Path-based (a swipe that loses grip off-track) or multipoint (pinch) needs a single-pointer alternative (buttons). Plain **dragging** is 2.5.7. G215, G216; F105. |
| **2.5.4** Motion Actuation (A) | Shake/tilt to act needs a button **and** a way to turn the motion off. A `deviceorientation` tilt that only decorates is not "operation"; any action on it is. G213; F106. |
| **2.5.5** Target Size (AAA) | 44 × 44; exceptions equivalent / inline / user agent / essential; overlapping area not counted. C44. |
| **2.5.7** Dragging (AA) | Every drag needs a click/tap alternative that is not itself a swipe. G219; F108. |
| C40 (two-colour ring) | Two colours **≥ 9:1 to each other**, each band **≥ 2 px** → one is ≥ 3:1 on **any solid** background. Not for photos/gradients. |
| C42 (24 px) | `min-height/min-width: 24px` on list items, or test with a 24 px circle centred on each small target. |
| F95 / SCR39 | Hover content must be hoverable (chart tooltips: moving to one must not trigger the neighbour's). SCR39: `role="tooltip"`, show on `mouseover` + `focus`, hide on Escape. |

### 5.5 Focus rings — what design systems ship (read from their source)

| System | Ring | Mouse focus | Forced colours / contrast | Press |
|---|---|---|---|---|
| **Material 3** (`material-web`) | `outline` **3 px**, **2 px** outward (or inset 0); animates out to **8 px** in 25 % of `long4` (600 ms) and back in 75 %, emphasized easing | shown on `focusin` only if `:focus-visible`; hidden on `pointerdown` | — | ripple, see 5.6 |
| **Carbon** | `outline: 2px solid $focus; outline-offset: -2px` (inset); 1 px `$focus-inset` white line on buttons | — | **`@media (prefers-contrast)` → `outline-style: dotted`**; a `reset` mixin keeps a **transparent** 2 px outline | active colour two palette steps away; background hover / active / selected = Gray 50 at 12 % / 50 % / 20 % |
| **Atlassian** | `2px solid` `color.border.focused`, offset **2 px** (or **−2 px** inset) | `:focus:not(:focus-visible) { outline: none }` | **`forced-colors: active` → `1px solid`** system colour | — |
| **Polaris** | `:focus-visible` = **the hover background** + 2 px outline, 1 px offset | — | — | **pressed = inset shadow** (`shadow-button-inset`), no movement; a separate toggled `pressed` state |
| **Apple HIG** | iPadOS/macOS: ring for text/search fields, **highlight for list rows and collections**; iOS has no focus system | "do not move focus without the person's action" | — | "**Always include a press state for a custom button**" (Buttons); hit region **44 × 44 pt** (visionOS 60) |

**Forced colours** (Matuzo 2026, Soueidan, Atlassian): `box-shadow` computes to `none` there, so a ring drawn with
`outline: none; box-shadow: …` disappears. Keep a **transparent outline** beside the shadow —
`outline: 0.125rem solid transparent` — and forced colours paints it. **Scaling** (Smashing):
`outline-width: max(2px, 0.08em)` grows the ring with large text. **Two-colour ring** (C40, Soueidan):
`outline: 3px solid black; box-shadow: 0 0 0 6px white` works on any solid band; the "oreo" uses `9px double`.

### 5.6 Press and ripple — the numbers

- **Material ripple** (`ripple.ts`): waits **150 ms** after touch-down (so a scroll does not flash it), grows over
  **450 ms**, stays at least **225 ms** on a quick tap, fades over **375 ms**; hover layer fades in **15 ms**,
  pressed opacity in **105 ms**. Cancels on `pointercancel` and `contextmenu`; does **nothing in forced colours**.
- **Comeau 3D button**: three layers (blurred shadow, edge, front). Hover: front `translateY(-6px)` in **250 ms**
  with overshoot `cubic-bezier(.3,.7,.4,1.5)`; press: `translateY(-2px)` in **34 ms** (two frames); release:
  **600 ms** `cubic-bezier(.3,.7,.4,1)`. **Fast in, slow out.** `filter: brightness(110%)` on hover. Touch:
  `-webkit-tap-highlight-color: transparent` and `user-select: none` (the button has its own press). Mouse ring off
  via `:focus:not(:focus-visible)`.
- **Comeau "boop"**: on hover the icon springs to a new pose for **150 ms**, then returns **even if the pointer stays**
  — it cannot get stuck on touch. Keyboard/touch fire it on activation. Reduced motion → no style.
- **Comeau sparkles**: a sparkle every 50–450 ms (random), removed after 750 ms; reduced motion → 3–4 **static**
  sparkles and no timer. Decorative.

### 5.7 Codrops — the hover catalogue, audited from source

82 repos read; their demo pages are in the demo file. Grouped:

| Group | Repos | Technique |
|---|---|---|
| Link lines | LineHoverStyles (15 styles), CreativeLinkEffects (21), MenuHoverEffects, DistortedLinkEffects, DistortedMenuLinkEffects, LineTextHoverAnimations | a `::before` line `scale3d(0,1,1)` → `scale3d(1,1,1)`; **different easing in and out** (`cubic-bezier(.7,0,.2,1)` at rest, `(.4,1,.8,1)` on hover); `transform-origin` flipped so the line leaves on the far side; SVG `feTurbulence` distortions |
| Buttons | ButtonHoverStyles (21), ButtonStylesInspiration, CreativeButtons, DistortedButtonEffects, ParticleEffectsButtons, ProgressButtonStyles, ElasticProgress, ButtonComponentMorph, MagneticButtons | fill sweeps, text slide/swap, border draw, 3D roll, particles on click, magnetic pull |
| Image/card captions | CaptionHoverEffects (7), HoverEffectIdeas (30 in 2 sets), GridItemHoverEffect, DirectionAwareHoverEffect, DoubleImageHoverEffects, BackgroundScaleHoverEffect, ThumbHoverSVGFilter, SVGImageHover, RepetitionHoverEffect, StackMotionHoverEffects, TiltHoverEffects, ImageTiltEffect, GlitchPerspective, OrganicShapeAnimations | caption slide/fade over a `figure`; a **full-cover `<a>`** in the caption (`position:absolute; inset 0; font-size:0; opacity:0`) makes the whole card one link; clip-path reveals; SVG filters |
| Reveal on link | ImageRevealHover, RapidImageHoverMenu(+Effects), FullscreenHoverLoop, InlineMenuLayout, HoverPreviewMiniMap, 3DLettersMenuHover, MarqueeMenu | a picture follows the pointer over a menu item (rAF + `mousemove`) |
| Proximity/cursor | ProximityFeedback (7), AnimatedCustomCursor, GooeyCursor, CrosshairDistortion, ImageGridMotionEffect, InteractivePoints | effect grows as the pointer **approaches** — `getBoundingClientRect()` on **every** `mousemove` frame |
| Click/tap | ClickEffects (19 tap animations), MediaPopUpEffect | class added on `touchstart` (phones) or `click`, removed on `animationend` |
| Tooltips | TooltipStylesInspiration, TooltipAnimations, TooltipMenu, PixelGooeyTooltip, TooltipTransition | CSS hover tooltips, SVG shape morphs |
| Icons | IconHoverEffects, ArrowNavigationStyles | round icon fills, arrow nudges |

**Measured across the 77 repos that have demo pages (grep of every CSS/JS file each page loads):**

- **0 of 77** contain `prefers-reduced-motion`.
- **11 of 77** contain a `hover`/`pointer` media query — in every one checked it gates only the **custom cursor**
  (`@media (any-pointer: fine) { .cursor {…} }`), **never the hover effect**.
- **13 of 77** detect touch the old way (`Modernizr.touch`, `.no-touch`, user-agent `isMobile`/`mobilecheck()`) —
  wrong on hybrids (5.1).
- Caption Hover Effects: touch twin = a `touchstart` toggles `.cs-hover` (tap shows the caption; the inner link stops
  propagation). **No keyboard twin** (0 `:focus` rules), and the caption links sit at `opacity: 0` yet stay
  focusable — a keyboard user tabs onto an **invisible** link (2.4.7).
- Creative Link Effects pairs every `:hover` with `:focus` (44 rules), but **9 of its 21** effects copy the label in
  `content: attr(data-hover)`, which screen readers can read twice.
- Line Hover Styles: 15 styles, **0** focus twins.
- Proximity Feedback reads layout (`getBoundingClientRect`) per `mousemove` frame — costly on a long page.

**Port rule:** a Codrops effect is a look, not a component. Before one ships here it gets the `(hover: hover)` gate,
a `:focus-visible` / `:has(:focus-visible)` twin, a touch twin (content shown, or `:active`), a reduced-motion
branch, no duplicated text, no focusable child at `opacity: 0`, tokens instead of hex.

### 5.8 CSS-Tricks techniques not stored before

- **Text-colour sweep, four ways:** `background-clip: text` + `background-position` (clips underlines and shadows);
  width of a pseudo (layout — avoid); `clip-path` (paint); `translateX` of an `aria-hidden` copy (**compositor —
  the recommended one**).
- **Sliding highlight:** `box-shadow: inset 0 0 0 0 c` → `inset 6.25rem 0 0 0 c` — one property, no pseudo.
- **Passing underline:** pseudo `scaleX(0 → 1)`, `transform-origin` left on enter, right on leave.
- **Direction-aware hover:** CSS-only (four invisible triangle children, one per edge) or JS (`Math.atan2` of the
  entry point). Touch has no direction — show the overlay on tap or not at all.
- **Image decorations** (Temani Afif): `outline` + negative `outline-offset` as an overlay that animates away;
  gradients/masks with `@property`; staggered `transition: .3s, background-size .3s .3s`. None has a keyboard twin.
- **Focus-style ideas:** background change, colour change, box-shadow ring, `scale(1.05)`, the hover look, custom
  outline with offset; avoid `blur()`; mimic the browser ring with `outline: 5px auto -webkit-focus-ring-color`
  (`Highlight` in Firefox).

### 5.9 Feedback, as Apple and Smashing state it

- HIG Feedback: give feedback **through several channels** (colour, text, sound, haptics) so it survives a muted
  phone or VoiceOver; match **how loud** it is to **how much it matters**; confirm only significant actions; say why
  a command cannot run.
- Smashing (2016): micro-interactions show status, make controls feel **tangible** (acknowledge input at once), and
  must not tire on the hundredth use. Smashing (2021): a CSS-only hover tooltip fails touch and 200 % zoom; Escape and
  hover persistence need a little JS — or `popover` / `interestfor` now.

### 5.10 Builder audit — new findings (grep, 2026-10-02)

| Piece | State | Evidence |
|---|---|---|
| Focus ring in forced colours | **PARTIAL** — the base ring is an `outline` (survives), but inputs/select/textarea, accordion header, accordion search and accordion controls set `outline: none` and draw focus with `box-shadow` only → **no visible focus in Windows forced-colours mode** | `lib/educo-ui/base.ts:107`; `lib/educo-ui/components.ts:49, 320, 345, 349` |
| Input focus ring colour | **CHECK** — `box-shadow: 0 0 0 0.1875rem var(--eu-color-primary-100)`, a pale tint; likely < 3:1 on a white surface (1.4.11) | `lib/educo-ui/components.ts:49` |
| Button press | **PARTIAL** — `.eu-btn:active { transform: translateY(1px) }` is a press state (as HIG asks) but a **pixel** (Core Rule 16), and only Card buttons get `.eu-btn` (HV-3) | `lib/educo-ui/components.ts:18` |
| Hover gating in design-system CSS | **GAP** — 0 `@media (hover` rules in `components.ts` / `base.ts`; button hovers and the elevated-accordion hover stick after a tap | `lib/educo-ui/components.ts:21-27, 386` |
| Hover looks in forced colours | **PARTIAL** — Lift/Glow are `box-shadow`, Brighten is `filter` → invisible there. Fine for decoration; the **focus** state still shows because the base outline ring is separate | `lib/interactions.ts:43-54, 101` |
| `prefers-contrast` | **GAP** — nothing reacts (Carbon switches to a dotted ring) | grep `prefers-contrast` in `lib/`: none |
| Tap highlight / long-press selection | **GAP** (decide) — no `-webkit-tap-highlight-color`, no `user-select` on buttons; Android's own flash is the only touch feedback today | grep in `lib/`: none |
| 300 ms tap delay | **HAVE** — `width=device-width` viewport removes it; no `touch-action` needed | `lib/box-export.ts:903` |

---

## 6. Gap list — additions (2026-10-02 redo)

| Id | Plain description | Sort |
|---|---|---|
| **HV-15** | Focus rings drawn only with `box-shadow` (inputs, select, textarea, accordion header/search/controls) vanish in Windows forced-colours mode. Keep `outline: 0.125rem solid transparent` beside the shadow, never `outline: none` (F78). | **MUST** |
| **HV-16** | Measure the input focus ring (`primary-100` tint) against the surface and the unfocused state in all four themes; it must reach 3:1 (1.4.11). | **CHECK** |
| **HV-17** | The button press uses `translateY(1px)` — change to rem (`0.0625rem`), Core Rule 16. | **MUST** |
| **HV-18** | Extend HV-1 to the design-system CSS: button hovers and the elevated-accordion hover go inside `@media (hover: hover)` too, or they stick after a tap. | **MUST** |
| **HV-19** | Under `@media (prefers-contrast: more)` make the ring thicker or dotted (Carbon); under `forced-colors: active` let it fall back to a system-colour outline (Atlassian). | **DECIDE** |
| **HV-20** | Offer a two-colour focus ring (C40: two colours ≥ 9:1, each ≥ 2 px) for bands with a photo or brand-coloured background, instead of a hand-set `--bx-focus` per band. | **DECIDE** |
| **HV-21** | Any reveal-on-hover effect (HV-8) must never leave a focusable child at `opacity: 0`: hide with `visibility` / `inert`, or reveal on `:focus-within`. Codrops captions fail this. | **MUST** (rule for HV-8) |
| **HV-22** | When a real `:active` press exists (HV-2), remove the Android tap flash and long-press selection **on that element only** (`-webkit-tap-highlight-color: transparent; user-select: none`), never globally. | **DECIDE** |
| **HV-23** | Underline grow: a `scaleX` pseudo-element (compositor) for one-line nav links; the `background-size` method (paints, but wraps) for links inside paragraphs. Different easing in and out; `transform-origin` flips on leave. | **DECIDE** (detail of HV-6) |
| **HV-24** | No text-swap effect that copies a label into CSS `content` — screen readers read it twice. If offered, the copy is an `aria-hidden` span. | **MUST** (rule) |
| **HV-25** | Any builder script for pointer effects (tilt, magnetic, proximity, hover cards — HV-10, HV-12) uses Pointer Events and `pointerType` per event, never "coarse → touch listeners". Media queries decide looks, not listeners. No `getBoundingClientRect` per `pointermove` frame — measure on `pointerenter`. | **CHECK** (rule for HV-10/12) |
| **HV-26** | Port checklist for any effect taken from Codrops/CodePen: hover gate · focus twin · touch twin · reduced-motion branch · no duplicated text · no invisible focusable child · tokens only. (0 of 77 Codrops demos have reduced motion.) | **CHECK** |
| **HV-27** | Press timing: a fast press (~34 ms, two frames) and a slower release (~250–600 ms) — "fast in, slow out" (Comeau); keep a press visible ≥ 225 ms on a quick tap (Material). Adds to the `instant` token in HV-2. | **DECIDE** |
| **HV-28** | Future carousels, sliders, sortable lists: every swipe or drag also has buttons (2.5.1 G215, 2.5.7 G219); any tilt-to-act has a button and an off switch (2.5.4). | **LATER** (component rule) |
