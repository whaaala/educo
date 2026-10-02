# CodePen · popover — how each pen does it

102 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/popover.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| popover | 89 |
| :hover | 56 |
| transition | 49 |
| position: fixed | 26 |
| @starting-style | 24 |
| :has() | 20 |
| @keyframes | 20 |
| :focus-visible | 19 |
| backdrop-filter | 19 |
| <dialog> | 11 |
| clip-path | 9 |
| prefers-reduced-motion | 6 |
| container queries | 4 |
| 3D (perspective / preserve-3d) | 4 |
| mix-blend-mode | 4 |
| pointer / mouse tracking | 3 |
| requestAnimationFrame | 3 |
| position: sticky | 3 |
| scroll listener | 2 |
| scroll-snap | 2 |
| mask | 2 |
| IntersectionObserver | 2 |
| custom properties driven by JS | 2 |
| Web Animations API (.animate) | 1 |
| scroll-driven animation (animation-timeline) | 1 |
| view() timeline | 1 |
| scroll() timeline | 1 |
| animation-range | 1 |
| view transitions | 1 |
| GSAP | 1 |
| canvas 2D | 1 |

## Every pen

### [CSS Tooltip When Truncated](https://codepen.io/editor/luis-lessrain/pen/01a0ebd9-71fc-7adb-bdce-8a608258fd25)

held: fixed span.tip, fixed span.tip, fixed span.tip, fixed span.tip, fixed span.tip, fixed span.tip | on hover of a.item: a.item: background | made with: :hover · :focus-visible · container queries · popover

```css
.panel { opacity: .35 }
.item:focus-visible { outline-offset: -2px }
```

### [Tooltip Pro - Accessible Floating UI](https://codepen.io/editor/ash1198/pen/01a0cd6a-0f72-7036-851a-aa283fc76c6c)

held: fixed header.header, fixed div.floating-tooltip, fixed div.floating-popover, fixed button.top-button | made with: position: fixed · transition · :hover · :focus-visible · backdrop-filter · popover · scroll listener

```css
html { scroll-padding-top: 90px }
.header { position: fixed; top: 0; border-bottom: 1px solid var(--border); backdrop-filter: blur(14px) }
.brand small { margin-top: 3px; text-transform: uppercase }
nav a { border-bottom: 1px solid transparent }
.hero { border-bottom: 1px solid var(--border) }
.label { text-transform: uppercase }
h1 { margin-top: 12px }
.hero-text { margin-top: 28px }
.primary-button { margin-top: 28px }
.preview-head { border-bottom: 1px solid var(--border); text-transform: uppercase }
.section { border-bottom: 1px solid var(--border) }
.section-head { margin-bottom: 34px }
```

```js
addEventListener( "mouseenter",
addEventListener( "mouseleave",
addEventListener( "scroll",
```

### [NixGlossaryTooltip — Interactive Linear & Wikipedia-Style Definition Card](https://codepen.io/editor/wptechnix/pen/01a07aea-419e-7eb9-ae06-c3b9b2c8f061)

held: fixed div.nix-glossary-card | made with: position: fixed · transition · :hover · :focus-visible · backdrop-filter

```css
.nix-glossary-term { text-underline-offset: 0.25rem; transition: color 0.2s ease, background-color 0.2s ease, text-decoration-color 0.2s ease }
.nix-glossary-term:focus-visible { box-shadow: 0 0 0 0.125rem color-mix(in srgb, var(--nix-primary) 30%, transparent) }
.nix-glossary-card { position: fixed; opacity: 0; transform: translate3d(0, 0.5rem, 0) scale(0.96); transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.2s ease }
.nix-glossary-card.is-visible { opacity: 1; transform: translate3d(0, 0, 0) scale(1) }
.nix-glossary-card__inner { backdrop-filter: blur(1rem); -webkit-backdrop-filter: blur(1rem); box-shadow: var(--nix-shadow), 0 0 0 0.0625rem color-mix(in srgb, var(--nix-primary) 18%, transparent) }
.nix-glossary-card__badge { text-transform: uppercase }
body { transition: background-color 0.3s ease, color 0.3s ease }
.nix-brand-badge { text-transform: uppercase }
.nix-theme-btn { transition: all 0.2s ease }
.nix-article-card { box-shadow: var(--nix-shadow) }
.nix-article-badge { text-transform: uppercase }
```

```js
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => this.scheduleHide())
```

### [Simple Popover Demo](https://codepen.io/OuterVale/pen/pvRGqeQ)

held: fixed div | made with: popover

### [Popover : hybrid system of notes and references](https://codepen.io/AgnusDei/pen/PwWQXbK)

held: fixed div | made with: position: fixed · transition · :hover · prefers-reduced-motion · popover · pointer / mouse tracking · requestAnimationFrame

```css
.eyebrow { text-transform: uppercase; margin-bottom: 10px }
.subtitle { margin-bottom: 36px }
.control-panel { margin-bottom: 48px }
.control-row { margin-bottom: 12px }
.control-row:last-child { margin-bottom: 0 }
.control-label { text-transform: uppercase }
.control-btn { transition: all 0.15s ease }
section.note-scope { margin-bottom: 16px }
.note-ref { transition: color 0.15s ease }
.notes-section { margin-top: 36px; padding-top: 24px; position: relative }
.notes-section::before { position: absolute; top: 0 }
.notes-title { text-transform: uppercase }
```

```js
requestAnimationFrame(animate)
addEventListener('mouseenter', (e) => {
addEventListener('mousemove', (e) => {
addEventListener('mouseleave', hidePopover)
```

### [Link + Popover Nav](https://codepen.io/aardrian/pen/dPNJgKQ)

held: fixed ul, fixed ul, fixed ul, fixed ul, fixed ul | on hover of li.: li.: background | made with: transition · :hover · :has() · prefers-reduced-motion · popover

```css
nav > ul > li { position: relative }
nav > ul > li > a[href]::before { position: absolute; top: 0; bottom: 0 }
nav li:has(a:focus), nav button:focus { outline-offset: -0.2em }
nav button:focus { outline-offset: 0.2em }
nav > ul a + button:has(+ :popover-open) svg { transform: rotate(180deg) }
nav > ul a + button svg { transition: transform 0.25s ease-in }
[popover] { inset: auto }
```

### [Modals w/ Popover and Invoker API](https://codepen.io/mejiaj/pen/bNgaRPM)

held: fixed dialog | made with: popover · <dialog>

### [Tooltip reutilizable con JavaScript Vanilla](https://codepen.io/editor/frankuxui/pen/019ee952-6ee5-7c72-b2cc-2096ba50786b)

held: fixed div.tooltip, fixed div.tooltip, fixed div.tooltip, fixed div.tooltip, fixed div.tooltip, fixed div.tooltip, fixed div.tooltip, fixed div.tooltip, fixed div.tooltip | on hover of button.: button.: background, div.tooltip: transform+opacity+top, div.tooltip-arrow: transform+top | made with: position: fixed · transition · :hover · :focus-visible · clip-path

```css
main { padding-top: 10rem }
.tooltip { position: fixed; opacity: 0; transform: scale(0.96); transition: opacity 160ms ease, transform 160ms ease }
.tooltip[data-show="true"] { opacity: 1; transform: scale(1) }
.tooltip-content { box-shadow: 0 18px 40px rgb(15 23 42 / 0.22) }
.tooltip-arrow { position: absolute; transform: rotate(45deg) }
.footer-link { transition: all ease-in-out .03s }
.footer-link:focus-visible { outline-offset: 4px }
.sr-only { position: absolute }
```

### [Table of Contents Popover](https://codepen.io/editor/JMChristensen/pen/019eb809-62a4-773e-a8b8-669327323583)

held: fixed div.toc-wrapper, fixed div.toc | on hover of button.: div.toc: opacity+top | made with: position: fixed · scroll-snap · @starting-style · transition · :hover · clip-path · popover

```css
:root { scroll-snap-type: both proximity }
.screen-reader-text { clip-path: inset(50%); position: absolute }
.toc-wrapper { position: fixed; transform: translateY(-50%) }
@starting-style { opacity: 0; translate: var(--space-s) 0 }
&[aria-hidden="false"] { opacity: 1 }
& > .toc-list { box-shadow: 0 var(--space-3xs) var(--space-3xs) color-mix(in oklch, var(--color-black), transparent 80%) }
&.is-active { opacity: 1; scale: 1 1 }
```

### [Dropdown con popover api](https://codepen.io/editor/zardoz89/pen/019eb147-6866-7682-a475-64bea0be4d36)

held: fixed ul.dropdown__container | made with: :hover · popover

