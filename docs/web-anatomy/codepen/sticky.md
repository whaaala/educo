# CodePen · sticky — how each pen does it

585 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/sticky.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| position: sticky | 353 |
| transition | 192 |
| :hover | 162 |
| position: fixed | 162 |
| scroll listener | 97 |
| @keyframes | 46 |
| backdrop-filter | 32 |
| scroll() timeline | 29 |
| GSAP | 25 |
| pointer / mouse tracking | 21 |
| requestAnimationFrame | 20 |
| custom properties driven by JS | 18 |
| clip-path | 17 |
| mix-blend-mode | 17 |
| ScrollTrigger | 15 |
| IntersectionObserver | 15 |
| scroll-driven animation (animation-timeline) | 11 |
| 3D (perspective / preserve-3d) | 9 |
| view() timeline | 9 |
| prefers-reduced-motion | 9 |
| :has() | 9 |
| scroll-snap | 9 |
| animation-range | 8 |
| Web Animations API (.animate) | 7 |
| container queries | 6 |
| mask | 5 |
| :focus-visible | 3 |
| Lenis / smooth scroll | 3 |
| canvas 2D | 2 |
| three.js / WebGL | 2 |
| (hover: hover) gate | 2 |
| <dialog> | 1 |

## Every pen

### [POST IT](https://codepen.io/editor/shawnpjoyce/pen/01a0ec3f-4f19-771f-a52b-fad6c1fe6f90)

on hover of a.: div.note: transform, a.: opacity | made with: :hover · clip-path · 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking · requestAnimationFrame

```css
.note-position { position: absolute; top: 0; perspective: 650px }
.note { position: relative; will-change: transform; filter: drop-shadow( 0 var(--shadow-y, 3px) var(--shadow-blur, 4px) rgb(0 0 0 / var(--shadow-alpha, 0.18)) ) }
.note::before { position: absolute; inset: 0 }
.note::after { position: absolute; box-shadow: var(--fold-shadow) }
.note[data-corner="bottom-right"] { clip-path: polygon( 0 0, 100% 0, 100% calc(100% - var(--curl)), calc(100% - var(--curl)) 100%, 0 100% ) }
.note[data-corner="bottom-left"] { clip-path: polygon( 0 0, 100% 0, 100% 100%, var(--curl) 100%, 0 calc(100% - var(--curl)) ) }
.note[data-corner="top-right"] { clip-path: polygon( 0 0, calc(100% - var(--curl)) 0, 100% var(--curl), 100% 100%, 0 100% ) }
.note[data-corner="bottom-right"]::after { bottom: 0 }
.note[data-corner="bottom-left"]::after { bottom: 0 }
.note[data-corner="top-right"]::after { top: 0 }
.note a { text-underline-offset: 3px }
.note a:hover { opacity: 0.75 }
```

```js
style.setProperty("--paper", pick(PAPERS))
style.setProperty("--ink", pick(INKS))
style.setProperty("--curl", `${Math.round(random(14, 40))}px`)
addEventListener("pointermove", onCursorMove, { passive: true })
style.setProperty("--shadow-y", `${3 + height * 0.35}px`)
style.setProperty("--shadow-blur", `${4 + height * 0.5}px`)
style.setProperty("--shadow-alpha", (0.18 + height * 0.003).toFixed(3))
requestAnimationFrame(render)
```

### [Scroll Triggered Gallery with Sticky Content](https://codepen.io/editor/nintendo-sixty-paul/pen/01a0a4b1-14e3-70bf-8e63-395e975e1ca5)

held: sticky div.scroll-gallery__content | made with: position: sticky · view() timeline · @keyframes

```css
.scroll-gallery__content { position: sticky; top: 36px }
.scroll-gallery__content__body { margin-top: 16px }
.scroll-gallery__gallery__image { padding-bottom: 30%; position: relative }
.scroll-gallery__gallery__image { animation: imageIn .8s forwards; animation-trigger: --trigger play-once; opacity: 0; transform: scale(0.2) }
.scroll-gallery__gallery__image img { animation: imageBlur .8s forwards; animation-trigger: --trigger play-once; filter: blur(5px) }
.scroll-gallery__gallery__image + .scroll-gallery__gallery__image { margin-top: -80px }
.scroll-gallery__gallery__image img { object-position: center; position: absolute; top: 0; transform: translate3d(0px, 0px, 0.1px) }
from { opacity: 0; transform: scale(0.2) }
to { opacity: 1; transform: scale(1) }
0% { filter: blur(5px) }
80%, 100% { filter: blur(0) }
@keyframes imageIn animates opacity, transform
```

### [Sticky Card Stack with Depth Taper](https://codepen.io/ForhadKhan/pen/dPvpYeJ)

held: fixed button.theme-toggle, sticky article.work-stack__card, sticky article.work-stack__card, sticky article.work-stack__card, sticky article.work-stack__card | on hover of button.theme-toggle: svg.[object: transform | made with: position: sticky · position: fixed · transition · :hover · :focus-visible · prefers-reduced-motion · custom properties driven by JS · scroll listener · requestAnimationFrame

```css
:focus-visible { outline-offset: 2px }
.band-foot { margin-top: 2rem }
.button { transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease }
.work-stack { --stack-top: 1.5rem; margin-top: 2.5rem }
.work-stack__card { position: sticky; top: calc(var(--stack-top) + var(--i) * var(--stack-step)); transform: scale(calc(1 - var(--depth) * 0.03 * var(--covered, 1))); transform-origin: center top; transition: border-color 0.3s ease }
.work-stack__card::after { position: absolute; inset: 0; opacity: calc(var(--covered, 0) * 0.8) }
.work-stack__card + .work-stack__card { margin-top: 2rem }
.work-stack__media { position: relative; border-bottom: 1px solid var(--line) }
.work-stack__placeholder { background-position: center }
.work-stack__text h3 a::after { position: absolute; inset: 0 }
.work-stack__metrics dt { text-transform: uppercase }
.work-stack__cta .icon { transition: transform 0.2s ease }
```

```js
style.setProperty("--covered", covered.toFixed(3))
requestAnimationFrame(() => {
addEventListener("scroll", onScroll, { passive: true })
```

### [StickyScrollTrigger feature demo](https://codepen.io/editor/kuninori-ogino/pen/01a083a9-37ab-79e1-a955-cc97d7957f45)

held: fixed header.header, sticky div, sticky div, sticky aside.pin__label | on scroll: span.header__progress: transform | on hover of a.: a.: background+color | made with: position: sticky · position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · :hover · GSAP · ScrollTrigger

```css
:root { --sst-scroll-margin-top-offset: var(--headerHeight) }
.header { position: fixed; inset: 0 0 auto 0 }
.header__progress { position: absolute; bottom: 0; transform: scaleX(0) }
.header__progress { animation: sst-scroll-progress linear both; animation-timeline: scroll(root block) }
from { transform: scaleX(0) }
to { transform: scaleX(1) }
section { border-bottom: 1px solid var(--line) }
.chip { margin-bottom: 18px }
.hero { padding-top: var(--headerHeight) }
.hero__hint { text-transform: uppercase }
.scene__meter i { box-shadow: 0 0 12px rgba(255, 255, 255, 0.35) }
.overlap__card { margin-top: 40px }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.fromTo(
ScrollTrigger.create(
```

### [overflow: clip なら sticky が生きる (hidden との比較)](https://codepen.io/editor/shunei/pen/01a07baf-ce46-7265-b6fb-7c073aa368c3)

held: sticky h2.c-panel__head, sticky h2.c-panel__head | made with: position: sticky

```css
.c-panel__head { position: sticky }
```

### [Stacking Sticky Scroll Cards](https://codepen.io/editor/nintendo-sixty-paul/pen/01a06803-6cf4-747b-a394-a2a50099b7d2)

held: sticky div.sticky-cards__group, sticky div.sticky-cards__group, sticky div.sticky-cards__group, sticky div.sticky-cards__group | made with: position: sticky

```css
.sticky-cards__group { position: sticky; top: 0 }
.sticky-cards__card__image img { object-position: center }
.sticky-cards__card__year { margin-bottom: 8px }
.sticky-cards__card__title { text-transform: uppercase }
.sticky-cards__card__description { margin-top: 16px }
```

### [sticky image effect (clip-path version)](https://codepen.io/editor/vii120/pen/019ff1e2-2758-71e9-8c29-54a22f6773e5)

on scroll: img.: clip-path+top ×2 | made with: GSAP · ScrollTrigger

```css
&:not(:first-child) { position: absolute; top: 0 }
&:last-of-type { border-bottom: 1px dashed #0005 }
```

```js
gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.create({
gsap.to(targetImage, {
scrollTrigger: { trigger: section, // use functions here to get the actual data after resizing start: () => `top 50%+=${targetImage.offsetHeight / 2}
```

### [sticky image effect w/ gsap scrolltrigger](https://codepen.io/editor/vii120/pen/019fed53-c235-79fa-9207-706c0ac53253)

on scroll: img.: transform+top ×3 | made with: GSAP · ScrollTrigger

```css
&:not(:first-child) { position: absolute; top: 0 }
&:last-of-type { border-bottom: 1px dashed #0005 }
```

```js
gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.create({
gsap.to(targetImage, {
scrollTrigger: { trigger: section, // use functions here to get the actual data after resizing start: () => `top 50%+=${targetImage.offsetHeight / 2}
```

### [LEC Sticky Menu](https://codepen.io/editor/learning2/pen/01666a63-cf50-7910-b9ed-c88ab6a17701)

made with: nothing recognised — read the code

### [GSAP ScrollSpy with Dynamic AccentUntitled](https://codepen.io/sel-mlil/pen/xbRWLBm)

held: sticky aside.left-pane | on hover of div.cards: div.card: transform+opacity+top ×3, span.link-index: color ×2, div.link-label: color ×2, div.link-title: color ×2, span.link-dot: transform+opacity+background ×2, span.link-dot: background ×2 | made with: position: sticky · transition · :hover · custom properties driven by JS · GSAP · ScrollTrigger

```css
.left-pane { position: sticky; top: 0 }
.left-pane::after { position: absolute; top: 10%; bottom: 10% }
.nav-header { text-transform: uppercase; margin-bottom: 36px }
.link-item { position: relative; transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) }
.link-item::before { position: absolute; inset: 0; opacity: 0; transition: opacity 0.35s ease }
.link-item.active::before { opacity: 0.1 }
.link-inner { position: relative }
.link-index { transition: color 0.35s ease }
.link-label { text-transform: uppercase; margin-bottom: 3px; transition: color 0.35s ease }
.link-title { transition: color 0.35s ease }
.link-dot { opacity: 0; transform: scale(0); transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) }
.link-item.active .link-dot { opacity: 1; transform: scale(1) }
```

```js
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
ScrollTrigger.create({
style.setProperty('--accent-color', color)
gsap.to(window, {
gsap.fromTo(cards,
scrollTrigger: { trigger: panel, start: "top 70%", end: "top 20%", scrub: 0.8, }
```

### [Sticky Horizontal Scroll Section](https://codepen.io/avathiery/pen/yyVeZRg)

on scroll: p.hint: transform+opacity+top | on hover of a.: p.hint: transform+opacity+top | made with: @keyframes · scroll listener · requestAnimationFrame

```css
.eyebrow { text-transform: uppercase; margin-bottom: 32px }
.intro h1 { margin-bottom: 48px }
.hint { text-transform: uppercase; animation: bounce 2s ease-in-out infinite }
0%, 100% { transform: translateY(0); opacity: 0.6 }
50% { transform: translateY(6px); opacity: 1 }
@keyframes bounce animates transform, opacity
```

```js
addEventListener('scroll', () => {
requestAnimationFrame(() => {
```

### [Scroll Sync UI (Sticky + IntersectionObserver)](https://codepen.io/tkdev-hub/pen/NPRyEdX)

made with: position: sticky · transition · IntersectionObserver

```css
.sync-visual { position: sticky; top: 24px }
.visual-panel { position: absolute; inset: 0; opacity: 0; transform: scale(0.965); transition: opacity 0.4s ease, transform 0.4s ease }
.visual-panel.active { opacity: 1; transform: scale(1) }
.panel-label { opacity: 0.8; margin-bottom: 10px }
.sync-visual { top: 12px }
```

```js
new IntersectionObserver(
```

### [Scroll State Machine UI](https://codepen.io/tkdev-hub/pen/ZYpaOxQ)

made with: position: sticky · transition · scroll listener

```css
.mini-panel { position: sticky; top: 16px; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.22); margin-bottom: 18px }
.mini-eyebrow { text-transform: uppercase }
.mini-dots { margin-top: 14px }
.mini-dot { transition: transform 0.25s ease, background 0.25s ease }
.mini-dot.active { transform: scale(1.35) }
.mini-progress { margin-top: 14px }
.mini-progress-bar { transition: width 0.18s linear }
.mini-step-label { margin-bottom: 10px }
.mini-panel { top: 10px }
```

```js
addEventListener("scroll", updateMiniScrollState, { passive: true })
```

### [Scroll Story UI (Sticky + Scroll Sync Steps)](https://codepen.io/tkdev-hub/pen/EagwLBr)

made with: position: sticky · transition · scroll listener

```css
.mini-display { position: sticky; top: 20px; margin-bottom: 32px }
.mini-label { margin-bottom: 8px }
.mini-step { opacity: 0.4; transition: 0.3s }
.mini-step.is-active { opacity: 1 }
```

```js
addEventListener('scroll', update)
```

### [Sticky Scroll Animation Modes](https://codepen.io/tkdev-hub/pen/JoRygeq)

made with: position: sticky · transition · :hover · backdrop-filter · scroll listener

```css
.sticky-stage { position: relative }
.sticky-box { position: sticky; top: 0 }
.panel { box-shadow: 0 20px 60px rgba(0, 0, 0, 0.22); will-change: transform, opacity }
.label { text-transform: uppercase; opacity: 0.7 }
.panel p:last-child { opacity: 0.85 }
.scroll-content { padding-bottom: 120px }
.controls { position: sticky; top: 16px; margin-top: -80vh; margin-bottom: 24px; backdrop-filter: blur(10px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) }
.mode-btn { transition: transform 0.2s ease, background 0.2s ease }
.mode-btn:hover { transform: translateY(-1px) }
.progress-card, .notes { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06); margin-bottom: 16px }
.notes p:last-child { margin-bottom: 0 }
.progress-bar { margin-bottom: 10px }
```

```js
addEventListener("scroll", updateAnimation, { passive: true })
```

### [Add border to sticky column when table scrolls](https://codepen.io/iam_aspencer/pen/pvEoeaz)

made with: position: sticky · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
.overflow-table td:last-child, .overflow-table th:last-child { position: sticky }
.overflow-table td:last-child, .overflow-table th:last-child { animation-name: detect-scroll; animation-timing-function: linear; animation-timeline: scroll(nearest inline); box-shadow: var(--shadow-if-can-scroll, var(--shadow-if-cant-scroll)) }
table { position: relative }
tbody { border-bottom: var(--table-border) }
th, td { border-bottom: var(--table-border) }
th { border-top: var(--table-border) }
@keyframes detect-scroll animates --can-scroll
```

### [Sticky Header with sticky in-page element](https://codepen.io/indigoconcept/pen/bNeXEOE)

held: sticky header, sticky div.sticky, fixed a.credits | on scroll: header.: transform+top | made with: position: sticky · position: fixed · transition · mask · custom properties driven by JS · scroll listener

```css
header { position: sticky; top: 0; transform: translateY(calc((1 - var(--header-visible)) * -1 * var(--header-h))); transition: transform 220ms ease; will-change: transform }
.sticky { position: sticky; top: calc(var(--header-visible) * var(--header-h) - 1px); transition: top 220ms ease; will-change: top }
header, .sticky { text-transform: uppercase }
&:after { mask-repeat: no-repeat; mask-position: center; mask-size: 100%; mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 661.478 351.351' enable-background='new 0 0 661.478 }
```

```js
style.setProperty("--header-h", `${headerHeight}px`)
style.setProperty("--header-visible", v)
addEventListener("scroll", onScroll, { passive: true })
```

### [Sticky Header with container-type: scroll-state & :target-current indicator](https://codepen.io/cbolson/pen/QwEYvwo)

held: fixed a.back-to-top, sticky nav | on scroll: nav.: background+top | made with: position: sticky · position: fixed · transition · :hover · :focus-visible · backdrop-filter · container queries

```css
container scroller scroll-state(scrollable: top) { translate:0 var(--nav-y-scroll); backdrop-filter: blur(var(--nav-blur-scroll)) }
&::before, &::after { position: absolute; transition: all 150ms ease-in-out; inset: anchor(top) anchor(right) anchor(bottom) anchor(left) }
container scroller scroll-state(scroll: stuck) { --offset: 0 }
container scroller scroll-state(scrollable: top) { translate: 0 0 }
&::before { position: fixed; bottom: 1rem; translate: -50% 0 }
```

### [Sticky Hero Section (CSS Grid Overlay Method)](https://codepen.io/vikktor/pen/wBWQMeQ)

held: sticky div.sticky-stage | made with: position: sticky

```css
.sticky-stage { position: sticky; top: 0 }
.dark-bg { position: absolute; top: 0 }
.floating-logo { position: absolute; opacity: 0.8 }
.left-logo { top: 20%; transform: rotate(-15deg) }
.beer-cans { position: absolute; bottom: -50px; transform: translateX(-50%) }
.beer-cans img { filter: drop-shadow(0px 10px 20px rgba(0,0,0,0.8)) }
.hero-scroll-text { padding-top: 15vh; padding-bottom: 100vh }
.main-title { text-transform: uppercase; margin-bottom: 1rem }
.subtitle { opacity: 0.8; margin-bottom: 50vh }
.spacer-text { opacity: 0.5 }
.next-section { position: relative }
```

### [Sticky Fieldset Legends Demo](https://codepen.io/vtlanglois/pen/YPWJymr)

held: fixed h1, sticky legend, sticky legend | made with: position: sticky · position: fixed

```css
body { --heading-top: 0rem }
h1 { position: fixed; top: var(--heading-top) }
fieldset { box-shadow: 2px 2px 4px rgb(0 0 0 / 20%) }
legend { position: sticky; top: calc(var(--heading-top) + var(--heading-padding) + 2rem); box-shadow: 2px 2px 4px rgb(0 0 0 / 20%) }
```

### [squish list](https://codepen.io/youbastard/pen/XJKPoRp)

held: sticky li, sticky li, sticky li, sticky li, sticky li, sticky li, sticky li, sticky li, sticky li, sticky li | made with: position: sticky

```css
.container { position: relative; margin-top: 100px }
ul { position: relative }
li { position: sticky; top: calc(var(--i) * 2rem) }
li:last-child { margin-bottom: 2000px }
```

### [Sticky nav using scroll-state queries](https://codepen.io/mj-watts/pen/qENKBBr)

held: sticky div.stuck-top | on scroll: nav.: background+shadow+top, a.: color+top | on hover of a.: a.: opacity | made with: position: sticky · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · transition · :hover · backdrop-filter · container queries

```css
container scroll-state(stuck: top) { backdrop-filter: blur(10px); box-shadow: var(--shadow-6) }
> a { animation: highlight linear both; animation-range: cover 20% exit-crossing 50% }
> a:nth-child(1) { animation-timeline: --section-services }
> a:nth-child(2) { animation-timeline: --section-journal }
> a:nth-child(3) { animation-timeline: --section-about }
> a:nth-child(4) { animation-timeline: --section-contact }
&:hover { opacity: 0.8 }
> h1 { text-transform: uppercase }
&:hover { opacity: 0.6 }
@keyframes highlight animates border-block-end-color, color
```

### [Sticky Header - Pure CSS](https://codepen.io/Adir-SL/pen/RNRyVQL)

held: sticky header | on scroll: span.: color ×3, div.header-wrapper: background, span.logo-type: color+top, div.flex: color | made with: position: sticky · transition · :hover · backdrop-filter · container queries

```css
header { position: sticky; top: 0 }
.header-wrapper { -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); transition: background-color 150ms linear 0s }
.logo { scale: 1; transition: scale 150ms ease-in-out 0s }
.logo-type, .flex { transition: color 150ms linear 150ms }
.card { position: relative; box-shadow: 0 0 0 1px lightgrey; transition: scale 150ms ease-in-out 0s; background-position: top center }
.card::before { position: absolute; top: 0 }
.card::after { position: absolute; bottom: 0 }
.card:hover { box-shadow: 0 0 0 1px black; scale: 1.05 }
.logo { scale: 2.5; transition: scale 150ms ease-in-out 150ms }
.logo-type, .flex { transition: color 150ms linear 0s }
```

### [Pure CSS Personal Journal Notebook Paper (Realistic & Hand-Drawn) v2.0](https://codepen.io/fyildiz1974/pen/VYjLvrX)

made with: transition · :hover · mask

```css
.notebook { position: relative; mask: radial-gradient( calc(0.5 * var(--f) * 1lh) at calc(0.5 * var(--b)), #0000 calc(100% - 1px), red ) 0 0/ 100% 1lh; box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.3), inset -2px 0 10px rgba(0, 0, 0, 0.0 }
.date-stamp { position: absolute; top: 1lh; transform: rotate(2deg) }
.tape { position: absolute; transform: rotate(-5deg); box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2) }
.tape--top { top: -10px }
.tape--bottom { bottom: -10px; transform: rotate(3deg) }
.sticky-note { position: relative; transform: rotate(-2deg); box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2), inset 0 -40px 40px rgba(0, 0, 0, 0.05) }
.sticky-note::before { position: absolute; top: 0 }
.paperclip { position: absolute; top: -15px; border-bottom: none; transform: rotate(10deg) }
.paperclip::before { position: absolute; bottom: -20px; transform: translateX(-50%); border-top: none }
.polaroid { box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.3); transform: rotate(3deg) }
.polaroid img { filter: sepia(20%) contrast(1.1) }
.polaroid figcaption { margin-top: 8px }
```

### [CSS only sticky header with scroll-state queries demo](https://codepen.io/JBuma/pen/myPNKyL)

held: sticky nav | on scroll: li.: color+top ×5, ul.: background+color+shadow | made with: position: sticky · transition · container queries

```css
container scroll-state(stuck: block-start) { box-shadow: 0px 2px 5px hsl(50deg 10 10 / 0.25) }
.browser-support { position: absolute }
```

### [Pinned Page Animation](https://codepen.io/Mohish-Padave/pen/zxqVoZE)

on hover of a.btn-arrow: img.: transform+top ×2, div.cards-grid: transform+top | made with: transition · :hover · GSAP · ScrollTrigger

```css
#projects { position: relative }
.overline { text-transform: uppercase; margin-bottom: 1.5rem }
.project-title { margin-bottom: 2rem }
.project-description { margin-bottom: 3rem }
.btn-arrow { text-transform: uppercase; transition: all 0.3s ease }
.btn-arrow svg { transition: transform 0.3s ease }
.btn-arrow:hover svg { transform: translateX(5px) }
.project-right { position: relative }
.img-wrapper img { transition: transform 0.7s cubic-bezier(0.165, 0.84, 0.44, 1) }
.project-card:hover .img-wrapper img { transform: scale(1.05) }
.card-meta { border-top: 1px solid rgba(0,0,0,0.1); padding-top: 1rem }
.meta-left h3 { margin-bottom: 0.25rem }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to(grid, {
scrollTrigger: { trigger: projectsSection, start: "top top", end: `+=${distance}
```

### [Pure CSS Stacking Cards — Smooth Scroll Without JavaScript](https://codepen.io/fyildiz1974/pen/raePdGe)

held: sticky li.card, sticky li.card, sticky li.card, sticky li.card | on scroll: footer.neon-footer: opacity+top | on hover of li.card: footer.neon-footer: opacity | made with: position: sticky · @keyframes · transition · :hover

```css
:root { --card-top-offset: 1em }
body { padding-bottom: 10vh }
#cards { padding-bottom: calc(4 * var(--card-margin)) }
.card { position: sticky; top: 0; padding-top: calc( var(--index) * var(--card-top-offset) ); transform-origin: center top }
.card-body { box-shadow: 0 0 30px rgba(0, 0, 0, 0.5); transition: all 0.5s ease; position: relative }
.card-content h2 { margin-bottom: 0 }
.card-num { opacity: 0.1; position: absolute; top: -20px }
.neon-footer { animation: neon-flicker 1.5s infinite alternate }
0% { opacity: 0.8 }
50% { opacity: 1 }
100% { opacity: 0.9 }
.neon-footer a { transition: color 0.3s, text-shadow 0.3s }
```

### [Sticky Nature Scroll | Vanilla JS](https://codepen.io/kazmi066/pen/Wbwzovj)

held: sticky div.scroll-section__sticky | on hover of button.hero__badge: button.hero__badge: background+color | made with: position: sticky · transition · :hover · mask · scroll listener · requestAnimationFrame

```css
.hero { position: relative; border-bottom: 1px solid var(--border-color) }
.hero__bg { position: absolute; inset: 0; mask-image: radial-gradient(circle at center, black 40%, transparent 100%) }
.hero__title { margin-bottom: clamp(1rem, 2vh, 1.5rem) }
.hero__subtitle { margin-bottom: clamp(2rem, 4vh, 3rem) }
.hero__badge { transition: background 0.3s }
.scroll-section { position: relative }
.scroll-section__sticky { position: sticky; top: 0 }
.scroll-section__track { will-change: transform }
.card { transition: transform 0.3s ease, border-color 0.3s ease }
.card:hover { transform: translateY(-8px) }
.card__image { transition: transform 0.5s ease; filter: grayscale(20%) }
.card:hover .card__image { transform: scale(1.05); filter: grayscale(0%) }
```

```js
addEventListener("scroll", () => {
requestAnimationFrame(() => {
```

### [React Navbar — Responsive, Sticky, Hide-on-Scroll](https://codepen.io/adiadila123/pen/wBMEEbJ)

held: sticky header.nav, fixed div.sheet | on scroll: header.nav: transform+top | made with: position: sticky · position: fixed · transition · backdrop-filter · scroll listener

```css
.nav { position: sticky; top: 0; transition: transform 0.2s ease, background 0.2s }
.nav.hide { transform: translateY(-100%) }
.bar { backdrop-filter: blur(8px); border-bottom: 1px solid rgba(255, 255, 255, 0.12) }
.links a:focus { outline-offset: 2px }
.sheet { position: fixed; inset: 0 }
.panel { position: absolute; top: 0; bottom: 0 }
.panel a:focus { outline-offset: 2px }
```

```js
addEventListener("scroll", onScroll, { passive: true })
```

### [scroll-driven sticky image animation](https://codepen.io/vii120/pen/NPxzZVb)

held: fixed div.img-box, fixed div.img-box, fixed div.img-box, fixed div.img-box | on scroll: img.: clip-path ×2 | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · clip-path

```css
section { view-timeline: --section; position: relative }
section .img-box { position: fixed; top: 0; bottom: 0 }
section img { animation: wipe linear both; animation-timeline: --section; animation-range: exit var(--gap) exit calc(100% - var(--gap)) }
0% { clip-path: inset(0 0 0 0) }
100% { clip-path: inset(0 0 100% 0) }
@keyframes wipe animates clip-path
```

### [Cards on Scroll](https://codepen.io/piyush-tapaniya/pen/dPYLQZJ)

held: sticky div.card, sticky div.card, sticky div.card | on scroll: div.card__inner: filter+top ×2 | made with: position: sticky · custom properties driven by JS

```css
.card { position: sticky; top: 0 }
.card__inner { will-change: transform; box-shadow: 0 25px 50px -12px hsla(265.3, 20%, 10%, 35%); transform-origin: center top }
```

```js
style.setProperty('--cards-count', cards.length)
style.setProperty( '--card-height',
```

### [Sticky Sidebar | GSAP](https://codepen.io/rogerkuik/pen/RNWBJwz)

made with: GSAP · ScrollTrigger

```css
h1, h2 { text-transform: uppercase; margin-bottom: 1rem }
p { opacity: 0.75; margin-bottom: 30px }
```

```js
gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.create({
```

### [Travel cards with carousel #css #js](https://codepen.io/kristen17/pen/ZYbRKEx)

held: sticky div.card, sticky div.card, sticky div.card, sticky div.card | made with: position: sticky · transition · :hover · backdrop-filter · custom properties driven by JS

```css
.cards { padding-bottom: calc(var(--cards) * var(--cardTopPadding)) }
.card { position: sticky; top: 0; padding-top: calc(var(--index) * var(--cardTopPadding)) }
.card-content { box-shadow: 0 0 1.875rem 0 rgba(0, 0, 0, 0.3); transition: all 0.5s; position: relative }
.card-content h2 { text-transform: capitalize }
.card-content span.date { margin-bottom: 0.625em }
.card-content .actions { margin-top: 0.625em }
.card-content .actions .book-now { text-transform: capitalize; transition: 0.2s ease-in-out }
.card-content .slideshow-container { position: absolute; bottom: 0 }
.card-content .slideshow-container::before { position: absolute; inset: 0 }
.reverse .card-content .slideshow-container { position: relative }
.info { position: absolute; bottom: 20px }
.text { text-transform: capitalize; box-shadow: 0 0.25rem 1.875rem rgba(0, 0, 0, 0.1); backdrop-filter: blur(0.238em); -webkit-backdrop-filter: blur(0.238em) }
```

```js
style.setProperty("--cards", cardsData.length)
style.setProperty("--index", cardIndex + 1)
```

### [Center div even when scrolling](https://codepen.io/hiitssid/pen/KwdQYXQ)

held: fixed div.mid | made with: position: fixed

```css
.mid { position: fixed; top: 50%; transform: translate(-50%, -50%) }
```

### [Navigation Bar (Sticky and Responsive) v2](https://codepen.io/wolfferine/pen/bNVYNKQ)

held: fixed nav.navbar | made with: position: fixed · transition · :hover

```css
body { padding-top: 60px }
.navbar { position: fixed; top: 0 }
.close { position: absolute; top: 15px }
.menu { position: fixed; top: 60px; opacity: 0; transition: max-height 0.4s ease, opacity 0.4s ease }
.menu.open { opacity: 1 }
.menu li { opacity: 0; transform: translateY(-10px); transition: opacity 0.4s ease, transform 0.4s ease }
.menu li.show { opacity: 1; transform: translateY(0) }
```

### [Navigation Bar (Sticky and Responsive) v1 (CSS)](https://codepen.io/wolfferine/pen/PwPJVBY)

held: sticky header | made with: position: sticky · transition · :hover

```css
section { position: relative }
header { margin-bottom: 50px; position: sticky; top: 0 }
#logo { text-transform: uppercase }
nav ul li a { transition: all 0.5s ease 0s }
nav ul li a:hover { transition: all 0.5s ease 0s }
nav ul li a:hover i { transition: all 0.5s ease 0s }
nav ul li a i { transition: all 0.5s ease 0s }
.toggle-menu ul li { margin-bottom: 4px }
.toggle-menu ul li:last-child { margin-bottom: 0px }
.content { margin-bottom: 60px }
.content h2 { border-bottom: 1px solid #fde428; padding-bottom: 10px; margin-bottom: 10px }
footer { padding-bottom: 30px }
```

### [2025-08-11 - parallax with sticky content](https://codepen.io/loiclaudet/pen/yyYzorY)

held: fixed div, sticky div.content, sticky div.content, sticky div.content | on scroll: img.: transform+top ×2, div.: transform+top, div.content: transform+top | on hover of img.: div.: transform+top, div.content: transform, img.: transform+top | made with: position: sticky · prefers-reduced-motion · GSAP · ScrollTrigger

```css
.content { position: sticky; top: 0 }
section { position: relative }
.image-container { position: absolute; top: 0 }
img { position: absolute; bottom: 0 }
h2 { text-transform: uppercase }
```

```js
ScrollTrigger.create({
```

### [Sticky on Scroll](https://codepen.io/baahubali92/pen/gbaMqgB)

held: sticky div.sticky-fake, sticky div.col, sticky div.col, sticky div.col, sticky div.col, sticky div.col, sticky div.col, sticky div.sticky-fake, sticky div.col, sticky div.col | made with: position: sticky · transition · custom properties driven by JS

```css
.sticky-fake { position: sticky; top: 0 }
.sticky-box { position: sticky; top: var(--stick-top, 0px); transition: top 0.3s ease }
```

```js
style.setProperty('--stick-top', `${topValue}px`)
```

### [Responsive Sticky Navbar](https://codepen.io/ArsenTech/pen/raOBYvG)

held: fixed nav.navbar | on scroll: a.: color+top ×6, nav.navbar: background, h2.: color+top, img.menu: filter | on hover of a.: a.: color, h2.: color | made with: position: fixed · transition · :hover · scroll listener

```css
.navbar { position: fixed; top: 0; transition: 0.3s linear }
.left a { transition: 0.3s linear }
.right a { transition: 0.3s linear }
section { padding-top: 150px }
.sticky { transition: 0.3s linear }
.sticky .menu { filter: invert(1) }
.right { position: absolute; top: 0; transition: 0.3s ease all }
```

```js
addEventListener("scroll", () => {
```

### [Sticky Navbar](https://codepen.io/ArsenTech/pen/JoYPObp)

held: fixed nav.navbar | on scroll: a.: color+top ×6, nav.navbar: background, h2.: color+top | on hover of a.: a.: color, h2.: color | made with: position: fixed · transition · :hover · scroll listener

```css
.navbar { position: fixed; top: 0; transition: 0.3s linear }
.left a { transition: 0.3s linear }
.right a { transition: 0.3s linear }
section { padding-top: 150px }
.sticky { transition: 0.3s linear }
```

```js
addEventListener("scroll", () => {
```

### [Scroll Snap + Sticky](https://codepen.io/Alpesh_Rajpurohit/pen/myJgGNa)

held: sticky div.container-fluid, sticky div.full_odd_even_img | on scroll: div.full_odd_even_content: transform+top | made with: position: sticky · transition · scroll listener

```css
.bg_cover { background-position: 50% 50% }
section { border-bottom: 1px solid #ccc }
.full_odd_even_img { position: relative; margin-bottom: -48px }
.full_odd_even_content_inner p { margin-bottom: 26px }
.odd_even_green_triangle { position: absolute; bottom: -1px }
.full_odd_even_img { margin-bottom: 0 }
.full_odd_even_wrapper { position: relative }
.full_odd_even_wrapper .container-fluid { position: sticky; top: 0 }
.full_odd_even_img { position: sticky; top: 0 }
.full_odd_even_content { transition: transform 0.1s linear }
```

```js
addEventListener("scroll", () => {
```

### [Sticky Text Reveal](https://codepen.io/joebentaylor/pen/EajGLQR)

held: sticky div.sticky | on scroll: div.char: opacity+filter+top ×61, section.image: clip-path+top, img.: transform+top | on hover of img.: section.image: clip-path, img.: transform | made with: position: sticky · mix-blend-mode · GSAP · ScrollTrigger · Lenis / smooth scroll

```css
.image { position: relative }
.image:after { position: absolute; inset: 0; mix-blend-mode: multiply }
.image img { position: absolute; top: 0; filter: grayscale(100%) }
.image span { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.text { position: relative }
.text .sticky { position: sticky; top: 0 }
.text-content { position: relative }
.text p.rel { position: relative }
.text p.rel .char { opacity: 1; filter: blur(0px); will-change: filter }
.text p.abs { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.text p.abs .char { opacity: 0; filter: blur(12px); will-change: filter }
```

```js
gsap.timeline({
scrollTrigger: { trigger: '.image-top', start: 'bottom 90%', end: 'bottom 0%', markers: false, scrub: SCRUB_SPEED }
scrollTrigger: { trigger: '.image-bottom', start: 'top 90%', end: 'top 0%', markers: false, scrub: SCRUB_SPEED }
scrollTrigger: { trigger: '.text', start: "center 100%", end: "center 50%", markers: false, scrub: SCRUB_SPEED }
scrollTrigger: { trigger: '.text', start: "center 50%", end: "center 0%", markers: false, scrub: SCRUB_SPEED }
```

### [Revealing footer underneath main](https://codepen.io/brumgb/pen/RNPJGbV)

held: sticky footer | made with: position: sticky

```css
main { position: relative }
footer { position: sticky; bottom: 0 }
h1 { margin-bottom: 2rem }
```

### [Filter Search - Javascript](https://codepen.io/samsimite/pen/azOJQOX)

held: sticky div.sticky | made with: position: sticky

```css
.sticky { position: sticky; top: 0 }
.header { position: absolute; bottom: 0 }
```

### [Earth Species - Javascript](https://codepen.io/samsimite/pen/YPXNBem)

held: sticky div.header | on hover of button.button1: button.button1: color | made with: position: sticky · :hover

```css
.box { position: absolute; top: 0; bottom: 0 }
.header { position: sticky; top: 0 }
.content { position: relative; top: 0 }
.main { position: absolute; top: 65px; bottom: 0 }
.alphabet { position: absolute; top: 0 }
.mySlides { position: absolute; top: 0; bottom: 0 }
.slideshow-container { position: absolute; top: 0; bottom: 0 }
.channel { position: absolute; top: 0 }
.name { position: absolute; bottom: 0 }
.tv { position: absolute; top: 0; bottom: 55px }
.next { position: absolute; top: 0; bottom: 0 }
.button22:hover { filter: brightness(120%) }
```

### [Demo_PositionSticky_1](https://codepen.io/Wassenaar/pen/yyNNKEE)

held: sticky div.exampleElementStickyRed, sticky div.exampleElementStickyGreen, sticky div.exampleElementStickyBlue | made with: position: sticky

```css
.exampleElementStickyRed { position: sticky; top:0 }
.exampleElementStickyGreen { position: sticky; top:200px }
.exampleElementStickyBlue { position: sticky; top:0 }
```

### [Sticky Header Carousel - Javascript](https://codepen.io/samsimite/pen/ZYGERea)

held: sticky div.header | on hover of button.dropbtn: button.dropbtn: background | made with: position: sticky · :hover

```css
.box { position: absolute; top: 0; bottom: 0 }
.header { position: sticky; top: 0 }
.content { position: relative; top: 0 }
.dropdown-content { position: absolute; box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2) }
.tabcontent1 { position: absolute; top: 32px; bottom: 0 }
.name { position: absolute; bottom: 20px }
.auto { position: absolute; bottom: 10px }
.button1:hover { filter: brightness(120%) }
.next { position: absolute; top: 0; bottom: 0 }
.button2:hover { filter: brightness(120%) }
.prev { position: absolute; top: 0; bottom: 0 }
.button3:hover { filter: brightness(120%) }
```

### [project-47](https://codepen.io/DominicNikolai/pen/pvJobVY)

made with: @keyframes · pointer / mouse tracking

```css
.elem { position: absolute; animation: ripple 2s ease-in-out forwards }
0% { transform: scale(0) translateY(0); opacity: 1 }
100% { transform: scale(10) translateY(-1vmax); opacity: 0 }
#smoke { position: absolute; top: 0 }
@keyframes ripple animates transform, opacity
```

```js
addEventListener("mousemove", createSmoke)
```

### [Responsive menu with dropdowns](https://codepen.io/Peter-Lundstr-m/pen/Byybrrz)

held: sticky header | made with: position: sticky · transition · :hover · scroll listener

```css
header { position: sticky; top: 0; transition: padding 0.3s ease, background-color 0.3s ease }
.logo img { transition: width 0.3s ease }
.nav-item { position: relative }
.chevron { transition: transform 0.3s ease }
.nav-item:hover .chevron { transform: rotate(180deg) }
.submenu { position: absolute; top: 100% }
.hamburger span { transition: all 0.3s ease }
.hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px) }
.hamburger.active span:nth-child(2) { opacity: 0 }
.hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(7px, -7px) }
.nav-menu { position: absolute; top: 100% }
.nav-item.active .chevron { transform: rotate(180deg) }
```

```js
addEventListener('scroll', () => {
```

### [Sticky Navigation Menu Animated On Scroll](https://codepen.io/noirsociety/pen/XJJqpyY)

held: sticky nav | made with: position: sticky · transition · :hover · scroll listener

```css
&:hover a:not(:hover) { border-bottom: none }
& li:nth-of-type(2) a { border-bottom: 2px solid white }
&:hover { border-bottom: 2px solid white }
.navAnimation { transform: translateY(-82px) }
& h2 { margin-bottom: 2.5rem }
```

```js
addEventListener('scroll',updateNav,false)
```

### [Paragraphs Navigation](https://codepen.io/alexandro_lebrucho/pen/zxxOyYQ)

held: sticky div.article-about__navigation | on scroll: a.article-about__navigation-link: color+top ×2 | made with: position: sticky · scroll listener · requestAnimationFrame

```css
.article-about { margin-bottom: 212px }
.article-about { margin-bottom: 148px }
.article-about__left-title { text-transform: uppercase; position: relative }
.article-about__left-title-img { position: absolute; top: 24px; transform: translateX(50%) }
.article-about__right-title { margin-bottom: 24px; text-transform: uppercase }
.article-about__right-text { margin-bottom: 24px }
.article-about__right-text:last-of-type { margin-bottom: 0 }
.article-about__navigation { position: sticky; top: 20px }
.article-about__navigation-title { margin-bottom: 20px }
```

```js
requestAnimationFrame(() => {
addEventListener("scroll", throttle(navigate, 100))
```

### [profile block](https://codepen.io/hwarium/pen/XJWvaxj)

made with: nothing recognised — read the code

### [profile code](https://codepen.io/hwarium/pen/gbOVLWV)

made with: backdrop-filter

### [tarot card](https://codepen.io/hwarium/pen/RNwXoVO)

made with: nothing recognised — read the code

### [Sticky Services for Holcomb-Kreithen](https://codepen.io/clang/pen/qEBzEey)

held: sticky div.media, sticky div.media, sticky div.media | made with: position: sticky

```css
.media { margin-top: -150vh }
```

### [profile graphic card](https://codepen.io/hwarium/pen/KwKYBpb)

made with: backdrop-filter

### [profile card](https://codepen.io/hwarium/pen/emYojmw)

made with: nothing recognised — read the code

### [polaroid with text](https://codepen.io/hwarium/pen/VYwNdom)

made with: nothing recognised — read the code

### [polaroid with signature](https://codepen.io/hwarium/pen/xbxezvG)

made with: nothing recognised — read the code

### [profile card](https://codepen.io/hwarium/pen/JojVZQd)

made with: nothing recognised — read the code

### [spotify graphic light](https://codepen.io/hwarium/pen/LEYvroG)

made with: nothing recognised — read the code

### [spotify graphic dark](https://codepen.io/hwarium/pen/jEORKRv)

made with: mix-blend-mode

### [about me card](https://codepen.io/hwarium/pen/YPzMvMp)

made with: nothing recognised — read the code

### [novel style profile graphic](https://codepen.io/hwarium/pen/dPyLKrM)

made with: nothing recognised — read the code

### [postcard style profile graphic](https://codepen.io/hwarium/pen/jEORKdp)

made with: nothing recognised — read the code

### [co-star style profile css](https://codepen.io/hwarium/pen/MYWRXZZ)

made with: nothing recognised — read the code

### [modern card with airbrush background](https://codepen.io/hwarium/pen/YPzMvdG)

made with: nothing recognised — read the code

### [profile card with background text](https://codepen.io/hwarium/pen/MYWRXPz)

made with: nothing recognised — read the code

### [link card](https://codepen.io/hwarium/pen/RNwOJeo)

made with: clip-path

### [aesthetic graphic](https://codepen.io/hwarium/pen/YPzMvOW)

made with: nothing recognised — read the code

### [link list](https://codepen.io/hwarium/pen/azbxKje)

made with: clip-path · mix-blend-mode

### [musuem ticket](https://codepen.io/hwarium/pen/WbNWyyM)

made with: mix-blend-mode

### [profile graphic](https://codepen.io/hwarium/pen/QwWPxrm)

made with: nothing recognised — read the code

### [profile card](https://codepen.io/hwarium/pen/XJWQJYE)

made with: nothing recognised — read the code

### [Card sticky](https://codepen.io/agweb-co-in/pen/bNGQgXR)

held: sticky card.card, sticky card.card, sticky card.card, sticky card.card, sticky card.card | made with: position: sticky · scroll-driven animation (animation-timeline) · view() timeline

```css
.card { position: sticky; animation: cardmove; animation-timeline: view() }
.container .card:nth-child(1) { top:10px; transform: scaleX(0.7) }
.container .card:nth-child(2) { top:20px; transform: scaleX(0.75) }
.container .card:nth-child(3) { top:30px; transform: scaleX(0.80) }
.container .card:nth-child(4) { top:40px; transform: scaleX(0.85) }
```

### [Bootstrap Sticky navi](https://codepen.io/mazaka/pen/dPyjgZr)

held: sticky nav.navbar | on scroll: a.nav-link: color ×2 | made with: position: sticky · scroll listener

```css
#sidebar-nav { position: sticky; top: 0 }
.target-div { scroll-margin-top: 50px }
.target-div div h4 { scroll-margin-top: 50px }
```

```js
addEventListener('scroll', () => {
```

### [Dual sticky header transaction list using the details+summary html element](https://codepen.io/MizterJeeves/pen/GgRxwRy)

held: sticky header.amount-label-header, sticky header.sticky-top, sticky header.sticky-top, sticky header.sticky-top, sticky header.sticky-top, sticky header.sticky-top, sticky header.sticky-top, sticky header.sticky-top, sticky header.sticky-top | made with: transition · backdrop-filter

```css
.transactions { position: relative; padding-top: 3rem; padding-bottom: 70rem }
.transactions .wrapper { margin-top: -56px }
.transactions .amount-label-header { backdrop-filter: blur(8px) }
details::details-content { transition: height 0.22s ease }
summary { position: relative }
summary:before { transform: rotate(90deg); transition: 0.22s ease }
summary::before, summary::after { position: absolute }
summary::after { transform: rotate(90deg) }
details[open] summary::before { transform: rotate(270deg) }
```

### [Sticky stackable headers with variable height](https://codepen.io/casperbrike/pen/mydpPeq)

held: sticky h2, sticky h2, sticky h2, sticky h2, sticky h2 | made with: position: sticky

```css
h2 { position: sticky; top: 0 }
p { padding-top: 1rem }
.wrapper { margin-bottom: 1rem }
```

### [Sticky Footer (Bootstrapless)](https://codepen.io/engza/pen/pvoEOPa)

made with: nothing recognised — read the code

```css
footer { margin-top: auto }
footer .container p:first-child { margin-top: unset !important }
footer .container p:last-child { margin-bottom: unset !important }
```

### [demo Responsive Table with Sticky Header](https://codepen.io/cbolson/pen/PwoNemO)

held: sticky th, sticky th, sticky th, sticky th | on scroll: td.: background+top ×4 | made with: position: sticky · transition · :hover

```css
.table-wrapper { position: relative }
td { transition: background-color 150ms ease-in-out }
td { position: relative }
thead th { position: sticky; top: 0 }
```

### [Experimenting with position: sticky + display: grid](https://codepen.io/denilsonsa/pen/gbOPoMo)

made with: position: sticky · :has()

```css
.grid > label:has(input:checked) { position: sticky; top: 0; bottom: 0 }
```

### [Sticky selected item](https://codepen.io/T3sT3ro/pen/WbeVMGa)

held: sticky li.selected | made with: position: sticky

```css
h1 { text-transform: capitalize }
&.selected { position: sticky; top: 0; bottom: 0 }
::-webkit-scrollbar-thumb { background-position: center }
```

### [Fill the page Header, Body, Footer](https://codepen.io/yogit/pen/JoPBqzr)

made with: nothing recognised — read the code

### [Sticky Columns for Vader](https://codepen.io/clang/pen/JoPBErm)

held: sticky div.logo, sticky div.media, sticky div.copy | made with: position: sticky

```css
.mod { position: relative }
.mod .logo-container { position: absolute; top: 0 }
.mod .logo-container .logo { position: sticky; top: 44vh }
.sticky-boys { position: relative }
.sticky-boys section:nth-of-type(1) .copy { padding-bottom: 100svh }
.sticky-boys section:nth-of-type(1) .media { position: sticky; top: 0 }
.sticky-boys section:nth-of-type(2) .copy { position: sticky; top: 0; margin-top: -100svh }
```

### [Fixed first row and column CSS](https://codepen.io/Vlatko-Magjer/pen/KwPoVNO)

held: sticky div.row, sticky div.col, sticky div.col, sticky div.col, sticky div.col, sticky div.col, sticky div.col, sticky div.col, sticky div.col, sticky div.col | on scroll: div.col: shadow+top ×20, div.col: shadow | made with: position: sticky · backdrop-filter · scroll listener · requestAnimationFrame

```css
.col:first-of-type { position: sticky }
.headers { box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.3) }
.col:first-of-type { box-shadow: 0 10px 8px 2px rgba(0, 0, 0, 0.1) }
.headers .col:first-of-type { box-shadow: 0 -4px 8px 2px rgba(0, 0, 0, 0.2) }
```

```js
addEventListener("scroll", debounce(storeScrollPosition), {
requestAnimationFrame(() => {
```

### [Sticky Table data](https://codepen.io/junihbhatt/pen/mybpGwv)

held: sticky thead, sticky th, sticky th, sticky th, sticky td, sticky td, sticky td, sticky td, sticky td, sticky td | made with: position: sticky

```css
h1 { margin-bottom: 30px }
.myTable thead { position: sticky; top: 0 }
.myTable thead th:nth-child(3), .myTable tbody td:nth-child(3), .myTable thead t { position: sticky }
```

### [Overlap areas with scrolling Vanilla JS (position: sticky;)](https://codepen.io/web_walking_nak/pen/xbKrqZN)

held: sticky main.js-scroll-overlap, sticky section.js-scroll-overlap, sticky section.js-scroll-overlap | made with: position: sticky · custom properties driven by JS

```css
.js-scroll-overlap:not(.is-disabled) { --sticky-offset: -1px; position: sticky; top: var(--sticky-offset) }
.relative { position: relative }
h1 { margin-bottom: 100px }
p + p { margin-top: 100px }
img { vertical-align: top }
```

```js
style.setProperty('--sticky-offset', offsetValue)
```

### [Cara Sticky Section Prototyping](https://codepen.io/clang/pen/azomaqE)

held: sticky section, sticky section, sticky section, sticky section, sticky section | made with: position: sticky

```css
media screen and (min-height: 1001px) { top: -600px }
.title { rotate: -90deg }
.previous-title { bottom: 0 }
.previous-title { top: -100vh; bottom: 100vh }
```

### [grid, sticky group header, tree-view like.](https://codepen.io/cfd-ack/pen/zxOqaJx)

held: sticky div.grid_header, sticky div.col1_box, sticky input, sticky label, sticky div.col2_box, sticky input, sticky label, sticky div.col3_box, sticky input, sticky label | made with: position: sticky · :has()

```css
:root { --body-top:calc(var(--header-heigth) + 1px); --check-top:calc(var(--header-heigth) + 5px) }
.stick-list-grid { position:relative; border-top:solid 1px var(--grid-line) }
.stick-list-grid input[type="checkbox"] { margin-bottom: 7px }
.check_off { border-bottom:solid 1px var(--grid-line); border-top:solid 1px transparent }
.grid_header { position:sticky; top:0 }
.col1_box { border-bottom:solid 1px var(--grid-line); position:sticky }
.col1_box > * { position:sticky; top:var(--body-top) }
.col1_box > input[type="checkbox"] { position:sticky; top:var(--check-top) }
.grid_header .col1_box > input[type="checkbox"] { top:0px }
.grid_header .col1_box > * { top:0px }
.col2_box { position:sticky; border-bottom:solid 1px var(--grid-line) }
.col2_box > * { position:sticky; top:var(--body-top) }
```

### [Sticky Parallax Copy on Scroll](https://codepen.io/clang/pen/pvzyWGm)

held: sticky div.left, sticky p, sticky p, sticky p, sticky p, sticky p, sticky p | on scroll: p.: opacity+top | made with: position: sticky · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes

```css
p + p { margin-top: 40px }
&:last-child { animation: copyAnimIn linear both, none }
0%, 75% { scale: 1; opacity: 0 }
100% { scale: 1; opacity: 1 }
100% { scale: 0.5; opacity: 0 }
@keyframes copyAnimIn animates scale, opacity
@keyframes copyAnimOut animates scale, opacity
```

### [Staggered Sticky Boxes on Scroll](https://codepen.io/clang/pen/QwLyxMz)

held: sticky div.left, sticky p, sticky p, sticky p, sticky p, sticky p, sticky p | made with: position: sticky

```css
p { position: sticky; top: calc(100px + (var(--height) * (var(--index) + 0))) }
p:last-child { margin-bottom: calc(var(--height) * -1) }
p:nth-child(1) { top: 100px }
p:last-child { margin-bottom: calc(var(--height) * -1) }
p:nth-child(1) { top: 100px }
.left { position: sticky; top: 0 }
```

### [Sticky Section Scrolling Effects](https://codepen.io/kumawatdeepa/pen/PwYZmyd)

held: sticky div.scrolled__featured | on scroll: div.scroll__view: opacity+top ×2 | made with: position: sticky · transition · IntersectionObserver · scroll listener

```css
.scroll__links .scroll__view { opacity: .15; transition: opacity .3s; margin-bottom:20px }
.scroll__links .scroll__view.active { opacity: 1 }
.scrolled__featured { position: sticky; top: 140px }
```

```js
new IntersectionObserver((entries) => {
addEventListener('scroll', () => handleMouseWheel(entry.target))
```

### [CSS_Keep Menu in View with Sticky CSS](https://codepen.io/shiuh-li/pen/YPKyzXd)

held: sticky nav | on hover of li.: li.: background | made with: position: sticky · transition · :hover · scroll listener

```css
header { border-bottom: 0 solid #e5e5e5; position: relative }
header::before { transform: scale(1.8); position: absolute; top: 0; filter: grayscale(90%) blur(0px) brightness(0.8) contrast(2.1) }
h1, h2 { text-transform: uppercase }
h1 { position: relative }
h2 { margin-bottom: min(0.5vw, 0.1rem); position: relative }
h2::before { position: absolute; bottom: 20.5%; transform: scaleX(1.05) }
nav { position: sticky; top: 0 }
nav::before { position: absolute; top: 0; transform: scaleX(1); transition: transform 0.8s ease-in-out }
nav.sticky::before { transform: scaleX(3); transition: transform 0.8s ease-in-out }
.menu li { text-transform: uppercase; transition: padding 0.5s, background-color 0.5s; position: relative }
nav.sticky .menu li { transition: padding 0.8s }
.menu li:hover, .menu li.active { transition: background-color 0.5s }
```

```js
addEventListener('scroll', function () {
```

### [Sticky-playground](https://codepen.io/cyrilpeyrot/pen/MYgYBxP)

held: sticky div.sprite1, sticky div.sprite2, sticky div.sprite3, fixed div | made with: position: sticky · position: fixed

```css
#layer { position:absolute; top:0; position:fixed }
.layer-dark { position:absolute; opacity:0.9; top:200px }
.sticky { position: sticky; top: 0px }
.encadre { position:relative }
```

### [CSS Grid Scrolling Grid Animation](https://codepen.io/clang/pen/KwPwaWZ)

held: sticky h2, sticky div.content | on scroll: h2.: opacity+top | made with: position: sticky · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · :has() · prefers-reduced-motion

```css
0%, 55% { opacity: 0 }
55%, 65% { opacity: 1 }
0%, 30% { scale: 0 }
.grid-anim-container { view-timeline: --runner }
.scaler img { animation-name: gridScale-x, gridScale-y; animation-fill-mode: both; animation-timing-function: var(--power-2-out), var(--power-1-out); animation-timeline: --runner, --runner; animation-range: entry 100% exit -20% }
.grid .layer { animation-name: gridFade, gridReveal; animation-fill-mode: both; animation-timeline: --runner, --runner; animation-timing-function: var(--sine), var(--power-1-out); animation-range: entry 100% exit 0% }
&:nth-of-type(1) { animation-timing-function: var(--sine), var(--power-1-out) }
&:nth-of-type(2) { animation-timing-function: var(--sine), var(--power-3-out) }
&:nth-of-type(3) { animation-timing-function: var(--sine), var(--power-4-out) }
.content { position: sticky; top: 0 }
img { position: absolute; top: 50%; translate: -50% -50% }
.grid { --offset: 0 }
```

### [Responsive FAQ Section with Sticky Sidebar](https://codepen.io/RIR360/pen/zxOOzBV)

held: sticky div.col-md-4, fixed div.text-start | on hover of button.btn: button.btn: background | made with: transition

```css
* { transition: all 0.3s ease-in-out }
.accordion-button { border-bottom: 1px solid }
```

### [Sticky Neon Layered](https://codepen.io/yoann-b/pen/RwXmRVY)

held: fixed div | on scroll: div.Sticky: transform+top | on hover of li.: div.Sticky: transform+top ×2 | made with: transition · :hover · pointer / mouse tracking

```css
.Layered { position: relative }
.Layered::after, .Layered::before { --element-transform: 5px; position: absolute; inset: 0; transform: translateX(0px) translateY(0px); transition: all 0.3s linear; opacity: 0 }
.Layered:hover::after, .Layered:hover::before { opacity: 1; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) }
.Layered:hover::before { transform: translateY(calc(0px - var(--element-transform))) translateX(var(--element-transform)) }
.Layered:hover::after { transform: translateX(calc(0px - var(--element-transform))) translateY(var(--element-transform)) }
.Sticky { transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) }
```

```js
addEventListener("mousemove", handleMouseMove)
addEventListener("mouseleave", resetTransform)
```

### [Sticky Observer Demo](https://codepen.io/kokoc/pen/MWNxzdr)

held: sticky div.sticky, sticky div.sticky, sticky div.sticky, sticky div.sticky | on scroll: div.sticky: background+top ×4 | made with: position: sticky

```css
.sticky { position: sticky }
.top { border-bottom: 1px solid transparent }
.top-1 { top: 0 }
.top-2 { top: var(--size) }
.bottom { border-top: 1px solid transparent }
.bottom-1 { bottom: 0 }
.bottom-2 { bottom: var(--size) }
```

### [Footer sticky bottom](https://codepen.io/POKA_MOLODOY/pen/OJKrzVO)

held: fixed nav | on scroll: a.divers-none: color | on hover of li.: a.divers-right: color | made with: position: fixed · transition · :hover · backdrop-filter · scroll listener

```css
#cubicle { position: fixed; bottom: 20px; transform: translateX(-50%); padding-top: 10px; padding-bottom: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); backdrop-filter: blur(10px) }
#cubicle > .links a { transition: background-color 0.3s, color 0.3s }
#cubicle > .links a.active { transition: color 2s }
#cubicle > .links a:hover { transition: color 2s }
```

```js
addEventListener('scroll', function() {
```

### [Multi-Directional Stickiness](https://codepen.io/chriskirknielsen/pen/YzmvNbd)

held: sticky p, sticky button | made with: position: sticky · transition · :has()

```css
p:has(+ section) { position: sticky; top: 0; margin-bottom: 1rem }
button { position: sticky; top: 2rem; bottom: 2rem; box-shadow: inset 2px 2px 4px pink, inset -2px -2px 4px rebeccapurple, 0 2px 8px -2px cyan; outline-offset: -4px; transition: all 100ms ease-in-out }
button:active { box-shadow: inset 2px 2px 4px rebeccapurple, inset -2px -2px 4px pink, 0 0 8px -2px cyan }
```

### [Sticky cards with offset and scale using CSS Scroll-Driven Animations](https://codepen.io/cbolson/pen/YzmKGNG)

held: sticky article, sticky article, sticky article, sticky article | made with: position: sticky · position: fixed · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · prefers-reduced-motion

```css
.cards { --card-top-offset: 1em; position: relative }
supports (animation-range: cover) { animation: adjust-cards linear both; animation-timeline: view(block); animation-range: cover calc(65% + var(--i) * 5%) exit calc(35% + var(--i) * 5%) }
to { scale: .5 }
body::after { position: fixed; top: 1rem }
@keyframes adjust-cards animates scale
```

### [Sticky animated header using animation-timeline](https://codepen.io/cbolson/pen/GRbVdOO)

held: sticky header | made with: position: sticky · scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @keyframes · backdrop-filter

```css
header { position: sticky; top: 0; backdrop-filter: blur(5px); animation: adjust-header linear both; animation-timeline: scroll(); animation-duration: 1ms; animation-range: 0 200px }
.wrapper img { margin-bottom: var(--gap) }
@keyframes adjust-header animates font-size, padding-block
```

### [Super Blurry Nav](https://codepen.io/mariawarnes/pen/BagXZed)

held: fixed nav | made with: position: fixed · mask · backdrop-filter

```css
nav { position: fixed; top: 0 }
.linear-blur { transform-origin: center top; position: absolute; top: 0 }
.background-layer { position: relative }
.blur-layer { position: absolute; inset: 0 }
.blur-64 { mask: linear-gradient(rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 12.5%); backdrop-filter: blur(64px) }
.blur-32 { mask: linear-gradient( rgb(0, 0, 0) 0%, rgb(0, 0, 0) 12.5%, rgba(0, 0, 0, 0) 25% ); backdrop-filter: blur(32px) }
.blur-16 { mask: linear-gradient( rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 12.5%, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 37.5% ); backdrop-filter: blur(16px) }
.blur-8 { mask: linear-gradient( rgba(0, 0, 0, 0) 12.5%, rgb(0, 0, 0) 25%, rgb(0, 0, 0) 37.5%, rgba(0, 0, 0, 0) 50% ); backdrop-filter: blur(8px) }
.blur-4 { mask: linear-gradient( rgba(0, 0, 0, 0) 25%, rgb(0, 0, 0) 37.5%, rgb(0, 0, 0) 50%, rgba(0, 0, 0, 0) 62.5% ); backdrop-filter: blur(4px) }
.blur-2 { mask: linear-gradient( rgba(0, 0, 0, 0) 37.5%, rgb(0, 0, 0) 50%, rgb(0, 0, 0) 62.5%, rgba(0, 0, 0, 0) 75% ); backdrop-filter: blur(2px) }
.blur-0-5 { mask: linear-gradient( rgba(0, 0, 0, 0) 50%, rgb(0, 0, 0) 62.5%, rgb(0, 0, 0) 75%, rgba(0, 0, 0, 0) 87.5% ); backdrop-filter: blur(1px) }
.blur-0-5 { mask: linear-gradient( to bottom, rgba(0, 0, 0, 0) 62.5%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 1) 87.5%, rgba(0, 0, 0, 0) 100% ); backdrop-filter: blur(0.5px); -webkit-backdrop-filter: blur(0.5px) }
```

### [Responsive Table CSS & HTML with Sticky Header](https://codepen.io/charleskitchton/pen/dyBeGrw)

held: sticky tr, sticky tr | made with: position: sticky

```css
thead tr { position: sticky; top: 0 }
```

### [Sticky and Skewed Cursor](https://codepen.io/maghno/pen/wvLmvpN)

held: fixed button, fixed div.mf-cursor | on scroll: div.mf-cursor: transform+top, div.mf-cursor-inner: transform+top | made with: position: fixed · transition · mix-blend-mode · GSAP

```css
button { position: relative; transition: all 0.2s ease-out; position: fixed; top: 50%; transform: translate(-50%, -50%); mix-blend-mode: difference }
button .btn-inner { position: absolute; top: 50%; transform: translate(-50%, -50%) }
button .btn-inner > span:nth-child(1) { position: absolute; top: 50%; transform: translate(-50%, -50%) }
button .btn-inner > span:nth-child(2) { position: absolute; top: 50%; transform: translate(-50%, -50%) rotate(90deg) }
button.active { transform: translate(-50%, -50%) rotate(45deg) }
.mf-cursor { position: fixed; top: 0; transition: opacity 0.3s, color 0.4s }
.mf-cursor:before { position: absolute; top: -24px; transform: scale(0.5); transition: transform 0.25s ease-in-out, opacity 0.1s, background-color 0.2s 0.1s }
.mf-cursor.-exclusion { mix-blend-mode: exclusion }
.mf-cursor.-active:before { transform: scale(1.2) }
.mf-cursor.-pointer:before { transform: scale(2); transform: scale(2) }
.mf-cursor.-text:before { opacity: 0.85; transform: scale(1.7) }
.mf-cursor.-text.-active:before { transform: scale(1.6) }
```

### [pinned card with GSAP scrolltrigger](https://codepen.io/vii120/pen/wvLpYLQ)

held: fixed div.card | on scroll: div.card: transform+top ×4, div.title: transform+top ×3, div.content: transform+top ×3 | on hover of div.card: div.content: transform+opacity+top ×4, div.content: transform+opacity | made with: mix-blend-mode · GSAP · ScrollTrigger

```css
.card .inner { transform: translateY(-50%) }
.card .title { margin-bottom: 0.2rem }
aside { position: relative }
aside .number { position: absolute; bottom: 0.2rem; mix-blend-mode: overlay }
```

```js
ScrollTrigger.create({
gsap.fromTo(
```

### [Sticky Side Nav Bar](https://codepen.io/yasmo-yasmoo/pen/oNrWExa)

held: sticky nav.navigation | made with: position: sticky

```css
.navigation { position: -webkit-sticky; position: sticky; top: 0 }
.item { margin-bottom: 10px; margin-top: 20px; border-bottom: #00ffff solid 1px }
.line1 { position: absolute; top: 10px }
.line2 { position: absolute; top: 20px }
.line3 { position: absolute; bottom: 10px }
.line4 { position: absolute; bottom: 20px }
.line5 { position: absolute; top: 0 }
.line6 { position: absolute; top: 0 }
```

### [Sticky nav as parent scrolls out of view](https://codepen.io/cbolson/pen/VwJKyxw)

on hover of button.: span.material-symbols-outlined: opacity+top | made with: position: fixed · transition · :hover · :focus-visible · backdrop-filter · IntersectionObserver

```css
section + section { margin-top: 2rem }
nav { backdrop-filter: blur(4px) }
nav.fixed { position: fixed; inset: .5rem auto auto auto }
nav > button > span { opacity: .5; transition: opacity 300ms ease-in-out,scale 300ms ease-in-out }
nav > button:hover > span, nav > button:focus-visible > span { opacity: 1; scale: 1.1 }
```

```js
new IntersectionObserver(
```

### [Sticky Audio Player](https://codepen.io/chanduravilla/pen/xxowwQx)

made with: nothing recognised — read the code

```css
.audio-player { box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3) }
input[type="range"]::-webkit-slider-thumb { transform: translateY(-50%) }
.volume-container { position: absolute; bottom: 50px; transform: translateX(-50%) }
```

### [Sticky (Expandable + Snappable onScroll) Header](https://codepen.io/ryomario/pen/mdYKqdv)

held: sticky header, sticky footer | on scroll: header.: transform+top | made with: position: sticky · scroll listener · requestAnimationFrame

```css
#frame { position: relative }
header { box-shadow: 0 2px 4px #0007; position: sticky; top: 0 }
header[data-visibility='hidden'] { box-shadow: none }
footer { position: sticky; bottom: -1px }
```

```js
requestAnimationFrame(() => {
addEventListener('scroll', ScrollHandler)
```

### [hide/show toplink only if needed 100% CSS](https://codepen.io/gc-nomade/pen/QWRrqmb)

held: sticky i.fa-regular | made with: position: sticky · :hover · :has() · container queries

```css
footer { margin-top: auto }
a[href="#top"] i { position: sticky; top: calc(100vh - 1.2em) }
```

### [Sticky scroll cards](https://codepen.io/HollosJ/pen/rNgJZjV)

held: sticky div.card, sticky div.card, sticky div.card, sticky div.card, sticky div.card | made with: position: sticky

```css
.container { position: relative }
.card { position: sticky; box-shadow: 0px 3px 4px -3px rgba(17, 17, 17, 0.05), 0px 4px 8px -3px rgba(17, 17, 17, 0.05) }
.card:nth-child(1) { top: 10px }
.card:nth-child(2) { top: 20px }
.card:nth-child(3) { top: 30px }
.card:nth-child(4) { top: 40px }
.card:not(:first-child) { margin-top: 4rem }
```

### [Firefox sticky & flex bug](https://codepen.io/petersandor/pen/zYQEYRN)

held: sticky custom-element.toolbar | made with: position: sticky · :hover

```css
.toolbar { position: sticky; top: 40px }
.toolbar-container { position: relative }
```

### [Sticky Text Button](https://codepen.io/mustafauncuoglu/pen/rNgzPJE)

on hover of div.btn: div.btn: background, div.btn_text: transform | made with: transition · :hover · pointer / mouse tracking

```css
.btn { transition: 0.2s ease }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseenter", (e) => {
addEventListener("mouseleave", (e) => {
```

### [just another sticky section layout](https://codepen.io/p0waqqatsi/pen/wvbzQxj)

held: fixed div.text-align-center, sticky div.tabs_sticky-wrapper | made with: position: sticky · transition · :hover · 3D (perspective / preserve-3d) · GSAP · ScrollTrigger · scroll listener

```css
.intro-wrapper { position: relative }
.intro { position: relative }
.text-align-center { position: absolute; top: 50px }
.text-align-center { will-change: transform, opacity }
.margin-small { margin-bottom: 0 }
.light-green-underline { box-shadow: none }
p { margin-bottom: 5rem }
sup { top: 0em }
sub, sup { position: relative }
.section_tabs { position: relative }
.padding-section-large { padding-top: 7rem; padding-bottom: 7rem; position: relative }
.padding-section-large { padding-top: 2rem; padding-bottom: 0rem }
```

```js
gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.create({
addEventListener("scroll", function () {
```

### [sticky stacking on scroll - desktop](https://codepen.io/p0waqqatsi/pen/mdYEYqe)

held: fixed div.s__rays, sticky div.stack-cards | on scroll: path.[object: transform+top ×27, div.stack-cards__item: transform+top | on hover of div.stack-cards-container: path.[object: transform+top ×27, div.stack-cards__item: transform+top | made with: position: sticky · position: fixed · @keyframes · transition · scroll listener

```css
.stack-cards-container { position: relative }
.stack-cards-container { position: relative }
.s__rays { position: fixed; top: 0 }
a-rays { position: absolute; opacity: 1; transform: skew(-20deg); transition: opacity .7s linear; will-change: opacity }
a-rays .a__scene { position: absolute; top: 0; transform: translate3d(-50%,0,0) }
a-rays .a__scene path { animation: a-rays-move 25s linear infinite; will-change: transform }
.stack-cards { position: -webkit-sticky; position: sticky; top: 50%; transform: translateY(-50%) }
.stack-cards__item { box-shadow: 0 6px 12px rgba(0, 0, 0, 0.32); position: absolute; top: 50%; transform: translate(-50%, -50%); transition: transform 1.3s cubic-bezier(0.9, -0.2, 0.1, 1.2), opacity 1.3s cubic-bezier(1, 0, 0, 1) 0s; will-cha }
.inner { position: relative }
.stack-cards__item h3 { margin-top: 0 }
.stack-cards__item .counter { position: absolute; bottom: 0 }
.shadow { position: absolute; top: .5rem }
```

```js
addEventListener('scroll', () => {
```

### [25. Sticky Navbar](https://codepen.io/alishata/pen/wvbKrvy)

held: fixed nav.nav | on scroll: a.: color+top ×3, nav.nav: background+shadow, a.: filter+color+top, br.: color+top, a.active: color+top | on hover of a.: a.: color, br.: color | made with: position: fixed · @keyframes · transition · :hover · mask · backdrop-filter · scroll listener

### [showcasing projects sticky section idea](https://codepen.io/p0waqqatsi/pen/abrvJEx)

held: sticky div.sticky, sticky div.sticky, sticky div.sticky, sticky div.sticky, sticky div.sticky | on hover of a.inline-link: path.[object: filter | made with: position: sticky · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · transition · :hover · GSAP

```css
body { position: relative }
.work { padding-bottom: 0 }
.project { animation: fadeOut linear forwards; animation-range: cover 70% cover 95%; animation-timeline: view() }
.media { animation: fadeIn ease-in-out both, fadeOut ease-in forwards; animation-range: cover 30% contain 50%, contain 90% cover 100%; animation-timeline: view() }
.sticky { position: sticky; bottom: 0 }
a { text-underline-offset: max(.1em, 2.5px); transition: text-decoration-color .2s ease-in-out, font-weight .2s ease-in-out }
0% { opacity: 1 }
100% { opacity: 0 }
0% { opacity: 0; transform: scale(.95) }
100% { opacity: 1; transform: scale(1) }
0% { filter: url('#squiggly-0') }
25% { filter: url('#squiggly-1') }
```

### [Sticky Navigation on scroll](https://codepen.io/Vasantha-Deepika-S/pen/rNgNRwr)

made with: position: fixed · :hover

```css
.sticky { position: fixed; top: 0 }
.sticky + .content { padding-top: 60px }
```

### [Nav-bar Auto Hide](https://codepen.io/mustafauncuoglu/pen/eYoqwoO)

held: fixed nav.nav-bar | on scroll: nav.nav-bar: transform+top | made with: position: fixed · scroll() timeline · transition · :hover · backdrop-filter · scroll listener

```css
.nav-bar { position: fixed; transform: translateY(-100px); transition: transform 0.3s; top: 0; -webkit-backdrop-filter: blur(50px); backdrop-filter: blur(50px) }
.nav-bar:hover, .sticky { transform: translateY(0) }
```

```js
addEventListener("scroll", function () {
```

### [JS Hide & show sticky when scroll (Works on macOS/iOS browser with smooth scroll)](https://codepen.io/dukecroc/pen/LYvKYYN)

held: sticky div.active | on scroll: div.active: opacity | made with: position: sticky · transition · scroll listener

```css
#stickyDiv { position: sticky; top: 0; opacity: 0; transition: opacity 0.5s }
#stickyDiv.active { opacity: 1 }
```

```js
addEventListener("scroll", handleScroll)
```

### [Horizontal scroll Sticky Header](https://codepen.io/rocksack/pen/QWPzZmW)

held: sticky div | made with: position: sticky

```css
#scroll-element { position: relative }
#timeline { position: sticky; top: 0; opacity: 0.8 }
#showtimes { opacity: 0.4 }
```

### [Sticky Cursor](https://codepen.io/meluiz/pen/RwOEjOr)

on scroll: div.cursor: transform+top | made with: transition · pointer / mouse tracking · requestAnimationFrame

```css
html, body { position: relative }
.cursor { position: absolute; top: var(--cursor-y, 0px); transform: translate(-50%, -50%) }
.cursor.outer { transition: 50ms linear; transform: translate(-50%, -50%) scale(var(--scale-x, 1), var(--scale-y)) rotate(var(--angle)) }
```

```js
requestAnimationFrame(this.#loop.bind(this))
addEventListener("mousemove", (event) => {
addEventListener("mouseenter", this.#getAttributes)
addEventListener("mouseleave", this.#clear)
```

### [sticky numbered section idea](https://codepen.io/p0waqqatsi/pen/KKYbKbo)

held: sticky div.sticky-number | made with: position: sticky · @keyframes · transition · clip-path · scroll listener

```css
.container { padding-bottom: 30px }
.sticky-number { position: sticky; top: 0; padding-bottom: 25rem; transition: top 0.3s ease }
.section { padding-bottom: 5rem }
.section p { padding-bottom: 20px }
.section:last-child { padding-bottom: 7rem }
.section h2 { padding-top: 5rem }
.sticky-number.animating { animation: numberAnimation 0.3s ease }
from { transform: translateY(0) }
to { transform: translateY(-20px) }
.Line_wrap { position: relative; transition: width 0.5s ease }
.is-drawn { animation: draw 1s; animation-fill-mode: forwards }
0% { clip-path: polygon(min(8%, 13px) min(8%, 13px), calc(100% - min(8%, 13px)) min(8%, 13px), calc(100% - min(8%, 13px)) calc(100% - min(8%, 13px)), min(8%, 13px) calc(100% - min(8%, 13px)), min(8%, 13px) min(8%, 13px), 0 0, }
```

```js
addEventListener("scroll", function() {
```

### [Sticky cursor](https://codepen.io/EspressoCat/pen/poBQpbq)

held: fixed div.cursor, fixed svg.[object | on scroll: div.cursor: transform+top | on hover of button.btn: button.btn: transform, div.: transform+top, div.cursor: transform+top | made with: position: fixed · :hover · mix-blend-mode · GSAP · pointer / mouse tracking

```css
[data-hover-bounds] { position: absolute; top: 0; inset: 0 }
[data-hover-bounds] { transform: scale(4) }
.cursor { position: fixed; top: 0; transform: translate(-50%, -50%); mix-blend-mode: difference }
.cta { position: fixed; top: -999px }
```

```js
gsap.to(this.el, {
addEventListener("pointermove", (event) => {
addEventListener("pointermove", onMouseMove)
```

### [Layered Sticky Footer](https://codepen.io/JMChristensen/pen/abxQwPg)

held: sticky div.footer | made with: position: sticky

```css
.main { position: relative }
& h2 { padding-bottom: 1rem; border-bottom: 1px solid #333 }
& .footer__inner { border-top: 1px solid #333 }
```

### [Back to top button - CSS only](https://codepen.io/BlogFire/pen/XWQPNPx)

held: sticky a.to-top | made with: position: sticky

```css
.to-top { position: sticky; bottom: 1rem }
```

### [Sticky Posts For Anki](https://codepen.io/blackMarket00/pen/NWmzdwm)

made with: nothing recognised — read the code

```css
.post-it { position: relative; box-shadow: 0 8px 10px -7px black; transform: rotate(1deg) }
.post-it::before { position: absolute; top: 0; border-bottom: 45px solid transparent; box-shadow: 3px 3px 2px #dbd581 }
.nightMode .post-it { position: relative; box-shadow: 0 8px 10px -7px black; transform: rotate(1deg) }
.nightMode .post-it::before { position: absolute; top: 0; border-bottom: 45px solid transparent; box-shadow: 3px 3px 2px #dbd581 }
.post-it2 { position: relative; box-shadow: 0 8px 10px -7px black; transform: rotate(-1deg) }
.post-it2::before { position: absolute; top: 0; border-bottom: 45px solid transparent; box-shadow: -3px 3px 2px #e6a1a8 }
.nightMode .post-it2 { position: relative; box-shadow: 0 8px 10px -7px black; transform: rotate(-1deg) }
.nightMode .post-it2::before { position: absolute; top: 0; border-bottom: 45px solid transparent; box-shadow: -3px 3px 2px #e6a1a8 }
```

### [Table with Sticky Column - Tailwind CSS](https://codepen.io/cruip/pen/OJGZZyJ)

held: sticky th.px-5, sticky td.px-5, sticky td.px-5, sticky td.px-5, sticky td.px-5, sticky td.px-5, fixed div.fixed | on hover of button.h-8: button.h-8: background+color, span.text-slate-200: color | made with: clip-path

### [sticky navbar + glassmorphism scroll transition animation](https://codepen.io/Stimmler/pen/LYvdzVG)

held: sticky header | on scroll: li.: color ×4, header.: background+color, nav.: color, ul.: color | made with: position: sticky · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · backdrop-filter

```css
:root { --animationDistance: 12rem }
header { box-shadow: 0 4px 4px -4px black; position: sticky; top: 0; animation: transformNav linear forwards; animation-timeline: view(); animation-range-start: 100vh; animation-range-end: calc(100vh + var(--animationDistance)) }
to { backdrop-filter: blur(0.35rem) }
@keyframes transformNav animates color, background-color, backdrop-filter
```

### [stacking cards with GSAP](https://codepen.io/vii120/pen/jORZQNE)

on scroll: section.card: transform+top ×2 | made with: backdrop-filter · GSAP · ScrollTrigger

```css
.card { box-shadow: 0 0 15px #0001; backdrop-filter: blur(10px) }
.card .desc { opacity: 0.9 }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to(card, {
```

### [Sticky Cards on Scroll](https://codepen.io/ismailvtl/pen/WNWXBVx)

held: sticky div.card, sticky div.card, sticky div.card, sticky div.card | made with: position: sticky

```css
.container { position: relative }
.card { position: sticky }
.one { top: 50px }
.two { top: 80px }
.three { top: 110px }
.four { top: 140px }
```

### [Minimal Responsive Cookie Policy Footer](https://codepen.io/jasper/pen/MWRvyrQ)

made with: transition · :hover

```css
body { position: relative }
.book-call { position: absolute; bottom: 2vh }
.book-call .button a { transition: background 300ms ease }
.book-call.your-favourite-colour .button a { transition: background 300ms ease }
.by { text-transform: uppercase }
.book-call { bottom: 0; border-bottom: 0 }
```

### [Sticky sidebar (light/dark)](https://codepen.io/connah99/pen/LYvNoGQ)

held: sticky div.sidebar-wrapper | on scroll: a.sidebar-link: transform+top | made with: position: sticky · position: fixed · transition · :hover · backdrop-filter · scroll listener

```css
.header-one { margin-top: 0px }
#dark-mode-toggle { transition: 350ms }
#dark-mode-toggle:hover { transform: scale(1.1) }
#dark-mode-toggle:active { transform: scale(0.9); transition: transform 100ms }
.sidebar-wrapper { position: sticky; top: 25px }
.sidebar { box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); transition: 250ms }
.sidebar { -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px) }
.reading-progress-container { margin-top: 25px }
.sidebar a { transition: 250ms }
.sidebar-link.active { transform: scale(1.05); transition: transform 0.3s ease, font-weight 0.3s ease }
.author-box { margin-top: 20px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); transition: 250ms }
.author-box { -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px) }
```

```js
addEventListener("scroll", throttle(handleScroll, 25))
```

### [Position Sticky Example](https://codepen.io/get-web/pen/JjVGaKE)

held: sticky div.item__title, sticky div.item__title, sticky div.item__title | made with: position: sticky

```css
.item__title { text-transform: uppercase; position: sticky; top: 0 }
.item__img { position: relative }
```

### [Sticky Social Icons - CSS/HTML - Left](https://codepen.io/codewithshabbir/pen/gOyYBwv)

held: fixed div.sticky-icon | made with: position: fixed · transition · :hover

```css
.sticky-icon { position: fixed; top: 15% }
.sticky-icon a { transform: translate(-160px, 0px); text-transform: uppercase; transition: all 0.8s }
.sticky-icon a:hover { transform: translate(0px, 0px) }
.sticky-icon a:hover i { transform: rotate(360deg) }
.sticky-icon a i { transition: all 0.5s }
#myBtn { position: fixed; bottom: 20px }
```

### [Resposive Table with Sticky Headers and Columns](https://codepen.io/ItsAtomTECH/pen/NWJQPRY)

held: sticky tr.sticky_header, sticky th.sticky_column_left, sticky th.sticky_column_right, sticky td.sticky_column_left, sticky td.sticky_column_right, sticky td.sticky_column_left, sticky td.sticky_column_right, sticky td.sticky_column_left, sticky td.sticky_column_right, sticky td.sticky_column_left | made with: position: sticky · transition · :hover

```css
*::-webkit-scrollbar-thumb { transition:0.4s; opacity:0.4 }
.primary_color::placeholder { opacity: 0.6 }
.translu_grad { -webkit-transition:0.3s; transition:0.3s }
.sticky_header { position:sticky; top:0px }
.sticky_column_left { position:sticky }
.sticky_column_right { position:sticky }
.padded_colms > td { padding-top:10px; padding-bottom:10px }
```

### [Process steps](https://codepen.io/agredalex/pen/yLwQYXJ)

held: sticky div.lg:flex-col | made with: :hover · IntersectionObserver

```js
new IntersectionObserver(
```

### [Untitled](https://codepen.io/andr-higinocarioca/pen/qBvMoez)

on scroll: div.content: opacity+top | made with: position: sticky · @keyframes · transition · :hover

```css
str-style, section#one .title text, section#one .title path { animation: dash 4s linear forwards }
h1, h2, header a { text-transform: uppercase }
header, footer { position: relative }
header { position: -webkit-sticky; position: sticky; top: 0 }
header h3 { position: relative }
header ul li { position: relative; transition: all 0.2s linear }
header ul li::before { position: absolute; top: calc(100% + 4px); transform: rotate(-5deg); transition: all 0.2s ease-out }
progress { position: relative }
progress::-webkit-progress-value { position: absolute; top: -2px }
section { position: relative }
section#one { background-position: center }
section#one h1 { opacity: 0 }
```

### [Header sticky](https://codepen.io/fauzanmy/pen/MWxBVbO)

held: sticky header.sticky | made with: position: sticky

```css
.sticky { position: sticky; top: 0; opacity: .7 }
```

### [Sticky Navigation Menu ( Animation )](https://codepen.io/noirsociety/pen/vYPpjPE)

held: fixed div.logo, sticky ul.nav-bottom | on scroll: ul.nav-bottom: transform+top | on hover of li.: a.: color | made with: position: sticky · position: fixed · transition · :hover · scroll listener

```css
& .logo { position: fixed }
& li:first-of-type a { padding-bottom: 0.75rem; border-bottom: 1px solid var(--active) }
& li:hover a { padding-bottom: 0.75rem; border-bottom: 1px solid var(--active) }
.hero { border-top: 1px solid rgba(0,0,0,0.3) }
.border { border-top: none }
```

```js
addEventListener('scroll',sticky,false)
```

### [25-Sticky Navbar](https://codepen.io/timothyguo/pen/xxBLZdx)

held: fixed nav.nav | on scroll: a.: color+top ×4, nav.nav: background+shadow | on hover of a.: a.: color | made with: position: fixed · transition · :hover · scroll listener

```css
body { padding-bottom: 50px }
.hero { background-position: bottom center; margin-bottom: 20px; position: relative }
.hero::before { position: absolute; top: 0 }
.nav { position: fixed; top: 0; transition: all 0.3s ease-in-out }
.nav .container { transition: all 0.3s ease-in-out }
.nav a { transition: all 0.3 ease-in-out }
.nav.active { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3) }
```

```js
addEventListener("scroll", fixNav)
```

### [NAvbar Using FlexBox #css #flexbox](https://codepen.io/isanka-Maduwantha/pen/mdomaVM)

held: sticky div.flexbox | on hover of a.: a.: transform+background+color+top, li.: color+top | made with: position: sticky · transition · :hover

```css
nav a:hover { transform: rotateY('3deg'); transform: scale(1.1) }
.container__box { transition: 0.3s ease-in; border-bottom: 2vh solid rgb(255, 252, 252) }
.container__box-header { opacity: 0.8; transition: 0.3s linear }
#Service { border-bottom: 0 }
```

### [Responsive Retro Navigation Bar (SCSS, no JS)](https://codepen.io/tats-faire/pen/vYPKQgr)

held: fixed nav | made with: position: fixed · scroll-snap · transition · :hover · clip-path

```css
html { scroll-snap-type: proximity; scroll-snap-points-y: repeat(100vh); scroll-snap-type: y proximity }
nav { position: fixed; top: 0; border-bottom: 1.5px solid #1B2223 }
#portrait { clip-path: circle(40%) }
.content-wrap { margin-top: 100px }
section { scroll-snap-align: end }
#portrait { clip-path: circle(37%) }
#nav-items > ul { position: absolute; transition: height 0.3s step-start; top: 79px }
#nav-items > ul > :last-child { border-bottom: 1.5px solid #254773 }
.nav-icon > label > span { border-top: 3px solid #254773 }
.content-wrap { margin-top: 79px }
```

### [Sticky navigation](https://codepen.io/amal84/pen/vYPNqbO)

held: fixed nav.nav | on scroll: a.: color+top ×5, nav.nav: background+shadow | on hover of a.: a.: color | made with: position: fixed · transition · :hover · scroll listener

```css
body { padding-bottom: 50px }
.nav { position: fixed; top: 0; transition: all 0.3s ease-in-out }
.nav .container { transition: all 0.3s ease-in-out }
.nav a { transition: all 0.3s ease-in-out }
.nav.active { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3) }
.hero { background-position: bottom-center; position: relative; margin-bottom: 20px }
.hero::before { position: absolute; top: 0 }
```

```js
addEventListener('scroll', fixNav)
```

### [Sticky Effect (css only)](https://codepen.io/HugoSalazar/pen/rNROvdB)

held: sticky ul.l-restaurant__content-items | made with: position: sticky · transition · :hover

```css
:root { --transition: all 600ms ease }
.l-restaurant__header .c-description .c-description__baseline { margin-bottom: 70px }
.l-restaurant__header .c-description .c-description__baseline .c-description__ba { position: relative }
.l-restaurant__header .c-description .c-description__baseline .c-description__ba { position: absolute }
.l-restaurant__header .c-description .c-description__baseline .c-description__ba { inset: -1px }
.l-restaurant__header .c-description .c-description__baseline .c-description__ba { inset: -12px }
.l-restaurant__header .c-description .c-description__baseline .c-description__ba { text-transform: uppercase }
.l-restaurant__content .l-restaurant__content-images figure { margin-bottom: 100px }
.l-restaurant__content .l-restaurant__content-images figure:last-child { margin-bottom: 0 }
.l-restaurant__content .l-restaurant__content-description { top: 100px }
.l-restaurant__content .l-restaurant__content-description .l-restaurant__content { margin-top: 60px; position: sticky; top: 60px }
.l-restaurant__content .l-restaurant__content-description .l-restaurant__content { position: relative }
```

### [Oh-stick!](https://codepen.io/sudo-self/pen/jOJbNdV)

held: sticky div | on scroll: div.pulse: transform+opacity+top ×3 | on hover of button.btn: div.pulse: transform+opacity+top ×3 | made with: position: sticky · @keyframes · :hover

```css
#heading { position: sticky; top: 0 }
.btn:active { box-shadow: inset 0 0 5px #000000 }
ul li a { box-shadow: 5px 5px 7px rgba(33, 33, 33, 0.7) }
ul li { position: relative }
ul li h2 { padding-bottom: 10px }
.delete { position: absolute; top: 0 }
ul li a { transform: rotate(-6deg); -moz-transform: rotate(-6deg) }
ul li:nth-child(even) a { transform: rotate(4deg); -moz-transform: rotate(4deg); position: relative; top: 5px }
ul li:nth-child(3n) a { transform: rotate(-3deg); -moz-transform: rotate(-3deg); position: relative; top: -5px }
ul li:nth-child(5n) a { transform: rotate(5deg); -moz-transform: rotate(5deg); position: relative; top: -10px }
ul li a:hover, ul li a:focus { box-shadow: 10px 10px 7px rgba(0, 0, 0, 0.7); -moz-box-shadow: 10px 10px 7px rgba(0, 0, 0, 0.7); transform: scale(1.25); -moz-transform: scale(1.25); position: relative }
body { margin-top: 1em }
```

### [Scroll Up Button (CSS Only)](https://codepen.io/ryomario/pen/qBvEEZm)

held: sticky a.scrollup | on scroll: a.scrollup: opacity+top | made with: position: sticky · transition · :has() · scroll listener · requestAnimationFrame

```css
a.scrollup { transition: opacity .5s,visibility .5s; position: sticky; position: -webkit-sticky; bottom: var(--margin) }
a.scrollup .scrollup-btn { box-shadow: 2px 2px 5px #0007; position: absolute; bottom: 0 }
html[data-scroll='0'] a.scrollup, body.hide-scrollup a.scrollup, a.scrollup.hide { opacity: 0 }
```

```js
requestAnimationFrame(() => {
addEventListener('scroll', debounce(storeScroll), { passive: true })
```

### [Sticky responsive bottom navigation bar with JS image swap](https://codepen.io/williamCromar/pen/jOJNvwW)

made with: nothing recognised — read the code

```css
.centerPage { position: absolute; top: 50%; transform: translate(-50%, -50%) }
#navbar { position: absolute; bottom: 10px; margin-bottom: calc(100%/7/2) }
#navitem #link1 { position: absolute }
#navitem #link2 { position: absolute }
#navitem #link3 { position:absolute }
#navitem #link4 { position:absolute }
#navitem #link5 { position:absolute }
#navitem #link6 { position:absolute }
#navitem #link7 { position:absolute }
```

### [Sticky navbar](https://codepen.io/rajveer01_pen/pen/vYPBKvj)

held: sticky div.nav | made with: position: sticky

```css
.nav { margin-top:50px; position: sticky; top:0 }
```

### [Sticky Search Bar](https://codepen.io/SpectacledCoder/pen/BaMXLgp)

held: fixed div.spectacledcoder-search-bar | made with: position: fixed · transition · :hover

```css
.spectacledcoder-search-bar { transition: width 1s; box-shadow: 5px 5px 20px #d8e6fd, -5px -5px 30px white; position: fixed; top: 102px }
.search-icon { margin-bottom: auto; margin-top: auto }
.spectacledcoder-search-input { transition: display 12s }
.nav { box-shadow: 5px 5px 20px #d8e6fd, -5px -5px 30px white; margin-bottom: 50px; margin-top: 250px }
.content { box-shadow: 5px 5px 20px #d8e6fd, -5px -5px 30px white; margin-bottom: 50px; margin-top: 50px }
```

### [Sticky header with blur](https://codepen.io/nikitahl/pen/VwgggZQ)

held: sticky header.sticky | made with: position: sticky · backdrop-filter

```css
.sticky { position: sticky; top: 0; -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(238, 238, 238, 0.3) }
```

### [CSS Gradient Header](https://codepen.io/chaseottofy/pen/ZEwqXYr)

held: fixed header.header, fixed div.underlay, fixed div.overlay-two, fixed div.header-underlay | made with: position: fixed · transition · :hover · mix-blend-mode

```css
body { position: relative }
.header { position: fixed; top: 0 }
.logo svg { filter: invert(0) }
.logo:hover { filter: invert(1); transition: all .2s ease-in-out }
h1 { transform: scaleY(.75) }
.wrapper { position: absolute; top: 0 }
.svg { position: absolute; top: 0; opacity: 0 }
.underlay { position: fixed; top: 0; filter: hue-rotate(285deg) contrast(2.3) brightness(.8) }
.underlay::after { position: fixed; opacity: 0 }
.overlay-two { position: fixed; top: 0; filter: invert(1); mix-blend-mode: lighten; opacity: .16 }
.overlay-two::after { position: fixed; top: 0; filter: url("#grainy2") }
.header-underlay { position: fixed; top: 0; mix-blend-mode: screen; opacity: 1 }
```

### [design . sticky search element](https://codepen.io/fpecher/pen/rNPYGdr)

held: fixed div.sticky-search | made with: position: fixed · transition · :hover

```css
.sticky-search { position: fixed; bottom: 50px; transition: 0.3s ease-in-out; transform: translateX(150%) }
.sticky-search:hover .sticky-search__icon { transform: scale(1.05) }
.sticky-search:hover .sticky-search__label { transform: translateX(-4px) }
.sticky-search__icon { transition: 0.2s ease-in-out }
.sticky-search__label { opacity: 0 }
.sticky-search--open .sticky-search__icon { position: relative }
.sticky-search--open .sticky-search__label { opacity: 1; transition: 0.3s ease-in-out }
.sticky-search--visible { transform: translateX(0) }
```

### [webpage company - drag the cat to have some fun!](https://codepen.io/giorgioGTelian/pen/OJdxozK)

held: fixed nav.navbar | made with: position: fixed · @keyframes · transition · :hover · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.banner { position: relative; padding-top: 90px; padding-bottom: 90px; margin-bottom: 40px }
.banner::before { position: absolute; top: 50%; translate: -50% -50%; rotate: -2deg }
.banner img { position: relative; animation: morph 3.5s linear infinite }
footer { padding-bottom: 20px }
section.top { padding-top: 30px; margin-bottom: 48px }
section.top ul li a { margin-bottom: 10px }
section.top h3 { text-transform: uppercase }
section.bottom { padding-top: 10px; border-top: 2px solid rgb(255 255 255 / 10%) }
.navbar { position: fixed; bottom: 0 }
.navbar { top: 0; bottom: auto }
.tabs { scale: 0.8 }
label { position: relative; opacity: 0.9; transition: 0.3s }
```

```js
addEventListener('mousemove', onMouseMove)
```

### [Reveal section with position sticky](https://codepen.io/Paolo-Duzioni/pen/qBgmwVG)

held: sticky footer | made with: position: sticky

```css
footer { position: sticky; bottom: 0 }
```

### [ScrollTo with StickyHeader](https://codepen.io/elalemanyo/pen/PoVWZEQ)

held: sticky div.sticky | on hover of button.relative: button.relative: background | made with: scroll() timeline

### [Sticky NavBar with On-Page Links](https://codepen.io/Tekovadawuld/pen/xxMRwBx)

held: sticky div.fixed | on hover of li.: a.: color | made with: position: sticky · transition · :hover

```css
* { scroll-padding-top: 90px }
body { position: relative }
.fixed { position: -webkit-sticky; position: sticky; top: 0 }
header { border-bottom: 2px solid #758e85; box-shadow: 0 0 20px #475853 }
header a:hover { transition: all 0.3s ease 0s }
main { padding-top: 20px }
p { padding-top: 20px; padding-bottom: 10px }
```

### [Sticky Notes](https://codepen.io/gibsonmurray/pen/gOqMmvE)

made with: 3D (perspective / preserve-3d) · GSAP

```css
#board { position: relative; perspective: 1600px }
.stickynote { position: absolute; transform: rotateX(5deg); box-shadow: -1px 10px 5px -4px rgba(0, 0, 0, 0.012), inset 0 24px 30px -12px rgba(0, 0, 0, 0.3) }
.stickynote-text::placeholder { opacity: 30% }
#trash { position: absolute; bottom: 50px; box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3) }
#reset { position: absolute; opacity: 0; bottom: 14px }
```

```js
gsap.to(this.target, {
gsap.timeline()
addEventListener("mouseenter", () => {
gsap.to("#trash > svg", {
gsap.to("#reset", {
addEventListener("mouseleave", () => {
```

### [Table sticky header](https://codepen.io/anfir/pen/ExrVBVy)

held: sticky tr | made with: position: sticky

```css
table { position: relative }
thead tr { position: sticky; top: 0; box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.15) }
```

### [25 Sticky Navbar](https://codepen.io/nietoperq/pen/poGJvbp)

held: fixed nav.nav | on scroll: a.: color+top ×4, nav.nav: background+shadow, i.fa-solid: color+top, a.current: color+top | on hover of a.: a.: color, i.fa-solid: color | made with: position: fixed · transition · :hover · backdrop-filter · scroll listener

```css
:root { --main-transition: all 0.3s ease-in-out }
body { padding-bottom: 50px }
.nav { position: fixed; top: 0; transition: var(--main-transition); text-transform: uppercase }
.nav .container { transition: var(--main-transition) }
.nav a { position: relative; transition: var(--main-transition) }
.nav a.current::before { position: absolute; bottom: -3px; transform: translateX(-50%); transition: var(--main-transition) }
.nav.active { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3) }
.nav.active a.current::before { opacity: 0 }
.hero { background-position: center center; text-transform: uppercase; position: relative; margin-bottom: 20px }
.hero::before { position: absolute; top: 0; backdrop-filter: hue-rotate(290deg) saturate(50%) contrast(90%) }
.content h2 { text-transform: uppercase }
.content p { margin-bottom: 10px }
```

```js
addEventListener("scroll", fixNav)
```

### [Sticky Note Scrum Board - Single Div CSS Art (Divtober 2023 : Day 19 : Sticky)](https://codepen.io/robleto/pen/jOXjRyg)

made with: nothing recognised — read the code

```css
div, div:before, div:after { position: absolute }
div.sticky { top: 15vmin; position: relative; position: relative }
div.sticky:after { transform: rotate(8deg) }
```

### [WAAPI Pinned Horizontal Section](https://codepen.io/JMChristensen/pen/abPxXzP)

held: sticky div.horizontal-pin__sticky | made with: position: sticky · scroll() timeline · Web Animations API (.animate)

```css
.horizontal-pin__sticky { position: sticky; top: 0 }
```

```js
.animate({
```

### [Grid with sticky cells](https://codepen.io/edmeehan/pen/NWeEaXQ)

held: sticky aside, sticky section | made with: position: sticky

```css
.wrapper { border-bottom: solid 1px #eee }
section { position: sticky; top: 0 }
aside { position: sticky }
aside .block { padding-bottom: 160% }
main { border-bottom: dashed 1px #ccc }
footer { border-top: dashed 1px #ccc }
```

### [CSS position property - interactive demo](https://codepen.io/nico_sh/pen/XWoymYx)

made with: transition

```css
#highlight { position: static }
#c1 { margin-bottom: 8px }
#highlight { transition: all .3s ease-in-out }
#highlight > div { margin-bottom: 12px }
```

### [GSAP Sticky to mouse pointer menu hover effect](https://codepen.io/phillip-gimmi/pen/OJroWOj)

on scroll: div.circle: transform+top, div.text: transform+top | made with: GSAP

```css
.menu { position: relative }
.circle { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.text { position: absolute; top: 50%; transform: translate(-50%, -50%); text-transform: uppercase }
```

```js
gsap.to(circle, {
gsap.to(text, {
```

### [Responsive Header](https://codepen.io/rahul-patel-dev/pen/yLGKGgb)

made with: position: fixed · transition · :hover

```css
nav { position: fixed; top: 0 }
.main-header { filter: invert(1) brightness(4) !important }
.main-header { position: fixed; top: 0; transition: all 0.3s ease-out }
.main-header .navbar .rahul-wrapper h1 a img { position: relative }
.main-header .navbar .rahul-wrapper .burger { opacity: 0 }
.main-header .navbar .rahul-wrapper .burger { position: relative; opacity: 1 }
.main-header .navbar .rahul-wrapper .burger .burger-line { transform: rotate(0); transition: all 0.3s ease-in-out }
.main-header .navbar .rahul-wrapper .overlay { position: fixed; top: 0; opacity: 0 }
.main-header .navbar .rahul-wrapper .overlay.is-active { opacity: 1; transition: all 0.35s ease-in-out }
.main-header .navbar .rahul-wrapper .overlay.is-active { opacity: 0 }
.main-header .navbar .rahul-wrapper .menu { position: fixed; top: 0; opacity: 0; transition: all 0.5s ease }
.main-header .navbar .rahul-wrapper .menu.is-active { opacity: 1 }
```

### [CodePen Challenge: Sticky Navigation - Active Navbar Items (CSS)](https://codepen.io/Azametzin/pen/NWeYGpZ)

held: fixed nav, sticky div.section, sticky div.section, sticky div.section, sticky div.section, sticky div.section, sticky div.section, sticky div.section | made with: position: sticky · position: fixed

```css
nav { position: fixed; top: 20px }
.nav-item:before { position: absolute; top: 0; opacity: 0.44 }
.content { position: relative }
.section { position: sticky; top: 56px }
.nav-mark { position: absolute; transform: translate(0, -80px) }
.nav-mark:before { top: 0; position: absolute }
.section-end span { transform: scale(0.92) }
```

### [Sticky NavBar With Hamburger Icon](https://codepen.io/01000011-01001010-01000011/pen/QWzQVxO)

held: fixed nav | made with: position: fixed · @keyframes · :hover

```css
nav { position: fixed; top: 0 }
.nav-button { top: 0 }
.fa { transform: scale(2.5) }
.nav-menu { opacity: 0 }
.show-nav-menu { animation-name: showMenu; animation-duration: 2s; animation-timinig-function: ease-in; animation-fill-mode: forwards }
.hide-nav-menu { animation-name: hideMenu; animation-duration: 1s; animation-timinig-function: ease-in; animation-fill-mode: forwards }
#portfolio, #press, #shop, #about { background-position: center }
0% { opacity: 0 }
100% { opacity: 1 }
0% { opacity: 1 }
100% { opacity: 0 }
@keyframes showMenu animates height, opacity
```

### [Sticky NavBar With Transition](https://codepen.io/01000011-01001010-01000011/pen/mdaXWYR)

held: fixed nav | on hover of a.: a.: opacity ×3, nav.: background, a.: opacity+background | made with: position: fixed · transition · :hover

```css
nav { position: fixed; top: 0; transition: background-color 0.75s ease-in-out }
nav a { opacity: 0.25; transition: opacity 1s ease-in-out }
nav:hover a { opacity: 1 }
#portfolio, #press, #shop, #about { background-position: center }
```

### [vertical sticky navigation - challenge (Chrome +118 | Firefox +64)](https://codepen.io/EaterUsr/pen/yLGPzPY)

held: sticky nav | on hover of a.: a.: color | made with: position: sticky · transition · :hover · :has() · IntersectionObserver

```css
.wrapper { position: relative }
nav { margin-top: 12rem; top: 1rem; position: sticky }
.link-container::before { top: 0 }
.link-container { transition: grid-template-columns var(--transition-duration); padding-bottom: 0.3rem }
.link-container a { transition: visibility var(--transition-duration), color .2s ease-out }
```

```js
new IntersectionObserver(entries => {
```

### [Apple Landing page with Sticky Header](https://codepen.io/DevBillyM/pen/OJrOXBb)

made with: position: fixed · transition · scroll listener

```css
#stickyHeader { position: relative; top: 0; transition: background-color 0.3s ease-in-out }
.scrolled { position: fixed !important; top: 0; transition: all 0.3s ease-in-out }
.showcaseHero { margin-top: 150px }
h1 { margin-bottom: 32px }
.cta-button { margin-bottom: 24px }
.primary-text { margin-top: 10px }
.secondary-text { margin-top: 5px }
.product-card { box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) }
.scrolled { position: fixed; top: 0; transition: all 0.3s ease-in-out }
```

```js
addEventListener("scroll", function () {
```

### [Sticky nav](https://codepen.io/antoine-favereau/pen/bGOYbBy)

held: fixed div.navBar | on hover of a.: a.: background | made with: position: fixed · transition · :hover · backdrop-filter

```css
.navBar { position: fixed; top: 1rem; transform: translateX(-50%); backdrop-filter: blur(10px); box-shadow: 0px 0px 20px #0003 }
.navBar a { transition: all 0.2s; position: relative }
.section { position: relative }
```

### [Customizable Sticky Note](https://codepen.io/nicolettamerlo/pen/poqWbmx)

on hover of button.btn: button.btn: transform+color+top | made with: @keyframes · :hover

```css
.container { position: relative }
.note { box-shadow: 1px 1px 10px var(--darkGray) }
.note-footer { border-top: 1px solid var(--lightGray) }
.modal { position: absolute; bottom: 0; transform: translateX(-50%); animation: fadeIn 0.8s }
.modal-color-header { position: relative }
.swatch:hover { transform: scale(1.1) }
.selected { transform: scale(1.1) }
.btn:hover { transform: scale(1.2) }
0% { opacity: 0 }
100% { opacity: 1 }
@keyframes fadeIn animates opacity
```

### [固定ヘッダー分考慮してサイドバー固定する](https://codepen.io/hrshishym/pen/eYbBbQP)

held: sticky header.header, sticky div.image | made with: position: sticky

```css
.header { position: sticky; top: 0 }
.image { position: sticky; top: 60px }
img { vertical-align: bottom }
```

### [Nav Website](https://codepen.io/Tenoste/pen/zYyxExm)

made with: :hover

```css
nav { position: static; box-shadow: -5px 5px #444544; margin-bottom: 3vw }
section { margin-bottom: 3vw }
.q1:hover { box-shadow: 1px 0px grey }
#sq1:hover { box-shadow: 2px 2px grey }
aside { box-shadow: inset 5px 0 5px -5px #29627e }
```

### [Magnetic Dom Element](https://codepen.io/Qualley/pen/YzdzaOj)

on scroll: div.: transform+top ×2, div.item: transform | made with: transition · clip-path · mix-blend-mode · pointer / mouse tracking

```css
.wrapper #cursor { position: absolute; mix-blend-mode: overlay }
.wrapper .item #icon { transform: rotate(0); transition: all 0.1s ease-in-out }
.wrapper .item svg { transform: scale(1.75) }
```

```js
addEventListener("mousemove", moveCursor)
addEventListener("mousemove", (e) => {
```

### [Lenis Scroll with GSAP ScrollTrigger Pinning](https://codepen.io/ilimitadostudio/pen/qBQyeeN)

held: fixed section.grid-container | on scroll: section.grid-container: transform+opacity+top, section.grid-container: opacity+top | made with: GSAP · ScrollTrigger · Lenis / smooth scroll

```css
.section { padding-top: 120px; padding-bottom: 120px }
.section.four { position: relative }
.section.four .grid-container .grid-x { position: relative }
.section.four .grid-container .grid-x .imgs { top: 0; position: absolute }
.section.four .grid-container .grid-x .imgs img { object-position: center }
```

```js
gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.create({
gsap.to(section, {
gsap.timeline({
scrollTrigger: { trigger: '.section.four', start: 'top bottom', end: 'top top' }
scrollTrigger: { trigger: '.section.four .imgs', start: "top 120px", end: end + 'px', pin: true }
gsap.fromTo('.section.four .imgs img', {
```

### [ScrollTrigger Sticky Titles](https://codepen.io/GreenSock/pen/XWyqvLj)

held: fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start, fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start, fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start, fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start | made with: GSAP · ScrollTrigger

```js
gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.create({
```

### [Calendar Grid (FIXED)](https://codepen.io/qorinn/pen/bGQovNZ)

held: fixed div.changeDate, sticky div.grid-item, sticky div.grid-item, sticky div.grid-item, sticky div.grid-item, sticky div.grid-item, sticky div.grid-item, sticky div.grid-item, sticky div.grid-item, sticky div.grid-item | made with: position: sticky · position: fixed

```css
section#calendarSection { position: relative }
section#calendarSection .calendar-header { position: sticky; top: 25px; border-bottom: 1px solid black }
section#calendarSection .start { position: sticky; top: 25px }
.changeDate { position: fixed; top: 0 }
```

### [rounded page wrapper with clipped sticky header](https://codepen.io/glmvc/pen/mdQBVpV)

held: sticky header | made with: position: sticky · backdrop-filter

```css
header { position: sticky; top: 0; -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px) }
h1 { padding-top: 0.8em }
p:not(:last-of-type), ul { margin-bottom: 1em }
```

### [Position: sticky](https://codepen.io/Lynxdev/pen/OJaxJEL)

held: sticky div.sticky-box | made with: position: sticky

```css
body { text-transform: capitalize }
.sticky-box { position: sticky; top: 0 }
.values { margin-top: 0; text-transform: lowercase }
```

### [grid sticker](https://codepen.io/gc-nomade/pen/zYMdwKG)

made with: nothing recognised — read the code

### [Fork :: Position "sticky" w/ CSS Grid](https://codepen.io/Ondreas/pen/YzRNJZg)

held: sticky h2.section__headline, sticky h2.section__headline | made with: position: sticky

```css
.section__headline { position: sticky; top: 0 }
```

### [Draggable Stick Gooey Circles ( Linear Interpolation )](https://codepen.io/noirsociety/pen/ExOKXxN)

held: fixed div.circle, fixed div.circle, fixed div.circle, fixed div.circle, fixed div.circle, fixed div.circle | made with: position: fixed · pointer / mouse tracking · requestAnimationFrame

```css
.container { position: relative; filter: blur(10px) contrast(60) }
.circle { position: fixed }
.circle:nth-of-type(1) { top: 10% }
.circle:nth-of-type(2) { top: 5% }
.circle:nth-of-type(3) { top: 50% }
.circle:nth-of-type(4) { top: 40% }
.circle:nth-of-type(5) { bottom: 30% }
.circle:nth-of-type(6) { bottom: 20% }
```

```js
requestAnimationFrame(update)
addEventListener('pointermove',move,false)
```

### [Animated Sticky Bottom Notification Bar Plugin - jQuery Hat Tip](https://codepen.io/a7rarpress/pen/VwVveZL)

held: fixed div.ht-danger | made with: :hover

### [position sticky base case](https://codepen.io/serene-ding/pen/WNYbKmz)

held: sticky div.inner | made with: position: sticky

```css
html { margin-top:500px }
.inner { position:sticky; top:20px }
```

### [Firefox: backdrop-filter bug with position sticky, border-radius and overflow](https://codepen.io/glmvc/pen/bGQNqPP)

held: sticky header | made with: position: sticky · backdrop-filter

```css
.wrapper { box-shadow: 0 0 10px #c60184 }
header { position: sticky; top: 0; -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px) }
h1 { padding-top: 0.8em }
```

### [Sticky](https://codepen.io/endritibra-the-flexboxer/pen/MWzYjdy)

made with: position: sticky

```css
.sticky { position:sticky; top:0 }
```

### [Sticky Social Bar with CSS3 Animations](https://codepen.io/a7rarpress/pen/zYMYaML)

held: fixed div.sticky-container | made with: position: fixed · transition · :hover

```css
.sticky-container { position: fixed; top:130px }
.sticky li { -webkit-transition:all 0.25s ease-in-out; -moz-transition:all 0.25s ease-in-out; -o-transition:all 0.25s ease-in-out; transition:all 0.25s ease-in-out; filter: url("data:image/svg+xml; filter: gray; -webkit-filter: grays }
.sticky li:hover { filter: url("data:image/svg+xml; -webkit-filter: grayscale(0%) }
.sticky li p { text-transform: uppercase }
.content { margin-top: 150px }
```

### [Position-Sticky and flexbox](https://codepen.io/serene-ding/pen/WNYeVYb)

held: sticky nav.box | made with: position: sticky

### [a Sticky Ad at the Bottom of the Blogger](https://codepen.io/a7rarpress/pen/XWxvoLE)

held: fixed div.stickywrap | made with: position: fixed

### [simple sticky navbar](https://codepen.io/meriemchm/pen/VwEORYM)

held: sticky div.nav | made with: position: sticky

```css
.nav { box-shadow: 5px 7px 30px -5px rgba(0, 0, 0, 0.75); position: -webkit-sticky; position: sticky; top: 0 }
```

### [Sticky Menu in bootsrap](https://codepen.io/ImXavi/pen/ZEqZprm)

made with: position: sticky

```css
body { padding-top: 70px }
.navbar.fixed-top { position: sticky; top: 0 }
```

### [CSS Sticky effect (Lava Lamp)](https://codepen.io/camillebaronnet-the-reactor/pen/eYPPOjP)

made with: @keyframes · :hover · mix-blend-mode · pointer / mouse tracking

```css
.canvas { top: 10px; bottom: 10px; position: absolute; mix-blend-mode: screen }
.blur { filter:blur(40px) }
.filter { position: absolute; top: 0; bottom: 0 }
.filter-dodge { mix-blend-mode: color-dodge }
.filter-burn { mix-blend-mode: color-burn }
.circle { position: absolute; margin-bottom: 10px }
.circle-center { top:50%; transform: translateX(-50%) translateY(-50%) }
body:not(:hover) .circle-followed { animation: move 3s cubic-bezier(0, 0.37, 1, 0.66) infinite; animation-direction: alternate-reverse }
0% { top:-10% }
100% { top:80% }
@keyframes move animates top, left
```

```js
addEventListener('mousemove', (event) => {
```

### [CSS only Tabs](https://codepen.io/barry199002/pen/BaqPRdw)

held: sticky aside, fixed button.bp-theme | made with: position: sticky · position: fixed · @keyframes · transition · :hover · custom properties driven by JS · scroll listener · requestAnimationFrame

```css
:root { --transition: 0.25s all cubic-bezier(0.8, 0, 0.2, 1); --box-shadow-opacity: 0.24; --box-shadow: 0.125rem 0.125rem 0.625rem var(--box-shadow-color), var(--box-shadow-bisque) }
html { position: relative }
html body { position: inherit }
html body main > article section { margin-bottom: 2rem }
html form input[type=text], html form textarea { position: relative; box-shadow: var(--input-boxshadow); transition: var(--transition) }
html form input[type=text]:focus, html form textarea:focus { box-shadow: var(--input-boxshadow-focus) }
html img { box-shadow: var(--box-shadow) }
html code { margin-bottom: 1rem }
html h1, html h2, html h3, html h4, html h5, html h6 { margin-bottom: 0.5rem }
html p { margin-bottom: 1rem }
html body main > aside { position: sticky; top: 1rem }
.bp-panel { position: relative; box-shadow: 0.01875rem 0.03125rem 0.04375rem rgba(0, 0, 0, 0.08), 0.05rem 0.1rem 0.125rem -0.05rem rgba(0, 0, 0, 0.08), 0.13125rem 0.25625rem 0.325rem -0.10625rem rgba(0, 0, 0, 0.08), 0.3125rem 0.625r }
```

```js
addEventListener("scroll", event => {
requestAnimationFrame(fadeAnimations)
requestAnimationFrame(fadeAnimations, callBack)
requestAnimationFrame(slideAnimations)
style.setProperty("--bg", `var(--${theme}-bg)`)
style.setProperty( "--border",
style.setProperty( "--surface",
style.setProperty( "--text-primary",
```

### [Sticky Nav + Main + Footer](https://codepen.io/flipeador/pen/RweyvEM)

held: sticky nav, sticky h3, sticky h3, sticky h3, sticky h3, sticky footer | made with: position: sticky

```css
nav { position: sticky; top: 0 }
section h3 { position: sticky }
footer { position: sticky; bottom: 0 }
```

### [Sticky Background Effect](https://codepen.io/crazy-killer/pen/QWZOZvE)

held: sticky div.header, sticky div.frame, sticky div.frame, sticky div.frame, sticky div.frame | made with: position: sticky

```css
.main_frame { margin-bottom: -10px; box-shadow: 10px 10px 50px black }
.header { margin-top: 10px; position: sticky; top: 10px; box-shadow: 10px 10px 50px black }
#frame_1 { margin-top: 0px; position: sticky; top: 10px }
#frame_2 { margin-top: 0px; position: sticky; top: 10px }
#frame_3 { margin-top: 0px; position: sticky; top: 10px }
#frame_4 { margin-top: 0px; position: sticky; top: 10px }
```

### [Pure CSS Sticky Social Media Buttons - Using HTML & CSS](https://codepen.io/a7rarpress/pen/xxyEoQo)

held: fixed div.social | made with: position: fixed · transition · :hover

```css
.social { position: fixed; transform: translate(-290px, 0) }
.social a { transition: 1s; transition-property: transform }
.social a:hover { transform: translate(140px, 0) }
```

### [2カラムの固定サイドバーでフッター上で解除](https://codepen.io/hrshishym/pen/poxyBgM)

held: sticky div.aside | made with: position: sticky

```css
.aside { position: sticky; top: 0 }
.footer { margin-top: 2rem }
```

### [2カラムの固定サイドバーでフッター上で解除](https://codepen.io/asuka-inoue/pen/ZEqWyOw)

held: sticky aside.sidebar | made with: position: sticky

```css
section { margin-bottom:20px }
.sidebar { position: sticky; position: -webkit-sticky; top: 0; margin-bottom:20px }
```

### [Sticky Header Background Animation](https://codepen.io/francoiscoron/pen/yLRNZvZ)

held: fixed header.header | on scroll: li.: color ×4, a.: color ×4, header.header: color, div.header__inner: color, nav.nav: color, ul.: color | made with: position: fixed · transition · :hover · backdrop-filter · mix-blend-mode · custom properties driven by JS · scroll listener

```css
body { padding-top: var(--_header-h, 4rem) }
.header { position: fixed; inset: 0 0 auto 0; transition: color 0.3s }
.header::before { position: absolute; inset: 0; -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px); transform: scaleY(0); transition: transform 0.3s linear; will-change: transform }
.header.is-sticky::before { transform: scaleY(1) }
.header__inner { position: relative }
.hero { position: relative }
.hero::before { position: absolute; inset: 0 }
.hero__caption { position: relative }
.hero__caption > p { text-transform: uppercase }
.logo { mix-blend-mode: difference }
```

```js
style.setProperty("--_header-h", `${header.offsetHeight}px`)
addEventListener("scroll", function () {
```

### [Active Link Sticky Navigation](https://codepen.io/memo1991/pen/PoywEGN)

held: fixed header | made with: position: fixed · transition · :hover

```css
header { position: fixed; top: 0px }
nav a { transition: .4s }
```

### [add sticky floating bottom ads sticky اداة لاضافة الاعلانات او التنبيهات اسفل المدونة](https://codepen.io/a7rarpress/pen/KKGKpJd)

held: fixed div.Arpian-ads | made with: position: fixed · transition

```css
.Arpian-ads { position: fixed; bottom: 15px; box-shadow: 0 -6px 18px 0 rgba(9,32,76,.1); -webkit-transition: all .1s ease-in; transition: all .1s ease-in }
.Arpian-ads-close { position: absolute; top: -30px; box-shadow: 0 -6px 18px 0 rgba(9,32,76,.08) }
.Arpian-ads .Arpian-ads-content { position: relative }
```

### [Untitled](https://codepen.io/scottglshields/pen/NWLJgYV)

held: sticky div.bottom, sticky div.bottom, sticky div.bottom, sticky div.bottom | on scroll: div.card: shadow+top | made with: position: sticky · transition · :hover

```css
.card { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.09); transition: box-shadow 0.3s ease }
.card:not(.full-bleed):hover { box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.4), 0 4px 12px -2px rgba(0, 0, 0, 0.2) }
.card-image { background-position: 50% 50%; filter: brightness(0.75); transition: filter 0.75s ease 0.2s }
.foot { transition: 2s ease }
.card:hover .card-image { filter: brightness(1.1) }
.bottom { position: sticky; top: 100%; margin-top: 2rem }
.end { transition: background 0.3s ease, color 0.3s ease 0.1s }
h3 { margin-bottom: 0.25rem }
p { margin-top: 1.25rem }
p:first-of-type { margin-top: 0 }
```

### [Sticky Header Grow on Scroll](https://codepen.io/francoiscoron/pen/PodxedK)

held: sticky header.header | made with: position: sticky · transition · :hover · scroll listener

```css
.header { position: sticky; top: 4rem; transition: all 0.3s ease-in-out }
.header.is-sticky { top: 0 }
```

```js
addEventListener("scroll", function () {
```

### [Holy Grail Laout (Sticky Header and Footer with Responsive Content)](https://codepen.io/quirico/pen/NWLExbw)

made with: nothing recognised — read the code

### [Example of how to use "position:sticky;" in CSS -- Sticky Header 2](https://codepen.io/steinbring/pen/eYLPLpQ)

held: sticky header | made with: position: sticky

```css
header { position: sticky; top: 0 }
```

### [Example of how to use "position:sticky;" in CSS -- Sticky Header](https://codepen.io/steinbring/pen/PodyBrb)

held: sticky header | made with: position: sticky

```css
header { position: sticky; top: 0 }
```

### [Flexbox with position sticky](https://codepen.io/massimo-cassandro/pen/OJoZewE)

held: sticky div.sticky | made with: position: sticky

```css
.sticky-container { position: relative }
.sticky { position: sticky; top: 0 }
```

### [Responsive Sticky Navigation Bar using HTML CSS & JavaScript](https://codepen.io/a7rarpress/pen/oNPpGme)

held: fixed nav.navbar | on scroll: nav.navbar: background+shadow | made with: position: fixed · transition · :hover

```css
.navbar { position: fixed; transition: all 0.3s ease }
.navbar.sticky { box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.1) }
.menu-list li a { transition: all 0.3s ease }
.banner { background-position: center }
.about p { padding-top: 20px }
.menu-list .cancel-btn { position: absolute; top: 20px }
.navbar .menu-list { position: fixed; top: 0px; transition: all 0.3s ease }
.navbar .menu-list li { margin-top: 45px }
.navbar .menu-list li a { transition: 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) }
```

### [Sticky notes with menu reveal](https://codepen.io/scohal/pen/KKxZvrR)

made with: transition · :hover

```css
.sticky-note { position: relative; box-shadow: 0 6px 4px -4px rgba(0,0,0,0.7); transition: all 0.15s linear }
.sticky-note > .menu { position: absolute; top: 0px; transition: all 0.15s linear }
.sticky-note > .content { position: relative }
.sticky-note button:hover { filter: brightness(90%) }
.sticky-note:nth-child(4n + 1) { transform: rotate(-1deg) }
.sticky-note:nth-child(4n + 2) { transform: rotate(3deg) }
.sticky-note:nth-child(4n + 3) { transform: rotate(1deg) }
.sticky-note:nth-child(4n + 4) { transform: rotate(-3deg) }
.sticky-note:nth-child(n):hover { transform: scale(110%) }
.sticky-note:nth-child(n):hover .menu { transform: translateY(-98%) }
```

### [Technical Documentation Page (Test)](https://codepen.io/pedroalves-dv/pen/RwYLNpp)

held: fixed div.header-bgd, fixed nav.nav-desktop | made with: position: fixed

```css
.header-bgd { position: fixed; top: 0 }
#navbar { position: fixed; top: 0px; padding-top: 10px }
[id] { scroll-margin-top: 10px }
#navbar li { border-top: 1px solid; position: relative }
.first-scroll { padding-top: 15px }
#main-doc { position: absolute; margin-bottom: 110px }
code { position: relative }
[id] { scroll-margin-top: 120px }
#main-doc { position: relative; padding-top: 120px }
nav select { position: fixed }
```

### [A sticky footer with CSS Grid 🔥](https://codepen.io/darryncodes/pen/qBMrZBL)

made with: nothing recognised — read the code

```css
h1, footer { text-transform: uppercase }
```

### [sticker footer](https://codepen.io/wjozey/pen/ZEMWQEm)

made with: nothing recognised — read the code

### [react resizable sidebar](https://codepen.io/Okamiden/pen/gOdbPPZ)

made with: position: sticky · transition · :hover · pointer / mouse tracking

```css
.main > .mainContent { box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15) }
.main > aside { box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15) }
.asideComp > nav { box-shadow: 0 0 0 1px #DDD }
.asideComp > nav > button { filter: grayscale(1); transition: 0.5s; opacity: 0.6 }
.asideComp > nav > button:hover { transition: 0s; opacity: 1 }
.asideComp > nav > button.active { filter: none; transition: 50ms; opacity: 0.8 }
.asideComp > .asideContent > section { margin-bottom: 2em }
.asideComp > .asideContent > section:last-child:not(:first-child) { margin-bottom: 100% }
.asideComp > .asideContent > section > header { position: sticky; top: -1px; padding-top: 0.5em; margin-top: -0.5em; padding-bottom: 0.5em; text-transform: capitalize; transition: 0.1s }
```

```js
addEventListener('mousemove', onDragMove)
```

### [Sticky Position Example -1](https://codepen.io/Sunil_Pradhan/pen/gOjVjRq)

held: sticky div.sidebar | made with: position: sticky

```css
.sidebar { position: sticky; top: 0 }
```

### [コンテンツが少ないページのフッター下の余白を無くす方法（stickyでbottom固定 もしくは flex-growで余った余白を引き伸ばす）](https://codepen.io/tera-ono/pen/xxJvWaW)

made with: position: sticky

```css
body { position: relative }
.p-footer { position: sticky; top: 100vh }
```

### [Sticky Sidebar](https://codepen.io/noirsociety/pen/abjRxKa)

held: sticky aside.sidebar | made with: nothing recognised — read the code

```css
.article-content, .sidebar-content { text-transform: uppercase; box-shadow: 0 0 6px rgba(0,0,0,0.2) }
```

### [tailwind sticky test](https://codepen.io/Omrega/pen/JjBZNZO)

held: sticky header.sticky | made with: nothing recognised — read the code

```css
p { margin-bottom: 1em }
```

### [sticky along sections](https://codepen.io/nicolas-jeanne/pen/MWBVEPv)

held: sticky div.sticky-element | made with: position: sticky

```css
main { position: relative }
main .sticky-element { position: sticky; top: 0; box-shadow: rgba(150, 150, 151, 0.5) 0px 7px 29px 0px }
main .sticky-element { position: relative }
main section { background-position: center }
```

### [animate headers on scroll](https://codepen.io/mundisyum/pen/QWBORGM)

held: fixed div.toolbar, sticky h2, sticky h2, sticky h2, sticky h2 | on scroll: h2.: background+color+top ×2, span.: transform+color+top ×2 | made with: position: sticky · position: fixed · transition · scroll listener

```css
body { position: relative }
.top-header { padding-top: var(--toolbar-height) }
.toolbar { position: fixed; top: 0 }
.top-image-wrapper { margin-bottom: 1.25rem }
article h2 { position: sticky; top: var(--toolbar-height) }
article h2 span { transition: transform .15s }
article.active h2 span { transform: scale(.96) }
```

```js
addEventListener('scroll', markActiveArticles, {passive: true})
```

### [CSS: position: sticky](https://codepen.io/mikelothar/pen/QWBvJRM)

held: sticky h2.sticky-div, sticky h2.sticky-div, sticky h2.sticky-div | made with: position: sticky

```css
.sticky-div { position: sticky; top: 50px }
```

### [Sticky Navigation menu (HTML & CSS)](https://codepen.io/wjozey/pen/bGjwBZo)

held: sticky nav | on hover of li.: a.: background | made with: position: sticky · :hover

```css
nav { position: sticky; top: 0 }
```

### [position: sticky 固定ヘッダー](https://codepen.io/tera-ono/pen/YzjqMWd)

made with: position: sticky

```css
.sticky-1 { margin-bottom: 10rem }
.sticky-1 .title { top: 0px; position: sticky }
```

### [Sticky split image](https://codepen.io/franklyg/pen/WNKrVqX)

held: sticky div.column, sticky div.column, sticky div.column, sticky div.column, sticky div.column, sticky div.column, sticky div.column, sticky div.column | made with: position: sticky

```css
section .column { position: sticky; top: 0 }
section .column img { object-position: center; position: absolute; top: 0 }
```

### [Section Sticky and Scroll to section content change](https://codepen.io/sumanengbd/pen/WNKrqQW)

held: sticky header.header, sticky aside.stickysection__sidebar, sticky div.d-flex | on scroll: a.anchor-link: color+top ×2 | made with: position: sticky · scroll() timeline · transition

```css
.header { top: 0; position: sticky; box-shadow: 0 0 24px rgba(0, 0, 0, 0.16) }
.stickysection__sidebar { top: 0; position: sticky }
.stickysection__sidebar ul li { margin-bottom: 15px }
.stickysection__sidebar ul li a { transition: all 0.3s ease }
.stickysection__content { margin-bottom: 100vh }
.stickysection__item { opacity: 0 }
.stickysection__item .media { margin-bottom: 10px }
#stickysection__contentappend { top: 0; position: sticky; margin-bottom: -100vh }
#stickysection__contentappend .stickysection__item { opacity: 1 }
```

### [Sticky Notes](https://codepen.io/rahulbaran/pen/qBydPjj)

held: sticky main.container, sticky section.container, sticky section.container, sticky section.container, fixed button.btn | made with: position: sticky · position: fixed · :hover · :has() · prefers-reduced-motion

```css
.container { --top: 0; position: sticky; top: var(--top); padding-top: calc(0.5em * 2); padding-bottom: calc(0.5em * 2); padding-top: calc(var(--base-padding) * 2); padding-bottom: calc(var(--base-padding) * 2) }
.container[\:has\(.first-note\)] > * { rotate: z -1.5deg }
.container:has(.first-note) > * { rotate: z -1.5deg }
.container[\:has\(.second-note\)] { --top: 4em }
.container:has(.second-note) { --top: 4em }
.container[\:has\(.second-note\)] > :only-child { rotate: z 1.5deg }
.container:has(.second-note) > :only-child { rotate: z 1.5deg }
.container[\:has\(.third-note\)] { --top: 8em }
.container:has(.third-note) { --top: 8em }
.container[\:has\(.third-note\)] > :first-child { rotate: z -4deg }
.container:has(.third-note) > :first-child { rotate: z -4deg }
.container[\:has\(.fourth-note\)] { --top: 12em }
```

### [wip SVG filter Animation + sticky](https://codepen.io/clausgehrke/pen/QWBwEpg)

held: sticky h2.sticky, sticky h2.sticky, sticky h2.sticky | on scroll: h2.sticky: transform+filter+top ×2, h2.sticky: filter+top | made with: position: sticky · @keyframes · transition · custom properties driven by JS · scroll listener

```css
.grid-sub { position: relative }
.chapter .sticky { transform: translateX(calc(100% - var(--posY))); position: sticky; text-transform: uppercase; top: 50vh; transition: transform 0.25s; filter: url("#squiggly-0"); -webkit-animation: squiggly-anim 0.34s linear infinite; an }
0% { filter: url("#squiggly-0") }
25% { filter: url("#squiggly-1") }
50% { filter: url("#squiggly-2") }
75% { filter: url("#squiggly-3") }
100% { filter: url("#squiggly-4") }
0% { filter: url("#squiggly-0") }
25% { filter: url("#squiggly-1") }
50% { filter: url("#squiggly-2") }
75% { filter: url("#squiggly-3") }
100% { filter: url("#squiggly-4") }
```

```js
addEventListener("scroll", this.throttledScrollListener)
style.setProperty("--posY", percentageVisible + "%")
style.setProperty("--opacity", 1)
style.setProperty("--opacity", 0)
```

### [position: sticky; Stacking elements within a specific area Vanilla JS](https://codepen.io/web_walking_nak/pen/rNrNeNj)

held: sticky p.c-lead__sticky, sticky p.c-lead__sticky, sticky p.c-lead__sticky | made with: position: sticky

```css
.js-stacking__item { position: sticky; top: 4em }
h1 { margin-bottom: 250px }
.c-lead { margin-bottom: 50vh }
```

### [Stacking elements within a specific area Vanilla JS](https://codepen.io/web_walking_nak/pen/poZoyog)

made with: position: fixed · IntersectionObserver · scroll listener

```css
.js-fixed-text__item-area { position: relative }
.js-fixed-text__item { position: absolute; top: 0 }
.js-fixed-text__item.is-fixed { position: fixed }
.js-fixed-text__hidden { opacity: 0 }
h1 { margin-bottom: 250px }
.c-lead__item:first-child .js-fixed-text__item:before { padding-top: 50px }
```

```js
new IntersectionObserver(entries => {
addEventListener('scroll', listener, {passive: true})
```

### [Fixed within a designated area Vanilla JS](https://codepen.io/web_walking_nak/pen/yLqLOBO)

made with: position: fixed · scroll listener

```css
.js-fixed-area { position: relative }
.js-fixed-elm { position: absolute; top: 0 }
.js-fixed-elm.is-fixed { position: fixed }
h1 { margin-bottom: 10vh }
p { margin-top: 100px }
img { vertical-align: top }
```

```js
addEventListener('scroll', ()=> {
```

### [Smooth Scrolling Navigation Menu (Native javascrpt)](https://codepen.io/giorgi225/pen/XWBrZNz)

held: sticky header.header | made with: position: sticky

```css
.header { position: sticky; top: 0 }
nav { position: relative }
nav ul li { position: relative }
```

### [SO74778522, sticky elements](https://codepen.io/renevanderlende/pen/PoavLxX)

made with: nothing recognised — read the code

### [CSS Nugget: sticky table header](https://codepen.io/codyhouse/pen/KKevLWW)

held: sticky th, sticky th, sticky th | made with: position: sticky

```css
th { border-bottom: 2px solid #EB9486; position: sticky; top: 0 }
```

### [CSS position relative vs fixed vs sticky](https://codepen.io/tripu/pen/abKpvYG)

held: fixed h2, sticky h2 | made with: position: sticky · position: fixed

```css
h2 { top: 0; filter: drop-shadow(0 0.2em 0.4em white) }
.relative h2 { position: relative }
.fixed h2 { position: fixed; top: 20vh }
.sticky h2 { position: sticky }
```

### [sticky header and footer](https://codepen.io/TikiHead/pen/vYrLLLj)

held: fixed div.fixed-header, fixed div.fixed-footer | made with: position: fixed

```css
body { padding-top: 60px; padding-bottom: 40px }
.fixed-header, .fixed-footer { position: fixed }
.fixed-header { top: 0 }
.fixed-footer { bottom: 0 }
```

### [Sticky Navigation Bar](https://codepen.io/Timmy0ne/pen/bGMZxxd)

held: fixed nav.nav | on scroll: a.: color+top ×4, nav.nav: background+shadow | on hover of a.: a.: color | made with: position: fixed · transition · :hover · scroll listener

```css
body { padding-bottom: 50px }
.nav { position: fixed; top: 0; transition: all 0.3s ease-in-out }
.nav .container { transition: all 0.3s ease-in-out }
.nav a { transition: all 0.3s ease-in-out }
.nav.active { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3) }
.hero { background-position: bottom center; margin-bottom: 20px; position: relative }
.hero::before { position: absolute; top: 0 }
```

```js
addEventListener('scroll', fixNav)
```

### [Simple blog layout](https://codepen.io/jamiem89/pen/NWMoLeb)

held: sticky div.article__image | made with: position: sticky

```css
.rich-text h1, .rich-text h2, .rich-text h3, .rich-text h4 { padding-top: 4rem }
.rich-text h3 { padding-top: 2rem }
.rich-text li:not(:last-child) { margin-bottom: 1.2rem }
.rich-text ul li { position: relative }
.rich-text ul li:after { position: absolute; top: .9rem }
.rich-text > *:not(:last-child) { margin-bottom: 4rem }
.article__image { position: sticky; top: 0 }
.article__image-wrapper { position: relative }
.article__image-wrapper img { position: absolute; top: 0 }
.header { margin-bottom: 20rem }
.header__cat { text-transform: uppercase; margin-bottom: 3rem; opacity: .6 }
```

### [Weird Sticky>Fixed Renderer issue](https://codepen.io/Bupeldox/pen/yLjZgRY)

held: sticky div.element-sticky, fixed div.toggleOnClick | made with: position: sticky · position: fixed

```css
p { margin-top: 400px }
.element-sticky { position: sticky; top: 0 }
.element-fixed { position: fixed }
```

### [Sticky Table](https://codepen.io/frontendhelp/pen/OJZarKj)

held: sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th | made with: position: sticky

```css
table thead th { position: sticky; top: 0 }
table tbody th { position: relative }
table thead th:first-child { position: sticky }
table tbody th { position: sticky }
caption { position: sticky }
[role="region"][aria-labelledby][tabindex]:focus { box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.5) }
```

### [Hide layout with CSS sticky position](https://codepen.io/fedbysandrine/pen/xxjQgRP)

held: sticky div.l-concealer__spill | made with: position: sticky

```css
.l-concealer__cover { position: relative }
.l-concealer__spill { position: sticky; top: 0 }
.l-concealer__cover + .l-concealer__spill { bottom: 0; top: auto }
.l-concealer__spill hr { border-top: 1px solid rgba(255, 255, 255, 0.2) }
```

### [Reveal layout with CSS sticky position](https://codepen.io/fedbysandrine/pen/rNvrQJZ)

held: sticky div.l-concealer__spill | made with: position: sticky

```css
.l-concealer__cover { position: relative }
.l-concealer__spill { position: sticky; top: 0 }
.l-concealer__cover + .l-concealer__spill { bottom: 0; top: auto }
.l-concealer__spill hr { border-top: 1px solid rgba(255, 255, 255, 0.2) }
```

### [Sticky header and cart drawer](https://codepen.io/saltman/pen/poVZjWL)

on scroll: a.logo: transform+top | made with: position: sticky · scroll listener

```css
.is-sticky { position: sticky; top: 0 }
.app-nav .logo { transform: translateX(-100%) }
.app-nav.is-sticky .logo { transform: translateX(0) }
p { margin-bottom: 2rem }
```

```js
addEventListener('scroll', () => {
```

### [Sticky Table Headings Left And Top](https://codepen.io/blynx/pen/XWqNRBw)

held: sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th | made with: position: sticky

```css
thead th { position: sticky; top: 0 }
tbody th:first-child { position: sticky }
```

### [3D Cube Carousel](https://codepen.io/amdigitalexp/pen/YzLqGZw)

on scroll: div.cube: transform+top | on hover of img.: div.cube: transform+top | made with: @keyframes · 3D (perspective / preserve-3d)

```css
.carousel { perspective: 1000px }
.cube { position: relative; animation: rotate 30s infinite linear }
.face { position: absolute }
.front { transform: rotateY(0deg) translateZ(400px) }
.back { transform: rotateY(180deg) translateZ(400px) }
.left { transform: rotateY(-90deg) translateZ(400px) }
.right { transform: rotateY(90deg) translateZ(400px) }
from { transform: rotateY(0deg) }
to { transform: rotateY(360deg) }
@keyframes rotate animates transform
```

### [Body gecentreerd + sticky position](https://codepen.io/Aardwerk/pen/YzLwvav)

held: sticky div.wrapper, sticky footer | on hover of a.: a.: background | made with: position: sticky · :hover

```css
html { position:relative }
.wrapper { margin-top:1rem; position:relative }
.header-menu { position: sticky; top: 0 }
.branding h1, .branding p { text-transform: uppercase }
.achtergrond { position:relative }
.titel { position:absolute; bottom:10% }
.sectie-titel { text-transform: uppercase }
footer { position:sticky; bottom: 0 }
```

### [Position: sticky](https://codepen.io/Rittenhouse/pen/PoePRVp)

held: sticky div.headers, sticky div.heading, sticky div.heading, sticky div.heading, sticky div.heading, sticky div.heading, sticky div.heading, sticky div.heading | made with: position: sticky · scroll-snap · :hover · prefers-reduced-motion

```css
*, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important }
header { position: absolute; top: 17em }
.wrapper { position: relative }
.headers { position: -webkit-sticky; position: sticky; top: 0 }
.row, .column { -webkit-scroll-snap-align: start; scroll-snap-align: start }
.heading { position: -webkit-sticky; position: sticky; top: 0 }
.column-text { border-top: 0 }
```

### [Back to Basics - CSS position property](https://codepen.io/BlogFire/pen/mdxNqvv)

held: fixed div.fixed, sticky div.main | made with: position: sticky · position: fixed

```css
.absolute { position: absolute; top: 20% }
.fixed { position: fixed; top: 5px }
.relative { position: relative }
.sticky { position: sticky; top: 60px }
.wrapper { border-bottom: 2px solid blue }
h1 { margin-top: 70px }
p { margin-bottom: 0.5rem }
```

### [Sticky Staggered Table Titles](https://codepen.io/blynx/pen/RwMzvmQ)

held: sticky th.st, sticky th.st, sticky th.st, sticky th.st, sticky th.st, sticky th.st, sticky th.st | made with: position: sticky

```css
.st { position: sticky; top: 0 }
```

### [Sticky header with static description text](https://codepen.io/vsync/pen/gOeyLXZ)

held: fixed main, sticky header.sticky, sticky header.sticky | on scroll: header.sticky: shadow+top | made with: position: sticky · position: fixed · transition · custom properties driven by JS · scroll listener

```css
main { position: fixed; inset: 0; box-shadow: 1px 1.8px 2.4px -8px rgba(0, 0, 0, 0.015), 2.4px 4.1px 5.5px -8px rgba(0, 0, 0, 0.023), 4.3px 7.4px 9.9px -8px rgba(0, 0, 0, 0.03), 7.1px 12.2px 16.4px -8px rgba(0, 0, 0, 0.036), 11 }
header h1 { text-transform: capitalize; transition: 0.3s ease-out }
header input { transition: 0.2s }
header.sticky { --top: 0; position: sticky; top: var(--top) }
header.sticky-title { box-shadow: 0 1em 20px -0.5em var(--bg) }
header.sticky-title.overlap ~ .sticky-last { box-shadow: 0 10px 10px #00000044 }
header.sticky-last { --top: var(--minimized-title-height) }
```

```js
addEventListener('scroll', spyStickyHeaders)
style.setProperty('--top', titleElem.clientHeight + offset + 'px')
```

### [Untitled](https://codepen.io/tife89/pen/MWVXgYM)

made with: scroll() timeline · transition · :hover · scroll listener · Web Animations API (.animate)

```css
h1 { margin-bottom: 1em }
.navbar { box-shadow: 0 1px 3px rgba(0,0,0,.04); margin-bottom: 2em; opacity: 0.96 }
nav a:hover [class^="fa"] { -webkit-transition: all 0.5s ease-out; transition: all 0.5s ease-out }
nav ul { opacity: 0; -webkit-transition: all 1s ease; transition: all 1s ease }
nav li { border-bottom: 1px solid #efefef; padding-top: 1em; padding-bottom: 1em }
nav li:hover { -webkit-transition: all 0.5s ease-out; transition: all 0.5s ease-out }
#menu-toggle:checked ~ ul { opacity: 1 }
.label-toggle { margin-top: 1.3em }
#services { padding-bottom: 80px }
#about { padding-bottom: 80px }
#testimonials { padding-bottom: 80px }
#contact { padding-bottom: 80px }
```

```js
addEventListener('scroll', scroller, false)
.animate( {scrollTop: target},
```

### [GSAP Sticky, fading, scrolling titles](https://codepen.io/jamiem89/pen/gOevYyP)

held: fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start, fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start, fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start, sticky h1, sticky h1, sticky h1 | on scroll: div.sticky-statement: transform+opacity+top ×2 | made with: position: sticky · GSAP

```css
section { position: relative }
h1 { position: sticky; top: 47.5vh }
```

```js
gsap.timeline({
```

### [Sticky Navbar](https://codepen.io/alexandrecrzb/pen/MWVOdeE)

held: fixed nav.nav | on scroll: a.: color+top ×4, nav.nav: background+shadow | on hover of a.: a.: color | made with: position: fixed · transition · :hover · scroll listener

```css
body { padding-bottom: 50px }
.nav { position: fixed; top: 0; transition: all .3s ease-in-out }
.nav .container { transition: all .3s ease-in-out }
.nav a { transition: all .3s ease-in-out }
.nav.active { box-shadow: 0 2px 10px rgba(0, 0, 0, .3) }
.hero { background-position: bottom center; position: relative; margin-bottom: 20px }
.hero::before { position: absolute; top: 0 }
```

```js
addEventListener('scroll', fixNav)
```

### [Sticky in a grid](https://codepen.io/Larprad/pen/bGvroEo)

held: sticky div.item, sticky div.item | made with: position: sticky

```css
.sticky { position: sticky; top: 1rem }
```

### [html table fixed-header(css position:sticky)](https://codepen.io/cfd-ack/pen/mdxRQKe)

held: sticky thead, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky td, sticky td, sticky td | made with: position: sticky

```css
.tableBase { position: relative }
.scrollBox { position: relative }
.tbl thead { position: sticky; top: 0 }
.tbl th, .tbl td { position: relative; border-top: 1px solid var(--cell-bg, white); border-bottom: 1px solid var(--border-color, silver) }
.tbl th:nth-child(1), .tbl td:nth-child(1) { position: sticky }
.tbl th:nth-child(2), .tbl td:nth-child(2) { position: sticky }
.tbl th:nth-child(3), .tbl td:nth-child(3) { position: sticky }
```

### [smart sticky header](https://codepen.io/barthendrix/pen/yLKJxxa)

made with: position: fixed · transition · :hover · prefers-reduced-motion · custom properties driven by JS · IntersectionObserver · scroll listener

```css
a { transition: color 0.25 }
.header--pinned .header__inner { position: fixed; top: calc(var(--header-height) * -1); transition: transform 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955) }
.header--pinned.header--scrolling-up .header__inner, .header--pinned:focus-withi { transform: translateY(var(--header-height)) }
.nav__logo, .nav__link { text-transform: uppercase }
.main h1, .main h2, .main h3, .main h4, .main h5, .main h6, .main p { margin-bottom: 0.75em }
.footer { text-transform: uppercase }
```

```js
style.setProperty('--header-height', headerHeight + 'px')
new IntersectionObserver(handler)
addEventListener('scroll', () => {
```

### [Position: Relative, Absolute, Sticky, Fixed](https://codepen.io/mntcrl/pen/vYRLoLv)

held: sticky nav.navbar, sticky aside, fixed div.btn-fixed | on hover of a.: a.: background+color | made with: position: sticky · position: fixed · transition · :hover

```css
a { text-transform: uppercase }
.navbar { position: sticky; top: 0 }
.navbar a { transition: all 0.7s }
.contenedor-imagen img { object-position: center }
.contenedor { position: relative }
.contenedor h1:nth-of-type(1) { margin-bottom: 30px }
.contenido { position: absolute; top: 0 }
.contenido p { margin-bottom: 20px }
aside { position: sticky; top: 20px }
.post { margin-bottom: 20px }
aside .titulo { margin-bottom: 20px }
aside .indice a { margin-bottom: 10px }
```

### [Sticky header, sidebar, footer](https://codepen.io/anedomansky/pen/VwQoYMX)

held: sticky header.page__header, sticky nav.sidebar__nav, sticky footer.page__footer | made with: position: sticky

```css
.page__header { position: sticky; top: 0 }
.page__footer { position: sticky; bottom: 0 }
.sidebar__nav { position: sticky; top: 15vh }
```

### [Sticky Navbar Project](https://codepen.io/LOVEFORALL/pen/bGLXNVO)

held: fixed nav | on scroll: a.: color+top ×5, img.: color | made with: position: fixed · transition · scroll listener

```css
#mainNav .logo img { transition: height 0.4s }
#mainNav { position: fixed; top: 0; transition: background 0.4s }
section:nth-of-type(1) { margin-top: 84px }
#mainNav ul li a { transition: color 0.4s }
```

```js
addEventListener("scroll",scrollNavbar)
```

### [Sticky Header](https://codepen.io/emreerdendev/pen/zYRQOaV)

held: sticky h1, sticky h1, sticky h1, sticky h1, sticky h1, sticky h1, sticky h1, sticky h1, sticky h1, sticky h1 | made with: position: sticky

```css
.container { position: relative }
.container h1 { position: sticky; top: 0 }
```

### [Sticky Navbar(html css js)](https://codepen.io/Hi-mohammad/pen/XWZPgWy)

held: fixed div.navbar | on scroll: div.navbar: background | made with: position: fixed · transition · :hover · scroll listener

```css
.navbar { position: fixed; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); transition: background-color 0.4s }
.navbar ul li a:hover { border-bottom: 5px dotted #eb5e28 }
```

```js
addEventListener("scroll", () => {
```

### [Sticky scroll nav w/ observer](https://codepen.io/mejiaj/pen/PoQBZKg)

held: sticky nav.sidenav | made with: position: sticky · transition · :has() · IntersectionObserver

```css
.container { position: relative }
.sidenav { box-shadow: var(--shadow-4); position: sticky; top: 5rem }
.sidenav__list-item { transition: border 0.2s ease-in }
.sidenav__link { transition: color 0.2s ease-in }
```

```js
new IntersectionObserver(
```

### [Sticky Stack 2](https://codepen.io/kirkone/pen/PoQevBK)

held: sticky img, sticky img, sticky img, sticky img, sticky img, sticky img, sticky img, sticky img, sticky img | made with: position: sticky · transition

```css
section { margin-top: -3px }
article { transition: background-color 270ms ease-in-out; margin-bottom: max( calc(-100% / (var(--width) / var(--height))), max(-100vh, var(--height) * -1px) ) }
div { border-top: 3px solid black }
img { position: sticky; top: 0 }
```

### [Mobile Contact list with (sticky headers)](https://codepen.io/Taluska/pen/rNJvgYP)

held: sticky header.nav__content--header, sticky header.nav__content--header, sticky header.nav__content--header, sticky header.nav__content--header, sticky header.nav__content--header, sticky header.nav__content--header, sticky header.nav__content--header | made with: position: sticky · scroll-snap

```css
.address-book { position: relative; box-shadow: 0 0.25em 0.5em #0003, 0 0.6em 0.96em #0003, 0 1.4em 1.2em -0.125em #0003 }
.navigation { scroll-snap-type: y proximity; scroll-snap-stop: always }
.navigation__content--flow { scroll-snap-align: start }
.nav__content--header { position: sticky; top: 0 }
.icon { position: relative }
.icon::before { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.user__name { border-bottom: 1px solid var(--color-2) }
```

### [CSS Sticky Table Header and Column](https://codepen.io/mikegolus/pen/jOZzRzw)

held: sticky tr.sticky, sticky th.sticky, sticky td.sticky, sticky td.sticky, sticky td.sticky, sticky td.sticky, sticky td.sticky, sticky td.sticky, sticky td.sticky, sticky td.sticky | made with: position: sticky

```css
h1, h2 { margin-top: 48px }
thead { text-transform: uppercase }
th, td { border-bottom: 1px solid var(--borderColor) }
tr:last-child td { border-bottom: none }
tr.sticky { position: sticky; top: 0; box-shadow: 0 0 6px rgba(0,0,0,0.25) }
th.sticky, td.sticky { position: sticky }
th.sticky::after, td.sticky::after { position: absolute; top: 0; bottom: -1px }
th.sticky::before, td.sticky::before { position: absolute; top: 0; bottom: -1px }
```

### [CSS Pressed and Sticky Buttons](https://codepen.io/lancelhoff/pen/ExQKovV)

made with: nothing recognised — read the code

```css
.mybutton { box-shadow: 2px 2px 2px #777 }
.mybutton:active { transform: translateY(2px); box-shadow: 0 0 0 }
.stkybutton { box-shadow: 2px 2px 2px #777 }
.stkybutton:active, .stkybutton:focus { transform: translateY(2px); box-shadow: 0 0 0 }
```

### [Sticky Tongue](https://codepen.io/kitjenson/pen/GRQpjWw)

on scroll: div.: transform+top | made with: @keyframes · pointer / mouse tracking

```css
#carrot { position: absolute; top: 25%; animation: fly .25s steps(4) infinite alternate }
100% { background-position: -200% 0 }
#animal { position: absolute; bottom: 0; opacity: 1; background-position: 0 0 }
.idle { animation: idle 1s steps(3) infinite }
100% { background-position: 300% 100% }
.jump { animation: idle 1s steps(3) infinite }
.dangle { animation: dangle 1s linear infinite }
.dangle:before { position: absolute; bottom: 89% }
.falling { animation: fall 3s linear forwards }
100 { top: calc(100vh - 150px) }
@keyframes fly animates background-position
@keyframes idle animates background-position
```

```js
addEventListener('mousemove', function(e){
```

### [Sticky Header (flexbox)](https://codepen.io/buckolaya/pen/qBxEGYB)

held: fixed header | made with: position: fixed

```css
header { position: fixed; top: 0 }
header p { text-transform: uppercase }
main { margin-top: 5rem }
```

### [Sticky Nav Highlight Active](https://codepen.io/alanizcreative/pen/WNdqQWd)

held: sticky nav | on scroll: a.: shadow | made with: position: sticky · scroll listener

```css
nav { position: sticky; top: 0 }
nav a[data-vis=true] { box-shadow: inset 0 0.25rem 0 0 #323b43 }
```

```js
addEventListener("scroll", this._scrollHandler.bind(this))
```

### [sticky blurry nav](https://codepen.io/JamieMaguire/pen/oNprXGq)

held: sticky nav | made with: position: sticky · backdrop-filter

```css
nav { -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px); position: sticky; top: 0 }
```

### [Sticky navbar (position: sticky)](https://codepen.io/aya-suz/pen/rNpqMav)

held: sticky nav.sticky__list | made with: position: sticky

```css
.sticky__list { box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.17); position: sticky; position: -webkit-sticky; top: 0 }
```

### [pricing table](https://codepen.io/dmbdesignpdx/pen/JjMZbGO)

held: sticky thead.mtxHeader | made with: position: sticky · container queries

```css
.Matrix { box-shadow: var(--shadow-lg) }
.Matrix figcaption { position: absolute }
.mtxHeader { position: -webkit-sticky; position: sticky }
.mtxHeader tr { box-shadow: 0 1px var(--border) }
.mtxHeader tr { box-shadow: 0 2px var(--primary) }
```

### [Generic flex body layout](https://codepen.io/kloshar4o/pen/vYpjLrr)

made with: position: sticky · custom properties driven by JS

```css
body, #app { position: relative }
#app.sticky-header header { position: sticky; top: 0 }
#app.sticky-footer footer { position: sticky; bottom: 0 }
```

```js
style.setProperty("--screen-h", vh)
```

### [Position Sticky Tests](https://codepen.io/deanleigh/pen/mdpXGBa)

held: sticky div.item | made with: position: sticky

```css
.nav.top { position: sticky; top: 0 }
```

### [Sticky Nav w/ Right Slide-in Logo](https://codepen.io/catzla/pen/popaEPb)

on scroll: nav.: shadow+top, div.site-wrap: transform+top | made with: position: fixed · transition · scroll listener

```css
.site-wrap { box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.05); transform: scale(0.98); transition: transform 0.5s }
body.fixed-nav .site-wrap { transform: scale(1) }
nav { top: 0; transition: all 0.5s; position: relative }
body.fixed-nav nav { position: fixed; box-shadow: 0 5px 0 rgba(0, 0, 0, 0.1) }
li.logo { transition: all 0.5s ease-in-out }
nav a { transition: all 0.5s; text-transform: uppercase }
```

```js
addEventListener("scroll", fixNav)
```

### [Dialog with sticky header in HTML](https://codepen.io/utilitybend/pen/mdpRoZq)

held: sticky header | on scroll: button.btn: background | made with: position: sticky · @keyframes · transition · :hover · <dialog>

```css
dialog { box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px; animation: scale-in 0.4s ease-out }
dialog header { position: sticky; top: 0; padding-bottom: 24px; border-bottom: 1px solid rgba(216, 209, 116, 1) }
dialog footer { border-top: 1px solid rgba(216, 209, 116, 1) }
dialog p:last-of-type { margin-bottom: 0 }
0% { opacity: 0 }
50% { opacity: 1; transform: scale(0.9) }
100% { transform: scale(1) }
body { background-position: 0 0, 3px 3px }
.btn-primary { transition: all 0.24s }
.btn-primary-outline { transition: all 0.24s }
@keyframes scale-in animates opacity, transform
```

### [Sticky container progress counter](https://codepen.io/Infografika/pen/KKZwNLX)

made with: scroll listener

```css
.sticky-wrapper { position: relative }
.sticky-container { position: absolute; top: 0 }
```

```js
addEventListener('scroll', stickyProgress)
```

### [Simple Product Page](https://codepen.io/francoiscoron/pen/WNXPgNz)

held: fixed header.header, sticky div.product__desc, fixed div.cart, fixed div.overlay | on hover of a.: a.: opacity | made with: position: sticky · position: fixed · transition · :hover

```css
body { padding-top: 60px }
.header { position: fixed; inset: 0 0 auto 0 }
.nav a { opacity: 0.6 }
.nav a:hover { opacity: 1 }
.wrapper { transform: translateX(0); transition: transform 400ms linear }
.nav-open .wrapper { transform: translateX(-5%) }
.product-top { position: relative }
.product__sizes { margin-bottom: 2rem }
.product__info { position: relative }
.product__info h1 { margin-bottom: 1.5rem }
.product__price { margin-bottom: 2rem }
.product__short { margin-bottom: 2rem }
```

### [Pure CSS Scroll Shadow](https://codepen.io/freeplayg/pen/yLPGPWZ)

held: sticky header | made with: position: sticky

```css
main::before { position: sticky; top: 0; margin-bottom: -60px; box-shadow: 0 0 32px rgba(0,0,0,0.2) }
header { position: sticky; top: 0px; margin-top: 40px }
section { border-bottom: 1px solid rgba(0,0,0,0.1) }
section#hero { padding-top: 0 }
section#hero h1 { filter: drop-shadow(0px 20px 2px rgba(0,0,0,0.2)); top: 100px; margin-top: -40px }
hr { opacity: 0.2 }
```

### [sticky scroll experiment with gsap](https://codepen.io/RoshitShrestha/pen/gOXQaam)

made with: GSAP · ScrollTrigger

```css
p:nth-last-of-type(n+2) { margin-bottom: 20px }
.container .grid-2:nth-last-of-type(n+2) { margin-bottom: 120px }
```

```js
gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.create({
gsap.from(".title-1", {
scrollTrigger: { // trigger: ".infoContent", // markers:true, // pin: ".title-1", // pinSpacing: false, // }
```

### [scroll Sticky](https://codepen.io/vijendrajangid/pen/abVBeGO)

made with: position: fixed · scroll() timeline

```css
main { position: relative }
.prodCardInfo.active { position: fixed; top: 100px }
.prodCardInfo.abs { position: absolute; bottom: 10px }
```

### [Simple table with sticky fields](https://codepen.io/valdisl0ve/pen/abVBgNK)

held: sticky tr, sticky td, sticky td, sticky td, sticky td, sticky td, sticky td, sticky td, sticky td, sticky td | made with: position: sticky

```css
tr:nth-child(1), td:nth-child(1) { position: sticky; top: 0 }
```

### [Sticky Navbar / Container CSS only and responsive](https://codepen.io/onza/pen/eYedvdO)

held: sticky div.navbar | made with: position: sticky

```css
.navbar { position: sticky; top: 0 }
```

### [Sticky Back-To-Top Button with IntersectionObserver](https://codepen.io/macx/pen/eYeNMpJ)

held: fixed a.btt-button | made with: position: fixed · transition · :hover · IntersectionObserver

```css
a { transition: all 250ms ease }
.hero { background-position: center }
.btt-button { position: fixed; bottom: -5rem; transition: bottom 250ms ease, border-radius 250ms ease; box-shadow: 0 0.5rem 1rem rgba(28, 25, 23, 0.2), 0 1px rgba(28, 25, 23, 0.3) }
.btt-button.is-visible { bottom: 1rem }
.footer { border-top: 2px solid var(--clr-line); margin-top: var(--spacing); padding-top: var(--spacing) }
```

```js
new IntersectionObserver(callback, options)
```

### [sticky scrolling child elements](https://codepen.io/UweJ/pen/BamaLZm)

on scroll: div.child__div_1: transform+top, div.child__div_2: transform+top, div.child__div_3: transform+top, div.child__div_4: transform+top | made with: nothing recognised — read the code

```css
.parent__div_1, .parent__div_2, .parent__div_3, .parent__div_4, .parent__div_5,  { margin-bottom: 200px }
```

### [Responsive Fixed/Sticky Navigation (World of Warcraft)](https://codepen.io/simeydotme/pen/NWwKpwL)

held: fixed div.overlay, fixed div.switch, fixed div.resize | on scroll: nav.nav: transform+top | on hover of a.: div.nav__icon: filter | made with: position: fixed · @keyframes · transition · :hover · mix-blend-mode

```css
.blizz { box-shadow: 0 1px 0 #252c37, 0 5px 5px -2px #00000044 }
.warcraft { --header-top: 75px; --logo-offset: 3em; text-transform: uppercase; position: absolute; top: 0 }
.warcraft, .warcraft * { will-change: font, transform, height, width, margin, padding, color, background; transition: all 0.33s ease, font 0s ease }
.nav { position: absolute; transform: translate(-50%, var(--header-top)) }
.nav__bg { position: relative }
.nav__bg, .nav__drawer { box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25), 0 4px 12px -5px rgba(0, 0, 0, 0.65) }
.nav__bg:before, .nav__drawer:before { position: absolute; inset: 0; background-position: center; mix-blend-mode: overlay; opacity: 0.22 }
.nav__icon, .nav__blizz { position: absolute; top: 50%; transform: translate(-50%, -300%); filter: brightness(0.9) contrast(0.9) saturate(0.9); opacity: 0 }
.nav__icon:hover, .nav__icon:active, .nav__icon:focus, .nav__blizz:hover, .nav__ { filter: brightness(1.1) contrast(1.1) saturate(1) }
.nav__blizz { transform: translate(0, -200px) }
.nav__item { position: relative }
.nav__item--try, .nav__item--sub { box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2), inset 0 0 3px rgba(0, 0, 0, 0.2); background-position: 28%, center }
```

### [Bootstrap Responsive Table with Sticky Header](https://codepen.io/st3phhays/pen/XWeyoZQ)

held: sticky div.sticky-top | made with: scroll listener

```js
addEventListener('scroll', function(e) {
```

### [BS5 Sticky Tabs + scrollSpy](https://codepen.io/akalinina27/pen/YzrjPPr)

held: sticky ul.nav | made with: nothing recognised — read the code

```css
body { position: relative }
#side-menu .nav-item { margin-bottom: 0; margin-top: 0 }
#side-menu .nav-item p { margin-bottom: 0; margin-top: 0 }
.side-menu__title { border-bottom: solid 2px white }
h2 { margin-bottom: 2% }
```

### [Strands of Medieval European History](https://codepen.io/vcurd/pen/wvrPyJQ)

held: sticky h2.domain__heading, sticky h2.domain__heading, sticky h2.domain__heading, sticky h2.domain__heading, sticky h2.domain__heading, sticky h2.domain__heading, sticky h2.domain__heading, sticky h2.domain__heading | made with: position: sticky · transition · :hover

```css
.domain__heading { top: 0; position: sticky }
.domain__reigns { position: relative }
.domain__reign { position: absolute; top: var(--offset) }
.domain__label { position: absolute; top: 50%; transform: translateY(-50%) }
.domain__link { transition: --lightness 0.3s ease-in-out }
```

### [HORIZONTAL LAYOUT EXPLORATION W/ STICKY SECTIONS](https://codepen.io/hello-antonio/pen/KKXXYMe)

held: sticky div.header, sticky div.intro | made with: position: sticky · position: fixed · scroll() timeline · scroll listener · pointer / mouse tracking · requestAnimationFrame

```css
* { position: relative }
#app { inset: 0 }
html.smooth #app { position: fixed }
.container { position: absolute; top: 0; will-change: transform }
.header p { text-transform: uppercase; margin-bottom: 10vmin }
.header, .intro { position: sticky; top: 10px }
.intro-main ol { margin-top: 10vmin }
.content { position: relative }
.grid { position: relative }
```

```js
addEventListener("scroll", onscroll)
addEventListener("mousemove", mousemove)
requestAnimationFrame(update)
```

### [USWDS - Flexbox sticky](https://codepen.io/mejiaj/pen/BawRyVB)

held: sticky div.tablet:grid-col | made with: nothing recognised — read the code

### [Geologic time scale](https://codepen.io/vcurd/pen/jOGyzGj)

made with: position: sticky

```css
p:last-child { margin-bottom: 0 }
.eon__eras { margin-top: 1rem }
.era__periods { margin-top: 1rem }
.period__epochs { margin-top: 1rem }
.timeline__headrow { position: sticky; top: 0 }
.timeline__eons { position: sticky; top: 3rem }
.eon__caption { position: sticky; top: 4rem }
.eon__eras { margin-top: 0 }
.era__caption { position: sticky; top: 5rem }
.era__periods { margin-top: 0 }
.period__caption { position: sticky; top: 6rem }
.period__epochs { margin-top: 0 }
```

### [On Scroll Gallery (Sticky)](https://codepen.io/labelnoir/pen/GRMqxmb)

held: sticky div.image_wrapper | on scroll: img.: opacity+top ×2 | made with: position: sticky · transition · custom properties driven by JS · scroll listener

```css
h1 { margin-bottom: 0.5em }
h2 { margin-bottom: 1em }
header { margin-bottom: 130px }
header img { margin-bottom: 30px }
.image_wrapper { position: sticky; top: 50px; bottom: 50px }
.image_wrapper img { position: absolute; top: 0; transition: opacity 0.2s ease; opacity: var(--opacity, 0); will-change: opacity }
```

```js
addEventListener("scroll", (e) => {
style.setProperty("--opacity", 1)
style.setProperty("--opacity", 0)
```

### [Hide sticky navigation on scroll](https://codepen.io/Testosterone/pen/oNGxmqE)

held: fixed header.header | on scroll: header.header: transform+top | made with: position: fixed · transition · scroll listener

```css
.scroll-down .header { transform: translate3d(0, -100%, 0) }
.header { position: fixed; top: 0; transition: transform 0.3s ease-in }
.main__section { border-bottom: 2px solid black }
.main__heading { text-transform: uppercase }
```

```js
addEventListener("scroll", () => {
```

### [Show Window Scroll Position](https://codepen.io/DevSkyler/pen/eYGJbKm)

held: sticky div.sticky, sticky div.scroll-pos | made with: position: sticky

```css
.scrollPercent { margin-top: 20px }
.scroll-pos { position: sticky; top: 25px; padding-bottom: 10px; border-bottom: 1px solid #d4b255 }
.sticky { top: 10px; position: sticky }
```

### [Idea Management System](https://codepen.io/chirag-23/pen/WNZNgzG)

made with: position: fixed · transition · :hover

```css
.container3 { position: absolute; top: 15%; transform: translateX(-50%); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) }
.container3 svg { position: absolute; top: 10px; transition: all 0.2s ease-in-out }
#check-icon:hover { transform: scale(1.2) }
#cross-icon:hover { transform: scale(1.2) }
.note { box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2); transition: transform 0.2s ease-in-out }
.note:hover { transform: scale(1.05) }
.foot { position: fixed; bottom: 0 }
```

### [Sticky Footer](https://codepen.io/curtisj44/pen/vYJqjbx)

held: sticky footer | made with: position: sticky

```css
img { vertical-align: bottom }
footer { position: sticky; top: 100vh }
```

### [CSS Grid and position:sticky](https://codepen.io/deanleigh/pen/ZEJVaNb)

held: sticky div.div2, sticky div.sticky-sidebar | made with: position: sticky

```css
header { top: 0; border-bottom: 3px solid }
.div2 { position: sticky; top: 0; border-bottom: 3px solid }
aside { position: relative }
.sticky-sidebar { position: sticky; top: var(--header-height) }
footer { border-top: 3px solid }
```

### [sticky transparent header](https://codepen.io/prajotsurey/pen/MWvqgXY)

held: fixed header | on scroll: header.: background+top | made with: position: fixed · scroll listener

```css
#header { position: fixed; top: 0px }
#logo { position: absolute; top:30px }
#main-poster { background-position: center }
```

```js
addEventListener('scroll', handleScroll)
```

### [Simple Sticky Side Navigation Bar](https://codepen.io/ericthegamer911/pen/vYJrPaB)

made with: scroll listener

```css
.content { top: 1px !important }
.navbar { position: absolute }
```

```js
addEventListener("scroll", () => {
```

### [Css Simple Card Positioning Design](https://codepen.io/coderjakaria/pen/KKvqwVo)

held: sticky div.header, sticky div.l | made with: position: sticky

```css
.f { box-shadow: 0 0 40px -15px white }
.l { margin-bottom: 40px; box-shadow: 0 0 35px -15px gray; position: sticky; top: 85px }
.l > h1 { margin-top: 20px }
.l button { margin-top: 10px }
.header { position: sticky; top: 0 }
```

### [Sticky navbar](https://codepen.io/vanslooten/pen/KKvNQxX)

held: sticky div.sticky | made with: position: sticky · :hover

```css
.sticky { position: sticky; top: 0 }
.sticky + .content { padding-top: 60px }
```

### [Sticky Background](https://codepen.io/beljems/pen/bGrGMYO)

held: sticky div.item, sticky div.item, sticky div.item, sticky div.item, sticky div.item | made with: position: sticky

```css
.item { position: -webkit-sticky; position: sticky; top: 0 }
```

### [stickyNavigation](https://codepen.io/coelho-na/pen/abwMqNd)

held: fixed header.header | on scroll: a.header__link: color+top ×6, header.header: background, a.header__logo: color+top | on hover of a.header__logo: a.header__link: color+top ×6, header.header: background, a.header__logo: color | made with: position: fixed · transition · scroll listener

```css
.header { position: fixed; top: 0; -webkit-transition: 0.6s; transition: 0.6s }
.header__logo { position: relative; text-transform: uppercase; -webkit-transition: 0.6s; transition: 0.6s }
.header__nav { position: relative }
.header__list { position: relative }
.header__link { position: relative; -webkit-transition: 0.6s; transition: 0.6s }
.banner { position: relative; background-position: center center }
.banner::after { position: absolute }
```

```js
addEventListener("scroll", () => {
```

### [CSS position sticky sidebar](https://codepen.io/markcarrrr/pen/powxLNZ)

held: sticky div.sidebar-1 | made with: position: sticky

```css
.sidebar-1 { position: sticky; top: 25px }
```

### [Sticky!](https://codepen.io/oneeyedman/pen/GREXmog)

held: sticky header.page__header, sticky section.newsletter | made with: position: sticky

```css
.page__header { position: sticky; top: 0 }
.page__main { position: relative }
.page__aside { position: relative }
.newsletter { position: sticky; top: 65px }
```

### [Cohesion Quiz](https://codepen.io/wfwood/pen/XWgEwWv)

held: sticky ul.sticky | made with: position: sticky · transition · :hover · backdrop-filter

```css
main div { padding-bottom:15px }
main div:not(:last-child) { border-bottom:3px solid #9a82979c }
main div h2 { margin-bottom:0 }
main div h3 { margin-top:0 }
aside { -webkit-backdrop-filter: blur(7px); backdrop-filter: blur(7px) }
main { -webkit-backdrop-filter: blur(7px); backdrop-filter: blur(7px) }
.sticky { position:sticky; top: 10px }
select { transition:box-shadow .5s }
select:hover { box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.024), 0px 0.1px 2.8px rgba(0, 0, 0, 0.035), 0px 0.3px 6.6px rgba(0, 0, 0, 0.046), 0px 1px 22px rgba(0, 0, 0, 0.07) }
```

### [Header Sticky](https://codepen.io/vijendrajangid/pen/WNOMxQw)

held: fixed header.clearfix | on scroll: header.clearfix: background+shadow+top | made with: position: fixed · scroll() timeline · transition

```css
#header { position: fixed; top: 0; transition: all 0.4s ease-in; border-bottom: 1px solid #000 }
#header.headerUp { top: -60px }
#header.headerDown { box-shadow: 0 0 10px 0 rgb(0 0 0 / 40%) }
```

### [Position fixed and sticky side by side](https://codepen.io/tippingpointdev/pen/rNwyPrN)

held: fixed div.fixed, sticky div.sticky | made with: position: sticky · position: fixed

```css
.fixed { position: fixed; top: 20px }
.sticky { position: sticky; top: 20px }
```

### [Sticky_navbar](https://codepen.io/an_kush4/pen/QWgKoLE)

held: sticky nav.nav_bar | made with: position: sticky · :hover

```css
.nav_bar { margin-top: -55px; position: sticky; top: 0 }
.details { margin-top: 1in }
.details p { padding-bottom: 20px; border-bottom: 1px dashed black }
.details h3 { padding-top: 55px }
.nav_bar { margin-top: -24px }
```

### [Sticky going wrong direction](https://codepen.io/nexii/pen/BaRepRw)

held: fixed div.track, sticky div.sticky | made with: position: sticky · position: fixed

```css
.track { position: fixed; transform: translateY(-25%) rotate(90deg) translateY(12.5%) }
.sticky { position: sticky; top: 0; transform: rotate(-90deg) }
```

### [Sticky-Navbar](https://codepen.io/khushwantk/pen/vYmwYNG)

made with: position: fixed · scroll listener

```css
.section.section-1 { position: relative }
.navbar { position: absolute; bottom: 0 }
.navbar .link { text-transform: uppercase }
.navbar.fixed { position: fixed !important; top: 0 }
```

```js
addEventListener("scroll", function () {
```

### [Table sticky header](https://codepen.io/ChristinaLozova/pen/xxdmYoR)

held: sticky th, sticky th, sticky th | made with: position: sticky

```css
table { position: relative }
table thead th { position: relative }
table thead tr > th { vertical-align: top; position: sticky; top: 0 }
table thead tr > th:nth-of-type(1) { box-shadow: inset 0 2px 0 #4d9aff, inset 0 -2px 0 #4d9aff, inset 2px 0 0 #4d9aff, inset -1px 0 0 #d9d9d9 }
table thead tr > th:nth-of-type(2) { box-shadow: inset 0 2px 0 #4d9aff, inset 0 -2px 0 #4d9aff, inset 1px 0 0 #d9d9d9, inset -1px 0 0 #d9d9d9 }
table thead tr > th:nth-of-type(3) { box-shadow: inset 0 2px 0 #4d9aff, inset 0 -2px 0 #4d9aff, inset -2px 0 0 #4d9aff, inset 1px 0 0 #d9d9d9 }
table tbody tr:first-of-type, table tbody tr:first-of-type > td { border-top: none }
```

### [scrollsticky sections](https://codepen.io/simo_m/pen/yLbRYZv)

held: sticky img.sticky-image, sticky div.scrolling, sticky img.sticky-image, sticky span.sticky-image, sticky img.sticky-image, sticky span.sticky-image, sticky div.scrolling | made with: position: sticky

```css
.scrolling__inner { box-shadow: 0 12px 20px -6px rgba(0, 0, 0, 0.3) }
.sticky-section { position: relative }
.sticky-image { position: sticky; top: 0; background-position: center }
.scrolling { position: relative }
.scrolling[data-pin] { position: sticky; padding-bottom: 0 }
.scrolling[data-pin=top] { top: 0 }
.scrolling[data-pin=bottom] { bottom: 0 }
```

### [sticky div background change on scroll GSAP](https://codepen.io/annesophiegdn/pen/VwbBxmp)

held: fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start, fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start, fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start, fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start, fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start | on scroll: div.left-side: background | made with: position: sticky · position: fixed · GSAP · ScrollTrigger

```css
h1 { text-transform: uppercase; position: -webkit-sticky; position: sticky; top: 5px }
.left-side { position: fixed }
.box-1 { position: relative }
```

```js
gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.create({
gsap.to(".left-side",
```

### [sticky column + scrollable column](https://codepen.io/annesophiegdn/pen/RwVyBdj)

held: sticky p.left__sticky | made with: position: sticky

```css
.header { padding-top: 5rem; padding-bottom: 5rem; text-transform: uppercase }
.left__sticky { position: -webkit-sticky; position: sticky; top: 5px }
```

### [Health Profile - Overpanel 3](https://codepen.io/JayNeedsCake/pen/XWRVQRE)

held: sticky div.overpanel-header, sticky div.condition-search, sticky div.save-button-container | made with: position: sticky · @keyframes · transition · :hover · clip-path · scroll listener

```css
.button { box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2) }
.button:not(.disabled):hover, .button:not(.disabled):focus, .button:not(.disable { box-shadow: none }
.button.disabled { box-shadow: none }
.button.small.tertiary { box-shadow: none }
.button.primary.disabled { box-shadow: none }
.button.secondary:not(.disabled):hover, .button.secondary:not(.disabled):focus,  { box-shadow: none }
.button.secondary.disabled { box-shadow: none }
.button.tertiary { box-shadow: none }
.button.tertiary:not(.disabled):hover, .button.tertiary:not(.disabled):focus, .b { box-shadow: none }
.button.tertiary.disabled { box-shadow: none }
.overpanel-header { position: sticky; top: 0 }
.condition-top label { padding-bottom: 8px }
```

```js
addEventListener("scroll", () => {
```

### [Sticky blur navbar](https://codepen.io/errolm/pen/jOmYQpb)

held: sticky div.sticky, fixed button.help | on hover of button.help: button.help: transform+top | made with: position: sticky · position: fixed · transition · :hover · backdrop-filter

```css
div.sticky { -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(2px); position: sticky; position: -webkit-sticky; top: 0; padding-top: 2px; padding-bottom: 10px; border-bottom: 1px solid rgba(5,5,5,0.5) }
.help { position: fixed; bottom: 5px; transition: .5s }
.help:hover { transform: scale(1.15) }
```

### [PC#010 | header + nav](https://codepen.io/summercodes/pen/jOmbZLW)

held: fixed div, sticky div, sticky div.tri-left, sticky div.tri-right, sticky div.navigation, sticky div | made with: position: sticky · position: fixed · scroll() timeline · @keyframes · transition · :hover · clip-path

```css
body { background-position: center 80% }
#header1 { position: fixed; top: 0 }
#header1 .tech { text-transform: uppercase; position: relative }
#header2 { margin-top: 85vh; background-position: center 80%; border-top: 5px solid rgb(var(--pink)); text-transform: uppercase; position: relative }
#header2::before { position: absolute; top: -5vh; clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%); border-top: 5px solid rgb(var(--pink)) }
#header2::after { position: absolute; top: calc(-5vh + 5px); clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%); background-position: center 80% }
#header2 .icon { position: relative }
from { transform: rotate(0deg) }
to { transform: rotate(360deg) }
#header2 .links a { position: relative }
#header2 .links a::before { position: absolute; bottom: -6px; opacity: .5; transition: .5s linear }
#header2 .links a::after { position: absolute; bottom: -9px; transition: .5s linear }
```

### [Health Profile - Full Page](https://codepen.io/JayNeedsCake/pen/MWmWoda)

made with: position: sticky · @keyframes · transition · :hover · clip-path · scroll listener

```css
.button { box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2) }
.button:not(.disabled):hover, .button:not(.disabled):focus, .button:not(.disable { box-shadow: none }
.button.disabled { box-shadow: none }
.button.small.tertiary { box-shadow: none }
.button.primary.disabled { box-shadow: none }
.button.secondary:not(.disabled):hover, .button.secondary:not(.disabled):focus,  { box-shadow: none }
.button.secondary.disabled { box-shadow: none }
.button.tertiary { box-shadow: none }
.button.tertiary:not(.disabled):hover, .button.tertiary:not(.disabled):focus, .b { box-shadow: none }
.button.tertiary.disabled { box-shadow: none }
.health-profile-content .side-nav-column { padding-top: 40px }
.health-profile-content .side-nav-column a { border-bottom: 1px solid #B9BCC0 }
```

```js
addEventListener("scroll", () => {
```

### [BAPE](https://codepen.io/talentedunicorn/pen/mdWZWdd)

held: sticky header.Product_Header | made with: position: sticky

```css
.Product { position: relative }
.Product_Header { top: 0 }
.Product_Header { position: sticky }
```

### [CSS Sticky with Direction & Scrolling state (plain JS)](https://codepen.io/adam-laita/pen/WNpBbma)

held: sticky header.container, sticky footer.container | on scroll: header.container: background+top | made with: position: sticky · transition · IntersectionObserver · scroll listener

```css
.sticky { position: sticky; top: 0 }
header { transition: 0.5s }
footer { position: sticky; bottom: 0 }
```

```js
addEventListener("scroll", function () {
```

### [Animation](https://codepen.io/tusharchandra777/pen/dyvajdY)

on scroll: div.: background+shadow+top | made with: @keyframes

```css
div { animation: 10s color-change infinite; margin-bottom: 10px; position: relative }
0% { top:0; box-shadow: 200px 200px pink }
25% { top:0 }
50% { top:200px; box-shadow: 200px 200px green }
75% { top:200px }
100% { top:0 }
@keyframes color-change animates background, left, top, box-shadow
```

### [display:sticky example](https://codepen.io/Gagik/pen/ExWGEWq)

held: sticky div | made with: position: sticky

```css
aside div { top: 20px; position: sticky }
```

### [Animate Navbar Sandbox](https://codepen.io/the_lizzard_king/pen/QWpmZoE)

held: fixed div.header | made with: position: fixed · scroll() timeline · transition

```css
.header { position:fixed }
.container { transition:all 1s ease-in-out }
.header.stickey { position:fixed }
.header.stickey .container { transition:all 1s ease-in-out }
```

### [Sticky Navigation with Tailwind CSS](https://codepen.io/steainsworth/pen/oNZEGLM)

held: sticky div.sticky | on hover of li.mb-2: a.hover:text-gray-600: color | made with: nothing recognised — read the code

### [CC#006 | coding camp tracker](https://codepen.io/summercodes/pen/xxqGZjx)

held: sticky div.stuff | made with: position: sticky

```css
body { text-transform: uppercase }
.container { position: relative }
.container .about .stuff { position: sticky; top: 50px }
.container .about .image { background-position: center }
.container .about name { margin-bottom: 5px; text-transform: lowercase }
.container .about cabin, .container .about points { margin-bottom: 25px }
```

### [Toggle Tab for Sticky Header](https://codepen.io/jsonc/pen/XWMraZd)

held: fixed div.et-divi-sticky-header | on scroll: div.et-divi-sticky-toggle: opacity | made with: position: fixed · transition · :hover

```css
div { position:relative }
.menu a { text-transform: uppercase }
.et-divi-sticky-toggle { opacity: 0; transition: all 400ms; position: absolute; bottom: 0; transform: translateX(0%) translateY(100%) }
.et-divi-sticky-toggle.et-show-toggle { opacity: 1 }
.et-divi-sticky-header { position: fixed; top: 0; transition: all 400ms !important }
.et-divi-sticky-header.et-hide-sticky-header { transform: translateX(0%) translateY(-100%) !important }
.et-divi-sticky-toggle .et-pb-icon { margin-bottom: 0px; transition: all 400ms }
.et-hide-sticky-header .et-divi-sticky-toggle .et-pb-icon { transform: rotateX(180deg) }
```

### [CSS: Sticky Header & Footer (Body height 100%)](https://codepen.io/alexpetergill/pen/rNjbEvM)

made with: nothing recognised — read the code

### [Position sticky scrolling - Parallax](https://codepen.io/iftikharrasha/pen/ExZdzYW)

held: sticky div.box-ip, sticky div.box-ip, sticky div.box-ip, sticky div.box-ip, sticky div.box-ip, sticky div.box-ip, sticky div.box-ip, sticky div.box-ip, sticky div.box-ip, sticky div.box-ip | made with: position: sticky

```css
.box-ip { position: sticky; top: 0; padding-top: 180px; margin-bottom: 270px }
.box-ip { margin-bottom: 450px }
.box-ip { margin-bottom: 400px }
.box-ip { margin-bottom: 400px }
```

### [🛝 Power Responsive scroll card](https://codepen.io/marcogargano/pen/eYgMazX)

on scroll: div.card: shadow | on hover of div.card: div.card: shadow ×2 | made with: scroll-snap · transition · :hover · backdrop-filter

```css
.intro strong { box-shadow: 0 4px 0px 0px greenyellow }
.container { border-top: solid 1px #ddd; border-bottom: solid 1px #ddd; scroll-snap-type: both mandatory }
.card { position: relative; background-position: 100% 90%; box-shadow: 0 0 0 1px lightgray; scroll-snap-align: start; transition: all 0.4s ease-in-out }
.card:hover { box-shadow: 0 0.4rem 2rem rgba(0, 0, 0, 0.2), inset 0 0 1px white; background-position: 100% 100% }
.card .copy { position: absolute; bottom: 0; top: auto; backdrop-filter: blur(4px) }
.card .copy .title { margin-bottom: 0 }
```

### [Sticky Header Tailwind](https://codepen.io/kuvinod5/pen/gOgvQQO)

held: fixed header.w-full | made with: scroll() timeline

### [Sticky sections](https://codepen.io/gzkdev/pen/dyNVQqY)

held: sticky div.feature-text-ctn, sticky div.feature-text-ctn, sticky div.feature-text-ctn, sticky div.feature-text-ctn, sticky footer.footer | on hover of a.home-cta: a.home-cta: background+color | made with: position: sticky · transition · :hover

```css
.home-cta { position: relative; transition: 300ms }
.carousel-ctrl-prev, .carousel-ctrl-next { transition: 300ms }
.footer { position: sticky; position: -webkit-sticky; bottom: 0 }
.feature-text-ctn { position: sticky; position: -webkit-sticky; top: 144px }
```

### [Inline Content CTA](https://codepen.io/gh-o-st/pen/XWpgMVg)

made with: position: sticky · @keyframes · transition · :hover · mix-blend-mode

```css
.yellow { padding-bottom: 2px; border-bottom: 2px solid #FFDC31 }
.cta { position: relative; top: 0; bottom: 0; transition: all 0.2s ease-out }
.cta:hover a > svg { transform: translateY(-50%) rotate(45deg) }
.cta > .formwrap { opacity: 0 }
.cta > .formwrap svg { position: absolute; top: 8px }
.cta > .formwrap > form > input[type=email] { transition: all 0.2s ease-out }
.cta > .formwrap > form > input[type=email]::placeholder { transition: all 0.2s ease-out }
.cta > .formwrap > form > button { transition: all 0.2s ease-out }
.cta > .formwrap > form > button:hover { transform: scale(1.05) }
.cta.open { position: sticky; bottom: 20px; top: 20px }
.cta.open::after { position: absolute; top: 0; transform: translate(90%, 0%); mix-blend-mode: overlay }
.cta.open > .formwrap { opacity: 1; animation: fadeIn 0.3s ease-out }
```

### [Stacking with "position: sticky"](https://codepen.io/fcasantos/pen/KKadwGN)

held: sticky div.box, sticky div.box, sticky div.box, sticky div.box, sticky div.box, sticky div.box, sticky div.box, sticky div.box, sticky div.box | made with: position: sticky · :hover

```css
.wrapper { position: relative; box-shadow: 0 0 0 0.0625em #789 }
h2 { margin-bottom: 0.8em }
p { margin-bottom: 1em }
.box-wrapper { position: relative }
.box-wrapper::after { position: absolute; top: 1em; text-transform: uppercase }
.box { position: sticky; top: 0 }
.box:not(:first-of-type) { box-shadow: -0.5em 0 0 0 #fae1dd }
.box > p { position: absolute; top: 0.5em }
```

### [Sticky elements](https://codepen.io/BlogFire/pen/wvoVJGq)

held: sticky div.sticky, sticky div.sticky, sticky div.sticky | made with: position: sticky

```css
.sticky { top: 1rem; box-shadow: 0 3px 9px -4px rgba(0 0 0 / 0.5); position: -webkit-sticky; position: sticky }
```

### [CSS sticky](https://codepen.io/UIUXLab/pen/NWbVZza)

held: sticky dt, sticky dt, sticky dt, sticky dt | made with: position: sticky

```css
dt { border-bottom: 1px solid #989EA4; border-top: 1px solid #717D85; position: -webkit-sticky; position: sticky; top: -1px }
dd + dd { border-top: 1px solid #CCC }
```

### [Sticky header with backdrop-filter](https://codepen.io/fahimaltinordu/pen/LYbvoZr)

held: sticky header | on hover of li.: a.: opacity | made with: position: sticky · :hover · backdrop-filter

```css
header { opacity:0.9; position:sticky; top:0; -webkit-backdrop-filter: blur(8px); -moz-backdrop-filter: blur(8px); backdrop-filter: blur(8px) }
.login ul li a, .menu ul li a { opacity:0.6 }
.login ul li a:hover, .menu ul li a:hover { opacity:1 }
.login ul li a#signup { opacity:initial }
main .firstpage { margin-top:40px; margin-bottom:40px }
main .firstpagebutton { margin-bottom:40px }
.toogle label { position: relative }
.toogle label span { position:absolute; top:50%; transform: translate(-50%, -50%) }
.toogle label span:before { position:absolute; top: calc((-1 * var(--space)) + var(--height)); transition-property: top, transform }
.toogle label span:after { position:absolute; top:calc(var(--space) - var(--height)); transition-property: top, transform }
input#hamburger:checked + .toogle label span:after { top:0; transform: rotate(-45deg) }
input#hamburger:checked + .toogle label span:before { top:0; transform: rotate(45deg) }
```

### [Position](https://codepen.io/Timmy0ne/pen/wvorxNK)

held: fixed div.box, sticky div.box | made with: position: sticky · position: fixed

```css
.parent-1 { position: fixed; bottom: 0 }
.parent-2 { position: relative; top: 50vh }
.parent-3 { position: absolute; top: 0 }
.parent-4 { position: sticky; position: -webkit-sticky; top: 1px }
```

### [Vertical Scroll Snap](https://codepen.io/fredericrous/pen/OJbjdQa)

made with: scroll-snap

```css
main { scroll-snap-type: y }
section { scroll-snap-align: start }
```

### [TailwindCSS 3 column layout template for docs](https://codepen.io/benroe/pen/gOLgozE)

held: sticky div.sticky, fixed button.fixed, sticky div.sticky, sticky div.sticky | made with: nothing recognised — read the code

### [Sticky Navigation](https://codepen.io/shane-clarke/pen/XWNjpGR)

held: sticky div.nav | made with: position: sticky · :hover

```css
.container { box-shadow: 0 0 5px #00f }
.page, #home-page, #about-page, #contact-page, #services-page { margin-top: 10px }
input[type="button"]:focus, input[type="button"]:hover { border-bottom: 8px double #00f }
.nav { position: -webkit-sticky; position: sticky; top: 0px; margin-top: 10px; box-shadow: 0 0 5px #00f, inset 0 0 7px #55f }
#header { position: relative; box-shadow: 0 0 5px #00f, inset 0 0 7px #55f }
.logo-box { box-shadow: 0 0 5px #00f, inset 0 0 10px #77f }
.logo { outline-offset: -10px }
.p { margin-top: 7px }
h4 { margin-top: -1px }
h1 { position: relative; top: -100px }
h2 { position: relative; top: -100px }
p { position: relative; top: 0px }
```

### [Sticky Intermezzo](https://codepen.io/clausgehrke/pen/abBZrdg)

held: sticky div.sticky__placeholder, sticky div.sticky__placeholder, sticky div.sticky__placeholder | made with: position: sticky · mix-blend-mode

```css
.sticky__sticker { top: 0; position: sticky }
.sticky__chapter-img-wrapper:not(:fist-child) { opacity: 0 }
.sticky__chapter-img { -o-object-position: 50% 100%; object-position: 50% 100% }
.sticky__chapter-text-wrapper:not(:fist-child) { opacity: 0 }
.top-1 { top: 20px }
.sticky__placeholder { position: sticky; top: 0 }
.sticky__placeholder:after { position: absolute; top: 0; transform: translate(0, 10px); mix-blend-mode: multiply }
.sticky__placeholder:before { top: 0; position: absolute; transform: translate(20px, 10px) }
.section__full { position: relative }
.section__full img { position: absolute; top: 0; -o-object-position: center; object-position: center }
```

### [Sticky Intermezzo V2](https://codepen.io/clausgehrke/pen/ExNyzPz)

held: sticky div.sticky__placeholder, sticky div.sticky__placeholder, sticky div.sticky__placeholder | made with: position: sticky · scroll-snap · mix-blend-mode

```css
.sticky__sticker { -ms-scroll-snap-type: y mandatory; scroll-snap-type: y mandatory }
.sticky__sticker { top: 0; position: sticky }
.sticky__chapter-img-wrapper:not(:fist-child) { opacity: 0 }
.sticky__chapter-img { -o-object-position: 50% 100%; object-position: 50% 100% }
.sticky__chapter-text-wrapper:not(:fist-child) { opacity: 0 }
.sticky__placeholder { scroll-snap-align: start }
.sticky__placeholder { position: sticky; top: 0 }
.sticky__placeholder:after { position: absolute; top: 0; transform: translate(0, 10px); mix-blend-mode: screen }
.sticky__placeholder:nth-of-type(2)::after { top: calc(2ex + 0.5em) }
.sticky__placeholder:nth-of-type(3)::after { top: calc(4ex + 1em) }
.sticky__placeholder:before { position: absolute; top: 0; transform: translate(20px, 10px) }
.section__full { position: relative }
```

### [CSS Position:Sticky; with top:0; and bottom:0;](https://codepen.io/elad2412/pen/ExNKLbr)

held: fixed input, fixed label, sticky h2, sticky div.sticky-item, sticky h2, sticky h2, sticky h2, sticky div.sticky-item, sticky h2, sticky h2 | made with: position: sticky · position: fixed

```css
.sticky-container { box-shadow: 0 1px 1px 0 rgba(66, 66, 66, 0.08), 0 1px 3px 1px rgba(66, 66, 66, 0.16) }
.content { position: relative }
.sticky-item { position: sticky; top: 0; bottom: 0 }
h2 { position: sticky; top: 0 }
p + p { margin-top: 20px }
input { position: fixed; top: 20px }
label { position: fixed; top: 10px }
:checked ~ .sticky-container { position: relative; box-shadow: 0 0 0 2px #000 }
:checked ~ .sticky-container > * { opacity: 0.8 }
```

### [Sticky + Fixed Layout](https://codepen.io/curtisj44/pen/abBvywz)

held: sticky header.appbar, fixed nav.sidebar__content | made with: position: sticky · position: fixed

```css
.appbar { position: sticky; top: 0 }
.sidebar { position: sticky; top: 0 }
.sidebar { position: static }
.sidebar__content { position: fixed; top: 82px }
.sidebar__content:after { bottom: 100px; position: absolute }
```

### [Apna College Challenge #04](https://codepen.io/rahulsahofficial/pen/GRNJGBb)

held: sticky nav | made with: position: sticky · transition · :hover

```css
.heroarea { background-position: center }
nav { position: sticky; top: 0 }
.eachcard { background-position: center!important }
.eachcard p { margin-bottom: 1rem }
footer .topline,footer .bottomline { margin-bottom: 1rem }
footer .bottomline { margin-bottom: 0 }
.sociallinks a i { transition: 0.2s }
.sociallinks a i:hover { transform: scale(1.3) }
.topline a { margin-bottom: 1rem }
.flinks { margin-bottom: 1rem }
```

### [Navbar bottomstart sticktop](https://codepen.io/jens180980/pen/rNWNMpy)

held: sticky nav | made with: position: sticky

```css
#menubar { position: sticky; top: 0 }
```

### [A Sticky Stack of Photos CSS only](https://codepen.io/BlogFire/pen/PoGMjaX)

held: sticky div.photos, sticky div.photos, sticky div.photos, sticky div.photos, sticky div.photos | made with: position: sticky

```css
.photos { margin-top: 18vh }
.photos { position: sticky }
.photos img { box-shadow: 0 0 40px 5px rgba(0, 0, 102, 0.5) }
.one { top: 8em; transform: rotate(-2deg) }
.two { top: 9em; transform: rotate(3deg) }
.three { top: 10em; transform: rotate(-5deg) }
.four { top: 11em; transform: rotate(5deg) }
.five { top: 12em; transform: rotate(-7deg) }
.wrapper { position: relative; padding-bottom: 120vh }
```

### [Bootstrap 5 - Sticky Navbar](https://codepen.io/skcals/pen/poEXqPw)

held: sticky nav.navbar | on hover of li.nav-item: a.nav-link: color | made with: nothing recognised — read the code

### [MM — Button magnet](https://codepen.io/lucasvallenet/pen/abmxzLo)

on scroll: span.c-btn__bg: transform+top, span.c-btn__ripple: transform+top, span.c-btn__inner: transform+color+top | on hover of a.c-btn: span.c-btn__bg: transform+top, span.c-btn__inner: transform+top | made with: transition · :hover · GSAP · pointer / mouse tracking

```css
*, *:after, *:before { position: relative }
.c-btn:hover .c-btn__ripple:after { opacity: 1 }
.c-btn__bg { position: absolute; top: 1px; bottom: 1px }
.c-btn__bg:before { position: absolute; top: 1px; bottom: 1px; transition: border-color 0.4s ease-out }
.c-btn__ripple { position: absolute; top: 50%; padding-top: 100%; margin-top: -50%; transform: scale(0); will-change: transform }
.c-btn__ripple:after { position: absolute; top: 0; transform: inherit; opacity: 0; transition: opacity 0.6s ease-out 0.3s }
.c-btn__inner { text-transform: uppercase; transition: color 0.4s ease-in-out }
.c-btn__hit { position: absolute; top: -1.5em; bottom: -1.5em }
```

```js
addEventListener('mouseenter', e => {
gsap.fromTo($btnRipple,
gsap.to($btnBg, {
addEventListener('mouseleave', e => {
gsap.to($btnInner, {
gsap.to($btnRipple, {
addEventListener('mousemove', e => {
```

### [Shrinking header on scroll without Javascript](https://codepen.io/havardob/pen/KKgEJep)

held: sticky header.header-outer, sticky div.header-inner | made with: position: sticky · transition · :hover

```css
body { position: relative }
.header-outer { position: sticky; top: calc( var(--header-height-difference) * -1 ); box-shadow: 0 2px 10px 0 rgba(0,0,0, 0.1) }
.header-inner { position: sticky; top: 0 }
.header-navigation a, .header-navigation button { position: relative }
.header-navigation a:hover:after, .header-navigation button:hover:after { transform: scalex(1) }
.header-navigation a:after, .header-navigation button:after { transition: 0.25s ease; transform: scalex(0); position: absolute; bottom: -2px }
.main { margin-top: 3rem }
.widget { box-shadow: 0 15px 30px 0 rgba(0,0,0, 0.1); margin-bottom: 2rem }
.widget > * + * { margin-top: 1.25em }
```

### [Sticky Navigation Bar](https://codepen.io/solygambas/pen/VwKqJmw)

held: fixed nav.nav | on scroll: a.: color+top ×4, nav.nav: background+shadow | on hover of a.: a.: color | made with: position: fixed · transition · :hover · scroll listener

```css
body { padding-bottom: 50px }
.nav { position: fixed; top: 0; transition: all 0.3s ease-in-out }
.nav .container { transition: all 0.3s ease-in-out }
.nav a { transition: all 0.3s ease-in-out }
.nav.active { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3) }
.hero { background-position: bottom center; position: relative; margin-bottom: 20px }
.hero::before { position: absolute; top: 0 }
```

```js
addEventListener("scroll", fixNav)
```

### [Sticky caption for sliders](https://codepen.io/seyedi/pen/XWjoyWP)

held: sticky h2.caption, sticky h2.caption, sticky h2.caption, sticky h2.caption, sticky h2.caption | made with: position: sticky

```css
.slide { position: relative }
.slide img { position: absolute; top: 0 }
.caption { position: sticky; text-transform: capitalize }
```

### [Sticky Footer with Sticky Position](https://codepen.io/seyedi/pen/jOMXegL)

held: sticky footer.footer | made with: position: sticky

```css
.footer { position: sticky; bottom: 0 }
.main { position: relative }
p { box-shadow: 0 1px 1px 0 hsla(0,0,0,.5) }
```

### [Squishy sticky rounded nav bar](https://codepen.io/branhillsdesign/pen/OJRQEpG)

made with: position: sticky · transition

```css
#navbar { box-shadow: --elevation-medium }
.sticky { position: sticky; top: 0; transition: all 0.2s ease }
```

### [Footer Sticks to the Bottom with CSS (Using Flex)](https://codepen.io/bbcpatra/pen/MWjOGBe)

made with: nothing recognised — read the code

```css
footer, header { text-transform: capitalize }
```

### [Swap sticky image on scroll](https://codepen.io/redone75/pen/ExgwPdE)

held: sticky div.locker__container, sticky div.threshold | on scroll: img.image: opacity+top | on hover of img.image: img.image: opacity | made with: position: sticky · position: fixed · transition · IntersectionObserver

```css
.threshold { position: sticky }
.threshold--top { top: 50% }
h1 { margin-bottom: 0 }
h3 { margin-bottom: 0 }
.image { opacity: 0; transition: all 0.5s ease }
.image.active { opacity: 1 }
.locker { outline-offset: -1px; position: relative }
.locker__image { position: relative }
.locker__image img { position: absolute; transition: all 1s ease }
.locker__container { position: sticky; position: -webkit-sticky; top: 0 }
.locker__section { border-top: 1px solid #cdcdcd }
#message { position: fixed; top: 20px }
```

```js
new IntersectionObserver(handleIntersection, options)
```

### [Social Media Buttons](https://codepen.io/swaldon/pen/zYKwEoY)

held: fixed a.xing, fixed a.linkedin, fixed a.facebook, fixed a.instagram, fixed a.twitter | made with: position: sticky · position: fixed

### [Sticky Notes](https://codepen.io/joshtpaul/pen/wvzdGER)

made with: :hover

```css
header { border-bottom: 1px solid white }
.note { transform: rotate(-10deg); box-shadow: 2px 2px 10px 1px black }
.noteHead { border-bottom: 1px solid black; margin-bottom: 1em }
```

### [Sticky Side](https://codepen.io/beljems/pen/xxERdJj)

made with: position: fixed · scroll listener

```css
.container { margin-top: 100px }
.side-sticky { position: relative }
.side-sticky-bar.is-fixed { position: fixed; top: 0 }
.side-sticky-bar.is-absolute { position: absolute; top: auto; bottom: 0 }
```

```js
addEventListener("scroll", () => {
```

### [CSS: Sticky Headers](https://codepen.io/anthonyhastings/pen/qBaazmz)

held: sticky div.card__header, sticky div.card__header, sticky div.card__header, sticky div.card__header, sticky div.card__header, sticky div.card__header, sticky div.card__header, sticky div.card__header, sticky div.card__header | made with: position: sticky

```css
.card { box-shadow: 4px 8px 8px 0 rgba(0, 0, 0, 0.2) }
.card:not(:last-of-type) { margin-bottom: 20px }
.card__header { position: sticky; top: 0 }
```

### [Position Sticky](https://codepen.io/deanleigh/pen/RwGGxgQ)

held: sticky header, sticky blockquote, sticky footer | made with: position: sticky

```css
header { position: sticky; top: 0px }
blockquote { position: sticky; top: 40px }
footer { position: sticky; bottom: 0 }
```

### [Responsive Table with Sticky Column](https://codepen.io/mgweb2020/pen/bGwEXwb)

on scroll: tr.: background | made with: position: sticky · :hover · clip-path

```css
td { border-bottom: 1px solid #ddd }
tr:last-child td { border-bottom: none }
td strong { margin-bottom: 10px }
.table-wrapper-sticky tr:first-child td { box-shadow: none }
.first-row { position: sticky; box-shadow: 0 0 5px rgba(0,0,0,0.8); clip-path: inset(0 -5px -5px -5px); top: 0 }
```

### [CSS Sticky Parallax Sections](https://codepen.io/hexagoncircle/pen/JjRYaZw)

held: sticky figure.image-container, sticky figure.image-container, sticky figure.image-container | made with: position: sticky · @keyframes · :hover · prefers-reduced-motion

```css
:root { --scale: 0.1 }
:root { --scale: 0 }
.page-title::after { opacity: 0; transform: translateY(-24px); -webkit-animation: fadein 800ms 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; animation: fadein 800ms 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards }
.section { transform-origin: center top; transform: scaleY(calc(1 - var(--scale))) }
.section > * { transform-origin: center top; transform: scaleY(calc(1 / (1 - var(--scale)))) }
.content { position: relative }
.content > * + * { margin-top: 2rem }
.image-container { position: sticky; top: 0 }
.image-container img { position: absolute; top: 0 }
.image-container::after { position: absolute; bottom: 0 }
to { opacity: 1; transform: translateY(0) }
to { opacity: 1; transform: translateY(0) }
```

### [Smart Sticky Vanilla Header Navigation](https://codepen.io/toomanyrequests/pen/qBaEOvv)

on hover of a.: a.: opacity+background | made with: position: fixed · transition · :hover · scroll listener

```css
.sticky { position: fixed !important; top: 0; transition: top 0.2s linear }
```

```js
addEventListener('scroll', update, { passive: true })
```

### [position](https://codepen.io/iusami/pen/XWjWjBW)

made with: nothing recognised — read the code

```css
.box1 { position: relative; bottom: 0 }
```

### [footerを底面に固定、sidebarを右上に固定](https://codepen.io/iusami/pen/rNMNMrB)

held: sticky nav | made with: position: sticky

```css
nav { position: sticky; top: 0 }
```

### [Demo of sticky and sticky-x](https://codepen.io/RichardNeill/pen/bGePxpO)

held: sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th | on hover of li.: tr.: background | made with: position: sticky

```css
table.sticky thead tr:nth-child(1) th { position: sticky; top: 0; box-shadow: 0 0 0 1px #ddd }
table.sticky-x tr td:nth-child(1) { position: sticky; box-shadow: 0px 0px 0px 1px #ddd, 2px 0px 0px 0px #444 }
table.sticky-x tr th:nth-child(1) { position: sticky; box-shadow: 0px 0px 0px 1px #ddd, 2px 0px 0px 0px #444 }
table.sticky-x thead tr th:nth-child(1) { position: sticky; top: 0; box-shadow: 0 0 0 1px #ddd }
```

### [Sticky header + slides](https://codepen.io/martijndevalk/pen/abZPbwG)

held: sticky div.ContentSlider-heading, sticky article.ContentSlider-slide, sticky article.ContentSlider-slide, sticky article.ContentSlider-slide, sticky article.ContentSlider-slide, sticky article.ContentSlider-slide | on hover of div.ContentCard: div.ContentCard: transform+opacity+top | made with: position: sticky · GSAP

```css
.ContentSlider { position: relative }
.ContentSlider > .ContentSlider-header { position: absolute; top: 0; bottom: 50vh }
.ContentSlider > .ContentSlider-slide { top: 0 }
.ContentSlider-slide { position: sticky }
.ContentSlider-header > .ContentSlider-heading { top: 0 }
.ContentSlider-heading { position: sticky; padding-bottom: 25vh }
.ContentCard-content > :not(:last-child) { margin-bottom: 10px }
.ContentCard-content > :not(:last-child) { margin-bottom: 18px }
.ContentCard-image { -o-object-position: top center; object-position: top center }
```

```js
gsap.to(card, {
scrollTrigger: { trigger: slide, start: "60% top", scrub: 1 }
```

### [Sticky Button - Bottom](https://codepen.io/jr/pen/XWKyaRw)

held: sticky div.sticky | made with: position: sticky

```css
.sticky { bottom: 0; position: sticky }
```

### [Sticky panels CSS (Panels snapping test)](https://codepen.io/flown/pen/Exydpyp)

made with: scroll-snap

```css
#container { scroll-snap-type: y mandatory }
.child { scroll-snap-align: start }
```

### [CSS Grid with sticky element and full-bleed elements, ver 2](https://codepen.io/CiTA/pen/dyXePPj)

held: sticky div.box | made with: position: sticky

```css
.box { padding-top: 10vmin; padding-bottom: 10vmin }
.box--sticky { position: sticky; top: 0 }
```

### [Footer sticks to bottom with position sticky](https://codepen.io/BlogFire/pen/zYBWObv)

held: sticky footer | made with: position: sticky

```css
footer { position: sticky; top: 100% }
p img { margin-bottom: 20px }
```

### [Grid: sticky header - footer 2 column](https://codepen.io/eddym/pen/wvWdYZe)

made with: nothing recognised — read the code

### [Parallax Grid Layout](https://codepen.io/localnerve/pen/PozpVQW)

held: sticky div, sticky header | made with: position: sticky · position: fixed · scroll-snap · 3D (perspective / preserve-3d) · IntersectionObserver

```css
[role=toolbar] { position: sticky; top: 0 }
[role=banner] { position: sticky; top: calc(-1 * ((2em * 1.15 + (2 * 21.44px)) - 68.16px)) }
.scrollsnap-container { -ms-scroll-snap-type: y proximity; scroll-snap-type: y proximity; scroll-padding-top: 136.32px }
.scrollsnap-container > * { scroll-snap-align: none }
.scrollsnap-container .parallax-item ~ .parallax-item.std { scroll-snap-align: start }
.scrollsnap-container .parallax-item ~ .parallax-item.std { scroll-snap-align: end }
.scrollsnap-container .parallax-item ~ .parallax-item.std { scroll-snap-align: none }
.scrollsnap-container .parallax-item.std:nth-child(4) { scroll-snap-align: start }
.scrollsnap-container .parallax-item.std:nth-child(4) { scroll-snap-align: none }
.parallax-container { position: relative; perspective: 10px }
.parallax-item.std { transform: translateZ(0) scale(1) }
.parallax-item.sub { transform: translateZ(-2px) scale(1.2) }
```

```js
new IntersectionObserver(entries => {
```

### [Dynamic Sticky Sidebar Component](https://codepen.io/hexagoncircle/pen/oNLZmvV)

held: sticky aside.sidebar | made with: position: sticky · clip-path

```css
.sidebar { --offset: var(--space); position: sticky; top: var(--offset) }
.visually-hidden { -webkit-clip-path: inset(50%); clip-path: inset(50%); position: absolute }
main { margin-bottom: calc(var(--space-md) * -1) }
main > * { margin-bottom: var(--space-md) }
article > * + * { margin-top: var(--space) }
.component { position: relative; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.04), 0 4px 8px rgba(0, 0, 0, 0.03), 0 8px 16px rgba(0, 0, 0, 0.03), 0 16px 32px rgba(0, 0, 0, 0.02), 0 32px 64px rgba(0, 0, 0, 0.02 }
.component .header { border-bottom: inherit }
.component .footer { border-top: inherit }
.item { position: relative }
.item:active { transform: translateY(1px) }
.title { margin-bottom: var(--space-xs) }
.grid .thumbnail { margin-bottom: var(--space) }
```

### [Sticky Navbar w/SCSS](https://codepen.io/codedbyEmre/pen/gOMmPxV)

held: fixed nav.navbar | on scroll: nav.navbar: background | made with: position: fixed · transition · :hover · scroll listener

```css
.header .navbar { position: fixed }
.header .navbar .logo { text-transform: uppercase }
.header .navbar .nav-links { transition: 0.3s ease all }
.header .navbar .nav-links li a { position: relative }
.header .navbar .nav-links li a::after { position: absolute; bottom: -4px }
.header .navbar .nav-links li a:hover::after { transition: 0.3s ease all }
.header .navbar .nav-links.nav-active { transform: translateX(0%) }
.header .hamburger-menu div { transition: 0.3s ease all }
.header .navbar.sticky { transition: 0.3s ease all }
.header .navbar.sticky .logo { transition: 0.3s ease all }
.header .navbar.sticky .nav-links { transition: 0.3s ease all }
.header .navbar.sticky .hamburger-menu { transition: 0.3s ease all }
```

```js
addEventListener('scroll', () => {
```

### [Scroll Sticky](https://codepen.io/clausgehrke/pen/bGeEXbL)

held: sticky img, sticky h1, sticky img, sticky h1 | made with: position: sticky · transition

```css
section.full { position: relative }
section.full::before, section.full::after { opacity: 0; transition: opacity 500ms ease }
section.full::before, section.full::after { opacity: 1; position: absolute; top: 0 }
section.sticky img { position: sticky; top: 0 }
section.sticky h1 { position: sticky; top: 20vh }
```

### [Sticky position CSS](https://codepen.io/marcogargano/pen/OJXMYaP)

held: sticky ul | made with: position: sticky · transition · :hover

```css
html, body { position: relative }
hr { border-top: solid 1px white }
#🧲 { position: relative }
#🧲 #bar { position: -webkit-sticky; position: sticky; bottom: 0; top: 30px; box-shadow: 0px 30px 0px lightcoral }
#🧲 #bar li a { transition: all 0.4s ease-out }
```

### [Sticky Balls](https://codepen.io/quij_drk/pen/gOMYVGp)

made with: :hover · canvas 2D · requestAnimationFrame

```css
canvas { position: absolute; top : 0%; transform: translateX(-50%) }
```

```js
requestAnimationFrame(anim)
```

### [Fixed / Sticky](https://codepen.io/verdepassion/pen/xxVayGG)

held: fixed div.box, sticky div.box | made with: position: sticky · position: fixed

```css
.fixed { position: fixed; top: 25px }
.sticky { position: sticky; top: 25px }
```

### [Horizontal Scroll Calendar](https://codepen.io/mtsgeneroso/pen/LYNBxra)

made with: scroll listener

```css
.c-timeline__month { position: relative }
.c-timeline__day { border-top: 1px solid #00000010 }
```

```js
addEventListener('scroll', ev => {
```

### [scroll text over image](https://codepen.io/greg_h/pen/oNxpVdW)

held: sticky div.img, sticky div.img | on scroll: div.img: opacity+top | made with: position: sticky · scroll listener · requestAnimationFrame

```css
.img { position: sticky; background-position: center; top: 0 }
.legend { position: relative }
.legend p { margin-bottom: 1em }
```

```js
addEventListener('scroll', function(e) {
requestAnimationFrame(function() {
```

### [Hero Section - scroll stick and stay](https://codepen.io/jaredkc/pen/YzqrOJP)

held: sticky div.hero__sticky | made with: position: sticky · transition · :hover

```css
.hero { padding-top: 140px; position: relative; transition: padding 0.5s ease-out }
.hero__link { position: absolute; inset: 0 }
.hero__foreground { bottom: 0; position: absolute }
.hero__sticky { position: absolute; top: 0 }
.hero__content { transition: all 0.5s ease-out }
.hero:hover .hero__content { transform: scale(1.05) }
.sr-only { position: absolute }
.hero { padding-top: 80px }
.hero { padding-top: 50px }
.hero { padding-top: 0 }
.hero__sticky { position: sticky }
.layer { position: relative }
```

### [sticky/scroll-padding-top bug](https://codepen.io/dennisandersson/pen/poyrMbW)

held: sticky header | made with: position: sticky

```css
header { position: sticky }
html { scroll-padding-top: 75px }
header { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); top: 0 }
div { margin-top: 2rem; margin-bottom: 2rem }
```

### [actionable data tables with row selection, stripe colouring by select, and a sticky header row & column](https://codepen.io/vfowler/pen/rNezpEg)

held: fixed div, sticky th, sticky th, sticky th.year, sticky th, sticky th, sticky th.value, sticky th, sticky th, sticky th | made with: position: sticky · position: fixed

```css
#detailedViewContextualTabs { border-bottom: 1px solid var(--color-Mercury, currentcolor) }
table { border-top: none; margin-top: 5em }
th, td { vertical-align: text-top }
th { vertical-align: bottom }
#appBar { position: fixed; top: 0 }
th { position: sticky; top: 5em }
th[scope="row"] { position: sticky }
th[scope="row"] { vertical-align: top }
.select { position: relative }
.select:after { position: absolute; top: 50%; margin-top: -0.15rem; border-top: 0.35rem solid; border-bottom: 0.35rem solid transparent }
.select select:focus { box-shadow: 0 0 0 0.075rem #fff, 0 0 0 0.2rem #0074d9 }
.control { position: relative }
```

### [Tailwind CSS Sticky Blog Card Block - 14th](https://codepen.io/componentity/pen/JjXbzzK)

held: sticky div.sticky | made with: nothing recognised — read the code

### [¡CSSPosition-Training!](https://codepen.io/albertoalejandro10/pen/ExKNZRV)

held: sticky p.sticky, fixed div.fixedPro | made with: position: sticky · position: fixed

```css
.section { position: relative }
p span { position: relative; bottom: 0px }
.Box { position: absolute; bottom: 0 }
.BoxThree { position: relative }
.One { position: absolute; bottom: 0 }
.Two { position: absolute }
.fixedPro { position: fixed; bottom: 20px }
.sticky { position: sticky; top: 0 }
```

### [Sticky footer](https://codepen.io/SunilSalaria/pen/OJNXBEx)

made with: nothing recognised — read the code

```css
footer { margin-top: auto }
```

### [Simple Shrinking Sticky Header (Vanilla JavaScript)](https://codepen.io/gregrickaby/pen/vYGYKax)

held: sticky div.site-header | made with: position: sticky · transition · scroll listener

```css
.site-header { position: sticky; top: 0; transition: padding 0.2s ease-in-out }
.site-header { margin-bottom: 56px }
```

```js
addEventListener('scroll', function () {
```

### [Responsive Sticky Table](https://codepen.io/timmulch/pen/JjXPvxL)

held: sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th | made with: position: sticky

```css
.content-table tbody tr { border-bottom: 1px solid #F2F2F2 }
.content-table thead tr th { position:sticky; top: 0; text-transform: uppercase; border-bottom: 1px solid #F2F2F2 }
.content-table thead tr th:nth-child(1) { position:sticky; top: 0 }
.content-table tbody tr td:nth-child(1) { position:sticky; top: 0 }
```

### [Note With Auto Resize](https://codepen.io/mikolaj_dobisz/pen/xxVKbEr)

made with: nothing recognised — read the code

```css
div { position: relative }
.card { box-shadow: 0px 0px 8px -3px rgba(0, 0, 0, 0.75), 0px 17px 22px -16px rgba(0, 0, 0, 0.75) }
.card .title > textarea { text-transform: uppercase }
```

### [Sticky Table Column in CSS3](https://codepen.io/dropinks/pen/Bajewxx)

held: sticky div.tableCol, sticky div.tableCol, sticky div.tableCol, sticky div.tableCol, sticky div.tableCol, sticky div.tableCol, sticky div.tableCol, sticky div.tableCol, sticky div.tableCol, sticky div.tableCol | made with: position: sticky · position: fixed

```css
.createdBy { margin-top: 10px }
.message { box-shadow: 2px 2px 0px 1px rgba(0,0,0,0.2) }
.footer { position: fixed; bottom: 0; top: auto; border-top: 1px solid rgba(0,0,0,0.5); transform: translate(0); border-top: 1px solid #bfc7e4 }
.demoContainer { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.tableCol { border-bottom: 1px solid #585858; position: relative }
.tableHeader .tableCol { position: sticky; top: 0px }
.tableCol:nth-child(2) { position: sticky }
.tableHeader .tableCol:nth-child(2):after { position: absolute; top: 45px; transform: translate(-50%, -50%) }
```

### [sticky header and footer on mobile side bar on desktop responsive](https://codepen.io/korhaneser/pen/vYLPaJP)

held: sticky div.mobilecontrol | made with: position: sticky

```css
.container { position: relative }
.mobilecontrol { position: sticky }
```

### [Position Properties](https://codepen.io/29bucuk/pen/jOWdQda)

made with: :hover

```css
.child-1 { margin-top: 1em }
.child-2 { border-top:none }
.child-3 { border-top:none }
.child-4 { border-top:none }
p { padding-top:20px }
```

### [Sticky navbar1](https://codepen.io/vynter/pen/ZEQwGOW)

held: sticky nav | made with: position: sticky

```css
nav { border-top: 1px solid rgba(255, 255, 255, 0.2); border-bottom: 1px solid rgba(255, 255, 255, 0.2); position: -webkit-sticky; position: sticky; top: 0px }
nav ul li a { text-transform: uppercase }
```

### [Social Media Buttons](https://codepen.io/swaldon/pen/QWyzvyW)

held: fixed div.scl-btn | on hover of div.scl-btn: button.button-08: background | made with: position: sticky · position: fixed · :hover

### [Sticky Boxes & Accordion Grid](https://codepen.io/simeydotme/pen/qBbMxEL)

held: sticky nav, sticky section.archives | made with: position: sticky

```css
nav { position: sticky; top: 5px }
.archives { position: sticky; top: 5px }
```

### [Sticky bottom drawer with subtle shadow](https://codepen.io/aepicos/pen/pogZadZ)

held: fixed input, sticky div.sticky-drawer | made with: position: sticky · position: fixed · transition · scroll listener

```css
.sticky-drawer { position: sticky; bottom: 0; bottom: env(safe-area-inset-bottom) }
.sticky-drawer .content { border-top: 1px solid silver }
.sticky-drawer .content::after { position: absolute; top: 0; box-shadow: 0 -0.25rem 1rem 0 rgba(0, 0, 0, 0.2) }
.sticky-drawer.-is-inline .content::after { opacity: 0 }
article * { margin-top: 2rem }
.sticky-drawer .content { padding-top: 2rem; padding-bottom: 2rem }
footer { padding-top: 2rem; padding-bottom: 2rem }
#toggle-opacity { position: fixed; top: -1000px }
.sticky-drawer .content { transition: background-color 1200ms ease-in-out }
```

```js
addEventListener('scroll', function(e) {
```

### [Grid - Sticky Footer](https://codepen.io/marcobiedermann/pen/NWxzpad)

made with: nothing recognised — read the code

### [Sticky Nav](https://codepen.io/FolusoJr/pen/JjGLboK)

made with: transition · 3D (perspective / preserve-3d)

```css
.nav-section { margin-top:5px; position:relative; perspective:800 }
.nav-list li { position:relative }
.drop-content { position:absolute; top:-20px; transition:all 0.5s; transform: translateY(100px); will-change:opacity; opacity:0 }
.effect-active .drop-content { opacity:1 }
```

### [Amazing Loading](https://codepen.io/hossein_ghanbari/pen/QWyQPBV)

held: fixed div.wrapper | on scroll: div.c-item: transform+top ×4 | made with: position: fixed · @keyframes

```css
.wrapper { filter: contrast(80); position: fixed; top: 0; bottom: 0 }
.c-item { filter: blur(30px); transform: scale(1) translateX(0); animation-name: load; animation-duration: 1.1s; animation-iteration-count: infinite }
.c1 { animation-delay: 0.1s }
.c2 { animation-delay: 0.3s }
.c3 { animation-delay: 0.5s }
.c4 { animation-delay: 0.7s }
0% { transform: scale(1) translateX(60px) }
50% { transform: scale(1.2) translateX(-60px) }
100% { transform: scale(1) translateX(60px) }
.c-item { filter: blur(10px) }
0% { transform: scale(1) translateX(30px) }
50% { transform: scale(1.2) translateX(-30px) }
```

### [Responsive navbar css-only sticky top](https://codepen.io/MKAbuMattar/pen/qBbxpZB)

held: sticky nav.sticky | made with: position: sticky · position: fixed · transition · :hover

```css
.header, .home, .about, .portfolio, .contact, .footer { position: relative }
.header h1, .home h1, .about h1, .portfolio h1, .contact h1, .footer h1 { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.navbar { padding-top: .5em; padding-bottom: .5em; -webkit-box-shadow: 0 14px 14px -14px rgba(0, 0, 0, .75); -moz-box-shadow: 0 14px 14px -14px rgba(0, 0, 0, .75); box-shadow: 0 14px 14px -14px rgba(0, 0, 0, .75) }
.sticky { position: -webkit-sticky; position: sticky; top: 0 }
.display__logo { margin-bottom: .5rem }
.logo { padding-top: .3125rem; padding-bottom: .3125rem }
.logo::before { vertical-align: top }
.nav__items { margin-top: 5px }
.nav { position: fixed; top: 0; opacity: 0; transition: all 0.2s ease }
.nav .nav__items { position: absolute; top: 50%; transform: translateY(-50%) }
.nav .nav__items .nav__item { margin-bottom: 10px }
.nav .nav__items .nav__item .nav__link { opacity: 0; transform: translateY(-20px); transition: all 0.2s ease }
```

### [Sticky content](https://codepen.io/legionista1994/pen/abdEdqZ)

held: sticky dt, sticky dt, sticky dt, sticky dt | made with: position: sticky

```css
dt { position: sticky; position: -webkit-sticky; top: 0 }
```

### [CSS Technical Demo: Sticky Positioning, Vertical Text & Smooth Scrolling](https://codepen.io/jamesneufeld/pen/VwerMrg)

held: sticky aside | made with: position: sticky · transition · :hover

```css
a { transition: color 0.2s ease }
h1 { margin-bottom: 0.5rem }
h2 { margin-bottom: 0.5rem }
p { margin-bottom: 0.5rem }
aside { position: sticky; top: 5vh }
```

### [Floating Sidebar Prototype (Desktop)](https://codepen.io/marklchaves/pen/rNxzQbx)

held: sticky aside.sidebar | on hover of a.btn: a.btn: background+color | made with: position: sticky · :hover

```css
#showcase .bg-image { position: absolute; background-position: center; opacity: 0.4 }
#showcase h1 { padding-top: 100px; padding-bottom: 0 }
#section-a { padding-bottom: 2em }
#section-b li { margin-bottom: 1em }
.sidebar--floating { position: sticky; top: 0; transform: translate(-5%, 0) }
section:first-of-type { margin-top: calc(0rem - var(--sidebar-height)) }
.sidebar--menu > li { border-bottom: 1px solid }
.sidebar--menu > li:last-child { border-bottom: none }
#main-footer a { border-bottom: 2px solid }
#main-footer a:hover { opacity: 0.7 }
#section-a .content-text p { padding-top: 0 }
```

### [Sticky Navigation Bar On Scroll Using Javascript](https://codepen.io/fadzrinmadu/pen/rNxzzBL)

held: fixed header | on scroll: a.: color+top ×6, a.logo: color+top | on hover of a.logo: header.: background, a.logo: color | made with: position: fixed · transition · scroll listener

```css
header { position: fixed; top: 0; transition: 0.6s }
header .logo { position: relative; text-transform: uppercase; transition: 0.6s }
header ul { position: relative }
header ul li { position: relative }
header ul li a { position: relative }
```

```js
addEventListener('scroll', function() {
```

### [Sticky](https://codepen.io/dieennn/pen/xxZqbMK)

held: sticky div.item, sticky div.item, sticky div.item | made with: position: sticky

```css
.pirate { position: -webkit-sticky; position: sticky; top: 4rem }
.police { position: -webkit-sticky; position: sticky; top: 0 }
.doctor { position: -webkit-sticky; position: sticky; bottom: 1rem }
```

### [Pretty Sticky](https://codepen.io/BurmesePotato/pen/qBbqpNB)

held: sticky div.episode__number, sticky div.episode__number, sticky div.episode__number, sticky div.episode__number | made with: position: sticky · transition

```css
.episode { position: relative }
.episode__number { position: sticky; top: 0; transition: all 0.2s ease-in }
.episode__content { border-top: 2px solid #fff }
```

### [table scroll body](https://codepen.io/manishKS/pen/WNrbqbB)

made with: nothing recognised — read the code

### [Card Scroll](https://codepen.io/ross-a-swanon/pen/WNQVQoO)

held: sticky article.section | made with: position: sticky · scroll listener

```css
.stick-to-top { position: sticky; top: 0 }
```

```js
addEventListener('scroll', () => {
```

### [Page progress indicator with sticky pagination](https://codepen.io/nico_sh/pen/dyYELPW)

held: fixed div, sticky span, sticky span, sticky span, sticky span, sticky span, sticky span, sticky span, sticky span | on scroll: span.: opacity+top ×2 | made with: position: sticky · position: fixed · transition · scroll listener

```css
section { position: relative }
section span { position: sticky; top:1rem; opacity:0.2; transition: all 0.3s ease-in-out }
section.active span { opacity:1 }
#progressbar { position:fixed; top:0; bottom:0 }
#fill { position:relative }
#progressbar span { position:absolute; transform: translateY(-0.5rem); transition: all 0.3s ease-in-out }
```

```js
addEventListener('scroll', whereAt)
```

### [Fully Responsive Markup Layout](https://codepen.io/Gravy17/pen/RwWdBoL)

held: sticky header | made with: position: sticky · @keyframes · transition · :hover · IntersectionObserver · scroll listener

```css
img { box-shadow: 0 0.5em 2em 0 black }
header { box-shadow: 0 0.5em 2em 0 black; position: sticky; transition: top 200ms ease-out 0ms }
button { transition: opacity 0.3s ease }
button:hover, button:focus { opacity: 0.7; transition: opacity 0.3s ease }
.scroll-down header { top: -100% }
.scroll-up header { top: 0 }
.relative-container { top: 0; bottom: 0; position: relative }
.logo { box-shadow: unset; opacity: 0.9 }
.nav-toggle:checked ~ .nav { transform: translate(0, 0); opacity: 1; transition: transform 0.2s linear, opacity 0.4s ease-in 0.2s }
.nav { transform: translate(0, -100%); transform-origin: top; opacity: 0; position: absolute; top: 100%; box-shadow: 0 10px 20px -10px black; transition: opacity 0.3s ease-out, transform 0.2s linear 0.3s }
.nav-toggle-label { position: absolute; top: 0; box-shadow: 0 0.5em 1em -0.5em black }
.nav-toggle-label span::before, .nav-toggle-label span::after { position: absolute }
```

```js
new IntersectionObserver(lazyLoad, {
addEventListener("scroll", function () {
```

### [CSS sticky](https://codepen.io/VladimirVaize/pen/MWaPLxe)

held: sticky span, sticky span, sticky span, sticky span, sticky span, sticky span, sticky span, sticky span, sticky span, sticky span | made with: position: sticky

```css
section { text-transform: uppercase }
.container { position: relative }
.container span { position: sticky; top: 0; margin-top: calc(100vh * var(--i)) }
h2 { position: relative }
h2 span { position: sticky; top: 0; margin-top: calc(100vh * var(--i)) }
```

### [sticky position](https://codepen.io/nmekinci/pen/abvROaV)

held: sticky div, sticky div | made with: position: sticky

```css
#sticky1 { position: sticky; top: 20px }
#sticky2 { position: sticky; top: 20px }
```

### [Sticky Header](https://codepen.io/benslimaneashraf/pen/abvGJqE)

held: fixed div.navbar | on scroll: div.navbar: transform+top | made with: position: fixed · transition · scroll listener

```css
body { position: relative }
.navbar { position: fixed; top: 0; transition: transform 0.4s }
.header { position: relative }
.sub-header { box-shadow: 0px 2px 8px #aec0da4f }
.scroll-down .navbar { transform: translate3d(0, -50%, 0) }
.scroll-up .navbar { transform: none }
.page-main { margin-top: 40px; padding-top: 40px; padding-bottom: 80px }
```

```js
addEventListener('scroll', () => {
```

### [Sticky Menu](https://codepen.io/hungpv-2151/pen/MWaGgyQ)

made with: position: fixed · transition

```css
.sticky { top: 0; position: fixed; transition: all 1s }
```

### [sticky css resume](https://codepen.io/vikramsoni/pen/ZEbXVGj)

held: sticky section.intro, sticky h1.section__head, sticky h1.section__head, sticky h1.section__head, sticky h1.section__head, sticky h1.section__head | made with: position: sticky

```css
.intro__title { text-transform: uppercase }
.section__head { text-transform: uppercase }
.section__subhead { padding-bottom: 10px }
.section p { padding-bottom: 15px }
.section__head { position: -webkit-sticky; position: sticky; top: 0 }
.section__head::after { position: absolute; bottom: 2px }
header { background-position: center }
.intro__title { text-transform: uppercase }
.section__head { top: 10px }
.section--primary { margin-top: 30px }
header { position: relative }
header .intro { position: -webkit-sticky; position: sticky; top: 2em }
```

### [Horizontal scroll with sticky headers](https://codepen.io/gibatronic/pen/yLYzBze)

held: fixed h1.header | made with: position: fixed · custom properties driven by JS · requestAnimationFrame

```css
.block { box-shadow: 0px 8px 24px rgba(13, 13, 18, 0.04) }
.blocks { position: relative }
.header { --offset: 0; position: absolute; transform: translate3d(0, 0, 0) translate(calc(var(--offset) * 1px), -100%) }
.header--fixed { position: fixed }
.scroller { position: relative }
.wrapper { transform: translateZ(0) }
```

```js
style.setProperty('--offset', -this.elements.base.offsetLeft)
style.setProperty('--offset', this.elements.base.clientWidth - this.elements.header.clientWidth)
requestAnimationFrame(() => this.watch())
```

### [Sticky Header Using Intersection Observer](https://codepen.io/colinlord/pen/vYNZVKV)

held: fixed div.sticky-header | on scroll: div.sticky-header: transform+top | made with: position: fixed · transition · :hover · IntersectionObserver

```css
p { margin-top: 0 }
a { transition: 0.2s all }
.content { margin-top: 30px; box-shadow: 0 0 0px 4px rgba(0, 0, 0, 0.05) }
button { text-transform: none; position: relative; border-bottom: 5px solid #630e1a }
.sticky-header { position: fixed; border-bottom: 2px solid white; top: 0; transform: translateY(-200%); transition: all 0.5s }
.sticky-header.visible { transform: none }
```

```js
new IntersectionObserver(obCallback)
```

### [Fixed Bar Bottom](https://codepen.io/albo/pen/BaoRMrj)

held: fixed div.bottomFixedBar | made with: position: fixed

```css
.contents { margin-bottom: 140px }
.num { position: relative; top: 6px }
.bottomFixedBar { position: fixed; bottom: 0 }
```

### [Sticky inside elements.](https://codepen.io/muaperez/pen/xxwdpwE)

held: sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th | made with: position: sticky

```css
header, thead th { position: sticky; top: 0 }
tbody th { position: sticky }
```

### [Stycky navigations](https://codepen.io/muaperez/pen/qBOmVXd)

held: sticky nav, sticky nav | made with: position: sticky

```css
nav { position: sticky; top: 0; box-shadow: 0 0 8px black inset }
footer { box-shadow: 0 0 8px black }
```

### [Sticky Header Hide/follow + Lazy load + Waypoints on sections](https://codepen.io/laricoDev/pen/JjYWPeP)

held: fixed header.hdr | on scroll: img.lazy-load: opacity+top ×5, header.hdr: transform+top | on hover of img.lazy-load: img.lazy-load: opacity ×3 | made with: position: fixed · transition

```css
body { padding-top: 100px }
.hdr { position: fixed; top: 0; transition: transform 400ms cubic-bezier(0.25, 0.37, 0.17, 0.96) }
.hdr[data-scroll=out] { transform: translatey(-100%) }
[data-scroll-dir-y="-1"] .hdr { transform: translatey(0) }
.lazy-load { opacity: 0; transition: all 0.5s ease-out }
.lazy-load[data-scroll=in] { opacity: 1 }
section { transition: all 0.5s ease-out; margin-bottom: 30px }
section[data-scroll] { opacity: 0 }
section[data-scroll=in] { opacity: 1 }
```

### [sticky background on scroll](https://codepen.io/eroinbob84/pen/WNQGqbW)

made with: position: fixed · transition

```css
.canvasSticky { position: relative }
.canvasSticky--noScroll .canvasSticky__text { position: absolute; top: 50%; transform: translateY(-50%) }
.canvasStiky__fixed { position: absolute; top: 0 }
.canvasStiky__fixed.isSticky { position: fixed }
.canvasStiky__fixed.anchorBottom { top: auto; bottom: 0 }
.canvasSticky_gradient { position: absolute; top: 0; bottom: 0 }
.canvasSticky_gradient.isSticky { position: fixed }
.canvasSticky_gradient.anchorBottom { top: auto }
.canvasSticky__image { transition: all 0.3s cubic-bezier(0.09, 0.72, 0.76, 1.01); will-change: transform }
.canvasSticky__image { object-position: center }
.canvasSticky__content { position: relative }
.canvasSticky__tag { margin-bottom: 24px }
```

### [Website Template](https://codepen.io/theSujoySarkar/pen/GRpjgVm)

held: fixed nav.navbar | made with: nothing recognised — read the code

```css
body { background-position: 10% }
.cardCSS { margin-top: 30%; margin-bottom: -10% }
.jumboCSS { margin-top: 15% }
.hiddenElements { margin-top: 15% }
.contactUsCSS { margin-top: 25% }
```

### [Sticky Footer](https://codepen.io/nicolasjustin/pen/oNjLRzz)

held: sticky header, sticky footer | made with: position: sticky

```css
header, footer { position: sticky }
header { top: 0 }
footer { bottom: 0 }
main { border-bottom: 2px solid #f00; border-top: 2px solid #f00 }
```

### [css-tailwind-sticky-header-footer-regex-filtering-css-grid](https://codepen.io/olejorgensen/pen/LYpYdKO)

on hover of button.btn: button.btn: background+color, div.flex: color, svg.[object: color, path.[object: color, div.ml-2: color | made with: nothing recognised — read the code

```css
.status { border-top: 1px solid #a0aec0 }
.status-with-error { border-top: 1px solid #a0aec0 }
```

### [Onepage Navigation with Sticky Header](https://codepen.io/havutcuoglu/pen/bGdQLjY)

held: fixed nav.mod_navigation | on scroll: li.sibling: background+top ×3, a.sibling: color+top ×3, span.: color+top ×3 | made with: position: fixed · scroll() timeline · transition · :hover · Web Animations API (.animate)

```css
.clone-dolly { position: fixed; top: -60px; transition: top 300ms ease }
.clone-dolly.active { top: 0; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3) }
.article { border-top: 1px solid #CCC; border-bottom: 1px solid #EEE }
```

```js
.animate({ scrollTop: anchor.offset().top - offsetTop }, 500)
```

### [divi onscrollup sticky / fixed](https://codepen.io/pixeline/pen/poJxqde)

on scroll: div.row2: transform+top | made with: position: fixed · scroll() timeline · transition

```css
.sticky { will-change: transform; transition: transform 200ms linear }
.sticky--visible { position: fixed !important; top: 0; transform: translateY(0%) }
.sticky--hidden { transform: translateY(-100%); position: relative !important }
```

### [Position sticky overlapping sections.](https://codepen.io/brumgb/pen/GRJBeNP)

held: sticky section, sticky section, sticky section, sticky section | made with: position: sticky

```css
section { position: sticky; position: -webkit-sticky; top: 0 }
```

### [Tricky Sticky](https://codepen.io/RMKNGY/pen/RwPBwJz)

held: sticky section.poster_container, sticky section.poster_container, sticky section.poster_container, sticky section.poster_container, sticky section.poster_container, sticky section.poster_container, sticky section.poster_container, sticky section.poster_container, sticky section.poster_container, sticky section.poster_container | made with: position: sticky

```css
.content { padding-top: 10vh }
.sticky_bound { position: relative }
.poster_container { position: sticky; bottom: 10vh; margin-bottom: 10vh }
```

### [Sticky Vanilla JS](https://codepen.io/adrienloup/pen/mdJpEeW)

on scroll: div.sticky: background+top | made with: scroll listener

```js
addEventListener('scroll', this.onScroll, false)
```

### [Horizontal scroll with CSS (Chrome only)](https://codepen.io/Azametzin/pen/MWwOQOB)

held: sticky div.item, sticky div.item, sticky div.item, sticky div.item, sticky div.item, sticky div.item | made with: position: sticky · scroll-snap · scroll listener

```css
.container { bottom: 0; position: absolute; top: 0 }
.horScroll { position: absolute; -ms-scroll-snap-type: mandatory; scroll-snap-type: mandatory; -ms-scroll-snap-points-y: repeat(100vw); scroll-snap-points-y: repeat(100vw); -ms-scroll-snap-type: y mandatory; scroll-snap-type: y manda }
.item { position: -webkit-sticky; position: sticky; scroll-snap-align: start; top: 0 }
.item-inner { -webkit-transform: rotate(90deg) translateX(-100vh); -ms-transform: rotate(90deg) translateX(-100vh); transform: rotate(90deg) translateX(-100vh) }
```

```js
addEventListener("scroll", function(e) {
```

### [button 3d and sticky footer](https://codepen.io/mcbenny/pen/WNvZBej)

held: sticky footer.footer | on hover of button.button: button.button: shadow+top | made with: position: sticky · transition · :hover

```css
.button { box-shadow: 3px 3px 0 #fff, 2px 4px 0 #f00, 4px 2px 0 #f00, 4px 4px 0 #f00, 6px 6px 0 #fff, 5px 7px 0 #f00, 7px 5px 0 #f00, 7px 7px 0 #f00; transition: all 0.1s ease-in }
.button:hover { box-shadow: 4px 4px 0 #fff, 3px 5px 0 #f00, 5px 3px 0 #f00, 5px 5px 0 #f00, 8px 8px 0 #fff, 7px 9px 0 #f00, 9px 7px 0 #f00, 9px 9px 0 #f00 }
.main { position: relative }
.footer { position: sticky; bottom: 8px }
```

### [jQuery Sticky Header](https://codepen.io/cuneyd/pen/vYOeVKN)

made with: position: fixed · scroll() timeline · @keyframes · transition · :hover · Web Animations API (.animate)

```css
.sticky { position: fixed }
.active { position: fixed; border-bottom: 1px solid #ccc }
.nav-bar { border-bottom: 1px solid #ccc }
.nav-bar nav { opacity: 0.8 }
.nav-bar nav .hmbrgr-button .bar1 { margin-bottom: 3px }
.nav-bar nav .hmbrgr-button .bar2 { margin-bottom: 3px }
.change .bar1 { top: 7px; position: relative; transform: rotate(-45deg); transition: 0.3s; margin-bottom: 15px }
.change .bar3 { top: 1px; position: relative; transform: rotate(45deg); transition: 0.5s }
.mouse { position: absolute; top: 45% }
.mouse span { position: absolute; -webkit-animation-name: mouse; animation-name: mouse; -webkit-animation-iteration-count: infinite; animation-iteration-count: infinite; -webkit-animation-duration: 1s; animation-duration: 1s }
0% { top: 10% }
100% { top: 70% }
```

```js
.animate({ scrollTop: target }, 500)
```

### [Sticky Header on Scroll](https://codepen.io/notwithclaws/pen/wvaeOWb)

on scroll: div.stickyTitleBar: shadow+top ×3 | made with: position: fixed · transition · :hover

```css
.stickyTitleBar { position: relative }
.stickyTitleBar.fixed { position: fixed; top: 0; box-shadow: 0px 7px 8px -4px rgba(0,0,0,0.49) }
.stickyTitleBar.fixed.absolute { position: absolute }
.name { border-bottom: solid #363636 1px; transition: .3s }
.name:hover { border-bottom: solid #50b54b 1px }
.folded { position: absolute; top: 0 }
.goldenrod { border-top: 30px solid goldenrod }
.firebrick { border-top: 30px solid firebrick }
.rebeccapurple { border-top: 30px solid rebeccapurple }
.lightsalmon { border-top: 30px solid lightsalmon }
.tomato { border-top: 30px solid tomato }
.midnightblue { border-top: 30px solid midnightblue }
```

### [sticky](https://codepen.io/DipakMakwana/pen/KKpmwor)

made with: scroll() timeline

### [CSS Sticky navigation](https://codepen.io/seanjacob/pen/BaNWYvB)

held: sticky div.col | made with: position: sticky

```css
.col-sticky { position:sticky; position:-webkit-sticky; top:30px }
```

### [Effects of `position: sticky`](https://codepen.io/vincentsmedinga/pen/GRJramz)

held: sticky dt, sticky dt, sticky dt, sticky dt, sticky dt, sticky dt, sticky dt, sticky dt | made with: position: sticky

```css
dt { position: sticky; top: 8rem }
```

### [Roll with sticky words](https://codepen.io/myf/pen/RwPoZWj)

held: sticky span, sticky span, sticky span, sticky span, sticky span, sticky span, sticky span, sticky span, sticky span, sticky span | made with: position: sticky · scroll() timeline · pointer / mouse tracking

```css
body::after, *::before, span { position: sticky; top: 0em; bottom: 0em }
html { position: relative }
```

```js
addEventListener("mousemove", stop)
```

### [Липкая шапка](https://codepen.io/Reiter43/pen/abONVod)

made with: position: fixed

```css
.sticky { position: fixed; top: 0 }
```

### [A Sticky Situation](https://codepen.io/jasonhibbs/pen/qBdbYWy)

held: sticky div.title, sticky div.info, sticky div.more, sticky div.info, sticky div.info, sticky div.info, sticky div.info, sticky div.info, sticky div.info, sticky div.info | on scroll: div.detail: transform+top ×2 | made with: position: sticky · transition · :hover · 3D (perspective / preserve-3d) · scroll listener

```css
.title { position: sticky; top: 0; box-shadow: 0 1px 0 rgba(0, 0, 68, 0.06) }
.master.detail { position: relative; box-shadow: 0 2px 0 rgba(0, 0, 68, 0.06); transform: translateY(0); will-change: transform }
.detail .info { position: sticky; box-shadow: 1px 0 0 rgba(0, 0, 68, 0.06) }
.detail li { vertical-align: bottom }
.detail li:after { transition: background-color 0.1s }
.more { position: sticky; box-shadow: 0 1px 0 rgba(0, 0, 68, 0.06) }
.more:last-child { box-shadow: 0 -1px 0 rgba(0, 0, 68, 0.06) }
body { padding-bottom: 12rem }
```

```js
addEventListener('scroll', e => {
```

### [threejs sticky/distortion effect when mousemove 2](https://codepen.io/UIUXLab/pen/xxGwNbx)

made with: GSAP · three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

```js
addEventListener('mousemove', onDocumentMouseMove, false)
requestAnimationFrame( render )
```

### [threejs sticky/distortion effect when mousemove](https://codepen.io/UIUXLab/pen/RwPWxKP)

made with: GSAP · three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

```js
addEventListener('mousemove', onDocumentMouseMove, false)
requestAnimationFrame( render )
```

### [Comparison table with sticky column and header](https://codepen.io/praliedutzel/pen/zYxVwxL)

held: sticky div.ComparisonTable__left, sticky div.ComparisonColumn__header, sticky div.ComparisonColumn__header, sticky div.ComparisonColumn__header, sticky div.ComparisonColumn__header, sticky div.ComparisonColumn__header, sticky div.ComparisonColumn__header, sticky div.ComparisonColumn__header, sticky div.ComparisonColumn__header, sticky div.ComparisonColumn__header | made with: position: sticky

```css
.ComparisonTable { position: absolute }
.ComparisonTable__left { position: sticky; top: 0 }
.ComparisonColumn { padding-top: 100px }
.ComparisonTable__left .ComparisonColumn { padding-top: 0 }
.ComparisonColumn__header { top: 0; position: sticky }
.ComparisonColumn__title { margin-bottom: 16px; padding-top: 16px }
.ComparisonColumn__image { padding-bottom: 53.6% }
.ComparisonColumn__row { border-bottom: 1px solid #3e4d5e }
.ComparisonColumn__row:last-child { border-bottom: none }
```

### [Footer always at bottom with flexbox](https://codepen.io/flavio_amaral/pen/jOEeVyM)

on hover of li.mr-20: a.: color, i.fab: color | made with: :hover

```css
.mb-50 { margin-bottom: 50px }
.mb-15 { margin-bottom: 15px }
a.button-primary { text-transform: uppercase }
nav { border-bottom: 2px solid var(--primary-bg-color) }
```

### [Gekke dingen](https://codepen.io/Sidstumple/pen/JjoBmWx)

held: sticky svg.[object, sticky svg.[object | made with: position: sticky · @keyframes · transition · clip-path · scroll listener

```css
section { -webkit-clip-path: inset(0 0 0 0); clip-path: inset(0 0 0 0) }
section svg { transition: 0.1s }
section:first-of-type { position: relative }
section:first-of-type svg { position: sticky; top: 0; margin-bottom: -120vh }
section:nth-of-type(2) { position: relative; top: -120vh }
section:nth-of-type(2) svg { position: sticky; top: 0 }
from { transform: translateY(0) }
to { transform: translateY(10vh) scale(1.15) }
from { transform: translateY(0) }
to { transform: translateY(10vh) scale(1.15) }
@keyframes turnIt animates transform
```

```js
addEventListener('scroll', () => {
```

### [Fixed Header & Sidebar Table](https://codepen.io/0xgdr/pen/RwNMVqM)

held: sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th | made with: position: sticky

```css
table { position: relative }
thead th { position: sticky; top: 0 }
tbody tr td:first-child { position: sticky }
```

### [Nav fixed with subnav](https://codepen.io/natjo/pen/bGNLEaL)

held: fixed header, sticky nav.subnav | made with: position: sticky · position: fixed · transition · mix-blend-mode · scroll listener

```css
.stage img { opacity: .8; mix-blend-mode: screen }
header[role=banner] { position: fixed; top: 0; transition: transform .2s ease }
header[role=banner].hide { transform: translateY(-100%) }
header[role=banner].show { transform: translateY(0) }
nav[role=navigation] { border-bottom: 1px solid #ddd }
.subnav { position: sticky; border-bottom: 1px solid #def0eb; top: 0px; transform: translateY(0%); transition: top .2s ease; box-shadow: 0px 10px 20px rgba(0, 0, 0, .07) }
.subnav.offset { top: 60px }
```

```js
addEventListener('scroll', scroll)
```

### [Entry Page - Grid w/ Hover Display Copy](https://codepen.io/TazzyT/pen/BayRJJN)

made with: :hover

```css
div.home div#taglineEnter { margin-top: -50px }
div.home div#taglineEnter { margin-top: -40px }
div.home div#taglineEnter { margin-top: -30px }
div.home div#taglineEnter { margin-top: -30px }
.nav:hover + .description, .nav:target + .description { margin-top: 0px }
.container3 a:hover, .cta a:hover { border-bottom: 2px solid #b0d136 }
#portfolio, #about { margin-bottom: 20px }
#portfolio, #about, #contact, #quote, #blog, .nav { margin-bottom: 20px }
#portfolio, #about, #contact, #quote, #blog, .nav { margin-bottom: 10px }
footer.short { position: absolute; bottom: 0 }
footer img { margin-bottom: -10px }
.footer a:hover { border-bottom: 0px solid #b0d136 }
```

### [Table with nice sticky header](https://codepen.io/Blazorpazorpfield/pen/ExaZvjp)

held: sticky thead.sticky, sticky th.top-0, sticky th.top-0, sticky th.top-0, sticky th.top-0, sticky th.top-0 | made with: position: sticky · backdrop-filter

```css
thead.sticky th { position: sticky; box-shadow: inset 0 -2px 0 0 #ddd; backdrop-filter: blur(10px) }
```

### [Understanding CSS positioning](https://codepen.io/huijing/pen/PowbeXJ)

held: fixed div.box, sticky div.box, sticky div.box, sticky div.box, sticky div.box | made with: position: sticky · position: fixed

```css
h1, h2 { margin-bottom: 0.5em }
.container { position: relative }
.box { opacity: 0.75 }
.relative .positioned { position: relative; top: 2em }
.absolute .positioned { position: absolute }
.fixed .positioned { position: fixed; top: 0 }
.top .positioned { position: sticky; top: 1em }
.bottom .positioned { position: sticky; bottom: 1em }
.left .positioned { position: sticky }
.right .positioned { position: sticky }
.logical-offsets::before { position: absolute }
.logical { position: relative }
```

### [Sticky sections](https://codepen.io/hardik-chaudhary/pen/eYmzgOV)

held: sticky section.slide, sticky section.slide, sticky section.slide, sticky section.slide, sticky section.slide | made with: position: sticky

```css
.slide { position: sticky; top: 0 }
.slide.red { box-shadow: 0 0 20px 0px #ea4335; margin-top: 10px }
.slide.yellow { box-shadow: 0 0 20px 0px #fbbc05; margin-top: 10px }
.slide.green { box-shadow: 0 0 20px 0px #34a853; margin-top: 10px }
.slide.end { box-shadow: 0 0 20px 0px #fff; margin-top: 20px }
```

### [Sticky Sections (Pure CSS)](https://codepen.io/alphardex/pen/YzPqeMm)

held: sticky section.slide, sticky section.slide, sticky section.slide, sticky section.slide | made with: position: sticky

```css
.slide { position: sticky; top: 0; background-position: center }
```

### [Sticky timeline](https://codepen.io/Lov/pen/mdyVBVZ)

held: sticky div.stepHeader, sticky div.itemHeder, sticky div.itemHeder, sticky div.itemHeder, sticky div.stepHeader, sticky div.itemHeder, sticky div.itemHeder, sticky div.itemHeder | made with: position: sticky

```css
p { margin-bottom: 2.0225rem }
p:last-child { margin-bottom: 0 }
.container .stepHeader { position: sticky; top: 0 }
.container .listItem .itemHeder { position: sticky; top: calc(50vh - 3.5rem - 3.5rem) }
.container .listItem .itemContents { position: relative; padding-top: 3rem; padding-bottom: 30vh }
.container .listItem .itemContents .illustration { padding-top: calc(100% - 32px); margin-bottom: 3rem }
```

### [Responsive Navbar Techniques](https://codepen.io/nss5161/pen/GRgpwpm)

held: fixed div.sticky-wrapper | made with: position: fixed · :hover

```css
body *, body *::before, body *::after { position: relative }
.feaux-site { border-bottom: none }
nav.m-1 ul.nav-menu li a { top: 50%; transform: translateY(-50%) }
nav.m-1 div.mobile-nav i { top: 45%; transform: translateY(-50%) }
div.sticky-wrapper { position: fixed }
nav.m-2 ul.nav-menu li a { top: 50%; transform: translateY(-50%) }
nav.m-2 div.mobile-nav i { top: 45%; transform: translateY(-50%) }
```

### [12 nth Selectors](https://codepen.io/borntofrappe/pen/NWPGvjW)

held: sticky li, sticky li, sticky li, sticky li, sticky li, sticky li, sticky li, sticky li, sticky li, sticky li | made with: position: sticky · position: fixed · @keyframes

```css
svg { position: fixed; bottom: 1rem }
svg { animation: fadeOut 0.5s 10s forwards }
svg #offset { animation: removeOffset 2s 5 ease-in-out }
to { opacity: 0 }
ol { position: relative }
ol li:before { position: absolute; opacity: 0.5; transform: translate(-50%, 0%) }
ol li { position: sticky }
ol li:nth-child(1) { top: 0vh }
ol li:nth-child(2) { top: 7.5vh }
ol li:nth-child(3) { top: 15vh }
ol li:nth-child(4) { top: 22.5vh }
ol li:nth-child(5) { top: 30vh }
```

### [Sticky table head pure css凍結表頭純CSS](https://codepen.io/FernHsu/pen/bGGXWdO)

held: sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th | on hover of a.: a.: color, span.glyphicon: color | made with: position: sticky

```css
.table-sticky th { position:sticky }
.table-sticky thead tr th:first-of-type { box-shadow: -2px -2px 0 inset #ddd }
.table-sticky thead tr th { top:0; vertical-align: top; border-bottom: 0; box-shadow: 0 -2px 0 inset #ddd }
.table-sticky tbody th { box-shadow: -2px 0 0 inset #ddd }
```

### [Collapsible Content](https://codepen.io/absolutholz/pen/vYYqXpe)

held: sticky h3.collapsible__head, sticky h3.collapsible__head, sticky h3.collapsible__head | made with: position: sticky · transition · prefers-reduced-motion

```css
.collapsible__head { position: sticky; top: 0 }
.collapsible__body { transition: max-height 250ms, padding 200ms 50ms }
.collapsible__body { transition: none }
.collapsible__body > *:first-child { margin-top: 0 }
.collapsible__body > *:last-child { margin-bottom: 0 }
.collapsible__body[hidden] { padding-bottom: 0; padding-top: 0 }
```

### [Social Bar Sticky Scroll](https://codepen.io/irwingb1979/pen/YzzbPpE)

on hover of a.: a.: opacity | made with: position: fixed · scroll() timeline · transition · :hover

```css
.socialbar { position: absolute; top: 100px }
.socialbarfixed { position: fixed; top: 0 }
.socialbar a { transition:all .3s }
.socialbar a:hover { opacity:0.5 }
```

### [React resizable side-panel with spy-scroll](https://codepen.io/vsync/pen/gOOjovv)

held: sticky header, sticky header, sticky header, sticky header, sticky header | made with: position: sticky · transition · :hover · scroll listener · pointer / mouse tracking

```css
.main > .mainContent { box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15) }
.main > aside { box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15) }
.asideComp > nav { box-shadow: 0 0 0 1px #DDD }
.asideComp > nav > button { filter: grayscale(1); transition: 0.5s; opacity: 0.6 }
.asideComp > nav > button:hover { transition: 0s; opacity: 1 }
.asideComp > nav > button.active { filter: none; transition: 50ms; opacity: 0.8 }
.asideComp > .asideContent > section { margin-bottom: 2em }
.asideComp > .asideContent > section:last-child:not(:first-child) { margin-bottom: 100% }
.asideComp > .asideContent > section > header { position: sticky; top: -1px; padding-top: 0.5em; margin-top: -0.5em; padding-bottom: 0.5em; text-transform: capitalize; transition: 0.1s }
```

```js
addEventListener('mousemove', onDragMove)
addEventListener('scroll', throttledOnScroll)
```

### [Sticky top and bottom menu on mobile](https://codepen.io/sjoerdkoelewijn/pen/BaaVjWq)

held: fixed ul.menu, fixed ul.menu | made with: position: fixed · transition · scroll listener

```css
.menu.top { position: fixed; top: 0; transition: all 100ms ease-out }
.menu.bottom { position: fixed; bottom: 0; transition: all 100ms ease-out }
.scroll-down .top { position: fixed; top: 0; transition: all 100ms linear }
.scroll-down .bottom { position: fixed; bottom: 0; transition: all 100ms linear }
.scroll-up .top { position: fixed; top: 0; transition: all 100ms linear }
.scroll-up .bottom { position: fixed; bottom: 0; transition: all 100ms linear }
```

```js
addEventListener("scroll", () => {
```

### [Whatsapp](https://codepen.io/bydex/pen/gOOejXo)

held: fixed a.button-whatsapp | made with: position: fixed · :hover

```css
footer,header { position:relative }
.text { text-transform:uppercase }
.button-whatsapp { position: fixed; bottom: 20px }
.button-whatsapp.absolute { position: absolute; bottom: calc(100% + 20px) }
```

### [Polaroid Image Gallery](https://codepen.io/alperentalaslioglu/pen/RwwMrXX)

on hover of figure.polaroid-card: figure.polaroid-card: transform+top | made with: transition · :hover

```css
.polaroid-card { box-shadow: 4px 4px 8px -4px rgba(0, 0, 0, 0.7) }
.polaroid-card-caption { margin-top: 6px }
.polaroid-card:nth-of-type(even) { transform: rotate(12deg) }
.polaroid-card:nth-of-type(odd) { transform: rotate(-12deg) }
.polaroid-card:nth-of-type(even)::before { transform: rotate(-24deg) translate(-30px, -25px) }
.polaroid-card:nth-of-type(odd)::before { transform: translate(140px, -5px) rotate(25deg) }
.polaroid-card:nth-of-type(1) { transition: transform 0.75s }
.polaroid-card:nth-of-type(1):hover { transform: rotate(360deg) scale(1.25) }
.polaroid-card:nth-of-type(2) { transition: transform 0.75s }
.polaroid-card:nth-of-type(2):hover { transform: scale(1.5) }
.polaroid-card:nth-of-type(3) { transition: transform 0.75s }
.polaroid-card:nth-of-type(3):hover { transform: scale(1.1) skewY(20deg) }
```

### [Untitled](https://codepen.io/KKendle/pen/MWWmoQP)

held: sticky nav.header | made with: position: sticky

```css
.header { position: sticky; top: 0 }
```

### [Position sticky, spans whole viewport in constrained container](https://codepen.io/ovl/pen/JjjNdxw)

held: sticky footer | made with: position: sticky

```css
footer { border-top: 1px solid var(--clr-border); position: sticky; bottom: 0; margin-top: auto; padding-bottom: 1em; padding-top: 1em }
footer::after, footer::before { --offset: calc((100vw - var(--max-width)) / 2); border-top: inherit; position: absolute; top: -1px }
footer::after, footer::before { --offset: 2em }
footer::after { transform: translatex(var(--offset)) }
footer::before { transform: translatex(calc(-1 * var(--offset))) }
.content-dummy { margin-bottom: 4rem }
```

### [Position Fixed VS Sticky](https://codepen.io/opheliafl/pen/ExxWPbm)

held: fixed div.box, sticky div.box | made with: position: sticky · position: fixed · :hover

```css
body { position: relative }
b, i, em, strong, h1, h2, h3, h4, h5, h6, th, td, pre, ins, del, address, input, { text-transform: inherit }
.box { top: 5rem }
.box.-fixed { position: fixed }
.box.-sticky { position: sticky }
```

### [Sort list and separate by alphabetical order](https://codepen.io/yexx/pen/XWWjzOR)

held: sticky p.title, sticky p.title, sticky p.title, sticky p.title, sticky p.title, sticky p.title, sticky p.title, sticky p.title, sticky p.title, sticky p.title | made with: position: sticky

```css
#app { box-shadow: 0px 1px 5px rgba(0,0,0,0.5) }
#app ul p.title { position: -webkit-sticky; position: sticky; top: 0; box-shadow: 0px 1px 1px rgba(0,0,0,0.4) }
```

### [Sticky Menu (for Wordpress)](https://codepen.io/terrorpixel1991/pen/qBBNaeE)

on scroll: header.site-header: background | made with: position: fixed · scroll() timeline · transition

```css
#masthead.sticky { transition: all 0.4s; position: fixed }
```

### [Sticky Footer with TailwindCSS](https://codepen.io/mariordev/pen/poobJBz)

made with: nothing recognised — read the code

### [Vue Sticky Directive](https://codepen.io/SamuelEiche/pen/dyyGYLy)

held: sticky ol | made with: nothing recognised — read the code

### [Comparison of "position: sticky" and sticksy.js](https://codepen.io/kovart/pen/JjPQaoB)

held: sticky div.block, sticky div.block, sticky div.block | made with: position: sticky

```css
.block--sticky { position: sticky; top: 15px }
```

### [Sticksy.js - Floating Widget with Fixed Top Navbar](https://codepen.io/kovart/pen/RwbmQqy)

held: sticky header.header | made with: position: sticky · transition

```css
header { position: sticky; top: 0 }
.title { margin-bottom: 10px }
.text { margin-bottom: 1.25rem }
.image { position: relative; margin-bottom: 1.25rem }
.image .mountain:nth-child(1n) { position: absolute; top: 70px }
.image .mountain:nth-child(2n) { position: absolute; top: 100px }
.image .sun { position: absolute; top: 40px }
.widget.js-sticky-widget { transition: all 0.25s ease-in-out }
```

### [CSS Only Sticky Sidebar](https://codepen.io/ekfuhrmann/pen/ZEzPjmj)

held: sticky div.sidebar | made with: position: sticky

```css
hero { margin-bottom: 32px }
footer { margin-top: 32px }
main { position: relative }
.sidebar { position: sticky; top: 32px }
p:first-of-type { margin-top: 0 }
```

### [React smart sticky element](https://codepen.io/vsync/pen/bGbmqZe)

held: sticky header.undefined | made with: position: sticky · transition · IntersectionObserver

```css
header { position: sticky; top: -1px; transition: 0.2s ease-out }
```

```js
new IntersectionObserver(
```

### [Display Sticky](https://codepen.io/sanjayx14/pen/NWKzKpe)

held: sticky nav.nav-sticky | made with: position: sticky

```css
nav.nav-sticky { position: -webkit-sticky; position: sticky; top: 0px }
article h1 { padding-top: 75px }
```

### [Sticky button AngularJS](https://codepen.io/ycisne/pen/pozLjyr)

held: fixed div.sticky-content | on scroll: div.sticky-content: background+top | made with: position: fixed · transition

```css
.sticky-content { transition: all .3s ease-in-out }
.sticky-on { top: inherit; position: fixed; bottom: 0 }
```

### [StickyHeader Hook](https://codepen.io/pd-smith/pen/BaBmKZL)

made with: scroll listener

```js
addEventListener('scroll', checkIfSticky)
```

### [sticky table thead](https://codepen.io/anaidjm1/pen/qBWqdKJ)

on scroll: thead.: transform | made with: scroll listener

```css
.tabla { box-shadow: 0 0 1px 3px #ddd }
```

```js
addEventListener('scroll',scrollHandle)
```

### [Sticky navbar](https://codepen.io/goge_se_umorila/pen/QWLEYWN)

made with: position: fixed · transition · :hover

```css
header { background-position: center; filter: sepia(50%) }
.sticky { position: fixed; top: 0 }
.sticky + .content { padding-top: 80px }
.zoom:hover img { transform: scale(1.2) }
img { transition: transform 0.4s ease-in-out; padding-bottom: 15px }
.zoom { padding-bottom: 10px; margin-bottom: 20px }
.caption { padding-top: 20px }
```

### [Sticky inner block's titles](https://codepen.io/dariad/pen/ZEzWRPV)

held: fixed header.header, sticky div.brief-info-header, sticky div.brief-info, sticky div.brief-info-header | made with: position: sticky · position: fixed · custom properties driven by JS

```css
.root { padding-top: 60px }
.header { position: fixed; top: 0; text-transform: uppercase; box-shadow: 0 3px 2px rgba(0, 0, 0, 0.1) }
.crumbs { margin-top: 1em }
.article-content { padding-top: 4em; padding-bottom: 4em }
.article-content p + p { margin-top: 1em }
.brief-info-header { text-transform: uppercase }
.brief-info-list li { position: relative; text-transform: uppercase }
.brief-info-list li + li { border-top: 1px solid #ffcf4b }
.brief-info-header { position: sticky; top: 60px }
.brief-info-2 { position: sticky; top: 60px }
.brief-info-2 { top: -273px }
.root { --box-top: -250px }
```

```js
style.setProperty('--box-top', top + 'px')
```

### [Sticky Dates Timeline](https://codepen.io/LeonNikolai/pen/XWrdKPK)

held: sticky time, sticky time, sticky time, sticky time, sticky time, sticky time, sticky time, sticky time, sticky time, sticky time | made with: position: sticky

```css
ul.timeline li { margin-top: 0; padding-top: 0 }
ul.timeline li > time { position: sticky; top: 2em }
```

### [Simple Sticky Header Template](https://codepen.io/xiell/pen/rNBxRaB)

held: sticky h2.header, sticky h2.header | made with: position: sticky

```css
.header { position: sticky; top: 0 }
.container { position: relative }
```

### [Responsive Navbar](https://codepen.io/mahabbat/pen/ZgyZqp)

on hover of li.: li.: background, a.: color | made with: position: fixed · transition · :hover · scroll listener

```css
* { transition: 0.4s ease all }
.navbar ul.links { transition: 0.4s ease all, 0s ease background }
.navbar ul.links li { text-transform: uppercase; transition: 0.4s ease all, 0s ease margin }
button:hover { transform: scale(1.1) }
.navbar.sticky { position: fixed }
.navbar.sticky ~ main { position: relative; top: 65px }
.toggle { position: absolute; top: 32.5px; transform: translateY(-50%) }
.navbar.collapsed .toggle .line1 { transform: rotate(-45deg) translate(-4px, 5px) }
.navbar.collapsed .toggle .line2 { opacity: 0 }
.navbar.collapsed .toggle .line3 { transform: rotate(45deg) translate(-5px, -6px) }
.navbar.collapsed .logo { position: absolute }
.navbar .links { position: fixed; top: 0 }
```

```js
addEventListener('scroll', e => {
```

### [Sticky Columns - Table](https://codepen.io/mr-bobz/pen/QevdqY)

held: sticky thead.sticky, sticky th.col1, sticky th.col2, sticky th.col3, sticky th.col4, sticky td.pinnedColumn, sticky td.pinnedColumn2, sticky td.pinnedColumn, sticky td.pinnedColumn2, sticky td.pinnedColumn | made with: position: sticky

```css
.sticky { position: sticky; top: 0 }
th { position: sticky; top: 0 }
.pinnedColumn { position: sticky }
.pinnedColumn2 { position: sticky }
```

### [Daily UI #010 | Social Share](https://codepen.io/mubangadv/pen/eqvjLZ)

held: sticky div.share | made with: position: sticky · transition · :hover

```css
.share { position: sticky; top: 0 }
.share .flaps { position: absolute }
.share .flaps i { margin-top: 1rem; box-shadow: 0.25rem 0 1rem -0.5rem rgba(0, 0, 0, 0.2); transition: transform 200ms, color 200ms }
.share .flaps i:hover { transform: translatex(0.5rem) }
.background { position: absolute; top: 0; bottom: 0; box-shadow: 0 0 2rem -1rem rgba(0, 0, 0, 0.3) }
h1 { position: relative }
p { position: relative }
.image { position: relative; background-position: center }
.article { position: relative; box-shadow: 0 0 16rem 0 rgba(0, 0, 0, 0.1) }
.article .meta { position: relative }
```

### [CSS Positioning - STICKY](https://codepen.io/webilix/pen/wVgGWp)

held: fixed div.optiopns, sticky section, sticky section | made with: position: sticky · position: fixed

```css
.optiopns { position: fixed; bottom: 1rem }
.optiopns select { margin-bottom: 1rem }
section { position: -webkit-sticky; position: sticky }
#section-top { margin-bottom: 2rem; top: 0 }
#section-bottom { bottom: 0 }
div.lorem { margin-bottom: 2rem }
```

### [Sticky Content](https://codepen.io/FURAZOA/pen/rXxVJJ)

made with: position: fixed · transition

```css
.intro { margin-bottom: 50px }
.section { position: relative }
.header { position: absolute; top: 0; opacity: 0; transition: opacity .4s }
.header--first { position: absolute; top: 0 }
.content { position: relative; top: 0 }
.is-fixed { position: fixed; top: 0; opacity: 1 }
.is-finished { opacity: 0 }
.is-finished--last { position: absolute; top: auto; bottom: 0 }
```

### [enhanced-table](https://codepen.io/adidegani/pen/JQgprE)

held: sticky th.sortable, sticky th.sortable, sticky th.sortable, sticky th.sortable, sticky th.sortable | on scroll: td.: color+top ×294 | made with: position: sticky · transition · :hover · (hover: hover) gate · clip-path

```css
table.e-table { position: relative }
table.e-table, table.e-table tbody, table.e-table thead, table.e-table tr, table { position: relative }
table.e-table th, table.e-table td { vertical-align: text-top }
table.e-table th { position: -webkit-sticky; position: sticky; top: 0 }
table.e-table thead > tr > th { text-transform: uppercase }
table.e-table.row-numbers > tbody > tr:not(.expansion) > td:first-child::before { opacity: .4 }
table.e-table.hoverable-rows tbody > tr > *, table.e-table.hoverable-columns tbo { --animation-speed: .1s; -webkit-transition: text-shadow var(--animation-speed) ease-in-out, color var(--animation-speed) ease-in-out, background-color var(--animation-speed) ease-in-out; transition: text-shadow var(--ani }
table.e-table.sortable > thead th.sortable::before { position: absolute; top: calc((100% - var(--height)) / 2); -webkit-clip-path: polygon(50% 0%, 100% var(--arrow-height), 70% var(--arrow-height), 70% calc(100% - var(--arrow-height)), 100% calc(100% - var(--arrow-height)) }
table.e-table.sortable > thead th.sortable.sort-asc::before, table.e-table.sorta { -webkit-clip-path: polygon(70% 0%, 70% var(--arrow-height), 70% calc(100% - var(--arrow-height)), 100% calc(100% - var(--arrow-height)), 50% 100%, 0% calc(100% - var(--arrow-height)), 30% calc(100% - var(--arrow-height)) }
table.e-table.sortable > thead th.sortable.sort-asc::before { -webkit-transform: scaleY(1); transform: scaleY(1) }
table.e-table.sortable > thead th.sortable.sort-desc::before { -webkit-transform: scaleY(-1); transform: scaleY(-1) }
table.e-table.selectable > tbody > tr > *:first-child:after, table.e-table.selec { position: absolute; top: calc(1px + var(--border-width)); bottom: calc(1px + var(--border-width)); -webkit-transition: background-color .2s ease; transition: background-color .2s ease }
```

```js
addEventListener("mouseenter", (ev) => {
addEventListener("mouseleave", (ev) => {
addEventListener("mouseenter", ev => {
addEventListener("mouseleave", ev => {
```

### [Solution to the Height Problem?](https://codepen.io/carloshdelreal/pen/agaqZd)

made with: position: sticky

```css
.wrapper { position: sticky; top: 0 }
```

### [sticky cart](https://codepen.io/shesowickd207/pen/RzBgXr)

made with: nothing recognised — read the code

### [Exclude Sticky element on scroll](https://codepen.io/sandrina-p/pen/mZXWYN)

held: sticky div.sticky, fixed footer.footer | on scroll: div.sticky-exclude: clip-path+top | made with: position: sticky · position: fixed · :hover · clip-path · custom properties driven by JS · scroll listener

```css
.block { position: relative; margin-top: 1rem }
.sticky { position: sticky; top: 10px; top: 10px }
.sticky-content { box-shadow: 0px 1px 2px #4761757a }
.sticky-floating { position: absolute; top: 65px; box-shadow: 0px 3px 3px #4761757a }
.sticky-exclude { position: relative; margin-top: 1rem; margin-bottom: calc(-5.5rem + -1rem); -webkit-clip-path: polygon(0% 0%, 100% 0%, 100% var(--js-sticky-exclude-path-height), 0% var(--js-sticky-exclude-path-height)); clip-path: polyg }
.box { box-shadow: 0px 1px 2px #4761757a }
.note { margin-top: -1rem }
.link { transform: translateX(-0.1em) }
.footer { position: relative; margin-top: 60px; border-top: 1px solid gray }
.footer { position: fixed; bottom: 0 }
```

```js
style.setProperty('--js-sticky-exclude-path-height', value)
addEventListener('scroll', lookForStickyExclude)
```

### [StickyHeader with jQuery](https://codepen.io/artursopelnik/pen/NZXxWW)

made with: position: fixed · @keyframes · requestAnimationFrame

```css
.header, .sticky-header { position: relative; top: 0 }
.content { box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.15), 0 1px 1px 0 rgba(0, 0, 0, 0.05) }
.stucked { position: fixed; animation-duration: 0.5s; animation-timing-function: ease; animation-name: showStickyHeader }
0% { transform: translateY(-100%) }
100% { transform: translateY(0) }
@keyframes showStickyHeader animates transform, height
```

```js
requestAnimationFrame(run)
```

### [Sub nav sticky](https://codepen.io/natjo/pen/JQOWoZ)

made with: scroll listener

```css
aside { position: absolute }
h2 { margin-bottom: 20px }
```

```js
addEventListener("scroll", _onscroll)
```

### [Sticky Social Icons - CSS/HTML](https://codepen.io/codewithshabbir/pen/mZWjre)

held: fixed div.sticky-icon | made with: position: fixed · transition · :hover

```css
.sticky-icon { position:fixed; top:15% }
.sticky-icon a { transform:translate(160px,0px); text-transform:uppercase; transition:all 0.8s }
.sticky-icon a:hover { transform:translate(0px,0px) }
.sticky-icon a:hover i { transform:rotate(360deg) }
.sticky-icon a i { transition:all 0.5s }
#myBtn { position: fixed; bottom: 20px }
```

### [Sticky bottom and top demo](https://codepen.io/yowainwright/pen/bPqaNK)

held: sticky nav.top, sticky nav.bottom | made with: position: sticky

```css
.top { top: 0; position: sticky }
.bottom { top: calc(100vh - 5rem); position: sticky }
```

### [Sticky Element for Long Text Columns // CSS Grid](https://codepen.io/brianhaferkamp/pen/ZdeeMQ)

held: sticky img, sticky img, sticky img | made with: position: sticky

```css
.features-image img { position: sticky; top: 2rem }
```

### [Sticky Section Headers on Scroll](https://codepen.io/brianhaferkamp/pen/xogEXr)

held: sticky header.section-header, sticky header.section-header, sticky header.section-header | made with: position: sticky · Lenis / smooth scroll

```css
.section-header { position: sticky; top: 0 }
```

### [Footer fixed until reach position (sticky)](https://codepen.io/pedroroccon/pen/XLNdex)

held: sticky div.form-sticky-footer | made with: position: sticky

```css
.form-sticky-footer { position: sticky; position: -webkit-sticky; bottom: 0 }
```

### [Sticky Animated Header // jQuery](https://codepen.io/brianhaferkamp/pen/PrYxJO)

held: sticky header.bottom | on scroll: header.bottom: opacity+top | made with: position: sticky · scroll() timeline · transition

```css
.bottom { position: sticky; top: 0; transition: opacity 700ms ease }
.bottom.sticky { opacity: 0.7 }
main { background-position: center }
```

### [CSS Sticky Sidebar](https://codepen.io/florantara/pen/jogxqP)

held: sticky aside.sidebar | made with: position: sticky · transition · :hover

```css
.sidebar { position: sticky; top: 0; padding-top: 0px }
.sidebar { position: static }
.sidebar ul li { margin-bottom: 1em; box-shadow: 0 0 0 rgba(0, 0, 0, 0); transition: box-shadow 200ms linear }
.sidebar ul li:hover { box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1) }
```

### [fixed + scrollabled column](https://codepen.io/bautistaaa/pen/eawEZE)

held: fixed header, fixed div.fixme | made with: position: fixed

```css
header { position: fixed; top: 0 }
main { margin-top:100px }
.fixme { position: fixed; box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22) }
.panel { margin-bottom: 15px; box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23) }
```

### [Boostrap 4 Cards](https://codepen.io/ProgramingTillNow/pen/vwvxge)

held: sticky div.first-col | on hover of div.card: img.img-fluid: transform+top | made with: position: sticky · @keyframes · transition · :hover

```css
body { padding-top: 10vh; padding-bottom: 10vh }
.first-col { position: sticky !important; top: 0 }
.col-lg-8 .row { border-top: 1px solid #eee }
.item { border-bottom: 1px solid #eee }
.card-author { margin-bottom: 0 }
.card-author a { text-transform: uppercase }
.card-date { margin-top: 10px; margin-bottom: 0 }
.card-body img { transition: transform 0.4s ease-in }
.card-body img:hover { -webkit-animation: spin 3s linear infinite; animation: spin 3s linear infinite }
0% { transform: rotate(0deg) scale(1) }
50% { transform: rotate(180deg) scale(1.3) }
100% { transform: rotate(360deg) scale(1) }
```

### [Scroll box - Border animation as progress bar indicator with "position: sticky"](https://codepen.io/irrealitas/pen/rgqNag)

held: sticky div.progress, sticky div.progress, sticky div.progress, sticky div.progress | made with: position: sticky

```css
:root { --animation-size: 20px }
.fragment { position: relative; box-shadow: inset 0 0 0 var(--border-size) var(--color-static) }
.progress { position: sticky }
.progress--top-left { top: 0; transform: rotate(90deg) }
.progress--top-right { top: var(--animation-size); transform: rotate(180deg) }
.progress--bottom-left { top: calc(100% - var(--animation-size)) }
.progress--bottom-right { top: calc(100% - var(--animation-size)); transform: rotate(-90deg) }
.text { position: absolute; top: 0 }
```

### [Table with sticky column header](https://codepen.io/gurix/pen/WBoObx)

held: sticky th, sticky th, sticky th | on hover of button.btn: button.btn: background | made with: position: sticky

```css
table thead th { position: -webkit-sticky; position: sticky; top: 0px }
```

### [Sticky Content with Javascript](https://codepen.io/georgia-nz/pen/mYPbjP)

made with: position: fixed · scroll listener

```css
.sticky { position: fixed; top: 0 }
```

```js
addEventListener("scroll", () => {
```

### [Simple Sticky Header](https://codepen.io/georgia-nz/pen/gJrYYO)

held: fixed header.sticky | made with: position: fixed

```css
.sticky { position: fixed; top: 0 }
.sticky + main { padding-top: 60px }
```

### [Position Sticky](https://codepen.io/glgeorgiou/pen/MdKjKj)

held: sticky div.another | made with: position: sticky

```css
.first { position: relative }
.another { position: sticky; top: 0px }
```

### [CSS only sticky navbars](https://codepen.io/envoy47/pen/JqYErN)

held: sticky div.sticky, sticky div.sticky, sticky div.sticky, sticky div.sticky | made with: position: sticky

```css
.parent { position: relative }
.sticky { position: sticky; top:0; padding-top: 30px }
.sticky:not(:first-child) { margin-top:500px }
```

### [CSS sticky+ parallax + transform + flex box +](https://codepen.io/Fibonaccifreak/pen/dEodoY)

held: sticky div.maintop-text, sticky div.maintop-lefttext | made with: position: sticky

```css
.maintop { background-position: center }
.maintop-text { top: 1em; position: sticky; -webkit-position: sticky }
.maintop-lefttext { top: 5em; position: sticky; -webkit-position: sticky }
.iframe { position: relative; margin-top: 30em }
hr { border-top: dotted 1px }
.slanted { text-transform: uppercase; transform: rotate(-5deg); margin-top: 1em }
.mainimg { position: relative }
.mainimg3 { position: relative }
.text-box { position: relative }
.content { margin-top: 5em }
.container { position: relative }
.straight { text-transform: uppercase; margin-top: 1em }
```

### [Scrolling side content - no JS](https://codepen.io/jakubtursky/pen/oRNebv)

held: sticky div.padding-content-100-left-bottom | made with: position: sticky · transition · :hover · (hover: hover) gate

```css
.margin-bottom-3 { margin-bottom: 3em }
.h-margin-0 .alfa, .h-margin-0 .beta, .h-margin-0 .gamma, .h-margin-0 .delta, .h { margin-bottom: 0 }
.h-margin-02 .alfa, .h-margin-02 .beta, .h-margin-02 .gamma, .h-margin-02 .delta { margin-bottom: 0.2em }
.h-margin-03 .alfa, .h-margin-03 .beta, .h-margin-03 .gamma, .h-margin-03 .delta { margin-bottom: 0.3em }
.h-margin-1 .alfa, .h-margin-1 .beta, .h-margin-1 .gamma, .h-margin-1 .delta, .h { margin-bottom: 1em }
* { transition: color 0.15s, background 0.15s, border 0.15s, opacity 0.15s }
html { position: relative }
body { position: relative }
p { margin-top: 0; margin-bottom: 2.5em }
ul.list-style, ol.list-style { margin-bottom: 3em }
ul.list-style li, ol.list-style li { position: relative; margin-bottom: 15px }
ul.list-style li:before { position: absolute; top: 9px }
```

### [Stickies](https://codepen.io/Tirjasdyn/pen/mYbqaP)

on hover of button.: button.: background | made with: transition · :hover · pointer / mouse tracking

```css
#newNoteButton:hover { transition: background-color 0.9s ease }
.note { position:absolute; box-shadow:0px 5px 10px rgba(0,0,0,0,.5) }
.closebutton { position: absolute; top: -15px }
.timestamp { position:absolute; bottom: 0; border-top: 1px solid #a80 }
```

```js
addEventListener('mousemove',this.mouseMoveHandler,true)
```

### [Dynamic Sortable Table - Just JavaScript, Sticky Header/Footer, Custom Scroll (JS/CSS/HTML)](https://codepen.io/stephenirving/pen/NVKNbZ)

held: sticky th.col-head, sticky th.col-head, sticky th.col-head, sticky th.col-head, sticky th.col-head, sticky th.col-head, sticky td.col-foot, sticky td.col-foot, sticky td.col-foot, sticky td.col-foot | on scroll: td.cell: color+top ×6 | on hover of div.table-card: td.cell: color ×12, tr.table-row: background+color ×2 | made with: position: sticky · transition · :hover

```css
.table-card { box-shadow: 0 6px 12px rgba(0, 0, 0, 0.23), 0 10px 40px rgba(0, 0, 0, 0.19) }
.table-scroll::-webkit-scrollbar-thumb:active { box-shadow: inset 0 0 3px rgba(192, 192, 192, 0.5) }
.table-title { text-transform: uppercase }
.col-head { position: -webkit-sticky; position: sticky; top: -0.5px; -webkit-transition: background-color 0.4s ease-out; -moz-transition: background-color 0.4s ease-out; transition: background-color 0.4s ease-out }
.cell { border-bottom: 1px solid #bcbec0 }
.col-foot { border-top: 2px solid #bcbec0; bottom: -1px; position: -webkit-sticky; position: sticky }
.table-sort-header:not(:last-child):after, .table-sort-header:last-child:before { margin-top: 0.55em; -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=70)"; opacity: 0.7; position: absolute }
.table-sort-header:not(:last-child):after { -webkit-transform: rotate(-90deg); -moz-transform: rotate(-90deg); -ms-transform: rotate(-90deg); transform: rotate(-90deg) }
.table-sort-header:last-child:before { -webkit-transform: rotate(90deg); -moz-transform: rotate(90deg); -ms-transform: rotate(90deg); transform: rotate(90deg) }
.table-sort-asc:after, .table-sort-asc:hover:after, .table-sort-desc:after, .tab { -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(enabled=false)"; opacity: 1; -webkit-transform: rotate(0); -moz-transform: rotate(0); -ms-transform: rotate(0); transform: rotate(0) }
.table-sort-desc:not(:last-child):after, .table-sort-desc:last-child:before { -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(enabled=false)"; opacity: 1; -webkit-transform: rotate(0); -moz-transform: rotate(0); -ms-transform: rotate(0); transform: rotate(0) }
* { box-shadow: none !important }
```

### [Sections with sticky header](https://codepen.io/j4rl/pen/qwzeLX)

held: sticky h1, sticky h1, sticky h1, sticky h1, sticky h1 | made with: position: sticky

```css
section { margin-bottom:50px; margin-top:50px }
h1 { position:sticky; top:0px; --border-top:1px solid var(--accent); --border-bottom:1px solid var(--accent) }
```

### [CSS/JS Fadeout scroll animation](https://codepen.io/elwinvdhazel/pen/rbPbVG)

held: fixed nav.nav-main, fixed header.header-main, sticky nav.nav-tags, sticky li.list__item, sticky header.list__item-header | on scroll: div.container: transform+opacity+top | made with: position: sticky · position: fixed · backdrop-filter · 3D (perspective / preserve-3d) · scroll listener

```css
.nav-main { position: fixed; top: 0; box-shadow: 0 0 2rem rgba(0, 0, 0, 0.1) }
.nav-tags { position: sticky; top: 4rem }
.nav-tags__item { -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px) }
.header-main { position: fixed; top: 4rem; perspective: 100px }
.main { position: relative }
.list__item { background-position: center center; margin-bottom: 1rem }
.list__item:first-child { position: sticky; top: 8rem; margin-bottom: 0 }
.list__item:first-child .list__item-header { position: sticky; bottom: 0 }
.list__item:nth-child(2) { margin-top: calc(-100vh + 9rem) }
.list__item:last-child { margin-bottom: 0 }
```

```js
addEventListener("scroll", updateHeader)
```

### [CSS zoom on hover+sticky+parallax scrolling](https://codepen.io/Fibonaccifreak/pen/qwyKqK)

held: sticky div.heading, sticky div.heading, sticky div.heading | on hover of img.: div.zoom2: transform+top | made with: position: sticky · transition · :hover

```css
.mainimg { position: relative }
.mainimg3 { position: relative }
.heading { position: sticky; position: -webkit-sticky; top: 40px }
.zoom1 { background-position: center; transition: transform 0.2s }
.zoom1:hover { -ms-transform: scale(1.1); -webkit-transform: scale(1.1); transform: scale(1.1) }
.zoom2 { background-position: center; transition: transform 0.2s }
.zoom2:hover { -ms-transform: scale(1.1); -webkit-transform: scale(1.1); transform: scale(1.1) }
.zoom3 { background-position: center; transition: transform 0.2s }
.zoom3:hover { -ms-transform: scale(1.1); -webkit-transform: scale(1.1); transform: scale(1.1) }
.top3text { padding-bottom: 1em }
#uh { border-bottom: 2px dashed white }
```

### [Two-column layout with sticky header](https://codepen.io/vajkri/pen/rbpMdo)

held: sticky h2, sticky h2, sticky h2, sticky h2 | made with: position: sticky

```css
.item:not(:last-child) { margin-bottom: 80px }
h2 { position: sticky; top: 40px }
p { position: relative; top: -5px }
```

### [Table with sortable columns and optional totalResult](https://codepen.io/tulenchick/pen/xeLYoJ)

held: sticky th.cursor-pointer, sticky th.cursor-pointer, sticky th.cursor-pointer | made with: position: sticky

```css
table { box-shadow: 1px 1px 3px #ccc }
th { position: sticky; top: 0 }
td, th { border-bottom: 1px solid rgba(0,0,0, 0.12) }
table tbody > :last-child td { border-bottom: none }
.total-row > td { border-top: 2px solid #ccc; position: sticky; bottom: 0 }
```

### [position:sticky Demo](https://codepen.io/animakuz/pen/PgjYOq)

held: sticky h1, sticky h2.card-title, sticky h2.card-title, sticky h2.card-title, sticky h2.card-title | made with: position: sticky

```css
h1 { position: sticky; top: 0; margin-bottom: 0; margin-top: 50px }
.card-container { position: relative; padding-bottom: 20px; box-shadow: 0 0 4px rgba(0,0,0,0.2) }
.card-container.overlap .card-title-2 { top: 70px }
.card-container.overlap .card-title-3 { top: 80px }
.card-container.overlap .card-title-4 { top: 90px }
.card-title { position: sticky }
.card-title-1 { top: 60px }
.card-title-2 { top: 100px }
.card-title-3 { top: 140px }
.card-title-4 { top: 180px }
```

### [Sticky Back to Top Button](https://codepen.io/cmalou/pen/OGXJgP)

held: fixed button | made with: position: fixed · :hover

```css
#myBtn { bottom: 0px; position: fixed }
body { padding-top:20px }
.two-column-layout { border-top: 5px solid #ce9494 }
```

### [Position: Sticky and Overflow](https://codepen.io/speeqr/pen/dLbzrb)

held: sticky div.sticky | made with: position: sticky

```css
.sticky-wrapper { position: relative }
.sticky { margin-top: 100px; position: sticky; top: 0 }
.more-content h1 { padding-top: 1em }
```

### [Sticky Flexbox Navbar - No JS](https://codepen.io/cryptoctopus/pen/QPLyZq)

held: sticky header.header__navbar | made with: position: sticky · :hover

```css
.header__navbar { -webkit-box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.75); -moz-box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.75); box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.75); position: sticky; top: 0 }
.navbar__logo a, .navbar__links a { text-transform: uppercase }
```

### [Sticky Sidebar](https://codepen.io/larrygeams/pen/gEEqqb)

held: sticky div.image, sticky div.image, sticky div.image | made with: position: sticky

```css
section .image { position: sticky; position: -webkit-sticky; top: 0 }
```

### [CSS iPhone style contact list](https://codepen.io/svsdesigns/pen/bZjYeG)

held: sticky div.header, sticky div.header, sticky div.header, sticky div.header, sticky div.header | made with: position: sticky

```css
.section { border-bottom: 1px solid #e0e0e0 }
.header { position: sticky; top:0 }
```

### [CSS - position sticky](https://codepen.io/itsthomas/pen/QomOaQ)

held: sticky header | made with: position: sticky

```css
body { position: relative }
header, footer { position: sticky }
header { top: 0 }
footer { position: absolute; bottom: 0 }
```

### [Experimenting with different position values](https://codepen.io/StevenBarnes/pen/WmRMyx)

held: fixed div.box, sticky div.box | made with: position: sticky · position: fixed

```css
.container { position: relative; opacity:.9 }
.box { opacity: .6 }
.static { position: static; top:30px }
.relative { position: relative; top: 10px }
.absolute { position: absolute; bottom:0px }
.fixed { position: fixed; bottom:0px; opacity:0.6 }
.sticky { position:sticky; top:0px }
.inherit { position:inherit }
```

### [McDonald's Sticky Slider Nav Vanilla JS (Responsive)](https://codepen.io/J8ahmed/pen/OqbxbP)

held: sticky nav.menu | made with: position: sticky · transition · :hover · requestAnimationFrame

```css
body { position: relative }
.cover-banner { position: absolute }
.menu { position: sticky; top: 0; box-shadow: 1px 1px 10px 0px rgba(0,0,0,0.3); transition: all 1s }
.menu ul { position: relative }
.menu-item { transition: all 0.5s }
.border-bar { position: absolute; bottom: 0; transition: all 1s }
.section { background-position: center }
.heading { text-transform: uppercase }
```

```js
requestAnimationFrame(animateScroll)
```

### [Sticksy.js - Floating Widget in a Sidebar](https://codepen.io/kovart/pen/VReGjN)

held: sticky header.header | made with: position: sticky · transition

```css
.header--sticky { position: sticky; top: 0 }
.title { margin-bottom: 10px }
.text { margin-bottom: 1.25rem }
.image { position: relative; margin-bottom: 1.25rem }
.image .mountain:nth-child(1n) { position: absolute; top: 70px }
.image .mountain:nth-child(2n) { position: absolute; top: 100px }
.image .sun { position: absolute; top: 40px }
.widget.js-sticky-widget { transition: all 0.25s ease-in-out }
```

### [Table with two sticky headers](https://codepen.io/carbonbased/pen/vPYZrK)

held: sticky header, sticky div.row-header, sticky div.cell, sticky div.cell, sticky div.cell, sticky div.cell, sticky div.cell, sticky div.cell, sticky div.cell, sticky div.cell | made with: position: sticky · clip-path

```css
.table { box-shadow: 0 3px 20px 3px rgba(0, 0, 0, 0.2) }
header { position: sticky; top: 0; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2) }
header .row-header { position: sticky }
.cell:first-of-type { position: sticky }
.cell:first-of-type::after { position: absolute; top: 0; box-shadow: 1px 0 4px rgba(0, 0, 0, 0.2); -webkit-clip-path: polygon(50% 50%, 150% -50%, 150% 150%, 0% 0%); clip-path: polygon(50% 50%, 150% -50%, 150% 150%, 0% 0%) }
```

### [Always visible title: Sticky Flexbox ((weird))](https://codepen.io/warkentien2/pen/gqNKQW)

held: sticky div.box | made with: position: sticky · transition

```css
body::before { position: sticky; text-transform: capitalize }
.box { transition: all 0.25s ease }
.box:first-child { position: sticky }
.box:first-child .cell { position: sticky }
```

### [Simple Shrinking Sticky Header (jQuery)](https://codepen.io/gregrickaby/pen/vbbEgX)

held: sticky div.site-header | made with: position: sticky · transition

```css
.site-header { position: sticky; top: 0; transition: padding 0.2s ease-in-out }
.site-header { margin-bottom: 56px }
```

### [Grid with Sticky Cells](https://codepen.io/bootsified/pen/mvprJW)

held: sticky header.header, sticky div.desc, sticky div.actions, sticky ul.nav-img | made with: position: sticky

```css
h1, h2, h3, p { margin-top: 0 }
h1 { margin-bottom: 0.25em; text-transform: uppercase }
h2 { margin-bottom: 1.5em }
.header-main { position: relative }
.grid { margin-bottom: 1rem }
.header { position: sticky }
.header::before { bottom: 100%; position: absolute }
.header p { margin-bottom: 0 }
.desc { position: sticky }
.desc > * { margin-bottom: 0 }
.desc * + * { margin-top: 1em }
.actions { position: sticky }
```

### [Position Sticky & A Wee bit of JavaScript](https://codepen.io/borntofrappe/pen/ZwXeWY)

held: sticky span.section--label, sticky span.section--label, sticky span.section--label, sticky span.section--label, sticky span.section--label | made with: position: sticky

```css
.section--label { position: sticky; top: 0; box-shadow: 0 1px 5px -2px var(--color-bg) }
```

### [Position: sticky](https://codepen.io/mcbenny/pen/jdLmxa)

held: sticky div.sticky | made with: position: sticky

```css
.container { position: relative }
.sticky { position: sticky; top: 0 }
```

### [Landing page Layout with CSS scroll-behavior & sticky header](https://codepen.io/andrejsharapov/pen/gqRePX)

held: sticky header | on hover of li.: a.: color, span.: transform+top | made with: position: sticky · @keyframes · transition · :hover

```css
str-style, section#one .title text, section#one .title path { animation: dash 4s linear forwards }
h1, h2, header a { text-transform: uppercase }
header, footer { position: relative }
header { position: -webkit-sticky; position: sticky; top: 0 }
header h3 { position: relative }
header ul li { position: relative; transition: all 0.2s linear }
header ul li::before { position: absolute; top: calc(100% + 4px); transform: rotate(-5deg); transition: all 0.2s ease-out }
progress { position: relative }
progress::-webkit-progress-value { position: absolute; top: -2px }
section { position: relative }
section#one { background-position: center }
section#one h1 { opacity: 0 }
```

### [Sticky demo](https://codepen.io/ingvoo/pen/rPjKZO)

held: sticky div.sticky | made with: position: sticky

```css
.sticky { position: sticky; top: 0 }
```

### [See how position: sticky works](https://codepen.io/everdimension/pen/MLJVKy)

held: sticky div.sticky | made with: position: sticky

```css
body { padding-top: 200px }
.sticky { position: sticky; top: 50px }
```

### [JS Sticky Nav with Smooth Scroll](https://codepen.io/timgorsuch/pen/Odbrzg)

made with: position: fixed · scroll() timeline · scroll listener

```css
.section--hero { background-position: top center }
.subnav { border-bottom: 1px solid white }
.sticky { position: fixed; top: 0; margin-bottom: 3em }
.sticky-padding { margin-top: 4.5% }
```

```js
addEventListener('scroll', function(ev) {
```

### [Simple CSS sticky effect](https://codepen.io/raykuo/pen/ZwByZo)

held: sticky h1, sticky div | made with: position: sticky

```css
article { padding-top: 200px }
h1 { position: sticky; top: 20px }
div { position: sticky; top: 10px }
```

### [Sticky to borders](https://codepen.io/Krar/pen/vbXqoN)

made with: transition · pointer / mouse tracking

```css
#timer { position: absolute; top: 4%; transform: translate(-98%, -4%); opacity: 0.25 }
div { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: 0.45s cubic-bezier(0.46, 1.57, 0.75, 1.01), border-radius 0.45s cubic-bezier(0.46, 1.57, 0.75, 1.01); text-transform: uppercase }
div.dragging { transition: border-radius 0.45s cubic-bezier(0.46, 1.57, 0.75, 1.01) }
div.left { position: absolute; top: 50%; transform: translate(-0%, -50%) }
div.right { position: absolute; top: 50%; transform: translate(-100%, -50%) }
div.top { position: absolute; top: 0%; transform: translate(-50%, -0%) }
div.bottom { position: absolute; top: 100%; transform: translate(-50%, -100%) }
div.top.left { position: absolute; top: 0%; transform: translate(-0%, -0%) }
div.top.right { position: absolute; top: 0%; transform: translate(-100%, -0%) }
div.bottom.left { position: absolute; top: 100%; transform: translate(-0%, -100%) }
div.bottom.right { position: absolute; top: 100%; transform: translate(-100%, -100%) }
```

```js
addEventListener('mousemove', moving)
```

### [Simple Sticky footer use flexbox](https://codepen.io/axelaredz/pen/zeKdWx)

made with: nothing recognised — read the code

### [Fixed column table](https://codepen.io/eliza-rjb/pen/XOKWYQ)

made with: scroll listener

```css
p { margin-top: 75px }
.table { -moz-box-shadow: 0px 6px 25px 0px rgba(0, 0, 0, 0.1); -webkit-box-shadow: 0px 6px 25px 0px rgba(0, 0, 0, 0.1); box-shadow: 0px 6px 25px 0px rgba(0, 0, 0, 0.1) }
.table__header { border-bottom: 2px solid #D0CCDA }
.table__col-group--scrollable { position: relative }
.table__scrollable-header-container::before { position: absolute; top: 0; bottom: 0 }
.table__header-section--right { position: relative }
.table__body-section--left { padding-bottom: 20px }
.table__body-section--right { position: relative }
.table__list li { border-bottom: 1px solid #c7c7c7 }
```

```js
addEventListener('scroll', (e) => handleScroll(headerScrollable, "horizontal"))
addEventListener('scroll', (e) => handleScroll(bodyScrollable))
addEventListener('scroll', (e) => handleScroll(bodySticky, "vertical"))
```

### [Park sticky Scroll To Top button above the footer](https://codepen.io/DannyJoris/pen/dayYpj)

held: fixed button.to-top | on scroll: button.to-top: transform+opacity | made with: position: fixed · transition · Web Animations API (.animate)

```css
.to-top { position: fixed; bottom: 10px; box-shadow: 0 0 9px 0 rgba(0, 0, 0, 0.5); background-position: center center; text-transform: uppercase; opacity: 1; transition: opacity 0.2s linear, visibility 0.2s linear }
.to-top { background-position: center 6px }
.to-top.is-hidden { opacity: 0 }
```

```js
.animate({
```

### [Simple and Responsive Timeline](https://codepen.io/erinesullivan/pen/gZNdve)

held: sticky h2, sticky h2, sticky h2, sticky h2, sticky h2, sticky h2, sticky h2, sticky h2, sticky h2 | made with: position: sticky

```css
ol.timeline > li { position: relative }
ol.timeline > li:before { position: absolute; top: 0 }
ol.timeline > li:before { transform: translateX(-50%) }
ol.timeline > li > h2 { position: -webkit-sticky; position: sticky; text-transform: uppercase; top: 0 }
ol.timeline > li > h2 { margin-bottom: 1em }
ol.timeline > li > ol > li { border-top: 2px solid #a2ed56 }
ol.timeline > li > ol > li:nth-child(even) { margin-top: 2em }
ol.timeline > li > ol > li > h3:first-child { margin-bottom: -0.75em }
```

### [📌Sticky Header Table](https://codepen.io/jakob-e/pen/ZVNOdg)

held: sticky th.ascending, sticky th, sticky th, sticky th, sticky th | on scroll: td.: background+top ×5 | made with: position: sticky · scroll() timeline · transition · :hover

```css
*, *::before, *::after { position: relative }
table thead th { position: sticky; top: 0 }
table td { border-top: 0 }
table th { box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.1) }
table th { transition: background-color 150ms }
table th:before { transition: transform 300ms, color 300ms; position: absolute; top: calc(50% - 9px) }
table .ascending:before { transform: rotate(-90deg) }
table .descending:before { transform: rotate(90deg) }
h1 { margin-bottom: 48px }
```

### [Position sticky CSS](https://codepen.io/fededirocco/pen/ebPoMb)

held: sticky div.topbar, sticky div.text-sticky, sticky div.text-sticky | made with: position: sticky

```css
.topbar { box-shadow: 0px 9px 28px 0px rgba(255,221,0,0.84); position: sticky; position: -webkit-sticky; top: 0px }
.block { background-position: center }
.block-1 { background-position: center }
.text-sticky { padding-top: 40px; position: sticky; position: -webkit-sticky; top: 100px }
```

### [Sticky responsive navbar](https://codepen.io/ccu-an-b/pen/NeBMbB)

held: sticky header, fixed button.my-toggler | made with: position: sticky · position: fixed · transition · :hover

```css
.body-container { margin-top: -300px }
.body-container { margin-top: -350px }
header { position: sticky; padding-top: 40px; transition: transform 0.4s; top: -130px; padding-bottom: 210px }
header .my-toggler { padding-top: 5px; margin-top: 10px; top: 10px; position: fixed }
header .my-toggler i:first-child { transition: all 0.4s; margin-top: 5px; transform: rotate(-40deg) skewX(0deg) }
header .my-toggler i { transition: all 0.4s; margin-top: -25px; transform: rotate(40deg) skewX(0deg) }
header .my-toggler.collapsed i:first-child { margin-top: 5px; transform: rotate(0deg) skewX(0deg) }
header .my-toggler.collapsed i { margin-top: -19px; transform: rotate(0deg) skewX(0deg) }
header img { margin-top: 30px }
header nav.my-nav { margin-top: 30px; transition: transform 0.4s; box-shadow: 6px 6px 5px rgba(0, 0, 0, 0.05) }
header nav.my-nav button.search:focus, header nav.my-nav button.search:active { box-shadow: none }
header .my-search { position: absolute; transition: all 0.5s }
```

### [Position Sticky Problem](https://codepen.io/anasrar/pen/LMBZWK)

held: sticky section, sticky section | made with: position: sticky

```css
.col-6 { padding-top: 20px }
.col-6 > section { margin-bottom: 1rem; position: sticky; position: -webkit-sticky; top: 0 }
```

### [Fixed/Sticky Position Demo](https://codepen.io/elmmo/pen/yGvvXq)

held: fixed div | made with: position: fixed

```css
#container { position: absolute; top: 0 }
#container #options { position: fixed; box-shadow: 20px 0 200px -15px rgba(0, 0, 0, 0.7) }
#container #options div { position: none }
#container #demo { position: absolute; background-position: center }
#container #demo span p { margin-top: 5% }
#container #demo div { position: none; top: 0; margin-bottom: 50px }
.active { box-shadow: 0 1px 50px white inset }
```

### [Hamburger Menu Example (jQuery)](https://codepen.io/Nuptial/pen/yGgdMZ)

held: fixed div.sticky-menu | made with: position: fixed · transition

```css
.sticky-menu { position: fixed; bottom: 0px; transition: all .5s ease }
.sticky-menu-text { position: relative; top: -20px }
.sticky-menu-text span { position: relative; top: -15px }
.sticky-menu-text span.close-button:before { position: relative; top: -10px }
.hidden-list { position: absolute; top: -140px; transition: all .5s ease }
```

### [Sticky footer & header with any height](https://codepen.io/dab512/pen/zyoddR)

held: sticky div.header, sticky div.footer | made with: position: sticky

```css
.header { position: sticky; top: 0px }
.footer { position: sticky; bottom: 0px }
```

### [CSS drawings](https://codepen.io/devieffe/pen/JwRMye)

made with: :hover

```css
.sticky { position: relative }
.sticky:after { position: absolute; bottom: 20px; top: 80%; box-shadow: 0 20px 10px #999; transform: rotate(-4deg) }
.sticky::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3) }
.notepad { position: relative; transform: scale(85%) }
.notepad .cover { box-shadow: 0 2px 5px 0px rgba(0, 0, 0, 0.4) }
.notepad .cover h3 { position: absolute; text-transform: uppercase }
.notepad .stapples { position: absolute; margin-top: -5px }
.notepad .stapple { position: relative }
.notepad .stapple-r { position: relative; top: -19px; filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#dddddd", endColorstr="#adadad",GradientType=0); border-top: 0 }
.notepad .hole { top: 18px; position: absolute; -moz-box-shadow: inset 0 10px 10px rgba(0, 0, 0, 0.35); -webkit-box-shadow: inset 0 10px 10px rgba(0, 0, 0, 0.35); box-shadow: inset 0 5px 4px rgba(0, 0, 0, 0.2); border-top: 2px solid rgba }
.pencil { position: relative; filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#eeeeee", endColorstr="#999999",GradientType=1); filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#ffd65e", endColors }
.pencil .gum { position: absolute; top: 0 }
```

### [Sticky navigation underline on hover](https://codepen.io/Nacorga/pen/JwKMZQ)

made with: Web Animations API (.animate)

```css
.nav .nav-list .nav-item { position: relative }
.nav .nav-list .nav-item .border { position: absolute; bottom: 0 }
```

```js
.animate({
```

### [Sticky Header](https://codepen.io/chryss/pen/PXqMqE)

held: sticky nav.site-header | on hover of a.: a.: color, img.img-fluid: color | made with: @keyframes

```css
.saka { animation: panaog 300ms linear; animation-fill-mode: forwards }
0% { transform: translateY(-100%) }
100% { transform: translateY(0) }
0% { -webkit-opacity: 0; -moz-opacity: 0; -ms-opacity: 0; -o-opacity: 0; opacity: 0; -webkit-transform: translateY(-100%); -moz-transform: translateY(-100%); -ms-transform: translateY(-100%); -o-transform: translateY(-100%);  }
100% { -webkit-opacity: 1; -moz-opacity: 1; -ms-opacity: 1; -o-opacity: 1; opacity: 1; -webkit-transform: translateY(0%); -moz-transform: translateY(0%); -ms-transform: translateY(0%); -o-transform: translateY(0%); transform: t }
@keyframes saka animates transform
@keyframes panaog animates -webkit-opacity, -moz-opacity, -ms-opacity, -o-opacity, opacity, -webkit-transform, -moz-transform, -ms-transform, -o-transform, transform
```

### [Landing Page with custom svg backgrounds and headroom.js](https://codepen.io/dayna-j/pen/KbwQga)

held: fixed header.header | on scroll: header.header: transform+background+top | on hover of li.navbar__nav-item: header.header: transform+top | made with: position: fixed · transition

```css
.headroom { transition: all 0.8s ease-in-out }
.header { position: fixed; top: 0 }
.headroom--pinned { transform: translateY(0%) }
.headroom--unpinned { transform: translateY(-100%) }
.navbar__nav { margin-bottom: 0 }
.section__section-1 { position: relative; background-position: bottom center }
```

### [Sticky aside JS](https://codepen.io/Goweb/pen/KrErKW)

made with: position: fixed · scroll listener

```css
aside { position: absolute; top:70px }
.fixed { position:fixed; top:10px }
.absolute { bottom:10px; top:auto }
```

```js
addEventListener("scroll",e => {
```

### [Online Tutorials / Full Screen Animated Sticky Header | Sticky Navigation Bar After Scroll with Html CSS and jQuery](https://codepen.io/corvus-007/pen/rQPerd)

held: fixed header.page-header, fixed a.page-header__logo | on scroll: img.page-header__banner: opacity, a.page-header__logo: transform+top, nav.page-header__nav: transform+opacity | on hover of img.page-header__banner: img.page-header__banner: opacity, a.page-header__logo: transform+top, nav.page-header__nav: transform+opacity | made with: position: fixed · transition · :hover · mix-blend-mode · scroll listener

```css
body { padding-top: 100px }
.page-header { position: fixed; top: 0; transition: 1s }
.page-header__banner { position: absolute; top: 0; transition: 1s }
.page-header--scrolled .page-header__banner { opacity: 0 }
.page-header__logo { position: fixed; top: 50%; transform: translate(-50%, -50%); transition: 1s; filter: invert(1); mix-blend-mode: overlay }
.page-header__logo:hover, .page-header__logo:focus { filter: invert(1) drop-shadow(0 0 6px #ffffff) }
.page-header--scrolled .page-header__logo { top: 10px; transform: none; mix-blend-mode: screen }
.logo__image { transition: 1s }
.page-header__nav { transform: translatex(100px); opacity: 0; transition: 1s }
.page-header--scrolled .page-header__nav { transform: translatex(0); opacity: 1 }
.main-nav { position: relative }
.main-nav__list { position: relative; transition: 1s }
```

```js
addEventListener('scroll', function () {
```

### [Basic Sticky Positioning](https://codepen.io/Tipue/pen/pQOaoV)

held: sticky div.sticky | made with: position: sticky

```css
.sticky { position: sticky; position: -webkit-sticky; top: 20px; text-transform: uppercase }
.box-1 { text-transform: uppercase }
.box-2 { margin-top: 20px }
```

### [Sticky header with Scrollup Reveal](https://codepen.io/dicson/pen/yQKZbe)

on scroll: div.component-header: transform+shadow+top | made with: position: fixed · scroll() timeline · transition

```css
header { position: rlative }
header .component-header { position: absolute; top: 0; text-transform: uppercase }
header .component-header.sticky { position: fixed; transform: translate3d(0, -100%, 0); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) }
header .component-header.sticky.animation { will-change: transform; transition: transform 0.4s ease-in-out }
header .component-header.sticky.reveal { transform: translate3d(0, 0, 0) }
header .component-header h1 small { opacity: 0.5 }
```

### [Pure CSS sticky element](https://codepen.io/pierrinho/pen/yQvVPb)

held: sticky div.sticky, fixed a.pv-logo | made with: position: sticky · position: fixed

```css
main { position: relative }
main .sticky { position: sticky; top: 0 }
.pv-logo { position: fixed; top: 30px }
```

### [left sticky menu(slide )](https://codepen.io/jingeing/pen/RqxedP)

held: fixed div.ab | on hover of a.: a.: color, i.fas: color | made with: position: fixed

```css
.ab { position: fixed; top: 100px }
.width { margin-top: 8px }
```

### [Float info button](https://codepen.io/mrfreedom/pen/pQWBqP)

held: fixed a.info-float | on hover of a.info-float: a.info-float: background | made with: position: fixed · transition · :hover

```css
a { -webkit-transition: all .25s ease; transition: all .25s ease }
a.info-float { position: fixed; bottom: 40px; box-shadow: 0 16px 24px 2px rgba(0,0,0,0.14),0 6px 30px 5px rgba(0,0,0,0.12),0 8px 10px -7px rgba(0,0,0,0.2) }
```

### [// SSSC Prototype //](https://codepen.io/LimeWub/pen/GwMXag)

held: sticky div.career-path__head, sticky div.career-path__section-header, sticky h2.career-path__level-header, sticky svg.[object, sticky svg.[object, sticky h2.career-path__level-header, sticky svg.[object, sticky svg.[object, sticky div.career-path__section-header, sticky h2.career-path__level-header | made with: position: sticky · transition · :hover

```css
[data-sticky] { position: sticky; position: -webkit-sticky; top: 0 }
.accessible-hide { position: absolute; top: auto }
.accordion__trigger ~ label { transition: background 0.15s ease-in-out }
.accordion__trigger ~ label:after { border-bottom: 0; transform: rotate(135deg); transition: transform 0.15s ease-in-out }
.accordion__trigger:checked ~ label:after { transform: rotate(-45deg) translatey(0.25em) }
.accordion--animate { transition: max-height 0.3s cubic-bezier(0, 1, 0, 1) }
.accordion__trigger:checked ~ .accordion--animate { transition: max-height 0.3s cubic-bezier(1, 0, 1, 0) }
.career-path__head--explanation { text-transform: uppercase }
.career-path__head--more-info { text-transform: uppercase }
.career-path__section-header h1 { text-transform: uppercase }
.career-path__option label { border-bottom: 1px solid }
```

### [CSS Sticky Sidebar](https://codepen.io/emregur/pen/wQJWOJ)

held: sticky span.sticky | made with: position: sticky

```css
.content { position: relative }
.sticky { position:sticky; top:10px }
```

### [Cool Sticky Header Design](https://codepen.io/baberparweez/pen/gBNOVB)

held: fixed header | made with: position: fixed · scroll() timeline · transition · :hover

```css
header { position: fixed; top: 0 }
header .primary-header { position: relative; transition: all 0.5s ease 0s }
header .primary-header .logo-icon { transition: all 0.5s ease 0s }
header .primary-header .searchform { position: absolute; top: 50%; transform: translateY(-50%) }
header .primary-header .searchform input[type=search] { margin-bottom: 0; transition: all 0.5s ease 0s }
header .primary-header button[type=submit], header .primary-header .search-label { box-shadow: none; top: 0 !important }
header .primary-header button[type=submit] { opacity: 0; position: absolute }
header .secondary-header ul li a { transition: all 0.3s ease-in-out }
header .secondary-header ul li a:hover { transition: all 0.3s ease-in-out }
```

### [Vue | Sticky sidebar – fund page](https://codepen.io/tiffachoo/pen/mzLNya)

made with: transition · :hover · scroll listener

```css
.sidebar-header, .hero .subheader { text-transform: uppercase }
a { position: relative; border-bottom: dotted 1px; transition: 0.2s }
a::after { position: absolute; top: 0; transform: scaleX(0); transition: 0.25s ease-in-out }
a:hover { border-bottom: solid 1px; transition: 0.2s 0.15s }
a:hover::after { transform: scaleX(1) }
.list-blox > li { text-transform: uppercase }
.table thead th { padding-bottom: 0; border-bottom: solid 4px #a483c5; text-transform: uppercase }
.table tbody th, .table tbody td { border-bottom: solid 2px #eaeaea }
.section-block:first-of-type { padding-top: 0 }
.section-block-header { margin-bottom: 0.5rem; text-transform: uppercase }
.hero { margin-top: 2.5rem; margin-bottom: 2rem }
.hero h1 { text-transform: uppercase }
```

```js
addEventListener('scroll', this.handleScroll)
```

### [Position:sticky IE support](https://codepen.io/tusharshukla/pen/QZQvXL)

held: sticky div.laadla | made with: position: sticky · position: fixed · scroll listener

```css
.bro { position: relative }
.laadla { position: relative; position: sticky; top: 0px }
.laadla.sticky { position: fixed; top: 5px }
```

```js
addEventListener("scroll", () => {
```

### [Glitch and Sticky Text](https://codepen.io/christhuong/pen/XxzNWK)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
canvas { filter: blur(1px) }
```

```js
addEventListener('mousemove', e => {
requestAnimationFrame(run)
```

### [No idea what I should name this](https://codepen.io/Smakosh/pen/VEMVdL)

held: fixed nav | on scroll: a.link: color | made with: position: fixed

```css
nav { border-bottom: 1px solid #212121; position: fixed }
```

### [Quick Demo Template](https://codepen.io/nikname/pen/gBLdpp)

held: fixed header, sticky div.sticky | made with: position: sticky · position: fixed · transition · :hover · scroll listener

```css
main p, main ul, main h1, main h4, main img, main div { opacity: 0; transform: translate3d(0, 200px, 0); transition: transform 500ms ease, opacity 500ms ease }
body.ready main p, body.ready main ul, body.ready main h1, body.ready main h4, b { opacity: 1; transform: translate3d(0, 0, 0) }
button { box-shadow: 0 0 15px 0 #fdbfcf; transition: box-shadow 500ms ease }
button:hover { box-shadow: 0 0 15px 0 #dd3662 }
.sticky { top: 100px; position: sticky }
header { position: fixed; top: 0; transition: height 500ms ease }
main .hero { background-position: center center }
```

```js
addEventListener('scroll',function() {
```

### [css sticky](https://codepen.io/zyla83/pen/JmRgwd)

held: sticky header, sticky footer, sticky header, sticky footer, sticky header, sticky footer, sticky header, sticky footer, sticky header, sticky footer | made with: position: sticky

```css
header { position: -webkit-sticky; position: sticky; top: -1px }
footer { position: -webkit-sticky; position: sticky; bottom: -1px }
section { margin-bottom: 3rem }
```

### [Bubbly clouds](https://codepen.io/tiffachoo/pen/VEKmpr)

held: fixed div.waddle-dee | on scroll: div.waddle-eye: transform+top ×2, div.waddle-foot: transform+top ×2, div.waddle-dee: transform+top | made with: position: fixed · @keyframes · transition · scroll listener

```css
.waddle-dee { position: fixed; top: 15rem; -webkit-animation: sway-sm 5s infinite linear; animation: sway-sm 5s infinite linear }
.waddle-dee.is-sitting { position: absolute; -webkit-animation: auto; animation: auto }
.waddle-dee.is-sitting .parasol { transform: translateY(-2000px) translateX(-50%); transition: transform 3s ease-out }
.waddle-dee.is-sitting .waddle-arm-left { transform: rotate(-90deg) }
.waddle-dee.is-sitting .waddle-arm-right { transform: rotate(70deg); -webkit-animation: arm-wave-right 0.6s 0.45s infinite; animation: arm-wave-right 0.6s 0.45s infinite }
.waddle-body { position: relative }
.waddle-face { position: absolute; top: 1.5rem; transform: translateX(-50%) }
.waddle-face::after { position: absolute; top: calc(100% - 0.75rem); transform: translateX(-50%) }
.waddle-blush { position: absolute; top: 2.75rem; opacity: 0.4 }
.waddle-eye { position: absolute; top: 1.25rem; -webkit-animation-name: blinky; animation-name: blinky; -webkit-animation-duration: 7s; animation-duration: 7s; -webkit-animation-iteration-count: infinite; animation-iteration-count: in }
.waddle-eye::after { position: absolute; top: 0.125rem; transform: translateX(-50%) }
.waddle-arm { position: absolute; top: -1.75rem; transition: 0.25s ease-out }
```

```js
addEventListener('scroll', handleScroll)
```

### [CSS Sticky Element](https://codepen.io/dicson/pen/GYJOPB)

held: sticky img, sticky img, sticky img, sticky img | made with: position: sticky

```css
img { position: sticky; position: -webkit-sticky; top: 30px }
```

### [Sticky Footer Cookie Notice](https://codepen.io/zoltangero/pen/BqBYZV)

held: sticky div.cookie-notice | made with: position: sticky

```css
.cookie-notice { position: sticky; bottom: 0; border-top: 1px solid #faf3ee }
```

### [Sticky footer](https://codepen.io/Smakosh/pen/VEZwVN)

made with: nothing recognised — read the code

### [Sticky navigation](https://codepen.io/tchx/pen/NLZxPy)

on hover of a.nav-link: a.nav-link: background+color | made with: position: fixed · scroll() timeline · transition · :hover · Web Animations API (.animate)

```css
section { position: relative }
p { opacity: 0.7 }
.nav-bar { position: relative; top: 0 }
.nav-bar-fixed { position: fixed }
.nav-link { transition: all 0.25s ease-in-out }
.nav-slider { position: absolute; bottom: 0; transition: left 0.2s ease-in-out }
```

```js
.animate({ scrollTop: scroll }, 400)
```

### [hide nav on scroll, show on backscroll](https://codepen.io/tomhermans/pen/RYeGKW)

held: fixed div.site-header | made with: position: fixed · scroll() timeline · transition

```css
.site-header { transition: all 0.15s }
.site-header.is-fixed { position: fixed; top: 0 }
.site-header.nav-up { top: -160px }
.site-header__nav li a { text-transform: uppercase }
```

### [test](https://codepen.io/h_sasaki/pen/aaKXrG)

held: sticky div.sticky | made with: position: sticky

```css
.sticky { position: -webkit-sticky; position: sticky; top: 10px }
```

### [Sticky sidebar CSS Grid](https://codepen.io/oliverjam/pen/gdKRGw)

held: sticky div.sidebar | made with: position: sticky

```css
.grid > * + * { margin-top: 1rem }
.sidebar { margin-top: 0; position: sticky; top: 1rem }
```

### [Sticky-kit Example](https://codepen.io/swetankrathi/pen/GXORGe)

made with: nothing recognised — read the code

```css
.outer-wrapper { padding-top: 20px; padding-bottom:20px }
.main-content img { margin-bottom: 20px }
```

### [Flex Table with Sticky Header](https://codepen.io/leonardohcl/pen/yxojYK)

held: fixed button, sticky div.row | on hover of button.: button.: opacity | made with: position: sticky · position: fixed · @keyframes · transition · :hover

```css
body { padding-bottom: 70px }
#load-button { position: fixed; bottom: 24px; transition: all 0.22s }
#load-button:hover { opacity: 0.9 }
#load-button:active { transform: scale(0.9) }
#load-button.loading { -webkit-animation: pulse 1s ease-out infinite; animation: pulse 1s ease-out infinite }
.container { position: relative }
.row { border-bottom: solid 1px #727272 }
.row.header { position: sticky; top: 0 }
0% { box-shadow: 0 0 0 0 #b9f6ca }
30% { box-shadow: 0 0 0 5px #b9f6ca }
100% { box-shadow: 0 0 0 15px #b9f6ca00 }
0% { box-shadow: 0 0 0 0 #b9f6ca }
```

### [Intelligent Sticky Sidebar - no libraries, no jQuery - sticks to top and bottom, no jQuery - just CSS and vanilla Javascript](https://codepen.io/Jeyjoo/pen/YOQxBx)

made with: position: fixed

```css
#sidebar { position:relative }
#wrapper.fix-bottom-VP #sc,#wrapper.fix-top-VP #sc { position:fixed }
#wrapper.fix-bottom-VP #sc { bottom:15px }
#wrapper.fix-top-VP #sc { top:15px }
```
