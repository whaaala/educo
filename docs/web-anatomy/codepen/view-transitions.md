# CodePen · view-transitions — how each pen does it

16 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/view-transitions.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| view transitions | 15 |
| transition | 12 |
| :hover | 11 |
| @keyframes | 9 |
| prefers-reduced-motion | 8 |
| position: fixed | 7 |
| :focus-visible | 5 |
| clip-path | 3 |
| custom properties driven by JS | 3 |
| :has() | 2 |
| mask | 2 |
| scroll-snap | 2 |
| mix-blend-mode | 2 |
| (hover: hover) gate | 1 |
| backdrop-filter | 1 |
| Web Animations API (.animate) | 1 |
| popover | 1 |
| position: sticky | 1 |
| scroll-driven animation (animation-timeline) | 1 |
| scroll() timeline | 1 |
| <dialog> | 1 |

## Every pen

### [Reveal Card](https://codepen.io/editor/Sensiblemnd/pen/01a0d616-85e8-7db2-8b80-d576c40f4929)

made with: view transitions · @keyframes · transition · :hover · :focus-visible · :has() · (hover: hover) gate · prefers-reduced-motion · clip-path · mask

```css
:where(a):focus-visible, :where(button):focus-visible { outline-offset: 2px }
.demo-card-link:hover { box-shadow: var(--shadow-raised) }
:root { --focus-ring-offset: 3px }
&::before { position: absolute; inset: 0; background-position: center; mask-image: radial-gradient(closest-side, black 55%, transparent) }
&:has([aria-expanded="true"]) { --topo-opacity: 1 }
&:has(:focus-visible) { outline-offset: var(--focus-ring-offset) }
& :where(.topo) { position: absolute; inset: 0; opacity: var(--topo-opacity) }
& :where(.pointer) { clip-path: polygon(0 0, 100% 0, 50% 100%) }
&::after { position: absolute; inset: 0 }
& :where(.meta) { text-transform: uppercase }
& :where(.topo) { view-transition-name: var(--topo-name) }
& :where(.frame) { view-transition-name: var(--vt-frame, none) }
```

```js
startViewTransition(async () => {
```

### [Morph Flyer to Poster with View Transitions API](https://codepen.io/AllThingsSmitty/pen/gbmprrZ)

on hover of button.flyer: button.flyer: transform | made with: view transitions · transition · :hover · :focus-visible · prefers-reduced-motion · custom properties driven by JS

```css
.tag { text-transform: uppercase; transform: rotate(-2deg) }
h1 { text-transform: uppercase }
&:hover { transform: rotate(0deg) translateY(-3px) }
&:focus-visible { outline-offset: 3px }
.art { border-bottom: 4px solid var(--text) }
.venue-line { text-transform: uppercase }
.band-name { text-transform: uppercase }
.art { border-bottom: 5px solid var(--text) }
.venue-line { text-transform: uppercase }
.band-name { text-transform: uppercase }
.date-stamp { margin-bottom: 20px }
.cta { box-shadow: 5px 5px 0 var(--text); text-transform: uppercase }
```

```js
style.setProperty("--tilt", f.tilt + "deg")
startViewTransition(update)
```

### [One Page, Two Worlds — Day/Night with View Transitions #CodePenChallenge](https://codepen.io/editor/jerora98/pen/019fbd1c-bb18-7403-b8fb-55b4197e41e6)

held: fixed div.backdrop | made with: position: fixed · view transitions · @keyframes · transition · :hover · :focus-visible · prefers-reduced-motion · clip-path · custom properties driven by JS

```css
body { transition: background-color 320ms cubic-bezier(0.16, 1, 0.3, 1), color 320ms cubic-bezier(0.16, 1, 0.3, 1) }
#app { position: relative }
.backdrop { position: fixed; inset: 0 }
.backdrop::before, .backdrop::after { position: absolute; filter: blur(80px); transition: background-color 320ms cubic-bezier(0.16, 1, 0.3, 1) }
.backdrop::before { top: -20vw }
.backdrop::after { bottom: -25vw }
.page { position: relative }
.theme-toggle { transition: background-color 320ms cubic-bezier(0.16, 1, 0.3, 1), border-color 320ms cubic-bezier(0.16, 1, 0.3, 1) }
.theme-toggle:focus-visible { outline-offset: 2px }
.theme-toggle__icon { transition: color 320ms cubic-bezier(0.16, 1, 0.3, 1) }
.hero__eyebrow { text-transform: uppercase }
.hero__cta { margin-top: 28px; transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 16px 32px -18px var(--shadow) }
```