### [Responsive Menu](https://codepen.io/editor/dutchcelt/pen/019c0edc-1497-7098-a560-9416badfc9d8)

made with: nothing recognised — read the code

### [texte 020 (générateur PHP)](https://codepen.io/erdouane/pen/GgNmrxO)

held: fixed div.lienSite | on scroll: div.texte020: transform+top ×26 | on hover of img.ecran: div.texte020: transform+top ×26 | made with: position: fixed · @keyframes · :hover · 3D (perspective / preserve-3d)

```css
.grpText020 { position:relative }
.texte020 { position:absolute; animation:animTexte020 var(--temp20) linear infinite; animation-delay:calc(sibling-index() * (var(--temp20) / (var(--mots20) * -2))) }
.texte020 span { position:absolute; filter:blur(var(--flou20)) }
.texte020 span:nth-child(2) { transform:translateZ(calc(var(--ecar20) * -2)) }
.texte020 span:nth-child(3) { transform:translateZ(calc(var(--ecar20) * -4)) }
.texte020 span:nth-child(4) { transform:translateZ(calc(var(--ecar20) * -6)) }
.texte020 span:nth-child(5) { transform:translateZ(calc(var(--ecar20) * -8)) }
.texte020 span:nth-child(6) { transform:translateZ(calc(var(--ecar20) * -10)) }
0% { top:calc((var(--tail20) * 1.25) * var(--mots20)); transform:rotatey(180deg) }
100% { top:calc(var(--tail20) * -1); transform:rotatey(-180deg) }
.lienSite { position:fixed; bottom:4px }
@keyframes animTexte020 animates top, transform
```

### [Animated, accessible Popovers without JS](https://codepen.io/editor/donnyburnside/pen/019dfec2-2cf3-71f8-add3-6ef560481e84)

held: fixed div | made with: @starting-style · transition · backdrop-filter · popover

```css
#mypopover { inset: auto; position-area: bottom; opacity: 0; transform: scaleX(0); transition: opacity 0.7s, transform 0.7s, overlay 0.7s allow-discrete, display 0.7s allow-discrete }
#mypopover::backdrop { opacity: 0; backdrop-filter: blur(0px); transition: opacity 0.7s, backdrop-filter 0.7s }
@starting-style { opacity: 0; transform: scaleX(0) }
@starting-style { opacity: 0; backdrop-filter: blur(0px) }
```

### [Animated, accessible Modals without JS](https://codepen.io/editor/donnyburnside/pen/019dfebd-3f6e-7a18-a3c3-be31ddf686ca)

held: fixed dialog | made with: position: fixed · @starting-style · transition · backdrop-filter · popover · <dialog>

```css
#mymodal { position: fixed; inset: 0; opacity: 0; transform: scaleX(0); transition: opacity 0.7s, transform 0.7s, overlay 0.7s allow-discrete, display 0.7s allow-discrete }
#mymodal::backdrop { opacity: 0; backdrop-filter: blur(0px); transition: opacity 0.7s, backdrop-filter 0.7s }
@starting-style { opacity: 0; transform: scaleX(0) }
@starting-style { opacity: 0; backdrop-filter: blur(0px) }
```

### [Anchored Menu Popover](https://codepen.io/bozdoz/pen/wBzpKam)

held: fixed ul.menu, fixed ul.menu, fixed ul.menu, fixed ul.menu, fixed ul.menu | made with: :hover · :focus-visible · popover

```css
a:focus-visible { box-shadow: inset 3px 0 0 #005fcc }
&.top-right { position: absolute }
&.bottom-right { position: absolute; bottom: 1em }
&.bottom-left { position: absolute; bottom: 1em }
```

### [AIM popover to target using anchor-positioning](https://codepen.io/cbolson/pen/emdmNdB)

held: fixed button, fixed div, fixed div.target | made with: position: fixed · @starting-style · transition · :has() · popover

```css
&:has(+[popover]:popover-open) { opacity:0 }
&:popover-open { top: anchor(top) }
&:not(:popover-open) { top: anchor(top) }
.target { position: fixed; inset: 0 }
```

### [morphing feedback popover w/ motion](https://codepen.io/vii120/pen/zxBVNpB)

made with: transition

```css
body { position: relative }
```

### [No config responsive menu](https://codepen.io/dutchcelt/pen/vEKVjoQ)

on hover of a.: a.: background+color | made with: :hover · :has() · container queries · popover · requestAnimationFrame

```js
requestAnimationFrame(() => {
```

### [Cat Cards Scrolling CSS Anchors with Popovers Demo](https://codepen.io/smwoll/pen/xbOLXjB)

held: fixed div.cat-info-popover, fixed div.cat-info-popover, fixed div.cat-info-popover, fixed div.cat-info-popover | made with: position: fixed · clip-path · popover

```css
.welcome-message { margin-bottom: 32px }
.sr-text { position: absolute; clip-path: circle(0%) }
.doc-title { margin-bottom: 32px }
.card-grid { position: relative }
.card__top-row { margin-bottom: 14px }
.cat-info-popover { position: fixed; position-area: top; inset: auto; position-try-order: top }
```

### [Smart Popover](https://codepen.io/Cristian20044121/pen/yyJXBgE)

made with: position: fixed · transition · :hover · popover

```css
.pop-btn:hover { filter: brightness(1.1) }
.popover { position: fixed; box-shadow: var(--shadow-lg); opacity: 0; transform: translateY(8px) scale(0.98); transition: opacity 0.18s ease, transform 0.18s ease }
.popover.show { opacity: 1; transform: translateY(0) scale(1) }
.popover strong { margin-bottom: 6px }
.popover .close { margin-top: 12px }
```

### [Status](https://codepen.io/mblode/pen/yyJOKdr)

made with: transition · popover

### [Dialog vs Popover — Native HTML Modal Patterns](https://codepen.io/millisabel/pen/vEKBdYJ)

on hover of button.btn: button.btn: transform+filter+shadow+top | made with: position: fixed · @keyframes · transition · :hover · :focus-visible · backdrop-filter · popover · <dialog>

```css
:root { --filter: blur(16px) saturate(135%) }
body { position: relative }
body::before { position: fixed; inset: -20%; filter: blur(0px); animation: background-breathe 20s ease-in-out infinite, background-flow 26s ease-in-out infinite }
0%, 100% { filter: saturate(100%) }
50% { filter: saturate(150%) }
0% { transform: translate(0, 0) scale(1) }
25% { transform: translate(-15%, -15%) scale(1.5) }
50% { transform: translate(0, 0) scale(1) }
75% { transform: translate(15%, 15%) scale(2) }
100% { transform: translate(0, 0) scale(1) }
h1 { margin-bottom: 2rem }
.modal { position: relative; box-shadow: 0 26px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06); backdrop-filter: var(--filter); -webkit-backdrop-filter: var(--filter) }
```

### [PURE CSS: popover](https://codepen.io/ibbatta/pen/yyJBOXy)

held: fixed span | made with: popover

```css
.wrapper .popovertrigger { text-underline-offset: 0.5rem }
[popover] { margin-bottom: 1rem; filter: drop-shadow(0 0 0.5rem var(--clr-popover-bg)) }
```

### [popover api examples](https://codepen.io/jrohatiner/pen/JoXqqpa)

held: fixed ul | made with: popover

```css
#outputMessage { box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); position: absolute; transform: translateX( -50% ); margin-top: 10px }
.footer { margin-top: 250px }
.sr-only { position: absolute }
```

### [🌌 Popover Universe - Ultimate HTML Popover API Showcase](https://codepen.io/fyildiz1974/pen/dPMaram)

held: fixed div.universe-bg, fixed div, fixed div, fixed div, fixed div, fixed div, fixed div, fixed div, fixed div, fixed div | on scroll: div.: transform+opacity+top ×11, div.stars: opacity ×3, div.nebula: transform+top, h1.main-title: filter | on hover of button.orb-button: div.: transform+opacity+top ×20, div.stars: opacity ×3, div.nebula: transform+top, h1.main-title: filter | made with: position: fixed · @keyframes · transition · :hover · mask · backdrop-filter · 3D (perspective / preserve-3d) · popover · IntersectionObserver · pointer / mouse tracking · Web Animations API (.animate)

