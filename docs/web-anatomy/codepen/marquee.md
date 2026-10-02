# CodePen · marquee — how each pen does it

248 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/marquee.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| @keyframes | 172 |
| :hover | 71 |
| transition | 49 |
| prefers-reduced-motion | 41 |
| position: fixed | 26 |
| mask | 19 |
| requestAnimationFrame | 15 |
| GSAP | 14 |
| custom properties driven by JS | 12 |
| mix-blend-mode | 8 |
| 3D (perspective / preserve-3d) | 7 |
| ScrollTrigger | 7 |
| pointer / mouse tracking | 6 |
| clip-path | 5 |
| backdrop-filter | 5 |
| :focus-visible | 5 |
| IntersectionObserver | 3 |
| position: sticky | 3 |
| Web Animations API (.animate) | 3 |
| Lenis / smooth scroll | 2 |
| scroll listener | 1 |
| :has() | 1 |
| three.js / WebGL | 1 |
| (hover: hover) gate | 1 |
| canvas 2D | 1 |
| <dialog> | 1 |

## Every pen

### [Infinite Logo Marquee | Pure CSS & Masking](https://codepen.io/editor/yasgo/pen/01a0a3f1-51bb-7eb2-ad4f-1d1a511d24fd)

on scroll: div.marquee-track: transform+top | made with: @keyframes · transition · :hover · mask

```css
.trusted-title { text-transform: uppercase; margin-bottom: 40px }
.marquee-container { position: relative; mask-image: linear-gradient( to right, transparent, black 10%, black 90%, transparent ); -webkit-mask-image: linear-gradient( to right, transparent, black 10%, black 90%, transparent ) }
.marquee-track { animation: scroll-left 30s linear infinite }
.marquee-container:hover .marquee-track { animation-play-state: paused }
.logo-item { transition: color 0.3s ease }
0% { transform: translateX(0) }
100% { transform: translateX(-50%) }
@keyframes scroll-left animates transform
```

### [Draggable Marquee of Logos](https://codepen.io/editor/nintendo-sixty-paul/pen/01a08ba9-e4ee-7534-a3c8-b3c2cf97a3de)

on scroll: span.drag-cursor: transform+top | made with: transition · :hover · pointer / mouse tracking

```css
.logo-marquees { position: relative }
.logo-marquees:before, .logo-marquees:after { position: absolute; top: 0 }
.logo-marquees:hover .drag-cursor { transform: scale(1) }
.drag-cursor { margin-top: -50px; text-transform: uppercase; transform: scale(0); transition: transform .2s ease; position: absolute }
```

```js
addEventListener('mousemove', function(e) {
addEventListener('pointermove', (e) => {
```

### [Marquee logo infinite loop (tailwind only, no js)](https://codepen.io/editor/Souhail-the-decoder/pen/01a08172-d6a0-74dc-a762-a53c7d0a8fc6)

on scroll: div.flex: transform | made with: @keyframes

```css
from { transform: translateX(0) }
to { transform: translateX(-50%) }
@keyframes marquee-scroll animates transform
```

### [Infinite Logo Marquee (Pure CSS)](https://codepen.io/AbdullahSajjad/pen/vExEMWW)

on scroll: div.logo-marquee-track: transform | on hover of img.: div.logo-marquee-track: transform | made with: @keyframes · prefers-reduced-motion · mask

```css
.logo-marquee { -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent) }
.logo-marquee-track { animation: logo-marquee-scroll 30s linear infinite }
.logo-marquee-group img { opacity: 0.8 }
from { transform: translateX(0) }
to { transform: translateX(-50%) }
.logo-marquee-track { animation: none }
@keyframes logo-marquee-scroll animates transform
```

### [Seamless Marquee using simple CSS, JS - Zero Reset Flicker](https://codepen.io/editor/atifsheraz/pen/01a011f6-885b-777d-b466-53495624eaed)

on scroll: div.ticker-track: transform | made with: IntersectionObserver · requestAnimationFrame

```css
h1 { margin-bottom: 3rem }
.ticker-container { position: relative; border-top: 1px solid #232327; border-bottom: 1px solid #232327 }
.ticker-track { will-change: transform }
.ticker-item { text-transform: uppercase }
```

```js
requestAnimationFrame(tick)
new IntersectionObserver((entries) => {
```

### [Scroll Velocity Typography with Vanilla JavaScript](https://codepen.io/editor/Alexey-Kovalevsky-AKAVA/pen/019fe58d-5828-7310-aa9e-d07232f68244)

on scroll: div.kinetic__track: transform+top ×3 | made with: prefers-reduced-motion · custom properties driven by JS · IntersectionObserver · scroll listener · requestAnimationFrame

```css
.kinetic { position: relative }
.kinetic__row { position: relative }
.kinetic__row + .kinetic__row { margin-top: clamp(2px, 0.5vw, 8px) }
.kinetic__track { transform: translate3d( calc(var(--start) + var(--move)), 0, 0 ); will-change: transform }
.kinetic__track { transform: none !important; will-change: auto }
```

```js
new IntersectionObserver(
requestAnimationFrame(update)
style.setProperty('--move', `${offset}px`)
addEventListener('scroll', handleScroll, {
```

### [SVG CSS Marquee Glass Boubble](https://codepen.io/designfenix/pen/QwdoddG)

