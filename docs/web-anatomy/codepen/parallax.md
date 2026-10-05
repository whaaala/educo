# CodePen · parallax — how each pen does it

991 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/parallax.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| transition | 360 |
| :hover | 262 |
| position: fixed | 252 |
| 3D (perspective / preserve-3d) | 201 |
| @keyframes | 184 |
| pointer / mouse tracking | 165 |
| scroll listener | 162 |
| GSAP | 145 |
| requestAnimationFrame | 143 |
| mix-blend-mode | 93 |
| backdrop-filter | 70 |
| ScrollTrigger | 65 |
| scroll() timeline | 63 |
| clip-path | 49 |
| custom properties driven by JS | 43 |
| position: sticky | 37 |
| canvas 2D | 33 |
| IntersectionObserver | 29 |
| prefers-reduced-motion | 23 |
| scroll-driven animation (animation-timeline) | 22 |
| Web Animations API (.animate) | 19 |
| three.js / WebGL | 16 |
| mask | 14 |
| Lenis / smooth scroll | 14 |
| view() timeline | 14 |
| scroll-snap | 13 |
| animation-range | 11 |
| :focus-visible | 7 |
| :has() | 7 |
| anime.js | 3 |
| (hover: hover) gate | 2 |
| <dialog> | 2 |
| Motion / Framer | 1 |
| popover | 1 |

## Every pen

### [Wandering Night Ghost](https://codepen.io/editor/shiricreates/pen/01a0eb99-43bb-7d0e-b786-112f6b787c51)

on scroll: div.parallax-layer: transform ×2, div.road-track: transform, div.ghost-floor-shadow: transform, div.ghost-body-holder: transform+top, div.lantern-pendulum: transform+top | made with: transition · requestAnimationFrame

```css
:root { --sky-top: #101c2e; --sky-bottom: #1c2b42 }
.screen-stage { position: relative; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05) }
.ornate-border { position: absolute; top: 14px; bottom: 14px }
.ornate-line { position: relative }
.ornate-cap { box-shadow: 0 0 6px rgba(141, 161, 188, 0.3) }
.ornate-tick { position: absolute }
.ornate-tick.t-top { top: 18% }
.ornate-tick.t-mid { top: 50% }
.ornate-tick.t-bot { top: 82% }
.moon { position: absolute; top: 32px; box-shadow: 0 0 25px rgba(238, 242, 247, 0.4) }
.moon-crater { position: absolute }
.crater-a { top: 18px }
```

```js
requestAnimationFrame(loop)
```

### [Ocean Wave Divider with Flying Birds](https://codepen.io/editor/ForhadKhan/pen/01a0a8fe-65ce-7270-b262-b0ebc5c3bf1f)

on scroll: path.[object: transform ×9, div.bird: transform+top ×5, div.bi: transform+top ×5, svg.[object: opacity ×2, svg.[object: opacity+top ×2, div.bird: transform | made with: @keyframes · prefers-reduced-motion · custom properties driven by JS · IntersectionObserver

```css
.ocean { margin-top:auto }
.ocean { --bird-opacity:.78; position:relative }
from { transform:translateX(calc((var(--dir) + 1) * -720px)) }
to { transform:translateX(calc((var(--dir) - 1) * 720px)) }
.ocean .wave { animation:wave-drift var(--dur) linear infinite; will-change:transform }
.ocean[data-motion="always"] .wave { animation:wave-drift var(--dur) linear infinite; will-change:transform }
.sky { position:absolute; inset:0 }
.bird { position:absolute; top:0; opacity:var(--bird-opacity); will-change:transform }
.bird .bi { position:absolute; inset:0; animation:bird-bob var(--flap,1s) ease-in-out var(--ph,0s) infinite }
.bird svg { position:absolute; inset:0; opacity:0; will-change:opacity; animation:var(--flap,1s) linear var(--ph,0s) infinite }
.bird .f4 { animation-name:pose-down }
.bird .f1 { animation-name:pose-level }
```

```js
style.setProperty('--flap', rnd(CONFIG.minBeat, CONFIG.maxBeat).toFixed(2) + 's')
style.setProperty('--ph', (-rnd(0, CONFIG.maxBeat)).toFixed(2) + 's')
new IntersectionObserver(function(es){
```

### [Spatial Cluster Cards — Parallax + Tilt, Zero WebGL](https://codepen.io/editor/Alexey-Kovalevsky-AKAVA/pen/01a0093a-6a32-7f98-9c25-b1f7bf4c3009)

on scroll: a.service-card: opacity+filter+top ×3 | on hover of a.service-card: a.service-card: transform+top | made with: transition · :hover · :focus-visible · prefers-reduced-motion · 3D (perspective / preserve-3d) · custom properties driven by JS · IntersectionObserver · pointer / mouse tracking · requestAnimationFrame

```css
.cluster-section__eyebrow { margin-bottom: 28px }
.service-cluster { position: relative; perspective: 1200px }
.service-card { position: absolute; box-shadow: 0 30px 70px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.05); transform: translate3d( calc(var(--cluster-x) * var(--depth, 1) * 22px), calc(var(--cluster-y) * var(--depth, 1) * }
.service-card--primary { top: 20% }
.service-card--top { top: 2% }
.service-card--side { top: 40% }
.service-card--bottom { bottom: 0 }
.service-card:hover, .service-card:focus-visible { box-shadow: 0 35px 85px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.06) }
.service-card.is-hovered { box-shadow: 0 40px 100px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.07); transform: translate3d(0, 0, 90px) rotateX(calc(var(--ly) * -9deg)) rotateY(calc(var(--lx) * 9deg)) scale(1.045); transition: border- }
.service-card.is-leaving { transition: border-color 180ms ease, background 180ms ease, box-shadow 220ms ease, transform 380ms cubic-bezier(0.22, 1, 0.36, 1) }
.service-cluster.is-focusing .service-card:not(.is-hovered) { opacity: 0.78; filter: saturate(0.85) }
.service-card__arrow { position: absolute; top: 22px; transition: transform 180ms ease, background 180ms ease, color 180ms ease }
```

```js
requestAnimationFrame(update)
style.setProperty('--cluster-x', currentX.toFixed(4))
style.setProperty('--cluster-y', currentY.toFixed(4))
new IntersectionObserver(
addEventListener('pointermove', handlePointerMove, { passive: true })
addEventListener('pointermove', event => {
style.setProperty('--lx', lx.toFixed(3))
style.setProperty('--ly', ly.toFixed(3))
```

### [SVG CSS Marquee Glass Boubble](https://codepen.io/designfenix/pen/QwdoddG)

held: fixed p | on scroll: g.[object: transform+top ×3 | on hover of a.logo: g.[object: transform+top ×4, g.[object: transform ×2 | made with: position: fixed · transition · :hover · clip-path · mix-blend-mode · pointer / mouse tracking · requestAnimationFrame

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

### [Интерактивная 3D-галерея с эффектом глубины и параллакса на Three.js.](https://codepen.io/editor/metaimperiya/pen/019fd09d-71c2-7475-a38d-8d8f7a04c804)

held: fixed div, fixed div, fixed div.hint, fixed div.copy | on hover of a.: a.: color | made with: position: fixed · :hover · three.js / WebGL · canvas 2D · pointer / mouse tracking · requestAnimationFrame

### [pple TV & VisionOS 3D Layered Parallax Card](https://codepen.io/editor/sandrotonal/pen/019fceec-b027-7797-9b44-8f6b43047dc2)

on scroll: div.layer: transform ×2, div.tv-card: transform, div.glare: opacity, div.layer: transform+top | on hover of div.card-container: div.layer: transform ×3, div.tv-card: transform | made with: transition · :hover · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.card-container { perspective: 1000px }
.tv-card { position: relative; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8); transition: transform 0.15s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.3s ease }
.glare { position: absolute; inset: 0; opacity: 0; mix-blend-mode: overlay; transition: opacity 0.3s ease }
.layer { position: absolute; inset: 0; transition: transform 0.15s cubic-bezier(0.2, 0, 0, 1) }
.bg-layer { background-position: center; transform: translateZ(0px) }
.float-layer { transform: translateZ(30px) }
.badge { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px) }
.content-layer { transform: translateZ(50px) }
.category { margin-bottom: 4px }
.content-layer p { margin-top: 6px; margin-bottom: 18px }
.play-btn { transition: transform 0.2s ease, background-color 0.2s ease }
.play-btn:hover { transform: scale(1.02) }
```

```js
addEventListener('mousemove', (e) => {
addEventListener('mouseleave', () => {
```

### [The Winter Line — Parallax Winter Summit Climb (CSS + Vanilla JS)](https://codepen.io/editor/SBDesign/pen/019fbc3a-9875-7b45-bb3d-70e40dd5ec72)

held: fixed div.hud, fixed canvas | on scroll: div.parallax-layer: transform+top ×13, div.zone-content: transform+opacity+top ×2 | made with: position: fixed · @keyframes · transition · :focus-visible · prefers-reduced-motion · clip-path · backdrop-filter · canvas 2D · IntersectionObserver · scroll listener · requestAnimationFrame

```css
a:focus-visible, button:focus-visible { outline-offset: 4px }
.hud { position: fixed; top: 20px; backdrop-filter: blur(6px) }
.hud-value { transition: color 0.3s ease }
.hud-cond { margin-top: 4px; padding-top: 4px; border-top: 1px solid rgba(238, 242, 246, 0.12) }
.hud { top: 12px }
#snow { position: fixed; inset: 0; opacity: 0.55 }
.parallax-layer { position: absolute; inset: -10% -5%; will-change: transform }
.hero { position: relative }
.layer-far { bottom: 22%; top: auto; clip-path: polygon(0% 100%, 0% 55%, 12% 40%, 24% 58%, 38% 30%, 52% 52%, 66% 22%, 80% 48%, 92% 35%, 100% 50%, 100% 100%); opacity: 0.75 }
.layer-mid { bottom: 10%; top: auto; clip-path: polygon(0% 100%, 0% 60%, 15% 35%, 30% 62%, 45% 20%, 58% 55%, 72% 12%, 86% 45%, 100% 30%, 100% 100%) }
.layer-near { bottom: -2%; top: auto; clip-path: polygon(0% 100%, 0% 65%, 10% 45%, 22% 68%, 35% 25%, 50% 60%, 63% 18%, 78% 50%, 90% 32%, 100% 55%, 100% 100%) }
.hero-content { position: relative }
```

```js
new IntersectionObserver(function (entries) {
requestAnimationFrame(function () {
addEventListener('scroll', onScroll, { passive: true })
requestAnimationFrame(drawSnow)
```

### [SVG, Parallax Scroll Animations](https://codepen.io/editor/timhjellum/pen/019fabf5-5caa-7a9c-8bcf-4c7164d02d5a)

held: sticky div.stage-sticky, sticky div.stage-sticky, sticky div.stage-sticky, sticky div.stage-sticky | on hover of button.artifact-btn: div.layer: transform+opacity, button.artifact-btn: background | made with: nothing recognised — read the code

### [AuraSquare Pro | Landing Page de Lançamento (HTML5 & CSS3)](https://codepen.io/thiagord10-create/pen/xbgyEZr)

held: sticky nav | on hover of a.: img.relogio-animado: transform+top | made with: position: sticky · @keyframes · transition · :hover · backdrop-filter

### [Parallax Hero](https://codepen.io/mzorn/pen/xbgWRqq)

made with: transition · :hover · (hover: hover) gate · prefers-reduced-motion · 3D (perspective / preserve-3d) · pointer / mouse tracking · requestAnimationFrame

```css
.hero { position: relative; perspective: 1000px }
.hero-stage { position: relative; transition: transform .25s ease-out; will-change: transform }
.layer { position: absolute; will-change: transform }
.layer-bg { inset: -8%; box-shadow: inset 0 1px 0 rgba(255,255,255,.06) }
.layer-mid { top: 12%; box-shadow: 0 40px 80px -30px rgba(0,0,0,.9) }
.layer-mid-2 { top: auto; bottom: 8% }
.accent { filter: blur(.5px) }
.accent-1 { top: 16%; box-shadow: 0 20px 50px -12px rgba(255,111,97,.7) }
.accent-2 { bottom: 20%; box-shadow: 0 16px 40px -10px rgba(110,168,255,.7) }
.accent-ring { bottom: 6%; filter: none }
.hero-content { position: absolute; top: 50%; transform: translateZ(0); translate: 0 -50% }
.hero-eyebrow { text-transform: uppercase; margin-bottom: 1rem }
```

```js
requestAnimationFrame(apply)
requestAnimationFrame(autoFloat)
addEventListener('mousemove', onMove)
addEventListener('mouseleave', reset)
```

### [Glows with Parallax](https://codepen.io/jwdallas/pen/XJpdLKQ)

made with: mask · backdrop-filter · 3D (perspective / preserve-3d)

```css
.grid-container.glows { transform: translateZ(-0.15px) scale(1.01) scaleX(1.1) }
.glows .grid-item { filter: blur(50px) saturate(220%) }
.tiles .grid-item .bg { mask-image: linear-gradient(to bottom, black 65%, transparent 75%) }
.tiles .grid-item .metadata { mask-image: linear-gradient(to top, black 25%, transparent 35%); backdrop-filter: blur(60px); padding-bottom: 2rem }
```

### [Parallax Gallery Images](https://codepen.io/editor/JMChristensen/pen/019eae0a-9b88-7269-a41f-12cafdae1d44)

made with: scroll() timeline · scroll-snap · Motion / Framer

```css
:root { scroll-snap-type: both proximity }
.gallery { position: relative }
& figure { position: relative }
& img { object-position: center; position: absolute }
```

### [Landing page with css grid](https://codepen.io/editor/NadezhdaBel/pen/015e9e99-6e68-77c0-9552-ff78aad0fad4)

made with: nothing recognised — read the code

### [Homer Simpson out of HTML & CSS](https://codepen.io/editor/waldo/pen/015f2830-c630-7d58-b9d5-3da35ffdfd75)

held: fixed a.w-webflow-badge, fixed a.open-in-webflow | on hover of a.w-webflow-badge: div.homer: transform+top ×2, div.bg: transform+top | made with: nothing recognised — read the code

### [Parallax Background Images](https://codepen.io/editor/kennypascal/pen/015f590f-1ea0-7777-b9c2-ff44e4e41776)

made with: nothing recognised — read the code

### [Epicurrence website rebuild](https://codepen.io/editor/waldo/pen/0165448e-09e0-7901-bd6a-fba365c53764)

held: fixed div.loading-section, fixed a.social-link, fixed div.modal__parent | on hover of a.social-link: img.image-3: transform+top ×2, div.hold-logo: transform+top, div.hold-logo: transform, div.bottom-image-section: transform+top, a.right-side-link: transform+top | made with: 3D (perspective / preserve-3d)

### [CSS full page panel stacking effect](https://codepen.io/editor/zeisse/pen/016611a8-3400-7877-a695-bceaf0ea4058)

made with: nothing recognised — read the code

### [8kyrly1syrly](https://codepen.io/editor/ainurabagitova/pen/01696748-b0f8-770b-afdb-18f19fd35742)

on hover of a.logo: a.logo: background | made with: nothing recognised — read the code

### [Home Page 2019](https://codepen.io/editor/Paintdiva/pen/016d212c-b890-7b8a-9454-d75dd4870f8f)

made with: nothing recognised — read the code

### [Parallax website](https://codepen.io/editor/butterflow/pen/0172ef54-c690-7aff-9cce-cdf6f7004167)

made with: nothing recognised — read the code

### [Glassmorphic Parallax Credit Card](https://codepen.io/editor/Sajid-Farid/pen/019ea846-b2d0-7415-a17f-638644066635)

on scroll: div.blob: transform+top ×2, div.card: transform+shadow | on hover of div.card: div.blob: transform+top ×2, div.card: transform | made with: @keyframes · transition · :hover · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking

```css
body { perspective: 1000px }
.container { position: relative }
.blob { position: absolute; filter: blur(50px); animation: float 6s ease-in-out infinite alternate }
.blob-1 { top: -20px }
.blob-2 { bottom: -40px; animation-delay: -3s }
.card { backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 25px 45px rgba(0, 0, 0, 0.3); transform: rotateX(var(--rx)) rotateY(var(--ry)) scale(1); transition: transform }
.card:hover { box-shadow: 0 35px 60px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 255, 255, 0.05) }
.card-inner { transform: translateZ(40px) }
.card-chip { position: relative }
label { text-transform: uppercase; margin-bottom: 4px }
.card-logo { position: relative }
.circle { position: absolute }
```

```js
addEventListener('mousemove', (e) => {
style.setProperty('--rx', `${rotateX}deg`)
style.setProperty('--ry', `${rotateY}deg`)
addEventListener('mouseleave', () => {
style.setProperty('--rx', '0deg')
style.setProperty('--ry', '0deg')
addEventListener('mouseenter', () => {
```

### [phaser-js-continuous-example](https://codepen.io/editor/KyleEgland/pen/018467d6-ab86-7bc9-a4b2-201b7b3332d1)

made with: nothing recognised — read the code

### [Scattered parallax image gallery](https://codepen.io/Ida-Aveltsova/pen/PwbyNvY)

on scroll: div.gallery-card: transform+top ×6 | made with: transition · :hover · prefers-reduced-motion · scroll listener · requestAnimationFrame

```css
.scattered-gallery-widget { position: relative }
.gallery-stage { position: relative }
.gallery-card { position: absolute; box-shadow: var(--gallery-shadow); will-change: transform; transition: transform 0.18s linear }
.card-1 { top: 2% }
.card-1 .gallery-media { transform: scale(1.06) }
.card-2 { top: 11% }
.card-2 .gallery-media { transform: scale(1.04) }
.card-3 { top: 6% }
.card-3 .gallery-media { transform: scale(1.05) }
.card-4 { top: 42% }
.card-4 .gallery-media { transform: scale(1.04) }
.card-5 { top: 40% }
```

```js
requestAnimationFrame(handleParallaxScroll)
addEventListener("scroll", requestTick, { passive: true })
```

### [Low res parallax](https://codepen.io/editor/mdiegoli/pen/015af50b-87d0-794d-a9cf-89935d43df1c)

made with: nothing recognised — read the code

### [Deep Space Parallax Hero](https://codepen.io/jpbelley/pen/ByQrqrw)

held: fixed canvas | on scroll: div.layer: transform ×2, div.ring: transform+top | on hover of div.btns: div.layer: transform ×2, div.ring: transform+top | made with: position: fixed · @keyframes · transition · :hover · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
body { position: relative }
#stars { position: fixed; inset: 0 }
#scene { position: relative }
.layer { position: absolute; inset: 0; will-change: transform }
.ghost-text { position: absolute; top: 50%; transform: translateY(-50%) }
.eyebrow { text-transform: uppercase; margin-bottom: 26px }
.desc { margin-top: 32px }
.btns { margin-top: 44px }
.btn-p { transition: background 0.2s }
.btn-s { transition: all 0.2s }
.ring-wrap { position: absolute; top: 50%; transform: translateY(-50%) }
.ring { box-shadow: 0 0 0 1px rgba(46,230,166,0.06), inset 0 0 60px rgba(124,92,255,0.06), 0 0 80px rgba(46,230,166,0.04); animation: spin 18s linear infinite }
```

```js
addEventListener('mousemove', e => {
requestAnimationFrame(tick)
```

### [3D Momentum Scroll](https://codepen.io/ol-ivier/pen/MYbOMqv)

held: fixed div.title, fixed div.copy, fixed div.loader, fixed div.fullscreen-overlay, fixed div | on scroll: div.card: opacity ×21, img.loaded: transform ×5, div.card: transform+opacity+top ×4, img.loaded: transform+top ×4, div.card: transform ×4, div.spinner: transform+top | on hover of div.card: img.loaded: transform ×5, div.card: transform ×4, div.card: transform+opacity+top ×3, img.loaded: transform+top ×3, div.spinner: transform+top, div.card: transform+opacity | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · 3D (perspective / preserve-3d) · pointer / mouse tracking · requestAnimationFrame

```css
.wrap { perspective: 1200px; position: relative }
.loader { position: fixed; top: 0; transition: opacity 0.5s ease }
.loader.hidden { opacity: 0 }
.spinner { animation: spin 1s linear infinite }
to { transform: rotate(360deg) }
.viewport { position: relative; opacity: 0; transition: opacity 0.5s ease }
.viewport.visible { opacity: 1 }
.track { position: absolute; top: 50%; transform: translateY(-50%) }
.title { position: fixed; top: 10px }
.card { position: absolute; top: 0; box-shadow: 0 10px 30px rgb(0 0 0 / .3); will-change: transform, opacity; transform: translateZ(0); opacity: 0 }
.card-inner img { position: relative; top: -10%; will-change: transform; transform: translateZ(0); opacity: 0; transition: opacity 0.3s ease }
.card-inner img.loaded { opacity: 1 }
```

```js
requestAnimationFrame(animate)
requestAnimationFrame(decelerate)
addEventListener('pointermove', onPointerMove)
addEventListener('wheel', onWheel, {
```

### [Stickman AI vs Human - Parallax Website](https://codepen.io/editor/PrimusDE/pen/019e660b-a3dc-7d01-aefb-7f7aaa8fbc0b)

held: fixed canvas, fixed div.ring | made with: position: fixed · mix-blend-mode · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
#bg { position: fixed; inset: 0 }
.ring { position: fixed; top:0; will-change: transform }
.ring::before { position:absolute; top:50%; transform: translate(-50%, -50%); mix-blend-mode: difference }
.ring::after { position:absolute; top:50%; transform: translate(-50%, -50%); mix-blend-mode: difference }
main, footer { position: relative; mix-blend-mode: difference }
.nav { text-transform: uppercase }
.nav .links { opacity:.9 }
section { border-bottom: 1px dashed rgba(255,255,255,0.18) }
.eyebrow { text-transform: uppercase; opacity: 0.95 }
h1 { text-transform: uppercase }
h2 { text-transform: uppercase }
p.lede { opacity: 0.95 }
```

```js
addEventListener('mousemove', e => { tx = e.clientX
requestAnimationFrame(loop)
```

### [HTML Signature Generator](https://codepen.io/GoodStuff-Designs/pen/ZYBLPMQ)

held: fixed div.bg-shape, fixed div.bg-shape, fixed div.bg-shape, fixed div.toast | on scroll: div.bg-shape: transform+top ×3 | on hover of img.: div.bg-shape: transform ×2, div.bg-shape: transform+top | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
body { position: relative }
.bg-shape { position: fixed; filter: blur(80px); animation: float 10s infinite alternate cubic-bezier(0.4, 0, 0.2, 1) }
.shape1 { top: -150px; animation-duration: 12s }
.shape2 { bottom: -100px; animation-duration: 15s }
.shape3 { top: 20%; animation-duration: 18s; animation-delay: -5s }
0% { transform: translate(0, 0) scale(1) rotate(0deg) }
50% { transform: translate(50px, 30px) scale(1.1) rotate(10deg) }
100% { transform: translate(-30px, 50px) scale(0.9) rotate(-10deg) }
.container { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2) inset; animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) }
from { opacity: 0; transform: translateY(40px) }
to { opacity: 1; transform: translateY(0) }
h2 { margin-bottom: 25px; position: relative }
```

```js
addEventListener('mousemove', (e) => {
addEventListener('mouseleave', () => {
```

### [The thing you want](https://codepen.io/ikrprojects/pen/emBJdwz)

held: fixed div, fixed svg.[object, fixed div | on scroll: section.horScroll: transform+top ×3, div.treyMix: transform+top ×2, section.: filter+top | on hover of a.: section.horScroll: transform ×3, div.treyMix: transform+top ×2, a.: background | made with: position: fixed · @keyframes · transition · :hover · mask · backdrop-filter · custom properties driven by JS · GSAP · pointer / mouse tracking

```css
.vp50 { padding-top: var(--vp50); padding-bottom: var(--vp50) }
.bp50 { padding-bottom: var(--vp50) }
&::after { position: absolute; bottom: 25px }
.item { border-top: solid var(--lineWidth) var(--color-fg60) }
&:first-of-type { position: absolute; top: 0px }
&:first-of-type { position: absolute; top: 0px }
&:hover, &:focus { box-shadow: 0 5px 30px var(--color-fg40) }
button { transition: transform 200ms ease, box-shadow 200ms ease }
&::before, &::after { position: absolute }
&::after { mask: linear-gradient(#0000, #0000), conic-gradient( from calc((var(--start) - (20 * 1.1)) * 1deg), #ffffff1f 0deg, white, #ffffff00 100deg ); mask-composite: intersect; mask-clip: padding-box, border-box; transition: al }
#heroWrapper { padding-top: var(--bgVerticalOffset) }
#horScrollWrapper3 { box-shadow: 0px 4px 16px 10px #000 }
```

```js
gsap.to( window, {
gsap.to("body", {
gsap.fromTo( horScroll,
addEventListener("mousemove", handleMouseMove)
style.setProperty("--start", angle + 60)
gsap.timeline({ defaults: { repeatDelay: 0, duration: 0.5, }, onComplete:() => {
```

### [CSS/JS Mouse Parallax · Multi-layer Depth](https://codepen.io/Jiironimo/pen/ZYBzVWJ)

held: fixed div, fixed div, fixed div.depth-bar | on scroll: div.layer: transform+top ×5, div.content: transform+top | made with: position: fixed · @keyframes · transition · backdrop-filter · mix-blend-mode · pointer / mouse tracking · requestAnimationFrame

```css
#cursor { position: fixed; transform: translate(-50%, -50%); mix-blend-mode: difference; transition: width 0.2s, height 0.2s }
#cursor-ring { position: fixed; transform: translate(-50%, -50%); transition: width 0.2s, height 0.2s, border-color 0.2s }
.scene { position: relative }
.layer { position: absolute; will-change: transform }
.stars { inset: -20% }
.star { position: absolute }
.blob { filter: blur(80px); opacity: 0.18 }
.blob-a { top: 50%; transform: translate(-50%, -50%) }
.blob-b { top: 30%; transform: translate(-50%, -50%) }
.blob-c { top: 68%; transform: translate(-50%, -50%) }
.orb { backdrop-filter: blur(2px) }
.geo { opacity: 0.6 }
```

```js
addEventListener('mousemove', e => {
requestAnimationFrame(tick)
```

### [AEL Starfield Engine v5.0 | GPU-Accelerated CSS-3D](https://codepen.io/aymanelmasryael/pen/azmezeb)

held: fixed div | on scroll: div.star: transform+opacity+top ×257, div.star: transform+top ×139, div.star: transform+opacity ×3, div.star: transform | made with: position: fixed · @keyframes · 3D (perspective / preserve-3d)

```css
#starfield-container { position: fixed; top: 0; perspective: 1000px }
.star { position: absolute; opacity: 0; will-change: transform }
0% { transform: translate3d(0, 0, -1000px); opacity: 0 }
20% { opacity: 1 }
80% { opacity: 1 }
100% { transform: translate3d(0, 0, 1000px); opacity: 0 }
.overlay-text { position: absolute; top: 50%; transform: translate(-50%, -50%); opacity: 0.5 }
@keyframes travel animates transform, opacity
```

### [Infinite Drift – 8 Horizontal Bands](https://codepen.io/ol-ivier/pen/QwKZVGK)

held: fixed div.loading, fixed div.hint, fixed div.infos, fixed div.copy, fixed button, fixed canvas | made with: position: fixed · transition · three.js / WebGL · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
canvas { position: fixed; top: 0 }
.infos { position: fixed; bottom: 20px; transform: translateX(-50%) }
.hint { position: fixed; bottom: 20px; opacity: .85 }
.copy { position: fixed; top: 20px }
.loading { position: fixed; top: 50%; transform: translate(-50%, -50%); box-shadow: 0 4px 20px rgb(0 0 0 / .15) }
```

```js
addEventListener('wheel', function(e) {
addEventListener('mousemove', function(e) {
requestAnimationFrame(animate)
```

### [Codepen inspired GSAP ScrollTrigger, SplitText and Parallax Animation](https://codepen.io/ikrprojects/pen/KwgGBRp)

held: fixed div | on scroll: div.: opacity+top ×36 | made with: position: fixed · mask · backdrop-filter · 3D (perspective / preserve-3d) · GSAP

```css
media ( width >= 576px ) { transform: translateX(4vw) }
&:nth-child(odd) { transform: translateX(6vw) }
&:nth-child(even) { transform: translateX(-3w) }
&::before { position: absolute; backdrop-filter: blur(8px) }
&::after { position: absolute; top: 0px; filter: blur(1px) saturate(1.2) brightness(1.2); opacity: 0.85 }
&::before { mask: url(#codepenMask2) }
&::before { mask: url(#htmlMask2) }
&::before { mask: url(#cssMask2) }
&::before { mask: url(#jsMask2) }
&::before { position: absolute; top: 0px; opacity: 0.6 }
div[aria-hidden="true"] { position: unset!important }
&:before { position: absolute; top: 20px; bottom: 20px }
```

```js
gsap.to( "body", {
gsap.timeline({ defaults: { repeatDelay: 0 }, onComplete:() => {
```

### [Dynamic "Shop the Room" Parallax](https://codepen.io/Aga_CW/pen/dPpgKBW)

held: sticky div.room-bg, fixed div.furniture, fixed div.furniture, fixed div.shop-all-overlay | on hover of img.: img.: transform | made with: position: sticky · position: fixed · backdrop-filter · GSAP · ScrollTrigger

```css
.assembly-container { position: relative }
.room-bg { position: sticky; top: 0 }
.room-bg img { opacity: 0.4 }
.furniture { position: fixed; top: 0 }
.furniture img { filter: drop-shadow(0 20px 50px rgba(0,0,0,0.8)) }
.label { position: absolute; text-transform: uppercase; opacity: 0 }
.chair img { transform: translateX(-150vw) rotate(-20deg) }
.table img { transform: translateX(150vw) rotate(20deg) }
.shop-all-overlay { position: fixed; top: 0; opacity: 0 }
.cta-box { backdrop-filter: blur(10px) }
.bundle-btn { margin-top: 30px }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline({
```

### [3D Layered Text Parallax](https://codepen.io/ds92ko/pen/KwgoNRm)

on scroll: p.text: transform ×10 | made with: 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.content { position: relative; perspective: 500px }
.text { position: absolute; top: 50%; transform: translate3d(-50%, -50%, 10px) }
```

```js
addEventListener('mousemove', handleMouseMove)
```

### [CSS Day-Night Cycle](https://codepen.io/Yugta-Bista/pen/RNGjBYy)

on scroll: span.: transform+opacity ×12, span.: transform+shadow+top ×6, span.: transform+opacity+top ×3, div.cloud: transform+opacity ×3, i.: transform+top ×2, div.orb: transform+shadow+top | made with: @keyframes

```css
.scene { position: relative; box-shadow: 0 0 80px rgba(0,0,0,0.6) }
.sky { position: absolute; inset: 0; animation: skyColor 20s ease-in-out infinite }
.stars { position: absolute; inset: 0; animation: starFade 20s ease-in-out infinite }
.stars span { position: absolute; animation: twinkle 2.5s ease-in-out infinite alternate }
.stars span:nth-child(1) { top:5%; animation-delay:0s }
.stars span:nth-child(2) { top:8%; animation-delay:.4s }
.stars span:nth-child(3) { top:3%; animation-delay:.8s }
.stars span:nth-child(4) { top:12%; animation-delay:.2s }
.stars span:nth-child(5) { top:6%; animation-delay:.6s }
.stars span:nth-child(6) { top:15%; animation-delay:1s }
.stars span:nth-child(7) { top:20%; animation-delay:.3s }
.stars span:nth-child(8) { top:18%; animation-delay:.9s }
```

### [Infinite 4‑Way Parallax Gallery | Three.js](https://codepen.io/ol-ivier/pen/XJjzavB)

held: fixed div, fixed div, fixed div.hint, fixed div.copy, fixed div.help-button, fixed div.modal, fixed button | on hover of a.: a.: color | made with: position: fixed · transition · :hover · three.js / WebGL · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
#container { position: fixed; inset: 0 }
#ui { position: fixed; bottom: 12px }
#loading { position: fixed; top: 50%; transform: translate(-50%, -50%) }
.hint { opacity: 0.85 }
.copy { position: fixed; top: 20px }
.help-button { position: fixed; bottom: 20px; transition: transform 0.2s; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) }
.help-button:hover { transform: scale(1.1) }
.modal { position: fixed; top: 0 }
.modal-content { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) }
.modal-header { margin-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.2); padding-bottom: 12px }
.modal-close { transition: color 0.2s }
.modal-body { margin-bottom: 20px }
```

```js
requestAnimationFrame(animate)
addEventListener("mousemove", e => {
addEventListener( "wheel",
addEventListener("wheel", e => e.preventDefault(), {
```

### [Infinite Parallax Gallery – 5‑Layer Scrolling Image Wall (Three.js)](https://codepen.io/ol-ivier/pen/LERzpKJ)

held: fixed div, fixed div, fixed div.hint, fixed div.copy | on hover of a.: a.: color | made with: position: fixed · :hover · three.js / WebGL · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
#container { position: fixed; inset: 0 }
#ui { position: fixed; bottom: 12px }
#loading { position: fixed; top: 50%; transform: translate(-50%, -50%) }
.hint { opacity: 0.85 }
.copy { position: fixed; bottom: 20px }
```

```js
requestAnimationFrame(animate)
addEventListener("mousemove", e => {
addEventListener("wheel", e => {
addEventListener("wheel", e => e.preventDefault(), {
```

### [Parallax Scroll Animation Demo](https://codepen.io/tkdev-hub/pen/ZYpJegw)

made with: prefers-reduced-motion · mask · backdrop-filter · scroll listener · requestAnimationFrame

```css
.parallax-hero { position: relative }
.parallax-bg { position: absolute; inset: -12% }
.parallax-grid { position: absolute; inset: 0; mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.9), transparent 85%) }
.parallax-orb { position: absolute; filter: blur(8px); opacity: 0.9 }
.orb-1 { top: 12% }
.orb-2 { top: 20% }
.orb-3 { bottom: 8% }
.hero-content { position: relative; backdrop-filter: blur(12px); box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28) }
.eyebrow { text-transform: uppercase }
.scroll-indicator { position: absolute; bottom: 28px; transform: translateX(-50%); text-transform: uppercase }
.card-row { margin-top: 20px }
.info-card { box-shadow: 0 8px 24px rgba(17, 24, 39, 0.06) }
```

```js
requestAnimationFrame(applyParallax)
addEventListener("scroll", onScroll, { passive: true })
```

### [Untitled](https://codepen.io/Choi-Mijeong/pen/KwgvzjK)

on scroll: div.star-icon: opacity ×4 | on hover of div.card-grid: div.star-icon: opacity ×4 | made with: @keyframes · clip-path · GSAP · ScrollTrigger

```css
.card { position: relative; opacity: 0; transform: translateY(20px); animation: cardAppear 0.6s ease-out forwards }
.card:nth-child(1) { animation-delay: 0.1s }
.card:nth-child(2) { animation-delay: 0.2s }
.card:nth-child(3) { animation-delay: 0.3s }
.card:nth-child(4) { animation-delay: 0.4s }
to { opacity: 1; transform: translateY(0) }
.star-icon { position: absolute; clip-path: polygon( 50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35% ); animation: twinkle 2s infinite ease-in-out }
0%, 100% { opacity: 0.3 }
50% { opacity: 1 }
.star-1 { top: 10%; animation-duration: 1.5s }
.star-2 { top: 50%; animation-duration: 2.5s; animation-delay: 0.5s }
.star-3 { top: 20%; animation-duration: 1.8s; animation-delay: 0.2s }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to(".parallax-bg", {
scrollTrigger: { trigger: ".reveal-section", start: "top bottom", end: "bottom top", scrub: true // This makes the movement tie directly to your mouse wheel }
gsap.from(".reveal-box > *", {
scrollTrigger: { trigger: ".reveal-section", start: "top 70%", toggleActions: "play none none reverse" }
gsap.to("body", {
scrollTrigger: { trigger: ".reveal-section", start: "top 50%", // Starts changing when the section is halfway up end: "bottom 50%", scrub: true }
```

### [parallax floating images](https://codepen.io/vii120/pen/XJjRMaL)

on scroll: div.absolute: transform ×6, div.absolute: transform+top ×2 | on hover of img.w-22: div.absolute: transform ×5, div.absolute: transform+top ×3 | made with: pointer / mouse tracking

```js
addEventListener('pointermove', onPointerMove)
```

### [Cosmic GSAP Scroll Experience".](https://codepen.io/albi-idris/pen/OPRbXPm)

on scroll: h2.: transform+opacity+top, div.parallax-bg: transform+top | made with: transition · backdrop-filter · GSAP · ScrollTrigger

```css
body { transition: background-color 0.5s ease }
.reveal-box { opacity: 0; transform: translateY(50px) }
.reveal-box { opacity: 0; transform: translateY(50px); backdrop-filter: blur(10px) }
.reveal-box { opacity: 0; transform: translateY(50px); backdrop-filter: blur(10px) }
.panel { border-bottom: 1px solid rgba(255, 255, 255, 0.1) }
.reveal-box { opacity: 0; transform: translateY(50px); backdrop-filter: blur(10px) }
.reveal-box { opacity: 1; backdrop-filter: blur(15px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4) }
.reveal-section { position: relative }
.parallax-bg { position: absolute; top: 0; background-position: center; opacity: 0.3 }
.reveal-box { position: relative }
.parallax-bg { will-change: transform }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to(".parallax-bg", {
scrollTrigger: { trigger: ".reveal-section", start: "top bottom", end: "bottom top", scrub: true // This makes the movement tie directly to your mouse wheel }
gsap.from(".reveal-box > *", {
scrollTrigger: { trigger: ".reveal-section", start: "top 70%", toggleActions: "play none none reverse" }
gsap.to("body", {
scrollTrigger: { trigger: ".reveal-section", start: "top 50%", // Starts changing when the section is halfway up end: "bottom 50%", scrub: true }
```

### [Parallax Scrolling Effect | jQuery Parallax.js Demo](https://codepen.io/sunny_thakor/pen/gbwrqMg)

held: fixed div.parallax-mirror, fixed div.parallax-mirror, fixed div.parallax-mirror, fixed div.parallax-mirror | on scroll: div.parallax-mirror: transform+top ×4, img.parallax-slider: transform+top ×4 | made with: backdrop-filter

### [Grapple Swing Test](https://codepen.io/wpgmb/pen/PwGqxmo)

made with: transition · :hover · backdrop-filter · canvas 2D

```css
.card { box-shadow: var(--shadow); position: relative }
#stage { position: absolute; inset: 0 }
#hud { position: absolute; top: 14px }
.hudCard { box-shadow: 0 18px 60px rgba(0, 0, 0, 0.25); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px) }
#hudStats { margin-top: 8px }
#buttons { position: absolute; top: 14px }
.btn { transition: transform 0.08s ease, background 0.12s ease, border-color 0.12s ease }
.btn:active { transform: translateY(1px) }
.toast { position: absolute; bottom: 16px; box-shadow: var(--shadow); transform: translateY(10px); opacity: 0; transition: opacity 0.16s ease, transform 0.16s ease }
.toast.show { opacity: 1; transform: translateY(0) }
.toast .msg { margin-top: 2px }
```

### [Sticky Hero Section (CSS Grid Overlay Method)](https://codepen.io/vikktor/pen/wBWQMeQ)

held: sticky div.sticky-stage | made with: position: sticky

```css
.sticky-stage { position: sticky; top: 0 }
.dark-bg { position: absolute; top: 0 }
.floating-logo { position: absolute; opacity: 0.8 }
.left-logo { top: 20%; transform: rotate(-15deg) }
.beer-cans { position: absolute; bottom: -50px; transform: translateX(-50%) }
.beer-cans img { filter: drop-shadow(0px 10px 20px rgba(0,0,0,0.8)) }
.hero-scroll-text { padding-top: 15vh; padding-bottom: 100vh }
.main-title { text-transform: uppercase; margin-bottom: 1rem }
.subtitle { opacity: 0.8; margin-bottom: 50vh }
.spacer-text { opacity: 0.5 }
.next-section { position: relative }
```

### [Parallax animation](https://codepen.io/mj-watts/pen/MYezwbp)

held: fixed div | made with: mix-blend-mode · GSAP · ScrollTrigger

```css
.scene { position: relative }
.section-divider { position: absolute }
.section-divider { position: relative }
.media { position: absolute; inset: 0 }
.media--foreground, .media--foreground-wide { transform: translateX(-50%) }
.media--foreground-wide { transform: translateX(-25%) }
.media--foreground img, .media--foreground-wide img, .media--foreground-small im { object-position: bottom }
.media--invert { filter: invert(0.2) }
.media--effect-1 { filter: invert(1) opacity(0.1) }
.hero-text { position: absolute; inset: 0; will-change: transform; mix-blend-mode: screen }
.hero-text__line { filter: drop-shadow(0 0 4px var(--color-cyan)) drop-shadow(0 0 6px var(--color-green)) drop-shadow(0 0 6px var(--color-blue)) }
> h2 { text-transform: uppercase; margin-bottom: var(--space-m); transform: translateX(-1 * var(--space-l)) }
```

```js
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText)
gsap.to("[data-hero-text]", {
scrollTrigger: { trigger: "[data-hero-text]", start: "-600 top", end: "bottom top", scrub: true, markers: false }
gsap.to(el, {
scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true, pin: true, markers: false }
gsap.fromTo(
scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: true }
```

### [Game Over : LEGO Marvel’s Avengers ( What If...? Jon Bernthal's Punisher vs Thanos )](https://codepen.io/ikrprojects/pen/YPWaOmp)

held: fixed div, fixed div, fixed div | on scroll: use.[object: transform ×4, section.scene: opacity ×3, span.: opacity, svg.[object: filter | made with: position: fixed · :hover · backdrop-filter · GSAP · ScrollTrigger

```css
*, *::after, *::before { position: relative }
&:first-of-type { transform: translateX(-50%) }
&:last-of-type { transform: translateY(20px) }
svg#punisherGrowl { position: absolute; transform: scale(3); filter: blur(4px) }
svg#punisher { position: absolute }
svg { position: absolute }
h1 { margin-bottom: 50px }
dd { margin-top: 25px }
dt, dt + dd { margin-top: 35px }
&#marker0 { top: -900px }
&#marker1 { top: -100px }
&#marker2 { top: 100px }
```

```js
ScrollTrigger.create({
gsap.timeline()
gsap.timeline({defaults:{ duration: 1 }})
gsap.timeline( { repeat: -1, repeatDelay: 0, defaults: { duration: 0.25 } } )
gsap.to("#cMouth", { morphSVG: { shape: cMouths[gsap.utils.random(0, 3, 1)] } } )
gsap.to("#pMouth", { morphSVG: { shape: pMouths[gsap.utils.random(0, 1, 1)] } } )
gsap.timeline({ repeat: -1, repeatDelay: 0, defaults: { duration: 1.25, ease: "none", transformOrigin:"50% 50%" } })
gsap.timeline({ repeat: 0, onComplete: function(){
```

### ["Triple-Stream" (High Visibility)](https://codepen.io/James-Jihan/pen/RNRxBjN)

held: fixed footer.ocean-container | on scroll: use.[object: transform ×3 | made with: position: fixed · @keyframes

```css
.ocean-container { position: fixed; bottom: 0 }
.wave-layer { will-change: transform }
.front { animation: move-left 7s linear infinite }
.mid { animation: move-right 11s linear infinite }
.back { animation: move-right 16s linear infinite }
0% { transform: translateX(-90px) }
100% { transform: translateX(85px) }
0% { transform: translateX(85px) }
100% { transform: translateX(-90px) }
@keyframes move-right animates transform
@keyframes move-left animates transform
```

### [smooth animation parallax scroll](https://codepen.io/sohrabzia/pen/YPWxpxz)

held: sticky div.sticky-wrapper | made with: position: sticky · 3D (perspective / preserve-3d) · requestAnimationFrame

### [parallax css](https://codepen.io/Dwi-Ayu-Lestari-the-sasster/pen/bNegwWr)

made with: nothing recognised — read the code

```css
.parallaxs { position: relative; background-position: center }
.split { padding-top: 20%; padding-bottom: 20% }
.stil { padding-top: 11px }
```

### [Hyper Scroll](https://codepen.io/aleksa-rakocevic/pen/pvbboZx)

held: fixed div.scanlines, fixed div.vignette, fixed div.noise, fixed div.hud, fixed div.viewport | on scroll: div.star: transform+opacity+top ×52, div.star: opacity+top ×14, div.item: transform+opacity+top ×7 | on hover of div.card: div.star: transform+top ×35, div.item: transform+top ×3 | made with: position: fixed · transition · :hover · (hover: hover) gate · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d) · Lenis / smooth scroll · pointer / mouse tracking · requestAnimationFrame

```css
.scanlines { position: fixed; inset: 0 }
.vignette { position: fixed; inset: 0 }
.noise { position: fixed; inset: 0; opacity: 0.07 }
.hud { position: fixed; inset: 2rem; text-transform: uppercase }
.hud-line { position: relative }
.hud-line::after { position: absolute; top: -2px }
.viewport { position: fixed; inset: 0; perspective: 1000px }
.world { position: absolute; top: 50%; will-change: transform }
.item { position: absolute; top: 0 }
.card { position: relative; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5), 0 20px 50px rgba(0, 0, 0, 0.5); transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); tra }
.card:hover { box-shadow: 0 0 30px rgba(255, 0, 60, 0.2) }
.card::before, .card::after { position: absolute; transition: 0.3s }
```

```js
addEventListener('mousemove', (e) => {
requestAnimationFrame(raf)
```

### [3D Shadow Parallax Text](https://codepen.io/ash1198/pen/MYeyXoo)

held: fixed div.hint | on scroll: h1.name: transform | made with: position: fixed · 3D (perspective / preserve-3d) · pointer / mouse tracking · requestAnimationFrame

```css
.stage { position: relative }
.hint { position: fixed; top: 18px; transform: translateX(-50%); text-transform: uppercase; opacity: 0.85 }
.name { transform: perspective(900px) rotateX(10deg) rotateY(-12deg) }
```

```js
addEventListener("mousemove", (e) => {
requestAnimationFrame(tick)
```

### [Holographic Parallax Card](https://codepen.io/tavoosak/pen/RNRaMra)

on scroll: div.card: transform+shadow, div.glare: opacity | on hover of div.card: div.card: transform | made with: transition · :hover · mix-blend-mode · 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking · requestAnimationFrame

```css
body { perspective: 1000px }
.container { position: relative }
.card { position: relative; will-change: transform; transform: rotateX(var(--rX, 0deg)) rotateY(var(--rY, 0deg)); transition: transform 0.1s cubic-bezier(0.2, 0.4, 0.6, 1); box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px r }
.card-content { position: absolute; inset: 20px; transform: translateZ(40px) }
.card-content h2 { text-transform: uppercase; mix-blend-mode: hard-light }
.card-content p { opacity: 0.7; text-transform: uppercase }
.badge { position: absolute; top: 20px; transform: translateZ(20px) }
.glare-container { position: absolute; inset: 0; mix-blend-mode: overlay }
.glare { position: absolute; top: -50%; opacity: 0; transition: opacity 0.3s ease; filter: blur(5px) }
.card:hover .glare { opacity: 1 }
.card:hover { box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.1) }
.graphic { position: absolute; top: 50%; transform: translate(-50%, -50%) translateZ(10px); opacity: 0.3 }
```

```js
requestAnimationFrame(() => {
style.setProperty("--rX", `${rX}deg`)
style.setProperty("--rY", `${rY}deg`)
style.setProperty("--bg-x", `${bgX}%`)
style.setProperty("--bg-y", `${bgY}%`)
style.setProperty("--rX", `0deg`)
style.setProperty("--rY", `0deg`)
addEventListener("mousemove", handleMove)
```

### [PinStack Showcase - Premium ScrollTrigger Panels](https://codepen.io/ash1198/pen/JoKXJYQ)

held: fixed header.topbar | on scroll: span.blob: transform+top ×6 | on hover of button.chip: img.: transform+opacity+top ×4, div.kicker: transform+opacity+top ×2, a.tile: transform+opacity+top ×2 | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · mix-blend-mode · GSAP · ScrollTrigger

```css
.topbar { position: fixed; inset: 14px 14px auto 14px; backdrop-filter: blur(14px); box-shadow: var(--shadow) }
.dot { box-shadow: 0 0 0 6px rgba(124, 92, 255, 0.12) }
.progress { position: relative }
.progress__bar { box-shadow: 0 0 18px rgba(124, 92, 255, 0.35) }
.slides-wrapper { padding-top: 88px }
.panel { position: relative }
.panel::after { position: absolute; inset: 0; opacity: 0.45; mix-blend-mode: overlay }
.panel-bg { position: absolute; inset: -40px }
.grid { position: absolute; inset: 0; opacity: 0.06 }
.blob { position: absolute; filter: blur(40px); opacity: 0.28; transform: translate3d(0, 0, 0) }
.b1 { top: -120px }
.b2 { bottom: -180px }
```

```js
gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.create({
gsap.to(blobs, {
gsap.fromTo(
gsap.timeline({
```

### [parallax background css](https://codepen.io/Dwi-Ayu-Lestari-the-sasster/pen/MYeKXXG)

made with: nothing recognised — read the code

```css
.parallaxs { position: relative; background-position: center }
.header { padding-top: 200px; padding-bottom: 200px }
.cfmn { margin-bottom: 50px }
.ctl { margin-bottom: 50px }
.bt { padding-bottom: 21px }
```

### [Boxeur Parallax - Page Interactive sur la Boxe](https://codepen.io/opxamx/pen/ZYOGVMv)

held: fixed nav.navbar, fixed div.modal | on scroll: div.parallax-bg: transform+top ×5 | on hover of li.: div.scroll-indicator: transform+top | made with: position: fixed · @keyframes · transition · :hover · 3D (perspective / preserve-3d) · IntersectionObserver · scroll listener

```css
.navbar { position: fixed; top: 0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) }
.navbar .nav-links li a { transition: all 0.3s ease }
.parallax-container { perspective: 1px }
.parallax-section { position: relative }
.parallax-section .parallax-bg { position: absolute; top: 0; background-position: center }
.parallax-section .parallax-bg::after { position: absolute; top: 0 }
.parallax-section .content { position: relative }
.parallax-section .container { position: relative }
.hero-section .hero-title { margin-bottom: 1.5rem; text-transform: uppercase }
.hero-section .hero-subtitle { margin-bottom: 3rem }
.hero-section .cta-btn { transition: all 0.3s ease; text-transform: uppercase }
.hero-section .cta-btn:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3) }
```

```js
addEventListener("scroll", () => this.handleScroll())
new IntersectionObserver((entries) => {
```

### [Parallax Landmark Card 😎](https://codepen.io/SyntaxSidekick/pen/wBWBxRv)

on scroll: img.: transform+top, h2.hero-title: transform | on hover of article.landmark-card: img.: transform, h2.hero-title: transform | made with: :focus-visible · prefers-reduced-motion · backdrop-filter · pointer / mouse tracking

```css
.landmark-card:focus-visible { box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.4) }
.hero { position: relative }
.hero img { position: absolute; inset: 0; transform: scale(1.12); will-change: transform }
.hero-title { position: absolute; bottom: 1.5rem; transform: translateX(-50%); text-transform: uppercase; opacity: 0.92; will-change: transform }
.glass-panel { position: relative; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px) }
.glass-panel::before { position: absolute; top: 0 }
.eyebrow { text-transform: uppercase; opacity: 0.7 }
.location { opacity: 0.9 }
.summary { opacity: 0.9 }
.details strong { opacity: 0.65; text-transform: uppercase }
.details span { opacity: 0.95 }
.hero img, .hero-title { transform: none !important }
```

```js
addEventListener('pointermove', (e) => {
```

### [CSS-First Landscapes: Scroll-Driven Parallax Themes (Mountains, Waves, Clouds, Desert)](https://codepen.io/fyildiz1974/pen/ogLNdWK)

held: fixed input.theme-input, fixed input.theme-input, fixed input.theme-input, fixed input.theme-input, fixed div.scene, fixed div.controls, fixed button.controls-toggle, fixed div.credits | on scroll: div.scroll-hint: transform+top | on hover of button.preset-btn: div.scroll-hint: transform+top | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · transition · :hover · prefers-reduced-motion · clip-path · backdrop-filter · custom properties driven by JS

```css
:root { --overlay-opacity: 0 }
.theme-input { position: fixed; opacity: 0 }
.scene { position: fixed; inset: 0 }
.scene__layers { position: absolute; inset: 0; transition: background 1.5s ease; animation: scrollProgress linear; animation-timeline: scroll(root) }
.scene__layers::before { position: absolute; inset: 0; opacity: var(--glow-intensity); transition: all 1.5s ease }
.scene__layers::after { position: absolute; bottom: 0; opacity: calc(var(--fog-intensity) * (0.5 + var(--scroll) * 0.5)); transition: background 1.5s ease }
.scene__overlay { position: absolute; inset: 0; transition: background 0.5s ease }
.layer { clip-path: var(--shape); transform-origin: center bottom; position: relative; --parallax-offset: calc( var(--scroll) * (var(--layer-depth, 0.5) - 0.5) * var(--parallax-intensity) * var(--parallax-base) * 2 ); --cloud-sca }
.layer { transform: none; translate: var(--sway, 0%) calc(var(--base-y) + var(--parallax-offset)); scale: var(--cloud-scale); will-change: translate, scale }
.scene .layer { animation: mountainBreath ease-in-out infinite alternate; animation-duration: calc(20s / var(--anim-speed)); animation-delay: calc(var(--delay, 0) * -1s) }
#theme-waves:checked ~ .scene .layer { animation: waveSway ease-in-out infinite; animation-duration: calc(var(--sway-duration, 12s) / var(--anim-speed)); animation-delay: calc(var(--sway-delay, 0s) * -1); animation-direction: alternate }
#theme-clouds:checked ~ .scene .layer { clip-path: none; box-shadow: 0 14px 35px rgba(0, 0, 0, 0.18), 0 0 40px rgba(255, 255, 255, 0.6); opacity: var(--cloud-opacity, 0.9); animation: cloudDrift linear infinite; animation-duration: calc(var(--drift-duration, 9 }
```

```js
style.setProperty("--overlay-color", `${r}, ${g}, ${b}`)
style.setProperty("--overlay-opacity", e.target.value / 100)
style.setProperty("--hue-shift", e.target.value)
style.setProperty("--anim-speed", speed)
style.setProperty("--parallax-intensity", intensity)
style.setProperty("--overlay-color", color)
style.setProperty("--overlay-opacity", opacity)
```

### [Cozy Winter View - Horizontal Parallax](https://codepen.io/julianehuettl/pen/yyOWgBj)

held: fixed div.trigger | on scroll: g.[object: transform ×5 | on hover of a.: g.[object: transform ×5, a.: color | made with: transition · :hover · mix-blend-mode · GSAP

```css
body { opacity: 0; transition: 0.3s }
.mainContainer { padding-top: 40px }
.scrollMessage { margin-top: 10px }
```

```js
gsap.timeline(
scrollTrigger: { trigger:".trigger", start: "top 0%", scrub: 1, fastScrollEnd: true, pin: true }
```

### [Obsidian Gold Landing Template (Tailwind + GSAP)](https://codepen.io/xxbricksquadxx/pen/qEZwdYz)

held: fixed div.loader, fixed nav.fixed, fixed div.fixed | on hover of a.text-2xl: nav.fixed: background+shadow, img.w-full: transform+top, p.hero-text: transform+opacity, div.hero-btn: transform+opacity, div.absolute: transform+top, div.: transform+opacity | made with: position: fixed · transition · :hover · :focus-visible · prefers-reduced-motion · backdrop-filter · GSAP · ScrollTrigger · scroll listener

```css
.text-stroke { opacity: 0.75 }
.img-container img { transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) }
.img-container:hover img { transform: scale(1.1) }
.loader { position: fixed; inset: 0 }
.loader-text { opacity: 0; transform: translateY(10px) }
.reveal-on-load { opacity: 0; transform: translateY(14px) }
:focus-visible { outline-offset: 3px }
*, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important }
.glass-panel { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px) }
.showcase-frame { position: relative }
.showcase-frame::before { position: absolute; inset: 0; opacity: 0.35 }
.showcase-overlay { position: absolute; inset: 0 }
```

```js
gsap.to(backdrop, { opacity: 1, duration: 0.25, ease: "power2.out" })
gsap.to(panel, {
gsap.to(backdrop, { opacity: 0, duration: 0.2, ease: "power2.out" })
addEventListener("scroll", onScroll, { passive: true })
gsap.registerPlugin(window.ScrollTrigger)
gsap.timeline()
gsap.from(el, {
scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none reverse", }
```

### [Advanced Scroll Effects with Pure CSS — Progress Bar, Parallax & 3D](https://codepen.io/fyildiz1974/pen/KwzJQYb)

held: fixed div.progress, fixed div.bg-layer, fixed div.scroll-hint, fixed footer.footer | on scroll: div.circle: transform+top ×3, div.arrow: transform+top, div.card: transform+opacity+filter+top, div.stat: opacity+filter+top | on hover of div.card: div.circle: transform+top ×3, div.arrow: transform+top, div.card: transform+opacity+filter+top, div.stat: opacity+filter+top | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · transition · :hover · backdrop-filter · 3D (perspective / preserve-3d)

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

### [CSS Only Shadow Of The Beast Tribute](https://codepen.io/NiklasKnaack/pen/vEGVRvB)

held: fixed a.nk | made with: position: fixed · @keyframes · transition · :hover · :has() · mask · backdrop-filter

```css
:root { --aarbron-y-position: 123px; --aarbron-x-position: 50%; --aarbron-walk-animation-duration: 0.6s; --aarbron-walk-animation-steps: 6; --aarbron-stoop-animation-duration: 0.4s; --aarbron-stoop-animation-steps: 6; --aarbron- }
:root { --scene-scale: 2 }
:root { --scene-scale: 3 }
:root { --scene-scale: 4 }
.scene { position: relative; transform: scale(var(--scene-scale)) }
.scene:has(.control.left:hover), .scene:has(.control.right:hover) { --scene-animation-play-state: running }
.scene:has(.control.left:hover) { --scene-direction-animation-play-state: running }
.scene:has(.control.right:hover) { --scene-direction-animation-play-state: paused }
.scene .layer-wrapper { position: absolute }
.scene .layer { position: absolute; inset: 0 }
.scene .layer.sky { background-position: 0 100% }
.scene .layer.moon { background-position: 217px 16px }
```

### [Pure CSS Parallax Scrolling](https://codepen.io/tkinjo/pen/qEZKoae)

made with: 3D (perspective / preserve-3d)

```css
.parallax-wrapper { perspective: 100px }
.parallax-section { position: relative }
.far-layer { transform: translateZ(-50px) scale(1.5) }
.near-layer { transform: translateZ(30px) scale(0.7) }
```

### [GSAP ScrollTrigger: Stacked Card Reveal](https://codepen.io/Mohish-Padave/pen/OPNOVbZ)

on hover of div.cards-container: div.card: transform+filter+top | made with: transition · :hover · backdrop-filter · GSAP · ScrollTrigger

```css
.scroll-indicator { opacity: 0.6; text-transform: uppercase }
.arrow { margin-top: 0.5rem }
#enquiry-newsletter-section { position: relative }
.cards-container { position: relative }
.card { position: absolute; inset: 0; box-shadow: 0 30px 60px rgba(0,0,0,0.25) }
.card-bg { position: absolute; inset: 0; background-position: center; transition: transform 0.5s ease }
.card-bg::after { position: absolute; inset: 0 }
.card-content { position: relative }
h2 { margin-bottom: 1rem }
p { margin-bottom: 2.5rem; opacity: 0.9 }
.btn-primary { text-transform: uppercase; transition: transform 0.2s, background 0.2s }
.btn-primary:hover { transform: scale(1.05) }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline({
```

### [3D Image Wheel with Interactive Tilt](https://codepen.io/ol-ivier/pen/raeGrwG)

held: fixed div, fixed div, fixed div, fixed div.copy, fixed button | on hover of a.: a.: color | made with: position: fixed · transition · :hover · Lenis / smooth scroll · three.js / WebGL · scroll listener · pointer / mouse tracking · requestAnimationFrame

```css
#webgl-container { position: fixed; top: 0 }
#webgl-canvas { position: absolute; top: 0 }
#credits { position: fixed; bottom: 20px }
#instructions { position: fixed; top: 20px }
.copy { position: fixed; top: 20px }
```

```js
addEventListener('scroll', onScroll)
addEventListener('mousemove', onMouseMove)
addEventListener('mouseleave', onMouseUp)
requestAnimationFrame(animate)
requestAnimationFrame(raf)
```

### [The Conqueror Worm, Parallax scroll animating using CSS Shape() with Path() fallback](https://codepen.io/ikrprojects/pen/NPxQpRR)

on scroll: div.segment: transform+top ×21 | made with: clip-path · GSAP · scroll listener

```css
h1 { padding-top: 50px; padding-bottom: 25px }
h2 { padding-top: 25px; padding-bottom: 75px }
#wormBlur { filter: blur(3px) }
supports ( clip-path: shape(from 0% 0%, close) ) { clip-path: shape(from 22.73% 0%,hline to 77.27%,curve to 100% 8.33% with 90.91% 0%/100% 3.33%,vline to 91.67%,curve to 77.27% 100% with 100% 96.67%/90.91% 100%,hline to 22.73%,curve to 0% 91.67% with 9.09% 100%/0% 96.67% }
supports not ( clip-path: shape(from 0% 0%, close) ) { clip-path: path("M 17,0 H 5 C 2,0 0,2 0,5 v 50 c 0,3 2,5 5,5 h 12 c 3,0 5,-2 5,-5 V 5 C 22,2 20,0 17,0 Z") }
supports ( clip-path: shape(from 0% 0%, close) ) { clip-path: shape(from 77.27% 0.35%,line to 22.73% 3.96%,curve by -22.73% 9.03% with -13.64% 1.81%/-22.73% 3.61%,vline by 74.02%,curve by 22.73% 9.03% with 0% 5.42%/9.09% 7.22%,line by 54.55% 3.61%,curve by 22.73% -9.03%  }
supports not ( clip-path: shape(from 0% 0%, close) ) { clip-path: path("M 18,2 6,4 c -3,1 -5,2 -5,5 v 41 c 0,3 2,4 5,5 l 12,2 c 3,1 5,-2 5,-5 V 7 c 0,-3 -2,-6 -5,-5 z") }
supports ( clip-path: shape(from 0% 0%, close) ) { clip-path: shape(from 77.27% 0.42%,line by -54.55% 4.31%,curve by -22.73% 10.78% with -13.64% 2.16%/-22.73% 4.31%,line by 0% 68.98%,curve by 22.73% 10.78% with 0% 6.47%/9.09% 8.62%,line by 54.55% 4.31%,curve by 22.73% -1 }
supports ( clip-path: shape(from 0% 0%, close) ) { clip-path: shape(from 77.27% 0%,line to 22.73% 5.38%,curve by -22.73% 13.44% with -13.64% 2.69%/-22.73% 5.38%,vline by 61.83%,curve by 22.73% 13.44% with 0% 8.07%/9.09% 10.75%,line by 54.55% 5.38%,curve by 22.73% -13.44% }
supports ( clip-path: shape(from 0% 0%, close) ) { clip-path: shape(from 77.27% 0.69%,line to 22.73% 7.74%,curve by -22.73% 17.61% with -13.64% 3.52%/-22.73% 7.04%,vline by 49.31%,curve by 22.73% 17.61% with 0% 10.57%/9.09% 14.09%,line by 54.55% 7.04%,curve by 22.73% -17 }
supports ( clip-path: shape(from 0% 0%, close) ) { clip-path: shape(from 77.27% 1.01%,line to 22.73% 11.32%,curve by -22.73% 25.78% with -13.64% 5.16%/-22.73% 10.31%,vline by 25.78%,curve by 22.73% 25.78% with 0% 15.47%/9.09% 20.63%,line to 77.27% 98.99%,curve by 22.73%  }
supports not ( clip-path: shape(from 0% 0%, close) ) { clip-path: path("M 18,21 6,23 c -3,1 -5,2 -5,5 v 5 c 0,3 2,4 5,5 L 18,40 c 3,1 5,-2 5,-5 v -9 c 0,-3 -2,-6 -5,-5 z") }
```

```js
addEventListener("scroll", event => { init()
gsap.fromTo( "body", { "--bodyColor": "#303030" }, {
```

### [Castle](https://codepen.io/free-rex/pen/WbraMvO)

held: fixed canvas, fixed textarea | made with: position: fixed · canvas 2D · pointer / mouse tracking

### [Happy Journey — Parallax Scroll Car Experience](https://codepen.io/monta99/pen/JoGaKap)

held: fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start, fixed svg.[object, fixed div.scroll-indicator | on scroll: circle.[object: opacity ×17, ellipse.[object: transform+opacity+top ×6, circle.[object: transform+opacity+top ×6, g.[object: transform+top ×4, g.[object: transform ×4, path.[object: transform+top ×2 | made with: position: fixed · @keyframes · GSAP · ScrollTrigger

```css
#scene { position: fixed; top: 0 }
.scroll-element { position: relative }
.scroll-indicator { position: fixed; bottom: 120px; transform: translateX(-50%); text-transform: uppercase; animation: fadeInOut 2s ease-in-out infinite }
.scroll-arrow { animation: bounce 2s ease-in-out infinite; margin-bottom: 5px }
0%, 100% { transform: translateY(0) }
50% { transform: translateY(10px) }
0%, 100% { opacity: 0.7 }
50% { opacity: 1 }
.cloud { animation: cloudFloat 20s ease-in-out infinite }
.cloud:nth-child(2) { animation-delay: 1s }
.cloud:nth-child(4) { animation-delay: 2s }
0%, 100% { transform: translateY(0px) }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline()
ScrollTrigger.create({
gsap.to("#wheel-left, #wheel-right", {
gsap.to(star, {
gsap.to("#smoke1, #smoke2, #smoke3", {
gsap.to("#bird", {
scrollTrigger: { trigger: ".scroll-element", start: "5% top", end: "35% top", scrub: 2 }
```

### [Parallax Swiper Slider – Fluid Motion with Layered Transitions 🎞️](https://codepen.io/bato-web-agency/pen/emJjENV)

held: fixed div.preview, fixed aside.contact-menu | made with: @keyframes · transition · :hover · mask · backdrop-filter · mix-blend-mode

```css
.base-template__text { margin-bottom: 50px }
.slider-section { position: relative }
.slider-section::before { position: absolute; inset: 0; -webkit-mask: linear-gradient(#fff 0, #fff 100%) padding-box, linear-gradient(#fff 0, #fff 100%); mask: linear-gradient(#fff 0, #fff 100%) padding-box, linear-gradient(#fff 0, #fff 100%); -w }
.slide { position: relative }
.slide::before { position: absolute; inset: 0 }
.centered-swiper { position: absolute !important; top: 50%; transform: translate(-50%, -50%); box-shadow: 0 0 40px rgba(0, 0, 0, 0.6) }
.centered-swiper__slide { transition: transform 0.6s ease }
.background-swiper img, .centered-swiper img { -o-object-position: center center; object-position: center center }
.slider-section__title { position: absolute; top: 12.5%; text-transform: uppercase; transform: translateX(-50%) }
.slider-section__text { position: absolute; bottom: 10%; transform: translateX(-50%) }
0% { transform: translateX(-50%); opacity: 1 }
100% { transform: translateX(calc((-50% - 50px))); opacity: 0 }
```

### [Halloween - valley of ghouls ( gooey outline )](https://codepen.io/ikrprojects/pen/YPwLWXg)

held: fixed div | on scroll: g.[object: transform+top ×14, use.[object: transform+top ×12, g.[object: transform | made with: position: fixed · @keyframes · GSAP · ScrollTrigger · scroll listener

```css
#dataText { position: fixed; top: 0px }
#walker { position: relative }
#lFoot { animation: walkingAnim1 1s infinite }
#rFoot { animation: walkingAnim2 1s infinite }
0% { transform: translateY(-5px) }
50% { transform: translateY(0px) }
100% { transform: translateY(-5px) }
0% { transform: translateY(0px) }
50% { transform: translateY(-5px) }
100% { transform: translateY(0px) }
svg, path { will-change: transform, filter }
@keyframes walkingAnim1 animates transform
```

```js
addEventListener("scroll", (event) => {
gsap.to(wMain, { rotate: 0, transformOrigin: "50% 50%" })
gsap.to(wMain, { rotate: 180, transformOrigin: "50% 50%" })
addEventListener("scroll", (event) => { rotatePointers()
gsap.to( pointer, 0.5, { rotation: degrees, transformOrigin:"50% 50%" } )
gsap.to( hand, 0.5, { y: inverseDistance } )
gsap.to( hand, 0.5, { y: halfWidth } )
gsap.to( "#weapon01Wrapper", 0.5, { rotation: degreesMem01, transformOrigin:"50% 50%" } )
```

### [Modal Window Liquid Glass style](https://codepen.io/sanyi-dalmadi/pen/WbrzRmz)

held: fixed div.modal-overlay | on scroll: button.: transform+background+top | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · pointer / mouse tracking

```css
body { background-position: center center }
.modal-overlay { position: fixed; inset: 0; transition: opacity 0.3s ease }
.modal { position: relative; backdrop-filter: blur(12px) saturate(180%); box-shadow: 0 0 30px rgba(0, 0, 0, 0.2) }
.modal::before { position: absolute; top: -50%; transform: rotate(25deg); animation: shine 3s infinite linear }
.modal-layer { position: absolute; inset: 0; transition: transform 0.2s ease-out; will-change: transform }
.modal-backdrop { backdrop-filter: blur(16px) saturate(200%); transform: translate(25px 25px); box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.1); animation: shrimmer 6s linear infinite }
.modal-foreground { position: relative; backdrop-filter: blur(12px) saturate(180%); box-shadow: 0 0 20px rgba(0, 0, 0, 0.2) }
.modal-foreground h2 { padding-bottom: 2rem; border-bottom: solid 3px rgba(255, 255, 255, 0.3); box-shadow: border-box }
.modal-overlay.show .modal { transform: scale(1); opacity: 1 }
.modal-close { position: absolute; top: 1rem; transition: transform 0.4s ease, font-weight 0.4s ease, color 0.4s ease }
.modal-close:hover { transform: scale(1.1) }
#open-modal { position: absolute; top: 50%; transform: translate(-50%, -50%); backdrop-filter: blur(10px) saturate(180%); -webkit-backdrop-filter: blur(10px) saturate(180%); transition: transform 0.3s ease, background 0.3s ease, text- }
```

```js
addEventListener("mousemove", (e) => {
```

### [Parallax Carousel — No Libraries](https://codepen.io/TheMOZZARELLA/pen/QwyQGaG)

held: fixed div.mzaCarousel-progress | on scroll: p.mzaCard-text: transform ×3, header.mzaCard-head: transform+top ×2, footer.mzaCard-actions: transform+top ×2, button.mzaCarousel-dot: transform+background+top ×2, header.mzaCard-head: transform, footer.mzaCard-actions: transform | made with: position: fixed · transition · :hover · backdrop-filter · 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking · requestAnimationFrame

```css
.mzaCarousel { position: relative }
.mzaCarousel-viewport { position: relative }
.mzaCarousel-track { position: relative; perspective: 1200px }
.mzaCarousel-slide { position: absolute; top: calc(50% + 5px); will-change: transform, filter }
.mzaCard { position: relative; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45); backdrop-filter: saturate(120%) blur(4px); transform: translateZ(0) }
.mzaCard::before { position: absolute; inset: -2%; background-position: center; filter: contrast(1.02) saturate(1.08) brightness(0.9); transform: translateZ(-60px) scale(1.18) translate3d(var(--mzaParBgX, 0px), var(--mzaParBgY, 0px), 0); t }
.mzaCard::after { position: absolute; inset: 0 }
.mzaCard-head { position: absolute; inset: 20px auto auto 20px }
.mzaCard-text { position: absolute; inset: auto 20px 85px 20px; backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px) }
.mzaCard-actions { position: absolute; inset: auto auto 18px 18px }
.mzaBtn { box-shadow: 0 3px 15px var(--mzaC-glow); transition: transform 0.2s ease, box-shadow 0.2s ease }
.mzaBtn:active { transform: translateY(1px); box-shadow: 0 3px 10px rgba(130, 160, 255, 0.25) }
```

```js
addEventListener("pointermove", (e) => this._onDragMove(e))
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
addEventListener("pointermove", (e) => this._onTilt(e))
style.setProperty("--mzaPagH", `${pagSpace}px`)
style.setProperty("--mzaCardH", `${cardH}px`)
style.setProperty("--mzaTiltX", (my * -6).toFixed(3))
style.setProperty("--mzaTiltY", (mx * 6).toFixed(3))
```

### [Glide Parallax Carousel / vevet.js Snap](https://codepen.io/anton-bobrov/pen/dPGJaZr)

held: fixed div | on scroll: div.slide: transform ×8, button.dot: background ×3 | made with: transition

```css
.carousel { position: relative; opacity: 0; transition: opacity 0.25s linear }
.carousel.ready { opacity: 1 }
.slide { position: absolute }
.dot { transition: border-color 0.35s linear, background-color 0.35s linear }
```

### [GSAP Scroll Velocity + Lerp — 4 горизонтальні блоки](https://codepen.io/Alex-Yanko-the-lessful/pen/ByjRZbz)

made with: GSAP

```css
.delayed-section { position: absolute }
.delayed-section .inner-container { will-change: transform }
.delayed-section img { will-change: transform }
#del1 { top: 101vh }
#del2 { top: 101vh }
#del3 { top: 101vh }
#del4 { top: 101vh }
#del5 { top: 101vh; opacity: 30% }
```

```js
gsap.to(section.querySelector("img"), {
gsap.to(section.querySelector(".innerContainer"), {
scrollTrigger: { scrub: true, trigger: section, start: "top bottom", end: "bottom top", onUpdate: self => progressTo(self.progress) }
```

### [Article Hover Card - Cinematic Parallax with GSAP sample: Happy as Lazzaro](https://codepen.io/nonatizedpen/pen/Qwypqpe)

on scroll: a.card: filter, div.bg: transform, div.grain: opacity | made with: transition · :hover · mix-blend-mode · GSAP · pointer / mouse tracking

```css
.card { position: relative; filter: grayscale(100%); transition: filter 0.6s ease }
.card:hover { filter: grayscale(0%) }
.bg { position: absolute; inset: 0; filter: brightness(60%) }
.grain { position: absolute; inset: 0; mix-blend-mode: soft-light; opacity: 0.25; transition: opacity 0.6s ease }
.card:hover .grain { opacity: 0.5 }
.content { position: relative }
h1 { text-transform: uppercase; margin-bottom: 0.3rem }
h2 { margin-bottom: 1rem }
p { margin-bottom: 1.2rem }
.tags { opacity: 0.9; margin-bottom: 0.5rem }
```

```js
addEventListener('mousemove', e => {
gsap.to(bg, {
addEventListener('mouseleave', () => {
```

### [All-In-One Parallax Kit — Mousemove + Scroll](https://codepen.io/TheMOZZARELLA/pen/yyegmjr)

on scroll: picture.parallax-layer: transform+top ×4, div.parallax-layer: transform+top ×3, div.pill: transform+top ×3, figure.parallax-layer: transform+top ×2 | on hover of button.: picture.parallax-layer: transform+top ×4, div.pill: transform+top ×3, figure.parallax-layer: transform+top ×2, div.parallax-layer: transform ×2, div.parallax-layer: transform+top, main.sectionWrapper: filter | made with: @keyframes · prefers-reduced-motion · backdrop-filter · mix-blend-mode · IntersectionObserver · scroll listener · pointer / mouse tracking · requestAnimationFrame

```css
h1, h2, h3, h4, h5, h6 { text-transform: capitalize }
#mpxParallax > #bgOff:checked ~ #mpxMoveWrapper { animation: unset }
#mpxParallax #mpxMoveWrapper { position: relative; animation: rain 150s linear infinite }
0% { background-position: 0px 220px, 3px 220px, 151.5px 337.5px, 25px 24px, 28px 24px, 176.5px 150px, 50px 16px, 53px 16px, 201.5px 91px, 75px 224px, 78px 224px, 226.5px 350.5px, 100px 19px, 103px 19px, 251.5px 121px, 125px 1 }
to { background-position: 0px 6800px, 3px 6800px, 151.5px 6917.5px, 25px 13632px, 28px 13632px, 176.5px 13758px, 50px 5416px, 53px 5416px, 201.5px 5491px, 75px 17175px, 78px 17175px, 226.5px 17301.5px, 100px 5119px, 103px 511 }
#mpxParallax #mpxMoveWrapper::after { position: absolute; inset: 0 }
#mpxParallax #mpxMoveWrapper > button { position: absolute; top: 0 }
#mpxParallax #mpxMoveWrapper > button label { position: absolute; inset: 0 }
#mpxParallax #mpxMoveWrapper > button:first-of-type { margin-top: 20px }
#mpxParallax #mpxMoveWrapper > button:last-of-type { margin-top: 20px }
#mpxParallax #mpxMove, #mpxParallax #mpxZoom, #mpxParallax #mpxBackground { position: relative }
#mpxParallax :is(#mpxMove, #mpxZoom, #mpxBackground) picture { position: absolute }
```

```js
addEventListener( "mousemove",
requestAnimationFrame(loop)
requestAnimationFrame(tick)
new IntersectionObserver(
addEventListener("scroll", start, { passive: true })
```

### [Slider con efecto de caída (Vertical Split Slider)](https://codepen.io/Alberto-freelance/pen/raxjQwK)

on scroll: div.content-overlay: opacity | made with: @keyframes

```css
.slider-container { position: relative }
.slice { position: absolute; top: -100%; background-position: center; opacity: 0; transform: translateZ(0); will-change: transform, top }
.slice.active { animation: fall 1.5s ease-out forwards }
.slice:nth-child(1) { background-position: 0% 0%; animation-delay: 0s }
.slice:nth-child(2) { background-position: 25% 0%; animation-delay: .15s }
.slice:nth-child(3) { background-position: 50% 0%; animation-delay: .3s }
.slice:nth-child(4) { background-position: 75% 0%; animation-delay: .45s }
.slice:nth-child(5) { background-position: 100% 0%; animation-delay: .6s }
.slice:nth-child(1) { background-position: 0% 0%; animation-delay: 0s }
.slice:nth-child(2) { background-position: 50% 0%; animation-delay: .2s }
.slice:nth-child(3) { background-position: 100% 0%; animation-delay: .4s }
0% { top: -100%; opacity: 0 }
```

### [Parallax Scroll Kit](https://codepen.io/TheMOZZARELLA/pen/vELXQWy)

on scroll: div.pill: transform+top ×6, picture.: transform+top ×4, figure.: transform+top | on hover of button.: div.pill: transform+top ×3, picture.: transform+top ×2, main.sectionWrapper: filter, aside.: transform+top, div.parallax-bg: transform+top | made with: @keyframes · prefers-reduced-motion · backdrop-filter · mix-blend-mode · IntersectionObserver · scroll listener · requestAnimationFrame

```css
h1, h2, h3, h4, h5, h6 { text-transform: capitalize }
#mpxParallax > #bgOff:checked ~ #mpxMoveWrapper { animation: unset }
#mpxParallax #mpxMoveWrapper { position: relative; animation: rain 150s linear infinite }
0% { background-position: 0px 220px, 3px 220px, 151.5px 337.5px, 25px 24px, 28px 24px, 176.5px 150px, 50px 16px, 53px 16px, 201.5px 91px, 75px 224px, 78px 224px, 226.5px 350.5px, 100px 19px, 103px 19px, 251.5px 121px, 125px 1 }
to { background-position: 0px 6800px, 3px 6800px, 151.5px 6917.5px, 25px 13632px, 28px 13632px, 176.5px 13758px, 50px 5416px, 53px 5416px, 201.5px 5491px, 75px 17175px, 78px 17175px, 226.5px 17301.5px, 100px 5119px, 103px 511 }
#mpxParallax #mpxMoveWrapper::after { position: absolute; inset: 0 }
#mpxParallax #mpxMoveWrapper > button { position: absolute; top: 0 }
#mpxParallax #mpxMoveWrapper > button label { position: absolute; inset: 0 }
#mpxParallax #mpxMoveWrapper > button:first-of-type { margin-top: 20px }
#mpxParallax #mpxMoveWrapper > button:last-of-type { margin-top: 20px }
#mpxParallax #mpxMove, #mpxParallax #mpxZoom, #mpxParallax #mpxBackground { position: relative }
#mpxParallax :is(#mpxMove, #mpxZoom, #mpxBackground) picture { position: absolute }
```

```js
requestAnimationFrame(update)
new IntersectionObserver(
addEventListener("scroll", onScroll, { passive: true })
```

### [Full-Height Cover Card to Fixed Header](https://codepen.io/esedic/pen/zxrreXx)

held: fixed div | on scroll: div.: background | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · transition · :hover · :has() · popover

```css
#sticky-parallax-header { background-position: 50% 50% }
#content { padding-top: 1em }
#metabox { position: fixed; bottom: 1rem }
#metabox :is(button, .button) { opacity: 0.7; transition: opacity 0.25s ease-in-out }
#metabox :is(button, .button):active, #metabox :is(button, .button):focus { outline-offset: 0.25rem }
#metabox > :is(button, .button):hover { opacity: 1 !important }
80% { opacity: 1 }
85% { opacity: 1 }
90% { opacity: 0 }
95% { opacity: 1 }
100% { opacity: 0 }
#metabox > button.animated { animation: 5s pulsate ease-in alternate infinite }
```

### [Waterfall image grid w/ ScrollTrigger v2](https://codepen.io/cristovaov/pen/RNrWZqR)

held: fixed div, sticky p, sticky p, sticky p | on scroll: div.o-box: transform+top ×3 | made with: position: sticky · position: fixed · GSAP · ScrollTrigger · Lenis / smooth scroll · requestAnimationFrame

```css
p { position: sticky }
.u-wrapper { position: relative }
```

```js
gsap.registerPlugin(ScrollTrigger)
requestAnimationFrame(rafRender)
gsap.to(
gsap.timeline()
```

### [Advanced 3D Parallax with Interactive Controls & Mouse Tracking](https://codepen.io/ge-lang/pen/ByjoRJV)

held: fixed div.controls | on scroll: div.parallax-layer: transform+top ×3, div.floating-element: transform+top ×3, div.parallax-container: transform+top | on hover of button.toggle-btn: div.parallax-layer: transform+top ×3, div.floating-element: transform+top ×3, div.scroll-indicator: transform+top | made with: position: fixed · @keyframes · transition · backdrop-filter · 3D (perspective / preserve-3d) · IntersectionObserver · scroll listener · pointer / mouse tracking

### [3D Parallax Cursor – Interactive Tilt & Mouse Effects in React](https://codepen.io/Rebecca-Gilbert/pen/YPwXKGr)

held: fixed div | on scroll: div.: transform+top | made with: transition · 3D (perspective / preserve-3d) · pointer / mouse tracking

```js
addEventListener("mousemove", handleMove)
```

### [GSAP ScrollTrigger Parallax Unmask Sections](https://codepen.io/trupti-pokal-the-solid/pen/emJOxKG)

made with: GSAP · ScrollTrigger

```css
.parallax-wrap { position: relative }
.parallax-target { position: relative; will-change: transform }
.parallax-trigger { position: absolute; bottom: 0 }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.fromTo(target,
scrollTrigger: { trigger: trigger, start: "top bottom", end: "bottom top", scrub: true, }
```

### [ScrollTrigger Line Reveal Animation – Text & Parallax Image Blend ✨](https://codepen.io/bato-web-agency/pen/raOXgGp)

held: fixed div.preview, fixed aside.contact-menu | on scroll: div.text-drop__line: transform+top ×6, div.text-drop__img-box: transform+top ×4, div.scroll-marker: transform+opacity+top | on hover of img.: div.text-drop__line: transform+top ×6, div.text-drop__img-box: transform+opacity+top ×4, div.scroll-marker: transform+opacity+top | made with: @keyframes · transition · mix-blend-mode · 3D (perspective / preserve-3d) · GSAP · ScrollTrigger · Lenis / smooth scroll · requestAnimationFrame

```css
.start { position: relative }
.start::after { position: absolute; top: 25%; transform: rotate(-25deg); filter: blur(150px) }
.start__box { position: relative }
0%, 100% { opacity: 0.25; transform: translateY(0) }
50% { opacity: 0.5; transform: translateY(10px) }
0%, 100% { opacity: 0.25; transform: translateY(0) }
50% { opacity: 0.5; transform: translateY(10px) }
.scroll-marker { position: absolute; top: calc(100% + 80px); margin-top: auto; -webkit-animation: scroll 2.5s ease infinite; animation: scroll 2.5s ease infinite }
.text-drop { position: relative; perspective: 2000px }
.text-drop::after { position: absolute; top: 40%; filter: blur(160px) }
.text-drop::before { position: absolute; top: 20%; filter: blur(100px) }
.text-drop__line { will-change: transform; transform: rotateX(-120deg); mix-blend-mode: difference }
```

```js
requestAnimationFrame(raf)
gsap.registerPlugin(ScrollTrigger)
gsap.fromTo(
scrollTrigger: { trigger: line, start: "bottom bottom", end: "bottom top", scrub: true }
gsap.to(images[index], {
scrollTrigger: { trigger: line, start: `bottom bottom${startOffset}
gsap.to(el, {
scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.5 }
```

### [Nike Product Hero Page with Parallax & Shopping Cart](https://codepen.io/MDJAmin/pen/qEOGLLJ)

made with: position: fixed · @keyframes · transition · :hover · backdrop-filter

```css
body { transition: all 0.4s ease }
.about { position: fixed; bottom: 10px; transition: all 0.2s ease }
.about .bg_links { backdrop-filter: blur(5px); position: absolute }
.about .logo { background-position: 6px 5px; opacity: 0.9; transition: all 1s 0.2s ease; bottom: 0 }
.about .social { opacity: 0; bottom: 0 }
.about .social .icon { background-position: center; transition: all 0.2s ease, background-color 0.4s ease; opacity: 0 }
.about .social.portfolio { transition: all 0.8s ease }
.about .social.dribbble { transition: all 0.3s ease }
.about .social.linkedin { transition: all 0.8s ease }
.about:hover { transition: all 0.6s cubic-bezier(0.64, 0.01, 0.07, 1.65) }
.about:hover .logo { opacity: 1; transition: all 0.6s ease }
.about:hover .social { opacity: 1 }
```

### [GSAP pinned image mask reveal on scroll](https://codepen.io/gridmorphic/pen/WbQPRwv)

on hover of a.link: img.: clip-path | made with: GSAP · ScrollTrigger · Lenis / smooth scroll · requestAnimationFrame

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

### [City skyline](https://codepen.io/Naseem-Fatima/pen/zxvMBae)

made with: nothing recognised — read the code

```css
.background-buildings, .foreground-buildings { position: absolute; top: 0 }
.bb2a { border-bottom: 5vh solid var(--building-color2) }
.fb1a { border-bottom: 7vh solid var(--building-color4) }
.fb2a { border-bottom: 10vh solid var(--building-color3) }
.fb4 { position: relative }
.fb4a { border-top: 5vh solid transparent }
.fb5 { position: relative }
```

### [The CSS portal: a true 3D scroll-driven journey](https://codepen.io/mysth/pen/MYaXprm)

held: sticky div.portal | on scroll: div.portal__scene: transform+top, div.after-portal-content: opacity+top | made with: position: sticky · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · prefers-reduced-motion · mask · 3D (perspective / preserve-3d)

```css
.scroll-container { position: relative; view-timeline-name: --portal-timeline }
.portal { position: sticky; top: 0; perspective: 1000px }
.portal__scene { position: relative; animation: fly-through linear forwards; animation-timeline: --portal-timeline; will-change: transform }
.portal__background { position: absolute; inset: 0; background-position: center; transform: translateZ(-1500px) scale(2.5) }
0% { opacity: 0 }
100% { opacity: 0.94 }
.portal__foreground { position: absolute; inset: 0; background-position: center; mask-image: radial-gradient(circle at center, transparent 15%, black 15.1%); transform: translateZ(0px) }
.portal__foreground::before { position: absolute; inset: 0; mask-image: radial-gradient( circle at center, transparent 14.5%, black 15%, black 15.5%, transparent 15.6% ); transform: translateZ(-2px) }
.portal__foreground::after { position: absolute; inset: 0; mask-image: radial-gradient( circle at center, transparent 14.5%, black 15%, black 15.5%, transparent 15.6% ); transform: translateZ(2px) }
from { transform: translateZ(0px) }
to { transform: translateZ(1500px) }
.after-portal-content { position: absolute; top: 50%; transform: translate(-50%, -50%) translateZ(0); opacity: 0; animation: text-reveal linear forwards; animation-timeline: --portal-timeline; animation-range: 40% 70% }
```

### [CSS Dynamic Point Light Source / Parallax Drop Shadow](https://codepen.io/kupietz/pen/LEpzJgL)

on scroll: svg.[object: shadow+top ×5, div.note: shadow+top | made with: position: fixed · @keyframes · clip-path · mask · backdrop-filter · IntersectionObserver · scroll listener · requestAnimationFrame

```css
.octagon-center { position: fixed; top: 10vh }
.sundiv { transform: scale(20%) translate(-50%, -50%) }
disabled.octagon-center { box-shadow: inset 0 0 125px #00006666 }
.add-darkness::after { position: absolute; inset: -900vw; box-shadow: inset 10px 10px 200vw black }
.center-circle { position: absolute; top: var(--center-y); transform: translate(-50%, -50%); box-shadow: 0 0 10px yellow, 0 0 190px yellow, 0 0 300px yellow }
.octagon-center::before { position: absolute; top: 0; bottom: 0; backdrop-filter: brightness(200%); mask-image: radial-gradient(black 10% , transparent 65%) }
.octagon-container { position: absolute; top: 0; transform: scale(var(--octagon-scale)) rotate(calc(var(--octagon-scale) * 360deg)) }
.shape { position: absolute; filter: drop-shadow(0 0 25px #ffff0099) }
.shape:before { position: absolute; top: 0; clip-path: path("M 0,400 Q 100,300 100,0 Q 100,300 200,400 Z") }
.shape:nth-child(1) { top: calc(400px + var(--oct-radius) * sin(22.5deg) - 400px); animation: stretch1 1s infinite ease-in-out; transform: rotate(112.5deg) scaleY(1) }
.shape:nth-child(2) { top: calc(400px + var(--oct-radius) * sin(67.5deg) - 400px); animation: stretch2 1.1s infinite ease-in-out; transform: rotate(157.5deg) scaleY(1) }
.shape:nth-child(3) { top: calc(400px + var(--oct-radius) * sin(112.5deg) - 400px); animation: stretch3 1.2s infinite ease-in-out; transform: rotate(202.5deg) scaleY(1) }
```

```js
requestAnimationFrame(() => {
new IntersectionObserver((entries) => {
addEventListener("scroll", updateShadowsAndSchedule)
```

### [2025-08-11 - parallax with sticky content](https://codepen.io/loiclaudet/pen/yyYzorY)

held: fixed div, sticky div.content, sticky div.content, sticky div.content | on scroll: img.: transform+top ×2, div.: transform+top, div.content: transform | on hover of img.: img.: transform+top ×2, div.: transform+top, div.content: transform+top | made with: position: sticky · prefers-reduced-motion · GSAP · ScrollTrigger

```css
.content { position: sticky; top: 0 }
section { position: relative }
.image-container { position: absolute; top: 0 }
img { position: absolute; bottom: 0 }
h2 { text-transform: uppercase }
```

```js
ScrollTrigger.create({
```

### [3D Parallax | HTML/CSS/JS + GSAP](https://codepen.io/pixelgridui/pen/dPYVpyO)

held: fixed div.pp-widget, fixed button.pp-reopen | on scroll: div.vignette: opacity, h2.: transform+opacity+top, h1.: transform+top, img.sun-rays: opacity, img.black-shadow: opacity, div.pp-widget: transform+opacity+top | on hover of img.parallax: div.vignette: opacity, h2.: transform+opacity+top, h1.: transform+top, img.sun-rays: opacity, img.black-shadow: opacity, span.pp-reopen-dot: transform+opacity+top | made with: transition · 3D (perspective / preserve-3d) · GSAP · pointer / mouse tracking

```css
main { position: relative }
.parallax { transition: 0.45s cubic-bezier(cubic-bezier(0.2, 0.49, 0.32, 0.94)) }
.data .bg-img { position: absolute; top: calc(50% - 390px) }
.data .fog-7 { position: absolute; top: calc(50% - 100px) }
.data .mountain-10 { position: absolute; top: calc(50% + 169px) }
.data .fog-6 { position: absolute; top: calc(50% + 285px); opacity: 0.3 }
.data .mountain-9 { position: absolute; top: calc(50% + 313px) }
.data .mountain-8 { position: absolute; top: calc(50% + 146px) }
.data .fog-5 { position: absolute; top: calc(50% + 360px) }
.data .mountain-7 { position: absolute; top: calc(50% + 223px) }
.data .text { position: absolute; top: calc(50% - 130px); text-transform: uppercase }
.mountain-6 { position: absolute; top: calc(50% + 120px) }
```

```js
addEventListener("mousemove", (e) => {
gsap.timeline()
```

### [Interactive 3D Product Card with Parallax](https://codepen.io/Kuldeep-Rajput-the-sasster/pen/gbaRqrO)

made with: transition · :hover · backdrop-filter · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
body { perspective: 1000px }
.card-container { position: relative }
.card { backdrop-filter: blur(10px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); transition: transform 0.2s ease-out }
.product-image { transform: translateZ(50px); transition: transform 0.2s ease-out }
.card-details { padding-top: 20px }
.title { transform: translateZ(30px) }
.description { margin-top: 10px; transform: translateZ(20px) }
.price { margin-top: 15px; transform: translateZ(40px) }
.buy-button { margin-top: 20px; transition: transform 0.2s ease-out, background 0.3s ease; transform: translateZ(60px) }
```

```js
addEventListener('mousemove', (e) => {
addEventListener('mouseleave', () => {
```

### [Parallax Swiper Slider – Responsive Hero Banner with Autoplay](https://codepen.io/roniee_1993/pen/YPyQyzG)

on hover of div.slide-btns: div.slide-inner: transform ×5, div.slide-title: transform ×2, div.slide-text: transform ×2, div.slide-btns: transform ×2, div.swiper-wrapper: transform | made with: transition · :hover · requestAnimationFrame

```css
a { transition: all 0.2s ease }
.container { position: relative }
.hero-slider { position: relative }
.hero-slider .swiper-container { position: absolute; top: 0 }
.slide-inner { position: absolute; background-position: center }
.slide-overlay { position: absolute }
.hero-style { transition: all 0.4s ease }
.hero-style .slide-title h2 { margin-bottom: 40px; text-transform: capitalize }
.hero-style .slide-text p { opacity: 0.85; margin-bottom: 40px }
.theme-btn, .theme-btn-s2 { text-transform: uppercase; transition: all 0.3s ease }
.theme-btn-s3 { text-transform: uppercase }
.hero-slider .swiper-button-prev, .hero-slider .swiper-button-next { opacity: 0; transition: all 0.3s ease }
```

```js
requestAnimationFrame(() => {
```

### [KULDEEP: The Ultra Pro Max Touch-UI Header](https://codepen.io/Kuldeep-Rajput-the-sasster/pen/gbamVgN)

made with: position: fixed · transition · backdrop-filter · GSAP · ScrollTrigger

```css
a { transition: color 0.3s ease }
.content-placeholder { background-position: center; position: relative }
.ultra-pro-max-header { position: fixed; top: 0; backdrop-filter: blur(15px); border-bottom: 1px solid rgba(255, 255, 255, 0.1) }
.menu-line { transition: transform 0.3s ease, opacity 0.3s ease }
.menu-overlay { position: fixed; top: 0; opacity: 0 }
.overlay-link { transform: translateY(20px); opacity: 0 }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to(placeholder, {
scrollTrigger: { trigger: placeholder, scrub: true, }
gsap.to(menuLines[0], { rotate: 45, y: 8, duration: 0.3 })
gsap.to(menuLines[1], { opacity: 0, duration: 0.1 })
gsap.to(menuLines[2], { rotate: -45, y: -8, duration: 0.3 })
gsap.to(menuOverlay, {
gsap.fromTo(overlayLinks, {
```

### [Parallax with JS](https://codepen.io/Asadabbas/pen/empBNjZ)

on scroll: div.parallax-content: transform+top ×3 | made with: scroll listener · requestAnimationFrame

```css
.parallax-content { position: relative; will-change: transform; text-transform: uppercase }
```

```js
addEventListener('scroll', handleScroll)
```

### [Parallax Perspective Cards.](https://codepen.io/Bembit/pen/azvNgqM)

held: fixed div | on scroll: div.ring: transform+top, div.process-card: transform+shadow, div.card-image-placeholder: transform, h3.: transform, p.: transform, div.active: transform | on hover of div.process-cards-container: div.ring: transform | made with: position: fixed · @keyframes · transition · :hover · 3D (perspective / preserve-3d) · IntersectionObserver · pointer / mouse tracking · anime.js

```css
.process-tag { margin-bottom: 1rem }
.process-cards-container { margin-top: 4rem; perspective: 1500px }
.process-card { transition: transform 0.1s linear, box-shadow 0.3s ease-out, border-color 0.3s ease }
.process-card > .card-image-placeholder, .process-card > h3, .process-card > p { transition: transform 0.1s linear }
.process-card:hover { box-shadow: 0 20px 45px rgba(0, 0, 0, 0.4) }
.process-card h3 { margin-top: 1.5rem; margin-bottom: 0.75rem }
.mockup-window { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) }
.mockup-header { border-bottom: 1px solid #e5e7eb }
.bar-chart div { opacity: 0.6 }
.target-chart { position: relative }
.ring { animation: spin 2s linear infinite }
to { transform: rotate(360deg) }
```

```js
addEventListener("mousemove", (event) => {
addEventListener("mouseleave", () => {
new IntersectionObserver((entries, observer) => {
```

### [CPChallenge: Slideshow (Modern 2)](https://codepen.io/tommyho/pen/empZzeQ)

held: fixed div.navigation, fixed div.nav-arrow, fixed div.nav-arrow, fixed div.progress-bar, fixed div.custom-cursor | on scroll: div.slide: transform+opacity+top ×3, div.slide-background: transform+opacity+top ×3, div.slide-content: transform+opacity+top ×2, div.slide-image: transform+opacity+top ×2, div.slide-overlay: transform+top ×2, div.nav-dot: transform+background+shadow+top ×2 | on hover of img.: div.slide: transform+opacity+top ×2, div.slide-background: transform+opacity+top ×2, div.slide-overlay: transform+top ×2, div.slide: transform+top ×2, div.slide-background: transform+top ×2 | made with: position: fixed · transition · :hover · backdrop-filter · mix-blend-mode · pointer / mouse tracking

```css
.slideshow-container { position: relative }
.slide { position: absolute; top: 0; opacity: 0; transition: all 1.2s cubic-bezier(0.23, 1, 0.32, 1); transform: scale(1.1) rotate(2deg) }
.slide.active { opacity: 1; transform: scale(1) rotate(0deg) }
.slide.prev { transform: scale(0.9) rotate(-2deg) translateX(-50px); opacity: 0 }
.slide.next { transform: scale(0.9) rotate(2deg) translateX(50px); opacity: 0 }
.slide-background { position: absolute; top: -10%; background-position: center; transform: skewX(-15deg); transition: transform 1.5s cubic-bezier(0.23, 1, 0.32, 1), opacity 1.2s cubic-bezier(0.23, 1, 0.32, 1); opacity: 0 }
.slide.active .slide-background { transform: skewX(-5deg) scale(1.05); opacity: 1 }
.slide-overlay { position: absolute; top: 0; transform: skewX(-10deg); transition: transform 1.2s cubic-bezier(0.23, 1, 0.32, 1) }
.slide.active .slide-overlay { transform: skewX(-3deg) }
.slide-content { position: absolute; top: 50%; transform: translateY(-50%); opacity: 0; transform: translateY(-50%) translateX(-100px) skewX(-20deg); transition: all 1.5s cubic-bezier(0.23, 1, 0.32, 1) }
.slide.active .slide-content { opacity: 1; transform: translateY(-50%) translateX(0) skewX(-5deg) }
.slide-number { opacity: 0.7; margin-bottom: 1rem; transform: skewX(-25deg); filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.9)) drop-shadow(2px 2px 4px rgba(0, 0, 0, 1)) drop-shadow(-2px -2px 4px rgba(0, 0, 0, 0.8)) }
```

```js
addEventListener("mouseenter", () => this.stopAutoPlay())
addEventListener("mouseleave", () => this.startAutoPlay())
addEventListener("mousemove", (e) => {
```

### [Interactive Landing Page with GSAP & Tailwind CSS](https://codepen.io/kevindjcreatives/pen/qEOOgNJ)

held: fixed div.cursor | on scroll: div.card: transform+opacity+top ×2, div.cursor: transform+top | on hover of a.px-4: div.card: transform+opacity+top ×2, div.cursor: transform+background+top, a.px-4: color, div.w-full: transform+top, div.animate-in: transform+top | made with: position: fixed · transition · :hover · 3D (perspective / preserve-3d) · GSAP · ScrollTrigger · pointer / mouse tracking

```css
.hero-section { position: relative }
.card { transition: transform 0.3s ease, box-shadow 0.3s ease }
.card:hover { box-shadow: 0 20px 40px rgba(0,0,0,0.3) }
.btn-primary { transition: all 0.3s ease }
.btn-primary:hover { transform: scale(1.05) }
.btn-red { transition: all 0.3s ease }
.btn-red:hover { transform: scale(1.05) }
.btn-action { transition: all 0.3s ease }
.btn-action:hover { transform: scale(1.05) }
.cursor { position: fixed; top: 0; transform: translate(-50%, -50%); transition: width 0.2s, height 0.2s, background-color 0.2s }
```

```js
gsap.registerPlugin(ScrollTrigger)
addEventListener('mousemove', e => {
gsap.to(cursor, { duration: 0.3, x: e.clientX, y: e.clientY, ease: 'power3.out' })
addEventListener('mouseenter', () => cursor.classList.add('cursor-grow'))
addEventListener('mouseleave', () => cursor.classList.remove('cursor-grow'))
gsap.fromTo(elem,
gsap.from('header .font-bold, header .btn-action', {
gsap.from('header nav a', {
```

### [CPChallenge: Slideshow](https://codepen.io/tommyho/pen/NPGqRzN)

held: fixed div.scroll-indicator | on scroll: h1.slide-title: transform+top ×10, div.scroll-indicator: transform+opacity | made with: position: fixed · @keyframes · IntersectionObserver · scroll listener

```css
.slide { position: relative }
.slide-bg { position: absolute; top: 0; background-position: center }
.slide-content { position: relative; animation: slideInUp 1s ease-out }
.slide-title { margin-bottom: 20px; opacity: 0; animation: fadeInTitle 1.5s ease-out 0.5s forwards, float 3s ease-in-out infinite }
.slide-subtitle { opacity: 0; animation: fadeInSubtitle 1.5s ease-out 1s forwards }
.slide-overlay { position: absolute; top: 0 }
from { transform: translateY(50px); opacity: 0 }
to { transform: translateY(0); opacity: 1 }
from { opacity: 0; transform: translateY(30px) }
to { opacity: 1; transform: translateY(0) }
0%, 100% { transform: translateY(0px) }
50% { transform: translateY(-15px) }
```

```js
new IntersectionObserver((entries) => {
addEventListener("scroll", handleTitleFade)
addEventListener("scroll", () => {
```

### [Deconstructed Prism Card with Dynamic Light Diffusion](https://codepen.io/SultanKhanCQ/pen/NPGPjaY)

held: fixed a.site-link | on scroll: div.mist-cloud: transform+opacity+top ×5, div.prism-face: opacity+top ×4, div.card-layer: transform+top ×3, article.deconstructed-card: transform, div.light-beam: opacity+top, div.refraction-layer: opacity+top | on hover of div.card-system: div.mist-cloud: transform+top ×5, div.card-layer: transform ×3, article.deconstructed-card: transform, div.prism-face: transform | made with: position: fixed · @keyframes · transition · :hover · mix-blend-mode · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.deconstructed-card { position: relative; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) }
.card-layer { position: absolute; top: 0; transition: transform var(--transition-slow), opacity var(--transition-slow) }
.prism-container { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.prism-face { position: absolute; opacity: 0.7; mix-blend-mode: screen; transition: all var(--transition-slow) }
.light-beam { position: absolute; top: -50px; transform: translateX(-50%) rotate(45deg); opacity: 0; transition: opacity var(--transition-slow), transform var(--transition-slow) }
.refraction-layer { position: absolute; top: 0; opacity: 0; transition: opacity var(--transition-slow) }
.mist-cloud { position: absolute; mix-blend-mode: screen; opacity: 0.4; transition: all var(--transition-slow) }
.mist-1 { top: 20%; filter: blur(25px); transform: rotate(-15deg); animation: float-1 8s ease-in-out infinite }
.mist-2 { top: 40%; filter: blur(30px); transform: rotate(25deg); animation: float-2 12s ease-in-out infinite }
.mist-3 { bottom: 15%; filter: blur(35px); transform: rotate(10deg); animation: float-3 10s ease-in-out infinite }
.mist-4 { top: 10%; filter: blur(20px); transform: rotate(-30deg); animation: float-4 9s ease-in-out infinite }
.mist-5 { bottom: 20%; filter: blur(28px); transform: rotate(20deg); animation: float-5 11s ease-in-out infinite }
```

```js
addEventListener("mousemove", (e) => { const rect = card.getBoundingClientRect()
addEventListener("mouseleave", () => { card.style.transform = ""
```

### [Deconstructed Typography Card](https://codepen.io/SultanKhanCQ/pen/XJmJRgQ)

held: fixed a.site-link | on scroll: div.glyph: opacity+top ×43, div.letter-particle: transform+opacity+color+top ×40, div.glyph: opacity ×7, span.letter: transform+color+top ×4, span.letter-shadow: transform+opacity+top ×4, span.letter: transform+color ×4 | on hover of div.card-system: span.letter: transform ×8, span.letter-shadow: transform ×8, div.card-layer: transform ×3, article.deconstructed-card: transform | made with: position: fixed · transition · :hover · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.deconstructed-card { position: relative; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) }
.card-layer { position: absolute; top: 0; transition: transform var(--transition-slow), opacity var(--transition-slow) }
.letter-matrix { position: absolute; top: 0 }
.word-fragment { position: relative }
.letter { position: relative; transition: all var(--transition-slow) }
.letter-particle { position: absolute; opacity: 0; transition: all var(--transition-slow) }
.letter-shadow { position: absolute; top: 0; opacity: 0; transform: translate(0, 0); transition: all var(--transition-slow) }
.glyph-grid { position: absolute; top: 0; opacity: 0.03 }
.glyph { position: absolute; opacity: 0; transition: opacity var(--transition-slow) }
.frame-path { transition: stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1) }
.content-fragment { position: relative }
.fragment-heading { margin-top: auto }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseleave", () => {
addEventListener("mouseenter", () => {
```

### [Fullscreen Parallax Scroll with Smooth Animation](https://codepen.io/sunny_thakor/pen/NPGKEeN)

on scroll: img.thumbnail: transform+top | made with: nothing recognised — read the code

```css
section { position: relative }
.parallax-box { position: relative }
.overlay-text { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

### [Parallax cards with CSS animation-timeline](https://codepen.io/jq/pen/yyNdGjw)

on scroll: img.h-full: transform+top ×2 | made with: scroll-driven animation (animation-timeline) · view() timeline · @keyframes · prefers-reduced-motion · clip-path

```css
0% { transform: scale(1.25) translateY(calc((var(--img-height) * 0.1) * -1)) }
100% { transform: scale(1.25) translateY(calc(var(--img-height) * 0.1)) }
.img-wrap:not(.debug-view) { clip-path: inset(0 round 12px) }
.card img { animation: move-img linear both; animation-timeline: view() }
@keyframes move-img animates transform
```

### [Horizontal Parallax Carousel](https://codepen.io/ash1198/pen/raVEZvB)

made with: transition · 3D (perspective / preserve-3d) · GSAP · ScrollTrigger

```css
.card { box-shadow: 0 0 40px #0ff8; transform: perspective(800px) rotateY(10deg); transition: transform 0.3s }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to(card, {
scrollTrigger: { trigger: card, start: "left center", end: "right center", scrub: true, horizontal: true, }
```

### [Parallax Pixel Rain Background](https://codepen.io/ash1198/pen/vEOqzNK)

on scroll: div.rain-layer: transform+top ×3 | made with: @keyframes · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.background { position: relative; perspective: 800px }
.rain-layer { position: absolute; top: 0; animation: rain-fall linear infinite }
.layer1 { animation-duration: 3s }
.layer2 { animation-duration: 5s }
.layer3 { animation-duration: 7s }
0% { transform: translateY(-50%) }
100% { transform: translateY(0%) }
@keyframes rain-fall animates transform
```

```js
addEventListener("mousemove", (e) => {
```

### [Lazy tail - cursor following animation](https://codepen.io/Vojtch-Kotr/pen/azOXOyr)

held: fixed div.blob-piece, fixed div.blob-piece, fixed div.blob-piece, fixed div.blob-piece, fixed div.blob-piece, fixed div.blob-piece, fixed div.blob-piece, fixed div.blob-piece, fixed div.blob-piece, fixed div.blob-piece | made with: position: fixed · transition · mix-blend-mode · pointer / mouse tracking · requestAnimationFrame

```css
.section-hero { position:relative }
.blob-trail { position:absolute; inset:0; mix-blend-mode:multiply; filter:blur(20px) }
.blob-piece { position:fixed; transform:translate(-50%,-50%); opacity:.92; transition:opacity 2s ease; will-change:transform }
.blob-hidden .blob-piece { opacity:0 }
```

```js
addEventListener('pointermove', e => {
requestAnimationFrame(animate)
```

### [Animated blob with scroll effect](https://codepen.io/evgeniy_burlak/pen/RNPBVKB)

held: fixed canvas | made with: position: fixed · three.js / WebGL · requestAnimationFrame

### [Waves with scroll effect](https://codepen.io/evgeniy_burlak/pen/ByNZjgG)

held: fixed canvas | made with: position: fixed · three.js / WebGL · scroll listener · pointer / mouse tracking · requestAnimationFrame

### [Parallax Play with Background](https://codepen.io/daemonxx/pen/MYwypeV)

made with: scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @keyframes · mix-blend-mode · 3D (perspective / preserve-3d) · scroll listener

```css
.parallax { position: relative }
.parallax > * { animation: parallax linear; animation-timeline: scroll() }
.parallax__13 { margin-top: -6vh }
.parallax__2 { margin-top: -15px }
.parallax__foreground-back { transform: scaleY(1.1); transform-origin: bottom; mix-blend-mode: hard-light }
.main-content { position: relative }
to { transform: translateY(calc(var(--parallax-speed) * 200px)) }
.hero { text-transform: uppercase }
&::after { position: absolute; inset: 0; scale: 2; opacity: 0.5; filter: blur(5rem); translate: -50% }
to { transform: translateY(100px) }
#parallax { animation: parallax-effect linear both; animation-timeline: scroll(block root); animation-range: 0px 200px }
@keyframes parallax animates transform
```

```js
addEventListener("scroll", handleImageVisibility)
```

### [random sunset mountains](https://codepen.io/x-ero/pen/pvvxPor)

on scroll: article.: transform ×6 | made with: @keyframes

```css
section { margin-top: 8%; position: relative }
article { animation: parallax linear infinite; position: absolute }
from { transform: translateX(1%) }
to { transform: translateX(-50%) }
article:nth-child(1) { animation-duration: 35s }
article:nth-child(2) { animation-duration: 20s }
article:nth-child(3) { animation-duration: 25s }
article:nth-child(4) { animation-duration: 20s }
article:nth-child(5) { animation-duration: 15s }
article:nth-child(6) { animation-duration: 10s }
@keyframes parallax animates transform
```

### [Cards Parellex Animation](https://codepen.io/krupesh-10div/pen/myyjmWW)

made with: position: sticky · transition

```css
.cards-container { position: relative }
.card { position: sticky; top: 50%; box-shadow: 0 4px 20px rgba(0,0,0,0.15); transition: transform 0.4s ease, box-shadow 0.4s ease }
#card1:not(.stacked) { transform: translateY(-100px) }
#card2:not(.stacked) { transform: translateY(-70px) }
#card3:not(.stacked) { transform: translateY(-40px) }
```

### [Parallax with Snapping GSAP](https://codepen.io/paulinakukuczka/pen/VYYbzYO)

held: fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start, fixed div.container | on scroll: section.panel: transform+top ×4 | on hover of img.image: section.panel: transform+top ×4 | made with: GSAP · ScrollTrigger

```css
.container__image { background-position: center }
```

```js
gsap.registerPlugin(ScrollTrigger, SplitText)
gsap.to(sections, {
```

### [Simple Pin Parallax](https://codepen.io/paulinakukuczka/pen/xbbdVwG)

held: fixed div.parallax__layers--title | on scroll: img.parallax__layer-img: transform+top ×2, h1.parallax__title: transform+opacity+top, section.parallax: color+top, h2.prallax__text: color+top | on hover of img.parallax__layer-img: h1.parallax__title: transform+opacity+top | made with: GSAP · ScrollTrigger

```css
.parallax { position: relative }
.parallax__layers { position: absolute; top: 0 }
.parallax__layers--title { position: relative; top: -100px }
.parallax__layer-img { position: absolute }
.parallax__layer-img[data-parallax-layer='3'] { position: absolute }
.parallax__layer-img[data-parallax-layer='4'] { position: absolute }
.parallax__title { position: relative; will-change: transform, opacity }
.parallax__text { position: relative }
```

```js
gsap.registerPlugin(ScrollTrigger, SplitText)
gsap.from(title, {
scrollTrigger: { trigger: container, start: 'top top', endTrigger: '.parallax__second', toggleActions: 'play none none reverse', }
ScrollTrigger.create({
gsap.timeline({
scrollTrigger: { trigger: container, start: 'top top', end: 'bottom top', scrub: true, }
```

### [Parallax Scroll Effect with Text Overlay](https://codepen.io/Subin-Abraham/pen/emmvYPM)

made with: nothing recognised — read the code

### [CSS - Parallax](https://codepen.io/its7rishi/pen/myyVBYw)

made with: 3D (perspective / preserve-3d)

```css
.wrapper { perspective: 10px }
header { position: relative }
.background { transform: translateZ(-10px) scale(4) }
.foreground { transform: translateZ(-5px) scale(1.5) }
.background, .foreground { position: absolute }
```

### [Horizontal Loop & Parallax](https://codepen.io/GreenSock/pen/NPPWXjy)

on scroll: div.slide: transform ×4, img.: transform ×4 | on hover of img.: div.slide: transform ×4, img.: transform ×4 | made with: GSAP

```css
.slide { position: relative }
.slide img { position: absolute; top: 0 }
```

```js
gsap.timeline({
```

### [Collectibles cpc-pick-a-card](https://codepen.io/Jason-Davis-the-vuer/pen/raNEorW)

on hover of div.card-container: img.player-image: transform+top | made with: @keyframes · transition · :hover · 3D (perspective / preserve-3d) · three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

### [Deconstructed.Cards](https://codepen.io/SultanKhanCQ/pen/xbxoJMZ)

made with: transition · :hover · backdrop-filter · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.deconstructed-card { position: relative }
.card-layer { position: absolute; top: 0; transition: transform var(--transition-slow), opacity var(--transition-slow) }
.wave-svg { transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) }
.frame-path { transition: stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1) }
.bg-grid { position: absolute; top: 0 }
.grid-line { position: absolute; transition: transform var(--transition-slow), opacity var(--transition-fast) }
.grid-line.horizontal { transform: scaleX(0.3) }
.grid-line.vertical { transform: scaleY(0.3); transform-origin: top }
.bg-objects { position: absolute; top: 0 }
.bg-object { position: absolute; opacity: 0.3; transition: transform var(--transition-slow), opacity var(--transition-slow) }
.bg-object.circle { bottom: 40px; transform: translateY(20px) }
.bg-object.square { top: 40px; transform: rotate(45deg) translateY(-20px) }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseleave", () => {
```

### [Tilted 3D Card with Parallax](https://codepen.io/badger3000/pen/raNEMKj)

on hover of div.card-wrapper: div.card-wrapper: transform+top | made with: transition · :hover · backdrop-filter · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
body { perspective: 1000px }
.card-wrapper { transition: all 0.25s ease; transform: rotateY(-5deg) rotateX(5deg) }
.card-wrapper:hover { transform: rotateY(0deg) rotateX(0deg) }
.card { position: relative; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); transition: all 0.25s ease }
.card::before { position: absolute; top: 0 }
.card-inner { position: absolute; inset: 0; -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px) }
.card-header { position: relative }
.header-bg { position: absolute; top: -10%; background-position: center; filter: brightness(0.9); transform: translateZ(-10px) }
.card-header::after { position: absolute; bottom: 0 }
.card-badge { position: absolute; top: 1rem; box-shadow: 0 4px 8px rgba(247, 37, 133, 0.3); transform: translateZ(10px) }
.card-title { position: absolute; bottom: 1rem; transform: translateZ(5px) }
.card-text { margin-bottom: 1.5rem; transform: translateZ(5px) }
```

```js
addEventListener("mousemove", e => {
addEventListener("mouseleave", () => {
```

### [Parallax Hero Banner for Email (css only)](https://codepen.io/matthieuSolente/pen/JojqvzZ)

made with: prefers-reduced-motion · 3D (perspective / preserve-3d)

### [Bokeh blur 📸 (with heightmap) threeJs](https://codepen.io/wprod/pen/zxYXymW)

made with: three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

```css
* { margin-bottom: 0.5rem }
label { opacity: 0 }
body { position: relative }
```

```js
requestAnimationFrame(animate)
addEventListener("mousemove", onMouseMove)
```

### [CSS Only Parallax Layers](https://codepen.io/HejChristian/pen/VYwEVPO)

on hover of a.: img.: transform+top ×13, img.rays: transform+top | made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · prefers-reduced-motion · mix-blend-mode

```css
from { transform: translateY(calc(-100% * var(--offset) * var(--multiplier))) }
to { transform: translateY(calc(100% * var(--offset) * var(--multiplier))) }
from { transform: translateX(calc(-100% * var(--offset) * var(--multiplier))) }
to { transform: translateX(calc(100% * var(--offset) * var(--multiplier))) }
img { position: absolute; inset: 0 }
img { animation: anim-parallax-y linear forwards; animation-timeline: view(); animation-range: entry 0% exit 100% }
img { animation: anim-parallax-x linear forwards; animation-timeline: view(); animation-range: entry 0% exit 100% }
&::after { content: "🚫 Sorry, animation-timeline: view() isn't supported in your browser." }
.rays { mix-blend-mode: color-dodge }
.filter-mutedGreen { filter: sepia(100%) hue-rotate(100deg) saturate(50%) }
.filter-softSepia { filter: sepia(20%) }
.filter-blue { filter: sepia(100%) hue-rotate(180deg) saturate(300%) }
```

### [Framed Parallax Layers](https://codepen.io/HejChristian/pen/ZYEqoXd)

on scroll: img.rays: transform+top | made with: transition · prefers-reduced-motion · mix-blend-mode · custom properties driven by JS · requestAnimationFrame

```css
media (prefers-reduced-motion: no-preference) { transform: translate3d( 0, calc( (var(--scrollPos, 0) - 0.5) * 2 * var(--offset) * var(--multiplier) ), 0 ) }
.rays { transform: translateX( calc((var(--scrollPos, 0)) * var(--offset) * var(--multiplier)) ) }
.filter-mutedGreen { filter: sepia(100%) hue-rotate(100deg) saturate(50%) }
.filter-softSepia { filter: sepia(20%) }
```

```js
style.setProperty('--scrollPos', scrollPos + 'px')
requestAnimationFrame(animation)
requestAnimationFrame(parallaxFrame)
style.setProperty("--scrollPos", progress)
```

### [project-7](https://codepen.io/DominicNikolai/pen/NPWyvPr)

made with: custom properties driven by JS

```js
style.setProperty( '--bg',
```

### [Infinite Vertical Scroll with Parallax](https://codepen.io/filipz/pen/GgRQmOO)

held: fixed header, fixed div.container, fixed div.progress-bar, fixed div.bottom-progress, fixed footer | on scroll: div.title-wrapper: transform+top ×3, div.quote-wrapper: transform+top ×3, div.progress-bar: transform, div.bottom-progress: transform | on hover of li.close-menu: div.title-wrapper: transform+top ×3, div.quote-wrapper: transform+top ×3, div.bottom-progress: transform, div.scroller: transform+top | made with: position: fixed · transition · :hover · requestAnimationFrame

```css
h1 { text-transform: uppercase; padding-top: 0.2em; will-change: transform }
h2 { margin-top: clamp(1rem, 3vw, 2rem); will-change: transform }
header { position: fixed; top: 0 }
nav ul li a { text-transform: uppercase; position: relative; transition: color 0.3s ease }
nav ul li a::after { position: absolute; bottom: 50%; transition: width 0.3s ease }
.close-menu { position: absolute; top: 1rem }
footer { position: fixed; bottom: 0 }
.container { position: fixed; top: 0 }
.progress-bar { position: fixed; top: 0; transform: scaleY(0); transform-origin: top; will-change: transform }
.bottom-progress { position: fixed; bottom: 2rem; transform: translateX(-50%) }
.bottom-progress-bar { position: relative }
.bottom-progress-fill { position: absolute; top: 0; transform: scaleX(0); will-change: transform }
```

```js
requestAnimationFrame(animate)
requestAnimationFrame(decayVelocity)
addEventListener("wheel", handleWheel, { passive: false })
```

### [func-parallax001](https://codepen.io/yoruokamix/pen/LEYOvEK)

held: sticky section, sticky section | made with: position: sticky

```css
#section01 { position: sticky; top: 0; box-shadow: 0px -5px 20px 6px rgba(0, 0, 0, 0.3) }
#section02 { position: sticky; top: 0; box-shadow: 0px -5px 20px 6px rgba(0, 0, 0, 0.3) }
#section03 { position: relative; box-shadow: 0px -5px 20px 6px rgba(0, 0, 0, 0.3) }
h2 { margin-bottom: 50px }
```

### [Scroll Split Landing Screen](https://codepen.io/SGM1992/pen/WbNERdd)

held: fixed div, fixed section, fixed header.navbar | made with: position: fixed · transition · :hover · clip-path · scroll listener

```css
.navbar { position: fixed; top: 0; box-shadow: 0 4px 10px #FFF; transition: transform 0.3s ease-in-out }
#spacer2 { background-position: center; position: relative }
.scrolling #landing { position: absolute; top: 0 }
h1 { padding-top: 20vh }
p { padding-top: 5vh }
#landing { position: fixed; top: 0 }
section { position: fixed; top: 0 }
section .side { position: absolute; top: 0 }
section .side#side1 { clip-path: polygon(0 0, 0% 100%, 100% 100%) }
section .side#side2 { clip-path: polygon(0 0, 100% 0, 100% 100%) }
section .side img { position: absolute; top: 0 }
```

```js
addEventListener("scroll", function () {
```

### [CSS only mousemove parallax effect concept.](https://codepen.io/ykosinets/pen/mydwQqR)

held: fixed ul.parallax, fixed div.sp-support | on scroll: div.card: transform+shadow, li.parallax__cell: background+color | made with: position: fixed · transition · :hover · :has() · 3D (perspective / preserve-3d)

```css
body:after { position: absolute; top: 0 }
.parallax { position: fixed; top: 0; opacity: 0 }
.parallax li { transition: 0.2s background-color ease; position: relative }
.test { position: absolute; inset: 0; perspective: 300px }
.test .card { position: relative; transform: rotatex(calc(var(--factor-y) * .5deg)) rotatey(calc(var(--factor-x) * .5deg)) translate(calc(var(--factor-x) * 2px), calc(var(--factor-y) * 2px)); box-shadow: calc(var(--factor-x) * -4px) c }
.test .card:after { position: absolute; inset: 16%; filter: blur(50px); opacity: 0.1; transition: 0.3s transform linear; transform: translate(calc(var(--factor-x) * 2px), calc(var(--factor-y) * 2px)) }
```

### [Interactive Bug Journal: Animated Entomology Tracker #CodePenChallenge](https://codepen.io/Avoloch/pen/PwomLop)

held: fixed div.bug-alert, fixed div | on scroll: div.bug-decoration: transform+top ×6 | on hover of button.submit-btn: div.bug-decoration: transform+top ×6, div.bug-animation: transform+top ×3, button.submit-btn: transform, div.: transform, span.: transform | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · 3D (perspective / preserve-3d) · scroll listener · pointer / mouse tracking

```css
body { padding-bottom: 100px; perspective: 1000px }
header { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-bottom: 1px solid var(--glass-border); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); position: relative }
.header-content { position: relative }
.logo { transition: transform 0.3s ease }
.logo:hover { transform: rotateY(10deg) }
.logo span { transform: translateZ(20px) }
.bug-decoration { position: absolute; opacity: 0.4; animation: float 15s infinite ease-in-out }
0%, 100% { transform: translateY(0) rotate(0deg) translateZ(20px) }
50% { transform: translateY(-20px) rotate(10deg) translateZ(50px) }
.section-title { margin-bottom: 20px }
.bug-card { box-shadow: 8px 8px 16px var(--neumorphic-dark), -8px -8px 16px var(--neumorphic-light); transition: transform 0.3s ease, box-shadow 0.3s ease; position: relative }
.bug-card:hover { transform: translateY(-5px) scale(1.02); box-shadow: 12px 12px 20px var(--neumorphic-dark), -12px -12px 20px var(--neumorphic-light) }
```

```js
addEventListener('mousemove', handleCardMove)
addEventListener('mouseleave', handleCardLeave)
addEventListener('scroll', function() {
addEventListener('mouseleave', () => {
```

### [CSS Parallax](https://codepen.io/lewster32/pen/VYwbGPX)

on scroll: div.shape: transform+top ×17, div.shape: transform ×4 | made with: @keyframes · transition · mix-blend-mode · custom properties driven by JS · IntersectionObserver

```css
0% { transform: rotate(0) scale(1.05) }
33% { transform: rotate(-2deg) scale(1) }
66% { transform: rotate(2deg) scale(1.07) }
#scene { position: relative }
#scene::after { position: absolute; inset: 0; background-position: 50% 50%; mix-blend-mode: multiply; opacity: 0.4 }
#scene .shape, #scene .column { --rotate: 0deg; filter: blur(var(--blur)); translate: -50% -50%; transition: left 0.2s ease-out; position: absolute; scale: calc(var(--z) / 100); rotate: var(--rotate) }
#scene .shape { top: calc(var(--y) * 1%); animation: 1s sketchy-jiggle infinite reverse steps(2, jump-start); mix-blend-mode: exclusion }
#scene .column { top: 50% }
#scene .column::before { position: absolute; translate: -33% 50%; bottom: 0; mix-blend-mode: multiply; rotate: calc(var(--rotate) * -1) }
#scene .column::after { position: absolute; rotate: calc(var(--rotate) * -2); bottom: -97%; filter: blur(10px) }
#scene-value { position: absolute; inset: 0; mix-blend-mode: difference }
input[type=range] { position: absolute; top: 0 }
```

```js
style.setProperty("--camera-x", e.target.value)
new IntersectionObserver(
```

### [Parallax Animation](https://codepen.io/ScrollMoo/pen/KwKmVpK)

held: fixed div.container | on scroll: div.skyscraper: transform+top, div.plane: transform+top | made with: position: fixed

```css
.container { position: fixed }
.wrap { position: relative }
.wrap > div { position: absolute }
.sky { background-position: var(--scrollmoo-sky, 100%) var(--scrollmoo-sky, 100%) }
.plane { transform: scale(0.5) }
```

### [Parallax timeline effect](https://codepen.io/EeroCKJ/pen/wBvoPZa)

on scroll: div.: background+top ×5, p.: color+top ×5 | made with: scroll listener

```css
.empty { border-top: 5px solid #ffd700; border-bottom: 5px solid #ffd700 }
.section { position: relative }
.list { padding-top: 150px }
.list div { position: relative; margin-bottom: 150px }
.list p { position: absolute; top: 50%; transform: translateY(-50%) }
.timeline { position: absolute; top: 0; transform: translateX(-50%) }
```

```js
addEventListener("scroll", handleScroll)
```

### [Bruce Lee 3D :: CHECKBOX](https://codepen.io/sonnykoh/pen/KwKgKGm)

on scroll: input.: transform+top | made with: @keyframes · transition · :hover · mix-blend-mode · 3D (perspective / preserve-3d)

```css
body { perspective: 400px }
input { position: absolute; top: 50px; outline-offset: 22px; transform: translateX(-50%) scale(0.5) rotateY(0deg) rotateX(0deg) translateZ(20px); transition: all 0.1s ease-in-out, outline 0.2s ease; background-position: 0px 0px; }
input:after { position: absolute; inset: 0px; transform: translateZ(30px) scale(1); transition: transform 0.15s ease }
input:hover { transform: translateX(-50%) scale(0.506) rotateY(-6deg) rotateX(-1deg) translateZ(16px); outline-offset: 20px; background-position: 1px -1px }
input:hover:after { transform: translateZ(30px) scale(1.01) }
0% { mix-blend-mode: normal; transform: scale(1); opacity: 1 }
10% { mix-blend-mode: hard-light; transform: scale(1.05); opacity: 0.8 }
40% { mix-blend-mode: normal; transform: scale(1); opacity: 1 }
100% { mix-blend-mode: normal; transform: scale(1); opacity: 1 }
input:checked { animation-name: bg; animation-duration: 0.3s; animation-fill-mode: forwards; animation-timing-function: linear; animation-iteration-count: 1; transition: all 0.1s ease-in-out, outline 0.4s ease-out }
input:checked:after { animation-name: blend; animation-duration: 0.3s; animation-fill-mode: forwards; animation-timing-function: linear; animation-iteration-count: 1 }
input:checked:hover { transform: translateX(-50%) scale(0.5) rotateY(0deg) rotateX(0deg) translateZ(20px) }
```

### [Object fit parallax](https://codepen.io/rhernando/pen/JojXRmb)

held: fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start, fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start, fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start | on scroll: img.: transform+top ×2 | made with: GSAP · ScrollTrigger

```css
.container img { object-position: top center }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to(img, {
scrollTrigger: { trigger: img, start: "top center", end: "center top", scrub: true, invalidateOnRefresh: true, markers: true }
```

### [Bruce Lee in 3D](https://codepen.io/sonnykoh/pen/gbOazqq)

on scroll: img.: transform+top | on hover of img.: img.: transform+top | made with: @keyframes · transition · 3D (perspective / preserve-3d)

```css
body { perspective: 400px }
0% { background-position: 0px 0px; transform: translateX(-50%) scale(0.5) rotateY(6deg) rotateX(0deg) translateZ(20px) }
100% { transform: translateX(-50%) scale(0.506) rotateY(-5deg) rotateX(-1deg) translateZ(22px); background-position: 1px -1px }
img { position: absolute; top: 50px; outline-offset: 22px; transform: translateX(-50%) scale(0.5) rotateY(4deg) rotateX(0deg) translateZ(20px); transition: all 0.2s ease; animation-name: bb; animation-iteration-count: infinite }
@keyframes bb animates width, height, background-position, background-size, transform
```

### [Maha Shivaratri Celebration - Interactive Shiva Lingam Design](https://codepen.io/jayramoliya/pen/qEBOjLZ)

on scroll: div.shiva-lingam: shadow | on hover of button.: div.shiva-lingam: shadow, button.: background | made with: position: fixed · @keyframes · :hover

```css
.container { position: relative }
.shiva-lingam { box-shadow: 0 0 50px 10px rgba(255, 255, 255, 0.7); animation: glow 1.5s infinite alternate }
0% { box-shadow: 0 0 50px 10px rgba(255, 255, 255, 0.7) }
100% { box-shadow: 0 0 80px 20px rgba(0, 255, 255, 0.8) }
.message { margin-top: 20px; opacity: 0 }
#toggleAudio { margin-top: 30px }
body::after { position: fixed; top: 0; filter: blur(10px) }
@keyframes glow animates box-shadow
```

### [Parallax Scroll Without JavaScript](https://codepen.io/pixelgridui/pen/OPJyLVJ)

held: fixed div.section-image_container, fixed div.section-image_container, fixed div.section-image_container, fixed div.button-wrapper, fixed a.youtube-button | on hover of a.button: div.marquee: transform, a.button: background | made with: position: fixed · @keyframes · transition · :hover · clip-path

```css
h1 { margin-top: 0; margin-bottom: 0 }
p { margin-bottom: 0 }
.padding-section-small { padding-top: 3rem; padding-bottom: 3rem }
.button { text-transform: uppercase; transition: border-radius 0.2s cubic-bezier(0.215, 0.61, 0.355, 1), background-color 0.2s cubic-bezier(0.215, 0.61, 0.355, 1) }
.section_main-grid { position: relative }
.section { position: relative }
.section-headline-text { text-transform: uppercase }
.ornament { position: absolute; top: -10%; bottom: auto }
.ornament_text { position: relative; top: 0 }
.hero-text_container { position: absolute; top: 7%; bottom: auto }
.hero-text_text { position: relative }
.button-wrapper { position: fixed; top: auto; bottom: 4rem }
```

### [Waterfall image grid w/ ScrollTrigger v1](https://codepen.io/cristovaov/pen/MYWwzXd)

held: fixed div, sticky p, sticky p, sticky p | on scroll: div.o-box: transform+opacity+top ×4 | made with: position: sticky · position: fixed · GSAP · ScrollTrigger · Lenis / smooth scroll · requestAnimationFrame

```css
p { position: sticky }
.u-wrapper { position: relative }
```

```js
gsap.registerPlugin(ScrollTrigger)
requestAnimationFrame(rafRender)
gsap.timeline()
gsap.timeline({
gsap.to(target, {
scrollTrigger: { trigger: target, start: "top bottom", end: "top center", scrub: 1, markers: false }
gsap.to(".o-box", { rotation: 27, duration: 1 })
scrollTrigger: { trigger: "section.fluid", start: "center bottom", end: "bottom top", pin: false, scrub: true, markers: false }
```

### [Layered Clip Paths & Parallax](https://codepen.io/GreenSock/pen/GgKbMez)

on scroll: div.img-container: clip-path ×2, img.: transform ×2 | on hover of img.: div.img-container: clip-path ×2, img.: transform ×2 | made with: clip-path · GSAP

```css
.slider-container { position: relative }
.img-container { position: absolute; top: 0; clip-path: polygon(100% 0%, 110% 0%, 110% 100%, 100% 100%) }
```

### [Video BG Parallax](https://codepen.io/GreenSock/pen/azogLdZ)

held: fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start | on scroll: video.: transform+top | made with: GSAP

```css
.section { position: relative }
```

```js
gsap.to("video", {
scrollTrigger: { trigger: ".video-bg", start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true, markers: true }
```

### [Parallax | Background attachment fixed for videos (and other stuff) w/ position fixed](https://codepen.io/kabel22/pen/xbKNWrQ)

made with: position: fixed · clip-path

```css
.section { clip-path: inset(0px 0px 0px 0px) }
.inner { position: fixed; top: 0; bottom: 0 }
video, img { position: fixed; top: 0 }
```

### [The Tale of Annabel Lee](https://codepen.io/grauconejo13/pen/xbKNZmR)

made with: @keyframes · transition · :hover

```css
.parallax { background-position: center }
.content { animation: fadeIn 1.5s ease-in-out }
from { opacity: 0; transform: translateY(20px) }
to { opacity: 1; transform: translateY(0) }
h1 { margin-bottom: 10px }
p { margin-bottom: 20px }
.controls { margin-top: 20px }
.controls button { transition: transform 0.2s ease, background 0.3s ease }
.controls button:hover { transform: scale(1.1) }
.controls button:disabled { opacity: 0.5 }
#playPauseButton span { transition: transform 0.3s ease }
.parallax { position: relative }
```

### [Dust Particles](https://codepen.io/cfabregas01/pen/RNbqEzN)

on scroll: div.: transform+top ×4 | made with: @keyframes · transition

```css
#nc-main { -webkit-transition: -webkit-transform 0.4s; transition: -webkit-transform 0.4s }
#stars { box-shadow: 117px 1613px #fff, 1488px 635px #fff, 944px 914px #fff, 647px 277px #fff, 1792px 1205px #fff, 656px 1517px #fff, 820px 1839px #fff, 1153px 1400px #fff, 870px 13px #fff, 550px 702px #fff, 1155px 1056px #fff, 8 }
#stars:after { position: absolute; top: 2000px; box-shadow: 117px 1613px #fff, 1488px 635px #fff, 944px 914px #fff, 647px 277px #fff, 1792px 1205px #fff, 656px 1517px #fff, 820px 1839px #fff, 1153px 1400px #fff, 870px 13px #fff, 550px  }
#stars2 { box-shadow: 1117px 1306px #fff, 1078px 1783px #fff, 1179px 1085px #fff, 1145px 920px #fff, 422px 1233px #fff, 387px 98px #fff, 1153px 637px #fff, 1084px 782px #fff, 476px 453px #fff, 926px 1306px #fff, 60px 1086px #fff,  }
#stars2:after { position: absolute; top: 2000px; box-shadow: 1117px 1306px #fff, 1078px 1783px #fff, 1179px 1085px #fff, 1145px 920px #fff, 422px 1233px #fff, 387px 98px #fff, 1153px 637px #fff, 1084px 782px #fff, 476px 453px #fff, 926p }
#stars3 { box-shadow: 940px 1360px #fff, 1071px 539px #fff, 1710px 1414px #fff, 836px 299px #fff, 1944px 1420px #fff, 253px 1449px #fff, 1257px 1250px #fff, 1588px 1830px #fff, 1077px 1204px #fff, 273px 1081px #fff, 1993px 766px # }
#stars3:after { position: absolute; top: 2000px; box-shadow: 940px 1360px #fff, 1071px 539px #fff, 1710px 1414px #fff, 836px 299px #fff, 1944px 1420px #fff, 253px 1449px #fff, 1257px 1250px #fff, 1588px 1830px #fff, 1077px 1204px #fff,  }
#stars4 { box-shadow: 233px 1976px #fff, 1196px 1119px #fff, 646px 740px #fff, 335px 645px #fff, 1119px 1452px #fff, 176px 1870px #fff, 639px 1711px #fff, 647px 1388px #fff, 1516px 1108px #fff, 464px 66px #fff, 331px 344px #fff, 7 }
#stars4:after { position: absolute; top: 2000px; box-shadow: 233px 1976px #fff, 1196px 1119px #fff, 646px 740px #fff, 335px 645px #fff, 1119px 1452px #fff, 176px 1870px #fff, 639px 1711px #fff, 647px 1388px #fff, 1516px 1108px #fff, 464 }
from { transform: translateY(0px) }
to { transform: translateY(-2000px) }
@keyframes animStar animates transform
```

### [Portfolio](https://codepen.io/coderMastery/pen/PwYdmJa)

held: fixed nav.navbar | on hover of a.navbar-brand: div.header-shape: transform+top ×10, nav.navbar: shadow | made with: scroll() timeline · transition · :hover · Web Animations API (.animate)

```css
.btn-1 { text-transform: capitalize; box-shadow: var(--shadow-black300); transition: all .5s ease }
.btn-2 { text-transform: capitalize; box-shadow: var(--shadow-black100); transition: all .5s ease }
.section-title { margin-bottom: 60px }
.section-title h4 { text-transform: capitalize }
.section-title h2 { text-transform: uppercase }
.owl-carousel .owl-dots { margin-top: 20px }
.navbar { box-shadow: 0 10px 10px rgba(0, 0, 0, .08); transition: all .5s ease }
.navbar.navbar-shrink { box-shadow: 0 10px 10px rgba(0, 0, 0, .1) }
.navbar .navbar-brand { text-transform: capitalize }
.navbar .nav-item .nav-link { text-transform: capitalize; position: relative }
.navbar .nav-item .nav-link::before { position: absolute; top: -45px; transform: translateX(-50%); transition: all .3s ease-out 0s }
.header-content { padding-top: 110px; position: relative }
```

```js
.animate({
```

### [Portfolio](https://codepen.io/coderMastery/pen/GgKXmMx)

held: fixed nav.navbar | on hover of a.navbar-brand: div.header-shape: transform+top ×10, a.nav-link: color+top ×2, div.owl-stage: transform | made with: scroll() timeline · transition · :hover · Web Animations API (.animate)

```css
.btn-1 { text-transform: capitalize; box-shadow: var(--shadow-black300); transition: all 0.5s ease }
.btn-2 { text-transform: capitalize; box-shadow: var(--shadow-black100); transition: all 0.5s ease }
.section-title { margin-bottom: 60px }
.section-title h4 { text-transform: capitalize }
.section-title h2 { text-transform: uppercase }
.owl-carousel .owl-dots { margin-top: 20px }
.navbar { box-shadow: 0 10px 10px rgba(0, 0, 0, 0.08); transition: all 0.5s ease }
.navbar.navbar-shrink { box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1) }
.navbar .navbar-brand { text-transform: capitalize }
.navbar .nav-item .nav-link { text-transform: capitalize; position: relative }
.navbar .nav-item .nav-link::before { position: absolute; top: -45px; transform: translateX(-50%); transition: all 0.3s ease-out 0s }
.header-content { padding-top: 110px; position: relative }
```

```js
.animate( {
```

### [Vertical Parallax - Paint worklet](https://codepen.io/JBerendes/pen/PwYdmGQ)

made with: 3D (perspective / preserve-3d) · custom properties driven by JS · scroll listener

```css
:root { --scroll-position: 0 }
```

### [Parallax'd Backpack Landing Page](https://codepen.io/leonam-silva-de-souza/pen/ZYzxbzj)

on scroll: img.translateY: transform+top ×3 | made with: transition · :hover · scroll listener

```css
nav { position: absolute; top: 0 }
.links a { margin-top: 0.6rem; text-transform: uppercase; transition: .3s }
.hamburger-menu { position: relative }
.hamburger-menu .bar { position: relative }
.bar::before, .bar::after { position: absolute }
.bar::before { transform: translateY(-9px) }
.bar::after { transform: translateY(9px) }
.hero { position: relative }
.hero img { position: absolute; top: 0 }
.hero #text { position: absolute }
#btn { position: absolute; transform: translateY(200px) }
.heading { margin-bottom: 0.5rem }
```

```js
addEventListener("scroll", () => {
```

### [Smooth Mouse Parallax](https://codepen.io/Jack-Whitworth/pen/emOVVyr)

made with: pointer / mouse tracking · requestAnimationFrame

```css
div { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

```js
addEventListener("mousemove", this.updateTargetPositions.bind(this))
requestAnimationFrame(this.animateParallax.bind(this))
```

### [3D Patronus Magic Card](https://codepen.io/alexandrevacassin/pen/ogvEzVa)

on scroll: div.parallax-layer: transform+top ×7 | made with: mix-blend-mode · 3D (perspective / preserve-3d) · pointer / mouse tracking · requestAnimationFrame

```css
.card { position: relative; perspective: 1000px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) }
.parallax-layer { position: absolute; bottom: 0; background-position: center }
.parallax-layer:nth-child(1) { filter: blur(5px) }
.parallax-layer:nth-child(2) { filter: blur(3px) }
.parallax-layer:nth-child(3) { filter: blur(2px) }
.parallax-layer:nth-child(4) { filter: blur(0px) }
.parallax-layer:nth-child(5) { filter: blur(2px) }
.parallax-layer:nth-child(6) { filter: blur(3px) }
.parallax-layer:nth-child(7) { filter: blur(5px) }
.parallax-layer img { margin-top: calc(-13% + var(--layer-offset, 0%)) }
.card-content { position: absolute; bottom: 0 }
svg { margin-top: calc(-13% + var(--layer-offset, 0%)); box-shadow: inset 0px 0px 10px #000; mix-blend-mode: multiply }
```

```js
addEventListener("mousemove", (e) => {
requestAnimationFrame(animate)
```

### [Linguistic Parallax Word-Layering 3D Spin Effect](https://codepen.io/soprannaturale/pen/XJregXK)

made with: three.js / WebGL · canvas 2D · scroll listener · pointer / mouse tracking · requestAnimationFrame

```css
#info { position: absolute; top: 10px }
```

### [Explore Rinjani: A GSAP Scroll Animation Experience](https://codepen.io/yossyadirta/pen/RNbZKjd)

on scroll: img.: transform+top ×4, h1.: transform+opacity+top, div.about-text: transform+opacity+top | made with: transition · :hover · custom properties driven by JS · GSAP · ScrollTrigger

```css
main { position: relative; top: 0; transform: translateX(-50%) }
section { position: relative }
h2 { margin-bottom: 16px }
h5 { margin-bottom: 4px }
#hero { position: relative }
#sky, #mountain, #grass, #tree { position: absolute }
#tree { bottom: 0 }
#sky { bottom: 0; transform: translateY(75%) }
#mountain { bottom: -1vh; transform: translateY(100%) scale(0) }
#grass { bottom: -5vh; transform: translateY(75%) scale(0.1) }
#title { position: relative; top: min(calc(30vh + 10vw), 50%); text-transform: uppercase; transform: translateY(75%) scale(0.5); opacity: 0 }
.about-text, .about-image { margin-bottom: 2rem }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline({
gsap.to("#tree", {
scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
gsap.to("#mountain", {
gsap.to("#title", {
gsap.to("#grass", {
scrollTrigger: { trigger: "#about", start: "top 90%", end: "bottom 98%", scrub: true }
```

### [Portfolio Webpage Example](https://codepen.io/leonam-silva-de-souza/pen/xbKRMyM)

held: fixed nav.navbar | on hover of a.navbar-brand: div.header-shape: transform+top ×10, a.nav-link: color+top ×2, nav.navbar: shadow, div.owl-stage: transform | made with: scroll() timeline · transition · :hover · Web Animations API (.animate)

```css
.btn-1 { text-transform: capitalize; box-shadow: var(--shadow-black300); transition: all .5s ease }
.btn-2 { text-transform: capitalize; box-shadow: var(--shadow-black100); transition: all .5s ease }
.section-title { margin-bottom: 60px }
.section-title h4 { text-transform: capitalize }
.section-title h2 { text-transform: uppercase }
.owl-carousel .owl-dots { margin-top: 20px }
.navbar { box-shadow: 0 10px 10px rgba(0, 0, 0, .08); transition: all .5s ease }
.navbar.navbar-shrink { box-shadow: 0 10px 10px rgba(0, 0, 0, .1) }
.navbar .navbar-brand { text-transform: capitalize }
.navbar .nav-item .nav-link { text-transform: capitalize; position: relative }
.navbar .nav-item .nav-link::before { position: absolute; top: -45px; transform: translateX(-50%); transition: all .3s ease-out 0s }
.header-content { padding-top: 110px; position: relative }
```

```js
.animate({
```

### [Smooth Parallax Effect with Vanilla JavaScript](https://codepen.io/Sxzarr/pen/jENqdqx)

on scroll: img.parallax: transform ×3 | on hover of img.parallax: img.parallax: transform+top ×2, img.parallax: transform+filter+top | made with: @keyframes · transition · :hover · pointer / mouse tracking · requestAnimationFrame

```css
.container { position: relative }
.title { position: absolute; top: 10%; transform: translateX(-50%) }
.title h1 { margin-bottom: 10px }
.parallax-wrapper { position: relative }
.parallax { position: absolute; opacity: 0; animation: fadeIn 1s ease-out forwards; transition: transform 0.3s ease-out, filter 0.3s ease-out }
.parallax:nth-child(1) { top: 40% }
.parallax:nth-child(2) { top: 50% }
.parallax:nth-child(3) { top: 65% }
.parallax:hover { transform: scale(1.1); filter: drop-shadow(0 0 15px rgba(0, 0, 0, 0.2)) }
from { opacity: 0 }
to { opacity: 1 }
.parallax:nth-child(1) { top: 15% }
```

```js
requestAnimationFrame(updateParallax)
addEventListener('mousemove', handleMovement)
```

### [JS_Create a Parallax Scrolling with GSAP scrollTrigger](https://codepen.io/shiuh-li/pen/gbYpPrR)

on scroll: li.parallax_bg01: transform+top, li.parallax_bg02: transform+top | on hover of li.parallax_bg01: li.parallax_bg01: transform+top, li.parallax_bg02: transform+top | made with: :has() · GSAP · ScrollTrigger

```css
.wrapper { position:relative }
.tt-block { position:relative }
ul.bg_list li { margin-top:-0.25rem; background-position:top center; position:absolute; top:0 }
ul.bg_list li:nth-of-type(1) { opacity:0.85; filter:saturate(120%) }
ul.bg_list li:nth-of-type(2) { opacity:0.45; filter: hue-rotate(10deg) brightness(110%) }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to('.parallax_bg01', {
gsap.to('.parallax_bg02', {
```

### [Untitled](https://codepen.io/lucille-lindeque/pen/VYZYXvJ)

on scroll: div.marquee-content: transform+top | made with: @keyframes · mask

```css
.mask-container { background-position: center; position: relative }
.image { position: absolute; -webkit-mask-image: url("#mask"); mask-image: url("#mask") }
.marquee { position: absolute; top: 50%; transform: translateY(-50%) }
.marquee-content { -webkit-animation: marquee 20s linear infinite; animation: marquee 20s linear infinite }
.marquee-content span { text-transform: uppercase }
0% { transform: translateX(-100%) }
100% { transform: translateX(100%) }
0% { transform: translateX(-100%) }
100% { transform: translateX(100%) }
@keyframes marquee animates transform
```

### [Parallax Scroll Animation](https://codepen.io/procoderawais/pen/VYZYjLo)

on scroll: div.parallax-layer: transform+top ×4, header.header: opacity+top | made with: transition · backdrop-filter · 3D (perspective / preserve-3d) · IntersectionObserver · scroll listener

```css
.parallax-container { perspective: 10px; position: relative }
.header { position: relative }
.header h1 { margin-bottom: 1rem }
.parallax-layer { position: absolute; top: 0; bottom: 0; background-position: center }
.mountains-bg { transform: translateZ(-15px) scale(2.5) }
.mountains-mid { transform: translateZ(-10px) scale(2) }
.mountains-front { transform: translateZ(-5px) scale(1.5) }
.trees { transform: translateZ(-2px) scale(1.2) }
.content { position: relative }
.card { backdrop-filter: blur(10px); transform: translateZ(0); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); opacity: 0; transform: translateY(50px); transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) }
.card.visible { opacity: 1; transform: translateY(0) }
.card h2 { margin-bottom: 1rem }
```

```js
new IntersectionObserver((entries) => {
addEventListener('scroll', () => {
```

### [JS_Create a parallax hover effect with Vanilla-tilt.js](https://codepen.io/shiuh-li/pen/wBwwRRV)

on scroll: div.pic-block: transform+top, div.tt-block: transform+top, div.img-block: transform+filter+top | on hover of img.: div.tt-block: transform+top ×2, div.img-block: transform+filter+top ×2, div.pic-block: transform, h1.: color+top, p.: color+top, div.pic-block: transform+top | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.pic-block { position:relative }
.pic-block .tt-block { transition:color 0.5s, text-shadow 0.5s, transform 0.5s; transform: translateZ(100px) }
.pic-block:nth-of-type(2) .tt-block { top:-7%; position:relative }
.pic-block:nth-of-type(2) .tt-block p { margin-top:.5rem }
.pic-block .img-block { filter:grayscale(90%) blur(0px); transition:transform 0.5s; position:absolute; top:0% }
.pic-block:hover .img-block { transform:scale(0.87); filter:grayscale(5%) blur(1px) }
.pic-block:hover .tt-block { transform:scale(1.15) translateZ(100px) }
```

### [CPChallenge: Text Art (Static background)](https://codepen.io/tommyho/pen/XJrrygw)

held: fixed button.control-button, fixed div.text0, fixed button.control-button | on scroll: h1.text-art: transform+opacity+top | on hover of button.control-button: button.control-button: transform | made with: position: fixed · transition · :hover · 3D (perspective / preserve-3d) · scroll listener

```css
.parallax-container { position: relative }
.section { position: relative }
.parallax::after { position: absolute; top: 0; bottom: 0; transform: translateZ(-1px) scale(1.5); background-position: center }
.text-art { opacity: 0; transform: translateY(50px); transition: all 0.5s ease-out }
.text-art.visible { opacity: 1; transform: translateY(0) }
.control-button { position: fixed; transition: all 0.3s ease; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3) }
.control-button:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4) }
#fullscreenBtn { top: 20px }
#scrollSpeedControl { position: fixed; top: 20px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3) }
#scrollSpeedControl:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4) }
#topBtn { bottom: 20px; opacity: 0; transition: all 0.3s ease }
#topBtn.visible { opacity: 1 }
```

```js
addEventListener("scroll", handleScroll)
```

### [Animated Landing Page with Parallax and Scroll Reveal](https://codepen.io/leonam-silva-de-souza/pen/oNKrwjZ)

on scroll: li.nav-item: transform+opacity+top ×4, div.parallax: transform+top ×4, a.nav-logo: transform+opacity+top, div.nav-toggle: opacity, h1.parallax: transform+opacity+top, span.parallax: transform+opacity+top | on hover of a.nav-logo: li.nav-item: transform+opacity+top ×4, a.nav-logo: transform+opacity, div.nav-toggle: opacity, h1.parallax: transform+opacity+top, span.parallax: transform+opacity+top, div.home-scroll: transform+opacity+top | made with: position: fixed · transition · GSAP

```css
.l-header { position: absolute; top: 0 }
.nav-item { margin-bottom: 2rem }
.home { position: relative }
.home-parallax { position: absolute; background-position: center }
.home-title, .home-subtitle { position: absolute }
.home-title { top: 32% }
.home-subtitle { top: 44% }
.home-scroll { position: absolute; bottom: 2.5rem }
.section-data { margin-bottom: 3rem }
.section-title { margin-bottom: 1rem }
.nav-menu { position: fixed; top: -100%; transition: .3s }
.show { top: var(--header-height) }
```

```js
gsap.from('.nav-logo', {opacity: 0, duration: 3, delay: .5, y: 30, ease:'expo.out'})
gsap.from('.nav-toggle', {opacity: 0, duration: 3, delay: .7, y: 30, ease:'expo.out'})
gsap.from('.nav-item', {opacity: 0, duration: 3, delay: .7, y: 35, ease:'expo.out', stagger: .2})
gsap.from('.home-title', {opacity: 0, duration: 3, delay: 1.3, y: 35, ease:'expo.out'})
gsap.from('.home-subtitle', {opacity: 0, duration: 3, delay: 1.1, y: 35, ease:'expo.out'})
gsap.from('.home-scroll', {opacity: 0, duration: 3, delay: 1.5, y: 35, ease:'expo.out'})
```

### [Scroll Animation #1](https://codepen.io/RicardoYare/pen/PoMgYdy)

held: sticky div | on scroll: div.: transform+top ×2 | made with: position: sticky · transition · scroll listener

```css
body { margin-top: auto }
#cont { position: relative }
#stickyDiv { position: sticky; top: 0% }
#tierra { background-position: center 0px; transition: all 0.5s; filter: blur(0.5px) }
#kids { background-position: center; transition: all 0.8s; position: absolute; filter: blur(0.9px) }
#text { position: absolute; transition: all 0.8s; filter: blur(0.7px) }
```

```js
addEventListener("scroll", () => {
```

### [parallax letter](https://codepen.io/SyntaxSorcererLogicLuminary/pen/NWQJoPB)

on scroll: div.x: transform+top ×5, div.b: transform+top | made with: @keyframes · :hover

```css
50% { box-shadow: 2px 0px 1px hsl(213deg 74% 58% / 30%), 0px 2px 1px hsl(334deg 74% 59% / 30%), 2px 2px 1px hsl(275deg 74% 59% / 30%) }
100% { box-shadow: 2px 0px 1px hsl(213deg 74% 58% / 60%), 0px 2px 1px hsl(334deg 74% 59% / 60%), 2px 2px 1px hsl(275deg 74% 59% / 60%) }
0% { box-shadow: 2px 0px 1px hsl(213deg 74% 58% / 60%), 0px 2px 1px hsl(334deg 74% 59% / 60%), 2px 2px 1px hsl(275deg 74% 59% / 60%) }
50% { box-shadow: 2px 0px 1px hsl(213deg 74% 58% / 30%), 0px 2px 1px hsl(334deg 74% 59% / 30%), 2px 2px 1px hsl(275deg 74% 59% / 30%) }
0% { filter:blur(0px)grayscale(0%)sepia(0%) }
100% { filter:blur(3px)grayscale(20%)sepia(10%) }
section { padding-top: 10px }
section:hover { animation-name: select-bg; animation-delay:0s; animation-duration: 5s; animation-timing-function: ease-in; animation-fill-mode: forwards }
div#scene { margin-top: 0; padding-top: 10vh }
.b { animation: guide-appear; animation-delay:0.3s; animation-duration: 2s; animation-timing-function: ease-in; animation-fill-mode: forwards }
.d { animation: select-text; animation-delay:1.5s; animation-duration: 1.5s; animation-timing-function: ease-in; animation-fill-mode: forwards }
.e { animation: close-tab; animation-duration: 1.2s; animation-timing-function: ease-in; animation-fill-mode: forwards }
```

### [Space Parallax](https://codepen.io/dustindwayne/pen/rNXqogm)

on scroll: canvas.space: transform, canvas.planets: transform | made with: transition · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
.space, .planets, .shootingstar { position: absolute; top: 0 }
.planets { filter: brightness(0.27) }
.ufo { position: absolute; top: 0; transition: all 0.25s; filter: drop-shadow(0 0 3px rgba(0,0,0,0.5)) brightness(0.85) }
.info { transition: opacity 3s }
```

```js
addEventListener('mousemove', (e) => {
requestAnimationFrame(animate)
requestAnimationFrame(animatePixels)
```

### [draggable slider](https://codepen.io/barthendrix/pen/abeKboB)

made with: GSAP

```css
.cards__title { margin-bottom: calc(var(--gutter) * 0.5) }
.card { position: relative }
.card__visual { position: absolute; inset: 0; transform-origin: bottom }
.card__img { position: absolute; top: 0 }
```

```js
gsap.registerPlugin(Draggable, InertiaPlugin)
```

### [3D Tilt Gallery with Rotating Photos](https://codepen.io/filipz/pen/LYwmXxe)

held: fixed div.images-container | on scroll: div.images-container: transform | on hover of a.cta-button: a.cta-button: transform, div.images-container: transform | made with: position: fixed · transition · :hover · 3D (perspective / preserve-3d) · GSAP · pointer / mouse tracking

```css
.container { position: relative; perspective: 1600px }
.centered-text { position: absolute; transform: translateZ(200px) }
.centered-text h1 { margin-bottom: 1.5rem }
.centered-text p { margin-bottom: 2rem }
.cta-button { transition: all 0.3s ease }
.cta-button:hover { transform: translateY(-2px) }
.images-container { position: fixed; inset: 0 }
.floating-image { position: relative; will-change: transform }
.floating-image img { box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) }
.floating-image:nth-child(1) { transform: translate3d(-10%, -10%, 50px) rotateY(25deg) rotateX(-5deg) }
.floating-image:nth-child(2) { transform: translate3d(0, -15%, 70px) rotateX(-10deg) }
.floating-image:nth-child(3) { transform: translate3d(10%, -10%, 50px) rotateY(-25deg) rotateX(-5deg) }
```

```js
addEventListener("mousemove", (e) => {
gsap.to(imagesContainer, {
addEventListener("mouseleave", () => {
```

### [Crystal Parallax V2](https://codepen.io/Tibixx/pen/WNVJMyP)

on scroll: div.icon-wrap: transform+opacity+top | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · canvas 2D · requestAnimationFrame

```css
#overlay { position: absolute; top:0 }
#bg_glow { position: absolute; top:0 }
.heading { margin-bottom: 0.5em; margin-top: 0 }
.heading { // margin-bottom: 0.3em }
.crop-primary::before { margin-bottom: calc(var(--dynamic-top-crop) * -1em + var(--top-adjustment)) }
.crop-primary::after { margin-top: calc(var(--dynamic-bottom-crop) * -1em + var(--bottom-adjustment)) }
.crop-secondary::before { margin-bottom: calc(var(--dynamic-top-crop) * -1em + var(--top-adjustment)) }
.crop-secondary::after { margin-top: calc(var(--dynamic-bottom-crop) * -1em + var(--bottom-adjustment)) }
.canvas-wrap { position: relative }
&:hover { transform: scale(1.1) }
.icon-temporary { animation: blink 2s ease .5s infinite, fadeOut 2s ease 7.5s infinite }
50% { opacity: 0 }
```

```js
requestAnimationFrame(render)
```

### [Parallax card](https://codepen.io/gorgonfreeman/pen/YzmLxGK)

on scroll: div.card: transform+top ×5 | on hover of div.card: div.card: transform+top ×5 | made with: 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking

```css
._parallax { transform: perspective(var(--perspective)) rotateX(var(--rotate_x)) rotateY(var(--rotate_y)) }
```

```js
style.setProperty('--translate_x', `${ x }px`)
style.setProperty('--translate_y', `${ y }px`)
addEventListener('mousemove', e => throttle(25, trackCursor, e))
style.setProperty('--perspective', `${ perspective }px`)
style.setProperty('--rotate_x', `${ rotationX }deg`)
style.setProperty('--rotate_y', `${ rotationY }deg`)
```

### [The Lost Boys](https://codepen.io/lauramaror/pen/rNXpeKG)

held: fixed div | made with: position: fixed

```css
.floating-el { position: absolute }
#level1-bg { bottom: 0; position: fixed }
#the-lost-boys > div:not(#level1-bg) { position: absolute; top: 0 }
```

### [Parallax Effect](https://codepen.io/RicardoYare/pen/bGXqmWK)

on scroll: img.: transform+top ×6, div.: transform+top ×3 | on hover of img.: img.: transform ×6, div.: transform ×2, div.: transform+top ×2 | made with: @keyframes · transition · scroll listener

```css
#cap6 { filter: blur(1.5px) }
#sun { filter: blur(2px) }
#cap5 { filter: blur(1px) }
#skyDay { position: absolute; top: 0%; transition: all 1s }
#sun { position: absolute; top: 25%; transition: all 0.3s }
img { position: absolute; top: 0%; transition: all 0.3s }
#skyNight { position: absolute; top: 100%; transition: all 0.3s }
#dayText { position: absolute; top: 30%; animation: floating 3s infinite }
0% { transform: translateY(0%) }
50% { transform: translateY(20%) }
100% { transform: translateY(0%) }
#cap1n { top: 30% }
```

```js
addEventListener("scroll", () => {
```

### [bike ride](https://codepen.io/barthendrix/pen/ExqZvzx)

held: fixed svg.[object | on scroll: g.[object: transform+top ×11, g.[object: transform ×6 | made with: position: fixed · transition · custom properties driven by JS · GSAP

```css
.artwork { position: fixed; top: 0 }
.controls { --controls-position: calc((var(--controls-value) * 1%) - calc(var(--controls-diameter) * calc(var(--controls-value) * 0.01))); position: absolute; inset: auto 0 3vh; opacity: 0 }
.controls--active { transition: opacity 1s ease-out; opacity: 1; transform: translate3d(0, 0, 0) }
.controls__slider { position: relative }
.controls__graphic { position: absolute; inset: calc(var(--controls-diameter) * 0.3) 0; box-shadow: 0 1px 1px rgba(0, 0, 0, 0.07) inset, 0 2px 2px rgba(0, 0, 0, 0.07) inset, 0 4px 4px rgba(0, 0, 0, 0.07) inset, 0 8px 8px rgba(0, 0, 0, 0.07)  }
.controls__handle { position: absolute; top: 50%; transform: translate3d(0%, -50%, 0); box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1), 0 2px 2px rgba(0, 0, 0, 0.1), 0 4px 4px rgba(0, 0, 0, 0.1) }
.controls__indicator { position: absolute; inset: 20%; box-shadow: 0 1px 1px rgba(0, 0, 0, 0.07) inset, 0 2px 2px rgba(0, 0, 0, 0.07) inset, 0 4px 4px rgba(0, 0, 0, 0.07) inset, 0 8px 8px rgba(0, 0, 0, 0.07) inset, 0 -1px 1px rgba(255, 255, 25 }
.controls__input { position: absolute; inset: 0; opacity: 0 }
.controls__output { position: absolute; transform: translateX(-50%); bottom: calc(100% + 0.6em); box-shadow: 0 1px 1px rgba(0, 0, 0, 0.07) inset, 0 2px 2px rgba(0, 0, 0, 0.07) inset, 0 4px 4px rgba(0, 0, 0, 0.07) inset, 0 8px 8px rgba(0, 0, }
.controls__output::before { position: absolute; inset: 0; opacity: calc(var(--controls-value) * 0.5%); box-shadow: 0 0 1px 1px currentColor, 0 0 4px 2px currentColor, 0 0 8px 4px currentColor, 0 0 16px 8px currentColor }
```

```js
gsap.registerPlugin(MotionPathPlugin)
gsap.timeline()
gsap.timeline({
gsap.timeline({ duration: 100 })
style.setProperty('--controls-value', 50)
style.setProperty('--controls-value', sliderValue)
```

### [Play with Perspective](https://codepen.io/riochandra/pen/poMNMXY)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
article { perspective: 600px }
section { position: relative }
> div { position: absolute; inset: 0px }
.background { transform: translateZ(-100px) scale(3); background-position: center }
.container { position: relative }
.info { position: relative }
.image { position: relative }
&:hover { transition: all 0.3s ease-in; transform: translateZ(40px) rotateY(0deg) }
&:hover { transition: all 0.3s ease-in; transform: translateZ(40px) rotateY(0deg) }
```

### [Untitled](https://codepen.io/nami1021/pen/abeBLxE)

held: fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start, fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start | on scroll: div.box: transform+top | made with: GSAP

```css
.img { padding-top: 50% }
```

```js
gsap.to(target,{y:-100,scale:1,autoAlpha: 1,
```

### [Add smooth scrolling navigation with parallax sections](https://codepen.io/noir-specter/pen/oNKLmVm)

made with: position: fixed

```css
header { position: fixed }
.parallax { background-position: center }
.content h2 { margin-top: 0 }
```

### [Basic Parallax Effect with CSS](https://codepen.io/noir-specter/pen/jOgrddB)

made with: nothing recognised — read the code

```css
.parallax { background-position: center }
```

### [3D Parallax](https://codepen.io/lucasfernandodev/pen/QWeWLVL)

on scroll: div.card: transform | on hover of div.card: div.card: transform | made with: position: fixed · transition · clip-path · backdrop-filter · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
body { background-position: center; position: relative }
body::before { position: fixed; backdrop-filter: blur(12px) }
.container { position: relative; perspective: 1000px }
.card { position: relative; transition: transform 0.1s ease }
.box { position: absolute; box-shadow: -5px 5px 10px ##44b09e27 }
.box::before { box-shadow: inset 2px -2px 3px #99d; opacity: 0.8; position: absolute; top: 50%; transform: translate(-50%, -50%); clip-path: polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 1 }
.box:nth-child(2)::before { clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%) }
.box:nth-child(3)::before { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%) }
.box:nth-child(4)::before { clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%) }
.box:nth-child(5)::before { opacity: 0.5 }
.box:nth-child(1) { inset: 20px; transform: translate3d(0, 0, 40px) }
.box:nth-child(2) { inset: 40px; transform: translate3d(0, 0, 80px) }
```

```js
addEventListener('mousemove', (e) => {
addEventListener('mouseleave', () => {
```

### [CSS Only - Masking on scroll](https://codepen.io/pixelgridui/pen/PoMYjrb)

held: fixed div.section-inner, fixed div.section-inner, fixed div.section-inner, fixed div.pp-widget, fixed button.pp-reopen | on scroll: span.pp-reopen-dot: transform+opacity | on hover of img.: span.pp-reopen-dot: transform+opacity+top | made with: position: fixed · clip-path

```css
.section-wrapper { position: relative }
.section { position: relative }
.section-heading { text-transform: uppercase }
.section-container { position: absolute; top: 0; -webkit-clip-path: inset(0px 0px 0px 0px); clip-path: inset(0px 0px 0px 0px) }
.section-inner { position: fixed; inset: 0%; top: 0 }
.section-inner:before { position: absolute; top: 40px }
```

### [Image scaling inside a wrapper with GSAP](https://codepen.io/lwekuiper/pen/jOjjjKz)

on hover of li.w-[512px]: div.w-full: transform+top, img.scale-[1.02]: transform+top | made with: GSAP

```js
gsap.timeline()
```

### [Creative Food Carousel](https://codepen.io/pixelgridui/pen/VwJJxvp)

held: fixed div.pp-widget, fixed button.pp-reopen | on scroll: div.food-slider-title: transform ×3, div.food-slider-title-text: color ×2, img.: transform+top ×2, div.swiper-pagination-bullet: opacity ×2, div.swiper: background, div.swiper-wrapper: transform | on hover of img.: div.food-slider-title: transform ×2, div.swiper: background, div.swiper-wrapper: transform, div.food-slider-title-text: color, img.: transform+top, span.pp-reopen-dot: transform+opacity+top | made with: transition · :hover · custom properties driven by JS · requestAnimationFrame

```css
:root { --food-slider-button-side-offset: 32px; --food-slider-button-mobile-side-offset: 24px; --food-slider-button-mobile-bottom-offset: 16px }
html, body { position: relative }
.food-slider .swiper { transition: 1s background-color 1.3s }
.food-slider-scale { position: absolute; transform: scale(0.6); transition-property: transform; opacity: 0.9 }
.food-slider-scale img { transform: scale(1) translate(50%); transition-property: transform }
.food-slider-button { transition: 0.5s; position: absolute; top: 50%; transform: translateY(-50%) }
.food-slider-button svg { transition: 0.5s }
.food-slider-button .food-slider-svg-circle-wrap { transition: 0.5s; opacity: 1 }
.food-slider-button circle { transition: 0.5s; opacity: 1 }
.food-slider-button .food-slider-svg-arrow { transition: 0.5s; transform: rotateY(180deg) translate(-55px, 36.1px) scale(1.75) }
.food-slider-pagination { padding-bottom: 20px }
.food-slider-pagination .swiper-pagination-bullet:not(.swiper-pagination-bullet- { opacity: 0.5 }
```

```js
requestAnimationFrame(() => {
style.setProperty("--progress", 1 - progress)
```

### [recursive squares tilting parallax cursor portal effect](https://codepen.io/aosceola56/pen/yLdwJGY)

on scroll: div.square: transform+shadow+top ×5, div.square: transform+shadow | made with: transition · :hover · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.square { transition: box-shadow 0.6s ease-out }
.square:hover .square, .square:hover #lastSquare { transform: translateZ(-500px) !important }
.square:hover .square, .square:hover { box-shadow: inset 0 0 30px 10px gray }
body { background-position: 50% 30% }
```

```js
addEventListener("mousemove", parallax)
addEventListener("mouseleave", event => {
```

### [CSS Scroll Wacher](https://codepen.io/tkwebreform/pen/ExBpNbE)

held: fixed div.scroll-watcher | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · @keyframes · clip-path · mask

```css
.scroll-watcher { position: fixed; top: 0; scale: 0 1; animation: scroll-watcher linear; animation-timeline: scroll() }
to { scale: 1 1 }
.css-fade-in { animation: fade-in linear; animation-timeline: view(90vh 0) }
from { scale: .3; opacity: 0; transform: translateY(20vh) }
to { scale: 1; opacity: 1; transform: translateY(0vh) }
@keyframes scroll-watcher animates scale
@keyframes fade-in animates scale, opacity, transform
```

### [Button with Ray Tracing ON](https://codepen.io/Juxtopposed/pen/NWZYNKp)

on scroll: button.: shadow+top | on hover of button.: button.: shadow | made with: mix-blend-mode · GSAP · pointer / mouse tracking

```css
button { box-shadow: inset 0 -4px 1px 1px rgba(0, 0, 0, 0.3), inset var(--x1) var(--y1) 8px rgba(255, 255, 255, 0.25), inset var(--x2) var(--y2) 20px rgba(255, 255, 255, 0.2), var(--x1) var(--y1) 12px rgba(0, 81, 167, 0.15), var( }
button::before { position: absolute }
button:active { box-shadow: inset var(--x1) var(--y1) 8px rgba(255, 255, 255, 0.1), inset var(--x2) var(--y2) 20px rgba(255, 255, 255, 0.1), 0 3px 10px rgba(0, 47, 96, 0.3), inset 0 3px 8px 1px rgba(21, 108, 199, 1) }
#light { position: absolute; padding-top: var(--y6) }
#light::before { position: absolute; mix-blend-mode: plus-lighter; filter: blur(100px); -webkit-filter: blur(100px); opacity: 20% }
```

```js
addEventListener("mousemove", (event) => {
gsap.to(document.documentElement, {
```

### [parallax scroll effect with GSAP](https://codepen.io/vii120/pen/gONoWov)

on scroll: div.col: transform+top ×5, div.link: transform+opacity+top ×3 | made with: GSAP · ScrollTrigger

```css
.img-wrapper .inner { transform: rotate(15deg) }
```

```js
gsap.registerPlugin(ScrollTrigger)
scrollTrigger: { trigger: '.img-wrapper', start: 'top center', end: 'bottom top', scrub: true, }
gsap.fromTo(col, ...getScrollConfig(-val, val))
gsap.from(link, {
scrollTrigger: { trigger: 'footer', start: 'top 75%', end: 'center center', scrub: true, }
```

### [CSS only parallax #2024](https://codepen.io/DenDionigi/pen/jOjGpga)

held: sticky figure.image-container, sticky figure.image-container, sticky figure.image-container | made with: position: sticky · @keyframes · :hover · prefers-reduced-motion

```css
:root { --scale: 0.3 }
:root { --scale: 0 }
.page-title::after { opacity: 0; transform: translateY(-24px); -webkit-animation: fadein 800ms 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; animation: fadein 800ms 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards }
.section { transform-origin: center top; transform: scaleY(calc(1 - var(--scale))) }
.section > * { transform-origin: center top; transform: scaleY(calc(1 / (1 - var(--scale)))) }
.content { position: relative }
.content > * + * { margin-top: 2rem }
.image-container { position: sticky; top: 0 }
.image-container img { position: absolute; top: 0 }
.image-container::after { position: absolute; bottom: 0 }
to { opacity: 1; transform: translateY(0) }
to { opacity: 1; transform: translateY(0) }
```

### [React GSAP & Tailwind Parallax](https://codepen.io/agreloe-the-looper/pen/jOjLZQq)

made with: GSAP · ScrollTrigger

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to(element, {
scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: true }
```

### [parallax scrolling text animation - scss + js](https://codepen.io/davtwd/pen/GRbEObE)

on scroll: h1.header-wild-world: transform+top ×6 | made with: :hover · :has() · GSAP · scroll listener

```css
.bg-parallax { position: relative }
.bg-parallax::after { position: absolute; top: 0; bottom: 0 }
.text-parallax > h1 { position: absolute; transform: translateX(-50%) }
.text-parallax > h1:nth-child(1) { transform: translate(-50%, -100%) }
.text-parallax > h1:nth-child(2) { transform: translateX(-50%) }
```

```js
addEventListener('scroll', () => {
```

### [horizontal parallax](https://codepen.io/vcumatoze/pen/gONLOoZ)

made with: 3D (perspective / preserve-3d)

```css
#container .box { position: absolute; top: 0; bottom: 0 }
#container .box > div { position: absolute; top: 50% }
#container { transform: rotate(270deg) translateX(-100%); position: absolute; perspective: 1px }
#container2 { transform: rotate(90deg) translateY(-100vh) }
.one { transform: translateZ(0); scale: 1 }
.two { transform: translateZ(-1px) translateX(30%); scale: 2 }
.three { transform: translateZ(-4px) translateX(70%); scale: 5 }
```

### [Blur Card with Parallax](https://codepen.io/khesehang-samsohang/pen/zYVKoZY)

made with: position: fixed · :hover · :focus-visible · mask · GSAP · pointer / mouse tracking

```css
body::before { position: fixed; mask: linear-gradient(-15deg, transparent 60%, white); top: 0 }
article { position: relative }
article > img { position: absolute; top: 0; translate: -50% 0; object-position: center 43% }
article > img:first-of-type { filter: saturate(1.5) brightness(0.9); object-position: calc(-50% + (var(--x) * 30px)) calc(43% + (var(--y) * -20px)) }
article > img:last-of-type { object-position: calc(-50% + (var(--x) * 40px)) calc(43% + (var(--y) * -40px)) }
article h3 { position: absolute; top: 6%; translate: -50% 0; text-transform: uppercase; translate: calc(-50% + (var(--x) * -30px)) calc(var(--y) * -20px) }
.content { position: absolute; bottom: 0; padding-bottom: .5rem }
.content p:first-of-type::after { position: absolute; top: 1rem; translate: -50% 0 }
.content p:last-of-type { opacity: 0.8 }
.blur { position: absolute; inset: 60% 0 -26% 0; filter: blur(20px) }
.blur img { object-position: calc(-50% + (var(--x) * 40px)) calc(47.5% + (var(--y) * -40px)); translate: -50% 0; position: absolute; bottom: 25%; mask: radial-gradient(50% 100% at 50% 90%, white 50%, transparent); filter: saturate(1 }
.bear-link { position: fixed; top: 1rem; opacity: 0.8 }
```

```js
addEventListener('pointermove',UPDATE)
```

### [floating glass window test tilt.js svg grain parallax effect (unfinished)](https://codepen.io/aosceola56/pen/zYVKOYg)

on scroll: div.: transform, div.: opacity, div.js-tilt-glare-inner: opacity+top | on hover of button.: div.: transform+top, div.js-tilt-glare-inner: transform+opacity+top | made with: @keyframes · transition · :hover · mix-blend-mode · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
canvas { position: absolute; top: 0; filter: blur(10px); animation: bannermove 60s linear infinite }
0% { background-position: 0 0 }
100% { background-position: 100vw 100vh }
#window { will-change: transform; transform: perspective(1000px) }
#windowBackground { position: absolute; opacity: 20%; mix-blend-mode: color-burn; transition: opacity 0.3s cubic-bezier(.17,.84,.44,1) }
#windowBackground:hover { opacity: 25% }
#window-content:hover { transform: translateZ(30px); transition: all 0.3s cubic-bezier(.17,.84,.44,1) }
@keyframes bannermove animates background-position
```

```js
addEventListener("mousemove", parallax)
```

### [Simple parallax scroll](https://codepen.io/alexflp/pen/ExBywoy)

on scroll: img.: transform+top ×4 | on hover of li.: li.: filter+top | made with: transition · :hover · backdrop-filter · scroll listener

```css
header { position: absolute; backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px) }
ul { padding-top: 30px }
li { text-transform: uppercase; border-bottom: 3px solid transparent; transition: 500ms }
li:hover { scale: 1.5; filter:drop-shadow(0 10px 10px #fff ); border-bottom: 3px solid }
img { position: absolute }
.container { position: relative }
img:nth-child(2) { top:0; bottom: -100px }
img:nth-child(3) { top: -10px }
```

```js
addEventListener('scroll', function() {
```

### [Simple parallax scroll](https://codepen.io/alexflp/pen/zYVBEpq)

on scroll: img.: transform+top ×4 | on hover of li.: li.: filter+background+top | made with: transition · :hover · backdrop-filter · scroll listener

```css
header { position: absolute; backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(15px) }
ul { padding-top: 30px }
li { text-transform: uppercase; border-bottom: 3px solid transparent; transition: 500ms }
li:hover { scale: 1.5; filter:drop-shadow(0 10px 8px #ffffff ); border-bottom: 3px solid }
img { position: absolute }
.container { position: relative }
img:nth-child(2) { bottom: -100px }
img:nth-child(3) { top: -10px }
img:nth-child(4) { bottom: -420px }
```

```js
addEventListener('scroll', function() {
```

### [Simple Smooth Scroll Effect with Parallax Header](https://codepen.io/MerestQ/pen/WNqwwQm)

held: fixed main, fixed h1 | on scroll: main.: transform+top, h1.: transform+top | made with: position: fixed · scroll listener · requestAnimationFrame

```css
main { position: fixed; top: 0 }
#parallaxHeader { position: fixed; top: 50%; transform: translate(-50%, -50%); text-transform: uppercase }
```

```js
requestAnimationFrame(render)
addEventListener("scroll", easeScroll)
addEventListener("wheel", easeScroll)
```

### [MBB-ParallaxStepper](https://codepen.io/ogerly/pen/WNqQxEX)

held: fixed div.fixed-bottom | made with: position: fixed · transition · :hover · backdrop-filter

```css
.scroll-container { position: relative }
.parallax-layer { position: absolute; top: 0; transition: transform 0.5s ease }
.interactive-layer { position: absolute; top: 0 }
.stepper-box { backdrop-filter: blur(10px); box-shadow: 0 0 20px rgba(255, 255, 255, 0.1) }
h2 { margin-bottom: 20px }
input { margin-bottom: 20px }
#form-data-display { position: fixed; bottom: 0 }
.category-box { transition: all 0.3s ease }
.category-box img { margin-bottom: 10px }
.service-option { margin-bottom: 10px }
.service-grid { margin-bottom: 20px }
.service-box { transition: all 0.3s ease }
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

### [GSAP scrollTrigger](https://codepen.io/nami1021/pen/gONOZRy)

held: fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start, fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start | on scroll: div.box: transform+opacity+top | made with: GSAP

```css
.box { scale: 0.75; opacity: 0 }
```

```js
gsap.to(target,{y:-100,scale:1,autoAlpha: 1,
```

### [Scroll-Driven - Vertigo Effect - CSS](https://codepen.io/josetxu/pen/jOogdgR)

held: fixed div.front-box, fixed div.back-box, fixed div.scroller | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · mix-blend-mode · 3D (perspective / preserve-3d)

```css
.front-box, .back-box { position: fixed; perspective: 400px }
.front, .back { position: absolute; top: 0; animation: go-front linear both; animation-timeline: scroll(root) }
.front-box .front { background-position: 100% 50% }
.back-box .back { background-position: 50% 70%; animation-name: go-back }
0% { transform: translateZ(0px) }
100% { transform: translateZ(100px) }
0% { transform: translateZ(150px); filter: blur(0px) }
100% { transform: translateZ(10px); filter: blur(5px) }
.scroller { position: fixed; top: calc(50vh - 15px); top: 90px; mix-blend-mode: difference }
.scroller:before { position: absolute; bottom: 0 }
.scroller span { position: absolute; top: -50px }
.scroller span + span { top: inherit; top: 70px }
```

### [Untitled](https://codepen.io/N-R-the-bashful/pen/LYovqLO)

made with: transition · :hover

```css
.cont { position: relative }
.slider { position: relative; transform: translate3d(0, 0, 0); will-change: transform }
.slider.animation { transition: transform 750ms ease-in-out }
.slider.animation .slide__darkbg { transition: transform 750ms ease-in-out }
.slider.animation .slide__text { transition: transform 750ms ease-in-out }
.slider.animation .slide__letter { transition: transform 750ms ease-in-out }
.slide { position: absolute; top: 0 }
.slide__darkbg { position: absolute; top: 0; transform: translate3d(0, 0, 0); will-change: transform }
.slide__text-wrapper { position: absolute }
.slide__letter { position: absolute; top: 0; transform: translate3d(0, 0, 0); will-change: transform }
.slide__text { text-transform: uppercase; transform: translate3d(0, 0, 0); will-change: transform }
.slide--1__darkbg { background-position: 0px center, 0px center; transform: translate3d(0, 0, 0); will-change: transform }
```

### [Cursor Parallax Effect](https://codepen.io/mustafauncuoglu/pen/vYwjzqW)

held: fixed div, fixed div, fixed div.site-logo | on scroll: div.: transform+top ×2 | made with: position: fixed · transition · :hover · backdrop-filter · GSAP · pointer / mouse tracking

```css
#magic-cursor { position: absolute }
#ball { position: fixed; top: 0; transform: translate(-50%, -50%); opacity: 1 }
#dot { position: fixed; top: 0; transform: translate(-50%, -50%); opacity: 1; backdrop-filter: blur(2px) brightness(1.5); -webkit-backdrop-filter: blur(2px) brightness(1.5) }
.button-wrap { position: absolute; bottom: 50px }
.icon-wrap { position: relative }
.button-text span { position: relative; -webkit-transition: -webkit-transform 0.2s; transition: transform 0.2s }
.button-text span::before { position: absolute; top: 100%; -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0) }
.button-wrap:hover .button-text span { -webkit-transform: translateY(-100%); transform: translateY(-100%) }
.site-logo { position: fixed; top: 50px }
```

```js
addEventListener("mousemove", mouseMove)
gsap.to(dot, { duration: dotRatio, x: mouse.x, y: mouse.y })
addEventListener("mouseenter", function () {
gsap.to(this, { duration: 0.3, scale: 2 })
gsap.to(ball, { duration: 0.3, scale: 2 })
addEventListener("mouseleave", function () {
gsap.to(this, { duration: 0.3, scale: 1 })
gsap.to(ball, { duration: 0.3, scale: 1 })
```

### [Untitled](https://codepen.io/tommyho/pen/vYwWNdp)

held: fixed nav.navbar, fixed a.back-to-top | on hover of li.: a.: background | made with: position: fixed · transition · :hover · scroll listener · requestAnimationFrame

```css
nav { position: fixed; top: 0; transition: top 1.0s }
.bottom { margin-top: 3000px }
.back-to-top { position: fixed; bottom: 20px; opacity: 0.7; transition: opacity 0.3s }
.back-to-top:hover { opacity: 1 }
```

```js
requestAnimationFrame(animation)
addEventListener('scroll', () => {
```

### [Creative Background Parallax Slider](https://codepen.io/CreativeSalahu/pen/bGyYdKY)

held: fixed a.coffee-button | on hover of div.creative-btns--wrap: div.swiper-slide: opacity ×2 | made with: position: fixed · @keyframes · transition · :hover

```css
.creative-bg--slider { position: relative }
.creative-bg--slider .creative-slider--wrap { position: absolute; top: 0 }
.creative-slider--wrap .swiper-slide .slide-bg { background-position: center }
.creative-bg--slider .creative-slider--wrap .slide-bg:before { position: absolute; top: 0 }
.creative-bg--slider .slider-content { position: absolute; top: 0 }
.content-column .slide-subheading { margin-top: 0; text-transform: uppercase; transition: opacity 0.5s ease, filter 0.5s ease; animation: fadeInUp 1s ease forwards; opacity: 0; filter: blur(4px); animation-delay: 0.3s }
.content-column .slide-heading { margin-top: 0; margin-bottom: 50px; opacity: 0; filter: blur(4px); transition: opacity 0.5s ease, filter 0.5s ease; animation: fadeInUp 1s ease forwards; animation-delay: 0.5s }
.content-column .creative-btns--wrap { margin-top: 20px; transition: opacity 0.5s ease, filter 0.5s ease; animation: fadeInUp 1s ease forwards; opacity: 0; filter: blur(4px); animation-delay: 0.7s }
.creative-btns--wrap .creative-btn, .creative-btns--wrap .creative-btn.btn-fill { text-transform: uppercase }
.creative-btns--wrap .creative-btn .btn-animate-y { position: relative }
.creative-btns--wrap .creative-btn .btn-animate-y-1 { transition: all .37s cubic-bezier(.15,.7,.78,1), opacity .37s linear }
.creative-btns--wrap .creative-btn .btn-animate-y-2 { position: absolute; top: 0; opacity: 0; transform: translate(0, 100%); transition: all .37s cubic-bezier(.15,.7,.78,1), opacity .37s linear }
```

### [Horizontal Scroll à la Willy Brauner](https://codepen.io/creativeocean/pen/Baewmpq)

on scroll: div.item: transform ×7, div.txt: transform ×6, img.: transform ×3, div.thumb: transform ×2, div.overlay: transform ×2, div.hit: transform ×2 | on hover of img.: div.item: transform ×7, div.txt: transform ×5, div.thumb: transform+top ×2, img.: transform+top ×2, div.txt: transform+top ×2, h2.item-head: color+top ×2 | made with: mix-blend-mode · GSAP · ScrollTrigger

```css
main { position:absolute }
.item { position:relative }
.overlay { position:absolute; top:-75px; opacity:0; mix-blend-mode:overlay }
.item-info { opacity:0.2 }
.hit { position:absolute; top:-20px }
```

```js
gsap.fromTo(img, {xPercent:-18},{
scrollTrigger:{ trigger:item, start:'0 100%', end:'100% 0', horizontal: true, scrub:0 }
gsap.to(overlay, {opacity:0.5})
gsap.to(img, {duration:0.3, scale:1.2, overwrite:'auto', ease:'back'})
gsap.to(item.querySelector('h2'), {color:'rgb(160,180,225)'})
gsap.to(item.querySelector('.item-info'), {opacity:0.6})
gsap.to([thumb,txt], {ease:'power3', yPercent:(i)=>[-6,2][i], overwrite:'auto'})
gsap.to(overlay, {duration:0.7, ease:'power2', x:xp*4, y:yp*4})
```

### [Mouse Parallax Animation - React](https://codepen.io/bigapplemonkey/pen/PovJqPW)

on scroll: div.layer: transform+top | made with: pointer / mouse tracking

```css
.label { text-transform: uppercase }
```

```js
addEventListener("mousemove", parallax)
```

### [Marquee Parallax Mouse Animation](https://codepen.io/bigapplemonkey/pen/Jjqrope)

on scroll: img.layer: transform+top ×2, span.: transform+top | on hover of img.layer: img.layer: transform+top ×2, span.: transform | made with: @keyframes · pointer / mouse tracking

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

### [Parallax Carousel](https://codepen.io/waseem-polus/pen/XWwazYR)

on hover of button.arrow: img.: transform+top | made with: transition · :hover · custom properties driven by JS

```css
.carousel { position: relative; box-shadow: 0px 4px 15px -1px rgba(0, 0, 0, 0.4) }
.arrow { position: absolute; top: 50%; transform: translatey(-50%) }
.arrow > img { transition: all 400ms ease-in-out }
.back-arrow:hover > img { transform: translateX(-30%) scale(1.4) }
.next-arrow:hover > img { transform: translateX(30%) scale(1.4) }
.slide { position: absolute; top: 0; bottom: 0; transition: all ease-in-out var(--duration) }
.overlay { position: absolute }
.slide-info { position: absolute; bottom: 1rem; transition: all ease-in-out var(--duration) }
.slide:not(.showcase) > .slide-info { opacity: 0 }
.slide-bg { position: relative; transform: translatex(-50%) }
```

```js
style.setProperty("--duration", `${switchSlideDuration}ms`)
```

### [cpc-smooth-scrolling](https://codepen.io/mylilhelper123/pen/eYaEZJX)

on scroll: div.: transform+top | made with: prefers-reduced-motion · GSAP · ScrollTrigger · pointer / mouse tracking

```css
.image { position: absolute; background-position: 50% 50% }
#satellite { position: absolute; background-position: center }
```

```js
gsap.registerPlugin(Observer)
gsap.registerPlugin(TextPlugin
gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 3, ease: "power4.inOut", overwrite:true } })
gsap.fromTo(panels[0], {y: -window.innerHeight * 2}, {y: 0, duration: 2, ease: "power4.out", onComplete: () => {
gsap.fromTo(panels[0].children, {opacity: 0}, {opacity: 1, ease: "power4.inout", duration: 4})
gsap.fromTo(panels[0], {y: window.innerHeight * 2}, {y: 0, duration: 2, ease: "power4.out", onComplete: () => {
gsap.to(satellite, {x: scrollValue, y: Math.abs(scrollValue - (window.innerWidth/2))/10, duration: 1, overwrite: true, ease: "po
gsap.to(panels[0].children[1], {
```

### [CSS Parallax Scrolling](https://codepen.io/Diana-Moretti/pen/zYQzjEy)

held: fixed header | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · prefers-reduced-motion

```css
header { box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2); position: fixed; opacity: 0.8; top: 0 }
section { background-position: center; animation: linear move-background; animation-duration: 1s; animation-timeline: scroll(root block) }
from { background-position: 0% 0% }
to { background-position: 100% 100% }
@keyframes move-background animates background-position
```

### [Parallax Scrolling Effect](https://codepen.io/Ngawang-Choeden/pen/oNRwoaQ)

made with: nothing recognised — read the code

```css
.parallax-section { background-position: center }
```

### [CPChallenge - Smooth Scrolling](https://codepen.io/tommyho/pen/qBGmqpX)

held: fixed nav, fixed a.back-to-top | on hover of li.: a.: background | made with: position: fixed · transition · :hover

```css
nav { position: fixed; top: 0 }
.parallax { background-position: center }
.back-to-top { position: fixed; bottom: 20px; opacity: 0.7; transition: opacity 0.3s }
.back-to-top:hover { opacity: 1 }
```

### [Parallax Effect on Dragging Cards](https://codepen.io/01kingmaker01/pen/jOoWoKe)

made with: position: fixed · transition · :hover · backdrop-filter · scroll listener · Web Animations API (.animate)

```css
#image-track { position: absolute; top: 50%; transform: translate(0%, -50%) }
#image-track > .image { object-position: 100% center }
#source-link { bottom: 60px }
.meta-link { backdrop-filter: blur(3px); bottom: 10px; box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1); position: fixed; transition: background-color 400ms, border-color 400ms }
```

```js
.animate( { transform: `translate(${nextPercentage}%, -50%)` },
.animate( { objectPosition: `${100 + nextPercentage}% center` },
addEventListener("scroll", function () {
```

### [Interactive Snowfall: Oscillating 8-Bit Snowflakes with Parallax Effect](https://codepen.io/machinecode/pen/OJYVEdq)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
body { position: relative }
h1 { position: absolute }
```

```js
addEventListener("mousemove", (event) => {
requestAnimationFrame(animate)
```

### [Cursor Parallax Mix-Blend-Mode Mouse Effect](https://codepen.io/mustafauncuoglu/pen/bGJXrZN)

held: fixed div.dot | on hover of a.hover-this: span.: transform, div.dot: transform+top | made with: position: fixed · transition · :hover · mix-blend-mode · pointer / mouse tracking

```css
.hover-this { transition: all 0.3s ease }
span { transition: transform 0.1s linear }
.dot { position: fixed; mix-blend-mode: difference; transition: transform 0.3s ease }
.hover-this:hover ~ .dot { transform: translate(-50%, -50%) scale(8) }
nav { top: 30% }
```

```js
addEventListener("mousemove", animateit))
addEventListener("mouseleave", animateit))
addEventListener("mousemove", editCursor)
```

### [Parallax with Video, Nav & Animations](https://codepen.io/Fotek/pen/JjVVqJj)

held: fixed div.sidebar, fixed div.scroll-down | on hover of a.active: a.active: background, div.scroll-down: transform+top | made with: position: fixed · @keyframes · transition · :hover · 3D (perspective / preserve-3d) · scroll listener

```css
.bgimg-1, .bgimg-2, .bgimg-3, .bgimg-4 { position: relative; background-position: center }
.bgimg-1::before, .bgimg-2::before, .bgimg-3::before, .bgimg-4::before { position: absolute; top: 0 }
.bgimg-1::after, .bgimg-2::after, .bgimg-3::after, .bgimg-4::after { position: absolute; top: 0 }
#bgvideo { position: absolute; bottom: 0 }
.sidebar { position: fixed; top: 50%; transform: translateY(-50%) }
.sidebar a { transition: all 0.3s ease-in-out; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3) }
.content { position: relative }
.content-higher { position: relative; top: calc(30vh - 50%) }
.btn { text-transform: uppercase }
0% { opacity: 0; transform: translateZ(50px) scale(5.5) }
100% { opacity: 1; transform: translateZ(0) scale(1) }
:target .content { animation: zoom-drop 1s cubic-bezier(1, 1, 0, 1) forwards }
```

```js
addEventListener("scroll", highlightMenu)
```

### [Responsive Parallax Effect with Image Alternatives](https://codepen.io/jerora98/pen/wvZRpqy)

made with: nothing recognised — read the code

```css
.parallax-container { position: relative; background-position: center }
.background-image-1 { background-position: center right }
```

### [PARALLAX for only top block](https://codepen.io/kubris_pro/pen/NWmLpgZ)

made with: scroll listener

```css
h2 { text-transform: uppercase }
.hero { padding-top: 50px; top: 0 }
.second { padding-top: 50px }
```

```js
addEventListener("scroll", function () {
```

### [Disney MLP](https://codepen.io/jenaroc/pen/MWRXvvo)

on scroll: div.: transform+top ×5 | on hover of img.: div.: transform+top ×5 | made with: 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.images div { position: absolute; top: var(--top); transform: translate(calc(var(--move-x) * calc(var(--speed) * 1px)), calc(var(--page-y) * calc(var(--speed) * 1px))) rotate3d(calc(var(--move-x) * var(--speed)), calc(var(--page-y) *  }
.images div::before { background-position: 0px 0px,0px 0px,0px 0px,0px 0px; position: absolute; top: calc(var(--border-width) / -2) }
.images div:nth-child(1) { --top: 95px }
.images div:nth-child(2) { --top: 124px }
.images div:nth-child(3) { --top: 68px }
.images div:nth-child(4) { --top: 234px }
.images div:nth-child(5) { --top: 235px }
.images { position: relative }
body { --top: #124b60; --bottom: #070a14 }
```

```js
addEventListener("mousemove", (e) => {
```

### [Parallax v1- Fixed Background Parallax, No JavaScript](https://codepen.io/olgavegh/pen/qBwKjzp)

made with: nothing recognised — read the code

```css
body { text-transform: uppercase }
.section svg { position: absolute; top: 0.5em }
.section:nth-child(2) { background-position: center }
.section:nth-child(4) { background-position: center }
```

### [Parallax v2 - Overlapping Fixed Text Parallax, No JavaScript](https://codepen.io/olgavegh/pen/zYXaKgm)

held: fixed div.fixed, fixed div.fixed, fixed div.fixed, fixed div.fixed | made with: position: fixed

```css
body { text-transform: uppercase }
.section { position: absolute }
.section .fixed { position: fixed; top: 50%; transform: translate(-50%, -50%) }
.section svg { padding-top: 0.2em }
.section:nth-child(1) { top: 0vh }
.section:nth-child(2) { top: 95vh }
.section:nth-child(3) { top: 190vh }
.section:nth-child(4) { top: 285vh }
```

### [Parallax v1.2 - Fixed Background Effect](https://codepen.io/olgavegh/pen/jORxEzG)

made with: 3D (perspective / preserve-3d)

```css
html, body { text-transform: uppercase }
#first, #content { background-position: center }
#second { background-position: center }
.parallax { perspective: 1px; transform: translateZ(-1) }
.parallax h1, .parallax h2 { opacity: 0.7; transform: translateZ(-1px) }
```

### [Parallax button](https://codepen.io/vikashpatel/pen/wvZypyr)

on scroll: div.wrapper: transform+background+top | on hover of a.anchor: div.wrapper: transform+top | made with: transition · :hover · pointer / mouse tracking

```css
.wrapper { transition: all 0.3s ease }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseleave", () => {
```

### [CSS Parallax - Svg filter](https://codepen.io/wakana-k/pen/XWQZMeG)

held: fixed svg.[object | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · backdrop-filter · mix-blend-mode

```css
body { position: relative }
main { position: relative }
#gallery { position: relative }
.card, .card::after { background-position: center bottom var(--percent); -webkit-animation: parallax linear both; animation: parallax linear both; animation-timeline: view(); animation-range: entry 20% 50%; -webkit-animation-duration: 1ms; an }
from { --opacity: 1; background-position: center bottom var(--percent) }
to { --opacity: 0; background-position: center bottom 0% }
from { --opacity: 1; background-position: center bottom var(--percent) }
to { --opacity: 0; background-position: center bottom 0% }
.card.no-img * { mix-blend-mode: inherit }
.card h2 { margin-top: 100%; text-transform: capitalize }
.card * { mix-blend-mode: difference }
.card::before { position: absolute; top: 0; mix-blend-mode: darken }
```

### [CSS Parallax - vertical direction](https://codepen.io/wakana-k/pen/eYoVOwv)

made with: scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · mix-blend-mode

```css
body { position: relative }
main { position: relative }
#gallery { position: relative }
.card { background-position: center bottom var(--percent); -webkit-animation: parallax linear both; animation: parallax linear both; animation-timeline: view(); animation-range: cover; -webkit-animation-duration: 1ms; animation- }
to { background-position: center bottom 0% }
to { background-position: center bottom 0% }
.card h2 { text-transform: capitalize }
.card * { mix-blend-mode: difference }
.card::before { position: absolute; top: 0; mix-blend-mode: darken }
@keyframes parallax animates background-position
```

### [CSS Parallax - random direction](https://codepen.io/wakana-k/pen/MWRrMwJ)

made with: scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · mix-blend-mode

```css
body { position: relative }
main { position: relative }
#gallery { position: relative }
.card { --direction-y: bottom; background-position: var(--direction-x) var(--percent) var(--direction-y) var(--percent); -webkit-animation: parallax linear both; animation: parallax linear both; animation-timeline: view(); anima }
to { background-position: var(--direction-x) 0% var(--direction-y) 0% }
to { background-position: var(--direction-x) 0% var(--direction-y) 0% }
article:nth-child(7n of .card) { --direction-y: top }
article:nth-child(7n + 1 of .card) { --direction-y: bottom }
article:nth-child(7n + 2 of .card) { --direction-y: top }
article:nth-child(7n + 3 of .card) { --direction-y: bottom }
article:nth-child(7n + 4 of .card) { --direction-y: bottom }
article:nth-child(7n + 5 of .card) { --direction-y: top }
```

### [Parallax Confetti](https://codepen.io/gorgonfreeman/pen/ExJXVOg)

on scroll: div.confetti: transform+top | made with: custom properties driven by JS · scroll listener · pointer / mouse tracking

```css
.confetti { position: absolute; top: -100%; transform: translate(var(--translate_x), var(--translate_y)) }
.confetti:before, .confetti:after { position: absolute; top: -100% }
.confetti:before { transform: translate(calc(var(--translate_x) / 2), calc(var(--translate_y) / 2)) }
.confetti:after { transform: translate(calc(var(--translate_x) * 1.5), calc(var(--translate_y) * 2)) }
```

```js
style.setProperty('--translate_x', `100px`)
style.setProperty('--translate_y', `100px`)
style.setProperty('--translate_x', `${ x }px`)
style.setProperty('--translate_y', `${ y }px`)
addEventListener('mousemove', e => throttle(25, confettiParallax, e))
addEventListener('scroll', confettiParallax)
```

### [Parallax SVG Stars](https://codepen.io/TheBrutalTooth/pen/NWmjbvX)

on scroll: svg.[object: transform+top ×27, svg.[object: transform ×7 | on hover of a.otherstuff: svg.[object: transform+top ×28, svg.[object: transform ×6, a.otherstuff: opacity+color, img.: color | made with: @keyframes · transition · :hover

```css
.otherstuff { position: absolute; bottom: -2px; opacity: 0.25 }
span { position: relative; top: -3px }
.otherstuff:hover { opacity: 1; transition: color 0.2s linear, opacity 0.2s linear }
svg.star, svg.star1, svg.star2, svg.star3, svg.star4, svg.star5, svg.star6, svg. { position: absolute; top: -110px }
svg.star1 { top: 80px }
svg.star2 { top: 140px }
svg.star3 { top: 40px }
svg.star4, svg.star41, svg.star42, svg.star43, svg.star44, svg.star45, svg.star4 { position: absolute; top: 180px; opacity: 0.4 }
svg.star41 { top: 25% }
svg.star42 { top: 75% }
svg.star43 { top: 65% }
svg.star44 { top: 5% }
```

### [Parallax Scroll Landing Page](https://codepen.io/noirsociety/pen/ExJWGmL)

on scroll: li.layer: transform+top ×5 | made with: transition · :hover · scroll listener

```css
& li:first-of-type a { border-bottom: 2px solid var(--link) }
&:hover { border-bottom: 2px solid var(--link) }
```

```js
addEventListener('scroll',parallax,false)
```

### [Parallax Circles and Glassmorphism with Vue](https://codepen.io/ComputerK/pen/BaEWKrr)

on scroll: div.circle: transform+top ×3, div.glass-text: transform+top | made with: @keyframes · backdrop-filter · pointer / mouse tracking

```js
addEventListener("mousemove", this.dragging)
```

### [parallax](https://codepen.io/TuffyTitan/pen/JjzgXvO)

on scroll: div.background: transform | made with: backdrop-filter · pointer / mouse tracking

```css
.parallax-container { position: relative }
.parallax-background { position: absolute; top: 0; background-position: center; transform: scale(1.2) }
.search-container { position: absolute; top: 50%; transform: translate(-50%, -50%); backdrop-filter: blur(10px) }
```

```js
addEventListener("mousemove", function (e) {
```

### [navigation smooth animation parallax](https://codepen.io/PankajNamotra/pen/ZEPNRbB)

on hover of li.: li.: color ×4 | made with: transition · :hover

```css
body #main { position: relative }
body #main ul li { padding-bottom: 20px; transition: all ease-in-out 0.3s }
body #main .gradient { position: absolute; top: 0 }
body #main[data-indexes="0"] .gradient { background-position: 0% -25%; transition: all ease-in-out 0.3s }
body #main[data-indexes="1"] .gradient { background-position: 0% -50%; transition: all ease-in-out 0.3s }
body #main[data-indexes="2"] .gradient { background-position: 0% -75%; transition: all ease-in-out 0.3s }
body #main[data-indexes="3"] .gradient { background-position: 0% -100%; transition: all ease-in-out 0.3s }
body #main[data-indexes="0"] .background-image { transition: all ease-in-out 0.3s }
body #main[data-indexes="1"] .background-image { transition: all ease-in-out 0.3s }
body #main[data-indexes="2"] .background-image { transition: all ease-in-out 0.3s }
body #main[data-indexes="3"] .background-image { transition: all ease-in-out 0.3s }
#main .background-image { position: absolute; top: 0; opacity: 0.5; background-position: center }
```

### [Simple Parallax - HTML & CSS](https://codepen.io/chetanst/pen/YzgdoMj)

made with: nothing recognised — read the code

```css
section.first { background-position: center center }
section.second { background-position: center center }
section.third { background-position: center center }
section.fourth { background-position: center center }
```

### [Parallax simple vanilla js](https://codepen.io/giorgioGTelian/pen/PoLXddZ)

made with: GSAP · ScrollTrigger

```css
section { position: relative }
.bg { position: absolute; top: 0; background-position: center }
```

```js
gsap.fromTo(
scrollTrigger: { trigger: section, start: () => (i ? "top bottom" : "top top"), end: "bottom top", scrub: true, }
```

### [Parallax 3D Cards Carousel | swiper.js](https://codepen.io/TheMOZZARELLA/pen/OJqrvNo)

on scroll: figure.swiper-slide: transform+top ×10 | on hover of div.cardPopout: img.: transform ×2, figure.swiper-slide: transform, h4.subtitle: transform, div.swiper-slide-shadow-right: opacity | made with: transition · :hover

```css
.swiper .parallax-bg { position: absolute; top: -50%; background-position: top center }
.swiper .swiper-slide { position: relative }
.swiper .swiper-slide::before { position: absolute; bottom: 0; border-bottom: 1px dashed white; transition: all 0.3s ease }
.swiper .swiper-slide::after { position: absolute; top: 0; border-top: 1px solid white; transition: all 0.3s ease }
.swiper .swiper-slide:hover::before, .swiper .swiper-slide:hover::after { transition: all 0.3s ease }
.swiper .swiper-slide img { margin-bottom: 25px }
.swiper .swiper-slide a { position: relative; transition: all 0.6s ease !important }
.swiper .swiper-slide a:hover { transition: all 0.6s ease }
.swiper .swiper-slide a::after { position: absolute; bottom: 0; transition: all 0.6s ease }
.swiper .swiper-slide a:hover::after { transition: all 0.6s ease }
.swiper .swiper-slide a svg { transition: all 0.6s ease }
.swiper .swiper-slide a:hover svg { transition: all 0.6s ease }
```

### [Parallax Devices](https://codepen.io/gibsonmurray/pen/JjzmrWR)

on scroll: div.layer2: transform+top, svg.[object: transform+top, span.hw: transform+opacity+top, span.lets: transform+opacity+top, span.hf: transform+top, span.bc: transform+opacity+top | on hover of img.appleTV: svg.[object: transform+top | made with: backdrop-filter · 3D (perspective / preserve-3d) · GSAP

```css
> * { position: absolute }
span { position: absolute; bottom: 70px }
.mouse { position: absolute }
.arrows { position: absolute; transform: translateY(40px) }
.layer3 { bottom: -510px }
.hw { opacity: 0; position: absolute }
.home-bar { position: absolute; bottom: 10px }
.txt { position: absolute; opacity: 0 }
video { opacity: 0.7 }
.fingerprint { position: absolute }
.future { position: absolute; transform: translateY(160px) }
> * { position: absolute }
```

```js
scrollTrigger: { trigger: "body", scrub: 0.5, pin: true, end: "+=6500" // length of animation determined by length of scroll }
gsap.timeline().add(initAnimation).add(scroll)
```

### [Sunset](https://codepen.io/lucasfernandodev/pen/KKEBYoJ)

held: fixed div.base, fixed div.sky, fixed div.base, fixed div.base, fixed div.sky, fixed div.base, fixed div.base, fixed div.base, fixed div.water, fixed div.boat | on scroll: div.homes: transform ×5, div.light: opacity ×4, div.boat: transform | made with: position: fixed · @keyframes · clip-path · backdrop-filter

```css
.sky { position: fixed; top: 0px }
.sky.reflet { position: absolute; transform: rotate(180deg); filter: blur(10px); position: fixed; top: calc(70vh - 14px) }
.sun { backdrop-filter: blur(15px); opacity: 0.8; box-shadow: 0 0 116px #f7a21b55; position: absolute; bottom: -100px; transform: translateX(-50%) }
.homes { position: absolute; bottom: -15px }
.one { animation: moveLeft 100s linear }
.back { animation: moveLeft 200s linear }
.moreback { animation: moveLeft 300s linear }
.homes.back { bottom: -32px }
.homes.moreback { bottom: -52px }
.base { position: fixed; top: calc(70vh - 40px) }
.home1 { position: absolute; bottom: 40px }
.home1::before { bottom: 0px; position: absolute }
```

### [Easy Pure CSS Parallax Effect](https://codepen.io/Sxzarr/pen/yLwjrQe)

made with: nothing recognised — read the code

```css
main { margin-top: 15vh }
h2 { text-transform: uppercase }
.parallax { background-position: center }
```

### [Responsive Horizontal Scrolling Parallax Gallery ( Lerp )](https://codepen.io/noirsociety/pen/poYVeJM)

held: fixed div.gallery-track | made with: position: fixed · scroll listener · requestAnimationFrame

```css
.gallery-track { position: fixed }
```

```js
requestAnimationFrame(updateScroll)
addEventListener('scroll',init,false)
```

### [Parallax Effect](https://codepen.io/DerBaron/pen/OJqQGwJ)

made with: scroll listener

```css
#box1 { position: relative }
#box2 { position: relative }
#box3 { position: relative }
#box4 { position: relative }
```

```js
addEventListener("scroll", function(event){
```

### [Preloader + Parallax + stacking cards #GSAP](https://codepen.io/HugoSalazar/pen/mdopxmK)

held: fixed main | on hover of img.c-preload__logo-image: div.: transform+top | made with: transition · :hover · GSAP · ScrollTrigger

```css
.c-preload { position: absolute }
.c-preload .c-preload__inner { position: relative }
.c-preload .c-preload__inner .c-preload__logo-wrapper { position: absolute; inset: 0 }
.c-preload .c-preload__inner .c-preload__vertical-lines { position: relative }
.c-preload .c-preload__inner .c-preload__vertical-lines .c-preload__vertical-lin { position: absolute }
.c-preload .c-preload__inner .c-preload__vertical-lines .c-preload__vertical-lin { top: 0 }
.c-preload .c-preload__inner .c-preload__vertical-lines .c-preload__vertical-lin { bottom: 0 }
.c-preload .c-preload__inner .c-preload__vertical-lines .c-preload__vertical-lin { top: 0 }
.c-preload .c-preload__inner .c-preload__vertical-lines .c-preload__vertical-lin { bottom: 0 }
.c-preload .c-preload__inner .c-preload__vertical-lines .c-preload__vertical-lin { top: 0 }
.c-preload .c-preload__inner .c-preload__vertical-lines .c-preload__vertical-lin { bottom: 0 }
.c-preload .c-preload__inner .c-preload__vertical-lines .c-preload__vertical-lin { top: 0 }
```

```js
gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
gsap.timeline()
ScrollTrigger.create({
gsap.to(card, {
```

### [text parallax](https://codepen.io/siwuxie/pen/RwdZXzg)

made with: clip-path · pointer / mouse tracking

```css
.wrapper { position: relative }
.wrapper .right, .wrapper .left, .wrapper .right .mainText, .wrapper .left .main { position: absolute; top: 0 }
.wrapper .right .mainText, .wrapper .left .mainText { top: 5%; transform: skewY(calc(var(--i, 1) * 20deg)) }
.wrapper .left { clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%) }
.wrapper .right .mainText { opacity: 0.4 }
```

```js
addEventListener("mousemove", textParallax)
```

### [Responsive Vertical Scrolling Parallax Gallery ( Lerp )](https://codepen.io/noirsociety/pen/NWJvgZg)

held: fixed div.gallery-track | on scroll: div.card-image-wrapper: transform+top ×24, div.gallery-track: transform+top | on hover of div.card: div.card-image-wrapper: transform+top ×24, div.gallery-track: transform+top | made with: position: fixed · scroll listener · requestAnimationFrame

```css
.gallery-track { position: fixed; will-change: transform }
```

```js
requestAnimationFrame(updateScroll)
addEventListener('scroll',init,false)
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

### [Parallax ad](https://codepen.io/dynamic75/pen/BabRQda)

made with: scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes

```css
.headline { position: absolute; top: 70px }
.question-content { position: relative; top: 100% }
.brand { position: absolute; top: 20px }
.additional-content { position: absolute; bottom: 12px }
.additional-content .aer strong { padding-bottom: 4px }
#paralax-ad-container-2 { position: relative }
#paralax-ad-container-2 { view-timeline-name: --paralaxViewTimeline }
.triangle-1 { position: absolute; top: -39px; border-top: 164px solid transparent; border-bottom: 183px solid transparent }
.triangle-2 { position: absolute; top: -90px; border-top: 50px solid transparent; border-bottom: 120px solid transparent }
.triangle-3 { position: absolute; top: 142px; border-top: 115px solid transparent; border-bottom: 275px solid transparent; transform: rotate(0deg) }
:root { scroll-timeline-name: --scroll-view-timeline }
.animation-1 { animation-timeline: --paralaxViewTimeline; animation-name: slideOut; animation-range: 20% 50%; animation-delay: 150ms; animation-iteration-count: 1; animation-duration: 1s; animation-fill-mode: forwards; animation-direct }
```

### [Parallax Example](https://codepen.io/replyre/pen/qBvaGOz)

on hover of a.: a.: background | made with: transition · :hover

```css
.container { background-position: center }
h1 { box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35) }
.container a { box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35); transition: all 0.3s ease }
.card { box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.35); transition: all 0.3s ease }
.card:hover { transform: scale(1.1) }
.card .info img { background-position: center; margin-top: 20px }
.card .info h3 { margin-top: 1rem }
.card a { margin-bottom: 1rem }
.footer .column h3 { margin-bottom: 1.5rem }
```

### [Image rotation on scrolling](https://codepen.io/davitanaka/pen/WNmQamQ)

on scroll: div.image-container: transform+top ×3 | made with: scroll listener

```css
main .msg { position: absolute; top: 50%; transform: translate(-50%, -50%) }
main .image-container { position: absolute }
main .image-container:nth-child(1) { top: calc(1 * 30em) }
main .image-container:nth-child(2) { top: calc(2 * 30em) }
main .image-container:nth-child(3) { top: calc(3 * 30em) }
main .image-container:nth-child(4) { top: calc(4 * 30em) }
main .image-container:nth-child(5) { top: calc(5 * 30em) }
main .image-container:nth-child(6) { top: calc(6 * 30em) }
main .image-container:nth-child(7) { top: calc(7 * 30em) }
main .image-container:nth-child(7) { top: calc(7 * 30em) }
main .image-container:nth-child(8) { top: calc(8 * 30em) }
main .image-container:nth-child(9) { top: calc(9 * 30em) }
```

```js
addEventListener("scroll", animate)
```

### [Parallax Image Slider on Scroll](https://codepen.io/snowiewdev/pen/bGzPKpa)

held: fixed main | on scroll: div.slider-item-img: transform ×6, div.slider: transform | made with: position: fixed · requestAnimationFrame

```css
main { position: fixed; top: 0 }
.slider { position: absolute; top: 0 }
.slider-content { position: absolute; top: 15% }
.slider-item { position: relative }
.slider-item-img { position: absolute; background-position: center }
```

```js
requestAnimationFrame(animate)
```

### [Sections Overlapping On Scroll](https://codepen.io/yevhen_petrunkin/pen/yLZwNZM)

held: fixed section.section | made with: position: fixed · scroll listener

```css
.wrapper { position: relative; padding-bottom: calc(20vh - 24px) }
.section { position: relative }
.fixed { position: fixed }
```

```js
addEventListener("scroll", toggleStickyBehavior)
```

### [conic gradient follow cursor Card ( Example Genshin Impact )](https://codepen.io/abhishek-bhardwaj/pen/rNPoWMY)

on hover of div.card: div.card: transform | made with: transition · 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking

```css
.tilt { position: relative; perspective: 500px }
.bg { position: relative }
.bg:before { position: absolute; top: 0; scale: 1.05; transition: transform 0.3s cubic-bezier(0.86, 0.2, 0.03, 0.97); filter: blur(20px) saturate(1); translate: 0 0 -1px }
.card { transition: transform 0.2s linear }
.card img { translate: 0 0 80px }
```

```js
addEventListener('mousemove',(e)=>{
addEventListener('mouseenter',(e)=>{
addEventListener('mouseleave',(e)=>{
style.setProperty('--deg',(alpha+270)+'deg')
style.setProperty('--deg',(-(alpha-180-270))+'deg')
```

### [Just about time for lunch...](https://codepen.io/creativeocean/pen/ExreLde)

on scroll: image.[object: transform+top ×11 | made with: GSAP

```js
gsap.to('.hero', {duration:1, opacity:1, ease:'power1.inOut'})
gsap.timeline({scrollTrigger:{
```

### [@grokku/parallax-scroller demo](https://codepen.io/Andrii-Maglovanyi/pen/zYeJZzW)

made with: nothing recognised — read the code

```css
#demo-root * { position: absolute }
[data-scroll="sun"] { margin-top: 20vh }
[data-scroll="sun"] span { transform: scale(8) }
[data-scroll="back-clouds"] > div { transform: scale(5) }
[data-scroll="mid-clouds"] > div { transform: scale(10) }
[data-scroll="front-clouds"] > div { transform: scale(26); opacity: 0.8 }
#speech-bubble { position: absolute; top: -8rem }
#speech-bubble:after { position: absolute; bottom: 0; border-bottom: 0; margin-bottom: -13px }
```

### [Gallery Navigation](https://codepen.io/eswbalrb-the-decoder/pen/BaMYeNb)

held: fixed div.projects__nav | on scroll: span.: transform+opacity+top ×6, img.: transform+top ×3, a.projects__item-link: transform+top ×3, div.projects__nav: opacity, div.projects__nav-frame: transform | made with: position: fixed · transition · mix-blend-mode · requestAnimationFrame

```css
.projects__item-bg { position: absolute; top: 0 }
.projects__item-bg img { filter: brightness(50%) }
.projects__item-link { position: relative; text-transform: uppercase }
.projects__nav { position: fixed; bottom: 1rem; transition: 0.25s ease-in-out; opacity: 0; transform: translateX(-50%) }
.projects__nav::before { position: absolute; bottom: -1rem; transform: translate(-50%, 0); mix-blend-mode: overlay }
.projects__nav.active { opacity: 1 }
.projects__nav-frame { position: absolute; top: 0 }
.projects__item-link span[data-index] { opacity: 0; will-change: transform; transform: translate3d(0.5rem, 0.5rem, 0); transition: 0.5s ease-in-out }
.projects__item-link.reveal span[data-index] { opacity: 1; transform: translate3d(0, 0, 0) }
[data-gallery] { position: relative }
[data-gallery-item] { position: relative }
```

```js
requestAnimationFrame(this.loop.bind(this))
```

### [Three.js Parallax Scroll Animation](https://codepen.io/bigapplemonkey/pen/WNPMJpa)

held: fixed canvas.webgl | made with: position: fixed · GSAP · three.js / WebGL · scroll listener · pointer / mouse tracking · requestAnimationFrame

```css
.webgl { position: fixed; top: 0 }
.section { position: relative }
```

```js
addEventListener("scroll", () => {
gsap.to(sectionMeshes[currentSection].rotation, {
addEventListener("mousemove", (event) => {
requestAnimationFrame(tick)
```

### [Poppr Landing Page](https://codepen.io/gibsonmurray/pen/OJdzxyK)

on scroll: div.: transform+top, div.: transform | on hover of button.: div.: transform+top ×2, span.text: transform+opacity+top ×2 | made with: backdrop-filter · 3D (perspective / preserve-3d) · GSAP · pointer / mouse tracking

```css
#background { position: absolute }
#blob { position: absolute; opacity: 0.8; top: 50%; translate: -50% -50% }
#blur { position: absolute; backdrop-filter: blur(8vmax); -webkit-backdrop-filter: blur(8vmax) }
main { position: absolute; perspective: 2000px }
#video-container { position: relative; scale: 0 }
#video-container > * { position: absolute; top: -7% }
#title { position: absolute; transform: translate3D(300px, 0, 0) }
.word { position: relative }
.word:nth-child(2) { transform: translateX(-180px) }
.word:nth-child(3) { transform: translateX(110px) }
.char { opacity: 0 }
#replay { position: absolute; transform: translate3D(220px, -5px, 0) scale(0) }
```

```js
addEventListener("mousemove", (mouseEvent) => {
gsap.to("#blob", {
gsap.to("#video-container", {
gsap.fromTo(
gsap.to(button, {
```

### [CSS only Parallax experiment](https://codepen.io/james_k_fox/pen/RwvxoYw)

on scroll: img.parallax_8: transform+top, img.parallax_7: transform+top, img.parallax_6: transform+top, img.parallax_5: transform+top, img.parallax_4: transform+top, img.parallax_3: transform+top | made with: scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
.hero > img { object-position: center; animation-name: parallax; animation-timing-function: linear; animation-timeline: scroll() }
to { transform: translateY(calc(var(--speed) * 10px)) }
.content { position: relative }
@keyframes parallax animates transform
```

### [Phaser 3 | Parallax scrolling](https://codepen.io/buzzjeux/pen/rNPYxNe)

made with: nothing recognised — read the code

```css
#version { position: absolute; top: 5px }
```

### [Apple Watch Gestures](https://codepen.io/gibsonmurray/pen/NWowKYg)

on scroll: div.face: opacity ×4, div.caption: transform+top ×3, div.caption: transform+opacity+top ×2 | made with: mask · GSAP · ScrollTrigger

```css
#watch-mask { position: absolute; -webkit-mask-image: url("https://assets.codepen.io/8292695/apple-watch-mask.png"); -webkit-mask-size: contain; -webkit-mask-repeat: no-repeat; -webkit-mask-position: center; top: 333px }
#watch-wrist { background-position: center }
.face { position: absolute; top: 382px }
.face#music { opacity: 1 }
.face#phone, .face#timer, .face#messages, .face#stacks { opacity: 0 }
.caption { position: absolute; top: 200px }
.caption#music { opacity: 1 }
.caption#phone, .caption#timer, .caption#messages, .caption#stacks { opacity: 0; top: 400px }
```

```js
gsap.timeline()
gsap.to(caption, {
gsap.to(face, {
ScrollTrigger.create({
```

### [Parallax Scrolling and Title Animation](https://codepen.io/areal_alien/pen/KKJXwWM)

on scroll: img.article-list-item-background: transform+top ×3 | made with: @keyframes · transition

```css
.article-list-item { position: relative; animation: aListLoading 1s 0.5s cubic-bezier(0.175, 0.685, 0.32, 1) forwards }
.article-list-item-inner { position: relative }
.article-list-item-inner-title { position: absolute }
.article-list-item-inner-title-inner { position: relative; transform: scale(1.2, 1) }
.article-list-item-inner-title-inner span { top: 2em; position: relative; transform: scale(0.8, 0.8) rotate(17deg) }
.article-list-item-inner-overlay { position: absolute; animation: aListOverlayLoading 1s 0.5s cubic-bezier(0.175, 0.685, 0.32, 1) forwards }
.article-list-item-background { position: absolute; transform: scale(1, 1); transition: all 0.35s cubic-bezier(0.175, 0.685, 0.32, 1) }
.article-list-item-background-blur { position: absolute; transform: scale(0.9, 0.9); filter: blur(6rem); opacity: 0.5 }
0% { top: 2em; transform: scale(0.8, 0.8) rotate(17deg) }
100% { top: 0; transform: scale(1, 1) rotate(0) }
@keyframes aListLoading animates padding
@keyframes aListTitle animates top, transform
```

### [Parallax Seasons](https://codepen.io/gibsonmurray/pen/jOdwaKb)

on scroll: img.background: transform, img.middleground: transform, img.foreground: transform | on hover of img.background: img.background: transform+top, img.middleground: transform+top, img.foreground: transform+top | made with: transition · :hover · backdrop-filter · GSAP · pointer / mouse tracking

```css
.background, .middleground, .foreground { position: absolute; scale: 0 }
.season { position: absolute; margin-bottom: 100px }
#spring { opacity: 0 }
#spring > .background { top: 182px }
#spring > .middleground { top: 66px }
#spring > .foreground { top: -10px }
#summer { opacity: 0 }
#summer > .background { top: 217px }
#summer > .middleground { top: 133px }
#summer > .foreground { top: -42px }
#autumn { opacity: 0 }
#autumn > .background { top: 152px }
```

```js
gsap.to(seasonMenu, {
gsap.to(seasonTxt, {
gsap.timeline()
addEventListener("mousemove", (event) => {
gsap.to(layer, {
```

### [React Parallax Scroll-Triggered Expand and Fade Transition](https://codepen.io/phillip-gimmi/pen/KKJaZXr)

held: fixed div.keyhole | on scroll: img.: opacity+top ×2, div.message: transform+top, div.keyhole: clip-path | made with: position: fixed · clip-path · GSAP · ScrollTrigger

```css
.keyhole { position: fixed; inset: 0; clip-path: polygon(0% 0%, 0% 100%, 0 100%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%, 100% 100%, 100% 0%) }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline({
scrollTrigger: { trigger: ".section--primary", start: "top top", end: "bottom bottom", scrub: true }
scrollTrigger: { trigger: image2Ref.current, start: "center center", toggleActions: "play none none reverse" }
```

### [css only parallax](https://codepen.io/bechlokza/pen/bGzwPQL)

on scroll: img.parallax-img: transform+top ×7, header.primary-header: transform+top | made with: scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · mix-blend-mode

```css
.parallax { position: relative }
.parallax > * { animation: parallax linear; animation-timeline: scroll() }
.parallax > .parallax-img { opacity: 0.4 }
.parallax__foreground-back { transform: scaleY(1.2); transform-origin: bottom; mix-blend-mode: hard-light }
.main-content { position: relative }
to { transform: translateY(calc(var(--parallax-speed) * 200px)) }
body { text-transform: uppercase }
.button { text-transform: uppercase }
.logo { position: relative }
.logo::after { position: absolute; inset: -3rem }
.hero__title { position: relative }
.hero__title::after { position: absolute; inset: 0; scale: 2; opacity: 0.5; filter: blur(5rem); translate: -50% }
```

### [React Parallax Background and Text Fade - ScrollTrigger](https://codepen.io/phillip-gimmi/pen/QWYKxov)

on scroll: h1.section-title: opacity+top ×3 | made with: transition · GSAP · ScrollTrigger

```css
.section { position: relative }
.bg { position: absolute; top: 0; background-position: center }
.section-title { opacity: 0; transition: opacity 0.6s ease-out }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.fromTo(bg, { backgroundPosition: `50% ${-window.innerHeight / 2}px` }, {
scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true }
gsap.timeline({
gsap.to(h1, { autoAlpha: 1 }),
gsap.to(h1, { autoAlpha: 0 }),
gsap.to(h1, { autoAlpha: 0 }) } })
```

### [Untitled](https://codepen.io/paranoiacomics/pen/RwvrjLM)

made with: transition · :hover · three.js / WebGL · scroll listener · requestAnimationFrame

```css
.canvas-container { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.headline-container { position: absolute; top: 0; bottom: 0 }
#text-behind, #text-front, #text-behind-blur { position: absolute; text-transform: uppercase }
#text-behind-blur { filter: blur(7.5px); -webkit-filter: blur(7.5px) }
.text-container { top: 5%; position: absolute }
.title { text-transform: uppercase }
.socials svg { transition: all 0.5s ease-in-out; transform: scale(1) }
.socials svg:hover { transform: scale(1.2); filter: drop-shadow(0px 0px 5px rgba(255, 255, 255, 1)) }
a { transition: all 0.5s ease-in-out }
a:hover { filter: drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.9)) }
```

```js
addEventListener("scroll", () => {
requestAnimationFrame(animate)
```

### [iPad Parallax Scroll](https://codepen.io/gibsonmurray/pen/BaMjoaP)

held: fixed section | on scroll: div.: transform+top ×2 | on hover of a.: div.: transform+top ×2 | made with: transition · :hover · 3D (perspective / preserve-3d) · GSAP · ScrollTrigger

```css
a { position: absolute; bottom: 5px }
#wrapper { perspective: 1200px }
#ipad { transform: rotate3d(1, 0, 0, 30deg); margin-bottom: 30px }
#ipad-bezel { box-shadow: 0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003 }
.col { background-position: center; transition: 200ms }
.col:hover { scale: 1.03 }
```

```js
gsap.timeline()
gsap.to("#ipad", { rotationX: 10 }), 0)
gsap.to("#images", { y: -808 }), 0)
ScrollTrigger.create({
```

### [Untitled](https://codepen.io/WildKING543/pen/zYevmdg)

made with: position: fixed · transition · :hover · mix-blend-mode · GSAP · ScrollTrigger

```css
svg { position: fixed; top: 0 }
.scrollElement { position: absolute; top: 0 }
.btn { position: fixed; bottom: 5%; transform: translateX(-50%); transition: all .3s }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline()
ScrollTrigger.create({
gsap.fromTo("#bird", { opacity: 1 }, {
gsap.to("#bird", { scaleX: 1, rotation: 0 }) },
gsap.to("#bird", { scaleX: -1, rotation: -15 }) },
gsap.fromTo("#bats", { opacity: 1, y: 400, scale: 0 }, {
gsap.to(item, { scaleX: 0.5, yoyo: true, repeat: 11, duration: 0.15, delay: 0.7 + (i / 10), transformOrigin: "50% 50%" })
```

### [Untitled](https://codepen.io/WildKING543/pen/rNPOqzg)

made with: position: fixed · transition · :hover · mix-blend-mode · GSAP · ScrollTrigger

```css
svg { position: fixed; top: 0 }
.scrollElement { position: absolute; top: 0 }
.btn { position: fixed; bottom: 5%; transform: translateX(-50%); transition: all .3s }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline()
ScrollTrigger.create({
gsap.fromTo("#bird", { opacity: 1 }, {
gsap.to("#bird", { scaleX: 1, rotation: 0 }) },
gsap.to("#bird", { scaleX: -1, rotation: -15 }) },
gsap.fromTo("#bats", { opacity: 1, y: 400, scale: 0 }, {
gsap.to(item, { scaleX: 0.5, yoyo: true, repeat: 11, duration: 0.15, delay: 0.7 + (i / 10), transformOrigin: "50% 50%" })
```

### [Untitled](https://codepen.io/WildKING543/pen/eYxpPEo)

made with: position: fixed · transition · :hover · mix-blend-mode · GSAP · ScrollTrigger

```css
svg { position: fixed; top: 0 }
.scrollElement { position: absolute; top: 0 }
.btn { position: fixed; bottom: 5%; transform: translateX(-50%); transition: all .3s }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline()
ScrollTrigger.create({
gsap.fromTo("#bird", { opacity: 1 }, {
gsap.to("#bird", { scaleX: 1, rotation: 0 }) },
gsap.to("#bird", { scaleX: -1, rotation: -15 }) },
gsap.fromTo("#bats", { opacity: 1, y: 400, scale: 0 }, {
gsap.to(item, { scaleX: 0.5, yoyo: true, repeat: 11, duration: 0.15, delay: 0.7 + (i / 10), transformOrigin: "50% 50%" })
```

### [Untitled](https://codepen.io/WildKING543/pen/ZEwbqJP)

made with: position: fixed · transition · :hover · mix-blend-mode · GSAP · ScrollTrigger

```css
svg { position: fixed; top: 0 }
.scrollElement { position: absolute; top: 0 }
.btn { position: fixed; bottom: 5%; transform: translateX(-50%); transition: all .3s }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline()
ScrollTrigger.create({
gsap.fromTo("#bird", { opacity: 1 }, {
gsap.to("#bird", { scaleX: 1, rotation: 0 }) },
gsap.to("#bird", { scaleX: -1, rotation: -15 }) },
gsap.fromTo("#bats", { opacity: 1, y: 400, scale: 0 }, {
gsap.to(item, { scaleX: 0.5, yoyo: true, repeat: 11, duration: 0.15, delay: 0.7 + (i / 10), transformOrigin: "50% 50%" })
```

### [Untitled](https://codepen.io/WildKING543/pen/MWLaPvL)

made with: position: fixed · transition · :hover · mix-blend-mode · GSAP · ScrollTrigger

```css
svg { position: fixed; top: 0 }
.scrollElement { position: absolute; top: 0 }
.btn { position: fixed; bottom: 5%; transform: translateX(-50%); transition: all .3s }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline()
ScrollTrigger.create({
gsap.fromTo("#bird", { opacity: 1 }, {
gsap.to("#bird", { scaleX: 1, rotation: 0 }) },
gsap.to("#bird", { scaleX: -1, rotation: -15 }) },
gsap.fromTo("#bats", { opacity: 1, y: 400, scale: 0 }, {
gsap.to(item, { scaleX: 0.5, yoyo: true, repeat: 11, duration: 0.15, delay: 0.7 + (i / 10), transformOrigin: "50% 50%" })
```

### [Untitled](https://codepen.io/WildKING543/pen/yLZYRoG)

made with: position: fixed · transition · :hover · mix-blend-mode · GSAP · ScrollTrigger

```css
svg { position: fixed; top: 0 }
.scrollElement { position: absolute; top: 0 }
.btn { position: fixed; bottom: 5%; transform: translateX(-50%); transition: all .3s }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline()
ScrollTrigger.create({
gsap.fromTo("#bird", { opacity: 1 }, {
gsap.to("#bird", { scaleX: 1, rotation: 0 }) },
gsap.to("#bird", { scaleX: -1, rotation: -15 }) },
gsap.fromTo("#bats", { opacity: 1, y: 400, scale: 0 }, {
gsap.to(item, { scaleX: 0.5, yoyo: true, repeat: 11, duration: 0.15, delay: 0.7 + (i / 10), transformOrigin: "50% 50%" })
```

### [Quote_Machine](https://codepen.io/proaxius/pen/RwvWZma)

made with: nothing recognised — read the code

### [Untitled](https://codepen.io/ngiqbxze-the-bold/pen/OJdVEzE)

made with: nothing recognised — read the code

```css
.scene { position: absolute; transform: translateY(var(--translateY)); will-change: transform }
```

### [Responsive Premium Parallax Image Gallery with React](https://codepen.io/phillip-gimmi/pen/mdvJrZm)

made with: transition · :hover · 3D (perspective / preserve-3d) · scroll listener · pointer / mouse tracking

```css
.grid { padding-bottom: 20px }
.card { perspective: 1000px }
.square { background-position: center; transition: transform 1s, background-size 0.5s, box-shadow 0.5s, background-position 0.5s; filter: blur(0px) }
.square p { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: opacity 0.25s ease-in-out }
.hidden { opacity: 0 }
.square:before { position: absolute }
.square:after { position: absolute; top: 0%; transition: 0.5s all 0.5s }
.square:hover:after { top: 5%; transition: 1s width, 1s height, 1s top, 1s left, 0.1s border 0s }
```

```js
addEventListener('mousemove', handleMouseMove)
addEventListener('scroll', handleScroll)
```

### [Horizontal Card Parallax effect 3D card with react](https://codepen.io/phillip-gimmi/pen/YzBXPry)

on scroll: div.project: transform+top, img.: transform+top | on hover of img.: div.project: transform+top, img.: transform+top | made with: transition · 3D (perspective / preserve-3d)

```css
.project { position: relative; perspective: 1000px }
.project img { transition: transform 0.3s; position: relative }
```

### [Interactive Draggable Cube with Parallax Background](https://codepen.io/Neverending250/pen/YzBPdKK)

made with: @keyframes · transition · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
body { animation: gradient 10s linear infinite }
.cube { position: absolute; transition: background 0.3s; box-shadow: 0 0 20px rgba(0, 0, 0, 0.7) }
.cube:active { transform: scale(1.05); animation: shadow-move 0.5s infinite alternate }
0% { background-position: 0% 50% }
50% { background-position: 100% 50% }
100% { background-position: 0% 50% }
0% { transform: translateZ(10px); box-shadow: 0 0 20px rgba(0, 0, 0, 0.7) }
100% { transform: translateZ(0); box-shadow: 0 0 20px rgba(0, 0, 0, 0) }
@keyframes gradient animates background-position
@keyframes shadow-move animates transform, box-shadow
```

```js
addEventListener('mousemove', (e) => { if (!isDragging) return
```

### [Happy Halloween - Parallax Effect & Slider](https://codepen.io/ecemgo/pen/ZEwYqMQ)

on scroll: img.: transform+top ×4 | made with: @keyframes · transition · :hover · mix-blend-mode · GSAP

```css
.parallax { position: relative }
.parallax > img { position: absolute; bottom: 0 }
.parallax > h2 { position: absolute; top: 10%; animation: title 1s ease 0s 1 normal forwards }
.blog { position: relative }
.blog::before { position: absolute; top: 0 }
.blog h3 { position: relative }
.blog h3::after { position: absolute; top: 100%; animation: line-animation 5s infinite linear }
from { background-position: 100% }
to { background-position: -100% }
.swiper { margin-bottom: 80px }
.parallax-bg { position: absolute; top: 0; background-position: center }
.swiper-slide .title { position: relative; margin-bottom: 1.3rem }
```

```js
gsap.from("#leftside", {
scrollTrigger: { scrub: true, }
gsap.from("#rightside", {
gsap.from("#leftpumpkin", {
gsap.from("#rightpumpkin", {
```

### [Horizontal DOM Parallax effect 3D card with react](https://codepen.io/phillip-gimmi/pen/zYexLGd)

on scroll: div.project: transform+top | on hover of img.: div.project: transform+top, img.: transform+top | made with: transition · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.project { position: relative; perspective: 1000px }
.project img { transition: transform 0.3s; position: relative }
```

```js
addEventListener('mousemove', this.handleGlobalMouseMove)
```

### [React Parallax Beauty Dual-Image Flipper](https://codepen.io/phillip-gimmi/pen/gOqORZw)

made with: transition · :hover · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.card { perspective: 1000px }
.square { background-position: center; transition: transform 1s, background-size 0.5s, box-shadow 0.5s, background-position 0.5s; filter: blur(0px) }
.square p { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: opacity 0.25s ease-in-out }
.hidden { opacity: 0 }
.square:before { position: absolute }
.square:after { position: absolute; top: 0%; transition: 0.5s all 0.5s }
.square:hover:after { top: 5%; transition: 1s width, 1s height, 1s top, 1s left, 0.1s border 0s }
```

```js
addEventListener('mousemove', handleMouseMove)
```

### [Parallax with SVG](https://codepen.io/danielwuachin/pen/WNPNpRy)

held: fixed div.main | on scroll: image.[object: transform+top ×7, g.[object: transform | made with: GSAP · ScrollTrigger

```css
div { position:absolute }
```

```js
gsap.timeline({scrollTrigger:{trigger:'.scrollDist', start:'top top', end:'bottom bottom', scrub:1}})
addEventListener("mouseenter", (e) => {
gsap.to(arrow, { y: 10, duration: 0.8, ease: "back.inOut(3)", overwrite: "auto" })
addEventListener("mouseleave", (e) => {
gsap.to(arrow, { y: 0, duration: 0.5, ease: "power3.out", overwrite: "auto" })
gsap.to(window, { scrollTo: innerHeight, duration: 1.5, ease: "power1.inOut" })
```

### [3D Card Image Hover Html Css and Javascript](https://codepen.io/dawnscript/pen/WNLVLEm)

made with: transition · 3D (perspective / preserve-3d)

```css
.perspective { perspective: 1000px }
.card { box-shadow: 0 70px 63px -60px #494848; transition: transform 0.05s linear }
.card .image:after { position: absolute; top: 40px; filter: blur(55px) }
.card h2 { position: absolute; top: 0; transform: translateZ(80px); text-transform: uppercase }
.card span { position: absolute; bottom: 40px; transform: translateZ(35px); text-transform: uppercase }
```

### [Simple parallax scroll with 6 lines of js](https://codepen.io/Snuffed17/pen/ZEVdVbY)

made with: scroll listener

```js
addEventListener("scroll", function() {
```

### [WAAPI Parallax (Firewatch)](https://codepen.io/JMChristensen/pen/GRPLPvb)

held: fixed div.keyart_layer, fixed div.keyart_layer, fixed div.keyart_layer, fixed div.keyart_layer, fixed div.keyart_layer, fixed div.keyart_layer, fixed div.keyart_layer, fixed div.keyart_layer | made with: position: fixed · scroll() timeline · Web Animations API (.animate)

```css
.keyart { position: relative }
.keyart_layer { background-position: bottom center; position: absolute }
.keyart_layer.parallax { position: fixed }
#keyart-scrim { opacity: 0 }
#maincontain { position: relative }
```

```js
.animate( {
```

### [Untitled](https://codepen.io/Hip-inh-Ho-ng/pen/jOXXddN)

held: fixed svg.[object, fixed button.btn | on scroll: path.[object: transform+top ×14, path.[object: transform ×3, path.[object: transform+opacity+top, g.[object: transform+top | on hover of button.btn: path.[object: transform+top ×13, path.[object: transform ×3, path.[object: transform+opacity+top, g.[object: transform+top, button.btn: background+color | made with: position: fixed · transition · :hover · mix-blend-mode · GSAP · ScrollTrigger

```css
svg { position: fixed; top: 0 }
.scrollElement { position: absolute; top: 0 }
.btn { position: fixed; bottom: 5%; transform: translateX(-50%); transition: all .3s }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline()
ScrollTrigger.create({
gsap.fromTo("#bird", { opacity: 1 }, {
gsap.to("#bird", { scaleX: 1, rotation: 0 }) },
gsap.to("#bird", { scaleX: -1, rotation: -15 }) },
gsap.fromTo("#bats", { opacity: 1, y: 400, scale: 0 }, {
gsap.to(item, { scaleX: 0.5, yoyo: true, repeat: 11, duration: 0.15, delay: 0.7 + (i / 10), transformOrigin: "50% 50%" })
```

### [CSS+JS | Simple Scroll-Snap + Basic Parallax + Fade-in Text Effect](https://codepen.io/Adonaiis/pen/PoXyjoP)

made with: scroll-snap · @keyframes · transition · IntersectionObserver · pointer / mouse tracking

```css
0% { opacity: 0 }
100% { opacity: 1 }
.fadeIn { animation: fadeIn 2s ease-in forwards }
body .container { scroll-snap-type: y mandatory }
body .container section { scroll-snap-align: start; background-position: center; transition: background-position 0.5s ease-out }
body .container section:nth-of-type(1) { background-position: center }
body .container section:nth-of-type(2) { background-position: center }
body .container section:nth-of-type(3) { background-position: center }
body .container section:nth-of-type(4) { background-position: center }
body .container section h1 { opacity: 0; text-transform: uppercase }
@keyframes fadeIn animates opacity
```

```js
new IntersectionObserver((entries) => {
addEventListener('mousemove', function(e) {
```

### [React parallax image slider](https://codepen.io/dentednerd/pen/gOZjNdG)

on hover of img.image: img.image: shadow | made with: transition · pointer / mouse tracking · Web Animations API (.animate)

```css
#image-track { position: absolute; top: 50%; transform: translate(0%, -50%) }
#image-track > .image { object-position: 100% 50%; transition: all 0.3s ease }
```

```js
.animate({
addEventListener('mousemove', handleMouseMove)
```

### [Super Simple Parallax Fullscreen Hero Header with Object-Fit](https://codepen.io/SaschaFromMars/pen/oNJMdRM)

held: fixed nav | made with: position: fixed · scroll() timeline · @keyframes · :hover

```css
.hero { position: relative }
.hero .hero-image { position: absolute; top: 0; bottom: 0 }
.hero .hero-image img { position: absolute }
.hero.left-top .hero-image img { object-position: left top }
.hero.center-top .hero-image img { object-position: center top }
.hero.right-top .hero-image img { object-position: right top }
.hero.left-bottom .hero-image img { object-position: left bottom }
.hero.center-bottom .hero-image img { object-position: center bottom }
.hero.right-bottom .hero-image img { object-position: right bottom }
.hero .hero-darken { position: absolute; top: 0; bottom: 0 }
h1, h2 { margin-bottom: 1.4rem }
p { margin-bottom: 1.4rem }
```

### [Starry night](https://codepen.io/Ibrahim-Abdulhameed/pen/oNJMEGV)

held: fixed div.title, fixed p.credits | on scroll: div.star-layer: transform+top ×3 | on hover of a.: div.star-layer: transform+top ×3, a.: color | made with: position: fixed · @keyframes · :hover

```css
from { transform: translateY(0px) }
to { transform: translateY(-2000px) }
.star-layers { position: relative }
.star-layers .star-layer { position: absolute }
.star-layers .star-layer::after { position: absolute; top: 2000px }
.star-layers #stars { box-shadow: 1518px 1144px #FFF, 953px 1131px #FFF, 140px 1406px #FFF, 875px 884px #FFF, 1997px 1479px #FFF, 1549px 854px #FFF, 1709px 1756px #FFF, 1049px 5px #FFF, 1482px 225px #FFF, 459px 1141px #FFF, 709px 1140px #FFF, }
.star-layers #stars::after { box-shadow: 1518px 1144px #FFF, 953px 1131px #FFF, 140px 1406px #FFF, 875px 884px #FFF, 1997px 1479px #FFF, 1549px 854px #FFF, 1709px 1756px #FFF, 1049px 5px #FFF, 1482px 225px #FFF, 459px 1141px #FFF, 709px 1140px #FFF, }
.star-layers #stars2 { box-shadow: 867px 1139px #FFF, 249px 949px #FFF, 706px 1595px #FFF, 523px 1092px #FFF, 1543px 1999px #FFF, 1894px 1706px #FFF, 499px 875px #FFF, 1226px 408px #FFF, 1196px 172px #FFF, 498px 234px #FFF, 872px 892px #FFF, 6 }
.star-layers #stars2::after { box-shadow: 867px 1139px #FFF, 249px 949px #FFF, 706px 1595px #FFF, 523px 1092px #FFF, 1543px 1999px #FFF, 1894px 1706px #FFF, 499px 875px #FFF, 1226px 408px #FFF, 1196px 172px #FFF, 498px 234px #FFF, 872px 892px #FFF, 6 }
.star-layers #stars3 { box-shadow: 1429px 666px #FFF, 1890px 1611px #FFF, 1982px 1335px #FFF, 541px 422px #FFF, 201px 17px #FFF, 493px 1037px #FFF, 895px 1765px #FFF, 1772px 472px #FFF, 479px 936px #FFF, 571px 1143px #FFF, 248px 581px #FFF, 78 }
.star-layers #stars3::after { box-shadow: 1429px 666px #FFF, 1890px 1611px #FFF, 1982px 1335px #FFF, 541px 422px #FFF, 201px 17px #FFF, 493px 1037px #FFF, 895px 1765px #FFF, 1772px 472px #FFF, 479px 936px #FFF, 571px 1143px #FFF, 248px 581px #FFF, 78 }
.title { position: fixed; top: 0; bottom: 0 }
```

### [cursor parallax (mouse moves)](https://codepen.io/web_walking_nak/pen/ExGLvMe)

on hover of img.: div.js-cursor-parallax__item: transform, img.: transform+top | made with: transition · :hover · pointer / mouse tracking

```css
.js-cursor-parallax__item { transition: transform .1s }
.js-cursor-parallax__item img { transition: transform .3s }
.js-cursor-parallax:hover .js-cursor-parallax__item img { transform: scale(1.05) }
h1 { margin-bottom: 100px }
img { vertical-align: top }
```

```js
addEventListener('mouseenter', function() {
addEventListener('mousemove', function(e) {
addEventListener('mouseleave', function() {
```

### [Parallax Effect](https://codepen.io/ecemgo/pen/BavreOY)

on scroll: img.: transform+top ×5 | made with: transition · :hover · GSAP

```css
header { position: absolute; top: 0 }
.parallax { position: relative }
.parallax img { position: absolute; bottom: 0 }
#title { position: absolute; top: 13% }
.blog { position: relative }
.blog::before { position: absolute; top: 0 }
.blog p { margin-bottom: 30px }
.card { position: relative; box-shadow: 0 6px 30px rgba(0, 0, 0, 0.3) }
.overlay { position: absolute; top: 0; opacity: 0; transition: all 0.4s ease-in-out }
.overlay:hover { opacity: 1 }
#title { top: 16% }
#title { top: 20% }
```

```js
gsap.from("#woman", {
scrollTrigger: { scrub: true, }
gsap.from("#leftplant", {
gsap.from("#rightplant", {
gsap.from("#ball", {
gsap.from("#lifebuoy", {
scrollTrigger: { trigger: ".parallax", start: "top 50%", end: "bottom top", toggleActions: "restart none none reset", }
```

### [Mouse Trailer with Brain](https://codepen.io/jalolniki/pen/xxmpzNL)

held: fixed div | on scroll: div.: transform+top | made with: position: fixed · transition · :hover

```css
#trailer { position: fixed; transition: .5s; opacity: .5 }
#trailer p { opacity: 0; transition: .5s }
.cards p { opacity: 0; transition: .5s }
.card { transition: .5s; background-position: 50% }
.card:nth-child(1):hover > p { opacity: 1 }
.card:nth-child(2):hover > p { opacity: 1 }
```

```js
addEventListener('mouseenter', () =>{
addEventListener('mouseleave', () =>{
```

### [CSS+JS parallax image slider](https://codepen.io/dentednerd/pen/gOZoGWK)

made with: Web Animations API (.animate)

```css
#image-track { position: absolute; top: 50%; transform: translate(0%, -50%) }
#image-track > .image { object-position: 100% 50% }
```

```js
.animate({
```

### [Transparent sticky Navbar](https://codepen.io/Dhruv-Mehta/pen/LYMOGjN)

held: fixed nav.navbar | made with: nothing recognised — read the code

```css
#portfolio { background-position: center; position:relative }
#shop { background-position: center; position:relative }
```

### [Simple parallax scrolling](https://codepen.io/thientv/pen/poqwvKy)

on scroll: span.: transform+top ×4 | made with: nothing recognised — read the code

```css
.container { position: relative }
.container span { position: absolute }
.container span:nth-child(1) { top: 35vh }
.container span:nth-child(2) { top: 70vh }
.container span:nth-child(3) { top: 100vh }
.container span:nth-child(4) { top: 145vh }
.credit { position: absolute; top: 180vh }
```

### [Active menu parallax responsive films landing page](https://codepen.io/Artixx25/pen/gOZmged)

held: fixed header | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · scroll listener

```css
header { position: fixed; inset: 0; transition: all 0.2s ease 0s }
header.scrolled { backdrop-filter: blur(50px); box-shadow: 0px 0px 15px #000000b6; top: 15px }
header nav { opacity: 0.9 }
header nav li a { transition: all 0.3s ease 0s }
header nav li a.active { backdrop-filter: blur(55px) }
main { position: relative }
main section { position: relative; text-transform: uppercase; box-shadow: 0px 0px 10px #00000024 }
main section::after { position: absolute; inset: 0 }
main section .content { position: relative }
main section .content .image-prev img { box-shadow: 0px 0px 40px #0000008e }
main section .content .info .desc { text-transform: capitalize; margin-top: 10px }
main section .content .info .tips { position: relative }
```

```js
addEventListener( "scroll",
```

### [Scroll Driven Gallery Animation](https://codepen.io/markuswalker/pen/BavWyNB)

on scroll: div.grid__item: transform+filter+top ×20, img.: transform+top ×20 | made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes

```css
.grid__item { transform: skewX(10deg); animation: skew linear both; view-timeline: --skew; animation-range: entry exit 50%; animation-timeline: --skew; filter: brightness(0) }
.grid__item img { animation: scale linear both; animation-timeline: --skew; animation-range: inherit }
.grid__row:nth-of-type(odd) .grid__item { transform: skewX(-10deg) }
to { transform: skewX(0deg); filter: brightness(1) }
to { transform: scale(1.4, 1) }
@keyframes skew animates transform, filter
@keyframes scale animates transform
```

### [Image Mover Through Cursor](https://codepen.io/Klax/pen/rNojORz)

on scroll: div.image-container: transform+top | made with: transition · pointer / mouse tracking

```css
.container { box-shadow: 0 0 5px #ffffff10 }
.image-container { background-position: center; transition: all 300ms ease }
```

```js
addEventListener("mousemove", function (dets) {
```

### [Apocalyptic Reverie - Responsive](https://codepen.io/zanakarzan/pen/LYMbopV)

held: fixed aside.preloader | on scroll: div.ball: transform, header.hide: opacity, div.vignette: opacity, h2.: transform+opacity+top, h1.: transform+top, img.sun_rays: opacity | on hover of a.: div.ball: transform+top, header.hide: opacity, div.vignette: opacity, h2.: transform+opacity+top, img.sun_rays: opacity, img.black_shadow: opacity | made with: position: fixed · @keyframes · backdrop-filter · 3D (perspective / preserve-3d) · GSAP · pointer / mouse tracking

```css
.preloader { position: fixed; inset: 0 }
.preloader .spinner { position: absolute; top: 0; bottom: 0 }
.preloader .spinner .ball { -webkit-animation: motion 3s cubic-bezier(0.77, 0, 0.175, 1) infinite; animation: motion 3s cubic-bezier(0.77, 0, 0.175, 1) infinite }
.preloader .spinner p { margin-top: 20px }
0% { transform: translateX(0) scale(1) }
25% { transform: translateX(-50px) scale(0.3) }
50% { transform: translateX(0) scale(1) }
75% { transform: translateX(50px) scale(0.3) }
100% { transform: translateX(0) scale(1) }
0% { transform: translateX(0) scale(1) }
25% { transform: translateX(-50px) scale(0.3) }
50% { transform: translateX(0) scale(1) }
```

```js
addEventListener("mousemove", (e) => {
gsap.timeline({defaults: {duration: 3.5, ease: "power3.out"}})
gsap.to(".preloader", {
```

### [T1 Hands-on Activity #2_Group #9 (About Us Page)](https://codepen.io/TorrentialBreeze/pen/WNLoyLm)

held: fixed div, fixed nav | on hover of img.: div.: transform+top | made with: position: fixed · scroll-snap · transition · :hover · clip-path · scroll listener · Web Animations API (.animate)

```css
nav { margin-bottom: 15px; position: fixed; top: 0 }
li a { opacity: 0.3; transition: opacity 400ms ease; position: relative }
li a::before { position: absolute; bottom: -2px; transform: scaleX(0); transition: transform 0.3s ease }
li a:hover::before { transform: scaleX(1) }
li:hover a { opacity: 1 }
ul:not(:hover) li a { opacity: 1 }
.login-button { padding-top: 10px; padding-bottom: 10px; transition: background-color 0.3s ease }
.signup-button { padding-top: 10px; padding-bottom: 10px; transition: background-color 0.3s ease }
section { position: relative }
section img { position: absolute; top: 0 }
#bg { position: relative }
#parallaxheader { position: relative; top: 0; margin-top: -75vh }
```

```js
.animate([keyframes], {
addEventListener("scroll", function () {
```

### [Rainy day window](https://codepen.io/Atuatu_Hhakumai/pen/oNJxgBY)

made with: transition · pointer / mouse tracking

```css
.window { position: absolute; top: 0% }
.foreground { top: 0%; position: absolute }
#foreground { position: absolute; top: -10%; transition: transform ease-out 120ms }
#background { position: absolute; top: -10%; filter: blur(4px); transition: transform ease-out 50ms }
```

```js
addEventListener('mousemove', e => {
```

### [Image parallax effect GSAP](https://codepen.io/gusevdigital/pen/MWZKyom)

on scroll: img.: transform+top ×3 | on hover of img.: img.: transform+top ×2 | made with: GSAP · ScrollTrigger · Lenis / smooth scroll

```css
section .img { position: relative }
section .img-container { padding-top: 80%; position: relative }
section .img-container img { position: absolute; top: 0; transform: translateX(-50%) scale(1.4) }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline({
scrollTrigger: { trigger: container, scrub: true, pin: false, }
```

### [pro1](https://codepen.io/Namrata-Mohite/pen/dywygoP)

made with: position: fixed · GSAP · ScrollTrigger

```css
.stage { position: relative }
.header { position: fixed; top: 24px }
.intro { position: relative }
.intro__content { position: absolute; bottom: 15% }
.intro__title { margin-bottom: 5vh }
.intro__img { position: absolute }
.intro__img--1 { bottom: 35% }
.intro__img--1 { bottom: 50vh }
.intro__img--2 { bottom: 40% }
.intro__img--2 { bottom: 60vh }
.slide { position: relative }
.col--1 { position: relative }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(ScrollToPlugin)
gsap.registerPlugin(SplitText)
gsap.registerPlugin(ScrollSmoother)
gsap.timeline({ delay: 0.5 })
gsap.to(".nav-rect", {
gsap.timeline({ delay: 1.2 })
gsap.timeline({
```

### [Magnetic Dom Element](https://codepen.io/Qualley/pen/YzdzaOj)

on scroll: div.: transform+top ×2, div.item: transform | made with: transition · clip-path · mix-blend-mode · pointer / mouse tracking

```css
.wrapper #cursor { position: absolute; mix-blend-mode: overlay }
.wrapper .item #icon { transform: rotate(0); transition: all 0.1s ease-in-out }
.wrapper .item svg { transform: scale(1.75) }
```

```js
addEventListener("mousemove", moveCursor)
addEventListener("mousemove", (e) => {
```

### [Pixi Scrolling Bubbles](https://codepen.io/nathanlong/pen/eYbYyQK)

held: fixed canvas | on hover of button.: button.: background | made with: position: fixed · :hover · :focus-visible · scroll listener · requestAnimationFrame

```css
canvas { position: fixed; inset: 0 }
.intro { position: relative }
```

```js
addEventListener("scroll", this.handleScroll)
requestAnimationFrame(() => {
```

### [Thomas Bosc - Gallery Box](https://codepen.io/danuvip/pen/LYMYbpE)

on scroll: div.gallery: transform, div.item: filter | on hover of a.: div.gallery: transform+top, div.item: filter+top | made with: transition · :hover

```css
div#gallery-box { top: 50%; position: absolute; transform: translate(-50%, -50%) }
div.overlay { position: absolute; top: 0; bottom: 0; filter: drop-shadow(0px 0px 10px #000a) }
div.overlay a { position: relative; padding-bottom: 0.5rem; text-transform: uppercase }
div.overlay a:after { position: absolute; bottom: 0.25rem; transform: translateX(-100%) }
div.overlay a:hover:after { transform:translateX(0); transition: 0.4s ease }
div.overlay a.leave:after { transform: translateX(100%); transition: 0.4s ease }
div.gallery { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: 2s linear }
div.item { filter: grayscale(1) brightness(0.5); transition: 1s; position: relative }
div.item:hover { filter: grayscale(0) }
div.item img { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: 2s ease }
div#credits { opacity: 0 }
div#credits { opacity: 0.5; transition: 0.4s ease; position: absolute; bottom:1rem }
```

### [Train Ride](https://codepen.io/adam-gibbons/pen/yLQmBJm)

made with: @keyframes

```css
0% { background-position: 0px 100% }
100% { background-position: 1200px 100% }
.title { position: relative }
body .container .train-window { position: relative; top: 100px }
body .container .train-window .horizontal-pane { position: absolute; top: 90px }
body .container .train-window .vertical-pane { top: 0; position: absolute }
body .container .landscape { position: absolute; top: 110px }
body .container .landscape .layer-1 { animation: parallax_fg linear 6s infinite both; position: absolute; bottom: 0 }
body .container .landscape .layer-2 { animation: parallax_fg linear 30s infinite both; position: absolute; bottom: 0 }
body .container .landscape .layer-3 { animation: parallax_fg linear 90s infinite both; position: absolute; bottom: 0 }
body .container .landscape .layer-4 { animation: parallax_fg linear 500s infinite both; position: absolute; bottom: 0 }
body .container .landscape .layer-5 { position: absolute; bottom: 0 }
```

### [GSAP ScrollTrigger header section](https://codepen.io/anastasijaprogramer/pen/abQMpwo)

held: fixed div.layer-bg, fixed div.layer-1, fixed div.layer-2, fixed div.layer-3, fixed div.layer-overlay, fixed div.layer-4 | on scroll: div.layer-bg: transform+top, div.layer-1: transform+top, div.layer-2: transform+top, div.layer-3: transform+top, div.layer-overlay: transform+top, div.layer-4: transform+top | made with: position: fixed · GSAP

```css
#hero { position: relative }
.layer { background-position: bottom center; position: fixed }
h1 { margin-bottom: 30px }
.layer-1 { background-position: left bottom }
.layer-3 { background-position: right bottom }
.layer-1 { background-position: 26% bottom }
.layer-3 { background-position: 35% bottom }
```

```js
gsap.timeline({
scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
```

### [CSS Parallax Scrolling No Js](https://codepen.io/WhiteHatDesigner/pen/LYXJNBz)

held: fixed a | made with: position: fixed · :hover · 3D (perspective / preserve-3d)

```css
body { perspective: 1px }
header { position: relative }
header h1 { margin-top: -100px }
header::before { position: absolute; top: 0; bottom: 0; transform: translateZ(-1px) scale(2) }
#support { position: fixed; bottom: 1em }
```

### [Parallax Scrolling Sections](https://codepen.io/BurntBrownBoi/pen/XWyBaZv)

on hover of a.: a.: background | made with: transition · :hover

```css
h2 { transition: background-color 0.5s }
a { transition: background-color 0.3s }
.github div { transition: background-color 0.3s ease-out }
.github div:hover { box-shadow: 0px 0px 10px 5px #2d2d2d }
.contact-links div { transition: background-color 0.3s ease-out }
.contact-links div:hover { box-shadow: 0px 0px 10px 5px #2d2d2d }
nav, footer { margin-bottom: 20px; box-shadow: 0px 0px 10px 5px #2d2d2d }
nav a { transition: background-color 0.3s ease-out }
#sections-wrapper { transition: transform 0.6s ease }
section { transition: filter 0.7s ease-in-out }
section:not(.active) { filter: blur(10px) }
```

### [Gallery Concept](https://codepen.io/kitjenson/pen/mdQKLQX)

made with: nothing recognised — read the code

```css
section { position: relative; background-position: 50% 50% }
.view-project { position: absolute; bottom: 0; transform: translate(-50%,-75%); box-shadow: 0 5px 0 rgba(0,0,0,.5) }
```

### [Nice landing page](https://codepen.io/hjcortes/pen/VwVQMRv)

held: fixed div, fixed header.header | made with: position: fixed · GSAP · ScrollTrigger

```css
.stage { position: relative }
.header { position: fixed; top: 24px }
.intro { position: relative }
.intro__content { position: absolute; bottom: 15% }
.intro__title { margin-bottom: 5vh }
.intro__img { position: absolute }
.intro__img--1 { bottom: 35% }
.intro__img--1 { bottom: 50vh }
.intro__img--2 { bottom: 40% }
.intro__img--2 { bottom: 60vh }
.slide { position: relative }
.col--1 { position: relative }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(ScrollToPlugin)
gsap.registerPlugin(SplitText)
gsap.registerPlugin(ScrollSmoother)
gsap.timeline({ delay: 0.5 })
gsap.to(".nav-rect", {
gsap.timeline({ delay: 1.2 })
gsap.timeline({
```

### [Pseudo parallax on hover](https://codepen.io/Volodymyr-Kulyk/pen/gOQvaLX)

on hover of img.img1: div.img1-container: transform, img.img1: transform | made with: :hover · clip-path · 3D (perspective / preserve-3d)

```css
.img1-container { transform: perspective(100px) rotateY(3deg) }
.img1-container:hover { transform: perspective(100px) rotateY(-3deg) }
.img1 { transform: translateX(-5%) rotateY(-3deg) }
.img1:hover { transform: translateX(5%) }
.img2 { clip-path: inset(0 0 0 12%); transform: perspective(100px) translateX(0%) rotateY(3deg) }
.img2:hover { clip-path: inset(0 12% 0 0); transform: perspective(100px) translateX(-10%) rotateY(-3deg) }
```

### [ParallaxEffect](https://codepen.io/bellfym/pen/xxQPBmL)

made with: nothing recognised — read the code

```css
.image { background-position: center; position: relative }
```

### [Horizontal Scrolling Images Over Text w/ Parallax GSAP](https://codepen.io/finlay-x/pen/MWzvXLw)

on scroll: section.panel: transform+opacity+top ×14, div.container: transform+top | on hover of a.jump-btn: section.panel: transform ×14 | made with: mix-blend-mode · GSAP · ScrollTrigger

```css
body { position: relative }
.container { position: relative }
.container.single { position: relative }
.container.single .jump-btn { position: absolute; bottom: 3rem }
.container.single .container-text { position: absolute; inset: 0; mix-blend-mode: color-burn }
.container.single .panel { position: relative }
.container.double { position: relative }
.container.double .row--bottom, .container.double .row--top { position: relative }
.container.double .container-text { position: absolute; inset: 0; mix-blend-mode: color-burn }
.container.double .panel { position: relative }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to(sections, {
scrollTrigger: { trigger: singleContainer, pin: true, start: "top top", end: () => "+=" + innerContainer.offsetWidth, scrub: 1 }
gsap.fromTo(
```

### [Parallax Skybox](https://codepen.io/wakana-k/pen/zYMzmxv)

held: fixed canvas | on scroll: p.: opacity+top ×3 | on hover of a.: p.: opacity ×3 | made with: position: fixed · @keyframes · three.js / WebGL · scroll listener · requestAnimationFrame

```css
body { position: relative; top: 0 }
#container { position: relative }
canvas { position: fixed; top: 0 }
section { position: relative }
h1, h2 { filter: drop-shadow(0 0 2px black) }
#arrow { position: absolute; bottom: 2vh; filter: drop-shadow(0 0 1px black); transform: rotate(90deg); -webkit-animation: arrow 0.8s 0s ease infinite; animation: arrow 0.8s 0s ease infinite }
0% { opacity: 1 }
50% { opacity: 0 }
100% { opacity: 1 }
0% { opacity: 1 }
50% { opacity: 0 }
100% { opacity: 1 }
```

```js
addEventListener("scroll", scrollAction)
requestAnimationFrame(animate)
```

### [Easy Zoom Animation With One Liner](https://codepen.io/nathan-sr/pen/QWJdaMX)

made with: nothing recognised — read the code

### [parallax element test](https://codepen.io/fifteenmania/pen/eYQBxOE)

made with: scroll listener

```js
addEventListener("scroll", handleScroll)
```

### [parallax element](https://codepen.io/manCompiler/pen/zYMoqXX)

made with: transition · scroll listener

```css
[data-scroll] { will-change: transform; transition: 0.4s }
```

```js
addEventListener("scroll", parallaxMove)
```

### [intersection observer test1](https://codepen.io/manCompiler/pen/xxQEYmK)

on scroll: div.: transform, div.: transform+top | made with: transition · IntersectionObserver · scroll listener · requestAnimationFrame

```css
div[data-scroll] { transition: transform .6s cubic-bezier(.17,.67,.3,1) }
```

```js
addEventListener("scroll", (ev) => {
requestAnimationFrame(handleScroll)
new IntersectionObserver(callback, {
```

### [Project 2: Parallax background with JavaScript](https://codepen.io/technoph1le/pen/wvQWbEy)

made with: canvas 2D · requestAnimationFrame

```css
.controls { margin-top: 2rem }
```

```js
requestAnimationFrame(animate)
```

### [Parallax](https://codepen.io/Xaival/pen/BaGKQvq)

made with: 3D (perspective / preserve-3d)

```css
.parallax { perspective: 100px; position: absolute; top: 0; bottom: 0 }
.parallax__layer { position: absolute; top: 0; bottom: -1px }
.parallax__layer__0 { transform: translateZ(-300px) scale(4) }
.parallax__layer__1 { transform: translateZ(-250px) scale(3.5) }
.parallax__layer__2 { transform: translateZ(-200px) scale(3) }
.parallax__layer__3 { transform: translateZ(-150px) scale(2.5) }
.parallax__layer__4 { transform: translateZ(-100px) scale(2) }
.parallax__layer__5 { transform: translateZ(-50px) scale(1.5) }
.parallax__layer__6 { transform: translateZ(0px) scale(1) }
.parallax__layer img { position: absolute; bottom: 0 }
.parallax__cover { position: absolute; top: 100% }
```

### [Apple Vision PRO - App UI](https://codepen.io/gabriele-bessi/pen/BaGowoO)

held: fixed div.logo-wrapper | on scroll: div.circle: transform+top | on hover of img.: div.ui: transform+top | made with: position: fixed · @keyframes · :hover · backdrop-filter · pointer / mouse tracking · requestAnimationFrame

```css
.parallax img { object-position: bottom }
.parallax > img { filter: blur(2px) }
.agumented-ui { position: absolute; bottom: 4rem }
.agumented-ui .sidebar { backdrop-filter: blur(10px); box-shadow: 2px 2px 8px rgba(155, 155, 155), inset 2px 2px 8px rgba(255, 255, 255) }
.agumented-ui .sidebar svg { position: relative }
.selector { position: absolute; top: 0.25rem; box-shadow: 2px 2px 8px rgba(95, 95, 95), inset 2px 2px 8px rgba(175, 175, 175) }
.agumented-ui .icons .row .app { box-shadow: 2px 2px 8px #777, inset 2px 2px 8px #eee }
.logo-wrapper { position: fixed; bottom: 1rem; opacity: 0; animation: fade-in 0.8s linear forwards }
to { opacity: 1 }
.circle { position: absolute; top: 50%; transform: translate3d(-50%, -50%, 0); animation: rotate 3s linear infinite; filter: drop-shadow(0px 0px 6px #fff) }
from { transform: translate3d(-50%, -50%, 0) rotate(0deg) }
to { transform: translate3d(-50%, -50%, 0) rotate(360deg) }
```

```js
addEventListener("pointermove", function (e) {
requestAnimationFrame(render)
```

### [Smooth scroll image gallery with hover effects](https://codepen.io/stefcharle/pen/ExOaBEM)

on scroll: img.is-inview: transform+top ×2, div.header: transform+top, div.image-grid: transform+top, h2.image-header: transform+opacity+top | on hover of div.image-card: h2.image-header: transform+opacity+top ×2 | made with: transition · :hover · GSAP · Lenis / smooth scroll

```css
body { position: relative }
h1, h2, h3, h4, h5, h6 { text-transform: uppercase }
.header h1 { margin-bottom: 3rem }
.header p { padding-bottom: 2rem }
.image-card { position: relative; margin-bottom: 20vh; transition: border-radius 0.75s cubic-bezier(0.65, 0, 0.35, 1) }
.image-card:hover .image-header { opacity: 1; transform: translate(-50%, -50%) scale(1) }
.image-card .image-header { position: absolute; top: 50%; transform: translate(-50%, -50%) scale(1.2); text-transform: uppercase; opacity: 0; transition: all 0.85s cubic-bezier(0.65, 0, 0.35, 1) }
```

```js
gsap.registerPlugin(SplitText)
gsap.timeline()
```

### [Scroll Linked Parallax Landing](https://codepen.io/CodeByHans/pen/GRwgdKE)

held: fixed div.scroller, fixed ul.backdrops | made with: position: fixed · scroll-snap · backdrop-filter · Web Animations API (.animate)

```css
ul.backdrops { position: fixed; inset: 0 }
ul.contents { scroll-snap-type: y mandatory }
.contents > li { scroll-snap-align: center }
.blur { backdrop-filter: blur(15px); -webkit-box-shadow: 0px 9px 30px 0px rgba(0, 0, 0, 0.75); -moz-box-shadow: 0px 9px 30px 0px rgba(0, 0, 0, 0.75); box-shadow: 0px 9px 30px 0px rgba(0, 0, 0, 0.75) }
img { filter: grayscale(0.5) }
.backdrops li { position: absolute; inset: 0 }
.backdrops li:not(:first-of-type) img { transform: translateY(100%) }
.scroller { text-transform: uppercase; position: fixed; top: 1rem }
.scroller:before { position: absolute; inset: 0 }
.scroller .char { position: absolute; top: 50%; transform: translate(-50%, -50%) rotate(calc((360 / var(--char-total)) * var(--char-index) * 1deg)) translateY(var(--radius)) }
```

```js
.animate( [
```

### [Parallax Hover Cards](https://codepen.io/CodeByHans/pen/jOQNxzb)

on scroll: img.: transform+clip-path | on hover of img.: img.: transform+clip-path ×2 | made with: transition · :hover · clip-path · 3D (perspective / preserve-3d)

```css
img { --parallax-position: calc(100%*var(--parallax)/(1 + var(--parallax))); clip-path: inset(0 var(--parallax-position) 0 0 round var(--radius)); transform: perspective(40rem) var(--x-axis, rotateY(var(--angle))); transition: }
img:hover { clip-path: inset(0 0 0 var(--parallax-position) round var(--radius)) }
```

### [GSAP Parallax Effect in ReactJS](https://codepen.io/ashraf-asif/pen/BaqgdJj)

on scroll: img.card-cover: transform+top ×4 | made with: GSAP · ScrollTrigger · Lenis / smooth scroll · requestAnimationFrame

```css
.card { position: relative }
.card-cover-container { position: absolute; inset: 0 }
.card-cover { position: absolute; bottom: 0 }
```

```js
gsap.registerPlugin(ScrollTrigger)
requestAnimationFrame(raf)
gsap.to(card.querySelector(".card-cover"), {
scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true }
```

### [jquery smooth scroll with parallax effects (transform and scale)](https://codepen.io/wiiiyono/pen/QWZRvXR)

held: fixed div.konten | on scroll: img.: transform+top ×3, div.konten: transform+top | on hover of img.: div.konten: transform+top | made with: position: fixed · scroll() timeline · scroll listener · requestAnimationFrame

```css
.slow { position: fixed }
.iw { margin-bottom: 1vw }
```

```js
requestAnimationFrame(c._update))
requestAnimationFrame(c._update) : null
addEventListener("scroll", this._onScroll), this._update()
```

### [A pen by Sarah](https://codepen.io/Aiman-Sheikh-the-bashful/pen/LYgvMBY)

on scroll: div.parallax_layer_3: filter+top | on hover of button.parallax_layer_5: div.parallax_layer_3: filter, button.parallax_layer_5: filter | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.parallax_container { -moz-perspective: 10px; -webkit-perspective: 10px; perspective: 10px }
.parallax_container .basic_setting { position: absolute; top: 0px; -moz-box-shadow: 0px 0px 300px black inset; -webkit-box-shadow: 0px 0px 300px black inset; box-shadow: 0px 0px 300px black inset; -webkit-filter: brightness(100%); filter: brightness(100%);  }
.parallax_container .basic_setting:hover { -webkit-filter: brightness(130%); filter: brightness(130%) }
.parallax_container .parallax_layer_1 { -moz-transform: translateZ(-1px) rotateZ(3deg); -ms-transform: translateZ(-1px) rotateZ(3deg); -webkit-transform: translateZ(-1px) rotateZ(3deg); transform: translateZ(-1px) rotateZ(3deg) }
.parallax_container .parallax_layer_2 { top: -20%; background-position: right; -moz-transform: translateZ(-10px) rotateZ(-2deg); -ms-transform: translateZ(-10px) rotateZ(-2deg); -webkit-transform: translateZ(-10px) rotateZ(-2deg); transform: translateZ(-10px)  }
.parallax_container .parallax_layer_3 { top: 10%; -moz-transform: translateZ(-30px) rotateZ(7deg); -ms-transform: translateZ(-30px) rotateZ(7deg); -webkit-transform: translateZ(-30px) rotateZ(7deg); transform: translateZ(-30px) rotateZ(7deg) }
.parallax_container .parallax_layer_4 { top: 50%; -moz-transform: translateZ(-5px) rotateZ(15deg); -ms-transform: translateZ(-5px) rotateZ(15deg); -webkit-transform: translateZ(-5px) rotateZ(15deg); transform: translateZ(-5px) rotateZ(15deg) }
.parallax_container .parallax_layer_5 { top: 180%; -moz-transform: rotateZ(-15deg); -ms-transform: rotateZ(-15deg); -webkit-transform: rotateZ(-15deg); transform: rotateZ(-15deg); -moz-transition: all 0.3s; -o-transition: all 0.3s; -webkit-transition: all 0.3s }
.parallax_container .parallax_layer_5:focus { -moz-transform: rotateZ(0deg); -ms-transform: rotateZ(0deg); -webkit-transform: rotateZ(0deg); transform: rotateZ(0deg); top: 130% }
.parallax_container .footer { position: absolute; top: 210% }
::-webkit-scrollbar-corner { margin-top: 20px }
```

### [lenis js with parallax effects](https://codepen.io/wiiiyono/pen/oNaOQKm)

on scroll: img.: transform+top ×3 | made with: scroll() timeline · Lenis / smooth scroll

```css
.parallax-section { position:relative }
```

### [Parallax (background attachment)](https://codepen.io/julbrn/pen/WNaWYYx)

made with: nothing recognised — read the code

```css
.parallax { background-position: center }
.parallax__content { padding-top: 10px }
```

### [Simple CSS Parallax](https://codepen.io/mrnandz_/pen/wvYZxGL)

made with: nothing recognised — read the code

```css
.img1, .img2, .img3, .img4, .img5 { position: relative; opacity: 1; background-position: center }
span { top: 30%; text-transform: uppercase }
```

### [Parallax Navigation Menu](https://codepen.io/noirsociety/pen/WNaWJzX)

on hover of a.: div.bg__pattern: transform+opacity+top, div.bg__image: transform | made with: transition · :hover

```css
.wrapper { position: relative }
.header { position: absolute }
.header__diamond { transform: rotate(45deg) }
.menu { position: absolute; top: 50%; transform: translateY(-50%) }
.menu a { text-transform: uppercase; transform: scale(.95); opacity: .25; transition: scale 550ms linear, opacity 250ms linear }
.menu a:first-of-type { transform: scale(1); opacity: 1 }
.menu:hover a:not(:hover) { transform: scale(.95); opacity: .25 }
.menu a:hover { transform: scale(1); opacity: 1 }
.bg__pattern { position: absolute; top: 0; background-position: 0% 0%; transform: translateY(0); transition: background-size 800ms ease, opacity 800ms linear, transform 800ms ease }
.menu:hover ~ .bg__pattern { opacity: .75 }
.menu[data-index='0'] ~ .bg__pattern { transform: translateY(-2%) }
.menu[data-index='1'] ~ .bg__pattern { transform: translateY(-10%) }
```

### [Untitled](https://codepen.io/Aiman-Sheikh-the-bashful/pen/GRYLmdG)

on scroll: div.parallax_layer_3: filter+top | on hover of button.parallax_layer_5: div.parallax_layer_3: filter, button.parallax_layer_5: filter | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.parallax_container { -moz-perspective: 10px; -webkit-perspective: 10px; perspective: 10px }
.parallax_container .basic_setting { position: absolute; top: 0px; -moz-box-shadow: 0px 0px 300px black inset; -webkit-box-shadow: 0px 0px 300px black inset; box-shadow: 0px 0px 300px black inset; -webkit-filter: brightness(100%); filter: brightness(100%);  }
.parallax_container .basic_setting:hover { -webkit-filter: brightness(130%); filter: brightness(130%) }
.parallax_container .parallax_layer_1 { -moz-transform: translateZ(-1px) rotateZ(3deg); -ms-transform: translateZ(-1px) rotateZ(3deg); -webkit-transform: translateZ(-1px) rotateZ(3deg); transform: translateZ(-1px) rotateZ(3deg) }
.parallax_container .parallax_layer_2 { top: -20%; background-position: right; -moz-transform: translateZ(-10px) rotateZ(-2deg); -ms-transform: translateZ(-10px) rotateZ(-2deg); -webkit-transform: translateZ(-10px) rotateZ(-2deg); transform: translateZ(-10px)  }
.parallax_container .parallax_layer_3 { top: 10%; -moz-transform: translateZ(-30px) rotateZ(7deg); -ms-transform: translateZ(-30px) rotateZ(7deg); -webkit-transform: translateZ(-30px) rotateZ(7deg); transform: translateZ(-30px) rotateZ(7deg) }
.parallax_container .parallax_layer_4 { top: 50%; -moz-transform: translateZ(-5px) rotateZ(15deg); -ms-transform: translateZ(-5px) rotateZ(15deg); -webkit-transform: translateZ(-5px) rotateZ(15deg); transform: translateZ(-5px) rotateZ(15deg) }
.parallax_container .parallax_layer_5 { top: 180%; -moz-transform: rotateZ(-15deg); -ms-transform: rotateZ(-15deg); -webkit-transform: rotateZ(-15deg); transform: rotateZ(-15deg); -moz-transition: all 0.3s; -o-transition: all 0.3s; -webkit-transition: all 0.3s }
.parallax_container .parallax_layer_5:focus { -moz-transform: rotateZ(0deg); -ms-transform: rotateZ(0deg); -webkit-transform: rotateZ(0deg); transform: rotateZ(0deg); top: 130% }
.parallax_container .footer { position: absolute; top: 210% }
::-webkit-scrollbar-corner { margin-top: 20px }
```

### [React Cross-Platform Parallax](https://codepen.io/ama5ada/pen/jOeRbQB)

held: sticky div.parallax-background, sticky div.parallax-background, sticky div.parallax-background | made with: position: sticky

```css
.parallax-section-container { position: relative; margin-top: -100vh; top: 100vh }
.parallax-section-container:last-child .parallax-foreground { top: 50% }
.parallax-foreground { position: absolute; top: 25% }
.parallax-background { filter: brightness(50%); background-position: center; position: sticky; top: 0 }
```

### [Parallax](https://codepen.io/ibobtouch/pen/XWxONPa)

on scroll: div.parallax-element: transform+top ×7 | made with: scroll listener

```css
.wrapper { position: relative }
.wrapper .parallax-element { position: absolute }
```

```js
addEventListener('scroll', () => updatePosition())
```

### [Parallax header style](https://codepen.io/rajcsanyiz/pen/GRYwWzz)

on scroll: img.myImage: transform+top | on hover of img.myImage: img.myImage: transform+top | made with: @keyframes · transition · scroll listener · pointer / mouse tracking

```css
.hatterkep { box-shadow: 1px 1px 5px black; position: relative }
.hatterkep img { transform: translate(0, 200px); position: absolute; top: 40%; transform: translate(-50%, -40%); -webkit-transform: translate(-50%, -40%); -ms-transform: translate(-50%, -40%); transition: all 3s linear; animation: colorC }
.hatterkep .ikon-es-szoveg { position: absolute }
0% { filter: sepia(1) hue-rotate(-10deg) }
90% { filter: sepia(1) hue-rotate(-10deg) }
100% { filter: none }
.content { margin-top: 10px }
p.justify { margin-top: 0 }
@keyframes colorChange animates filter
```

```js
addEventListener('scroll', function() {
addEventListener('mousemove', function(getCurrentPos){
```

### [パララックス](https://codepen.io/asuka-inoue/pen/dygqGvq)

on scroll: img.cta__img: transform+filter+top | on hover of a.cta__inner: img.cta__img: transform+filter+top | made with: transition · :hover · GSAP

```css
.cta { position: relative }
.cta__inner:hover .cta__img-wrap { transform: scale(1.05) }
.cta__img { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.cta__img-wrap { position: absolute; top: 0; transition: transform 0.8s ease-out }
.cta__button { margin-top: 40px; transition: color 0.2s, background-color 0.2s }
```

```js
gsap.fromTo('.cta__img',{y:100},{
scrollTrigger:{ trigger:'.cta', start:'top bottom', end:'top top', scrub:1, }
gsap.fromTo('.cta__img',{filter:'blur(10px)'},
scrollTrigger:{ trigger:'.cta', start:'top bottom', end:'top center', scrub:1, }
```

### [Parallax scroll example](https://codepen.io/preetkakkar/pen/bGmjoYa)

made with: nothing recognised — read the code

```css
.full-width { position: relative }
.page-landing { margin-top: -35px }
```

### [GSAP Infinite Scroll Animation](https://codepen.io/flexcode/pen/poxVRpN)

held: fixed section.first, fixed section.second, fixed section.third, fixed section.fourth, fixed section.fifth | on scroll: div.: transform ×23, section.first: opacity, div.bg: transform+top, div.outer: transform+top, div.inner: transform, div.bg: transform | made with: position: fixed · GSAP

```css
body { text-transform: uppercase }
section { top: 0; position: fixed }
section .bg { position: absolute; top: 0; background-position: center }
.fifth .bg { background-position: 50% 45% }
```

```js
gsap.registerPlugin(Observer)
gsap.timeline({
```

### [Art show landing page](https://codepen.io/smudesign/pen/VwEXQqx)

on scroll: div.artist: transform+top ×3, ion-icon.md: transform+top | on hover of img.imgSmall: div.artist: transform+top ×3, ion-icon.md: transform+top, div.bufferContent: transform+opacity | made with: @keyframes · transition · :hover · backdrop-filter · IntersectionObserver

```css
.parallax { background-position: center }
from { transform: translate3d(0, 0, 0) }
to { transform: translate3d(0, 50px, 0) }
#scroll { animation: bounce 0.5s cubic-bezier(0.5, 0.05, 1, 0.5); animation-direction: alternate; animation-iteration-count: infinite }
.bufferContent { transform: translateX(-200px); opacity: 0; transition: all 0.8s ease-in-out }
.bufferContent.active { transform: translateX(0); opacity: 1 }
.btn { background-position: right bottom; transition: all 0.2s ease-out }
.btn:hover { background-position: left bottom }
from { transform: translateY(500px) }
to { transform: translateY(0) }
.artistList.active > .artist { animation: rise 0.8s ease-in-out }
.artist { position: relative }
```

```js
new IntersectionObserver((entries, observer) => {
```

### [CSS Only Floating Parallax Effect](https://codepen.io/flexcode/pen/PoyQvzd)

held: fixed div.watermark-ctr | on scroll: img.: transform+top ×10 | on hover of img.: img.: transform+top ×10 | made with: position: fixed · @keyframes · transition · :hover · clip-path · mix-blend-mode · 3D (perspective / preserve-3d) · GSAP

```css
body { position: relative; perspective: 25rem }
img { position: absolute; top: 0; transform: translateY(200vh); animation: var(--name) var(--duration) linear infinite; box-shadow: 1px 3px 15px rgba(0, 0, 0, 0.5) }
img:nth-child(1) { animation-delay: 0s }
img:nth-child(2) { animation-delay: -3s }
img:nth-child(3) { animation-delay: -6s }
img:nth-child(4) { animation-delay: -15s }
img:nth-child(5) { animation-delay: -12s }
img:nth-child(6) { animation-delay: -15s }
img:nth-child(7) { animation-delay: -18s }
img:nth-child(8) { animation-delay: -21s }
img:nth-child(9) { animation-delay: -24s }
img:nth-child(10) { animation-delay: -27s }
```

```js
gsap.to(button, {
```

### [5.4.23 - mousemove parallax effect](https://codepen.io/hhnna/pen/LYgeRPN)

on scroll: img.layer: transform+top ×3 | made with: pointer / mouse tracking

### [Parallax scrolling effect](https://codepen.io/shirazacks/pen/WNajaeX)

made with: nothing recognised — read the code

```css
.wrap { position: relative }
.parallax { background-position: center }
```

### [3D Parallax Effect](https://codepen.io/devHardik71/pen/dygvMPO)

on scroll: img.: transform+top ×8 | on hover of img.: img.: transform ×8 | made with: transition · mix-blend-mode · scroll listener

```css
* { transition: 0.5s }
section { position: relative }
section::before { position: absolute; bottom: 0 }
section img { position: absolute }
#zaamin { bottom: 0 }
#pyramid { bottom: 80px }
#cover { bottom: 0 }
#stone { bottom: 30px }
#bottom_cloud { bottom: 200px }
#right_cloud { top: 100px }
#left_cloud { top: 250px }
#moon { top: 120px; mix-blend-mode: screen }
```

```js
addEventListener("scroll", function () {
```

### [Flora Perspective - CSS](https://codepen.io/32teeth/pen/xxyExVB)

made with: transition · 3D (perspective / preserve-3d) · custom properties driven by JS

```css
flora { position: relative; perspective: calc(var(--flora-width) / 16 * 1rem); outline-offset: calc(var(--border) * -1); transform: rotateX(var(--rotateX)) rotateY(var(--rotateY)) rotateZ(var(--rotateZ)); transition: transform 0 }
mug, face, yard { position: absolute; top: 0; animation-timing-function: linear; transition: transform 0.5s ease }
mug { transform: translateX(calc(var(--translateX)/var(--factor))) translateY(calc(var(--translateY)/var(--factor))); filter: drop-shadow(calc(24/16 * 1rem) calc(32/16 * 1rem) calc(10/16 * 1rem) rgba(0, 0, 0, 0.5)) }
face { transform: translateX(calc(var(--translateX)/(var(--factor)*2))) translateY(calc(var(--translateY)/(var(--factor)*2))); filter: drop-shadow(calc(24/16 * 1rem) calc(32/16 * 1rem) calc(10/16 * 1rem) black) }
yard { transform: translateX(calc(var(--translateX)/(var(--factor)*3))) translateY(calc(var(--translateY)/(var(--factor)*3))) }
grid { position: absolute }
```

```js
style.setProperty("--rotateX", rotateX + "deg")
style.setProperty("--rotateY", rotateY + "deg")
style.setProperty("--translateX", translateX + "px")
style.setProperty("--translateY", translateY + "px")
style.setProperty("--spanX", count)
style.setProperty("--spanY", count)
addEventListener('mouseenter', (e) => {
style.setProperty("--rotateY", tile.style.getPropertyValue("--rotateY"))
```

### [Lottie animation on scroll - Sort of parallax](https://codepen.io/jvicens/pen/eYPzwVb)

made with: scroll listener

```css
h1 { text-transform: uppercase }
.first-section { padding-top: 20px }
.second-section { padding-top: 20px }
.third-section { padding-top: 20px }
```

```js
addEventListener('scroll', onScroll, false)
```

### [Parallax (Weathering-with-you)](https://codepen.io/rheeeuro/pen/RweaYdv)

on scroll: img.character: transform+top, img.hand: transform | on hover of img.character: img.character: transform+top, img.hand: transform+top | made with: scroll-snap · @keyframes

```css
.wrapper { scroll-snap-align: start; position: relative }
.character { position: absolute; top: 50%; animation: breathe 2s ease-in-out infinite; transform: translate(-50%, -50%) }
.hand { top: 30%; position: absolute; transform: translate(-50%, -50%); animation: tremble 0.5s ease-in-out infinite }
0% { transform: translate(-50%, -50%) }
50% { transform: translate(-50%, -48%) }
100% { transform: translate(-50%, -50%) }
0% { transform: translate(-50.25%, -0.25%) }
25% { transform: translate(-49.75%, 0%) }
50% { transform: translate(-50.25%, 0.25%) }
75% { transform: translate(-49.75%, 0%) }
100% { transform: translate(-50.25%, -0.25%) }
@keyframes breathe animates transform
```

### [Lens flare effect (Weathering-with-you)](https://codepen.io/rheeeuro/pen/bGmpxZG)

on scroll: img.hand: transform | made with: transition

```css
.wrapper { position: relative; transform: scaleX(-1) }
.hand { position: absolute; bottom: -60%; transform: translate(-60%, -45%) scaleX(-1); transition: transform 1s ease-out }
.light { position: absolute; top: -20% }
.light2 { position: absolute; top: -20%; opacity: 0.3 }
.lensflare { position: absolute; animation: fadeInOut 5s ease-in-out infinite }
.wrapper { background-position: 30% 0% }
.light { top: 0%; transform: scaleX(-1) }
.light2 { top: 0%; transform: scaleX(-1) }
.hand { top: 40% }
```

```js
addEventListener("mouseenter", (e) => {
addEventListener("mouseleave", (e) => {
```

### [Animated-poster (Weathering-with-you)](https://codepen.io/rheeeuro/pen/LYgNJrQ)

on scroll: img.title: transform | made with: pointer / mouse tracking

```css
.background-video { position: relative }
.title { position: absolute; top: 35%; transform: translate(-50%, -50%) }
.wrapper { position: relative }
.background-video { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

```js
addEventListener("mousemove", (e) => {
```

### [Parallex Scroll](https://codepen.io/Darshil_varia/pen/RweaLgb)

made with: mix-blend-mode · scroll listener

```css
section { position: relative }
section::before { position: absolute; bottom: 0 }
section img { position: absolute; top:0 }
#moon { mix-blend-mode: screen }
#text { position: absolute }
.page1 { position: absolute }
```

```js
addEventListener('scroll', () => {
```

### [CSS Parallax Tilt Effect Card With JavaScript | Card Tilt On Hover](https://codepen.io/a7rarpress/pen/qBJZZPv)

made with: transition · :hover · 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking

```css
h1 { padding-top: 2rem }
.wrap { -webkit-transform: perspective(100rem); transform: perspective(100rem) }
.container { position: relative; -webkit-transform: rotateX(calc(var(--rX) * 1deg)) rotateY(calc(var(--rY) * 1deg)); transform: rotateX(calc(var(--rX) * 1deg)) rotateY(calc(var(--rY) * 1deg)); background-position: var(--bX) var(--bY) }
.container::before, .container::after { position: absolute; opacity: .3; transition: .3s }
.container::before { top: 2rem }
.container::after { bottom: 2rem }
.container--active { transition: none }
.image2 { -webkit-filter: hue-rotate(80deg) saturate(140%); filter: hue-rotate(80deg) saturate(140%) }
```

```js
addEventListener('mousemove', this.handleMouseMove)
addEventListener('mouseenter', this.handleMouseEnter)
addEventListener('mouseleave', this.handleMouseLeave)
```

### [Parallax Gallery](https://codepen.io/gerwld/pen/poxyvrg)

made with: Web Animations API (.animate)

```css
#gallery-container { position: absolute; top: 50%; transform: translate(0, -50%) }
.image { object-position: 100% 50% }
```

```js
.animate( {
```

### [Unkown Font](https://codepen.io/KACTOPKA/pen/yLRLEyr)

made with: transition · scroll listener

```css
.heading { margin-top: calc(100vh / 2 - 7rem); position: absolute; top: 0 }
.heading { transition: transform .3s }
```

```js
addEventListener('scroll', () => {
```

### [No JS Parallax](https://codepen.io/milijan/pen/NWOWYbG)

made with: 3D (perspective / preserve-3d)

```css
main { perspective:2px }
section { position: relative }
.parallax::after { position: absolute; top: 0; bottom:0; transform: translateZ(-1px) scale(1.6) }
```

### [Parallax Menu CSS Only - Under 75 Lines of Code](https://codepen.io/littleartsydreams/pen/eYLwMzL)

on scroll: a.: color+top | on hover of a.: a.: color ×2 | made with: transition · :hover

```css
* { transition: 0.4s }
.bars { position: relative }
```

### [Parallax Background Image Zoom خلفية مع شريط قوائم](https://codepen.io/a7rarpress/pen/dyqEeGV)

held: fixed div.header, fixed div.move-background | on hover of a.: div.: background | made with: position: fixed · transition · :hover · 3D (perspective / preserve-3d)

```css
.header { position: fixed; top: 0 }
.header .blur { opacity: .2; filter: blur(1px); position: absolute; top: 0; bottom: 0 }
.header .nav { position: absolute }
div.center { position: fixed; top: 0; bottom: 0 }
div.wrapper { position: absolute; top: 0 }
div.hero { position: relative; top: 0px; transform: translate3d(15px, 13px, 0px) }
div.hero-image { position: absolute; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); transition: all 1s linear }
```

### [Change Navbar Color After 100vh](https://codepen.io/jaredgroff/pen/jOvREJB)

held: fixed nav.navbar | made with: position: fixed · transition · backdrop-filter

```css
.navbar { backdrop-filter: blur(12px); position: fixed; top: 0; transition: 350ms cubic-bezier(0.65, 0, 0.35, 1) }
.nav-link, #brand { text-transform: uppercase; transition: 350ms cubic-bezier(0.65, 0, 0.35, 1) }
.hero { background-position: center }
```

### [Pure JavaScript Parallax Scrolling Animation](https://codepen.io/Creepercraft206/pen/xxaMPbR)

held: fixed div.blob, fixed div.blob, fixed div.blob, fixed svg.[object | on scroll: div.blob: filter ×3 | made with: position: fixed · @keyframes · scroll listener

```css
#blob { position: fixed; margin-top: 200px; filter: blur(30px) }
#blob2 { position: fixed; margin-top: 600px; filter: blur(30px) }
#blob3 { position: fixed; margin-top: 300px; rotate: -150deg; filter: blur(30px) }
.blob { filter: blur(30px); animation: blob 5s infinite }
0% { filter: blur(30px) }
50% { filter: blur(50px) }
100% { filter: blur(30px) }
#logo { position: fixed; transform: translateX(-50%); margin-top: 20vh }
h1 { position: relative; transform: translateX(-50%); margin-top: 45vh; margin-bottom: 500px }
#main { border-top: 1px solid white }
@keyframes blob animates filter
```

```js
addEventListener("scroll", () => {
```

### [parallax on mouse movement v2 (give a ❤️ pls!)](https://codepen.io/Chun-Yuan/pen/jOvpZJw)

on scroll: div.parallax-item: transform+top | made with: pointer / mouse tracking

```css
.parallax-container { position: relative }
.parallax-item { position: absolute; top: 0; background-position: center center }
```

```js
addEventListener('mousemove', function(e) {
```

### [parallax on mouse movement v1 (give a ❤️ pls!)](https://codepen.io/Chun-Yuan/pen/jOvKVva)

made with: pointer / mouse tracking

```js
addEventListener("mousemove", parallax)
```

### [Firewatch Intro](https://codepen.io/mariawarnes/pen/KKxQLer)

on scroll: div.slide: opacity | on hover of button.: div.bg: transform+opacity | made with: position: fixed · transition · :hover · 3D (perspective / preserve-3d) · pointer / mouse tracking · requestAnimationFrame · Web Animations API (.animate)

```css
body { position: fixed; top: 0 }
.wrap { position: relative; top: calc(20px * -0.5); filter: blur(5px) }
.bg { position: absolute; top: 0; background-position: center center; transform: translateZ(0) scale(1, 1); opacity: 0 }
.interval { position: absolute; top: 0; bottom: 0; opacity: 0 }
.dialogue { top: 50%; transform: translate(-50%, -50%); position: absolute; opacity: 0 }
p { margin-top: 0 }
p:last-child { margin-bottom: 0 }
.caps { margin-bottom: 0 }
.smallcaps { text-transform: lowercase; margin-bottom: 0 }
.smallcaps + .smallcaps { margin-top: 1rem }
button { border-bottom: 2px solid transparent; position: relative; opacity: 1; transition: opacity 2s, left 2s, right 2s, top 2s, bottom 2s }
button.hidden { opacity: 0 }
```

```js
requestAnimationFrame(moveBackground)
addEventListener("mousemove", (e) => {
.animate([{ opacity: 0 },{ opacity: 1 }], { duration: fadeDuration * 1000 }).onfinish = (event) => {
.animate([
.animate( [{ cy: 2000 }, { cy: 760 }],
```

### [Emily is going to space | Pure CSS parallax landing w/ ChatGPT & Midjourney](https://codepen.io/Jers/pen/NWLXBBq)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.parallax-wrapper { perspective: 10px }
header { position: relative }
header h1 { position: absolute; transform: translateZ(-15px) scale(2.5); top: 0; margin-bottom: 0; margin-top: 15vmin }
section.story { position: relative; transform: translateZ(0px) }
section.story:before { position: absolute; top: -8vw }
section.story h2 { margin-top: 0; margin-bottom: 4rem }
section .inner { perspective: 10px; position: relative }
section .inner p:nth-child(1) { margin-top: 0 }
.parallax-el { position: absolute; transform-origin: center bottom }
section strong { position: relative; text-transform: capitalize }
section strong:after { position: absolute; transform: rotate(358deg) }
.parallax-el[data-paralax="4"] { transform: translateZ(-50px) translateY(110vmax) scale(600%) }
```

### [旋轉的畫廊｜Scroll Gallery](https://codepen.io/garena-tw-eng/pen/xxaPepo)

held: fixed div.bg-container, fixed div.image-container | made with: position: fixed · scroll-snap

### [Parallax Scrolling with Skrollr](https://codepen.io/jaredgroff/pen/PodJBEP)

held: fixed div.skrollable, fixed div.skrollable, fixed div.skrollable, fixed div.skrollable, fixed div.skrollable | on scroll: div.skrollable: opacity ×2 | made with: position: fixed

```css
div { position: fixed; top: 50%; opacity: 0 }
```

### [Untitled](https://codepen.io/Charmon97/pen/ZEMXJbm)

on hover of div.card-wrap: div.card: shadow, div.card-bg: opacity, div.card-info: transform+top, p.: opacity+top | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
h1 + p, p + p { margin-top: 10px }
.card-wrap { transform: perspective(800px) }
.card-wrap:hover .card-info { transform: translateY(0) }
.card-wrap:hover .card-info p { opacity: 1 }
.card-wrap:hover .card-info, .card-wrap:hover .card-info p { transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1) }
.card-wrap:hover .card-info:after { transition: 5s cubic-bezier(0.23, 1, 0.32, 1); opacity: 1; transform: translateY(0) }
.card-wrap:hover .card-bg { transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1), opacity 5s cubic-bezier(0.23, 1, 0.32, 1); opacity: 0.8 }
.card-wrap:hover .card { transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 2s cubic-bezier(0.23, 1, 0.32, 1); box-shadow: rgba(255, 255, 255, 0.2) 0 0 40px 5px, white 0 0 0 1px, rgba(0, 0, 0, 0.66) 0 30px 60px 0, inset #333 0 0 0 5px,  }
.card { position: relative; box-shadow: rgba(0, 0, 0, 0.66) 0 30px 60px 0, inset #333 0 0 0 5px, inset rgba(255, 255, 255, 0.5) 0 0 0 6px; transition: 1s cubic-bezier(0.445, 0.05, 0.55, 0.95) }
.card-bg { opacity: 0.5; position: absolute; top: -20px; background-position: center; transition: 1s cubic-bezier(0.445, 0.05, 0.55, 0.95), opacity 5s 1s cubic-bezier(0.445, 0.05, 0.55, 0.95) }
.card-info { position: absolute; bottom: 0; transform: translateY(40%); transition: 0.6s 1.6s cubic-bezier(0.215, 0.61, 0.355, 1) }
.card-info p { opacity: 0; transition: 0.6s 1.6s cubic-bezier(0.215, 0.61, 0.355, 1) }
```

### [Pure CSS Parallax Effect - No Scrollbox](https://codepen.io/ebmoreno/pen/PodJWqo)

held: sticky nav.bg-dark | on hover of li.: a.nav-link: color | made with: position: sticky · transition · :hover · :has() · 3D (perspective / preserve-3d)

```css
:root { --perspective: 1 }
body { perspective: calc(var(--perspective) * 1px); position: relative }
nav { position: sticky; top: 0 }
cite a, .nav-link { transition: color 0.3s ease }
main { position: relative; transform: translateZ(0) }
.parallax-container { padding-top: 20vh }
.background-layer::before { position: absolute; top: 0; background-position: center; transform: translateZ(calc(var(--backgroundZ) * 1px)) scale(calc(1 + (var(--backgroundZ) * -1) / var(--perspective))) }
.midground-layer { transform: translateX(50%) translateY(-50%) translateZ(calc(var(--midgroundZ) * 1px)) scale(calc(1 + (var(--midgroundZ) * -1) / var(--perspective))) }
.midground-layer p { margin-top: -25px }
.foreground-layer { margin-top: -10%; transform: translateZ(0) }
section[aria-labelledby="references"] { margin-top: 100px }
```

### [Efecto Parallax](https://codepen.io/nilza-de-la-barra/pen/WNgjwQx)

made with: nothing recognised — read the code

```css
main { background-position: center center }
```

### [OneLoop.js - Parallax 2](https://codepen.io/n-langle/pen/GRXmgQz)

made with: transition

```css
.title { position: relative; text-transform: uppercase }
.title::before { position: absolute; top: 50%; transform: rotate(-45deg) }
.title .st-line > span { transform: translateY(100%); transition: transform 0s cubic-bezier(0.19, 1, 0.22, 1) }
.title.is-visible .st-line > span { transform: translateY(0) }
h2 { margin-bottom: 1.38em }
.container { position: relative }
.bubble { opacity: 0; position: absolute }
header > svg { opacity: 0; transform: translateY(100px); transition: opacity 1s 0.5s, transform 1s 0.5s cubic-bezier(0.19, 1, 0.22, 1) }
header .is-visible + svg { opacity: 1; transform: translateY(0) }
.gallery { position: relative }
.gallery__row:nth-child(2) { position: relative }
section { margin-bottom: 100px; margin-top: 100px }
```

### [Footer parallax](https://codepen.io/SuperOuf/pen/eYLvNyP)

made with: nothing recognised — read the code

```css
footer { position: relative; margin-top: 25vw }
footer::after { position: absolute; top: -25vw }
footer #trees, footer #hills { position: absolute }
footer #hills { bottom: 0% }
footer #trees { bottom: 99% }
```

### [OneLoop.js - Parallax](https://codepen.io/n-langle/pen/jOvqbgz)

on scroll: img.: transform+top ×3, span.st-line-inner: transform+top ×2, h1.: transform+opacity+top | on hover of img.: img.: transform+top ×3, h1.: transform+opacity+top | made with: transition · :hover

```css
.hero { padding-top: 24vh; position: relative }
.hero__images { padding-top: 66.66%; position: relative }
.hero__images img { position: absolute; top: 0 }
.content__text h2 { opacity: 0 }
.content__text h2 .st-line span { opacity: inherit; transform: translateY(100%); transition: opacity 0.5s, transform 0.5s ease-out }
.content__text h2.is-visible { opacity: 1 }
.content__text h2.is-visible .st-line span { transform: translateY(0) }
.content__text p { opacity: 0; transition: opacity 2s }
.content__text p.is-visible { opacity: 1 }
.content h2 { margin-bottom: 0.5em }
.content p { margin-bottom: 1em }
.content :last-child { margin-bottom: 0 }
```

### [Parallax Grid Scrolling Effect](https://codepen.io/AlexandreREVIRE/pen/zYJrowz)

on scroll: div.parallax-grid-item: transform+top ×10, section.placeholder-section-1: transform+top, section.parallax-grid-container: transform+top, section.placeholder-section-2: transform+top, span.c-scrollbar: opacity, span.c-scrollbar_thumb: transform+top | on hover of a.: div.parallax-grid-item: transform+top ×20, section.placeholder-section-1: transform+top, section.parallax-grid-container: transform+top, section.placeholder-section-2: transform+top, span.c-scrollbar_thumb: transform+top | made with: Lenis / smooth scroll

### [Draggable Parallax Slider (Linear Interpolation)](https://codepen.io/noirsociety/pen/MWqamLO)

made with: pointer / mouse tracking · requestAnimationFrame

```css
.slider-image { background-position: center }
```

```js
requestAnimationFrame(update)
addEventListener('pointermove',move,false)
```

### [Parallax Scroll Slider (Linear Interpolation)](https://codepen.io/noirsociety/pen/xxawdWJ)

held: fixed main.slider | made with: position: fixed · scroll listener · requestAnimationFrame

```css
.slider { position: fixed; top: 50%; transform: translate(-50%,-50%) }
.slider-track { position: absolute }
.slider-image { background-position: center }
```

```js
requestAnimationFrame(update)
addEventListener('scroll',move,false)
```

### [Triple-Column Scroll with Different Scroll Speeds](https://codepen.io/ol-ivier/pen/oNMKEYL)

made with: Lenis / smooth scroll · scroll listener · requestAnimationFrame

```css
.grille img { padding-bottom:2em }
.moved { will-change: transform }
```

```js
requestAnimationFrame(() => {
addEventListener("scroll", onScroll)
requestAnimationFrame(raf)
```

### [Marquee effect with GSAP and Swiper](https://codepen.io/humming-design/pen/eYjobQY)

held: fixed div | on scroll: div.marquee-carousel: transform+top ×2, div.: transform+top | on hover of a.: div.marquee-carousel: transform+top ×2, div.: transform+top | made with: transition · :hover · GSAP · ScrollTrigger

```css
a { -webkit-transition: all 0.3s ease-in-out; -moz-transition: all 0.3s ease-in-out; -ms-transition: all 0.3s ease-in-out; -o-transition: all 0.3s ease-in-out; transition: all 0.3s ease-in-out }
.marquee { position: relative }
.marquee-carousel.marquee-carousel-1 { margin-bottom: 11px }
.marquee-carousel.marquee-carousel-1 { margin-bottom: 16px }
.marquee-carousel.marquee-carousel-1 { margin-bottom: 23px }
.marquee-items { position: relative }
```

```js
gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
gsap.timeline()
ScrollTrigger.create({
```

### [Simple Parallax](https://codepen.io/alexdevio/pen/ExpMEGq)

on scroll: div.parallax: transform+top ×4 | made with: pointer / mouse tracking · requestAnimationFrame

```css
.parallax { position: absolute }
.parallax--one { top: 0 }
.parallax--two { top: 10% }
.parallax--three { top: 20% }
.parallax--four { top: 25% }
```

```js
addEventListener('mousemove', function(event) {
requestAnimationFrame(updateParallax)
addEventListener('mouseleave', function() {
```

### [Draggable Parallax Slider](https://codepen.io/noirsociety/pen/XWBOqoR)

made with: pointer / mouse tracking · Web Animations API (.animate)

```css
.carousel-track { position: absolute; top: 50%; transform: translate(0,-50%) }
.carousel-image { object-position: center }
```

```js
.animate({transform:`translate(${nextPercentage}%,-50%)`},options)
.animate({objectPosition: `${nextPercentage+100}% 50%`},options))
addEventListener('pointermove',move,false)
```

### [Illustration parallax on hero section | HTML5, SCSS, JavaScript, GSAP](https://codepen.io/Zajno/pen/YzjRaOe)

on scroll: div.: transform+opacity+top ×7, div.parallax-item: transform+top ×3, span.header-text: transform+opacity+top, ul.header-menu: transform+opacity+top | on hover of li.header-link: div.: transform+opacity+top ×7, div.parallax-item: transform+top ×3, span.header-text: transform+opacity, ul.header-menu: transform+opacity+top, div.subtitle: transform+opacity+top | made with: transition · GSAP · ScrollTrigger

```css
input:-webkit-autofill, input:-webkit-autofill:focus, textarea:-webkit-autofill, { -webkit-transition: background-color 100000000000000000000000000000s 0s, color 100000000000000000000000000000s 0s; transition: background-color 100000000000000000000000000000s 0s, color 100000000000000000000000000000s 0s }
input::-webkit-contacts-auto-fill-button { position: absolute }
input[type=text], input[type=number], input[type=email], input[type=tel], textar { box-shadow: inset 0 0 0 150px rgba(255, 255, 255, 0) !important; -webkit-box-shadow: inset 0 0 0 150px rgba(255, 255, 255, 0) !important }
body { position: relative }
.subtitle { position: relative }
.subtitle-left-arrow { position: absolute; top: 50%; transform: translateY(-50%) }
.subtitle-right-arrow { position: absolute; top: 50%; transform: translateY(-50%) }
.subtitle-bg { position: absolute; top: 0 }
.subtitle .btn-1 { text-transform: uppercase }
.btn { position: relative }
.btn-left-arrow { position: absolute; top: 50%; transform: translateY(-50%) }
.btn-right-arrow { position: absolute; top: 50%; transform: translateY(-50%) }
```

```js
gsap.registerPlugin(CustomEase, ScrollTrigger, SplitText)
gsap.timeline({
scrollTrigger: { trigger: heroSection, start: 'top top', end: 'bottom bottom-=15%', scrub: 1, }
gsap.timeline()
```

### [RGB tilt effect - Portfolio showcase](https://codepen.io/gijs/pen/oNMyLzJ)

on hover of a.bg-gradient-to-b: div.bg-gradient-to-br: transform, div.js-tilt-glare-inner: transform+opacity+top | made with: @keyframes · backdrop-filter · 3D (perspective / preserve-3d)

```css
.tilt-rgb:after { position: absolute; inset: 0; filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow); transition- }
.tilt-rgb:before { position: absolute; inset: 0; --tw-bg-opacity: 1; filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop- }
.tilt-shadow:after { position: absolute; inset: 0; filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow); transition- }
@keyframes a animates --a
```

### [Bootstrap Navbar with Parallax Banner](https://codepen.io/victor-kiss/pen/YzjLXob)

made with: nothing recognised — read the code

```css
div.banner { background-position: center }
```

### [VASISHT idea1](https://codepen.io/vasishtP/pen/dyjZrMO)

made with: nothing recognised — read the code

```css
.bgimg-1, .bgimg-2, .bgimg-3 { position: relative; opacity: 10; background-position: center }
.caption { position: absolute; top: 50% }
.edu { position: relative }
h3 { text-transform: uppercase; text-align: top }
input[type="text"], input[type="password"], input[type="email"] { margin-bottom: 1em }
```

### [3D Car animation model-viewer & GSAP](https://codepen.io/jorgecheevers/pen/qByVJyB)

on scroll: svg.[object: transform+top, div.title: transform+opacity, div.swiper: opacity | on hover of a.uppercase: svg.[object: transform+top, div.title: transform+opacity | made with: GSAP

```css
[data-color]::before { position: absolute; inset: -5px }
```

```js
gsap.to(slider, {
gsap.to(title, innerAnimationActive)
gsap.to(e, {
gsap.to(loading, {
gsap.to(car, carPosition(exposure1, orbit1, target1))
gsap.to(car, carPosition(exposure2, orbit2, target2))
gsap.to(car, carPosition(exposure3, orbit3, target3))
gsap.to(inner1, innerAnimationActive)
```

### [Parallax with just Vanilla JS](https://codepen.io/samzabala/pen/bGjYRBm)

on scroll: span.: transform+top ×4 | made with: transition · :hover · backdrop-filter · 3D (perspective / preserve-3d) · custom properties driven by JS · scroll listener

```css
section { opacity: 0; transition: opacity 0.75s ease-in-out }
body.ready section { opacity: 1 }
hr { opacity: 0.4; border-top: 5px double }
h1, h2, h3, h4, h5, h6 { margin-bottom: 1rem }
h1:nth-child(n+2), h2:nth-child(n+2), h3:nth-child(n+2), h4:nth-child(n+2), h5:n { margin-top: 0.5em }
h4, h5, h6 { text-transform: uppercase }
code { text-transform: none }
h1:last-child { margin-bottom: 0 }
:is(p,ol,ul):nth-last-child(n+2) { margin-bottom: 2rem }
li { margin-top: 0.5em }
li :is(ol,ul) { margin-bottom: 0 }
.section-blocks img:nth-last-child(n+2) { margin-bottom: 1em }
```

```js
style.setProperty('--parallax-calculation','0')
style.setProperty('--parallax-calculation',calcedTransform)
addEventListener('scroll', doParallax)
```

### [TailwindCSS Carousel](https://codepen.io/disguy-droid/pen/wvxrPEL)

made with: scroll-driven animation (animation-timeline) · view() timeline

### [GSAP 3 - Mouse Parallax (w/ Tailwind)](https://codepen.io/clement_pdr/pen/NWBvVZe)

on scroll: section.absolute: transform | made with: GSAP · pointer / mouse tracking

```js
addEventListener("mousemove", e => {
gsap.to("#header-banner", {
```

### [Parallax effect](https://codepen.io/kubris_pro/pen/QWBgGEz)

held: fixed div.parallax-mirror, fixed div.parallax-mirror, fixed div.parallax-mirror, fixed div.parallax-mirror, fixed div.parallax-mirror | on scroll: div.parallax-mirror: transform+top, img.parallax-slider: transform+top | made with: transition · :hover · backdrop-filter · requestAnimationFrame

```css
a { transition: 0.2s ease }
h2 { margin-top: -10px; margin-bottom: 20px }
.box-shadow { box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px) }
.parallax { position: relative }
.main-title { position: relative }
.prl-title { position: relative }
.watermark { position: absolute; top: 20px }
footer { text-transform: uppercase }
.copyright { position: relative; transition: all 0.2s ease-in }
.copyright::before, .copyright::after { position: absolute; bottom: 12px; transition: all 0.2s ease-in }
```

```js
requestAnimationFrame(s), !1
requestAnimationFrame(s)
```

### [Scroll Parallax effect](https://codepen.io/kubris_pro/pen/LYBLbVR)

made with: scroll listener · requestAnimationFrame

```css
.parallax { position: relative; background-position: center }
.parallax-brand { position: absolute; top: 15px }
```

```js
addEventListener('scroll', function(){
```

### [Parallax scroll with fixed bg](https://codepen.io/kubris_pro/pen/bGjWQNG)

made with: requestAnimationFrame

```css
[class^="pimg"] { position: relative; opacity: 0.8; background-position: center }
.ptext { position: absolute; top: 50%; text-transform: uppercase }
```

### [Parallax scroll with images](https://codepen.io/kubris_pro/pen/eYjWLXq)

made with: transition · :hover · requestAnimationFrame

```css
.same-content { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.same-content h1 { margin-bottom: 30px }
.same-content button { text-transform: uppercase; transition: 0.3s ease-in-out }
.same-content button:hover { box-shadow: inset 0 0 10px 3px #ccc }
.parallax { position: relative; background-position: center; opacity: 0.9 }
```

### [Sunshine Reggae Parallax](https://codepen.io/moxsim/pen/VwBapJw)

on scroll: div.: transform | on hover of img.: div.: transform+top ×3 | made with: nothing recognised — read the code

```css
.scene div { position: absolute }
```

### [Harry Potter and the Deathly Hallows | Parallax Scrolling | ThreeJS](https://codepen.io/janeRivas/pen/eYjZZdx)

held: fixed div.is-loading-msg, fixed div, fixed div.dg | made with: position: fixed · @keyframes · transition · 3D (perspective / preserve-3d) · three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

```css
.is-loading canvas { opacity: 0 }
.is-loading .is-loading-msg { opacity: 1 }
.is-loading-msg { position: fixed; top: 50%; transform: translate(-50%, -50%); opacity: 0; transition: opacity 300ms ease-in-out }
.is-loading-msg::after { position: absolute; bottom: -10px; -webkit-animation: loading infinite 1s alternate ease-in-out; animation: loading infinite 1s alternate ease-in-out }
#images { position: fixed }
from { transform: translate3d(-50%, 0, 0) }
to { transform: translate3d(50%, 0, 0) }
from { transform: translate3d(-50%, 0, 0) }
to { transform: translate3d(50%, 0, 0) }
@keyframes loading animates transform
```

```js
requestAnimationFrame(animate)
addEventListener('wheel', event => {
addEventListener('mousemove', event => {
```

### [Merry Christmas Codepen !](https://codepen.io/onediv/pen/zYLGeQw)

on scroll: div.scene__layer: filter ×7, div.scene__content: transform, div.scene__layer: filter+top | on hover of a.scene__trigger-cell: div.scene__layer: filter ×7, div.scene__content: transform, div.scene__layer: filter+top | made with: transition · :hover · clip-path · 3D (perspective / preserve-3d)

```css
.scene { position: relative; perspective: 200000px; clip-path: circle(288.8888888889px) }
.scene:before { position: absolute; inset: 0; box-shadow: inset 10px 10px 30px 30px black }
.scene__content { position: absolute; inset: 0; perspective: 200000px; transition: 300ms linear transform }
.scene__trigger-cell { position: relative }
.scene__layer { position: absolute; inset: 0; filter: drop-shadow(0 0 10px #00000050); transition: 300ms linear filter }
.scene__layer:nth-child(1) { transform: translatez(80px) }
.scene__layer:nth-child(2) { transform: translatez(160px) }
.scene__layer:nth-child(3) { transform: translatez(240px) }
.scene__layer:nth-child(4) { transform: translatez(320px) }
.scene__layer:nth-child(5) { transform: translatez(400px) }
.scene__layer:nth-child(6) { transform: translatez(480px) }
.scene__layer:nth-child(7) { transform: translatez(560px) }
```

### [Space Parallax](https://codepen.io/ccapon/pen/GRBRbmo)

held: fixed h1.title-text | made with: position: fixed

```css
.header { position: relative }
.header-img { padding-top: 12em }
.title-text { position: fixed; padding-top: 1em; text-transform: uppercase }
.main-text { position: relative }
```

### [Corner parallax effect](https://codepen.io/ludviglindblom/pen/RwBwvmX)

on scroll: h1.text-layer: transform+top ×2 | made with: clip-path · pointer / mouse tracking

```css
body { position: relative }
.cropped-container { position: absolute; top: 0; -webkit-clip-path: xywh(0 0 50% 100%); clip-path: xywh(0 0 50% 100%) }
h1 { position: absolute }
.side { position: relative }
.left { transform: skewY(-15deg) }
.right { transform: skewY(15deg) }
.right h1 { opacity: 0.4 }
```

```js
addEventListener("mousemove", parallaxText)
```

### [Intersection Observer + requestAnimationFrame Parallax Vanilla JS](https://codepen.io/web_walking_nak/pen/RwBwrEB)

on scroll: div.js-parallax__item: transform+top ×5 | made with: IntersectionObserver · requestAnimationFrame

```css
h1 { margin-bottom: 10vh }
.test-area01-box { position: relative }
.test-area02 { position: absolute; bottom: -50px }
.test-area02-box { position: relative }
.test-area04 { position: absolute; bottom: -50px }
```

```js
requestAnimationFrame(parallaxFunk.bind(entry.target))
new IntersectionObserver(observerFunc)
requestAnimationFrame(parallaxFunk)
```

### [Intersection Observer + Scroll Event Parallax Vanilla JS](https://codepen.io/web_walking_nak/pen/gOjOPjd)

on scroll: div.js-parallax-elm: transform+top ×4 | made with: IntersectionObserver · scroll listener · requestAnimationFrame

```css
h1 { margin-bottom: 10vh }
.test-area01-box { position: relative }
.test-area02 { position: absolute; bottom: -50px }
.test-area02-box { position: relative }
.test-area04 { position: absolute; bottom: -50px }
```

```js
new IntersectionObserver(observerFunc, {
requestAnimationFrame(parallaxFunk.bind(target))
addEventListener('scroll', function() {
addEventListener('scroll', listener, {passive: true})
```

### [Simple Parallax Vanilla JS](https://codepen.io/web_walking_nak/pen/rNrNxYO)

on scroll: div.js-parallax-elm: transform+top ×5 | made with: scroll listener · requestAnimationFrame

```css
h1 { margin-bottom: 10vh }
.test-area01-box { position: relative }
.test-area02 { position: absolute; bottom: -50px }
.test-area02-box { position: relative }
.test-area04 { position: absolute; bottom: -50px }
```

```js
requestAnimationFrame(parallaxFunk)
addEventListener('scroll', function(){
```

### [Parallax Scrolling Website (CSS Only)](https://codepen.io/talib-ibrahim/pen/GRBKXgy)

made with: scroll() timeline

```css
.img-1, .img-2, .img-3, .img-4, .img-5 { background-position: center; filter: opacity(0.8) brightness(0.8) }
.section p { position: relative; top: 12px }
.section-1 { position: relative; top: 300px }
.section-1 button { position: relative; top: 40px }
.section-2 h1, .section-3 h1, .section-4 h1, .section-5 h1 { border-bottom: 2px solid rgb(7, 132, 115) }
```

### [scroll parallax effect on SVG](https://codepen.io/siddharth-nalwaya/pen/Yzvodbb)

held: fixed section, fixed svg.[object | made with: position: fixed · transition · backdrop-filter · mix-blend-mode · scroll listener

```css
svg { position: fixed; bottom: -5rem; transform: rotateZ(-30deg) }
section h1 { mix-blend-mode:difference; backdrop-filter: blur(15px) }
section:nth-child(1) { position: fixed }
svg path { transition: stroke-dashoffset 0.1s, fill 1s }
```

```js
addEventListener('scroll', fillSVGPath)
```

### [Video sample + parallax with limits](https://codepen.io/DemGam/pen/YzvodOB)

made with: position: sticky · transition · scroll listener

```css
.wrapper { position: relative }
.tt, .rr { position: relative }
.tt video, .rr video { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.astronaut { transform: rotate(-60deg); top: 0 }
.mm { position: relative }
```

```js
addEventListener("scroll", (event) => {
```

### [Snowflakes using JS Canvas](https://codepen.io/misterhonk/pen/mdKYxbq)

held: fixed canvas | made with: position: fixed · canvas 2D · requestAnimationFrame

```css
canvas { position: fixed }
```

```js
requestAnimationFrame(update)
```

### [Parallax Banner](https://codepen.io/mradermaker/pen/KKebOOL)

on hover of button.c-button: button.c-button: background+color | made with: transition · :hover

```css
.c-button { text-transform: uppercase; transition: background-color 0.25s ease-in-out, color 0.25s ease-in-out }
.c-parallax-banner { position: relative }
.c-parallax-banner__picture { position: absolute; top: 0 }
.c-parallax-banner__picture:before { position: absolute; top: 0; opacity: 75% }
```

### [2010's parallax - challenge](https://codepen.io/akalaws/pen/MWXzrGW)

held: fixed img.layer-image-1, fixed div.layer-image-1 | made with: position: fixed

```css
.layer-image-1 { position:fixed }
.layer-text { position: absolute; top: 5vh }
p { padding-top: 1rem }
.flex .card { box-shadow: 2px 2px 20px rgba(0,0,0,0.5) }
.image-wide { position:relative; bottom:-1rem }
footer { bottom:0 }
```

### [The Easiest Website Menu That Will Wow Any User - Christmas Menu](https://codepen.io/stevenmonson/pen/rNKqEdR)

held: fixed div | on hover of li.: a.: opacity+top ×4, a.: color+top | made with: position: fixed · transition · :hover · mix-blend-mode · custom properties driven by JS

```css
.menu li a { transition:0.25s cubic-bezier(0.16, 0.35, 0.44, 1) }
.menu li:not(:first-child) a { border-top:solid 2px #fff2 }
.menu ul:hover li a { opacity:0.3; scale:0.985 }
.menu ul li:hover a { opacity:1; //scale:1.025 }
.menu-background-pattern { position:absolute; top:0; background-position: 50% 1%; transition:0.25s cubic-bezier(0.16, 0.35, 0.44, 1) }
.menu ul:hover ~ .menu-background-pattern { background-position: 50% calc( -64px * var(--currentMenu, 0) ) }
.menu-background-image { position:absolute; inset:0 0 0 0; background-position: 0% calc( -16px * var(--currentMenu, 1) ); opacity:0.25; //mix-blend-mode: multiply; transition:0.25s cubic-bezier(0.16, 0.35, 0.44, 1) }
#menuPointer { position:absolute; top: calc( var(--pointerY, -100) * 1px + 0.1em ); transition: 0.45s cubic-bezier(0.26, 1.56, 0.4, 0.92) }
#magicBox { position:fixed; top:calc( var(--pointerY, -900) * 1px ); transition: 0.45s cubic-bezier(0.26, 1.56, 0.4, 0.92) }
#magicBox.open { top:4px; transition: 1s cubic-bezier(0.2, 1, 0.23, 1.02) }
#magicCloseBtn { //opacity:0.1; position:absolute; top:-0.5em; opacity:0 }
#magicBox.open #magicCloseBtn { opacity:1 }
```

```js
style.setProperty('--currentMenu', index + 1)
style.setProperty('--pointerY', LinkDimensions.top)
style.setProperty('--pointerX', LinkDimensions.left)
style.setProperty('--pointerH', LinkDimensions.height)
style.setProperty('--pointerW', LinkDimensions.width)
```

### [Glass Cube Parallax Shader](https://codepen.io/MillerTime/pen/RwJyGMW)

held: fixed canvas.a-canvas, fixed div.a-orientation-modal, fixed div.tip | on hover of button.a-enter-vr-button: button.a-enter-vr-button: background | made with: position: fixed · three.js / WebGL

```css
.tip { position: fixed; top: 4px; opacity: 0.25 }
```

### [Parallax Hover cards](https://codepen.io/joshuaaron/pen/NWzMxmw)

on hover of div.card: div.card: transform+top | made with: transition · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.card { box-shadow: 0 2px 20px rgba(10, 10, 10, 0.54); transition: var(--duration) ease-out; transform: perspective(500px) rotateX(var(--rx)) rotateY(var(--ry)) }
```

```js
addEventListener('mousemove', e => {
addEventListener('mouseleave', () => {
```

### [Untitled](https://codepen.io/nitya_ns/pen/poKaNBy)

held: fixed svg.[object, fixed a.btn, fixed button.btn | on scroll: path.[object: transform+top ×14, path.[object: transform ×3, path.[object: transform+opacity+top, g.[object: transform+top | on hover of a.btn: path.[object: transform+top ×13, path.[object: transform ×3, path.[object: transform+opacity+top, g.[object: transform+top, a.btn: background+color | made with: position: fixed · transition · :hover · mix-blend-mode · GSAP · ScrollTrigger

```css
svg { position: fixed; top: 0 }
.scrollElement { position: absolute; top: 0 }
.btn { position: fixed; bottom: 5%; transform: translateX(-50%); transition: all .3s }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline()
ScrollTrigger.create({
gsap.fromTo("#bird", { opacity: 1 }, {
gsap.to("#bird", { scaleX: 1, rotation: 0 }) },
gsap.to("#bird", { scaleX: -1, rotation: -15 }) },
gsap.fromTo("#bats", { opacity: 1, y: 400, scale: 0 }, {
gsap.to(item, { scaleX: 0.5, yoyo: true, repeat: 11, duration: 0.15, delay: 0.7 + (i / 10), transformOrigin: "50% 50%" })
```

### [Create a Parallax Scrolling Effect (With Contrasting Text)](https://codepen.io/tutsplus/pen/BaVJEeP)

held: fixed footer.page-footer | on scroll: h1.h1: transform+top, div.h1: transform+top | made with: position: fixed · scroll listener

```css
body { margin-top: 70px }
.section-hero .hero-title-clone { position: absolute }
.section-hero .hero-img-wrapper { position: relative; margin-top: -10vh }
.section-hero ~ .section { position: relative }
.section-text { margin-top: 20vh }
.section-text::before { position: absolute; top: 0; bottom: 0 }
.section-text div { position: relative }
.section-text p { margin-top: 20px }
.section-last p { margin-top: 5px }
.notification { position: absolute; top: 0 }
.page-footer { position: fixed; bottom: 50px }
```

```js
addEventListener("scroll", function () {
```

### [Parallax Scroll](https://codepen.io/dhruvaldesai/pen/MWXpZZG)

held: fixed svg.[object, fixed a.btn, fixed button.btn | on scroll: path.[object: transform+top ×14, path.[object: transform ×3, path.[object: transform+opacity+top, g.[object: transform+top | on hover of a.btn: path.[object: transform+top ×13, path.[object: transform ×3, path.[object: transform+opacity+top, g.[object: transform+top, a.btn: background | made with: position: fixed · transition · :hover · mix-blend-mode · GSAP · ScrollTrigger

```css
svg { position: fixed; top: 0 }
.scrollElement { position: absolute; top: 0 }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline()
ScrollTrigger.create({
gsap.fromTo("#bird", { opacity: 1 }, {
gsap.to("#bird", { scaleX: 1, rotation: 0 }) },
gsap.to("#bird", { scaleX: -1, rotation: -15 }) },
gsap.fromTo("#bats", { opacity: 1, y: 400, scale: 0 }, {
gsap.to(item, { scaleX: 0.5, yoyo: true, repeat: 11, duration: 0.15, delay: 0.7 + (i / 10), transformOrigin: "50% 50%" })
```

### [Alternate scroll directions texts background clip - Scroll Btween demo 2](https://codepen.io/olivier3lanc/pen/oNyYBRr)

made with: nothing recognised — read the code

```css
#wrapper-playground { padding-top: 20vh }
#element { text-transform: uppercase }
```

### [Bird and text parallax - Scroll Btween JS demo 1](https://codepen.io/olivier3lanc/pen/eYKJpRw)

made with: mix-blend-mode

```css
.wrapper-playground { position: relative; top: 0; background-position: 40% center }
.wrapper-playground::before { padding-bottom: 66.66% }
figure { position: absolute; top: 0 }
header h1 { margin-top: 0; margin-bottom: 0 }
header h1 span { position: relative }
header p { mix-blend-mode: difference }
#detector { position: absolute; top: 100vh }
```

### [Image parallax](https://codepen.io/PecouB/pen/YzvXaVE)

on scroll: div.ip-ctn: transform+top ×3 | made with: scroll() timeline · scroll listener · requestAnimationFrame

```css
image-parallax { padding-top:64% }
.el2 { margin-top:200px }
```

```js
addEventListener('scroll', () => {
requestAnimationFrame( () => this.scroll() )
```

### [Art with Parallax.js （HTML+CSS）](https://codepen.io/YEL-ne/pen/LYrVZqQ)

on scroll: li.layer: transform ×13 | made with: transition · :hover · mix-blend-mode

```css
.background_linear { box-shadow: 0 0 1vmin #0004, 0 3vmin 2vmin -1vmin #0004 }
.background_left_part1 { margin-top: 3vw; box-shadow: 0 0 1vmin #0004, 0 3vmin 2vmin -1vmin #0004 }
.background_left_part2 { margin-top: 7vw }
.background_left_part3 { margin-top: 14vw; box-shadow: 0 0 1vmin #0004, 0 3vmin 2vmin -1vmin #0004 }
.background_left_part4 { margin-top: 5.05vw }
.background_mid_part1 { margin-top: 13vw }
.background_mid_part2 { margin-top: 25vw; box-shadow: 0 0 1vmin #0004, 0 3vmin 2vmin -1vmin #0004 }
.background_mid_part3 { margin-top: 30vw }
.background_right_part1 { margin-top: 0vw; box-shadow: 0 0 1vmin #0004, 0 3vmin 2vmin -1vmin #0004 }
.background_right_part2 { margin-top: 3vw }
.background_right_part3 { margin-top: 3vw }
.background_top_part1 { margin-top: 0vw }
```

### [Simple Parallax](https://codepen.io/PecouB/pen/dyKoYVJ)

on scroll: div.item: transform+top ×3 | made with: scroll() timeline · scroll listener · requestAnimationFrame

```css
section { padding-top:60px }
.item2 { margin-top:30px }
```

```js
addEventListener('scroll', () => {
requestAnimationFrame( () => this.scroll() )
```

### [Teste de efeito Parallax](https://codepen.io/wellington-sn/pen/qBKWeLd)

made with: nothing recognised — read the code

```css
header section { position: relative }
header article { position: absolute; text-transform: uppercase; top: 50%; transform: translate(-50%, -50%) }
section.primeiraimagem { background-position: center center; box-shadow: inset 3px 3px 9px rgba(0, 0, 0, 0.466) }
section.imagem { position: relative; box-shadow: inset 3px 3px 9px rgba(0, 0, 0, 0.466); background-position: center center }
section > h2 { padding-top: 75px; padding-bottom: 20px }
section > p { padding-bottom: 25px }
section.imagem > article { text-transform: uppercase; position: absolute; top: 50%; transform: translate(-50%, -50%) }
section.imagemfinal { position: relative; background-position: center center }
article.final { text-transform: uppercase; position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

### [Scroll Effect: Paint the Page](https://codepen.io/demahalsafy/pen/OJELBZa)

made with: scroll listener

```css
#brush, #paint { position: absolute }
#brush { transform: rotate(180deg) translate(50%, 0); top: 50px }
#paint { transform: translate(-50%, 0); top: 70px }
```

```js
addEventListener('scroll', function(){
addEventListener("scroll", handleScroll)
```

### [42 Málaga Parallax Project](https://codepen.io/Liberius/pen/gOzEomE)

made with: 3D (perspective / preserve-3d)

```css
.wrapper { perspective: 10px }
header { position: relative }
.background { transform: translateZ(-10px) scale(2) }
.foreground { transform: translateZ(-5px) scale(1.5) }
.background, .foreground { position: absolute }
.title { margin-top: auto }
.first { margin-top: 20px }
footer { position: relative }
.footer_img { position: absolute }
```

### [eagle parallax](https://codepen.io/gabri57/pen/MWGZxdb)

made with: transition · 3D (perspective / preserve-3d) · pointer / mouse tracking · requestAnimationFrame

### [shark parallax](https://codepen.io/gabri57/pen/bGMOQyG)

made with: transition · 3D (perspective / preserve-3d) · pointer / mouse tracking · requestAnimationFrame

### [dawn](https://codepen.io/barthendrix/pen/WNJyLPV)

held: fixed svg.[object, fixed svg.[object | on scroll: path.[object: color+top ×63, g.[object: color+top ×12, g.[object: transform+opacity+color+top ×5, path.[object: opacity+color+top ×4, path.[object: transform+color+top ×2, g.[object: transform+color+top ×2 | made with: position: fixed · GSAP · ScrollTrigger

```css
.container { position: relative }
.artwork { position: fixed; bottom: 0 }
.sky { position: fixed; top: 0 }
.dragonfly__wing, .bee__wing { filter: blur(0.5px) }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(MotionPathPlugin)
gsap.timeline()
gsap.timeline({ defaults: { ease: 'none' } })
ScrollTrigger.create({
gsap.to('.sun', {
scrollTrigger: { trigger: container, scrub: 0.75, start: 'top +=50%', end: '+=60%' }
```

### [Parallax Scrolling Effect | Vanilla JS](https://codepen.io/cgrkzlkn/pen/yLjzPmp)

made with: scroll listener

```css
.parallax-item h2 { text-transform: uppercase }
.parallax-item:nth-child(3) { background-position: center }
```

```js
addEventListener("scroll", function () {
```

### [parallax car](https://codepen.io/MaryMax/pen/mdLmPVo)

held: fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start | on scroll: g.[object: transform+top ×3 | made with: GSAP

```js
gsap.timeline({scrollTrigger:{
```

### [ScrollTrigger Basic Parallax](https://codepen.io/MaryMax/pen/QWrvypP)

held: fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start | on scroll: img.background: transform+top, img.middleground: transform+top, img.foreground: transform+top, img.text: transform+top | made with: GSAP

```css
.demo img { position:absolute; filter: brightness(1.3) }
.demo { position:relative; filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#2e2155', endColorstr='#040313',GradientType=1 ) }
```

```js
gsap.timeline({scrollTrigger:{
```

### [Easy Parallax](https://codepen.io/dili3n/pen/WNJpGJN)

on scroll: img.img-gauche: transform+top, img.img-droite: transform+top | made with: scroll listener

```css
.img-gauche, .img-droite { margin-top: -200px }
.titre-parallax { margin-bottom: 35px; margin-top: 50px }
.black1 { position: relative }
.black2 { position: relative }
.title { position: relative; padding-top: 20px }
```

```js
addEventListener("scroll", function () {
```

### [Multi Background Parallax Effect - CSS Only](https://codepen.io/32teeth/pen/QWrNgRv)

made with: @keyframes

```css
body { background-position: 0 bottom; animation: scroll 60s linear infinite }
0% { background-position: 0 bottom }
100% { background-position: calc(-1704px/1.25) bottom, calc(-1704px/2) bottom, calc(-1704px/3) bottom, calc(-1704px/4) bottom, calc(-1704px/1) bottom, calc(-1704px/5) bottom, calc(-1704px/10) bottom, calc(-1704px/1) bottom }
@keyframes scroll animates background-position
```

### [Parallax Zoom Scroll](https://codepen.io/paolopersia/pen/zYjqwvG)

on scroll: img.parallax_cover: transform+top ×9 | made with: scroll() timeline

```css
h1 { margin-bottom: 0px }
.container { position: relative }
.col-lg-3 { position: relative }
.col-lg-6 { position: relative }
figure { position: relative; background-position: center center }
```

### [GSAP | Putting it All Together](https://codepen.io/mogo68/pen/MWGayyy)

on scroll: div.: transform+opacity+top ×8, div.: transform+top ×3 | made with: GSAP · ScrollTrigger

```css
#title-section h1 { text-transform: uppercase }
#sp-sub-wrapper h2 { margin-bottom: 5vh }
#sp-slide-rt-wrapper { opacity: 0.6 }
#sp-slide-rt-wrapper h1 { margin-bottom: 2.5rem }
#sp-slide-rt-wrapper p { padding-bottom: 2rem }
#sp-slide-lt-wrapper { opacity: 0.6 }
#sp-slide-lt-wrapper h1 { margin-bottom: 2.5rem }
#sp-slide-lt-wrapper p { padding-bottom: 2rem }
.centered-text h1 { margin-bottom: 2.5rem }
.centered-text p { margin-bottom: 2rem }
#plx-wrapper section { position: relative }
#plx-wrapper .plx-bg { position: absolute; top: 0; background-position: center }
```

```js
gsap.registerPlugin(ScrollTrigger, SplitText)
gsap.from(splitSubLines, {
scrollTrigger: { trigger: target, // markers: { // startColor: "purple", // endColor: "fuchsia", // fontSize: "1.5rem", // }
gsap.from(container, {
gsap.from(spSlRtLines, {
scrollTrigger: { trigger: target, // markers: { // startColor: "pink", // endColor: "fuchsia", // fontSize: "1.5rem", // }
gsap.from(spSlLtLines, {
scrollTrigger: { trigger: target, // markers: { // startColor: "pink", // endColor: "fuchsia", // fontSize: "1.5rem" // }
```

### [Parallax Flipping Cards | Sass Only](https://codepen.io/Rei_Kama414/pen/gOzpGmN)

on hover of div.card: div.card: transform+shadow | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.card { transition: all 0.7s cubic-bezier(0.4, 0.2, 0.2, 1); -o-transition: all 0.7s cubic-bezier(0.4, 0.2, 0.2, 1); -moz-transition: all 0.7s cubic-bezier(0.4, 0.2, 0.2, 1); -webkit-transition: all 0.7s cubic-bezier(0.4, 0.2, 0 }
.card:hover { box-shadow: 0 0 28px white; transform: rotateY(179deg) }
.card .front, .card .back { position: absolute }
.card .front h1, .card .back h1 { margin-top: 0 }
.card .front h1::after, .card .back h1::after { position: absolute; bottom: -0.28rem }
.card .front h1, .card .front span, .card .front p, .card .back h1, .card .back  { transform: translateZ(60px) }
.card .back { transform: rotateY(179deg) }
```

### [CSS only parallax scrolling](https://codepen.io/chriiss/pen/GRdgzdg)

made with: nothing recognised — read the code

```css
.section-background { background-position: center }
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

### [Simple Scroll-Snap](https://codepen.io/whitefang033/pen/WNzLrbm)

made with: scroll-snap

```css
h1 { position:relative; top:40% }
.container { scroll-snap-type: y mandatory }
section { scroll-snap-align: start }
```

### [build grid on scroll](https://codepen.io/wesp/pen/RwMJXaN)

held: sticky div.wrap | on scroll: div.item: transform+top ×18 | made with: position: sticky

```css
.bigwrap { margin-top: 100vh; margin-bottom: 100vh; position: relative }
.wrap { position: sticky; top: 30vh }
```

### [Fundo de texto animado com efeito parallax - Desafio 14/30 de 30 dias de CSS(Animated text background with parallax effect - 30 Day CSS 14/30 Challenge)](https://codepen.io/theslladev/pen/bGvMgdV)

made with: @keyframes

```css
h1 { -webkit-animation: parallax 10s linear infinite; animation: parallax 10s linear infinite }
0% { background-position: 0 0 }
100% { background-position: 500px -1000px }
0% { background-position: 0 0 }
100% { background-position: 500px -1000px }
@keyframes parallax animates background-position
```

### [CSS only parallax tilt](https://codepen.io/alexerlandsson/pen/yLKKwao)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.tile { position: relative }
.tile__layout { --perspective: 500px; transform: perspective(var(--perspective)) rotateX(var(--rotate-x)) rotateY(var(--rotate-y)); transition: transform 200ms ease; box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2) }
```

### [Site parallax](https://codepen.io/h-lautre/pen/abYYBGE)

held: fixed div.barre-menu, fixed nav.dropdownmenu, fixed img | on scroll: div.trail: opacity+top, div.core: opacity+top | on hover of a.: a.: opacity | made with: position: fixed · @keyframes · transition · :hover · scroll listener

```css
.barre-menu { position: fixed; top: 4 }
.dropdownmenu { position: fixed; top: 40px }
.dropdownmenu li { position: relative }
.dropdownmenu a { -webkit-transition: all .25s ease; -moz-transition: all .25s ease; -ms-transition: all .25s ease; -o-transition: all .25s ease; transition: all .25s ease }
#submenu { opacity: 0; position: absolute; top: 35px }
li:hover ul#submenu { opacity: 1; top: 40px }
#btn { transform: translatey(100px) }
.star { position: absolute; animation-iteration-count: infinite }
.shooting { position: relative; top: 30%; transform: rotateZ(-45deg) }
.shooting .core { position: absolute; top: 0; box-shadow: 0px 0px 3px 1px #ffffff, 0px 0px 10px 5px #fffffff1; animation: 6s linear infinite core }
.shooting .trail { position: absolute; top: -1px; animation: 6s linear infinite trail }
0% { opacity: 1 }
```

```js
addEventListener('scroll', function() {
```

### [Parallex Effect](https://codepen.io/HamdeePen/pen/mdxpXRZ)

held: fixed div.main-content, fixed div.main-content | made with: position: fixed · 3D (perspective / preserve-3d)

```css
body { perspective: 1px }
.parallex { position: relative }
.parallexOne::before, .parallexTwo::before { position: absolute; top: 0; bottom: 0; transform: translateZ(-1px) scale(2) }
.about { position: relative }
.about h1, .about p { text-transform: uppercase; opacity: 0.8 }
.main-content { position: fixed }
h1 { opacity: 0.8 }
body { perspective: 1px }
.parallex { position: relative }
.parallexOne::before, .parallexTwo::before { position: absolute; top: 0; bottom: 0; transform: translateZ(-1px) scale(2) }
.about { position: relative }
.about h1, .about p { text-transform: uppercase; opacity: 0.8 }
```

### [Star Background Animation](https://codepen.io/saaim-k/pen/QWmqvPB)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```js
addEventListener('mousemove', function(e){
addEventListener('mouseleave', function(e){
```

### [Parallax on mouse move](https://codepen.io/b3o/pen/jOzLZxv)

made with: nothing recognised — read the code

### [Mouse parallax](https://codepen.io/tnnrkvch/pen/bGvgORM)

on scroll: div.: transform+top | on hover of li.: div.: transform+top | made with: transition · :hover · pointer / mouse tracking · Web Animations API (.animate)

```css
header { position: relative; top: 0 }
.intro { position: absolute }
.intro h1 { margin-top: 0 }
#gallery { position: absolute }
#gallery { position: absolute }
.tile { position: relative; transition: transform 200ms ease }
.tile:hover { transform: scale(1.3) }
.tile:hover > img { opacity: 1; transform: scale(1) }
.tile > img { opacity: 1; transition: opacity 200ms ease, transform 200ms ease }
```

```js
addEventListener("mousemove", throttle((e) => {
.animate( {
```

### [Parallax Starfield - Vanilla JS/CSS](https://codepen.io/smcnally000/pen/mdxOpWp)

made with: transition · mix-blend-mode · custom properties driven by JS · pointer / mouse tracking · requestAnimationFrame

```css
.sky-background { position: absolute }
.sky-background .sky-segment { position: absolute; top: calc(0% - (calc(var(--sizeDifferential) / 2))); transform: translate(calc(((var(--sizeDifferential) / 2) * var(--differentialX)) / 2), calc(((var(--sizeDifferential) / 2) * var(--differentialY))  }
.shootingstar { position: absolute; transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1), background-color 1.6s cubic-bezier(0.16, 1, 0.3, 1); transform: translate(0, 0) }
.shootingstar.shoot { transform: translate(var(--shootingEndX), var(--shootingEndY)) }
```

```js
style.setProperty('--shootingEndX', `${randomNum(500)}px`)
style.setProperty('--shootingEndY', `${randomNum(100)}px`)
style.setProperty('--sizeDifferential', `${skySizeStart - 100}%`)
style.setProperty('--starSize', `${starSizeStart}px`)
style.setProperty('--bgSize', `${bgSizeStart}%`)
style.setProperty('--rotation', `${rotationRandomizer}deg`)
addEventListener('mousemove', event => {
style.setProperty('--differentialX', `${currentX}`)
```

### [Vanilla JS Responsive Parallax Menu.](https://codepen.io/thisusedtobeanemail/pen/rNdxOqy)

held: fixed nav | on scroll: a.: color ×2 | made with: position: fixed · transition · scroll listener

```css
#nav { position: fixed; top: 0 }
#nav ul li a { text-transform: capitalize }
#nav .ham { position: absolute; top: 12px }
.ham span { transition: margin 0.25s 0.25s, transform 0.25s }
.ham .bar1 { margin-bottom: 8px }
.ham .bar3 { margin-top: 8px }
.ham.active span { transition: margin 0.25s, transform 0.25s 0.25s }
.ham.active .bar1 { margin-top: 8px; margin-bottom: -4px; transform: rotate(45deg) }
.ham.active .bar2 { transform: rotate(45deg) }
.ham.active .bar3 { margin-top: -4px; transform: rotate(135deg) }
#contents > div h2 { text-transform: uppercase }
```

```js
addEventListener("scroll", function (evt) {
```

### [Nəzrinn <3](https://codepen.io/xxlhayrex/pen/OJvyoaW)

made with: :hover · scroll listener · requestAnimationFrame

```css
header { position: relative }
header .content { position: absolute; top: 0; bottom: 0 }
header h2 { text-transform: uppercase; margin-top: -0.5em }
header hgroup { -webkit-transform: translate(-50%, -50%); -moz-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); -o-transform: translate(-50%, -50%); transform: translate(-50%, -50%); position: absolute; top: 50% }
header .overlay { position: absolute; top: 0; bottom: 0; opacity: 0; -webkit-filter: blur(4px) }
.site { position: relative }
.site nav { position: absolute; top: 0 }
```

```js
addEventListener("scroll", this.onScroll.bind(this), false)
```

### [Mountain parallax test](https://codepen.io/jamiem89/pen/XWEmYGm)

on scroll: h1.: transform+top | on hover of img.: h1.: transform+top | made with: GSAP

```css
.hero { position: relative; background-position: 0% 0% }
.hero__fore { position: absolute; bottom: 0 }
.hero__fore img { position: absolute; top: 0; -o-object-position: top center; object-position: top center }
.hero-bg { position: absolute; top: 25vh }
.hero-bg h1 { opacity: 0.8 }
.intro h2 { margin-bottom: 60px }
```

```js
gsap.to(scrollSection, {
scrollTrigger: { trigger: scrollSection, scrub: 3 }
gsap.to(scrollTitle, {
scrollTrigger: { trigger: scrollSection, scrub: 2, start: '60% center', end: '90% center' }
```

### [Scale image on scroll](https://codepen.io/shdvargas/pen/XWEbxwj)

held: sticky img | made with: position: sticky · transition · IntersectionObserver

```css
p:nth-child(1) { margin-top: 0 }
#image-to-scale { position: sticky; top: 1rem; will-change: transform; transition: transform 300ms linear, filter 300ms linear }
```

```js
new IntersectionObserver(handleIntersect, options)
```

### [basic parallax](https://codepen.io/newrya/pen/LYdVREo)

made with: scroll listener

```js
addEventListener("scroll", function() {
```

### [Parallax Hover Effect](https://codepen.io/stephenhealey86/pen/ZErZVmr)

made with: @keyframes · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.letter { animation: name-intro 1s linear forwards }
from { filter: drop-shadow(-5px -5px 2px #02feff) drop-shadow(-5px -5px 2px #fd00fb) }
to { filter: none }
@keyframes name-intro animates filter, text-shadow
```

```js
addEventListener('mousemove', mouseMove)
addEventListener('mouseleave', clearStyle)
```

### [Parallax with a single JS function](https://codepen.io/tundedosa/pen/eYVxKVm)

on scroll: g.[object: transform+top ×4, path.[object: transform+opacity+top ×2 | made with: clip-path · scroll listener · requestAnimationFrame

```css
.dark { position: relative }
```

```js
addEventListener('scroll', function(e) {
requestAnimationFrame(function() {
```

### [Simple Parallax](https://codepen.io/labelnoir/pen/PoQXeWp)

on scroll: img.: transform+top ×2 | made with: transition · :hover · GSAP

```css
.bg { position: absolute; top: 0; opacity: 0.1 }
.bg::after { position: absolute; top: 0 }
h1 { margin-top: 35vh; margin-bottom: 35vh }
.images .column:nth-child(2n-1) { margin-top: 10vh }
button { margin-top: 35vh; margin-bottom: 35vh; transition: all 0.15s ease }
```

```js
gsap.timeline({
scrollTrigger: { trigger: ".images", start: "top bottom", end: "bottom top", scrub: true }
```

### [only html-css](https://codepen.io/awmirhosen/pen/qBxQRQe)

made with: nothing recognised — read the code

```css
.header { background-position: left }
.text-box h1 { margin-bottom: 80px }
.text-box button { margin-top: 50px }
.text-box p { opacity: 80% }
.menu { position: absolute; padding-top: 18px !important }
.menu > li { padding-bottom: 8px !important }
.first { border-bottom:5px solid #1A2056 }
```

### [Header Only html-css](https://codepen.io/awmirhosen/pen/PoQxqVY)

made with: nothing recognised — read the code

```css
.left { background-position: center }
.text-box { opacity: 70% }
.text-box > div > p { margin-top: 60px }
.text-box > div > button { margin-top: 30px }
.text { position: absolute; top: 50% }
```

### [Mouse-Based Parallax Hero](https://codepen.io/JoshuaVB/pen/ZErXjWx)

on scroll: div.hero__image: opacity+clip-path+top | on hover of img.: div.hero__image: opacity+top | made with: @keyframes · clip-path · pointer / mouse tracking

```css
.hero { position: relative }
.hero::after { position: absolute; bottom: 0 }
.hero__inner { position: relative; padding-top: 62.51% }
.hero__inner::before { position: absolute; top: 0; bottom: 0; animation: intro 1s forwards }
.hero__image { position: absolute; top: 0 }
.hero__image img { position: relative }
.hero__image--sun { animation: sunrise 1.5s forwards }
.hero__image--sparkle { animation: sparkle 6s infinite }
.hero__image--leaf1::before { position: absolute; top: 13.9%; transform: rotate(135deg); animation: pulse 4s infinite }
.hero__image--leaf2::before { position: absolute; top: 45.5%; transform: rotate(46deg); animation: pulse 4s infinite; animation-delay: 2s; clip-path: polygon(11% 45%, 21% 14%, 28% 0, 100% 0, 100% 100%, 30% 100%, 21% 85%, 18% 73%) }
.hero__image--leaf4::before { position: absolute; top: 85.9%; transform: rotate(125deg); animation: pulse 4s infinite; animation-delay: 1s }
.hero__image--leaf6::before { position: absolute; top: 26.5%; transform: rotate(27deg); animation: pulse 4s infinite }
```

```js
addEventListener('mousemove',parallaxHero)
```

### [custom parallax](https://codepen.io/chintalkreya/pen/PoQjNMm)

on scroll: div.bg_img: transform+top | made with: scroll() timeline · transition

```css
.bg_img { position: absolute; background-position: center; top: -90%; bottom: -90%; transition: all 0.9s; -o-transition: all 0.9s; -ms-transition: all 0.9s; -moz-transition: all 0.9s; -webkit-transition: all 0.9s }
.image-wrap { position: relative; background-position: center }
```

### [parallax using jarallax](https://codepen.io/chintalkreya/pen/wvyeGWW)

held: fixed img.jarallax-img, fixed img.jarallax-img | on scroll: img.jarallax-img: transform+top ×2 | made with: nothing recognised — read the code

```css
.jarallax { position: relative }
.jarallax > .jarallax-img { position: absolute; top: 0 }
```

### [Parallax/Fixed Peek-Through Gradients](https://codepen.io/maddiskillz/pen/poaRYKg)

made with: transition · :hover · custom properties driven by JS

```css
.button { transition: all 0.2s ease-in-out }
a { background-position: center top; padding-bottom: 0.08em; box-shadow: inset 0 var(--bs-height) 0 0 var(--clr-bg); transition: color 0.3s ease-in-out, box-shadow 0.6s ease-in-out }
a:hover, a:focus { box-shadow: inset var(--element-width) var(--bs-height) 0 0 var(--clr-bg) }
.fancy-border { background-position: center top }
.fancy-rule { background-position: center top }
.fancy-border.button { box-shadow: none }
.fancy-border .button { box-shadow: none }
```

```js
style.setProperty('--element-width', element.offsetWidth + 'px') )
style.setProperty('--element-width', width)
```

### [ScrollTrigger: SVG Text Mask](https://codepen.io/animationbro/pen/yLvgMqK)

held: fixed div.main | on scroll: image.[object: transform+top ×7, g.[object: transform | made with: GSAP · ScrollTrigger

```css
div { position:absolute }
```

```js
gsap.timeline({scrollTrigger:{trigger:'.scrollDist', start:'top top', end:'bottom bottom', scrub:1}})
gsap.to('.arrow', {y:10, duration:0.8, ease:'back.inOut(3)', overwrite:'auto'})
gsap.to('.arrow', {y:0, duration:0.5, ease:'power3.out', overwrite:'auto'})
gsap.to(window, {scrollTo:innerHeight, duration:1.5, ease:'power1.inOut'})
```

### [Tribute Page (Princess Diana) 🔥 FCC](https://codepen.io/mfg888/pen/oNEBjbo)

made with: :hover

```css
h1 { margin-bottom: 0; margin-top: 20px }
.title-container p { margin-top: 0 }
.margin { margin-bottom: 50px }
.trib { background-position: center }
.card p { margin-top: 0 }
.trib3 { background-position: top }
.trib5 { background-position: top }
```

### [PushIn.js - Vanilla JavaScript](https://codepen.io/nateplusplus/pen/ZErBoYv)

held: sticky div.pushin-scene | on scroll: div.pushin-layer: transform+opacity+top ×2 | made with: nothing recognised — read the code

### [CSS Ghost | Parallax](https://codepen.io/sabin42/pen/rNJaJpR)

on scroll: div.ghost-position: transform, div.ghost: transform+top, div.eyes: transform+top | made with: @keyframes · transition · :hover

```css
.ghost-parallax-container { position: relative }
from { transform: scale(0.75) translate(0, 1.5rem) }
to { transform: scale(0.75) translate(0.625rem, 0) }
10%, 90% { transform: translate3d(-0.125rem, 0, 0) }
25%, 50%, 75% { transform: translate3d(-0.25rem, 0, 0) }
40%, 60% { transform: translate3d(0.25rem, 0, 0) }
.ghost-position { transition: opacity 0.8s ease }
.ghost-position:hover { opacity: 0; animation: ghostHoverAnimation 0.5s ease; animation-fill-mode: forwards }
.ghost { position: relative; animation: ghostAnimation 2s ease; animation-fill-mode: both; animation-iteration-count: infinite; animation-direction: alternate-reverse }
.ghost .ghost-head { position: relative }
.ghost .ghost-head .eyes { position: relative; top: 2rem }
.ghost .ghost-head .eyes .eye { position: relative }
```

### [🪜 Escalators Parallax](https://codepen.io/iampaulchevrier/pen/KKQKOby)

made with: transition · :hover · scroll listener

```css
header { position: relative; top: 0 }
header .logo { text-transform: uppercase }
header ul li a { transition: 0.5s }
.home-section { position: relative }
.home-section:before { position: absolute; bottom: 0 }
.home-section img { position: absolute; top: 0 }
.about-section { position: relative }
.about-section:before { position: absolute; bottom: 0 }
.about-section h2 { margin-bottom: 0.65em }
.about-section h3 { margin-top: 1em; margin-bottom: 0.5em }
.credits-section { position: relative }
.credits-section h2 { margin-bottom: 0.65em }
```

```js
addEventListener("scroll", function () {
```

### [Mouseover Parallax Background Image](https://codepen.io/chrisparker/pen/JjpjrEo)

made with: GSAP

```css
.bg_parallax { position: relative; background-position: center; background-position: 50% 50% }
.bg_parallax:nth-child(2) .inner p:first-child { padding-top: 50vh }
h1 { text-transform: uppercase; margin-bottom: 15px }
p, a { margin-bottom: 0 }
```

### [spaceship scroller](https://codepen.io/barthendrix/pen/RwQwagV)

held: fixed div.stars, fixed div.stratosphere, fixed h1.instructions, fixed svg.[object | on scroll: g.[object: transform+opacity+top ×9, path.[object: transform+top ×3, g.[object: transform+top ×2, h1.instructions: transform+opacity+top, svg.[object: transform+top, rect.[object: transform+top | made with: position: fixed · @keyframes · GSAP · ScrollTrigger

```css
from { transform: translate3d(0, 0, 0) }
to { transform: translate3d(0, 100vh, 0) }
.stratosphere, .instructions, .artwork, .stars { position: fixed }
.stratosphere { top: 0; bottom: 0 }
.instructions { bottom: 1em }
.instructions__notice { opacity: 0.3 }
.scroller { position: relative }
.artwork, .stars { top: 0 }
.stars--animated .stars__rear, .stars--animated .stars__center { animation-name: animateStars }
.stars__star, .stars__star::after { position: absolute }
.stars__star::after { margin-top: -100vh }
.stars__rear, .stars__center, .stars__front { position: absolute; top: 0; animation: linear infinite }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline()
ScrollTrigger.create({
```

### [Parallax Scroll](https://codepen.io/canercalskan/pen/MWQWwbL)

made with: transition · :hover · scroll listener

```css
#btn { transition: all 0.5s }
#btn:hover { box-shadow: 1px 2px 10px burlywood }
h2 { text-transform: uppercase }
.navbar { padding-top: 20px; padding-bottom: 20px }
ul li a { transition: all 1s }
```

```js
addEventListener('scroll' , function() {
```

### [🌕 Moonlight Parallax](https://codepen.io/iampaulchevrier/pen/eYywbGo)

made with: transition · :hover · mix-blend-mode · scroll listener

```css
header { position: absolute; top: 0 }
header .logo { text-transform: uppercase }
header ul li a { transition: 0.5s }
.home-section { position: relative }
.home-section:before { position: absolute; bottom: 0 }
.home-section img { position: absolute; top: 0 }
.home-section img#moon { mix-blend-mode: screen }
#btn-letsgo { transform: translateY(100px); transition: 0.5s }
.about-section { position: relative }
.about-section h3 { margin-top: 1em; margin-bottom: 0.5em }
footer .logo { text-transform: uppercase }
```

```js
addEventListener("scroll", function () {
```

### [Parallax-efect](https://codepen.io/theczardrive/pen/rNpKWNM)

on scroll: h1.rellax: transform+top, p.rellax: transform+top, span.btn: transform+top, div.img: transform+top | on hover of span.btn: span.btn: background+color | made with: @keyframes · :hover

```css
.container { position:relative }
.seta { position:absolute; bottom: 10px; animation: 1s anime ease-in-out infinite alternate }
0% { bottom: 5px }
100% { bottom: 20px }
.texts h1 { text-transform:uppercase; animation: animet 3s }
.texts p { animation: animet 2s }
img { animation: controll 2s infinite alternate ease-in-out }
0% { transform: translatex(-2%) }
100% { transform: translatex(0%) }
.btn { margin-top:10px; animation: animeb 2s }
0% { opacity:0; transform: translatex(-20px) }
100% { opacity:1; transform: translatex(0px) }
```

### [Parallax website (exercise)](https://codepen.io/yulich/pen/jOYxayZ)

made with: nothing recognised — read the code

```css
.image-one, .image-two, .image-three { position: relative; opacity: 0.65; background-position: center }
.caption { position: absolute; top: 50% }
.between h2 { padding-bottom: 20px }
.sub-image-heading { position: absolute; top: 50% }
```

### [Parallax Tailwind](https://codepen.io/niDzolski/pen/abEGoGa)

held: fixed dialog.border | made with: @keyframes · <dialog>

```css
dialog { -webkit-animation: show 0.3s linear; animation: show 0.3s linear }
dialog::-webkit-backdrop { opacity: 80% }
dialog::backdrop { opacity: 80% }
from { opacity: 0 }
to { opacity: 100% }
from { opacity: 0 }
to { opacity: 100% }
@keyframes show animates opacity
```

### [Parallax card](https://codepen.io/Tormenta/pen/popLRPQ)

on scroll: div.card-description: transform+top | made with: transition · :hover

```css
.card { position: relative; transition: all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1) }
.card-image { position: absolute; top: 0; transition: all 1s cubic-bezier(0.645, 0.045, 0.355, 1) }
.card-description { position: absolute; bottom: 0; transition: all 1s cubic-bezier(0.645, 0.045, 0.355, 1) }
.card:hover .card-description { transform: translateY(100%) }
```

### [NFT Parallax Banner](https://codepen.io/yudizsolutions/pen/xxpLGKV)

on scroll: img.img-fluid: transform+top ×3, img.img-fluid: opacity+top ×2 | on hover of a.: img.img-fluid: transform+top ×3, img.img-fluid: opacity ×2 | made with: @keyframes · transition · :hover

```css
body { position: relative }
a { transition: all 0.5s; -webkit-transition: all 0.5s }
.theme-btn { text-transform: capitalize }
.theme-btn:hover { box-shadow: 0px 0px 60px rgba(116, 255, 226, 0.4); -webkit-box-shadow: 0px 0px 60px rgba(116, 255, 226, 0.4) }
.main-section { position: relative }
.donut-1 { position: absolute; top: 0; filter: blur(5px); -webkit-filter: blur(5px) }
.donut-2 { position: absolute; bottom: 0; filter: blur(5px); -webkit-filter: blur(5px) }
header { position: relative }
.header-inner button { transition: all 0.5s; -webkit-transition: all 0.5s }
.header-inner button:hover { opacity: 0.8 }
.nav-links { position: absolute; transform: all 0.5s; -webkit-transition: all 0.5s; top: 0; box-shadow: 0px 0px 5px rgba(2, 2, 2, 0.4) }
.nav-links .close-btn { position: absolute; top: 50px; transition: all 0.5s; -webkit-transition: all 0.5s }
```

### [Parallax - CSS](https://codepen.io/sacsam005/pen/popwaVj)

made with: nothing recognised — read the code

### [Parallax Hover | Post](https://codepen.io/coding_anish/pen/PoEjGqm)

on scroll: h4.: transform ×3, img.: transform+top ×2, div.info: transform+shadow | on hover of img.: img.: transform+top, img.: transform | made with: @keyframes · transition · :hover · backdrop-filter · mix-blend-mode

```css
#app { position: relative; box-shadow: black 0 0 20vh -2vh }
#app:hover .info { transform: translate3d(0, 0, 0); box-shadow: -1vh 0 5vh black }
#app:hover .info h4 { transform: translate3d(0vh, 0, 0) }
#app:hover .info h4:nth-child(2) { transition: all 1s cubic-bezier(0, 1.06, 0.37, 1.44) 0.4s }
#app:hover .info h4:nth-child(3) { transition: all 1s cubic-bezier(0, 1.06, 0.37, 1.44) 0.6s }
#app:hover .info h4:nth-child(4) { transition: all 1s cubic-bezier(0, 1.06, 0.37, 1.44) 0.8s }
#app img { -webkit-animation: par 20s ease-out 20ms infinite alternate; animation: par 20s ease-out 20ms infinite alternate }
from { transform: translate3d(0, 10%, 0) }
to { transform: translate3d(0, -10%, 0) }
from { transform: translate3d(0, 10%, 0) }
to { transform: translate3d(0, -10%, 0) }
#app .info { transform: translate3d(100%, 0, 0); position: absolute; bottom: 0; backdrop-filter: blur(0.3vh); -webkit-backdrop-filter: blur(0.3vh); transition: all ease 1s 0.1s; box-shadow: -1vh 0 5vh rgba(0, 0, 0, 0) }
```

### [Easy parallax effect with background-attachment: fixed](https://codepen.io/DuskoStamenic/pen/ZEvBKdw)

made with: nothing recognised — read the code

```css
.container { background-position: center }
a { text-transform: uppercase }
h3 { margin-top: 1em }
.card > a { margin-bottom: 2em }
.item { -webkit-box-shadow: 0px 29px 38px -15px rgba(0,0,0,0.43); -moz-box-shadow: 0px 29px 38px -15px rgba(0,0,0,0.43); box-shadow: 0px 29px 38px -15px rgba(0,0,0,0.43) }
.img { background-position: center; margin-top: 20px }
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

### [Pure CSS Parallax Scrolling](https://codepen.io/santoshsinghchauhan/pen/jOYqpab)

made with: 3D (perspective / preserve-3d)

```css
.container { position: relative }
header { margin-bottom: 8rem }
.content-wrapper p:not(:last-child) { margin-bottom: 1rem }
.body-wrapper { perspective: 5px }
section { position: relative; margin-top: 6rem; margin-bottom: 6rem }
section:first-of-type { margin-top: 0 }
section:last-of-type { margin-bottom: 0 }
.parallax { position: relative }
.parallax > div { position: absolute; top: 0; background-position: center; filter: contrast(1.2); box-shadow: 0px 0px 8px rgba(255, 255, 255, 0.7) }
.parallax > h2 { position: relative }
.parallax .background { transform: translateZ(-6px) scale(2) rotate(-5deg); opacity: 0.6 }
.parallax .foreground { transform: translateZ(-5px) scale(1.5) rotate(2deg); opacity: 0.8 }
```

### [animation](https://codepen.io/animationbro/pen/LYeYabY)

on scroll: img.: transform+top | made with: transition · custom properties driven by JS

```css
:root { --scale: 1.5 --y: 0 }
:root body #wrapper #image { transform: translateX(var(--x)) translateY(var(--y)) scale(var(--scale)); transition: ease-out 0.7s }
```

```js
style.setProperty("--scale", 1.6)
style.setProperty("--x", x / 2 + "px")
style.setProperty("--y", y / 2 + "px")
style.setProperty("--scale", 1)
style.setProperty("--x", 0)
style.setProperty("--y", 0)
```

### [SVG overlay and blend mode experiment](https://codepen.io/jlengstorf/pen/BambbKa)

on scroll: clippath.[object: transform ×4, h1.: transform+top | made with: clip-path · mix-blend-mode · GSAP

```css
svg { position: absolute; bottom: 0 }
clipPath { transform: scale(calc(1 / 1440), calc(1 / 960)) }
h1 { text-transform: uppercase; position: relative; mix-blend-mode: hard-light }
.container { position: relative }
.cutout { bottom: 0; position: absolute }
.main, .stripes, .leftTriangle, .rightTriangle { background-position: center bottom; bottom: 0; position: absolute }
.main { -webkit-clip-path: url(#dots); clip-path: url(#dots); filter: url(#grey) }
.stripes { -webkit-clip-path: url(#stripes); clip-path: url(#stripes); filter: url(#pink) }
.leftTriangle { -webkit-clip-path: url(#leftTriangle); clip-path: url(#leftTriangle); filter: url(#pink) }
.rightTriangle { -webkit-clip-path: url(#rightTriangle); clip-path: url(#rightTriangle); filter: url(#blue) }
```

```js
gsap.to(["h1", "clipPath"], {
scrollTrigger: { scrub: true }
```

### [Parallax 404 Page](https://codepen.io/ykadosh/pen/wvPOdmb)

on scroll: g.[object: transform ×6, path.[object: transform ×4, text.[object: transform | on hover of a.: g.[object: transform+top ×6, path.[object: transform+top ×4, text.[object: transform+top | made with: :hover · requestAnimationFrame

```css
#app .text-container { position: relative }
#app .text-container h1 { margin-bottom: 1rem }
#app .text-container a:hover { border-bottom: 0.2rem solid #06b6d4 }
svg text { filter: drop-shadow(0 0 50px #1f2937) }
```

```js
requestAnimationFrame(() => {
```

### [Pure CSS Parallax Effect](https://codepen.io/johfarrell/pen/rNYQbvM)

made with: 3D (perspective / preserve-3d)

```css
.parallaxContainer { perspective: 20px }
header { position: relative }
.background1, .background2, .background3 { position: absolute; bottom: 0 }
.background1 { transform: translateZ(-15px) scale(1.75) }
.background2 { transform: translateZ(-3px) scale(1.4) }
.background3 { transform: translateZ(0) scale(1) }
```

### [Stardew Valley Website Redesign Concept](https://codepen.io/iahmb/pen/BamPaYe)

held: fixed header.d-flex, fixed nav.dropdown-nav | made with: position: fixed · transition · 3D (perspective / preserve-3d)

```css
.input-style { -webkit-box-shadow: -3px 3px 1px rgba(0, 0, 0, .2); box-shadow: -3px 3px 1px rgba(0, 0, 0, .2); margin-top: 3px; margin-bottom: 15px }
.mb-20 { margin-bottom: 20px }
main { position: relative; -webkit-perspective: 1px; perspective: 1px; -webkit-perspective-origin: center top; perspective-origin: center top }
header { position: fixed; top: 0 }
.dropdown-nav { position: fixed; top: 77px; opacity: 1; -webkit-transition: height 300ms, opacity 300ms ease-in-out; -o-transition: height 300ms, opacity 300ms ease-in-out; transition: height 300ms, opacity 300ms ease-in-out }
.closed { opacity: 0 }
#hero { position: relative; -webkit-transform: translateZ(0); transform: translateZ(0) }
.hero-bg { top: 0; position: absolute; background-position: center center; -webkit-transform-origin: center top; -ms-transform-origin: center top; transform-origin: center top; -webkit-transform: translateZ(-1px) scale(2); transfor }
#hero .title { position: absolute; top: 30vh }
#hero .hero-img { position: absolute; bottom: 0; -o-object-position: center bottom; object-position: center bottom }
#locations .location-box { position: relative }
#locations div img, #villagers div img { -o-object-position: center center; object-position: center center }
```

### [stunning website parallax](https://codepen.io/vkive/pen/QWOxdLe)

made with: pointer / mouse tracking

```css
section { position: relative }
section header { position: absolute; top: 0 }
section header .logo { position: relative; text-transform: uppercase }
section header .toggle { position: relative; background-position: center }
.bg { position: absolute; bottom: 0; background-position: center }
.bird { position: absolute; bottom: 0 }
.content { position: absolute }
.content p { margin-top: -15px }
.content a { text-transform: uppercase; margin-top: 20px }
.sci { position: absolute; top: 50%; transform: translateY(-50%) }
.sci li a { transform: scale(0.5) }
.textBlocks { position: absolute; bottom: 0 }
```

```js
addEventListener("mousemove", function(e){
```

### [parallax stars background](https://codepen.io/gstefler/pen/WNXyeqq)

made with: scroll() timeline · canvas 2D · scroll listener · pointer / mouse tracking

```css
canvas { position: absolute; top: 0 }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("scroll", (e) => {
```

### [WeatherWatt](https://codepen.io/legbandt/pen/rNYvwZJ)

made with: nothing recognised — read the code

### [Swiper slider with amazing animation effects and dynamic change background](https://codepen.io/dmitrij-rog/pen/JjOLygR)

on scroll: div.slider__img: transform+top ×8, div.swiper-wrapper: transform+top ×2, div.description: transform+opacity+top, p.: transform+top | made with: transition

```css
:root { --transition: .75s cubic-bezier(0.255, 0.670, 0.000, 1.010) }
.slider { transform: rotate(15deg); top: 10vh }
.slider__wrapper { transition: var(--transition) !important; will-change: transform }
.slider__img { will-change: transform; position: absolute; background-position: center center; transition: var(--transition) !important }
.slider__item { position: relative; transition: transform var(--transition), box-shadow var(--transition) }
.slider__item.opened { transform: rotate(-15deg) scale(1.5); box-shadow: rgba(0,0,0,.75) 0 0 0 10000px }
.slider_bg { transform: rotate(-20deg) !important; top: -90vh; opacity: .2; filter: blur(140px) saturate(9) }
.description { position: absolute; top: 20vh; transition: opacity var(--transition), transform var(--transition) }
.description p { opacity: .9; transition: transform var(--transition) }
.description.hidden { opacity: 0; transform: translateY(5vh) }
.description.hidden p { transform: translateY(2vh) }
.logo { text-transform: uppercase }
```

### [Parallax Scroll Behavior](https://codepen.io/theiturhs/pen/MWObrXM)

made with: transition · :hover

```css
button { box-shadow: 0 0 10px 10px rgba(255,255,255,0.1); transition: 0.2s linear }
button:hover { transform: scale(1.05) }
```

### [Parallax Scroll (CSS only)](https://codepen.io/evirunurm/pen/bGYBBrb)

made with: nothing recognised — read the code

```css
.back01 { position: relative; background-position: center }
.back02 { position: relative; background-position: center }
.back03 { position: relative; background-position: center }
.end { position: relative; background-position: center }
.title { box-shadow: 0px 5px 22px 6px rgba(0,20,150,0.42) }
.parallax { position: relative }
.parallax:before { position: absolute; top: 1px }
.parallax:after { position: absolute; top: -1px }
h2 { margin-bottom: 1rem }
```

### [Sign Up Form with CSS Paralax](https://codepen.io/iahmb/pen/vYWKZNL)

made with: 3D (perspective / preserve-3d)

```css
body { background-position: center center }
header { position: relative }
.title { background-position: center center; margin-bottom: 25px }
.parallax { position: absolute; top: 0; -webkit-perspective: 1px; perspective: 1px }
.stars { position: absolute; top: 6em; -webkit-transform: translateZ(-1px) scale(1.9); transform: translateZ(-1px) scale(1.9) }
.container { position: relative }
.stars { margin-top: -10em }
.container::before { position: absolute; top: 15px }
.parallax { position: relative; -webkit-perspective: none; perspective: none }
.input-box, .subscribe { margin-bottom: 17px }
.subscribe { background-position: -5px -10px }
.bottom { margin-top: 20px }
```

### [Untitled](https://codepen.io/mar-or/pen/oNoxYPN)

made with: transition · :hover

```css
.cont { position: relative }
.slider { position: relative; transform: translate3d(0, 0, 0); will-change: transform }
.slider.animation { transition: transform 750ms ease-in-out }
.slider.animation .slide__darkbg { transition: transform 750ms ease-in-out }
.slider.animation .slide__text { transition: transform 750ms ease-in-out }
.slider.animation .slide__letter { transition: transform 750ms ease-in-out }
.slide { position: absolute; top: 0 }
.slide__darkbg { position: absolute; top: 0; transform: translate3d(0, 0, 0); will-change: transform }
.slide__text-wrapper { position: absolute }
.slide__letter { position: absolute; top: 0; transform: translate3d(0, 0, 0); will-change: transform }
.slide__text { text-transform: uppercase; transform: translate3d(0, 0, 0); will-change: transform }
.slide--1__darkbg { background-position: 0px center, 0px center; transform: translate3d(0, 0, 0); will-change: transform }
```

### [Parallax Scroll](https://codepen.io/sebastian-piskaty/pen/MWOaMGa)

on scroll: section.section-0: transform+top ×2, main.: background, h2.is-inview: transform+top, div.section-0__img-wrapper: transform+top, img.is-inview: transform+top, section.section-1: transform+top | on hover of img.is-inview: main.: background, span.c-scrollbar: opacity | made with: transition · mix-blend-mode · Lenis / smooth scroll

```css
main { transition: 1s }
.section-0 h2 { text-transform: uppercase; mix-blend-mode: multiply }
.section-0__img-wrapper img { filter: grayscale(1); opacity: 0.5 }
```

### [parallax](https://codepen.io/KrasnovDaniil1/pen/xxPwOLd)

held: sticky div.parallax, sticky div.parallax, sticky div.parallax, sticky div.parallax, sticky div.parallax, sticky div.parallax, sticky div.parallax, sticky div.parallax, sticky div.parallax, sticky div.parallax | made with: position: sticky

```css
.parallax { position: relative; position: sticky; top: 0 }
```

### [seamless endless parallax by box-shadow](https://codepen.io/zazaulola/pen/YzEzEOm)

held: fixed div.sky | on scroll: div.stars: transform+top ×3 | made with: position: fixed · @keyframes

```css
.sky { position: fixed }
.stars { animation: animStar 1s linear infinite }
.stars::after { top: 100vh }
.stars, .stars::after { position: absolute }
.stars.far-stars { animation-duration: 37s }
.stars.mid-stars { animation-duration: 27s }
.stars.near-stars { animation-duration: 17s }
from { transform: translateY( 0) }
to { transform: translateY(-100vh) }
@keyframes animStar animates transform
```

### [Travel Gallery (React)](https://codepen.io/seanfree/pen/GRMVbBj)

held: fixed p.info | on scroll: span.loader__bar: transform ×12, img.card__image: transform+top ×4, span.loader__bar: transform+top ×3, div.card: transform+shadow+top, div.card__imageContainer: transform+top, header.card__header: transform+opacity+top | on hover of div.card: span.loader__bar: transform ×10, img.card__image: transform+top ×8, span.loader__bar: transform+top ×5, div.card: transform+shadow+top ×2, div.card__imageContainer: transform+top ×2, header.card__header: transform+opacity+top ×2 | made with: position: fixed · @keyframes · transition · :hover · requestAnimationFrame

```css
h1, h2, h3, h4, h5, h6 { margin-bottom: 0.75rem }
.info { bottom: 0; position: fixed }
.loader { opacity: 0; transition: opacity 1s; will-change: opacity }
.loader--visible { opacity: 1 }
.loader__bar { -webkit-animation: loaderBar 2s ease-in-out alternate infinite; animation: loaderBar 2s ease-in-out alternate infinite; margin-bottom: 0.25rem; transform: translateX(-100%) }
.loader__bar:nth-child(1) { -webkit-animation-delay: 0.1s; animation-delay: 0.1s }
.loader__bar:nth-child(2) { -webkit-animation-delay: 0.2s; animation-delay: 0.2s }
.loader__bar:nth-child(3) { -webkit-animation-delay: 0.3s; animation-delay: 0.3s }
.loader__bar:nth-child(4) { -webkit-animation-delay: 0.4s; animation-delay: 0.4s }
.loader__bar:nth-child(5) { -webkit-animation-delay: 0.5s; animation-delay: 0.5s }
0% { transform: scaleX(0) }
50% { transform: scaleX(1) }
```

```js
requestAnimationFrame(animate)
```

### [Simple Parallax](https://codepen.io/vkive/pen/wvrLVBX)

made with: mix-blend-mode · scroll listener

```css
section { position: relative }
section:before { position: absolute; bottom: 0 }
section:after { position: absolute; top: 0; mix-blend-mode: color }
section img { position: absolute; top: 0 }
#text { position: relative }
```

```js
addEventListener('scroll', function(){
```

### [Mouse Move Parallax ✨](https://codepen.io/burtamimano/pen/PoJrYvb)

made with: pointer / mouse tracking

```css
#parallax { position: relative; background-position: center; background-position: 50% 50% 25% 25% }
h1 { position: absolute; top: 47%; transform: translate(-50%, -50%); text-transform: bold; opacity: .1 }
```

```js
addEventListener("mousemove", parallax)
```

### [CSS Only Parallax](https://codepen.io/ziplodocus/pen/rNGrooW)

made with: 3D (perspective / preserve-3d)

```css
:root { --perspective: 2px }
.parallax-container { perspective: var(--perspective) }
.parallax-container .parallax-item { transform: scale(calc(1 + var(--parallax-factor))) translateZ(calc( -1 * var(--perspective) * var(--parallax-factor) )) }
section { position: relative }
.content { transform: scale(calc(1 + var(--parallax-factor))) translateZ(calc( -1 * var(--perspective) * var(--parallax-factor) )) }
img { position: absolute; inset: 0 }
```

### [CSS - Interactive Header with Parallax (WIP)](https://codepen.io/aGeekonaBike/pen/oNGMLML)

on hover of li.nav-top-link: a.: color ×2, svg.[object: color ×2, path.[object: color ×2 | made with: @keyframes · transition · :hover · :focus-visible · :has() · 3D (perspective / preserve-3d) · IntersectionObserver · scroll listener

```css
button { position: relative }
button:hover, button :focus-visible { transform: scale(1.1); transition: scale 500ms linear }
.button-card:hover { transition: background-color 1000ms ease; transition: color 1000ms ease }
h1, h2, h3, h4, h5, h6, .menu-item { text-transform: capitalize }
nav { position: relative }
nav .nav-top { position: relative; box-shadow: 2px 5px 7px #cfcfcf }
nav .nav-top :any-link, nav .nav-top .nav-top-link { position: relative }
nav .nav-top .icon { position: relative }
nav .nav-top .nav-top-menu { position: relative }
nav .nav-top .nav-top-menu ul { position: relative }
nav .nav-top .nav-top-menu ul li { position: relative }
nav .nav-main { position: relative; box-shadow: 2px 5px 7px #cfcfcf }
```

```js
new IntersectionObserver(function (entries, observer) {
addEventListener("scroll", lazyload)
```

### [112. parallax building](https://codepen.io/ycw/pen/wvrmqza)

made with: GSAP · three.js / WebGL · requestAnimationFrame

```js
gsap.to(n.rotation, {
requestAnimationFrame(function f() {
requestAnimationFrame(f)
```

### [Parallax Hero II](https://codepen.io/ahoidahl/pen/oNGpvXY)

made with: @keyframes

```css
* { background-position:center }
#parallax-hero { position:relative }
.heroback { top:0 }
.greyback { padding-top:100% }
20% { opacity:1 }
80% { transform:translate3d(40px,-300%,0px) rotate(20deg) skew(-30deg) scale(2); -webkit-filter:blur(10px); -moz-filter:blur(10px); -ms-filter:blur(10px); -o-filter:blur(10px) }
100% { opacity:0 }
0% { opacity:1; transform:scale(1) }
80% { transform:translate3d(40px,-300%,0px) rotate(20deg) skew(-30deg) scale(2); -webkit-filter:blur(20px); -moz-filter:blur(20px); -ms-filter:blur(20px); -o-filter:blur(20px) }
100% { opacity:0 }
#chimney-smoke-box { top:19%; position:absolute }
.chimney-smoke { animation:smoke 6s infinite ease-out; -webkit-animation:smoke 6s infinite ease-out; opacity:0; -webkit-filter:blur(4px); -moz-filter:blur(4px); -ms-filter:blur(4px); -o-filter:blur(4px); filter:blur(4px); position:relati }
```

### [Reverse-Scrolling Columns with CSS @scroll-timelinel (+ JS ScrollTimeline Polyfill Fallback)](https://codepen.io/bramus/pen/jOGGKRq)

held: fixed div.warning, fixed div.info, fixed dialog.sda_update | on scroll: div.column: transform+top ×2 | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · Web Animations API (.animate)

```css
.columns { position: relative }
.column { --column-offset: 10vh }
.warning, .info { position: fixed; bottom: 1em }
from { transform: translateY(calc(-100% + 100vh)) }
to { transform: translateY(calc(100% - 100vh)) }
.column-reverse { animation: 1s adjust-position linear forwards; animation-timeline: scroll-in-document }
@keyframes adjust-position animates transform
```

```js
.animate( {
```

### [CSS Parallax Animation](https://codepen.io/honeybutter/pen/dyVRexK)

on scroll: span.cloud: transform+top ×3, span.bird: transform+top ×2, span.bird: transform, span.balloon: transform+top, span.mountains: transform+top | on hover of img.: span.cloud: transform ×3, span.bird: transform+top ×3, span.balloon: transform, span.mountains: transform | made with: @keyframes · mix-blend-mode

```css
.container { position: absolute; inset: 0 }
.flourish { position: absolute }
.flourish--corner:nth-child(1) { top: 1rem }
.flourish--corner:nth-child(2) { top: 1rem; transform: rotate(90deg) }
.flourish--corner:nth-child(3) { bottom: 1rem; transform: rotate(180deg) }
.flourish--corner:nth-child(4) { bottom: 1rem; transform: rotate(-90deg) }
.flourish--top { top: 1rem; transform: translateX(-50%) }
.flourish--bottom { bottom: 1rem; transform: translateX(-50%) rotate(180deg) }
.halftone { position: absolute }
.halftone--1 { top: 0 }
.halftone--2 { top: 0; transform: rotate(90deg) }
.halftone--3 { bottom: 0; transform: rotate(180deg); opacity: .5 }
```

### [Background clip mouse image reveal](https://codepen.io/lorearwe/pen/zYEZMqO)

on scroll: div.intro: opacity+clip-path+top | made with: transition · clip-path · custom properties driven by JS · pointer / mouse tracking

```css
body::before { position: absolute }
h1 { transition: 1s; position: relative; top: 300px; transform: rotate(-90deg) }
#revealer { position: relative; -webkit-clip-path: circle(10% at var(--x) var(--y)); clip-path: circle(10% at var(--x) var(--y)); opacity: 0 }
#revealer.active { opacity: 1 }
```

```js
style.setProperty('--x', (e.clientX - offsetX) + 'px')
style.setProperty('--y', (e.clientY - 45) + 'px')
addEventListener('mousemove', circleMove)
style.setProperty('--x', touch.clientX + 'px')
style.setProperty('--y', touch.clientY + 'px')
```

### [Pure css parallax to my first follower](https://codepen.io/agn35/pen/VwMpVwj)

made with: transition · 3D (perspective / preserve-3d)

```css
body { perspective: 1px }
section { position: relative; top: auto; transition: transform 0.3 linear }
section:nth-child(odd) { transform: translateZ(-1px) scale(2) }
section:nth-child(odd) .text-container { transform: translateZ(1px) scale(0.66) }
section:nth-child(even) .text-container { transform: translateZ(0.5px) scale(0.66) }
section:nth-child(even) .img-container { box-shadow: 0 -10px 10px rgba(0, 0, 0, 0.5), -10px 0 10px rgba(0, 0, 0, 0.5) }
section .img-container { position: absolute; transform: translateZ(0.25px); transition: transform 0.3 linear }
section .text-container { position: relative; transition: transform 0.3 linear }
```

### [parallax effect website](https://codepen.io/Abhi7raj/pen/jOGVzZP)

held: fixed header | on hover of li.: a.: color | made with: position: fixed · transition · :hover

```css
header { position: fixed }
a:hover { transition: all 0.25s ease-in }
main .box1 { background-position: center }
.box2 { background-position: center }
.box3 { background-position: center }
.box4 { background-position: center }
```

### [Easy Pure CSS Parallax + Inline Images as Background](https://codepen.io/abirana/pen/LYzNbvJ)

made with: 3D (perspective / preserve-3d)

```css
body { perspective: 1px }
.section { position: relative }
.parallax-item { transform: translateZ(0.1px) }
.parallax-bg { position: absolute; top: 0; bottom: 0; transform: translateZ(-0.2px) scale(2) }
```

### [Parallax Effect without library](https://codepen.io/snowiewdev/pen/mdBemay)

on scroll: span.scroll: transform+top ×3, span.scroll: transform, div.ball: transform+top | made with: scroll listener

```css
.container { position: relative }
.ball { position: absolute; bottom: 0 }
```

```js
addEventListener('scroll', (e)=> {
```

### [Background Parallax](https://codepen.io/yitengjun/pen/yLzNQLE)

held: fixed div.heading | on scroll: img.ukiyo: transform+top ×2 | on hover of a.: a.: transform+top | made with: position: fixed · transition · :hover · Lenis / smooth scroll · requestAnimationFrame

```css
section { position: relative }
#container { position: relative }
.heading { position: fixed; transform: translateX(-50%); bottom: 0 }
.heading a { text-transform: capitalize; margin-top: 0.5em; transition: 0.25s transform }
.heading a:hover { transform: scale(1.075) }
.bg { background-position: center }
.fv_img1 { position: absolute; top: 0; margin-top: 0 !important }
.ukiyo { margin-top: 12.5em }
footer { opacity: 0.5 }
```

```js
requestAnimationFrame(raf)
```

### [Aliendscape 🪐](https://codepen.io/KilledByAPixel/pen/BawBKqP)

made with: canvas 2D · requestAnimationFrame

```js
requestAnimationFrame(y),e<S-3||(S=Math.max(S+1e3/60,e),f=m++/
```

### [#codevember 21 - parallax scroll effect](https://codepen.io/majchi/pen/GRvLMGb)

made with: nothing recognised — read the code

```css
.background1, .background2, .background3 { background-position: center }
.title { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.botany, .species, .source { position: relative; top: 20vh }
.source { position: relative; top: 40vh }
```

### [Parallax scroll example with Stylus](https://codepen.io/Liberacorpus/pen/KKvYVZL)

made with: nothing recognised — read the code

### [Firewatch Parallax CSS](https://codepen.io/DenDionigi/pen/Jjyzpgz)

made with: 3D (perspective / preserve-3d)

```css
.parallax { perspective: 100px; position: absolute; top: 10vh; bottom: 0 }
.parallax__layer { position: absolute; top: 0; bottom: 0 }
.parallax__layer img { position: absolute; bottom: 0 }
.parallax__cover { position: absolute; top: 100% }
.parallax__layer__0 { transform: translateZ(-300px) scale(4) }
.parallax__layer__1 { transform: translateZ(-250px) scale(3.5) }
.parallax__layer__2 { transform: translateZ(-200px) scale(3) }
.parallax__layer__3 { transform: translateZ(-150px) scale(2.5) }
.parallax__layer__4 { transform: translateZ(-100px) scale(2) }
.parallax__layer__5 { transform: translateZ(-50px) scale(1.5); filter: drop-shadow(0px -1px 0.1px rgb(0 0 0 / 60%)) }
.parallax__layer__6 { transform: translateZ(0px) scale(1); filter: grayscale(1) brightness(0) drop-shadow(0px -0.1em 2px forestgreen) }
.prima-sezione { margin-bottom:-10vh }
```

### [Parallax scroll](https://codepen.io/Liberacorpus/pen/JjyxROO)

made with: nothing recognised — read the code

```css
.bgimg-1, .bgimg-2, .bgimg-3 { position: relative; opacity: 0.65; background-position: center }
.caption { position: absolute; top: 50% }
h3 { text-transform: uppercase }
```

### [space parallax using Phaser TileSprites (art by Adam Clifton)](https://codepen.io/fielding/pen/yLoGzjE)

made with: nothing recognised — read the code

### [Walt Disney's MultiPlane Camera](https://codepen.io/heysimonarnold/pen/BadGRPJ)

held: fixed nav.nav | on scroll: img.layer: transform+top ×4 | on hover of img.layer: img.layer: transform+top ×4 | made with: position: fixed · @keyframes · transition · :hover · 3D (perspective / preserve-3d)

```css
.depth-1 { transform: translateZ(0px) scale(1); -webkit-animation: depth-anim-1 5s alternate infinite; animation: depth-anim-1 5s alternate infinite }
from { transform: translateZ(0px) scale(1) }
to { transform: translateZ(300px) scale(1) }
from { transform: translateZ(0px) scale(1) }
to { transform: translateZ(300px) scale(1) }
.depth-2 { transform: translateZ(-200px) scale(1.3076923077); -webkit-animation: depth-anim-2 5s alternate infinite; animation: depth-anim-2 5s alternate infinite }
from { transform: translateZ(-200px) scale(1.3076923077) }
to { transform: translateZ(-50px) scale(1.3076923077) }
from { transform: translateZ(-200px) scale(1.3076923077) }
to { transform: translateZ(-50px) scale(1.3076923077) }
.depth-3 { transform: translateZ(-400px) scale(1.6153846154); -webkit-animation: depth-anim-3 5s alternate infinite; animation: depth-anim-3 5s alternate infinite }
from { transform: translateZ(-400px) scale(1.6153846154) }
```

### [<React.js> Parallax](https://codepen.io/hungc/pen/porxwLg)

made with: scroll listener

```css
.zoom { position: relative }
.zoom::before { position: absolute; bottom: 0 }
.title { position: absolute; transform: translate(-50%, 280%) }
```

```js
addEventListener("scroll", handleScroll)
```

### [Lantern Parallax Animation](https://codepen.io/mismith0227/pen/PoKRRVJ)

on scroll: div.chouchin-wrap: transform ×6, img.chouchin: transform+top ×6 | on hover of img.chouchin: div.chouchin-wrap: transform+top ×6, img.chouchin: transform+top ×6 | made with: @keyframes · GSAP · pointer / mouse tracking

```css
.wrap { position: relative }
.left, .right { position: relative }
.chouchin { position: absolute; top: -10px }
.chouchin img { animation: swing ease-in-out 2s infinite alternate }
.chouchin.layer2 { filter: blur(2px); opacity: 0.9 }
.chouchin.layer3 { filter: blur(4px); opacity: 0.8 }
.chouchin2 img { animation-duration: 3s; animation-direction: alternate-reverse }
.chouchin3 img { animation-duration: 3.5s }
.chouchin4 img { animation-duration: 2.5s; animation-direction: alternate-reverse }
.chouchin5 img { animation-duration: 3.2s }
.chouchin6 img { animation-duration: 3.8s; animation-direction: alternate-reverse }
0% { transform: rotate(8deg) }
```

```js
addEventListener("mousemove", function (event) {
```

### [full page parallax](https://codepen.io/prajotsurey/pen/YzxNZdv)

held: fixed section.background, fixed section.background, fixed section.background | on scroll: section.background: transform+top ×3, div.content: transform+top ×3 | made with: position: fixed · transition · 3D (perspective / preserve-3d)

```css
.container { perspective: 1px }
.background { position: fixed; transition: all 1s cubic-bezier(0.22, 0.44, 0, 1); transform: translatey(20vh); background-position: center center }
.content { transition: all 1s cubic-bezier(0.22, 0.44, 0, 1); transform: translateY(40vh) }
.background:first-child { transform: translateY(-15vh) }
.background:first-child .content { transform: translateY(15vh) }
.background.scroll-down { transform: translateY(-130vh) }
.background.scroll-down>.content { transform: translateY(40vh) }
.background.scroll-down + .background:not(.scroll-down) { transform: translateY(-15vh) }
.background.scroll-down + .background:not(.scroll-down)>.content { transform: translateY(15vh) }
```

```js
addEventListener('wheel', handleScroll)
```

### [Parallax scroll effect tempest](https://codepen.io/tempest2nd/pen/ZEJQKNb)

made with: nothing recognised — read the code

```css
.section { background-position: center }
```

### [parallax](https://codepen.io/mk81726354/pen/ExvVGEz)

made with: nothing recognised — read the code

```css
.parallax { background-position: center }
.parallax-1 { background-position: center }
.parallax-2 { background-position: center }
.parallax-3 { background-position: center }
.icon { margin-top:-230px; margin-top:-200px }
```

### [Scroll and parallax animations with animejs](https://codepen.io/andreamorosi/pen/QWMjExd)

held: fixed div.info, fixed div.counter | on scroll: g.[object: transform+opacity+top ×6, path.[object: transform+opacity+top ×6, svg.[object: transform+top, path.[object: opacity+top, ellipse.[object: transform+top, circle.[object: transform+top | made with: position: fixed · transition · mix-blend-mode

```css
main { position: relative }
svg { position: relative; top: 0; will-change: transform }
svg path { will-change: transform }
.foreground { transition: all ease-in 1s }
.info { position: fixed; bottom: 0; border-bottom: 0; opacity: 0; transform-origin: bottom; box-shadow: inset -4px 4px 8px rgba(240, 240, 240, 0.75), -4px 4px 8px rgba(0, 0, 0, 0.5) }
.counter { position: fixed; bottom: 0; border-bottom: 0; opacity: 0; transform-origin: bottom; box-shadow: inset -4px 4px 8px rgba(240, 240, 240, 0.75), -4px 4px 8px rgba(0, 0, 0, 0.5) }
```

```js
addEventListener('wheel', animation)
```

### [Parallax Glow](https://codepen.io/pranjaldub1999/pen/zYdGLLJ)

on scroll: span.scroll: transform+top ×8, g.[object: opacity+top ×5, g.[object: transform+top ×5, li.scroll: transform+top ×2, g.[object: transform+opacity+top | on hover of li.scroll: g.[object: opacity ×6, g.[object: transform+top ×5, g.[object: transform+opacity+top | made with: @keyframes · scroll listener

```css
span { position: absolute; box-shadow:0 0 0px lightblue, 0 0 40px cyan, 0 0 80px lightblue, 0 0 120px cyan }
.one { bottom: 10px }
.onetwo { bottom: 10px }
.two { bottom: 10px }
.three { bottom: 10px }
.four { bottom: 10px }
.five { top: 10px }
.six { top: 10px }
.seven { top: 10px }
.eight { top: 10px }
0% { transform:rotateZ(0deg) }
50% { transform:rotateZ(60deg) }
```

```js
addEventListener('scroll', function (e) {
```

### [jQuery.parallaxBox](https://codepen.io/dmitryulyanov/pen/MWoNeJd)

on hover of a.download-btn: a.download-btn: background | made with: transition · :hover

```css
.download-btn { box-shadow: 0px 1px 3px 0 #1122338f; transition: all 0.1s }
.download-btn:active { box-shadow: unset }
.parallax-block { padding-bottom: 22% }
```

### [Parallax Card Sunset](https://codepen.io/mephysto/pen/KKqjaeP)

on scroll: span.: transform+top ×6, div.card: transform+shadow+top | made with: position: fixed · transition · :hover · 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking

```css
#debug { position: fixed; top: 0 }
.container { perspective: 1200px }
.card { transform: scale(0.9); transition: transform 250ms ease-out, box-shadow 250ms ease-out; position: relative; box-shadow: 0px 5px 10px 2px rgba(33, 33, 33, 0.125) }
.card:hover { box-shadow: 0px 12px 33px 8px rgba(255, 252, 163, 0.25); transform: rotateY(calc(var(--offset-x) * 30deg)) rotateX(calc(var(--offset-y) * 30deg)) }
.card:hover .layers > span:nth-child(1) { transform: translate3d(calc(var(--offset-x) * -100px), calc(var(--offset-y) * -70px), 0) }
.card:hover .layers > span:nth-child(2) { transform: translate3d(calc(var(--offset-x) * -20px), calc(var(--offset-y) * -10px), 0) }
.card:hover .layers > span:nth-child(3) { transform: translate3d(calc(var(--offset-x) * -20px), calc(var(--offset-y) * -10px), 0px) }
.card:hover .layers > span:nth-child(4) { transform: translate3d(calc(var(--offset-x) * 70px), calc(var(--offset-y) * 60px), 0px) }
.card:hover .layers > span:nth-child(5) { transform: translate3d(calc(var(--offset-x) * 100px), calc(var(--offset-y) * 70px), 0px) }
.card:hover .layers > span:nth-child(6) { transform: translate3d(calc(var(--offset-x) * 150px), calc(var(--offset-y) * 80px), 0px) }
.card .layers { position: absolute; top: 0 }
.card .layers > span { position: absolute; top: 0; transition: transform 250ms ease-out }
```

```js
style.setProperty("--offset-x", xOffset)
style.setProperty("--offset-y", yOffset)
addEventListener("mousemove", onMouseMoveHandler)
```

### [Scroll parallax animation - gsap](https://codepen.io/samritha/pen/MWoRBNo)

held: fixed p.scroll | on scroll: svg.[object: opacity+top ×3, svg.[object: transform+opacity+top ×2, svg.[object: transform+top, p.scroll: transform+opacity+top | made with: clip-path · GSAP

```css
.wrapper { position:relative }
.bg-svg { position:absolute; top:0 }
.moon { position:absolute; bottom:0 }
.rocket { position:absolute; bottom:0px; transform:rotate(-10deg) }
.scroll { top:30%; position:absolute; opacity:14% }
.shooting-star { position:absolute; bottom:-10px }
.planet { position:absolute; bottom:40% }
.crow { position:absolute; bottom:30%; opacity:0 }
.crow-2 { position:absolute; bottom:10% }
.star-2 { position:absolute; top:0 }
```

### [Parallax image](https://codepen.io/penny289/pen/JjJzYbv)

on scroll: div.img-box: transform+top ×5, div.: transform+opacity+top ×5 | on hover of img.: div.img-box: transform+top ×5, div.: opacity+top ×5 | made with: scroll() timeline · transition

```css
.container { position:relative }
.img-box { position:absolute; transition:1.2s transform cubic-bezier(0, 0, 0.23, 0.95) }
.img-box div img { box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px }
.img-box.box-1 { top:20% }
.img-box.box-2 { top:100% }
.img-box.box-3 { top:50% }
.img-box.box-4 { top:0% }
.img-box.box-5 { top:120% }
.scroll { margin-top:40% }
.img-fluid { padding-top:30px; padding-bottom:30px }
.container.top .img-box div { opacity:1; transition: opacity 0.7s ease, transform .4s ease-out }
.container.top.fadeOut .img-box div { transform:translateY(-25px); opacity:0; transition: opacity 0.7s ease, transform .4s ease-out }
```

### [Parallax Image React Component](https://codepen.io/chrisjdesigner/pen/bGROpdy)

made with: GSAP

```css
.parallax-image-background img { object-position: 0 0 }
```

```js
gsap.to($backgroundImage.current, {
scrollTrigger: { trigger: $root.current, start: "top bottom", end: "bottom top", scrub: true }
```

### [Parallax SVG](https://codepen.io/soju22/pen/QWgVWee)

held: fixed svg.[object | made with: position: fixed · transition · requestAnimationFrame

```css
.main { transition: background-color 5s }
svg { position: fixed; top: 0; opacity: 0.9; transition: filter 5s }
path { transition: fill 3s, stroke 5s }
```

```js
requestAnimationFrame(this.animate)
```

### [svg animation - galaxy](https://codepen.io/nazanin3s/pen/XWgEmWR)

on scroll: polygon.[object: transform+top ×6, g.[object: transform+top ×5, g.[object: transform, path.[object: transform+top | made with: GSAP

```css
.body { top: 50%; position: absolute; transform: translate(-50%, -50%) }
.body svg { top: 50%; position: absolute; transform: translate(-50%, -45%); position: absoloute }
```

```js
gsap.to('#starsSmall polygon', .4,{
gsap.to('#saturn', 2.5,{
gsap.to('#starsBig polygon, #starsBig path', 2.5,{
gsap.to('#rocket', 5,{
gsap.to('#jupiter', 2.5,{
gsap.to('#earth',2.5,{
gsap.to('#earth path.small', 2.5, {
gsap.to('#orbit',2.5,{
```

### [Parallax on scroll. Native JS](https://codepen.io/kudg0/pen/LYLQPBd)

on scroll: div.item__img: transform+top, span.parallaxOnScroll: transform+top | made with: IntersectionObserver · scroll listener · requestAnimationFrame

```css
.parallaxOnScroll { will-change: transform }
body { padding-top: 50vh }
.content .content__item.content__item_img .item__img { position: relative }
.content .content__item.content__item_img .item__img:after { position: absolute; top: 10px }
```

```js
addEventListener("scroll", parallaxItemOnScroll)
new IntersectionObserver(callback, options)
requestAnimationFrame( () => {
```

### [svg animation - parallax](https://codepen.io/nazanin3s/pen/rNwpWBL)

on scroll: rect.[object: opacity ×14, line.[object: transform ×10, circle.[object: transform ×6, g.[object: transform ×3, rect.[object: transform, polygon.[object: transform+top | made with: mix-blend-mode · GSAP · pointer / mouse tracking

```css
.body svg { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

```js
gsap.timeline({repeat:-1, yoyo:true})
gsap.to(blo,1 , {
gsap.to('#blocks line', 3,{
gsap.to([noLine, curLine1], 1,{
gsap.to(curLine2, 1, {
addEventListener("mousemove" , movePics)
gsap.to(c, 5,{
```

### [Spotlight Inc.](https://codepen.io/vedpanse/pen/PojJMQy)

made with: nothing recognised — read the code

### [Parallax Desert Scene With Sticky Header](https://codepen.io/RebelJess/pen/vYZmJLP)

held: sticky header | on scroll: image.[object: transform+top ×8 | made with: position: sticky · transition · scroll listener

```css
body { position: relative }
svg { margin-bottom: 0 }
header { margin-top: -5px }
#sticky-div { position: sticky; top: 0 }
l1, l2, l3, l4, l5, l6, l7, l8 { transition: 0.5s ease; transform: translate3d(0, 0, 0) }
article { padding-bottom: 5em }
footer { position: absolute; bottom: -18px; margin-bottom: 0 }
```

```js
addEventListener('scroll', parallax)
```

### [CSS parallax](https://codepen.io/jibhey/pen/VwWbmRb)

made with: 3D (perspective / preserve-3d)

```css
body .parallax_wrapper { perspective: 300px }
body .parallax_wrapper .parallax_group { position: relative }
body .parallax_wrapper .parallax_group .parallax_layer { position: absolute; inset: 0 }
body .parallax_wrapper .parallax_group .parallax_layer.base_layer { transform: translateZ(-300px) scale(2.1) }
body .parallax_wrapper .parallax_group .parallax_layer.mid_layer { transform: translateZ(0) }
body .parallax_wrapper .parallax_group .parallax_layer.top_layer { transform: translateZ(210px) scale(0.3) }
```

### [parallax mousemove effect](https://codepen.io/mrgawp/pen/YzQZdJP)

on scroll: h2.: transform ×7 | made with: @keyframes · custom properties driven by JS · pointer / mouse tracking

```css
.title { padding-top:30px; position: relative }
.title h1 { position: absolute }
.bottom { position: relative }
.bottom h1 { position: absolute }
.textoid-b { margin-top:-50px; position: absolute; transform: rotate(2deg) }
.textoid-bb { margin-top:-50px; position: absolute; transform: rotate(2deg) }
.paralax-p { margin-top:-52px; padding-top: 18px; padding-bottom: 20px; transform: rotate(2deg) }
.textoid { padding-top: 9px; position: relative; transform: rotate(-2deg) }
.textoid h2 { position: relative; transform: translateX(calc(0% - var(--x) * var(--i) )) }
.textoid h2 span:nth-child(even) { animation: lilg 2500ms infinite }
.textoid h2 span:nth-child(odd) { animation: lilg 3000ms infinite }
@keyframes lilg animates text-shadow
```

```js
addEventListener("mousemove", e => {
style.setProperty('--x', e.clientX + 'px')
```

### [Parallax Background](https://codepen.io/kevincj/pen/rNwydEY)

on scroll: div.layer: transform ×4 | made with: GSAP · pointer / mouse tracking

```css
body { position: relative }
.reveal { position: absolute; inset: 0 }
.quote-caption { margin-top: 2.5rem }
.parallax { position: absolute; inset: 0 }
.layer { position: absolute; inset: 0 }
.circle { position: absolute }
.layer:nth-child(1) .circle:nth-child(1) { top: 14% }
.layer:nth-child(1) .circle:nth-child(2) { bottom: 8% }
.layer:nth-child(2) .circle:nth-child(1) { top: 24% }
.layer:nth-child(2) .circle:nth-child(2) { bottom: 28% }
.layer:nth-child(3) .circle:nth-child(1) { top: 8% }
.layer:nth-child(3) .circle:nth-child(2) { bottom: 24% }
```

```js
gsap.timeline()
gsap.to(layer, {
addEventListener("mousemove", parallaxEffect)
```

### [Basic Parallax Scrolling](https://codepen.io/DanGasson/pen/dyROrWw)

made with: 3D (perspective / preserve-3d)

```css
section { position: absolute }
.container { position: relative; perspective: 1px }
.green { position: relative; top: 40px; margin-bottom: 105px; transform: translateZ(-0.4px) scale(1.4) }
.red { position: relative; top: 70px; margin-bottom: 100px; transform: translateZ(0.2px) scale(0.8) }
.blue { position: relative; top: 60px; margin-bottom: 110px; transform: translateZ(0.6px) scale(0.4) }
```

### [Animation on scroll in hero section](https://codepen.io/alessiomarcone/pen/ExXPGzo)

on scroll: img.: transform+top ×5 | on hover of a.: img.: transform ×5, h1.text-center: transform+opacity, h5.title-focus: opacity, img.img-fluid: transform | made with: position: fixed · @keyframes · transition · :hover · GSAP

```css
body { transition: all 300ms ease-in-out; -webkit-transition: all 300ms ease-in-out; -moz-transition: all 300ms ease-in-out; -ms-transition: all 300ms ease-in-out; -o-transition: all 300ms ease-in-out }
.boxed-btn { text-transform: uppercase }
[data-overlay] { position: relative; background-position: center center }
[data-overlay]::before { position: absolute; top: 0; bottom: 0 }
[data-opacity="1"]::before { opacity: 0.1 }
[data-opacity="2"]::before { opacity: 0.2 }
[data-opacity="3"]::before { opacity: 0.3 }
[data-opacity="4"]::before { opacity: 0.4 }
[data-opacity="5"]::before { opacity: 0.5 }
[data-opacity="6"]::before { opacity: 0.6 }
[data-opacity="7"]::before { opacity: 0.7 }
[data-opacity="8"]::before { opacity: 0.8 }
```

```js
gsap.to("#bg03", {
scrollTrigger : { scrub: 1 }
gsap.to("#bg02", {
gsap.to("#bg01", {
gsap.to("#cloudDx", {
gsap.to("#cloudSx", {
gsap.from("#text", {
gsap.to("#text", {
```

### [Text parallax](https://codepen.io/serega-seleznev/pen/qBjOyMm)

on scroll: h2.layer: transform ×2 | made with: clip-path · pointer / mouse tracking

```css
section { position: relative }
section .textBox { position: absolute; top: 0; -webkit-clip-path: polygon(0 0, 50% 0, 50% 100%, 0% 100%); clip-path: polygon(0 0, 50% 0, 50% 100%, 0% 100%) }
.skew1 h2, .textBox .skew2 h2 { position: absolute }
.skew1, .skew2 { position: relative; top: 50px }
.skew1 { transform: skewY(20deg) }
.skew2 { transform: skewY(340deg) }
.skew1 h2 { opacity: 0.6 }
```

```js
addEventListener("mousemove", parallaxText)
```

### [Parallax waves](https://codepen.io/serega-seleznev/pen/dyRPJxY)

on scroll: span.: transform+top ×8, div.parallax__wave: transform+top ×6, div.parallax__litehouse: transform+top | on hover of li.: span.: transform+top ×8, div.parallax__wave: transform+top ×6, div.parallax__litehouse: transform+top | made with: @keyframes · transition

```css
.wrapper { opacity: 0; transition: all 1s ease 0s }
.wrapper.active { opacity: 1 }
.wrapper.active .parallax__wave { opacity: 1; transition: all 1s ease 1s }
.wrapper.active .parallax__rope { opacity: 1; transition: all 1s ease 1.8s }
.wrapper.active .parallax__litehouse { bottom: 130px; transition: all 0.8s ease 2.5s }
.page, .parallax:after { position: absolute }
.page { top: 0 }
.parallax:after { bottom: 0 }
.parallax__bg, .parallax__list, .parallax__list li { position: absolute; top: 0 }
.parallax__bg { top: -5% }
.parallax__rope { position: absolute; opacity: 0 }
.parallax__rope_1 { top: 5%; transform: scale(1) }
```

### [Steve Jobs - Tribute Page freeCodeCamp](https://codepen.io/Keshraf/pen/OJgPREW)

made with: nothing recognised — read the code

```css
.info { background-position: center }
#tribute-link { margin-top: 200px; margin-bottom: 190px }
.cred { margin-top: 20px; margin-bottom: 20px }
```

### [Parallax mountains](https://codepen.io/serega-seleznev/pen/JjJoPJX)

held: fixed div.parallax__mountain, fixed div.parallax__mountain, fixed div.parallax__mountain, fixed div.parallax__fog | on scroll: div.parallax__mountain: transform+top ×3, div.parallax__fog: transform+opacity+top | made with: position: fixed · scroll listener

```css
.page { position: absolute; top: 0 }
.parallax { position: relative }
.parallax__mountain { position: fixed; top: 0 }
.parallax__fog { position: fixed; top: 0 }
.content { position: relative }
.content__header { text-transform: uppercase; margin-bottom: 20px }
.content__article p { margin-bottom: 20px }
```

```js
addEventListener("scroll", e => {
```

### [Harry Potter Wizard Card](https://codepen.io/iSepehr/pen/MWoWOxE)

on scroll: div.wizard-card: transform, div.img: transform, div.char: transform | made with: clip-path · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
body { perspective: 600px }
.wizard-card { position: relative }
.back { top: 2.5%; position: absolute; clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%) }
.img { position: absolute }
.character { position: absolute; clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%) }
.char { position: absolute }
.frame { position: absolute; clip-path: polygon(50% 1%, 100% 39%, 80% 98%, 20% 98%, 0% 39%) }
.pos { position: absolute; top: 0 }
.circle { position: absolute }
```

```js
addEventListener('mousemove', (e) => {
```

### [Solar Rooftop Banner 4](https://codepen.io/stevenmonson/pen/zYzYzjR)

on scroll: img.cityscape: transform+top, div.flare: transform+top, img.: transform+top | on hover of a.: img.: transform+top | made with: @keyframes · transition · :hover · custom properties driven by JS · scroll listener

```css
#header { box-shadow: 0px 2px rgba(255, 224, 130, 0.25); position:relative }
#site-logo img { vertical-align:top }
.banner { position:relative; padding-bottom:60% }
.banner .cityscape { position:absolute; bottom:-9%; //object-position: 50% 100%; transform:translateY( calc( 10vw * var(--bannerScroll,0) ) ); will-change: transform }
.banner .flare { position:absolute; top:33%; transform:translateY( calc( 10vw * var(--bannerScroll,0)) ) }
.banner .flare img { animation: 3s rotate linear infinite }
0% { transform:rotate(0deg) scale(0.5) }
50% { transform:rotate(179.5deg) scale(1) }
100% { transform:rotate(359deg) scale(0.5) }
.banner img.house { position:absolute; bottom:-8%; //transform:translateY( calc( var(--bannerScroll, 0) * 25% ) ); will-change: transform }
.banner .textbox { position:absolute; top:calc(52% * var(--bannerScroll, 0) + 2.8vw ); padding-bottom:1.3em; transform: translateX(2%) skew(-8deg); will-change: top transform }
.banner .textbox:before { position:absolute; top:-3%; will-change: left }
```

```js
addEventListener('scroll', calcScroll)
style.setProperty('--scrollpx', y)
style.setProperty('--bannerScroll', bannerScroll)
```

### [Solar Panel Banner 2](https://codepen.io/stevenmonson/pen/vYmomLj)

on scroll: img.cityscape: transform+top, div.flare: transform+top, img.: transform+top, img.house: transform+top | on hover of img.cityscape: div.flare: transform+top, img.: transform+top | made with: @keyframes · custom properties driven by JS · scroll listener

```css
.banner { position:relative; padding-bottom:calc( 68% + 5vh) }
.banner .cityscape { position:absolute; top:0; object-position: 50%; transform:translateY( calc( 35% * var(--bannerScroll) ) ); will-change: transform }
.banner .flare { position:absolute; top:36%; filter:blur(0.5vw); animation: 8s grow ease-out infinite alternate }
0% { transform:scale(0.5) }
100% { transform:scale(1.5) }
.banner .flare img { animation: 16s rotate infinite linear }
100% { transform:rotate(359deg) }
.banner img.house { position:absolute; bottom:0%; transform:translateY( calc( var(--bannerScroll) * 25% ) ); will-change: transform }
.banner .textbox { position:absolute; top:calc(90% * var(--bannerScroll) + 10% ); padding-bottom:1.3em; transform: translateX(2%) skew(-8deg); will-change: top }
.banner .textbox:before { position:absolute; top:0; will-change: left }
.banner .textbox:after { position:absolute; bottom:0; will-change: right }
.banner .textbox .headline { text-transform:uppercase }
```

```js
addEventListener('scroll', calcScroll)
style.setProperty('--scrollpx', y)
style.setProperty('--bannerScroll', bannerScroll)
```

### [Parallax background with GSAP](https://codepen.io/ooblek/pen/BaRELWe)

on scroll: img.layer: transform+top ×4 | made with: GSAP

```css
.parallax-imgs { bottom:0 }
.layer { position:absolute; bottom:0 }
.scroll-indicator { position:absolute; top:0 }
.extra-content { position:relative }
```

```js
gsap.to('#layer-1', {
scrollTrigger:{ trigger:".extra-content", scrub:0.3 }
gsap.to('#layer-2', {
gsap.to('#layer-3', {
gsap.to('#layer-4', {
```

### [Parallax Mouse Move](https://codepen.io/wikyware-net/pen/vYmbWdj)

on scroll: div.ag-parallax_img-box: transform+top ×3 | on hover of img.: div.ag-parallax_img-box: transform ×3 | made with: transition · clip-path · pointer / mouse tracking

```css
.ag-parallax_item { -webkit-clip-path: polygon(100% 0, 100% calc(100% - 65px), calc(100% - 65px) 100%, 0 100%, 0 0); clip-path: polygon(100% 0, 100% -moz-calc(100% - 65px), -moz-calc(100% - 65px) 100%, 0 100%, 0 0); clip-path: polygon(100%  }
.ag-parallax_box { -webkit-transition: all .4s ease-out; -moz-transition: all .4s ease-out; -o-transition: all .4s ease-out; transition: all .4s ease-out; position: relative }
.ag-parallax_img-box { position: absolute; top: 0; will-change: transform }
.ag-parallax_img-box img { position: absolute; bottom: 0 }
```

```js
addEventListener('mousemove', function (event) {
```

### [scrollsticky sections](https://codepen.io/simo_m/pen/yLbRYZv)

held: sticky img.sticky-image, sticky div.scrolling, sticky img.sticky-image, sticky span.sticky-image, sticky img.sticky-image, sticky span.sticky-image, sticky div.scrolling | made with: position: sticky

```css
.scrolling__inner { box-shadow: 0 12px 20px -6px rgba(0, 0, 0, 0.3) }
.sticky-section { position: relative }
.sticky-image { position: sticky; top: 0; background-position: center }
.scrolling { position: relative }
.scrolling[data-pin] { position: sticky; padding-bottom: 0 }
.scrolling[data-pin=top] { top: 0 }
.scrolling[data-pin=bottom] { bottom: 0 }
```

### [HTML, CSS, JS parallax animation](https://codepen.io/jmjara145/pen/rNmZPmM)

on scroll: div.e-section__layer: transform+top ×4, div.g-section__layer: transform+top ×4, div.h-section__layer: transform+top ×4, div.f-section__layer: transform+top ×2 | made with: transition

```css
hr.dotted { border-top: 1px dotted #fff }
.o-anim-ty { will-change: transform; -webkit-transition: -webkit-transform 1.0s linear; transition: -webkit-transform 0.3s linear; transition: transform 1.0s linear; transition: transform 1.0s linear, -webkit-transform 0.3s linear }
.parr { padding-top: 5%; padding-bottom: 5% }
.parr2 { padding-top: 5%; padding-bottom: 5% }
.c-section__scene { position:static }
.c-section__layers { position: relative }
.c-section__layer { position: absolute; top: 0px }
.c-section__layer--1 { position: static }
.c-section__layer--titulo { padding-top: 7% }
.c-section__layer--2 { -webkit-transform: translateX(calc( ( var(--ty) * 0) )); transform: translateX(calc( ( var(--ty) * -4) )) }
.c-section__layer--3 { -webkit-transform: translateY(calc( ( var(--ty) * 0) )); transform: translateY(calc( ( var(--ty) * -3) )) }
.c-section__layer--4 { -webkit-transform: translateY(calc( ( var(--ty) * 0) )); transform: translateY(calc( ( var(--ty) * -5) )) }
```

### [Corner Text Parallax Effect](https://codepen.io/cjr85/pen/ZEKjdGv)

on scroll: h2.layer: transform ×2 | made with: clip-path · pointer / mouse tracking

```css
section { position: relative }
section .textBox { position: absolute; top: 0; clip-path: polygon(0 0, 50% 0, 50% 100%, 0% 100%) }
.skew1 h2, .textBox .skew2 h2 { position: absolute }
.skew1 h2 { opacity: 0.6 }
.skew1 { position: relative; top: 50px; transform: skewY(20deg) }
.skew2 { position: relative; top: 50px; transform: skewY(340deg) }
```

```js
addEventListener('mousemove', parallaxText)
```

### [100 Followers 🥳](https://codepen.io/elsemeow/pen/VwbdvGP)

on scroll: g.[object: transform ×4, g.[object: transform+top ×4, g.[object: transform+opacity+top | made with: @keyframes · transition

```css
.center { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.animation_paused { -webkit-animation-play-state: paused !important; animation-play-state: paused !important }
.home { position: absolute; top: 0; bottom: 0 }
.home-rect-b { transform: translate(-50%, -50%) rotate(30deg) }
.home-rect-o { transform: translate(-50%, -50%) rotate(7deg); margin-top: -1vmin }
.home-rect-o::after { position: absolute; top: -25vmin }
.home-mill { margin-top: -10vmin }
.home-title { transform: translate(-50%, -35%); margin-top: 30vmin }
#mill-solid { -webkit-animation: mill_solid 3s ease-in-out alternate infinite; animation: mill_solid 3s ease-in-out alternate infinite }
0% { transform: translateY(0) }
100% { transform: translateY(7%) }
0% { transform: translateY(0) }
```

### [3D Rotatable Parallax Card Demo](https://codepen.io/CPSiegen/pen/xxdzGMB)

on scroll: div.card: transform+shadow+top ×3 | on hover of div.cards: div.card: transform+shadow+top ×3 | made with: backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d)

```css
* { position:relative }
.cards { transform: perspective(800px) }
.card { background-position: 50% 30%, center center, center center; transform: rotateX(0deg) rotateY(0deg); will-change: transform, box-shadow, background-position }
.card:after { position:absolute; top:-20px; transform:translate(-50%, -100%) }
.card-back { top: -10px; position: absolute; transform: translateZ(-3px) }
.card-overlay { top: -10px; position: absolute; transform: rotate3D(0,0,0); transition-property: background, background-position; will-change: background-position }
.glossy .card-overlay { opacity: 60%; mix-blend-mode: overlay }
.holo .card-overlay { opacity: 90%; mix-blend-mode: color-dodge }
.card-header { padding-bottom: 3px }
.badge { position: absolute; box-shadow: -2px 2px 2px 1px rgba(0, 0, 0, 0.25) }
.card-hp:before { position: absolute; top: calc(100% - 5px); transform: translateY(-100%) }
#controls { backdrop-filter: blur(5px) brightness(1.2); box-shadow: 0 5px 5px rgba(0,0,0,0.2) }
```

### [Pure CSS - 3D Cube w/ Parallax](https://codepen.io/nexii/pen/rNmdyOj)

held: sticky div.cube | on scroll: div.cube: transform | made with: position: sticky · @keyframes · 3D (perspective / preserve-3d)

```css
body { perspective: 300vh }
.cube { position: sticky; top: 50vh; transform: translateY(-50%) rotateX(90deg); animation: cube-rotate 10s infinite }
from { transform: translateY(-50%) rotateX(90deg) rotateZ(0.125turn) }
to { transform: translateY(-50%) rotateX(90deg) rotateZ(1.125turn) }
.cube .north { transform: rotateX(-90deg); transform-origin: top }
.cube .south { transform: rotateX(90deg); transform-origin: bottom }
.cube .west { transform: rotateY(90deg) }
.cube .east { transform: rotateY(-90deg) }
.cube .bottom { transform: translateZ(-25vh) }
@keyframes cube-rotate animates transform
```

### [simpleParallax](https://codepen.io/suriDaitan/pen/oNWGrKR)

held: fixed div.overAll, fixed div.overAll1 | made with: position: fixed · mix-blend-mode

```css
div { position: relative }
.overAll { position: fixed; top: 0; mix-blend-mode: multiply }
.overAll1 { position: fixed; top: 80vh; mix-blend-mode: multiply }
h1 { top: 18vh; position: absolute }
h3 { top: 0vh; position: absolute }
```

### [Prallax images in content with intersection observer](https://codepen.io/Nordlicht2297/pen/LYyzvjY)

on scroll: img.two: transform+top, img.one: transform+top, img.three: transform+top | made with: mix-blend-mode · IntersectionObserver · scroll listener

```css
h1 { position: relative }
h1::before { position: absolute; top: 20%; transform: translate(-50%, -50%); mix-blend-mode: hard-light }
img { box-shadow: 0 0.7px 2.2px rgba(0, 0, 0, 0.017), 0 1.8px 5.3px rgba(0, 0, 0, 0.024), 0 3.4px 10px rgba(0, 0, 0, 0.03), 0 6px 17.9px rgba(0, 0, 0, 0.036), 0 11.3px 33.4px rgba(0, 0, 0, 0.043), 0 27px 80px rgba(0, 0, 0, 0.0 }
```

```js
new IntersectionObserver(intersectionCallback, options)
addEventListener('scroll', parallaxHandler)
```

### [Gsap animation apple aripods](https://codepen.io/Alvin_joy_mavely/pen/oNWebNj)

held: fixed canvas | made with: position: fixed · GSAP · canvas 2D

```css
canvas { position: fixed; top: 50%; transform: translate(-50%, -50%) }
```

```js
gsap.to(airpods, {
scrollTrigger: { scrub: 0.5 }
```

### [Simple parallax - pure JavaScript](https://codepen.io/HrossDev/pen/qBmjzpG)

on scroll: section.hero: transform+top | made with: scroll listener

```css
.hero { background-position: center; position: relative }
.hero::before { position: absolute; bottom: 0 }
.hero__content-wrap { position: relative }
.hero__title { padding-bottom: 1rem }
.hero__subtitle { text-transform: uppercase }
.about { position: relative }
```

```js
addEventListener("scroll", function () {
```

### [Undah Da See (3D parallax w/vanilla tilt)](https://codepen.io/Trentdec/pen/dyWRJLJ)

made with: 3D (perspective / preserve-3d)

```css
.water { position: relative; top: 20%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%) }
.shark { position: absolute; top: 50%; -webkit-transform: translate3d(-50%, -50%, 80px); -moz-transform: translate3d(-50%, -50%, 80px); -ms-transform: translate3d(-50%, -50%, 80px); -o-transform: translate3d(-50%, -50%, 80px); tr }
```

### [Parallax Page (CSS & HTML only)](https://codepen.io/fliptopbox/pen/mdmweaW)

made with: nothing recognised — read the code

```css
.paralax { background-position: center }
.title { position: relative }
.title.letterbox h1 { bottom: unset }
.title h1 { position: absolute; bottom: 0; padding-bottom: 10vh }
.title em { position: absolute; top: 0; padding-top: 5vh }
.title:after { position: absolute }
```

### [Parallax using JS](https://codepen.io/mrugendra-shivaling-shilvant/pen/PommeVV)

made with: :hover · scroll listener

```css
.heading { position: absolute; top: 0 }
section { position: relative }
section #text { position: absolute }
section #planet { position: absolute; top: 0 }
section #stars { position: absolute; top: 100% }
section #btn { transform: translateY(180px) }
main { position: absolute; top: 195% }
```

```js
addEventListener('scroll', function(){
```

### [Wanderlust.](https://codepen.io/vedpanse/pen/yLbMmPY)

made with: nothing recognised — read the code

### [Parallax website](https://codepen.io/zaramichelle/pen/PomppXM)

made with: nothing recognised — read the code

```css
.parallaxone { background-position: center }
.parallaxtwo { background-position: center }
.parallaxthree { background-position: center }
.parallaxfour { background-position: center }
.parallaxfive { background-position: center }
```

### [Untitled](https://codepen.io/josephhservsol/pen/jOmMVbK)

held: fixed svg.[object | on scroll: path.[object: transform+top ×14 | on hover of li.timeline-item: path.[object: transform+top ×13, path.[object: transform ×3, path.[object: transform+opacity+top | made with: position: fixed · transition · :hover · mix-blend-mode · GSAP · ScrollTrigger

```css
.timeline-item { position: relative }
.timeline-item:last-child { padding-bottom: 0 }
.timeline-info { text-transform: uppercase }
.timeline-marker { position: absolute; top: 0; bottom: 0 }
.timeline-marker:before { position: absolute; top: 4px; transition: background 0.3s ease-in-out, border 0.3s ease-in-out }
.timeline-marker:after { position: absolute; top: 24px; bottom: 0 }
.timeline-content { padding-bottom: 40px }
.timeline-content p:last-child { margin-bottom: 0 }
.period .timeline-marker:before { top: 0; bottom: 30px; position: absolute; border-top: 3px solid #ccd5db; border-bottom: 3px solid #ccd5db }
.period .timeline-marker:after { top: auto }
.timeline-split .timeline-info, .timeline-centered .timeline-info, .timeline-spl { vertical-align: top }
.timeline-split .timeline-marker, .timeline-centered .timeline-marker { position: relative }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline()
ScrollTrigger.create({
gsap.fromTo(
gsap.to("#bird", { scaleX: 1, rotation: 0 })
gsap.to("#bird", { scaleX: -1, rotation: -15 })
gsap.to(item, {
gsap.to("#bats", { opacity: 0, delay: 2 })
```

### [Parallax Scroll Practice](https://codepen.io/ben-gabriel/pen/YzVqMqP)

held: fixed div.prompt, fixed img, fixed img, fixed img, fixed img, fixed img | on scroll: img.: transform+top ×4, div.prompt: opacity | on hover of img.: div.prompt: opacity | made with: position: fixed · transition · scroll listener

```css
.container { position:absolute }
img { position: fixed; top: 100% }
#img4 { object-position: center }
#img1 { top: 0% }
.prompt { position: fixed; transition: all 1s }
.fade { opacity: 0 }
```

```js
addEventListener('scroll', ()=>{
```

### [Slider vertical dynamic parallax](https://codepen.io/antho-fsy/pen/vYmLvZy)

held: fixed div.slides | on scroll: div.slide: transform+top ×2, div.layer: transform+top, div.layer: transform+opacity+top | on hover of img.: div.layer: transform+opacity+top | made with: GSAP

```css
.layer { position: relative; top: 50%; transform: translateY(-50%) }
.layer h1 { margin-bottom: 20px }
.slide { position: absolute }
.slide .bg { position: absolute; top: 0 }
.slide .bg::after { position: absolute; top: 0 }
.slide .bg ~ .layer { position: relative }
.content h1 { margin-bottom: 10px }
```

### [Night Drive](https://codepen.io/AnuragKuradia/pen/JjNGeNm)

on scroll: img.: transform+top ×4, a.scroll-down: opacity+top, span.: transform+opacity+top, div.arrow: transform+top, span.: opacity+top, h2.: transform+opacity+top | on hover of a.scroll-down: img.: transform+top ×4, a.scroll-down: opacity, span.: transform+opacity+top, div.arrow: transform+top, span.: opacity+top, h2.: transform+opacity+top | made with: @keyframes · mix-blend-mode · GSAP · ScrollTrigger

```css
#scroll { position: absolute }
.scroll-down { position: absolute; bottom: 10%; transform: translateX(-50%) }
.mouse { margin-bottom: 0.4rem }
.mouse span { animation: mouse-wheel 0.8s linear infinite }
.arrow { animation: arrow 0.8s linear infinite }
.arrow span { transform: rotate(45deg); animation: down-arrow 0.8s alternate infinite }
#container::before { position: absolute; bottom: 0 }
#container::after { position: absolute; top: 0; mix-blend-mode: color }
#container { position: relative }
#container img { position: absolute; top: 0 }
#moon { object-position: 80% }
#car { object-position: 50% 100% }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline({
scrollTrigger:{ scrub: 2, }
```

### [Parallax Image Gallery](https://codepen.io/shirshen/pen/WNpqwvg)

held: fixed div.bg | on hover of img.: div.box: transform, img.: transform+top, h1.: transform+opacity+top, p.: transform+opacity+top, a.: transform+opacity+top | made with: position: fixed · transition · :hover · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.bg { position: fixed; top: 0; filter: blur(3px); opacity: 0.2 }
.bg::after { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.bg::before { position: absolute; top: 50%; transform: translate(-50%, -50%) rotate(45deg) }
.gallery { position: relative }
.box { position: relative; transform: translate(0, 0) rotateX(0deg) rotateY(0deg); perspective: 512px; transition: 0.3s ease-out }
.box img { transition: 0.3s ease-out }
.box:hover img { transform: scale(1.1) }
.box > *:not(img) { position: absolute; transform: translate3d(-50%, -50%, 0); opacity: 0; transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1) }
.box:hover > *:not(img) { opacity: 1; transform: translate3d(-50%, -50%, 50px) }
.box h1 { top: 20% }
.box p { top: 50% }
.box a { top: 80%; transition: 0.3s, background-position 0.3s 0.3s, opacity 0.5s 0.4s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s 0.4s cubic-bezier(0.22, 1, 0.36, 1) }
```

```js
addEventListener("mousemove", (e) => {
```

### [Barcelona Transfer Page](https://codepen.io/mrugendra-shivaling-shilvant/pen/QWpRaBx)

held: sticky div.navigation | made with: position: sticky · :hover

```css
.navigation { position: -webkit-sticky; position: sticky; top: 0px }
.navigation a { position: relative }
.content p { top: 0px }
.parallax { background-position: center }
.foot a { margin-top: 0px; margin-bottom: 15px }
```

### [simple parallax1](https://codepen.io/agarwal-ankit007/pen/dyvEVPv)

on scroll: li.scroll: transform+top ×2, span.scroll: transform+top | made with: scroll listener

```css
span { position:absolute; bottom:0 }
```

```js
addEventListener('scroll',function(e){
```

### [Parallax Website](https://codepen.io/solygambas/pen/poeBdPr)

held: fixed section | on scroll: img.background: transform+top, img.girl: transform+top, img.rock: transform+top | made with: GSAP

```css
nav { position: absolute }
.container img { position: absolute }
.main-title { position: absolute; top: 30%; transform: translate(-50%, -50%) }
.content { position: absolute }
```

```js
gsap.timeline()
```

### [Pure CSS Parallax Scrolling](https://codepen.io/Denis-Alex/pen/dyvLYPa)

made with: nothing recognised — read the code

```css
.parallax-inner { padding-top: 20%; padding-bottom: 20% }
h3 { margin-top: 50px; margin-bottom: 50px }
```

### [ScrollMagic parallax](https://codepen.io/DarkCodez/pen/yLMZPzx)

on scroll: div.: transform+top | made with: transition · GSAP

```css
div.bg { position: relative }
div.bg > div { position: absolute; top: 0; transition: all .4s }
```

### [C.S. Lewis Tribute Page](https://codepen.io/CapePea/pen/RwpvaNv)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
h1 { text-transform: uppercase }
.parallax1 { background-position: center; position: relative }
.parallax { background-position: center }
.retroshadow { margin-bottom: 350px }
.heading { top: 30% }
.middle { top: 15% }
a.clive { position: relative; text-transform: uppercase; transition: all .3s }
a.clive:before { position: absolute; top: 100%; transform: rotateX(-90deg) }
a.clive:hover { transform: rotateX(58deg) }
.button-three { position: relative }
.button-three:hover { box-shadow:0px 2px 10px 5px #B56900 }
.button-three:after { position: absolute; padding-top: 300%; margin-top: -120%; opacity: 0; transition: all 0.8s }
```

### [Scroll Snap + Parallax - CSS Only](https://codepen.io/Event_Horizon/pen/XWMyOEy)

made with: scroll-snap · 3D (perspective / preserve-3d)

```css
.snap-y { -ms-scroll-snap-type: y mandatory; scroll-snap-type: y mandatory }
.snap-y.prox { -ms-scroll-snap-type: y proximity; scroll-snap-type: y proximity }
.snap-x { -ms-scroll-snap-type: x mandatory; scroll-snap-type: x mandatory }
.snap-x.prox { -ms-scroll-snap-type: x proximity; scroll-snap-type: x proximity }
.snap-x > *, .snap-y > * { scroll-snap-align: start }
.relative { position: relative }
.container { perspective: 5px }
.parallax-parent { position: absolute; perspective: 10px }
.parallax-child { margin-bottom: 100vh; transform: translateZ(-10px) scale(2) }
section { transform: translateX(-5px) translateZ(-2.5px) scale(1.5) }
```

### [GSAP Parallax Demo](https://codepen.io/ooblek/pen/NWpOPBd)

on scroll: div.imageWrapper: transform+top ×2 | made with: GSAP · ScrollTrigger

```css
.imageWrapper { position:absolute }
.imageWrapper:nth-child(even) { bottom:-80% }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.from(e, {
scrollTrigger:{ trigger:e, }
gsap.from(e.getElementsByTagName('img')[0], {
gsap.to(e, {
scrollTrigger:{ trigger:e, scrub:true }
```

### [Parallax Vanilla JS](https://codepen.io/adrienloup/pen/zYZJaEg)

on scroll: h3.: transform+top ×2, h2.log1: transform+top, p.: transform+top, h2.log2: transform+top | made with: position: fixed · IntersectionObserver · scroll listener · requestAnimationFrame

```css
body::after { position: fixed; top: calc(50% - 1px) }
h3 { margin-bottom: 1rem; text-transform: uppercase }
main { padding-bottom: 5rem }
section { padding-top: 10rem }
```

```js
new IntersectionObserver(this.onIntersection)
addEventListener('scroll', this.onScroll, false)
requestAnimationFrame(() => { // Optimisation 2 : appel de la
```

### [Interactive Library](https://codepen.io/DarkCodez/pen/xxqJJwr)

on scroll: div.container: transform+top | made with: transition · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
body { perspective: 400px }
div.container { transition: all .5s }
div.bottom-content h1 { transform: translateX(10px) translateZ(60px) }
```

```js
addEventListener('mousemove',(e) => {
```

### [Self Parallax](https://codepen.io/DarkCodez/pen/WNpyJXM)

on scroll: div.box: transform+top, div.box1: transform+top, div.box2: transform+top | made with: scroll listener

```css
.box, .box1, .box2 { animation: animate 5s linear infinite alternate }
```

```js
addEventListener('scroll',() => {
```

### [Parallax Effect](https://codepen.io/osoriodev/pen/rNypyEz)

made with: 3D (perspective / preserve-3d)

```css
.wrapper { position: relative; perspective: 8px }
.image { position: absolute; top: 0 }
.image--background { transform: translateZ(0px) scale(1) }
.image--middle { transform: translateZ(5px) scale(0.375) }
.image--alice { transform: translateZ(2px) scale(0.75) }
```

### [Parallax Box](https://codepen.io/sonic_cat/pen/mdWqBMV)

held: fixed div.ytPlayerControlsContainerHost, fixed button.ytmA11yStylesHiddenButton | made with: position: fixed · custom properties driven by JS · GSAP · ScrollTrigger · requestAnimationFrame

```css
.wrapper { position: relative }
.wrapper::after { position: fixed; top: 0; opacity: 0.4 }
.firstTextBox { position: relative }
.secTextBox { position: relative }
.main-movie { position: relative; --top:0 }
iframe { position: absolute; top: 0; top: var(--top); transform: translate3d(0, var(--translateY), 0) }
```

```js
gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.create({
style.setProperty('--top', `${topPoint}px`)
style.setProperty('--translateY', `${this.translate_y.toFixed(3)}px`)
requestAnimationFrame(() => {
```

### [HTML canvas](https://codepen.io/DarkCodez/pen/qBrPZqW)

made with: 3D (perspective / preserve-3d) · canvas 2D · requestAnimationFrame

```css
body { perspective: 700px }
```

```js
requestAnimationFrame(animate)
```

### [Parallax Scroll svg image rellax.js](https://codepen.io/abhifoo/pen/xxqdbyG)

made with: position: fixed · scroll() timeline · @keyframes · transition · Web Animations API (.animate)

```css
#Group_4 { position: relative; margin-top: 10vh }
#Group_2 { position: absolute; top: 0px }
.Path_13 { position: absolute; top: 107.288px; transform: matrix(1, 0, 0, 1, 0, 0) }
.Path_14 { position: absolute; top: 0px; transform: matrix(1, 0, 0, 1, 0, 0) }
#Group_3 { position: absolute; top: 252.751px }
.Path_15 { position: absolute; top: 0px; transform: matrix(1, 0, 0, 1, 0, 0) }
.Path_16 { position: absolute; top: 0px; transform: matrix(1, 0, 0, 1, 0, 0) }
.Path_17 { position: absolute; top: 252.674px; transform: matrix(1, 0, 0, 1, 0, 0) }
.Path_18 { position: absolute; top: 252.669px; transform: matrix(1, 0, 0, 1, 0, 0) }
.Path_19 { position: absolute; top: 492.158px; transform: matrix(1, 0, 0, 1, 0, 0) }
.Path_20 { position: absolute; top: 492.411px; transform: matrix(1, 0, 0, 1, 0, 0) }
.Path_21 { position: absolute; top: 141.147px; transform: matrix(1, 0, 0, 1, 0, 0) }
```

```js
.animate({ scrollTop: $('#main_content').position().top }, 2000)
.animate({ scrollTop: $('.mainbg').position().top }, 2000)
```

### [The Traveler](https://codepen.io/Blindman67/pen/qBrrXdW)

made with: canvas 2D · requestAnimationFrame

```css
canvas { position: absolute; top: 0px; border-top: 1px solid white; border-bottom: 1px solid white }
.compressed { top: 34% }
#infoEl { position: absolute; bottom: 66% }
#infoEl2 { position: absolute; top: 66% }
```

```js
requestAnimationFrame(renderLoop)
```

### [Parallax Scroll](https://codepen.io/lanceF25/pen/ZEeWNKj)

held: fixed div.start, fixed div.bgSlow | on scroll: div.: transform+top, div.bgSlow: transform+top | made with: position: fixed · scroll() timeline

```css
.bgSlow { position: fixed; top: 0; background-position: center }
.start { position: fixed; top: 0 }
```

### [Mountains](https://codepen.io/wikyware-net/pen/xxqxWRQ)

made with: @keyframes · transition

```css
.ag-mountain { position: absolute; bottom: 0 }
.ag-mountain { -webkit-animation-name: an-mountain-move; -moz-animation-name: an-mountain-move; -o-animation-name: an-mountain-move; animation-name: an-mountain-move }
.ag-mountain { position: absolute; bottom: 0; -webkit-transform: translateX(-50%); -moz-transform: translateX(-50%); -ms-transform: translateX(-50%); -o-transform: translateX(-50%); transform: translateX(-50%); -webkit-transition: back }
.ag-mountain-2 { -webkit-animation-duration: 9s; -moz-animation-duration: 9s; -o-animation-duration: 9s; animation-duration: 9s }
.ag-mountain-3 { -webkit-animation-duration: 18s; -moz-animation-duration: 18s; -o-animation-duration: 18s; animation-duration: 18s }
.ag-mountain-4 { -webkit-animation-duration: 30s; -moz-animation-duration: 30s; -o-animation-duration: 30s; animation-duration: 30s }
.ag-mountain-5 { -webkit-animation-duration: 50s; -moz-animation-duration: 50s; -o-animation-duration: 50s; animation-duration: 50s }
@keyframes an-mountain-move animates background-position-x
```

### [Hello (HTML/CSS-only scroll-snap and parallax)](https://codepen.io/shannonmoeller/pen/MWpWJGB)

made with: scroll-snap · 3D (perspective / preserve-3d)

```css
body { scroll-snap-type: y mandatory; perspective: 1000px }
.room { position: relative; scroll-snap-align: center }
.room + .room { border-top: 0 }
.room::before, .room::after { position: absolute }
.room::before { transform: rotatex(-89.99999deg) scale(1.001); transform-origin: center top }
.room::after { bottom: 0; transform: rotateX(89.99999deg); transform-origin: center bottom }
.room-walls { position: absolute; inset: 0; transform: translatez(calc(var(--depth) * -1)) }
.room-walls::before, .room-walls::after { position: absolute }
.room-walls::before { transform: rotatey(89.99999deg) }
.room-walls::after { transform: rotatey(-89.99999deg) }
.room-content { transform: translatez(calc(var(--depth) / -2)) rotatey(var(--turn)) }
```

### [Vanilla JS tilt hover effect](https://codepen.io/suprithaa/pen/zYZYKpv)

on scroll: div.box: transform+shadow, div.contentBx: transform | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.container { position:relative }
.container .box { position:relative }
.container .box:hover { box-shadow:0 50px 80px rgba(0,0,0,0.2) }
.container .box .imgBx { position:absolute; top:0 }
.container .box .contentBx { position:absolute; top:50%; transform:translateZ(20px) scaleY(0); transform-origin:top; transition:0.5s }
.container .box:hover .contentBx { transform:translateZ(20px) scaleY(1) }
```

### [CSS Parallax](https://codepen.io/jbean96/pen/OJpLJPb)

made with: 3D (perspective / preserve-3d)

```css
:root { --perspective: 2px }
#window { perspective: var(--perspective) }
.parallax-container::after { background-position: center; transform: translateZ(var(--parallax-z-index)) scale(var(--scale-factor)) }
#image2::after { -moz-transform: none }
```

### ["Space Art" - jQuery Poster with Parallax Rotation INTERACTION](https://codepen.io/RaduBratan/pen/WNRVyqE)

on scroll: main.page: transform, div.center-text: transform | made with: @keyframes · transition · mix-blend-mode · 3D (perspective / preserve-3d)

```css
body::before { background-position: center; position: absolute; top: 0; mix-blend-mode: screen; opacity: 0.02 }
.page { transform: rotateZ(0); position: relative; box-shadow: -16px 32px 24px rgba(0, 0, 0, 0.2), 16px 32px 24px rgba(0, 0, 0, 0.2), -16px -32px 96px rgba(0, 0, 0, 0.2), 16px -32px 96px rgba(0, 0, 0, 0.2); transform: translateY }
.page.anim { animation: page-anim 1s cubic-bezier(0.645, 0.045, 0.355, 1) }
0% { transform: translateY(4rem) scale(0.8) }
50% { transform: translateY(0rem) scale(0.8) }
100% { transform: translateY(0rem) scale(1) }
.page .image { background-position: center; position: absolute; transform: rotateZ(10deg) translateX(-2.5vmin) translateZ(2rem) }
.page .title { position: absolute; transform: translateZ(0.5rem) rotate(180deg); text-transform: uppercase; opacity: 0.7; padding-top: 1rem }
.page .title span i { transition: transform 0.32s ease; transform: translateX(var(--x)) }
.page .bottom-left { position: absolute; transform: translate3d(-19vmin, 33vmin, 1rem) }
.page .bottom-right { position: absolute; transform: translate3d(19vmin, 33vmin, 1rem) }
.page .top-left { position: absolute; transform: translate3d(-19vmin, -33vmin, 1rem) }
```

### [Parallax Landing Page](https://codepen.io/nathanielredmon/pen/KKaLpqe)

on scroll: img.background: transform+top, img.mountain: transform+top, img.smoke1: transform+top, h1.: transform+top, img.person: transform+top, img.smoke2: transform+top | made with: position: fixed · @keyframes · transition · scroll listener

```css
.container1 { position: relative }
.container1 h1 { position: absolute; top: 30vh; transform: translate(-50%, -50%) }
.container1 img { position: absolute }
.smoke1 { opacity: 1 }
.smoke2 { opacity: 0.5 }
.body-1 div h1 { position: relative; margin-bottom: 15px }
.body-1 div h1::after { position: absolute; top: 0 }
.body-1 aside { position: relative }
.body-1 aside::after { position: absolute; top: -100% }
from { opacity: 0 }
%30 { opacity: 1 }
to { filter: blur(0px) }
```

```js
addEventListener("scroll", scrollHandle)
```

### [Parallax](https://codepen.io/codegem-io/pen/VwPgJYx)

made with: 3D (perspective / preserve-3d)

```css
.wrapper { perspective: 1px }
.section { position: relative }
.parallax::after { position: absolute; top: 0; bottom: 0; transform: translateZ(-1px) scale(2) }
```

### [Parallax Scrolling Website](https://codepen.io/kodplay/pen/xxgMXEO)

made with: :hover · scroll listener

```css
#header { position: absolute; top: 0 }
section { position: relative }
section::before { position: absolute; bottom: 0px }
section img { position: absolute; top: 0px }
section #text { position: absolute; transform: translateY(-50%) }
#btn { transform: translateY(100px) }
#btn:hover { box-shadow: 0 1px 15px rgba(1, 1, 1, 0.2) }
.sec { position: relative }
.sec h2 { margin-bottom: 10px }
```

```js
addEventListener('scroll', function(){
```

### [Parallax Z con ratón](https://codepen.io/Xaival/pen/KKabzQp)

on scroll: div.layer: transform+top ×3 | made with: nothing recognised — read the code

```css
.layer p { position: relative; box-shadow: 0 32px 40px -20px rgba(0, 0, 0, .25) }
.layer:nth-child(1) p { top: calc(50vh - 20px) }
.layer:nth-child(2) p { top: calc(50vh - 250px) }
.layer:nth-child(3) p { top: calc(50vh - 170px) }
.layer:nth-child(4) p { top: calc(50vh - 300px) }
.layer:nth-child(5) p { top: calc(50vh - 100px) }
```

### [Scrollable Image Background](https://codepen.io/hanibal/pen/GRrwLRr)

on scroll: div.: opacity+top | made with: scroll listener

```css
#header { position: relative; background-position: center }
section { padding-top: 3rem }
section h2 { margin-bottom: 10px }
```

```js
addEventListener("scroll", (r) => {
```

### [Simple Parallax With GSAP ScrollTrigger and CSS Scroll Snap](https://codepen.io/icodeayush/pen/LYxXxxv)

on scroll: div.: transform+top ×2 | made with: scroll-snap · GSAP · ScrollTrigger

```css
#wrapper { scroll-snap-type: y mandatory }
#wrapper h2 { position: absolute }
#wrapper #HomePage, #PageA, #PageB, #PageC { position: relative; scroll-snap-align: start }
#wrapper #ParallaxDiv { position: absolute; box-shadow: 0 0 50px black }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline({
```

### [Parallax With Parallax.js](https://codepen.io/icodeayush/pen/wvgQorw)

held: fixed div.parallax-mirror, fixed div.parallax-mirror, fixed div.parallax-mirror, fixed div.parallax-mirror, fixed div.parallax-mirror | made with: nothing recognised — read the code

```css
#div1 ,#div2 ,#div3 ,#div4 ,#div5 { box-shadow: 0px 0px 200px 20px rgba(238, 27, 185, 0.4); padding-top: 160px }
#div3 { padding-top: 320px }
#div5 { padding-top: 307px }
```

### [Position sticky scrolling - Parallax](https://codepen.io/iftikharrasha/pen/ExZdzYW)

held: sticky div.box-ip, sticky div.box-ip, sticky div.box-ip, sticky div.box-ip, sticky div.box-ip, sticky div.box-ip, sticky div.box-ip, sticky div.box-ip, sticky div.box-ip, sticky div.box-ip | made with: position: sticky

```css
.box-ip { position: sticky; top: 0; padding-top: 180px; margin-bottom: 270px }
.box-ip { margin-bottom: 450px }
.box-ip { margin-bottom: 400px }
.box-ip { margin-bottom: 400px }
```

### [CSS Only Dog Walk Puzzle Simple Game](https://codepen.io/takaneichinose/pen/LYxgvQW)

made with: @keyframes · transition · :hover

```css
.preloader { position: absolute; top: 100 }
.screen { position: relative }
.ground { position: absolute; bottom: 0vmin; transition: background-position 2000ms ease-out }
.fence { position: absolute; bottom: 16vmin; transition: background-position 2000ms ease-out }
.tree { position: absolute; bottom: 16vmin; transition: background-position 2000ms ease-out }
.mountain { position: absolute; bottom: 16vmin; transition: background-position 2000ms ease-out }
.dog { position: absolute; bottom: 16vmin; transition: none }
.left { position: absolute; bottom: 4vmin; transition: none }
.right { position: absolute; bottom: 4vmin; transition: none }
.bite { position: absolute; bottom: 4vmin; transition: none }
.stone { position: absolute; bottom: 16vmin; transition: left 2000ms ease-out, opacity 1500ms ease-out 500ms }
.bone { position: absolute; bottom: 16vmin; transition: left 2000ms ease-out, opacity 1500ms ease-out 500ms }
```

### [A parallax effect](https://codepen.io/adamfloresdesign/pen/qBRMaRX)

held: fixed section | on scroll: img.mount: transform+top, img.valley: transform+top, img.city: transform+top | made with: GSAP

```css
nav { position: absolute }
.container img { position: absolute }
.main-title { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.content { position: absolute }
```

### [Avengers: Infinity War — a CSS parallax experiment](https://codepen.io/aepicos/pen/KKaxdrE)

made with: 3D (perspective / preserve-3d)

```css
[data-parallax=container] { perspective: 300px }
[data-parallax=group] { position: relative }
[data-parallax=layer] { position: absolute; top: 0; bottom: 0 }
[data-parallax=none] { position: relative; transform: translateZ(0) }
[data-parallax-speed=front] { transform: translateZ(90px) scale(0.7) }
[data-parallax-speed=base] { transform: translateZ(0) }
[data-parallax-speed=slow] { transform: translateZ(-300px) scale(2) }
[data-parallax-speed=slower] { transform: translateZ(-600px) scale(3) }
[data-parallax-speed=slowest] { transform: translateZ(-900px) scale(4) }
[data-image=captain-america], [data-image=scarlet-witch], [data-image=black-wido { background-position: top center }
[data-image=captain-america] { background-position: 30% 0% }
[data-image=iron-man] { background-position: 80% 0% }
```

### [SVG Parallax Website With Pure CSS Apple IOS Type Hover Animation](https://codepen.io/icodeayush/pen/KKaBxyd)

held: fixed div.parallax-mirror, fixed div.parallax-mirror, fixed div.parallax-mirror, fixed div, fixed a | made with: position: fixed · transition · :hover · backdrop-filter

```css
#LeftPanel { position: fixed; transition: 0.4s ease-in-out }
#LeftPanel #CodeBy { position: fixed; bottom: 3.1vh }
#Wrap { position: relative }
#Wrap section { position: relative }
#Wrap section #ParagraphWrap { position: absolute; -webkit-backdrop-filter: blur(13px); backdrop-filter: blur(13px); box-shadow: 0 0 7vw rgba(0, 0, 0, 0.5); transition: 0.4s 0.22s ease-in-out }
#Wrap section #ParagraphWrap p { position: absolute; top: 25%; transition: 0.31s ease-in-out }
#Wrap section #ParagraphWrap:hover p { position: absolute; top: 1vw }
#ParagraphWrap #ArticleWrap { position: absolute; bottom: -100vh; box-shadow: 0 0.7vh 2.2vw rgba(0, 0, 0, 0.5); transition: 0.7s ease-in-out }
#Wrap section #ParagraphWrap:hover #ArticleWrap { bottom: 2.2vw }
#Wrap section .PageA { background-position: center }
#Wrap section .PageB { background-position: center }
#Wrap section .PageC { background-position: center }
```

### [Parallax Scrolling Website | Patagonia - Landing page concept](https://codepen.io/alessiomarcone/pen/GRrByvz)

made with: transition · :hover · scroll listener

```css
body { filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#39519f",endColorstr="#eef2ff",GradientType=1) }
header { position: absolute; top: 0 }
header .logo { text-transform: uppercase }
header ul a { transition: all 0.152s cubic-bezier(0.65, 0.05, 0.36, 1) }
.hero { position: relative }
.hero img { position: absolute; top: 0 }
.hero #text { position: absolute; opacity: 0.8; transform: translateY(-40px) }
.content { position: relative; background-position: center center }
.content::before { position: absolute; top: 0; bottom: 0; opacity: 0.85 }
.product { position: relative }
.product .heading { margin-bottom: 0.5rem }
.product p { padding-bottom: 2rem }
```

```js
addEventListener('scroll', function(){
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

### [Parallax effect with CSS translate3d](https://codepen.io/ifthenelse/pen/vYgxOzZ)

held: fixed div.container | on scroll: div.square: transform+top ×5 | made with: position: fixed · 3D (perspective / preserve-3d) · scroll listener

```css
body { position: relative }
.container { position: fixed; top: 0; bottom: 0; box-shadow: 0 10px 10px rgba(0, 0, 0, 0.35); perspective: 100px }
.container .square { position: absolute; transition-property: transform, visibility, opacity; transform: translate3d(0, 0, 0); opacity: 0 }
.container .square-1 { top: 5px }
.container .square-2 { top: 105px }
.container .square-3 { top: 440px }
.container .square-4 { top: 490px }
.container .square-5 { top: 350px }
```

```js
addEventListener('scroll', evt => {
```

### [Parallax VG](https://codepen.io/rsarayb/pen/poREqqq)

on hover of li.: a.: color | made with: :hover

```css
.nav-consolas { position:absolute }
.header { background-position: center }
.parallax-header1 { background-position: center }
.consola1 h3, .consola2 h3, .consola3 h3 { border-bottom: 2px solid black }
.consola1 p, .consola2 p, .consola3 p { margin-top: 10px }
.parallax-header2 { background-position: center }
.parallax-header3 { background-position: center }
```

### [Monochromatic Parallax Dream Landscape](https://codepen.io/lukw4l/pen/NWdqmXq)

held: fixed div, fixed div | on scroll: div.: transform, div.layer: opacity+top | on hover of img.: div.: transform | made with: position: fixed · @keyframes · 3D (perspective / preserve-3d)

```css
#layerSun { position: fixed; top: 50px }
#layerClouds { position: fixed; top: 50px; animation: moveClouds 20s infinite }
0% { transform: translateX(-1800px) }
100% { transform: translateX(2000px) }
#overlay { opacity: 0 }
#container { perspective: 100px; position: absolute; top: 0; bottom: 0 }
.layer { position: absolute; bottom: 0 }
.layer img { position: absolute; bottom: 0 }
#layer0 { transform: translateZ(-300px) scale(7) }
#layer1 { transform: translateZ(-250px) scale(5) }
#layer2 { transform: translateZ(-200px) scale(5) }
#layer3 { transform: translateZ(-150px) scale(3) }
```

### [Parallax Hover Gallery with tilt.js](https://codepen.io/cs13/pen/jOyPGNw)

on hover of div.gallery-card: div.gallery-card: transform, div.js-tilt-glare-inner: transform+opacity+top | made with: 3D (perspective / preserve-3d)

```css
.main h1 { margin-bottom: 40px }
.main .parallax-gallery .gallery-card { position: relative; transform: perspective(300px); box-shadow: -10px 20px 86px 0 rgba(92, 15, 15, 0.36) }
.main .parallax-gallery .gallery-card-name { position: absolute; top: 0; transform: translateZ(60px) scale(0.75) }
.main .parallax-gallery .gallery-card-name span { margin-bottom: 5px }
.main .parallax-gallery .gallery-card-info { position: absolute; top: 0; transform: translateZ(30px) scale(0.8) }
```

### [parallax javascript](https://codepen.io/masudrana2779/pen/ExZxzRj)

made with: scroll listener

```css
.main-section p { margin-bottom: 30px }
```

```js
addEventListener("scroll", (e) => {
```

### [Only css parallax](https://codepen.io/masudrana2779/pen/KKaKLNx)

made with: 3D (perspective / preserve-3d)

```css
div.parallax { position: relative }
div.parallax:after { background-position: center; position: absolute; top: -40px; bottom: 0px; transform: translateZ(-1px) scale(2); -webkit-transform: translateZ(-1px) scale(2) }
div.content { perspective: 2px; -webkit-perspective: 2px }
body { perspective: 1px; -webkit-perspective: 1px }
```

### [Parallax Landing Page](https://codepen.io/solygambas/pen/ExZxxRo)

on scroll: div.rellax: transform+top ×3, div.content: transform+top ×2 | on hover of a.btn: a.btn: transform | made with: :hover

```css
h1, h2, h3, p { margin-bottom: 0.625rem }
.btn { text-transform: uppercase; margin-top: 10px }
.btn:hover { transform: scale(0.98) }
.section { position: relative }
.section-top { padding-top: 20px }
.section-top .content, .section-stream .play, .section-stream .content { position: static }
.section-stream { margin-top: -1px }
.section-stream .play { opacity: 0.5 }
.section-stream .content > div, .section-grid > div { margin-bottom: 20px }
.section-grid { margin-top: 0 }
.footer { border-top: var(--text-color) 1px solid; margin-top: 20px }
.section-top { padding-top: 0 }
```

### [Easy Parallax w/ GSAP](https://codepen.io/creativeocean/pen/dyOxxGb)

held: fixed svg.[object | on scroll: div.thumbImg: transform+top ×6, svg.[object: opacity, polyline.[object: opacity | made with: position: fixed · GSAP · ScrollTrigger

```css
.dir { position:fixed; top:100%; transform:translate(-50%, -200%) }
h1 { margin-bottom: 0.8em }
p { margin-bottom: 1.3em }
.thumb { margin-top:2% }
.thumbImg { position: relative }
```

```js
ScrollTrigger.create({
gsap.to('.thumbImg', {
gsap.timeline({repeat:-1})
gsap.timeline({scrollTrigger:{trigger:'.section', start:'50px top', end:'150px top', scrub:0.5}})
```

### [Simple Parallax](https://codepen.io/brookesb91/pen/RwoOMZo)

made with: scroll listener

```css
.image-container { background-position: top }
.content { padding-top: 3rem; box-shadow: 0 -4px 12px 16px rgba(0, 0, 0, 0.1) }
```

```js
addEventListener("scroll", () => {
```

### [Horizontal parallax scrolling demo](https://codepen.io/mehistaken/pen/OJbdBex)

on scroll: div.box: transform+opacity ×31, div.box: transform ×5 | on hover of img.: div.box: transform+opacity ×27, div.box: transform ×9 | made with: @keyframes · transition

```css
.viewport { opacity: 1; transition: opacity 0.4s ease-out }
.viewport.hidden { opacity: 0 }
.row { margin-bottom: 8px; transition: transform 0.4s ease-out }
.row .box { -webkit-animation: zoomInOut forwards 3.2s linear infinite; animation: zoomInOut forwards 3.2s linear infinite }
.row .box:nth-child(2) { -webkit-animation-delay: 0.5s; animation-delay: 0.5s }
.row .box:nth-child(3) { -webkit-animation-delay: 1s; animation-delay: 1s }
.row .box:nth-child(4) { -webkit-animation-delay: 1.5s; animation-delay: 1.5s }
.row .box:nth-child(5) { -webkit-animation-delay: 2s; animation-delay: 2s }
.row .box:nth-child(6) { -webkit-animation-delay: 2.5s; animation-delay: 2.5s }
.row:nth-child(2) .box { -webkit-animation-duration: 2s; animation-duration: 2s }
.row:nth-child(2) .box:nth-child(2) { -webkit-animation-delay: 0.2s; animation-delay: 0.2s }
.row:nth-child(2) .box:nth-child(2) { -webkit-animation-delay: 0.7s; animation-delay: 0.7s }
```

### [Firewatch Parallax in CSS (Scroll-Linked Animations / @scroll-timeline)](https://codepen.io/bramus/pen/WNoPXKW)

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

### [Parallax Effect w/tilt.js  HTML - SCSS - JavaScript ](https://codepen.io/poqq/pen/gOLqwOq)

on scroll: div.card: transform ×3 | on hover of div.card: div.card: transform, div.js-tilt-glare-inner: transform+opacity+top | made with: transition · 3D (perspective / preserve-3d)

### [Untitled](https://codepen.io/soulfreebek/pen/XWNYOpR)

held: fixed canvas. | made with: position: fixed · canvas 2D · scroll listener · pointer / mouse tracking · requestAnimationFrame

```css
.bg-canvas { position: fixed; top: 0 }
```

```js
addEventListener("scroll",m),c.addEventListener("touchmove",m)),a.x=k,a.y=l):"pointer
addEventListener("mousemove",q),c.addEventListener("touchmove",q)),h||(e=a.canvas.offset
```

### [Parallax background with SVG](https://codepen.io/solygambas/pen/vYyjjbz)

on scroll: g.[object: transform+top ×10, path.[object: transform+top ×3, rect.[object: transform+top | made with: @keyframes

```css
section { margin-top: 8rem }
svg { position: absolute; bottom: 0 }
#Clouds { animation: cloud-anim 15s alternate-reverse infinite linear }
from { transform: translateX(0) }
to { transform: translateX(-100px) }
@keyframes cloud-anim animates transform
```

### [Parallax image scroll](https://codepen.io/wouterXD/pen/abBYdbp)

on scroll: img.: transform+top ×4 | on hover of img.: img.: transform+top | made with: scroll() timeline · GSAP

```css
.imgGrid .text h2 { margin-bottom: 1rem }
.img { position: relative }
.img img { transform: translateY(var(--y)) }
```

```js
gsap.to(img.childNodes[1], {
```

### [Parallax in Vanilla JS](https://codepen.io/dabbu_440/pen/RwojgJE)

on scroll: div.parallax-content: transform+top | made with: nothing recognised — read the code

```css
.main-content { position: relative; top: 80vh }
.parallax-content { position: relative; top: 80vh }
```

### [Parallax scroll website template](https://codepen.io/shane-clarke/pen/vYyxGJq)

made with: nothing recognised — read the code

```css
.paraImage { position: relative; background-position: center }
.paraImage1 { position: relative; background-position: center }
.paraImage2 { position: relative; background-position: center }
.paraImage3 { position: relative; background-position: center }
.paraImage4 { position: relative; background-position: center }
h1 { position: absolute; top: 45vh; transform: translatex(-50%); bottom: 100vh }
a.website { margin-top: 7440px }
```

### [CSS only Parallax Scrolling](https://codepen.io/BlogFire/pen/bGBgzXr)

made with: 3D (perspective / preserve-3d)

```css
div.parallax { position: relative }
div.parallax:after { background-position: center; position: absolute; top: -40px; bottom: 0px; transform: translateZ(-1px) scale(2) }
div.content { perspective: 2px }
body { perspective: 1px; -webkit-perspective: 1px }
```

### [GSAP Header/Footer Parallax Effect](https://codepen.io/pixelbakery/pen/oNYBYLV)

held: fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start, fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start, sticky header | on scroll: section.header-container: transform+top | made with: position: sticky · GSAP

```css
header { position: sticky; top: 0px }
section.header-container .scroll-down { position: absolute; bottom: 30px; transform: translate(-50%, 0); text-transform: uppercase }
section.header-container .scroll-down .arrow { position: relative }
```

```js
gsap.timeline({ paused:true })
gsap.to('section.footer-container', {
scrollTrigger: { trigger: '.content', start: 'bottom bottom', end: '+=66%', markers: true, scrub: true, }
gsap.to('section.header-container', {
scrollTrigger: { trigger: '.content', start: 'top bottom', end: '=66%', markers: true, scrub: true, }
```

### [Parallax](https://codepen.io/gyros/pen/bGBBjNv)

on scroll: g.[object: transform+top ×6, path.[object: transform+top ×2, g.[object: opacity+top | made with: @keyframes · clip-path

```css
h3 { margin-top: 8em }
svg { position: absolute; bottom: 0 }
.Cloud_right { animation: cloud-anim 70s alternate-reverse infinite linear }
.Cloud_left { animation: cloud-anim 60s alternate-reverse infinite linear }
from { transform: translateX(0) }
from { transform: translateX(-30em) }
.blink { animation: blink-anim 2s alternate-reverse infinite }
0% { opacity: 1 }
25% { opacity: 0.75 }
50% { opacity: 0.5 }
75% { opacity: 0.75 }
100% { opacity: 1 }
```

### [CSS Sticky Parallax Sections (Scroll-Linked Animations / CSS @scroll-timeline)](https://codepen.io/bramus/pen/GRNNjqz)

held: sticky figure.image-container, sticky figure.image-container, sticky figure.image-container, fixed div.warning, fixed details.infobox, fixed dialog, fixed dialog.sda_update | made with: position: sticky · position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · :hover · <dialog>

```css
from { transform: translateY(0) }
to { transform: translateY(-50vh) }
.image-container { animation: 1s slide-up linear forwards }
scroll-timeline section-1-in-between-scrollport { scroll-offsets: selector(#section-1) start 1, selector(#section-1) end 1 }
#image-container-1 { animation-timeline: section-1-in-between-scrollport }
scroll-timeline section-2-in-between-scrollport { scroll-offsets: selector(#section-2) start 1, selector(#section-2) end 1 }
#image-container-2 { animation-timeline: section-2-in-between-scrollport }
scroll-timeline section-3-in-between-scrollport { scroll-offsets: selector(#section-3) start 1, selector(#section-3) end 1 }
#image-container-3 { animation-timeline: section-3-in-between-scrollport }
.warning { position: fixed; top: 1em }
.page-title::after { opacity: 0; transform: translateY(-24px); animation: fadein 800ms 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards }
.content { position: relative }
```

### [Parallax scrolling - fixed](https://codepen.io/jackdomleo7/pen/PobZayX)

made with: backdrop-filter

### [Travel Deal Card Hover Rotation Effect](https://codepen.io/peteyio/pen/bGBGvvK)

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

### [Simple Parallax effect using JavaScript](https://codepen.io/mperetto/pen/yLVLpBB)

made with: scroll listener

```js
addEventListener("scroll", (e) => {
```

### [Easy CSS Parallax with Lazy Loaded Background Images](https://codepen.io/mark_sottek/pen/oNYvVEB)

on scroll: div.parallax: opacity+top | made with: transition

```css
.lazyload, .lazyloading { opacity: 0 }
.lazyloaded { opacity: 1; transition: opacity 300ms }
h1 { text-transform:uppercase }
```

### [bootstrap parallax with modal](https://codepen.io/blhi-jed/pen/MWjdKjG)

held: fixed div.modal | made with: nothing recognised — read the code

```css
.container { position: relative }
.container section { position: relative }
.container section .image { position: absolute; opacity: 0.4 }
.container section .stuff { position: relative }
```

### [UIkit Parallax Bug Since 3.5.10](https://codepen.io/Lampenbauer/pen/LYRoVey)

made with: nothing recognised — read the code

### [Card hover effect](https://codepen.io/A_kamel/pen/mdrgmYa)

on scroll: div.relative: transform, div.absolute: transform, div.w-full: opacity | made with: transition · 3D (perspective / preserve-3d)

### [Parallax Card to Video Background Transition](https://codepen.io/kellyannmcnamara/pen/xxEBdYX)

held: fixed video, fixed video.card__video-background, fixed video, fixed video.card__video-background, fixed video, fixed video.card__video-background, fixed video, fixed video.card__video-background, fixed video, fixed video.card__video-background | made with: position: fixed · transition · clip-path

```css
.card { box-shadow: inset 0 0 0 1px #fff; position: relative; transition: 1s ease all; margin-bottom: 24px }
.card .card__video-clip { clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%) }
.card.is-showing { box-shadow: inset 0 0 0 0 #fff }
.card.is-showing .card__video-background { opacity: 1 }
.card.is-hiding .card__video { opacity: 0 }
.card__video { position: absolute; top: 0; transition: 1s ease all }
.card__video video { position: fixed; top: 50%; transform: translate(-50%, -50%); transition: 0.25s ease all }
.card__copy { position: relative; text-transform: capitalize; transition: 0.5s ease all }
.card__video-background { position: fixed; top: 50%; transform: translate(-50%, -50%); opacity: 0; transition: 0.75s ease all }
```

### [Pure CSS Parallax](https://codepen.io/jsyme222/pen/zYKJmJV)

made with: transition · 3D (perspective / preserve-3d)

```css
.parallax { perspective: 1px }
.parallax__layer { position: absolute; top: 0; bottom: 0 }
.parallax__layer--back { transform: translateZ(-10px) scale(2) }
.parallax__layer--base { transform: translateZ(0) }
.parallax__layer--base.first .title { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.parallax__layer--back { transform: translateZ(-2px) scale(3) }
.parallax__group { transition: 0.5s; position: relative }
```

### [Parallax Card](https://codepen.io/WesleyJH/pen/vYXzLNb)

made with: transition · :hover · scroll listener

```css
#forestBackground { background-position: center }
.forestCard { transition: .3s }
.forestCard button { margin-top: 20px }
```

```js
addEventListener("scroll", function(){
```

### [Advanced Parallax Design](https://codepen.io/paulmaudrydev/pen/vYXRdqb)

on scroll: h2.text-color: transform+top ×4, div.parallax1_wrapper: transform+top | made with: scroll() timeline · @keyframes · transition · :hover · requestAnimationFrame

```css
.bg-1 { transform: scale(1.05) }
.bg-2 { transform: scale(1.1) }
.bg-1,.bg-2 { background-position: 50% 25%; position: absolute; top: 0; bottom: 0; transition: 0.8s }
.part-1 { position: relative; margin-bottom: 100px }
.part-1 h1 { text-transform: uppercase }
.part-1 h3 { text-transform: uppercase }
.play-button { position: relative; transition: 0.4s }
.play-wrapper { transition: 0.8s }
.play-wrapper:hover { transform: scale(0.9) }
.play-button svg { transition: 0.4s; position: absolute; top: 0; bottom: 0 }
.part-2 { position: relative; padding-bottom: 100px }
.part-2-text-wrapper { margin-top: 60px }
```

```js
requestAnimationFrame(function() {
```

### [Frosted Glass Card](https://codepen.io/OlgaKoplik/pen/zYKWowN)

on hover of div.card: div.circle: transform+top ×2, div.card: transform+top | made with: transition · :hover · backdrop-filter · pointer / mouse tracking

```css
body { padding-top: 40px }
body .canvas { position: relative; margin-top: 40px }
body .canvas .circle { position: absolute }
body .canvas .circle:first-child { top: -10% }
body .canvas .circle:last-child { bottom: -20% }
body .canvas .card { position: relative; box-shadow: 0 0 20px 0 rgba(5, 16, 59, 0.3); -webkit-backdrop-filter: blur(7px); backdrop-filter: blur(7px) }
body .canvas .card .text.name { text-transform: uppercase }
.fa-instagram { position: absolute; top: 3%; transition: all 0.1s }
```

```js
addEventListener("mousemove", (e) => {
```

### [Funky Green Bubble Nightmare](https://codepen.io/JeanneB0/pen/bGwaOOJ)

made with: 3D (perspective / preserve-3d)

```css
body { perspective: 1px }
.container :nth-child(1) { transform: translateZ(-0.4px) scale(1.4); top: 200px }
.container :nth-child(2) { transform: translateZ(0.2px) scale(0.8); top: 200px }
.container :nth-child(3) { transform: translateZ(0.3px) scale(0.7); top: 400px }
.container :nth-child(4) { transform: translateZ(0.1px) scale(0.9); top: 500px }
.container :nth-child(5) { transform: translateZ(-2px) scale(3); top: 2000px }
.container :nth-child(6) { transform: translateZ(0.4px) scale(0.6); top: 600px }
.container :nth-child(7) { transform: translateZ(-1px) scale(2); top: 400px }
.container :nth-child(8) { transform: translateZ(-0.4px) scale(1.4); top: 100px }
.container :nth-child(9) { transform: translateZ(0.4px) scale(0.6); top: 900px }
.container :nth-child(10) { transform: translateZ(-1px) scale(2); top: 1600px }
.container > * { position: absolute }
```

### [Parallax Golden Hour Animation on Scroll (using GSAP & ScrollTrigger)](https://codepen.io/AbubakerSaeed/pen/rNMpLJb)

held: fixed div, fixed div.info | on scroll: g.[object: transform ×45, div.tree: background ×14, div.mountain: background ×13, g.[object: transform+top ×11, div.mountains: transform ×3, div.clouds: transform ×2 | on hover of a.: g.[object: transform ×69, g.[object: transform+top ×43, div.tree: background ×14, div.mountain: background ×13, div.mountains: transform ×3, div.clouds: transform ×2 | made with: position: fixed · clip-path · GSAP · ScrollTrigger

```css
#scene { position: fixed }
.top { background-position: 0 100%; position: relative }
.stars { opacity: 0 }
.stars__svg { position: absolute; top: 0 }
.clouds-container { position: absolute; top: 0 }
.clouds { position: inherit }
.cloud { position: absolute }
.sun-and-moon { transform: translateY(-400px) }
.moon { box-shadow: 0 0 20px 2px hsl(0, 0%, 100%), 0 0 90px 40px hsla(0, 0%, 100%, .4) }
.sun { margin-top: 320px; box-shadow: 0 0 20px 2px hsl(39, 100%, 80%), 0 0 90px 40px hsla(39, 100%, 90%, .4) }
.bottom { position: relative }
.mountains { position: relative }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline()
ScrollTrigger.create({
gsap.fromTo(
```

### [Parallax Mousemove -> HTML & CSS & JS](https://codepen.io/DivineBlow/pen/yLapeem)

on scroll: img.layer: transform+top ×12, h2.layer: transform+top | on hover of img.layer: img.layer: transform+top ×12, h2.layer: transform+top | made with: pointer / mouse tracking

```css
section { position: relative }
section h2 { position: relative }
section img { position: absolute }
section .comet { top: 5% }
section .oneP { top: 15% }
section .twoP { top: 65% }
section .threeP { bottom: 5% }
section .fourP { bottom: 20% }
section .fiveP { top: 15% }
section .sixP { bottom: 40% }
section .sevenP { bottom: 7% }
section .eightP { top: 40% }
```

```js
addEventListener("mousemove", parallax)
```

### [Magnetic button animation](https://codepen.io/milanraring/pen/gOwGpdm)

held: fixed div.cursor, fixed div.socials | on hover of button.button: button.button: transform+top, span.: transform, div.cursor: transform+background+top | made with: position: fixed · transition · :hover · mix-blend-mode · pointer / mouse tracking

```css
.button { position: relative; box-shadow: 0 10px 30px rgba(65, 72, 86, 0.1); transition: transform 0.1s linear, color 0.1s linear, background 0.15s linear }
.button > span { position: relative; transition: transform 0.15s linear }
.cursor { position: fixed; top: -50px; transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease }
[cursor=link]:hover ~ .cursor { mix-blend-mode: difference; transform: scale(1.5) }
body .socials { position: fixed; bottom: 20px }
body .socials > a { opacity: 0.2; transform: scale(var(--scale, 0.8)); transition: transform 0.3s cubic-bezier(0.38, -0.12, 0.24, 1.91) }
body .socials > a:hover { --scale: 1 }
```

```js
addEventListener('mousemove', function(e) {
addEventListener('mouseleave', function() {
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

### [parallax testing](https://codepen.io/jibhey/pen/wvzdadx)

on scroll: img.page-content__section-icon: transform+top, div.page-content__section-scroll: opacity+top | made with: scroll listener

```js
addEventListener('scroll', (event) => {
```

### [Scroll Pop (Transform based on scroll percent)](https://codepen.io/ceruulean/pen/NWRpNbo)

on scroll: div.dynamic: transform+background+top ×2 | made with: position: fixed · IntersectionObserver · scroll listener

```css
.multiple-wrapper { position:relative }
.scrollpop { position:relative }
.scrollpop .fixed { position:fixed }
.dynamic { position:absolute; top:0 }
.info { position:relative }
.filler1 { position:relative }
```

```js
new IntersectionObserver(callback, options)
addEventListener('scroll', this.handler)
```

### [Card Content & Title JS Parallax](https://codepen.io/nizarmah/pen/OJRWozO)

held: fixed div.shadow-background, fixed div.shadow-list, fixed div.shadow-list, fixed div.shadow-list, fixed div.shadow-list, fixed div.shadow-list, fixed div.shadow-list, fixed div.shadow-list, fixed div.shadow-list, fixed div.shadow-list | on scroll: div.title: transform+top ×28 | made with: position: fixed · scroll listener

```css
.card { position: relative }
.title { position: absolute; top: -60px; box-shadow: 0px 0px 12px rgba(22, 22, 24, 0.24); will-change: transform; transform: translateY(0px) }
.content { box-shadow: 0px 0px 6px rgba(22, 22, 24, 0.06); position: absolute }
.card-list { position: relative; top: 0px }
.shadow-background { opacity: 0.2; position: fixed; top: 0px }
.shadow-list { position: fixed; top: -80px; transform: translateX(-80px) }
.shadow-list .card { box-shadow: 0px 0px 48px 48px rgba(22, 22, 24, 0.08) }
```

```js
addEventListener("scroll", manageScrolling)
```

### [Custom Cursor](https://codepen.io/siamak/pen/ExgZRVy)

held: fixed div.socials | on scroll: i.cursor: transform+top, a.gallery--item: color+top, img.gallery--img: color+top | on hover of a.: i.cursor: transform+top, a.: color, a.gallery--item: color, img.gallery--img: color | made with: position: fixed · transition · :hover · mix-blend-mode · pointer / mouse tracking

```css
.cursor { position: absolute; top: 0; mix-blend-mode: difference; opacity: 0 }
h1 { margin-bottom: 0; text-transform: uppercase }
p { margin-bottom: 3vh }
.gallery--img { transition: 0.4s ease-in-out 0.1s; box-shadow: 0 0px 12px rgba(0, 0, 0, 0) }
.gallery--img:hover { transform: translateY(-4px); box-shadow: 0 2px 48px -2px rgba(0, 0, 0, 0.3) }
.socials { position: fixed; bottom: 8px }
```

```js
addEventListener("mousemove", move)
```

### [CSS Parallax Masthead](https://codepen.io/edmeehan/pen/dypNRab)

made with: 3D (perspective / preserve-3d)

```css
.parallax { perspective: 1px }
.parallax__layer { position: absolute; top: 0; bottom: 0 }
.parallax__group { position: relative }
.page { position: relative; padding-bottom: 100vh }
.masthead .layer1 { transform: translate3d(0, -16vh, -1px) scale(2) }
.masthead .layer2 { transform: translate3d(0, 3vh, -0.45px) scale(1.45) }
.masthead .layer3 { transform: translate3d(0, 16vh, 0) }
```

### [Parallax space](https://codepen.io/wikyware-net/pen/VwKmMqg)

on scroll: div.meteor__item: transform+top ×10 | made with: scroll() timeline · @keyframes · transition

```css
.ag-primary-block { position: relative }
.ag-primary_parallax__phone, .ag-primary_parallax__spaceman { position: absolute; top: 0; bottom: 0; -webkit-transition: background 0.3s linear; -moz-transition: background 0.3s linear; -o-transition: background 0.3s linear; transition: background 0.3s linear }
.ag-meteor-block { top: 0 }
.ag-meteor-block, .meteor__item { position: absolute }
.meteor__item-img { -webkit-animation: an-frame-animation 3s steps(48) infinite; -moz-animation: an-frame-animation 3s steps(48) infinite; -o-animation: an-frame-animation 3s steps(48) infinite; animation: an-frame-animation 3s steps(48) in }
0% { background-position: 0 0 }
100% { background-position: -28800px 0 }
0% { background-position: 0 0 }
100% { background-position: -28800px 0 }
0% { background-position: 0 0 }
100% { background-position: -28800px 0 }
0% { background-position: 0 0 }
```

### [CSS Sticky Parallax Sections](https://codepen.io/hexagoncircle/pen/JjRYaZw)

held: sticky figure.image-container, sticky figure.image-container, sticky figure.image-container | made with: position: sticky · @keyframes · :hover · prefers-reduced-motion

```css
:root { --scale: 0.1 }
:root { --scale: 0 }
.page-title::after { opacity: 0; transform: translateY(-24px); -webkit-animation: fadein 800ms 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; animation: fadein 800ms 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards }
.section { transform-origin: center top; transform: scaleY(calc(1 - var(--scale))) }
.section > * { transform-origin: center top; transform: scaleY(calc(1 / (1 - var(--scale)))) }
.content { position: relative }
.content > * + * { margin-top: 2rem }
.image-container { position: sticky; top: 0 }
.image-container img { position: absolute; top: 0 }
.image-container::after { position: absolute; bottom: 0 }
to { opacity: 1; transform: translateY(0) }
to { opacity: 1; transform: translateY(0) }
```

### [Parallax Scrolling Effect (Basic)](https://codepen.io/vedpanse/pen/ExgVmpj)

made with: nothing recognised — read the code

```css
.parallax { background-position: center }
.parallax2 { background-position: center }
```

### [Free Code Camp: Tribute Page Challenge](https://codepen.io/veritygriscti/pen/xxEGMEb)

held: fixed div.lightbox-overlay, fixed div.lightbox-overlay, fixed div.lightbox-overlay, fixed div.lightbox-overlay, fixed div.lightbox-overlay, fixed div.lightbox-overlay | made with: position: fixed · transition · :hover

```css
.thumbnail { margin-bottom: 2%; position: relative }
img.thumbnail-image { object-position: top center }
.lightbox-overlay { transform: scale(0,1); transition: transform 400ms ease-out; position: fixed; top: 0 }
.lightbox-overlay:target { transform: scale(1,1) }
.lightbox-image-title { position: relative }
.close { position: absolute; top: 5px }
.back, .next { text-transform: uppercase }
.back:hover, .next:hover { transition: background-color 550ms ease-in }
#extended-footer { padding-top: 10px }
header { background-position: center center }
#extended-footer { background-position: center center }
.article { margin-bottom: 3vh }
```

### [Simple Parallax](https://codepen.io/rosemaryly/pen/wvzwNZa)

made with: nothing recognised — read the code

```css
.parallax { background-position: center }
```

### [Happy Thanksgiving!](https://codepen.io/jackiezen/pen/VwjREdm)

on scroll: h1.: transform, h2.h2-animation: transform, circle.[object: transform, div.ray-animation: transform, div.: transform, g.[object: transform | on hover of button.meta: h1.: transform+top | made with: @keyframes · transition · :hover

```css
*:before, *:after { position: absolute }
#container { position: relative; margin-top: -6% }
#container > div { position: absolute }
#turkey-container { position: absolute; margin-bottom: 35%; bottom: 0 }
#sun-container { position: relative; margin-bottom: 35%; bottom: 0; opacity: 0 }
.sun-animation { animation: fade, shift; animation-duration: calc(var(--text-timing) * 4); animation-fill-mode: forwards; animation-delay: calc(var(--text-timing) * 3) }
#rays-container { position: absolute; top: 0; opacity: 0 }
.ray-animation { animation: fade calc(var(--text-timing) * 3) forwards 1s }
.stroke-animation { animation: svgFill 1.25s ease-out forwards }
.ray-stroke-animation { animation: svgFill ease-out infinite alternate 1s }
#rays .ray:nth-of-type(odd) { animation-delay: 1.25s }
#rays .ray:first-of-type { animation-duration: 1.8s }
```

### [Vanilla Parallax](https://codepen.io/BurmesePotato/pen/OJXqEqv)

made with: nothing recognised — read the code

```css
.textWrapper__title { text-transform: capitalize }
.imgWrapper { background-position: center; position: relative; padding-top: calc(100% / 21 * 9) }
```

### [jcink rp shipper app w/parallax](https://codepen.io/summercodes/pen/oNLmZag)

made with: 3D (perspective / preserve-3d)

```css
.appcon { perspective: 4px }
.appcon .apphead { position: relative }
.appcon .apphead::before { position: absolute; top: 0px; bottom: 0px; transform: translateZ(-4px) scale(2) }
.appcon .apphead .appname { position: absolute; transform: translateZ(-2px) scale(1.5); bottom: -45px }
.appconts { position: relative }
.appconts .appdg .adgset top { border-bottom: 2px solid var(--blue); text-transform: uppercase }
.appconts .appdg .adgset bot { text-transform: uppercase }
h4 { border-bottom: 3px solid var(--blue) }
.appconts hl { text-transform: uppercase }
.appconts a { text-transform: uppercase }
```

### [Responsive Parallax Mousemove Effect](https://codepen.io/raghucse2010/pen/bGeQgeE)

on scroll: img.object: transform+top ×9, h2.object: transform+top | on hover of img.object: img.object: transform ×9, h2.object: transform | made with: pointer / mouse tracking

```css
.container { position: relative }
.container img { position: absolute; top:0 }
.container h2 { position: relative; text-transform: uppercase }
```

```js
addEventListener("mousemove", parallax)
```

### [Parallax Scrolling](https://codepen.io/luka712/pen/OJXoYzL)

made with: scroll() timeline · canvas 2D · requestAnimationFrame

```js
requestAnimationFrame(render)
```

### [Parallax effect](https://codepen.io/Alta1re/pen/JjKaaoG)

made with: nothing recognised — read the code

```css
div { background-position: center }
```

### [Background Parallax Pixel Stars CSS](https://codepen.io/ungkunazmi/pen/MWeqVjG)

on scroll: div.: transform+top ×3 | made with: @keyframes

```css
#stars { box-shadow: 785px 1440px #FFF , 1656px 752px #FFF , 945px 1699px #FFF , 358px 442px #FFF , 730px 1639px #FFF , 1489px 427px #FFF , 1134px 1408px #FFF , 1620px 435px #FFF , 758px 1131px #FFF , 1930px 176px #FFF , 613px 39 }
#stars:after { position: absolute; top: 2000px; box-shadow: 785px 1440px #FFF , 1656px 752px #FFF , 945px 1699px #FFF , 358px 442px #FFF , 730px 1639px #FFF , 1489px 427px #FFF , 1134px 1408px #FFF , 1620px 435px #FFF , 758px 1131px #F }
#stars2 { box-shadow: 1037px 1342px #FFF , 18px 261px #FFF , 1361px 975px #FFF , 1760px 687px #FFF , 846px 1551px #FFF , 1070px 740px #FFF , 1671px 25px #FFF , 377px 1908px #FFF , 1652px 246px #FFF , 864px 1187px #FFF , 1467px 194 }
#stars2:after { position: absolute; top: 2000px; box-shadow: 1037px 1342px #FFF , 18px 261px #FFF , 1361px 975px #FFF , 1760px 687px #FFF , 846px 1551px #FFF , 1070px 740px #FFF , 1671px 25px #FFF , 377px 1908px #FFF , 1652px 246px #FFF }
#stars3 { box-shadow: 402px 1645px #FFF , 550px 643px #FFF , 634px 725px #FFF , 1715px 1562px #FFF , 1981px 1501px #FFF , 1605px 878px #FFF , 1690px 1007px #FFF , 416px 1068px #FFF , 522px 1469px #FFF , 1811px 714px #FFF , 1584px  }
#stars3:after { position: absolute; top: 2000px; box-shadow: 402px 1645px #FFF , 550px 643px #FFF , 634px 725px #FFF , 1715px 1562px #FFF , 1981px 1501px #FFF , 1605px 878px #FFF , 1690px 1007px #FFF , 416px 1068px #FFF , 522px 1469px # }
#title { position: absolute; top: 50%; margin-top: -60px }
from { transform: translateY(0px) }
to { transform: translateY(-2000px) }
@keyframes animStar animates transform
```

### [Help Parallax](https://codepen.io/mikel26/pen/ExypEmB)

made with: scroll listener

```css
.t_wrapper_l { position: absolute }
.title { margin-bottom: 20px }
.slide_01, .slide_02, .slide_03, .slide_04 { position: relative; background-position: center }
.slide_1_1, .slide_1_2 { position: relative; background-position: center }
.slide_1_1_1, .slide_1_1_2, .slide_1_1_3 { position: relative; background-position: center }
```

```js
addEventListener("scroll", function()
```

### [pSLIDER](https://codepen.io/Pheelippo/pen/JjKBMLr)

on scroll: div.slide__darkbg: transform ×5, div.slider: transform | made with: transition · :hover

```css
.cont { position: relative }
.slider { position: relative; transform: translate3d(0, 0, 0); will-change: transform }
.slider.animation { transition: transform 750ms ease-in-out }
.slider.animation .slide__darkbg { transition: transform 750ms ease-in-out }
.slider.animation .slide__text { transition: transform 750ms ease-in-out }
.slider.animation .slide__letter { transition: transform 750ms ease-in-out }
.slide { position: absolute; top: 0 }
.slide__darkbg { position: absolute; top: 0; transform: translate3d(0, 0, 0); will-change: transform }
.slide__text-wrapper { position: absolute }
.slide__letter { position: absolute; top: 0; transform: translate3d(0, 0, 0); will-change: transform }
.slide__text { text-transform: uppercase; transform: translate3d(0, 0, 0); will-change: transform }
.slide--1__darkbg { background-position: 0px center, 0px center; transform: translate3d(0, 0, 0); will-change: transform }
```

### [Full Page Scrolling with pagePiling.js](https://codepen.io/chiaralyn/pen/pobVeyb)

held: fixed div.right | on scroll: span.: background ×2, div.section: transform+top | made with: nothing recognised — read the code

### [Symple Parallax](https://codepen.io/chiaralyn/pen/pobVNxx)

made with: nothing recognised — read the code

### [Parallax Card (Pure CSS using variables. Best on Desktop)](https://codepen.io/akhil_001/pen/PozRMQw)

on scroll: div.content-container: transform+top | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
body { transform: perspective(600px) }
.content-container { position: absolute; transition: box-shadow 0.5s ease, transform 0.65s ease; will-change: transform; box-shadow: -20px 10px 20px rgba(0, 0, 0, 0.4); transform: translateY(0) rotateX(var(--angleX, 0)) rotateY(var(--angleY, }
.controls-container { position: absolute; top: 5% }
.controls-container .control { box-shadow: -2px 2px 1px black, -0.5px 1px 0px #f0f0f0 inset }
.message-container .message { position: absolute; top: 35%; box-shadow: -20px 10px 10px rgba(0, 0, 0, 0.2), -1px -1px 0px #a0a0a0 inset }
.message-container .message-two { top: 55% }
.message-container .message-three { top: 75% }
.message-container .instructions { position: absolute; top: 10% }
```

### [Parallaxy Images - Gsap Scroll Trigger](https://codepen.io/Bupeldox/pen/JjKLrgR)

on scroll: div.image: transform+top ×2, div.img: transform+top | on hover of a.: div.image: transform+top ×2, div.img: transform+top | made with: :hover · GSAP

```css
.parallax > * { top: -70px }
.midPage { margin-bottom: 200px }
.textSection { padding-top: 100px }
.textSection::before { box-shadow: 1px 1px 1px 1px #00b8ff }
.imageSection .img { box-shadow: inset 1px 1px 1px 1px #6736e4 }
.imageSection .img .image { position: absolute; background-position: center; position: relative; box-shadow: inset 0 1px 14px 9px #341f5645 }
::-webkit-scrollbar-thumb { box-shadow: inset 0 0 0 4px #6736e4, 0 0 0 1px #6736e4 }
```

```js
gsap.to(e, {
scrollTrigger: { scrub: 1, trigger: parentElement, start: "top bottom", end: "bottom top", ease: "power1.inOut" }
scrollTrigger: { scrub: 1, trigger: $(e).parent()[0], start: "top+100 bottom", end: "bottom top", ease: "linear" }
gsap.to(".a .img", {
scrollTrigger: { scrub: 1, trigger: ".imageSection.a", start: "top+100 bottom", end: "bottom top", ease: "liniar" //markers:true, }
gsap.to(".a .img .image",{
scrollTrigger:{ scrub:1, trigger:".imageSection.a", start:"top bottom", end:"bottom top", ease:"liniar", }
gsap.to(".b .img",{
```

### [3D Cards with parallax effect](https://codepen.io/figarali/pen/BazJyYw)

on hover of div.card-wrap: div.card: shadow, div.card-bg: opacity, div.card-info: transform+top, p.: opacity+top | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
h1 + p, p + p { margin-top: 10px }
.card-wrap { transform: perspective(800px) }
.card-wrap:hover .card-info { transform: translateY(0) }
.card-wrap:hover .card-info p { opacity: 1 }
.card-wrap:hover .card-info, .card-wrap:hover .card-info p { transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1) }
.card-wrap:hover .card-info:after { transition: 5s cubic-bezier(0.23, 1, 0.32, 1); opacity: 1; transform: translateY(0) }
.card-wrap:hover .card-bg { transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1), opacity 5s cubic-bezier(0.23, 1, 0.32, 1); opacity: 0.8 }
.card-wrap:hover .card { transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 2s cubic-bezier(0.23, 1, 0.32, 1); box-shadow: rgba(255, 255, 255, 0.2) 0 0 40px 5px, white 0 0 0 1px, rgba(0, 0, 0, 0.66) 0 30px 60px 0, inset #333 0 0 0 5px,  }
.card { position: relative; box-shadow: rgba(0, 0, 0, 0.66) 0 30px 60px 0, inset #333 0 0 0 5px, inset rgba(255, 255, 255, 0.5) 0 0 0 6px; transition: 1s cubic-bezier(0.445, 0.05, 0.55, 0.95) }
.card-bg { opacity: 0.5; position: absolute; top: -20px; background-position: center; transition: 1s cubic-bezier(0.445, 0.05, 0.55, 0.95), opacity 5s 1s cubic-bezier(0.445, 0.05, 0.55, 0.95) }
.card-info { position: absolute; bottom: 0; transform: translateY(40%); transition: 0.6s 1.6s cubic-bezier(0.215, 0.61, 0.355, 1) }
.card-info p { opacity: 0; transition: 0.6s 1.6s cubic-bezier(0.215, 0.61, 0.355, 1) }
```

### [GSAP3 Parallax with data-speed](https://codepen.io/esadrian/pen/OJXjzQo)

on scroll: div.box: transform+top ×3 | made with: GSAP · ScrollTrigger

```js
gsap.fromTo(el,
scrollTrigger: { trigger: el.wrap, start: "top bottom", end: "bottom top", scrub: 1, }
```

### [nattåget](https://codepen.io/henrycatalinismith/pen/wvWdKgj)

made with: @keyframes · transition

```css
from { background-position: 1vmin }
to { background-position: 100vmin }
body { animation-name: daynight; animation-direction: alternate; animation-duration: var(--day); animation-iteration-count: infinite; position: relative }
body::after { transition: background-color var(--day); position: absolute; top: var(--vpad); bottom: var(--vpad) }
body::before { animation-name: slide; animation-duration: 64s; animation-iteration-count: infinite; animation-timing-function: linear; animation-direction: reverse; transition: background-color var(--day); opacity: 0.4; filter: blur(1v }
marquee { transition: background-image var(--day); position: relative; transform: scaleX(-1) }
marquee::before { animation-name: slide; animation-duration: 8s; animation-iteration-count: infinite; animation-timing-function: linear; background-position: 4px; position: absolute; top: calc( var(--horizon) - 0.5vmin ) }
@keyframes daynight animates --sky, --grass
@keyframes slide animates background-position
```

### [Parallax Grid Layout](https://codepen.io/localnerve/pen/PozpVQW)

held: sticky div, sticky header | made with: position: sticky · position: fixed · scroll-snap · 3D (perspective / preserve-3d) · IntersectionObserver

```css
[role=toolbar] { position: sticky; top: 0 }
[role=banner] { position: sticky; top: calc(-1 * ((2em * 1.15 + (2 * 21.44px)) - 68.16px)) }
.scrollsnap-container { -ms-scroll-snap-type: y proximity; scroll-snap-type: y proximity; scroll-padding-top: 136.32px }
.scrollsnap-container > * { scroll-snap-align: none }
.scrollsnap-container .parallax-item ~ .parallax-item.std { scroll-snap-align: start }
.scrollsnap-container .parallax-item ~ .parallax-item.std { scroll-snap-align: end }
.scrollsnap-container .parallax-item ~ .parallax-item.std { scroll-snap-align: none }
.scrollsnap-container .parallax-item.std:nth-child(4) { scroll-snap-align: start }
.scrollsnap-container .parallax-item.std:nth-child(4) { scroll-snap-align: none }
.parallax-container { position: relative; perspective: 10px }
.parallax-item.std { transform: translateZ(0) scale(1) }
.parallax-item.sub { transform: translateZ(-2px) scale(1.2) }
```

```js
new IntersectionObserver(entries => {
```

### [custom scrollcontainer parallax with vertical and horizontal movement](https://codepen.io/wesp/pen/WNxpyGO)

on scroll: div.horz: transform+top ×4 | made with: scroll() timeline

```css
.page { position: relative }
.page .horz { position: absolute; top: 0 }
.page .horz:nth-of-type(1) { top: 10% }
.page .horz:nth-of-type(2) { top: 25% }
.page .horz:nth-of-type(3) { top: 60% }
.page .horz:nth-of-type(4) { top: 75% }
p { position: relative }
```

### [A trip of four seasons](https://codepen.io/mapmaths/pen/yLJgpbX)

made with: nothing recognised — read the code

```css
main { position: relative; top: 0px }
h1 { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

### [Parallax element scrolling - Rellax.js](https://codepen.io/codersdesign/pen/oNLBedO)

on scroll: div.rellax: transform+top ×4 | made with: nothing recognised — read the code

```css
.rellax-contain { position: relative }
.rellax { position: absolute }
.rellax.one { top: 120px }
.rellax.two { top: 200px }
.rellax.three { top: 50px }
.rellax.four { top: 300px }
body, html { position: relative; padding-top: 30px }
.link-me { margin-bottom: 50px }
```

### [dust particles (interactive)](https://codepen.io/timming-au/pen/ExygVPw)

on scroll: span.: shadow+top | made with: @keyframes · mix-blend-mode · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
#container { position: relative }
#canvas-bg, #canvas-main { position: absolute }
#cursor { position: absolute; transform: translateX(-50%) translateY(-50%); box-shadow: 0px 0px 10px 1px rgba(222, 222, 222, 0.5); animation: pulse-cursor 3s ease-in-out infinite; mix-blend-mode: difference; top: 10% }
0% { box-shadow: 0px 0px 8px 1px rgba(222, 222, 222, 0.4) }
50% { box-shadow: 0px 0px 12px 1px rgba(222, 222, 222, 0.6) }
100% { box-shadow: 0px 0px 8px 1px rgba(222, 222, 222, 0.4) }
@keyframes pulse-cursor animates box-shadow
```

```js
requestAnimationFrame(update)
addEventListener("mousemove",mouseMoveHandler)
```

### [CSS Demo: Parallax Scrolling](https://codepen.io/veritygriscti/pen/LYZGLQY)

made with: nothing recognised — read the code

```css
.bgimg-1, .bgimg-2, .bgimg-3 { position: relative; background-position: center }
.bgimg-1 { opacity: 1.0 }
.bgimg-2 { opacity: 0.7 }
.bgimg-3 { opacity: 1.0 }
.heading { position: absolute; top: 0; box-shadow: 0px 10px rgba(31, 31, 46,0.5) }
.content-wrapper { position: relative }
.bgimg-1 { opacity: 1.0 }
.bgimg-2 { opacity: 0.7 }
.bgimg-3 { opacity: 1.0 }
```

### [ZIM](https://codepen.io/Gyaanap/pen/mdEVPQb)

made with: nothing recognised — read the code

### [CSS Demo: Fixed Content, Scrolling Background Images](https://codepen.io/veritygriscti/pen/qBNEOdN)

held: fixed main.wrapper | made with: position: fixed

```css
.wrapper { position: fixed; top: 50%; transform: translate(-50%,-50%); -webkit-transform: translate(-50%, -50%); -moz-transform: translate(-50%, -50%); -o-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%) }
.bg-image { background-position: center }
```

### [Particles with canvas](https://codepen.io/timming-au/pen/YzWzWQa)

made with: canvas 2D · requestAnimationFrame

```css
#parallax { position: absolute }
#button-container { position: relative }
#canvas { position: absolute }
```

```js
requestAnimationFrame(update)
```

### [country side drive](https://codepen.io/rubenasanchez/pen/yLOdKxP)

on scroll: div.grid-wheel: transform+top ×2, div.grid-mountains: transform, div.grid-trees: transform, div.grid-car-container: transform+top, div.fences: transform | made with: @keyframes

```css
.grid-mountains { animation: move-mountains 100s linear infinite }
.grid-mountain { border-bottom: 54vh solid rgb(150,150,150) }
.grid-peak { border-bottom: 12vh solid rgb(250,250,250) }
.small-mountain { border-bottom: 40vh solid rgb(150,150,150) }
.small-peak { border-bottom: 12vh solid rgb(250,250,250) }
.small-peak { border-bottom: 8vh solid rgb(250,250,250) }
.grid-trees { animation: move-trees 10s linear infinite }
.grid-bush { transform: translateY(1vh) }
.grid-car-container { transform: translateX(30vw); animation: car-hop .25s linear alternate infinite }
.grid-car { transform: translateY(1vh) }
.w-back { transform: translate(3vh,1.2vh) }
.w-front { transform: translate(3.5vh,1.2vh) }
```

### [90 Day Fiancé: Almost there, lazy](https://codepen.io/jackiezen/pen/LYNvEoe)

on scroll: div.dune: transform ×3, div.text: opacity | on hover of a.: div.dune: transform+top ×3, div.text: opacity | made with: transition · :hover

```css
*:before, *:after { position: absolute }
p { opacity: 0.5 }
p a:link, p a:visited { transition: all 0.2s }
#container { position: relative; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2), 0 6px 6px rgba(0, 0, 0, 0.22) }
#container:before { bottom: 0 }
body:before { opacity: 0.3 }
.dune { position: absolute; bottom: 0 }
#dune-1 svg:nth-child(2) { transform: scale(2, 2.3) }
#dune-2 svg { transform: scale(2) }
#dune-3 svg { transform: scale(1.4, 2.4) }
#people { position: absolute; bottom: 95px }
#sun { position: absolute; top: 50px }
```

### [Simple Parallax Scrolling Demo](https://codepen.io/david-copestakes/pen/bGpxOOY)

made with: nothing recognised — read the code

```css
.pimg1, .pimg2, .pimg3 { position: relative; opacity: .7; background-position: center }
.ptext { position: absolute; top: 50%; text-transform: uppercase }
```

### [Thank you for the oxygen (no-mobile parallax thing)](https://codepen.io/andrasnagy/pen/BaKVGzo)

on scroll: img.section-1__images__item: transform+top ×2, h1.section-2__title: transform+top ×2, header.masthead: transform+top, p.section-1__text: transform+top | on hover of img.section-1__images__item: h1.section-2__title: transform ×2 | made with: @keyframes · GSAP

```css
html { padding-bottom: 10rem }
img { box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.3) }
h1 { text-transform: uppercase; margin-bottom: 2rem }
.section-1 { margin-top: 10rem }
.section-2__title { animation: textScroll 40s linear infinite }
0% { transform: translateX(0) }
100% { transform: translateX(-100%) }
@keyframes textScroll animates transform
```

```js
gsap.to('.masthead', {
scrollTrigger: { trigger: '.site', start: 'top top', scrub: true, }
gsap.to('.section-1__text', {
gsap.to('.section-1__images__item:first-child', {
gsap.to('.section-1__images__item:last-child', {
gsap.to('.section-3__text', {
scrollTrigger: { trigger: '.section-3__text:first-of-type', scrub: true, }
gsap.to('.section-3__images__item:first-child', {
```

### [SVG parallax anaglyph 3D effect](https://codepen.io/natszafraniec/pen/VwadZxE)

made with: nothing recognised — read the code

```css
.scene { padding-top: 15.72%; position: absolute; top: 50%; transform: translate(-50%, -50%) }
.scene__wrapper { position: absolute; top: 0 }
.scene__image { position: absolute; top: 0 }
.scene__image--left { top: -0.2vw !important }
.scene__image--right { top: auto !important; bottom: -0.2vw }
```

### [Cascading Photographic Portfolio Concept](https://codepen.io/artofmayhem/pen/BaKxMXj)

made with: transition · :hover

```css
.divabstract { background-position: center }
.divfall { background-position: center }
.divpurps { background-position: center }
.divpinkflow { background-position: center }
.divwaterfall { background-position: center }
.divwhitewash { background-position: center }
.divOflower { background-position: center }
.divBlue { background-position: center }
.divGreenleaf { background-position: center }
.divBlacknwhite { background-position: center }
.divColorsplash { background-position: center }
nav a:hover { opacity: 0.6; transition: 3s }
```

### [BOOTSTRAP : Parallax simple - jQuery](https://codepen.io/AlexyGaras/pen/Vwaxwda)

made with: nothing recognised — read the code

### [Parallax + outline text](https://codepen.io/tiantsoa/pen/PoNQMWy)

held: fixed span.scroll | made with: position: fixed · transition

```css
.container__frame { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.container__text { position: absolute; top: 40% }
.text { text-transform: uppercase }
.text::before { position: absolute }
.hscroll { position: relative; transition: all 1000ms ease-in-out }
.scroll { position: fixed; bottom: 3vmin; transform: translateX(-50%) }
```

### [Stars parallax effect](https://codepen.io/fariati/pen/YzqYwpR)

held: fixed canvas | made with: position: fixed · canvas 2D · pointer / mouse tracking

```css
canvas { position: fixed }
```

```js
addEventListener('mousemove', (e) => {
```

### [CSS-parallax](https://codepen.io/dboppch/pen/BaKRwLM)

made with: 3D (perspective / preserve-3d)

```css
.wrapper { perspective: 5px; perspective-origin: center top; position: relative }
header { transform: translateZ(-2px) scale( calc(7 / 5)); transform-origin: 50% top }
```

### [Dribbble @zhenyary ( in progress)](https://codepen.io/BurmesePotato/pen/ExKWqbV)

on scroll: div.header-grid__item: transform+top, div.header-action: transform+top | made with: nothing recognised — read the code

```css
.header { padding-bottom: 5rem }
.main__content h1 { margin-bottom: 1.75rem }
.main { padding-top: 0 }
.main__content { padding-bottom: 4rem }
.main__content--2 { padding-top: 4rem }
.main__cover--2 { margin-top: -4rem }
```

### [Parallax Pure CSS](https://codepen.io/rafaelsp/pen/bGppMzR)

made with: position: fixed

```css
.intro::after { position: fixed }
```

### [Parallax slideshow (infinite scrolling)](https://codepen.io/knekk/pen/abNvMoy)

held: fixed footer | made with: position: fixed · @keyframes · 3D (perspective / preserve-3d) · scroll listener · requestAnimationFrame

```css
.slideshow { opacity: 0 }
.slideshow.in { animation: in 1s ease-in both }
footer { position: fixed; bottom: 0; margin-bottom: 5vh }
from { opacity: 0 }
to { opacity: 1 }
@keyframes in animates opacity
```

```js
addEventListener("scroll", () => {
requestAnimationFrame(() => {
addEventListener("mouseleave", dragEnd)
```

### [Nuclear War Survival | Parallax Animation Website](https://codepen.io/kjkosta/pen/ZEWGQWP)

made with: :hover · 3D (perspective / preserve-3d)

```css
.parallax { perspective: 100px; position: absolute; top: 0; bottom: 0 }
.p__layer { position: absolute; top: 0; bottom: 0 }
.p__layer > img { position: absolute; bottom: 0 }
.p__layer__1 { margin-top: 300px }
.p__layer__2 { margin-top: -100px }
.p__layer__3 { margin-top: 100px }
.cover { position: absolute; top: 100%; margin-top: -20px }
.p__layer__0 { transform: translateZ(-200px) scale(3) }
.p__layer__1 { transform: translateZ(-150px) scale(2.5) }
.p__layer__2 { transform: translateZ(-100px) scale(2) }
.p__layer__3 { transform: translateZ(-50px) scale(1.5) }
.p__layer__4 { transform: translateZ(0px) scale(1) }
```

### [Parallax CSS](https://codepen.io/Eruedraith/pen/zYqxKwv)

held: fixed div.footer | made with: position: fixed

```css
.footer { position: fixed; bottom: 0 }
```

### [Z-index overlap shadow lift fake-parallax](https://codepen.io/ljnest/pen/rNeNEXX)

on scroll: div.box: transform ×4 | made with: @keyframes · transition · :hover · pointer / mouse tracking

```css
.wrapper { transition: all .2s ease-out }
.box { transition: all .2s ease-out }
.steady { position: absolute; transform: translate(-40px,5px); opacity: .75; vertical-align: top; box-shadow: 0 15px 15px rgba(0,0,0,0.2) }
.box1 { position: absolute; box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23); transform: translate(-100px,-90px) }
.box2 { position: absolute; box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23); transform: translate(30px,100px) }
.box3 { position: absolute; box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23); transform: translate(40px,-50px) }
.box4 { position: absolute; box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23); transform: translate(-120px,60px) }
.box1:hover,.box2:hover,.box3:hover,.box4:hover { box-shadow: 0 30px 55px rgba(0,0,0,0.4), 0 20px 16px rgba(0,0,0,0.20) }
30% { transform: rotate(1turn); transform: translate(45px,-55px) }
100% { transform: translate(40px,-50px) }
30% { transform: translate(35px,105px) }
100% { transform: translate(30px,100px) }
```

```js
addEventListener('mouseleave', function() {
addEventListener('mousemove',(e) => {
```

### [Effect background parallax](https://codepen.io/crianbluff/pen/ExKxpLq)

on scroll: img.layer: transform+top ×11, img.layer: transform, h2.layer: transform | on hover of img.layer: img.layer: transform+top ×11, img.layer: transform, h2.layer: transform+top | made with: pointer / mouse tracking

```css
section { position: relative }
section img { position: absolute; top: 0 }
section h2 { position: relative }
```

```js
addEventListener('mousemove', e => parallax(e))
```

### [Simple Parallax](https://codepen.io/prem-jeet/pen/yLemGVe)

on scroll: g.[object: transform+top ×2, text.[object: transform | made with: pointer / mouse tracking

```js
addEventListener("mousemove", e =>{
```

### [Parallax](https://codepen.io/Shriririrurururarara/pen/xxZvJzE)

made with: nothing recognised — read the code

```css
.pimg1 { position: relative; background-position: center }
.pimg2 { position: relative; background-position: center }
.pimg3 { position: relative; background-position: center }
.pimg4 { position: relative; background-position: center }
.ptext { position: absolute; top: 50%; text-transform: uppercase }
```

### [TweenMax Draggable Infinite Slideshow with Parallax Effect INTERACTION](https://codepen.io/RaduBratan/pen/RwrXMzJ)

on scroll: div.image-container: transform ×9, span.text: transform ×6 | made with: @keyframes · transition · GSAP

```css
.slideshow-container { position: relative; transition: all 0.6s ease }
.slideshow-container .slides-styler-wrapper { position: relative }
.slideshow-container .slides-styler-wrapper .slides-container { position: relative; top: 0 }
.slideshow-container .slides-styler-wrapper .slides-container.shifting { transition: left 0.2s ease-in-out }
.slideshow-container .slides-styler-wrapper .slides-container .slide { transition: all 0.6s; position: relative }
.slideshow-container .slides-styler-wrapper .slides-container .slide .image-cont { position: absolute; transform: translate(0%, 0%) }
.slideshow-container .slides-styler-wrapper .slides-container .slide .image-cont { position: absolute; background-position: center; filter: drop-shadow(2px 2px 16px rgba(0, 0, 0, 0.1)) }
.slideshow-container .slides-styler-wrapper .slides-container .slide .image-cont { transform: translate(80%, 40%); filter: drop-shadow(2px 2px 16px rgba(0, 0, 0, 0.1)) }
.slideshow-container .slides-styler-wrapper .slides-container .slide .image-cont { transform: translate(-150%, -50%) rotate(-45deg); filter: drop-shadow(2px 2px 16px rgba(0, 0, 0, 0.1)) }
.slideshow-container .slides-styler-wrapper .slides-container .slide .text { position: absolute; transform: translate(0%, 0%) }
.slideshow-container .previous-arrow { transform: translate(-40vw, 0%) rotate(90deg); transition: background 0.5s; position: absolute; opacity: 0.8 }
.slideshow-container .next-arrow { position: absolute; transform: translate(40vw, 0%) rotate(-90deg); transition: background 0.5s; opacity: 0.8 }
```

### [CMY Title - Mouse Reflect](https://codepen.io/JuanFuentes/pen/QWyPxOz)

on scroll: span.: transform+top ×2 | made with: mix-blend-mode · 3D (perspective / preserve-3d) · pointer / mouse tracking · requestAnimationFrame

```css
#title-container { position: absolute; top: 50%; transform: translate(-50%, -50%); text-transform: uppercase }
h1, h2, h3, h4, h5, h6 { position: relative; top: 0 }
h1 span, h2 span, h3 span, h4 span, h5 span, h6 span { mix-blend-mode: overlay; transform: translate3d(0px, 0px, 0px); position: absolute; top: 0 }
```

```js
addEventListener('mousemove', this.update.bind(this), false)
requestAnimationFrame(this.animate.bind(this))
```

### [3D Parallax Design](https://codepen.io/devxyzroblox/pen/ExPOWvg)

on hover of img.: div.box: shadow, div.contentBx: transform | made with: transition · :hover · 3D (perspective / preserve-3d) · pointer / mouse tracking · requestAnimationFrame

```css
.container { position: relative }
.container .box { position: relative }
.container .box:hover { box-shadow: 0 50px 80px rgba(0, 0, 0, 0.2) }
.container .box .imgBx { position: absolute; top: 0 }
.container .box .contentBx { position: absolute; top: 50%; transform: translateZ(20px) scaleY(0); transform-origin: top; transition: 0.5s }
.container .box:hover .contentBx { transform: translateZ(50px) scaleY(1) }
```

```js
addEventListener("mouseenter", this.onMouseEnterBind)
addEventListener("mouseleave", this.onMouseLeaveBind)
addEventListener("mousemove", this.onMouseMoveBind)
requestAnimationFrame(this.updateBind)
requestAnimationFrame(this.resetBind)
```

### [Parallax slideshow (infinite auto-scrolling)](https://codepen.io/knekk/pen/ZEQMjgb)

held: fixed footer | made with: position: fixed · @keyframes · 3D (perspective / preserve-3d)

```css
.slideshow { opacity: 0 }
.slideshow.in { animation: in 1s ease-in both }
footer { position: fixed; bottom: 0; margin-bottom: 5vh }
from { opacity: 0 }
to { opacity: 1 }
@keyframes in animates opacity
```

### [スマホでもパララックス](https://codepen.io/Katsunari/pen/RwrxMgP)

made with: nothing recognised — read the code

```css
.parallax { background-position: center top }
```

### [Parallax effect](https://codepen.io/bsmaria/pen/KKVyLvg)

on scroll: div.card: transform+top | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
main { perspective:3px }
section { position:relative }
.card { position:relative; box-shadow:0px 0px 5px rgba(0,0,0,0.3); transition:0.3s ease-in; transform:translateZ(-1px) scale(2) }
.card:hover { transform:scale(1.7) }
```

### [parallax template](https://codepen.io/Icebergk/pen/JjGOVQr)

on hover of a.nav-link: a.nav-link: background, div.: opacity | made with: scroll() timeline · :hover · Web Animations API (.animate)

```css
.navbar { opacity:1; position:absolute }
.nav-link { padding-top: 9px }
.network { padding-top: 9px }
#parallax1 { background-position: center }
#middle { background-position: center }
#content2 { margin-bottom:25px }
#parallax3 { background-position: center }
footer { background-position: center; padding-top: 20px }
.row { margin-top:60px }
.prowjets { margin-top:30px }
.card { box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2) }
.col { margin-bottom: 20px }
```

```js
.animate({
```

### [Pool Girl Parallax](https://codepen.io/aortegasolis/pen/PoZOVMZ)

on scroll: svg.[object: transform+top ×6 | made with: position: fixed · clip-path · mix-blend-mode

```css
svg { position:fixed }
```

### [Parallax GSAP Scroll Trigger](https://codepen.io/Bahaa1985/pen/YzwEOZr)

held: fixed nav.navbar, fixed div.text, fixed div.text, fixed div.text | made with: position: fixed · GSAP · ScrollTrigger

```css
nav img { position: absolute; top: 1% }
.div-container { position: relative; top: 0 }
.parallax { position: relative; background-position: center }
.text { position: fixed; top: 50%; transform: translate(-50%, -50%); filter: blur(10px) }
img { box-shadow: 4px 4px 4px gray }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to(text_elems[i], {
scrollTrigger: { trigger: containers[i], start: "top 5%", toggleActions: "play reset restart reset" }
gsap.to(containers, {
scrollTrigger: { // trigger: containers[x], // snap: 1 / (containers.length - 1) // }
```

### [parallax any element- it just works](https://codepen.io/electrifried/pen/jOWGVyB)

on scroll: div.card: transform+top ×8 | made with: scroll() timeline

```css
.parallax { will-change: transform }
```

### [Parallax mouse - space galaxy.](https://codepen.io/ollistap/pen/VwezNgq)

made with: nothing recognised — read the code

```css
#parallax { position: relative }
.parallax-layer { position: absolute }
```

### [Parallax scroll animation](https://codepen.io/isladjan/pen/abdyPBw)

held: fixed svg.[object, fixed a.btn, fixed a.btn | on scroll: path.[object: transform+top ×18, path.[object: transform ×5, path.[object: opacity ×4, path.[object: transform+opacity+top, g.[object: transform+top | on hover of a.btn: path.[object: transform+top ×12, path.[object: transform ×6, path.[object: opacity ×5, path.[object: transform+opacity+top, g.[object: transform+top, a.btn: background+color | made with: position: fixed · transition · :hover · mix-blend-mode · GSAP · ScrollTrigger

```css
.wrapper { position: relative }
svg { position: fixed; top: 0 }
.scrollElement { position: absolute; top: 0 }
.btn { position: fixed; bottom: 5%; transform: translateX(-50%); transition: all .3s }
#text, #arrow { transform: translateY(-120px) scale(0.8) }
#info2 { transform: translateY(-120px) scale(0.8) }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline()
ScrollTrigger.create({
gsap.fromTo(
gsap.to("#bird", { scaleX: 1, rotation: 0 })
gsap.to("#bird", { scaleX: -1, rotation: -15 })
gsap.to(item, {
gsap.to("#bats", { opacity: 0, delay: 2 })
```

### [Parallax Scrolling Effect CSS](https://codepen.io/thecodingpie/pen/JjGJMMB)

made with: 3D (perspective / preserve-3d)

```css
body { perspective: 1px }
header { position: relative }
header h1 { position: absolute; top: 50%; transform: translate(-50%, -50%) }
header::before { position: absolute; top: 0; transform: translateZ(-1px) scale(2) }
.paragraph { position: absolute; top: 100vh }
```

### [CSS animations](https://codepen.io/Fibonaccifreak/pen/vYLZeZG)

on scroll: div.alley: opacity+filter, img.: transform+opacity+top | on hover of img.: div.alley: opacity+filter, img.: transform+opacity+top | made with: @keyframes · transition · :hover · pointer / mouse tracking

```css
* { -webkit-transition: all 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94); -moz-transition: all 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94); -o-transition: all 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94); transition: all 500ms cu }
.alley { position: relative; background-position: center; filter: grayscale(20%); -webkit-filter: grayscale(20%); animation: flicker 2s ease-in-out infinite }
0% { opacity: .5; filter: grayscale(20%) }
25% { opacity: .7; filter: grayscale(15%) }
50% { opacity: 1; filter: grayscale(10%) }
70% { opacity: .7; filter: grayscale(15%) }
100% { opacity: .5; filter: grayscale(20%) }
#raven-pic { opacity: 0; animation: raven-swoop 5s ease-in-out 12s }
0% { transform: translateX(0vw); opacity: .5 }
25% { margin-top: 10vh }
50% { transform: translateX(-50vw); margin-top: 20vh; opacity: 1 }
70% { margin-top: 10vh; opacity: 1 }
```

```js
addEventListener("mousemove", parallax)
```

### [Parallax Outline Effect - ScrollTrigger - #2](https://codepen.io/gabrielcojea/pen/bGEgPQp)

on scroll: h2.parallax-text: transform+top ×8 | made with: GSAP

```css
section { position: relative }
.image-container { position: relative }
img { transform: scale(1.2) }
.text-container { position: absolute; top: 60%; transform: translateY(-50%) }
.parallax-text { position: relative; text-transform: uppercase }
```

```js
gsap.to(firstText, {
scrollTrigger: { trigger: element, scrub: true, start: start + "px bottom", end: "bottom top" }
gsap.to(secondText, {
gsap.timeline({
```

### [Parallax Outline Effect - Nike Example](https://codepen.io/gabrielcojea/pen/ExPZjpW)

on scroll: img.: transform+top | on hover of img.: img.: transform+top | made with: @keyframes

```css
.parallax-text { position: absolute }
.parallax-text::after { position: absolute; top: 0 }
img { animation: sneakerAnimation 2s cubic-bezier(0.25, 1, 0.5, 1) infinite alternate }
0%, 10% { transform: translate(100vw, 0) rotate(15deg) }
90%, 100% { transform: translate(-5vw, -5vw) rotate(-30deg) }
@keyframes sneakerAnimation animates transform
```

### [Parallax Outline Effect - Marquee](https://codepen.io/gabrielcojea/pen/WNrRbwX)

on scroll: div.marquee__inner: transform+top | on hover of img.: div.marquee__inner: transform+top | made with: @keyframes · transition

```css
.parallax-text { position: absolute }
.parallax-text::after { position: absolute; top: 0 }
.marquee { --offset: 20%; transform: translateY(10vw) rotate(-30deg) }
.marquee__inner { transform: translate3d(var(--move-initial), 0, 0); animation: marquee 30s linear infinite; animation-play-state: running }
.image-container { position: relative }
.image-container::after { position: absolute; top: 0; bottom: 0; transition: opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1) }
0% { transform: translate3d(var(--move-initial), 0, 0) }
100% { transform: translate3d(var(--move-final), 0, 0) }
@keyframes marquee animates transform
```

### [GSAP Sliding: Penguin Fast Click Game](https://codepen.io/takaneichinose/pen/MWKbKYP)

made with: @keyframes · transition · GSAP · requestAnimationFrame

```css
.view { position: relative }
.object { position: absolute; top: 0 }
#message, #instruction { position: absolute; top: 0 }
#instruction { transition: opacity 300ms ease }
#instruction.hide { opacity: 0 }
#penguin { position: absolute; bottom: 52px }
#penguin.not-initialized { transform: skewX(45deg) }
#penguin.walk-1 { animation: walk 300ms infinite }
#penguin.walk-2 { animation: walk 200ms infinite }
#penguin.walk-3 { animation: walk 100ms infinite }
#penguin.jump.fly { animation: fly 150ms infinite }
@keyframes walk animates background-position-x
```

```js
requestAnimationFrame(backgroundPositionLoop)
requestAnimationFrame(pressCountLoop)
gsap.timeline({ delay: 0.2 })
gsap.to(penguin, {
gsap.to(penguin, { rotate: "35deg", ease: "power2", duration: 1.2 })
gsap.timeline({ delay: 0 })
gsap.timeline({ delay: 0.5 })
```

### [The Wine Store](https://codepen.io/tayk/pen/wvMoKNd)

made with: nothing recognised — read the code

```css
#linkedin { opacity: 0.5; position: absolute }
.parallax1, .parallax2, .parallax3, .parallax4 { position: relative; opacity: .75; background-position: center }
.heading { position: absolute; top: 40%; text-transform: uppercase }
.heading-sm { position: absolute; top: 50%; text-transform: uppercase }
```

### [Parallax mask img](https://codepen.io/natjo/pen/WNrGrgW)

on scroll: img.: transform+top | made with: scroll() timeline · scroll listener

```css
.bg img { will-change: transform }
```

```js
addEventListener("scroll", _onscroll, { passive: true })
```

### [Parallax Outline Effect - ScrollTrigger - #1](https://codepen.io/gabrielcojea/pen/GRoqOYm)

on scroll: div.text-container: transform+top ×6, h2.parallax-text: transform+opacity+top ×6, img.image: transform+top ×3 | on hover of img.image: div.text-container: transform ×6, h2.parallax-text: transform+opacity ×2, img.image: transform+top ×2, h2.parallax-text: transform+top ×2, h2.parallax-text: transform+opacity+top ×2, img.image: transform | made with: transition · 3D (perspective / preserve-3d) · GSAP

```css
section { position: relative }
.image-container { position: relative }
.image-container::after { position: absolute; top: 0; bottom: 0; transition: opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1) }
.text-container { position: absolute; top: -8vw }
.parallax-text { position: absolute; text-transform: uppercase; transform: translate3d(25vw, 20vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, -5deg); opacity: 0; will-change: transform; perspective: 1100px }
```

```js
gsap.timeline({
gsap.to(element, {
scrollTrigger: { trigger: element, scrub: 1, start: "top bottom", end: "150px top", }
scrollTrigger: { trigger: element, scrub: 1 }
```

### [Parallax Outline Effect](https://codepen.io/gabrielcojea/pen/eYJJwWa)

on scroll: div.marquee__inner: transform | on hover of img.: div.marquee__inner: transform | made with: @keyframes

```css
.text { position: absolute }
.text::after { position: absolute; top: 0; bottom: 0 }
.marquee { --offset: 20vw }
.marquee__inner { transform: translate3d(var(--move-initial), 0, 0); animation: marquee 30s linear infinite; animation-play-state: running }
0% { transform: translate3d(var(--move-initial), 0, 0) }
100% { transform: translate3d(var(--move-final), 0, 0) }
@keyframes marquee animates transform
```

### [Demo Parallax](https://codepen.io/bharatpatel/pen/jOWbpyJ)

made with: scroll() timeline

```css
.saying { position: relative; opacity: 0.7; top: 50px }
.poster { position: relative }
.poster:after { position: absolute; bottom: 25vh }
```

### [Effect mousemove 3d](https://codepen.io/crianbluff/pen/MWKabBL)

on hover of img.: div.box: transform+shadow, div.content-box: transform | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.container { position: relative }
.container .box { position: relative }
.container .box:hover, .container .box:focus, .container .box:active { box-shadow: 0 50px 80px rgba(0, 0, 0, 0.1) }
.container .box .img-box { position: absolute; top: 0 }
.container .box .content-box { position: absolute; top: 50%; transform: translateZ(20px) scaleY(0); transform-origin: top; transition: transform 0.5s ease }
.container .box:hover .content-box { transform: translateZ(50px) scaleY(1) }
```

### [Bootstrap parallax](https://codepen.io/microshark/pen/oNbvaGo)

on hover of a.navbar-brand: a.btn: background | made with: scroll listener

```css
.parallax-container .parallax { background-position: center center; position: absolute }
.parallax-stars { background-position: 0 0 }
```

```js
addEventListener("scroll", function (event) {
```

### [CSS: Parallax Effect](https://codepen.io/iamsaief/pen/GRpbazK)

made with: 3D (perspective / preserve-3d)

```css
.wrapper { perspective: 2px }
.wrapper .section { position: relative }
.wrapper .section::before { background-position: center }
.wrapper .section:nth-child(1)::before { background-position: center bottom }
.wrapper .section h3 { text-transform: uppercase }
.wrapper .parallax::before { position: absolute; top: 0; bottom: 0; transform: translateZ(-1px) scale(1.5) }
```

### [Parallax with only css](https://codepen.io/shaurya-blip/pen/xxwowdv)

made with: :hover

```css
.pimg1, .pimg2, .pimg3 { position:relative; opacity:0.70; background-position:center }
.ptext { position:absolute; top:50%; text-transform:uppercase }
```

### [Parallax with vanilla JS and CSS](https://codepen.io/DevAngrizani/pen/qBOwBja)

on scroll: div.wrapper: transform+filter+shadow+top | made with: transition · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
body { perspective:800px }
.wrapper { transition:all .8s; filter:contrast(250%); box-shadow:5px 5px 7px gray }
.child-1, .child-2, .child-3,.child-4, .child-5, .child-6,.child-7, .child-8, .c { filter:none }
.child-1 { transform: rotateX(16deg) rotateY(-20deg); box-shadow: rgba(0,0,0,.4) 5px -10px 0px 4px, rgba(0,0,0,.3) 10px -20px 0px 8px, rgba(0,0,0,.2) 15px -30px 0px 12px }
.child-2 { transform: rotateX(25deg) rotateY(0deg); box-shadow: rgba(0,0,0,.4) 0px -10px 0px 4px, rgba(0,0,0,.3) 0px -20px 0px 8px, rgba(0,0,0,.2) 5px -30px 0px 12px }
.child-3 { transform: rotateX(16deg) rotateY(20deg); box-shadow: rgba(0,0,0,.4) -5px -10px 0px 4px, rgba(0,0,0,.3) -10px -20px 0px 8px, rgba(0,0,0,.2) -15px -30px 0px 12px }
.child-4 { transform: rotateX(0deg) rotateY(-20deg); box-shadow: rgba(0,0,0,.4) 5px 0px 0px 4px, rgba(0,0,0,.3) 10px 0px 0px 8px, rgba(0,0,0,.2) 15px 0px 0px 12px }
.child-5 { filter:drop-shadow(8px 8px 10px gray) }
.child-6 { transform:rotateX(0deg) rotateY(20deg); box-shadow: rgba(0,0,0,.4) -5px 0px 0px 4px, rgba(0,0,0,.3) -10px 0px 0px 8px, rgba(0,0,0,.2) -15px 0px 0px 12px }
.child-7 { transform: rotateX(-16deg) rotateY(-20deg); box-shadow: rgba(0,0,0,.4) 5px 10px 0px 4px, rgba(0,0,0,.3) 10px 20px 0px 8px, rgba(0,0,0,.2) 15px 30px 0px 12px }
.child-8 { transform: rotateX(-25deg) rotateY(0deg); box-shadow: rgba(0,0,0,.4) 0px 10px 0px 4px, rgba(0,0,0,.3) 0px 20px 0px 8px, rgba(0,0,0,.2) 0px 30px 0px 12px }
.child-9 { transform: rotateX(-16deg) rotateY(20deg); box-shadow: rgba(0,0,0,.4) -5px 10px 0px 4px, rgba(0,0,0,.3) -10px 20px 0px 8px, rgba(0,0,0,.2) -15px 30px 0px 12px }
```

```js
addEventListener('mousemove',() =>{
```

### [Motorcycle Parallax Design](https://codepen.io/zaidik/pen/PoPXgEN)

made with: transition · :hover

```css
.pimg1,.pimg2,.pimg3 { position: relative; opacity: 0.70; background-position: center }
.ptext { position: absolute; top:50%; text-transform: uppercase }
.contact-details { margin-bottom: 1rem; transition: transform 0.3s ease-out }
.contact-details:hover { transform: translateY(5px) }
```

### [139_Slovenija - Slovenia (parallax, image, linear-gradient, scroll)](https://codepen.io/robert-peri/pen/yLYQweO)

held: fixed div.glava, fixed div.znak, fixed div.noga | on hover of a.: a.: color, span.postanapis: color, img.postaimg: color | made with: position: fixed

```css
.title { padding-top: 0.5vh; padding-bottom: 0.5vh }
.split-1 { padding-top: 0.2vh; padding-bottom: 0.4vh }
.split-2 { padding-top: 0.2vh; padding-bottom: 0.4vh }
.split-3 { padding-top: 0.2vh; padding-bottom: 0.4vh }
.split-4 { padding-top: 0.2vh; padding-bottom: 0.4vh }
.split-5 { padding-top: 0.2vh; padding-bottom: 0.4vh }
.split-6 { padding-top: 0.2vh; padding-bottom: 0.4vh }
.split-end { padding-top: 0.2vh; padding-bottom: 0.4vh }
.parallax { background-position: center }
.para-6 { position: relative }
.footer { text-transform: lowercase }
.znak { position: fixed; bottom:7vh }
```

### [My first Parallax](https://codepen.io/MuLx10/pen/GRpXYJB)

on hover of a.: div.layer: transform+top ×4, div.layer: transform | made with: transition · :hover

```css
#parallax, .layer, .content, .button { position: absolute }
.particles-js1 { position: absolute; opacity: 0.6 }
.particles-js2 { position: absolute; opacity: 0.6 }
.particles-js3 { position: absolute; opacity: 0.6 }
.layer .content h1 { position: absolute; top: 20%; transform: translate3d(-50%, -50%, 0) }
.layer .button p { position: absolute; top: 69%; transform: translate3d(-50%, -50%, 0) }
.layer .button a { transition: all 200ms ease-in-out; position: absolute; top: 60%; transform: translate3d(-50%, -50%, 0) }
.credits footer { position: absolute; bottom: 0; text-transform: uppercase }
.credits footer p strong:hover { transition: all 0.4s ease-in-out }
.credits footer a { transition: all 0.4s ease-in-out }
```

### [Parallax scrolling](https://codepen.io/starwangs/pen/abvKGbN)

made with: mix-blend-mode · scroll listener

```css
section { position: relative }
section::before { position: absolute; bottom: 0 }
section::after { position: absolute; mix-blend-mode: color }
section img { position: absolute; top: 0 }
#text { position: relative }
.info { margin-top: 30px }
```

```js
addEventListener('scroll', () => {
```

### [Параллакс на CSS](https://codepen.io/randominical/pen/QWjxgQV)

made with: transition · 3D (perspective / preserve-3d)

```css
body { perspective: 1px }
header { padding-top: 20% }
header::before { position: absolute; bottom: 0; top: 0; transition: 1s; transform: translateZ(-1px) scale(2) }
header h1 { margin-top: -100px }
```

### [jquery.parallax.js](https://codepen.io/randominical/pen/vYNRQdp)

made with: 3D (perspective / preserve-3d) · pointer / mouse tracking · requestAnimationFrame

```js
addEventListener("mousemove",this.onMouseMove)),y.addEventListener("resize",this.onWindo
requestAnimationFrame(this.onAnimationFrame))},a.prototype.dis
requestAnimationFrame(this.onAnimationFrame)},a.prototype.onDe
```

### [parallax glsl effect](https://codepen.io/Unixseb/pen/jObZodQ)

made with: scroll listener

```css
.container { position: absolute; top: 0 }
```

```js
addEventListener("scroll", sfunc)
```

### [Parallax effect with only CSS](https://codepen.io/coding_dp/pen/WNQZWpd)

made with: nothing recognised — read the code

```css
.first-block { background-position: center }
.second-block { background-position: center }
.third-block { background-position: center }
```

### [Modern Forum Style Homepage](https://codepen.io/areal_alien/pen/vYNejKG)

held: fixed nav, fixed div.back-to-top | on hover of li.navbar-item: a.navbar-item-inner: color, span.: color, i.uil: color | made with: position: fixed · scroll() timeline · @keyframes · transition · :hover · Web Animations API (.animate)

```css
html, body { transition: background-color .2s ease-in-out }
.back-to-top { position: fixed; bottom: 30px }
.back-to-top a { opacity: 0; transition: all .35s ease-in-out }
.back-to-top a:hover { transform: scale(1.1, 1.1) }
#navbar { top: 0; position: fixed }
#nav-icon3 { position: relative; -webkit-transform: rotate(0deg); -moz-transform: rotate(0deg); -o-transform: rotate(0deg); transform: rotate(0deg); -webkit-transition: .5s ease-in-out; -moz-transition: .5s ease-in-out; -o-transition }
#nav-icon3 span { position: absolute; opacity: 1; -webkit-transform: rotate(0deg); -moz-transform: rotate(0deg); -o-transform: rotate(0deg); transform: rotate(0deg); -webkit-transition: .25s ease-in-out; -moz-transition: .25s ease-in-out; }
#nav-icon3 span:nth-child(1) { top: 0 }
#nav-icon3 span:nth-child(2),#nav-icon3 span:nth-child(3) { top: 11px }
#nav-icon3 span:nth-child(4) { top: 22px }
#nav-icon3.open span:nth-child(1) { top: 18px }
#nav-icon3.open span:nth-child(2) { -webkit-transform: rotate(45deg); -moz-transform: rotate(45deg); -o-transform: rotate(45deg); transform: rotate(45deg) }
```

```js
.animate({
.animate({height: $selector2.data('nHeight')},300)
.animate({height: $selector.data('nHeight')},300)
```

### [Parallax 404 page with animated circle in Vue.js](https://codepen.io/siimy-mo/pen/JjYrrrJ)

on scroll: div.circles: transform+opacity+top ×12 | made with: GSAP

```css
.container_inner { position: relative; top: 20% }
.circles { position: absolute; bottom: 10px; opacity: 1; box-shadow: 5px 0 10px rgba(0, 0, 0, 0.1) }
.text_container { position: absolute; top: 0% }
.title { position: absolute; top: 0 }
.title:nth-of-type(2) { filter: blur(10px); opacity: 0.8 }
.opps { position: absolute; top: 250px }
```

### [Parallax pure CSS3](https://codepen.io/alifan/pen/PoPJoLb)

held: sticky header.header, sticky footer.footer | made with: position: sticky · 3D (perspective / preserve-3d)

```css
.header { position: sticky; top: 0 }
.footer { position: sticky; bottom: 0 }
.content { position: relaive }
.parallax { perspective: 1px }
.parallax__item--1 { position: relative }
.parallax__item--1::before { position: absolute; top: 0; transform: translateZ(-1px) scale(2) }
.content__item h1 { margin-bottom: 34px }
.content__item h2 { margin-bottom: 20px }
.content__item--2 { box-shadow: 0 -14px 36px rgba(0, 0, 0, 0.2) }
.content__item--3 { box-shadow: 0 32px 24px rgba(0, 0, 0, 0.1) }
```

### [On scroll parallax](https://codepen.io/nadeeshae/pen/VwvpNoq)

held: fixed div.paralax-box-container | made with: position: fixed · scroll() timeline

```css
.paralax-box-container { position: fixed }
.body-bg { background-position: top; top: -10%; position: absolute; filter: blur(60px) }
.body-bg img { position: relative }
.img { position: relative; top: 50%; transform: translateY(-50%) }
.img img { position: absolute; bottom: 0 }
```

### [Effect parallax scrolling](https://codepen.io/crianbluff/pen/vYNgYpR)

made with: mix-blend-mode · scroll listener

```css
section:before { bottom: 0 }
section:before, section:after { position: absolute }
section:after { mix-blend-mode: color; top: 0 }
section { position: relative }
section img { position: absolute; top: 0 }
#text { position: relative }
```

```js
addEventListener('scroll', function() {
```

### [Space Rocket Parallax](https://codepen.io/gatoledo1/pen/PoPbKrG)

on scroll: img.back: transform+top, div.planets: transform+top, img.rellax: transform+top | made with: nothing recognised — read the code

```css
.section-1 .back { position: absolute; object-position: right }
.section-1 .planets { padding-top: 50px }
.section-1 .planets .col img { position: relative }
.section-1 p { margin-top: -70px }
.section-1 p { margin-top: 0px !important }
.section-1 .rocket { position: relative }
.section-1 .rocket { position: absolute; bottom: -145px }
.section-1 .rocket { position: absolute; bottom: -10px }
.section-2 { position: absolute; bottom: -185px }
.section-2 h2 { padding-bottom: 20px }
.card-concept { box-shadow: 0px 10px 20px -5px rgba(153, 141, 240, 0.3) }
.row p { margin-top: -30px !important }
```

### [Image Parallax Effect on Mouse Move - using Tilt.js](https://codepen.io/abirana/pen/abvmevG)

on scroll: a.js-tilt: transform+top, img.: transform+top, h3.title: transform+top, div.js-tilt-glare-inner: transform+opacity+top | on hover of a.js-tilt: a.js-tilt: transform+top, div.js-tilt-glare-inner: transform+opacity+top | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
a.js-tilt { position: relative }
a.js-tilt > img { transition: all 0.2s ease }
a.js-tilt .title { position: absolute; top: 50%; text-transform: uppercase; transform: translate(-50%, -50%); transition: all 0.2s ease }
a.js-tilt:hover > img { transform: translateZ(-40px) }
a.js-tilt:hover .title { transform: translate(-50%, -50%) translateZ(70px) }
```

### [Parallax with CSS variable](https://codepen.io/benoitdelorme/pen/JjYRPgJ)

on scroll: h1.parallaxit: transform, p.w1: transform, div.btn-container: transform | on hover of div.btn-container: h1.parallaxit: transform+top, p.w1: transform+top, div.btn-container: transform+top | made with: transition · :hover · custom properties driven by JS · pointer / mouse tracking

```css
.container { position: absolute }
.btn { position: relative }
.btn::before { position: absolute; top: 0; transform: translate3d(0, 100%, 0); transition: 0.3s transform ease }
.btn:hover::before { transform: translate3d(0, 0, 0) }
.parallaxit { transition: 0.6s transform ease-out; transform: translate3d(var(--parallax-x), var(--parallax-y), 0px) }
```

```js
style.setProperty('--parallax-x', x+"px")
style.setProperty('--parallax-y', y+"px")
addEventListener("mousemove", function(e) {
```

### [Parallax site](https://codepen.io/AoDarkness/pen/VwvexzP)

made with: nothing recognised — read the code

```css
#textI, #textII, #textIII { padding-top: 10px; padding-bottom: 10px }
#pozaI, #pozaII, #pozaIII { position: relative; opacity: 0.7; background-position: center }
#pozaI { padding-bottom: 15rem; padding-top: 15rem }
#pozaII { padding-bottom: 15rem; padding-top: 15rem }
#pozaIII { padding-top: 15rem; padding-bottom: 15rem }
```

### [Parallax Gallery Scroll](https://codepen.io/paolopersia/pen/bGVNzdE)

made with: transition

```css
h1 { margin-bottom: 0px }
.container { position: relative }
.row { position: absolute; -webkit-transition: all 0.5s; transition: all 0.5s }
.gallery { position: relative }
.gallery .gallery_item { padding-bottom: 10px }
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

### [CSS: Pure-CSS Parallax Scrolling Effect](https://codepen.io/mjunaidi/pen/jOPRyeZ)

made with: 3D (perspective / preserve-3d)

```css
h1 { text-transform: capitalize }
.wrapper { perspective: 2px }
.section { position: relative }
.parallax::after { position: absolute; top: 0; bottom: 0; transform: translateZ(-1px) scale(1.5) }
```

### [Parallax](https://codepen.io/Farshad_Development/pen/ZEGwrdR)

on scroll: img.parallax-element: transform+top ×2, img.parallax-background: transform+top | on hover of img.parallax-background: img.parallax-background: transform | made with: transition · GSAP · scroll listener

```css
body .parallax-it { position: relative }
body .parallax-it .parallax-background, body .parallax-it .parallax-element { position: absolute }
body .parallax-it .parallax-background { top: 0 }
body .parallax-it .element-1 { top: 110px }
body .parallax-it .element-2 { top: 190px }
```

```js
addEventListener("scroll", throttle(callParallax, 200))
```

### [Horizontal Parallax - v1.0](https://codepen.io/jacques-dev/pen/WNvPbxW)

made with: scroll listener

```css
main { background-position: 0px -100px }
```

```js
addEventListener("scroll", function(){
```

### [Bird's Eye View](https://codepen.io/sharnajh/pen/ExjpGwr)

on scroll: img.: transform+top | made with: transition · custom properties driven by JS

```css
:root { --scale: 1.5 --y: 0 }
:root body #wrapper #image { transform: translateX(var(--x)) translateY(var(--y)) scale(var(--scale)); transition: ease-out 0.7s }
```

```js
style.setProperty("--scale", 1.6)
style.setProperty("--x", x / 2 + "px")
style.setProperty("--y", y / 2 + "px")
style.setProperty("--scale", 1)
style.setProperty("--x", 0)
style.setProperty("--y", 0)
```

### [Smooth Parallax](https://codepen.io/choogoor/pen/oNXMpRb)

held: fixed div.smooth-scroll-wrapper | on scroll: img.: transform+top ×7, div.smooth-scroll-wrapper: transform+top | on hover of img.: div.smooth-scroll-wrapper: transform | made with: position: fixed · requestAnimationFrame

```css
.smooth-scroll-wrapper { position: fixed; top: 0; will-change: transform }
.smooth-translate .sp-image { position: relative }
.smooth-translate img { position: absolute; top: 0 }
p + p { padding-top: 3rem; border-top: 1px solid rgba(255, 255, 255, 0.04) }
```

```js
requestAnimationFrame(smoothScroll)
```

### [Pure CSS Parallax Scrolling](https://codepen.io/bubblewrapped/pen/YzXLROz)

made with: 3D (perspective / preserve-3d)

```css
.wrapper { perspective: 2px }
.section { position: relative }
.parallax::after { position: absolute; top: 0; bottom: 0; transform: translateZ(-1px) scale(1.5) }
```

### [Parallax Horizontal Image Scroller -- No JS!](https://codepen.io/TharenaMelishka/pen/abOYVLx)

made with: @keyframes

```css
#proparallax { position: relative; box-shadow: 0px 8px 10px 8px grey }
#proparallax img { position: absolute }
0% { opacity: 1 }
33.33% { opacity: 1 }
33.34% { opacity: 0 }
94.43% { opacity: 0 }
94.44% { opacity: 1 }
100% { opacity: 1 }
0% { opacity: 0 }
27.77% { opacity: 0 }
27.78% { opacity: 1 }
66.67% { opacity: 1 }
```

### [Full Page Scrollify](https://codepen.io/wesp/pen/wvapRvQ)

held: fixed h1 | on scroll: span.: color+top, div.desc: transform+top | made with: position: fixed · transition

```css
h1 { position: fixed; top: 30vh; transition: top 1.4s cubic-bezier(0.22, 0.61, 0.36, 1) }
span { transition: color 1.5s ease }
section { position: relative }
.content-wrap { position: absolute }
.desc { transition: transform 1.7s cubic-bezier(0.1, 0.29, 0.5, 0.92) .3s }
.unmoved .desc { transform: translateY(100px) }
.section1.unmoved .desc { transform: translateY(50px) }
.section1 .content-wrap { top: 20vh }
.section2 .content-wrap { top: 20% }
.section3 .content-wrap { top: 5% }
.section3 .desc { margin-top: 100% }
.section4 .content-wrap { top: 15% }
```

### [Parallax Animation 404](https://codepen.io/wikyware-net/pen/GRJyJOo)

on scroll: img.ag-404_img: transform+top ×2 | on hover of img.ag-404_img: img.ag-404_img: transform+top ×2 | made with: @keyframes

```css
.ag-404_img-box { position: relative }
.ag-404_img__first { position: absolute; top: 0; -webkit-animation: an-upDown 2s infinite; -moz-animation: an-upDown 2s infinite; -o-animation: an-upDown 2s infinite; animation: an-upDown 2s infinite }
.ag-404_img__last { position: absolute; top: 0; -webkit-animation: an-upDownInvert 2s infinite; -moz-animation: an-upDownInvert 2s infinite; -o-animation: an-upDownInvert 2s infinite; animation: an-upDownInvert 2s infinite }
0% { -webkit-transform: translateY(-10px); transform: translateY(-10px) }
50% { -webkit-transform: translateY(0); transform: translateY(0) }
100% { -webkit-transform: translateY(-10px); transform: translateY(-10px) }
0% { -moz-transform: translateY(-10px); transform: translateY(-10px) }
50% { -moz-transform: translateY(0); transform: translateY(0) }
100% { -moz-transform: translateY(-10px); transform: translateY(-10px) }
0% { -o-transform: translateY(-10px); transform: translateY(-10px) }
50% { -o-transform: translateY(0); transform: translateY(0) }
100% { -o-transform: translateY(-10px); transform: translateY(-10px) }
```

### [Parallax swipe carousel](https://codepen.io/wikyware-net/pen/PoqEwvo)

on scroll: div.js-card-bg: transform ×17, div.flickity-slider: transform | made with: transition

```css
.ag-card-bg { background-position: 50%; position: absolute; top: 0; -webkit-transition: height .6s; -moz-transition: height .6s; -o-transition: height .6s; transition: height .6s }
.ag-shop-card_box { -webkit-box-shadow: 0 10px 20px 0 rgba(0, 0, 35, .25); -moz-box-shadow: 0 10px 20px 0 rgba(0, 0, 35, .25); -o-box-shadow: 0 10px 20px 0 rgba(0, 0, 35, .25); box-shadow: 0 10px 20px 0 rgba(0, 0, 35, .25); -webkit-transiti }
.ag-shop-card_body { background-position: 50%; -webkit-transition: .4s; -moz-transition: .4s; -o-transition: .4s; transition: .4s; position: relative }
.ag-shop-card-body_link { position: absolute; top: 50%; -webkit-box-shadow: 0 10px 20px 0 rgba(0, 0, 0, .35); -moz-box-shadow: 0 10px 20px 0 rgba(0, 0, 0, .35); -o-box-shadow: 0 10px 20px 0 rgba(0, 0, 0, .35); box-shadow: 0 10px 20px 0 rgba(0, 0, }
.ag-shop-card_footer { position: relative }
.ag-shop-card-footer_link { position: absolute; top: 15px }
```

### [Parallax scrolling effect using jQuery](https://codepen.io/emilio-kudo/pen/zYGdEzO)

made with: scroll() timeline

### [Generative Colour Tunnel](https://codepen.io/KeithPaul/pen/eYNEppZ)

on scroll: div.squared: transform+shadow ×37, div.squared: transform+shadow+top ×3 | made with: @keyframes · :hover · mix-blend-mode · pointer / mouse tracking · requestAnimationFrame

```css
#wrapper .squared { position: absolute; mix-blend-mode: exclusion }
.squared__1 { animation: colourize1 5s linear both infinite; animation-delay: 0.1s }
0% { box-shadow: 1px 1px 5px 0px #f90000, -1px -1px 5px 0px #f90000 }
10% { box-shadow: 1px 1px 5px 0px #f99500, -1px -1px 5px 0px #f99500 }
20% { box-shadow: 1px 1px 5px 0px #c7f900, -1px -1px 5px 0px #c7f900 }
30% { box-shadow: 1px 1px 5px 0px #32f900, -1px -1px 5px 0px #32f900 }
40% { box-shadow: 1px 1px 5px 0px #00f964, -1px -1px 5px 0px #00f964 }
50% { box-shadow: 1px 1px 5px 0px #00f9f9, -1px -1px 5px 0px #00f9f9 }
60% { box-shadow: 1px 1px 5px 0px #0064f9, -1px -1px 5px 0px #0064f9 }
70% { box-shadow: 1px 1px 5px 0px #3200f9, -1px -1px 5px 0px #3200f9 }
80% { box-shadow: 1px 1px 5px 0px #c700f9, -1px -1px 5px 0px #c700f9 }
90% { box-shadow: 1px 1px 5px 0px #f90095, -1px -1px 5px 0px #f90095 }
```

```js
addEventListener("mousemove", handleMousemove, false)
addEventListener("mouseenter", handleMousemove, false)
requestAnimationFrame(function animation() {
requestAnimationFrame(animation)
```

### [Simple parallax](https://codepen.io/manuel-pross/pen/eYNRjbG)

made with: scroll listener

```js
addEventListener('scroll', function(e) {
```

### [Bowie ★](https://codepen.io/bubuanabelas/pen/KKpNeGq)

held: sticky header | made with: position: sticky · scroll-snap · @keyframes

```css
.scroller { -ms-scroll-snap-type: y mandatory; scroll-snap-type: y mandatory }
.scroller > *:not(header) { scroll-snap-align: start }
header { position: sticky; top: 0 }
from { opacity: 1 }
50% { opacity: 0 }
to { opacity: 1 }
from { opacity: 1 }
50% { opacity: 0 }
to { opacity: 1 }
#mainHeading::before { -webkit-animation: textchange 5s linear infinite alternate; animation: textchange 5s linear infinite alternate }
0% { background-position: 0% 50% }
50% { background-position: 100% 50% }
```

### [opacity gradient overlay on parallax](https://codepen.io/marlin12/pen/bGdBLzB)

on scroll: div.title: opacity+top | made with: transition

```css
.hero { position: relative }
.title { position: absolute; bottom: 120px; opacity: 0; transition: opacity .8s linear }
.show { opacity: 1 }
```

### [Parallax Background (6 layers) using JS](https://codepen.io/Abd_Kayali/pen/YzXpNKP)

held: fixed div.parallax-container, fixed div.parallax-layer, fixed div.parallax-layer, fixed div.parallax-layer, fixed div.parallax-layer, fixed div.parallax-layer, fixed div.parallax-layer | made with: position: fixed · scroll listener · requestAnimationFrame

```css
.parallax-container { position: fixed }
.parallax-layer { position: fixed; top: 0; background-position: bottom center }
.layer-0 { top: 0PX }
.layer-1 { top: 0px }
.layer-2 { top: 0px }
.layer-3 { top: 0px }
.layer-4 { top: 0px }
.layer-5 { top: 0px }
.content { position: absolute; top: 100vh }
.coco { position: relative }
.content .coco h1 { text-transform: uppercase }
header { position:fixed }
```

```js
addEventListener("scroll", this.onScroll.bind(this))
requestAnimationFrame(this.scrollHandler.bind(this))
```

### [Last Stand](https://codepen.io/mattpopovich/pen/oNXzVpL)

made with: custom properties driven by JS · GSAP · pointer / mouse tracking · requestAnimationFrame

```css
body { position: relative }
.background { position: relative; background-position: center }
.wrapper { position: relative; margin-bottom: -10vh }
.overlay { position: absolute; top: calc(50% - 5vmin); transform: translate(-50%, -50%) }
.layer { position: absolute; top: 0; bottom: 0; background-position: center }
.fire { filter: url("#heat") }
.glow { filter: url("#glow") }
.layer--0 { transform: translateX(calc(var(--x) / 2 * 0px)) translateY(calc(var(--y) / 2 * 0px)) rotateX(calc(var(--y) / 2 * -20deg)) rotateY(calc(var(--x) / 2 * 20deg)) }
.layer--1 { transform: translateX(calc(var(--x) / 2 * 1px)) translateY(calc(var(--y) / 2 * 1px)) rotateX(calc(var(--y) / 2 * -20deg)) rotateY(calc(var(--x) / 2 * 20deg)) }
.layer--2 { transform: translateX(calc(var(--x) / 2 * 2px)) translateY(calc(var(--y) / 2 * 2px)) rotateX(calc(var(--y) / 2 * -20deg)) rotateY(calc(var(--x) / 2 * 20deg)) }
.layer--3 { transform: translateX(calc(var(--x) / 2 * 3px)) translateY(calc(var(--y) / 2 * 3px)) rotateX(calc(var(--y) / 2 * -20deg)) rotateY(calc(var(--x) / 2 * 20deg)) }
.layer--4 { transform: translateX(calc(var(--x) / 2 * 4px)) translateY(calc(var(--y) / 2 * 4px)) rotateX(calc(var(--y) / 2 * -20deg)) rotateY(calc(var(--x) / 2 * 20deg)) }
```

```js
style.setProperty('--x', start.x)
style.setProperty('--y', start.y)
addEventListener('mousemove', e => {
requestAnimationFrame(update)
```

### [Poochy Parallax](https://codepen.io/Bungle2012/pen/RwPRNQm)

held: fixed div.art--layer, fixed div.art--layer, fixed div.art--layer, fixed div.art--layer, fixed div.art--layer, fixed div.art--layer, fixed div.art--layer, fixed div.art--layer, fixed div.art--layer, fixed div.art--layer | on scroll: div.art--layer: transform+top ×10, div.art--layer: opacity | made with: position: fixed · GSAP

```css
.art { position: relative }
.art--layer { background-position: center; position: absolute; position: fixed }
#art-logo { opacity: 1 }
#art-logo span { margin-bottom: 95px }
```

### [Vanilla JS Parallax Depth Cards](https://codepen.io/rudyt7/pen/ExjVwya)

on hover of div.cardWrap: div.card: transform+shadow, div.cardBg: transform+opacity, div.cardInfo: transform+top, p.: opacity+top | made with: transition · :hover · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.cardWrap { -webkit-transform: perspective(800px); transform: perspective(800px) }
.cardWrap:hover .cardInfo { -webkit-transform: translateY(0); transform: translateY(0) }
.cardWrap:hover .cardInfo p { opacity: 1 }
.cardWrap:hover .cardInfo, .cardWrap:hover .cardInfo p { -webkit-transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1); transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1) }
.cardWrap:hover .cardInfo:after { -webkit-transition: 5s cubic-bezier(0.23, 1, 0.32, 1); transition: 5s cubic-bezier(0.23, 1, 0.32, 1); opacity: 1; -webkit-transform: translateY(0); transform: translateY(0) }
.cardWrap:hover .cardBg { -webkit-transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1), opacity 5s cubic-bezier(0.23, 1, 0.32, 1); transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1), opacity 5s cubic-bezier(0.23, 1, 0.32, 1); opacity: 0.8 }
.cardWrap:hover .card { -webkit-transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 2s cubic-bezier(0.23, 1, 0.32, 1); transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 2s cubic-bezier(0.23, 1, 0.32, 1); box-shadow: rgba(255,  }
.card { position: relative; box-shadow: rgba(0, 0, 0, 0.66) 0 30px 60px 0, inset #333 0 0 0 5px, inset rgba(255, 255, 255, 0.5) 0 0 0 6px; -webkit-transition: 1s cubic-bezier(0.445, 0.05, 0.55, 0.95); transition: 1s cubic-bezier }
.cardBg { opacity: 0.5; position: absolute; top: -20px; background-position: center; -webkit-transition: 1s cubic-bezier(0.445, 0.05, 0.55, 0.95), opacity 5s 1s cubic-bezier(0.445, 0.05, 0.55, 0.95); transition: 1s cubic-bezier(0. }
.cardInfo { position: absolute; bottom: 0; -webkit-transform: translateY(40%); transform: translateY(40%); -webkit-transition: 0.6s 1.6s cubic-bezier(0.215, 0.61, 0.355, 1); transition: 0.6s 1.6s cubic-bezier(0.215, 0.61, 0.355, 1) }
.cardInfo p { opacity: 0; -webkit-transition: 0.6s 1.6s cubic-bezier(0.215, 0.61, 0.355, 1); transition: 0.6s 1.6s cubic-bezier(0.215, 0.61, 0.355, 1) }
.cardInfo * { position: relative }
```

```js
addEventListener("mousemove", ele => {
```

### [Scrollax (parallax scroll with blocks)](https://codepen.io/Pavreally/pen/VwLvpXv)

on scroll: div.scrollax-block: transform+top | made with: scroll() timeline · transition

```css
.scrollax-wrap .scrollax-block { position: relative; transition: 0.5s ease-out }
```

### [ParallaxScroll](https://codepen.io/Artem_Lobanov/pen/QWbbNEP)

on scroll: div.: transform+opacity+top | made with: transition · scroll listener

```css
#header { opacity: 100%; transition: 0.5s ease }
```

```js
addEventListener( "scroll", function () {
```

### [Untitled](https://codepen.io/Artem_Lobanov/pen/zYGYgdx)

held: fixed div.scene, fixed header | on scroll: path.[object: transform ×15, path.[object: transform+top ×3 | made with: position: fixed · @keyframes · transition · pointer / mouse tracking

```css
header { position: fixed; top: 0; bottom: 0 }
.scene { position: fixed; top: 0; bottom: 0 }
.laye { position: absolute }
.layer { position: absolute; top: -10% }
.text { position: static; transition: 0.4s ease-out }
.layer-bg { transition: 0.4s ease-out }
.layer-1 { transition: 0.4s ease-out }
.layer-2 { transition: 0.4s ease-out }
#logo { position: absolute; top: 50%; transform: translate(-50%,-50%) }
#logo path:nth-child(2) { stroke-opacity: 0%; transform: translateX(-20px); animation: line-anim 5s infinite alternate }
#logo path:nth-child(3) { stroke-opacity: 0%; transform: translateY(20px); animation: line-anim 5s infinite alternate }
#logo path:nth-child(4) { stroke-opacity: 0%; transform: translateX(20px); animation: line-anim 5s infinite alternate }
```

```js
addEventListener('mousemove',parllax1)
addEventListener('mousemove',parllax2)
```

### [Parallax Scroll On Background Image](https://codepen.io/lylepalagar/pen/PoqoyRr)

made with: position: fixed · scroll listener

```css
section { border-bottom: 1px solid #ccc; position: relative }
section div { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.parallax { background-position: fixed; background-position: center 0 }
```

```js
addEventListener('scroll', () => {
```

### [Image Parallax Background](https://codepen.io/Julien_fovelle/pen/GRgbdve)

held: fixed div.socials | made with: position: fixed · transition · :hover · scroll listener

```css
body .socials { position: fixed; bottom: 20px }
body .socials > a { margin-bottom: 7px; opacity: 0.2; transform: scale(var(--scale, 0.8)); transition: transform 0.3s cubic-bezier(0.38, -0.12, 0.24, 1.91) }
body .socials > a:hover { --scale: 1 }
.img-move { background-position: center bottom; transition: all 0.4s ease-out }
```

```js
addEventListener("scroll", function () {
```

### [Smooth Parallax Scrolling](https://codepen.io/Gataullina/pen/qBEwOBj)

held: fixed div.square, fixed div.square, fixed div.square, fixed div.square, fixed div.square, fixed div.square, fixed div.square, fixed div.square, fixed div.square, fixed div.square | on scroll: div.square: transform+top ×19, div.square-to-top: transform+top ×9, h2.second-section-title: transform+top, p.second-section-description: transform+top | made with: position: fixed · transition

```css
.animate { -webkit-transform: translate3d(0, 200px, 0); transform: translate3d(0, 200px, 0); -webkit-transition: -webkit-transform 1s; transition: -webkit-transform 0.5s; -o-transition: transform 0.5s; transition: transform 0.5s; t }
.visible { -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0) }
#main { padding-top: 30vh; position: relative }
.arrow { margin-top: 5vh }
.second-section-title, .third-section-title { margin-top: 30vh }
.square, .square-to-top { position: fixed; transform: translate3d(0,0,0) }
.square:nth-of-type(1) { top: 30% }
.square:nth-of-type(2) { top: 60% }
.square:nth-of-type(3) { top: 20% }
.square:nth-of-type(4) { top: 10% }
.square:nth-of-type(5) { top: 50% }
.square:nth-of-type(6) { top: 40% }
```

### [Central Park Parallax](https://codepen.io/llouisetaylor/pen/ZEYPNeN)

on scroll: img.layer: transform+top, span.layer: transform+top, img.: transform+top | on hover of img.layer: img.layer: transform, span.layer: transform, img.: transform | made with: prefers-reduced-motion · pointer / mouse tracking · requestAnimationFrame

```css
.container { position: relative; transform: translate(-50%) }
.layer { position: absolute; will-change: transform }
#shadow { position: absolute; top: 69% }
```

```js
addEventListener('mousemove', (e) => {
requestAnimationFrame(() => animate())
```

### [CSS-Only Horizontal Parallax Gallery](https://codepen.io/pehaa/pen/zYxbxQg)

on scroll: img.: filter | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.horizontal-scroll-wrapper { transform: rotate(-90deg) translate3d(0,-100vh,0); transform-origin: right top; perspective: 1px; padding-bottom: 10rem }
.img-wrapper { transform: rotate(90deg); transform: rotate(90deg) translateZ(.1px) scale(0.9) translateX(0px) translateY(-3vh); transition: 1s }
.slower { transform: rotate(90deg) translateZ(-.2px) scale(1.1) translateX(0%) translateY(-10vh) }
.slower1 { transform: rotate(90deg) translateZ(-.25px) scale(1.05) translateX(0%) translateY(8vh) }
.slower2 { transform: rotate(90deg) translateZ(-.3px) scale(1.3) translateX(0%) translateY(2vh) }
.slower-down { transform: rotate(90deg) translateZ(-.2px) scale(1.1) translateX(0%) translateY(16vh) }
.faster { transform: rotate(90deg) translateZ(.15px) scale(0.8) translateX(0%) translateY(14vh) }
.faster1 { transform: rotate(90deg) translateZ(.05px) scale(0.8) translateX(0%) translateY(10vh) }
.fastest { transform: rotate(90deg) translateZ(.22px) scale(0.7) translateX(-10vh) translateY(-15vh) }
.vertical { transform: rotate(90deg) translateZ(-.15px) scale(1.15) translateX(0%) translateY(0%) }
.last { transform: rotate(90deg) translateZ(-.2px) scale(1.1) translateX(25vh) translateY(-8vh) }
.scroll-info, header { position: absolute }
```

### [Parallax & Scroll Indicator](https://codepen.io/gridsequence/pen/vYEbbNZ)

held: fixed div.progress, fixed div.youtube | on hover of a.youtube__link: a.youtube__link: color | made with: position: fixed · transition · :hover · scroll listener

```css
h2 { text-transform: uppercase }
p { text-transform: uppercase }
.container { position: relative }
.progress { position: fixed; box-shadow: inset 0 0 2px #e9e1e1; top: calc(50% - 75px) }
.progress__bar { position: absolute }
.hero { position: relative }
.hero__box { position: absolute }
.info { position: relative }
.info:after { position: absolute; top: calc(50% - 20vh) }
.info__box { box-shadow: inset 0 0 20px 10px #161414 }
.main { position: relative }
.main__title { transform: translateX(24px) }
```

```js
addEventListener('scroll', () => {
```

### [Vertical Staff Gallery with Parallax Text while Scrolling](https://codepen.io/chris_tudor/pen/yLyGGvZ)

on scroll: h2.verveine: transform+top ×8 | made with: transition · requestAnimationFrame

```css
.h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 { margin-bottom: 0.5rem }
.white-text { -moz-transition: color 0.2s ease-in; -o-transition: color 0.2s ease-in; -webkit-transition: color 0.2s ease-in }
.filter-shadow-big { -webkit-filter: drop-shadow(5px 5px 5px rgba(34,34,34,0.078)); filter: drop-shadow(5px 5px 5px rgba(34,34,34,0.078)); -webkit-filter: drop-shadow(5px 5px 5px rgba(34,34,34,0.078)); filter: drop-shadow(5px 5px 5px rgba(34 }
.box-shadow { box-shadow: 0 3px 2px -2px rgba(200,200,200,0.2) }
.staff-gallery .profile-image { padding-bottom: 50% }
.filter-shadow-small { -webkit-filter: drop-shadow(5px 5px 5px rgba(34,34,34,0.169)); filter: drop-shadow(5px 5px 5px rgba(34,34,34,0.169)) }
.staff-gallery .profile-image { padding-bottom: 35% }
```

```js
requestAnimationFrame(scrollAction)
```

### [Let's Do Some Parallax](https://codepen.io/areal_alien/pen/dyPQMWq)

made with: nothing recognised — read the code

```css
.title h1 { text-transform: uppercase }
.title h3 { text-transform: uppercase }
.parallax1 { position: relative; position: relative; background-position: center }
.parallax2 { position: relative; position: relative; background-position: center }
.overlay { position: absolute }
.parallax2 h2 { text-transform: uppercase }
.parallax3 { position: relative; position: relative; background-position: center }
```

### [Pure JS - SVG Parallax effect on mousemove](https://codepen.io/niktariy/pen/qBEYdzr)

on scroll: g.[object: transform+top ×9 | made with: pointer / mouse tracking

```js
addEventListener("mousemove", handleMouseMove)
```

### [Effect parallax mousemove](https://codepen.io/crianbluff/pen/WNbJvbz)

on scroll: img.layer: transform+top ×4 | on hover of img.layer: img.layer: transform+top ×4 | made with: pointer / mouse tracking

```css
.container { margin-top: 150px; position: relative; transform: rotateZ(-30deg) skew(25deg) scale(0.8) }
.container img { position: absolute }
.container img:nth-child(2) { opacity: 0.8 }
.container img:nth-child(3) { opacity: 0.6 }
.container img:nth-child(4) { opacity: 0.4 }
```

```js
addEventListener('mousemove', parallax)
```

### [Effect parallax scrolling clip-mask](https://codepen.io/crianbluff/pen/gObzOvE)

made with: nothing recognised — read the code

```css
section { position: relative }
section .content h2 { text-transform: uppercase }
section .content a { margin-top: 20px }
```

### [Pure JS - SVG Parallax effect on mousemove](https://codepen.io/niktariy/pen/qBExvXK)

on scroll: g.[object: transform+top ×11, path.[object: transform+top | made with: pointer / mouse tracking

```js
addEventListener("mousemove", handleMove)
```

### [Parallax Feed with rellax.js](https://codepen.io/bgebelein/pen/PowQqQx)

on hover of div.uk-card: div.uk-card: shadow | made with: 3D (perspective / preserve-3d)

```css
:root { position: relative }
uk-card { will-change: transform }
```

### [CSS Parallax Effect (3 Layers)](https://codepen.io/medienmarmelade/pen/mdypxwb)

made with: 3D (perspective / preserve-3d)

```css
.layers { perspective: 1px }
.layer { position: absolute; top: 0; bottom: 0 }
.rear { transform: translateZ(-2px) scale(3) }
.base { transform: translateZ(-1px) scale(2); top:100% }
.front { transform: translateZ(0px) scale(1); top:100% }
```

### [Text Clip-Mask](https://codepen.io/batuhangulgor/pen/yLypYyb)

made with: nothing recognised — read the code

```css
body .container section h2 { text-transform: uppercase; background-position: center center }
body .container section a { margin-top: 40px }
body .container .wood { margin-bottom: 150px }
```

### [Text Parallax on Scroll](https://codepen.io/nathanaeldsb/pen/KKwXGZN)

on scroll: li.parallax__item: transform+top ×2, li.parallax__item: transform | made with: scroll listener

```css
.parallax__section { background-position: center }
.parallax__item { border-top: 2px solid white; border-bottom: 2px solid white }
.parallax__item:nth-child(2) { border-top: none; border-bottom: none }
.parallax__list { padding-top: 7rem }
.parallax__item:nth-child(1) { padding-top: 2rem; border-top: 2px solid white; border-bottom: none }
.parallax__item:nth-child(3) { padding-bottom: 2rem; border-bottom: 2px solid white; border-top: none }
```

```js
addEventListener("scroll", function(e) {
```

### [🟢 Spotify Wrapped 2019 – 3D Parallax Effect (No Frameworks)](https://codepen.io/danielneubert/pen/mdyBKVv)

on scroll: div.layer__single: transform+top ×3 | on hover of a.button: div.layer__single: transform+top ×3 | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.layer__base { position: relative; perspective: 100rem }
.layer__single { top: 0; bottom: 0; position: absolute }
.layer__child--hide { opacity: 0 }
.layer__base { top: 0; bottom: 0; position: absolute }
.button { text-transform: uppercase; transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease }
```

### [Eye animation with Vanilla Tilt / JavaScript](https://codepen.io/typo3-freelancer/pen/WNbZrQL)

held: fixed h1, fixed center | on scroll: div.outer: transform ×2 | made with: position: fixed · @keyframes · transition · 3D (perspective / preserve-3d)

```css
.eyes { transition: all 0.2s ease-in-out }
.eyes .outer { transition: all 0.2s ease-in-out; box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.4); animation: eyemove 10s infinite; transform: perspective(1000px) }
.eyes .outer .inner { transition: all 0.2s ease-in-out; position: relative; transform: translateZ(20px); animation: eyemove-inner 10s infinite }
.eyes .outer .inner .shine { position: absolute; top: 10%; transform: rotate(15deg) }
h1, center { position: fixed; bottom: 10px }
h1 { top: 10px }
@keyframes eyemove animates width, height, overflow
@keyframes eyemove-inner animates width, height
```

### [Sidescrolling Parallax](https://codepen.io/ulyzses/pen/yLyoYZm)

made with: nothing recognised — read the code

```css
.scrolling-container { position: relative }
.static, .layer { position: absolute }
```

### [Parallax on Mouse Move GSAP](https://codepen.io/deegiialt/pen/GRgWedw)

made with: 3D (perspective / preserve-3d)

### [example wagerfield/parallax](https://codepen.io/get-web/pen/PowGJXv)

made with: nothing recognised — read the code

```css
.link { position: absolute; top: 10px; text-transform: uppercase }
```

### [Simple Parallax](https://codepen.io/masha_tatosh/pen/qBEaXmd)

made with: pointer / mouse tracking

```css
.parallax-container { position: absolute; top: -10% }
.parallax-content { position: absolute; top: calc(50% - 5rem) }
```

```js
addEventListener("mousemove", function(e) {
```

### [STRANGE PARALLAX EFFECT](https://codepen.io/dremar_design/pen/NWPRjZG)

held: fixed div.l_arrow, fixed div.r_arrow | made with: position: fixed · transition

```css
.home { position: absolute; top: 0 }
.home .l_arrow, .home .r_arrow { position: fixed; top: calc(50% - 32px) }
.content { position: absolute; top: 0; transition: all 500ms cubic-bezier(0.2, 0.8, 0.1, 0.7) }
.content .l_content, .content .r_content { top: 0; position: absolute }
.content .l_content .post, .content .r_content .post { position: absolute; top: 0 }
```

### [Parallax Welcome Page](https://codepen.io/figo-kolsteren/pen/RwNargM)

on scroll: div.: transform+top ×3, div.layer: transform ×3, div.some-space: transform+top, div.some-more-space1: transform+top | on hover of a.: div.: transform+top ×3, div.layer: transform+top ×3, div.some-space: transform+top, div.some-more-space1: transform+top, a.: background+color+top | made with: @keyframes · transition · :hover

```css
#particles-js, #parallax, .layer, .some-space, .some-more-space1 { position: absolute }
#particles-js { opacity: 0.6 }
h1 { position: absolute; top: 50%; -webkit-transform: translate3d(-50%, -50%, 0); transform: translate3d(-50%, -50%, 0) }
a { position: absolute; top: 65%; -webkit-transform: translate3d(-50%, -50%, 0); transform: translate3d(-50%, -50%, 0); transition: all 200ms ease }
.some-space { animation: rotate 18s 0.5s infinite linear reverse }
.some-more-space1 { -webkit-animation: rotate 15s 0.1s infinite linear; animation: rotate 15s 0.1s infinite linear }
0% { -webkit-transform: rotateZ(0deg) translate3d(0, 1.5%, 0) rotateZ(0deg); transform: rotateZ(0deg) translate3d(0, 1.5%, 0) rotateZ(0deg) }
100% { -webkit-transform: rotateZ(360deg) translate3d(0, 1.5%, 0) rotateZ(-360deg); transform: rotateZ(360deg) translate3d(0, 1.5%, 0) rotateZ(-360deg) }
0% { -webkit-transform: rotateZ(0deg) translate3d(0, 1.5%, 0) rotateZ(0deg); transform: rotateZ(0deg) translate3d(0, 1.5%, 0) rotateZ(0deg) }
100% { -webkit-transform: rotateZ(360deg) translate3d(0, 1.5%, 0) rotateZ(-360deg); transform: rotateZ(360deg) translate3d(0, 1.5%, 0) rotateZ(-360deg) }
#stars { box-shadow: 834px 1610px #FFF , 1574px 807px #FFF , 1462px 75px #FFF , 1466px 1743px #FFF , 1994px 122px #FFF , 395px 1428px #FFF , 150px 1729px #FFF , 648px 396px #FFF , 1096px 955px #FFF , 451px 1534px #FFF , 312px 168 }
#stars:after { position: absolute; top: 2000px; box-shadow: 834px 1610px #FFF , 1574px 807px #FFF , 1462px 75px #FFF , 1466px 1743px #FFF , 1994px 122px #FFF , 395px 1428px #FFF , 150px 1729px #FFF , 648px 396px #FFF , 1096px 955px #FF }
```

### [Parallax (Pure CSS)](https://codepen.io/alphardex/pen/qBEZELp)

made with: 3D (perspective / preserve-3d)

```css
.container { perspective: 2px }
.slide { position: relative; box-shadow: 0 0 5px 1px black }
.slide.parallax::before { position: absolute; top: 0; bottom: 0; background-position: center; transform: translateZ(-1px) scale(1.5) }
```

### [Let it Snow](https://codepen.io/rbrandonc/pen/bGNENGz)

made with: canvas 2D · requestAnimationFrame

```css
#canvas { position: absolute; top: 50vh; transform: translateX(-50%) translateY(-50%) }
#winter-town { position: absolute; top: 50vh; transform: translateX(-50%) translateY(-50%) }
```

```js
requestAnimationFrame(animate)
```

### [Banner Parallax](https://codepen.io/vivek-p/pen/rNaNQjW)

made with: nothing recognised — read the code

### [Parallax Effect with jQuery](https://codepen.io/and27cap/pen/BayBpJN)

made with: scroll() timeline

```css
.container { position: relative }
.text { top: 110vh; position: relative }
section.zoom { position: relative; background-position: center center }
section.zoom:before { position: absolute; bottom: 0 }
section.zoom .layer1 { position: absolute; bottom: 0 }
section.zoom .layer2 { position: absolute; bottom: 0 }
```

### [Parallax Move Mouse](https://codepen.io/wikyware-net/pen/rNNXJex)

on scroll: img.ag-parallax-parts: transform+top ×4, img.js-ag-parallax-main: transform+top | on hover of img.ag-parallax-main-invis: img.ag-parallax-parts: transform+top ×4, img.js-ag-parallax-main: transform+top | made with: transition · 3D (perspective / preserve-3d)

```css
.js-ag-parallax-container { position: relative }
.js-ag-parallax-main, .ag-parallax-parts { position: absolute; top: 0; bottom: 0; -webkit-transition: all .4s cubic-bezier(.06, .475, .39, .99); -moz-transition: all .4s cubic-bezier(.06, .475, .39, .99); -ms-transition: all .4s cubic-bezier(.06, .475, .39, .99); }
.ag-bonus_label { margin-top: -35px; text-transform: uppercase; position: absolute; top: 50% }
```

### [ScrollMagic + Gsap + Vue](https://codepen.io/vmarcas/pen/jOOgyNr)

made with: nothing recognised — read the code

```css
.mobile-frame .mobile-screen { padding-top: 44px; padding-bottom: 83px }
.detail-figure .image { bottom: -180px }
```

### [Parallax scrolling, different speeds of scrolling, 3D effect](https://codepen.io/maja127/pen/VwwOvpv)

made with: nothing recognised — read the code

```css
.background { background-position: top; position: relative; box-shadow: 0 50px 50px black }
h1 { position: absolute; top: 50%; transform: translate(-50%, -50%); text-transform: uppercase }
.layer { position: absolute; top: 0; background-position: center }
.content { position: relative }
.rock { position: absolute; bottom: 0; background-position: left center; -webkit-transform: scaleX(-1); transform: scaleX(-1) }
.rocks { position: absolute }
.rock-1 { top: 50% }
.rock-2 { top: 30% }
.rock-3 { bottom: 20% }
.rock-4 { bottom: 0 }
.rock-5 { bottom: 0; -webkit-transform: scaleX(-1); transform: scaleX(-1) }
.rock-6 { bottom: 30% }
```

### [Parallax example](https://codepen.io/swagtron/pen/JjjxyWv)

made with: 3D (perspective / preserve-3d)

```css
.wrapper { perspective: 2px }
.section { position: relative }
.parallax::after { position: absolute; top: 0; bottom: 0; transform: translateZ(-1px) scale(1.5) }
```

### [Efficient Scroll Zoom](https://codepen.io/CAWeissen/pen/rNNobpJ)

on scroll: img.: transform+top ×2 | made with: IntersectionObserver · scroll listener

```css
.container { text-transform: uppercase }
.container p { text-transform: none }
.image { box-shadow: 3px 10px 10px rgba(0, 0, 0, 0.25) }
```

```js
new IntersectionObserver((elements, self) => {
addEventListener("scroll", () => {
```

### [Parallax scrolling created with CSS](https://codepen.io/maja127/pen/zYYyWrq)

on scroll: div.caption: transform+opacity+top ×3 | made with: @keyframes · transition

```css
h3 { text-transform: uppercase }
.text { position: relative }
.bgimg-1, .bgimg-2 { position: relative; opacity: 0.8; background-position: center }
.caption { position: absolute; bottom: 45%; animation: text 15s linear infinite }
.caption span.border { text-transform: uppercase; transition: transform 300ms linear }
0% { transform: scale(1) translateY(0); opacity: 1 }
25% { transform: scale(0.8) translateY(20px); opacity: 0.7 }
50% { transform: scale(0.6) translateY(10px); opacity: 0.8 }
75% { transform: scale(0.8) translateY(15px); opacity: 0.7 }
100% { transform: scale(1) translateY(5px); opacity: 1 }
@keyframes text animates transform, opacity
```

### [Floating Parallax Effect with CSS Variables](https://codepen.io/benedicksahagun/pen/KKKxKgm)

on scroll: img.bottle-1: transform+top, img.bottle-2: transform+top, img.bottle-3: transform+top, img.pill-1: transform+top, img.pill-2: transform+top, img.pill-3: transform+top | made with: nothing recognised — read the code

```css
#section { background-position: center center; position: relative }
.hero { position: relative }
.objects img { position: absolute; transform: translateX(var(--tx)) translateY(var(--ty)) rotate(var(--r)) }
.objects .pill-1 { top: 25.02%; bottom: 69.47% }
.objects .pill-2 { top: 26.96%; bottom: 66.57% }
.objects .pill-3 { top: 19.59%; bottom: 76.21% }
.objects .pill-4 { top: 69.9%; bottom: 23.09% }
.objects .pill-5 { top: 73.17%; bottom: 19.37% }
.objects .pill-6 { top: 53.17%; bottom: 19.37% }
.objects .bottle-1 { bottom: 9.16% }
.objects .bottle-2 { bottom: 14.35% }
.objects .bottle-3 { top: -200px }
```

### [Mouse aware parallax text hover effect](https://codepen.io/richardevcom/pen/QWWBeGx)

made with: transition · anime.js

```css
body { padding-top: 200px }
article { position: relative; -webkit-transition: all 0.15s ease; -moz-transition: all 0.15s ease; -o-transition: all 0.15s ease; transition: all 0.15s ease; -webkit-transform: translate(0px, 0px); -moz-transform: translate(0px, 0 }
article h3 { text-transform: uppercase; margin-bottom: 20px }
```

### [Veterans Day](https://codepen.io/vetswhocode/pen/jOOxQGK)

on scroll: div.: transform ×2, div.grass: transform ×2, div.tents: transform | on hover of img.: div.: transform+top ×3, div.grass: transform+top ×2, div.branches: transform+top ×2, div.stars: transform+top, div.tents: transform+top | made with: nothing recognised — read the code

```css
#mountains { margin-top: 15vh }
#forest { margin-top: 15vh }
.grass.back { margin-top: 76vh }
.grass.front { margin-top: 83vh }
.grass img { opacity: 0.5 }
#grass-left { transform: scaleX(-1) }
.tents { margin-top: 62vh }
#tent-left { transform: scaleX(-1) }
#fire { margin-top: 75vh }
```

### [Fullpage.js with parallax effect using Paroller.js](https://codepen.io/zal_febrian/pen/WNNJoPE)

held: fixed div.right | on hover of li.: div.fp-tooltip: opacity | made with: 3D (perspective / preserve-3d)

```css
.section, .slide { top: 0; opacity: 1; background-position: center center; -webkit-transform: translate3d(0, 0, 0); -moz-transform: translate3d(0, 0, 0); -ms-transform: translate3d(0, 0, 0); -o-transform: translate3d(0, 0, 0); transform: t }
.intro { background-position: top center; position: relative }
.intro h1 { padding-top: 70px }
```

### [Parallax Tilt Effect Cards](https://codepen.io/AbubakerSaeed/pen/rNNdvqz)

on scroll: div.container: transform+top | made with: position: fixed · transition · :hover · 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking

```css
h1 { padding-top: 2rem }
.wrap { transform: perspective(100rem) }
.container { position: relative; transform: rotateX(calc(var(--rX) * 1deg)) rotateY(calc(var(--rY) * 1deg)); background-position: var(--bX) var(--bY); box-shadow: 0 0 3rem .5rem hsla(0, 0%, 0%, .2); transition: transform .6s 1s }
.container::before, .container::after { position: absolute; opacity: .3; transition: .3s }
.container::before { top: 2rem }
.container::after { bottom: 2rem }
.container--active { transition: none }
.container--2 { filter: hue-rotate(80deg) saturate(140%) }
.container--3 { filter: hue-rotate(160deg) saturate(140%) }
.abs-site-link { position: fixed; bottom: 20px }
```

```js
addEventListener('mousemove', this.handleMouseMove)
addEventListener('mouseenter', this.handleMouseEnter)
addEventListener('mouseleave', this.handleMouseLeave)
```

### [Intercepta Uruguay - One Page Site FREE TEMPLATE](https://codepen.io/designfenix/pen/VwwQGPG)

held: fixed div.hide | on scroll: div.itm: transform+opacity+top ×6 | on hover of a.navbar-brand: li.layer: transform+top ×8, img.layer-2: transform+opacity | made with: position: fixed · @keyframes · transition · :hover · mix-blend-mode

```css
body.padding-top { padding-top: 110px }
#preload { position: fixed; top: 0; bottom: 0; transition: ease all 0.3s }
#preload.hide { opacity: 0; top: -300vh; bottom: unset }
#preload:after { position: absolute; top: 50%; margin-top: -25px; -webkit-animation: rotate360 1.2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite both; animation: rotate360 1.2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite both }
.navbar { padding-top: 60px; transition: ease background 0.3s }
.navbar { padding-top: 0 }
.navbar.fixed-top { padding-top: 0; padding-bottom: 0; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1) }
.navbar .navbar-collapse { position: fixed; bottom: 0px; top: 0 }
.navbar .navbar-collapse ul { margin-top: 40px }
.navbar .navbar-collapse .nav-item .nav-link { position: relative }
.navbar .navbar-collapse .nav-item .nav-link { text-transform: uppercase }
.navbar .navbar-collapse .nav-item .nav-link:after { position: absolute; bottom: 0; transition: ease all 0.3s }
```

### [Lax.js Testing + Smooth page scrolling](https://codepen.io/StevewqDev/pen/JjjpNao)

made with: requestAnimationFrame · Web Animations API (.animate)

```css
#one, #one .container , #one .row, #two { position: relative }
#one h1 { position: relative }
.rhino { position: absolute; margin-top: -19% }
.sky { position: absolute; bottom: 0 }
.birds { position: absolute; top: 0 }
#two { margin-top: 10% }
#two { margin-top: 5% }
#two { margin-top: -4% }
```

```js
.animate({
```

### [pure css parallax](https://codepen.io/yousafkhan/pen/zYYPEOQ)

made with: transition · 3D (perspective / preserve-3d)

```css
.parallax { perspective: 10px; transition: background 1s ease }
.parallax__group { position: relative; transition: all 0.6s cubic-bezier(.47, .22, .44, .96) }
.parallax__layer { position: absolute; top: 0; bottom: 0 }
.parallax__layer--back { transform: translateZ(-3px) scale(1.3) }
.parallax__layer--base { transform: translateZ(0) }
.parallax__layer--fore { transform: translateZ(3px) scale(0.7) }
.parallax__layer--deep { transform: translateZ(-6px) scale(1.6) }
.parallax__group.view-layers { transform: translate3d(450px, 0, -30px) rotateY(2deg) }
.parallax__layer.view-layers { box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.6) }
.input-container { position: absolute; top: 0 }
```

### [Parallax Card (CSS 3D)](https://codepen.io/chingy/pen/zYYdmbz)

on scroll: div.card: transform+top | made with: transition · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.instruction { position: absolute; top: 5%; text-transform: uppercase }
.container { -webkit-transform: perspective(800px); transform: perspective(800px) }
.card { box-shadow: 20px 20px 75px rgba(0, 0, 0, 0.5); -webkit-transition: 0.1s; transition: 0.1s }
.card .card__gloss { position: absolute; top: 0; transform: translateZ(1px) }
.card .card__content > * { transform: translateZ(75px) }
.card .card__content .card__image { background-position: 50% 50% }
.card .card__content .card__name { text-transform: uppercase }
.card .card__name__image { position: absolute; top: 11.5%; transform: translateZ(1px); -webkit-filter: blur(3px); filter: blur(3px) }
.card .card__name__shadow { position: absolute; bottom: 14%; text-transform: uppercase; transform: translateZ(1px) }
```

```js
addEventListener('mousemove', (event) => {
```

### [Full Parallax for iOS CSS only](https://codepen.io/Everybodyknows/pen/abbyLOZ)

held: sticky div.parallax-image1, sticky div.parallax-image2, sticky div.parallax-image3, sticky div.parallax-image4 | made with: position: sticky

```css
html, body { position: relative }
div.parallax-image* { top: 0 }
.sticky { margin-top: -100vh; position: -webkit-sticky; position: sticky; top: 0 }
div.section-header { position: relative }
div.header-text { margin-bottom: 40px }
div.section { position: relative }
```

### [Parallax Hero on iOS using only CSS](https://codepen.io/Everybodyknows/pen/YzzQMpG)

held: fixed section.hero-image | made with: position: fixed

```css
.page { position: relative }
.hero-image { position: relative; position: fixed; top: 0 }
section.main { position: relative }
```

### [Skate Section Header + Parallax TweenMax + Clip-path](https://codepen.io/designfenix/pen/oNNwpWz)

held: fixed p.dev | on scroll: div.cross: transform ×3, div.hash: transform ×2, div.mask: clip-path, img.layer-1: transform, img.layer-2: transform, img.layer-3: transform | on hover of a.btn: div.cross: transform+top ×3, div.hash: transform+top ×2, a.btn: transform+shadow+top, div.mask: clip-path, img.layer-1: transform+top, img.layer-2: transform+top | made with: position: fixed · @keyframes · transition · :hover · clip-path · mask

```css
.dev { position: fixed; top: 0 }
body:before { position: fixed; top: 0; bottom: 0; opacity: 1; transition: ease opacity 0.3s }
body:after { position: fixed; top: 50%; margin-top: -25px; animation: rotate-360 0.9s infinite ease; transition: ease opacity 0.3s }
body.loaded:before, body.loaded:after { opacity: 0 }
section { position: relative }
section h1 { margin-top: 130px; margin-bottom: 50px; animation-delay: 0.3s }
section .description { margin-bottom: 50px; animation-delay: 0.4s }
section .btn { transition: ease all 0.4s; animation-delay: 0.5s }
section .btn:hover { box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1); transform: translatey(-10px) }
section .mask { position: absolute; top: 0; bottom: 0; animation: clip-path ease 20s infinite both; animation-delay: 0.4s; -webkit-clip-path: circle(0 at 100% 0); clip-path: circle(0 at 100% 0) }
section .mask:after { position: absolute }
section .layers { position: absolute; top: 0 }
```

### [Bootstrap Carousel Parallax Animation Effects](https://codepen.io/wirkawayan/pen/XWWgjWw)

on scroll: div.carousel-item: transform | made with: transition

```css
.hero-carousel .carousel-item .carousel-image { transform: scale(1) translateX(0); transition: all 0.6s }
.hero-carousel .carousel-item.carousel-item-next .carousel-image, .hero-carousel { transform: scale(1.3) translateX(-50%) }
.hero-carousel .carousel-item.carousel-item-prev .carousel-image, .hero-carousel { transform: scale(1.3) translateX(50%) }
.hero-carousel .carousel-item.carousel-item-next.carousel-item-left .carousel-im { transform: scale(1) translateX(0) }
.hero-carousel .carousel-item .carousel-image { background-position: center center }
```

### [LandingPage com parallax](https://codepen.io/aurileide/pen/oNNWLPb)

made with: position: fixed · transition · :hover

```css
#navbar { transition: 0.4s; position: fixed; top: 0 }
#navbar #logo { transition: 0.4s }
.parallax { background-position: center }
.parallax-1 { padding-top: 200px; padding-bottom: 200px; position: relative; background-position: top center }
.parallax-2 { padding-top: 200px; padding-bottom: 200px; position: relative; background-position: center center }
.parallax-3 { padding-top: 200px; padding-bottom: 200px; position: relative; background-position: center center }
.parallax-4 { padding-top: 200px; padding-bottom: 200px; position: relative; background-position: center center }
.parallax h1 { text-transform: uppercase }
.parallax h2 { text-transform:uppercase; opacity:.9 }
.parallax h3 { text-transform: uppercase }
.first-character { padding-top: 4px }
.section-overlay-mask { position: absolute; top: 0; opacity: 0.70 }
```

### [Jarallax React](https://codepen.io/_nK/pen/mddWddr)

on scroll: div.jarallax-wrap: shadow+top | made with: transition · :hover

```css
.section-copy { padding-top: 50px }
.eyebrow { text-transform: uppercase }
.jarallax-wrap { position: relative; margin-bottom: 24px; box-shadow: 0 18px 40px rgba(24, 34, 45, 0.08); transition: box-shadow 0.15s ease; transform: translateX(0) }
.jarallax-wrap:hover { box-shadow: 0 22px 44px rgba(24, 34, 45, 0.1) }
.hero::after { position: absolute; inset: 0 }
.hero-content { position: relative }
.field label { margin-bottom: 8px }
.btn { transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease }
```

### [Ultra Zoom Effect (Apple Inspired)](https://codepen.io/jouanmarcel/pen/wvvGqNp)

on scroll: text.[object: transform | on hover of a.ref: text.[object: transform | made with: @keyframes · :hover · clip-path

```css
5% { transform: scale(1, 1) }
100% { transform: translate(-7750px, -600px) scale(800, 800) }
5% { transform: scale(1, 1) }
100% { transform: translate(-7750px, -600px) scale(800, 800) }
.background { background-position: center center; -webkit-clip-path: url(#clipping); clip-path: url(#clipping); -webkit-animation: 6s zoom-background infinite cubic-bezier(1, 0, 0.75, 1) alternate; animation: 6s zoom-background infini }
svg { position: absolute; top: -100% }
#text { -webkit-animation: 6s zoom-text infinite cubic-bezier(1, 0, 0.5, 1) alternate; animation: 6s zoom-text infinite cubic-bezier(1, 0, 0.5, 1) alternate }
.ref { position: absolute; bottom: 10px }
@keyframes zoom-background animates background-size
@keyframes zoom-text animates transform
```

### [Parallax Text](https://codepen.io/istellar/pen/Vwwazrv)

made with: @keyframes

```css
body { padding-top: 4rem }
0% { transform: translate(0) }
10% { transform: translate(-0.1rem, 0.1rem) }
20% { transform: translate(-0.2rem, -0.1rem) }
30% { transform: translate(0.1rem, 0.2rem) }
40% { transform: translate(0.1rem, -0.1rem) }
to { transform: translate(0) }
.title-target { animation: title-target 0s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite }
.title-target:before, .title-target:after { position: absolute; top: 0; opacity: 0.8 }
.title-target:after { animation: title-target 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite }
.aberration:before { animation: title-target 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite }
@keyframes title-target animates transform
```

### [Parallax effect](https://codepen.io/jjsalgado/pen/KKKzdBm)

made with: transition · pointer / mouse tracking

```css
.circle { position: absolute; top: 0; bottom: 0; transition: all 100ms linear }
```

```js
addEventListener("mousemove" , (e) => {
addEventListener("mouseleave", (e) => {
```

### [Hernani](https://codepen.io/Doble_papi/pen/yLLYYgp)

held: fixed ul.nav | made with: position: fixed · :hover · 3D (perspective / preserve-3d)

```css
h1, p { margin-bottom: 1.5em }
.nav { position: fixed; bottom: 1em; transform: translateX(-50%) }
.acto { position: relative }
.acto__bg { position: absolute; top: 0; bottom: 0 }
.actos { position: absolute; perspective: 300px }
```

### [Animate Elements On Scroll With Vanilla Javascript](https://codepen.io/WaelYasmina/pen/bGbXGdO)

held: fixed div.square | on scroll: div.square: transform+top | made with: position: fixed · scroll listener

```css
.square { position: fixed }
```

```js
addEventListener('scroll', () => {
```

### [Parallax mask img](https://codepen.io/natjo/pen/dybBEbo)

on scroll: img.: transform+top ×3 | made with: scroll() timeline · clip-path · 3D (perspective / preserve-3d) · scroll listener

```css
p { margin-bottom: 20px }
figure { margin-bottom: 20px }
figure.polygone { -webkit-clip-path: polygon(100% 20%, 0 0, 0 80%, 100% 100%); clip-path: polygon(100% 20%, 0 0, 0 80%, 100% 100%) }
figure img { transform: translateZ(0); transform: translate3d(0,0,0); transform: rotate(0.0001deg); perspective: 1000; will-change: transform }
```

```js
addEventListener("scroll", _onscroll, { passive: true })
```

### [jQueryで奥行きのある背景スクロールを作ってみる](https://codepen.io/Katsunari/pen/RwbmmRg)

made with: scroll() timeline

### [pl img](https://codepen.io/ywsyip/pen/ExYMyeM)

on scroll: img.img-parallax: transform+top | made with: nothing recognised — read the code

```css
.block { position: relative }
.img-parallax { position: absolute; top: 0; transform: translate(-50%,0) }
.green-box { position: relative; top: 50%; transform: translateY(-50%) }
```

### [Parallax Image Slivers](https://codepen.io/f1l1/pen/ExYrKdR)

held: fixed div.container | on scroll: img.image2: transform+top, img.image3: transform+top | made with: position: fixed · scroll listener

```css
.container { position: fixed }
.image1 { position: absolute }
.image2 { position: absolute }
.image3 { position: absolute }
.image4 { position: absolute }
.image5 { position: absolute }
.image6 { position: absolute }
.image7 { position: absolute }
.image8 { position: absolute }
.image9 { position: absolute }
.image10 { position: absolute }
.image11 { position: absolute }
```

```js
addEventListener('scroll', function()
```

### [Effetto Parallax (BS4)](https://codepen.io/robertoalecci/pen/dybgRoO)

made with: nothing recognised — read the code

```css
.parallax { background-position: center }
```

### [CSS Parallax test](https://codepen.io/erland/pen/bGbmbOv)

made with: 3D (perspective / preserve-3d)

```css
main { margin-top: 10vh }
.c-parallax__container { position: relative; perspective: 8px }
.c-parallax__container__wrapper__layer, .c-parallax__container__wrapper__layer-- { position: absolute }
.c-parallax__container__wrapper__layer--1 { transform: translateZ(-5px) scale(1.625) }
.c-parallax__container__wrapper__layer--2 { transform: translateZ(-2px) scale(1.25) }
.c-parallax__container__wrapper__layer--3 { transform: translateZ(0px) scale(1) }
```

### [css only (fake) parallax scrolling effect](https://codepen.io/andersway/pen/XWrBgEg)

made with: nothing recognised — read the code

```css
.parallax { background-position: center }
```

### [Typewriter - How Wild - Pure CSS](https://codepen.io/mmalmberg95/pen/OJLEoBg)

on scroll: div.quote: transform | made with: @keyframes

```css
.bg { position: relative; background-position: 0 20%; animation: shift 45s linear infinite }
.quote { position: absolute; top: 50%; transform: translate(-50%, -50%); animation: typewriter 6.5s steps(50) 2s 1 normal both, blinkTextCursor .5s steps(40) 18 normal forwards }
from { background-position: 0 20% }
to { background-position: 100% 20% }
@keyframes shift animates background-position
@keyframes typewriter animates width
@keyframes blinkTextCursor animates border-right-color
```

### [CSS - Frosted Glass Parallax Effect (v2)](https://codepen.io/bernesto/pen/LYPdJJb)

made with: transition · :hover

```css
.n-sf-feature { border-top: 5px solid #333; border-bottom: 20px solid #333; filter: drop-shadow(0px 20px 10px rgba(0, 0, 0, 0.3)) }
.n-sf-feature-bg { background-position: center }
.n-sf-feature-bg-blur { position: absolute; -webkit-filter: blur(2em); -moz-filter: blur(2em); -o-filter: blur(2em); -ms-filter: blur(2em); filter: blur(2em); opacity: 0.85 }
.n-sf-feature-bg-container { position: relative }
.n-sf-feature-container-image, .n-sf-feature-container-thumb { background-position: center }
.n-sf-feature-bg-blur-block { position: relative }
.n-sf-feature-bg-blur-block > div { position: relative }
.n-sf-feature-bg-blur-block:before { position: absolute; background-position: center; -webkit-filter: blur(2em); -moz-filter: blur(2em); -o-filter: blur(2em); -ms-filter: blur(2em); filter: blur(2em) }
.n-sf-feature-header { position: relative; margin-top: 2em }
.n-sf-feature-content { position: relative; top: 0; bottom: 0 }
.n-sf-feature-footer { position: relative; margin-bottom: 2em }
.n-sf-feature-header h1 { text-transform: uppercase }
```

### [Intersection Observer parallax](https://codepen.io/creme/pen/eYOeqez)

on scroll: img.: transform+top ×2 | made with: GSAP · IntersectionObserver

```css
.container { position: relative }
.container > img { -o-object-position: center; object-position: center }
p + p { margin-top: 4rem }
```

```js
new IntersectionObserver(intersectionCallback, observerOptions)
```

### [Parallax recipe](https://codepen.io/chofia/pen/YzKrMVO)

made with: nothing recognised — read the code

```css
.caption { position: absolute; top: 40% }
.logo { position: relative; background-position: center }
.parallax { position: relative; background-position: center }
h3 { text-transform: uppercase }
```

### [Multi parallax mouse movements](https://codepen.io/magnustt/pen/vYBeRQd)

on scroll: div.slide: transform+top ×2, img.: transform+top | on hover of img.: div.slide: transform+top ×2, img.: transform | made with: GSAP

```css
#container { position: relative }
.one { position: absolute }
.two { position: absolute }
```

### [#CodepenChallenge Think Small: Hand-drawn Parallax Badge](https://codepen.io/takaneichinose/pen/jONGYMb)

made with: transition

```css
#area { position: absolute; top: 50%; box-shadow: 0 8px 20px #000000; transform: translate(-50%, -50%) }
.bg { position: absolute; top: 0 }
.house, .trees, .bushes, .stone_flower, .fence { position: absolute; top: 50%; transition: top 400ms ease-out, left 400ms ease-out }
.event-mask { position: absolute; top: 0 }
```

### [IphoneX Mockup](https://codepen.io/HamidZiadzadeh/pen/LYPjQLE)

held: fixed div.circle, fixed div.square, fixed footer.page__footer, fixed div.modal | on scroll: div.circle: transform, div.square: transform | on hover of div.phone__btn: div.circle: transform, div.square: transform | made with: position: fixed · @keyframes · transition · :hover · GSAP · pointer / mouse tracking

```css
.page__content { position: relative }
.page__footer { position: fixed; bottom: 0; transition: 0.3s ease all; will-change: background-color }
.phone { position: relative; -webkit-animation: phoneAnime 0.5s ease forwards; animation: phoneAnime 0.5s ease forwards; box-shadow: 0 35px 60px -24px rgba(0, 0, 0, 0.4) }
.phone::before, .phone::after { position: absolute }
.phone::before { top: 50px }
.phone::after { bottom: 50px }
.phone__body { position: relative }
.phone__notch { position: absolute; top: 8px }
.phone__speaker { position: absolute; top: 6px; transform: translateX(-50%) }
.phone__speaker::before { position: absolute; top: 1px; border-top: 1px dashed #020409 }
.phone__speaker::after { position: absolute }
.phone__camera { position: absolute; top: 3px }
```

```js
addEventListener('mousemove', this.parallaxSelect)
```

### [#CodepenChallenge SVG Polygon Tree: Home Page Parallax Design](https://codepen.io/takaneichinose/pen/RwbgKqd)

made with: nothing recognised — read the code

```css
.forest, .tree, .text { position: absolute; top: 0 }
.forest > .content { background-position: center }
svg path:nth-child(odd) { transform: rotate(2deg) }
```

### [Particles](https://codepen.io/ciprian/pen/dybWEbM)

held: fixed div | made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```js
requestAnimationFrame(update)
addEventListener('mousemove', onMousemove, false)
```

### [Parallax Effect](https://codepen.io/adefful46/pen/QWLvYvJ)

held: fixed div.inner-container, fixed div.inner-container, fixed div.inner-container | on scroll: div.inner-container: transform+top | made with: position: fixed · transition · :hover · 3D (perspective / preserve-3d)

```css
.container { position: absolute }
.container:nth-child(1) { top: 0 }
.container:nth-child(1) .inner-container { background-position: center center }
.container:nth-child(2) { top: 100vh }
.container:nth-child(3) { top: 200vh }
.inner-container { position: fixed; top: 0; background-position: center center; box-shadow: 0 0 10px rgba(0, 0, 0, 0.4); transition: 0.5s }
.inner-container:not(:hover) { transform: perspective(100vh) rotateX(-5deg) }
h1 { text-transform: uppercase }
```

### [parallax webpage(HTML, SCSS)](https://codepen.io/alibalouchi/pen/BaBWKgX)

made with: nothing recognised — read the code

### [Parallax (HTML, CSS)](https://codepen.io/alibalouchi/pen/WNexjRR)

made with: nothing recognised — read the code

### [Like/DisLike with image Parallax](https://codepen.io/OlgaKoplik/pen/RwbWZeW)

on scroll: img.ocean: transform+top, img.lemons: transform | on hover of img.ocean: img.ocean: transform+top, img.lemons: transform+top | made with: transition · :hover

```css
.content { position: relative }
.content:after { position: absolute; top: 5% }
button { transition: .3s }
.imgs { position: relative }
img { transition: .05s }
.ocean { box-shadow: 0 0 40px rgba(0,0,0,0.2) }
.lemons { position: absolute; top: 20%; box-shadow: 0 0 20px rgba(0,0,0,0.4) }
.fa-instagram { position: absolute; top: 3% }
.fa-instagram:hover { transition: all .1s linear }
```

### [React - Parallax tilt hover effect - react-parallax-tilt 👀](https://codepen.io/marko424/pen/voVPmY)

made with: 3D (perspective / preserve-3d) · requestAnimationFrame

```css
.parallax-tilt-effect { margin-top: 10vh }
.parallax-tilt-effect .inner-element { transform: translateZ(40px) }
```

```js
requestAnimationFrame(this.renderFrame)
```

### [Cards with Rellax.js](https://codepen.io/Ishrat_Pinky/pen/LwebNW)

on scroll: div.card1: transform+top, div.card2: transform+top, div.card3: transform+top, div.card4: transform+top, div.card5: transform+top, div.girl: transform+top | made with: nothing recognised — read the code

```css
.card1 { position: absolute; top: 60% }
.card2 img { position: absolute; top: 0 }
.card3 img { position: absolute; top: 20% }
.card4 img { position: absolute; top: 120% }
.card5 { position: absolute; top: 90% }
.girl { position: absolute; top:20% }
.letter1 { position: absolute; top: 150% }
.letter2 { position: absolute; top: 230% }
.letter3 { position: absolute; top: 250% }
.letter4 { position: absolute; top: 300% }
.letter5 { position: absolute; top: 310% }
.letter7 { position: absolute; top: 180% }
```

### [Bootstrap CSS Parallax](https://codepen.io/engza/pen/BXJKmv)

made with: nothing recognised — read the code

```css
[class*=bg-img-] { background-position: center; opacity: 0.75; position: relative }
.bg-none, .bg-dark { opacity: 1 }
.card { margin-top: calc(-3.75rem / 2); position: absolute; top: 50% }
```

### [word parallax using rellax](https://codepen.io/Ishrat_Pinky/pen/zgPgxe)

on scroll: div.letter1: transform+top, div.letter2: transform+top, div.letter3: transform+top, div.letter4: transform+top, div.letter5: transform+top, div.letter6: transform+top | made with: nothing recognised — read the code

```css
.letter1 { position: absolute; top:30% }
.letter2 { position: absolute; top:0 }
.letter3 { position: absolute; top:35% }
.letter4 { position: absolute; top:0 }
.letter5 { position: absolute; top:50% }
.letter6 { position: absolute; top:60% }
.letter7 { position: absolute; top:98% }
.letter8 { position: absolute; top:120% }
.letter9 { position: absolute; top:150% }
.letter10 { position: absolute; top:170% }
.letter11 { position: absolute; top:200% }
.box1 { position: absolute; top: 40%; transform: rotate(45deg) }
```

### [Parallax div element's scrolling effect with jQuery using CSS transform](https://codepen.io/webmadewell/pen/EqwxEJ)

held: fixed div.intro | on scroll: div.column: transform+top | made with: position: fixed · requestAnimationFrame

```css
.webmadewell { background-position: center }
.intro { position: fixed; top: 0 }
.section { position: relative }
```

```js
requestAnimationFrame(function() {
```

### [parallax-scroll](https://codepen.io/arneelus777/pen/KOvNJv)

held: fixed nav.nav-bar | on hover of li.: a.: color | made with: position: fixed · :hover · Web Animations API (.animate)

```css
#container, #works, #page, #about { position: relative }
#container .back-img { background-position: center center; position: absolute }
#container .nav-bar { position: fixed; top: 0 }
.nav-bar ul li a { text-transform: uppercase }
#works .second-img { background-position: center center; position: absolute }
#page .third-img { background-position: center center; position: absolute }
#about .fourth-img { background-position: center center; position: absolute }
#container .title, #works .title, #page .title, #about .title { position: relative }
```

```js
.animate({
```

### [Parallax Illustration w/ DeviceOrientationEvent](https://codepen.io/dsenneff/pen/KOqKzx)

made with: transition · :hover · clip-path · custom properties driven by JS · requestAnimationFrame

```css
#dog-illo { position: absolute; top: 50%; transform: translate(-50%, -50%) }
#dog-illo div { padding-bottom: 124% }
#dog-illo div svg #tile { transform: rotate(10deg) translateX(calc(-1 * var(--x) * .25)) translateY(calc(-1 * var(--y) * .25)); transition: transform 0.25s ease; will-change: transform }
#dog-illo div svg #bowl { transform: rotate(10deg) translateX(calc(-1 * var(--x) * .35)) translateY(calc(-1 * var(--y) * .35)); transition: transform 0.25s ease; will-change: transform }
#dog-illo div svg #body { transform: translateX(calc(var(--x))) translateY(calc(var(--y))); transition: transform 0.25s ease; will-change: transform }
#dog-illo div svg #head { transform: rotate(-20deg); transform: rotate(calc((var(--r) * -.4) - 20deg)); transition: transform 0.25s ease; will-change: transform }
#dog-illo div svg #pupil-l, #dog-illo div svg #pupil-r { transform: translateX(calc(var(--x) * -.1)) translateY(calc(var(--y) * 0)); transition: transform 0.25s ease; will-change: transform }
#dog-illo div svg #arm-l { transform: rotate(-12deg); transition: transform 0.25s ease; will-change: transform }
#dog-illo div svg #arm-r { transform: rotate(4deg); transition: transform 0.25s ease; will-change: transform }
#dog-illo div svg #drool-l-1 { transform: translateX(calc(var(--x) * .5)) translateY(calc(var(--y) * .5)); transition: transform 0.5s ease; will-change: transform }
#dog-illo div svg #drool-l-2 { transform: translateX(calc(var(--x) * .25)) translateY(calc(var(--y) * .25)); transition: transform 0.5s ease; will-change: transform }
#dog-illo div svg #drool-r-1 { transform: translateX(calc(var(--x) * -.6)) translateY(calc(var(--y) * .7)); transition: transform 0.5s ease; will-change: transform }
```

```js
requestAnimationFrame(function() {
style.setProperty('--x', -horz + "px")
style.setProperty('--y', -vert + "px")
style.setProperty('--r', rot + "deg")
```

### [beautiful image section with parallax and text center](https://codepen.io/rohanrit/pen/KOaamw)

made with: mix-blend-mode

```css
.bisp_container { background-position: center; position: relative }
.bisp_parallax { position: absolute; bottom: 0; background-position: top center; transform: translate(0px, 319.805px) }
.bisp_row { position: relative; background-position: center }
.bisp_column { position: relative; background-position: center; mix-blend-mode: unset!important }
.bisp_module { -webkit-animation-duration: .2s; -moz-animation-duration: .2s; -o-animation-duration: .2s; animation-duration: .2s; -webkit-animation-timing-function: linear; -moz-animation-timing-function: linear; -o-animation-timing-f }
.bisp_image { filter: opacity(75%) blur(5px) }
.bisp_imgwrap { position: relative; box-shadow: 0px 40px 40px 0px rgba(232,170,0,0.7) }
.bisp_imgwrap img { position: relative; -webkit-filter: saturate(150%) contrast(1.15) brightness(101%); filter: saturate(150%) contrast(1.15) brightness(101%) }
```

### [Parallax Animation](https://codepen.io/jenishhrestha/pen/BXQMom)

on scroll: svg.[object: transform+top ×10, svg.[object: transform ×2, div.sutc-image: transform | on hover of img.: svg.[object: transform+top ×9, svg.[object: transform ×3, div.layer: transform ×3, div.sutc-image: transform | made with: @keyframes · 3D (perspective / preserve-3d)

```css
.sutc-2018 { position: relative }
.layer { position: absolute; top: 0 }
.confetti { position: absolute; top: 30px; bottom: 30px }
.hero { position: relative }
.layer svg { position: absolute }
.confetti--curly.rotate { top: -1%; transform: rotate(86deg); animation: float 3s infinite }
.confetti--bigHalfCircle { top: 5%; animation: rotation 4s infinite }
.confetti--bigcircle { top: 6%; animation: floatCircleTer 4s infinite }
.confetti--halfCircle { top: 9%; animation: rotationSec 4s infinite }
.confetti--triangle.rotate117 { top: 12.5%; transform: rotate(117deg); animation: vibrate-2 2s linear infinite both }
.confetti--triangle.rotate26 { top: 16%; transform: rotate(26deg); animation: vibrate-1 2s linear infinite both }
.confetti--circle { top: 36%; animation: floatCircleSec 4s infinite }
```

### [Fast & Furious Presents: Hobbs & Shaw](https://codepen.io/GEmbaid/pen/ymagXM)

on hover of img.: div.: transform ×2 | made with: nothing recognised — read the code

### [Effect parallax on mouse move](https://codepen.io/crianbluff/pen/MNjjrz)

on hover of li.layer: li.layer: transform+top ×4, li.layer: transform | made with: nothing recognised — read the code

### [Starry night parallax](https://codepen.io/GRA0007/pen/aeZWqy)

on scroll: div.star: transform ×174, div.star: transform+top ×11 | made with: transition

```css
.star { position: absolute; transition: transform .3s; box-shadow: 0 0 5px 0 rgba(255,255,255,.7) }
.star.big { transform: rotate(45deg) }
```

### [SVG Parallax on Hover](https://codepen.io/borntofrappe/pen/voGOvw)

made with: pointer / mouse tracking · requestAnimationFrame

```js
requestAnimationFrame(animate)
addEventListener('mousemove', handleMove)
```

### [Parallax materialize](https://codepen.io/crianbluff/pen/dxMPdR)

on scroll: img.: transform+top ×2 | made with: nothing recognised — read the code

### [Multiple Layer Parallax Effect For E Commerce Hero Image](https://codepen.io/imshashankdogra/pen/NQxQJV)

held: fixed div, fixed div, fixed div.logo, fixed div.yellowside, fixed div | on scroll: div.: transform+top ×2, div.logo: transform+top, div.yellowside: transform+top | made with: position: fixed · scroll listener

```css
.header { position: relative }
#parallax-container { position: relative }
.yellowside { background-position: right !important }
#parallax-container div { position: fixed; //top: 50px; background-position: center; transform: translateY(0px) }
#content { position: relative }
```

```js
addEventListener('scroll', () => {
```

### [Rellax JS Demo](https://codepen.io/nikspatel/pen/aedyvd)

on scroll: div.one: transform+top, div.two: transform+top, div.three: transform+top | made with: nothing recognised — read the code

### [3d mousemove parallax](https://codepen.io/crianbluff/pen/QejeJW)

on scroll: img.layer: transform+top ×4 | on hover of img.layer: img.layer: transform+top ×3, img.layer: transform | made with: pointer / mouse tracking

```css
section { position: relative }
section .bg { bottom: -50px; position: absolute; top: -50px }
section .bg img { position: absolute; top: 0 }
section img { position: absolute }
section img.girl { bottom: -40px }
```

```js
addEventListener('mousemove', parallax)
```

### [Fixed footer reveal](https://codepen.io/crianbluff/pen/gVaVoB)

held: fixed footer.fixed-footer | made with: position: fixed

```css
section { position: relative }
.margin-400 { margin-bottom: 400px }
section img { position: absolute; top: 0 }
footer { bottom: 0; position: fixed; text-transform: uppercase }
```

### [Mouse move 3d parallax effect](https://codepen.io/envoy47/pen/OKVyer)

on hover of a.active: a.active: color, img.img-1: transform+top, img.img-2: transform+top, img.img-3: transform+top, img.img-4: transform+top, div.ground: transform+top | made with: transition · :hover

```css
#scene { position: absolute; bottom: 10% }
.img-3 { margin-top: -3% }
.img-4 { margin-top: 7% }
.ground { margin-top: 19% }
.img-5 { margin-top: -17% }
.logo { margin-top: 35px }
.menu { margin-top: 40px }
.menu a { transition: color 0.3s ease }
.menu a.active { border-bottom: 2px solid #AFC2ED; padding-bottom: 5px }
.top-info { margin-top: 80px }
.info { margin-top: 30px }
.prime-btn { box-shadow: none; transition: background-color 0.3s ease }
```

### [Smooth Scroll and Parallax](https://codepen.io/jguerra/pen/JgoMqw)

held: fixed div.parallax, fixed div.hero-image | on scroll: div.parallax: transform+top, div.hero-image: transform+top | made with: position: fixed · requestAnimationFrame

```css
.hero-treatment { position: relative }
.hero-treatment .hero-image { background-position: center; position: fixed; top: 0 }
.hero-treatment .parallax { position: fixed; top: 40% }
section:not(.hero-treatment) { position: relative }
```

```js
requestAnimationFrame(scrollLoop)
```

### [the moon through a window](https://codepen.io/elecweb/pen/dBEyXx)

on scroll: div.window: transform | made with: clip-path · 3D (perspective / preserve-3d) · custom properties driven by JS · requestAnimationFrame

```css
:root { --window-shadow-left-clip-path: 0px; --window-shadow-one-clip-path: 0px; --window-shadow-two-clip-path: 0px; --window-shadow-three-clip-path: 0px; --window-shadow-four-clip-path: 0px; --window-shadow-right-clip-path: 0px }
body { box-shadow: inset 0 10px 20px rgba(0, 0, 0, 0.3) }
body:after { top: -20px; bottom: -20px; position: absolute; transform: perspective(800px) rotateY(var(--window-rotateY)) rotateX(var(--window-rotateX)); clip-path: polygon(calc(50% - 116px) calc(50% - 143px), calc(50% + 192px) calc(5 }
.window { background-position: 50%; box-shadow: 0 0 40px rgba(79, 107, 191, 0.8), 0 35px 20px rgba(79, 107, 191, 0.15); transform: skewX(-15deg) perspective(800px) rotateY(var(--window-rotateY)) rotateX(var(--window-rotateX)); pos }
.window:before { position: absolute; top: 50%; transform: translate(calc(-50% + var(--bg-x)), calc(-50% + var(--bg-y) + var(--window-frame-y))) skewX(15deg) perspective(300px) rotateY(var(--window-rotateY)) rotateX(var(--window-rotateX)) }
.window:after { position: absolute; bottom: 0px; box-shadow: inset 0 1px 1px rgba(60, 97, 200, 0.4); opacity: 0 }
.window-shadow:before { position: absolute; top: 0; bottom: 0; clip-path: polygon(var(--window-shadow-one-clip-path) 0, var(--window-shadow-two-clip-path) 0, var(--window-shadow-three-clip-path) 100%, var(--window-shadow-four-clip-path) 100%) }
.window-shadow:after { position: absolute; top: 0; bottom: 0; clip-path: polygon(0 var(--window-shadow-y-one-clip-path), 100% var(--window-shadow-y-two-clip-path), 100% var(--window-shadow-y-three-clip-path), 0 var(--window-shadow-y-four-clip- }
```

```js
style.setProperty("--bg-x", `${bgPosX}px`)
style.setProperty("--bg-y", `${bgPosY}px`)
style.setProperty( "--window-shadow-one-clip-path",
style.setProperty("--window-shadow-two-clip-path", shadowXClipPath)
style.setProperty( "--window-shadow-three-clip-path",
style.setProperty("--window-shadow-four-clip-path", "0px")
style.setProperty( "--window-shadow-two-clip-path",
style.setProperty("--window-shadow-four-clip-path", shadowXClipPath)
```

### [Parallax Carousel with Swiper](https://codepen.io/Xyfer/pen/rEbxWV)

made with: nothing recognised — read the code

```css
.swiper-container { position: relative }
.swiper-wrapper { position: relative; transition-property: transform; transition-property: transform,-webkit-transform }
.swiper-slide { position: relative; transition-property: transform; transition-property: transform,-webkit-transform }
.background { background-position: center }
```

### [parallax Header](https://codepen.io/hassanazzam/pen/MMLOMw)

on hover of a.header-cta: a.header-cta: background+color | made with: transition · :hover · scroll listener

```css
.header { position: relative }
.header::before { position: absolute; top: 0 }
.header-content { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.header-logo { text-transform: uppercase; margin-bottom: 20px }
.header-cta { margin-top: 20px; text-transform: uppercase; transition: background-color 0.2s ease, color 0.2s ease }
```

```js
addEventListener('scroll', e => {
```

### [Simple Parallax using Rellax.js](https://codepen.io/madieja/pen/rEQqYb)

on scroll: div.box: transform+top ×5, div.container: transform+top | on hover of a.: a.: color | made with: transition

```css
.cont { position: relative; top: 19% }
.box { padding-bottom: 30% }
```

### [Parallax](https://codepen.io/hurtado-nayza/pen/ZdMNdW)

made with: nothing recognised — read the code

### [Parallax without Js testing](https://codepen.io/schrodd/pen/JQBLwz)

made with: 3D (perspective / preserve-3d)

```css
.reg { position: relative }
.px::before { top: 0; position: absolute; transform: translateZ(-4px) scale(5) }
body { perspective: 1px }
```

### [Kanji / Hànzì calligraphy SVG draw with shoes parallax](https://codepen.io/AlaricBaraou/pen/agEeKY)

held: fixed h1, fixed svg.[object, fixed div, fixed div.topress, fixed span, fixed a, fixed a | on scroll: svg.[object: transform+top, img.: transform+opacity+top, img.: transform+opacity, div.topress: transform+top | on hover of img.: h1.: transform+opacity+top, div.topress: transform+top, span.: transform+opacity | made with: position: fixed · @keyframes · GSAP

```css
div#walkbtn::after { position: absolute; top: -4px }
div#walkbtn.active::after { animation: spin 1s linear infinite }
#ad { opacity:0; position: fixed; top: 30px }
body { background-position: center }
#scenecontainer { position:fixed; top:50%; transform: translate(-50%, -50%) matrix(1, 0, 0, 1, 0, 0) }
#scene { position:relative }
#nami { position:fixed; opacity:0 }
#price { opacity:0; position:fixed; bottom: 25px }
#right_foot,#left_foot { opacity:0 }
#left_foot { padding-top:16% }
#twittericon { position: fixed; bottom: 50px; opacity:0 }
#instaicon { position: fixed; bottom: 120px; opacity:0 }
```

### [HTML and CSS ice cream + parallax.js animation](https://codepen.io/natszafraniec/pen/KjZEQL)

held: fixed form.controls | on scroll: div.background__dot: transform ×11, div.background__dot: transform+top ×3, div.icecream: transform+top, div.cone: transform+top | made with: position: fixed · @keyframes · transition · :hover

```css
0%, 95% { transform: scaleY(1) }
98%, 100% { transform: scaleY(0.1) }
0%, 95% { transform: scaleY(1) }
98%, 100% { transform: scaleY(0.1) }
0% { transform: scale(1) }
100% { transform: scale(0.6) }
0% { transform: scale(1) }
100% { transform: scale(0.6) }
0% { transform: translate3d(0, -10px, 0) }
100% { transform: translate3d(0, 20px, 0) }
0% { transform: translate3d(0, -10px, 0) }
100% { transform: translate3d(0, 20px, 0) }
```

### [Parallax Scrolling](https://codepen.io/sharkcoder/pen/Zdvowa)

made with: nothing recognised — read the code

```css
.parallax { background-position: center }
```

### [Scroll parallax 3d ( xrp website )](https://codepen.io/elecweb/pen/Zdaxyb)

on scroll: div.parallax: transform+top ×6, span.bouncing: transform+opacity+top | made with: @keyframes · transition · requestAnimationFrame

```css
.container { position: relative }
.parallax { position: absolute }
.parallax.floor { top: 250px; background-position: 50% 50% }
.parallax.layer:nth-of-type(2) { top: 290px; opacity: 0.5; transform: translateX(-50%) }
.parallax.layer:nth-of-type(3) { top: 325px; opacity: 0.8; transform: translateX(-50%) }
.parallax.layer:nth-of-type(4) { top: 530px; opacity: 0.85; transform: translateX(-50%) }
.parallax.layer:nth-of-type(5) { top: 270px; transform: translateX(-50%) }
.parallax.layer:nth-of-type(6) { top: 395px; transform: translateX(-50%); opacity: 0.9 }
0% { opacity: 0; transform: translateY(20px) }
100% { opacity: 1; transform: translateY(0px) }
0% { transform: translateY(0) }
50% { transform: translateY(10px) }
```

```js
requestAnimationFrame(play)
```

### [Pure CSS only Parallax Scrolling](https://codepen.io/ojdon/pen/QXqdPK)

made with: @keyframes

```css
body { position: relative }
.clouds { animation: move-right 500s infinite linear; position: absolute; margin-top: 5vh }
.mountains { animation: move-right 300s infinite linear; filter: hue-rotate(180deg) brightness(0.9); will-change: background-position; position: absolute; margbin-top: 10vh }
.ground { animation: move-right 60s infinite linear; filter: hue-rotate(270deg); will-change: background-position; position: absolute; margin-top: 25vh }
from { background-position: 0 100% }
to { background-position: 200% 100% }
.clouds { filter: brightness(0.32) }
.mountains { filter: hue-rotate(180deg) brightness(0.3) }
.ground { filter: brightness(0.35) }
@keyframes move-right animates background-position
```

### [Image Scroll](https://codepen.io/piyush-tapaniya/pen/wLrBme)

held: fixed div.codepen_profile | on hover of a.: a.: color, img.: color | made with: position: fixed · scroll() timeline

```css
.background { background-position: 50% 0% }
.codepen_profile { position: fixed; bottom: 20px }
.codepen_profile a { box-shadow: hsl(0deg 0% 80%) 0 5px 16px }
```

### [SVG Mask - Scroll to Reveal Text w/Parallax (best viewed on mobile)](https://codepen.io/CAWeissen/pen/qzXrVW)

held: fixed div.menu, fixed div.credit, fixed div.credit | on scroll: g.[object: transform ×2, image.[object: transform+top, text.[object: transform+top | on hover of li.: li.: transform | made with: position: fixed · transition · :hover · scroll listener · anime.js

```css
.menu { position: fixed; top: 0 }
.menu .nav { transition: opacity 0.2s ease }
.menu .nav li { transition: transform 0.2s ease }
.menu .nav li:hover { transform: translateX(5px) }
.menu .nav .search { position: relative }
.menu .nav .search::after { position: absolute; transform: rotate(45deg) translate(7px, 8px) }
.menu .logo { transition: transform 0.2s ease }
.menu .logo:hover { transform: scale(1.05) }
.menu .nav { opacity: 0 }
.credit { position: fixed }
.credit--dribbble { bottom: 1em }
.credit--photo { bottom: 2.5em }
```

```js
addEventListener('scroll', () => {
```

### [CSS parallax ice cream](https://codepen.io/tiiarautavesi/pen/ZdyJXP)

made with: nothing recognised — read the code

### [image parallax animation (libra website)](https://codepen.io/elecweb/pen/wLdoxB)

on scroll: div.image-wrapper: transform+top ×2 | on hover of img.: div.image-wrapper: transform ×2 | made with: transition · scroll listener · requestAnimationFrame

```css
.mission-statement .sub-title { opacity: 0; transition: opacity 0.83s cubic-bezier(0.17, 0.17, 0.05, 1) }
.mission-statement .title { margin-top: 24px; opacity: 0; transform: translateY(20px); transition: opacity 0.83s cubic-bezier(0.17, 0.17, 0.05, 1), transform 0.83s cubic-bezier(0.17, 0.17, 0.05, 1), -webkit-transform 0.83s cubic-bezier(0.17, 0.17,  }
.mission-statement .description { margin-top: 24px; opacity: 0; transition: opacity 0.83s cubic-bezier(0.17, 0.17, 0.05, 1) }
.mission-statement.visible .sub-title { opacity: 1 }
.mission-statement.visible .title { opacity: 1; transform: translateY(0) }
.mission-statement.visible .description { opacity: 1 }
.image-group { margin-bottom: 100vh }
.overlapping-images { padding-top: 91.746%; position: relative }
.overlapping-images { padding-top: 46.03% }
.image { position: absolute }
.image.back-image { bottom: 0; transform: translate(0, -17.5%) }
.image.front-image { top: 0; transform: translate(0, 20%) }
```

```js
requestAnimationFrame(playFrontAndBackImageContainer)
addEventListener('scroll', () => {
requestAnimationFrame(() => {
requestAnimationFrame(loop)
```

### [Paralax stage](https://codepen.io/natjo/pen/RzpVOb)

on scroll: img.: transform+top, h1.: transform+opacity+top | made with: scroll() timeline · 3D (perspective / preserve-3d) · scroll listener · requestAnimationFrame

```css
h1 { margin-bottom: 20px; position: absolute }
h2 { margin-bottom: 20px }
.stage { position: relative; transform: translateZ(0); transform: translate3d(0,0,0); perspective: 1000 }
.stage picture { position: absolute; bottom: 0 }
.stage picture img { -o-object-position: center center; object-position: center center; transform: translateZ(0); transform: translate3d(0,0,0); transform: rotate(0.0001deg); perspective: 1000 }
.stage .building { position: absolute; bottom: -50px; will-change: transform }
```

```js
addEventListener("scroll", _onscroll, false)
```

### [Cloudy sky v2](https://codepen.io/azamat-gizatullin/pen/gNgdwK)

made with: @keyframes

```css
.stage { position: absolute }
.cloud0, .cloud1, .cloud2, .cloud3 { position: absolute }
.sky { opacity: .9; -webkit-animation-iteration-count: infinite; animation-iteration-count: infinite; -webkit-animation-timing-function: linear; animation-timing-function: linear }
.sky-L3 { top: -150px; -webkit-animation-name: clouds3; animation-name: clouds3; -webkit-animation-duration: 20s; animation-duration: 20s; -webkit-animation-delay: 2s; animation-delay: 2s }
.sky-L2 { top: 150px; -webkit-animation-name: clouds2; animation-name: clouds2; -webkit-animation-duration: 28s; animation-duration: 28s; -webkit-animation-delay: 5s; animation-delay: 5s }
.sky-L1 { top: 400px; -webkit-animation-name: clouds1; animation-name: clouds1; -webkit-animation-duration: 40s; animation-duration: 40s; -webkit-animation-delay: 1s; animation-delay: 1s }
.sky-L0 { top: 550px; -webkit-animation-name: clouds0; animation-name: clouds0; -webkit-animation-duration: 50s; animation-duration: 50s; -webkit-animation-delay: 10s; animation-delay: 10s; transform: scale(0.75) }
#memorial { position: absolute; bottom: -10px }
@keyframes clouds0 animates margin-left
@keyframes clouds1 animates margin-left
@keyframes clouds2 animates margin-left
@keyframes clouds3 animates margin-left
```

### [Cloudy sky](https://codepen.io/azamat-gizatullin/pen/PrbLLa)

made with: @keyframes · mix-blend-mode

```css
.cloud { position: absolute }
#cloud-back1 { filter: url(#filter-back1); box-shadow: 300px 300px 30px -20px #fff }
#cloud-mid1 { filter: url(#filter-mid1); box-shadow: 300px 340px 70px -60px rgba(158, 168, 179, 0.5); mix-blend-mode: darken }
#cloud-front1 { filter: url(#filter-front1); box-shadow: 300px 370px 60px -100px rgba(0, 0, 0, 0.3); mix-blend-mode: darken }
#cloud-back2 { filter: url(#filter-back2); box-shadow: 300px 300px 30px -20px #fff }
#cloud-mid2 { filter: url(#filter-mid2); box-shadow: 300px 340px 70px -60px rgba(158, 168, 179, 0.5); mix-blend-mode: darken }
#cloud-front2 { filter: url(#filter-front2); box-shadow: 300px 370px 60px -120px rgba(0, 0, 0, 0.3); mix-blend-mode: darken }
#cloud-back3 { filter: url(#filter-back3); box-shadow: 300px 300px 30px -20px #fff }
#cloud-mid3 { filter: url(#filter-mid3); box-shadow: 300px 340px 70px -60px rgba(158, 168, 179, 0.5); mix-blend-mode: darken }
#cloud-front3 { filter: url(#filter-front3); box-shadow: 300px 370px 60px -100px rgba(0, 0, 0, 0.3); mix-blend-mode: darken }
.stage { position: absolute }
.sky { position: absolute; animation-name: clouds; animation-iteration-count: infinite; animation-timing-function: linear }
```

### [Various Parallax Scrolling with Custom Variables](https://codepen.io/ronm/pen/YopeGo)

made with: custom properties driven by JS · IntersectionObserver · scroll listener

```css
.hero.center { background-position: 50% 0% }
```

```js
style.setProperty("--support-test", tempBg)
new IntersectionObserver((entry, observer) => {
style.setProperty("--parallax-scale", this._type === "background" ? this.scale * 100 + '%' : this.sca
style.setProperty("--parallax-transform", this._type === "element" ? this.scale * this.element.parent
style.setProperty("--parallax-transform", this.move[this._type](traveled, diff))
addEventListener("scroll", Parallax._watcher)
```

### [Parallax and Smooth Scroll](https://codepen.io/GaganPrasad/pen/WqxbNw)

held: fixed header.fixed-top | on hover of a.: a.: color | made with: @keyframes · transition · :hover

```css
header h4 { padding-top: 5px }
.image1, .image2, .image3, .image4 { background-position: center; position: relative }
.image-text { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.main-heading { position: absolute; animation-name: slideIn; animation-duration: 3s; animation-timing-function: ease-in-out }
#down-arrow { position: absolute; top: 80%; animation-name: upDown; animation-iteration-count: infinite; animation-duration: 800ms; animation-direction: alternate; animation-timing-function: ease-in-out }
#about h1 { transform: rotate(-90deg) }
.animation-text a { transition: ease-in-out 500ms }
.image { background-position: center }
0% { margin-top: 0px }
100% { margin-top: 20px }
0% { top: 50% }
50% { top: 50% }
```

### [boxes parallax](https://codepen.io/rdg169/pen/QXNGpZ)

made with: transition · IntersectionObserver · requestAnimationFrame

```css
.boxes-parallax { background-position: "0%"; transition: background-position-y 0.55s ease-out }
.box--cta { position: relative }
.box__link { position: absolute; bottom: 15px; transform: translateX(50%) }
```

```js
new IntersectionObserver(this.run, {
requestAnimationFrame(_ => this.$el.style.backgroundPositionY
```

### [The UI Journey - v2](https://codepen.io/Semicolon404/pen/VJLyRM)

held: fixed div.header | on scroll: section.section-1: transform+top, div.left: transform+opacity+top, div.right: transform+opacity+top, section.section-2: transform+top, div.left: transform+top, div.right: transform+top | made with: position: fixed · GSAP

```css
.wrapper::before { position: absolute; top: 0; opacity: 0.4 }
.wrapper section { position: relative }
.header { position: fixed; top: 0px; border-bottom: 1px solid #f1f1f1 }
```

### [Flicking examples full page](https://codepen.io/egjs/pen/MMYQRE)

held: fixed div.pagination | on scroll: div.circle: transform+top ×6, div.feature: transform+top ×6, div.dot: background ×4 | on hover of a.: div.wheel: transform+top | made with: position: fixed · transition

```css
.ratio13:before { position: relative; padding-top: 130% }
.ratio062:before { position: relative; padding-top: 66% }
html, body, .flicking, .background { position: relative }
.flicking, .background { position: absolute }
.background .rect, .background .circle, .background .star, .background .triangle { position: absolute }
.background .circle:before { position: relative; padding-top: 100% }
.c1 { bottom: 50% }
.c2 { top: 50%; transform: translate(-50%, -50%) }
.c3 { top: 50%; transform: translate(-50%, -50%) }
.c4 { top: 50% }
.c5 { bottom: 60% }
.c6 { top: 60% }
```

```js
addEventListener("wheel", function (e) {
```

### [Roadtrip Sunset](https://codepen.io/a-trost/pen/pXzbbq)

on scroll: g.[object: transform+top ×10, path.[object: transform+top ×6, circle.[object: transform | made with: GSAP

### [Parallax Pokemon Forest](https://codepen.io/interactiverob/pen/ZNgQQL)

on scroll: div.h-screen: transform ×3 | on hover of img.: div.h-screen: transform+top ×11 | made with: position: sticky · position: fixed · @keyframes · transition · :hover · prefers-reduced-motion · 3D (perspective / preserve-3d)

```css
abbr[title] { border-bottom:none }
sub,sup { position:relative }
sub { bottom:-.25em }
sup { top:-.5em }
button,select { text-transform:none }
[type=search] { outline-offset:-2px }
input:-ms-input-placeholder,textarea:-ms-input-placeholder { opacity:.5 }
input::placeholder,textarea::placeholder { opacity:.5 }
a,svg { transition:.15s cubic-bezier(.6,.2,0,.8) }
a:after,a:before { transition:inherit }
main svg { transition:.15s cubic-bezier(.6,.2,0,.8) }
0% { opacity:0; transform:translateY(-50%) }
```

### [scroll-based transitions](https://codepen.io/andyranged/pen/jodVLP)

on scroll: div.bg: transform+top | made with: scroll listener · requestAnimationFrame

```css
.element { position: relative }
.element > * { position: relative }
.element .bg { bottom: 0; position: absolute; top: 0 }
```

```js
addEventListener('scroll', onScroll)
```

### [Parallax header](https://codepen.io/rares-lungescu/pen/PvXdeB)

held: fixed footer | on scroll: figure.column: transform+opacity+top ×6 | on hover of img.: figure.column: transform+opacity ×2 | made with: position: fixed · scroll() timeline · transition · :hover

```css
.content { margin-bottom: 300px }
.landscape { position: relative; background-position: top center }
.logo { background-position: center; position: absolute; top: 50%; margin-top: -80px }
.yellowlady { background-position: right bottom; position: absolute; top: 100px }
.umbrella { background-position: bottom right; position: absolute }
.product-showcase { margin-bottom: 100px }
.product-showcase figure { position: relative; opacity: 0; transform: translateX(30px); transition: all 0.4s ease-in-out }
.product-showcase figure.is-showing { opacity: 1; transform: translateX(0px) }
.product-showcase figure img { transform: scale(1); transition: all 0.3s ease-in-out }
.product-showcase figure:hover > img { transform: scale(1.1) }
.product-showcase figcaption { position: absolute; bottom: 10px; transition: all 0.3s ease-in-out }
.promo-window { background-position: center 0px; margin-top: 100px; margin-bottom: 100px; position: relative }
```

### [Simple CSS-only parallax scroll](https://codepen.io/tmarkart/pen/yWQwQG)

made with: nothing recognised — read the code

```css
.parallax { background-position: center center }
.parallax .parallax-content h2 { text-transform: uppercase }
```

### [Background parallax](https://codepen.io/christofer15/pen/byjygr)

held: fixed div.scene | on scroll: div.layer: transform ×3 | made with: position: fixed · pointer / mouse tracking

```css
.scene { position: fixed; top: 0; bottom: 0 }
.layer { position: absolute; top: 0 }
```

```js
addEventListener('mousemove', parallax)
```

### [Parallax Practice](https://codepen.io/lmldvd/pen/VOBgVK)

made with: scroll listener

```js
addEventListener("scroll", function()
```

### [Tornis Parallax and Blur Demo](https://codepen.io/tjFogarty/pen/qGyqwa)

held: sticky div.js-cover-image | on scroll: div.js-cover-image: transform+filter+top | made with: position: sticky · custom properties driven by JS

```css
.wrapper { position: relative }
.cover-image { position: sticky; top: 0; filter: blur(calc(var(--scrollY) * 10px)); transform: translate(0, calc(var(--scrollY) * -30px)) }
h1 { margin-top: 0 }
```

```js
style.setProperty('--scrollY', scrollOffset)
```

### [React parallax](https://codepen.io/AdamMorsi/pen/oRdJvV)

made with: transition · scroll listener

```css
.parallax { background-position: center top; transition: background-position 0s linear }
```

```js
addEventListener('scroll', onParallax)
```

### [Drifting Stars in 3d space](https://codepen.io/diggs1711/pen/xNWdMP)

made with: @keyframes · :hover · 3D (perspective / preserve-3d)

```css
*, *::before, *::after { position: relative }
body { background-position: bottom; perspective: 700px; transform: translateZ(-10em); -webkit-animation: pan 40s infinite alternate cubic-bezier(0.5, 1, 0, 1); animation: pan 40s infinite alternate cubic-bezier(0.5, 1, 0, 1) }
to { transform: translateZ(10em) }
to { transform: translateZ(10em) }
.star { position: absolute }
.star.item-1 { top: 8.4vh; transform: translateZ(-90.8em) translateX(-84vw) translateY(25vh) }
.star.item-2 { top: 66.1vh; transform: translateZ(-84.6em) translateX(61vw) translateY(-59vh) }
.star.item-3 { top: 42.4vh; transform: translateZ(-43.8em) translateX(-99vw) translateY(26vh) }
.star.item-4 { top: 31.8vh; transform: translateZ(-50.1em) translateX(-26vw) translateY(98vh) }
.star.item-5 { top: 118.6vh; transform: translateZ(-6.8em) translateX(-80vw) translateY(24vh) }
.star.item-6 { top: 107.9vh; transform: translateZ(-66.4em) translateX(-70vw) translateY(98vh) }
.star.item-7 { top: 13vh; transform: translateZ(-68.2em) translateX(-78vw) translateY(-83vh) }
```

### [Forest parallax](https://codepen.io/andrejsharapov/pen/joZzEV)

held: fixed footer | on scroll: div.one: transform+top, div.two: transform+top, div.three: transform+top, div.four: transform+top, div.five: transform+top | on hover of a.: div.one: transform, div.two: transform+top, div.three: transform, div.four: transform+top | made with: position: fixed · scroll() timeline · @keyframes · transition · mix-blend-mode

```css
header { position: relative }
header .overlay { position: absolute; top: 0 }
header .overlay h1 { position: absolute; top: 50%; transform: translate(-50%, -50%); text-transform: uppercase; mix-blend-mode: screen; opacity: 0.78 }
header .parallax { position: relative }
header .parallax div { position: absolute; bottom: -15px; background-position: 0 100%; transition: transform 200ms ease }
header .parallax .one { animation: side 25s linear infinite }
header .parallax .three { animation: side 25s linear 5s infinite }
20%, 60%, 100% { transform: translateX(15px) }
40%, 80% { transform: translateX(-15px) }
main { position: relative; margin-bottom: 15vh }
main .container { position: relative }
footer { position: fixed; bottom: 0 }
```

### [YouTube TV Live Guide Interface](https://codepen.io/sgorneau/pen/zQpPMQ)

held: fixed ul | made with: position: fixed · scroll() timeline · 3D (perspective / preserve-3d)

```css
#yttv { position: relative }
#yt-live-guide li > span { border-bottom: 1px solid #eee; position: relative }
#yt-live-guide li .bug { position: absolute; top: 25px }
#yt-live-view { position: fixed; top: 0; transform: translateX(-50%); perspective: 1px }
#yt-live-view li { position: relative }
#yt-live-view li .bkgd { position: relative; opacity: .5 }
#yt-live-view li .bkgd::after { position: absolute; top: 0; bottom: 0; transform: translateZ(2px) scale(1.25); background-position: 50% 50% }
#yt-live-view li .overlay { position: relative }
#yt-live-view li .overlay .title { position: absolute; bottom: 24px }
```

### [Detroit Parallax](https://codepen.io/jimbob6272/pen/Lozmpj)

on hover of a.: a.: color | made with: :hover · 3D (perspective / preserve-3d)

```css
.navbar-brand { opacity: .5; margin-top: -5px }
p { margin-bottom: 1.5em }
header { padding-top: 0.5em; margin-bottom: 1.5em }
.parallax { margin-top: -100px }
body { transform: translateZ(0px) }
.parallax { perspective: 1px; -webkit-perspective: 1px; top: 0; bottom: 0; margin-top: -80px }
.parallax__layer { position: absolute; top: 80px; bottom: 0 }
.parallax__layer--00 { transform: translateZ(0); -webkit-transform: translateZ(0px); background: url("http://www.michiganmadeweb.com/wp-content/uploads/2016/11/layer-00-new.png") no-repeat center bottom }
.parallax__layer--01 { transform: translateZ(-0.5px) scale(1.5); -webkit-transform: translateZ(-0.5px) scale(1.5); background: url("http://www.michiganmadeweb.com/wp-content/uploads/2016/11/layer-01-dlogo.png") no-repeat center bottom }
.parallax__layer--02 { transform: translateZ(-4px) scale(5); -webkit-transform: translateZ(-4px) scale(5); background: url("http://www.michiganmadeweb.com/wp-content/uploads/2016/10/layer-02-water.png") no-repeat center bottom }
.parallax__layer--03 { transform: translateZ(-6px) scale(7); -webkit-transform: translateZ(-6px) scale(9); background: url("http://www.michiganmadeweb.com/wp-content/uploads/2016/10/layer-03-new.png") no-repeat center bottom }
.parallax__cover { position: relative; top: 100% }
```

### [hw parallax](https://codepen.io/afelixj/pen/byooee)

held: fixed div.parallax-block, fixed div.parallax-block | on scroll: div.parallax-block: transform, div.parallax-image: transform, div.parallax-block: transform+top, img.parallax-image: transform+top | made with: position: fixed · 3D (perspective / preserve-3d) · requestAnimationFrame

```css
.parallax-block { position:fixed; top:0; -webkit-perspective:1000px; -moz-perspective:1000px; -ms-perspective:1000px; -o-perspective:1000px; perspective:1000px }
.parallax-image { position:absolute; top:0; -webkit-perspective:1000px; -moz-perspective:1000px; -ms-perspective:1000px; -o-perspective:1000px; perspective:1000px }
p, h2 { margin-bottom: 1em }
```

```js
requestAnimationFrame(function(){i.draw()},document):i.draw()}
```

### [Pretty Parallax!](https://codepen.io/jamesharmer/pen/JqrPyz)

held: fixed div.hero--layer, fixed div.hero--layer, fixed div.hero--layer, fixed div.hero--layer, fixed div.hero--layer, fixed div.hero--layer, fixed div.hero--layer, fixed div.hero--layer, fixed div.hero--layer | on scroll: div.hero--layer: transform+top ×9 | made with: position: fixed · scroll listener

```css
.hero { position: relative }
.hero--layer { background-position: bottom center; position: fixed }
```

```js
addEventListener("scroll", function(event) {
```

### [Parallax confetti](https://codepen.io/jawhitney/pen/dEGVpx)

held: fixed div.parallax | made with: position: fixed · @keyframes

```css
0% { top: 100% }
100% { top: -100% }
.container { position: relative }
.parallax { position: fixed; top: 0 }
.parallax img { position: absolute; top: 0; transform: translateX(-50%) translateZ(0); animation: confetti linear infinite }
.parallax img:nth-child(1) { animation-delay: -160s; animation-duration: 40s }
.parallax img:nth-child(2) { animation-delay: -120s; animation-duration: 80s }
.parallax img:nth-child(3) { animation-delay: -80s; animation-duration: 120s }
.parallax img:nth-child(4) { animation-delay: -40s; animation-duration: 160s }
.parallax img:nth-child(5) { animation-delay: 0s; animation-duration: 200s }
@keyframes confetti animates top
```

### [Parallax viewfinder](https://codepen.io/sgiannangeli/pen/oRjWmz)

on scroll: div.frame: transform, div.viewfinder: transform, div.rec: opacity, div.video: transform | made with: @keyframes

```css
main { position: absolute; top: 50%; transform: translate(-50%, -50%) }
main section { position: absolute; transform: translate(0, -50%) !important; padding-bottom: 56.25% }
main section .video { position: absolute; top: 0px; box-shadow: 0px 20px 50px rgba(0, 0, 0, 0.7) }
main section .video:before { position: absolute; top: 0px; opacity: 0.05 }
main section .video #bgvid { position: absolute; top: 0px; opacity: 0.4 }
.frame { position: absolute !important; top: 3vw !important; filter: blur(0.5px) }
.frame .viewfinder { position: absolute; top: 5vw !important }
.frame .viewfinder div:before, .frame .viewfinder div:after { position: absolute; filter: blur(0.5px) }
.frame .viewfinder div:last-child:before { bottom: 0px }
.frame .viewfinder div:last-child:after { bottom: 0px }
.frame .rec { position: absolute; top: 1.4vw; filter: blur(1.5px); animation: rec 500ms linear 600ms infinite alternate }
.frame #numb { position: absolute !important; top: 1.4vw; opacity: 0.8 }
```

### [CSS sticky+ parallax + transform + flex box +](https://codepen.io/Fibonaccifreak/pen/dEodoY)

held: sticky div.maintop-text, sticky div.maintop-lefttext | made with: position: sticky

```css
.maintop { background-position: center }
.maintop-text { top: 1em; position: sticky; -webkit-position: sticky }
.maintop-lefttext { top: 5em; position: sticky; -webkit-position: sticky }
.iframe { position: relative; margin-top: 30em }
hr { border-top: dotted 1px }
.slanted { text-transform: uppercase; transform: rotate(-5deg); margin-top: 1em }
.mainimg { position: relative }
.mainimg3 { position: relative }
.text-box { position: relative }
.content { margin-top: 5em }
.container { position: relative }
.straight { text-transform: uppercase; margin-top: 1em }
```

### [Parallax Test](https://codepen.io/shrinkray/pen/JqoZQJ)

held: fixed div.parallax-mirror, fixed div.parallax-mirror, sticky div.header | on scroll: div.parallax-mirror: transform+top ×2, img.parallax-slider: transform+top ×2 | made with: position: sticky · position: fixed · clip-path

```css
.logo { position: absolute; top: 1.5rem }
.background-image { position: fixed }
.header { position: sticky; top: 0 }
```

### [Simple Parallax Effect](https://codepen.io/raghav-dhingra/pen/byGveN)

made with: nothing recognised — read the code

```css
.content { position: relative }
```

### [Masked Parallax Images with SVG](https://codepen.io/jensiegirl/pen/rgNJrM)

made with: position: fixed · clip-path

```css
.intro p { top: 40%; position: absolute; transform: translate(-50%) }
.outer.square { position: relative }
.background { position: absolute; top: 0; opacity: 0.75 }
.mask { position: absolute; transform: translateX(-50%) }
.tag { position: fixed; top: calc(100vh - 3rem); box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25) }
```

### [Cursor with progress indicator](https://codepen.io/ig_design/pen/zXVGem)

held: fixed a.navbar-brand, fixed div.cursor, fixed div.cursor2, fixed div.cursor3 | on hover of a.navbar-brand: a.navbar-brand: color, img.: color, div.cursor2: transform+background+top, div.progress-wrap: shadow+top, path.[object: opacity+top, div.cursor3: transform+top | made with: position: fixed · scroll() timeline · @keyframes · transition · pointer / mouse tracking

```css
body { -webkit-transition: all 200ms linear; transition: all 200ms linear }
.section { position: relative }
.center-wrap { position: absolute; top: 50%; transform: translateY(-50%) }
.progress-wrap { box-shadow: inset 0 0 0 2px rgba(255,255,255,0.2); -webkit-transition: all 200ms linear; transition: all 200ms linear }
.progress-wrap svg.progress-circle path { -webkit-transition: all 200ms linear; transition: all 200ms linear }
.cursor, .cursor2, .cursor3 { position: fixed; transform: translateX(-50%) translateY(-50%); top: 50%; -webkit-transition: all 300ms linear; transition: all 300ms linear }
.cursor2,.cursor3 { -webkit-transition:all 0.3s ease-out; transition:all 0.3s ease-out }
.cursor2.hover, .cursor3.hover { -webkit-transform:scale(1.4) translateX(-35%) translateY(-35%); transform:scale(1.4) translateX(-35%) translateY(-35%) }
.cursor2.hover .progress-wrap { box-shadow: inset 0 0 0 2px rgba(255,255,255,0) }
.cursor2.hover .progress-wrap svg.progress-circle path { opacity: 0.4 }
.navbar-brand { position: fixed; top: 40px; -webkit-transition : all 0.3s ease-out; transition : all 0.3s ease-out }
.navbar-brand::after { position: absolute; top: 50%; transform: translate(-50%, -50%); opacity: 1; animation: border-transform 10s linear infinite alternate forwards; -webkit-transition: all 200ms linear; transition: all 200ms linear }
```

```js
addEventListener("mousemove", function(n) {
```

### [VueJS Perspective Mousemove Header](https://codepen.io/numerical/pen/Lvoyya)

on scroll: img.: transform+top, h1.bg-primary: transform+top, h3.bg-light: transform+top, div.align-items-center: transform+top | on hover of img.: img.: transform, h1.bg-primary: transform+top, h3.bg-light: transform+top, div.align-items-center: transform | made with: pointer / mouse tracking · requestAnimationFrame

```css
.absolute-center { top: 50%; transform: translate(-50%, -50%) }
.mb-0 { margin-bottom: 0 }
.mb-1 { margin-bottom: 0.25rem }
.mt-0 { margin-top: 0 }
.my-0 { margin-top: 0; margin-bottom: 0 }
.py-2 { padding-top: 1rem; padding-bottom: 1rem }
.py-4 { padding-top: 2rem; padding-bottom: 2rem }
.pos-absolute { position: absolute }
.pos-relative { position: relative }
.shadow-lg { box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3) }
.title { position: relative }
.title:before { position: absolute; top: 100%; transform: translateY(-50%) }
```

```js
addEventListener('mousemove', e => {
requestAnimationFrame(() => {
```

### [uikit Parallax load programatically attempt](https://codepen.io/akcreation/pen/gyJprb)

made with: nothing recognised — read the code

### [Multiparallax, easy short code](https://codepen.io/Rafi-R/pen/pBGJzZ)

held: fixed img.parallax__image, fixed img.parallax__image, fixed img.parallax__image, fixed img.parallax__image, fixed img.parallax__image, fixed img.parallax__image, fixed img.parallax__image, fixed img.parallax__image | on scroll: img.parallax__image: transform+top ×8 | made with: position: fixed · scroll listener

```css
.parallax__container { position: relative }
.parallax__container img { position: fixed; top: 0; -o-object-position: center center; object-position: center center }
.parallax__container .last { position: absolute; bottom: 0; -o-object-position: bottom center; object-position: bottom center }
.parallax__container .parallax__noscript--image { position: absolute; background-position: center center }
.content { position: relative }
```

```js
addEventListener("scroll", () => {
```

### [The Bored Face responsive parallax webpage](https://codepen.io/pieter-biesemans/pen/zXMgLQ)

on hover of div.scroll-btn: div.scroll-btn: filter+top | made with: @keyframes · transition · :hover · mix-blend-mode

```css
div { position: absolute }
div:before, div:after { position: absolute }
body { top: 0 }
body .message { bottom: 1vw }
body .message a { border-bottom: 1px solid #444 }
body.scroll .top .plx1 { top: -30vh }
body.scroll .top .plx2 { top: -20vh }
body.scroll .top .plx3 { top: -10vh }
body.scroll .top .text { top: 40vh }
body.scroll .bottom { top: 0 }
body.scroll .bottom .plx { top: 0 }
body.scroll .bottom .text { top: 14vh }
```

### [Basic Parallax Web](https://codepen.io/dwiki13/pen/BEPapd)

held: fixed nav.navbar | on scroll: li.nav-item: color ×4 | made with: scroll() timeline · transition · :hover

```css
.parallax4 { background-position: 0 -231px !important }
.parallax1, .parallax2, .parallax3, .parallax4, .parallax5 { position: relative; opacity: 0.7; background-position: center }
.heading { position: absolute; top: 38%; text-transform: uppercase }
.heading-sm { position: absolute; top: 45%; text-transform: uppercase }
#form-content { transition: 0.5s }
#form-content:hover { -webkit-box-shadow: 0px 5px 13px 2px rgba(71, 70, 71, 0.76); -moz-box-shadow: 0px 5px 13px 2px rgba(71, 70, 71, 0.76); box-shadow: 0px 5px 13px 2px rgba(71, 70, 71, 0.76) }
.group { position: relative; margin-bottom: 45px }
input, textarea { border-bottom: 1px solid #757575 }
label { position: absolute; top: 10px; transition: 0.2s ease all; -moz-transition: 0.2s ease all; -webkit-transition: 0.2s ease all }
input:focus ~ label, input:valid ~ label { top: -20px }
textarea:focus ~ label, textarea:valid ~ label { top: -20px }
.bar { position: relative }
```

### [Universe - Parallax Effect](https://codepen.io/juliabrazolim/pen/dLdrZd)

made with: nothing recognised — read the code

```css
.masthead { margin-top:0px; background-position: center }
.description { margin-top:-60px }
.dark { margin-top:0px; margin-top:-60px; background-position: center }
```

### [Comic with Parallax](https://codepen.io/Patrick84/pen/dLdmjK)

on scroll: div.layer: transform+top ×3 | made with: nothing recognised — read the code

```css
#scene { position: relative }
#scene .layer { background-position: center }
#scene .layer.layer_1 { margin-top: 162px }
#scene .layer.layer_2 { margin-top: 180px }
```

### [One Hour Javascript: Parallax](https://codepen.io/desilove/pen/QPOOqK)

held: fixed div, fixed div | made with: position: fixed · scroll listener · requestAnimationFrame

```css
#left, #right { top: 0; position: fixed }
```

```js
addEventListener('scroll', function(){
requestAnimationFrame(parallax)
```

### [A Very Simple Parallax Effect With CSS & JavaScript](https://codepen.io/tutsplus/pen/BERwpj)

on scroll: section.banner: transform+top, h1.banner-title: transform+top, p.banner-subtitle: transform+top, img.skiing: transform+top | made with: scroll listener

```css
.banner { position: relative }
.banner-title { margin-bottom: -0.5em; transform: rotate(-6deg) }
.banner-subtitle { box-shadow: -15px -15px 15px rgba(0, 0, 0, 0.07); transform: rotate(-3deg) }
.skiing { position: absolute; bottom: 20px }
.content { position: relative }
.content p + p { margin-top: 25px }
footer { padding-bottom: 20px }
```

```js
addEventListener("scroll", scrollHandler)
```

### [Dream's sunset](https://codepen.io/H2xDev/pen/wZdepm)

made with: canvas 2D · requestAnimationFrame

```css
canvas { position: absolute; top: 0 }
```

```js
requestAnimationFrame(loop)
```

### [An article layout](https://codepen.io/Rosefae/pen/dLvdVb)

made with: nothing recognised — read the code

```css
.image, header { position: relative }
article > *:not(p) + p { margin-top: 1.8rem }
.image { margin-top: 2.5rem; background-position: center }
article > p:last-child { margin-bottom: 3rem }
```

### [Parallax](https://codepen.io/OlgaKoplik/pen/ZZLLZp)

on scroll: h1.: transform+top | made with: scroll() timeline · transition · :hover · mix-blend-mode

```css
h1 { transform: translate(-10%, -30%); mix-blend-mode: screen; position: relative }
h3 { transform: translate(0%, -90%); mix-blend-mode: screen; position: relative }
.sun { transform: translate(-77%, 0); top: -20%; position: absolute; background: url(http://pngimg.com/uploads/sun/sun_PNG13414.png) no-repeat center top }
.wrapper { position: relative }
.text { position: absolute; top: 30% }
.mountain { position: absolute; background: url(http://pngimg.com/uploads/mountain/mountain_PNG8.png) no-repeat right bottom }
.block { position: relative }
.content__text { position: absolute }
h2 { mix-blend-mode: difference; position: relative; top: -35px }
.fa-instagram { position: absolute; top: 2% }
.fa-instagram:hover { transition: all .1s linear }
```

### [Parallax on scroll](https://codepen.io/evgeniy_burlak/pen/qwRWde)

on scroll: div.first-layout: transform+top, div.second-layout: transform+top, div.third-layout: transform+top, div.four-layout: transform+top, div.five-layout: transform+top, div.seven-layout: transform+top | made with: scroll listener

```css
.text { position: relative }
.text-inner { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.scroll-parallax-text { position: absolute; top: 0%; padding-top: 50px }
```

```js
addEventListener('scroll', function(event){
```

### [CSS Golden Ratio + Parallax - Rellax.js + Marquee Animation](https://codepen.io/wendy44919/pen/LvZQPZ)

on scroll: div.button__ticker: transform+top ×4, div.square: transform+top ×4, div.tall-rect: transform+top ×3, div.wide-rect: transform+top ×3, div.title-container: transform+top ×2 | made with: @keyframes · transition · :hover

```css
.title-container.rellax-box:hover > span { opacity: 0 }
.title-container.rellax-box:hover .button__hover { opacity: 1 }
.title-container.rellax-box > span { transition: opacity 400ms ease }
.title-container.rellax-box .button__hover { opacity: 0; position: absolute; top: 0; transition: opacity 400ms ease }
.title-container.rellax-box .button__hover .button__ticker { -webkit-animation-iteration-count: infinite; animation-iteration-count: infinite; -webkit-animation-timing-function: linear; animation-timing-function: linear; -webkit-animation-name: ticker; animation-name: ticker; anim }
section .square:before { padding-top: 100% }
.rellax-box { position: relative }
.rellax-box > p { position: absolute; top: 50%; transform: translate(-50%, -50%) }
0% { -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0) }
100% { -webkit-transform: translate3d(-100%, 0, 0); transform: translate3d(-100%, 0, 0) }
@keyframes ticker animates -webkit-transform, transform
```

### [Magic Window (requires Desktop browser)](https://codepen.io/boyd/pen/vMKBxd)

made with: transition · requestAnimationFrame

```css
h1 { margin-top: 2em; margin-bottom: 1em }
#magicWindow { transition: background-position 0.05s linear; box-shadow: inset 0 0 2em 0.1em rgba(34, 50, 51, 0.25), 0 0 0 1px #fff }
```

```js
requestAnimationFrame(calcWindowPosition)
```

### [Parallax scrolling in CSS](https://codepen.io/Fibonaccifreak/pen/wZKXra)

held: fixed div.imgcontainer, fixed div.topnav | made with: position: fixed

```css
.imgcontainer { position: fixed }
.container { position: relative }
.topnav { top: 0; padding-top: 0.5em; padding-bottom: 0.5em; position: fixed }
```

### [Parallax Scrolling with HTML and CSS only](https://codepen.io/MissDev/pen/OGLaZq)

made with: nothing recognised — read the code

### [Scriptless Parallaxless Parallax Scrolling](https://codepen.io/alanhouser/pen/zbgGpr)

made with: :hover

```css
header .logo { margin-bottom: 20px }
header .social a.fb { background-position: 0 0 }
header .social a.twitter { background-position: -30px 0 }
header .social a.googleplus { background-position: -60px 0 }
header .social a.rss { background-position: -90px 0 }
header .social a.email { background-position: -120px 0 }
header .social a.search { background-position: -150px 0 }
header .social a:hover { opacity: 0.4 }
header .logo { margin-bottom: 0 }
section.module:last-child { margin-bottom: 0 }
section.module h2 { margin-bottom: 40px }
section.module p { margin-bottom: 40px }
```

### [HTTYD3 Parallax on MouseMove & Gyro](https://codepen.io/keiichi428/pen/xBojYv)

made with: 3D (perspective / preserve-3d) · pointer / mouse tracking · requestAnimationFrame

```css
.parallax { position: relative; will-change: perspective-origin }
.parallax li { position:absolute; top:0 }
```

```js
addEventListener('mousemove', e=>{
requestAnimationFrame(loop)
```

### [Parallax Cities](https://codepen.io/Sukotto92/pen/oVrBjy)

made with: nothing recognised — read the code

```css
.NewYork, .HongKong, .Frankfurt { position:relative; opacity:0.65; background-position:center }
.center { position:absolute; top:50% }
```

### [Parallax Effect Off-Screen Menu](https://codepen.io/joebentaylor/pen/VRRprr)

held: fixed nav.menu | on hover of button.menu-toggle: button.menu-toggle: background | made with: position: fixed · transition · :hover

```css
.menu-toggle { transition: all 0.35s ease-in-out; position: absolute; top: 0 }
nav { transition: all 1.1s cubic-bezier(0.8, 0, 0.2, 1); position: fixed; top: 0; bottom: 0 }
ul { position: absolute; top: 50%; transform: translate(-50%, -50%) }
a { transition: all 0.35s ease-in-out; text-transform: uppercase }
```

### [Pure CSS Parallax Landscape](https://codepen.io/D7460N/pen/OqBwMo)

held: fixed div.layer, fixed div.layer, fixed div.layer, fixed div.layer, fixed div.layer, fixed div.layer | made with: position: fixed · 3D (perspective / preserve-3d)

```css
.bg { position: absolute; top: 0px }
.layer { position: fixed; top: 0px; top: 0; bottom: 0; background-position: top center }
.parallax { -webkit-perspective: 1px; perspective: 1px }
.parallax-group { position: relative }
.parallax-group div:nth-child(1) { margin-top: 600px; -webkit-transform: translateZ(-12px) scale(13); transform: translateZ(-12px) scale(13) }
.parallax-group div:nth-child(1):before { position: absolute; bottom: 100%; background-position: 53px 0px }
.parallax-group div:nth-child(2) { margin-top: 900px; -webkit-transform: translateZ(-10px) scale(11); transform: translateZ(-10px) scale(11) }
.parallax-group div:nth-child(2):before { position: absolute; bottom: 100%; background-position: 135px 0px }
.parallax-group div:nth-child(3) { margin-top: 1200px; -webkit-transform: translateZ(-8px) scale(9); transform: translateZ(-8px) scale(9) }
.parallax-group div:nth-child(3):before { position: absolute; bottom: 100%; background-position: 265px 0px }
.parallax-group div:nth-child(4) { margin-top: 1500px; -webkit-transform: translateZ(-6px) scale(7); transform: translateZ(-6px) scale(7) }
.parallax-group div:nth-child(4):before { position: absolute; bottom: 100%; background-position: 176px 0px }
```

### [Pseudo-Parallax](https://codepen.io/fcasantos/pen/gEzOqW)

made with: nothing recognised — read the code

```css
.wrapper { position: relative }
.wrapper::before { position: absolute }
.box { position: relative; top: 31rem }
h1 { margin-bottom: 1rem; text-transform: uppercase }
p { margin-bottom: 1em }
```

### [Mouse Following DOM-Stars](https://codepen.io/niklasnoldin/pen/KEyVpz)

on scroll: div.star: transform ×967, div.star: transform+top ×33, div.cursor: transform+top | made with: nothing recognised — read the code

```css
.star { position: absolute; top: 50% }
.cursor { position: absolute; top: 50% }
```

### [Parallax.js simple city parallax](https://codepen.io/khvn/pen/OqjjwW)

made with: nothing recognised — read the code

```css
#more { background-position: 0; position: absolute; top: 0 }
#kottedj { background-position: 0; position: absolute; top: 0 }
#oasis { background-position: 0; position: absolute; top: 0 }
#kto { background-position: 0; position: absolute; top: 0 }
#dukat { background-position: 0; position: absolute; top: 0 }
```

### [Rainbow Parallax Using SCSS loops](https://codepen.io/RebelJess/pen/oVWYqE)

made with: 3D (perspective / preserve-3d)

```css
.rect:nth-child(2) { transform: translateZ(-1px) scale(2) }
.rect:nth-child(2):before { margin-top: 100px !important }
.rect:nth-child(2):after { margin-top: 130px !important }
.rect:nth-child(3) { transform: translateZ(-2px) scale(3) }
.rect:nth-child(3):before { margin-top: 200px !important }
.rect:nth-child(3):after { margin-top: 230px !important }
.rect:nth-child(4) { transform: translateZ(-3px) scale(4) }
.rect:nth-child(4):before { margin-top: 300px !important }
.rect:nth-child(4):after { margin-top: 330px !important }
.rect:nth-child(5) { transform: translateZ(-4px) scale(5) }
.rect:nth-child(5):before { margin-top: 400px !important }
.rect:nth-child(5):after { margin-top: 430px !important }
```

### [parallax-mouse](https://codepen.io/watab0shi/pen/eXWdZb)

on hover of li.item: li.item: transform+top ×7 | made with: pointer / mouse tracking · requestAnimationFrame

```css
* { position: relative }
.list { position: relative; top: 50%; transform: translateY(-50%) }
.list .item { position: absolute }
```

```js
addEventListener('mousemove', e => {
requestAnimationFrame(update)
```

### [SVG Masking Parallax](https://codepen.io/BracketMan/pen/YgZjow)

on scroll: rect.[object: transform ×7 | made with: GSAP

```css
body, html { filter: url(#fancy-goo) }
```

### [Parallax Effect (CSS only)](https://codepen.io/nikolaytarasenko/pen/oVYNWx)

made with: 3D (perspective / preserve-3d)

```css
body { perspective: 1px }
section h1 { margin-bottom: 20px }
section::before { position: absolute; top: 0; bottom: 0; transform: translateZ(-1px) scale(2) }
```

### [Mountainscape](https://codepen.io/thinkdrastic/pen/NJNJbo)

made with: nothing recognised — read the code

```css
h1, h2, p { text-transform: uppercase }
header { background-position: left bottom, right bottom, left bottom, left bottom, left bottom, center bottom, right bottom, center bottom, center center }
header { background-position: center bottom, center top }
```

### [Parallax Effect + Text Blend Mode](https://codepen.io/designfenix/pen/pYyOJE)

held: fixed p.dev | on hover of img.: div.text-center: transform+top ×4, h1.text-center: transform+top, h2.text-center: transform+top | made with: position: fixed · mix-blend-mode

```css
.dev { position: fixed; top: 0 }
.parallax { position: relative }
.parallax h1 { position: absolute; text-transform: uppercase; margin-top: 190px; mix-blend-mode: hard-light }
.parallax h1 { margin-top: 35px }
.parallax h2 { position: absolute; text-transform: uppercase; margin-top: 315px; mix-blend-mode: hard-light }
.parallax h2 { margin-top: 135px }
.parallax #mountain { top: 100px }
.parallax #boat { margin-top: 25% }
.parallax #birds { margin-top: 15% }
.parallax #island { margin-top: 15% }
```

### [Parallax Stack](https://codepen.io/mkellydevv/pen/NJPLrY)

held: fixed div.navbar | made with: position: fixed · scroll() timeline

```css
section { position:relative }
.navbar { position:fixed }
.bg-image { background-position:center }
.section-content { position:absolute; top:50%; transform:translateY(-50%) }
.parallax-section-active { position:fixed }
```

### [Teaser Parallax Effect with Mouse Movement and Device Orientation](https://codepen.io/builtbymax/pen/XGrKaL)

on scroll: img.: transform+top, span.overlay: transform, h3.: transform | on hover of img.: img.: transform+top, span.overlay: transform, h3.: transform+top | made with: transition · pointer / mouse tracking

```css
.teaser.square-layout { margin-bottom: 35px; position: relative }
.teaser.square-layout .image-box { padding-bottom: 100%; position: relative }
.teaser.square-layout .image-box img { position: absolute }
.teaser.square-layout .teaser-content { position: absolute; top: 50%; -webkit-transform: translate(-50%, -50%); -moz-transform: translate(-50%, -50%); -o-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%) }
.teaser.square-layout .teaser-content h3 { -webkit-filter: blur(0) }
.teaser.square-layout .overlay::after { position: absolute; bottom: 0; -webkit-transition: all 0.25s ease; -moz-transition: all 0.25s ease; -o-transition: all 0.25s ease; transition: all 0.25s ease }
body { position: relative }
.teaser-container { position: absolute; top: 50%; -webkit-transform: translate(-50%, -50%); -moz-transform: translate(-50%, -50%); -o-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%) }
```

```js
addEventListener('mousemove', function(e){
```

### [Portfolio Hover](https://codepen.io/alyssax/pen/OdYrOV)

on hover of a.: a.: color | made with: transition · :hover

```css
.item { margin-top: 50px }
h1 { position: absolute; transition: all .3s cubic-bezier(.05,.03,.35,1) }
h2 { position: absolute; opacity: .5; margin-top: 38px }
h3 { margin-top: 50px }
h4 a { position: relative; transition: all .3s cubic-bezier(.05,.03,.35,1) }
h4 a:after { position: absolute; margin-top: 5px; opacity: .3; transition: all .3s cubic-bezier(.05,.03,.35,1) }
h4 a:hover:after { margin-top: 10px }
h1:hover { transform: scale(1.2); opacity: .5 }
img { position: absolute; opacity: .2; transform: scale(0); transition: all .15s cubic-bezier(.05,.03,.35,1) }
.ishover { transform: scale(1) }
```

### [Cards Parallax](https://codepen.io/ramirezhintze/pen/qgvaZG)

made with: transition · scroll listener

```css
.main__container { box-shadow: 0 .5rem 1rem rgba(0,0,0,.25) }
.card { box-shadow: 0 .5rem 1rem rgba(0,0,0,.25) }
```

```js
addEventListener('scroll', function(){
```

### [Parallax Image Scroll](https://codepen.io/richardhung/pen/ZwwrWE)

on scroll: img.img-1: transform+top ×5, img.img-2: transform+top ×5 | made with: scroll() timeline

```css
.row { position: relative }
.row img { position: absolute; top: 0 }
```

### [Beautiful parallax](https://codepen.io/FilipVitas/pen/NoOmrE)

held: fixed picture.hero-item, fixed div.hero-item, fixed picture.hero-item | on scroll: picture.hero-item: transform+top ×2 | made with: position: fixed · custom properties driven by JS · IntersectionObserver · scroll listener

```css
.hero img { -o-object-position: top; object-position: top }
.hero .title { transform: translate(-50%, 220px) }
.hero .hero-item { position: absolute }
.hero .hero-item:nth-child(1) { will-change: transform; transform: translateY(calc(var(--y) * -0.3)) }
.hero .hero-item:nth-child(3) { will-change: transform; transform: translateY(calc(var(--y) * -0.6)) }
.hero .parallax { position: fixed }
.blog-text { position: relative; box-shadow: 0px -30px 170px 80px #000 }
```

```js
style.setProperty('--y', `${window.scrollY}px`)
new IntersectionObserver(entries => {
addEventListener('scroll', onScroll, scrollOptions)
```

### [Strawberry #CodePenChallenge & Triangle Custom SVG Cursor](https://codepen.io/andrejsharapov/pen/daqqZe)

held: fixed svg.[object | on hover of img.: div.mix: transform+shadow+top | made with: position: fixed · @keyframes · transition · :hover · pointer / mouse tracking

```css
#cursor { position: fixed; top: 50%; transform: translate(-50%, -50%) }
header .heading { animation: dash 4s linear forwards }
header, footer { position: relative }
header .logo { transform: rotate(25deg) translate(-5px, -10px) }
main .parallax { position: absolute; top: 0; bottom: 0 }
main .parallax .layer { position: absolute; background-position: 90% 90% }
main .parallax .layer:nth-child(2) { background-position: 95% 10%; transform: scale(-1, 1) }
main article { position: relative }
main article::before { position: absolute; top: 8px; bottom: 8px }
main article h1 { text-transform: uppercase }
main article .mixes .mix { transition: transform 0.2s linear }
main article .mixes .mix:hover { transform: scale(1.03); box-shadow: 0px 5px 10px rgba(66, 66, 66, 0.3) }
```

```js
addEventListener("mousemove", function(n) {
```

### [forest parallax](https://codepen.io/harshitajain/pen/QYBYvM)

made with: requestAnimationFrame

```css
#mt { opacity:0.95; position:absolute; top:0vh }
#tree { top:0vh; opacity:0.9; position:absolute }
```

```js
requestAnimationFrame(move)
requestAnimationFrame(move1)
```

### [Parallax](https://codepen.io/FilipVitas/pen/NozJpo)

made with: clip-path · custom properties driven by JS · scroll listener

```css
.center img { position: absolute; top: 0; will-change: transform }
.center img:nth-child(1) { position: relative }
.center img:nth-child(2) { transform: translateY(calc(var(--y) * 0.8)) }
.center img:nth-child(3) { transform: translateY(calc(var(--y) * 1.2)); border-bottom: calc(var(--y) * -1.21) solid #000 }
.center .logo { position: absolute; top: 20px }
.center .header { position: absolute; top: 25vw; transform: translate(-50%, calc(var(--y) * 0.6)); will-change: transform }
.center .box-shadow { position: absolute; box-shadow: 0px 0px 50px 30px #000; transform: translateY(calc(var(--y) * 1.2)); will-change: transform }
.center .whatever { position: absolute; top: 55vw; transform: translateY(calc(var(--y) * 1.2)); will-change: transform }
.center .whatever span { opacity: 0.6 }
.button.sign { position: absolute; top: 20px }
section { transform: translateY(calc(var(--y) * 0.8)); will-change: transform }
.blog .title { margin-bottom: 20px }
```

```js
style.setProperty('--y', `${-window.scrollY}px`)
addEventListener('scroll', onScroll, { capture: false, passive: true })
```

### [Night on the mountain](https://codepen.io/ainalem/pen/NozEdo)

made with: clip-path · custom properties driven by JS · scroll listener · requestAnimationFrame

```css
.section { position: absolute }
.image { top: calc(50% - 50vmax); position: absolute }
.image1 { clip-path: polygon(0 100%, 0 29.863846%,0.3125% 30.21875%,0.4375% 30.625%,0.6875% 31.125%,0.9375% 31.1875%,1.0625% 31.71875%,1.3125% 32.40625%,1.53125% 32.3125%,1.96875% 32.375%,2.21875% 32.0625%,2.59375% 32.21875%,2.531 }
.image2 { opacity: var(--opacity); transform: scale(var(--scale)); -moz-transform: none }
.top-title { position: absolute; top: calc(40% - 6vmax); transform: translateY(var(--moveY)) scale(var(--scale)) }
.bottom-title { padding-top: 70px }
```

```js
style.setProperty('--moveY', (1 - pct) * 5)
style.setProperty('--scale', 1.25 - pct / 4)
style.setProperty('--opacity', pct)
style.setProperty('--moveY', `${(1 - pct) * (1 - pct) * 80}vh`)
style.setProperty('--scale', `${(pct / 2 + .5)}`)
addEventListener('scroll', function(e) {
requestAnimationFrame(function() {
```

### [Parallax video canvases with vanilla js](https://codepen.io/frontendmax/pen/OdEpVL)

held: sticky h1 | on scroll: div.video-frame: transform+top ×4 | made with: position: sticky · transition · canvas 2D · scroll listener · requestAnimationFrame

```css
.parallax-videos { position: relative }
.video-src { position: absolute; opacity: 0 }
.video-frame { position: absolute; transition: transform .5s ease-out }
.video-frame-1 { top: 630px }
.video-frame-2 { top: 130px }
.video-frame-3 { top: 65px }
.video-frame-4 { top: 605px }
.video-frame > canvas { opacity: .85; box-shadow: 0 0 0 rgba(0,0,0,0) }
.video-1 { transform: translate(-20%, -60%) scale(1.5) }
.video-2 { transform: translate(-15%, -5%) scale(0.95) }
.video-3 { transform: translate(-75%, 15%) scale(1.5) }
.video-4 { transform: translate(-62%, -20%) scale(1.5) }
```

```js
addEventListener('scroll', () => {
requestAnimationFrame(() => {
requestAnimationFrame(loop)
```

### [Pseudo Parallax (Pure CSS)](https://codepen.io/Palm_exe/pen/LqmOEj)

made with: mix-blend-mode

```css
h1 { mix-blend-mode: difference }
.sec { background-position: center }
```

### [Simple Parallax Effect](https://codepen.io/cupofmint/pen/pGLGWB)

on scroll: div.block: transform+top ×6 | made with: GSAP · scroll listener

```css
#app { position: relative }
.block { position: absolute }
.block.a { top: 10% }
.block.b { top: 20% }
.block.c { top: 5% }
.block.d { top: 40% }
.block.e { top: 50% }
.block.f { top: 65% }
```

```js
addEventListener('scroll', e => {
```

### [Parallax video canvases with GSAP](https://codepen.io/frontendmax/pen/wNmwJY)

held: sticky h1, sticky h2 | on scroll: div.video-frame: transform+top ×4 | made with: position: sticky · transition · GSAP · canvas 2D · scroll listener · requestAnimationFrame

```css
.parallax-videos { position: relative }
.video-src { position: absolute; opacity: 0 }
.video-frame { position: absolute }
.video-frame-1 { top: 600px }
.video-frame-2 { top: 100px }
.video-frame-3 { top: 35px }
.video-frame-4 { top: 575px }
.video-frame > canvas { opacity: .8; box-shadow: 0 0 0 rgba(0,0,0,0) }
.video-1 { transform: translate(-20%, -60%) scale(1.5) }
.video-2 { transform: translate(-15%, -5%) scale(0.95) }
.video-3 { transform: translate(-75%, 15%) scale(1.5) }
.video-4 { transform: translate(-62%, -20%) scale(1.5) }
```

```js
addEventListener('scroll', handleScroll)
requestAnimationFrame(loop)
addEventListener('scroll', () => {
requestAnimationFrame(() => {
```

### [parallax_mountain_moon](https://codepen.io/slow_izzm/pen/mvXgZM)

made with: position: fixed

```css
body { position: fixed; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%) }
```

### [Smooth Parallax Scrolling](https://codepen.io/sztr/pen/pGapEK)

held: fixed div, fixed div, fixed div | on scroll: div.: transform+top ×3 | made with: position: fixed · requestAnimationFrame

```css
h1 { text-transform: capitalize }
#bigCircle { background-position: center center; position: fixed; top: 0; opacity: 0.75 }
#square { background-position: 97% bottom; position: fixed; top: 0; opacity: 0.75 }
#pentagon { background-position: 5% top; position: fixed; top: 0; opacity: 0.75 }
```

```js
requestAnimationFrame(scrollLoop)
```

### [Parallax](https://codepen.io/ivSlesser/pen/KJZxeJ)

made with: scroll listener

```js
addEventListener("scroll", function() {
```

### [parallax scroll image full web](https://codepen.io/nguyenvan/pen/ZwvbEa)

on hover of a.: a.: color | made with: scroll() timeline · transition · :hover

```css
.p-content01 { position: relative; top: 0; bottom: 0 }
.p-content01_inner a { transition: all 0.2s ease-out }
.p-content01_inner a:hover { transition: all 0.2s ease-in }
.p-content03 { top: 0 }
.p-content03_inner a { transition: all 0.2s ease-out }
.p-content03_inner a:hover { transition: all 0.2s ease-in }
```

### [Pure CSS Parallax Scrolling](https://codepen.io/serktech/pen/xMPgqe)

made with: 3D (perspective / preserve-3d)

```css
body { perspective: 1px }
.navbar { padding-top:100px; text-transform: uppercase }
.parallax-wrapper { padding-top: 20vh }
.parallax-wrapper::before { top: 0; position: absolute; transform: translateZ(-1px) scale(2) }
.regular-wrapper { padding-top: 20vh; position: relative }
.content { opacity:0.95 }
```

### [Parallax roses](https://codepen.io/LeonNight/pen/xMXOMZ)

made with: nothing recognised — read the code

### [Another Parallax Effect](https://codepen.io/BracketMan/pen/bzgXLW)

on scroll: div.box: transform ×25 | made with: nothing recognised — read the code

```css
.container .image-container .box { box-shadow: 0px 1px 4px 0px #8240b180 }
```

### [Purple Liquid Gallery](https://codepen.io/RMKNGY/pen/omBMxq)

held: fixed div.loader, fixed div.fixed | made with: position: fixed · transition · :hover · mix-blend-mode · GSAP · scroll listener · requestAnimationFrame

```css
.loader { position: fixed; top: 0; bottom: 0 }
.fixed { position: fixed; bottom: 16px; text-transform: uppercase }
section .background_container { padding-bottom: 60%; position: relative }
section .background_container:after { position: absolute; top: 0; opacity: 0; mix-blend-mode: color-burn; transition: all 0.8s var(--ease) }
section .background_container:hover:after { opacity: 1 }
section .background_container:hover .background_container_text { opacity: 1 }
section .background_container_text { position: absolute; top: 50%; transform: translate(-50%, -50%); text-transform: uppercase; opacity: 0; transition: all 0.6s var(--ease) }
section .background_container img { position: absolute; top: 0 }
```

```js
addEventListener('scroll', () => {
requestAnimationFrame(parallax)
```

### [DNA Parallax / CSS Keyframes Scroll Animator](https://codepen.io/webdevelopers/pen/PVGKKO)

on scroll: big.big: transform+opacity+filter+color+top ×2, i.fas: color+top, i.fab: color+top, section.bg-image: filter+top | made with: @keyframes

```css
section { position: relative }
section::before { position: absolute; top: 0px; opacity: 0.5 }
0% { transform: translate(150vw, 150vh) rotate(-360deg) scale(0) skew(0deg); opacity: -0.5 }
40% { transform: translate(0vw, 0vw) rotate(0deg) scale(1) skew(0deg); opacity: 1 }
60% { transform: translate(0vw, 0vw) rotate(0deg) scale(1) skew(0deg); opacity: 1; filter: blur(0vw) }
65% { transform: translate(-20vw, 0vw) rotate(0deg) scale(1) skew(-45deg); filter: blur(0.5vh) }
75% { transform: translate(-100vw, 0vw) rotate(0deg) scale(1) skew(-45deg); opacity: -0.5; filter: blur(1vh) }
0% { transform: translate(-150vw, 150vh) rotate(360deg) scale(0) }
65% { transform: translate(20vw, 0vw) rotate(0deg) scale(1) skew(45deg) }
75% { transform: translate(100vw, 0vw) rotate(0deg) scale(1) skew(45deg) }
0% { background-position: 0vw 0vh }
50% { filter: blur(0px) }
```

### [Parallax](https://codepen.io/racoon-clerk/pen/EryZRz)

made with: transition · 3D (perspective / preserve-3d)

```css
body { perspective: 1px }
h1 { margin-top: 10%; margin-bottom: 0 }
header::before { position: absolute; bottom: 0; top: 0; background-position: center; transition: 3s; transform: translateZ(-1px) scale(2) }
```

### [// // //](https://codepen.io/LimeWub/pen/mvVqJO)

on scroll: div.: transform+top ×24 | made with: @keyframes · custom properties driven by JS · scroll listener

```css
body [data-dtt] { text-transform: uppercase }
body [data-dtt-part] { transform: translatey(calc( var(--pc) * var(--wiggle) * 100% - 50% * var(--wiggle))) }
[data-dtt] { position: relative }
[data-dtt-container] { position: absolute; top: 50%; transform: translatex(-50%) translatey(-50%) }
[data-dtt-part] { position: absolute }
.directon { position: absolute; top: 0; transform: translatex(-50%) }
.directon:after { position: absolute; bottom: 0; border-bottom: 2px solid; animation: ad 0.5s infinite alternate linear }
0% { transform: translatey(-50%) translatex(-50%) rotate(45deg) }
100% { transform: translatey(50%) translatex(-50%) rotate(45deg) }
@keyframes ad animates transform
```

```js
style.setProperty('--pc', percent)
addEventListener("scroll", e => {
```

### [lb Parallax](https://codepen.io/laurent-b/pen/MLYrqG)

made with: scroll() timeline

```css
.box { position:relative }
.lb.parallax { position:relative }
.lb.parallax > * { position: relative }
.lb.parallax .inner-parallax { position:absolute; top:auto; bottom:0 }
```

### [CSS Parallax Header](https://codepen.io/bvanbree/pen/daPbOp)

made with: 3D (perspective / preserve-3d)

```css
body { perspective: 1px }
header { position: relative }
header>.header-img { position: absolute; top: 0; transform: translateZ(-1px) scale(2); background-position: center 30%; transform-origin: center bottom }
section { position: relative; padding-top: 1em }
.content { position: relative }
```

### [Twilight driving](https://codepen.io/photodow/pen/mvdrdy)

held: fixed article.sunset-drive | on scroll: div.container: transform+top ×2, div.stars-small: opacity, div.stars-small-twinkle: opacity, div.stars-small-twinkle-twinkle: opacity | made with: position: fixed · @keyframes · mix-blend-mode · requestAnimationFrame

```css
.instructions { position: absolute; bottom: 0 }
.wrapper { position: relative }
.trees .tree { position: absolute; bottom: 100% }
.trees-front, .trees-back { position: absolute; top: 0 }
.trees-front .container, .trees-back .container { position: relative }
.trees-front .tree { filter: drop-shadow(1px -1px 0 #FFF) }
.car { position: absolute; transform: scale(1, 1) translate(-50%, 0); top: -8.1vw; filter: drop-shadow(3px -1px 0 #FFF) }
.car.moving { -webkit-animation-name: car-jig; animation-name: car-jig; -webkit-animation-duration: 0.35s; animation-duration: 0.35s; -webkit-animation-iteration-count: infinite; animation-iteration-count: infinite }
0% { transform: scale(1, 1) translate(-50%, 0) }
25% { transform: scale(1, 1.05) translate(-50%, -1px) }
75% { transform: scale(1, 0.995) translate(-50%, 1px) }
100% { transform: scale(1, 1) translate(-50%, 0) }
```

```js
addEventListener('wheel', e => {
requestAnimationFrame(demoScroll)
```

### [Materialize - Parallax](https://codepen.io/j_holtslander/pen/NoKqQP)

held: fixed div.fixed-action-btn, fixed div | made with: nothing recognised — read the code

### [Parallax css (flex)](https://codepen.io/sergey-kazachenko/pen/KbGddg)

made with: 3D (perspective / preserve-3d)

```css
.wraper { perspective: 1px }
section { position: relative }
.background { background-position: center; position: relative; transform: translateZ(-1px) scale(2) }
```

### [Mouse Move Parallax ✨](https://codepen.io/oscicen/pen/zyJeJw)

made with: pointer / mouse tracking

```css
#parallax { position: relative; background-position: center; background-position: 50% 50% }
h1 { position: absolute; top: 47%; transform: translate(-50%, -50%); text-transform: uppercase; opacity: .2 }
```

```js
addEventListener("mousemove", parallax)
```

### [Parallax Effect - No Script](https://codepen.io/alchatti/pen/WLgaWv)

made with: mix-blend-mode · 3D (perspective / preserve-3d)

```css
h2 { margin-top: 0 }
body { perspective: 1px }
.wrapper { position: relative }
.wrapper > div { mix-blend-mode: exclusion }
.parallax::before { position: absolute; top: 0; transform: translateZ(-1px) scale(2) }
```

### [An implementation design](https://codepen.io/sergiulucutar/pen/QzBoxO)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
:root *, :root *:before, :root *:after { transition: all 1s cubic-bezier(0.55, 0, 0.1, 1) }
.bg { background-position: center }
.bg-wrapper { position: absolute; top: 0; transform: scale(1.07) perspective(1000px) rotate3d(0, 1, 0, 0deg) }
.bg-tilter { position: absolute; top: 0 }
.bg-tilter:hover ~ .bg-wrapper { transform: scale(1.07) perspective(1000px) rotate3d(0, 1, 0, -3deg) }
.bg-tilter:hover ~ .hero span { background-position: 50% -100%; transform: scale(1.07) perspective(1000px) rotate3d(0, 1, 0, 3deg) }
main { position: relative }
main .hero span { background-position: 50% 50%; transform: scale(1.07) perspective(1000px) rotate3d(0, 1, 0, 0deg) }
main .menu .logo { position: relative }
main .menu .logo i, main .menu .logo span { position: absolute }
main .menu .logo i { opacity: 0 }
main .menu .logo span { opacity: 1 }
```

### [Season Parallax](https://codepen.io/chen1223/pen/pqZWbg)

made with: 3D (perspective / preserve-3d)

```css
.parallax-wrapper { perspective: 1px }
.background { background-position: center; position: relative; transform: translateZ(-1px) scale(2) }
.title { position: absolute; top: calc(50% - 50px); text-transform: uppercase }
.season-desc { position: relative }
.season-desc .season--title { text-transform: uppercase }
.season-desc .season--about { margin-top: 50px }
.season-desc .season-about { margin-top: 20px }
```

### [影のあとに画像を表示](https://codepen.io/saio-th/pen/XoqERL)

on scroll: img.: transform+top ×2 | made with: transition

```css
.img-wrap .img { position: relative; margin-bottom: 2% }
.img-wrap .img:after { position: absolute; top: 2px; transform: translate3d(-110%, 0, 0); transition: transform 0.3s ease-in-out 0s }
.img-wrap .img img { position: relative; transform: translate3d(-105%, 0, 0); transition: transform 0.2s ease-in-out 0.3s }
.img-wrap .img.show:after { transform: translate3d(0, 0, 0) }
.img-wrap .img.show img { transform: translate3d(0, 0, 0) }
```

### [Parallax Responsive Daycare Website](https://codepen.io/joshh9305/pen/yGpNRd)

held: fixed nav | made with: position: fixed · transition · :hover

```css
nav { position: fixed; top:0; transition: .5s; opacity: 1 }
nav .logo img { transition: .5s }
nav ul li { margin-top: 25px; text-transform: uppercase; transition: 1s }
.parallax1, .parallax2, .parallax3, .parallax4, .parallax5, .parallax6 { position: relative; opacity: .75; background-position: center }
.heading { position: absolute; top: 38%; text-transform: uppercase }
.heading2 { position: absolute; top: 50%; text-transform: uppercase }
.heading-sm { position: absolute; top: 45%; text-transform: uppercase }
input[type=text], select, textarea { margin-top: 6px; margin-bottom: 16px }
```

### [Happy Emoji New Year](https://codepen.io/rasenguy/pen/BvmQNY)

on scroll: img.rellax: transform+top ×450 | made with: GSAP

### [Parallax Effect | Zoom on scroll](https://codepen.io/Domdom787/pen/YdEKWV)

made with: scroll() timeline

```css
.hero-back { position: relative; -webkit-filter: grayscale(100%); filter: grayscale(200%); filter:brightness(40%) }
.main-title { margin-top: 0px; padding-top: 10%; text-transform: uppercase }
.hero-back img { position: absolute; top: 0; bottom: 0; -webkit-filter: grayscale(100%); filter: grayscale(100%) }
```

### [Parallax effect with GSAP and ScrollMagic in Vanilla JS](https://codepen.io/mathieudaix/pen/jXwjKa)

on scroll: div.: transform+top ×3 | made with: GSAP

```css
.ctnr .bloc { margin-bottom: 10rem }
.ctnr .bloc:last-of-type { margin-bottom: 0 }
.ctnr .bloc div { background-position: center center }
```

### [Scroll pinning library](https://codepen.io/kasarda/pen/mamybq)

held: fixed div.target, fixed article | on scroll: div.target: opacity+top | made with: position: fixed · scroll listener

```css
article { position: fixed; top: 20px }
```

```js
addEventListener('scroll', _ => this.updatePin())
```

### [BoardMag Blogger Template](https://codepen.io/lilithirsch/pen/NepoNx)

held: fixed header.default, fixed div.cookie-choices-info | on hover of a.: div.slider_caption: opacity+top ×4, p.caption: opacity+top ×4, li.uj_slider_item: opacity ×2 | made with: position: fixed · :hover

### [Parallax waves](https://codepen.io/rmnsps/pen/KbaRVw)

on hover of img.: div.: transform ×2, div.: transform+top | made with: nothing recognised — read the code

```css
button { top: 260px; position: absolute }
.fill { bottom: 5%; position: absolute; top: 5% }
.aspect { opacity: 0.2 }
.slider-container { margin-top: 6vh }
```

### [Parallax Effect (HTML & CSS)](https://codepen.io/Reeh/pen/pqNzdx)

made with: nothing recognised — read the code

```css
.parallax { background-position: center }
.frontpage_text { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

### [Parallax split-section hero](https://codepen.io/joebentaylor/pen/KbMQab)

held: fixed section | on scroll: img.: transform+top, div.this-title: transform | made with: position: fixed · transition · :hover

```css
section { position: fixed; top: 0; bottom: 0 }
.this { position: relative }
.this { transition: all 1.1s cubic-bezier(0.8, 0, 0.2, 1) }
.this:hover .this-image img { transform: scale(1) }
.this-image { position: relative }
.this-image img { position: relative; -o-object-position: center center; object-position: center center; transform: scale(1.2); transition: all 1s cubic-bezier(0.8, 0, 0.2, 1) }
.this-image img { top: 50%; transform: translate(-50%, -50%) }
.this-title { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.this-title h2 { text-transform: uppercase }
.choose { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.choose h3 { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

### [Sidebar Multitask](https://codepen.io/andikachamberlin/pen/wRWdNR)

held: fixed div._parside-content, fixed div._parside-content, fixed div._parside-content | made with: position: fixed · transition · :hover

```css
._jelly-circle { position: relative }
._jelly-circle:before { position: absolute; top: 50%; transform: translate(-50%,-50%); transition: 0.5s cubic-bezier(.68,-0.55,.27,1.55) }
._parside-content { position: fixed; top: 0; bottom: 0; box-shadow: 1px 1px 6px #bbb; transition: 0.7s }
._parside-overflow { transition: 1s }
._parside-close { position: absolute; top: 0 }
```

### [Parallax Sidebar](https://codepen.io/andikachamberlin/pen/aPZbra)

held: fixed div._parside-content | made with: position: fixed · transition · :hover

```css
._jelly-circle { position: relative }
._jelly-circle:before { position: absolute; top: 50%; transform: translate(-50%,-50%); transition: 0.5s cubic-bezier(.68,-0.55,.27,1.55) }
._parside-content { position: fixed; top: 0; bottom: 0; box-shadow: 1px 1px 6px #bbb; transition: 0.7s }
._parside-overflow { transition: 1s; transform: translateX(-100%) }
._parside-close { position: absolute; top: 0 }
._parside-overflow._parside-overflow-active { transform: translateX(0) }
```

### [Simple parallax header components](https://codepen.io/atmoscreative/pen/jXWYVK)

made with: nothing recognised — read the code

```css
.text h2 { position: relative }
.text h4 { position: relative }
#summary .parallax-one { padding-top: 150px; padding-bottom: 150px; position: relative; background-position: top center }
#summary .parallax-two { padding-top: 150px; padding-bottom: 150px; position: relative; background-position: center center }
#summary .parallax-three { padding-top: 150px; padding-bottom: 150px; position: relative; background-position: center center }
.darken-image { position: relative }
.darken-image:after { position: absolute; top: 0; bottom: 0 }
```

### [Day 1: Perspective Parallaxed Text](https://codepen.io/zephyo/pen/gZamXe)

made with: transition · :hover · mix-blend-mode · pointer / mouse tracking

```css
.background { position: absolute; top: 0; bottom: 0; transition: transform 1.2s cubic-bezier(0.1, 0.18, 0.28, 0.98) }
.background:before { position: absolute; top: 0; bottom: 0; mix-blend-mode: screen; opacity: 0.7 }
.text-wrapper { position: absolute; transition: transform 0.7s cubic-bezier(0.16, 0.2, 0.38, 0.98) }
.welcome { position: absolute; transition: inherit }
.header { position: relative; transition: inherit }
.description { margin-top: 30px; margin-bottom: 50px; transition: inherit }
.button-wrapper { transition: inherit }
.menu-button { text-transform: uppercase; transition: all 0.2s ease-in; position: relative }
.menu-button:before { position: absolute; opacity: 0; transition: inherit }
.menu-button:hover:before { opacity: 1 }
```

```js
addEventListener("mousemove", rotate)
```

### [Scrubby Vertical Menu](https://codepen.io/round/pen/wRBWwq)

on hover of li.item: ul.menu: transform+top | made with: :hover

```css
.page .menu .item { text-transform: uppercase }
```

### [#137_Parallax - Marc Márquez i Alentà](https://codepen.io/robert-peri/pen/VqYYOq)

held: fixed div.glava, fixed div.noga | made with: requestAnimationFrame

```css
h1 { padding-bottom: 1.2vh }
h2 { padding-bottom: 1.2vh }
.tabela { padding-top: 10vh; padding-bottom: 1.8vh }
.prvak { position: relative; padding-top: 1vh }
.sredina { position: relative; padding-top: 2vh; padding-bottom: 2vh }
hr { border-top: 0.2vh solid royalblue; margin-top: 2vh; margin-bottom: 2vh }
.level { position: absolute }
.marc { position: relative; padding-top: 5vh; padding-bottom: 5vh; transform: translatex(-50%); -webkit-transform: translatex(-50%); -moz-transform: translatex(-50%); -ms-transform: translatex(-50%); -o-transform: translatex(-50 }
.tab { position: relative; padding-top: 1vh; padding-bottom: 1vh }
.parent { position: relative; top: -1vh }
.prvak { position: relative; top: 0 }
.podpis { position: absolute; bottom: 8vh }
```

### [simple parallax vanilla js](https://codepen.io/s17711/pen/madNgY)

on scroll: div.bgPar: transform, div.posx: transform+top, div.posy: transform | made with: transition

```css
.div { position: relative }
.bgPar { transition: all 0.3; position: absolute; margin-top: -5%; background-position: 40% 40% }
.posx, .posy { position: absolute }
.posy { margin-top: 0 }
.posx { margin-top: 50vh }
```

### [#139_Slovenija - {"Parallax" scrolling}](https://codepen.io/robert-peri/pen/JwjNyV)

held: fixed div.glava, fixed div.znak, fixed div.noga | on hover of a.: a.: color | made with: position: fixed

```css
.title { padding-top: 0.5vh; padding-bottom: 0.5vh }
.split-1 { position: relative; padding-top: 0.2vh; padding-bottom: 0.4vh }
.split-2 { padding-top: 0.2vh; padding-bottom: 0.4vh }
.split-3 { padding-top: 0.2vh; padding-bottom: 0.4vh }
.split-4 { padding-top: 0.2vh; padding-bottom: 0.4vh }
.split-5 { padding-top: 0.2vh; padding-bottom: 0.4vh }
.split-6 { padding-top: 0.2vh; padding-bottom: 0.4vh }
.split-end { padding-top: 0.2vh; padding-bottom: 0.4vh }
.parallax { background-position: center }
.para-6 { position: relative }
.footer { text-transform: lowercase }
.znak { position: fixed; bottom:7vh }
```

### [Blog page concept with cursor image on hover](https://codepen.io/ig_design/pen/OrLBqO)

held: fixed a.link-to-portfolio | on scroll: div.col-12: transform+opacity+top ×3, div.col-12: opacity+top | on hover of a.cursor-link-blog-post-1: div.col-12: opacity ×2, a.cursor-link-blog-post-1: color, div.blog-post-box: color, div.cursor: transform+top, div.cursor: opacity+top | made with: position: fixed · transition · :hover · mix-blend-mode · 3D (perspective / preserve-3d) · scroll listener · requestAnimationFrame

```css
h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 { margin-bottom: 0 }
.section { position: relative }
.padding-top-bottom-big { padding-top: 140px; padding-bottom: 140px }
.padding-top-big { padding-top: 140px }
.padding-bottom-big { padding-bottom: 140px }
.padding-top-bottom { padding-top: 100px; padding-bottom: 100px }
.padding-top { padding-top: 100px }
.padding-bottom { padding-bottom: 100px }
.cursor { position: absolute; transform: translate(-50%, -50%) }
.cursor.cursor-shadow { transition: top .2s, left .2s, width .2s, height .2s, background-color .2s, border-color 0.2s }
.cursor.cursor-dot { transition: width .2s, height .2s }
.blog-post-box { position: relative }
```

```js
addEventListener("scroll",r,!1),t.addEventListener("resize",n,!1)},_scrollPage:functi
```

### [Warby Parker Scroll Parallax Effect](https://codepen.io/gil/pen/mabOgM)

made with: canvas 2D

### [Parallax effect CSS](https://codepen.io/manshis/pen/qQwPjX)

made with: nothing recognised — read the code

```css
.wrapper { position: absolute }
.heading { position: absolute; margin-top: 200px; box-shadow: 5px 5px 10px grey }
.parallax { background-position: top }
```

### [Simple Particle System with Parallax](https://codepen.io/cwgw/pen/XyOZKg)

held: fixed canvas | made with: position: fixed · canvas 2D · requestAnimationFrame

```css
canvas { position: fixed; top: 0; bottom: 0 }
```

```js
requestAnimationFrame(this.tick)
requestAnimationFrame(fn)
```

### [Magdiellop 216 recreated with CSS](https://codepen.io/Craaftx/pen/yQGpwa)

on scroll: div.art: transform, div.texts: transform, div.round: transform, img.man: transform | made with: pointer / mouse tracking

```css
.wrapper { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.wrapper { transform: translate(-50%, -50%) scale(0.8) }
.noise { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.art { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.texts { position: absolute; top: 50%; transform: translate(-50%, -50%) }
span { position: absolute }
span#text_1 { top: 35px }
span#text_2 { text-transform: uppercase; top: 50px }
span#text_3 { top: 35px }
span#text_4 { text-transform: uppercase; top: 50%; transform: rotate(90deg) translateY(-50%) }
span#text_5 { text-transform: uppercase; top: 50%; transform: rotate(90deg) translateY(-50%) }
span#text_6 { text-transform: uppercase; bottom: 30px; transform: translateX(-50%) }
```

```js
addEventListener('mousemove',function(e){
```

### [Parallax scroll effect](https://codepen.io/JullsP/pen/KrBeKB)

on scroll: div.section__content: opacity+top ×2 | made with: scroll listener

```css
.section { position: relative; background-position: 0 0 }
.section__content { position: absolute; top: 50%; transform: translate(0, -50%) }
.caption { text-transform: uppercase }
```

```js
addEventListener('scroll', ParallaxScroll._event)
```

### [Horizontal Banners w/ Hover Reveal](https://codepen.io/TheWebDevKev/pen/MzBEZW)

on hover of div.h-card-container: p.: opacity+top | made with: transition · :hover

```css
.h-card-container { margin-top: 30px }
.h-card { box-shadow: 0px 1px 5px #000; margin-bottom: 20px; transition: all 0.25s ease-out }
.h-card:hover { padding-top: 80px; padding-bottom: 80px }
.h-card:hover p { opacity: 1 }
.h-card p { opacity: 0; transition: opacity 0.25s ease-out }
```

### [31 | Parallax with rellax.js](https://codepen.io/yitliu/pen/RqyYZo)

on scroll: img.rellax: transform+top ×18 | made with: nothing recognised — read the code

```css
.container section { margin-top: 28px }
.container section .ctnt { margin-top: -375px }
.container section .ctnt { margin-top: -460px }
.btn { margin-top: 20px }
.background { opacity: 0.5; position: relative }
.background img { position: absolute }
```

### [window.onscroll](https://codepen.io/ohsoren/pen/mQpwyE)

held: fixed button | on scroll: button.: color, div.: transform+top | made with: position: fixed · transition · requestAnimationFrame

```css
section { position: relative }
div { position: absolute; bottom: 0 }
button { position: fixed; top: 20px; transition: .2s }
button:after { position: absolute; top: 0; bottom: 0; transition: .2s }
```

```js
requestAnimationFrame(function() {
```

### [Parallax is the way.](https://codepen.io/j4rl/pen/QJOeJj)

made with: 3D (perspective / preserve-3d)

```css
body { perspective: 1px }
section { position: relative; box-shadow: 0 -1px 10px rgba(0, 0, 0, .7) }
section:before { position: absolute; top: 0; bottom: 0; box-shadow: 0 0 8px 1px rgba(0, 0, 0, .7) }
img { position: absolute; top: 50%; transform: translateZ(.25px) scale(.75) translateX(-94%) translateY(-100%) rotate(2deg); box-shadow: 0 0 8px rgba(0, 0, 0, .7) }
img:last-of-type { transform: translateZ(.4px) scale(.6) translateX(-104%) translateY(-40%) rotate(-5deg) }
.title { box-shadow: 0 0 8px rgba(0, 0, 0, .7) }
#top h1 { transform: translateZ(.25px) scale(.75) }
#one:before { transform: translateZ(-1px) scale(2) }
#three:before { transform: translateZ(-1px) scale(2) }
```

### [scrollout.js parallax test](https://codepen.io/lazysergey/pen/zMdWWN)

held: sticky div.section__background, sticky div.section__background, sticky div.section__background, sticky div.section__background, sticky div.section__background, sticky div.section__background | on scroll: span.char: opacity+top ×13 | made with: position: sticky

```css
.section { position: relative }
.section__background { position: -webkit-sticky; position: sticky; top: 0 }
.section__background:after { position: absolute; bottom: 0; top: 0; opacity: calc((var(--viewport-y) + 0.5) / 1.5); opacity: calc(1 + ((var(--viewport-y) * 1.5))) }
.section__background > img { position: absolute; top: 0px; transform: scale(1.25) translateY(calc(-20px * ( var(--viewport-y) + 2))) }
.section__container { padding-bottom: 30vh; position: relative }
.section__heading { text-transform: uppercase; position: relative; padding-bottom: 50px; margin-bottom: 50px }
.section__heading:after { position: absolute; top: 100% }
.section__content p + p { margin-top: 20px }
.splitting .char { opacity: calc(1 + ((var(--viewport-y) * 1.5) - var(--char-percent))) }
```

### [parallax](https://codepen.io/allanwelerson/pen/Mzopyr)

made with: nothing recognised — read the code

```css
.image h2 { text-transform: capitalize }
.img1 { background-position: center }
.img2 { background-position: center }
.img3 { background-position: center }
```

### [Mini Parallax CursorMove](https://codepen.io/liverov/pen/JeWMPq)

on scroll: div.parallax: transform+top | made with: pointer / mouse tracking

```css
html,body { position: relative }
.parallax { position: absolute }
```

```js
addEventListener("mousemove", function(e) {
```

### [Simple In-Body Parallax](https://codepen.io/lexa45ru/pen/LgBQqP)

made with: transition

```css
.block-title { margin-top: 35px; margin-bottom: 20px }
.item-block { margin-bottom: 60px }
.item-descr_line:last-of-type { border-bottom: none }
.item-descr_line { padding-bottom: 12px; margin-bottom: 15px; border-bottom: 1px solid #d9d9d9 }
.item-block .info-block_title { margin-bottom: 5px }
p.info-block_title { text-transform: uppercase }
.next-live { border-top: 6px solid #030000; border-bottom: 6px solid #030000 }
.parallink { text-transform: uppercase; -webkit-transition: all .1s; -o-transition: all .1s; transition: all .1s }
.list-reason li { border-bottom: 6px solid #030000; text-transform: uppercase }
```

### [CSS Variable Cursor Parallax](https://codepen.io/ekfuhrmann/pen/rqvEzO)

on scroll: img.image: transform ×4, img.image: transform+top ×2 | on hover of img.image: img.image: transform ×4, img.image: transform+top ×2 | made with: pointer / mouse tracking · requestAnimationFrame

```css
.images { position: relative }
.image { position: absolute; top: 0; bottom: 0 }
.image:nth-of-type(1) { transform: translate3d(calc(var(--parallax-x) * 0.7), calc(var(--parallax-y) * 0.7), 0) scale(1.07) }
.image:nth-of-type(2) { transform: translate3d(calc(var(--parallax-x) * 0.6), calc(var(--parallax-y) * 0.4), 0) scale(1.04); margin-top: 1% }
.image:nth-of-type(3) { transform: translate3d(calc(var(--parallax-x) * 0.8), calc(var(--parallax-y) * 0.5), 0) scale(1.1) }
.image:nth-of-type(4) { transform: translate3d(calc(var(--parallax-x) * 0.5), calc(var(--parallax-y) * 0.3), 0) scale(1.03); margin-top: auto; bottom: 15vh }
.image:nth-of-type(5) { transform: translate3d(calc(var(--parallax-x) * 0.4), calc(var(--parallax-y) * 0.4), 0) scale(1.05) }
.image:nth-of-type(6) { transform: translate3d(calc(var(--parallax-x) * 0.1), calc(var(--parallax-y) * 0.1), 0) scale(1.05) }
```

```js
requestAnimationFrame(moveBackground)
addEventListener('mousemove', e => {
```