```css
.universe-bg { position: fixed; top: 0 }
.stars { position: absolute; animation: twinkle 5s ease-in-out infinite }
.stars:nth-child(2) { background-position: 50px 50px; animation-delay: -2s; opacity: 0.5 }
.stars:nth-child(3) { background-position: 100px 100px; animation-delay: -4s; opacity: 0.3 }
0%, 100% { opacity: 1 }
50% { opacity: 0.5 }
.nebula { position: absolute; top: -25%; animation: nebulaFlow 20s ease-in-out infinite }
0%, 100% { transform: rotate(0deg) scale(1) }
50% { transform: rotate(10deg) scale(1.1) }
header { position: relative }
.main-title { animation: titleGlow 3s ease-in-out infinite }
0%, 100% { filter: drop-shadow(0 0 20px rgba(0, 245, 255, 0.8)) }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseleave", (e) => {
.animate( [
addEventListener("mouseenter", () => {
addEventListener("mouseenter", function () {
addEventListener("mouseleave", function () {
new IntersectionObserver(
```

### [Eduardo Galeano: Multiple popovers, anchor positioning](https://codepen.io/andrewrock/pen/XJdZJLy)

made with: @starting-style · transition · :hover · :focus-visible · :has() · clip-path · mix-blend-mode · popover

```css
:where(html) { --opacity: 0; --scale: 0.9 }
*:focus { outline-offset: calc(var(--spacer-xs) / 2) }
.sr-only { position: absolute }
body:has([popover]:popover-open) section { filter: blur(var(--spacer)) }
.landing-article figure img { mix-blend-mode: luminosity }
[popover] header { border-bottom: 1px solid var(--border) }
[popover] footer { border-top: 1px solid var(--border) }
.poem img { clip-path: inset(0 0 0 0) }
.poem h2 { transform: translate(var(--spacer-sm), var(--spacer)) }
fieldset { box-shadow: inset 0 1px 0px var(--shadow) }
&:hover { outline-offset: calc(var(--spacer-xs) / 2) }
&:active { --scale: 0.97 }
```

### [Clothing cards with popover api overlay](https://codepen.io/kazmi066/pen/VYamEbL)

made with: @keyframes · transition · :hover · backdrop-filter · popover

```css
.header { margin-bottom: var(--spacing-xl); border-bottom: 1px solid var(--border-color) }
.header__title { margin-bottom: var(--spacing-xs) }
.product-card { position: relative; transition: transform 0.2s ease, box-shadow 0.2s ease }
.product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08) }
.product-card__image-container { position: relative }
.product-card__image { transition: transform 0.3s ease }
.product-card:hover .product-card__image { transform: scale(1.03) }
.product-card__name { margin-bottom: var(--spacing-sm) }
.product-card__prices { margin-top: auto }
.product-card__price { margin-bottom: var(--spacing-xs) }
.product-card .card-trigger { position: absolute; inset: 0 }
.results-info { margin-bottom: var(--spacing-md); border-bottom: 1px solid var(--border-color) }
```

### [Custom select](https://codepen.io/andrewrock/pen/JoXdZOB)

made with: @starting-style · @keyframes · transition · :hover · :focus-visible · :has() · prefers-reduced-motion · clip-path · mix-blend-mode

```css
:where(html) { --opacity: 0; --scale: 0.9 }
select:open::picker(select) { --opacity: 0; --scale: 0.9 }
&:open::picker(select) { --opacity: 1; --scale: 1; transition: --opacity var(--motion-overlay) var(--spring), --scale var(--motion-overlay) var(--entrance-strong) }
&:hover::picker-icon { --rotate: -12deg }
&:active:not(:open) { --scale: 0.98 }
&:active::picker-icon { --rotate: 0deg }
::picker-icon { --rotate: 0deg; transform: rotate(var(--rotate)); transition: --rotate var(--motion-hover) var(--spring) }
select:active::picker-icon { transition: --rotate var(--motion-interactive) var(--spring) }
::picker(select) { --scale: 0; --opacity: 0; top: anchor(top); bottom: anchor(bottom); opacity: var(--opacity); scale: var(--scale); transition: --opacity var(--motion-exit) var(--ease-out) }
selectedcontent img { --scale: 0.9; --opacity: 0; opacity: var(--opacity); transform: translateY(var(--translate-y)) scale(var(--scale)); animation: slideInContent var(--motion-gentle) var(--entrance-strong) forwards; animation-delay: var(--m }
&::before { position: absolute; inset: 0; clip-path: inset(0 var(--reveal) 0 0); transition: --reveal var(--motion-hover) var(--spring) }
&::checkmark { position: absolute; inset: 0; outline-offset: calc(-2 * var(--spacer-md)) }
```

### [CSS-only Dialog animation](https://codepen.io/claudialn/pen/xbVGZgg)

made with: @starting-style · transition · :has() · backdrop-filter · <dialog>

```css
.dialog_content { backdrop-filter: blur(4px) }
@starting-style { translate: 0 100vh }
&:not([open]) { translate: 0 100vh }
@starting-style { backdrop-filter: blur(0) }
```

### [Popover with anchor position](https://codepen.io/harsh0501/pen/jEqEEwE)

on hover of button.btn-menu: button.btn-menu: background | made with: transition · :hover · :has() · popover

```css
.content-body .controls { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.content-body .btn-menu { transition: all 0.3s ease-in-out }
.content-body .menu-list { position: absolute; top: anchor(bottom) }
.content-body .menu-list .menu-item { transition: all 0.3s linear; inset: 0 }
.content-body .button-wrapper { position: relative }
position-try --below-right { inset: unset; top: anchor(bottom) }
position-try --below-left { inset: unset; top: anchor(bottom) }
position-try --up-left { inset: unset; bottom: anchor(top) }
position-try --up-right { inset: unset; bottom: anchor(top) }
```

### [Popover API](https://codepen.io/reavenclaw/pen/emJqOoN)

held: fixed div | made with: position: fixed · popover

```css
#menu { position: fixed; top: 63%; transform: translate(-50%, -50%) }
```

### [svg speech bubble](https://codepen.io/ka1ros/pen/LEGrbvQ)

made with: nothing recognised — read the code

```css
.wrapper { position: relative }
.control { box-shadow: 0 0 0 1px color-mix(in oklch, white 6%, transparent) inset, 0 4px 10px rgba(0, 0, 0, 0.24) }
.outside { position: relative }
```

### [SVG Bezier Popover](https://codepen.io/ka1ros/pen/gbPzLJN)

made with: nothing recognised — read the code

```css
.wrapper { position: relative }
output { opacity: 0.75 }
.preview { margin-top: 20px }
```

### [anchor positioning motion in](https://codepen.io/andrewrock/pen/VYeQBjw)