```js
style.setProperty('--x', `${e.clientX}px`)
style.setProperty('--y', `${e.clientY}px`)
```

### [View Transition API](https://codepen.io/editor/ikrprojects/pen/019f9aa5-b4bf-793e-99e5-5f17f7c43b8d)

held: fixed fixedbg | on hover of a.: a.: background | made with: position: fixed · scroll-snap · view transitions · :hover · prefers-reduced-motion · mask · backdrop-filter · mix-blend-mode

```css
article { view-transition-name: --article }
figure { view-transition-name: --figure }
.price { view-transition-name: --price }
h2 { view-transition-name: --subtitle }
.intro { view-transition-name: --intro }
::view-transition-old(*), ::view-transition-new(*) { mix-blend-mode: normal }
::view-transition-group(*) { animation-duration: 0.5s; animation-timing-function: ease-in-out }
::view-transition-group(--article) { -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); opacity: 1 !important }
article { -webkit-backdrop-filter: blur(10px); opacity: 1; view-transition-name: --article; padding-bottom: 75px }
.price { padding-bottom: 20px }
article { -webkit-backdrop-filter: blur(10px); opacity: 1; view-transition-name: --article }
figure { view-transition-name: --figure }
```

### [View Transitions: The Blink Fix](https://codepen.io/semanticdata/pen/azZYeza)

held: fixed div.fab-wrapper | made with: position: fixed · view transitions · @keyframes · transition · :hover · prefers-reduced-motion · clip-path

```css
body { transition: background-color 0.3s ease, color 0.3s ease }
h1 { view-transition-name: main-title }
h1 span.accent { transition: text-shadow 0.3s ease }
.card { transition: transform 0.4s var(--ease-out-expo), border-color 0.3s ease }
.card h3 { text-transform: uppercase }
.footer-cta { opacity: 0; animation: fadeIn 0.5s ease forwards 0.8s }
.footer-cta a { text-underline-offset: 4px }
to { opacity: 1 }
.fab-wrapper { position: fixed }
.fab-btn { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); transition: transform 0.3s var(--ease-out-expo), background-color 0.3s, box-shadow 0.3s; view-transition-name: magic-button }
[data-theme="party"] .fab-btn { box-shadow: 0 0 30px var(--color-accent) }
.fab-btn:hover { transform: scale(1.1) rotate(-10deg) }
```

```js
startViewTransition(() => updateDOM())
```

### [View Transition Theme](https://codepen.io/im-allan/pen/dPXzYdW)

made with: view transitions · transition · prefers-reduced-motion · mix-blend-mode · Web Animations API (.animate)

```css
body { transition: color 0.2s }
::view-transition-new(root), ::view-transition-old(root) { animation: none; mix-blend-mode: normal }
h1 { text-transform: uppercase; opacity: 0.8; margin-bottom: 2rem }
.toggle-label { position: relative; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); transition: background 0.3s }
.toggle-thumb { position: absolute; top: var(--pad); transition: transform 0.4s cubic-bezier(0.6, 0.05, 0.2, 1.1), background 0.3s; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) }
.toggle-checkbox:checked + .toggle-label .toggle-thumb { transform: translateX(calc(var(--w) - var(--sz) - var(--pad) * 2)) }
.icon { position: absolute; transition: 0.4s ease }
.sun { opacity: 1; transform: rotate(0) scale(1) }
.moon { opacity: 0; transform: rotate(-90deg) scale(0.5) }
.toggle-checkbox:checked + .toggle-label .sun { opacity: 0; transform: rotate(90deg) scale(0.5) }
.toggle-checkbox:checked + .toggle-label .moon { opacity: 1; transform: rotate(0) scale(1) }
```

