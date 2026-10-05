# CodePen · starting-style — how each pen does it

40 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/starting-style.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| @starting-style | 40 |
| transition | 36 |
| :hover | 20 |
| :has() | 12 |
| popover | 11 |
| :focus-visible | 10 |
| <dialog> | 9 |
| backdrop-filter | 8 |
| position: fixed | 6 |
| custom properties driven by JS | 5 |
| @keyframes | 5 |
| clip-path | 4 |
| 3D (perspective / preserve-3d) | 3 |
| mix-blend-mode | 3 |
| prefers-reduced-motion | 2 |
| scroll-snap | 2 |
| (hover: hover) gate | 2 |
| container queries | 2 |
| scroll listener | 2 |
| mask | 1 |
| pointer / mouse tracking | 1 |
| requestAnimationFrame | 1 |
| scroll-driven animation (animation-timeline) | 1 |
| view() timeline | 1 |
| animation-range | 1 |

## Every pen

### [@starting-style - popup no js animation](https://codepen.io/makesomelayouts/pen/Qwdmmzg)

on scroll: button.: background+top | made with: @starting-style · transition · :hover · prefers-reduced-motion · <dialog>

```css
&:hover { scale: 0.94 }
& button[command="close"] { margin-top: 2rem }
@starting-style { opacity: 0 }
```

### [Staggered CSS transition | transition-delay & sibling-index](https://codepen.io/BlogFire/pen/bNBEEyy)

made with: @starting-style · transition · 3D (perspective / preserve-3d)