on hover of button.: div.button-content: color+top ×2, svg.[object: color+top ×2, span.: color+top ×2, button.: transform+background+color+top, path.[object: color+top, path.[object: color | made with: @starting-style · transition · :hover · :focus-visible · popover

```css
:where(html) { --motion-scale: 1.25; --opacity: 0; --scale: 0.9; --translate: 0% }
*:focus-visible { outline-offset: calc(var(--spacer-xs) / 2) }
button { --scale: 1; position: relative; transform: scale(var(--scale)); transition: --scale var(--duration-fast) var(--easing-spring), color var(--duration-fast) var(--easing-spring), background var(--duration-fast) var(--easing }
button:hover { --scale: 1.03 }
button:active { --scale: 0.96 }
button .button-content { --opacity: 1; filter: blur(var(--blur)); opacity: var(--opacity); transition: --opacity var(--duration-fast) var(--easing-spring), --blur var(--duration-fast) var(--easing-spring) }
button .button-content[data-state=close] { position: absolute; inset: 0; --opacity: 0 }
button[data-active=close] .button-content[data-state=open] { --opacity: 0 }
button[data-active=close] .button-content[data-state=close] { --opacity: 1 }
[popover] { --scale: 0.85; --opacity: 0; --translate: var(--spacer-xl); filter: blur(var(--blur)); inset: var(--variant__offset-block, 0) var(--variant__offset-inline, 0); position: absolute; opacity: var(--opacity); transform: tran }
[popover]:popover-open { --opacity: 1; --scale: 1; --translate: 0px; transition: --opacity var(--duration-base) var(--easing-spring), --scale var(--duration-slow) var(--easing-spring), --translate var(--duration-slow) var(--easing-spring), --blu }
[popover]:popover-open { --scale: 0.75; --opacity: 0; --translate: var(--spacer-xl) }
```

### [anchor positioning playground](https://codepen.io/andrewrock/pen/OPMQyKv)

held: fixed div | made with: position: fixed · @starting-style · transition · :hover · :focus-visible · custom properties driven by JS · popover

```css
:where(html) { --opacity: 0; --scale: 0.9 }
*:focus-visible { outline-offset: calc(var(--spacer-xs) / 2) }
button:not(.menu-btn) { transition: transform var(--duration-fast) var(--easing-ease) }
button:not(.menu-btn):active { --scale: 0.97; transform: scale(var(--scale)) }
button:not(.menu-btn) svg { transition: fill var(--duration-fast) var(--easing-ease) }
[popover] { --scale: 0; --opacity: 0; inset: var(--variant__offset-block, 0) var(--variant__offset-inline, 0); opacity: var(--opacity); position: absolute; transition: display var(--duration-slow) allow-discrete, overlay var(--durat }
[popover]:popover-open { --opacity: 1; --scale: 1; transition: display var(--duration-slow) allow-discrete, overlay var(--duration-slow) allow-discrete, --opacity var(--duration-slow) var(--easing-out), --scale var(--duration-slow) var(--easing- }
[popover]:popover-open { --opacity: 0; --scale: 0.9 }
.menu-item button:focus-visible { outline-offset: calc(var(--spacer-xs) / 1) }
.menu-item svg { --opacity: 0.9; opacity: var(--opacity); transition: opacity var(--duration-fast) var(--easing-ease), fill var(--duration-fast) var(--easing-ease) }
.menu-item:hover svg { --opacity: 1 }
.delete-item:focus-visible { outline-offset: -2px }
```

```js
style.setProperty("--variant-pos-area", placement)
style.setProperty( "--variant-trans-origin",
style.setProperty( "--variant__offset-block",
style.setProperty( "--variant__offset-inline",
```

### [Multiple popovers, anchor positioning](https://codepen.io/andrewrock/pen/KwVXvzz)

made with: @starting-style · transition · :hover · :focus-visible · :has() · clip-path · mix-blend-mode · popover

```css
:where(html) { --opacity: 0; --scale: 0.9 }
*:focus { outline-offset: calc(var(--spacer-xs) / 2) }
.sr-only { position: absolute }
section { position: relative; transition: filter var(--motion-interactive) var(--ease-in-out-cubic) }
body:has([popover]:popover-open) section { filter: blur(var(--spacer)) }
.landing-article figure img { mix-blend-mode: luminosity }
[popover] { --scale: 1; --translate: 33%; opacity: var(--opacity); position: absolute; translate: 0 var(--translate); scale: var(--scale) }
[popover] header { border-bottom: 1px solid var(--border) }
[popover] footer { border-top: 1px solid var(--border) }
.poem img { clip-path: inset(0 0 0 0) }
.poem h2 { transform: translate(var(--spacer-sm), var(--spacer)) }
fieldset { box-shadow: inset 0 1px 0px var(--shadow) }
```

### [Anchor Positioned Popover with Contrast Slider](https://codepen.io/simeydotme/pen/vELOQEz)

held: fixed div, fixed a.social-icon, fixed a.social-icon, fixed a.social-icon, fixed svg.[object | on scroll: a.social-icon: transform+opacity+top ×3, span.rangeNub: background | on hover of button.: a.social-icon: transform+opacity+top ×3 | made with: position: fixed · @starting-style · @keyframes · transition · :hover · :focus-visible · :has() · popover

```css
& svg { scale: -1 1; transition: translate 0.15s var(--cubic-out); transform: translate3d(0,0,0.01px) }
& svg { translate: 0 1px }
supports (position-anchor: --anchor-contrast) { top: anchor(--anchor-contrast center); translate: 10px -60% }
supports not (position-anchor: --anchor-contrast) { top: calc( clamp( 3em, 30vh, 30em ) + 50px ) }
&:popover-open { opacity: 1; translate: 10px -50% }
&:popover-open { opacity: 0; translate: 10px -60% }
.rangeHandle { opacity: 0 }
.rangePips .rsPip { translate: -50% calc(var(--pip-height) / 2 ); box-shadow: 0 1px 0px 0.5px var(--pip-shadow) }
.contrast-buttons button { box-shadow: inset 0 0 0 1px hsl(0 0% 0% / 0.1), inset 0 2px 0.5px -0.5px hsl(0 0% 100% / 1), inset 0 -2px 0.5px -0.5px hsl(0 0% 0% / 0.05), 0 2px 2px -0.5px hsl(0 0% 80% / 0.5) }
body { background-position: center }
aside { opacity: 0.66 }
.arrow { position: fixed; top: 30%; translate: 0px 0px; filter: invert(1) drop-shadow(0 2px 3px rgba(0,0,0,0.25)) drop-shadow(0 4px 8px rgba(0,0,0,0.15)); -webkit-animation: arrow 3.8s ease both; animation: arrow 3.8s ease both }
```

### [Modern Browser Pure CSS Popover / Popup Example (No JS)](https://codepen.io/arsen-nazaryan/pen/PwZqKGb)

held: fixed dialog | made with: popover · <dialog>

### [popover tooltip menu (css only)](https://codepen.io/dmbdesignpdx/pen/ogXRdeZ)

held: fixed menu.list, fixed aside | on hover of button.action: button.action: background+shadow | made with: position: fixed · @starting-style · transition · :hover · popover

```css
#menu { position-try: --bottom; opacity: 0; transform: translateY(20%) }
#menu:popover-open { opacity: 1; transform: translateY(0%) }
#menu:popover-open { opacity: 0; transform: translateY(20%) }
.action:hover { box-shadow: var(--shadow-darker-md) }
.action:active { transform: scale(0.94) }
#menu { transition: display 250ms, opacity 250ms ease-out, transform 250ms ease-out; box-shadow: var(--shadow-md) }
[data-sr] { position: absolute }
[data-support] { position: fixed }
```

### [Simple Popover](https://codepen.io/Jack-Shaw/pen/wBabGWw)

made with: transition · :hover · popover

```css
.popover-container { position: relative }
.popover-content { opacity: 0; position: absolute; bottom: 125%; transform: translateX(-50%) translateY(10px); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); transition: opacity 0.2s ease-in-out, transform 0.4s ease-in-out }
.popover-content::after { position: absolute; top: 100%; transform: translateX(-50%) }
.popover-container:hover .popover-content { opacity: 1; transform: translateX(-50%) translateY(0) }
.popover-bottom .popover-content { top: 125%; bottom: auto; transform: translateX(-50%) translateY(-10px) }
.popover-bottom .popover-content::after { top: auto; bottom: 100% }
.popover-bottom:hover .popover-content { transform: translateX(-50%) translateY(0) }
.popover-left .popover-content { top: 50%; transform: translateY(-50%) translateX(10px) }
.popover-left .popover-content::after { top: 50%; transform: translateY(-50%) }
.popover-left:hover .popover-content { transform: translateY(-50%) translateX(0) }
.popover-right .popover-content { top: 50%; transform: translateY(-50%) translateX(-10px) }
.popover-right .popover-content::after { top: 50%; transform: translateY(-50%) }
```

### [CSS Anchors + Popovers](https://codepen.io/everdimension/pen/NPqMjQg)

held: fixed div.popover | made with: position: fixed · popover

```css
.popover { top: 8px; position: fixed }
```

### [project-54](https://codepen.io/DominicNikolai/pen/GgJrqex)

on scroll: section.cube: transform+top | made with: @keyframes

```css
&:nth-child(1) { top: 0; transform: rotate(45deg) skew(-15deg, -15deg) }
&:nth-child(2) { top: 78%; transform: rotate(15deg) skew(15deg, 15deg) }
&:nth-child(3) { top: 78%; transform: rotate(-15deg) skew(-15deg, -15deg) }
&::before, &::after { position: absolute }
&::before, &::after { bottom: 0 }
&::before, &::after { top: 0 }
&::before, &::after { top: 0 }
0% { transform: translate(-100vmax, -100%) rotate(-720deg) }
25%, 75% { transform: translate(-100%, -100%) rotate(0deg) }
100% { transform: translate(100vmax, -100%) rotate(720deg) }
@keyframes rotarCube animates transform
```

### [Popover use cases: menu and tooltip](https://codepen.io/akhmadullin/pen/VYwydvP)

held: fixed div.tooltip, fixed div.tooltip, fixed div.tooltip, fixed div.menu, fixed div.menu, fixed div.menu, fixed div.menu, fixed div.tooltip, fixed div.menu, fixed div.tooltip | on scroll: button.button: background | made with: :hover · popover

```css
.tooltip { position-area: top; inset: unset; margin-bottom: 10px }
.menu { inset: unset; margin-top: 10px }
.submenu { position-area: right span-bottom; margin-top: 0 }
.tooltip-left { margin-bottom: 0 }
```

```js
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [Difference between auto and hint popovers](https://codepen.io/akhmadullin/pen/jEOYKPQ)

held: fixed div.popover, fixed div.popover, fixed div.popover, fixed div.popover, fixed div.popover, fixed div.popover, fixed div.popover, fixed div.popover | made with: popover

```css
.popover > *:not(:last-child) { margin-bottom: 10px }
#auto-1 { inset: unset; margin-top: 20px }
#hint-1 { inset: unset; margin-top: 20px }
#auto-1-1 { inset: unset; margin-top: 40px }
#hint-1-1 { inset: unset; margin-top: 40px }
#hint-1-1-1 { position-area: right span-bottom; inset: unset }
#auto-2 { inset: unset; margin-bottom: 20px }
#hint-2 { inset: unset; margin-bottom: 20px }
```

```js
addEventListener('mouseenter', () => {
```

### [native popover (css only)](https://codepen.io/dmbdesignpdx/pen/jEObzMz)

held: fixed p | on hover of button.: button.: background | made with: @starting-style · transition · :hover · :focus-visible · popover

```css
&:popover-open { translate: 0 }
&:popover-open { translate: var(--_move) }
[popover] { box-shadow: var(--shadow-md) }
```

### [Popover Mobile Nav Menu 2026 Updated](https://codepen.io/Mitchell-Angus/pen/emYYywj)

held: fixed div, sticky div.tab-titles | made with: position: sticky · @keyframes · transition · popover

```css
#nav-open-container { position: absolute; top: 13px }
#nav-open { position: relative; top: 10px }
#nav-open::before { position: absolute; transform: translateY(-18px) }
#nav-open::after { position: absolute; transform: translateY(-9px) }
#nav-panel[popover] { animation: .5s ease-out FadeIn }
#nav-panel[popover] ul li:not(:last-child)::after { position: absolute; transform: translateY(4px) }
from { opacity: 0 }
to { opacity: 1 }
#nav-panel[popover] ul li { opacity: 0; animation: .5s ease-out forwards FadeInRt }
from { transform: translateX(120px); opacity: 0 }
to { transform: translateX(0px); opacity: 1 }
#nav-panel[popover] ul li:nth-child(2) { animation-delay: .1s }
```

### [Modal without Javascript (css only)](https://codepen.io/HugoSalazar/pen/KwPYjKm)

made with: position: fixed · transition · :hover · popover

```css
.title { margin-bottom: 40px }
.c-card { box-shadow: var(--shadow) }
.c-card__header { position: relative }
.c-card__overlay::before, .c-card__overlay::after { position: absolute; bottom: -40px }
.c-card__picture { position: relative }
.c-card__infos { position: relative }
.c-card__infos-description { opacity: 0.8 }
.c-card__button { text-transform: var(--button-transform, uppercase); transition: all 0.3s ease }
.c-modal { position: relative }
.c-modal::before { position: absolute; inset: 0 }
.c-modal:popover-open { position: fixed; inset: 0 }
.c-modal__inner { position: relative; box-shadow: var(--shadow) }
```

### [search bar CSS + pressed state progressive enhancement](https://codepen.io/hexagoncircle/pen/emOyowe)

held: sticky header, fixed dialog, fixed dialog.container, fixed dialog.container, fixed dialog | made with: position: sticky · transition · :hover · :focus-visible · :has() · container queries · popover · <dialog>

```css
.sr-only { position: absolute }
header { position: sticky; top: 0 }
&::before { position: absolute }
&:focus-visible::before { outline-offset: -3px }
span { opacity: 0 }
span { transition: opacity 150ms }
span { opacity: 1 }
.filter-toggle[aria-pressed="true"]::before { box-shadow: hsla(0 0% 0% / 0.1) 0 3px 12px }
```

### [Confirm Dialog Popover / No JS](https://codepen.io/DuskoStamenic/pen/pvzWPJO)

held: fixed dialog | on scroll: button.btn: background+shadow | made with: :hover · :focus-visible · popover · <dialog>

```css
&:hover, &:focus-visible { outline-offset: 4px; box-shadow: 0px 3px 9px -1px oklch(28% 0.12 var(--color-primary-hue) / 50%) }
&:hover, &:focus-visible { outline-offset: 0.25rem; box-shadow: 0px 3px 9px -1px oklch(28% 0.012 var(--color-primary-hue) / 50%) }
[popover] { box-shadow: 2px 8px 16px oklch(28% 0.12 var(--color-primary-hue) / 25%) }
p, h3 { margin-bottom: 1rem }
```

### [Mortal Kombat 1](https://codepen.io/BlackStar1991/pen/ByBWBWB)

on hover of button.item: video.: opacity | made with: @keyframes · :hover · mix-blend-mode · popover

```css
[popover] { animation: fadeIn 0.5s ease-in }
from { filter: blur(3px); opacity: 0 }
to { filter: blur(0px); opacity: 1 }
.item { position: relative; margin-bottom: 1rem }
.item:hover video { opacity: 1 }
.item video { opacity: 0; position: absolute; bottom: 0; mix-blend-mode: screen }
.content { position: absolute; top: 0 }
.roster-detail-fighter-content { position: relative }
.btn_close { position: absolute; top: 10px }
.btn_close:after { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.meta { position: relative }
h3 { margin-top: 0; margin-bottom: 0.5rem }
```

### [The Popover API and inset:unset](https://codepen.io/cssence/pen/MYgJXab)

held: fixed div, fixed a | made with: :has() · popover

```css
body:has(option[value="initial"]:checked) [popover] { inset: initial }
body:has(option[value="revert"]:checked) [popover] { inset: revert }
body:has(option[value="unset"]:checked) [popover] { inset: unset }
body:has(option[value="absolute"]:checked) [popover] { position: absolute }
body:has(option[value="relative"]:checked) [popover] { position: relative }
body:has(option[value="static"]:checked) [popover] { position: static }
```

### [AI Hero Chat - Popover API Example](https://codepen.io/mobalti/pen/EaYVJgr)

held: fixed div.chat | made with: @keyframes · :hover · prefers-reduced-motion · clip-path · backdrop-filter · popover

```css
media (width < 1440px) { background-position: top 20% center }
media (width < 768px) { background-position: top 20% center }
media (prefers-reduced-transparency: no-preference) { backdrop-filter: blur(70px) }
&:popover-open { animation: var(--animation-slide-in-up) }
to { transform: translateY(100%) }
.chat-header { border-bottom: var(--border-size-1) solid var(--gray-4) }
.chat-input-container { box-shadow: var(--shadow-4) }
&:hover { box-shadow: var(--shadow-2) }
.state-layer { transition-property: background-color, box-shadow }
@keyframes slide-out-down-dismiss animates display, transform
```

### [Popover info buttons from data](https://codepen.io/2kool2/pen/jOggBvM)

held: fixed div, fixed div, fixed div, fixed div, fixed div, fixed div | on hover of button.undefined: button.undefined: background+color+top | made with: @keyframes · transition · :hover · :has() · prefers-reduced-motion · popover

```css
main > div > * + * { margin-top: 2rem }
a { text-underline-offset:.15em }
[data-popover]:has([popovertarget]) { --_outline-offset: 2px; --_button-top: auto; --_button-bottom: calc(0px - var(--_size, 16px)); position: relative; outline-offset: var(--_outline-offset) }
[data-popover] > [popovertarget] { position: absolute; inset: var(--_button-top) var(--_button-right) var(--_button-bottom) var(--_button-left); box-shadow: 0 2px 6px #0009; transition: .3s all ease-out }
[data-popover]:has([popovertarget])::after { position: absolute; inset: 0; transition: .3s background-color ease-out }
[popovertarget]:hover, [popovertarget]:focus { scale: 1.5 }
[popovertarget]:focus { outline-offset: 2px }
[popovertarget].-js-clicked { animation: .3s ease-out forwards btn-pressed }
50% { scale: 1 }
[popover] { top: auto; box-shadow: 0 0 8px #0009 }
[popover] { opacity: 0; animation: .5s ease-out forwards slideUp; transform: translateY(100%) }
to { transform:translate(0); opacity:1 }
```

### [Simple animated native popover with polyfill](https://codepen.io/cheekymonkey/pen/QWeXeLW)

made with: @starting-style · transition · prefers-reduced-motion · popover

```css
&:popover-open { opacity: 1; transform: scale(1) translateY(10px) }
&:popover-open { opacity: 0; transform: scale(0.95) translateY(0px) }
media (prefers-reduced-motion: no-preference) { transform: scale(0.95) translateY(0px) }
position-try --bottom { inset: auto; bottom: anchor(top); transform: scale(1) translateY(10px) }
```

### [Popover Drawer](https://codepen.io/DenDionigi/pen/NWQmOeo)

held: fixed aside.drawer, sticky div.reaction-bar, fixed canvas | made with: position: sticky · position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · scroll-snap · view transitions · @starting-style · @keyframes · transition · :hover · :focus-visible · :has() · mask · custom properties driven by JS · popover · GSAP · canvas 2D · IntersectionObserver · scroll listener · pointer / mouse tracking · requestAnimationFrame

```css
[data-snap="false"] .drawer__scroller { -ms-scroll-snap-type: none; scroll-snap-type: none }
[data-css="true"] .drawer { inset: 0 0 0 0 }
[data-css="true"] .drawer__curtain, [data-css="true"] .drawer__anchors { opacity: 0 }
.drawer ul { list-style-position: inside }
.arrow { position: relative; translate: 100% 0; margin-top: 2rem; rotate: 5deg }
.arrow svg { scale: -1 1 }
.arrow span { rotate: -20deg; position: absolute; top: 100%; translate: -25% 50% }
.drawer__content { border-bottom: 0 }
#reaction-canvas { position: fixed; inset: 0 }
.reaction-bar { border-top: 1px solid var(--border) }
&::before { position: absolute; inset: 0; opacity: var(--active, 0); transition: opacity var(--duration) var(--ease) }
.drawer__drag { border-bottom: 1px solid var(--border) }
```

```js
startViewTransition(() => update())
requestAnimationFrame(() => {
style.setProperty( "--closed",
addEventListener("scroll", scrollDriver, { once: true })
new IntersectionObserver(callback, options)
addEventListener("scroll", handleScroll)
addEventListener("mousemove", handle)
style.setProperty( "--sw-keyboard-height",
```

### [Side menu with POPOVER Api - NO javascript](https://codepen.io/desgbr/pen/WNVMJWY)

held: fixed div | made with: :hover · backdrop-filter · popover

```css
#mypopover:popover-open { position: absolute; inset: unset; top: 0 }
#close-mypopover { position: absolute; top: 10px }
```

### [Glassy button + Popover](https://codepen.io/LukyVj/pen/yLmJMyr)

on hover of button.btn: button.btn: shadow | made with: @starting-style · transition · :hover · :has() · popover

```css
button { box-shadow: 0 3px 5px black, 0 8px 24px var(--btn-shadow); transform: translateY(var(--tsy)); transition: --glow 0.2s ease, --tsy 0.2s ease, --light 0.2s ease, --icon-rotation 0.2s ease, box-shadow 0.2s ease }
button .btn-inner { box-shadow: inset 0 0 12px hsl(var(--main-hue) 100% 65%) }
button .btn-caret svg { rotate: var(--icon-rotation); transition: rotate 0.2s ease }
button:hover { box-shadow: 0 2px 2px black, 0 14px 32px var(--btn-shadow) }
button:active { box-shadow: 0 1px 1px black, 0 8px 16px var(--btn-shadow) }
button:active .btn-caret svg, .container:has(:popover-open) .btn-caret svg { rotate: 180deg }
.positioned-notice { position: absolute; inset: auto; top: anchor(--anchor-el top); position-try-fallbacks: --bottom }
position-try --bottom { top: anchor(--anchor-el bottom) }
.positioned-notice a { border-bottom: 1px dashed white }
.positioned-notice .inner-notice { position: relative }
.positioned-notice .inner-notice ul li { border-bottom: 1px solid rgb(255 255 255 / 10%) }
[popover]:popover-open { opacity: 0; transform: scale(0); filter: blur(12px) }
```

### [Popover ( only html )](https://codepen.io/cupy/pen/JjgPOax)

held: fixed h1, fixed div | made with: popover

### [Popover position with floating-ui](https://codepen.io/knubbe/pen/KKjOjVW)

made with: backdrop-filter · popover

```css
[popover] { position: absolute }
::backdrop { backdrop-filter: blur(2px) }
```

### [Popover and Backdrop with Enter and Leave Transition using only CSS](https://codepen.io/nocksock/pen/jOjLjYw)

held: fixed dialog.text-lg | on scroll: button.btn: transform+background+shadow+top | made with: position: fixed · @starting-style · transition · :hover · :has() · 3D (perspective / preserve-3d) · popover · <dialog>

```css
[popover], ::backdrop { transition: display 400ms ease-in-out allow-discrete, transform 288ms ease-in-out, opacity 160ms ease-in-out }
&::backdrop { opacity: 0 }
&::backdrop { opacity: 0.5 }
&:popover-open { opacity: 0; transform: perspective(800px) translateY(-80px) scale(2) rotate3d(2, 0, 8, 45deg) }
&:popover-open::backdrop { opacity: 0 }
.card { box-shadow: 4px 4px 8px lch(from var(--color-bg) calc(l - 90) c h / 20%) }
&:focus, &:hover { box-shadow: 0px 0px 0 black; transform: translate(4px, 4px) }
```

### [CSS Only Tooltip popup](https://codepen.io/pr0h0/pen/MWMmWez)

made with: :hover

```css
.tooltip { position: relative }
.tooltip::before { position: absolute; top: -16px; transform: translatex(-50%) rotate(-45deg) }
.tooltip::after { position: absolute; bottom: calc(100% + 8px) }
```

### [Popover API + @starting-style with form and wrapper](https://codepen.io/asuh/pen/RwzoWMY)

made with: @starting-style · transition · :focus-visible · :has() · backdrop-filter · popover

```css
&[popover]:popover-open { opacity: 1 }
&[popover] { opacity: 0; transition: opacity 500ms, overlay 500ms allow-discrete, display 500ms allow-discrete }
&[popover]:popover-open { opacity: 0 }
&[popover]::backdrop { -webkit-backdrop-filter: blur(0); backdrop-filter: blur(0); transition: display 500ms allow-discrete, overlay 500ms allow-discrete, backdrop-filter 500ms, background-color 500ms }
&[popover]:popover-open::backdrop { -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px) }
&[popover]:popover-open::backdrop { -webkit-backdrop-filter: blur(0); backdrop-filter: blur(0) }
.search { position: relative; top: -50dvh }
.search-close { position: absolute; top: 0 }
&:focus-visible { position: relative }
```

### [Anchored Popover Web Component](https://codepen.io/jamesives/pen/qBzBxZw)

on hover of a.: a.: filter | made with: @keyframes · transition · :hover · popover

```css
a { transition: 200ms all ease-out }
a:hover, a:focus { filter: contrast(150%) }
```

### [popover - demo](https://codepen.io/lctech-jeff/pen/VwJZygo)

made with: @starting-style · transition · :hover · backdrop-filter · popover

```css
[popover] { opacity: 0; transform: translateY(-20px); transition: all 0.25s allow-discrete }
[popover]::backdrop { backdrop-filter: blur(0) }
[popover]::backdrop { transition: all 0.25s allow-discrete }
[popover]:popover-open { opacity: 1; transform: translateY(0) }
[popover]:popover-open::backdrop { backdrop-filter: blur(10px) }
[popover]:popover-open { opacity: 0; transform: translateY(-20px) }
[popover]:popover-open::backdrop { backdrop-filter: blur(0) }
```

### [Popover with anchor positioning](https://codepen.io/th3s4mur41/pen/MWdVVpG)

held: fixed div | made with: :has() · popover

```css
:popover-open { position: absolute; inset: unset; top: anchor(bottom) }
```

### [Toggleable Popover (keyboard key, button click) single key](https://codepen.io/Tcip/pen/JjqMjKd)

made with: popover

```css
kbd { box-shadow: inset 0 -1px 0 #0000004d }
.popover { position: relative }
.popover #mypopover { position: absolute; box-shadow: 0 6.4px 14.4px 0 #00000021, 0 1.2px 3.6px 0 #0000001c }
```

### [Toggleable Popover (keyboard key, button click)](https://codepen.io/Tcip/pen/PovEowK)

made with: popover

```css
kbd { box-shadow: inset 0 -1px 0 #0000004d }
.popover { position: relative }
.popover #mypopover { position: absolute; box-shadow: 0 6.4px 14.4px 0 #00000021, 0 1.2px 3.6px 0 #0000001c }
```

### [CSS Only Popover](https://codepen.io/stepfray/pen/KKLmpdL)

held: fixed div, fixed footer | made with: position: fixed · @starting-style · transition · :hover · popover

```css
button { transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1) }
[popover] { translate: 0 -2rem; opacity: 0; transition: translate 0.5s ease-out, opacity 0.5s ease-out allow-discrete }
[popover]:popover-open { translate: 0 0; opacity: 1 }
[popover]:popover-open { translate: 0 -2rem; opacity: 0 }
body { padding-bottom: 50vh }
footer { position: fixed; bottom: 0 }
```

### [Progressively enhanced popover toggletips](https://codepen.io/michellebarker/pen/QWRKzRy)

held: fixed span, fixed span, fixed span | made with: :hover · :has() · clip-path · popover

```css
.content { position: relative }
&::before { position: absolute; top: 100%; transform: translateX(-50%); -webkit-clip-path: var(--clip); clip-path: var(--clip) }
```

### [CSS Anchor](https://codepen.io/giancarlosgza/pen/YzbypzN)

on scroll: button.btn: background+top | made with: @starting-style · transition · :hover · popover

```css
.btn { margin-top: 45vh }
.popover { position: absolute; inset: auto; top: anchor(bottom) }
.btn { box-shadow: var(--_btn-shadow) }
.popover { translate: 0 1rem; opacity: 0; transition: display 250ms, translate 250ms, opacity 250ms }
.popover p { margin-bottom: 0.5rem }
.popover:popover-open { translate: 0; opacity: 1 }
.popover:popover-open { translate: 0 0.5rem; opacity: 0 }
position-try --left { inset: auto; top: anchor(bottom) }
```

### [HTML Popover API React example](https://codepen.io/A_A_Z/pen/eYapzwV)

held: fixed div.popover | made with: @keyframes · popover

```css
from { scale: 0.1 }
to { scale: 1 }
&:popover-open { animation-duration: 1.2s; animation-name: zoom }
@keyframes zoom animates scale
```

### [Popover Modal Demo](https://codepen.io/dustindowns/pen/dyEPbKq)

held: fixed dialog | made with: :hover · popover · <dialog>

```css
button { text-transform: uppercase; box-shadow: 0.2rem 0.2rem #085624 }
button:active { box-shadow: none; transform: translate(0.2rem, 0.2rem) }
dialog { box-shadow: 0.4rem 0.3rem 1rem #085624 }
dialog::backdrop { opacity: 0.5 }
```

### [Einfaches PopOver ohne Css- Framework](https://codepen.io/christianWiersgowski/pen/dyLxPdK)

on hover of li.button: li.button: shadow | made with: :hover · popover

```css
li.button:hover { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) }
li.button:active { transform: translateY(1px); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) }
.popover-content { position: absolute; box-shadow: 0 2px 5px rgba(224, 127, 20, 0.2) }
```

### [Popover API demo: focus management and tab order](https://codepen.io/clhenrick/pen/MWRLqVz)

held: fixed div | made with: popover

### [a11y accessible use of popover API](https://codepen.io/melsumner/pen/VwNmYLY)

held: fixed div.h-card, fixed div.h-card, fixed div.h-card, fixed span, fixed span, fixed span | made with: :hover · backdrop-filter · popover

```css
footer { margin-top: 3rem; border-top: 1px solid gray }
ul > li { margin-bottom: 0.5rem }
ol > li { margin-bottom: 0.5rem }
thead tr th { position: relative; border-top: none; border-bottom: 1px solid var(--token-color-border-primary) }
thead tr th + th::before { position: absolute; top: 6px; bottom: 6px }
tbody tr:last-of-type td, tbody tr:last-of-type th { border-bottom: none }
tbody td, tbody th { border-top: none; border-bottom: 1px solid var(--token-color-border-primary) }
[popover]::-webkit-backdrop { -webkit-backdrop-filter: blur(3px); backdrop-filter: blur(3px) }
[popover]::backdrop { -webkit-backdrop-filter: blur(3px); backdrop-filter: blur(3px) }
.example { margin-bottom: 2rem }
```

### [Popover/Transition-Behavior/Starting-Style Demo](https://codepen.io/stephenirving/pen/poBJdZo)

made with: @starting-style · @keyframes · transition · :hover · :focus-visible · 3D (perspective / preserve-3d) · popover

```css
button { text-transform: none }
.button { position: relative; bottom: 1.25rem; box-shadow: none; text-transform: uppercase; perspective: 230px }
.button > span { position: absolute; box-shadow: inset 2px 2px 2px 0 rgba(255, 255, 255, 0.5), 7px 7px 20px 0 rgba(0, 0, 0, 0.18), 4px 4px 5px 0 rgba(0, 0, 0, 0.18); transition: background 0.6s, color 0.6s, box-shadow 0.6s, transform 0.6 }
.button > span:first-child { box-shadow: none; transform: rotateX(90deg) }
.button > span:nth-child(2) { transform: rotateX(0deg) }
.button:-moz-focusring > span > span:first-child { box-shadow: inset 2px 2px 2px 0 rgba(255, 255, 255, 0.5), 7px 7px 20px 0 rgba(0, 0, 0, 0.18), 4px 4px 5px 0 rgba(0, 0, 0, 0.18); transform: rotateX(0deg) }
.button:-moz-focusring > span > span:nth-child(2) { box-shadow: none; transform: rotateX(-81deg) }
.button:focus-visible:not(.button--link) > span { outline-offset: 2px }
.button[data-flipped=true] > span:first-child { box-shadow: inset 2px 2px 2px 0 rgba(255, 255, 255, 0.5), 7px 7px 20px 0 rgba(0, 0, 0, 0.18), 4px 4px 5px 0 rgba(0, 0, 0, 0.18); transform: rotateX(0deg) }
.button[data-flipped=true] > span:nth-child(2) { box-shadow: none; transform: rotateX(-81deg) }
.expanding-popover { box-shadow: 0 15px 24px rgba(0, 0, 0, 0.22), 0 19px 76px rgba(0, 0, 0, 0.3); position: relative; text-transform: uppercase; opacity: 0; transform: scaleX(0) }
.expanding-popover::before { position: absolute; top: -5%; animation: spin 3s linear infinite }
```

### [Popoup](https://codepen.io/_juliak/pen/GRLRMOy)

held: fixed div | on hover of button.: button.: background | made with: @keyframes · transition · :hover · clip-path · backdrop-filter · popover

```css
h2 { margin-bottom: 0; text-transform: uppercase }
#close-icon { position: absolute; top: 0px }
#close-icon svg { transition: all .3s ease-in }
.svg-container { clip-path: polygon(100% 0, 100% 90%, 55% 90%, 50% 100%, 45% 90%, 0 90%, 0 0) }
#openIcon { box-shadow: 8px 10px 24px -8px var(--c-brown-01); transition: all .4s ease-out }
&:popover-open { opacity: 1; animation: slide .5s ease-out }
from { opacity: 0; transform: translateY(2rem) }
to { opacity: 1; transform: translateY(0rem) }
@keyframes slide animates opacity, transform
```

### [Toggle popover with keydown](https://codepen.io/Tcip/pen/jOJvLJd)

held: fixed div | made with: transition · backdrop-filter · popover

```css
:popover-open::-webkit-backdrop { -webkit-backdrop-filter: blur(3px); backdrop-filter: blur(3px) }
:popover-open::backdrop { -webkit-backdrop-filter: blur(3px); backdrop-filter: blur(3px) }
.popoverText { -webkit-box-shadow: 0 0 20px 11px #fff, 0 0 2px 6px #fff; box-shadow: 0 0 20px 11px #fff, 0 0 2px 6px #fff; -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px); -webkit-transition: all 0.28s cubic-bezier(0.4,  }
```

### [Bootstrap Popover Example (Toggleable | Hoverable | Dismissible | Positioning)](https://codepen.io/Tcip/pen/mdoGWoq)

on hover of a.: a.: color | made with: popover

### [CSS Grid Test](https://codepen.io/Xordan/pen/wvOzMeG)

made with: position: fixed · @keyframes · transition · :hover · :focus-visible · backdrop-filter · container queries · popover

```css
& > * { position: relative; box-shadow: 2px 6px 10px 5px #0005 }
&:focus-visible { top: 0 }
&::backdrop { backdrop-filter: blur(5px) }
& .card-list__item__cta { position: relative }
& .card-list__item__content { position: relative; padding-top: 40px }
@keyframes slide-in animates right
```

### [Custom element popover input](https://codepen.io/oliverjam/pen/VwRwybx)

made with: popover

### [FAQ using Popover API + state tracking](https://codepen.io/aaronpinero/pen/GRzVPrb)

held: fixed div, fixed div | made with: position: fixed · @keyframes · :hover · popover

```css
ul li { position: relative }
ul li + li { margin-top: 0.5em }
li > button[popovertarget] { position: relative }
li > button[popovertarget]::before { position: absolute }
[popover] { bottom: auto; box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.4); opacity: 0; position: fixed; top: 5%; transform: scale(0.75) }
[popover]:popover-open { -webkit-animation: pop 0.5s forwards; animation: pop 0.5s forwards }
[popover]:popover-open::-webkit-backdrop { -webkit-animation: darken 0.5s forwards; animation: darken 0.5s forwards }
[popover]:popover-open::backdrop { -webkit-animation: darken 0.5s forwards; animation: darken 0.5s forwards }
to { opacity: 1; transform: scale(1) }
to { opacity: 1; transform: scale(1) }
@keyframes pop animates opacity, transform
@keyframes darken animates background
```

### [Popover element](https://codepen.io/mejiaj/pen/BaMqgbG)

made with: transition · :hover · popover

```css
a { transition: color 0.2s }
p { margin-top: var(--size-4) }
.c-popover { position: relative }
.c-popover__trigger { box-shadow: var(--shadow-2) }
.c-popover__trigger:active, .c-popover__trigger:focus { outline-offset: 6px }
.c-popover__target { box-shadow: var(--shadow-2); position: absolute; top: anchor(top); top: 30%; translate: -50% -50% }
.c-popover__title { margin-bottom: var(--size-2) }
```

### [popover](https://codepen.io/Gianlucakun95/pen/NWoOGWB)

made with: :has() · popover

```css
button { position: relative }
[popover] { position: absolute; top: 50px }
.action-window:has(:popover-open) .triangle { border-top: 0px solid transparent; border-bottom: 15px solid var(--popover-bg); position: absolute; translate: 0px 5px }
p.title { text-transform: uppercase }
section { border-bottom: 1px solid #ddd }
```

### [SimpleSwatch](https://codepen.io/thomashafsaas/pen/ExrxzEm)

made with: popover

```css
.swatch { margin-bottom: 10px }
.my-circle { padding-bottom: 10px }
```

### [Popover transition with @starting-style](https://codepen.io/utilitybend/pen/xxmMKbw)

held: fixed div | on hover of button.: button.: background | made with: position: fixed · @starting-style · transition · :hover · popover

```css
@starting-style { opacity: 0; translate: 0 30px }
[popover] { position: fixed; top: 3vw }
button { transition: all 0.2s; box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px }
```

### [Multi level dropdown with Popover and CSS Anchors](https://codepen.io/joshuaaron/pen/XWopWXK)

made with: nothing recognised — read the code

### [Popover Global Attribute testing](https://codepen.io/culiano/pen/qBLqeMz)

held: fixed div | made with: popover

```css
h1, h2, h3, h4, h5, h6 { text-transform: uppercase }
```

### [HTML新機能popover属性でポップオーバー実装してみよう](https://codepen.io/hrshishym/pen/vYQbweB)

held: fixed dialog | made with: popover · <dialog>

```css
dialog[popover]:popover-open { position: absolute; inset: unset; top: 20vh; transform: translateX(50%) }
dialog[popover]::backdrop { filter: blur(5px) }
img { vertical-align: bottom }
```

### [popover](https://codepen.io/polinux/pen/RwqBQbj)

held: fixed div | made with: popover

### [DDS2 Popover bug workaround for aria-label](https://codepen.io/DorkForce/pen/GRwdQgP)

made with: popover

### [Popsie Popover](https://codepen.io/febby_gunawan/pen/OJaOPrb)

made with: transition · popover

```css
abbr[title] { border-bottom: none }
sub, sup { position: relative }
sub { bottom: -0.25em }
sup { top: -0.5em }
button, select { text-transform: none }
[type="search"] { outline-offset: -2px }
noscript { margin-bottom: 1em; margin-top: 1em }
* + p { margin-top: 0.75em }
.popover-trigger { position: relative }
.popover-trigger { transition: transform 0.15s ease-out }
.popover-trigger:focus { transform: scale(1.25) }
.popover-trigger:focus svg { filter: drop-shadow(0 0 1.2em var(--theme-color)) }
```

### [Native dialog and native popover test](https://codepen.io/ankedsgn/pen/WNYpXOZ)

held: fixed div | made with: backdrop-filter · popover · <dialog>

```css
.dialog::backdrop { backdrop-filter: blur(2px) }
.popover__container { position: relative }
```

### [Popover](https://codepen.io/carlos-eduardo-albuquerque/pen/BaGjBpO)

held: fixed div.modal | made with: backdrop-filter · popover

```css
.modal::backdrop { backdrop-filter: blur(3px) }
```

### [...just some fun with the Popover API](https://codepen.io/aepicos/pen/yLQLxbB)

held: fixed nav | on hover of button.: button.: background | made with: :hover · popover

```css
[popover]:popover-open { position: absolute; inset: unset }
[popover]:popover-open::backdrop { opacity: 0.1 }
button:focus { outline-offset: -2px }
[popover] { box-shadow: 0 1px 2px rgba(34, 51, 68, 0.3), 0 2px 8px rgba(34, 51, 68, 0.4) }
```

### [Basic CSS Animated Popover](https://codepen.io/giancarlosgza/pen/VwEOMor)

held: fixed div.popover | on scroll: button.: background | made with: position: fixed · @starting-style · transition · :hover · popover

```css
@starting-style { translate: 0 2rem; opacity: 0 }
```

### [Bootstrap latest popover with html](https://codepen.io/Alpesh_Rajpurohit/pen/gOBomYG)

made with: popover

### [Radial selectmenu with Anchoring API - Open UI](https://codepen.io/utilitybend/pen/qBJbmEg)

held: fixed div.support-warnings | on hover of button.selected-button: button.selected-button: background | made with: transition · :hover · :has() · popover

```css
.selected-button { position: relative; transition: background .2s ease-out }
option { position: absolute; top: 50%; transition: all .4s }
[popover] { position: relative; top: anchor(--selectmenu center); transform: translate(-50%, -50%) }
[popover]:popover-open option { transform: rotate(var(--deg)) translate(var(--half-circle)) rotate(var(--negative-deg)) }
```

### [Pure CSS Modal (no JavaScript)](https://codepen.io/wesleymaik/pen/GRXeWYg)

held: fixed section.modal | on hover of a.: button.: shadow | made with: position: fixed · @keyframes · transition · :hover

```css
button { box-shadow:2px 2px #00000040; transition:all ease .2s }
button.primary { box-shadow:none !important }
button:hover { box-shadow:8px 8px #00000080 }
.modal { position:fixed; top:50%; transform:translate(-50%, -50%) }
.modal:target { animation:fade ease .5s forwards }
.modal .header { border-bottom:1px solid #00000020 }
.modal .footer { margin-top:auto }
from { opacity:0 }
to { opacity:1 }
@keyframes fade animates opacity
```

### [filter mega list](https://codepen.io/jagathgj/pen/bGKWNjB)

on hover of a.btn: a.btn: background | made with: :hover · popover

```css
.popover table { margin-bottom: 0 }
.popup-footer { padding-top: 20px }
.styled-checkbox { position: absolute; opacity: 0 }
.styled-checkbox + label { position: relative; margin-bottom: 0 }
.styled-checkbox + label:before { vertical-align: text-top }
.styled-checkbox:disabled + label:before { box-shadow: none }
.styled-checkbox:checked + label:after { position: absolute; top: 9px; box-shadow: 2px 0 0 white, 4px 0 0 white, 4px -2px 0 white, 4px -4px 0 white, 4px -6px 0 white, 4px -8px 0 white; transform: rotate(45deg) }
.select-list-wrapper { box-shadow: 1px -1px 1px 1px rgba(0, 0, 0, 0.04) inset }
.select-title { -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0) }
.popover { -webkit-transform: translateZ(0) scale(1, 1); transform: translateZ(0) scale(1, 1); transform: translate3d(0, 0, 0) }
```

### [Dorico Popover Mockups](https://codepen.io/jassler/pen/xxjvKzY)

made with: @keyframes · popover

```css
.dorico-input { position: relative }
.helptext { position: absolute; border-top: 0 solid black; border-top: none; top: calc(var(--bordersize) + var(--blocksize) - 5px) }
.helptext.show { border-bottom: var(--bordersize) solid black }
label { position: relative }
input { position: absolute; top: 0 }
.sugg { position: absolute; top: 0; opacity: 0 }
.animated { animation: slider 12s infinite }
.animated:nth-child(3) { animation-delay: 3s }
.animated:nth-child(4) { animation-delay: 6s }
.animated:nth-child(5) { animation-delay: 9s }
0% { top: 20px; opacity:0 }
5% { top: 0px; opacity: 0.4 }
```

### [custom bootstrap 5 popover](https://codepen.io/mgregchi/pen/XWaJrmM)

on scroll: a.btn: background | on hover of div.input-group-btn: a.btn: background | made with: popover