```js
startViewTransition(() => {
.animate({
```

### [Progressive Disclosure Flow Without View Transitions](https://codepen.io/OuterVale/pen/azdOgVq)

on hover of button.button: button.button: filter | made with: transition

```css
#progressBar { transition: width 1s ease }
```

### [Tabs - View Transitions](https://codepen.io/semanticdata/pen/QwyWjNv)

held: fixed div.support-status | on scroll: button.tab-button: background | made with: position: fixed · view transitions · @keyframes · transition · :hover · :focus-visible · prefers-reduced-motion

```css
.container { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) }
.tab-nav { border-bottom: 1px solid #ddd }
.tab-button { position: relative; border-bottom: 3px solid transparent }
.tab-button.active::after { position: absolute; bottom: -2px; view-transition-name: tab-indicator }
.tab-content { position: relative }
.tab-panel { will-change: transform, opacity }
:root { view-transition-name: none }
::view-transition-group(tab-indicator) { animation-duration: 0.4s; animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1) }
::view-transition-old(active-tab) { animation: 100ms ease-in both fade-out, 200ms cubic-bezier(0.4, 0, 0.6, 1) both slide-out-left }
::view-transition-new(active-tab) { animation: 150ms ease-out 50ms both fade-in, 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-in-right }
from { opacity: 1 }
to { opacity: 0 }
```

```js
startViewTransition(() => {
```

### [Tabs - View Transitions - Old](https://codepen.io/semanticdata/pen/emJYpJM)

held: fixed div.support-status | made with: position: fixed · view transitions · @keyframes · :hover · :focus-visible · prefers-reduced-motion

```css
.container { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) }
.tab-nav { border-bottom: 1px solid #ddd }
.tab-button { position: relative; border-bottom: 3px solid transparent }
.tab-button.active::after { position: absolute; bottom: -2px; view-transition-name: tab-indicator }
.tab-content { position: relative }
.tab-panel { position: absolute; top: 0; will-change: transform, opacity; opacity: 0 }
.tab-panel.active { opacity: 1 }
:root { view-transition-name: none }
::view-transition-group(tab-indicator) { animation-duration: 0.4s; animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1) }
::view-transition-old(active-tab) { animation: 100ms ease-in both fade-out, 200ms cubic-bezier(0.4, 0, 0.6, 1) both slide-out-left }
::view-transition-new(active-tab) { animation: 150ms ease-out 50ms both fade-in, 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-in-right }
from { opacity: 1 }
```

```js
startViewTransition(callback)
```

### [toast-queue - stacked](https://codepen.io/andreruffert/pen/MYwBQew)

held: fixed toast-queue | made with: view transitions · transition · :hover · :has() · popover

```css
toast-queue [data-part="item"]:is([data-dragging]) { opacity: calc(1 - var(--tq-swipe-distance, 0)) }
toast-queue [data-part="toast"] { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.102); position: relative }
[data-part="toast"] [data-part="close-button"] { position: absolute; bottom: 100%; translate: 50% 50%; opacity: 0; transition: opacity 0.3s ease-in-out }
toast-queue [data-part="toast"]:hover [data-part="close-button"], toast-queue [d { opacity: 1 }
toast-queue [data-part="menu"] { view-transition-name: tq-menu }
::view-transition-new(.tq-menu):only-child { animation-name: enter }
::view-transition-old(.tq-menu):only-child { animation-name: exit }
```

### [Square Dancing with View Transitions](https://codepen.io/collinsworth/pen/gbYvwwQ)

made with: view transitions · transition

```css
body { transition: background 0.25s linear }
body::before { position: absolute; inset: 0 }
.warning { position: relative }
.box { position: absolute; transform: scale(1) rotate(0deg); transition: all 0.25s cubic-bezier(1, 0, 0, 1) }
html::view-transition-group(*) { animation-timing-function: cubic-bezier(1, 0, 0, 1); animation-fill-mode: both }
.box:nth-child(1) { view-transition-name: card-1 }
html::view-transition-group(card-1) { animation-delay: 0.05s }
.box:nth-child(2) { view-transition-name: card-2 }
html::view-transition-group(card-2) { animation-delay: 0.1s }
.box:nth-child(3) { view-transition-name: card-3 }
html::view-transition-group(card-3) { animation-delay: 0.15s }
.box:nth-child(4) { view-transition-name: card-4 }
```

