# CodePen · scroll-driven-animations — how each pen does it

26 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/scroll-driven-animations.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| @keyframes | 26 |
| scroll-driven animation (animation-timeline) | 24 |
| animation-range | 20 |
| view() timeline | 18 |
| scroll() timeline | 12 |
| :hover | 10 |
| scroll-snap | 9 |
| transition | 9 |
| position: fixed | 9 |
| prefers-reduced-motion | 7 |
| clip-path | 5 |
| mix-blend-mode | 5 |
| position: sticky | 4 |
| container queries | 4 |
| 3D (perspective / preserve-3d) | 3 |
| backdrop-filter | 3 |
| scroll listener | 3 |
| mask | 2 |
| Lenis / smooth scroll | 2 |
| requestAnimationFrame | 2 |
| :has() | 2 |
| :focus-visible | 1 |
| (hover: hover) gate | 1 |
| @starting-style | 1 |
| IntersectionObserver | 1 |

## Every pen

### [Scroll Carousel (Chrome Only)](https://codepen.io/editor/Sensiblemnd/pen/01a0d636-c14e-7a65-9d5c-e6a1fb25a1f9)

made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · scroll-snap · @keyframes · transition · :hover · :focus-visible · (hover: hover) gate · prefers-reduced-motion · clip-path

```css
:where(a):focus-visible, :where(button):focus-visible { outline-offset: 2px }
.demo-card-link:hover { box-shadow: var(--shadow-raised) }
:root { --card-inset: 0.75rem; --rest-scale: 0.44 }
.stage { position: relative }
&:focus-visible { outline-offset: calc(-1 * var(--focus-ring-width)) }
& :where(.panel) { position: relative }
& :where(.notch) { position: absolute; clip-path: var(--notch-shape); transform-origin: bottom }
& :where(.num) { box-shadow: 0 0 0 var(--badge-ring) var(--color-socket) }
& :where(.title) { transform-origin: left top }
&:focus-visible { outline-offset: calc(var(--badge-ring) + var(--focus-ring-gap)) }
& :where(.notch) { animation: notch-fold linear both; animation-timeline: --card; animation-range: var(--feature-range) }
& :where(.num) { animation: badge-rest linear both; animation-timeline: --card; animation-range: var(--feature-range) }
```

### [The Unspoken Archive - Pure CSS Interactive Folders](https://codepen.io/editor/sanyi-dalmadi/pen/019f5b71-8f8c-7589-9b40-5d635e9c4d07)

held: fixed div.rail | on scroll: p.: transform+opacity+filter+top ×6, article.case: transform+opacity+filter+background+top ×3, div.stamp: transform+opacity+top ×3, div.eyebrow: transform+opacity+filter+top ×3, h2.: transform+opacity+filter+top ×3 | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · transition · :hover · prefers-reduced-motion · clip-path · mix-blend-mode

```css
.rail { position: fixed; top: 0; bottom: 0 }
.rail::after { position: absolute; top: 0; transform-origin: top; transform: scaleY(0); animation: fill-rail linear; animation-timeline: scroll(root) }
to { transform: scaleY(1) }
.intro .eyebrow { text-transform: uppercase; margin-bottom: 1rem }
.case { position: relative; box-shadow: 0 20px 50px var(--paper-shadow); clip-path: polygon( 0% 0%, 22% 0%, 26% 6%, 44% 6%, 48% 0%, 100% 0%, 100% 100%, 0% 100% ); transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), box-sh }
.case--odd { clip-path: polygon( 0% 0%, 52% 0%, 56% 6%, 74% 6%, 78% 0%, 100% 0%, 100% 100%, 0% 100% ) }
0% { opacity: 0.1; transform: translateX(var(--slide-x-start)) translateY(60px) scale(0.9) rotate(var(--rotate-start)); filter: blur(2px) }
35%, 65% { opacity: 1; transform: translateX(0) translateY(0) scale(1) rotate(0deg); filter: blur(0px) }
100% { opacity: 0.1; transform: translateX(var(--slide-x-end)) translateY(-60px) scale(0.9) rotate(var(--rotate-end)); filter: blur(2px) }
.case h2, .case p, .case .eyebrow { animation: text-focus linear both; animation-timeline: --case-timeline; animation-range: entry 15% exit 85% }
0% { opacity: 0.3; transform: scale(0.98); filter: blur(1px) }
35%, 65% { opacity: 1; transform: scale(1); filter: blur(0px) }
```

