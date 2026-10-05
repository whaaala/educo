# CodePen · scrollytelling — how each pen does it

16 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/scrollytelling.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| position: fixed | 11 |
| transition | 7 |
| position: sticky | 6 |
| @keyframes | 6 |
| requestAnimationFrame | 6 |
| :hover | 5 |
| scroll listener | 4 |
| prefers-reduced-motion | 3 |
| custom properties driven by JS | 3 |
| Lenis / smooth scroll | 3 |
| backdrop-filter | 3 |
| canvas 2D | 3 |
| GSAP | 3 |
| ScrollTrigger | 3 |
| :focus-visible | 2 |
| clip-path | 2 |
| three.js / WebGL | 2 |
| pointer / mouse tracking | 2 |
| view() timeline | 2 |
| mask | 2 |
| mix-blend-mode | 2 |
| :has() | 1 |
| (hover: hover) gate | 1 |
| 3D (perspective / preserve-3d) | 1 |
| IntersectionObserver | 1 |
| scroll-driven animation (animation-timeline) | 1 |
| scroll() timeline | 1 |
| animation-range | 1 |

## Every pen

### [Papercut Dive](https://codepen.io/Liorgin/pen/ByWNmXw)

held: sticky div.stage | on scroll: g.[object: transform+top ×5, section.beat: opacity+clip-path ×2, div.col: transform+top ×2, div.chrome: clip-path ×2, div.cue: opacity ×2, span.bar: transform+top ×2 | on hover of a.btn: span.bar: transform+top ×2, a.btn: transform+opacity | made with: position: sticky · position: fixed · @keyframes · transition · :hover · :focus-visible · prefers-reduced-motion · clip-path · custom properties driven by JS · Lenis / smooth scroll · requestAnimationFrame

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

### [New York City 3D – Cinematic Scroll Journey with Sea & Waves](https://codepen.io/Deva-Kumar-the-bold/pen/WboxKzG)

held: fixed div.scroll-hint, fixed div.glass-card, fixed div.glass-card, fixed canvas | made with: position: fixed · transition · backdrop-filter · three.js / WebGL · canvas 2D · scroll listener · requestAnimationFrame

### [Cinematic Star Trails](https://codepen.io/editor/yudizsolutions/pen/019d1e6c-defa-7ef3-bbd4-7da12882e1b3)

held: fixed div.main-content, fixed div.sound-wave-btn, fixed canvas, fixed div.lil-gui | on scroll: div.main-content: opacity | on hover of img.: div.main-content: opacity | made with: position: fixed · @keyframes · transition · :hover · GSAP · ScrollTrigger · Lenis / smooth scroll · three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

```css
canvas { position: fixed; top: 0 }
.main-content { position: fixed; top: 50%; transform: translate(-50%, -50%); will-change: opacity }
.main-content h1 { opacity: 1 }
.main-content img { margin-bottom: 20px }
.ui-instruction { text-transform: uppercase }
.main-content span { margin-top: 10px; text-transform: uppercase }
.sound-wave-btn { position: fixed; bottom: 40px; opacity: 0.7; transition: opacity 0.3s }
.sound-wave-btn:hover { opacity: 1 }
.bar { transition: height 0.2s ease; box-shadow: 0 0 10px rgba(255, 255, 255, 0.5) }
.sound-wave-btn.playing .bar { animation: wave 1s infinite ease-in-out }
.sound-wave-btn.playing .bar:nth-child(1) { animation-delay: 0.0s }
.sound-wave-btn.playing .bar:nth-child(2) { animation-delay: 0.2s }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to(".main-content", {
scrollTrigger: { trigger: "body", start: "top top", end: "100px top", scrub: true, }
addEventListener('mousemove', (e) => {
ScrollTrigger.create({
gsap.to(scrollData, { value: self.progress, duration: 1.0, ease: "power2.out", overwrite: true })
requestAnimationFrame(animate)
```

### [Zen~man](https://codepen.io/Oceanpark_digital/pen/XJKMzzR)

made with: position: fixed · transition · :hover · backdrop-filter · canvas 2D · scroll listener

```css
canvas { position: fixed; inset: 0 }
.section { position: relative }
.hero h1 { margin-bottom: 1rem }
.subhead { opacity: 0.7 }
.eyebrow { text-transform: uppercase; opacity: 0.6; margin-bottom: 1rem }
.light { backdrop-filter: blur(6px) }
.button { margin-top: 2rem; transition: background 0.2s }
.footer { opacity: 0.6 }
```

```js
addEventListener("scroll", () => {
```

### [ANALOGUE || Scrollytelling || Design Studio || GSAP](https://codepen.io/OSINT619/pen/wBMEjLd)

held: fixed header, fixed div.sidebar, fixed div.sidebar, fixed div.mobile--menu, fixed div.video--modal, fixed div.overlay, fixed svg.[object, fixed div.c-Game, fixed div.c-Game__asset-container, fixed div.c-Game__crosshair | on hover of a.cover: span.letter: transform+top ×8, rect.[object: color ×8, path.[object: color ×8, polygon.[object: color ×8, svg.[object: color ×7, div.img: transform ×6 | made with: position: sticky · position: fixed · view() timeline · @keyframes · transition · :hover · :focus-visible · :has() · (hover: hover) gate · prefers-reduced-motion · clip-path · mask · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d) · custom properties driven by JS · GSAP · ScrollTrigger · Lenis / smooth scroll · canvas 2D · IntersectionObserver · scroll listener · pointer / mouse tracking · requestAnimationFrame

```css
.wp-block-audio :where(figcaption) { margin-bottom: 1em; margin-top: 0.5em }
:where(.wp-block-button__link) { box-shadow: none }
.wp-block-buttons.is-vertical > .wp-block-button:last-child { margin-bottom: 0 }
:where(.wp-block-columns) { margin-bottom: 1.75em }
.wp-block-post-comments .comment-author .avatar { margin-top: 0.5em }
.wp-block-post-comments .comment-meta .comment-awaiting-moderation { margin-bottom: 1em; margin-top: 1em }
.wp-block-post-comments .comment-form-author label, .wp-block-post-comments .com { margin-bottom: 0.25em }
.wp-block-post-comments .comment-form-cookies-consent #wp-comment-cookies-consen { margin-top: 0.35em }
.wp-block-post-comments .comment-reply-title { margin-bottom: 0 }
.wp-block-post-comments .reply { margin-bottom: 1.4em }
.wp-block-comments-pagination > .wp-block-comments-pagination-next, .wp-block-co { margin-bottom: 0.5em }
.wp-block-comments-pagination .wp-block-comments-pagination-previous-arrow:not(. { transform: scaleX(1) }
```

### [VW Bulli, background-attachment: fixed](https://codepen.io/gunnarbittersmann/pen/ogjqpwR)

made with: prefers-reduced-motion

```css
#geschichte & { background-position: 30% center }
#t1 & { background-position: left 60% }
#t2 & { background-position: 30% 70% }
#t3 & { background-position: 80% bottom }
```

### [From the Grill - Code Pen Challenge](https://codepen.io/Megafry/pen/xbbzEpN)

held: fixed div.sun, sticky div.sticky-section__stack, sticky p.aside__text, sticky p.aside__text, sticky p.aside__text, sticky p.aside__text, sticky p.aside__text, sticky p.aside__text, sticky div.sticky-section__stack, fixed a.fab | on scroll: div.aside__section: opacity+top ×3, div.hamburger__item: transform+top ×3 | made with: position: sticky · position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · mask · mix-blend-mode

```css
:root { --mask-salade: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="150" viewBox="0 0 800 150" ><path d="M171 0C55 0-22-9 7 77c26 97 44 2 101 19 58 12 58 72 130 11 91-80 101 96 215-9 73-64  }
html { scroll-timeline: --page-scroll block }
.hamburger__item { position: relative; animation: slideIn auto linear both; animation-timeline: --sticky }
.hamburger__item--top-bun { box-shadow: inset 0px -2.3rem 0 var(--shadow); animation-range: contain 80% contain 100% }
.hamburger__item--top-bun:before, .hamburger__item--top-bun:after { position: absolute; top: 16%; rotate: 45deg }
.hamburger__item--top-bun:before { top: 16%; rotate: -45deg; box-shadow: -4rem -1rem 0 currentColor }
.hamburger__item--salad { mask-image: var(--mask-salade); mask-size: auto 100%; mask-repeat: no-repeat; mask-position: center center; box-shadow: inset 0px 2rem 0 var(--shadow); animation-range: contain 60% contain 80% }
.hamburger__item--tomato { margin-bottom: -4%; animation-range: contain 40% contain 60% }
.hamburger__item--tomato:after { position: absolute; inset: 0 0 50% }
.hamburger__item--cheese { mask-image: var(--mask-cheese); mask-size: auto 100%; mask-repeat: no-repeat; mask-position: center center; margin-bottom: -28%; animation-range: contain 20% contain 40% }
.hamburger__item--patty { margin-bottom: -8%; animation-range: contain 0% contain 20% }
.hamburger__item--patty:after { position: absolute; inset: 0 0 50% }
```

### [Calçada de Carriche](https://codepen.io/GreenMullet/pen/VwojNPb)

made with: position: sticky · @keyframes · GSAP · ScrollTrigger

```css
body { position: relative }
.section { position: relative }
.section .left { position: relative }
.gif { position: sticky; bottom: 60px; opacity: 0 }
.section .right { position: relative }
.section .left::before, .section .right::before { position: absolute; top: -100%; animation: rain 1s infinite linear; opacity: 0 }
.section .left::before { animation-delay: 0s }
.section .left::after { animation-delay: 0.2s }
.section .right::before { animation-delay: 0.1s }
.section .right::after { animation-delay: 0.3s }
.rain-drop { position: absolute; bottom: 100%; animation: fall linear forwards }
0% { transform: translateY(0) }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.fromTo(
scrollTrigger: { trigger: ".gif-container", start: "top top", end: "bottom bottom", scrub: true, //markers: true, }
gsap.to(".gif", {
scrollTrigger: { trigger: ".gif", start: "top 100px", end: "100px", scrub: true, //markers: true, }
```

### [Lottie left to right](https://codepen.io/zappingseb/pen/QWJZRqV)

held: sticky div.keepoala-animation-row, sticky div.n-sticky | on scroll: g.[object: transform+top ×24 | made with: position: sticky · scroll listener

```css
.keepoala-animation-row { position: sticky; top:0 }
.n-sticky { position: sticky; top: 0 }
.lottie { position: relative }
.keepoala-lottie.fixed { top: 0 }
.keepoala-animation { position: relative; padding-bottom: calc(50vh) }
.fullheight { box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.37); margin-bottom: calc(100vh - 150px) }
.fullheight.last { margin-bottom: calc(50vh) }
```

```js
addEventListener('scroll', animatemobile)
addEventListener('scroll', fixView)
```

### [Scrollama: Triggering Events](https://codepen.io/stephanmax/pen/MWVaMmK)

made with: @keyframes · transition

```css
div.step { transition: 1s linear all }
div.step.active { transition: 1s linear all }
div.step.active.blue { transition: 1s linear all }
div.step.active.blinky { -webkit-animation: blinker 1s step-start infinite; animation: blinker 1s step-start infinite }
50% { opacity: 0 }
50% { opacity: 0 }
@keyframes blinker animates opacity
```

### [Horizontal Scrollbar Indicator (Scrollytelling)](https://codepen.io/Tobi_Lxtr/pen/xxRbpwO)

held: fixed div.scrollline, fixed div.center-viewport | on scroll: div.center-viewport: transform | made with: position: fixed · transition · custom properties driven by JS

```css
.scrollline { position: fixed; -webkit-transition: width 0.1s; -o-transition: width 0.1s; transition: width 0.1s }
.center-viewport { position: fixed; top: 50%; -webkit-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%) }
```

```js
style.setProperty('--barPos', value + "vw")
```

### [Avalanche Problem Types - Sticky Position & particles.js](https://codepen.io/killorye1/pen/EpzYxx)

held: fixed canvas.particles-js-canvas-el, sticky figure, sticky figure, sticky figure, sticky figure, sticky figure, sticky figure, sticky figure, sticky figure, sticky figure | made with: position: sticky · position: fixed · requestAnimationFrame

```css
h1 { text-transform: uppercase; margin-bottom: 3rem }
h2 { text-transform: uppercase }
section { margin-bottom: 5rem }
figure { filter: drop-shadow(0 0.5rem 0.75rem rgba(226, 242, 252, 0.5)); top: 3rem }
figure { position: sticky }
#particles-js canvas { vertical-align: bottom; position: fixed; top: 0 }
```

```js
requestAnimationFrame(update)
```

### [Play Video on Scroll](https://codepen.io/nikname/pen/rKpbZo)

held: fixed video | made with: position: fixed · requestAnimationFrame

```css
#video { position: fixed; top: 0; transform: translate3d(50%,0,0) }
```

```js
requestAnimationFrame( function(){
```

### [Scrollytelling with Scrollama](https://codepen.io/thulioph/pen/XzymBO)

held: fixed div.scrollama__debug-step, fixed div.scrollama__debug-step, fixed div.scrollama__debug-step, fixed div.scrollama__debug-step | on scroll: div.step: background+top ×2, p.: transform+top | made with: position: fixed · :hover

```css
a, a:visited, a:hover { border-bottom: 1px solid currentColor }
.intro__hed { text-transform: uppercase }
#intro { margin-bottom: 320px }
#scroll { position: relative; border-top: 1px dashed #000; border-bottom: 1px dashed #000 }
.scroll__graphic { position: absolute; top: 0; bottom: auto; transform: translate3d(0, 0, 0) }
.scroll__graphic.is-fixed { position: fixed }
.scroll__graphic.is-bottom { bottom: 0; top: auto }
.chart { position: absolute; top: 50%; transform: translateY(-50%) }
.chart p { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.scroll__text { position: relative }
```

### [Control AnimeJS with Scroll Magic.](https://codepen.io/hellothisismatt/pen/LzZjJw)

held: fixed div.animation, fixed div | made with: position: fixed

```css
.animation__stage { position: fixed; top:0 }
```

### [Smiley Element](https://codepen.io/MKallivokas/pen/BjERVJ)

made with: nothing recognised — read the code