```js
startViewTransition(() => {
```

### [2048 Game (View Transition API)](https://codepen.io/rstainsby/pen/dyxpXXB)

held: fixed div.banner, fixed div | made with: position: fixed · view transitions · @keyframes · :hover

```css
.banner { position: fixed; top: 0 }
.banner > p > a:hover { filter: brightness(0.8) }
#win-overlay { position: fixed; top: 0 }
.win-overlay__message { text-transform: uppercase; animation: color-loop 5s infinite }
.tile { animation: 0.3s pop-in cubic-bezier(0.42, 0.1, 0.65, 0.92) forwards }
::view-transition-group(*.tile) { animation-duration: 200ms }
.tile--background { opacity: 0.2 }
0% { transform: scale(0%) }
100% { transform: scale(100%) }
@keyframes pop-in animates transform
```

```js
startViewTransition(renderLoop)
```

### [view transitions](https://codepen.io/afa34/pen/WNPOzBr)

made with: view transitions · transition · :hover

```css
.wrapper input[type=radio]:checked + .item:hover { box-shadow: 3px 3px 10px #b2b2b2 }
.item { box-shadow: 3px 3px 10px #b2b2b2; transition: 0.3s box-shadow ease }
.item:hover { box-shadow: 4px 4px 8px #949494 }
.item img { object-position: center center }
::view-transition-old(root), ::view-transition-new(root) { animation-duration: 0.5s }
```

```js
startViewTransition(() => e.target.checked = true)
```

### [Open Props - Image Gallery - View Transitions API & Scroll-Driven Animations](https://codepen.io/mobalti/pen/ExGBdpd)

held: sticky header, fixed div.controls, fixed button.closeDialog | made with: position: sticky · position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · scroll-snap · view transitions · @keyframes · transition · :hover · <dialog>

```css
&::after { inset: 0; position: absolute; background-position: top var(--size-1) right var(--size-1); opacity: 0; transition: 0.2s ease }
&:hover::after { opacity: 1 }
.dialog-container { position: relative }
.closeDialog { position: fixed }
&::after { position: absolute; inset: 0; background-position: center; animation: var(--animation-fade-out) var(--fade-duration) forwards, var(--fade-duration) op-hide 1s forwards }
> * { scroll-snap-align: center }
&.preview { animation-name: preview }
&.next { animation-name: next }
@keyframes op-hide animates visibility
@keyframes preview animates visibility
@keyframes next animates visibility
```

```js
startViewTransition(() => dialog.showModal())
startViewTransition(() => dialog.close())
```

### [View Transitions - Simple State Example](https://codepen.io/rbanning/pen/RwqLRoe)

made with: view transitions · @keyframes · transition

```css
to { transform: translateX(400px) }
.box { position: relative }
.activated { rotate: 180deg }
.box-old-school { transition: all 1s var(--timingFn) }
.box-3 { view-transition-name: box-3 }
.box-4 { view-transition-name: box-4 }
::view-transition-group(box-4) { animation-duration: 1s; animation-timing-function: var(--timingFn) }
@keyframes activateBox animates transform
```

```js
startViewTransition(() => {
```

### [Image gallery animation with View Transitions](https://codepen.io/huijing/pen/abRgNEb)

made with: view transitions · @keyframes · custom properties driven by JS

```css
from { transform: scale(0) }
to { transform: scale(1) }
from { transform: translateX(0) }
to { transform: translateX(-100%) }
::view-transition-new(main-image) { animation: 400ms ease-out both grow }
figure { view-transition-name: main-image }
.image-heading { view-transition-name: dinosaur }
p { margin-bottom: 0.5em }
figure { position: relative }
.image-heading { position: absolute; bottom: 0 }
main::after { position: absolute; top: 0 }
@keyframes grow animates transform
```

```js
style.setProperty( "--originY",
startViewTransition(() => displayNewImage())
```
