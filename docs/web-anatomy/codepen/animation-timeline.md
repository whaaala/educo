# CodePen · animation-timeline — how each pen does it

93 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/animation-timeline.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| scroll-driven animation (animation-timeline) | 93 |
| @keyframes | 93 |
| scroll() timeline | 65 |
| position: fixed | 56 |
| animation-range | 47 |
| view() timeline | 46 |
| transition | 25 |
| :hover | 17 |
| position: sticky | 16 |
| prefers-reduced-motion | 11 |
| clip-path | 9 |
| scroll-snap | 8 |
| :has() | 8 |
| 3D (perspective / preserve-3d) | 6 |
| mask | 5 |
| backdrop-filter | 5 |
| container queries | 4 |
| :focus-visible | 3 |
| mix-blend-mode | 3 |
| custom properties driven by JS | 3 |
| scroll listener | 2 |
| requestAnimationFrame | 1 |
| @starting-style | 1 |
| (hover: hover) gate | 1 |
| IntersectionObserver | 1 |

## Every pen

### [Circular nav using :scroll-* & animation-timeline:view() #cssonly](https://codepen.io/editor/cbolson/pen/01a0a174-adfe-709e-8d70-a053acf0527e)

held: fixed div.markers | on hover of button.: button.: background, span.: opacity+top | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · scroll-snap · @keyframes · transition · :hover · :focus-visible · container queries

```css
container scroll-state(snapped: x) { opacity: 1; translate: 0 0 }
&:where(:hover,:focus-visible) { --icon-scale: .8 }
&:focus-visible { outline-offset: 6px }
svg,span { transition: 150ms ease-in-out; transition-property: scale, opacity,translate }
svg { scale: var(--icon-scale,1); translate: 0 var(--icon-y,0) }
span { opacity: var(--label,0); scale:var(--label,0); translate: 0 var(--label-y,0) }
.markers { position: fixed; box-shadow: 0 0 10px 10px rgba(0 0 0 / .05) }
&::scroll-button(*) { position: absolute; translate: 0 0 }
&::scroll-button(*):hover { scale: 1.5 }
&::scroll-button(*):disabled:hover { scale: 1 }
&::scroll-button(*):focus-visible { scale: 1.5 }
&::scroll-button(*):disabled { opacity: .15 }
```

### [Scroll Spiral Gallery #cssonly](https://codepen.io/editor/cbolson/pen/01a010d3-b359-752e-b961-45172344286d)

held: fixed section.spiral, fixed p.scroll | on scroll: figure.card: transform+opacity+top ×48, figcaption.: transform+opacity+top ×2, figcaption.: opacity ×2 | on hover of figure.card: figure.card: transform+opacity+top ×48, figcaption.: transform+opacity+top ×2, figcaption.: opacity ×2 | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @keyframes · transition · 3D (perspective / preserve-3d) · container queries

```css
:root { --card-secondary-opacity: 0.5 }
&::before { position: fixed; top: 1rem; translate: -50% 0 }
.spiral { position: fixed; inset: 0; perspective: 850px; animation: --k-progress 1s linear both; animation-timeline: scroll(root) }
span { rotate: var(--r,0deg); animation: --k-bounce 1.5s infinite ease-in-out, --k-hint-hide both; animation-timeline: auto,scroll(root); animation-range: 90% 100%; transition: scale 150ms ease-in-out }
50% { translate: 0 10px }
@keyframes --k-progress animates --progress
@keyframes --k-bounce animates translate
@keyframes --k-hint-hide animates --r
```

### [Receipt - "prints" using animation-timeline](https://codepen.io/editor/cbolson/pen/019fd2dd-9108-7f53-b09c-a5b4beb0f6ee)

held: fixed h1, fixed div.printer, fixed article.receipt, fixed button.new-receipt | on scroll: span.led: background+shadow, article.receipt: transform+top | on hover of button.new-receipt: span.led: background+shadow | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @keyframes · transition · :hover · mask · requestAnimationFrame

```css
:root { --printer-slot-top: 25px }
&::before { position: fixed; top: 1rem; translate: -50% 0 }
h1 { position: fixed; bottom: calc(var(--printer-height) + 1rem); translate: -50% 0 }
supports (animation-timeline: scroll()) { transform: translate(-50%, calc(100% - var(--progress))); animation: --k-receipt-feed both steps(var(--progress-steps)); animation-timeline: scroll(root) }
&::before, &::after { position: absolute; top: -5px }
&::after { top:auto; bottom: -5px }
&.tearing { animation: --k-receipt-feed both steps(var(--progress-steps)), --k-tear-off 800ms cubic-bezier(0.22, 1, 0.36, 1) forwards; animation-timeline: scroll(root), auto }
hr { border-top: 1px dashed #111 }
.led { position: absolute; top: calc(var(--printer-slot-top) + var(--printer-slot-height) / 2); animation: --k-blink 3s infinite }
0%, 74% { box-shadow: 0 0 5px 1px transparent }
75%, 100% { box-shadow: 0 0 5px 1px rgb(154 230 0) }
0% { translate: 0 0; rotate: 0deg }
```

```js
requestAnimationFrame(() => {
```

### [Timeline with animation-timeline, sibling-index() & sibling-count()](https://codepen.io/damianwalsh/pen/emgKvyj)

held: fixed div.info | on scroll: li.: opacity+top ×5 | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · prefers-reduced-motion

```css
&::before { position: absolute; top: 0 }
media (prefers-reduced-motion: no-preference) { animation-name: track; animation-duration: 1s; animation-timing-function: linear; animation-fill-mode: both; animation-timeline: --container; animation-range-end: entry 100% }
&::before { position: absolute; top: 50%; transform: translateY(-50%) translateX(-50%) }
media (prefers-reduced-motion: no-preference) { animation-name: reveal; animation-duration: 1s; animation-timing-function: var(--ease); animation-fill-mode: both; animation-timeline: --container; animation-range-start: entry calc(sibling-index() * var(--stagger)); ani }
from { opacity: 0 }
to { opacity: 1 }
from { transform: scaleY(0) }
to { transform: scaleY(1) }
@keyframes reveal animates opacity
@keyframes track animates transform
```

### [Staggered reveal with animation-timeline & sibling-index()](https://codepen.io/damianwalsh/pen/WbRJRbN)

held: fixed div.info | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · prefers-reduced-motion

```css
media (prefers-reduced-motion: no-preference) { animation-name: reveal; animation-duration: 1s; animation-timing-function: var(--ease); animation-fill-mode: both; animation-timeline: --container; animation-range-start: entry calc(sibling-index() * var(--stagger)); ani }
from { opacity: 0; transform: translateY(5rem) rotate(5deg) }
to { opacity: 1; transform: translateY(0) rotate(0deg) }
@keyframes reveal animates opacity, transform
```

### [#discord scroll-marker/sibling-count/animation-timeline](https://codepen.io/editor/Miss-Fox/pen/019ef199-7ee4-7253-911c-d8aca0953c54)

made with: scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · scroll-snap · @keyframes

```css
&::scroll-marker-group { position: relative; top: var(--spacing-100, 1em) }
&::scroll-marker { opacity: 0.4; transition-property: flex-grow, opacity }
&::scroll-marker:target-current { opacity: 1 }
:is(.page:last-of-type) & { animation: reverse-move linear forwards; animation-timeline: view(inline); animation-range-start: entry -100%; animation-range-end: entry 150% }
from { translate: 0 0; rotate: 0 }
to { translate: 50px 50px; rotate: 360deg }
from { translate: 50px 50px; rotate: -360deg }
to { translate: 0 0; rotate: 0 }
@keyframes move animates translate, rotate, color
@keyframes reverse-move animates translate, color, rotate
```

### [CSS Scroll-Driven Word-by-Word Reveal](https://codepen.io/kirkegaard/pen/azBBwKL)

held: fixed p | on scroll: span.: color ×24 | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @keyframes

```css
p { position: fixed; top: 50%; transform: translate(-50%, -50%) }
span { -webkit-animation: word 1s steps(1, end) forwards; animation: word 1s steps(1, end) forwards; animation-timeline: scroll(root); animation-range: calc((var(--i) - 1) / var(--n) * 100%) calc(var(--i) / var(--n) * 100%) }
@keyframes word animates color
```

### [Draw SVG heart | animation-timeline: scroll();](https://codepen.io/BlogFire/pen/OPRGBVr)

