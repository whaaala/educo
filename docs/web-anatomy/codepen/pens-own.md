# CodePen · pens-own — how each pen does it

570 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/pens-own.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| transition | 315 |
| :hover | 257 |
| @keyframes | 181 |
| position: fixed | 127 |
| clip-path | 61 |
| 3D (perspective / preserve-3d) | 58 |
| mask | 42 |
| GSAP | 41 |
| :focus-visible | 30 |
| :has() | 29 |
| scroll() timeline | 26 |
| scroll-driven animation (animation-timeline) | 25 |
| custom properties driven by JS | 25 |
| scroll-snap | 22 |
| mix-blend-mode | 21 |
| position: sticky | 20 |
| pointer / mouse tracking | 19 |
| requestAnimationFrame | 18 |
| view() timeline | 18 |
| prefers-reduced-motion | 14 |
| animation-range | 12 |
| scroll listener | 11 |
| ScrollTrigger | 11 |
| Web Animations API (.animate) | 11 |
| backdrop-filter | 11 |
| <dialog> | 10 |
| @starting-style | 7 |
| view transitions | 7 |
| three.js / WebGL | 6 |
| Lenis / smooth scroll | 4 |
| container queries | 4 |
| popover | 4 |
| canvas 2D | 3 |
| (hover: hover) gate | 3 |
| IntersectionObserver | 3 |

## Every pen

### [Scroll with light (CSS only)](https://codepen.io/gayane-gasparyan/pen/wvNXyYR)

on scroll: div.scrollbar: background+top | made with: scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @keyframes

```css
.scrollbar { animation: on-scrolling both linear; animation-timeline: scroll(); animation-range: 10vh }
.container { position: relative }
.container::before, .container::after { position: absolute; top: 0; animation: on-scrolling both linear; animation-timeline: scroll(); animation-range: 10vh }
.container::before { filter: blur(1px) }
.container::after { filter: blur(10px) }
main { margin-top: 40vh; padding-bottom: 40vh }
p { --text-offset-1: 10; --text-offset-2: 10; --text-offset-3: 10; --text-offset-4: 10; animation: on-scrolling both linear; animation-timeline: scroll(); animation-range: 10vh }
p:nth-child(1) { opacity: var(--opacity-1); transform: translateY(calc(var(--text-offset-1) * 1px)) }
p:nth-child(2) { opacity: var(--opacity-2); transform: translateY(calc(var(--text-offset-2) * 1px)) }
p:nth-child(3) { opacity: var(--opacity-3); transform: translateY(calc(var(--text-offset-3) * 1px)) }
p:nth-child(4) { opacity: var(--opacity-4); transform: translateY(calc(var(--text-offset-4) * 1px)) }
0% { --scroll-y-position: -10%; --reflection-y-position: -22% }
```

### [Color Picker - CSS Scroll Snap and Experiemental scroll-start, snapChanging, snapChanged](https://codepen.io/web-dot-dev/pen/OJeOOVG)

made with: scroll-snap · mask · scroll listener

```css
legend { opacity: 0 }
> * { scroll-snap-align: center }
input { opacity: 0 }
```

### [Neumorphism Play Button](https://codepen.io/yuhomyan/pen/LYGMQJJ)

on scroll: a.btn: filter+background+color, i.fas: color | on hover of a.btn: a.btn: filter+background+color ×2, i.fas: color ×2 | made with: @keyframes · transition · :hover

```css
.frame { position: relative; box-shadow: -7px -7px 20px 0px #fff9, -4px -4px 5px 0px #fff9, 7px 7px 20px 0px #0002, 4px 4px 5px 0px #0001, inset 0px 0px 0px 0px #fff9, inset 0px 0px 0px 0px #0001, inset 0px 0px 0px 0px #fff9, ins }
.btn { box-shadow: -7px -7px 20px 0px #fff9, -4px -4px 5px 0px #fff9, 7px 7px 20px 0px #0002, 4px 4px 5px 0px #0001; transition:box-shadow 0.6s cubic-bezier(.79,.21,.06,.81) }
.btn:hover { animation: colorchange 3s linear infinite }
.btn:active { box-shadow: 4px 4px 6px 0 rgba(255,255,255,.5), -4px -4px 6px 0 rgba(116, 125, 136, .2), inset -4px -4px 6px 0 rgba(255,255,255,.5), inset 4px 4px 6px 0 rgba(116, 125, 136, .3) }
to { filter: hue-rotate(360deg) }
@keyframes colorchange animates filter
```

### [Button Glow](https://codepen.io/Ks145/pen/MWGxbYr)

on scroll: button.glowing-btn: opacity+color, span.glowing-txt: opacity+color, span.faulty-letter: opacity+color | made with: @keyframes · transition · :hover · 3D (perspective / preserve-3d)

```css
.glowing-btn { position: relative; perspective: 2em; -webkit-box-shadow: inset 0px 0px 0.5em 0px var(--glow-color), 0px 0px 0.5em 0px var(--glow-color); -moz-box-shadow: inset 0px 0px 0.5em 0px var(--glow-color), 0px 0px 0.5em 0px var( }
.glowing-txt { animation: text-flicker 3s linear infinite }
.faulty-letter { opacity: 0.5; animation: faulty-flicker 2s linear infinite }
.glowing-btn::before { position: absolute; top: 0; bottom: 0; opacity: 0.7; filter: blur(1em); transform: translateY(120%) rotateX(95deg) scale(1, 0.35) }
.glowing-btn::after { position: absolute; top: 0; bottom: 0; opacity: 0; box-shadow: 0 0 2em 0.2em var(--glow-color); transition: opacity 100ms linear }
.glowing-btn:hover { animation: none }
.glowing-btn:hover .glowing-txt { animation: none }
.glowing-btn:hover .faulty-letter { animation: none; opacity: 1 }
.glowing-btn:hover:before { filter: blur(1.5em); opacity: 1 }
.glowing-btn:hover:after { opacity: 1 }
0% { opacity: 0.1 }
2% { opacity: 0.1 }
```

### [Animated SVG Checkbox - Grenade](https://codepen.io/peteyio/pen/XWjwOLK)

made with: GSAP

```css
.card { position: relative }
svg { position: absolute; top: 13px }
.svgHolder { position: relative }
```

```js
gsap.timeline()
```

### [Smart Navbar](https://codepen.io/anon/pen/yLVzxdQ)

held: sticky nav | made with: position: sticky · transition · prefers-reduced-motion · scroll listener

```css
nav { position: sticky; top: 0; transition: top 500ms ease-in-out }
nav.scroll-up, nav:focus-within { top: 0 }
nav.scroll-down { top: -100% }
.logo { text-transform: uppercase }
nav a { text-transform: uppercase }
```

```js
addEventListener("scroll", () => {
```

### [Potion selector](https://codepen.io/utilitybend/pen/ZEPBGGR)

on scroll: select.: background+shadow | on hover of button.: select.: background+shadow | made with: @starting-style · @keyframes · transition · :hover · :has()

```css
&:is(:hover, :focus) { box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset }
.icon { transform: rotate(20deg); transition: transform 0.15s }
::picker(select) { top: anchor(center); transform: translate(-50%, -50%); transition: overlay 0.5s, display 0.5s, pointer-events 0.5s }
& span { position: absolute; bottom: -30px; transform: translateX(-50%); opacity: 0 }
option:is(:hover, :focus) { box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset }
option:is(:hover, :focus, :checked) .icon { transform: rotate(0) }
& span { animation: fade-in 0.4s ease-out forwards 0.4s }
@starting-style { transform: none }
from { opacity: 0 }
to { opacity: 1 }
@keyframes fade-in animates opacity
```

### [CodePen Challenge - Card](https://codepen.io/Call_in/pen/eqPWoy)

held: fixed div.credit | on scroll: span.: color+top ×2, div.card: transform+top | on hover of a.: span.: color+top ×2, a.: color, i.fas: color, div.card: transform+top | made with: position: fixed · transition · :hover · canvas 2D

```css
.credit { position: fixed; bottom: 15px; -webkit-box-shadow: 0 0 50px -10px rgba(0, 0, 0, 0.15); box-shadow: 0 0 50px -10px rgba(0, 0, 0, 0.15) }
.credit a { -webkit-transition: color 300ms ease; -o-transition: color 300ms ease; transition: color 300ms ease }
#background { position: absolute; top: 0 }
.card { position: relative; -webkit-box-shadow: 0 0 60px -15px rgba(0, 0, 0, 0.25); box-shadow: 0 0 60px -15px rgba(0, 0, 0, 0.25); -webkit-transition: -webkit-transform 300ms ease; transition: -webkit-transform 300ms ease; -o-t }
.card .actions { -webkit-transition: -webkit-box-shadow 300ms ease; transition: -webkit-box-shadow 300ms ease; -o-transition: box-shadow 300ms ease; transition: box-shadow 300ms ease; transition: box-shadow 300ms ease, -webkit-box-shadow }
.card:hover { -webkit-transform: scale(1.03); -ms-transform: scale(1.03); transform: scale(1.03) }
.actions button { -webkit-transition: background 300ms ease, -webkit-transform 300ms ease; transition: background 300ms ease, -webkit-transform 300ms ease; -o-transition: transform 300ms ease, background 300ms ease; transition: transform  }
.actions button:hover { -webkit-transform: scale(1.1); -ms-transform: scale(1.1); transform: scale(1.1); -webkit-box-shadow: 0 5px 15px 0px rgba(0, 0, 0, 0.1); box-shadow: 0 5px 15px 0px rgba(0, 0, 0, 0.1) }
.actions button:active { -webkit-transform: scale(0.9); -ms-transform: scale(0.9); transform: scale(0.9) }
.avatar { position: absolute; top: -60px; -webkit-transform: translateX(-50%); -ms-transform: translateX(-50%); transform: translateX(-50%); -webkit-box-shadow: 0 10px 10px -5px rgba(0, 0, 0, 0.1); box-shadow: 0 10px 10px -5px rgb }
.avatar:hover { -webkit-transform: translateX(-50%) scale(1.1); -ms-transform: translateX(-50%) scale(1.1); transform: translateX(-50%) scale(1.1) }
```

### [Hover 3](https://codepen.io/anon/pen/OJQLEyO)

made with: transition · :hover

```css
.hover-3 { transition: .3s var(--_s,0s), background-position .3s calc(.3s - var(--_s,0s)) }
```

### [Responsive SVG Black Friday Badge](https://codepen.io/jonnitto/pen/xQYEGV)

on scroll: a.badge: transform+top | made with: transition · :hover

```css
.badge { position: relative; transition: transform 0.3s ease; transform: rotate(-14deg); filter: drop-shadow(0.25em 0.7em 0.95em rgba(0, 0, 0, 0.8)) }
.badge::before { position: absolute; top: 50%; transform: translate(-50%, -50%); opacity: 0.8; transition: opacity 0.3s linear }
.badge:hover { transform: rotate(-10deg) scale(1.05) }
.badge:hover::before { opacity: 0.9 }
.badge svg { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.badge span { text-transform: uppercase }
```

### [CSS Typing Effect + @scroll-timeline](https://codepen.io/anon/pen/zYKyevz)

held: fixed div.wrapper, fixed div.warning, fixed dialog.sda_update | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
.wrapper { position: fixed; top: 0 }
.text { animation: typing 2s steps(22), blink 0.5s step-end infinite alternate; animation-timeline: scrolling, auto }
.warning { position: fixed; top: 1em }
@keyframes typing animates width
@keyframes blink animates border-color
```

### [Multi-buttons](https://codepen.io/brigitamaria/pen/qBEpGWq)

on scroll: button.: transform+background+top | on hover of button.: button.: transform+background+top ×2 | made with: @keyframes · transition · :hover

```css
button { box-shadow: none; transition: background-color 250ms ease-in-out, transform 150ms ease }
button:hover { animation-duration: 0.65s; animation-name: transformit; animation-iteration-count: infinite; animation-direction: alternate }
from { transform: translate(0px,0px) }
to { transform: translate(0px,-6px) }
button:focus { animation: none }
@keyframes transformit animates transform, background-color
```

### [scroll timeline cube](https://codepen.io/anon/pen/ZEdZNjR)

held: fixed div.progress, fixed div.cube-wrap | on scroll: div.progress: background, div.cube: transform | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · 3D (perspective / preserve-3d)

```css
body { animation: body 1s linear; animation-timeline: scroll() }
.progress { position: fixed; top: 0; animation: progress 1s linear; animation-timeline: scroll() }
.progress { position: fixed; top: 0 }
.cube-wrap { position: fixed; top: 50%; perspective: 100vmin }
.cube { transform: rotateX(0deg) rotateZ(45deg) rotateY(-45deg); animation-name: cubeRotateX; animation-duration: 1ms; animation-timeline: scroll() }
to { transform: rotateX(360deg) }
to { transform: rotateY(360deg) }
.side { position: absolute; top: calc(var(--size) * -.5) }
.top { transform: rotateX(90deg) translateZ(calc(var(--size) * .5)) }
.bottom { transform: rotateX(90deg) translateZ(calc(var(--size) * -.5)) }
.left { transform: rotateY(90deg) translateZ(calc(var(--size) * .5)) }
.right { transform: rotateY(90deg) translateZ(calc(var(--size) * -.5)) }
```

### [Blog UI with Tailwind CSS](https://codepen.io/HaGer-HaMed-the-sasster/pen/bNExdQm)

made with: nothing recognised — read the code

### [Sign Up Modal](https://codepen.io/larirabello/pen/eojQww)

held: fixed div.modal | on hover of button.btn: button.btn: background | made with: :hover

```css
body { margin-top: 200px }
.modal-content { -webkit-box-shadow: -1px -2px 42px -19px rgba(0,0,0,0.74); -moz-box-shadow: -1px -2px 42px -19px rgba(0,0,0,0.74); box-shadow: -1px -2px 42px -19px rgba(0,0,0,0.74) }
.modal-content h1 { text-transform: uppercase }
.column#main { margin-top: 30px }
.btn { text-transform: uppercase }
.btn-primary { filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f1da36', endColorstr='#fca86c',GradientType=1 ) }
.modal-body label { margin-bottom: 0 }
.sec-content { margin-top: 85% }
```

### [Animated UI text input](https://codepen.io/shehab-eltawel/pen/MyxxMB)

made with: @keyframes · transition

```css
.search-form { position: relative }
.search-form:before { position: absolute; top: 14px; transform: scale(0); transition: all 0.5s cubic-bezier(.87, -.41, .19, 1.44) }
.active:before { transform: scale(1); -webkit-animation: 0.6s cubic-bezier(.87, -.41, .19, 1.44) 0.5s infinite forwards focus; animation: 0.6s cubic-bezier(.87, -.41, .19, 1.44) 0.5s infinite forwards focus }
input { position: absolute; transition: all 0.5s cubic-bezier(.87, -.41, .19, 1.44) }
button { position: absolute; transition: all 0.5s cubic-bezier(.87, -.41, .19, 1.44) }
button:after { position: absolute; transform: translateY(-50%) }
button:before { position: absolute; top: 20px; transform: scale(0); transform-origin: left top; transition: all 0.8s ease }
.active button { transform: translateX(260px) }
.active button:before { transform: scale(1) }
.focus:before { transform: scale(0); -webkit-animation: none; animation: none }
0 { opacity: 0 }
50% { opacity: 1 }
```

### [Realistic Red Switch (Pure CSS)](https://codepen.io/ykadosh/pen/ExNOmZx)

on scroll: div.light: opacity | made with: @keyframes · transition · 3D (perspective / preserve-3d)

```css
.switch { box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.2), 0 0 1px 2px black, inset 0 2px 2px -2px white, inset 0 0 2px 15px #47434c, inset 0 0 2px 22px black; perspective: 700px }
.switch input:checked + .button { transform: translateZ(20px) rotateX(25deg); box-shadow: 0 -10px 20px #ff1818 }
.switch input:checked + .button .light { animation: flicker 0.2s infinite 0.3s }
.switch input:checked + .button .shine { opacity: 1 }
.switch input:checked + .button .shadow { opacity: 0 }
.switch .button { transition: all 0.3s cubic-bezier(1, 0, 1, 1); transform: translateZ(20px) rotateX(-25deg); position: relative }
.switch .button::before { transform-origin: top; transform: rotateX(-90deg); position: absolute; top: 0 }
.switch .button::after { transform-origin: top; transform: translateY(50px) rotateX(-90deg); position: absolute; bottom: 0; box-shadow: 0 50px 8px 0px black, 0 80px 20px 0px rgba(0, 0, 0, 0.5) }
.switch .light { opacity: 0; animation: light-off 1s; position: absolute }
.switch .dots { position: absolute }
.switch .characters { position: absolute }
.switch .shine { transition: all 0.3s cubic-bezier(1, 0, 1, 1); opacity: 0.3; position: absolute }
```

### [Product Cards](https://codepen.io/tak-dcxi/pen/PwzzXJe)

held: fixed svg.[object | made with: position: fixed · :hover · :focus-visible · :has() · prefers-reduced-motion · clip-path · mask

```css
media (prefers-reduced-motion: no-preference) { transition-property: clip-path }
:nth-child(1 of &) { filter: brightness(0.8) grayscale(1) }
media (any-hover) { clip-path: var(--_has-hocus-on, inset(0 round var(--_inner-radius))) var(--_has-hocus-off, inset(100% round var(--_inner-radius))) }
&::before, &::after { position: absolute; mask-image: radial-gradient( circle at 100% 100%, transparent var(--_category-radius), red calc(var(--_category-radius) + 1px) ) }
&::before { mask-image: var(--icon-cart); mask-repeat: no-repeat; mask-position: center; mask-size: contain }
:root { background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px }
media (prefers-reduced-motion: no-preference) { transition-property: inset }
```

### [Scroll Driven Gradient Reveal Text Chrome 115+](https://codepen.io/jh3y/pen/ExGXLBb)

held: fixed label, fixed input, fixed h1, fixed section | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @keyframes · transition · :hover · :focus-visible

```css
label { position: fixed; top: 1rem }
[type=checkbox] { position: fixed; top: 1.125rem }
section { position: fixed; top: 0; translate: -50% 0 }
:is(p:nth-of-type(2), a) { opacity: 0; -webkit-animation: fade-in both linear; animation: fade-in both linear; animation-timeline: scroll(root); animation-range: 75vh 90vh }
p:nth-of-type(2) { --opacity: 0.65 }
a:is(:hover, :focus-visible) { text-underline-offset: 0.5ch }
to { opacity: var(--opacity, 1) }
to { opacity: var(--opacity, 1) }
h1 { position: fixed; bottom: 1rem }
p:nth-of-type(1) { background-position: 50% 0; opacity: 0; -webkit-animation: move-bg both linear, fade-in both linear; animation: move-bg both linear, fade-in both linear; animation-timeline: scroll(root); animation-range: 0 100vh, 40vh 1 }
to { background-position: 50% 100% }
to { background-position: 50% 100% }
```

### [3D card hover effect](https://codepen.io/markmiro/pen/wbqMPa)

on scroll: div.card: transform+top | on hover of div.card: div.card: transform+top | made with: :hover · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
body { perspective: 1500px }
.card { box-shadow: 0 1px 5px #00000099; position: relative; transition-property: transform, box-shadow; transform: rotate3d(0) }
.card:hover { box-shadow: 0 5px 20px 5px #00000044 }
.card .glow { position: absolute; top: 0 }
```

```js
addEventListener('mouseenter', () => {
addEventListener('mousemove', rotateToMouse)
addEventListener('mouseleave', () => {
```

### [Bootstrap Accordion With Open Close Arrows](https://codepen.io/kbsnr02/pen/LYNMyzP)

made with: transition

```css
.accordion .item { margin-bottom: 50px }
.accordion .item .item-header { border-bottom: none }
button.btn.btn-link.collapsed i { transform: rotate(0deg) }
button.btn.btn-link i { transform: rotate(180deg); transition: 0.5s }
```

### [Pixel Progress Bar](https://codepen.io/rubenasanchez/pen/eYzOqNG)

made with: @keyframes

```css
.text { margin-bottom: 10vw }
.text p { margin-top: 5vw }
.block-meter:nth-of-type(13) { opacity: 0; animation: blinky1 2s linear forwards }
.block-meter:nth-of-type(14) { opacity: 0; animation: blinky1 2s 4s linear forwards }
.block-meter:nth-of-type(15) { opacity: 0; animation: blinky1 2s 8s linear forwards }
.block-meter:nth-of-type(16) { opacity: 0; animation: blinky2 3s 14s linear infinite }
99% { opacity: 0 }
100% { opacity: 1 }
49% { opacity: 0 }
50% { opacity: 1 }
90% { opacity: 1 }
@keyframes blinky1 animates opacity
```

### [Rollback Toggle](https://codepen.io/jkantner/pen/vYPRvgr)

made with: @keyframes · clip-path · mask

```css
.switch { position: relative }
.switch__ball, .switch__ball:before, .switch__ball-shadow, .switch__ball-shadow: { position: absolute; top: 0 }
.switch__ball { top: 0.0625em }
.switch__ball:before { box-shadow: 0.125em -0.0625em 0.125em hsla(var(--hue), 90%, 70%, 0.5) inset, 0.25em -0.125em 0.25em hsla(var(--hue), 90%, 10%, 0.5) inset, -0.0625em 0.0625em 0.0625em rgba(255, 255, 255, 0.7) inset }
.switch__ball-shadow { top: 0.0625em }
.switch__ball-shadow:before { transform: rotate(-15deg) scale(1.15, 1) }
.switch__ball-shadow-outer { box-shadow: 0 0 0.25em hsl(var(--hue), 90%, 30%); top: 0.3125em }
.switch, .switch__input { position: relative }
.switch__input { box-shadow: -0.125em 0.25em 0.25em hsl(var(--hue), 90%, 63%) inset, -0.125em -0.125em 0.25em hsl(var(--hue), 90%, 68%) inset, 0 -0.0625em 0.125em hsl(var(--hue), 90%, 60%), 0 0 0.25em hsl(var(--hue), 90%, 78%) }
.switch__input:before, .switch__input:after { position: absolute }
.switch__input:before { box-shadow: 0.0625em 0.0625em 0.0625em hsla(var(--hue), 90%, 40%, 0.5) inset; -webkit-mask: linear-gradient(-45deg, rgba(0, 0, 0, 0) 50%, black) }
.switch__input:after { box-shadow: -0.0625em 0.0625em 0.0625em hsl(var(--hue), 90%, 70%) inset; clip-path: polygon(16% 0, 100% 0, 100% 100%, 65% 100%); -webkit-mask: linear-gradient(90deg, rgba(0, 0, 0, 0) 20%, black); opacity: 0 }
```

### [SHD Loader](https://codepen.io/Feelics/pen/KwpbRyW)

on scroll: circle.[object: transform+top ×2, div.wobbling-element: transform+top | made with: @keyframes

```css
#percentageCounter { position: absolute; transform: translate(-50%, -50%); top: 50% }
.center_inner_circle_second { animation: centerInnerCircleSecond 20s linear infinite; animation-timing-function: steps(4, end) }
.center_inner_circle_0 { animation: centerInnerCircle0 40s linear infinite }
.wobbling-element { animation: wobble 4s ease-in-out infinite; will-change: transform }
0% { transform: rotate(0deg) }
25% { transform: rotate(90deg) }
50% { transform: rotate(180deg) }
75% { transform: rotate(270deg) }
100% { transform: rotate(360deg) }
from { transform: rotate(0deg) }
to { transform: rotate(360deg) }
0% { transform: translate(0px, 0px) }
```

### [Particle Button](https://codepen.io/Souleste/pen/wvvjZvx)

made with: transition · :hover

```css
.shape { position: absolute; transform: scale(0.8) }
.cir { position: absolute }
.btn-contain { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.btn { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: 0.2s; box-shadow: 0px 1px 5px 2px #BFCEEF }
.btn-particles { position: absolute }
.btn:active { transform: scale(0.9) translate(-55%, -55%) }
```

### [3D Off-canvas navigation](https://codepen.io/iamarend/pen/yOwqdq)

held: fixed header, fixed nav.nav-wrapper | on hover of button.nav-button: span.lines: background | made with: position: fixed · transition · :hover · 3D (perspective / preserve-3d)

```css
header { position: fixed; top: 0; transition: transform 0.6s }
main { padding-top: 80px; transition: transform 0.6s 50ms }
.nav-button { text-transform: uppercase }
.nav-wrapper { box-shadow: -1px 0px 3px 0px rgba(0, 0, 0, 0.75); padding-top: 80px; perspective: 1000px; position: fixed; top: 0; transform: translateX(100%); transition: transform 0.6s, visibility 0.6s }
.nav-visible .nav-wrapper { transform: translateX(0) }
.nav { position: relative; transform: rotateY(90deg); transition: transform 0.6s }
.nav-visible .nav { transform: rotateY(0deg) }
.nav a { text-transform: uppercase }
.nav-marker { position: absolute; top: 80px }
.nav-marker:before { position: absolute; top: 50%; transform: translateY(-50%) }
.lines { position: relative }
.lines:after, .lines:before { position: absolute }
```

### [3D Button](https://codepen.io/rauldronca/pen/Pzrgzp)

made with: transition

```css
.button::after, .button::before { position: absolute; transition: all 0.5s }
.button { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: all 0.5s }
.button::before { bottom: -15px; transform: skewX(45deg) }
.button::after { bottom: -8px; transform: skewY(45deg) }
.button:active { margin-top: 10px }
.button:active::before { bottom: -5px }
.button:active::after { bottom: -3px }
```

### [Loading Animation w/ Translate and Z-index](https://codepen.io/tystrong/pen/eYNVWLM)

on scroll: div.circle: transform ×2 | made with: @keyframes

```css
.container .circle { box-shadow: inset 0 0 0 5px rgba(255, 255, 255, 0.3); transform: translateX(0) }
.container .circle:nth-child(1) { animation: move-1 2s infinite }
.container .circle:nth-child(3) { animation: move-3 2s infinite }
0% { transform: translateX(0) }
25% { transform: translateX(80px) }
50% { transform: translateX(0) }
50.1% { transform: translateX(0) }
75% { transform: translateX(80px) }
100% { transform: translateX(0) }
0% { transform: translateX(0) }
25% { transform: translateX(-80px) }
50% { transform: translateX(0) }
```

### [CSS Framer University Button with animated grid tracks ✨](https://codepen.io/jh3y/pen/LYJNvyE)

on scroll: svg.[object: opacity | made with: position: fixed · transition · :hover · :focus-visible

```css
:root { --transition: 0.28s }
button { position: relative; transition: border-color var(--transition) }
button > span { transition: grid-template-columns var(--transition); transition: grid-template-columns var(--transition), -ms-grid-columns var(--transition) }
button:after { position: absolute; inset: calc(var(--font-size) * -0.025); filter: blur(calc(var(--font-size) * 0.75)); scale: var(--hovered, 0); transition: scale var(--transition) }
img { position: fixed; top: 50%; translate: -50% -50%; opacity: 0.6; scale: 1.3 }
svg { transition: translate var(--transition) ease-in-out, opacity var(--transition) ease-in-out }
span span:nth-of-type(3) svg { translate: calc((1 - var(--hovered, 0)) * (var(--font-size) * 3)) 8%; opacity: var(--hovered, 0) }
span span:nth-of-type(1) svg { translate: calc(((var(--hovered, 0) * var(--font-size)) * -3) + 10%) 8% }
```

### [Window Shade Navigation](https://codepen.io/Coderesting/pen/YzPJBGR)

held: fixed div | on scroll: div.: transform+top | on hover of a.: div.: transform | made with: position: fixed · custom properties driven by JS · pointer / mouse tracking · requestAnimationFrame

```css
#nav { position: fixed; transform: translateY(-70vh) }
#nav > #content { box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22) }
```

```js
addEventListener('mousemove', this.move.bind(this))
requestAnimationFrame(this.render.bind(this))
style.setProperty('--color', page)
```

### [Pure CSS Dropdown Menu (No JavaScript)](https://codepen.io/garetmckinley/pen/XvgzKQ)

made with: position: fixed · :hover

```css
a.button:active { filter: brightness(75%) }
.dropdown { position: relative }
.dropdown ul { position: absolute }
.dropdown ul::before { position: absolute; top: -10px }
.dropdown[open] > summary::before { position: fixed; top: 0; bottom: 0 }
```

### [Mobile Carousel Animation With React (Ice Cream Generator)](https://codepen.io/yousefsami/pen/dybXVqb)

made with: view() timeline · @keyframes · transition

```css
[class*=" icon-"]:before, [class^=icon-]:before { text-transform: none }
#root { position: absolute; top: 0; bottom: 0 }
#mobile { position: relative }
#mobile:after { top: 80px; position: absolute }
#mobile:before { top: 190px; position: absolute }
#page-container { position: relative; padding-bottom: 20px }
#page-container .page-container-transformer { position: relative; transition: all 0.4s }
#page-container .page-container-transformer.active { margin-top: 20px; opacity: 0 }
#mobile-container { position: absolute; top: 0; bottom: 0 }
#action-bar { position: absolute; bottom: 0; filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#001e5799", endColorstr="#ffffff",GradientType=0 ) }
#action-bar:before { position: absolute; top: 0; transform: translatey(-76%); box-shadow: 0px -14px 20px 3px inset rgba(94, 160, 247, 0.19) }
#action-bar .home-botton { position: relative; top: -32px; box-shadow: 0 0 15px #5ea0f7 }
```

### [Yet another CSS loader #2](https://codepen.io/sfi0zy/pen/OJbQwYr)

held: fixed div.example | on scroll: div.item: opacity ×8 | made with: position: fixed · @keyframes

```css
.example { position: fixed; top: 50%; transform: translateX(-50%) translateY(-50%) }
.container { position: absolute; top: 0 }
.block { position: absolute; top: 0 }
.block > .item { position: absolute; -webkit-animation: move 0.5s linear infinite; animation: move 0.5s linear infinite }
.block > .item:nth-of-type(1) { top: -2rem; -webkit-animation-delay: 0s; animation-delay: 0s }
.block > .item:nth-of-type(2) { top: -2rem; -webkit-animation-delay: -0.0625s; animation-delay: -0.0625s }
.block > .item:nth-of-type(3) { top: -2rem; -webkit-animation-delay: -0.125s; animation-delay: -0.125s }
.block > .item:nth-of-type(4) { top: 0; -webkit-animation-delay: -0.1875s; animation-delay: -0.1875s }
.block > .item:nth-of-type(5) { top: 2rem; -webkit-animation-delay: -0.25s; animation-delay: -0.25s }
.block > .item:nth-of-type(6) { top: 2rem; -webkit-animation-delay: -0.3125s; animation-delay: -0.3125s }
.block > .item:nth-of-type(7) { top: 2rem; -webkit-animation-delay: -0.375s; animation-delay: -0.375s }
.block > .item:nth-of-type(8) { top: 0; -webkit-animation-delay: -0.4375s; animation-delay: -0.4375s }
```

### [Upload buttons](https://codepen.io/aaroniker/pen/yLyJYxx)

held: fixed a.dribbble, fixed a.twitter | made with: position: fixed · @keyframes · transition · mask · custom properties driven by JS · GSAP

```css
.button { -webkit-mask-image: -webkit-radial-gradient(white, black); box-shadow: 0 2px 8px -1px var(--shadow); transition: transform 0.2s ease, box-shadow 0.2s ease }
.button:active { transform: scale(0.95); box-shadow: 0 1px 4px -1px var(--shadow) }
.button ul { position: relative }
.button ul li:not(:first-child) { top: 16px; position: absolute }
.button ul li:nth-child(2) { top: 76px }
.button ul li:nth-child(3) { top: 136px }
.button > div { -webkit-mask-image: -webkit-radial-gradient(white, black); position: relative }
.button > div:before, .button > div:after { position: absolute }
.button > div:before { top: 50% }
.button > div:after { top: 0; transform: scaleY(0) }
.button > div svg { position: absolute; top: 50% }
.button.loading ul { -webkit-animation: text calc(var(--duration) * 1ms) linear forwards calc(var(--duration) * .065ms); animation: text calc(var(--duration) * 1ms) linear forwards calc(var(--duration) * .065ms) }
```

```js
style.setProperty('--duration', duration)
gsap.to(svgPath, {
```

### [Hover effect 2](https://codepen.io/anon/pen/abqoYgj)

made with: transition · :hover

```css
.hover-2 { transition: 0.3s }
```

### [Link Hover Arrow Idea](https://codepen.io/gabriellewee/pen/ddjYmY)

made with: transition · :hover

```css
a { position: relative }
a:before, a:after { will-change: transform; position: absolute }
a:before { transition: 100ms ease-out 50ms; top: 0 }
a:after { transition: 50ms ease-out; transform: scaleX(0); bottom: 2px }
a:hover:before { transition: 100ms ease-out; transform: scaleY(0.18) }
a:hover:after { transition: 50ms ease-out 100ms; transform: none }
a:active:before { transition: 100ms ease-in }
a:active:after { transition: 100ms ease-in }
```

### [Awww Scroll Snap matrix](https://codepen.io/argyleink/pen/MWWpOmz)

made with: scroll-snap

```css
.horizontal-snap { -ms-scroll-snap-type: both mandatory; scroll-snap-type: both mandatory; padding-bottom: 1rem }
.horizontal-snap > a { scroll-snap-align: center }
```

### [prettify `<input type=range>` #94 pure CSS](https://codepen.io/thebabydino/pen/YPRENB)

made with: nothing recognised — read the code

```css
body { transform: rotate(-90deg) }
input[type='range']::-webkit-slider-runnable-track { position: relative }
input[type='range']::-webkit-slider-thumb { margin-top: -0.75em; box-shadow: -.125em 0 .25em #928886, inset -1px 0 1px #fff }
input[type='range']::-moz-range-thumb { box-shadow: -.125em 0 .25em #928886, inset -1px 0 1px #fff }
input[type='range']::-ms-thumb { box-shadow: -.125em 0 .25em #928886, inset -1px 0 1px #fff }
input[type='range']::-webkit-slider-runnable-track:before, input[type='range']:: { position: absolute }
input[type='range']::-webkit-slider-runnable-track:before, input[type='range'] / { top: 50%; transform: translate(50%, -50%) rotate(90deg) translate(0, 32%) }
input[type='range']:nth-of-type(1)::-webkit-slider-runnable-track:after, input[t { bottom: 100%; transform: translate(-50%, 50%) rotate(90deg) translate(-4.375em) }
input[type='range']:nth-of-type(6)::-webkit-slider-runnable-track:after, input[t { top: 100%; transform: translate(-50%, -50%) rotate(90deg) translate(4.375em) }
```

### [Rings Navigation Concept](https://codepen.io/bennettfeely/pen/qRJOZJ)

held: fixed nav.top-right | made with: position: fixed · transition · :hover

```css
nav { position: fixed; transform: translate3d(25px, -25px, 0); transition: transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 0.9) }
nav.open { transform: translate3d(0, 0, 0) }
nav.top-right { top: -140px }
.disc { position: absolute; padding-top: 10px; transform: scale3d(0.5, 0.5, 0.5) rotate3d(0, 0, 1, 190deg); opacity: 0; transition: transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 0.9), opacity 0.5s }
.disc div { transform: rotate(180deg) }
.open .disc { opacity: 1 }
.l1 { top: 0px; bottom: 0px }
.open .l1 { transform: scale3d(1, 1, 1) rotate3d(0, 0, 1, 190deg); opacity: 1 }
.open .l1.toggle { transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, 10deg) }
.l2 { top: 50px; bottom: 50px }
.open .l2 { transform: scale3d(1, 1, 1) rotate3d(0, 0, 1, 190deg); opacity: 1 }
.open .l2.toggle { transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, 10deg) }
```

### [Curved Range Slider - CSS](https://codepen.io/josetxu/pen/oNQxxyZ)

made with: transition · :hover · clip-path · custom properties driven by JS

```css
*, *:before, *:after { transition: all 0s ease 0s }
body:before, body:after { position: absolute; opacity: 0.75; filter: blur(0.75px) }
.content { position: relative }
.content:before { position: absolute; top: calc(var(--sz) * -13); transform: rotate(8deg); clip-path: polygon(0 0, 100% 0, 100% 21%, 0 41%); clip-path: polygon(0 0, 100% 0, 99% 22%, 82% 28%, 20% 38%, 0 41%); filter: drop-shadow(5px 5px 2p }
.equalizer:before, .equalizer:after { position: absolute; top: calc(var(--sz) * 6.3); filter: drop-shadow(5px 5px 2px #0008) }
.equalizer:after { top: calc(var(--sz) * 4.05) }
input[type='range'] { position: absolute; --bs-thumb: 0 0 0px calc(var(--sz) * 0.5) #3a3d44 inset; transform: rotate(calc(var(--eqz) * 0.9deg)); filter: hue-rotate(calc(var(--eqz) * -2.25deg)) }
input[type=range]::-webkit-slider-thumb { margin-top: calc(var(--sz) * -1); box-shadow: var(--bs-thumb) }
input[type=range]::-moz-range-thumb { margin-top: calc(var(--sz) * -1); box-shadow: var(--bs-thumb) }
.number { position: absolute; bottom: calc(var(--sz) * 14); transform: rotate(-3deg) }
.number:before { position: absolute }
label[for=trick] { position: absolute; bottom: calc(var(--sz) * 10) }
```

### [Hover Interaction (98/100)](https://codepen.io/loficodes/pen/GgKwKKj)

made with: :hover · pointer / mouse tracking

```css
a { text-transform: uppercase }
```

```js
addEventListener("mousemove", (e) => {
```

### [Arrow icon animation](https://codepen.io/bennettfeely/pen/miwIa)

made with: transition · 3D (perspective / preserve-3d)

```css
.button { transition: 0.25s }
.button:active { transition: 0 }
.arrow { position: relative; transition: 0.5s }
.arrow:before { transform: rotate(-35deg) }
.arrow:after { transform: rotate(35deg) }
.arrow:before, .arrow:after { position: absolute; transition: 0.5s }
.switch.right .arrow:before { transform: rotate(140deg) }
.switch.right .arrow:after { transform: rotate(-140deg) }
.flip { transform: translateZ(1rem) perspective(600) }
.flip.right { transform: translateZ(1rem) perspective(600) rotateY(180deg) }
```

### [Bar Loader - CSS](https://codepen.io/josetxu/pen/LYrNQPd)

on scroll: div.bars: transform ×2 | made with: @keyframes · 3D (perspective / preserve-3d)

```css
.content { perspective: 1000vmin }
.bars { position: absolute; animation: mirror1 calc(var(--s) * 2) ease 0s infinite }
.bars + .bars { transform: rotate(90deg) rotateX(180deg); animation: mirror2 calc(var(--s) * 2) ease calc(var(--s) / 2) infinite }
.bar { animation: grow var(--s) ease-in-out 0s infinite alternate }
0%, 47%, 99.99%, 100% { transform: rotate(180deg) rotateX(0deg) }
47.01%, 99.98% { transform: rotate(180deg) rotateX(180deg) }
0%, 47%, 99.99%, 100% { transform: rotate(90deg) rotateX(180deg) }
47.01%, 99.98% { transform: rotate(90deg) rotateX(0deg) }
.bar:nth-child(2) { animation-delay: calc(var(--s) * -0.02) }
.bar:nth-child(3) { animation-delay: calc(var(--s) * -0.04) }
.bar:nth-child(4) { animation-delay: calc(var(--s) * -0.06) }
.bar:nth-child(5) { animation-delay: calc(var(--s) * -0.08) }
```

### [Header Nav Overflow Into Mobile Nav](https://codepen.io/CAWeissen/pen/wvvVKyo)

held: fixed div.MobileNav, fixed header.Header | made with: position: fixed · transition · :hover

```css
body { padding-top: 150px }
.Header { position: fixed; top: 0 }
.Header-inner { transition: height 0.4s ease }
.Header-nav-item { transition: font-size 0.4s ease, padding 0.4s ease }
.container .card { background-position: center; margin-bottom: 10% }
.MobileNav { position: fixed; top: 70px }
.MobileNav-inner { position: absolute; transform: translate(0, -105%); transition: transform 0.4s ease, visibility 0.4s ease }
.MobileNav-inner .MobileNav-trigger { position: absolute; top: 30px }
.MobileNav-item { transition: opacity 0.3s ease }
.MobileNav-item-title span { position: relative }
.MobileNav-item-title span::after { border-top: 2px solid lightgray; position: absolute; top: 50%; transform: translateY(-75%) rotate(225deg); transition: transform 0.2s ease }
.MobileNav-overlay { position: absolute; top: 0; transition: background 0.4s ease }
```

### [CSS blob checkbox](https://codepen.io/t_afif/pen/PoEebrz)

made with: transition · mix-blend-mode

```css
input { transition: .3s .1s }
input:before { mix-blend-mode: darken; filter: blur(calc(var(--s)/12)) contrast(11); transition: .4s, background-position .4s .1s, padding cubic-bezier(0,calc(var(--_i,-1)*200),1,calc(var(--_i,-1)*200)) .25s .1s }
```

### [3 Cubes in 3D (CSS only)](https://codepen.io/amit_sheen/pen/oNaNgJz)

held: fixed div.scriptIcons | on scroll: div.scene: transform, div.bottomCube: transform+top, div.midCube: transform+top, div.topCube: transform+top | on hover of button.scriptIcons-button: div.scene: transform, div.bottomCube: transform+top, div.midCube: transform+top, div.topCube: transform+top | made with: @keyframes · clip-path · 3D (perspective / preserve-3d)

```css
body { perspective: 75em }
.scene { position: relative; -webkit-animation: sceneRotate 78s infinite linear; animation: sceneRotate 78s infinite linear }
from { transform: rotateX(-15deg) rotateY(0deg) }
to { transform: rotateX(-15deg) rotateY(360deg) }
from { transform: rotateX(-15deg) rotateY(0deg) }
to { transform: rotateX(-15deg) rotateY(360deg) }
.floor { position: absolute; inset: -50em; transform: rotateX(90deg) translateZ(calc(-6.4em - 1px)) }
.floor::before { position: absolute; top: 50%; box-shadow: 0 0 2em #0007; transform: translate(-50%, -50%) }
.stage { position: absolute; top: 50%; transform: translate3d(-50%, -50%, 1.4em); box-shadow: 0 0 1em #0007 inset }
.stage > div { position: absolute; top: 50%; box-shadow: inherit; -webkit-clip-path: polygon(1.5em 0, 13.5em 0, 100% 100%, 0 100%); clip-path: polygon(1.5em 0, 13.5em 0, 100% 100%, 0 100%); transform-origin: top; transform: rotateZ(var }
.stage::after { position: absolute; top: 50%; filter: blur(0.5em); -webkit-animation: shadow 6s infinite ease-in-out; animation: shadow 6s infinite ease-in-out }
0%, 95%, 100% { transform: translate(-0.5em, -0.5em) }
```

### [Cursor Line Wobble](https://codepen.io/GreenSock/pen/ZYWqWeb)

made with: GSAP · pointer / mouse tracking

```js
addEventListener("pointermove", (e) => {
gsap.to(p1, {
```

### [Gradient Stroke & Bounce 🏀](https://codepen.io/jkantner/pen/abwgLNX)

made with: @keyframes

```css
.pl__ring, .pl__ball { animation: ring 2s ease-out infinite }
.pl__ball { animation-name: ball }
from, 50% { animation-timing-function: ease-in }
64% { animation-timing-function: ease-in }
78% { animation-timing-function: ease-in }
92% { animation-timing-function: ease-in }
57%, 71%, 85%, 99%, to { animation-timing-function: ease-out }
@keyframes ring animates stroke-dasharray
@keyframes ball animates animation-timing-function, stroke-dashoffset
```

### [Segmented Progress Bar](https://codepen.io/jkantner/pen/poPWVbV)

on hover of button.: button.: background | made with: transition · :hover

```css
button { position: relative; transform: translateX(-50%); transition: background 0.15s linear }
.sp { margin-bottom: 1.5em }
.sp__hub--done, .sp__dot--done { transition: r 0.2s cubic-bezier(0,0,0.33,1.67) }
.sp__hub--done ~ .sp__bar-fill { transition: all calc(1s * var(--incTrans)) linear }
.sp__hub-fill--done { transition: all 0.2s 0.2s ease-out }
.status { margin-bottom: 4.5em }
```

### [Animated Menu Icon](https://codepen.io/AskeK/pen/xxbjjzm)

on scroll: div.topleft: transform+top, div.topright: transform+top, div.bottomright: transform+top, div.bottomleft: transform+top | made with: @keyframes

```css
#hamburger { position: absolute; top: 50%; transform: translate(-50%, -50%) }
#hamburger > * { position: absolute; top: 50%; transform: translate(-50%, -50%); animation: anim 1000ms cubic-bezier(0.9, 0, 0.1, 1) infinite }
#hamburger .topleft { top: calc(50% - 12px); transform: translate(-50%, -50%) rotate(45deg) }
#hamburger .topright { top: calc(50% - 12px); transform: translate(-50%, -50%) rotate(45deg) }
#hamburger .bottomright { top: calc(50% + 12px); transform: translate(-50%, -50%) rotate(-45deg) }
#hamburger .bottomleft { top: calc(50% + 12px); transform: translate(-50%, -50%) rotate(-45deg) }
25% { top: 50%; bottom: auto }
50% { top: 50%; bottom: auto }
@keyframes anim animates top, left, bottom, right, height, width
```

### [Lo-fi Tailwind CSS Dropdown - Icon Button](https://codepen.io/robstinson/pen/jOqvwmq)

held: fixed a.fixed | made with: nothing recognised — read the code

### [Bootstrap Profile Cards 2019](https://codepen.io/mrsahar/pen/jRjmdL)

on hover of div.profile-card-2: img.img: filter | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
header { position:relative; top:0; margin-bottom:30px }
header .logo { padding-bottom:10px }
header h1 { text-transform:uppercase; padding-bottom:25px }
.card-container { -webkit-perspective: 1000; perspective: 1000 }
.profile-card-1 { box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.1); background-position: center; padding-top: 100px; position: relative }
.profile-card-1 .profile-content { position: relative }
.profile-card-1 .profile-img { position: absolute; top: -50px; transition: all 0.25s linear }
.profile-card-1 .profile-img img { box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2) }
.profile-card-1:hover { box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.1) }
.profile-card-1:hover .profile-img { transform: rotateY(180deg) }
.profile-card-2 { box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.1); background-position: center; position: relative }
.profile-card-2 img { transition: all linear 0.25s }
```

### [Humane inspired CSS scroll-driven animation landing page](https://codepen.io/jh3y/pen/MWLPMYL)

held: fixed nav, fixed div.fixed, fixed div.fixed, sticky div.text-wrap, fixed div.fixed, fixed div.fixed, sticky div.chat-container, fixed div.fixed | made with: position: sticky · position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · scroll-snap · @keyframes · transition · :hover · :focus-visible · prefers-reduced-motion · clip-path · mask · GSAP · ScrollTrigger

```css
html { -ms-scroll-snap-type: y mandatory; scroll-snap-type: y mandatory }
section:nth-of-type(1) { scroll-snap-align: center }
section:nth-of-type(2) { scroll-snap-align: start }
:is(section, article) { position: relative }
nav { position: fixed; top: 0 }
a:last-of-type { transition: background 0.2s }
.content { position: absolute; inset: 0 }
.fixed img { position: absolute; inset: 0; translate: -50% 0; filter: brightness(0.5) }
section:first-of-type img { translate: -50% 0 }
section:nth-of-type(2) article:first-of-type .fixed::after { position: absolute; inset: 0 }
section:nth-of-type(2) article:nth-of-type(3) img { filter: saturate(0.5) brightness(0.5) }
.chat-container { position: sticky; top: 0 }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to('section:first-of-type .fixed', {
scrollTrigger: { scrub: 0.5, trigger: 'section:first-of-type', start: 'top top', end: 'bottom 50%' }
scrollTrigger: { scrub: 0.5, trigger: 'section:first-of-type', start: 'top top', end: 'bottom 75%' }
gsap.to('section:nth-of-type(2) article:first-of-type .fixed', {
scrollTrigger: { scrub: 0.5, trigger: 'section:nth-of-type(2) article:first-of-type', start: 'top bottom', end: 'top top' }
gsap.from('section:nth-of-type(2) article:first-of-type img', {
gsap.from('section:nth-of-type(2) article:first-of-type h2', {
```

### [Tooltip only CSS](https://codepen.io/okawa-h/pen/OJLOarZ)

on scroll: span.: transform+opacity+top | made with: transition · :hover

```css
button { position: relative }
button:hover span { opacity: 1; transform: translate(-50%, 0) }
button span { position: absolute; bottom: 100%; opacity: 0; margin-bottom: 1em; transform: translate(-50%, 1em); transition: all 0.15s ease-in-out }
button span::before { position: absolute; top: 100%; transform: translate(-50%, 0) }
```

### [CSS Dialog Animations (Opening only with @starting-style)](https://codepen.io/anon/pen/GRaZxNx)

made with: @starting-style · transition · <dialog>

```css
@starting-style { opacity: 0 }
```

### [Scroll-snap-type "Mandatory" vs "Proximity"](https://codepen.io/anon/pen/ZjrOpx)

held: fixed h2, fixed h2 | made with: position: fixed · scroll-snap

```css
h2 { position: fixed; top: 1em }
.container { -ms-scroll-snap-type: y mandatory; scroll-snap-type: y mandatory }
.container.proximity { -ms-scroll-snap-type: y proximity; scroll-snap-type: y proximity }
li { border-bottom: 1px solid white; scroll-snap-align: start }
```

### [Pagination](https://codepen.io/robertcooper_rc/pen/XeabLa)

made with: :hover

### [Responsive Hover - Activated Mega Menu 🏀](https://codepen.io/bato-web-agency/pen/OPJQppX)

held: fixed div.preview, fixed aside.contact-menu | made with: transition · :hover · (hover: hover) gate · clip-path

```css
:root { --transition: 0.4s }
.base-template__wrapper { padding-bottom: 450px }
.header { position: relative }
.header__list-item { margin-bottom: -20px }
.header__list-item > a { transition: var(--transition) }
.header__list-item > a svg path { transition: var(--transition) }
.header__list-item .submenu-wrapper { position: absolute; top: 110%; opacity: 0; transition: var(--transition) }
.header__button { transition: var(--transition) }
.submenu-list__title { margin-bottom: 25px; text-transform: uppercase }
.submenu-list__item-wrapper { transition: var(--transition) }
.submenu-list__item-wrapper > svg { opacity: 0; transition: var(--transition) }
.submenu-list__wrapper { position: relative }
```

```js
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
```

### [Path Slider Basic Demo](https://codepen.io/lmgonzalves/pen/dmbmpQ)

on hover of a.path-slider__item: div.item__circle: background | made with: transition · :hover

```css
.path-slider { position: relative; top: 50%; transform: translateY(-40%) }
.path-slider__item { position: absolute; top: -37px }
.item__circle { box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5); transition: 0.5s }
.item__title { position: absolute; bottom: 100%; transform: translateX(-50%); opacity: 0.8; transition: 0.5s }
.item__icon { position: relative; top: 50%; transform: translateY(-50%) }
.path-slider__current-item .item__circle { transform: scale(1.5) }
.path-slider__current-item .item__title { opacity: 1; transform: translate(-50%, -20px) }
```

### [Frames](https://codepen.io/anon/pen/eYRqgLN)

made with: mask

```css
.frame { position:relative; -webkit-mask:paint(rounded-shape) }
.frame:before { position:absolute; inset:0; -webkit-mask:paint(rounded-shape) }
```

### [✅ Scroll-Linked Animations: Fly-In Contact List (Fly-In + Fly-Out) (WAAPI + ScrollTimeline 2022 Version)](https://codepen.io/bramus/pen/dymVrJR)

held: fixed dialog.sda_update | made with: scroll() timeline · :hover · Web Animations API (.animate)

```css
main { position: relative }
main::before { position: absolute; transform: translateY(calc(-100% - 0.2em)) }
li { border-bottom: 1px solid #ddd }
```

```js
.animate( {
```

### [RGB Dot Preloader](https://codepen.io/jkantner/pen/xbKYrxv)

on scroll: div.pl__dot-layer: transform+top ×17, div.pl: transform+top, div.pl__dot-layer: transform | made with: @keyframes · mix-blend-mode

```css
.pl { animation-name: spin; animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1); position: relative }
.pl, .pl__dot-layer { animation-duration: var(--dur); animation-iteration-count: infinite }
.pl__dot { top: calc(50% - 0.875em) }
.pl__dot, .pl__dot-layer { position: absolute }
.pl__dot-layer { animation-name: scale-down-1; animation-timing-function: cubic-bezier(0.85, 0, 0.15, 1); mix-blend-mode: screen }
.pl__dot-layer:nth-child(2) { animation-name: scale-down-2; transform: translate(0, 20%) scale(0.85) }
.pl__dot-layer:nth-child(3) { animation-name: scale-down-3; transform: translate(0, 40%) scale(0.7) }
.pl__dot:nth-child(even) { top: calc(50% - 1.125em) }
.pl__dot:nth-child(even) .pl__dot-layer { animation-name: scale-up-1; transform: translate(0, 0) scale(0.33) }
.pl__dot:nth-child(even) .pl__dot-layer:nth-child(2) { animation-name: scale-up-2; transform: translate(0, 15%) scale(0.3) }
.pl__dot:nth-child(even) .pl__dot-layer:nth-child(3) { animation-name: scale-up-3; transform: translate(0, 30%) scale(0.27) }
.pl__dot:nth-child(1) { transform: rotate(0deg) translate(0, -4em) }
```

### [CSS Nav Animation.](https://codepen.io/oluwadareseyi/pen/NWPwEYg)

made with: @keyframes · transition · :hover

```css
.item { position: relative; box-shadow: 4px 8px 16px 0 rgba(0, 0, 0, 0.3) }
.item .menu-active { transform: translateX(-60px) }
.item .card-active { transform: translateX(130px) }
.item .menu-con { position: absolute; transition: all 0.3s ease-in-out; box-shadow: 4px 8px 12px 0 rgba(0, 0, 0, 0.3) }
.item .menu-con .menu-item { transition: color 0.3s ease-in-out }
.item .card-con { transition: all 0.3s ease-in-out; box-shadow: 4px 8px 12px 0 rgba(0, 0, 0, 0.3) }
.item .card-con .header { position: relative }
.item .card-con .card-body { position: relative }
.item .card-con .card-body .line { position: absolute }
.item .card-con .card-body .news { position: relative; opacity: 1 }
.item .card-con .card-body .news .circle { box-shadow: 0 0 0 4px white }
.item .card-con .card-body .news .text-con { margin-top: -15px }
```

### [Animated Accessible Navigation](https://codepen.io/mxbck/pen/xdaGNL)

made with: transition · :hover

```css
.nav__toggle { position: absolute; top: 15px; transition: background-color 0.15s linear }
.nav__menu { position: relative }
.nav__item { opacity: 0; transition: all 0.3s cubic-bezier(0, 0.995, 0.99, 1) 0.3s }
.nav__item:nth-child(1) { transform: translateY(-40px) }
.nav__item:nth-child(2) { transform: translateY(-80px) }
.nav__item:nth-child(3) { transform: translateY(-120px) }
.nav__item:nth-child(4) { transform: translateY(-160px) }
.nav__item:nth-child(5) { transform: translateY(-200px) }
.nav__link { text-transform: uppercase }
.menuicon { transform: rotate(0deg); transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) }
.menuicon__bar { transform: rotate(0deg); transition: transform 0.25s ease-in-out }
.menuicon__circle { transition: stroke-dashoffset 0.3s linear 0.1s }
```

### [Progress. Happy New Year 2020 🎉](https://codepen.io/nitnelav/pen/povrOME)

made with: transition · custom properties driven by JS

```css
#container { position: absolute; top: 0; bottom: 0 }
#settings { position: absolute; top: 1vh; transition: right 0.2s }
#abt { position: absolute; top: -40vh; transition: all 0.5s cubic-bezier(0.87, -0.2, 0.19, 1.2) }
#txt { position: absolute; top: 42vh }
#dm { position: absolute; top: 42vh }
#barcontainer { position: absolute; top: 18vh }
#title { margin-bottom: 7vh }
#yp, #mp, #dp, #hp, #mip { margin-bottom: 1vh }
#ygraph, #mgraph, #dgraph, #hgraph, #migraph { margin-bottom: 5vh }
#ybar, #mbar, #dbar, #hbar, #mibar { transition: width 0.5s }
```

```js
style.setProperty("--bright", "#000")
style.setProperty("--dark", "#fff")
style.setProperty("--bright", "#fff")
style.setProperty("--dark", "#000")
```

### [Hover effect 1](https://codepen.io/anon/pen/qBxWqwX)

made with: transition · :hover

```css
.hover-1 { transition: .3s }
```

### [Badge](https://codepen.io/simonwuyts/pen/ZdYRpB)

on scroll: div.badge__label: transform+top | made with: @keyframes · 3D (perspective / preserve-3d)

```css
0% { opacity: 0 }
100% { opacity: 1 }
0% { opacity: 0 }
100% { opacity: 1 }
0% { transform: scale(1) }
50% { transform: scale(1.05) }
100% { transform: scale(1) }
0% { transform: scale(1) }
50% { transform: scale(1.05) }
100% { transform: scale(1) }
0% { transform: scale(1) }
50% { transform: scale(1.1) }
```

### [3D Slider Cards](https://codepen.io/Nidal95/pen/ogbzgge)

held: fixed button.close-btn, fixed div.card-info | on scroll: div.hover-overlay: opacity+top | made with: position: fixed · transition · :hover · 3D (perspective / preserve-3d) · GSAP · pointer / mouse tracking

```css
.header { margin-bottom: 60px }
.subtitle { text-transform: uppercase; margin-bottom: 16px }
.slider-container { perspective: 1500px }
.card { position: relative }
.card::before { position: absolute; top: 0; transform: translateZ(-8px) }
.card::after { position: absolute; top: 0; transform: translateZ(-16px); box-shadow: 0 0 40px rgba(0, 0, 0, 0.3) }
.card img { position: relative }
.card .hover-overlay { position: absolute; top: 0; opacity: 0; transition: opacity 0.3s ease }
.card:hover .hover-overlay { opacity: 1 }
.card .hover-overlay span { text-transform: uppercase }
.slider-track.blurred .card:not(.expanded) { filter: blur(8px); transition: filter 0.6s ease }
.card-info { position: fixed; bottom: 80px; transform: translateX(-50%); opacity: 0; transition: opacity 0.6s ease; box-shadow: 4px 3px 18px 4px #b7b7b721 }
```

```js
gsap.to(clone, {
gsap.to(card, {
addEventListener("mousemove", (e) => this.handleDragMove(e))
```

### [Neon Button Animation UI](https://codepen.io/nuhmanpk/pen/XWqBrae)

on hover of button.: button.: background+color+shadow+top, span.: color, i.: color+top | made with: @keyframes · transition · :hover

```css
button { position: relative; text-transform: uppercase; transition: 0.2s }
button:hover { animation: box 3s infinite }
button::before { position: absolute; inset: 2px }
button span { position: relative }
button i { position: absolute; inset: 0 }
button i::before { position: absolute; top: -2px; transition: 0.2s }
button:hover i::before { animation: move 3s infinite }
button i::after { position: absolute; bottom: -2px; transition: 0.2s }
button:hover i::after { animation: move 3s infinite }
0% { transform: translateX(0) }
50% { transform: translateX(5px) }
100% { transform: translateX(0) }
```

### [hover expand icon into a button](https://codepen.io/pugson/pen/mdMrgvg)

on hover of img.: div.studio-button-label: transform+opacity | made with: transition · :hover

```css
.box { position: relative }
.box-title { padding-top: 16px }
.studio-button { position: absolute; bottom: 16px; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25); transition: 0.35s ease all }
.studio-button-icon { position: relative; top: 1px }
.studio-button-label { text-transform: uppercase; opacity: 0; transform: translateX(10px); transition: 0.25s ease all }
.box:hover .studio-button-label { opacity: 1; transform: translateX(0); transition: 0.25s 0.1s ease-in opacity, 0.15s 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275) transform }
```

### [CSS Menu Icon Animation](https://codepen.io/istef/pen/QPLdWP)

made with: transition · :hover

```css
h1 small { text-transform: none }
.line, .box { transition: all 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275) }
.menu__wrapper > span { margin-top: auto }
.menu__item--hamburger:hover .line:nth-child(1), .menu__item--hamburger:focus .l { transform: rotate(45deg) translate(12px, 12px) }
.menu__item--hamburger:hover .line:nth-child(3), .menu__item--hamburger:focus .l { transform: rotate(-45deg) translate(15px, -16px) }
.menu__item--doner:hover .line:nth-child(1), .menu__item--doner:focus .line:nth- { transform: rotate(45deg) translate(12px, 12px) }
.menu__item--doner:hover .line:nth-child(2), .menu__item--doner:focus .line:nth- { transform: rotate(-45deg) translate(-12px, -1.5px) }
.menu__item--doner:hover .line:nth-child(3), .menu__item--doner:focus .line:nth- { transform: rotate(-45deg) translate(25px, -14px) }
.menu__item--bento:hover .box:nth-child(2), .menu__item--bento:hover .box:nth-ch { opacity: 0 }
.menu__item--kebab { position: relative; transition: all 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275) }
.menu__item--kebab .circle:nth-child(4), .menu__item--kebab .circle:nth-child(5) { position: absolute; opacity: 0; top: 50%; margin-top: -6px }
.menu__item--kebab:hover, .menu__item--kebab:focus { transform: rotate(45deg) }
```

### [Simple, CSS only, responsive menu](https://codepen.io/jurbank/pen/veGnb)

on hover of li.: a.: background+color+top ×4, a.: background+color, ul.sub: background+top | made with: :hover

```css
body { text-transform: uppercase }
.wrap { -webkit-box-shadow: 0 0 70px #fff; -moz-box-shadow: 0 0 70px #fff; box-shadow: 0 0 70px #fff; margin-top: 40px }
ul { position: relative }
nav { position: relative; -webkit-box-shadow: 2px 2px 3px #888; -moz-box-shadow: 2px 2px 3px #888; box-shadow: 2px 2px 3px #888 }
ul.sub { position: absolute; box-shadow: 2px 2px 0 #BEBEBE }
ul.sub li a { border-bottom: 1px dotted #ccc }
ul.sub li:last-child a { border-bottom: none }
.wrap { margin-top: 0px }
ul.sub { position: static; box-shadow: none }
```

### [Dot Hopper - Pagination](https://codepen.io/pyrografix/pen/bpePBa)

made with: GSAP

### [Spinner](https://codepen.io/ruigewaard/pen/CtnsJ)

on scroll: div.block: opacity+top ×16 | made with: @keyframes

```css
.container { margin-top: calc(100vh / 2 - 50px) }
.block { position: relative }
.block:nth-child(4n+1) { -webkit-animation: wave 2s ease .0s infinite; animation: wave 2s ease .0s infinite }
.block:nth-child(4n+2) { -webkit-animation: wave 2s ease .2s infinite; animation: wave 2s ease .2s infinite }
.block:nth-child(4n+3) { -webkit-animation: wave 2s ease .4s infinite; animation: wave 2s ease .4s infinite }
.block:nth-child(4n+4) { -webkit-animation: wave 2s ease .6s infinite; animation: wave 2s ease .6s infinite }
0% { top: 0; opacity: 1 }
50% { top: 30px; opacity: .2 }
100% { top: 0; opacity: 1 }
0% { top: 0; opacity: 1 }
50% { top: 30px; opacity: .2 }
100% { top: 0; opacity: 1 }
```

### [3D Model Scroll-Driven Animation (Robot)](https://codepen.io/bramus/pen/yLrNyGP)

held: fixed header, fixed model-viewer, fixed footer, fixed div.warning | on hover of a.: a.: color | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · :hover

```css
model-viewer { margin-top: 10vh; position: fixed; animation: foo linear both; animation-timeline: scroll(block root) }
header, footer { position: fixed }
header { top: 1em }
footer { bottom: 0 }
.warning { position: fixed; top: 40vh }
.warning > :first-child { margin-top: 0 }
.warning > :last-child { margin-bottom: 0 }
@keyframes foo animates 
```

### [Emoji glassmorphism nav (hover/ focus menu items)](https://codepen.io/thebabydino/pen/mdwYmWW)

held: fixed span.icon, fixed span.icon, fixed span.icon, fixed span.icon, fixed a | on hover of a.item: span.icon: color ×3, a.item: color | made with: position: fixed · @keyframes · transition · :hover · mask · backdrop-filter

```css
#btn--yp { position: fixed; bottom: 1em; filter: grayscale(1) drop-shadow(0 0 1px #e8e0e0); transition: 0.5s }
#btn--yp:before { position: absolute; bottom: 100%; animation: float 1s ease-in-out infinite alternate }
#btn--yp:hover, #btn--yp:focus { filter: grayscale(0) drop-shadow(0 0 1px crimson) }
to { transform: translateY(0.75em) }
.item { transition: color 0.3s }
.mono { transform: translate(calc(var(--hl)*.375em), calc(var(--hl)*-.25em)) rotate(calc(var(--hl)*22.5deg)); opacity: var(--hl); filter: sepia(1) hue-rotate(calc(var(--hue) - 50deg)) saturate(3) blur(var(--r, 0)); transition: 0 }
.mono[id*=blur] { position: fixed; bottom: 100vh }
.midl { backdrop-filter: blur(5px); -webkit-mask: linear-gradient(red 0 0) text }
.midl { backdrop-filter: none }
.grey { filter: grayscale(1) opacity(0.35) }
@keyframes float animates transform
```

### [Burger - Minimal, fullscreen nav.](https://codepen.io/mblode/pen/qEGWwB)

made with: @keyframes · transition · :hover

```css
0% { transform: translate3d(-250px, 0, 0) }
100% { transform: translate3d(0, 0, 0) }
0% { transform: translate3d(-250px, 0, 0) }
100% { transform: translate3d(0, 0, 0) }
0% { transform: translate3d(0, 0, 0) }
100% { transform: translate3d(-250px, 0, 0) }
0% { transform: translate3d(0, 0, 0) }
100% { transform: translate3d(-250px, 0, 0) }
body:after { opacity: 0; position: absolute; top: 0; transition: all 0.4s ease }
body.open:after { opacity: 1 }
.b-nav { position: absolute }
.b-nav li { transform: translateX(-250px) }
```

### [#CodePenChallenge: Menu](https://codepen.io/marcobesagni/pen/wXRywm)

on hover of li.menu-item: li.menu-item: background | made with: transition · :hover

```css
.menu-item { position: relative; border-bottom: 5px solid #999; transition: border-bottom 0.23s ease-in-out, background 0.23s linear }
.menu-item:hover .sub-menu, .menu-item:hover .sub-menu:hover, .menu-item:focus-w { opacity: 1 }
.sub-menu { position: absolute; margin-top: 1em; opacity: 0 }
a { text-transform: uppercase }
```

### [Skeuo-futuristic-slider](https://codepen.io/LukyVj/pen/NWLJjra)

held: fixed div.info-box | made with: @keyframes · mask · backdrop-filter · mix-blend-mode · custom properties driven by JS

```css
:root { --glow-color-opacity: 0 }
:root { --glow-color-opacity: 100 }
body:before { position: absolute }
body:after { position: absolute; opacity: 0.15; mix-blend-mode: color-dodge }
main { position: relative }
main *, main *:before, main *:after { will-change: transform, filter, background }
main:after { position: absolute; box-shadow: inset 0 0 26px rgba(0, 0, 0, 0.8), inset 0 -4px 6px -1px rgba(255, 255, 255, 0.1); top: 0; bottom: 0 }
main:before { position: absolute; box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.3), inset 0 -1px 2px rgba(0, 0, 0, 0.3), 0 0 20px 2px rgba(0, 0, 0, 0.2); top: 0; bottom: 0 }
main .circle-line { --glow-color-opacity: calc(var(--value) / 2); position: absolute; top: 0; bottom: 0; -webkit-mask-image: conic-gradient(from 0.5turn, black, black, transparent); mask-image: conic-gradient(from 0.5turn, black, black, tra }
main .outer-glow { position: absolute; top: 0; bottom: 0; transform: rotate(calc(var(--value) * 3.6 * 1deg)) }
main .outer-glow:after { position: absolute; transform: translate(240px, 500px); filter: blur(20px); mix-blend-mode: plus-lighter; opacity: calc(var(--value) / 100) }
main > div.inner { position: absolute; top: 0; bottom: 0 }
```

```js
style.setProperty('--value', value)
```

### [Glitch image hover effect with shaders](https://codepen.io/Juxtopposed/pen/GRPRPyR)

on scroll: canvas.: transform+top | on hover of img.: canvas.: transform+top | made with: transition · :hover · three.js / WebGL · requestAnimationFrame

```css
canvas { transition: 1s transform linear }
canvas:hover { transform: scale(1.2); transition: 5s transform linear }
#imageContainer { position: relative }
#imageContainer > * { position: absolute; inset: 0 }
.jux-linx { position: absolute; bottom: 20px }
a { transition: 0.1s all ease-in }
a:nth-child(1):hover { box-shadow: 0px 2px 0 #349eff }
a:nth-child(2):hover { box-shadow: 0px 2px 0 #ff5757 }
```

```js
requestAnimationFrame(animateScene)
```

### [Login Page - Tailwind](https://codepen.io/Gogh/pen/NWoYbXW)

made with: nothing recognised — read the code

### [About Us Pop-Out Effect](https://codepen.io/ainalem/pen/QWGNzYm)

on scroll: div.container: transform+top, img.img: transform+top | on hover of img.circle: div.container: transform+top ×2, img.img: transform+top ×2 | made with: transition · :hover · clip-path

```css
.container { transform: scale(0.48); transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1) }
.container:after { position: absolute; top: 390px }
.container:hover { transform: scale(0.54) }
.container-inner { clip-path: path( "M 390,400 C 390,504.9341 304.9341,590 200,590 95.065898,590 10,504.9341 10,400 V 10 H 200 390 Z" ); position: relative; top: -200px }
.circle { position: absolute; top: 210px }
.img { position: relative; transform: translateY(20px) scale(1.15); transform-origin: 50% bottom; transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1) }
.container:hover .img { transform: translateY(0) scale(1.2) }
.img1 { top: 164px }
.img2 { top: 174px }
.img3 { top: 144px }
.name { margin-top: 16px }
.title { margin-top: 4px }
```

### [Animated striped gradient button](https://codepen.io/cassidoo/pen/QWJwgox)

made with: @keyframes · :hover

```css
button { position: relative }
button::before { position: absolute; top: 0; -webkit-animation: barberpole 10s linear infinite; animation: barberpole 10s linear infinite }
button::after { position: absolute; top: 50%; transform: translate(-50%, -50%); box-shadow: 0px 10px 20px -10px rgba(0, 0, 0, 0.75) }
button:active::before { -webkit-animation-play-state: paused; animation-play-state: paused }
100% { background-position: 50% 50% }
100% { background-position: 50% 50% }
@keyframes barberpole animates background-position
```

### [Challenges: CSS Multi Button](https://codepen.io/deren2525/pen/rNaJpvb)

on scroll: i.icon: transform, a.button: transform+top | on hover of a.button: i.icon: transform ×2, a.button: transform+top ×2 | made with: transition · :hover

```css
.multi-button { position: relative; border-top: 1px solid #E5E5E5; border-bottom: 1px solid #E5E5E5 }
.button { position: absolute; top: -5px; transform: scale(0); transition: 0.8s }
.button-item { position: absolute; top: 20px }
.button-item:hover .icon { transform: translateX(-80px); transition: 0.8s }
.button-item:hover .button { top: -5px; opacity: 1; transition: 0.8s; transform: scale(1) }
.icon { position: absolute; transform: scale(1); transition: 0.8s }
```

### [26 Double Vertical Slider](https://codepen.io/nietoperq/pen/BaMoYYr)

on hover of button.down-button: button.down-button: background | made with: transition · :hover

```css
.slider-container { position: relative }
.left-slide { position: absolute; top: 0; transition: transform 0.5s ease-in-out }
.left-slide h1 { margin-bottom: 10px; margin-top: -30px }
.right-slide { position: absolute; top: 0; transition: transform 0.5s ease-in-out }
.right-slide > div { background-position: center center }
button { transition: background-color 0.5s ease }
.slider-container .action-buttons button { position: absolute; top: 50% }
.slider-container .action-buttons .down-button { transform: translateX(-100%) }
.slider-container .action-buttons .up-button { transform: translateY(-100%) }
```

### [Card hover effect](https://codepen.io/t_afif/pen/PoBQRmj)

on hover of img.: img.: transform+top, figcaption.: clip-path | made with: transition · :hover · clip-path · mask

```css
figure > * { transition: .4s }
figure figcaption { clip-path: inset(0 var(--_i,100%) 0 0); -webkit-mask: linear-gradient(#000 0 0), linear-gradient(#000 0 0); -webkit-mask-composite: xor; -webkit-mask-clip: text, padding-box }
figure:hover img { transform: scale(1.2) }
figure figcaption { -webkit-mask: none }
```

### [Tailwind UI - Cookie Notice](https://codepen.io/Quack/pen/oNbMLRd)

held: fixed div.fixed | made with: nothing recognised — read the code

### [Alerts](https://codepen.io/owczar/pen/abwmwNa)

on hover of button.btn: button.btn: background | made with: nothing recognised — read the code

```css
.alert-primary-light { border-bottom: 1px solid #dee2e6; border-top: 1px solid #dee2e6 }
```

### [scroll-linked X-wing](https://codepen.io/anon/pen/BageLgB)

made with: scroll-driven animation (animation-timeline) · view() timeline · @keyframes · 3D (perspective / preserve-3d)

```css
#tridiv { perspective: 800px; position: absolute }
.face { box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 1) }
.scene, .shape, .face, .face-wrapper, .cr { position: absolute }
.scene { transform:rotateX(0deg) rotateY(0); top: 50% }
.shape { top: 50% }
.face { background-position: center }
.photon-shader { position: absolute; top: 0 }
[class*="cuboid"] .rt { transform: rotateY(-90deg) translateX(-50%) }
[class*="cuboid"] .lt { transform: rotateY(90deg) translateX(-50%) }
[class*="cuboid"] .tp { transform: rotateX(90deg) translateY(-50%) }
[class*="cuboid"] .bm { transform: rotateX(-90deg) translateY(-50%) }
[class*="cuboid"] .bm { top: 100% }
```

### [Pure CSS Slideshow](https://codepen.io/cchana/pen/xxwgLgY)

on hover of a.: a.: opacity ×14, div.container: shadow | made with: transition · :hover

```css
.container { position: relative; transition: box-shadow 200ms }
.container:hover { box-shadow: 0 10px 50px -10px rgba(0, 0, 0, 0.25) }
.slideshow { position: relative }
.slideshow:after { padding-bottom: calc((100% / 6) * 4) }
.slideshow:hover a { opacity: 1 }
.slideshow a { opacity: 0; position: relative; transition: opacity 0.5s }
.slideshow a:after { position: absolute; top: calc(50% - 5px) }
.slideshow a:first-child:after { transform: rotate(-135deg) }
.slideshow a:nth-child(2):after { transform: rotate(45deg) }
.slideshow .slide { position: absolute }
.slideshow .slide a { position: absolute }
.pagination { bottom: 10px; position: absolute }
```

### [Slide-out Navigation with GSAP 3](https://codepen.io/designcourse/pen/ExgPaWE)

made with: :hover · clip-path · GSAP

```css
nav { clip-path: ellipse(50% 50% at -50% 50%) }
nav ul li a img { opacity: 0; transform: translateX(-10px) }
```

```js
gsap.timeline({defaults: {ease: "power2.inOut"}})
```

### [Password generator](https://codepen.io/vastrideside/pen/ExjyYoz)

on scroll: div.line-progression: shadow ×4 | made with: @keyframes · Web Animations API (.animate)

```css
#input-wrapper { position: relative }
#input-wrapper label { position: absolute; bottom: 10px; opacity: 1 }
#input-wrapper #pwd:valid + label, #input-wrapper #pwd:focus + label { bottom: 35px; opacity: 0 }
.levels-container .level-line .line-progression { position: relative; -webkit-animation: glowBar 0.6s ease-in-out infinite alternate; animation: glowBar 0.6s ease-in-out infinite alternate }
.levels-container .level-line .line-progression:before, .levels-container .level { position: absolute; top: 50%; transform: translateY(-50%) }
.levels-container .level-line .line-progression:after { -webkit-animation-duration: 0.8s; animation-duration: 0.8s; -webkit-animation-iteration-count: 1; animation-iteration-count: 1 }
[data-level="1"] .line-progression:after { -webkit-animation-name: pulse1; animation-name: pulse1 }
[data-level="2"] .line-progression:after { -webkit-animation-name: pulse2; animation-name: pulse2 }
[data-level="3"] .line-label { -webkit-animation: glow 0.6s ease-in-out infinite alternate; animation: glow 0.6s ease-in-out infinite alternate }
[data-level="3"] .line-progression:after { -webkit-animation-name: pulse3; animation-name: pulse3; -webkit-animation-duration: 2s !important; animation-duration: 2s !important }
0% { box-shadow: 0px 0px 0px 0px white }
50% { box-shadow: 0px 0px 30px 0px white }
```

```js
.animate({ d: asset.d[checkPass(password)[carac]] }, 250, mina.easeinout)
```

### [Button Hover | Glow](https://codepen.io/fedot/pen/qBgJxgE)

on hover of div.card: button.button: shadow, span.text: transform, div.icon: transform+color, svg.[object: color, use.[object: color | made with: transition · :hover · :focus-visible · mask

```css
.card { position: relative; box-shadow: inset 0 0 0 1px rgb(200 200 220 / 0.16), inset 0 0 5px -3px var(--color), inset 0 12px 48px 0 rgb(160 220 240 / 0.08), inset 0 0 120px -100px var(--color) }
.card::before { position: absolute; inset: 0; background-position: 0% 0%, 0% 100%, 100% 0%, 100% 100%; filter: drop-shadow(0 0 6px var(--color)) }
.card::after { position: absolute; inset: 0; opacity: 0.2; -webkit-mask-image: radial-gradient(90% 90% at 50% 50%, transparent, black); mask-image: radial-gradient(90% 90% at 50% 50%, transparent, black); filter: url(#noiseFilter) }
.button { position: relative; box-shadow: 0 0 0 1px rgb(200 200 220 / 0.22), 0 0 var(--box-glow-blur) var(--box-glow-color), inset 0 0 26px -10px var(--box-glow-color); transition: box-shadow 500ms ease }
.button::before { position: absolute; inset: 0; box-shadow: inset 0 0px 24px 0 rgb(170 230 250 / 0.12); transition: transform 500ms ease, box-shadow 500ms ease }
.text { transform: translateX(-50%); transition: transform 500ms ease }
.icon { position: absolute; transform: translateX(calc((var(--w)) / 2 + 8px)); transition: transform 500ms ease, color 500ms ease }
.button:hover::before, .button:active::before { transform: translateX(65%); box-shadow: inset 0 0px 0px 0 transparent }
.button:hover .text, .button:active .text { transform: translateX(0%); animation-play-state: running }
.button:hover .icon, .button:active .icon { transform: translateX(calc(var(--w) - var(--icon-size) - 19px)) }
```

### [Quick loader with CSS transforms, vars & Houdini magic](https://codepen.io/thebabydino/pen/mgvPzp)

on scroll: div.spike: transform ×73, div.spike: transform+top ×55 | made with: @keyframes

```css
.spike { position: absolute; top: calc(50% - 0.125em); transform: rotate(calc(var(--i)*1turn/var(--n))) translate(calc(0.25em/var(--f))) scalex(var(--fx)); animation: a 9s ease-in-out calc(var(--i)/var(--n)*-18s) infinite }
.spike:before, .spike:after { position: absolute; top: calc(50% - 0.125em); transform: scalex(calc(1/var(--fx))) }
.spike:nth-child(2n):before, .spike:nth-child(2n):after { box-shadow: calc(var(--s)*0.5em) 0 0 -1px currentcolor }
@keyframes a animates --fx
```

### [React draggable toggle](https://codepen.io/ainalem/pen/mdVOmOj)

made with: nothing recognised — read the code

### [Cross-Browser Range Input With Solid Lower Fill](https://codepen.io/noahblon/pen/OyajvN)

made with: nothing recognised — read the code

```css
input[type="range"] { position: relative }
::-webkit-slider-thumb { box-shadow: -200px 0 0 200px dodgerblue }
::-moz-range-thumb { box-shadow: -200px 0 0 200px dodgerblue }
```

### [Pure CSS3 Menu FullScreen](https://codepen.io/paulocesarpcfj/pen/mJgoez)

held: fixed div.menu | made with: position: fixed · transition · :hover

```css
.open { position: relative; top: 8px }
.open:before { position: relative; top: -8px; transform: rotate(0deg); transition: all 0.3s ease }
.open:after { position: relative; top: 4px; transform: rotate(0deg); transition: all 0.3s ease }
.menuOpen:hover .open:before { top: -9px }
.menuOpen:hover .open:after { top: 5px }
.menu { position: fixed; top: 0 }
.menu label { position: absolute; top: 20px }
.menu .menuContent { position: relative; top: 50%; padding-bottom: 20px; margin-top: -170px }
.menu ul li a { transition: color 0.2s; text-transform: uppercase }
.menuEffects { opacity: 0; transition: opacity 0.5s, visibility 0.5s }
.menuEffects ul { transform: translateY(0%); transition: all 0.5s }
#menuToggle:checked ~ .menuEffects { opacity: 1; transition: opacity 0.5s }
```

### [CSS More Menu Icon Animation](https://codepen.io/lotcss/pen/pogNPOy)

made with: transition · :hover

```css
body { margin-top: 20% }
h1 small { text-transform: none }
.line, .box { transition: all 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275) }
.menu__wrapper > span { margin-top: auto }
.menu__item--hamburger:hover .line:nth-child(1), .menu__item--hamburger:focus .l { transform: rotate(45deg) translate(12px, 12px) }
.menu__item--hamburger:hover .line:nth-child(3), .menu__item--hamburger:focus .l { transform: rotate(-45deg) translate(15px, -16px) }
.menu__item--doner:hover .line:nth-child(1), .menu__item--doner:focus .line:nth- { transform: rotate(45deg) translate(12px, 12px) }
.menu__item--doner:hover .line:nth-child(2), .menu__item--doner:focus .line:nth- { transform: rotate(-45deg) translate(-12px, -1.5px) }
.menu__item--doner:hover .line:nth-child(3), .menu__item--doner:focus .line:nth- { transform: rotate(-45deg) translate(25px, -14px) }
.menu__item--bento:hover .box:nth-child(2), .menu__item--bento:hover .box:nth-ch { opacity: 0 }
.menu__item--kebab { position: relative; transition: all 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275) }
.menu__item--kebab .circle:nth-child(4), .menu__item--kebab .circle:nth-child(5) { position: absolute; opacity: 0; top: 50%; margin-top: -6px }
```

### [Travel Deal Card Hover Rotation Effect](https://codepen.io/petegarvin1/pen/bGBGvvK)

on scroll: div.card: filter, p.title: color | on hover of div.card: div.card: filter ×2, p.title: color ×2 | made with: transition · :hover

```css
.panel { position: relative }
.panel:hover .card { filter: blur(1.5px) }
.panel:hover .slide { bottom: 0px }
.panel:hover .ring:before, .panel:hover .ring:after { transform: translateX(-50%) translateY(-50%) rotate(310deg) }
.ring { position: absolute; top: 50%; transform: translateX(-50%) translateY(-50%) }
.card { position: relative; transition: all 1s }
.ring:before, .ring:after { position: absolute; top: 50%; transition: transform 1s; transform: translateX(-50%) translateY(-50%) rotate(50deg) }
p { position: absolute }
.title { transition: all 1s; top: 0 }
.para { bottom: 0 }
.border { position: absolute; transition: border 1s }
.slide { position: absolute; bottom: -270px; transition: bottom 1s }
```

### [Full css3 only colorful star ratings \w inputs](https://codepen.io/daniesy/pen/KkJlF)

made with: transition · :hover

```css
.visuallyhidden { position: absolute !important }
.product-review-stars label:after { -webkit-transform: scale(4); position: absolute; transition: all .4s; opacity: 0 }
.product-review-stars input:checked + label:after { -webkit-transform: scale(1); opacity: 1 }
.product-review-stars label { position: relative }
.product-review-stars input:checked ~ label:before { opacity: 1 }
.product-review-stars:hover input ~ label:before { opacity: 0 }
.product-review-stars input + label:before { position: absolute; opacity: 0; transition: opacity .3s ease-in-out, color .3s ease-in-out }
.product-review-stars input + label:hover:before, .product-review-stars input +  { opacity: 1 }
```

### [Multi card Spotlight effect ✨](https://codepen.io/jh3y/pen/VwGmvVE)

on hover of div.card: div.card: transform+top | made with: transition · :hover · mix-blend-mode · 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking

```css
body { perspective: 100vmin }
img { scale: 1.2; translate: 0 0 }
.card:not(:hover) img { transition: translate 0.2s }
.card:hover img { translate: calc((var(--ratio-x) - 0.5) * 20%) calc((var(--ratio-y) - 0.5) * 20%) }
.card { transition: transform 0.2s }
.card:hover { transition: transform 0s; transform: rotateX(calc((var(--ratio-y) - 0.5) * 50deg)) rotateY(calc((var(--ratio-x) - 0.5) * -40deg)) }
.card:after { position: absolute; inset: 0 }
.card:before { filter: brightness(2) contrast(1); mix-blend-mode: color-dodge; position: absolute; inset: 0; opacity: 0.2; transition: opacity 0.2s }
.card:hover:before { background-position: calc(var(--ratio-x) * 10%) calc(var(--ratio-y) * 10%), calc(80% + (var(--ratio-x) * -50%)) calc(80% + (var(--ratio-y) * -50%)); opacity: 1 }
```

```js
style.setProperty('--x', posX)
style.setProperty('--y', posY)
style.setProperty('--ratio-x', ratioX)
style.setProperty('--ratio-y', ratioY)
addEventListener('pointermove', UPDATE)
addEventListener('pointermove', CARD.__MOVE)
```

### [Untitled](https://codepen.io/sol0mka/pen/79f115c42ed01a5721717a9c67adc0b2)

made with: nothing recognised — read the code

### [Neumorphism with Materialize CSS example](https://codepen.io/anon/pen/QWbGrYW)

held: fixed ul.sidenav | made with: nothing recognised — read the code

```css
.cards .row { padding-top: 30px; margin-bottom: 0 }
.cards .card { box-shadow: 6px 6px 14px 0 rgba(0, 0, 0, 0.2), -8px -8px 18px 0 rgba(255, 255, 255, 0.55) }
```

### [Pure CSS Star Rating from 0 to 8 with colored points of the star](https://codepen.io/janwagner/pen/zgrwI)

made with: nothing recognised — read the code

```css
.rating-star { position: relative }
.rating-star .rating-corners-one { position: absolute; transform: rotate(22.5deg) }
.rating-star .rating-corners-two { position: absolute; top: 0; transform: rotate(-22.5deg) }
.rating-star .rating { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.rating-star .corner { position: absolute }
.rating-star .corner:before { position: absolute; transform: rotate(-45deg) }
.rating-star .corner.one { top: 0 }
.rating-star .corner.one:before { top: -70.71067812px }
.rating-star .corner.two { top: 0 }
.rating-star .corner.two:before { top: -70.71067812px }
.rating-star .corner.three { bottom: 0 }
.rating-star .corner.three:before { top: 0 }
```

### [WebGL Grid Gallery](https://codepen.io/alphardex/pen/NWJpdzz)

held: fixed canvas, fixed header.top-bar, fixed div.loader-screen | on scroll: span.: filter ×7 | on hover of a.slide-in-text-child: span.: filter ×7 | made with: position: fixed · @keyframes · transition · :hover · GSAP · Lenis / smooth scroll · three.js / WebGL · pointer / mouse tracking

```css
.container { opacity: 0 }
#sketch { position: fixed; top: 0 }
.hollow { opacity: 0 }
.gallery .gallery-item .gallery-item-img { opacity: 0 }
.gallery .gallery-item .gallery-item-text { margin-top: 0.25rem }
.slide-in-text-wrapper .slide-in-text-child { transform: translateY(100%) }
.top-bar { position: fixed; top: 0 }
.top-bar .top-bar-nav .top-bar-nav-item { opacity: 0.5; transition: 0.3s }
.top-bar .top-bar-nav .top-bar-nav-item:hover, .top-bar .top-bar-nav .top-bar-na { opacity: 1 }
.loader-screen { position: fixed; top: 0; transition: 0.6s }
.loading-container { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.loading span { animation: blur 1.5s calc(var(--i) / 5 * 1s) alternate infinite }
```

```js
addEventListener("mouseenter", () => {
gsap.to(maku.mesh.material.uniforms.uHoverState, {
addEventListener("mouseleave", () => {
addEventListener("mousemove", () => {
gsap.timeline()
```

### [404 on CodePen](https://codepen.io/Zaku/pen/XWdWMLR)

made with: nothing recognised — read the code

### [404 on CodePen](https://codepen.io/bootpen/pen/jbbaRa)

made with: nothing recognised — read the code

### [Scoped ViewTimeline](https://codepen.io/web-dot-dev/pen/MWXYzeY)

held: fixed div.element-scroll-linked | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · @keyframes

```css
.element-moving-in-viewport { view-timeline-name: foo; view-timeline-axis: block; animation: scale both linear; animation-delay: enter 0%; animation-end-delay: cover 50%; animation-timeline: foo }
0% { scale: 0 }
.element-scroll-linked { animation: rotate both linear; animation-timeline: foo; animation-delay: enter 0%; animation-end-delay: cover 50% }
to { transform: translate(5%, -50%) rotate(360deg) }
div:first-of-type { position: absolute; top: calc(150vh - 12.5vmin); transform: translate(-55%, 0) }
div:last-of-type { position: fixed; top: 50%; transform: translate(5%, -50%) }
@keyframes scale animates scale
@keyframes rotate animates transform
```

### [Horizontal Menu](https://codepen.io/CarlRosell/pen/rvuns)

on hover of li.: li.: background+shadow | made with: transition · :hover

```css
body #wrapper ul li { -moz-transition: all 0.1s; -o-transition: all 0.1s; -webkit-transition: all 0.1s; transition: all 0.1s }
body #wrapper ul li:hover { -moz-box-shadow: inset 10px 10px 10px -10px rgba(0, 0, 0, 0.3), inset -10px 10px 10px -10px rgba(0, 0, 0, 0.3); -webkit-box-shadow: inset 10px 10px 10px -10px rgba(0, 0, 0, 0.3), inset -10px 10px 10px -10px rgba(0, 0, 0, }
body #wrapper ul li a { padding-top: 19px }
body #wrapper ul li div { margin-top: 5px }
```

### [Pure CSS grow & slide in button](https://codepen.io/thebabydino/pen/jOdbYNM)

on scroll: button.: background | made with: transition · :hover · clip-path

```css
button { transition: 0.3s ease-out }
button::before { clip-path: circle(closest-side); transition: inherit }
```

### [Bootstrap 5 Header 2](https://codepen.io/speedyui/pen/vYQPymq)

held: fixed a | made with: position: fixed · transition · :hover

```css
.speedyui-header .navbar-collapse { position: absolute; top: 100%; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) }
.speedyui-header .navbar-collapse { position: initial; box-shadow: none }
.speedyui-header .dropdown:hover .dropdown-menu { opacity: 1; margin-top: 0.125rem }
.speedyui-header .dropdown .dropdown-menu { margin-top: 0.125rem; transition: all 0.3s ease-in-out }
.speedyui-header .dropdown .dropdown-menu { opacity: 0; margin-top: 1rem; box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) }
.speedyui-hero { padding-top: 2rem; padding-bottom: 2rem }
.speedyui-hero { padding-top: 5rem; padding-bottom: 5rem }
.speedyui-hero .primary-btn { position: relative }
.speedyui-hero .primary-btn:after { transition: all 0.3s; top: 0; transform: skew(50deg) }
.speedyui-hero .primary-btn:after, .speedyui-hero .primary-btn:before { position: absolute }
```

### [Carousel thu 5 Bootstrap 4(source from bootsnipp)](https://codepen.io/haycuoilennao19/pen/KKdKVwV)

on scroll: span.char1: transform+opacity+top ×2, div.slide-image: transform ×2, span.pagination-number: opacity ×2, span.pagination-separator-loader: transform ×2, span.char2: transform+opacity+top, span.char3: transform+opacity+top | made with: transition · :hover · GSAP

```css
.slide { position: relative }
.slide-image { position: absolute; top: -200px; background-position: 50% 50% }
.slide-title { text-transform: uppercase }
.slide-title span { opacity: 0 }
.slideshow { position: relative }
.slideshow-pagination { position: absolute; bottom: 5rem; transition: .3s opacity }
.slideshow-pagination-item .pagination-number { opacity: 0.5 }
.slideshow-pagination-item.active .pagination-number { opacity: 1 }
.slideshow-navigation-button { position: absolute; top: 0; transition: all .3s ease }
.pagination-separator { position: relative; transition: all .3s ease }
.pagination-separator-loader { position: absolute; top: 0 }
```

### [Hover reveal animation using mask VI](https://codepen.io/smashingmag/pen/gOQEVdQ)

made with: transition · :hover · mask

```css
img { -webkit-mask: linear-gradient(#000 0 0), 0 0 var(--g),calc(var(--s)/2) 0 var(--g); -webkit-mask-composite: xor; mask-composite: exclude; transition: .5s }
img.alt { -webkit-mask-position: 0 0, 0 calc(var(--s)/2) }
img:hover { -webkit-mask-position: 0 0 }
```

### [Hole shape](https://codepen.io/t_afif/pen/OJGgGve)

made with: mask

```css
.hole { mask: radial-gradient(50px,#0000 98%, #000) }
```

### [Blog Post with Anchor Notes - Final Product](https://codepen.io/anon/pen/oNKqwgy)

held: fixed div.not-supported | on scroll: span.footnote: transform+opacity+top | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes

```css
from { opacity: 0; transform: scale(0.5) }
to { opacity: 1 }
&::before { position: absolute; bottom: 50%; margin-bottom: -8px }
.not-supported { position: fixed; top: 0 }
@keyframes pop-up animates opacity, transform
```

### [Fairly Colourful Profile Card](https://codepen.io/takaneichinose/pen/xvpqgo)

on scroll: a.: background, span.: color | on hover of div.card: a.: background, span.: color | made with: transition · :hover

```css
body { background-position: center }
.card { box-shadow: 0px 1rem 1.5rem rgba(0,0,0,0.5) }
.card .banner { background-position: center }
.card .banner svg { box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.3); transform: translateY(50%); transition: transform 200ms cubic-bezier(0.18, 0.89, 0.32, 1.28) }
.card .banner svg:hover { transform: translateY(50%) scale(1.3) }
.card .menu { position: relative }
.card .menu .opener { position: relative; transition: background-color 100ms ease-in-out }
.card .menu .opener span { position: absolute; top: 0 }
.card .menu .opener span:nth-child(1) { top: 0.45rem }
.card .menu .opener span:nth-child(2) { top: 1.05rem }
.card .menu .opener span:nth-child(3) { top: 1.65rem }
.card .actions .follow-info h2 a { transition: background-color 100ms ease-in-out }
```

### [Input range with morphing knob](https://codepen.io/ainalem/pen/JjGpojP)

made with: nothing recognised — read the code

### [Accordion](https://codepen.io/Tuna_/pen/KKzXEVO)

made with: transition

```css
.answer { position: relative; transition: max-height 650ms }
```

### [allow-discrete transition-behavior in action](https://codepen.io/_rahul/pen/VwONEGG)

made with: position: fixed · transition

```css
&[data-show="true"] { opacity: 1 }
&::after { position: fixed; translate: -50% 0; bottom: 0 }
```

### [get window scroll position](https://codepen.io/chriscoyier/pen/ZVZjXZ)

made with: scroll listener

```js
addEventListener("scroll", () => {
```

### [Scrolling Microinteraction #CodePenChallenge](https://codepen.io/hexagoncircle/pen/PoWarZE)

on scroll: span.cell: transform+opacity+top ×196, div.caption: opacity | made with: scroll-snap · transition · 3D (perspective / preserve-3d) · IntersectionObserver

```css
.images-list { position: relative; scroll-snap-type: y mandatory }
.list-item { scroll-snap-align: center }
.figure img { opacity: 0 }
.caption { opacity: 0; transition: opacity calc(var(--duration) * 2) calc(var(--duration) * 2.75) var(--ease) }
.cell-grid { perspective: 30vmin }
.cell { opacity: 0; transform: translate(calc(var(--offset-x) * 10px), calc(var(--offset-y) * 10px)); transition: var(--duration) var(--delay) var(--ease); transition-property: opacity, transform }
.in-view .caption { opacity: 1 }
.in-view .cell { opacity: 1; transform: translate(-4px, -4px) }
```

```js
new IntersectionObserver(observerCallback, options)
```

### [Dialog animate-in example](https://codepen.io/web-dot-dev/pen/ExBNgZL)

made with: @starting-style · transition · <dialog>

```css
@starting-style { translate: 0 100vh }
```

### [CSS Dialog Animations (no @starting-style - doesn't work)](https://codepen.io/anon/pen/JjqXLEb)

made with: transition · <dialog>

```css
&[open] { opacity: 1 }
```

### [Spinner - 2 (Pure CSS)](https://codepen.io/takeradi/pen/MyawBN)

on scroll: div.spinner: transform+top | made with: @keyframes

```css
.spin-wrapper { position: relative }
.spin-wrapper .spinner { position: absolute; top: 50%; animation: spin 2s linear infinite }
.spin-wrapper .spinner:before, .spin-wrapper .spinner:after { position: absolute }
.spin-wrapper .spinner:before { top: -12px; bottom: -12px; animation: spin 3s linear infinite }
.spin-wrapper .spinner:after { top: 6px; bottom: 6px; animation: spin 4s linear infinite }
0% { transform: rotate(0deg) }
100% { transform: rotate(360deg) }
@keyframes spin animates transform
```

### [Bootstrap 4 carousel multiple items per slide responsive](https://codepen.io/FrankieDoodie/pen/gdabrR)

on scroll: div.carousel-item: transform+top, div.carousel-item: transform | made with: nothing recognised — read the code

```css
body { padding-top: 20px }
```

### [Image Slider](https://codepen.io/wahidullah_karimi/pen/KwPpKro)

on scroll: button.card-button: background+color, i.fa-solid: color | made with: transition · :hover

```css
.card-list .card-item .card-link { box-shadow: 0 10px 10px rgba(0, 0, 0, 0.05); transition: 0.2s ease }
.card-list .card-link .card-button { transform: rotate(-45deg); transition: 0.4s ease }
.card-wrapper .swiper-pagination-bullet { opacity: 0.5 }
.card-wrapper .swiper-pagination-bullet-active { opacity: 1 }
.card-wrapper .swiper-slide-button { margin-top: -35px }
```

### [Scroll Snap Ruler Picker](https://codepen.io/argyleink/pen/RwzVqvg)

made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · scroll-snap · @keyframes · transition

```css
0%, 100% { opacity: .5; transform: scale(.25) }
50% { transform: scale(1); opacity: 1 }
& > * { scroll-snap-align: center }
&::before { position: relative; top: 0; translate: -50% -1lh; animation: promote var(--ease-in-out-1) both; animation-timeline: --inch-timeline; animation-range: cover, cover 30% cover 70% }
@keyframes promote animates opacity, transform
```

### [Combining both effects](https://codepen.io/smashingmag/pen/qBQvVPd)

made with: transition · :hover · mask

```css
img { -webkit-mask: linear-gradient(#000 0 0), linear-gradient(135deg,#000 50%,#0000 0) content-box 50% 50%/200% 200% no-repeat, linear-gradient(-45deg,#000 50%,#0000 0) content-box 50% 50%/200% 200% no-repeat; -webkit-mask-co }
img:hover { -webkit-mask-position: 0% 0%,100% 100% }
```

### [Book Prototype](https://codepen.io/web-dot-dev/pen/JjZoeEN)

held: fixed main.book-placeholder | made with: position: fixed · scroll-snap · 3D (perspective / preserve-3d) · Web Animations API (.animate)

```css
.logo { position: absolute; bottom: 10%; rotate: -25deg; opacity: 0.65 }
li, body > div { position: relative }
html.inline { scroll-snap-type: x mandatory }
body.inline-body { scroll-snap-type: x mandatory }
html.block { scroll-snap-type: y mandatory }
body > div:not(:last-of-type) { scroll-snap-align: end }
body > div:last-of-type { scroll-snap-align: start; position: relative }
h2 { position: absolute; top: 50%; transform: translate(-50%, -50%) rotate(-90deg) translateY(-100%); opacity: 0.5 }
.book-placeholder { position: fixed; top: 50%; transform: translate(-50%, -50%); perspective: 2500px }
.book { perspective: 2500px; scale: 0.25 }
.book__page { position: absolute }
.book__page:not(.page--cover) { top: 2% }
```

```js
.animate( [
```

### [3D Flipping Cards](https://codepen.io/ritalbradley/pen/jmGVmQ)

on scroll: div.front: transform, div.back: transform | on hover of li.col-md-3: div.front: transform ×2, div.back: transform ×2 | made with: position: fixed · transition · :hover · 3D (perspective / preserve-3d)

```css
body:before { position: fixed; top: 0 }
ul { perspective: 600 }
li { margin-bottom: 50px; position: relative }
li div { position: absolute; transition: all 0.5s; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3) }
li img { position: absolute }
li:hover .front { transform: rotateY(180deg) }
li:hover .back { transform: rotateY(0) }
.back { transform: rotateY(180deg) }
```

### [Exit-Crossing Animation Range Visualization](https://codepen.io/anon/pen/LENMrGV)

held: fixed label, fixed div, fixed div | made with: position: fixed · animation-range · :has() · scroll listener

```css
#scrollbox { position: fixed; top: 25vh }
#label { position: fixed; top: 45vh }
#animation { translate: 15vw 76.5vh; position: relative; position: relative }
#animation::before { position: relative }
label { position: fixed }
```

```js
addEventListener("scroll", (event) => {
```

### [Slider move/transform on hover tailwind](https://codepen.io/harrazmasri/pen/mdYevVm)

on scroll: img.group-hover/two:scale-110: transform+top, div.absolute: color | on hover of img.group-hover/one:scale-110: div.absolute: color ×2, img.group-hover/one:scale-110: transform+top, img.group-hover/two:scale-110: transform+top | made with: nothing recognised — read the code

### [Neumorphic UI realistic button](https://codepen.io/anon/pen/YzXppRK)

made with: nothing recognised — read the code

```css
section { padding-bottom: 3rem }
h2 { margin-top: 0; margin-bottom: 1.5rem }
.neumorphic { box-shadow: 12px 12px 24px 0 rgba(0, 0, 0, 0.2), -12px -12px 24px 0 rgba(255, 255, 255, 0.5) }
.neumorphic--pressed { box-shadow: inset 6px 6px 10px 0 rgba(0, 0, 0, 0.2), inset -6px -6px 10px 0 rgba(255, 255, 255, 0.5) }
.variation1 span { box-shadow: inset 8px 8px 16px 0 rgba(0, 0, 0, 0.2), inset -8px -8px 16px 0 rgba(255, 255, 255, 0.4) }
.variation2 span { padding-bottom: 1.5rem; position: relative }
.variation2 span::after { position: absolute; bottom: 0 }
```

### [Password error & success animation](https://codepen.io/aaroniker/pen/WNvjpxd)

held: fixed a.dribbble, fixed a.twitter | made with: position: fixed · @keyframes · transition · custom properties driven by JS

```css
#login-form .input { position: relative }
#login-form .input label { position: absolute; top: 8px; transform: translateY(var(--label-y, 0)) scale(var(--label-scale, 1)) translateZ(0); transition: transform 0.3s, color 0.3s }
#login-form .input input:not(:-moz-placeholder-shown) + label { --label-scale: .8 }
#login-form .input input:not(:-ms-input-placeholder) + label { --label-scale: .8 }
#login-form .input input:not(:placeholder-shown) + label, #login-form .input inp { --label-scale: .8 }
#login-form .input.email { margin-bottom: 16px }
#login-form .input.email input { box-shadow: inset 0 -1px 0 0 var(--grey) }
#login-form .input.password .dots { position: absolute; top: 50%; transform: translateY(-2px) }
#login-form .input.password .dots i { -webkit-animation: var(--name, scale-in) 0.05s linear forwards; animation: var(--name, scale-in) 0.05s linear forwards }
#login-form .input.password .cursor { position: absolute; top: 10px; opacity: 0; transform: translateX(var(--cursor-x, 0)); transition: transform var(--cursor-duration, 0.1s) }
#login-form .input.password input { opacity: 0; position: absolute; top: 0; bottom: 0 }
#login-form .input.password input:focus + label + .cursor { -webkit-animation: cursor 1s ease infinite; animation: cursor 1s ease infinite }
```

```js
style.setProperty('--cursor-x', password.value.length * 10 + 'px')
style.setProperty('--cursor-x', 0 + 'px')
```

### [animation features update dashboard page](https://codepen.io/FlorinCornea/pen/poNBrzm)

on hover of a.upgrade-btn: a.upgrade-btn: background | made with: position: fixed · @keyframes · transition · :hover

```css
.app i { animation-duration: 3s; animation-name: slidein; animation-iteration-count: 1 }
article { position: relative }
article div { transition: .5s ease }
article input { position: absolute; top: 0; opacity: 0 }
.upgrade-btn { transition: .3s ease }
.social i:before { position: fixed; top:5px }
from { margin-top: 100% }
@keyframes slidein animates margin-top, width, margin
```

### [Overflow detection using only CSS](https://codepen.io/t_afif/pen/jEWeOzN)

made with: scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · container queries

```css
:root { animation: --scroll-x forwards,--scroll-y forwards; animation-timeline: --scroll-x, --scroll-y }
.box { scroll-timeline: --scroll-x x,--scroll-y y }
@keyframes --scroll-x animates --scroll-x
@keyframes --scroll-y animates --scroll-y
```

### [Toggle and radio button replacing native outline focus with box shadow](https://codepen.io/larimaza/pen/jOOpPOO)

made with: transition · :hover

```css
input[type="radio"] { position: absolute; opacity: 0 }
.radio span:before { margin-top: 4px; transition: box-shadow 0.3s ease }
input[type="radio"]:focus ~ span:before { box-shadow: 0 0 0 4px rgba(21, 156, 228, 0.4) }
.toggle { position: relative }
input[type="checkbox"] { position: absolute; top: 0; opacity: 0 }
.toggle span { position: relative }
.toggle span:before { transition: background-color 0.3s ease }
.toggle span:after { position: absolute; top: 1px; transition: left 0.3s ease }
input[type="checkbox"]:checked ~ span:after { top: 1px }
input[type="checkbox"]:focus ~ span:before { box-shadow: 0 0 0 4px rgba(21, 156, 228, 0.4) }
```

### [Sea Mode](https://codepen.io/faria09/pen/mdVjjXL)

made with: @keyframes · transition

```css
.wrapper { position: absolute }
.wrapper .switch { position: absolute; top: 60%; transform: translate(-50%, -50%) }
.wrapper .switch .wave { position: absolute; top: 0 }
.wrapper .switch .wave:after { position: absolute; top: 3px; opacity: 0.4 }
.wrapper .switch .wave:before { position: absolute; top: 10px; opacity: 0.3 }
.wrapper .switch .slider { position: absolute; top: 0; bottom: 0; transition: all 1.4s }
.wrapper .switch .slider:before, .wrapper .switch .slider:after { position: absolute; bottom: 5px }
.wrapper .switch .slider:before { transition: 0.4s }
.wrapper .switch .slider:after { transition: 0.5s }
.wrapper .switch .slider .fish { position: absolute; top: 20%; transition: 1.5s all }
.wrapper .switch .slider .fish .body { transform: rotate(-45deg); position: relative }
.wrapper .switch .slider .fish .eye { position: absolute; top: 8px }
```

### [Famous Absinthe Drinkers CSS Gallery](https://codepen.io/carterfromsl/pen/YzexLaa)

held: fixed h1.title, fixed nav, fixed button.a-menu | made with: position: fixed · transition · :hover · mix-blend-mode

```css
#absinthe { transition: margin 0.5s ease-in-out }
.absinthe { position: relative }
.absinthe-overlay { position: absolute; top: 0; background-position: center; mix-blend-mode: overlay; filter: saturate(0.25) brightness(1.25) }
.absinthe article { position: relative; box-shadow: 0 3vmin 5vmin rgba(0, 0, 0, 0.5) }
.absinthe article section::before { position: absolute; top: 0; mix-blend-mode: multiply; filter: brightness(1.5) saturate(0.9); opacity: 0.8; transition: all 0.5s ease }
.absinthe article:hover section::before { opacity: 0.6 }
.absinthe article img { transition: all 0.3s ease }
.absinthe .signature { position: absolute; top: 2vmin; object-position: top right; filter: invert(1); mix-blend-mode: screen }
.tap-here { position: absolute; top: 27%; filter: invert(1); transition: all 0.3s ease }
article[class] .tap-here { opacity: 0 }
.absinthe section > img { position: absolute; top: 0 }
.absinthe section { transition: all 0.4s ease; position: relative }
```

### [bouncing play button](https://codepen.io/mi-ca/pen/MpobrZ)

made with: @keyframes

```css
html,body { filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fcfff4', endColorstr='#b3bead',GradientType=1 ) }
.playBtn { position: absolute; top: 50%; transform:translateX(-50%) translateY(-50%) }
#play { -webkit-animation: bouncejs-playVisible 1800ms linear 1 both; animation: bouncejs-playVisible 1800ms linear 1 both }
#play.goDown { -webkit-animation: bouncejs-playHidden 2170ms linear 1 both; animation: bouncejs-playHidden 2170ms linear 1 both }
0% { -webkit-transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 300, 0, 1); transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 300, 0, 1) }
1.57% { -webkit-transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 239.594, 0, 1); transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 239.594, 0, 1) }
1.67% { -webkit-transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 235.005, 0, 1); transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 235.005, 0, 1) }
2.02% { -webkit-transform: matrix3d(1.89, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 218.468, 0, 1); transform: matrix3d(1.89, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 218.468, 0, 1) }
2.35% { -webkit-transform: matrix3d(2.444, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 202.174, 0, 1); transform: matrix3d(2.444, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 202.174, 0, 1) }
2.9% { -webkit-transform: matrix3d(2.828, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 174.441, 0, 1); transform: matrix3d(2.828, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 174.441, 0, 1) }
3.03% { -webkit-transform: matrix3d(2.839, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 167.738, 0, 1); transform: matrix3d(2.839, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 167.738, 0, 1) }
3.51% { -webkit-transform: matrix3d(2.697, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 143.44, 0, 1); transform: matrix3d(2.697, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 143.44, 0, 1) }
```

### [Toggle cards with inverted border-radius #scss #js](https://codepen.io/kristen17/pen/NWZwJRK)

made with: nothing recognised — read the code

```css
section p { margin-top: 0.8em }
section .container { margin-top: 4em }
section .container .card-inner { position: relative }
section .container .card-inner .box .imgBox { position: absolute; inset: 0 }
section .container .card-inner .box .icon { position: absolute; bottom: -0.375rem }
section .container .card-inner .box .icon::before { position: absolute; bottom: 0.375rem; box-shadow: 0.313rem 0.313rem 0 0.313rem var(--clr) }
section .container .card-inner .box .icon::after { position: absolute; top: -1.25rem; box-shadow: 0.313rem 0.313rem 0 0.313rem var(--clr) }
section .container .card-inner .box .icon h3 { text-transform: uppercase }
section .container .card-inner .box .icon input { position: absolute; opacity: 0 }
section .container .card-inner .box .icon .checkmark { position: absolute; top: 0.938rem }
section .container .card-inner .box .icon .checkmark::after { position: absolute; top: 0.188rem; -webkit-transform: rotate(45deg); -ms-transform: rotate(45deg); transform: rotate(45deg) }
```

### [Expand/collapse cards with figure cut text](https://codepen.io/ainalem/pen/xJydpe)

made with: transition · clip-path

```css
.card { box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23); position: relative; transition: height 1000ms }
.card { transform: translateX(-50%) }
.label { margin-top: 30px; transform: translateY(10px); transition: transform 1000ms }
.card.expanded .label { transform: translateY(0) }
.text1 { clip-path: polygon(0% 100%, 0 -90%, 50% -5%, 100% -90%, 100% 100%); -webkit-clip-path: polygon(0% 100%, 0 -90%, 50% -5%, 100% -90%, 100% 100%); transition: clip-path 1000ms }
.card.expanded .text1 { clip-path: polygon(0% 100%, 0 -100%, 50% -15%, 100% -100%, 100% 100%); -webkit-clip-path: polygon(0% 100%, 0 -100%, 50% -15%, 100% -100%, 100% 100%) }
.text2 { clip-path: polygon(0% 100%,0% -80%,15% -70%,17.23% -53.59%,23% -40%,27.23% -28.94%,35% -20%,41.09% -13.59%,50% -10%,58.91% -13.23%,65% -20%,72.77% -28.23%,77% -40%,82.77% -54.65%,85% -70%,100% -80%,100% 100%); -webkit-cl }
.card.expanded .text2 { clip-path: polygon(0% 100%,0% -90%,15% -80%,17.23% -63.59%,23% -50%,27.23% -38.94%,35% -30%,41.09% -23.59%,50% -20%,58.91% -23.23%,65% -30%,72.77% -38.23%,77% -50%,82.77% -64.65%,85% -80%,100% -90%,100% 100%); -webkit-cl }
.text-content { transform: translateY(-160px); transition: transform 1000ms }
.card.expanded .text-content { transform: translateY(-15px) }
.chevron { position: absolute; bottom: 20px; transform: rotate(180deg); transition: transform 1000ms }
.card.expanded .chevron { transform: rotate(0deg) }
```

### [Sneaker Product Cards](https://codepen.io/ayushgptaa/pen/dyWoqZV)

on hover of section.card: div.product-image: transform+top | made with: transition · :hover

```css
.card { position: relative; box-shadow: -1px 15px 30px -12px rgb(32, 32, 32) }
.product-image { transform: translate(0, -1.5rem); transition: transform 500ms ease-in-out; filter: drop-shadow(5px 10px 15px rgba(8, 9, 13, 0.4)) }
.card:hover .product-image { transform: translate(-1.5rem, -7rem) rotate(-20deg) }
.btn { margin-top: 0.8rem }
.buy-btn { transition: 300ms ease }
.svg { transition: all 500ms ease }
```

### [Doom Damage Scroll](https://codepen.io/anon/pen/jOqrgeB)

held: fixed div | made with: position: fixed · @keyframes · scroll listener · requestAnimationFrame

```css
#doom-damage { position: fixed; top: 0; opacity: 0 }
.do-damage { animation: 0.4s doom-damage forwards }
0% { opacity: 1 }
100% { opacity: 0 }
@keyframes doom-damage animates opacity
```

```js
addEventListener("scroll", function (e) {
requestAnimationFrame(function () {
```

### [drop-shadow example](https://codepen.io/yuanchuan/pen/ZEWGzKp)

made with: nothing recognised — read the code

### [The more menu](https://codepen.io/ainalem/pen/VNVaVd)

on hover of li.: li.: background | made with: transition · :hover · clip-path

```css
.dots { margin-top: 30px }
.cut { -webkit-clip-path: polygon(49.94543% 0%, 49.146605% 0.56499168%, 47.908524% 1.8619327%, 46.53612% 3.2937721%, 45.334324% 4.2634587%, 44.449473% 4.6785326%, 43.75% 4.8902239%, 43.123985% 4.967017%, 42.459505% 4.9773959%,  }
.cut2 { -webkit-clip-path: polygon(49.94543% 0%, 49.631999% 0.12564846%, 49.187804% 0.4688613%, 48.640661% 0.97903993%, 48.018387% 1.605585%, 47.3488% 2.2978983%, 46.659716% 3.0053809%, 45.978952% 3.6774339%, 45.334324% 4.263458 }
.container { position: absolute; transform: translateX(-50%); transition: transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1) }
.drop { transform: translateY(5px); transition: transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1) }
.shadow { opacity: 0; position: absolute; transform: translateX(-50%) translateY(4px); transition: opacity 150ms cubic-bezier(0.4, 0.0, 0.2, 1) }
.list { position: absolute; transform: translateX(-50%); top: 120px }
.list li { border-bottom: 1px solid #bdbdbd; opacity: 0; transition: opacity 100ms cubic-bezier(0.4, 0.0, 0.2, 1) }
.dots.active .container { transform: translateX(-50%) translateY(20px) }
.dots.active .drop { transform: translateY(212px) scale(108) }
.dots.active .list li { opacity: 1; transition: opacity 200ms 100ms cubic-bezier(0.4, 0.0, 0.2, 1) }
.dots.active .shadow { opacity: 1; transition: opacity 150ms 150ms cubic-bezier(0.4, 0.0, 0.2, 1) }
```

### [Autofocus Bootstrap Modal Close Button](https://codepen.io/joe-watkins/pen/uBcto)

held: fixed div.modal | on hover of a.btn: a.btn: background | made with: nothing recognised — read the code

### [Pure CSS Progress](https://codepen.io/rgg/pen/QbRyOq)

made with: transition · 3D (perspective / preserve-3d)

```css
h2 { margin-bottom: 3em }
header p { margin-bottom: 0 }
section { margin-bottom: 2em }
section:last-of-type { margin-bottom: 0 }
section article { margin-bottom: 2em }
section article p, section article:last-of-type { margin-bottom: 0 }
p { padding-bottom: 1.5em }
.container { margin-bottom: 4em }
.chart { perspective: 1000px }
.bar { position: relative; transition: all 0.3s ease-in-out; transform: rotateX(60deg) rotateY(0deg) }
.bar .face { position: relative }
.bar .side-a { transform: rotateX(90deg) rotateY(-90deg) translateX(2em) translateY(1em) translateZ(1em) }
```

### [CSS corner-shape demo](https://codepen.io/anon/pen/EagYxLj)

made with: nothing recognised — read the code

### [Airplane Mode Toggle Switch ✈️](https://codepen.io/Kia8/pen/dyPLpaP)

on scroll: div.cloud-line: transform | made with: GSAP

```css
.switch { box-shadow: var(--shadow-off); position: relative }
.switch__button { position: absolute; top: 0 }
.airplane { position: absolute; top: 50% }
.airplane:not(.-on) { transform: translate(-50%, -50%) }
.airplane.-on { transform: translateY(-50%) }
.airport-wrapper { position: absolute; top: 0 }
.airport-wrapper::before, .airport-wrapper::after { position: absolute }
.airport-wrapper::before { top: 18% }
.airport-wrapper::after { bottom: 18% }
.airport__airstripWrapper { border-top: 0.5rem solid #bebebe; border-bottom: 0.5rem solid #bebebe }
.sky { position: absolute; top: 0; opacity: 0 }
.cloud-line { position: absolute; top: 0 }
```

```js
gsap.timeline({ repeat: -1 })
gsap.to(document.body, duration, { background, ease })
gsap.to(switchContainer, duration, { boxShadow, ease })
gsap.to(switchButton, duration, {
gsap.to(airplanes, duration, {
gsap.to(airport, duration, {
gsap.to(sky, duration, {
```

### [Full width scroll snap that snaps to the container](https://codepen.io/smashingmag/pen/xxMeBJa)

held: fixed div.container | made with: position: fixed · scroll-snap · transition · :hover

```css
> * { scroll-snap-align: start }
.overlay-toggle { border-bottom: 1px dashed #666 }
```

### [scroll-end event explorer #CSSWrapped2023](https://codepen.io/web-dot-dev/pen/OJdxKqJ)

made with: position: fixed · @keyframes · prefers-reduced-motion · Web Animations API (.animate)

```css
.gui-toast-group { position: fixed }
from { opacity: 0 }
from { opacity: 0 }
to { opacity: 0 }
to { opacity: 0 }
from { transform: translateY(var(--_travel-distance, 10px)) }
from { transform: translateY(var(--_travel-distance, 10px)) }
@keyframes fade-in animates opacity
@keyframes fade-out animates opacity
@keyframes slide-in animates transform
```

```js
.animate([
```

### [CSS Badge Promotion](https://codepen.io/hangsbreaker/pen/qEJWqV)

on scroll: div.badges: transform+top | on hover of a.: div.badges: transform+top | made with: @keyframes

```css
.fourthLine { position: relative; top: -10px }
.badges { position:relative; text-transform: uppercase; -webkit-animation: 3s ease-in-out 0s normal none infinite running swing; -moz-animation: 3s ease-in-out 0s normal none infinite running swing; -o-animation: 3s ease-in-out 0s }
.badges:before { position:absolute; top:90px; -webkit-box-shadow: 0px -82px 0px -2px #fff, 0px -100px #552F87,20px -98px #552F87,39px -94px #552F87,56px -85px #552F87,71px -72px #552F87, 83px -57px #552F87,93px -40px #552F87,98px -20px # }
.badges:after { position:absolute; top:-70px }
0% { -webkit-transform:rotate(5deg) }
50% { -webkit-transform:rotate(-5deg) }
100% { -webkit-transform:rotate(5deg) }
0% { -moz-transform:rotate(5deg) }
50% { -moz-transform:rotate(-5deg) }
100% { -moz-transform:rotate(5deg) }
0% { -o-transform:rotate(5deg) }
50% { -o-transform:rotate(-5deg) }
```

### [Stack of polaroid images | Wireframe](https://codepen.io/havardob/pen/jOwrXaJ)

on scroll: div.stack: transform+top | made with: transition · :hover

```css
.stack { transition: 0.25s ease }
.stack:hover { transform: rotate(5deg) }
.stack:hover .card:before { transform: translatey(-2%) rotate(-4deg) }
.stack:hover .card:after { transform: translatey(2%) rotate(4deg) }
.card { position: relative; transition: 0.15s ease }
.card:before, .card:after { position: absolute; transition: 0.15s ease; top: 0 }
.card:before { transform: translatey(-2%) rotate(-6deg) }
.card:after { transform: translatey(2%) rotate(6deg) }
.image { position: relative }
.browser-warning { margin-bottom: 4rem }
```

### [Scroll() Basic Example 1](https://codepen.io/anon/pen/EajYayv)

on scroll: div.circle: transform+opacity+top | made with: scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
.circle { animation-name: fadeScale; animation-duration: 1ms; animation-timeline: scroll() }
from { opacity: 0.1; transform: scale(1) }
to { opacity: 1; transform: scale(2) }
@keyframes fadeScale animates opacity, transform
```

### [CSS Tab](https://codepen.io/Wendy-Ho/pen/MWWBvmd)

made with: @keyframes

```css
.tab { box-shadow: 0 0.5rem 0.8rem #00000080 }
.panels { box-shadow: 0 2rem 2rem #00000080 }
.panel { animation: fadein .8s }
from { opacity:0 }
to { opacity:1 }
#one:checked ~ .tabs #one-tab, #two:checked ~ .tabs #two-tab, #three:checked ~ . { border-top: 3px solid #000 }
@keyframes fadein animates opacity
```

### [ComputedStyle vs calc() – Registered Custom Property](https://codepen.io/bramus/pen/WNPvvzm)

made with: :has()

```css
body { padding-bottom: 14em }
```

### [Domino preloader](https://codepen.io/akshaycodes/pen/OaXJgZ)

held: fixed footer | on scroll: i.fas: transform | on hover of a.: div.: transform, i.fab: transform+color+top, i.fas: transform+top | made with: position: fixed · @keyframes · transition · :hover

```css
h1, h2, h3, h4, h5, h6, a, p, span { padding-bottom: 0.714em !important; padding-top: 0.714em !important; text-transform: uppercase }
footer { bottom: 0; position: fixed }
footer .content .bottom { top: 10% }
footer .content .bottom .beat { -webkit-animation: beat 0.3s infinite alternate; animation: beat 0.3s infinite alternate }
footer .content .top .fa-twitter:hover { transition: 350ms ease-in-out; transform: scale(1.4) }
footer .content .top .fa-youtube:hover { transition: 350ms ease-in-out; transform: scale(1.4) }
footer .content .top .fa-instagram:hover { transition: 350ms ease-in-out; transform: scale(1.4) }
footer .content .top .fa-codepen:hover { transition: 350ms ease-in-out; transform: scale(1.4) }
footer .content .top i { transition: 500ms ease-in-out }
.artboard { position: absolute }
.domino > div { transform: rotate(45deg); -webkit-animation: domino-effect 2.4s infinite ease-in-out; animation: domino-effect 2.4s infinite ease-in-out }
.domino > div:nth-child(1):after { -webkit-animation-delay: 0.6s; animation-delay: 0.6s }
```

### [Basic scroll-target-group](https://codepen.io/web-dot-dev/pen/jEymmZd)

held: sticky ul.article-nav | on scroll: a.: color ×2 | made with: position: sticky · transition

```css
a { transition: color 0.25s ease }
body { position: relative }
```

### [Password field](https://codepen.io/aaroniker/pen/MWjpdxa)

held: fixed a.dribbble, fixed a.twitter | on scroll: div.password-field: shadow, circle.[object: transform | on hover of button.: path.[object: color ×7, button.: color, svg.[object: color, circle.[object: transform+color, g.[object: color | made with: position: fixed · transition · :hover · custom properties driven by JS · GSAP · pointer / mouse tracking

```css
.password-field { --eye-offset: 3px; position: relative; box-shadow: inset 0 0 0 1px var(--border, var(--c-border)), 0px 1px 3px var(--shadow, var(--c-shadow)); transition: box-shadow 0.25s }
.password-field input { transform: translateY(var(--y, var(--default-y, 0))) translateZ(0); opacity: var(--o, var(--default-o, 1)); transition: filter 0.35s, transform 0.4s, opacity 0.25s }
.password-field input::-moz-placeholder { -moz-transition: color 0.25s; transition: color 0.25s }
.password-field input:-ms-input-placeholder { -ms-transition: color 0.25s; transition: color 0.25s }
.password-field input::placeholder { transition: color 0.25s }
.password-field input.clear { position: absolute; top: 0 }
.password-field button { position: absolute; top: 0; transform: scale(var(--s, 1)); transition: color 0.25s, transform 0.15s }
.password-field button svg .top { fill-opacity: var(--eye-background) }
.password-field button svg .eye { transform: translate(var(--eye-x), var(--eye-y)) scale(var(--eye-s)) translateZ(0); transition: transform var(--eye-duration, 0.3s) }
body .dribbble { position: fixed; bottom: 20px }
body .twitter { position: fixed; bottom: 14px }
```

```js
addEventListener('pointermove', e => {
style.setProperty('--eye-x', (x < -halfWidth ? -halfWidth : x > fullWidth ? fullWidth : x) / 15 + 'px
style.setProperty('--eye-y', (y < -halfHeight ? -halfHeight : y > fullHeight ? fullHeight : y) / 25 +
style.setProperty('--eye-x', '0px')
style.setProperty('--eye-y', '0px')
```

### [Scroll-Linked Animation: Image Reveal as it scrolls into view (@scroll-timeline version)](https://codepen.io/bramus/pen/vYXQGXo)

held: fixed input, fixed dialog.sda_update | on scroll: img.revealing-image: opacity+clip-path+top | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · clip-path

```css
to { clip-path: inset(0% 0% 0% 0%); opacity: 1 }
.revealing-image { opacity: 0; clip-path: inset(45% 20% 45% 20%); animation: reveal 2s linear; animation-fill-mode: forwards }
scroll-timeline revealing-image-timeline-1 { scroll-offsets: selector(#revealing-image-1) end 0.5, selector(#revealing-image-1) end 1 }
scroll-timeline revealing-image-timeline-2 { scroll-offsets: selector(#revealing-image-2) end 0.5, selector(#revealing-image-2) end 1 }
#revealing-image-1 { animation-timeline: revealing-image-timeline-1 }
#revealing-image-2 { animation-timeline: revealing-image-timeline-2 }
#debug { position: fixed; top: 1em }
.full-bleed { transform: translateX(-50%) }
@keyframes reveal animates clip-path, opacity
```

### [Simple Scroll Snap Points](https://codepen.io/sdras/pen/43c9d13b23bc34a85bb3a5e2ea985958)

made with: scroll-snap

```css
.docScroller { position: absolute; top: 0; -ms-scroll-snap-points-y: repeat(100%); scroll-snap-points-y: repeat(100%); -ms-scroll-snap-type: mandatory; scroll-snap-type: mandatory; -ms-scroll-snap-destination: 100% 0%; scroll-snap-dest }
.inside { opacity: 0.3 }
```

### [Pure CSS 8bit Button Style](https://codepen.io/MatthewShields/pen/pwrXpV)

made with: :hover

```css
.eightbit-btn { position: relative; box-shadow: inset -4px -4px 0px 0px #4AA52E }
.eightbit-btn:hover, .eightbit-btn:focus { box-shadow: inset -6px -6px 0px 0px #4AA52E }
.eightbit-btn:active { box-shadow: inset 4px 4px 0px 0px #4AA52E }
.eightbit-btn:before, .eightbit-btn:after { position: absolute }
.eightbit-btn:before { top: -6px; border-top: 6px black solid; border-bottom: 6px black solid }
.eightbit-btn:after { top: 0 }
.eightbit-btn--reset { box-shadow: inset -4px -4px 0px 0px #8C2022 }
.eightbit-btn--reset:hover, .eightbit-btn--reset:focus { box-shadow: inset -6px -6px 0px 0px #8C2022 }
.eightbit-btn--reset:active { box-shadow: inset 4px 4px 0px 0px #8C2022 }
.eightbit-btn--proceed { box-shadow: inset -4px -4px 0px 0px #E59400 }
.eightbit-btn--proceed:hover, .eightbit-btn--proceed:focus { box-shadow: inset -6px -6px 0px 0px #E59400 }
.eightbit-btn--proceed:active { box-shadow: inset 4px 4px 0px 0px #E59400 }
```

### [Flyout Dialog Side Panel](https://codepen.io/argyleink/pen/jOgxGmX)

on scroll: button.: shadow | made with: @starting-style · transition · prefers-reduced-motion · <dialog>

```css
&::backdrop { transition: opacity var(--_duration) var(--ease-4); opacity: 0 }
media (prefers-reduced-motion: reduce) { transition: opacity var(--_duration) var(--ease-2); opacity: 0 }
media (prefers-reduced-motion: no-preference) { transition: translate var(--_duration) var(--ease-in-out-5); translate: calc((100% + var(--_card-inset)) * -1) 0 }
> button { box-shadow: 0 0 0 var(--_highlight-size) var(--_highlight) }
&, &::backdrop { opacity: 1 }
& > section { opacity: 1; translate: 0 }
&[open], &[open]::backdrop { opacity: 0 }
&[open] > section { opacity: 0; translate: calc((100% + var(--_card-inset)) * -1) 0 }
```

### [gsap/lenis ❍ Layout Explorations with Gsap, Lenis and ScrollTrigger N°5](https://codepen.io/filipz/pen/ogXXXPJ)

held: fixed header.site-header, fixed div.gradient-reveal, fixed div.audio-enable, fixed div.preloader, fixed div.geometric-background, fixed div.center-circle | made with: position: fixed · transition · :hover · clip-path · mix-blend-mode · GSAP · ScrollTrigger · Lenis / smooth scroll · scroll listener · requestAnimationFrame

```css
body { text-transform: uppercase }
body::before { position: fixed; top: 0; opacity: 0.08 }
.audio-enable { position: fixed; top: 0; text-transform: uppercase }
.enable-button { text-transform: uppercase; transition: all 0.3s ease }
.preloader { position: fixed; top: 0; text-transform: uppercase }
.site-header { position: fixed; top: 0 }
.logo-container { position: relative }
.logo-circles { position: relative }
.circle { position: absolute; transition: transform 0.5s cubic-bezier(0.445, 0.05, 0.55, 0.95); top: 50% }
.circle-1 { transform: translate(0, -50%) }
.circle-2 { transform: translate(0, -50%); mix-blend-mode: exclusion }
.logo-container:hover .circle-1 { transform: translate(-0.5rem, -50%) }
```

```js
addEventListener("scroll", () => {
gsap.registerPlugin(ScrollTrigger)
addEventListener("mouseenter", () => {
gsap.to(square, { scaleX: 1, duration: 0.3, ease: "power2.out" })
addEventListener("mouseleave", () => {
gsap.to(square, { scaleX: 0, duration: 0.2, ease: "power2.in" })
gsap.to(".gradient-reveal", {
gsap.to(".preloader", {
```

### [Loading Boxes 3D](https://codepen.io/aaroniker/pen/ZmOMJp)

held: fixed a.dribbble | on scroll: div.box: transform+top ×2 | on hover of a.dribbble: div.box: transform+top ×4 | made with: position: fixed · @keyframes · 3D (perspective / preserve-3d)

```css
.boxes { position: relative; margin-top: calc(var(--size) * 1.5 * -1); transform: rotateX(60deg) rotateZ(45deg) rotateY(0deg) translateZ(0px) }
.boxes .box { top: 0; position: absolute }
.boxes .box:nth-child(1) { transform: translate(100%, 0); -webkit-animation: box1 var(--duration) linear infinite; animation: box1 var(--duration) linear infinite }
.boxes .box:nth-child(2) { transform: translate(0, 100%); -webkit-animation: box2 var(--duration) linear infinite; animation: box2 var(--duration) linear infinite }
.boxes .box:nth-child(3) { transform: translate(100%, 100%); -webkit-animation: box3 var(--duration) linear infinite; animation: box3 var(--duration) linear infinite }
.boxes .box:nth-child(4) { transform: translate(200%, 0); -webkit-animation: box4 var(--duration) linear infinite; animation: box4 var(--duration) linear infinite }
.boxes .box > div { --top: auto; --bottom: auto; position: absolute; top: var(--top); bottom: var(--bottom); transform: rotateY(var(--rotateY)) rotateX(var(--rotateX)) translateZ(var(--translateZ)) }
.boxes .box > div:nth-child(1) { --top: 0 }
.boxes .box > div:nth-child(4) { --top: 0 }
0%, 50% { transform: translate(100%, 0) }
100% { transform: translate(200%, 0) }
0%, 50% { transform: translate(100%, 0) }
```

### [Notification bell](https://codepen.io/jjonatansosa/pen/KoYOgm)

made with: @keyframes · transition

```css
.btn { box-shadow: 5px 5px 4px rgba(0, 0, 0, .2); transition: .8s: will-change: transform }
.btn:active { transform: scale(.9) }
.notification { position: relative }
.notification::after { position: absolute; top: 5px; transition: .3s; opacity: 0; transform: scale(.5); will-change: opacity, transform }
.notification.show-count::after { opacity: 1; transform: scale(1) }
.notification.notify::before { animation: bell 1s ease-out; transform-origin: center top }
0% { transform: rotate(35deg) }
12.5% { transform: rotate(-30deg) }
25% { transform: rotate(25deg) }
37.5% { transform: rotate(-20deg) }
50% { transform: rotate(15deg) }
62.5% { transform: rotate(-10deg) }
```

### [Simple CSS Loader](https://codepen.io/ritalbradley/pen/OERWMY)

on scroll: div.loader: transform+top | made with: position: fixed · @keyframes

```css
body:before { position: fixed; top: 0 }
h2 { opacity: .7; -webkit-animation: appear 1s 3s forwards; animation: appear 1s 3s forwards }
.loader { -webkit-animation: spinningColor 1.5s ease-in-out infinite; animation: spinningColor 1.5s ease-in-out infinite }
0% { transform: rotate(360deg); border-top:5px dashed #f56682; border-bottom:5px dashed #387eff }
25% { border-top:5px dashed #f591a6; border-bottom:5px dashed #6da7f7 }
50% { border-top:5px dashed #fd878e; border-bottom:5px dashed #4ba3ff }
75% { border-top:5px dashed #f57f8f; border-bottom:5px dashed #569dff }
100% { border-top:5px dashed #f56682; border-bottom:5px dashed #387eff }
0% { transform: rotate(360deg); border-top:5px dashed #f56682; border-bottom:5px dashed #387eff }
25% { border-top:5px dashed #f591a6; border-bottom:5px dashed #6da7f7 }
50% { border-top:5px dashed #fd878e; border-bottom:5px dashed #4ba3ff }
75% { border-top:5px dashed #f57f8f; border-bottom:5px dashed #569dff }
```

### [Testimonials snapped container query trigger](https://codepen.io/web-dot-dev/pen/NPKMdBX)

made with: scroll-snap · transition · container queries

```css
container not scroll-state(snapped: x) { opacity: .25 }
```

### [Color Wheel Loader using animated custom properties](https://codepen.io/enebene/pen/OPMVQyv)

on scroll: span.: filter+background+top ×10 | made with: @keyframes

```css
.dots { position:relative }
.dots span { animation: colors 3s infinite cubic-bezier(.75,.25,.25,.75), pulse 3s infinite cubic-bezier(.75,.25,.25,.75); rotate: var(--degree); filter: blur(var(--blur)); position: absolute; top:0px }
.dots span:nth-child(10n + 1) { animation-delay: -0.3s }
.dots span:nth-child(10n + 2) { animation-delay: -0.6s }
.dots span:nth-child(10n + 3) { animation-delay: -0.9s }
.dots span:nth-child(10n + 4) { animation-delay: -1.2s }
.dots span:nth-child(10n + 5) { animation-delay: -1.5s }
.dots span:nth-child(10n + 6) { animation-delay: -1.8s }
.dots span:nth-child(10n + 7) { animation-delay: -2.1s }
.dots span:nth-child(10n + 8) { animation-delay: -2.4s }
.dots span:nth-child(10n + 9) { animation-delay: -2.7s }
.dots span:nth-child(10n) { animation-delay: -3s }
```

### [Responsive pricing cards #responsive #scss #flexbox](https://codepen.io/kristen17/pen/ZEPeEoN)

made with: transition

```css
h1 { text-transform: capitalize; padding-bottom: 2rem }
h1 { background-position: 98% 3.375rem; padding-bottom: 3rem }
section > span { margin-bottom: 0.938em; text-transform: uppercase }
.cards { margin-top: 3em }
.card__outer { position: relative; transition: 0.3s ease-in-out }
.card__outer a { text-transform: capitalize }
.card__inner { position: absolute; bottom: 3.75rem }
.card__inner .title { text-transform: capitalize; margin-top: 0.313em; margin-bottom: 0.938em }
.card__inner .price { position: relative }
.card__inner .price--number:after { position: absolute; bottom: -1.563rem }
.card__inner .price--dolar { margin-top: 0.625em }
.card:nth-child(1).active .card__outer { box-shadow: 5px 18px 13px rgba(104, 36, 214, 0.43) }
```

### [Waves Content Divider Using CSS](https://codepen.io/candra-shalahuddin/pen/vQqzyB)

on scroll: use.[object: transform ×4 | made with: @keyframes

```css
.editorial { bottom:0; position:absolute }
&:nth-child(1) { animation-delay: -2s }
&:nth-child(1) { animation-delay: -2s }
&:nth-child(1) { animation-delay: -2s }
&:nth-child(1) { animation-delay: -2s }
0% { transform: translate(85px, 0%) }
100% { transform: translate(-90px, 0%) }
0% { transform: translate(-90px, 0%) }
100% { transform: translate(85px, 0%) }
0% { transform: translate(85px, 0%) }
100% { transform: translate(-90px, 0%) }
0% { transform: translate(-90px, 0%) }
```

### [May the Force be with YOU](https://codepen.io/konstantindenerz/pen/oNaGOpE)

held: fixed a.labs-follow-me-twitter | on scroll: path.[object: color ×8, div.circle: color ×2, div.sub-circle: color ×2, script.: color ×2, div.scene: color, div.images: color | on hover of img.dark: div.light: shadow, div.dark: shadow | made with: @keyframes · transition · clip-path · mask · 3D (perspective / preserve-3d)

```css
input[type=checkbox] { -webkit-clip-path: inset(50%); clip-path: inset(50%); position: absolute }
.lightsaber { position: absolute }
.lightsaber .light { box-shadow: 0 0 1vmin var(--blur) rgba(255, 255, 255, 0.5), 0 0 6vmin var(--blur) var(--light-color-secondary); transition: opacity 0.6s linear, transform 0.6s linear; opacity: 0; -webkit-animation: pulse 1s ease-in-out  }
.checked .lightsaber .light { opacity: 1; transform: scaleX(1) }
.lightsaber .grip { transform: scaleX(1.2) }
.lightsaber .dark { box-shadow: 0 0 6vmin var(--blur) var(--dark-color-secondary); transition: opacity 0.6s linear, transform 0.6s linear; opacity: 1; -webkit-animation: pulse 1s ease-in-out infinite; animation: pulse 1s ease-in-out infinit }
.checked .lightsaber .dark { opacity: 0; transform: scaleX(0) }
.side.light-side { transform: translateZ(var(--x)) translateX(var(--y)) rotateY(calc(var(--angle))); transition: opacity 0.3s ease; opacity: 0 }
.side.light-side .circle { position: absolute; top: 4vmin }
.side.light-side .sub-circle { position: absolute; inset: 0.5vmin }
.side.light-side .sub-circle:after { position: absolute; top: 0.9vmin }
.side.light-side .top { transform: translate(2.5vmin, 1vmin) }
```

### [Card Swipe Carousel](https://codepen.io/Taluska/pen/LEEjBgz)

made with: transition · 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking · requestAnimationFrame

```css
.card-stack { position: relative }
:root { --card-perspective: 500px; --card-z-offset: 12px; --card-y-offset: 7px; --swipe-rotate: 0deg }
.card { position: absolute; transform: perspective(var(--card-perspective)) translateZ(calc(-1 * var(--card-z-offset) * var(--i))) translateY(calc(var(--card-y-offset) * var(--i))) translateX(var(--swipe-x, 0px)) rotateY(var(--s }
svg { filter: drop-shadow(0px 2px 3px #0007) }
```

```js
style.setProperty("--i", i + 1)
style.setProperty("--swipe-x", "0px")
style.setProperty("--swipe-rotate", "0deg")
style.setProperty("--swipe-x", `${deltaX}px`)
style.setProperty("--swipe-rotate", `${deltaX * 0.2}deg`)
requestAnimationFrame(() => {
style.setProperty("--swipe-x", `${direction * 300}px`)
style.setProperty("--swipe-rotate", `${direction * 20}deg`)
```

### [Shadow Showcase](https://codepen.io/anon/pen/qBaMQEN)

held: fixed div.modal | made with: position: fixed · transition · :hover · <dialog>

```css
.modal { position: fixed; padding-top: 100px; top: 0 }
.modal h2 { margin-bottom: 2rem }
.modal-content { position: relative }
#closeBtn { position: absolute; top: 5px; box-shadow: rgba(0, 0, 0, 0.3) 0 0 4px 1px }
h2 { margin-bottom: 1.25rem }
.showModalBtn { box-shadow: rgba(0, 0, 0, 0.15) 0 1px 2px 0px }
.card { position: relative; padding-bottom: 25px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24); transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) }
.card:hover { box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22) }
.drop-shadow { box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 4px 0px }
.floating { box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12) }
.sunken { box-shadow: rgb(223, 222, 222) 0px 0px 6px 1px inset }
.glow { box-shadow: 0 0 20px rgba(255, 238, 0, 0.8), 0 0 30px rgba(255, 238, 0, 0.6) }
```

### [Reveal you Star with cool hover effect](https://codepen.io/anon/pen/zYjEdoe)

made with: transition · :hover · clip-path

```css
img { clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); outline-offset: -100vmax; transition: .7s }
body { filter: drop-shadow(0 0 4px #fff220) }
```

### [Social Card + 3D Hover Effect](https://codepen.io/bobbykorec/pen/jyeeQP)

on scroll: a.social-icon: opacity+top ×4, div.inner-div: transform | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.background { position: absolute; top: 0; background-position: 0 50% }
.background:after { position: absolute; top: 0 }
.outer-div, .inner-div { position: relative }
.outer-div { perspective: 900px }
.inner-div { transition: all 0.6s cubic-bezier(0.8, -0.4, 0.2, 1.7) }
.inner-div:hover .social-icon { opacity: 1; top: 0 }
.outer-div:hover .inner-div { transform: rotateY(180deg) }
.front, .back { position: relative; top: 0 }
.front { box-shadow: 0 15px 10px -10px rgba(0, 0, 0, 0.5), 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset }
.front__bkg-photo { position: relative }
.front__bkg-photo:after { position: absolute; top: 0 }
.front__face-photo { position: relative; top: -60px }
```

### [Fullscreen Bootstrap Modal](https://codepen.io/nathancooper/pen/IwGfs)

held: fixed div.modal, fixed div.modal-dialog | made with: position: fixed · :hover

```css
.modal { position: fixed; top: 0; bottom: 0 }
.modal-dialog { position: fixed }
.modal-content { position: absolute; top: 0; bottom: 0; box-shadow: none }
.modal-header { position: absolute; top: 0 }
.modal-body { position: absolute; top: 50px; bottom: 60px }
.modal-footer { position: absolute; bottom: 0 }
.btn:focus, .btn:active, .btn:active:focus { box-shadow: none }
.btn-modal { position: absolute; top: 50%; margin-top: -20px }
.btn-primary, .btn-primary:hover, .btn-primary:focus, .btn-primary:active { border-bottom: 3px solid #36a940; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15) }
.btn-primary:active, .btn-primary:hover:active, .btn-primary:focus:active, .btn- { border-bottom: 1px solid #36a940 }
.btn-default, .btn-default:hover, .btn-default:focus, .btn-default:active { border-bottom: 3px solid #a2aab8 }
.btn-default:active, .btn-default:hover:active, .btn-default:focus:active, .btn- { border-bottom: 1px solid #a2aab8 }
```

### [Card Text](https://codepen.io/brucebrotherton/pen/wvqjORe)

on scroll: div.card: transform+shadow+top | made with: @keyframes · transition · :hover

```css
.card_image { box-shadow: 0 50px 100px 0 var(--violet) }
.card { position: relative; transition: transform 0.1s linear, box-shadow 0.2s }
.card:focus, .card:hover { transform: scale(1.01); box-shadow: 0 10px 5px -5px rgba(0, 0, 0, 0.2) }
.card_title { position: absolute; top: 0; transform: rotate(-3.3deg); transform-origin: left top; animation: 0s 0s fly-in 0 reverse both }
.card_title { animation: 0.5s 0.25s fly-out 1 both }
.card:focus .card_title, .card:hover .card_title { animation: 0.5s ease-in 0s fly-in 1 both }
.upcharge { position: relative }
.upcharge::after, .upcharge::before { position: absolute; opacity: 0.3 }
.upcharge::before { top: 0.5rem }
.upcharge::after { bottom: 1.25rem }
.note { margin-top: 1rem }
0% { top: 0 }
```

### [An odd slider](https://codepen.io/cleveryeti/pen/LYQoWBX)

made with: transition

```css
.slider-container { position: relative }
.slider { position: absolute; opacity: 0 }
.slider-bar { position: absolute; top: 50%; transform: translate(-50%, -50%); box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 8px 0px }
.slider-circle { position: absolute; box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 8px 0px; transition: top 100ms ease-in-out }
.slider-text { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.slider-progress { position: absolute }
```

### [Little Gallery](https://codepen.io/yoann-b/pen/abEjWgq)

on scroll: figure.creaBlock: transform+top ×2 | on hover of img.: figure.creaBlock: transform+top ×3 | made with: transition · :hover

```css
.blocImg { position: relative }
.blocImg > img::after { position: absolute; top: 0; bottom: 0 }
.creaBlock { position: relative; vertical-align: top; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); -webkit-box-shadow: var(--shadowColor); -moz-box-shadow: var(--shadowColor); box-shadow: var(--shadowColor) }
.creaBlock:not(.creaBlockPrez):hover { transform: scale(1) }
.creaBlock::after { position: absolute; top: 50%; transform: rotateZ(70deg) }
.creaBlock > figcaption { position: absolute; top: 0; opacity: 0.8 }
.creaBlock h2 { transition: var(--background-color) 0.6s }
.creaBlock { transform: scale(0.9) }
.creaBlockPrez:nth-child(1) { transform: scale(0.9) }
.creaBlockPrez:nth-child(1):hover { transform: scale(1.1) }
.creaBlockPrez:nth-child(1):hover ~ .creaBlockPrez:nth-child(2) { transform: scale(0.83) translateX(var(--blockTranslateX)) rotateY(var(--blockRotateY)) }
.creaBlockPrez:nth-child(1):hover ~ .creaBlockPrez:nth-child(3) { transform: scale(0.88) translateX(var(--blockTranslateX)) rotateY(var(--blockRotateY)) }
```

### [Codepen Challenge #2](https://codepen.io/matevegh/pen/LEvoqY)

made with: @keyframes · transition · :hover

```css
form { position: relative; box-shadow: 0 40px 40px -20px rgba(0, 0, 0, 0.25) }
form:before, form:after { position: absolute; top: 0 }
form:before { -webkit-animation: creature-left 12s infinite; animation: creature-left 12s infinite; -webkit-animation-delay: 3s; animation-delay: 3s }
8%, 12% { transform: rotate(30deg) }
20% { transform: rotate(0) }
8%, 12% { transform: rotate(30deg) }
20% { transform: rotate(0) }
form:after { -webkit-animation: creature-right 12s infinite; animation: creature-right 12s infinite; -webkit-animation-delay: 9s; animation-delay: 9s }
8%, 12% { transform: rotate(-60deg) }
20% { transform: rotate(0) }
8%, 12% { transform: rotate(-60deg) }
20% { transform: rotate(0) }
```

### [Website Header - SVG Mask](https://codepen.io/shadeed/pen/mdmpaXy)

held: sticky header | made with: position: sticky · backdrop-filter

```css
header { position: sticky; top: 0; -webkit-backdrop-filter: blur(2px); backdrop-filter: blur(2px) }
header svg { position: absolute; top: 0 }
.logo { position: relative; top: calc(var(--header-height) * 0.7 - var(--radius)) }
.wrapper > * { margin-bottom: 1rem }
```

### [Elastic Bouncing Squares Loader](https://codepen.io/ricardogouveia3/pen/MzvVKg)

on scroll: div.outside-square: transform+top, div.inside-square: transform+top | made with: @keyframes

```css
body { position: relative }
.outside-square, .inside-square { position: absolute; -webkit-animation: sideBouncing 0.3s ease-in-out infinite; animation: sideBouncing 0.3s ease-in-out infinite }
.outside-square { animation-direction: alternate-reverse; box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.3) }
.inside-square { -webkit-animation-direction: alternate; animation-direction: alternate }
0% { transform: rotate(-5deg) }
100% { transform: rotate(5deg) }
0% { transform: rotate(-5deg) }
100% { transform: rotate(5deg) }
@keyframes sideBouncing animates transform
```

### [Day and Night - SVG Animation](https://codepen.io/TurkAysenur/pen/bGawdKv)

made with: @keyframes · transition · mix-blend-mode

```css
body { position: relative; -webkit-animation: bg-anim 15s ease infinite; animation: bg-anim 15s ease infinite }
.container { position: relative; box-shadow: 0 30px 50px rgba(0, 0, 0, 0.3) }
.device { position: absolute }
.layer1, .layer2 { position: absolute; top: 0; transform: scale(1.01) }
.layer2 { opacity: 0; transition: 4s }
.layer1 { opacity: 1; transition: 4s }
.moon { transform: translate(-50px, 230px); transition: 4s }
.rising-star { transform: translate(225px, -160px); transition: 4s }
.sun { transition: 5s }
.cloud1, .cloud2, .cloud3, .cloud4 { transition: 4s }
.light-mode .layer2 { opacity: 1 }
.light-mode .moon, .light-mode .rising-star { transform: none }
```

### [Awful Buttons](https://codepen.io/cobra_winfrey/pen/YzyXjmQ)

made with: transition · :hover

```css
body div { position: absolute; margin-top: 80px }
body div:nth-of-type(2) { margin-top: -80px; transform: scaleY(-1) }
body div:nth-of-type(2):hover b span .char { offset-distance: calc((var(--char-index) * 7.5%) + 35%) }
body div:nth-of-type(2) b span .char { transform: scaleY(-1); offset-distance: calc((var(--char-index) * 10%) + 32.5%) }
body div:before { transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: absolute; box-shadow: 0 -20px 0 -20px }
body div:hover b { top: 20px }
body div:hover:before { box-shadow: 0 -20px 0 -10px }
body div:hover b .word .char { offset-path: path("M 0 200 C 45 300 10 370 100 370 C 190 370 160 300 195 200 "); offset-distance: calc((var(--char-index) * 7.5%) + 33%) }
body b { position: absolute; top: 25px }
body b .word { position: relative }
body b .word .char { offset-path: path("M 0 300 C 30 300 60 300 95 300 C 165 300 130 300 195 300 "); position: absolute; top: -300px; offset-distance: calc((var(--char-index) * 10%) + 25%); transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1 }
```

### [CSS3 Box Shadows Effects](https://codepen.io/sushmitg/pen/ZvLwZJ)

held: fixed div.box | made with: position: fixed

```css
.box h3 { position:relative; top:80px }
.effect4 { position:fixed; top:0 }
.effect4:after { position: absolute; bottom: 15px; top: 80%; -webkit-box-shadow: 0 15px 10px #777; -moz-box-shadow: 0 15px 10px #777; box-shadow: 0 15px 10px #777; -webkit-transform: rotate(3deg); -moz-transform: rotate(3deg); -o-transfo }
```

### [Pure CSS Floating Action Button](https://codepen.io/jo_Geek/pen/gyrZWW)

held: fixed div.fab-wrapper | on scroll: span.fab-dots: opacity ×3 | on hover of a.fab-action: span.fab-dots: opacity ×3, label.fab: background+shadow | made with: position: fixed · @keyframes · transition · :hover

```css
.fab-wrapper { position: fixed; bottom: 3rem }
.fab { position: absolute; bottom: -1rem; box-shadow: 0px 5px 20px #81a4f1; transition: all 0.3s ease }
.fab:before { position: absolute; top: 0 }
.fab-checkbox:checked ~ .fab:before { top: 5% }
.fab:hover { box-shadow: 0px 5px 20px 5px #81a4f1 }
.fab-dots { position: absolute; top: 50%; transform: translateX(0%) translateY(-50%) rotate(0deg); opacity: 1; animation: blink 3s ease infinite; transition: all 0.3s ease }
.fab-dots-1 { animation-delay: 0s }
.fab-dots-2 { transform: translateX(-50%) translateY(-50%); animation-delay: 0.4s }
.fab-dots-3 { animation-delay: 0.8s }
.fab .fab-dots-2 { transform: translateX(-50%) translateY(-50%) rotate(0deg) }
.fab-checkbox:checked ~ .fab .fab-dots-1 { transform: translateX(-50%) translateY(-50%) rotate(45deg) }
.fab-checkbox:checked ~ .fab .fab-dots-3 { transform: translateX(50%) translateY(-50%) rotate(-45deg) }
```

### [Ice Pop Loader](https://codepen.io/dariocorsi/pen/PoRpZPp)

held: fixed a | made with: @keyframes · clip-path

```css
:root { --animation-duration: 2000ms; --animation-stagger: 80ms }
.mr-freeze { position:relative; animation: infinite syrup-displacement var(--animation-duration) ease; animation-delay: var(--delay) }
.mr-freeze:before { --inset: 10%; position:absolute; top: var(--inset); bottom: 1.5rem; opacity:.9; animation: infinite pop-da-pop var(--animation-duration) ease; animation-delay: var(--delay); box-shadow: inset .25rem .25rem .5rem hsla(40, }
.mr-freeze:after { position:absolute; top: 0; bottom: 0; clip-path: polygon( 0 0, 100% 0, 100% 100%, 87.5% 99%, 75.0% 100%, 62.5% 99%, 50.0% 100%, 37.5% 99%, 25.0% 100%, 12.5% 99%, 0 100% ) }
0%, 5%, 95%, 100% { transform: translateY(0) }
40%, 60% { transform: translateY(-50%) }
50% { transform: translateY(-48%) }
@keyframes pop-da-pop animates transform
@keyframes syrup-displacement animates background-size
```

### [Batman loader](https://codepen.io/HugoGiraudel/pen/xsvFa)

on scroll: ul.: transform+top | on hover of li.: ul.: transform+top | made with: @keyframes

```css
.wrapper { position: relative; box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.4) }
.wrapper:after { position: absolute; top: 0 }
.wrapper:before, .loader:before { position: absolute; top: -1px }
.loader { border-bottom: 1px solid rgba(0, 0, 0, 0.4); position: relative }
.loader:before { top: -19px }
.loader:after { position: absolute; top: -21px; box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.2) }
.wrapper p { text-transform: uppercase; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); position: relative }
.wrapper p:after { position: absolute; bottom: -20px }
.loader li { position: absolute; top: 40px }
.loader ul { animation: spinner 2s steps(12, end) infinite; position: relative }
.loader li:nth-child(1) { transform: rotate(30deg) translate(0, -30px) }
.loader li:nth-child(2) { transform: rotate(60deg) translate(0, -30px) }
```

### [CSS 3D transform Colorful Animated Carousel](https://codepen.io/edmundojr/pen/qdLWWx)

on scroll: div.icon-cards__content: transform+top | made with: @keyframes · transition · :hover · 3D (perspective / preserve-3d)

```css
.icon-cards { position: relative; perspective: 1000px }
.icon-cards__content { position: absolute; transform: translateZ(-30vw) rotateY(0); -webkit-animation: carousel 10s infinite cubic-bezier(0.77, 0, 0.175, 1) forwards; animation: carousel 10s infinite cubic-bezier(0.77, 0, 0.175, 1) forwards }
.icon-cards__content.step-animation { -webkit-animation: carousel 8s infinite steps(1) forwards; animation: carousel 8s infinite steps(1) forwards }
.icon-cards__item { position: absolute; top: 0; bottom: 0; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1) }
.icon-cards__item:nth-child(1) { transform: rotateY(0) translateZ(35vw) }
.icon-cards__item:nth-child(2) { transform: rotateY(120deg) translateZ(35vw) }
.icon-cards__item:nth-child(3) { transform: rotateY(240deg) translateZ(35vw) }
0%, 17.5% { transform: translateZ(-35vw) rotateY(0) }
27.5%, 45% { transform: translateZ(-35vw) rotateY(-120deg) }
55%, 72.5% { transform: translateZ(-35vw) rotateY(-240deg) }
82.5%, 100% { transform: translateZ(-35vw) rotateY(-360deg) }
0%, 17.5% { transform: translateZ(-35vw) rotateY(0) }
```

### [Bootstrap Button 3D](https://codepen.io/Robsonrrn/pen/KozpKN)

made with: transition · :hover

```css
.button { text-transform: uppercase; box-shadow: 0px 17px 10px -10px rgba(0, 0, 0, 0.4); -webkit-transition: all ease-in-out 300ms; transition: all ease-in-out 300ms }
.button:hover { box-shadow: 0px 37px 20px -20px rgba(0, 0, 0, 0.2); -webkit-transform: translate(0px, -10px) scale(1.2); transform: translate(0px, -10px) scale(1.2) }
```

### [neomorphic multi-buttons](https://codepen.io/nirjan_dev/pen/xxbjpZz)

on scroll: button.btn-group__item: color+shadow | made with: transition · :hover

```css
.btn-group { box-shadow: -2.3px -2.3px 3.8px rgba(255, 255, 255, 0.2), -6.3px -6.3px 10.6px rgba(255, 255, 255, 0.3), -15.1px -15.1px 25.6px rgba(255, 255, 255, 0.4), -50px -50px 85px rgba(255, 255, 255, 0.07), 2.3px 2.3px 3.8px rgba }
.btn-group__item { box-shadow: inset 0px 0px 0px -15px rebeccapurple; transition: all 300ms ease-out }
.btn-group__item:hover, .btn-group__item:focus { box-shadow: inset 0px -20px 0px -15px rebeccapurple }
.btn-group__item:after { position: absolute; transform: translatey(10px); opacity: 0; transition: all 200ms ease-out }
.btn-group__item--active:after { opacity: 1; transform: translatey(-2px) }
```

### [Cosmic neon effect](https://codepen.io/carmenansio/pen/XWBKLqm)

on scroll: span.: opacity | made with: transition · :hover

```css
.name { position: relative }
.name .cosmic { position: relative }
.name .cosmic span { transition: 0.5s }
.name .cosmic:hover span { opacity: 0 }
.name .cosmic::before { position: absolute; top: 0; transition: 0.6s ease-in-out }
.name .cosmic:hover::before { filter: drop-shadow(0 0 2rem var(--color)) }
```

### [Scroll-to-Top Button with Vanilla JS (Detecting the scroll position)](https://codepen.io/anon/pen/GRZOWwp)

held: fixed button.scrollToTopBtn | on scroll: button.scrollToTopBtn: transform+opacity+top | made with: position: fixed · transition · scroll listener

```css
.scrollToTopBtn { position: fixed; bottom: 20px; opacity: 0; transform: translateY(100px); transition: all 0.5s ease }
.showBtn { opacity: 1; transform: translateY(0) }
```

```js
addEventListener("scroll", handleScroll)
```

### [Horizontal scrolling gallery - ScrollTrigger](https://codepen.io/GreenSock/pen/dydpJzY)

held: fixed div | on scroll: div.: transform+top, div.horiz-gallery-wrapper: transform+top, div.horiz-gallery-strip: transform+top | on hover of img.: div.: transform+top | made with: GSAP · ScrollTrigger

```css
.row, .section, section { position: relative }
.horiz-gallery-strip, .horiz-gallery-wrapper { will-change: transform; position: relative }
```

```js
gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
gsap.to(pinWrap, {
scrollTrigger: { scrub: true, trigger: sec, pin: sec, start: "center center", end: () => `+=${pinWrapWidth}
```

### [Neobrutalist React Form with Floating Labels](https://codepen.io/carsonf92/pen/zYMxXBY)

made with: transition

```css
.form { box-shadow: 6px 6px 0 #000 }
.form__field-group { position: relative }
.form__label { position: absolute; top: 2rem; transition: 0.2s ease font-size, 0.2s ease top }
.form__label--raised { top: 0.8rem }
.form__input { box-shadow: inset 0 2px 0 #E5E5E5; margin-bottom: 1.6rem }
.form__submit { box-shadow: inset 0 2px 0 #F6FFCB, 3px 3px 0 #000 }
.form__submit:active { box-shadow: inset 0 2px 0 #CEED40, 1px 1px 0 #000 }
```

### [Hover Glide Image Gallery](https://codepen.io/Hyperplexed/pen/VwXXPKJ)

held: fixed a.meta-link, fixed a.meta-link | on scroll: div.: transform+top | on hover of img.: div.: transform+top | made with: position: fixed · transition · :hover · backdrop-filter · Web Animations API (.animate)

```css
#gallery { position: absolute }
.tile { position: absolute; transition: transform 800ms ease }
.tile:hover { transform: scale(1.1) }
.tile:hover > img { opacity: 1; transform: scale(1.01) }
.tile > img { opacity: 0; transition: opacity 800ms ease, transform 800ms ease }
.tile:nth-child(1) { top: 5% }
.tile:nth-child(2) { top: 12% }
.tile:nth-child(3) { top: 34% }
.tile:nth-child(4) { top: 48% }
.tile:nth-child(5) { top: 70% }
.tile:nth-child(6) { top: 8% }
.tile:nth-child(7) { top: 74% }
```

```js
.animate({
```

### [Bootstrap cards](https://codepen.io/Ericode7/pen/EdQBPm)

on hover of div.card: a.card-link: opacity+color | made with: :hover

```css
h2 { margin-bottom: 30px; margin-top: 0 }
.avatar-bordered { box-shadow: 0 1px 2px rgba(0,0,0,0.2) }
.card { position: relative; margin-bottom: 20px }
.card-user { position: absolute; top: 10px }
.card-category { position: absolute; top: 10px }
.card-description { position: absolute; bottom: 10px }
.card-link { position: absolute; top: 0; bottom: 0; opacity: 0 }
.card-link:hover { opacity: 0.1 }
.features h2 { margin-bottom: 10px }
```

### [Hamburger Menu Icon Transition using css | Transforming hamburger menu](https://codepen.io/Bilal1909/pen/KKdrmRP)

on scroll: div.: transform+top | made with: transition · :hover

```css
.center { top: 50%; transform: translate(-50%, -50%); position: absolute }
.center:before, .center:after, .center div { transition: 0.5s }
.center:hover:before { transform: translateY(12px) rotate(135deg) }
.center:hover:after { transform: translateY(-12px) rotate(-135deg) }
.center:hover div { transform: scale(0) }
```

### [Rocket Loader Pure CSS](https://codepen.io/kh-mamun/pen/xQdWBy)

on scroll: div.rocket: transform+top, div.rocket-extras: transform+top, span.: transform+opacity+filter+top | made with: @keyframes

```css
.rocket-loader { -webkit-animation: moveParticles 6s linear infinite; animation: moveParticles 6s linear infinite; box-shadow: inset 0 0 60px 0 rgba(0, 0, 0, 0.1); position: absolute; top: 50%; transform: translate(-50%, -50%) }
.rocket-loader::before { -webkit-animation: blink 1s infinite; animation: blink 1s infinite; bottom: 6%; position: absolute }
.rocket { -webkit-animation: moveRocket 2s linear infinite; animation: moveRocket 2s linear infinite; position: absolute; top: 50%; transform: translate(-50%, -50%) }
.rocket::before, .rocket::after { position: absolute }
.rocket::before { -webkit-animation: rotateFins 1s infinite; animation: rotateFins 1s infinite; top: 50%; transform: translate(0, -50%) }
.rocket::after { top: 2px }
.rocket-extras { -webkit-animation: moveExtras 1s infinite; animation: moveExtras 1s infinite; position: absolute; top: 50%; transform: translate(0, -50%) }
.rocket-extras::before, .rocket-extras::after { position: absolute }
.rocket-extras::before { top: -1px }
.rocket-extras::after { border-top: 1px solid #660000; top: 1px }
0%, 100% { transform: translate(-50%, calc(-50% - 1rem)) }
50% { transform: translate(-50%, calc(-50% + 1rem)) }
```

### [Superstar DJ v3.0 w/ ScrollTrigger 😎 (Scroll to scratch!)](https://codepen.io/anon/pen/RwraKYZ)

held: fixed svg.[object, fixed div.genre-switch, fixed label | on scroll: g.[object: transform ×2, g.[object: transform+top | made with: position: fixed · transition · clip-path · custom properties driven by JS · GSAP · ScrollTrigger

```css
:root { --knob-top: #262626; --arm-top: #666 }
body { transition: background 0.25s ease }
h1 { position: absolute; top: calc(50% - (var(--size) * 0.5vmin)); transform: translate(-50%, -200%); transition: color 0.25s }
.record-player { position: fixed; top: 50%; transform: translate(-50%, -50%) }
.record__label { transition: fill 0.25s ease }
label { position: fixed; bottom: 1rem }
label > svg { position: absolute; top: 0 }
.genre-switch { position: fixed; top: calc(50% + (var(--size) * 0.5vmin)); transform: translate(-50%, -50%); margin-top: 4rem }
.genre-switch:after { position: absolute; top: 50%; transform: translate(-50%, -50%); -webkit-clip-path: polygon(0 0, 100% 0, 50% 100%); clip-path: polygon(0 0, 100% 0, 50% 60%) }
select { transition: border 0.25s ease, color 0.25s ease }
```

```js
gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.create({
gsap.to(currentTrack, { playbackRate: 1 })
style.setProperty( "--hue",
```

### [3D Cards](https://codepen.io/mubangadv/pen/YzJNbOa)

on scroll: div.image: transform ×2, div.shadow: transform+top, div.content: transform+top | on hover of div.card: div.image: transform ×4, div.shadow: transform+top, div.content: transform+top, div.shadow: transform, div.content: transform | made with: mask · 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking

```css
.card { position: relative; perspective: 50rem }
.card .shadow { position: absolute; inset: 0; background-position: center; opacity: 0.8; filter: blur(2rem) saturate(0.9); box-shadow: 0 -1.5rem 2rem -0.5rem rgba(0, 0, 0, 0.7); transform: rotateX(var(--rotateX)) rotateY(var(--rotateY)) }
.card .image { position: absolute; inset: 0; background-position: center; -webkit-mask-image: var(--url); mask-image: var(--url); -webkit-mask-size: cover; mask-size: cover; -webkit-mask-position: center; mask-position: center }
.card .image.background { transform: rotateX(var(--rotateX)) rotateY(var(--rotateY)) translate3d(0, 0, 0rem) }
.card .image.cutout { transform: rotateX(var(--rotateX)) rotateY(var(--rotateY)) translate3d(0, 0, 4rem) scale(0.92) }
.card .content { position: absolute; inset: 0; transform: rotateX(var(--rotateX)) rotateY(var(--rotateY)) translate3d(0, 0, 6rem) }
.card::after, .card::before { position: absolute; inset: 1.5rem; transform: rotateX(var(--rotateX)) rotateY(var(--rotateY)) translate3d(0, 0, 2rem) }
.card.border-bottom-behind::before { border-bottom: transparent }
h2 { margin-bottom: 0.5rem }
```

```js
addEventListener("mousemove", (event) => {
style.setProperty("--rotateY", x + "deg")
style.setProperty("--rotateX", y + "deg")
```

### [Vector/ Project Selection](https://codepen.io/Adir-SL/pen/zYKXEPK)

made with: transition · :hover · clip-path

```css
.selectWrapper { position: relative; opacity: 0; transition: opacity 100ms linear 0s; filter: drop-shadow(0 6px 26px rgba(0, 0, 0, 0.24)); padding-top: calc(var(--sizeVar) / 2) }
.multiSelect { -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%); clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%); position: absolute; transition: transform 300ms ease-in-out 0s, -webkit-clip-path 300ms ease-in-out 0s; tr }
.bottomBorder { border-bottom: 1px solid var(--borderColor) }
.topBorder { border-top: 1px solid var(--borderColor) }
.justHover i { opacity: 0 }
.justHover:hover i { opacity: 1 }
.multiSelect .narrow { padding-top: 10px; padding-bottom: 10px }
.multiSelect { transform: translateX(100%); -webkit-clip-path: polygon(0 0, 0 0, 0 100%, 0% 100%); clip-path: polygon(0 0, 0 0, 0 100%, 0% 100%) }
.multiSelect:nth-of-type(1) { transform: translateX(0); -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%); clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%) }
button { box-shadow: 0 0 0 1px var(--borColor) inset }
```

### [CSS smooth scrolling is "cancelable" while JS is not](https://codepen.io/anon/pen/NWRmxGa)

held: fixed div.bar | made with: position: fixed · scroll() timeline

```css
.bar { position: fixed; bottom: 0 }
```

### [Motion blur effect using SVG filters](https://codepen.io/damianmuti/pen/MvYPPa)

held: fixed button.slick-prev, fixed button.slick-next | on hover of button.slick-prev: button.slick-prev: opacity | made with: position: fixed · @keyframes · transition · :hover

```css
.slick-track { will-change: transform }
.slick-list { will-change: transform }
.slick-slide { filter: drop-shadow(0px 10px 40px rgba(0, 0, 0, 0.55)) }
[type=button] { position: fixed; top: 50%; background-position: center; opacity: 0.9; transform: translateY(-50%); transition: all 0.25s ease }
[type=button]:hover { opacity: 1 }
0% { filter: url(#blur0); transform: scale(1, 1) }
15% { filter: url(#blur1); transform: scale(1, 0.98) }
30% { filter: url(#blur2); transform: scale(1, 0.93) }
45% { filter: url(#blur3); transform: scale(1.1, 0.9) }
60% { filter: url(#blur4); transform: scale(1.2, 0.88) }
75%, 100% { filter: url(#blur5); transform: scale(1.35, 0.85) }
0% { filter: url(#blur0); transform: scale(1, 1) }
```

### [Bootstrap 5 mobile card slider agenda Swiper.js with dark mode](https://codepen.io/design007/pen/GRmdWRB)

on hover of button.btn: button.btn: background | made with: transition · :hover

```css
.btn-archive { -webkit-transition: all 0.3s linear 0s; transition: all 0.3s linear 0s }
.btn-archive:focus { -webkit-box-shadow: 0 0 0 0.25rem var(--bg-button-focus); box-shadow: 0 0 0 0.25rem var(--bg-button-focus) }
.custom-slider { -webkit-transition: all 0.3s linear 0s; transition: all 0.3s linear 0s }
.custom-slider .title-section { text-transform: uppercase }
.custom-slider .swiper-container .card.box-4 .card-header { border-bottom: 0 }
.custom-slider .swiper-container .card.box-4 .card-header .fa-map-marker-alt.gro { transition: all 0.2s ease-in-out }
.custom-slider .swiper-container .card.box-4 .card-header .fa-map-marker-alt.gro { transform: scale(1.5) }
.custom-slider .swiper-container .card.box-5 .card-header { border-bottom: 0 }
.custom-slider .swiper-container .card.box-5 .card-footer .fa-map-marker-alt.gro { transition: all 0.2s ease-in-out }
.custom-slider .swiper-container .card.box-5 .card-footer .fa-map-marker-alt.gro { transform: scale(1.5) }
```

### [Creative Section Design](https://codepen.io/uiswarup/pen/ExjrZzV)

made with: @keyframes · transition · :hover

```css
body { top: 0 }
.listar-map-button { position: absolute; top: 0 }
.listar-page-header-content .listar-map-button-text span { position: relative; box-shadow: 0 0 300px rgba(0, 0, 0, 0.65), 0 0 30px rgba(0, 0, 0, 0.06) }
header .footer-wave { bottom: -67px; animation: wave 10s cubic-bezier(0.44, 0.66, 0.67, 0.37) infinite }
0% { background-position: 0 }
100% { background-position: 1440px }
.listar-feature-item-wrapper { margin-bottom: 120px }
.listar-feature-item.listar-feature-has-link ~ .listar-feature-fix-bottom-paddin { position: relative }
.listar-feature-item a { position: absolute; top: -12px }
.listar-feature-with-image .listar-feature-item a:before { position: absolute; top: -74px }
.listar-feature-item a:after { position: absolute; bottom: -7px; animation: ripple 0.7s linear infinite; box-shadow: 5px 5px 10px rgba(163, 177, 198, 0.6), -5px -5px 10px rgba(255, 255, 255, 0.5) }
0% { box-shadow: 0 0 0 0 rgba(163, 177, 198, 0.3), 0 0 0 1em rgba(163, 177, 198, 0.3), 0 0 0 3em rgba(163, 177, 198, 0.03), 0 0 0 5em rgba(163, 177, 198, 0.01) }
```

### [Glass modal tailwind](https://codepen.io/avbqicvt-the-sasster/pen/dyaBvYr)

held: fixed div.fixed, fixed div.fixed, fixed div.fixed | made with: backdrop-filter

### [Tooltip with Tailwind CSS and JavaScript](https://codepen.io/frankuxui/pen/rNPJENJ)

on hover of button.flex: div.tooltip: transform+top | made with: transition

```css
.tooltip { position: absolute }
footer { margin-top: auto }
footer .footer-link { transition: all 0.3s ease-in-out }
```

```js
addEventListener("mouseenter", event => {var _document, _document$body, _event$target
addEventListener("mouseleave", () => {
```

### [✅😅 Stacking Cards (WAAPI + ScrollTimeline 2022 Version)](https://codepen.io/bramus/pen/XWEeGZm)

held: fixed input, sticky li.card, sticky li.card, sticky li.card, sticky li.card, fixed div.warning, fixed dialog.sda_update | made with: position: sticky · position: fixed · scroll() timeline · Web Animations API (.animate)

```css
:root { --card-top-offset: 1em }
#cards { padding-bottom: calc(var(--numcards) * var(--card-top-offset)); margin-bottom: var(--card-margin) }
.card { position: sticky; top: 0; padding-top: var(--card-top-offset); will-change: transform }
#debug { position: fixed; top: 1em }
.card__content { box-shadow: 0 0.2em 1em rgba(0, 0, 0, 0.1), 0 1em 2em rgba(0, 0, 0, 0.1) }
aside p { margin-bottom: 1em }
.warning { position: fixed; bottom: 1em }
.warning > :first-child { margin-top: 0 }
.warning > :last-child { margin-bottom: 0 }
```

```js
.animate( {
```

### [Image gallery v2 - 4 - custom CSS](https://codepen.io/smashingmag/pen/jOJNgXM)

held: fixed aside.overlay | made with: position: fixed · view transitions

```css
::view-transition-image-pair(root) { animation-duration: 400ms; animation-timing-function: ease-in-out }
::view-transition-group(active-image) { animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1) }
.gallery__image--active { view-transition-name: active-image }
figure { box-shadow: 5px 5px 0 1px #111 }
figure div { position: relative; background-position: 50% 50% }
.overlay { position: fixed }
.gallery__image { object-position: 50% 50% }
```

```js
startViewTransition(() => moveImageToModal(image))
startViewTransition(() =>
```

### [Untitled](https://codepen.io/bramus/pen/XJJGNRN/834e41c3983688a374374b4b5ca0282f)

on scroll: div.box: transform+shadow+top, div.box-content: transform+shadow+top | made with: @keyframes · transition · :hover · :has() · 3D (perspective / preserve-3d)

```css
.box { animation: animate-border-radius 2s ease infinite alternate-reverse }
.threedee { perspective: 100vh }
.threedee, .threedee * { transition: transform 0.5s ease }
> * { transform: translate3d(2em, -2em, 1.5em); box-shadow: -1vh 1vh 2em rgb(0 0 0 / 0.25) }
@keyframes animate-border-radius animates border-radius
```

### [Mobile Menu Concept](https://codepen.io/kylelavery88/pen/WdmVJL)

made with: position: fixed · transition

```css
body:before { position: fixed; top: -50px }
body:after { position: fixed; bottom: -50px }
.hero__wrapper:before { position: fixed; bottom: 50px }
.hero__phone { position: relative }
.hero__phone:before { position: absolute; top: 0; transform: translatex(-50%) }
.hero__phone:after { position: absolute; bottom: 6px; transform: translatex(-50%) }
.menu__button { box-shadow: 0 2px 40px -10px var(--color); position: absolute; bottom: 30px; transform: translate3d(var(--x), var(--y), var(--z)); transition: 0.15s cubic-bezier(0.33, 1, 0.53, 1) }
.menu__button div div { box-shadow: 0 4px 0 var(--light), 0 -4px 0 var(--light) }
.menu__overlay { position: absolute }
.menu__body { padding-bottom: 15px; box-shadow: 0px -9px 50px -30px black; position: absolute; bottom: 0; transform: translate3d(var(--x), var(--y), var(--z)); transition: 0.2s cubic-bezier(0.33, 1, 0.53, 1) }
.menu__body > *:not(:last-child) { border-bottom: 2px solid var(--neutral) }
.menu__header label div { position: relative; transform: rotate(5.5rad) }
```

### [Pure CSS Minimal Toggle](https://codepen.io/raubaca/pen/BjGKde)

made with: transition · :has()

```css
:root { --transition: all 0.3s ease-in-out }
body { transition: var(--transition) }
input[type=checkbox] { position: absolute; opacity: 0 }
.check-trail { transition: var(--transition) }
.check-handler { position: relative; transition: var(--transition); box-shadow: 0 0 8px rgba(0, 0, 0, 0.3) }
.check-handler::before, .check-handler::after { position: absolute; transition: var(--transition) }
.check-handler::before { transform: rotate(45deg) }
.check-handler::after { transform: rotate(-45deg) }
input[type=checkbox]:checked + .check-trail .check-handler::before { transform: rotate(45deg) translate(0.25rem, -0.25rem) }
input[type=checkbox]:checked + .check-trail .check-handler::after { transform: rotate(-45deg) translate(-0.5rem, -0.25rem) }
```

### [Smooth Accordion using Alpine.js (w/ x-for) + Tailwind CSS](https://codepen.io/hmaesta/pen/MWKoGEm)

made with: nothing recognised — read the code

### [Product card](https://codepen.io/olhilton/pen/dXaqxE)

made with: transition · :hover

```css
.wrapper { position: relative; box-shadow: 0; transform: scale(0.95); transition: box-shadow 0.5s, transform 0.5s }
.wrapper:hover { transform: scale(1); box-shadow: 5px 20px 30px rgba(0, 0, 0, 0.2) }
.wrapper .container .bottom { transition: transform 0.5s }
.wrapper .container .bottom.clicked { transform: translateX(-50%) }
.wrapper .container .bottom .left { position: relative }
.wrapper .container .bottom .left .buy { transition: background 0.5s }
.wrapper .container .bottom .left .buy i { transition: transform 0.5s }
.wrapper .container .bottom .left .buy:hover i { transform: translateY(5px) }
.wrapper .container .bottom .right .done { transition: transform 0.5s }
.wrapper .container .bottom .right .remove { transition: transform 0.5s, background 0.5s }
.wrapper .container .bottom .right .remove:hover i { transform: translateY(5px) }
.wrapper .container .bottom .right .remove i { transition: transform 0.5s }
```

### [Signs](https://codepen.io/antoniasymeonidou/pen/OJjYzGE)

on scroll: i.far: color ×2, i.fa: transform+top ×2 | made with: @keyframes · transition · :hover

```css
.center { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.check { box-shadow: 9px 9px 18px #262c3e, -9px -9px 18px #30384e }
.check:hover { transition:0.5s }
.color { animation: color 2s linear infinite }
.info { box-shadow: 9px 9px 18px #262c3e, -9px -9px 18px #30384e }
.spin { animation: spin 2s linear infinite }
.info:hover { transition:0.5s }
.warning { box-shadow: 9px 9px 18px #262c3e, -9px -9px 18px #30384e }
.warning:hover { transition:0.5s }
.rotate { animation: rotate 2s linear infinite }
.danger { box-shadow: 9px 9px 18px #262c3e, -9px -9px 18px #30384e }
.danger:hover { transition:0.5s }
```

### [Mobile Nav](https://codepen.io/shieldsma91/pen/zLpbLX)

made with: transition · :hover

```css
a { opacity:1; transition: 200ms }
a:hover { opacity:0.5 }
.container { margin-top: 50px }
.phone { box-shadow: 30px 50px 100px #85888C }
#menuToggle { position: relative; top: 25px }
#menuToggle input { position: absolute; opacity: 0 }
#menuToggle span { margin-bottom: 5px; position: relative; transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0), background 0.5s cubic-bezier(0.77,0.2,0.05,1.0), opacity 0.55s ease }
#menuToggle input:checked ~ span { opacity: 1; transform: rotate(45deg) translate(-3px, -1px) }
#menuToggle input:checked ~ span:nth-last-child(3) { opacity: 0; transform: rotate(0deg) scale(0.2, 0.2) }
#menuToggle input:checked ~ span:nth-last-child(2) { transform: rotate(-45deg) translate(0, -1px) }
#menu { position: absolute; box-shadow: 0 0 10px #85888C; padding-top: 125px; transform: translate(-100%, 0); transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0) }
#menuToggle input:checked ~ ul { transform: none }
```

### [CSS Parallax Hero](https://codepen.io/hexagoncircle/pen/OJyPygv)

made with: 3D (perspective / preserve-3d)

```css
.caption { position: absolute; bottom: 1rem }
.parallax-wrapper { perspective: 10px }
.parallax-content { position: relative }
.hero { position: relative }
.hero img { position: absolute; top: 0; transform: translateZ(1px) }
.hero .hero__title { transform: translateZ(-2px) scale(1.2) }
.hero .hero__title p { margin-top: 0.5rem }
.hero::after { position: absolute; top: 50%; transform: translateZ(8px) }
.main-content { position: relative }
.main-content > * + * { margin-top: 2rem }
.scroll-icon-container { position: absolute; top: calc(var(--size) * -1); box-shadow: 0 6px 12px -3px rgba(0, 0, 0, 0.1) }
```

### [infinite on top](https://codepen.io/andyfitz/pen/dyqmBoO)

made with: @keyframes · 3D (perspective / preserve-3d)

```css
.fbottom { stroke-opacity: 0.3 }
.ll { animation: loop 3s linear infinite }
.finny { animation: rot 36s linear infinite }
.shad { animation: raise 3s linear infinite }
.shad.odd { animation-delay: -1.5s }
0%, 20% { opacity: 1 }
30%, 70% { opacity: 0 }
80%, 100% { opacity: 1 }
.ll { animation-delay: -1.5s }
.finny { perspective: 500px }
.clip-shadow { opacity: 0.3 }
@keyframes raise animates opacity
```

### [React signup form example](https://codepen.io/mikepro4/pen/pvKYZG)

made with: @keyframes · transition · :hover · mask

```css
sup { vertical-align: text-top }
sub { vertical-align: text-bottom }
sub, sup { position: relative }
sup { top: -0.5em }
sub { bottom: -0.25em }
textarea { vertical-align: top }
.hidden { opacity: 0 }
a { -webkit-transition: color 0.3s ease-in-out; -moz-transition: color 0.3s ease-in-out; -ms-transition: color 0.3s ease-in-out; -o-transition: color 0.3s ease-in-out; transition: color 0.3s ease-in-out }
.input_group { position: relative; margin-bottom: 10px }
.input_group { margin-bottom: 0 }
.input_group label.input_label { top: 0; position: absolute }
.input_group input.input { position: relative; -webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; -webkit-transition: all 0.7s ease-in-out; -moz-transition: all 0.7s ease-in-out; -ms-transition: all 0.7s ease-in-out; -o-transition: }
```

### [CodePen Challenge: Menu](https://codepen.io/cobra_winfrey/pen/oyMaKr)

on hover of li.menu-item: a.: color | made with: @keyframes · transition · :hover · clip-path · 3D (perspective / preserve-3d)

```css
body { perspective: 700px }
body nav { position: absolute }
body nav ol { transition: all 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275) }
body nav ol li { position: relative; transition: all 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275) }
body nav ol li:hover ol:before { position: absolute; bottom: -30px; transform: rotate(45deg) scale(0.5); animation: clipin 0.4s ease-in 1 forwards; animation-delay: 0.2s; -webkit-clip-path: polygon(35% 35%, 35% 0, 35% 0, 35% 35%, 0 35%, 0 35%); clip-pat }
body nav ol li:hover li { position: relative }
body nav ol li:hover li:before { position: absolute; top: -15px; transform: rotate(-45deg) scale(0.5); animation: clipin 0.4s ease-in 1 forwards; -webkit-clip-path: polygon(35% 35%, 35% 0, 35% 0, 35% 35%, 0 35%, 0 35%); clip-path: polygon(35% 35%, 35% 0 }
0% { -webkit-clip-path: polygon(35% 35%, 35% 0, 35% 0, 35% 35%, 0 35%, 0 35%); clip-path: polygon(35% 35%, 35% 0, 35% 0, 35% 35%, 0 35%, 0 35%) }
50% { -webkit-clip-path: polygon(35% 35%, 35% 0, 35% 0, 35% 35%, 0 35%, 0 35%); clip-path: polygon(35% 35%, 35% 0, 35% 0, 35% 35%, 0 35%, 0 35%) }
75% { -webkit-clip-path: polygon(35% 35%, 35% 0, 100% 0, 100% 100%, 0 100%, 0 35%); clip-path: polygon(35% 35%, 35% 0, 100% 0, 100% 100%, 0 100%, 0 35%) }
100% { -webkit-clip-path: polygon(100% 100%, 100% 0, 100% 0, 100% 100%, 0 100%, 0 100%); clip-path: polygon(100% 100%, 100% 0, 100% 0, 100% 100%, 0 100%, 0 100%) }
body nav ol li ol:after { position: absolute; padding-top: 40px; top: 0; transform: rotate(-90deg); transition: all 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275) }
```

### [404 on CodePen](https://codepen.io/bramus/pen/myyoyPW)

made with: nothing recognised — read the code

### [Hover reveal animation using mask V](https://codepen.io/smashingmag/pen/jOQJgxN)

made with: transition · :hover · mask

```css
img { -webkit-mask: linear-gradient(#000 0 0), conic-gradient(from 135deg,#0000 25%,#000 0) var(--g), conic-gradient(from -45deg,#0000 25%,#000 0) var(--g); -webkit-mask-composite: xor,source-over; mask-composite: exclude,add; }
img:hover { -webkit-mask-position: top,bottom }
```

### [Navigation stacked clip-path animation](https://codepen.io/Sidstumple/pen/vYWrrem)

held: fixed div.header__top, fixed nav.header__nav | made with: position: fixed · transition · :hover · clip-path · GSAP

```css
.header__top { position: fixed }
.header__trigger { position: relative }
.header__trigger::before, .header__trigger::after { position: absolute; top: 0; transition: transform 1s cubic-bezier(0.17, 0.67, 0, 1), background-color 0.4s ease-out }
.header__trigger::before { transform: translateY(10px) }
.header__trigger::after { transform: translateY(17px) }
.header__trigger.open::before { transform: translateY(14px) rotate(45deg) scale(0.85) }
.header__trigger.open::after { transform: translateY(14px) rotate(-45deg) scale(0.85) }
.header__nav { position: fixed; transform: translateY(-101%); transition: transform 0s 0.9s; -webkit-clip-path: polygon(0 0, 0 var(--panel-bottom-1), 25% var(--panel-bottom-1), 25% 0, 25% 0, 25% var(--panel-bottom-2), 50% var(--panel-b }
.header__nav.open { transform: translateY(0); transition: transform 0s }
.header__item { transition: font-variation-settings 1s cubic-bezier(0.17, 0.67, 0, 1) }
.header__item + .header__item { margin-top: 0.35em }
.fake-content p:first-of-type { margin-top: 1.5em }
```

### [Skeuomorphic Toggle Switch (vol. 1)](https://codepen.io/nicolasjesenberger/pen/BaOVdwE)

held: fixed a._twitter-link | made with: nothing recognised — read the code

```css
.switch-container { position: relative; box-shadow: 0 0.125em 0.25em rgba(0, 0, 0, 0.2) }
.switch-input { position: absolute; opacity: 0 }
.switch-button { box-shadow: inset 0 0 0.5em rgba(0, 0, 0, 0.4) }
.switch-button-inside { position: relative; transform: translateX(-0.375em); box-shadow: inset 0.0625em 0 0.0625em rgba(255, 255, 255, 0.4), inset -0.0625em 0 0.0625em rgba(255, 255, 255, 0.4); transition-property: transform }
.switch-button-inside::after { position: absolute; inset: 0; box-shadow: inset 0.0625em 0 0.0625em rgba(255, 255, 255, 0.2), inset -0.0625em 0 0.0625em rgba(255, 255, 255, 0.2); opacity: 0; transition-property: opacity }
.switch-input:checked + .switch-button > .switch-button-inside { transform: translateX(0.375em) }
.switch-input:checked + .switch-button > .switch-button-inside::after { opacity: 1 }
.switch-icon { filter: drop-shadow(0 0.0625em 0.0625em rgba(0, 0, 0, 0.4)) drop-shadow(0 0 0.25em rgba(255, 255, 255, 0.4)) drop-shadow(0 0 0.25em rgba(255, 255, 255, 0.4)) }
.switch-input:checked + .switch-button .switch-icon.off { filter: none }
.switch-input:not(:checked) + .switch-button .switch-icon.on { filter: none }
```

### [App Navs with Tailwind CSS](https://codepen.io/robstinson/pen/dyqdVRX)

made with: :hover

### [DailyUI #019 - Leaderboard](https://codepen.io/supah/pen/WwrJpw)

held: fixed a.the-most | made with: position: fixed · transition · :hover

```css
.leaderboard { position: absolute; top: 50%; transform: translate(-50%, -50%); box-shadow: 0 7px 30px rgba(62, 9, 11, 0.3) }
.leaderboard h1 svg { position: relative; top: 3px }
.leaderboard ol li { position: relative; transform: translateZ(0) scale(1, 1) }
.leaderboard ol li::before { position: absolute; top: 15px }
.leaderboard ol li mark { position: absolute; top: 0 }
.leaderboard ol li mark::before, .leaderboard ol li mark::after { position: absolute; bottom: -11px; border-top: 10px solid #c24448; transition: all 0.1s ease-in-out; opacity: 0 }
.leaderboard ol li small { position: relative }
.leaderboard ol li::after { position: absolute; top: 0; box-shadow: 0 3px 0 rgba(0, 0, 0, 0.08); transition: all 0.3s ease-in-out; opacity: 0 }
.leaderboard ol li:nth-child(2)::after { box-shadow: 0 2px 0 rgba(0, 0, 0, 0.08) }
.leaderboard ol li:nth-child(2) mark::before, .leaderboard ol li:nth-child(2) ma { border-top: 6px solid #ba4741; bottom: -7px }
.leaderboard ol li:nth-child(3)::after { box-shadow: 0 1px 0 rgba(0, 0, 0, 0.11) }
.leaderboard ol li:nth-child(3) mark::before, .leaderboard ol li:nth-child(3) ma { border-top: 2px solid #b0433f; bottom: -3px }
```

### [Rainbow spinner](https://codepen.io/ig0ramad0/pen/HwJgr)

on scroll: div.loader: transform+top | made with: @keyframes

```css
body { position: absolute; top: 50%; margin-top: -50px }
.loader { position: relative; animation: spin 1s infinite linear }
.loader .spinner { position: absolute; top: 0 }
.loader .spinner.orange { transform: rotate(-45deg) }
.loader .spinner.red { transform: rotate(-90deg) }
.loader .spinner.pink { transform: rotate(-135deg) }
.loader .spinner.violet { transform: rotate(-180deg) }
.loader .spinner.mauve { transform: rotate(-225deg) }
.loader .spinner.light-yellow { transform: rotate(-270deg) }
from { transform: rotate(0deg) }
to { transform: rotate(-360deg) }
@keyframes spin animates transform
```

### [Open / Close button animation](https://codepen.io/JeromeRenders/pen/GqjxVL)

made with: @keyframes · transition · :hover

```css
h1, h2 { position: absolute; transform: translateX(-50%); text-transform: uppercase }
h1 { top: 24px }
h2 { top: 44px; opacity: 0.7 }
#btn { position: absolute; top: 50%; transform: translate(-50%, -50%) }
#btn span { position: absolute; top: 50%; transition: all 0.3s linear }
#btn span::before { position: absolute; top: 0; transition: all 0.3s linear }
#btn span:nth-child(1) { animation: span-first-off 0.5s ease-in-out; animation-fill-mode: forwards }
#btn span:nth-child(2) { animation: span-second-off 0.5s ease-in-out; animation-fill-mode: forwards }
#btn span:nth-child(3) { animation: span-third-off 0.5s ease-in-out; animation-fill-mode: forwards }
#btn.on:hover span::before { transition: all 0.3s linear }
#btn.on span:nth-child(1) { animation: span-first-on 0.5s ease-in-out; animation-fill-mode: forwards }
#btn.on span:nth-child(2) { animation: span-second-on 0.5s ease-in-out; animation-fill-mode: forwards }
```

### [Raise the curtains](https://codepen.io/anon/pen/YzEERmQ)

held: sticky div.invert | made with: position: sticky · mix-blend-mode

```css
.invert { position: sticky; top: 20px; mix-blend-mode: difference }
```

### [Badge animations](https://codepen.io/samratambadekar/pen/NWxxjWR)

on scroll: div.animated_star: transform+opacity+top ×5, path.[object: transform+opacity+top ×4, div.animated_star: transform ×2, g.[object: transform+opacity+top ×2, div.animated_badge: transform+opacity+top | made with: @keyframes

```css
.intro { margin-top: 32px }
.badges .animated_badge_svg { position: relative }
.badges .animated_badge { position: relative; box-shadow: 0px 2px 4px rgba(25, 35, 49, 0.02), 0px 24px 32px rgba(25, 35, 49, 0.08), 0px 4px 40px rgba(0, 0, 0, 0.12); animation: fade-in-top 1.5s ease forwards; will-change: transform, opacity; opac }
.badges .animated_badge::before { position: absolute; top: 19px; opacity: 0; animation: fade-in 1.5s ease forwards; will-change: transform, opacity }
.badges .animated_badge .badge_ribbon { opacity: 0; transform: translate(-5px, -10px) rotate(75deg) scale(0.5); animation: badge-ribbon-left-animation 1s 0.5s ease forwards; will-change: transform, opacity }
.badges .animated_badge .badge_ribbon.right { opacity: 0; transform: translate(5px, -10px) rotate(-75deg) scale(0.5); animation: badge-ribbon-right-animation 1s 0.5s ease forwards; will-change: transform, opacity }
.badges .animated_stars { position: absolute; top: 0 }
.badges .animated_stars .animated_star { position: absolute; opacity: 0; animation: star-animation 0.6s 1s ease forwards; will-change: transform, opacity }
.badges .animated_stars .animated_star:nth-of-type(1) { top: 26px; animation-delay: 1s }
.badges .animated_stars .animated_star:nth-of-type(2) { top: 14px; animation-delay: 1.05s }
.badges .animated_stars .animated_star:nth-of-type(3) { top: -12px; animation-delay: 1.1s }
.badges .animated_stars .animated_star:nth-of-type(4) { top: 9px; animation-delay: 1.15s }
```

### [Easy Scroll Snapping Carousel (Flexbox Layout / Grid Layout)](https://codepen.io/bramus/pen/XWWbGYO)

made with: scroll-snap

```css
.scroll-container { scroll-snap-type: x mandatory }
.scroll-item { scroll-snap-align: center }
```

### [Color scheme switcher with :has()](https://codepen.io/seyedi/pen/MWxKKoZ)

on scroll: section.paper: transform+shadow+top ×2 | made with: transition · :has()

```css
select { transition: .1s all }
```

### [Detecting Scroll Directionality with Scroll-Driven Animations (DEBUG, v2)](https://codepen.io/bramus/pen/VwqOqwQ)

held: fixed div | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · transition · requestAnimationFrame

```css
to { --scroll-position: 1 }
:root { animation: adjust-pos linear both; animation-timeline: scroll(root) }
body { transition: --scroll-position-delayed 0.15s linear }
[data-id="--scroll-position"]::after { content: "--scroll-position: " counter(scroll-position) }
@keyframes adjust-pos animates --scroll-position, --scroll-position-delayed
```

```js
requestAnimationFrame(update)
```

### [Jelly download button](https://codepen.io/andreasstorm/pen/GMgXRO)

held: fixed a.credit | on scroll: div.btn-circle-download: background | made with: position: fixed · @keyframes · transition · :hover

```css
.btn-circle-download { position: relative; transition: all 0.2s ease }
.btn-circle-download:after { position: relative; transform: translateX(-100%) }
.btn-circle-download svg#border { position: absolute; top: 0; transition: all 0.9s linear }
.btn-circle-download svg#arrow { position: absolute; top: 14px; transition: all 0.2s ease }
.btn-circle-download svg#check { position: absolute; top: 17px; transform: scale(0) }
.btn-circle-download.done { animation: rubberBand 0.8s }
.btn-circle-download.done:after { transform: translateX(50%); transition: transform 0.4s ease }
.btn-circle-download.done #check { transform: scale(1); transition: all 0.2s ease }
from { transform: scale(1, 1, 1) }
30% { transform: scale3d(1.15, 0.75, 1) }
40% { transform: scale3d(0.75, 1.15, 1) }
50% { transform: scale3d(1.1, 0.85, 1) }
```

### [Animated Underline Hover](https://codepen.io/jstn/pen/mdoOZJ)

made with: transition · :hover

```css
li { position: relative }
a { text-transform: uppercase; position: relative }
a:after { bottom: 0; position: absolute; transition: width 0.3s ease 0s, left 0.3s ease 0s }
ul { margin-top: 40px }
```

### [CSS-Only Footer Reveal Effect for Web Pages](https://codepen.io/hkdc/pen/BLJAVL)

held: fixed footer | made with: position: fixed

```css
footer { position: fixed; bottom: 0 }
body { margin-bottom: 200px }
```

### [Growing buttons with calc-size()](https://codepen.io/web-dot-dev/pen/bGPPBoV)

on scroll: a.: background+color+top, svg.[object: color+top, path.[object: color+top, span.text: color+top | on hover of li.: a.: background+color ×2, svg.[object: color ×2, path.[object: color ×2, span.text: color ×2 | made with: position: fixed · transition · :hover · :focus-visible

```css
html::before { position: fixed; inset: 0 }
```

### [Progress Bar](https://codepen.io/theprogrammingexpert/pen/jOqGBLL)

made with: transition

```css
.progress-container .progress { transition: width 0.4s ease }
```

### [cuboid button](https://codepen.io/inescodes/pen/mdowLzp)

made with: transition · :hover

```css
.btn { position: relative; text-transform: uppercase }
.btn::before, .btn::after { position: absolute; top: 0; transition: 250ms all ease }
.btn::before { transform: translate(-1rem, -1rem) }
.btn__inner::before, .btn__inner::after { position: absolute; top: -0.5rem; transform: translateX(var(--translateX, 0)) skewY(var(--skewY, 45deg)); transition: 250ms all }
.btn__text { position: relative; transition: 250ms all ease }
.btn:hover::before { transform: translate(1rem, -1rem) }
.btn:active::after { transform: translate(0.5rem, -0.5rem) }
.btn:active .btn__inner::before, .btn:active .btn__inner::after { transform: translate(1.5rem, calc(-0.25rem - 2px)) skewy(-45deg) }
.btn:active .btn__text { transform: translate(0.5rem, -0.5rem) }
```

### [The Spinner II](https://codepen.io/t_afif/pen/yLMXBRL)

on scroll: div.spinner-1: transform+top, div.spinner-3: transform+top, div.spinner-4: transform+top, div.spinner-5: transform+top, div.spinner-6: transform+top, div.spinner-7: transform+top | made with: @keyframes · clip-path · mask · mix-blend-mode

```css
.spinner-1 { animation: s1 1s infinite linear }
100% { transform: rotate(1turn) }
.spinner-2::before, .spinner-2::after { animation: s2 1s infinite }
.spinner-2::before { filter: hue-rotate(45deg); animation-timing-function: linear }
100% { transform: rotate(.5turn) }
.spinner-3 { -webkit-mask: radial-gradient(farthest-side,#0000 calc(100% - 8px),#000 0); animation: s3 1s infinite linear }
100% { transform: rotate(1turn) }
.spinner-4 { animation: s4 4s infinite }
.spinner-4::before, .spinner-4::after { mix-blend-mode: darken; animation: s4 1s infinite linear }
.spinner-4::after { animation-direction: reverse }
100% { transform: rotate(1turn) }
.spinner-5 { animation: s5 1s infinite linear }
```

### [Untitled](https://codepen.io/sol0mka/pen/0bf400db555f7c9701387b73d25c80a7)

on scroll: rect.[object: transform ×2, rect.[object: transform+top | made with: nothing recognised — read the code

### [Scroll timeline motion path](https://codepen.io/michellebarker/pen/xxQqKRW)

held: fixed svg.[object | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
.progress { position: fixed; top: 3rem; offset-path: path('M.5 122.7s24.7-275 276.9 0c327.1 356.7 266.1-330.3 548-33.3 256.9 270.7 271.1 0 271.1 0'); animation: move auto linear; animation-timeline: scroll(root) }
.cloud { position: absolute; top: 5vh }
.cloud:nth-child(2n) { top: 100vh }
.cloud:nth-child(3n) { top: 160vh }
0% { offset-distance: 0% }
100% { offset-distance: 100% }
@keyframes move animates offset-distance
```

### [Tailwind CSS Pagination with Previous/Next Buttons](https://codepen.io/tailgrids/pen/abrVJqY)

on hover of li.: button.inline-flex: background | made with: :hover

### [Rating Stars](https://codepen.io/marioluevanos/pen/ZEXMBvy)

made with: @keyframes · transition · :hover · clip-path · custom properties driven by JS

```css
0% { transform: scale(1) rotate(-72deg); opacity: 1 }
50% { transform: scale(1.25) }
65% { transform: scale(0.5) }
80% { transform: scale(1.1) rotate(-3deg) }
100% { transform: scale(1) rotate(0deg) }
0% { transform: scale(1) rotate(-72deg); opacity: 1 }
50% { transform: scale(1.25) }
65% { transform: scale(0.5) }
80% { transform: scale(1.1) rotate(-3deg) }
100% { transform: scale(1) rotate(0deg) }
0% { transform: scale(0); opacity: 0 }
30% { transform: scale(1.25); opacity: 0.3 }
```

```js
style.setProperty("--size", `${this.size}px`)
```

### [Simple Pure CSS Loader](https://codepen.io/chrysokitty/pen/mJqbxy)

on scroll: div.straight: transform+top, div.curve: transform+top, div.inner: transform+top | made with: @keyframes · transition

```css
100% { transform: rotate(179deg) }
100% { -webkit-transform: rotate(179deg) }
.psoload, .psoload *, .psoload *:before, .psoload *:after { transition: all 0.3s; -webkit-transition: all 0.3s }
.psoload { position: relative }
.psoload .straight, .psoload .curve { position: absolute; top: 17.5%; animation: arrow-spin 0.85s cubic-bezier(0.2, 0.8, 0.9, 0.1) infinite; -webkit-animation: arrow-spin 0.85s cubic-bezier(0.2, 0.8, 0.9, 0.1) infinite }
.psoload .straight:before, .psoload .straight:after { position: absolute; border-bottom: 3px solid #eee; transform: rotate(45deg); -webkit-transform: rotate(45deg) }
.psoload .straight:before { top: 5px }
.psoload .straight:after { bottom: 5px }
.psoload .curve:before, .psoload .curve:after { position: absolute }
.psoload .curve:before { transform: rotate(-63deg) translateX(-27px) translateY(-4px); -webkit-transform: rotate(-63deg) translateX(-27px) translateY(-4px) }
.psoload .curve:after { bottom: 5px; transform: rotate(115deg) translateX(-26px) translateY(-12px); -webkit-transform: rotate(115deg) translateX(-26px) translateY(-12px) }
.psoload .center { position: absolute; top: 20% }
```

### [Example box-shadow](https://codepen.io/anon/pen/Vwbavjq)

made with: nothing recognised — read the code

```css
div:nth-child(1) { box-shadow: 0 3px 10px rgb(0 0 0 / 0.2) }
div:nth-child(2) { box-shadow: 0.5rem 0.5rem black, -0.5rem -0.5rem #ccc }
div:nth-child(3) { box-shadow: 0 0 5px 5px red }
div:nth-child(4) { box-shadow: 0 8px 8px -4px lightblue }
div:nth-child(5) { box-shadow: 0 0 50px #ccc }
div:nth-child(6) { box-shadow: 0 -5px 3px -3px black, 0 5px 3px -3px black }
```

### [Slicing Design Subcribe Modal](https://codepen.io/dickyal6/pen/ZEWdgvV)

made with: transition · :hover

```css
.container { position: relative; box-shadow: 0 20px 30px rgba(0, 0, 0, 0.185) }
.container::after { position: absolute }
.container-close { position: absolute; top: -15px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.164) }
.container img { object-position: center }
.container-text button { box-shadow: 0 5px 20px #89caff94; transition: box-shadow 0.3s ease-in-out }
.container-text button:hover { box-shadow: none }
```

### [Easter Card Carousel #css-only #no-repeat (hover over card to pause scroll)](https://codepen.io/cbolson/pen/ZYEdGQX)

on scroll: article.: transform ×6 | made with: @keyframes · transition · :hover · :focus-visible · mask

```css
&[mask] { mask-image: linear-gradient( to right, transparent, black 10% 90%, transparent ) }
&[reverse] > article { animation-direction: reverse }
&:hover > article { animation-play-state: paused }
100% { transform: translateX( calc( (var(--items) * (var(--carousel-item-width) + var(--carousel-item-gap))) * -1 ) ) }
@keyframes marquee animates transform
```

### [Progress circle using mask](https://codepen.io/t_afif/pen/eYoEpom)

made with: mask

```css
.arc { mask: top var(--_g), calc(50% + 50%*sin(var(--a))) calc(50% - 50%*cos(var(--a))) var(--_g), conic-gradient(#000 var(--a),#0000 0) intersect, radial-gradient(50% 50%, #0000 calc(100% - var(--b) - 1px), #000 calc(100% - va }
```

### [Switches](https://codepen.io/billyysea/pen/ndzGXm)

made with: transition

```css
.wrap { position: relative; top: 50% }
input { position: absolute }
.slider-v1 { position: relative; transition: 350ms; box-shadow: 0 0.07em 0.1em -0.1em rgba(0, 0, 0, 0.4) inset, 0 0.05em 0.08em -0.01em rgba(255, 255, 255, 0.7) }
.slider-v1::before { position: absolute; top: 0.5em; transition: 250ms ease-in-out; box-shadow: 0 0.1em 0.15em -0.05em rgba(255, 255, 255, 0.9) inset, 0 0.5em 0.3em -0.1em rgba(0, 0, 0, 0.25) }
.slider-v1::after { position: absolute; top: 1em; transition: 250ms ease-in; box-shadow: 0 0.08em 0.15em -0.1em rgba(0, 0, 0, 0.5) inset, 0 0.05em 0.08em -0.01em rgba(255, 255, 255, 0.7), -7.25em 0 0 -0.25em rgba(0, 0, 0, 0.3) }
input:checked + .slider-v1::after { box-shadow: 0 0.08em 0.15em -0.1em rgba(0, 0, 0, 0.5) inset, 0 0.05em 0.08em -0.01em rgba(255, 255, 255, 0.7), -7.25em 0 0 -0.25em rgba(0, 0, 0, 0.12) }
.slider-v2 { position: relative; transition: 350ms; box-shadow: 0 0.07em 0.1em -0.1em rgba(0, 0, 0, 0.4) inset, 0 0.05em 0.08em -0.01em rgba(255, 255, 255, 0.7) }
.slider-v2::after { position: absolute; top: 0.5em; transition: 250ms ease-in-out; box-shadow: 0 0.1em 0.15em -0.05em rgba(255, 255, 255, 0.9) inset, 0 0.2em 0.2em -0.12em rgba(0, 0, 0, 0.5) }
.slider-v2::before { position: absolute; top: 0.75em; transition: 250ms ease-in-out; box-shadow: 0 0.08em 0.15em -0.1em rgba(0, 0, 0, 0.5) inset, 0 0.05em 0.08em -0.01em rgba(255, 255, 255, 0.7), 0 0 0 0 rgba(68, 204, 102, 0.7) inset }
input:checked + .slider-v2::before { box-shadow: 0 0.08em 0.15em -0.1em rgba(0, 0, 0, 0.5) inset, 0 0.05em 0.08em -0.01em rgba(255, 255, 255, 0.7), 3em 0 0 0 rgba(68, 204, 102, 0.7) inset }
.slider-v3 { position: relative; transition: 350ms }
.slider-v3::after { position: absolute; top: 0.5em; transition: width 200ms ease-out, height 300ms 50ms ease-in, top 300ms 50ms ease-in, left 250ms 50ms ease-in, background 300ms ease-in, box-shadow 300ms ease-in; box-shadow: 0 0 0 1.5em #f }
```

### [Scroll Snap Challenges](https://codepen.io/aardrian/pen/yLMdRQB)

held: sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th | made with: position: sticky · scroll-snap · :hover

```css
th, td { vertical-align: text-top; scroll-snap-align: start }
th { vertical-align: bottom }
th { position: -webkit-sticky; position: sticky; top: 0 }
th[scope=row] { position: sticky }
th[scope=row] { vertical-align: top }
th[scope="row"]::after { position: absolute }
div[tabindex="0"][aria-labelledby][role="region"] { scroll-snap-type: both mandatory }
div[tabindex="0"][aria-labelledby][role="region"]:nth-of-type(1) { margin-bottom: 9em }
div[tabindex="0"][aria-labelledby][role="region"]:nth-child(3) { background-position: 0 0, 100%, 0 0, 100% }
div[tabindex="0"][aria-labelledby][role="region"]:nth-child(4) { margin-top: 3em }
```

### [3D toggle - click it!](https://codepen.io/thebabydino/pen/ajpqYW)

made with: transition · 3D (perspective / preserve-3d)

```css
body { perspective: 32em }
[type=checkbox] { position: absolute }
[type=checkbox] + label { position: relative; transform: rotatex(90deg) rotate(22.5deg) rotatey(22.5deg); box-shadow: 0.5rem 0.875rem 0 -0.25rem #e0e0e0, 0.625rem 0.625rem 0 -0.25rem #e0e0e0, 0.5rem 0.875rem 0.625rem -0.125rem rgba(191, 191, 191, }
[type=checkbox] + label:before, [type=checkbox] + label:after { position: absolute; transition: 0.35s cubic-bezier(0.21, 0.61, 0.35, 1) }
[type=checkbox] + label:before { top: calc(50% + .875rem); transform: translate(calc(var(--s)*(100% + 1rem))) scale(0.8) skewx(-22.5deg); filter: blur(3px) }
[type=checkbox] + label:after { top: 0.875rem; transform: translate(calc(var(--s)*(100% + 1rem))) rotatey(-22.5deg) rotate(-22.5deg) rotatex(-90deg) translatey(-50%) rotate(45deg); box-shadow: -1px 1px 0.125rem rgba(206, 255, 206, 0.5); filter: Graysca }
```

### [404 on CodePen](https://codepen.io/markmead/pen/mGyqjW)

made with: nothing recognised — read the code

### [Profile Card Hover Effect](https://codepen.io/petegarvin1/pen/YzWBbRx)

on scroll: i.fa: opacity ×5, h2.: opacity | made with: transition · :hover

```css
.border { transition: border 1s; position: relative }
.card { transition: background 0.8s; box-shadow: 0 70px 63px -60px #000; position: relative }
.card0:hover h2 { opacity: 1 }
.card0:hover .fa { opacity: 1 }
.card1:hover h2 { opacity: 1 }
.card1:hover .fa { opacity: 1 }
.card2:hover h2 { opacity: 1 }
.card2:hover .fa { opacity: 1 }
h2 { opacity: 0; transition: opacity 1s }
.fa { opacity: 0; transition: opacity 1s }
.icons { position: absolute; top: 226px }
```

### [CSS Animations: Obvious CTA Buttons](https://codepen.io/oliviale/pen/vPvvyr)

on scroll: div.parrot: color+top ×4, button.: transform+top | on hover of button.: div.parrot: color ×5, button.: transform+top, button.: transform+background+top | made with: @keyframes · transition · :hover

```css
.item.footer a { border-bottom: 1px dashed }
.item.footer a:hover { border-bottom: 1px solid }
footer { margin-top: 1.5rem }
footer a .icons { margin-top: 8px }
footer a .icons:before { position: relative }
*:before, *:after { position: absolute }
.main-content .item:not(.footer) { padding-top: 1rem }
button { position: relative; transition: 0.2s ease-in-out }
.name { text-transform: uppercase }
.button__wrapper { position: relative }
.button-pulse button { position: absolute; top: 0 }
.button-pulse .button__wrapper:hover .pulsing:before { animation: pulsing 0.2s linear infinite }
```

### [Hop Over Notification Badge](https://codepen.io/plfstr/pen/cgsGH)

on hover of li.: a.: color | made with: @keyframes · :hover

```css
h1 { margin-bottom:1em }
.menu { box-shadow:0.12em 0.12em 0 rgba(40,40,40,.2); margin-bottom:1.5em }
.menu a { position:relative }
.menu a[data-bubble]:after { position:absolute; top:0; box-shadow:0 0.063em 0.063em rgba(0,0,0,.2); -webkit-transform: translateZ(0); will-change: transform }
.menu a:hover[data-bubble]:after, .menu a:active[data-bubble]:after, .menu a:foc { -webkit-animation:ease bubbleover .4s; animation:ease bubbleover .4s; -webkit-animation-fill-mode: both; animation-fill-mode: both; top:-1.25em }
0% { -webkit-transform:translate(0, 1em) }
50% { -webkit-transform:translate(0, -.5em) }
100% { -webkit-transform:translate(0, 0) }
0% { top:0; transform:translate(0, 0) }
50% { transform:translate(0, -12px) }
100% { transform:translate(0, 6px) }
@keyframes bubbleover animates top, transform, z-index
```

### [Scroll-triggered Text Highlight](https://codepen.io/anon/pen/ByNjWPJ)

made with: scroll-driven animation (animation-timeline) · view() timeline · @keyframes

```css
.highlighted-text { background-position: left center; animation-name: highlightSweep; animation-timeline: view(20%); animation-fill-mode: forwards }
@keyframes highlightSweep animates background-size
```

### [Infinity path loader ⏳](https://codepen.io/jh3y/pen/MWWwwjJ)

on scroll: div.: transform+top ×2 | made with: @keyframes

```css
.infinity-path { position: relative }
.infinity-path > div { position: absolute; top: 0; -webkit-animation-duration: calc(var(--speed) * 1s); animation-duration: calc(var(--speed) * 1s); -webkit-animation-timing-function: linear; animation-timing-function: linear; -webkit-animatio }
.infinity-path > div:before { position: absolute; top: 50%; animation: infinity-vanish calc(var(--speed) * 2s) infinite reverse steps(1); transform: translate(calc(var(--translate-2) * 2px), calc(var(--translate) * 1%)) }
.infinity-path > div:nth-of-type(1) { --translate: -50 }
.infinity-path > div:nth-of-type(2) { --translate: 50; -webkit-animation-delay: calc(var(--speed) * 1s); animation-delay: calc(var(--speed) * 1s); animation-direction: reverse }
.infinity-path > div:nth-of-type(2):before { transform: translate(calc(var(--size) / 4 * -1px), -50%); -webkit-animation-direction: normal; animation-direction: normal }
0% { opacity: 0 }
50% { opacity: 1 }
0% { opacity: 0 }
50% { opacity: 1 }
from { transform: translate(calc(var(--translate) * 1%), 0) translate(calc(var(--translate-2) * 1px), 0) rotate(0deg) }
to { transform: translate(calc(var(--translate) * 1%), 0) translate(calc(var(--translate-2) * 1px), 0) rotate(360deg) }
```

### [Button glow effect](https://codepen.io/gusevdigital/pen/JjxvbEW)

made with: @keyframes · transition · :hover

```css
.glow { --animation-speed: 1200ms; --container-offset: 100px; position: relative }
.glow-container { position: absolute; inset: calc(var(--container-offset) / -2); opacity: 0 }
.glow-blur { filter: blur(var(--glow-blur-size)) }
.glow:is(:hover, :focus) .glow-blur, .glow:is(:hover, :focus) .glow-line { transition: stroke-dashoffset var(--animation-speed) ease-in, stroke-dasharray var(--animation-speed) ease-in }
.glow:is(:hover, :focus) .glow-container { animation: glow-visibility var(--animation-speed) ease-in }
0%, 100% { opacity: 0 }
25%, 75% { opacity: 1 }
@keyframes glow-visibility animates opacity
```

### [Radio button animation - Only CSS](https://codepen.io/milanraring/pen/NWqbvxe)

held: fixed div.socials | made with: position: fixed · @keyframes · transition · :hover

```css
form { position: relative; box-shadow: 0 10px 30px rgba(65, 72, 86, 0.05) }
form input[type=radio] { position: relative; transition: border 0.5s ease }
form input[type=radio]::before { position: absolute; opacity: var(--opacity, 1) }
form input[type=radio]::after { position: relative; top: var(--y, 100%); transition: top 0.5s cubic-bezier(0.48, 1.97, 0.5, 0.63) }
form input[type=radio]:checked::after { -webkit-animation: stretch-animate 0.3s ease-out 0.17s; animation: stretch-animate 0.3s ease-out 0.17s }
form input[type=radio]:checked::before { --opacity: 0 }
form input[type=radio]:not(:checked)::before { --opacity: 1; transition: opacity 0s linear 0.5s }
0% { transform: scale(1, 1) }
28% { transform: scale(1.15, 0.85) }
50% { transform: scale(0.9, 1.1) }
100% { transform: scale(1, 1) }
0% { transform: scale(1, 1) }
```

### [Strapi.io Style Buttons with Tailwind and CSS Keyframes](https://codepen.io/Blankeos/pen/ExZajjJ)

on scroll: div.b: transform+top, span.animate-ping: transform+opacity+top, div.b: opacity | on hover of a.text-center: div.i: transform+top, div.b: transform+top, span.animate-ping: transform+opacity+top, div.b: opacity | made with: @keyframes · :hover

```css
.i::before { position: absolute; opacity: 20%; top: 0; bottom: 0 }
.i:hover:before { animation: anim-in 0.7s forwards ease-out }
100% { opacity: 0% }
0% { opacity: 20% }
@keyframes anim-in animates opacity, border-radius, width, height
```

### [Fancy Frame III](https://codepen.io/anon/pen/vYjJvxX)

made with: clip-path

```css
img { clip-path: polygon( 0 0 ,33% 0 ,50% calc(2*var(--s)) ,66% 0, 100% 0 ,100% 33% ,calc(100% - 2*var(--s)) 50%,100% 66%, 100% 100%,66% 100%,50% calc(100% - 2*var(--s)),33% 100%, 0 100%,0 66% ,calc(2*var(--s)) 50% ,0 33% ) }
```

### [Drop Down Menu](https://codepen.io/Mark_Bell00/pen/vYELmNM)

on hover of li.: a.: color | made with: transition · :hover

```css
nav.primary-navigation ul li { position: relative }
nav.primary-navigation ul li ul { opacity: 0; position: absolute }
nav.primary-navigation ul li:hover > ul, nav.primary-navigation ul li ul:hover { opacity: 1; padding-top: 20px; box-shadow: 0px 3px 5px -1px #ccc }
nav.primary-navigation ul li ul li { margin-bottom: 20px }
nav.primary-navigation ul li ul li a:hover { transition: all 0.3s ease }
ul li ul li a { transition: all 0.5s ease }
```

### [Menu Interaction](https://codepen.io/moharnadreza/pen/MWWWYrb)

held: fixed a.dribbble | made with: position: fixed · transition · :hover

```css
.widget.active .menu .toggle i { transition: width 400ms cubic-bezier(0.6, 0, 0.45, 0.99), transform 1000ms cubic-bezier(0.6, 0, 0.45, 0.99) 300ms, top 200ms cubic-bezier(0.6, 0, 0.45, 0.99) 200ms, bottom 200ms cubic-bezier(0.6, 0, 0.45, 0.99) 200ms }
.widget.active .menu .toggle i:first-of-type { top: 19px; transform: rotate(45deg) translate(-1px, -2px) }
.widget.active .menu .toggle i:last-of-type { bottom: 19px; transform: rotate(-45deg) translate(-1px, 2px) }
.widget.active .menu .list li { transform: scale(1) }
.widget .menu { position: absolute; transform: translate(28px, -50%); box-shadow: 0px 10px 30px -15px rgba(0, 0, 0, 0.7); transition: 650ms cubic-bezier(0.79, 0, 0.22, 1) }
.widget .menu .toggle { position: absolute; transition: 600ms cubic-bezier(0.79, 0, 0.22, 1) }
.widget .menu .toggle i { position: absolute; transition: width 400ms cubic-bezier(0.6, 0, 0.45, 0.99), transform 600ms cubic-bezier(0.6, 0, 0.45, 0.99), top 600ms cubic-bezier(0.6, 0, 0.45, 0.99) 600ms, bottom 600ms cubic-bezier(0.6, 0, 0.45, 0. }
.widget .menu .toggle i:first-of-type { top: 16px }
.widget .menu .toggle i:last-of-type { bottom: 16px }
.widget .menu .list { position: absolute }
.widget .menu .list li { transform: scale(0); transition: 300ms cubic-bezier(0.37, 0.01, 0.43, 1.3) }
.dribbble { position: fixed; bottom: 24px }
```

### [CSS only 3D perspective button](https://codepen.io/t_afif/pen/gOveOXy)

on scroll: button.: transform | made with: transition · :hover · :focus-visible · 3D (perspective / preserve-3d)

```css
button { transform: perspective(500px) rotateY(calc(20deg*var(--_i,-1))); outline-offset: .1em; transition: 0.3s }
button:active { box-shadow: inset 0 0 9e9q #0005; transition: 0s }
```

### [Notification Feed Animations](https://codepen.io/jkantner/pen/KwwLRPm)

on scroll: div.avatar: background ×4, div.note__inner: transform+opacity+filter ×2 | made with: @keyframes · transition

```css
body { transition: background-color var(--trans-dur), color var(--trans-dur) }
.avatar { transition: background-color var(--trans-dur) }
.note, .note__inner { animation-duration: 0.75s; animation-fill-mode: forwards }
.note__inner { animation-name: note-in; box-shadow: 0 0 1.5em rgba(0, 0, 0, 0.1); transition: background-color var(--trans-dur), box-shadow var(--trans-dur) }
.note--out { animation-name: note-shrink }
.note--out .note__inner { animation-name: note-out }
from { filter: blur(10px); opacity: 0; transform: scale(0.8) }
to { filter: blur(0); opacity: 1; transform: scale(1) }
from { filter: blur(0); opacity: 1; transform: translateY(0) scale(1) }
to { filter: blur(10px); opacity: 0; transform: translateY(-100%) scale(1.1) }
@keyframes note-in animates filter, opacity, transform
@keyframes note-out animates filter, opacity, transform
```

### [Stunt Preloader](https://codepen.io/jkantner/pen/BaVdqrL)

on scroll: g.[object: transform ×3, path.[object: transform ×3 | made with: @keyframes · transition

```css
body { transition: background-color 0.3s }
.sp__ring { transition: stroke 0.3s }
.sp__worm1, .sp__worm2, .sp__worm2-1 { animation: worm1 5s ease-in infinite }
.sp__worm2 { animation-name: worm2; animation-timing-function: linear }
.sp__worm2-1 { animation-name: worm2-1 }
12.5% { animation-timing-function: ease-out }
25% { animation-timing-function: cubic-bezier(0,0,0.43,1) }
50% { animation-timing-function: ease-in }
62.5% { animation-timing-function: ease-out }
75% { animation-timing-function: cubic-bezier(0,0,0.43,1) }
from, 12.5%, 75%, to { transform: rotate(0) translate(-42px,0) }
25%, 62.5% { transform: rotate(0.5turn) translate(-42px,0) }
```

### [Lo-fi Tailwind CSS Radio Button Cards](https://codepen.io/robstinson/pen/ExKBroN)

held: fixed a.fixed | made with: nothing recognised — read the code

```css
input:checked + label { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) }
```

### [Animated segmented control in plain CSS](https://codepen.io/diegohaz/pen/GgoRjjM)

made with: transition · :hover · :focus-visible · :has()

```css
&::before, &::after { position: absolute; transition: inset 250ms cubic-bezier(0.4, 0, 0.2, 1); inset: calc(anchor(start) + var(--padding)) calc(anchor(end) + var(--padding)) calc(anchor(end) + var(--padding)) calc(anchor(start) + var(--paddi }
&::after { box-shadow: 0 0 0 1px light-dark(#C7C8C8, #484A4C), 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) }
input { position: absolute }
```

### [Element Card - Group 11 element](https://codepen.io/MarioDesigns/pen/PjjRWm)

held: fixed a.suppoprt-me | on hover of div.element-card: div.element-card: transform | made with: position: fixed · transition · :hover · 3D (perspective / preserve-3d)

```css
html, body { position: relative }
body { transform: translate3d(0, 0, 0); filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#1e5799", endColorstr="#7db9e8",GradientType=1 ) }
.container { position: relative }
.element-card { position: relative; transform: rotatey(0deg) translatex(0px) translatey(0px); transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.4) }
.element-card:hover { transform: rotatey(45deg) translatex(0px) translatey(0px) }
.element-card.open { transform: rotatey(-180deg) translatex(0px) translatey(0px) }
.element-card .front-facing { transform: rotateY(0deg) translateZ(2px); position: absolute; top: 0; bottom: 0 }
.element-card .front-facing .abr { position: absolute; top: 50% }
.element-card .front-facing .title { position: absolute; top: 50%; text-transform: uppercase }
.element-card .front-facing .atomic-number { position: absolute; top: 10px }
.element-card .front-facing .atomic-mass { position: absolute; bottom: 10px }
.element-card .back-facing { transform: rotateY(180deg) translateZ(0px); position: absolute; top: 0; bottom: 0 }
```

### [CSS Marquee Logo Wall](https://codepen.io/hexagoncircle/pen/wvmjomb)

held: fixed button.toggle | on scroll: div.marquee__group: transform ×4 | on hover of button.toggle: div.marquee__group: transform ×4 | made with: position: fixed · @keyframes · transition · :focus-visible · prefers-reduced-motion · mask

```css
.marquee { -webkit-mask-image: linear-gradient( var(--mask-direction, to right), hsl(0 0% 0% / 0), hsl(0 0% 0% / 1) 20%, hsl(0 0% 0% / 1) 80%, hsl(0 0% 0% / 0) ); mask-image: linear-gradient( var(--mask-direction, to right), hsl(0  }
.marquee__group { -webkit-animation: scroll-x var(--duration) linear infinite; animation: scroll-x var(--duration) linear infinite }
.marquee__group { -webkit-animation-play-state: paused; animation-play-state: paused }
.marquee--vertical { --mask-direction: to bottom }
.marquee--vertical .marquee__group { -webkit-animation-name: scroll-y; animation-name: scroll-y }
.marquee--reverse .marquee__group { animation-direction: reverse; -webkit-animation-delay: -3s; animation-delay: -3s }
from { transform: translateX(var(--scroll-start)) }
to { transform: translateX(var(--scroll-end)) }
from { transform: translateX(var(--scroll-start)) }
to { transform: translateX(var(--scroll-end)) }
from { transform: translateY(var(--scroll-start)) }
to { transform: translateY(var(--scroll-end)) }
```

### [Pure CSS accordion](https://codepen.io/sfi0zy/pen/KeMZEb)

on scroll: div.item: transform+background+shadow, div.icon: transform, div.title: transform+background+top, div.text: transform+top, div.content: opacity, div.item: opacity | made with: transition · :hover

```css
.custom-accordion { padding-bottom: 2rem }
.custom-accordion > .item:nth-of-type(6) { padding-bottom: 2rem }
.custom-accordion { padding-bottom: 0 }
.custom-accordion > .item { position: relative; transition: all 0.3s cubic-bezier(0.8, 0.16, 0.42, 0.89) }
.custom-accordion > .item:hover:not(:last-of-type) { transform: scaleX(2) translateX(-1px); box-shadow: 0 0 3rem #301916 }
.custom-accordion > .item:hover + .item { opacity: 0.1 }
.custom-accordion > .item:hover + .item:last-of-type { opacity: 0.1 }
.custom-accordion > .item:hover:last-of-type .heart-icon { transform: scale(2) }
.custom-accordion > .item:last-of-type > .title { transform: rotate(0) translateX(-50%) translateY(-2.5rem) }
.custom-accordion > .item:last-of-type > .content { opacity: 1; transform: translateX(-50%) translateY(-50%) }
.custom-accordion > .item:hover:not(:last-of-type) > .icon { transform: scaleX(0.5) }
.custom-accordion > .item:hover:not(:last-of-type) > .title { transform: scaleX(0.5) translateX(-50%) }
```

### [Pure CSS Menu - #13](https://codepen.io/ig_design/pen/XWXZaGb)

held: fixed label, fixed nav.nav | made with: position: fixed · @keyframes · transition · :hover

```css
body { background-position: center }
.section-center { position: absolute; top: 50%; transform: translateY(-50%) }
[type="checkbox"]:checked, [type="checkbox"]:not(:checked) { position: absolute }
.menu-icon:checked + label, .menu-icon:not(:checked) + label { position: fixed; top: 63px }
.menu-icon:checked + label:before, .menu-icon:not(:checked) + label:before { position: absolute; top: 0; border-top: 2px solid #ececee; border-bottom: 2px solid #ececee; transition: border-width 100ms 1500ms ease, top 100ms 1600ms cubic-bezier(0.23, 1, 0.32, 1), height 100ms 1600ms cubic-bezier(0 }
.menu-icon:checked + label:after, .menu-icon:not(:checked) + label:after { position: absolute; top: 10px; margin-top: -1px; transition: width 100ms 1750ms ease, right 100ms 1750ms ease, margin-top 100ms ease, transform 200ms cubic-bezier(0.23, 1, 0.32, 1) }
.menu-icon:checked + label:before { top: 10px; transform: rotate(45deg); transition: border-width 100ms 340ms ease, top 100ms 300ms cubic-bezier(0.23, 1, 0.32, 1), height 100ms 300ms cubic-bezier(0.23, 1, 0.32, 1), background-color 200ms 500ms ease, transf }
.menu-icon:checked + label:after { margin-top: 0; transform: rotate(-45deg); transition: width 100ms ease, right 100ms ease, margin-top 100ms 500ms ease, transform 200ms 1700ms cubic-bezier(0.23, 1, 0.32, 1) }
.nav { position: fixed; top: 33px; box-shadow: 0 8px 30px 0 rgba(0,0,0,0.3); animation: border-transform 7s linear infinite; transition: top 350ms 1100ms cubic-bezier(0.23, 1, 0.32, 1), right 350ms 1100ms cubic-bezier(0.23, 1,  }
.menu-icon:checked ~ .nav { animation-play-state: paused; top: 50%; transform: translate(50%, -50%); transition: top 350ms 700ms cubic-bezier(0.23, 1, 0.32, 1), right 350ms 700ms cubic-bezier(0.23, 1, 0.32, 1), transform 250ms 700ms ease, width 750 }
.nav ul { position: absolute; top: 50%; transform: translateY(-50%) }
.nav ul li { position: relative; opacity: 0; transform: translateY(30px); transition: all 250ms linear }
```

### [React Range Slider](https://codepen.io/cengizdonmez/pen/mdraWXj)

made with: nothing recognised — read the code

```css
.range-slider { position: relative }
.range-slider .range-slider-lines { position: absolute; top: 25px }
.range-slider .range-slider-lines span:before { position: absolute; opacity: 0.3 }
.range-slider .rangeslider-horizontal { box-shadow: 0px 0px 8.4px rgba(0, 0, 0, 0.5) }
.range-slider .rangeslider-horizontal .rangeslider__handle { box-shadow: none; top: 5px }
.range-slider .rangeslider-horizontal .rangeslider__handle .rangeslider__handle- { top: inherit; transform: scaleX(0.9); bottom: 0; border-top: 20px solid #fff; border-bottom: 20px solid transparent }
.range-slider .rangeslider-horizontal .rangeslider__handle:after { transform: scaleX(1.1); position: absolute; opacity: 0.5; filter: blur(4px) }
.vs { position: absolute; top: 50%; transform: translateY(-50%) }
.push-btn { margin-top: 15px }
```

### [Flipping Card](https://codepen.io/DmitryKorobov/pen/LrWxKO)

on scroll: div.card-front: transform, div.card-back: transform | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.card { position: absolute; top: 50%; transform: translate(-50%, -50%); perspective: 600px; transition: 0.5s }
.card:hover .card-front { transform: rotateX(-180deg) }
.card:hover .card-back { transform: rotateX(0deg) }
.card-front { background-position: 50% 50%; position: absolute; top: 0; transform: rotateX(0deg); transition: 0.5s }
.card-back { position: absolute; top: 0; transform: rotateX(180deg); transition: 0.5s }
```

### [CSS Gooey Menu (Version 2)](https://codepen.io/lbebber/pen/RNgBPP)

made with: transition · :hover

```css
h1, h2, h3, h4 { margin-bottom: 10px; margin-top: 10px }
.menu { filter: url("#goo") }
.menu-item, .menu-open-button { position: absolute; top: 20px; transform: translate3d(0, 0, 0); transition: transform ease-out 200ms }
.hamburger { position: absolute; top: 50%; margin-top: -1.5px; transition: transform 200ms }
.hamburger-1 { transform: translate3d(0, -8px, 0) }
.hamburger-2 { transform: translate3d(0, 0, 0) }
.hamburger-3 { transform: translate3d(0, 8px, 0) }
.menu-open:checked + .menu-open-button .hamburger-1 { transform: translate3d(0, 0, 0) rotate(45deg) }
.menu-open:checked + .menu-open-button .hamburger-2 { transform: translate3d(0, 0, 0) scale(0.1, 1) }
.menu-open:checked + .menu-open-button .hamburger-3 { transform: translate3d(0, 0, 0) rotate(-45deg) }
.menu { position: absolute; padding-top: 20px }
.menu-open-button { transform: scale(1.1, 1.1) translate3d(0, 0, 0) }
```

### [Complex hover effect with one element](https://codepen.io/anon/pen/eYreVOX)

on hover of img.: img.: transform+clip-path+top | made with: transition · :hover · clip-path · mask

```css
img { -webkit-mask: var(--_m); mask: var(--_m); outline-offset: -100vmax; clip-path: inset(calc(2*(var(--b) + var(--g)))); transition: .3s clip-path, .3s outline-color, .3s transform }
img:hover { clip-path: inset(0); transform: scale(1.2); transition: .25s 1s -webkit-mask-size, .25s .75s -webkit-mask-position, .25s .5s background-size, .25s .25s background-position, .25s clip-path, .25s outline-color, .7s transfo }
```

### [Smooth 3d perspective slider](https://codepen.io/alexnoz/pen/brazWd)

on scroll: div.slider__content: transform, img.: transform+top | on hover of img.: div.slider__content: transform, img.: transform | made with: transition · :hover · clip-path · 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking · requestAnimationFrame

```css
.slider { perspective: 1000px }
.slider::before, .slider::after { top: -1vh; position: absolute; background-position: center; will-change: opacity; box-shadow: 0 0 0 50vmax rgba(0, 0, 0, 0.7) inset }
.slider::after { transition: opacity 0.7s; opacity: 0 }
.slider--bg-next::after { opacity: 1 }
.slider__content { will-change: transform; transform: translateZ(var(--z-distance)) }
.slider__images { position: absolute; box-shadow: 0 0 5em #000 }
.slider__images-item { position: absolute; top: 0; will-change: transform }
.slider__images-item img { position: relative; top: -1em; will-change: transform }
.slider__images-item--next { transform: translateX(100%) }
.slider__images-item--prev { transform: translateX(-100%) }
.slider__images-item--transit { transition: transform 0.7s, opacity 0.7s }
.slider__text { position: relative }
```

```js
addEventListener('mousemove', this.onMouseMove)
style.setProperty( '--img-prev',
requestAnimationFrame(this.runAnimation.bind(this))
style.setProperty('--from-left', nextId)
requestAnimationFrame(() => {
style.setProperty('--img-prev', imageUrl)
style.setProperty('--img-next', imageUrl)
addEventListener('mousemove', stopAutoSlide)
```

### [Responsive Resaturant Menu](https://codepen.io/nitnelav/pen/yLYRgEp)

made with: transition

```css
.container { position: absolute; top: 0 }
.navi-indicator { transition: width 0.2s }
.nav-button { box-shadow: 6px 6px 10px #cfcdc4, -6px -6px 10px #ffffff }
.menu-item { padding-top: 10px; box-shadow: 6px 6px 10px #c7c5bd, -6px -6px 10px #ffffff }
.drink-item { padding-top: 10px; box-shadow: 6px 6px 10px #c7c5bd, -6px -6px 10px #ffffff }
.menu-separator { margin-top: 35px; box-shadow: 6px 6px 10px #c7c5bd, -6px -6px 10px #ffffff }
```

### [CSS ONLY Semantic Animated Accordion](https://codepen.io/redesigned/pen/wvoEvqG)

made with: @keyframes · transition · :hover

```css
summary::before { position: absolute; top: 1rem; transform: rotate(0); transition: 0.2s transform ease }
details[open] > summary:before { transform: rotate(90deg); transition: 0.45s transform ease }
details summary { position: relative }
from { margin-bottom: -80%; opacity: 0; transform: translateY(-100%) }
details > *:not(summary) { animation: details-show 500ms ease-in-out; position: relative; transition: all 0.3s ease-in-out }
details.style2 summary::before { transform: rotate(-45deg); top: 1.2rem }
details[open].style2 > summary:before { transform: rotate(90deg); transition: color ease 2s, transform ease 1s }
details.style3 summary::before { top: 1.3rem; transition: margin linear 0.05s }
details[open].style3 > summary:before { transform: rotate(90deg); transition: color ease 2s, transform ease 1s, margin ease 1s }
details.style3 summary::before { top: 1.6rem }
details[open].style3 > summary:before { top: 1.3rem; transition: all 0.8s }
details.style4 summary::before { transform: rotate(-45deg); top: 1.2rem }
```

### [Fancy hover effect for images](https://codepen.io/anon/pen/OJZxBWE)

on hover of img.: img.: filter | made with: transition · :hover

```css
img { filter: grayscale(50%) }
img:hover { filter: grayscale(0%); transition: .4s }
```

### [Sticky Header Calendar (with overflow)](https://codepen.io/dannievinther/pen/pGdjPV)

held: sticky div.sticky-header, sticky div.headers, sticky div.track, sticky div.heading, sticky div.heading, sticky div.heading, sticky div.heading, sticky div.heading, sticky div.heading, sticky div.heading | made with: position: sticky · transition · IntersectionObserver

```css
.sticky-header { position: sticky; top: 0 }
.sticky-header span { opacity: 0; transform: translateY(-100%); transition: .4s }
.reveal .sticky-header span { opacity: 1; transform: none }
.table { position: relative }
.headers { top: var(--sticky-height); position: -webkit-sticky; position: sticky; box-shadow: 0 10px 50px rgba(0, 0, 0, 0.04) }
.time { position: -webkit-sticky; position: sticky }
.tracks .time { box-shadow: 20px 0 50px rgba(0, 0, 0, 0.05) }
.heading { position: -webkit-sticky; position: sticky; top: 0 }
.entry { border-top: 0 }
.time .entry, .time .heading { position: relative }
.time .entry:after, .time .heading:after { position: absolute; bottom: -1px }
.details { box-shadow: 0 15px 30px -10px rgba(0,0,0,0.50); box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08) }
```

```js
new IntersectionObserver(entries => {
```

### [dialog with scroll locking](https://codepen.io/anon/pen/QWooqVa)

held: sticky div | made with: position: sticky · position: fixed · :hover · :has() · <dialog>

```css
> div { position: sticky; top: 1rem }
media (max-width: 500px) { position: fixed; bottom: 0 }
&:hover { opacity: 1 }
```

### [Pricing - pure css - #16](https://codepen.io/ig_design/pen/VwedgWj)

held: fixed a.logo | made with: position: fixed · @keyframes · transition · :hover · mix-blend-mode · 3D (perspective / preserve-3d)

```css
a { transition: all 200ms linear }
.section { position: relative }
[type="checkbox"]:checked, [type="checkbox"]:not(:checked) { position: absolute }
.pricing:checked + label, .pricing:not(:checked) + label { position: relative; text-transform: uppercase }
.pricing:checked + label:before, .pricing:not(:checked) + label:before { position: absolute; top: 0 }
.pricing:checked + label:after, .pricing:not(:checked) + label:after { position: absolute; top: 2px; transition: left 300ms linear }
.block-diff { mix-blend-mode: difference }
.card-3d-wrap { position: relative; perspective: 1000px; margin-top: 90px }
.card-3d-wrapper { position:absolute; top: 0; transition: transform 700ms 400ms ease-out }
.card-front, .card-back { position: absolute; top: 0; box-shadow: 0 12px 35px 0 rgba(16, 39, 112,.07) }
.card-back { transform: rotateY(180deg) }
.pricing:checked ~ .card-3d-wrap .card-3d-wrapper { transform: rotateY(180deg); transition: transform 700ms 400ms ease-out }
```

### [Gradient buttons](https://codepen.io/ibrahimozturkme/pen/mOZmgG)

on hover of ul.btn-list: a.btn-gradient: color+shadow, i.fa: color | made with: position: fixed · @keyframes · transition · :hover

```css
body { position:fixed; top:0 }
.btn-list { position:relative }
.btn-list:after { position:absolute; top:-48px }
.btn-gradient { -webkit-transition:all 300ms; transition:all 300ms }
#light .btn-list { box-shadow:0 0 8px rgba(0,0,0,0.10) }
#light .btn-list:after { box-shadow:0 0 8px rgba(0,0,0,0.10) }
#light .btn-gradient { box-shadow:0 0 1px rgba(0,0,0,0.54) }
#dark .btn-gradient { box-shadow:0 0 1px rgba(255,255,255,0.54) }
#dark .btn-list:after { box-shadow:0 0 8px rgba(255,255,255,0.10) }
#dark .btn-list { box-shadow:0 0 8px rgba(0,0,0,0.10) }
0% { background-position:0 50% }
50% { background-position:100% 50% }
```

### [Liquid tab bar interaction with compact HTML & CSS + just a sprinkle of vanilla JS (no libraries)](https://codepen.io/thebabydino/pen/bGRMXpp)

held: fixed a | made with: transition · :hover · mask · custom properties driven by JS

```css
nav { mask: conic-gradient(red 0 0) subtract, radial-gradient(circle at 0 2.1213203436em, #0000 calc(2.1213203436em + -.5px), gold calc(2.1213203436em + .5px)) calc((var(--k) + .5)*7.5em + 1.5em + -3.1819805153em) 0/2.12132034 }
.nav-item { padding-top: 1.5em; text-transform: capitalize; filter: sepia(var(--hl)) }
.nav-item::before { filter: brightness(0) contrast(calc(var(--sel))) }
```

```js
style.setProperty('--k', +_t.style.getPropertyValue('--i'))
```

### [Glitch buttons - WebGL](https://codepen.io/JoyZi/pen/Mrrrgg)

made with: :hover · GSAP

```css
.noise_btn { position: relative; text-transform: uppercase; margin-bottom: auto; opacity: 0 }
.noise_btn.canvas-ready { opacity: 1 }
.noise_btn strong { position: absolute; top: 0px }
.noise-container { position: relative }
.noise-canvas { position: absolute; top: -20px }
```

```js
addEventListener("mouseenter", this.play.bind(this))
```

### [Menu test - css only - effects](https://codepen.io/silvandiepen/pen/rZaOGR)

made with: @keyframes · transition

```css
.hidden { position: absolute }
.burger { position: relative; box-shadow: 0 0 4.1666666667vw rgba(0, 0, 0, 0.25), 0 0 0.8333333333vw rgba(0, 0, 0, 0.1) }
.burger span { position: absolute; top: 50%; margin-top: -0.0625rem }
.burger span, .burger span:before, .burger span:after { transition: 0.3s; opacity: 1 }
.burger span:before, .burger span:after { position: absolute }
.burger span:before { top: -0.525rem }
.burger span:after { top: 0.525rem }
.burger1 input:checked + span:before, .burger1 input:checked + span:after { top: 0px; margin-top: -0.5875rem }
.burger1 input:checked + span:before { transform: translateY(0.525rem) rotate(45deg) }
.burger1 input:checked + span:after { transform: translateY(0.525rem) rotate(-45deg) }
.burger2 input:checked + span:before, .burger2 input:checked + span:after { top: 0px; margin-top: -0.5875rem }
.burger2 input:checked + span:before { transform: translateY(0.525rem) rotate(-45deg) }
```

### [Pure CSS Navigation Simple & Easy](https://codepen.io/ravid7000/pen/ENeaRM)

made with: transition · :hover

```css
.mobile { box-shadow: 0px 30px 40px rgba(0, 0, 0, 0.2) }
.mobile .mobile-body { padding-top: 40px; position: relative }
.container::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3) }
.container::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5) }
.oop { position: relative; margin-bottom: 20px }
.heading { text-transform: uppercase; position: relative }
.navbar { position: absolute; top: 0; box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.2) }
.navbar button.burger { position: absolute; top: 0 }
.navbar button.burger span { transition: all 0.4s ease-in-out }
.navbar button.burger:focus span:first-child { transform: rotate(-90deg) }
.navbar button.burger:focus span:last-child { transform: rotate(-90deg) }
.navbar ul.menu { transition: all 0.6s ease-in-out }
```

### [glitchy elastic slider](https://codepen.io/ClementRoche/pen/xmerjZ)

made with: mix-blend-mode · pointer / mouse tracking

```css
#container .total { position: relative }
#container .total > div { position: absolute }
#container .total .previous { top: 30px }
#container .total .current { top: 0px; position: relative }
#container .total .current > div { position: absolute; top: 0px; mix-blend-mode: multiply; will-change: opacity }
#container .total .next { top: 30px }
```

```js
addEventListener("mousemove", function(e) {
```

### [Bootstrap responsive hover navbar](https://codepen.io/Heliox/pen/ELBamB)

held: fixed header.navbar | made with: :hover

```css
.navbar-brand { text-transform: uppercase }
.navbar .nav { text-transform: uppercase }
.dropdown { position: relative }
.dropdown-menu { position: absolute }
```

### [Scoop Selector](https://codepen.io/cobra_winfrey/pen/oNPqvjN)

made with: @keyframes · transition · :hover · :has() · mask

```css
legend { position: absolute; top: -50px; transform: translate(-50%, 0); border-bottom: 1px solid rgba(218, 55, 67, 0.25); background-position: 50% 50%, 50% 0%; transition: 0.6s ease-in-out }
legend:before { position: absolute; top: calc(50% + 1px); transform: translate(-50%, -50%) }
fieldset { --top: 0px; position: relative; transform: translateY(100vh) rotate(-45deg) translateZ(0px); animation: slideIn 1s cubic-bezier(0.175, 0.885, 0.32, 1) 1 forwards 1.25s }
to { transform: translateY(20px) rotate(0deg) translateZ(0px) }
fieldset:before { position: absolute; top: calc(50% - 175px); box-shadow: inset 0 0 0 10px #fff, inset 0 0 0 11px var(--b), 0 20px 40px -20px #000 }
fieldset:has(div:nth-of-type(1):hover) legend { background-position: 50% 50%, 50% 35% }
fieldset:has(div:nth-of-type(2):hover) legend { background-position: 50% 50%, 50% 70% }
fieldset:has(div:nth-of-type(3):hover) legend { background-position: 50% 50%, 50% 105% }
fieldset:has(div:first-of-type input:checked):has(div:nth-of-type(2):hover) .sco { --top: 2.5px }
fieldset:has(div:first-of-type input:checked):has(div:nth-of-type(3):hover) .sco { --top: 5px }
fieldset:has(div:nth-of-type(2) input:checked):has(div:first-of-type:hover) .sco { --top: -2.5px }
fieldset:has(div:nth-of-type(2) input:checked):has(div:nth-of-type(3):hover) .sc { --top: 2.5px }
```

### [Cookies Popup UI Design](https://codepen.io/imilenig/pen/wvWjWpR)

made with: nothing recognised — read the code

```css
.cookiesContent button.close { margin-bottom: 10px }
.cookiesContent img { margin-bottom: 15px }
.cookiesContent p { margin-bottom: 40px }
.cookiesContent button.accept { box-shadow: 0px 6px 18px -5px #ed6755 }
```

### [bootstrap dropdown](https://codepen.io/avstorm/pen/dYwoEN)

on scroll: button.btn: background | made with: :hover

```css
.btn:focus, .btn:active:focus { box-shadow: none }
.btn-group.open .dropdown-toggle { box-shadow: none }
.dropdown-menu { box-shadow: none }
```

### [Gradient hover animated button | Welcome in my world](https://codepen.io/mars2601/pen/MKVNMX)

made with: transition · :hover

```css
body { position:relative }
.container { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.btn { margin-top: calc(50% + 25px); position: relative; text-transform: uppercase }
.btn svg { position: absolute; top: 0 }
.btn svg rect { -webkit-transition: all 600ms ease; transition: all 600ms ease }
.btn span { filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ff8282', endColorstr='#e178ed',GradientType=1 ) }
```

### [Range With Sliding Value](https://codepen.io/jkantner/pen/WNKZbmZ)

made with: transition · :hover · :focus-visible

```css
body { transition: background-color var(--trans-dur), color var(--trans-dur) }
.range { padding-top: 0.5em; position: relative }
.range__label { position: absolute }
.range__input { transition: background-color var(--trans-dur) }
.range__input::-webkit-slider-thumb { box-shadow: 0 0.125em 0.5em hsl(0,0%,0%,0.3); transition: background-color 0.15s linear }
.range__input::-moz-range-thumb { box-shadow: 0 0.125em 0.5em hsl(0,0%,0%,0.3); transition: background-color 0.15s linear }
.range__output, .range__output:after, .range__output-value-track, .range__output { position: absolute }
.range__output, .range__output:after { transform: translateX(-50%) }
.range__output { bottom: calc(100% + 0.5em); transition: background-color var(--trans-dur) }
.range__output:after { border-top: 0.5em solid var(--primary3); top: calc(100% - 1px) }
.range__output-value-track { inset: 0 }
.range__output-values { top: 0; transform: translateX(var(--transX)); transition: transform 0.15s linear }
```

### [ThreeJs carousel with shader distortion effect](https://codepen.io/jankohlbach/pen/NWLXvza)

held: fixed div.watermark-wrap | on scroll: span.: transform | made with: GSAP · ScrollTrigger · Lenis / smooth scroll · three.js / WebGL · requestAnimationFrame

```css
span { text-transform: uppercase; opacity: 0.05 }
```

```js
requestAnimationFrame(raf)
gsap.registerPlugin(ScrollTrigger)
gsap.timeline({
scrollTrigger: { trigger: watermarkWrap, start: 'top top', end: '+=600%', scrub: true, pin: true, pinSpacing: false }
ScrollTrigger.create({
requestAnimationFrame(render)
```

### [Button hover effects](https://codepen.io/francoiscoron/pen/wvZLaQP)

on scroll: span.c-btn__label: color, svg.[object: color, path.[object: color | made with: transition · :hover

```css
.c-btn { position: relative; box-shadow: inset 0 0 0 1px var(--color-primary); transform: translateZ(0) }
.c-btn::after { position: absolute; top: 0; scale: 0 0; translate: 0 140%; transition: scale 0.6s cubic-bezier(0.215, 0.61, 0.355, 1), translate 0.4s cubic-bezier(0.215, 0.61, 0.355, 1) }
.c-btn__label { transition: color 0.32s ease-in-out }
.c-btn:hover:after { scale: 1.5 1.5; translate: 0 0 }
```

### [Bootstrap 5 Multi-level Dropdown Menu](https://codepen.io/ricoJei8ht/pen/wvbWdaz)

made with: :hover

```css
.dropdown:hover>.dropdown-menu, .dropend:hover>.dropdown-menu { margin-top: .1em }
.dropend:hover>.dropdown-menu { position: absolute; top: 0 }
```

### [WebKit Progress Scrollbar CSS only](https://codepen.io/mykt0ngc0/pen/oNXqJgx)

made with: nothing recognised — read the code

```css
body { position: relative }
body::-webkit-scrollbar-thumb { box-shadow: 0 -100vh 0 100vh #00ffac }
```

### [CSS-only wavy divider](https://codepen.io/t_afif/pen/RwOLZrL)

made with: mask

```css
.wavy { mask: radial-gradient(var(--R) calc(100% - var(--s)*(1 + var(--p))), #000 99%, #0000 101%) calc(50% - 2*var(--s)) 0/calc(4*var(--s)), radial-gradient(var(--R) calc(100% + var(--s)*var(--p)), #0000 99%, #000 101%) 50% cal }
```

### [card](https://codepen.io/cssparadise/pen/gbMdgOR)

on scroll: div.radio-group: transform+shadow+top | made with: @keyframes · transition · :hover

```css
.radio-group { position: relative; box-shadow: 4px 4px 0 #000; transition: transform 0.3s ease, box-shadow 0.3s ease }
.radio-group:hover { transform: translateY(-2px); box-shadow: 6px 6px 0 #000 }
.radio-group::after { position: absolute; inset: 0; opacity: 0.25 }
.radio { position: relative; transition: background-color 0.2s ease, transform 0.2s ease }
.radio:hover { transform: translateX(2px) }
.radio input { position: absolute; opacity: 0 }
.radio-visual { box-shadow: inset -2px -2px 0 #111, 2px 2px 0 #111; transition: transform 0.25s ease, background-color 0.2s ease }
.radio:hover .radio-visual { transform: rotate(5deg) }
.radio-dot { transform: scale(0); transition: transform 0.2s ease-out; box-shadow: inset 1px 1px 0 #700, 2px 2px 0 #000 }
.radio input:checked + .radio-visual .radio-dot { transform: scale(1); animation: bounce 0.4s ease-out }
0% { transform: scale(0.3) }
50% { transform: scale(1.2) }
```

### [Triangle Loading Animation](https://codepen.io/banik/pen/gdKWrq)

held: fixed a | on scroll: div.triangle: transform+top ×4, div.container: transform+top ×2 | on hover of a.: div.triangle: transform+top ×4, div.container: transform+top ×2 | made with: position: fixed · @keyframes · 3D (perspective / preserve-3d)

```css
a { position: fixed; bottom: 0 }
.container { position: absolute; animation: rotate 3s linear infinite }
.triangle { position: relative }
.triangle:before, .triangle:after { position: absolute }
.triangle:before { transform: rotate(-135deg) skewX(-45deg) scale(1.414, 0.707) translate(0, -50%) }
.triangle:after { transform: rotate(135deg) skewY(-45deg) scale(0.707, 1.414) translate(50%) }
.triangle:first-of-type { transform: rotate(-60deg) skewX(-30deg) scale(1, 0.866) translate(143.33%, 110%); animation: first 3s cubic-bezier(0.645, 0.045, 0.355, 1) infinite }
.triangle:last-of-type { transform: rotate(0deg) skewX(-30deg) scale(1, 0.866) translate(-100%, -4%); animation: last 3s cubic-bezier(0.645, 0.045, 0.355, 1) infinite }
.triangle.shadow, .triangle.shadow:before, .triangle.shadow:after { perspective: 1000; filter: blur(0.5em) }
from { transform: rotate(0deg) }
to { transform: rotate(-360deg) }
0% { transform: rotate(-60deg) skewX(-30deg) scale(1, 0.866) translate(143.33%, 110%) }
```

### [Modern CSS Toolkit - Slides](https://codepen.io/5t3ph/pen/LYzvrGv)

made with: scroll-snap · :hover · :focus-visible · :has() · (hover: hover) gate · popover

```css
#slides { -ms-scroll-snap-type: x mandatory; scroll-snap-type: x mandatory }
.slide { position: relative }
.slide { scroll-snap-align: center; scroll-snap-stop: always }
.slide + .slide { border-top: 1px dashed }
.slide::before { position: absolute; top: 0.25rem }
.slide::before { top: auto; bottom: 1rem }
.content * + * { margin-top: 0.5em }
.note { margin-top: 4rem }
p + :is(p, h2) { margin-top: 1.5em }
a:focus { outline-offset: 1px }
```

### [Copy Button Click Effect](https://codepen.io/arjunace/pen/dyMdbyr)

made with: @keyframes

```css
.icon-conatiner { position: relative; box-shadow: 20px 20px 15px 0 #ababab4d }
svg:last-child { position: absolute }
.icon-conatiner:active { animation: press 0.2s 1 linear }
.icon-conatiner:active svg:last-child { animation: bounce 0.2s 1 linear }
.text { margin-top: 20px }
0% { transform: scale(1) }
50% { transform: scale(0.92) }
to { transform: scale(1) }
50% { transform: rotate(5deg) translate(20px, -50px) }
to { transform: scale(0.9) rotate(10deg) translate(50px, -80px); opacity: 0 }
@keyframes press animates transform
@keyframes bounce animates transform, opacity
```

### [Radial animated progress #2](https://codepen.io/thebabydino/pen/vYLzwmY)

held: fixed a | on hover of a.: a.: filter | made with: position: fixed · @keyframes · transition · :hover · mask

```css
#btn--yp { position: fixed; bottom: 1em; filter: grayscale(1) drop-shadow(0 0 1px #e8e0e0); transition: 0.5s }
#btn--yp:before { position: absolute; bottom: 100%; animation: float 1s ease-in-out infinite alternate }
#btn--yp:hover, #btn--yp:focus { filter: grayscale(0) drop-shadow(0 0 1px crimson) }
to { transform: translateY(0.75em) }
div { box-shadow: inset 0 0 0 4px #1d1b33; animation: p 8s linear infinite }
div::before { -webkit-mask: linear-gradient(red, red) text, radial-gradient(closest-side, transparent calc(100% - 2*4px - 1px), red calc(100% - 2*4px)) }
div::after { position: absolute; transform: rotate(calc(4grad*var(--p))) translatey(calc(.5*4px - .5*3.5em)); box-shadow: 0 0 1px var(--c1) }
div:nth-child(2) { animation-duration: 5s; animation-delay: -4s }
@keyframes float animates transform
@keyframes p animates --p
```

### [::scroll-marker demo (tabs)](https://codepen.io/anon/pen/wBBMEKV)

made with: position: fixed

```css
&::scroll-marker-group { position: fixed; top: anchor(top) }
li::scroll-marker:target-current { border-bottom: 3px solid black }
```

### [CSS Infinite autoplay carousel](https://codepen.io/studiojvla/pen/qVbQqW)

on scroll: div.slide-track: transform | on hover of img.: div.slide-track: transform | made with: @keyframes

```css
0% { transform: translateX(0) }
100% { transform: translateX(calc(-250px * 7)) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-250px * 7)) }
.slider { box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.125); position: relative }
.slider::before, .slider::after { position: absolute }
.slider::after { top: 0; transform: rotateZ(180deg) }
.slider::before { top: 0 }
.slider .slide-track { -webkit-animation: scroll 40s linear infinite; animation: scroll 40s linear infinite }
@keyframes scroll animates transform
```

### [Pure CSS Select](https://codepen.io/raubaca/pen/VejpQP)

made with: @keyframes · transition · :hover

```css
select { box-shadow: none }
.select { position: relative }
.select::after { position: absolute; top: 1rem; transition: 0.25s all ease }
.select:hover::after { -webkit-animation: bounce 0.5s infinite; animation: bounce 0.5s infinite }
25% { transform: translatey(5px) }
75% { transform: translatey(-5px) }
25% { transform: translatey(5px) }
75% { transform: translatey(-5px) }
@keyframes bounce animates transform
```

### [New Preloader](https://codepen.io/WebSonata/pen/bRaONB)

held: fixed div | on scroll: div.: transform+top | made with: position: fixed · @keyframes

```css
#preloader { position: fixed; top: 0 }
#loader { position: relative; top: 50%; -webkit-animation: spin 2s linear infinite; animation: spin 2s linear infinite }
#loader:before { position: absolute; top: 5px; bottom: 5px; -webkit-animation: spin 3s linear infinite; animation: spin 3s linear infinite }
#loader:after { position: absolute; top: 15px; bottom: 15px; -webkit-animation: spin 1.5s linear infinite; animation: spin 1.5s linear infinite }
0% { -webkit-transform: rotate(0deg); -ms-transform: rotate(0deg); transform: rotate(0deg) }
100% { -webkit-transform: rotate(360deg); -ms-transform: rotate(360deg); transform: rotate(360deg) }
0% { -webkit-transform: rotate(0deg); -ms-transform: rotate(0deg); transform: rotate(0deg) }
100% { -webkit-transform: rotate(360deg); -ms-transform: rotate(360deg); transform: rotate(360deg) }
@keyframes spin animates -webkit-transform, -ms-transform, transform
```

### [CSS scroll themes in oklch](https://codepen.io/argyleink/pen/BaGVyyJ)

on scroll: p.: color+top ×20, h2.: color+top ×6, h1.: color+top, a.: color+top | made with: scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
body, h1, h2, h3, p, a { animation: hue-cycle 1s linear both; animation-timeline: scroll() }
@keyframes hue-cycle animates --hue
```

### [2d Snapping](https://codepen.io/anon/pen/MBWJKm)

made with: scroll-snap

```css
.gallery { -ms-scroll-snap-type: both mandatory; scroll-snap-type: both mandatory }
li { scroll-snap-align: start }
```

### [Dark Blue Toggle - CSS](https://codepen.io/josetxu/pen/oNQXpoz)

made with: transition

```css
* { transition: var(--tr) }
body:before, body:after { position: absolute; opacity: 0.75; filter: blur(0.75px) }
.toggle { position: relative }
label[for=btn] { position: absolute; box-shadow: 0 0 calc(var(--sz) / 50) calc(var(--sz) / 50) #0006, 0 -4px calc(var(--sz) / 10) calc(var(--sz) / 500) #0b0b10, 0 0px calc(var(--sz) / 10) calc(var(--sz) / 50) #b9e1ff88, 0 -4px calc(var(- }
.thumb { position: absolute; top: calc(calc( var(--sz) / 10) + calc(var(--sz) / -20)); box-shadow: calc(var(--sz) / -50) calc(var(--sz) / 50) calc(var(--sz) / 30) 0 #fff2 inset, 0 0 calc(var(--sz) / 10) calc(var(--sz) / 50) #000c }
#btn:checked + label .thumb { transition: var(--tr) }
.thumb:before { position: absolute; filter: blur(1px) }
.light { position: absolute; position: relative; box-shadow: 0 0px calc(var(--sz) / 50) calc(var(--sz) / 50) #0008, 0 -4px calc(var(--sz) / 10) calc(var(--sz) / 500) #000, 0 2px calc(var(--sz) / 10) calc(var(--sz) / 500) #fff8, 0 }
.light:before { transition: var(--tr); position: absolute; box-shadow: 0 0 calc(var(--sz) / 3) 0 #003ef520, 0 0 calc(var(--sz) / 3) calc(var(--sz) / 20) #003ef520 inset }
#btn:checked + label + .light:before { transition: var(--tr); box-shadow: 0 0 calc(var(--sz) / 2.5) 0 var(--lg), 0 0 calc(var(--sz) / 3) calc(var(--sz) / 20) var(--lg) inset, 0 calc(var(--sz) / -20) calc(var(--sz) / 10) calc(var(--sz) / 10) #000c inset }
```

### [Star rating!](https://codepen.io/antoniasymeonidou/pen/WNGdvvQ)

made with: transition

```css
.star { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.star label { position: relative }
.star label:nth-of-type(5):after { animation-delay: 0.5s }
.star label:nth-of-type(4):after { animation-delay: 0.4s }
.star label:nth-of-type(3):after { animation-delay: 0.3s }
.star label:nth-of-type(2):after { animation-delay: 0.2s }
.star label:nth-of-type(1):after { animation-delay: 0.1s }
.star label:after { transition: all 1s ease-out; position: absolute }
```

### [404 on CodePen](https://codepen.io/bramus/pen/eYqazyB)

made with: nothing recognised — read the code

### [Opium Select Dropdown (React.js plugin)](https://codepen.io/prasanjit/pen/LdjQWv)

made with: :hover

### [Skew on scroll using scroll velocity - ScrollTrigger](https://codepen.io/GreenSock/pen/eYpGLYL)

on scroll: img.skewElem: transform+top ×10 | on hover of img.skewElem: img.skewElem: transform+top ×10 | made with: GSAP · ScrollTrigger

```css
body { padding-top: 20vh }
body > img { margin-bottom: 20vh }
```

```js
ScrollTrigger.create({
gsap.to(proxy, {skew: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => skewSetter(proxy.skew)})
```

### [Editorial Layout: The Architecture of Silence](https://codepen.io/GemmaCroad/pen/bNeEKKq)

held: sticky div.section-label, sticky aside.sidebar, sticky div.section-label | made with: position: sticky

```css
.masthead { border-bottom: 1px solid #1a1a1a; padding-bottom: 2rem; margin-bottom: 4rem }
.masthead h1 { text-transform: uppercase }
.hero { margin-bottom: 6rem }
.hero h2 { margin-bottom: 2rem }
.featured { margin-bottom: 6rem }
.image-placeholder { margin-bottom: 0.75rem }
.image-placeholder img { filter: grayscale(100%) contrast(0.85) brightness(1.1) }
.body-content { margin-bottom: 6rem }
.section-label { text-transform: uppercase; position: sticky; top: 2rem }
.sidebar { position: sticky; top: 2rem }
.sidebar h3 { text-transform: uppercase; margin-bottom: 1.5rem }
.quote-section { border-top: 1px solid #e5e5e5; border-bottom: 1px solid #e5e5e5 }
```

### [Antsy Toggles](https://codepen.io/bloqhead/pen/pozQgZE)

on scroll: label.: transform+top | made with: @keyframes · transition · :hover

```css
.tabber { position: relative }
.tabber label { will-change: transform; transform: translateZ(0px); transition: transform 125ms ease-in-out, filter 125ms ease-in-out }
.tabber label:hover { transform: scale(1.15) }
.tabber input[type=radio]#t1:checked ~ .blob { -webkit-animation-name: stretchyRev; animation-name: stretchyRev }
.tabber input[type=radio]#t2:checked ~ .blob { -webkit-animation-name: stretchy; animation-name: stretchy }
.tabber .blob { top: 0; position: absolute; -webkit-animation-duration: 0.5s; animation-duration: 0.5s; -webkit-animation-direction: forwards; animation-direction: forwards; -webkit-animation-iteration-count: 1; animation-iteration-coun }
.tabber .blob:before, .tabber .blob:after { position: absolute; top: 0; transform: scale(1.15); transition: transform 150ms ease; -webkit-animation-name: pulse; animation-name: pulse; -webkit-animation-duration: 0.5s; animation-duration: 0.5s; -webkit-animation-it }
.tabber .blob:before { -webkit-animation-delay: 0.15s; animation-delay: 0.15s }
0% { transform: translateX(0) scaleX(1) }
50% { transform: translateX(0) scaleX(2) }
100% { transform: translateX(100%) scaleX(1) }
0% { transform: translateX(0) scaleX(1) }
```

### [floating personas](https://codepen.io/hans/pen/NWZGjbP)

on scroll: div.img-wrap: transform+top ×6, div.img-wrap: transform ×6 | on hover of img.: div.img-wrap: transform+top ×10, div.img-wrap: transform ×2 | made with: @keyframes · transition

```css
.img-wrap { transition: 400ms all; position: relative; animation-name: wobble; animation-delay: 0s; animation-duration: 4s; animation-iteration-count: infinite; animation-timing-function: ease-in-out }
.img-wrap:before { position: absolute; bottom: 0; transform: translateX(-50%) }
.img-wrap:after { box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.14); text-transform: uppercase; position: absolute; transition: 300ms 400ms all; bottom: 6px; transform: translateX(-50%) }
.img-wrap:nth-child(1) { animation-delay: 0.24s }
.img-wrap:nth-child(2) { animation-delay: 0.48s }
.img-wrap:nth-child(3) { animation-delay: 0.72s }
.img-wrap:nth-child(4) { animation-delay: 0.96s }
.img-wrap:nth-child(5) { animation-delay: 1.2s }
.img-wrap:nth-child(6) { animation-delay: 1.44s }
.img-wrap:nth-child(7) { animation-delay: 1.68s }
.img-wrap:nth-child(8) { animation-delay: 1.92s }
.img-wrap:nth-child(9) { animation-delay: 2.16s }
```

### [Voronoi destruction image carousel - ThreeJS/GSAP](https://codepen.io/loficodes/pen/dyNoLzj)

made with: GSAP · three.js / WebGL · requestAnimationFrame

```css
.buttons { position: absolute; top: 50%; transform: translateY(30vh) }
```

```js
gsap.fromTo(
requestAnimationFrame(this.animate.bind(this))
```

### [Scroll-triggered animations: a little bit of fun with ranges and triggers](https://codepen.io/utilitybend/pen/ogLPVmZ)

held: sticky div.panel-inner | on scroll: div.bar-fill: opacity ×3 | made with: position: sticky · position: fixed · view() timeline · @keyframes

```css
from { scale: 0 1; opacity: 0 }
to { scale: 1 1; opacity: 1 }
.bar-fill { position: absolute; inset: 2px; scale: 0 1; opacity: 0; animation: activate 0.12s ease-out both; animation-trigger: attr(data-trigger-ref type(<custom-ident>)) play-forwards play-backwards }
.trigger { position: absolute; inset: 0 }
.trigger-zone { position: relative }
span { text-transform: uppercase }
.panel-inner { position: sticky }
.panel-title { text-transform: uppercase }
.bar-track { position: relative; box-shadow: inset 0 1px 3px oklch(0% 0 0 / 0.25) }
.panel { position: sticky }
body::before { position: fixed; inset: 0 }
@keyframes activate animates scale, opacity
```

### [Movie Card: Pulp Fiction](https://codepen.io/GemmaCroad/pen/wBBPpPZ)

made with: transition · :hover

```css
body { background-position: center }
.movie-card { box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6); position: relative }
.movie-img-container { position: relative }
.movie-img { background-position: 37% 23% !important }
.movie-overlay { position: absolute; top: 0 }
.movie-content { position: relative; margin-top: -120px }
.title-row { margin-bottom: 6px }
.year-badge { opacity: 0.85 }
.rating-badge { margin-top: 3px; box-shadow: 0 2px 4px rgba(0,0,0,0.2) }
.genres { margin-bottom: var(--section-space) }
.genre-tag { transition: all 0.2s ease }
.ratings-row { margin-bottom: var(--section-space); padding-bottom: var(--section-space); border-bottom: 1px solid rgba(255, 255, 255, 0.1) }
```

### [CSS-only scroll-driven text highlights](https://codepen.io/jlengstorf/pen/bGzBwRm)

made with: scroll-driven animation (animation-timeline) · view() timeline · @keyframes · ScrollTrigger

```css
to { background-position: 0 }
mark { animation: highlight linear forwards; animation-timeline: view(60% 20%); background-position: 100% }
@keyframes highlight animates background-position
```

### [Hexagon Badges with Font Awesome icons](https://codepen.io/oliviale/pen/qpPByV)

on hover of a.: a.: background | made with: transition · :hover

```css
.badge { position: relative; top: 0; transition: all 0.2s ease }
.badge:before, .badge:after { position: absolute; top: 0; bottom: 0 }
.badge:before { transform: rotate(60deg) }
.badge:after { transform: rotate(-60deg) }
.badge:hover { top: -4px }
.badge .circle { position: absolute; top: 0; bottom: 0 }
.badge .circle i.fa { margin-top: 8px }
.badge .font { margin-top: 1em }
.badge .ribbon { position: absolute; bottom: 12px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.27); text-transform: uppercase }
footer a .icons { margin-top: 12px }
```

### [Animate CSS Grid with View Transitions (now with expanding squares!)](https://codepen.io/bramus/pen/zYmjaJq)

made with: view transitions · transition · :hover · mix-blend-mode

```css
::view-transition-group(*) { animation-duration: 0.5s }
::view-transition-old(*), ::view-transition-new(*) { animation-name: none; mix-blend-mode: normal }
.card--expanded .card__img { transform: scale(1.03) }
.card { position: relative }
.card__img { transition: transform 1s }
.mb-4 { margin-bottom: 1rem }
button:focus { box-shadow: 0 0 0 3px #7396e4 }
```

```js
startViewTransition(_ => grid.classList.toggle("grid--big-columns"))
startViewTransition(_ => grid.classList.toggle("grid--big-gap"))
startViewTransition(addCard)
startViewTransition(_ => {
```

### [Bouncing tab bar](https://codepen.io/aaroniker/pen/LYGGZzx)

held: fixed a.dribbble, fixed a.twitter | made with: position: fixed · GSAP

```css
#tabbar { --menu-icon-rotate: 0; --menu-icon-add-opacity: 0; --options-opacity: 0; margin-top: 10%; position: relative }
#tabbar.gooey { filter: url(#goo) }
#tabbar:before { position: absolute; bottom: -4px }
#tabbar ul { position: absolute; top: var(--list-spacing-top, 0) }
#tabbar ul li { transform: translate(calc(var(--x, 0) * var(--x-change, 1px)), calc(var(--y, 0) * var(--x-change, 1px))) translateZ(0) }
#tabbar ul.options li button svg { opacity: var(--options-opacity) }
#tabbar ul.menu { --list-spacing-top: 46px }
#tabbar ul.menu li.add { position: relative }
#tabbar ul.menu li.add button:before { position: absolute; top: -12px; opacity: var(--menu-icon-add-opacity); transform: translateY(calc(var(--menu-icon-move) * 1px)) translateZ(0) }
#tabbar ul.menu li.add button svg { transform: translateY(calc(var(--menu-icon-move) * 1px)) rotate(calc(var(--menu-icon-rotate) * 1deg)) translateZ(0) }
#tabbar svg { position: relative; transform: translateZ(0) }
body .dribbble { position: fixed; bottom: 20px }
```

```js
gsap.registerPlugin(MorphSVGPlugin)
gsap.to(background, {
gsap.to(tabbar, {
```

### [Scroll-state query to check which item is snapped with CSS](https://codepen.io/utilitybend/pen/xxoNyxY)

held: fixed div.warning | made with: position: fixed · scroll-snap · transition · container queries

```css
.list { scroll-snap-type: x mandatory }
span { transition: background 0.4s ease-out }
```

### [CSS Carousel - Template Starter](https://codepen.io/web-dot-dev/pen/MYWVVYN)

made with: scroll-snap · :hover · :focus-visible · prefers-reduced-motion

```css
& li { scroll-snap-align: center }
&::scroll-button(*):focus-visible { outline-offset: 5px }
&::scroll-button(*):not(:disabled):active { scale: 90% }
&::scroll-marker { outline-offset: 4px; scroll-snap-align: center }
```

### [Authentic Weather Loader](https://codepen.io/tholman/pen/yenku)

on scroll: span.drop: opacity ×6, svg.[object: transform+top | made with: @keyframes

```css
.preloader { position: absolute; margin-top: -100px; top: 50% }
#cloud { position: relative }
#sun { margin-top: 6px; opacity: 0; position: absolute; top: 15px; animation-name: rotate; animation-duration: 16000ms; animation-iteration-count: infinite; animation-timing-function: linear }
0% { transform: rotateZ(0deg) }
100% { transform: rotateZ(360deg) }
.rain { position: absolute; margin-top: -32px }
.drop { opacity: 1; animation-name: drop; animation-duration: 350ms; animation-iteration-count: infinite }
.drop:nth-child(1) { animation-delay: -130ms }
.drop:nth-child(2) { animation-delay: -240ms }
.drop:nth-child(3) { animation-delay: -390ms }
.drop:nth-child(4) { animation-delay: -525ms }
.drop:nth-child(5) { animation-delay: -640ms }
```

### [Pulse Avatar on click with TweenMax](https://codepen.io/dghez/pen/GpEbPJ)

held: fixed div.avatar-container, fixed div.name, fixed div.info | on scroll: div.pulse: transform+opacity+top ×4, div.name: transform+opacity+top | on hover of img.: div.pulse: transform+opacity | made with: position: fixed · GSAP

```css
.avatar-container { position: fixed; top: 50%; transform: translate(-75px, -75px) }
.avatar { position: absolute }
.pulse { position: absolute; top: 0 }
.name { position: fixed; top: calc(50% + 130px); transform: translateX(-50%); text-transform: uppercase; opacity: 0 }
.info { text-transform: uppercase; position: fixed; bottom: 10px; opacity: 0.5 }
```

### [Video with motion preference](https://codepen.io/smashingmag/pen/qBXNjqR)

on hover of button.video__btn: button.video__btn: background | made with: transition · :hover · prefers-reduced-motion

```css
.video__wrapper { position: relative }
.video__wrapper::after { position: absolute; top: 0 }
.video__btn { position: absolute; bottom: 1rem; transition: background-color 200ms }
.video__btn:is(:focus) { outline-offset: 2px }
```

### [Glitchy Progress Display](https://codepen.io/MyXoToD/pen/JjpLzQv)

made with: @keyframes

```css
.range { position: relative; transform: skew(30deg) }
.range:before { position: absolute; top: 0; -webkit-animation: load 0.5s forwards linear, glitch 2s infinite linear; animation: load 0.5s forwards linear, glitch 2s infinite linear }
.range:after { position: absolute; top: 50%; transform: translateY(-50%) skewX(-30deg) }
.range__label { transform: skew(-30deg) translateY(-100%) }
0%, 5% { transform: translate(0, 0) }
1% { transform: translate(-5%, -10%) }
2% { transform: translate(10%, 30%) }
3% { transform: translate(-43%, 10%) }
4% { transform: translate(2%, -23%) }
0%, 5% { transform: translate(0, 0) }
1% { transform: translate(-5%, -10%) }
2% { transform: translate(10%, 30%) }
```

### [Tailwind Progress Bar Shimmer Effect](https://codepen.io/joshpike/pen/mdpOaej)

on scroll: div.bg-gradient-to-r: transform+top | made with: @keyframes

```css
0% { transform: translateX(-100%) }
100% { transform: translateX(100%) }
#progress-bar { animation: progress 1s ease-in-out infinite }
@keyframes progress animates transform
```

### [Sidenav with contain overscroll-behavior](https://codepen.io/anon/pen/BaZpGqN)

held: fixed nav | made with: position: fixed

```css
nav { position: fixed; top: 0; bottom: 0 }
li { text-transform: capitalize }
```

### [CodePen Challenge details and summary](https://codepen.io/frogmcw/pen/deqRwa)

made with: transition

```css
details { position: relative; transition: all .3s }
details + details { margin-top: 20px }
details[open] { box-shadow: 2px 2px 20px rgba(0,0,0,.2) }
summary:focus::after { position: absolute; top: 0; box-shadow: 0 0 0 5px rebeccapurple }
.control-icon { transition: .3s ease }
details[open] .control-icon-close { transition: .3s ease }
```

### [Pure css download button](https://codepen.io/RSH87/pen/aNBKvw)

on scroll: div.btn: background+color, span.me: color | made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.container .btn { text-transform: uppercase; transition: all 0.3s ease }
.container .btn .mo { position: relative; bottom: -150px; opacity: 0 }
.container .btn:before { position: absolute; bottom: 3px }
.container .btn:after { position: absolute; bottom: 3px }
.container input[type=checkbox]:checked ~ .btn { padding-top: 70px; padding-bottom: 70px; transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) }
.container input[type=checkbox]:checked ~ .btn:before { transition: all 3.5s linear }
.container input[type=checkbox]:checked ~ .btn:after { transition: all 0.3s ease-in-out }
.container input[type=checkbox]:checked ~ .btn .mo { transition: bottom 0.4s ease, opacity 1s ease; bottom: 0px; opacity: 1 }
```

### [trippy text (inspired by creativesouth.com)](https://codepen.io/rachsmith/pen/KKxLEjY)

held: fixed p.about | on scroll: span.copy: transform+top ×4 | on hover of a.: span.copy: transform+top ×4 | made with: position: fixed · 3D (perspective / preserve-3d) · pointer / mouse tracking · requestAnimationFrame

```css
header { position: relative }
h1, span.copy { position: absolute; top: 0px }
.copy-1 { transform: perspective(500px) translate3d(0, 0, -15px) }
.copy-2 { transform: perspective(500px) translate3d(0, 0, -30px) }
.copy-3 { transform: perspective(500px) translate3d(0, 0, -45px) }
.copy-4 { transform: perspective(500px) translate3d(0, 0, -60px) }
.about { position: fixed; bottom: 0 }
.about a { text-underline-offset: 2px }
```

```js
requestAnimationFrame(updateTextPosition)
addEventListener("mousemove", trackMousePosition)
```

### [React Easy Carousel](https://codepen.io/anon/pen/XWNVNgQ)

made with: scroll() timeline · scroll-snap · transition · :hover · scroll listener

```js
addEventListener('scroll', update, { passive: true })
```

### [A Fancy CSS Animated Gallery Covers (Now Responsive)](https://codepen.io/simtoalev/pen/YJGXyE)

on hover of a.gallery-box: span.gallery-box__img-container: transform+top, img.gallery-box__img: transform+top | made with: transition · :hover

```css
.gallery-box { box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.3); position: relative }
.gallery-box__img-container { transform: rotate(25deg); position: absolute; top: -75px; transition: all 0.4s ease }
.gallery-box__img-container { top: -180px }
.gallery-box__img-container { top: -120px }
.gallery-box__img-container { top: -190px }
.gallery-box__img { transform: rotate(-25deg) scale(1.1); transition: all 0.4s ease }
.gallery-box__text-wrapper { transition: all 0.4s ease; position: absolute; top: 250px }
.gallery-box__text { box-shadow: 8px 0 0 rgba(0, 0, 0, 0.7), -8px 0 0 rgba(0, 0, 0, 0.7) }
.gallery-box:hover .gallery-box__img-container { transform: rotate(0); top: -120px }
.gallery-box:hover .gallery-box__img { transform: rotate(0deg) scale(1) }
.gallery-box:hover .gallery-box__text-wrapper { top: 288px }
```

### [Mock Spine Layout](https://codepen.io/spudmashmedia/pen/BameNQx)

on hover of a.: img.h-12: shadow | made with: nothing recognised — read the code

### [Tailwind Icon Buttons](https://codepen.io/colinkeany/pen/MWxQdxz)

on scroll: button.cursor-pointer: background, div.p-3: shadow, span.material-symbols-outlined: color | on hover of button.cursor-pointer: button.cursor-pointer: background ×2, div.p-3: shadow ×2, span.material-symbols-outlined: color ×2 | made with: nothing recognised — read the code

### [Star Toggle](https://codepen.io/aaroniker/pen/ExKgrmO)

held: fixed a.dribbble, fixed a.twitter | made with: position: fixed · transition · clip-path · GSAP

```css
.star-toggle { --scale: 1; --rotate: 0deg; --hole-scale: 0; --face-scale: 1; transform: translateY(var(--toggle-y)) translateZ(0) }
.star-toggle .icon { position: relative; -webkit-clip-path: ellipse(150% 50% at 50% 50%); clip-path: ellipse(150% 50% at 50% 50%); transform: scale(var(--icon-s, 1)) translateZ(0); transition: transform 0.1s }
.star-toggle .icon:before { margin-top: auto; box-shadow: inset 0 6px 0 0 var(--hole-inner); transform: scale(var(--hole-scale)) }
.star-toggle .icon .star { position: absolute; bottom: 0; transform: translateY(var(--y)) rotate(var(--rotate)) scale(var(--scale)); -webkit-clip-path: var(--clip, polygon(50% 0, 65% 32%, 100% 37%, 75% 63%, 80% 100%, 50% 79%, 20% 100%, 25% 63%, 0% }
.star-toggle .icon .star:before, .star-toggle .icon .star:after, .star-toggle .i { position: absolute; transition: background 0.2s, box-shadow 0.2s }
.star-toggle .icon .star:before, .star-toggle .icon .star .eye { top: 16px }
.star-toggle .icon .star:after { top: 23px; transition: border-radius 0.2s }
.star-toggle .icon .star .eye { transform: scaleY(var(--face-scale)) }
.star-toggle .icon .star .eye:before { position: absolute; top: 5px; opacity: var(--face-tear-o); transform: translateY(var(--face-tear-y)) scaleY(var(--face-tear-s)) }
body .dribbble { position: fixed; bottom: 20px }
body .twitter { position: fixed; bottom: 14px }
```

```js
gsap.to(toggle, {
```

### [Stylish Checkbox](https://codepen.io/stefanjudis/pen/ojDif)

made with: transition · :hover

```css
h1 { position: relative }
h1:before, h1:after { position: absolute; top: -50px; -moz-box-shadow: 0 1px 1px #000; -webkit-box-shadow: 0 1px 1px #000; box-shadow: 0 1px 1px #000; -moz-transition: margin 0.2s ease-in; -o-transition: margin 0.2s ease-in; -webkit-transitio }
.switch { position: relative; -moz-box-shadow: 0 0.333em 0.75em #393939; -webkit-box-shadow: 0 0.333em 0.75em #393939; box-shadow: 0 0.333em 0.75em #393939 }
.switch:before, .switch:after { position: absolute }
.switch:before { top: 0; -moz-box-shadow: inset 0 5px 10px #e4f9f0; -webkit-box-shadow: inset 0 5px 10px #e4f9f0; box-shadow: inset 0 5px 10px #e4f9f0 }
.switch:after { bottom: 0; -moz-box-shadow: inset 0 -3px 5px #9ec; -webkit-box-shadow: inset 0 -3px 5px #9ec; box-shadow: inset 0 -3px 5px #9ec }
.switch__circle { position: absolute; top: 2%; -moz-box-shadow: 0 0 1em rgba(255, 255, 255, 0.2); -webkit-box-shadow: 0 0 1em rgba(255, 255, 255, 0.2); box-shadow: 0 0 1em rgba(255, 255, 255, 0.2) }
.switch__circle:before, .switch__circle:after { position: absolute }
.switch__circle:before { top: 7.5% }
.switch__circle:after { top: 15%; -moz-box-shadow: inset 0 0.175em 0.5em #393939; -webkit-box-shadow: inset 0 0.175em 0.5em #393939; box-shadow: inset 0 0.175em 0.5em #393939 }
.switch__innerCircles { position: absolute; top: 30% }
.switch__innerCircles:before, .switch__innerCircles:after { position: absolute; top: 0; -moz-box-shadow: inset 0 1px 1px #000; -webkit-box-shadow: inset 0 1px 1px #000; box-shadow: inset 0 1px 1px #000 }
```

### [#CodePenChallenge: Toggles](https://codepen.io/vii120/pen/xxQxoxM)

on scroll: div.deco-1: transform+top, div.deco-2: transform+top | made with: @keyframes · transition · backdrop-filter

```css
body { position: relative }
.deco { position: absolute; top: 0 }
.deco .deco-1 { position: absolute; top: 55%; transform: translate(-50%, -50%); animation: deco-move 8s infinite alternate; filter: blur(10px) }
.deco .deco-2 { position: absolute; top: 45%; transform: translate(-50%, -50%); animation: deco-move 6s infinite alternate; filter: blur(10px) }
.deco:after { position: absolute; top: 0; backdrop-filter: blur(50px) }
.wrapper { box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3), -3px -3px 6px rgba(255, 255, 255, 0.8) }
input#checkbox:checked + .button { filter: none }
.button { position: relative; box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.3), inset -2px -2px 5px rgba(255, 255, 255, 0.8) }
.button .dot { position: absolute; top: 50%; transform: translateY(-50%); box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3), -3px -3px 6px rgba(255, 255, 255, 0.8); transition: all 0.3s; will-change: left, background-color }
to { transform: translate(-50%, -50%) rotate(360deg) }
@keyframes deco-move animates transform
```

### [Card Elevation Effect](https://codepen.io/anon/pen/LYbbKXy)

on scroll: div.card: shadow | made with: transition · :hover

```css
html, body { transition: background-color 0.2s; will-change: background-color }
.card { box-shadow: 0 0 50px rgba(0, 0, 0, 0.15); transition: box-shadow .3s }
.card:hover { box-shadow: 0 0 55px rgba(0, 0, 0, 0.2), 0 0 60px rgba(0, 0, 0, 0.1) }
.card__header { position: relative }
.card__watermark { position: absolute; bottom: 10px }
.card__watermark::after { position: relative; text-transform: uppercase }
.card__title { text-transform: uppercase }
.card__body { position: relative }
.card__image { position: absolute; top: -290px }
.card__wish-list { position: relative; text-transform: uppercase }
.card__category { text-transform: uppercase }
```

### [Animated Share Interaction](https://codepen.io/jkantner/pen/rNpMKOr)

on scroll: button.share__btn: background | made with: transition · :hover · :focus-visible

```css
body { transition: background-color 0.3s }
.share { position: relative }
.share__btn, .share__link { transition: background-color 0.15s linear }
.share__btn { position: relative }
.share__btn-icon-1a, .share__btn-icon-1b, .share__btn-icon-1c, .share__btn-icon- { transition: all 0.3s ease-in-out }
.share__link-icon { transform: scale(0); transition: transform 0.3s cubic-bezier(0.42,-0.58,0.58,1) }
.share__links, .share__links:before { position: absolute; top: 0 }
.share__links { padding-top: 3em; transition: visibility 0.3s 0.6s steps(1,start) }
.share__links:before { transform: translate(0,-100%); transition: background-color 0.3s, transform 0.3s 0.3s ease-in-out }
.share__btn--open .share__btn-icon-1a, .share__btn--open .share__btn-icon-1b { transform: rotate(45deg) translateY(-3px) }
.share__btn--open .share__btn-icon-1c { transform: rotate(45deg) }
.share__btn--open .share__btn-icon-2a { transform: translateY(-1px) rotate(45deg) translateX(-8px) }
```

### [9. Reduced stagger with broken window](https://codepen.io/anon/pen/XWpJgRK)

on scroll: div.box: transform ×10 | made with: GSAP

```css
.box { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

```js
gsap.timeline({
gsap.fromTo(LOOP, {
```

### [Aspect ratio CTA](https://codepen.io/michellebarker/pen/abVJozd)

made with: nothing recognised — read the code

```css
.cta { box-shadow: 0.65rem 0.65rem 0 hsl(var(--shadowColor) / 1) }
```

### [Shadow of a Shadow Pt. 1](https://codepen.io/smashingmag/pen/ZEVGymY)

made with: nothing recognised — read the code

```css
.item { box-shadow: 0 0 20px black; filter: drop-shadow(-30px 0 0 blue) }
```

### [Profile Card UI Design Cool Hover Effect](https://codepen.io/FrankieDoodie/pen/NOJpVX)

on hover of img.img-fluid: img.img-fluid: transform+shadow+top | made with: transition · :hover

```css
body { background-position: center }
.our-team { margin-bottom: 30px; position: relative }
.our-team .picture { margin-bottom: 50px; position: relative }
.our-team .picture::before { position: absolute; bottom: 135%; opacity: 0.9; transform: scale(3); transition: all 0.3s linear 0s }
.our-team .picture::after { position: absolute; top: 0 }
.our-team .picture img { transform: scale(1); transition: all 0.9s ease 0s }
.our-team:hover .picture img { box-shadow: 0 0 0 14px #f7f5ec; transform: scale(0.7) }
.our-team .title { text-transform: capitalize }
.our-team .social { position: absolute; bottom: -100px; transition: all 0.5s ease 0s }
.our-team:hover .social { bottom: 0 }
.our-team .social li a { transition: all 0.3s ease 0s }
```

### [Mobile Menu Animation](https://codepen.io/melnik909/pen/JpJPYp)

held: fixed nav.cdpn-mobile-menu | made with: position: fixed · transition · :focus-visible · :has() · prefers-reduced-motion

```css
:where(.ra-button) { text-transform: var(--ra-button-text-transform, inherit) }
.uia-hamburger { position: var(--uia-hamburger-position, relative) }
.uia-hamburger__group::before, .uia-hamburger__group::after, .uia-hamburger__lab { position: absolute }
[data-uia-hamburger-skin="2"] .uia-hamburger__group::before { transform: var(--uia-hamburger-top-line-transform) }
[data-uia-hamburger-skin="2"] .uia-hamburger__label { transform: var(--uia-hamburger-middle-line-transform); opacity: var(--uia-hamburger-middle-line-opacity) }
[data-uia-hamburger-skin="2"] .uia-hamburger__group::after { transform: var(--uia-hamburger-last-line-transform) }
[data-uia-hamburger-skin="2"] .uia-hamburger__group::before, [data-uia-hamburger { transition-property: transform }
[data-uia-hamburger-skin="2"] .uia-hamburger__label { transition-property: transform, opacity }
.ha-screen-reader { position: var(--ha-screen-reader-position, absolute) }
.cdpn-mobile-menu { --uia-hamburger-position: absolute; position: fixed }
.cdpn-mobile-menu__container { transition: opacity .2s ease-out; opacity: 0 }
.cdpn-mobile-menu__list { text-transform: uppercase }
```

### [Neumorphism Soft Buttons](https://codepen.io/SkriptKiddy/pen/XWJEpyV)

made with: :hover

```css
#banner { transform: translateX(-50%); position:absolute; box-shadow: 2px 2px 3px #555, -2px -2px 3px #222, -1px 1px 3px #555, 1px -1px 3px #555, inset -2px -2px 3px #555, inset 2px 2px 3px #222 }
.container { position:absolute; top:50%; transform: translate(-50%,-50%) }
#output { position:relative }
.button { position:relative; box-shadow: -2px -2px 3px #555, 2px 2px 3px #222, 1px -1px 3px #555, -1px 1px 3px #555, inset 2px 2px 3px #555, inset -2px -2px 3px #222 }
.button:hover { box-shadow: 2px 2px 3px #555, -2px -2px 3px #222, -1px 1px 3px #555, 1px -1px 3px #555, inset -2px -2px 3px #555, inset 2px 2px 3px #222 }
```

### [Sticky Section Headers](https://codepen.io/smashingmag/pen/OJeaWrM)

held: sticky h2.sticky-header, sticky h2.sticky-header, sticky h2.sticky-header | on scroll: li.: background+top | made with: position: sticky · transition · :hover

```css
.rolodex { box-shadow: var(--rolodex-shadow) }
.sticky-header { position: sticky; top: 0; border-bottom: var(--border-width) solid var(--header-border-color) }
ul li { border-bottom: var(--border-width) solid var(--border-color); transition: background-color 0.3s }
```

### [Infinity Preloader](https://codepen.io/jkantner/pen/mdKOpbe)

made with: @keyframes · transition

```css
body { transition: background-color var(--trans-dur) }
.ip__track { transition: stroke var(--trans-dur) }
.ip__worm1, .ip__worm2 { animation: worm1 2s linear infinite }
.ip__worm2 { animation-name: worm2 }
50% { animation-timing-function: steps(1) }
50.01% { animation-timing-function: linear }
@keyframes worm1 animates stroke-dashoffset, animation-timing-function
@keyframes worm2 animates stroke-dashoffset
```

### [FLIPping Gallery App](https://codepen.io/davidkpiano/pen/xPVJwm/)

made with: nothing recognised — read the code

### [Custom <select> examples](https://codepen.io/argyleink/pen/wvYrZEV)

held: sticky label, sticky label, sticky label, fixed div | made with: position: sticky · position: fixed · view transitions · @starting-style · transition · :hover · :focus-visible · :has() · popover

```css
&::picker(select) { transition: opacity .2s ease, transform .2s var(--ease-out-3), display .2s allow-discrete, overlay .2s allow-discrete }
&::picker(select):not(:popover-open) { opacity: 0; transform: scale(.95) }
&::picker(select):popover-open { opacity: 1; transform: scale(1) }
&::picker(select):popover-open { opacity: 0; transform: scale(.95) }
@starting-style { opacity: 0; transform: translateY(10px) }
&:focus-visible { outline-offset: -3px }
& svg { transition: transform .3s var(--ease-elastic-out-2) }
&:open > button svg { transform: rotate(.5turn) }
& label { position: sticky; top: 0 }
&:focus-visible { outline-offset: -1px }
```

### [404 on CodePen](https://codepen.io/anon/pen/jEPJpae)

made with: nothing recognised — read the code

### [Bootstrap checkbox with custom icon](https://codepen.io/sstauross/pen/NgjWqz)

made with: transition

```css
.checkbox label .checkbox-icon-wrapper { position: relative }
.checkbox label .checkbox-icon-wrapper .checkbox-icon { position: absolute; top: 48% }
.checkbox label input[type=checkbox] + .checkbox-icon-wrapper > .checkbox-icon { opacity: 0; transform: scale(1); transition: all 0.1s ease-in }
.checkbox label input[type=checkbox]:checked + .checkbox-icon-wrapper > .checkbo { transform: scale(1); opacity: 1 }
.checkbox label input[type=checkbox] + .checkbox-icon-wrapper > .checkbox-icon { opacity: 0; transform: scale(1); transition: all 0.1s ease-in }
.checkbox label input[type=checkbox]:checked + .checkbox-icon-wrapper > .checkbo { transform: scale(1); opacity: 1 }
```

### [Item transitions (auto height)](https://codepen.io/web-dot-dev/pen/vYqqydw)

made with: @starting-style · transition · clip-path

```css
.item { opacity: 1; transform-origin: bottom; transition: opacity 0.5s, transform 0.5s, height 0.5s, display 0.5s allow-discrete }
.item { opacity: 0 }
.is-deleting { opacity: 0; transform: skewX(50deg) translateX(-25vw) }
.sr-only { clip-path: inset(50%); position: absolute }
footer { opacity: 0.7 }
```

### [Front End Day 64 - Material Card with menu](https://codepen.io/sean_codes/pen/NpJRzM)

held: fixed div.bg | made with: position: fixed · transition · :hover

```css
body { padding-top: 5rem }
.bg { background-position: center; position: fixed; filter: blur(10px); top: 0 }
.card { box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.35); position: relative }
.card .display { background-position: center }
.card .nav .btn { position: relative }
.card .nav .menu { position: absolute; top: 55px; transform: translateY(-100%) translateX(-100%) scale(0.5, 0); box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.25); opacity: 0; transition: all 0.2s }
.card .nav #menu:checked ~ .menu { transform: translateY(-100%) translateX(-100%) scale(1, 1); opacity: 1 }
```

### [Modal window destroy concept](https://codepen.io/sol0mka/pen/XJjLxe)

made with: transition · :hover · clip-path · <dialog> · requestAnimationFrame

```css
.hint { position: absolute; opacity: 0 }
.hint--1 { top: 15rem; padding-top: 1.75rem; base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB3aWR0aD0iNzVweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgNzUgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly9 }
.hint--2 { top: -1.25rem; padding-top: 0.625rem; base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB3aWR0aD0iNzRweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgNzQgMTgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA }
body { base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB3aWR0aD0iNTA0cHgiIGhlaWdodD0iNDMxcHgiIHZpZXdCb3g9IjAgMCA1MDQgNDMxIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIge }
.look { position: absolute; top: 50%; margin-top: -3.4375rem }
.launch-button { box-shadow: 0 0 0 3.875rem #fff; position: absolute; text-transform: uppercase; top: 50%; margin-top: -1.40625rem }
.launch-button:hover .launch-button__glare { transition: all 0.4s linear }
.launch-button:active { opacity: 0.95 }
.launch-button__glare { position: absolute; transform: rotate(25deg); top: -50% }
.launch-button__glare:after { position: absolute; top: 0 }
button:hover, .button:hover { opacity: 0.9 }
.modal-holder { position: absolute; top: 50%; margin-top: -14.0625rem }
```

```js
requestAnimationFrame(this.loop)
```

### [Dashboard Layout Design - iPad Pro](https://codepen.io/nathan5x/pen/XOOpyP)

made with: :hover

```css
.love-text { margin-top: 20px }
.container { margin-top: 20px; margin-bottom: 20px; position: relative }
.sidebar { position: relative }
.sidebar .logo .icon { top: 16px; position: absolute }
.sidebar nav { position: relative }
.sidebar .more-options { position: absolute; bottom: 16px }
.main-content .app header.sub-menu { box-shadow: 0px 1px 1px 1px rgba(181, 181, 181, 0.38) }
.main-content .app header.sub-menu .menu li { text-transform: uppercase }
.main-content .app header.sub-menu .menu li.selected, .main-content .app header. { position: relative }
.main-content .app header.sub-menu .menu li.selected::after, .main-content .app  { border-bottom: 5px solid #0068ff; position: absolute; bottom: 0 }
.main-content .app header.sub-menu .user-options .icon { box-shadow: 0px 1px 1px 1px rgba(181, 181, 181, 0.38); position: relative }
.main-content .app header.sub-menu .user-options .icon .badge { position: absolute; top: -10px; padding-top: 5px }
```

### [3D Rotating Navigation](https://codepen.io/arjancodes/pen/wtqIr)

on hover of li.: li.: transform | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
section { position: relative }
h1 { text-transform: uppercase }
nav { position: relative; top: 0 }
nav ul li { position: relative; text-transform: uppercase; transition:all .4s ease-out }
nav ul li:after { position: absolute; top:0; opacity:.5; transform: perspective(400px) rotateY(90deg); transition:all .4s ease-out }
nav ul li:hover { transform: translateX(-70px) }
nav ul li:hover:after { opacity: 1; transform: perspective(400px) rotateY(0deg) scale(1) }
nav ul li div { position: relative }
.roof { top:2px }
.roof-edge { position: absolute; top: 3px }
.roof-edge:after { position: absolute; top: 3px }
.front { position: relative; top: 3px }
```

### [show cursor image on hover](https://codepen.io/GreenSock/pen/PwqrzeG)

held: fixed img.swipeimage, fixed img.swipeimage, fixed img.swipeimage, fixed img.swipeimage, fixed img.swipeimage | on scroll: img.swipeimage: transform+opacity+top | made with: position: fixed · GSAP · pointer / mouse tracking

```css
.container { border-bottom: 2px solid var(--color-surface25) }
.container img.swipeimage { position: fixed; top: 0; transform: translateX(-50%) translateY(-50%); opacity: 0 }
```

```js
addEventListener("mousemove", align),
gsap.to(image, {
addEventListener("mouseenter", (e) => {
addEventListener("mouseleave", () => fade.reverse())
```

### [Giant Buttons - CodePen Challenge](https://codepen.io/ismailvtl/pen/yLpNMQB)

held: fixed div | on hover of button.confirm: button.confirm: shadow | made with: position: fixed · :hover

```css
#container { position: fixed; top: 0; transform: translate(-50%) }
.container-inner { box-shadow: 5px 6px 0px -2px #620d15, -6px 5px 0px -2px #620d15, 0px -2px 0px 2px #ee9191, 0px 10px 0px 0px #610c14, 0px -10px 0px 1px #e66565, 0px 0px 180px 90px #0d2f66 }
.content { box-shadow: 0px 0px 0px 6px #5e1e21, 0px 0px 8px 6px #84222b, inset 0px 0px 15px 0px #614506, 6px 6px 1px 1px #e66565, -6px 6px 1px 1px #e66565 }
.buttons { margin-top: 40px }
.buttons button.confirm { box-shadow: 0px 0px 0px 4px #7e1522, 0px 2px 0px 3px #e66565 }
.buttons button.confirm:hover { box-shadow: 0px 0px 0px 4px #7e1522, 0px 2px 0px 3px #e66565, inset 2px 2px 10px 3px #4e6217 }
.buttons button.cancel { box-shadow: 0px 0px 0px 4px #7e1522, 0px 2px 0px 3px #e66565 }
.buttons button.cancel:hover { box-shadow: 0px 0px 0px 4px #7e1522, 0px 2px 0px 3px #e66565, inset 2px 2px 10px 3px #822828 }
```

### [Cookie Loader](https://codepen.io/Alliana-Yang/pen/XJbbjXr)

on scroll: span.: transform+top ×10, div.bite: opacity+top ×3, div.cookie-box: transform+top | made with: @keyframes

```css
.cookie-box { animation: bounce 3s ease infinite; margin-top: 50px }
.cookie2 { transform: rotate(40deg) }
.bite { opacity: 0% }
#first { transform: translate(170px, -40px) }
#second { transform: translate(85px, -30px) }
#third { transform: translate(130px, 0px) }
#fourth { transform: translate(80px, 40px) }
#fifth { transform: translate(130px, 75px) }
#sixth { transform: translate(170px, 40px) }
.loading span { animation: bounce 3s ease infinite }
.loading span:nth-child(1) { animation-delay: 0s }
.loading span:nth-child(2) { animation-delay: 0.2s }
```

### [Sticky: eg 1](https://codepen.io/shadeed/pen/VwzGpRa)

held: sticky aside | made with: position: sticky

```css
aside { position: sticky; top: 0 }
main p { margin-bottom: 1rem }
nav li:not(:last-child) { margin-bottom: 1rem }
h2 { margin-bottom: 1rem }
```

### [Scroll-Linked Animations: Element-Based Offsets Comparison (@scroll-timeline version)](https://codepen.io/bramus/pen/RwojjbM)

held: fixed input, fixed details, fixed dialog, fixed dialog.sda_update | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · @keyframes · <dialog>

```css
.demo > li > div { animation: reveal 1s linear }
scroll-timeline box-1 { scroll-offsets: selector(#demo1-box1) end 0, selector(#demo1-box1) start 0 }
#demo1-box1 > div { animation-timeline: box-1 }
scroll-timeline box-2 { scroll-offsets: selector(#demo1-box2) end 1, selector(#demo1-box2) start 1 }
#demo1-box2 > div { animation-timeline: box-2 }
#demo1-box3 > div { animation-timeline: box-3 }
scroll-timeline box-4 { scroll-offsets: selector(#demo1-box4) start 1, selector(#demo1-box4) start 0 }
#demo1-box4 > div { animation-timeline: box-4 }
scroll-timeline box-5 { scroll-offsets: selector(#demo1-box5) end 1, selector(#demo1-box5) start 0 }
#demo1-box5 > div { animation-timeline: box-5 }
main .debug { opacity: 0 }
#debug { position: fixed; top: 1em }
```

### [Tab Bar Interaction #4](https://codepen.io/dev_loop/pen/YzwqzLV)

made with: @keyframes · transition · :hover · clip-path

```css
:root { --phone-animation-duration: 1.2s; --phone-animation-delay: 500ms; --phone-animation-easing: ease; --phone-animation-direction: forwards; --screen-animation-duration: 0.8s; --screen-animation-delay: 1800ms; --screen-anima }
.phone { position: relative; transform: translateY(-200%); animation: show-phone var(--phone-animation-duration) var(--phone-animation-easing) var(--phone-animation-direction); animation-delay: var(--phone-animation-delay); box-s }
.phone__screen { position: absolute; top: 0; animation: hide-screen-top var(--screen-animation-duration) var(--screen-animation-easing) var(--screen-animation-direction); animation-delay: var(--screen-animation-delay) }
.phone__left, .phone__right { position: absolute; top: 0 }
.phone__left { transform: translateX(-2px) }
.phone__right { transform: translateX(2px) }
.phone__bottom { position: absolute; bottom: 0; transform: translateX(-50%) }
.phone__bottom .button__home { position: relative }
.phone__bottom .button__home::after { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.app { position: absolute; top: 0 }
.app--content { position: absolute; top: -5% }
.app--content span { transform: translateY(25%) rotate(5deg); opacity: 0; animation: card-pop-in 350ms var(--screen-animation-easing) var(--screen-animation-direction); animation-delay: calc(300ms + var(--screen-animation-delay) + 30ms * var }
```

### [Animated Icon Nav](https://codepen.io/jkantner/pen/LYQmwRr)

made with: @keyframes · transition · :hover · :focus-visible · 3D (perspective / preserve-3d)

```css
body, nav a { transition: background-color var(--trans-dur), color var(--trans-dur) }
.app, .card, .nav { transition: background-color var(--trans-dur), box-shadow var(--trans-dur) }
.app { box-shadow: 0 0.5em 2em rgba(0, 0, 0, 0.15); perspective: 20em; position: relative; top: -2em }
.card { margin-bottom: 0.75em; opacity: 0 }
.card--fly-out { animation: fadeInFlyOut 1s var(--trans-timing) forwards }
.card--fly-out:nth-child(1) { animation-delay: 0s }
.card--fly-out:nth-child(2) { animation-delay: 0.05s }
.nav { box-shadow: 0 0.25em 0.5em rgba(0, 0, 0, 0.3) }
.nav--tilt1 { animation: tilt1 0.6s ease-in-out }
.nav--tilt2 { animation: tilt2 0.6s ease-in-out }
.nav--tilt3 { animation: tilt3 0.6s ease-in-out }
.nav--tilt4 { animation: tilt4 0.6s ease-in-out }
```

### [Glassy Iridescent Button](https://codepen.io/simeydotme/pen/jEbYwRa)

held: fixed a.social-icon, fixed a.social-icon, fixed a.social-icon | on scroll: a.social-icon: transform+opacity+top ×3 | on hover of button.iridescent: a.social-icon: transform+opacity+top ×3 | made with: @keyframes · transition · :hover · :focus-visible · :has() · mask · backdrop-filter · mix-blend-mode

```css
&:has(.drop-shadow) { box-shadow: var(--inset-shadow) }
&::before, &::after, & .drop-shadow, & .drop-shadow::after, & .drop-shadow::befo { position: absolute; inset: min(-2px, calc(var(--brdr) * -1)); transition: all 0.6s var(--cubic-in) }
&::after { opacity: 0.3; box-shadow: inset 0 -0.3em 2px 1px oklch(0.99 0.01 257), inset 0 -0.3em 0.25em oklch(0.99 0.01 257), inset 0 -0.3em 0.5em oklch(0.99 0.01 257), inset 0 -0.3em 0.75em oklch(0.99 0.01 257), inset 0 -0.3em 1em }
& .drop-shadow { box-shadow: var(--outer-shadow) }
&::before, & .drop-shadow::after { opacity: 0; translate: 1.1em 0em; scale: 0.8; -webkit-mask: linear-gradient(166deg, transparent 60%, black); mask: linear-gradient(166deg, transparent 60%, black); filter: blur(5px) brightness(1) contrast(1.3); box-shado }
& .drop-shadow::after { opacity: 0; translate: -0.25em 1.2em; filter: blur(8px) brightness(1.2) contrast(1.05); mix-blend-mode: lighten; background-position: center; -webkit-mask: radial-gradient( closest-side, hsl(0, 0%, 100%) 0%, hsla(0, 0%,  }
& .drop-shadow::before { opacity: 1; translate: 1.2em 1.1em; scale: 1.5 0.8; -webkit-mask: radial-gradient( closest-side, hsl(0, 0%, 100%) 0%, hsla(0, 0%, 100%, 0.987) 8.1%, hsla(0, 0%, 100%, 0.951) 15.5%, hsla(0, 0%, 100%, 0.896) 22.5%, hsla(0, }
&:has(.drop-shadow) { box-shadow: var(--inset-shadow) }
&::after, &::before, & .drop-shadow::after { opacity: 0.8 }
&::before { opacity: 0.6; translate: 0em; scale: 1 }
& .drop-shadow::after { opacity: 0.65; translate: 0.33em 1.2em; scale: 1.3 0.66 }
&:active { transition: all 0.1s var(--cubic-out); translate: 0 max(1px, 0.05em) }
```

### [Image orbit animation /w CSS](https://codepen.io/jagcruz/pen/NPGbpdv)

on scroll: div.item: transform+top ×7 | on hover of img.: div.item: transform ×4, div.item: transform+top ×3, div.container: shadow+top, img.: shadow+top | made with: @keyframes · transition · :hover · :has()

```css
& img { scale: 1.5; box-shadow: 0 0 1rem var(--secondary-color) }
& ~ * img { scale: 0.6 }
&:has(~ *:hover) img { scale: 0.6 }
&::before { position: absolute; transform: translate(-50%, -50%); transition-property: transform, border-radius, border, box-shadow }
&::after { inset: -6px; position: absolute; animation: spin-in var(--duration) linear infinite reverse; transition-property: scale, border-radius, border, box-shadow }
& .item { animation-play-state: paused }
&::before { --scale: 4; --translate: calc(-50% / var(--scale)); transform: scale(var(--scale)) translate(var(--translate), var(--translate)); box-shadow: 0 0 15px var(--secondary-color), 0 0 15px var(--primary-color) inset }
&::after { scale: 0.3; box-shadow: 0 0 var(--size) var(--secondary-color) inset }
from { rotate: 0 }
to { rotate: 360deg }
from { transform: rotate(0) }
to { transform: rotate(360deg) }
```

### [Dribbble Mobile Navigation](https://codepen.io/iamsahilvhora/pen/vYBpbGv)

on hover of li.: a.block: color ×2 | made with: nothing recognised — read the code

### [Pure CSS off-canvas menu with flexbox](https://codepen.io/zomigi/pen/dmaCi)

made with: transition

```css
.hamburger-checkbox { position: absolute; opacity: 0 }
.hamburger-label { position: absolute; top: 32px }
.hamburger-checkbox:checked ~ .hamburger-label:before { position: absolute; top: 0 }
.content { box-shadow: 0 0 5px black; transition: all 0.3s }
.sidebar { transition: all 0.3s }
.hamburger-checkbox:checked ~ .sidebar { padding-top: 6.5em }
.menu li { border-top: 1px solid #2b2b2b }
.menu li:last-child { border-bottom: 1px solid #2b2b2b }
```

### [Custom Accessible Vue Emoji Slider](https://codepen.io/collinsworth/pen/OYgGNK)

made with: transition

```css
#slider input { position: relative; opacity: 0 }
#slider input:focus + .outer { box-shadow: 0 0 0 0.1em var(--white), 0 0 0 0.2em var(--orange) }
#slider .outer { position: relative }
#slider label.inner { position: absolute; position: absolute; transition: all 0.15s cubic-bezier(0.5, 0.4, 0.2, 1) }
#slider .emoji { transition: all 0.15s cubic-bezier(0.5, 0.4, 0.2, 1) }
```

### [Convex elliptical header](https://codepen.io/anon/pen/NdXVdM)

made with: nothing recognised — read the code

```css
header { position: relative }
```

### [Form validation with :has()](https://codepen.io/seyedi/pen/ExMVmqE)

on scroll: form.card: transform+shadow+top | made with: :has()

```css
body { opacity: 1 }
```

### [🎉 Party Checkboxes and Radios](https://codepen.io/jkantner/pen/poybMgy)

made with: @keyframes · transition · Web Animations API (.animate)

```css
input[type=checkbox], input[type=checkbox]:after, input[type=radio] { transition: all 0.1s linear }
input[type=checkbox] { box-shadow: 0 0 0 0.1em var(--inputBorder) inset }
input[type=checkbox]:after { transform: scale(0) }
input[type=checkbox]:checked { animation: popOutCheckbox var(--duration) linear }
input[type=checkbox]:checked:after { transform: scale(1); transition: background 0.1s linear, color 0.1s linear, transform calc(var(--duration) / 5) calc(var(--duration) / 2) linear }
input[type=checkbox]:active, input[type=checkbox]:focus { box-shadow: 0 0 0 0.1em var(--inputBorderDown) inset }
input[type=radio] { box-shadow: 0 0 0 0.1em var(--inputBorder) inset, 0 0 0 0.76em var(--inputBg) inset }
input[type=radio]:checked { animation: popOutRadio var(--duration) linear; box-shadow: 0 0 0 0.1em var(--inputBorder) inset, 0 0 0 0.375em var(--inputBg) inset }
input[type=radio]:active, input[type=radio]:focus { box-shadow: 0 0 0 0.1em var(--inputBorderDown) inset, 0 0 0 0.76em var(--inputBgDown) inset }
input[type=radio]:checked:active, input[type=radio]:checked:focus { box-shadow: 0 0 0 0.1em var(--inputBorderDown) inset, 0 0 0 0.375em var(--inputBgDown) inset }
label { position: relative }
label span { position: absolute; top: 0.5em; transform: scale(0) }
```

```js
.animate([
```

### [CSS only 3D animation #2024](https://codepen.io/DenDionigi/pen/dyxBvdr)

on scroll: img.: transform+top ×3, div.soda: opacity+top ×2 | made with: transition · :hover · :has() · mask

```css
header { padding-top: 50px }
.banner { margin-top: -50px; position: relative }
.product { position: absolute; transform: translateX(-50%); bottom: 170px; transition: 0.7s; will-change: transform }
.product .soda { position: absolute; bottom: 0; transform: translateX(-50%); will-change: transform }
.soda { transition: 0.8s; -webkit-mask-image: var(--can); mask-image: var(--can); -webkit-mask-size: auto 100%; mask-size: auto 100% }
.soda:nth-child(2) { opacity: 0 }
.product:hover { bottom: 300px }
.product:hover .soda:nth-child(2) { opacity: 1 }
.product:hover .soda:nth-child(1) { opacity: 0 }
.rock { position: absolute; inset: 0 0 0 0 }
.rock img:nth-child(1) { position: absolute; transform: translateX(-50%); bottom: 30px; transition: 0.7s }
.rock img:nth-child(2) { position: absolute; bottom: 0; transition: 0.7s }
```

### [SVG Pie Timer](https://codepen.io/agrimsrud/pen/EmCoa)

made with: nothing recognised — read the code

### [404 on CodePen](https://codepen.io/redfrost/pen/raRmQX)

made with: nothing recognised — read the code

### [Bump name](https://codepen.io/ainalem/pen/qLjpLm)

made with: @keyframes · requestAnimationFrame

```css
.container { position: relative }
.placeholder { transform: translateX(10px) }
.placeholder.expand { animation: MovePlaceholder 220ms both linear }
.placeholder.return { animation: ReturnPlaceholder 220ms both linear }
input { position: absolute; top: -12px }
svg { position: relative; top: -25px }
0% { transform: translateX(10px) translateY(0) rotate(0) }
60% { transform: translateX(4px) translateY(-8px) rotate(-18deg) scale(0.92) }
100% { transform: translateX(0) translateY(-30px) rotate(0deg) scale(0.75) }
0% { transform: translateX(0) translateY(-30px) scale(0.75) }
100% { transform: translateX(10px) translateY(0) }
@keyframes MovePlaceholder animates transform
```

```js
requestAnimationFrame(step)
```

### [Jeans store - slick carousel (React)](https://codepen.io/agata604/pen/rNjvMaG)

made with: :hover

```css
h1, h2, h3, h4, h5, h6 { margin-bottom: 0.5rem }
h1 { text-transform: uppercase }
p { margin-bottom: 0.5rem }
section { margin-top: 2rem; margin-bottom: 4rem }
hr { border-top: 2px solid #222 }
.btn { text-transform: uppercase }
.card__img { margin-bottom: 1rem }
.card__text { margin-bottom: 0.75rem }
```

### [Circular Ranges](https://codepen.io/stoumann/pen/JoGrEBJ)

made with: transition · :focus-visible · clip-path · mask · custom properties driven by JS · pointer / mouse tracking

```css
.bottom-arc { clip-path: inset(40% 0 0 0); margin-top: -140px }
.top-arc { clip-path: inset(0 0 40% 0); margin-bottom: -120px }
```

```js
style.setProperty('--_start', this.#startAngle)
style.setProperty('--_end', this.#endAngle)
style.setProperty('--_tb', `${(this.#endAngle / 360) * 100}%`)
style.setProperty('--_ta', `${(this.#startAngle / 360) * 100}%`)
style.setProperty('--_tb', `${(this.#startAngle / 360) * 100}%`)
style.setProperty('--_ta', `${(this.#endAngle / 360) * 100}%`)
style.setProperty('--_value', displayValue)
style.setProperty('--_fill', fillAngle)
```

### [Circular Nav component](https://codepen.io/cbolson/pen/VYvYeag)

held: fixed nav | on scroll: path.[object: color+top ×4, svg.[object: color+top, g.[object: color+top | on hover of a.: path.[object: color+top ×4, svg.[object: color+top, g.[object: color+top | made with: position: fixed · transition · :hover · :focus-visible · :has() · backdrop-filter

```css
&::before { position: absolute; inset: 0; backdrop-filter: blur(3px); transition: inset var(--nav-trans-duration) var(--nav-trans-easing) }
& svg { transition: scale 150ms ease-in-out, opacity 150ms ease-in-out, translate 150ms ease-in-out }
&:focus-visible { outline-offset: 5px }
&:hover > svg { scale: 1.2 }
& > svg path { transition-property: color, scale, rotate }
& > svg path:is(:nth-of-type(1), :nth-of-type(4)) { scale: 0 1 }
& > svg path:nth-of-type(2) { rotate: -45deg }
& > svg path:nth-of-type(3) { rotate: 45deg }
&::after { position: absolute; top: 50%; translate: -50%; opacity: 0; transition: translate 150ms ease-in-out, opacity 150ms ease-in-out }
&:hover > svg { translate: 0 -0.5rem }
&:hover::after { opacity: 1; translate: -50% 0.5rem }
&::before { inset: var(--nav-width-expanded) }
```

### [Viewport Units - Test](https://codepen.io/shadeed/pen/828f12b1ef7fa7211584ff5c7b82d2fa)

made with: nothing recognised — read the code

```css
.wrapper img { position: relative }
```

### [Tab bar photo/video switch](https://codepen.io/aaroniker/pen/NEPXdX)

held: fixed a.dribbble | made with: position: fixed · @keyframes · transition · :hover · mask

```css
.tabbar ul { position: relative }
.tabbar ul li { position: relative }
.tabbar ul li a { position: relative }
.tabbar ul li a > div { position: relative }
.tabbar ul li a > div > div { position: absolute; bottom: 0; -webkit-mask-image: -webkit-radial-gradient(white, black) }
.tabbar ul li a > div > div label input + span { position: absolute; top: 0 }
.tabbar ul li a > div > div label input + span:before { position: absolute; top: 0; bottom: 0; opacity: 0; transition: opacity 0.3s ease }
.tabbar ul li a > div > div label input + span svg { position: relative; transition: fill 0.3s ease }
.tabbar ul li a > div > div label input + span + div { top: 50%; position: absolute }
.tabbar ul li a > div > div label input:checked + span { -webkit-animation: icon 0.3s linear forwards 0.3s; animation: icon 0.3s linear forwards 0.3s }
.tabbar ul li a > div > div label input:checked + span:before { opacity: 1; transition: opacity 0.3s ease 0.6s }
.tabbar ul li a > div > div label input:checked + span svg { transition: fill 0.3s ease 0.15s }
```

### [Pagination Component with Vue and Tailwind](https://codepen.io/abhisheksarmah/pen/GRJyXpG)

made with: nothing recognised — read the code

### [Dialog animation example](https://codepen.io/web-dot-dev/pen/dyQxmzg)

made with: @starting-style · transition · <dialog>

```css
dialog[open] { translate: 0 0 }
dialog { transition: translate 0.7s ease-out, overlay 0.7s ease-out, display 0.7s ease-out allow-discrete; translate: 0 100vh }
dialog[open] { translate: 0 100vh }
```

### [Contributor badge flip exploration](https://codepen.io/ChrisJohnson/pen/ZJXzgZ)

on scroll: g.[object: transform+top | on hover of img.: g.[object: transform+top | made with: @keyframes · transition · :hover · clip-path · 3D (perspective / preserve-3d)

```css
.badge svg { box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2) }
.badge h3 { text-transform: uppercase }
.ship { transition: all 0.3s ease }
svg:hover .ship { transform: rotate(-20deg) }
.first-contact.play .lights { -webkit-animation: light-bar 3s linear infinite; animation: light-bar 3s linear infinite }
.first-contact.play .ship { -webkit-animation: ship-fly 3s ease infinite; animation: ship-fly 3s ease infinite }
.first-contact.play .eyes { -webkit-animation: blink 5s linear infinite; animation: blink 5s linear infinite; -webkit-animation-delay: 1s; animation-delay: 1s }
0% { transform: rotate(-20deg) }
50% { transform: rotate(20deg) }
100% { transform: rotate(-20deg) }
0% { transform: rotate(-20deg) }
50% { transform: rotate(20deg) }
```

### [Team Carousel by - gopi chakradhar](https://codepen.io/Gopi-Chakradhar/pen/OPymMxJ)

held: fixed a, fixed div.scroll-indicator | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · 3D (perspective / preserve-3d)

```css
#super-btn { position: fixed; bottom: 32px; box-shadow: 0 2px 12px rgba(0,0,0,0.18); transition: box-shadow 0.2s, transform 0.2s }
#super-btn:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.28); transform: scale(1.07) }
.carousel-container { position: relative; perspective: 1000px }
.carousel-track { position: relative; transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) }
.card { position: absolute; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) }
.card img { transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) }
.card.center { transform: scale(1.1) translateZ(0) }
.card.center img { filter: none }
.card.up-2 { transform: translateY(-300px) scale(0.8) translateZ(-300px); opacity: 0.7 }
.card.up-2 img { filter: grayscale(100%) }
.card.up-1 { transform: translateY(-150px) scale(0.9) translateZ(-100px); opacity: 0.9 }
.card.up-1 img { filter: grayscale(100%) }
```

### [Bicycle Preloader](https://codepen.io/jkantner/pen/XWPbNNE)

on scroll: g.[object: transform+top ×3, circle.[object: transform ×2 | made with: @keyframes · transition

```css
body { transition: background-color var(--trans-dur), color var(--trans-dur) }
.bike__body, .bike__front, .bike__handlebars, .bike__pedals, .bike__pedals-spin, { animation: bikeBody 3s ease-in-out infinite; transition: stroke var(--trans-dur) }
.bike__front { animation-name: bikeFront }
.bike__handlebars { animation-name: bikeHandlebars }
.bike__pedals { animation-name: bikePedals }
.bike__pedals-spin { animation-name: bikePedalsSpin }
.bike__seat { animation-name: bikeSeat }
.bike__spokes { animation-name: bikeSpokes }
.bike__spokes-spin { animation-name: bikeSpokesSpin }
.bike__tire { animation-name: bikeTire }
from { animation-timing-function: ease-in }
33%, 67% { animation-timing-function: ease-out }
```

### [CSS Galaxy Button 🚀](https://codepen.io/jh3y/pen/eYPYKep)

held: fixed div.bodydrop | on scroll: span.star: transform+top ×24, button.: background+shadow+top, span.backdrop: background+top, span.galaxy__container: opacity+top, span.galaxy: opacity+top, span.text: color+top | on hover of button.: span.star: transform+top ×20 | made with: position: fixed · @keyframes · transition · :hover · :focus-visible · :has() · mask · 3D (perspective / preserve-3d)

```css
:root { --transition: 0.25s }
body { transition: background var(--transition) }
button { position: relative; box-shadow: 0 0 calc(var(--active) * 6em) calc(var(--active) * 3em) hsl(var(--hue) 97% 61% / 0.5), 0 0.05em 0 0 hsl(var(--hue) calc(var(--active) * 97%) calc((var(--active) * 50%) + 30%)) inset, 0 -0. }
button:active { scale: 1 }
.star { position: absolute; opacity: var(--alpha); top: 50%; transform: translate(-50%, -50%) rotate(10deg) rotate(0deg) translateY(calc(var(--distance) * 1px)); -webkit-animation: orbit calc(var(--duration) * 1s) calc(var(--del }
to { transform: translate(-50%, -50%) rotate(10deg) rotate(360deg) translateY(calc(var(--distance) * 1px)) }
to { transform: translate(-50%, -50%) rotate(10deg) rotate(360deg) translateY(calc(var(--distance) * 1px)) }
.galaxy { position: absolute; top: 50%; translate: -50% -50%; opacity: var(--active); transition: opacity var(--transition) }
.galaxy__ring { position: absolute; top: 50%; transform: translate(-28%, -40%) rotateX(-24deg) rotateY(-30deg) rotateX(90deg) }
.galaxy__container { position: absolute; inset: 0; opacity: var(--active); transition: opacity var(--transition); -webkit-mask: radial-gradient(white, transparent); mask: radial-gradient(white, transparent) }
.star--static { -webkit-animation: none; animation: none; top: 50%; transform: translate(0, 0); filter: brightness(4); opacity: 0.9; -webkit-animation: move-x calc(var(--duration) * 0.1s) calc(var(--delay) * -0.1s) infinite linear, move }
button:hover .star--static { -webkit-animation-play-state: paused; animation-play-state: paused }
```

### [Scroll Snap - Images List](https://codepen.io/shadeed/pen/jOMrxYO)

made with: scroll-snap

```css
section { box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1) }
section h2 { margin-bottom: 1rem }
.images-list { -ms-scroll-snap-type: x; scroll-snap-type: x }
.images-list img { scroll-snap-align: start }
```

### [Untitled](https://codepen.io/smashingmag/pen/LYvLvGz)

on scroll: div.sliding-background: transform | made with: @keyframes

```css
.sliding-background { animation: slide 60s linear infinite }
0% { transform: translate3d(0, 0, 0) }
100% { transform: translate3d(-1692px, 0, 0) }
@keyframes slide animates transform
```

### [bootstrap 5 offcanvas sidebar navigation - variant 2](https://codepen.io/chandrashekhar/pen/yLgggmX)

held: fixed nav.navbar, fixed div.offcanvas, fixed a.pens_link | on scroll: a.pens_link: transform+top | on hover of button.navbar-toggler: a.pens_link: transform+top | made with: position: fixed · @keyframes · transition · :hover

```css
.sidebar-links { position: relative }
main { margin-top: 90px }
.border-top-thick { border-top: 0.2rem solid var(--violet) }
.mt-navbar-adjust { margin-top: var(--top-navbar-height) }
.offcanvas { transform: none; transition: none !important }
.pens_link { position: fixed; bottom: 56px; -webkit-animation: animate 1500ms ease infinite; animation: animate 1500ms ease infinite }
0%, 100% { transform: translatey(-10%) }
50% { transform: translatey(10%) }
0%, 100% { transform: translatey(-10%) }
50% { transform: translatey(10%) }
@keyframes animate animates transform
```

### [Tailwind - Profile Card](https://codepen.io/simonwpt-the-typescripter/pen/oNzZxvB)

made with: clip-path

### [Context Menu](https://codepen.io/dsr/pen/weYBON)

held: fixed div | made with: position: fixed · @keyframes · transition · :hover

```css
#contextMenu { position:absolute; transform:scale(0); box-shadow:2px 2px 12px 4px rgba(100,100,100,0.4); transition:transform 400ms ease-in-out 50ms }
#contextMenu.visible { transform:scale(1) }
#contextMenu ul li.share > .name { margin-top:-2px; margin-bottom:10px }
#contextMenu div.break { border-top:1px solid rgba(100,100,100,0.5) }
#pulse { position:fixed; opacity:0 }
#pulse.active { animation:pulse 400ms ease }
0% { opacity:1; transform:scale(0) }
100% { opacity:0; transform:scale(1.1) }
@keyframes pulse animates opacity, transform
```

### [<progress> bar animation](https://codepen.io/thebabydino/pen/OpEyrL)

held: fixed a | on hover of a.: a.: filter | made with: requestAnimationFrame

```css
output:not(:empty) { padding-bottom: 1em }
```

```js
requestAnimationFrame(load.bind(this, t + (Math.random() > .5)
```

### [CSS Grid: Card Variations](https://codepen.io/oliviale/pen/WqwOzv)

made with: transition · :hover

```css
body { transition: all 0.3s ease }
.palette { margin-bottom: 1em }
h1 { margin-bottom: 10px }
h2 { margin-bottom: 10px }
h3 { margin-bottom: 10px }
h4 { margin-bottom: 10px }
h5 { margin-bottom: 10px }
h6 { text-transform: uppercase }
a.button { position: relative; top: 0; transition: 0.2s ease }
a.button:hover, a.button.hover { top: -3px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15) }
a.button:active, a.button.active { box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1); top: 0 }
a.button.disabled { opacity: 0.4 }
```

### [Droppy woppy input](https://codepen.io/ste-vg/pen/VEJwzb)

held: fixed svg.[object | made with: GSAP · three.js / WebGL · requestAnimationFrame

```css
.form { position: absolute; top: 0 }
.form .fake-input { border-bottom: 2px solid #333 }
```

```js
requestAnimationFrame(animate)
```

### [Animated image slider | HTML, CSS & JavaScript](https://codepen.io/MDJAmin/pen/GgpdKPy)

made with: position: fixed · @keyframes · transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%, -50%); box-shadow: 0 30px 50px #dbdbdb }
.container .slide .item { position: absolute; top: 50%; transform: translate(0, -50%); box-shadow: 0 30px 50px #505050; background-position: 50% 50%; transition: all 0.5s }
.slide .item:nth-child(1), .slide .item:nth-child(2) { top: 0; transform: translate(0, 0); transition: all .5s }
.slide .item:nth-child(n + 6) { opacity: 0 }
.item .content { position: absolute; top: 50%; transform: translate(0, -50%) }
.content .name { text-transform: uppercase; opacity: 0; animation: animate 1s ease-in-out 1 forwards }
.content .des { margin-top: 10px; margin-bottom: 20px; opacity: 0; animation: animate 1s ease-in-out 0.3s 1 forwards }
.content button { opacity: 0; transition: all 0.5s; animation: animate 1s ease-in-out 0.6s 1 forwards }
from { opacity: 0; transform: translate(0, 100px); filter: blur(33px) }
to { opacity: 1; transform: translate(0); filter: blur(0) }
.button { position: absolute; bottom: 20px }
.button button { transition: 0.3s }
```

### [Material cards](https://codepen.io/zhangzhuo/pen/vOwwKX)

on scroll: p.: color ×2, li.: shadow, span.fa: color, h3.: color | on hover of li.: p.: color ×3, li.: shadow ×2, span.fa: color ×2, h3.: color ×2 | made with: transition · :hover

```css
#sec ul li { transition: box-shadow 0.3s }
#sec ul li:hover { box-shadow: 0 12px 15px 0 rgba(0, 0, 0, 0.24), 0 17px 50px 0 rgba(0, 0, 0, 0.19) }
#sec ul li span { transition: color 0.3s }
#sec ul li span:before, #sec ul li span:after { position: static }
#sec ul li h3 { transition: color 0.3s }
#sec ul li h3:after { position: relative; top: 20px; transform: translateX(-50%); transition: width 0.3s }
#sec ul li p { transition: color 0.3s }
```

### [SVG Interaction (Menu to Left Arrow)](https://codepen.io/vikramcodes/pen/mdVxNby)

made with: transition

```css
h1 { text-transform: uppercase; margin-bottom: 2rem }
#top, #bottom { transition: all 0.6s cubic-bezier(0.6, 0.33, 0.67, 1.29) }
svg:nth-child(2) { transform: rotate(0deg); transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) }
svg:nth-child(2) path { transition: all 0.4s ease-in-out 0.6s }
svg:nth-child(2).active { transform: rotate(180deg) }
```

### [Nike Product Card Parallax 3D](https://codepen.io/krautgti/pen/VwXNRYE)

on scroll: div.box: transform+top, h2.name: opacity+top, a.buy: opacity+top, div.circle: transform+top, img.product: transform+top | on hover of button.mode-switch: div.box: transform+top, h2.name: opacity+top, a.buy: opacity+top, div.circle: transform+top, img.product: transform+top | made with: transition · :hover · mask · 3D (perspective / preserve-3d)

```css
.container { position: relative }
.container .box { position: relative }
.container .box::before { position: absolute; top: 20px; opacity: 0; transition: 0.5s }
.container .box::after { position: absolute; bottom: 20px; opacity: 0; transition: 0.5s }
.container .box:hover::after, .container .box:hover::before { opacity: 0.04 }
.container .box .name { position: absolute; top: 0; transform: translate3d(0, 0, 75px); transition: 0.5s; opacity: 0 }
.container .box:hover .name { top: 40px; opacity: 1 }
.container .box .buy { position: absolute; bottom: 0; transform: translate3d(0, 0, 75px); transition: 0.5s; opacity: 0 }
.container .box:hover .buy { bottom: 30px; opacity: 1 }
.container .box .circle { position: absolute; top: 50%; transition: 0.5s; opacity: 1; transform: translate3d(-50%, -50%, 0px) }
.container .box:hover .circle { position: absolute; top: 50%; transition: 0.5s; opacity: 1; transform: translate3d(-50%, -50%, 35px) }
.container .box .product { position: absolute; top: 50%; transition: 0.5s; transition: 0.5s; transform: translate3d(-50%, -50%, 0px) rotate(-15deg) }
```

### [CSS Scroll-driven animation demo](https://codepen.io/web-dot-dev/pen/qEqNbbe)

held: sticky div.visual-column | on scroll: div.step: transform+opacity+top ×2, div.visual: transform+background+top | made with: position: sticky · view() timeline · @keyframes · transition

```css
.visual { transition: all 0.5s ease; animation: to-circle 0.6s cubic-bezier(0.25, 1, 0.5, 1) both, to-diamond 0.6s cubic-bezier(0.25, 1, 0.5, 1) both, to-expansion 0.6s cubic-bezier(0.25, 1, 0.5, 1) both, to-dot 0.6s cubic-bezier( }
.step { animation: fade-in-text 0.8s ease; animation-trigger: --self play-forwards }
from { opacity: 0.2; transform: translateY(20px) }
to { opacity: 1; transform: translateX(0) }
to { transform: scale(1) rotate(0deg) }
to { transform: rotate(45deg) scale(1.2) }
to { transform: rotate(0deg) scale(1.4, 0.8) }
to { transform: rotate(0deg) scale(0.2) }
.scrolly-content { padding-top: 10dvh; padding-bottom: 10dvh }
.step { transition: opacity 0.5s }
h2 { margin-bottom: 0.5rem }
@keyframes fade-in-text animates opacity, transform
```

### [Fancy image hover effect](https://codepen.io/anon/pen/GRdOQmO)

on hover of img.: img.: clip-path | made with: transition · :hover · clip-path

```css
img { clip-path: circle(calc(50% - 40px)); outline-offset: -150px; transition: .5s }
img:hover { clip-path: circle(80%); outline-offset: 0 }
```

### [Another Download Link](https://codepen.io/mikehobizal/pen/raKRMR)

made with: @keyframes · transition · :hover · 3D (perspective / preserve-3d)

```css
0% { -webkit-transform: rotateY(90deg) rotate(0deg) }
60% { -webkit-transform: rotateY(90deg) rotate(-180deg) }
100% { -webkit-transform: rotateY(90deg) rotate(-360deg) }
0% { -moz-transform: rotateY(90deg) rotate(0deg) }
60% { -moz-transform: rotateY(90deg) rotate(-180deg) }
100% { -moz-transform: rotateY(90deg) rotate(-360deg) }
0% { -webkit-transform: rotateY(90deg) rotate(0deg); -moz-transform: rotateY(90deg) rotate(0deg); -ms-transform: rotateY(90deg) rotate(0deg); -o-transform: rotateY(90deg) rotate(0deg); transform: rotateY(90deg) rotate(0deg) }
60% { -webkit-transform: rotateY(90deg) rotate(-180deg); -moz-transform: rotateY(90deg) rotate(-180deg); -ms-transform: rotateY(90deg) rotate(-180deg); -o-transform: rotateY(90deg) rotate(-180deg); transform: rotateY(90deg) ro }
100% { -webkit-transform: rotateY(90deg) rotate(-360deg); -moz-transform: rotateY(90deg) rotate(-360deg); -ms-transform: rotateY(90deg) rotate(-360deg); -o-transform: rotateY(90deg) rotate(-360deg); transform: rotateY(90deg) ro }
.button { position: relative; -webkit-transition: all 500ms ease-in-out; -moz-transition: all 500ms ease-in-out; transition: all 500ms ease-in-out }
.button:hover { -webkit-transform: translateY(-5px); -moz-transform: translateY(-5px); -ms-transform: translateY(-5px); -o-transform: translateY(-5px); transform: translateY(-5px) }
.button:hover > span { -webkit-transition: all 800ms ease-in-out; -moz-transition: all 800ms ease-in-out; transition: all 800ms ease-in-out; -webkit-transform: rotateY(90deg) rotate(-360deg); -moz-transform: rotateY(90deg) rotate(-360deg); -ms }
```

### [Scroll Image Effects](https://codepen.io/bokoko33/pen/VwpOWMR)

held: fixed div.webgl-canvas | made with: position: fixed · three.js / WebGL · requestAnimationFrame

```css
.webgl-canvas { position: fixed; top: 0 }
.webgl-canvas { position: fixed; top: 0 }
.image-item:not(:first-of-type) { margin-top: 180px }
.image-wrapper > img { opacity: 0 }
```

```js
requestAnimationFrame(loop)
```

### [Kinetic CSS loaders](https://codepen.io/jenning/pen/LYWJdWz)

on scroll: i.loader: transform+top ×3, i.loader: transform | made with: @keyframes · transition · :hover · clip-path · 3D (perspective / preserve-3d)

```css
.loader { position: relative }
.loader::before, .loader::after { position: absolute }
.loader--1::before, .loader--1::after { top: var(--dot-size-half-neg); -webkit-animation: loader-1 var(--anim-duration) cubic-bezier(0.27, 0.08, 0.26, 0.7) infinite; animation: loader-1 var(--anim-duration) cubic-bezier(0.27, 0.08, 0.26, 0.7) infinite }
.loader--1::after { -webkit-animation-delay: calc(var(--anim-duration) / 4 * -1); animation-delay: calc(var(--anim-duration) / 4 * -1) }
0%, 100% { transform: none }
25% { transform: translateX(var(--loader-1-dist)) }
50% { transform: translateX(var(--loader-1-dist)) translateY(var(--loader-1-dist)) }
75% { transform: translateX(0) translateY(var(--loader-1-dist)) }
0%, 100% { transform: none }
25% { transform: translateX(var(--loader-1-dist)) }
50% { transform: translateX(var(--loader-1-dist)) translateY(var(--loader-1-dist)) }
75% { transform: translateX(0) translateY(var(--loader-1-dist)) }
```

### [404 on CodePen](https://codepen.io/edgarlnx/pen/MBjrMK)

made with: nothing recognised — read the code

### [Concentric Circle Preloader](https://codepen.io/jkantner/pen/ZYYoZzr)

on scroll: g.[object: transform+top ×6, circle.[object: transform+top ×2 | made with: transition · Web Animations API (.animate)

```css
body { transition: background-color var(--trans-dur), color var(--trans-dur) }
.pl circle { transition: fill var(--trans-dur), stroke var(--trans-dur) }
```

```js
.animate({ transform }, { duration, easing: Utils.easings.linear, iterations })
```

### [Play/pause CSS animations with IntersectionObserver](https://codepen.io/anon/pen/WNGEybO)

held: fixed footer.code | on scroll: div.circle: transform+top | made with: position: fixed · @keyframes · prefers-reduced-motion · custom properties driven by JS · IntersectionObserver

```css
.circle { margin-bottom: 1rem }
.a-pulse { will-change: transform }
[data-animation] { animation: var(--animn, none) var(--animdur, 0s) var(--animtf, linear) var(--animdel, 0s) var(--animic, infinite) var(--animdir, alternate) var(--animfm, none) var(--animps, running) }
[data-animation="alternate"] { --animn: opacity }
0% { opacity: 1 }
50% { opacity: 0.6 }
100% { opacity: 1 }
0% { transform: scale(1) }
25% { transform: scale(.9) }
50% { transform: scale(1) }
75% { transform: scale(1.1) }
100% { transform: scale(1) }
```

```js
new IntersectionObserver((entries) => {
style.setProperty('--animps', state)
```

### [Positive & Negative numbers](https://codepen.io/graphilla/pen/QWQYMXB)

held: fixed input | on scroll: g.[object: transform ×2, ellipse.[object: transform ×2, path.[object: transform | made with: position: fixed · clip-path · GSAP

```css
.grid { position: relative }
.runner { position: absolute }
.number { position: relative }
input[type=range] { position: fixed; bottom: 2rem }
input[type=range]::-webkit-slider-thumb { margin-top: -0.75rem; box-shadow: 2px 2px 0 0 black }
input[type=range]::-moz-range-thumb { margin-top: -0.75rem; box-shadow: 2px 2px 0 0 black }
.neutral.shadow { fill-opacity: 0.2 }
.negative.shadow { fill-opacity: 0.2 }
.positive.shadow { fill-opacity: 0.2 }
```

```js
gsap.timeline({
gsap.to('.runner', { duration: 0.5, x: n * -100 + 'vw' })
gsap.to('body', { duration: 0.5, background: ['#f27996', '#bdc5ff', '#a2f9d4'][+n + 1] })
```

### [Dynamic Toggle with type=radio + :has()](https://codepen.io/jh3y/pen/vEEZxOM)

held: fixed a.bear-link | on hover of a.bear-link: a.bear-link: opacity | made with: position: fixed · view transitions · @keyframes · transition · :hover · :focus-visible · :has() · clip-path · mask

```css
[data-debug='true'] input.sr-only { position: absolute; -webkit-animation: reveal calc(var(--duration) * 1s) ease-out; animation: reveal calc(var(--duration) * 1s) ease-out }
0% { opacity: 0 }
0% { opacity: 0 }
[data-debug='true'] .control__track > input { bottom: 200%; translate: -50% 0 }
[data-debug='true'] .premium > input:nth-of-type(1) { bottom: calc(200% + 2px); translate: -50% 0 }
[data-debug='true'] .premium > input:nth-of-type(2) { bottom: calc(200% + 2px); translate: -50% 0 }
.premium:has(:checked)::before { translate: -50% -250%; scale: 0.85 }
.premium:has(:checked) label span { scale: 1 }
.premium:has(:checked) .indicator { -webkit-clip-path: inset(0 0 0 0 round 100px); clip-path: inset(0 0 0 0 round 100px) }
.premium:has(:checked) label { opacity: 0.75 }
.premium:has(:nth-of-type(1):checked) label:nth-of-type(1), .premium:has(:nth-of { opacity: 1 }
.premium:has(:nth-of-type(1):checked) .indicator { translate: -100% 0 }
```

```js
startViewTransition(() => update())
```

### [Locomotive-Scroll](https://codepen.io/anon/pen/BazXPzp)

on scroll: p.is-inview: transform+top | made with: Lenis / smooth scroll

### [Horizontal snapping sections (simple) - ScrollTrigger](https://codepen.io/GreenSock/pen/YzygYvM)

held: fixed div.container | on scroll: section.panel: transform ×5, div.description: transform, div.arrow: transform+top | made with: GSAP · ScrollTrigger

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to(sections, {
```

### [CSS-only ripple toggle with dynamic text colour](https://codepen.io/liamj/pen/vvdRdR)

made with: transition · mix-blend-mode

```css
input[type=checkbox]:checked + label:after { transform: scale(4.2) }
label { position: relative; box-shadow: 0 3px 0 0 #000 }
label::after { position: absolute; top: 0; transform: scale(0); transition: transform 0.3s ease-in; mix-blend-mode: difference }
label:active { top: 3px; box-shadow: none }
```

### [Parallax Card](https://codepen.io/Moslim/pen/zdPrVp)

held: fixed a.white-mode | on scroll: div.container: transform | on hover of a.white-mode: div.container: transform+top, a.white-mode: background+color | made with: position: fixed · transition · :hover · 3D (perspective / preserve-3d)

```css
body { perspective: 1000px; position: relative }
.container { position: relative; transition: 1.5s ease-in-out }
.side { position: absolute }
.content { transform: translatez(70px) scale(0.8) }
.content h1 { position: relative }
.content p { margin-top: 50px }
.content h1:before { position: absolute; bottom: -20px; transform: translateX(-50%) }
.back { transform: rotateY(180deg); padding-top: 10px }
.container:hover { transform: rotateY(180deg) }
form input, form textarea { border-bottom: 2px solid #444 }
.white-mode { transition: 0.35s ease-in-out; position: fixed; bottom: 15px }
```

### [Learn CSS - P2 Popover- Manual](https://codepen.io/web-dot-dev/pen/wBKjJKa)

held: fixed div.box, fixed div.box | on hover of button.: button.: shadow | made with: popover

```css
[popover] { position-area: bottom }
```

### [Card Carousel | CSS Only](https://codepen.io/dustindwayne/pen/JooKxRZ)

on scroll: div.carousel: transform | on hover of div.card: div.carousel: transform | made with: @keyframes · transition · :hover · 3D (perspective / preserve-3d)

```css
.carousel { transform: perspective(1000px) rotateX(70deg); position: absolute; animation: rotate 15s linear infinite; transition: all 1s }
.carousel:hover { animation-play-state: paused }
.carousel .cardb { position: absolute }
.carousel .card { position: absolute; box-shadow: 0 0 20px rgba(0,0,0,0.5) }
.carousel .card .img { margin-bottom: -10px; filter: brightness(0.7) }
.carousel .card p { margin-bottom: -5px }
.c1 { transform: rotateZ(45deg) rotateX(90deg) translateY(120px) translateZ(280px) rotateZ(180deg) }
.cb1 { transform: rotateZ(45deg) rotateX(90deg) translateY(120px) translateZ(279px) }
.c2 { transform: rotateZ(90deg) rotateX(90deg) translateY(120px) translateZ(280px) rotateZ(180deg) }
.cb2 { transform: rotateZ(90deg) rotateX(90deg) translateY(120px) translateZ(279px) }
.c3 { transform: rotateZ(135deg) rotateX(90deg) translateY(120px) translateZ(280px) rotateZ(180deg) }
.cb3 { transform: rotateZ(135deg) rotateX(90deg) translateY(120px) translateZ(279px) }
```

### [Table with Sticky Header and Sticky First Column](https://codepen.io/chriscoyier/pen/yLVNErX)

held: sticky caption, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th | made with: position: sticky

```css
table thead th { position: sticky; top: 0 }
table tbody th { position: relative }
table thead th:first-child { position: sticky }
table tbody th { position: sticky }
caption { position: sticky }
[role="region"][aria-labelledby][tabindex]:focus { box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.5) }
```

### [17. Integrating Infinite Scroll](https://codepen.io/anon/pen/QWdwzMK)

held: fixed const.boxes | made with: scroll() timeline · GSAP · ScrollTrigger

```css
.boxes { position: absolute }
.box { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline({
gsap.fromTo(LOOP, {
gsap.to(PLAYHEAD, {
ScrollTrigger.create({
```

### [Material UI stretch button](https://codepen.io/ainalem/pen/JxEqzW)

made with: transition · clip-path

```css
.container { position: relative }
.bar { position: absolute }
.bar-purple { -webkit-clip-path: polygon( 360px 0, 360px 32px, 43px 32px, 39.775442px 31.67494px, 36.772078px 30.74264px, 34.054248px 29.26745px, 31.686292px 27.31371px, 29.732549px 24.94575px, 28.257359px 22.22792px, 27.325063px 19.2 }
.bar-outer { -webkit-clip-path: polygon(0 0, 120px 0, 120px 32px, 0 32px); clip-path: polygon(0 0, 120px 0, 120px 32px, 0 32px); -webkit-clip-path: polygon( 0 0, 0 32px, 104px 32px, 107.22456px 31.67494px, 110.22792px 30.74264px, 112 }
.bar-outer.pos2 .bar-purple { -webkit-clip-path: polygon( 360px 0, 360px 32px, 149px 32px, 145.775442px 31.67494px, 142.772078px 30.74264px, 140.054248px 29.26745px, 137.686292px 27.31371px, 135.732549px 24.94575px, 134.257359px 22.22792px, 133.32506 }
.bar-outer.pos2 { -webkit-clip-path: polygon( 0 0, 0 32px, 210px 32px, 213.22456px 31.67494px, 216.22792px 30.74264px, 218.94575px 29.26745px, 221.31371px 27.31371px, 223.26745px 24.94575px, 224.74264px 22.22792px, 225.67494px 19.22456px, }
.bar-outer.pos3 .bar-purple { -webkit-clip-path: polygon( 360px 0, 360px 32px, 256px 32px, 252.775442px 31.67494px, 249.772078px 30.74264px, 247.054248px 29.26745px, 244.686292px 27.31371px, 242.732549px 24.94575px, 241.257359px 22.22792px, 240.32506 }
.bar-outer.pos3 { -webkit-clip-path: polygon(0 0, 333px 0, 333px 32px, 0 32px); clip-path: polygon(0 0, 333px 0, 333px 32px, 0 32px); -webkit-clip-path: polygon( 0 0, 0 32px, 317px 32px, 320.22456px 31.67494px, 323.22792px 30.74264px, 325 }
```

### [Day 12: FAQ Collapse](https://codepen.io/joannholland/pen/WNGqbyE)

made with: transition

```css
.faq { position: relative; transition: 0.3s ease }
.faq.active { box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.1) }
.faq.active::before, .faq.active::after { position: absolute; opacity: 0.2; top: 20px }
.faq.active::before { top: -10px; transform: rotateY(180deg) }
.faq-toggle { position: absolute; top: 30px }
```

### [Infinite Scroll Snap](https://codepen.io/scottjehl/pen/jOEzYWw)

made with: scroll-snap · :hover · scroll listener

```css
div { scroll-snap-type: x mandatory; position: relative }
img { scroll-snap-align: start }
```

```js
addEventListener("scroll", function() {
```

### [Firewatch Parallax in CSS (Scroll-Linked Animations / @scroll-timeline)](https://codepen.io/anon/pen/128b1f710f4fd26ab3a6f6d479badb4b)

held: fixed div.warning, fixed dialog.sda_update | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
scroll-timeline scroll-for-100vh { scroll-offsets: 0, 100vh }
to { transform: translateY(var(--offset)) }
.parallax__layer { animation: 1s parallax linear; animation-timeline: scroll-for-100vh }
.parallax__layer__0 { --offset: 100vh }
.parallax__layer__1 { --offset: 83vh }
.parallax__layer__2 { --offset: 67vh }
.parallax__layer__3 { --offset: 50vh }
.parallax__layer__4 { --offset: 34vh }
.parallax__layer__5 { --offset: 17vh }
.parallax__layer__6 { --offset: 0vh }
.parallax { position: relative }
.parallax__layer { position: absolute; top: 0; bottom: 0 }
```

### [Product page - pure css - #17](https://codepen.io/ig_design/pen/eYJbaRB)

held: fixed div.back-color, fixed div.back-color, fixed div.back-color, fixed div.back-color, fixed div.back-color, fixed div.back-color, fixed a.logo | made with: position: fixed · @keyframes · transition · :hover

```css
.section-fluid-main { position: relative }
.section { position: relative }
.section-fluid { position: relative }
[type="radio"]:checked, [type="radio"]:not(:checked) { position: absolute }
.color-btn:checked + label, .color-btn:not(:checked) + label { position: relative; transition: all 200ms linear; box-shadow: 0 12px 35px 0 rgba(16,39,112,.25); background-position: center }
.color-btn:checked + label { transform: scale(1.1) }
.img-wrap { position: absolute; top: 100px; transition: all 550ms linear; background-position: center top; opacity: 0 }
.for-color-1:checked ~ .img-wrap.chair-1 { opacity: 1; animation: shake 0.7s cubic-bezier(.36,.07,.19,.97) both }
.for-color-2:checked ~ .img-wrap.chair-2 { opacity: 1; animation: shake 0.7s cubic-bezier(.36,.07,.19,.97) both }
.for-color-3:checked ~ .img-wrap.chair-3 { opacity: 1; animation: shake 0.7s cubic-bezier(.36,.07,.19,.97) both }
.for-color-4:checked ~ .img-wrap.chair-4 { opacity: 1; animation: shake 0.7s cubic-bezier(.36,.07,.19,.97) both }
.for-color-5:checked ~ .img-wrap.chair-5 { opacity: 1; animation: shake 0.7s cubic-bezier(.36,.07,.19,.97) both }
```

### [404 on CodePen](https://codepen.io/piccalilli/pen/empKarQ)

made with: nothing recognised — read the code

### [Airplane Mode Animation](https://codepen.io/jkantner/pen/rNrZqPV)

made with: @keyframes · transition · :focus-visible · clip-path · Web Animations API (.animate)

```css
body { background-position: center }
.am { position: relative }
.am__crack { box-shadow: 0 0 0.5em hsla(var(--hue),90%,70%,0); position: absolute; top: 0.25em; transition: background-color 0.15s linear, box-shadow 0.15s linear, opacity var(--trans-dur) ease-in-out }
.am__input { box-shadow: 0.1em 0.1em 0.1em hsla(var(--hue),90%,90%,0.5) inset, -0.1em -0.1em 0.1em hsla(var(--hue),90%,10%,0.5) inset; filter: grayscale(0.9); position: absolute; top: 0.375em; transition: filter var(--trans-dur) ease }
.am__plane, .am__plane-body, .am__plane-body:before, .am__plane-body:after, .am_ { position: absolute }
.am__plane { animation: planeLand 1s cubic-bezier(0.6,0,0.4,1); filter: drop-shadow(0.25em 0.25em 0.25em hsla(0,0%,0%,0.3)); top: 50% }
.am__plane-body { transform: translate(-50%,-50%) }
.am__plane-body:before { box-shadow: 0.1em 0 0 hsl(var(--hue),10%,10%) inset }
.am__plane-body:after { top: 0.15em }
.am__plane-engines { top: 50% }
.am__plane-engines:before { transform: translateY(-1em) }
.am__plane-engines:after { transform: translateY(1em) scaleY(-1) }
```

```js
.animate( [
```

### [Checkboxswitcher](https://codepen.io/Volorf/pen/XQWBGN)

made with: transition · :hover

```css
body #btn { box-shadow: 0px 64px 96px rgba(0,0,0,0.05) }
body #btn #checkbox { margin-top: 12px; box-shadow: 0px 4px 4px rgba(125,212,81,0.2) }
body #btn #checkbox .tick { transform: rotate(45deg); position: absolute; margin-top: 11px }
body #btn #checkbox .tick #rect1 { position: absolute }
body #btn #checkbox .tick #rect2 { margin-top: 32px; position: absolute }
.h_btn { transform: scale(0.9) }
.h_cb { box-shadow: 0px 4px 4px rgba(0,0,0,0.05) !important }
* { transition: all 0.3s cubic-bezier(0.38, 0.24, 0.28, 1.17) }
```

### [Snowball Range Slider](https://codepen.io/jkantner/pen/KKEXrog)

made with: custom properties driven by JS

```css
.range { position: relative }
.range__label { position: absolute }
.range__ball, .range__ball-inner-shadow, .range__ball-outer-shadow, .range__ball { position: absolute }
.range__ball { top: 0 }
.range__ball-inner-shadow { box-shadow: 0 0.1em 0.2em rgba(0, 0, 0, 0.3), 0 0 0.2em rgba(0, 0, 0, 0.1) inset, 0 -1em 0.5em rgba(0, 0, 0, 0.15) inset }
.range__ball-outer-shadow, .range__ball-side-shadows { filter: blur(2px) }
.range__ball-outer-shadow { top: 50%; transform: rotate(20deg) }
.range__ball-side-shadows { transform: scale(0.75, 1.1) }
.range__ball-texture { transform: translate3d(0, 0, 0) }
.range__ball-texture:before { filter: brightness(1.05); top: 0; transform: translateX(calc(50% * var(--ball-x))) }
.range__tip { bottom: 100%; transform: translateX(-50%) }
.range__track { box-shadow: 0 -0.45em 0.375em rgba(0, 0, 0, 0.15), 0 0.5em 0.75em rgba(0, 0, 0, 0.15) inset, 0 0.25em 0.5em rgba(255, 255, 255, 0.4), 0 -0.5em 0.75em rgba(255, 255, 255, 0.4) inset; top: 0.5em }
```

```js
style.setProperty("--ball-x", `${ballX}`)
```

### [Stacked wave dividers](https://codepen.io/thebabydino/pen/PwwQxdb)

on hover of a.: a.: shadow | made with: transition · :hover · clip-path

```css
article:nth-of-type(n + 2) { padding-top: 4em; clip-path: polygon(0% 2em, 5% 2.618em, 10% 3.176em, 15% 3.618em, 20% 3.902em, 25% 4em, 30% 3.902em, 35% 3.618em, 40% 3.176em, 45% 2.618em, 50% 2em, 55% 1.382em, 60% 0.824em, 65% 0.382em, 70% 0.098em, 75 }
article:nth-last-of-type(n + 2) { margin-bottom: -4em; padding-bottom: 4em }
article::after { margin-bottom: inherit }
:not(:last-of-type) > section, :not(:last-of-type) > aside { margin-bottom: calc((var(--p) - 1)*2em) }
h2 { text-transform: uppercase }
a { transition: box-shadow 0.3s }
a:is(:hover, :focus) { box-shadow: 2px 2px }
```

### [await Element.scrollIntoView()](https://codepen.io/web-dot-dev/pen/xbROZVo)

held: fixed nav | on hover of button.nav-link: button.nav-link: background | made with: position: fixed · transition · :hover

```css
nav { position: fixed; top: 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1) }
button.nav-link { transition: background 0.2s, transform 0.1s }
button.nav-link:active { transform: scale(0.95) }
main { padding-top: 80px }
section { box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: background-color 0.4s ease-out, border-color 0.4s ease-out, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) }
h2 { margin-top: 0 }
section.highlight { transform: scale(1.03); box-shadow: 0 10px 20px rgba(255, 215, 0, 0.2) }
```

### [Simple Menu Navigation](https://codepen.io/karimbalaa/pen/WboBBY)

on hover of a.btn: a.btn: background+color+top | made with: :hover

```css
.btn { text-transform:uppercase }
.footer { margin-top:400px }
```

### [Animated counter element](https://codepen.io/jelmerdemaat/pen/OJzaoE)

made with: @keyframes

```css
.content-counter h3 { margin-top: 0; margin-bottom: emCalc(5); padding-bottom: emCalc(5); border-bottom: 2px solid #09F }
.counter-block { position: relative }
.counter-block .counter-text { position: relative }
.counter-block .counter-text .counter-ruler { position: absolute; top: 0; bottom: 0 }
.counter-block:before { position: absolute; top: 50%; border-top: 12px solid transparent; border-bottom: 12px solid transparent; margin-top: -12px }
from { transform: translateY(300%) }
to { transform: translateY(0) }
from { transform: translateY(300%) }
to { transform: translateY(0) }
.counter-number { position: relative; transform: translate3d(0, 300%, 0); -webkit-animation: countdown 1s forwards; animation: countdown 1s forwards }
.counter-number:nth-of-type(1) { -webkit-animation-delay: 0.1s; animation-delay: 0.1s }
.counter-number:nth-of-type(2) { -webkit-animation-delay: 0.2s; animation-delay: 0.2s }
```

### [Trapezoid Header Using Transform: SkewY](https://codepen.io/anon/pen/EZozpV)

made with: nothing recognised — read the code

```css
header { position: relative }
.header__bg { position: absolute; top: 0; bottom: 0; transform: skewY(-6deg) }
header h1 { position: relative }
```

### [New Transaction Hover Animation](https://codepen.io/TurkAysenur/pen/wvaGqXW)

on scroll: div.container: transform+top, div.card: transform+top, div.post: transform+top | made with: @keyframes · transition · :hover

```css
.container { position: relative; transition: 0.3s ease-in-out }
.container:before { position: absolute; top: 0 }
.container:hover { transform: scale(1.03) }
.left-side { position: relative; transition: 0.3s }
.right-side { transition: 0.3s }
.card { position: absolute; -webkit-box-shadow: 9px 9px 9px -2px rgba(77, 200, 143, 0.72); -moz-box-shadow: 9px 9px 9px -2px rgba(77, 200, 143, 0.72); -webkit-box-shadow: 9px 9px 9px -2px rgba(77, 200, 143, 0.72) }
.card-line { margin-top: 7px }
.container { transform: scale(0.7) }
.container:hover { transform: scale(0.74) }
.buttons { box-shadow: 0 -10px 0 0 var(--button-color-3), 0 10px 0 0 var(--button-color-1); margin-top: 5px; transform: rotate(90deg) }
.container:hover .card { animation: slide-top 1.2s cubic-bezier(0.645, 0.045, 0.355, 1) both }
.container:hover .post { animation: slide-post 1s cubic-bezier(0.165, 0.84, 0.44, 1) both }
```

### [Feature detect scroll-driven animations support but exclude Firefox’s partial implementation](https://codepen.io/bramus/pen/qBzejKe)

made with: scroll-driven animation (animation-timeline) · scroll() timeline · animation-range

### [Styled Components ProductCardSlide](https://codepen.io/robyoung75/pen/RwVLdNq)

on scroll: div.sc-bdnxRM: transform+background+top, div.sc-bdnxRM: opacity+top, div.sc-bdnxRM: transform+top | made with: transition · :hover

### [Playlist Carousel - css only](https://codepen.io/aybukeceylan/pen/RwrRPoO)

made with: transition · 3D (perspective / preserve-3d)

```css
body { transition: background 0.4s ease-in }
.card { position: absolute; transition: transform 0.4s ease }
.cards { position: relative; margin-bottom: 20px }
#item-1:checked ~ .cards #song-3, #item-2:checked ~ .cards #song-1, #item-3:chec { transform: translatex(-40%) scale(0.8); opacity: 0.4 }
#item-1:checked ~ .cards #song-2, #item-2:checked ~ .cards #song-3, #item-3:chec { transform: translatex(40%) scale(0.8); opacity: 0.4 }
#item-1:checked ~ .cards #song-1, #item-2:checked ~ .cards #song-2, #item-3:chec { transform: translatex(0) scale(1); opacity: 1 }
#item-1:checked ~ .cards #song-1 img, #item-2:checked ~ .cards #song-2 img, #ite { box-shadow: 0px 0px 5px 0px rgba(81, 81, 81, 0.47) }
.upper-part { position: relative; margin-bottom: 12px }
.progress { position: relative }
.info-area { position: absolute; top: 0; transition: transform 0.4s ease-in }
#item-2:checked ~ .player #test { transform: translateY(0) }
#item-2:checked ~ .player #test { transform: translateY(-40px) }
```

### [Neumorphic-toggle- button](https://codepen.io/somali_12/pen/YzqEbdp)

made with: transition

```css
* { box-shadow: none }
.switch-holder { margin-bottom: 30px; box-shadow: -8px -8px 15px rgba(255,255,255,.7), 10px 10px 10px rgba(0,0,0, .3), inset 8px 8px 15px rgba(255,255,255,.7), inset 10px 10px 10px rgba(0,0,0, .3) }
.switch-toggle input[type="checkbox"] { position: absolute; opacity: 0 }
.switch-toggle input[type="checkbox"] + label { position: relative; box-shadow: inset -8px -8px 15px rgba(255,255,255,.6), inset 10px 10px 10px rgba(0,0,0, .25) }
.switch-toggle input[type="checkbox"] + label::before { position: absolute; top: 8px; box-shadow: -3px -3px 5px rgba(255,255,255,.5), 3px 3px 5px rgba(0,0,0, .25); transition: .3s ease-in-out }
.switch-toggle input[type="checkbox"]:checked + label::before { box-shadow: -3px -3px 5px rgba(255,255,255,.5), 3px 3px 5px #00b33c }
```

### [position-visibility: anchors-visible](https://codepen.io/web-dot-dev/pen/qBGBxRx)

held: fixed div | made with: position: fixed · transition · :hover

```css
.scroller { position: relative; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15) }
.item { margin-top: 1px; transition: background-color 0.2s ease }
#anchor-top-anchor { bottom: anchor(--anchor top); position: absolute }
#tooltip { position: fixed; bottom: anchor(--anchor-top-anchor top); box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25); filter: drop-shadow(4px 4px 4px rgba(50,50,50,0.3)) }
#tooltip::after { position: absolute; top: 100% }
```

### [Pure CSS3 Mega Dropdown Menu With Animation (Vertical)](https://codepen.io/rizkykurniawanritonga/pen/sqcAn)

on hover of li.: a.: color, i.fa: color, strong.: color, small.: color | made with: transition · :hover

```css
.container { position: relative }
.mcd-menu li { position: relative }
.mcd-menu li a { position: relative; border-bottom: 1px solid #EEE }
.mcd-menu li a strong { text-transform: uppercase }
.mcd-menu li a i, .mcd-menu li a strong, .mcd-menu li a small { position: relative; transition: all 300ms linear; -o-transition: all 300ms linear; -ms-transition: all 300ms linear; -moz-transition: all 300ms linear; -webkit-transition: all 300ms linear }
.mcd-menu li:hover > a i { opacity: 1; -webkit-animation: moveFromTop 300ms ease-in-out; -moz-animation: moveFromTop 300ms ease-in-out; -ms-animation: moveFromTop 300ms ease-in-out; -o-animation: moveFromTop 300ms ease-in-out; animation: moveFromT }
.mcd-menu li:hover a strong { opacity: 1; -webkit-animation: moveFromLeft 300ms ease-in-out; -moz-animation: moveFromLeft 300ms ease-in-out; -ms-animation: moveFromLeft 300ms ease-in-out; -o-animation: moveFromLeft 300ms ease-in-out; animation: moveF }
.mcd-menu li:hover a small { opacity: 1; -webkit-animation: moveFromRight 300ms ease-in-out; -moz-animation: moveFromRight 300ms ease-in-out; -ms-animation: moveFromRight 300ms ease-in-out; -o-animation: moveFromRight 300ms ease-in-out; animation: m }
.mcd-menu li a.active { position: relative; box-shadow: 0 0 5px #DDD; -moz-box-shadow: 0 0 5px #DDD; -webkit-box-shadow: 0 0 5px #DDD }
.mcd-menu li a.active:before { position: absolute; top: 42%; border-top: 5px solid transparent; border-bottom: 5px solid transparent }
.mcd-menu li a.active:after { position: absolute; top: 42%; border-top: 5px solid transparent; border-bottom: 5px solid transparent }
from { opacity: 0; -webkit-transform: translateY(200%); -moz-transform: translateY(200%); -ms-transform: translateY(200%); -o-transform: translateY(200%); transform: translateY(200%) }
```

### [Apple Dock Navigation Bar - Osmo](https://codepen.io/osmosupply/pen/BaXPYNQ)

held: fixed div.nav-wrap, fixed div.osmo-credits | on hover of li.nav-item: div.nav-item__tooltip: transform+opacity+top | made with: position: fixed · transition · :hover · GSAP

```css
.cloneable { position: relative }
.nav-wrap { position: fixed; inset: 0 0 10vh }
.nav-list { margin-bottom: 0 }
.nav-item { transition: width .5s cubic-bezier(.16, 1, .3, 1); position: relative }
.nav-item__link { position: relative }
.nav-item__tooltip { opacity: 0; transition: transform .5s cubic-bezier(.16, 1, .3, 1), opacity .5s cubic-bezier(.16, 1, .3, 1); position: absolute; top: 0; transform: translate(0, -80%) }
.nav-item:hover .nav-item__tooltip { opacity: 1; transform:translate(0px, -140%) }
.osmo-credits { position: fixed; bottom: 0 }
```

```js
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [Mobile menu #tailwind](https://codepen.io/kristen17/pen/poNLzMO)

made with: nothing recognised — read the code

### [3d Carousel Swipe](https://codepen.io/alphardex/pen/YzqKJGM)

made with: transition · 3D (perspective / preserve-3d) · custom properties driven by JS

```css
.swiper { position: absolute }
.camera { --d-carousel-transition: 0.3s; --d-carousel-perspective: 250px; position: relative; perspective: var(--d-carousel-perspective) }
.camera .d-carousel { position: absolute; transform: translateZ(var(--d-carousel-translate-z)) rotateX(var(--d-carousel-rotate-x)); transition: var(--d-carousel-transition) }
.camera .d-carousel-item { position: absolute; top: var(--d-carousel-item-gap); transform: rotateX(var(--d-carousel-item-rotate-x)) translateZ(var(--d-carousel-item-translate-z)) }
.tip { position: absolute; top: 4rem }
```

```js
style.setProperty("--d-carousel-item-r", `${dCarouselItemR}px`)
style.setProperty("--d-carousel-item-deg", `${dCarouselItemDeg}deg`)
style.setProperty("--i", `${i}`))
style.setProperty("--d-carousel-rotate-x", `${swipeDeg}deg`)
```

### [Radial Menu Popover with @function and sibling-index()](https://codepen.io/una/pen/YPwWLJd)

held: fixed ul | made with: transition · :focus-visible · :has() · clip-path · popover

```css
.item { transform: --polar-coordinate(var(--angle), var(--radius)); opacity: 0; transition: all 0.3s var(--delay) ease }
#menu-items:not(:popover-open) .item { rotate: 45deg }
.menu-toggle > div { transition: transform 0.3s }
.menu:has(:popover-open) .menu-toggle > div { transform: rotate(45deg) }
#menu-items { inset: auto }
.hidden-close { transform: rotate(45deg); transition: opacity 0.1s }
:popover-open .item { opacity: 1 }
.sr-only { clip-path: inset(50%); position: absolute }
```

### [Glow slider](https://codepen.io/alvaromontoro/pen/BabJQqx)

made with: nothing recognised — read the code

```css
.glow { position: relative }
.glow::before { position: absolute; top: 0; box-shadow: 0 0 0.2em 0 hsl(0 0% 0%) inset, -0.1em 0.1em 0.1em -0.1em hsl(0 0% 100% / 0.5), 0 0 calc(1em + 0.001em * var(--val)) calc(0.1em + 0.00025em * var(--val)) var(--c) }
.glow::-webkit-slider-runnable-track { box-shadow: 0 0 0.2em 0 hsl(0 0% 0%) inset, -0.1em 0.1em 0.1em -0.1em hsl(0 0% 100% / 0.5) }
.glow::-moz-range-track { box-shadow: 0 0 2px 0 hsl(0 0% 0%) inset, -1px 1px 1px -1px hsl(0 0% 100% / 0.5) }
.glow::-webkit-slider-thumb { transform: translateY(calc(-50% + 0.5em)); box-shadow: inset -0.15em -0.15em 0.2em #0008, inset 0.15em 0.15em 0.2em #ffffff22, inset calc(var(--val) * 1em / 500) 0em calc(var(--val) * 1em / 500) calc(var(--val) * -1em /  }
.glow::-moz-range-thumb { box-shadow: inset -0.15em -0.15em 0.2em #0008, inset 0.15em 0.15em 0.2em #ffffff22, inset calc(var(--val) * 1em / 500) 0em calc(var(--val) * 1em / 500) calc(var(--val) * -1em / 700) var(--c), 0.25em 0.25em 0.5em #0006, c }
```

### [Table with Sticky Header and Sticky First Column](https://codepen.io/anon/pen/yLVNErX)

held: sticky caption, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th | made with: position: sticky

```css
table thead th { position: sticky; top: 0 }
table tbody th { position: relative }
table thead th:first-child { position: sticky }
table tbody th { position: sticky }
caption { position: sticky }
[role="region"][aria-labelledby][tabindex]:focus { box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.5) }
```

### [Tailwind CSS Pagination - WindUI](https://codepen.io/windui/pen/xxjZdNY)

made with: nothing recognised — read the code

### [Spinners](https://codepen.io/ainalem/pen/poyWvJw)

on scroll: svg.[object: transform+top ×5 | made with: @keyframes · clip-path

```css
.spinner { animation: Rotate 2.4s both infinite linear }
.path { animation: DrawLine 1.6s both infinite alternate linear }
0% { transform: rotate(0deg) }
100% { transform: rotate(360deg) }
@keyframes Rotate animates transform
@keyframes DrawLine animates stroke-dasharray
```

### [Play & Pause Button](https://codepen.io/aaroniker/pen/abzOdRR)

held: fixed a.dribbble, fixed a.twitter | on scroll: button.play-pause-button: transform+shadow+top | made with: position: fixed · @keyframes · transition · :hover · clip-path

```css
.play-pause-button { position: relative; transform: translateY(var(--y, 0)) translateZ(0); box-shadow: 0 var(--shadow-y, 6px) var(--shadow-b, 16px) var(--shadow, var(--pause-shadow)); background-position: 0% 0%; transition: background 0.8s,  }
.play-pause-button:before, .play-pause-button:after { position: absolute; top: 15px; transform: translateX(var(--x, 0)) translateZ(0); -webkit-clip-path: polygon(0 0, 3px 0, 3px 12px, 0 12px); clip-path: polygon(0 0, 3px 0, 3px 12px, 0 12px); transition: -webkit-clip-path 0 }
.play-pause-button i { opacity: var(--o, 1); transform: translateX(var(--x, 0)); transition: transform 0.6s, opacity 0.6s }
.play-pause-button.paused { -webkit-animation: var(--name, background-paused) 0.8s ease forwards; animation: var(--name, background-paused) 0.8s ease forwards }
.play-pause-button.paused:before { -webkit-clip-path: polygon(0 0, 11px 6px, 11px 6px, 0 12px); clip-path: polygon(0 0, 11px 6px, 11px 6px, 0 12px) }
.play-pause-button.paused:after { -webkit-animation: to-play 0.9s ease forwards; animation: to-play 0.9s ease forwards }
.play-pause-button.paused.playing:before { -webkit-clip-path: polygon(0 0, 3px 0, 3px 12px, 0 12px); clip-path: polygon(0 0, 3px 0, 3px 12px, 0 12px) }
.play-pause-button.paused.playing:after { -webkit-animation: to-pause 1.3s ease forwards; animation: to-pause 1.3s ease forwards }
15% { transform: translateX(6px) scaleY(1.1) }
30% { transform: translateX(6px) scaleY(0.9) }
45% { transform: translateX(6px) scaleY(1.15); -webkit-clip-path: polygon(0 0, 3px 0, 3px 12px, 0 12px); clip-path: polygon(0 0, 3px 0, 3px 12px, 0 12px) }
60%, 100% { -webkit-clip-path: polygon(0 9px, 3px 9px, 3px 12px, 0 12px); clip-path: polygon(0 9px, 3px 9px, 3px 12px, 0 12px) }
```

### [Bootstrap 5 Product Card (Bootstrap Horizontal Card #2)](https://codepen.io/codingyaar/pen/ZEqEpem)

made with: nothing recognised — read the code

```css
.card { box-shadow: 0 7px 7px rgba(0, 0, 0, 0.18) }
```

### [#codeVember #24/2021: toggle](https://codepen.io/thebabydino/pen/VwzJjow)

made with: transition · clip-path · custom properties driven by JS

```css
.wrap::after { translate: calc(var(--k)*6em); rotate: calc(var(--k)*135deg); transition: 1s }
input { opacity: 0 }
label { box-shadow: inset 0 0.125em 0.125em #212121, inset 0 0.125em 0.25em hsl(var(--hue), 80%, 40%), inset 0 -0.125em 0.125em rgba(146, 146, 146, 0.65); clip-path: inset(0 calc(var(--i)*var(--not-sel)*100%) 0 calc(var(--not-i) }
```

```js
style.setProperty('--k', +_t.id.substring(1))
```

### [Navigation Dotted Hover Effect](https://codepen.io/WhisnuYs/pen/XWdpdGP)

on hover of a.: a.: color, div.dot: opacity | made with: transition · :hover

```css
.navMenu { position: absolute; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%) }
.navMenu a { text-transform: uppercase; -webkit-transition: all 0.2s ease-in-out; transition: all 0.2s ease-in-out }
.navMenu .dot { opacity: 0; -webkit-transform: translateX(30px); transform: translateX(30px); -webkit-transition: all 0.2s ease-in-out; transition: all 0.2s ease-in-out }
.navMenu a:nth-child(1):hover ~ .dot { -webkit-transform: translateX(30px); transform: translateX(30px); -webkit-transition: all 0.2s ease-in-out; transition: all 0.2s ease-in-out; opacity: 1 }
.navMenu a:nth-child(2):hover ~ .dot { -webkit-transform: translateX(110px); transform: translateX(110px); -webkit-transition: all 0.2s ease-in-out; transition: all 0.2s ease-in-out; opacity: 1 }
.navMenu a:nth-child(3):hover ~ .dot { -webkit-transform: translateX(200px); transform: translateX(200px); -webkit-transition: all 0.2s ease-in-out; transition: all 0.2s ease-in-out; opacity: 1 }
.navMenu a:nth-child(4):hover ~ .dot { -webkit-transform: translateX(285px); transform: translateX(285px); -webkit-transition: all 0.2s ease-in-out; transition: all 0.2s ease-in-out; opacity: 1 }
```

### [Untitled](https://codepen.io/anon/pen/MWGOKmG)

made with: transition · :hover

```css
.box { position: relative }
.box:before { position:absolute; top:0; bottom:0; transition: .5s }
.box:hover::before { transform: translate(25%) }
```

### [Slides Pinning - Overscroll Solution](https://codepen.io/GreenSock/pen/bGRdvMy)

held: fixed section.section | on scroll: section.section: transform+opacity+top, div.section-inner: transform+top | made with: position: fixed · GSAP · ScrollTrigger

```css
.nav { position: fixed; top: 0 }
.slides-wrapper { margin-top: 63px }
.image { margin-top: 2.5rem }
.section { position: relative }
.section-2 .section-inner { padding-bottom: 20vh }
.height { padding-bottom: 5rem }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline({
scrollTrigger:{ trigger: panel, start: "bottom bottom", end: () => fakeScrollRatio ? `+=${innerpanel.offsetHeight}
```

### [CSS Counter Grid](https://codepen.io/rpsthecoder/pen/qpaoGq)

made with: nothing recognised — read the code

```css
.total span { margin-bottom: 3px }
```

### [Clip-path: Demo](https://codepen.io/imohkay/pen/pJjVob)

made with: clip-path

```css
.element { -webkit-clip-path: polygon(0 100%, 0 0, 100% 0, 80% 100%); clip-path: polygon(0 100%, 0 0, 100% 0, 80% 100%); -webkit-clip-path: url("#clip-shape"); clip-path: url("#clip-shape") }
```

### [Gooey icons](https://codepen.io/kevin-carlos-grajeda-a/pen/WbNGgvp)

made with: @keyframes

```css
from { opacity: 0 }
to { opacity: 1 }
from { opacity: 1 }
to { opacity: 0 }
from { filter: blur(10px) }
to { filter: blur(0) }
from { filter: blur(0) }
to { filter: blur(10px) }
.showing { animation: opacity-in 150ms linear forwards, blur-in 400ms linear forwards }
.hiding { animation: blur-out 400ms linear forwards, opacity-out 150ms linear 300ms forwards }
.contrast-button { filter: contrast(200) blur(0.2px) }
.hidden { opacity: 0; filter: blur(10px) }
```

### [Animated 3d Flipping Loading Text](https://codepen.io/SandipDust/pen/LYPOGLQ)

on scroll: span.: transform+top ×4 | made with: @keyframes · 3D (perspective / preserve-3d)

```css
.loader { -webkit-perspective:700px; perspective: 700px }
.loader>span { animation:flip 2.6s infinite linear }
35% { transform: rotateX(360deg) }
100% { transform: rotatex(360deg) }
.loader>span:nth-child(2) { animation-delay: 0.3s }
.loader>span:nth-child(3) { animation-delay: 0.6s }
.loader>span:nth-child(4) { animation-delay: 0.9s }
.loader>span:nth-child(5) { animation-delay: 1.2s }
.loader>span:nth-child(6) { animation-delay: 1.5s }
.loader>span:nth-child(7) { animation-delay: 1.8s }
@keyframes flip animates transform
```

### [Scroll-Linked Animation: Parallax Cover to Sticky Header (@scroll-timeline Version)](https://codepen.io/bramus/pen/ExgOPRw)

held: fixed div, fixed dialog.sda_update | on scroll: div.: background | made with: position: sticky · position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
#sticky-parallax-header { animation: sticky-parallax-header-move-and-size 2s linear; animation-fill-mode: forwards; animation-timeline: parallax-timeline }
from { background-position: 50% 0 }
to { background-position: 50% 100% }
scroll-timeline parallax-timeline { scroll-offsets: 0vh, 90vh }
#sticky-parallax-header { position: fixed; top: 0 }
#content { padding-top: 100vh !important }
#sticky-parallax-header { background-position: 50% 50% }
#content { padding-top: 1em }
@keyframes sticky-parallax-header-move-and-size animates background-position, background-color, height, font-size
```

### [Chromatic Aberration - Logo Effect on Hover](https://codepen.io/ComputerK/pen/jEbEdXe)

on scroll: div.cursor: transform+top | made with: mask · pointer / mouse tracking

```css
.logo-container { position: relative }
.logo-under { position: relative }
.logo-over { position: absolute; top: 0; filter: drop-shadow(4px 0 4px #f00) drop-shadow(-4px 0 4px #0ff); -webkit-mask: radial-gradient(circle 300px at 50% 50%, black, transparent); mask: radial-gradient(circle 300px at 50% 50%, bla }
.cursor { position: absolute; opacity: 0.5 }
```

```js
addEventListener("mousemove", (e) => {
```

### [Fixed sticky header when scrolling](https://codepen.io/JGallardo/pen/ZEBbeP)

made with: position: fixed · scroll() timeline

```css
.header-banner { background-position: center }
header h1 { position: absolute; top: 2rem }
.fixed-header { position: fixed; top: 0 }
nav div { position: absolute; top: 0 }
article p:first-of-type { margin-top: 0 }
article:last-of-type { margin-bottom: 3rem }
```

### [Scroll-Triggered Animations: Trigger Ranges Visualizer](https://codepen.io/web-dot-dev/pen/gbLMPrL)

held: fixed div.controls, fixed div.warnings, fixed div.debug-line, fixed div.debug-line, fixed div.debug-line, fixed div.debug-line | on scroll: div.debug-line: opacity ×2, div.status-badge: opacity, img.: opacity+top | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · transition · :hover · :has()

```css
.img-wrapper { animation: none !important }
from { opacity: 0.1 }
0% { border-bottom: 3px solid hotpink }
100% { border-top: 3px solid hotpink }
img { animation: --reveal 0.35s ease both; animation-trigger: --t play-forwards play-backwards }
from { opacity: 0 }
&.inactive { animation-direction: reverse }
&.trigger-activation-range-start, &.trigger-activation-range-end { animation-direction: reverse }
&:hover { opacity: 1 }
> * { box-shadow: var(--shadow-md) }
.status-dot { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative }
.status-dot::after { position: absolute; top: 0; bottom: 0; opacity: 0.6; filter: blur(4px); transition: background-color 0.3s ease }
```

### [scroll-padding example](https://codepen.io/anon/pen/GzQpbq)

made with: scroll-snap

```css
.container { margin-bottom: 10px; position: relative }
.element { scroll-snap-align: start; scroll-snap-stop: normal }
.both-mandatory { scroll-snap-type: both mandatory }
.scroll-wrapper { position: relative }
.scroll-padding-top, .scroll-padding-left { position: absolute; top: 0; opacity: 0.5 }
.scroll-padding-top { top: 2px }
.scroll-wrapper-50px .scroll-padding-left { transform: rotate(-90deg); top: calc(360px / 2 - 50px / 2 + 2px) }
.scroll-wrapper-100px .scroll-padding-left { transform: rotate(-90deg); top: calc(360px / 2 - 100px / 2 + 2px) }
```

### [Mario button](https://codepen.io/nicolasjesenberger/pen/KKGKeZO)

held: fixed a._twitter-link | made with: @keyframes · transition · :focus-visible

```css
.button { position: relative; box-shadow: inset 0 -4px 8px #87bfd8, 0 4px 6px rgba(0, 0, 0, 0.2); transition: transform 0.4s cubic-bezier(0.55, 1, 0.15, 1); will-change: transform }
.button:active { transform: scale(0.92) }
.button:active::after { opacity: 1 }
.button::after { position: absolute; inset: 0; transform: scale(1.04, 1.08); opacity: 0; transition-property: opacity; will-change: transform }
.button:focus-visible::after { opacity: 1; animation: pulsate 1s infinite }
0% { transform: scale(1.04, 1.08) }
50% { transform: scale(1.08, 1.12) }
100% { transform: scale(1.04, 1.08) }
@keyframes pulsate animates transform
```

### [CSS only pattern](https://codepen.io/t_afif/pen/vYddpzK)

made with: nothing recognised — read the code

### [responsive accordion](https://codepen.io/Codrey/pen/eYZvpeQ)

made with: transition · :hover

```css
.accordion-wrap .accordion { position: relative; border-top: 1px solid #fff }
.accordion-wrap .accordion:last-child { border-bottom: 1px solid #fff }
.accordion-wrap .accordion .teaser { position: relative }
.accordion-wrap .accordion .teaser:last-child { border-bottom: 1px solid #fff }
.accordion-wrap .accordion .teaser .time { margin-top: 5px }
.accordion-wrap .accordion .teaser .title .theme { opacity: 0.4 }
.accordion-wrap .accordion .accordion-toggle { position: absolute; top: 0; transition: 0.3s ease }
.accordion-wrap .accordion .accordion-toggle span { transition: 0.3s ease }
.accordion-wrap .accordion .accordion-toggle span.one { position: absolute; top: 50% }
.accordion-wrap .accordion .accordion-toggle span.two { position: absolute; opacity: 0; transform: rotate(120deg) }
.accordion-wrap .accordion.collapsed .accordion-toggle span.two { opacity: 1; transform: rotate(0) }
```

### [Control Interaction](https://codepen.io/dev_loop/pen/gOpwywd)

made with: transition · :hover · 3D (perspective / preserve-3d) · GSAP

```css
#app ul { position: relative; transform: perspective(1000px) }
#app ul li { text-transform: capitalize }
#app ul .focus-el { position: absolute; top: 0 }
.support { position: absolute; bottom: 10px }
.support a { transition: all 150ms ease }
.support a:hover { transform: scale(1.1) }
```

```js
gsap.timeline()
```

### [Card UI Skeleton Screen](https://codepen.io/mxbck/pen/EvmLVp)

made with: @keyframes

```css
:root { --avatar-position: var(--card-padding) var(--card-padding); --title-position: var(--card-padding) 180px; --desc-line-1-position: var(--card-padding) 242px; --desc-line-2-position: var(--card-padding) 265px; --footer-posi }
.card:empty::after { box-shadow: 0 10px 45px rgba(0, 0, 0, 0.1); background-position: -150% 0, var(--title-position), var(--desc-line-1-position), var(--desc-line-2-position), var(--avatar-position), var(--footer-position), 0 0; -webkit-anim }
to { background-position: 350% 0, var(--title-position), var(--desc-line-1-position), var(--desc-line-2-position), var(--avatar-position), var(--footer-position), 0 0 }
to { background-position: 350% 0, var(--title-position), var(--desc-line-1-position), var(--desc-line-2-position), var(--avatar-position), var(--footer-position), 0 0 }
@keyframes loading animates background-position
```

### [Lo-fi Tailwind CSS Dropdown - With Search](https://codepen.io/robstinson/pen/jOqvwBW)

made with: nothing recognised — read the code

### [Mouse Scroll Down animated icon with chevrons pure css](https://codepen.io/aledebarba/pen/wvGYYXX)

on scroll: div.chevrondown: opacity+top ×6 | made with: @keyframes

```css
.scrolldown { position: relative; margin-bottom: 16px }
.scrolldown::before { position: absolute; bottom: 30px; animation: scrolldown-anim 2s infinite; box-shadow: 0px -5px 3px 1px #ffffff66 }
0% { opacity: 0 }
40% { opacity: 1 }
80% { transform: translate(0, 20px); opacity: 0 }
100% { opacity: 0 }
.chevrons { margin-top: 48px }
.chevrondown { margin-top: -6px; position: relative; transform: rotate(45deg) }
.chevrondown:nth-child(odd) { animation: pulse 500ms ease infinite alternate }
.chevrondown:nth-child(even) { animation: pulse 500ms ease infinite alternate 250ms }
from { opacity: 0 }
to { opacity: 0.5 }
```

### [React 3D carousel](https://codepen.io/AdamMorsi/pen/xxRgGmo)

held: fixed div.slideBackground, fixed div.slideBackground, fixed div.slideBackground, fixed div.slideBackground, fixed div.slideBackground, fixed div.slideBackground, fixed div.slideBackground, fixed div.slideBackground, fixed div.slideBackground | on hover of button.prevSlideBtn: button.prevSlideBtn: opacity | made with: position: fixed · transition · :hover · 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking

```css
.slideContent { background-position: center center; transition: transform 0.5s ease-in-out; opacity: 0.7; transform: perspective(1000px) translateX(calc(100% * var(--offset))) rotateY(calc(-45deg * var(--dir))) }
.slideContentInner { transform: translateZ(2rem); transition: opacity 0.3s linear; opacity: 0 }
.slideContentInner .slideSubtitle, .slideContentInner .slideTitle { text-transform: uppercase }
.slideBackground { position: fixed !important; top: 0; bottom: 0; background-position: center center; opacity: 0; transition: opacity 0.3s linear, transform 0.3s ease-in-out; transform: translateX(calc(10% * var(--dir))) }
.slide[data-active] .slideBackground { opacity: 0.1; transform: none }
.slide[data-active] .slideContentInner { opacity: 1 }
.slide[data-active] .slideContent { opacity: 1; transform: perspective(1000px) translateX(calc(100% * var(--offset))); transition: transform 0.5s ease-in-out }
.slide[data-active] .slideContent:hover { transition: none; transform: perspective(1000px) rotateY(calc(var(--x) * 45deg)) rotateX(calc(var(--y) * -45deg)) }
.slidesWrapper *, .slidesWrapper *::before, .slidesWrapper *::after { position: relative }
.slides > .prevSlideBtn, .slides .nextSlideBtn { position: absolute; top: 30%; transition: opacity 0.3s; opacity: 0.7 }
.slides > .prevSlideBtn:hover, .slides .nextSlideBtn:hover { opacity: 1 }
```

```js
style.setProperty('--px', px.toFixed(2))
style.setProperty('--py', py.toFixed(2))
style.setProperty('--px', 0.5)
style.setProperty('--py', 0.5)
addEventListener('mouseenter', handleEnterEvent)
addEventListener('mousemove', handleMoveEvent)
addEventListener('mouseleave', handleEndEvent)
```

### [Expanding card page transition effect](https://codepen.io/rachsmith/pen/PWxoLN)

held: fixed div.cover | made with: position: fixed · scroll() timeline · transition

```css
.column-1 { padding-top: 100px }
.card { position: relative; margin-bottom: 60px }
.border { position: absolute; opacity: 0.5; top: -6px }
.card h1 { position: relative }
.card > img { position: absolute; top: -6% }
.cover { position: fixed }
.open-content { position: absolute; opacity: 0 }
.open-content img { position: relative; margin-top: 20px }
.open-content .text { margin-top: -56%; margin-bottom: 5% }
.close-content { position: absolute; top: 12px }
.close-content span { position: absolute; top: 14px }
.x-1 { transform: rotate(45deg) }
```

### [Custom select in React JS](https://codepen.io/joseeduardo-rp/pen/vYmoLyx)

on scroll: div.default-time-style: filter | made with: transition · :hover · clip-path

```css
button { transition: filter 0.3s }
button:hover { filter: brightness(0.9) }
.default-time-style { text-transform: uppercase; box-shadow: 0 2px 5px rgba(60, 149, 199, 0.2) }
.current-time { transition: filter 0.3s }
.current-time:hover { filter: brightness(0.95) }
.current-time::after { clip-path: polygon(100% 0%, 0 0%, 50% 100%) }
.other-times span { transition: filter 0.3s }
.other-times span:hover { filter: brightness(0.95) }
```

### [Footer Bounce Based on Scroll Speed](https://codepen.io/GreenSock/pen/bGeZvpO)

made with: GSAP · ScrollTrigger

```css
body { position: relative }
p { position: absolute; top: 40vh }
.footer { position: absolute; bottom: 0 }
.footer:after { position: absolute; top: 0 }
```

```js
gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin)
ScrollTrigger.create({
gsap.fromTo('#bouncy-path', {
```

### [Button | #cpc-click-button#codepenchallenge](https://codepen.io/Anna_Batura/pen/RwKgmLw)

held: fixed span.link | on scroll: g.[object: transform+top ×8 | on hover of button.btn: g.[object: transform+top ×8 | made with: position: fixed · transition · :hover · custom properties driven by JS · pointer / mouse tracking

```css
.svg-background { position: absolute; bottom: 0 }
.btn { position: relative; transition: all 0.3s ease-in }
.btn_text { position: relative }
.link { position: fixed; bottom: 10px }
.link svg { position: relative; top: 5px }
.mover { position: absolute; top: 0; margin-top: -10px; top: var(--mouse-y); transform: scale(1.5); transition: all 0.1s ease-out }
.mover.active { transform: scale(0.8) }
.mouse { position: absolute; top: var(--mouse-btn-y) }
.mouse .svg { position: absolute; top: -110px }
```

```js
addEventListener("mousemove", (e) => {
style.setProperty("--mouse-x", e.clientX + "px")
style.setProperty("--mouse-y", e.clientY + "px")
```

### [Scroll-Linked Animations: Progress Bar (WAAPI Version, Alternative Syntax)](https://codepen.io/anon/pen/xxrYgjm)

held: fixed div, fixed dialog.sda_update | on scroll: div.: transform | made with: position: fixed · scroll() timeline · Web Animations API (.animate)

```css
#progress { position: fixed; top: 0; transform: scaleX(0) }
```

```js
.animate( {
```

### [Profile hover effect with tailwind](https://codepen.io/sujon-khan-tonmoy/pen/yLKEwvg)

on scroll: div.card: background | on hover of div.: div.: background, div.card: background | made with: transition · :hover

```css
.card { box-shadow: 0 70px 63px -60px #000000; transition: background 1s }
.card0 { background-position: center center }
.card0:hover { background-position: left center }
.card1 { background-position: center center }
.card1:hover { background-position: left center }
.card2 { background-position: center center }
.card2:hover { background-position: left center }
```

### [Mike Worth’s dialog](https://codepen.io/malarkey/pen/OPPYQjZ)

made with: @keyframes · transition · :has() · prefers-reduced-motion · clip-path · <dialog> · requestAnimationFrame

```css
[data-visibility="hidden"] { position: absolute; -webkit-clip-path: polygon(0px 0px, 0px 0px, 0px 0px); clip-path: polygon(0px 0px, 0px 0px, 0px 0px) }
html { animation-duration: 1ms !important; animation-iteration-count: 1 !important }
h2 { text-transform: uppercase }
[type="email"] { box-shadow: none; transition: all .5s ease }
input:focus::-webkit-input-placeholder { transition: opacity .5s .25s ease !important; opacity: 0 }
input:focus::placeholder { transition: opacity .5s .25s ease !important; opacity: 0 }
button { box-shadow: none; text-transform: uppercase }
dialog:has(input:valid) button { animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both }
dialog { opacity: 0; scale: .5; transition: opacity .3s ease, scale .3s ease }
dialog.show { opacity: 1; scale: 1 }
dialog:has(input:valid) { animation: rubberBand 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both }
dialog #dialog-close { position: absolute; top: 10px }
```

```js
requestAnimationFrame(() => {
```

### [Exclusive Accordion Demo 3/3: Exclusive Accordion](https://codepen.io/web-dot-dev/pen/xxMBVGd)

on hover of a.: a.: background | made with: transition · :hover · :has()

```css
footer { margin-top: 2rem }
details:has(+ details) { border-bottom: none }
details + details { border-top: none }
&:not([open]) summary { border-bottom: 0 }
.sr-only { position: absolute }
```

### [CodePen Challenge: Shine](https://codepen.io/GemmaCroad/pen/QwjvXXe)

on hover of button.shine-button: button.shine-button: transform+shadow+top | made with: @keyframes · transition · :hover

```css
.header { margin-bottom: 4rem }
.main-title { margin-bottom: 1rem }
.button-collection { margin-bottom: 3rem }
.button-label { text-transform: uppercase }
.shine-button { position: relative; transition: all 0.3s ease }
.shine-button::before { position: absolute; top: 0; transform: rotate(45deg) translateY(-35%); animation: shine 3s ease infinite }
.button-ocean { box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2) }
.button-ocean:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3) }
.button-emerald { box-shadow: 0 10px 30px rgba(17, 153, 142, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2) }
.button-emerald:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(17, 153, 142, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3) }
.button-sunset { box-shadow: 0 10px 30px rgba(240, 147, 251, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2) }
.button-sunset:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(240, 147, 251, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3) }
```

### [Bootstrap 5 Sidebar Menu with Toggle Button](https://codepen.io/fullstacksagarofficial/pen/jOpKXJQ)

made with: position: fixed · transition · :hover · clip-path

```css
body { position: relative; transition: 0.5s }
.header { position: fixed; top: 0; transition: 0.5s; box-shadow: 1px 1px 17px -4px rgb(0 0 0 / 16%); -webkit-box-shadow: 1px 1px 17px -4px rgb(0 0 0 / 16%); -moz-box-shadow: 1px 1px 17px -4px rgb(0 0 0 / 16%) }
.dropdown-menu { box-shadow: 1px 1px 17px -4px rgb(0 0 0 / 24%); -webkit-box-shadow: 1px 1px 17px -4px rgb(0 0 0 / 24%); -moz-box-shadow: 1px 1px 17px -4px rgb(0 0 0 / 24%) }
.l-navbar { position: fixed; top: 0; transition: 0.5s }
.nav_logo { margin-bottom: 2rem }
.nav_link { position: relative; margin-bottom: 1.5rem; transition: 0.3s }
.active::before { position: absolute }
.height-100 { padding-top: 25px }
.btn-group button { box-shadow: none }
.mainslider .item { position: relative }
.mainslider .item .cover { position: absolute; top: 0 }
.mainslider .item .cover .mainslider-content { position: relative }
```

### [Rage Slider 💢](https://codepen.io/jkantner/pen/abOqGwB)

made with: @keyframes · transition · clip-path · canvas 2D · requestAnimationFrame

```css
.rage { position: relative }
.rage__input:active ~ .rage__face:before, .rage__input--active ~ .rage__face:bef { animation: pulse var(--animDur) var(--transDur) linear infinite; transform: scale(1) }
.rage__input:active ~ .rage__face:after, .rage__input--active ~ .rage__face:afte { transform: scaleY(1) }
.rage__input:active ~ .rage__face .rage__face-mouth, .rage__input--active ~ .rag { transform: scaleY(-1) }
.rage__track, .rage__flame-area, .rage__face, .rage__face:before, .rage__face:af { position: absolute }
.rage__track, .rage__face { transition: background var(--transDur) linear }
.rage__track { top: 0 }
.rage__flame-area { bottom: -0.375em }
.rage__face { box-shadow: 0 0 0 0.1em #0003 inset; top: -0.375em; will-change: transform }
.rage__face:before, .rage__face-mouth { transition: transform var(--transDur) linear }
.rage__face:before { top: -0.2em; transform: scale(0) }
.rage__face:after { clip-path: polygon(0 0,100% 0,50% 100%); -webkit-clip-path: polygon(0 0,100% 0,50% 100%); top: 0.3em; transition: background var(--transDur) linear, transform var(--transDur) linear; transform: scaleY(0) }
```

```js
requestAnimationFrame(() => {
```

### [Black Biometirics Button](https://codepen.io/ainalem/pen/mQBNpg)

made with: @keyframes · transition

```css
.container { box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22); position: relative }
.text { position: absolute; transition: opacity 300ms }
.fingerprint { opacity: 0; position: absolute; top: -9px; transition: opacity 1ms }
.fingerprint-out { opacity: 1 }
.odd { transition: stroke-dasharray 1ms }
.even { transition: stroke-dashoffset 1ms }
.ok { opacity: 0 }
.active.container { animation: 6s Container }
.active .text { opacity: 0; animation: 6s Text forwards }
.active .fingerprint { opacity: 1; transition: opacity 300ms 200ms }
.active .fingerprint-base .odd { transition: stroke-dasharray 800ms 100ms }
.active .fingerprint-base .even { transition: stroke-dashoffset 800ms }
```

### [Navigation tabs with background animation](https://codepen.io/flatpixels/pen/ZZRqpX)

made with: @keyframes · transition

```css
html, body { position: relative }
.cover-back { position: absolute; top: 0; bottom: 0; opacity: 1; transition: all 1s cubic-bezier(0.4, 0, 1, 1) }
.tabs { position: relative; box-shadow: 0 20px 35px rgba(0, 0, 0, .30); transition: all .4s cubic-bezier(0.65, 0.05, 0.36, 1) }
.tab-item { opacity: 0; transform: scale(0); transition: all .9s cubic-bezier(0.68, -0.55, 0.27, 1.55) }
.tab-item--middle { opacity: 1; transform: scale(1) }
to { opacity: 1; transform: scale(1) }
to { opacity: 0; transform: scale(0) }
from { opacity: 0 }
to { opacity: 1 }
from { opacity: 1 }
to { opacity: 0 }
.js-cover-back-animate { opacity: 0; transition: all 5s; animation: add-background linear 2s forwards }
```

### [Checkbox illusion](https://codepen.io/amit_sheen/pen/XJJLydd)

held: fixed div.scriptIcons | made with: transition · clip-path · mix-blend-mode

```css
&::before, &::after { position: absolute; inset: 0; background-position: 2px 28px, 28px 2px; -webkit-clip-path: polygon(50% 0, 50% 100%, 100% 100%, 100% 50%, 0 50%, 0 0); clip-path: polygon(50% 0, 50% 100%, 100% 100%, 100% 50%, 0 50%, 0 0); m }
&::after { rotate: 90deg }
&::before { background-position: 28px 28px, 2px 2px }
&::after { background-position: 2px 2px, 28px 28px }
```

### [CSS Grid based Auto Height Transition](https://codepen.io/anon/pen/qBXoEMV)

made with: transition

```css
.expander { transition: grid-template-rows 1s }
.expander-content { transition: visibility 1s }
```

### [Pill styled radio buttons | Fully scaleable](https://codepen.io/havardob/pen/dyYXBBr)

on scroll: span.: background | made with: transition · :hover

```css
label { position: relative; margin-bottom: 0.375em }
label input { position: absolute }
label input:checked + span:before { box-shadow: inset 0 0 0 0.4375em #00005c }
label span { transition: 0.25s ease }
label span:before { transition: 0.25s ease; box-shadow: inset 0 0 0 0.125em #00005c }
.container { position: absolute; top: 0; bottom: 0 }
```

### [Button w/ animated gradient](https://codepen.io/aaroniker/pen/eYXmqJO)

held: fixed a.twitter | on scroll: svg.[object: transform+opacity+top ×5, svg.[object: transform+top | on hover of button.: svg.[object: transform ×8, svg.[object: transform+top, svg.[object: transform+opacity | made with: position: fixed · mix-blend-mode · GSAP

```css
button { position: relative; box-shadow: 0px 0px 0.5px 0.5px rgba(0, 0, 0, 0.3) inset, 0px 4px 12px -3px rgba(9, 24, 85, 0.95), 0px 8px 20px 0 rgba(9, 24, 85, 0.2); --alternative-gradient-opacity: 0 }
button:before, button:after { position: absolute; mix-blend-mode: overlay; will-change: "transform" }
button:before { inset: 1px; box-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.7) inset; mix-blend-mode: overlay; filter: blur(0.25px) }
button:after { inset: 0; opacity: var(--alternative-gradient-opacity); box-shadow: 0px 0px 0.5px 0.5px rgba(0, 0, 0, 0.3) inset }
button span { position: relative; will-change: transform; --button-glow-1-scale: .6; --button-glow-1-opacity: 0; --button-glow-2-scale: .5; --button-glow-2-opacity: 0; box-shadow: inset 0 -1.5px 0 rgba(67, 35, 102, 0.7), inset 0 -2.5p }
button span svg { vertical-align: top; position: relative; filter: drop-shadow(0px 0.5px 0.75px rgba(9, 24, 85, 0.35)) }
button span:before, button span:after { position: absolute; inset: 0; mix-blend-mode: multiply }
button span:before { box-shadow: 0 0 0 3px #8D66E5; transform: scale(var(--button-glow-1-scale)) translateZ(0); opacity: var(--button-glow-1-opacity); filter: blur(var(--button-glow-1-blur)) }
button span:after { box-shadow: 0 0 0 3px #B291FF; transform: scale(var(--button-glow-2-scale)) translateZ(0); opacity: var(--button-glow-2-opacity); filter: blur(var(--button-glow-2-blur)) }
button div { position: absolute; inset: 0 }
button div:before { position: absolute; inset: 0; opacity: 0.2; mix-blend-mode: overlay }
button div svg { position: absolute; mix-blend-mode: overlay; opacity: 0; filter: blur(3px) }
```

```js
gsap.to(button, {
gsap.to(svg, {
gsap.to(span, {
```

### [Accessible Custom Toggle Switch](https://codepen.io/xirclebox/pen/wvGmjbV)

made with: transition · :hover · :focus-visible · clip-path

```css
.heading { margin-bottom: 12px }
.card { box-shadow: -20px 20px 35px 1px rgba(10, 49, 86, 0.04) }
.content-wrapper { margin-bottom: 44px }
.content-wrapper:last-child { margin-bottom: 0 }
.button:focus-visible, .btn:focus-visible { box-shadow: 0 0 0 2px #e5e6ef, 0 0 0 4px #121943 }
.link:focus { box-shadow: 0 0 0 2px #e5e6ef, 0 0 0 4px #121943 }
.input-wrapper .label { margin-bottom: 8px }
.input-wrapper .input { margin-bottom: 8px }
.input-wrapper .input:focus { box-shadow: 0 0 0 2px #e5e6ef, 0 0 0 4px #121943 }
*:focus, input[type=radio]:focus + label::before { box-shadow: 0px 0px 0px 2px #121943 }
.toggle { margin-bottom: 16px }
.toggle__input { clip-path: inset(50%); position: absolute }
```

### [Entry Animation Range Visualization](https://codepen.io/anon/pen/ZYWVboe)

held: fixed label, fixed div, fixed div | made with: position: fixed · animation-range · :has() · scroll listener

```css
#scrollbox { position: fixed; top: 25vh }
#label { position: fixed; top: 45vh }
#animation { translate: 15vw 76.5vh; position: relative; position: relative }
#animation::before { position: relative }
label { position: fixed }
```

```js
addEventListener("scroll", (event) => {
```

### [Animated-Nav](https://codepen.io/hasan_naim/pen/qBMKLOr)

on scroll: a.: color, i.lni: color | on hover of li.: a.: color, i.lni: color | made with: transition · :hover · clip-path

```css
nav { position: relative; box-shadow: 0 6.7px 5.3px rgb(0 0 0 / 12%) }
li { transition: all 300ms }
a { margin-top: 8px }
li:hover a { transition: all 300ms }
i { transform: scale(1); transition: transform 200ms ease }
nav .spotLight { position: absolute; top: 0; transition: left 300ms ease }
nav .ligthRay { position: absolute; top: 5px; clip-path: polygon(5% 100%, 25% 0px, 75% 0px, 95% 100%) }
```

### [Animated Windows XP Shutdown Icons](https://codepen.io/jkantner/pen/oNPRMQY)

on hover of div.btn-block: polyline.[object: transform+top, circle.[object: transform+top | made with: @keyframes · transition · :hover · :focus-visible

```css
body { transition: background-color var(--trans-dur), color var(--trans-dur) }
header, footer { position: absolute }
header { margin-bottom: 0.2rem; top: 0 }
footer { bottom: 0 }
header:after { position: absolute; top: 100% }
main { position: relative }
.icon-btn { box-shadow: 0 0 0 2px hsl(0,0%,100%) inset, -0.25em -0.25em 0.25em hsla(0,0%,0%,0.5) inset; position: relative }
.icon-btn:before { box-shadow: 0.5em 0.5em 0.5em hsla(0,0%,100%,0.15) inset; position: absolute; inset: 4px; transition: background-color var(--trans-dur) }
.icon__part { animation-duration: 1s }
.icon-btn--animated .icon--stand-by .icon__part--1 { animation-name: standBy1 }
.icon-btn--animated .icon--stand-by .icon__part--2 { animation-name: standBy2 }
.icon-btn--animated .icon--turn-off .icon__part { animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1) }
```

### [Toggle buttons / On-Off switches](https://codepen.io/himalayasingh/pen/PdqbqV)

made with: transition

```css
h1 { padding-bottom: 23px; border-bottom: 1px solid #dadada }
#hash-symbol { position: relative; top: 4px }
section { box-shadow: 0px 5px 35px #d7d7d7 }
.toggle-btn { position: relative }
input[type="checkbox"] { position: absolute; top: 0px; bottom: 0px; opacity: 0 }
#_1st-toggle-btn span { position: absolute; top: 0px; bottom: 0px; opacity: 1; box-shadow: 0px 2px 25px #d9d9d9; transition: 0.2s ease background-color, 0.2s ease opacity }
#_1st-toggle-btn span:before, #_1st-toggle-btn span:after { position: absolute; top: 8px; transition: 0.5s ease transform, 0.2s ease background-color }
#_1st-toggle-btn span:before { transform: translate(-58px, 0px) }
#_1st-toggle-btn span:after { transform: translate(8px, 0px) }
#_1st-toggle-btn input[type="checkbox"]:active + span { opacity: 0.5 }
#_1st-toggle-btn input[type="checkbox"]:checked + span:before { transform: translate(56px, -19px) }
#_1st-toggle-btn input[type="checkbox"]:checked + span:after { transform: translate(79px, 0px) }
```

### [Pressure Sensitive Tip Button Webflow x GSAP](https://codepen.io/jh3y/pen/GgJRXbL)

held: fixed span.arrow, fixed a.bear-link | on scroll: button.: background | made with: position: fixed · view transitions · transition · :hover · :focus-visible · :has() · clip-path · mask · 3D (perspective / preserve-3d) · GSAP

```css
[data-flipped='true'] .arrow { opacity: 0 }
.tp-lblv.tp-v-disabled .tp-lblv_l { opacity: 1 !important }
:root:has([aria-label]:active) .tp-txtv.tp-v-disabled { -webkit-clip-path: inset(0 0 0 0); clip-path: inset(0 0 0 0) }
svg { scale: 1 1; top: 130%; rotate: 20deg; translate: 105% 40%; position: absolute }
main { scale: 1.2; transform: translate3d(0, 0, 100vmax) }
.content { -webkit-clip-path: inset(-100vmax 0 1px 0); clip-path: inset(-100vmax 0 1px 0) }
&[data-tipping='false']:active { transform: rotate(calc(var(--ru) * -1deg)); box-shadow: -0.5px 0.7px 1px hsl(var(--shadow-color) / 0.14), -1.8px 2.3px 3.3px -0.8px hsl(var(--shadow-color) / 0.14), -4.6px 6px 8.5px -1.7px hsl(var(--shadow-color) / 0.14) }
.purse { rotate: y 360deg; transition: rotate 0.26s 0.12s ease-out }
.purse { position: absolute; inset: 0 }
&::before { position: absolute; top: 70%; translate: -50% -50%; box-shadow: 0 2px hsl(0 0% 20%) inset }
&::after { top: 0; translate: -50% 25%; position: absolute; transform: translate3d(0, 0, calc(var(--thickness) * 5px)); -webkit-mask: radial-gradient( 125% 32% at 50% 3%, rgba(0, 0, 0, 0) 50%, #fff 50% ); mask: radial-gradient( 125 }
&.coin__core--rotated { transform: rotateY(90deg) rotateX(calc((90 - var(--rx, 0)) * 1deg)) }
```

```js
gsap.registerPlugin(Physics2DPlugin)
startViewTransition(() => update())
```

### [Animated Login Form](https://codepen.io/alvaromontoro/pen/JjoWVmx)

on scroll: span.required: color | on hover of a.: span.required: color, a.: color | made with: @keyframes · transition · :hover

```css
form { box-shadow: 0 1rem 1rem -0.75rem var(--border); position: relative }
form .email, form .email a { margin-top: 0.25rem; outline-offset: 2px }
form a:hover { transition: color 0.25s }
form a:focus { outline-offset: 2px }
label > span { margin-top: 0.625rem; transition: all 0.25s }
label input.text:focus, label input.text:active { box-shadow: 0 1px hsl(var(--fgColorH), calc(var(--fgColorS) * 2), calc(var(--fgColorL) * 1.15)) }
input { margin-top: 0.25rem; transition: all 0.25s }
input[type="submit"] { margin-top: 0.625rem; outline-offset: 2px; text-transform: uppercase }
input[type="checkbox"]:focus + label span::before, input[type="submit"]:focus { outline-offset: 2px }
input[type="submit"]:active { transition: all 0.125s }
.a11y-hidden { position: absolute; top: -1000em }
input[type="checkbox"] + label span { position: relative }
```

### [404 on CodePen](https://codepen.io/havardob/pen/PoJapGX)

made with: nothing recognised — read the code

### [SVG Circle Progress Bar (1)](https://codepen.io/Curlmuhi/pen/YzqpmZe)

made with: transition · :hover

```css
.box { position:relative; box-shadow:0 30px 60px rgba(0,0,0,.4); transition: transform .2s }
.box .percent { position:relative }
.box .percent svg { position:relative }
.box .percent svg circle { transform:translate(5px,5px) }
.box .percent .num { top:0; position:absolute }
```

### [Particle Button](https://codepen.io/timohausmann/pen/icCer)

made with: @keyframes · transition · :hover · canvas 2D · requestAnimationFrame

```css
#button { position: absolute; text-transform: uppercase; top: 50%; animation: pulse 1s infinite alternate; transition: background 0.4s, border 0.2s, margin 0.2s }
#button:hover { margin-top: -1px; animation: none }
#button:active { margin-top: 5px }
0% { margin-top: 0px }
100% { margin-top: 6px }
@keyframes pulse animates margin-top
```

### [CodePen Challenge: Multi-buttons](https://codepen.io/Shruti-Ag/pen/gObeGXe)

made with: @keyframes · transition · :hover

```css
.btn-grp { box-shadow: 0 4px 20px rgba(18, 22, 18, 0.9) }
button { position: relative; transition: all 0.4s }
.active { box-shadow: inset 0 0 1px #fdd901; animation: bounce 0.6s linear }
.indicator { position: absolute; margin-top: 58px; transition: all 0.4s }
@keyframes bounce animates font-size
```

### [Photo Gallery with a Comic touch (click)](https://codepen.io/sergiulucutar/pen/jOEJWmY)

made with: transition · :hover · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
header > div { border-bottom: 1px solid black }
footer > div { border-top: 1px solid black }
footer { margin-top: 10vmin }
h1 { padding-bottom: 0 }
main { padding-top: 0 }
.photo { position: relative }
.photo:hover .photo_image { filter: grayscale(0) }
.photo_image, .photo_frame, .photo h2 { position: absolute; transform: translate3d(0, 0, 0); transition: transform 1s linear }
.photo_image { filter: grayscale(1); background-position: center }
.photo h2 { bottom: 0rem }
.photo > span { position: absolute; top: 10rem; transform: skew(-10deg, 10deg) }
.photo > span > span { opacity: 0; transform: scale(2); transition: opacity 0s linear, transform 0.2s linear }
```

```js
addEventListener("mouseenter", event => handleMouseEnter(event))
addEventListener("mousemove", event => handleMouseMove(event))
```

### [Hopdot Loader](https://codepen.io/chrisgannon/pen/bGwMGMw)

on scroll: g.[object: transform | made with: GSAP

```js
gsap.timeline({
```

### [Menu with hover reveal ⚪⚫](https://codepen.io/havardob/pen/rNWBXqz)

on scroll: span.link-title: transform | on hover of a.link: span.link-title: transform ×2 | made with: transition · :hover

```css
.menu { position: relative; box-shadow: 0 10px 25px 0 rgba(0, 0, 0, 0.075) }
.link { position: relative; transition: width 0.2s ease-in }
.link:before { position: absolute; top: 0; transform: translateX(100%); transition: transform 0.2s ease-in }
.link:hover:before, .link:hover .link-title, .link:focus:before, .link:focus .li { transform: translateX(0); opacity: 1 }
.link-icon { position: absolute }
.link-title { transform: translateX(100%); transition: transform 0.2s ease-in }
```

### [Parlor Bubble](https://codepen.io/jonahstuart/pen/zMybKb)

on scroll: svg.[object: transform+top, path.[object: transform+top, path.[object: transform+opacity+top, div.parlor-button-wrapper: transform+top, div.parlor-button: shadow+top | made with: @keyframes · transition · :hover

```css
5% { transform: scale(1) }
13% { transform: scale(1.5) }
16% { transform: scale(0.6) }
20% { transform: scale(1) }
5% { transform: scale(1) }
13% { transform: scale(1.5) }
16% { transform: scale(0.6) }
20% { transform: scale(1) }
0% { transform: rotate(0deg) }
2% { transform: rotate(-20deg) }
12% { transform: rotate(10deg) }
14% { transform: rotate(-10deg) }
```

### [Badges with Tailwind CSS](https://codepen.io/lynnecodes/pen/NWjGPNL)

made with: nothing recognised — read the code

### [ReactJs Filter gallery](https://codepen.io/OlgaKoplik/pen/dybvEMv)

held: fixed i.fab | made with: position: fixed · @keyframes · transition · :hover

```css
body:before { position: absolute; top: -120px; -webkit-animation: transform 50s ease-in-out infinite both alternate, movement 40s ease-in-out infinite both; animation: transform 50s ease-in-out infinite both alternate, movement 40s ea }
body:after { position: absolute; bottom: -120px; -webkit-animation: transform 50s ease-in-out infinite both alternate, movement 40s ease-in-out infinite both; animation: transform 50s ease-in-out infinite both alternate, movement 40s }
label { transition: .3s }
input:checked~label { box-shadow: 5px 2px 15px #a8b4fc80 }
figure { -webkit-animation: show .8s ease; animation: show .8s ease }
0% { opacity: 0 }
100% { opacity: 1 }
0% { opacity: 0 }
100% { opacity: 1 }
img { box-shadow: 0 10px 15px #a8b4fc30 }
figcaption { margin-top: 20px }
figure figcaption { position: relative }
```

### [New JS Progress bar - JS jobs added (Demo by yurikoh@)](https://codepen.io/web-dot-dev/pen/ZENzLZd)

held: fixed div.warning, fixed div.progress-container, fixed div, fixed div.js-container | on scroll: div.: transform | made with: position: sticky · position: fixed · view() timeline · scroll() timeline · Web Animations API (.animate)

```css
#start-button { position: relative }
#stop-button { position: relative }
.header { position: fixed; top: 0 }
.title { margin-top: 100px }
.title h1 { padding-top: 1% }
.js-container { position: fixed }
.js-container { position: sticky; top: 110px }
.js-container { top: 120px }
#progress { position: fixed }
.progress-container { top: 0; position: fixed }
.status { position: block }
.warning { position: fixed; bottom: 1em }
```

```js
.animate( {
```

### [Untitled](https://codepen.io/sol0mka/pen/841a1d6e68f73f7c10ac9c3385ec7d17)

made with: nothing recognised — read the code

### [Animation Range - Zombie Vehicles - Start/End](https://codepen.io/anon/pen/KwzXKrX)

held: fixed div.timeline | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes

```css
.car { position: absolute; top: calc(100vh + 50px); animation: speed forwards; transform-origin: right top; animation-timeline: view(); animation-range: cover }
.limo { position: absolute; top: calc(100vh + 300px); animation: speed forwards; transform-origin: right top; animation-timeline: view(); animation-range: cover }
.bus { position: absolute; top: calc(100vh + 550px); animation: speed forwards; transform-origin: right top; animation-timeline: view(); animation-range: cover }
from { translate: 0 }
to { translate: 100vw }
.ground { transform: translateX(-50%); position: absolute; top: calc(100vh + 100px) }
.timeline { position: fixed; top: 0 }
.timeline div:first-child { margin-bottom: 0.5em }
@keyframes speed animates translate
```

### [CSS TABS](https://codepen.io/Ramnk7/pen/yWBWEe)

made with: transition · :hover

```css
body { transition: all 1s }
.container { box-shadow: 0px 2px 4px black }
.wrapper { position: relative; box-shadow: 3px 2px 3px rgba(0, 0, 0, 0.459) }
nav { position: absolute; top: 87%; border-top: 1px solid gainsboro }
nav::after { position: absolute; top: 36%; transform: translate(-50%, -50%) }
.link { transition: all 0.3s }
.tabone { transform: scale(1.1); border-bottom: 1px solid black }
.line { margin-top:5px }
```

### [Neomorphic Form](https://codepen.io/swapnet/pen/QWwPVwE)

on scroll: button.unit: shadow | on hover of button.red: button.red: shadow, button.unit: shadow | made with: transition · :hover

```css
label { margin-bottom: 24px }
input { box-shadow: inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF; transition: all 0.2s ease-in-out }
input:focus { box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF }
button { box-shadow: -5px -5px 20px #FFF, 5px 5px 20px #BABECC; transition: all 0.2s ease-in-out }
button:hover { box-shadow: -2px -2px 5px #FFF, 2px 2px 5px #BABECC }
button:active { box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF }
```

### [Collapsing Accordion Pure CSS](https://codepen.io/JeremyWink/pen/PoYdrLV)

made with: transition

```css
.collapse-content { box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75) }
.collapse a { position: relative }
.collapse a:before { border-top: 7px solid #fff; position: absolute; top: 25px }
.content { transition: 0.3s linear 0s }
.collapse + .collapse a { border-top: 1px solid rgba(255, 255, 255, 0.7) }
h3 { margin-bottom: 15px }
.collapse:target a:before { transform: rotate(-90deg) }
.collapse-content { box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75) }
.inner-content h3 { margin-bottom: 0.3rem }
.inner-content h3 { margin-bottom: 0.3rem }
```

### [Push Button](https://codepen.io/Petr-Knoll/pen/qEBWjRV)

on scroll: div.button-outer: shadow, div.button-inner: clip-path+shadow, span.: transform+top | made with: transition · :hover · clip-path · mix-blend-mode

```css
button { position: relative; box-shadow: -0.15em -0.15em 0.15em -0.075em rgba(5, 5, 5, 0.25), 0.0375em 0.0375em 0.0675em 0 rgba(5, 5, 5, 0.1) }
button::after { position: absolute; top: -0.15em; filter: blur(0.0125em); opacity: 0.25; mix-blend-mode: multiply }
button .button-outer { position: relative; transition: box-shadow 300ms ease; will-change: box-shadow; box-shadow: 0 0.05em 0.05em -0.01em rgba(5, 5, 5, 1), 0 0.01em 0.01em -0.01em rgba(5, 5, 5, 0.5), 0.15em 0.3em 0.1em -0.01em rgba(5, 5, 5, 0 }
button:hover .button-outer { box-shadow: 0 0 0 0 rgba(5, 5, 5, 1), 0 0 0 0 rgba(5, 5, 5, 0.5), 0 0 0 0 rgba(5, 5, 5, 0.25) }
.button-inner { --inset: 0.035em; position: relative; transition: box-shadow 300ms ease, clip-path 250ms ease, background-image 250ms ease, transform 250ms ease; will-change: box-shadow, clip-path, background-image, transform; clip-path }
button:hover .button-inner { clip-path: inset(clamp(1px, 0.0625em, 2px) clamp(1px, 0.0625em, 2px) clamp(1px, 0.0625em, 2px) clamp(1px, 0.0625em, 2px) round 999vw); box-shadow: 0.1em 0.15em 0.05em 0 inset rgba(5, 5, 5, 0.75), -0.025em -0.03em 0.05em  }
button .button-inner span { position: relative; transition: transform 250ms ease; will-change: transform }
button:hover .button-inner span { transform: scale(0.975) }
button:active .button-inner { transform: scale(0.975) }
```

### [3D Glass Switch (Pure CSS, Neumorphic, Animation)](https://codepen.io/konstantindenerz/pen/KKxeWKj)

held: fixed a.labs-follow-me-twitter | on hover of a.labs-follow-me-twitter: a.labs-follow-me-twitter: background | made with: @keyframes · mask · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d)

```css
.surface { position: absolute; inset: 0 }
.bg { position: absolute; inset: 0vmin; box-shadow: 10px 10px 25px 10px var(--dark), -10px -10px 25px 10px var(--light); filter: blur(0.8vmin) }
.bg:before { position: absolute; bottom: -1px; box-shadow: 4px 4px 7px rgba(0, 0, 0, 0.6); top: 3vmin }
.bg:after { position: absolute; inset: 1.2vmin }
.outer-shadow { position: absolute; inset: 0 }
.outer-shadow:before { position: absolute; top: 1vmin; bottom: 1vmin; filter: blur(0.3vmin) }
.outer-shadow:after { position: absolute; top: 1vmin; bottom: 1vmin; border-top: 0.5vmin solid rgba(0, 0, 0, 0.5); border-bottom: 3vmin solid var(--light); filter: blur(0.3vmin) }
.inner-shadow { position: absolute; inset: calc(2.5vmin * var(--ratio)); box-shadow: 0 0 1vmin calc(0.2vmin * var(--ratio)) rgba(0, 0, 0, 0.2), 0 0 1.5vmin calc(0.1vmin * var(--ratio)) rgba(0, 0, 0, 0.2), 0 0 1.8vmin calc(0.3vmin * var( }
.active-light { position: absolute; inset: 1.5vmin; filter: blur(2vmin) brightness(100%); mix-blend-mode: darken; opacity: 0.9 }
.inner-surface { position: absolute; inset: calc(2vmin * var(--ratio)) }
.dark-shadow, .light-shadow { position: absolute; inset: 0; perspective: 50vmin }
.dark-shadow:before, .dark-shadow:after, .light-shadow:before, .light-shadow:aft { position: absolute; top: 0; bottom: 0; filter: blur(calc(0.4vmin * var(--ratio))); mix-blend-mode: darken }
```

### [Superheroes At A Construction Site - animation-range](https://codepen.io/anon/pen/pvyPKNN)

held: fixed div.timeline | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · :has()

```css
.ground { transform: translateX(-50%); position: absolute; top: 3900px }
.timeline { position: fixed; top: 0 }
.timeline div:first-child { margin-bottom: 0.5em }
#mrinvisible { position: absolute; top: 1228px }
#mrinvisible #above, #mrinvisible #below { animation: fadeout; animation-timeline: view(); animation-range: normal }
0%, 40% { opacity: 1 }
70%, 100% { opacity: 0 }
.placeholder:has(#gg) { position: absolute; top: 1742px }
#gg { scale: 0.1; animation: grow; animation-timeline: view(); animation-range: normal }
from { scale: 0.1 }
to { scale: 2 }
#viking { position: absolute; top: 2166px }
```

### [To-do list v2 - jumping & bouncing animation - completed](https://codepen.io/smashingmag/pen/BabaBKz)

made with: position: fixed · view transitions · @keyframes · :hover · prefers-reduced-motion

```css
::view-transition-group(*) { animation-timing-function: ease-in-out; animation-delay: 0.1s; animation-duration: 0.2s }
::view-transition-old(root), ::view-transition-new(root) { animation-delay: 0.2s; animation-duration: 0s }
::view-transition-group(card-active) { animation-duration: 0.4s; animation-delay: 0s }
::view-transition-image-pair(card-active) { animation: popIn 0.5s cubic-bezier(0.7, 2.2, 0.5, 2.2) }
0% { transform: scale(1) }
40% { transform: scale(1.2) }
50% { transform: scale(1.2) }
100% { transform: scale(1) }
.banner { position: fixed; bottom: 0 }
h1 { margin-bottom: 3rem }
h2 { margin-bottom: 1rem }
.col { box-shadow: 0 5px 10px 0 #aaa }
```

```js
startViewTransition(() => {
```

### [Daily UI#011 | Flash Message (Error/Success)](https://codepen.io/juliepark/pen/vjMOKQ)

on scroll: div.face: transform+top, div.shadow: transform, div.face2: transform+top | on hover of button.button-box: div.face: transform+top, div.shadow: transform, button.button-box: transform+background+top, div.face2: transform+top | made with: @keyframes · transition · :hover · 3D (perspective / preserve-3d)

```css
body { text-transform: uppercase }
#container { position: relative }
h1 { padding-top: 5px; padding-bottom: 5px; text-transform: uppercase }
p { margin-top: -5px }
#success-box { position: absolute; box-shadow: 5px 5px 20px rgba(203, 205, 211, 0.1); perspective: 40px }
#error-box { position: absolute; box-shadow: 5px 5px 20px rgba(203, 205, 211, 0.1) }
.dot { position: absolute; top: 4% }
.two { opacity: 0.5 }
.face { position: absolute; top: 21%; animation: bounce 1s ease-in infinite }
.face2 { position: absolute; top: 21%; animation: roll 3s ease-in-out infinite }
.eye { position: absolute; top: 40% }
.mouth { position: absolute; top: 43% }
```

### [`corner-shape` on radio `input`s (chrome only?)](https://codepen.io/mandynicole/pen/bNeBRqE)

made with: :hover · :focus-visible · :has() · prefers-reduced-motion

```css
legend { top: -.5ex; position: relative; padding-top: .84ex }
&:is(:focus-visible), &:has(:focus-within) { outline-offset: -4px }
html, body, fieldset, label, input { transition-property: background, border-color, box-shadow, color, filter, rotate }
&:focus-within, &:focus, &:hover, &:focus-visible { transition-property: background, border-color, rotate }
```

### [Bi-directional scroll with scroll-triggered animations and scrolled state query](https://codepen.io/una/pen/KwzEzLG)

held: fixed div.indicator | on scroll: div.card: transform+opacity+top ×8, div.card: transform+top | on hover of div.card: div.card: transform+opacity+top ×8 | made with: position: fixed · view() timeline · @keyframes · transition · container queries

```css
.indicator { position: fixed; top: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: all 0.3s ease }
from { opacity: 0; transform: translateY(50px) }
to { opacity: 1; transform: translateY(0) }
from { opacity: 0; transform: translateY(-50px) }
to { opacity: 1; transform: translateY(0) }
.card { animation: slide-up 0.6s ease-out forwards; animation-trigger: --reveal play-forwards play-backwards }
.card { animation-name: slide-down }
@keyframes slide-up animates opacity, transform
@keyframes slide-down animates opacity, transform
```

### [Animated and Accessible Tabs with Tailwind CSS and Alpine.js](https://codepen.io/cruip/pen/gOZgMMd)

held: fixed div.fixed | made with: transition

### [Circular Progress Bar - Using HTML & CSS , JS](https://codepen.io/mazdevelop100/pen/qBZWRGr)

made with: nothing recognised — read the code

```css
.wrapper { position: absolute; top: 0; bottom: 0 }
```

### [Simple timeline with different enter and exit animations](https://codepen.io/GreenSock/pen/vEBbdKq)

on scroll: button.: color, div.tooltip: transform+opacity+top | made with: GSAP

```css
.container { position: relative }
.tooltip { position: absolute; top: 50%; transform: translateY(-50%); opacity: 0 }
.tooltip::after { position: absolute; top: 50%; transform: translateY(-50%) }
```

```js
gsap.timeline({ paused: true })
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
```

### [Basic "Add" View Transition](https://codepen.io/editor/anon/pen/019ed79c-71fa-718c-8f42-d24872c3dfc2)

made with: view transitions

### [Soft-body Marbles](https://codepen.io/zhaqyy/pen/xbKXzOK)

on scroll: div.circle: transform | made with: GSAP

```js
gsap.registerPlugin(MorphSVGPlugin)
gsap.to(e.target, {
gsap.to(svg, {
gsap.to(circle, {
```

### [Scroll Snap - Full Height Sections](https://codepen.io/shadeed/pen/oNzLMZj)

made with: scroll-snap

```css
main { -ms-scroll-snap-type: y mandatory; scroll-snap-type: y mandatory }
.section { scroll-snap-align: start }
```

### [Updating the radial-gradient size and position](https://codepen.io/smashingmag/pen/YzRgZvj)

made with: mask

```css
img { -webkit-mask: linear-gradient(#000 0 0), radial-gradient(#000 70%,#0000 71%) content-box center/50% 50% no-repeat; -webkit-mask-composite: xor; mask-composite: exclude }
```

### [GDPR badges](https://codepen.io/kingjohnny/pen/gKavmV)

made with: transition

```css
.badge { margin-bottom: 1.5rem; box-shadow: 0px 0px 60px var(--color-shade) }
.badge-text { text-transform: uppercase }
.lock { top: 50%; transform: translate(-50%,-50%); position: relative; transition: all 0.1s ease-in-out }
.lock:after { position: absolute; top: 50%; transform: translate(-50% , -50%); transition: all 0.1s ease-in-out }
.lock:before { position: absolute; bottom: 100%; transform: translateX(-50%); border-bottom: 0 }
```

### [Styling <details>: inline display](https://codepen.io/web-dot-dev/pen/jOgpZMY)

made with: nothing recognised — read the code

```css
main { padding-bottom: 10rem }
p { margin-bottom: 1em }
#demo ~ p { margin-top: 1em }
```

### [Bootstrap Checkbox Custom](https://codepen.io/iazzetta/pen/grZgdK)

on hover of div.btn-group: label.btn: background | made with: nothing recognised — read the code

### [Scroll-Linked Animations: Horizontal scroll section (WAAPI + ScrollTimeline 2021 version)](https://codepen.io/bramus/pen/jOVWpyr)

held: sticky div.pin-wrap, fixed div.warning, fixed dialog.sda_update | on scroll: div.pin-wrap: transform+top | made with: position: sticky · position: fixed · view() timeline · scroll() timeline · transition

```css
body { transition: 0.3s ease-out }
section { position: relative }
h1 { margin-bottom: 1rem; position: absolute; top: 10vw }
p { position: absolute; bottom: 10vw }
.warning { position: fixed; top: 1em }
```

### [Daily UI #6 - Profile](https://codepen.io/genarocolusso/pen/xONEXg)

made with: @keyframes

```css
.content { position: relative; animation: animatop 0.9s cubic-bezier(0.425, 1.14, 0.47, 1.125) forwards }
.card { box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2); position: relative }
.card:after { position: absolute; animation: rotatemagic 0.75s cubic-bezier(0.425, 1.04, 0.47, 1.105) 1s both }
.badgescard { box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2); position: absolute; bottom: 10px; animation: animainfos 0.5s cubic-bezier(0.425, 1.04, 0.47, 1.105) 0.75s forwards }
.badgescard span { opacity: 0.6 }
.firstinfo { position: relative }
0% { opacity: 0; bottom: -500px }
100% { opacity: 1; bottom: 0px }
0% { bottom: 10px }
100% { bottom: -42px }
0% { opacity: 0; transform: rotate(0deg); top: -24px }
100% { transform: rotate(-30deg); top: -24px }
```

### [Styled <progress/> 🎅](https://codepen.io/jh3y/pen/JjRbjow)

made with: transition

```css
progress { transition: all 0.1s }
progress::-moz-progress-bar { box-shadow: var(--shadow); -moz-transition: all 0.1s ease; transition: all 0.1s ease }
progress:not([value])::-moz-progress-bar { box-shadow: none }
progress::-webkit-progress-value { -webkit-transition: all 0.1s; transition: all 0.1s; box-shadow: var(--shadow) }
```

### [Vertical color-adapting CSS menu](https://codepen.io/ines/pen/LGKPqY)

held: fixed button.nav-icon, fixed ul | made with: position: fixed · transition · mix-blend-mode

```css
p { margin-bottom: 2.5em }
h2 { text-transform: uppercase; margin-bottom: 2em }
nav { mix-blend-mode: difference }
nav ul { position: fixed; top: 60px }
nav ul li { text-transform: uppercase }
.nav-icon { position: fixed; top: 15px; transition: background 0.3s }
.nav-icon span { position: absolute; top: 15px; transition: transform 0.3s }
.nav-icon span:before, .nav-icon span:after { position: absolute }
.nav-icon span:before { top: -8px }
.nav-icon span:after { bottom: -8px }
.active .nav-icon span { transform: rotate(90deg) }
```

### [Formulir Whatsapp Pada Modal Bootstrap 5.0](https://codepen.io/bRionZ/pen/QWvGoRW)

held: fixed div.modal | on hover of button.btn: button.btn: background+color | made with: nothing recognised — read the code

### [Html CSS Tutorial- CSS Fixed Background Scrolling Effect](https://codepen.io/joanne-codepage/pen/drWoee)

made with: nothing recognised — read the code

```css
section { border-top: 1.5px solid #262626 }
```

### [Circuit Board Loader Animation](https://codepen.io/cssparadise/pen/YPWOpbq)

made with: @keyframes

```css
.trace-flow { filter: drop-shadow(0 0 6px currentColor); animation: flow 3s cubic-bezier(0.5, 0, 0.9, 1) infinite }
.chip-pin { filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.6)) }
@keyframes flow animates stroke-dashoffset
```

### [Transitioned CSS Filter Card Fan](https://codepen.io/dudleystorey/pen/kVJRXz)

on hover of div.cardfan: img.: transform+top, img.: transform+filter+top | made with: transition · :hover

```css
div.cardfan { position: relative }
div.cardfan img { position: absolute; box-shadow: 4px 4px 3px rgba(0, 0, 0, 0.2); transition: all 1s linear }
div.cardfan img:first-child { transform: rotate(5deg) }
div.cardfan img:last-child { transform: rotate(-5deg) }
div.cardfan:hover img:first-child { transform: rotate(25deg) }
div.cardfan:hover img:last-child { transform: rotate(-25deg) }
img#aqueduct { -webkit-filter: grayscale(100%); filter: grayscale(100%); filter: url(#greyscale); filter: gray }
img#aqueduct:hover { -webkit-filter: grayscale(0); filter: grayscale(0); filter: none }
img#bike { -webkit-filter: sepia(100%); filter: sepia(100%); filter: url(#sepia); filter: alpha(opacity = 50) }
img#bike:hover { -webkit-filter: sepia(0); filter: sepia(0); filter: alpha(opacity = 100); filter: none }
img#roma { -webkit-filter: blur(3px); filter: blur(3px); filter: url(#blur) }
img#roma:hover { -webkit-filter: blur(0px); filter: blur(0px); filter: none }
```

### [CSS-only Sliding Panels using transforms](https://codepen.io/shshaw/pen/akXzzE)

held: fixed a.shaw | on hover of a.panel: a.panel: transform ×2, div.panel__content: transform ×2, h3.panel__title: color | made with: transition · :hover

```css
.panel { position: relative }
.panel__content:before { position: absolute; top: 0; bottom: 0; opacity: 0.5; transition: opacity 1s cubic-bezier(0.6, 0, 0.2, 1) }
.panel__title { position: relative; transition: color 1s cubic-bezier(0.6, 0, 0.2, 1) }
.panel__title:before { position: absolute; top: 0; bottom: 0; opacity: 0; transform: scale(0.9); transition: all 1s cubic-bezier(0.6, 0, 0.2, 1); transition-property: opacity, transform }
.panel { transform: translate3d(0, 0, 0); transition: transform 1s cubic-bezier(0.6, 0, 0.2, 1) }
.panel .panel__content { transform: translateX(10%); transition: transform 1s cubic-bezier(0.6, 0, 0.2, 1) }
.panel:last-child .panel__content { transform: translateX(-10%) }
.panels:hover .panel { transform: translate3d(-10%, 0, 0) }
.panels:hover .panel .panel__content { transform: translateX(14%) }
.panels:hover .panel .panel__content:before { opacity: 0.7 }
.panels .panel:hover ~ .panel { transform: translate3d(10%, 0, 0) }
.panels .panel:hover ~ .panel .panel__content { transform: translateX(-14%) }
```

### [Pure CSS star rating](https://codepen.io/lthao/pen/eYQdWQX)

on scroll: i.fa-solid: transform+top ×2 | made with: @keyframes · transition · :hover · :has()

```css
.star-rating i { transition: 0.3s }
.star-rating label:is(:hover, :has(~ :hover)) i { transform: scale(1.35); animation: jump 0.5s calc(0.3s + (var(--i) - 1) * 0.15s) alternate infinite }
0%, 50% { transform: translatey(0) scale(1.35) }
100% { transform: translatey(-15%) scale(1.35) }
@keyframes jump animates transform
```

### [3D parallax effect on hover](https://codepen.io/t_afif/pen/qBJyXNy)

on scroll: img.: transform+clip-path | on hover of img.: img.: transform+clip-path ×2 | made with: transition · :hover · clip-path · 3D (perspective / preserve-3d)

```css
img { clip-path: inset(0 var(--_f) 0 0 round var(--r)); transform: perspective(400px) var(--_t,rotateY(var(--_a))); transition: .5s }
img:hover { clip-path: inset(0 0 0 var(--_f) round var(--r)) }
```

### [CSS Cube Login Form](https://codepen.io/marko-zub/pen/mzPeOV)

held: fixed div.credits | made with: position: fixed · transition · :hover · (hover: hover) gate

```css
.block-cube { position: relative }
.block-cube .bg-top { position: absolute; bottom: 100%; transform: skew(-45deg, 0) }
.block-cube .bg-top .bg-inner { bottom: 0 }
.block-cube .bg { position: absolute; top: 0; bottom: 0 }
.block-cube .bg-right { position: absolute; top: -5px; bottom: 5px; transform: skew(0, -45deg) }
.block-cube .bg .bg-inner { transition: all 0.2s ease-in-out }
.block-cube .bg-inner { position: absolute; top: 2px; bottom: 2px }
.block-cube .text { position: relative }
.block-cube.block-input input { position: relative }
.block-cube.block-input input:focus ~ .bg-right .bg-inner, .block-cube.block-inp { top: 100% }
.block-cube.block-input .bg-top, .block-cube.block-input .bg-right, .block-cube. { transition: background 0.2s ease-in-out }
.block-cube.block-input .bg-right .bg-inner, .block-cube.block-input .bg-top .bg { transition: all 0.2s ease-in-out }
```

### [Order button animation](https://codepen.io/aaroniker/pen/oNgPOwo)

held: fixed a.dribbble, fixed a.twitter | made with: position: fixed · transition · clip-path · 3D (perspective / preserve-3d) · GSAP

```css
.truck-button { --box-shadow: #B89B66; position: relative; transform: rotateX(var(--rx, 0deg)) translateZ(0); transition: transform 0.5s, border-radius 0.3s linear var(--br-d, 0s) }
.truck-button:before, .truck-button:after { position: absolute; top: 0; transform: rotateX(90deg) scaleX(var(--sy, 1)) }
.truck-button .default, .truck-button .success { opacity: var(--o, 1); transition: opacity 0.3s }
.truck-button .success { position: absolute; top: 12px }
.truck-button .success svg { vertical-align: top; transition: stroke-dashoffset 0.4s ease 0.45s }
.truck-button .truck { position: absolute; transform: rotateX(90deg) translate3d(var(--truck-x, 4px), calc(var(--truck-y-n, -26) * 1px), 12px) }
.truck-button .truck:before, .truck-button .truck:after { position: absolute; bottom: -6px; box-shadow: inset 0 0 0 2px var(--wheel), inset 0 0 0 4px var(--wheel-inner); transform: translateY(calc(var(--truck-y) * -1px)) translateZ(0) }
.truck-button .truck .wheel, .truck-button .truck .wheel:before { position: absolute; bottom: var(--b, -6px); transform: translateZ(0) }
.truck-button .truck .wheel { transform: translateY(calc(var(--truck-y) * -1px)) translateZ(0) }
.truck-button .truck .front, .truck-button .truck .back, .truck-button .truck .b { position: absolute }
.truck-button .truck .back { bottom: 0 }
.truck-button .truck .back:before, .truck-button .truck .back:after { position: absolute }
```

```js
gsap.to(button, {
gsap.to(box, {
gsap.timeline({
```

### [React CSS Transition Carousel](https://codepen.io/jjmartucci/pen/avqPBW)

made with: transition

```css
.carousel__prev, .carousel__next { position: absolute; top: 50%; margin-top: -30px }
.carousel__slide div { position: absolute; top: 0 }
.translate-enter { transform: translateX(100vw) }
.translate-enter.translate-enter-active { transform: translateX(0); transition: all 500ms ease-in-out }
.translate-leave { transform: translateX(0) }
.translate-leave.translate-leave-active { transform: translateX(-100vw); transition: all 500ms ease-in-out }
.scale-appear, .blur-appear, .rotate-appear, .translate-appear { filter: grayscale(100%); transition: all 1000ms ease-in-out }
.scale-appear.scale-appear-active, .blur-appear.blur-appear-active, .rotate-appe { filter: grayscale(0) }
.scale-enter { transform: scale(1) }
.scale-enter.scale-enter-active { transform: scale(1); transition: all 500ms ease-in-out }
.scale-leave { transform: scale(1); opacity: 1 }
.scale-leave.scale-leave-active { transform: scale(1.2); opacity: 0.01; transition: all 500ms ease-in-out }
```

### [Infinity Loader](https://codepen.io/aaroniker/pen/MzoXaZ)

held: fixed a.dribbble | on scroll: div.: background+top ×3 | on hover of a.dribbble: div.: background+top ×3 | made with: position: fixed · @keyframes

```css
.infinity { position: relative }
.infinity div, .infinity span { position: absolute }
.infinity div { top: 0; -webkit-animation: rotate 6.9s linear infinite; animation: rotate 6.9s linear infinite }
.infinity div span { top: 50%; box-shadow: 2px 2px 8px rgba(140, 111, 240, 0.09); transform: rotate(90deg); -webkit-animation: move 6.9s linear infinite; animation: move 6.9s linear infinite }
.infinity div span:before, .infinity div span:after { position: absolute; top: 50%; box-shadow: inherit }
.infinity div span:before { -webkit-animation: drop1 0.8s linear infinite; animation: drop1 0.8s linear infinite }
.infinity div span:after { -webkit-animation: drop2 0.8s linear infinite 0.4s; animation: drop2 0.8s linear infinite 0.4s }
.infinity div:nth-child(2) { -webkit-animation-delay: -2.3s; animation-delay: -2.3s }
.infinity div:nth-child(2) span { -webkit-animation-delay: -2.3s; animation-delay: -2.3s }
.infinity div:nth-child(3) { -webkit-animation-delay: -4.6s; animation-delay: -4.6s }
.infinity div:nth-child(3) span { -webkit-animation-delay: -4.6s; animation-delay: -4.6s }
.infinityChrome div { position: absolute; box-shadow: 2px 2px 8px rgba(140, 111, 240, 0.09); -webkit-animation: moveSvg 6.9s linear infinite; animation: moveSvg 6.9s linear infinite; filter: url(#goo); transform: scaleX(-1); offset-path: path }
```

### [Animated Ghost Button](https://codepen.io/numerical/pen/XJKeop)

made with: transition · :hover · mask

```css
:root { --bg-mask: rgba(255, 255, 255, 0.5); --bg-mask-hover: rgba(255, 255, 255, 1.0) }
body { transition: background-color 2s var(--transition-easing) }
.button { position: relative; text-transform: uppercase; transition: background-color 0.3s var(--transition-easing), border 1s var(--transition-easing), color 0.6s var(--transition-easing) }
.button a { position: relative }
.button .mask { position: absolute; transform: translate3d(-120%, -3.125rem, 0) rotate3d(0, 0, 1, 45deg); transition: all 1.1s var(--transition-easing) }
.button .shift { transition: all 1.1s var(--transition-easing); vertical-align: text-top }
.button:hover { box-shadow: var(--shadow-button-hover) }
.button:hover .mask { transform: translate3d(120%, -6.25rem, 0) rotate3d(0, 0, 1, 90deg) }
.button:hover .shift { transform: translateX(0.3125rem) }
```

```js
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [1 range input fancy slider bars](https://codepen.io/thebabydino/pen/QWQQqmP)

held: fixed a | on scroll: input.: filter | on hover of a.: input.: filter, a.: filter | made with: :hover · clip-path · mask · custom properties driven by JS

```css
[type=range] { box-shadow: 0 0.375em 0.75em #b0b0b0, -0.375em 0.75em 1px rgba(255, 255, 255, 0.1), inset 0 -1px 1px #b9b9b9, inset 0 -3px #e4e4e4; filter: sepia(calc(1 - var(--sel, 0))) }
[type=range] { box-shadow: none }
[type=range]::-moz-range-track { box-shadow: 0 0.375em 0.75em #b0b0b0, -0.375em 0.75em 1px rgba(255, 255, 255, 0.1), inset 0 -1px 1px #b9b9b9, inset 0 -3px #e4e4e4 }
[type=range]::-webkit-slider-thumb { transform: var(--thumb-t); box-shadow: var(--thumb-s); clip-path: var(--thumb-c); filter: var(--thumb-f); mask: var(--thumb-m); mask-repeat: no-repeat; mask-composite: exclude }
[type=range]::-moz-range-thumb { transform: var(--thumb-t); box-shadow: var(--thumb-s); clip-path: var(--thumb-c); filter: var(--thumb-f); mask: var(--thumb-m); mask-repeat: no-repeat; mask-composite: exclude }
```

```js
style.setProperty('--val', +_t.value)
```

### [CSS-only Accordion with Reveal Animation](https://codepen.io/ShadowShahriar/pen/LYgeNLB)

on hover of a.: section.accordion: shadow | made with: transition · :hover · :focus-visible · clip-path · mask · mix-blend-mode · 3D (perspective / preserve-3d)

```css
:root { --animation-speed: 100 }
*, *::before, *::after { position: relative; top: 0 }
html, body { scroll-padding-top: 1rem }
main > h1 { margin-bottom: 1.25rem }
.accordion { margin-bottom: 1rem; box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1); opacity: 0.9 }
.accordion:not(:target):hover { box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.5) }
.accordion:not(:target):active { opacity: 1; box-shadow: 0 4px 7px 0 rgba(0, 0, 0, 0.3) }
.accordion:target { transition: grid-template-rows var(--slide-ease) var(--slide-duration) var(--slide-delay) }
.content p { margin-bottom: 1rem }
main :last-child, .content :last-child { margin-bottom: 0 }
.title a::before { top: 0; transform: rotate(var(--d, 0deg)); transition: transform var(--slide-ease) var(--slide-duration) var(--slide-delay); mask-image: var(--chevron-icon); mask-size: 100% 100%; -webkit-mask-image: var(--chevron-icon); }
.accordion::before, .accordion::after { position: absolute; mix-blend-mode: difference; clip-path: circle(var(--r) at var(--circle-x) var(--circle-y)) }
```

### [Radio Button Dot-Slider (Pure CSS)](https://codepen.io/brandonmcconnell/pen/Zqjdmg)

made with: @keyframes · transition · :hover

```css
form #form-title { margin-top: 0 }
form #debt-amount-slider { position: relative }
form #debt-amount-slider::before { position: absolute; top: 50%; transform: translate(-50%, -50%) }
form #debt-amount-slider label { position: relative }
form #debt-amount-slider label::before { position: absolute; padding-top: 10px; transform: translate(-50%, 45px); opacity: 0.85; transition: all 0.15s ease-in-out }
form #debt-amount-slider label::after { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: all 0.15s ease-in-out }
form #debt-amount-slider label:hover::after { transform: translate(-50%, -50%) scale(1.25) }
form #debt-amount-slider input:checked + label::before { opacity: 1 }
form #debt-amount-slider input:checked + label::after { transform: translate(-50%, -50%) scale(0.75) }
form #debt-amount-slider input:checked ~ #debt-amount-pos { opacity: 1 }
form #debt-amount-slider #debt-amount-pos { position: absolute; top: 50%; transition: all 0.15s ease-in-out; transform: translate(-50%, -50%); opacity: 0 }
form:valid #debt-amount-slider input + label::before { transform: translate(-50%, 45px) scale(0.9); transition: all 0.15s linear }
```

### [hamburger menu](https://codepen.io/nissacjg/pen/VdQwvX)

made with: transition

```css
#menuToggle { position: absolute }
#menuToggle input { position: absolute; opacity: 0 }
#menuToggle span { margin-bottom: 10px; -webkit-transition: all .5s cubic-bezier(.08,.81,.87,.71); -moz-transition: all .5s cubic-bezier(.08,.81,.87,.71); -ms-transition: all .5s cubic-bezier(.08,.81,.87,.71); -o-transition: all .5s cubic- }
#menuToggle input:checked ~ #span1 { transform: rotate(45deg) translate(8px) }
#menuToggle input:checked ~ #span2 { transform: rotate(495deg) translate(4px) }
#menuToggle input:checked ~ #span3 { transform: rotate(45deg); opacity: 0 }
```

### [404 on CodePen](https://codepen.io/anon/pen/836b16ccb95203c93563c9429f42ef49)

made with: position: fixed · @keyframes

```css
from { transform: scaleX(0) }
to { transform: scaleX(1) }
.progressbar { transform: scaleX(0); position: fixed; top: 0; animation: my-animation 2.5s linear forwards infinite }
@keyframes my-animation animates background-color, transform
```

### [GSAP Helper Function: horizontalLoop() (full frame example)](https://codepen.io/creativeocean/pen/YPzJoNo)

made with: scroll-snap · :hover · GSAP

```css
.carousel { scroll-snap-type: x mandatory }
.carousel-slide { position:relative; scroll-snap-align: center }
.carousel-img-wrapper { position:absolute; top:0 }
.carousel-nav { position:absolute }
.carousel-nav button { position:absolute; top:50% }
.prev { transform:translateY(-50%) rotate(-90deg) }
.next { transform:translateY(-50%) rotate(90deg) }
.carousel-progress { position: absolute; bottom: 3.5vh; opacity: 0.36 }
::-webkit-scrollbar-thumb { border-top:6px solid #000 }
```

```js
gsap.to(".carousel-progress path", {
gsap.to(e.target, { opacity: 0.4 })
gsap.to(e.target, { opacity: 1 })
gsap.timeline({repeat: config.repeat, onUpdate: onChange && function() {
```

### [Toggle Title Menu * CSS Only](https://codepen.io/TheMOZZARELLA/pen/gOePxaN)

made with: @keyframes · transition · :hover

```css
#welcomeMessage , #welcomeMessage figcaption , #welcomeMessage figcaption h1 , # { position: relative }
#welcomeMessage figcaption::before , #welcomeMessage figcaption::after { position: absolute }
#welcomeMessage figcaption h1 { text-transform: lowercase; box-shadow: rgba(0, 0, 0, 0.19) 0px 0.625em 1.25em, rgba(0, 0, 0, 0.23) 0px 0.375em 0.375em; transition: all 0.1s ease-in-out }
#welcomeMessage figcaption h1:active { transform: scale(0.93); transition: all 0.05s ease-in-out }
#welcomeMessage figcaption h1::before , #welcomeMessage figcaption h1::after { position: absolute; transition: all 0.7s ease-in-out }
#welcomeMessage figcaption h1::before { top: -4.3em; opacity: 0 }
#welcomeMessage figcaption h1::after { bottom: -3em; transition: all 0.3s ease-in-out }
#welcomeMessage figcaption h1 label { position: absolute }
#welcomeMessage figcaption h1 label:nth-child(2) { top: -3em; opacity: 0 }
#welcomeMessage figcaption h1 b a { position: absolute; top: 0; opacity: 0; transition: all 0.35s ease-in-out }
#welcomeMessage figcaption h1 b a:focus::before { position: absolute }
#welcomeMessage figcaption h1 b a:focus::after { position: absolute; -webkit-animation: spinny 5s linear infinite; animation: spinny 5s linear infinite }
```

### [CSS Circular Progress](https://codepen.io/equinusocio/pen/OJMBpdK)

held: fixed span | made with: position: fixed · mask · custom properties driven by JS

```css
.RadialProgress { position: relative }
.RadialProgress::before { position: absolute; top: 0; bottom: 0; -webkit-mask-image: radial-gradient( transparent var(--holesize), black calc(var(--holesize) + 0.5px) ); mask-image: radial-gradient( transparent var(--holesize), black calc(var(--h }
span { position: fixed; bottom: 16px }
```

```js
style.setProperty('--progress', value)
```

### [Glass Cards](https://codepen.io/RAFA3L/pen/NPKeYMo)

on scroll: div.acc-card: transform+top ×3 | on hover of div.card: div.acc-card: transform+top ×2, div.acc-card: transform | made with: @keyframes · transition · :hover · backdrop-filter

```css
&:hover { box-shadow: 0 0 0 1px #fff3, inset 200px 0px 100px -100px #000a, -4px 0 8px 2px #fff2 }
img { position: absolute; top: 32px }
&:nth-child(1) { animation: wobble 18s ease-in-out infinite }
&:nth-child(2) { animation: wobble 22s ease-in-out -6s infinite reverse }
&:nth-child(3) { animation: wobble 26s ease-in-out -18s infinite }
&::before, &::after { position: absolute; top: 0; bottom: 0; filter: blur(3px); scale: 1.01 }
&::after { filter: blur(8px) }
&.sm { top: 142px; bottom: 0; animation: rotate360 18s linear -10s infinite }
.top-light { position: absolute; top: -42px; box-shadow: 0 0px 1px 1px #ffc78e, 0 1px 2px 1px #ff942977, 0 2px 6px 1px #e98b2d77, 0 4px 12px 0px #ff9e3d99, 0 12px 20px 12px #ff800044 }
to { rotate: 360deg }
0% { transform: translateX(10px) translateY(20px) rotate(-3deg) scale(1) }
20% { transform: translateX(-44px) translateY(-8px) rotate(6deg) scale(1.02) }
```

### [click css](https://codepen.io/evanscode/pen/KqWRyg)

on scroll: button.: transform+shadow+top | made with: transition · :hover

```css
button { box-shadow: 0px 5px 10px #0057ab; transition: all 0.3s; border-bottom: 4px solid #d9d9d9 }
button:hover { box-shadow: 0px 15px 25px -5px #0057ab; transform: scale(1.03) }
button:active { box-shadow: 0px 4px 8px #0065c8; transform: scale(0.98) }
```

### [Multi-layered Parallax Illustration](https://codepen.io/zabielski/pen/MyoBaY)

held: fixed div.layer-bg, fixed div.layer-1, fixed div.layer-2, fixed div.layer-3, fixed div.layer-overlay, fixed div.layer-4 | on scroll: div.layer-bg: transform+top, div.layer-1: transform+top, div.layer-2: transform+top, div.layer-3: transform+top, div.layer-overlay: transform+top, div.layer-4: transform+top | made with: position: fixed · :hover · scroll listener

```css
#hero { position: relative }
.layer { background-position: bottom center; position: fixed }
h1 { margin-bottom: 30px }
.layer-1 { background-position: left bottom }
.layer-3 { background-position: right bottom }
```

```js
addEventListener('scroll', function(event) {
```

### [Holiday Feature Folding Cards Pure CSS](https://codepen.io/Maza-designDev/pen/KKdmyGb)

made with: transition · :hover · clip-path · 3D (perspective / preserve-3d)

```css
body { position: relative }
.card-front__heading { margin-top: .25rem }
.inside-page__heading { padding-bottom: 1rem }
.inside-page__heading, .card-front__text-view { margin-top: .2rem }
.card-front__text-price { margin-top: -.2rem }
.card-front__icon { margin-top: -.5rem }
.inside-page__btn { margin-top: 2rem; position: relative; transition: all .3s ease }
.inside-page__btn::before { position: absolute; top: 0; transform: scaleY(0); transition: all .3s ease }
.inside-page__btn:hover::before { transform: scaleY(1) }
.card { box-shadow: -.1rem 1.7rem 6.6rem -3.2rem rgba(0,0,0,0.5); position: relative; transition: all 1s ease }
.flip-card { perspective: 100rem; position: absolute; transition: all 1s ease }
.flip-card__container { position: absolute; transition: all 1s ease }
```

### [Circle Swap Photo Gallery React & GSAP](https://codepen.io/ste-vg/pen/WNvYWKr)

held: fixed svg.[object | on hover of button.button: button.button: transform+top | made with: transition · :hover · GSAP

```css
html, body { position: relative }
.container { position: relative }
.shadow { box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.02), 0 6.7px 5.3px rgba(0, 0, 0, 0.028), 0 12.5px 10px rgba(0, 0, 0, 0.035), 0 22.3px 17.9px rgba(0, 0, 0, 0.042), 0 41.8px 33.4px rgba(0, 0, 0, 0.05), 0 100px 80px rgba(0, 0, 0, }
#app { position: relative }
.image, .tabs { position: absolute; top: 0 }
.border { fill-opacity: 0; stroke-opacity: 0.7 }
.border:hover { stroke-opacity: 1 }
text { stroke-opacity: 0.75 }
.button { position: absolute; top: 50%; transform: translatex(50%) translatey(-50%); transition: transform 0.2s ease-in-out }
.button:hover { transform: translatex(52%) translatey(-48%) }
```

```js
gsap.registerPlugin(MotionPathPlugin)
gsap.fromTo(
gsap.timeline()
gsap.timeline({ overwrite: true })
```

### [Pure CSS bubbles float in 🍩 loader animation](https://codepen.io/thebabydino/pen/vbJzBp)

on scroll: div.⚪: transform+top ×80 | made with: @keyframes · clip-path · mask · mix-blend-mode

```css
body { filter: drop-shadow(2px 2px 5px #000) }
.🍩 { position: relative; clip-path: circle() }
.🍩:nth-of-type(2) { mask: radial-gradient(transparent 41%, red 43%) }
.⚪ { position: absolute; top: 100%; transform: translate(-50%, 0); mix-blend-mode: screen; animation: float calc(var(--tf)*2s) ease-out calc((var(--sf) - 1)*2s) infinite }
to { transform: translate(-50%, calc(-100% - 13em)) }
@keyframes float animates transform
```

### [Sound meter CSS](https://codepen.io/alvaromontoro/pen/LEYYmEr)

made with: @keyframes · prefers-reduced-motion

```css
[type="range"].volume { box-shadow: 0 -1px 1px #fff3, 0 0 2em #0003, inset 0 0 1em #0003 }
[type="range"].volume::-webkit-slider-thumb { animation: blink 0.7s infinite; box-shadow: 0 0 0.5em #fff8, 1em 0, 2em 0, 3em 0, 4em 0, 5em 0, 6em 0, 7em 0, 8em 0, 9em 0, 10em 0, 11em 0, 12em 0, 13em 0, 14em 0 , 15em 0, 16em 0, 17em 0, 18em 0, 19em 0 }
[type="range"].volume::-moz-range-thumb { animation: blink 0.7s infinite; box-shadow: 1em 0, 2em 0, 3em 0, 4em 0, 5em 0, 6em 0, 7em 0, 8em 0, 9em 0, 10em 0, 11em 0, 12em 0, 13em 0, 14em 0 , 15em 0, 16em 0, 17em 0, 18em 0, 19em 0 }
[type="range"].volume::-webkit-slider-thumb { animation: none }
[type="range"].volume::-moz-range-thumb { animation: none }
@keyframes blink animates background
```

### [Scrollbar Gutter - Demo](https://codepen.io/shadeed/pen/abwRVgN)

made with: custom properties driven by JS

```css
.box { position: relative; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1) }
.box:after { position: absolute; top: 0 }
p { margin-bottom: 1rem }
.title { margin-bottom: 1rem }
```

```js
style.setProperty("--gutter", "stable")
```

### [Message Icons GSAP](https://codepen.io/shahidshaikhs/pen/BajwRwz)

on scroll: div.dot: transform+top ×3 | on hover of a.: div.dot: transform ×2, div.dot: transform+top | made with: clip-path · GSAP

```css
body { position: relative }
.container { position: absolute; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); box-shadow: 0px 5px 15px 2px #ffa000 }
.container svg { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.container .dots { position: absolute; top: 52%; transform: translate(-50%, -50%) }
.container .message { position: absolute; top: -10px; box-shadow: 0px 5px 15px 2px #d32f2f62 }
.credits { position: absolute; bottom: 0 }
```

```js
gsap.to(
```

### [Variable Themes](https://codepen.io/ryanparag/pen/qBJOQWZ)

made with: transition · :hover · custom properties driven by JS

```css
.c-card { position: relative; box-shadow: 0.3px 0.5px 0.7px rgba(0, 0, 0, 0.08), 0.8px 1.6px 2px -0.8px rgba(0, 0, 0, 0.08), 2.1px 4.1px 5.2px -1.7px rgba(0, 0, 0, 0.08), 5px 10px 12.6px -2.5px rgba(0, 0, 0, 0.08) }
.c-button { position: relative; transition: all 120ms ease-out }
.c-button:hover, .c-button:focus { transform: scale(1.03) }
.c-theme { position: absolute; top: 2.4rem; transition: all 120ms ease-out }
.c-theme:after, .c-theme:before { position: absolute }
.c-theme:after { top: 0 }
.c-theme:before { bottom: 0 }
.c-theme__grid { position: relative; transition: all 240ms ease-out }
.c-box { position: relative; transition: all 120ms ease-out }
.c-box:hover, .c-box:focus { transform: scale(1.03) }
.c-box__swatches { margin-top: 0.8rem }
.c-box--active:after { position: absolute; top: -1.2rem }
```

```js
style.setProperty('--bg', `var(--${theme}-bg)`)
style.setProperty('--border', `var(--${theme}-border)`)
style.setProperty('--surface', `var(--${theme}-surface)`)
style.setProperty('--text-primary', `var(--${theme}-text-primary)`)
style.setProperty('--text-secondary', `var(--${theme}-text-secondary)`)
style.setProperty('--primary', `var(--${theme}-primary)`)
style.setProperty('--text-inverse', `var(--${theme}-text-inverse)`)
```