```css
section { perspective: 800px }
section > * { transition: background 1.5s ease, transform 0.8s ease, opacity 0.6s ease }
@starting-style { transform: scaleX(0.5); opacity: 0 }
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

### [curved highlighter](https://codepen.io/vii120/pen/MYjPqPV)

made with: @starting-style · transition · mask

```css
.title span { position: relative }
.title span:before { position: absolute; top: 50%; translate: -50% 0; transition: --mask-progress 0.5s; mask-image: conic-gradient(from -27deg, #000 var(--mask-progress), #0000 0) }
.title span:before { --mask-progress: 0% }
```

### [CSS sibling-index() Stagger Cards — @starting-style + Magnetic Cursor · 2026](https://codepen.io/Ahmod-Musa/pen/GgjMGRj)

held: fixed div, fixed div | made with: position: fixed · @starting-style · transition · :hover · mix-blend-mode · custom properties driven by JS · pointer / mouse tracking · requestAnimationFrame

```css
#cursor { position: fixed; transform: translate(-50%, -50%); transition: width .2s, height .2s, background .2s; mix-blend-mode: multiply }
#cursor-ring { position: fixed; transform: translate(-50%, -50%); transition: width .4s cubic-bezier(.34,1.56,.64,1), height .4s cubic-bezier(.34,1.56,.64,1), background .3s, border-color .3s }
.eyebrow { text-transform: uppercase; margin-bottom: 12px }
.header-right { padding-top: 12px }
.header-desc { margin-bottom: 16px }
.ctrl-btn { transition: all .2s }
.ctrl-label { text-transform: uppercase }
.card { position: relative; transition: opacity .6s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.34,1.2,.64,1) }
.card { opacity: 0; transform: translateY(32px) scale(.96) }
.card::before { position: absolute; inset: 0; opacity: 0; transition: opacity .4s }
.card:hover::before { opacity: .04 }
.card-inner { position: relative }
```

```js
style.setProperty('--si-delay', `${i * delay}ms`)
addEventListener('mouseenter', () => document.body.classList.add('hovering'))
addEventListener('mouseleave', () => document.body.classList.remove('hovering'))
addEventListener('mousemove', e => { mx = e.clientX
requestAnimationFrame(lerp)
```

### [Pizza Time. Springy Circular Nav / Hero Circle ~ sin / cos calc](https://codepen.io/tomhermans/pen/PwGpZzE)

made with: @starting-style · transition · :hover · custom properties driven by JS

```css
.stack a { transform: translatex(var(--_cos)) translatey(var(--_sin)) rotate(calc(var(--_angle) + 90deg)); transition: transform 1.3s var(--easing), scale 0.8s var(--easing), background-color 0.5s ease, opacity 2.5s ease, rotate 1. }
.stack a:hover { scale: 1.1 }
.stack a { transform: translateX(0) translateY(400px); scale: 0.1; opacity: 0 }
.btn { position: relative; transition: color 0.5s ease }
#ccw svg { transform: scale(-1, 1) }
.btn::before { position: absolute; bottom: -100%; transform: translateX(-50%); transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), height 0.4s cubic-bezier(0.4, 0, 0.2, 1) }
.controls { transform: translate(0, 150px) }
```

```js
style.setProperty("--_startangle", newStartAngle + 'deg')
style.setProperty("--_startangle", newStartAngle + "deg")
style.setProperty("--_startangle", startAngle + "deg")
style.setProperty("--" + prop, val + unit)
```

### [one-div image reveal effect](https://codepen.io/vii120/pen/WbGrBoy)

made with: @starting-style · transition

```css
div { transition: --progress-1 var(--duration) calc(var(--delay) * 1) var(--timing-function), --progress-2 var(--duration) calc(var(--delay) * 2) var(--timing-function), --progress-3 var(--duration) calc(var(--delay) * 3) var( }
```

### [CSS @starting-style: Animating display: none to block](https://codepen.io/arsen-nazaryan/pen/azmzyVd)

made with: @starting-style · transition

```css
.box { margin-top: 20px; transition: opacity 0.5s ease, transform 0.5s ease, display 0.5s allow-discrete }
.hidden { opacity: 0; transform: scale(0.5) }
.box:not(.hidden) { opacity: 0; transform: scale(0.5) }
```

### [toast animation](https://codepen.io/vii120/pen/MYeqrya)

made with: @starting-style · transition · custom properties driven by JS

```css
.toast-wrapper { position: relative }
.toast-wrapper .toast { position: absolute; bottom: 0; transition: all 0.3s; opacity: 1; translate: 0 calc(var(--order) * (100% + var(--toast-gap)) * -1) }
.toast-wrapper .toast { opacity: 0; translate: 0% 100% }
.add-btn { position: relative; transition: all 0.2s }
.add-btn:active { scale: 0.98 }
```

```js
style.setProperty('--i', toastCount)
style.setProperty('--total', toastCount + 1)
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

### [dialog html & css](https://codepen.io/crianbluff/pen/EaKwKYP)

made with: @starting-style · transition · :has() · backdrop-filter · <dialog>

```css
&::backdrop { backdrop-filter: blur(0px); transition: background-color 0.7s ease-in-out, backdrop-filter 0.7s ease-in-out, display 0.7s ease-in-out allow-discrete, overlay 0.7s ease-in-out allow-discrete }
&::backdrop { backdrop-filter: blur(10px) }
dialog[open] { transform: rotate(0) scale(0) }
dialog[open]::backdrop { backdrop-filter: blur(0px) }
p { margin-bottom: 2rem }
```

### [CSS expanding cards animation](https://codepen.io/claudialn/pen/zxqryWO)

made with: @starting-style · transition · :hover · :focus-visible · :has()

```css
.accordion_list:has(.accordion_item:is(:hover, :focus-visible)) .accordion_item: { opacity: 0 }
span { transition: opacity 0.5s linear }
.accordion_list { transition: all var(--duration) var(--ease) }
.accordion_item { transition: all var(--duration) var(--ease) allow-discrete }
```

### [CSS-only Dialog animation](https://codepen.io/claudialn/pen/xbVGZgg)

made with: @starting-style · transition · :has() · backdrop-filter · <dialog>

```css
.dialog_content { backdrop-filter: blur(4px) }
@starting-style { translate: 0 100vh }
&:not([open]) { translate: 0 100vh }
@starting-style { backdrop-filter: blur(0) }
```

### [anchor positioning motion in](https://codepen.io/andrewrock/pen/VYeQBjw)

made with: @starting-style · transition · :hover · :focus-visible · popover

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

held: fixed div | on hover of button.: button.: background+color, svg.[object: color, path.[object: color | made with: position: fixed · @starting-style · transition · :hover · :focus-visible · custom properties driven by JS · popover

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

### [Animating display: none with @starting-style and allow-discrete](https://codepen.io/mysth/pen/GgooXNV)

made with: @starting-style · transition

```css
.button { opacity: 1 }
.card--broken { transition: opacity .5s ease; will-change: opacity }
.card--perfect { transition: opacity 2s, display .5s; will-change: opacity, display }
.is-hidden { opacity: 0 }
.card--perfect { opacity: 0 }
```

### [AI Prompt builder](https://codepen.io/andrewrock/pen/QwjPzEN)

held: fixed dialog.dialog | on scroll: article.prompt-container: shadow | on hover of article.column-container: article.column-container: shadow, article.prompt-container: shadow | made with: position: fixed · @starting-style · @keyframes · transition · :hover · :focus-visible · :has() · prefers-reduced-motion · backdrop-filter · <dialog>

```css
:where(html) { --type-scale: 1.25 }
h3:has(.material-symbols-outlined) .material-symbols-outlined { transition: transform var(--motion-interactive) var(--spring-light) }
.card { box-shadow: var(--shadow-sm); transition: transform var(--motion-hover) var(--smooth), box-shadow var(--motion-hover) var(--smooth), border-color var(--motion-hover) var(--smooth) }
.card:hover { box-shadow: var(--shadow-md) }
.prompt-intro { box-shadow: none; position: relative }
.prompt-intro::before { bottom: 0; position: absolute; top: 0 }
.faq-content { margin-top: var(--space-6) }
.btn { transition: all var(--motion-hover) var(--smooth), transform var(--motion-feedback) var(--spring-light) }
.btn:hover:not(:disabled) { transform: translateY(-1px) }
.btn:active { transform: translateY(0) scale(0.98) }
.btn:disabled { opacity: 0.5; transform: none }
.header-button { transition: all var(--motion-hover) var(--smooth), transform var(--motion-feedback) var(--spring-light) }
```

### [FLEX - Add/Remove last element with animation (JS) #demo](https://codepen.io/cbolson/pen/OPypQJW)

on hover of button.: button.: background | made with: @starting-style · transition · :hover · :focus-visible

```css
&::before, &::after { position: absolute; top: 50%; translate: var(--label-x, 0) -50%; transition: all 150ms ease-in-out; opacity: var(--label-opacity, 0) }
&:first-child:is(:hover, :focus-visible)::before { --label-opacity: 1 }
&:last-child:is(:hover, :focus-visible)::after { --label-opacity: 1 }
&:focus-visible { outline-offset: 3px }
```

### [Swiper-Slider: Scroll, Drag, and Click to Navigate](https://codepen.io/AtStudio/pen/emYGZgB)

made with: scroll-snap · @starting-style · transition · :hover · :has() · (hover: hover) gate · container queries · scroll listener

```css
@starting-style { opacity: 0.3; transform: scale(1) }
container not scroll-state(snapped: x) { opacity: 0.3 }
&:nth-of-type(2) { grid-area: position }
&::after { position: absolute; bottom: 0; transition: width 0.4s ease-in-out }
svg { transform: translateX(0); transition: transform 0.2s ease-in-out }
svg { transform: translateX(4px) }
```

```js
addEventListener('scroll', () => {
addEventListener('mouseleave', () => {
```

### [Swiper-Slider: Scroll to Navigate](https://codepen.io/AtStudio/pen/bNGRJZX)

made with: scroll-snap · @starting-style · transition · :hover · :has() · (hover: hover) gate · container queries · scroll listener

```css
@starting-style { opacity: 0.3; transform: scale(0.98) }
container not scroll-state(snapped: x) { opacity: 0.3 }
&:nth-of-type(2) { grid-area: position }
&::after { position: absolute; bottom: 0; transition: width 0.4s ease-in-out }
svg { transform: translateX(0); transition: transform 0.2s ease-in-out }
svg { transform: translateX(4px) }
```

### [Tailwind 4 Dialog w/ @starting-style](https://codepen.io/sfearl1/pen/ByBGddo)

on scroll: button.inline-flex: background | made with: @starting-style · 3D (perspective / preserve-3d) · popover

### [CSS Baseline 2023/2024](https://codepen.io/nikstra/pen/abeeXOj)

made with: @starting-style · transition

```css
label { margin-top: 1em }
```

### [CSS only animated summary/details (accordeon)](https://codepen.io/Shven/pen/rNXjJbW)

made with: @starting-style · :hover

```css
.summary__summary { position: relative }
.summary__definition { opacity: 0; transition-property: grid-template-rows, opacity; will-change: grid-template-rows, display, opacity }
.summary__details[open] + .summary__definition { opacity: 1 }
.summary__details[open] + .summary__definition { opacity: 0 }
```

### [Simple demo: @starting-style](https://codepen.io/ghaste/pen/OJKRQXq)

made with: @starting-style · transition

```css
.box { transition: scale 1s, rotate 1.5s, border-color 2s; scale: 1; rotate: 0deg }
.box { scale: 0; rotate: -720deg }
```

### [Pacman CSS Fun: 4 of 4 Overlay Property animations](https://codepen.io/jupago/pen/XWvmmqj)

made with: @starting-style · transition · :hover · :has() · <dialog>

```css
.eyeSclera, .eyeColor { transition: all 200ms ease-in-out }
@starting-style { translate: 0 100vh }
&:has(i:hover) .eyeColor { transform: translate(-4px, -2px) }
&:has(i + i:hover) .eyeColor { transform: translate(0, -2px) }
&:has(i + i + i:hover) .eyeColor { transform: translate(-4px, 4px) }
&:has(i + i + i + i:hover) .eyeColor { transform: translate(0, 4px) }
```

### [Pacman CSS Fun: 3 of 4 @starting-style entry animations](https://codepen.io/jupago/pen/ExqVVgK)

made with: @starting-style · @keyframes · transition · :hover

```css
.dots { position: absolute; top: 0 }
@starting-style { opacity: 0; transform: translateY(3rem) rotateY(180deg) scale(0.3) }
&:after { position: absolute; box-shadow: 0 3vw 2rem oklch(0.3 0.3 198 / 0.8) }
.eyeSclera, .eyeColor { transition: all 200ms ease-in-out }
&:hover { animation: shakeIt 300ms ease infinite }
0% { transform: translateX(0); filter: hue-rotate(0deg) }
25% { transform: translateX(1px); filter: hue-rotate(60deg) }
50% { transform: translateX(-1px); filter: hue-rotate(120deg) }
75% { transform: translateX(1px); filter: hue-rotate(180deg) }
100% { transform: translateX(0); filter: hue-rotate(240deg) }
@keyframes shakeIt animates transform, filter
```

### [【Animation】Dialog（@starting-style / allow-discrete）](https://codepen.io/zaxrfawb-the-lessful/pen/MWMRQwE)

made with: @starting-style · transition · backdrop-filter · <dialog>

```css
::-webkit-backdrop { opacity: 0; -webkit-transition: opacity 1s, display 1s allow-discrete, overlay 1s allow-discrete; transition: opacity 1s, display 1s allow-discrete, overlay 1s allow-discrete }
dialog, ::backdrop { opacity: 0; transition: opacity 1s, display 1s allow-discrete, overlay 1s allow-discrete }
::-webkit-backdrop { -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px) }
::backdrop { -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px) }
dialog[open]::-webkit-backdrop { opacity: 1 }
dialog[open], dialog[open]::backdrop { opacity: 1 }
dialog[open]::-webkit-backdrop { opacity: 0 }
dialog[open], dialog[open]::backdrop { opacity: 0 }
```

### [Box reveal using @starting-style](https://codepen.io/cbolson/pen/YzoJroR)

made with: @starting-style · @keyframes · transition · custom properties driven by JS

```css
@starting-style { opacity: 0; translate: 0 100px }
```

```js
style.setProperty('--i', index)
```

### [Animate Scroll-In](https://codepen.io/el22or/pen/QWXOKpa)

made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @starting-style · @keyframes

```css
from { opacity: 0; scale: 0.75 }
to { opacity: 1; scale: 1 }
@starting-style { opacity: 0; scale: 0.75 }
@keyframes scroll-in animates opacity, scale
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

### [Animate display using CSS](https://codepen.io/alexerlandsson/pen/qBzWbBK)

made with: @starting-style · <dialog>

```css
dialog { opacity: 0; transition-property: display opacity transform; transform: translateY(30px) }
dialog[open] { opacity: 1; transform: translateY(0) }
dialog[open] { opacity: 0; transform: translateY(30px) }
```

### [html dialog enter/leave transition w/ @starting-style](https://codepen.io/vii120/pen/dyEWgEe)

made with: @starting-style · transition · :hover · :focus-visible · backdrop-filter · <dialog>

```css
body { position: relative }
body:before { position: absolute; inset: 0; opacity: 0.6 }
btn { backdrop-filter: blur(5px); box-shadow: 3px 5px white; transition: scale 0.3s }
btn:hover { scale: 1.05 }
dialog { --dialog-opacity: 0; --dialog-translate: 0 1rem; --mask-opacity: 0; opacity: var(--dialog-opacity); translate: var(--dialog-translate); transition: all 0.5s allow-discrete, opacity 0.5s, translate 0.5s }
dialog[open] { --dialog-opacity: 1; --dialog-translate: 0 0 }
dialog[open]::backdrop { --mask-opacity: 1 }
dialog::backdrop { opacity: var(--mask-opacity); backdrop-filter: blur(5px); transition: opacity 0.5s }
dialog[open] { --dialog-opacity: 0; --dialog-translate: 0 1rem }
dialog[open]::backdrop { --mask-opacity: 0 }
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

### [Transitioning display property with transition-behavior: allow-discrete and @starting-style css at-rule](https://codepen.io/idenysenko/pen/jOdRRGx)

made with: @starting-style · transition

```css
&.hide { opacity: 0 }
.section--1 { opacity: 0 }
```

### [Popover transition with @starting-style](https://codepen.io/utilitybend/pen/xxmMKbw)

held: fixed div | made with: position: fixed · @starting-style · transition · :hover · popover

```css
@starting-style { opacity: 0; translate: 0 30px }
[popover] { position: fixed; top: 3vw }
button { transition: all 0.2s; box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px }
```

### [Warnings and errors show and hide with allow-discrete transitions](https://codepen.io/utilitybend/pen/vYvQder)

made with: @starting-style · transition · :has() · clip-path

```css
@starting-style { opacity: 0 }
:root:has(.hide-error:checked) .card-error { opacity: 0 }
:root:has(.hide-warning:checked) .card-warning { opacity: 0 }
:root:has(.hide-success:checked) .card-success { opacity: 0 }
& p { padding-top: 0.3rem }
.controls { margin-bottom: 30px }
.sr-only:not(:focus):not(:active) { clip-path: inset(50%); position: absolute }
```

### [Enter and exit dom with @starting-style](https://codepen.io/utilitybend/pen/rNoQNNp)

made with: @starting-style · transition · :hover · :has() · clip-path

```css
@starting-style { opacity: 0; transform: translate(0, 50%) }
~ li { transition: translate 0.5s ease-out; translate: 0 -100% }
&:has(.removing) + .btn-add { transition: translate 0.5s ease-out; translate: 0 -100% }
.sr-only:not(:focus):not(:active) { clip-path: inset(50%); position: absolute }
```
