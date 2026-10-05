# CodePen · view-transition — how each pen does it

24 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/view-transition.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| view transitions | 23 |
| :hover | 16 |
| @keyframes | 15 |
| transition | 15 |
| position: fixed | 7 |
| custom properties driven by JS | 4 |
| prefers-reduced-motion | 4 |
| mask | 3 |
| backdrop-filter | 3 |
| mix-blend-mode | 3 |
| :has() | 3 |
| :focus-visible | 2 |
| 3D (perspective / preserve-3d) | 2 |
| scroll-snap | 1 |
| position: sticky | 1 |
| (hover: hover) gate | 1 |
| GSAP | 1 |
| IntersectionObserver | 1 |
| scroll-driven animation (animation-timeline) | 1 |
| scroll() timeline | 1 |
| @starting-style | 1 |
| clip-path | 1 |
| requestAnimationFrame | 1 |
| Web Animations API (.animate) | 1 |

## Every pen

### [Two! #view-transitions](https://codepen.io/editor/cbolson/pen/019faeba-f90c-70c1-ad6a-f0dacb4ad064)

on hover of button.: button.: background | made with: position: fixed · view transitions · @keyframes · transition · :hover · :focus-visible · 3D (perspective / preserve-3d) · custom properties driven by JS

```css
&:focus-visible { outline-offset: 4px }
main { position: relative; box-shadow: 0 0 15px 10px rgb(3 3 3 / .05) }
&:disabled { opacity: .35 }
* { transition: opacity 150ms ease-in-out, transform 150ms ease-in-out, scale 150ms ease-in-out }
svg { scale: 1.25 }
[data-label] { opacity: 0; scale: 0; translate:0 -20px }
[data-label], svg { scale: .8; opacity: 1; transform: translateY(10px) }
[data-value] { scale: 1.15 }
[data-field="indicator"] { position: absolute; inset: 0px }
&.current [data-field="indicator"] { view-transition-name: current-language }
.word { view-transition-name: word; perspective: 800px }
[data-field="nativeName"] [data-value] { view-transition-name: nativeName }
```