held: fixed svg.[object | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
svg { position: fixed; inset: 0 }
#heart { animation: dash 3s ease-in-out forwards; animation-timeline: scroll() }
@keyframes dash animates stroke-dashoffset, fill
```

### [SS Animations — All Techniques](https://codepen.io/pixelgridui/pen/QwKYPvX)

held: fixed div, fixed div.pp-widget, fixed button.pp-reopen | on hover of a.pp-btn-yt: div.s2-box: transform+opacity+top, div.s8-good: transform, div.s9-spin: transform+top, div.s9-bounce: transform, div.s9-pulse: transform+opacity+top | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · transition · :hover

```css
#progress { position: fixed; top: 0; transform: scaleX(0); animation: progressGrow linear both; animation-timeline: scroll(root block) }
from { transform: scaleX(0) }
to { transform: scaleX(1) }
section { border-bottom: 1px solid var(--border); position: relative }
section::before { position: absolute; top: 48px; transform: translateX(-50%); text-transform: uppercase }
h2 { margin-bottom: 12px }
p.desc { margin-bottom: 64px }
.s1-box { transition: background 0.35s ease, transform 0.35s ease, border-radius 0.35s ease }
.s1-box:hover { transform: translateY(-16px) scale(1.1) }
.s2-box { animation: wiggleGrow 2.5s ease-in-out infinite }
0% { transform: scale(0) rotate(-15deg); opacity: 0 }
20% { transform: scale(1.15) rotate(8deg); opacity: 1 }
```

### [Horizontal scrolling tables](https://codepen.io/editor/starzonmyarmz/pen/019d8c57-e56d-7f5c-8370-35200d07ef76)

made with: scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · mask

```css
.table-wrapper { animation: table-fade linear; animation-timeline: scroll(self inline); mask-image: linear-gradient( to right, transparent, black var(--fade-left), black calc(100% - var(--fade-right)), transparent ) }
th, td { border-bottom: 1px solid; border-top: 1px solid }
tr:first-child :is(td, th) { border-top: 0 }
tr:last-child :is(td, th) { border-bottom: 0 }
@keyframes table-fade animates --fade-left, --fade-right
```

### [Artemis 2 Integrity - scroll to reach the moon](https://codepen.io/cbolson/pen/emdjyjX)

held: fixed div.space | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · mix-blend-mode

```css
h1 { position: absolute; top:0; text-transform:uppercase; mix-blend-mode: difference }
.space { position: fixed; inset: 0 }
.moon { position: absolute; top:50%; transform: translate(-50%,-50%); translate: var(--moon-translate-start); scale: var(--moon-scale-start, .05); animation-name: --💫-moon-rotate,--💫-moon-scale; animation-timing-function: step }
100% { scale: var(--moon-scale-end,1); translate: 0 0 }
to { background-position: calc(var(--moon-size) * (var(--frames) - 1) * -1) 0 }
.integrity { position: absolute; top:0 }
&::before { position: fixed; top: 1rem; translate: -50% 0 }
```

### [Artemis 2 - scroll to launch #cssonly](https://codepen.io/cbolson/pen/jEMxeZW)

held: fixed div.scene, fixed hgroup.msg, fixed div.icon | on scroll: div.scene: background, div.rocket: transform+top, div.icon: opacity, path.[object: transform+top | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @keyframes · :has() · clip-path

```css
&::before, &::after { position: fixed; translate: var(--tower-x) 0; bottom: 0; clip-path: polygon(50% 0, 100% 100%, 0 100%); animation: --💫-tower 1ms linear; animation-timeline: scroll(root); animation-range: 4% 100% }
to { translate: var(--tower-x) 1000px }
.scene { position: fixed; inset: 0; animation: --💫-launch 1ms linear both; animation-timeline: scroll(root); animation-range: 3% 100% }
> * { position: absolute; translate: -50% 0 }
&::before, &::after { position: absolute; translate: -50% 0 }
&::before { bottom: 100% }
&::after { top: 8px }
&::before, &::after { position: absolute; translate: -50% 0 }
&::after { top:2px }
&::before { position: absolute; top: 100% }
&::after { position: absolute; top: 100%; translate: -50% 10px; transform: scaleX(0.5) scaleY(0.3); filter: blur(2px); opacity: 0; animation: --💫--core-flame 1ms linear both; animation-timeline: scroll(root) }
0% { transform: translate(0, 0) rotate(0deg); opacity: 1 }
```

### [2025 F1 Drivers Championship race](https://codepen.io/cbolson/pen/GgjjNwN)

held: sticky h1, fixed section.track | on scroll: div.car: transform+top ×16 | made with: position: sticky · position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · custom properties driven by JS

```css
&::before { position: absolute; top:0 }
&::after { position: fixed; top: 3rem; translate: -50% 0; text-transform: uppercase }
.car-label { position: absolute; top: 100%; translate: -50% 10px }
svg { rotate:-90deg }
&::before { position: absolute; top: 30%; translate: -50% 50% }
0% { transform: translateY(var(--track-height)) }
4.16% { transform: translateY(var(--y1)) }
8.33% { transform: translateY(var(--y2)) }
12.5% { transform: translateY(var(--y3)) }
16.66% { transform: translateY(var(--y4)) }
20.83% { transform: translateY(var(--y5)) }
25% { transform: translateY(var(--y6)) }
```

```js
style.setProperty("--highest-score", n)
```

### [Muybridge race horse animation-timeline:scroll()](https://codepen.io/cbolson/pen/MYjYgJj)

held: fixed div.horse, fixed div.icon | on scroll: path.[object: transform+top | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
.horse { position: fixed; inset: 0; box-shadow: 0 0 10px 12px rgb(1 1 1 / 0.15); animation: --body-scroll steps(var(--steps)) both; animation-timeline: scroll(root); animation-iteration-count: var(--iterations) }
to { background-position: calc(var(--w) * (var(--frames) - 1) * -1) 0 }
75% { opacity: 1 }
100% { opacity: 0 }
&::before { position: fixed; top: 1rem; translate: -50% 0 }
@keyframes --body-scroll animates background-position
@keyframes mouse animates opacity
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

### [Hero image scroll zoom animation](https://codepen.io/thevasya/pen/VYKwKrr)

held: sticky div.project-hero | on hover of img.: img.: transform+top | made with: position: sticky · scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @keyframes

```css
.uppercase { text-transform: uppercase }
.main-footer { position: relative }
.project-hero { position: sticky; top: 0 }
.project-hero img { animation: --hero-zoom-move linear both; animation-timeline: scroll(root); animation-range: 0 100vw }
from { transform: translateY(0) scale(1) }
to { transform: translateY(-20vw) scale(1.5) }
article { position: relative }
article, .main-header, .main-footer { transform: translate3d(0, 0, 0) }
article > section:last-child { margin-bottom: 0 }
.content-section { border-top: 1px solid #222; border-bottom: 1px solid #222 }
@keyframes --hero-zoom-move animates transform
```

### [Star Trek, The original series. animation-timeline: scroll() controlled animations](https://codepen.io/cbolson/pen/ByzezPg)

held: fixed div.names, fixed div.wrapper, fixed div.mouse | on scroll: h2.: opacity+top, div.character: filter+top | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @starting-style · @keyframes · transition · backdrop-filter · container queries

```css
&::before { position: fixed; inset: 0; opacity: .2 }
img { filter:drop-shadow(2px 0 0 var(--secondary-color)) }
0%,100% { opacity: 0 }
15%,75% { opacity: 1; translate: 0 -27vh }
&::after { position: absolute; top: 90cqh; translate: -50% 0 }
@starting-style { filter: sepia(1) blur(80px) hue-rotate(80deg) }
container (width > 600px) { inset: auto -15% 15% }
label { opacity: .7 }
50% { translate: -25px 20px }
75% { opacity: 1 }
100% { opacity: 0 }
&::before { position: fixed; top: 1rem; translate: -50% 0 }
```

### [Zoom to center on scroll using animation-timeline: scroll()](https://codepen.io/cbolson/pen/raLPJVV)

held: fixed section.wrapper | on scroll: div.: opacity | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @keyframes

```css
> div { scale: calc(0.4 + var(--focus) * 0.8); opacity: calc(0.22 + var(--focus) * 0.8); translate: var(--item-x) 0; animation-name: item-focus; animation-timeline: scroll(); animation-range: var(--item-entry) var(--item-exit);  }
@keyframes item-focus animates --focus
```

### [Scroll-Driven CSS Animations No JS - animation-timeline](https://codepen.io/emilio-dominguez/pen/PwzVoBz)

held: fixed div.progress-bar | on scroll: span.word: transform+opacity+filter+top ×6 | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · transition · :hover · clip-path · mix-blend-mode · 3D (perspective / preserve-3d)

```css
html { scroll-timeline: --page-scroll block }
body::before { position: fixed; inset: 0; opacity: 0.4 }
.progress-bar { position: fixed; top: 0; transform: scaleX(0); -webkit-animation: scale-progress auto linear; animation: scale-progress auto linear; animation-timeline: --page-scroll }
to { transform: scaleX(1) }
to { transform: scaleX(1) }
section { position: relative; view-timeline: --section block }
.hero-title .char { -webkit-animation: char-rise auto var(--smooth-out) both; animation: char-rise auto var(--smooth-out) both; animation-timeline: --section }
.hero-rule { -webkit-animation: rule-expand auto var(--smooth-out) both; animation: rule-expand auto var(--smooth-out) both; animation-timeline: --section; animation-range: entry 20% entry 80% }
.hero-sub { text-transform: uppercase; opacity: 0; -webkit-animation: fade-smooth auto var(--smooth-out) both; animation: fade-smooth auto var(--smooth-out) both; animation-timeline: --section; animation-range: entry 30% entry 90% }
.hero-scroll-hint { position: absolute; bottom: 2.5rem; text-transform: uppercase; opacity: 0.2; -webkit-animation: hint-pulse 2.5s ease-in-out infinite, hint-fade auto linear both; animation: hint-pulse 2.5s ease-in-out infinite, hint-fade }
.line-1 .char:nth-child(1) { animation-range: entry 0% entry 40% }
.line-1 .char:nth-child(2) { animation-range: entry 4% entry 48% }
```

### [CSS Shadow Scrolling Animation - Demo](https://codepen.io/semanticdata/pen/EaydNxo)

held: fixed div.light-source, fixed div.support-status | on scroll: div.shadow-pal: shadow+top | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · prefers-reduced-motion

```css
.light-source { position: fixed; top: 50% }
.shadow-pal { box-shadow: 0 var(--d) var(--blur) rgba(0 0 0 / var(--alpha)) }
.shadow-pal { view-timeline-name: --box; view-timeline-axis: block; animation: shadow-move linear both; animation-timeline: --box; animation-range: entry 0% exit 100% }
.shadow-pal { animation: none }
0% { box-shadow: 0 var(--d) var(--blur) rgba(0 0 0 / var(--alpha)) }
50% { box-shadow: 0 0 calc(var(--blur) * 1.6) rgba(0 0 0 / calc(var(--alpha) * 0.55)) }
100% { box-shadow: 0 calc(var(--d) * -1) var(--blur) rgba(0 0 0 / var(--alpha)) }
.support-status { position: fixed; top: 20px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) }
@keyframes shadow-move animates box-shadow
```

### [Picket fence animation using scroll animations](https://codepen.io/cbolson/pen/JoKBeaW)

held: fixed div.optical, fixed div.controls, fixed svg.[object | on scroll: path.[object: transform+top | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · transition · :hover · :has()

```css
&::before { position: absolute; inset:auto -50px var(--ground-y, 0) }
&::after { position: absolute; inset: 0 }
75% { opacity: 1 }
100% { opacity: 0 }
&::before { position: fixed; top: 1rem; translate: -50% 0 }
@keyframes --body-scroll animates --x
@keyframes mouse animates opacity
```

### [Fun shadow coding challenge](https://codepen.io/cbolson/pen/emzVbPa)

on scroll: div.shadow-box: shadow+top ×6 | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · @keyframes

```css
:root { --shadow-y-offset: 50px; --shadow-spread-offset: 30px; --shadow-distance-offset: 18px; --shadow-opacity-offset: 15% }
&::before { position: fixed; inset:0 }
.shadow-box { box-shadow: 0 var(--shadow-y) var(--shadow-spread) var(--shadow-distance) rgb(39 39 42 / var(--shadow-opacity)); animation: --shadow-animate; animation-duration: 1ms; animation-timing-function: linear; animation-timeline }
0% { --shadow-opacity:var(--shadow-opacity-offset) }
50% { --shadow-opacity: var(--shadow-opacity-center) }
100% { --shadow-opacity:var(--shadow-opacity-offset) }
@keyframes --shadow-animate animates --shadow-y, --shadow-opacity, --shadow-spread, --shadow-distance
```

### [Image gallery using animation-timeline & clip-path](https://codepen.io/cbolson/pen/EayQdOm)

held: sticky hgroup, fixed img, sticky hgroup, fixed img, sticky hgroup, fixed img, sticky hgroup, fixed img, sticky hgroup, fixed img | on scroll: img.: clip-path | on hover of img.: img.: clip-path | made with: position: sticky · position: fixed · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · transition · clip-path · backdrop-filter

```css
&::after { position: fixed; inset: 0 }
hgroup { position: sticky; top: 50%; translate: 0 -50%; scale: var(--text-scale); backdrop-filter: blur(5px) }
& > img { position: fixed; top: 50%; translate: -50% -50%; transition: all 300ms linear; clip-path: inset(calc((100 - var(--factor)) * 1vw)) }
0%,20% { --text-scale: 0 }
30%,50% { --text-scale: 1 }
@keyframes --scroll-animation animates --factor
@keyframes --scroll-animation-text animates --text-scale
```

### [Fade-in on scroll: A visual testing nightmare](https://codepen.io/th3s4mur41/pen/WbxdRZO)

on scroll: p.: opacity+top ×14 | made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · prefers-reduced-motion

```css
media (prefers-reduced-motion: no-preference) { -webkit-animation: fadeIn 1ms linear both, fadeOut 1ms linear both; animation: fadeIn 1ms linear both, fadeOut 1ms linear both; animation-timeline: view(), view(); animation-range: entry 20% entry 120%, exit -20% exit 80 }
from { opacity: 0 }
from { opacity: 0 }
to { opacity: 0 }
to { opacity: 0 }
@keyframes fadeIn animates opacity
@keyframes fadeOut animates opacity
```

### [animation-timeline gallery + anchor-positioning on the thumbnails](https://codepen.io/cbolson/pen/jErmoKp)

held: fixed div.thumbs, fixed img, fixed img, fixed img, fixed img, fixed img, fixed img, fixed img, fixed img, fixed img | on scroll: img.: opacity ×2 | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll-snap · @keyframes · transition · :hover · :focus-visible · :has()

```css
&::before,&::after { position: absolute; top: anchor(top); bottom: anchor(bottom); transition: var(--nav-trans-duration) var(--nav-trans-easing) }
& > img { position: fixed; top: 50%; translate: -50% -50%; transition: all 300ms linear; opacity: var(--opacity) }
0%,100% { --scale: 0; --opacity: 0 }
50%,75% { --scale: 1; --opacity: 1 }
&::before { position: fixed; top: 6rem; translate: -50% 0 }
@keyframes --scroll-animation-center animates --scale, --opacity
```

### [Scroll animation with subgrid - #cssonly version of a pen by Jhey](https://codepen.io/cbolson/pen/ogLZgxO)

held: fixed section.wrapper, fixed p.credit, fixed svg.[object | on scroll: path.[object: transform+top | on hover of img.: div.group: opacity+top ×3, svg.[object: opacity, path.[object: transform+top | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · transition · :hover · :focus-visible

```css
supports (animation-timeline: scroll()) { animation-duration: 1ms; animation-timing-function: ease-in-out; animation-timeline: scroll(root y); animation-name: --scroll-animation-cards; animation-delay: var( --animation-delay); scale: var(--scale,0); opacity: var }
> div { position: relative }
& img { position: absolute; top: 50%; translate: -50% -50%; transition: all 300ms linear }
supports (animation-timeline: scroll()) { animation-name: --scroll-animation-center; --scale: 1; --opacity: 1 }
0% { --scale: 1; --opacity: 1 }
100% { --scale: 0; --opacity: 0 }
50%,100% { opacity: 0 }
&::before { position: fixed; top: 2rem; translate: -50% 0 }
@keyframes --scroll-animation-center animates --img-w, --img-h
@keyframes --scroll-animation-cards animates --scale, --opacity
@keyframes mouse animates opacity
```

### [One Letter at a time - unscramble the words on scroll](https://codepen.io/cbolson/pen/xbOgxwp)

held: fixed section.scramble, fixed svg.[object | on scroll: span.: transform+top ×28, span.: transform ×4, path.[object: transform | on hover of a.: path.[object: transform | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · transition · :hover · 3D (perspective / preserve-3d)

```css
> span { transform: translate3d( 0, var(--start-y), var(--start-z) ); position: relative }
to { --page-offset: 0 }
95% { opacity: 1 }
100% { opacity: 0 }
body::before { position: fixed; top: 2rem; translate: -50% 0 }
&:hover { scale: 1.12 }
@keyframes --page-scroll animates --page-offset
@keyframes mouse animates opacity
```

### [Circular animation-timeline scroll gallery](https://codepen.io/cbolson/pen/MYebgqj)

held: fixed section.wrapper, fixed svg.[object | on scroll: path.[object: transform+top | on hover of img.: div.: opacity+filter+top ×4, div.: opacity+top ×3, section.wrapper: transform+top, path.[object: transform | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · transition

```css
body { animation: --page-rotate 1s linear; animation-timeline: scroll(nearest block); animation-timing-function: steps(var(--cards)) }
to { --rotate: 1 }
&::after { position: absolute; top: 100%; opacity: var(--caption-opacity); translate: 0 var(--caption-y); transition: opacity 300ms ease-in-out,translate 300ms ease-in-out }
75% { opacity: 1 }
100% { opacity: 0 }
body::before { position: fixed; top: 2rem; translate: -50% 0 }
@keyframes --page-rotate animates --rotate
@keyframes mouse animates opacity
```

### [no-js css only carousel](https://codepen.io/patrickliu/pen/ZYOpwdK)

made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · animation-range · scroll-snap · @keyframes · transition · :hover

```css
.carousel { position: relative; scroll-snap-type: x mandatory }
.carousel::before { position: fixed; transform: translateY(-1.2rem) }
.carousel::scroll-button(*) { padding-bottom: 0.1em; position: fixed; transition: 0.3s }
.carousel::scroll-button(*):disabled { opacity: 0 }
.carousel::scroll-button(*):hover { transform: scale(1.2) }
.carousel::scroll-button(left) { translate: 50% }
.carousel::scroll-button(right) { translate: -50% }
.card { scroll-snap-align: start; margin-bottom: 8px; animation: reveal linear; animation-timeline: view(inline); animation-range: entry 0 }
.card::scroll-marker { transition: 0.3s; opacity: 0.5 }
.card::scroll-marker:target-current { opacity: 1 }
.card::scroll-marker { opacity: 0.5 }
.card::scroll-marker:target-current { transform: scale(1.2) }
```

### [CSS_Scroll driven Animations](https://codepen.io/shiuh-li/pen/wBWzdBN)

held: sticky div.h-sticky-wrapper | made with: position: sticky · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes

```css
.ttl-block { margin-top:min(10vw,3rem) }
from { opacity:0; transform:scale(0.5); filter:grayscale(50%) brightness(0) blur(5px) }
to { opacity:1; transform:scale(1); filter:grayscale(10%) brightness(0.8) blur(0px) }
to { transform:translateX(calc(-100% + 65vw)) }
from { opacity:0; transform:translateY(35%); filter:brightness(0) blur(5px) drop-shadow(0px 0px 3px rgba(0, 0, 0, 1)) drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.7)) drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.4)) drop-shadow(0px 0px  }
to { opacity:1; transform:translateY(0); filter:brightness(1) blur(0px) drop-shadow(0px 0px 3px rgba(0, 0, 0, 1)) drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.7)) drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.4)) drop-shadow(0px 0px 17 }
from { opacity:0; transform:translateX(150%); filter:brightness(0) blur(5px) drop-shadow(0px 0px 3px rgba(0, 0, 0, 1)) drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.7)) drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.4)) drop-shadow(0px 0px }
to { opacity:1; transform:translateX(0); filter:brightness(1) blur(0px) drop-shadow(0px 0px 3px rgba(0, 0, 0, 1)) drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.7)) drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.4)) drop-shadow(0px 0px 17 }
.card { box-shadow:inset 0px 1px 0px var(--Shadowcolor), inset 0px -1px 0px var(--Shadowcolor), inset 1px 0px 0px var(--Shadowcolor), inset -1px 0px 0px var(--Shadowcolor); opacity:0 }
.card-txt { opacity:0 }
.v-con { margin-bottom:2rem }
.v-con .card { background-position: center; animation:card_fadeIn linear both; animation-timeline:view(); animation-range:entry 0% cover 45%; position:relative }
```

### [Round & Round - unscramble the words on scroll](https://codepen.io/cbolson/pen/NPrrpzJ)

held: fixed ul, fixed svg.[object | on scroll: span.: transform+top ×51, ul.: transform+top, path.[object: transform | on hover of li.: path.[object: transform+top | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · transition · :hover

```css
> span { --letter-rotate: var(--rotate); position: absolute; top: 50%; transform: rotate(var(--letter-angle)) translateX(var(--radius)) translateX(calc((var(--i) - 1) * var(--letter-spacing))) }
100% { --rotate: 1 }
95% { opacity: 1 }
100% { opacity: 0 }
body::before { position: fixed; top: 2rem; translate: -50% 0 }
&:hover { scale: 1.12 }
@keyframes --scroll-rotate animates --rotate
@keyframes mouse animates opacity
```

### [Advanced Scroll Effects with Pure CSS — Progress Bar, Parallax & 3D](https://codepen.io/fyildiz1974/pen/KwzJQYb)

held: fixed div.progress, fixed div.bg-layer, fixed div.scroll-hint, fixed footer.footer | on scroll: div.circle: transform+top ×3, div.arrow: transform+top, div.card: transform+opacity+filter+top, div.stat: opacity+filter+top | on hover of div.card: div.arrow: transform+top | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · transition · :hover · backdrop-filter · 3D (perspective / preserve-3d)

```css
.progress { position: fixed; top: 0; animation: progress linear; animation-timeline: scroll(root); box-shadow: 0 0 20px rgba(59, 130, 246, 0.8) }
section { position: relative }
.card { backdrop-filter: blur(10px); animation: reveal linear; animation-timeline: view(); animation-range: entry 0% cover 30% }
from { opacity: 0; transform: translateY(100px) scale(0.8); filter: blur(10px) }
to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0) }
.bg-layer { position: fixed; top: 0 }
.circle { position: absolute; filter: blur(80px); opacity: 0.3; animation: parallax linear; animation-timeline: scroll(root) }
.circle-1 { top: 10% }
.circle-2 { top: 40% }
.circle-3 { bottom: 10% }
to { transform: translateY(300px) }
.rotating-card { animation: rotate-on-scroll linear; animation-timeline: view(); animation-range: entry 0% cover 50% }
```

### [Kinetic Scroll Demo](https://codepen.io/andriikycha/pen/gbrQXWy)

held: sticky p.list-text | on scroll: li.: opacity+top ×3 | made with: position: sticky · position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · scroll-snap · @keyframes · mask

```css
html, body { scroll-snap-type: y proximity }
body::before { position: fixed; inset: 0; background-position: top left; mask-image: radial-gradient(circle at top left, #000 0%, transparent 75%); mask-size: 100% 100%; mask-repeat: no-repeat }
.hero-description { margin-top: 16px }
.list-text { position: sticky; top: calc(50% - 0.5lh) }
.list li:first-of-type { --start-opacity: 1 }
.list li:last-of-type { --end-opacity: 1 }
.list li { opacity: 0.2; animation-name: brighten; animation-fill-mode: both; animation-timing-function: linear; animation-timeline: view(); animation-range: cover calc(50% - 1lh) calc(50% + 1lh) }
0% { opacity: var(--start-opacity, 0.2) }
50% { opacity: 1 }
100% { opacity: var(--end-opacity, 0.2) }
html, body { scroll-snap-type: y proximity }
.list li { scroll-snap-align: center }
```

### [Pure CSS Back-to-Top Button With Progress Indicator](https://codepen.io/scharan/pen/vELoYER)

held: fixed div.back-to-top-container | on scroll: div.back-to-top-container: transform+opacity+top | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · transition · :hover · :has() · (hover: hover) gate

```css
html { view-timeline-name: --page-scroll-timeline }
.back-to-top-container { position: fixed; bottom: 50px; opacity: 0; transform: scale(0.85) translateY(25px); animation: fadeUp ease-out forwards; animation-timeline: --page-scroll-timeline; animation-range: exit-crossing 2px exit-crossing 100% }
5%, 100% { opacity: 1; transform: scale(1) translateY(0) }
.back-to-top-container { bottom: 40px }
.back-to-top { animation: animateFill ease-in-out forwards; animation-timeline: scroll() }
.back-to-top .arrow-up { transition: stroke 0.15s ease-out }
.arrow-down { transform: rotateY(180deg) rotateZ(-18deg) }
@keyframes fadeUp animates opacity, visibility, transform
@keyframes animateFill animates --fill-pos
```

### [Animation-Timeline Follow SVG Path On-Scroll -- CSS Only](https://codepen.io/timhjellum/pen/ogbpOPE)

held: sticky div.map-container | made with: position: sticky · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes

```css
.route { animation: paint-line linear both; animation-timeline: view(); animation-range: cover 70% cover 100% }
.map-container { position: sticky; top: 0; margin-top: 2em; background-position: top center }
.map-container svg { position: absolute }
@keyframes paint-line animates stroke-dashoffset
```

### [animation-timeline: view](https://codepen.io/tomhermans/pen/raxNJVL)

on scroll: div.: transform+opacity+top ×7, div.center: opacity+top, div.: opacity+top | made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · transition · :hover · mix-blend-mode

```css
.box { position: relative }
.box div { animation: anim 1.2s ease-in-out normal both; animation-timeline: view(); animation-range: entry 30% contain 45% }
.box div.center img { mix-blend-mode: multiply }
.box div:not(.center) { position: absolute; transform: translate(var(--xval), var(--yval)) }
.box div:not(.center) > * { transition: all 0.2s cubic-bezier(0.23, 0.7, 0.62, 0.98) }
.box div:not(.center):hover > * { transform: scale(1.3) }
0% { opacity: 0 }
20% { opacity: 1 }
100% { opacity: 1 }
100% { transform: scale(1.2) }
@keyframes anim animates opacity, --mynum
@keyframes grow animates transform
```

### [Scrollspy using animation-timeline #css-only](https://codepen.io/cbolson/pen/ByoJRvg)

held: sticky nav, sticky h1 | made with: position: sticky · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · transition · :hover

```css
html { scroll-timeline: --page-scroll block; scroll-timeline: --page-scroll vertical; scroll-padding-top: 90px }
nav { position: sticky; top: 0 }
&::after { position: absolute; inset:0; animation-name: progress-bar; animation-duration: 1ms; animation-timing-function: steps(5); animation-timeline: --page-scroll }
from { top: 0 }
to { top: calc(100% - var(--nav-item-height)) }
& h1 { position: sticky; top: 0 }
@keyframes progress-bar animates top
```

### [Basic scroll animation demo](https://codepen.io/JBuma/pen/gbaxpBr)

held: fixed div.progress | on scroll: div.card: opacity+top ×8 | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · @keyframes

```css
&:after { position: absolute; -webkit-animation-name: inline-grow; animation-name: inline-grow; animation-timeline: scroll() }
from { opacity: 0.2 }
to { opacity: 1 }
from { opacity: 0.2 }
to { opacity: 1 }
.card { -webkit-animation-name: fade-in; animation-name: fade-in; animation-timeline: view(block 0% 0%) }
@keyframes inline-grow animates inline-size
@keyframes fade-in animates opacity
```

### [Spinny scroll animation](https://codepen.io/JBuma/pen/RNWpbwR)

held: fixed div.spinner | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
from { offset-path: circle(0px); offset-distance: calc(var(--position) * 1%) }
to { offset-path: circle(calc(0.5vh * var(--position))); offset-distance: calc(var(--position) * 10%) }
from { offset-path: circle(0px); offset-distance: calc(var(--position) * 1%) }
to { offset-path: circle(calc(0.5vh * var(--position))); offset-distance: calc(var(--position) * 10%) }
.dot { --position: calc((sibling-index() / sibling-count()) * 100); offset-path: circle(25vh); offset-distance: calc(var(--position) * 1%); -webkit-animation: spin; animation: spin; animation-timeline: scroll() }
@keyframes spin animates offset-path, offset-distance, block-size, inline-size
```

### [Sliding Images using animation-timeline](https://codepen.io/cbolson/pen/XJmNPQw)

held: fixed p.msg-supports, fixed section.wrapper | on scroll: hgroup.: opacity+top, path.[object: transform+top | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
.wrapper { --scale: 1; position: fixed; inset: 0 }
&.center { translate: var(--center-x) var(--center-y); animation-name: animate-center; animation-timing-function: linear; animation-fill-mode: both; animation-timeline: scroll(); animation-duration: 1ms }
&.center > hgroup { opacity: var(--text-opacity, 1) }
&.center > .mouse { position: absolute; bottom: 50px; translate: -50% 50%; rotate: var(--mouse-rotate,0deg) }
25%, 65% { --text-opacity: 0 }
95% { --mouse-rotate: 0deg }
100% { --mouse-rotate: 180deg }
0%, 15% { translate: var(--x) var(--y) }
100% { translate: 0 }
.msg-supports { position: fixed; top:0; scale:1 }
@keyframes animate-center animates --mouse-w, --center-x, --center-y, --text-opacity, --text-display, --mouse-rotate
@keyframes animate-boxes animates translate
```

### [Parallax cards with CSS animation-timeline](https://codepen.io/jq/pen/yyNdGjw)

made with: scroll-driven animation (animation-timeline) · view() timeline · @keyframes · prefers-reduced-motion · clip-path

```css
0% { transform: scale(1.25) translateY(calc((var(--img-height) * 0.1) * -1)) }
100% { transform: scale(1.25) translateY(calc(var(--img-height) * 0.1)) }
.img-wrap:not(.debug-view) { clip-path: inset(0 round 12px) }
.card img { animation: move-img linear both; animation-timeline: view() }
@keyframes move-img animates transform
```

### [quick study: animation-timeline](https://codepen.io/dentednerd/pen/raVPJNv)

held: fixed footer | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
footer { position: fixed; top: 0 }
footer::after { position: fixed; top: 0; animation: progress-expand; animation-timeline: scroll() }
@keyframes progress-expand animates height
```

### [Fork: CSS ONLY Multi-color Scroll Progress Bar](https://codepen.io/MuraCSS/pen/emmOxNJ)

held: fixed div.progress | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · :has()

```css
.positioned { position:absolute }
#centered { top:10%; transform:translate(-50%, 0) }
#bottom { transform:translate(-50%, -100%) }
.progress { position: fixed; top:0 }
span.appear { opacity:0 }
body::before { position:fixed; top:0 }
.progress { animation: scroller 1s linear both; animation-timeline:scroll(root block) }
span.appear { animation: appear 1s linear both; animation-timeline: view(); animation-range: entry 0% exit -50vh }
from { opacity:0; transform: translateX(100vw) skew(20deg) }
to { opacity:1; transform }
@keyframes scroller animates width
@keyframes appear animates opacity, transform
```

### [Animación sencilla de progreso según scroll](https://codepen.io/justodev/pen/bNGYOQM)

held: fixed div.container | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
.container { position: fixed; top: 0 }
.bar { box-shadow: 0 0 5px darkred; animation: resize linear forwards; animation-timeline: scroll(root block) }
@keyframes resize animates width
```

### [The void](https://codepen.io/d4rek/pen/EaYdbwX)

held: fixed li, fixed li, fixed li, fixed li, fixed li, fixed li, fixed li, fixed li | on scroll: li.: opacity+top | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · mask

```css
.list li { position: fixed; top: 50%; translate: -50% -50%; -webkit-mask-image: linear-gradient( 90deg, rgb(0 0 0 / 0) calc(33.33% - 1px), rgb(0 0 0 / 1) 33.33%, rgb(0 0 0 / 1) calc(66.66% - 1px), rgb(0 0 0 / 0) 66.66% ); mask-imag }
.list li:first-of-type { -webkit-animation: line-1 auto linear; animation: line-1 auto linear; animation-timeline: scroll() }
0% { -webkit-mask-position: 50% 0%; mask-position: 50% 0%; rotate: 0deg }
12.5% { -webkit-mask-position: 100% 0; mask-position: 100% 0; rotate: 1deg; opacity: 1 }
12.6% { -webkit-mask-position: 100% 0; mask-position: 100% 0; rotate: 1deg; opacity: 0 }
87.4% { -webkit-mask-position: 0% 0; mask-position: 0% 0; rotate: -1deg; opacity: 0 }
87.5% { -webkit-mask-position: 0% 0; mask-position: 0% 0; rotate: -1deg; opacity: 1 }
100% { -webkit-mask-position: 50% 0%; mask-position: 50% 0%; rotate: 0deg }
0% { -webkit-mask-position: 50% 0%; mask-position: 50% 0%; rotate: 0deg }
12.5% { -webkit-mask-position: 100% 0; mask-position: 100% 0; rotate: 1deg; opacity: 1 }
12.6% { -webkit-mask-position: 100% 0; mask-position: 100% 0; rotate: 1deg; opacity: 0 }
87.4% { -webkit-mask-position: 0% 0; mask-position: 0% 0; rotate: -1deg; opacity: 0 }
```

### [animation-timeline](https://codepen.io/emelyanova/pen/zxOWpJN)

held: fixed div.progress | on scroll: div.progress: transform | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
html { scroll-timeline: --page-scroll block }
.progress { position: fixed; top: 0; -webkit-animation-name: grow-progress; animation-name: grow-progress; -webkit-animation-timing-function: linear; animation-timing-function: linear; -webkit-animation-duration: auto; animation-dur }
from { transform: scaleX(0) }
to { transform: scaleX(1) }
from { transform: scaleX(0) }
to { transform: scaleX(1) }
@keyframes grow-progress animates transform
```

### [Banners reveal with animation-timeline](https://codepen.io/diegopardo/pen/GgKmrBZ)

on scroll: div.pic: opacity+clip-path+top ×3 | made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · clip-path

```css
article h2 { margin-bottom: 1em; text-transform: capitalize }
figure img { -o-object-position: center; object-position: center }
from { translate: 0 50% 0; translate: 0 var(--translate, 50%) 0; opacity: 0; -webkit-clip-path: inset(50% 20% 50% 20% round 100%); clip-path: inset(50% 20% 50% 20% round 100%) }
to { translate: 0 0 0; opacity: 1; -webkit-clip-path: inset(0% 0% 0% 0% round 32px); clip-path: inset(0% 0% 0% 0% round 32px) }
from { translate: 0 50% 0; translate: 0 var(--translate, 50%) 0; opacity: 0; -webkit-clip-path: inset(50% 20% 50% 20% round 100%); clip-path: inset(50% 20% 50% 20% round 100%) }
to { translate: 0 0 0; opacity: 1; -webkit-clip-path: inset(0% 0% 0% 0% round 32px); clip-path: inset(0% 0% 0% 0% round 32px) }
.pic { -webkit-animation: reveal cubic-bezier(0.25, 0.46, 0.45, 0.94) both; animation: reveal cubic-bezier(0.25, 0.46, 0.45, 0.94) both; animation-timeline: view(block); animation-range: cover 20% cover 30%; animation-range: va }
.pic:first-child { --translate: -10% }
.pic:last-child { --translate: -50% }
@keyframes reveal animates translate, opacity, -webkit-clip-path, clip-path
```

### [Scroll-to-top with animation-timeline](https://codepen.io/diegopardo/pen/mybmrKq)

held: sticky a | on scroll: a.: opacity+shadow | made with: position: sticky · scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @keyframes

```css
section p { margin-bottom: 1.618em }
a { position: -webkit-sticky; position: sticky; bottom: 24px }
from { opacity: 0; translate: 0 30px }
to { opacity: 1; translate: 0 0; -webkit-box-shadow: 0 4px 8px hsla(0, 0%, 0%, .4); box-shadow: 0 4px 8px hsla(0, 0%, 0%, .4) }
from { opacity: 0; translate: 0 30px }
to { opacity: 1; translate: 0 0; -webkit-box-shadow: 0 4px 8px hsla(0, 0%, 0%, .4); box-shadow: 0 4px 8px hsla(0, 0%, 0%, .4) }
a { opacity: 0; -webkit-animation: showBtn linear forwards; animation: showBtn linear forwards; animation-timeline: scroll(); animation-range: 50vh 70vh }
@keyframes showBtn animates opacity, translate, -webkit-box-shadow, box-shadow
```

### [Zoom-out hero with animation-timeline](https://codepen.io/diegopardo/pen/zxOwvBa)

made with: scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes

```css
figure img { -o-object-position: center; object-position: center }
figure figcaption { position: relative }
section p { margin-top: 0; margin-bottom: 1em }
html { scroll-timeline: --page-scroll block }
.hero { -webkit-animation: zoom-out linear forwards; animation: zoom-out linear forwards; animation-timeline: --page-scroll; animation-range: 10vh 90vh; scale: 1.6 }
to { scale: 1 }
to { scale: 1 }
@keyframes zoom-out animates scale
```

### [Header sticky with animation-timeline](https://codepen.io/diegopardo/pen/dPbvEyJ)

held: sticky header | on scroll: header.: background+shadow+top | made with: position: sticky · scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @keyframes

```css
header { position: -webkit-sticky; position: sticky; top: 0 }
header a:link,header a:visited { text-transform: uppercase }
header a:-webkit-any-link { text-transform: uppercase }
header a:-moz-any-link { text-transform: uppercase }
header a:any-link { text-transform: uppercase }
.hero button { text-transform: uppercase }
header { -webkit-animation: header ease-in-out both; animation: header ease-in-out both; animation-timeline: scroll(); animation-range: 0 90vh }
50% { translate: 0 -100%; -webkit-box-shadow: 0 0 0 rgba(0, 0, 0, 0); box-shadow: 0 0 0 rgba(0, 0, 0, 0) }
60% { top: 0; translate: 0 -100%; -webkit-box-shadow: inset 0 0 0 rgba(0, 0, 0, 0), 0 0 0 rgba(0, 0, 0, 0); box-shadow: inset 0 0 0 rgba(0, 0, 0, 0), 0 0 0 rgba(0, 0, 0, 0) }
100% { top: 12px; translate: 0 0; -webkit-box-shadow: inset 0 1px 1px white, 0 0 1px rgba(0, 0, 0, 0.9), 0 8px 14px rgba(0, 0, 0, 0.5); box-shadow: inset 0 1px 1px white, 0 0 1px rgba(0, 0, 0, 0.9), 0 8px 14px rgba(0, 0, 0, 0.5 }
50% { translate: 0 -100%; -webkit-box-shadow: 0 0 0 rgba(0, 0, 0, 0); box-shadow: 0 0 0 rgba(0, 0, 0, 0) }
60% { top: 0; translate: 0 -100%; -webkit-box-shadow: inset 0 0 0 rgba(0, 0, 0, 0), 0 0 0 rgba(0, 0, 0, 0); box-shadow: inset 0 0 0 rgba(0, 0, 0, 0), 0 0 0 rgba(0, 0, 0, 0) }
```

### [CSS view-timeline shine effect](https://codepen.io/hexagoncircle/pen/yyBePPV)

on scroll: box-gleam.: shadow+top ×8 | made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · prefers-reduced-motion · container queries

```css
box-gleam { position: relative; box-shadow: var(--shadow) }
box-gleam { -webkit-animation: linear both; animation: linear both; -webkit-animation-name: gleam, shine, shadow; animation-name: gleam, shine, shadow; animation-timeline: view(); animation-range: cover -10% cover 100%, entry 0% cov }
box-gleam { -webkit-animation: none !important; animation: none !important }
from, to { box-shadow: none }
50%, 65% { box-shadow: var(--shadow) }
from, to { box-shadow: none }
50%, 65% { box-shadow: var(--shadow) }
@keyframes gleam animates --angle, --x
@keyframes shadow animates box-shadow
@keyframes shine animates --shine
```

### [a secret](https://codepen.io/cbolson/pen/JoPjmZa)

held: fixed div.wrapper | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · clip-path

```css
.wrapper { position: fixed; inset: 0 }
.wrapper { scale: .5; translate: -5rem 0 }
.wrapper p { position: absolute }
p > span { position: absolute; top: 0; translate: var(--x) var(--y) }
p:nth-child(1) span:nth-child(4)::after, p:nth-child(1) span:nth-child(4)::befor { position: absolute; translate: -50% 0 }
p:nth-child(1) span:nth-child(4)::before { top: 35px }
p:nth-child(1) span:nth-child(4)::after { bottom: 2px; rotate: 45deg; clip-path: polygon(100% 0, 100% 100%, 0 100%); animation: indicator 1000ms ease-out infinite; animation-direction: alternate }
to { translate: -50% 7px }
.wrapper::before { position: absolute; inset: 0; background-position: 0; animation: reveal linear both; animation-timeline: scroll(); animation-duration: 1ms; translate: var(--width) 0 }
to { translate: 0 0 }
@keyframes indicator animates translate
@keyframes reveal animates translate
```

### [Polaroid Timeline](https://codepen.io/lowfatprophet/pen/gOVWyqP)

held: sticky header, sticky img, sticky img, sticky img, sticky img | on scroll: img.: shadow+top ×3 | made with: position: sticky · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · transition

```css
header { position: sticky; top: 0 }
img { position: sticky; top: 25dvh; scale: 1.04; view-timeline-axis: block; animation-range: entry 40% cover 25% }
img::after { position: absolute; inset: 0; filter: blur(12px); transition: 5px 5px }
img:nth-child(1) { view-timeline-name: --drop-1; animation: linear drop-1 both; animation-timeline: --drop-1 }
img:nth-child(2) { view-timeline-name: --drop-2; animation: linear drop-2 both; animation-timeline: --drop-2 }
img:nth-child(3) { view-timeline-name: --drop-3; animation: linear drop-3 both; animation-timeline: --drop-3 }
img:nth-child(4) { view-timeline-name: --drop-4; animation: linear drop-4 both; animation-timeline: --drop-4 }
from { box-shadow: 5px 5px 24px #0003; scale: 1.04; rotate: 0 }
to { box-shadow: 1px 1px 1px #0003; scale: 1; rotate: calc(0.0314337934 * 2 * var(--_var) - var(--_var)) }
from { box-shadow: 5px 5px 24px #0003; scale: 1.04; rotate: 0 }
to { box-shadow: 1px 1px 1px #0003; scale: 1; rotate: calc(0.7413039707 * 2 * var(--_var) - var(--_var)) }
from { box-shadow: 5px 5px 24px #0003; scale: 1.04; rotate: 0 }
```

### [Sticky animated header using animation-timeline](https://codepen.io/cbolson/pen/GRbVdOO)

held: sticky header | made with: position: sticky · scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @keyframes · backdrop-filter

```css
header { position: sticky; top: 0; backdrop-filter: blur(5px); animation: adjust-header linear both; animation-timeline: scroll(); animation-duration: 1ms; animation-range: 0 200px }
.wrapper img { margin-bottom: var(--gap) }
@keyframes adjust-header animates font-size, padding-block
```

### [Scroll driven horizontal progress bar using animation-timline and a touch of JS](https://codepen.io/cbolson/pen/ExBMPOp)

held: sticky h1, fixed div.progress | made with: position: sticky · position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · scroll listener

```css
html { scroll-timeline: --page-scroll block; scroll-timeline: --page-scroll vertical }
.progress { position: fixed; top: 0 }
.progress::before { position: absolute; top: 50%; translate: 0 -50%; animation-name: progress-bar; animation-duration: 1ms; animation-timing-function: linear; animation-timeline: --page-scroll }
.progress::after { position: absolute; top: 50%; translate: 0 -50%; animation-name: progress-percent; animation-duration: 1ms; animation-timing-function: linear; animation-timeline: --page-scroll }
main > h1 { position: sticky; top: 2rem }
section { text-transform: capitalize }
@keyframes progress-bar animates width
@keyframes progress-percent animates left
@keyframes countdown animates content
```

```js
addEventListener("scroll", updateScrollPercentage)
```

### [Scroll-driven Animations (works on Chrome)](https://codepen.io/aybukeceylan/pen/yLdQXmP)

held: fixed div.progress-bar | on scroll: div.card: transform+opacity+top ×8, div.progress-bar: transform | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes

```css
h1 { margin-bottom: 3rem }
from { transform: scalex(0) }
to { transform: scalex(100%) }
.progress-bar { position: fixed; top: 0; animation: scaleProgress auto linear; animation-timeline: scroll(root) }
from { opacity: 0.3; transform: scale(0.9) }
to { opacity: 1; transform: scale(1) }
.card { box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px; animation: fade-in linear both; animation-timeline: view(); animation-range: entry 10% entry 80% }
@keyframes scaleProgress animates transform
@keyframes fade-in animates opacity, transform
```

### [Simple animation-timeline](https://codepen.io/ejlambo/pen/LYKQqKR)

made with: scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
.container { position: relative }
.scrollElem { margin-top: 200px; animation: rotateAnimation 2s cubic-bezier(0.22, 1, 0.36, 1); animation-timeline: scroll() }
from { opacity: 1 }
to { opacity: 0 }
@keyframes rotateAnimation animates opacity, background
```

### [Use range input value in CSS without JS (animation-timeline)](https://codepen.io/levchenkod/pen/yLdbJRr)

held: fixed div.controls | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes

```css
body { animation: fontSizeAnimation 1s linear, colorAnimation 1s linear, paddingAnimation 1s linear, radiusAnimation 1s linear; animation-timeline: --font-size-timeline, --color-timeline, --padding-timeline, --radius-timeline;  }
input#font-size[type="range"]::-webkit-slider-thumb { view-timeline: --font-size-timeline inline }
input#color[type="range"]::-webkit-slider-thumb { view-timeline: --color-timeline inline }
input#padding[type="range"]::-webkit-slider-thumb { view-timeline: --padding-timeline inline }
input#radius[type="range"]::-webkit-slider-thumb { view-timeline: --radius-timeline inline }
.card { box-shadow: 0 0 2px #090909 }
#developed-by { position: absolute; bottom: 1rem }
@keyframes fontSizeAnimation animates --fontSize
@keyframes colorAnimation animates --color
@keyframes paddingAnimation animates --padding
@keyframes radiusAnimation animates --radius
```

### [parallax scroll image w/ animation-timeline](https://codepen.io/vii120/pen/GRbJOaO)

made with: scroll-driven animation (animation-timeline) · view() timeline · @keyframes · transition · :hover

```css
.box { position: relative; box-shadow: 2px 2px 12px #0006; view-timeline: --item inline }
.box:hover img { scale: 1.08 }
img { position: absolute; top: 50%; translate: 0 -50%; transition: all 0.5s; animation: h-move both linear; animation-timeline: --item }
to { translate: calc(100% - var(--box-width)) -50% }
@keyframes h-move animates translate
```

### [CSS scroll text glitch effect](https://codepen.io/bali_balo/pen/GRbJOrr)

held: fixed label, fixed svg.[object | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · transition · :has()

```css
to { --scroll-position: 1 }
:root { animation: adjust-pos linear both; animation-timeline: scroll(root) }
body { animation: time 6s linear infinite; transition: --scroll-position-delayed 0.15s ease-out }
h2 { filter: url("#offset") }
section:nth-last-child(1 of section) h2 { padding-bottom: 0 }
svg[width="0"][height="0"] { position: fixed; top: 0 }
label { position: fixed; top: 0.5rem }
label input { vertical-align: text-bottom }
body:has(#debug:checked) section h2 { filter: none }
@keyframes time animates --t
@keyframes adjust-pos animates --scroll-position, --scroll-position-delayed
```

### [【Animation】View Progress Timelineのサンプル](https://codepen.io/zaxrfawb-the-lessful/pen/OJeJgVQ)

on scroll: div.animation-element: clip-path+top | made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · clip-path

```css
from { -webkit-clip-path: inset(30% round 20%); clip-path: inset(30% round 20%) }
to { -webkit-clip-path: inset(0); clip-path: inset(0) }
from { -webkit-clip-path: inset(30% round 20%); clip-path: inset(30% round 20%) }
to { -webkit-clip-path: inset(0); clip-path: inset(0) }
.animation-element { -webkit-animation: reveal-image linear both; animation: reveal-image linear both; animation-timeline: view(); animation-range: contain 0% contain 50% }
@keyframes reveal-image animates -webkit-clip-path, clip-path
```

### [【Animation】Scroll Progress Timelineのサンプル](https://codepen.io/zaxrfawb-the-lessful/pen/WNqezeY)

held: fixed div.animation-element | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
from { scale: 1 0 }
to { scale: 1 1 }
from { scale: 1 0 }
to { scale: 1 1 }
.animation-element { position: fixed; top: 0; bottom: 0; transform-origin: bottom; -webkit-animation: grow-progress linear; animation: grow-progress linear; animation-timeline: scroll() }
@keyframes grow-progress animates scale
```

### [Animated scroll Full CSS](https://codepen.io/Tef/pen/JjqgyJx)

made with: scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · @keyframes

```css
.container { scroll-timeline-name: --start }
.item-appear { opacity: 0; -webkit-animation-name: zoomText; animation-name: zoomText; -webkit-animation-duration: 0.3s; animation-duration: 0.3s; -webkit-animation-direction: alternate; animation-direction: alternate; animation-timeli }
.item-slide { -webkit-animation-name: slideText; animation-name: slideText; -webkit-animation-duration: 0.3s; animation-duration: 0.3s; -webkit-animation-direction: alternate; animation-direction: alternate; animation-timeline: view() }
.item-square { -webkit-animation-name: squareZoom; animation-name: squareZoom; -webkit-animation-duration: 0.3s; animation-duration: 0.3s; -webkit-animation-direction: alternate; animation-direction: alternate; animation-timeline: view }
from { opacity: 0; bottom: -10% }
to { opacity: 1; bottom: 0 }
from { opacity: 0; bottom: -10% }
to { opacity: 1; bottom: 0 }
from { opacity: 0 }
to { opacity: 1 }
from { opacity: 0 }
to { opacity: 1 }
```

### [1984 (Scrolling Animations #CodePenChallenge) pure CSS + JS fallback](https://codepen.io/denisetrocchi/pen/JjqqpyN)

on scroll: div.hour: opacity ×4, div.text: transform+top ×2, span.: opacity+top ×2, div.eye-wrapper: transform | on hover of a.: span.: opacity+top ×2 | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · scroll-snap · @keyframes · transition · :hover · prefers-reduced-motion · scroll listener

```css
:root { --top: 12rem; --eye-top: 0; --hand-top: 2.2rem; --hand-h-top: 3rem }
:root { --top: 8rem; --hand-top: 1.3rem; --hand-h-top: 1.7rem }
:root { --top: 4rem; --eye-top: -1rem; --hand-top: 1.1rem; --hand-h-top: 1.3rem }
.overlay { position: absolute; top: 0; opacity: 0 }
.overlay { opacity: 1 }
main { position: relative; scroll-snap-type: y mandatory; scroll-timeline-name: --scrollTimeline }
.section-stretcher { scroll-snap-align: start }
.section { scroll-snap-align: end }
.text { bottom: var(--text); position: relative }
.text { animation-duration: 1ms; animation: scroll-text linear both; animation-timeline: view(block); animation-range: contain 0% cover 95% }
.cpc-tag { opacity: .4 }
.eye-wrapper { top: 0; position: fixed }
```

```js
addEventListener('scroll', () => {
```

### [#CPChallenge: CSS view() Scrolling Animations](https://codepen.io/tommyho/pen/ZENZZzq)

on scroll: img.: transform+opacity+filter+top ×4 | made with: scroll-driven animation (animation-timeline) · view() timeline · @keyframes · prefers-reduced-motion

```css
img { animation: scrollin linear; animation-timeline: view(block 50% 5%); box-shadow: -15px 15px 10px 1px rgba(0, 0, 0, 0.2) }
from { scale: 0.7; opacity: 0; transform: rotate(-30deg); filter: blur(5px) }
to { scale: 1; opacity: 1; transform: rotate(0deg); filter: blur(0) }
@keyframes scrollin animates scale, opacity, transform, filter
```

### [Scroll progress using animation-timeline](https://codepen.io/playfulsparkle/pen/PoveVrM)

held: fixed div.progress | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · @keyframes · prefers-reduced-motion

```css
media (prefers-reduced-motion: no-preference) { animation: grow-progress auto linear; animation-timeline: scroll() }
from { transform: scaleX(0) }
to { transform: scaleX(1) }
.warning > :first-child { margin-top: 0 }
.warning > :last-child { margin-bottom: 0 }
.progress { position: fixed; top: 0 }
@keyframes grow-progress animates transform
```

### [Animate element using animation-timeline](https://codepen.io/playfulsparkle/pen/oNRdqqr)

made with: scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · @keyframes · prefers-reduced-motion

```css
.scroll-container { scroll-timeline: --timeline; scroll-animation-axis: block }
media (prefers-reduced-motion: no-preference) { animation: rotate linear forwards; animation-timeline: --timeline }
.warning > :first-child { margin-top: 0 }
.warning > :last-child { margin-bottom: 0 }
.progress { opacity: 0.5 }
to { transform: rotate(360deg) }
@keyframes rotate animates transform
```

### [Pure CSS: simple Scroll To Top button](https://codepen.io/andrejsharapov/pen/bGyLvaa)

held: fixed div.to-top | on hover of a.: div.to-top: opacity | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @keyframes

```css
.to-top { position: fixed; bottom: var(--indent); opacity: 0; animation: scroll-page both linear; animation-timeline: scroll(); animation-range: entry 0 exit 20dvh }
to { opacity: 1 }
@keyframes scroll-page animates opacity
```

### [CPC: Challenge - Scroll driven animation with filters](https://codepen.io/yexx/pen/VwOZgeG)

on scroll: div.item: filter+top ×3, img.: clip-path+top ×3 | made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · clip-path · custom properties driven by JS

```css
.image-gallery { padding-top: 10svh }
.item { margin-bottom: 10svh; --filter: drop-shadow(0 0 10px #000) }
.item { view-timeline-name: --img-timeline; -webkit-animation: move-and-fade both; animation: move-and-fade both; animation-timeline: view(y); animation-range: cover 0% cover 120% }
.item > img { view-timeline-name: --img-timeline; -webkit-animation: clippy both; animation: clippy both; animation-timeline: view(y); animation-range: cover 0% cover 120% }
from, to { filter: var(--filter) blur(100px) saturate(20) }
45%, 65% { filter: var(--filter) blur(0) saturate(1); transform: rotateY(0deg) }
from, to { filter: var(--filter) blur(100px) saturate(20) }
45%, 65% { filter: var(--filter) blur(0) saturate(1); transform: rotateY(0deg) }
from { -webkit-clip-path: var(--clip-i); clip-path: var(--clip-i) }
to { -webkit-clip-path: var(--clip-f); clip-path: var(--clip-f) }
from { -webkit-clip-path: var(--clip-i); clip-path: var(--clip-i) }
to { -webkit-clip-path: var(--clip-f); clip-path: var(--clip-f) }
```

```js
style.setProperty('--clip-i', generateRandomPoly(sides))
style.setProperty('--clip-f', generateRandomPoly(sides))
```

### [Circular Section Reveal](https://codepen.io/Caediel/pen/WNmWBxr)

on scroll: section.: opacity+clip-path+top ×2 | made with: scroll-driven animation (animation-timeline) · view() timeline · scroll-snap · @keyframes · clip-path

```css
html { scroll-snap-type: y mandatory }
section { animation-name: fade; animation-duration: 1ms; animation-timing-function: linear; animation-timeline: view(block 100% 0); animation-fill-mode: both; clip-path: circle(1px at center); scroll-snap-align: center; opacity: 0 }
to { opacity: 1; clip-path: circle(max(75vw, 75vh) at center) }
@keyframes fade animates opacity, clip-path
```

### [Scroll animation test](https://codepen.io/brian-pob/pen/ZEPVjgL)

made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes

```css
to { scale: 2.5; rotate: 360deg }
to { scale: 2.5; rotate: 360deg }
p { -webkit-animation: scroll-in linear forwards; animation: scroll-in linear forwards; animation-range-start: cover 30vh; animation-range-end: contain 70vh; animation-timeline: view() }
@keyframes scroll-in animates scale, rotate
```

### [Text Reveal Scroll Effect CSS-Only](https://codepen.io/santoshsinghchauhan/pen/XWGxemW)

held: fixed div.scroll-progress-bar | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @keyframes

```css
body { background-position: center center }
h1:last-child, h2:last-child, p:last-child { margin-bottom: 0 }
.text_reveal span { animation: scrollReveal linear forwards; animation-timeline: scroll(y) }
.text_reveal h2 span { animation-range-start: cover 30dvh; animation-range-end: cover 50dvh }
.text_reveal p span { animation-range-start: cover 49.9dvh; animation-range-end: cover 86dvh }
.scroll-progress-bar { position: fixed; top: 0; scale: 1 0; transform-origin: top; animation: scaleUp linear; animation-timeline: scroll() }
to { scale: 1 1 }
@keyframes scrollReveal animates background-size
@keyframes scaleUp animates scale
```

### [CSS-Only Scroll-Driven Animations](https://codepen.io/santoshsinghchauhan/pen/eYXPvaa)

made with: scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · 3D (perspective / preserve-3d)

```css
body { background-position: top center; padding-bottom: 4rem }
img { filter: contrast(1.2) }
h1:last-child, h2:last-child, p:last-child, ul:last-child { margin-bottom: 0 }
section .container h2 { margin-bottom: clamp(8vh, 12vw, 12vh); border-top: 1px solid rgba(255, 255, 255, 0.3); border-bottom: 1px solid rgba(255, 255, 255, 0.3) }
section .flex_row { margin-bottom: clamp(8vh, 12vw, 12vh) }
section .flex_row .box { box-shadow: rgba(255, 255, 255, 0.6) 0px 2px 8px 0px, 0px 0px 2px 8px #720455 inset }
[data-ssc] { transition-property: opacity, transform; animation-duration: 1s; animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275); animation-timeline: view() }
[data-ssc-exit] { animation-range: exit }
[data-ssc-instant] { animation-timeline: unset }
[data-ssc=fade-in] { animation-name: fadeIn }
[data-ssc=fade-out] { animation-name: fadeOut }
[data-ssc=fade-up] { animation-name: fadeUp }
```

### [Scroll Progress Bar CSS-Only](https://codepen.io/santoshsinghchauhan/pen/zYbmqyN)

held: fixed div.scroll-progress-bar, fixed div.scroll-progress-bar, fixed div.scroll-progress-bar, fixed div.scroll-progress-bar | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
body { background-position: center center }
h1:last-child, p:last-child, ul:last-child { margin-bottom: 0 }
section.banner { padding-bottom: 0 }
.scroll-progress-bar { position: fixed; top: 0; scale: 0 1; animation: scaleUp linear; animation-timeline: scroll() }
.scroll-progress-bar.top-to-bottom { scale: 1 0; transform-origin: top }
.scroll-progress-bar.right-to-left { top: auto; bottom: 0 }
.scroll-progress-bar.bottom-to-top { scale: 1 0; transform-origin: bottom }
to { scale: 1 1 }
@keyframes scaleUp animates scale
```

### [Demo Animation-timeline, only with CSS](https://codepen.io/editor/zuojypiw-the-animator/pen/018d3a70-5a64-70a9-b553-befecf528733)

held: fixed div.scroll-watcher | on scroll: article.card: opacity+shadow+top ×4 | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes

```css
.scroll-watcher { position: fixed; top:0; scale: 0 1; animation: scroll-line linear; animation-timeline: scroll() }
.cards { padding-bottom:500px }
to { scale: 1 1 }
40%,85% { box-shadow: 3px 3px 18px #00000046; scale: 1; opacity: 1 }
@keyframes scroll-line animates z-index, scale
@keyframes scroll-card animates box-shadow, scale, opacity
```

### [Rounded Scrollbar](https://codepen.io/alvaromontoro/pen/JjzEKWG)

held: sticky svg.[object | made with: position: sticky · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
.fake-content { margin-top: -480px }
#path { animation: moveScrollBar 1s linear; animation-timeline: scroll() }
@keyframes moveScrollBar animates stroke-dashoffset
```

### [CSS Scroll Animations](https://codepen.io/WithAnEs/pen/ZEPpbJW)

held: fixed a.top | on scroll: img.: opacity+filter+top ×2, img.: filter+top, a.top: opacity+top | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · transition · prefers-reduced-motion

```css
img { filter: grayscale(100%) blur(10px); opacity: 0; scale: 0.9; animation: fadeIn var(--ease-in-out-cubic) forwards; animation-timeline: view(); animation-range: entry 10% }
h1 { view-timeline-name: --header }
.top-context { animation-name: popIn; animation-timing-function: steps(1, end); animation-fill-mode: both; animation-timeline: --header; animation-range: 100% exit 200% }
.top { bottom: 10px; position: fixed; transition: all 250ms var(--ease-in-out-cubic); opacity: var(--scroll-to-top-active); translate: 0 calc(100% - var(--scroll-to-top-active) * 100%) }
0% { opacity: 0; filter: brightness(1) blur(20px); scale: 0.9 }
10% { opacity: 1; filter: brightness(2) blur(10px); scale: 0.91 }
100% { opacity: 1; filter: brightness(1) blur(0); scale: 1 }
img { animation-name: reducedMotionFadeIn }
.top { translate: 0 }
0% { opacity: 0; filter: blur(20px); scale: 1 }
10% { opacity: 1; filter: blur(10px); scale: 1 }
100% { opacity: 1; filter: blur(0); scale: 1 }
```

### [... just some fun with animation-timeline: view()](https://codepen.io/aepicos/pen/qBgwJda)

on scroll: div.ball: transform+top | made with: scroll-driven animation (animation-timeline) · view() timeline · @keyframes · IntersectionObserver

```css
main::before { content: 'This browser does not support "animation-timeline: view()"' }
.ball { animation: move-ball 1ms linear both; animation-timeline: view(block 30% 30%) }
.ball.-green { animation-direction: reverse }
.line-grow { animation: line-grow 1ms linear both; animation-timeline: view(block 30% 30%) }
blockquote { animation: background-grow 1ms linear both; animation-timeline: view(block 75% 15%) }
0% { transform: translate3d(2rem, 0, 0) scale3d(1, 1, 1) }
50% { transform: translate3d(calc(50vi - 2rem), 0, 0) scale3d(2, 0.75, 1) }
100% { transform: translate3d(calc(100vi - 6rem), 0, 0) scale3d(1, 1, 1) }
from { transform: scale3d(0, 4, 1) }
to { transform: scale3d(1, 1, 1) }
.timeline-view { position: relative }
.ball { box-shadow: -0.5rem -1rem rgba(0, 0, 0, 0.1) inset }
```

### [CSS Scroll Animation Timeline (css only)](https://codepen.io/HugoSalazar/pen/xxMaarz)

held: fixed div.c-progress-bar | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
.c-progress-bar { position: fixed; top: 0; animation-name: progress-bar; animation-timeline: scroll(y) }
@keyframes progress-bar animates width
```

### [CSS Scroll Animation #1 (Animation-timeline)](https://codepen.io/HugoSalazar/pen/VwgBoxo)

made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes

```css
.l-heading { text-transform: uppercase }
h2 { opacity: 0.7; margin-bottom: 32px }
img { view-timeline-name: --image; view-timeline-axis: block; animation-timeline: --image; animation-name: show; animation-range: entry 25% cover 50%; animation-fill-mode: both }
from { opacity: 0; scale: 25% }
to { opacity: 1; scale: 100% }
@keyframes show animates opacity, scale
```

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

### [CSS only Parallax experiment](https://codepen.io/james_k_fox/pen/RwvxoYw)

on hover of img.parallax_8: img.parallax_8: transform+top, img.parallax_7: transform+top, img.parallax_6: transform+top, img.parallax_5: transform+top, img.parallax_4: transform+top, img.parallax_3: transform+top | made with: scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
.hero > img { object-position: center; animation-name: parallax; animation-timing-function: linear; animation-timeline: scroll() }
to { transform: translateY(calc(var(--speed) * 10px)) }
.content { position: relative }
@keyframes parallax animates transform
```

### [Pure CSS circular scroll indicator](https://codepen.io/ghaste/pen/JjxErJr)

held: fixed div.path | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · mask

```css
.path .wheel { offset-path: border-box; animation: followpath linear; animation-timeline: scroll() }
from { offset-distance: 2% }
to { offset-distance: 98% }
.path { position: fixed; top: 1em }
.path:after { position: absolute; inset: -0.5vw; top: 1em; opacity: 0.9 }
.path:before { position: absolute; inset: -0.5vw; -webkit-mask-image: radial-gradient(transparent 60%, #000 50%); mask-image: radial-gradient(transparent 60%, #000 50%) }
@keyframes followpath animates offset-distance
```

### [Halloween spider / CSS Scroll animation](https://codepen.io/andrejsharapov/pen/eYbXbyV)

held: fixed svg.[object, fixed div.cobweb, fixed div.spider | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @keyframes

```css
& text, & path { animation: dash 4s both var(--cubic); animation-timeline: scroll() }
& text { animation-range: entry 0% exit 50% }
& path { animation-delay: 1s; animation-range: entry 80% exit }
supports (animation-timeline: scroll()) { animation-timeline: scroll(); animation-range: entry 10% exit 40% }
supports (animation-timeline: scroll()) { animation-timeline: scroll(); animation-range: entry 50% exit }
&::before { position: absolute; top: 0 }
&:nth-of-type(1) { rotate: 0.1turn }
&:nth-of-type(2) { rotate: 0.95turn }
&:nth-of-type(3) { rotate: 0.85turn }
&:nth-of-type(4) { rotate: 0.75turn }
.right { scale: -1 1 }
&::before, &::after { position: absolute }
```

### [Page Scroll Progress Indicator](https://codepen.io/sidisinsane/pen/NWeOjKZ)

held: fixed div.page-scroll-progress-indicator | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · :has()

```css
html { scroll-padding-top: var(--gutter, 1.5rem) }
.page-scroll-progress-indicator { position: fixed; animation-timeline: scroll(root); -webkit-animation-duration: auto; animation-duration: auto; -webkit-animation-name: page-scroll-progress-indicator; animation-name: page-scroll-progress-indicator; -webk }
0% { transform: scaleX(0) }
100% { transform: scaleX(1) }
0% { transform: scaleX(0) }
100% { transform: scaleX(1) }
blockquote p:first-child { position: relative }
blockquote p:first-child::before { position: absolute }
@keyframes page-scroll-progress-indicator animates transform
```

### [SVG Path Animation (CSS native + JS Fallback)](https://codepen.io/quadratliter/pen/KKbXxQE)

made with: scroll-driven animation (animation-timeline) · view() timeline · @keyframes · transition · custom properties driven by JS

```css
.animate-path { transition: stroke-dashoffset 0.5s ease-out }
.animate-path { transition: none; animation-timeline: view(block 0% 50%); animation-name: animatePath; animation-fill-mode: both; animation-duration: 1ms }
@keyframes animatePath animates stroke-dashoffset
```

```js
style.setProperty("--dash-value", pathLength)
```

### [Full-Screen Navigation Bar: Pure CSS Scroll Animation](https://codepen.io/andrejsharapov/pen/ZEVyKmR)

held: fixed label, fixed div.airplane, fixed div.back, fixed div.help | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · @keyframes · transition · :hover · :has() · backdrop-filter

```css
&:not(:hover) { filter: blur(var(--blur)); -webkit-filter: blur(var(--blur)) }
&:nth-of-type(2) { translate: 0 25vh }
&:not(:hover) { scale: 0.8 }
&:hover { scale: 1.35 }
&:nth-of-type(2) { translate: 0 45vh }
&:nth-of-type(3n + 1) { translate: 0 75vh }
.back { position: fixed; top: 0; bottom: 0; background-position: var(--x) var(--y); animation: scroll-page both linear; animation-timeline: scroll(inline) }
.screw { animation: screw 100ms infinite }
& a { translate: none; scale: 1; animation-timeline: view(y 40vh auto) }
~ .back { animation-timeline: scroll() }
.help { position: fixed; bottom: 1rem; translate: -50% }
to { background-position: 100% 50% }
```

### [Scroll-based 3D cards](https://codepen.io/nelsonleite/pen/PoXzoKZ)

made with: scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · 3D (perspective / preserve-3d)

```css
from { transform: rotateY(8deg) }
to { transform: rotateY(-8deg) }
.carousel-wrap { perspective: 600px }
.carousel { scroll-timeline: --carousel-scroll inline; animation: anim-rotate auto linear; animation-timeline: --carousel-scroll }
.card { box-shadow: var(--shadow-x) 5px 0px 2px rgba(0, 0, 0, 0.75); animation: anim-shadow auto linear; animation-timeline: --carousel-scroll }
@keyframes anim-rotate animates transform
@keyframes anim-shadow animates --shadow-x
```

### [CSS-Only Reading Progress Bar](https://codepen.io/rafaucau/pen/poqyZNW)

held: sticky div.progress-bar, sticky div.progress-bar, sticky div.progress-bar, sticky div.progress-bar | made with: position: sticky · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes

```css
section { view-timeline-name: --reading-progress; view-timeline-axis: y }
.progress-bar { position: sticky; top: 0; scale: 0 1; will-change: scale; animation: scaleProgress auto linear forwards; animation-timeline: --reading-progress; animation-range: contain -25% entry-crossing 100% }
from { scale: 0 1 }
to { scale: 1 1 }
@keyframes scaleProgress animates scale
```

### [Weather app prototype — Scroll-driven animations](https://codepen.io/hexagoncircle/pen/OJrJZqR)

held: sticky header.flex-stack, sticky h2, sticky h2, sticky h2, sticky h2, sticky h2, sticky h2, sticky h2, sticky h2, sticky h2 | made with: position: sticky · scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · scroll-snap · @keyframes

```css
:root { --offset: 5rem }
:is(.stack, .flex-stack) > * + * { margin-top: var(--space, 0.5rem) }
.x-scroll { -ms-scroll-snap-type: x mandatory; scroll-snap-type: x mandatory }
header { position: relative }
#location { position: relative }
#location::before { position: absolute; top: calc(var(--vp-gutter) * -1) }
#summary { position: absolute; top: 100%; opacity: 0 }
.current-temp { position: relative }
.current-temp::after { position: absolute; top: 0 }
main { margin-top: calc(var(--vp-gutter) * -2); position: relative }
main::before { position: sticky; top: 0 }
article { position: relative }
```

### [ScrollTrigger: Pure CSS](https://codepen.io/ghaste/pen/yLGBmPp)

held: fixed div.img-cont | on scroll: img.: filter | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
body { scroll-timeline-name: --app_filters }
.cont img { animation: filters linear 1ms alternate; animation-timeline: --app_filters; animation-timeline: scroll(block nearest) }
0% { filter: grayscale(0) sepia(0) saturate(1) brightness(1) hue-rotate(0deg) blur(0) invert(0) contrast(1) }
10% { filter: grayscale(1) sepia(0) saturate(1) brightness(1) hue-rotate(0deg) blur(0) invert(0) contrast(1) }
20% { filter: grayscale(0) sepia(1) saturate(1) brightness(1) hue-rotate(0deg) blur(0) invert(0) contrast(1) }
30% { filter: grayscale(0) sepia(0) saturate(1) brightness(1) hue-rotate(0deg) blur(0) invert(0) contrast(0.5) }
40% { filter: grayscale(0) sepia(0) saturate(1) brightness(1) hue-rotate(0deg) blur(0) invert(1) contrast(1) }
50% { filter: grayscale(0) sepia(0) saturate(0.1) brightness(1) hue-rotate(0deg) blur(0) invert(0) contrast(1) }
60% { filter: grayscale(0) sepia(0) saturate(1) brightness(1) hue-rotate(0deg) blur(0) invert(0) contrast(1) }
70% { filter: grayscale(0) sepia(0) saturate(0.1) brightness(1) hue-rotate(0deg) blur(0.5em) invert(0) contrast(1) }
80% { filter: grayscale(0) sepia(0) saturate(1) brightness(1) hue-rotate(90deg) blur(0) invert(0) contrast(1) }
100% { filter: grayscale(0) sepia(0) saturate(1) brightness(1.24) hue-rotate(-270deg) blur(0) invert(0) contrast(1.95) }
```

### [Photo figures — Scroll-driven animations](https://codepen.io/hexagoncircle/pen/PoxMPzM)

on scroll: img.develop-photo: opacity+filter+top ×3, header.: opacity+top | made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes

```css
header { position: relative }
h1 { position: relative; rotate: -3deg }
figure { position: relative; box-shadow: var(--shadow); rotate: var(--rotate, -3deg) }
figure:nth-of-type(even) { --rotate: 2deg; --offset: 0.5rem }
img { position: relative; vertical-align: bottom }
figure { translate: var(--offset, -0.5rem) 0 }
figure { view-timeline-name: --photo }
header { animation: auto linear title both; animation-timeline: view(); animation-range: exit 10% cover 80% }
.develop-photo { animation: auto linear develop both; animation-timeline: --photo; animation-range: entry 30% cover 40% }
.shuffle-photos > :first-child { animation: auto linear shuffle-top both; animation-timeline: view(); animation-range: entry 110% cover 60% }
.shuffle-photos > :last-child { animation: auto linear shuffle-bottom both; animation-timeline: view(); animation-range: entry 110% cover 60% }
to { opacity: 0; translate: 0 10% }
```

### [Scroll Timeline spinner](https://codepen.io/dzzl/pen/XWNoGEK)

held: fixed div.spinner | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
.spinner { position: fixed }
from { transform: rotate(0deg) }
to { transform: rotate(360deg) }
.spinner { animation: 4s linear forwards progress; animation-timeline: progress-timeline }
@keyframes progress animates transform
```