held: fixed p | on scroll: g.[object: transform+top ×3 | on hover of a.logo: g.[object: transform+top ×6 | made with: position: fixed · transition · :hover · clip-path · mix-blend-mode · pointer / mouse tracking · requestAnimationFrame

```css
.hero { position: relative }
.hero::before { position: absolute; top: 17%; filter: blur(75px) }
.hero::after { position: absolute; inset: 0 }
.header { position: relative }
.nav a { transition: opacity 0.25s ease }
.nav a:hover { opacity: 0.45 }
.hero__body { position: relative }
.content { position: relative }
.eyebrow { margin-bottom: clamp(30px, 5vh, 55px) }
.actions { margin-top: 34px }
.btn--primary { box-shadow: 0 2px 2px rgba(255, 255, 255, 0.08) inset, 0 9px 25px rgba(84, 50, 27, 0.11) }
.btn--secondary { position: relative }
```

```js
addEventListener("pointermove", (event) => {
addEventListener("mouseleave", () => {
requestAnimationFrame(render)
```

### [Infinite Logo Carousel Animation | HTML CSS](https://codepen.io/editor/IreneMariyamPrince/pen/019f6486-da97-7211-b39b-3dad2c74f132)

on scroll: div.logo-track: transform | on hover of img.: div.logo-track: transform | made with: @keyframes · transition · :hover · 3D (perspective / preserve-3d)

```css
:root { --animation-speed: 25s }
.logo-carousel { position: relative }
.logo-carousel::before, .logo-carousel::after { position: absolute; top: 0 }
.logo-track { animation: scroll var(--animation-speed) linear infinite }
.logo-track:hover { animation-play-state: paused }
.logo-slide { perspective: 100px }
.logo-slide img { filter: grayscale(100%) opacity(0.5); transition: filter 0.3s ease, transform 0.3s ease }
.logo-slide:hover img { filter: grayscale(0%) opacity(1); transform: scale(1.2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-200px * 6)) }
@keyframes scroll animates transform
```

### [Logo Marquee](https://codepen.io/mzorn/pen/WbRzopB)

made with: @keyframes · transition · :hover · prefers-reduced-motion · mask

```css
.eyebrow { text-transform: uppercase; margin-bottom: .9rem }
.marquee { position: relative; -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent) }
.track { will-change: transform }
.row--left .track { animation: scroll-left 38s linear infinite }
.row--right .track { animation: scroll-right 38s linear infinite }
.row:hover .track { animation-play-state: paused }
from { transform: translateX(0) }
to { transform: translateX(-50%) }
from { transform: translateX(-50%) }
to { transform: translateX(0) }
.logo { transition: transform .3s cubic-bezier(.2,.8,.2,1), color .3s, border-color .3s; will-change: transform }
.logo:hover { transform: translateY(-3px) }
```

### [Editorial Press/Testimonial Marquee](https://codepen.io/Ida-Aveltsova/pen/LExWjvG)

on scroll: div.marquee-track: transform | on hover of div.marquee-card: div.marquee-track: transform | made with: @keyframes · transition · :hover

```css
.marquee-track { animation: scroll 40s linear infinite }
.marquee-track:hover { animation-play-state: paused }
.marquee-logo { text-transform: uppercase; margin-bottom: 20px }
.marquee-meta { border-top: 1px solid rgba(0,0,0,0.1); padding-top: 20px }
0% { transform: translateX(0) }
100% { transform: translateX(-50%) }
.redesignee-promo { margin-top: 40px }
.redesignee-promo .promo-link { margin-top: 10px; transition: all 0.2s }
@keyframes scroll animates transform
```

### [AIYSAH SOP](https://codepen.io/Jumadi-Awal/pen/RNKKxzL)

made with: position: sticky · position: fixed · @keyframes · transition · :hover · mix-blend-mode · pointer / mouse tracking

```css
.cursor { position: fixed; transform: translate(-50%, -50%); transition: transform 0.1s ease, width 0.2s, height 0.2s; mix-blend-mode: difference }
.ticker { position: sticky; top: 0; border-bottom: 1px solid rgba(255, 255, 255, 0.06) }
.ticker-inner { animation: ticker 22s linear infinite }
.ticker-sep { opacity: 0.5 }
0% { transform: translateX(0) }
100% { transform: translateX(-50%) }
nav { position: relative }
.nav-links a { transition: color 0.2s }
.hero { position: relative }
.hero::before { position: absolute; inset: 0 }
.hero-blob { position: absolute; top: -100px; animation: blobPulse 5s ease-in-out infinite }
.hero-blob2 { position: absolute; bottom: -50px; animation: blobPulse 7s ease-in-out infinite reverse }
```

```js
addEventListener( "mousemove",
addEventListener("mousemove", (e) => {
addEventListener("mouseenter", () => cursor.classList.add("big"))
addEventListener("mouseleave", () => cursor.classList.remove("big"))
addEventListener("mousemove", onDragMove)
```

### [3d marquee](https://codepen.io/vii120/pen/JoEKzPz)

on scroll: div.marquee: transform+top ×2, div.marquee: transform | made with: @keyframes · mask · 3D (perspective / preserve-3d)

```css
body { perspective: 800px }
.marquee-wrapper { transform: translateZ(var(--depth)) }
.marquee-wrapper .marquee { animation: marquee linear var(--speed) infinite both }
.marquee-wrapper.left { transform: translateZ(var(--depth)) rotateY(var(--side-rotation)); mask: linear-gradient(to right, transparent, #000 10%) }
.marquee-wrapper.left .marquee { animation-name: marquee-left }
.marquee-wrapper.right { transform: translateZ(var(--depth)) rotateY(calc(var(--side-rotation) * -1)); mask: linear-gradient(to left, transparent, #000 10%) }
.marquee-wrapper.right .marquee { animation-name: marquee-right; animation-duration: calc(var(--speed) * 2) }
.marquee-wrapper .emoji-1 { animation: rotate 1s linear both infinite alternate }
to { transform: translateX(-50%) }
from { transform: translateX(calc(-50% + var(--marquee-width))) }
to { transform: translateX(calc(-100% + var(--marquee-width))) }
from { transform: translateX(calc(var(--marquee-width) * -1)) }
```

### [Vibrant Testimonials Block Marquee](https://codepen.io/editor/Ida-Aveltsova/pen/019e9bc6-17be-70a6-8901-9683a6430598)

on scroll: div.marquee-track: transform | on hover of div.marquee-card: div.marquee-track: transform | made with: @keyframes · transition · :hover

```css
.marquee-track { animation: marquee-scroll 35s linear infinite }
.marquee-track:hover { animation-play-state: paused }
.marquee-card { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease }
.marquee-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08) }
.marquee-author { margin-top: 30px }
.marquee-name { margin-bottom: 2px; text-transform: uppercase }
0% { transform: translateX(0) }
100% { transform: translateX(-50%) }
.redesignee-promo-banner { margin-top: 20px; border-top: 1px solid #eeeeee }
.redesignee-promo-banner a { border-bottom: 2px solid transparent; transition: border-color 0.2s }
@keyframes marquee-scroll animates transform
```

### [Infinite Marquee with Mix Blend Mode (Pure CSS)](https://codepen.io/avathiery/pen/emBJLWq)

on scroll: div.bg-circle: transform+top ×3, div.marquee-track: transform | on hover of a.: div.bg-circle: transform+top ×3, div.marquee-track: transform | made with: @keyframes · transition · :hover · mix-blend-mode

```css
.stage { position: relative }
.bg { position: absolute; inset: 0 }
.bg-circle { position: absolute; filter: blur(80px); opacity: 0.6; animation: float 14s ease-in-out infinite }
.bg-circle--pink { top: 10% }
.bg-circle--blue { top: 50%; animation-delay: -5s }
0%, 100% { transform: translate(0, 0) scale(1) }
33% { transform: translate(60px, -40px) scale(1.1) }
66% { transform: translate(-40px, 30px) scale(0.95) }
.marquee { position: relative }
.marquee-track { animation: scroll 28s linear infinite }
.marquee-item { mix-blend-mode: difference }
from { transform: translateX(0) }
```

### [Infinite 3D Marquee](https://codepen.io/ol-ivier/pen/zxKgbgW)

held: fixed div.copy, fixed div.lil-gui | on scroll: div.marquee-track: transform | on hover of img.marquee-img: div.marquee-track: transform | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · 3D (perspective / preserve-3d)

```css
.marquee-world { perspective: 1200px; position: relative; transition: margin 0.1s ease-out }
.marquee-rotated-stage { transition: transform 0.1s ease-out; will-change: transform }
.marquee-container { backdrop-filter: blur(12px); border-top: 2px solid rgba(255, 220, 100, 0.6); border-bottom: 2px solid rgba(255, 220, 100, 0.6); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5) }
.marquee-track { will-change: transform; animation: scrollRightToLeft 25s linear infinite }
.marquee-track.reverse { animation-name: scrollLeftToRight }
.marquee-container:hover .marquee-track { animation-play-state: paused }
.marquee-img { box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); transition: transform 0.2s ease, border-color 0.2s ease }
.marquee-img:hover { transform: scale(1.1) }
.marquee-item .icon { filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4)) }
.copy { position: fixed; bottom: 20px; top: #000 }
0% { transform: translateX(0) }
100% { transform: translateX(-50%) }
```

### [CSS Infinite Marquee](https://codepen.io/Jiironimo/pen/RNGMBPP)

on scroll: div.track: transform ×3 | made with: @keyframes · :hover · mask

```css
.header { opacity: 0; animation: up 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s forwards }
.eyebrow { text-transform: uppercase; margin-bottom: 0.55rem }
.marquee-section { opacity: 0; animation: up 0.8s cubic-bezier(0.22,1,0.36,1) 0.4s forwards }
.marquee-row { border-top: 1px solid rgba(240,236,228,0.08); border-bottom: 1px solid rgba(240,236,228,0.08); -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%); mask-image: linear-gradien }
.track { will-change: transform }
.row-1 .track { animation: scroll-left var(--speed) linear infinite }
.row-2 .track { animation: scroll-right var(--speed-reverse) linear infinite }
.row-3 .track { animation: scroll-left calc(var(--speed) * 1.4) linear infinite }
.marquee-row:hover .track { animation-play-state: paused }
from { transform: translateX(0) }
to { transform: translateX(-50%) }
from { transform: translateX(-50%) }
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

### [Milkshake Brand Landing Page — CSS Slider, Marquee Ticker & Custom Cursor](https://codepen.io/Margarita-the-solid/pen/qEadERd)

held: fixed div.cursor, sticky div.ticker | on scroll: div.ticker-inner: transform, div.hero-blob: transform+top, div.hero-blob2: transform+top, div.dot: opacity, div.hero-img-ring: transform+top, img.: transform+top | on hover of a.nav-logo: div.cursor: transform+top, div.ticker-inner: transform, div.hero-blob: transform+top, div.hero-blob2: transform+top, div.dot: opacity, div.hero-img-ring: transform+top | made with: position: sticky · position: fixed · @keyframes · transition · :hover · mix-blend-mode · pointer / mouse tracking

```css
.cursor { position: fixed; transform: translate(-50%, -50%); transition: transform 0.1s ease, width 0.2s, height 0.2s; mix-blend-mode: difference }
.ticker { position: sticky; top: 0; border-bottom: 1px solid rgba(255, 255, 255, 0.06) }
.ticker-inner { animation: ticker 22s linear infinite }
.ticker-sep { opacity: 0.5 }
0% { transform: translateX(0) }
100% { transform: translateX(-50%) }
nav { position: relative }
.nav-links a { transition: color 0.2s }
.hero { position: relative }
.hero::before { position: absolute; inset: 0 }
.hero-blob { position: absolute; top: -100px; animation: blobPulse 5s ease-in-out infinite }
.hero-blob2 { position: absolute; bottom: -50px; animation: blobPulse 7s ease-in-out infinite reverse }
```

```js
addEventListener( "mousemove",
addEventListener("mousemove", (e) => {
addEventListener("mouseenter", () => cursor.classList.add("big"))
addEventListener("mouseleave", () => cursor.classList.remove("big"))
addEventListener("mousemove", onDragMove)
```

### [ColorBlock & Marquee Components - React + Styled-Components](https://codepen.io/lotus-detalosi/pen/bNeVoyv)

on scroll: div.sc-bxivhb: transform | made with: @keyframes

```css
h1, h2, h3, h4, h5, h6 { margin-top: 40px; margin-bottom: 20px }
```

### [Smooth draggable infinite marquee slider](https://codepen.io/wadi3_lwardy/pen/NPNJPyN)

on scroll: div.slide-box: transform ×9 | made with: GSAP

```css
.slides-wrapper { position: relative }
.slide-box { position: relative }
```

```js
gsap.timeline({
```

### [Partner Logo Slider](https://codepen.io/AM-Expert/pen/RNaBGXY)

on scroll: div.partner-logo-slide: transform | on hover of img.: div.partner-logo-slide: transform | made with: @keyframes · :hover

```css
.partner-logo-slider { position: relative }
.partner-logo-slider:before { position: absolute; top: 0 }
.partner-logo-slider:after { position: absolute; top: 0 }
.partner-logo-slide { animation: partner-logo 30s linear infinite }
.partner-logo-slide:hover { animation-play-state: paused }
from { transform: translateX(0) }
to { transform: translateX(-50%) }
@keyframes partner-logo animates transform
```

### [GSAP Seamless Image Marquee with Desktop & Mobile Tooltips](https://codepen.io/mark_sottek/pen/emZEPJp)

held: fixed div.sprite-tooltip | on scroll: div.sprite-track: transform | on hover of a.: div.sprite-track: transform | made with: position: fixed · transition · GSAP · pointer / mouse tracking

```css
:root { --tt-desktop-offset: translateY(4px); --tt-desktop-offset-visible: translateY(0) }
.sprite-tooltip { position: fixed; box-shadow: var(--tt-shadow); opacity: 0; transform: var(--tt-desktop-offset); transition: opacity var(--tt-fade-duration) var(--tt-fade-ease), transform var(--tt-fade-duration) var(--tt-fade-ease) }
.sprite-tooltip.is-visible { opacity: 1; transform: var(--tt-desktop-offset-visible) }
```

```js
gsap.fromTo(
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
addEventListener("mouseenter", (e) => {
addEventListener("mousemove", (e) => {
```

### [Dark Theme Client Logo sections with Smooth Animation](https://codepen.io/Sajid-Farid/pen/xbZozvq)

made with: @keyframes · transition · :hover

### [Smooth Infinite CSS-Only Marquee: Seamless Looping Animation](https://codepen.io/jamesneufeld/pen/myVZJRq)

on scroll: div.marquee__track: transform | on hover of li.: div.marquee__track: transform | made with: @keyframes

```css
.bulleted { margin-bottom: 1rem }
.featured-note { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) }
.marquee { position: relative; border-top: 3px solid #e9f7fe }
.marquee__track { animation: marquee-scroll 20s linear infinite }
from { transform: translateX(0) }
to { transform: translateX(-50%) }
@keyframes marquee-scroll animates transform
```

### [Link with a marquee](https://codepen.io/kazmi066/pen/EaPzaMj)

on scroll: div.link-row__track: transform ×2 | on hover of a.link-row: div.link-row__track: transform ×2 | made with: @keyframes · transition · :hover · :focus-visible

```css
.link-row { border-top: 1px solid rgba(255, 255, 255, 0.06); border-bottom: 1px solid rgba(255, 255, 255, 0.06); position: relative }
.link-row:focus-visible { outline-offset: -2px }
.link-row__marquee { position: absolute; inset: 0; transform: scaleY(0); transition: transform var(--speed-open) var(--ease-emerge); box-shadow: var(--elev-1) inset }
.link-row:hover .link-row__marquee, .link-row:focus-within .link-row__marquee { transform: scaleY(1) }
.link-row:not(:hover):not(:focus-within) .link-row__marquee { transition: transform var(--speed-close) var(--ease-hide) }
.link-row__track { will-change: transform; animation-name: row-scroll; animation-timing-function: linear; animation-iteration-count: infinite; animation-duration: var(--speed-marquee) }
from { transform: translateX(0) }
to { transform: translateX(-50%) }
@keyframes row-scroll animates transform
```

### [Custom Vertical Marquee with JavaScript](https://codepen.io/anton-bobrov/pen/JoGLENV)

held: fixed div | on scroll: span.: transform+top ×14 | made with: nothing recognised — read the code

### [Marquee Marquee Marquee Marquee](https://codepen.io/cheeaun/pen/OPMvRJO)

made with: @keyframes · mix-blend-mode

```css
html, body { -webkit-animation: bg 240s infinite linear; animation: bg 240s infinite linear }
main { position: absolute; inset: 0 }
marquee { text-transform: uppercase; mix-blend-mode: difference }
marquee > marquee { margin-top: var(--top-margin) }
@keyframes bg animates background-color
```

### [Marquee Text Phasing Effect](https://codepen.io/OuterVale/pen/azdYZRg)

made with: nothing recognised — read the code

### [Custom Marquee without Nodes Cloning / Vevet.js](https://codepen.io/anton-bobrov/pen/wBMpPve)

held: fixed div | on scroll: span.: transform | made with: nothing recognised — read the code

### [CSS Logo Marquee](https://codepen.io/pixiedustandcoughdrops/pen/zxrEJKd)

on scroll: div.logo-marquee--marquee-group: transform ×2 | on hover of img.: div.logo-marquee--marquee-group: transform ×2 | made with: @keyframes · prefers-reduced-motion

```css
.logo-marquee { position: relative }
.logo-marquee--gradient { top: 2.5rem; position: absolute }
.logo-marquee--marquee-group { animation: scroll-left 30s linear infinite }
.logo-marquee--marquee-group { animation-play-state: paused }
0% { transform: translateX(0) }
to { transform: translateX(-100%) }
@keyframes scroll-left animates transform
```

### [Hero Marquee Carousel scroll](https://codepen.io/dermalhealth/pen/xbZXZoM)

on hover of img.: img.: transform | made with: @keyframes · transition · :hover · mask · backdrop-filter · 3D (perspective / preserve-3d) · GSAP · ScrollTrigger · Lenis / smooth scroll

```css
img { transform: rotateY(-45deg); transition: 0.5s ease-in-out; mask: linear-gradient(black 70%, transparent 100%) }
.carousel-track .carousel-item:hover img { transform: rotateY(0deg) translateY(-1rem) }
.scroll-down { position: absolute; bottom: 5rem }
&::after { position: absolute; bottom: -10px; transform: translateX(-50%) }
&::before { position: absolute; top: 50%; transform: translateY(-50%) }
&::after { position: absolute; top: 50%; transform: translateY(-50%) }
.text { margin-bottom: 2.5rem }
&::before { position: absolute; top: 0; transition: left 0.6s ease }
.feature-icon { margin-bottom: 2rem; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)); transition: transform 0.3s ease }
&:hover .feature-icon { transform: scale(1.1) rotate(5deg) }
h3 { margin-bottom: 1.5rem }
.feature-icon { margin-bottom: 1.5rem }
```

```js
gsap.registerPlugin(ScrollTrigger, SplitText)
gsap.to(".image-motion", {
scrollTrigger: { trigger: ".section2", start: "top bottom", end: "bottom top", scrub: true, markers: false }
gsap.fromTo(
scrollTrigger: { trigger: ".section3", start: "top 80%", end: "bottom 20%", toggleActions: "play none none reverse" }
scrollTrigger: { trigger: ".text-content", start: "top 80%", end: "bottom 20%", toggleActions: "play none none reverse" }
scrollTrigger: { trigger: ".features", start: "top 80%", end: "bottom 20%", toggleActions: "play none none reverse" }
```

### [Infinite scroll](https://codepen.io/synphod2/pen/KwVwWYY)

made with: @keyframes · :hover · mask

```css
h1 { margin-bottom: 4rem; text-transform: uppercase }
.marquee { mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent) }
.marquee__inner { animation: scroller 15s infinite linear }
.marquee__inner:hover { animation-play-state: paused }
.marquee__inner li { box-shadow: 3px 5px 10px #0005 }
to { translate: -100% }
@keyframes scroller animates translate
```

### [Modern Marquee with scrollTrigger or pure CSS](https://codepen.io/gridmorphic/pen/zxvbryX)

on scroll: div.marquee-group: transform+top ×5 | on hover of img.: div.marquee-group: transform+top ×5 | made with: @keyframes · :hover · GSAP · ScrollTrigger · Lenis / smooth scroll · requestAnimationFrame

```css
h2 { text-transform: uppercase }
.marquee-2 .marquee-group { animation: scroll 30s linear infinite }
.marquee-2:hover .marquee-group { animation-play-state: paused }
to { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

```js
requestAnimationFrame(raf)
gsap.to(".marquee-1 .marquee-group", {
scrollTrigger: { trigger: ".marquee-1", start: "top-=200% 90%", end: "bottom+=200% 10%", scrub: true // markers: true, }
```

### [2025-08-10 - light rays](https://codepen.io/loiclaudet/pen/XJmawJg)

held: fixed canvas | made with: position: fixed · prefers-reduced-motion · three.js / WebGL · requestAnimationFrame

```css
#light-ray-canvas { position: fixed; inset: 0 }
```

```js
requestAnimationFrame(render)
```

### [滚动 marquee](https://codepen.io/forx-js/pen/JoYNQxW)

made with: nothing recognised — read the code

### [2025-08-05 - scaled text on split ribbons 🎀](https://codepen.io/loiclaudet/pen/WbQjMjZ)

made with: @keyframes · clip-path

```css
video { object-position: center }
h2 { position: relative; animation: translate-x-full; animation-duration: 20s; animation-timing-function: linear; animation-iteration-count: infinite }
h2 .place { text-transform: capitalize; position:absolute; top: 50%; translate: 0 -50% }
span { text-transform: uppercase }
.ribbon { position: absolute; top: 50%; translate: 0 -50%; animation-duration: 5s; animation-timing-function: ease-in-out; animation-direction: alternate; animation-iteration-count: infinite }
.ribbon-top { clip-path: polygon(0 50%, 100% 50%, 100% 0%, 0% 0%); animation-name: split-top }
.ribbon-bottom { clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0% 100%); animation-name: split-bottom }
.top-text, .bottom-text { scale: 1 1.5 }
&:nth-child(2) { animation-delay: 0.1s }
&:nth-child(3) { animation-delay: 0.2s }
&:nth-child(4) { animation-delay: 0.3s }
&:nth-child(5) { animation-delay: 0.4s }
```

### [2-Line Scrolling Logo Marquee with color Tint](https://codepen.io/crevostudio/pen/ByoLMNV)

made with: @keyframes · custom properties driven by JS

```css
:root { --marquee-animation-duration: calc(var(--marquee-elements) * 3s) }
.marquee { position: relative }
.marquee::before, .marquee::after { position: absolute; top: 0 }
.marquee-content { animation: scrolling var(--marquee-animation-duration) linear infinite }
.marquee.reverse .marquee-content { animation: scrolling-reverse var(--marquee-animation-duration) linear infinite }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-1 * var(--marquee-element-width) * var(--marquee-elements))) }
0% { transform: translateX(calc(-1 * var(--marquee-element-width) * var(--marquee-elements))) }
100% { transform: translateX(0) }
.marquee-content li img { filter: invert(17%) sepia(92%) saturate(6614%) hue-rotate(258deg) brightness(96%) contrast(105%) }
@keyframes scrolling animates transform
@keyframes scrolling-reverse animates transform
```

```js
style.setProperty("--marquee-elements", content.children.length)
```

### [Up](https://codepen.io/Freakyfru/pen/myeJNxo)

made with: nothing recognised — read the code

### [Marquee Image Slider](https://codepen.io/baahubali92/pen/RNWPxqz)

on scroll: div.marquee-inner: transform | on hover of img.: div.marquee-inner: transform | made with: transition · :hover · requestAnimationFrame

```css
.marquee-inner .ratio img { transition: all 0.5s }
.marquee-inner .ratio:hover img { -webkit-transform: scale(1.1) rotate(3deg); transform: scale(1.1) rotate(3deg); -webkit-filter: brightness(50%); filter: brightness(50%) }
```

```js
requestAnimationFrame(marqueeScroll)
addEventListener("mouseenter", () => isPaused = true)
addEventListener("mouseleave", () => isPaused = false)
```

### [Sculpture Flow | Infinite Marquee Homepage](https://codepen.io/thej1812/pen/YPyPNoJ)

held: fixed nav.navbar | on scroll: div.marquee-track: transform ×2 | on hover of a.: div.marquee-track: transform ×2 | made with: position: fixed · @keyframes · transition · :hover

```css
.navbar { position: fixed; top: 0 }
.nav-links a { transition: all 0.3s ease; position: relative }
.nav-links a::after { position: absolute; bottom: -5px; transition: width 0.3s ease }
.container { position: relative; padding-top: 80px }
.marquee { position: absolute }
.marquee-track { animation: scroll 30s linear infinite }
0% { transform: translateX(0) }
100% { transform: translateX(-50%) }
.marquee-back { top: 20% }
.center-image { position: absolute; top: 65%; transform: translate(-50%, -50%) }
.marquee-front { bottom: 20% }
.content-section { position: absolute; bottom: 0; padding-bottom: 30px }
```

### [Creative Marquee Portfolio](https://codepen.io/Mahesh-S-the-decoder/pen/zxvYbVP)

made with: @keyframes · transition · :hover

```css
.marquee-left { animation: marquee-left 20s linear infinite }
.marquee-right { animation: marquee-right 20s linear infinite }
.scroll-card { transition: transform 0.3s ease, box-shadow 0.3s ease }
.scroll-card:hover { transform: scale(1.1); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6) }
0% { transform: translateX(0) }
100% { transform: translateX(-50%) }
0% { transform: translateX(-50%) }
100% { transform: translateX(0) }
.marquee-container:hover .marquee-left, .marquee-container:hover .marquee-right { animation-play-state: paused }
@keyframes marquee-left animates transform
@keyframes marquee-right animates transform
```

### [TailwindCSS JavaScript Marquee](https://codepen.io/fauzanmy/pen/PwqMdXO)

made with: nothing recognised — read the code

```js
addEventListener("mouseenter", pauseScrolling)
addEventListener("mouseleave", resumeScrolling)
```

### [GSAP – Dynamic Scroll-Controlled Marquee](https://codepen.io/PRAGNESH-CODE-STUDIO/pen/NPqVdrj)

held: fixed header, fixed div.menu-drawer | on scroll: div.anim-marquee-slider-innerwrap: transform ×4 | on hover of a.: path.[object: color ×16, g.[object: color ×6, polygon.[object: color ×4, div.anim-marquee-slider-innerwrap: transform ×4, line.[object: color ×2, a.: color | made with: GSAP · ScrollTrigger

```css
.anim-marquee-wrapper { margin-top: 32px }
.anim-marquee-slider-wrapper { will-change: transform; position: relative }
.anim-marquee-slider-innerwrap { will-change: transform; position: relative }
```

```js
gsap.registerPlugin(GSDevTools)
gsap.registerPlugin(CustomEase)
gsap.timeline()
gsap.to(marqueeItems, {
ScrollTrigger.create({
gsap.timeline({
scrollTrigger: { trigger: marquee, start: '0% 100%', end: '100% 0%', scrub: 0 }
addEventListener('mouseenter', () => animation.pause())
```

### [Creative Hero Marquee](https://codepen.io/Mahesh-S-the-decoder/pen/ZYGZpvW)

made with: @keyframes · :hover · backdrop-filter

```css
.hero-wrapper { position: relative }
.circle-marquee { position: absolute; animation: spin 30s linear infinite }
.circle-marquee:hover { animation-play-state: paused }
.letter { position: absolute; top: 50%; filter: drop-shadow(0 0 5px #0ff6) }
.orb-center { position: absolute; top: 50%; transform: translate(-50%, -50%); box-shadow: 0 0 120px #0ff2, inset 0 0 50px rgba(255, 0, 255, 0.08); backdrop-filter: blur(10px) }
.orb-center img { filter: drop-shadow(0 0 6px #ffffff99) }
0% { transform: rotate(0deg) }
100% { transform: rotate(360deg) }
@keyframes spin animates transform
```

### [GRADIENT MARQUEE](https://codepen.io/uzitrake/pen/LEVaqKP)

held: fixed header.frame | on scroll: div.box_container: transform+top ×2, div.rail_clip: transform, div.rail_color: transform | on hover of img.rail_gradient: div.box_container: transform+top ×2, div.rail_clip: transform, div.rail_color: transform | made with: position: fixed · @keyframes · transition · :hover · :focus-visible · clip-path

```css
.js .loading::before, .js .loading::after { position: fixed }
.js .loading::before { top: 0 }
.js .loading::after { top: 50%; opacity: 0.4; animation: loaderAnim 0.7s linear infinite alternate forwards }
to { opacity: 1; transform: scale3d(0.5, 0.5, 1) }
a { transition: opacity 250ms cubic-bezier(0.38, 0.005, 0.215, 1), color 250ms cubic-bezier(0.38, 0.005, 0.215, 1) }
a:hover { opacity: 0.6 }
.frame { position: fixed; text-transform: uppercase }
.frame__buttons { margin-bottom: auto }
.frame__tags a { opacity: 0.6 }
.frame__tags a:hover { opacity: 1 }
.content { position: relative }
.frame { position: fixed; top: 0 }
```

### [Dual-Direction Marquee Animation on Scroll](https://codepen.io/sunny_thakor/pen/myJaQNa)

made with: transition · backdrop-filter · GSAP · ScrollTrigger

```css
h2 { margin-bottom: 20px }
.marquee-track { will-change: transform; transform: translate3d(0, 0, 0) }
.item { backdrop-filter: blur(10px); box-shadow: 0 0px 15px rgba(0, 255, 255, 0.2); transition: transform 0.4s ease, box-shadow 0.4s ease; position: relative }
section.marquee-section.ss { transform: rotateY(180deg) }
section.marquee-section.ss .item { transform: rotateY(180deg) }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to(track, {
scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 3, markers: false }
```

### [Infinite Marquee](https://codepen.io/wahidullah_karimi/pen/gbbVQWz)

on scroll: div.marquee__inner: transform | made with: @keyframes · mask

```css
.marquee { -webkit-mask-image: linear-gradient( to right, transparent 0%, black 10%, black 90%, transparent 100% ); mask-image: linear-gradient( to right, transparent 0%, black 10%, black 90%, transparent 100% ) }
.marquee_header { margin-bottom: 20px }
.marquee__inner { animation: marquee 15s linear infinite }
0% { transform: translateX(0) }
100% { transform: translateX(-50%) }
@keyframes marquee animates transform
```

### [Tru Infinite Scroll](https://codepen.io/dwiismantoyuwono/pen/JooQENy)

on scroll: div.infinite-scroll-content: transform | on hover of img.: div.infinite-scroll-content: transform | made with: @keyframes · transition · :hover

```css
.scroll-container .infinite-scroll-wrapper { position: relative }
.infinite-scroll-wrapper .infinite-scroll-content { animation: scroll 100s linear infinite }
.infinite-scroll-items .item-wrap { position: relative }
.item-wrap img { transition: transform 0.3s ease }
.item-wrap .text { position: absolute; top: 16px }
.item-wrap:hover img { transform: scale(1.05) }
.infinite-scroll-wrapper:hover .infinite-scroll-content { animation-play-state: paused }
0% { transform: translateX(0) }
100% { transform: translateX(-50%) }
@keyframes scroll animates transform
```

### [Marquee Logo Full VanillaJS (requestAnimationFrame)](https://codepen.io/francoiscoron/pen/jEEXXLR)

on scroll: div.marquee__ctn: transform | on hover of img.: div.marquee__ctn: transform | made with: :hover · mask · 3D (perspective / preserve-3d) · requestAnimationFrame

```css
.marquee { position: relative; -webkit-mask-image: linear-gradient(var(--mask-direction, to right), rgba(0, 0, 0, 0), black 10%, black 90%, rgba(0, 0, 0, 0)); mask-image: linear-gradient(var(--mask-direction, to right), rgba(0, 0,  }
.marquee__ctn { transform: translate3d(0, 0, 0) scale(1); perspective: 1px }
.marquee__item img { filter: brightness(100%) }
```

```js
requestAnimationFrame(this.animate)
```

### [css marquee](https://codepen.io/tortaruga/pen/dPPwGzZ)

on scroll: p.: transform ×2 | made with: @keyframes · :hover

```css
body { text-transform: uppercase }
.marquee { margin-top: 10rem }
p { animation: scroll 50s infinite linear }
.marquee:hover p { animation-play-state: paused }
to { transform: translateX(-100%) }
@keyframes scroll animates transform
```

### [CSS Infinite Scrolling Text Animation](https://codepen.io/Subin-Abraham/pen/GggreWV)

on scroll: span.scrolling-text: transform | made with: @keyframes

```css
.scroll-container { border-bottom: solid 2px black; position: relative }
.scroll-container .scrolling-text { animation: scroll-left 20s linear infinite }
0% { transform: translateX(0%) }
100% { transform: translateX(-100%) }
@keyframes scroll-left animates transform
```

### [Marquee Line with Pure HTML, CSS & JS](https://codepen.io/Mamikonars/pen/ogNKRya)

held: fixed div.mk-marquee | on scroll: div.mk-marquee__wrapper: transform | on hover of li.: div.mk-marquee__wrapper: transform | made with: position: fixed · @keyframes · transition · :hover · (hover: hover) gate · custom properties driven by JS

```css
.mk-marquee { position: fixed }
.mk-marquee__wrapper { animation: mk-marquee-scroll var(--mk-marquee-speed) linear infinite }
.mk-marquee__content a { transition: opacity 0.3s ease-in }
.mk-marquee__content a:hover { opacity: 0.8 }
0% { transform: translateX(0) }
100% { transform: translateX(-50%) }
.mk-marquee--pause-on-hover:hover .mk-marquee__wrapper { animation-play-state: paused }
.mk-marquee__wrapper { animation: mk-marquee-scroll var(--mk-marquee-speed) linear infinite }
.mk-marquee__content a { transition: opacity 0.3s ease-in }
.mk-marquee__content a:hover { opacity: 0.8 }
0% { transform: translateX(0) }
100% { transform: translateX(-50%) }
```

```js
style.setProperty("--mk-marquee-bg-color", mkMarqueeBgColor)
style.setProperty("--mk-marquee-text-color", mkMarqueeTextColor)
style.setProperty("--mk-marquee-font-size", mkMarqueeFontSize)
style.setProperty("--mk-marquee-height", mkMarqueeHeight)
style.setProperty("--mk-marquee-speed", `${animationDuration}s`)
```

### [Alternate - Marquee (HTML/CSS Only)](https://codepen.io/Meet-the-reactor/pen/raNXmod)

on scroll: div.images-container1: transform+top, div.images-container2: transform+top | on hover of img.: div.images-container1: transform+top, div.images-container2: transform+top | made with: @keyframes

```css
.images-container1 { animation: topToBottom 31s infinite }
.images-container2 { transform: translateY(-200px); animation: bottomToTop 39s infinite }
0% { transform: translateY(0) }
50% { transform: translateY(-200px) }
100% { transform: translateY(0) }
0% { transform: translateY(-200px) }
50% { transform: translateY(0px) }
100% { transform: translateY(-200px) }
@keyframes topToBottom animates transform
@keyframes bottomToTop animates transform
```

### [Marquee](https://codepen.io/Meet-the-reactor/pen/wBvbWLN)

on scroll: div.images-container: transform+top | on hover of img.: div.images-container: transform+top | made with: @keyframes

```css
.images-container { animation: slidingAnimation 20s infinite }
0% { transform: translateY(0) }
50% { transform: translateY(-200px) }
100% { transform: translateY(0) }
@keyframes slidingAnimation animates transform
```

### [Scrolling Text Marquee CSS 🔥](https://codepen.io/joomlaphp/pen/pvoYeBa)

on scroll: div.text-track: transform | made with: @keyframes

```css
.marquee { position: relative }
.marquee .track { animation: marquee 100s linear infinite }
.marquee .text-track,.marquee .track { will-change: transform }
.marquee .text-track { animation: marquee 10s linear infinite }
.marquee .track-2 { animation: marquee-left 100s linear infinite; will-change: transform }
0% { transform: translateX(0) }
to { transform: translateX(-50%) }
to { transform: translateX(0) }
0% { transform: translateX(-50%) }
@keyframes marquee animates transform
@keyframes marquee-left animates transform
```

### [svg textpath curved text marquee requestanimationframe raf animation](https://codepen.io/aosceola56/pen/LEYgBEX)

made with: requestAnimationFrame

```css
p { position: absolute; bottom: 1em }
```

```js
requestAnimationFrame(animate)
```

### [Endless Flow: Seamless Logo Scroller with GSAP](https://codepen.io/mark_sottek/pen/pvoaXRv)

on scroll: div.logo-scroller-row: transform | on hover of img.: div.logo-scroller-row: transform | made with: GSAP

```css
.logo-scroller { position: relative }
.logo-scroller-row { position: relative }
.logo-scroller-item { position: relative }
.logo-scroller-item span { position: relative }
```

```js
gsap.timeline({ repeat: -1, ease: "none" })
addEventListener("mouseenter", () => tl.pause())
addEventListener("mouseleave", () => tl.resume())
```

### [canvas retro marquee](https://codepen.io/sebastianomorando/pen/wBveyZg)

made with: canvas 2D · requestAnimationFrame

```js
requestAnimationFrame(update)
```

### [CSS Chakra Marquee](https://codepen.io/danthewebman/pen/wBwORxO)

on scroll: svg.[object: transform+top ×14, div.marquee__group: transform ×4 | made with: @keyframes · prefers-reduced-motion · mask

```css
.marquee { -webkit-mask-image: linear-gradient( var(--mask-direction, to right), hsl(0 0% 0% / 0), hsl(0 0% 0% / 1) 20%, hsl(0 0% 0% / 1) 80%, hsl(0 0% 0% / 0) ); mask-image: linear-gradient( var(--mask-direction, to right), hsl(0  }
.marquee__group { -webkit-animation: scroll-x var(--duration) linear infinite; animation: scroll-x var(--duration) linear infinite }
.marquee__group.quick { -webkit-animation: scroll-x var(--duration-quick) linear infinite; animation: scroll-x var(--duration-quick) linear infinite }
.marquee__group { -webkit-animation-play-state: paused; animation-play-state: paused }
from { transform: translateX(var(--scroll-start)) }
to { transform: translateX(var(--scroll-end)) }
from { transform: translateX(var(--scroll-start)) }
to { transform: translateX(var(--scroll-end)) }
.rotate { animation: loading var(--duration-icon) linear infinite }
0% { transform: rotate(0) }
100% { transform: rotate(360deg) }
.rotate-back { animation: loading-back var(--duration-icon) linear infinite }
```

### [Infinite Marquee with Morphing Creatures](https://codepen.io/bigapplemonkey/pen/OPLroaP)

on scroll: img.: opacity+top ×12, div.track: transform | on hover of img.: div.track: transform | made with: @keyframes

```css
body { background-position: center }
.marquee { position: relative; border-top: 1.5px solid #080205; border-bottom: 1.5px solid #080205 }
.track { position: absolute; will-change: transform; animation: marquee 15s linear infinite; transform: translateX(0) }
.image-container { position: relative }
#creature-venus, #creature-tentacle, #creature-larva { position: absolute; opacity: 0; scale: 0 }
#creature-venus { animation: carousel 9s infinite }
#creature-tentacle { animation: carousel 9s infinite 3s }
#creature-larva { animation: carousel 9s infinite 6s }
0%, 100% { opacity: 0; scale: 0 }
3% { opacity: 1; scale: 1.15 }
5%, 30% { opacity: 1; scale: 1 }
33% { opacity: 0; scale: 0 }
```

### [Marquee with JS](https://codepen.io/Stefano-Fattori/pen/pvzxqWr)

on scroll: span.: transform | made with: nothing recognised — read the code

```css
.marquee { position: relative }
.marquee span { will-change: transform }
.marquee::before, .marquee::after { position: absolute; top:0; bottom:0 }
```

```js
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [CSS Only Marquees](https://codepen.io/pixelgridui/pen/VYZEPqV)

held: fixed div.pp-widget, fixed button.pp-reopen | on scroll: div.track-vertical: transform+top ×4 | on hover of img.icon: div.track-vertical: transform+top ×4, div.track-horizontal: transform ×3, div.track-horizontal-alt: transform ×2, div.track-vertical-alt: transform+top ×2, span.pp-reopen-dot: transform+opacity+top | made with: @keyframes

```css
.marquee { position: relative }
.marquee-horizontal { position: relative }
.track-horizontal { position: absolute; will-change: transform; animation: marquee-horizontal 40s linear infinite }
.marquee-horizontal-large { position: relative }
.marquee-text { text-transform: uppercase }
.track-horizontal-alt { position: absolute; will-change: transform; animation: marquee-horizontal-alt 40s linear infinite }
.col { position: relative }
.container { position: relative }
.flex-vertical { margin-top: 30px }
.track-vertical { position: relative; position: absolute; will-change: transform; animation: marquee-vertical 20s linear infinite }
.track-vertical-alt { position: absolute; will-change: transform; animation: marquee-vertical-alt 20s linear infinite }
.marquee-cover { position: absolute; top: 0%; bottom: 0% }
```

### [Marquee Animation - GSAP](https://codepen.io/BooGhost/pen/ByBYPaZ)

on scroll: div.marquee_content: transform ×2 | made with: GSAP

```css
.letter { text-transform:uppercase }
```

```js
gsap.fromTo(marquee.children,{x:0},{ x: distanceToTranslate, duration:8, repeat:-1, ease:'none'
```

### [CSS Marquee-edited](https://codepen.io/MhdWasi/pen/ogveYXz)

made with: @keyframes · prefers-reduced-motion

```css
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [bigletter](https://codepen.io/Guy-Hillyer/pen/bNbBXOb)

made with: transition · :hover

```css
#message-source { position: absolute; bottom: 0 }
.hidden { opacity: 0; transition: all ease 0.8s }
.hidden:hover { opacity: 1 }
```

### [CSS Marquee](https://codepen.io/kirillsz/pen/wBwGmbv)

made with: @keyframes · prefers-reduced-motion

```css
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [Responsive Marquee Animation + Modal](https://codepen.io/noirsociety/pen/KwPdwzR)

made with: @keyframes · transition · mask · custom properties driven by JS · <dialog>

```css
.wrapper { transition: background-color 0.8s }
&:nth-of-type(1) { animation-delay: calc((var(--time) / 9) * (9 - 1) * -1) }
&:nth-of-type(2) { animation-delay: calc((var(--time) / 9) * (9 - 2) * -1) }
&:nth-of-type(3) { animation-delay: calc((var(--time) / 9) * (9 - 3) * -1) }
&:nth-of-type(4) { animation-delay: calc((var(--time) / 9) * (9 - 4) * -1) }
&:nth-of-type(5) { animation-delay: calc((var(--time) / 9) * (9 - 5) * -1) }
&:nth-of-type(6) { animation-delay: calc((var(--time) / 9) * (9 - 6) * -1) }
&:nth-of-type(7) { animation-delay: calc((var(--time) / 9) * (9 - 7) * -1) }
&:nth-of-type(8) { animation-delay: calc((var(--time) / 9) * (9 - 8) * -1) }
&:nth-of-type(9) { animation-delay: calc((var(--time) / 9) * (9 - 9) * -1) }
@keyframes marquee animates left
```

```js
style.setProperty('--overlay', show ? 'black' : 'transparent')
```

### [Responsive Marquee Animation](https://codepen.io/noirsociety/pen/MYgwQXe)

made with: @keyframes · mask

```css
&:nth-of-type(1) { animation-delay: calc((var(--time) / 9) * (9 - 1) * -1) }
&:nth-of-type(2) { animation-delay: calc((var(--time) / 9) * (9 - 2) * -1) }
&:nth-of-type(3) { animation-delay: calc((var(--time) / 9) * (9 - 3) * -1) }
&:nth-of-type(4) { animation-delay: calc((var(--time) / 9) * (9 - 4) * -1) }
&:nth-of-type(5) { animation-delay: calc((var(--time) / 9) * (9 - 5) * -1) }
&:nth-of-type(6) { animation-delay: calc((var(--time) / 9) * (9 - 6) * -1) }
&:nth-of-type(7) { animation-delay: calc((var(--time) / 9) * (9 - 7) * -1) }
&:nth-of-type(8) { animation-delay: calc((var(--time) / 9) * (9 - 8) * -1) }
&:nth-of-type(9) { animation-delay: calc((var(--time) / 9) * (9 - 9) * -1) }
@keyframes marquee animates left
```

### [Customizable Infinite Scrolling Image Marquees](https://codepen.io/keanedwards1/pen/yLmdvjR)

on scroll: div.marquee-track: transform+top | on hover of img.marquee-image: div.marquee-track: transform | made with: @keyframes · transition · :hover · IntersectionObserver · requestAnimationFrame

```css
.marquee-wrapper h1 { margin-bottom: 40px }
.image-marquee { margin-bottom: 60px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) }
.image-marquee h2 { margin-bottom: 20px }
.marquee-container { position: relative; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); transition: height 0.3s ease }
.marquee-track { position: absolute; will-change: transform; transform: translateZ(0) }
.marquee-item { position: relative; transition: transform 0.3s ease, opacity 0.3s ease }
.marquee-image { transform: translateZ(0); transition: all 0.3s ease }
.marquee-loading { position: absolute; top: 0; bottom: 0 }
.marquee-loading::after { border-top: 3px solid #3498db; animation: spin 1s linear infinite }
0% { transform: rotate(0deg) }
100% { transform: rotate(360deg) }
.marquee-container { position: relative; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08); transition: height 0.3s ease }
```

### [Infinite Ticker CSS Animation](https://codepen.io/anzhelikaspekter/pen/KKOLGbJ)

on scroll: div.ticker__content: transform ×2 | made with: @keyframes

```css
.subtitle { opacity: 0.8 }
.ticker { position: relative }
.ticker::before { position: absolute; top: 0; transform: matrix(-1, 0, 0, 1, 0, 0) }
.ticker::after { position: absolute; top: 0 }
.ticker__wrap { position: relative }
.ticker__content { animation: ticker 30s linear infinite }
0% { transform: translateX(0) }
100% { transform: translateX(-100%) }
@keyframes ticker animates transform
```

### [Marquee](https://codepen.io/jayramoliya/pen/rNXRqpx)

on scroll: p.: transform | made with: @keyframes

```css
.marquee { position: relative }
p { animation: scroll-left 10s linear infinite }
0% { transform: translateX(100%) }
100% { transform: translateX(-100%) }
@keyframes scroll-left animates transform
```

### [Minimal CSS Only Marquee w/ Fluid Text Using Tailwind + CSS-Doodle](https://codepen.io/sfearl1/pen/ZEgwJrN)

made with: nothing recognised — read the code

### [Only css Marquee](https://codepen.io/swc9803/pen/MWNBJQw)

on scroll: div.marquee: transform ×2 | made with: @keyframes

```css
.marquee { animation: marquee 10s linear infinite }
from { transform: translate3d(0, 0, 0) }
to { transform: translate3d(-100%, 0, 0) }
@keyframes marquee animates transform
```

### [Stock ticker infinite scroll animation (CSS only)](https://codepen.io/henriquebaldy/pen/WNVZwEp)

on scroll: ul.: transform ×2 | on hover of li.minus: ul.: transform ×2 | made with: @keyframes · :hover

```css
.stock-ticker ul { animation: scroll 20s linear infinite }
.stock-ticker:hover ul { animation-play-state: paused }
to { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [Dual Infinite Logo Marquee (CSS only)](https://codepen.io/henriquebaldy/pen/LYwzNxq)

on scroll: div.clients-grid: transform ×6 | on hover of img.client-logo: div.clients-grid: transform ×6 | made with: @keyframes

```css
.home-logo-wrapper { margin-top: 1rem; position: relative }
.home-logo-wrapper.reverse { margin-top: -2rem }
.clients-grid.logo-animate { opacity: 1; margin-top: 0; margin-bottom: 0 }
.logo-animate { animation: slide 35s infinite linear }
.clients-grid.logo-animate-alt { margin-top: 0 }
.logo-animate-alt { animation: slidealt 35s infinite linear; animation-direction: reverse }
0% { transform: translateX(calc(0% + 50px)) }
100% { transform: translateX(-100%) }
.logo-animate { animation: slide 35s infinite linear }
0% { transform: translateX(calc(0% + 50px)) }
100% { transform: translateX(-100%) }
.logo-animate-alt { animation: slidealt 35s infinite linear; animation-direction: reverse }
```

### [Infinite Scroll (CSS only)](https://codepen.io/henriquebaldy/pen/PoMJNzw)

made with: @keyframes · mask

```css
.wrapper { margin-top: 5rem; mask-image: linear-gradient( to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) ); position: relative }
.item { animation-duration: 30s; animation-iteration-count: infinite; animation-name: scrollLeft; animation-timing-function: linear; position: absolute }
.item1 { animation-delay: calc(30s / 8 * (8 - 1) * -1) }
.item2 { animation-delay: calc(30s / 8 * (8 - 2) * -1) }
.item3 { animation-delay: calc(30s / 8 * (8 - 3) * -1) }
.item4 { animation-delay: calc(30s / 8 * (8 - 4) * -1) }
.item5 { animation-delay: calc(30s / 8 * (8 - 5) * -1) }
.item6 { animation-delay: calc(30s / 8 * (8 - 6) * -1) }
.item7 { animation-delay: calc(30s / 8 * (8 - 7) * -1) }
.item8 { animation-delay: calc(30s / 8 * (8 - 8) * -1) }
@keyframes scrollLeft animates left
```

### [Danger Marquee](https://codepen.io/efelezki/pen/WNVRKVp)

made with: @keyframes · :hover

```css
.marquee { position:relative }
.marquee div:hover { box-shadow: 1rem 3rem yellow }
.marquee div { animation: marquee 4s linear infinite; position:absolute }
@keyframes marquee animates right
```

### [music-marquee](https://codepen.io/calm/pen/gOVwMdg)

on scroll: div.runningtext: transform+top ×4 | made with: position: fixed · @keyframes · transition · :hover · 3D (perspective / preserve-3d)

```css
body, html { position: relative }
.projname { text-transform: uppercase }
.site--home .intro-fade { opacity: 0 }
.header-logo { position: absolute; transition: fill 0.1s }
.projecthl { position: fixed; top: 10px }
.projecth1 { text-transform: uppercase }
.projecth1 span { text-transform: uppercase }
.projbox { position: relative }
.block { position: relative; border-bottom: var(--borderline) }
.projname, .projname2 { position: absolute; bottom: 0; top: 0; text-transform: uppercase }
.runningtext-word { text-transform: uppercase; position: relative }
.inner-block { top: 0; bottom: 0; position: relative }
```

### [CSS Marquee](https://codepen.io/franciscochanto/pen/bGXpLre)

on scroll: div.marquee__group: transform+top ×2 | on hover of img.: div.marquee__group: transform ×2 | made with: @keyframes · prefers-reduced-motion

```css
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [CSS Marquee](https://codepen.io/ronokiri/pen/YzmyMXj)

on scroll: div.marquee__group: transform+top ×6 | on hover of img.: div.marquee__group: transform+top ×6 | made with: @keyframes · prefers-reduced-motion

```css
.marquee { transform: skewY(-3deg) }
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [Hover Pause Marquee Animation with Interactive Scaling](https://codepen.io/1870-Trupti-Pokal/pen/BaXNwzd)

made with: @keyframes · transition · :hover

```css
.marquee { position: relative }
.marquee-content { animation: marquee 20s linear infinite; animation-play-state: running }
.marquee:hover .marquee-content { animation-play-state: paused }
.marquee-item { transition: transform 0.4s ease, filter 0.4s ease }
.marquee:hover .marquee-item { filter: blur(4px); transform: scale(0.9) }
.marquee .marquee-item:hover { filter: none; transform: scale(1.2) }
0% { transform: translateX(0) }
100% { transform: translateX(-50%) }
@keyframes marquee animates transform
```

### [NEW Amazing Futuristic Marquee](https://codepen.io/Centuria/pen/qBzeZPo)

on scroll: img.image: clip-path ×6, div.marquee-scroll: transform ×3 | on hover of a.centuria: div.marquee-scroll: transform ×3 | made with: @keyframes · transition · :hover · clip-path

```css
.marquee-scroll { animation: marquee 6s linear infinite }
0% { transform: translateX(0) }
100% { transform: translateX(-100%) }
.bordereffect span { position: relative }
.bordereffect span::after { position: absolute; bottom: -32px; transform: scaleX(0); transition: transform 0.6s ease, transform-origin 0s 0.6s; will-change: transform }
.bordereffect span:hover::after { transform: scaleX(1); transition: transform 0.6s ease, transform-origin 0s }
.bordereffect span:not(:hover)::after { transform: scaleX(0); transition: transform 0.6s ease, transform-origin 0s }
.bordereffect span.hover::after { transform: scaleX(1); transition: transform 0.6s ease, transform-origin 0s }
.images-container { will-change: transform; position: relative }
.image { position: absolute; transition: clip-path 0.6s ease; clip-path: inset(100% 0 0 0) }
.show-images.image { clip-path: inset(0 0 0 0) }
.centuria { position: absolute; bottom: 8px }
```

```js
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [Dynamic Marquee Effect for Technology Showcase](https://codepen.io/Rafael-007/pen/vYqvBJJ)

on scroll: div.marquee__group: transform+top ×3 | on hover of img.: div.marquee__group: transform ×3 | made with: @keyframes · prefers-reduced-motion

```css
.marquee-LeftSideMianTitle { margin-top: 30px }
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [Curved Marquee](https://codepen.io/yul819/pen/NWZLLQJ)

made with: requestAnimationFrame

```css
.marquee-container { position: relative }
.uppercase-text { text-transform: uppercase }
```

```js
requestAnimationFrame(animateText)
```

### [Infinity marquee | Rolling text](https://codepen.io/IrtezaAsad/pen/GRbBoVP)

held: fixed div.marquee-container | on scroll: div.marquee: transform | made with: position: fixed · @keyframes

```css
.marquee-container { position: fixed; top: 0 }
.marquee { animation: marquee 10s linear infinite }
0% { transform: translate3d(0, 0, 0) }
100% { transform: translate3d(-50%, 0, 0) }
@keyframes marquee animates transform
```

### [CSS Marquee](https://codepen.io/Jonathan-Canfield/pen/KKjoxpp)

made with: @keyframes · prefers-reduced-motion

```css
.marquee { transform: skewY(-3deg) }
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [Infinite Marquee -Hover Paused- (No JS)](https://codepen.io/HugoSalazar/pen/bGPLPNx)

held: sticky nav.l-nav | on scroll: ul.l-hero__marquee-items: transform ×2, div.l-hero__headings-baseline: background | on hover of li.: ul.l-hero__marquee-items: transform ×2, div.l-hero__headings-baseline: background | made with: position: sticky · @keyframes · transition · :hover

```css
.l-nav { position: sticky; top: 0; border-bottom: 1px solid #bfbfbf }
.l-nav ul li { position: relative }
.l-nav ul li::before { position: absolute; opacity: 0; transform: rotate(-8deg) translateY(50%); transition: opacity 350ms ease }
.l-nav ul li:hover::before { opacity: 1 }
.l-hero__headings-baseline { text-transform: uppercase; animation: color-cycle 32s linear infinite }
.l-hero__headings-link { opacity: 1; transition: opacity 250ms ease }
.l-hero__headings-link:hover { opacity: 0.8 }
.l-hero__marquee-items { animation: scroll 60s linear infinite }
.l-hero__marquee-items:hover { animation-play-state: paused }
.l-hero__marquee-item { position: relative }
.l-hero__marquee-item img { position: absolute }
0% { transform: translateX(0) }
```

### [top promo bar and marque](https://codepen.io/Pradeep7804/pen/OJexKKv)

on scroll: div.top-info-bar: transform | on hover of a.: div.top-info-bar: transform | made with: @keyframes · transition · :hover

```css
.marquee-text .top-info-bar { -webkit-animation: marquee 25s linear infinite running; -moz-animation: marquee 25s linear infinite running; -o-animation: marquee 25s linear infinite running; -ms-animation: marquee 25s linear infinite running; animatio }
.marquee-text .top-info-bar:hover { -webkit-animation-play-state: paused; -moz-animation-play-state: paused; -o-animation-play-state: paused; -ms-animation-play-state: paused; animation-play-state: paused }
.marquee-text .top-info-bar .info-text { -webkit-transition: all .2s ease; transition: all .2s ease }
0% { -webkit-transform: translateX(0); -moz-transform: translateX(0); -o-transform: translateX(0); -ms-transform: translateX(0); transform: translateX(0) }
100% { -webkit-transform: translate(-50%); -moz-transform: translate(-50%); -o-transform: translate(-50%); -ms-transform: translate(-50%); transform: translate(-50%) }
0% { -webkit-transform: translateX(0); -moz-transform: translateX(0); -o-transform: translateX(0); -ms-transform: translateX(0); transform: translateX(0) }
100% { -webkit-transform: translate(-50%); -moz-transform: translate(-50%); -o-transform: translate(-50%); -ms-transform: translate(-50%); transform: translate(-50%) }
0% { -webkit-transform: translateX(0); -moz-transform: translateX(0); -o-transform: translateX(0); -ms-transform: translateX(0); transform: translateX(0) }
100% { -webkit-transform: translate(-50%); -moz-transform: translate(-50%); -o-transform: translate(-50%); -ms-transform: translate(-50%); transform: translate(-50%) }
0% { -webkit-transform: translateX(0); -moz-transform: translateX(0); -o-transform: translateX(0); -ms-transform: translateX(0); transform: translateX(0) }
100% { -webkit-transform: translate(-50%); -moz-transform: translate(-50%); -o-transform: translate(-50%); -ms-transform: translate(-50%); transform: translate(-50%) }
@keyframes marquee animates -webkit-transform, -moz-transform, -o-transform, -ms-transform, transform
```

### [Ticker mit Button Rechts/Links und Stop-Button](https://codepen.io/christianWiersgowski/pen/JjQNpQV)

made with: requestAnimationFrame

```css
.container { position: relative }
.btn { margin-top: 20px }
.lauftext { position: absolute; top: 15px }
```

```js
requestAnimationFrame(animate)
```

### [Ticker mit Button Rechts/Links](https://codepen.io/christianWiersgowski/pen/eYwWdmm)

made with: requestAnimationFrame

```css
.container { position: relative }
.btn { margin-top: 20px }
.lauftext { position: absolute; top: 15px }
```

```js
requestAnimationFrame(animate)
```

### [Ticker mit Start/Stop-Button: Die Zeite](https://codepen.io/christianWiersgowski/pen/wvLJdoz)

made with: @keyframes

```css
.container { position: relative }
.btn { margin-top: 20px }
.lauftext { position: absolute; top: 0; animation: lauftext-animation 20s linear infinite }
.lauftext-paused { animation-play-state: paused }
@keyframes lauftext-animation animates left
```

### [Marquee with Different Width Badges Using CSS Only](https://codepen.io/sizhik/pen/KKjWKPx)

on scroll: div.marquee-content-one: transform ×2, div.marquee-content-two: transform ×2 | made with: @keyframes · :hover

```css
.marquee-box-one { position: relative }
.marquee-content-one { animation: scroll-one 30s linear infinite }
.marquee-box-two { position: relative }
.marquee-content-two { animation: scroll-two 30s linear infinite }
.marquee-text { text-transform: uppercase }
0% { transform: translateX(0) }
100% { transform: translateX(-100%) }
0% { transform: translateX(-100%) }
100% { transform: translateX(0) }
@keyframes scroll-one animates transform
@keyframes scroll-two animates transform
```

### [Simple Image Carousel / Slider / Marquee in Javascript](https://codepen.io/Lefteris/pen/oNrLZyX)

on scroll: div.marquee-inner: transform | on hover of img.: div.marquee-inner: transform | made with: transition · :hover · requestAnimationFrame

```css
.marquee { position: relative }
.marquee-inner { will-change: transform }
.marquee-inner img { transition: transform 0.5s }
.marquee-inner img:hover { transform: scale(1.03) }
```

```js
requestAnimationFrame(startScrolling)
```

### [Text Marquee](https://codepen.io/raghavbudhiraja/pen/mdZeOYd)

on scroll: div.: transform ×6 | made with: @keyframes · transition · :hover · mask

```css
.scroll { position: relative; -webkit-mask-image: linear-gradient(90deg, transparent, #fff 30%, #fff 70%, transparent) }
.scroll div { animation: animate var(--t) linear infinite; animation-delay: calc(var(--t)/-1) }
.scroll div:nth-child(2) { animation: animate2 var(--t) linear infinite; animation-delay: calc(var(--t)/-2) }
0% { transform: translateX(100%) }
100% { transform: translateX(-100%) }
0% { transform: translateX(0) }
100% { transform: translateX(-200%) }
.scroll div span { text-transform: uppercase; transition: 0.5s }
@keyframes animate animates transform
@keyframes animate2 animates transform
```

### [Logo Marquee Animation - Lit Component](https://codepen.io/bigapplemonkey/pen/QWXbjmV)

made with: @keyframes

```css
html, body { position: relative }
```

### [Gradient Animated Marquee](https://codepen.io/Shean-Jay-the-selector/pen/PorwzbO)

made with: @keyframes

```css
.gradient { position: absolute; top: 0 }
.noise { position: absolute; top: 0; opacity: 0.2 }
.app-footer__marquee { --marquee-animation-duration: 40s }
.u-marquee__content { animation: marquee var(--marquee-animation-duration) linear infinite }
0% { transform: translate(0) }
100% { transform: translate(calc(-100% - var(--marquee-gap))) }
.grid { position: absolute; top: 0; bottom: 0 }
.grid-lines { opacity: 0.25 }
@keyframes marquee animates transform
```

### [CSS-Only Infinite Marquee without HTML Duplication](https://codepen.io/bitgrip-thomas/pen/mdZbgXN)

held: fixed div.showcase | made with: position: fixed · @keyframes

```css
.marquee--paused .marquee__item { -webkit-animation-play-state: paused; animation-play-state: paused }
.marquee__item { --marquee-item-position: calc(var(--marquee-item-index) + 1); -webkit-animation: marquee var(--duration) var(--delay) linear infinite; animation: marquee var(--duration) var(--delay) linear infinite }
from { translate: calc(100% * (var(--marquee-count) - var(--marquee-item-position))) }
to { translate: calc(-100% * var(--marquee-item-position)) }
from { translate: calc(100% * (var(--marquee-count) - var(--marquee-item-position))) }
to { translate: calc(-100% * var(--marquee-item-position)) }
.showcase { position: fixed; inset: 0 }
@keyframes marquee animates translate
```

### [Marquee Sliding Text - no js](https://codepen.io/olgavegh/pen/xxNvLbJ)

held: fixed header | on scroll: div.sliding-text: transform | on hover of a.logo: div.sliding-text: transform | made with: position: fixed · @keyframes · transition · mix-blend-mode

```css
h1 span, summary span { text-transform: uppercase; opacity: 0.8 }
body p { opacity: 0.6 }
body { position: relative }
.flex .details, .flex details { opacity: 0.7 }
.aside .details, .aside details { opacity: 0.7 }
details { transition: all 5s ease-in-out }
summary { position: relative }
summary:before { position: absolute; top: 0; transform: rotate(0); transition: 0.25s transform ease }
details[open] > summary:before { transform: rotate(45deg) }
header { position: fixed }
header svg { opacity: 0.4 }
header svg path { mix-blend-mode: difference }
```

### [Marquee Text Animation - React](https://codepen.io/bigapplemonkey/pen/MWdqryE)

on scroll: div.marquee: transform | made with: @keyframes

```css
.marquee { animation: marqueeAnimation linear infinite }
.marquee-type { text-transform: uppercase }
from { transform: translateX(100%) }
to { transform: translateX(-100%) }
@keyframes marqueeAnimation animates transform
```

### [Pure Css Infinite Text Scroll Animation](https://codepen.io/imedeli/pen/KKLegzR)

held: fixed div.contact-box | on scroll: ul.: transform+top ×2 | on hover of li.: ul.: transform+top ×2 | made with: @keyframes

```css
.marquee { transform: rotate(-4deg) }
ul { -webkit-animation: marquee 8s linear infinite; animation: marquee 8s linear infinite }
to { transform: translateX(calc(-100% - var(--gap))) }
to { transform: translateX(calc(-100% - var(--gap))) }
@keyframes marquee animates transform
```

### [Marquee With GSAP Like Slider](https://codepen.io/tutsplus/pen/xxNjvVv)

held: fixed footer.page-footer | on scroll: div.marquee-item: transform+top ×6 | on hover of a.member-link: div.marquee-item: transform ×6 | made with: position: fixed · transition · :hover · GSAP

```css
.marquee-wrapper { position: relative }
.marquee-item { position: relative }
.member-img { filter: grayscale(100%); transition: filter 0.3s }
.member-details { position: absolute; bottom: 0; transform: translateY(100%); transition: transform 0.3s }
.member-subtitle { text-transform: uppercase }
.member-link:hover .member-details { transform: none }
.member-link:hover .member-img { filter: grayscale(0) }
.marquee-arrow { position: absolute; bottom: -60px; transition: all 0.2s }
.marquee-arrow { top: 50%; transform: translateY(-50%) }
.page-footer { position: fixed; bottom: 50px }
```

```js
addEventListener("mouseenter", () => loop.pause())
addEventListener("mouseleave", () => loop.play())
gsap.timeline({
```

### [Marquee logo in html css](https://codepen.io/piyush-608/pen/BaeYjOe)

on scroll: div.slide-track: transform | on hover of img.: div.slide-track: transform | made with: @keyframes · transition · :hover

### [Marquee Parallax Mouse Animation](https://codepen.io/bigapplemonkey/pen/Jjqrope)

on scroll: span.: transform | on hover of img.layer: span.: transform | made with: @keyframes · pointer / mouse tracking

```css
.marquee { padding-top: 2em }
.marquee span { text-transform: uppercase; animation: marquee-animation 80s linear infinite }
0% { transform: translate(0, 0) }
100% { transform: translate(-100%, 0) }
.img-1 { position: absolute; bottom: 10%; transform: translate(-50%, -50%) }
.img-2 { position: absolute; top: 50%; transform: translate(-50%, -50%) }
@keyframes marquee-animation animates transform
```

```js
addEventListener("mousemove", parallax)
```

### [CSS only infinate marquee](https://codepen.io/cbolson/pen/NWVdqxW)

on scroll: div.carousel: transform | on hover of img.: div.carousel: transform | made with: @keyframes

```css
.carousel-wrapper { --ani-offset: calc(var(--width) * var(--num-items) * -1); position: relative }
.carousel-wrapper::before, .carousel-wrapper::after { position: absolute; top: 0 }
.carousel { animation: slide var(--ani-speed) linear infinite }
100% { transform: translateX(var(--ani-offset)) }
@keyframes slide animates transform
```

### [Marquee CTA](https://codepen.io/nikow/pen/ZENYqvO)

made with: @keyframes

```css
button span { animation: marquee 5s linear infinite }
from { translate:100% }
to { translate:-100% }
@keyframes marquee animates translate
```

### [Бегущая строка | Running line | HTML, CSS](https://codepen.io/21Trew/pen/yLWLRKV)

on scroll: div.main-container__marquee-items: transform ×2 | made with: @keyframes · transition

```css
.main-container__marquee { position: relative; text-transform: uppercase }
.main-container__marquee-track { position: relative }
.main-container__marquee-items { animation: marquee 20s linear infinite }
.main-container__marquee-item { transition: all 0.1s ease-in-out }
from { transform: translateX(0) }
to { transform: translateX(-100%) }
@keyframes marquee animates transform
```

### [Infinite Marquee](https://codepen.io/alam95786/pen/NWmQzGx)

on scroll: div.marquee_text: transform | on hover of li.: div.marquee_text: transform | made with: @keyframes · custom properties driven by JS

```css
.marquee .marquee_text { animation: marquee 30s linear infinite }
.marquee .marquee_text ul { text-transform: uppercase; list-style-position: inside }
.marquee-content-secondary { position:absolute; top:0 }
0% { -webkit-transform: translate3d(0,0,0); transform: translateZ(0) }
to { -webkit-transform: translate3d(var(--marquee-padding-negative),0,0); transform: translate3d(var(--marquee-padding-negative),0,0) }
@keyframes marquee animates -webkit-transform, transform
```

```js
style.setProperty('--marquee-padding', marquee_width + 'px')
```

### [Swiper Marquee (CSS & JS)](https://codepen.io/kagitmiadam/pen/PogrJLj)

on scroll: div.swiper-wrapper: transform ×2 | made with: nothing recognised — read the code

### [Marquee long text with CSS only v2](https://codepen.io/kostasntamas_dev/pen/rNbgeQX)

on scroll: h2.marquee__text: transform+top ×3 | made with: @keyframes

```css
.marquee { margin-top: 5rem; transform: rotate(-2deg) scale(1.1) }
.marquee__text { text-transform: uppercase; animation: marquee-direction var(--_speed) linear infinite }
0% { transform: translateX(var(--_right)) }
100% { transform: translateX(var(--_left)) }
@keyframes marquee-direction animates transform
```

### [Modern Words Marquee - Pure JS](https://codepen.io/AASoft/pen/QWPprxv)

made with: @keyframes

```css
.moving-word { position: absolute }
.moving { animation: moveRight linear forwards; animation-duration: 6s }
body { animation: gradientAnimation 5s infinite linear; animation-direction: alternate }
0% { background-position: 0% 0% }
100% { background-position: 100% 0% }
@keyframes moveRight animates left
@keyframes gradientAnimation animates background-position
```

### [BEAUTIFUL MARQUEE- without <marquee> tag . with HTML , CSS](https://codepen.io/adityapandey141/pen/KKYWoOM)

made with: @keyframes

```css
.custome-marquee { position: relative }
.custome-marquee div { position: absolute; animation: marquee 15s linear infinite }
.custome-marquee span { padding-top:10px; text-transform:uppercase }
@keyframes marquee animates left
```

### [X-ray](https://codepen.io/RomanovskiiArsenii/pen/zYXNQQq)

held: fixed div.credit | on scroll: p.xray__line: transform ×4 | on hover of a.: p.xray__line: transform ×4 | made with: position: fixed · @keyframes · mix-blend-mode

```css
.xray { filter: contrast(180%) }
.xray__line { text-transform: uppercase; mix-blend-mode: exclusion }
.top { animation: moveLeft var(--duration) linear infinite }
.bottom { animation: moveRight var(--duration) linear infinite }
from { transform: translateX(0) }
to { transform: translateX(-100%) }
from { transform: translateX(-100%) matrix(-1, 0, 0, 1, 0, 0) }
to { transform: translateX(0) matrix(-1, 0, 0, 1, 0, 0) }
.credit { position: fixed; bottom: 0 }
@keyframes moveLeft animates transform
@keyframes moveRight animates transform
```

### [Gsap Reeler Marquee](https://codepen.io/uzitrake/pen/vYMGrBz)

on scroll: div.sw-partner-marquee-row: transform | made with: nothing recognised — read the code

```css
.sw-partner-marquee { margin-top: 52px }
.sw-partner-marquee { margin-top: 80px }
.sw-partner-marquee { margin-top: 100px }
.sw-partner-marquee { margin-top: 120px }
.sw-partner-marquee { margin-top: 15vh }
.sw-partner-logo { -webkit-transform: scale(0.75); -moz-transform: scale(0.75); -ms-transform: scale(0.75); -o-transform: scale(0.75); transform: scale(0.75) }
.sw-partner-logo { -webkit-transform: scale(0.85); -moz-transform: scale(0.85); -ms-transform: scale(0.85); -o-transform: scale(0.85); transform: scale(0.85) }
.sw-partner-logo { -webkit-transform: none; -moz-transform: none; -ms-transform: none; -o-transform: none; transform: none }
.sw-partner-info { margin-top: 10px; margin-bottom: 55px; opacity: 0.3 }
.sw-partner-info { margin-top: 20px; margin-bottom: 90px }
.sw-partner-info { margin-top: 30px; margin-bottom: 110px }
.sw-partner-info { margin-top: 35px; margin-bottom: 135px }
```

### [JS smooth marquee](https://codepen.io/krokochik/pen/ExMBJOP)

made with: requestAnimationFrame

```css
.alert { position: absolute; top: 0 }
.alert__message { position: relative }
```

```js
requestAnimationFrame(render)
requestAnimationFrame(() => {
```

### [Marquee animation with 2 background-colors](https://codepen.io/alina-gee/pen/qBvGMeV)

on scroll: div.marquee__wrapper: transform ×2 | made with: @keyframes · :hover

```css
.marquee:hover .marquee__wrapper { animation-play-state: paused }
.marquee__wrapper--a { animation: var(--duration) slide-1 1 linear, calc(var(--duration) * 2) slide-2 var(--duration) infinite linear }
.marquee__wrapper--b { animation: calc(var(--duration) * 2) slide-3 infinite linear }
from { transform: translateX(0) }
to { transform: translateX(-100%) }
0% { transform: translateX(100%) }
100% { transform: translateX(-100%) }
0% { transform: translateX(0) }
100% { transform: translateX(-200%) }
@keyframes slide-1 animates transform
@keyframes slide-2 animates transform
@keyframes slide-3 animates transform
```

### [Marquee UX/UI Design](https://codepen.io/uzitrake/pen/XWGGJgg)

on scroll: div.u-marquee__content: transform ×3 | made with: @keyframes · backdrop-filter

```css
.app-footer__marquee { backdrop-filter: blur(4px); --marquee-animation-duration: 40s }
.u-marquee { position: relative }
.u-marquee__content { animation: marquee var(--marquee-animation-duration) linear infinite }
0% { transform: translate(0) }
to { transform: translate(calc(-100% - var(--marquee-gap))) }
body { position:relative }
.grid { position:absolute; top:0; bottom:0 }
.grid-lines { opacity:0.25 }
@keyframes marquee animates transform
```

### [Simple CSS Marquee Animation](https://codepen.io/mark_sottek/pen/VwRERWE)

on scroll: div.marquee: transform | made with: @keyframes

```css
.marquee { position: relative; animation: marquee 10s linear infinite }
0% { transform: translateX(100%) }
100% { transform: translateX(-100%) }
@keyframes marquee animates transform
```

### [Button Effect - Lunchbox](https://codepen.io/uzitrake/pen/LYadwmd)

made with: @keyframes · :hover · :focus-visible

```css
.button { position: relative }
.button::before, .button::after { position: absolute; top: 0 }
.button--atlas:hover > span { opacity: 0 }
.marquee { position: absolute; top: 0 }
.marquee__inner { position: relative; --offset: 1rem; transform: translate3d(var(--move-initial), 0, 0); animation: marquee 1s linear infinite; animation-play-state: paused; opacity: 0 }
.button--atlas:hover .marquee__inner { animation-play-state: running; opacity: 1 }
0% { transform: translate3d(var(--move-initial), 0, 0) }
100% { transform: translate3d(var(--move-final), 0, 0) }
a:focus-visible, button:focus-visible { outline-offset: 3px }
@keyframes marquee animates transform
```

### [Image Gallery Using Marquee - HTML & CSS](https://codepen.io/chetanst/pen/dyrdrQV)

on scroll: div.pic-container: transform | on hover of img.: div.pic-container: transform | made with: @keyframes · :hover

```css
#marquee .pic-container { animation: marquee 10s infinite linear }
0% { transform: translateX(0) }
100% { transform: translateX(-100%) }
0% { transform: translateX(0) }
100% { transform: translateX(-125%) }
0% { transform: translateX(0) }
100% { transform: translateX(-186.65%) }
@keyframes marquee animates transform
@keyframes marquee animates transform
@keyframes marquee animates transform
```

### [CSS only marquee without HTML duplication](https://codepen.io/CiTA/pen/bGZYBrj)

made with: @keyframes · prefers-reduced-motion · mask

```css
.marquee { position: relative; mask-image: linear-gradient( to right, hsl(0 0% 0% / 0), hsl(0 0% 0% / 1) 20%, hsl(0 0% 0% / 1) 80%, hsl(0 0% 0% / 0) ) }
.marquee__item { --marquee-item-offset: max( calc(var(--marquee-item-width) * var(--marquee-items)), calc(100% + var(--marquee-item-width)) ); position: absolute; transform: translateX(-50%); animation: go linear var(--marquee-duration)  }
.marquee__item { animation-play-state: paused }
@keyframes go animates inset-inline-start
```

### [CSS Marquee](https://codepen.io/vistarama/pen/vYPNaLw)

on scroll: div.marquee__group: transform+top ×12 | on hover of img.: div.marquee__group: transform+top ×9, div.marquee__group: transform ×3 | made with: @keyframes · prefers-reduced-motion

```css
.marquee { transform: skewY(-3deg) }
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [CSS Marquee](https://codepen.io/benkennerly/pen/PoLwxMQ)

on scroll: div.marquee__group: transform+top ×4 | on hover of img.: div.marquee__group: transform+top ×4 | made with: @keyframes · prefers-reduced-motion

```css
.marquee { transform: skewY(-3deg) }
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [Endless Marquee](https://codepen.io/uzitrake/pen/mdvNbyr)

on scroll: ul.marquee-content: transform | on hover of li.: ul.marquee-content: transform | made with: @keyframes · :hover · custom properties driven by JS

```css
:root { --marquee-animation-duration: calc(var(--marquee-elements) * 3s) }
.marquee { position: relative }
.marquee:before, .marquee:after { position: absolute; top: 0 }
.marquee-content { animation: scrolling var(--marquee-animation-duration) linear infinite }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-1 * var(--marquee-element-width) * var(--marquee-elements))) }
@keyframes scrolling animates transform
```

```js
style.setProperty("--marquee-elements", marqueeContent.children.length)
```

### [Infinite Marquee](https://codepen.io/Rituraj-Codes/pen/eYxwZvw)

on scroll: div.marquee_group: transform+top ×2 | made with: @keyframes

```css
.marquee_container { position: relative }
.marquee { position: absolute; top: 50%; transform: translateY(-50%) rotate(-5deg) }
.marquee_group { animation: scroll 15s linear infinite }
from { transform: translateX(0) }
to { transform: translateX(calc(-100% - 60px)) }
.blobs { position: relative }
.blob1 { position: absolute; top: 20%; filter: blur(140px) }
@keyframes scroll animates transform
```

### [truncate text with scroll (ellipsis + marquee)](https://codepen.io/Gilmore-Garland/pen/abXrpNL)

made with: transition · :hover

```css
.label { margin-bottom: 15px; position: relative; transition: 0.75s }
.label span { position: absolute; transform: translateX(0); transition: 0.75s }
.label { box-shadow: inset -6px 0 7px -5px #6b6b6b5e }
.label:hover { box-shadow: inset 6px 0px 7px -5px #6b6b6b5e }
.label:hover span { transform: translateX(calc(200px - 100%)) }
.label:not(:hover) span { transform: translateX(0) }
```

### [Marquee (HTML & CSS)](https://codepen.io/beverlyn-the-vuer/pen/GRzeedp)

on scroll: div.marquee: transform | made with: @keyframes

```css
.container { padding-top: 40px; padding-bottom: 40px }
.marquee { animation: marqueeSlide 20s linear infinite }
from { transform: translateX(0) }
to { transform: translateX(-50%) }
@keyframes marqueeSlide animates transform
```

### [Horizontal marquees with scroll-controlled speed and direction (gsap)](https://codepen.io/natszafraniec/pen/MWLxKxW)

on scroll: span.: transform ×12 | made with: GSAP · ScrollTrigger

```css
h1 { text-transform: uppercase }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline({
ScrollTrigger.create({
gsap.to(tl, { timeScale: direction })
```

### [Very Simple Marquee](https://codepen.io/willarch/pen/xxMzYag)

made with: nothing recognised — read the code

### [Ticker](https://codepen.io/nameasy/pen/abXYevr)

on scroll: ul.ticker__list: transform ×4 | on hover of li.ticker__item: ul.ticker__list: transform ×4 | made with: @keyframes · 3D (perspective / preserve-3d)

```css
.ticker { position: absolute; top: 0 }
0% { -webkit-transform: translateZ(0); transform: translateZ(0) }
100% { -webkit-transform: translate3d(-100%, 0, 0); transform: translate3d(-100%, 0, 0) }
0% { -webkit-transform: translateZ(0); transform: translateZ(0) }
100% { -webkit-transform: translate3d(-100%, 0, 0); transform: translate3d(-100%, 0, 0) }
.ticker__list { position: relative; -webkit-transform: translateZ(0); transform: translateZ(0); -webkit-animation: ticker 15s linear infinite; animation: ticker 15s linear infinite; will-change: transform }
@keyframes ticker animates visibility, -webkit-transform, transform
```

### [jQuery marquee](https://codepen.io/Vladimir-Pavlov-the-selector/pen/ZEwrYKE)

made with: Web Animations API (.animate)

```css
.block { position: relative }
.block-list { position: relative }
```

```js
.animate( {
```

### [scrolling texts using marquee tag](https://codepen.io/karein/pen/mdvBEmp)

made with: nothing recognised — read the code

```css
.grid-top { grid-area: top }
```

### [Carousel Slick Marquee](https://codepen.io/wikyware-net/pen/eYxvYdG)

on scroll: div.slick-track: transform | on hover of img.: div.slick-track: transform | made with: nothing recognised — read the code

### [Infinite Scrolling Text - Marquee using CSS](https://codepen.io/sizhik/pen/oNmYYJJ)

on scroll: h2.marquee-text: transform ×4 | made with: @keyframes

```css
.a-section-marquee-box h2 { text-transform: uppercase; transform: translateX(0); animation: a-text-scroll 35s linear infinite }
0% { transform: translate3d(-100%, 0, 0) }
100% { transform: translate3d(0%, 0, 0) }
.b-section-marquee-box h2 { text-transform: uppercase; transform: translateX(0); animation: b-text-scroll 35s linear infinite }
0% { transform: translate3d(0, 0, 0) }
100% { transform: translate3d(-100%, 0, 0) }
@keyframes a-text-scroll animates transform
@keyframes b-text-scroll animates transform
```

### [React infinite scroll bi-directional Shapes Marquee](https://codepen.io/phillip-gimmi/pen/KKJVMdL)

on scroll: div.marquee__group: transform ×4 | made with: position: fixed · @keyframes · :hover

```css
.marquee__group { animation: scroll-x var(--duration) linear infinite }
.marquee--reverse .marquee__group { animation-direction: reverse }
from { transform: translateX(var(--scroll-start)) }
to { transform: translateX(var(--scroll-end)) }
.marquee:hover .marquee__group { animation-play-state: paused }
.popup { position: fixed; top: 50%; transform: translate(-50%, -50%) }
.popup:after { position: absolute; bottom: -10px; transform: translateX(-50%); border-top: 10px solid var(--color-bg-accent) }
@keyframes scroll-x animates transform
```

### [CSS Marquee](https://codepen.io/Murodjon-Ibrohimov/pen/MWLWrQR)

made with: @keyframes · prefers-reduced-motion

```css
.marquee { transform: skewY(-3deg) }
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [#Clocktober Day 18: Marquee](https://codepen.io/jkantner/pen/KKbOerq)

on scroll: div.clock__digits: transform | made with: @keyframes · transition

```css
body { transition: background-color var(--trans-dur), color var(--trans-dur) }
.clock { box-shadow: 0 0 0 0.125em hsla(var(--hue),10%,10%,0.3) inset, 0 0.25em 0.5em hsla(var(--hue),10%,10%,0.7); transition: background-color var(--trans-dur) }
.clock__colon:before { box-shadow: 0 0.5em 0, 0.5em 0.5em 0, 0 1em 0, 0.5em 1em 0, 0 2em 0, 0.5em 2em 0, 0 2.5em 0, 0.5em 2.5em 0 }
.clock__digits { animation: digitsMarquee 10s steps(165) infinite }
[data-digit="0"]:before { box-shadow: 0.5em 0 0, 1em 0 0, 1.5em 0 0, 0 0.5em 0, 2em 0.5em 0, 0 1em 0, 1.5em 1em 0, 2em 1em 0, 0 1.5em 0, 1em 1.5em 0, 2em 1.5em 0, 0 2em 0, 0.5em 2em 0, 2em 2em 0, 0 2.5em 0, 2em 2.5em 0, 0.5em 3em 0, 1em 3em 0, 1. }
[data-digit="1"]:before { box-shadow: 1em 0 0, 0.5em 0.5em 0, 1em 0.5em 0, 0 1em 0, 1em 1em 0, 1em 1.5em 0, 1em 2em 0, 1em 2.5em 0, 0 3em 0, 0.5em 3em 0, 1em 3em 0, 1.5em 3em 0, 2em 3em 0 }
[data-digit="2"]:before { box-shadow: 0.5em 0 0, 1em 0 0, 1.5em 0 0, 2em 0.5em 0, 2em 1em 0, 0.5em 1.5em 0, 1em 1.5em 0, 1.5em 1.5em 0, 0 2em 0, 0 2.5em 0, 0 3em 0, 0.5em 3em 0, 1em 3em 0, 1.5em 3em 0, 2em 3em 0 }
[data-digit="3"]:before { box-shadow: 0.5em 0 0, 1em 0 0, 1.5em 0 0, 2em 0.5em 0, 2em 1em 0, 0.5em 1.5em 0, 1em 1.5em 0, 1.5em 1.5em 0, 2em 2em 0, 2em 2.5em 0, 0 3em 0, 0.5em 3em 0, 1em 3em 0, 1.5em 3em 0 }
[data-digit="4"]:before { box-shadow: 2em 0 0, 1.5em 0.5em 0, 2em 0.5em 0, 1em 1em 0, 2em 1em 0, 0.5em 1.5em 0, 2em 1.5em 0, 0 2em 0, 0.5em 2em 0, 1em 2em 0, 1.5em 2em 0, 2em 2em 0, 2em 2.5em 0, 2em 3em 0 }
[data-digit="5"]:before { box-shadow: 0.5em 0 0, 1em 0 0, 1.5em 0 0, 2em 0 0, 0 0.5em 0, 0 1em 0, 0 1.5em 0, 0.5em 1.5em 0, 1em 1.5em 0, 1.5em 1.5em 0, 2em 2em 0, 2em 2.5em 0, 0 3em 0, 0.5em 3em 0, 1em 3em 0, 1.5em 3em 0 }
[data-digit="6"]:before { box-shadow: 0.5em 0 0, 1em 0 0, 1.5em 0 0, 0 0.5em 0, 0 1em 0, 0 1.5em 0, 0.5em 1.5em 0, 1em 1.5em 0, 1.5em 1.5em 0, 0 2em 0, 2em 2em 0, 0 2.5em 0, 2em 2.5em 0, 0.5em 3em 0, 1em 3em 0, 1.5em 3em 0 }
[data-digit="7"]:before { box-shadow: 0.5em 0 0, 1em 0 0, 1.5em 0 0, 2em 0 0, 2em 0.5em 0, 2em 1em 0, 1.5em 1.5em 0, 1em 2em 0, 1em 2.5em 0, 1em 3em 0 }
```

### [WAAPI Marquee](https://codepen.io/JMChristensen/pen/NWemeqW)

made with: Web Animations API (.animate)

```js
.animate( {
```

### [CSS Marquee](https://codepen.io/Shibu-das/pen/ExGOXod)

made with: @keyframes · prefers-reduced-motion

```css
.marquee { transform: skewY(-3deg) }
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [CSS Marquee](https://codepen.io/Jameswlepage/pen/PoXaYZN)

on scroll: div.marquee__group: transform+top ×2 | on hover of a.m-item: div.marquee__group: transform+top, div.marquee__group: transform | made with: @keyframes · prefers-reduced-motion

```css
.marquee { transform: skewY(-1.8deg) }
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [Marquee GSAP](https://codepen.io/danramzdev/pen/yLGjVKQ)

on scroll: div.marquee__content: transform+top ×4 | made with: GSAP

```css
.marquee:first-child { transform: rotateZ(-2deg) }
.marquee:last-child { transform: rotateZ(-1deg) }
```

```js
gsap.to(element, {
```

### [Marquee long text with CSS only v2](https://codepen.io/kostasntamas_dev/pen/mdaxwOj)

on scroll: h2.marquee__text: transform+top | made with: @keyframes

```css
.marquee { margin-top: 5rem; transform: rotate(-2deg) scale(1.1) }
.marquee__text { text-transform: uppercase; animation: marquee-direction 20s linear infinite }
0% { transform: translateX(var(--_right)) }
100% { transform: translateX(var(--_left)) }
@keyframes marquee-direction animates transform
```

### [CSS Marquee](https://codepen.io/LE7ELS/pen/oNJGZGB)

on scroll: div.marquee__group: transform+top ×6 | on hover of img.: div.marquee__group: transform+top ×4, div.marquee__group: transform ×2 | made with: @keyframes · prefers-reduced-motion

```css
.marquee { transform: skewY(-3deg) }
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [Marque Animation with Hover Pause](https://codepen.io/_nK/pen/jOXVYpZ)

on scroll: div.: transform ×2 | made with: @keyframes · transition · :hover · mask

```css
:root { --marquee-hover-offset: -50px }
.marquee { -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, #000 var(--marquee-fade-edges), #000 calc(100% - var(--marquee-fade-edges)), rgba(0, 0, 0, 0) 100%); mask-image: linear-gradient(to right, rgba(0, 0, 0,  }
.marquee > div { -webkit-animation: animate-marquee var(--marquee-speed) infinite linear; animation: animate-marquee var(--marquee-speed) infinite linear; transition: var(--marquee-hover-transition-speed) margin-left ease-out; will-chang }
.marquee:hover > div { -webkit-animation-play-state: paused; animation-play-state: paused }
0% { transform: translateX(0%) translateZ(0) }
100% { transform: translateX(-100%) translateZ(0) }
0% { transform: translateX(0%) translateZ(0) }
100% { transform: translateX(-100%) translateZ(0) }
@keyframes animate-marquee animates transform
```

### [Image Clipping Marquee Text](https://codepen.io/BarbWire/pen/rNoWepa)

made with: @keyframes

```css
h4 { position: absolute; top: 20px; transform: translateX(-50%) }
.center { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.marquee-container { position: absolute; top: 50vh; transform: translateY(-50%); animation: marquee 20s linear infinite; filter: drop-shadow(8px 4px 4px rgba(0, 0, 0, 0.7)) }
.marquee-container > p { bottom: 0 }
@keyframes marquee animates left
```

### [CSS Only Marquee](https://codepen.io/axlrsr/pen/BavKmoK)

on scroll: li.marquee__part: transform ×14 | on hover of li.marquee__part: li.marquee__part: transform ×14 | made with: @keyframes

```css
:root { text-transform: uppercase }
from { transform: translateX(0) }
to { transform: translateX(-100%) }
.marquee { position: relative }
.marquee:not(:last-child) { margin-bottom: 16px }
.marquee__part { animation-name: marquee; animation-duration: 4s; animation-timing-function: linear; animation-iteration-count: infinite }
@keyframes marquee animates transform
```

### [Huzaifa](https://codepen.io/Huzaifa-Aslam/pen/poqJKEr)

made with: @keyframes · custom properties driven by JS

```css
#puz, #puzz { position:absolute }
#puz { position:absolute; top:50%; transform:translate(-50%,-50%) }
#puzz { top:0 }
#puzz i { position:absolute; box-shadow:0 0 10px rgba(0,0,0,.25) }
.first { background-position:left top !important }
.secon { background-position:center top !important }
.third { background-position:right top !important }
.fourt { background-position:left center !important }
.fifth { background-position:center center !important }
.sixth { background-position:right center !important }
.seven { background-position:left bottom !important }
.eight { background-position:center bottom !important }
```

```js
style.setProperty('--image', 'url(' + images[currentIndex] + ')')
```

### [Huzaifa](https://codepen.io/Huzaifa-Aslam/pen/KKbpegq)

made with: @keyframes · custom properties driven by JS

```css
#puz, #puzz { position:absolute }
#puz { position:absolute; top:50%; transform:translate(-50%,-50%) }
#puzz { top:0 }
#puzz i { position:absolute; box-shadow:0 0 10px rgba(0,0,0,.25) }
.first { background-position:left top !important }
.secon { background-position:center top !important }
.third { background-position:right top !important }
.fourt { background-position:left center !important }
.fifth { background-position:center center !important }
.sixth { background-position:right center !important }
.seven { background-position:left bottom !important }
.eight { background-position:center bottom !important }
```

```js
style.setProperty('--image', 'url(' + images[currentIndex] + ')')
```

### [infinite marquee](https://codepen.io/mhdzaid/pen/BavaWgW)

made with: @keyframes

```css
.marquee { position: relative }
from { transform: translateX(0) }
to { transform: translateX(calc(-100% - var(--gap))) }
.enable-animation .marquee__content { animation: scroll 8s linear infinite }
.marquee--pos-absolute .marquee__content:last-child { position: absolute; top: 0 }
.enable-animation .marquee--pos-absolute .marquee__content:last-child { animation-name: scroll-abs }
from { transform: translateX(calc(100% + var(--gap))) }
to { transform: translateX(0) }
@keyframes scroll animates transform
@keyframes scroll-abs animates transform
```

### [marquee-SCSS](https://codepen.io/NoNameNote/pen/QWzLdry)

made with: @keyframes · transition

```css
.marquee-wrapper { position: relative }
.marquee-inner { position: absolute }
.marquee-item { transition: animation 0.2s ease-out }
.marquee-inner.to-right { animation: marqueeRight 25s linear infinite }
.marquee-inner.to-left { animation: marqueeLeft 25s linear infinite }
.mb-12 { margin-bottom: 60px }
@keyframes marqueeRight animates left
@keyframes marqueeLeft animates left
```

### [Day 38 - Swiper 跑馬燈樣式](https://codepen.io/NoNameNote/pen/vYvBGzp)

on scroll: ul.swiper-wrapper: transform ×2 | on hover of li.swiper-slide: ul.swiper-wrapper: transform ×2 | made with: nothing recognised — read the code

```css
.mb-15 { margin-bottom: 60px }
.swiper-slide { padding-top: 24px; padding-bottom: 24px }
```

### [Pure CSS Marquee](https://codepen.io/sdgaoqiang/pen/ZEmgNEZ)

on scroll: span.: transform ×3 | made with: @keyframes · custom properties driven by JS

```css
.marquee { position: relative; -webkit-animation: appear 0.1s; animation: appear 0.1s }
.marquee[data-mul="true"] > * { -webkit-animation: move calc(var(--speed) * 3s) linear infinite both alternate; animation: move calc(var(--speed) * 3s) linear infinite both alternate }
to { opacity: 1 }
to { opacity: 1 }
to { transform: translateX(min(100cqw - 100%, 0px)) }
to { transform: translateX(min(100cqw - 100%, 0px)) }
@keyframes appear animates opacity
@keyframes move animates transform
```

```js
style.setProperty( "--speed",
```

### [CSS Marquee](https://codepen.io/zakmounta/pen/GRwbKwL)

on scroll: div.marquee__group: transform+top ×6 | on hover of img.: div.marquee__group: transform+top ×4, div.marquee__group: transform ×2 | made with: @keyframes · prefers-reduced-motion

```css
.marquee { transform: skewY(-3deg) }
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [Marquee links with videos](https://codepen.io/natszafraniec/pen/RwqOxPZ)

on scroll: span.: transform+top ×6 | on hover of li.menu__item: span.: transform ×6 | made with: @keyframes · transition · :hover · mix-blend-mode

```css
.menu__item:nth-child(even) span { animation-direction: reverse }
.menu__link { text-transform: uppercase; position: relative }
.menu__link span { -webkit-animation: marquee 25s linear normal infinite; animation: marquee 25s linear normal infinite; -webkit-animation-play-state: running; animation-play-state: running; position: relative }
.menu__link:hover span { -webkit-animation-play-state: paused; animation-play-state: paused }
.menu__link:hover .menu__background { opacity: 0.75 }
.menu__background { position: absolute; top: 0; bottom: 0; opacity: 0; transition: opacity 0.3s; mix-blend-mode: screen; filter: saturate(0.5) }
to { transform: translateX(-100%) }
to { transform: translateX(-100%) }
@keyframes marquee animates transform
```

### [marquee-smooth](https://codepen.io/NoNameNote/pen/KKrEgZp)

on scroll: div.marquee-content: transform | on hover of li.py-3: div.marquee-content: transform | made with: @keyframes · :hover

```css
.py-2 { padding-top: 8px; padding-bottom: 8px }
.py-3 { padding-top: 12px; padding-bottom: 12px }
.marquee-content { animation: marquee 30s linear infinite }
.item-collection-1 { position: relative; animation: swap 30s linear infinite }
.marquee-content:hover { animation-play-state: paused }
0% { transform: translateX(0) }
100% { transform: translateX(-100%) }
@keyframes swap animates left
@keyframes marquee animates transform
```

### [marquee-gpt](https://codepen.io/NoNameNote/pen/JjezRoE)

on scroll: div.track: transform | on hover of li.py-3: div.track: transform | made with: @keyframes

```css
.py-2 { padding-top: 8px; padding-bottom: 8px }
.py-3 { padding-top: 12px; padding-bottom: 12px }
.marquee { position: relative }
.track { position: absolute; will-change: transform; animation: marquee 32s linear infinite }
from { transform: translateX(0) }
to { transform: translateX(-50%) }
@keyframes marquee animates transform
```

### [track-horizontal](https://codepen.io/NoNameNote/pen/poQGZBM)

on scroll: div.track-horizontal: transform | made with: @keyframes

```css
.track-horizontal { position: absolute; will-change: transform; animation: marquee-horizontal 10s linear infinite }
from { transform: translateX(0) }
to { transform: translateX(-50%) }
@keyframes marquee-horizontal animates transform
```

### [CSS-marquee-left-work](https://codepen.io/NoNameNote/pen/qBQgyjZ)

made with: @keyframes

```css
.py-2 { padding-top: 8px; padding-bottom: 8px }
.py-3 { padding-top: 12px; padding-bottom: 12px }
.marquee { position: relative }
.marquee div { position: absolute }
.marqee-ani-first { animation: marquee-first 50s linear infinite }
.marqee-ani-second { animation-delay: 25s; animation: marquee-second 50s linear infinite }
@keyframes marquee-first animates left
@keyframes marquee-second animates left
```

### [Marquee CSS](https://codepen.io/ven3num/pen/XWyYMaW)

made with: @keyframes · prefers-reduced-motion

```css
section > .marquee { text-transform: uppercase }
.marquee::before { transform: translate3d(var(--translate-3d-x, -2%), 0, 0); will-change: transform }
.marquee::before { animation: marquee 60s linear infinite }
.marquee--reverse::before { animation-direction: reverse }
0% { transform: translate3d(var(--translate-3d-x, -2%), 0, 0) }
100% { transform: translate3d(calc(var(--translate-3d-x) - 5% - 1px), 0, 0) }
section#marquee { padding-bottom:var(--padding-sectionY, 50px) }
section > .marquee { bottom:0 }
@keyframes marquee animates transform
```

### [CSS Marquee](https://codepen.io/Inquinima/pen/xxQYNKj)

on scroll: div.marquee__group: transform+top ×6 | on hover of img.: div.marquee__group: transform+top ×4, div.marquee__group: transform ×2 | made with: @keyframes · prefers-reduced-motion

```css
.marquee { transform: skewY(-3deg) }
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [Vertical marquee with a scroll animation](https://codepen.io/natszafraniec/pen/QWJQmPP)

held: fixed div.marquee | on scroll: span.: transform+top ×5 | made with: position: fixed · GSAP · ScrollTrigger

```css
.marquee { position: fixed; top: 0; bottom: 0; transform: rotate(-180deg); text-transform: uppercase }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline({})
ScrollTrigger.create({
gsap.to(tl, { timeScale: direction })
gsap.to(tl, { timeScale: direction, overwrite: true })
```

### [Marquee inside a button](https://codepen.io/natszafraniec/pen/BaGYrVV)

on scroll: span.: transform ×2 | on hover of button.: span.: transform ×2 | made with: @keyframes · :hover

```css
button { text-transform: uppercase }
button:hover > span { -webkit-animation-play-state: paused; animation-play-state: paused }
button span { -webkit-animation: marquee 5s infinite normal linear; animation: marquee 5s infinite normal linear }
to { transform: translateX(-100%) }
to { transform: translateX(-100%) }
@keyframes marquee animates transform
```

### [CSS Marquee](https://codepen.io/markokvip/pen/ExOvGyO)

made with: @keyframes · prefers-reduced-motion

```css
.marquee { transform: skewY(-3deg) }
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [CSS Marquee](https://codepen.io/Varvara999/pen/LYXjLmg)

on scroll: div.marquee__group: transform+top ×2 | made with: @keyframes · prefers-reduced-motion

```css
.marquee { transform: skewY(-3deg) }
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [Infinite-Scrolling Marquee Plugin - jQuery Horizontal-Panel - breaking news Ticker](https://codepen.io/a7rarpress/pen/eYQBeNX)

made with: :hover

```css
.presenter { position: relative }
.logo { position: absolute; bottom: -23px }
.logo h1 { text-transform: uppercase }
.logo #breaking { margin-top: 10px }
.container { position: relative }
#panel { bottom: 25px; position: absolute }
.content li { position: absolute }
.content h1 { vertical-align: bottom }
footer { margin-top: 100px }
footer h2 { text-transform: uppercase }
#jquery-script-menu { position:absolute; top:0; border-top:5px solid #316594; -moz-box-shadow:0 2px 3px 0 rgba(0,0,0,.16); -webkit-box-shadow:0 2px 3px 0 rgba(0,0,0,.16); box-shadow:0 2px 3px 0 rgba(0,0,0,.16) }
#carbonads { position:relative }
```

### [Custom Marquee with css animation](https://codepen.io/zamin-mirzad/pen/ExOyzJa)

on scroll: h2.: transform ×12 | made with: @keyframes

```css
.flex h2 { animation: example1 30s linear infinite }
0% { -moz-transform: translateX(0%); -webkit-transform: translateX(0%); transform: translateX(0%) }
100% { -moz-transform: translateX(-90rem); -webkit-transform: translateX(-90rem); transform: translateX(-90rem) }
```

### [breaking news ticker - Marquee](https://codepen.io/a7rarpress/pen/BaGzWwj)

held: fixed div.ticker | made with: position: fixed

```css
.ticker { position: fixed; bottom: 0px }
.news-title { position: absolute }
.news-title:after { position: absolute; top: 0px }
.news marquee { margin-top: 15px }
```

### [CSS Marquee](https://codepen.io/Anton-Art/pen/xxQVVOG)

made with: @keyframes · prefers-reduced-motion

```css
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [CSS Marquee](https://codepen.io/Anton-Art/pen/ExOKKyx)

made with: @keyframes · prefers-reduced-motion

```css
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [CSS Marquee](https://codepen.io/unetic/pen/OJaMpdx)

on scroll: div.marquee__group: transform ×6 | on hover of img.: div.marquee__group: transform ×6 | made with: @keyframes · prefers-reduced-motion

```css
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [Smooth Scrolling Marquee Example](https://codepen.io/oneblackcrayon/pen/yLQYaBj)

on scroll: p.: transform | made with: @keyframes

```css
.scroll-left { position: relative }
.scroll-left p { position: absolute; -moz-transform:translateX(100%); -webkit-transform:translateX(100%); transform:translateX(100%); -moz-animation: scroll-left 28s linear infinite; -webkit-animation: scroll-left 28s linear infinite; an }
0% { -moz-transform: translateX(100%) }
100% { -moz-transform: translateX(-100%) }
0% { -webkit-transform: translateX(100%) }
100% { -webkit-transform: translateX(-100%) }
0% { -moz-transform: translateX(100%); -webkit-transform: translateX(100%); transform: translateX(100%) }
100% { -moz-transform: translateX(-100%); -webkit-transform: translateX(-100%); transform: translateX(-100%) }
@keyframes scroll-left animates -moz-transform, -webkit-transform, transform
```

### [Marquee js](https://codepen.io/srhcdesign/pen/XWymrbX)

made with: nothing recognised — read the code

```css
.marquee h1 { text-transform: uppercase }
```

```js
addEventListener('mouseenter', stopMarquee)
addEventListener('mouseleave', startMarquee)
```

### [CSS Marquee](https://codepen.io/pmakos/pen/bGQNexa)

on scroll: div.marquee_group: transform ×2 | made with: @keyframes

```css
.marquee_group { animation: scroll var(--duration) linear infinite }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [jquery smart marquee Plugin Demo](https://codepen.io/a7rarpress/pen/dyQbLjK)

made with: nothing recognised — read the code

### [jQuery Marquee js Breaking News Plugin Demos](https://codepen.io/a7rarpress/pen/ExOYJQX)

made with: nothing recognised — read the code

### [Style for breaking news ستايل للاخبار العاجلة](https://codepen.io/a7rarpress/pen/xxyNLNo)

held: fixed div.item | made with: position: fixed · @keyframes

```css
.item { position: fixed; bottom: 0 }
.title { text-transform: uppercase }
.subtitle { text-transform: uppercase }
.description-container { position: relative }
.description { position: relative; animation-name: slideInRight; animation-timing-function: linear; animation-iteration-count: infinite; animation-duration: 20s }
@keyframes slideInRight animates right
```

### [CSS Marquee](https://codepen.io/caitlinemond/pen/YzJMqYE)

made with: @keyframes · prefers-reduced-motion

```css
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [breaking news Ticker](https://codepen.io/a7rarpress/pen/PoyLBrz)

on scroll: div.js-marquee-wrapper: transform | on hover of li.: div.js-marquee-wrapper: transform | made with: nothing recognised — read the code

```css
.marquee { position: relative }
.marquee:before { position: absolute; top: 0; bottom: 0 }
.marquee li:before { position: relative; bottom: -0.3em; opacity: 0.6 }
```

### [CSS Marquee](https://codepen.io/nummi/pen/VwERarX)

on scroll: div.marquee__group: transform ×2 | made with: @keyframes

```css
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [marquee - breaking news Ticker](https://codepen.io/a7rarpress/pen/QWZJWmV)

held: fixed div.marquee, fixed div.marquee | on scroll: ul.marquee__content: transform ×4 | on hover of li.: ul.marquee__content: transform ×4 | made with: position: fixed · @keyframes

```css
.marquees-wrapper { position: relative }
.marquees-wrapper::after { position: absolute; inset: 0 }
.marquee { border-top:1px solid #000; border-bottom:1px solid #000 }
.scroll { animation: scroll 30s linear infinite }
from { transform: translateX(0) }
to { transform: translateX(calc(-100% - var(--gap))) }
.marquee__content li { text-transform: uppercase }
.marquee-1 { top: 0; position: fixed }
.marquee-1 .scroll { animation: scroll 20s linear infinite }
.marquee-2 { bottom: 0; position: fixed }
.marquee-2 .scroll { animation: scroll 25s linear infinite reverse }
@keyframes scroll animates transform
```

### [Marquee](https://codepen.io/a7rarpress/pen/abRjyLK)

made with: nothing recognised — read the code

```css
marquee { box-shadow: 0px 5px 5px #262626 }
```

### [news Ticker Message](https://codepen.io/a7rarpress/pen/ExdRLLO)

made with: nothing recognised — read the code

### [Long infinity Marquee](https://codepen.io/siddharth-nalwaya/pen/WNaJzEv)

on scroll: span.marquee-1: transform ×2 | made with: @keyframes

```css
.marquee { position: relative }
.marquee-1, .marquee-2 { position: absolute }
.marquee-1 { animation: marquee-keywords 30s linear infinite }
0% { transform: translate(0, 0) }
100% { transform: translate(-100%, 0) }
0% { -webkit-transform: translate(0, 0) }
100% { -webkit-transform: translate(-100%, 0) }
@keyframes marquee-keywords animates transform
```

### [CSS Marquee](https://codepen.io/mattwilcoxuk/pen/KKGRdgz)

on scroll: div.marquee__group: transform+top ×6 | on hover of img.: div.marquee__group: transform+top ×6 | made with: @keyframes · prefers-reduced-motion

```css
.marquee { transform: skewY(-3deg) }
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [Breaking News or Scrolling text using Marquee in Blogger](https://codepen.io/a7rarpress/pen/NWOMqoZ)

made with: nothing recognised — read the code

```css
.container { position: relative }
.container .headertext { position: absolute; top: 0 }
```

### [Breaking News marquee](https://codepen.io/a7rarpress/pen/zYmWJxM)

held: fixed div.ticker | made with: position: fixed

```css
.ticker { position: fixed; bottom: 5px }
.news-title { position: absolute }
.news-title:after { position: absolute; top: 0px }
.news marquee { margin-top: 13px }
```

### [breaking news Ticker marquee](https://codepen.io/a7rarpress/pen/gOBezML)

held: fixed div.ticker | made with: position: fixed

```css
.ticker { position: fixed; bottom: 0px }
.news-title { position: absolute }
.news-title:after { position: absolute; border-top: 28px solid transparent; border-bottom: 21px solid transparent; top: 0px }
.news marquee { margin-top:15px }
```

### [Responsive Text Scrolling Effect – Pure CSS Marquee](https://codepen.io/a7rarpress/pen/mdzxJZo)

on scroll: span.: transform | made with: @keyframes

```css
.marquee { position: relative }
.marquee > * { -webkit-animation: marquee 10s linear infinite both alternate; animation: marquee 10s linear infinite both alternate }
to { transform: translateX(min(100cqw - 100%, 0px)) }
to { transform: translateX(min(100cqw - 100%, 0px)) }
@keyframes marquee animates transform
```

### [Simple Flash news using Marquee tag](https://codepen.io/a7rarpress/pen/qBJoEJZ)

made with: nothing recognised — read the code

### [marquee text for website News and Events section using css](https://codepen.io/a7rarpress/pen/qBJoEMZ)

made with: nothing recognised — read the code

### [Marquee text with close button using jquery](https://codepen.io/a7rarpress/pen/YzJaPvN)

made with: transition

### [Horizontal Marquee News ticker using Html & Css](https://codepen.io/a7rarpress/pen/KKGowyG)

made with: nothing recognised — read the code

### [Dynamic Marquee](https://codepen.io/a7rarpress/pen/wvYyzZQ)

held: fixed div | on scroll: div.: transform | made with: position: fixed · :hover

### [Text animation effect](https://codepen.io/smiler142/pen/gOBomZd)

on scroll: h2.: transform ×2 | made with: @keyframes

```css
section { position: relative }
section div { position: relative }
section div:nth-child(2) { background-position: 50% 10% }
section div h2 { position: absolute; animation: runon 15s linear infinite }
0% { transform: translateX(0) }
100% { transform: translateX(-100%) }
@keyframes runon animates transform
```

### [Swiper Slider Marquee Effect Style](https://codepen.io/Alpesh_Rajpurohit/pen/OJBzWgW)

on scroll: div.swiper-wrapper: transform | made with: nothing recognised — read the code

```css
html, body { position: relative }
.swiper-slide { position: relative }
```

```js
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [Marquee Example Page](https://codepen.io/a7rarpress/pen/ExdbVwq)

made with: nothing recognised — read the code

```css
h4, h5 { margin-bottom: 0 }
.examples pre { margin-top: 0 }
```

### [breaking news ticker - Marquee](https://codepen.io/a7rarpress/pen/xxyPwwo)

made with: :hover

```css
.myMarquee { position:relative; -o-box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7); -moz-box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7); -webkit-box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7); box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7) }
.scroller { position:absolute; top:0; -moz-animation-iteration-count: infinite; -moz-animation-timing-function: linear; -moz-animation-duration:10s; -moz-animation-name: scroll; -webkit-animation-iteration-count: infinite; -webkit-a }
.scroller:hover { -moz-animation-play-state: paused }
.scroller:hover { -webkit-animation-play-state: paused }
```

### [Marquee custom CSS3 only](https://codepen.io/a7rarpress/pen/KKGXjRr)

on scroll: ul.: transform | on hover of li.: ul.: transform | made with: @keyframes · transition · :hover

```css
.marquee-list { border-bottom: #a4a8a7 1px solid }
.marquee-list ul { -webkit-animation: marquee 10s linear infinite running; -moz-animation: marquee 10s linear infinite running; -o-animation: marquee 10s linear infinite running; -ms-animation: marquee 10s linear infinite running; animatio }
.marquee-list ul:hover { -webkit-animation-play-state: paused; -moz-animation-play-state: paused; -o-animation-play-state: paused; -ms-animation-play-state: paused; animation-play-state: paused }
.marquee-list li { -webkit-transition: all 0.2s ease; -moz-transition: all 0.2s ease; -o-transition: all 0.2s ease; -ms-transition: all 0.2s ease; transition: all 0.2s ease; position: relative; text-transform: uppercase }
.marquee-list li:before { position: absolute; top: 0; bottom: 0 }
0% { -webkit-transform: translateX(0); -moz-transform: translateX(0); -o-transform: translateX(0); -ms-transform: translateX(0); transform: translateX(0) }
100% { -webkit-transform: translate(-20%); -moz-transform: translate(-20%); -o-transform: translate(-20%); -ms-transform: translate(-20%); transform: translate(-20%) }
0% { -webkit-transform: translateX(0); -moz-transform: translateX(0); -o-transform: translateX(0); -ms-transform: translateX(0); transform: translateX(0) }
100% { -webkit-transform: translate(-20%); -moz-transform: translate(-20%); -o-transform: translate(-20%); -ms-transform: translate(-20%); transform: translate(-20%) }
0% { -webkit-transform: translateX(0); -moz-transform: translateX(0); -o-transform: translateX(0); -ms-transform: translateX(0); transform: translateX(0) }
100% { -webkit-transform: translate(-20%); -moz-transform: translate(-20%); -o-transform: translate(-20%); -ms-transform: translate(-20%); transform: translate(-20%) }
0% { -webkit-transform: translateX(0); -moz-transform: translateX(0); -o-transform: translateX(0); -ms-transform: translateX(0); transform: translateX(0) }
```

### [GSAP ScrollTrigger marquee](https://codepen.io/ahabbsciencestudiopak/pen/YzJVEye)

on scroll: div.marquee-text: transform+top ×3 | made with: GSAP · ScrollTrigger

```css
.marquee { margin-bottom: 10px }
.marquee-text { text-transform: uppercase }
.spacer { margin-bottom: 200px }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.fromTo(w, { x }, {
scrollTrigger: { trigger: section, scrub: 0.5 }
```

### [marquee text](https://codepen.io/a7rarpress/pen/poxyXQY)

made with: nothing recognised — read the code

### [marquee ticker](https://codepen.io/a7rarpress/pen/KKGVBGj)

made with: @keyframes · :hover

```css
.marquee { box-shadow: 2px 2px 3px #999999; animation: marquee 20s linear infinite }
.marquee:hover { animation-play-state: paused }
@keyframes marquee animates text-indent
```

### [Breaking News Ticker - Footer Pure CSS bottom fixed marquee](https://codepen.io/a7rarpress/pen/poxJJWG)

held: fixed div.announcements | made with: position: fixed

```css
.announcements { position: fixed; bottom: 0px }
.announcements .ticker { position: relative }
```

### [Breaking News Ticker - Footer Pure CSS bottom fixed marquee with arrow](https://codepen.io/a7rarpress/pen/poxJJPq)

held: fixed div.ticker | made with: position: fixed

```css
body { background-position: center }
.ticker { position: fixed; bottom: 0px }
.news-title { position: absolute }
.news-title:after { position: absolute; border-top: 28px solid transparent; border-bottom: 21px solid transparent; top: 0px }
.news marquee { margin-top:15px }
```

### [Animated Marquee Animation (HTML/CSS) - Made Easy](https://codepen.io/wesleybertipaglia/pen/zYmOoEw)

on scroll: ul.marquee__content: transform ×2 | on hover of li.: ul.marquee__content: transform ×2 | made with: @keyframes

```css
:root { --animation-speed: 20s }
.marquee__content { animation: scroll var(--animation-speed) linear infinite }
0% { transform: translateX(0%) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [marquee](https://codepen.io/a7rarpress/pen/YzOBOQb)

made with: nothing recognised — read the code

### [GSAP Circular SVG Marquee](https://codepen.io/rhernando/pen/mdGzwQV)

held: fixed svg.[object | on scroll: text.[object: transform+top ×4 | made with: position: fixed · GSAP

```css
.circles { position: fixed; top: 0 }
.circles__text { text-transform: uppercase; will-change: transform, opacity }
```

```js
gsap.to("text.circles__text", {
```

### [小屁雯](https://codepen.io/erickwan/pen/ExedjgW)

on scroll: div.marquee__group: transform+top ×6 | on hover of img.: div.marquee__group: transform+top ×4, div.marquee__group: transform ×2 | made with: @keyframes · prefers-reduced-motion

```css
.marquee { transform: skewY(-3deg) }
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [Simple Infinite Marquee](https://codepen.io/jaredgroff/pen/OJozMBg)

made with: nothing recognised — read the code

```css
.marquee h1 { text-transform: uppercase }
```

### [CSS marquee бегущая строка](https://codepen.io/emelyanova/pen/gOdXxOr)

on scroll: div.line-text: transform ×2, div.line-text: transform+top ×2 | made with: @keyframes

```css
.promo-lines { position: relative }
.line-text { text-transform: uppercase; -webkit-animation: animate-first-screen 40s -40s linear infinite; animation: animate-first-screen 40s -40s linear infinite; will-change: transform }
.line-text:nth-child(2) { -webkit-animation: animate-second-screen 40s -20s linear infinite; animation: animate-second-screen 40s -20s linear infinite }
.line-violet { transform: rotate(-7.68deg) translate(-200px, 100px); top: 110px }
0% { transform: translateX(100%) }
100% { transform: translateX(-100%) }
0% { transform: translateX(100%) }
100% { transform: translateX(-100%) }
0% { transform: translateX(0) }
100% { transform: translateX(-200%) }
0% { transform: translateX(0) }
100% { transform: translateX(-200%) }
```

### [CSS Autoscrolling Carousel/Marquee](https://codepen.io/numerical/pen/MWqvOqB)

on scroll: div.slide: transform ×2 | made with: @keyframes · mask

```css
.marquee { -webkit-mask-image: linear-gradient( 90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 25%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 0) 100% ); mask-image: linear-gradient( 90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 25%, rgba(0, }
.marquee .slide { -webkit-animation: slide-x 10s linear infinite; animation: slide-x 10s linear infinite }
0% { transform: translateX(0) }
100% { transform: translateX(-100%) }
0% { transform: translateX(0) }
100% { transform: translateX(-100%) }
@keyframes slide-x animates transform
```

### [Infinite marqee](https://codepen.io/Gutts_/pen/jOvwWyo)

made with: @keyframes · :hover

```css
.container { position: relative }
.marquee { position: absolute; animation: scroll 13s linear infinite; animation-direction:right }
.marquee:hover { animation-play-state: paused }
0% { transform: translateX(700px) }
100% { transform: translateX(calc(-150% + 50px)) }
```

### [CSS Marquee](https://codepen.io/nice-sarunporn/pen/LYJNdqK)

on scroll: div.marquee__group: transform+top ×6 | on hover of img.: div.marquee__group: transform+top ×6 | made with: @keyframes · prefers-reduced-motion

```css
.marquee { transform: skewY(-3deg) }
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [CSS Marquee](https://codepen.io/nice-sarunporn/pen/qBMZogG)

on scroll: div.marquee__group: transform+top ×6 | on hover of img.: div.marquee__group: transform+top ×6 | made with: @keyframes · prefers-reduced-motion

```css
.marquee { transform: skewY(-3deg) }
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [Simple CSS Marquee](https://codepen.io/MizterJeeves/pen/mdGPORj)

on scroll: div.marquee-item: transform ×3 | on hover of a.: div.marquee-item: transform ×3 | made with: @keyframes · transition · :hover

```css
.marquee { position: relative; position: relative }
.marquee:hover { animation-play-state: paused }
.marquee:hover .marquee-item { animation-play-state: paused }
.marquee-item { position: relative; animation: scroll-left 12s linear infinite }
.marquee-item .title { margin-bottom: 0.5rem }
.marquee-item a { position: relative }
.marquee-item a:before { position: absolute; bottom: -4px; transition: 0.22s ease }
.marquee-item a:after { transition: 0.22s ease-in-out }
0% { transform: translateX(0%) }
100% { transform: translateX(-100%) }
@keyframes scroll-left animates transform
```

### [marquee v.2 - css only](https://codepen.io/Incorr3ct/pen/RwYbbzQ)

on scroll: ul.marquee__content: transform ×16 | on hover of li.: ul.marquee__content: transform ×16 | made with: @keyframes

```css
.marquees-wrapper { position: relative }
.scroll { animation: scroll 200s linear infinite }
.marquee__content li { text-transform: uppercase }
.marquee:nth-child(even) .scroll { animation-direction: reverse }
from { transform: translateX(0) }
to { transform: translateX(calc(-100% - var(--gap))) }
.extra-stuff { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.extra-stuff h1 { text-transform: uppercase }
.extra-stuff span { text-transform: uppercase }
@keyframes scroll animates transform
```

### [marquee v.1 - css only](https://codepen.io/Incorr3ct/pen/wvxVpGW)

on scroll: ul.marquee__content: transform+top ×6 | on hover of li.: ul.marquee__content: transform+top ×6 | made with: @keyframes

```css
.marquees-wrapper { position: relative }
.marquees-wrapper::after { position: absolute; inset: 0; box-shadow: inset 0px 0px 100px 70px rgba(0, 0, 0, 1) }
.marquee { box-shadow: 0px 24px 17px 0px rgba(0, 0, 0, 0.75) }
.scroll { animation: scroll 30s linear infinite }
from { transform: translateX(0) }
to { transform: translateX(calc(-100% - var(--gap))) }
.marquee__content li { text-transform: uppercase }
.marquee-1 { position: absolute; top: 50%; rotate: 7deg }
.marquee-1 .scroll { animation: scroll 20s linear infinite }
.marquee-2 { position: absolute; top: 25%; rotate: 10deg }
.marquee-2 .scroll { animation: scroll 25s linear infinite reverse }
.marquee-3 { position: absolute; top: 50%; rotate: -10deg }
```

### [Infinite Marquee responsive loop animation CSS only, Stop on hover](https://codepen.io/manuelruiz/pen/oNMJKmM)

on scroll: p.marquee-inner: transform | on hover of a.: p.marquee-inner: transform | made with: @keyframes · :hover

```css
from { transform: translateX(100vw) }
to { transform: translateX(-100%) }
.marquee-content p { animation: marquee-right-to-left 30s linear infinite }
.marquee:hover p { animation-play-state: paused }
.marquee-content p { animation: marquee-right-to-left 50s linear infinite }
.marquee:hover p { animation-play-state: paused }
@keyframes marquee-right-to-left animates transform
```

### [Infinity Text](https://codepen.io/finikkkk/pen/ZEjMBPG)

on scroll: p.text: transform ×2 | made with: @keyframes · :hover

```css
.marquee { text-transform: uppercase; margin-top: 100px; margin-bottom: 70px; position: relative }
.marquee::before, .marquee::after { position: absolute; top: 0 }
.marquee::before { transform: rotate(-1deg) }
.marquee::after { transform: rotate(-2deg) }
.marquee .inner { position: relative }
.marquee .text { -webkit-animation: animate 40s linear infinite; animation: animate 40s linear infinite; -webkit-animation-delay: -40s; animation-delay: -40s }
.marquee .text:nth-child(2) { -webkit-animation: animate2 40s linear infinite; animation: animate2 40s linear infinite; -webkit-animation-delay: -20s; animation-delay: -20s }
.marquee:hover .text { -webkit-animation-play-state: paused; animation-play-state: paused }
0% { transform: translateX(100%) }
100% { transform: translateX(-100%) }
0% { transform: translateX(100%) }
100% { transform: translateX(-100%) }
```

### [CSS Marquee](https://codepen.io/rjgale/pen/JjBvvEY)

on scroll: div.marquee__group: transform ×2 | made with: @keyframes · prefers-reduced-motion

```css
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [Text moving](https://codepen.io/03-eleven/pen/OJwQWMm)

made with: @keyframes · :hover

```css
.content__text_css:hover { animation-play-state: paused }
.scroll__css { transform: translateX(100%); animation: move__css linear 25s forwards infinite }
from { transform: translateX(100%) }
to { transform: translateX(-100%) }
.slide__css { animation: slide__move_css 25s ease-out }
0% { -webkit-transform: translateX(100%) }
.bounce__css { animation: bounce__move_css linear 25s forwards infinite }
0%, 100% { -webkit-transform: translateX(70%) }
50% { -webkit-transform: translateX(0%) }
@keyframes move__css animates transform
@keyframes slide__move_css animates -webkit-transform
@keyframes bounce__move_css animates -webkit-transform
```

### [CSS Marquee](https://codepen.io/marcalc/pen/JjBrwqz)

made with: @keyframes · prefers-reduced-motion

```css
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [SVG curve Marquee](https://codepen.io/siddharth-nalwaya/pen/xxJZYZx)

made with: nothing recognised — read the code

```css
svg { text-transform: uppercase }
```

### [Infinite Vertical Scrolling Elements](https://codepen.io/juliusdorfman/pen/jOpNQgX)

on scroll: ul.marquee__list: transform+top ×2 | on hover of li.: ul.marquee__list: transform+top ×2 | made with: @keyframes

```css
.marquee-wrapper { position: relative }
.marquee { position: absolute; top: -100% }
.marquee__list { animation: slide 2s linear infinite }
.marquee__list li { margin-top: 40px }
0% { transform: translateY(0) }
100% { transform: translateY(100%) }
@keyframes slide animates transform
```

### [Marquee (infinite loop) via position absolute](https://codepen.io/unkray/pen/rNrBWNz)

made with: @keyframes

```css
.jqmarquee { position: relative }
.jqmarquee > div { position: absolute; -webkit-animation: marqueeScroll 5s linear infinite; animation: marqueeScroll 5s linear infinite }
@keyframes marqueeScroll animates left
```

### [Marquee slider](https://codepen.io/sudip-bhowmick/pen/gOjYpGp)

on scroll: div.slick-track: transform | made with: :hover

### [Javascript marquee](https://codepen.io/DavidLira23/pen/LYroVOG)

made with: nothing recognised — read the code

```css
.marquee-group { position: relative }
.marquee { position:absolute; top:0; bottom:0 }
.marquee h1 { text-transform:uppercase }
```

### [CSS Marquee](https://codepen.io/Jaycethanks/pen/GRGLBOP)

on scroll: div.marquee__group: transform+top | on hover of img.: div.marquee__group: transform | made with: @keyframes · prefers-reduced-motion

```css
.marquee { transform: skewY(-3deg) }
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [The Rainbow Marquee](https://codepen.io/shedesignsthing/pen/PoaVXeK)

made with: nothing recognised — read the code

```css
hr { margin-top: 0.3rem; margin-bottom: 1.1rem }
a { padding-bottom: 20px }
```

### [CSS <marquee>](https://codepen.io/lihbr/pen/poKKwEM)

made with: @keyframes · prefers-reduced-motion

```css
.marquee::before { transform: translate3d(-2%, 0, 0); will-change: transform }
.marquee::before { animation: marquee 6s linear infinite }
.marquee--reverse::before { animation-direction: reverse }
0% { transform: translate3d(-2%, 0, 0) }
100% { transform: translate3d(calc(-2% - 5% - 1px), 0, 0) }
.sr-only { position: absolute }
@keyframes marquee animates transform
```

### [Infinite Scrolling No Spaces Marquee](https://codepen.io/juliusdorfman/pen/eYKyeXP)

made with: @keyframes

```css
.marquee-wrapper { position: relative }
.marquee { position: absolute; animation: marquee-scrolling 2s linear infinite; -webkit-animation: marquee-scrolling 2s linear infinite }
@keyframes marquee-scrolling animates left
```

### [Infinite Marquee](https://codepen.io/i_am_r0gu3/pen/eYKeYEQ)

on scroll: div.marquee__inner: transform+top | made with: @keyframes

```css
.marquee { box-shadow: 0 2rem 2rem 0.4rem rgba(0, 0, 0, 0.2) }
.marquee span { text-transform: uppercase }
.marquee__img { background-position: center; filter: grayscale(0.6) }
.marquee__inner { position: relative; animation: marquee 50s linear infinite; will-change: transform }
to { transform: translateX(-50%) }
@keyframes marquee animates transform
```

### [CSS Marquee](https://codepen.io/juljus777/pen/abKLedd)

on scroll: div.marquee__group: transform+top ×6 | on hover of img.: div.marquee__group: transform+top ×4, div.marquee__group: transform ×2 | made with: @keyframes · prefers-reduced-motion

```css
.marquee { transform: skewY(-3deg) }
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [Custom Marquee using Marqueefy](https://codepen.io/nkdas91/pen/rNKwJXg)

on scroll: div.content: transform+top ×8 | on hover of a.: div.content: transform ×6, div.content: transform+top ×2 | made with: nothing recognised — read the code

### [Pure CSS Logo Marquee ( no JS )](https://codepen.io/alializ/pen/OJEgxex)

on scroll: div.Marquee: transform ×2 | made with: @keyframes · :hover

```css
p { margin-bottom: 50px }
.icon { transform: scale( 1.5 ) }
.FirstRow { animation: Scroll 60s linear infinite }
.SecondRow { animation: Scroll 60s linear infinite; animation-direction: reverse }
0% { transform: translateX(-50vw); -webkit-transform: translateX(-50vw) }
100% { transform: translateX(50vw); -webkit-transform: translateX(50vw) }
```

### [Horizontal Navigation | CSS Only](https://codepen.io/lloret-adrien/pen/YzvVPGg)

on scroll: div.marquee: transform+top ×24 | on hover of button.: div.marquee: transform ×24 | made with: @keyframes · transition · :hover · custom properties driven by JS

```css
nav { position: relative; text-transform: uppercase }
nav a { -webkit-transition: all 500ms }
nav li { -webkit-transition: flex 500ms, filter 500ms }
nav li.inset:hover { filter: drop-shadow(19vw 0px 8px var(--shadow)) drop-shadow(-19vw 0px 8px var(--shadow)) }
nav li:hover a { transform: scale(1.3) }
nav li:hover .wrapper { opacity: 0.3 }
nav ul { position: absolute }
nav::before { position: absolute; bottom: 5%; -webkit-transition: all 500ms }
nav:hover, nav.open { filter: invert(1) }
nav:hover::before, nav.open::before { bottom: -25% }
nav:hover .hr, nav.open .hr { -webkit-animation: showHr 600ms }
.wrapper { position: absolute; opacity: 0; -webkit-transition: opacity 300ms; top: 0 }
```

```js
style.setProperty('--initialColor', `#${randomColor}`)
```

### [CSS Marquee](https://codepen.io/manikrc98/pen/VwdPzPZ)

on scroll: div.marquee__group: transform+top ×6 | on hover of img.: div.marquee__group: transform+top ×4, div.marquee__group: transform ×2 | made with: @keyframes · prefers-reduced-motion

```css
.marquee { transform: skewY(-3deg) }
.marquee__group { animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [Bouncing DVD animation](https://codepen.io/technoph1le/pen/dyKOLRP)

made with: nothing recognised — read the code

### [CSS Marquee](https://codepen.io/svenson/pen/yLEYmwM)

on scroll: div.marquee__group: transform ×2 | made with: @keyframes · prefers-reduced-motion

```css
.marquee__arrow { position: relative }
.marquee__arrow svg { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.marquee__group { text-transform: uppercase; animation: scroll var(--duration) linear infinite }
.marquee__group { animation-play-state: paused }
.marquee--reverse .marquee__group { animation-direction: reverse; animation-delay: calc(var(--duration) / -2) }
0% { transform: translateX(0) }
100% { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

### [marquee aesthetic with CSS + JS](https://codepen.io/dnikub/pen/qBKEQMx)

on scroll: p.marquee-content: transform | on hover of button.btn: p.marquee-content: transform, button.btn: background+color | made with: @keyframes · :hover · :focus-visible · prefers-reduced-motion

```css
.btn { box-shadow: 0 0.5rem 0.5rem -0.125rem #0005 }
.btn[aria-pressed=true] { box-shadow: 0 0.5rem 0.5rem -0.125rem inset #0005 }
from { transform: translateX(100vw) }
to { transform: translateX(-100%) }
.marquee-alternative p { animation: marquee-right-to-left 20s linear infinite }
@keyframes marquee-right-to-left animates transform
```

### [marquee aesthetic with CSS](https://codepen.io/dnikub/pen/zYaxBGK)

on scroll: p.: transform | made with: @keyframes · :hover · prefers-reduced-motion

```css
from { transform: translateX(100vw) }
to { transform: translateX(-100%) }
.marquee-alternative:hover p, .marquee-alternative:focus p { animation-play-state: paused }
.marquee-alternative p { animation-name: marquee-right-to-left; animation-duration: 20s; animation-iteration-count: infinite; animation-timing-function: linear }
@keyframes marquee-right-to-left animates transform
```

### [Infinite Marquee](https://codepen.io/uixmat/pen/WNybwNM)

on scroll: div.marquee: transform ×3 | made with: @keyframes

```css
.row .marquee { animation: scrollText 18s infinite linear }
.row:nth-child(2) .marquee { animation-name: scrollTextRight }
from { transform: translateX(0%) }
to { transform: translateX(-50%) }
from { transform: translateX(-50%) }
to { transform: translateX(0) }
@keyframes scrollText animates transform
@keyframes scrollTextRight animates transform
```

### [Sponsor slider - bug testing](https://codepen.io/martin-bernt-rud/pen/KKROpez)

on scroll: ul.marquee__content: transform ×4 | on hover of li.: ul.marquee__content: transform ×4 | made with: @keyframes · :hover

```css
.marquee { position: relative }
from { transform: translateX(0) }
to { transform: translateX(calc(-100% - var(--gap))) }
from { transform: translateX(0) }
to { transform: translateX(calc(-100% - var(--gap))) }
.marquee__content { -webkit-animation: scroll 10s linear infinite; animation: scroll 10s linear infinite }
.marquee:hover .marquee__content { -webkit-animation-play-state: paused; animation-play-state: paused }
from { transform: translateX(calc(100% + var(--gap))) }
to { transform: translateX(0) }
from { transform: translateX(calc(100% + var(--gap))) }
to { transform: translateX(0) }
@keyframes scroll animates transform
```

### [Card with hover effect](https://codepen.io/bogdankostyuk/pen/jOxRQwp)

on scroll: div.card__marquee-text--wrapper: transform ×2 | on hover of div.card: div.card__marquee-text--wrapper: transform ×2 | made with: @keyframes · transition · :hover · :focus-visible

```css
.card { position: relative; transition: border-radius 0.3s cubic-bezier(0.33, 1, 0.68, 1) }
.card__image { position: absolute; inset: 0; transition: border-radius 0.3s cubic-bezier(0.33, 1, 0.68, 1), transform 0.3s cubic-bezier(0.33, 1, 0.68, 1) }
.card__text-wrapper { transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.33, 1, 0.68, 1) }
.card__marquee-text--wrapper { animation: infinite 15s slide linear }
.card__tags__tag { opacity: 0; transform: translateY(100%); transition: opacity 0.3s cubic-bezier(0.33, 1, 0.68, 1), transform 0.3s cubic-bezier(0.33, 1, 0.68, 1) }
.card:is(:hover, :focus-visible) .card__image { transform: scale(1.1) }
.card:is(:hover, :focus-visible) .card__text-wrapper { transform: translateY(0) }
.card:is(:hover, :focus-visible) .card__tags__tag { opacity: 1; transform: translateY(0) }
from { transform: translateX(0) }
to { transform: translateX(-100%) }
@keyframes slide animates transform
```

### [Marquee infinite line](https://codepen.io/KACTOPKA/pen/PoeBQmg)

on scroll: div.marquee__images-block: transform ×2 | on hover of div.card: div.marquee__images-block: transform ×2 | made with: @keyframes · transition · :hover · custom properties driven by JS

```css
.marquee-line:hover .marquee__images-block { animation-play-state: paused }
.marquee__images-block { animation: scroll var(--duration) linear infinite }
.card { box-shadow: 0px 5px 15px black }
.card svg { transition: fill .1s }
from { transform: translateX(0) }
to { transform: translateX(calc(-100% - var(--gap))) }
@keyframes scroll animates transform
```

```js
style.setProperty('--duration', `${images * 10}s`)
```

### [Pure CSS Marquee](https://codepen.io/zkreations/pen/ExLEXxY)

on scroll: div.marquee-content: transform ×3, div.marquee-content: transform+top | on hover of img.: div.marquee-content: transform ×3, div.marquee-content: transform+top | made with: @keyframes · :hover

```css
to { transform: translate(var(--marquee-x, -100%), var(--marquee-y, 0)) }
to { transform: translate(var(--marquee-x, -100%), var(--marquee-y, 0)) }
.marquee-content { -webkit-animation: marquee var(--marquee-duration, 20s) infinite linear; animation: marquee var(--marquee-duration, 20s) infinite linear; position: relative }
.marquee-content:hover { -webkit-animation-play-state: paused; animation-play-state: paused }
.marquee-down .marquee-content { padding-top: var(--marquee-height) }
@keyframes marquee animates transform
```

### [Marquee](https://codepen.io/MoustafaJazzar/pen/YzLeymJ)

held: fixed a | on scroll: div.marquee__group: transform ×6 | on hover of img.: div.marquee__group: transform ×6 | made with: transition · :hover · mask · Web Animations API (.animate)

```css
.marquees__wrapper { -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0), var(--backgroundColorDark) 20%, var(--backgroundColorDark) 80%, rgba(0, 0, 0, 0)); mask-image: linear-gradient(to right, rgba(0, 0, 0, 0), var(--backgroundC }
.marquee { position: relative; transition: filter ease 0.3s }
.marquee.blur { filter: blur(10px) grayscale(1) brightness(0.95) }
.marquee__group .item { box-shadow: var(--cardShadow); transition: 300ms ease-in-out }
.marquee:hover .item { filter: opacity(0.5) }
.item:hover { filter: opacity(1) !important; scale: 1.03 }
.item:hover img { scale: 1 }
.item img { transition: 300ms ease-in-out; scale: 1.03 }
.footer__content .separator { opacity: 0.5 }
```

```js
.animate([
addEventListener("mouseenter", () => this.slowAnimations())
addEventListener("mouseleave", () => this.resumeAnimationSpeed())
```

### [Marquee 2.0 | Sass only](https://codepen.io/Rei_Kama414/pen/MWGrmjz)

made with: @keyframes

```css
.marquee span { animation: marquee 5s linear infinite; -webkit-animation: marquee 5s linear infinite; position: relative }
.container { position: relative }
@keyframes marquee animates left
```

### [Marquee | Sass x Js](https://codepen.io/Rei_Kama414/pen/zYjPmjv)

made with: @keyframes · custom properties driven by JS

```css
.marquee { position: relative }
.marquee p { animation: marquee 5s linear infinite; -webkit-animation: marquee 5s linear infinite; position: absolute }
.container { position: relative }
@keyframes marquee animates right
```

```js
style.setProperty('--rtl', `-${rtl}px`)
```

### [Examples of the Marquee element - DEPRECATED](https://codepen.io/dnikub/pen/vYjJPWq)

made with: nothing recognised — read the code