```js
style.setProperty("--accent",word.colour)
startViewTransition(update)
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

### [View Transition API Demo – Pseudo Page Transition](https://codepen.io/tkdev-hub/pen/bNwKyQX)

made with: position: sticky · view transitions · @keyframes · transition · :hover · backdrop-filter

```css
.topbar { border-bottom: 1px solid var(--line); backdrop-filter: blur(10px); position: sticky; top: 0 }
.eyebrow { text-transform: uppercase }
.demo-card { box-shadow: var(--shadow); transition: transform 0.18s ease, border-color 0.18s ease }
.demo-card:hover { transform: translateY(-2px) }
.demo-card strong { margin-bottom: 10px }
.card-label { margin-bottom: 14px; text-transform: uppercase }
.back-button { margin-bottom: 20px }
.detail-panel { box-shadow: var(--shadow) }
::view-transition-old(root), ::view-transition-new(root) { animation-duration: 0.4s; animation-timing-function: ease }
::view-transition-old(root) { animation-name: page-out }
::view-transition-new(root) { animation-name: page-in }
from { opacity: 1; transform: scale(1); filter: blur(0) }
```

```js
startViewTransition(() => {
```

### [Shuffling cards with view transition API](https://codepen.io/mj-watts/pen/KwMLZdg)

on scroll: div.grid-item: transform+filter+shadow+top | on hover of a.link: div.grid-item: transform+filter+shadow+top | made with: position: fixed · view transitions · @keyframes · transition · :hover · (hover: hover) gate · prefers-reduced-motion · mask · 3D (perspective / preserve-3d) · custom properties driven by JS · GSAP

```css
::view-transition-group(grid) { animation-duration: 0 }
::view-transition-new(.grid-item) { animation: newIn 400ms cubic-bezier(0.2, 0.8, 0.2, 1) both }
from { transform: scale(1.2) }
to { transform: scale(1) }
.grid { perspective: 1100px }
.grid-item { position: relative; box-shadow: 0 16px 28px rgba(0, 0, 0, 0.18), 0 2px 0 rgba(255, 255, 255, 0.7) inset, 0 0 0 1px rgba(255, 255, 255, 0.6) inset; transition: transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 22 }
.grid-item::before { position: absolute; inset: 10px; transform: translateZ(1px) }
.grid-item::after { position: absolute; top: 10px; opacity: 0.9; transform: translateZ(2px) }
.grid-item > * { transform: translateZ(3px) }
.grid-item span, .grid-item strong, .grid-item em { transform: translateZ(3px) }
.grid-item::after { position: absolute; top: 10px; opacity: 0.9; transform: translateZ(2px) }
.grid-item::after { top: 10px }
```

```js
gsap.registerPlugin(Draggable)
style.setProperty("--speed", config.speed)
startViewTransition(() => {
startViewTransition(() => applyConfig())
gsap.to(this.target, {
```

### [View transitions scroll effect](https://codepen.io/kazmi066/pen/ByKwrjB)

on scroll: img.hero__image: opacity+top ×4, div.grid-section__placeholder: opacity+top ×4, img.grid-section__image: opacity+top ×4 | made with: view transitions · transition · :hover · IntersectionObserver

```css
.hero { position: relative; border-bottom: 1px solid var(--color-border-strong) }
.hero__title { margin-bottom: 1.5rem }
.hero__subtitle { margin-bottom: 2.5rem }
.button { transition: all var(--transition-base) }
.button--primary:hover { transform: translateY(-1px) }
.hero__image { position: absolute; opacity: 1; transition: opacity var(--transition-fast) }
.hero__image--1 { top: 8% }
.hero__image--2 { top: 10% }
.hero__image--3 { bottom: 12% }
.hero__image--4 { bottom: 15% }
.hero__image--transitioning-1 { view-transition-name: image-1 }
.hero__image--transitioning-2 { view-transition-name: image-2 }
```

```js
new IntersectionObserver(
startViewTransition(() => {
```

### [View Transitions Gallery](https://codepen.io/LasseStilvang/pen/MYKKrJv)

held: fixed div.theme-switcher, fixed div.detail-view | on scroll: div.card: transform+shadow+top | on hover of div.card: div.card: transform+shadow+top ×2 | made with: position: fixed · view transitions · @keyframes · transition · :hover · prefers-reduced-motion · backdrop-filter

```css
.header { margin-bottom: 3rem }
.header h1 { margin-bottom: 1rem; view-transition-name: main-title }
.header p { opacity: 0.9; view-transition-name: subtitle }
.gallery { margin-bottom: 3rem }
.card { box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease, box-shadow 0.3s ease; backdrop-filter: blur(10px) }
.card:hover { transform: translateY(-10px); box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2) }
.card-image { margin-bottom: 1rem }
.card-title { margin-bottom: 0.5rem }
.detail-view { position: fixed; top: 0; backdrop-filter: blur(20px) }
.detail-content { box-shadow: 0 40px 80px rgba(0, 0, 0, 0.3) }
.detail-title { margin-bottom: 1rem }
.detail-description { margin-bottom: 2rem }
```

```js
startViewTransition(() => {
```

### [Squircles Gallery with view-transition](https://codepen.io/cbolson/pen/NPqrxbb)

made with: scroll-driven animation (animation-timeline) · scroll() timeline · view transitions · @starting-style · transition · :hover · :has() · clip-path

```css
& > img { scale: var(--img-zoom, 1.5); opacity: var(--img-opacity, 1); transition: scale var(--trans-image-zoom) ease-in-out, opacity 150ms ease-in-out }
&::before { position: absolute; inset: 0 }
@starting-style { translate: -50% 90px; opacity: 0 }
.sr-only { position: absolute !important }
```

```js
startViewTransition(() => swapItems(clickedItem))
```

### [view-transitions api image gallery (adapted from Kevin Powell demo)](https://codepen.io/cbolson/pen/bNdVjRe)

made with: view transitions

```js
startViewTransition(() => swapItems(clickedItem))
```

### [Pagination](https://codepen.io/bear320/pen/XJWYJGZ)

made with: view transitions · @keyframes · transition · :hover

```css
body .slider-container { position: relative; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) }
body .slider-container .slide-wrapper { position: relative }
body .slider-container .slide-wrapper .slide { position: absolute; top: 0; view-transition-name: slide-content }
body .slider-container .slide-wrapper .slide h2 { margin-bottom: 1rem }
body .slider-container .slide-wrapper .slide p { margin-bottom: 1.5rem }
body .slider-container .controls-container { border-top: 1px solid #eee }
body .slider-container .controls-container .controls .btn { transition: background-color 0.2s }
body .slider-container .controls-container .controls .indicator-wrapper { view-transition-name: pagination }
body .slider-container .controls-container .controls .indicator-wrapper .indicat { transition: background-color 0.2s }
from { transform: translateX(100%) }
to { transform: translateX(0) }
from { transform: translateX(100%) }
```

```js
startViewTransition(() => {
```

### [Image Gallery II](https://codepen.io/bear320/pen/KwKeKeL)

made with: view transitions · :hover

```css
body .gallery .item img { -o-object-position: center; object-position: center }
::view-transition-group(*) { -webkit-animation-duration: 0.5s; animation-duration: 0.5s; -webkit-animation-timing-function: ease-in-out; animation-timing-function: ease-in-out }
```

```js
startViewTransition(() => {
```

### [Dynamic Text Transition](https://codepen.io/bear320/pen/jEOKNJK)

made with: view transitions · @keyframes

```css
body h1 span#highlight { view-transition-name: highlight }
body h1 span:last-of-type { view-transition-name: last }
from { opacity: 0; translate: 0 -100% }
from { opacity: 0; translate: 0 -100% }
to { opacity: 0; translate: 0 100% }
to { opacity: 0; translate: 0 100% }
::view-transition-new(highlight), ::view-transition-old(highlight) { -o-object-position: top left; object-position: top left }
::view-transition-old(highlight) { -webkit-animation: slide-out 0.75s linear(0, 0.6832 7.89%, 0.9171 11.07%, 1.0251, 1.1058 14.9%, 1.1619 16.86%, 1.1945 18.91%, 1.2024 20.02%, 1.2043 21.18%, 1.1907, 1.1598 26.27%, 1.0604 32.59%, 1.0172 35.84%, 0.9839 39.4 }
::view-transition-new(highlight) { -webkit-animation: slide-in 0.75s linear(0, 0.6832 7.89%, 0.9171 11.07%, 1.0251, 1.1058 14.9%, 1.1619 16.86%, 1.1945 18.91%, 1.2024 20.02%, 1.2043 21.18%, 1.1907, 1.1598 26.27%, 1.0604 32.59%, 1.0172 35.84%, 0.9839 39.49 }
@keyframes slide-in animates opacity, translate
@keyframes slide-out animates opacity, translate
```

```js
startViewTransition(() => {
```

### [Tabs Filter](https://codepen.io/bear320/pen/LEYmqEa)

made with: view transitions · @keyframes · transition · :hover · requestAnimationFrame

```css
body .container h1 { margin-bottom: 2rem }
body .container .filter-tabs { margin-bottom: 2rem }
body .container .filter-tabs .filter-btn { transition: all 0.3s ease }
body .container .articles-wrapper .article-card { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); transition: transform 0.3s ease, opacity 0.3s ease }
body .container .articles-wrapper .article-card:hover { transform: translateY(-5px) }
body .container .articles-wrapper .article-card-content .article-title { margin-bottom: 0.5rem }
body .container .articles-wrapper .article-card-content .article-meta { margin-bottom: 1rem }
from { opacity: 1; transform: scale(1) }
to { opacity: 0; transform: scale(0.9) }
from { opacity: 1; transform: scale(1) }
to { opacity: 0; transform: scale(0.9) }
from { opacity: 0; transform: scale(0.9) }
```

```js
startViewTransition(() => {
```

### [Image Gallery I](https://codepen.io/bear320/pen/EaxEBWy)

on scroll: li.thumbnail: transform+top | on hover of li.thumbnail: li.thumbnail: transform+top ×2 | made with: view transitions · @keyframes · transition · :hover · :has()

```css
body { position: relative }
body .gallery .thumbnail { transition: all 0.3s }
body .gallery .thumbnail:hover { transform: scale(1.03); transition: all 0.3s }
body .gallery .thumbnail img { vertical-align: top }
body .lightbox { position: absolute; inset: 0; view-transition-name: lightbox }
body .lightbox .lightbox-img img { margin-bottom: 8px }
from { opacity: 0; transform: translateY(3rem) }
to { opacity: 1; transform: translateY(0) }
from { opacity: 0; transform: translateY(3rem) }
to { opacity: 1; transform: translateY(0) }
from { opacity: 1; transform: translateY(0) }
to { opacity: 0; transform: translateY(3rem) }
```

```js
startViewTransition(() => {
```

### [Anchor positioning - (by Jhey)](https://codepen.io/DenDionigi/pen/vYoJoyr)

held: fixed button.theme | on scroll: a.: color | on hover of li.: a.: color ×2 | made with: position: fixed · view transitions · @keyframes · transition · :hover · :focus-visible · :has() · mask · mix-blend-mode

```css
body::before { position: fixed; -webkit-mask: linear-gradient(-15deg, transparent 60%, white); mask: linear-gradient(-15deg, transparent 60%, white); top: 0 }
ul { position: relative; transition: color 0.2s }
.direction-handler { position: fixed; top: 1rem }
.direction-handler path { rotate: calc(270deg * var(--intent)); transition: rotate 0.5s }
.direction-handler rect { transition: fill 0.5s }
.direction-handler[aria-pressed="true"] path { rotate: calc(270deg - (90deg * var(--intent, 0))) }
.bear-link { position: fixed; top: 1rem; opacity: 0.8 }
:where(.x-link, .bear-link):is(:hover, :focus-visible) { opacity: 1 }
ul::before, ul::after { --transition: 0.18s; position: fixed; top: calc(var(--item-active-y) * 1px); opacity: var(--intent, 0); transition: all var(--transition), top var(--transition), left var(--transition), height var(--transition), opacity  }
ul::after { top: calc(var(--target-y) * 1px); opacity: 1; border-bottom: 2px solid currentColor; view-transition-name: target }
ul::before { top: anchor(var(--anchor) top) }
ul::after { top: anchor(var(--target) top) }
```

### [Theme-Toggle View-Transition](https://codepen.io/digital_playground/pen/RwXWpxm)

made with: view transitions · @keyframes · prefers-reduced-motion · mix-blend-mode · Web Animations API (.animate)

```css
::view-transition-old(theme-toggle), ::view-transition-new(theme-toggle) { -webkit-animation: none; animation: none; mix-blend-mode: normal }
:root { view-transition-name: theme-toggle }
[data-theme=dark]:root img:not([src*=".svg"]) { filter: brightness(0.8) contrast(1.2) }
```

```js
startViewTransition(() => toggleDarkMode())
.animate( {
```

### [Simple SPA view-transition demo 2: multi element](https://codepen.io/ghaste/pen/MWNgaWm)

made with: view transitions · @keyframes · transition

```css
button { transition: 0.1s linear }
button:active { transform: translatex(0.1em) translatey(0.2em) }
.view { position: relative }
.view-content { position: absolute; inset: 0; box-shadow: 0.3em 0.3em 0.5em #1f202020 }
::view-transition-old(root), ::view-transition-new(root) { animation-duration: 1s }
.view-content { view-transition-name: view-content }
.view-content h2 { view-transition-name: view-header }
.view-content p { view-transition-name: view-text }
from { opacity: 0 }
to { opacity: 0 }
from { transform: translatex(100%) skewx(20deg) }
from { transform: skewx(5deg) }
```

```js
startViewTransition(() => {
```

### [Alphabet rain](https://codepen.io/9am/pen/PoVXbQP)

made with: position: fixed · view transitions · @keyframes

```css
body::after { position: fixed; bottom: 0 }
kbd { box-shadow: 0 1px 1px rgba(255, 255, 255, 0.2), 0 2px 0 0 rgba(0, 0, 0, 0.7) inset; text-transform: uppercase }
::view-transition-old(root), ::view-transition-new(root) { animation: none }
::view-transition-old(*) { animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both drop-from-top }
::view-transition-new(*) { animation: 300ms 200ms cubic-bezier(0.4, 0, 0.2, 1) both drop-to-bottom }
from { transform: translateY(-50vh) }
to { transform: translateY(50vh) }
@keyframes drop-from-top animates transform
@keyframes drop-to-bottom animates transform
```

```js
startViewTransition(() => {})
```

### [DnD view transition](https://codepen.io/9am/pen/NWoerzz)

made with: view transitions · custom properties driven by JS

```css
li { view-transition-name: var(--name) }
::view-transition-group(*) { animation-duration: 100ms }
.dragging { filter: opacity(0.5) grayscale(0.5) }
```

```js
style.setProperty("--hue", Math.random() * 360)
style.setProperty("--w", Math.random() * 10 + 10)
style.setProperty("--name", `item-${i}`)
startViewTransition(callback)
style.setProperty("--name", "slot")
style.setProperty("--name", `item-${slot.dataset.id}`)
```

### [bento layout w/ grid view-transition](https://codepen.io/vii120/pen/gOqmvWK)

made with: view transitions

```css
::view-transition-group(*) { animation-duration: 0.5s; animation-timing-function: cubic-bezier(0.47, 1.64, 0.41, 0.8) }
.box { box-shadow: 0 0 12px #0005 }
.box[data-index="1"] { view-transition-name: box-1 }
.box[data-index="2"] { view-transition-name: box-2 }
.box[data-index="3"] { view-transition-name: box-3 }
```

```js
startViewTransition(()=> {
```

### [Bookmark App - View Transition](https://codepen.io/TurkAysenur/pen/BavLzPj)

made with: view transitions · transition · :hover

```css
.app { position: relative }
.sidebar-menu { padding-top: 64px }
.sidebar-menu__link { transition: 0.3s }
.sidebar-menu__link + .sidebar-menu__link { margin-top: 24px }
.user { padding-bottom: 64px; border-bottom: 1px solid var(--border-color) }
.user-photo { margin-bottom: 20px }
.user-mail { margin-top: 6px }
.toggle { position: relative; margin-top: auto }
input[type=checkbox] { opacity: 0 }
.slider { position: absolute; top: 0; bottom: 0; transition: 0.3s }
.slider:before { position: absolute; bottom: 4px; transition: 0.4s }
input:checked + .slider:before { transform: translateX(28px) }
```

```js
startViewTransition(() => {
```

### [view-transition api with Vue](https://codepen.io/vii120/pen/BaqgJWN)

on scroll: img.: transform+top, div.title: transform+top | on hover of img.: img.: transform+top ×2, div.title: transform+top ×2 | made with: view transitions · transition · :hover

```css
.link * { transition: all 0.3s }
.link:hover .title { transform: rotate(-2deg) }
.link:hover img { transform: scale(1.05) }
.detail .title { view-transition-name: animated-title }
.detail img { view-transition-name: animated-img; box-shadow: 0 0 15px #0005 }
.detail .close-btn { position: relative }
.detail .close-btn:before, .detail .close-btn:after { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.detail .close-btn:before { transform: translate(-50%, -50%) rotate(-45deg) }
.detail .close-btn:after { transform: translate(-50%, -50%) rotate(45deg) }
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

### [Basic View Transition API](https://codepen.io/giancarlosgza/pen/oNaMNop)

on hover of img.img-fluid: img.img-fluid: filter, p.header: color, p.link: color | made with: position: fixed · view transitions · @keyframes · transition · :hover

```css
::view-transition-old(root), ::view-transition-new(root) { animation-duration: 0.5s }
from { opacity: 0; translate: 75px }
to { opacity: 0; translate: -75px }
&:is(.header) { view-transition-name: header-1 }
&:is(.link) { view-transition-name: link-1 }
&:is(.header) { view-transition-name: header-2 }
&:is(.link) { view-transition-name: link-2 }
&:is(.header) { view-transition-name: header-3 }
&:is(.link) { view-transition-name: link-3 }
&:is(.header) { position: fixed; top: 50%; transform: translate(-50%, -50%) }
&:is(.link) { position: fixed; bottom: 10%; transform: translate(-50%, 0%) }
&:is(.header) { position: relative; margin-bottom: 0 }
```

```js
startViewTransition(() => img.classList.toggle("open"))
```

### [View Transition](https://codepen.io/styler/pen/WbEowN)

on scroll: div.cross: transform+top, div.semi-circle: transform+top | on hover of a.wdgt: div.cross: transform, div.semi-circle: transform+top | made with: @keyframes · transition · :hover

```css
.loader, .proj-intro .proj-poster:after, .pg { top: 0; bottom: 0 }
h2 { margin-top: 1rem }
.btn { text-transform: uppercase }
.pg { position: absolute }
.grid { position: absolute; top: 50%; transform: translateY(-50%) }
.wdgt .wdgt-img { transition: border-width 0.2s }
.pg-indv .btn-back { position: absolute; top: 20px }
.proj-intro { position: relative }
.proj-intro .proj-poster { position: relative }
.proj-intro .proj-poster:after { position: absolute }
.proj-intro .proj-header { position: absolute; top: 50%; transform: translateY(-50%) }
.loader { position: absolute; transform: translateY(100%); transition: transform 0.475s }
```