### [CSS Scroll-Driven Word-by-Word Reveal](https://codepen.io/kirkegaard/pen/azBBwKL)

held: fixed p | on scroll: span.: color ×24 | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @keyframes

```css
p { position: fixed; top: 50%; transform: translate(-50%, -50%) }
span { -webkit-animation: word 1s steps(1, end) forwards; animation: word 1s steps(1, end) forwards; animation-timeline: scroll(root); animation-range: calc((var(--i) - 1) / var(--n) * 100%) calc(var(--i) / var(--n) * 100%) }
@keyframes word animates color
```

### [100% Pure CSS Dice](https://codepen.io/editor/surahotoke/pen/019e1714-ac25-75e1-af24-fc88239d483b)

made with: scroll-driven animation (animation-timeline) · scroll() timeline · scroll-snap · @starting-style · @keyframes · transition · 3D (perspective / preserve-3d)

```css
body { animation: sibling-init var(--init-duration) steps(var(--n), jump-start) both, decode-x linear, decode-y linear; animation-timeline: auto, scroll(self x), scroll(self); scroll-snap-type: both mandatory }
::scroll-marker-group { position: absolute; perspective: 800px; perspective-origin: right top }
::column { scroll-snap-align: center; animation: sibling-init var(--init-duration) linear reverse --loaded(paused, running) }
::column::scroll-marker { position: absolute; box-shadow: inset 0 0 0 3px black }
::column::scroll-marker { transform: --role(face, rotateY(calc(var(--decode-x) * -1turn)) rotateX(calc(var(--decode-y) * 1turn)) if( style(--class: xp): translateX(calc(var(--face-size) / 2)) rotateY(90deg) }
@keyframes sibling-init animates --_sibling-i
@keyframes decode-x animates --_decode-x
@keyframes decode-y animates --_decode-y
```

### [The Tale of the Three Brothers](https://codepen.io/emilio-dominguez/pen/ByzMoZK)

on scroll: span.word: transform+opacity+top ×6 | on hover of a.: span.word: transform+opacity+top ×15, div.river-water: transform+opacity+top ×2, div.scene-title-content: transform+opacity+top, div.scroll-dot: transform+opacity+shadow+top | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · :hover · clip-path · mask · mix-blend-mode

