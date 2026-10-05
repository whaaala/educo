# CodePen · clip-path — how each pen does it

633 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/clip-path.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| clip-path | 611 |
| transition | 268 |
| :hover | 244 |
| @keyframes | 151 |
| position: fixed | 81 |
| custom properties driven by JS | 47 |
| pointer / mouse tracking | 35 |
| mix-blend-mode | 32 |
| GSAP | 29 |
| 3D (perspective / preserve-3d) | 26 |
| backdrop-filter | 22 |
| mask | 21 |
| requestAnimationFrame | 18 |
| scroll listener | 14 |
| :focus-visible | 11 |
| prefers-reduced-motion | 9 |
| :has() | 9 |
| scroll-snap | 8 |
| position: sticky | 5 |
| ScrollTrigger | 4 |
| scroll-driven animation (animation-timeline) | 4 |
| view() timeline | 4 |
| scroll() timeline | 4 |
| IntersectionObserver | 4 |
| Lenis / smooth scroll | 3 |
| animation-range | 3 |
| (hover: hover) gate | 3 |
| Web Animations API (.animate) | 3 |
| canvas 2D | 2 |
| container queries | 1 |
| @starting-style | 1 |
| anime.js | 1 |

## Every pen

### [POLYCLIP - Visual CSS clip-path Studio with Draggable Vertices & Code Export](https://codepen.io/Wendy-Ho/pen/ByWWrOw)

on hover of button.btn: i.: transform+top, button.btn: transform | made with: @keyframes · transition · :hover · :focus-visible · clip-path · backdrop-filter · pointer / mouse tracking

```css
.mark { box-shadow:0 8px 28px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.08) }
.mark i { clip-path:polygon(50% 0,100% 28%,82% 100%,18% 100%,0 28%); animation:spinmark 9s ease-in-out infinite }
0%,100% { transform:rotate(0) scale(1) }
50% { transform:rotate(180deg) scale(.86) }
.btn { transition:.18s ease }
.btn:hover { transform:translateY(-1px) }
.btn:active { transform:translateY(0) }
.card { backdrop-filter:blur(8px); box-shadow:0 18px 44px rgba(0,0,0,.34) }
.card-head { margin-bottom:14px }
.card-head h2 { text-transform:uppercase }
.seg.full { margin-bottom:14px }
.seg button { transition:.16s ease }
```

```js
addEventListener('pointermove', ev => {
```

### [16-Bit Sci-Fi Character Menu](https://codepen.io/editor/ErycTheGreat/pen/01a0a026-9bd4-76c2-98e4-aaa0aff16041)

on scroll: p.options-header: opacity, span.blinking-arrow: opacity | on hover of img.avatar: p.options-header: opacity | made with: @keyframes · transition · :hover · clip-path · backdrop-filter · mix-blend-mode

```css
.dialog-box { clip-path: polygon( 2vw 0, calc(100% - 2vw) 0, 100% 2vw, 100% calc(100% - 2vw), calc(100% - 2vw) 100%, 2vw 100%, 0 calc(100% - 2vw), 0 2vw ); box-shadow: inset 0 0 1px rgba(0,187,169,0.15), 0 0 25px rgba(0,187,169,0.15) }
.dialog-box::after { position:absolute; inset:0; opacity:0.5 }
.dialog-box::before { position:absolute; inset:0; mix-blend-mode:screen }
.avatar-frame { position: relative; clip-path: polygon(99% 99%, 15% 99%, 1% 99%, 1% 87%, 1% 9%, 9% 1%, 99% 1%) }
.avatar-inner { position: relative; backdrop-filter: none; -webkit-backdrop-filter: none; clip-path: polygon( 94% 59%, 98% 65%, 98% 87%, 94% 92%, 94% 96%, 90% 96%, 88% 98%, 86% 98%, 84% 96%, 50% 96%, 43% 90%, 41% 92%, 21% 92%, 15% 99%,  }
.inner-glow-border { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.inner-glow-border polygon { filter: drop-shadow(0 0 3px #00bba9) }
.gap-fill { position: absolute; inset: 0 }
.avatar { opacity:0.4; transition: opacity 0.4s ease; filter: blur(6px) contrast(1.2) brightness(1.2); transition: opacity 0.4s ease, filter 0.6s ease }
.avatar.loaded { opacity:1; filter:none }
.options-header { margin-top:2.5vw; margin-bottom: 3vw; animation: crtFlicker 0.035s infinite }
0% { opacity: 1 }
```

```js
addEventListener("mouseenter", () => {
```

### [Non-rectangular shape with border and rounded corners](https://codepen.io/thebabydino/pen/gbmwXmz)

held: fixed svg.[object | made with: position: fixed · clip-path · mask

```css
article { filter: drop-shadow(2px 2px 5px #000c) }
img { clip-path: polygon(0 0, 100% 0, 100% 100%, var(--dx) 100%) }
.clip-path-shape .rounded-border[aria-hidden=true]::before { clip-path: shape(from 0 var(--r), arc to var(--r) 0 of var(--r) cw, hline to var(--ox0), arc by var(--dx0) var(--dy0) of var(--r) cw, line to var(--x1) var(--y1), arc to var(--ox1) 100% of var(--r) cw, hline to var(--r), }
.svg-filter .rounded-border[aria-hidden=true] { filter: url(#border) }
.svg-filter .rounded-border[aria-hidden=true]::before { clip-path: polygon(0 0, calc(100% - var(--dx)) 0, 100% 100%, 0 100%) }
.transform .rounded-border[aria-hidden=true]::after { transform: skewX(calc(90deg - var(--a))) scalex(calc(1/sin(var(--a)))) }
.angled section { mask: linear-gradient(0deg, #0000 var(--s), red calc(2*var(--s))) }
.angled section h3 ~ * { padding-top: var(--s) }
svg[height="0"][aria-hidden=true] { position: fixed }
```

### [Papercut Dive](https://codepen.io/Liorgin/pen/ByWNmXw)

held: sticky div.stage | on scroll: g.[object: transform+top ×5, section.beat: opacity+clip-path ×2, div.col: transform+top ×2, div.chrome: clip-path ×2, div.cue: opacity ×2, span.bar: transform+top ×2 | on hover of a.btn: g.[object: transform+top ×5, section.beat: opacity+clip-path ×2, div.col: transform+top ×2, div.chrome: clip-path ×2, div.cue: opacity ×2, span.bar: transform+top ×2 | made with: position: sticky · position: fixed · @keyframes · transition · :hover · :focus-visible · prefers-reduced-motion · clip-path · custom properties driven by JS · Lenis / smooth scroll · requestAnimationFrame

```css
body { transition: background-color .5s ease }
:focus-visible { outline-offset: 4px }
.chrome { position: absolute; inset: 0 }
.topbar { position: absolute; inset: 0 0 auto 0; transition: color .5s ease }
.brand { text-transform: uppercase }
.brand i { transition: color .5s ease }
.topbar nav a { transition: color .5s ease, opacity .2s }
.rail { position: absolute; top: 50%; transform: translateY(-50%); transition: color .5s ease }
.rail .tick { opacity: .22; transition: opacity .35s ease, width .35s cubic-bezier(.22, 1, .36, 1) }
.rail .tick.on { opacity: 1 }
.rail .depth { margin-top: 6px; transition: color .5s ease }
.cue { position: absolute; bottom: clamp(20px, 3vw, 34px); transform: translateX(-50%); text-transform: uppercase; transition: color .5s ease }
```

```js
style.setProperty('--ink', INK[i])
style.setProperty('--dim', DIM[i])
style.setProperty('--edge', PALETTE[i])
style.setProperty('--fx', (FX / W * 100).toFixed(2) + '%')
style.setProperty('--fy', (FY / H * 100).toFixed(2) + '%')
style.setProperty('--edge', PALETTE[k])
style.setProperty('--ink', INK[j])
style.setProperty('--dim', DIM[j])
```

### [Wave header](https://codepen.io/thebabydino/pen/YPZzmZE)

made with: transition · :hover · clip-path

```css
&, &::before, &::after { clip-path: shape( from 100% var(--o, 0), hline to 0, vline to calc(100% - var(--hw)), curve by 21.5% var(--c0y) with 13% var(--c0y) , curve by var(--c1ex) var(--c1ey) with var(--c1c0x) 0 / var(--c1c1x) var(--c1ey) , curv }
&::before, &::after { position: absolute; inset: 0 }
&::before { filter: url(#smoo) }
> * { position: relative }
a { transition: .3s }
&::before { filter: sepia(1) hue-rotate(150deg) saturate(2.5) brightness(1.5) }
span { text-transform: uppercase }
h1 { text-transform: capitalize }
img { translate: 0 var(--hw); scale: -1 1 }
```

### [sticky image effect (clip-path version)](https://codepen.io/editor/vii120/pen/019ff1e2-2758-71e9-8c29-54a22f6773e5)

on scroll: img.: clip-path+top | made with: GSAP · ScrollTrigger

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

### [Untitled](https://codepen.io/Wendy-Ho/pen/WbRWRKG)

made with: transition · :hover · clip-path · backdrop-filter · custom properties driven by JS · pointer / mouse tracking

```css
.mark { box-shadow:0 10px 30px -10px rgba(124,92,255,.75) }
.mark span { clip-path:polygon(50% 0%,100% 38%,82% 100%,18% 100%,0% 38%) }
.brand-txt p { margin-top:2px }
.modes { backdrop-filter:blur(8px) }
.mode { transition:.18s }
.mode.is-on { box-shadow:0 6px 18px -8px rgba(124,92,255,.9) }
.panel { backdrop-filter:blur(10px) }
.panel-head { border-bottom:1px solid var(--line) }
.panel-head h2 { text-transform:uppercase }
.chip { transition:.16s }
.chip:hover { transform:translateY(-1px) }
.chip.primary:hover { box-shadow:0 8px 22px -10px rgba(124,92,255,1) }
```

```js
style.setProperty('--p', ((v - lo) / (hi - lo)) * 100 + '%')
addEventListener('pointermove', function (ev) {
```

### [Molly tea - pure CSS logo](https://codepen.io/editor/merrybottle/pen/019f93de-5ff2-78ab-a80d-f963019dd259)

made with: clip-path

```css
&::after { transform: scale(1.5) }
```

### [Cut Text Effect (CSS only)](https://codepen.io/ol-ivier/pen/yygxVXE)

made with: clip-path

```css
.container { position: relative }
.text-slice { text-transform: uppercase; position: absolute }
.top { clip-path: polygon(0 0, 100% 0, 100% 46%, 0 54%); transform: translate(4px, -6px) }
.bottom { clip-path: polygon(0 54%, 100% 46%, 100% 100%, 0 100%); transform: translate(14px, 6px) }
.container::after { position: absolute; top: 50.2%; transform: translateY(-50%) rotate(-1.9deg); opacity: 0.95 }
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

### [Pure CSS Fade-Sequence Loader Spinner #5](https://codepen.io/editor/hsuoisfz-the-flexboxer/pen/019f449a-9321-7bf2-b86f-e53a2e24fe9c)

on scroll: div.: opacity+top ×12 | made with: @keyframes · clip-path

```css
:root { --scale:1 }
.spinner { position: relative; transform: scale( var(--scale)) }
.spinner { transform: scale(0.8) }
.spinner div { position: absolute; opacity: 0; animation: fade-sequence 1.2s linear infinite; will-change: opacity }
.spinner div::after, .spinner div::before { position: absolute; top: 0 }
0% { opacity: 1 }
100% { opacity: 0 }
.spinner div:nth-child(1) { transform: rotate(0deg); animation-delay: 0s }
.spinner div:nth-child(2) { transform: rotate(30deg); animation-delay: 0.1s }
.spinner div:nth-child(3) { transform: rotate(60deg); animation-delay: 0.2s }
.spinner div:nth-child(4) { transform: rotate(90deg); animation-delay: 0.3s }
.spinner div:nth-child(5) { transform: rotate(120deg); animation-delay: 0.4s }
```

### [Pure CSS Fade-Sequence Loader Spinner #4](https://codepen.io/editor/hsuoisfz-the-flexboxer/pen/019f4497-f1d7-7bc4-a34b-81bf947b6d7d)

on scroll: div.: opacity+top ×12 | made with: @keyframes · clip-path

```css
:root { --scale:1 }
.spinner { position: relative; transform: scale( var(--scale)) }
.spinner { transform: scale(0.8) }
.spinner div { position: absolute; opacity: 0; animation: fade-sequence 1.2s linear infinite; will-change: opacity }
.spinner div::after, .spinner div::before { position: absolute; top: 0 }
0% { opacity: 1 }
100% { opacity: 0 }
.spinner div:nth-child(1) { transform: rotate(0deg); animation-delay: 0s }
.spinner div:nth-child(2) { transform: rotate(30deg); animation-delay: 0.1s }
.spinner div:nth-child(3) { transform: rotate(60deg); animation-delay: 0.2s }
.spinner div:nth-child(4) { transform: rotate(90deg); animation-delay: 0.3s }
.spinner div:nth-child(5) { transform: rotate(120deg); animation-delay: 0.4s }
```

### [Pure CSS Fade-Sequence Loader Spinner #3](https://codepen.io/editor/hsuoisfz-the-flexboxer/pen/019f4492-3939-7b43-9079-0b6c127ed3c6)

on scroll: div.: opacity+top ×12 | made with: @keyframes · clip-path

```css
:root { --scale:1 }
.spinner { position: relative; transform: scale( var(--scale)) }
.spinner { transform: scale(0.8) }
.spinner div { position: absolute; opacity: 0; animation: fade-sequence 1.2s linear infinite; will-change: opacity }
.spinner div::after, .spinner div::before { position: absolute; top: 0 }
0% { opacity: 1 }
100% { opacity: 0 }
.spinner div:nth-child(1) { transform: rotate(0deg); animation-delay: 0s }
.spinner div:nth-child(2) { transform: rotate(30deg); animation-delay: 0.1s }
.spinner div:nth-child(3) { transform: rotate(60deg); animation-delay: 0.2s }
.spinner div:nth-child(4) { transform: rotate(90deg); animation-delay: 0.3s }
.spinner div:nth-child(5) { transform: rotate(120deg); animation-delay: 0.4s }
```

### [Pure CSS Fade-Sequence Loader Spinner #2](https://codepen.io/editor/hsuoisfz-the-flexboxer/pen/019f3915-d024-7c4c-874e-b1f19ae9d4e6)

on scroll: div.: opacity+top ×12 | made with: @keyframes · clip-path

```css
:root { --scale:1 }
.spinner { position: relative; transform: scale( var(--scale)) }
.spinner { transform: scale(0.8) }
.spinner div { position: absolute; opacity: 0; animation: fade-sequence 1.2s linear infinite; will-change: opacity }
.spinner div::after, .spinner div::before { position: absolute; top: 0 }
0% { opacity: 1 }
100% { opacity: 0 }
.spinner div:nth-child(1) { transform: rotate(0deg); animation-delay: 0s }
.spinner div:nth-child(2) { transform: rotate(30deg); animation-delay: 0.1s }
.spinner div:nth-child(3) { transform: rotate(60deg); animation-delay: 0.2s }
.spinner div:nth-child(4) { transform: rotate(90deg); animation-delay: 0.3s }
.spinner div:nth-child(5) { transform: rotate(120deg); animation-delay: 0.4s }
```

### [Premium Hero Section | Liquid Vector Morphing & CSS Grid](https://codepen.io/editor/hsuoisfz-the-flexboxer/pen/019f0557-313e-7eb8-8c83-dbf076428abd)

on scroll: img.active: opacity, article.active: opacity, button.: background, button.active: background | made with: @keyframes · transition · :hover · clip-path

```css
.hero .hero_noticia .hero_nav_buttons { position: relative }
.hero .hero_noticia .hero_nav_buttons button { transition: 0.3s ease; text-transform: uppercase }
.hero_noticia img { object-position: center }
.hero_noticia article { position: relative }
.btn-hex { transition: transform 0.3s ease, filter 0.3s ease; position: relative }
.btn-hex::after { position: absolute; top: 0; clip-path: path("M15 0 Q155 0 155 0 85 20 15 0 15 50 15 50 85 30 155 50 15 50 15 50 15 0 15 0"); transition: 0.3s ease }
.btn-hex:hover::after { clip-path: path("M15 0 Q155 0 155 0 85 10 15 0 15 50 15 50 85 40 155 50 15 50 15 50 15 0 15 0") }
.btn-blue { filter: drop-shadow(0 4px 6px rgba(100, 149, 237, 0.2)) }
.hero_noticia article .buttons button { transform: scale(0.9) }
from { opacity: 0 }
to { opacity: 1 }
.hero_noticia img.active, .hero_noticia article.active { animation: fadeIn 0.6s ease-in-out }
```

### [Neon Shatter Button Effect | Modern CSS Clip-Path](https://codepen.io/respectforcreators/pen/LExxQWL)

on hover of button.rfc-btn-shatter: span.: transform+top ×4, span.rfc-btn-text: transform+color | made with: transition · :hover · clip-path

```css
.rfc-btn-shatter { position: relative; transition: border-color 0.3s }
.rfc-btn-text { position: relative; transition: transform 0.3s ease, color 0.3s ease }
.rfc-shards span { position: absolute; inset: 0; transition: transform 0.4s cubic-bezier(0.7, 0, 0.3, 1); transform: scaleY(0) }
.rfc-shards span:nth-child(1) { clip-path: polygon(0 0, 30% 0, 10% 100%, 0% 100%) }
.rfc-shards span:nth-child(2) { clip-path: polygon(30% 0, 60% 0, 40% 100%, 10% 100%) }
.rfc-shards span:nth-child(3) { clip-path: polygon(60% 0, 100% 0, 80% 100%, 40% 100%) }
.rfc-shards span:nth-child(4) { clip-path: polygon(100% 0, 100% 100%, 80% 100%) }
.rfc-btn-shatter:hover .rfc-btn-text { transform: scale(1.05) }
.rfc-btn-shatter:hover .rfc-shards span { transform: scaleY(1) }
```

### [CSS Only Beach Waves 🌊](https://codepen.io/NiklasKnaack/pen/EaZNoKq)

held: fixed a.nk | on scroll: i.: transform+opacity+top ×39, div.wave: transform+opacity+clip-path ×4, i.: transform+opacity | on hover of a.nk: i.: transform+opacity+top ×38, div.wave: transform+opacity+clip-path ×4, i.: transform+opacity ×2 | made with: position: fixed · @keyframes · transition · :hover · clip-path · mask · backdrop-filter

```css
.beach { position: relative }
.beach .wave { --_shape-offset: shape( from var( --_shape-line-p-x ) var( --_shape-line-p-y ), curve to var( --_shape-curve-p-x ) var( --_shape-curve-p-y ) with var( --_shape-curve-c-x ) var( --_shape-curve-c-y ) from origin, smooth to }
.beach .wave i { position: absolute; offset-path: var(--_shape-offset); offset-distance: calc(var(--_offset-distance-min) + (var(--_i) - 1) / (var(--_l) - 1) * (var( --_offset-distance-max) - var(--_offset-distance-min))); will-change: t }
0%, 100% { transform: translateX(0%); opacity: var(--_opacity-min) }
50% { transform: translateX(var(--_center)); opacity: var(--_opacity-max) }
0%, 100% { opacity: 0.25; transform: scale(var(--_spray-scale-min)) }
50% { opacity: 1.00; transform: scale(var(--_spray-scale-max)) }
.nk { --_blur-filter: 3px; position: fixed; bottom: var(--_padding) }
.nk:before, .nk:after { position: absolute; transition: background-color 250ms ease-in-out }
.nk:before { inset: 0; backdrop-filter: blur(var(--_blur-filter)); -webkit-backdrop-filter: blur(var(--_blur-filter)); mask: linear-gradient(#000 0 0), var(--_logo-url) center / var(--_logo-size) auto no-repeat; -webkit-mask: linear- }
.nk:after { inset: calc((100% - var(--_logo-size)) * .5); mask: var(--_logo-url) center / contain no-repeat; -webkit-mask: var(--_logo-url) center / contain no-repeat }
@keyframes beach-wave-shape-animation animates --cp
```

### [Medieval Board](https://codepen.io/editor/andresangelini/pen/015f7e78-6f98-7004-9893-050e11d3f249)

made with: nothing recognised — read the code

### [Before / After Template Slider](https://codepen.io/avathiery/pen/yyVqNgb)

on hover of a.: a.: color | made with: transition · :hover · :focus-visible · clip-path · backdrop-filter · custom properties driven by JS · pointer / mouse tracking

```css
.credit a { border-bottom: 1px solid #d4d4d4; transition: color 0.2s, border-color 0.2s }
.eyebrow { text-transform: uppercase; margin-bottom: 16px }
.header h1 { margin-bottom: 12px }
.compare { position: relative; box-shadow: 0 24px 60px -20px rgba(0,0,0,0.18) }
.layer { position: absolute; inset: 0 }
.layer-before { clip-path: inset(0 calc(100% - var(--pos)) 0 0) }
.handle { position: absolute; top: 0; bottom: 0 }
.handle-line { position: absolute; top: 0; bottom: 0; box-shadow: 0 0 12px rgba(0,0,0,0.25) }
.handle-knob { position: absolute; top: 50%; transform: translate(-50%, -50%); box-shadow: 0 4px 16px rgba(0,0,0,0.15); transition: transform 0.2s }
.handle-knob:hover, .handle-knob:focus-visible { transform: translate(-50%, -50%) scale(1.08) }
.handle-knob:focus-visible { box-shadow: 0 4px 16px rgba(0,0,0,0.15), 0 0 0 3px rgba(10,10,10,0.2) }
.label { position: absolute; top: 16px; text-transform: uppercase; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px) }
```

```js
style.setProperty('--pos', `${pct}%`)
addEventListener('pointermove', onPointerMove)
style.setProperty('--pos', `${next}%`)
```

### [clip-path color scheme](https://codepen.io/brandonkennedy/pen/PwbPWNW)

made with: clip-path

```css
.c-pb { position: relative }
.c-pb + .c-pb { margin-top: var(--pb-spacing) }
.c-pb__content--foreground { bottom: 0; clip-path: polygon(50% 0, 100% 0, 100% 100%, 0 100%, 0 80%); position: absolute; top: 0 }
.c-pb--opt-2 .c-pb__content--foreground { clip-path: polygon(50% 0, 100% 0, 100% 20%, 50% 100%, 0 100%, 0 80%) }
.c-pb--opt-3 .c-pb__content--foreground { clip-path: polygon(80% 0, 100% 0, 100% 20%, 20% 100%, 0 100%, 0 80%) }
.c-pb--opt-3 .c-pb__content--foreground.c-pb__content--foreground-alt { clip-path: polygon(0 0, 20% 0, 100% 80%, 100% 100%, 80% 100%, 0 20%) }
```

### [Understanding clip-path syntax](https://codepen.io/tomhermans/pen/ogYgJqM)

made with: transition · :hover · clip-path

```css
div.demo-wrapper div.demo { clip-path: circle(var(--radius) at var(--cx) calc(var(--cy1) - var(--cy2))); transition: all 0.75s }
div.demo-wrapper div.demo:hover { clip-path: circle(var(--hovradius) at var(--hovcx) calc(var(--hovcy1) - var(--hovcy2))) }
form { margin-bottom: 1rem }
.form-group { margin-bottom: 0.5rem }
```

### [Responsive Inverted Card with CSS clip-path: shape()](https://codepen.io/pixelgridui/pen/WboNzba)

held: fixed div.pp-widget, fixed button.pp-reopen | on hover of div.hero-card: span.pp-reopen-dot: transform+opacity+top | made with: clip-path

```css
.hero-card { position: relative; filter: drop-shadow(10px 10px 0 var(--ink)) drop-shadow(0 28px 48px rgba(26, 21, 16, 0.18)) }
.hero-card::before { position: absolute; inset: 0; clip-path: var(--card-shape) }
.hero-card::after { position: absolute; inset: 1%; clip-path: var(--card-shape) }
.hero-card__content { position: absolute; inset: 1%; clip-path: var(--card-shape) }
.hero-card__cut-glow { position: absolute; top: 15% }
.hero-card__dot { position: absolute; top: 23% }
.hero-card__line { position: absolute }
.hero-card__line.one { top: 33.5% }
.hero-card__line.two { top: 40.1% }
.hero-card__block { position: absolute; top: 59% }
.explainer { box-shadow: 8px 8px 0 var(--ink) }
.explainer__label { margin-bottom: 16px; text-transform: uppercase }
```

### [CSS shape() generator](https://codepen.io/editor/Ceecee-Hart/pen/019db6cd-2d5d-7146-a172-5cef65759fb4)

held: fixed span.label, fixed span.label, fixed h2.visually-hidden, fixed details.list-wrapper, sticky summary | made with: position: sticky · position: fixed · view() timeline · scroll-snap · transition · :hover · :focus-visible · :has() · prefers-reduced-motion · clip-path · custom properties driven by JS · container queries · pointer / mouse tracking

```css
.shape { clip-path: var(--_shape-clip-path) }
& summary { text-transform: uppercase; position: sticky; top: 0 }
&:is([disabled]) { filter: opacity(20%) }
& .btn-action:is(:hover, :focus-visible):not([disabled]) { filter: opacity(100%) }
&::after { clip-path: var(--_preset-preview) }
& > li { scroll-snap-align: center }
& li a { text-underline-offset: 0.2em }
.carousel-wrapper { position: relative }
.carousel-wrapper ul::scroll-marker-group { position: absolute; bottom: 0.5em; transform: translateX(-50%) }
```

```js
style.setProperty( "--_list-wrapper-left",
addEventListener("mousemove", moveDragging)
style.setProperty("--_list-wrapper-left", `${newX}px`)
style.setProperty("--_list-wrapper-top", `${newY}px`)
style.setProperty("--_list-wrapper-right", "auto")
style.setProperty("--_list-wrapper-bottom", "auto")
style.setProperty("--_shape-clip-path", prop)
```

### [Slice It 🍕 — Interactive CSS Pizza · 8 hover-to-pull Slices · Pure CSS clip-path, No JS](https://codepen.io/Ahmod-Musa/pen/qEawzXv)

held: fixed div.js-label, fixed div.stage, fixed footer.footer | on scroll: div.slice: transform+filter+top, p.hint: opacity | on hover of a.fiverr: div.slice: filter, p.hint: opacity | made with: position: fixed · @keyframes · transition · :hover · clip-path · backdrop-filter

```css
body::after { position: fixed; inset: 0; opacity: 0.06 }
body::before { position: fixed; inset: 0 }
.stage { position: fixed; inset: 0 }
.kicker { text-transform: uppercase; margin-bottom: 8px; opacity: 0.9 }
.kicker::before, .kicker::after { opacity: 0.4 }
.headline { position: relative }
.headline::after { position: absolute; top: 52%; transform: rotate(-3deg); opacity: 0.6 }
.sub { text-transform: uppercase; margin-top: 10px }
.pizza-wrap { position: relative }
.pizza-wrap::before { position: absolute; filter: blur(20px); top: 8% }
.pizza { position: relative }
.slice { position: absolute; inset: 0; transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) }
```

### [Modern clip-path with shape() — curves, variables, and animations](https://codepen.io/NewKrok/pen/YPGMLYQ)

on scroll: div.shape: clip-path | on hover of div.card: div.shape: clip-path | made with: @keyframes · transition · :hover · clip-path

```css
.info a { border-bottom: 1px solid rgba(167, 139, 250, 0.3); transition: border-color 0.2s }
.shape-path { clip-path: path('M 100 0 L 200 100 L 100 200 L 0 100 Z') }
.shape-new { clip-path: shape( from 50% 0%, line to 100% 50%, line to 50% 100%, line to 0% 50%, close ) }
.blob { clip-path: shape( from 50% 0%, curve to 100% var(--b1) with 85% 0 / 100% calc(var(--b1) - 20%), curve to var(--b2) 100% with 100% 85% / calc(var(--b2) + 20%) 100%, curve to 0% var(--b3) with 15% 100% / 0 calc(var(--b3) + }
@keyframes blob animates --b1, --b2, --b3
```

### [Name on hover reveal/ Image zoom out & blur](https://codepen.io/Eli-Mu/pen/EagMNRp)

on scroll: img.story__img: transform+filter+top, figcaption.story__caption: transform+opacity+top | made with: transition · :hover · clip-path

```css
.heading-tertiary { text-transform: uppercase; margin-bottom: 2rem }
.story { box-shadow: 0 3rem 6rem rgba(0, 0, 0, 0.1); transform: skewX(-12deg) }
.story__shape { -webkit-clip-path: circle(50% at 50% 50%); clip-path: circle(50% at 50% 50%); transform: translateX(-3rem) skewX(12deg); position: relative }
.story__img { transform: scale(1.4); transition: all 0.5s }
.story__caption { position: absolute; top: 50%; transform: translate(-50%, 20%); text-transform: uppercase; opacity: 0; transition: all 0.5s }
.story__text { transform: skewX(12deg) }
.story:hover .story__caption { opacity: 1; transform: translate(-50%, -50%) }
.story:hover .story__img { transform: scale(1); filter: blur(0.3rem) brightness(80%) }
```

### [marquee menu with pure css](https://codepen.io/vii120/pen/xbEWdQy)

on scroll: div.marquee-inner: transform ×6 | on hover of img.: div.marquee-inner: transform ×6 | made with: @keyframes · transition · :has() · clip-path · mask

```css
.wrapper { position: relative }
.wrapper:has(.item:nth-child(1) input:checked) .marquee-list { clip-path: polygon(0 calc((0) * 100% / var(--total)), 100% calc((0) * 100% / var(--total)), 100% calc(1 * 100% / var(--total)), 0 calc(1 * 100% / var(--total))) }
.wrapper:has(.item:nth-child(2) input:checked) .marquee-list { clip-path: polygon(0 calc((1) * 100% / var(--total)), 100% calc((1) * 100% / var(--total)), 100% calc(2 * 100% / var(--total)), 0 calc(2 * 100% / var(--total))) }
.wrapper:has(.item:nth-child(3) input:checked) .marquee-list { clip-path: polygon(0 calc((2) * 100% / var(--total)), 100% calc((2) * 100% / var(--total)), 100% calc(3 * 100% / var(--total)), 0 calc(3 * 100% / var(--total))) }
.wrapper:has(.item:nth-child(4) input:checked) .marquee-list { clip-path: polygon(0 calc((3) * 100% / var(--total)), 100% calc((3) * 100% / var(--total)), 100% calc(4 * 100% / var(--total)), 0 calc(4 * 100% / var(--total))) }
.wrapper:has(.item:nth-child(5) input:checked) .marquee-list { clip-path: polygon(0 calc((4) * 100% / var(--total)), 100% calc((4) * 100% / var(--total)), 100% calc(5 * 100% / var(--total)), 0 calc(5 * 100% / var(--total))) }
.wrapper:has(.item:nth-child(6) input:checked) .marquee-list { clip-path: polygon(0 calc((5) * 100% / var(--total)), 100% calc((5) * 100% / var(--total)), 100% calc(6 * 100% / var(--total)), 0 calc(6 * 100% / var(--total))) }
.wrapper .item { position: relative }
.wrapper .item:after { position: absolute; inset: 0; border-bottom: 1px solid }
.marquee-list { position: absolute; inset: 0; mask: linear-gradient(90deg, transparent, #000 10% 90%, transparent); clip-path: polygon(0 0, 100% 0, 100% 0, 0 0); transition: clip-path 0.3s; will-change: clip-path }
.marquee-inner { animation: marquee linear 12s infinite }
to { transform: translateX(-50%) }
```

### [Split images on hover using clip-path](https://codepen.io/cbolson/pen/QwKqRKQ)

on hover of a.: a.: color | made with: transition · :hover · clip-path

```css
h2 { rotate: calc(var(--angle) * 1); scale: 0; transition: scale 300ms ease-in-out }
&::before, &::after { position: absolute; inset: 0; background-position: center; transition: translate var(--trans-duration); clip-path: var(--clip) }
h2 { scale: 1 }
&::before { translate: calc(var(--tx) * -1) calc(var(--ty) * -1) }
&::after { translate: var(--tx) var(--ty) }
```

### [Responsive Sci-Fi E-commerce Nav | Hexagonal HUD & Side-Panel](https://codepen.io/Aga_CW/pen/QwKqvYz)

held: fixed header.ecom-nav, fixed aside.side-panel | on scroll: span.cart-count: color | made with: position: fixed · transition · :hover · clip-path · backdrop-filter

```css
.ecom-nav { position: fixed; top: 0; backdrop-filter: blur(10px); border-bottom: 1px solid rgba(0, 210, 255, 0.2) }
.link { text-transform: uppercase; transition: 0.3s; opacity: 0.7 }
.link:hover { opacity: 1; transform: translateY(-2px) }
.util-btn { clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); transition: 0.3s }
.util-btn:hover { box-shadow: 0 0 15px var(--electric-blue) }
.side-panel { position: fixed; top: 80px; transition: 0.5s cubic-bezier(0.77, 0, 0.175, 1) }
.panel-links { margin-top: 2rem }
.panel-links a { transition: 0.3s }
.menu-toggle { position: relative; transition: all 0.3s ease; clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%) }
.menu-toggle span { box-shadow: 0 0 10px var(--electric-blue); transition: 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6) }
.menu-toggle:hover { box-shadow: 0 0 20px var(--electric-blue) }
.menu-toggle:hover span { box-shadow: 0 0 15px #fff }
```

### [Interlocking Hexagon Grid Gallery (CSS-Only)](https://codepen.io/cliffpyles/pen/azmwMwE)

on scroll: div.hex: transform+filter+top, img.: transform+filter+top, div.hex-caption: opacity+top, h3.: transform+top | on hover of img.: div.hex: transform+filter+top ×2, img.: transform+filter+top ×2, div.hex-caption: opacity+top ×2, h3.: transform+top ×2, p.: transform+top ×2 | made with: transition · :hover · :focus-visible · clip-path · 3D (perspective / preserve-3d)

```css
.gallery-wrapper { perspective: 1000px }
.hex { position: relative; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4)); transform: translateY(0); transition: filter 0.5s cubic-bezier(0.25, 1, 0.5, 1), transform 0.5s cubic-bezier(0.25, 1, 0.5, 1) }
.hex-shape { position: relative; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%) }
.hex-shape::after { position: absolute; inset: 0; transition: opacity 0.5s ease }
.hex::before { position: absolute; inset: 0; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); opacity: 0; transform: scale(1); transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.25, 1, 0.5, 1) }
.hex:focus-visible::before { opacity: 1; transform: scale(1.05) }
.hex:hover, .hex:focus-within { transform: translateY(-6px); filter: drop-shadow(0 20px 25px rgba(0, 0, 0, 0.7)) }
.hex:hover .hex-shape::after, .hex:focus-within .hex-shape::after { opacity: 0 }
.hex img { filter: grayscale(70%) brightness(0.7) contrast(1.1); transform: scale(1.02); will-change: transform; transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), filter 0.6s ease }
.hex:hover img, .hex:focus-visible img { transform: scale(1.15); filter: grayscale(0%) brightness(1.05) contrast(1.05) }
.hex-caption1 { position: absolute; inset: 0; opacity: 0; transition: opacity 0.4s ease }
.hex-caption1 h3 { transform: translateY(15px); transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1) }
```

### [Puzzle Piece Generator — Pure SVG & CSS](https://codepen.io/editor/TornikeL/pen/019cf58e-c241-7a4f-b68a-8fc814271675)

on hover of div.card: path.[object: opacity | made with: transition · :hover

```css
h1 { margin-bottom: 1.5rem }
.piece { transition: fill 0.3s }
.hl { opacity: 0; transition: opacity 0.2s }
.card { transition: border-color 0.2s }
.ch { margin-bottom: 0.6rem }
.tbtns button { transition: all 0.15s }
.explain { margin-bottom: 0.4rem }
.ccode { transition: max-height 0.25s ease }
```

```js
addEventListener( "mouseenter",
addEventListener( "mouseleave",
```

### [Chamfered borders](https://codepen.io/editor/yet-3/pen/019ce34b-db2b-78fb-af9c-5ac074878ced)

made with: clip-path

```css
body { background-position: 0px 0px, var(--off) var(--off) }
.chamfer { clip-path: polygon( 0px 100%, 0px var(--chamfer-tl, 0px), var(--chamfer-tl, 0px) 0px, 100% 0px, calc(100% - var(--chamfer-tr, 0px)) 0px, 100% var(--chamfer-tr, 0px), 100% calc(100% - var(--chamfer-br, 0px)), calc(100% -  }
.chamfer-border { position: relative }
.chamfer-border::before { position: absolute; top: 0; --chamfer-b-offset: calc(var(--chamfer-b-width) * 0.414); clip-path: polygon(var(--outer-path), var(--inner-path)) }
```

### [Point-Origin Circular Reveal Overlay](https://codepen.io/M-Bahn/pen/dPXwvMX)

held: fixed div.overlay, fixed div.overlay, fixed div.overlay, fixed svg.[object | made with: position: fixed · transition · clip-path · custom properties driven by JS

```css
.grided { position: fixed; inset: 0 }
.area { position: relative }
.hotspot { position: absolute }
.hotspot:nth-child(1) { top: 20% }
.hotspot:nth-child(2) { top: 60% }
.hotspot:nth-child(3) { top: 30% }
.overlay { position: fixed; inset: 0; opacity: 0; clip-path: circle(0px at var(--x) var(--y)) }
.overlay.is-animating { transition: clip-path 700ms cubic-bezier(0.6, 0, 1, 1) }
.overlay.is-active { opacity: 1; clip-path: circle(var(--r) at var(--x) var(--y)) }
.overlay-content { opacity: 0; transition: opacity 200ms ease }
.overlay.is-shown .overlay-content { opacity: 1 }
.close { position: absolute; top: 16px }
```

```js
style.setProperty("--x", x + "px")
style.setProperty("--y", y + "px")
style.setProperty("--r", r + "px")
style.setProperty("--r", "0px")
style.setProperty("--r", lastR + "px")
```

### [Clip-path Slideshow + Overlay onclick](https://codepen.io/tofjadesign/pen/XJKqzXj)

held: fixed div.overlay | on scroll: div.slides: transform | made with: position: fixed · transition · :hover · clip-path

```css
.slider { clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%); position: relative }
.slides { transition: transform 0.8s ease }
.slide { background-position: center }
.overlay { position: fixed; inset: 0; opacity: 0; transition: 0.3s }
.overlay.active { opacity: 1 }
.overlay-content { clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%) }
.close-btn { margin-top: 1rem }
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

### [Simple pricing cards](https://codepen.io/thebabydino/pen/ZYOJgyW)

made with: transition · :hover · :has() · clip-path

```css
&:nth-child(2) { margin-top: calc(var(--bit)*9em) }
&::before, &::after { padding-bottom: .25em }
h2, ul { filter: contrast(.8) }
h2 { text-transform: capitalize }
&:is(:hover, :focus) { box-shadow: 0 2px 5px #000; filter: hue-rotate(-22.5deg) contrast(1.75) }
&:active { translate: 0 2px }
h1 { text-transform: capitalize }
```

### [Single div Nepal flag 🇳🇵](https://codepen.io/thebabydino/pen/qENXwJo)

made with: clip-path · mask

```css
.flag { position: relative; mask: var(--grd) 100%/var(--gw) var(--gw), var(--grd) 0/100% calc(var(--bt) + var(--b) + var(--gh)); mask-repeat: no-repeat }
.flag::before, .flag::after { position: absolute; top: var(--cy3); translate: -50% -50%; clip-path: polygon(var(--list, 100% 50%, 80.9096264413% 58.2822094433%, 93.3012701892% 75%, 72.627416998% 72.627416998%, 75% 93.3012701892%, 58.2822094433% 80.90 }
.flag::after { top: 36.25%; rotate: calc(1turn/32); mask: linear-gradient(red 75%, #0000 0) }
```

### [`corner-shape` + `clip-path` breadcrumbs](https://codepen.io/mandynicole/pen/jEryxYZ)

on hover of li.breadcrumb: a.: background+color | made with: @keyframes · :hover · clip-path

```css
li:not(:first-of-type) & { -webkit-clip-path: polygon( 100% 0, 100% 100%, 0% 100%, var(--edge-offset) 50%, 0% 0% ); clip-path: polygon( 100% 0, 100% 100%, 0% 100%, var(--edge-offset) 50%, 0% 0% ) }
@keyframes width-change animates width
```

### [Bevel side tabs with border](https://codepen.io/thebabydino/pen/XJKpedW)

made with: :hover · :has() · clip-path · custom properties driven by JS

```css
&, &::before { clip-path: polygon( 0 0 , 100% var(--y) , 100% calc(100% - var(--y)) , 0 100% ) }
&::before { position: absolute; inset: 0 }
main { filter: drop-shadow(2px 2px 4px) }
```

```js
style.setProperty('--k', k = i)
```

### [quick breadcrumbs navigation](https://codepen.io/thebabydino/pen/raLMwxJ)

held: fixed svg.[object | made with: position: fixed · :has() · clip-path

```css
nav[aria-label=breadcrumb] li { clip-path: polygon(0 0, calc(100% - var(--x)) 0, 100% 50%, calc(100% - var(--x)) 100%, 0 100%); filter: url(#round) }
nav[aria-label=breadcrumb] li a { clip-path: inherit }
nav[aria-label=breadcrumb] { filter: drop-shadow(2px 2px 5px #0002) }
nav[aria-label=breadcrumb] a { text-transform: capitalize }
nav[aria-label=breadcrumb] a::before { filter: sepia(1) var(--f, saturate(0) brightness(0.5)) }
svg[height="0"][aria-hidden=true] { position: fixed }
```

### [Clip-Path animation with ScrollTrigger](https://codepen.io/dm81/pen/GgZadMB)

made with: transition · clip-path · GSAP · ScrollTrigger · Lenis / smooth scroll · requestAnimationFrame

```css
main { transition: opacity 1s }
h1 { text-transform: uppercase; position: absolute; top: 0 }
h1 + * { text-transform: uppercase; background-position: right center; bottom: 32px; position: absolute; transform: translate(-50%, 0) }
div { clip-path: polygon(var(--p1-x) var(--p1-y), var(--p2-x) var(--p2-y), var(--p3-x) var(--p3-y), var(--p4-x) var(--p4-y)) }
```

```js
gsap.registerPlugin(ScrollTrigger)
requestAnimationFrame(raf)
gsap.timeline({
scrollTrigger: { trigger: v, start: 'top bottom', end: 'bottom top', scrub: 1, markers: false }
gsap.to(img, {// 画像のパララックス
scrollTrigger: { trigger: v, start: 'top bottom', end: 'bottom top', scrub: true, markers: false }
```

### [GSAP scale & mask transition](https://codepen.io/romanechouteau/pen/JoXvRKy)

held: fixed div.background | made with: position: fixed · clip-path · GSAP

```css
.background { position: fixed; top: 0 }
.page { position: relative; clip-path: inset(var(--hide) 0 0 round var(--round)) }
```

```js
gsap.timeline({
```

### [Autumn Field Inventory — CSS 2025 Leaf Layers](https://codepen.io/grauconejo13/pen/MYyQava)

made with: transition · clip-path · backdrop-filter

```css
.forest { position: relative; box-shadow: 0 0 18px rgba(0, 0, 0, 0.25) }
.leaf-layer { position: absolute; inset: 0 }
.leaf { position: absolute; transition: transform 0.6s ease, opacity 0.6s ease }
.leaf-red { top: 18%; transform: rotate(-12deg) }
.leaf-orange { top: 50%; transform: rotate(8deg) }
.leaf-yellow { top: 32%; transform: rotate(-5deg) }
.hint { position: absolute; bottom: 12px }
.leaf.peeled { transform: translateY(-160px) rotate(35deg); opacity: 0 }
.reveal { position: absolute; opacity: 0; clip-path: path( "M90 10 Q150 40 170 110 Q180 150 130 180 Q80 210 40 170 Q0 130 20 70 Q40 30 80 10Z" ); backdrop-filter: blur(1.5px); transition: opacity 0.4s ease }
.leaf.peeled + .reveal { opacity: 1 }
.leaf-bg { background-position: center !important }
.leaf-layer, .overlay-layer { transform: scale(0.65) !important; transform-origin: center top }
```

### [Clip element on scroll](https://codepen.io/thebabydino/pen/vEGBOrg)

held: sticky main, fixed aside | on scroll: img.feat: clip-path | made with: position: sticky · position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · :hover · clip-path

```css
body { animation: k 1s linear both; animation-timeline: scroll() }
main { position: sticky; top: 0; filter: drop-shadow(2px 2px 4px #000c) }
.feat { clip-path: inset(0 calc(min(1, 2*var(--k))*(100% + var(--g))/3) round var(--g)) }
:not(.feat) { translate: calc(var(--s)*var(--d)) calc(.5*var(--d)) }
aside { position: fixed; bottom: 0 }
.box-info-scrollani { box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.35) }
@keyframes k animates --k
```

### [CSS Harvest: Shapes Lab (HTML/CSS/JS)](https://codepen.io/Raed-Ennab/pen/OPMrezx)

made with: transition · :hover · prefers-reduced-motion · clip-path · mix-blend-mode · custom properties driven by JS

```css
header.hero { position: relative; box-shadow: var(--shadow) }
.eyebrow { text-transform: uppercase }
.hero::after { position: absolute; inset: 0; clip-path: var(--hero-clip-shape); mix-blend-mode: soft-light }
.card { box-shadow: var(--shadow); position: relative; transition: transform 0.2s ease, box-shadow 0.2s ease }
.card:hover { transform: translateY(-2px); box-shadow: 0 16px 40px hsl(0 0% 0% / 0.45) }
.chip-row { margin-top: 0.75rem }
.swatch { margin-bottom: 0.75rem; box-shadow: inset 0 0 0 1px hsl(0 0% 100% / 0.05) }
.controls { box-shadow: var(--shadow) }
.playground { margin-top: 1rem }
.clip-demo { position: relative; box-shadow: var(--shadow) }
.clip-demo__art { position: absolute; inset: 0; clip-path: var(--wave-clip-shape) }
.clip-demo__label { position: relative }
```

```js
style.setProperty("--k", String(kRange.value))
style.setProperty("--corner-token", val)
style.setProperty("--k", v)
```

### [CSS Harvest: shape() & corner-shape Playground](https://codepen.io/Raed-Ennab/pen/jEWXoaB)

on hover of article.card: article.card: transform | made with: transition · :hover · prefers-reduced-motion · clip-path · mix-blend-mode

### [Let’s Enjoy the Moment](https://codepen.io/grauconejo13/pen/WbraOme)

on scroll: div.f-star: transform+opacity ×698, div.f-star: transform+opacity+top ×212, div.shooting-star: transform+opacity+top ×3 | on hover of button.: div.f-star: transform+opacity ×693, div.f-star: transform+opacity+top ×217, div.shooting-star: transform+opacity+top ×3 | made with: @keyframes · transition · :hover · backdrop-filter

```css
.sky { position: relative }
.f-star { position: absolute; animation: twinkle 2s ease-in-out infinite alternate; opacity: 0.8 }
0% { opacity: 0.3; transform: scale(1) }
100% { opacity: 1; transform: scale(1.4) }
.shooting-star { position: absolute; transform: rotate(45deg); opacity: 0 }
0% { opacity: 0; transform: translate(0, 0) rotate(45deg) }
10% { opacity: 1 }
100% { opacity: 0; transform: translate(-400px, 400px) rotate(45deg) }
.s1 { top: 20%; animation: shoot 6s linear infinite 2s }
.s2 { top: 40%; animation: shoot 8s linear infinite 5s }
.s3 { top: 60%; animation: shoot 10s linear infinite 8s }
.bubble { position: absolute; backdrop-filter: blur(6px); opacity: 0; transition: opacity 0.8s ease }
```

### [clip-path, content attr](https://codepen.io/alobuuls/pen/EaPRvMx)

made with: transition · :hover · clip-path

```css
.img-panda { -webkit-clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35 }
h1:before, h1:after { position: absolute; inset: 0; transition: transform 0.5s ease-in-out }
h1 { position: relative; margin-bottom: 2rem }
h1:hover:before { transform: translateY(-100%) }
h1:hover:after { transform: translateY(100%) }
```

### [Gradients](https://codepen.io/alobuuls/pen/wBMjzqm)

made with: clip-path

```css
.flag { box-shadow: 0 0 0 2px black inset, 0 0 0 2px white }
.czech:before { position: absolute; border-top: calc(var(--size-flag-h) / 2) solid transparent; border-bottom: calc(var(--size-flag-h) / 2) solid transparent }
.czech { position: relative }
.suriname { position: relative }
.suriname:before { position: absolute; top: 50%; transform: translate(-50%, calc(-50% - 5px)) }
.pakistan { position: relative }
.pakistan span { position: absolute; top: 50% }
.pakistan span:first-of-type { transform: translate(-30%, -45%) rotateZ(-45deg) }
.pakistan span:last-of-type { transform: translate(100%, -80%) rotateZ(45deg) }
.greece:before { position: absolute; top: 0; transform: translate(-10%, calc(-30% + 3px)) }
.greece { position: relative }
.togo:before { position: absolute; top: 0; transform: translate(25%, -12.5%) }
```

### [Black Dahlia](https://codepen.io/timhjellum/pen/xbZYEvP)

made with: clip-path

```css
body { position: relative }
code { position: absolute; bottom: 0 }
.wrapper { text-transform: uppercase }
.top { clip-path: polygon(0% 0%, 100% 0%, 100% 48%, 0% 58%) }
.bottom { clip-path: polygon(0% 60%, 100% 50%, 100% 100%, 0% 100%); transform: translateX(-0.02em) }
```

### [Pure CSS progress ring + map curvature (concave rounding)](https://codepen.io/thebabydino/pen/ogbGXoj)

made with: transition · :hover · clip-path · mask

```css
.map { mask: radial-gradient(36cqw at 50% 100%, #0000 calc(100% - .5px), red calc(100% + .5px)) subtract, radial-gradient(16.7246154048cqw at 0 -5.3067983445cqw, #0000 calc(100% - .5px), red calc(100% + .5px)) 0 100%/15.8603484 }
.map { mask: none; clip-path: shape(from 0 0, vline to 100%, arc by 15.8603484126cqw -11.4229676306cqw of 16.7246154048cqw, arc by 68.2793031748cqw 0 of 36cqw cw, arc by 15.8603484126cqw 11.4229676306cqw of 16.7246154048cqw, vl }
.map:hover { filter: invert(1) }
.prg { margin-top: 0.5em }
.prg::before { box-shadow: inset 0 0 0 6cqw grey; clip-path: inset(calc(50% - 32.943700615cqw) 0 0); mask: radial-gradient(3cqw at calc(50% - 8.0233903982cqw) calc(50% - 29.943700615cqw), red calc(100% - .5px), #0000 calc(100% + .5px)) }
.prg::after { mask: radial-gradient(3cqw at calc(50% + 8.0233903982cqw) calc(50% - 29.943700615cqw), red calc(100% - .5px), #0000 calc(100% + .5px)), radial-gradient(3cqw at calc(50% + 30.5290403434cqw) calc(50% - 5.3830935077cqw), re }
.val { box-shadow: inset 0 0 0 4px grey; mask: radial-gradient(closest-side, red calc(100% + -4px - 1px), #0000 calc(100% + -4px)), conic-gradient(from -120deg, #0000 45deg, red) }
```

### [Pure CSS angled columns layout options (heavily commented, no magic numbers)](https://codepen.io/thebabydino/pen/WbrjrZM)

made with: clip-path

```css
.example { filter: drop-shadow(2px 2px 5px #000) }
&::after { position: absolute; inset: 0 auto }
section::after { clip-path: polygon( 0 0, calc(var(--g) + 1px) 0, 100% 100%, 0 100%) }
img { clip-path: polygon( 0 0, calc(100% - var(--xi)) 0, 100% 100%, calc(var(--xi)) 100%) }
section::after, figure { transform: skewX(var(--a)) }
img { transform: skewx(calc(-1*var(--a))) }
```

### [SVG Image Stripes Hero Section](https://codepen.io/jerora98/pen/xbZgKyz)

made with: clip-path

### [Inner + outer arrow shape](https://codepen.io/thebabydino/pen/VYemqRQ)

held: fixed svg.[object | made with: position: fixed · clip-path · mask · mix-blend-mode

```css
div { border-bottom: solid var(--h) #0000; text-transform: uppercase }
.mask { mask: conic-gradient(from .5turn at 50% calc(100% - var(--h)), #0000 var(--a), red 0%) padding-box , conic-gradient(at bottom, red var(--a), #0000 0%) }
.clip { clip-path: polygon(0 0, 0 var(--y), calc(50% - var(--x)) var(--y), 50% calc(100% - 2*var(--h)), 50% 100%, calc(50% + var(--x)) var(--y), 100% var(--y), 100% 0) }
&::after { position: absolute; inset: 0 -50% calc(-1*var(--h)); box-shadow: 0 0 0 var(--h) #000; filter: url(#rnd); mix-blend-mode: darken }
&::after { position: absolute; inset: 0 -50% calc(-1*var(--h)); box-shadow: 0 0 0 var(--h) #000; filter: url(#rnd); mix-blend-mode: darken }
svg { position: fixed }
```

### [Curved Gallery Clip Path](https://codepen.io/hernandack/pen/GgopOXa)

on scroll: img.: filter+top | on hover of img.: img.: filter+top ×2 | made with: transition · :hover · clip-path

```css
img { object-position: center top; filter: saturate(35%); transition: filter .3s ease-in, scale .3s ease-in }
img { scale: 1.1; filter: saturate(100%) }
```

### [Speech bubble (clip-path: polygon)](https://codepen.io/martonixio/pen/emJOwLb)

made with: clip-path

```css
.block-wrap { margin-top: 3rem }
.speech-bubble-wrap { filter: drop-shadow(0 2px 10px rgba(75, 0, 71, 0.24)) }
.speech-bubble { clip-path: polygon(10% 7%, 96% 0, 100% 100%, 12% 100%, 10% 78%, 0 82%, 8% 45%) }
.speech-bubble { clip-path: polygon(7% 4%, 95% 0, 98% 73%, 84% 73%, 70% 100%, 69% 73%, 6% 71%) }
```

### [GSAP pinned image mask reveal on scroll](https://codepen.io/gridmorphic/pen/WbQPRwv)

on scroll: img.: clip-path+top ×2 | made with: GSAP · ScrollTrigger · Lenis / smooth scroll · requestAnimationFrame

```css
img { object-position: center }
.arch__right .img-wrapper { position: static; transform: none; margin-bottom: 20px }
```

```js
requestAnimationFrame(raf)
gsap.timeline({
scrollTrigger: { trigger: ".arch", start: "top top", end: "bottom bottom", pin: ".arch__right", scrub: true }
gsap.timeline()
scrollTrigger: { trigger: image, start: "top-=70% top+=50%", end: "bottom+=200% bottom", scrub: true }
```

### [3D diamond menu: shape-shifting navigation](https://codepen.io/mysth/pen/dPYqLYW)

on scroll: div.gallery-grid: transform+top | on hover of div.card: div.card: transform+top, img.: clip-path+top, p.: transform+opacity+top | made with: transition · :hover · clip-path · 3D (perspective / preserve-3d)

```css
.scene-3d { perspective: 2500px }
&:hover { transform: rotateX(5deg) }
&::before { opacity: .75; clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%) }
& img { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%) }
& p { opacity: 1; transform: translateY(0) }
&::before { position: absolute; inset: -3px; clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); opacity: 0; transition: opacity .5s ease, clip-path .5s cubic-bezier(.23, 1, .320, 1); will-change: opacity, clip-path }
& img { position: absolute; inset: 0; clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); transition: clip-path .5s cubic-bezier(.23, 1, .320, 1); will-change: clip-path }
& p { margin-top: 1rem; opacity: 0; transform: translateY(-10px); transition: opacity .4s .1s ease, transform .4s .1s ease; will-change: opacity, transform }
```

### [Ribbon Clip Path](https://codepen.io/francoiscoron/pen/MYaXqVm)

made with: :hover · clip-path

```css
.ribbon { position: relative; -webkit-clip-path: polygon(calc(100% - var(--_r-shape)) 0, 100% 50%, calc(100% - var(--_r-shape)) 100%, 0px 100%, var(--_r-shape) 50%, 0px 0px); clip-path: polygon(calc(100% - var(--_r-shape)) 0, 100% }
```

### [t3](https://codepen.io/anvlaibar/pen/wBKqNXG)

made with: clip-path · custom properties driven by JS · pointer / mouse tracking

```css
&::before { position: absolute; inset: 0; background-position: -4.4rem -2.8em }
&::before { position: absolute; bottom: 0; bottom: -41px; filter: blur(2px); -webkit-clip-path: ellipse(22.2% 21.2% at 104% -4%); clip-path: ellipse(22.2% 21.2% at 104% -4%) }
&::after { position: absolute; bottom: 0; top: -41px; filter: blur(2px); -webkit-clip-path: ellipse(22.2% 21.2% at -6% 104%); clip-path: ellipse(22.2% 21.2% at -6% 104%) }
&::after { position: absolute; top: 1px }
&::before { position: absolute; top: 30px; bottom: 0; box-shadow: inset 2px 1px 0px 0px rgba(255, 255, 255, 0.5), inset 0 -2px 1px rgba(0, 0, 0, 0.35) }
.indicator { position: absolute; top: 7px; transform: rotate(33deg) }
&::before, &::after { box-shadow: calc(var(--sx, 1) * 1px) calc(var(--sy, 0) * 1px) 1px 0 rgba(0, 0, 0, 0.5), inset calc(var(--insetX, -1) * 1px) calc(var(--insetY, -1) * 1px) 0 rgba(255, 255, 255, 0.35), inset calc(var(--sx, 1) * 1px) calc(v }
&::before { position: absolute; top: 60px; bottom: 0; transform: rotate(90deg) }
&::after { position: absolute; top: 111px; bottom: 0; transform: rotate(145deg) }
&::before { position: absolute; top: 15px }
&::after { position: absolute; top: 25px }
.center { position: absolute; top: 34%; transform: rotate(calc(-1 * var(--angle, 0deg))); box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.75), inset 0 -1px 1px rgba(0, 0, 0, 0.5) }
```

```js
style.setProperty("--angle", `${rotation}deg`)
style.setProperty("--sx", sx)
style.setProperty("--sy", sy)
style.setProperty("--insetX", insetX)
style.setProperty("--insetY", insetY)
addEventListener("pointermove", (e) => {
```

### [lodestar](https://codepen.io/anvlaibar/pen/pvjrqgm)

made with: clip-path · mask

```css
&::before { position: absolute; top: 17px; transform: rotate(8deg) }
&::after { position: absolute; top: 15px }
&.ll { -webkit-clip-path: polygon( 9% 3.33%, -1% 4.67%, -2% 91.67%, 6% 94.01%, 8% 53.99%, 100% 84.34%, 103% 74.33%, 8% 33.34% ); clip-path: polygon( 9% 3.33%, -1% 4.67%, -2% 91.67%, 6% 94.01%, 8% 53.99%, 100% 84.34%, 103% 74.33 }
&.lr { -webkit-clip-path: polygon( 88% 40%, -2% 73%, 0% 86.67%, 90% 59.01%, 93% 100.66%, 100% 96.01%, 98% 4.33%, 88% 10.01% ); clip-path: polygon( 88% 40%, -2% 73%, 0% 86.67%, 90% 59.01%, 93% 100.66%, 100% 96.01%, 98% 4.33%, 88 }
&.rl { -webkit-clip-path: polygon( 15% 76.36%, 15% 78.49%, 49% 86.37%, 59% 77.83%, 57% 75.76%, 49% 84.03% ); clip-path: polygon( 15% 76.36%, 15% 78.49%, 49% 86.37%, 59% 77.83%, 57% 75.76%, 49% 84.03% ) }
&.rr { -webkit-clip-path: polygon( 42% 75.06%, 41% 77.19%, 50% 86.37%, 84% 79.13%, 84% 75.76%, 51% 82.74% ); clip-path: polygon( 42% 75.06%, 41% 77.19%, 50% 86.37%, 84% 79.13%, 84% 75.76%, 51% 82.74% ) }
&::before { position: absolute; inset: 0 }
&::after { position: absolute; top: 0; bottom: 0 }
&::after { position: absolute; top: 80px; bottom: 0 }
&::after { position: absolute; top: 12px }
&::after { position: absolute; top: 12px }
&.dl { -webkit-clip-path: polygon( 9.11% 0.11%, 22.22% 1.36%, 97.22% 64.43%, 93.33% 82.63%, 19.73% 102.63%, 4.72% 58.8% ); clip-path: polygon( 9.11% 0.11%, 22.22% 1.36%, 97.22% 64.43%, 93.33% 82.63%, 19.73% 102.63%, 4.72% 58.8% }
```

### [Purple Square Slides Up To Photo Reveal On Hover Template](https://codepen.io/ElighNiliAriah24/pen/wBKqYJa)

made with: transition · :hover · clip-path

### [canned herring](https://codepen.io/anvlaibar/pen/RNWZZVy)

on scroll: div.content: transform+top, div.short-side: transform+top, div.long-side: transform+top, div.shadow: shadow+top | made with: transition · :hover · clip-path · mask · mix-blend-mode

```css
.wrap { position: relative }
&.hover { transform: translateY(-1rem) translateX(-50%) }
&::after { position: absolute; inset: 0 }
&.hover { top: 8px; transform: skewY(-80deg) }
&.hover { top: 489px; transform: skewX(-10deg) }
&::after { position: absolute; top: 0px; transform: scale(1.5, 0.23); -webkit-mask-image: url("data:image/png; mask-image: url("data:image/png; -webkit-mask-repeat: repeat; mask-repeat: repeat; -webkit-mask-size: 7rem; mask-size: 7 }
&.hover::after { top: 3px; transform: scale(1.5, 0.65) }
&:hover, &.hover { box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22) }
.highlights { position: absolute; inset: 0; box-shadow: -9px 0 11px -7px var(--hl) inset, 0 4px 3px var(--hl) inset, -5px 0 4px var(--hl) inset, inset 1px 0 3px var(--hl) }
.mask { position: absolute; inset: 0; -webkit-mask-image: linear-gradient( 60deg, var(--text-color) 0, rgba(255, 255, 255, 0.124) 50%, var(--text-color) 55%, transparent 90%, transparent 100% ); mask-image: linear-gradient( 60de }
&::before { position: absolute }
&::after { position: absolute; top: 68px; box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.15), inset 0px -1px 3px rgba(0, 0, 0, 0.15) }
```

### [1984](https://codepen.io/abereghici/pen/bNVRvaj)

on scroll: div.u-stacked: transform ×2, div.u-stacked: transform+top, div.eye__base: transform | on hover of li.nav__item: div.u-stacked: transform+top | made with: @keyframes · transition · :hover · clip-path · mix-blend-mode · pointer / mouse tracking

```css
0%, 100% { transform: translateY(0) }
50% { transform: translateY(calc(var(--bounce-offset, 0.625rem) * -1)) }
.app { position: relative; mix-blend-mode: exclusion }
.u-bounce { --bounce-offset: 0.625rem; animation: bounce var(--timing-slow) infinite }
.u-follow { transform: translate( calc(var(--mouse-x) * var(--offset)), calc(var(--mouse-y) * var(--offset)) ); transition: transform var(--timing-fast) ease-out }
.eye { mix-blend-mode: exclusion }
.eye__base--ellipsis { rotate: 45deg }
.eye__socket { mix-blend-mode: exclusion }
&.u-follow { --offset: 0.9375rem }
&.u-follow { --offset: 0.625rem }
&.u-follow { --offset: -0.3125rem }
.spotlight { position: absolute; translate: calc(var(--box-x) * 1px) calc(var(--box-y) * 1px); rotate: atan2( calc((var(--spotlight-mouse-x) - var(--spotlight-origin-x) - 100) * 1), calc((var(--spotlight-mouse-y) - var(--spotlight-or }
```

```js
addEventListener("mousemove", this.handleMouseMove.bind(this))
```

### [HUD display](https://codepen.io/megan-durham/pen/GgpZYvL)

on hover of a.: a.: color | made with: :hover · clip-path

```css
#template { position: absolute; top: 50%; transform: translate(-251px, -151px) }
#left { position: absolute; top: 50%; transform: translate(-255px, -150px); clip-path: polygon( 0% 25%, 100% 30%, 100% 70%, 0% 75% ) }
#right { position: absolute; top: 50%; transform: translate(var(--t), -150px); clip-path: polygon( 100% 25%, 0% 30%, 0% 70%, 100% 75% ) }
#clip { transform: translate(-250px, -150px) }
.shape { position: absolute; top: 50%; clip-path: polygon( 5% 0%, 35% 0%, 40% 5%, 60% 5%, 65% 0%, 95% 0%, 100% 5%, 100% 25%, 97.5% 30%, 97.5% 70%, 100% 75%, 100% 95%, 95% 100%, 65% 100%, 60% 95%, 40% 95%, 35% 100%, 5% 100%, 0% 95 }
#content { position: absolute; top: 50%; transform: translate(-240px, -130px) }
h2 { text-transform: uppercase }
```

### [Clip Path Text Animation on Scroll](https://codepen.io/ScrollMoo/pen/OPyMyYE)

held: fixed div.box | on scroll: div.in: clip-path ×2 | made with: position: fixed · clip-path

```css
.box { position: fixed }
.box div { position: absolute; top: 0 }
.in1 { clip-path: inset( 0% var(--scrollmoo-cover1, 0%) 0 var(--scrollmoo-cover1, 0%) ) }
.in2 { clip-path: inset( 0% var(--scrollmoo-cover2, 50%) 0 var(--scrollmoo-cover2, 50%) ) }
.in3 { clip-path: inset( 0% var(--scrollmoo-cover3, 50%) 0 var(--scrollmoo-cover3, 50%) ) }
span { text-transform: uppercase }
```

### [CPC Challenge - Slide In / Slide Out - Slide Inwards(?)](https://codepen.io/yexx/pen/PwqMvjB)

on hover of li.: figure.: transform+top ×2, figcaption.: transform+clip-path+shadow+top ×2 | made with: position: fixed · @keyframes · transition · :hover · clip-path · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d)

```css
body { perspective: 100vw }
&::before { position: fixed; inset: -100vh -100vw; opacity: 0.2; mix-blend-mode: overlay }
&::before { position: absolute; inset: 0; transition: all 140ms ease }
figure { transition: all 140ms ease }
&::before, &::after { backdrop-filter: contrast(1.1) url(#pixelate) }
&::before { animation: square1 1100ms steps(24) infinite }
&::after { animation: square1 2700ms steps(24) infinite }
figcaption { position: absolute; bottom: 1em; backdrop-filter: blur(10px); clip-path: polygon(0 100%, 0 100%, 100% 100%, 100% 100%); translate: 0.5em; transform: translateY(1em); transition: all 240ms ease }
&::after { position: absolute; inset: 0; backdrop-filter: url(#chroma); transition: all 140ms ease; opacity: 0 }
&::before { transform: translate(-6%, 0%); opacity: 0.3; filter: blur(3px) }
&::before, &::after { opacity: 1 }
figure { transform: scale(1.05) }
```

### [Cool concave rounding header component](https://codepen.io/thebabydino/pen/azOgOKE)

held: fixed svg.[object | made with: position: fixed · clip-path · mask · custom properties driven by JS

```css
svg[height="0"][aria-hidden=true] { position: fixed }
header { position: relative; filter: url(#st) }
header::before { position: absolute; inset: 0 var(--o); opacity: 0.8; clip-path: shape(from 0 var(--sb), arc by var(--ri) var(--ri) of var(--ri) cw, arc by var(--ri) var(--ri) of var(--ri), hline to calc(100% - var(--rd)), arc by var(--r }
header::before { bottom: var(--o); mask: linear-gradient(red var(--sb), #0000 0) no-clip, conic-gradient(red 0 0) content-box, radial-gradient(var(--ri) at calc(var(--ri) + 1px) 100%, #0000 calc(100% - .5px/var(--f)), red calc(100% + .5p }
```

```js
style.setProperty('--f', window.devicePixelRatio)
```

### [Created with shaper.andrewhudson.dev](https://codepen.io/bigandy/pen/yyNrwxQ)

made with: clip-path

```css
body::after { clip-path: shape( from 17.34% 20.82%, line to 25% 20.82%, line to 4.83% 50.20%, line to 14.91% 56.03%, line to 27.42% 56.88%, line to 36.64% 50.33%, line to 36.77% 27.14%, line to 28.63% 20.94%, close ) }
&::after { position: absolute; inset: 0 }
```

### [Created with shaper.andrewhudson.dev](https://codepen.io/bigandy/pen/zxGevdr)

made with: clip-path

```css
body::after { clip-path: shape( from 15.88% 27.99%, arc to 71.13% 52.75% of 1% cw, arc to 15.88% 27.99% of 1% cw, move to 75.38% 27.01%, arc to 104.27% 42.07% of 1% cw, arc to 75.38% 27.01% of 1% cw, move to 29.12% -13.66%, arc to 58. }
```

### [1 div, multiple dots loader with shape()](https://codepen.io/thebabydino/pen/dPowVVG)

on scroll: div.loader: clip-path | made with: @keyframes · clip-path

```css
.loader { clip-path: shape(from calc(2.5em - .5px) calc(2.5em*(1 + cos(var(--a) + 0turn))) var(--s), move to calc(12.5em - .5px) calc(2.5em*(1 + cos(var(--a) + 0.3333333333turn))) var(--s), move to calc(22.5em - .5px) calc(2.5em*( }
@keyframes a animates --a
```

### [Created with shaper.andrewhudson.dev](https://codepen.io/bigandy/pen/vEOjZVx)

made with: clip-path

```css
body::after { clip-path: shape( from 36.92% 52.21%, line to 36.92% 74.88%, line to 66.74% 74.88%, line to 66.74% 52.21%, move to 66.68% 2.46%, line to 66.68% 52.79%, line to 89.42% 52.79%, line to 89.42% 2.46%, move to 47.5% 39.66%, a }
&::after { position: absolute; inset: 0 }
```

### [Created with shaper.andrewhudson.dev](https://codepen.io/bigandy/pen/vEOjGOb)

made with: clip-path

```css
body::after { clip-path: shape( from 38.11% 71.64%, line to 22.38% 40.95%, line to 43.29% 38.84%, move to 12.21% 7.19%, line to 12.21% 33.09%, line to 48.66% 33.09%, line to 48.66% 7.19%, move to 22.95% 11.22%, arc to 29.28% 18.13% of }
&::after { position: absolute; inset: 0 }
```

### [Torn Paper Sections](https://codepen.io/cannobbio/pen/OPVvqOO)

made with: transition · clip-path

```css
h1 { margin-bottom: 0.5em }
p { margin-bottom: 1.5em }
.main-section { position: relative; padding-top: 64px; padding-bottom: 64px }
.main-section--ripped { margin-top: -24px; clip-path: polygon(0% 16px, 2.5% 14px, 5% 13px, 7.5% 14px, 10% 15px, 12.5% 16px, 15% 17px, 17.5% 15px, 20% 5px, 22.5% 2px, 25% 3px, 27.5% 1px, 30% 8px, 32.5% 6px, 35% 5px, 37.5% 8px, 40% 9px, 42.5% 15p }
.main-section--ripped:first-child { margin-top: 0; clip-path: none !important }
```

### [Fluid Text Animation](https://codepen.io/Aida-Hashemi/pen/OPVjYrd)

on scroll: div.floating-element: transform+opacity+top ×14, div.floating-element: transform+top ×12, div.text-layer: clip-path+filter | made with: @keyframes · clip-path · pointer / mouse tracking

```css
body { position: relative }
body::before { position: absolute; top: 0; bottom: 0 }
.container { position: relative }
.text-wrapper { position: relative }
.text-layer { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.text-outline { filter: drop-shadow(0 0 20px rgba(120, 219, 255, 0.3)) }
.text-fill { animation: fluidWave 6s ease-in-out infinite, colorShift 8s ease-in-out infinite; filter: drop-shadow(0 0 30px rgba(120, 219, 255, 0.5)) }
0%, 100% { clip-path: polygon( 0% 40%, 12% 38%, 25% 42%, 38% 48%, 50% 52%, 62% 48%, 75% 45%, 88% 42%, 100% 40%, 100% 100%, 0% 100% ) }
25% { clip-path: polygon( 0% 55%, 12% 58%, 25% 62%, 38% 58%, 50% 52%, 62% 48%, 75% 45%, 88% 48%, 100% 52%, 100% 100%, 0% 100% ) }
50% { clip-path: polygon( 0% 62%, 12% 65%, 25% 68%, 38% 65%, 50% 60%, 62% 55%, 75% 52%, 88% 48%, 100% 45%, 100% 100%, 0% 100% ) }
75% { clip-path: polygon( 0% 48%, 12% 45%, 25% 48%, 38% 52%, 50% 55%, 62% 58%, 75% 62%, 88% 65%, 100% 68%, 100% 100%, 0% 100% ) }
0%, 100% { background-position: 0% 50% }
```

```js
addEventListener('mousemove', (e) => {
```

### [Reemplazo de Texto con Imágenes a través de CSS - Técnica clip-path](https://codepen.io/Rafael-Antonio-Lara-Campos/pen/JodyqBN)

made with: clip-path

```css
.replace-clip-path span { clip-path: polygon(0px 0px, 0px 0px, 0px 0px, 0px 0px) }
p { margin-top: 22px }
```

### [Glowing Border with CSS](https://codepen.io/yexx/pen/ByNRZyz)

made with: clip-path

```css
.border-filter { position: absolute; inset: calc(var(--glow) / 2 * -1); filter: blur(2rem) }
h1 { margin-bottom: 0 }
.container::before, .border-filter::before { position: absolute; inset: 0; clip-path: var(--path, unset) }
```

### [Squircles with clip-path: shape();](https://codepen.io/BlogFire/pen/MYwpYGK)

on scroll: div.squircle6: clip-path | made with: transition · :hover · clip-path

```css
.squircle1 { position: relative; clip-path: shape( from 0% 50%, curve to 50% 0% with 0% 5% / 5% 0%, curve to 100% 50% with 95% 0% / 100% 5%, curve to 50% 100% with 100% 95% / 95% 100%, curve to 0% 50% with 5% 100% / 0% 95%, close );  }
.squircle2 { clip-path: shape( from 0% 50%, curve to 50% 0% with 0% 13.5% / 13.5% 0%, curve to 100% 50% with 86.5% 0% / 100% 13.5%, curve to 50% 100% with 100% 86.5% / 86.5% 100%, curve to 0% 50% with 13.5% 100% / 0% 86.5%, close ) }
.squircle3 { clip-path: shape( from 0% 50%, curve to 50% 0% with 0% 59% / 59% 0%, curve to 100% 50% with 41% 0% / 100% 59%, curve to 50% 100% with 100% 41% / 41% 100%, curve to 0% 50% with 59% 100% / 0% 41%, close ) }
.squircle4 { clip-path: shape( from 0% 50%, curve to 50% 0% with 0% 116.5% / 116.5% 0%, curve to 100% 50% with -16.5% 0% / 100% 116.5%, curve to 50% 100% with 100% -16.5% / -16.5% 100%, curve to 0% 50% with 116.5% 100% / 0% -16.5%, c }
.squircle5 { clip-path: shape( from 0% 50%, curve to 50% 0% with 0% 150% / 150% 0%, curve to 100% 50% with -50% 0% / 100% 150%, curve to 50% 100% with 100% -50% / -50% 100%, curve to 0% 50% with 150% 100% / 0% -50%, close ) }
.squircle6 { clip-path: shape( from 0% 50%, curve to 50% 0% with 0% 5% / 5% 0%, curve to 100% 50% with 95% 0% / 100% 5%, curve to 50% 100% with 100% 95% / 95% 100%, curve to 0% 50% with 5% 100% / 0% 95%, close ); transition: all 0.5s }
.squircle6:hover { clip-path: shape( from 0% 50%, curve to 50% 0% with 0% 70% / 70% 0%, curve to 100% 50% with 30% 0% / 100% 70%, curve to 50% 100% with 100% 30% / 30% 100%, curve to 0% 50% with 70% 100% / 0% 30%, close ) }
div { filter: drop-shadow(1rem 1rem 2rem 2rem black) }
```

### [Squircle Morphing Gallery: Más Allá de las Esquinas Redondas](https://codepen.io/andrewuru/pen/MYwJmRB)

on hover of img.: div.gallery-item: transform+top, img.: transform+top, div.gallery-item-content: transform+top | made with: scroll-snap · transition · :hover · clip-path · custom properties driven by JS · GSAP · pointer / mouse tracking

```css
.main-header { margin-bottom: 40px }
.main-header h1 { margin-bottom: 10px }
.main-header .subtitle { margin-top: 0 }
.section { margin-bottom: 50px; box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) }
.section h2 { margin-bottom: 40px }
.gallery-item { position: relative; padding-bottom: 100%; box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease; clip-path: var(--squircle-clip-initial); -webkit-clip-path: var(--squircle-clip-initial) }
.gallery-item img { position: absolute; top: 0; transition: transform 0.3s ease }
.gallery-item-content { position: absolute; bottom: 0; transform: translateY(100%); transition: transform 0.3s ease }
.gallery-item:hover .gallery-item-content { transform: translateY(0) }
.gallery-item:hover { transform: scale(1.05) }
.gallery-item:hover img { transform: scale(1.02) }
.gallery-item::before { position: absolute; top: 0; opacity: 0; transition: opacity 0.3s ease }
```

```js
addEventListener('mousemove', (e) => {
style.setProperty('--mouse-x', `${x}%`)
style.setProperty('--mouse-y', `${y}%`)
addEventListener('mouseenter', () => {
gsap.to(item, {
addEventListener('mouseleave', () => {
```

### [Inverted Corner using clip-path: shape()](https://codepen.io/cbolson/pen/JodPwVB)

made with: clip-path

```css
& > h2 { position: absolute }
& > .card-inner { position: absolute; inset:0 }
& > h2 { top: .5rem }
& > .card-inner { clip-path: shape( from var(--corner-offset) var(--tab-height), hline to calc(var(--tab-width) - var(--corner-offset)), arc to var(--tab-width) calc(var(--tab-height) / 2) of var(--corner-offset), arc to calc(var(--tab-wi }
& > h2 { top: 50px }
& > .card-inner { clip-path: shape( from var(--corner-offset) 0, hline to calc(100% - var(--corner-offset)), arc to 100% var(--corner-offset) of var(--corner-offset) cw, arc to calc(100% - var(--corner-offset)) calc(var(--corner-offset) * }
```

### [Created with shaper.andrewhudson.dev](https://codepen.io/bigandy/pen/bNNXOYV)

made with: clip-path

```css
body::after { clip-path: var(--shape) }
&::after { position: absolute; inset: 0 }
```

### [Breathing with shape()](https://codepen.io/thebabydino/pen/vEEqMWo)

on scroll: img.: clip-path | on hover of img.: img.: clip-path | made with: @keyframes · clip-path

```css
img { clip-path: shape(from 0 0, curve to 100% 0 with var(--p) var(--p)/var(--c) var(--p), curve to 100% 100% with var(--c) var(--p)/var(--c) var(--c), curve to 0 100% with var(--c) var(--c)/var(--p) var(--c), curve to 0 0 wit }
@keyframes k animates --k
```

### [Stellar Orbit Gallery](https://codepen.io/tofjadesign/pen/oggVgrw)

held: fixed div.lightbox | on scroll: div.star-item: transform+top ×5, div.star-gallery: transform+top | on hover of img.: div.star-item: transform+top ×4, div.star-gallery: transform+top, div.star-item: transform | made with: position: fixed · @keyframes · transition · :hover · clip-path

```css
.gallery-background { background-position: center }
.star-gallery { position: relative }
from { transform: rotate(0deg) }
to { transform: rotate(360deg) }
.star-gallery { animation: spin 30s linear infinite }
.star-gallery:hover { animation-play-state: paused }
.star-item { position: absolute; background-position: center; clip-path: polygon( 50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35% ); transition: transform 0.3s }
.star-item:hover { transform: scale(1.2) }
.star-item:nth-child(1) { top: 0% }
.star-item:nth-child(2) { top: 20% }
.star-item:nth-child(3) { top: 60% }
.star-item:nth-child(4) { top: 60% }
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

### [Inverted borders with clip-path & shape() test](https://codepen.io/joshuaaron/pen/PwwKGPr)

made with: clip-path

```css
.shape { clip-path: path("M 0 300 H 300 V 25 Q 300 0 275 0 H 125 Q 100 0 100 25 L 100 75 Q 100 100 75 100 L 25 100 Q 0 100 0 125 Z") }
.shape-2 { clip-path: shape(from 0 300px, hline to 300px, vline to 25px, curve to 275px 0 with 300px 0, hline to 125px, curve to 100px 25px with 100px 0, line to 100px 75px, curve to 75px 100px with 100px 100px, line to 25px 100px, }
.shape-3 { position: relative }
.shape-3 .block { position: absolute; bottom: 0 }
.shape-3 .block::before, .shape-3 .block::after { position: absolute }
.shape-3 .block::before { bottom: 0 }
.shape-3 .block::after { top: -24px }
```

### [Another Clip path image](https://codepen.io/hal-hawkins/pen/MYYobMg)

made with: clip-path

```css
.explanation { position: absolute }
.clip-container { position: relative }
.outline1 { position: absolute; clip-path: polygon(3.03% 95.71%, -0.84% 100.15%, 46.46% 100.51%, 99.87% 100.03%, 99.99% 88.53%, 96.16% 87.70%, 90.77% 85.78%, 87.54% 85.30%, 82.87% 84.82%, 78.55% 84.22%, 75.20% 83.86%, 66.10% 81.35%, }
.chin1 { position: absolute; clip-path: polygon(50.87% 82.40%, 54.53% 83.35%, 55.92% 84.07%, 56.31% 85.01%, 57.92% 83.35%, 60.03% 79.74%, 56.86% 76.97%, 54.20% 77.96%, 51.71% 78.63%, 49.49% 78.91%, 46.93% 78.96%, 46.55% 79.96%, 4 }
.hair-shadow1 { position: absolute; clip-path: polygon(59.03% 32.56%, 58.53% 30.91%, 60.18% 31.51%, 59.33% 30.01%, 60.93% 30.96%, 60.88% 29.76%, 61.53% 30.06%, 59.53% 27.25%, 60.58% 27.60%, 61.33% 27.60%, 57.13% 22.50%, 62.44% 26.15%, 6 }
.hair1 { position: absolute; clip-path: polygon(29.32% 75.81%, 26.60% 74.88%, 22.58% 70.43%, 20.15% 67.49%, 19.93% 65.41%, 21.44% 63.55%, 19.57% 60.89%, 18.00% 57.81%, 17.21% 54.80%, 14.98% 48.28%, 15.06% 42.76%, 15.92% 36.45%, 1 }
.hair-shadow-1 { position: absolute; clip-path: polygon(32.08% 20.40%, 30.94% 22.40%, 31.89% 21.70%, 30.69% 23.70%, 31.99% 23.15%, 30.44% 24.55%, 31.64% 24.15%, 30.44% 25.10%, 31.94% 25.05%, 30.64% 25.55%, 29.69% 26.30%, 31.69% 25.55%, 2 }
.upper-lip1 { position: absolute; clip-path: polygon(41.67% 76.36%, 40.64% 76.29%, 40.24% 76.05%, 40.00% 75.41%, 41.40% 75.59%, 42.86% 75.46%, 44.74% 74.68%, 46.45% 74.32%, 47.43% 75.05%, 48.53% 75.42%, 49.75% 74.93%, 50.62% 74.30%, 5 }
.brow2 { position: absolute; clip-path: polygon(44.05% 51.56%, 33.18% 53.11%, 31.73% 51.56%, 30.85% 50.00%, 30.07% 49.01%, 29.46% 47.90%, 29.63% 46.73%, 30.40% 45.34%, 30.96% 44.46%, 32.34% 44.01%, 33.84% 43.90%, 35.62% 43.68%, 3 }
.brow1 { position: absolute; clip-path: polygon(50.79% 52.89%, 66.71% 52.30%, 72.34% 50.30%, 71.24% 47.06%, 70.08% 45.64%, 66.58% 41.69%, 66.52% 45.06%, 65.61% 44.48%, 63.41% 43.96%, 60.82% 43.25%, 58.62% 43.25%, 55.97% 43.31%, 5 }
.l-nostril { position: absolute; clip-path: polygon(46.91% 68.83%, 44.09% 67.85%, 43.45% 67.28%, 43.31% 66.63%, 44.60% 66.42%, 45.46% 67.13%, 45.97% 67.95%) }
.glasses { position: absolute; clip-path: polygon(36.34% 45.58%, 38.97% 45.81%, 41.53% 46.91%, 42.85% 48.65%, 43.18% 49.24%, 44.30% 49.00%, 47.03% 48.58%, 48.78% 48.54%, 49.89% 48.51%, 50.98% 48.58%, 51.92% 48.65%, 52.94% 48.76%, 5 }
```

### [clip-mask definition](https://codepen.io/dandenney/pen/JooRaLW)

made with: clip-path

```css
.media-primary { clip-path: url(#clip-rounded) }
.media-secondary { transform: translateX(-3px) }
```

### [Clip-path](https://codepen.io/Akash_Ramani/pen/GggRoOv)

made with: nothing recognised — read the code

```css
body { position: relative }
.title { padding-top: 3.2rem }
```

### [Super simple breathing box with clip-path: shape()](https://codepen.io/thebabydino/pen/ZYENVOQ)

on scroll: div.box: clip-path | made with: @keyframes · clip-path

```css
.box { clip-path: shape(from 25% 0, curve to 25% 100% with calc((1 + var(--sgn))*25%) 50%, hline to 75%, curve to 75% 0 with calc((3 - var(--sgn))*25%) 50%, close ); animation: breathe .5s ease-in-out infinite alternate }
@keyframes breathe animates --sgn
```

### [Image Clip Path](https://codepen.io/z-rayc/pen/WbNzWBj)

on hover of div.card: div.card: transform+top | made with: transition · :hover · clip-path · custom properties driven by JS

```css
.card { position: relative; box-shadow: 0 0 10px #0004; transition: transform 300ms ease }
.card:hover, .card:focus-within { transform: scale(1.05) }
.card__content { position: relative }
.card__content > :first-child { margin-top: 0 }
.card__content > :last-child { margin-bottom: 0 }
.card .img-container { position: absolute; top: 0; bottom: 0 }
.card .img-frame { clip-path: url("#rounded-frame") }
.control-panel { position: absolute; top: 0; box-shadow: 0 0 5px #0004 }
.control-panel label { margin-bottom: 0.25em }
#width, #rotate { margin-bottom: 1em }
```

```js
style.setProperty("--ratio", e.target.value)
```

### [HoneyHive](https://codepen.io/masakazuimai/pen/raNJZNY)

made with: transition · :hover · clip-path

```css
.gallery { transform: translateX(calc((var(--w) + var(--gap)) / -4)) }
.hexagon { position: relative; margin-bottom: calc(-1 * (var(--h) - var(--row-pitch))); clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%) }
.gallery .hexagon:nth-child(n + 6):nth-child(-n + 10), .gallery .hexagon:nth-chi { transform: translateX(calc((var(--w) + var(--gap)) / 2)) }
.hexagon-inner { background-position: center; transition: transform 0.3s ease }
.hexagon:hover .hexagon-inner { transform: scale(1.4) }
```

### [CSS pseudo elements, flexbox, clip-path](https://codepen.io/AliAhmadNiaz/pen/NPWydzq)

made with: clip-path

```css
.container { position: relative }
.sun { position: absolute; top: 4vh }
.main1 { position: absolute; border-bottom: solid black 0.65vh; bottom: 8vh; clip-path: polygon(0 0%, 100% 9%, 100% 100%, 0 100%) }
.main1::before { position: absolute; top: 0; clip-path: polygon(0 0%, 100% 0%, 100% 100%, 0 17%) }
.main2 { position: absolute; bottom: 8vh; clip-path: polygon(0 9%, 100% 0%, 100% 100%, 0 100%); padding-top: 6vh }
.innerbox2 { transform: skewY(-22deg) }
.main2::before { position: absolute; top: 0; clip-path: polygon(0 0%, 100% 0%, 100% 12%, 0 100%) }
.main3 { position: absolute; bottom: 8vh; clip-path: polygon(0 9%, 100% 0%, 100% 100%, 0 100%); border-bottom: solid black 0.65vh; padding-top: 6vh }
.innerbox3 { transform: skewY(-27deg) }
.main3::before { position: absolute; top: 0; clip-path: polygon(0 0%, 100% 0%, 100% 10%, 0 100%) }
.main4 { position: absolute; bottom: 8vh; clip-path: polygon(0 9%, 100% 0%, 100% 100%, 0 100%) }
.main4::before { position: absolute; top: 0; clip-path: polygon(0 0%, 100% 0%, 100% 11%, 0 100%) }
```

### [Clip-Path and Border-Radius Modern](https://codepen.io/darshit_tank/pen/qEBmPqg)

made with: transition · :hover · clip-path

```css
h1 { margin-bottom: 20px }
.modern-clip { box-shadow: 4px 4px 15px rgba(255, 255, 255, 0.1) }
.clip-path { clip-path: path("M0,50 Q0,0 50,0 L150,0 Q200,0 200,50 L200,150 Q200,200 150,200 L50,200 Q0,200 0,150 Z"); transition: 0.3s ease-in-out }
.border-radius { transition: 0.3s ease-in-out }
.clip-path:hover { clip-path: path("M0,60 Q0,0 60,0 L140,0 Q200,0 200,60 L200,140 Q200,200 140,200 L60,200 Q0,200 0,140 Z") }
.border-radius:hover { transition: 0.3s ease-in-out }
```

### [div container with diagonal corner border using clip-path](https://codepen.io/ejlambo/pen/gbOPdGe)

made with: clip-path

```css
.diagonal-box { position: relative; clip-path: polygon(0 0, 85% 0, 100% 25%, 100% 100%, 0 100%) }
```

### [Clip Path Text Animation on Scroll](https://codepen.io/ScrollMoo/pen/RNwbZWX)

held: fixed div.center | on scroll: div.: clip-path ×2 | made with: position: fixed · clip-path

```css
.center { position: fixed }
.wrap { position: relative }
.wrap div { text-transform: uppercase; position: absolute }
.wrap div:nth-child(4) { clip-path: circle(var(--scrollmoo-offset4, 142%) at 100% 0) }
.wrap div:nth-child(3) { clip-path: circle(var(--scrollmoo-offset3, 142%) at 100% 0) }
.wrap div:nth-child(2) { clip-path: circle(var(--scrollmoo-offset2, 142%) at 100% 0) }
.wrap div:nth-child(1) { clip-path: circle(var(--scrollmoo-offset1, 142%) at 100% 0) }
```

### [Magnifying glass cursor](https://codepen.io/BlogFire/pen/QwLRYNX)

on scroll: span.char: transform+opacity ×15, img.card-image: transform+clip-path+filter+top | on hover of div.card: span.char: transform+opacity ×8, img.card-image: transform+clip-path+filter+top | made with: transition · :hover · clip-path · mix-blend-mode · GSAP

```css
.card { position: relative; box-shadow: 0.5rem 0.5rem 3rem -0.75rem rgba(0 0 0 / 0.7) }
.top-text .char { translate: 4rem 0; opacity: 0 }
.try-it { position: absolute; bottom: 0; scale: 0; transition: opacity 0.8s }
.card:hover > .try-it { opacity: 0 }
img { clip-path: circle(2.5rem at 82% 82%); filter: brightness(1.5); scale: 1.5 }
.card:hover > .magnifying-glass { scale: 1 }
.magnifying-glass { position: absolute; bottom: -4.45rem; scale: 0; transition: scale 0.7s ease; background-position: 58% -55, -15% 90%, -5% 100%, 5% 110%, 20% 120%, -70% 170%, -35% 210%, -10% 215%, 80% 225%, -35% 25%, -10% 30%, 135% 15%, 8 }
.orb-glass:before { position: absolute; top: 37px; transform: rotate(298deg); filter: blur(3px); mix-blend-mode: screen }
.orb-glass:after { position: absolute; top: 58px; transform: rotate(85deg); filter: blur(3px); mix-blend-mode: screen }
```

```js
gsap.timeline({})
```

### [clip-path inverse](https://codepen.io/tomhermans/pen/ogvRqVN)

made with: clip-path

```css
.shape { clip-path: polygon(var(--p)) }
.shape.invert { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, var(--p)) }
```

### [Clip Path CSS Usage](https://codepen.io/darshit_tank/pen/PwYBKMR)

made with: transition · :hover · clip-path

```css
.footer { position: relative; clip-path: polygon(0% 20%, 100% 0%, 100% 100%, 0% 100%) }
.footer-column h3 { margin-bottom: 15px }
.footer-column ul li { margin-bottom: 10px }
.footer-column ul li a { transition: color 0.3s ease }
```

### [Simple spinning](https://codepen.io/AlperZM/pen/ZYzRbvR)

on scroll: div.box: transform+top ×3, div.container: transform+top | made with: @keyframes · clip-path · backdrop-filter · 3D (perspective / preserve-3d)

```css
#frame { position: relative; box-shadow: 0 0 16px 4px #000 }
#blur-rect { position: relative; top: 25%; box-shadow: 0 0px 12px 4px rgb(0, 0, 0); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); perspective: 650px }
#red { position: relative; top: 5%; opacity: 0.5; clip-path: polygon( 50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35% ); animation: spinning-around 4s linear infinite }
#blue { position: absolute; top: 10%; opacity: 0.5; clip-path: polygon( 30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30% ); animation: spinning-around 4s linear infinite }
#yellow { position: absolute; top: 50%; opacity: 0.5; clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); animation: spinning-around 4s linear infinite }
0% { transform: rotate(0) }
100% { transform: rotate(360deg) }
.container { position: absolute; top: 10%; animation: rolling-cube 4s linear infinite }
.cube { perspective: 300px }
.face { position: absolute }
.front { transform: translateZ(50px) }
.back { transform: rotateY(180deg) translateZ(50px) }
```

### [CSS Only Mask Scroll](https://codepen.io/pixelgridui/pen/GgKdoYB)

held: fixed div.text, fixed div.text, fixed div.text, fixed div.pp-widget, fixed button.pp-reopen | on scroll: span.pp-reopen-dot: transform+opacity | on hover of a.pp-btn-yt: a.pp-btn-yt: background, span.pp-reopen-dot: transform+opacity+top | made with: position: fixed · clip-path

```css
.row { background-position: 0 0; position: relative }
.text-holder { position: absolute; inset: 0%; -webkit-clip-path: inset(0px 0px 0px 0px); clip-path: inset(0px 0px 0px 0px) }
.text { transform: translateZ(0); margin-top: 0; margin-bottom: 0; position: fixed; inset: 0% }
```

### [Plain CSS Loaders "Clip-path"](https://codepen.io/editor/basseldabbagh/pen/01942c87-71e9-7893-8fa7-e96283dcca47)

made with: @keyframes · clip-path

```css
main { padding-top: 0.75rem; padding-bottom: 0.75rem }
.loader-wrapper { position: relative }
.loader-wrapper > p { opacity: 0.15 }
.floating { position: absolute !important; top: 50%; transform: translate(-50%, -50%) }
.loader { position: relative }
.loader span { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.loader span::before { position: absolute; top: 50%; transform: translate(-50%, -50%); animation: rotate 4s linear infinite; animation: rotate var(--duration) linear infinite }
.loader span.reverse::before { animation: rotate 4s reverse linear infinite; animation: rotate var(--duration) reverse linear infinite }
0% { transform: translate(-50%, -50%) rotate(0deg) }
100% { transform: translate(-50%, -50%) rotate(360deg) }
.loader.triangle span { clip-path: polygon(50% 0, 0 100%, calc(5px * 1.5) calc(100% - 5px), 50% calc(5px * 2), calc(100% - (5px * 1.5)) calc(100% - 5px), calc(5px * 1.5) calc(100% - 5px), 0 100%, 100% 100%); clip-path: polygon(50% 0, 0 100%, ca }
.loader.square span { clip-path: polygon(50% 0, 50% 5px, 5px 50%, 50% calc(100% - 5px), calc(100% - 5px) 50%, 50% 5px, 50% 0, 100% 50%, 50% 100%, 0 50%); clip-path: polygon(50% 0, 50% var(--border-size), var(--border-size) 50%, 50% calc(100%  }
```

### [Parallelogram split hover effect](https://codepen.io/ZachSaucier/pen/ByBLdNE)

made with: transition · :hover · clip-path

```css
&::before, &::after { position: absolute; top: 0; transition: 0.2s; clip-path: polygon(67px 0%, 100% 0%, calc(100% - 67px) 100%, -0% 100%) }
&::before { clip-path: polygon(0% 0%, 0% 0%, 0% 50%, 0% 50%) }
&::after { clip-path: polygon(100% 50%, 100% 50%, 100% 100%, 100% 100%) }
&::before { clip-path: polygon(0% 0%, 100% 0%, calc(100% - 33px) 51%, 0% 51%) }
&::after { clip-path: polygon(33px 50%, 100% 50%, 100% 100%, 0% 100%) }
```

### [alphabet 2](https://codepen.io/erdouane/pen/GgKqYJo)

made with: clip-path

```css
.lettre { transform:scale(.75) }
.lettre:nth-child(3) { clip-path:polygon(40.25% 0.32%, 42.37% 0.32%, 50.84% 0.32%, 55.08% 0.32%, 61.01% 0.32%, 85.16% 100%, 80.5% 100%, 76.27% 100%, 66.52% 100%, 62.28% 80.92%, 58.05% 80.92%, 53.81% 80.92%, 43.22% 80.92%, 45.76% 68.42%, 50.84% }
.lettre:nth-child(4) { clip-path:polygon(19.06% 0.32%, 72.45% 0.32%, 80.93% 6.57%, 80.93% 40.46%, 66.94% 48.35%, 81.77% 56.25%, 81.77% 93.75%, 73.3% 100%, 43.64% 100%, 43.64% 87.5%, 62.71% 87.5%, 62.71% 59.21%, 53.81% 54.27%, 43.22% 54.27%, 43 }
.lettre:nth-child(5) { clip-path:polygon(26.69% 0.32%, 42.37% 0.32%, 72.45% 0.32%, 80.93% 6.57%, 80.93% 32.89%, 67.79% 32.89%, 61.86% 32.89%, 61.86% 12.82%, 50.84% 12.82%, 37.71% 12.82%, 37.71% 87.5%, 62.28% 87.5%, 62.28% 66.77%, 81.35% 66.77% }
.lettre:nth-child(6) { clip-path:polygon(18.64% 0.32%, 50.84% 0.32%, 73.72% 0.32%, 81.77% 6.57%, 81.77% 42.76%, 81.77% 94.07%, 73.72% 100%, 63.55% 100%, 43.22% 100%, 43.22% 87.5%, 55.08% 87.5%, 62.71% 87.5%, 62.71% 13.15%, 50.84% 13.15%, 37.71 }
.lettre:nth-child(7) { clip-path:polygon(23.72% 0.32%, 46.61% 0.32%, 76.27% 0.32%, 76.27% 13.48%, 63.55% 13.48%, 43.22% 13.48%, 43.22% 29.6%, 43.22% 42.1%, 59.32% 42.1%, 72.03% 42.1%, 72.03% 55.26%, 59.32% 55.26%, 43.22% 55.26%, 43.22% 72.36%, }
.lettre:nth-child(8) { clip-path:polygon(23.72% 0.32%, 46.61% 0.32%, 76.27% 0.32%, 76.27% 13.48%, 63.55% 13.48%, 43.22% 13.48%, 43.22% 29.6%, 43.22% 42.1%, 59.32% 42.1%, 72.03% 42.1%, 72.03% 55.26%, 59.32% 55.26%, 43.22% 55.26%, 43.22% 65.78%, }
.lettre:nth-child(9) { clip-path:polygon(26.27% 0.32%, 46.61% 0.32%, 73.72% 0.32%, 81.77% 6.25%, 81.77% 30.92%, 62.71% 30.92%, 62.71% 12.82%, 37.71% 12.82%, 37.71% 52.63%, 37.71% 87.5%, 63.13% 87.5%, 63.13% 59.21%, 48.72% 59.21%, 48.72% 46.38% }
.lettre:nth-child(10) { clip-path:polygon(17.79% 0.32%, 36.86% 0.32%, 36.86% 23.02%, 36.86% 41.11%, 62.71% 41.11%, 62.71% 23.02%, 62.71% 0.32%, 82.62% 0.32%, 82.62% 32.89%, 82.62% 65.78%, 82.62% 100%, 63.13% 100%, 63.13% 72.36%, 63.13% 54.93%,  }
.lettre:nth-child(11) { clip-path:polygon(40.67% 0.32%, 50.84% 0.32%, 60.16% 0.32%, 60.16% 9.86%, 60.16% 23.02%, 60.16% 32.89%, 60.16% 49.34%, 60.16% 59.21%, 60.16% 72.36%, 60.16% 85.52%, 60.16% 100%, 50.84% 100%, 40.67% 100%, 40.67% 85.52%, 40 }
.lettre:nth-child(12) { clip-path:polygon(61.44% 0.32%, 67.79% 0.32%, 80.5% 0.32%, 80.5% 9.86%, 80.5% 23.02%, 80.5% 39.47%, 80.5% 59.21%, 80.5% 72.36%, 80.5% 93.42%, 72.03% 100%, 50.84% 100%, 28.81% 100%, 20.33% 93.42%, 20.33% 85.52%, 20.33% 66 }
.lettre:nth-child(13) { clip-path:polygon(19.91% 0.32%, 25.42% 0.32%, 38.98% 0.32%, 38.98% 26.31%, 38.98% 43.09%, 60.16% 0.32%, 67.79% 0.32%, 81.35% 0.32%, 55.08% 48.68%, 84.74% 100%, 76.27% 100%, 63.55% 100%, 38.98% 55.59%, 38.98% 85.52%, 38.9 }
```

### [alphabet 1](https://codepen.io/erdouane/pen/GgKqYRo)

held: fixed div.lienSite | made with: position: fixed · clip-path

```css
.lettre { transform:scale(.75) }
.lettre:nth-child(3) { clip-path:polygon(95px 1px, 144px 1px, 201px 304px, 157px 304px, 147px 246px, 102px 246px, 108px 208px, 140px 208px, 120px 72px, 83px 304px, 37px 304px) }
.lettre:nth-child(4) { clip-path:polygon(45px 1px, 171px 1px, 191px 20px, 191px 123px, 158px 147px, 193px 171px, 193px 285px, 173px 304px, 103px 304px, 103px 266px, 148px 266px, 148px 180px, 127px 165px, 102px 165px, 102px 128px, 127px 128px,  }
.lettre:nth-child(5) { clip-path:polygon(63px 1px, 171px 1px, 191px 20px, 191px 100px, 146px 100px, 146px 39px, 89px 39px, 89px 266px, 147px 266px, 147px 203px, 192px 203px, 192px 285px, 172px 304px, 63px 304px, 44px 285px, 44px 20px) }
.lettre:nth-child(6) { clip-path:polygon(44px 1px, 174px 1px, 193px 20px, 193px 286px, 174px 304px, 102px 304px, 102px 266px, 148px 266px, 148px 40px, 89px 40px, 89px 304px, 44px 304px) }
.lettre:nth-child(7) { clip-path:polygon(56px 1px, 180px 1px, 180px 41px, 102px 41px, 102px 128px, 170px 128px, 170px 168px, 102px 168px, 102px 264px, 182px 264px, 182px 304px, 56px 304px) }
.lettre:nth-child(8) { clip-path:polygon(56px 1px, 180px 1px, 180px 41px, 102px 41px, 102px 128px, 170px 128px, 170px 168px, 102px 168px, 102px 304px, 56px 304px) }
.lettre:nth-child(9) { clip-path:polygon(62px 1px, 174px 1px, 193px 19px, 193px 94px, 148px 94px, 148px 39px, 89px 39px, 89px 266px, 149px 266px, 149px 180px, 115px 180px, 115px 141px, 194px 141px, 194px 284px, 174px 304px, 63px 304px, 43px 28 }
.lettre:nth-child(10) { clip-path:polygon(42px 1px, 87px 1px, 87px 125px, 148px 125px, 148px 1px, 195px 1px, 195px 304px, 149px 304px, 149px 167px, 87px 167px, 87px 304px, 42px 304px) }
.lettre:nth-child(11) { clip-path:polygon(96px 1px, 142px 1px, 142px 304px, 96px 304px) }
.lettre:nth-child(12) { clip-path:polygon(145px 1px, 190px 1px, 190px 284px, 170px 304px, 68px 304px, 48px 284px, 48px 201px, 94px 201px, 94px 265px, 145px 265px) }
.lettre:nth-child(13) { clip-path:polygon(47px 1px, 92px 1px, 92px 131px, 142px 1px, 192px 1px, 130px 148px, 200px 304px, 150px 304px, 92px 169px, 92px 304px, 47px 304px) }
```

### [Liquid Filling Effect on Text - "Oathan Rex"](https://codepen.io/oathanrex/pen/XJrdJYy)

made with: @keyframes · clip-path

```css
h1 { position: relative }
h1:before { position: absolute; top: 0; animation: animate 6s infinite; clip-path: polygon( 0 100%, 100% 100%, 100% 0, 0 0) }
0% { clip-path: polygon(0 100%, 100% 100%, 100% 75%, 0 75%) }
25% { clip-path: polygon(0 100%, 100% 100%, 100% 50%, 0 50%) }
50% { clip-path: polygon(0 100%, 100% 100%, 100% 30%, 0 30%) }
75% { clip-path: polygon(0 100%, 100% 100%, 100% 60%, 0 60%) }
100% { clip-path: polygon(0 100%, 100% 100%, 100% 75%, 0 75%) }
@keyframes animate animates clip-path
```

### [clip-path animation](https://codepen.io/masakazuimai/pen/pvzJyMR)

made with: position: fixed · clip-path · scroll listener

```css
section { position: fixed; top: 0; clip-path: circle(0px at center) }
.container { position: relative; margin-top: 350vh }
.container h2 { margin-bottom: 20px }
.title { position: relative; top: 10% }
```

```js
addEventListener('scroll', function () {
```

### [A bulging gradient](https://codepen.io/kdurber/pen/OJKeGdy)

made with: @keyframes · clip-path

```css
.bg { clip-path: polygon(0 35%, 100% 35%, 100% 65%, 0 65%) }
.clip-svg { clip-path: url(#clippy) }
.move-circle { animation: move-circle 10.5s infinite; animation-direction: alternate; animation-timing-function: ease-in-out }
.move-rect { animation: move-rect 10.5s infinite; animation-direction: alternate; animation-timing-function: ease-in-out }
article { filter: drop-shadow(0 0 3px rgb(0,0,0,0.85)) }
@keyframes move-circle animates cx
@keyframes move-rect animates x
```

### [border-radius to clip-path](https://codepen.io/Arsentii-Rumyantsev/pen/XWvLBVd)

made with: clip-path

```css
.inner { position: relative }
.box { position:absolute; top: 0 }
```

### [ConicGradient vs LinearGradient vs ClipPath vs MaskImage](https://codepen.io/artlung/pen/ZEgdxaG)

made with: @keyframes · :hover · clip-path · mask

```css
details { position: relative }
details summary { position: absolute; top: 25%; text-underline-offset: 0.2rem }
details p { position: absolute; top: 40% }
details.clipper { clip-path: polygon(12.5% 0, 25% 25%, 37.5% 0, 50% 25%, 62.5% 0, 75% 25%, 87.5% 0, 100% 25%, 87.5% 50%, 100% 75%, 87.5% 100%, 75% 75%, 62.5% 100%, 50% 75%, 37.5% 100%, 25% 75%, 12.5% 100%, 0 75%, 12.5% 50%, 0 25%) }
details.conical[open] { animation: 6s conic-colors steps(5, end) infinite }
details.conical[open]:hover { animation: none }
details.linear { animation: none }
details.linear[open] { animation: 9s linear-colors steps(10, end) infinite }
details.linear[open]:hover { animation: none }
details.maskimage { mask-image: url('data:image/svg+xml,<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" width="100%" height="100%" viewBox="0, 0, 96, 48"><g><path d="M0,12 L12,-0  }
@keyframes conic-colors animates --c1, --c2, --c3, --c4
@keyframes linear-colors animates --l1, --l2, --l3, --l4, --l5, --l6, --l7, --l8, --l9
```

### [Magnify Glass - Javascript](https://codepen.io/samsimite/pen/yLmWmEP)

made with: clip-path · pointer / mouse tracking

```css
.box { position: absolute; top: 0; bottom: 0 }
.wall { position: absolute; top: 15%; bottom: 15% }
.the-floor { position: absolute; bottom: 0px; clip-path: polygon(25% 50%, 75% 50%, 100% 100%, 0% 100%) }
.the-left { position: absolute; bottom: 0px; clip-path: polygon(0 0, 100% 25%, 100% 75%, 0 100%) }
.the-top { position: absolute; top: 0%; clip-path: polygon(0 0, 100% 0, 75% 100%, 25% 100%) }
.the-right { position: absolute; top: 0%; clip-path: polygon(0 25%, 100% 0, 100% 100%, 0 75%) }
.img-magnifier-container { position: relative }
.img-magnifier-glass { position: absolute }
```

```js
addEventListener("mousemove", moveMagnifier)
```

### [The CSS geometric loaders](https://codepen.io/melnik909/pen/yLmWadq)

on scroll: div.uia-clippy-loader: clip-path ×3 | made with: @keyframes · prefers-reduced-motion · clip-path

```css
.uia-clippy-loader { --_uia-clippy-loader-animation-name: var(--uia-clippy-loader-animation-name); --_uia-clippy-loader-animation-duration: var(--uia-clippy-loader-animation-duration, 2s); --_uia-clippy-loader-animation-fill-mode: var(--uia- }
.uia-clippy-loader::before { position: absolute; inset: var(--_uia-clippy-loader-stroke); animation-name: var(--_uia-clippy-loader-animation-name); animation-duration: var(--_uia-clippy-loader-animation-duration); animation-fill-mode: var(--_uia-cli }
[data-uia-clippy-loader-skin="1"][data-uia-clippy-loader-mod="1"], [data-uia-cli { --uia-clippy-loader-animation-name: uia-clippy-loader-1 }
[data-uia-clippy-loader-skin="1"][data-uia-clippy-loader-mod="2"], [data-uia-cli { --uia-clippy-loader-animation-name: uia-clippy-loader-2 }
[data-uia-clippy-loader-skin="1"][data-uia-clippy-loader-mod="3"], [data-uia-cli { --uia-clippy-loader-animation-name: uia-clippy-loader-3 }
0%, 30% { clip-path: polygon(0 15%, 0 0, 85% 0, 85% 0, 100% 0, 100% 85%, 100% 85%, 100% 100%, 15% 100%, 15% 100%, 0 100%, 0 15%) }
70%, 100% { clip-path: polygon(0 0, 85% 0, 85% 0, 100% 0, 100% 85%, 100% 85%, 100% 100%, 15% 100%, 15% 100%, 0 100%, 0 15%, 0 15%) }
0%, 20% { clip-path: polygon(0 0, 100% 0, 100% 50%, 100% 100%, 0 100%, 0 50%) }
40%, 60% { clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%) }
80%, 100% { clip-path: polygon(100% 0, 100% 50%, 100% 100%, 0 100%, 0 50%, 0 0) }
0%, 20% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%) }
40%, 60% { clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%) }
```

### [clip-path + radial gradient experiments](https://codepen.io/ogreogles/pen/WNVaBaj)

made with: clip-path

```css
.container { clip-path: polygon(45% 0%, 0% 100%, 25% 0%, 25% 45%, 75% 55%, 75% 5%, 15% 75%, 25% 75%, 15% 10%, 45% 45%) }
```

### [css style for my Codepen](https://codepen.io/ogreogles/pen/JjgBxYz)

made with: :hover · (hover: hover) gate · clip-path

```css
.profile-header { clip-path: polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 25%, 25% 0%, 25% 100%, 100% 100%, 100% 0%) }
#profile-name-header { position: relative }
#profile-name-header::before { position: absolute; top: 100%; bottom: 20% }
.ProfileTabs-module_profileNav1-soVIZ { border-bottom: 5px solid #452068 }
```

### [Super simple pure CSS hexagon](https://codepen.io/thebabydino/pen/JjgvvVP)

made with: clip-path

```css
.regular-hexagon { clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%) }
```

### [Responsive Design: Aspect-Ratio + Clip-Path + DataList](https://codepen.io/XxFULLDLCxX/pen/OJKZjYj)

made with: clip-path

```css
.aspect-ratio .box { position: relative }
.aspect-ratio .box::before { position: absolute; -webkit-clip-path: polygon(0 0, 100% 0, 52% 100%, 0 100%); clip-path: polygon(0 0, 100% 0, 52% 100%, 0 100%) }
.aspect-ratio-n2 { position: relative }
.aspect-ratio-n2 .box { position: absolute }
.aspect-ratio-n2 .box::before { position: absolute; -webkit-clip-path: polygon(0 0, 100% 0, 52% 100%, 0 100%); clip-path: polygon(0 0, 100% 0, 52% 100%, 0 100%) }
#polygon-container { position: relative }
.polygon::before { position: absolute; -webkit-clip-path: polygon(0 0, 100% 0, 75% 100%, 0 100%); clip-path: polygon(0 0, 100% 0, 75% 100%, 0 100%) }
.label { position: absolute }
.ab { top: 5% }
.cd { bottom: 5% }
.parent { position: relative }
.child { position: absolute }
```

### [Wheel Gallery (CSS only)](https://codepen.io/cbolson/pen/MWNOxvB)

on scroll: div.hoverable: filter+top ×8, g.[object: transform+opacity+top | on hover of li.img: div.hoverable: filter ×2, g.[object: transform+opacity+top | made with: position: fixed · @keyframes · transition · :hover · :has() · clip-path

```css
.wheel { --inner-offset: clamp(2rem, 3vw, 3rem); --title-offset: -40px; position: relative }
.wheel > li:nth-child(1) { --title-rotate: -2deg }
.wheel > li:nth-child(2) { --title-rotate: 43deg }
.wheel > li:nth-child(3) { --title-rotate: 88deg }
.wheel > li:nth-child(4) { --title-rotate: 132deg }
.wheel > li:nth-child(5) { --title-rotate: 177deg }
.wheel > li:nth-child(6) { --title-rotate: 222deg }
.wheel > li:nth-child(7) { --title-rotate: 265deg }
.wheel > li:nth-child(8) { --title-rotate: 311deg }
.wheel > li { position: absolute }
.wheel > li .hoverable, .wheel > li::after { position: absolute; inset: var(--inset, 0); background-position: center; clip-path: var(--clip-1); transition: opacity,filter,clip-path; filter: var(--hover-filter) }
.wheel > li::after { --inset: var(--inner-offset); animation: var(--animation-after) }
```

### [Rhombus grid layout](https://codepen.io/andyranged/pen/jOgaYLo)

made with: :focus-visible · clip-path

```css
.rhombus-grid__cell { -webkit-clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%) }
.rhombus-grid__cell:focus-visible { transform: scale(1.1) }
```

### [Pop-out Avatars with clip-path & blurred background on hover](https://codepen.io/cbolson/pen/YzmENGy)

on hover of img.: img.: filter+top, p.: opacity+top | made with: transition · :hover · clip-path

```css
.avatar { position: relative }
.avatar-img { clip-path: path(var(--img-clip)) }
.avatar-img::before { position: absolute; inset: 50% 0 0 0; background-position: center; filter: blur(var(--bg-blur)); transition: filter 300ms ease-in-out }
.avatar-img > img { transition: scale 300ms, filter 300ms; transform-origin: bottom; scale: var(--img-scale, .9); filter: var(--img-shadow) }
.avatar > p { position: absolute; bottom: -1rem; translate: 0 var(--name-y,-50px); opacity: var(--name-opacity,0); transition-name: translate, opacity }
.avatar:hover { --img-scale: 1.1; --name-opacity: 1 }
```

### [Tabs Indicator clip-path & pseudo-element](https://codepen.io/alishata/pen/XWvRoVq)

made with: transition · clip-path · custom properties driven by JS

### [Pie split into unequal slices with content](https://codepen.io/thebabydino/pen/XWvKjJJ)

made with: transition · :hover · clip-path

```css
.slice { transform: rotate(calc(var(--sa))) translate(calc(var(--hov, 0)*1em)); clip-path: polygon(50% 50%, 100% calc(50% - var(--dy)), 100% calc(50% + var(--dy))); transition: 0.3s }
.slice::after { rotate: calc(-1*var(--sa)) }
```

### [Angled sections](https://codepen.io/thebabydino/pen/bGXeGoa)

made with: clip-path

```css
.wrap { filter: drop-shadow(2px 2px 5px #000c) }
.item { margin-top: calc(var(--not-ini)*-1*1.5em); clip-path: polygon(0 calc(var(--_p)*var(--not-ini)*1.5em), 100% calc(var(--q)*var(--not-ini)*1.5em), 100% calc(100% - var(--q)*var(--not-fin)*1.5em), 0 calc(100% - var(--_p)*var }
.item.top::before { filter: url(#halftone) }
.stars { position: relative; translate: 20% 20%; rotate: -9deg }
.stars::before, .stars::after { position: absolute; inset: 0 }
.stars::before { translate: 130%; scale: 0.5 }
.stars::after { translate: -50% 50%; scale: 0.25 }
h3 { text-transform: capitalize }
.badge { translate: 0 calc(var(--not-fin)*.25*1.5em); text-transform: uppercase; filter: url(#noclip) drop-shadow(2px 2px 5px #000c) }
.badge::before { box-shadow: 0 0 0 0.5em #0007 }
.badge:not(.prize)::after { margin-top: -0.25em }
img { object-position: calc(var(--q)*100%) }
```

### [Before-After Image Slider](https://codepen.io/ThomasEgMatthiesen/pen/GRVRBYK)

made with: clip-path

```css
#container { position: relative }
.img-wrapper { position: absolute }
.img-wrapper:nth-child(2) { clip-path: inset(0px 0px 0px 50%) }
#line { position: absolute; transform: translateX(-50%) }
input { position: absolute }
input::-webkit-slider-thumb { box-shadow: 0px 0px 8px 2px rgba(0,0,0,0.1) }
input::-moz-range-thumb { box-shadow: 0px 0px 8px 2px rgba(0,0,0,0.1) }
```

### [Diamond layout](https://codepen.io/aliaks_ei/pen/RwXbwWz)

made with: clip-path

```css
&:nth-child(3n + 2) { margin-top: calc((-0.5 * var(--sq-size)) - (0.5 * var(--sq-gap))) }
&:last-child { margin-top: calc((-0.5 * var(--sq-size)) - (0.5 * var(--sq-gap))) }
```

### [Slanted grid gallery](https://codepen.io/cbolson/pen/GRbzyGJ)

on scroll: div.: opacity+filter+top ×8 | on hover of img.: div.: opacity, div.: opacity+clip-path+filter | made with: @keyframes · transition · :hover · :has() · clip-path · 3D (perspective / preserve-3d)

```css
.wrapper > div { position: relative; transition: scale 500ms ease-in-out, filter 500ms ease-in-out, clip-path 500ms ease-in-out 500ms; clip-path: polygon(var(--_clip-path)); transform: translate3d(0,0,0) }
.wrapper > div:nth-child(n+4) { margin-top: calc(var(--_offset-3) * -1 + var(--_gap)) }
.wrapper > div:hover { transition: scale 500ms ease-in-out, filter 500ms ease-in-out, clip-path 500ms ease-in-out 500ms; scale: 1.3; opacity: 1 }
.wrapper:has(:hover) > div:not(:hover) { filter: grayscale(1) blur(3px); opacity: .5; scale: 0.9 }
body::after { position: absolute; top: 1rem }
@keyframes zIndexHack animates z-index
```

### [House of Dreams](https://codepen.io/BlogFire/pen/mdZaypP)

made with: clip-path · GSAP

```css
.maison { clip-path: polygon( 32% 0%, 2% 30%, 0% 100%, 100% 100%, 100% 40%, 80% 19%, 81% 0%, 73% 0%, 70% 13% ) }
```

```js
gsap.from("svg circle", {
```

### [demo Animated clip-path on hover](https://codepen.io/cbolson/pen/mdZabxX)

on hover of button.: button.: clip-path | made with: @starting-style · transition · :hover · :focus-visible · clip-path

```css
@starting-style { clip-path: polygon(0% 100%,0 0%, 30% 0%, 30% 0%, 70% 0%,70% 0%,100% 0%, 100% 100%, 70% 100%,70% 100%, 30% 100%, 30% 100%) }
button:focus-visible, button:hover { clip-path: polygon(0% 80%,0 20%, 30% 20%, 30% 20%, 70% 20%,70% 0%,100% 50%, 100% 50%, 70% 100%,70% 80%, 30% 80%, 30% 80%) }
```

### [Slanted buttons using clip-path](https://codepen.io/cbolson/pen/LYKgOww)

on hover of button.: button.: background+top | made with: transition · :hover · :focus-visible · clip-path

```css
.buttons > button { transition: background-color 300ms ease-in-out, scale 300ms ease-in-out; clip-path: polygon( var(--_offset) 0, 100% 0, calc(100% - var(--_offset)) 100%, 0 100% ) }
.buttons > button:first-child { clip-path: polygon(0% 0, 100% 0, calc(100% - var(--_offset)) 100%, 0 100%) }
.buttons > button:last-child { clip-path: polygon(var(--_offset) 0, 100% 0, 100% 100%, 0 100%) }
.buttons > button:focus-visible, .buttons > button:hover { scale: 1.1 }
```

### [tvshow img grided & cartooned](https://codepen.io/gc-nomade/pen/oNrywNN)

made with: transition · :hover · clip-path

```css
figure { filter: drop-shadow( 10px 0 white) drop-shadow( -10px 0 white) drop-shadow( 0 10px white) drop-shadow( 0 -10px white) drop-shadow(0 0 2px white) url('#goo') }
img { transition: .25s; -o-object-position:top center; object-position:top center; -webkit-clip-path: polygon(0 0, 100% 20%, 100% 80%, 0% 100%); clip-path: polygon(0 0, 100% 20%, 100% 80%, 0% 100%); margin-bottom:-30px }
img:nth-child(odd) { -webkit-clip-path: polygon(0 20%, 100% 0, 100% 100%, 0 80%); clip-path: polygon(0 20%, 100% 0, 100% 100%, 0 80%) }
img:last-child { -webkit-clip-path: polygon(0 20%, 100% 0, 100% 100%, 0 80%); clip-path: polygon(0 20%, 100% 0, 100% 100%, 0 80%) }
```

### [A la sala](https://codepen.io/somaholiday/pen/qBzxJod)

made with: clip-path

```css
svg { position: absolute; top: 0 }
.scrim-wrapper { position: relative }
.scrim { position: absolute; inset: 0 }
.windows { position: relative }
.video { position: absolute }
.window { position: relative }
.window__wall { position: absolute; inset: 0; clip-path: url(#salaPath) }
.window__frame { position: relative; top: 9.375cqh }
.window__frame::before { top: calc(-1 * var(--border-width) - 18.75cqh); transform: rotate(-45deg); position: absolute }
```

### [clip-path CSS example](https://codepen.io/pr0h0/pen/VwJrLOd)

on scroll: div.clipped-image: clip-path+top | made with: @keyframes · clip-path

```css
.clipped-image { animation: clipper 3s infinite linear alternate }
from { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%) }
to { clip-path: polygon(25% 25%, 75% 25%, 75% 75%, 25% 75%) }
@keyframes clipper animates clip-path
```

### [Almost pure CSS highlight nav: glitchy](https://codepen.io/thebabydino/pen/poXrXqa)

made with: transition · clip-path · custom properties driven by JS

```css
&::after { position: absolute; inset: 0; clip-path: inset(0 var(--r) 0 var(--l)) }
```

```js
style.setProperty('--k', +_t.style.getPropertyValue('--i'))
```

### ["On Ne Change Pas"](https://codepen.io/JMChristensen/pen/PorpxVe)

on scroll: div.container: clip-path, video.object: transform+top | on hover of a.: div.container: clip-path, video.object: transform+top | made with: transition · clip-path

```css
& .object { transform: translate3d(-25%, 0%, 0) }
.object { transform: translate3d(0%, 25%, 0); transition: transform ease 1s }
```

### [clip-path animation using GSAP](https://codepen.io/juan-frontdev/pen/xxoqzxz)

made with: GSAP

```css
.hero { position: relative }
.hero__title { margin-bottom: 5px; opacity: 0; transform: translatey(-20px) }
.hero__subtext { opacity: 0; transform: translatey(-10px) }
.mask { position: absolute; top: 0 }
```

```js
gsap.timeline({
```

### [demo Card with clip-path](https://codepen.io/cbolson/pen/ZEdeEZb)

made with: clip-path

```css
.card { outline-offset: 4px }
main { margin-top: 150px; clip-path: path("M 0 100 c 150 0 120 -75 200 -75 C 280 25 250 100 400 100 L400 1000 0 1000 Z") }
main > img { margin-top: 2.25rem; outline-offset: 2px }
```

### [Simple nav blob - no content duplication](https://codepen.io/thebabydino/pen/RwzoqWj)

held: fixed svg.[object | on scroll: a.: color | on hover of a.: a.: color ×2 | made with: position: fixed · transition · :hover · clip-path · mix-blend-mode · custom properties driven by JS

```css
svg[aria-hidden=true] { position: fixed }
nav { filter: url(#blob); transition: --k 0.35s cubic-bezier(0.32, 1, 0.68, 1) }
a { position: relative; text-transform: capitalize }
a::after { position: absolute; inset: 1px 0; mix-blend-mode: lighten; clip-path: inset(0 var(--r) 0 var(--l)) }
```

```js
style.setProperty('--k', +_t.style.getPropertyValue('--i'))
```

### [Playing with and learning CSS clip-path](https://codepen.io/matt-harris/pen/OJebyjd)

made with: @keyframes · transition · :hover · clip-path · requestAnimationFrame

```css
a:hover { border-bottom: 0.125rem solid khaki }
.circle { clip-path: circle(50% at 50% 50%) }
.hide--top { clip-path: inset(50% 0px 0px 0px) }
.hide--right { clip-path: inset(0px 50% 0px 0px) }
.hide--bottom { clip-path: inset(0px 0px 50% 0px) }
.hide--left { clip-path: inset(0px 0px 0px 50%) }
.hide--all { clip-path: inset(100% 100% 100% 100%) }
.compare { position: relative }
.compare__static { position: absolute; inset: 0 }
.compare__slider { position: absolute; top: 0 }
.compare__range::-webkit-slider-thumb { opacity: 0 }
.compare__line { position: absolute }
```

```js
requestAnimationFrame(() => {
```

### [CSS clip-path Navigation Buttons](https://codepen.io/JMChristensen/pen/JjQGVXj)

on scroll: div.clip-overlay: opacity+clip-path | made with: :hover · :focus-visible · clip-path · custom properties driven by JS

```css
& .clip-overlay { opacity: 1 }
&:focus-visible { outline-offset: 2px }
```

```js
style.setProperty('--clip-right', clipRight)
style.setProperty('--clip-left', clipLeft)
```

### [grid en losange](https://codepen.io/gc-nomade/pen/xxoGjyL)

made with: clip-path

```css
cell:nth-child(1) { -webkit-clip-path: polygon(1% 0, 50% 100%, 100% 0); clip-path: polygon(1% 0, 50% 100%, 100% 0) }
cell:nth-child(2) { -webkit-clip-path: polygon(0 0, 50% 100%, 99% 0); clip-path: polygon(0 0, 50% 100%, 99% 0) }
cell:nth-child(3) { -webkit-clip-path: polygon(0 0, 0 100%, 100% 50%); clip-path: polygon(0 0, 0 100%, 100% 50%) }
cell:nth-child(4) { -webkit-clip-path: polygon(0 50%, 50% 0, 100% 50%, 50% 100%); clip-path: polygon(0 50%, 50% 0, 100% 50%, 50% 100%) }
cell:nth-child(5) { -webkit-clip-path: polygon(100% 0, 0 50%, 100% 100%); clip-path: polygon(100% 0, 0 50%, 100% 100%) }
cell:nth-child(6) { -webkit-clip-path: polygon(0 50%, 50% 0, 100% 50%, 50% 100%); clip-path: polygon(0 50%, 50% 0, 100% 50%, 50% 100%) }
cell:nth-child(7) { -webkit-clip-path: polygon(0 50%, 50% 0, 100% 50%, 50% 100%); clip-path: polygon(0 50%, 50% 0, 100% 50%, 50% 100%) }
cell:nth-child(8) { -webkit-clip-path: polygon(1% 0, 0 99%, 100% 50%); clip-path: polygon(1% 0, 0 99%, 100% 50%) }
cell:nth-child(9) { -webkit-clip-path: polygon(0 50%, 50% 0, 100% 50%, 50% 100%); clip-path: polygon(0 50%, 50% 0, 100% 50%, 50% 100%) }
cell:nth-child(10) { -webkit-clip-path: polygon(100% 0, 0 50%, 100% 99%); clip-path: polygon(100% 0, 0 50%, 100% 99%) }
cell:nth-child(11) { -webkit-clip-path: polygon(50% 0, 1% 100%, 99% 100%); clip-path: polygon(50% 0, 1% 100%, 99% 100%) }
cell:nth-child(12) { -webkit-clip-path: polygon(50% 0, 1% 100%, 99% 100%); clip-path: polygon(50% 0, 1% 100%, 99% 100%) }
```

### [SVG Circle Animate](https://codepen.io/luukee/pen/RwzPWRG)

made with: @keyframes · clip-path

```css
.landing { position: relative }
.circle-logo { position: absolute; top: 51px }
.circle-logo { top: 75px }
.circle-logo { top: 85px }
.circle-cme, .circle-2023 { opacity: 0 }
.circle-svg { position: absolute; top: 0; transform: translate(140px, -140px); clip-path: polygon(25% 28%, 22% 32%, 72% 50%, 73% 100%, 0 100%, 0 0) }
.circle-svg { transform: translate(228px, -238px) }
.circle-svg { transform: translate(225px, -225px) }
.half-circle-orange { transform: rotate(50deg) }
.half-circle-yellow { transform: rotate(40deg) }
.half-circle-dashed { transform: rotate(35deg) }
from { transform: rotate(45deg) }
```

### [You can partially hide things with clip path](https://codepen.io/kdurber/pen/JjQPbqK)

on hover of a.: a.: background | made with: :hover · clip-path

```css
.yeah { clip-path: polygon(0 0, 100% 100%, 0 100%) }
```

### [Responsive Play-Triangle: A Clever Use of CSS Clip-Path Magic](https://codepen.io/mark_sottek/pen/yLWrqeX)

on scroll: div.play-triangle: background | made with: transition · :hover · clip-path

```css
.play-triangle { clip-path: polygon(0% 0%, 0% 100%, 100% 50%); transition: background-color 0.3s ease }
.play-triangle { transform: scale(0.5) }
.play-triangle { transform: scale(1.5) }
```

### [Table with bending sheet effect in rows](https://codepen.io/max131/pen/xxNaaNN)

on scroll: td.: background+top ×3 | made with: transition · :hover · clip-path

```css
caption { margin-bottom: 0.5rem }
table { filter: drop-shadow(0 5px 15px #c1c1c1) }
&:not(:first-child)::after { position: absolute; top: -2rem; transition: background 200ms }
&::after { position: absolute; bottom: 0 }
```

### [Shred it - CSS only](https://codepen.io/BlogFire/pen/eYaMKxe)

on scroll: img.shredded: transform+top, img.intact: transform+top | on hover of img.shredded: img.shredded: transform+top, img.intact: transform+top | made with: clip-path · GSAP

```css
figure { position: relative; outline-offset: 1.5em }
figure::before { position: absolute; inset: -1.5em }
.box { position: absolute; top: calc(100% + 2em) }
.shredded { clip-path: polygon( 0 0, 0 98%, 5% 98%, 5% 0, 10% 0, 10% 98%, 15% 98%, 15% 0, 20% 0, 20% 98%, 25% 98%, 25% 0, 30% 0, 30% 98%, 35% 98%, 35% 0, 40% 0, 40% 98%, 45% 98%, 45% 0, 50% 0, 50% 98%, 55% 98%, 55% 0, 60% 0, 60% 98% }
```

```js
gsap.timeline({})
```

### [Responsive Vertical Slider with Clip-Path Animation | Swiper JS](https://codepen.io/ecemgo/pen/abrYOGG)

held: fixed a.logo | on scroll: div.content: opacity ×2, h1.: transform+opacity ×2, div.background: opacity+clip-path ×2, p.: transform+opacity, div.swiper-slide: opacity, p.: transform+opacity+top | on hover of button.btn: div.background: opacity+clip-path | made with: position: fixed · @keyframes · transition · :hover · clip-path · backdrop-filter

```css
.swiper-slide { position: relative }
.content { position: absolute; top: 14%; opacity: 0 }
.content h1 { margin-bottom: 20px; opacity: 0 }
.content p { opacity: 0 }
.swiper-slide-active .content { opacity: 1 }
.swiper-slide-active .content h1 { animation: moveDown 0.8s ease-in forwards }
.swiper-slide-active .content p { animation: moveDown 1s ease-in forwards; animation-delay: 1s }
0% { transform: translateY(-20px); opacity: 0 }
100% { transform: translateY(0); opacity: 1 }
.background[data-item="one"] { background-position: 50% 40% }
.background[data-item="two"] { background-position: 50% 50% }
.background[data-item="three"] { background-position: 50% 40% }
```

### [Star ratings with clip paths](https://codepen.io/kevinnewcombe/pen/RwmLMyJ)

made with: clip-path · custom properties driven by JS

```css
.stars { margin-bottom: 100px }
.star { clip-path: url(#starpath); transform: translateZ(0) }
```

```js
style.setProperty('--amt', amt)
```

### [Diamond Grid Layout](https://codepen.io/tsotne-ts/pen/bGyrBaj)

on scroll: img.: filter ×8 | on hover of img.: img.: clip-path+filter | made with: @keyframes · transition · :hover · clip-path

```css
.character-gallery img { clip-path: path( "M 80 20 C 100 0 100 0 120 20 C 140 40 160 60 180 80 C 200 100 200 100 180 120 C 160 140 140 160 120 180 C 100 200 100 200 80 180 C 60 160 40 140 20 120 C 0 100 0 100 20 80 Z" ); transition: filter 0.5s, }
.character-gallery img:hover { clip-path: path( "M 0 0 C 100 0 100 0 200 0 C 200 50 200 50 200 80 C 200 100 200 100 200 120 C 200 150 200 150 200 200 C 100 200 100 200 0 200 C 0 150 0 150 0 120 C 0 100 0 100 0 80 Z" ) }
.character-gallery img:not(:hover) { animation: zIndexHack 0.5s }
.character-gallery:hover > img { filter: brightness(1) saturate(0.5) blur(1px) hue-rotate(-0.25turn) }
.character-gallery > img:hover { filter: brightness(1) saturate(1.5) }
@keyframes zIndexHack animates z-index
```

### [🏳️‍🌈  Simple Pride Cursor with Default Cursor Handling - Easily Customizable](https://codepen.io/mark_sottek/pen/jOowoGX)

held: fixed div.custom-cursor | on scroll: a.: color, div.custom-cursor: transform+top | on hover of button.: button.: color, a.: color | made with: position: fixed · :hover · clip-path · pointer / mouse tracking

```css
.custom-cursor { position: fixed; position: fixed; clip-path: polygon(50% 0%, 0% 100%, 100% 100%); transform: translate(-50%, -50%); clip-path: polygon(50% 100%, 0% 0%, 100% 0%); opacity: 0.5 }
.container > * { text-transform: uppercase }
```

```js
addEventListener('mousemove', updateCursor)
addEventListener('mouseenter', handleMouseEnter)
addEventListener('mouseleave', handleMouseLeave)
```

### [Corner Cut-Out Border Box with Image Overlap - CSS](https://codepen.io/Fotek/pen/MWdJqpd)

made with: clip-path

```css
.txt-box { position: relative; clip-path: polygon( 100% 0, 100% calc(100% - var(--edge-size)), calc(100% - var(--edge-size)) 100%, 0 100%, 0 0 ) }
.txt-box::before { position: absolute; inset: 0 }
.txt-box::after { position: absolute; inset: 0; clip-path: polygon( var(--border-width) var(--border-width), calc(100% - var(--border-width)) var(--border-width), calc(100% - var(--border-width)) calc(100% - calc(var(--edge-size) + var(-- }
```

### [Corner Cut-Out Border Box - CSS](https://codepen.io/Fotek/pen/OJYWENq)

made with: clip-path

```css
.box { position: relative; clip-path: polygon( 100% 0, 100% calc(100% - var(--edge-size)), calc(100% - var(--edge-size)) 100%, 0 100%, 0 0 ) }
.box::before { position: absolute; inset: 0 }
.box::after { position: absolute; inset: 0; clip-path: polygon( var(--border-width) var(--border-width), calc(100% - var(--border-width)) var(--border-width), calc(100% - var(--border-width)) calc(100% - calc(var(--edge-size) + var(-- }
```

### [tunnel vision](https://codepen.io/sascha-davidson/pen/PovzeMq)

on scroll: section.: clip-path | made with: clip-path · custom properties driven by JS · scroll listener · pointer / mouse tracking

```css
h1 { position: absolute; top: 2rem }
body > *:nth-child(2) { background-position: center; clip-path: circle(6em at var(--x) var(--y)) }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("scroll", (e) => {
style.setProperty("--x", posX + "px")
style.setProperty("--y", posY + yOffset + "px")
```

### [The hexagon shape](https://codepen.io/netprofit/pen/dyEMJbK)

made with: clip-path

```css
.hexagon-1 { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%) }
.hexagon-2 { clip-path: polygon(-50% 50%, 50% 100%, 150% 50%, 50% 0) }
.hexagon-3 { position: relative; padding-bottom: 28.868%; transform: rotate(-60deg) skewY(30deg) }
.hexagon-3__content { position: absolute; transform: skewY(-30deg) rotate(60deg) }
```

### [Hexagon with text content](https://codepen.io/netprofit/pen/vYwGWoV)

made with: clip-path

```css
.hexagon { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%) }
.hexagon-1 p { position: relative; top: 25% }
.hexagon-2 .shape-start { -webkit-clip-path: polygon(100% 0, 1% 25%, 1% 75%, 100% 100%, 0 100%, 0 0); clip-path: polygon(100% 0, 1% 25%, 1% 75%, 100% 100%, 0 100%, 0 0) }
.hexagon-2 .shape-end { -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 99% 75%, 99% 25%); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 99% 75%, 99% 25%) }
```

### [Broken Glass Menu](https://codepen.io/Vlatko-Magjer/pen/abxeMNg)

on scroll: div.sc-dkPwfY: transform+top ×6 | made with: transition · :hover · clip-path · 3D (perspective / preserve-3d)

### [Putting the pieces together](https://codepen.io/jarrodthibodeau/pen/PoggVgR)

on scroll: div.part-container: transform+top ×12 | made with: @keyframes · transition · :hover · clip-path · custom properties driven by JS

```css
h3 { position: absolute; bottom: 0 }
#container { position: relative }
.part-container { position: absolute; transition: all 0.5s ease-in-out; transform: translate(var(--translated-x), var(--translated-y)) rotate(var(--rotation)) }
.inner { position: absolute }
.outer { position: relative; animation: 4s rotateBorder ease-in infinite }
#one { clip-path: ellipse(33% 33% at top left) }
#two { clip-path: inset(0% 50% 66.67% 25%) }
#three { clip-path: inset(0% 25% 66% 50%) }
#four { clip-path: ellipse(33% 33% at top right) }
#five { clip-path: polygon(0% 33%, 25% 20%, 25% 80%, 0 66%) }
#six { clip-path: inset(33% 50% 33% 25%) }
#seven { clip-path: inset(33% 25% 33% 50%) }
```

```js
style.setProperty("--rotation", newRotation + "deg")
style.setProperty("--translated-x", newX + "px")
style.setProperty("--translated-y", newY + "px")
addEventListener('mouseenter', () => reposition())
```

### [CSS Frame Line Effect](https://codepen.io/MarkimusMaximus/pen/xxeMWXz)

made with: clip-path

```css
.outter { clip-path: polygon( 0% calc(var(--vertical-factor) * 0.15), 0 100%, var(--horizontal-factor) 100%, var(--horizontal-factor) 0%, calc(var(--horizontal-factor) * 0.9) calc(var(--vertical-factor) * 0), calc(var(--horizontal }
.inner { clip-path: polygon( 0% calc(var(--vertical-factor) * 0.15 + var(--buffer)), 0 100%, var(--horizontal-factor) 100%, var(--horizontal-factor) calc(var(--buffer) * 1.5), calc(var(--horizontal-factor) * 0.9) calc(var(--verti }
```

### [... just a hexagon with gradient border](https://codepen.io/aepicos/pen/vYMbgro)

held: fixed div.defs | made with: position: fixed · clip-path

```css
.logo, .logo::after { clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%) }
.logo { position: relative }
.logo::after { position: absolute; inset: var(--stroke-width) }
.defs { position: fixed; inset-top: -1px }
```

### [Border animation direction-aware](https://codepen.io/simo_m/pen/WNWarBb)

on scroll: div.card: background+top | on hover of div.card: div.card: background ×2 | made with: transition · :hover · clip-path · custom properties driven by JS · pointer / mouse tracking

```css
.card { position: relative; transition: background calc(var(--_tt)*.8) var(--_ease) }
.card::before { position: absolute; inset: calc(var(--_border)*-1); clip-path: circle(var(--_radius) at var(--_x, 50%) var(--_y, 50%)); transition: clip-path var(--_tt) var(--_ease) }
```

```js
addEventListener('mousemove', function(e) {
style.setProperty('--_x', Math.round(posX) + '%' )
style.setProperty('--_y', Math.round(posY) + '%' )
```

### [Breadcrumbs](https://codepen.io/arron21/pen/WNWaQKy)

on hover of li.: li.: background, a.: color | made with: :hover · clip-path

```css
ul li { -webkit-clip-path: polygon(calc(100% - var(--angle)) 0%, 100% 50%, calc(100% - var(--angle)) calc(100% - 0px), 0% 100%, var(--angle) 50%, 0% 0%); clip-path: polygon(calc(100% - var(--angle)) 0%, 100% 50%, calc(100% - var }
ul li:last-of-type { -webkit-clip-path: polygon(100% 0%, 100% 50%, 100% calc(100% - 0px), 0% 100%, var(--angle) 50%, 0% 0%); clip-path: polygon(100% 0%, 100% 50%, 100% calc(100% - 0px), 0% 100%, var(--angle) 50%, 0% 0%) }
ul li:first-of-type { -webkit-clip-path: polygon(calc(100% - var(--angle)) 0%, 100% 50%, calc(100% - var(--angle)) calc(100% - 0px), 0% 100%, 0 50%, 0% 0%); clip-path: polygon(calc(100% - var(--angle)) 0%, 100% 50%, calc(100% - var(--angle))  }
ul li:only-child { -webkit-clip-path: none; clip-path: none }
```

### [Testing clip-path cutout](https://codepen.io/beefchimi/pen/MWRGJOy)

held: fixed div | made with: position: fixed · transition · :hover · clip-path

```css
body { position: relative }
button { transition: background-color 200ms ease-in-out }
#Backdrop { position: fixed; inset: 0 }
```

### [CSS: clip-path example](https://codepen.io/Jack-Sun/pen/WNWMxQQ)

made with: clip-path

```css
.container { position: relative }
img { clip-path: polygon( 50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35% ) }
```

### [Cool image clip-path expand hover effect](https://codepen.io/NJMDev/pen/eYoVNXB)

held: fixed div.clip__container | on scroll: div.clip__content: transform+clip-path+top, img.: transform+top | made with: position: fixed · transition · :hover · clip-path · scroll listener

```css
.clip__content { clip-path: polygon(50% 10%, 60% 50%, 50% 90%, 40% 50%); transition: all 0.4s ease; animation-delay: 0.8s; position: absolute }
.clip__content:hover { clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%) }
.clip__content img { position: absolute }
.clip__container { position: fixed }
section { position: absolute }
```

```js
addEventListener("scroll", function () {
```

### [The Ultimate Dev Blog Easter Egg 🥚](https://codepen.io/davideast/pen/JjVModj)

on scroll: p.: clip-path | made with: transition · :hover · :has() · clip-path · custom properties driven by JS · pointer / mouse tracking

```css
&::before { position: absolute }
&::before { transform: translate(var(--x), var(--y)); opacity: 0.9; transition: opacity 0.2s }
&:not(:hover)::before { opacity: 0 }
&:nth-child(2) { clip-path: circle(var(--r) at calc(50% + var(--x)) calc(50% + var(--y))) }
```

```js
addEventListener("mousemove", (e) => {
style.setProperty("--x", `${e.clientX - 0.5 * rect.width}px`)
style.setProperty("--y", `${e.clientY - 0.5 * rect.height - rect.y}px`)
```

### [the css clip-path trick](https://codepen.io/get-web/pen/ZEZaxBx)

made with: clip-path

```css
.pic { position: relative }
.pic__item { position: absolute; bottom: -20px; transform: translateX(-50%) }
.pic__item_pos_bottom { clip-path: ellipse(98px 108px at 50% 50%) }
.pic__item_pos_top { clip-path: ellipse(60% 50% at 50% 15%) }
```

### [Hover effect (https://oakslane.ch/en)](https://codepen.io/fcasantos/pen/VwNPWRg)

made with: transition · :hover · clip-path

```css
.wrapper { position: relative }
ul li:not(:last-of-type) { margin-bottom: 0.75rem }
ul li a { position: relative }
ul li a::before { position: absolute; bottom: -0.05rem; clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); transition: left 0.36s ease-in-out, width 0.36s ease-in-out, clip-path 0.36s ease-in-out }
ul li:hover a::before { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%) }
```

### [Untitled](https://codepen.io/sniepy/pen/wvZzNdN)

held: fixed div.cover__wrap | on scroll: div.cover__wrap: clip-path | made with: position: fixed · requestAnimationFrame

```css
.cover { position: relative }
.cover:before { position: absolute; top: 0 }
.cover__wrap { position: fixed }
.cover__embed { position: absolute }
```

```js
requestAnimationFrame(mouseFollow)
addEventListener('mouseenter', e => {
addEventListener('mouseleave', e => {
```

### [Masking](https://codepen.io/Mys7ik/pen/JjVYbRx)

on scroll: div.first: clip-path | made with: transition · clip-path

```css
.first, .second { position: absolute }
.first { clip-path: circle(60px at 100px 100px); transition: 0.15s }
```

### [Hourglass Shape-margin](https://codepen.io/slycreations/pen/QWPbdrX)

made with: clip-path

```css
body { position: relative }
.main { position: relative }
.left, .right { position: static; top: 0 }
.left { clip-path: polygon(0% 0%, 80% 50%, 0% 100%) }
.right { clip-path: polygon(100% 0%, 20% 50%, 100% 100%) }
```

### [Button gradient animation with clip-path](https://codepen.io/pershinvitalii/pen/JjVjeJO)

made with: transition · :hover · clip-path

```css
.btn { transition: 0.2s all; text-transform: uppercase; box-shadow: none; position: relative }
.btn:before, .btn:after { position: absolute; top: 0; bottom: 0; transition: 0.3s all; clip-path: polygon( 0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px) ) }
.btn:hover:before { transition: 0.3s all; background-position: 100% 100%; clip-path: polygon( 0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px) ) }
.btn:after { position: absolute; top: -5px; bottom: -5px; opacity: 0.3 }
.btn:hover:after { transition: 0.3s all; background-position: 100% 100%; clip-path: polygon( 0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px) ) }
```

### [schräge Gallerie](https://codepen.io/sarah_02/pen/jOJjWeo)

made with: clip-path

```css
body { background-position: center }
.gallerie { clip-path: polygon(0 7%, 100% 0%, 100% 93%, 0% 100%) }
.image:nth-child(1) { clip-path: polygon(0% 40%, 100% 30%, 100% 100%, 0 100%) }
.image:nth-child(2) { clip-path: polygon(0 30%, 100% 20%, 100% 100%, 0 100%) }
.image:nth-child(3) { clip-path: polygon(0 20%, 100% 10%, 100% 100%, 0 100%) }
.image:nth-child(4) { clip-path: polygon(0 10%, 100% 0, 100% 100%, 0 100%) }
.image:nth-child(17) { clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%) }
.image:nth-child(18) { clip-path: polygon(0 0, 100% 0, 100% 80%, 0 90%) }
.image:nth-child(19) { clip-path: polygon(0 0, 100% 0, 100% 70%, 0 80%) }
.image:nth-child(20) { clip-path: polygon(0 0, 100% 0, 100% 60%, 0 70%) }
.image img { object-position: center }
```

### [Wicked Floating Video Sammie Bubble - New & Improved](https://codepen.io/mark_sottek/pen/PoLXMYv)

made with: clip-path · requestAnimationFrame

```css
#sammieBubble { position: absolute; clip-path: circle(50%); opacity: 0.9 }
```

```js
requestAnimationFrame(step)
```

### [Section transitions](https://codepen.io/benbearfoot/pen/gOEBqaX)

held: sticky div.sticky-content, sticky div.sticky-content, sticky div.sticky-content, sticky div.sticky-content, sticky div.sticky-content | on scroll: div.sticky-content: clip-path+top | made with: position: sticky · @keyframes · clip-path · custom properties driven by JS · scroll listener

```css
0% { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%) }
25% { clip-path: polygon(87.5% 12.5%, 87.5% 87.5%, 12.5% 87.5%, 12.5% 12.5%) }
50% { clip-path: polygon(75% 75%, 25% 75%, 25% 25%, 75% 25%) }
75% { clip-path: polygon(37.5% 62.5%, 37.5% 37.5%, 62.5% 37.5%, 62.5% 62.5%) }
100% { clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%) }
0% { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 50%, 50% 50%, 25% 50%, 25% 75%, 75% 75%, 75% 25%, 0% 25%) }
14.25% { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 25%, 75% 25%, 75% 75%, 50% 75%, 50% 50%, 50% 50%, 25% 50%, 25% 75%, 75% 75%, 75% 25%, 0% 25%) }
28.5% { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 25%, 75% 25%, 75% 50%, 50% 50%, 50% 50%, 50% 50%, 25% 50%, 25% 75%, 75% 75%, 75% 25%, 0% 25%) }
42.75% { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 25%, 25% 25%, 25% 50%, 25% 50%, 25% 50%, 25% 50%, 25% 50%, 25% 75%, 75% 75%, 75% 25%, 0% 25%) }
57% { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 75%, 25% 75%, 25% 75%, 25% 75%, 25% 75%, 25% 75%, 25% 75%, 25% 75%, 75% 75%, 75% 25%, 0% 25%) }
71.25% { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 75% 100%, 75% 75%, 75% 75%, 75% 75%, 75% 75%, 75% 75%, 75% 75%, 75% 75%, 75% 75%, 75% 75%, 75% 25%, 0% 25%) }
85.5% { clip-path: polygon(0% 0%, 100% 0%, 100% 25%, 75% 25%, 75% 25%, 75% 25%, 75% 25%, 75% 25%, 75% 25%, 75% 25%, 75% 25%, 75% 25%, 75% 25%, 75% 25%, 0% 25%) }
```

```js
style.setProperty('--scroll', scrollProgress)
addEventListener('scroll', handleScroll)
```

### [CSS Image Reveal](https://codepen.io/haptichash/pen/VwRXqYr)

on scroll: img.: clip-path+top | on hover of img.: img.: clip-path ×2 | made with: transition · :hover · clip-path

```css
.image_container .image { position: relative; pading-bottom: 100% }
.image_container .image img { top: 0; position: absolute }
.image_container .image img:nth-of-type(1) { filter: grayscale(1) brightness(40%) }
.image_container .image img:nth-of-type(2) { clip-path: var(--clip-start); transition: clip-path 0.5s }
.image_container .image:hover img:nth-of-type(2) { clip-path: var(--clip-end) }
```

### [Parallax scrolling magnifying effect](https://codepen.io/mirja-t/pen/oNVwgZY)

on scroll: div.bg-image: clip-path+top ×3 | made with: scroll() timeline · clip-path · backdrop-filter

```css
section { background-position: center; position: relative }
section::before { top: 0; position: absolute; backdrop-filter: blur(1px) }
section footer { position: relative }
section div.bg-image { position: absolute; top: 0 }
#section-1 div.bg-image { clip-path: var(--clip-path-1); background-position: var(--background-position-1) }
#section-2 div.bg-image { clip-path: var(--clip-path-2); background-position: var(--background-position-2) }
#section-3 div.bg-image { clip-path: var(--clip-path-3); background-position: var(--background-position-3) }
```

```js
addEventListener('wheel', () => this.sectionScroll(this.sections))
```

### [Progress arrow](https://codepen.io/Stimmler/pen/yLwbWee)

made with: transition · clip-path · custom properties driven by JS

```css
div, div:before { clip-path: polygon( 0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80% ) }
div { position: relative }
div:before { position: absolute; inset: 0; transition: clip-path 0.5s; clip-path: inset(0 0 0 var(--progress)) }
div:after { position: absolute; top: 50%; transform: translateY(-50%) translateX(-50%) }
```

```js
style.setProperty("--progress", `${val}%`)
style.setProperty("--label", `'${val}%''`)
```

### [Reveal image on hover](https://codepen.io/Stimmler/pen/gOEWyJB)

made with: transition · :hover · clip-path

```css
div:after, div:before { background-position: center center }
div { position: relative }
div:before { position: absolute; inset: 0 }
div:after { clip-path: inset(0 0 0 0); position: absolute; inset: 0; filter: grayscale(1); transition: clip-path 0.75s ease-out }
div:hover:after { clip-path: inset(100% 0 0 0) }
div:before, div:after { text-transform: uppercase }
```

### [css clip-path](https://codepen.io/juan-instructor/pen/xxBRXVM)

made with: clip-path

```css
div { clip-path: polygon( 30% 0%, 70% 0%, 91% 31%, 92% 70%, 70% 100%, 30% 100%, 7% 68%, 8% 30% ) }
```

### [Happy 2024!](https://codepen.io/nitnelav/pen/KKEddvy)

on hover of button.btn: button.btn: shadow | made with: transition · :hover · clip-path

```css
.cont { position: absolute; top: 0; bottom: 0 }
h1 { background-position: center center; transition: 1s all }
.btn { transition: .5s all; box-shadow: 5px 5px 10px rgba(0,0,0,0.5) }
.btn:hover { box-shadow: 5px 5px 20px rgba(0,0,0,0.7) }
.btn:active { box-shadow: 5px 5px 10px rgba(0,0,0,0.5) }
#about { position: absolute; top: 100vh; bottom: 0; transition: .3s all ease }
.vfb { position: absolute; bottom: 0 }
```

### [Untitled](https://codepen.io/Leonardo-Lopez-the-bashful/pen/VwRYGLW)

made with: transition · :hover · clip-path

```css
.rotating-slider { position: relative }
.rotating-slider ul.direction-controls li.left-arrow { position: absolute; top: 50%; transform: translateY(-50%) }
.rotating-slider ul.direction-controls li.right-arrow { position: absolute; top: 50%; transform: translateY(-50%) }
.rotating-slider ul.direction-controls li button { transition: background 0.25s }
.rotating-slider ul.slides { position: relative; top: 0; transform: translateX(-50%) rotate(0) }
.rotating-slider ul.slides li { background-position: center; position: absolute; top: 0 }
```

### [Untitled](https://codepen.io/Leonardo-Lopez-the-bashful/pen/poYvZVx)

made with: transition · :hover · clip-path

```css
.rotating-slider { position: relative }
.rotating-slider ul.direction-controls li.left-arrow { position: absolute; top: 50%; transform: translateY(-50%) }
.rotating-slider ul.direction-controls li.right-arrow { position: absolute; top: 50%; transform: translateY(-50%) }
.rotating-slider ul.direction-controls li button { transition: background 0.25s }
.rotating-slider ul.slides { position: relative; top: 0; transform: translateX(-50%) rotate(0) }
.rotating-slider ul.slides li { background-position: center; position: absolute; top: 0 }
```

### [Clip-path: non-rectangular video embed](https://codepen.io/williamCromar/pen/ZEPEEjE)

made with: clip-path

```css
body { background-position: center }
.centerPage { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.iframe-clip { clip-path: circle(28% at 50% 50%) }
.iframe-wrap { filter: drop-shadow(0px 0px 20px #f00) }
```

### [CSS clip-path example](https://codepen.io/esedic/pen/JjxQBLM)

made with: clip-path

```css
.masked-image1 { clip-path: url(#clip1) }
.masked-image2 { clip-path: url(#clip2) }
```

### [Soft & Sharp](https://codepen.io/AlperZM/pen/RwvmGLa)

made with: clip-path

```css
.sharp-color { clip-path: polygon( 0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85% ) }
.soft-color { clip-path: polygon( 0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85% ) }
.sharp-borders { clip-path: polygon( 50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10% ) }
.sharp-borders { clip-path: polygon( 50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10% ) }
.soft-borders { clip-path: circle(50% at 50% 50%) }
```

### [Single image clip-path triptych with pseudo borders & box-shadows](https://codepen.io/BlogFire/pen/eYxQgga)

made with: transition · :hover · clip-path

```css
section div { box-shadow: 5px 5px 20px -1px #111010 }
img { clip-path: polygon( 0 50%, 0 10%, 25% 10%, 25% 50%, 30% 50%, 30% 0, 70% 0, 70% 50%, 75% 50%, 75% 10%, 100% 10%, 100% 90%, 75% 90%, 75% 50%, 70% 50%, 70% 100%, 30% 100%, 30% 50%, 25% 50%, 25% 90%, 0 90%, 0 50% ) }
.roma { opacity: 0.25; transition: 0.15s ease; position: absolute; bottom: 20px }
.roma:hover { opacity: 1; transform: scale(1.2) }
```

### [Möbius Strip - CSS](https://codepen.io/josetxu/pen/zYeJROM)

on scroll: div.ring: shadow ×3 | made with: :hover · clip-path

```css
.content { transform: scale(1.5) }
.ring { position: absolute; margin-top: -4vmin }
.ring:nth-child(2) { margin-top: 5.85vmin }
.ring:nth-child(3) { clip-path: polygon(0 0, 50% 0, 50% 100%, 0% 100%) }
.content:hover .ring { box-shadow: 0 1px 1px 0 var(--shadow), 0 -1px 1px 0 var(--shadow), -1px 0px 1px 0 var(--shadow), 1px 0px 1px 0 var(--shadow) }
```

### [clip-path: & repeating-conic-gradient()](https://codepen.io/BlogFire/pen/RwvQoLd)

on scroll: div.clipped4: transform | made with: @keyframes · clip-path

```css
.clipped { clip-path: polygon( 50% 0%, 65% 15%, 85% 15%, 85% 35%, 100% 50%, 85% 65%, 85% 85%, 65% 85%, 50% 100%, 35% 85%, 15% 85%, 15% 65%, 0% 50%, 15% 35%, 15% 15%, 35% 15% ) }
.clipped2 { clip-path: polygon( 50% 0%, 65% 15%, 85% 15%, 85% 35%, 100% 50%, 85% 65%, 85% 85%, 65% 85%, 50% 100%, 35% 85%, 15% 85%, 15% 65%, 0% 50%, 15% 35%, 15% 15%, 35% 15% ) }
.clipped3 { clip-path: circle(6vmin at center 50%) }
.clipped4 { clip-path: circle(5vmin at center 50%); animation: rotate 60s linear infinite }
100% { transform: rotate(360deg) }
.clipped5 { clip-path: circle(4.25vmin at center 50%) }
@keyframes rotate animates transform
```

### [UA colors CSS animation](https://codepen.io/julsmorozova/pen/KKJvMwY)

on scroll: div.container: clip-path+top | made with: @keyframes · transition · clip-path

```css
.container { position: absolute; clip-path: none; transform: translateY(0); animation: 1500ms slideUp ease-in-out 1 }
.container.shrinking { animation: 2000ms containerShrink ease-in-out 1 }
.container.shrinking::before { animation: 2000ms containerPseudoShrink ease-in-out 1 }
.container::before { position: absolute; transform: translateY(100%); transition: 1500ms transform ease-in-out }
.container.single-color::before { transform: translateY(400%) }
.container.shrunk { clip-path: path("M5,15 A10,10,0,0,1,25,15 A10,10,0,0,1,45,15 Q45,30,25,43 Q5,30,5,15 Z"); animation: 2000ms heartGrow ease-in-out infinite }
.container.heartGrown { clip-path: circle(200px at 200px 200px); animation: 1500ms heartBeat ease-in-out infinite }
from { transform: translateY(100%) }
to { clip-path: path("M40,120 A80,80,0,0,1,200,120 A80,80,0,0,1,360,120 Q360,240,200,344 Q40,240,40,120 Z") }
0%, 100% { clip-path: path("M40,120 A80,80,0,0,1,200,120 A80,80,0,0,1,360,120 Q360,240,200,344 Q40,240,40,120 Z") }
50% { clip-path: path("M45,135 A90,90,0,0,1,225,135 A90,90,0,0,1,405,135 Q405,270,225,387 Q45,270,45,135 Z") }
@keyframes slideUp animates transform
```

### [Mask Text effect](https://codepen.io/anfir/pen/abXmdRy)

on scroll: h2.text-underneath: clip-path | made with: @keyframes · clip-path

```css
.masked-text-wrapper { position: relative }
.masked-text-wrapper h2 { text-transform: uppercase }
.masked-text-wrapper .text-default:before, .masked-text-wrapper .text-default:af { position: absolute; top: 0; transform: skew(-28deg) }
.masked-text-wrapper .text-default:before { animation: moveLinesBefore 8s infinite }
.masked-text-wrapper .text-default:after { animation: moveLinesAfter 8s infinite }
.masked-text-wrapper .text-underneath { position: absolute; top: 0; animation: rectangle 8s infinite }
0%, 100% { clip-path: polygon(60% 0, 80% 0, 60% 100%, 40% 100%) }
50% { clip-path: polygon(40% 0, 60% 0, 40% 100%, 20% 100%) }
@keyframes moveLinesBefore animates left
@keyframes moveLinesAfter animates left
@keyframes rectangle animates clip-path
```

### [Card - ClipPath CSS](https://codepen.io/valdyl/pen/wvNwErx)

on scroll: div.img-container: transform+clip-path+top ×6, div.img-container: transform+top ×2 | made with: transition · :hover · clip-path

```css
.container { position: relative }
.img-container { position: absolute; top: 0; opacity: 0; transition: 0.7s ease transform, 0.5s ease opacity }
.img { transform: rotateY(45deg); position: absolute }
.img-container:first-child { clip-path: polygon(0 0, 33.3% 0, 33.3% 33%, 0 33%); transform: translate(calc(-1 * var(--translate-load)), calc(-1 * var(--translate-load))) scale(0.5) }
.img-container:nth-child(2) { clip-path: polygon(33% 0, 67% 0, 67% 33%, 33% 33%); transform: translate(0, calc(-1 * var(--translate-load))) scale(0.5) }
.img-container:nth-child(3) { clip-path: polygon(66.6% 0, 100% 0, 100% 33%, 66.6% 33%); transform: translate(var(--translate-load), calc(-1 * var(--translate-load))) scale(0.5) }
.img-container:nth-child(4) { clip-path: polygon(0 33%, 33.3% 33%, 33.3% 67%, 0 67%); transform: translate(calc(-1 * var(--translate-load)), 0px) scale(0.5) }
.img-container:nth-child(5) { clip-path: polygon(33% 33%, 67% 33%, 67% 67%, 33% 67%); transform: translate(0px, 0px) scale(0.5) }
.img-container:nth-child(6) { clip-path: polygon(66.6% 33%, 100% 33%, 100% 67%, 66.6% 67%); transform: translate(var(--translate-load), 0px) scale(0.5) }
.img-container:nth-child(7) { clip-path: polygon(0 67%, 33.3% 67%, 33.3% 100%, 0 100%); transform: translate(calc(-1 * var(--translate-load)), var(--translate-load)) scale(0.5) }
.img-container:nth-child(8) { clip-path: polygon(33% 67%, 67% 67%, 67% 100%, 33% 100%); transform: translate(0px, var(--translate-load)) scale(0.5) }
.img-container:nth-child(9) { clip-path: polygon(66.6% 67%, 100% 67%, 100% 100%, 66.6% 100%); transform: translate(var(--translate-load), var(--translate-load)) scale(0.5) }
```

### [Washer + Washer Animation](https://codepen.io/osj2507/pen/GRPVLoO)

on scroll: div.washer-water: clip-path | made with: @keyframes · clip-path

```css
.washer { position: relative }
.washer-backdrop { position: absolute; top: 0; bottom: 0 }
.washer-water { position: absolute; bottom: 0; clip-path: polygon( 100% 100%, 0% 100%, 0% 58%, 2% 57.86%, 4% 57.44%, 6% 56.75%, 8% 55.83%, 10% 54.7%, 12% 53.41%, 14% 51.99%, 16% 50.5%, 18% 49%, 20% 47.53%, 22% 46.15%, 24% 44.9%, 26% 43. }
.washer.animate .washer-water { animation: waves 3s ease-in-out infinite forwards }
.washer-door { position: relative }
.washer-door-reflection { position: absolute; top: 40px; transform: rotate(-50deg) }
.washer-door-reflection + .washer-door-reflection { top: 80px }
.washer-door-handle { position: absolute; top: 0; bottom: 0 }
50% { clip-path: polygon( 100% 100%, 0% 100%, 0% 42%, 2% 42.14%, 4% 42.56%, 6% 43.25%, 8% 44.17%, 10% 45.3%, 12% 46.59%, 14% 48.01%, 16% 49.5%, 18% 51%, 20% 52.47%, 22% 53.85%, 24% 55.1%, 26% 56.16%, 28% 57.01%, 30% 57.61%, 32 }
@keyframes waves animates clip-path
```

### [Isometric Tiles](https://codepen.io/szopos/pen/WNLBwJd)

made with: :hover · clip-path

```css
main { padding-top: 10% }
.tiles > * { transform: translateX(-50%); position: relative }
.tiles > *:hover:before { opacity: .5 }
.tiles > *:nth-child(10n-4), .tiles > *:nth-child(10n-3), .tiles > *:nth-child(1 { transform: translateX(50%) }
.tiles > *:before { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); transform: scale(1.9) }
.tiles p { position: absolute; bottom: 50% }
.tiles p:before { position: absolute; bottom: 0; transform: translateY(50%) scale(.75); opacity: .1 }
.tiles p:after { position: absolute; inset: 0 }
.tiles u { position: absolute; bottom: 50%; clip-path: polygon(50% 0%, 100% 50%, 100% 150%, 0 150%, 0% 50%) }
.tiles u:before { position: absolute; bottom: 0; transform: translateY(50%) scale(.85); clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); opacity: .1 }
.tiles u:after { position: absolute; inset: 0; clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%) }
.tiles s { position: absolute; bottom: 50%; clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 100% 91%, 100% 150%, 0 150%, 0 91%, 21% 91%, 32% 57%, 2% 35%, 39% 35%) }
```

### [Spiders and Skeletons](https://codepen.io/AlperZM/pen/rNoPpMK)

made with: clip-path

```css
.base { position: absolute; top:50%; transform: translate(-50%, -50%) }
#skull { position: absolute; top:50%; transform: translate(-50%, -50%) }
.eye { clip-path: ellipse(35% 38% at 50% 50%); filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5)) }
.e1 { position: absolute; top:37% }
.e2 { position: absolute; top:37% }
.shadow1 { position: absolute; top:37%; filter: drop-shadow(0px 0px 10px #000) }
.shadow2 { position: absolute; top:37%; filter: drop-shadow(0px 0px 10px #000) }
.w-left { position: relative; top:34% }
.w-right { position: relative; top:34% }
.s1 { position: absolute; top:18%; transform: rotate(45deg) }
.s2 { position: absolute; top:110%; transform: rotate(180deg) }
.s2::before { position: absolute; top:65% }
```

### [glitched 3D house - clip-path](https://codepen.io/wissam-d/pen/wvRRBmy)

made with: clip-path · 3D (perspective / preserve-3d)

```css
.cube { perspective: 800px }
.side-1, .side-2, .side-4, .side-5 { position: absolute }
.side-1 { transform: skew(0, 20deg); top: 32vh; clip-path: polygon(50% 0, 100% 13%, 100% 100%, 0 100%, 0 20%) }
.side-2 { transform: skew(0, -20deg); top: 37.3vh; clip-path: polygon(0% 0%, 85% 50%, 100% 56%, 100% 100%, 0% 100%) }
.side-4 { transform: rotateX(87deg) translateZ(70px); top: 25vh; clip-path: polygon(0 0, 85% 0, 100% 100%, 0 100%) }
.side-5 { transform: rotateX(90deg) translateZ(20px) rotateY(30deg); top: 23.3vh; clip-path: polygon(0 15%, 100% 0, 100% 100%, 0 100%) }
h1 { position: absolute }
```

### [Crayons](https://codepen.io/kstephens6054/pen/KKbGQNd)

made with: clip-path

```css
.crayon { position: relative; clip-path: polygon( 20px 25px, 100px 5px, 100px 0px, 500px 0px, 500px 60px, 100px 60px, 100px 55px, 20px 35px ) }
.crayon::after { position: absolute; top: 0 }
```

### [Pure CSS Fullscreen Overlay Menu use clip-path circle](https://codepen.io/nguyenanhtuan/pen/vYvdqga)

held: fixed label.menu-btn, fixed div.menu | made with: position: fixed · transition · :hover · clip-path

```css
.menu { position: fixed; top: 0; -webkit-clip-path: circle(25px at calc(100% - 45px) 45px); clip-path: circle(25px at calc(100% - 45px) 45px); transition: all 0.3s ease-in-out }
.menu-btn { position: fixed; top: 20px; transition: all 0.3s ease-in-out }
.menu-btn span, .menu-btn:before, .menu-btn:after { position: absolute; top: calc(50% - 1px); border-bottom: 2px solid #fff; transition: transform 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) }
.menu-btn:before { transform: translateY(-8px) }
.menu-btn:after { transform: translateY(8px) }
.close { transition: background 0.6s }
.menu ul { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.menu ul li { opacity: 0; transform: translateY(-10px); transition: all 0.3s ease }
.menu ul li a { position: relative; transform: translateY(0); transition: all 0.3s ease }
.menu ul li a:hover { transform: translateY(-5px) }
#active:checked ~ .menu { -webkit-clip-path: circle(75%); clip-path: circle(75%) }
#active:checked ~ .menu ul li { opacity: 1; transform: translateY(0) }
```

### [Revealing](https://codepen.io/BlogFire/pen/NWevLdE)

on scroll: main.: shadow, h2.: opacity, h2.: opacity+color, img.: clip-path | on hover of img.: h2.: opacity, h2.: opacity+color | made with: transition · :hover · clip-path

```css
main { background-position: center; box-shadow: 1rem 1rem 5rem #373e12; transition: 2s ease }
img { clip-path: inset(15% 48% round 1rem); transition: 1.2s ease }
main:hover img { clip-path: inset(0% round 0.5rem) }
h2 { transition: 3s ease }
h2:nth-child(2) { opacity: 0 }
main:hover h2:nth-child(1) { opacity: 0 }
main:hover h2:nth-child(2) { opacity: 1 }
body:hover main { box-shadow: 1rem 1rem 5rem #222 }
body { transition: 3s ease }
```

### [Clipped Square Loader - CSS](https://codepen.io/josetxu/pen/NWebBRQ)

on scroll: div.loader: transform+top | made with: @keyframes · :hover · clip-path

```css
.loader { clip-path: polygon(0% 0%, 40% 0%, 50% 10%, 60% 0%, 100% 0%, 100% 40%, 90% 50%, 100% 60%, 100% 100%, 60% 100%, 50% 90%, 40% 100%, 0% 100%, 0% 60%, 10% 50%, 0% 40%); animation: spin var(--spd) linear 0s infinite; position: }
.loader:hover { animation: spin var(--spd) linear 0s infinite, rotation var(--spd) linear 0s infinite }
.loader:before { position: absolute; clip-path: polygon(0% 0%, 38% 0%, 50% 12%, 62% 0%, 100% 0%, 100% 38%, 88% 50%, 100% 62%, 100% 100%, 62% 100%, 50% 88%, 38% 100%, 0% 100%, 0% 62%, 12% 50%, 0% 38%) }
0% { transform: rotate(0deg) }
100% { transform: rotate(-360deg) }
@keyframes spin animates --deg
@keyframes rotation animates transform
```

### [Animated Button with clip-path](https://codepen.io/alvaromontoro/pen/OJrXpvQ)

on scroll: button.: clip-path+background | made with: transition · :hover · clip-path

```css
button { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: clip-path 0.25s, background 0.33s; box-shadow: 0 0 0 16px var(--color-hover); clip-path: path("M0,0 C 25,0 225,0 250,0 250,25 250,55 250,80 225, }
button:hover { clip-path: path("M0,0 C 25,-10 225,-10 250,0 260,25 260,55 250,80 225,90 25,90 0,80 -10,55 -10,25 0,0") }
button:active { clip-path: path("M0,0 C 25,10 225,10 250,0 240,25 240,55 250,80 225,70 25,70 0,80 10,55 10,25 0,0") }
```

### [cut window](https://codepen.io/Artyom-Poleshko/pen/abPNVJQ)

on scroll: div.clip: clip-path, span.: transform+top | made with: transition · :hover · clip-path

```css
header { position: relative }
.clip { position: absolute; background-position: center }
&:hover { clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%) }
& span { transform: translateY(calc(var(--heightSpan) * -1)) }
&:hover ~ .pancakes { clip-path: polygon(0 0, 100% 0, 100% 0, 0 0) }
& span { transform: translateY(var(--heightSpan)) }
.clip span { transition: .5s }
.clip button { position: absolute; transition: 0.5s; box-shadow: 3px 3px 12px 6px #8f5656 }
.clip button:active { box-shadow: 3px 3px 12px 3px #8f5656 }
.clip:hover span { transform: translateY(0) }
& button { top: 5% }
& button { bottom: 5% }
```

### [ScrollTrigger keyhole animation](https://codepen.io/natszafraniec/pen/oNJxgLz)

held: fixed span.keyhole | on scroll: span.keyhole: clip-path, span.arrow: transform+opacity+top | on hover of img.: span.arrow: transform+top | made with: position: fixed · @keyframes · prefers-reduced-motion · clip-path · GSAP

```css
.keyhole { position: fixed; inset: 0; -webkit-clip-path: polygon(0% 0%, 0% 100%, 0 100%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%, 100% 100%, 100% 0%); clip-path: polygon(0% 0%, 0% 100%, 0 100%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100% }
.arrow { position: absolute; top: 72.5vh; -webkit-animation: float 1s ease-in-out infinite alternate both; animation: float 1s ease-in-out infinite alternate both }
.arrow svg { transform: rotate(90deg) }
.section--primary figure { position: relative; transform: translateX(-50%) }
.section--primary .section__content { padding-top: 0 }
from { transform: translateY(-50%) }
to { transform: translateY(50%) }
from { transform: translateY(-50%) }
to { transform: translateY(50%) }
@keyframes float animates transform
```

```js
gsap.from(".keyhole", {
gsap.to(".arrow", {
```

### [CSS Hudini & Unregular Custom Border Button](https://codepen.io/sdgaoqiang/pen/poqgwdZ)

made with: transition · :hover · clip-path · mask

```css
div { position: relative; transition: 0.3s; clip-path: polygon(var(--clipPath)) }
div::before { position: absolute; inset: 0; mask: paint(borderDraw) }
```

### [CSS Hudini & Unregular Custom Border](https://codepen.io/sdgaoqiang/pen/VwqeWMv)

made with: clip-path · mask

```css
div { position: relative; -webkit-clip-path: polygon(var(--clipPath)); clip-path: polygon(var(--clipPath)) }
div::before { position: absolute; inset: 0; -webkit-mask: paint(borderDraw); mask: paint(borderDraw) }
```

### [加载完成动画](https://codepen.io/siwuxie/pen/rNoVWad)

made with: @keyframes

```css
div { animation: Rotate 3s ease-in-out, Disappear 2s forwards 2.5s; position: relative; scale: 0.6 }
div::before { position: absolute; top: 5px }
div::after { position: absolute; top: 252px; transform: rotate(-50deg); animation: Height 0.5s ease-out 3s forwards, Width 1s ease-out 3.5s forwards }
100% { transform: rotate(3turn) }
from { border-bottom: 5px solid #4caf50 }
to { border-bottom: 5px solid #4caf50 }
@keyframes Rotate animates transform
@keyframes Disappear animates --percent
@keyframes Height animates height, border-left
@keyframes Width animates width, border-bottom
```

### [clip-path: <geometry-box> test](https://codepen.io/thebabydino/pen/yLGyBrw)

made with: clip-path

```css
div { box-shadow: 13px 13px 4px teal }
div.margin-box { -webkit-clip-path: margin-box; clip-path: margin-box }
div.border-box { -webkit-clip-path: border-box; clip-path: border-box }
div.padding-box { -webkit-clip-path: padding-box; clip-path: padding-box }
div.content-box { -webkit-clip-path: content-box; clip-path: content-box }
```

### [Clip out all right of moving vertical line](https://codepen.io/thebabydino/pen/NWeWQbx)

held: fixed svg.[object | made with: position: fixed · :hover · clip-path · custom properties driven by JS

```css
svg[height="0"] { position: fixed }
.annotation svg { scale: 1 calc(1 - 2*var(--fin)) }
em.annotation { translate: calc(var(--k)*(50vw - 2*0.5em)) }
.token--item { position: relative }
.token--item::before { position: absolute; bottom: 100%; scale: var(--hl); translate: -50% }
```

```js
style.setProperty('--val', v)
```

### [Hover Effect with clip-path](https://codepen.io/lisa_c/pen/MWZWVag)

on hover of li.: span.: clip-path | made with: transition · :hover · clip-path

```css
.nav-link { position: relative }
.nav-link span { position: absolute; top: 0; bottom: 0; text-underline-offset: 6px; transition: clip-path 1000ms; clip-path: polygon( 0% 80%, 100% 80%, 100% 110%, 0% 110% ); transition: clip-path 600ms, text-underline-offset 400ms }
.nav-link:hover span { clip-path: polygon( 0% 0%, 100% 0%, 100% 90%, 0% 90% ); text-underline-offset: -24px; transition: clip-path 300ms, text-underline-offset 400ms }
.nav-link.active span { text-underline-offset: -24px; clip-path: unset }
```

### [Hero with Text and Image split on diagonal](https://codepen.io/lisa_c/pen/wvRvMrz)

made with: clip-path

```css
p, h1, h2 { margin-bottom: 16px }
body { padding-bottom: 10rem }
.wrapper { margin-top: 2rem }
.hero-banner { position: relative }
.hero-image { object-position: center 20%; clip-path: polygon( 0% 100%, 0% 0%, 50% 0%, 70% 100% ) }
.flipped-banner .hero-image { transform: scaleX(-1) }
.hero-text { padding-top: 3rem; transform: translateX(2rem) }
.position-banner .hero-text { position: absolute; top: 0; transform: unset }
.flipped-banner .hero-text { position: absolute; top: 0; transform: unset }
.float-banner .hero-image, .position-banner .hero-image { clip-path: polygon( 0% 100%, 0% 0%, 30% 0%, 50% 100% ) }
.hero-text { padding-top: 2rem }
.hero-banner .hero-image { clip-path: revert }
```

### [Trapezoid gallery images](https://codepen.io/metamezzo/pen/BaGXgmB)

on scroll: div.: transform+filter | on hover of img.: div.: transform+filter ×2 | made with: transition · :hover · clip-path

```css
&:nth-child(even) { filter: hue-rotate(180deg); transform: rotatey(180deg); -webkit-clip-path: polygon(0% 0%, 10% 100%, 90% 100%, 100% 0%); clip-path: polygon(0% 0%, 10% 100%, 90% 100%, 100% 0%) }
&:hover { filter: hue-rotate(180deg); transform: rotatey(180deg) }
&:nth-child(even):hover { filter: hue-rotate(0deg); transform: rotatey(0deg) }
& img { -o-object-position: center; object-position: center }
```

### [Heartbeat Monitor - CSS](https://codepen.io/josetxu/pen/KKrOwbr)

made with: @keyframes · clip-path

```css
.monitor { background-position: 0 0; position: relative; animation: pulse var(--spd) ease -0.5s infinite }
.monitor:before, .monitor:after { position: absolute }
.monitor:after { box-shadow: 0 0 0 2px #000; clip-path: polygon(0% 50.75%, 35.85% 50.75%, 42.85% 29%, 54.75% 65%, 59.9% 44%, 66% 60%, 70% 48.25%, 72% 50.75%, 100% 50.75%, 100% 100%, 0% 100%, 0% 50%, 35.35% 50%, 42.85% 27%, 54.6% 62.5%, 5 }
.monitor:before { background-position: 0 0, 0 0.4vmin; box-shadow: 0 0 2vmin 0 #000 inset, 0 0 0 0.15vmin #000 inset }
@keyframes pulse animates background-position-x
```

### [Photo album with cut corners](https://codepen.io/BlogFire/pen/wvQLjRX)

made with: clip-path

```css
figure { clip-path: polygon( 0 var(--c), var(--c) 0, calc(100% - var(--c)) 0, 100% var(--c), 100% calc(100% - var(--c)), calc(100% - var(--c)) 100%, var(--c) 100%, 0 calc(100% - var(--c)) ) }
main { margin-bottom: 4em }
```

### [clip-path zoom in animation](https://codepen.io/sdgaoqiang/pen/XWyLRmX)

made with: transition · :hover · clip-path

```css
.g-container { position: relative; transition: -webkit-clip-path 0.3s linear; transition: clip-path 0.3s linear; transition: clip-path 0.3s linear, -webkit-clip-path 0.3s linear; -webkit-clip-path: circle(20px at 44px 34px); clip-path: }
.g-container:hover { -webkit-clip-path: circle(460px at 44px 44px); clip-path: circle(460px at 44px 44px) }
.g-container::before { position: absolute; top: 26px; border-top: 3px solid; border-bottom: 3px solid }
ul { position: absolute; top: 60px }
```

### [CSS Glitch IMAGE Effect 1](https://codepen.io/sdgaoqiang/pen/GRwbWVx)

on scroll: div.: opacity+filter | made with: @keyframes · clip-path

```css
div { position: relative; -webkit-animation: main-img-hide 16s infinite step-end; animation: main-img-hide 16s infinite step-end }
div::before, div::after { position: absolute; top: 0 }
div::after { -webkit-animation: glitch-one 16s infinite step-end; animation: glitch-one 16s infinite step-end }
div::before { -webkit-animation: glitch-two 16s infinite 1s step-end; animation: glitch-two 16s infinite 1s step-end }
10% { -webkit-clip-path: inset(290px 0 20px); clip-path: inset(290px 0 20px) }
10.5% { -webkit-clip-path: inset(277px 0 52px); clip-path: inset(277px 0 52px) }
11% { -webkit-clip-path: inset(93px 0 224px); clip-path: inset(93px 0 224px) }
11.5% { -webkit-clip-path: inset(41px 0 305px); clip-path: inset(41px 0 305px) }
12% { -webkit-clip-path: inset(231px 0 102px); clip-path: inset(231px 0 102px) }
12.5% { -webkit-clip-path: inset(107px 0 231px); clip-path: inset(107px 0 231px) }
13% { -webkit-clip-path: inset(241px 0 98px); clip-path: inset(241px 0 98px) }
13.5% { -webkit-clip-path: inset(40px 0 273px); clip-path: inset(40px 0 273px) }
```

### [Pure Css Text Crack](https://codepen.io/sdgaoqiang/pen/WNYqpBL)

made with: @keyframes · clip-path

```css
div { position: relative; text-transform: uppercase; filter: blur(0.007em); -webkit-animation: shake 2.5s linear forwards; animation: shake 2.5s linear forwards }
div span { position: absolute; top: 0; transform: translate(-50%, -50%); -webkit-clip-path: polygon(10% 0%, 44% 0%, 70% 100%, 55% 100%); clip-path: polygon(10% 0%, 44% 0%, 70% 100%, 55% 100%) }
div::before, div::after { position: absolute; top: 0 }
div::before { -webkit-animation: crack1 2.5s linear forwards; animation: crack1 2.5s linear forwards; -webkit-clip-path: polygon(0% 0%, 10% 0%, 55% 100%, 0% 100%); clip-path: polygon(0% 0%, 10% 0%, 55% 100%, 0% 100%) }
div::after { -webkit-animation: crack2 2.5s linear forwards; animation: crack2 2.5s linear forwards; -webkit-clip-path: polygon(44% 0%, 100% 0%, 100% 100%, 70% 100%); clip-path: polygon(44% 0%, 100% 0%, 100% 100%, 70% 100%) }
5%, 15%, 25%, 35%, 55%, 65%, 75%, 95% { filter: blur(0.018em); transform: translateY(0.018em) rotate(0deg) }
10%, 30%, 40%, 50%, 70%, 80%, 90% { filter: blur(0.01em); transform: translateY(-0.018em) rotate(0deg) }
20%, 60% { filter: blur(0.03em); transform: translate(-0.018em, 0.018em) rotate(0deg) }
45%, 85% { filter: blur(0.03em); transform: translate(0.018em, -0.018em) rotate(0deg) }
100% { filter: blur(0.007em); transform: translate(0) rotate(-0.5deg) }
5%, 15%, 25%, 35%, 55%, 65%, 75%, 95% { filter: blur(0.018em); transform: translateY(0.018em) rotate(0deg) }
10%, 30%, 40%, 50%, 70%, 80%, 90% { filter: blur(0.01em); transform: translateY(-0.018em) rotate(0deg) }
```

### [GTA 5 poster ( Grid and Clip Path)](https://codepen.io/sdgaoqiang/pen/BaGePEZ)

on scroll: img.: transform+top | on hover of img.: img.: transform+top ×2 | made with: transition · :hover · clip-path

```css
img { -o-object-position: 70% 20%; object-position: 70% 20%; transition: 0.25s }
img:hover { transform: scale(120%) }
.parent { margin-top: 2.5vh }
.child:first-child { -webkit-clip-path: polygon(0% 0%, 93.24% 0%, 105.04% 110.16%, 0% 90%); clip-path: polygon(0% 0%, 93.24% 0%, 105.04% 110.16%, 0% 90%) }
.child:nth-child(2) { -webkit-clip-path: polygon(0% 0%, 108.28% 0%, 96.45% 110.13%, 10.55% 110.93%); clip-path: polygon(0% 0%, 108.28% 0%, 96.45% 110.13%, 10.55% 110.93%) }
.child:nth-child(3) { -webkit-clip-path: polygon(15.05% 0%, 100% 0%, 99.35% 91.7%, 3.08% 108.48%); clip-path: polygon(15.05% 0%, 100% 0%, 99.35% 91.7%, 3.08% 108.48%) }
.child:nth-child(4) { -webkit-clip-path: polygon(0% -0.85%, 106.34% 9.98%, 121.32% 65.63%, 99.66% 109.89%, 1.86% 124.41%); clip-path: polygon(0% -0.85%, 106.34% 9.98%, 121.32% 65.63%, 99.66% 109.89%, 1.86% 124.41%) }
.child:nth-child(5) { -webkit-clip-path: polygon(6.4% 6.48%, 47.24% 5.89%, 100% 0%, 98.41% 96.85%, 53.37% 100%, 53% 63.21%, 3.23% 73.02%, 14.3% 44.04%); clip-path: polygon(6.4% 6.48%, 47.24% 5.89%, 100% 0%, 98.41% 96.85%, 53.37% 100%, 53% 63. }
.child:nth-child(6) { -webkit-clip-path: polygon(2.14% 29.3%, 99.34% 15.42%, 98.14% 100.82%, 1.57% 101.2%); clip-path: polygon(2.14% 29.3%, 99.34% 15.42%, 98.14% 100.82%, 1.57% 101.2%) }
.child:nth-child(7) { -webkit-clip-path: polygon(7.92% 33.47%, 96.31% 23.39%, 95.38% 100%, 5.3% 100.85%); clip-path: polygon(7.92% 33.47%, 96.31% 23.39%, 95.38% 100%, 5.3% 100.85%) }
.child:nth-child(8) { -webkit-clip-path: polygon(2.5% 22.35%, 100% 0%, 100% 100%, 1.55% 100%); clip-path: polygon(2.5% 22.35%, 100% 0%, 100% 100%, 1.55% 100%) }
.child:nth-child(9) { -webkit-clip-path: polygon(5.94% 28.66%, 100.61% -0.67%, 101.1% 108.57%, 5.4% 126.28%); clip-path: polygon(5.94% 28.66%, 100.61% -0.67%, 101.1% 108.57%, 5.4% 126.28%) }
```

### [liquid text](https://codepen.io/krunal5281/pen/Poxvmmg)

held: fixed a.kjv-logo-link | on scroll: h2.liquid-text: clip-path | on hover of a.kjv-logo-link: path.[object: transform+top ×2, h2.liquid-text: clip-path, svg.[object: transform, g.[object: transform+top | made with: @keyframes · transition · :hover · clip-path

```css
.liquid-text-wrap { position: relative }
.liquid-text { text-transform: uppercase }
.liquid-text-front { position: absolute; top: 0; animation: clipWave 2000ms infinite alternate }
0% { clip-path: polygon(35% 40%, 22% 40%, 10% 44%, 0 55%, 0 100%, 100% 100%, 100% 53%, 89% 58%, 79% 59%, 68% 55%, 58% 51%, 46% 46%) }
100% { clip-path: polygon(36% 51%, 26% 55%, 13% 59%, 0 55%, 0 100%, 100% 100%, 100% 53%, 90% 49%, 84% 46%, 72% 42%, 60% 42%, 49% 47%) }
.kjv-logo-link { position : fixed; bottom: 10px }
.kjv-logo { transition: var(--kjvTransition); transform: rotate(-180deg) }
#kjvTringleRight { transform: translateX(-347px); transition: var(--kjvTransition) }
#kjvTringleLeft { transform: translateX(347px); transition: var(--kjvTransition) }
#kjvLetters { transform: scale(0); transition: var(--kjvTransition) }
.kjv-logo-link:hover .kjv-logo { transform: rotate(0deg) }
.kjv-logo-link:hover #kjvTringleRight, .kjv-logo-link:hover #kjvTringleLeft { transform: translateX(0px) }
```

### [clip-path, border-image and filter to achieve rounded gradient border](https://codepen.io/sdgaoqiang/pen/OJaYMer)

on scroll: div.border-image-clip-path: filter | made with: @keyframes · clip-path

```css
.border-image-clip-path { -webkit-clip-path: inset(0px round 10px); clip-path: inset(0px round 10px); -webkit-animation: huerotate 6s infinite linear; animation: huerotate 6s infinite linear; filter: hue-rotate(360deg) }
0% { filter: hue-rotate(0deg) }
100% { filter: hue-rorate(360deg) }
0% { filter: hue-rotate(0deg) }
100% { filter: hue-rorate(360deg) }
@keyframes huerotate animates filter
```

### [Pure CSS scroll-triggered image reveal](https://codepen.io/thebabydino/pen/XWywJMW)

held: fixed aside | on scroll: img.: clip-path+top, figcaption.: opacity+top | on hover of img.: img.: clip-path, figcaption.: opacity | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · animation-range · scroll-snap · @keyframes · transition · :hover · clip-path · backdrop-filter

```css
#btn--yp { position: fixed; bottom: 1em; filter: grayscale(1) drop-shadow(0 0 1px #e8e0e0); transition: 0.5s }
#btn--yp:before { position: absolute; bottom: 100%; animation: float 1s ease-in-out infinite alternate }
#btn--yp:hover, #btn--yp:focus { filter: grayscale(0) drop-shadow(0 0 1px crimson) }
to { transform: translateY(0.75em) }
html { scroll-snap-points-y: repeat(100vh); scroll-snap-type: y mandatory }
header, figure, footer { scroll-snap-align: start }
figure { animation: a 1s both; animation-timeline: view(); animation-range: entry 85% entry 85% }
figure::before { backdrop-filter: blur(50px) }
::before, img, figcaption { transition: 0.5s, 0.625s }
img { clip-path: inset(37.5vh var(--dr) 37.5vh 37.5vh) }
figcaption { translate: calc(var(--j)*-100%); opacity: var(--k); transition-property: opacity, translate }
aside { position: fixed; inset: 0 0 auto }
```

### [Tucked corners](https://codepen.io/thebabydino/pen/GRwLOKp)

made with: clip-path

```css
figure { position: relative; -webkit-clip-path: polygon(0 2.5em, 2.5em 0, 100% 0, 100% calc(100% - 2.5em), calc(100% - 2.5em) 100%, 0 100%); clip-path: polygon(0 2.5em, 2.5em 0, 100% 0, 100% calc(100% - 2.5em), calc(100% - 2.5em) }
figure::before, figure::after { position: absolute; top: calc(var(--i)*100% - var(--s)*0.25em); transform: translate(-50%) rotate(calc(var(--i)*.5turn - 45deg)) translatey(-1px) }
figcaption::before { position: absolute; inset: 0; box-shadow: 3px 3px 13px #0007 }
```

### [Css Icon Collection：clip-path（Updated from time to time）](https://codepen.io/raiko12/pen/OJaGyWp)

made with: :hover · clip-path

```css
h2 { position: relative; filter:drop-shadow(5px 1px 0 #222) }
.copy_btn { position: absolute; bottom: 8px }
section { filter: drop-shadow(5px 5px 5px #555); position: relative }
section p { border-bottom:dotted 1px #555 }
.Chrome i { position: absolute; top: 50%; margin-top: -32px; clip-path: polygon(46%33%,53%33%,61%37%,65%43%,66%47%,66%53%,61%62%,54%66%,46%66%,41%64%,37%61%,34%55%,33%49%,33%46%,35%41%,39%37%,41%35%) }
.Chrome i:nth-child(2) { clip-path: polygon(70%33%,96%33%,97%36%,99%44%,99%54%,97%64%,91%78%,84%85%,76%92%,64%97%,55%99%,52%99%,72%65%,76%55%,76%44%,74%38%) }
.Chrome i:nth-child(3) { clip-path: polygon(54%76%,41%98%,28%94%,21%90%,18%88%,11%81%,7%75%,2%65%,0%52%,0%44%,3%31%,6%27%,26%63%,34%72%,47%77%) }
.Chrome i:nth-child(4) { clip-path: polygon(12%18%,25%41%,28%34%,35%27%,43%23%,92%23%,86%16%,81%11%,71%5%,63%2%,55%0%,44%0%,30%4%,21%9%,17%12%) }
.Firefox { position: absolute; top: 50%; margin-top: -32px; clip-path: polygon(8%10%,14%15%,24%7%,33%3%,39%1%,45%0%,56%0%,70%4%,82%12%,90%20%,96%32%,99%42%,99%55%,96%68%,89%80%,80%89%,65%97%,52%99%,45%99%,33%97%,24%92%,18%88%,10%80 }
.Firefox i { position: absolute; top:0; clip-path: polygon(17%22%,24%16%,30%12%,43%8%,57%8%,71%13%,77%17%,73%16%,78%22%,84%34%,85%44%,82%40%,82%39%,78%35%,80%50%,78%62%,76%55%,71%65%,65%72%,56%76%,46%74%,42%68%,47%69%,52%64%,57%60%,5 }
.link { position: absolute; top: 50%; margin-top: -32px }
.link i { position: absolute; top:0; clip-path: polygon(66%0%,77%0%,83%2%,90%6%,96%15%,100%25%,96%38%,76%60%,71%61%,68%60%,66%58%,65%54%,87%34%,88%26%,87%19%,77%12%,66%13%,52%25%,47%30%,43%31%,40%29%,38%25%,39%21%) }
```

### [CSS Drawing：LAMU（under construction）](https://codepen.io/raiko12/pen/NWEmGba)

made with: clip-path

```css
.star { position:absolute; top:10%; clip-path: polygon(50% 5%, 61% 40%, 98% 40%, 68% 62%, 79% 96%, 50% 75%, 21% 96%, 32% 62%, 2% 40%, 39% 40%) }
.star:nth-child(2) { transform:scale(2); opacity:.8; top:30% }
.star:nth-child(3) { transform:scale(2.5); opacity:.5; top:50% }
.star:nth-child(4) { top:70% }
.star:nth-child(6) { transform:scale(1.2); top:100% }
.star:nth-child(7) { top:120% }
.star:nth-child(8) { transform:scale(4); opacity:.4; top:160% }
.star:nth-child(9) { top:190% }
.star:nth-child(10) { top:220% }
.RaMu * { position:absolute; top:10px }
.hair-back { clip-path:polygon(26.1%18.3%,29.4%18.4%,30.9%18%,31.5%17.5%,31.7%16.5%,28.2%6.5%,28.5%4.9%,28.8%4.7%,31.7%4.9%,35.2%4.3%,38.7%3.5%,42.1%3.1%,47.2%3%,52.9%3.8%,56.6%4.9%,59.5%6.4%,61.3%7.7%,62.7%9.2%,64.4%11.7%,65%12.4%,6 }
.hair-back+li { clip-path:polygon(33.4%29.3%,31.2%29.3%,29.6%29.7%,26.7%31.1%,24.4%32.1%,22.7%32.6%,20.7%32.7%,19.5%32.6%,20%33%,20.9%33.2%,22.5%33.2%,23.9%32.8%,26.1%31.7%,26%32.1%,23%33.3%,23.5%33.8%,24.2%34%,25.5%33.9%) }
```

### [Clip image to svg shape](https://codepen.io/thenotsomiserable/pen/LYXMKgL)

made with: nothing recognised — read the code

### [GSAP SpotLight Effect](https://codepen.io/5thAttemptCode/pen/yLQGbYv)

on hover of span.hover-btn: section.overlay: clip-path | made with: transition · :hover · clip-path · GSAP · pointer / mouse tracking

```css
.overlay { position: absolute; top: 0; clip-path: circle(100px at 50% 50%); clip-path: circle(100px at var(--x, 50%) var(--y, 50%)); transition: all 100ms }
.is-open { clip-path: circle(200% at 100% 100%); transition: all 1.5s }
```

```js
addEventListener('mousemove', (e) => {
gsap.to(overlay, {
```

### [Form Switch Animation (2023)](https://codepen.io/suez/pen/XWyBpre)

made with: @keyframes · transition · clip-path

```css
* { position: relative }
.animated-border { position: absolute; inset: 0; -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, var(--bw) var(--bw), var(--bw) calc(100% - var(--bw)), calc(100% - var(--bw)) calc(100% - var(--bw)), calc(100% - var(--bw)) v }
.animated-border:before { position: absolute; top: 50%; padding-bottom: 150%; transform: translate(-50%, -50%); -webkit-animation: rotateBtnBg 2s linear infinite; animation: rotateBtnBg 2s linear infinite }
.demo { --arrow-offset: 30px; --transition-transform: transform var(--anim-time) ease-in-out; --transition-opacity: opacity 0s calc(var(--anim-time) / 2); filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.3)) }
.demo__inner { transition: -webkit-clip-path var(--anim-time) ease-in-out; transition: clip-path var(--anim-time) ease-in-out; transition: clip-path var(--anim-time) ease-in-out, -webkit-clip-path var(--anim-time) ease-in-out; will-cha }
.demo__forms { transition: var(--transition-transform); will-change: transform }
.demo.s--switched .demo__forms { transform: translateX(var(--switcher-width)) }
.demo__form { position: absolute; inset: 0; transition: var(--transition-opacity) }
.demo.s--switched .demo__form:first-child { opacity: 0 }
.demo__form:last-child { opacity: 0 }
.demo.s--switched .demo__form:last-child { opacity: 1 }
.demo__switcher { position: absolute; top: 0; background-position: center center; -webkit-clip-path: polygon(var(--x1) 0, var(--x2) 0, var(--x3) 50%, var(--x4) 100%, var(--x5) 100%, var(--x6) 50%); clip-path: polygon(var(--x1) 0, var(--x2 }
```

### [grid with min() & grid-column variations](https://codepen.io/BlogFire/pen/WNYXaQZ)

made with: clip-path

```css
header { clip-path: polygon(0% 0%, 100% 10%, 98% 90%, 2% 100%) }
.note-left { clip-path: polygon(2% 0%, 99% 5%, 100% 90%, 1% 100%) }
.note-right { clip-path: polygon(0% 5%, 99% 0%, 97% 100%, 1% 95%) }
```

### [Clip-path on text](https://codepen.io/axlrsr/pen/ZEmXEPX)

made with: clip-path · custom properties driven by JS · GSAP · scroll listener · pointer / mouse tracking

```css
h1#title { position: relative }
h1 .title-stroke { position: absolute; inset: 0; clip-path: circle(var(--clip-size) at var(--x) var(--y)) }
```

```js
addEventListener("scroll", () => {
addEventListener("mouseenter", (e) => {
gsap.to(titleStroke, {
addEventListener("mouseleave", (e) => {
addEventListener("mousemove", (e) => {
style.setProperty("--x", e.clientX - titleRect.left + "px")
style.setProperty("--y", e.clientY - titleRect.top + "px")
```

### [design . CSS only circle navigation](https://codepen.io/fpecher/pen/zYMdyzy)

made with: transition · :hover · clip-path

```css
.circle { position: relative }
.circle__items-inner { transform: rotate(45deg) }
.circle__item { position: absolute; transition: 0.2s cubic-bezier(0.74, 1.13, 0.83, 1.2) }
.circle__item:hover { transform: scale(1.05) }
.circle__item::after { position: absolute; transition: 0.2s linear }
.circle__item--hidden { transform: scale(0.25) }
.circle__item--active { transform: scale(1.05) }
.circle__item--one { clip-path: polygon(50% 0, 50% 50%, 100% 50%, 100% 0) }
.circle__item--one::after { top: 30%; transform: rotate(-45deg) translateX(20px) }
.circle__item--two { clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%) }
.circle__item--two::after { top: 65%; transform: rotate(-45deg) translateY(30px) }
.circle__item--three { clip-path: polygon(50% 50%, -100% 50%, 50% 110%) }
```

### [Alternate slanted sections](https://codepen.io/gc-nomade/pen/gOQRxgm)

made with: clip-path

```css
[data-grid] { filter: drop-shadow(0 0 5px) }
[data-grid] > div { margin-bottom: -100px; position: relative; clip-path: polygon(0 0, 100% 100px, 100% calc(100% - 100px), 0% 100%) }
[data-grid] > div:nth-child(odd) { clip-path: polygon(0 100px, 100% 0, 100% 100%, 0 calc(100% - 100px)) }
[data-grid] + div { margin-top:110px }
h2, h3, h4, h5, h6 { box-shadow: 0 0.5rem 3px -.5rem }
ul { list-style-position: inside; border-bottom:2rem solid transparent; box-shadow: 0 60px 0 -58px purple }
```

### [Corner Wobble Animation](https://codepen.io/Friedslick6/pen/JjeNvjP)

made with: @keyframes · clip-path · requestAnimationFrame

```css
div { position: relative }
div::before { position: absolute; animation: corner-wobble 2s linear 0s infinite }
0% { clip-path: polygon( calc((0% + var(--corner-radius)) + var(--corner-radius) * cos(0rad + 0rad)) calc((0% + var(--corner-radius)) + var(--corner-radius) * sin(0rad + 0rad)), calc((100% - var(--corner-radius)) - var(--corn }
0.833333333% { clip-path: polygon( calc((0% + var(--corner-radius)) + var(--corner-radius) * cos(0.052359878rad + 0rad)) calc((0% + var(--corner-radius)) + var(--corner-radius) * sin(0.052359878rad + 0rad)), calc((100% - var(--corner-r }
1.666666667% { clip-path: polygon( calc((0% + var(--corner-radius)) + var(--corner-radius) * cos(0.104719755rad + 0rad)) calc((0% + var(--corner-radius)) + var(--corner-radius) * sin(0.104719755rad + 0rad)), calc((100% - var(--corner-r }
2.5% { clip-path: polygon( calc((0% + var(--corner-radius)) + var(--corner-radius) * cos(0.157079633rad + 0rad)) calc((0% + var(--corner-radius)) + var(--corner-radius) * sin(0.157079633rad + 0rad)), calc((100% - var(--corner-r }
3.333333333% { clip-path: polygon( calc((0% + var(--corner-radius)) + var(--corner-radius) * cos(0.20943951rad + 0rad)) calc((0% + var(--corner-radius)) + var(--corner-radius) * sin(0.20943951rad + 0rad)), calc((100% - var(--corner-rad }
4.166666667% { clip-path: polygon( calc((0% + var(--corner-radius)) + var(--corner-radius) * cos(0.261799388rad + 0rad)) calc((0% + var(--corner-radius)) + var(--corner-radius) * sin(0.261799388rad + 0rad)), calc((100% - var(--corner-r }
5% { clip-path: polygon( calc((0% + var(--corner-radius)) + var(--corner-radius) * cos(0.314159265rad + 0rad)) calc((0% + var(--corner-radius)) + var(--corner-radius) * sin(0.314159265rad + 0rad)), calc((100% - var(--corner-r }
5.833333333% { clip-path: polygon( calc((0% + var(--corner-radius)) + var(--corner-radius) * cos(0.366519143rad + 0rad)) calc((0% + var(--corner-radius)) + var(--corner-radius) * sin(0.366519143rad + 0rad)), calc((100% - var(--corner-r }
6.666666667% { clip-path: polygon( calc((0% + var(--corner-radius)) + var(--corner-radius) * cos(0.41887902rad + 0rad)) calc((0% + var(--corner-radius)) + var(--corner-radius) * sin(0.41887902rad + 0rad)), calc((100% - var(--corner-rad }
7.5% { clip-path: polygon( calc((0% + var(--corner-radius)) + var(--corner-radius) * cos(0.471238898rad + 0rad)) calc((0% + var(--corner-radius)) + var(--corner-radius) * sin(0.471238898rad + 0rad)), calc((100% - var(--corner-r }
```

```js
requestAnimationFrame(animateTitles)
```

### [ジグザグ！！！](https://codepen.io/hrshishym/pen/MWzmvqN)

made with: clip-path

```css
.box-wrapper { filter: drop-shadow(0 0 10px rgba(0,0,0, 0.3)) }
.box { clip-path: polygon( 0 0, 5% var(--px), 10% 0, 15% var(--px), 20% 0, 25% var(--px), 30% 0, 35% var(--px), 40% 0, 45% var(--px), 50% 0, 55% var(--px), 60% 0, 65% var(--px), 70% 0, 75% var(--px), 80% 0, 85% var(--px), 90% 0 }
img { vertical-align: bottom }
```

### [商品タグみたいなタグ](https://codepen.io/hrshishym/pen/OJamgEW)

made with: clip-path

```css
.tag { position: relative; clip-path: polygon( 0 50%, 10px 0, 100% 0, 100% 100%, 10px 100%, 0 50% ) }
.tag::before { position: absolute; top: 50%; transform: translateY(-50%) }
img { vertical-align: bottom }
```

### [Shapes with Clip Path](https://codepen.io/GilaniRabbu/pen/QWJGede)

made with: clip-path

```css
.one { position: relative }
.one::after, .one::before { position: absolute; bottom: -1rem }
.one::before { transform: skew(0, 30deg) }
.one::after { transform: skew(0, -30deg) }
.two { margin-bottom: -10vw; position: relative; clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10vw), 0 100%) }
.two-img { clip-path: polygon(100% 0%, 75% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%) }
.three-img { clip-path: polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%) }
```

### [Pure CSS hover effect on <img> rounded poly avatars with outline](https://codepen.io/thebabydino/pen/wvQaOpz)

held: fixed svg.[object | on scroll: img.: clip-path+top | on hover of img.: img.: clip-path+top ×2 | made with: position: fixed · transition · :hover · clip-path

```css
body { filter: url(#roundout) }
svg[height="0"] { position: fixed }
img { translate: calc(43.3012701892%*tan(30deg - var(--aa)) - 25%); scale: calc(cos(30deg - var(--aa))/0.8660254038); clip-path: polygon(calc(50% + calc(43.3012701892%/cos(30deg - var(--aa)))*cos(calc(calc(-60deg + var(--ra))  }
```

### [Background img/gradient + clip-path](https://codepen.io/nodesader/pen/eYQNepy)

made with: clip-path

```css
.container { background-position: center; clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%) }
h1 { padding-top: 150px }
```

### [Clip-Path Image Animation](https://codepen.io/SatyamNagar/pen/vYQYMQr)

on scroll: img.img-2: clip-path | made with: transition · :hover · clip-path

```css
.img-container { position: relative }
.img { position: absolute; top: 0%; bottom: 0% }
.img-1 { filter: contrast(0.3) brightness(0.6) }
.img-2 { clip-path: circle(0% at 50% 50%); transition: clip-path 1.2s ease-out }
.img-container:hover .img-2 { clip-path: circle(100% at 50% 50%) }
```

### [Text Link: Animation (on Hover) - Using Clip-Path: Polygon](https://codepen.io/rajanchaudhari08/pen/zYMOyjz)

made with: transition · :hover · clip-path

```css
a { position: relative; transition: -webkit-clip-path 500ms ease-in-out; transition: clip-path 500ms ease-in-out; transition: clip-path 500ms ease-in-out, -webkit-clip-path 500ms ease-in-out }
a:hover::before { -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%) }
a::before { position: absolute; -webkit-clip-path: polygon(0 0, 0 0, 0% 100%, 0 100%); clip-path: polygon(0 0, 0 0, 0% 100%, 0 100%); transition: -webkit-clip-path 500ms ease-in-out; transition: clip-path 500ms ease-in-out; transiti }
```

### [30 days of code: #1](https://codepen.io/HamsterCoder/pen/BaqeKeG)

made with: clip-path

```css
.header, .demo { margin-bottom: 40px }
.leage-container-hexagon, .leage-hexagon { clip-path: polygon(50% 0%, 100% 20%, 100% 80%, 50% 100%, 0% 80%, 0% 20%) }
.leage-container-octagon, .leage-octagon { clip-path: polygon(25% 0%, 75% 0% , 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%) }
.leage-container-diamond { clip-path: polygon(25% 0%, 75% 0%, 100% 25%, 90% 70%, 50% 100%, 10% 70%, 0% 25%) }
.leage-diamond { clip-path: polygon(25% 0%, 75% 0%, 100% 25%, 85% 70%, 50% 95%, 15% 70%, 0% 25%) }
```

### [A customizable ring clip-path](https://codepen.io/ostaladaFab/pen/poxGxrJ)

made with: clip-path

```css
.ring { clip-path: path("M 0, 150 A 150 150 0 0 1 300 150 L 240 150 A 90 90 0 0 0 60 150 A 90 90 0 0 0 240 150 L 300 150 A 150 150 0 0 1 0 150 Z") }
```

### [形狀 多邊形](https://codepen.io/Alisone/pen/mdzzMjv)

made with: clip-path

```css
.left-shape { clip-path: polygon(10% 0, 100% 0, 100% 100%, 0 100%, 0 30%) }
.right-shape { clip-path: polygon(0 0, 90% 0, 100% 25%, 100% 100%, 0 100%) }
.circle { clip-path: circle(50px) }
```

### [Pruebas con ClipPath3](https://codepen.io/claudioace/pen/jOeYOXp)

made with: clip-path · pointer / mouse tracking

```css
.ctn { position:relative }
.mousePad { position:absolute; top:0 }
.clip-svg { filter:blur(5px) grayScale(60%); clip-path: url(#myClip) }
```

```js
addEventListener('mousemove', (e) => {
```

### [triangle section, clip-path](https://codepen.io/emelyanova/pen/wvYPEPR)

made with: clip-path

```css
.box { -webkit-clip-path: polygon(0 0, 100% 0, 100% calc(100% - 50px), 50% 100%, 0 calc(100% - 50px)); clip-path: polygon(0 0, 100% 0, 100% calc(100% - 50px), 50% 100%, 0 calc(100% - 50px)) }
```

### [Pruebas con clippath](https://codepen.io/claudioace/pen/xxyPLRR)

made with: clip-path · pointer / mouse tracking

```css
.clip-svg { filter:blur(5px); clip-path: url(#myClip) }
```

```js
addEventListener('mousemove', (e) => {
```

### [clipping content: hiding the overflow](https://codepen.io/ghaste/pen/jOeBwdy)

made with: clip-path

```css
.box { position: relative }
.box:after { position: absolute; rotate: 15deg; bottom: -5rem }
.box:nth-of-type(1) { clip-path: inset(-0.75rem) }
.box:nth-of-type(2) { clip-path: inset(0) }
.box:nth-of-type(3) { clip-path: inset(0) }
.box:nth-of-type(4) { clip-path: inset(0) }
.box:nth-of-type(5) { clip-path: inset(0) }
.box:nth-of-type(4):before { position: absolute; rotate: 15deg; top: -5rem }
```

### [CPC - Challenge: Soft & Sharp](https://codepen.io/Taluska/pen/RweNNGW)

made with: transition · :hover · clip-path

```css
.nato-flag { position: relative; box-shadow: 0 0.125em 0.2em #0003, 0 0.5em 0.6235em #0002, 0 0.75em 1.3em #0002 }
::after, ::before { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.compass { position: absolute; clip-path: polygon( 50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40% ) }
.compass > * { position: absolute; inset: 0; clip-path: polygon(50% -6px, calc(60% - 6px) calc(40% + 3px), 50% 50%); transform: rotate(var(--deg)) }
.border { position: absolute }
.compass:hover { transition: 1s ease; rotate: 360deg }
```

### [clip-path: inset(0) vs. overflow: hidden](https://codepen.io/thebabydino/pen/zYmYpxM)

made with: clip-path

```css
p { position: relative }
p:nth-child(1) { -webkit-clip-path: inset(0); clip-path: inset(0) }
p::after { position: absolute; bottom: -3em; transform: rotate(45deg) }
```

### [Spiral challenge](https://codepen.io/rhineah/pen/KKxjgWO)

made with: clip-path

```css
.spiral { position:absolute }
.circle { clip-path:polygon(0px 0px, 0px 50%, 100% 50%, 100% 0%) }
.b,.d { rotate:180deg }
```

### [Clip path button focus effects, updated to support mobile browsers](https://codepen.io/jdillon/pen/JjaqgWN)

made with: @keyframes · transition · clip-path

```css
button { position: relative }
button:before, button:after { position: absolute; top: 0; transition: -webkit-clip-path 275ms ease-in-out; transition: clip-path 275ms ease-in-out; transition: clip-path 275ms ease-in-out, -webkit-clip-path 275ms ease-in-out }
button.dramatic:before, button.dramatic:after { transition: none }
button:before { box-shadow: -1px 1px 1px 0px #808dcb inset, 0px 0px 0px 4px rgba(14, 16, 20, 0.7) }
button:after { box-shadow: -1px 1px 1px 0px #f79393 inset, 0px 0px 0px 4px rgba(14, 16, 20, 0.7) }
button.left-to-right:after { -webkit-clip-path: inset(0 100% 0 0); clip-path: inset(0 100% 0 0) }
button.left-to-right:focus:after { -webkit-clip-path: inset(0 0 0 0); clip-path: inset(0 0 0 0) }
button.center-out-y:after { -webkit-clip-path: inset(50% 0 50% 0); clip-path: inset(50% 0 50% 0) }
button.center-out-y:focus:after { -webkit-clip-path: inset(0 0 0 0); clip-path: inset(0 0 0 0) }
button.center-out-x:after { -webkit-clip-path: inset(0 50% 0 50%); clip-path: inset(0 50% 0 50%) }
button.center-out-x:focus:after { -webkit-clip-path: inset(0 0 0 0); clip-path: inset(0 0 0 0) }
button.top-to-bottom:after { -webkit-clip-path: inset(0 0 100% 0); clip-path: inset(0 0 100% 0) }
```

### [animated clip-path Card hover reveals info](https://codepen.io/BlogFire/pen/zYJQgYv)

on hover of div.card: div.card: shadow, div.image: clip-path, h2.: transform+opacity, p.: transform+opacity | made with: @keyframes · transition · :hover · clip-path

```css
h1 { margin-bottom: 2rem; background-position: 0 0, 100% 0, 100% 100%, 0 100%; animation: border 1s ease-out forwards 1.75s }
.card { box-shadow: 1rem 1rem 2rem -1rem rgba(15 23 11 / 0); position: relative; transform: translateY(20%); opacity: 0; transition: 0.3s ease; animation: card 1s ease forwards calc(var(--i) * 0.15s) }
100% { transform: translateY(0); opacity: 1 }
.card:hover { box-shadow: 1rem 1rem 2rem -1rem rgba(15 23 11 / 1) }
.image { position: absolute; inset: 0; transition: clip-path 0.4s cubic-bezier(0.7, 1, 0.5, 1.2) }
.card:hover .img { transition: clip-path 0.4s cubic-bezier(0.7, 1, 0.5, 1.2) }
.image::before { position: absolute; top: 80%; transform: translate(-50%, 100%); opacity: 0; animation: before 1s ease forwards; animation-delay: calc(var(--i) * 0.2s); transition: 0.35s ease-in-out }
100% { transform: translate(-50%, -50%); opacity: 1 }
.image1 { clip-path: circle(125% at center 20rem) }
.card:hover .image1 { clip-path: circle(6.5rem at center 7.25rem) }
.image2 { clip-path: inset(0rem 0rem 0% 0rem round 0.75rem 0.75rem) }
.card:hover .image2 { clip-path: inset(0.5rem 0.5rem 50% 0.5rem round 4rem 4rem 0.75rem 0.75rem) }
```

### [How clip-path cuts out a triangle (replayable visualization)](https://codepen.io/MackFitz/pen/zYJQqKa)

made with: @keyframes · clip-path

```css
#replay1:checked ~ .square { animation: darken1 var(--animTime) linear forwards }
#replay2:checked ~ .square { animation: darken2 var(--animTime) linear forwards }
#replay1:checked ~ .square::after { animation: trail1 var(--animTime) linear forwards }
#replay2:checked ~ .square::after { animation: trail2 var(--animTime) linear forwards }
#replay1:checked ~ .square .laser { animation: cut1 var(--animTime) linear forwards }
#replay2:checked ~ .square .laser { animation: cut2 var(--animTime) linear forwards }
#replay1:checked ~ .square .laser::before { animation: fade1 var(--animTime) linear forwards }
#replay2:checked ~ .square .laser::before { animation: fade2 var(--animTime) linear forwards }
div, div::before, div::after { position: absolute }
.square::before { inset: 0; clip-path: polygon(0 100%, 50% 0, 100% 100%) }
.square::after { inset: 0; clip-path: polygon(-1% 100%, 49% -1%, 51% -1%, 101% 100%, 100% 100%, 50% 0%, 0% 100%) }
.caption { position: absolute; top: 100% }
```

### [clip-path: with borders | image size animates on hover](https://codepen.io/BlogFire/pen/qBMwPjG)

made with: transition · :hover · (hover: hover) gate · clip-path

```css
.inset { clip-path: inset(0% 0% 0% 0% round 5%) }
.circle { clip-path: circle(50%) }
.ellipse { clip-path: ellipse(35% 50% at 50% 50%) }
.octagon { clip-path: polygon( 30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30% ) }
.hover { transition: 0.5s ease }
```

### [3D effect with clip-path property](https://codepen.io/KACTOPKA/pen/NWLERez)

on scroll: div.pokemon: clip-path+top | made with: @keyframes · transition · clip-path

```css
.pokemon { clip-path: var(--left-position); transition: .7s; animation: spinPokemon 12s linear infinite }
25% { clip-path: var(--center-position) }
50% { clip-path: var(--right-position) }
75% { clip-path: var(--center-position) }
100% { clip-path: var(--left-position) }
:root { --center-position: polygon(67% 60%, 68% 63%, 72% 66%, 74% 67%, 76% 62%, 73% 49%, 66% 40%, 65% 36%, 72% 12%, 57% 25%, 57% 22%, 55% 25%, 55% 20%, 52% 24%, 50% 15%, 47% 24%, 45% 20%, 45% 25%, 42% 22%, 42% 25%, 27% 12%, 34%  }
@keyframes spinPokemon animates clip-path
```

### [clip-path hover effect](https://codepen.io/Megha02/pen/mdGKzeY)

on scroll: div.inner: clip-path+background, span.: opacity | made with: transition · :hover · clip-path

```css
.container:hover .inner { clip-path: circle(75%) }
span { position: absolute; top: 15%; opacity: 1 }
.container:hover span { opacity: 0 }
.inner { position: relative; clip-path: circle( 10% at 90% 20%); transition: clip-path 0.4s ease-in-out }
```

### [clip-path](https://codepen.io/Megha02/pen/oNPyPqE)

on scroll: div.inner: clip-path | made with: transition · :hover · clip-path

```css
.container:hover .inner { clip-path: circle(75%) }
.inner { clip-path: circle( 10% at 0% 0%); transition: clip-path 0.4s ease-in-out }
```

### [Dual Image Hover](https://codepen.io/dvalo/pen/jOvmXYN)

on scroll: img.dual-image__img: clip-path+top, img.dual-image__img: filter+top | made with: (hover: hover) gate · clip-path · GSAP

```css
.dual-image figure { position: relative; transform: translateZ(0) }
.dual-image .dual-image__img { position: relative }
.dual-image .dual-image__img:not(.dual-image__img--cloned) { will-change: clip-path; transform: scale(1.01) }
.dual-image .dual-image__img--cloned { transform: scale(1.3333); will-change: filter }
.dual-image p { opacity: 0.8 }
```

### [painting style filter](https://codepen.io/vii120/pen/NWLRyrz)

on scroll: div.img: clip-path | made with: transition · :hover · clip-path · mix-blend-mode

```css
.wrapper { position: relative; box-shadow: 3px 3px 15px 2px rgba(0, 0, 0, 0.5) }
.wrapper:hover .img.cover { -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%) }
.img-wrapper { position: relative; filter: contrast(5) grayscale(1) brightness(5) }
.img { position: absolute; top: 0 }
.img.origin { filter: blur(0.5px) }
.img.cover { -webkit-clip-path: polygon(0 0, 100% 100%, 100% 100%, 0 100%); clip-path: polygon(0 0, 100% 100%, 100% 100%, 0 100%); transition: all 0.3s }
.color-mask { position: absolute; top: 0; mix-blend-mode: screen }
```

### [NewCity - Consistent Diagonal Clipping](https://codepen.io/wonkeythemonkey/pen/eYLJGOZ)

made with: clip-path

```css
.parallelogram-container { --corner-offset: calc( var(--tangent ) * var(--height, 0) ); clip-path: polygon( var(--corner-offset) 0%, 100% 0%, calc( 100% - var(--corner-offset) ) 100%, 0% 100%) }
```

### [前后对比](https://codepen.io/sangbiao/pen/wvEMaOM)

made with: clip-path

```css
.container { position: relative; box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5) }
.container .photo { position: absolute; top: 0 }
.container .photo.photo_down { filter: grayscale(100%) }
.container .photo.photo_up { clip-path: inset(0 0 0 50%) }
.container .bar { position: absolute; transform: translateX(-50%) }
```

### [文字聚光灯-文字渐变背景](https://codepen.io/sangbiao/pen/WNgeOPv)

made with: @keyframes · clip-path

```css
h1 { position: relative }
h1::after { position: absolute; top: 0; animation: move 2s infinite alternate }
from { clip-path: circle(50px at 0% 50%) }
to { clip-path: circle(50px at 100% 50%) }
@keyframes move animates clip-path
```

### [文字聚光灯](https://codepen.io/sangbiao/pen/poOzwaj)

made with: @keyframes · clip-path

```css
h1 { position: relative }
h1::after { position: absolute; top: 0; animation: move 2s infinite alternate }
from { clip-path: circle(50px at 0% 50%) }
to { clip-path: circle(50px at 100% 50%) }
@keyframes move animates clip-path
```

### [Controller buttons](https://codepen.io/syndicatefx/pen/zYLgGPv)

made with: :focus-visible · :has() · clip-path · 3D (perspective / preserve-3d)

```css
button::after { clip-path: polygon(50% 0%, 100% 100%, 0 100%); transform: rotate(var(--rot)) }
.controler { clip-path: polygon(33% 0, 66% 0, 66% 33%, 100% 33%, 100% 66%, 66% 66%, 66% 100%, 33% 100%, 33% 66%, 0 66%, 0 33%, 33% 33%) }
.controler-shadow { filter: drop-shadow(0 var(--ts, -2px) 0 var(--c2)) drop-shadow(var(--rs, 2px) 0 0 var(--c2)) drop-shadow(0 var(--bs, 2px) 0 var(--c2)) drop-shadow(var(--ls, -2px) 0 0 var(--c2)) }
.controler-shadow:has(.btn-top:active) { transform: rotateX(20deg) }
.controler-shadow:has(.btn-right:active) { transform: rotateY(20deg) }
.controler-shadow:has(.btn-bottom:active) { transform: rotateX(-20deg) }
.controler-shadow:has(.btn-left:active) { transform: rotateY(-20deg) }
```

### [X-Ray - Pure CSS](https://codepen.io/josetxu/pen/yLqWogR)

made with: @keyframes · transition · :hover · clip-path

```css
body { box-shadow: 0 0 12vmin 5vmin #000 inset }
body:after { position: absolute; bottom: 9.5vmin; animation: block-btn 4s linear 0s 1; animation-fill-mode: forwards }
0%, 50% { bottom: 9.5vmin }
51%, 100% { bottom: -10vmin }
.content { position: relative; margin-top: -10vmin }
.x-ray { position: relative }
.human-body, .skeleton { position: absolute; top: 0 }
.human-body div { position: absolute }
.hair { top: 1vmin; clip-path: polygon(3% 100%, 4% 94%, 2% 88%, 1% 80%, 1% 74%, 1% 60%, 3% 46%, 5% 39%, 8% 32%, 12% 27%, 17% 21%, 23% 15%, 31% 11%, 39% 9%, 45% 6%, 48% 5%, 51% 4%, 49% 13%, 52% 12%, 57% 11%, 64% 9%, 71% 8%, 76% 8 }
.ears { top: 12.5vmin }
.ears:before, .ears:after { position: absolute; top: 0.15vmin; transform: rotate(40deg) }
.ears:after { transform: rotateY(180deg) rotate(40deg) }
```

### [CSS img - clip-path](https://codepen.io/sans-script/pen/VwBgOKq)

made with: clip-path

```css
.img1 { position: absolute; clip-path: polygon(0 0, 0% 100%, 100% 100%) }
.img2 { clip-path: polygon(0 0, 100% 0, 100% 100%) }
```

### [Clip-path hover](https://codepen.io/wescouch/pen/abjRJXX)

on hover of img.hover-img: img.hover-img: clip-path | made with: transition · :hover · clip-path

```css
body { padding-top: 2rem; padding-bottom: 2rem }
body .hover-img { clip-path: polygon(0 0, 100% 0, 100% calc(100% + 1px), 0 calc(100% + 1px)); transition: clip-path 1.2s cubic-bezier(0.05, 0.07, 0.05, 0.95) }
body .hover-img:hover { clip-path: polygon(0 0, 100% 0, 100% 0, 0 0) }
```

### [Shadow on a Clip-path](https://codepen.io/CybMarionette/pen/RwBJQee)

made with: clip-path

```css
h1 { position: absolute; top:2% }
#child__img { position: absolute; top:5%; clip-path: circle(15% at 50% 50%) }
#parent__img { position:absolute; filter: drop-shadow(0 0 0.75rem #13005A) }
#description { position:absolute; top:30% }
#parent__img { top:10% }
#description { top:90% }
```

### [Clip-path: image reveal](https://codepen.io/gusevdigital/pen/dyjJJmj)

made with: transition · clip-path

```css
.box { position: relative; clip-path: inset(50% round 50%); transition: clip-path 1s }
.box img { position: absolute; top: 0; transform: scale(1.1); transition: transform 1s ease-in-out }
.box.show { clip-path: inset(0% round 0%) }
.box.show img { transform: scale(1) }
button { text-transform: lowercase; margin-bottom: 2rem }
```

### [Clip-path mousemove effect](https://codepen.io/gusevdigital/pen/JjBMrmQ)

held: fixed section.banner | on scroll: section.banner: clip-path | made with: position: fixed · clip-path · mix-blend-mode · custom properties driven by JS · pointer / mouse tracking

```css
.banner { position: fixed; clip-path: circle(120px at var(--x) var(--y)); transform: translate3d(0, 0, 0) }
.banner:active { clip-path: circle(400px at var(--x) var(--y)) }
.content { position: relative; mix-blend-mode: overlay }
.content h2 { position: relative }
.content p { position: relative }
```

```js
addEventListener('mousemove', e => {
style.setProperty('--x', e.clientX + 'px')
style.setProperty('--y', e.clientY + 'px')
```

### [Walking pentagon](https://codepen.io/prowebsitecrafter/pen/yLqPjQX)

on scroll: div.: clip-path+top | made with: @keyframes · clip-path · mix-blend-mode

```css
h1 { mix-blend-mode: difference }
div { position: absolute; clip-path:; animation: clip 5s linear infinite }
0% { clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 50% 50%) }
20% { clip-path: polygon(50% 50%, 100% 38%, 82% 100%, 18% 100%, 0% 38%) }
40% { clip-path: polygon(50% 0%, 50% 50%, 82% 100%, 18% 100%, 0% 38%) }
60% { clip-path: polygon(50% 0%, 100% 38%, 50% 50%, 18% 100%, 0% 38%) }
80% { clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 50% 50%, 0% 38%) }
100% { clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 50% 50%) }
@keyframes clip animates clip-path
```

### [clip-path cutter ✂️](https://codepen.io/rudtjd2548/pen/xxJLpxJ)

on hover of button.: p.: transform+clip-path+top ×2 | made with: GSAP · pointer / mouse tracking

```css
.be-careful { position: absolute; top: 0; opacity: 0.5 }
.select { position: absolute; bottom: 5vmin }
.select > button { border-bottom: 0.6vmin solid #2f2f2f; position: relative }
.select > button::after { position: absolute; bottom: 0; transform: rotate(45deg) translate(20%, -20%) }
.container { position: relative }
.container > * { position: absolute; will-change: transform }
```

```js
addEventListener('mousemove', this.onMove)
gsap.timeline()
```

### [Responsive Expanding Cards](https://codepen.io/maticristovao/pen/YzjxyBg)

made with: transition · clip-path

```css
.education-card { position: relative; background-position: center; transition: flex 0.5s ease-in }
.label { position: absolute; opacity: 0.5; transition: all ease-in-out 0.5s }
.education-card.active .label { bottom: 20px; opacity: 1 }
.education-card:not(.active) .label { bottom: 10px }
.info { clip-path: polygon(calc(100% - 42.3vw) 0, 100% 0, 100% 100%, calc(100% - 13vw) 100%); padding-top:20px; transition: opacity 0.5s ease-in-out .3s }
.active .info { opacity: 1 }
.education-card:not(.active) .info { opacity: 0; transition: opacity 0.2s ease-in-out }
h1::first-letter { text-transform: uppercase }
.icon { position: absolute; top: 15px; bottom: 0; opacity: 0.5; transition: all 0.5s ease-in-out }
.education-card.active .icon { opacity: 1; top: -50px; bottom: 0 }
.education-card .icon fa-icon { transition: padding-top ease-in-out 0.5s }
.education-card.active .icon fa-icon { padding-top: 40px }
```

### [Pure CSS animation transition test](https://codepen.io/aledebarba/pen/yLqbOwa)

on scroll: div.text: transform ×2, div.content: clip-path | made with: @keyframes · clip-path

```css
.wrapper { position: relative; position: relative }
.content { position: absolute; top: 0 }
.text { position: absolute; animation: var(--animtime) ease-in-out infinite alternate run }
.over { clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%); animation: var(--animtime) ease-in-out infinite alternate invert }
0%, 20% { transform: translateX(37.6%) }
80%, 100% { transform: translateX(-40.6%) }
15% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%) }
80% { clip-path: polygon(0 0, 100% 0, 100% 0, 0 0) }
100% { clip-path: polygon(0 0, 100% 0, 100% 0, 0 0) }
@keyframes run animates transform
@keyframes invert animates clip-path
```

### [Scroll Clip Path Reveal](https://codepen.io/numerical/pen/ZEjpVxB)

on scroll: div.expand: clip-path+top | made with: clip-path · scroll listener

```css
.expand { -webkit-clip-path: circle(0 at 0 0); clip-path: circle(0 at 0 0); padding-bottom: 50vh; padding-top: 75vh }
h1 { text-transform: uppercase }
h6 { margin-bottom: 1rem }
```

```js
addEventListener('scroll', e => {
```

### [Corner Ribbon Effect with CSS only](https://codepen.io/GeoffreyCrofte/pen/wvxGmZV)

made with: clip-path

```css
.Panel { position: relative }
.corner-ribbon { position: absolute; top: -3px }
.corner-ribbon .cr-inner { position: absolute; inset: 0; -webkit-clip-path: polygon(0 0, 100% 0, 0 100%); clip-path: polygon(0 0, 100% 0, 0 100%) }
.corner-ribbon .cr-text { transform: rotate(-45deg) translateY(0.1em) translateX(-1.8em) }
.corner-ribbon .cr-text strong { text-transform: uppercase }
.corner-ribbon::before, .corner-ribbon::after { position: absolute }
.corner-ribbon::before { top: calc(100% - 8px) }
.corner-ribbon::after { top: 0 }
```

### [Text slides up line by line Vanilla JS (Web Animations API)](https://codepen.io/web_walking_nak/pen/vYaYGBz)

made with: clip-path · IntersectionObserver · Web Animations API (.animate)

```css
.js-slide-up-row { position: relative; opacity: 0 }
.js-slide-up-row.is-setup { opacity: 1 }
.js-slide-up-row__base { opacity: 0 }
.js-slide-up-row__line, .js-slide-up-row__checker { position: absolute; top: 0 }
.u-visually-hidden { position: absolute; clip-path: inset(50%) }
h1 { margin-bottom: 50px }
```

```js
.animate( {
new IntersectionObserver(entries => {
```

### [Skew Image with without Skew instead using Clip-path](https://codepen.io/hiitssid/pen/qBKejaO)

made with: clip-path

```css
.wrapper { clip-path: polygon(14% 0, 100% 0%, 86% 100%, 0% 100%) }
```

### [Image hover with clip-path](https://codepen.io/mradermaker/pen/vYrbdQa)

made with: transition · :hover · clip-path

```css
.c-author { transition: background-color 0.25s ease }
.c-author__picture { position: relative; clip-path: path("M0,0v150c0,50,50,100,100,100s100-50,100-100V0H0z") }
.c-author__picture:after { position: absolute; bottom: 0 }
.c-author__image { position: relative; transform: translateY(1rem) scale(1); transform-origin: 50% top; transition: transform 0.25s ease; object-position: bottom center }
.c-author:hover .c-author__image, .c-author:focus .c-author__image { transform: translateY(0) scale(1.05) }
```

### [擴散Menu效果](https://codepen.io/thisWeb1225/pen/abKQKJV)

on scroll: li.: background+color | on hover of div.menu--btn: li.: background+color | made with: transition · :hover · clip-path

```css
li { margin-top: 16px; transition: 0.3s }
.menu { position: relative; transition: 0.6s linear; clip-path: circle(32px at 24px 24px) }
.menu ul { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.menu.active { clip-path: circle(600px at 44px 44px) }
```

### [Animation using clip-path css](https://codepen.io/lucasfernandodev/pen/wvXQGPa)

made with: clip-path · backdrop-filter · custom properties driven by JS · pointer / mouse tracking

```css
body { background-position: center center; position: relative }
body::before { position: absolute; top: 0px; backdrop-filter: blur(5px); filter: sepia(100%); clip-path: polygon( 0% 0%, 0% 100%, var(--bottom-left-x) 100%, var(--top-left), var(--top-right), var(--bottom-right), var(--bottom-left), va }
```

```js
style.setProperty("--top-left-x", `${topleftX}`)
style.setProperty("--top-left-y", `${topleftY}`)
style.setProperty("--bottom-left-x", `${bottomLeftX}`)
style.setProperty("--bottom-left-y", `${bottomLeftY}`)
style.setProperty("--top-right-x", `${toprightX}`)
style.setProperty("--top-right-y", `${toprightY}`)
style.setProperty("--bottom-right-x", `${bottomRightX}`)
style.setProperty("--bottom-right-y", `${bottomRightY}`)
```

### [polygon clip-path](https://codepen.io/julbrn/pen/YzvjGxd)

made with: clip-path

```css
.polygon { clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%) }
p { text-transform: uppercase }
```

### [Scroll clip-path effect](https://codepen.io/t-damer/pen/OJEELxO)

held: fixed section | on scroll: div.box: clip-path ×2 | made with: position: fixed · clip-path · scroll listener

```css
section { position: fixed; top: 0 }
section .box { position: absolute }
section .box.box1 { clip-path: circle(200px at 0 0) }
section .box.box2 { clip-path: circle(150px at 100% 100%) }
section h2 { position: absolute; top: 50%; transform: translateY(-50%) }
```

```js
addEventListener("scroll", () => {
```

### [Dark-Light mode switch](https://codepen.io/EvyatarDa/pen/mdKXgjW)

held: fixed button.dark-mode-toggle, fixed div.clip | made with: position: fixed · @keyframes · clip-path

```css
.avatar { box-shadow: 0 0 2rem 0 rgba(0,0,0,.2) }
.description { opacity: 0.75 }
.contact { margin-top: auto; text-transform: uppercase }
.social-icons { margin-top: 1.5rem }
.dark-mode-toggle { position: fixed; bottom: 2rem; box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.5) }
.clip { position: fixed; inset: 0; clip-path: inset(0 0 100% 0) }
.clip.animate { animation: clip .7s both cubic-bezier( 0.79, 0.33, 0.14, 0.53 ) }
from { clip-path: inset(0 0 100% 0) }
to { clip-path: inset(0 0 0 0) }
@keyframes clip animates clip-path
```

### [Clipped Parallalograms](https://codepen.io/toolbox237/pen/eYKGgoq)

made with: clip-path

```css
.row { position: relative }
.row.two { top: -35px }
.row .box { clip-path: polygon(0 22%, 100% 0%, 100% 80%, 0% 100%); position: relative; vertical-align: top }
.row .box:nth-of-type(2n+2) { clip-path: polygon(0 0, 100% 21%, 100% 100%, 0 80%) }
.row .box.image img { position: absolute; top: 0 }
```

### [CSS Grid Pizza](https://codepen.io/saheeranas/pen/yLEXbqx)

made with: clip-path

```css
.list_1 { position: relative }
.list_1::before { position: absolute; top: 0; box-shadow: 0px 0px 0px 15px #f29d20 inset }
.list_1 .item { position: relative }
.list_1 .item:nth-child(1) { clip-path: polygon(0 0, 50% 0, 100% 100%, 0% 100%) }
.list_1 .item:nth-child(2) { clip-path: polygon(0 0, 100% 0%, 50% 100%); transform: translateX(-50%) }
.list_1 .item:nth-child(3) { clip-path: polygon(50% 0, 100% 0, 100% 100%, 0% 100%) }
.list_1 .item:nth-child(4) { clip-path: polygon(0 0, 100% 0%, 50% 100%, 0% 100%) }
.list_1 .item:nth-child(5) { clip-path: polygon(50% 0, 100% 100%, 0% 100%); transform: translateX(-50%) }
.list_1 .item:nth-child(6) { clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 100%) }
```

### [Non-rectangular Sections | CSS clip-path](https://codepen.io/cgrkzlkn/pen/qBKaZxx)

made with: clip-path

```css
section h1 { text-transform: uppercase }
.tilt { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - var(--cut))); position: relative }
.triangle { clip-path: polygon( 0 0, 100% 0, 100% calc(100% - var(--cut)), 50% 100%, 0 calc(100% - var(--cut)) ); margin-top: calc(var(--cut) * -1); position: relative }
.polygon { clip-path: polygon( 0 0, 100% 0, 100% 100%, 80% calc(100% - var(--cut)), 20% calc(100% - var(--cut)), 0 100% ); margin-top: calc(var(--cut) * -1); position: relative }
.last { margin-top: calc(var(--cut) * -1) }
```

### [Card with clip-path](https://codepen.io/szuzs/pen/mdKEzOQ)

on hover of div.card: div.card: background+shadow, img.: clip-path | made with: transition · :hover · clip-path

```css
.card { transition: border 1s ease-in, background ease-out, box-shadow 0.1s }
.card img { -webkit-clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); transition: -webkit-clip-path 2s ease-in-out; transition: clip-p }
p { transition: visibility }
.card:hover { box-shadow: 0.2em 0.3em 2em #353535 }
.card:hover img { -webkit-clip-path: none; clip-path: none }
```

### [Cool Symbol](https://codepen.io/syndicatefx/pen/MWXKyqX)

made with: @keyframes · clip-path

```css
.symbol-shadow { filter: drop-shadow(0 0 14px var(--shadow)) }
.symbol { position:relative; clip-path: polygon( 50% 0%, 50% 25%, 19% 88%, 81% 88%, 50% 25%, 50% 0, 100% 100%, 0% 100% ) }
.symbol::before { position: absolute; inset: -35% -50%; will-change: transform; animation: rot 8s linear infinite }
0% { transform: rotate(0) }
100% { transform: rotate(360deg) }
@keyframes rot animates transform
```

### [CSS responsive animated clip-path](https://codepen.io/sebastianomorando/pen/ExRVPwo)

made with: @keyframes · clip-path

```css
#blob>path { animation: blob linear infinite 15s }
#square { clip-path: url(#blob); text-transform: uppercase }
@keyframes blob animates d
```

### [Fortnite New Quests Button Animation CSS-Only](https://codepen.io/Juxtopposed/pen/vYrOaRR)

on scroll: div.cont: background+color, span.: color | on hover of a.: div.redirect: background+color, div.cont: background+color, span.: color | made with: @keyframes · :hover · clip-path

```css
.animation { animation-name: animation; animation-duration: 3s; animation-iteration-count: infinite; animation-timing-function: ease }
span { clip-path: polygon(4% 10%, 95% 15%, 97% 85%, 2% 90%) }
.about { position: absolute; top: 30px }
.redirect { clip-path: polygon(5% 0, 100% 0, 95% 100%, 0 100%) }
@keyframes animation animates width, height, border
```

### [CodePen Challenge - Happy Halloween](https://codepen.io/sobary/pen/ExRaPZe)

on scroll: div.: background | made with: @keyframes · transition · :hover · clip-path

```css
.word .letter { position: relative; transition: 500ms all ease-in }
.word .p { clip-path: polygon(0 0, 95% 0, 100% 60%, 30% 60%, 30% 90%, 0 100%) }
.word .p::before { position: absolute; top: 18% }
.word .y { clip-path: polygon(0 5%, 25% 0, 50% 40%, 75% 0, 100% 5%, 65% 60%, 70% 100%, 35% 100%, 35% 60%) }
.word .h { clip-path: polygon(0 0, 40% 5%, 40% 35%, 60% 35%, 60% 5%, 100% 0, 100% 100%, 60% 95%, 60% 60%, 40% 60%, 40% 95%, 0 100%) }
.word .a { clip-path: polygon(40% 0, 60% 0, 100% 100%, 80% 100%, 60% 60%, 40% 60%, 20% 100%, 0 100%) }
.word .a::before { position: absolute; top: 18% }
.word .l { clip-path: polygon(0 0, 35% 0, 25% 75%, 100% 65%, 100% 100%, 0 100%) }
.word .o { clip-path: polygon(0 0, 100% 5%, 100% 95%, 5% 100%) }
.word .o::before { position: absolute; top: 34% }
.word .w { clip-path: polygon(0 0, 15% 5%, 35% 60%, 50% 20%, 75% 60%, 90% 5%, 100% 0, 80% 100%, 70% 100%, 55% 50%, 40% 100%, 30% 100%) }
.word .e { clip-path: polygon(0 0, 100% 0, 100% 20%, 30% 15%, 30% 40%, 80% 40%, 85% 60%, 30% 60%, 30% 85%, 100% 80%, 95% 100%, 0 100%) }
```

### [Corner ribbon with clip-path](https://codepen.io/olivier-c/pen/gOKYWqq)

on hover of a.ribbon-top-left: a.ribbon-top-left: color | made with: transition · :hover · clip-path

```css
.ribbon-content { position: relative }
.ribbon-content > [class*=ribbon] { position: absolute }
.ribbon-content > [class*=ribbon]::before, .ribbon-content > [class*=ribbon]::af { position: absolute; inset: 0; -webkit-clip-path: polygon(2em 0, 8em 0, 10em 2em, 10em 2.5em, 9.5em 2em, 0.5em 2em, 0 2.5em, 0 2em); clip-path: polygon(2em 0, 8em 0, 10em 2em, 10em 2.5em, 9.5em 2em, 0.5em 2em, 0 2.5em, 0  }
.ribbon-content > [class*=ribbon]::before { top: 0.1em }
.ribbon-content > [class*=ribbon]::after { border-bottom: 0.5em solid #505050; transition: background-color 0.2s ease-in-out }
.ribbon-content > [class*=ribbon] span { transform: rotate(180deg) }
.ribbon-content > a[class*=ribbon] { transition: color 0.2s ease-in-out }
.ribbon-content > [class*=ribbon-top] { filter: drop-shadow(0 0.5em 0.5em rgba(0,0,0,0.1)) }
.ribbon-content > [class*=ribbon-bottom] { filter: drop-shadow(0 -0.5rem 0.5rem rgba(0,0,0,0.1)) }
.ribbon-content > .ribbon-top-left { top: 0; transform: translate(-2.35em, 1.4em) rotate(-45deg) }
.ribbon-content > .ribbon-top-right { top: 0; transform: translate(2.35em, 1.4em) rotate(45deg) }
.ribbon-content > .ribbon-bottom-left { bottom: 0; transform: translate(-2.35em, -1.4em) rotate(225deg) }
```

### [CodePen Card](https://codepen.io/lloret-adrien/pen/OJZKjQQ)

on scroll: a.stat: transform+opacity+top ×2, div.background: clip-path, button.stat: transform+opacity+top | made with: transition · :hover · clip-path

```css
article { position: relative }
.background { --inset: 2rem; --offset: -1rem; position: absolute; top: 0; bottom: 0; clip-path: inset(var(--inset-top, var(--inset)) var(--inset-right, var(--inset)) var(--inset-bottom, var(--inset)) var(--inset-left, var(--inset)) ro }
.infos header, .infos footer { position: relative }
header svg { transition: fill 0.2s linear }
.titleAndAuthor .author { transition: all 0.2s ease }
footer .stat:hover { outline-offset: 3px }
footer.revealOnHover .stat { transform: translateY(-50%); opacity: 0; transition: all 0.2s ease; transition-property: transform, opacity }
article:hover .revealOnHover .stat { transform: translateY(0); opacity: 1 }
article:hover .background { clip-path: inset(0 0 0 0 round var(--radius)) }
```

### [clip-path inset round](https://codepen.io/olivier-c/pen/Rwydvea)

made with: clip-path

```css
.el { position: relative; -webkit-clip-path: inset(0 round 0 100%); clip-path: inset(0 round 0 100%) }
```

### [Vampires - Codepen challenge](https://codepen.io/sobary/pen/xxjmKOb)

on scroll: div.: clip-path | on hover of li.: div.: clip-path | made with: transition · :hover · clip-path

```css
#illustration { position: relative }
#illustration:hover #mouth { -webkit-clip-path: circle(40px at 50% 0); clip-path: circle(40px at 50% 0) }
#illustration #head { -webkit-clip-path: ellipse(100px 130px at center); clip-path: ellipse(100px 130px at center); margin-top: 2rem; position: relative }
#illustration #nose { position: absolute; top: 50%; border-bottom: 3px solid #110603 }
#illustration #nose::before { position: absolute; top: 20%; transform: skewx(-20deg) }
#illustration #eyes { position: absolute; top: 40% }
#illustration #eyes .eye { -webkit-clip-path: ellipse(16px 20px at center); clip-path: ellipse(16px 20px at center); position: relative }
#illustration #eyes .eye::before { position: absolute; -webkit-clip-path: ellipse(3px 6px at center); clip-path: ellipse(3px 6px at center); top: 10% }
#illustration #mouth { position: absolute; top: 70%; -webkit-clip-path: circle(40px at 50% 100%); clip-path: circle(40px at 50% 100%); transition: 500ms all ease-in }
#illustration #mouth::before, #illustration #mouth::after { position: absolute; top: 0; -webkit-clip-path: polygon(0 0, 100% 0, 50% 100%); clip-path: polygon(0 0, 100% 0, 50% 100%) }
#illustration #hair { position: absolute; top: 0%; -webkit-clip-path: polygon(0 100%, 0 0, 100% 0, 100% 100%, 65% 50%, 50% 85%, 35% 50%); clip-path: polygon(0 100%, 0 0, 100% 0, 100% 100%, 65% 50%, 50% 85%, 35% 50%) }
#illustration #ears { position: absolute; top: 44%; -webkit-clip-path: ellipse(112px 50px at center); clip-path: ellipse(112px 50px at center) }
```

### [Video Banner using CSS Grid, Clip-Path](https://codepen.io/stevenmonson/pen/BaxOWbP)

held: fixed header | made with: position: fixed · transition · :hover · clip-path

```css
.banner { position:relative; box-shadow: 0 0.5vw #25719c, 0 1vw #bce9e5 }
.banner-shape { clip-path: polygon(0 0, 100% 0%, 80% 84%, 86% 100%, 0 100%); transition:0.1s ease; //opacity:0.9 }
.banner-shape.white { transform:translate(2.2%,0px) }
.banner-shape.green { opacity:0.3; transform:translate(2.6%,0px) }
.banner-text h1 { text-transform:uppercase }
.videoWrapper { background-position:35% 50% }
.videoWrapper video { //opacity:0.5; object-position:35% 90% }
.banner-btn { //position:absolute; bottom:-9%; box-shadow: 0 2px #155030 , inset 0 8px 8px rgba(255,252,183,0.2); //transition: 0.1s cubic-bezier(.23,1,.32,1) }
.banner-btn:hover { transform:translateY(-1px) scale(1.01); filter:brightness(1.05) saturate(1.1); box-shadow: 0 6px 0 -2px #155030 , inset 0 8px 8px rgba(255,252,183,0.3) }
.banner-shape { clip-path: polygon(0% 0%, 14% 10%, 100% 0, 100% 100%, 0 100%) }
.banner-shape.white { transform:translate(0px,-8px) }
.banner-shape.green { transform:translate(0px,-10px) }
```

### [Challenge: Pumpkin](https://codepen.io/sobary/pen/abGaZVQ)

made with: clip-path

```css
.title { position: relative }
.lighteningBolt { position: absolute; -webkit-clip-path: polygon( 25% 0%, 70% 0%, 40% 35%, 95% 35%, 20% 100%, 40% 55%, 0% 55% ) }
#lighteningBolt1 { top: 23%; transform: rotate(-25deg) }
#lighteningBolt2 { bottom: 23%; transform: rotate(25deg) }
#pumpkin { position: relative }
.sideLeft { -webkit-clip-path: ellipse(40% 40% at 50% 46%) }
.sideRight { -webkit-clip-path: ellipse(40% 40% at 50% 46%) }
.middle { -webkit-clip-path: ellipse(35% 43% at 50% 46%); position: absolute }
.stem { -webkit-clip-path: polygon(25% 10%, 60% 0%, 90% 100%, 0% 100%); position: absolute; top: -50px }
.stem::before { position: absolute; top: 0 }
.eye { position: absolute; -webkit-clip-path: ellipse(40% 50% at 50% 50%) }
.eye::after { position: absolute; top: 10% }
```

### [CSS Triangles](https://codepen.io/IQrate/pen/XWqBxbj)

made with: clip-path

```css
.first { border-top: 150px solid transparent }
.second { clip-path: polygon(0 0, 0 100%, 100% 100%) }
.container { position: relative; transform: translateX(-50%) }
```

### [Before-After Image Slider | CSS clip-path + Vanilla JS](https://codepen.io/cgrkzlkn/pen/ZEooeeW)

made with: clip-path

```css
.before-after { position: relative; box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px }
.before-after .img { position: absolute; top: 0 }
.before-after .img.front-img { clip-path: polygon(0 0, 50% 0, 50% 100%, 0% 100%) }
.slider { position: absolute }
```

### [Comic Book - Polygon Grid - CSS Only](https://codepen.io/32teeth/pen/OJZvojY)

made with: clip-path

```css
main { box-shadow: 0 0 1rem rgba(0, 0, 0, 0.25); position: relative }
main:before { position: absolute; top: 0 }
section { filter: contrast(500%) }
section:first-child figure:nth-child(1) { clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%); background-position: 25px -40px }
section:first-child figure:nth-child(2) { clip-path: polygon(0 5%, 100% 0%, 100% 100%, 0 100%); margin-top: -0.5rem; background-position: 25px -155px; position: relative }
section:first-child figure:nth-child(2):after { position: absolute; bottom: 0; background-position: 55px 5px, 55px 0px }
section:first-child figure:nth-child(3) { clip-path: polygon(0 5%, 100% 0%, 100% 100%, 0 75%); margin-top: -1.3rem; background-position: -250px -40px }
section:first-child figure:nth-child(4) { background-position: -90px 20px }
section:first-child figure:nth-child(4):after { position: absolute; top: 0; background-position: 5px 0px, 5px 0px }
section:first-child figure:nth-child(5) { clip-path: polygon(0% 0%, 100% 36%, 100% 100%, 0 100%); margin-top: -4rem; background-position: -250px -240px }
section:first-child figure:nth-child(5):after { position: absolute; top: 0; bottom: 0; background-position: 5px 10px, 5px 60px }
figure { position: relative; box-shadow: inset 2px 2px 100px rgba(0, 0, 0, 0.25) }
```

### [Burger toggle and clipPath menu](https://codepen.io/blex/pen/NWMXaxX)

held: fixed button.menu-toggle, fixed div.menu | made with: position: fixed · transition · :hover · :focus-visible · clip-path

```css
.menu { position: fixed; inset: 0; clip-path: circle(0% at calc(95% - 1.5rem) calc(5% + 1.5rem)); transition: clip-path 0.6s cubic-bezier(0.39, 0.58, 0.57, 1) }
.menu a { transform: translateY(100%) rotate(5deg); transition: transform 0.3s ease-in }
.menu-active { clip-path: circle(145% at calc(95% - 1.5rem) calc(5% + 1.5rem)) }
.menu-active a { transition: transform 0.6s cubic-bezier(0.43, 0.08, 0.31, 0.95); transform: translateY(0) }
.menu-toggle { position: fixed; top: 5%; transition: border-color 0.3s ease }
.menu-toggle span { transition: transform 0.3s ease-in-out, opacity 0.2s ease }
.menu-toggle-active span:nth-child(1) { transform: translateY(0.5rem) translateY(2px) rotate(135deg) }
.menu-toggle-active span:nth-child(2) { opacity: 0; transform: scale(0.5) }
.menu-toggle-active span:nth-child(3) { transform: translateY(-0.5rem) translateY(-2px) rotate(-135deg) }
```

### [Image Slicing And Sliding](https://codepen.io/moohka/pen/NWMwarz)

on scroll: img.: transform ×5 | on hover of img.: img.: transform ×5 | made with: @keyframes · clip-path

```css
.img-container { position: relative }
.img-container img { position: absolute }
.img-container img:nth-child(1) { transform: translate(0%); clip-path: polygon(0 0%, 100% 0%, 100% 20%, 0 20%); animation: side-to-side-1 2s 1s ease-in-out infinite alternate }
0% { transform: translate(0) }
20% { transform: translate(0) }
80% { transform: translate(-100%) }
100% { transform: translate(-100%) }
.img-container img:nth-child(2) { transform: translate(0%); clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%); animation: side-to-side-2 2s 1.1s ease-in-out infinite alternate }
0% { transform: translate(0) }
20% { transform: translate(0) }
80% { transform: translate(-100%) }
100% { transform: translate(-100%) }
```

### [Inverted clip-path | See through filter](https://codepen.io/Boguz/pen/NWMaQzX)

held: fixed div.scrim, fixed div.scrim__cursor | made with: position: fixed · clip-path · backdrop-filter · custom properties driven by JS · pointer / mouse tracking

```css
.scrim { position: fixed; top: 0; bottom: 0 }
.scrim__cursor { position: fixed; top: calc(-100% + var(--cursor-y)); clip-path: polygon( 0% 0%, 0% 100%, var(--boxBottom) 100%, var(--boxBottom) var(--boxRight), var(--boxTop) var(--boxRight), var(--boxTop) var(--boxLeft), var(--boxBott }
.scrim[scrim-type="saturation"] .scrim__cursor { backdrop-filter: grayscale(1) }
.scrim[scrim-type="blur"] .scrim__cursor { backdrop-filter: blur(20px) }
.scrim[scrim-type="brightness"] .scrim__cursor { backdrop-filter: brightness(20%) }
.scrim[scrim-type="all"] .scrim__cursor { backdrop-filter:grayscale(1) blur(20px) brightness(20%) }
```

```js
addEventListener('mousemove', (event) => {
style.setProperty("--cursor-x", `${event.pageX}px`)
style.setProperty("--cursor-y", `${event.pageY}px`)
```

### [Animated Info Card | CSS clip-path](https://codepen.io/cgrkzlkn/pen/GRdvzvX)

made with: transition · :hover · clip-path

```css
.info-card { box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; clip-path: circle(10% at 90% 20%); transition: all 0.3s ease-in-out; position: relative }
.info-card:hover { clip-path: circle(75%) }
.info-card:hover .info-icon { opacity: 0 }
.info-card h1 { padding-bottom: 1.5rem }
.info-icon { position: absolute; top: 10%; transition: opacity 0.3s }
```

### [Arrow flip using clip-path](https://codepen.io/thebabydino/pen/MWGobXp)

made with: transition · clip-path · custom properties driven by JS

```css
.arrow { transform: scalex(var(--f)); clip-path: polygon(calc(var(--i)*8%/var(--f)) 0, calc(100% - var(--j)*8%/var(--f)) 0, calc(100% - var(--i)*8%/var(--f)) 50%, calc(100% - var(--j)*8%/var(--f)) 100%, calc(var(--i)*8%/var(--f)) }
```

### [Sliced Text Effect](https://codepen.io/TajShireen/pen/ExLWgGb)

made with: clip-path

```css
.wrapper { text-transform: uppercase }
.top { clip-path: polygon(0% 0%, 100% 0%, 100% 48%, 0% 58%) }
.bottom { clip-path: polygon(0% 60%, 100% 50%, 100% 100%, 0% 100%); transform: translateX(-0.02em) }
```

### [Creative Section Breaks Using CSS Clip-Path](https://codepen.io/ZoranJambor/pen/vYjKoOw)

made with: clip-path

```css
.header { position: relative; -webkit-clip-path: ellipse(60% 84.78% at 50% 0%); clip-path: ellipse(60% 84.78% at 50% 0%) }
.footer { position: relative; -webkit-clip-path: url(#clip); clip-path: url(#clip) }
.svg { position: absolute }
.wrapper { position: relative }
.hero { -webkit-clip-path: polygon(1% 5.84%, 40.38% 3.2%, 74.38% 21.62%, 94.63% 7.68%, 98.88% 230px, 40.38% 84.18%, 11.26% 95.44%); clip-path: polygon(1% 5.84%, 40.38% 3.2%, 74.38% 21.62%, 94.63% 7.68%, 98.88% 230px, 40.38% 84.1 }
.hero__image { position: relative }
.hero__image img { position: absolute; top: 0 }
.hero__title { margin-top: 0 }
.hero__content { position: relative }
```

### [Image swipe reveal with scrollTrigger](https://codepen.io/jamiem89/pen/YzLqGLG)

on scroll: div.image-reveal__img: clip-path+top | on hover of img.: div.image-reveal__img: clip-path | made with: clip-path · GSAP

```css
.bookend h1 { text-transform: uppercase }
.image-reveal { position: relative }
.image-reveal__img { position: relative; padding-top: 30% }
.image-reveal__img:first-of-type { -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%); clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%) }
.image-reveal__img:last-of-type { position: absolute }
.image-reveal__img img { position: absolute; top: 0 }
.image-reveal__marker { position: absolute; top: 0; bottom: 0; transform: translateX(-50%); opacity: 0 }
```

```js
gsap.timeline({scrollTrigger: {trigger: '.image-reveal', scrub: 1, pin: 'body', pinSpacer: false, start: 'center center', bottom: 'bot
```

### [Clip Path quarter circle grid gallery](https://codepen.io/BlogFire/pen/eYrJaLd)

made with: clip-path

```css
.quarter-circle-tl { clip-path: circle(100% at 100% 100%) }
.quarter-circle-tr { clip-path: circle(100% at 0% 100%) }
.quarter-circle-bl { clip-path: circle(100% at 100% 0%) }
.quarter-circle-br { clip-path: circle(100% at 0% 0%) }
```

### [ClipPath reveal gallery GSAP](https://codepen.io/BlogFire/pen/JjvGqoR)

on scroll: div.shape-outer: clip-path ×3, div.shape-inner: clip-path ×3 | made with: clip-path · GSAP

```css
.circle1 { clip-path: circle(50% at 50% 50%) }
```

```js
gsap.from(".circle1", {
```

### [text box clip path](https://codepen.io/namansingh98/pen/BaxoMKM)

made with: transition · :hover · clip-path

```css
.container { position:absolute }
.inner { clip-path:circle(15% at 100% 0%); transition:clip-path .5s ease-in-out , 1s ease }
.inner:hover { clip-path:circle(70%) }
```

### [#87 CSS CHallenge / Ruby](https://codepen.io/AlperZM/pen/oNdNLro)

made with: @keyframes · clip-path

```css
.frame { position: absolute; top: 50%; margin-top: -200px; box-shadow: 4px 8px 16px 0 rgba(0, 0, 0, 0.1) }
.diamond { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.d1 { position: absolute; -webkit-clip-path: polygon(50% 100%, 25% 35%, 75% 35%); clip-path: polygon(50% 100%, 25% 35%, 75% 35%) }
.d2 { position: absolute; -webkit-clip-path: polygon(50% 100%, 0 37%, 25% 35%); clip-path: polygon(50% 100%, 0 37%, 25% 35%) }
.d3 { -webkit-clip-path: polygon(50% 100%, 100% 37%, 72% 35%); clip-path: polygon(50% 100%, 100% 37%, 72% 35%); position: absolute }
.d4 { -webkit-clip-path: polygon(50% 0%, 0% 100%, 100% 91%); clip-path: polygon(50% 0%, 0% 100%, 100% 91%); position: absolute; top: 25px }
.d5 { position: absolute; -webkit-clip-path: polygon(38% 100%, 0 0, 100% 0); clip-path: polygon(38% 100%, 0 0, 100% 0); top: 25px }
.d6 { position: absolute; -webkit-clip-path: polygon(50% 0%, 0% 100%, 100% 100%); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); top: 25px }
.d7 { position: absolute; -webkit-clip-path: polygon(58% 100%, 0 0, 100% 0); clip-path: polygon(58% 100%, 0 0, 100% 0); top: 25px }
.d8 { position: absolute; -webkit-clip-path: polygon(46% 0%, 10% 91%, 93% 100%); clip-path: polygon(46% 0%, 10% 91%, 93% 100%); top: 25px }
.shine { position: absolute; top: 0; box-shadow: 0px 0px 16px 5px #fff; transform: rotate(-44deg) translateX(-30px); -webkit-animation: shining 3s linear infinite both; animation: shining 3s linear infinite both }
0% { transform: rotate(-44deg) translateX(-30px) }
```

### [Cyber buttons](https://codepen.io/vyacheslav321/pen/poLXLej)

on hover of button.cybr-btn: span.cybr-btn__glitch: transform+clip-path+top | made with: @keyframes · transition · :hover · clip-path

```css
body .cybr-btn + .cybr-btn { margin-top: 2rem }
.cybr-btn { text-transform: uppercase; position: relative; transition: background 0.2s }
.cybr-btn:after, .cybr-btn:before { position: absolute; top: 0; bottom: 0; -webkit-clip-path: var(--clip); clip-path: var(--clip) }
.cybr-btn:before { transform: translate(var(--border), 0) }
.cybr-btn__tag { position: absolute; bottom: -5% }
.cybr-btn__glitch { position: absolute; top: calc(var(--border) * -1); bottom: calc(var(--border) * -1); -webkit-clip-path: var(--clip); clip-path: var(--clip); -webkit-animation: glitch 2s infinite; animation: glitch 2s infinite }
.cybr-btn__glitch:before { position: absolute; top: calc(var(--border) * 1); bottom: calc(var(--border) * 1); -webkit-clip-path: var(--clip); clip-path: var(--clip) }
0% { -webkit-clip-path: var(--clip-one); clip-path: var(--clip-one) }
2%, 8% { -webkit-clip-path: var(--clip-two); clip-path: var(--clip-two); transform: translate(calc(var(--shimmy-distance) * -1%), 0) }
6% { -webkit-clip-path: var(--clip-two); clip-path: var(--clip-two); transform: translate(calc(var(--shimmy-distance) * 1%), 0) }
9% { -webkit-clip-path: var(--clip-two); clip-path: var(--clip-two); transform: translate(0, 0) }
10% { -webkit-clip-path: var(--clip-three); clip-path: var(--clip-three); transform: translate(calc(var(--shimmy-distance) * 1%), 0) }
```

### [Transparent border using mask-image](https://codepen.io/everdimension/pen/MWVdOge)

made with: mask

```css
.img { -webkit-mask-image: radial-gradient(circle var(--rad) at var(--dist) var(--dist), transparent var(--rad), purple 0) }
.indicator { position: absolute; top: calc(var(--dist) - var(--size) / 2) }
```

### [Rounded-trapezoid label](https://codepen.io/terriblecoding/pen/VwXgbGN)

made with: clip-path

```css
#wrapper { margin-bottom: -0.5em }
.label { padding-bottom: 1em; position: relative; filter: drop-shadow(0 -3px 0 white) }
.label::before, .label::after { position: absolute; top: 0; clip-path: polygon( 0 100%, 0 0, 5% 0, 13% 2%, 18% 4%, 23% 7%, 29% 12%, 100% 100% ) }
.label::before { transform: rotateY(180deg) }
```

### [Pure CSS prisms with rounded corners](https://codepen.io/thebabydino/pen/wvmRXeM)

on scroll: div.s3d: transform+top ×20 | made with: @keyframes · clip-path · 3D (perspective / preserve-3d)

```css
body { perspective: 35em }
.a3d::before { transform: translatey(calc(50% + 2*4em)) }
.s3d { transform: var(--pos); animation: r 8s linear infinite }
0% { transform: var(--pos) rotate(1turn) }
.s5gon { transform: translatez(0.375em); filter: drop-shadow(0 0 1px currentcolor) drop-shadow(0 0 1px currentcolor) }
.s5gon::before { clip-path: polygon(45.2447174185% 3.4549150281%, 48.317959088% 2.08661968%, 51.682040912% 2.08661968%, 54.7552825815% 3.4549150281%, 92.7975432333% 31.0942352531%, 95.048553344% 33.5942352531%, 96.0881117981% 36.79366719 }
.shade { transform: translatez(-0.375em) scale(1.1); filter: blur(5px) }
.latf { box-shadow: 1px 0 1px currentcolor, -1px 0 1px currentcolor }
.main { transform: rotate(calc(var(--j)*72deg)) translatey(3.2360679775em) rotatex(-90deg) }
.crnr { transform: rotate(calc((var(--j) + -.5)*72deg)) translatey(3.2em) rotate(calc((var(--k) + .5)*24deg + -.5*72deg)) translatey(0.6472135955em) rotatex(-90deg) }
@keyframes r animates transform
```

### [Full width background inside a container with CSS](https://codepen.io/santoshsinghchauhan/pen/zYWjVzR)

made with: clip-path

```css
body { background-position: center center }
.fluid { -webkit-box-shadow: 0 0 0 100vmax #3f0134; box-shadow: 0 0 0 100vmax #3f0134; -webkit-clip-path: inset(0 -100vmax); clip-path: inset(0 -100vmax) }
header.fluid { -webkit-box-shadow: 0 0 0 100vmax #4f0147; box-shadow: 0 0 0 100vmax #4f0147 }
```

### [CSS clip-path letters morphing animation](https://codepen.io/magiai/pen/YzaeQQy)

on scroll: div.: transform+clip-path+top ×5 | made with: @keyframes · :hover · prefers-reduced-motion · clip-path · mix-blend-mode

```css
*, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important }
.svg__background { position: absolute; top: 0 }
.letters { filter: drop-shadow( -0.5rem -0.5rem 2rem #765f7f) }
.letters div { background-position: left center; mix-blend-mode: difference; transform: scale(1.1); animation-duration: 4000ms; animation-timing-function: cubic-bezier(0.5, 0.5, 0.5, 1); animation-iteration-count: infinite; animation-f }
.letters:hover div { animation-play-state: paused }
.letters div:first-of-type { animation-name: animateFirstLetter; clip-path: var(--clip-path--i) }
.letters div:nth-of-type(2) { animation-name: animateSecondLetter; clip-path: var(--clip-path--m) }
.letters div:nth-of-type(3) { animation-name: animateThirdLetter; clip-path: var(--clip-path--a) }
.letters div:nth-of-type(4) { animation-name: animateForthLetter; clip-path: var(--clip-path--g) }
.letters div:last-of-type { animation-name: animateFifthLetter; clip-path: var(--clip-path--e) }
from, 50% { clip-path: var(--clip-path--i) }
55%, to { clip-path: var(--clip-path--m) }
```

### [Inverse circle clip mask (keyframes failure)](https://codepen.io/nli/pen/RwMjgYx)

made with: clip-path

```css
img { clip-path: path( "M0 0 h250 v50 a200 200 0 1 0 0 400 a200 200 0 1 0 0 -400 v-50 h250 v500 h-500 Z" ); animation: pulse 2s infinite alternate }
from { clip-path: path("M0 0 H200 V200 H0 Z") }
to { clip-path: path("M0 0 H400 V400 H0 Z") }
```

### [CSS only radar](https://codepen.io/bajzarpa/pen/GRxMgWb)

on scroll: div.dot: background+top ×3, div.radar: transform+top | made with: @keyframes · transition · clip-path

```css
.radar-wrap { position: relative }
.radar-wrap .dot { position: absolute }
.radar-wrap .dot.d-1 { top: 20% }
.radar-wrap .dot.d-2 { top: 25% }
.radar-wrap .dot.d-3 { top: 45% }
.radar-wrap .dot.d-4 { top: 49% }
.radar-wrap .dot.d-5 { top: 69% }
.radar-wrap .dot.d-6 { top: 59% }
.radar-wrap .dot.d-7 { top: 39% }
.radar-wrap .dot.d-8 { top: 28% }
.radar-wrap .dot.d-9 { top: 28% }
.radar-wrap .dot.d-0 { top: 48% }
```

### [Pure CSS cube → chamfered cube → rhombic dodecahedron](https://codepen.io/thebabydino/pen/rNdjLdq)

held: fixed p.box, fixed p.box | on scroll: div.s2d: clip-path+filter+top ×11, div.s2d: transform+filter+top ×6, div.a3d: transform+top, div.s2d: clip-path+filter | on hover of a.: div.s2d: clip-path+filter+top ×10, div.s2d: transform+filter+top ×6, div.s2d: clip-path+filter ×2, div.a3d: transform+top | made with: position: fixed · @keyframes · clip-path · 3D (perspective / preserve-3d)

```css
body { perspective: 25em }
.a3d { animation: p 8s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate, r 16s linear infinite }
to { transform: rotatey(1turn) }
.s4gon { opacity: 0.875; animation: s 8s linear calc(var(--j)/4*-16s) infinite alternate }
.s4gon--sq { transform: rotate3d(var(--end), var(--mid), 0, var(--ang)) translatez(calc(12.5vmin*(1 + var(--p)))) scale(calc(0.975*var(--q))) }
.s4gon--rh { transform: rotatey(calc(var(--j)*90deg)) rotatex(calc(var(--end)*var(--sgn, 1)*45deg)) rotate(calc(var(--end)*90deg)) translatez(17.6776695297vmin) scale(0.975); clip-path: polygon(50% 0, calc(50%*(1 + var(--p))) calc(50 }
to { filter: brightness(0.2) }
.box { position: fixed; inset: auto 1vw 1vh; box-shadow: 2px 2px 5px gray }
.box--info { inset: 1vh 1vw auto }
@keyframes p animates --p
@keyframes r animates transform
@keyframes s animates filter
```

### [Clip-Path Button](https://codepen.io/mntcrl/pen/eYMZyLe)

on hover of a.: span.: clip-path | made with: transition · :hover · clip-path

```css
a { position: relative; margin-bottom: 20px; box-shadow: 0 5px 25px rgba(0, 0, 0, 0.25) }
a span { position: absolute; top: 0; text-transform: uppercase }
a span:nth-child(2) { transition: all 0.5s }
a span:nth-child(2) { clip-path: polygon(60% 0%, 100% 0, 100% 100%, 60% 100%, 40% 50%) }
a span:nth-child(2):hover { clip-path: polygon(0% 0%, 100% 0, 100% 100%, 0% 100%, 0% 50%) }
a span:nth-child(1):hover ~ span:nth-child(2) { clip-path: polygon(100% 0%, 100% 0, 100% 100%, 100% 100%, 100% 50%) }
```

### [Clip-Path Header](https://codepen.io/mntcrl/pen/VwXajdy)

made with: clip-path

```css
section { position: relative; background-position: center; clip-path: circle(150vh at 50% -50vh) }
h1 { position: absolute; top:50%; transform: translate(-50%, -50%); text-transform: uppercase }
```

### [Работа с clip-path css and svg (4 Варианта)](https://codepen.io/andrey_lark/pen/OJvMOdY)

made with: clip-path

```css
.svg { position: absolute }
.user__avatarPremium2S, .user__avatarPremiumRS, .user__avatarPremiumS, .user__av { position: relative; background-position: center }
.user__avatarPremium2S, .user__avatarPremium__border2S { -webkit-clip-path: var(--square-six); clip-path: var(--square-six) }
.user__avatarPremiumRS, .user__avatarPremium__borderRS { -webkit-clip-path: var(--square-round); clip-path: var(--square-round) }
.user__avatarPremiumS, .user__avatarPremium__borderS { -webkit-clip-path: var(--square); clip-path: var(--square) }
.user__avatarPremiumSE, .user__avatarPremium__borderSE { -webkit-clip-path: var(--super-ellipse); clip-path: var(--super-ellipse) }
```

### [Div Divider](https://codepen.io/moohka/pen/YzayewG)

made with: clip-path

```css
.main { position:relative }
.pointer { position: absolute }
#border { bottom: -20px; transform:translate(-50%); border-top: 20px solid purple }
label[for="border"] { position: absolute; bottom:20px; transform:translate(-50%) }
#clip-path { bottom: -20px; transform:translate(-50%); clip-path: polygon(50% 100%, 0 0, 100% 0) }
label[for="clip-path"] { position: absolute; bottom:20px; transform:translate(-50%) }
```

### [Getting skewy with it - split string into spans to mistreat them ;)](https://codepen.io/tomhermans/pen/XWEbbeX)

made with: clip-path

```css
h1 { filter: url(#squiggly-4); clip-path: polygon(0% 0, 100% 20%, 90% 80%, 12% 100%); transform: rotate(-2deg) skew(-5deg) }
h1 span:nth-child(1) { transform: skew(20deg) rotate(0) }
h1 span:nth-child(2) { transform: skew(10deg) rotate(0) }
h1 span:nth-child(3) { transform: skew(0deg) rotate(0) }
h1 span:nth-child(4) { transform: skew(-10deg) rotate(0) }
h1 span:nth-child(5) { transform: skew(-20deg) rotate(0) }
```

### [Animated Triangles with HTML, CSS, SVG PATHS](https://codepen.io/Saurabhv749/pen/poaMEXb)

on scroll: div.t-1: clip-path, div.t-2: opacity+clip-path, div.t-3: opacity+clip-path, div.t-4: clip-path, div.t-5: clip-path, div.t-6: opacity+clip-path | made with: transition · clip-path

```css
#t-container { position: relative }
#t-container > * { position: absolute; top: 0 }
#t-container .t-1 { clip-path: polygon(30.16% 24.22%, 30.16% 34.38%, 35.94% 24.22%); transition: clip-path 600ms cubic-bezier(0.34, 1.56, 0.64, 1); opacity: 2.25 }
#t-container .t-2 { clip-path: polygon(30.6% 34.38%, 35.65% 34.38%, 36.16% 24.22%); transition: clip-path 600ms cubic-bezier(0.34, 1.56, 0.64, 1); opacity: 2.25 }
#t-container .t-3 { clip-path: polygon(36.38% 24.22%, 43.34% 24.22%, 43.34% 34.64%); transition: clip-path 600ms cubic-bezier(0.34, 1.56, 0.64, 1); opacity: 1.75 }
#t-container .t-4 { clip-path: polygon(35.87% 34.38%, 36.31% 24.35%, 43.34% 35.16%); transition: clip-path 600ms cubic-bezier(0.34, 1.56, 0.64, 1); opacity: 1.25 }
#t-container .t-5 { clip-path: polygon(35.72% 34.64%, 35.72% 45.96%, 43.34% 35.68%); transition: clip-path 600ms cubic-bezier(0.34, 1.56, 0.64, 1); opacity: 0.25 }
#t-container .t-6 { clip-path: polygon(35.72% 46.88%, 43.34% 36.33%, 43.34% 48.7%); transition: clip-path 600ms cubic-bezier(0.34, 1.56, 0.64, 1); opacity: 1.5 }
#t-container .t-7 { clip-path: polygon(35.72% 47.66%, 43.34% 49.48%, 43.34% 57.29%); transition: clip-path 600ms cubic-bezier(0.34, 1.56, 0.64, 1); opacity: 1.25 }
#t-container .t-8 { clip-path: polygon(35.72% 48.7%, 43.34% 59.51%, 35.72% 53.91%); transition: clip-path 600ms cubic-bezier(0.34, 1.56, 0.64, 1); opacity: 2.5 }
#t-container .t-9 { clip-path: polygon(35.65% 61.85%, 43.34% 60.16%, 35.65% 54.3%); transition: clip-path 600ms cubic-bezier(0.34, 1.56, 0.64, 1); opacity: 1.25 }
#t-container .t-10 { clip-path: polygon(35.72% 62.24%, 43.34% 60.94%, 43.19% 65.89%); transition: clip-path 600ms cubic-bezier(0.34, 1.56, 0.64, 1); opacity: 2.5 }
```

### [Inner box has bigger rounded corners than outer (1 div, pure CSS, no pseudos)](https://codepen.io/thebabydino/pen/rNJbEqM)

held: fixed a | on hover of a.: a.: filter | made with: clip-path

```css
body { filter: drop-shadow(5px 5px 13px) }
div { clip-path: inset(2em round 1em) }
```

### [Responsive text with background-clip](https://codepen.io/BlogFire/pen/zYReGaK)

made with: transition

```css
.letter { background-position: top center; filter: drop-shadow(10px 10px 10px rgba(80 7 22 / .6)); transition: all .4s ease-in-out }
```

### [Responsive clip-path shapes](https://codepen.io/BlogFire/pen/NWyoWMr)

made with: clip-path

```css
#circle { background-position: center center; clip-path: circle(50% at 50% 50%) }
#polygon { background-position: center center; clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%) }
#trapezoid { background-position: center center; clip-path: polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%) }
#star { background-position: center center; clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%) }
#frame { background-position: center center; clip-path: polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%) }
#speech { background-position: center center; clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%) }
```

### [Button with Trailing Border Remnant on Hover](https://codepen.io/AllThingsSmitty/pen/xxYmmab)

made with: transition · :hover · clip-path

```css
.hover-me { position: relative; top: 0; transition: var(--time-duration) ease-in }
.hover-me__text { text-transform: uppercase }
.hover-me::after { bottom: calc((var(--shade) * -1) + 1rem); clip-path: polygon(0 0, 100% 0, 85% 50%, 15% 50%); transition: var(--time-duration) ease-in; position: absolute }
.hover-me:hover { top: -1rem }
.hover-me:hover::after { bottom: -1.625rem }
```

### [Iris shot - CSS recreation](https://codepen.io/danne32/pen/ExQGGbB)

made with: @keyframes · :hover · clip-path · custom properties driven by JS

```css
.iris-out { animation: 2000ms ease forwards iris-out }
.iris-in { animation: 1667ms ease forwards iris-in }
0% { clip-path: circle(130% at calc(var(--xPos) * 1vw) calc(var(--yPos) * 1vh)) }
66%, 100% { clip-path: circle(0% at calc(var(--xPos) * 1vw) calc(var(--yPos) * 1vh)) }
0% { clip-path: circle(0% at 50vw 50vh) }
100% { clip-path: circle(130% at 50vw 50vh) }
@keyframes iris-out animates clip-path
@keyframes iris-in animates clip-path
```

```js
style.setProperty("--xPos", mousePos[0])
style.setProperty("--yPos", mousePos[1])
```

### [Fixed image ScrollTrigger transitions](https://codepen.io/PointC/pen/zYRyveM)

held: fixed div.smiley-wrapper, fixed div | on scroll: div.smiley: clip-path ×2, div.: transform+top | on hover of img.: div.smiley: clip-path ×2, div.: transform+top | made with: position: fixed · clip-path · GSAP · ScrollTrigger

```css
#smooth-content { will-change: transform }
.smiley-wrapper { position: fixed; transform: translate(-100%, -50%); top: 50% }
.smiley { position: absolute; top: 0; clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%) }
.smiley:first-of-type { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%) }
```

```js
gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
gsap.timeline({
```

### [simple slider animation](https://codepen.io/tomzidani/pen/BaYxVLR)

on hover of img.slider__image: img.slider__image: clip-path ×2 | made with: transition · :hover · clip-path

```css
.slider .slider__title { text-transform: uppercase; transform: rotate(180deg) }
.slider .slider__items { position: relative }
.slider .slider__previous, .slider .slider__next { position: absolute; top: 50%; transform: translateY(-50%); transition: ease-in-out 0.3s }
.slider .slider__previous { transform: translate(-50%, -50%) }
.slider .slider__previous:hover { transform: translate(-50%, -50%) scale(1.1) }
.slider .slider__next { transform: translate(50%, -50%) }
.slider .slider__next:hover { transform: translate(50%, -50%) scale(1.1) }
.slider .slider__image { position: absolute; -webkit-clip-path: circle(0%); clip-path: circle(0%); transition: visibility 0s 1s, -webkit-clip-path 1s; transition: clip-path 1s, visibility 0s 1s; transition: clip-path 1s, visibility 0s 1s, -webki }
.slider .slider__image.current { -webkit-clip-path: circle(100%); clip-path: circle(100%); transition: visibility 0s 0s, -webkit-clip-path 1s 1s; transition: clip-path 1s 1s, visibility 0s 0s; transition: clip-path 1s 1s, visibility 0s 0s, -webkit-clip- }
```

### [CSS Art – Advanced Shapes with clip-path](https://codepen.io/pyxofy/pen/PoQbKMJ)

made with: clip-path

```css
.clip-path-inset-square { clip-path: inset(0% 0% 0% 0% round 10%) }
.clip-path-inset-rectangle { clip-path: inset(0% 0% 0% 0% round 5%) }
.clip-path-circle { clip-path: circle(50%) }
.clip-path-ellipse { clip-path: ellipse(50% 30% at center) }
.clip-path-polygon-triangle { clip-path: polygon(50% 0%, 0% 100%, 100% 100%) }
.clip-path-polygon-x { clip-path: polygon( 20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30% ) }
.clip-path-polygon-star { clip-path: polygon( 50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35% ) }
.container { position: relative }
```

### [hover button with clip path property](https://codepen.io/ahbaghery/pen/KKQNNyL)

on scroll: a.link: color+top | made with: transition · :hover · clip-path

```css
.container { position: relative }
.link:hover { transition: color 0.8s ease-in }
.link:after { position: absolute; top: 0; clip-path: polygon(65% 0, 34% 0, 35% 0%, 65% 0%, 65% 15%, 65% 58%, 65% 37%, 65% 74%, 65% 100%, 35% 100%, 34% 100%, 65% 100%); transition: clip-path 0.8s ease-in }
.link:hover:after { clip-path: polygon(65% 0, 34% 0, 34% 23%, 65% 23%, 65% 15%, 65% 58%, 65% 37%, 65% 74%, 65% 100%, 35% 100%, 35% 78%, 65% 77%) }
.link:before { position: absolute; top: 0; clip-path: circle(0% at 50% 50%); transition: all 0.8s }
.link:hover:before { clip-path: circle(100% at 50% 50%) }
```

### [animation card with clip-path](https://codepen.io/millisabel/pen/XWZjZGM)

made with: transition · :hover · clip-path

```css
.box { position: relative; box-shadow: 0 0 0 2px #fb3ebc; transition: box-shadow 0.6s }
.box:hover, .box:focus-within { box-shadow: 0 0 40px 1px #fb3ebc }
.box__title { position: absolute; top: 0 }
.box--1 .box__content { transition: clip-path 0.6s ease; clip-path: polygon(0 0, 0 0, 0 100%, 0% 100%) }
.box--1:hover .box__content { clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%) }
.box--2 .box__content { transform: translateX(-100%); transition: transform 0.6s ease }
.box--2:hover .box__content { transform: translateX(0) }
.box--3 .box__content { clip-path: circle(0% at 50% 50%); transition: clip-path 0.6s ease }
.box--3:hover .box__content { clip-path: circle(70% at 50% 50%) }
.box--4 .box__content { clip-path: circle(0% at 0 0); transition: clip-path 0.6s ease }
.box--4:hover .box__content { clip-path: circle(30% at 0 0) }
```

### [Notched Border + Emboss](https://codepen.io/bluesatin/pen/yLvaaZw)

made with: clip-path

```css
.emboss { filter: drop-shadow(0px calc(var(--embossSize) * -1) 0px hsla(0,0%,100%,0.75)) drop-shadow(calc(var(--embossSize) * -1) 0px 0px hsla(0,0%,100%,0.75)) drop-shadow(var(--embossSize) 0px 0px hsla(0,0%,25%,0.125)) drop-shado }
.notched--container { margin-bottom: 5% }
.notched--outer { clip-path: polygon( 0% var(--notchSize), var(--notchSize) var(--notchSize), var(--notchSize) 0%, calc(100% - var(--notchSize)) 0%, calc(100% - var(--notchSize)) var(--notchSize), 100% var(--notchSize), 100% calc(100% - v }
.notched--inner { position: absolute; top: var(--borderSize); bottom: var(--borderSize); clip-path: inherit }
```

### [Arrow inside a div](https://codepen.io/ibtissam-dm/pen/gOvPBpy)

made with: nothing recognised — read the code

```css
.container { position: relative }
.container:before, .container:after { position: absolute }
.container:before { top: 0; bottom: calc(50% + 27px) }
.container:after { bottom: 0; top: calc(50% + 27px) }
.container .arrow { position: relative }
.container .arrow:before { position: absolute; top: calc(50% - 27px) }
.container .arrow:after { position: absolute; top: calc(50% - 20px); transform: rotate(-45deg) }
```

### [clip-path pseudo-element](https://codepen.io/Synphod/pen/GRybEXZ)

made with: clip-path

```css
.wrapper { padding-bottom: 13vw }
#b4 { position: relative }
#b4::after { position: absolute; bottom: calc(0vw - var(--height)); clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 96% 14%, 90% 100%, 88% 43%, 83% 100%, 79% 35%, 78% 100%, 75% 47%, 68% 100%, 67% 32%, 61% 100%, 55% 35%, 48% 100%, 40% 3 }
```

### [CSS Image filtering + clip-paths](https://codepen.io/shellbryson/pen/dyJapPm)

on scroll: div.image_layer: clip-path+filter ×2, div.image_layer: clip-path | made with: transition · :hover · clip-path

```css
.wrap { position: relative }
.wrap:hover .image_layer:nth-child(1) { clip-path: polygon(0 0, 100% 0, 100% 38%, 0 38%) }
.wrap:hover .image_layer:nth-child(2) { filter: hue-rotate(100deg); clip-path: polygon(0 67%, 100% 67%, 100% 38%, 0 38%) }
.wrap:hover .image_layer:nth-child(3) { filter: hue-rotate(200deg); clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%) }
.image_layer { position: absolute; transition: 1s }
.image_layer:nth-child(1) { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%) }
.image_layer:nth-child(2) { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%) }
.image_layer:nth-child(3) { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%) }
```

### [CSS clip path bezier curve using SVG](https://codepen.io/saheeranas/pen/gOoZVYZ)

made with: clip-path · mix-blend-mode

```css
.banner { mix-blend-mode: normal }
.banner .content_wrapper h1 { margin-bottom: 16px }
.banner .content_wrapper .btn_cta { filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.25)) }
.banner .image_wrapper { -webkit-clip-path: url(#shape); clip-path: url(#shape); position: relative }
.banner .image_wrapper { margin-bottom: 16px; -webkit-clip-path: none; clip-path: none }
.banner .image_wrapper svg { position: absolute }
```

### [Hamburger icon in menu (use clip-path)](https://codepen.io/aya-suz/pen/YzYJWZJ)

on hover of button.nav__bar: nav.nav__menu: clip-path | made with: transition · :hover · clip-path

```css
.nav__menu { position: absolute; inset: 0; bottom: 35vh; transition: all 0.8s; clip-path: circle(30px at 45px 40px) }
.nav__menu:hover { clip-path: circle(3000px at 45px 40px) }
```

### [How to Create a Triangle Using CSS clip-path](https://codepen.io/sogyeokdong/pen/YzYOmbp)

made with: clip-path

```css
#triangle-up { clip-path: polygon(50% 0, 100% 100%, 0 100%) }
#triangle-right { clip-path: polygon(0 0, 100% 50%, 0 100%) }
#triangle-down { clip-path: polygon(0 0, 50% 100%, 100% 0) }
#triangle-left { clip-path: polygon(100% 0, 0 50%, 100% 100%) }
#triangle-left-bottom { clip-path: polygon(0 0, 100% 100%, 0 100%) }
#triangle-left-top { clip-path: polygon(0 0, 0% 100%, 100% 0) }
#triangle-right-top { clip-path: polygon(0 0, 100% 0, 100% 100%) }
#triangle-right-bottom { clip-path: polygon(100% 0, 100% 100%, 0 100%) }
#triangle-right-bottom { clip-path: polygon(100% 0, 100% 100%, 0 100%) }
```

### [SVG clip-path + shape-inside](https://codepen.io/martijndevalk/pen/BaJxLoP)

made with: clip-path

```css
.sticker { position: absolute }
.sticker-1 { top: 20px; -webkit-clip-path: path("M241.91 72.2c6.39 15.4-3.86 34-3.86 49.69 0 16.27 10.06 34.89 3.95 49.69s-26.38 20.89-37.86 32.42c-11.08 11.11-16.95 31.52-32.34 37.92s-34-3.86-49.69-3.86c-16.26 0-34.88 10.06-49.68 3. }
.sticker-2 { -webkit-clip-path: url(#svgPath2); clip-path: url(#svgPath2); top: 40px }
.sticker-3 { top: 40px; -webkit-clip-path: path("M241.91 72.2c6.39 15.4-3.86 34-3.86 49.69 0 16.27 10.06 34.89 3.95 49.69s-26.38 20.89-37.86 32.42c-11.08 11.11-16.95 31.52-32.34 37.92s-34-3.86-49.69-3.86c-16.26 0-34.88 10.06-49.68 3. }
.nr { margin-bottom: 10px }
```

### [slashed text hover animation](https://codepen.io/Sevillain/pen/popLzxL)

on scroll: div.text: transform+color+top | made with: transition · :hover · clip-path

```css
.container { position:relative }
.text { position:absolute; transition:transform 350ms ease, color 350ms ease }
.text:nth-of-type(1) { clip-path: polygon(0 0, 100% 0, 100% 52%, 0 52%) }
.text:nth-of-type(2) { clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%) }
.container:hover .text:nth-of-type(1) { transform:translateY(-5px) translateX(10px) rotate(2deg) }
```

### [Fullscreen clip-path navigation](https://codepen.io/Grezvany13/pen/QWapJwg)

made with: position: fixed · transition · :hover · clip-path

```css
html body.menu-open:before { position: fixed; top: 0 }
header .container #toggle:checked + .hamburger .top-bun { transform: rotate(-45deg); margin-top: 1.5rem }
header .container #toggle:checked + .hamburger .bottom-bun { opacity: 0; transform: rotate(45deg) }
header .container #toggle:checked + .hamburger .meat { transform: rotate(45deg); margin-top: -0.5rem }
header .container #toggle:checked + .hamburger + .nav { clip-path: circle(100%) }
header .container .hamburger { margin-top: -0.5rem }
header .container .hamburger div { position: relative; margin-top: 0.5rem; transition: all 0.3s ease-in-out }
header .container .nav { position: absolute; background-position: center; top: 0; clip-path: circle(0 at 100% 0%); transition: clip-path 0.5s ease-in-out }
header .container .nav nav > ul { padding-top: 2rem }
header .container .nav nav > ul > li > a:focus ~ ul { transition: max-height 0.8s ease-in-out }
header .container .nav nav > ul > li > a:focus > span:before { transform: rotate(90deg) }
header .container .nav nav > ul > li > a:focus > span:after { transform: rotate(180deg) }
```

### [CSS Outline Exploration](https://codepen.io/gabriellewee/pen/eYymPGR)

made with: transition · :hover · clip-path

```css
button, button span { transition: 0.1s ease-out }
button:active { transform: scale(0.95) }
.box-shadow, .radius { box-shadow: 0 0 0 3px rgba(186, 106, 255, 0.5) }
.clip-path { position: relative }
.clip-path:before { opacity: 1; position: absolute; top: -3px }
.clip-path:before { -webkit-clip-path: polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px); clip-path: polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc( }
.clip-path span { -webkit-clip-path: polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px); clip-path: polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc( }
```

### [CSS-only triangles](https://codepen.io/eduazy/pen/wvPxzQg)

made with: clip-path

```css
.triangle-borders { border-top: 100px solid transparent; border-bottom: 200px solid red }
.triangle-background-image { background-position: left, right }
.triangle-clip-path { clip-path: polygon(50% 0%, 0% 100%, 100% 100%) }
```

### [Polygon Animal Morph CSS Only](https://codepen.io/wyattnolen/pen/zYPWrdg)

on scroll: div.pl: clip-path+background ×17, div.pl: opacity+clip-path+background | made with: @keyframes · :hover · clip-path

```css
.wrapper { position: relative }
.pl { position: absolute }
.pl:hover { opacity: 0.5 }
.castShadow { filter: blur(10px); opacity: 0.45; animation: animateShadow 3s infinite alternate cubic-bezier(0.93, 0, 0.27, 1) }
.wrapper .pl:nth-child(1) { animation: transform1 3s infinite alternate cubic-bezier(0.93, 0, 0.27, 1) }
.wrapper .pl:nth-child(2) { animation: transform2 3s infinite alternate cubic-bezier(0.93, 0, 0.27, 1) }
.wrapper .pl:nth-child(3) { animation: transform3 3s infinite alternate cubic-bezier(0.93, 0, 0.27, 1) }
.wrapper .pl:nth-child(4) { animation: transform4 3s infinite alternate cubic-bezier(0.93, 0, 0.27, 1) }
.wrapper .pl:nth-child(5) { animation: transform5 3s infinite alternate cubic-bezier(0.93, 0, 0.27, 1) }
.wrapper .pl:nth-child(6) { animation: transform6 3s infinite alternate cubic-bezier(0.93, 0, 0.27, 1) }
.wrapper .pl:nth-child(7) { animation: transform7 3s infinite alternate cubic-bezier(0.93, 0, 0.27, 1) }
.wrapper .pl:nth-child(8) { animation: transform8 3s infinite alternate cubic-bezier(0.93, 0, 0.27, 1) }
```

### [Range Slider Progress in Chrome with pure CSS 🌟](https://codepen.io/ShadowShahriar/pen/zYPPYrQ)

made with: position: fixed · transition · :hover · clip-path

```css
html::before { position: fixed; top: 0 }
input[type="range"] { position: relative }
input[type="range"]:disabled { filter: grayscale(1); opacity: 0.3 }
input[type="range"], input[type="range"]::-webkit-slider-runnable-track, input[t { -webkit-transition: all ease 100ms; transition: all ease 100ms }
input[type="range"]::-webkit-slider-runnable-track, input[type="range"]::-webkit { position: relative }
input[type="range"]::-webkit-slider-thumb { --clip-top: calc((var(--thumb-height) - var(--track-height)) * 0.5 - 0.5px); --clip-bottom: calc(var(--thumb-height) - var(--clip-top)); box-shadow: var(--box-fill); filter: brightness(100%); -webkit-clip-path: polygon(  }
input[type="range"]:hover::-webkit-slider-thumb { filter: brightness(var(--brightness-hover)) }
input[type="range"]:active::-webkit-slider-thumb { filter: brightness(var(--brightness-down)) }
input[type="range"], input[type="range"]::-moz-range-track, input[type="range"]: { -moz-transition: all ease 100ms; transition: all ease 100ms }
input[type="range"]::-moz-range-thumb, input[type="range"]::-moz-range-progress { filter: brightness(100%) }
input[type="range"]:hover::-moz-range-thumb, input[type="range"]:hover::-moz-ran { filter: brightness(var(--brightness-hover)) }
input[type="range"]:active::-moz-range-thumb, input[type="range"]:active::-moz-r { filter: brightness(var(--brightness-down)) }
```

### [rubiks](https://codepen.io/danwilson/pen/qBVXYGL)

on scroll: div.display-case: transform+top | on hover of li.color-0: div.display-case: transform+top | made with: @keyframes · 3D (perspective / preserve-3d)

```css
.rube { transform: rotateX(var(--rotateX)) rotateY(var(--rotateY)) translateZ(var(--z1, 0)); will-change: transform; opacity: var(--opacity, 0) }
.rube ul { position: absolute; transform: rotateZ(var(--rotateZ, 0deg)) translate3d(var(--x, 0), var(--y, calc(var(--side) * -1)), var(--z,0)) rotateX(var(--fold, 0deg)) }
.display-case { transform: translateY(5vmin) rotateX(26deg) rotateY(0deg); animation: model-it 17900ms 0ms infinite linear; animation-play-state: var(--rotation-state, running) }
50% { transform: translateY(5vmin) rotateX(-26deg) rotateY(360deg) }
100% { transform: translateY(5vmin) rotateX(26deg) rotateY(720deg) }
.rube:nth-of-type(1) { --opacity: 1 }
body { perspective: 800px; position: relative }
@keyframes model-it animates transform
```

### [clip-path test](https://codepen.io/stefanobartoletti/pen/RwjKbbQ)

made with: clip-path

```css
.container { margin-bottom: 1rem }
.button { clip-path: url('#button') }
.card { clip-path: url('#card') }
.heart { clip-path: url('#heart') }
.image { clip-path: url('#image') }
```

### [Antique Image Effect](https://codepen.io/shane-clarke/pen/YzEqrNm)

made with: clip-path

```css
.shadow-wrap { position: absolute; top: 50%; transform: translate(-50%, -50%); filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.9)) }
.shadow-wrap { top: 55% }
.shadow-wrap { top: 55% }
.image-wrap { position: absolute; top: 50%; transform: translate(-50%, -50%); filter: grayscale(100%); box-shadow: 0 0 20px #000, 3px 2px 10px #333; clip-path: polygon( 3% 0, 7% 1%, 11% 0%, 16% 2%, 20% 0, 23% 2%, 28% 2%, 32% 1%, 35% 1 }
.overlay { position: absolute; top: 50%; transform: translate(-50%, -50%); box-shadow: inset 0 0 10px rgba(255, 127, 0, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.6), inset 0 0 30px rgba(255, 159, 0, 0.6), inset 0 0 40px rgba(255,  }
.overlay { top: 55% }
.overlay { top: 55% }
h3 { position: absolute; top: 68%; transform: translatex(-50%) }
h3 { top: 73% }
h3 { top: 73% }
.original-image { position: absolute; top: 75%; transform: translatex(-50%) }
.original-image { top: 81% }
```

### [Clip-path animation Pac-Man CSS - Day 21](https://codepen.io/deboracamargos/pen/KKywLKG)

on scroll: div.dot: background+shadow ×9, div.dot: opacity+background+shadow ×3, div.pacman: transform+clip-path+background+shadow+top | made with: @keyframes · clip-path

```css
.frame { position: absolute; top: 50%; margin-top: -200px; box-shadow: 4px 8px 16px 0 rgba(0, 0, 0, 0.1) }
.center { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.pacman { position: absolute; -webkit-clip-path: polygon(0% 0%, 0% 100%, 100% 100%, 100% 30%, 50% 50%, 70% 0%); clip-path: polygon(0% 0%, 0% 100%, 100% 100%, 100% 30%, 50% 50%, 70% 0%); transform: scale(1.2) rotate(45deg); -webkit }
.eye { position: absolute; top: 20px; box-shadow: inset 2px -5px 1px #fff; -webkit-animation: eye 0.5s linear infinite alternate; animation: eye 0.5s linear infinite alternate; -webkit-animation-delay: 2s; animation-delay: 2s }
.dots { position: absolute }
.dot { position: absolute; filter: blur(0.6px) }
.dot-1 { -webkit-animation: dots 12s infinite, color-dots 10s linear infinite 1s; animation: dots 12s infinite, color-dots 10s linear infinite 1s }
.dot-2 { -webkit-animation: dots 12s infinite 1s, color-dots 10s linear infinite 1s; animation: dots 12s infinite 1s, color-dots 10s linear infinite 1s }
.dot-3 { -webkit-animation: dots 12s infinite 2s, color-dots 10s linear infinite 1s; animation: dots 12s infinite 2s, color-dots 10s linear infinite 1s }
.dot-4 { -webkit-animation: dots 12s infinite 3s, color-dots 10s linear infinite 1s; animation: dots 12s infinite 3s, color-dots 10s linear infinite 1s }
.dot-5 { -webkit-animation: dots 12s infinite 4s, color-dots 10s linear infinite 1s; animation: dots 12s infinite 4s, color-dots 10s linear infinite 1s }
.dot-6 { -webkit-animation: dots 12s infinite 5s, color-dots 10s linear infinite 1s; animation: dots 12s infinite 5s, color-dots 10s linear infinite 1s }
```

### [Clip-path animation simple - Tree Day 94](https://codepen.io/deboracamargos/pen/oNGmMge)

made with: @keyframes · clip-path

```css
.frame { position: absolute; top: 50%; margin-top: -200px; box-shadow: 4px 8px 40px 0 black }
.center { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.container-tree { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.tree { position: relative; margin-top: 5em; -webkit-animation: top 0.3s linear forwards; animation: top 0.3s linear forwards }
.tree:before { position: absolute; margin-top: 202px; -webkit-animation: top 0.7s linear forwards; animation: top 0.7s linear forwards }
.branch-left { position: absolute; margin-top: 10px; transform: scaleY(1) rotate(45deg); -webkit-animation: branch-left 0.7s linear forwards; animation: branch-left 0.7s linear forwards }
.branch-left:before { position: absolute; margin-top: 20px; -webkit-animation: top 0.7s linear forwards; animation: top 0.7s linear forwards }
.branch-right { position: absolute; margin-top: -30px; transform: rotate(-45deg); -webkit-animation: branch-right 0.7s linear forwards; animation: branch-right 0.7s linear forwards }
.branch-right:before { position: absolute; margin-top: 10px; -webkit-animation: top 0.7s linear forwards; animation: top 0.7s linear forwards }
.branch-right:after { position: absolute; margin-top: 30px; -webkit-animation: top 0.7s linear forwards; animation: top 0.7s linear forwards }
.leaf-left { position: absolute; margin-top: 0px; -webkit-clip-path: polygon(50% 0%, 13% 100%, 50% 100%); clip-path: polygon(50% 0%, 13% 100%, 50% 100%); -webkit-animation: width 0.9s ease-in-out forwards 0.3s, width-2 3s ease-in-out }
.leaf-right { position: absolute; margin-top: 0px; -webkit-clip-path: polygon(50% 0%, 50% 100%, 87% 100%); clip-path: polygon(50% 0%, 50% 100%, 87% 100%); -webkit-animation: width 0.9s ease-in-out forwards 0.3s, width-2 3s ease-in-out }
```

### [CSS clip-path (svg clipPath)](https://codepen.io/alexerlandsson/pen/eYGKMOb)

made with: clip-path

```css
.avatar-stack__item:not(:first-child) { -webkit-clip-path: url(#avatar-stack-clip-path); clip-path: url(#avatar-stack-clip-path) }
```

### [border-image + corner rounding IFF corner rounding ≤ border-width](https://codepen.io/thebabydino/pen/zYEaRWm)

made with: clip-path

```css
div { clip-path: inset(0 round 6px) }
```

### [CSS clip-path (inline)](https://codepen.io/alexerlandsson/pen/vYerdxo)

made with: clip-path

```css
.avatar-stack__item:not(:first-child) { -webkit-clip-path: path("M12 0C9.7 0 7.5.7 5.6 1.8 8.3 4.4 10 8 10 12c0 4-1.7 7.6-4.4 10.2 1.8 1.2 4 1.8 6.4 1.8 6.6 0 12-5.4 12-12S18.6 0 12 0z"); clip-path: path("M12 0C9.7 0 7.5.7 5.6 1.8 8.3 4.4 10 8 10 12c0 4-1.7 7. }
```

### [CSS simple clip-path animation | Shine Day 87](https://codepen.io/deboracamargos/pen/gOGvVNw)

made with: @keyframes · transition · clip-path

```css
.frame { position: absolute; top: 50%; margin-top: -200px; box-shadow: 4px 8px 16px 0 rgba(0, 0, 0, 0) }
.center { position: absolute; -webkit-animation: turn 2s infinite linear alternate; animation: turn 2s infinite linear alternate }
.top { position: absolute; top: -50px }
.bottom { position: absolute; top: 49px }
.bottom.active { position: absolute; top: 80px }
.text-area { position: absolute; margin-top: 150px }
.opacity { opacity: 0 }
h2 { padding-top: 30px; opacity: 0; transition: opacity 1s }
h2.active { -webkit-animation: shadow 1s infinite linear alternate; animation: shadow 1s infinite linear alternate; opacity: 1 }
.triangle-small { position: absolute; -webkit-clip-path: polygon(50% 50%, 0% 100%, 100% 100%); clip-path: polygon(50% 50%, 0% 100%, 100% 100%) }
.triangle-small-1 { -webkit-clip-path: polygon(50% 50%, 0% 100%, 96% 100%); clip-path: polygon(50% 50%, 0% 100%, 96% 100%) }
.triangle-small-2 { margin-top: 50px; -webkit-clip-path: polygon(0 0, 46% 50%, 105% 0); clip-path: polygon(0 0, 46% 50%, 105% 0) }
```

### [Sass @function for hollow n-gon (clip-path)](https://codepen.io/ShadowShahriar/pen/GRMQWzj)

on scroll: div.: filter | made with: @keyframes · transition · clip-path · custom properties driven by JS

```css
.test div { -webkit-clip-path: polygon(93.3012701892% 25%, 93.3012701892% 75%, 50% 100%, 6.6987298108% 75%, 6.6987298108% 25%, 50% 0%, calc(50% + ((50% - var(--thickness)) * 0)) calc(50% + ((50% - var(--thickness)) * -1)), calc(50%  }
to { filter: hue-rotate(1turn) }
to { filter: hue-rotate(1turn) }
@keyframes hue animates filter
```

```js
style.setProperty("--thickness", `${e.target.value}%`)
```

### [Santa was here.](https://codepen.io/pehaa/pen/OJxgKbE)

on scroll: div.snowflake: transform+top ×49, div.eye: transform+top ×2, div.head: transform+top, div.owl-head: transform+top | made with: @keyframes · clip-path

```css
.salon { position: relative; box-shadow: inset 0 -130px 150px -100px var(--c2) }
.salon div, *:before, *:after { position: absolute }
.tree { transform: translatex(-50%); bottom: 0; -webkit-clip-path: polygon(0% 100%, 100% 100%, 80% 70%, 86% 71%, 70% 45%, 74% 46%, 60% 25%, 63% 26%, 54% 10%, 57% 12%, 50% 0%, 43% 11%, 46% 10%, 37% 27%, 40% 26%, 26% 49%, 30% 47%, }
.tree:before { top: 2vmin; transform: rotate(-20deg) skew(35deg); box-shadow: -1.72vmin 47vmin 0 var(--c2), -1.72vmin 47vmin 0 1px var(--c6) }
.tree:after { top: 7vmin; box-shadow: 2.4vmin 1.8vmin 0 0 var(--light-color1), 4.9vmin 3.4vmin 0 0 var(--light-color2), -7vmin 18vmin 0 0 var(--light-color3), -4vmin 17vmin 0 0 var(--light-color1), -1vmin 16vmin 0 0 var(--light-color2 }
50% { box-shadow: 2.4vmin 1.8vmin 0 0 var(--light-color1), 4.9vmin 3.4vmin 0 0 var(--light-color2), -7vmin 18vmin 0 0 var(--light-color3), -4vmin 17vmin 0 0 var(--light-color1), -1vmin 16vmin 0 0 var(--light-color2), 2vmin 15v }
50% { box-shadow: 2.4vmin 1.8vmin 0 0 var(--light-color1), 4.9vmin 3.4vmin 0 0 var(--light-color2), -7vmin 18vmin 0 0 var(--light-color3), -4vmin 17vmin 0 0 var(--light-color1), -1vmin 16vmin 0 0 var(--light-color2), 2vmin 15v }
.ball:before { top: 0; transform: translate3d(-50%, -100%, 0) }
.ball-1 { box-shadow: inset 0 0 0 0.75vmin currentcolor }
.ball-11 { top: 28vmin }
.ball-12 { top: 50vmin }
.ball-13 { top: 58vmin }
```

### [Merry Xmas everyone](https://codepen.io/BlogFire/pen/KKXpYqK)

on scroll: div.star: opacity ×453, div.merry: transform+top, div.xmas: transform+top | made with: prefers-reduced-motion · clip-path · mix-blend-mode · custom properties driven by JS · GSAP · canvas 2D · requestAnimationFrame · Web Animations API (.animate)

```css
.wrap { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.merry, .xmas { filter: drop-shadow(0px 0px 55px gold) }
main { position: relative }
.star { position: absolute; top: 30%; transform: translate(var(--x), var(--y)) scale(var(--s)); mix-blend-mode: screen; clip-path: polygon( 50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35% ) }
svg { opacity: 0; position: absolute }
```

```js
style.setProperty("--x", `${x}vmin`)
style.setProperty("--y", `${y}vmin`)
style.setProperty("--s", Math.random() * 2 + 1)
style.setProperty("--hue", Math.random() * 360)
.animate( { opacity: [1, 1, 0] },
gsap.from(".merry", {
gsap.from(".xmas", {
```

### [codeVember #28/2021: hex roll](https://codepen.io/thebabydino/pen/LYzPeGX)

on scroll: div.⬣: transform+top ×3 | made with: @keyframes · clip-path

```css
body::after { animation: p 1s linear infinite }
to { background-position: calc(50% - 1.25*4em) }
.⬣ { transform: translate(calc(var(--j)*25%), calc(var(--k)*-100%)) rotate(calc(var(--s)*(1 + var(--k))*30deg)); animation: a 1s linear infinite }
.⬣::after { clip-path: polygon(50% 0%, 93.3012701892% 25%, 93.3012701892% 75%, 50% 100%, 6.6987298108% 75%, 6.6987298108% 25%) }
to { transform: translate(calc(var(--j)*-25%), calc(var(--k)*-100%)) rotate(calc(var(--s)*(1 + var(--k))*-30deg)) }
@keyframes p animates background-position
@keyframes a animates transform
```

### [Squircle App Icon](https://codepen.io/mrcgrtz/pen/gOxyJvy)

made with: clip-path

```css
img { clip-path: path( "M100,200c43.8,0,68.2,0,84.1-15.9C200,168.2,200,143.8,200,100s0-68.2-15.9-84.1C168.2,0,143.8,0,100,0S31.8,0,15.9,15.9C0,31.8,0,56.2,0,100s0,68.2,15.9,84.1C31.8,200,56.2,200,100,200z" ) }
img { clip-path: shape( from 50% 100%, curve to 92% 92% with 72% 100% / 84% 100%, curve to 100% 50% with 100% 84% / 100% 72%, curve to 92% 8% with 100% 28% / 100% 16%, curve to 50% 0% with 84% 0% / 72% 0%, curve to 8% 8% with  }
```

### [#codeVember #18/2021: popup menu (click it, you know you want to!)](https://codepen.io/thebabydino/pen/eYExgam)

made with: @keyframes · transition · clip-path · custom properties driven by JS

```css
form { position: relative; text-transform: capitalize }
input { opacity: 0 }
label { box-shadow: inset 0 0 0 2px #f7d15a; transition: width 0.3s 0.15s, background-color 0.3s calc(var(--not-exp)*0.3s) }
label::before, label::after { transform: rotate(calc(var(--i)*90deg + var(--exp)*135deg)); transition: transform 0.3s cubic-bezier(0.32, -0.85, 0.68, 1.85) calc(var(--exp)*0.3s) }
span { transform: translatey(calc(var(--exp)*1em)); opacity: var(--not-exp); transition: transform 0.3s, opacity 0.3s }
nav { position: absolute; bottom: calc(100% + .5em); border-bottom: solid 0.5em red; transform: translate(-50%); opacity: var(--exp); box-shadow: inset 0 0 0 2px #f7d15a; transition: 0.3s calc(var(--not-exp)*0.6s); animation:  }
0% { opacity: 0; clip-path: inset(100% 0 0) }
100% { opacity: 1; clip-path: inset(0) }
a { transform: translatey(calc(var(--not-exp)*37%)); opacity: var(--exp); transition: transform 0.3s, opacity 0.3s; animation: mov calc(var(--vis)*0.3s) var(--dt) backwards }
0% { transform: translatey(-37%); opacity: 0 }
100% { transform: none; opacity: 1 }
.✨ { animation: exp calc(var(--vis)*1.5*0.3s) ease-out 0.3s both }
```

```js
style.setProperty('--exp', exp)
```

### [SVG text background image](https://codepen.io/afa34/pen/WNEPrYQ)

held: fixed div.container | made with: position: fixed · clip-path

```css
.container { position: fixed; top: 0 }
```

### [Who is this pokemon?](https://codepen.io/alvalau/pen/mdMQYee)

made with: clip-path · pointer / mouse tracking

```css
svg { position: absolute; top: 0 }
```

```js
addEventListener('mousemove', e => {
```

### [#codeVember #11/2021: TODO list](https://codepen.io/thebabydino/pen/QWMBzVr)

made with: @keyframes · transition · clip-path · mask

```css
input { opacity: 0 }
label { position: relative; animation: slide calc(var(--sel)*.5*0.35s) ease-out 2 alternate }
label::before, label::after { position: absolute }
label::before { transition: color 0.35s, background 0.35s; animation: spark calc(var(--sel)*0.35s) }
label::after { --mask: linear-gradient(-45deg, transparent 50%, red 0) calc(var(--not-i)*100%) calc(var(--not-i)*100%)/ 200% 200%, conic-gradient(at 0.125em calc(100% - 0.125em), transparent 25%, red 0%), radial-gradient(circle at 50%  }
0% { box-shadow: 0.9375em 0em 0 -0.9375em rgba(111, 240, 205, 0), 0.811898816em 0.46875em 0 -0.9375em rgba(103, 240, 212, 0), 0.46875em 0.811898816em 0 -0.9375em rgba(70, 236, 197, 0), 0em 0.9375em 0 -0.9375em rgba(88, 190, 1 }
50% { box-shadow: 1.125em 0em 0 -0.9375em #6ff0cd, 0.9742785793em 0.5625em 0 -0.9375em #67f0d4, 0.5625em 0.9742785793em 0 -0.9375em #46ecc5, 0em 1.125em 0 -0.9375em #58bea1, -0.5625em 0.9742785793em 0 -0.9375em #29a18e, -0.974 }
100% { box-shadow: 1.25em 0em 0 -0.9375em rgba(111, 240, 205, 0), 1.0825317547em 0.625em 0 -0.9375em rgba(103, 240, 212, 0), 0.625em 1.0825317547em 0 -0.9375em rgba(70, 236, 197, 0), 0em 1.25em 0 -0.9375em rgba(88, 190, 161, 0) }
span { position: absolute; top: 50%; clip-path: inset(0 calc(var(--not-i)*100%) 0 0 round 0.0625em); transition: 0.35s }
@keyframes slide animates text-indent
@keyframes spark animates box-shadow
```

### [Infinite portals with finite DIVs 😅](https://codepen.io/ShadowShahriar/pen/wvqXNwE)

on scroll: div.: transform+top | made with: position: fixed · @keyframes · clip-path

```css
body > div { position: absolute; top: 50%; transform: translate(-50%, -50%) rotate(0); -webkit-animation: rotate linear var(--rotate-duration) infinite; animation: rotate linear var(--rotate-duration) infinite; filter: drop-shadow(0  }
div > div { position: absolute; top: 0; transform: rotate(90deg) }
div::before, div::after { position: absolute; top: 0; -webkit-clip-path: polygon(50% 50%, 0 0, 0 100%); clip-path: polygon(50% 50%, 0 0, 0 100%); background-position: 0% 0%; -webkit-animation: shift linear var(--stripe-duration) infinite; animati }
div::after { transform: scaleX(-1) }
to { transform: translate(-50%, -50%) rotate(1turn) }
to { transform: translate(-50%, -50%) rotate(1turn) }
to { background-position: var(--stripe-pair-shift) 0 }
to { background-position: var(--stripe-pair-shift) 0 }
html, body { position: relative }
html::after { position: fixed; top: 0 }
@keyframes rotate animates transform
@keyframes shift animates background-position
```

### [#codeVember #6/2021: page scrolling indicator (scroll, smoother effect Chromium only)](https://codepen.io/thebabydino/pen/GRvxMja)

made with: position: fixed · scroll-snap · transition · clip-path · custom properties driven by JS · scroll listener

```css
html { scroll-snap-type: mandatory; scroll-snap-points-y: repeat(100vh); scroll-snap-type: y mandatory }
body::before, body::after { position: fixed; top: calc(50% + -.5*var(--h)) }
body::after { clip-path: inset(var(--o0, 0) 0 var(--o1, 0) round 1.5em); transition: --o1 0.2s cubic-bezier(0, var(--not-j), 1, var(--not-j)) calc(var(--j)*0.2s), --o0 0.2s cubic-bezier(0, var(--j), 1, var(--j)) calc(var(--not-j)*0.2s }
section { scroll-snap-align: start }
```

```js
addEventListener('scroll', e => {
```

### [#codeVember #5/2021: morphing ▲ grid (pure CSS)](https://codepen.io/thebabydino/pen/BadYORM)

on scroll: div.▲: clip-path+top ×44, div.grid: transform+top | made with: @keyframes · clip-path · mix-blend-mode

```css
.wrap { box-shadow: 4px 4px 17px rgba(0, 0, 0, 0.85) }
.wrap::before, .wrap::after { mix-blend-mode: darken }
.wrap::after { mix-blend-mode: lighten }
.grid { animation: move 6s steps(1) infinite, flip 4s steps(1) infinite }
33.33333% { transform: translatey(-4em) }
66.66667% { transform: translatey(4em) }
50% { filter: invert(1) }
.▲ { margin-bottom: -2em; clip-path: polygon(50% 0%, 71.6506350946% 37.5%, 93.3012701892% 75%, 50% 75%, 6.6987298108% 75%, 28.3493649054% 37.5%); animation: morph 2s cubic-bezier(0.65, 0.25, 0.35, 0.75) infinite }
0%, 10% { clip-path: polygon(50% 0%, 71.6506350946% 37.5%, 93.3012701892% 75%, 50% 75%, 6.6987298108% 75%, 28.3493649054% 37.5%) }
90%, 100% { clip-path: polygon(50% 25%, 93.3012701892% 25%, 71.6506350946% 62.5%, 50% 100%, 28.3493649054% 62.5%, 6.6987298108% 25%) }
@keyframes move animates transform
@keyframes flip animates filter
```

### [JS Interactivity](https://codepen.io/BurmesePotato/pen/qBXPpMw)

made with: transition · :hover · clip-path · pointer / mouse tracking

```css
img { position: absolute; clip-path: polygon(50% 0, 50% 0, 50% 100%, 50% 100%); transition: all 0.9s ease, transform 0.3s linear }
.container { position: relative }
ul li { text-transform: uppercase; position: relative; transition: border-radius 1s }
ul li::before { position: absolute; top: calc(50% - 1px); border-bottom: 1px solid #E4E4E4; transition: width 1s }
section .img-wrapper { position: relative; padding-top: calc(100% / 16 * 21) }
section img { position: absolute; top: 0 }
.show { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%) }
```

```js
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
addEventListener('mousemove', (event) => {
```

### [Parchment Demo with CSS border-image](https://codepen.io/stevenmonson/pen/VwzpQPd)

made with: clip-path

```css
.bookmark-feedback { clip-path: polygon( 0% 0% , 100% 0% , 100% 100%, 50% calc(100% - 12px), 0% 100%) }
.bookmark-feedback:before { clip-path:inherit }
```

### [Using clip-path to create overflow-hidden for position fixed elements with scroll snapping](https://codepen.io/nocksock/pen/oNezzXE)

held: fixed div.fixed, fixed div.fixed, fixed div.fixed | made with: scroll-snap · clip-path

```css
main { -ms-scroll-snap-type: y mandatory; scroll-snap-type: y mandatory }
.clipped { -webkit-clip-path: inset(0px 0px); clip-path: inset(0px 0px) }
section { scroll-snap-align: start }
```

### [arrow shape tabs, find your optimal config with the tweakpane controls](https://codepen.io/tomhermans/pen/xxLVBqg)

on hover of div.btn: a.: background | made with: :hover · clip-path · custom properties driven by JS

```css
.tp-dfwv { top: 56% }
.arrow { clip-path: polygon(0 0%, calc(100% - var(--pointy)) 0, 100% 50%, calc(100% - var(--pointy)) 100%, 0 100%, var(--pointy) 50%) }
.arrow-reverse { clip-path: polygon(var(--pointy) 0%, 100% 0, calc(100% - var(--pointy)) 50%, 100% 100%, var(--pointy) 100%, 0% 50%) }
```

```js
style.setProperty("--" + prop, val + unit)
```

### [alt-J Triangle Buttons?](https://codepen.io/nicolas_reibnitz/pen/VwzaBRG)

on hover of a.image-btn: a.image-btn: filter | made with: :hover · clip-path

```css
.wrapper { position: relative; top: 50%; transform: translate(-50%, -50%) }
.covers .row { position: relative }
.covers .image-btn { position: absolute; -webkit-clip-path: polygon(50% 0%, 100% 100%, 0% 100%, 50% 0%); clip-path: polygon(50% 0%, 100% 100%, 0% 100%, 50% 0%) }
.covers .image-btn:nth-of-type(2n) { -webkit-clip-path: polygon(0% 0%, 100% 0%, 50% 100%, 50% 100%); clip-path: polygon(0% 0%, 100% 0%, 50% 100%, 50% 100%) }
.covers .image-btn:hover { filter: hue-rotate(250deg); filter: invert(1) }
.covers .row2 { top: 2px }
.covers .row2 .image-btn { -webkit-clip-path: polygon(0% 0%, 100% 0%, 50% 100%, 50% 100%); clip-path: polygon(0% 0%, 100% 0%, 50% 100%, 50% 100%) }
.covers .row2 .image-btn:nth-of-type(2n) { -webkit-clip-path: polygon(50% 0%, 100% 100%, 0% 100%, 50% 0%); clip-path: polygon(50% 0%, 100% 100%, 0% 100%, 50% 0%) }
```

### [Clip-Path Transition](https://codepen.io/PejmanNaderi/pen/JjyGvaQ)

made with: transition · clip-path

```css
*, *:before, *:after { position: relative }
img { transition: all 0.5s }
.bg-img { position: absolute; transform: scale(1) }
[data-scene] { transition: visibility 0s linear 0.8s }
[data-scene] > * { transition: opacity 0.2s linear; opacity: 0 }
[data-state=first] [data-scene=first] > *, [data-state=second] [data-scene=secon { opacity: 1 }
[data-scene=first] .element { position: relative }
[data-scene=second] .element { opacity: 0 }
[data-scene=second] .title::after { margin-top: 0.7rem; transform: scaleX(0); transition: 0.4s }
[data-state=second] [data-scene=second] .title::after { transform: scaleX(1) }
```

### [Gradient Border Solution with Inner Border](https://codepen.io/webcraftsman/pen/ExXrJzj)

made with: clip-path

```css
.introduction { padding-bottom: 6.25em; padding-top: 8em; position: relative }
.introduction .box { position: relative }
.introduction .box::after { clip-path: polygon(calc(40.2% - 5px) 0, 40.2% 0, 40.2% 100%, calc(40.2% - 5px) 100%); bottom: 0; position: absolute; top: 0 }
.introduction .intro-body p + p { margin-top: 2em }
```

### [EU Energy Efficiency Rating](https://codepen.io/gc-nomade/pen/zYzPJyK)

on scroll: span.: clip-path+top | made with: transition · :hover · clip-path

```css
span { -webkit-clip-path: polygon( 0% 0%, calc(100% - 0.4em) 0%, 100% 50%, calc(100% - 0.4em) 100%, 0% 100% ); clip-path: polygon( 0% 0%, calc(100% - 0.4em) 0%, 100% 50%, calc(100% - 0.4em) 100%, 0% 100% ) }
div { filter: drop-shadow(1px 1px) drop-shadow(-1px 1px) drop-shadow(1px -1px) drop-shadow(-1px -1px) }
div span { transition: 0.25s }
```

### [Clipping Shapes](https://codepen.io/cliffpyles/pen/bGRWYJb)

made with: transition · clip-path

```css
.circle { -webkit-clip-path: circle(); clip-path: circle() }
.heart { -webkit-clip-path: path("M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z"); clip-path: path("M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z") }
.hexagon { -webkit-clip-path: polygon(25% 0%, 0% 50%, 25% 100%, 75% 100%, 100% 50%, 75% 0%); clip-path: polygon(25% 0%, 0% 50%, 25% 100%, 75% 100%, 100% 50%, 75% 0%) }
.octagon { -webkit-clip-path: polygon(25% 0%, 0% 30%, 0% 70%, 25% 100%, 75% 100%, 100% 70%, 100% 30%, 75% 0%); clip-path: polygon(25% 0%, 0% 30%, 0% 70%, 25% 100%, 75% 100%, 100% 70%, 100% 30%, 75% 0%) }
.oval { -webkit-clip-path: ellipse(50% 30% at 50% 50%); clip-path: ellipse(50% 30% at 50% 50%) }
.pentagon { -webkit-clip-path: polygon(0% 40%, 15% 100%, 85% 100%, 100% 40%, 50% 0%); clip-path: polygon(0% 40%, 15% 100%, 85% 100%, 100% 40%, 50% 0%) }
.pill { -webkit-clip-path: path("M 0 200 L 0,75 A 5,5 0,0,1 150,75 L 200 200 z"); clip-path: path("M 0 200 L 0,75 A 5,5 0,0,1 150,75 L 200 200 z") }
.rectangle { -webkit-clip-path: polygon(0% 25%, 0% 75%, 100% 75%, 100% 25%); clip-path: polygon(0% 25%, 0% 75%, 100% 75%, 100% 25%) }
.rhombus { -webkit-clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%) }
.square { -webkit-clip-path: polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%); clip-path: polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%) }
.squircle { -webkit-clip-path: path("M 0, 50.00000025 C 0, 12.50000006 12.50000006, 0 50.00000025, 0 S 100.00000005, 12.50000006 100.00000005, 50.00000025 87.50000044, 100.00000005 50.00000025, 100.00000005 0, 87.50000044 0, 50.0000 }
.star { -webkit-clip-path: polygon(50% 2.4%, 34.5% 33.8%, 0% 38.8%, 25% 63.1%, 19.1% 97.6%, 50% 81.3%, 80.9% 97.6%, 75% 63.1%, 100% 38.8%, 65.5% 33.8%); clip-path: polygon(50% 2.4%, 34.5% 33.8%, 0% 38.8%, 25% 63.1%, 19.1% 97.6%, }
```

### [Clip Path Animation](https://codepen.io/jashpatel7/pen/dyROgJJ)

on hover of img.: div.box: clip-path+background | made with: transition · :hover · clip-path

```css
.box-parent { position: relative }
.box-parent:hover .box { clip-path: inset(0px round 10px 10px) }
.box { position: absolute; clip-path: inset(30px 0px 0px 30px round 10px 10px); transition: all 0.30s 0.1s ease-in }
.box-round { position: absolute; inset: 20px 0 0 20px }
```

### [Drawer Animation](https://codepen.io/aldrie/pen/xxrOreb)

made with: transition · clip-path · custom properties driven by JS

```css
body { position: relative }
.drawer { position: absolute; top: 0; transition: clip-path 350ms cubic-bezier(0.54, 0.38, 0.26, 0.92); clip-path: circle(var(--button-size) at var(--x) var(--y)) }
.drawer.open { clip-path: circle(100%); transition: clip-path 600ms cubic-bezier(0.58, 0.45, 0.27, 1.1) }
.drawer button { position: relative }
.icon span { transition: transform 400ms ease }
.drawer.open .icon span:nth-child(1) { transform: translateY(calc(4px * 2)) rotateZ(-45deg) }
.drawer.open .icon span:nth-child(2) { transform: rotateZ(-45deg) }
.drawer.open .icon span:nth-child(3) { transform: translateY(calc(-4px * 2)) rotateZ(45deg) }
```

```js
style.setProperty("--x", `${x}px`)
style.setProperty("--y", `${y}px`)
```

### [Full screen menu pure javascript](https://codepen.io/ms_dev97/pen/NWgWZGQ)

held: fixed ul.menu | made with: position: fixed · transition · clip-path

```css
.menu { position: fixed; top: 0; bottom: 0; clip-path: circle(20px at calc(100vw - 5vw) 31px); transition: clip-path 0.5s }
.menu li { position: relative }
.menu a { text-transform: uppercase }
.btn { position: absolute; top: 20px; transform: translateX(-50%) }
.btn > span { margin-bottom: 1px }
.highlight { position: absolute; top: 0; transition: transform 0.3s }
.logo { padding-top: 20px }
.logo a { text-transform: uppercase }
article > h2 { text-transform: uppercase }
```

### [Clock(12/24時制切換)](https://codepen.io/MyPo3/pen/MWoWQEg)

on scroll: div.out: transform+top, div.in: transform | made with: transition · :hover · clip-path · backdrop-filter · requestAnimationFrame

```css
.clock { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.clock > div { text-transform: uppercase }
.out { position: absolute }
.out::after { position: absolute; transform: translateX(-50%); clip-path: polygon(50% 0%, 0 100%, 100% 100%) }
.in { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.by { position: absolute; transform: translateX(-50%); bottom: 5% }
.sec { transform: translateX(840px); backdrop-filter: blur(5px) }
.min { transform: translateX(630px); backdrop-filter: blur(5px) }
.hr { transform: translateX(420px); backdrop-filter: blur(5px) }
.d { transform: translateX(210px); backdrop-filter: blur(5px) }
.m { transform: translateX(0px); backdrop-filter: blur(5px) }
.ctrlhr { position: absolute; bottom: 10px; transform: translateY(-50px); transition: color 0.2s }
```

```js
requestAnimationFrame(animationHandler)
```

### [Clock(滑動版)](https://codepen.io/MyPo3/pen/xxdvXgL)

on scroll: div.out: transform+top, div.in: transform+top | made with: clip-path · backdrop-filter · requestAnimationFrame

```css
.clock { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.clock>div { text-transform: uppercase }
.out { position: absolute }
.out::after { position: absolute; transform: translateX(-50%); clip-path: polygon(50% 0%, 0 100%, 100% 100%) }
.in { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.by { position: absolute; transform: translateX(-50%); bottom: 5% }
```

```js
requestAnimationFrame(animationHandler)
requestAnimationFrame(animationHandler)//處理畫面更新的 setTimeout
```

### [Clock](https://codepen.io/MyPo3/pen/MWmRMRN)

on scroll: div.out: transform+top, div.in: transform | made with: clip-path · backdrop-filter · requestAnimationFrame

```css
.clock { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.clock>div { text-transform: uppercase }
.out { position: absolute }
.out::after { position: absolute; transform: translateX(-50%); clip-path: polygon(50% 0%, 0 100%, 100% 100%) }
.in { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.by { position: absolute; transform: translateX(-50%); bottom: 5% }
```

```js
requestAnimationFrame(animationHandler)
requestAnimationFrame(animationHandler)//處理畫面更新的 setTimeout
```

### [Splitter](https://codepen.io/Lolopicker/pen/VwbNBYe)

made with: clip-path · pointer / mouse tracking

```css
.container { position: absolute }
.item { position: absolute; text-transform: uppercase }
.item_right { clip-path: inset(0 0 0 var(--split-point)) }
.splitter { transform: translateX(calc(var(--split-point) - 15px)) }
.splitter__scrubber { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

```js
addEventListener("mousemove", mouseMoveHandler)
```

### [Clip path card](https://codepen.io/Pranshul/pen/NWjeMLg)

made with: transition · :hover · clip-path

```css
.inner { position: absolute; top: 50%; clip-path: circle(20% at 100% -5%); transition: clip-path 500ms ease-in, color 1000ms linear; transform: translate(-50%, -50%) }
.container:hover .inner { clip-path: circle(100%) }
.container:hover .top-right { transform: rotate(180deg) }
.top-right { position: absolute; top: 10px }
```

### [Metamorphose](https://codepen.io/Calleb/pen/XWRYBQr)

on scroll: div.part1: clip-path+background, div.part2: clip-path+background, div.part3: clip-path+background, div.part4: clip-path+background, div.part5: clip-path+background, div.part6: clip-path+background | made with: @keyframes · clip-path

```css
.wrapper { position: relative }
.wrapper > div { position: absolute; top:0px; animation-iteration-count: infinite; animation-timing-function:ease; animation-fill-mode: forwards; animation-duration: 12s }
.part1 { clip-path: polygon(443px 166px, 344px 392px, 294px 225px); animation: metamorphose }
20% { clip-path: polygon(443px 166px, 344px 392px, 294px 225px) }
30% { clip-path: polygon(273px 314px, 480px 314px, 480px 223px) }
60% { clip-path: polygon(273px 314px, 480px 314px, 480px 223px) }
80% { clip-path: polygon(443px 166px, 344px 392px, 294px 225px) }
.part2 { clip-path: polygon(344px 392px, 256px 95px, 10px 567px, 152px 443px); animation: metamorphose2 }
20% { clip-path: polygon(344px 392px, 256px 95px, 10px 567px, 152px 443px) }
30% { clip-path: polygon(275px 313px, 480px 313px, 480px 404px, 480px 404px) }
60% { clip-path: polygon(275px 313px, 480px 313px, 480px 404px, 480px 404px) }
80% { clip-path: polygon(344px 392px, 256px 95px, 10px 567px, 152px 443px) }
```

### [Metal Olympic Rings - Pure CSS](https://codepen.io/josetxu/pen/OJmZxzX)

on scroll: div.rings: transform+top, div.rings: transform | made with: @keyframes · transition · :hover · clip-path · 3D (perspective / preserve-3d)

```css
.container { position: absolute; top: 0; perspective: 100vmin; padding-bottom: 10vh }
.rings { transform: rotateY(45deg); animation: spin1 1.75s ease 0s 1, spin2 4.575s ease-in-out 1.75s infinite alternate; position: absolute }
.rings:hover, .rings:hover + .rings, .rings:hover .ring:before { animation-play-state: paused }
.rings + .rings { filter: drop-shadow(0px 0px 1.5vmin black) brightness(0) blur(1.5vmin) opacity(0.35); animation: shadow1 1.75s ease 0s 1, shadow2 4.575s ease-in-out 1.75s infinite alternate }
.ring { transform: translate3d(-31vmin, -8vmin, 0); position: absolute; box-shadow: 0 0 0.1vmin 0.15vmin var(--metal), 0 0 0.1vmin 0.15vmin var(--metal) inset }
.ring:before, .ring:after { position: absolute; animation: shine 5s ease-in-out 2s infinite alternate; transform: rotate(0deg) translate3d(0, 0, 0.1vmin); filter: blur(7px) }
.ring:after { clip-path: var(--ring-clip); filter: none; animation: none; transform: translate3d(0, 0, 0.09vmin) }
.ring span { position: absolute; transform: translateZ(-1px); filter: brightness(0.75); clip-path: var(--ring-clip) }
.ring:nth-child(2) { transform: translate3d(-15vmin, 8vmin, 0) }
.ring:nth-child(3) { transform: translate3d(0, -8vmin, 0) }
.ring:nth-child(4) { transform: translate3d(16vmin, 8vmin, 0) }
.ring:nth-child(5) { transform: translate3d(31vmin, -8vmin, 0) }
```

### [CSS Clip-Path reveal content beneath](https://codepen.io/DouglasGlover/pen/JjNLRpZ)

on scroll: div.over: clip-path | on hover of button.: div.over: clip-path | made with: transition · clip-path · custom properties driven by JS

```js
style.setProperty("--mouse-x", x + "px")
style.setProperty("--mouse-y", y + "px")
style.setProperty("--circle-size", this.circleSize + "px")
```

### [B Shaped Clip-path Wrapper](https://codepen.io/paulomfj/pen/oNWpyoL)

made with: clip-path

```css
.wrapper { position: relative }
.wrapper .left-top { position: absolute; top: 0; border-top: 16px solid transparent; border-bottom: 16px solid transparent }
.wrapper .left { position: absolute; top: 16px; bottom: 0 }
.wrapper .bottom { position: absolute; bottom: 0 }
.wrapper .bottom-right-bottom-curve { position: absolute; bottom: 0 }
.wrapper .bottom-right-top-curve { position: absolute; bottom: 16px; box-shadow: 0 0 0 1vw #000 }
.wrapper .content { position: absolute; top: 0; bottom: 20px; clip-path: url(#b) }
```

### [Title Card Animation](https://codepen.io/duncan_ie/pen/WNjdjza)

on scroll: g.[object: transform+top ×5 | on hover of button.: g.[object: transform+top ×5 | made with: @keyframes · transition · clip-path · 3D (perspective / preserve-3d) · custom properties driven by JS · GSAP · pointer / mouse tracking

```css
.box { margin-top: 50px; position: relative; transition: all 2s cubic-bezier(0.85, 0, 0.05, 1) }
.box .box__in { clip-path: polygon(-100% 0%, 0% 0%, -75% 100%, -175% 100%); transition: clip-path 0.5s cubic-bezier(0.85, 0, 0.05, 1) }
.ready .box .box__in { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%) }
.box .box__in:before, .box .box__in:after { position: absolute }
.box .box__in:before { box-shadow: 0 0 0px var(--i) var(--yellow), 0 0 0px var(--i) var(--bloo); transition: box-shadow 1.2s cubic-bezier(0.85, 0, 0.05, 1); bottom: var(--o); top: var(--o) }
.ready .box .box__in:before { box-shadow: calc(-0.75 * var(--o)) calc(0.75 * var(--o)) 0px calc(0.75 * var(--o)) var(--yellow), calc(0.75 * var(--o)) calc(var(--o) * -0.75) 0px calc(var(--o) * 0.75) var(--bloo) }
.box .box__in:after { bottom: 0; top: 0; clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%); clip-path: polygon(calc(0% + var(--i)) calc(0% + var(--i)), calc(100% - var(--i)) calc(0% + var(--i)), calc(100% - var(--i)) calc(100% - var(--i) }
.ready .box .box__in:after { clip-path: polygon(calc(0% + var(--o)) calc(0% + var(--o)), calc(100% - var(--o)) calc(0% + var(--o)), calc(100% - var(--o)) calc(100% - var(--o)), calc(0% + var(--o)) calc(100% - var(--o))) }
.box .box__copy { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.box .box__copy p { clip-path: polygon(-100% 0%, 0% 0%, -75% 100%, -175% 100%); transition: all 0.5s cubic-bezier(0.85, 0, 0.05, 1); transform: scale(0.9, 1) }
.ready .box .box__copy p { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%); transform: scale(1, 1) }
.box .box__copy h1 { position: relative; transition: all 2s cubic-bezier(0.85, 0, 0.05, 1); transform: scale(0.9, 1) }
```

```js
style.setProperty('--dash', paths[i].getTotalLength())
addEventListener("mousemove", e => {
gsap.to(paths__out[i], 1, {
```

### [Example stacking context with fixed images](https://codepen.io/CatoCR/pen/BaRJBPO)

held: fixed img.hero__image | made with: position: fixed · transition · clip-path

```css
img { transition: all 0.2s linear }
.block { margin-bottom: 4rem }
.block__title { margin-bottom: 2rem }
.hero { position: relative; -webkit-clip-path: inset(0); clip-path: inset(0) }
.hero__image { position: fixed }
.hero__overlay { position: absolute; top: 0 }
```

### [Creative img clip-path effect](https://codepen.io/mperetto/pen/NWjgYav)

on scroll: img.img-1: clip-path, img.img-2: clip-path | made with: transition · :hover · clip-path

```css
img { position: absolute; top: 0; transition: all 2s }
.img-1 { clip-path: polygon(0% 100%, 0 0, 100% 0, 100% 0) }
.img-1:hover { clip-path: polygon(0% 100%, 0 0, 100% 0, 100% 100%) }
.img-1:hover + .img-2 { clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 100% 100%) }
.img-2 { clip-path: polygon(0% 100%, 100% 0, 100% 0%, 100% 100%) }
.img-2:hover { clip-path: polygon(0% 100%, 0 0, 100% 0, 100% 100%) }
```

### [Classic image reveal with clip-path animation](https://codepen.io/bytrangle/pen/qBmrRaO)

made with: @keyframes · clip-path

```css
.js-loading *, .js-loading *:before, .js-loading *:after { animation-play-state: paused !important }
.page { position: absolute; top: 0; bottom: 0 }
.loading { position: absolute; top: 50%; transform: translate(-50%, -50%) }
0% { clip-path: circle(1%) }
10% { clip-path: circle(1%) }
60% { clip-path: circle(50%) }
100% { clip-path: circle(100%) }
.image { animation: 2.2s ease-in reveal }
@keyframes reveal animates clip-path
```

### [france](https://codepen.io/gc-nomade/pen/KKmNREv)

made with: clip-path

```css
div { -webkit-clip-path: polygon( 16% 84%, 18% 77%, 22% 61%, 27% 63%, 24% 57%, 25% 51%, 18% 45%, 17% 39%, 11% 33%, 3% 31%, 0 27%, 5% 25%, 1% 23%, 1% 20%, 4% 18%, 10% 18%, 16% 19%, 16% 22%, 25% 24%, 27% 22%, 25% 14%, 24% 10%, 3 }
div:before { padding-top: 102% }
body { filter: drop-shadow(0 0 3px) }
```

### [Clip-path homepage image](https://codepen.io/hal-hawkins/pen/bGWeWom)

made with: clip-path

```css
.box { position: relative }
.info { position: absolute; top: 1% }
.info p { margin-top: .1em; margin-bottom: .1em }
.dude { position: absolute; -webkit-clip-path: polygon(37.532% 79.186%, 37.273% 77.602%, 37.403% 75.113%, 37.662% 71.719%, 39.091% 63.801%, 39.481% 61.538%, 40.390% 59.050%, 40.519% 56.561%, 41.039% 55.656%, 41.818% 52.489%, 42. }
.monitor { position: relative; top:0px; -webkit-clip-path: polygon(75.325% 78.281%, 59.610% 82.353%, 59.351% 82.353%, 58.961% 81.900%, 58.831% 81.222%, 58.961% 79.864%, 64.935% 42.760%, 65.325% 41.629%, 65.844% 41.176%, 86.364% 42. }
.hilite { position: absolute; top:0px; -webkit-clip-path: polygon(65.455% 40.950%, 64.805% 41.403%, 64.545% 42.081%, 58.442% 80.543%, 58.571% 81.448%, 58.831% 82.353%, 59.351% 82.353%, 58.961% 81.900%, 58.831% 80.995%, 64.935% 42. }
.lampshade { position: absolute; top:0px; -webkit-clip-path: polygon(35.325% 36.199%, 34.026% 33.484%, 33.377% 32.805%, 32.597% 32.579%, 29.351% 31.900%, 29.091% 31.674%, 28.182% 29.412%, 27.922% 29.412%, 27.013% 29.864%, 26.494% 30. }
.lamplight { position: absolute; top:0px; -webkit-clip-path: polygon(26.104% 46.833%, 26.364% 45.928%, 27.403% 44.118%, 28.701% 42.081%, 30.909% 39.593%, 32.468% 38.009%, 33.896% 36.878%, 35.455% 35.973%, 35.714% 36.199%, 35.844% 37. }
.ballast { position: absolute; top:0px; -webkit-clip-path: polygon(28.312% 29.412%, 27.792% 29.638%, 27.013% 30.090%, 26.104% 31.222%, 25.455% 32.353%, 25.325% 33.032%, 24.545% 33.710%, 24.156% 32.805%, 25.065% 31.674%, 25.065% 30. }
.boom { position: absolute; top:0px; -webkit-clip-path: polygon(4.935% 51.131%, 22.338% 34.389%, 22.338% 34.163%, 23.896% 32.579%, 24.416% 32.805%, 24.675% 33.710%, 24.545% 34.615%, 22.987% 35.973%, 22.727% 35.973%, 5.325% 52.94 }
.stand { position: absolute; top:0px; -webkit-clip-path: polygon(11.299% 47.964%, 11.688% 47.285%, 11.688% 46.380%, 11.558% 45.249%, 11.039% 44.344%, 10.390% 44.344%, 9.740% 44.796%, 9.351% 45.928%, 9.481% 47.285%, 9.870% 48.190% }
.mugbody { position: absolute; top:0px; -webkit-clip-path: polygon(28.442% 87.783%, 28.442% 77.376%, 28.442% 77.149%, 29.091% 77.149%, 30.909% 76.923%, 32.208% 76.923%, 33.247% 77.149%, 33.506% 77.376%, 33.377% 87.783%, 32.987% 88. }
```

### [５核心價值｜Garena Core Value](https://codepen.io/garena-tw-eng/pen/WNjwpBa)

made with: @keyframes · transition · clip-path

```css
body { position: relative }
body::before { position: absolute; top: 0 }
.logo { transform: scale(0.6); position: absolute; top: 0 }
.core-img-box { position: relative }
.core-img-box { margin-bottom: 0.3rem }
.core-img-item { position: absolute; opacity: 0; transition: all 0.4s }
.core-img-item.active { opacity: 1 }
.trigger-area { position: absolute }
.trigger-area.trigger-1 { top: 0 }
.trigger-area.trigger-2 { top: 0.9rem; -webkit-clip-path: polygon(0 0, 30% 0, 30% 15%, 100% 15%, 100% 100%, 0 100%); clip-path: polygon(0 0, 30% 0, 30% 15%, 100% 15%, 100% 100%, 0 100%) }
.trigger-area.trigger-3 { top: 1.1rem; -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 32% 100%, 32% 80%, 0 80%); clip-path: polygon(0 0, 100% 0, 100% 100%, 32% 100%, 32% 80%, 0 80%) }
.trigger-area.trigger-4 { top: 1.8rem; -webkit-clip-path: polygon(0 0, 16% 0, 16% 18%, 50% 18%, 50% 0, 100% 0, 100% 100%, 0 100%); clip-path: polygon(0 0, 16% 0, 16% 18%, 50% 18%, 50% 0, 100% 0, 100% 100%, 0 100%) }
```

### [Magnifying glass](https://codepen.io/ed-sa-ma/pen/gOWrLwK)

on scroll: g.[object: opacity, clippath.[object: transform, path.[object: transform, g.[object: transform | made with: transition · clip-path · pointer / mouse tracking

```css
svg { position: relative }
#clip-group { transition: opacity 0.06s linear; opacity: 0 }
svg.hovering #clip-group { opacity: 1 }
#clip-consumer { clip-path: url(#clip-path) }
```

```js
addEventListener("pointermove", function handleMouseMove(event) {
```

### [...just yet another loader](https://codepen.io/aepicos/pen/oNWbaad)

on scroll: div.loader: transform | made with: @keyframes · clip-path

```css
.loader { position: relative; -webkit-clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); animation: rotate 12000ms 1800ms linear reve }
.loader::after { position: absolute; top: -6vmin; bottom: -6vmin; -webkit-animation: rotate 6000ms linear infinite; animation: rotate 6000ms linear infinite }
0% { transform: rotate3d(0, 0, 1, 0deg) }
7%, 33.3333% { transform: rotate3d(0, 0, 1, 120deg) }
40.3333%, 66.6666% { transform: rotate3d(0, 0, 1, 240deg) }
73.6666%, 100% { transform: rotate3d(0, 0, 1, 360deg) }
0% { transform: rotate3d(0, 0, 1, 0deg) }
7%, 33.3333% { transform: rotate3d(0, 0, 1, 120deg) }
40.3333%, 66.6666% { transform: rotate3d(0, 0, 1, 240deg) }
73.6666%, 100% { transform: rotate3d(0, 0, 1, 360deg) }
@keyframes rotate animates transform
```

### [SVG clipPath clipPathUnits objectBoundingBox example](https://codepen.io/felquis/pen/ExmPoGP)

made with: @keyframes · clip-path

```css
.rect { position: relative; margin-top: 100px }
.rect:before { position: absolute; bottom: 100%; clip-path: url('#menu'); will-change: left; animation-name: move; animation-duration: 4s; animation-direction: alternate; animation-iteration-count: infinite }
100% { transform: translateX(50vw) }
.svg-container { margin-top: 5rem }
@keyframes move animates background-color, transform
```

### [Beveled Corners with clip-path](https://codepen.io/ceiphr/pen/bGWNzYw)

made with: transition · :hover · clip-path

```css
.absolute { position: initial; transform: translate(0, 0) }
.button, .button--outline, .button--alt { transition: background-color 200ms; clip-path: polygon(0% 0%, 0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 100% 100%, 12px 100%, 0 calc(100% - 12px)) }
.button--alt { clip-path: polygon(0% 12px, 12px 0%, 100% 0%, 100% 100%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 100% 100%, 0% 100%) }
.paragraph, .paragraph--outline { clip-path: polygon(0% 1.5em, 1.5em 0%, calc(100% - 1.5em) 0%, 100% 1.5em, 100% calc(100% - 1.5em), calc(100% - 1.5em) 100%, 1.5em 100%, 0 calc(100% - 1.5em)) }
.paragraph--outline .paragraph, .paragraph--outline .paragraph--outline { position: relative; top: 1px }
```

### [Grid & clip-path](https://codepen.io/gc-nomade/pen/poPvGgR)

made with: clip-path

```css
#lay { filter:drop-shadow( 1px 0 black) drop-shadow( -1px 0 black) drop-shadow(0 0 15px white) }
.left { -webkit-clip-path:polygon(0 0 , 60% 0, 40% 100%,0 100% ); clip-path:polygon(0 0 , 60% 0, 40% 100%,0 100% ) }
.right { -webkit-clip-path: polygon(60% 0, 100% 0%, 100% 100%, 40% 100%); clip-path: polygon(60% 0, 100% 0%, 100% 100%, 40% 100%) }
.middle { transform:rotate(-21deg) scale(1, 1.5) }
```

### [Garena core value](https://codepen.io/vii120/pen/jOBjypM)

made with: @keyframes · transition · clip-path

```css
body { position: relative }
.logo { transform: scale(0.6); position: absolute; top: 0 }
.core-img-box { position: relative }
.core-img-box { margin-bottom: 0.3rem }
.core-img-item { position: absolute; opacity: 0; transition: all 0.4s }
.core-img-item.active { opacity: 1 }
.trigger-area { position: absolute }
.trigger-area.trigger-1 { top: 0 }
.trigger-area.trigger-2 { top: 0.9rem; -webkit-clip-path: polygon(0 0, 30% 0, 30% 15%, 100% 15%, 100% 100%, 0 100%); clip-path: polygon(0 0, 30% 0, 30% 15%, 100% 15%, 100% 100%, 0 100%) }
.trigger-area.trigger-3 { top: 1.1rem; -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 32% 100%, 32% 80%, 0 80%); clip-path: polygon(0 0, 100% 0, 100% 100%, 32% 100%, 32% 80%, 0 80%) }
.trigger-area.trigger-4 { top: 1.8rem; -webkit-clip-path: polygon(0 0, 16% 0, 16% 18%, 50% 18%, 50% 0, 100% 0, 100% 100%, 0 100%); clip-path: polygon(0 0, 16% 0, 16% 18%, 50% 18%, 50% 0, 100% 0, 100% 100%, 0 100%) }
.trigger-area.trigger-5 { top: 2rem; -webkit-clip-path: polygon(0 0, 38% 0, 38% 43%, 100% 43%, 100% 100%, 34% 100%, 34% 68%, 0 68%); clip-path: polygon(0 0, 38% 0, 38% 43%, 100% 43%, 100% 100%, 34% 100%, 34% 68%, 0 68%) }
```

### [Deep inside a ⬡🐚](https://codepen.io/thebabydino/pen/ExWrbqj)

held: fixed a | on scroll: div.hex: transform+top ×214, div.hex: transform ×20 | on hover of a.: div.hex: transform+top ×214, div.hex: transform ×13, a.: filter | made with: @keyframes · clip-path · mix-blend-mode · 3D (perspective / preserve-3d)

```css
.hex { transform: perspective(25em) translatez(calc(-1*var(--rs))) rotatex(calc(-1*var(--ax))) rotatey(var(--ay)) translatez(var(--rs)) rotatey(calc(-1*var(--ay))) rotatex(var(--ax)); mix-blend-mode: screen; clip-path: polygon( }
@keyframes p animates --p
```

### [Clip Path Open Overlay](https://codepen.io/thetarnav/pen/zYZmwag)

made with: transition · :hover · clip-path

```css
.window { position: relative; box-shadow: 14px 21px 35px rgba(43, 42, 43, 0.12) }
.overlay { position: absolute; top: 0; bottom: 0; transition: -webkit-clip-path 0.4s; transition: clip-path 0.4s; transition: clip-path 0.4s, -webkit-clip-path 0.4s }
.overlay:after { position: absolute; bottom: 0; top: 0px }
.overlay.circle { -webkit-clip-path: circle(31.5px at calc(100% - 59.5px) calc(100% - 59.5px)); clip-path: circle(31.5px at calc(100% - 59.5px) calc(100% - 59.5px)) }
.overlay.circle.open { -webkit-clip-path: circle(125% at calc(100% - 59.5px) calc(100% - 59.5px)); clip-path: circle(125% at calc(100% - 59.5px) calc(100% - 59.5px)) }
.overlay.circle.center.open { -webkit-clip-path: circle(70.7% at 50% 50%); clip-path: circle(70.7% at 50% 50%) }
.overlay.square { -webkit-clip-path: polygon(calc(100% - 84px) calc(100% - 91px), calc(100% - 28px) calc(100% - 84px), calc(100% - 35px) calc(100% - 28px), calc(100% - 91px) calc(100% - 35px)); clip-path: polygon(calc(100% - 84px) calc(10 }
.overlay.square.open { -webkit-clip-path: polygon(0 -5%, 130% 0, 130% 130%, -10% 130%); clip-path: polygon(0 -5%, 130% 0, 130% 130%, -10% 130%) }
.button { position: absolute; bottom: 28px; transition: background 0.3s }
h1 { margin-top: 4rem }
```

### [Headline-hover + Image-reveal](https://codepen.io/miXTim/pen/WNpKpLM)

on scroll: img.: clip-path+top | on hover of img.: img.: clip-path ×2, div.title: color ×2, div.link: color ×2, div.byline: color ×2, a.: color ×2 | made with: transition · :hover · clip-path

```css
a { transition: color 300ms linear; -webkit-transition: color 300ms linear; -moz-transition: color 300ms linear; -ms-transition: color 300ms linear; -o-transition: color 300ms linear }
.wrapper { padding-bottom: 1em }
.box, .box2 { position: relative }
.column img { top: 0; position: absolute }
.column img:nth-of-type(1) { filter: grayscale(1) brightness(40%) }
.column img:nth-of-type(2) { -webkit-clip-path: var(--clip-start); clip-path: var(--clip-start); transition: clip-path 500ms; transition: -webkit-clip-path 500ms; transition: clip-path 500ms, -webkit-clip-path 500ms }
.column:hover img:nth-of-type(2) { -webkit-clip-path: var(--clip-end); clip-path: var(--clip-end) }
.title { text-transform: uppercase; position: absolute; bottom: 0; will-change: background-position; -webkit-transition: background-position 300ms, color 300ms ease; -moz-transition: background-position 300ms, color 300ms ease; - }
.column:hover .title { background-position: 0 100%; -webkit-transition: background-position 400ms, color 300ms ease; -moz-transition: background-position 400ms, color 300ms ease; -ms-transition: background-position 400ms, color 300ms ease; -o- }
```

### [Image reveal animation using CSS clip-path](https://codepen.io/rohitutekar/pen/MWpGYeZ)

made with: @keyframes · clip-path

```css
.reveal-curve-left { clip-path: circle(100% at -100% 50%); animation: reveal-curve-left 2s 2s forwards }
.reveal-curve-right { clip-path: circle(100% at 200% 50%); animation: reveal-curve-right 2s 3s forwards }
from { clip-path: circle(100% at -100% 50%) }
to { clip-path: circle(100% at 50% 50%) }
from { clip-path: circle(100% at 200% 50%) }
to { clip-path: circle(100% at 50% 50%) }
@keyframes reveal-curve-left animates clip-path
@keyframes reveal-curve-right animates clip-path
```

### [F1 Player Hexagon Card Responsive](https://codepen.io/TajShireen/pen/abJyxrX)

made with: clip-path

```css
.card-list { text-transform: uppercase }
.card__border, .card__border-line, .card__inner { -webkit-clip-path: polygon(50% 0, 100% 20%, 100% 80%, 50% 100%, 0% 80%, 0% 20%); clip-path: polygon(50% 0, 100% 20%, 100% 80%, 50% 100%, 0% 80%, 0% 20%) }
.card { -webkit-filter: drop-shadow(0px 0px 5px var(--color)) drop-shadow(0px 0px 15px var(--color)); filter: drop-shadow(0px 0px 5px var(--color)) drop-shadow(0px 0px 15px var(--color)); position: relative }
.card__border { position: absolute; top: 1% }
.card__border-line { position: absolute; top: 2.5% }
.card__inner { margin-top: 4.8% }
.img__team { padding-top: 15% }
.img__athlete { padding-top: 8% }
.img__athlete img { object-position: top }
.card__type { margin-top: -6% }
.card__text { position: relative; padding-bottom: 16% }
.card__text:before { position: absolute; top: 0; bottom: 0; opacity: 0.3 }
```

### [Honeycomb Grid](https://codepen.io/TajShireen/pen/ExWvGWL)

made with: clip-path

```css
.card-list { text-transform: uppercase }
.card__border, .card__border-line, .card__inner { -webkit-clip-path: polygon(50% 0, 100% 20%, 100% 80%, 50% 100%, 0% 80%, 0% 20%); clip-path: polygon(50% 0, 100% 20%, 100% 80%, 50% 100%, 0% 80%, 0% 20%) }
.card { -webkit-filter: drop-shadow(0px 0px 5px var(--color)) drop-shadow(0px 0px 15px var(--color)); filter: drop-shadow(0px 0px 5px var(--color)) drop-shadow(0px 0px 15px var(--color)); position: relative }
.card:nth-child(4), .card:nth-child(5), .card:nth-child(6) { margin-top: -40% }
.card__border { position: absolute; top: 1% }
.card__border-line { position: absolute; top: 2.2% }
.card__inner { margin-top: 4.8% }
.img__team { padding-top: 15% }
.img__athlete { padding-top: 8% }
.img__athlete img { object-position: top }
.card__type { margin-top: -6% }
.card__text { position: relative; padding-bottom: 13% }
```

### [tommette, demo hex grid](https://codepen.io/gc-nomade/pen/wvJgbba)

made with: :hover · clip-path

```css
.hex { filter:drop-shadow(-1px -1px 1px black); -webkit-clip-path: polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%); clip-path: polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%); vertical-align: top }
```

### [tut hexagone](https://codepen.io/gc-nomade/pen/ExWZzMQ)

made with: clip-path

```css
[data-flex] .container:before { -webkit-clip-path:polygon( 0% 0%, 0% 100px, 27px 100px, 27px 125px, 0 125px, 0 100%); clip-path:polygon( 0% 0%, 0% 100px, 27px 100px, 27px 125px, 0 125px, 0 100%) }
.hex { -webkit-clip-path : polygon(0% 25%,0% 75%,50% 100%,100% 75%,100% 25%,50% 0%); clip-path : polygon(0% 25%,0% 75%,50% 100%,100% 75%,100% 25%,50% 0%); vertical-align:top }
```

### [ANIMATED CSS - SVG clip-path](https://codepen.io/pascallllacroix/pen/zYZBEVQ)

made with: clip-path

```css
#div1 { position: absolute; top: 0; clip-path: url("#circle") }
#controls { position: absolute; top: 200px }
#conteneur { position: relative }
```

### [CSS CHALLENGE - Clip-path sections](https://codepen.io/pascallllacroix/pen/eYvzGyL)

made with: clip-path

```css
.section:nth-of-type(1) { clip-path: polygon(0 0, 100% 0, 100% 80%, 0% 100%) }
.section:nth-of-type(3) { clip-path: polygon(0 0, 100% 20%, 100% 80%, 0 100%) }
.section:nth-of-type(5) { clip-path: polygon(0 0, 100% 20%, 100% 100%, 0 100%) }
```

### [CSS CHALLENGE - Habillage Clip path](https://codepen.io/pascallllacroix/pen/mdWEBqV)

made with: clip-path

```css
img { clip-path: circle(80% at 0 50%) }
```

### [CSS Split Loading Text Animation Effects using clip-path](https://codepen.io/bousahla-mounir/pen/zYZrBrK)

made with: @keyframes · clip-path

```css
h1 { position: absolute; top: 50%; transform: translate(-50%,-50%); text-transform: uppercase }
h1::before,h1::after { position: absolute; top: 0; text-transform: uppercase }
h1::before { clip-path: polygon(0 0 , 100% 0 , 100% 50% , 0 50%); animation: animateBefore 4s infinite linear }
h1::after { clip-path: polygon(0 50% , 100% 50% , 100% 100% , 0 100%); animation: animateAfter 4s infinite linear }
0% { transform: translateX(0) }
30% { transform: translateX(-50%) }
70% { transform: translateX(-50%) }
100% { transform: translateX(-100%) }
0% { transform: translateX(-100%) }
30% { transform: translateX(-50%) }
70% { transform: translateX(-50%) }
100% { transform: translateX(0) }
```

### [HTML CSS Google Chrome Logo](https://codepen.io/bousahla-mounir/pen/QWpbqBe)

made with: clip-path

```css
.box { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.box span { position: absolute; top: 0 }
.box span:nth-of-type(1) { clip-path: polygon(0 0 , 100% 0 , 100% 30% , 50% 30% , 30% 60% , 0 30%) }
.box span:nth-of-type(2) { clip-path: polygon(0 30% , 30% 60% , 70% 60% , 50% 100% , 0 100% ) }
.box span:nth-of-type(3) { clip-path: polygon(50% 30% ,100% 30%, 100% 100% , 50% 100% , 70% 60% , 30% 60% ) }
.box::before,.box::after { position: absolute; top: 0 }
.box::before { transform: scale(.36); box-shadow: 0 0 0 50px #fff }
.box::after { box-shadow:inset 0 0 40px 5px rgba(0,0,0,.5) }
```

### [Page control indicators (#1 and #4 Chromium only)](https://codepen.io/thebabydino/pen/JjWdrXK)

made with: @keyframes · transition · clip-path · custom properties driven by JS

```css
form { box-shadow: 4px 4px 13px rgba(0, 0, 0, 0.65) }
form:nth-of-type(1) ::before, form:nth-of-type(4) ::before { opacity: 0.5 }
form:nth-of-type(2) ::before, form:nth-of-type(3) ::before { opacity: calc(1 - var(--not-sel)*.5); transition: opacity 0.3s cubic-bezier(0.35, 1.57, 0.65, 1) }
form:nth-of-type(1) ::before { opacity: 0.5 }
form:nth-of-type(1)::after { clip-path: inset(0 var(--or, 0) 0 var(--ol, 0) round 1.5em); transition: --or 0.15s calc(var(--j)*0.15s), --ol 0.15s calc(var(--not-j)*0.15s) }
form:nth-of-type(2) ::before { box-shadow: inset 0 0 0 calc((1 - .7*var(--not-sel))*0.75em) #fff; transition-property: opacity, box-shadow }
form:nth-of-type(3) input, form:nth-of-type(3) label { transform: translate(calc((var(--m) - var(--k))*(1.5em + 1.5em))); transition: transform 0.3s cubic-bezier(0.32, 0, 0.68, 0) }
form:nth-of-type(3)::after { transform: translate(calc(var(--m)*(1.5em + 1.5em))); box-shadow: 0 0 0 2px #fff }
form:nth-of-type(4) ::after { animation: out 0.3s forwards }
form:nth-of-type(4) :checked + label::after { animation: in 0.3s forwards }
0% { clip-path: inset(0 var(--or) 0 var(--ol) round 1.5em) }
100% { clip-path: inset(0 round 1.5em) }
```

```js
style.setProperty('--p', +_P.style.getPropertyValue('--k'))
style.setProperty('--k', +_T.value)
```

### [CSS 3D Paper Text Fold Effect](https://codepen.io/bousahla-mounir/pen/jOBPwjL)

made with: clip-path

```css
h1 { position: absolute; top: 50%; transform: translate(-50%,-50%) scale(2) skewY(20deg) }
h1 span { position: absolute; top: 50%; transform: translate(-50%,-50%); text-transform: uppercase }
h1 span:nth-of-type(1) { clip-path: polygon(0 0 , 100% 0 , 100% 40% , 0 40%) }
h1 span:nth-of-type(2) { clip-path: polygon(0 40% , 100% 40% , 100% 60% , 0 60%); transform: translate(-54.5%,-50%) skewX(-50deg) }
h1 span:nth-of-type(3) { clip-path: polygon(0 60% , 100% 60% , 100% 100% , 0 100%); transform: translate(-59%,-50%) }
```

### [...just down the clip-path rabbit hole](https://codepen.io/aepicos/pen/oNZgZyz)

on scroll: div.rabbit: transform+top | made with: @keyframes · :hover · clip-path

```css
.hole { position: absolute; top: 10vmin; -webkit-clip-path: polygon(0 0, 100% 0, 99% 89%, 96% 92%, 90% 95%, 80% 98%, 60% 100%, 40% 100%, 20% 98%, 10% 95%, 4% 92%, 1% 89%); clip-path: polygon(0 0, 100% 0, 99% 89%, 96% 92%, 90% 95 }
.rabbit { position: absolute; top: 0; -webkit-animation: 2s ease-in-out infinite alternate rabbit-hole; animation: 2s ease-in-out infinite alternate rabbit-hole }
from { transform: translate3d(0, 0, 0) }
to { transform: translate3d(0, 3em, 0) }
from { transform: translate3d(0, 0, 0) }
to { transform: translate3d(0, 3em, 0) }
@keyframes rabbit-hole animates transform
```

### [Clip-path clip-boxes](https://codepen.io/janegca/pen/abpePrV)

made with: clip-path

```css
div { position: relative }
#content-box { clip-path: ellipse(50% 50%) content-box }
#border-box { clip-path: ellipse(50% 50%) border-box }
#padding-box { clip-path: ellipse(50% 50%) padding-box }
#margin-box { clip-path: ellipse(50% 50%) margin-box }
```

### [Clip-path: a Star](https://codepen.io/janegca/pen/poRMKdw)

made with: clip-path

```css
.shape, .vertices { position: relative }
.shape { top: 50%; clip-path: polygon( 10em 0em, 13em 7em, 20em 7em, 14em 11em, 16em 20em, 10em 14em, 4em 20em, 6em 11em, 0em 7em, 7em 7em ) }
.vertices { top: -50% }
.vertices > span { position: absolute }
#v1 { top: -1em }
#v2 { top: 6em }
#v3 { top: 6.5em }
#v4 { top: 10.5em }
#v5 { top: 20em }
#v6 { top: 13em }
#v7 { top: 20em }
#v8 { top: 10.5em }
```

### [Clip-path: an X](https://codepen.io/janegca/pen/ZELgWwj)

made with: clip-path

```css
.shape, .vertices { position: relative }
.shape { top: 50%; clip-path: polygon( 4em 0em, 0em 4em, 6em 10em, 0em 16em, 4em 20em, 10em 14em, 16em 20em, 20em 16em, 14em 10em, 20em 4em, 16em 0em, 10em 6em) }
.vertices { top: -50% }
.vertices > span { position: absolute }
#v1 { top: -6% }
#v2 { top: 3.5em }
#v3 { top: 9.5em }
#v4 { top: 15.5em }
#v5 { top: 20em }
#v6 { top: 13em }
#v7 { top: 20em }
#v8 { top: 15.5em }
```

### [Clip-path: triangle](https://codepen.io/janegca/pen/yLgmOQK)

made with: clip-path

```css
.shape, .vertices { position: relative }
.shape { top: 50%; clip-path: polygon(50% 0%, 0% 100%, 100% 100%) }
.vertices { top: -50% }
.vertices > span { position: absolute }
#v1 { top: -6% }
#v2 { top: 100% }
#v3 { bottom: -6% }
#a1 { top: 50%; transform: rotate(-45deg) }
#a2 { top: 97%; transform: rotate(180deg) }
#a3 { top: 50%; transform: rotate(45deg) }
```

### [Guess Who?](https://codepen.io/kitjenson/pen/ZELPJBx)

made with: transition · :hover · clip-path

```css
body { position:relative; transform:scale(1.5) }
div { position:relative; clip-path:polygon(-1% 37%, 101% 37%, 101% 45%, -1% 45%); transition:.5s }
div:before { position:absolute; bottom:5px }
div:hover { clip-path:polygon(-1% 0%, 101% 0%, 101% 101%, -1% 101%) }
div:nth-child(3) { background-position:0 0 }
div:nth-child(4) { background-position:33% 0 }
div:nth-child(5) { background-position:67% 0 }
div:nth-child(6) { background-position:100% 0 }
```

### [...just a clip-path tetrahedron](https://codepen.io/aepicos/pen/bGgQXJQ)

held: fixed input, fixed label | on scroll: tetrahedron.: transform+top | made with: position: fixed · @keyframes · transition · :hover · clip-path · 3D (perspective / preserve-3d)

```css
to { transform: rotateZ(360deg) rotateY(360deg) }
to { transform: rotateZ(360deg) rotateY(360deg) }
main { perspective: 1000vmin }
tetrahedron { position: relative; top: -17.3205080757vmin; -webkit-animation: rotate 10s linear infinite; animation: rotate 10s linear infinite }
tetrahedron, bottom, bottom::after, side, side::after { transform-origin: center bottom }
bottom, side { -webkit-clip-path: polygon(50% 0%, 0% 100%, 100% 100%); clip-path: polygon(50% 0%, 0% 100%, 100% 100%) }
bottom::after, side::after { position: absolute; top: 0; -webkit-clip-path: polygon(0% 100%, 5% 100%, 50% 8%, 93% 95%, 5% 95%, 5% 100%, 100% 100%, 50% 0%); clip-path: polygon(0% 100%, 5% 100%, 50% 8%, 93% 95%, 5% 95%, 5% 100%, 100% 100%, 50% 0%) }
side { position: absolute; transition: transform 6s ease-out }
side:nth-of-type(1) { transform: translate3d(10vmin, -51.9615242271vmin, 0) rotateZ(60deg) rotateX(109.471221deg) }
side:nth-of-type(2) { transform: translate3d(0, -34.6410161514vmin, 0) rotateZ(180deg) rotateX(109.471221deg) }
side:nth-of-type(3) { transform: translate3d(-10vmin, -51.9615242271vmin, 0) rotateZ(300deg) rotateX(109.471221deg) }
#toggle-invert:checked ~ main side:nth-of-type(1) { transform: translate3d(10vmin, -51.9615242271vmin, 0) rotateZ(60deg) rotateX(-109.471221deg) }
```

### [CSS Clipping Overlay Experiment with Image and Text](https://codepen.io/tallulahh/pen/zYNMMPm)

made with: clip-path

```css
.image { position: relative }
.image img { clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%) }
.title { position: absolute }
.overlay-container { clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%) }
.image-overlay { position: absolute }
```

```js
addEventListener("mouseenter", revealImage)
addEventListener("mouseleave", hideImage)
```

### [CSS clip-path transition](https://codepen.io/martin-wichmand/pen/ZELmQgQ)

on scroll: div.box: clip-path | made with: transition · :hover · clip-path

```css
.box { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 70% 100%, 72% 100%, 37% 100%, 0 100%); transition:clip-path 1s ease-in-out }
.box:hover { clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%) }
```

### [Clip-path Transform Effects on Page Scroll | Creative Text Scrolling Parallax Effects](https://codepen.io/alessiomarcone/pen/zYNaeoM)

held: fixed h2.text, fixed section, fixed h2.innerText | on scroll: div.scroll-down-wrapper: transform+opacity+top, section.: clip-path | on hover of img.img-fluid: div.scroll-down-wrapper: transform+opacity+top | made with: position: fixed · @keyframes · transition · :hover · clip-path · backdrop-filter · mix-blend-mode · scroll listener

```css
h3 { position: absolute; top: 50%; transform: translate(-50%, -50%); margin-top: -100px }
.scroll-down-wrapper { position: absolute; top: 50%; transform: translate(-50%, -50%); margin-top: 20px; text-transform: uppercase; animation: scrollDown 2s infinite; mix-blend-mode: exclusion }
section { position: fixed; top: 0; clip-path: circle(0px at center center) }
.innerText { position: fixed; top: 50%; transform: translateY(-50%) }
.text { position: fixed; top: 50%; transform: translateY(-50%) }
.content { position: relative; margin-top: 200vh; -webkit-box-shadow: 0px -30px 50px -3px rgba(87, 195, 239, 0.15); box-shadow: 0px -30px 50px -3px rgba(87, 195, 239, 0.15); padding-bottom: 5rem }
.content .image-wrapper { position: relative }
.content span { box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.35); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); position: absolute; top: -10% }
.content img { margin-bottom: 2rem; transition: all 0.3s ease-out }
.content img:hover { box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.35) }
.content p { text-underline-offset: 4px }
.content-row { margin-bottom: 10rem; margin-top: 3rem }
```

```js
addEventListener('scroll', function(){
```

### [Safari clip-path fix](https://codepen.io/GreenSock/pen/VwPxEBm)

made with: clip-path · GSAP

```css
.prompt { position: absolute }
.wrapper { clip-path: url(#clip-path) }
.image { top: 0; background-position: center }
```

```js
gsap.to(".rect", { scaleY: 1, ...defaults })
gsap.to(".image", { yPercent: 0, onUpdate: fixClipPath(".wrapper"), ...defaults })
gsap.to(".rect", { scaleY: 0, ...defaults })
gsap.to(".image", { yPercent: 15, onUpdate: fixClipPath(".wrapper"), ...defaults })
```

### [% round values in inset()](https://codepen.io/thebabydino/pen/vYgRZzb)

made with: clip-path

```css
div { clip-path: inset(80% 0 0 round 8%) }
```

### [Hamburger + clip-path](https://codepen.io/ainalem/pen/OJWQbor)

made with: transition · clip-path

```css
.phone { box-shadow: 0 0.9px 2.2px rgba(0, 0, 0, 0.039), 0 2.2px 5.3px rgba(0, 0, 0, 0.048), 0 4.1px 10px rgba(0, 0, 0, 0.052), 0 7.4px 17.9px rgba(0, 0, 0, 0.057), 0 13.8px 33.4px rgba(0, 0, 0, 0.067), 0 33px 80px rgba(0, 0, 0,  }
.image { position: absolute }
.menu { clip-path: polygon(81.05% 9.1%, 92% 9.1%, 92% 10.1%, 81.05% 10.1%); position: absolute; top: 0; transition: clip-path 400ms cubic-bezier(0.4, 0, 0.2, 1), background-color 400ms cubic-bezier(0.4, 0, 0.2, 1) }
.active .menu { clip-path: polygon(101% -1%, 101% 101%, -1% 101%, -1% -1%) }
.options { margin-top: 60px; transform: scale(0.8); transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1) }
.active .options { transform: scale(1) }
.x { position: absolute; top: 0 }
.top-bars { transition: stroke 400ms cubic-bezier(0.4, 0, 0.2, 1) }
.bar { transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1) }
.active .bar1 { transform: translateY(8.6px) rotate(45deg) }
.active .bar2 { transform: rotate(-45deg) }
.menu-click-area { opacity: 0.3; position: absolute; top: 10px }
```

### [Pure CSS 1 element tile loader (under 15 declarations!)](https://codepen.io/thebabydino/pen/jOyYPBN)

held: fixed a | on hover of a.: a.: filter | made with: position: fixed · @keyframes · transition · :hover · clip-path

```css
#btn--yp { position: fixed; bottom: 1em; filter: grayscale(1) drop-shadow(0 0 1px #e8e0e0); transition: 0.5s }
#btn--yp:before { position: absolute; bottom: 100%; animation: float 1s ease-in-out infinite alternate }
#btn--yp:hover, #btn--yp:focus { filter: grayscale(0) drop-shadow(0 0 1px crimson) }
to { transform: translateY(0.75em) }
.load::before, .load::after { clip-path: inset(0 0 50% 50% round 0.625em); animation: morph 0.375s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate, flip 0.75s steps(1) infinite, rot 3s steps(4) infinite }
.load::after { animation-delay: -1.5s }
to { clip-path: inset(0 0 80% round 0.625em) }
50% { scale: -1 1 }
to { rotate: -1turn }
@keyframes float animates transform
@keyframes morph animates clip-path
@keyframes flip animates scale
```

### [Image clip-path animation](https://codepen.io/BurmesePotato/pen/yLgojma)

made with: @keyframes · clip-path

```css
* { position: relative }
.imgWrapper { animation: img-slide 1s 1s ease-out backwards }
from { clip-path: polygon(0 0, 0 100%, 0 100%, 0 0) }
to { clip-path: polygon(0 0, 0 100%, 100% 100%, 100% 0) }
from { clip-path: polygon(0 0, 100% 100%, 100% 100%, 0 0) }
to { clip-path: polygon(0 0, 0 100%, 100% 100%, 100% 0) }
@keyframes img-slide animates clip-path
@keyframes text-in animates clip-path
```

### [Landscape](https://codepen.io/3in0/pen/WNROZxR)

on scroll: div.: transform+top ×3 | made with: clip-path · custom properties driven by JS

```css
div { position: absolute }
#scene1 { clip-path: polygon( 0% 70%, 10% 60%, 15% 75%, 40% 40%, 60% 80%, 65% 70%, 80% 90%, 100% 60%, 100% 100%, 0% 100% ) }
#scene2 { clip-path: polygon( 0% 80%, 15% 65%, 25% 70%, 50% 80%, 65% 80%, 85% 75%, 100% 100%, 0% 100% ) }
#scene3 { clip-path: polygon( 0% 90%, 40% 95%, 80% 88%, 100% 100%, 0% 100% ) }
#scene1 { transform: translateY(calc(var(--scrollPos, 0) * 0.9)) }
#scene2 { transform: translateY(calc(var(--scrollPos, 0) * 0.5)) }
#scene3 { transform: translateY(calc(var(--scrollPos, 0) * 0.25)) }
```

```js
style.setProperty('--scrollPos', scrollPos + 'px')
```

### [Untitled](https://codepen.io/charalambos-sarantakis/pen/GRrEqyy)

made with: @keyframes · :hover · clip-path · 3D (perspective / preserve-3d)

```css
10% { transform: rotate3d(0, 0, 0, 0) }
50% { transform: rotate3d(3, 29, 0, 80deg) }
80% { transform: rotate3d(0, 0, 0, 0) }
10% { transform: rotate3d(0, 0, 0, 0) }
50% { transform: rotate3d(3, 29, 0, 80deg) }
80% { transform: rotate3d(0, 0, 0, 0) }
.grid { transform: rotate3d(0, 0, 0, 0); box-shadow: -10px 5px 20px rgba(0, 0, 0, 0.5) }
.grid .grid-item { transform: rotateY(90deg) }
.grid .grid-item:nth-child(1) { transform: translate3d(100px,0, 40px)rotateY(110deg) }
.grid .grid-item:nth-child(2) { transform:translate3d(0, 100px, 40px)rotateX(110deg) }
.grid .grid-item:nth-child(3) { transform:translate3d(0, -100px, 40px)rotateX(250deg) }
#toggle, #toggle-animation { text-transform: uppercase; position: absolute; top: 5px }
```

### [Responsive pop-out effect](https://codepen.io/thebabydino/pen/BapRjxo)

on scroll: figure.: transform+top, img.: transform+top | made with: transition · :hover · clip-path

```css
figure { padding-top: 5%; transform: scale(calc(1 - .1*var(--not-hov))) }
figure:nth-of-type(2) { clip-path: inset(0 round 0 0 clamp(4em, 20vw, 15em) clamp(4em, 20vw, 15em)) }
figure, figure img { transition: transform 0.2s ease-in-out }
img { transform: translatey(calc((1 - var(--hov))*10%)) scale(calc(1.25 + .05*var(--hov))) }
```

### [Wrapping text around images](https://codepen.io/Nordlicht2297/pen/LYxWMpr)

made with: clip-path

```css
h1, h2 { margin-bottom: 1em }
.section { margin-bottom: 10rem }
.section-two img { clip-path: circle() }
.section-three img { clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%) }
.section-four img { clip-path: circle() }
```

### [Clip-path animation using SVG masks](https://codepen.io/marksunming/pen/vYgyvGY)

made with: transition · clip-path · GSAP

```css
.slider { position: relative }
.slider__super-wrapper { position: absolute; top: 0 }
.slider__super-wrapper.slider__1 { clip-path: url(#myPath1) }
.slider__super-wrapper.slider__2 { clip-path: url(#myPath2) }
.slider__super-wrapper.slider__3 { clip-path: url(#myPath3) }
.slider__wrap { position: absolute; top: 0; transform: translateX(0%) }
.slider__wrap.a { transform: translateX(-100%) }
.slider__current-slide, .slider__new-slide { position: absolute; background-position: center center }
.slider__new-slide { transform: translateX(100%) }
```

```js
gsap.timeline()
```

### [Icon Reveal using clip-path()](https://codepen.io/janegca/pen/QWdGgaE)

made with: transition · :hover · clip-path

```css
.info { box-shadow: 0.1em 0.1em 0.4em #848484; transition: all 0.5s linear; clip-path: circle(.9em at 2em 2em) }
.info:hover { clip-path: circle(20em at 2em 2em) }
.info-description { margin-top: 0.5em }
```

### [Card Hover using clip-path()](https://codepen.io/janegca/pen/LYxbyOy)

on hover of div.card: div.card-footer: clip-path | made with: transition · :hover · clip-path

```css
.card { position: relative }
.card-footer { position: absolute; bottom: 0; clip-path: inset(100% 0% 0%); transition: all 0.5s ease-in-out }
.footer-text { padding-top: 1em }
.card:hover .card-footer { clip-path: inset(0% 0% 0%) }
```

### [MorphSVG gsap practice](https://codepen.io/BurmesePotato/pen/qBRNGyx)

made with: clip-path · GSAP

```css
img { clip-path: url(#clip) }
svg { position: absolute; top: 0 }
#clip { transform: scale(0.000694444, 0.001388888) }
main { position: relative }
```

```js
gsap.timeline({repeat: -1, yoyo: true})
```

### [Clip Path Example (Banner Arrows)](https://codepen.io/Kayakkavita/pen/eYgNyzg)

made with: clip-path

```css
.banner { position: relative }
.banner:after { position: absolute; bottom: 0px; -webkit-clip-path: url("#clip-path"); clip-path: url("#clip-path") }
```

### [cutout](https://codepen.io/thebabydino/pen/MWJYPEz)

made with: transition · :hover · clip-path · mask

```css
button { position: relative }
button::before, button::after { position: absolute; top: 0; bottom: 0; transition: transform .3s }
button::before { transition-property: clip-path }
button::after { transform: translatey(calc(-4px + var(--sel)*-4px)) }
button:nth-of-type(1)::before { clip-path: polygon(var(--tri), 100% 0, 100% 100%, 0 100%, 0 0) }
button:nth-of-type(1)::after { clip-path: polygon(var(--tri)) }
button:nth-of-type(2)::before, button:nth-of-type(2)::after { --mask: conic-gradient(from -30deg at 2em calc(1em + var(--sel)*var(--not-i)*-4px), RGBA(0, 0, 0, var(--i)) 0% 60deg, RGBA(0, 0, 0, var(--not-i)) 0%); -webkit-mask: var(--mask); mask: var(--mask) }
```

### [Clip images using css and svg](https://codepen.io/leadArt/pen/RwoXBad)

made with: clip-path

```css
.img { clip-path: url(#clip) }
```

### [CSS Fractured Text Animation](https://codepen.io/bousahla-mounir/pen/NWbZZEg)

on scroll: li.: transform+top ×8 | on hover of li.: li.: transform ×7, li.: transform+top | made with: @keyframes · clip-path

```css
ul { position: absolute; top: 50%; transform: translate(0,-50%) }
ul li { position: relative }
ul li:nth-child(2n) { animation: animate1 2s infinite linear }
ul li:nth-child(2n+1) { animation: animate2 2s infinite linear }
ul li::before,ul li::after { position: absolute; top: 0 }
ul li::before { -webkit-clip-path : polygon(0 0 , 70% 0 , 30% 100% , 0 100%); clip-path : polygon(0 0 , 70% 0 , 30% 100% , 0 100%); transform: translateY(0) }
ul li::after { -webkit-clip-path : polygon(70% 0 , 100% 0 , 100% 100% , 30% 100%); clip-path : polygon(70% 0 , 100% 0 , 100% 100% , 30% 100%); transform: translateY(8px) }
0% { transform: rotate(25deg) }
50% { transform: rotate(-25deg) }
100% { transform: rotate(25deg) }
0% { transform: rotate(-25deg) }
50% { transform: rotate(25deg) }
```

### [Split Word On Hover Animation](https://codepen.io/bousahla-mounir/pen/OJbeYWr)

made with: @keyframes · transition · clip-path

```css
.container { position: absolute; top: 50%; transform: translate(0,-50%) }
.container h1 { position: relative; text-transform: uppercase }
.container h1::before,.container h1::after { position: absolute; top: 0; transition: .5s }
.container h1::before { -webkit-clip-path : polygon(0 0 , 55% 0 ,35% 100% , 0 100%); clip-path : polygon(0 0 , 55% 0 ,35% 100% , 0 100%); animation: animateBefore 2s infinite linear }
.container h1::after { -webkit-clip-path : polygon(55% 0 , 100% 0 , 100% 100% , 35% 100%); clip-path : polygon(55% 0 , 100% 0 , 100% 100% , 35% 100%); animation: animateAfter 2s infinite linear }
0% { transform: rotate(0) }
50% { transform: rotate(-5deg) }
100% { transform: rotate(0) }
0% { transform: translateY(0) rotate(0) }
50% { transform: translateY(20px) rotate(5deg) }
100% { transform: translateY(0) rotate(0) }
@keyframes animateBefore animates transform
```

### [Split Word](https://codepen.io/bousahla-mounir/pen/gOLNyqe)

made with: transition · clip-path

```css
.container { position: absolute; top: 50%; transform: translate(0,-50%) }
.container h1 { position: relative; text-transform: uppercase }
.container h1::before,.container h1::after { position: absolute; top: 0; transition: .5s }
.container h1::before { -webkit-clip-path : polygon(0 0 , 55% 0 ,35% 100% , 0 100%); clip-path : polygon(0 0 , 55% 0 ,35% 100% , 0 100%) }
.container h1::after { -webkit-clip-path : polygon(55% 0 , 100% 0 , 100% 100% , 35% 100%); clip-path : polygon(55% 0 , 100% 0 , 100% 100% , 35% 100%) }
```

### [clip-path letters](https://codepen.io/stoumann/pen/zYoVLBj)

made with: clip-path

```css
.a { clip-path: polygon(40.00% 0.00%,60.00% 0.00%,100.00% 100.00%,80.00% 100.00%,50.00% 20.00%,37.00% 55.00%,63.00% 55.00%,71.00% 75.00%,31.00% 75.00%,20.00% 100.00%,0.00% 100.00%) }
.d { clip-path: polygon(0% 0%,65.00% 0.00%,90.00% 30.00%,90.00% 70.00%,65.00% 100.00%,20.00% 100.00%,20.00% 80.00%,55.00% 80.00%,70.00% 65.00%,70.00% 35.00%,55.00% 20.00%,20.00% 20.00%,20.00% 100.00%,0% 100%) }
.m { clip-path: polygon(20.00% 0.00%,40.00% 0.00%,52.00% 55.00%,70.00% 0.00%,90.00% 0.00%,100.00% 100.00%,80.00% 100.00%,75.00% 45.00%,60.00% 100.00%,40.00% 100.00%,30.00% 45.00%,20.00% 100.00%,0.00% 100.00%) }
.s { clip-path: polygon(10% 0%,90.00% 0.00%,100.00% 20.00%,20.00% 20.00%,20.00% 40.00%,100.00% 40.00%,100.00% 85.00%,90.00% 100.00%,10.00% 100.00%,0.00% 80.00%,80.00% 80.00%,80.00% 60.00%,0.00% 60.00%,0% 15%) }
```

### [1 element pure CSS ❄️](https://codepen.io/thebabydino/pen/ZEBPQpO)

held: fixed a | on hover of a.: a.: filter | made with: position: fixed · @keyframes · transition · :hover · clip-path · mix-blend-mode

```css
#btn--yp { position: fixed; bottom: 1em; filter: grayscale(1) drop-shadow(0 0 1px #e8e0e0); transition: .5s }
#btn--yp:before { position: absolute; bottom: 100%; animation: float 1s ease-in-out infinite alternate }
#btn--yp:hover, #btn--yp:focus { filter: grayscale(0) drop-shadow(0 0 1px crimson) }
to { transform: translateY(0.75em) }
body::after { mix-blend-mode: lighten }
.❄️ { filter: blur(7px) contrast(21); mix-blend-mode: darken }
.❄️::before { clip-path: polygon(47.25% 45.23686%, 47.25% 35.98364%, 29.81044% 17.67739%, 30.0979% 14.94245%, 32.83283% 14.655%, 48.2125% 30.52915%, 47.86285% 8.42936%, 50% 6.69873%, 52.13715% 8.42936%, 51.7875% 30.52915%, 67.16717% 1 }
@keyframes float animates transform
```

### [1 element pure CSS 🌞](https://codepen.io/thebabydino/pen/PobVZrZ)

held: fixed a | on scroll: div.🌞: transform+top | on hover of a.: div.🌞: transform+top, a.: filter | made with: position: fixed · @keyframes · transition · :hover · clip-path · mask

```css
#btn--yp { position: fixed; bottom: 1em; filter: grayscale(1) drop-shadow(0 0 1px #e8e0e0); transition: .5s }
#btn--yp:before { position: absolute; bottom: 100%; animation: float 1s ease-in-out infinite alternate }
#btn--yp:hover, #btn--yp:focus { filter: grayscale(0) drop-shadow(0 0 1px crimson) }
to { transform: translateY(0.75em) }
.🌞 { clip-path: polygon(50% 10.97561%, 59.75452% 0.96074%, 64.93399% 13.94616%, 77.77851% 8.42652%, 77.59441% 22.40559%, 91.57348% 22.22149%, 86.05384% 35.06601%, 99.03926% 40.24548%, 89.02439% 50%, 99.03926% 59.75452%, 86.05 }
to { transform: rotate(1turn) }
@keyframes float animates transform
@keyframes r animates transform
```

### [Changing Logo Background Based on Section Background Prototype](https://codepen.io/itsmattsoria/pen/mdOaGwZ)

held: fixed div.logo, fixed button | on scroll: div.logo-background: transform+top | made with: position: fixed · clip-path · scroll listener

```css
.logo { top: 60px; position: fixed; -webkit-clip-path: url(#logo-mask); clip-path: url(#logo-mask) }
.logo.-reveal { -webkit-clip-path: none; clip-path: none }
.logo .logo-background { top: -60px; position: absolute; will-change: transform }
.logo-mask { position: absolute }
section h1 { margin-top: 0 }
button { top: 60px; position: fixed; box-shadow: 0 2px 20px rgba(0, 0, 0, 0.25) }
button:focus { box-shadow: 2px 2px 0 #1262ba, -2px -2px 0 #1262ba, -2px 2px 0 #1262ba, 2px -2px 0 #1262ba }
```

```js
addEventListener("scroll", function (e) {
```

### [triangle shape outside](https://codepen.io/opeala/pen/ZEBmQLx)

on scroll: div.bg-triangle: transform+top, div.profile-pic: transform+top, svg.[object: transform+top | made with: transition · :hover · clip-path

```css
.container .profile-poly { padding-top: 50%; position: relative; margin-bottom: 5% }
.container .profile-poly * { transition: 0.5s ease-in-out }
.container .profile-poly .bg-triangle { position: absolute; top: 0; bottom: 0; clip-path: polygon(90% 0, 0 60%, 100% 100%); transform: rotate(15deg) }
.container .profile-poly .profile-pic { background: no-repeat left top; position: absolute; top: 0; bottom: 0; clip-path: polygon(90% 0, 0 60%, 100% 100%) }
.container .profile-poly .border-triangle { position: absolute; top: 0; bottom: 0; transform: rotate(42deg) }
.container .profile-poly:hover .bg-triangle { transform: rotate(13deg) }
.container .profile-poly:hover .profile-pic { transform: rotate(2deg) }
.container .profile-poly:hover .border-triangle { transform: rotate(34deg) }
```

### [Pure CSS clip transition](https://codepen.io/agrimsrud/pen/OJboodz)

on scroll: label.: color+top, svg.[object: color+top, use.[object: color+top | made with: transition · :hover · clip-path

```css
nav { position: relative; filter: drop-shadow(0 -2px 2px rgba(0, 0, 0, 0.15)) drop-shadow(0 5px 15px rgba(0, 1, 0, 0.1)) }
nav::after { position: absolute; bottom: 20px; transform: translateX(-50%) }
label { position: relative; text-transform: uppercase; transition: color 0.2s, top 0.2s }
input[type=radio]:is(:checked, :hover) + label { top: 2px }
.indicator { position: absolute; top: calc(var(--clip-depth) * -1); transition: -webkit-clip-path 0.2s; transition: clip-path 0.2s; transition: clip-path 0.2s, -webkit-clip-path 0.2s; -webkit-clip-path: polygon(0 0, var(--clip-start) }
```

### [Beautiful Clip Path](https://codepen.io/sheryar-butt/pen/WNoyXyd)

made with: transition · :hover · clip-path

```css
.inner { clip-path: circle(10% at 90% 20%); transition: all .5s ease-in-out; position: relative }
.inner:hover { clip-path: circle(100%); transition: all .5s ease-in-out }
span { position: absolute }
```

### [Tile closing effect](https://codepen.io/thebabydino/pen/bGBLXEy)

held: fixed a | made with: position: fixed · @keyframes · transition · :hover · clip-path · mix-blend-mode

```css
#btn--yp { position: fixed; bottom: 1em; filter: grayscale(1) drop-shadow(0 0 1px #e8e0e0); transition: 0.5s }
#btn--yp:before { position: absolute; bottom: 100%; animation: float 1s ease-in-out infinite alternate }
#btn--yp:hover, #btn--yp:focus { filter: grayscale(0) drop-shadow(0 0 1px crimson) }
to { transform: translateY(0.75em) }
article { position: relative; clip-path: inset(1px round 0.5rem); mix-blend-mode: difference }
article:after { position: absolute; top: 0; bottom: 0; clip-path: inset(0 0 12.5rem 12.5rem round 0 0.5rem); transition: clip-path 0.25s cubic-bezier(0.35, 1.57, 0.65, 1) }
article.hl::after { clip-path: inset(0 0 10.5rem 10.5rem round 0 0.5rem) }
article.cl::after { clip-path: inset(0 round 0 0.5rem); transition: clip-path 0.5s cubic-bezier(0.32, 1, 0.68, 1) }
button { position: absolute; top: 0; mix-blend-mode: difference }
button::before, button::after { position: absolute; top: calc(50% - .5*6px); transform: rotate(calc((2*var(--j) - 1)*45deg)) scale(0.65); transition: background-color 0.25s cubic-bezier(0.32, 1, 0.68, 1) }
@keyframes float animates transform
```

### [Mask circle follow mouse](https://codepen.io/natjo/pen/qBqpJVB)

on scroll: video.mask: clip-path | made with: nothing recognised — read the code

```css
.hero { position: absolute; top: 0 }
.circle { position: absolute; top: 0 }
```

### [SVG half circle clip-path](https://codepen.io/supermariobrother/pen/poNdMjR)

made with: clip-path

### [Glitch Text Effect](https://codepen.io/edalgrin/pen/rNWYEbw)

made with: @keyframes · clip-path

```css
.text-glitch { position: relative; animation: glitch 0.2s infinite }
.text-glitch:before, .text-glitch:after { position: absolute; top: 0 }
.text-glitch:before { clip-path: polygon(0% 0%, 100% 0%, 100% var(--text-glitch-y1), 0% var(--text-glitch-y1), 0% var(--text-glitch-y2), 100% var(--text-glitch-y2), 100% var(--text-glitch-y3), 0% var(--text-glitch-y3), 0% var(--text-glitch-y4 }
0%, 10% { transform: translateX(5px) }
11% { transform: none }
.text-glitch:after { clip-path: polygon(0% var(--text-glitch-y1), 100% var(--text-glitch-y1), 100% var(--text-glitch-y2), 0% var(--text-glitch-y2), 0% var(--text-glitch-y3), 100% var(--text-glitch-y3), 100% var(--text-glitch-y4), 0% var(--te }
0%, 10% { transform: translateX(5px) }
11% { transform: none }
@keyframes glitch animates --text-glitch-y1, --text-glitch-y2, --text-glitch-y3, --text-glitch-y4
@keyframes glitch-right animates transform, text-shadow
@keyframes glitch-left animates transform, text-shadow
```

### [Clip-path Slider](https://codepen.io/Priyamaheshwari/pen/MWbOJqJ)

held: fixed div.dwf | made with: position: fixed · clip-path

```css
*, *:before, *:after { position: relative; transition-property: clip-path, opacity }
.slider { position: relative }
.slider .status { position: absolute; bottom: 10px }
.slider img { object-position: center 80% }
.slider .image { opacity: 0 }
.slider .image img { clip-path: circle(50px at 5vw 50%) }
.slider .image[data-active] { opacity: 1 }
.slider .image[data-active] img { clip-path: circle(100vmax at 50% 50%) }
.slider .image[data-active] ~ .image { opacity: 0 }
.slider .image[data-active] ~ .image img { clip-path: circle(50px at 95vw 50%) }
.slider svg { position: absolute; top: 50%; margin-top: -15px }
.dwf { position: fixed; bottom: 4px }
```

### [Folding book page](https://codepen.io/piascwal/pen/ExNmxQz)

on scroll: div.page: transform+background | made with: transition · :hover · clip-path · 3D (perspective / preserve-3d)

```css
body { padding-top: 5% }
.book { position: relative; perspective: 1000px }
.book .hidden-page .page { position: absolute; top: 0; bottom: 0 }
.book .hidden-page .page.left-page { clip-path: polygon(0 0, 51% 0, 51% 100%, 0 100%); -webkit-clip-path: polygon(0 0, 51% 0, 51% 100%, 0 100%) }
.book .hidden-page .page.right-page { clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%); -webkit-clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%); transition: transform 0.5s ease-in-out, background-color 0.4s ease-in-out }
.book .hidden-page .page.right-page:hover { transform: rotateY(-60deg) }
```

### [Horizontal Dividers](https://codepen.io/nikki-peel/pen/zYoZXgw)

made with: clip-path

```css
h3 { margin-bottom: 2rem }
span:nth-of-type(1) { box-shadow: 0 0 12px 2px #F87171; margin-top: -2px }
span:nth-of-type(2) { opacity: .8; box-shadow: 0 0 12px 2px #FECACA; margin-top: -2px }
span:nth-of-type(3) { opacity: .6; box-shadow: inset 0 0 12px 2px #FEF2F2; margin-top: -2px }
#section2 { transform: skew(0, -2deg) }
#section2 h3, #section2 p { transform: skew(0, 2deg) }
#section3 { margin-top: -5%; padding-top: 8%; padding-bottom: 8% }
svg { margin-top: -4rem }
#section4 { margin-top: -10%; padding-top: 10%; padding-bottom: 12% }
.footer-bg { position: relative; margin-top: -18%; clip-path: polygon(0% 65%, 1% 64.95%, 2% 64.8%, 3% 64.6%, 4% 64.3%, 5% 63.9%, 6% 63.45%, 7% 62.9%, 8% 62.25%, 9% 61.55%, 10% 60.8%, 11% 59.95%, 12% 59.05%, 13% 58.1%, 14% 57.1%, 15%  }
footer { margin-top: -5px }
#section3 { margin-top: -8%; padding-bottom: 20% }
```

### [responsive chinese traditional paper cutting](https://codepen.io/ycw/pen/JjbWxyZ)

made with: clip-path

```css
ul li { -webkit-clip-path: url(#foo); clip-path: url(#foo) }
```

### [Tooltip arrow with handle of background-image using clip-path](https://codepen.io/onyphlax/pen/OJbpbGR)

made with: clip-path

```css
.tooltip--top { padding-bottom: calc(calc(10px + 1px) + 2px); clip-path: polygon(0 0, 100% 0, 100% calc(100% - calc(10px + 1px)), calc(calc(25px + 2px) + calc(10px + 1px)) calc(100% - calc(10px + 1px)), calc(25px + 2px) 100%, calc(calc( }
.tooltip--bottom { padding-top: calc(calc(10px + 1px) + 2px); clip-path: polygon(0 calc(10px + 1px), calc(calc(25px + 2px) - calc(10px + 1px)) calc(10px + 1px), calc(25px + 2px) 0, calc(calc(25px + 2px) + calc(10px + 1px)) calc(10px + 1px) }
.tooltip--left { clip-path: polygon(0 0, calc(100% - calc(10px + 1px)) 0, calc(100% - calc(10px + 1px)) calc(calc(25px + 2px) - calc(10px + 1px)), 100% calc(25px + 2px), calc(100% - calc(10px + 1px)) calc(calc(25px + 2px) + calc(10px + 1 }
.tooltip--right { clip-path: polygon(calc(10px + 1px) 0, 100% 0, 100% 100%, calc(10px + 1px) 100%, calc(10px + 1px) calc(calc(25px + 2px) - calc(10px + 1px)), 0 calc(25px + 2px), calc(10px + 1px) calc(calc(25px + 2px) + calc(10px + 1px))) }
.tooltip__container { background-position: center }
.tooltip--top .tooltip__container { background-position: center calc(50% - calc(10px + 1px)/2); padding-bottom: 10px; margin-bottom: -10px; clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(25px + 10px) calc(100% - 10px), 25px 100%, calc(25px -  }
.tooltip--bottom .tooltip__container { background-position: center calc(50% + calc(10px + 1px)/2); padding-top: 10px; margin-top: -10px; clip-path: polygon(0 10px, calc(25px - 10px) 10px, 25px 0, calc(25px + 10px) 10px, 100% 10px, 100% 100%, 0 100%) }
.tooltip--left .tooltip__container { background-position: calc(50% - calc(10px + 1px)/2) center; clip-path: polygon(0 0, calc(100% - 10px) 0, calc(100% - 10px) calc(25px - 10px), 100% 25px, calc(100% - 10px) calc(25px + 10px), calc(100% - 10px) 100%, 0 100% }
.tooltip--right .tooltip__container { background-position: calc(50% + calc(10px + 1px)/2) center; clip-path: polygon(10px 0, 100% 0, 100% 100%, 10px 100%, 10px calc(25px - 10px), 0 25px, 10px calc(25px + 10px)) }
```

### [Clipper](https://codepen.io/clausgehrke/pen/qBqRzva)

on hover of img.img: img.img--pos-abs: transform+opacity+clip-path+top | made with: :hover · clip-path

```css
.clip { position: relative }
.clip .img--pos-abs, .clip .img { -o-object-position: 50% 50%; object-position: 50% 50% }
.clip .img--pos-abs { position: absolute; top: 0; opacity: 0 }
.clip:hover .img--pos-abs { opacity: 1; -webkit-clip-path: circle(20% at var(--x) var(--y)); clip-path: circle(20% at var(--x) var(--y)); transform: scale(1.2) }
```

### [Pointer Animated Clip Path](https://codepen.io/Zorlimar/pen/PobWLwp)

made with: transition · clip-path · pointer / mouse tracking · requestAnimationFrame

```css
.wrapper { position: relative; -webkit-clip-path: circle(2rem at 50% 50%); clip-path: circle(2rem at 50% 50%) }
.pointer { position: absolute; top: calc(50% - 2rem); transition: transform 225ms ease-out }
.hint { position: absolute; top: 0.5rem }
```

```js
requestAnimationFrame(animate)
addEventListener('pointermove', ({ x, y }) => {
```

### [iso-cube](https://codepen.io/syndicatefx/pen/qBqRoQa)

made with: clip-path

```css
.iso-cube { clip-path: polygon( 7% 25%, 50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75% ) }
```

### [Clip-path hover animation](https://codepen.io/nikki-peel/pen/MWbJrxJ)

on hover of div.card: img.: clip-path | made with: transition · :hover · clip-path

```css
.card { position: relative }
.content { position: absolute; top: 50%; transform: translate(-50%, -50%) }
h2 { margin-bottom: 20px; text-transform: capitalize }
p { margin-bottom: 30px }
a { transition: .5s; text-transform: capitalize }
img { position: absolute; top: 0; transition: clip-path 0.5s; -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%) }
img:hover { -webkit-clip-path:polygon(0 0, 100% 0, 100% 100%, 100% 0); clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 0) }
```

### [CSS: clip-path Example](https://codepen.io/OTomer/pen/MWbbbNL)

held: fixed a | made with: clip-path

```css
div { clip-path: polygon(100% 0, 100% 48%, 45% 100%, 0 100%, 27% 29%); position: absolute }
```

### [Clip path animations](https://codepen.io/jjmartucci/pen/ZEBpNLM)

on hover of img.clip: img.clip: transform+clip-path+filter+top | made with: transition · :hover · clip-path

```css
.clip { -webkit-clip-path: path("M194.671,43.508c4.44,-24.213 27.709,-43.508 55.329,-43.508c27.62,0 50.889,19.295 55.329,43.508c15.952,-18.749 45.751,-23.824 69.671,-10.014c23.92,13.81 34.424,42.154 26.163,65.343c23.189,-8.261 5 }
.clip:hover { -webkit-clip-path: path("M185.295,8.519c21.104,-5.655 42.857,-8.519 64.705,-8.519c21.848,0 43.601,2.864 64.705,8.519c21.103,5.654 41.374,14.051 60.295,24.975c18.921,10.924 36.328,24.281 51.777,39.729c15.448,15.449 28.805 }
```

### [Configurable Polygon Clip Path](https://codepen.io/jh3y/pen/RwoGvZR)

on hover of button.polygon-action: button.polygon-action: background | made with: position: fixed · transition · :hover · clip-path · pointer / mouse tracking

```css
button[disabled], button[disabled]:hover { opacity: 0.25 }
.clip-path-generator__container { position: relative }
.clip-path-generator__clipped { position: absolute; top: 0; -webkit-clip-path: var(--path); clip-path: var(--path) }
.clip-path-node { opacity: 0.75; position: absolute; top: calc(var(--y) * 1px); transform: translate(-50%, -50%); transition: opacity 0.15s }
.clip-path-node:hover { opacity: 1 }
.clip-path-node:after { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.clip-path-node--removing { opacity: 1 }
.clip-path-node__remove { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.clip-path__input { position: fixed }
```

```js
addEventListener('mousemove', move)
```

### [Clip-path Framed SVG Animation](https://codepen.io/cmlohr/pen/bGBwqgV)

held: fixed div.container, fixed div.outer-frame | on scroll: rect.[object: transform+top ×11, rect.[object: transform ×7 | on hover of a.: rect.[object: transform+top ×13, rect.[object: transform ×6 | made with: position: fixed · :hover · clip-path · requestAnimationFrame

```css
.container { position: fixed; top: 0; bottom: 0; clip-path: circle(51% at 50% 50%) }
#dancing-squares { position: absolute; top: -5em; bottom: 0 }
.embelishment { position: absolute; top: 0; bottom: 0; box-shadow: 0 0 12px #191919 }
.embelishment-two { position: absolute; top: 0; bottom: 0; box-shadow: 21px 21px 82px #191919, -21px -21px 82px #ffffff }
.frame { position: absolute; top: 0; bottom: 0; box-shadow: inset 12px 12px 12px 12px #191919 }
.outer-frame { position: inherit; top: 0; bottom: 0; box-shadow: inset 2px 5px 5px 5px #191919 }
.twitter-btn { position: absolute; bottom: 0; border-bottom: none }
.in-btn { position: absolute; bottom: 0; border-bottom: none }
.fa-twitter { position: absolute; top: .5em; bottom: 0 }
.fa-linkedin-in { position: absolute; top: .55em; bottom: 0 }
```

### [Dot navigation with clever CSS, Houdini magic 🎩🐇 and a sprinkle of JS ✨](https://codepen.io/thebabydino/pen/abBObje)

held: fixed a | on hover of a.: a.: filter | made with: position: fixed · @keyframes · transition · :hover · clip-path · custom properties driven by JS

```css
#btn--yp { position: fixed; bottom: 1em; filter: grayscale(1) drop-shadow(0 0 1px #e8e0e0); transition: 0.5s }
#btn--yp:before { position: absolute; bottom: 100%; animation: float 1s ease-in-out infinite alternate }
#btn--yp:hover, #btn--yp:focus { filter: grayscale(0) drop-shadow(0 0 1px crimson) }
to { transform: translateY(0.75em) }
form { filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.2)) }
form:nth-of-type(1)::after { transform: translate(calc(var(--k)*(1.875em + 1.875em))); transition: transform 0.3s cubic-bezier(0.35, 1.57, 0.65, 1) }
form:nth-of-type(2)::after { clip-path: inset(0.625em var(--or, 0.625em) 0.625em var(--ol, 0.625em) round 1.875em); transition: --or 0.15s calc(var(--j)*0.15s), --ol 0.15s calc(var(--not-j)*0.15s) }
input { opacity: 0 }
@keyframes float animates transform
```

```js
style.setProperty('--p', +_P.style.getPropertyValue('--k'))
style.setProperty('--k', +_T.value)
```

### [Wrap me in your arms with Houdini magic 🎩🐇✨ (Chromium only animation)](https://codepen.io/thebabydino/pen/ExNaBbJ)

held: fixed a | on scroll: div.dot: transform+top ×144 | on hover of a.: div.dot: transform+top ×143, div.dot: transform, a.: filter | made with: position: fixed · @keyframes · transition · :hover · clip-path · 3D (perspective / preserve-3d)

```css
#btn--yp { position: fixed; bottom: 1em; filter: grayscale(1) drop-shadow(0 0 1px #e8e0e0); transition: .5s }
#btn--yp:before { position: absolute; bottom: 100%; animation: float 1s ease-in-out infinite alternate }
#btn--yp:hover, #btn--yp:focus { filter: grayscale(0) drop-shadow(0 0 1px crimson) }
to { transform: translateY(0.75em) }
body { perspective: 25em }
.dot { transform: rotatex(var(--ax)) rotatey(var(--ay)) rotatez(var(--az)) translate(calc(1.5*0.5em/var(--tan))) rotatez(calc(-1*var(--az))) rotatey(calc(-1*var(--ay))) rotatex(calc(-1*var(--ax))) scale(var(--f, 1)); -webkit-cl }
@keyframes float animates transform
@keyframes ax animates --ax
@keyframes k animates --k
@keyframes f animates --f
```

### [CSS - Clip Path Property](https://codepen.io/joseacasado/pen/eYBmNrM)

made with: transition · :hover · clip-path

```css
span { transition: color .5s; position: relative }
.container article { clip-path: circle(10% at 90% 20%); transition: all .5s ease-in-out }
.container article:hover { clip-path: circle(75%) }
```

### [Art of Noise album cover](https://codepen.io/vcurd/pen/GRNRKZg)

made with: clip-path

```css
.mary { position: absolute; top:0; filter: saturate(90%) hue-rotate(10deg); opacity: 0.8 }
.sea-sky { -webkit-clip-path: var(--clip-path); clip-path: var(--clip-path); opacity: 0.9; position: relative; filter: saturate(90%) hue-rotate(350deg) }
.image-wrapper { --clip-path: polygon( 0% 0%, 0% 14.2857%, 14.2857% 14.2857%, 14.2857% 0%, 28.5714% 0%, 28.5714% 14.2857%, 42.8571% 14.2857%, 42.8571% 0%, 57.1428% 0%, 57.1428% 14.2857%, 71.4286% 14.2857%, 71.4286% 0%, 85.7143% 0%, 85.71 }
```

### [Stars](https://codepen.io/martine-dowden/pen/yLaGQgj)

made with: clip-path

```css
.shape { -webkit-clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); position: relative }
.shape:nth-of-type(1) { transform: rotate(-25deg); filter: saturate(15%) }
.shape:nth-of-type(2) { filter: opacity(.75); transform: translate(0, -50px) }
.shape:nth-of-type(3) { transform: rotate(25deg); opacity: .33; top: -200px }
```

### [Beveled Overlay Images](https://codepen.io/gdw96/pen/rNMoKKJ)

made with: clip-path

```css
.img-shape { position: relative }
.img-shape::before { padding-top: 100% }
.img-shape:nth-child(2n-1) { -webkit-clip-path: polygon(0% 0, 100% 0, 100% 50%, 0 100%); clip-path: polygon(0% 0, 100% 0, 100% 50%, 0 100%) }
.img-shape:nth-child(2n-1) img { -o-object-position: bottom; object-position: bottom }
.img-shape:nth-child(2n) { margin-top: -47%; -webkit-clip-path: polygon(0 50%, 100% 0, 100% 100%, 0 100%); clip-path: polygon(0 50%, 100% 0, 100% 100%, 0 100%) }
.img-shape:nth-child(2n) img { -o-object-position: top; object-position: top }
.img-shape img { position: absolute; top: 0 }
```

### [clip-path & shape-outside like each others.](https://codepen.io/gc-nomade/pen/QWKzroW)

made with: clip-path

```css
body, section.hero { filter:drop-shadow(0 0 1px white) }
.div1 { clip-path: polygon(0% 0%, 0% 66%, 0% 66%, 80% 0%, 79% 0%) }
.div2 { clip-path: polygon(81% 0%, 45% 30%, 96% 100%, 100% 100%, 100% 0%) }
.div3 { clip-path: polygon(0% 67%, 44.25% 30.75%, 95% 100%, 0 100%) }
```

### [Unfolded](https://codepen.io/shellbryson/pen/PoGyvVp)

made with: @keyframes · transition · clip-path

```css
.wrapper span { position: absolute; transition: 500ms }
.wrapper span.fold1 { clip-path: polygon(0 0, 100% 0, 100% 0, 0 100%) }
.wrapper span.fold2 { clip-path: polygon(100% 100%, 100% 0, 100% 0, 0 100%); animation: folds 5s infinite }
0% { clip-path: polygon(51% 51%, 100% 0, 100% 0, 0 100%) }
70% { clip-path: polygon(51% 51%, 100% 0, 100% 0, 0 100%) }
100% { clip-path: polygon(100% 100%, 100% 0, 100% 0, 0 100%) }
@keyframes folds animates color, clip-path
```

### [Clip-Path Checkbox Animation](https://codepen.io/shshaw/pen/zYKJGgG)

made with: transition · clip-path

```css
.checkbox { position: relative }
.checkbox > input { opacity: 0; position: absolute }
.check { position: absolute; top: 0; bottom: 0; -webkit-clip-path: polygon(0 0, 50% 0, 100% 0, 100% 100%, 50% 100%, 0 100%); clip-path: polygon(0 0, 50% 0, 100% 0, 100% 100%, 50% 100%, 0 100%); transition: 0.4s cubic-bezier(0.8,  }
input:checked + .check { -webkit-clip-path: polygon(28% 38%, 41% 53%, 75% 24%, 86% 38%, 40% 78%, 15% 50%); clip-path: polygon(28% 38%, 41% 53%, 75% 24%, 86% 38%, 40% 78%, 15% 50%) }
```

### [mosaic with hue-rotation on hover](https://codepen.io/davide_ravasi/pen/QWKraKO)

on scroll: div.container: filter, div.hexagon: background | made with: @keyframes · transition · :hover · clip-path

```css
.container { animation: huerotate 2s linear infinite }
.container .row { margin-top: -29px }
.container .hexagon { position: relative; clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); transform: rotate(90deg); transition: all 2s linear }
.container .hexagon:hover { transition: 0s }
.container .hexagon:before { position: absolute; top: 4px; bottom: 4px; clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%) }
0% { filter: hue-rotate(0deg) }
100% { filter: hue-rotate(360deg) }
@keyframes huerotate animates filter
```

### [Hover effect 3](https://codepen.io/PejmanNaderi/pen/yLavxjd)

on scroll: div.item: clip-path+top | made with: transition · :hover · clip-path

```css
.item { -webkit-clip-path: polygon(10% 1%, 11% 100%, 33% 99%, 35% 65%, 59% 66%, 64% 100%, 85% 98%, 85% 1%, 63% 3%, 59% 46%, 37% 44%, 34% 0%); clip-path: polygon(10% 1%, 11% 100%, 33% 99%, 35% 65%, 59% 66%, 64% 100%, 85% 98%, 85% }
.container:hover .item { -webkit-clip-path: polygon(35% 100%, 37% 32%, 50% 30%, 50% 23%, 38% 10%, 53% 0, 63% 12%, 50% 23%, 50% 30%, 63% 30%, 59% 100%, 40% 100%); clip-path: polygon(35% 100%, 37% 32%, 50% 30%, 50% 23%, 38% 10%, 53% 0, 63% 12%, 50 }
```

### [glassmorphism card](https://codepen.io/davide_ravasi/pen/VwKzXvb)

on scroll: div.content: transform+opacity+top | on hover of div.card: div.content: transform+opacity+top | made with: transition · :hover · clip-path · backdrop-filter

```css
body:before { position: absolute; top: 0; clip-path: circle(30% at right 70%) }
body:after { position: absolute; top: 0; clip-path: circle(20% at 10% 10%) }
.container { position: relative }
.container .card:hover .content { transform: translateY(0px); opacity: 1 }
.container .card { position: relative; box-shadow: 20px 20px 50px rgba(0, 0, 0, 0.5); border-top: 1px solid rgba(255, 255, 255, 0.5); backdrop-filter: blur(5px) }
.container .card .content { transition: 0.5s; transform: translatey(100px); opacity: 0 }
.container .card .content h2 { position: absolute; top: -80px }
.container .card .content a { position: relative; margin-top: 15px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5) }
```

### [Parallax Carousel With Clip-Path](https://codepen.io/abnersn/pen/QWKMNQx)

made with: scroll-snap · clip-path · 3D (perspective / preserve-3d) · scroll listener · requestAnimationFrame

```css
.gallery { scroll-snap-type: x mandatory }
.movies > .movie:first-child { clip-path: polygon(0 0, 100% 0, calc(100% - 30px) 100%, 0 100%) }
.movies > .movie:last-child { clip-path: polygon(30px 0, 100% 0, 100% 100%, 0 100%) }
.movie { scroll-snap-align: center; perspective: 1px; clip-path: polygon(30px 0, 100% 0, calc(100% - 30px) 100%, 0 100%) }
.poster { position: relative; padding-bottom: 56% }
.poster img { position: absolute; top: -100%; transform: translate3d(0, 0, -2px) }
```

```js
addEventListener('scroll', () => {
requestAnimationFrame(updateScroll)
```

### [Burger Menu Animation](https://codepen.io/codedbyEmre/pen/YzGQRoR)

made with: transition · :hover · clip-path

```css
.navbar .nav-links li:nth-of-type(5), .navbar .nav-links li:nth-of-type(4), .nav { opacity: 0; transition: 0.3s ease-in all }
.navbar .nav-links li:nth-of-type(5).nav-link-open, .navbar .nav-links li:nth-of { opacity: 1; transform: translateY(10px) }
.navbar .nav-links li a::after, .navbar .nav-links li a::before { position: absolute; transition: 0.3s ease all }
body { position: relative }
.burger { position: absolute; top: 25px }
.navbar { position: absolute; top: 0; clip-path: circle(0px at 0 0px); transition: 0.5s ease all }
.navbar .nav-links { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.navbar .nav-links li a { position: relative; text-transform: uppercase }
.navbar .nav-links li a::before { top: -2px }
.navbar .nav-links li a::after { bottom: -5px }
.navbar.nav-open { clip-path: circle(100%) }
```

### [Clip-path animation (star)](https://codepen.io/jibhey/pen/xxEdrYY)

made with: @keyframes · clip-path

```css
body .main { position: relative }
body .main__button { position: absolute; top: 50%; transform: translate(-50%, -50%) }
body .main__hidden-content { position: absolute; clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%) }
body .main__hidden-content--display { animation: star 1s ease-in-out forwards }
0% { clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%) }
50% { clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%) }
100% { clip-path: polygon(35% 0, 64% 0, 100% 0, 100% 70%, 100% 100%, 44% 100%, 0 100%, 0 61%, 0 38%, 0 0) }
@keyframes star animates clip-path
```

### [Animated SVG - Blob with mousemove follow](https://codepen.io/wescouch/pen/oNzzMPj)

made with: clip-path · mask · GSAP · pointer / mouse tracking

```css
:root { --mask-position: 50% 50% }
.background-shape { -webkit-mask: url('data:image/svg+xml; -webkit-mask-size: 75%; -webkit-mask-position: var(--mask-position) }
```

```js
addEventListener("mousemove", (e) => {
gsap.to(bkgShape, {
```

### [Animated SVG - Blob](https://codepen.io/wescouch/pen/poEEVMj)

made with: clip-path

```css
.background-shape { clip-path: url(#clip-shape-blob) }
```

### [Responsive RWBY Poster](https://codepen.io/max1128/pen/ZEppvKE)

made with: clip-path

```css
.poster-aspect-ratio { padding-top: 170%; position: relative }
.poster-aspect-ratio { padding-top: 100% }
.poster-aspect-ratio { padding-top: 60% }
.poster { position: absolute; top: 0; bottom: 0; -webkit-clip-path: polygon(0% 0%, 0% 100%, 100% 95.5%, 100% 6.5%); clip-path: polygon(0% 0%, 0% 100%, 100% 95.5%, 100% 6.5%) }
.poster { -webkit-clip-path: polygon(0% 6.75%, 0% 95%, 50% 100%, 100% 95%, 100% 6.75%, 50% 0%); clip-path: polygon(0% 6.75%, 0% 95%, 50% 100%, 100% 95%, 100% 6.75%, 50% 0%) }
.poster { -webkit-clip-path: polygon(0% 0%, 0% 82.5%, 50% 100%, 100% 82.5%, 100% 0%, 75% 7%, 50% 0%, 25% 7%); clip-path: polygon(0% 0%, 0% 82.5%, 50% 100%, 100% 82.5%, 100% 0%, 75% 7%, 50% 0%, 25% 7%) }
.image-wrapper { position: relative }
.image-wrapper::after { position: absolute; top: -50%; bottom: -50%; opacity: 0.325 }
.image--ruby { -o-object-position: 50% 35%; object-position: 50% 35%; transform: scaleX(-1) }
.image--ruby { -o-object-position: 50% 70%; object-position: 50% 70% }
.image--ruby { -o-object-position: 65% 70%; object-position: 65% 70% }
.image--weiss { -o-object-position: 50% 30%; object-position: 50% 30% }
```

### [svg filter pattern idea texture, clip-path, filter, pattern](https://codepen.io/tomhermans/pen/QWKKWQx)

made with: transition · :hover · clip-path · mix-blend-mode

```css
svg > rect { filter: url(#roughpaper) }
svg circle { filter: url(#squiggly-3) }
svg circle:nth-child(3) { filter: url(#noisia); clip-path: url(#firstcircle) }
svg circle:nth-child(5) { mix-blend-mode: difference; transform: translate(15%, 0px) skew(15deg, 12deg) scale(0.2, 1.2) matrix(1, -0.3, 0, 1, 0, 0); filter: url(#noisia); clip-path: url(#leftbottom) }
svg circle:nth-child(7) { filter: url(#squiggly-6); mix-blend-mode: multiply }
svg circle:last-of-type { filter: url(#squiggly-4); transition: all 0.5s }
svg circle:last-of-type:hover { filter: url(#squiggly-0); transform: rotate(90deg) }
```

### [Puzzled Menu](https://codepen.io/hernandack/pen/rNMxpod)

on scroll: div.item: opacity+filter+top, img.: transform+top | on hover of img.: div.item: filter ×2 | made with: transition · :hover · clip-path

```css
.container { position: relative }
.container .item { position: absolute; opacity: 0.7; filter: brightness(0.8); transition: opacity 0.15s ease-in, brightness 0.2s ease-in }
.container .item:hover { opacity: 1; filter: brightness(1); transition: opacity 0.25s ease-in, brightness 0.25s ease-in }
.container .item:hover > .caption { transition: opacity 0.25s 0.2s ease-in }
.container .item:hover > img { transition: width 0.2s ease-in, height 0.2s ease-in }
.container .item > img { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: width 0.2s ease-in, height 0.2s ease-in }
.container .item > .caption { position: absolute; top: 0; opacity: 0 }
.container .item:nth-child(1) { top: 0; -webkit-clip-path: polygon(0% 0%, 69% 0, 76% 41%, 69% 91%, 44% 87%, 0% 96%); clip-path: polygon(0% 0%, 69% 0, 76% 41%, 69% 91%, 44% 87%, 0% 96%) }
.container .item:nth-child(2) { top: 0; -webkit-clip-path: polygon(0% 0%, 94% 0, 83% 34%, 84% 84%, 42% 78%, 0% 74%, 10% 32%); clip-path: polygon(0% 0%, 94% 0, 83% 34%, 84% 84%, 42% 78%, 0% 74%, 10% 32%) }
.container .item:nth-child(3) { top: 0; -webkit-clip-path: polygon(10% 0, 100% 0%, 100% 77%, 59% 90%, 0 83%, 0% 34%); clip-path: polygon(10% 0, 100% 0%, 100% 77%, 59% 90%, 0 83%, 0% 34%) }
.container .item:nth-child(4) { top: 26%; -webkit-clip-path: polygon(0% 8%, 38% 1%, 86% 9%, 81% 62%, 75% 90%, 0% 89%); clip-path: polygon(0% 8%, 38% 1%, 86% 9%, 81% 62%, 75% 90%, 0% 89%) }
.container .item:nth-child(5) { top: 30%; -webkit-clip-path: polygon(17% 0%, 76% 12%, 100% 0%, 100% 51%, 56% 64%, 11% 55%); clip-path: polygon(17% 0%, 76% 12%, 100% 0%, 100% 51%, 56% 64%, 11% 55%) }
```

### [Christmas Gallery with Clip-Path & Grids](https://codepen.io/MCDougRose/pen/ZEpQeRa)

on scroll: div.flake: transform+top ×100 | made with: transition · :hover · clip-path · 3D (perspective / preserve-3d) · GSAP

```css
.drybn-collage-item { position: relative; transition: 0.5s }
.drybn-collage-item h2 { position: absolute; top: 35%; transform: translate(-50%) }
.drybn-collage-item:nth-child(1) { background-position: center; clip-path: polygon(0 0, 82% 0, 100% 95%, 0 100%) }
.drybn-collage-item:nth-child(2) { background-position: 100% 50%; clip-path: polygon(0 0, 100% 0, 100% 100%, 15% 90%) }
.drybn-collage-item:nth-child(3) { background-position: center; clip-path: polygon(0 0, 100% 5%, 100% 95%, 0 90%); margin-top: -2rem }
.drybn-collage-item:nth-child(4) { clip-path: polygon(50% 0, 100% 10%, 100% 100%, 0 90%, 0 5%); margin-top: -1rem }
.drybn-collage-item:nth-child(5) { background-position: center; clip-path: polygon(0 0, 100% 5%, 100% 95%, 0 90%); margin-top: -1rem }
.drybn-collage-item:nth-child(6) { background-position: center; clip-path: polygon(0 0, 100% 10%, 100% 90%, 66% 100%, 0 90%); margin-top: -2.7rem }
.drybn-collage-item:nth-child(7) { background-position: center; clip-path: polygon(0 0, 100% 10%, 77% 100%, 0 100%); margin-top: -1.8rem }
.drybn-collage-item:nth-child(8) { background-position: center; clip-path: polygon(31% 10%, 100% 0, 100% 100%, 0 100%); margin-top: -1.8rem }
.drybn-collage-item { filter: sepia(1) blur(1px); transition: 0.3s }
.drybn-collage-item:hover { filter: sepia(0) }
```

```js
addEventListener("mouseenter", this.onMouseEnter.bind(this))
addEventListener("mouseleave", this.onMouseLeave.bind(this))
gsap.to(element, this.random(6,15), {
```

### [Beethoven by Josef Müller-Brockmann variation](https://codepen.io/kdubbels/pen/ZEpYjLe)

made with: clip-path

```css
h2 { top: 205px; position: absolute }
svg.clip-top-right { clip-path: circle(20% at 100% 0) }
svg.clip-bottom-right { clip-path: circle(20% at 100% 100%) }
svg.clip-bottom-left { clip-path: circle(20% at 0% 100%) }
```

### [These Cats Do Not Exist!](https://codepen.io/luciash/pen/YzGPpQE)

on scroll: img.c: clip-path ×100 | on hover of img.c: img.c: clip-path ×99, img.c: transform+clip-path+top | made with: @keyframes · :hover · clip-path

```css
.row { position: relative }
.c { animation: 1s ease-in-out 2s infinite alternate-reverse both a; clip-path: circle(50%) }
.c:hover { background-position: center center !important; transform: scale(20); position: relative }
0% { clip-path: circle(10%) }
100% { clip-path: circle(40%) }
@keyframes a animates clip-path
```

### [GTA 5 poster ( Grid and Clip Path)](https://codepen.io/TajShireen/pen/rNMaMzP)

made with: clip-path

```css
img { object-position: 40% 0 }
.parent { margin-top: 2.5vh }
.child:first-child { -webkit-clip-path: polygon(0% 0%, 93.24% 0%, 105.04% 110.16%, 0% 90%); clip-path: polygon(0% 0%, 93.24% 0%, 105.04% 110.16%, 0% 90%) }
.child:nth-child(2) { -webkit-clip-path: polygon(0% 0%, 108.28% 0%, 96.45% 110.13%, 10.55% 110.93%); clip-path: polygon(0% 0%, 108.28% 0%, 96.45% 110.13%, 10.55% 110.93%) }
.child:nth-child(3) { -webkit-clip-path: polygon(15.05% 0%, 100% 0%, 99.35% 91.7%, 3.08% 108.48%); clip-path: polygon(15.05% 0%, 100% 0%, 99.35% 91.7%, 3.08% 108.48%) }
.child:nth-child(4) { -webkit-clip-path: polygon(0% -0.85%, 106.34% 9.98%, 121.32% 65.63%, 99.66% 109.89%, 1.86% 124.41%); clip-path: polygon(0% -0.85%, 106.34% 9.98%, 121.32% 65.63%, 99.66% 109.89%, 1.86% 124.41%) }
.child:nth-child(5) { -webkit-clip-path: polygon(6.4% 6.48%, 47.24% 5.89%, 100% 0%, 98.41% 96.85%, 53.37% 100%, 53% 63.21%, 3.23% 73.02%, 14.3% 44.04%); clip-path: polygon(6.4% 6.48%, 47.24% 5.89%, 100% 0%, 98.41% 96.85%, 53.37% 100%, 53% 63. }
.child:nth-child(6) { -webkit-clip-path: polygon(2.14% 29.3%, 99.34% 15.42%, 98.14% 100.82%, 1.57% 101.2%); clip-path: polygon(2.14% 29.3%, 99.34% 15.42%, 98.14% 100.82%, 1.57% 101.2%) }
.child:nth-child(7) { -webkit-clip-path: polygon(7.92% 33.47%, 96.31% 23.39%, 95.38% 100%, 5.3% 100.85%); clip-path: polygon(7.92% 33.47%, 96.31% 23.39%, 95.38% 100%, 5.3% 100.85%) }
.child:nth-child(8) { -webkit-clip-path: polygon(2.5% 22.35%, 100% 0%, 100% 100%, 1.55% 100%); clip-path: polygon(2.5% 22.35%, 100% 0%, 100% 100%, 1.55% 100%) }
.child:nth-child(9) { -webkit-clip-path: polygon(5.94% 28.66%, 100.61% -0.67%, 101.1% 108.57%, 5.4% 126.28%); clip-path: polygon(5.94% 28.66%, 100.61% -0.67%, 101.1% 108.57%, 5.4% 126.28%) }
.child:nth-child(9) img { object-position: 30% 50% }
```

### [conic-gradient( star )](https://codepen.io/ycw/pen/PoGYVYd)

made with: @keyframes · clip-path

```css
body::before { -webkit-animation: anim 1s alternate 3 forwards; animation: anim 1s alternate 3 forwards; -webkit-clip-path: polygon(50% 12.2%, 63% 33.2%, 86.7% 38.8%, 71.7% 56.8%, 72.5% 80.2%, 50% 70.5%, 27.8% 80.2%, 30% 56.6%, 11.7% 3 }
from { filter: contrast(1) hue-rotate(0deg) }
to { filter: contrast(4) hue-rotate(10deg) }
from { filter: contrast(1) hue-rotate(0deg) }
to { filter: contrast(4) hue-rotate(10deg) }
@keyframes anim animates filter
```

### [Image blocks animated clip path carousel](https://codepen.io/objoe/pen/zYBVRRL)

made with: scroll-snap · @keyframes · transition · clip-path

```css
.carousel { position: relative }
.carousel-nav { position: absolute; bottom: 2.5vw }
.carousel-items { -ms-scroll-snap-type: x mandatory; scroll-snap-type: x mandatory }
.carousel-item { scroll-snap-align: start }
.carousel-item img { -webkit-clip-path: polygon(0 0, 0 50%, 20% 50%, 20% 50%, 0 50%, 0 0, 32% 0, 32% 50%, 21% 50%, 21% 50%, 32% 50%, 32% 0, 33% 0, 33% 50%, 53% 50%, 53% 50%, 33% 50%, 33% 5%, 33% 0, 54% 0, 54% 50%, 71% 50%, 71% 50%, 54% 50%,  }
.carousel-item.active img { -webkit-animation: clipGradual 1.25s 1 forwards; animation: clipGradual 1.25s 1 forwards; -webkit-animation-delay: 1s; animation-delay: 1s }
.carousel-item:target img { -webkit-animation: clipGradualActive 1.25s 1 forwards; animation: clipGradualActive 1.25s 1 forwards; -webkit-animation-delay: 0.5s; animation-delay: 0.5s }
20% { -webkit-clip-path: polygon(0 0, 0 5%, 20% 5%, 20% 95%, 0 95%, 0 0, 32% 0, 32% 50%, 21% 50%, 21% 50%, 32% 50%, 32% 0, 33% 0, 33% 50%, 53% 50%, 53% 50%, 33% 50%, 33% 5%, 33% 0, 54% 0, 54% 50%, 71% 50%, 71% 50%, 54% 50%, 54 }
40% { -webkit-clip-path: polygon(0 0, 0 5%, 20% 5%, 20% 95%, 0 95%, 0 0, 32% 0, 32% 100%, 21% 100%, 21% 0, 32% 0, 32% 0, 33% 0, 33% 50%, 53% 50%, 53% 50%, 33% 50%, 33% 5%, 33% 0, 54% 0, 54% 50%, 71% 50%, 71% 50%, 54% 50%, 54%  }
60% { -webkit-clip-path: polygon(0 0, 0 5%, 20% 5%, 20% 95%, 0 95%, 0 0, 32% 0, 32% 100%, 21% 100%, 21% 0, 32% 0, 32% 0, 33% 0, 33% 5%, 53% 5%, 53% 95%, 33% 95%, 33% 5%, 33% 0, 54% 0, 54% 50%, 71% 50%, 71% 50%, 54% 50%, 54% 0, }
80% { -webkit-clip-path: polygon(0 0, 0 5%, 20% 5%, 20% 95%, 0 95%, 0 0, 32% 0, 32% 100%, 21% 100%, 21% 0, 32% 0, 32% 0, 33% 0, 33% 5%, 53% 5%, 53% 95%, 33% 95%, 33% 5%, 33% 0, 54% 0, 54% 15%, 71% 15%, 71% 97%, 54% 97%, 54% 0, }
100% { -webkit-clip-path: polygon(0 0, 0 5%, 20% 5%, 20% 95%, 0 95%, 0 0, 32% 0, 32% 100%, 21% 100%, 21% 0, 32% 0, 32% 0, 33% 0, 33% 5%, 53% 5%, 53% 95%, 33% 95%, 33% 5%, 33% 0, 54% 0, 54% 15%, 71% 15%, 71% 97%, 54% 97%, 54% 0, }
```

### [Clip Path Card Effect](https://codepen.io/codedbyEmre/pen/mdEgZaK)

on scroll: div.card: opacity ×2 | on hover of div.card: div.card: opacity ×2 | made with: transition · :hover · clip-path · GSAP

```css
.container .card { position: relative }
.container .card .card-info { position: absolute; top: 0; clip-path: circle(0%); transition: 0.8s ease all }
.container .card:hover .card-info { clip-path: circle(100%) }
.container .card .card-info p { opacity: 0.9 }
.container .card .card-info button { margin-top: 1rem; transition: 0.3s ease all }
.container .card .card-info button { margin-top: 0.75rem }
```

```js
gsap.from('.card', { duration: 3, opacity: 0, delay: 0.25, stagger: .6, ease: 'elastic' })
```

### [Pure CSS 🌀 grid wave with Houdini magic 🎩🐇✨ (Chromium only)](https://codepen.io/thebabydino/pen/yLJreRz)

held: fixed a | on scroll: div.tri: transform+top ×288, div.tri: transform ×6 | on hover of a.: div.tri: transform+top ×293, div.tri: transform, a.: filter | made with: position: fixed · @keyframes · transition · :hover · clip-path

```css
#btn--yp { position: fixed; bottom: 1em; filter: grayscale(1) drop-shadow(0 0 1px #e8e0e0); transition: .5s }
#btn--yp:before { position: absolute; bottom: 100%; animation: float 1s ease-in-out infinite alternate }
#btn--yp:hover, #btn--yp:focus { filter: grayscale(0) drop-shadow(0 0 1px crimson) }
to { transform: translateY(0.75em) }
to { transform: var(--pos) scale(0) }
.tri { transform: var(--pos) scale(0.9); clip-path: polygon(50% 0%, 93.30127% 75%, 6.69873% 75%); animation: a 1s ease-in-out infinite alternate; animation-delay: calc((var(--lyr)/var(--m) - (var(--k) + var(--j)/var(--p))/var(- }
@keyframes float animates transform
@keyframes a animates transform
```

### [guestbook entry / div taking clip-path from SVG](https://codepen.io/tomhermans/pen/vYKPXEP)

on hover of button.my-8: button.my-8: transform+filter+top, span.btn: background+top | made with: transition · :hover · clip-path

```css
svg { filter: drop-shadow(5px 5px 0px rgba(50, 50, 50, 0.4)); transition: transform box-shadow 0.25s ease-in-out; transform: translateX(0px) translateY(0px) }
svg:hover, svg:active, svg:focus { filter: drop-shadow(8px 8px 0px rgba(50, 50, 50, 0.4)); transform: translateX(-3px) translateY(-3px) }
.btn-wrap { text-transform: uppercase; filter: drop-shadow(5px 5px 0px rgba(50, 50, 50, 0.4)); transition: transform box-shadow 0.25s ease-in-out }
.btn-wrap .btn { clip-path: polygon(0% 0%, 100% 1%, 100% 100%, 5px 93%) }
.btn-wrap:hover, .btn-wrap:active { transform: translateX(3px) translateY(3px); filter: drop-shadow(2px 2px 0px rgba(50, 50, 50, 0.3)) }
ul li { clip-path: polygon(0% 0%, 95% 1%, 97% 75%, 100% 100%, 93% 97%, 0% 98%); margin-top: 0.5rem }
ul li span { margin-top: 0.5rem }
textarea { margin-bottom: 40px }
```

### [Pure CSS ⬡ slices - chromatic aberration effect](https://codepen.io/thebabydino/pen/PozXWRw)

held: fixed a | on hover of a.: a.: filter | made with: position: fixed · @keyframes · transition · :hover · clip-path · mix-blend-mode

```css
#btn--yp { position: fixed; bottom: 1em; filter: grayscale(1) drop-shadow(0 0 1px #e8e0e0); transition: .5s }
#btn--yp:before { position: absolute; bottom: 100%; animation: float 1s ease-in-out infinite alternate }
#btn--yp:hover, #btn--yp:focus { filter: grayscale(0) drop-shadow(0 0 1px crimson) }
to { transform: translateY(0.75em) }
.tri { transform: rotate(calc(var(--k)*1turn)) translatey(calc(3em + 8px)) }
to { scale: 0 }
to { rotate: calc(var(--oa) + var(--s)*1turn/3) }
.lyr { rotate: var(--oa); clip-path: polygon(50% 0%, 93.30127% 75%, 6.69873% 75%); mix-blend-mode: screen; animation: s 1s ease-in infinite alternate, r 2s cubic-bezier(calc(.75 + var(--o)*.1), 0, calc(.25 - var(--o)*.1), 1) in }
@keyframes float animates transform
@keyframes s animates scale
@keyframes r animates rotate
```

### [press down clip-path button effect filter box-shadow](https://codepen.io/tomhermans/pen/VwjqPaE)

on scroll: button.btn-wrap: transform+filter+top, span.btn: clip-path+background+top | on hover of button.btn-wrap: button.btn-wrap: transform+filter+top ×2, span.btn: background+top, span.btn: clip-path+background+top | made with: transition · :hover · clip-path

```css
.btn-wrap { filter: drop-shadow(5px 5px 0px rgba(50, 50, 50, 0.4)); transition: transform box-shadow 0.25s ease-in-out }
.btn-wrap:hover, .btn-wrap:active { transform: translateX(3px) translateY(3px); filter: drop-shadow(2px 2px 0px rgba(50, 50, 50, 0.3)) }
.btn-wrap:hover .btn-weird, .btn-wrap:active .btn-weird { clip-path: polygon(1% 5%, 100% 1%, 100% 100%, 5px 90%) }
.btn-wrap:hover .btn-arrow, .btn-wrap:active .btn-arrow { clip-path: polygon(0 10%, 90% 11%, 90% 0, 100% 50%, 90% 100%, 90% 90%, 0 90%) }
.btn { clip-path: polygon(0% 0%, 100% 1%, 100% 100%, 5px 93%) }
.btn.btn-weird { clip-path: polygon(1% 5%, 100% 1%, 94% 100%, 5px 93%) }
```

### [Сlip-path example](https://codepen.io/shog1/pen/MWeZjEP)

made with: clip-path

```css
.content { position: relative }
.content::before { position: absolute; clip-path: polygon(10.42% 67.00%,31.58% 95.62%,90.67% 73.87%,87.33% 29.25%,45.42% 13.13%,17.83% 9.13%) }
```

### [CSS Demo: Knockout Text](https://codepen.io/veritygriscti/pen/vYKzgbg)

made with: mix-blend-mode

```css
.backdrop { background-position: bottom center }
#text-1 { mix-blend-mode: multiply }
#text-2 { mix-blend-mode: screen }
#text-3 { background-position: bottom center }
```

### [Image blocks clip path](https://codepen.io/objoe/pen/zYBLWNQ)

made with: @keyframes · transition · clip-path

```css
.image--blocks img { -webkit-clip-path: polygon(0 0, 0 50%, 20% 50%, 20% 50%, 0 50%, 0 0, 32% 0, 32% 50%, 21% 50%, 21% 50%, 32% 50%, 32% 0, 33% 0, 33% 50%, 53% 50%, 53% 50%, 33% 50%, 33% 5%, 33% 0, 54% 0, 54% 50%, 71% 50%, 71% 50%, 54% 50%,  }
.image--blocks img { -webkit-animation: clipGradual 1.25s 1 forwards; animation: clipGradual 1.25s 1 forwards; -webkit-animation-delay: 1s; animation-delay: 1s }
20% { -webkit-clip-path: polygon(0 0, 0 5%, 20% 5%, 20% 95%, 0 95%, 0 0, 32% 0, 32% 50%, 21% 50%, 21% 50%, 32% 50%, 32% 0, 33% 0, 33% 50%, 53% 50%, 53% 50%, 33% 50%, 33% 5%, 33% 0, 54% 0, 54% 50%, 71% 50%, 71% 50%, 54% 50%, 54 }
40% { -webkit-clip-path: polygon(0 0, 0 5%, 20% 5%, 20% 95%, 0 95%, 0 0, 32% 0, 32% 100%, 21% 100%, 21% 0, 32% 0, 32% 0, 33% 0, 33% 50%, 53% 50%, 53% 50%, 33% 50%, 33% 5%, 33% 0, 54% 0, 54% 50%, 71% 50%, 71% 50%, 54% 50%, 54%  }
60% { -webkit-clip-path: polygon(0 0, 0 5%, 20% 5%, 20% 95%, 0 95%, 0 0, 32% 0, 32% 100%, 21% 100%, 21% 0, 32% 0, 32% 0, 33% 0, 33% 5%, 53% 5%, 53% 95%, 33% 95%, 33% 5%, 33% 0, 54% 0, 54% 50%, 71% 50%, 71% 50%, 54% 50%, 54% 0, }
80% { -webkit-clip-path: polygon(0 0, 0 5%, 20% 5%, 20% 95%, 0 95%, 0 0, 32% 0, 32% 100%, 21% 100%, 21% 0, 32% 0, 32% 0, 33% 0, 33% 5%, 53% 5%, 53% 95%, 33% 95%, 33% 5%, 33% 0, 54% 0, 54% 15%, 71% 15%, 71% 97%, 54% 97%, 54% 0, }
100% { -webkit-clip-path: polygon(0 0, 0 5%, 20% 5%, 20% 95%, 0 95%, 0 0, 32% 0, 32% 100%, 21% 100%, 21% 0, 32% 0, 32% 0, 33% 0, 33% 5%, 53% 5%, 53% 95%, 33% 95%, 33% 5%, 33% 0, 54% 0, 54% 15%, 71% 15%, 71% 97%, 54% 97%, 54% 0, }
20% { -webkit-clip-path: polygon(0 0, 0 5%, 20% 5%, 20% 95%, 0 95%, 0 0, 32% 0, 32% 50%, 21% 50%, 21% 50%, 32% 50%, 32% 0, 33% 0, 33% 50%, 53% 50%, 53% 50%, 33% 50%, 33% 5%, 33% 0, 54% 0, 54% 50%, 71% 50%, 71% 50%, 54% 50%, 54 }
40% { -webkit-clip-path: polygon(0 0, 0 5%, 20% 5%, 20% 95%, 0 95%, 0 0, 32% 0, 32% 100%, 21% 100%, 21% 0, 32% 0, 32% 0, 33% 0, 33% 50%, 53% 50%, 53% 50%, 33% 50%, 33% 5%, 33% 0, 54% 0, 54% 50%, 71% 50%, 71% 50%, 54% 50%, 54%  }
60% { -webkit-clip-path: polygon(0 0, 0 5%, 20% 5%, 20% 95%, 0 95%, 0 0, 32% 0, 32% 100%, 21% 100%, 21% 0, 32% 0, 32% 0, 33% 0, 33% 5%, 53% 5%, 53% 95%, 33% 95%, 33% 5%, 33% 0, 54% 0, 54% 50%, 71% 50%, 71% 50%, 54% 50%, 54% 0, }
80% { -webkit-clip-path: polygon(0 0, 0 5%, 20% 5%, 20% 95%, 0 95%, 0 0, 32% 0, 32% 100%, 21% 100%, 21% 0, 32% 0, 32% 0, 33% 0, 33% 5%, 53% 5%, 53% 95%, 33% 95%, 33% 5%, 33% 0, 54% 0, 54% 15%, 71% 15%, 71% 97%, 54% 97%, 54% 0, }
100% { -webkit-clip-path: polygon(0 0, 0 5%, 20% 5%, 20% 95%, 0 95%, 0 0, 32% 0, 32% 100%, 21% 100%, 21% 0, 32% 0, 32% 0, 33% 0, 33% 5%, 53% 5%, 53% 95%, 33% 95%, 33% 5%, 33% 0, 54% 0, 54% 15%, 71% 15%, 71% 97%, 54% 97%, 54% 0, }
```

### [Box with Arrow + Box Shadow (using Pseudo & Clip-Path)](https://codepen.io/MyXoToD/pen/gOMvYOx)

made with: clip-path

```css
.box { position: relative; box-shadow: 0 0 20px #0ff; margin-bottom: 30px }
.box:before { position: absolute; top: 50%; box-shadow: 0 0 20px #0ff; transform: translate(50%, -50%) rotate(45deg); -webkit-clip-path: polygon(-20px -20px, calc(100% + 20px) -20px, calc(100% + 20px) calc(100% + 20px)); clip-path: po }
.box--left:before { transform: translate(-50%, -50%) rotate(-135deg) }
```

### [Black And Yellow](https://codepen.io/prinpadure/pen/zYBpObw)

on scroll: div.stripes: transform | made with: @keyframes · clip-path · mix-blend-mode

```css
.container { position: relative }
.circle { clip-path: circle(150px at center); mix-blend-mode: difference }
.stripes { position: absolute; top: 0; animation: slide 15s ease-in-out infinite }
0% { transform: translateX(0) }
50% { transform: translateX(-50%) }
100% { transform: translateX(0) }
@keyframes slide animates transform
```

### [CSS Demo: clip-path](https://codepen.io/veritygriscti/pen/qBNrxME)

made with: clip-path

```css
html, body { top: 0 }
#circle { clip-path: circle(82.9% at 50% 10%) }
#triangle { clip-path: polygon(0 0, 0 100%, 100% 100%) }
#rhombus { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%) }
#image-cutout { clip-path: polygon(90% 23%, 83% 20%, 84% 10%, 80% 5%, 76% 9%, 76% 19%, 73% 22%, 69% 20%, 70% 13%, 70% 7%, 67% 5%, 64% 7%, 62% 13%, 62% 19%, 59% 22%, 54% 18%, 54% 14%, 54% 9%, 51% 6%, 48% 6%, 47% 8%, 45% 12%, 45% 18%, 40% }
#div-shape-1 { clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%) }
#div-shape-2 { clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%) }
#div-shape-3 { background-position: left center; clip-path: polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%) }
```

### [clip-path animated responsive hexacon](https://codepen.io/ezwebru/pen/MWepJjN)

on hover of li.: a.: background | made with: transition · :hover · clip-path

```css
div.object { transform: scale(0.5, 1) rotate(45deg) }
.topnav-sub li { position: relative; transition: all 0.15s linear 0s }
.topnav-sub li::before, .topnav-sub li::after { position: absolute; transition: all 0.15s linear 0s }
.topnav-sub li::before { top: 0px; transform: skewX(-30deg) }
.topnav-sub li::after { bottom: 0px; transform: skewX(30deg) }
.topnav-sub li a { position: relative; text-transform: uppercase; transition: all 0.15s linear 0s }
.topnav-sub li a::before, .topnav-sub li a::after { position: absolute; transition: all 0.15s linear 0s }
.topnav-sub li a::before { top: 0px; transform: skewX(30deg) }
.topnav-sub li a::after { bottom: 00px; transform: skewX(-30deg) }
.topnav-sub li a b { position: relative }
.topnav-sub li a b::before { position: absolute; bottom: 0px; transition: all 0.15s linear 0.15s }
.topnav-sub li:hover::before, .topnav-sub li:hover::after { transition: all 0.15s linear 0.15s }
```

### [Image Loading Svg Placeholder](https://codepen.io/joshuawootonn/pen/rNLWpRo)

on scroll: svg.[object: transform+top | on hover of img.: svg.[object: transform+top | made with: @keyframes · transition

```css
from { -ms-transform: rotate(0deg); -moz-transform: rotate(0deg); -webkit-transform: rotate(0deg); -o-transform: rotate(0deg); transform: rotate(0deg) }
to { -ms-transform: rotate(360deg); -moz-transform: rotate(360deg); -webkit-transform: rotate(360deg); -o-transform: rotate(360deg); transform: rotate(360deg) }
.container { position: relative }
.container .imageContainer { position: relative }
.container .imageContainer .svgContainer { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.container .imageContainer .svgContainer svg { animation: rotating 5s linear infinite }
.container .imageContainer img { transform: translateX(600px); transition: all 500ms cubic-bezier(0.5, 0, 0.2, 1) }
.container .imageContainer.loaded img { transform: translateX(0%) }
@keyframes rotating animates -ms-transform, -moz-transform, -webkit-transform, -o-transform, transform
```

### [Clip-Path Lens Hover Effect](https://codepen.io/MyXoToD/pen/VwjmmaK)

made with: transition · :hover · clip-path · mask · custom properties driven by JS · pointer / mouse tracking

```css
.card { position: relative; box-shadow: 0 10px 10px rgba(0, 0, 0, 0.5) }
.card h1 { position: absolute }
.card img { --mask: radial-gradient( circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black var(--maskSize1, 0), transparent 0, transparent var(--maskSize2, 0), black var(--maskSize2, 0), black var(--maskSize3, 0), transparent 0); }
.card:hover img { -webkit-clip-path: circle(50% at var(--mouse-x) var(--mouse-y)); clip-path: circle(50% at var(--mouse-x) var(--mouse-y)) }
```

```js
addEventListener('mousemove', e => {
style.setProperty('--mouse-x', Math.floor(100 / card.offsetWidth * x) + '%')
style.setProperty('--mouse-y', Math.floor(100 / card.offsetHeight * y) + '%')
style.setProperty('--maskSize1', '20%')
style.setProperty('--maskSize2', '28%')
style.setProperty('--maskSize3', 'calc(28% + 0.1rem)')
```

### [WHITE/BLACK clip-path animation](https://codepen.io/MyXoToD/pen/eYzBJQQ)

made with: transition · :hover · clip-path

```css
.title { position: relative }
.title .one, .title .two { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: all 500ms ease }
.title .one:hover, .title .two:hover { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%) }
.title .one { clip-path: polygon(0% 0%, 100% 0%, 100% 0%, 0% 100%) }
.title .two { clip-path: polygon(0% 100%, 100% 0%, 100% 100%, 0% 100%) }
```

### [Play/Pause Button with Animation (CSS)](https://codepen.io/MyXoToD/pen/qBNqbbg)

made with: transition · :hover · clip-path

```css
.play-button { position: relative; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); transition: all 0.3s ease }
.play-button:before, .play-button:after { position: absolute; top: 50%; transform: translate3d(-50%, -50%, 0); transition: -webkit-clip-path 0.3s ease; transition: clip-path 0.3s ease; transition: clip-path 0.3s ease, -webkit-clip-path 0.3s ease }
.play-button:before { -webkit-clip-path: polygon(0% 0%, 100% 50%, 0% 50%, 0% 0%); clip-path: polygon(0% 0%, 100% 50%, 0% 50%, 0% 0%) }
.play-button:after { -webkit-clip-path: polygon(0% 50%, 100% 50%, 0% 100%, 0% 50%); clip-path: polygon(0% 50%, 100% 50%, 0% 100%, 0% 50%) }
.play-button.pause:before { -webkit-clip-path: polygon(0% 0%, 33% 0%, 33% 100%, 0% 100%); clip-path: polygon(0% 0%, 33% 0%, 33% 100%, 0% 100%) }
.play-button.pause:after { -webkit-clip-path: polygon(66% 0%, 100% 0%, 100% 100%, 66% 100%); clip-path: polygon(66% 0%, 100% 0%, 100% 100%, 66% 100%) }
```

### [lp concept](https://codepen.io/kitjenson/pen/pobNzeY)

made with: transition · :hover · clip-path · custom properties driven by JS

```css
:root { --bg-top:65vh }
body { position:relative; top:0 }
body:before { position:absolute; top:0; clip-path:polygon(0 50vh, var(--bg-left) var(--bg-top), 100vw 50vh, 100% 100%, 0% 100%); transition:1.5s }
h2 { position:absolute; top:15px }
.btn { position:absolute; top:15px }
.text_block { border-bottom:1px dotted var(--color-three) }
#footer { position:relative }
#footer:before { position:absolute; top:-25px; clip-path:polygon(50% 0%, 55% 100%, 45% 100%) }
```

```js
style.setProperty('--bg-left', (Math.random()*60)+20+"vw")
style.setProperty('--bg-top', (Math.random()*30)+40+"vh")
```

### [cool fullpage menu animated w/ GSAP](https://codepen.io/tomhermans/pen/rNLezxg)

held: fixed div.overlay | made with: position: fixed · clip-path · GSAP

```css
.menu .menu-container { margin-top: 1.5em; opacity: 0 }
.title { margin-top: 0; text-transform: uppercase }
.overlay { clip-path: circle(0%); position: fixed }
.overlay .exit { position: absolute }
```

```js
gsap.timeline({
```

### [Pure CSS 🔺 openings 2020](https://codepen.io/thebabydino/pen/WNxbLob)

made with: @keyframes · clip-path

```css
.🔺::before, .🔺::after { box-shadow: inset 0 0 0 calc((1 - var(--j))*20em) #fff; -webkit-clip-path: polygon(50% 0%, 93.30127% 75%, 6.69873% 75%); clip-path: polygon(50% 0%, 93.30127% 75%, 6.69873% 75%) }
.🔺 > .🔺 { animation: s 1.5s cubic-bezier(0, 0, 0.19, 1) infinite alternate, r 3s linear infinite }
to { scale: 0.5 }
to { rotate: 120deg }
@keyframes s animates scale
@keyframes r animates rotate
```

### [Checkbox card](https://codepen.io/aaw3k/pen/zYBxEWX)

held: fixed div.socials | made with: position: fixed · transition · clip-path · mix-blend-mode

```css
.card { --transition: 0.15s }
.card__input { position: absolute }
.card__input:checked ~ .card__body .card__body-cover-checkbox { --check-scale: 1; --check-opacity: 1 }
.card__input:disabled ~ .card__body { opacity: 0.5 }
.card__input:disabled ~ .card__body:active { --scale: 1 }
.card__body { position: relative; box-shadow: var(--shadow, 0 4px 4px 0 rgba(0, 0, 0, 0.02)); transition: transform var(--transition), box-shadow var(--transition); transform: scale(var(--scale, 1)) translateZ(0) }
.card__body:active { --scale: 0.96 }
.card__body-cover { position: relative }
.card__body-cover:after { position: absolute; top: 0; mix-blend-mode: var(--blend-mode); opacity: var(--opacity-bg, 1); transition: opacity var(--transition) linear }
.card__body-cover-image { filter: var(--filter-bg, grayscale(1)); -webkit-clip-path: polygon(0% 0%, 100% 0%, var(--x-y1, 100% 90%), var(--x-y2, 67% 83%), var(--x-y3, 33% 90%), var(--x-y4, 0% 85%)); clip-path: polygon(0% 0%, 100% 0%, var(--x-y1, 1 }
.card__body-cover-checkbox { position: absolute; top: 10px; opacity: var(--check-opacity, 0); transition: transform var(--transition), opacity calc(var(--transition) * 1.2) linear; transform: scale(var(--check-scale, 0)) }
.card__body-cover-checkbox--svg { vertical-align: top; transition: stroke-dashoffset 0.4s ease var(--transition) }
```

### [DIV svg clip-path test](https://codepen.io/driezis/pen/qBNBeJL)

on scroll: img.: transform+top | made with: transition · :hover · clip-path

```css
.mask-svg { position: absolute }
.container { position: relative }
.banga-link { position: relative }
.banga-link img { -webkit-clip-path: url(#banga-link--mask); clip-path: url(#banga-link--mask); transform: scale(1.07); will-change: transform; transition: transform 0.2s ease-out }
.banga-link.horizontal img { transform: scaleX(1.07) }
.banga-link:hover img { transform: scale(1) }
.banga-link-cont { position: relative }
.banga-link-cont .img-container { -webkit-clip-path: url(#banga-link--mask); clip-path: url(#banga-link--mask); transform: scaleX(1.07); will-change: transform; transition: transform 0.2s ease-out }
.banga-link-cont .img-container img { transform: scaleX(0.934579); will-change: transform; transition: transform 0.2s ease-out }
.banga-link-cont:hover .img-container { transform: scaleX(1) }
.banga-link-cont:hover .img-container img { transform: scaleX(1) }
```

### [Effect hover path](https://codepen.io/crianbluff/pen/zYBOrRy)

on scroll: div.clip: clip-path ×3, div.content: transform+opacity+top | made with: transition · :hover · clip-path

```css
.container { position: relative }
.container .clip { position: absolute; top: 0; transition: -webkit-clip-path 0.5s ease; transition: clip-path 0.5s ease; transition: clip-path 0.5s ease, -webkit-clip-path 0.5s ease }
.container .clip.clip-1 { -webkit-clip-path: polygon(0 0, 55% 0, 20% 100%, 0 100%); clip-path: polygon(0 0, 55% 0, 20% 100%, 0 100%) }
.container .clip.clip-2 { -webkit-clip-path: polygon(55% 0, 100% 0, 45% 100%, 20% 100%); clip-path: polygon(55% 0, 100% 0, 45% 100%, 20% 100%) }
.container .clip.clip-3 { -webkit-clip-path: polygon(100% 0, 100% 0, 100% 100%, 45% 100%); clip-path: polygon(100% 0, 100% 0, 100% 100%, 45% 100%) }
.container:hover .clip, .container:focus .clip, .container:active .clip { -webkit-clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%); clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%) }
.container .clip:hover, .container .clip:focus, .container .clip:active { -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%) }
.container .clip .content { opacity: 0; position: absolute; top: 100%; transition: opacity 0.5s ease, transform 0.5s ease }
.container .clip:hover .content, .container .clip:focus .content, .container .cl { opacity: 1; transform: translateY(-100%) }
```

### [Effect scroll with video background](https://codepen.io/crianbluff/pen/mdEbeMa)

held: fixed section.banner | made with: position: fixed · clip-path · scroll listener

```css
.banner { -webkit-clip-path: circle(800px at center center); clip-path: circle(800px at center center); position: fixed; top: 0 }
.banner video { position: absolute; top: 0 }
.container { margin-top: 200vh; position: relative }
.container h2 { margin-bottom: 20px }
```

```js
addEventListener('scroll', function() {
```

### [clip-path](https://codepen.io/Ahmed-Abdelsalam/pen/mdPgzxg)

made with: transition · :hover · clip-path

```css
.container { position: relative }
.container .clip { position: absolute; bottom: 0; transition: all 1.5s ease }
.container .clip .info { position: absolute; bottom: -100%; opacity: 0; transition: 1s ease-in-out }
.container .clip:hover .info { bottom: 0; opacity: 1 }
.container .clip1 { clip-path: polygon(0 0, 50% 0, 0 100%, 0% 100%) }
.container .clip2 { clip-path: polygon(50% 0%, 100% 0, 50% 100%, 0 100%) }
.container .clip3 { clip-path: polygon(100% 0, 100% 0, 100% 100%, 50% 100%) }
.container:hover .clip { clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%) }
.container .clip:hover { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%) }
```

### [Jalousie text animation](https://codepen.io/sandstedt/pen/GRZeywP)

made with: @keyframes · clip-path

```css
.jt { position: relative; text-transform: uppercase }
.jt__row:nth-child(1) { -webkit-clip-path: polygon(0% 75%, 100% 75%, 100% 100%, 0% 100%); clip-path: polygon(0% 75%, 100% 75%, 100% 100%, 0% 100%) }
.jt__row:nth-child(2) { -webkit-clip-path: polygon(0% 50%, 100% 50%, 100% 75.5%, 0% 75.5%); clip-path: polygon(0% 50%, 100% 50%, 100% 75.5%, 0% 75.5%) }
.jt__row:nth-child(3) { -webkit-clip-path: polygon(0% 25%, 100% 25%, 100% 50.5%, 0% 50.5%); clip-path: polygon(0% 25%, 100% 25%, 100% 50.5%, 0% 50.5%) }
.jt__row:nth-child(4) { -webkit-clip-path: polygon(0% 0%, 100% -10%, 100% 35.5%, 0% 25.5%); clip-path: polygon(0% 0%, 100% -10%, 100% 35.5%, 0% 25.5%) }
.jt__row:nth-child(5) { -webkit-clip-path: polygon(0% -25%, 100% -45%, 100% -9.5%, 0% 0.5%); clip-path: polygon(0% -25%, 100% -45%, 100% -9.5%, 0% 0.5%) }
.jt__row:nth-child(6) { -webkit-clip-path: polygon(0% -50%, 100% -85%, 100% -44.4%, 0% -24.5%); clip-path: polygon(0% -50%, 100% -85%, 100% -44.4%, 0% -24.5%) }
.jt__row.jt__row--sibling { position: absolute; top: 0 }
.jt__text { -webkit-animation: moveIn 2s cubic-bezier(.36,0,.06,1) alternate infinite; animation: moveIn 2s cubic-bezier(.36,0,.06,1) alternate infinite }
.jt__row:nth-child(1) .jt__text { transform: translateY(-0.1em) }
.jt__row:nth-child(2) .jt__text { transform: translateY(-0.3em) scaleY(1.1) }
.jt__row:nth-child(3) .jt__text { transform: translateY(-0.5em) scaleY(1.2) rotate(-1deg) }
```

### [Image Collage](https://codepen.io/MCDougRose/pen/yLOGGbJ)

made with: transition · :hover · clip-path

```css
.drybn-collage-item { position: relative; transition: 0.5s }
.drybn-collage-item h2 { position: absolute; top: 35%; transform: translate(-50%) }
.drybn-collage-item:nth-child(1) { background-position: center; clip-path: polygon(0 0, 82% 0, 100% 95%, 0 100%) }
.drybn-collage-item:nth-child(2) { background-position: center; clip-path: polygon(0 0, 100% 0, 100% 100%, 15% 90%) }
.drybn-collage-item:nth-child(3) { background-position: center; clip-path: polygon(0 0, 100% 5%, 100% 95%, 0 90%); margin-top: -2rem }
.drybn-collage-item:nth-child(4) { clip-path: polygon(50% 0, 100% 10%, 100% 100%, 0 90%, 0 5%); margin-top: -1rem }
.drybn-collage-item:nth-child(5) { background-position: center; clip-path: polygon(0 0, 100% 5%, 100% 95%, 0 90%); margin-top: -1rem }
.drybn-collage-item:nth-child(6) { background-position: center; clip-path: polygon(0 0, 100% 10%, 100% 90%, 66% 100%, 0 90%); margin-top: -2.7rem }
.drybn-collage-item:nth-child(7) { background-position: center; clip-path: polygon(0 0, 100% 10%, 77% 100%, 0 100%); margin-top: -1.8rem }
.drybn-collage-item:nth-child(8) { background-position: center; clip-path: polygon(31% 10%, 100% 0, 100% 100%, 0 100%); margin-top: -1.8rem }
.drybn-collage-item { filter: sepia(1) blur(1px); transition: 0.3s }
.drybn-collage-item:hover { filter: sepia(0) }
```

### [blog_card](https://codepen.io/gzkdev/pen/QWNZYaV)

made with: transition · :hover · clip-path

```css
.card { box-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.15); transition: 400ms ease }
.card:hover { transform: scale(1.005) }
.card__background { clip-path: circle(24rem at 50% -9rem) }
.card__link { transition: 400ms ease }
.card__link:hover { transform: scale(0.95) }
```

### [clip-path arrow](https://codepen.io/tearat/pen/GRZXjmq)

made with: transition · :hover · clip-path

```css
.arrow { transition: 0.2s ease; clip-path: polygon(0% 0%, 60% 0%, 100% 0%, 100% 50%, 100% 100%, 60% 100%, 0% 100%) }
.arrow-container:hover .arrow { clip-path: polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%) }
.tentacle { transition: 0.2s ease; clip-path: polygon(18% 100%, 8% 68%, 21% 24%, 60% 9%, 90% 21%, 91% 57%, 76% 82%, 48% 77%, 41% 42%, 55% 63%, 70% 65%, 82% 53%, 79% 31%, 62% 21%, 32% 31%, 23% 70%, 42% 100%) }
.tentacle-container:hover .tentacle { clip-path: polygon(18% 100%, 4% 75%, 10% 32%, 40% 8%, 78% 10%, 94% 35%, 90% 70%, 70% 88%, 44% 77%, 71% 73%, 81% 64%, 83% 38%, 73% 22%, 45% 19%, 21% 34%, 20% 74%, 42% 100%) }
```

### [Pure CSS: 5 icosahedra x 20 faces = 100 divs (hover shapes for animation, Chrome 85+ only)](https://codepen.io/thebabydino/pen/abNYLdq)

on scroll: div.s3gon: opacity+top ×17, div.s3gon: opacity ×3, article.scene: background, section.s20hedron: transform | made with: @keyframes · :hover · clip-path · mask · 3D (perspective / preserve-3d)

```css
.scene { perspective: 19em }
.s20hedron { position: relative; animation: rot 8s linear infinite; animation-play-state: var(--state) }
to { transform: rotateY(1turn) }
to { opacity: 0.2 }
.s3gon { position: absolute; transform: rotatey(calc(var(--j)*72deg)) rotate(calc(var(--rev)*.5turn)) rotatex(calc(var(--end)*52.62263deg - var(--not-end)*10.81232deg)) translatez(11.33642vmin); filter: blur(2px); animation: alph }
.s3gon::before, .s3gon::after { position: absolute; -webkit-clip-path: var(--poly); clip-path: var(--poly); --mask: linear-Gradient(calc(var(--rev)*180deg), red var(--perc0), transparent 0 var(--perc1), red 0) 0 0/100% 12.99038vmin no-repeat; -webkit-m }
@keyframes perc0 animates --perc0
@keyframes perc1 animates --perc1
@keyframes rot animates transform
@keyframes alpha animates opacity
```

### [laser printer](https://codepen.io/itscodysolomon/pen/RwaQWZZ)

held: fixed p | on scroll: button.: background | made with: position: fixed · @keyframes · transition · :hover · clip-path

```css
#start button { text-transform: uppercase; transition: all 0.5s }
#start button:hover { transition: all 0.5s }
#msg { position: relative }
#msg p { animation: build 3.5s linear 1 }
#msg:before { position: absolute; bottom: 100%; margin-top: -100%; animation: laser 0.25s linear infinite, laser-up 3.5s linear 1 both; box-shadow: 0px 0px 40px 8px #0ed200 }
#refresh { position: fixed; top: 3em; transition: color 0.25s }
#refresh:hover { transition: color 0.25s }
0% { transform: skew(-2deg) }
50% { transform: skew(2deg) }
100% { transform: skew(-2deg) }
0% { bottom: 0% }
90% { opacity: 100% }
```

### [Image Reveal animation on scroll without dependancies - CSS & JS](https://codepen.io/cameronknight/pen/WNwZORV)

held: fixed div.credit | on scroll: div.image-wrap: transform+clip-path+top ×2, img.: transform+top ×2, h2.fadeup: transform+opacity+top | on hover of img.: div.image-wrap: clip-path ×2, img.: transform+top ×2 | made with: position: fixed · transition · clip-path · IntersectionObserver

```css
.container { position: relative }
.credit { position: fixed; top: 20px }
.credit a { text-transform: lowercase }
h2 { text-transform: uppercase; position: absolute; top: 25% }
body:not(.no-js) .image-wrap { transition: 1s ease-out; position: relative; clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%) }
body:not(.no-js) .image-wrap img { transform: scale(1.3); transition: 2s ease-out }
body:not(.no-js) .animating .image-wrap { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); transform: skewY(0) }
body:not(.no-js) .animating img { transform: scale(1); transition: 4s ease-out }
body:not(.no-js) .fadeup { opacity: 0; transition: 0.4s ease-out; transform: translateY(40px) }
body:not(.no-js) .fading-up { opacity: 1; transition: 1s ease-out; transform: translateY(0px) }
```

```js
new IntersectionObserver(revealCallback, options)
new IntersectionObserver(fadeupCallback, options)
```

### [clip-path-header](https://codepen.io/gzkdev/pen/QWNMmYG)

made with: clip-path

```css
.wrapper { clip-path: polygon(0 0, 100% 0, 100% 85%, 50% 100%, 50% 100%, 0 85%) }
```

### [Clip Path Text Animation](https://codepen.io/Khairul021/pen/bGpWreL)

held: fixed div.bottom-container, fixed div.top-container | on scroll: div.top-container: clip-path | made with: position: fixed · @keyframes · clip-path

```css
.bottom-container, .top-container { position: fixed; top: 35vh }
.top-container { clip-path: circle(13% at 85% 50%); animation: circleMove 100s ease-in-out infinite }
0%, 100% { clip-path: circle(13% at 85% 50%) }
50% { clip-path: circle(13% at 15% 50%) }
@keyframes circleMove animates clip-path
```

### [CSS Shapes Layout Experiment](https://codepen.io/KristopherVanSant/pen/xxVqLLO)

made with: clip-path

```css
* { position: relative }
#svg1 { -webkit-clip-path: polygon(0% 0%, 100% 50%, 40% 100%); clip-path: polygon(0% 0%, 100% 50%, 40% 100%) }
#s1 h1 { position: absolute; -webkit-transform: rotate(-23deg); -ms-transform: rotate(-23deg); transform: rotate(-23deg); top: -1vw }
#s1d { margin-top: -2vw }
.p1-spanl:before { position: absolute; -webkit-transform: rotate(-60deg); -ms-transform: rotate(-60deg); transform: rotate(-60deg); top: 25vw }
.p1-spanl:after { position: absolute; bottom: 4.8vw }
.p1-spanr:before { position: absolute; top: 1.5vw }
#s2d { border-top: 0.3vw solid; padding-top: 5vw }
#s2d2 { border-bottom: 0.3vw solid; padding-bottom: 5vw; margin-bottom: 5vw }
#s4 { position: relative }
#s4 svg { -webkit-clip-path: polygon( 55.86% 0px, 75.68% 1px, 62.38% 26.41%, 78.2% 26.85%, 30.82% 95.41%, 45.9% 43.04%, 33.44% 42.89% ); clip-path: polygon( 55.86% 0px, 75.68% 1px, 62.38% 26.41%, 78.2% 26.85%, 30.82% 95.41%, 45.9% }
#s4 h1 { position: absolute; top: 30vw }
```

### [shooting star css animation](https://codepen.io/huxhu/pen/wvGgXKw)

on scroll: div.star: transform+opacity+clip-path+top ×4 | made with: @keyframes · clip-path

```css
.star { clip-path: circle(141.1% at 100% 100%); animation: star infinite 1s ease-out }
.star:nth-child(2n) { animation-delay: -0.5s }
.star__line { box-shadow: -1px 2px #FFF256; transform: rotate(45deg) scaleX(1.3) }
from { transform: translate(-400%, -400%); clip-path: circle(0% at 100% 100%) }
30% { opacity: 1 }
60% { opacity: 0.8; clip-path: circle(45% at 100% 100%) }
to { opacity: 0 }
@keyframes star animates transform, clip-path, opacity
```

### [Counter with Scroll Timeline and Snap Points](https://codepen.io/argyleink/pen/XWdNYaY)

held: fixed h1, fixed h1, fixed h1, fixed h1, fixed h1 | on scroll: span.slash: transform+top ×10 | made with: position: fixed · scroll() timeline · scroll-snap · clip-path · Web Animations API (.animate)

```css
main { -ms-scroll-snap-type: y mandatory; scroll-snap-type: y mandatory }
section { scroll-snap-align: start; position: relative }
.stuck { position: absolute; top: 0; bottom: 0; -webkit-clip-path: polygon(0% 0%,100% 0%,100% 100%,0% 100%); clip-path: polygon(0% 0%,100% 0%,100% 100%,0% 100%) }
.stuck > h1 { position: fixed; top: 0; bottom: 0; will-change: transform }
```

```js
.animate({
```

### [#001 - Bulbasaur](https://codepen.io/atstormcup/pen/jOqqXxL)

made with: clip-path

```css
body { position: relative }
.container { position: absolute; top: 0; bottom: 0 }
.head { position: absolute; top: 25px; filter: drop-shadow(0 0 20px #fff) }
.head::before { position: absolute; border-top: 2px solid #000; bottom: 164px; clip-path: polygon(0 0, 100% 0, 100% 20%, 0 100%) }
.head::after { position: absolute; border-top: 2px solid #000; bottom: 164px; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 20%) }
.brow { position: absolute; top: 87px }
.brow::before { position: absolute; top: 0px; border-top: 2px solid #000; transform: rotate(66deg) }
.brow::after { position: absolute; top: 0px; border-top: 2px solid #000; transform: rotate(-64deg) }
.spot { position: absolute }
.spot::after { position: absolute }
.spot.large { top: 21px; clip-path: polygon(0 32%, 37% 14%, 82% 0, 92% 17%, 100% 39%, 75% 69%, 46% 99%, 16% 97%) }
.spot.large::after { clip-path: polygon(3% 34%, 37% 17%, 81% 4%, 89% 17%, 97% 38%, 75% 65%, 45% 96%, 18% 94%) }
```

### [Supa Dupa Fly Hover](https://codepen.io/hexagoncircle/pen/LYNNYyQ)

on scroll: div.letter: transform+clip-path+background+top ×11, span.border: transform+opacity+top ×4, div.letter: transform+clip-path+background | made with: @keyframes · transition · :hover · clip-path · mix-blend-mode

```css
.its-my-window { position: relative }
.border { position: absolute; opacity: 0; transition: opacity var(--duration) var(--ease) }
.border::before { position: absolute; top: 0; transition: transform var(--duration) var(--ease) }
.border-0::before, .border-1::before { transform: scaleX(0) }
.border-2::before, .border-3::before { transform: scaleY(0) }
.its-my-window:hover .border-0::before, .its-my-window:hover .border-1::before { transform: scaleX(1) }
.its-my-window:hover .border-2::before, .its-my-window:hover .border-3::before { transform: scaleY(1) }
.border-0 { bottom: calc(100% + var(--gap) * 2); clip-path: polygon(4% 0, 99% 19%, 100% 64%, 0 95%) }
.border-1 { top: calc(100% + var(--gap) * 2); clip-path: polygon(2% 39%, 98% 15%, 99% 49%, 0 95%) }
.border-2 { clip-path: polygon(10% 1%, 97% 0, 67% 98%, 22% 100%) }
.border-3 { clip-path: polygon(28% 0, 39% 0, 100% 100%, 29% 100%) }
.letter { position: relative }
```

### [polygon](https://codepen.io/dozens/pen/mdPVORq)

made with: nothing recognised — read the code

```css
.poly { position: relative }
.poly__content { position: absolute; top: 0.5em; bottom: 0.5em }
h1 { text-transform: capitalize }
```

### [CodePen Challenge: Take on me](https://codepen.io/b9016/pen/abNOKEw)

made with: clip-path · pointer / mouse tracking

```css
#mask { background-position: center; filter: grayscale(100%); clip-path: circle(120px at 780px 160px) }
```

```js
addEventListener("mousemove", handler)
```

### [Animated Birthday Cake](https://codepen.io/aPenHasNoName/pen/VwawdMg)

on scroll: div.greeting: transform+top, div.candle-container: opacity, div.flame-wrap: transform+top | made with: clip-path · GSAP

```css
.svg { position: absolute }
.wrapper { position: relative }
.greeting { transform: scale(0) }
.plate { position: relative; margin-top: 0; box-shadow: 0px 3px 5px 0px #aaa }
.cake-wrap { position: absolute; bottom: 50% }
.cake-base { position: relative }
.cake-base .base-front { position: absolute }
.cake-base .base-front:after { position: absolute; top: 100%; transform: translatey(-50%) }
.cake-base .base-top { position: absolute; top: 0; transform: translatey(-50%) }
.cake-base .base-top:before { position: absolute; clip-path: polygon(0 0, 0% 50%, 100% 50%, 100% 0) }
.cake-base .base-top:after { position: absolute; clip-path: polygon(0 50%, 60% 50%, 60% 101%, 0 101%) }
.cake-topping { position: absolute; bottom: 0% }
```

```js
gsap.timeline({
gsap.to('.star', {
```

### [Product card UI with clip-path](https://codepen.io/Allan11/pen/poyoJar)

on scroll: div.circle: clip-path, h1.card__title: transform+top, div.product-info__top: transform+opacity+top, div.product-info__bottom: transform+opacity+top | made with: transition · :hover · clip-path

```css
.card { position: relative; text-transform: uppercase }
.card:hover .circle { clip-path: circle(220px at 90% 130px) }
.card:hover .card__title { transform: translateY(150px) }
.card:hover .product-info__top { transform: translateY(0); opacity: 1 }
.card:hover .product-info__bottom { transform: translateY(0); opacity: 1 }
.card__top { position: relative }
.circle { position: absolute; clip-path: circle(0px at 90% 130px); transition: all 0.5s ease-in-out }
.card__top-img { position: absolute; transform: rotate(-30deg) scaleX(-1) }
.card__title { position: absolute; transform: translateY(350px); transition: transform 0.5s ease-in-out }
.product-info__top { opacity: 0; transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out; transform: translateY(50%) }
.product-info__brand { text-transform: uppercase }
.product-info__sizes-size { transition: background 0.3s ease-in-out }
```

### [Clip Path Property](https://codepen.io/Kryan74/pen/eYJojmz)

made with: transition · :hover · clip-path

```css
.inner { clip-path: circle(10% at 90% 20%); transition: clip-path .5s ease }
.inner:hover { clip-path: circle(75%) }
span { transition: color .5s; margin-top: 4% }
```

### [flex & grid layout , arrows switching orientation](https://codepen.io/gc-nomade/pen/zYreJBQ)

made with: clip-path

```css
li { position: relative }
li:after { position: absolute; top: 50%; border-top: dotted }
li:before { position: absolute; top: 50%; margin-top: -3px }
li div.drop-shadow-buffer { filter: drop-shadow(1px 0px 1px white) drop-shadow(1px 0px 2px gray); position: relative; transform:translate(0,-25%) }
div.drop-shadow-buffer:after { position: absolute; clip-path: polygon(50% 15%, 100% 0, 100% 85%, 50% 100%, 0 85%, 0% 0%) }
li { position: relative }
li:after { position: absolute; bottom: -30px; top: auto }
li:before { position: absolute; bottom: -0px; top: auto }
li:nth-child(2n + 1):after { position: absolute; bottom: -auto; top: -30px }
li:nth-child(2n + 1):before { position: absolute; bottom: -auto; top: 0 }
li:last-of-type { transform: translate(4em, 0) }
li:nth-child(even) div { transform: translate(-10%, 0) }
```

### [Pure CSS scanner animation](https://codepen.io/devjingles/pen/eYJQNJR)

made with: @keyframes · clip-path

```css
.main-div { position: relative }
.main-div1 { -webkit-box-shadow: 0 0 17px 3px #0f0,0 0 4px 2px #0f0; box-shadow: 0 0 17px 3px #0f0,0 0 4px 2px #0f0 }
.main-div1::before { position: absolute; top: 0; -webkit-box-shadow: 0 0 17px 3px #0f0,0 0 4px 2px #0f0; box-shadow: 0 0 17px 3px #0f0,0 0 4px 2px #0f0; -webkit-animation-name: green-shadow; animation-name: green-shadow; -webkit-animation-ti }
h1 { position: relative }
h1::after { position: absolute; top: 0; animation: none; -webkit-animation: none; -webkit-animation-name: scanner-clip; animation-name: scanner-clip; -webkit-animation-timing-function: linear; animation-timing-function: linear; -web }
0% { top: 0 }
100% { top: 100% }
0% { top: 0 }
100% { top: 100% }
0% { -webkit-clip-path: inset(0 0 100% 0); clip-path: inset(0 0 100% 0) }
100% { -webkit-clip-path: inset(0 0 0 0); clip-path: inset(0 0 0 0) }
0% { -webkit-clip-path: inset(0 0 100% 0); clip-path: inset(0 0 100% 0) }
```

### [CSS Clip-path Image Hover Effects](https://codepen.io/Okba-Design/pen/oNbaMvN)

on scroll: div.Front: clip-path | made with: transition · :hover · clip-path · 3D (perspective / preserve-3d)

```css
*, html,body { perspective:800px }
.Card { position:relative; box-shadow:0px 0px 10px rgba(0,0,0,.3) }
.Card .Front { position:absolute; top:0px; transition:.5s }
.Card .Front.One { clip-path: polygon(0 0, 100% 0, 100% 0, 0% 100%) }
.Card .Front.One:hover { clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%) }
.Card .Front.Two:hover ~ .Front.One { clip-path: polygon(0 0, 100% 0, 100% 0, 0 0) }
```

### [cards: clip-path with inset property](https://codepen.io/gyeka/pen/xxZJpJa)

made with: transition · :hover · clip-path

```css
.card { position: relative }
.card__inner-text { position: absolute; top: 0; clip-path: inset(0% 90% 0% 0%); transition: 0.5s ease-in-out }
.card__inner-text:hover { clip-path: inset(0% 0% 0% 0%); opacity: 1 }
span { position: absolute; top: 3rem }
```

### [Half moon](https://codepen.io/zette/pen/LYGrQrZ)

made with: clip-path

### [Video mask with clip-path follow mouse](https://codepen.io/supah/pen/ZEQRBRg)

on scroll: video.cover__embed: clip-path | made with: mix-blend-mode · requestAnimationFrame

```css
.cover__wrap { position: relative }
.cover__wrap:before { position: absolute; top: 0; mix-blend-mode: overlay }
.cover__embed { position: absolute }
```

```js
requestAnimationFrame(mouseFollow)
```

### [Clip-path Image Hover Effects With HTML & CSS](https://codepen.io/fadzrinmadu/pen/LYGmazd)

made with: transition · :hover · clip-path

```css
.container { position: relative }
.container .box { position: relative }
.container .box .image-box { position: absolute; top: 0; clip-path: circle(400px at center 100px); transition: 0.5s }
.container .box:hover .image-box { clip-path: circle(80px at center 100px) }
.container .box .image-box img { position: absolute; top: 0 }
.container .box .content-box { position: absolute; bottom: 0 }
.container .box .content-box h2, .container .box .content-box p, .container .box { opacity: 0; transition: 0.5s; transform: translateY(20px) }
.container .box:hover .content-box h2 { opacity: 1; transform: translateY(0) }
.container .box:hover .content-box p { opacity: 1; transform: translateY(0) }
.container .box:hover .content-box a { opacity: 1; transform: translateY(0) }
```

### [clip-path animation (card)](https://codepen.io/gyeka/pen/BajxMKJ)

on scroll: div.container-inner--image: clip-path+top | made with: transition · :hover · clip-path

```css
.card-container, .container { box-shadow: 0 2.5px 3px -19px rgba(0, 0, 0, 0.013), 0 26.9px 9.4px -19px rgba(0, 0, 0, 0.051), 0 29px 48px -19px rgba(0, 0, 0, 0.24) }
.container-inner--text { position: absolute; top: 50%; transform: translate(-50%, -70%) }
.container-inner--text > h2 { text-transform: uppercase; margin-bottom: 1rem }
.container-inner--image { clip-path: circle(20% at 94% 14%); transition: all 0.4s ease-in-out }
.container:hover .container-inner--image { clip-path: circle(80%) }
.card-container { position: relative }
.card-container:hover > .card-container--inner { clip-path: circle(100%); opacity: 1 }
.card-container:hover > span { opacity: 0 }
.card-container--inner { position: absolute; top: 0; clip-path: circle(12% at 86% 22%); transition: all 0.4s ease-in-out; opacity: 0.8 }
.card-container--inner--text > h2 { text-transform: uppercase }
span { position: absolute; top: 12.8%; transition: opacity 0.4s ease-in-out }
```

### [Hamburger NavBar with transition effects](https://codepen.io/tusharkashyap63/pen/LYGmQrW)

made with: position: fixed · transition · clip-path

```css
nav { position: relative }
.hamburger { position: absolute; top: 50%; transform: translateY(-50%) }
.nav-items { position: fixed; -webkit-clip-path: circle(1px at 85% -10%); clip-path: circle(1px at 85% -10%); transition: all 0.8s ease-out }
.nav-items.show { -webkit-clip-path: circle(1000px at 85% -20%); clip-path: circle(1000px at 85% -20%) }
.nav-item { opacity: 0 }
.nav-item:nth-child(1) { transition: all 0.5s ease 0.2s }
.nav-item:nth-child(2) { transition: all 0.5s ease 0.4s }
.nav-item:nth-child(3) { transition: all 0.5s ease 0.6s }
.nav-item.fade { opacity: 1 }
p { margin-top: 42.5vh; transform: translateY(-50%) }
```

### [CSS Star – clip-path](https://codepen.io/borntofrappe/pen/VweXyBj)

made with: clip-path

```css
div { clip-path: polygon( 50% 0, 65% 35%, 100% 35%, 70% 60%, 85% 100%, 50% 80%, 15% 100%, 30% 60%, 0% 35%, 35% 35% ) }
```

### [clip-path mouse follow target](https://codepen.io/huxhu/pen/YzwaGRN)

held: fixed div.shot, fixed div.man | made with: position: fixed · @keyframes · transition · clip-path · custom properties driven by JS · pointer / mouse tracking

```css
.wrap { transition: filter 3s 0.75s }
.wrap.active { filter: grayscale(100%) }
h1 { position: absolute; bottom: 0.75em }
.man { position: fixed; top: 0; bottom: 0; clip-path: circle(90px at var(--x) var(--y)) }
.init .man { opacity: 0.2 }
.wrap:not(.init) .man img { animation: run 3s infinite alternate }
.wrap:not(.init) .man img.active { animation-play-state: paused }
.shot { position: fixed; top: -90px; opacity: 0.25; transition: opacity 0.5s }
.shot:before, .shot:after { position: absolute; top: 50%; margin-top: -1px }
.shot:after { transform: rotate(90deg) }
.init .shot { opacity: 0 }
.active .shot { animation: none }
```

```js
style.setProperty('--x',(x)+'px')
style.setProperty('--y',(y)+'px')
addEventListener('mousemove', showClipContent)
```

### [Mouse hover reveal image in text - Strategy Meets Creativity](https://codepen.io/wescouch/pen/QWymNae)

made with: clip-path · mask · GSAP · pointer / mouse tracking

```css
:root { --clip-position: 50% 50%; --mask-position: 50% 50% }
body { padding-top: 2rem; padding-bottom: 2rem }
h1 { position: relative; text-transform: uppercase }
h1 .fills { position: absolute; top: 50%; transform: translate(-50%, -50%) }
h1 .masks { clip-path: circle(400px at var(--clip-position)); -webkit-mask-image: radial-gradient(circle, white 0%, rgba(255, 255, 255, 0) 66%); -webkit-mask-size: 500px 500px; -webkit-mask-repeat: no-repeat; -webkit-mask-position:  }
h1 .masks .mask { background-position: center }
h1 .masks { clip-path: circle(800px at var(--clip-position)); -webkit-mask-size: 800px 800px }
```

```js
addEventListener('mousemove', e => {
gsap.to(mask, {
```

### [Clipped Image Reveal on Hover](https://codepen.io/kathykato/pen/pogaOKG)

on hover of a.link: a.link: color, span.link-text: opacity+clip-path, span.image-container: opacity, img.link-image: transform+top | made with: transition · :hover · clip-path · custom properties driven by JS · pointer / mouse tracking

```css
.container { position: relative }
.link { position: relative; text-transform: uppercase; transition: color 275ms ease }
.link:hover ~ .hover-container .link-text { opacity: 1 }
.link:hover ~ .hover-container .image-container { opacity: 1 }
.link-text { position: absolute; top: 0; bottom: 0; text-transform: uppercase; -webkit-clip-path: circle(75px at var(--x) var(--y)); clip-path: circle(75px at var(--x) var(--y)); opacity: 0; transition: opacity 250ms ease }
.image-container { position: absolute; top: 0; opacity: 0; transition: opacity 250ms ease }
.image-inner { position: absolute; top: -75px }
.link-image { -o-object-position: center; object-position: center; filter: brightness(0.9) }
```

```js
style.setProperty('--x',(x)+'px')
style.setProperty('--y',(y)+'px')
addEventListener('mousemove', showImgContent)
```

### [Rounded Corners using Clip-Path shape() Curve By & Curve To](https://codepen.io/timhjellum/pen/wvMqJgV)

made with: clip-path

```css
:nth-child(1 of div) { clip-path: shape(from var(--r) 0, hline to calc(100% - var(--r)), curve by var(--r) var(--r) with var(--r) 0, vline to calc(100% - (var(--r))), curve by calc(-1*var(--r)) var(--r) with 0 var(--r), hline to var(--r), curv }
:nth-child(2 of div) { clip-path: shape(from var(--r) 0, hline to calc(100% - var(--r)), curve to 100% var(--r) with 100% 0, vline to calc(100% - var(--r)), curve to calc(100% - var(--r)) 100% with 100% 100%, hline to var(--r), curve to 0 calc }
h1 { padding-top: clamp(2em, 7vh, 30px); padding-bottom: clamp(2em, 7vh, 30px) }
footer { position: absolute; bottom: 0 }
```

### [Burger menu with circle transition](https://codepen.io/joshuk/pen/PoZWQbe)

made with: transition · :hover · clip-path

```css
.burger { position: absolute; top: 3rem }
.burger span:not(:last-child) { margin-bottom: 0.25rem }
.menu { position: absolute; top: 0; clip-path: circle(0 at calc(100% - 4.25rem) 3.6rem); transition: clip-path 0.4s }
.menu.expanded { clip-path: circle(137.5% at calc(100% - 4.25rem) 3.6rem) }
.menu .close { position: absolute; top: 3rem }
.menu .close span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px) }
.menu .close span:nth-child(2) { transform: rotate(-45deg) translate(-2px, 2px) }
nav { position: relative }
nav a { text-transform: uppercase }
main { position: absolute; top: 3rem }
h1 { text-transform: uppercase }
```

### [Clip-Path Hovers](https://codepen.io/rebeccaeilering/pen/jOWqRyj)

made with: transition · :hover · clip-path

```css
div { position: relative; filter: drop-shadow(-1px 6px 6px rgba(0, 0, 0, 0.5)); transition: filter .5s ease-in-out; margin-bottom: 100px }
div { margin-bottom: 0 }
div:first-child:hover img { filter: hue-rotate(150deg); clip-path: polygon(100% 0%, 75% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%) }
div:nth-child(2):hover img { filter: hue-rotate(100deg); clip-path: polygon(100% 0%, 75% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%) }
img { transform: rotate(3deg); clip-path: polygon(100% 0, 100% 50%, 100% 100%, 0% 100%, 0 50%, 0% 0%); transition: clip-path .5s ease-in-out }
div:nth-child(2) img { transform: scaleX(-1) rotate(3deg) }
div:hover { filter: drop-shadow(-1px 6px 4px rgba(0, 0, 0, 0.5)) }
```

### [Clip-Path Button Hover Effects](https://codepen.io/thegovernor/pen/KKVdmEr)

on hover of button.btn: button.btn: clip-path+background | made with: transition · :hover · clip-path

```css
.btn-1 { clip-path: polygon(0 0, 29% 0, 72% 0, 100% 0, 100% 100%, 60% 100%, 0 100%); transition: clip-path 500ms ease-in }
.btn-1:hover, .btn-1:focus { clip-path: polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%) }
.btn-2 { clip-path: polygon(30% 0%, 70% 0%, 100% 0, 100% 100%, 70% 100%, 30% 100%, 0 100%, 0 0); transition: all 500ms ease-in; position: relative }
.btn-2:hover, .btn-2:focus { clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%) }
.btn-2::before { position: absolute; top: 10px; bottom: 10px; clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%); transform: scale(0, 0); transition: transform 500ms ease-in }
.btn-2:hover::before, .btn-2:focus::before { transform: scale(1, 1) }
```

### [A squish animation demo](https://codepen.io/xxf1996/pen/BajNzRb)

held: fixed div.dg | on hover of li.cr: div.slider: background, div.slider-fg: background | made with: @keyframes · :hover · clip-path · custom properties driven by JS

```css
from { clip-path: var(--test-from) }
50% { clip-path: var(--test-to) }
to { clip-path: var(--test-from) }
#btn { position: absolute; top: 50%; transform: translate(-50%, -50%); animation: test var(--test-duration) cubic-bezier(0.4, 0.02, 0.72, 2.77) infinite }
#btn::after { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.pause { animation-play-state: paused !important }
.play { animation-play-state: running !important }
@keyframes test animates clip-path
```

```js
style.setProperty('--test-from', `polygon(${info.from})`)
style.setProperty('--test-to', `polygon(${info.to})`)
style.setProperty('--test-duration', config.duration + 's')
```

### [Rotating Hexagon](https://codepen.io/sanskarbansal/pen/MWKYGVG)

on scroll: div.spiner: transform+top, div.spiner__border: background+top | made with: @keyframes · transition · clip-path

```css
body { transition: background-color 4s }
.spiner { position: relative; animation-name: rotating; animation-duration: 4s; animation-iteration-count: infinite; animation-fill-mode: both; clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%) }
.spiner__border { position: absolute; top: 20px; transition: background-color 4s; clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%) }
from { transform: rotate(0deg) }
to { transform: rotate(2160deg) }
@keyframes rotating animates transform, background-image
```

### [How to shape text no matter how long it is](https://codepen.io/mrmatteastwood/pen/VweYYWw)

made with: clip-path

```css
div.services-gradient-left { clip-path: polygon(0 0, 0 100%, 100% 100%) }
div.services-gradient-right { clip-path: polygon(100% 0, 100% 100%, 0 100%) }
```

### [side menu clip path animation](https://codepen.io/Zorlimar/pen/NWxWmzX)

made with: transition · :hover · clip-path

```css
body { transition: background-color 325ms cubic-bezier(0.83, 0, 0.17, 1) }
.menu { position: absolute; top: 0; bottom: 0; -webkit-clip-path: ellipse(10px 10px at 125% 30%); clip-path: ellipse(10px 10px at 125% 30%); will-change: clip-path; transition: transform 450ms cubic-bezier(0.83, 0, 0.17, 1), -we }
.menu.is-open { transform: translatex(-100%); -webkit-clip-path: ellipse(122% 122% at 100% 30%); clip-path: ellipse(122% 122% at 100% 30%); transition: transform 450ms cubic-bezier(0.83, 0, 0.17, 1), -webkit-clip-path 600ms 50ms cubic-b }
.menu .nav-body > li { text-transform: uppercase }
.menu .nav-body > li i { position: relative; top: -0.275rem }
.menu .nav-body > li:not(:last-child) { border-bottom: 1px solid rgba(255, 255, 255, 0.125) }
#toggle { position: absolute; top: 4rem; transform: translateY(-50%) translatex(-4px); transition: transform 450ms cubic-bezier(0.83, 0, 0.17, 1), border-color 400ms }
#toggle.menu-open { transform: translatex(-18.75rem) translateY(-50%) rotatez(-0.25turn); transition: transform 350ms 100ms cubic-bezier(0.83, 0, 0.17, 1) }
#toggle.menu-open .bar { transform: rotatez(0.125turn) }
#toggle.menu-open .bar:first-child { transform: translateY(7px) rotatez(0.125turn) }
#toggle.menu-open .bar:last-child { transform: translateY(-7px) rotatez(-0.125turn) }
#toggle .bar { transition: transform 350ms 100ms cubic-bezier(0.83, 0, 0.17, 1); -webkit-animation-play-state: paused !important; animation-play-state: paused !important }
```

### [CSS Night Train Ride Animation](https://codepen.io/TurkAysenur/pen/oNbNmxY)

on scroll: div.stars: transform ×2, div.night: transform ×2, div.moon: transform | made with: @keyframes · clip-path

```css
.container { position: relative }
.container-wrapper { position: absolute; -webkit-clip-path: polygon(37% 0, 65% 0, 100% 100%, 0% 100%); clip-path: polygon(37% 0, 65% 0, 100% 100%, 0% 100%) }
.star-container { position: absolute }
.stars { position: relative; will-change: transform; -webkit-animation: infinity-loop 5s infinite linear 0.1s both; animation: infinity-loop 5s infinite linear 0.1s both }
.moon { position: absolute; top: 100px; box-shadow: -11px -11px 0 0 var(--body-color) inset; -webkit-animation: moon 20s infinite linear 0.1s both; animation: moon 20s infinite linear 0.1s both }
.star { position: absolute }
.star:nth-child(1) { top: 60px }
.star:nth-child(2) { top: 40px }
.star:nth-child(2):before { top: 4px; position: absolute; border-bottom: 1px solid var(--body-color) }
.star:nth-child(3) { top: 70px }
.star:nth-child(3):before { top: 5px; position: absolute; border-bottom: 2px solid var(--body-color) }
.star:nth-child(4) { top: 120px }
```

### [a jar of nature](https://codepen.io/andrewrock/pen/ExPxbLL)

made with: clip-path

```css
article { -webkit-clip-path: url(#svgPath); clip-path: url(#svgPath); position: relative }
article::after { position: absolute; filter: grayscale(1) }
.lake { bottom: 0; position: absolute }
.lake::before { position: absolute; top: 0 }
.boulder { position: absolute; bottom: 35px }
.boulder::before { bottom: 3px; box-shadow: 6px 6px 6px 0px rgba(255, 250, 250, 0.4); position: absolute }
.flat-land { bottom: 60px; position: absolute }
.mountains-wrapper { top: 75px }
.mountains-wrapper, .main-mountain-wrapper { position: absolute }
.main-mountain-wrapper { top: 60px }
.mountain-group, .main-mountain-group { position: absolute; top: 0; -webkit-clip-path: polygon(50% 0%, 0% 100%, 100% 100%); clip-path: polygon(50% 0%, 0% 100%, 100% 100%) }
.mountain-group::before, .main-mountain-group::before { box-shadow: inset 0px 2px 7px 2px rgba(79, 59, 88, 0.35); position: absolute; top: -5px }
```

### [Jamstack Conf 2020 Masked Video](https://codepen.io/adrianparr/pen/ZEbdaLM)

made with: clip-path

```css
.hero-video { -webkit-clip-path: url(#rounded-rectangle); clip-path: url(#rounded-rectangle); position: absolute; top: 0 }
```

### [Polygon truncation (drag slider)](https://codepen.io/thebabydino/pen/abvrYNg)

made with: transition · clip-path · mask

```css
.s2d { -webkit-clip-path: polygon(calc(var(--j)*50% + var(--k)*93.30127%) calc(var(--j)*0% + var(--k)*75%), calc(var(--k)*50% + var(--j)*93.30127%) calc(var(--k)*0% + var(--j)*75%), calc(var(--j)*93.30127% + var(--k)*6.69873%)  }
.s2d:nth-child(2) { -webkit-clip-path: polygon(calc(var(--j)*14.64466% + var(--k)*85.35534%) calc(var(--j)*14.64466% + var(--k)*14.64466%), calc(var(--k)*14.64466% + var(--j)*85.35534%) calc(var(--k)*14.64466% + var(--j)*14.64466%), calc(va }
.s2d:nth-child(3) { -webkit-clip-path: polygon(calc(var(--j)*50% + var(--k)*97.55283%) calc(var(--j)*0% + var(--k)*34.54915%), calc(var(--k)*50% + var(--j)*97.55283%) calc(var(--k)*0% + var(--j)*34.54915%), calc(var(--j)*97.55283% + var(--k }
.s2d:nth-child(4) { -webkit-clip-path: polygon(calc(var(--j)*25% + var(--k)*75%) calc(var(--j)*6.69873% + var(--k)*6.69873%), calc(var(--k)*25% + var(--j)*75%) calc(var(--k)*6.69873% + var(--j)*6.69873%), calc(var(--j)*75% + var(--k)*100%)  }
.s2d:nth-child(5) { -webkit-clip-path: polygon(calc(var(--j)*50% + var(--k)*89.09157%) calc(var(--j)*0% + var(--k)*18.82551%), calc(var(--k)*50% + var(--j)*89.09157%) calc(var(--k)*0% + var(--j)*18.82551%), calc(var(--j)*89.09157% + var(--k }
.s2d:nth-child(6) { -webkit-clip-path: polygon(calc(var(--j)*30.86583% + var(--k)*69.13417%) calc(var(--j)*3.80602% + var(--k)*3.80602%), calc(var(--k)*30.86583% + var(--j)*69.13417%) calc(var(--k)*3.80602% + var(--j)*3.80602%), calc(var(-- }
form { margin-bottom: 1em; filter: grayScale(var(--not-focus)); transition: filter .3s }
input[type='range']::-webkit-slider-thumb { margin-top: -0.375em }
input[type='range']::-moz-range-thumb { margin-top: 0em }
output { transform: translate(calc(var(--not-i)*(var(--pos) - .5*12.5em))) }
output::after { transform: scale(calc(var(--i) + var(--not-i)*var(--focus))); --mask: linear-gradient(#ff0000, #ff0000) padding-box, conic-gradient(from calc(45deg + var(--not-i)*90deg) at var(--xy), red 25%, transparent 0%) var(--xy)/5 }
```

### [eevee](https://codepen.io/raczo/pen/XWmwbrz)

made with: @keyframes · clip-path

```css
.scene { position: relative }
.grid { position: relative }
.cell { position: relative }
.cell > div { position: absolute; top: 0 }
.t1 { clip-path: polygon( 0% 0%, 100% 0%, 100% 100% ) }
.t2 { clip-path: polygon( 0% 0%, 100% 100%, 0% 100% ) }
.t3 { clip-path: polygon( 0% 0%, 100% 0%, 0% 100% ) }
.t4 { clip-path: polygon( 100% 0%, 100% 100%, 0% 100% ) }
.hex { clip-path: polygon( 50% 0%, 85% 15%, 100% 50%, 85% 85%, 50% 100%, 15% 85%, 0% 50%, 15% 15% ) }
.sep::before { position: absolute; top: 0 }
.eevee { position: absolute; top: 50%; transform: rotateZ(360deg) translate(-50%, -50%) }
.two .scene { box-shadow: 0px 0px 10px 0px rgba(156, 116, 80, 0.84) }
```

### [Light-Dark theme](https://codepen.io/pirate_barbosa/pen/VwvNvKP)

made with: transition · clip-path

```css
.wrapper { position: relative }
.container { transition: all 1.5s ease }
.clip-cover { position: absolute; top: 0; transition: background 1.5s ease; -webkit-clip-path: circle(10% at bottom left); clip-path: circle(10% at bottom left) }
.clip-cover.overlay { transition: all 1s ease-in-out; -webkit-clip-path: circle(100% at center); clip-path: circle(100% at center) }
```

### [Round Avatars with Clip-path](https://codepen.io/cteague/pen/xxwmRJE)

made with: clip-path

```css
.large-avatar { clip-path: circle(76px) }
.large-avatar img { clip-path: circle(72px) }
.small-avatar { clip-path: circle(38px) }
.small-avatar img { clip-path: circle(36px) }
.tiny-avatar { clip-path: circle(20px) }
.tiny-avatar img { clip-path: circle(19px) }
```

### [Circle Nav Reveal](https://codepen.io/garybyrne1/pen/PoPyLMG)

held: fixed nav.nav | on hover of button.nav-toggle: button.nav-toggle: filter | made with: position: fixed · transition · :hover · clip-path

```css
header .nav-toggle { transition: filter 0.5s ease }
header .nav-toggle:hover, header .nav-toggle:focus { filter: brightness(1.5) }
nav { position: absolute; top: 0; position: fixed; -webkit-clip-path: circle(0px at 98% 5px); clip-path: circle(0px at 98% 5px); transition: all 0.4s; will-change: clip-path }
nav.open { transition: all 0.4s; -webkit-clip-path: circle(100% at 60% 20%); clip-path: circle(100% at 60% 20%) }
nav li { position: relative }
nav li, nav li::before { transition: all 0.5s ease-in-out }
nav li.active::before, nav li:hover::before { position: absolute; top: 0 }
nav li a:focus { outline-offset: 3px }
nav .interior { border-bottom: 1px solid #fff }
.visually-hidden { position: absolute !important }
```

### [Tales From The Loop intro animation (pure CSS)](https://codepen.io/pieter-biesemans/pen/bGVmLwz)

on scroll: div.letter: clip-path ×15, div.letter: transform+clip-path+top ×11, div.letter: transform+top ×6 | on hover of a.: div.letter: clip-path ×15, div.letter: transform+clip-path+top ×11, div.letter: transform+top ×6 | made with: @keyframes · :hover · clip-path

```css
div { position: absolute }
body { top: 0 }
body .message { position: absolute; top: 1vw }
body .message a { border-bottom: 1px solid #444 }
body .wrapper { top: 50%; transform: translate(-50%, -50%); animation: fadein 4s 0s ease forwards }
body .wrapper .letter { position: relative }
body .wrapper .letter:nth-child(1) { animation: ltr1 16s 2s ease-out forwards }
body .wrapper .letter:nth-child(2) { animation: ltr2 16s 2s ease-out forwards }
body .wrapper .letter:nth-child(3) { animation: ltr3 16s 2s ease-out forwards }
body .wrapper .letter:nth-child(4) { animation: ltr4 16s 2s ease-out forwards }
body .wrapper .letter:nth-child(5) { animation: ltr5 16s 2s ease-out forwards }
body .wrapper .letter:nth-child(6) { animation: ltr6 16s 2s ease-out forwards }
```

### [vs](https://codepen.io/raczo/pen/NWGLpEo)

made with: clip-path

```css
.abs { position: absolute; top: 0 }
.vs { position: relative }
.vs-1 .one { clip-path: polygon( 51% 0%, 47% 27%, 53% 25%, 43% 86%, 47% 85%, 45% 100%, 0% 100%, 0% 0% ) }
.vs-1 .two { clip-path: polygon( 57% 0%, 53% 18%, 57% 17%, 45% 83%, 49% 82%, 45% 100%, 100% 100%, 100% 0% ) }
.vs-1 .cloud { transform: scale(1.2) }
.vs-1 .blob { position: absolute }
.vs-1 .blob:nth-child(1) { top: 0%; transform: scale(1.4); border-top: calc(var(--cloud-border) - 1px) solid black; box-shadow: inset 0px -5px 0px 0px rgb(222, 222, 222) }
.vs-1 .blob:nth-child(2) { top: 0%; transform: scale(1.2); border-top: var(--cloud-border) solid black }
.vs-1 .blob:nth-child(3) { bottom: 0%; transform: scale(1.2); border-bottom: var(--cloud-border) solid black; box-shadow: inset 0px -5px 0px 0px rgb(222, 222, 222) }
.vs-1 .blob:nth-child(4) { bottom: 0%; transform: scale(1.5); border-bottom: var(--cloud-border) solid black; box-shadow: inset -8px -8px 0px 0px rgb(222, 222, 222) }
.vs-1 .text { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.vs-1 .content { position: relative }
```

### [CYB — Progress ring loader](https://codepen.io/lucasvallenet/pen/PoPBwOy)

held: fixed h1.t-t1, fixed span.o-progress, fixed span.o-progress, fixed span.o-progress, fixed span.o-bottom | made with: position: fixed · clip-path · custom properties driven by JS · scroll listener

```css
.t-t1 { position: fixed; top: 0; text-transform: uppercase }
.o-bottom { position: fixed; bottom: 1em }
.o-bottom > *:not(:first-child) { margin-top: 0.5em }
.o-progress { --clip-path: 50% 50%; position: fixed; top: calc(50% - 40vmin/2) }
.o-progress--1 { clip-path: polygon(var(--clip-path)) }
.o-progress--2 { clip-path: polygon(var(--clip-path)); transform: rotate(-45deg) }
.o-progress--3 { opacity: calc(.5 + .5 * var(--perc)); transform: rotate(calc(-45deg + 360deg * var(--perc))) }
.o-progress__img { position: absolute; top: calc(50% - 150%/2); clip-path: polygon(var(--clip-path)); transform: scale(calc(.5 + .5 * var(--perc))) }
.o-progress__img:after, .o-progress__img:before { position: absolute; top: 0; transform: rotate(calc(45deg - 360deg * var(--perc))) }
.o-progress__img:before { background-position: 50% 50% }
.o-progress__img:after { transform: scale(calc(.5 - .25 * var(--perc))) }
```

```js
addEventListener('scroll', () => {
```

### [Split text with clip-path | 300 followers 'celebration'](https://codepen.io/havardob/pen/PoPaWaE)

made with: clip-path

```css
.text-box { position: relative }
h1:nth-child(2) { position: absolute; -webkit-clip-path: inset(-1% -1% 50% -1%); clip-path: inset(-1% -1% 50% -1%) }
p { margin-top: 1em }
p span { transform: rotate(90deg); margin-top: 0.25em }
.container { position: absolute; top: 0; bottom: 0 }
```

### [Clip Path Button Animation](https://codepen.io/crawpdx/pen/oNjyzoE)

made with: transition · :hover · clip-path

```css
.btn { position: relative }
.btn::before { -webkit-clip-path: circle(0% at 50% 50%); clip-path: circle(0% at 50% 50%); transition: all 0.5s ease-in-out; position: absolute; top: 0; bottom: 0; opacity: 1 }
.btn:hover::before { -webkit-clip-path: circle(100%); clip-path: circle(100%); opacity: 1 }
.btn .btn-text { position: relative; text-transform: uppercase }
```

### [Valorant Logo](https://codepen.io/Phong6698/pen/pojVjjq)

made with: @keyframes · clip-path

```css
.logo { animation: 400ms ease-in-out 500ms 1 slideInFromTop backwards }
.logo .first { position: absolute; clip-path: polygon(0 10%, 70% 90%, 35% 90%, 0 50%) }
.logo .second { position: absolute; clip-path: polygon(100% 10%, 100% 50%, 88% 65%, 55% 65%) }
h1 { animation: 400ms ease-in-out 800ms 1 slideInFromBottom backwards }
0% { transform: translateY(300%); opacity: 0 }
100% { transform: translateY(0); opacity: 1 }
0% { transform: translateY(-100%); opacity: 0 }
100% { transform: translateY(0); opacity: 1 }
@keyframes slideInFromBottom animates transform, opacity
@keyframes slideInFromTop animates transform, opacity
```

### [css-doodle with clip-path borders](https://codepen.io/ildarmgt/pen/zYvPamK)

made with: clip-path

```css
--draw: ( :doodle { position: absolute; top: 0 }
:after { position: absolute; top: 0; clip-path: polygon( @var(--p1x) @var(--p1y), @var(--p2x) @var(--p2y), @var(--p3x) @var(--p3y) ); transform: scale(0.985) }
.art:after { position: absolute; top: 0 }
```

### [Blackstar](https://codepen.io/suemcmahon/pen/LYpOEWY)

held: fixed div.star | made with: position: fixed · clip-path

```css
.star { position: fixed; top: 50%; transform: translate(-50%, -50%) }
.star__big { -webkit-clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35 }
.star-group--one { -webkit-clip-path: polygon(50% 0%, 50% 51%, 50% 100%, 0% 50%); clip-path: polygon(50% 0%, 50% 51%, 50% 100%, 0% 50%); transform: rotate(-25deg) }
.star-group--two { -webkit-clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35 }
.star-group--three { -webkit-clip-path: polygon(46% 35%, 61% 35%, 98% 35%, 68% 57%, 54% 66%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); clip-path: polygon(46% 35%, 61% 35%, 98% 35%, 68% 57%, 54% 66%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39%  }
.star-group--four { -webkit-clip-path: polygon(46% 35%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 42% 64%, 32% 57%, 2% 35%, 39% 35%); clip-path: polygon(46% 35%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 42% 64%, 32% 57%, 2% 35%, 39%  }
.star-group--five { -webkit-clip-path: polygon(46% 35%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 42% 64%, 32% 57%, 2% 35%, 39% 35%); clip-path: polygon(46% 35%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 42% 64%, 32% 57%, 2% 35%, 39%  }
.star-group--six { -webkit-clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 41% 63%, 32% 57%, 35% 48%, 39% 35%); clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 41% 63%, 32% 57%, 35% 48%, 39%  }
```

### [Image clip-path with background-lazyload](https://codepen.io/timmaurice/pen/GRpMOXp)

made with: @keyframes · transition · clip-path

```css
.lazyload { background-position: center; clip-path: polygon(0% 5%, 95% 0%, 100% 100%, 5% 95%); padding-top: 50% }
.spinner { position: relative }
.spinner:before, .spinner:after { opacity: 1; position: absolute; transition: opacity 0.3s ease-in-out }
.spinner:before { top: 0; bottom: 0 }
.spinner:after { top: calc(50% - 5em); border-top: 1.1em solid rgba(255, 255, 255, 0.2); border-bottom: 1.1em solid rgba(255, 255, 255, 0.2); animation: load 1.1s infinite linear }
.spinner.fadeOutSpinner:before, .spinner.fadeOutSpinner:after { opacity: 0 }
0% { -webkit-transform: rotate(0deg); transform: rotate(0deg) }
100% { -webkit-transform: rotate(360deg); transform: rotate(360deg) }
@keyframes load animates -webkit-transform, transform
```

### [Animated Flipping Double Page Panel Effect](https://codepen.io/GeoffreyCrofte/pen/gOaGGzZ)

on hover of img.: div.page1: transform+top | made with: transition · :hover · clip-path · 3D (perspective / preserve-3d)

```css
.panel { transition: all 1s; perspective: 600px }
.panel:hover .page1, .panel.open .page1 { transform: rotateY(0deg) }
[class^="page"] { box-shadow: 0 2px 4px -2px rgba(0, 0, 0, .1), 0 4px 8px -4px rgba(0, 0, 0, .12), 0 8px 16px -8px rgba(0, 0, 0, .15), 0 16px 24px -16px rgba(0, 0, 0, .17), 0 24px 48px -24px rgba(0, 0, 0, .25) }
.page1 { position: relative; transition: all 1s; transform: rotateY(180deg) }
.front, .back { position: absolute }
.front { transform: rotateY(180deg) }
.front::before { position: absolute; top: 0; bottom: 0; -webkit-clip-path: polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 100%); clip-path: polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 100%) }
p + p { padding-top: 4px }
.button { text-transform: uppercase }
```

### [Clip-Path Shapes](https://codepen.io/EdwardGray/pen/GRpMvPO)

made with: transition · :hover · clip-path

```css
.octagon { clip-path: polygon( 20% 0, 80% 0, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0 80%, 0 20% ); transition: clip-path 0.2s }
.octagon:hover { clip-path: polygon( 10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%, 0 10% ) }
.bevelled { clip-path: polygon( 10% 0, 90% 0, 100% 10%, 0 50%, 100% 90%, 90% 100%, 10% 100%, 0 90%, 100% 50%, 0 10% ); transition: clip-path 0.2s }
.bevelled:hover { clip-path: polygon( 20% 0, 80% 0, 100% 20%, 0 50%, 100% 80%, 80% 100%, 20% 100%, 0 80%, 100% 50%, 0 20% ) }
.hexagon { clip-path: polygon( 0 50%, 25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100% ); transform: scaleX(calc(1/.866)) }
.hexagon2 { clip-path: polygon( 50% 0 , 0 25% , 0 75% , 50% 100% , 100% 75% , 100% 25% ); transform: scaleY(calc(1/.866)) }
.outside { clip-path: polygon( 0 0, 150px 0, 150px 40%, 100% 50%, 150px 60%, 150px 100%, 0 100% ) }
```

### [Clip-Path Shapes](https://codepen.io/EdwardGray/pen/mdeBMaB)

made with: nothing recognised — read the code

### [CSS3 + JS Roulette Spinner](https://codepen.io/mr137/pen/eYpEjVK)

made with: @keyframes · :hover · clip-path · requestAnimationFrame

```css
#roulette-spinBtn { position : absolute; margin-top : 25%; box-shadow : 0px 0px 1vmax black, inset 0px 0px 0.75vmax black; animation: rouletteBreath 10s infinite }
0% { box-shadow : 0px 0px 1vmax black, inset 0px 0px 0.75vmax black }
50% { box-shadow : 0px 0px 2vmax white, inset 0px 0px 0.75vmax black }
100% { box-shadow : 0px 0px 1vmax black, inset 0px 0px 0.75vmax black }
.roulette-highlightPiece { opacity: 0.75 }
.roulette-spinning { box-shadow : 0px 0px 1vmax black, inset 0px 0px 0.75vmax black !important; animation: none !important }
#roulette-spinBtn:hover { box-shadow : 0px 0px 1vmax white, inset 0px 0px 0.75vmax black; animation: none !important }
#roulette-spinBtn:active { transform: scale(0.98); box-shadow : 0px 0px 1vmax black, inset 0px 0px 0.75vmax black; animation: none !important }
#roulette-spinHolster { position : absolute }
#roulette-spinner { border-top : 1vmax solid transparent; border-bottom : 1vmax solid transparent }
#roulette-container { position : relative; padding-bottom : 100%; box-shadow : 0px 0px 0.25vmax black }
.roulette-section { position : absolute }
```

```js
requestAnimationFrame(spin.bind(this))
```

### [Fetch the Bolt Cutters with `clip-path`](https://codepen.io/meowwwls/pen/LYpjEQx)

made with: clip-path · mix-blend-mode

```css
.title { text-transform: uppercase; position: relative }
.title__feature { border-top: var(--fetch-border) }
.subtitle { position: relative }
.panels { position: relative; box-shadow: 1.5rem 1.5rem 0 var(--lemon-light) }
.panel__img { filter: grayscale(1) contrast(2); mix-blend-mode: darken; -webkit-clip-path: var(--clip); clip-path: var(--clip) }
.panel--feature { -webkit-clip-path: var(--clip); clip-path: var(--clip); transform: scale(1.35) }
.panel--smol { position: relative; transform: scale(0.75) }
.panel--smol::before, .panel--smol::after { --offset: 4%; position: absolute; -webkit-clip-path: var(--clip); clip-path: var(--clip) }
.panel--smol::before { top: var(--offset) }
.panel--smol::after { top: calc(var(--offset) * -0.75); mix-blend-mode: multiply }
.wavy-line { margin-top: -1.5rem; position: relative }
.title__feature { border-top: none }
```

### [Funnel Chart (based on clip-path)](https://codepen.io/ln-dim/pen/zYvwmLL)

made with: :hover · clip-path

```css
div.first { clip-path: polygon(0% 0%, 100% 60%, 100% 100%, 0% 80%) }
div.second { margin-top: -17%; clip-path: polygon(0% 0%, 100% 20%, 100% 40%, 0% 60%) }
div.third { margin-top: -53%; clip-path: polygon(0% 20%, 100% 0%, 100% 10%, 0% 80%) }
div.first2 { clip-path: polygon(0% 60%, 100% 80%, 100% 90%, 0% 100%) }
div.second2 { margin-top: -8%; clip-path: polygon(0% 10%, 100% 0%, 100% 20%, 0% 30%) }
div.third2 { margin-top: -71%; clip-path: polygon(0% 10%, 100% 0%, 100% 5%, 0% 20%) }
```

### [CSS Clip-Path Hover Effect](https://codepen.io/hexagoncircle/pen/PoPpKKg)

on hover of img.: div.image-wrapper: transform+clip-path, img.: transform, h2.title: transform | made with: transition · :hover · clip-path · mix-blend-mode

```css
.promo { position: relative }
.title { position: absolute; bottom: 0; transform: translate(-10%, -50%); transition: transform var(--duration) var(--ease-out) }
.title::after { opacity: 0; transform: translateX(-25%); transition: transform var(--duration) var(--ease-out), opacity var(--duration) var(--ease-out) }
.image-wrapper { -webkit-clip-path: polygon(100% 0, 100% 50%, 100% 100%, 0% 100%, 0 50%, 0% 0%); clip-path: polygon(100% 0, 100% 50%, 100% 100%, 0% 100%, 0 50%, 0% 0%); transition: transform var(--duration) var(--ease-out), -webkit-clip- }
.image-wrapper img { position: relative; transform: translateX(-10%); transition: transform var(--duration) var(--ease-out) }
.image-wrapper::after { position: absolute; top: 0; mix-blend-mode: multiply; opacity: 0; transform: translateZ(0); transition: opacity var(--duration) var(--ease-out) }
.promo:hover img { transform: translateX(0) }
.promo:hover .image-wrapper { -webkit-clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%); clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%); transform: translateX(25%) }
.promo:hover .title { transform: translate(5%, -50%) }
.promo:hover .title::after { opacity: 1; transform: translateX(0) }
.promo:hover .image-wrapper::after { opacity: 1 }
```

### [Image Hover with Clip-path property](https://codepen.io/designersnest/pen/PoPpoJR)

made with: transition · :hover · clip-path

```css
.container { position: relative }
img { transition: all 1s linear }
.back { position: absolute; filter: blur(7px) }
.hover-img:hover { clip-path: polygon(58% 100%, 58% 79%, 15% 76%, 57% 93%, 56% 86%, 58% 77%, 54% 74%, 53% 72%, 48% 65%, 47% 56%, 47% 54%, 45% 40%, 41% 19%, 46% 25%, 41% 20%, 41% 23%, 33% 23%, 29% 25%, 27% 28%, 26% 30%, 25% 33%, 23% 44%, 23 }
```

### [Season switch on image hover](https://codepen.io/camilleguy/pen/vYNgPZJ)

made with: transition · :hover · clip-path

```css
.component { position: relative }
.component:hover .slide.winter:hover { -webkit-clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%); clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%) }
.component:hover .slide.winter:not(:hover) { -webkit-clip-path: polygon(100% 100%, 100% 0%, 100% 0%, 100% 100%); clip-path: polygon(100% 100%, 100% 0%, 100% 0%, 100% 100%) }
.component:hover .slide.summer:hover { -webkit-clip-path: polygon(100% 0%, 100% 100%, 0% 100%, 0% 0%); clip-path: polygon(100% 0%, 100% 100%, 0% 100%, 0% 0%) }
.component:hover .slide.summer:not(:hover) { -webkit-clip-path: polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%); clip-path: polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%) }
.component:hover .slide:hover .title { transform: scale(1.4) }
.slide { position: absolute; top: 0; background-position: center; transition: -webkit-clip-path 600ms ease-in-out; transition: clip-path 600ms ease-in-out; transition: clip-path 600ms ease-in-out, -webkit-clip-path 600ms ease-in- }
.winter { -webkit-clip-path: polygon(80% 100%, 20% 0%, 100% 0%, 100% 100%); clip-path: polygon(80% 100%, 20% 0%, 100% 0%, 100% 100%) }
.summer { -webkit-clip-path: polygon(20% 0%, 80% 100%, 0% 100%, 0% 0%); clip-path: polygon(20% 0%, 80% 100%, 0% 100%, 0% 0%) }
.title { position: absolute; transition: transform 600ms ease-in-out }
.summer .title { bottom: 0; transform-origin: left bottom }
.winter .title { top: 0; transform-origin: right top }
```

### [Clip Path | Clip Text](https://codepen.io/nikhilrajs-1472363470/pen/oNjBZyJ)

made with: clip-path

```css
h1 { position: relative; top: 115px; -webkit-clip-path: polygon(var(--clip-path-polygon)); clip-path: polygon(var(--clip-path-polygon)) }
.wrapper { background-position: -100px -50px; box-shadow: 0 1px 2px rgba(0,0,0,0.07); -webkit-filter: saturate(1.5); filter: saturate(1.5) }
```

### [Clip path hover animation 💗](https://codepen.io/sheelah/pen/RwWKoOV)

on hover of li.: img.gallery-image: transform+top | made with: @keyframes · transition · :hover · clip-path · mix-blend-mode

```css
.gallery-image { transition: transform 0.3s ease-in-out }
li { position: relative }
li:before { position: absolute }
li:after { position: absolute; opacity: 0 }
li:hover .gallery-image { transform: scale(1.1) }
li:hover:after { bottom: 0; mix-blend-mode: overlay; filter: invert(15%); clip-path: path('M213.1,6.7c-32.4-14.4-73.7,0-88.1,30.6C110.6,4.9,67.5-9.5,36.9,6.7C2.8,22.9-13.4,62.4,13.5,110.9 C33.3,145.1,67.5,170.3,125,217c59.3-46.7,93.5-71. }
li:hover:after { animation: heart-wide-screen 0.3s cubic-bezier(.01,.75,.83,.67) 0.1s forwards }
li:hover:before { opacity: 1; bottom: 0; mix-blend-mode: overlay; filter: invert(35%); clip-path: path('M15,45 A30,30,0,0,1,75,45 A30,30,0,0,1,135,45 Q135,90,75,130 Q15,90,15,45 Z'); animation: small-heart 0.6s ease-out forwards }
0% { opacity: 0; transform: scale(-0.2) translate(22%, 60%) }
30% { opacity: 0.2; transform: scale(0.3) translate(22%, 50%) }
70% { opacity: 0.7; transform: scale(0.6) translate(22%, 35%) }
100% { opacity: 1; transform: scale(1) translate(22%, 22%) }
```

### [Figura ¿Quién quiere ser Millonario?](https://codepen.io/dlunire/pen/QWjKxyx)

made with: transition · :hover · clip-path

```css
:root { --margin-top: 10px }
.millonario__item { position: relative; transition: 300ms ease }
.millonario__item:not(:first-of-type) { margin-top: 10px }
.millonario__item::before { position: absolute; top: 0; bottom: 0 }
.opciones__item { transition: 300ms ease; position: relative }
.opciones__item:not(:first-of-type) { margin-top: 10px }
.opciones__item::before { position: absolute }
.button { position: relative; padding-top: calc(var(--separacion)); padding-bottom: calc(var(--separacion)); transition: 300ms ease; clip-path: var(--formas); background-position: center center }
.button:active { transform: scale(0.98) }
.button::before { transition: 300ms ease; position: absolute; top: var(--separacion); bottom: var(--separacion); clip-path: var(--formas) }
.fondoA::before { transition: 300ms ease }
```

### [Responsive CSS Grid - Books](https://codepen.io/andybarefoot/pen/oNjxYYG)

made with: :hover · clip-path

```css
li { position: relative; padding-bottom: 100%; margin-top: -50% }
li::before, li::after { position: absolute; background-position: left, right }
li::before { clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); -webkit-clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%) }
li::after { clip-path: polygon(100% 50%, 50% 100%, 0 50%, 20% 50%, 50% 80%,80% 50%); -webkit-clip-path: polygon(100% 50%, 50% 100%, 0 50%, 20% 50%, 50% 80%,80% 50%) }
img { position: absolute; top: 50%; transform: translateX(-50%) translateY(-60%); box-shadow: 5px -5px 10px rgba(0, 0, 0, 0.3); transition-property: transform }
img:hover { transform: translateX(-40%) translateY(-70%) rotatez(25deg) }
```

### [Hover with Clip-Path Effect](https://codepen.io/davidjsealey/pen/dyYPQLR)

made with: transition · :hover · clip-path

```css
.inner { clip-path: circle(10% at 90% 13%); transition: all 0.5s ease-in-out }
.inner:hover { clip-path: circle(75%) }
.inner span { transition: color 0.5s; position: relative }
```

### [When you can't decide...](https://codepen.io/pehaa/pen/QWjwyxy)

made with: transition · clip-path · custom properties driven by JS

```css
.beer-slider { position: relative }
.beer-slider svg { vertical-align: bottom }
.beer-reveal { position: absolute; top: 0; bottom: 0; -webkit-clip-path: polygon(0 0, var(--width) 0, var(--width) 100%, 0 100%); clip-path: polygon(0 0, var(--width) 0, var(--width) 100%, 0 100%); opacity: 0; transition: opacity 0.35s }
.beer-range { position: absolute; bottom: 0; opacity: 0 }
.beer-ready, .beer-ready image, .beer-ready .beer-reveal, .beer-ready .beer-hand { opacity: 1 }
.beer-handle { position: absolute; opacity: 0; transition: opacity 1s; transform: translateX(-50%); bottom: 0; -webkit-clip-path: url(#svgPath); clip-path: url(#svgPath) }
.beer-handle:before, .beer-handle:after { position: absolute; top: 50%; border-top: solid 2px }
.beer-handle:before { transform: rotate(-45deg) }
.beer-handle:after { transform: rotate(135deg) }
.b { position: absolute; top: 2rem }
.b * { opacity: 0; transform: translate3d(0, 2rem, 0); transition: 1s }
.more .b1 * { opacity: 1; transform: translate3d(0, 0, 0) }
```

```js
style.setProperty("--width", `${this.range.value}%`)
```

### [Svg Clip-Path Mask](https://codepen.io/alvarosaburido/pen/YzyzGvM)

made with: clip-path

```css
.header { box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.3) }
```

### [1 element bevel cards (pure CSS) - real (semi)transparency inside borders and all that](https://codepen.io/thebabydino/pen/ZEGNNQz)

made with: clip-path

```css
.bevel-card { -webkit-clip-path: var(--poly); clip-path: var(--poly) }
.bevel-card--border { position: relative }
.bevel-card--border::before { position: absolute; inset: 0; -webkit-clip-path: var(--poly); clip-path: var(--poly) }
body { filter: drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.85)) }
```

### [Samuel L. Clippath](https://codepen.io/netsi1964/pen/JjdwWVZ)

on scroll: section.live: clip-path | on hover of img.: section.live: clip-path | made with: transition · clip-path · requestAnimationFrame

```css
section { position: absolute; top: 0 }
img { opacity: 0.5 }
.live { clip-path: polygon( var(--x0) var(--y0), var(--x1) var(--y1), var(--x2) var(--y2), var(--x3) var(--y3) ); transition: all .4s }
.live img { opacity: 1 }
```

```js
requestAnimationFrame(step)
```

### [Clip path effect](https://codepen.io/avenart/pen/yLNRXGO)

on scroll: div.screen: transform+top | made with: transition · clip-path

```css
.screens, .screen-item, .screen { position: absolute; top: 0 }
.screen-item { opacity: 0.9 }
.screen { background-position: 50% 50% }
.screen-full { opacity: 0.6; transform: scale(1.1); will-change: transform; transition: transform 1s ease-out }
.screen-clip { clip-path: polygon(50% 0%, 20% 100%, 80% 100%) }
.screen-focus { transform: scale(1) }
```

### [Masked Circle Button](https://codepen.io/herrvau/pen/NWqLLxr)

on hover of img.pseudo-video: button.circle: shadow | made with: transition · :hover · clip-path

```css
.player { position: relative }
.circle { position: absolute; top: calc(50% - 40px); box-shadow: 0 0 0 4px darkgreen; transition: box-shadow .2s }
.circle:hover { box-shadow: 0 0 0 2px darkgreen }
.circle:focus { box-shadow: 0 0 0 0 darkgreen }
.clip { clip-path: polygon(-4px -4px, -4px 80px, 28px 80px, 28px 26px, 48px 36px, 28px 46px, 28px 80px, 80px 80px, 80px -4px) }
```

### [Clipping images](https://codepen.io/jjsebastianfuertes/pen/ZEGMWgb)

made with: clip-path

```css
.clip-img-one { -webkit-clip-path: circle(50% at 50%); clip-path: circle(50% at 50%) }
.clip-img-two { clip-path: polygon( 10% 25%, 35% 25%, 35% 0%, 65% 0%, 65% 25%, 90% 25%, 90% 50%, 65% 50%, 65% 100%, 35% 100%, 35% 50%, 10% 50% ) }
.clip-img-three { clip-path: polygon( 20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30% ) }
.clip-img-four { clip-path: polygon( 50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35% ) }
```

### [Radial Clip Reveal](https://codepen.io/dpkmcateer/pen/LYVrGJZ)

made with: clip-path · anime.js

```css
.page { position: absolute }
.usage { position: absolute; top: calc(50vh - 50px) }
```

### [CSS Clip Path Card](https://codepen.io/nikhilrajs-1472363470/pen/LYVmVmr)

made with: transition · :hover · clip-path

```css
.card { position: relative; box-shadow: 0 0.8px 0.8px rgba(0, 0, 0, 0.02), 0 2px 2px rgba(0, 0, 0, 0.028), 0 3.8px 3.8px rgba(0, 0, 0, 0.035), 0 6.7px 6.7px rgba(0, 0, 0, 0.042), 0 12.5px 12.5px rgba(0, 0, 0, 0.05), 0 30px 30px  }
.card .info { position: absolute; top: -2px; opacity: 1; transition: opacity 300ms ease-in-out }
.card .info:hover { opacity: 0 }
.card .answer { position: absolute; top: 0; bottom: 0; -webkit-clip-path: circle(12% at 100% 0%); clip-path: circle(12% at 100% 0%); transition: all 300ms ease-in-out }
.card .info:hover + .answer { -webkit-clip-path: circle(150% at 100% 0%); clip-path: circle(150% at 100% 0%) }
```

### [CSS3](https://codepen.io/Chingling152/pen/YzXEOYR)

made with: clip-path

```css
div { -webkit-clip-path: polygon(0% 0%,50% 1%,100% 0%,90% 90%, 50% 100%, 10% 90%) }
div:before { position:absolute; -webkit-clip-path: polygon(48% 10%, 50% 92%,82% 82%,90% 10%) }
div:after { position:absolute; -webkit-clip-path: polygon(20% 20%,80% 20%,80% 30%,50% 45%,80% 45%,75% 75%,50% 80%,27% 75%,25% 60%, 37% 60%,37% 67%,50% 70%,65% 67%,67% 55%, 24% 55%,22% 42%,50% 32%,22% 30%) }
```

### [clip-path-duotone-img](https://codepen.io/alvarobelmonte/pen/qBdVrNx)

on scroll: figure.: clip-path+top | made with: :hover · clip-path · mix-blend-mode

```css
figure { clip-path: polygon(88% 0, 70% 29%, 100% 100%, 18% 100%, 0 66%, 9% 11%) }
figure:hover { clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%) }
:root { --opacity: 1 }
.img-wrapper { position: relative }
.img-wrapper img { filter: grayscale(100%) contrast(1) blur(var(--blur)); mix-blend-mode: var(--bg-blend); opacity: var(--opacity); position: relative }
.img-wrapper::before { bottom: 0; mix-blend-mode: var(--fg-blend); position: absolute; top: 0 }
```

### [Hero Image Shape Overlays](https://codepen.io/brianhaferkamp/pen/xxGPgNr)

made with: clip-path

```css
.images { position: relative }
.image { position: absolute; top: 0 }
.image-1 { background-position: center left }
.image-2 { background-position: center right; -webkit-clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%); clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%) }
.image-3 { -webkit-clip-path: polygon(100% 0%, 75% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%); clip-path: polygon(100% 0%, 75% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%); transform: translateX(70%) }
```

### [Rainbow spotlight](https://codepen.io/TajShireen/pen/xxGPEEp)

made with: @keyframes · clip-path

```css
h1 { text-transform: uppercase; position: relative }
h1:before { position: absolute; clip-path: ellipse(120px 120px at -2.54% -9.25%); animation: swing 5s infinite; animation-direction: alternate }
0% { -webkit-clip-path: ellipse(120px 120px at -2.54% -9.25%) clip-path: ellipse(120px 120px at -2.54% -9.25%) }
50% { -webkit-clip-path: ellipse(120px 120px at 49.66% 64.36%); clip-path: ellipse(120px 120px at 49.66% 64.36%) }
100% { -webkit-clip-path: ellipse(120px 120px at 102.62% -1.61%; clip-path: ellipse(120px 120px at 102.62% -1.61%) }
@keyframes swing animates -webkit-clip-path, clip-path
```

### [Clip-path image reveal using gsap](https://codepen.io/cameronknight/pen/abOVoXb)

on scroll: div.reveal: clip-path, img.: transform+top | on hover of a.: img.: transform+top | made with: :hover · GSAP · IntersectionObserver

```css
.notification { position: absolute; top: 10% }
.container { position: relative }
.reveal { position: relative }
```

```js
gsap.timeline({ ease: easeInOut })
new IntersectionObserver(revealCallback, options)
```

### [Responsive Feature Section Using Clip-Path](https://codepen.io/brianhaferkamp/pen/jOPGZee)

made with: transition · :hover · clip-path

```css
.image img { -webkit-clip-path: polygon(0 0, 70% 0, 100% 100%, 0% 100%); clip-path: polygon(0 0, 70% 0, 100% 100%, 0% 100%) }
.text h1 { margin-top: 0 }
.button button { text-transform: uppercase; transition: background-color 200ms ease }
```

### [Clip-Pathed Image plus Shape-Outside](https://codepen.io/brianhaferkamp/pen/mdJMBxB)

made with: clip-path

```css
img { transform: translateX(-30%); -webkit-clip-path: polygon(30% 0, 70% 0, 100% 100%, 30% 100%); clip-path: polygon(30% 0, 70% 0, 100% 100%, 30% 100%) }
p:first-child { margin-top: 0 }
```

### [Watch it, it's dripping ! Dripp... Nevermind !](https://codepen.io/gitsushi/pen/WNvOZPB)

made with: clip-path

```css
body .container .up { padding-bottom: 156.52px }
body .container .down { padding-top: 156.52px; margin-top: -156.52px; background-position: 55% 25%; clip-path: path("M-5,74 a10,10 0,0,0 25,0 v-51 a8,8 0,0,1 16,0 v90 a4,4 0,0,0 9,0 v-74 a10,10 0,0,1 32,0 v85 a10,10 0,0,0 24,0 v-61 a10,10 0,0,1 }
```

### [testing clip-path between sections](https://codepen.io/gitsushi/pen/jOPwmxo)

made with: clip-path

```css
body .container { position: relative }
body .container .middlecont { position: absolute }
body .container .opaorange { padding-bottom: 14vmin }
body .container .opablue { margin-top: -14vmin; padding-top: 14vmin; clip-path: polygon(0% 14vmin, 100% 0%, 100% 100%, 0% 100%) }
```

### [2EZ dropdown w/ clip-path & flex](https://codepen.io/artyschein/pen/qBdjmBb)

made with: transition · :hover · clip-path

```css
.dropdown-wrapper { position: relative }
.dropdown-inner { position: absolute; top: 0; -webkit-clip-path: polygon(0 0, 100% 0, 100% 40px, 0 40px); clip-path: polygon(0 0, 100% 0, 100% 40px, 0 40px); transition: 0.15s ease }
.dropdown-wrapper:hover .dropdown-inner { -webkit-clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%); clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%) }
.dropdown-inner:after { position: absolute; top: 12px; transform: rotate(45deg); transition: 0.15s ease }
.dropdown-wrapper:hover .dropdown-inner:after { transform: translateY(5px) rotate(-135deg) }
.dropdown-item { transition: 0.3s ease }
```

### [Parallax Effect](https://codepen.io/tarun0706/pen/QWbvexr)

on scroll: h2.layer: transform+top ×2 | made with: clip-path · pointer / mouse tracking

```css
section { position: relative }
section .textbox { position: absolute; top: 0; box-shadow: -20px 20px 60px #305655, 20px -20px 60px #407473; clip-path: polygon(50% 0, 100% 0, 45% 100%, 0 100%) }
section h2, section .textbox h2 { position: absolute; top: calc(50% - 100px) }
```

```js
addEventListener('mousemove', parallax)
```

### [Text effect using Background clip and clip path](https://codepen.io/TajShireen/pen/jOPyQrw)

made with: clip-path

```css
.bg-img { -webkit-transform: rotate(-4deg); -ms-transform: rotate(-4deg); transform: rotate(-4deg) }
h1 { background-position: 200% 59%; position: relative }
h1::before { position: absolute; top: 0; bottom: 0; -webkit-clip-path: polygon(48.25% -28px, 52.37% 120.47%, 3.05% 130.06%, -13px -24.7%, 35.46% -30.24%); clip-path: polygon(48.25% -28px, 52.37% 120.47%, 3.05% 130.06%, -13px -24.7%,  }
```

### [The Clips of CSS 👇](https://codepen.io/jh3y/pen/gOpLBEa)

held: fixed label.global, fixed div.backdrop | on scroll: label.instruction: transform+top | made with: position: fixed · @keyframes · transition · clip-path

```css
:root { --transition: 0.15 }
[type='reset'] { position: absolute; top: 1rem }
.clip { position: absolute; top: 50%; transform: translate(-50%, -50%) }
input:checked + label + label + label { --scale: 1 }
[type='checkbox']:nth-of-type(1):not(:checked) ~ .local, [type='checkbox']:nth-o { --transition: 0 }
.shape { -webkit-clip-path: var(--clip); clip-path: var(--clip); position: absolute; top: 50%; transform: translate(-50%, -50%); transition: clip-path calc(var(--transition) * 1s) var(--ease), -webkit-clip-path calc(var(--transit }
form { position: relative }
.local { --scale: 0; position: absolute; top: 50%; transform: translate(-50%, -50%) scale(var(--scale)); transition: transform calc(var(--transition) * 1s) var(--ease) }
.global { position: fixed; top: 1rem }
.shape__container { filter: drop-shadow(2px 2px 4px var(--shadow-one)) drop-shadow(-2px -2px 4px var(--shadow-two)); position: absolute; top: 50%; transform: translate(-50%, -50%); transition: filter calc(var(--transition) * 1s) var(--ease) }
.backdrop { position: fixed; transition: background calc(var(--transition) * 1s) var(--ease) }
.instruction { position: absolute; top: 50%; filter: grayscale(1); -webkit-animation: float 2.5s infinite linear; animation: float 2.5s infinite linear }
```

### [#4 Flip Card (Pure CSS, Clip Path, Trasition )](https://codepen.io/allisonching/pen/gOpwWdM)

on hover of div.container-cards: div.container-cards-surface: transform ×2 | made with: transition · :hover · clip-path · 3D (perspective / preserve-3d)

```css
.container-cards { position: relative }
.container-cards-surface { position: relative }
.container-cards-front-image { clip-path: ellipse(200px 150px at 50% 20%) }
.container-cards-front-image img { object-position: 50% 60% }
.container-cards-front-label { position: absolute; top: 10px; -webkit-box-shadow: 10px 10px 13px -6px rgba(0, 0, 0, 0.32); -moz-box-shadow: 10px 10px 13px -6px rgba(0, 0, 0, 0.32); box-shadow: 10px 10px 13px -6px rgba(0, 0, 0, 0.32) }
.container-cards-front-button button { -webkit-transition: -webkit-filter 1s ease-in; transition: filter 1s ease-in }
.container-cards-surface { position: absolute; transition: transform 1s }
.container-cards-back { transform: rotateY(180deg); background-position: 50% 50%; position: relative }
.container-cards-back h2 { transform: rotate(-45deg) }
.container-cards:hover .container-cards-front { transform: rotateY(180deg) }
.container-cards:hover .container-cards-back { transform: rotateY(0) }
```

### [youtube video bubble](https://codepen.io/Mazou/pen/LYVZqoV)

held: fixed div.ytPlayerControlsContainerHost, fixed button.ytmA11yStylesHiddenButton | made with: position: fixed · :hover · clip-path

```css
.layout_wrapper { position: fixed }
.layout_wrapper .profile { position: absolute; top: -30px; transform: translateY(-50%) }
.layout_wrapper .pen { position: absolute; top: -30px; transform: translateY(-50%) }
.layout_wrapper .made { position: absolute; bottom: -30px; transform: translateY(50%) }
.pen_wrapper { position: relative }
.pen_wrapper div:not(.credit) { position: relative }
.pen_wrapper div:not(.credit) .box { clip-path: url("#maskRect1") }
.pen_wrapper div:not(.credit) .box #vp { filter: blur(3px); position: absolute; top: 0 }
.pen_wrapper div:not(.credit) .box #vp.hide { opacity: 0 }
.pen_wrapper div:not(.credit) #player { transform: scale(1.6) }
.pen_wrapper div:not(.credit) button { position: absolute; text-transform: uppercase; top: 400px }
.pen_wrapper div:not(.credit) button:before { position: absolute; top: -5px }
```

### [Todo Checkbox](https://codepen.io/kathykato/pen/xxGObEp)

made with: transition · clip-path

```css
input[type=checkbox] { position: relative; transition: background 175ms cubic-bezier(0.1, 0.1, 0.25, 1) }
input[type=checkbox]::before { position: absolute; top: 2px; transform: rotate(45deg); opacity: 0 }
input[type=checkbox]:checked::before { opacity: 1 }
input[type=checkbox]:checked ~ label::before { -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%) }
label { position: relative }
label::before { position: absolute; -webkit-clip-path: polygon(0 0, 0 0, 0% 100%, 0 100%); clip-path: polygon(0 0, 0 0, 0% 100%, 0 100%); transition: -webkit-clip-path 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94); transition: clip-path 20 }
```

### [CSS Doodle Fun](https://codepen.io/bobandra/pen/jOPWdvX)

made with: @keyframes · clip-path

### [REAL](https://codepen.io/pieter-biesemans/pen/QWbyVKG)

made with: :hover · clip-path

```css
div { position: relative }
div:before, div:after { position: absolute }
body { top: 0 }
body .message { position: absolute; top: 1vw }
body .message a { border-bottom: 1px solid #444 }
body .wrapper .block1 .logo { position: absolute; top: 1em; transform: translatex(-50%); text-transform: uppercase }
body .wrapper .block1 .logo .text { top: 50%; transform: translate(-50%, -50%) }
body .wrapper .block1 .logo .text .a { position: relative }
body .wrapper .block1 .logo .text .a:before { position: absolute; top: 0.25em; clip-path: polygon(50% 0, 0% 100%, 20% 100%, 50% 35%, 72% 80%, 25% 80%, 20% 100%, 100% 100%) }
body .wrapper .block1 .logo .text .l { position: relative }
body .wrapper .block1 .logo .text .l:after { position: absolute; top: 1.25em }
body .wrapper .block1 .buttons { position: absolute; bottom: 1.5em }
```

### [Curtains.js with clip path](https://codepen.io/SamuelEiche/pen/WNvrKde)

made with: clip-path · canvas 2D · requestAnimationFrame

```css
.canvas-bg { position: absolute }
body { position: relative }
.curtains-clip { clip-path: url(#clip); position: absolute; top: 0 }
.curtains-clip-plane { position: relative }
```

```js
requestAnimationFrame(render)
```

### [Clip Path Hover Animation - Keyboard accessible](https://codepen.io/vladracoare/pen/RwPrayL)

made with: transition · :hover · clip-path

```css
.card { position: relative; clip-path: circle(5% at 95% 11%); transition: all ease-in-out 0.3s }
.card__infoicon { position: absolute; top: 10px; transition: ease-out 0.3s }
.card__reference { border-bottom: 1px solid transparent; transition: ease-in 0.3s }
.card:hover, .card:focus { clip-path: circle(75%); box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.12), 0px 3px 18px rgba(0, 0, 0, 0.08) }
.card:hover .card__infoicon, .card:focus .card__infoicon { opacity: 0 }
.card:focus { box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.12), 0px 3px 18px rgba(0, 0, 0, 0.08), 0px 0px 0px 4px rgba(0, 0, 0, 0.2) }
```

### [SCSS: Circular Images with Shape-Outside and Clip-Path](https://codepen.io/cnocon/pen/rNVajBY)

on scroll: img.story__img: transform+filter+top, figcaption.story__caption: transform+opacity+top | made with: transition · :hover · clip-path

```css
h3 { text-transform: uppercase; margin-bottom: 1.5rem }
.story { box-shadow: 0 3rem 6rem rgba(0, 0, 0, 0.1); transform: skewX(-12deg) }
.story__shape { position: relative; -webkit-clip-path: circle(50% at 50% 50%); clip-path: circle(50% at 50% 50%); transform: translateX(-3rem) skewX(12deg) }
.story__img { transform: scale(1.3); transition: all 0.2s ease }
.story__text { transform: skewX(12deg) }
.story__caption { text-transform: uppercase; opacity: 0; position: absolute; top: 50%; transform: translate(-50%, 20%); transition: all 0.2s ease }
.story:hover .story__caption { opacity: 1; transform: translate(-50%, -50%) }
.story:hover .story__img { transform: scale(1); filter: blur(3px) brightness(80%) }
```

### [SCSS: Perspective and 2-Sided Rotating Cards](https://codepen.io/cnocon/pen/ZEGYWgJ)

on hover of div.card: div.card__side: transform+top ×2 | made with: transition · :hover · clip-path · 3D (perspective / preserve-3d)

```css
.card { -moz-perspective: 150rem; perspective: 150rem; position: relative }
.card__side { position: absolute; top: 0; box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, 0.15); transition: all 0.8s ease }
.card__side--back { transform: rotateY(180deg) }
.card__picture { -webkit-clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%); clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%) }
.card__heading { position: absolute; top: 12rem; text-transform: uppercase }
.card__details ul li:not(:last-child) { border-bottom: 1px solid #eee }
.card:hover .card__side--front { transform: rotateY(-180deg) }
.card:hover .card__side--back { transform: rotateY(0) }
.card .card__cta { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.card__price-box { margin-bottom: 8rem }
.card__price-only { text-transform: uppercase }
.btn:link, .btn:visited { position: relative; text-transform: uppercase; transition: all 0.2s }
```

### [Animated SVG Signature](https://codepen.io/shreyanschandak/pen/xxGxzOX)

made with: @keyframes · clip-path

### [CSS Clip-Path Card](https://codepen.io/ViktorPika/pen/abObGMp)

made with: transition · :hover · clip-path

```css
.inner { transition:all .5s ease-in-out; clip-path:circle(10% at 90% 20%) }
.inner:hover { clip-path:circle(75%) }
.inner span { transition:opacity .5s; position:relative; opacity:1 }
.inner:hover span { opacity:0 }
```

### [1970s Image Loading](https://codepen.io/dpkmcateer/pen/MWwgmKJ)

made with: transition · clip-path

```css
div { clip-path: polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%); -webkit-transition: clip-path 2s ease-out; -moz-transition: clip-path 2s ease-out; -o-transition: clip-path 2s ease-out; transition: clip-path 2s ease-out }
```

### [Scott Sterling animation: The Man, The Myth, The Legend](https://codepen.io/alvaromontoro/pen/qBEzwMK)

made with: @keyframes · transition · :hover · clip-path · 3D (perspective / preserve-3d)

```css
.avatar { perspective: 1000px; position: relative }
.avatar-info { margin-top: -20px; opacity: 0; transition: width 0.25s, padding 0.5s, max-height 0.25s, opacity 0.5s }
.avatar:hover .avatar-info { opacity: 1; transition: width 1s, padding 1s, max-height 1s, opacity 0s }
.avatar-info h1, .avatar-info h2 { opacity: 0; transition: 1s }
.avatar h2.line-1 { transform: translate(100%, 0) }
.avatar-info h2.line-2 { transform: translate(-100%, 0) }
.avatar-info h2.line-3 { transform: scale(0) }
.avatar:hover h1, .avatar:hover h2 { opacity: 1; transform: translate(0, 0) }
.avatar:hover h1 { transition: opacity 0.75s }
.avatar:hover h2.line-3 { transform: scale(1) }
0% { top: -100px; transform: rotate(0) }
40% { top: 0; transform: rotate(360deg) }
```

### [Morphing circles animation - Click to show mechanics 👍🤓](https://codepen.io/jh3y/pen/GRgbLNw)

held: fixed input, fixed label, fixed h1 | on scroll: div.container: transform, div.circle: transform+top | made with: position: fixed · @keyframes · clip-path

```css
h1 { position: fixed; bottom: 1rem; opacity: 0.5 }
body:before { box-shadow: 4px 4px 0 0 #111; position: absolute; top: 50%; transform: translate(-50%, -50%) }
[type='checkbox'] { position: fixed; opacity: 0 }
label { position: fixed }
.container { position: relative; -webkit-animation: flip calc(var(--speed) * 4s) steps(1) infinite, bg calc(var(--speed) * 4s) steps(1) infinite; animation: flip calc(var(--speed) * 4s) steps(1) infinite, bg calc(var(--speed) * 4s) s }
.container:before { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.circle { -webkit-animation: rotate calc(var(--speed) * 1s) ease-in-out infinite alternate; animation: rotate calc(var(--speed) * 1s) ease-in-out infinite alternate; position: absolute; top: 40% }
.circle:after { -webkit-clip-path: inset(0% 45% 90% 45% round 50% 50%); -webkit-animation: clip calc(var(--speed) * 1s) ease-in-out infinite alternate, bg calc(var(--speed) * 4s) steps(1) infinite; animation: clip calc(var(--speed) * 1s }
25% { transform: rotateY(0deg) rotateX(180deg) }
50% { transform: rotateY(180deg) rotateX(180deg) }
75% { transform: rotateY(180deg) rotateX(0deg) }
25% { transform: rotateY(0deg) rotateX(180deg) }
```

### [CSS3 Clip-path Transform Effects on Scroll 3](https://codepen.io/Rameez_Bukhari/pen/vYEqjMw)

held: fixed div.img-bg | on scroll: div.img-bg: clip-path | made with: position: fixed · clip-path · scroll listener

```css
.img-bg { position: fixed; top: 0; background-position: center top; clip-path: circle(0px at center) }
.content { position: relative; margin-top: 200vh }
.content h2 { margin-bottom: 20px }
.title { position: relative; top: 250px }
```

```js
addEventListener('scroll', function() {
```

### [Text Alignment](https://codepen.io/wikyware-net/pen/vYEqpaP)

made with: clip-path

```css
.ag-alignment_item { vertical-align: top }
.ag-alignment_item:before { -webkit-clip-path: polygon(0 0, 50px 0, 0 100%); clip-path: polygon(0 0, 50px 0, 0 100%) }
```

### [Tooltip (clip-path)](https://codepen.io/nadianeyl/pen/gObNGgr)

made with: transition · :hover · clip-path

```css
.content { position: relative; box-shadow: 0 1px 5px 0 rgba(68, 74, 83, 0.2); -webkit-clip-path: circle(16% at 0% 100%); clip-path: circle(16% at 0% 100%); transition: all 0.5s ease }
.content h1 { margin-bottom: 5px }
.content span { position: absolute; bottom: 2%; transition: color 0.4s }
.content:hover { -webkit-clip-path: circle(80%); clip-path: circle(80%) }
```

### [clip path pour hotel](https://codepen.io/Fabrice-Chap/pen/RwNzNZd)

made with: clip-path

```css
.shape-oblique-up { margin-bottom: 10px; box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.25); -webkit-clip-path: polygon(0 30%, 100% 0%, 100% 100%, 0% 100%); clip-path: polygon(0 30%, 100% 0%, 100% 100%, 0% 100%) }
.background-grey { margin-top:100px; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25) }
.box-shadow-up { box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25) }
.up { padding-top:50px }
.down { padding-top:16px }
.shape-oblique-down { margin-bottom: 10px; -webkit-clip-path: polygon(0 0, 100% 30%, 100% 100%, 0% 100%); clip-path: polygon(0 0, 100% 30%, 100% 100%, 0% 100%) }
```

### [Animating Clip-Path Sections w/ Intersection Observer](https://codepen.io/hexagoncircle/pen/povXoOo)

held: fixed div.feature-inner, fixed div.feature-inner, fixed div.feature-inner, fixed div.feature-inner, fixed div.feature-inner, fixed div.feature-inner | on scroll: div.feature-copy: transform+opacity+top ×2, div.feature-image-container: transform+opacity ×2 | made with: position: fixed · transition · clip-path · IntersectionObserver

```css
.featured-content { position: relative }
.feature { position: relative }
.feature { -webkit-clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 0); clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 0) }
.feature:nth-child(odd) .feature-image-container { transform: translateX(-2rem) }
.feature:nth-child(odd).show-feature .feature-image-container { transform: translateX(0%) }
.feature:nth-child(even) .feature-image-container { transform: translateX(2rem) }
.feature:nth-child(even).show-feature .feature-image-container { transform: translateX(0%) }
.feature-inner { position: fixed; top: 0 }
.feature-image-container { position: relative; margin-top: 2rem; opacity: 0; transition: opacity 0.5s var(--base-timing-function), transform 0.5s var(--base-timing-function) }
.show-feature .feature-image-container { opacity: 1 }
.feature-image-container { margin-top: 0 }
.feature-image-container img { position: relative; vertical-align: bottom }
```

```js
new IntersectionObserver(sections => {
```

### [Tiles](https://codepen.io/FelixLuciano/pen/xxbNdRo)

on scroll: div.tile: clip-path ×54 | on hover of a.figcaption-hyperlink: div.tile: clip-path ×54 | made with: @keyframes · clip-path

```css
.tile { clip-path: polygon(32% 0, 68% 0%, 100% 32%, 100% 68%, 68% 100%, 32% 100%, 0% 68%, 0% 32%); animation: to-square 1s linear infinite alternate }
.tile:nth-child(odd) { clip-path: polygon(30% 30%, 70% 30%, 70% 30%, 70% 70%, 70% 70%, 30% 70%, 30% 70%, 30% 30%); animation-name: to-octogon }
50% { clip-path: polygon(15% 15%, 85% 15%, 85% 15%, 85% 85%, 85% 85%, 15% 85%, 15% 85%, 15% 15%) }
to { clip-path: polygon(30% 30%, 70% 30%, 70% 30%, 70% 70%, 70% 70%, 30% 70%, 30% 70%, 30% 30%) }
50% { clip-path: polygon(15% 15%, 85% 15%, 85% 15%, 85% 85%, 85% 85%, 15% 85%, 15% 85%, 15% 15%) }
to { clip-path: polygon(32% 0, 68% 0%, 100% 32%, 100% 68%, 68% 100%, 32% 100%, 0% 68%, 0% 32%) }
figcaption { position: absolute }
@keyframes to-square animates clip-path
@keyframes to-octogon animates clip-path
```

### [Pure CSS loader #27 - polygonal flame set](https://codepen.io/thebabydino/pen/bGNJNxR)

made with: @keyframes · clip-path

```css
.loader { position: relative }
.s2d { position: absolute; top: 50%; transform: rotate(calc(-.25turn/var(--n))) }
.s2d:before { position: absolute; -webkit-clip-path: polygon(50% 0%, 93.30127% 75%, 6.69873% 75%); clip-path: polygon(50% 0%, 93.30127% 75%, 6.69873% 75%); animation: rot 1.5s steps(var(--n)) calc(var(--k)*-1.5s) infinite }
:nth-child(2) > .s2d:before { -webkit-clip-path: polygon(14.64466% 14.64466%, 85.35534% 14.64466%, 85.35534% 85.35534%, 14.64466% 85.35534%); clip-path: polygon(14.64466% 14.64466%, 85.35534% 14.64466%, 85.35534% 85.35534%, 14.64466% 85.35534%) }
:nth-child(3) > .s2d:before { -webkit-clip-path: polygon(50% 0%, 97.55283% 34.54915%, 79.38926% 90.45085%, 20.61074% 90.45085%, 2.44717% 34.54915%); clip-path: polygon(50% 0%, 97.55283% 34.54915%, 79.38926% 90.45085%, 20.61074% 90.45085%, 2.44717% 34 }
:nth-child(4) > .s2d:before { -webkit-clip-path: polygon(25% 6.69873%, 75% 6.69873%, 100% 50%, 75% 93.30127%, 25% 93.30127%, 0% 50%); clip-path: polygon(25% 6.69873%, 75% 6.69873%, 100% 50%, 75% 93.30127%, 25% 93.30127%, 0% 50%) }
0% { transform: rotate(0deg) translate(var(--dx)) rotate(0deg) }
to { transform: rotate(1turn) translate(var(--dx)) rotate(-2turn) }
@keyframes rot animates transform
```