```css
body::before { position: fixed; inset: 0; mix-blend-mode: overlay }
.highlight { -webkit-animation: text-shimmer 4s ease-in-out infinite; animation: text-shimmer 4s ease-in-out infinite }
0% { background-position: 100% 0 }
100% { background-position: -100% 0 }
0% { background-position: 100% 0 }
100% { background-position: -100% 0 }
.vignette { position: absolute; inset: 0 }
.scene { position: relative }
.scene::before, .scene::after { position: absolute }
.scene::before { top: 0 }
.scene::after { bottom: 0 }
.scene-title-content { position: relative; -webkit-animation: title-scroll-out linear both; animation: title-scroll-out linear both; animation-timeline: view(); animation-range: exit 0% exit 60% }
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

### [Corner-Shape Gallery: 4 Scroll-Driven Variations (Responsive + Fallbacks)](https://codepen.io/fyildiz1974/pen/azZWxGj)

held: fixed div.hud, fixed div.progress, fixed main.stage | on scroll: div.card: transform+top ×2, div.card: shadow | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · prefers-reduced-motion · mask · backdrop-filter · mix-blend-mode

```css
.hud { position: fixed; inset: calc(env(safe-area-inset-top) + 10px) 10px auto 10px }
.progress { position: fixed; inset: auto 0 calc(env(safe-area-inset-bottom) + 0px) 0 }
.progress::before { transform: scaleX(0.15); opacity: 0.85; animation: progress-time 6s linear infinite alternate }
from { transform: scaleX(0.1) }
to { transform: scaleX(1) }
.stage { position: fixed; inset: 0 }
.panel { position: relative }
.panel::before { position: absolute; inset: 0; opacity: 0.55 }
.card { position: relative; transform: translateZ(0); will-change: transform }
.label { position: absolute; top: 12px }
.label .kicker { text-transform: uppercase; opacity: 0.72 }
.glyph { mix-blend-mode: screen }
```

### [Interactive Image Carousel Wheel with Smooth Scroll & Modal Gallery / RESPONSIVE](https://codepen.io/ol-ivier/pen/myPqoNN)

held: fixed div.wheel-container, fixed div.modal, fixed div.scroll-indicator | on scroll: div.item: transform+top ×12, div.wheel: transform+top | on hover of button.close-btn: div.item: transform+top ×12, div.wheel: transform+top | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · Lenis / smooth scroll · scroll listener · requestAnimationFrame

```css
.wheel-section { position: relative }
.wheel-container { position: fixed; top: 50%; transform: translateY(-50%) }
.wheel { position: relative; transition: transform 0.1s ease-out }
.item { position: absolute; background-position: center; box-shadow: 0 0 20px rgba(0,0,0,0.6); top: 50%; margin-top: -60px; transform: rotate(var(--az)) translate(400px); transition: all 0.3s ease }
.item-content { opacity: 0; transition: opacity 0.3s ease; transform: none !important }
.item:hover .item-content { opacity: 1 }
.item-title { margin-bottom: 8px }
h1 { margin-bottom: 30px }
p { margin-bottom: 25px }
.scroll-indicator { position: fixed; bottom: 30px }
.scroll-indicator::after { animation: bounce 2s infinite }
0%, 20%, 50%, 80%, 100% { transform: translateY(0) }
```

```js
addEventListener("mouseenter", function() {
addEventListener("mouseleave", function() {
addEventListener("scroll", function() {
requestAnimationFrame(raf)
```

### [Interactive Image Carousel Wheel with Smooth Scroll & Modal Gallery](https://codepen.io/ol-ivier/pen/yyOPZMw)

held: fixed div.wheel-container, fixed div.modal, fixed button.close-btn, fixed div.scroll-indicator, fixed div.copy | on scroll: div.item: transform+top ×12, div.wheel: transform+top | on hover of button.close-btn: div.item: transform+top ×12, div.wheel: transform+top | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · Lenis / smooth scroll · scroll listener · requestAnimationFrame

```css
.wheel-section { position: relative }
.wheel-container { position: fixed; top: 50%; transform: translateY(-50%) }
.wheel { position: relative; transition: transform 0.1s ease-out }
.item { position: absolute; background-position: center; box-shadow: 0 0 20px rgba(0,0,0,0.6); top: 50%; margin-top: -60px; transform: rotate(var(--az)) translate(400px); transition: all 0.3s ease }
.item-content { opacity: 0; transition: opacity 0.3s ease; transform: none !important }
.item:hover .item-content { opacity: 1 }
.item-title { margin-bottom: 8px }
h1 { margin-bottom: 30px }
p { margin-bottom: 25px }
.scroll-indicator { position: fixed; bottom: 30px }
.scroll-indicator::after { animation: bounce 2s infinite }
0%, 20%, 50%, 80%, 100% { transform: translateY(0) }
```

```js
addEventListener("mouseenter", function() {
addEventListener("mouseleave", function() {
addEventListener("scroll", function() {
requestAnimationFrame(raf)
```

### [Stretchy text experiment](https://codepen.io/yel_un/pen/PwqBMeO)

on scroll: h1.: transform+top | made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes

```css
h1 { transform: scale(1, var(--scaleY)); transform-origin: bottom; animation: scaled both; animation-timeline: view(); animation-range: cover 0% contain 90% }
section:nth-of-type(3) h1 { transform-origin: top; animation-range: contain 40% contain 90% }
section:nth-of-type(4) h1 { transform: scale(1, var(--scaleYReverse)); transform-origin: top; animation: scaledReverse both; animation-timeline: view(); animation-range: contain 50% contain 100% }
body { background-position: -9rem -2rem }
@keyframes scaled animates --scaleY
@keyframes scaledReverse animates --scaleYReverse
```

### [Scroll driven animation - horizontal scroll](https://codepen.io/yel_un/pen/xbxYEXB)

held: sticky div | made with: position: sticky · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes

```css
div { position: sticky; top: 0; margin-top: 5rem; view-timeline-name: --scroller; view-timeline-axis: block }
ul { animation: scrolled forwards linear; animation-timeline: --scroller; animation-range: contain }
0% { transform: translateX(0%) }
100% { transform: translateX(calc((-100% + 100vw) - 3rem)) }
@keyframes scrolled animates transform
```

### [Scroll-driven animated card stack with scroll snap events (Vanilla)](https://codepen.io/bramus/pen/xxvgzoL)

made with: scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · scroll-snap · @keyframes · transition · :has() · 3D (perspective / preserve-3d) · IntersectionObserver · scroll listener

```css
.scroller { scroll-timeline: --scroll-timeline x }
body, .card::before { animation: background-colors linear both; animation-timeline: --scroll-timeline }
&:nth-child(1) { view-timeline: --si-1 x }
&:nth-child(2) { view-timeline: --si-2 x }
&:nth-child(3) { view-timeline: --si-3 x }
&:nth-child(4) { view-timeline: --si-4 x }
&:nth-child(5) { view-timeline: --si-5 x }
0% { opacity: 0.1111111111 }
25% { opacity: 0.3333333333 }
50% { opacity: 1 }
75% { opacity: 0.3333333333 }
100% { opacity: 0.1111111111 }
```

```js
new IntersectionObserver((entries, showOnScroll) => {
```

### [Untitled](https://codepen.io/Sansheel-Mitha/pen/NWZJaOY)

on scroll: div.box: opacity+top | made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · prefers-reduced-motion · container queries

```css
.try { --hover-offset: 5% }
:root { --hover-offset: 0 }
.intro span:first-child { transform-origin: right bottom; -webkit-animation: wave 250ms 1s ease 3; animation: wave 250ms 1s ease 3 }
.intro span:last-child { -webkit-animation: hover 500ms linear infinite; animation: hover 500ms linear infinite }
.box { -webkit-animation: trigger steps(1) both, fade linear both; animation: trigger steps(1) both, fade linear both; animation-timeline: view(); animation-range: entry 80% contain 40% }
.text { -webkit-animation: pop-back 300ms var(--ease-bounce-out) forwards; animation: pop-back 300ms var(--ease-bounce-out) forwards }
.text { -webkit-animation: pop 600ms var(--ease-elastic) forwards, text-gradient 1s cubic-bezier(0, 0.55, 0.45, 1) forwards; animation: pop 600ms var(--ease-elastic) forwards, text-gradient 1s cubic-bezier(0, 0.55, 0.45, 1) forw }
.smile div { -webkit-animation: wink 1s steps(1) infinite; animation: wink 1s steps(1) infinite }
from { opacity: 0 }
to { opacity: 1 }
from { opacity: 0 }
to { opacity: 1 }
```

### [Untitled](https://codepen.io/Sansheel-Mitha/pen/JjQzrmo)

on scroll: div.box: opacity+top ×2, p.text: color+top | made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · prefers-reduced-motion · container queries

```css
:root { --hover-offset: 5% }
:root { --hover-offset: 0 }
.intro span:first-child { transform-origin: right bottom; -webkit-animation: wave 250ms 1s ease 3; animation: wave 250ms 1s ease 3 }
.intro span:last-child { -webkit-animation: hover 500ms linear infinite; animation: hover 500ms linear infinite }
.box { -webkit-animation: trigger steps(1) both, fade linear both; animation: trigger steps(1) both, fade linear both; animation-timeline: view(); animation-range: entry 80% contain 40% }
.text { -webkit-animation: pop-back 300ms var(--ease-bounce-out) forwards; animation: pop-back 300ms var(--ease-bounce-out) forwards }
.text { -webkit-animation: pop 600ms var(--ease-elastic) forwards, text-gradient 1s cubic-bezier(0, 0.55, 0.45, 1) forwards; animation: pop 600ms var(--ease-elastic) forwards, text-gradient 1s cubic-bezier(0, 0.55, 0.45, 1) forw }
.smile div { -webkit-animation: wink 1s steps(1) infinite; animation: wink 1s steps(1) infinite }
from { opacity: 0 }
to { opacity: 1 }
from { opacity: 0 }
to { opacity: 1 }
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

### [Sticky Slider CTA Cards with Scroll-Driven Animations & Container Queries – Open Props](https://codepen.io/mobalti/pen/xxopyQO)

made with: position: sticky · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · scroll-snap · @keyframes · container queries

```css
supports not (-moz-appearance: none) { position: sticky }
.pagination { position: absolute }
.slider { scroll-timeline-axis: --inline; scroll-timeline-name: --slider }
.marker { animation-name: highlight-dot; animation-timeline: --slider; opacity: 0.3 }
.marker-1 { animation-range-end: 100cqi }
.marker-2 { animation-range: 100cqi 200cqi }
.marker-3 { animation-range: 200cqi 300cqi }
0%, 100% { opacity: 0.9 }
.control-button { animation-fill-mode: forwards; animation-timeline: --slider }
.next { animation-name: hideOnScrollEnd }
.prev { animation-name: hideOnScrollStart }
@keyframes highlight-dot animates opacity
```

### [Horizontal scroller with scroll-driven animation + scroll snap](https://codepen.io/hexagoncircle/pen/MWMKPZJ)

made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · scroll-snap · @keyframes

```css
.wrapper { -ms-scroll-snap-type: x mandatory; scroll-snap-type: x mandatory }
> * { scroll-snap-align: center }
.items > * { --scale: 0.9; --offset: var(--gap); -webkit-animation: scale linear both, fade linear both; animation: scale linear both, fade linear both; animation-timeline: view(inline); animation-range: cover 30% cover 70%, cover 5% }
from, to { scale: var(--scale) }
50% { scale: 1 }
from { translate: var(--offset) 0 }
to { translate: calc(var(--offset) * -1) 0 }
from, to { scale: var(--scale) }
50% { scale: 1 }
from { translate: var(--offset) 0 }
to { translate: calc(var(--offset) * -1) 0 }
from, to { opacity: 0 }
```

### [Dynamic Content Lockups V2 - Open Props](https://codepen.io/mobalti/pen/WNBZJdG)

held: fixed nav.navbar, sticky div.video-visual, sticky div.visual | on scroll: div.card: opacity+top ×3, div.video-visual: filter | on hover of a.nav-cta-btn: a.nav-cta-btn: color | made with: position: sticky · position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · :hover · prefers-reduced-motion · mix-blend-mode

```css
&::before { position: absolute; inset: 0; mix-blend-mode: screen }
&::before { mix-blend-mode: normal }
.video { position: relative }
.video-visual { position: sticky; filter: hue-rotate(210deg) }
.card { scale: 0.4 }
.card-1 { scale: 1 }
.card-2 { translate: -35cqi 30cqb; opacity: 0.3 }
.card-3 { translate: 0cqi 50cqb; opacity: 0.5 }
.card-4 { translate: 45cqi 40cqb; opacity: 0.5 }
.section { view-timeline-name: --section }
.content-1 { view-timeline-name: --content-1 }
.content-2 { view-timeline-name: --content-2 }
```

### [Open Props - Recommendation Carousel (Scroll-Driven Animations)](https://codepen.io/mobalti/pen/poYmvqj)

on scroll: button.ControlsBtn: opacity ×2 | made with: scroll-driven animation (animation-timeline) · scroll() timeline · scroll-snap · @keyframes · transition · :hover

```css
.RemoveBtn { position: absolute; scale: 0.8 }
&:hover { scale: 1.07 }
&:active { scale: 1.03 }
.ControlsBtn { opacity: 1 }
.Scroller { scroll-timeline: --carousel inline }
.next { animation: auto next ease forwards; animation-timeline: --carousel }
.previous { animation: auto prev ease forwards; animation-timeline: --carousel }
@keyframes prev animates visibility
@keyframes next animates visibility
```

### [Open Props - Recommendation Carousel (Scroll-Driven Animations)](https://codepen.io/mobalti/pen/jOJoEXE)

made with: scroll-driven animation (animation-timeline) · scroll() timeline · scroll-snap · @keyframes · transition · :hover

```css
.RemoveBtn { position: absolute; scale: 0.8 }
&:hover { scale: 1.07 }
&:active { scale: 1.03 }
.ControlsBtn { opacity: 1 }
.Scroller { scroll-timeline: --carousel inline }
.ControlsBtn { animation-timing-function: linear; animation-fill-mode: forwards; animation-timeline: --carousel }
.next { animation-name: next }
.previous { animation-name: preview }
@keyframes preview animates visibility
@keyframes next animates visibility
```

### [Scroll animation test](https://codepen.io/brian-pob/pen/ZEPVjgL)

made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes

```css
to { scale: 2.5; rotate: 360deg }
to { scale: 2.5; rotate: 360deg }
p { -webkit-animation: scroll-in linear forwards; animation: scroll-in linear forwards; animation-range-start: cover 30vh; animation-range-end: contain 70vh; animation-timeline: view() }
@keyframes scroll-in animates scale, rotate
```

### [CSS scroll-triggered animations with style queries](https://codepen.io/hexagoncircle/pen/wvOPmGO)

on scroll: div.box: opacity+top | made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · prefers-reduced-motion · container queries

```css
:root { --hover-offset: 5% }
:root { --hover-offset: 0 }
.intro span:first-child { transform-origin: right bottom; -webkit-animation: wave 250ms 1s ease 3; animation: wave 250ms 1s ease 3 }
.intro span:last-child { -webkit-animation: hover 500ms linear infinite; animation: hover 500ms linear infinite }
.box { -webkit-animation: trigger steps(1) both, fade linear both; animation: trigger steps(1) both, fade linear both; animation-timeline: view(); animation-range: entry 80% contain 40% }
.text { -webkit-animation: pop-back 300ms var(--ease-bounce-out) forwards; animation: pop-back 300ms var(--ease-bounce-out) forwards }
.text { -webkit-animation: pop 600ms var(--ease-elastic) forwards, text-gradient 1s cubic-bezier(0, 0.55, 0.45, 1) forwards; animation: pop 600ms var(--ease-elastic) forwards, text-gradient 1s cubic-bezier(0, 0.55, 0.45, 1) forw }
.smile div { -webkit-animation: wink 1s steps(1) infinite; animation: wink 1s steps(1) infinite }
from { opacity: 0 }
to { opacity: 1 }
from { opacity: 0 }
to { opacity: 1 }
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

### [CSS Scroll Driven Animations](https://codepen.io/giancarlosgza/pen/MWzxgXV)

made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · clip-path

```css
from { opacity: 0; clip-path: inset(45% 20% 45% 20%) }
to { opacity: 1; clip-path: inset(0% 0% 0% 0%) }
from { opacity: 0; translate: -15rem 0 }
to { opacity: 1; translate: 0 }
&.img-reveal { animation: linear scrollReveal both; animation-timeline: --revealing-image }
&.img-fade { animation: linear fadeInRight both; animation-timeline: --revealing-image }
:is(h1, h2, p, li) { margin-top: 0; margin-bottom: 0.5rem }
h1 { margin-bottom: 1.5rem }
.mt-3 { margin-top: 1rem }
@keyframes scrollReveal animates opacity, clip-path
@keyframes fadeInRight animates opacity, translate
```

### [(Ab)using Scroll-Driven Animations to fake Scroll-Snapping :snapped](https://codepen.io/bramus/pen/zYMoNvg)

made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · scroll-snap · @keyframes · :hover · :has()

```css
[data-snap-align] { scroll-snap-type: x mandatory }
[data-snap-align] > * { animation: snapped steps(1, start); animation-timeline: view(inline) }
[data-snap-align="start"] > * { scroll-snap-align: start; animation-range: exit -1px exit 1px }
[data-snap-align="center"] > * { scroll-snap-align: center; animation-range: cover calc(50% - 1px) cover calc(50% + 1px) }
[data-snap-align="end"] > * { scroll-snap-align: end; animation-range: entry calc(100% - 1px) entry calc(100% + 1px) }
h2 { margin-top: 2em }
footer { margin-top: 4em }
:is( .warning:hover, .warning:has(:focus-within) ) { opacity: 1 }
.warning > :first-child { margin-top: 0 }
.warning > :last-child { margin-bottom: 0 }
@keyframes snapped animates background, font-size
```
