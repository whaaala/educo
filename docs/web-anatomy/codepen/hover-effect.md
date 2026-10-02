# CodePen · hover-effect — how each pen does it

580 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/hover-effect.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| :hover | 547 |
| transition | 519 |
| @keyframes | 110 |
| 3D (perspective / preserve-3d) | 64 |
| position: fixed | 46 |
| pointer / mouse tracking | 30 |
| backdrop-filter | 27 |
| clip-path | 26 |
| mix-blend-mode | 22 |
| requestAnimationFrame | 18 |
| custom properties driven by JS | 14 |
| mask | 12 |
| GSAP | 12 |
| canvas 2D | 7 |
| (hover: hover) gate | 7 |
| :focus-visible | 6 |
| prefers-reduced-motion | 6 |
| three.js / WebGL | 4 |
| position: sticky | 3 |
| ScrollTrigger | 2 |
| :has() | 2 |
| Web Animations API (.animate) | 2 |
| IntersectionObserver | 1 |
| scroll listener | 1 |
| scroll() timeline | 1 |

## Every pen

### [Card Shift: 3D-ish](https://codepen.io/editor/grauconejo13/pen/01a0e5f2-2977-7e86-81d8-948dfaa6610a)

made with: transition · :hover · :focus-visible · prefers-reduced-motion · 3D (perspective / preserve-3d)

```css
header { margin-bottom: 3rem }
header small { margin-top: 1.3rem }
.scene { position: relative; perspective: 1000px }
.card { position: absolute; inset: 0; box-shadow: 0 1.3rem 2.8rem rgba(0,0,0,0.35); transform-origin: center bottom; transition: transform 700ms cubic-bezier(.2,.72,.2,1) }
.card::before { position: absolute; inset: 18% 0 12%; filter: blur(12px) }
.number { position: absolute; top: 1rem }
.card-art { position: absolute; top: 15%; filter: drop-shadow(0 1rem 1rem rgba(0,0,0,0.45)); transition: opacity 350ms ease }
.card-info { position: absolute; bottom: 1rem }
.type { text-transform: uppercase }
.model { position: absolute; top: 3%; opacity: 0; transform: translateY(2rem) scale(0.8); transform-origin: center bottom; filter: drop-shadow(0 1.5rem 0.9rem rgba(0,0,0,0.52)); transition: opacity 220ms ease 110ms, transform 650 }
.reveal-text { position: absolute; bottom: 1.1rem; opacity: 0; text-transform: uppercase; transition: opacity 200ms ease 250ms }
.scene:hover .card, .scene.active .card { transform: rotateX(69deg) translateY(3.25rem) scale(0.91) }
```

### [Premium Social Media Icon Buttons](https://codepen.io/editor/getcoderipple/pen/01a0d2b1-0e5e-7e1f-9f90-c9e7af00e685)

on hover of a.cr-social-btn: a.cr-social-btn: transform+color+shadow+top, svg.[object: transform+filter+color+top, path.[object: color+top | made with: transition · :hover · :focus-visible · prefers-reduced-motion

```css
.cr-social-btn { position: relative; box-shadow: 9px 9px 18px rgba(163, 177, 198, 0.42), -9px -9px 18px rgba(255, 255, 255, 0.96), inset 1px 1px 1px rgba(255, 255, 255, 1); transition: transform 0.35s cubic-bezier(.2, .8, .2, 1), color 0 }
.cr-social-btn::before { position: absolute; bottom: -10px; transform: translateX(-50%) scale(0.55); filter: blur(15px); opacity: 0; transition: opacity 0.35s ease, transform 0.35s ease }
.cr-social-btn svg { position: relative; transition: transform 0.35s cubic-bezier(.2, .8, .2, 1), filter 0.3s ease }
.cr-social-btn:hover { transform: translateY(-11px) scale(1.06); box-shadow: 0 22px 25px rgba(105, 116, 135, 0.23), 0 10px 22px rgba(var(--brand-rgb), 0.18), -8px -8px 18px rgba(255, 255, 255, 1), inset 1px 1px 1px rgba(255, 255, 255, 1) }
.cr-social-btn:hover::before { opacity: 0.68; transform: translateX(-50%) scale(1) }
.cr-social-btn:hover svg { transform: translateY(-2px) scale(1.17); filter: drop-shadow( 0 3px 4px rgba(var(--brand-rgb), 0.30) ) drop-shadow( 0 0 8px rgba(var(--brand-rgb), 0.18) ) }
.cr-social-btn--instagram:hover { box-shadow: 0 22px 25px rgba(105, 116, 135, 0.23), 0 9px 22px rgba(214, 41, 118, 0.22), -8px -8px 18px rgba(255, 255, 255, 1), inset 1px 1px 1px rgba(255, 255, 255, 1) }
.cr-social-btn:active { transform: translateY(-2px) scale(0.96); box-shadow: inset 6px 6px 12px rgba(163, 177, 198, 0.38), inset -6px -6px 12px rgba(255, 255, 255, 0.92) }
.cr-social-btn:focus-visible { outline-offset: 6px }
.cr-social-btn, .cr-social-btn::before, .cr-social-btn svg { transition: none }
```

### [Neon Orbit CSS Button Hover Effect](https://codepen.io/editor/getcoderipple/pen/01a0cd2d-b7f5-7f10-9143-21202f7b6fc7)

on scroll: span.cr-neon-orbit-btn__runner: transform+top | on hover of button.cr-neon-orbit-btn: button.cr-neon-orbit-btn: transform+top, span.cr-neon-orbit-btn__track: opacity+shadow+top, span.cr-neon-orbit-btn__runner: transform+top, span.cr-neon-orbit-btn__face: background+shadow+top, span.cr-neon-orbit-btn__content: color+top, span.cr-neon-orbit-btn__label: color+top | made with: @keyframes · transition · :hover · :focus-visible · prefers-reduced-motion

```css
.cr-neon-orbit-btn { position: relative; transition: transform 0.3s ease }
.cr-neon-orbit-btn__track { position: absolute; inset: -3px; opacity: 0; box-shadow: 0 0 0 rgba(34, 211, 238, 0), 0 0 0 rgba(168, 85, 247, 0); transition: opacity 0.3s ease, box-shadow 0.3s ease }
.cr-neon-orbit-btn__runner { position: absolute; top: 50%; margin-top: -160px; animation: cr-neon-orbit-spin 2.2s linear infinite }
.cr-neon-orbit-btn__face { position: absolute; inset: 0; box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.95); transition: inset 0.3s ease, background 0.3s ease, box-shadow 0.3s ease }
.cr-neon-orbit-btn__content { position: relative; transition: color 0.3s ease }
.cr-neon-orbit-btn__arrow { transition: transform 0.3s ease }
.cr-neon-orbit-btn:hover { transform: translateY(-2px) }
.cr-neon-orbit-btn:hover .cr-neon-orbit-btn__track { opacity: 1; box-shadow: 0 0 12px rgba(34, 211, 238, 0.35), 0 0 22px rgba(139, 92, 246, 0.28), 0 0 32px rgba(217, 70, 239, 0.18) }
.cr-neon-orbit-btn:hover .cr-neon-orbit-btn__face { inset: 3px; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.035), 0 12px 30px rgba(0, 0, 0, 0.4) }
.cr-neon-orbit-btn:hover .cr-neon-orbit-btn__arrow { transform: translateX(5px) }
from { transform: rotate(0deg) }
to { transform: rotate(360deg) }
```

### [Creative Button Hover Text Swap | Pure CSS](https://codepen.io/editor/hazemali-dev/pen/01a0b541-675c-7527-bf7a-ecfff2026a39)

on hover of a.link: span.: transform | made with: transition · :hover

```css
.link { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: 0.3s }
.link::before { position: absolute; top: 0; transform: translateX(-100%); transition: 0.3s }
.link span { transition: .3s }
.link:hover::before { transform: translateX(0) }
.link:hover span { transform: translateX(100%) }
```

### [Halftone Hover Effect](https://codepen.io/AllThingsSmitty/pen/MYpKGxL)

made with: prefers-reduced-motion · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
.frame { position: relative }
```

```js
requestAnimationFrame(loop)
addEventListener("pointermove", (e) => {
```

### [Card Hand with Balatro style idle sway and hover effect shine](https://codepen.io/editor/JoeyLitten/pen/01a05e0e-242b-7fd9-8159-70c665e74f28)

on scroll: div.float-wrap: transform+top ×5, div.card-shadow: transform+opacity+top, div.card: transform+top | on hover of div.card-shadow: div.float-wrap: transform+top ×4, div.float-wrap: transform | made with: @keyframes · transition · mix-blend-mode · 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking

```css
.float-wrap { animation: sway 4.4s ease-in-out infinite }
0%,100% { transform: translateY(0) rotate(var(--r1, -2deg)) }
50% { transform: translateY(-10px) rotate(var(--r2, 2deg)) }
.tilt-stage { position:relative }
.card-shadow { position:absolute; bottom:8%; filter:blur(6px); transition: transform 0.15s cubic-bezier(.17,.67,.3,1.4), opacity 0.15s ease }
.card { position:relative; box-shadow:0 6px 14px rgba(0,0,0,0.35); transition: transform 0.15s cubic-bezier(.17,.67,.3,1.4); will-change: transform }
.image-frame { position:relative }
.shine { position:absolute; inset:0; background-position:12% 25%; mix-blend-mode:screen; opacity:0.85; animation: idleDrift 4.4s ease-in-out infinite }
0%,100% { background-position:12% 25% }
50% { background-position:88% 75% }
@keyframes sway animates transform
@keyframes idleDrift animates background-position
```

```js
style.setProperty("--r1", rand(-4, -1).toFixed(1) + "deg")
style.setProperty("--r2", rand(1, 4).toFixed(1) + "deg")
addEventListener("mousemove", (e) => {
addEventListener("mouseleave", () => {
```

### [Smooth Expanding Pill Social Media Buttons (CSS Only)](https://codepen.io/editor/Muhammad_1212/pen/01a02085-683d-7f74-84cd-18264c6d4d4e)

on scroll: a.social_button: background+color+shadow, i.fab: color, span.social_text: opacity+color | on hover of a.social_button: a.social_button: background+color+shadow ×2, i.fab: color ×2, span.social_text: opacity+color ×2 | made with: transition · :hover

```css
.social_button { -webkit-transform: translateZ(0); transform: translateZ(0); transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease }
.social_text { opacity: 0; transition: max-width 0.38s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, margin-left 0.38s cubic-bezier(0.16, 1, 0.3, 1) }
.social_button:hover { box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12) }
.social_button:hover .social_text { opacity: 1 }
.social_button:active { transform: scale(0.95); box-shadow: none }
```

### [Interactive Spotlight Text Reveal](https://codepen.io/editor/Aga_CW/pen/019ffecf-9505-754f-a767-c45891379f1a)

made with: mask · custom properties driven by JS · pointer / mouse tracking

```css
.interactive-wrapper { position: relative }
.layer { position: absolute }
.brand-text { text-transform: uppercase }
.sub-text { text-transform: uppercase; margin-top: 10px }
.mask-layer { -webkit-mask-image: radial-gradient( circle 250px at var(--mouse-x) var(--mouse-y), black 0%, transparent 100% ); mask-image: radial-gradient( circle 250px at var(--mouse-x) var(--mouse-y), black 0%, transparent 100% ) }
```

```js
addEventListener('mousemove', (e) => {
style.setProperty('--mouse-x', `${x}px`)
style.setProperty('--mouse-y', `${y}px`)
addEventListener('mouseleave', () => {
style.setProperty('--mouse-x', `50%`)
style.setProperty('--mouse-y', `50%`)
```

### [GSAP Services Section — Smooth Scroll + Hover Image Reveal (ScrollSmoother)](https://codepen.io/shivc8658/pen/qERmdmN)

held: fixed div, fixed div.preview | on scroll: div.char: transform+opacity+top ×26, article.row: transform+opacity+top ×3, span.: color+top ×3 | on hover of a.hero-cta: div.char: transform+opacity+top ×36, div.char: transform+top ×5 | made with: position: fixed · transition · :hover · GSAP · ScrollTrigger · pointer / mouse tracking

```css
.services { position: relative }
.services__eyebrow { text-transform: uppercase; margin-bottom: 1.25rem }
.hero-cta { position: relative; margin-top: 2.5rem }
.hero-cta__fill { position: absolute; inset: 0; transform: translateY(101%); transition: transform 0.5s cubic-bezier(.22,1,.36,1) }
.hero-cta:hover .hero-cta__fill { transform: translateY(0) }
.hero-cta__arrow { transition: transform 0.4s cubic-bezier(.22,1,.36,1) }
.hero-cta:hover .hero-cta__arrow { transform: translateX(0.4rem) }
.list { margin-top: 8vh; border-top: 1px solid rgba(255,255,255,0.1) }
.row { position: relative; border-bottom: 1px solid rgba(255,255,255,0.1) }
.row__index { transition: color 0.3s ease }
.row__title { transition: transform 0.5s cubic-bezier(.22,1,.36,1), color 0.3s ease }
.row__tags span { text-transform: uppercase; transition: all 0.3s ease }
```

```js
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText)
gsap.to(heading.lines, {
scrollTrigger: { trigger: ".services__heading", start: "top 85%" }
gsap.from(".hero-cta", {
scrollTrigger: { trigger: ".hero-cta", start: "top 92%" }
gsap.timeline({ scrollTrigger: { trigger: row, start: "top 90%" } })
addEventListener("pointermove", (e) => { xTo(e.clientX)
addEventListener("mouseenter", () => {
```

### [Interactive Product Card UI](https://codepen.io/alexander-sands/pen/RNKREjy)

on scroll: div.product: transform+top, div.number: background+color+shadow+top, h3.: color+top, p.: color+top | made with: transition · :hover

```css
.product { box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); transition: 0.5s }
.number { transition: box-shadow 0.8s ease }
h3, p { transition: color 0.25s 0.15s }
.number { margin-bottom: 20px }
h3 { margin-bottom: 15px }
.product:hover { transform: translateY(-6px) }
.product:hover .number { box-shadow: 0 0 0 35rem #667eea }
.product:hover h3, .product:hover p { transition: color 0s }
```

### [Neon Gradient Fancy Button Hover Effect](https://codepen.io/alexander-sands/pen/JoEXLmR)

on scroll: a.fancy-btn: shadow | made with: @keyframes · transition · :hover

```css
.fancy-btn { position: relative; transition: .4s }
.fancy-btn::before { position: absolute; inset: 0; transform: scaleX(0); transition: .5s ease; animation: borderMove 3s linear infinite }
.fancy-btn::after { position: absolute; transform: rotate(25deg) translateX(-250px); transition: 0.0s }
.fancy-btn span { position: relative; transition: .4s }
.fancy-btn:hover::before { transform: scaleX(1) }
.fancy-btn:hover::after { transform: rotate(25deg) translateX(250px); transition: transform 1.5s ease-out }
.fancy-btn:hover { box-shadow: 0 0 10px #00e5ff, 0 0 30px #00e5ff, 0 0 60px #7c4dff }
0% { background-position: 0% }
100% { background-position: 300% }
@keyframes borderMove animates background-position
```

### [Hover effect html and css](https://codepen.io/editor/Akashahmedabid/pen/017a2ed0-cdd0-7066-bc8e-544e504aab1f)

made with: nothing recognised — read the code

### [Double Floater Hero - Overlapping Gallery and Huge Type](https://codepen.io/editor/Ida-Aveltsova/pen/019e9bd8-b987-762b-9bb1-c0e02baea51c)

on scroll: div.img-wrap: transform+top ×2 | made with: @keyframes · transition · :hover · prefers-reduced-motion

```css
.double-floater-widget { position: relative }
.floater-container { position: relative }
.floater-heading { text-transform: uppercase; position: relative }
.reveal-line { opacity: 0; transform: translateY(100px); animation: floater-reveal-entry 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards }
.reveal-line:nth-of-type(1) { animation-delay: 0.1s }
.reveal-line:nth-of-type(2) { animation-delay: 0.3s }
0% { opacity: 0; transform: translateY(80px) rotateX(10deg) }
100% { opacity: 1; transform: translateY(0) rotateX(0deg) }
.images-stage { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.img-wrap { position: absolute; top: 0; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5); transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) }
.layer-back { transform: translateX(-6%) translateY(3%) rotate(-3deg) }
.layer-front { transform: translateX(6%) translateY(-3%) rotate(2deg) }
```

### [CSS Liquid Fill Buttons · 3 Directions](https://codepen.io/Jiironimo/pen/yyVpYbV)

on hover of div.btns: button.lbtn: transform+color+top, div.fill: transform+color+top, span.: color+top | made with: position: fixed · @keyframes · transition · :hover

```css
body::before { position:fixed; inset:-50%; opacity:.035; animation:grain .1s steps(1) infinite }
0% { transform:translate(0,0) }
25% { transform:translate(-3%,2%) }
50% { transform:translate(2%,-3%) }
75% { transform:translate(-2%,3%) }
header { position:relative; opacity:0; animation:up .8s cubic-bezier(.22,1,.36,1) .1s forwards }
.eyebrow { text-transform:uppercase; margin-bottom:.5rem }
.btns { position:relative; opacity:0; animation:up .8s cubic-bezier(.22,1,.36,1) .3s forwards }
.lbtn { position:relative; transition:color .35s, transform .2s cubic-bezier(.34,1.56,.64,1) }
.lbtn .fill { position:absolute; inset:0; transform:translateY(105%); transition:transform .45s cubic-bezier(.5,0,.2,1) }
.lbtn span { position:relative }
.lbtn:hover .fill { transform:translateY(0) }
```

### [Chroma Liquid Glass Buttons](https://codepen.io/editor/visaint/pen/019e7079-e408-7c0d-91e1-84125f6a1691)

held: fixed div.blob-layer, fixed div.menu-backdrop, fixed div.glass-menu, fixed div.glass-menu, fixed div.glass-menu | on scroll: div.blob: transform+top ×5 | on hover of button.menu-close-btn: div.blob: transform+top ×5 | made with: position: fixed · @keyframes · transition · :hover · clip-path · backdrop-filter · custom properties driven by JS · pointer / mouse tracking · requestAnimationFrame

```css
html, body { transition: background .45s ease, color .45s ease }
body { position: relative }
.blob-layer { position: fixed; inset: 0; transition: opacity .45s ease }
[data-theme="light"] .blob-layer { opacity: .45 }
.blob { position: absolute; filter: blur(50px); will-change: transform }
.blob-1 { top: 8%; animation: drift-1 18s infinite alternate linear }
.blob-2 { top: 58%; animation: drift-2 20s infinite alternate linear }
.blob-3 { top: 38%; opacity: .20; animation: drift-3 22s infinite alternate linear }
.blob-4 { top: 78%; opacity: .28; animation: drift-1 20s infinite reverse linear }
.blob-5 { top: 68%; animation: drift-2 18s infinite alternate linear }
0% { transform: translate(0,0) scale(1) }
50% { transform: translate(15vw,10vh) scale(1.2) }
```

```js
style.setProperty('--blob-bg',GRADS[s.variant](+s.cx.toFixed(2),+s.cy.toFixed(2)))
style.setProperty('--blob-bg',GRADS[s.variant](BX,BY))
requestAnimationFrame(loop)
addEventListener('mouseenter',()=>{states.get(el).inside=true
addEventListener('mouseleave',()=>{const s=states.get(el)
addEventListener('mousemove',e=>{
style.setProperty('--ox', ox)
style.setProperty('--oy', oy)
```

### [Untitled](https://codepen.io/Mahdi-Hajizadeh/pen/OPbjVVG)

made with: @keyframes · transition · :hover

```css
h1 { text-transform:uppercase; border-top:1px solid; border-bottom:1px solid }
.buttonBox { position:relative }
button { position:relative; text-transform:uppercase }
.border { position:absolute; transition:all .5s ease-in-out }
#first>.border:nth-of-type(1) { top:0; border-top:1px solid white }
#first>.border:nth-of-type(2) { bottom:0; border-bottom:1px solid white }
#second>.border:nth-of-type(1) { top:0; border-top:1px solid white; transition:width .5s ease-in-out, transform 1s ease-in-out }
#second>.border:nth-of-type(2) { bottom:0; border-bottom:1px solid white; transition:width .5s ease-in-out, transform 1s ease-in-out }
#second:hover .border { transform:translate(-50%, 0); transition:width .8s ease-in-out, transform .3s ease-in-out }
#third>.border:nth-of-type(1) { top:0; border-top:1px solid white }
#third>.border:nth-of-type(2) { bottom:0; border-bottom:1px solid white }
#third>.border:nth-of-type(3) { top:0 }
```

### [Création de Site Web et Stratégie Digitale | Le Hub du Web](https://codepen.io/Florian-GUERRIN/pen/QwGvPjP)

on scroll: div.card: transform | on hover of div.card: div.card: transform | made with: transition · :hover · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.container { perspective: 1000px }
.card { box-shadow: 0 15px 35px rgba(0, 86, 179, 0.1) }
.icon-wrapper { transform: translateZ(30px) }
.card h1 { transform: translateZ(25px) }
.card p { margin-bottom: 30px; transform: translateZ(20px) }
.glow-button { transition: all 0.3s ease; position: relative; transform: translateZ(35px); box-shadow: 0 8px 20px rgba(0, 123, 255, 0.3) }
.glow-button::after { position: absolute; top: 0; transform: skewX(-25deg); transition: all 0.5s ease }
.glow-button:hover { box-shadow: 0 10px 25px rgba(0, 86, 179, 0.4) }
.glow-button:hover::after { transition: all 0.7s ease }
```

```js
addEventListener('mousemove', (e) => {
addEventListener('mouseleave', () => {
addEventListener('mouseenter', () => {
```

### [Modern 3D Neon Hover Card UI | Glassmorphism Effect by Manish Web Developer Bihar](https://codepen.io/vcdeynms-the-typescripter/pen/KwNgyRg)

made with: @keyframes · transition · :hover · mask · backdrop-filter · 3D (perspective / preserve-3d)

```css
.bg { position:absolute }
.bg span { position:absolute; filter:blur(90px); animation:float 8s infinite alternate ease-in-out }
.bg span:nth-child(1) { top:10% }
.bg span:nth-child(2) { bottom:10% }
.bg span:nth-child(3) { bottom:20% }
from { transform:translateY(0px) }
to { transform:translateY(-50px) }
.card { position:relative; backdrop-filter:blur(20px); transition:0.6s ease; box-shadow: 0 20px 60px rgba(0,0,0,0.4) }
.card::before { position:absolute; inset:-3px; -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite:xor; mask-composite:exclude; opacity:0; transition:0.5s }
.card:hover::before { opacity:1 }
.card:hover { transform: rotateX(10deg) rotateY(-10deg) scale(1.04) }
.card::after { position:absolute; top:-120%; transform:rotate(25deg); transition:1s }
```

### [Scatter & Return | hover scatters chars, leave springs them home](https://codepen.io/jpbelley/pen/GgNoVEM)

held: fixed a | on scroll: span.char: transform+opacity+top ×14 | on hover of a.: span.char: transform+opacity+top ×14 | made with: position: fixed · transition · :hover · requestAnimationFrame

```css
#stage { position: relative }
.label { text-transform: uppercase; margin-bottom: 20px }
.baseline { margin-top: 18px; opacity: 0.18 }
#credit { position: fixed; bottom: 20px; transition: color 0.2s }
```

```js
requestAnimationFrame(tick) }
requestAnimationFrame(tick)
addEventListener('mouseenter', onEnter)
addEventListener('mouseleave', onLeave)
```

### [Jelly Hover | squash + stretch spring on mouseenter](https://codepen.io/jpbelley/pen/KwNVRWJ)

held: fixed a | made with: position: fixed · transition · :hover · requestAnimationFrame

```css
#stage { position: relative }
.label { text-transform: uppercase; margin-bottom: 20px }
.baseline { margin-top: 18px; opacity: 0.18 }
#credit { position: fixed; bottom: 20px; transition: color 0.2s }
```

```js
requestAnimationFrame(tick) }
requestAnimationFrame(tick)
```

### [Morph Merging Pills Button Interaction](https://codepen.io/aryamaulana/pen/EaNPxJY)

made with: transition · :hover

```css
.btn__label { position: relative; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) }
.btn__label::after { position: absolute; top: 0; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) }
.btn__icon { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) }
.btn__svg { transform: rotate(0deg); transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) }
.btn:hover .btn__svg { transform: rotate(45deg) }
```

### [njX UI — Cards Gradient Beautiful Effect: Hover, Shine, Outline, Aura](https://codepen.io/njbSaab/pen/QwGwwvy)

held: sticky nav.top | on hover of a.brand: a.btn: transform+filter+shadow+top | made with: position: sticky · transition · :hover · backdrop-filter

### [CSS/JS Kinetic Typography · Per-Letter Hover](https://codepen.io/Jiironimo/pen/qEavmoQ)

on scroll: span.char: transform+color+top | made with: position: fixed · @keyframes · transition · :hover

```css
body::after { position: fixed; inset: -50%; opacity: 0.04; animation: grainShift 0.1s steps(1) infinite }
0% { transform: translate(0,0) }
20% { transform: translate(-3%, 2%) }
40% { transform: translate(2%, -3%) }
60% { transform: translate(-2%, 4%) }
80% { transform: translate(3%, -1%) }
.char { position: relative; transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease; will-change: transform }
.word-bounce .char:hover { transform: translateY(-0.25em) scale(1.08) }
.word-tilt .char:hover { transform: rotate(-12deg) scale(1.1) }
.word-squish .char:hover { transform: scaleX(1.35) scaleY(0.85) }
.char.wave { animation: wave-jump 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards }
0% { transform: translateY(0) scale(1) }
```

```js
addEventListener('mouseenter', () => {
```

### [Dynamic Image Swap on Text Hover Interaction](https://codepen.io/moeeza3/pen/yyaGmRV)

made with: transition · :hover

```css
.link-container a { text-transform: uppercase; transition: 0.4s ease-in }
.arrow svg { transform: scale(0.4, 0.6); transition: transform 0.5s ease !important }
.link-container a:hover svg { transform: scale(1,1) }
.link-container a.visible svg { transform: scale(1,1) }
.link-container p { margin-bottom:0 }
.img-container { position: relative }
.img-container .link-image { transition: opacity 0.5s ease-in-out; opacity: 0; position: absolute }
.img-container .link-image.visible { opacity: 1; position: static }
```

```js
addEventListener("mouseenter", function() {
```

### [Circle Hover Effect (Canvas)](https://codepen.io/alexander-sands/pen/bNwQLVW)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```js
addEventListener('mousemove', (event) => {
requestAnimationFrame(animate)
```

### [Flip X | rotate on horizontal axis](https://codepen.io/jpbelley/pen/yyazogX)

held: fixed a | on hover of button.: button.: background | made with: position: fixed · @keyframes · transition · :hover · 3D (perspective / preserve-3d)

```css
#replay { transition: background 0.2s }
#credit { position: fixed; bottom: 20px; transition: color 0.2s }
```

### [CSS Hover Effect: Rotating Dashed Rings](https://codepen.io/Utsav_0/pen/ZYpzJaW)

made with: transition · :hover · mask

```css
.logo { position: relative; transition: color var(--transition-dur) ease }
.logo::before, .logo::after { position: absolute; top: 50%; translate: -50% -50%; mask: radial-gradient(farthest-side, transparent calc(100% - var(--dash-thickness)), #000 0); transition: rotate var(--transition-dur) ease, --dash-color var(--transiti }
.logo::before { rotate: calc(var(--dash-plus-gap-size) / 2) }
.logo:hover::before { rotate: var(--dash-plus-gap-size) }
.logo:hover::after { rotate: calc(-1 * var(--dash-plus-gap-size)) }
```

### [Lunar Twelve — Chinese Zodiac Hover Reveal](https://codepen.io/grauconejo13/pen/bNeXdPL)

on hover of div.card: div.card: transform+top ×2, div.overlay: transform+top ×2 | made with: transition · :hover

```css
.title { margin-bottom: 2rem }
.card { position: relative; transition: 0.4s ease }
.card:hover { transform: translateY(-6px) }
.zodiac-img { margin-bottom: 0.5rem }
.overlay { position: absolute; inset: 0; transform: translateY(100%); transition: 0.4s ease }
.card:hover .overlay { transform: translateY(0) }
```

### [Interactive Hover Menu Effect, Shake The Cursor, Liquid Images, Fabric](https://codepen.io/Umut501/pen/NPrZzMX)

held: fixed div.hover-effect-container, fixed div | on scroll: div.experience-item: color, span.rightsidetext: color, div.: transform+opacity+top | on hover of img.: div.experience-item: color, span.rightsidetext: color, div.: transform+opacity+top | made with: position: sticky · position: fixed · transition · :hover · GSAP · three.js / WebGL · IntersectionObserver · pointer / mouse tracking · requestAnimationFrame

```css
.hover-effect-container { position: fixed; top: 0 }
.experience-container { position: relative }
.experience-list { padding-top: 4rem }
.experience-item { padding-top: 2rem; padding-bottom: 2rem; position: relative; border-bottom: 1px solid #00000042 }
.experience-item:hover { opacity: 1; transition: color 0.3s ease-in-out }
#view-button { position: fixed; transform: scale(0); opacity: 0; top: 0; will-change: transform; box-shadow: inset -5px -5px 10px rgba(0,0,0,0.3), 3px 5px 10px rgba(0,0,0,0.4) }
.experience-preview { position: sticky; top: 0 }
```

```js
new IntersectionObserver((entries) => {
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
addEventListener('mousemove', (e) => {
gsap.to(this.material.uniforms.uProgress, {
gsap.to(this.material.uniforms.uAlpha, { value: 1, duration: 0.3 })
gsap.to(this.material.uniforms.uIntensity, { value: 0.5, duration: 0.3 })
gsap.to(this.material.uniforms.uAlpha, { value: 0, duration: 0.3 })
```

### [Glassmorphism Profile Card with Hover Glow](https://codepen.io/sed2088/pen/dPXjvaL)

on scroll: div.card: transform+shadow+top, div.avatar: transform+top, div.js-tilt-glare-inner: transform+opacity+top | made with: transition · :hover · backdrop-filter · 3D (perspective / preserve-3d)

```css
.container { perspective: 1000px }
.card { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) }
.card:hover { transform: translateY(-15px) scale(1.03); box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4) }
.avatar { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); transition: all 0.4s ease }
.card:hover .avatar { transform: scale(1.08) }
h2 { margin-bottom: 0.5rem }
.role { opacity: 0.9; margin-bottom: 1.5rem }
.bio { opacity: 0.85; margin-bottom: 2rem }
.social-icon { transition: all 0.3s ease }
.social-icon:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2) }
body::before { position: absolute; top: -20% }
```

### [Responsive CSS Grid Image Gallery with Hover Effect](https://codepen.io/chandresh09/pen/NPrgpQd)

made with: transition · :hover

```css
.subheading { margin-top: 10px }
.box { background-position: top; transition: all 1s ease-in-out }
.box:hover { background-position: center; box-shadow: 0 0 4px #fff }
```

### [Gradient Border Runner (Mouse-Driven Neon Border)](https://codepen.io/ash1198/pen/wBWGOQy)

on scroll: div.card: transform+shadow+top | on hover of button.chip: button.chip: transform+top, div.card: transform+shadow+top | made with: transition · :hover · :focus-visible · backdrop-filter · custom properties driven by JS · pointer / mouse tracking · requestAnimationFrame

```css
.dot { box-shadow: 0 0 18px rgba(120, 60, 255, 0.55) }
.chip { transition: transform 160ms ease, background 160ms ease, border-color 160ms ease }
.chip:hover { transform: translateY(-1px) }
.chip:active { transform: translateY(0px) scale(0.98) }
.card { position: relative; transform: translateZ(0); transition: transform 180ms ease, box-shadow 180ms ease; box-shadow: 0 26px 70px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.06) inset, 0 0 42px rgba(80, 180, 255, c }
.card::after { position: absolute; inset: -18px; filter: blur(14px); opacity: 0.98 }
.card:hover { transform: translateY(-2px) }
.card:focus-visible { box-shadow: 0 26px 70px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 0 3px rgba(255, 255, 255, 0.1), 0 0 42px rgba(80, 180, 255, calc(0.26 * var(--glow))), 0 0 64px rgba(255, 45, 210, calc(0.2 * var }
.badgeRow { margin-bottom: 14px }
.badgeDot { box-shadow: 0 0 16px rgba(0, 255, 200, 0.55) }
.grid { margin-top: 10px }
.kpi__label { margin-bottom: 6px }
```

```js
style.setProperty("--x", curX.toFixed(2) + "%")
style.setProperty("--y", curY.toFixed(2) + "%")
style.setProperty("--spin", spin.toFixed(2) + "deg")
requestAnimationFrame(loop)
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
addEventListener("mousemove", (e) => {
```

### [Untitled](https://codepen.io/Sean-Lee-the-reactor/pen/NPrGpjq)

on hover of div.card: div.card: transform+top, h1.card-title: transform+top | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.parent { perspective: 1000px }
.card { padding-top: 100px; background-position: center center; transition: all 0.5s ease-in-out }
.card:hover { background-position: 80% 20%; transform: rotate3d(0.5, 1, 0, 30deg) }
.content-box { box-shadow: rgba(239, 68, 68, 0.925) 0px 20px 50px -25px; transition: all 0.5s ease-in-out }
.content-box .card-title { transition: all 0.5s ease-in-out; transform: translate3d(0px, 0px, 20px) }
.content-box .card-title:hover { transform: translate3d(0px, 0px, 50px) }
.content-box .card-content { padding-top: 15px; transition: all 0.5s ease-in-out; transform: translate3d(0px, 0px, 20px) }
.content-box .card-content:hover { transform: translate3d(0px, 0px, 50px) }
.content-box .see-more { text-transform: uppercase; padding-top: 15px; transition: all 0.5s ease-in-out; transform: translate3d(0px, 0px, 20px) }
.content-box .see-more:hover { transform: translate3d(0px, 0px, 50px) }
.date-box { position: absolute; top: 75px; box-shadow: #ef4444 0px 20px 60px 0px, #f87171 0px 18px 36px -18px; transform: translate3d(0px, 0px, 50px) }
.card2, .card3, .card4 { filter: none }
```

### [Cards Models HTML_CSS](https://codepen.io/persephone_ms/pen/pvyxMod)

made with: @keyframes · transition · :hover · backdrop-filter

```css
.title { margin-bottom: 40px; transition: 0.3s ease }
.title:hover { filter: blur(2px); opacity: 0.7 }
.card { transition: 0.35s ease }
.soft-card { backdrop-filter: blur(10px); box-shadow: 0 4px 20px rgba(255, 180, 220, 0.2) }
.soft-card:hover { transform: translateY(-6px); box-shadow: 0 8px 32px rgba(255, 160, 220, 0.35) }
.bubble-card { box-shadow: 0 10px 25px rgba(150, 170, 255, 0.3) }
.bubble-card:hover { transform: scale(1.06); box-shadow: 0 14px 40px rgba(150, 170, 255, 0.45) }
.glass-card { backdrop-filter: blur(12px) }
.glass-card:hover { animation: pulse 1s infinite ease-in-out }
0% { transform: scale(1) }
50% { transform: scale(1.04) }
100% { transform: scale(1) }
```

### [Circular image gallery with reverse-transform hover](https://codepen.io/mysth/pen/QwNqxGo)

held: fixed div.scene | made with: position: fixed · transition · :hover

```css
:root { --offset: 350px }
.scene { position: fixed; top: 50%; transform: translate(-50%, -50%) }
.carousel { position: relative }
.item { position: absolute; inset: 0; transform: rotateZ(calc(var(--i) * (360deg / var(--count)))) translateX(var(--offset)); margin-top: -45px }
.item > div { box-shadow: 0 0 10px rgba(79, 172, 254, .4); transition: transform .3s cubic-bezier(.175, .885, .32, 1.275) }
.item:hover > div { transform: translateX(calc(var(--offset) * -1)) rotateZ(calc(var(--i) * -1 * (360deg / var(--count)))) scale(2) }
```

### [Untitled](https://codepen.io/muridnakal/pen/jEqELRq)

made with: transition · :hover

```css
div.gallery { margin-top: 30px }
div.gallery ul li, div.gallery li img { -webkit-transition: all 0.1s ease-in-out; -moz-transition: all 0.1s ease-in-out; -o-transition: all 0.1s ease-in-out; transition: all 0.1s ease-in-out }
div.gallery ul li { position: relative }
div.gallery ul li img { position: absolute; top: 0 }
div.gallery ul li img:hover { margin-top: -130px; top: 65% }
p.attribution { padding-top: 30px }
```

### [Crazy Circle Illusion SCSS](https://codepen.io/tveloira/pen/OPMvwJV)

made with: @keyframes · transition · :hover

```css
.crazy-circle .crazy-circle-container .outer-circle { position: relative }
.crazy-circle .crazy-circle-container .outer-circle .circle-path { position: absolute; top: 50%; transform: translate(-50%, -50%) rotate(calc((var(--i) - 1) * (180deg / 20))) }
.crazy-circle .crazy-circle-container .outer-circle .circle-path::before { position: absolute; top: calc(50% - 1px); opacity: 0; transition: opacity 0.5s ease }
.crazy-circle .crazy-circle-container .outer-circle .circle-path::after { position: absolute; top: 0; animation: slide-x 2s ease-in-out infinite alternate; animation-delay: calc((var(--i) - 1) * (2s / 20)); will-change: left }
.crazy-circle .crazy-circle-container .outer-circle:hover .circle-path::before { opacity: 1 }
@keyframes slide-x animates left
```

### [Mysterious gift](https://codepen.io/anomic123/pen/zxrPGdy)

made with: transition · :hover · 3D (perspective / preserve-3d)

### [Electric Shock Hover Effect](https://codepen.io/Deva-Kumar-the-bold/pen/azdwegr)

on scroll: div.electric-line: transform+opacity+top ×12, div.corner-node: transform+opacity+top ×4, div.center-circle: shadow | made with: transition · :hover · requestAnimationFrame

### [Hover Card Rotation Effect](https://codepen.io/nguyenanhtuan/pen/vELgXVp)

held: fixed div.copyright | on scroll: div.card-wrap: transform+top ×5 | on hover of div.card: div.card-wrap: transform+top ×2 | made with: position: fixed · @keyframes · transition · :hover

```css
h1 { margin-bottom: 30px }
h1 { margin-bottom: 15px }
.hand { transition: 400ms ease-in-out }
.hand:hover .card:hover .card-wrap { transform: translateX(-50%) rotate(0) translateY(-10%) }
.hand:hover .card:hover .card-wrap { transform: translateX(-50%) rotate(0) translateY(-3%) }
.hand:hover .card-wrap { transform: translateX(-50%) rotate(0) }
.card { position: relative }
.card .card-wrap { position: relative; top: 0; transform: translateX(-50%) rotate(calc((var(--i) * 15deg) - 30deg)); transition: 350ms ease-in-out; background-position: center center }
.card .card-wrap:before { position: absolute; bottom: 0 }
.card h2, .card a { position: relative; transition: 0.25s }
.card a { margin-top: 0.5vmin }
.copyright { position: fixed; bottom: 0; transform: translateX(-50%) }
```

### [Hover-Grow Effect](https://codepen.io/Newton-Backups/pen/RNrbOzB)

made with: :hover · 3D (perspective / preserve-3d)

```css
.hover-shadow-box-animation { transform: perspective(1px) translateZ(0); box-shadow: 0 0 1px transparent; transition-property: box-shadow, transform }
.hover-shadow-box-animation:hover, .hover-shadow-box-animation:focus, .hover-sha { box-shadow: 1px 10px 10px -10px rgba(0, 0, 24, 0.5); transform: scale(1.2) }
h2 small { opacity: 0.7 }
```

### [Hover Direction Animated Button](https://codepen.io/roniee_1993/pen/yyYqgzr)

on hover of button.glow-btn: span.: color ×20, button.glow-btn: color, div.glow-btn-cells: color, span.glow-btn-text: color | made with: transition · :hover

```css
.subtitle { margin-bottom: 50px }
.glow-btn { position: relative; transition: color 0.4s ease, background 0.4s ease }
.glow-btn-text { position: relative }
.glow-btn-cells { position: absolute; top: 0 }
.glow-btn-cells span { position: relative }
.glow-btn-cells span::before { position: absolute; transform: scale(0); transition: transform 0.4s ease }
.glow-btn-cells span:hover::before { transform: scale(12) }
```

### [Animated CTA Button with Expanding Icon Effect](https://codepen.io/omayerhamdi/pen/VYvXWaX)

on hover of a.btn-animated-cta: svg.[object: transform | made with: transition · :hover

```css
.btn-animated-cta { box-shadow: inset 0 0 1.6em -0.6em #2563eb; position: relative }
.btn-animated-cta__icon { position: absolute; box-shadow: 0.1em 0.1em 0.6em 0.2em #2563eb; transition: all 0.3s }
.btn-animated-cta__icon svg { transition: transform 0.3s }
.btn-animated-cta:hover .btn-animated-cta__icon svg { transform: translateX(0.1em) }
.btn-animated-cta:active .btn-animated-cta__icon { transform: scale(0.95) }
```

### [Product Card Neon Glow Pulse — CSS @property Animated Pulse Ring on Hover](https://codepen.io/Ahmod-Musa/pen/EaVNweN)

on scroll: div.pulse-ring: transform+opacity+top ×6 | on hover of div.cards: div.pulse-ring: transform+opacity+top ×6 | made with: position: fixed · @keyframes · transition · :hover

```css
body::before { position:fixed; inset:0 }
.h-tag { text-transform:uppercase; margin-bottom:14px }
.header h1 { margin-bottom:8px }
.pcard { position:relative; transition:transform .35s cubic-bezier(.34,1.56,.64,1) }
.pcard:hover { transform:translateY(-12px) }
.pcard::before { position:absolute; inset:0; transition:border-color .3s }
.pulse-ring { position:absolute; inset:0; opacity:0; animation:ringPulse 2s ease-out infinite }
0% { opacity:.8; transform:scale(1) }
100% { opacity:0; transform:scale(1.08) }
.pulse-ring:nth-child(2) { animation-delay:.7s }
.pcard:hover .pulse-ring { opacity:1 }
.pcard-body { position:relative; transition:border-color .3s,box-shadow .3s }
```

### [Glassmorphism Cards with Cursor-Tracking Glow — HTML CSS JS](https://codepen.io/Ahmod-Musa/pen/raVXqZM)

on hover of div.glow-card: div.glow-card: transform+top ×2, div.glow-spot: opacity+top ×2, div.card-icon-wrap: transform+top ×2 | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · custom properties driven by JS · pointer / mouse tracking

```css
body::before { position:fixed; inset:0 }
.header { position:relative }
.h-tag { text-transform:uppercase; margin-bottom:16px }
.header h1 { margin-bottom:8px }
.grid { position:relative }
.glow-card { position:relative; backdrop-filter:blur(20px) saturate(160%); -webkit-backdrop-filter:blur(20px) saturate(160%); transition:transform .3s cubic-bezier(.34,1.56,.64,1),border-color .3s }
.glow-card:hover { transform:translateY(-6px) scale(1.01) }
.glow-card .glow-spot { position:absolute; top:var(--gy,50%); transform:translate(-50%,-50%); opacity:0; transition:opacity .35s; filter:blur(20px) }
.glow-card:hover .glow-spot { opacity:1 }
.glow-card::before { position:absolute; top:0; opacity:0; transition:opacity .3s }
.glow-card:hover::before { opacity:1 }
.card-icon-wrap { margin-bottom:18px; transition:transform .3s; position:relative }
```

```js
addEventListener('mousemove',e=>{
style.setProperty('--gx',x+'px')
style.setProperty('--gy',y+'px')}
```

### [Card Hover Effect](https://codepen.io/nazaneyn/pen/VYLQZvZ)

on scroll: a.: transform ×4, img.: transform | on hover of a.: a.: transform ×4, img.: transform | made with: transition · :hover

```css
.container { position: relative }
.card { position: relative }
img { transition: var(--transition-duration); transform: translateX(0) }
.card:hover img { transform: translateX(550px) }
.card-content { top: 0; position: absolute }
a { transform: translateX(0); transition: var(--transition-duration) }
a:hover { transition-delay: transform }
a:not(:last-child) { border-bottom: solid white }
.card-content a::before, .card-content a::after { position: absolute; transition: var( --transition-duration ) }
.card-content a::before { border-top: solid transparent; top: 0 }
.card-content a::after { border-bottom: solid transparent; bottom: 0 }
.card-content a:hover::before { border-top: solid var(--black-dark) }
```

### [Card Hover Effect](https://codepen.io/nazaneyn/pen/emNGzmB)

on scroll: div.card: shadow, div.img: transform | made with: transition · :hover

```css
h1 { margin-bottom: 1.5rem }
.card { position: relative; box-shadow: 0 5px 12px rgba(0, 0, 0, 0.4); transition: var(--transition-duration) }
.card:hover { box-shadow: 0 5px 10px rgba(0, 0, 0, 0.6) }
.img { position: relative; transition: var(--transition-duration); transform: translateX(0) }
.card:hover .img { transform: translateX(300px) }
.card-content { position: absolute; top: 0; transition: var(--transition-duration) }
.card-content > * { position: absolute; transition: var(--transition-duration) }
.card-content .title { top: 6% }
.card-content .description { top: 33% }
.card-content a { top: 75%; transition: var(--transition-duration) }
```

### [Card Hover Effect](https://codepen.io/nazaneyn/pen/yyNorqR)

on scroll: div.card: shadow, div.img: transform+top, h2.title: opacity, p.description: transform+opacity+top, a.: transform+opacity+top | on hover of div.card: a.: transform+opacity+top | made with: @keyframes · transition · :hover

```css
h1 { margin-bottom: 1.5rem }
.card { position: relative; box-shadow: 0 5px 12px rgba(0, 0, 0, 0.4); transition: var(--transition-duration) }
.card:hover { box-shadow: 0 5px 10px rgba(0, 0, 0, 0.6) }
.img { position: relative; transition: var(--transition-duration) }
.card:hover .img { transform: scale(0) rotate(360deg) }
.img::before { position: absolute; top: 0 }
.text-box { position: absolute; bottom: 0; transition: var(--transition-duration) }
.text-box > * { margin-top: 0.8rem; opacity: 0 }
.card:hover .title { animation: pop 1s, fade-out 1s forwards; animation-delay: 0.5s }
.card:hover .description { animation: pop 1s, fade-out 1s forwards; animation-delay: 1s }
.card:hover a { animation: pop 1s, fade-out 1s forwards; animation-delay: 1.5s }
.title { transform: scale(1) }
```

### [Animated Underline Button (CSS Only)](https://codepen.io/BitBlo/pen/GgJJyzG)

made with: transition · :hover

```css
button:before { transition: all .4s cubic-bezier(.30,.6,.30,1) }
```

### [Menu Hover Effect](https://codepen.io/nazaneyn/pen/GgJggez)

on hover of li.: span.: color+top ×4, li.: color | made with: transition · :hover

```css
li { position: relative; transition: var(--transition-duration) }
li::before { position: absolute; bottom: 0; transition: var(--transition-duration) }
li span { position: absolute; bottom: -100%; transition: var(--transition-duration) }
li:hover span { bottom: 0 }
li:hover span:nth-child(3) { bottom: 0 }
```

### [Menu Hover Effect](https://codepen.io/nazaneyn/pen/MYwYYmw)

on hover of li.: li.: color | made with: transition · :hover

```css
li { position: relative; transition: var(--transition-duration); transition: var(--transition-duration) }
li::before { position: absolute; bottom: 0; transition: var(--transition-duration) }
```

### [Infinite Canvas Icon Grid with Auto-Scroll & Hover Zoom by - gopi chakradhar](https://codepen.io/Gopi-Chakradhar/pen/EajxmRO)

held: fixed a, fixed div.blur-vignette | on hover of a.: a.: transform+shadow+top | made with: position: fixed · @keyframes · transition · :hover · mask · backdrop-filter · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
#super-btn { position: fixed; bottom: 32px; box-shadow: 0 2px 12px rgba(0,0,0,0.18); transition: box-shadow 0.2s, transform 0.2s }
#super-btn:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.28); transform: scale(1.07) }
```

### [Menu Hover Effect](https://codepen.io/nazaneyn/pen/OPPKYQm)

on hover of li.: li.: color | made with: transition · :hover

```css
li { position: relative; transition: var(--transition-duration) }
li:hover { transition: var(--transition-duration) }
li::before { position: absolute; top: 95%; transition: var(--transition-duration) }
li:hover::before { transition: var(--transition-duration) }
li::after { position: absolute; top: 0; transition: var(--transition-duration) }
li:hover::after { transition: var(--transition-duration) }
```

### [Card Hover Animation](https://codepen.io/wahidullah_karimi/pen/xbbvQWg)

on scroll: div.glass: transform+top ×3 | made with: transition · :hover · backdrop-filter

```css
.container { position: relative }
.container .glass { position: relative; box-shadow: 0 25px 25px rgba(0, 0, 0, 0.25); transition: 0.5s; backdrop-filter: blur(10px); transform: rotate(calc(var(--r) * 1deg)) }
.container:hover .glass { transform: rotate(0deg) }
.container .glass::before { position: absolute; bottom: 0 }
```

### [Crypto Card hover effect](https://codepen.io/wahidullah_karimi/pen/jEEgQYj)

on scroll: div.card: transform, svg.[object: transform+filter+top | on hover of div.card: div.card: transform+top, svg.[object: transform+filter+top, div.textBox: opacity+top | made with: @keyframes · transition · :hover

```css
.card { transition: 0.2s ease-in-out }
.img { position: absolute; transition: 0.2s ease-in-out }
.textBox { opacity: 0; transition: 0.2s ease-in-out }
.card:hover > .textBox { opacity: 1 }
.card:hover > .img { filter: blur(7px); animation: anim 3s infinite }
0% { transform: translateY(0) }
50% { transform: translateY(-20px) }
100% { transform: translateY(0) }
.card:hover { transform: scale(1.04) rotate(-1deg) }
@keyframes anim animates transform
```

### [Menu Hover Effect](https://codepen.io/nazaneyn/pen/ZYYdaRB)

made with: transition · :hover

```css
h1 { margin-bottom: 1.5rem }
li { position: relative }
li:nth-child(1)::before { position: absolute; bottom: 0; transform: scaleX(0); transition: var(--transition-duration) }
li:nth-child(1):hover::before { transform: scaleX(1); transition: var(--transition-duration); will-change: transform }
li:nth-child(2)::before { position: absolute; bottom: 0; transform: scaleX(0); transition: var(--transition-duration) }
li:nth-child(2):hover::before { transform: scaleX(1); transition: var(--transition-duration); will-change: transform }
li:nth-child(3)::before { position: absolute; bottom: 0; transform: scaleX(0); transition: var(--transition-duration) }
li:nth-child(3):hover::before { transform: scaleX(1); transition: var(--transition-duration); will-change: transform }
li:nth-child(3)::after { position: absolute; bottom: 0; transform: scaleX(0); transition: var(--transition-duration) }
li:nth-child(3):hover::after { transform: scaleX(1); transition: var(--transition-duration); will-change: transform }
li:nth-child(4)::before { position: absolute; top: 0; transform: scaleX(0); transition: var(--transition-duration) }
li:nth-child(4):hover::before { transform: scaleX(1); transition: var(--transition-duration); will-change: transform }
```

### [Card Hover Effect](https://codepen.io/nazaneyn/pen/xbbNdVw)

made with: @keyframes · transition · :hover

```css
h1 { margin-bottom: 1.5rem }
.card { position: relative; box-shadow: 0 5px 12px rgba(0, 0, 0, 0.4); transition: var(--transition-duration) }
.card:hover { box-shadow: 0 5px 10px rgba(0, 0, 0, 0.6); transition: var(--transition-duration) }
.img { position: relative }
.img::before { position: absolute; top: 0; transition: var(--transition-duration) }
.card:hover .img::before { transition: var(--transition-duration) }
.text-box { position: absolute; bottom: -100%; transition: var(--transition-duration) }
.card:hover .text-box { transition: var(--transition-duration); bottom: 0 }
.text-box > * { opacity: 0 }
.card:hover .text-box > * { transition: var(--transition-duration); animation: fade 1s 0.5s forwards }
0% { opacity: 0 }
100% { opacity: 1 }
```

### [Card Hover Effect](https://codepen.io/nazaneyn/pen/LEEvrNb)

made with: @keyframes · transition · :hover

```css
h1 { margin-bottom: 1.5rem }
.card { position: relative; box-shadow: 0 5px 12px rgba(0, 0, 0, 0.4); transition: var(--transition-duration) }
.card:hover { box-shadow: 0 5px 10px rgba(0, 0, 0, 0.6); transition: var(--transition-duration) }
.img { position: relative }
.img::before { position: absolute; top: 0; transition: var(--transition-duration) }
.card:hover .img::before { transition: var(--transition-duration) }
.text-box { position: absolute; bottom: -100%; transition: var(--transition-duration) }
.card:hover .text-box { transition: var(--transition-duration); animation: move-to-top 0.7s forwards }
0% { bottom: -80% }
40% { bottom: 5% }
70% { bottom: -20% }
100% { bottom: 0 }
```

### [Cards](https://codepen.io/nazaneyn/pen/pvvYLGa)

made with: @keyframes · transition · :hover · backdrop-filter

```css
.card { box-shadow: 0 5px 9px rgba(0, 0, 0, 0.2); transition: 0.3s }
.card:hover { box-shadow: 0 5px 9px rgba(0, 0, 0, 0.4); transition: 0.3s }
.img { margin-bottom: 0.6rem; position: relative }
.img::before { position: absolute; top: 0 }
img { transition: transform 0.3s; transform: scale(1); filter: saturate(70%) }
.card:hover img { transform: scale(1.1); transition: transform 0.3s; filter: saturate(100%) }
.title { margin-bottom: 1.2rem; position: relative }
.title::before { position: absolute; border-bottom: 2.2px solid var(--beige-sand-dark); transition: var(--transition-duration); top: 100% }
.card:hover .title::before { transition: var(--transition-duration); animation: move-to-right 1s forwards }
button { margin-top: 1rem }
@keyframes move-to-right animates left
```

### [Icon Hover Effect](https://codepen.io/nazaneyn/pen/XJJOYWj)

on scroll: div.icon: transform+top, i.fab: color+top | made with: @keyframes · transition · :hover

```css
.icon { position: relative; transition: var(--transition-duration); transform: scale(0.8); animation: fade 2s }
.icon:hover { transition: var(--transition-duration); transform: scale(1) }
.icon::before { position: absolute; top: 100%; transition: var(--transition-duration) }
.icon:hover::before { top: 0; transition: var(--transition-duration) }
i { transition: var(--transition-duration); transform: rotateY(0) }
.icon:hover i { transform: rotateY(360deg); transition: var(--transition-duration) }
0% { opacity: 0 }
100% { opacity: 1 }
@keyframes fade animates opacity
```

### [Hover Effect](https://codepen.io/nazaneyn/pen/WbbYWOB)

on scroll: button.btn: color | made with: @keyframes · transition · :hover

```css
.btn { position: relative; transition: var(--transition-duration) }
.btn:hover { transition: var(--transition-duration) }
.btn::before { position: absolute; top: -5px; transition: var(--transition-duration) }
.btn:hover::before { transition: var(--transition-duration); animation: move 1.5s forwards }
100% { top: 0 }
@keyframes move animates left, background, width, height, top
```

### [Hover Effect - Wave](https://codepen.io/nazaneyn/pen/XJJypVr)

made with: @keyframes · transition · :hover

```css
.btn { position: relative }
.effect { position: absolute; top: calc(100% + 100px); transition: var(--transition-duration) }
.effect span { transition: var(--transition-duration) }
.effect span:nth-child(1) { position: absolute; top: -15px; animation: effect 1s infinite 0.3s }
.effect span:nth-child(2) { position: absolute; top: -50%; animation: effect 1s infinite 0.6s }
.effect span:nth-child(3) { position: absolute; top: -20px; animation: effect 1s infinite 0.9s }
to { top: -100% }
.btn:hover .effect { transition: var(--transition-duration); top: 0 }
@keyframes effect animates top
```

### [Hover Effect](https://codepen.io/nazaneyn/pen/emmQzZX)

made with: transition · :hover

```css
.btn { position: relative }
.btn::before { position: absolute; top: -6px; border-top: solid var(--pink-light) 3px; transition: var(--transition-duration) }
.btn::after { position: absolute; bottom: -6px; border-bottom: solid var(--pink-light) 3px; transition: var(--transition-duration) }
.btn:hover::after, .btn:hover::before { transition: var(--transition-duration) }
```

### [Hover Effect](https://codepen.io/nazaneyn/pen/emmPEoe)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.btn { position: relative }
.btn::before { position: absolute; top: 0; border-top: 3px solid var(--red); border-bottom: 3px solid var(--blue); transition: var(--transition-duration) }
.btn:hover::before { transform: rotateX(180deg); transition: var(--transition-duration) }
.btn::after { position: absolute; top: -10px; transition: var(--transition-duration) }
.btn:hover::after { transform: rotateY(180deg); transition: var(--transition-duration) }
```

### [Hover Effect](https://codepen.io/nazaneyn/pen/raaqzPY)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.btn { position: relative; perspective: 200px }
.btn::before { position: absolute; top: 0; border-top: 3px solid var(--red); border-bottom: 3px solid var(--blue); transition: var(--transition-duration) }
.btn:hover::before { transform: rotateX(180deg); transition: var(--transition-duration) }
.btn::after { position: absolute; top: 0; transition: var(--transition-duration) }
.btn:hover::after { transform: rotateY(180deg); transition: var(--transition-duration) }
```

### [Hover Effect](https://codepen.io/nazaneyn/pen/QwwZvPr)

made with: transition · :hover · mix-blend-mode · 3D (perspective / preserve-3d)

```css
.btn { position: relative; perspective: 200px }
.btn::before { position: absolute; top: 0; transition: var(--transition-duration); transform: rotateX(0) }
.btn::after { position: absolute; bottom: 0; transition: var(--transition-duration); transform: rotateX(0) }
.btn:hover::before { transition: var(--transition-duration); transform: rotateX(-180deg) }
.btn:hover::after { transition: var(--transition-duration); transform: rotateX(180deg) }
.btn { position: relative; perspective: 200px }
.btn::before { position: absolute; top: 0; transition: var(--transition-duration); transform: rotateX(0) }
.btn::after { position: absolute; bottom: 0; transition: var(--transition-duration); transform: rotateX(0) }
.btn:hover::before { transition: var(--transition-duration); transform: rotateX(-180deg) }
.btn:hover::after { transition: var(--transition-duration); transform: rotateX(180deg) }
```

### [Hover Effect](https://codepen.io/nazaneyn/pen/MYYPmzP)

made with: transition · :hover · backdrop-filter · mix-blend-mode

```css
.btn { position: relative }
.btn::before { position: absolute; top: 2px; transition: var(--transition-duration) }
.btn::after { position: absolute; top: -2px; mix-blend-mode: multiply; transition: var(--transition-duration) }
.btn:hover::before { top: -4px; transition: var(--transition-duration); backdrop-filter: blur(25px) }
.btn:hover::after { top: 4px; transition: var(--transition-duration) }
```

### [Hover Effect](https://codepen.io/nazaneyn/pen/zxxJgjR)

on scroll: button.btn: color+shadow | made with: transition · :hover

```css
.container { position: relative }
.btn { position: relative; box-shadow: 0 0 0px var(--blackish); transition: box-shadow 0.3s ease-in-out }
.btn:hover { box-shadow: 0 0 10px var(--blackish) }
.btn::before { position: absolute; top: 50%; transform: translate(-50%, -50%); opacity: 0.5; transition: width 0.1s ease-out, height 0.1s ease-out, opacity 0 ease-out }
.btn:hover::before { opacity: 1; transition: width 0.4s ease-in-out, height 0.4s ease-in-out, opacity 0.4s ease-in-out }
```

### [Hover Effect](https://codepen.io/nazaneyn/pen/JooaoMm)

on scroll: span.: transform+top | made with: transition · :hover

```css
button { position: relative; /transition: var(--transition-duration) }
button:hover { transition: var(--transition-duration) }
button::after, button::before { position: absolute; top: 50%; transition: var(--transition-duration); transform: translateY(-50%); opacity: 0 }
button::before { box-shadow: -100px 0 0 var(--orange) }
button::after { box-shadow: 100px 0 0 var(--orange) }
button:hover::before { box-shadow: 30px 0 0 var(--orange); transform: translate(-50%, -50%); opacity: 1 }
button:hover::after { box-shadow: -30px 0 0 var(--orange); transform: translate(50%, -50%); opacity: 1 }
span { position: absolute; top: 0; transform: scale(0); transition: var(--transition-duration) }
button:hover span { transform: scale(1); transition: var(--transition-duration) }
```

### [Hover Effect](https://codepen.io/nazaneyn/pen/jEExqOd)

made with: transition · :hover

```css
button { position: relative; transition: var(--transition-duration) }
button:hover { transition: var(--transition-duration) }
button::after { position: absolute; top: 0; transition: var(--transition-duration) }
button:hover::after { transition: var(--transition-duration); transform: rotateY(360deg) scale(0.5); opacity: 0 }
button::before { position: absolute; top: 0; transform: rotateY(360deg) scale(0.5); transition: var(--transition-duration); opacity: 0 }
button:hover::before { transform: rotateY(0) scale(1); transition: var(--transition-duration); opacity: 1 }
```

### [Hover Effect](https://codepen.io/nazaneyn/pen/gbbzPZG)

made with: transition · :hover

```css
button { position: relative; transition: var(--transition-duration) }
button:hover { transition: var(--transition-duration) }
button::before { position: absolute; top: 0; transform: rotateX(270deg); transition: var(--transition-duration) }
button:hover::before { transform: rotateX(0); transition: var(--transition-duration) }
```

### [Hover Effect Collection](https://codepen.io/nazaneyn/pen/bNNYWwp)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.btn { position: relative; transition: var(--transition-duration) }
.container { padding-top: 2rem }
.btn-1:hover { transition: var(--transition-duration) }
.btn-1::after { position: absolute; top: -100%; transition: var(--transition-duration) }
.btn-1:hover::after { transition: var(--transition-duration); top: 0 }
.btn-1::before { position: absolute; bottom: -100%; transition: var(--transition-duration) }
.btn-1:hover::before { transition: var(--transition-duration); bottom: 0 }
.btn-2:hover { transition: var(--transition-duration) }
.btn-2::after { position: absolute; top: -100%; transition: var(--transition-duration) }
.btn-2:hover::after { transition: var(--transition-duration); top: 0 }
.btn-2::before { position: absolute; bottom: -100%; transition: var(--transition-duration) }
.btn-2:hover::before { transition: var(--transition-duration); bottom: 0 }
```

### [Hover Effect - Perspective](https://codepen.io/nazaneyn/pen/KwwyaRb)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
button { transition: 1s; position: relative; perspective: 200px }
button:hover { transition: 1s }
button::after { position: absolute; top: 0; transform: translateZ(210px); transition: 1s; opacity: 0.8 }
button:hover::after { transform: translateZ(0); transition: 1s; opacity: 1 }
```

### [Hover Effect](https://codepen.io/nazaneyn/pen/gbbXMMW)

made with: transition · :hover

```css
button { transition: 0.4s; position: relative }
button:hover { transition: 0.5s }
button::after { position: absolute; top: 0; transition: 0.5s }
button:hover::after { transition: 0.5s; transform: translate(100%, -100%) }
button::before { position: absolute; top: 0; transform: translate(-100%, 100%); transition: 0.5s }
button:hover::before { transition: 0.5s; transform: translate(0) }
```

### [Hover Effect](https://codepen.io/nazaneyn/pen/YPPEWWW)

made with: transition · :hover

```css
button { transition: 0.4s; position: relative }
button:hover { transition: 0.5s }
button::after { position: absolute; top: 0; transition: 0.5s }
button:hover::after { transition: 0.5s; transform: translate(100%, -100%) }
button::before { position: absolute; top: 0; transform: translate(-100%, 100%); transition: 0.5s }
button:hover::before { transition: 0.5s; transform: translate(0) }
```

### [Hover Effect - Stretch](https://codepen.io/nazaneyn/pen/yyyzoYY)

made with: transition · :hover

```css
button { transition: 0.4s; transform: rotate(0); position: relative }
button:hover { transition: 0.5s }
```

### [button, hover-effect, hoverEffectHover Effect](https://codepen.io/nazaneyn/pen/GggMEaB)

on scroll: button.: color | made with: transition · :hover

```css
button { transition: 0.4s; transform: rotate(0); position: relative }
button:hover { transition: 0.5s }
button::before { position: absolute; top: 0; transition: 0.5s }
button:hover::before { transition: 0.5s }
```

### [Hover Effect](https://codepen.io/nazaneyn/pen/raazPBv)

on scroll: button.: color | made with: transition · :hover

```css
button { transition: 1.3s; transform: rotate(0); position: relative }
button:hover { transform: 1s }
button::before { position: absolute; top: 0; transition: 1s; transform: rotateX(90deg) }
button:hover::before { transform: rotateX(0) }
button::after { position: absolute; top: 0; transition: 1s; transform: rotateY(90deg) }
button:hover::after { transform: rotateY(0) }
```

### [Hover Effect](https://codepen.io/nazaneyn/pen/XJJaoqV)

made with: transition · :hover

```css
button { transition: 0.3s; transform: rotate(0); position: relative }
button::before { position: absolute; top: 0; transform: rotate(-90deg); transition: 0.4s }
button:hover::before { transform: rotate(0); transition: 0.4s linear }
```

### [Hover Effect](https://codepen.io/nazaneyn/pen/myymROQ)

made with: @keyframes · transition · :hover · 3D (perspective / preserve-3d)

```css
.box { perspective: 400px }
h2 { margin-bottom: 2rem }
button { transition: 0.3s; transform: rotate(0); position: relative }
button:focus { transition: 0.3s }
button:hover { transition: 0.2s; transform: rotate(360deg) }
button::before { position: absolute; top: 0; transition: 0.3s }
button:hover::before { transition: 0.3s }
button::after { position: absolute; top: 0; transition: 0.3s }
button:hover::after { transition: 0.3s; animation: right-to-left 0.7s 0.15s }
@keyframes right-to-left animates right
```

### [Glitch Hover Effect](https://codepen.io/nazaneyn/pen/gbbmoJG)

on scroll: button.: background | made with: @keyframes · transition · :hover

```css
h2 { margin-bottom: 2rem }
button { transition: 0.1s }
button:focus { transition: 0.3s; animation: glitch 0.3s, text-color 0.3s }
button:hover { transition: 0.3s; animation: glitch 0.3s, text-color 0.3s }
10% { transform: skewX(40deg) }
20% { transform: skewX(-40deg) }
30% { transform: skewX(30deg) }
40% { transform: skewX(-30deg) }
50% { transform: skewX(20deg) }
60% { transform: skewX(-20deg) }
70% { transform: skewX(10deg) }
87% { transform: skewX(-10deg) }
```

### [Cards JS Float](https://codepen.io/Alexey-Kovalevsky-AKAVA/pen/JooErxp)

held: fixed div | on hover of div.flexible-card: div.flexible-card: transform+top ×3 | made with: position: fixed · transition · :hover · backdrop-filter · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.flexible-grid { perspective: 1000px }
.flexible-card { position: relative; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); transition: transform 0.3s ease, background 0.3s ease; will-change: transform }
.flexible-card h3 { margin-bottom: 0.5rem }
.flexible-card p { opacity: 0.9 }
```

```js
addEventListener('mousemove', (e) => {
addEventListener('mouseleave', () => {
```

### [Cards Hover Flip (no JS)](https://codepen.io/Alexey-Kovalevsky-AKAVA/pen/azzpLRL)

held: fixed div | on scroll: div.card-inner: transform, div.card-front: shadow | made with: position: fixed · transition · :hover · backdrop-filter · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.card { perspective: 1000px }
.card-inner { transition: transform 0.6s ease; position: relative }
.card:hover .card-inner { transform: rotateY(180deg) }
.card-front, .card-back { position: absolute; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: box-shadow 0.3s ease }
.card-front { transform: rotateY(0) }
.card-back { transform: rotateY(180deg) }
.card:hover .card-front { box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15) }
```

### [Cards Hover Blur Hebrew](https://codepen.io/Alexey-Kovalevsky-AKAVA/pen/vEEgezV)

held: fixed div | on hover of div.tour-card: div.tour-card__content: transform+top, p.tour-card__description: transform+opacity+top, button.tour-card__button: transform+opacity+top | made with: position: fixed · transition · :hover · (hover: hover) gate · backdrop-filter · pointer / mouse tracking

```css
.tour-card { position: relative; box-shadow: 0 1px 1px rgba(0,0,0,0.1), 0 2px 2px rgba(0,0,0,0.1), 0 4px 4px rgba(0,0,0,0.1), 0 8px 8px rgba(0,0,0,0.1), 0 16px 16px rgba(0,0,0,0.1) }
.tour-card::before { position: absolute; top: 0; background-position: center; transition: transform calc(var(--d) * 1.5) var(--e) }
.tour-card::after { position: absolute; top: 0; transform: translateY(-33%); transition: transform calc(var(--d) * 2) var(--e) }
.tour-card__content { position: relative; transition: transform var(--d) var(--e) }
.tour-card__content > * + * { margin-top: 1rem }
.tour-card__button { margin-top: 1.5rem; text-transform: uppercase; transition: background-color 0.3s ease }
.tour-card__button:focus { outline-offset: 3px }
.tour-card::after { transform: translateY(0) }
.tour-card__content { transform: translateY(calc(100% - 4.5rem)) }
.tour-card__content > *:not(.tour-card__title) { opacity: 0; transform: translateY(1rem); transition: transform var(--d) var(--e), opacity var(--d) var(--e), filter var(--d) var(--e) }
.tour-card:hover::before, .tour-card:focus-within::before { transform: translateY(-4%); filter: blur(2px) }
.tour-card:hover::after, .tour-card:focus-within::after { transform: translateY(-33%) }
```

### [Magnetic Glow Cards](https://codepen.io/SultanKhanCQ/pen/OPPyEQO)

made with: @keyframes · transition · :hover · mix-blend-mode · custom properties driven by JS · pointer / mouse tracking

```css
.controls-container { margin-bottom: 2.5rem }
.control-btn { transition: all 0.2s ease }
.glow-card { position: relative; transition: transform 0.3s ease }
.glow-card:hover { transform: translateY(-8px) }
.card-content { position: relative }
.card-img { position: relative }
.card-img img { transition: transform 0.3s ease }
.glow-card:hover .card-img img { transform: scale(1.05) }
.card-badge { position: absolute; top: 12px }
.card-title { margin-bottom: 0.75rem }
.card-tag { margin-bottom: 0.75rem }
.card-rating { margin-bottom: 0.75rem }
```

```js
addEventListener("mousemove", (e) => {
style.setProperty("--x", `${xPercent}%`)
style.setProperty("--y", `${yPercent}%`)
```

### [HelloWorld](https://codepen.io/jieajjhf-the-bashful/pen/ZYEqRBW)

made with: nothing recognised — read the code

```css
div { padding-top: 60px }
```

```js
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
```

### [backgroungChange](https://codepen.io/jieajjhf-the-bashful/pen/Pwoyeye)

made with: @keyframes

```css
.one { animation: gradientBG 16s infinite linear alternate }
.two { animation: gradientBG 10s infinite linear }
0% { background-position: 0% 50% }
50% { background-position: 100% 50% }
100% { background-position: 0% 50% }
```

```js
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
```

### [Floating card hover Effect with --sheet() CSS @function (canary only)](https://codepen.io/nocksock/pen/VYwzRZO)

on hover of div.card: div.card: shadow+top | made with: transition · :hover

```css
&::after { position: absolute; inset: -1rem }
```

### [Delightful Squishy Buttons Collection](https://codepen.io/bogdansandu/pen/zxObRja)

made with: @keyframes · transition · :hover · mix-blend-mode

```css
h1 { margin-bottom: 2rem }
.squishy { position: relative; transition: all 250ms }
.squishy-classic { box-shadow: inset 0 1px 0 0 #f4f4f4, 0 1px 0 0 #efefef, 0 2px 0 0 #ececec, 0 4px 0 0 #e0e0e0, 0 5px 0 0 #dedede, 0 6px 0 0 #dcdcdc, 0 7px 0 0 #cacaca, 0 7px 8px 0 #cecece }
.squishy-classic:hover { transform: translateY(4px); box-shadow: inset 0 1px 0 0 #f4f4f4, 0 1px 0 0 #efefef, 0 1px 0 0 #ececec, 0 2px 0 0 #e0e0e0, 0 2px 0 0 #dedede, 0 3px 0 0 #dcdcdc, 0 4px 0 0 #cacaca, 0 4px 6px 0 #cecece }
.squishy-neon { box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.3), 0 2px 0 0 rgb(109 40 217), 0 4px 0 0 rgb(91 33 182), 0 6px 0 0 rgb(76 29 149), 0 8px 0 0 rgb(67 26 131), 0 8px 16px 0 rgba(147,51,234,0.5) }
.squishy-neon::before { position: absolute; inset: 0 }
.squishy-neon:hover { transform: translateY(4px); box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.3), 0 1px 0 0 rgb(109 40 217), 0 2px 0 0 rgb(91 33 182), 0 3px 0 0 rgb(76 29 149), 0 4px 0 0 rgb(67 26 131), 0 4px 8px 0 rgba(147,51,234,0.5) }
.squishy-neon:hover i { animation: bounce 1s infinite }
.squishy-candy { box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.4), 0 2px 0 0 #f472b6, 0 4px 0 0 #f43f5e, 0 6px 0 0 #e11d48, 0 8px 0 0 #be123c, 0 8px 16px 0 rgba(244,114,182,0.5) }
.squishy-candy:hover { transform: translateY(4px); box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.4), 0 1px 0 0 #f472b6, 0 2px 0 0 #f43f5e, 0 3px 0 0 #e11d48, 0 4px 0 0 #be123c, 0 4px 8px 0 rgba(244,114,182,0.5) }
.squishy-candy:hover i { animation: pulse 1s infinite }
.squishy-cosmic { box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.2), 0 2px 0 0 #312e81, 0 4px 0 0 #1e1b4b, 0 6px 0 0 #0f172a, 0 8px 0 0 #020617, 0 8px 16px 0 rgba(49,46,129,0.5) }
```

### [Smooth Scroll Down Animation](https://codepen.io/mahboube89/pen/xbKQJOE)

made with: transition · :hover

```css
.section__wrapper-scroll-down { position: absolute; bottom: 30px; transition: all 0.6s cubic-bezier(0.785, 0.135, 0.15, 0.86) }
.scroll-down__circle--small { transition: all 0.6s ease-in-out }
.scroll-down__line { margin-top: 16px; margin-bottom: 16px; transition: all 0.6s ease-in-out }
.scroll-down__circle--large { transition: all 0.6s ease-in-out; position: relative }
.scroll-down:hover .scroll-down__circle--small { transform: translateY( 55px ) }
.scroll-down:hover .scroll-down__line { opacity: 0 }
.scroll-down:hover .scroll-down__circle--large { transform: scale(1.2) }
```

### [How to animate CSS MASKS for stunning HOVER EFFECTS](https://codepen.io/optimisticweb/pen/azoaxVX)

made with: transition · :hover · mask

```css
.card { outline-offset: 2px; transition: outline 0.5s ease-in-out }
.card-content { border-bottom: 1px dashed }
.card img { mask: url("https://iili.io/f5KMF2a.md.png") center / 100% no-repeat; transition: mask-size 0.75s ease-in-out }
.card:hover img, .card:focus-within img { mask-size: 250% }
```

### [ID Card Hover Interactions](https://codepen.io/T3chScribe/pen/mybwRbv)

made with: transition · :hover

```css
.card { box-shadow: 0 0 20px rgba(255, 0, 150, 0.5), 0 0 40px rgba(0, 204, 255, 0.5); transition: transform 0.3s, box-shadow 0.3s }
.card:hover { transform: scale(1.05); box-shadow: 0 0 30px rgba(255, 0, 150, 0.8), 0 0 50px rgba(0, 204, 255, 0.8) }
```

### [<pixel-canvas> Web Component](https://codepen.io/hexagoncircle/pen/KwPpdBZ)

on hover of div.card: svg.[object: color+top, path.[object: color+top | made with: transition · :hover · prefers-reduced-motion · canvas 2D · requestAnimationFrame

```css
&::before { position: absolute; inset: 0; box-shadow: var(--bg) -0.5cqi 0.5cqi 2.5cqi inset; transition: opacity 900ms var(--ease-out) }
&::after { position: absolute; inset: 0; opacity: 0; transition: opacity 800ms var(--ease-out) }
svg { position: relative; transition: 300ms var(--ease-out); transition-property: color, scale }
button { opacity: 0 }
&:where(:hover, :focus-within) { transition: border-color 800ms var(--ease-in-out) }
&:where(:hover, :focus-within) svg { scale: 1.1; transition: 300ms var(--ease-in-out) }
&:where(:hover, :focus-within)::before { opacity: 0 }
&:where(:hover, :focus-within)::after { opacity: 1 }
```

```js
addEventListener("mouseenter", this)
addEventListener("mouseleave", this)
requestAnimationFrame(() => this.animate(fnName))
```

### [Hover Highlight Links](https://codepen.io/mahboube89/pen/RNbPPwy)

made with: transition · :hover · :focus-visible

```css
.list li { margin-bottom: 24px }
.link { position: relative; text-transform: uppercase }
.separator { transform: rotate(45deg) scale(0); transition: opacity 250ms ease; opacity: 0 }
.link .separator { position: absolute; top: 50%; transform: translateY(-50%) rotate(45deg); opacity: 0; transition: 250ms ease }
.link .span { position: relative; transition: transform 250ms ease }
.link:is(:hover, :focus-visible, .active) .separator { opacity: 1 }
.link:is(:hover, :focus-visible, .active) .span { transform: translateX(30px) }
```

### [Simple card - 6](https://codepen.io/Shrinithi-Murali/pen/dyxBNvz)

on hover of article.card: article.card: background, section.btn: background+color, span.material-symbols-outlined: color+top | made with: transition · :hover

```css
.card { transition: all 0.2s ease-in-out }
.btn span { transition: all 0.5s ease-in-out }
```

### [EI - button hover](https://codepen.io/blademan/pen/mdZxePp)

made with: transition · :hover

```css
h1 { text-transform:uppercase; border-top:1px solid; border-bottom:1px solid }
.buttonBox { position:relative }
button { position:relative; text-transform:uppercase }
.border { position:absolute; transition:all 0.8s ease-in-out }
#first>.border:nth-of-type(1) { top:0; border-top:1px solid transparent }
#first>.border:nth-of-type(2) { bottom:0; border-bottom:1px solid transparent }
#first:hover .border:nth-of-type(1) { border-top:1px solid #89C341 }
#first:hover .border:nth-of-type(2) { border-bottom:1px solid #89C341 }
.buttonBox::after { position: absolute; opacity: 0; top: -30px; transition:all .6s ease-in-out }
.buttonBox:hover::after { opacity: 1 }
```

### [Arc Browser Side-Panel](https://codepen.io/waseem-polus/pen/eYaaeRe)

held: fixed div, fixed div.open | on hover of button.icon-btn: button.icon-btn: background | made with: position: fixed · transition · :hover · clip-path · custom properties driven by JS · pointer / mouse tracking

```css
#trigger { position: fixed; top: 0; bottom: 0 }
#side-panel { position: fixed; top: 0.4rem; bottom: 0.4rem; transform: translatex(-150%); transition: transform var(--trigger-duration) ease-in-out }
.break { border-top: 2px solid rgba(1, 1, 1, 0.075) }
#side-panel.open { transform: translatex(0); transition: transform var(--trigger-duration) cubic-bezier(0.53, 1.28, 0.4, 0.98) }
```

```js
style.setProperty("--trigger-duration", `${triggerDuration}ms`)
addEventListener("mousemove", handleOpenPanel)
addEventListener("mousemove", handleClosePanel)
addEventListener("mouseenter", handleOpenPanel)
```

### [Horizontal Cards - Bootstrap 5 WIP](https://codepen.io/cutydina/pen/OJYQrEr)

made with: transition · :hover

```css
#card-hovereffect { position: relative }
.inside { position: absolute; transition: width 0.4s }
.inside-text { position: absolute }
.inside-btn { text-transform: uppercase; position: absolute; transform: translate(-50%, -50%); top: 85% }
.outside-text { position: absolute; top: 0; padding-top: 0 }
#card-hovereffect h5 { padding-top: 0.5em }
.left-side { position: relative }
.more-btn { position: absolute; bottom: 1rem }
#card-fullimg img { border-bottom: solid }
```

### [Another cool hover effect](https://codepen.io/ephf/pen/oNRGdVR)

on scroll: p.: opacity+top | made with: transition · :hover

```css
&::after { position: absolute; inset: 0; filter: blur(7px); opacity: 0; transition: opacity .5s }
&::after { opacity: .5 }
p { transition: opacity .5s }
h1:hover + p { opacity: 0 }
```

### [image hover effect](https://codepen.io/tortaruga/pen/dyEPMoZ)

on hover of div.card: div.button: transform+opacity+top | made with: transition · :hover

```css
.card { background-position: center; position: relative }
.card::before, .card::after { position: absolute; transition: .4s }
.card:before { transform: rotate(45deg) translate(0px, 430px) }
.card:after { transform: rotate(45deg) translate(0px, -430px) }
.card:hover:before { transform: rotate(45deg) translate(0px, 185px) }
.card:hover:after { transform: rotate(45deg) translate(0px, -185px) }
.button { transform: scale(0); opacity: 0; transition: .4s }
.card:hover .button { transform: scale(1); opacity: 1 }
```

### [card hover effect](https://codepen.io/tortaruga/pen/yLrwNQy)

on scroll: div.img: transform+top | made with: transition · :hover

```css
.shadow:hover .img { transform: translateX(1rem) translateY(2rem) }
.img { background-position: center; transition: .5s; position: relative; top :-20px }
.details { position: relative; top: -10px; transition: .5s }
.shadow:hover .details { top: 10px }
```

### [CSS widen on hover exercise](https://codepen.io/tortaruga/pen/oNOmoXy)

made with: transition · :hover

### [card hover effect exercise](https://codepen.io/tortaruga/pen/NWmBMLG)

made with: transition · :hover

```css
body { padding-top: 2rem; position: relative; transition: .4s }
.theme-switcher { position: absolute; top: 0; background-position: center }
.card { background-position: center; transition: all .5s; box-shadow: var(--card-shadow); filter: brightness(1.3) saturate(.9); position: relative }
.text { position: absolute; bottom: -20% }
.card:hover .text { bottom: 0% }
.card p { opacity: 0 }
.card:hover { transform: scale(1.04); background-position: center }
.card * { transition: .5s }
.card:hover p { opacity: 1 }
.credits { margin-bottom: 1rem }
```

### [Image Gallery Hover Effect](https://codepen.io/DuskoStamenic/pen/gOyKVVp)

on hover of div.gallery-card: img.: opacity+filter ×4 | made with: transition · :hover · :has()

```css
.gallery-card { transition: flex 0.35s ease-in-out }
.gallery-card img { transition: 0.35s ease }
.gallery:has(.gallery-card:hover) .gallery-card:not(:hover) img { filter: grayscale(100%); opacity: 0.5 }
```

### [Hover Effect](https://codepen.io/nazaneyn/pen/QWPMLOg)

made with: transition · :hover · mix-blend-mode · 3D (perspective / preserve-3d)

```css
a { position: relative; position: relative }
a::before { position: absolute; top: -5px; mix-blend-mode: multiply; transition: all 0.5s; transform-origin: top }
a::after { position: absolute; top: 5px; mix-blend-mode: multiply; transition: all 0.5s; transform-origin: bottom }
a:hover::before { top: -12px; transform: perspective(280px) rotateX(70deg); transition: all 0.5s }
a:hover::after { top: 12px; transform: perspective(280px) rotateX(-70deg); transition: all 0.5s }
```

### [Spotlight Dot Grid](https://codepen.io/meat-circuit/pen/vYMLEqP)

held: sticky header | on scroll: div.dot-grid-mask: opacity | made with: position: sticky · transition · :hover · (hover: hover) gate · mask · custom properties driven by JS · pointer / mouse tracking

```css
.container header { position: sticky; top: 0 }
.dot-grid { position: relative }
.dot-grid-mask { position: absolute; top: 0; bottom: 0; opacity: 1; mask-image: radial-gradient( circle var(--radius) at var(--x) var(--y), var(--bg) 40%, transparent ) }
.dot-grid-mask { opacity: 0; transition: opacity 0.2s ease-in-out; will-change: webkitmaskimage, opacity; inset: 0 }
.dot-grid:hover .dot-grid-mask { opacity: 1 }
```

```js
addEventListener("pointermove", (e) => {
style.setProperty("--x", `${e.x}px`)
style.setProperty("--y", `${e.y}px`)
```

### [Button hover effects](https://codepen.io/mradermaker/pen/jOJRNPV)

on hover of button.button: button.button: background+shadow | made with: @keyframes · transition · :hover

```css
.button { position: relative; transition: 0.5s; text-transform: uppercase }
.button:before, .button:after { position: absolute }
.button.--glow:hover { box-shadow: 0 0 5px var(--primary), 0 0 25px var(--primary) }
.button.--pulse:hover { animation: pulse 1.5s infinite }
.button.--door:hover { box-shadow: inset -7.5rem 0 0 0 var(--primary), inset 7.5rem 0 0 0 var(--primary) }
.button.--shutter:after { transition: 0.5s }
.button.--shutter.--down:after { top: 0 }
.button.--shutter.--up:after { bottom: 0 }
.button.--double:hover { box-shadow: 5px 5px 0 var(--primary) }
.button.--shine:after { top: 0; transform: skew(50deg); transition: 0.5s }
.button.--move:after { top: 0; transition: 0.5s }
.button.--draw-border:before { top: 0 }
```

### [Card Hover Effect](https://codepen.io/Juxtopposed/pen/eYXoOOE)

made with: transition · :hover · GSAP · three.js / WebGL · requestAnimationFrame

```css
body { position: relative }
main { position: relative }
.btn { position: relative; box-shadow: 0 0 0 0 var(--secondary); transition: all ease 0.3s }
.btn:hover { box-shadow: 0 0 0 0.4rem var(--secondary-shadow) }
.btn::before { position: absolute; transition: all ease 0.5s }
img { opacity: 0 }
.imageContainer { position: absolute; filter: saturate(100%); transition: all ease 0.5s }
.imageContainer > * { position: absolute; inset: 0 }
```

```js
requestAnimationFrame(animateScene)
gsap.to(planeMesh.material.uniforms.u_opacity, {
```

### [Investing Values Word Poster](https://codepen.io/sebastian_codes/pen/WNmPxLV)

made with: transition · :hover

```css
.word { transition: transform 0.5s ease, color 0.5s ease }
#invest:hover, #growth:hover { transform: scale(1.1) }
```

### [Custom Cursor Stalker](https://codepen.io/reikasan/pen/VwRzeZL)

held: fixed div.mouse-stalker | on scroll: div.mouse-stalker: transform+top, div.mouse-stalker--circle: opacity+background+top | on hover of button.button: div.mouse-stalker--circle: transform+background | made with: position: fixed · transition · mix-blend-mode · pointer / mouse tracking · requestAnimationFrame

```css
.mouse-stalker { position: fixed; top: 0; transform: translate3d(50vw, 50vh, 0); transition: all 0.2s ease-out }
.mouse-stalker.mix-blend { mix-blend-mode: exclusion }
.mouse-stalker.scale--large .mouse-stalker--circle { transform: scale(1.5) }
.mouse-stalker.scale--small .mouse-stalker--circle { transform: scale(0.2) }
.mouse-stalker.show-text .mouse-stalker--text { opacity: 1; position: absolute; top: -50% }
.mouse-stalker--container { position: relative }
.mouse-stalker--circle { opacity: 0; transition: all 0.2s ease-out }
.mouse-stalker--text { opacity: 0; transition: all 0.1s ease-out }
.mouse-stalker.isActive.show .mouse-stalker--circle { opacity: 1 }
a { transition: all 0.2s ease-out }
section { position: relative }
.button { margin-top: 2rem }
```

```js
addEventListener('mouseenter', showMouseStalker)
addEventListener('mouseleave', hideMouseStalker)
addEventListener("mousemove", mousemove)
requestAnimationFrame(update)
```

### [Hover Effect Pricing Section JS & Bootstrap 5.3](https://codepen.io/yasindehfuli/pen/abMOmBN)

on hover of h2.card__heading: div.before: filter ×2 | made with: transition · :hover · mask · mix-blend-mode · GSAP · pointer / mouse tracking

```css
#pricing { position: relative }
#pricing .glow-outer { margin-bottom: 1rem }
#pricing .glow-outer .glow-circle { position: absolute; top: 50px; opacity: 0.3; filter: blur(35px) }
#pricing .glow-outer h2 { margin-top: 2rem }
#pricing .glow-item { position: relative; transform: translate3d(0, 0, 0) }
#pricing .glow-item .before, #pricing .glow-item .after { position: absolute; top: 0; background-position: 0px 0px }
#pricing .glow-item .before { filter: blur(10px) }
#pricing .glow-item .inner-glow { position: absolute; bottom: 0; top: 0 }
#pricing .glow-item ul { margin-bottom: 2rem }
#pricing .glow-item ul li:before { transform: translatey(0.25ch) }
#pricing .glow-button { position: relative; box-shadow: 0 8px 20px var(--button-shadow) }
#pricing .glow-button .gradient { position: absolute; inset: 0; -webkit-mask-image: -webkit-radial-gradient(white, black); transform: scaleY(1.02) scaleX(1.005) rotate(-0.35deg) }
```

```js
addEventListener('mousemove', function(event) {
addEventListener("pointermove", (e) => {
gsap.to(button, {
```

### [Hover Effect Pricing RTL | اشتراک ویژه راست چین](https://codepen.io/yasindehfuli/pen/jOJEjoQ)

on scroll: div.before: filter ×3 | on hover of h2.card__heading: div.before: filter ×2 | made with: transition · :hover · mask · mix-blend-mode · GSAP · pointer / mouse tracking

```css
#pricing { position: relative }
#pricing .glow-outer { margin-bottom: 1rem }
#pricing .glow-outer .glow-circle { position: absolute; top: 50px; opacity: 0.3; filter: blur(35px) }
#pricing .glow-outer h2 { margin-top: 2rem }
#pricing .glow-item { position: relative; transform: translate3d(0, 0, 0) }
#pricing .glow-item .before, #pricing .glow-item .after { position: absolute; top: 0; background-position: 0px 0px }
#pricing .glow-item .before { filter: blur(10px) }
#pricing .glow-item .inner-glow { position: absolute; bottom: 0; top: 0 }
#pricing .glow-item ul { margin-bottom: 2rem }
#pricing .glow-button { position: relative; box-shadow: 0 8px 20px var(--button-shadow); margin-top: 90px }
#pricing .glow-button .gradient { position: absolute; inset: 0; -webkit-mask-image: -webkit-radial-gradient(white, black); transform: scaleY(1.02) scaleX(1.005) rotate(-0.35deg) }
#pricing .glow-button span { position: relative; -webkit-mask-image: -webkit-radial-gradient(white, black) }
```

```js
addEventListener('mousemove', function(event) {
addEventListener("pointermove", (e) => {
gsap.to(button, {
```

### [Untitled](https://codepen.io/LiRise_kursach/pen/Rwvvevz)

made with: transition · :hover

```css
.seperator { margin-bottom: 30px }
.title h1 { text-transform: uppercase }
.item { position: relative; margin-bottom: 30px }
.item .item-in { position: relative }
.item .item-in::before { position: absolute; bottom: 0px; transition: width 0.4s }
.item h4 { margin-top: 25px; text-transform: uppercase }
.item a { text-transform: uppercase; margin-top: 10px }
.item a i { opacity: 0; transition: 0.4s; top: 5px; position: relative }
.item a:hover i { opacity: 1 }
.item .icon { position: absolute; top: 27px }
.item .icon a { text-transform: none }
.item .icon .icon-topic { opacity: 0; transition: 0.4s; top: 0px; position: relative }
```

### [React Dynamic Text Reveal mouseover component](https://codepen.io/phillip-gimmi/pen/RwvWLmx)

made with: transition · :hover · mask · GSAP · pointer / mouse tracking

```css
a { transition: color 0.3s ease }
.bg { padding-bottom: 2rem }
p { text-transform: uppercase }
.hidden-content { position: absolute; top: 0; bottom: 0; --mask: radial-gradient( circle at var(--x) var(--y), black var(--size), transparent 0 ); -webkit-mask-image: var(--mask); mask-image: var(--mask) }
.hidden-content span { margin-top: 10px }
.text-center { margin-top: 20px }
```

```js
addEventListener("mousemove", e => {
gsap.to(".hidden-content", { "--x": x, duration: 0.4, ease: "power4.out" })
gsap.to(".hidden-content", { "--y": y, duration: 0.4, ease: "power4.out" })
gsap.timeline({ paused: true })
addEventListener("mouseenter", () => {tl.restart()
addEventListener("mouseleave", () => {tl.reverse()
addEventListener("mouseenter", e => {this.linkAnimated = true
addEventListener("mouseleave", e => {this.linkAnimated = false
```

### [Menu rolling hover effect-CSS](https://codepen.io/tripti1410/pen/GRPbrYy)

held: fixed div.template-footer | on hover of li.: span.menu-item: transform+top, span.menu-item-active: transform+top | made with: position: fixed · @keyframes · :hover

```css
li a:link .menu-item { -webkit-animation: 3s forwards move-down-initialmenu-noHover; animation: 3s forwards move-down-initialmenu-noHover }
li a:link .menu-item-active { -webkit-animation: 3s forwards move-down-activemenu-noHover; animation: 3s forwards move-down-activemenu-noHover }
li a:hover > .menu-item { -webkit-animation: 3s forwards move-up-initialmenu-onHover; animation: 3s forwards move-up-initialmenu-onHover }
li a:hover > .menu-item-active { -webkit-animation: 3s forwards move-up-activemenu-onHover; animation: 3s forwards move-up-activemenu-onHover }
100% { transform: translateY(-100%) }
100% { transform: translateY(-100%) }
100% { transform: translateY(-70%) }
100% { transform: translateY(-70%) }
0% { transform: translateY(-100%) }
0% { transform: translateY(-100%) }
0% { transform: translateY(-70%) }
0% { transform: translateY(-70%) }
```

### [Interactive Real Estate Listing Card](https://codepen.io/Svilen-Petrov/pen/wvRZOEN)

made with: transition · :hover

```css
.property-card { box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1) }
.property-image img { transition: transform 0.3s ease-in-out }
.property-image:hover img { transform: scale(1.05) }
h2 { margin-top: 15px; margin-bottom: 15px; transition: font-size 0.3s, color 0.3s }
.property-rating { padding-top: 10px }
.property-rating { margin-top: 5px }
```

### [Keyboard Sound Effects - Vanilla JS](https://codepen.io/m_d_84/pen/YzdBBrV)

on scroll: button.key: color | made with: @keyframes · :hover

```css
.key { box-shadow: 8px 8px 25px #00111a }
.key:hover { animation: slidebg 5s linear infinite }
to { background-position: 20vw }
@keyframes slidebg animates background-position
```

### [CSS Mouse Hover Effect](https://codepen.io/Diana-Moretti/pen/YzdBEvd)

made with: transition · :hover

```css
h1::before { transform: scaleX(0) }
h1:hover::before { transform: scaleX(1) }
h1::before { position: absolute; top: 0; bottom: 0; transition: transform 2s ease }
h1 { position: relative }
```

### [Untitled](https://codepen.io/Karma-Kripa/pen/OJrrdvB)

made with: @keyframes · transition · :hover

```css
.pie { position: absolute; top: 50%; transform: translate(-50%, -50%); filter: drop-shadow(0 2px 0px #333) }
.data-text { transition: transform 0.2s ease-in-out }
.data-text__value { transform: translateY(-0.5rem); opacity: 0 }
.data-text__name { transform: translateY(0.5rem); opacity: 0 }
.data-text--show { transform: translateY(0); -webkit-animation: fadeGraphTextIn 0.5s forwards; animation: fadeGraphTextIn 0.5s forwards }
from { opacity: 0 }
to { opacity: 1 }
from { opacity: 0 }
to { opacity: 1 }
@keyframes fadeGraphTextIn animates opacity
```

### [Line Animation Homepage](https://codepen.io/Diana-Moretti/pen/XWoyPYr)

on hover of a.: a.: background | made with: @keyframes · :hover

```css
nav { padding-bottom: 1rem }
h1 { position: relative }
.line { position: relative; top: 0; animation-name: line; animation-duration: 4s; animation-direction: alternate; animation-timing-function: ease-in-out; animation-delay: 2s }
0% { top: 0px }
25% { top: 0 }
50% { top: 100px }
75% { top: 100px }
100% { top: 0 }
@keyframes line animates left, top, width
```

### [Bold on Hover without Shifting](https://codepen.io/anastasiaschmidt/pen/XWoyZMj)

made with: transition · :hover

```css
.hover-effect-bold, .hover-effect-shadow-bold { transition: text-shadow 0.3s }
```

### [Card hover effect using CSS and JS](https://codepen.io/yudizsolutions/pen/eYbevjq)

on scroll: a.: color, div.card-hover-container: color, img.: color, div.card-gradient: color, div.card-bg-characters: opacity | made with: transition · :hover · mask · mix-blend-mode · custom properties driven by JS

```css
.cards-container { position: relative }
.single-card-wrapper > a { transition: color 0.2s cubic-bezier(0.45, 0, 0.55, 1); text-underline-offset: 3px }
.card-hover-container { position: relative }
.card-gradient { position: absolute; mix-blend-mode: darken }
.card-hover-container > img { position: relative }
.card-bg-characters { position: absolute; top: 0; opacity: 0; transition: 0.5s; -webkit-mask-image: radial-gradient( 300px circle at var(--x) var(--y), #000 20%, rgba(0, 0, 0, 0.25), transparent ); mask-image: radial-gradient( 300px circle at }
.card-hover-container:hover .card-bg-characters { opacity: 1 }
```

```js
style.setProperty("--x", `${x}px`)
style.setProperty("--y", `${y}px`)
```

### [Hoverboard-Effect](https://codepen.io/its7rishi/pen/jOXLPyM)

made with: transition · :hover

```css
.square { box-shadow: 0 0 2px #000; transition: 2s ease }
```

### [Product Card](https://codepen.io/Smit29/pen/XWopjxx)

made with: @keyframes · transition · :hover

```css
.card { position: relative; box-shadow: rgba(100, 100, 111, 0.2) 0px 50px 30px -20px; transition: all 0.5s ease-in-out }
.card .image-container { position: relative; margin-bottom: 1rem; transition: all 0.5s ease-in-out }
.card .image-container .price { position: absolute; bottom: -1rem; box-shadow: rgba(100, 100, 111, 0.2) 0px 0px 15px 0px }
.card .favorite { position: absolute; top: 5px }
.card .favorite input { position: absolute; opacity: 0 }
.card .favorite input:checked ~ svg { animation: bouncing 0.5s; filter: drop-shadow(0px 3px 1px rgba(53, 53, 53, 0.14)) }
.card .content { margin-bottom: 1rem }
.card .content .product-name { text-transform: capitalize; margin-bottom: 1rem }
.card .content .color-size-container { text-transform: uppercase; margin-bottom: 1.5rem }
.card .content .color-size-container .colors .colors-container { margin-top: 0.2rem }
.card .content .color-size-container .colors .colors-container .color { position: relative }
.card .content .color-size-container .colors .colors-container .color .color-nam { position: absolute; bottom: 125%; transform: translateX(-50%) }
```

### [Profile Stack Hover](https://codepen.io/pleasedonotdisturb/pen/poqgjKx)

made with: transition · :hover

```css
.card { position: relative; box-shadow: 0 3px 10px rgba(0, 0, 0, .2) }
.card::before, .card::after { position: absolute; top: 0; box-shadow: 0 3px 10px rgba(0, 0, 0, .2); transition: .5s }
.card:hover::after { transform: rotate(10deg) }
.card:hover::before { transform: rotate(20deg) }
.card .imgBox { position: absolute; top: 10px; bottom: 10px; transition: .5s }
.card:hover .imgBox { bottom: 75px }
.card .imgBox img { position: absolute; top: 0 }
.card .details { position: absolute; bottom: 10px }
.card .details h2 { margin-top: 5px }
```

### [10 CSS Cards with hover effects](https://codepen.io/Smit29/pen/GRPogVz)

on hover of div.card1: div.card1: transform+top, div.logo: transform+top, svg.[object: filter+top | made with: @keyframes · transition · :hover · (hover: hover) gate · clip-path · backdrop-filter · 3D (perspective / preserve-3d)

```css
.main-box { position: relative }
.main-box::before { position: absolute; top: 1rem }
.card1 { position: relative; box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px; transition: all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) }
.card1 .background { position: absolute; inset: 0 }
.card1 .logo { position: absolute; bottom: 50%; transform: translate(50%, 50%); transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) }
.card1 .box { position: absolute; backdrop-filter: blur(5px); border-top: 2px solid white; box-shadow: rgba(100, 100, 111, 0.364) -7px 7px 29px 0px; transition: all 1s ease-in-out }
.card1 .box .icon { position: absolute; top: 15px }
.card1 .box .icon .svg { transition: all 0.5s ease-in-out }
.card1 .box::before { position: absolute; inset: 0; opacity: 0; transition: all 0.5s ease-in-out }
.card1 .box1 { bottom: -50% }
.card1 .box1:hover::before { opacity: 1 }
.card1 .box1:hover .icon .svg { filter: drop-shadow(0 0 5px white) }
```

### [Profile card with Engaging hover effect](https://codepen.io/Smit29/pen/YzdybMz)

made with: transition · :hover

```css
.card { position: relative; transition: all 0.5s ease-in-out; box-shadow: #604b4a30 0px 70px 30px -50px }
.card .mail { position: absolute; top: 1.4rem }
.card .profile-pic { position: absolute; top: 3px; transition: all 0.5s ease-in-out 0.2s, z-index 0.5s ease-in-out 0.2s }
.card .profile-pic img { object-position: 0px 0px; transition: all 0.5s ease-in-out 0s }
.card .bottom { position: absolute; bottom: 3px; top: 80%; box-shadow: #604b4a30 0px 5px 5px 0px inset; transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) 0s }
.card .bottom .content { position: absolute; bottom: 0 }
.card .bottom .content .about-me { margin-top: 1rem }
.card .bottom .bottom-bottom { position: absolute; bottom: 1rem }
.card .bottom .bottom-bottom .social-links-container svg { filter: drop-shadow(0 5px 5px #a5848222) }
.card .bottom .bottom-bottom .social-links-container svg:hover { transform: scale(1.2) }
.card .bottom .bottom-bottom .button { box-shadow: #a5848222 0px 5px 5px 0px }
.card:hover .bottom { top: 20%; transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) 0.2s }
```

### [Button hover effect](https://codepen.io/Kevin99L/pen/PoXPLjj)

made with: transition · :hover

```css
button { position: relative; transition: 1s }
button::after { position: absolute; top: -10px; transition: 0.5s }
button::before { position: absolute; top: 80%; transition: 0.5s }
button:hover::before, button:hover::after { transform: scale(0) }
button:hover { box-shadow: inset 0px 0px 25px #1479EA }
```

### [Sci fi card hover effect](https://codepen.io/Smit29/pen/BavyNNp)

made with: transition · :hover · clip-path

```css
.card { position: relative }
.card:nth-child(2) { filter: hue-rotate(300deg) brightness(1.3) }
.card:nth-child(3) { filter: hue-rotate(200deg) brightness(1.5) }
.card:nth-child(4) { filter: hue-rotate(60deg) brightness(3) }
.card .boxshadow { position: absolute; transform: scale(0.8); box-shadow: red 0px 30px 70px 0px; transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86) }
.card .main { position: relative; clip-path: polygon(0 0, 100% 0, 100% 40px, 100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0 calc(100% - 40px)); box-shadow: red 0px 7px 29px 0px; transition: all 0.3s cubic-bezier(0.785, 0 }
.card .main .top { position: absolute; top: 0px; border-top: 115px solid black; transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86) }
.card .main .side { position: absolute; top: 0; transform: translateX(-50%); clip-path: polygon(0% 0%, 50% 0, 95% 45%, 100% 100%, 0% 100%); transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86) 1s }
.card .main .right { transform: translateX(50%) scale(-1, 1) }
.card .main .title { position: absolute; transform: translateX(-50%); top: 90px; opacity: 0; transition: all 0.2s ease-out 0s }
.card .main .button-container { position: absolute; bottom: 10px; transform: translateX(-50%) }
.card .main .button-container .button { position: absolute; transform: translateX(-50%); clip-path: polygon(0 0, 100% 0, 81% 100%, 21% 100%); transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86) }
```

### [Glitch image hover effect with shaders](https://codepen.io/Juxtopposed/pen/GRPRPyR)

on hover of img.: canvas.: transform | made with: transition · :hover · three.js / WebGL · requestAnimationFrame

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

### [Offset Text Outline](https://codepen.io/pleasedonotdisturb/pen/PoXYzMq)

on hover of a.: a.: transform+top | made with: transition · :hover

```css
.wrapper { position: relative }
a { text-transform: uppercase; transition: all 250ms }
a:hover { transform: translate(-2px, -2px) }
```

### [Wavy image hover effect with shaders](https://codepen.io/Juxtopposed/pen/VwVoEBr)

on scroll: canvas.: transform+top | on hover of img.: canvas.: transform+top | made with: transition · :hover · three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

```css
canvas { transition: 1s transform }
canvas:hover { transform: scale(1.2) }
#imageContainer { position: relative; filter: saturate(50%); transition: all ease 0.5s }
#imageContainer:hover { filter: saturate(100%) }
#imageContainer > * { position: absolute; inset: 0 }
.jux-linx { position: absolute; bottom: 20px }
a { transition: 0.1s all ease-in }
a:nth-child(1):hover { box-shadow: 0px 2px 0 #349eff }
a:nth-child(2):hover { box-shadow: 0px 2px 0 #ff5757 }
```

```js
addEventListener("mousemove", handleMouseMove, false)
requestAnimationFrame(animateScene)
```

### [Card Hover effect](https://codepen.io/Smit29/pen/VwVoroo)

made with: transition · :hover

```css
.card { position: relative; box-shadow: rgba(141, 177, 205, 0.618) 0px 40px 30px -25px; transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86) }
.card:hover { transform: scale(1.05); box-shadow: rgba(141, 177, 205, 0.618) 0px 30px 30px -25px }
.icons-container { position: absolute; bottom: 0 }
.icons-container .svg { transition: transform 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86) }
.icons-container .svg:hover { transform: scale(1.5) }
.title { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.box { position: absolute; box-shadow: rgba(66, 66, 66, 0.349) 5px 0px 10px 0px inset; transition: all 0.5s ease-in-out }
.box .content { position: relative; transform: translateY(-100%); opacity: 0; transition: all 0.5s ease-in-out 0.3s }
.box .content .box-title { margin-bottom: 1rem }
.box:hover { top: 0; box-shadow: rgba(66, 66, 66, 0) 5px 0px 10px 0px inset }
.box:hover .content { transform: translate(0, 0); opacity: 1 }
.box1 { top: -85% }
```

### [Card Hover Effects - Reveal Crad Details on Hover](https://codepen.io/nguyenanhtuan/pen/abQMrBY)

held: fixed div.copyright | on hover of div.card: div.card: transform+top ×2, div.card-header: shadow+top, div.card-footer: shadow+top, div.card-header: transform+opacity+shadow+top | made with: position: fixed · transition · :hover · backdrop-filter

```css
:root { --transition: all .2s ease }
.copyright { position: fixed; bottom: 0; transform: translateX(-50%); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px) }
.copyright a { transition: 0.25s }
.card { position: relative; transition: var(--transition) }
.card:hover { transform: scale(1.05) }
.card:hover .card-header { bottom: 100%; box-shadow: 0px -15px 12px -7px rgba(0, 0, 0, 0.1) }
.card:hover .card-footer { top: 100%; box-shadow: 0px 15px 12px -7px rgba(0, 0, 0, 0.1) }
.card .card-header { position: absolute; bottom: calc(100% - 70px); transition: var(--transition) }
.card .card-header .card-header__lbl { top: 0 }
.card .card-body .card-image { position: relative }
.card .card-footer { position: absolute; top: calc(100% - 70px); transition: var(--transition) }
.card.effect2:hover .card-header, .card.effect2:hover .card-footer { transform: translateY(0); opacity: 1 }
```

### [Awwwards Menu hover-effect](https://codepen.io/5thAttemptCode/pen/ZEmwKjM)

made with: transition · :hover

```css
:root { --transition: all 0.5s }
section { padding-top: 100px; margin-bottom: 100px }
.box { position: relative; padding-top: 50px; border-bottom: 4px solid var(--color) }
.box a { transition: var(--transition) }
.box a .image { position: absolute; bottom: -200px }
.box a .image img { position: absolute; bottom: 0; transition: var(--transition); filter: sepia(60%) }
.box a:hover .image img { bottom: 110%; rotate: 15deg }
.box-rotate-minus a:hover .image img { rotate: -15deg }
```

### [Text scroll and hover effect with GSAP and clip](https://codepen.io/Juxtopposed/pen/mdQaNbG)

made with: transition · :hover · clip-path · GSAP · ScrollTrigger

```css
.text { transition: background-size cubic-bezier(.1,.5,.5,1) 0.5s; border-bottom: 1px solid #2F2B28; position: relative }
span { position: absolute; clip-path: polygon(0 50%, 100% 50%, 100% 50%, 0 50%); transition: all cubic-bezier(.1,.5,.5,1) 0.4s }
.text:hover > span { clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%) }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to(text, {
scrollTrigger: { trigger: text, start: 'center 80%', end: 'center 20%', scrub: true, }
```

### [Directionally aware hover effect](https://codepen.io/SarfDime/pen/GRwPYZo)

made with: transition · :hover · :focus-visible · custom properties driven by JS

```css
body { position: relative }
main .elementsContainer section { position: relative; text-transform: uppercase; transition: all 0.5s cubic-bezier(0, 0.5, 0.5, 1); --scale: 0; box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px }
main .elementsContainer section::before { position: absolute; inset: -0.5vmax; transform: scaleX(var(--scale)); transition: transform 0.7s cubic-bezier(0, 0.5, 0.5, 1) }
main .elementsContainer section:focus-visible { opacity: 1 }
main .elementsContainer section:focus-visible::before { transition: all 0.7s cubic-bezier(0, 0.5, 0.5, 1); transform: scale(1) }
main .elementsContainer section:active::before { transition: background-color 0.2s cubic-bezier(0, 0.5, 0.5, 1) }
```

```js
addEventListener("mouseenter", (event) => {
addEventListener("mouseleave", (event) => {
style.setProperty("--origin", coordinates)
style.setProperty("--scale", scale)
```

### [Logo reveal card hover effect](https://codepen.io/Smit29/pen/WNYYRab)

on scroll: div.card: transform+top, span.dot: transform+top, div.text: opacity+top | made with: transition · :hover

```css
.card { position: relative; transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) }
.dot-container-main { position: relative }
.dot { position: absolute; border-top: 1px solid white; transition: left 1s ease-in-out, top 1s ease-in-out, transform 0.2s ease-in-out }
.dot:hover { transform: scale(1.8) }
.dot1 { top: -80px }
.dot52 { top: -75px }
.dot4 { top: -50px }
.dot3 { top: -70px }
.dot72 { top: -85px }
.dot2 { top: -30px }
.dot53 { top: -80px }
.dot5 { top: -20px }
```

### [Follow Us card hover effect](https://codepen.io/Smit29/pen/ExOdxxW)

on hover of div.card: div.card: transform+top, div.logo: transform+top, svg.[object: filter+top | made with: transition · :hover · backdrop-filter

```css
.card { position: relative; box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px; transition: all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) }
.background { position: absolute; inset: 0 }
.logo { position: absolute; bottom: 50%; transform: translate(50%, 50%); transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) }
.icon .svg { transition: all 0.5s ease-in-out }
.box { position: absolute; backdrop-filter: blur(5px); border-top: 2px solid white; box-shadow: rgba(100, 100, 111, 0.364) -7px 7px 29px 0px; transition: all 1s ease-in-out }
.box::before { position: absolute; inset: 0; opacity: 0; transition: all 0.5s ease-in-out }
.box1 { bottom: -50% }
.box1:hover::before { opacity: 1 }
.box1:hover .icon .svg { filter: drop-shadow(0 0 5px white) }
.box2 { bottom: -35% }
.box2:hover::before { opacity: 1 }
.box2:hover .icon .svg { filter: drop-shadow(0 0 5px white) }
```

### [Untitled](https://codepen.io/hilola/pen/bGQxwgr)

made with: transition · :hover

```css
.seperator { margin-bottom: 30px }
.title h1 { text-transform: uppercase }
.item { position: relative; margin-bottom: 30px }
.item .item-in { position: relative }
.item .item-in::before { position: absolute; bottom: 0px; transition: width 0.4s }
.item h4 { margin-top: 25px; text-transform: uppercase }
.item a { text-transform: uppercase; margin-top: 10px }
.item a i { opacity: 0; transition: 0.4s; top: 5px; position: relative }
.item a:hover i { opacity: 1 }
.item .icon { position: absolute; top: 27px }
.item .icon a { text-transform: none }
.item .icon .icon-topic { opacity: 0; transition: 0.4s; top: 0px; position: relative }
```

### [Card hover effects](https://codepen.io/Smit29/pen/JjeBBQV)

on hover of div.card: div.card: transform+top, div.border: transform+opacity+top, span.trail: opacity+top, span.logo-bottom-text: transform+opacity+top, span.bottom-text: transform+opacity+top | made with: @keyframes · transition · :hover

```css
.card { position: relative; transition: all 0.5s ease-in-out }
#logo-second { padding-bottom: 10px }
.border { position: absolute; inset: 0px; opacity: 0; transform: rotate(10deg); transition: all 0.5s ease-in-out }
.bottom-text { position: absolute; bottom: 13px; transform: translateX(-50%); text-transform: uppercase; opacity: 0; transition: all 0.5s ease-in-out }
.content { transition: all 0.5s ease-in-out }
.content .logo { position: relative; transition: all 1s ease-in-out }
.content .logo .logo1 { position: absolute }
.content .logo .logo2 { position: absolute }
.content .logo .trail { position: absolute; opacity: 0 }
.content .logo-bottom-text { position: absolute; top: 50%; transform: translate(-50%, -50%); margin-top: 30px; opacity: 0; transition: all 0.5s ease-in-out 0.5s }
.card:hover { transform: scale(1.1) }
.card:hover .logo { animation: opacity 1s ease-in-out }
```

### [button hover effect](https://codepen.io/Mehrshad-Z/pen/GRwdbro)

made with: transition · :hover

```css
.btn-container .btn-icon { transition: all 0.8s }
```

### [Social Connect Bar](https://codepen.io/itsabhaybal/pen/eYQMGXj)

on scroll: span.icon: background+color, i.fa-brands: color, span.tooltip: transform+opacity+background+top | made with: transition · :hover

```css
.wrapper { position: relative }
.holder { position: relative }
.icon { transition: all 0.5s ease }
.tooltip { position: absolute; top: 0%; transform: translate(-25%, -35px); transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); opacity: 0 }
.tooltip::before { position: absolute; transform: translate(2rem, 15px) rotate(45deg); transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) }
.twitter .tooltip::before, .reddit .tooltip::before { transform: translate(1.7rem, 15px) rotate(45deg) }
.github .tooltip::before { transform: translate( 1.6rem, 15px) rotate(45deg) }
.icon:hover ~ .tooltip { transform: translate(-25%, -60px); opacity: 1 }
```

### [Simple Hover Focus Animations using CSS](https://codepen.io/trstefan/pen/PoxQpwx)

on scroll: img.: opacity ×4 | on hover of img.: img.: opacity | made with: transition · :hover

```css
.container img { transition: all 0.3s }
.container:hover > :not(:hover) { opacity: 0.2 }
```

### [Direction-aware button hover effect with pure CSS](https://codepen.io/Juxtopposed/pen/qBQPYxw)

made with: transition · :hover

```css
button { position: relative }
button::before { position: absolute; bottom: 0; border-bottom: 4px #4155FF solid; transition: width 0.1s ease-out }
button::after { position: absolute; bottom: 0; border-bottom: 4px #4155FF solid; transition: width 0.1s ease-out }
.btn-cont { position: relative }
span:nth-child(1) { position: absolute; bottom: 0 }
span:nth-child(2) { position: absolute; bottom: 0 }
span:nth-child(1):not(:hover) ~ button::before { transition: width 0.1s ease-in }
span:nth-child(2):not(:hover) ~ button::after { transition: width 0.1s ease-in }
```

### [Simple Card Hover Effect](https://codepen.io/John-Magayanes/pen/bGQBpWg)

on hover of img.: img.: filter, div.: opacity | made with: transition

```css
.container { position: relative; margin-top: 10%; margin-bottom: 10%; box-shadow: -4px 6px 10px rgba(0, 0, 0, 0.4) }
#card { transition: height 500ms, filter 1s; filter: saturate(20%) blur(1.5px) }
#gradient { position: absolute; top: 0; transition: opacity 750ms; opacity: 0% }
h3.location { position: absolute; bottom: 0 }
```

```js
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
```

### [Movie Poster Interaction](https://codepen.io/pleasedonotdisturb/pen/oNQLVXB)

made with: transition · :hover · backdrop-filter

```css
.wrapper { position: relative }
.card { position: relative; box-shadow: 0 5px 10px rgba(0, 0, 0, .2) }
.poster { position: relative; top: 0 }
.poster::before { position: absolute; bottom: -45%; transition: .3s }
.card:hover .poster::before { bottom: 0 }
.poster img { position: absolute; top: 0; transition: .3s }
.card:hover .poster img { transform: scale(1.1) }
.details { position: absolute; bottom: -100%; backdrop-filter: blur(16px) saturate(120%); transition: .3s }
.card:hover .details { bottom: 0 }
.details h1 { margin-bottom: 5px }
.details h2 { margin-bottom: 10px; opacity: .6 }
.details .rating { position: relative; margin-bottom: 15px }
```

### [Portfolio - FCC](https://codepen.io/m_d_84/pen/ExOxJoN)

held: fixed nav | on hover of li.: a.: color | made with: position: fixed · @keyframes · transition · :hover

```css
#navbar { position: fixed; top: 0px }
ul { border-bottom: 2px solid #fef9c7; background-position: right; animation: fillIn 3.5s 2s forwards }
100% { background-position: left }
li > a { transition: 0.5s ease-in }
li > a:hover { text-underline-offset: 3px }
hr { border-top: 1px solid #fef9c7 }
h1 { margin-top: 30px }
#typed { animation: typing; animation-duration: 2s; animation-timing-function: steps(30, end); animation-fill-mode: forwards }
p { margin-bottom: 50px }
#about { padding-bottom: 100px }
#about-title { margin-top: 0 }
#flex-container { margin-top: 100px }
```

### [Simple Button with Hover Effect](https://codepen.io/SandipanIO/pen/vYVbReB)

on hover of button.btn: button.btn: color | made with: transition · :hover

```css
.btn { position: relative; transition: all 0.3s ease-in }
.btn::before { position: absolute; top: 0; transition: all 0.3s ease-in }
```

### [Image Hover Effect](https://codepen.io/flexcode/pen/LYgdgxW)

made with: transition · :hover · backdrop-filter

```css
.card { position: relative; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3) }
.content { position: absolute; bottom: 0; backdrop-filter: blur(25px); transform: scale(1); box-shadow: 0 0 20px rgba(0, 0, 0, 0.4); transition: all 0.5s ease-in-out }
.card:hover .content { transform: scale(0.95); bottom: 6px }
```

### [Hover Effect](https://codepen.io/flexcode/pen/OJBQxVa)

held: fixed div.watermark-ctr | made with: position: fixed · @keyframes · transition · :hover · clip-path · mix-blend-mode · GSAP

```css
.morph-bg { position: absolute; top: 0; opacity: 0; transition: opacity 0.3s; transform-origin: left top }
.morph-bg--visible { opacity: 1 }
.morph-bg--has-transition { transition: 0.3s; will-change: transform, border-radius, height, width }
.demo-morph-bg-target { position: absolute; bottom: 0 }
.cd-position-relative { position: relative }
.cd-margin-bottom-sm { margin-bottom: 1.5rem }
.cd-margin-bottom-xl { margin-bottom: 4.5rem }
.watermark-ctr { position: fixed; bottom: 1.5rem }
.generate-button { --generate-button-star-1-opacity: 0.25; --generate-button-star-1-scale: 1; --generate-button-star-2-opacity: 1; --generate-button-star-2-scale: 1; --generate-button-star-3-opacity: 0.5; --generate-button-star-3-scale: 1; }
.generate-button:before { position: absolute; bottom: -10px; filter: blur(12.5px); clip-path: inset(-200% -30% 10px -30% round 29px); opacity: 0; transition: opacity 0.4s; transform: translateZ(0) }
.generate-button span { position: relative }
.generate-button .stroke { mix-blend-mode: hard-light }
```

```js
addEventListener("mouseenter", function (event) {
addEventListener("mouseleave", function (event) {
gsap.to(button, {
```

### [Minimalist design travel cards](https://codepen.io/MatteoPeroniDev/pen/PoyKXKv)

on scroll: div.card: transform+top | made with: @keyframes · transition · :hover

```css
h1 { margin-top: 3rem; margin-bottom: 3rem }
.card { box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px; transition: transform 0.2s }
h2 { text-transform: uppercase }
.card:hover path { animation: dash 3s linear forwards }
.card:hover { transform: translateY(-10px) }
@keyframes dash animates stroke-dashoffset
```

### [hover 3d card](https://codepen.io/Nan_Wong/pen/yLxmavm)

made with: transition · :hover · 3D (perspective / preserve-3d) · custom properties driven by JS

```css
.card { transition: 0.4s; transform: perspective(800px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) }
.card:hover { box-shadow: 0px 64px 40px rgba(60,60,60,0.2); scale: 1.02 }
```

```js
style.setProperty('--rx', `${rx}deg`)
style.setProperty('--ry', `${ry}deg`)
style.setProperty('--rx', `0deg`)
style.setProperty('--ry', `0deg`)
```

### [Button Hover Effect](https://codepen.io/asmr2dev/pen/ExeBjjo)

made with: position: fixed · transition · :hover

```css
.btn1 { position: relative }
.btn1::before, .btn1::after { position: absolute; transition: all .5s ease-in-out }
.btn1::before { top: 0 }
.btn1::after { bottom: 0 }
.btn2 { position: relative }
.btn2::before { position: absolute; top: 0; transform: scaleX(0); transition: all .5s ease-in-out }
.btn2:hover::before { transform: scaleX(1) }
.btn3 { transition: box-shadow .3s ease-in-out }
.btn3:hover { box-shadow: 0 0 5px 5px rgb(124, 177, 45), 0 0 25px 25px rgb(124, 177, 45) }
.youtube { position: fixed; top: 1rem; transform: translateX(-50%) }
```

### [Playing Cards](https://codepen.io/waseem-polus/pen/NWLVzwb)

on scroll: div.red: transform+filter+top | on hover of div.black: div.black: transform+filter+top, div.red: transform+top, div.red: transform+filter+top | made with: @keyframes · transition · :hover

```css
:root { --card-animation: slide-down 1s ease-in-out backwards }
0% { opacity: 0; rotate: 45deg; transform: translateX(50vw) translateY(-50vh) rotate(5deg) }
40% { opacity: 100% }
75% { transform: translateX(0) translateY(0) rotate(0) }
100% { transform: translateX(inset) translateY(inset) rotate(inset) }
.card:nth-of-type(1) { rotate: -45deg; animation: var(--card-animation) }
.card:nth-of-type(1):hover { transform: translateX(calc(-2rem * sin(40deg))) translateY(calc(-2rem * cos(40deg))) rotate(-10deg) }
.card:nth-of-type(2) { rotate: -30deg; animation: var(--card-animation) 0.2s }
.card:nth-of-type(2):hover { transform: translateX(calc(-2rem * sin(35deg))) translateY(calc(-2rem * cos(35deg))) rotate(-5deg) }
.card:nth-of-type(3) { rotate: -15deg; animation: var(--card-animation) 0.4s }
.card:nth-of-type(3):hover { transform: translateX(calc(-2rem * sin(20deg))) translateY(calc(-2rem * cos(20deg))) rotate(-5deg) }
.card:nth-of-type(4) { animation: var(--card-animation) 0.6s }
```

### [Sparkle Text Effect | SVG & CSS Animations](https://codepen.io/cheyshel98/pen/zYJXBZG)

on scroll: path.[object: transform+top ×6, path.[object: transform ×4, polygon.[object: transform ×2 | on hover of button.: path.[object: transform+top ×20, path.[object: transform ×8, polygon.[object: transform ×2 | made with: @keyframes · :hover · scroll listener · requestAnimationFrame

```css
.container { margin-top: 20vh }
.text-sparkle { position: relative }
.notes { position: absolute }
.input-container { margin-bottom: 35px }
.input-container input { margin-bottom: 1px }
.word-wrapper { position: relative }
.text { position: relative }
.sparkle { position: absolute }
.word-wrapper:hover > .before > .sparkle, .word-wrapper:hover > .after > .sparkl { animation-duration: 1s; animation: drop 1s 1 alternate ease-in-out forwards }
.word-wrapper > .before > .sparkle, .word-wrapper > .after > .sparkle { animation-duration: 0.5s; animation-fill-mode: fowards }
.cross.sm { position: relative }
.cross.sm span { position: absolute }
```

### [Untitled](https://codepen.io/sl33pz/pen/NWLepLw)

made with: @keyframes · transition · :hover

```css
h1 { text-transform: uppercase; border-top: 1px solid; border-bottom: 1px solid }
.buttonBox { position: relative }
button { position: relative; text-transform: uppercase }
.border { position: absolute; transition: all 0.5s ease-in-out }
#first > .border:nth-of-type(1) { top: 0; border-top: 1px solid white }
#first > .border:nth-of-type(2) { bottom: 0; border-bottom: 1px solid white }
#second > .border:nth-of-type(1) { top: 0; border-top: 1px solid white; transition: width 0.5s ease-in-out, transform 1s ease-in-out }
#second > .border:nth-of-type(2) { bottom: 0; border-bottom: 1px solid white; transition: width 0.5s ease-in-out, transform 1s ease-in-out }
#second:hover .border { transform: translate(-50%, 0); transition: width 0.8s ease-in-out, transform 0.3s ease-in-out }
#third > .border:nth-of-type(1) { top: 0; border-top: 1px solid white }
#third > .border:nth-of-type(2) { bottom: 0; border-bottom: 1px solid white }
#third > .border:nth-of-type(3) { top: 0 }
```

### [Cute Dino using pure CSS.](https://codepen.io/FaltuCoderz/pen/RwYeqyw)

made with: 3D (perspective / preserve-3d)

```css
.head { top:-30px; position: relative }
.head::before { position: absolute; top: 20px; transform: rotate(75deg) }
.eye1 { position: absolute; top: 20px }
.eye1::before { position: absolute; top: 6px }
.eye2 { position: absolute; top: 18px }
.eye2::before { position: absolute; top: 8px }
.nose { position: absolute; top: 45px; transform: rotate(-25deg) }
.nose::before { position: absolute; top:-15px }
.nose::after { position: absolute; top: 7px; opacity: 0.6 }
.neck { position: relative; top: 70px }
.neck::before { position: absolute }
.body { position: relative; top: 160px }
```

### [clip-path hover effect](https://codepen.io/Megha02/pen/mdGKzeY)

made with: transition · :hover · clip-path

```css
.container:hover .inner { clip-path: circle(75%) }
span { position: absolute; top: 15%; opacity: 1 }
.container:hover span { opacity: 0 }
.inner { position: relative; clip-path: circle( 10% at 90% 20%); transition: clip-path 0.4s ease-in-out }
```

### [Video Reveal Hover Effect (cursor)](https://codepen.io/abhiishek-10/pen/yLxoeZy)

held: fixed div.cb-cursor | made with: position: fixed · transition · :hover · clip-path · mix-blend-mode · Web Animations API (.animate)

```css
.homeHero { padding-top: 0 }
.homeHero--inner { position: relative }
.homeHero__title { text-transform: uppercase; position: relative }
.homeHero__title div { transition: 1.5s opacity ease .5s,1.5s transform ease .5s,.5s color ease,.5s -webkit-text-stroke ease,1.5s -webkit-transform ease .5s,1.5s -moz-transform ease .5s,1.5s -o-transform ease .5s }
.homeHero__clips { margin-bottom: 35px; -webkit-clip-path: polygon(50% 0%,99% 46%,100% 100%,70% 100%,70% 67%,30% 67%,30% 100%,0 100%,0 46%); clip-path: polygon(50% 0%,99% 46%,100% 100%,70% 100%,70% 67%,30% 67%,30% 100%,0 100%,0 46%); mix-b }
.cb-cursor { position: fixed; top: 0; will-change: transform; transition: opacity .3s,color .4s }
.cb-cursor.-video { mix-blend-mode: exclusion }
.cb-cursor-video { transform: scale(0); opacity: 0; transition: opacity .1s,-webkit-transform .3s ease-in-out; transition: transform .3s ease-in-out,opacity .1s; transition: transform .3s ease-in-out,opacity .1s,-webkit-transform .3s ease- }
.cb-cursor.-video .cb-cursor-video { opacity: 1; transform: scale(1) }
.cb-cursor #reel-clips { position: absolute; top: -175px; -webkit-clip-path: polygon(50% 0%,99% 46%,100% 100%,70% 100%,70% 67%,30% 67%,30% 100%,0 100%,0 46%); clip-path: polygon(50% 0%,99% 46%,100% 100%,70% 100%,70% 67%,30% 67%,30% 100%,0 100%,0 }
```

```js
.animate({
```

### [Parallax Depth Cards with nice hover effect](https://codepen.io/Smit29/pen/eYjwNxd)

on hover of div.card: div.card: transform+top, h1.card-title: transform+top | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.parent { perspective: 1000px }
.card { padding-top: 100px; background-position: center center; transition: all 0.5s ease-in-out }
.card:hover { background-position: 80% 20%; transform: rotate3d(0.5, 1, 0, 30deg) }
.content-box { box-shadow: rgba(0, 115, 255, 0.925) 0px 20px 50px -25px; transition: all 0.5s ease-in-out }
.content-box .card-title { transition: all 0.5s ease-in-out; transform: translate3d(0px, 0px, 20px) }
.content-box .card-title:hover { transform: translate3d(0px, 0px, 50px) }
.content-box .card-content { padding-top: 15px; transition: all 0.5s ease-in-out; transform: translate3d(0px, 0px, 20px) }
.content-box .card-content:hover { transform: translate3d(0px, 0px, 50px) }
.content-box .see-more { text-transform: uppercase; padding-top: 15px; transition: all 0.5s ease-in-out; transform: translate3d(0px, 0px, 20px) }
.content-box .see-more:hover { transform: translate3d(0px, 0px, 50px) }
.date-box { position: absolute; top: 75px; box-shadow: #0066ff 0px 20px 60px 0px, #00c8ff 0px 18px 36px -18px; transform: translate3d(0px, 0px, 50px) }
.card2 { filter: hue-rotate(150deg) }
```

### [:has experiment](https://codepen.io/barokdg/pen/MWBbZVa)

made with: @keyframes · transition · :hover · :has()

```css
body { transition: background 500ms linear }
.info h1::before { -webkit-animation: slide 1000ms infinite; animation: slide 1000ms infinite }
to { transform: translateX(-10px) }
to { transform: translateX(-10px) }
@keyframes slide animates transform
```

### [Steam - Featured Card](https://codepen.io/ch-andrew/pen/dyjGqpr)

on scroll: div.overlay: opacity, div.card-data: opacity+top, div.card-screenshots: opacity+top | on hover of article.card-featured: div.overlay: opacity ×2, div.card-data: opacity+top ×2, div.card-screenshots: opacity+top ×2 | made with: transition · :hover

```css
.card-featured { position: relative }
.overlay { top: 0; position: absolute; opacity: 0; transition: opacity 0.2s }
.tag-price { position: absolute; bottom: 5% }
.card-data { position: absolute; top: 100%; opacity: 0.5; transition: top 0.4s, opacity 0.6s }
.card-data .card-name { text-transform: uppercase }
.card-data .card-stat .label { text-transform: uppercase }
.card-button { position: absolute; bottom: 7% }
.card-featured:hover .overlay { opacity: 0.5; transition: opacity 0.2s }
.card-featured:hover .card-data { top: 45%; opacity: 1; transition: top 0.4s, opacity 0.6s }
.card-featured:hover .card-screenshots { top: 0; opacity: 1; transition: top 0.4s, opacity 0.6s }
.card-screenshots { opacity: 0; position: absolute; top: 100%; transition: top 0.4s, opacity 0.4s }
```

### [Neumorphic button (hover & active effect)](https://codepen.io/Noeh-l/pen/OJwVRym)

made with: transition · :hover

```css
body { padding-top: 3em }
.button { position: relative; transition: all ease-in-out 0.2s; margin-bottom: 70px }
.button::before { position: absolute; top: 0; bottom: 0; box-shadow: rgb(150, 150, 150) 9.91px 9.91px 15px, rgb(220, 220, 220) -5px -5px 15px }
.button::after { position: absolute; top: 0; bottom: 0; box-shadow: rgb(217, 218, 222) 9.91px 9.91px 15px inset, rgb(255, 255, 255) -9.91px -9.91px 15px inset; opacity: 0; transition: all ease 0.2s }
.button:hover::after { opacity: 1 }
.button:active::after { box-shadow: rgb(217, 218, 222) 25px 25px 15px inset, rgb(255, 255, 255) -20px -20px 15px inset }
.btn-2 { position: relative; transition: all ease-in-out 0.2s; margin-bottom: 100px }
.btn-2::before { position: absolute; top: 0; bottom: 0; box-shadow: rgb(150, 150, 150) 9.91px 9.91px 15px, rgb(220, 220, 220) -5px -5px 15px }
.btn-2::after { position: absolute; top: 0; bottom: 0; box-shadow: rgb(217, 218, 222) 9.91px 9.91px 15px inset, rgb(255, 255, 255) -9.91px -9.91px 15px inset; opacity: 0; transition: all ease 0.2s }
.btn-2:hover::after { opacity: 1 }
.btn-2:active::after { box-shadow: rgb(217, 218, 222) 25px 25px 15px inset, rgb(255, 255, 255) -20px -20px 15px inset }
```

### [Expanding Product Card](https://codepen.io/ch-andrew/pen/jOKGrGp)

on hover of div.card: div.card: transform+top, div.card-cover: opacity+top, div.card-body: opacity | made with: transition · :hover

```css
.card { position: relative; transition: transform 1s }
.card:hover { transform: scale(1.05,1.05) }
.card-cover { position: absolute; opacity: 0; transition: opacity 1s }
.card:hover .card-cover { opacity: 1 }
.card-body { position: absolute; bottom: 0; opacity: 0; transition: opacity 1s }
.card:hover .card-body { opacity: 1 }
```

### [First pen](https://codepen.io/melbinjacob/pen/MWXmGep)

made with: @keyframes · :hover

```css
h1:hover { animation: shadow 4s linear infinite }
@keyframes shadow animates text-shadow, font-size
```

### [Button Hover and Press Effect (Pushed inside) CSS-only](https://codepen.io/Juxtopposed/pen/QWxKgRa)

made with: transition · :hover · (hover: hover) gate · clip-path

```css
.button { filter: drop-shadow(0 10px 0 #15111a); transition: all 0.1s ease }
.hover:hover,.hover__press:hover { filter: drop-shadow(0 0 0 #15111a); transform: translate(0, 10px); clip-path: inset(0% 0 0% 0 round 10px) }
.press:active { filter: drop-shadow(0 0 0 #15111a); transform: translate(0, 10px) }
.hover__press:active { filter: drop-shadow(0 -10px 0 #1b1621); transform: translate(0, 20px); clip-path: inset(-20% 0 13% 0 round 10px) }
```

### [Card Hover Effect Tilt.js + Background mouse follow effect](https://codepen.io/Juxtopposed/pen/gOKwwgx)

on hover of div.card: div.card: transform+filter+color, h1.: color, p.: color | made with: @keyframes · transition · :hover · 3D (perspective / preserve-3d) · pointer / mouse tracking · requestAnimationFrame

```css
.bg__gradient { filter: blur(500px); animation: gradient 10s infinite ease-out; position: absolute; transform: translateX(-50%) translateY(-50%) }
0% { background-position:0% 50% }
100% { background-position:100% 100% }
.card { transition: all ease }
.card:hover { filter: drop-shadow(0 0 0px rgb(255, 255, 255, 60%)) }
@keyframes gradient animates background-position
```

```js
requestAnimationFrame(animate)
addEventListener('mousemove', (event) => {
```

### [Card Hover Effect](https://codepen.io/emreerdendev/pen/abKZLqq)

made with: transition · :hover

```css
.container .card { position: relative }
.container .card::before, .container .card::after { position: absolute; transform: translateX(-50%); transition: all 0.35s ease-in-out }
.container .card::before { top: -10px }
.container .card::after { top: -20px }
.container .card:hover::before { top: -5px }
.container .card:hover::after { top: -10px }
```

### [navbar](https://codepen.io/iamtonmoy0/pen/OJZxZrO)

on scroll: a.: color+top | made with: @keyframes · transition · :hover

```css
a { position: relative; text-transform: uppercase; transition: 0.5s }
a:before { position: absolute; top: 50%; transform: translateY(-50%); transition: 0.5s }
a:hover:before { animation: line 0.5s linear forwards }
@keyframes line animates left, height, z-index
```

### [Challenge: The Gnarly Grid (cpc-gnarly-grid)](https://codepen.io/darika-dev/pen/jOxmMqJ)

on hover of img.article__cover: img.article__cover: transform+top, h2.article__title: transform+opacity, p.article__info: transform+opacity | made with: transition · :hover

```css
.article { position: relative }
.article:hover:before { opacity: 1 }
.article:hover .article__cover { transform: translateX(-2rem) scale(1.05) }
.article:hover .article__title, .article:hover .article__info { opacity: 1; transform: translateX(0) }
.article:before { opacity: 0; position: absolute; top: 0; bottom: 0; box-shadow: 0 0 10px 4px rgba(0, 0, 0, 0.47); transition: opacity 0.3s ease-in-out }
.article__figure { position: relative; padding-bottom: 100% }
.article__figure { padding-bottom: 50% }
.article__figure { padding-bottom: 66.6% }
.article__figure { padding-bottom: 50% }
.article__cover { position: absolute; top: 0; bottom: 0; transform: translateX(0); transition: transform 0.55s ease-in-out }
.article__caption { position: absolute; top: 0; bottom: 0 }
.article__title, .article__info { opacity: 0; transform: translateX(50%); transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out }
```

### [Hover underline effect](https://codepen.io/siamparvez/pen/GRdZgzM)

made with: transition · :hover

```css
.hover-underline-animation { position: relative }
.hover-underline-animation:after { position: absolute; transform: scaleX(0); bottom: 0; transition: transform 0.25s ease-out }
.hover-underline-animation:hover:after { transform: scaleX(1) }
```

### [Cat in Box | CSS](https://codepen.io/virtualwiz/pen/JjLwoap)

on scroll: div.eye: transform+top ×2 | made with: @keyframes · transition · :hover

```css
.container { position: absolute; top: 0; bottom: 0 }
.box { position: relative; top: 300px; background-position: -5px -12px }
.b1,.b2 { position: relative }
.b1 { transform: rotate(-20deg) }
.b2 { bottom: 8px; transform: rotate(20deg) }
.cat { position: relative; bottom: 40px; transition: 1s }
.lower { position: relative; top: 60px }
.left-ear, .right-ear { border-bottom: 35px solid white; position: relative }
.left-ear { bottom: 55px; transform: rotate(-35deg) }
.right-ear { bottom: 90px; transform: rotate(35deg) }
.left-eye, .right-eye { position: relative }
.left-eye { bottom: 65px }
```

### [Typing Hover Effect](https://codepen.io/moohka/pen/poLRVYX)

made with: @keyframes · :hover

```css
.main { position: relative }
.main .text { position: relative }
.main .text::before { position: absolute; transform: translateY(-50%); top: 50%; animation: blinking 1.2s infinite step-end }
.main .text .change { position: absolute; top: -2rem }
.main:hover .text::before { animation: hovering 3s steps(3) forwards, blinking 1.2s infinite step-end }
.main:hover .text .change { animation: changing 3s ease forwards }
50% { top: -2rem }
51% { top: 0 }
100% { top: 0 }
.createdby { position: absolute; bottom: 10px }
@keyframes hovering animates left
@keyframes changing animates top
```

### [Hover Effect](https://codepen.io/nazaneyn/pen/dymGZpz)

on scroll: a.: background+color+shadow | made with: @keyframes · transition · :hover · clip-path · backdrop-filter

```css
.container { position: relative }
a { position: relative; transition: 0.5s; backdrop-filter: blur(4px) saturate(180%); -webkit-backdrop-filter: blur(4px) saturate(180%); box-shadow: -4px -2px 12px var(--pink2), 4px 2px 12px var(--green); transform: scale(1); }
a:active { transform: scale(0.98); box-shadow: -4px -2px 0 var(--transparen), 4px 2px 0 var(--transparen) }
a:hover { backdrop-filter: blur(0) saturate(100%); -webkit-backdrop-filter: blur(0) saturate(100%); transition: 0.5s; box-shadow: 0 0 0 var(--transparen), 0 0 0 var(--transparen) }
a::before, a::after { position: absolute }
a:hover::before, a:hover::after { transition: 0.5s }
a::before { top: 0; border-top: solid var(--transparen) 5px }
a:hover::before { clip-path: polygon(100% 0, 0 100%, 0 0); border-top: solid var(--pink2) 8px }
a:active::before { border-top: solid var(--green) 8px }
a::after { bottom: 0; border-bottom: solid var(--transparen) 8px }
a:hover::after { clip-path: polygon(100% 0, 0 100%, 100% 100%); border-bottom: solid var(--green) 8px }
0% { opacity: 0; transform: rotate(360deg) scale(0.2) }
```

### [Running button text effect](https://codepen.io/reikasan/pen/mdXoYER)

on scroll: p.: transform ×2 | made with: @keyframes · transition · :hover

```css
div.button { position: relative; text-transform: uppercase }
div.move { position: absolute; top: 0; transition: transform .3s }
div.button:hover div.move { transform: scaleY(0) }
div.move > p { animation : slide-text1 1.5s linear infinite }
div.move > p:nth-of-type(2) { position: absolute; top: 0 }
0% { transform: translateX(0px) }
100% { transform: translateX(200px) }
@keyframes slide-text1 animates transform
```

### [Technical Documentation FCC](https://codepen.io/m_d_84/pen/yLvXVXP)

held: fixed nav | made with: position: fixed · :hover

```css
h5 { margin-bottom: 50px }
address { margin-bottom: 16px }
nav { position: fixed; top: 0 }
header { margin-top: 25px }
#main-doc { position: absolute; margin-bottom: 80px }
nav { position: absolute; top: 0 }
#main-doc { position: relative; margin-top: 280px }
h5 { margin-bottom: 0px }
header { margin-top: 15px }
#main-doc { position: absolute }
```

### [Hover effect](https://codepen.io/nazaneyn/pen/NWyRvdw)

on hover of a.: span.: transform+opacity+top ×4, a.: color | made with: @keyframes · transition · :hover

```css
div { position: relative }
a { transition: color 1.5s }
a:hover { transition: 1.1s }
span { position: absolute; top: -0; transition: 1s }
span:nth-child(2) { transform-origin: bottom; transform: translateY(60px) }
span:nth-child(3) { transform-origin: top; transform: translateY(-80px) }
span:nth-child(4) { transform-origin: bottom; transform: translateY(60px) }
span:nth-child(5) { transform-origin: top; transform: translateY(-80px) }
div:hover span:nth-child(2), div:hover span:nth-child(4) { transform: translateY(-15px); animation: opacity 1s }
div:hover span:nth-child(3), div:hover span:nth-child(5) { transform: translateY(-8px); animation: opacity 1s }
from { opacity: 0 }
to { opacity: 100% }
```

### [Cyberpunk(ish) Button](https://codepen.io/nazaneyn/pen/LYQZMvx)

on scroll: a.: background+color | made with: @keyframes · transition · :hover

```css
p { margin-top: 20px }
div a { position: absolute; transition: 0.5s }
div a:active { transform: scale(1.02) }
div a::before { position: absolute; top: 0; border-top: rgba(255, 0, 0, 0) solid 4px; transition: 1s }
div a::after { position: absolute; bottom: 0; border-bottom: rgba(255, 0, 0, 0) solid 4px; transition: 0.8s }
div a:hover { transition: 1s; animation: blink 0.5s }
div a:hover::before { border-top: #f7003a solid 4px; transition: 1s; animation: blink 0.8s }
div a:hover::after { border-bottom: #04d3ee solid 4px; transition: 1s; animation: blink 0.8s }
10% { opacity: 0 }
15% { opacity: 100% }
20% { opacity: 0 }
25% { opacity: 100% }
```

### [Glass Effect + hover animation](https://codepen.io/itsdekusenpai/pen/WNMrxxd)

on hover of img.: div.glass: shadow | made with: transition · :hover · backdrop-filter

```css
img { position:absolute; top:50%; transform:translate(-50%,-50%) }
.glass { box-shadow: -1px 1px 20px 5px rgba(0,0,0,0.63); -webkit-box-shadow: -1px 1px 20px 5px rgba(0,0,0,0.63); -moz-box-shadow: -1px 1px 20px 5px rgba(0,0,0,0.63); position:absolute; top:50%; transform:translate(-50%,-50%); bac }
.glass:hover { backdrop-filter: blur(7px); box-shadow: 1px 1px 35px 8px rgba(61,61,61,0.87); -webkit-box-shadow: 1px 1px 35px 8px rgba(61,61,61,0.87); -moz-box-shadow: 1px 1px 35px 8px rgba(61,61,61,0.87) }
p { position:absolute; top:40%; transform:translate(-50%,-40%); transition:0.7s }
```

### [Glowing Button](https://codepen.io/nazaneyn/pen/dydYQgN)

on hover of a.: a.: filter+background+color+shadow | made with: transition · :hover

```css
a { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: background .5s, color .5s }
a:hover { box-shadow: 0 0 40px #64ed85; transition: background .5s, color .5s; filter: hue-rotate(20deg) }
a:active { box-shadow: 0 0 20px #64ed85; filter: hue-rotate(40deg) }
a::after { border-top: 3.5px solid #64ed85; position: absolute; top: 0 }
a::before { border-bottom: 3.5px solid #64ed85; position: absolute; bottom: 0 }
```

### [CSS Hover effect](https://codepen.io/sacsam005/pen/VwQZjgN)

on hover of section.card_section: div.card_body: transform+top | made with: transition · :hover

```css
.card_body { box-shadow: -1px 12px 16px -9px #555 }
.translateY:hover { transform: translateY(-15px); transition: 0.6s }
.scale:hover { transform: scale(1.01); transition: 0.6s }
```

### [Variable Fonts Hover Effect](https://codepen.io/DuskoStamenic/pen/QWaoBPY)

made with: transition · :hover

```css
h1 { text-transform: uppercase; transition: 700ms ease; margin-bottom: 0.8rem }
```

### [Flip Image Over Hover](https://codepen.io/sacsam005/pen/MWrLBaL)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.container div { position: relative }
.container div:before { position: absolute; top: 0; transform-origin: top; transform: perspective(1000px) rotateX(0deg) translateY(0); transition: 0.5s linear }
.container div.flip:before { transform: perspective(1000px) rotateX(90deg) translateY(-50%) }
.container div:after { position: absolute; top: 0; transform-origin: bottom; transform: perspective(1000px) rotateX(-90deg) translateY(50%); transition: 0.5s linear }
.container div.flip:after { transform: perspective(1000px) rotateX(0deg) translateY(0) }
```

### [Card Hover Interactions](https://codepen.io/sacsam005/pen/wvpNXqg)

on hover of img.: div.imgBx: clip-path, h2.: transform+opacity+top, p.: transform+opacity | made with: transition · :hover · clip-path

```css
.container { position: relative }
.container .box { position: relative; box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px }
.container .box .imgBx { position: absolute; top: 0; clip-path: circle(400px at center 100px); transition: 0.5s }
.container .box:hover .imgBx { clip-path: circle(80px at center 100px) }
.container .box .imgBx img { position: absolute; top: 0 }
.container .box .content { position: absolute; bottom: 0 }
.container .box .content h2, .container .box .content p, .container .box .conten { opacity: 0; transition: 0.5s; transform: translateY(20px) }
.container .box:hover .content h2 { opacity: 1; transform: translateY(0) }
.container .box:hover .content p { opacity: 1; transform: translateY(0) }
.container .box:hover .content a { opacity: 1; transform: translateY(0) }
```

### [Card section w/hover flip effect](https://codepen.io/sacsam005/pen/YzYrWZJ)

made with: transition · :hover

```css
.flip { position: relative }
.front, .back { position: relative }
.front h1, .back h1 { position: absolute; top: 30% }
.flip > .front, .flip > .back { transition: 1s ease; transition-property: transform, opacity }
.flip > .front { transform: rotateY(0deg) }
.flip > .back { position: absolute; opacity: 0; top: 0px; transform: rotateY(-180deg) }
.flip:hover > .front { transform: rotateY(180deg) }
.flip:hover > .back { opacity: 1; transform: rotateY(0deg) }
.flip.flip-vertical > .back { transform: rotateX(-180deg) }
.flip.flip-vertical:hover > .front { transform: rotateX(180deg) }
.flip.flip-vertical:hover > .back { transform: rotateX(0deg) }
.flip > .front, .flip > .back { background-position: center !important }
```

### [Image Hover Effect](https://codepen.io/sanketbodke/pen/qBprKaY)

on scroll: div.box: transform+top | on hover of img.: div.box: transform+top ×2 | made with: transition · :hover

```css
.box { transition: 0.4s }
.box:hover { transform: scale(1.3) }
```

### [Hover Shine Effect](https://codepen.io/andreivictor/pen/oNGXzwE)

made with: @keyframes · :hover

```css
.shine-overlay { position: relative }
.shine { position: absolute; top: 0; opacity: 0; transform: skew(30deg); animation: shine 0.75s linear 1 }
0% { opacity: 0 }
50% { opacity: 0.5 }
100% { opacity: 0 }
.card { box-shadow: rgba(0, 0, 0, 0.66) 0 30px 60px 0 }
.card:before { padding-top: 133% }
.card:after { position: absolute; top: 5px; bottom: 5px }
.card-bg { opacity: 0.8; position: absolute; top: -20px; bottom: -20px; background-position: center }
.card-bg--alt { opacity: 1 }
@keyframes shine animates left, opacity
```

### [Glitch button](https://codepen.io/nazaneyn/pen/zYExbrg)

made with: @keyframes · :hover

```css
.box { position: absolute; top: 50%; transform: translate(-50%, -50%) }
a { position: relative }
a:hover { animation: skew .4s }
a::after { position: absolute; bottom: 0 }
a::before { position: absolute; top: 0 }
a:hover::after { animation: pink .4s 2 }
a:hover::before { animation: blue .4s 2 }
0% { transform: translate(0) }
20% { transform: translate(-.6rem, .6rem) }
40% { transform: translate(-.6rem, -.6rem) }
60% { transform: translate(.6rem, -.6rem) }
80% { transform: translate(.6rem, -.6rem) }
```

### [Moving Border Gradient On Hover](https://codepen.io/nazaneyn/pen/QWMXOBd)

made with: @keyframes · :hover

```css
a { position: relative; position: relative }
a::after { position: absolute; top: -.68rem }
a:hover::after { animation: border 1s infinite }
@keyframes border animates background
```

### [Pure CSS button hover animation](https://codepen.io/afa34/pen/VwzxmNN)

held: fixed div.container | on hover of a.click-btn: a.click-btn: transform+color+top | made with: position: fixed · @keyframes · transition · :hover

```css
.container { position: fixed; top: 0 }
h1 { position: relative }
h1::before { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.click-btn { transition: all 0.35s }
.btn-style1 { position: relative }
.btn-style1:hover { transform: translateY(-0.25em) }
.btn-style1:hover::before { opacity: 1 }
.btn-style1::before { position: absolute; bottom: -1.35em; opacity: 0; transition: all 0.65s }
.btn-style2:hover { box-shadow: 0 0.25em 0.25em -0.1em #b5c952; transform: translateY(-0.25em) }
.btn-style3:hover { transform: translateY(-0.25em); box-shadow: 0 0 0.5em 0em #5e5e5e }
.btn-style4:hover { box-shadow: inset 0 0 0.55em 0em #dd648a }
.btn-style5 { box-shadow: 0.3em 0.3em 0 #dd6395 }
```

### [BEAUTIFUL Card Hover Effect](https://codepen.io/01kingmaker01/pen/MWvvoWK)

on hover of div.card: div.card: color, h1.: color, p.: color | made with: transition · :hover

```css
.card { position: relative; transition: all 0.4s }
.card::before, .card::after { position: absolute; top: 0; transition: all 0.4s }
.card::after { transform-origin: right bottom; transform: translate(10%, 10%) scale(0.3) }
.card:hover::after, .card:active::after { transform: translate(0) scale(1); box-shadow: rgba(240, 46, 170, 0.4) 5px 5px, rgba(240, 46, 170, 0.3) 10px 10px, rgba(240, 46, 170, 0.2) 15px 15px, rgba(240, 46, 170, 0.1) 20px 20px, rgba(240, 46, 170, 0.05) 25px 25px }
.card:hover::before, .card:active::before { transform-origin: right bottom; transform: translate(10%, 10%) scale(0.3) }
```

### [Card Hover Interaction](https://codepen.io/atul-rustagi/pen/porgwQR)

on hover of div.card: div.card: transform+top | made with: transition · :hover

```css
.container .card { box-shadow: 0 4px 8px #0005, 0 8px 8px #0004; transition: transform 300ms ease }
.container .card:hover, .container .card:focus-within { transform: scale(1.05) }
.container .card .card-info a { transition: background-color 300ms ease, color 300ms ease }
```

### [CSS Hover Effect](https://codepen.io/anmolbhatt0/pen/xxrzXPb)

made with: transition · :hover

```css
h1::before { transform: scaleX(0) }
h1:hover::before { transform: scaleX(1) }
h1::before { position: absolute; top: 0; bottom: 0; inset: 0 0 0 0; transition: transform .3s ease }
h1 { position: relative }
```

### [Clip Path Animation](https://codepen.io/jashpatel7/pen/dyROgJJ)

made with: transition · :hover · clip-path

```css
.box-parent { position: relative }
.box-parent:hover .box { clip-path: inset(0px round 10px 10px) }
.box { position: absolute; clip-path: inset(30px 0px 0px 30px round 10px 10px); transition: all 0.30s 0.1s ease-in }
.box-round { position: absolute; inset: 20px 0 0 20px }
```

### [Untitled](https://codepen.io/cohen-laplain/pen/gORwRdw)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
canvas { position: absolute }
```

```js
requestAnimationFrame(neon)
addEventListener('mousemove', function(e) {
```

### [Mouse bind hover effect](https://codepen.io/hessamkhoobkar/pen/PomVbWm)

made with: transition · :hover · custom properties driven by JS

```css
.card { position: relative; margin-bottom: 1rem }
.info-row { margin-bottom: 2rem }
.tag { transition: all 0.2s ease-out }
.card-border, .card-background { position: relative }
.card-border::before, .card-background::before { position: absolute; top: var(--y); transform: translate(-50%, -50%); transition: width 0.2s ease, height 0.2s ease }
```

```js
style.setProperty("--x", `${x}px`)
style.setProperty("--y", `${y}px`)
```

### [Fluid card-codepen card](https://codepen.io/varoonrao/pen/JjNazqQ)

made with: transition · :hover · clip-path

```css
.card_container .article_card { position: relative }
.card_container .article_card .content { position: relative }
.card_container .article_card .content h3 { margin-bottom: 2.5rem }
.card_container .article_card::after { position: absolute; top: 0px; -webkit-clip-path: inset(2rem 0 0 3rem round 10px); clip-path: inset(2rem 0 0 3rem round 10px); transition: all 0.4s ease }
.card_container .article_card:hover::after { transition: all 0.4s ease; -webkit-clip-path: inset(0 0 0 0 round 10px); clip-path: inset(0 0 0 0 round 10px) }
```

### [Button over image animation](https://codepen.io/Keitumetse66/pen/OJmNoYQ)

made with: transition · :hover

```css
.service-makeup { box-shadow: 0 16px 32px 0 rgba(0,0,0,0.2); position: relative }
img { backgroun-position: center }
button { box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); text-transform: uppercase }
#btn1 { position: absolute; transition: transform 0.5s ease-in-out }
.service-hair { box-shadow: 0 16px 32px 0 rgba(0,0,0,0.2); position: relative }
#btn2 { position: absolute; transition: transform 0.5s ease-in-out }
#btn1:hover { transform: translateY(-100%) }
#btn2:hover { transform: translateY(-100%) }
```

### [our services section with hover effect](https://codepen.io/Priyamaheshwari/pen/GRmoGMw)

on scroll: div.our-services: shadow+top | on hover of img.: div.our-services: shadow ×2, h4.: color ×2, p.: color ×2 | made with: transition · :hover

```css
.box { position: relative }
.our-services { margin-top: 75px; padding-bottom: 30px; transition: all .4s ease-in-out; box-shadow: 0 0 25px 0 rgba(20, 27, 202, .17) }
.our-services .icon { margin-bottom: -21px; transform: translateY(-50%) }
.speedup:hover { box-shadow: 0 0 25px 0 rgba(20, 27, 201, .05) }
.settings:hover { box-shadow: 0 0 25px 0 rgba(20, 27, 201, .05) }
.privacy:hover { box-shadow: 0 0 25px 0 rgba(20, 27, 201, .05) }
.backups:hover { box-shadow: 0 0 25px 0 rgba(20, 27, 201, .05) }
.ssl:hover { box-shadow: 0 0 25px 0 rgba(20, 27, 201, .05) }
.database:hover { box-shadow: 0 0 25px 0 rgba(20, 27, 201, .05) }
```

### [CSS Profile Card Hover](https://codepen.io/cjr85/pen/WNjNryx)

on hover of div.cards: div.imgBx: transform+top, div.content: transform+top | made with: transition · :hover

```css
.container { position: relative }
.container .cards { position: relative }
.container .cards .imgBx { position: absolute; top: 0; transition: 0.5s; transform-origin: top }
.container .cards:hover .imgBx { transform: translateY(30px) scale(0.5) }
.container .cards .imgBx img { position: absolute; top: 0 }
.container .cards .content { position: absolute; top: 0; padding-bottom: 30px; transform: translateY(100%); transition: 0.5s }
.container .cards:hover .content { transform: translateY(0) }
.social_icons { position: relative; margin-top: 5px }
.social_icons li a { transition: 0.5s }
.social_icons li a:hover { transform: rotate(360deg) }
```

### [Social Icons Hover Effect](https://codepen.io/cjr85/pen/PopLVOv)

on hover of a.: a.: color, i.fab: color | made with: transition · :hover

```css
.icons a { box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1); background-position: 0% 5%; transition: background-position 0.5s, color 0.5s }
.icons a:hover { background-position: 0% 100% }
```

### [Simple CSS Image Hover Effects | Split Image On Hover](https://codepen.io/bousahla-mounir/pen/jOBzexq)

on scroll: span.: transform+top ×4, div.center: transform+top | made with: transition · :hover

```css
.container { position: relative }
.container .box { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container .box::before { position: absolute; top: 0 }
.container .box span { position: absolute; top: 0; transition: 1s }
.container .box:hover span { transform: translateY(-100%) }
.container .box span:nth-of-type(1) { background-position: 0 0 }
.container .box span:nth-of-type(2) { background-position: -150px 0 }
.container .box span:nth-of-type(3) { background-position: -300px 0 }
.container .box span:nth-of-type(4) { background-position: -450px 0 }
.container .box .center { position: absolute; top: 0; transform: translateY(100%); transition: 1s }
.container .box:hover .center { transform: translateY(0) }
.container .box .center h1 { margin-bottom: 20px }
```

### [Icon Hover Effect](https://codepen.io/cjr85/pen/KKWqQdG)

on hover of a.: a.: transform+top, i.fab: color+top | made with: transition · :hover

```css
h1 { margin-bottom: 100px; margin-top: -100px }
.social-links a { box-shadow: 0 0 20px 10px rgba(0, 0, 0, 0.05); position: relative; transition: transform 0.5s }
.social-links a .fab { position: relative; transition: color 0.5s }
.social-links a::after { top: -90px; position: absolute; transition: 0.5s }
.social-links a:hover::after { top: 0 }
.social-links a:hover { transform: translateY(-10px) }
```

### [CSS Quote Box Hover Effects](https://codepen.io/bousahla-mounir/pen/eYvvLLw)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.box { position: absolute; top: 50%; transform: perspective(2000px) translate(-50%,-50%); transition: .5s }
.box:hover { transform: perspective(2000px) translate(-50%,-50%) rotateY(20deg) }
.box h1 { margin-bottom: 20px }
.box span { position: absolute; top: 50%; transform: translate(-50%,-50%) rotateY(-20deg); transition: .5s }
.box:hover span { transform: translate(-50%,-50%) rotateY(-50deg) }
.box::before,.box span::before { position: absolute }
.box::before { top: 0 }
.box span::before { bottom: 0 }
```

### [Responsive CSS Create Image Hover Overlay Effects](https://codepen.io/bousahla-mounir/pen/NWpdgWR)

on hover of img.: img.: transform+top, div.content: background, h1.: transform+opacity+top, p.: transform+opacity+top | made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(0,-50%) }
.container .box { position: relative }
.container .box img { position: relative; transition: 5s }
.container .box:hover img { transform: scale(2) }
.container .box::before,.container .box::after { position: absolute; top: 10px; bottom: 10px; transition: 2s }
.container .box::before { transform: scale(1,0) }
.container .box::after { transform: scale(0,1); border-top: 2px solid #fff; border-bottom: 2px solid #fff }
.container .box:hover::before,.container .box:hover::after { transform: scale(1,1) }
.container .box .content { position: absolute; top: 0; transition: 1s }
.container .box .content .wrap h1 { position: relative; margin-bottom: 10px; transform: translateY(-80px); opacity: 0; transition: 1s }
.container .box:hover .content .wrap h1 { transform: translateY(0); opacity: 1 }
.container .box .content .wrap p { position: relative; transform: translateY(170px); opacity: 0; transition: .5s }
```

### [CSS Create Image Hover Overlay Effects](https://codepen.io/bousahla-mounir/pen/MWpJmQJ)

on hover of img.: img.: transform+top, div.content: background, h1.: transform+opacity+top, p.: transform+opacity+top | made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(0,-50%) }
.container .box { position: relative }
.container .box img { position: relative; transition: 5s }
.container .box:hover img { transform: scale(2) }
.container .box::before,.container .box::after { position: absolute; top: 10px; bottom: 10px; transition: 1s }
.container .box::before { transform: scale(1,0) }
.container .box::after { transform: scale(0,1); border-top: 1px solid #fff; border-bottom: 1px solid #fff }
.container .box:hover::before,.container .box:hover::after { transform: scale(1,1) }
.container .box .content { position: absolute; top: 0; transition: 1s }
.container .box .content .wrap h1 { position: relative; margin-bottom: 10px; transform: translateY(-80px); opacity: 0; transition: 1s }
.container .box:hover .content .wrap h1 { transform: translateY(0); opacity: 1 }
.container .box .content .wrap p { position: relative; transform: translateY(170px); opacity: 0; transition: .5s }
```

### [Pure CSS Multilayer Div Hover Effects](https://codepen.io/bousahla-mounir/pen/BaWpLbv)

made with: transition · :hover

```css
.box { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.box p { position: relative }
.box p::before,.box span::before { position: absolute; top: 0; transition: 1s; transform: skewX(-10deg) }
.box span { position: absolute; top: -2px; transition: .5s }
.box:hover span:nth-of-type(1) { top: 15px }
.box:hover span:nth-of-type(2) { top: 30px }
```

### [HTML CSS Add Shine Effect On Image](https://codepen.io/bousahla-mounir/pen/abJBaPJ)

made with: transition · :hover

```css
a { position: absolute; top: 50%; transform: translate(-50%,-50%); box-shadow: 0 10px 20px rgba(0,0,0,.5) }
a::before { position: absolute; top: 0; transform: skewX(-50deg); transition: .5s }
```

### [CSS3 Draw Border Animation On Hover](https://codepen.io/bousahla-mounir/pen/poeNVrM)

made with: transition · :hover

```css
.center { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.center .box { position: relative }
.center .box h1 { text-transform: uppercase }
.center .box::before,.center .box::after,.center::before,.center::after { position: absolute; top: 0; transition: 1s }
.center .box::before,.center::before { transform: scaleX(0) }
.center::before { transform: rotate(45deg) scaleX(0) }
.center .box::after,.center::after { transform: scaleY(0) }
.center::after { transform : rotate(45deg) scaleY(0) }
.center:hover .box::before { transform: scaleX(1) }
.center:hover::before { transform: rotate(45deg) scaleX(1) }
.center:hover .box::after { transform: scaleY(1) }
.center:hover::after { transform: rotate(45deg) scaleY(1) }
```

### [Cards UI Design With Cool Hover Effects](https://codepen.io/bousahla-mounir/pen/YzZpaBp)

on scroll: div.box: opacity | made with: transition · :hover

```css
.card-ui { position: absolute; top: 50%; transform: translate(-50%,-50%); box-shadow: 0 0 20px rgb(0 0 0 / 50%) }
.card-ui .box-content { position: relative }
.card-ui::before,.card-ui::after { position: absolute; top: 0; transition: 1s }
.card-ui .box { position: absolute; top: 50%; transform: translate(-50%,-50%); transition: .5s }
.card-ui:hover .box { opacity: 0 }
.card-ui .box img { position: relative }
```

### [CSS HTML Card Hover Effects](https://codepen.io/bousahla-mounir/pen/ZEepqMx)

made with: transition · :hover

```css
.center { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.center .box { position: absolute; box-shadow: 0 0 10px rgb(0 0 0 / 30%); transition: 1s }
.center .box:nth-child(1) { top: 0; transform: rotate(0deg) }
.center:hover .box:nth-child(1) { transform: rotate(-45deg) }
.center .box:nth-child(2) { top: 5px; transform: rotate(0deg) }
.center:hover .box:nth-child(2) { transform: rotate(-30deg) }
.center .box:nth-child(3) { top: 10px; transform: rotate(0deg) }
.center:hover .box:nth-child(3) { transform: rotate(-15deg) }
.center .box:nth-child(4) { top: 15px; transform: rotate(0deg) }
.center:hover .box:nth-child(4) { transform: rotate(0deg) }
.center .box:nth-child(5) { top: 20px; transform: rotate(0deg) }
.center:hover .box:nth-child(5) { transform: rotate(15deg) }
```

### [Pure CSS Gradient Hover Effect](https://codepen.io/bousahla-mounir/pen/GRWjyYz)

made with: transition · :hover

```css
.box { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.box::before,.box::after { position: absolute; transition: 1s }
.box::before { bottom: 0 }
.box::after { top: 0 }
```

### [Card](https://codepen.io/rahulbaran/pen/oNZzeoE)

made with: transition · clip-path · 3D (perspective / preserve-3d) · custom properties driven by JS

```css
body { position:relative }
h1 { border-bottom:2px dashed currentColor }
.card-container { position:absolute; top:50%; transform:translate(-50%,-50%); perspective:1000px }
.card { position:relative; box-shadow:0 0 6px rgba(0,0,0,.4); transition:transform 400ms,box-shadow 400ms }
.card__body { position:absolute; bottom:0; clip-path:polygon(0 var(--top,100%),100% var(--top,100%),100% 100%, 0 100%); transition:clip-path 200ms }
.card__para { clip-path:polygon(0 var(--top,100%),100% var(--top,100%),100% 100%, 0 100%); transition:clip-path 200ms linear 150ms }
```

```js
style.setProperty('--top',top + '%')
```

### [Gradient background button](https://codepen.io/BxCoder/pen/QWpEQdg)

on hover of a.btn: a.btn: shadow | made with: transition · :hover

```css
h1 { margin-top:30px }
.btn { text-transform:uppercase; transition: all .4s ease-in-out }
.btn-1 { box-shadow: 0 4px 15px 0 rgba(45, 54, 65, 0.75) }
.btn-2 { box-shadow: 0 4px 15px 0 rgba(65, 132, 234, 0.75) }
.btn-3 { box-shadow: 0 4px 15px 0 rgba(49, 196, 190, 0.75) }
.btn:hover { box-shadow: 0 0px 0px 0 rgba(49, 196, 190, 0.75) }
```

### [Fold Unfold CSS Hover Effects](https://codepen.io/bousahla-mounir/pen/NWpNZgE)

made with: transition · :hover

```css
.center { position: absolute; top: 50%; transform: translate(-50%,-50%) }
ul { position: absolute; top: 50%; transform: translate(-50%,-50%) }
ul li { position: relative; transition: 1s }
ul li:nth-child(2n+1) { transform-origin: bottom; transform: skewX(-30deg) }
ul li:nth-child(2n) { transform-origin: top; transform: skewX(30deg) }
ul:hover li { transform: skewX(0deg) }
```

### [CSS Blur Everything Expect The Hovered](https://codepen.io/bousahla-mounir/pen/WNprrNw)

made with: transition · :hover

```css
.container { position: relative }
.container .first-content { position: absolute; top: 50%; transform: translate(-50%,-50%); background-position: 50% 50%; transition: .5s }
.container .first-content:hover { box-shadow: 0 0 10px rgba(0,0,0,.5) }
.container .first-content:hover + .second-content { filter: blur(5px) }
.container .second-content { position: absolute; top: 0; transition: .5s }
```

### [Pure CSS BigBang Explosion Hover Effects](https://codepen.io/bousahla-mounir/pen/Popqowr)

made with: @keyframes · :hover

```css
.box { position: absolute; top: 50%; transform: translate(-50%,-50%); box-shadow: 0 0 20px 10px #3bc140 }
.box:hover { animation: animate .7s; box-shadow: 0 0 0 480px rgba(120,156,121,.05), 0 0 0 400px rgba(120,156,121,.1), 0 0 0 320px rgba(120,156,121,.2), 0 0 0 240px rgba(120,156,121,.25), 0 0 0 160px rgba(120,156,121,.3), 0 0 0 80px r }
0% { box-shadow: 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), inset 0 0 20px 20px rgba(120 }
15% { box-shadow: 0 0 0 80px rgba(120,156,121,.42), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), inset 0 0 20px 20px rgba }
30% { box-shadow: 0 0 0 160px rgba(120,156,121,.3), 0 0 0 80px rgba(120,156,121,.42), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), inset 0 0 20px 20px  }
45% { box-shadow: 0 0 0 240px rgba(120,156,121,.27), 0 0 0 160px rgba(120,156,121,.3), 0 0 0 80px rgba(120,156,121,.42), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), inset 0 0 20px  }
60% { box-shadow: 0 0 0 320px rgba(120,156,121,.2), 0 0 0 240px rgba(120,156,121,.25), 0 0 0 160px rgba(120,156,121,.3), 0 0 0 80px rgba(120,156,121,.42), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), inset 0 0 2 }
75% { box-shadow: 0 0 0 400px rgba(120,156,121,.1), 0 0 0 320px rgba(120,156,121,.2), 0 0 0 240px rgba(120,156,121,.25), 0 0 0 160px rgba(120,156,121,.3), 0 0 0 80px rgba(120,156,121,.42), 0 0 0 0 rgba(120,156,121,.5), inset 0 }
100% { box-shadow: 0 0 0 480px rgba(120,156,121,.05), 0 0 0 400px rgba(120,156,121,.1), 0 0 0 320px rgba(120,156,121,.2), 0 0 0 240px rgba(120,156,121,.25), 0 0 0 160px rgba(120,156,121,.3), 0 0 0 80px rgba(120,156,121,.4), ins }
@keyframes animate animates box-shadow
```

### [CSS Strange Hover Effects](https://codepen.io/bousahla-mounir/pen/ZEeGzNB)

made with: @keyframes · :hover

```css
.box { position: absolute; top: 50%; transform: translate(-50%,-50%); box-shadow: 0 0 20px 10px #3bc140 }
.box span { position: relative }
.box span:hover { animation: animate .7s; box-shadow: 0 0 0 480px rgba(120,156,121,.05), 0 0 0 400px rgba(120,156,121,.1), 0 0 0 320px rgba(120,156,121,.2), 0 0 0 240px rgba(120,156,121,.25), 0 0 0 160px rgba(120,156,121,.3), 0 0 0 80px r }
0% { box-shadow: 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), inset 0 0 20px 20px rgba(120 }
15% { box-shadow: 0 0 0 80px rgba(120,156,121,.42), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), inset 0 0 20px 20px rgba }
30% { box-shadow: 0 0 0 160px rgba(120,156,121,.3), 0 0 0 80px rgba(120,156,121,.42), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), inset 0 0 20px 20px  }
45% { box-shadow: 0 0 0 240px rgba(120,156,121,.27), 0 0 0 160px rgba(120,156,121,.3), 0 0 0 80px rgba(120,156,121,.42), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), inset 0 0 20px  }
60% { box-shadow: 0 0 0 320px rgba(120,156,121,.2), 0 0 0 240px rgba(120,156,121,.25), 0 0 0 160px rgba(120,156,121,.3), 0 0 0 80px rgba(120,156,121,.42), 0 0 0 0 rgba(120,156,121,.5), 0 0 0 0 rgba(120,156,121,.5), inset 0 0 2 }
75% { box-shadow: 0 0 0 400px rgba(120,156,121,.1), 0 0 0 320px rgba(120,156,121,.2), 0 0 0 240px rgba(120,156,121,.25), 0 0 0 160px rgba(120,156,121,.3), 0 0 0 80px rgba(120,156,121,.42), 0 0 0 0 rgba(120,156,121,.5), inset 0 }
100% { box-shadow: 0 0 0 480px rgba(120,156,121,.05), 0 0 0 400px rgba(120,156,121,.1), 0 0 0 320px rgba(120,156,121,.2), 0 0 0 240px rgba(120,156,121,.25), 0 0 0 160px rgba(120,156,121,.3), 0 0 0 80px rgba(120,156,121,.4), ins }
@keyframes animate animates box-shadow
```

### [Glowing Dots on Hover](https://codepen.io/bousahla-mounir/pen/XWMJpLo)

on hover of li.: li.: background+color+shadow | made with: transition · :hover

```css
ul { position: absolute; top: 50%; transform: translate(-50%,-50%) }
ul li { transition: .9s }
ul li:hover { box-shadow: 0 0 20px #fff , 0 0 0 15px rgba(255,255,255,.1), 0 0 0 30px rgba(255,255,255,.1) , 0 0 0 45px rgba(255,255,255,.1), 0 0 0 60px rgba(255,255,255,.1) , 0 0 0 75px rgba(255,255,255,.3) }
```

### [CSS Glitch Hover Effects](https://codepen.io/bousahla-mounir/pen/WNpNgWm)

made with: @keyframes · :hover

```css
.container { position: relative }
.container::before { position: absolute; top: 0; animation: animate .6s infinite linear; opacity: .5 }
.container:hover::before { animation: none }
0% { background-position: 0 0 }
10% { background-position: -10px 10px }
20% { background-position: 0 0 }
30% { background-position: 20px -10px }
40% { background-position: -10px 10px }
50% { background-position: 0 0 }
60% { background-position: -20px 0px }
70% { background-position: -5px -5px }
80% { background-position: 25px 5px }
```

### [Creative Button Hover](https://codepen.io/DeveloperZahid/pen/gOmYRww)

made with: transition · :hover

```css
.btn { position: relative }
.btn::before { position: absolute; transform: translateY(-5%) scale(0.4); transition: transform 0.6s, border 0.5s }
.btn::after { --position: 2px; position: absolute; top: var(--position); bottom: var(--position) }
.btn__text { position: relative }
.btn:hover::before, .btn:focus::before { transform: translateY(0) scale(1); transition: transform 0.7s }
```

### [Direction Aware Image Gallery Hover Effects](https://codepen.io/bousahla-mounir/pen/wvgVGqW)

made with: Web Animations API (.animate)

```css
ul { position: absolute; top: 50%; transform: translate(-50%,-50%) }
ul li { position: relative }
ul li .overlay { position: absolute }
ul li .overlay h2 { position: absolute; top: 50%; transform: translateY(-50%); text-transform: uppercase }
```

```js
.animate({top:0,left:0},c.speed)}),this.mouseleave(function(b){const d=a(this),e=d.find(".overlay"),f=d.offset(),g=b.pageX-f.left,
.animate({top:0,left:-d.width()},c.speed),g>=d.width()&&e.animate({top:0,left:d.width()},c.speed),h<=0&&e.animate({left:0,top:-d.h
.animate({left:0,top:d.height()},c.speed)})}}(jQuery)
```

### [CSS Custom Tooltips](https://codepen.io/bousahla-mounir/pen/vYgqQpZ)

on scroll: a.: color, i.fa: color, span.: opacity+top | on hover of li.: a.: color ×2, i.fa: color ×2, span.: opacity+top ×2 | made with: transition · :hover

```css
ul { position: absolute; top: 50%; transform: translate(-50%,-50%) }
ul li { position: relative }
ul li a { position: relative; transition: .5s }
ul li span { position: absolute; top: -80px; transform: translate(-50%,-100%); opacity: 0; transition: .9s }
ul li span::before { position: absolute; bottom: 0; transform: translate(-50%,50%) rotate(45deg) }
ul li:hover span { top: -20px; opacity: 1 }
```

### [CSS Mockups - Flip Cover On Hover](https://codepen.io/bousahla-mounir/pen/OJWeWao)

on scroll: div.box: transform+top, div.img-content: transform+top, img.: transform+top | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.container { position: relative }
.container .box { position: absolute; top: 50%; transform: translate(-50%,-50%) rotate(-40deg) skewX(5deg); transition: 1s }
.container .box:hover { transform: translate(-50%,-50%) rotate(-10deg) skewX(5deg) }
.container .box .img-content { position: relative; transform: perspective(2000px) rotateY(0deg); transition: 1.5s }
.container .box:hover .img-content { transform: perspective(2000px) rotateY(-180deg) }
.container .box .img-content img { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container .box .img-content::before { position: absolute; top: 0; transition: 1s }
.container .box .info-content { position: absolute; top: 0 }
.container .box::before , .container .box::after { position: absolute }
.container .box::before { top: 0; transform: skewY(-45deg) }
.container .box::after { bottom: -30; transform-origin: top; transform: skewX(-45deg) }
```

### [CSS Smooth 3D Hover Effect](https://codepen.io/bousahla-mounir/pen/VwPJYNN)

on scroll: div.box: transform ×2, div.container: transform | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%); transition: 2s }
.container:hover { transform: translate(-50%,-50%) translateX(250px) }
.container .box { transition: 2s }
.container .box:nth-of-type(1) { position: relative; transform: perspective(2000px) rotateY(0deg) }
.container .box:nth-of-type(2) { position: absolute; top: 0; transform: perspective(2000px) rotateY(-90deg) }
.container:hover .box:nth-of-type(1) { transform: perspective(2000px) rotateY(90deg) }
.container:hover .box:nth-of-type(2) { transform: perspective(2000px) rotateY(0deg) }
```

### [CSS Blur Others Expect The Hovered](https://codepen.io/bousahla-mounir/pen/yLgZgRo)

on scroll: div.box: transform+filter+top ×4 | made with: transition · :hover

```css
.boxes { position: absolute; top: 50%; transform: translateY(-50%); transition: .5s }
.boxes .box { position: relative; box-shadow: 0 5px 10px rgba(0,0,0,.5); transition: .5s }
.boxes:hover .box { filter: blur(5px); transform: scale(.8) }
.boxes .box:hover { filter: none; transform: scale(1) }
```

### [CSS3 Ribbons Without Images](https://codepen.io/bousahla-mounir/pen/WNRLLyy)

made with: transition · :hover

```css
.container { position: relative; top: 20vh }
.container h1 { position: relative }
.container h1::before,.container h1::after { position: absolute; top: 0; transition: .5s }
.container h1::before { transform: skewY(40deg) }
.container:hover h1::before { transform: skewY(-40deg) }
.container h1::after { transform: skewY(40deg) }
.container:hover h1::after { transform: skewY(-40deg) }
```

### [CSS Slide Text Over Image Hover Effects](https://codepen.io/bousahla-mounir/pen/KKabBqW)

made with: transition · :hover

```css
.boxes { position: relative; top: 20vh }
.boxes .box { position: relative; box-shadow: 0 10px 10px rgb(0,0,0,.5); transform: translateY(0); transition: .9s }
.boxes .box:hover { box-shadow: 0 30px 20px rgb(0,0,0,.5); transform: translateY(-50px) }
.boxes .box img { position: relative; top: 0; transform: scale(1); transition: 5s }
.boxes .box:hover img { transform: scale(2) }
.boxes .box::before { position: absolute; bottom: -100%; transition: .9s }
.boxes .box:hover::before { bottom: 0 }
.boxes .box .content { position: absolute; bottom: -100%; transition: .9s }
.boxes .box:hover .content { bottom: 0 }
.boxes .box .content a { position: relative; margin-top: 10px }
```

### [CSS Image Hover Effects](https://codepen.io/bousahla-mounir/pen/PoWXEdE)

on scroll: img.: transform+top, div.content: transform+opacity+top | on hover of img.: img.: transform+top ×2, div.content: transform+opacity+top ×2 | made with: transition · :hover

```css
.container { position: relative }
.container::before { position: absolute; top: 0 }
.container .boxes { position: absolute; top: 50%; transform: translateY(-50%) }
.container .boxes .box { position: relative }
.container .boxes .box img { position: relative; transform: scale(1.2); transition: .9s }
.container .boxes .box:hover img { transform: scale(1) }
.container .boxes .box .content { position: absolute; top: 0; transform: scale(3); opacity: 0; transition: .9s }
.container .boxes .box:hover .content { transform: scale(1); opacity: 1 }
.container .boxes .box .content h1 { margin-bottom: 10px }
```

### [CSS 3D Flip Hover Effects Version 2](https://codepen.io/bousahla-mounir/pen/VwPqerm)

on scroll: img.: transform+top ×2, div.container: transform+top, div.img-content: transform+top | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.container { position: absolute; top: 45%; transform: translate(-50%,-50%) rotate(0deg); transition: .9s }
.container:hover { transform: translate(-50%,-50%) rotate(-10deg) }
.container .img-content { position: relative; transform: perspective(1500px) rotateY(0deg); transition: .9s }
.container .img-content img { position: absolute; top: 0; transition: .5s }
.container .img-content img:nth-of-type(1) { transform: rotateY(0deg) }
.container .img-content img:nth-of-type(2) { transform: rotateY(180deg) }
.container:hover .img-content img:nth-of-type(1) { transform: rotateY(-180deg) }
.container:hover .img-content img:nth-of-type(2) { transform: rotateY(0deg) }
.container:hover .img-content { transform: perspective(1500px) rotateY(-150deg) }
.container .content { position: absolute; top: 0 }
.container .content p { margin-top: 10px }
```

### [CSS 3D Flip Hover Effects Version 1](https://codepen.io/bousahla-mounir/pen/oNBJbbX)

on scroll: div.container: transform+top, img.: transform+top | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.container { position: absolute; top: 45%; transform: translate(-50%,-50%) rotate(0deg); transition: .9s }
.container:hover { transform: translate(-50%,-50%) rotate(-10deg) }
.container img { position: relative; transform: perspective(1500px) rotateY(0deg); transition: .9s }
.container:hover img { transform: perspective(1500px) rotateY(-150deg) }
.container .content { position: absolute; top: 0 }
.container .content p { margin-top: 10px }
```

### [CSS Image Hover Effects Version 2](https://codepen.io/bousahla-mounir/pen/wvgQOOe)

made with: transition · :hover

```css
.container { position: relative }
.container .boxes { position: relative; top: 15vh }
.container .boxes .row .box { position: relative }
.container .boxes .row .box img { position: relative; transition: 1.5s }
.container .boxes .row .box:hover img { transform: scale(1.5) }
.container .boxes .row .box .content { position: absolute; top: 5%; transform: rotateX(90deg); transition: .9s }
.container .boxes .row .box:hover .content { transform: rotateX(0deg) }
.container .boxes .row .box .content h1 { margin-bottom: 10px }
```

### [CSS Image Hover Effects Version 1](https://codepen.io/bousahla-mounir/pen/MWJzxZX)

made with: transition · :hover

```css
.container { position: relative }
.container .boxes { position: relative; top: 15vh }
.container .boxes .row .box { position: relative }
.container .boxes .row .box img { position: relative; transition: 1.5s }
.container .boxes .row .box:hover img { transform: scale(1.5) }
.container .boxes .row .box .content { position: absolute; top: 5%; transform: rotateX(90deg); transition: .9s }
.container .boxes .row .box:hover .content { transform: rotateX(0deg) }
.container .boxes .row .box .content h1 { margin-bottom: 10px }
```

### [CSS Black and White Text Hover Effects](https://codepen.io/bousahla-mounir/pen/dyNQRvB)

made with: transition · :hover · mix-blend-mode

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container h1 { margin-bottom: 15px }
.container::before { position: absolute; top: 0; mix-blend-mode: difference; transition: 2s }
```

### [CSS Image Overlay Hover Effects](https://codepen.io/bousahla-mounir/pen/mdRQWKX)

on hover of img.: div.box-content: transform+top | made with: transition · :hover

```css
.container { position: relative }
.container::before { position: absolute; top: 0 }
.container .boxes { position: absolute; top: 50%; transform: translateY(-50%) }
.container .boxes .box { position: relative }
.container .boxes .box img { position: relative }
.container .boxes .box::before,.container .boxes .box::after { position: absolute; top: 0; transition: .5s }
.container .boxes .box .box-content { position: absolute; top: 10%; bottom: 10%; transform: translateY(120%); transition: .9s }
.container .boxes .box:hover .box-content { transform: translateY(0) }
.container .boxes .box .box-content h1 { margin-bottom: 7px }
.container .boxes .box .box-content p { margin-bottom: 15px }
```

### [CSS Creative DIV Shape with Cool Hover Effects](https://codepen.io/bousahla-mounir/pen/xxgQVgP)

made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container .box { position: absolute; top: 0; box-shadow: -5px 5px 10px rgba(0,0,0,.5) }
.container .box h1 { margin-bottom: 10px }
.container .box p { margin-bottom: 15px }
.container .box a { position: relative }
.container::before,.container::after { position: absolute }
.container::before { top: 0; transform: scale(1.08); transition: .9s }
.container::after { top: -12px; transform: scale(1.08) skewX(-30deg) }
.container:hover::before { transform: scale(1.6,.8) }
```

### [HTML CSS List Item Hover Effects Version 4](https://codepen.io/bousahla-mounir/pen/BapOJyO)

made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%); box-shadow: 0 0 30px #000 }
.container ul { margin-top: 10px }
.container ul li { position: relative; border-bottom: 2px solid rgba(255,255,255,.1) }
.container ul li::before { position: absolute; top: 0; transform-origin: bottom; transform: scaleY(0); transition: .5s }
.container ul li:hover::before { transform: scaleY(1) }
```

### [HTML CSS List Item Hover Effects Version 3](https://codepen.io/bousahla-mounir/pen/VwPGywz)

made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%); box-shadow: 0 0 30px #000 }
.container ul { margin-top: 10px }
.container ul li { position: relative; border-bottom: 2px solid rgba(255,255,255,.1) }
.container ul li::before { position: absolute; top: 0; transform: scaleX(0); transition: .5s }
.container ul li:hover::before { transform: scaleX(1) }
```

### [HTML CSS List Item Hover Effects Version 2](https://codepen.io/bousahla-mounir/pen/yLgxPmd)

made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%); box-shadow: 0 0 30px #000 }
.container ul { margin-top: 10px }
.container ul li { position: relative; border-bottom: 2px solid rgba(255,255,255,.1) }
.container ul li::before { position: absolute; top: 0; transform: scaleY(0); transition: .5s }
.container ul li:hover::before { transform: scaleY(1) }
```

### [HTML CSS List Item Hover Effects Version 1](https://codepen.io/bousahla-mounir/pen/XWpPzvb)

made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%); box-shadow: 0 0 30px #000 }
.container ul { margin-top: 10px }
.container ul li { position: relative; border-bottom: 2px solid rgba(255,255,255,.1) }
.container ul li::before { position: absolute; top: 0; transform: scaleX(0); transition: .5s }
.container ul li:hover::before { transform: scaleX(1) }
```

### [CSS Folded Image Hover Effects](https://codepen.io/bousahla-mounir/pen/JjEBVQZ)

on scroll: li.: transform+shadow+top ×4 | made with: transition · :hover

```css
ul { position: absolute; top: 50%; transform: translate(-50%,-50%) }
ul li { transition: .9s }
ul li:nth-of-type(1) { background-position: 0 0; box-shadow: none }
ul:hover li:nth-of-type(1) { transform: skewY(20deg); box-shadow: inset -10px 0 15px rgb(0 0 0 / 50%) }
ul li:nth-of-type(2) { background-position: calc(-700px / 4) 0; box-shadow: none }
ul:hover li:nth-of-type(2) { transform: skewY(-20deg); box-shadow: inset 10px 0 15px rgb(0 0 0 / 50%), inset -10px 0 15px rgb(0 0 0 / 50%) }
ul li:nth-of-type(3) { background-position: calc(-700px / (4 / 2)) 0; box-shadow: none }
ul:hover li:nth-of-type(3) { transform: skewY(20deg); box-shadow: inset 10px 0 15px rgb(0 0 0 / 50%),inset -10px 0 15px rgb(0 0 0 / 50%) }
ul li:nth-of-type(4) { background-position: calc(-700px / (4 / 3)) 0; box-shadow: none }
ul:hover li:nth-of-type(4) { transform: skewY(-20deg); box-shadow: inset 10px 0 15px rgb(0 0 0 / 50%) }
```

### [CSS Paper Folded Image Hover Effects Version 2](https://codepen.io/bousahla-mounir/pen/poRZagw)

on scroll: div.container: transform+top | made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) skewY(0); border-top: 20px solid #ff5722; border-bottom: 20px solid #ff5722; background-position: -200px 0; transition: .9s }
.container:hover { transform: translate(-50%,-50%) skewY(15deg) }
.container::before,.container::after { position: absolute; top: -20px; border-top: 20px solid #ff5722; border-bottom: 20px solid #ff5722; transition: .9s }
.container::before { background-position: 0 0; transform: skewY(-20deg) rotateY(90deg) }
.container::after { background-position: -500px 0; transform: skewY(-20deg) rotateY(90deg) }
.container:hover::before,.container:hover::after { transform: skewY(-20deg) rotateY(0deg) }
```

### [CSS Paper Folded Image Hover Effects Version 1](https://codepen.io/bousahla-mounir/pen/YzNjeyb)

on scroll: li.: transform+top ×2, ul.: transform+top | made with: transition · :hover

```css
ul { position: absolute; top: 50%; transform: translate(-50%,-50%) skewY(0); transition: .9s }
ul:hover { transform: translate(-50%,-50%) skewY(15deg) }
ul li { transition: .9s }
ul li:nth-of-type(1) { background-position: 0 0; transform: skewY(-20deg) rotateY(90deg); border-top: 20px solid #ff5722; border-bottom: 20px solid #ff5722 }
ul:hover li:nth-of-type(1) { transform: skewY(-20deg) rotateY(0deg) }
ul li:nth-of-type(2) { background-position: -200px 0; border-top: 20px solid #ff5722; border-bottom: 20px solid #ff5722 }
ul li:nth-of-type(3) { background-position: -500px 0; transform: skewY(-20deg) rotateY(90deg); border-top: 20px solid #ff5722; border-bottom: 20px solid #ff5722 }
ul:hover li:nth-of-type(3) { transform: skewY(-20deg) rotateY(0deg) }
```

### [CSS Image Zoom in Zoom Out Hover Effects](https://codepen.io/bousahla-mounir/pen/JjEZOdX)

on scroll: img.: transform+opacity+top, div.content: transform+opacity+top | made with: transition · :hover

```css
.box { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.box img { position: relative; transition: .9s }
.box:hover img { transform: scale(0); opacity: 0 }
.box .content { position: absolute; top: 0; transform: scale(3); opacity: 0; transition: .9s }
.box:hover .content { transform: scale(1); opacity: 1 }
.box .content h1 { margin-bottom: 10px }
```

### [CSS Creative DIV Shape with Cool Hover Effects](https://codepen.io/bousahla-mounir/pen/XWpYeoL)

made with: transition · :hover

```css
.box { position: absolute; top: 50%; transform: translate(-50%,-50%); box-shadow: 0 0 0 20px #03a9f4; transition: .9s }
.box::before,.box::after { position: absolute; top: 50%; transform: translate(-50%,-50%); transition: .9s }
.box::before { transform: translate(-50%,-50%) rotate(45deg) }
.box::after { transform: translate(-50%,-50%) scaleY(.7); box-shadow: 0 0 10px rgba(0,0,0,.5) }
.box:hover::after { box-shadow: none }
```

### [CSS Split Image On Hover Version 2](https://codepen.io/bousahla-mounir/pen/poRKjZv)

made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container::before,.container::after { position: absolute; top: 0; transform: rotateX(0) translateY(0); transition: .9s }
.container::before { transform-origin: bottom; background-position: 0 0 }
.container::after { transform-origin: top; background-position: calc(-700px / 2) 0 }
.container:hover::before { transform: rotateX(90deg) translateY(200px) }
.container:hover::after { transform: rotateX(90deg) translateY(-200px) }
.container h1 { margin-bottom: 20px }
```

### [CSS Split Image On Hover Version 1](https://codepen.io/bousahla-mounir/pen/yLgEYEN)

made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container::before,.container::after { position: absolute; top: 0; transform: scaleY(1) translateY(0); transition: .9s }
.container::before { transform-origin: bottom; background-position: 0 0 }
.container::after { transform-origin: top; background-position: calc(-700px / 2) 0 }
.container:hover::before { transform: scaleY(0) translateY(200px) }
.container:hover::after { transform: scaleY(0) translateY(-200px) }
.container h1 { margin-bottom: 20px }
```

### [CSS Image Hover Effects With Caption Overlay Version 2](https://codepen.io/bousahla-mounir/pen/qBRKOBN)

on scroll: img.: transform+top, h1.: color, p.: color | made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container img { position: relative; transition: 1.5s }
.container:hover img { transform: scale(1.5) rotate(15deg) }
.container .center { position: absolute; top: 15%; transition: .9s }
.container .center::before,.container .center::after { position: absolute; top: 0; transition: .9s }
.container .center::before { transform: scale(1,0) }
.container .center::after { transform: scale(0,1); border-top: 3px solid #fff; border-bottom: 3px solid #fff }
.container:hover .center::before,.container:hover .center::after { transform: scale(1,1) }
.container .center h1 { position: relative; margin-bottom: 10px }
.container .center p { position: relative }
```

### [CSS Image Hover Effects With Caption Overlay Version 1](https://codepen.io/bousahla-mounir/pen/VwPdLOP)

on hover of img.: img.: transform+top | made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container img { position: relative; transition: 1.5s }
.container:hover img { transform: scale(1.5) rotate(15deg) }
.container .center { position: absolute; top: 15%; transition: .9s }
.container .center::before,.container .center::after { position: absolute; transition: .9s }
.container .center::before { top: 50%; transform: translateY(-50%) }
.container .center::after { top: 0; transform: translateX(-50%); border-top: 3px solid #fff; border-bottom: 3px solid #fff }
.container .center h1 { position: relative; margin-bottom: 10px }
.container .center p { position: relative }
```

### [CSS Creative Div Shape with Cool Hover Effects](https://codepen.io/bousahla-mounir/pen/vYgrEjq)

made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%); transition: .9s }
.container h1 { position: relative }
.container::before,.container::after { position: absolute; top: 0; transition: .9s }
.container::before { transform: rotate(30deg) }
.container::after { transform: rotate(60deg) }
.container:hover::before { transform: rotate(calc(25deg + 90deg)) }
.container:hover::after { transform: rotate(calc(65deg - 90deg)) }
```

### [Hover fill effect](https://codepen.io/pjoiwfty/pen/YzNevbL)

made with: transition · :hover

```css
h2 { position: relative; transition: .6s }
h2::before { position: absolute; top: 0; transition: .6s }
```

### [CSS 3D Image layer flip Hover Effects](https://codepen.io/bousahla-mounir/pen/mdRpqdg)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.container { position: relative }
.container::before { position: absolute; top: 0; bottom: 0 }
.container .content { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container .content::before,.container .content::after { position: absolute; filter: grayscale(100%); transform: perspective(1000px) rotateX(0deg); transition: 1.5s }
.container .content::before { top: 0; transform-origin: top }
.container .content::after { top: 50%; background-position: 0 -200px; transform-origin: bottom }
.container .content:hover::before { transform: perspective(1000px) rotateX(270deg) }
.container .content:hover::after { transform: perspective(1000px) rotateX(-270deg) }
```

### [Product Shopping Grid Styles](https://codepen.io/Priyamaheshwari/pen/VwPrLmd)

on hover of a.: img.pic-2: opacity, ul.social: opacity+top, a.: background+top, a.: color+top | made with: transition · :hover · clip-path · 3D (perspective / preserve-3d)

```css
h3.h3 { text-transform:capitalize }
.product-grid { position:relative }
.product-grid .product-image { position:relative; transition:all .3s ease 0s }
.product-grid .pic-1 { opacity:1; transition:all .3s ease-out 0s }
.product-grid:hover .pic-1 { opacity:1 }
.product-grid .pic-2 { opacity:0; position:absolute; top:0; transition:all .3s ease-out 0s }
.product-grid:hover .pic-2 { opacity:1 }
.product-grid .social { opacity:0; transform:translateY(-50%) translateX(-50%); position:absolute; top:60%; transition:all .3s ease 0s }
.product-grid:hover .social { opacity:1; top:50% }
.product-grid .social li a { position:relative; transition:all .3s ease-in-out }
.product-grid .social li a:after,.product-grid .social li a:before { opacity:0; transform:translateX(-50%); position:absolute; top:-30px }
.product-grid .social li a:after { transform:translateX(-50%) rotate(45deg); top:-20px }
```

### [CSS 3D Hover Effects](https://codepen.io/bousahla-mounir/pen/NWdvwJL)

on scroll: div.container: transform+top | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.container { position: absolute; top: 50%; transform: perspective(500px) translate(-50%,-50%) rotateX(45deg); transition: .9s }
.container::before { position: absolute; bottom: -70px; transform-origin: top; transform: perspective(500px) rotateX(-45deg); transition: .9s }
.container img { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container:hover { transform: perspective(500px) translate(-50%,-50%) rotateX(15deg) }
.container:hover::before { transform: perspective(500px) rotateX(-75deg) }
```

### [CSS Content Box Hover Effects](https://codepen.io/bousahla-mounir/pen/WNROPbx)

made with: transition · :hover

```css
p { position: absolute; top: 50%; transform: translate(-50%,-50%) }
p::before,p::after { position: absolute; transition: .9s }
p::before { top: 0 }
p::after { bottom: 0 }
p:hover::before { border-top: 2px solid #fff }
p:hover::after { border-bottom: 2px solid #fff }
```

### [CSS3 Flip Image on Hover](https://codepen.io/bousahla-mounir/pen/YzNZMEM)

on scroll: img.: transform+top, div.content: transform | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container::before { position: absolute; top: -25px }
.container .content { position: absolute; top: 0; transform: perspective(1500px) rotateY(90deg); transition: .9s }
.container:hover .content { transform: perspective(1500px) rotateY(0deg) }
.container .content h1 { margin-bottom: 5px }
.container img { position: absolute; top: 0; transform: perspective(1500px) rotateY(0deg); transition: .9s }
.container:hover img { transform: perspective(1500px) rotateY(-90deg) }
```

### [CSS Simple CARD UI Design](https://codepen.io/bousahla-mounir/pen/vYggOmZ)

on scroll: li.: transform ×5, img.: transform+filter+top, span.: transform+top | made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container img { position: relative; transform: scale(1); filter: grayscale(50%); transition: .9s }
.container:hover img { transform: scale(1.25); filter: grayscale(0) }
.container::before { position: absolute; top: 0; transform: translate(-127px,23px) rotate(-45deg); transition: .5s }
.container:hover::before { transform: translate(300px,-500px) rotate(-45deg) }
.container ul { position: absolute; top: 0 }
.container ul li { transform: rotateY(90deg); transition: .9s }
.container:hover ul li { transform: rotateY(0deg) }
.container ul li a { border-bottom: 1px solid #979ca3 }
.container span { top: 0; transform-origin: bottom; transform: translateY(-100%) rotateX(90deg); transition: .9s }
.container:hover span { transform: translateY(-100%) rotateX(0deg) }
```

### [CSS Div Hover Effect](https://codepen.io/bousahla-mounir/pen/PoWbGGb)

made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container::before { position: absolute; top: 0; transform: scale(0); transition: .9s }
.container:hover::before { top: 0; transform: scale(1) }
.container h1 { margin-bottom: 15px }
```

### [CSS3 Image Overlay Hover Effects](https://codepen.io/bousahla-mounir/pen/vYgGJme)

on hover of img.: img.: transform+top, div.text-content: transform+opacity+top | made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container .img-content { position: relative }
.container .img-content::before { position: absolute; transform: translate(-465px,-400px) rotate(-45deg); transition: .9s }
.container:hover .img-content::before { transform: translate(-70px,-20px) rotate(-45deg) }
.container .img-content img { position: relative; transform: scale(1); transition: .9s }
.container:hover .img-content img { transform: scale(1.6) }
.container .text-content { position: absolute; top: 0; transform: scale(3); opacity: 0; transition: .9s }
.container:hover .text-content { transform: scale(1); opacity: 1 }
.container .text-content h1 { margin-bottom: 10px }
```

### [Steam library hover effect](https://codepen.io/ArranGravestock/pen/VwPwjoR)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.game { perspective: 1000px; perspective-origin: center top }
.game .game-wrapper { position: relative; box-shadow: 0px 10px 39px 10px rgba(62, 66, 66, 0.22); transition: transform 0.3s ease-in-out }
.game .game-wrapper:hover { transform: rotateX(10deg) }
.game .game-wrapper:hover .gradient { opacity: 1 }
.game .gradient { position: absolute; top: 0; transform: rotate(30deg); opacity: 0.3; transition: height 0.3s ease-in-out, opacity 0.3s ease-in-out }
```

### [CSS Slide Image On Hover](https://codepen.io/bousahla-mounir/pen/GRNbVpr)

on scroll: li.: transform+top ×2 | on hover of li.: li.: transform+top ×2 | made with: transition · :hover

```css
ul { position: absolute; top: 50%; transform: translate(-50%,-50%) }
ul li { position: relative; transition: .5s }
ul:hover li { transform: translateY(-100px) }
```

### [CSS DIV Hover Effect](https://codepen.io/bousahla-mounir/pen/ZEBdRjL)

made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%); transition: .5s }
.container::before,.container::after { position: absolute; top: 10%; opacity: .7; transition: .5s }
.container .content { position: relative; transform: rotate(45deg) scale(1.2); transition: .5s }
.container .content p { transform: rotate(-45deg) }
```

### [Animated Image Hover Effects with Captions](https://codepen.io/bousahla-mounir/pen/MWbxowz)

on scroll: div.content: transform | made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container::before,.container::after { position: absolute; top: 0; opacity: .9; transition: .9s }
.container::before { transform: translate(500px,-600px) rotate(45deg) }
.container::after { transform: translate(-770px,520px) rotate(45deg) }
.container:hover::before { transform: translate(-770px,520px) rotate(45deg) }
.container:hover::after { transform: translate(500px,-600px) rotate(45deg) }
.container .content { position: absolute; top: 0; opacity: .8; transform: rotateY(90deg); transition: .5s }
.container:hover .content { transform: rotateY(0deg) }
.container .content h1 { margin-bottom: 20px }
```

### [CSS Creative Button Design](https://codepen.io/bousahla-mounir/pen/zYoeQRy)

on scroll: a.: color | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container a { position: relative; transition: .9s }
.container a::before,.container a::after { position: absolute; opacity: .8; transition: .9s; transform: perspective(1500px) rotateX(0deg) }
.container a::before { top: -5px; transform-origin: top }
.container a::after { top: 5px; transform-origin: bottom }
.container a:hover::before { top: 0; transform: perspective(1500px) rotateX(80deg) }
.container a:hover::after { top: 0; transform: perspective(1500px) rotateX(-80deg) }
```

### [CSS Button Hover Effect](https://codepen.io/bousahla-mounir/pen/abBXPrj)

on scroll: a.: color | made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container a { position: relative; transition: 1 }
.container a::before,.container a::after { position: absolute }
.container a::before { top: -100%; transition: .5s }
.container a::after { top: -200%; transition: 1s }
.container a:hover::before { top: 0 }
.container a:hover::after { top: 0 }
```

### [Animated Image Hover Effects](https://codepen.io/bousahla-mounir/pen/GRNzYLW)

on hover of img.: img.: transform, div.content: transform | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container img { position: relative; transition: .5s }
.container:hover img { transform: translateX(400px) }
.container .content { position: absolute; top: 0; transform: perspective(1000px) rotateY(90deg); transition: .5s }
.container:hover .content { transform: perspective(500px) rotateY(0) }
.container .content p { margin-top: 25px }
```

### [CSS 3D Flip Button Hover Effect](https://codepen.io/bousahla-mounir/pen/GRNzBPB)

on hover of a.: a.: transform ×2 | made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container a { transition: .9s }
.container a:nth-child(1) { position: relative; transform: rotateY(0deg) translateX(0px) }
.container:hover a:nth-child(1) { transform: rotateY(90deg) translateX(40px) }
.container a:nth-child(2) { position: absolute; top: 0; transform: rotateY(90deg) translateX(-40px) }
.container:hover a:nth-child(2) { transform: rotateY(0deg) translateX(0px) }
```

### [Grayscale Hover Effect](https://codepen.io/bousahla-mounir/pen/PobXjmy)

made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container img { filter: grayscale(0); transition: 1.2s }
.container img:hover { filter: grayscale(100%) }
```

### [Css Image Hover Effect](https://codepen.io/bousahla-mounir/pen/QWGzgbo)

on scroll: img.: transform+top, div.content: transform+top | made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container img { position: absolute; top: 0; transform: rotate(0) scale(1); transition: 1.2s }
.container img:hover { transform: rotate(-360deg) scale(0) }
.container .content { position: absolute; top: 0; transform: rotate(0) scale(0); transition: 1.2s }
.container:hover .content { transform: rotate(360deg) scale(1) }
.container .content h1 { margin-bottom: 30px }
```

### [Cards Hover Effect -> HTML & CSS](https://codepen.io/DivineBlow/pen/ZEBqNZb)

made with: transition · :hover

```css
body .container .card { position: relative; box-shadow: 0 15px 60px rgba(0, 0, 0, 0.5) }
body .container .card .face { position: absolute; bottom: 0 }
body .container .card .face.face2 { transition: 0.5s }
body .container .card .face.face2 h2 { transition: 0.5s }
```

### [Image Zoom Effect](https://codepen.io/bousahla-mounir/pen/rNWqgWX)

on scroll: img.: transform+top | made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container img { transition: 1s }
.container:hover img { transform: scale(1.6) rotate(25deg) }
```

### [3D Hover Effect](https://codepen.io/bousahla-mounir/pen/ExNQmbM)

on scroll: div.front: transform+top, div.back: transform | made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container .front,.container .back { position: absolute; top: 0; transition: .5s }
.container .front { transform-origin: bottom; transform: rotateX(0deg) translateY(0) }
.container .back { transform-origin: top; transform: rotateX(90deg) translateY(-40px) }
.container:hover .front { transform: rotateX(90deg) translateY(40px) }
.container:hover .back { transform: rotateX(0deg) translateY(0) }
```

### [Fancy Box With Zoom Effect animation](https://codepen.io/bousahla-mounir/pen/ZEBvxXb)

on scroll: div.content: background+color+shadow, p.: opacity+color+top | made with: @keyframes · transition

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container .content { transition: .5s; animation: animate 5s infinite linear }
0% { box-shadow: none }
30% { box-shadow: none }
50% { box-shadow: 30px 0 0 #000 , -30px 0 0 #000 , 0 30px 0 #000 , 0 -30px 0 #000 }
80% { box-shadow: 30px 0 0 #000 , -30px 0 0 #000 , 0 30px 0 #000 , 0 -30px 0 #000 }
100% { box-shadow: none }
.container p { animation: animate2 5s infinite linear }
0% { opacity: 0 }
30% { opacity: 0 }
50% { opacity: 1 }
80% { opacity: 1 }
```

### [Fancy Box With Zoom Effect](https://codepen.io/bousahla-mounir/pen/QWGaNLO)

on scroll: div.content: background+top | made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container .content { margin-top: 22px; transition: .5s }
.container span { position: absolute; transition: .5s }
.container span:nth-child(2) { top: 0 }
.container:hover span:nth-child(2) { top: -20px }
.container span:nth-child(3) { top: 0 }
.container:hover span:nth-child(3) { top: 0 }
.container span:nth-child(4) { top: 100% }
.container:hover span:nth-child(4) { top: 100% }
.container span:nth-child(5) { top: 0 }
.container:hover span:nth-child(5) { top: 0 }
```

### [Slide Image Hover](https://codepen.io/bousahla-mounir/pen/yLVpLRO)

on scroll: img.: transform+top | made with: transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container img { transition: .9s }
.container:hover img { transform: translateY(-125px) }
.container .content { position: absolute; bottom:-125px; transition: .9s }
.container:hover .content { bottom: 0 }
```

### [3D Card Flip Animation](https://codepen.io/bousahla-mounir/pen/mdOqgVZ)

on hover of div.card: div.card: transform | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container .card { position: relative; transform:perspective(300px) rotateY(0deg); transition: .9s; box-shadow: -13px 25px 20px rgba(0,0,0,.4) }
.container .card .front,.container .card .back { position: absolute; top: 0 }
.container .card .back { transform: rotateY(-180deg) }
.container .card:hover { transform: rotateY(180deg) }
.container .card .fa { position: relative; top: 50%; transform: translateY(-50%) }
.container .card h1 { position: relative; top: 50%; transform: translateY(-50%) }
```

### [Image Hover Effect](https://codepen.io/bousahla-mounir/pen/dyOZLPQ)

on hover of img.: img.: transform, div.content: transform+top | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.container { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.container img { transition: .9s; transform-origin: top; transform: perspective(1000px) rotateX(0deg) }
.container:hover img { transform: rotateX(-90deg) }
.container .content { position: absolute; top: 0; transform-origin: bottom; transition: .9s; transform: perspective(1000px) rotateX(90deg) }
.container:hover .content { transform: rotateX(0deg) }
.container .content .detail { position: relative; top: 50%; transform: translate(-50%,-50%) }
.container .content .detail h1 { margin-bottom: 20px }
```

### [Skew text hover](https://codepen.io/bousahla-mounir/pen/PobOWqy)

made with: transition · :hover

```css
ul { position: absolute; top: 50%; transform: translate(-50%,-50%) }
ul li { position: relative; transition: .9s }
ul:hover li { box-shadow: 0px 15px 15px #9d7c7c }
ul:hover li:nth-child(2n+1) { transform: skewY(-15deg) }
ul:hover li:nth-child(2n) { transform: skewY(15deg); box-shadow: inset 2px 2px 20px #c0bcbc , 0px 15px 15px #9d7c7c }
```

### [CSS Hover Effect](https://codepen.io/bousahla-mounir/pen/vYyWGwd)

on hover of img.: div.text-box: transform | made with: transition · :hover

```css
.box { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.box .text-box { position: absolute; top: 0; transition: .5s; opacity: .9; transform: scaleX(0) }
.box:hover .text-box { transform: scaleX(1) }
.box .text-box h1 { position: relative; top: 50%; transform: translateY(-50%) }
```

### [CSS Hover Effect](https://codepen.io/bousahla-mounir/pen/xxRPVzO)

on hover of img.: div.text-box: transform | made with: transition · :hover

```css
.box { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.box .text-box { position: absolute; top: 0; transition: .5s; opacity: .9; transform: rotateY(90deg) }
.box:hover .text-box { transform: rotateY(0deg) }
.box .text-box h1 { position: relative; top: 50%; transform: translateY(-50%) }
```

### [CSS Hover Effect](https://codepen.io/bousahla-mounir/pen/BaQmKmx)

made with: transition · :hover

```css
.box { position: absolute; top: 50%; transform: translate(-50%,-50%) }
.box .text-box { position: absolute; top: 0; transition: .5s; opacity: .9 }
.box .text-box h1 { position: relative; top: 50%; transform: translateY(-50%) }
```

### [Animated Text Fill](https://codepen.io/paula_m/pen/OJbXdJp)

made with: transition · :hover

```css
.title { position: relative; text-transform: uppercase }
.title .outer { position: absolute; top: 0; transform: translate(-100%) }
.title .inner { transform: translate(100%) }
.title .outer, .title .inner { transition: transform 0.15s cubic-bezier(0.29, 0.73, 0.74, 1.02) }
.title:hover .outer, .title:hover .inner { transform: none }
```

### [Glowing-Dots-on-Hover](https://codepen.io/sadmanh2050/pen/VwmLBVv)

made with: transition · :hover

```css
ul { position: absolute; top: 50%; transform: translate(-50%,-50%) }
li { transition: 0.5s }
ul li:hover { box-shadow: 0 0 10px rgba(255,255,255,1), 0 0 20px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,1), 0 0 0 75px rgba(255,255,255,0.05), 0 0 0 60px rgba(255,255,255,0.05), 0 0 0 45px rgba(255,255,255,0.05), 0 0 0 30px rg }
```

### [3D Cards Hover Effect -> HTML & CSS](https://codepen.io/DivineBlow/pen/NWbWbVw)

on hover of div.card: div.card: transform+top | made with: transition · :hover

```css
body .container { position: relative; transition: 0.5s; transform: skewY(-10deg) }
body .container .card { position: relative; transition: 0.5s }
body .container .card:before { position: absolute; top: -15px; transform-origin: bottom; transform: skewX(45deg); transition: 0.5s }
body .container .card:after { position: absolute; top: -15px; transform: skewY(45deg); transition: 0.5s; border-bottom: 200px solid #B5FFFC }
body .container .card:hover { transform: translateY(-40px) }
body .container .card .imgBx { position: relative }
body .container .card .imgBx h3 { position: relative; margin-top: 10px }
body .container .card .content { position: relative }
body .container .card .content:before { position: absolute; bottom: 0; transform-origin: bottom; transform: skewX(45deg); transition: 0.5s }
body .container .card:hover .content:before { transform: translateY(40px) skewX(45deg); filter: blur(5px); opacity: 0.5 }
.card { margin-bottom: 100px }
.container { padding-top: 200px; position: relative; top: 80% }
```

### [Tilt Effect on Mouse Over](https://codepen.io/Coding_Journey/pen/RwGzqgJ)

made with: 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.card { transform: perspective(1000px) }
.card h1, .card h2 { transform: translateZ(50px) }
```

```js
addEventListener("mouseenter", cardMouseEnter)
addEventListener("mousemove", cardMouseMove)
addEventListener("mouseleave", cardMouseLeave)
```

### [Hover effect 5](https://codepen.io/PejmanNaderi/pen/abmajRJ)

on scroll: div.element: transform, div.side1: transform, div.side2: transform, div.side3: transform | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.container { position: relative; perspective: 1300px }
.element { transition: transform 1.2s ease-out, letter-spacing 1.2s linear }
.side1, .side2, .side3 { position: absolute; top: 0; transform: rotateY(-180deg) }
.side1 { transition: transform 0.4s ease-in 0.8s }
.side2 { transition: transform 0.4s ease-in 0.4s }
.side3 { transition: transform 0.4s ease-in }
.container:hover .element { transition: transform 2s cubic-bezier(.4,.7,.79,1.1) 0.1s, letter-spacing 2s linear; transform: translateX(73%) }
.container:hover .side1, .container:hover .side2, .container:hover .side3 { transition: transform 0.5s ease-out; transform: rotateY(0deg) }
```

### [Hover effect 3](https://codepen.io/PejmanNaderi/pen/yLavxjd)

on scroll: div.item: clip-path+top | made with: transition · :hover · clip-path

```css
.item { -webkit-clip-path: polygon(10% 1%, 11% 100%, 33% 99%, 35% 65%, 59% 66%, 64% 100%, 85% 98%, 85% 1%, 63% 3%, 59% 46%, 37% 44%, 34% 0%); clip-path: polygon(10% 1%, 11% 100%, 33% 99%, 35% 65%, 59% 66%, 64% 100%, 85% 98%, 85% }
.container:hover .item { -webkit-clip-path: polygon(35% 100%, 37% 32%, 50% 30%, 50% 23%, 38% 10%, 53% 0, 63% 12%, 50% 23%, 50% 30%, 63% 30%, 59% 100%, 40% 100%); clip-path: polygon(35% 100%, 37% 32%, 50% 30%, 50% 23%, 38% 10%, 53% 0, 63% 12%, 50 }
```

### [Hover effect 2](https://codepen.io/PejmanNaderi/pen/BaLmWOX)

made with: transition · :hover

```css
.element { position: relative; outline-offset: 120px; transition: color 100ms linear calc(2*var(--delay)), border-width var(--duration) var(--speed), box-shadow var(--duration) var(--speed) calc(2*var(--delay)) }
.element::before, .element::after { position: absolute; transform: scale(.2) }
.element::before { transition: transform var(--duration) var(--speed) calc(3*var(--delay)) }
.element::after { transition: transform var(--duration) var(--speed) calc(4*var(--delay)) }
.element:hover { box-shadow: 0 0 0 20px var(--clr2) }
.element:hover::before, .element:hover::after { transform: none }
```

### [CSS BUTTON-NEON SHADOW WITH ANIMATION](https://codepen.io/ps173/pen/MWepJBw)

on scroll: button.: transform+background+shadow+top, span.: opacity+top | on hover of button.: button.: shadow | made with: @keyframes · transition · :hover

```css
#neonShadow { transition:0.3s; animation: glow 1s infinite; transition:0.5s }
span { padding-top: 15%; transition: 0.3s; opacity: 0 }
span:hover { transition: 0.3s; opacity: 1 }
#neonShadow:hover { transform:translateX(-20px)rotate(30deg); transition:0.5s }
0% { box-shadow: 5px 5px 20px rgb(93, 52, 168),-5px -5px 20px rgb(93, 52, 168) }
50% { box-shadow: 5px 5px 20px rgb(81, 224, 210),-5px -5px 20px rgb(81, 224, 210) }
100% { box-shadow: 5px 5px 20px rgb(93, 52, 168),-5px -5px 20px rgb(93, 52, 168) }
@keyframes glow animates box-shadow
```

### [Link underline hover effect](https://codepen.io/Marty-Development/pen/bGpZaRZ)

made with: transition · :hover

```css
a::after { position: absolute; bottom: 0 }
a::before { position: absolute; bottom: 0; -webkit-transition: transform 0.2s ease-in-out; -o-transition: transform 0.2s ease-in-out; transition: transform 0.2s ease-in-out }
a:hover:before { -webkit-transform: translateX(100%); -moz-transform: translateX(100%); -ms-transform: translateX(100%); -o-transform: translateX(100%); transform: translateX(100%) }
a { padding-bottom: 0.7rem; position: relative }
```

### [CSS Only "hologram" effect Button 3D Icon](https://codepen.io/takaneichinose/pen/wvGwXQJ)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.btn-challenge { position: relative; transition: background-color 180ms ease-out }
.hover-area { position: absolute; top: 0; perspective: 500px }
.hover-area .hover-col:nth-child(1):hover ~ .icon-home { transform: scale(1) rotateX(45deg) rotateY(-90deg); transition: transform 380ms cubic-bezier(0.18, 0.89, 0.32, 1.28) }
.hover-area .hover-col:nth-child(2):hover ~ .icon-home { transform: scale(1) rotateX(45deg) rotateY(-75deg); transition: transform 380ms cubic-bezier(0.18, 0.89, 0.32, 1.28) }
.hover-area .hover-col:nth-child(3):hover ~ .icon-home { transform: scale(1) rotateX(45deg) rotateY(-60deg); transition: transform 380ms cubic-bezier(0.18, 0.89, 0.32, 1.28) }
.hover-area .hover-col:nth-child(4):hover ~ .icon-home { transform: scale(1) rotateX(45deg) rotateY(-45deg); transition: transform 380ms cubic-bezier(0.18, 0.89, 0.32, 1.28) }
.hover-area .hover-col:nth-child(5):hover ~ .icon-home { transform: scale(1) rotateX(45deg) rotateY(-30deg); transition: transform 380ms cubic-bezier(0.18, 0.89, 0.32, 1.28) }
.hover-area .hover-col:nth-child(6):hover ~ .icon-home { transform: scale(1) rotateX(45deg) rotateY(-15deg); transition: transform 380ms cubic-bezier(0.18, 0.89, 0.32, 1.28) }
.hover-area .hover-col:nth-child(7):hover ~ .icon-home { transform: scale(1) rotateX(45deg) rotateY(0deg); transition: transform 380ms cubic-bezier(0.18, 0.89, 0.32, 1.28) }
.hover-area .hover-col:nth-child(8):hover ~ .icon-home { transform: scale(1) rotateX(45deg) rotateY(15deg); transition: transform 380ms cubic-bezier(0.18, 0.89, 0.32, 1.28) }
.hover-area .hover-col:nth-child(9):hover ~ .icon-home { transform: scale(1) rotateX(45deg) rotateY(30deg); transition: transform 380ms cubic-bezier(0.18, 0.89, 0.32, 1.28) }
.hover-area .hover-col:nth-child(10):hover ~ .icon-home { transform: scale(1) rotateX(45deg) rotateY(45deg); transition: transform 380ms cubic-bezier(0.18, 0.89, 0.32, 1.28) }
```

### [Social media icons with hover effect](https://codepen.io/Marty-Development/pen/eYJxEyw)

made with: transition · :hover

```css
.fa-facebook, .fa-twitter, .fa-instagram, .fa-pinterest { transition: all 0.2s ease }
.fab:hover { transform: scale(1.1); transition: all 0.2s ease }
```

### [Online Tutorials / CSS3 Creative Menu Item Hover Effects | Layered Text Effects](https://codepen.io/corvus-007/pen/bGEQjjL)

on hover of li.navigation__item: a.navigation__link: color | made with: transition · :hover

```css
.navigation__link { position: relative }
.navigation__link:hover { transition: 0.25s }
.navigation__link:hover::before { transform: translate(12px, -12px) }
.navigation__link:hover::after { transform: translate(24px, -24px) }
.navigation__link::before, .navigation__link::after { position: absolute; top: 0; transition: 0.5s }
```

### [Undertale Buttons (with messages on click + hover effect)](https://codepen.io/Marty-Development/pen/Rwrejmx)

made with: transition · :hover

```css
.choice { transition: all 0.2s ease }
```

```js
addEventListener("mouseenter", (e) => {
addEventListener("mouseleave", (e) => {
```

### [Circle Menu With Hover Effect](https://codepen.io/techyt/pen/LYGQKMo)

on hover of li.: li.: transform+top ×9, a.: transform+top ×9, ul.menu: transform+top | made with: transition · :hover

```css
.navbar { position: relative; transition: 0.24s 0.2s }
.navbar .menu { position: absolute; top: -75px; transform: scale(0); transition: transform 1.4s 0.07s }
.navbar:hover .menu { transition: transform 0.4s 0.08s, z-index 0s 0.5s; transform: scale(1) }
.navbar .menu li { position: absolute; top: -100px; transition: all 0.5s 0.1s }
.navbar:hover .menu li { transition: all 0.7s }
.navbar .menu li a { position: absolute; transition: 0.7s }
.navbar:hover .menu li:nth-child(1) { transform: rotate(85deg) }
.navbar:hover .menu li:nth-child(1) a { transform: rotate(635deg) }
.navbar:hover .menu li:nth-child(2) { transform: rotate(125deg) }
.navbar:hover .menu li:nth-child(2) a { transform: rotate(595deg) }
.navbar:hover .menu li:nth-child(3) { transform: rotate(165deg) }
.navbar:hover .menu li:nth-child(3) a { transform: rotate(555deg) }
```

### [CSS only responsive article card with outline hover effect](https://codepen.io/cycosta/pen/ZEQXvJW)

on scroll: img.card__image: transform+top | made with: transition · :hover

```css
.card { position: relative; box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.5) }
.card::after { position: absolute; top: 0; transition: 0.3s }
.card:hover .card__content::before, .card:hover .card__thumb::before { transform: scaleX(1) }
.card:hover .card__content::after, .card:hover .card__thumb::after { transform: scaleY(1) }
.card:hover .card__image { transform: scale(1.2) }
.card__content::before, .card__thumb::before { position: absolute; transition: 0.5s }
.card__content::before, .card__thumb::before { transform: scaleX(0) }
.card__content::after, .card__thumb::after { position: absolute; top: 10px; transition: 0.5s }
.card__content::after, .card__thumb::after { transform: scaleY(0) }
.card__content { position: relative }
.card__content::before { top: 10px }
.card__content::after { transform-origin: bottom }
```

### [CSS3 Creative Menu Item Hover Effect](https://codepen.io/fadzrinmadu/pen/OJMjgYa)

on hover of li.: a.: opacity ×5, a.: transform+background+top | made with: transition · :hover

```css
ul { position: relative }
ul li::before { position: absolute; top: 50%; transform: translate(-50%, -50%); opacity: 0; transition: 0.5s }
ul li:hover::before { opacity: 0.05 }
ul li a { position: relative; text-transform: uppercase; transition: 0.5s }
ul:hover li a { opacity: 0 }
ul li a:hover { transform: scale(1.4); opacity: 1 }
ul li a::before { position: absolute; top: 0; transform: skewX(35deg); transition: 0s }
ul li a:hover::before { transition: 0.5s }
```

### [Grid layout image gallery with hover effect](https://codepen.io/cycosta/pen/wvMeNoJ)

on hover of a.gallery__link: img.gallery__image: filter ×11, img.gallery__image: transform+filter+top, figcaption.gallery__caption: opacity | made with: transition · :hover

```css
.gallery { transition: 0.3s }
.gallery:hover .gallery__image { filter: grayscale(1) }
.gallery__link:hover .gallery__image { filter: grayscale(0) }
.gallery__link:hover .gallery__caption { opacity: 1 }
.gallery__thumb { position: relative }
.gallery__image { transition: 0.3s }
.gallery__image:hover { transform: scale(1.1) }
.gallery__caption { position: absolute; bottom: 0; opacity: 0; transition: 0.3s }
```

### [Sub Navigation Hover Effect](https://codepen.io/dpkmos/pen/oNbZoNo)

held: fixed header | made with: position: fixed · transition · :hover

```css
header { border-bottom: 1px solid #0f0c11; position: fixed }
.link-menu { position: absolute; top: 80px }
.link-menu div { position: relative }
.link-menu div::after { position: absolute; bottom: 0; transition: 0.3s all ease; transform: scaleY(0); transform-origin: bottom }
.link-menu div span { position: relative }
.link-menu div:hover::after { transform: scaleY(1) }
```

### [Hover Effect #1](https://codepen.io/tatthien/pen/RwrWrZm)

made with: transition · :hover

```css
a { position: relative }
a:before { position: absolute; bottom: -2px; transform: scaleX(0); transition: transform 0.4s cubic-bezier(0.86, 0.04, 0.24, 0.88) }
a:hover:before { transform: scaleX(1) }
```

### [Image Hover Effect](https://codepen.io/GiulioAndCode/pen/JjGYjLJ)

on scroll: p.title_card: filter, p.subtitle_card: filter, img.img_card: transform+filter+top | on hover of div.card: p.title_card: filter ×2, p.subtitle_card: filter ×2, img.img_card: transform+filter+top ×2 | made with: transition · :hover

```css
.img_card { transition:all 0.3s ease-in-out }
.title_card { position: absolute; filter:opacity(0); transition: all 0.3s ease-in-out }
.subtitle_card { position: absolute; margin-top:30px; filter:opacity(0); transition: all 0.3s ease-in-out }
.card:hover .img_card { transform:scale(1.1); filter:brightness(0.7) }
.card:hover .title_card, .card:hover .subtitle_card { filter:opacity(1) }
```

### [Our Services](https://codepen.io/anupshrestha11/pen/pogJaQY)

made with: transition · :hover

```css
.row .box { transition: color 0.5s ease-in }
.row .box .icon { transition: box-shadow 0.5s ease-in }
.row .box:nth-of-type(1) .icon { box-shadow: 0px 0px 0px 0px #ff9900 }
.row .box:nth-of-type(1):hover .icon { box-shadow: 0px 0px 0px 400px #ff9900 }
.row .box:nth-of-type(2) .icon { box-shadow: 0px 0px 0px 0px #5158bb }
.row .box:nth-of-type(2):hover .icon { box-shadow: 0px 0px 0px 400px #5158bb }
.row .box:nth-of-type(3) .icon { box-shadow: 0px 0px 0px 0px #11adad }
.row .box:nth-of-type(3):hover .icon { box-shadow: 0px 0px 0px 400px #11adad }
```

### [Simple CSS button hover](https://codepen.io/N-Cristina/pen/yLeBGyj)

made with: transition · :hover

```css
.button { transition: all 0.5s }
.button span { position: relative; transition: 0.5s }
.button span:after { position: absolute; opacity: 0; top: 0; transition: 0.5s }
.button:hover span:after { opacity: 1 }
```

### [Links Hover Effects](https://codepen.io/mafevito/pen/BaoexJb)

made with: transition · :hover

```css
.title { margin-bottom: 50px }
.slide { position: relative; margin-bottom: 5px }
.slide:before { position: absolute; top: 1.15rem; bottom: 0; transform: scaleX(0); transition: transform .2s ease-in }
.slide:hover:before { transform: scaleX(1) }
```

### [Simple half-way hover](https://codepen.io/ashvinmotye/pen/MWadgLX)

made with: transition · :hover

```css
a { position: relative; text-transform: uppercase }
a:before { position: absolute; bottom: 0; transition: height 0.2s cubic-bezier(0.54, 0.07, 0.24, 0.99) }
```

### [Cursor Hover Effect](https://codepen.io/TKS31/pen/XWmQPGz)

held: fixed div.arrow, fixed div.circle | made with: position: fixed · :hover · pointer / mouse tracking

```css
.arrow { position: fixed; margin-top: 48px; transform: translate(0, 0); opacity: 0 }
.arrow::after { position: absolute; top: -15px; border-top: 5px solid #0366d6; transform: rotate(45deg) }
.circle { position: fixed; margin-top: 24px; transform: translate(0, 0); opacity: 0 }
```

```js
addEventListener('mousemove', (e) => {
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [Gallery - Tilt Hover Effect](https://codepen.io/TKS31/pen/abvxNeo)

made with: nothing recognised — read the code

```css
.gallery__img { padding-top: calc(3 / 2 * 15%); box-shadow: 8px 8px 60px rgba(0, 0, 0, 0.5) }
```

### [Button Hover Effects](https://codepen.io/mafevito/pen/LYpaxdj)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.title { margin-bottom: 50px }
.slide { transform: perspective(1px) translateZ(0) }
.slide:before { position: absolute; top: 0; bottom: 0; transform: scaleX(0); transition-property: transform }
.slide:hover::before { transform: scaleX(1) }
.border-bottom:hover { -webkit-box-shadow: inset 0 -3px 0 0 rgba(0,0,0,.18); box-shadow: inset 0 -5px 0 0 rgba(0,0,0,.18) }
.pulse { border-bottom: 5px solid #495DD3; transition: all 0.1s }
.pulse:active { transform: translate(0px,5px); -webkit-transform: translate(0px,5px) }
.jump { box-shadow: 0 8px 15px rgba(0,0,0,.1); transition: all .3s ease 0s }
.jump:hover { box-shadow: 0 15px 20px rgba(73, 93, 211, .4); transform: translateY(-7px) }
```

### [Product card with hover effect](https://codepen.io/wikode/pen/rNOPOBO)

made with: transition · :hover

```css
.container { position: relative; box-shadow: 0 0 15px rgba(0, 0, 0, 0.3) }
img { transition: all 0.4s }
.caption { position: absolute; bottom: 0; transform: translateY(100%); transition: all 0.4s }
.container:hover .caption { transform: translateY(0%) }
.container:hover img { transform: translateY(-100%) }
.caption h1 { text-transform: uppercase }
```

### [Image Hover From Bottom, Color Overlay](https://codepen.io/cu0dc5eddc34/pen/gOaKNbM)

made with: transition · :hover

```css
.overlay-outer { position: relative }
.overlay { position: absolute; top: 0; bottom: 0; opacity: 0; transition: all 0.4s ease-in-out 0s }
a:hover .overlay { opacity: 1 }
.content-details { position: absolute; top: 50%; opacity: 0; transform: translate(-50%, -50%); transition: all 0.3s ease-in-out 0s }
.overlay-outer:hover .content-details { top: 50%; opacity: 1 }
.content-details h3 { margin-bottom: 0.5em; text-transform: uppercase }
.fadeIn_bottom { top: 80% }
.hover_color { position: relative }
.hover_color::before { position: absolute; top: 100%; bottom: 0; transition: all 350ms }
.hover_color:hover::before { top: 0 }
.hover_color img { margin-bottom: 0; margin-bottom: -3px }
.hover_color .hover_color-inner { position: absolute; top: 0; bottom: 0 }
```

### [Shiny May - hover effect](https://codepen.io/groucha/pen/oNjojoQ)

made with: transition · :hover

```css
.hero__part h1 { text-transform: uppercase; transition: 1.2s }
.hero__part h1:hover { background-position: -120% 0 }
```

### [Hover Effect](https://codepen.io/ManmohanSingh/pen/dyYVxOP)

made with: transition · :hover

```css
.link { text-transform: uppercase; position: relative; transition: transform .1s ease-in-out }
.link::before, .link::after { position: absolute; transition: transform .5s }
.link1::after { bottom: -10px; transform: scaleX(0) }
.link1:hover::after { transform: scaleX(1) }
.link2::before, .link2::after { transform: scaleX(0) }
.link2::before { top: -10px }
.link2::after { bottom: -10px }
.link2:hover::before, .link2:hover::after { transform: scaleX(1) }
.link3::before, .link3::after { transform: scaleX(0) }
.link3::before { top: -10px }
.link3::after { bottom: -10px }
.link3:hover::before, .link3:hover::after { transform: scaleX(1) }
```

### [Futuristic Hover](https://codepen.io/Gogh/pen/RwWZYPo)

made with: @keyframes · transition · :hover · 3D (perspective / preserve-3d)

```css
div { position: relative; perspective: 700px }
svg { position: absolute; transition: 0.35s }
ellipse { transition: 0.35s }
#tc-one:hover #tc-aza { transform: rotatex(70deg) rotatey(70deg) scale(0.9); transition: 0.35s }
#tc-one:hover #tc-cza { transform: rotatey(50deg) rotatex(20deg) scale(0.95); transition: 0.35s }
#tc-one:hover #tc-dza { transform: scale(1.5) !important; opacity: 0.3; transition: 0.35s }
#tc-one:hover #tc-eza { transform: rotatex(70deg) rotatez(-90deg) scale(0.8) !important; opacity: 0.3; transition: 0.35s }
#tc-one:hover #tc-aza ellipse, #tc-one:hover #tc-bza ellipse, #tc-one:hover #tc- { animation-name: rotate; animation-duration: 120s; animation-iteration-count: infinite; animation-direction: alternate; animation-timing-function: linear }
0% { transform: rotate(0deg) }
100% { transform: rotate(7200deg) }
#tc-one:hover #tc-gza { animation-name: rotatez; animation-duration: 120s; animation-iteration-count: infinite; animation-direction: alternate; animation-timing-function: linear }
0% { transform: rotatez(0deg) }
```

### [Css photo stack effect](https://codepen.io/lucas-audart/pen/GRpvxmJ)

on scroll: div.photo-stack: transform+top | made with: transition · :hover

```css
.page { position: relative }
.page ul li .container { position: relative; position: relative; transition: 0.5s }
.page ul li .container .photo-stack { background-position: center; transition: 0.5s }
.page ul li .container .photo-stack p { text-transform: capitalize }
.page ul li .container .photo-stack:hover { transform: scale(1.2) }
.page ul li .container:before, .page ul li .container:after { background-position: center; position: absolute; top: 0%; transition: 0.5s }
.page ul li .container:hover:before { transform: rotate(-3deg) scale(1.2) }
.page ul li .container:hover:after { transform: rotate(2deg) scale(1.2) }
```

### [bounce effect](https://codepen.io/manishgusain/pen/VwvpNrd)

made with: @keyframes · :hover

```css
.thumbnailInnerWrapper { position: relative }
.thumbnailInnerWrapper:before { position:absolute; top: -100% }
.thumbnailInnerWrapper:hover:before { animation: bounce 0.9s ease-in; top: 0 }
0% { top: -100% }
10% { top: -100% }
20% { top: 0 }
30% { top: -50% }
50% { top: 0 }
65% { top: -35% }
80% { top: 0 }
90% { top: -20% }
95% { top: 0 }
```

### [Profile Cards with Flip Hover Effect](https://codepen.io/catlady42/pen/vYNxYap)

on hover of div.flip-card: div.flip-card-inner: transform | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.flip-card { perspective: 1000px }
.flip-card-inner { position: relative; transition: transform 0.6s; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2) }
.flip-card:hover .flip-card-inner { transform: rotateY(180deg) }
.flip-card-front, .flip-card-back { position: absolute }
.flip-card-back { transform: rotateY(180deg) }
```

### [Image Hover Effect : Caption Reveal](https://codepen.io/anotherwebguy/pen/qBORRzV)

on hover of img.: img.: background, div.caption-box: opacity+shadow+top | made with: transition · :hover

```css
.image-box img { transition: all 0.2s ease }
.image-box { position: relative }
.caption-box { position: absolute; top: 50%; transform: translateY(-50%); opacity: 0; transition: all 0.2s ease }
.image-box:hover .caption-box { opacity: 1; box-shadow: 0 0 5px 5px #bbb }
.caption-box h3 { border-bottom: 1px solid #333; padding-bottom: 0.5rem }
.caption-box p { padding-top: 0.5rem }
button { transition: all 0.2s ease }
button:hover { box-shadow: 0px 0px 5px 3px #ccc }
```

### [CodePen Challenge Image Hover](https://codepen.io/blackellis/pen/JjYbrLd)

made with: transition · :hover

```css
.fx-item { position: relative; box-shadow: 0 1px 13px 3px #607d8b }
.fx-info-wrap, .fx-info { position: absolute }
.fx-info-wrap { top: 20px; box-shadow: 0 0 0 20px rgba(255, 255, 255, 0.2), inset 0 0 3px #607d8b }
.fx-info > div { position: absolute; background-position: center center }
.fx-info .fx-info-front { transition: all 0.6s ease-in-out }
.fx-info .fx-info-back { opacity: 0; transform: scale(1.5); transition: all 0.4s ease-in-out 0.2s }
.fx-info h3 { text-transform: uppercase }
.fx-info p { border-top: 1px solid rgba(255, 255, 255, 0.5) }
.fx-item:hover .fx-info-front { transform: scale(0); opacity: 0 }
.fx-item:hover .fx-info-back { transform: scale(1); opacity: 1 }
```

### [CodePen Challenge: Image Hovers](https://codepen.io/jonathanedempsey/pen/yLYVXRO)

made with: @keyframes · :hover

```css
img:hover { animation: shake-horizontal 1s cubic-bezier(0.6, -0.28, 0.735, 0.045) infinite both }
p.reference { margin-top: 20px }
0%, 100% { transform: translateX(0) }
10%, 30%, 50%, 70% { transform: translateX(-10px) }
20%, 40%, 60% { transform: translateX(10px) }
80% { transform: translateX(8px) }
90% { transform: translateX(-8px) }
@keyframes shake-horizontal animates transform
```

### [Hover effect for link text](https://codepen.io/Chaldeok/pen/mdeEGxr)

made with: transition · :hover · clip-path

```css
.container a { position: relative; transition: background-position 370ms ease }
.container a:first-child { background-position: 100% }
.container a:first-child:hover { background-position: 0 100% }
.container a:nth-child(2)::before { position: absolute; top: 0; transition: width 370ms ease }
.container a:nth-child(3)::before { position: absolute; clip-path: polygon(0 0, 0 0, 0% 100%, 0 100%); transition: clip-path 370ms ease }
.container a:nth-child(3):hover::before { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%) }
.container a:last-child span { position: absolute; top: 0; transform: translateX(-100%); transition: transform 370ms ease }
.container a:last-child:hover span { transform: translateX(0) }
.container a:last-child span::before { transform: translateX(100%); transition: transform 370ms ease }
.container a:last-child:hover span::before { transform: translateX(0) }
```

### [Responsive Portfolio Navigation](https://codepen.io/dpkmos/pen/rNOLVyV)

on scroll: a.button: color, div.center: color, span.material-icons: color | on hover of a.button: a.button: color, div.center: color, span.material-icons: color | made with: @keyframes · :hover

```css
.button { position: relative }
.button span:not(.material-icons) { position: absolute; transform: translate(-50%, -50%); animation: animate 0.5s linear; animation-fill-mode: forwards }
from { opacity: 0.3 }
to { opacity: 1 }
@keyframes animate animates width, height, opacity
```

```js
addEventListener("mouseenter", (e) => {
addEventListener("mouseleave", () => {
```

### [Glitch Hover-Effect](https://codepen.io/Marty-Development/pen/RwWrwoN)

on scroll: div.glitch__img: transform+opacity+clip-path ×2, div.glitch__img: transform+opacity+clip-path+top, div.glitch__img: transform+opacity+top, span.: opacity | made with: @keyframes · :hover · clip-path

```css
.grid { position: relative }
.grid__item-title { position: absolute; top: 0 }
.grid__item-title span { position: relative; opacity: 0 }
.glitch:hover + .grid__item-title span { opacity: 1; animation: glitch-anim-text 0.5s linear }
.glitch { position: relative }
.glitch__img { position: absolute; top: calc(-1 * var(--gap-vertical)) }
.glitch__img:nth-child(n + 2) { opacity: 0 }
.glitch:hover .glitch__img:nth-child(n + 2) { opacity: 1 }
.glitch:hover .glitch__img:nth-child(2) { transform: translate3d(var(--gap-horizontal), 0, 0); animation: glitch-anim-1-horizontal var(--time-anim) infinite linear alternate }
.glitch:hover > .glitch__img:nth-child(3) { transform: translate3d(calc(-1 * var(--gap-horizontal)), 0, 0); animation: glitch-anim-2-horizontal var(--time-anim) infinite linear alternate }
.glitch:hover > .glitch__img:nth-child(4) { transform: translate3d(0, calc(-1 * var(--gap-vertical)), 0) scale3d(-1, -1, 1); animation: glitch-anim-3-horizontal var(--time-anim) infinite linear alternate }
.glitch:hover > .glitch__img:nth-child(5) { animation: glitch-anim-flash 0.4s steps(1, end) infinite }
```

### [#116 - Cool CSS Menu Hover Effects - Html5 Css3 Hover Effect Tutorial](https://codepen.io/rcks29c/pen/zYvOXaj)

on hover of li.: span.: color ×2, a.: color | made with: transition · :hover

```css
ul li a { text-transform: uppercase; position: relative }
ul li a span:first-child:before { position: absolute; top: 0; border-top: 2px solid #ff0; transition: .2s; opacity: 0 }
ul li a span:first-child:after { position: absolute; top: 0; border-top: 2px solid #ff0; transition: .2s; opacity: 0 }
ul li a span:last-child:before { position: absolute; bottom: 0; border-bottom: 2px solid #ff0; transition: .2s; opacity: 0 }
ul li a span:last-child:after { position: absolute; bottom: 0; border-bottom: 2px solid #ff0; transition: .2s; opacity: 0 }
ul li a:hover span:first-child:before { top: -10px; opacity: 1 }
ul li a:hover span:first-child:after { top: -10px; opacity: 1 }
ul li a:hover span:last-child:before { bottom: -10px; opacity: 1 }
ul li a:hover span:last-child:after { bottom: -10px; opacity: 1 }
```

### [Button with slide-in arrow hover-effect](https://codepen.io/Marty-Development/pen/wvaZddL)

on hover of a.btn: a.btn: color, span.: color | made with: transition · :hover

```css
.btn { transition: all 0.4s }
.btn span { position: relative; transition: 0.4s }
.btn span:after { position: absolute; opacity: 0; top: 0; transition: 0.4s }
.btn:hover span:after { opacity: 1 }
```

### [Ghost button with cool hover effect](https://codepen.io/t3premium/pen/dyoKPjO)

made with: transition · :hover

```css
.button { background-position: -60px -60px; text-transform: uppercase; transition: all .5s ease }
.button:hover { background-position: 0px 0px }
```

### [Hover effect](https://codepen.io/sunwoo123/pen/MWwQMdx)

on hover of button.button: button.button: color | made with: transition · :hover

```css
.c { margin-top: 50vh }
.button { transition: 0.8s; position: relative }
.button::before { position: absolute; transition: 0.8s }
.btn-1::before,.btn-3::before { top:0 }
.btn-2::before,.btn-4::before { bottom:0 }
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

### [Button Hover | Pure CSS](https://codepen.io/mrnathan8/pen/wvaJREX)

on scroll: a.btn: color | made with: transition · :hover

```css
.bg-image { position: absolute; inset: 0; filter: blur(0.5rem) }
.btn { text-transform: uppercase; position: relative; transition: all 0.6s ease }
.btn:before { position: absolute; top: 0; bottom: 0; transition: all 0.6s cubic-bezier(0.615, 0, 0.07, 1) }
.btn:after { position: absolute; top: 0.1em; bottom: 0 }
.btn:hover { transition: all 0.6s ease }
.btn:hover:before { transition: all 0.6s cubic-bezier(0.615, 0, 0.07, 1) }
```

### [Responsive Diagonal Photo Gallery](https://codepen.io/charleskitchton/pen/oNXZQOv)

made with: transition · :hover

```css
.container { padding-top: 50px }
.section1 { transform: skewY(-7deg) }
.section2 { transform: skewY(-7deg); padding-bottom: 20px }
.section3 { transform: skewY(-7deg); padding-bottom: 20px }
.section4 { transform: skewY(-7deg); padding-bottom: 20px }
.gallery img { transform: skewY(7deg) }
img { transition: transform .2s }
img:hover { transform: skewY(-7deg) }
.caption { transform: skewY(7deg) }
```

### [hover effect card](https://codepen.io/AmolVBharambe/pen/VwLmLEo)

made with: transition · :hover

```css
.featuredPropBox ul li { background-position: 50% 50%; position: relative; transition: all 0.3s }
.featuredPropBox ul li:after { position: absolute; top: 0; transition: all 0.3s }
.featuredPropBox ul li .fplogo { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: all 0.3s }
.featuredPropBox ul li .fptext { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: all 0.3s ease 0s }
.featuredPropBox ul li:hover { box-shadow: 0 0 0 25px rgba(0, 0, 0, 0.2) inset }
```

### [Efecto hover de fondo con CSS](https://codepen.io/jesustovar/pen/JjdKgeZ)

on scroll: a.arriba: color | on hover of a.derecha: a.derecha: color, a.arriba: color | made with: transition · :hover

```css
.derecha, .izquierda, .centro-horizontal { -moz-transition:all ease-in-out 300ms; -webkit-transition:all ease-in-out 300ms; -ms-transition:all ease-in-out 300ms; -o-transition:all ease-in-out 300ms; transition:all ease-in-out 300ms }
.derecha { background-position:left }
.izquierda { background-position:right }
.centro-horizontal { background-position:center }
.arriba, .abajo, .centro-vertical { -moz-transition:all ease-in-out 300ms; -webkit-transition:all ease-in-out 300ms; -ms-transition:all ease-in-out 300ms; -o-transition:all ease-in-out 300ms; transition:all ease-in-out 300ms }
.arriba { background-position:bottom }
.abajo { background-position:top }
.centro-vertical { background-position:center }
```

### [Image Hover Text Fade](https://codepen.io/melissamyra/pen/abOZrWP)

made with: transition · :hover

```css
.thumbnails { position: relative; transition: transform .3s }
.thumbnails img { object-position: 50% 20% }
.black { position: absolute; opacity: .7 }
.title { position: absolute }
.black, .title { transition: opacity .3s }
.thumbnails:hover { transform: scale(1.05) }
.thumbnails:hover .black, .thumbnails:hover .title { opacity: 0 }
```

### [Button Hover Effect with typed.js](https://codepen.io/tarun0706/pen/bGdezNe)

on hover of a.btn: a.btn: background | made with: transition · :hover

```css
.hover-section { position: absolute; top: 50%; transform: translate(-50%) }
.btn { box-shadow: 20px 20px 60px #c5a84a, -20px -20px 60px #ffe464; transition: all 0.9s ease; transition: all 0.5s ease }
.btn:hover { box-shadow: 20px 20px 60px #c5a84a, -20px -20px 60px #ffe464 }
```

### [Green Sock 3 : Business Card SVG Mask Shine](https://codepen.io/orange_wacko/pen/bGdpaRE)

on hover of div.card-wrap: div.card-wrap: transform+shadow+top, div.shine: transform+top | made with: clip-path · 3D (perspective / preserve-3d) · GSAP

```css
.card-wrap { position: relative; box-shadow: 0 10px 25px 0 rgba(27, 34, 52, 0.1) }
.card-front { top: 0; position: relative }
.card-front .shine { position: absolute; top: 0; opacity: 1; transform: translateX(100%) }
.card-front .mask { position: absolute; -webkit-clip-path: url(#frontMask); clip-path: url(#frontMask); top: 29px; -webkit-mask-size: cover; mask-size: cover }
```

```js
gsap.timeline()
gsap.to(".card-wrap", {duration: 0.45, transformStyle:"preserve-3d", scale: 1.1, boxShadow: "0px 80px 80px 3px rgba(27,34,52,0.4
gsap.fromTo(".card-front .shine", { x: frontCard.offsetWidth }, { duration: 1.85, x: -frontCard.offsetWidth, ease: "ease.out"})
gsap.to(".card-wrap", {duration: 0.25, transformStyle:"preserve-3d", scale: 1,boxShadow: "0px 10px 25px 0 rgba(27,34,52,0.2)", e
```

### [Neon Hover Effect](https://codepen.io/animationbro/pen/WNvQErj)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
canvas { position: absolute }
```

```js
requestAnimationFrame(neon)
addEventListener('mousemove', function(e) {
```

### [SCSS: Sliced Angular Background Effect on Hover](https://codepen.io/cnocon/pen/abOzEqO)

held: fixed nav.nav | on scroll: a.nav__link: color | on hover of li.nav__item: a.nav__link: color ×2 | made with: position: fixed · transition · :hover

```css
.nav { position: fixed; top: 0 }
.nav__list { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.nav__item { margin-bottom: 3rem }
.nav__link:link, .nav__link:visited { text-transform: uppercase; transition: all 0.4s }
.nav__link:link:hover, .nav__link:link:active, .nav__link:visited:hover, .nav__l { background-position: 100% }
```

### [SCSS: Animated Hover/Background Effect on Overlapping Images](https://codepen.io/cnocon/pen/abOzOLL)

made with: transition · :hover

```css
.composition { position: relative }
.composition__photo { box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, 0.4); position: absolute; transition: all 0.2s }
.composition__photo--p1 { top: -2rem }
.composition__photo--p2 { top: 2rem }
.composition__photo--p3 { top: 9rem }
.composition__photo:hover { transform: scale(1.05) translateY(-0.5rem); box-shadow: 0 2.5rem 4rem rgba(0, 0, 0, 0.5); outline-offset: 2rem }
.composition:hover .composition__photo:not(:hover) { transform: scale(0.9) }
```

### [Card Hover Interactions](https://codepen.io/hexagoncircle/pen/XWbWKwL)

made with: transition · :hover · (hover: hover) gate

```css
.card { position: relative; box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1), 0 2px 2px rgba(0, 0, 0, 0.1), 0 4px 4px rgba(0, 0, 0, 0.1), 0 8px 8px rgba(0, 0, 0, 0.1), 0 16px 16px rgba(0, 0, 0, 0.1) }
.card:before { position: absolute; top: 0; background-position: 0 0; transition: transform calc(var(--d) * 1.5) var(--e) }
.card:after { position: absolute; top: 0; transform: translateY(-50%); transition: transform calc(var(--d) * 2) var(--e) }
.content { position: relative; transition: transform var(--d) var(--e) }
.content > * + * { margin-top: 1rem }
.btn { margin-top: 1.5rem; text-transform: uppercase }
.btn:focus { outline-offset: 3px }
.card:after { transform: translateY(0) }
.content { transform: translateY(calc(100% - 4.5rem)) }
.content > *:not(.title) { opacity: 0; transform: translateY(1rem); transition: transform var(--d) var(--e), opacity var(--d) var(--e) }
.card:hover:before, .card:focus-within:before { transform: translateY(-4%) }
.card:hover:after, .card:focus-within:after { transform: translateY(-50%) }
```

### [Button Hover Effect](https://codepen.io/yazeed739/pen/zYxgMLY)

on hover of button.btn: button.: opacity+top | made with: transition

```css
#btn1, #btn2, #btn3 { position: absolute; top: 50%; transform: translate(-50%, -50%); -webkit-transition: 0.3s }
#div1 { opacity:0; position: absolute; -webkit-transition: all 0.2s ease-out }
#cont { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

### [Layered Banner Slideshow with Mouse Effect](https://codepen.io/chris_tudor/pen/vYEbVMa)

on scroll: div.layer: transform ×8, div.layer: transform+top ×4, div.slide: opacity ×2, div.layer: opacity ×2 | on hover of a.navbar-brand: div.layer: transform+top ×11, div.layer: opacity ×3, div.slide: opacity ×2, div.layer: transform | made with: @keyframes · transition · GSAP

```css
#contaianer { position: absolute; top: 0 }
.navbar { border-bottom: 1px solid #ddd; box-shadow: 0 3px 2px -2px rgba(200,200,200,0.2) }
.nav-link { text-transform: uppercase }
#wrapper { position: absolute; top: 50%; -webkit-transform: translate(-50%, -50%); -moz-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); -o-transform: translate(-50%, -50%); transform: translate(-50%, -50%) }
#wrapper .layer { position: absolute; background-position: center center }
.layer-2 { top: -80px; animation: zoomInFaster 24s linear infinite 0s; -o-animation: zoomInFaster 24s linear infinite 0s; -moz-animation: zoomInFaster 24s linear infinite 0s; -webkit-animation: zoomInFaster 24s linear infinite 0s }
.layer-3 { top: -116px; animation: zoomOut 24s linear infinite 0s; -o-animation: zoomOut 24s linear infinite 0s; -moz-animation: zoomOut 24s linear infinite 0s; -webkit-animation: zoomOut 24s linear infinite 0s }
.layer-3.right { top: -10px }
.layer-3.right-2 { top: -140px }
.layer-3.right-3 { top: -140px }
.lead-text { position: absolute; text-transform: uppercase; top: 25% }
.text-layer { top: 26%; margin-top: 0; text-transform: uppercase; animation: fadeInFromRight 6s linear infinite 0s; -o-animation: fadeInFromRight 6s linear infinite 0s; -moz-animation: fadeInFromRight 6s linear infinite 0s; -webkit-an }
```

### [Cool button borders hover effect](https://codepen.io/dpkmos/pen/povxVym)

made with: transition · :hover

```css
.button { text-transform: uppercase; position: relative }
.button::before, .button::after { position: absolute }
.button::before { top: 0; transition: width 0.2s linear }
.button::after { bottom: 0; transition: width 0.2s linear }
.button > span::before, .button > span::after { position: absolute; top: 0; transition: height 0.2s linear }
```

### [Hover with sliding effect](https://codepen.io/Ke_tones/pen/zYxpqwZ)

on hover of a.: a.: color | made with: transition · :hover

```css
a { position:relative }
a::before { position:absolute; top:0; transform:translatex(-100%); transition:all 0.5s }
a:hover::before { transform:translatex(0) }
```

### [Icon hover effect](https://codepen.io/_lacus/pen/LYEOLew)

on hover of a.: a.: color, i.im: color | made with: transition · :hover

```css
a { transition: text-shadow 0.333s ease-in, color 0.333s ease-in, transform 0.333s ease-in; transform: rotate(0turn) }
a:hover { transform: rotate(1turn) }
```

### [Painted Link hover effect](https://codepen.io/ElrONE/pen/oNgBEMW)

made with: transition · :hover

```css
a { transition: all .15s ease-out; position:relative; transition: all 0.3s ease-out }
a::before { position:absolute; bottom:-1px; transition: all .25s ease-out }
```

### [hover effect for blog](https://codepen.io/nguyencaotai1969/pen/eYYbMMd)

on hover of img.img-responsive: div.black_hover_block: transform+top | made with: transition · :hover

### [img overlay hover effect](https://codepen.io/nguyencaotai1969/pen/KKKboqP)

on hover of img.image: div.overlay: opacity | made with: transition · :hover

### [Fade from black and whit to colour on hover CSS ONLY](https://codepen.io/jordyvalentine/pen/ZEEVYXr)

made with: transition · :hover

```css
.bwfade { filter: gray; -webkit-filter: grayscale(1); -webkit-transition: all .8s ease-in-out }
.bwfade:hover { filter: none; -webkit-filter: grayscale(0); -webkit-transform: scale(1.0) }
```

### [Gradient button Hover Effects](https://codepen.io/xisach/pen/gOOQJqz)

made with: transition · :hover

```css
.container a { position: relative; text-transform: uppercase; transition: 0.5s }
.container a:hover { transform: translatey(-15px) }
.container a:after { position: absolute; top: 0 }
.container a:before { position: absolute; bottom: -20px; transform: scale(0); filter: blur(5px); transition: 0.5s }
.container a:hover:before { transform: scale(1); bottom: -15px }
```

### [Nav bar with active page highlighted and logo added](https://codepen.io/Thejayson/pen/oNNMrpR)

made with: :hover

```css
img { margin-top: 25px }
```

### [Simple nav bar with hover effect](https://codepen.io/Thejayson/pen/zYYLVKj)

made with: :hover

### [Simple Hover Effect Animation](https://codepen.io/Guille62/pen/yLLqQaz)

made with: transition · :hover

```css
.contenedor { position: relative; background-position: center; transition: all 0.9s }
.contenedor:before { position: absolute; top: 1em; transition: all 0.9s }
.contenedor:after { position: absolute; bottom: 1em; transition: all 0.9s }
.contenedor h1 { position: absolute; top: 0.5em; transform: translatex(-130%); transition: all 0.9s }
.contenedor p { position: absolute; top: 4em; transform: translatex(350%); transition: all 0.9s }
.contenedor:hover h1, .contenedor:hover p { transform: translatex(0%) }
```

### [Expand Social Links Menu - Pure CSS Hover Effect](https://codepen.io/rafaelavlucas/pen/NWWzyNW)

held: fixed div.about | made with: position: fixed · transition · :hover · backdrop-filter

```css
.about { position: fixed; bottom: 10px; transition: all 0.2s ease }
.about .bg_links { backdrop-filter: blur(5px); position: absolute }
.about .logo { background-position: 10px 7px; opacity: 0.9; transition: all 1s 0.2s ease; bottom: 0 }
.about .social { opacity: 0; bottom: 0 }
.about .social .icon { background-position: center; transition: all 0.2s ease, background-color 0.4s ease; opacity: 0 }
.about .social.portfolio { transition: all 0.8s ease }
.about .social.dribbble { transition: all 0.3s ease }
.about .social.linkedin { transition: all 0.8s ease }
.about:hover { transition: all 0.6s cubic-bezier(0.64, 0.01, 0.07, 1.65) }
.about:hover .logo { opacity: 1; transition: all 0.6s ease }
.about:hover .social { opacity: 1 }
.about:hover .social .icon { opacity: 0.9 }
```

### [Card Flip CSS Animation Hover](https://codepen.io/opheliafl/pen/rNNvZpL)

on scroll: div.card__side: transform ×2 | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
body { position: relative }
b, i, em, strong, h1, h2, h3, h4, h5, h6, th, td, pre, ins, del, address, input, { text-transform: inherit }
.card { perspective: 100rem; position: relative }
.card__side { position: absolute; top: 0; transition: all 700ms ease }
.card__side--back { transform: rotateY(180deg) }
.card:hover .card__side--front { transform: rotateY(-180deg) }
.card:hover .card__side--back { transform: rotateY(0) }
```

### [Bootstrap 4 card component in modern Design with hover effect - Freebootstrapui.com](https://codepen.io/girraj-ch/pen/XWWZQga)

made with: transition · :hover

```css
.single-feature { -webkit-transition: all 0.3s ease-in; -o-transition: all 0.3s ease-in; transition: all 0.3s ease-in }
.single-feature .icon { margin-bottom: 37px; position: relative }
.single-feature .icon::before { position: absolute; top: 3% }
.single-feature .icon::after { position: absolute; top: 0 }
.single-feature .content .title { text-transform: uppercase; margin-bottom: 15px }
.single-feature .content .link { text-transform: uppercase; margin-bottom: 0px; -webkit-transition: all 0.3s ease-in; -o-transition: all 0.3s ease-in; transition: all 0.3s ease-in }
.single-feature:hover { -webkit-transform: translateY(-10px); -ms-transform: translateY(-10px); transform: translateY(-10px) }
.single-feature .icon.one { -webkit-box-shadow: 0px 0px 0px 15px rgba(249, 49, 75, 0.2), 0px 0px 0px 15px rgba(249, 49, 75, 0.2); box-shadow: 0px 0px 0px 15px rgba(249, 49, 75, 0.2), 0px 0px 0px 15px rgba(249, 49, 75, 0.2); -webkit-transition: all  }
.single-feature:hover .icon.one { -webkit-box-shadow: 0px 0px 0px 15px rgba(249, 49, 75, 0.2), 0px 0px 0px 30px rgba(249, 49, 75, 0.2); box-shadow: 0px 0px 0px 15px rgba(249, 49, 75, 0.2), 0px 0px 0px 30px rgba(249, 49, 75, 0.2) }
.single-feature .icon.two { -webkit-box-shadow: 0px 0px 0px 15px rgba(246, 122, 31, 0.2), 0px 0px 0px 15px rgba(246, 122, 31, 0.2); box-shadow: 0px 0px 0px 15px rgba(246, 122, 31, 0.2), 0px 0px 0px 15px rgba(246, 122, 31, 0.2); -webkit-transition:  }
.single-feature:hover .icon.two { -webkit-box-shadow: 0px 0px 0px 15px rgba(246, 122, 31, 0.2), 0px 0px 0px 30px rgba(246, 122, 31, 0.2); box-shadow: 0px 0px 0px 15px rgba(246, 122, 31, 0.2), 0px 0px 0px 30px rgba(246, 122, 31, 0.2) }
.single-feature .icon.three { -webkit-box-shadow: 0px 0px 0px 15px rgba(188, 44, 221, 0.2), 0px 0px 0px 15px rgba(188, 44, 221, 0.2); box-shadow: 0px 0px 0px 15px rgba(188, 44, 221, 0.2), 0px 0px 0px 15px rgba(188, 44, 221, 0.2); -webkit-transition:  }
```

### [Image flip on hover - reveal content!](https://codepen.io/cu0dc5eddc34/pen/WNNZvpm)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.img_flip { perspective: 50em; transition: all .35s ease; position: relative; transform: translateZ(0) }
.img_flip img { vertical-align: top; transition: all .35s ease }
.img_flip figcaption { opacity: 0; position: absolute; top: 0; bottom: 0 }
.img_flip a { position: absolute; top: 0; bottom: 0 }
.img_flip:hover img { opacity: 0 }
.img_flip:hover figcaption { opacity: 1 }
.img_flip-hor figcaption { transform: rotateX(90deg) }
.img_flip-hor:hover img { transform: rotateX(-180deg) }
.img_flip-hor:hover figcaption { transform: rotateX(0deg) }
.img_flip-ver figcaption { transform: rotateX(90deg) }
.img_flip-ver:hover img { transform: rotateY(-180deg) }
.img_flip-ver:hover figcaption { transform: rotateY(0deg) }
```

### [PianoSolo Button Hover Effect](https://codepen.io/frontiersman/pen/jOOBYBg)

made with: transition · :hover

```css
button { position: relative; transition: all 0.2s ease }
button::before { transition: all 0.2s ease; position: absolute; top: 50%; transform: translateY(-50%) }
button:hover::before { transform: translate(-50%, -50%) }
```

### [Smooth Fill in Sharp Space](https://codepen.io/sextonko/pen/QWWdvBO)

made with: transition · :hover

```css
* { box-sizing: box-shadow }
.box-container { position: absolute }
.box-container .box { position: relative }
.box-container .box::before { position: absolute; transition: transform 300ms ease-in, border-bottom-left-radius 350ms ease-out 150ms, border-bottom-right-radius 250ms ease-out 150ms; transform: translate3d(0, -100%, 0) }
.box-container .box:hover::before { transition: transform 300ms ease-in, border-bottom-left-radius 350ms ease-out 150ms, border-bottom-right-radius 600ms ease-out 300ms; transform: translate3d(0, 0, 0) }
```

### [Hover-button](https://codepen.io/kesavaraj/pen/eYYBvzv)

made with: transition · :hover

```css
.button-container { position:absolute; top:50%; transform:translate(-50%,-50%) }
.button { -webkit-box-shadow: 0px 0px 16px -3px rgba(0,0,0,0.5); -moz-box-shadow: 0px 0px 16px -3px rgba(0,0,0,0.5); box-shadow: 0px 0px 16px -3px rgba(0,0,0,0.5) }
.btn { transition:0.5s }
.button-hover { position:absolute; top:8px; transition:0.5s }
.button:hover > .button-hover { top:0px }
```

### [Button Hover Effect](https://codepen.io/md-asaduzzaman-muhid/pen/yLLeGLK)

made with: @keyframes · transition · :hover

```css
.btn-swap { transition: all 0.3s; position: relative }
.btn-swap span { position: relative }
.btn-swap:after { position: absolute; transition: all 0.3s; top: 0 }
.btn-color-move { transition: all 0.3s; position: relative }
.btn-color-move span { position: relative }
.btn-color-move:hover:before { opacity: 1 }
.btn-color-move:hover:after { opacity: 1 }
.btn-color-move:before { position: absolute; -ms-transform: skewX(-20deg); -webkit-transform: skewX(-20deg); transform: skewX(-20deg); opacity: 1; top: 0; -moz-transition: all 0.7s cubic-bezier(0.77, 0, 0.175, 1); -o-transition: all 0.7s cubic-b }
.btn-color-move:after { position: absolute; -ms-transform: skewX(-20deg); -webkit-transform: skewX(-20deg); transform: skewX(-20deg); opacity: 0; top: 0; -webkit-transition: all 0.94s cubic-bezier(0.2, 0.95, 0.57, 0.99); -moz-transition: all 0. }
.btn-flip-3d { text-transform: uppercase; position: relative }
.btn-flip-3d span { transition: 0.5s }
.btn-flip-3d span:before { position: absolute; bottom: 0; transition: 0.5S; transform-origin: top; transform: rotateX(90deg) translateY(-50%) }
```

### [Lid Hover Effect](https://codepen.io/nabeelfaheem/pen/vYYLYoL)

made with: transition · :hover

```css
.lid { position: relative }
.lid::before { position: absolute; top: 0; bottom: 0; transform-origin: left bottom; transform: rotate(-180deg); transition: all .3s; -webkit-transition: all .3s; -moz-transition: all .3s; -ms-transition: all .3s; -o-transition: all .3 }
.lid:hover::before { transform: rotate(0); -webkit-transform: rotate(0); -moz-transform: rotate(0); -ms-transform: rotate(0); -o-transform: rotate(0) }
```

### [css button hover effect](https://codepen.io/arman_11/pen/dyyoxvN)

made with: transition · :hover

```css
h2 { margin-top: 20px; margin-bottom: 20px; text-transform: uppercase }
button { margin-top: 15px; margin-bottom: 15px; text-transform: uppercase; position: relative }
button.btn1 { text-transform: uppercase; position: relative }
button.btn1::before { position: absolute; top: 0; transition: all ease .6s }
button.btn1:active { transform: scale(0.95) }
button.btn2 { text-transform: uppercase; position: relative }
button.btn2::before { position: absolute; top: -100%; transition: all ease .6s }
button.btn2:hover::before, button.btn2:focus::before { top: 0 }
button.btn2:active { transform: scale(0.95) }
button.btn3 { text-transform: uppercase; position: relative }
button.btn3::before { position: absolute; top: 100%; transition: all ease .6s }
button.btn3:hover::before, button.btn3:focus::before { top: 0 }
```

### [Button mix #1](https://codepen.io/WojciechDuma/pen/RwwNXMy)

made with: @keyframes · transition · :hover

```css
.btn { position: relative }
.btn--1::before { position: absolute; bottom: 0; transform: translateX(-100%); transition: transform 0.5s }
.btn--1:hover::before { transform: translateX(0) }
.btn--2::before { position: absolute; top: 0; transform: translateX(100%); transition: transform 0.3s }
.btn--2::after { position: absolute; bottom: 0; transform: translateX(-100%); transition: transform 0.3s }
.btn--2:hover::before, .btn--2:hover::after { transform: translateX(0) }
.btn--3::before { position: absolute; bottom: 0; transform: scale(0); transition: transform 0.4s }
.btn--3::after { position: absolute; bottom: 0; transform: scale(0.5); transition: transform 0.4s }
.btn--3:hover::before { transform: scale(1) }
.btn--3:hover::after { transform: scale(1) translateY(-90px) }
.btn--4::after { position: absolute; bottom: 0; transform: translateX(-50%); transition: width 0.4s }
.btn--5::before { position: absolute; top: -2px; transition: all 0.4s }
```

### [Hover Effect Button](https://codepen.io/fman7/pen/XWWJeEq)

made with: transition · :hover

```css
.chevron-link-container { box-shadow: 0 1px 4px 0 rgba(24, 24, 22, 0.5); position: relative }
.chevron-link-container.color::before { position: absolute; bottom: 0; opacity: 0.25; transform: scale3d(0, 1, 1); transition: all 0.3s }
.chevron-link-container.color:hover::before { transform: scale3d(1, 1, 1) }
.chevron-link-container.color:active { transform: scale3d(0.99, 0.99, 0.99) }
.chevron-link-container .link-content { padding-top: 1em; padding-bottom: 1em }
.chevron-link-container .link-content .link-text { margin-top: 0; margin-bottom: 5px }
```

### [Cred App Like Tab Bar Interaction](https://codepen.io/singhimalaya/pen/YzzPZVe)

made with: position: fixed · transition · :hover

```css
nav { position: relative; transform: scale(1.8) }
nav a { position: relative }
nav a b { position: relative; top: 40px; transition: 0.3s ease top }
nav a i { position: relative; transition: 0.3s ease left }
nav span { position: absolute; top: 10px; bottom: 10px; transition: 0.3s ease left }
nav a:hover b { top: 0 }
#ytd-url { position: fixed; bottom: 0; box-shadow: 0 10px 20px -5px rgba(83, 88, 139, 0.3) }
```

### [Button #4](https://codepen.io/WojciechDuma/pen/NWWKjjv)

made with: transition · :hover

```css
.button { position: relative }
.btn-span::before { position: absolute; top: -2px; transition: transform 0.2s; transform: translateY(100%) }
.btn-span::after { position: absolute; top: -2px; transition: transform 0.2s 0.4s; transform: translateY(-100%) }
.button_4::before { position: absolute; top: -2px; transition: transform 0.2s 0.6s; transform: translateX(-100%) }
.button_4::after { position: absolute; bottom: -2px; transition: transform 0.2s 0.2s; transform: translateX(100%) }
.button_4:hover .btn-span::before { transform: translateY(0); transition: transform 0.2s 0.6s }
.button_4:hover .btn-span::after { transform: translateY(0); transition: transform 0.2s 0.2s }
.button_4:hover::before { transform: translateX(0); transition: transform 0.2s }
.button_4:hover::after { transform: translateX(0); transition: transform 0.2s 0.4s }
```

### [Button #3](https://codepen.io/WojciechDuma/pen/xxKvyoZ)

made with: transition · :hover

```css
.button_3 { position: relative }
.btn-span::before { position: absolute; top: -2px; transition: all 0.4s }
.btn-span::after { position: absolute; top: -2px; transition: all 0.4s }
.button_3::before { position: absolute; top: -2px; transition: all 0.4s }
.button_3::after { position: absolute; bottom: -2px; transition: all 0.4s }
.button_3:hover .btn-span::before { transform: translateX(-12px) }
.button_3:hover .btn-span::after { transform: translateX(12px) }
.button_3:hover::before { transform: translateY(-12px) }
.button_3:hover::after { transform: translateY(12px) }
```

### [Button #1](https://codepen.io/WojciechDuma/pen/yLBmYje)

made with: transition · :hover

```css
.button { position: relative }
.button_1::before { position: absolute; bottom: 0; transform: scale(0); transition: transform 0.4s }
.button_1::after { position: absolute; bottom: 0; transform: scale(0.5); transition: transform 0.4s }
.button_1:hover::after { transform: scale(1) }
.button_1:hover::before { transform: scale(1) translateY(-50px) }
```

### [Button #2](https://codepen.io/WojciechDuma/pen/YzKmyev)

made with: transition · :hover

```css
.button { position: relative }
.button_2::before { position: absolute; top: -2px; transition: all 0.4s }
.button_2::after { position: absolute; bottom: -2px; transition: all 0.4s }
```

### [Create Image Hover Effect Using HTML and CSS](https://codepen.io/ZaeemulHassan/pen/dybLKqm)

held: fixed footer | made with: position: fixed · transition · :hover

```css
.container { margin-top: 10% }
.image { position: relative }
.image img { transition: .5s }
.text { position: absolute; top: 0; transition: 0.4s }
.text h1 { position: absolute; top: 50%; transform: translateX(-50%) translateY(-50%) }
.text p { position: absolute; top: 60%; transform: translateX(-50%) translateY(-50%) }
.image:hover .text { transition: 0.5s }
.image:hover img { transform: scale(1.2); transition: 0.5s }
footer { bottom: 0; position: fixed }
```

### [CSS Pagination with Hover Effect](https://codepen.io/cssparadise/pen/WNeYjjp)

made with: transition · :hover

```css
button { background-position: 100% 0; transition: background-position .5s ease-in, font-size .2s ease-in }
button:hover { background-position: 0 0 }
.pagination-state { position: relative; top: -17px; transition: top .2s ease-in }
.pagination-state { top: -11px }
.pagination-state { top: -6px }
```

### [3D Layered Image Hover Effect Using CSS](https://codepen.io/ibrahimjabbari/pen/vYBjELG)

held: fixed div.youtubeBtn | on scroll: a.: color, i.fab: color | on hover of img.: img.screen: transform+opacity+top ×3, img.screen: transform+opacity, img.screen: transform+top, a.: color, i.fab: color | made with: position: fixed · @keyframes · transition · :hover

```css
.box { position: relative }
.box .screen { position: absolute; top:0; transition: 0.5s }
.box:hover .screen.screen5 { transform: translateY(-160px); opacity: 1 }
.box:hover .screen.screen4 { transform: translateY(-120px); opacity: .8 }
.box:hover .screen.screen3 { transform: translateY(-80px); opacity: .6 }
.box:hover .screen.screen2 { transform: translateY(-40px); opacity: .4 }
.box:hover .screen.screen1 { transform: translateY(0px); opacity: .2 }
.youtubeBtn { position: fixed; transform:translatex(-50%); bottom: 20px; transition: all .3s }
.youtubeBtn a { animation: youtubeAnim 1000ms linear infinite }
.youtubeBtn a:hover { transition:all .3s ease-in-out }
.youtubeBtn i:active { transform:scale(.9); transition:all .3s ease-in-out }
@keyframes youtubeAnim animates color
```

### [Sidebar Social Media With Hover Effect Using CSS & Font Awesome](https://codepen.io/ibrahimjabbari/pen/RwbyNwa)

held: fixed nav.social, fixed div.youtubeBtn | on scroll: a.: color, i.fab: color | on hover of li.: a.: color, i.fab: color | made with: position: fixed · @keyframes · transition · :hover

```css
.social { position: fixed; top: 20px }
.social ul { transform: translate(-270px,0) }
.social ul li { transition: all 1.5s }
.social ul li:hover { transform: translate(110px,0); transition: all 1.5s }
.social ul li:hover i { transform: rotate(360deg); transition: all 1.5s }
.social ul li i { transform: rotate(0deg) }
.youtubeBtn { position: fixed; transform:translatex(-50%); bottom: 20px; transition: all .3s }
.youtubeBtn a { animation: youtubeAnim 1000ms linear infinite }
.youtubeBtn a:hover { transition:all .3s ease-in-out }
.youtubeBtn i:active { transform:scale(.9); transition:all .3s ease-in-out }
@keyframes youtubeAnim animates color
```

### [Fractured text](https://codepen.io/Eslam_Refa3y/pen/MWgVjjx)

made with: transition · :hover · clip-path

```css
h1 { position: absolute; top: 50%; transform: translate(-50%, -50%) }
h1:before, h1:after { position: absolute; top: 0; transition: 0.3s }
h1:before { -webkit-clip-path: polygon(55% 0, 0 0, 0 100%, 35% 100%); clip-path: polygon(55% 0, 0 0, 0 100%, 35% 100%) }
h1:after { -webkit-clip-path: polygon(55% 0, 100% 0, 100% 100%, 35% 100%); clip-path: polygon(55% 0, 100% 0, 100% 100%, 35% 100%) }
h1:hover:before { top: -5px; transform: rotate(-5deg) }
h1:hover:after { top: 5px; transform: rotate(5deg) }
```

### [Splitted text on hover](https://codepen.io/Eslam_Refa3y/pen/aboYZVP)

made with: transition · :hover

```css
h1 { position: absolute; top: 50%; transform: translate(-50%, -50%); text-transform: uppercase }
h1:before { position: absolute; top: 0 }
h1:after { position: absolute; top: 0; transition: 0.5s; border-bottom: 0px solid #F00 }
h1:hover:after { border-bottom: 20px solid #FF0; top: -20px }
```

### [Content Box Hover Effect](https://codepen.io/Eslam_Refa3y/pen/pozLbjw)

on scroll: div.box: shadow, span.: transform, p.: transform+top | made with: transition · :hover

```css
.box { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: 0.5s }
.box p { transition: 0.5s; transform: scale(0.8) }
.box:before { position: absolute; top: 0; border-top: 2px solid #FFF; opacity: 0; transition: 0.5s }
.box:after { position: absolute; bottom: 0; border-bottom: 2px solid #FFF; opacity: 0; transition: 1.2s }
.box:hover:before, .box:hover:after { opacity: 1 }
.box:hover p { transform: scale(1) }
.box:hover { box-shadow: 0 25px 30px rgba(0, 0, 0, 0.5) }
.box span { position: absolute; top: 0; transition: 1s; transform: skewX(10deg) }
.box:hover span { transform: skewX(10deg) translateX(440%); transform: }
```

### [Hover Button](https://codepen.io/Eslam_Refa3y/pen/wvwmGLK)

made with: transition · :hover

```css
a { position: absolute; top: 50%; transform: translate(-50%, -50%); text-transform: uppercase; box-shadow: 0 15px 50px rgba(0,0,0,0.8) }
a:before { position: absolute; top: 0; transition: 0.5s }
a:after { position: absolute; top: 100%; transition: 0.5s }
a:hover:before { top: -100% }
a:hover:after { top: 0 }
```

### [Coolest Image w/text Hover Effect OG](https://codepen.io/cu0dc5eddc34/pen/OJLQqvW)

on hover of img.: img.: transform+opacity+top, h2.: transform+top | made with: transition · :hover

```css
figure.photo { position: relative; box-shadow: 0 0 5px rgba(0, 0, 0, 0.15) }
figure.photo * { -webkit-transition: all 0.4s ease-in-out; transition: all 0.4s ease-in-out }
figure.photo img { position: relative; opacity: 0.4 }
figure.photo figcaption { position: absolute; top: 0; bottom: 0 }
figure.photo h2 { position: absolute; -webkit-transform: skew(-10deg) rotate(-10deg) translate(0, -50%); transform: skew(-10deg) rotate(-10deg) translate(0, -50%); top: 50%; text-transform: uppercase }
figure.photo:before { top: 0; position: absolute; -webkit-transition: all 0.3s ease-in-out; transition: all 0.3s ease-in-out; -webkit-transform: rotate(110deg) translateY(-50%); transform: rotate(110deg) translateY(-50%) }
figure.photo a { top: 0; bottom: 0; position: absolute }
figure.photo:hover img, figure.photo.hover img { opacity: 1; -webkit-transform: scale(1.1); transform: scale(1.1) }
figure.photo:hover h2, figure.photo.hover h2 { -webkit-transform: skew(-10deg) rotate(-10deg) translate(-150%, -50%); transform: skew(-10deg) rotate(-10deg) translate(-150%, -50%) }
figure.photo:hover:before, figure.photo.hover:before { -webkit-transform: rotate(110deg) translateY(-150%); transform: rotate(110deg) translateY(-150%) }
```

### [tilting tiles on hover](https://codepen.io/gabydevdev/pen/XWrZNjg)

on hover of a.: div.thumb-bg: transform+top | made with: mix-blend-mode

```css
h4 { margin-top: 0; margin-bottom: 0 }
.grid-container .grid-item { margin-bottom: 8rem }
.grid-container .grid-item-inner, .grid-container .thumb { position: relative }
.grid-container .thumb-bg { position: relative; background-position: center center; filter: contrast(1.5) }
.grid-container .thumb-bg::before { position: absolute; top: 0; mix-blend-mode: color }
.grid-container .thumb-shadow { position: absolute; bottom: 30px; box-shadow: 0 35px 30px 0 rgba(0, 0, 0, 0.35) }
.grid-container .text { margin-top: 2rem }
.grid-container .text .cat { text-transform: uppercase }
```

### [Content box with hover effect css only](https://codepen.io/finbyz/pen/oNvpvQr)

on scroll: div.content-box: shadow | made with: @keyframes · transition · :hover

```css
.box-shadow { box-shadow: inset 10px 10px 8px -10px #CCC, inset -10px -10px 8px -10px #CCC }
.content-box { -webkit-transition: all 0.3s ease 0s; -moz-transition: all 0.3s ease 0s; transition: all 0.3s ease 0s }
.content-box:hover { box-shadow: 2px 2px 15px 0 rgba(135,135,135, 0.4); transition: all 0.5s ease 0s }
hr.lines { position: relative; border-top: 2px solid #0071bc; margin-top: 15px }
hr.lines:before { position: absolute; top: -11px; animation: pulse 2s infinite }
0% { -webkit-box-shadow: 0 0 0 0 rgba(70,118,250, 0.4) }
70% { -webkit-box-shadow: 0 0 0 20px rgba(70,118,250, 0) }
100% { -webkit-box-shadow: 0 0 0 0 rgba(70,118,250, 0) }
0% { -moz-box-shadow: 0 0 0 0 rgba(70,118,250, 0.4); box-shadow: 0 0 0 0 rgba(70,118,250, 0.4) }
70% { -moz-box-shadow: 0 0 0 20px rgba(70,118,250, 0); box-shadow: 0 0 0 20px rgba(70,118,250, 0) }
100% { -moz-box-shadow: 0 0 0 0 rgba(70,118,250, 0); box-shadow: 0 0 0 0 rgba(70,118,250, 0) }
@keyframes pulse animates -moz-box-shadow, box-shadow
```

### [Pure CSS Ripple Effect](https://codepen.io/jamesharmer/pen/NWKwXKJ)

made with: transition · :hover

```css
body { padding-top: 45vh }
button { background-position: center; text-transform: uppercase; transition: background 0.8s }
button:active { transition: background 0s }
```

### [Tilted Background on Hover](https://codepen.io/pleasedonotdisturb/pen/qBWXbwG)

made with: transition · :hover

```css
.container { position: relative; transition: .5s }
.container .card { position: relative }
.container .card::before { position: absolute; transition: .5s }
.container .card:hover::before { transform: rotate(10deg) }
.container .card .content h2 { margin-bottom: 5px }
.container .card .content a { margin-top: 15px }
```

### [Bootstrap-4 3D Tilt Hover Effects](https://codepen.io/mohammadalee/pen/MWgoeme)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.tiltBox { position: relative; background-position: center }
.tiltBox::after { position: absolute; top: 0 }
.tiltBox .tiltBox-info { position: relative; opacity: 0; transition: opacity 1s ease-in-out; -moz-transition: opacity 1s ease-in-out; -webkit-transition: opacity 1s ease-in-out; transform: translateZ(50px) scale(.8) }
.tiltBox:hover .tiltBox-info { opacity: 1.0; transition: opacity .55s ease-in-out; -moz-transition: opacity .55s ease-in-out; -webkit-transition: opacity .55s ease-in-out }
```

### [Map Animation only css](https://codepen.io/adefful46/pen/VwZpbXX)

on scroll: div.area: opacity, div.map: opacity | made with: @keyframes · transition · :hover

```css
.map { background-position: center; opacity: 0.7; transition: 2s }
.area { position: absolute; transition: 2s; opacity: 0 }
.area:hover { opacity: 0.8 }
.left-top:hover ~ .map { background-position: left top; opacity: 0.5 }
.right-top:hover ~ .map { opacity: 0.3; background-position: right top }
.left-bottom { top: 50% }
.left-bottom:hover ~ .map { background-position: left bottom; opacity: 0.6 }
.right-bottom { top: 50% }
.right-bottom:hover ~ .map { background-position: right bottom; opacity: 0.8 }
.center { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.center:hover ~ .map { opacity: 0.7; background-position: center }
.control { position: absolute; top: 40%; transform: translate(-50%, -50%); transition: 2s; animation: animate 3s ease-in-out forwards }
```

### [Flipping Card](https://codepen.io/Eslam_Refa3y/pen/gOYrxzV)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.cardBox { perspective: 500px }
.card { position: relative; transition: 1s; box-shadow: 0px 30px 30px rgb(0, 0, 0, 0.5) }
.card-front, .card-back { position: absolute; top: 0 }
.cardBox:hover .card { transform: rotateY(180deg) }
.card-back { transform: rotateY(180deg) }
```

### [Content Box Hover Effect](https://codepen.io/Eslam_Refa3y/pen/aboNyYY)

on scroll: div.box: shadow, span.: transform, p.: transform+top | made with: transition · :hover

```css
.box { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: 0.5s }
.box p { transition: 0.5s; transform: scale(0.8) }
.box:before { position: absolute; top: 0; border-top: 2px solid #FFF; opacity: 0; transition: 0.5s }
.box:after { position: absolute; bottom: 0; border-bottom: 2px solid #FFF; opacity: 0; transition: 1.2s }
.box:hover:before, .box:hover:after { opacity: 1 }
.box:hover p { transform: scale(1) }
.box:hover { box-shadow: 0 25px 30px rgba(0, 0, 0, 0.5) }
.box span { position: absolute; top: 0; transition: 1s; transform: skewX(10deg) }
.box:hover span { transform: skewX(10deg) translateX(440%); transform: }
```

### [Button Hover Effect #05](https://codepen.io/Eslam_Refa3y/pen/NWKNvvq)

made with: transition · :hover

```css
a { position: absolute; top: 50%; transform: translate(-50%, -50%); text-transform: uppercase; transition: 0.5 }
a:before { position: absolute; bottom: 0; transition: 1s; transform: rotate(360deg) }
a:hover:before { transform: rotate(40deg) }
a:hover { transition: 0.5s }
```

### [Button Hover Effect #04](https://codepen.io/Eslam_Refa3y/pen/QWLNMpj)

made with: transition · :hover

```css
.center { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.center a { text-transform: uppercase; transition: 0.5s }
.center a:before, .center a:after { position: absolute; top: 35%; transform: translate(-50%); opacity: 0; transition: 0.3s }
.center a:before { box-shadow: -100px 0 0 #FF0 }
.center a:after { box-shadow: 100px 0 0 #FF0 }
.center a:hover:after { opacity: 1; box-shadow: 50px 0 0 #FF0 }
.center a:hover:before { opacity: 1; box-shadow: -50px 0 0 #FF0 }
span { position: absolute; top: 0; transform: scale(0); transition: 0.3s; opacity: 0; box-shadow: 0 10px 15px rgba(0, 0, 0, 0.5) }
.center a:hover span { opacity: 1; transform: scale(1) }
```

### [A 3D Button Hover Effect #03](https://codepen.io/Eslam_Refa3y/pen/XWrdajR)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.center { position: absolute; top: 50%; transform: translate(-50%, -50%) }
a { text-transform: uppercase }
a span { position: relative; perspective: 300px }
a span:nth-child(1):before { position: absolute; top: 0; transform-origin: top; transform: rotateX(90deg) translateY(-50%); transition: 0.5s }
a:hover span:nth-child(1):before { transform: rotateX(0deg) translateY(0) }
a span:nth-child(2):before { position: absolute; top: 0; transform-origin: bottom; transform: rotateX(90deg) translateY(50%); transition: 0.5s }
a:hover span:nth-child(2):before { transform: rotateX(0deg) translateY(0) }
a span:nth-child(1):after { position: absolute; top: 0; transform-origin: bottom; transform: rotateX(0deg) translateY(0%); transition: 0.5s }
a:hover span:nth-child(1):after { transform: rotateX(90deg) translateY(50%) }
a span:nth-child(2):after { position: absolute; top: 0; transform-origin: top; transform: rotateX(0deg) translateY(0%); transition: 0.5s }
a:hover span:nth-child(2):after { transform: rotateX(90deg) translateY(-50%) }
```

### [Button Hover Effect #03](https://codepen.io/Eslam_Refa3y/pen/gOYrxrq)

made with: transition · :hover · mix-blend-mode

```css
a { position: absolute; top: 50%; transform: translate(-50%, -50%); text-transform: uppercase }
a:before, a:after, span:before, span:after { position: absolute; transition: 1s; mix-blend-mode: hue }
a:before { top: -2px }
a:after { top: -2px }
span:before { bottom: -2px }
span:after { bottom: -2px }
```

### [Button Hover Effect #02](https://codepen.io/Eslam_Refa3y/pen/GRKZJgp)

made with: transition · :hover

```css
a { position: absolute; top: 50%; transform: translate(-50%,-50%); text-transform: uppercase }
a:hover:before { top: 0 }
a:hover:after { top: -100% }
a:before { position: absolute; top: 100%; transition: 0.7s }
a:after { position: absolute; top: 0; transition: 0.7s }
```

### [Link/button hover effect 3](https://codepen.io/cu0dc5eddc34/pen/NQyqYo)

made with: transition · :hover

```css
a { position: relative }
a::before { position: absolute; top: 0; bottom: 0; transform-origin: center top; transform: scaleY(0); transition: transform .25s ease-in-out }
a:hover::before { transform-origin: center bottom; transform: scaleY(1) }
```

### [Link hover effect 2 - Use a lot](https://codepen.io/cu0dc5eddc34/pen/rXJaYQ)

made with: transition · :hover

```css
a { position: relative; transition: .25s ease-out }
a::after { position: absolute; bottom: 0; transform: scaleX(0); transition: transform .25s ease-out }
a:hover::after { transform: scaleX(1) }
```

### [Link hover effect 1](https://codepen.io/cu0dc5eddc34/pen/wVpbgE)

made with: transition · :hover

```css
a { position: relative }
a::before { position: absolute; top: 0; transition: .2s; transform: skew(1deg, 1deg) }
a:hover::before, a:focus::before { transform: skew(-1deg, -1deg) }
```

### [Quote Interface](https://codepen.io/Shubham_Chawade/pen/WVEdXW)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.box { position:absolute; top:50%; transform:translate(-50%, -50%); perspective: 2000px; transition: .5s }
.box::before { position:absolute; border-top:20px solid #fff; transition:.5s }
.box::after { position:absolute; border-bottom:20px solid #fff; transition: .5s }
.box:hover { transform: translate(-50%, -50%) rotateY(-30deg) skewY(5deg); transition: .5s }
.box .text { position:absolute; top:30px; transition: .5s }
.box:hover .text { transform: rotateY(30deg) skewY(-5deg); transition:.5s }
.box .text div { position: absolute; top:50%; transform: translateY(-50%) }
.box .fa.fa1 { position:absolute; top:0 }
.box .fa.fa2 { position:absolute; bottom:0 }
```

### [Mobile layered](https://codepen.io/nithin1412/pen/gVWjGo)

made with: transition · :hover

```css
.container { position: relative; margin-top:150px; transform:rotate(-30deg) skew(25deg) scale(0.8); transition: 0.5s }
.container img { position:absolute; transition: 0.5s }
.container:hover img:nth-child(4) { transform: translate(160px , -160px); opacity:1 }
.container:hover img:nth-child(3) { transform: translate(120px , -120px); opacity:0.8 }
.container:hover img:nth-child(2) { transform: translate(80px , -80px); opacity:0.6 }
.container:hover img:nth-child(1) { transform: translate(40px , -40px); opacity:0.4 }
```

### [card hover effect — week 30/52](https://codepen.io/knyttneve/pen/gVgbrb)

on hover of img.: img.: transform+filter+top, div.book__review: transform+opacity+top | made with: transition · :hover

```css
.genre { transition: 0.3s }
.book { position: relative }
.book__cover { position: relative }
.book__cover:before { position: absolute; bottom: 0 }
.book__cover > img { transition: 1s }
.book__inner { box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); position: relative }
.book__content { margin-top: auto }
.book__inner:hover > .book__cover > img { transform: scale(1.2); filter: grayscale(80%) opacity(0.3) }
.book__review { box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); top: 20px; position: absolute; opacity: 0; transform: translateY(-50px); transition: 0.3s }
.book__inner:hover .book__review { opacity: 1; transform: none }
```

### [Buttons CSS Hover Effect](https://codepen.io/rafaelavlucas/pen/rXMRwz)

held: fixed div.about | on hover of a.bg_links: a.bg_links: opacity+top ×2, span.icon: opacity+top ×2, a.bg_links: opacity ×2, span.icon: opacity | made with: position: fixed · transition · :hover · backdrop-filter

```css
.about { position: fixed; bottom: 10px; transition: all 0.2s ease }
.about .bg_links { backdrop-filter: blur(5px); position: absolute }
.about .logo { background-position: 10px 7px; opacity: 0.9; transition: all 1s 0.2s ease; bottom: 0 }
.about .social { opacity: 0; bottom: 0 }
.about .social .icon { background-position: center; transition: all 0.2s ease, background-color 0.4s ease; opacity: 0 }
.about .social.portfolio { transition: all 0.8s ease }
.about .social.dribbble { transition: all 0.3s ease }
.about .social.linkedin { transition: all 0.8s ease }
.about:hover { transition: all 0.6s cubic-bezier(0.64, 0.01, 0.07, 1.65) }
.about:hover .logo { opacity: 1; transition: all 0.6s ease }
.about:hover .social { opacity: 1 }
.about:hover .social .icon { opacity: 0.9 }
```

### [Marquee Hover State](https://codepen.io/johndownie/pen/WVbepM)

on scroll: span.hover-marquee__text: transform ×12 | on hover of a.: span.hover-marquee__text: transform ×12 | made with: @keyframes · transition · :hover

```css
.panel { margin-bottom: 60px }
.panel a { position: relative; padding-bottom: 80% }
.panel a .image { background-position: center; padding-bottom: 80%; position: absolute; transition: transform 5s ease-in-out }
.panel a:hover .image { transform: scale(1.1) }
.panel a:hover .hover-overlay { opacity: 1 }
.hover-overlay { position: absolute; opacity: 0; transition: opacity 0.6s }
.hover-marquee { position: relative; top: 50%; transform: translateY(-50%) }
.hover-marquee__text { text-transform: uppercase; -webkit-animation: marquee 7s linear infinite; animation: marquee 7s linear infinite }
0% { transform: translate(0, 0) }
100% { transform: translate(-100%, 0) }
0% { transform: translate(0, 0) }
100% { transform: translate(-100%, 0) }
```

### [CSS Hover Lines](https://codepen.io/johndownie/pen/MMMGOL)

made with: transition · :hover

```css
.box { position: relative }
.box:before { position: absolute }
.box__content { transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1) }
.hover-lines { border-bottom: 2px solid white; bottom: 0; position: absolute; transform: translate3d(-50%, 0, 0); transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1) 340ms, height 0.2s cubic-bezier(0.25, 0.25, 0.75, 0.75) 145ms, bord }
.hover-lines:before, .hover-lines:after { position: absolute; top: 0; transition: width 150ms cubic-bezier(0.25, 0.25, 0.75, 0.75) 0s }
.box:hover .box__content { transform: translate(0, -1.4rem) }
.box:hover .hover-lines { transition: width 150ms cubic-bezier(0.25, 0.25, 0.75, 0.75), height 0.2s cubic-bezier(0.25, 0.25, 0.75, 0.75) 145ms, border-left-width 0s cubic-bezier(0.25, 0.25, 0.75, 0.75) 145ms, border-right-width 0s cubic-bezier(0. }
.box:hover .hover-lines:before, .box:hover .hover-lines:after { transition: width 0.5s cubic-bezier(0.19, 1, 0.22, 1) 340ms }
```

### [menu animation](https://codepen.io/mukeshprajapati/pen/KjYKgo)

on scroll: a.nav-item: color+top | on hover of a.nav-item: a.nav-item: color | made with: transition · :hover

```css
.nav { position: relative; box-shadow: 0 10px 40px rgba(159, 162, 177, 0.8) }
.nav-item { transition: 0.3s; position: relative }
.nav-item:before { position: absolute; bottom: -6px; opacity: 0; transition: 0.3s }
.nav-item:not(.is-active):hover:before { opacity: 1; bottom: 0 }
.nav-indicator { position: absolute; bottom: 0; transition: 0.4s }
```

### [Menu with corner border hover effect](https://codepen.io/DAponte1/pen/zVaNyX)

made with: transition · :hover

```css
.snip1241 { text-transform: uppercase }
.snip1241 * { -webkit-transition: all 0.35s ease; transition: all 0.35s ease }
.snip1241 a { position: relative }
.snip1241 a:before, .snip1241 a:after { position: absolute; -webkit-transition: all 0.35s ease; transition: all 0.35s ease; opacity: 0 }
.snip1241 a:before { top: 0; border-top: 3px solid #f231f2; -webkit-transform: translate(-100%, 50%); transform: translate(-100%, 50%) }
.snip1241 a:after { bottom: 0; border-bottom: 3px solid #6efdfd; -webkit-transform: translate(100%, -50%); transform: translate(100%, -50%) }
.snip1241 a:hover:before, .snip1241 .current a:before, .snip1241 a:hover:after,  { -webkit-transform: translate(0%, 0%); transform: translate(0%, 0%); opacity: 1 }
```

### [Button CSS Hover Effect + JS Interaction](https://codepen.io/rafaelavlucas/pen/WqJyXr)

held: fixed div.about | on hover of a.bg_links: a.bg_links: opacity+top ×2, span.icon: opacity+top ×2, a.bg_links: opacity ×2, span.icon: opacity | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter

```css
.about { position: fixed; bottom: 10px; transition: all 0.2s ease }
.about .bg_links { backdrop-filter: blur(5px); position: absolute }
.about .logo { background-position: 10px 7px; opacity: 0.9; transition: all 1s 0.2s ease; bottom: 0 }
.about .social { opacity: 0; bottom: 0 }
.about .social .icon { background-position: center; transition: all 0.2s ease, background-color 0.4s ease; opacity: 0 }
.about .social.portfolio { transition: all 0.8s ease }
.about .social.dribbble { transition: all 0.3s ease }
.about .social.linkedin { transition: all 0.8s ease }
.about:hover { transition: all 0.6s cubic-bezier(0.64, 0.01, 0.07, 1.65) }
.about:hover .logo { opacity: 1; transition: all 0.6s ease }
.about:hover .social { opacity: 1 }
.about:hover .social .icon { opacity: 0.9 }
```

### [Hover Effect Using Clip-Path](https://codepen.io/dhavidyluiz/pen/RzpvEz)

made with: clip-path · pointer / mouse tracking

```css
h1 { position: absolute; top: 50%; transform: translate(-50%, -50%) }
#hoverEffect { clip-path: polygon(0 0, 0 0, 50% 100%, 0 100%) }
```

```js
addEventListener('mousemove', function(e){
```

### [Tabable Hover for Inline Image Gallery](https://codepen.io/travis_john/pen/GbWNma)

held: fixed div.credit | on hover of img.img-fluid: img.img-fluid: transform+top, div.overlay: opacity, h2.: transform+top, a.info: transform+opacity | made with: position: fixed · transition · :hover

```css
.row { padding-top: 3rem }
.hover-effect { position: relative }
.hover-effect .overlay { position: absolute; top: 0; opacity: 0; -webkit-transition: all 0.4s ease-in-out; transition: all 0.4s ease-in-out }
.hover-effect img { position: relative; -webkit-transition: all 0.4s linear; transition: all 0.4s linear }
.hover-effect h2 { text-transform: uppercase; position: relative; -webkit-transform: translatey(-100px); -ms-transform: translatey(-100px); transform: translatey(-100px); -webkit-transition: all 0.2s ease-in-out; transition: all 0.2s ease- }
.hover-effect .info { text-transform: uppercase; opacity: 0; filter: alpha(opacity=0); -webkit-transition: all 0.2s ease-in-out; transition: all 0.2s ease-in-out }
.hover-effect .info:hover { box-shadow: 0 0 5px #fff }
.hover-effect.active img { -ms-transform: scale(1.2); -webkit-transform: scale(1.2); transform: scale(1.2) }
.hover-effect.active .overlay { opacity: 1; filter: alpha(opacity=100) }
.hover-effect.active h2 { opacity: 1; filter: alpha(opacity=100); -ms-transform: translatey(0); -webkit-transform: translatey(0); transform: translatey(0) }
.hover-effect.active .info { opacity: 1; filter: alpha(opacity=100); -ms-transform: translatey(0); -webkit-transform: translatey(0); transform: translatey(0) }
.credit { position: fixed; bottom: 2%; text-transform: uppercase }
```

### [Button Hover Effect with CSS Transitions](https://codepen.io/rafaelavlucas/pen/wLKoJN)

held: fixed div.about | on scroll: button.btn: color+shadow, span.: color | made with: position: fixed · transition · :hover · backdrop-filter

```css
.about { position: fixed; bottom: 10px; transition: all 0.2s ease }
.about .bg_links { backdrop-filter: blur(5px); position: absolute }
.about .logo { background-position: 10px 7px; opacity: 0.9; transition: all 1s 0.2s ease; bottom: 0 }
.about .social { opacity: 0; bottom: 0 }
.about .social .icon { background-position: center; transition: all 0.2s ease, background-color 0.4s ease; opacity: 0 }
.about .social.portfolio { transition: all 0.8s ease }
.about .social.dribbble { transition: all 0.3s ease }
.about .social.linkedin { transition: all 0.8s ease }
.about:hover { transition: all 0.6s cubic-bezier(0.64, 0.01, 0.07, 1.65) }
.about:hover .logo { opacity: 1; transition: all 0.6s ease }
.about:hover .social { opacity: 1 }
.about:hover .social .icon { opacity: 0.9 }
```

### [Flowing hover animation CSS + SVG](https://codepen.io/tiiarautavesi/pen/GbJGpB)

on scroll: div.dot: opacity ×8 | made with: @keyframes · transition · :hover

```css
.content { position: absolute }
.dot { position: absolute; opacity: 0; animation: blink 4s infinite; transition: all 1s }
.dot:nth-child(2) { animation-delay: 0.1s }
.dot:nth-child(3) { animation-delay: 0.2s }
.dot:nth-child(4) { animation-delay: 0.3s }
.dot:nth-child(5) { animation-delay: 0.4s }
.dot:nth-child(6) { animation-delay: 0.5s }
.dot:nth-child(5) { animation-delay: 0.6s }
.dot:nth-child(6) { animation-delay: 0.7s }
.bug1:hover { animation: bounce1 2s ease }
.bug2:hover { animation: bounce2 2s ease }
0% { transform: scale(1) }
```

### [Card Button](https://codepen.io/prasad-d/pen/JQopgw)

on scroll: div.card: shadow, div.text: background+color | made with: transition · :hover

```css
body .card { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.card { box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25); position: relative; transition: 0.3s all ease-in-out }
.card > div { transition: 0.3s all ease-in-out }
.card .icon { box-shadow: 5px 0px 12px -4px rgba(0, 0, 0, 0.5) }
.card .badge { position: absolute; box-shadow: inset 0px 0px 6px 6px #E0E0E0; top: -10px }
.card:hover { box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5) }
```

### [Simple Hover effect HTML\CSS](https://codepen.io/IbrahemTaha/pen/xNvqrW)

on hover of div.cards: div.card: transform+shadow+top | made with: transition · :hover

```css
.cards { margin-top:50px }
.card { position: relative; transition: 1s }
h3 { position: absolute; top:30% }
.card:hover { transform: scale(1.1); box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2); transform: translate(0, -8%) }
```

### [Custom cursor hover effect](https://codepen.io/ihelai/pen/vwPMYE)

made with: transition · :hover · GSAP

```css
h1 { position: absolute; top: 40% }
#cursor { position: absolute; transition: all 0.2s ease }
.yellow { opacity: 0 }
```

### [Pure CSS Flat Button With Smooth Animated Hover Effect](https://codepen.io/mahmudulhrabby/pen/KLRovM)

made with: transition · :hover

```css
.button { position: relative; transition: color .3s }
.button:after { position: absolute; top: 100%; transition: transform .3s }
.button:hover::after { transform: translateY(-100%); transition: transform .3s }
```

### [Hover Effect Animation](https://codepen.io/Barrydreamt/pen/NVyKaW)

made with: transition · :hover

```css
div.effect-one figcaption::before { position: absolute; top: 0; opacity: 0; transform: translate3d(0,20%,0) }
div.effect-one h1 { position: absolute; top: 50%; transition: transform 0.25s, color 0.25s; transform: translate3d(0,-20%,0); text-transform: uppercase; opacity: 0.7 }
div.effect-one:hover h1 { transform: translate3d(0,-50%,0) translate3d(0,-40px,0) }
div.effect-one figcaption::before { transition: opacity 0.25s, transform 0.25s }
div.effect-one:hover figcaption::before { opacity: 1; transform: translate3d(0,0,0) }
```

### [Hover Over Background & Text Color Change Effect](https://codepen.io/Barrydreamt/pen/YbrLRR)

made with: :hover

```css
.text { text-transform: uppercase; padding-top: 15% }
```

### [Card hover effect only css for gallary](https://codepen.io/finbyz/pen/BeZamb)

made with: transition · :hover

```css
.card { position: relative; box-shadow:0 2px 10px rgba(0,0,0,.2) }
.card:before, .card:after { position: absolute; top: 0; transition: 0.5s }
.card:hover:before { transform: rotate(20deg); box-shadow: 0 2px 20px rgba(0,0,0,.2) }
.card:hover:after { transform: rotate(10deg); box-shadow: 0 2px 20px rgba(0,0,0,.2) }
.card .imgBx { position: absolute; top: 10px; bottom: 10px; transition: 0.5s }
.card:hover .imgBx { bottom: 80px }
.card .imgBx img { position: absolute; top: 0 }
.card .details { position: absolute; bottom: 10px }
.card .details h2 { text-transform: uppercase }
.card .details h2 span { margin-top: 5px }
```

### [Checkbox Style Using HTML And CSS No JavaScript and J Query](https://codepen.io/ajaygorecha/pen/wbdOwY)

made with: transition

```css
input { position: relative }
input:after { position: absolute; top: 0 }
input:before { position: absolute; top: 2px; transition: all 0.3s linear; border-top: 0; opacity: 0 }
input:checked:before { opacity: 1; transform: rotate(45deg) }
```

### [Card design with background-image zoom effect](https://codepen.io/antoniolee/pen/arOyjX)

made with: transition · :hover

```css
* { transition: 0.33s ease all }
div.card { box-shadow: 0 8px 16px rgba(0, 0, 0, 0.45) }
div.card div.card-img-container { position: relative }
div.card div.card-img { transition: 0.45s ease all; background-position: center }
div.card div.card-img span { text-transform: uppercase; position: relative }
div.card div.card-img h1 { position: relative }
div.card div.card-body p > b { margin-bottom: 15px }
div.card div.card-body div.card-link a { text-transform: uppercase }
```

### [button-style](https://codepen.io/create_vc/pen/WWVvjQ)

on hover of button.iocn_btn: button.iocn_btn: background+shadow | made with: transition · :hover

```css
button { position: relative; transition: 0.5s }
.style_1 button { box-shadow: 1px 1px #2178a4, 2px 2px #2178a4, 3px 3px #2178a4 }
.style_1 button:hover { box-shadow: 1px 1px #469eca, 2px 2px #469eca, 3px 3px #469eca; transition: 0.5s }
.style_1 span { position: absolute; top: 0 }
.style_2 button:hover { transition: 0.5s }
.style_2 span { position: absolute; top: 0 }
.style_3 button:hover { transition: 0.5s }
.style_3 span { position: absolute; top: 4px }
.style_4 button:before { position: absolute; top: 5px; transition: 0.5s }
.style_4 button:hover::before { top: -5px; transition: 0.5s }
.style_5 button { box-shadow: 6px 0px 0px rgba(0, 0, 0, 0.4), -6px 0px 0px rgba(0, 0, 0, 0.4) }
.style_5 span { position: absolute; top: 0 }
```

### [Hover effect for refs](https://codepen.io/vovaparamonov/pen/VNNmJK)

made with: transition · :hover

```css
header { box-shadow: 3px 3px 10px gray }
.header { box-shadow: 3px 0px 20px #1f063d, 1px 0px 20px #1f063d }
nav { position: absolute; top: 30%; transform: translate(-55%, -50%) }
a { position: absolute; transition: 0.5s }
li:hover > a:nth-child(1) { transform: translate(0px, -3px) }
li:hover > a:nth-child(2) { transform: translate(8px, -8px); opacity: 0.6 }
li:hover > a:nth-child(3) { transform: translate(-8px, 8px); opacity: 0.3 }
```

### [Pubg with Pan & Helmet Pure Css](https://codepen.io/AbdesCode/pen/ROOWoL)

made with: transition · :hover

```css
* { transition: .4s }
.pubg-box { position: relative }
.pubg-box .head { position: relative; margin-top: 80px; transition: .4s }
.pubg-box:hover .head { transform: rotate(-8deg) }
.pubg-box .head .helmet { position: absolute; top: 20px; transform: rotate(15deg); box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3) }
.pubg-box .head .helmet:before { position: absolute; top: 59% }
.pubg-box .head .front-helmet { position: absolute; top: 25%; transform: rotate(15deg); box-shadow: 6px 4px 6px rgba(0, 0, 0, 0.2); transition: 0.5s }
.pubg-box .head .front-helmet:before { position: absolute; top: 0 }
.pubg-box .head .front-helmet .glass { margin-top: 15px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); position: relative }
.pubg-box .head .front-helmet .glass:before { position: absolute; top: 0 }
.pubg-box .head .front-helmet .glass:after { position: absolute; top: 20px }
.pubg-box .head .front-helmet .glass .light1 { transform: skew(-12deg); transition: 0.5s }
```

### [Animation Sidenav](https://codepen.io/EneergeticTomy/pen/WWmOjW)

made with: @keyframes · transition · :hover

```css
body { opacity: 1; transition: 2s }
.sidenav { box-shadow: 2px 3px 19px #004cf0; position: absolute; top: 50%; transform: translate(-50%, -50%); transition: 2s }
.active { transition: 2s }
.fa-wifi { position: absolute; top: 13%; transform: translate(-50%, -50%); opacity: 0.9; transition: 1s }
.fa-wifi:hover { transition: 1s; animation: myWifi 1.1s linear infinite }
0% { opacity: 1 }
50% { opacity: 0.1 }
100% { opacity: 1 }
.fa-check-square { position: absolute; top: 23%; transform: translate(-50%, -50%); opacity: 0.9; transition: 1s; transform: rotateX(0deg) }
.fa-check-square:hover { transition: 1s; transform: rotateX(360deg) }
.fa-cog { position: absolute; top: 38.5%; transform: translate(-50%, -50%); opacity: 0.9; transition: 2s; transform: rotate(0deg) }
.fa-cog:hover { transition: 1s; transform: rotate(200deg) }
```

### [Hover Effect](https://codepen.io/EneergeticTomy/pen/xeMRwK)

made with: @keyframes · transition · :hover

```css
body { opacity: 1; transition: 3s }
li a { transition: width 3s; transition: 3s }
li a:hover { transition: 3s }
.navigation { position: absolute; top: 52%; transform: translateX(-50%) translateY(-50%) }
.animated-link::after { transition: width 1s; margin-top: 5px }
.animated-link:hover::after { transition: width 1s }
.dropdown { position: absolute; top: 15%; transform: translateX(-50%) translateY(-50%); margin-top: -400px; transition: 2s; box-shadow: 3px 3px 19px #14c2eb; animation: myColors 10s linear infinite }
0% { background-position: 0% 50% }
50% { background-position: 100% 50% }
100% { background-position: 0% 50% }
.active { transition: 2s; margin-top: 0px }
.class-drp:hover { animation: mymove 1.5s linear }
```

### [SIMPLE TEXT EFFECT](https://codepen.io/bindprince_1/pen/dLRqBm)

on scroll: span.: color+top ×9 | on hover of li.: span.: color ×9, li.: transform+opacity+filter+top ×2, div.link-text: transform+top | made with: @keyframes · transition · :hover · 3D (perspective / preserve-3d)

```css
.character-effects .letter-effect { top: 100px }
.character-effects .change-text { border-bottom: 4px solid #FFF }
.second-effect .shadow-effect.character .vanish-charac ul li { filter: blur(0px) }
.second-effect .shadow-effect.character .vanish-charac ul li:hover { animation: shadow 2s linear forwards }
0% { transform: rotate(0deg) translateY(0px); opacity: 1; filter: blur(1px) }
100% { transform: rotate(45deg) translateY(-200px); opacity: 0; filter: blur(20px) }
.second-effect .shadow-effect .vanish ul:hover li { animation: shadow 2s linear forwards }
.second-effect .shadow-effect .vanish ul li { filter: blur(0px) }
.second-effect .shadow-effect .vanish ul li:nth-child(1) { animation-delay: 0s }
.second-effect .shadow-effect .vanish ul li:nth-child(2) { animation-delay: 0.4s }
.second-effect .shadow-effect .vanish ul li:nth-child(3) { animation-delay: 0.8s }
.second-effect .shadow-effect .vanish ul li:nth-child(4) { animation-delay: 1.2s }
```

### [growing balls on hover menu like stuff - css only](https://codepen.io/szudi/pen/eoRKYg)

made with: transition · :hover

```css
div { position: relative; transition: all ease-in-out 1s }
div:hover { filter: hue-rotate(0.25turn) }
```

### [Color Hack](https://codepen.io/gazishowrav/pen/vMxYQR)

on hover of a.social-link-facebook: a.social-link-facebook: color, strong.: color, span.: opacity+color | made with: transition · :hover

```css
.social-links { margin-top: 3rem }
.social-links>a { position: relative; -webkit-transition: .2s; transition: .2s; position: relative }
.social-links>a::after { opacity: 0; position: absolute; bottom: .25rem; -webkit-transition: .25s; transition: .25s; -webkit-transform: translate(-50%,20px); transform: translate(-50%,20px) }
.social-links>a:focus::after, .social-links>a:hover::after { opacity: 1; -webkit-transform: translate(-50%,0); transform: translate(-50%,0) }
.social-links>a:focus span, .social-links>a:hover span { opacity: 0 }
```

### [Hover effect: borders to underlines](https://codepen.io/tiggr/pen/jRrKKg)

on hover of figure.card: img.card-image: transform+top, div.box: transform+top, blockquote.text: transform+top, cite.cite: transform+top | made with: @keyframes · transition · :hover

```css
.card { position: relative; margin-top: 50px; margin-bottom: 50px; animation: slide-in 1s backwards }
.card:last-child { animation-delay: 0.4s }
from { opacity: 0; transform: translateY(30px) }
.card::before { position: absolute; top: 0; bottom: 0; opacity: 0.1; transition: 0.5s }
.card:hover::before, .card:focus::before { opacity: 0.4 }
.box { position: relative; transition: 0.6s }
.card:hover .box, .card:focus .box { transform: translateY(-20px) }
.text { transform: scale(0.9); transition: 0.5s }
.card:hover .text, .card:focus .text { transform: none }
.cite { position: absolute; bottom: 0; transform: translate(-50%, 100%); transition: transform 0.2s 0.075s, letter-spacing 0.2s }
.card:hover .cite, .card:focus .cite { transform: translate(-50%, -20px) }
.box::before, .box::after, .box-side-borders::before, .box-side-borders::after { position: absolute; transition: 0.5s 0.1s }
```

### [Hover Effects within Table Cells](https://codepen.io/skazx/pen/VNjMMr)

made with: transition · :hover

```css
header { padding-bottom: 1em }
.list_wrap { box-shadow: 1px .5px 5px 1px black }
li { margin-bottom: 1em }
table { box-shadow: 1px .5px 5px 1px black }
.cell_options { position: relative }
.cell_options .option { position: absolute; top: 0; bottom: 0; transition: all .20s linear }
.delete { transform: translateX(-50%) scale(.7) }
.delete:hover { transform: translateX(-10%) }
.delete:hover svg { transform: translateX(0) scale(1); opacity: 1 }
.delete:hover~.edit { transform: translateX(90%) }
.edit { transform: translateX(50%) scale(.7) }
.edit:hover { transform: translateX(10%) }
```

### [Button Hover Effect](https://codepen.io/Akash_Ramani/pen/zXqXzQ)

made with: transition · :hover

```css
.btn-effect { position: relative; transition: 0.5s }
.btn-effect::before, .btn-effect::after { position: absolute; transition: all 0.2s linear }
.btn-effect::before { top: 0 }
.btn-effect::after { bottom: 0 }
span::before, span::after { position: absolute; transition: all 0.2s linear }
.btn-effect span::before { bottom: 0 }
.btn-effect span::after { top: 0 }
.btn-effect:hover { box-shadow: 0 0px 8px 5px rgba(0,0,0,0.3) }
```

### [X-Ray image hover effect](https://codepen.io/tcorderoIV/pen/gyrGXZ)

held: fixed footer | made with: position: fixed

```css
.image-reveal { position: relative; position: relative }
.image-reveal:before { padding-top: 50% }
.image-reveal > .content { position: absolute; top: 0; bottom: 0 }
.image-reveal .image-reveal__original-image, .image-reveal .image-reveal__reveal { position: absolute; top: 0 }
.image-reveal .image-reveal__reveal-image { opacity: 0 }
.reveal-follower { top: calc(50% - 50px); position: absolute; box-shadow: -3px 3px 12px #000 }
footer { position: fixed; bottom: 0 }
```

### [3D Hover Effect - Alita Card](https://codepen.io/furkangulsen/pen/ywXZMW)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
body .image { perspective: 1000px }
body .image .box { transition: all 0.5s }
body .image .box:hover { transform: rotateX(80deg); transform-origin: bottom }
body .image .box:after { position: absolute; bottom: 0; background-position: bottom; transform: rotateX(90deg); transform-origin: bottom }
body .image .box:before { position: absolute; top: 0; box-shadow: 0px 0px 100px 50px rgba(0, 0, 0, 0.5); transition: all 0.5s; opacity: 0.15; transform: rotateX(95deg) translateZ(-80px) scale(0.75); transform-origin: bottom }
body .image .box:hover:before { opacity: 1; box-shadow: 0px 0px 25px 25px rgba(0, 0, 0, 0.5); transform: rotateX(0) translateZ(-60px) scale(0.85) }
body .image .text { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

### [image hover effect — week 10/52](https://codepen.io/knyttneve/pen/YgZbLO)

made with: transition · :hover

```css
.box { transition: 0.5s; box-shadow: 0 20px 30px rgba(0, 0, 0, 0.1) }
.box > img { transition: 0.5s }
```

### [Image Overlay](https://codepen.io/baahubali92/pen/ZPeLEa)

made with: transition · :hover

```css
.blog-head { margin-bottom: 70px }
.blog-head h6 { position: relative; text-transform: capitalize }
.blog-head h6:after, .blog-head h6:before { position: absolute; top: 50% }
.overlay { position: absolute; top: 0; bottom: 0; transition: .5s ease }
.item { position: relative }
.item:hover .overlay { bottom: 0 }
.top-overlay { bottom: 100% }
.item:hover .top-overlay { bottom: 0 }
.bottom-overlay { top: 100% }
.item:hover .bottom-overlay { top: 0 }
.fade-overlay { opacity: 0 }
.item:hover .fade-overlay { opacity: 1 }
```

### [Split text animation](https://codepen.io/sonjastrieder/pen/BbpOGv)

on hover of a.SplitText: span.SplitText-mask: color | made with: transition · :hover · mask

```css
.SplitText { text-transform: uppercase; position: relative }
.SplitText::before { position: absolute; top: calc(50% + -3% - 0.25rem/2); transform: scale(0); transition: transform 0.8s cubic-bezier(0.16, 1.08, 0.38, 0.98) }
.SplitText-mask { position: absolute; top: 0; bottom: 0 }
.SplitText-mask::before, .SplitText-mask::after { position: absolute; transition: transform 0.8s cubic-bezier(0.16, 1.08, 0.38, 0.98) }
.SplitText-mask::before { top: 0 }
.SplitText-mask::after { top: 47% }
.SplitText:hover::before, .SplitText:active::before { transform: scale(1) }
.SplitText:hover .SplitText-mask::before, .SplitText:active .SplitText-mask::bef { transform: skewX(10deg) translateX(5px) }
.SplitText:hover .SplitText-mask::after, .SplitText:active .SplitText-mask::afte { transform: skewX(10deg) translateX(-5px) }
```

### [Hexagon Gallery](https://codepen.io/gabrielajohnson/pen/EMVxEL)

made with: transition · :hover · clip-path

```css
html,body { position:relative }
.gallery { position:relative }
.shadow { position: absolute; top: 500px }
.clipped-border { -webkit-clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%); clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%); transition:transform 0.2s; position:absolute }
.clipped-border:before { position:absolute; opacity:0.5; top:0; transform:rotate(45deg); transition:transform 0.5s }
.clipped-border:hover:before { transform: translate(-100px,400%) rotate(45deg); transition:transform 0.5s }
.clipped-border:nth-child(2) { top:196px }
.clipped-border:nth-child(3) { top:0 }
.clipped-border:nth-child(4) { top:196px }
.clipped-border:nth-child(5) { top:0 }
#clipped { -webkit-clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%); clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%) }
.clipped-border:hover { transform:scale(1.2); transition:transform 0.2s }
```

### [Image Hover Animation](https://codepen.io/isladjan/pen/YgKyXw)

made with: @keyframes · transition · :hover · clip-path · mask · 3D (perspective / preserve-3d)

```css
.row { margin-bottom: 50px }
.row:last-child { margin-bottom: 0px }
.row .container { box-shadow: 0 0 0px 4px rgba(18, 18, 18, 0.47) }
.container:hover { box-shadow: 0 0 10px 4px rgba(0, 0, 0, 0.47) }
.row p { margin-top: 20px }
.row { margin-top: 0; margin-bottom: 0 }
.row { margin-top: 0; margin-bottom: 0 }
.effect13 .caption p { margin-top: 30px }
.effect1 { -webkit-clip-path: circle(50% at 50% 50%); clip-path: circle(50% at 50% 50%); position: relative }
.effect1 img { position: relative }
.effect1 .caption:before { position: absolute; top: 50%; transition: top .5s, height .5s }
.effect1:hover .caption:before, .effect1:active .caption:before { top: 0 }
```

### [STICKY BUTTONS](https://codepen.io/alexkorzin/pen/XOLxvL)

held: fixed div.box | made with: position: fixed · transition · :hover · pointer / mouse tracking

```css
body { padding-bottom: 100px }
.box { position: fixed; top: 0; bottom: 0; opacity: 0.6 }
.button { transition: 0.2s ease; margin-top: 50px }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseenter", (e) => {
addEventListener("mouseleave", (e) => {
```

### [Hover fill with CSS blend mode](https://codepen.io/jayx/pen/VgOmxm)

made with: transition · :hover · mix-blend-mode

```css
.fill { position: relative }
.fill::before, .fill::after { mix-blend-mode: difference; position: absolute; top: 0 }
.in-left::before, .out-left::before { transform: translateX(-100%) }
.in-left:hover::before { transform: translateX(0); transition: transform 250ms }
.out-left::before { transition: transform 250ms }
.in-right::after, .out-right::after { transform: translateX(100%) }
.in-right:hover::after { transform: translateX(0); transition: transform 250ms }
.out-right::after { transition: transform 250ms }
.in-left.out-right:hover::after, .in-right.out-left:hover::before { transform: translateX(0) }
```

### [Beautiful animated hover](https://codepen.io/SudipTech/pen/aXxmqX)

made with: transition · :hover

```css
.container { position:relative }
.button-2 { position:absolute; position:relative }
.button-2 a { text-transform:uppercase; transition:all .5s ease; position:relative }
.eff-2 { top:-50px; position:absolute; transition:all .5s ease }
.button-2:hover .eff-2 { top:0 }
.center { position:absolute; top:50%; transform:translate(-50%, -50%) }
```

### [Image hover effect with text](https://codepen.io/rebecca-lau/pen/daLYEa)

made with: transition · :hover

```css
.image { position: relative }
.image figcaption { position: absolute; top: 340px; bottom: -340px; opacity: 0; transition: 1s }
.image:hover figcaption { opacity: 1; bottom: 0; top: 0 }
.show_pic img { margin-bottom: 25px }
```

### [css Image Hover Effect](https://codepen.io/lletycia/pen/wNNBpm)

made with: @keyframes · :hover

```css
figure { position: relative }
figure:hover::before { transform: rotate(46deg); position: absolute; top: -30px; animation: 400ms animate; animation-fill-mode: forwards; animation-timing-function: cubic-bezier(.43,.47,.81,.81) }
@keyframes animate animates transform-origin
```

### [Menu Animation (pure css)](https://codepen.io/chryss/pen/wNEqqL)

made with: transition · :hover

```css
.menu { position: absolute; top: 1em }
.menu span { margin-bottom: 6px; transition: all 0.5s; -webkit-transition: all 0.5s }
.menu:active span:nth-child(1), .menu:focus span:nth-child(1), .menu:hover span: { transform: rotate(45deg) translateY(8px) translateX(7px); -webkit-transform: rotate(45deg) translateY(8px) translateX(7px) }
.menu:active span:nth-child(2), .menu:focus span:nth-child(2), .menu:hover span: { opacity: 0 }
.menu:active span:nth-child(3), .menu:focus span:nth-child(3), .menu:hover span: { transform: rotate(-45deg) translateY(-7px) translateX(6px); -webkit-transform: rotate(-45deg) translateY(-7px) translateX(6px) }
```

### [Menu Highlight on Hover](https://codepen.io/macbubb/pen/mvXMXW)

on hover of li.menu_item: li.menu_item: color ×4, a.: color ×3, ul.menu: color, a.: transform+color+top | made with: transition · :hover

```css
.menu-hover-effects { transition: color 0.5s ease-in-out }
.menu-hover-effects a, .menu-hover-effects a:link, .menu-hover-effects a:visited { transition: color, transform 0.5s ease-in-out }
.menu-hover-effects a:hover { transform: scale(1.025, 1.025) }
.image_caption, .lyrics_caption { padding-top: 2rem }
h1 { padding-top: 2rem; text-transform: uppercase }
.lyrics { padding-top: 3rem }
.lyrics { padding-top: 0 }
```

### [Tabs - CSS + JS](https://codepen.io/rafaelavlucas/pen/MLKGba)

held: fixed div.about | on hover of a.bg_links: a.bg_links: opacity+top ×2, span.icon: opacity+top ×2, a.bg_links: opacity ×2, span.icon: opacity | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter

```css
.about { position: fixed; bottom: 10px; transition: all 0.2s ease }
.about .bg_links { backdrop-filter: blur(5px); position: absolute }
.about .logo { background-position: 10px 7px; opacity: 0.9; transition: all 1s 0.2s ease; bottom: 0 }
.about .social { opacity: 0; bottom: 0 }
.about .social .icon { background-position: center; transition: all 0.2s ease, background-color 0.4s ease; opacity: 0 }
.about .social.portfolio { transition: all 0.8s ease }
.about .social.dribbble { transition: all 0.3s ease }
.about .social.linkedin { transition: all 0.8s ease }
.about:hover { transition: all 0.6s cubic-bezier(0.64, 0.01, 0.07, 1.65) }
.about:hover .logo { opacity: 1; transition: all 0.6s ease }
.about:hover .social { opacity: 1 }
.about:hover .social .icon { opacity: 0.9 }
```

### [CSS Pop Color Change Hover Effect](https://codepen.io/cpettydesigns/pen/XOrOeX)

on scroll: div.container: transform+top | made with: transition · :hover

```css
html .container, body .container { transform: scale(0.98); transition: all 500ms ease }
html .container:hover, html .container:active, body .container:hover, body .cont { transform: scale(1) }
```

### [Cool Button Effect](https://codepen.io/jerembardon/pen/ZVdxJR)

on scroll: span.round: transform+top | made with: @keyframes · :hover

```css
.primary-button { position: relative; text-transform: uppercase }
.primary-button .round { position: absolute; top: 5px; animation: scale-down 0.2s forwards }
.primary-button.animate .round { animation: scale-up 0.5s forwards }
to { transform: scale(600) }
from { transform: scale(600) }
@keyframes scale-up animates transform
@keyframes scale-down animates transform, ransform
```

```js
addEventListener("mouseenter", function(event) {
addEventListener("mouseleave", function() {
```

### [Primary Color Orbit Hover Effect](https://codepen.io/franknoirot/pen/qLGvYE)

made with: @keyframes · transition · :hover · 3D (perspective / preserve-3d)

```css
.card { box-shadow: 0 .5rem 5px rgba(0,0,0,.2) }
.orbiter { position: relative; animation: orbit-bg 2.2s .6s infinite; transition: background-color .3s ease-in-out }
.orbiter::before { position: absolute; top: calc(50% - var(--size)/2); transform: 0; animation: orbit 2s infinite ease-in-out; opacity: 0; transition: opacity .3s ease-in-out }
.orbiter::after { position: absolute; top: calc(50% - var(--size)/2); animation: orbit45 1.5s .4s infinite ease-in-out; opacity: 0; transition: opacity .3s ease-in-out }
0% { background-position: 0% 10% }
50% { background-position: 100% 90% }
0% { transform: 0 }
50% { transform: translateZ(-100px) }
51% { transform: translateZ(100px) }
100% { transform: 0 }
0% { transform: translateY(200%) }
50% { transform: translateY(-200%) translateZ(-100px) }
```

### [Hover animation - what's Spidy gotto say?](https://codepen.io/TajShireen/pen/vvwYrx)

on scroll: div.element__tooltip: opacity+top | made with: transition · :hover

```css
.spidy-wrapper { padding-top: 3rem }
.spidy__frame { position: relative; box-shadow: 4px 8px 16px 0 rgba(0, 0, 0, 0.1); box-shadow: 10px 5px 20px #5d0c0f }
.spidy__frame > img { bottom: -5rem; position: absolute }
.center { position: relative }
.center__element { margin-top: -2rem; position: relative; transition: all 0.5s cubic-bezier(0.52, 0.11, 0.07, 0.62) }
.spidy__frame:hover .center__element { margin-top: 7rem }
.center__element img { filter: drop-shadow(0px 40px 10px #0e072c) }
.element__tooltip { position: absolute; top: -6rem; opacity: 0; transition: all 0.5s; box-shadow: 0px 5px 10px #100932 }
.element__tooltip:before { position: absolute; top: 100%; transform: rotate(20deg) }
.element__tooltip:after { position: absolute; top: 100%; transform: rotate(-25deg) }
.spidy__frame:hover .element__tooltip { opacity: 1; transition: all 2s }
```

### [Pressed down-effect on click](https://codepen.io/astridboberg/pen/mavbMW)

made with: transition · :hover

```css
body { padding-top: 10% }
div { box-shadow: 0 20px 30px 0 rgba(0, 0, 0, 0.25); transition: top 0.2s, box-shadow 0.2s }
div:hover { margin-top: -5px }
div:active { margin-top: 5px; box-shadow: none }
```

### [Wavy hover](https://codepen.io/Saul-BT/pen/PXyXvO)

made with: @keyframes · transition · :hover

```css
a.waves { position: relative; margin-top: 1em; transition: .2s }
a.waves:hover::before { box-shadow: 0 10px 15px -6px var(--glowShadow) }
a.waves:hover::after { box-shadow: 0 -10px 15px -6px var(--glowShadow) }
a.waves:hover::before, a.waves:hover::after { position: absolute; bottom: -5px }
a.waves:hover::before, a.waves:hover::after { background-position: 0 0; -webkit-animation: move .5s infinite linear; animation: move .5s infinite linear }
a.waves:hover::after { bottom: -25px; background-position: 15px -20px; -webkit-animation: move2 .5s infinite linear; animation: move2 .5s infinite linear }
@keyframes move animates background-position-x
@keyframes move2 animates background-position-x
```

### [Difference Blend Button Hover](https://codepen.io/franknoirot/pen/NeLQeL)

made with: @keyframes · :hover · mix-blend-mode

```css
.btn-tricolor { position: relative }
.btn-tri { mix-blend-mode: difference; position: absolute; top: 0 }
.btn-tricolor:hover .red { animation: pop .25s ease-in-out }
.btn-tricolor:hover .blue { animation: pop .25s .05s ease-in-out }
.btn-tricolor:hover .green { animation: pop .25s .1s ease-in-out }
.blue { animation-delay: .1s }
.green { animation-delay: .2s }
.exited { transform: translate(0) }
0% { transform: translate(0) }
30% { transform: translate(0.3em, -0.6em) }
100% { transform: translate(0) }
@keyframes pop animates transform
```

### [CSS Gradient Background Hover Effect On Mouse Movement](https://codepen.io/50701/pen/ebLyNb)

made with: transition · :hover

```css
.grButton { text-transform: uppercase; background-position: left center; transition: 0.4s }
.grButton:hover { background-position: right center }
```

### [Button - Hover & CSS Gradients](https://codepen.io/Barrydreamt/pen/oJoQNo)

on hover of a.btnOne: a.btnOne: color | made with: :hover

```css
.btnOne { text-transform: uppercase }
.btnTwo { text-transform: uppercase }
.btnThree { text-transform: uppercase }
```

### [Shadow Buttons](https://codepen.io/MdAshraf/pen/YdqPZq)

on hover of button.button: button.button: shadow | made with: :hover

```css
.button:hover { box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19) }
.button1:hover { box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19) }
.button2:hover { box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19) }
```

### [Ukrainian flag](https://codepen.io/JuliaSS/pen/wRvNMG)

made with: @keyframes · :hover

```css
#flag { position: relative; box-shadow: 0 0 7px 3px rgba(0,0,0,.4) }
#flag:before, #flag:after { opacity: 0 }
#flag:before { background-position: 0% 20% }
#flag:after { position: absolute; bottom: 0; background-position: 0% 100% }
#flag:hover:before { animation: cloud 20s forwards }
#flag:hover:after { animation: field 20s forwards }
3% { opacity: 0.7 }
100% { opacity: 0.7; background-position: 40% 20% }
3% { opacity: 0.7 }
10% { opacity: 0.7; background-position: 5% 100% }
30% { opacity: 0.7; background-position: -5% 100% }
60% { opacity: 0.7; background-position: 5% 100% }
```

### [CSS3 Animated content collection](https://codepen.io/shamim539/pen/zMeKEB)

on hover of img.: a.: color ×2, img.: opacity+filter, i.fas: background, h3.: transform+opacity, p.: transform+opacity, img.: transform+opacity+top | made with: transition · :hover

```css
.style-noodels-two.hover p, .style-noodels-two.hover h3, .style-noodels-two:hove { opacity: 1; transform: translateY(0) }
.style-noodels-three .square div:after, .style-noodels-three .square div:before, { position: absolute; transition: all 0.4s ease-in-out }
.style-noodels-four div:after, .style-noodels-four div:before { position: absolute; top: 0; transition: all 0.35s ease-in-out }
.style-noodels-nine p:after, .style-noodels-nine p:before { position: absolute; bottom: 50%; transition: all 0.45s ease-in-out }
.style-noodels-nine.hover p, .style-noodels-nine:hover p { opacity: 1 }
.style-noodels-ten a span:after, .style-noodels-ten a span:before, .style-noodel { position: absolute; opacity: 0; transition: all 0.4s ease-in-out }
.style-noodels-Sixteen figcaption div:after, .style-noodels-Sixteen figcaption d { position: absolute; transition: all 0.4s ease-in-out }
.style-noodels-Sixteen.hover img, .style-noodels-Sixteen:hover img { opacity: 0.2; filter: blur(5px); transform: scale(1.1) }
.style-noodels-Sixteen.hover figcaption p, .style-noodels-Sixteen.hover figcapti { opacity: 1; transform: translateY(0) }
.style-noodels-one { position: relative; box-shadow: 0 0 5px rgba(0, 0, 0, 0.15) }
.style-noodels-one * { transition: all 0.3s ease }
.style-noodels-one div { position: absolute; top: 50%; transform: translate(-50%, -50%); opacity: 0 }
```

### [Multi line hover effect](https://codepen.io/lynnewritescode/pen/zMmyJW)

made with: transition · :hover

```css
a { padding-bottom: 2px; transition: all 0.35s linear; background-position: left 100% }
```

### [Testimonial with hover effect](https://codepen.io/jrvasol/pen/Jeaqpo)

on scroll: p.: color+top ×2 | made with: transition · :hover

```css
.card-container { margin-top: 50px }
.card { box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1); -webkit-transition: all 200ms ease-in; -webkit-transform: scale(1); -ms-transition: all 200ms ease-in; -ms-transform: scale(1); -moz-transition: all 200ms ease-in; -moz-tr }
.card:hover { transform: scale(1.1); box-shadow: 0px 3px 15px #00000050; -webkit-transition: all 200ms ease-in; -webkit-transform: scale(1.1); -ms-transition: all 200ms ease-in; -ms-transform: scale(1.1); -moz-transition: all 200ms ea }
.card:hover .card__heading__img { bottom: 5px; transition: all 0.3s }
.card:hover .card__body:before, .card:hover .card__body:after { opacity: 0.3 }
.card__heading { position: relative }
.card__heading__img { position: absolute; bottom: -5px }
.card__body { position: relative; margin-top: 50px }
.card__body:before, .card__body:after { position: absolute }
.card__body:before { top: 0 }
.card__body:after { bottom: 0 }
.card__body p { position: relative }
```

### [Button-Hover-Effect](https://codepen.io/vnkat/pen/dQeJby)

made with: transition · :hover

```css
.mainDiv { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.button1 { position: relative }
.button1:before, .button1:after { position: absolute; transition: all 0.25s }
.button1:before { top:-5px }
.button1:after { bottom: -5px }
```

### [Social Hovers](https://codepen.io/ilyasbilgihan/pen/yQKXYz)

on hover of li.fb: a.: color, i.fab: color+top | made with: @keyframes · transition · :hover

```css
ul#buttons { position: absolute; top: 50%; transform: translate(-50%,-50%) }
ul#buttons:before { position: absolute; margin-top: -60px }
ul#buttons li { position: relative; transition: .5s; box-shadow: 0px 8px 16px -6px, 0px 0px 16px -6px }
ul#buttons li a { transition: .5s; animation: icon-out .5s forwards; animation-timing-function: cubic-bezier(0.5, -0.6, 1, 1) }
ul#buttons li:before { position: absolute; transform: rotate(-45deg) translate(-110%, -23px); animation: back-out .5s forwards; animation-timing-function: cubic-bezier(0.5, -0.6, 1, 1) }
ul#buttons li:hover a { animation: icon-in .5s forwards; animation-timing-function: cubic-bezier(0, 0, 0.4, 1.6) }
ul#buttons li:hover:before { animation: back-in .5s forwards; animation-timing-function: cubic-bezier(0, 0, 0.4, 1.6) }
0% { transform: rotate(-45deg) translate(-110%, -23px) }
80% { transform: rotate(-45deg) translate(5%, -23px) }
100% { transform: rotate(-45deg) translate(0%, -23px) }
0% { transform: rotate(-45deg) translate(0%, -23px) }
20% { transform: rotate(-45deg) translate(5%, -23px) }
```

### [Fill Text Effect On Hover - Css3 Hover Effect - Pure Html Css](https://codepen.io/sebconejo/pen/qQPJeO)

on scroll: div.contact-block: background, span.link-mask: transform, span.: transform | made with: transition · :hover

```css
.contact-block { position: relative; -webkit-transition: background-color 0.85s ease-out; -moz-transition: background-color 0.85s ease-out; -ms-transition: background-color 0.85s ease-out; -o-transition: background-color 0.85s ease-out;  }
.contact-block > span { position: relative }
.contact-block > span[data-text=Contact] { position: absolute; top: var(--top, calc(50% - var(--height) / 2)) }
.contact-block:hover .link-mask, .contact-block:hover .link-mask > span { -webkit-transform: translateY(0%); -ms-transform: translateY(0%); transform: translateY(0%); transition: all 0.8s cubic-bezier(0.26, 0.48, 0.08, 0.9); -webkit-transition: all 0.8s cubic-bezier(0.26, 0.48, 0.08, 0.9); -mo }
.contact-block .link-mask { position: absolute; top: 0; -webkit-transform: translateX(-120%); -ms-transform: translateX(-120%); transform: translateX(-120%); transition: all 0.6s cubic-bezier(0.26, 0.48, 0.08, 0.9); -webkit-transition: all 0.6s cub }
.contact-block .link-mask > span { position: absolute; top: 0; -webkit-transform: translateX(120%); -ms-transform: translateX(120%); transform: translateX(120%); transition: all 0.6s cubic-bezier(0.26, 0.48, 0.08, 0.9); -webkit-transition: all 0.6s cubic- }
```

### [CSS Info Cards - Hover](https://codepen.io/rafaelavlucas/pen/rQWJYG)

held: fixed div.about | on scroll: p.text: opacity+top | on hover of a.bg_links: a.bg_links: opacity+top ×2, span.icon: opacity+top ×2, a.bg_links: opacity ×2, span.icon: opacity, p.text: opacity+top | made with: position: fixed · transition · :hover · backdrop-filter

```css
.about { position: fixed; bottom: 10px; transition: all 0.2s ease }
.about .bg_links { backdrop-filter: blur(5px); position: absolute }
.about .logo { background-position: 10px 7px; opacity: 0.9; transition: all 1s 0.2s ease; bottom: 0 }
.about .social { opacity: 0; bottom: 0 }
.about .social .icon { background-position: center; transition: all 0.2s ease, background-color 0.4s ease; opacity: 0 }
.about .social.portfolio { transition: all 0.8s ease }
.about .social.dribbble { transition: all 0.3s ease }
.about .social.linkedin { transition: all 0.8s ease }
.about:hover { transition: all 0.6s cubic-bezier(0.64, 0.01, 0.07, 1.65) }
.about:hover .logo { opacity: 1; transition: all 0.6s ease }
.about:hover .social { opacity: 1 }
.about:hover .social .icon { opacity: 0.9 }
```

### [3D hover effect on image with only CSS !](https://codepen.io/sebconejo/pen/dQORYx)

on scroll: div.content: transform+top | on hover of a.cell: div.content: transform+top | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.wrapper { position: relative; perspective: 800px }
.wrapper .content { box-shadow: 0 6px 56px 26px rgba(0, 0, 0, 0.1); background-position: center; transform: rotateX(0) rotateY(0); transition: 250ms linear transform }
.wrapper .cell { position: absolute }
.wrapper .cell-1 { top: 0 }
.wrapper .cell-1:hover ~ .content { transform: rotateX(5deg) rotateY(-5deg) }
.wrapper .cell-2 { top: 0 }
.wrapper .cell-2:hover ~ .content { transform: rotateX(5deg) rotateY(5deg) }
.wrapper .cell-3 { top: 50% }
.wrapper .cell-3:hover ~ .content { transform: rotateX(-5deg) rotateY(-5deg) }
.wrapper .cell-4 { top: 50% }
.wrapper .cell-4:hover ~ .content { transform: rotateX(-5deg) rotateY(5deg) }
```

### [Button CSS example](https://codepen.io/JestVA/pen/BGKBNp)

on hover of button.btn: button.btn: shadow+top | made with: :hover

```css
.btn { position: relative; text-transform: uppercase; box-shadow: 0 6px #efa424 }
.btn:hover { box-shadow: 0 4px #efa424; top: 2px }
.btn:active { box-shadow: none; top: 6px }
```

### [Remove a hover effect for touch devices with only CSS](https://codepen.io/Ferie/pen/aQOxKr)

made with: :hover · (hover: hover) gate

### [Hover underline animation](https://codepen.io/niktariy/pen/yQLzXO)

made with: transition · :hover

```css
.hover-underline-animation { position: relative }
.hover-underline-animation::after { position: absolute; transform: scaleX(0); bottom: 0; transition: transform 0.25s ease-out }
.hover-underline-animation:hover::after { transform: scaleX(1) }
```

### [Strike-through Text](https://codepen.io/EmmaJD/pen/gQYZGe)

on scroll: span.: color | made with: transition · :hover

```css
body { text-transform: uppercase }
span { position: relative; transition: 0.6s }
span:hover { transition: 0.6s }
span:before, span:after { position: absolute; top: 50%; margin-top: -0.5px }
span:after { transition: width 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) }
span:hover:before { transition: width 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) }
span:hover:after { transition: 0s }
```

### [Link Hover Effect](https://codepen.io/blecaf/pen/aRPYNq)

on scroll: a.: color+shadow | made with: transition · :hover

```css
a { position: absolute; top: 50%; transform: translate(-50%, -50%); box-shadow: inset 0px -4px 0 currentColor; transition: color 1s }
a:after,a:before { position: absolute; top: 0; bottom: 0; transition: width 1s, height 1s }
a:after { top: auto; box-shadow: inset 0px -4px 0 currentColor; transition: width 0.5s }
```

### [Hover line animation using plain JavaScript](https://codepen.io/gnevin/pen/qJoadQ)

on hover of a.: div.nav-track__active: opacity | made with: transition

```css
body:before { position: absolute; top: 0; filter: blur(2px); opacity: 0.5 }
nav { position: relative }
a { transition: all 0.3s ease-in-out }
.nav-track { position: relative }
.nav-track__active { bottom: 0; opacity: 0; position: absolute; transition: all 0.3s ease-in-out }
```

### [Ghost 👻](https://codepen.io/SBDesign/pen/YJwgpX)

on scroll: div.rightEye: transform+background+top, div.leftEye: transform+background, div.mouth: transform+background | made with: @keyframes · transition · :hover

```css
.ghostbody { animation-name:floating; animation-iteration-count: infinite; animation-duration: 1.6s }
.leftHand { transform: rotate(310deg) }
.rightHand { transform: rotate(40deg) }
.legs { transition:all 0.3s }
li { transform: rotate(180deg) }
.mouth { transition: all 0.2s }
.ghostbody:hover .mouth { transform: rotate(180deg) }
.leftEye { transition: all 0.3s }
.rightEye { transition: all 0.2s }
.ghostbody:hover .rightEye { transform: rotate(330deg) }
.ghostbody:hover .leftEye { transform: rotate(40deg) }
@keyframes floating animates margin
```

### [Border Hover Effects](https://codepen.io/shpendbajgora/pen/oaXgvq)

made with: transition · :hover

```css
.title { margin-bottom: 10px }
.item-wrapper { position: relative }
.item-wrapper .line { position: absolute }
.item-wrapper .line span { position: inherit; transition: all .4s ease-out }
.item-wrapper .line-top { top: 0 }
.item-wrapper .line-right { top: 0 }
.item-wrapper .line-bottom { bottom: 0 }
.item-wrapper .line-left { bottom: 0 }
.item-wrapper .line-top span { top: inherit }
.item-wrapper .line-right span { top: inherit }
.item-wrapper .line-bottom span { bottom: inherit }
.item-wrapper .line-left span { bottom: inherit }
```

### [Button hover effect](https://codepen.io/comehope/pen/yRyOZr)

on hover of li.: li.: color | made with: transition · :hover

```css
ul li { text-transform: uppercase; position: relative; transition: 0.3s }
ul li::before { position: absolute; transition: 0.4s ease-out }
ul li::after { position: absolute; bottom: 0; transition: 0.3s 0.3s ease-out }
```

### [Perspective button hover effect](https://codepen.io/comehope/pen/qJEdKb)

on hover of li.: li.: transform+top | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
ul li { box-shadow: 0 0 1em rgba(0,0,0,0.2); text-transform: capitalize; transition: 0.3s }
ul li:nth-child(odd) { transform: perspective(500px) rotateY(45deg) }
ul li:nth-child(even) { transform: perspective(500px) rotateY(-45deg) }
ul li:nth-child(odd):hover { transform: perspective(200px) rotateY(45deg) }
ul li:nth-child(even):hover { transform: perspective(200px) rotateY(-45deg) }
```

### [CSS layered hover animation.](https://codepen.io/martincravero/pen/VEZqeJ)

on scroll: div.layer: transform+top ×4 | made with: transition · :hover

```css
.box { position:relative; margin-top: 150px; transform: rotate(-30deg) skew(25deg) scale(0.8) }
.layer { position: absolute; top:0; transition: 0.5s }
.box:hover .layer:nth-child(4) { transform: translate(160px, -160px); opacity: 1 }
.box:hover .layer:nth-child(3) { transform: translate(120px, -120px); opacity: 1 }
.box:hover .layer:nth-child(2) { transform: translate(80px, -80px); opacity: 1 }
.box:hover .layer:nth-child(1) { transform: translate(40px, -40px); opacity: 1 }
```

### [Social icon hover effect css3](https://codepen.io/dkprajapati/pen/YOmpwr)

on hover of li.: a.: transform+top | made with: transition · :hover

```css
ul { position: absolute; top:50%; transform: translate(-50%,-50%) }
ul li { position: relative }
ul li:after { position: absolute; bottom: 0; filter: blur(4px); opacity: 0 }
ul li:hover:after { opacity: 1 }
ul li a { position: relative; position: relative; transition: 0.5s }
ul li a span:before { position: absolute; transition: 0.5s; transform-origin: top }
ul li:hover a { transform: translateY(-10px) }
ul li:hover a span:before { transform: rotateX(90deg) translateY(-50%) }
ul li a span:after { position:absolute; transition: 0.5s; transform-origin: bottom; transform: rotateX(90deg) translateY(50%) }
ul li:hover a span:after { transform: rotateX(0deg) translateY(0px) }
```

### [Card multi-layer hover trick with pure CSS](https://codepen.io/craveromartin/pen/gdVbYw)

on hover of img.: img.: transform+opacity+top ×3, img.: transform+top | made with: transition · :hover

```css
.container { position: relative; margin-top: 150px; transform: rotate(-30deg) skew(25deg) scale(.8); transition: 0.5s }
.container img { position: absolute; transition: 0.5s }
.container:hover img:nth-child(4) { transform: translate(160px, -160px); opacity: 1 }
.container:hover img:nth-child(3) { transform: translate(120px, -120px); opacity: .8 }
.container:hover img:nth-child(2) { transform: translate(80px, -80px); opacity: .6 }
.container:hover img:nth-child(1) { transform: translate(40px, -40px); opacity: .4 }
```

### [Button hover effects](https://codepen.io/crocoder/pen/LJMZvd)

made with: transition · :hover

```css
h1 { position: relative }
h1::before { position: absolute; transform: translateX(-50%); bottom: -12px }
.pen-container > div > span { margin-bottom: 2em }
.btn { position: relative }
.btn__text { text-transform: uppercase }
.btn--1 .btn__text { position: relative }
.btn--1::before, .btn--1::after { position: absolute; top: 0 }
.btn--1::after { transition: width 0.3s }
.btn--1:hover::before { transition: width 0.3s }
.btn--2 .btn__text { position: absolute; top: 0; transition: top 0.3s }
.btn--2::after { position: absolute; top: 100%; transition: top 0.3s; text-transform: uppercase }
.btn--2:hover::after { top: 0 }
```

### [Button hover effect](https://codepen.io/comehope/pen/PdaNXw)

on scroll: span.: transform | on hover of li.: span.: transform ×2 | made with: transition · :hover

```css
li { position: relative; margin-top: 0.8em }
li::before, li::after { position: absolute }
li::before { top: 10%; filter: brightness(0.8) }
li::after { top: 20%; filter: brightness(0.6) }
li span { position: relative; top: -10%; text-transform: capitalize; transform: translateX(calc(-0.15em * 3 - 0.08em * 2)); transition: 0.3s }
li:hover span { transform: translateX(0.15em) }
```

### [Material button transition](https://codepen.io/Laosing/pen/rZwPWx)

on scroll: a.btn-expand: background+shadow, span.btn-text: opacity, div.bg: background | made with: transition · :hover

```css
.btn-expand { position: relative; box-shadow: 0 3px 14px -1px rgba(0, 0, 0, 0.25); transition: width 0.3s cubic-bezier(0.51, 0.92, 0.24, 1.15), border-radius 0.3s ease, background 0.3s ease, box-shadow 0.3s ease }
.btn-expand:hover { box-shadow: 0 8px 20px -2px rgba(0, 0, 0, 0.4) }
.btn-expand:hover span { opacity: 1 }
.btn-expand i { position: absolute; top: 0; transition: opacity 0.3s ease, left 0.3s cubic-bezier(0.51, 0.92, 0.24, 1.15) }
.btn-expand span { position: absolute; top: 0; opacity: 0; transition: opacity 0.3s ease }
.bg { position: absolute; transition: background 0.3s ease }
```

### [Button hover effect](https://codepen.io/comehope/pen/yxbEzJ)

on hover of li.: li.: color | made with: transition · :hover

```css
li { text-transform: capitalize; position: relative; transition: 0.5s }
li::before, li::after { position: absolute; transition: 0.5s cubic-bezier(0.5, -0.5, 0.25, 1.5); top: calc(50% - 0.6em / 2) }
li:hover::before { top: 0 }
li:hover::after { filter: brightness(0.8) }
```

### [Origami cranes](https://codepen.io/comehope/pen/xagoYb)

made with: @keyframes · :hover

```css
.cranes { position: relative }
.cranes span { border-bottom: calc(var(--bottom) * 1em) solid; position: absolute; transform: rotate(calc(var(--rotation) * 1deg)); top: calc(var(--y) * 1em); filter: opacity(0.6) }
.cranes:hover span { animation: appear 1s ease-in }
from { border-bottom: 3em solid; position: absolute; transform: rotate(0deg); top: calc((50em - 3em) / 2) }
.head { --bottom: 2 }
.neck { --bottom: 12 }
.side { --bottom: 20 }
.wing { --bottom: 8 }
.tail { --bottom: 3.9 }
.belly { --bottom: 11.5 }
@keyframes appear animates border-left, border-right, border-bottom, position, transform, left, top
```

### [Apple photos icon](https://codepen.io/comehope/pen/zJKwbO)

on scroll: span.: transform+top ×8 | made with: @keyframes · :hover · mix-blend-mode

```css
.icon { position: relative }
.icon span { position: absolute; transform: rotate(calc((var(--n) - 1) * 45deg)); mix-blend-mode: multiply }
.icon:hover span { animation: rotating 2s ease-in-out forwards }
from { transform: rotate(0deg) }
to { transform: rotate(calc((var(--n) - 1) * 45deg)) }
@keyframes rotating animates transform
```

### [Hover Effect: tinted images + link.](https://codepen.io/MaxwellR/pen/zJxKOx)

made with: transition · :hover

```css
.tint { position: relative; box-shadow: rgba(0,0,0,.2) 3px 5px 5px; margin-top: 15px; margin-bottom: 15px }
.tint:before { position: absolute; top: 0; bottom: 0; transition: all .3s linear }
```

### [Button hover effect](https://codepen.io/comehope/pen/mGbpqv)

on hover of li.: li.: transform+color+top | made with: transition · :hover

```css
nav li { text-transform: uppercase; position: relative; transition: 0.3s }
nav li::before, nav li::after { position: absolute; top: 0; transition: 0.3s }
nav li::before { box-shadow: 0.2rem 0.2rem 0.5rem rgba(0, 0, 0, 0.2) }
nav li::after { transform: translate(1.5rem, 1.5rem) }
nav li:hover { transform: translate(1.5rem, 1.5rem) }
nav li:hover::after { transform: translate(-1.5rem, -1.5rem) }
```

### [Card with Hover effect](https://codepen.io/Alessandro_Lab/pen/yqmdjB)

on scroll: h1.: color, br.: color, p.: opacity, a.: color | on hover of div.card: h1.: color ×2, br.: color ×2, p.: opacity ×2, a.: color ×2 | made with: transition · :hover

```css
* { transition: 0.5s }
.align-middle { position: relative; top: 50%; transform: translateY(-50%) }
.column { margin-top: 3rem }
.column:hover .card .txt h1, .column:hover .card .txt p { opacity: 1 }
.card { box-shadow: 0 0 33px rgba(0, 0, 0, 0.5) }
.card .txt h1 { text-transform: uppercase }
.card .txt p { margin-top: 33px; opacity: 0 }
.card a { position: relative; bottom: -0.5rem; text-transform: uppercase }
.card a:after { border-top: 1px solid white; transition: 0.5s }
.card .ico-card { position: absolute; top: 0; bottom: 0 }
.card i { position: relative; top: 60%; opacity: 0.2 }
```

### [Ghostly Text Hover Effect](https://codepen.io/tomncurry/pen/VBOXbd)

made with: @keyframes · transition · :hover

```css
.ripple > * { margin-top: 20%; transition: ease all .5s }
.ripple:hover > * { animation: rippleEffect 5s infinite }
40% { opacity: .35 }
50% { transform: translate3d(.5em, 0, 0) scale(1.1) }
75% { transform: translate3d(0, 0, 0) scale(1); opacity: 1 }
@keyframes rippleEffect animates opacity, transform, text-shadow
```

### [Mouse hover effect on button using CSS](https://codepen.io/Ketan0011/pen/djrJqO)

on scroll: a.effect1: color, span.bg: transform+color+top | made with: transition · :hover

```css
.effect1 { position: relative; -webkit-transition: all 0.3s; -o-transition: all 0.3s; transition: all 0.3s; -webkit-transform: scale(3); -ms-transform: scale(3); transform: scale(3) }
.effect1 .bg { position: absolute; top: 50%; margin-top: -1px; -webkit-transition: all 0.3s; -o-transition: all 0.3s; transition: all 0.3s }
.effect1:hover .bg { -webkit-transform: translate(0, -50%); -ms-transform: translate(0, -50%); transform: translate(0, -50%) }
.effect1 .bg:before, .effect1 .bg:after { position: absolute; -webkit-transition: all 0.3s; -o-transition: all 0.3s; transition: all 0.3s }
.effect1 .bg:before { bottom: 3px; -webkit-transform: rotate(45deg); -ms-transform: rotate(45deg); transform: rotate(45deg) }
.effect1 .bg:after { top: 3px; -webkit-transform: rotate(-45deg); -ms-transform: rotate(-45deg); transform: rotate(-45deg) }
.effect1:hover .bg:before { bottom: 6px }
.effect1:hover .bg:after { top: 6px }
```

### [Gradient 3D Button with Hover Effects](https://codepen.io/musthakeem781/pen/rrrKJg)

made with: transition · :hover

```css
button { position:relative; margin-bottom:20px }
h1 { margin-top:30px }
button span { position: absolute; top: 0; transition: 0.4s ease-in }
.btn1 { box-shadow:0 0 0 1px #9a00cd inset, 0 0 0 2px rgba(255,255,255,0.15) inset, 0 8px 2px 0 #9823d5, 0 8px 8px 1px rgba(0,0,0,0.5) }
.btn1:active { box-shadow:0 0 0 1px #9a00cd inset, 0 0 0 1px rgba(255,255,255,0.15) inset, 0 1px 3px 1px rgba(0,0,0,0.3); transform: translate(0px,10px) }
.textIn1 { top:100% }
button:hover .textOut1 { top: -100% }
button:hover .textIn1 { top: 0 }
.btn2 { box-shadow:0 0 0 1px #a20068 inset, 0 0 0 2px rgba(255,255,255,0.15) inset, 0 8px 2px 0 #a20068, 0 8px 8px 1px rgba(0,0,0,0.5) }
.btn2:active { box-shadow:0 0 0 1px #9a00cd inset, 0 0 0 1px rgba(255,255,255,0.15) inset, 0 1px 3px 1px rgba(0,0,0,0.3); transform: translate(0px,10px) }
.btn3 { box-shadow:0 0 0 1px #4EFB11 inset, 0 0 0 2px rgba(255,255,255,0.15) inset, 0 8px 2px 0 #4EFB11, 0 8px 8px 1px rgba(0,0,0,0.5) }
.btn3:active { box-shadow:0 0 0 1px #9a00cd inset, 0 0 0 1px rgba(255,255,255,0.15) inset, 0 1px 3px 1px rgba(0,0,0,0.3); transform: translate(0px,10px) }
```

### [emoji with hover effect](https://codepen.io/Grabiarz/pen/vajrQj)

made with: transition · :hover

```css
.face { box-shadow: 0 0 10px black; position: relative; transition: all 1.5s ease-in-out }
.face::before { position: absolute; transition: color 2s ease-in-out }
.face::after { position: absolute; transition: color 2s ease-in-out }
.eyebrow, .eye, .mouth { box-shadow: 0px 0px 4px black }
.eyebrow { position: absolute; top: 40px }
.eyebrow-left { transition: all 1s ease-in-out }
.face:hover .eyebrow-left { top: 60px; transform: rotate(30deg) }
.eyebrow-right { transition: all 1s ease-in-out }
.face:hover .eyebrow-right { top: 60px; transform: rotate(-30deg) }
.eye { position: absolute; top: 50px }
.eye-left { transition: all 1s ease-in-out }
.face:hover .eye-left { top: 65px }
```

### [Flame Effect (Canvas)](https://codepen.io/St1myL/pen/LBdQpy)

on scroll: img.: transform+opacity+top | on hover of img.: img.: transform+top | made with: @keyframes · transition · :hover · canvas 2D

```css
h2 { text-transform: uppercase }
.main { position: relative }
.main:hover .effect img { opacity: 1 }
.effect img { position: absolute; top: -0.0625rem; transition: opacity 300ms; animation-name: rotation; animation-duration: 30000ms; animation-timing-function: linear; animation-iteration-count: infinite; opacity: 0 }
.effect canvas { position: absolute; top: 0 }
from { -webkit-transform: rotate(0deg) scale(0.9); transform: rotate(0deg) scale(0.9) }
to { -webkit-transform: rotate(360deg) scale(0.9); transform: rotate(360deg) scale(0.9) }
@keyframes rotation animates -webkit-transform, transform
```

### [img hover](https://codepen.io/riko-7/pen/MBEQLq)

on scroll: div.layer1: shadow, div.layer2: filter | made with: transition · :hover

```css
section .layer2 { position: absolute; top: 0; background-position: center; transition: 1.5s }
section .layer1 { position: absolute; top: 50%; transform: translate(-50%,-50%); background-position: center; transition: 2.5s }
.layer1:hover ~ .layer2 { filter: blur(10px) }
.layer1:hover { box-shadow: 0 25px 60px rgba(0,0,0,.8) }
```

### [Two clickable squares moving on a square path](https://codepen.io/mariusz777/pen/KBdqow)

on scroll: div.: transform+top | made with: @keyframes · :hover

```css
.box { margin-top: 150px }
#square2 { position: relative; margin-top: -350px; animation: sq1 6s linear infinite }
#square2:hover { animation-play-state: paused }
#square3 { position: relative; margin-top: -100px; animation: sq2 6s linear infinite; animation-direction: reverse }
#square3:hover { animation-play-state: paused }
0% { top:0px }
25% { top:0px }
50% { top:300px }
75% { top:300px }
100% { top:0px }
0% { transform: translate(0px,0px) }
25% { transform: translate(300px,0px) }
```

### [Two clickable squares moving on axis](https://codepen.io/mariusz777/pen/djYRYz)

on scroll: div.square: transform, div.square2: transform+top | made with: @keyframes · :hover

```css
.box { margin-top: 300px }
.line { margin-top:100px }
.line2 { margin-top: -100px }
.square { margin-top: -130px; animation: sq1 2s linear infinite; animation-direction: alternate }
.square:hover { animation-play-state: paused }
.square2 { margin-top: 50px; animation: sq2 2s linear infinite; animation-direction: alternate }
.square2:hover { animation-play-state: paused }
from { transform: translate(0px, 0px) }
to { transform: translate(230px, 0px) }
from { transform: translate(0px, 0px) }
to { transform: translate(0px, -230px) }
@keyframes sq1 animates transform
```

### [Two clickable squares rotating on circle path](https://codepen.io/mariusz777/pen/JBYNEj)

on scroll: div.square: transform+top, div.square2: transform+top | made with: @keyframes · :hover

```css
.box { margin-top: 200px }
.square { margin-top: -130px; animation: sq1 3s linear infinite }
.square:hover { animation-play-state: paused }
.square2 { margin-top: -60px; animation: sq2 3s linear infinite; animation-direction: reverse }
.square2:hover { animation-play-state: paused }
from { transform: rotate(0deg) translateX(-100px) rotate(0deg) }
to { transform: rotate(360deg) translateX(-100px)rotate(-360deg) }
from { transform: rotate(0deg) translateX(100px) rotate(0deg) }
to { transform: rotate(360deg) translateX(100px)rotate(-360deg) }
@keyframes sq1 animates transform
@keyframes sq2 animates transform
```

### [Hey, Take it easy!](https://codepen.io/comehope/pen/oMgmwB)

on scroll: span.ruler: transform+top, span.calendar: transform+top, span.pencil: transform+top, p.: transform+top | made with: transition · :hover

```css
.desk { box-shadow: 0 0 0 6em; position: relative }
.desk * { position: absolute; transition: 1s }
.desk *::before, .desk *::after { position: absolute }
.paper { top: 14em }
.paper::before { bottom: 1.6em; filter: saturate(150%) brightness(0.9) }
.paper::after { bottom: -1em }
.ruler { top: 8em; transform: rotate(25deg) }
.ruler::before { top: 1em }
.ruler::after { top: 3em }
.calendar { top: 14em; transform: rotate(15deg) }
.calendar::before { top: -2em; box-shadow: 0 0, 0 0 0 1em darkslategray, 15em 0, 15em 0 0 1em darkslategray }
.calendar::after { top: 10em; box-shadow: 0 0, 5em 0, 10em 0, 15em 0, 0 5em, 5em 5em, 10em 5em, 15em 5em, 0 10em, 5em 10em, 10em 10em, 15em 10em }
```

### [Bubble coloring button](https://codepen.io/comehope/pen/eKqZjy)

on hover of li.: span.: transform+color+top ×4, li.: color | made with: transition · :hover

```css
nav ul li { text-transform: uppercase; position: relative; transition: 0.5s }
nav ul li span { position: absolute; transform: translateY(150%); transition: 0.5s }
nav ul li:hover span { transform: translateY(0) scale(2) }
```

### [Color cards](https://codepen.io/comehope/pen/LraOXQ)

on scroll: span.: transform+top ×7, span.: transform | on hover of div.cards: span.: transform+top ×4 | made with: @keyframes

```css
.cards { position: relative }
.cards span { position: absolute; top: calc(50% - 3em / 2); animation: rotating 3s linear infinite; animation-delay: calc((var(--n) - 8) * 0.15s) }
0%, 35% { transform: rotate(0deg) }
90%, 100% { transform: rotate(360deg) }
.cards span::before { position: absolute }
.cards span::after { position: absolute; top: 0.1em; box-shadow: 0.7em 0 0 -0.1em silver }
@keyframes rotating animates transform
```

### [Border Effect CSS Button](https://codepen.io/johndownie/pen/XYyLwB)

on scroll: a.button: background, span.button-inner: color | made with: transition · :hover

```css
.button { text-transform: uppercase }
.button:hover .button-inner::before { transition: width 0.2s ease-out, height 0.2s ease-out 0.2s }
.button:hover .button-inner::after { transition: height 0.2s ease-out, width 0.2s ease-out 0.2s }
.button .button-inner { transition: color 0.2s; box-shadow: inset 0 0 0 2px #333; position: relative }
.button .button-inner::before, .button .button-inner::after { position: absolute }
.button .button-inner::before { top: 0 }
.button .button-inner::after { bottom: 0; top: 0 }
```

### [Hover Effect Ideas](https://codepen.io/nguyenvan/pen/jKQBBK)

on hover of img.: img.: opacity | made with: transition · :hover

```css
.c-layla .c-image { position: relative }
.c-layla .c-image:hover:before { opacity: 1; transform: scale(1); transition: opacity 0.35s, transform 0.35s }
.c-layla .c-image:hover:after { opacity: 1; transform: scale(1); transition: opacity 0.35s, transform 0.35s }
.c-layla .c-image:hover img { opacity: 0.4 }
.c-layla .c-image:before { position: absolute; opacity: 0; top: 50px; bottom: 50px; border-top: 1px solid #fff; border-bottom: 1px solid #fff; transform: scale(0, 1) }
.c-layla .c-image:after { position: absolute; opacity: 0; top: 30px; bottom: 30px; transform: scale(1, 0) }
.c-layla .c-image img { opacity: 0.7 }
.c-bubba { margin-top: 20px }
.c-bubba .c-image1 { position: relative }
.c-bubba .c-image1:hover:before { opacity: 1; transform: scale(1) }
.c-bubba .c-image1:hover:after { opacity: 1; transform: scale(1) }
.c-bubba .c-image1:hover img { opacity: 0.4 }
```

### [Link "underline from the center" effect](https://codepen.io/JakubHonisek/pen/mKGRdJ)

made with: transition · :hover

```css
.link { position: relative }
.link::before { position: absolute; bottom: 0; transform: scaleX(0); transition: all 300ms ease }
.link:hover::before { transform: scaleX(1) }
```

### [bubble button](https://codepen.io/jonaszpotoniec/pen/zajLOg)

made with: transition · :hover

```css
button { position: relative; top: 10vh }
.nice-btn { transition: 0.3s }
.nice-btn:before, .nice-btn:after { position: absolute; transition: all 1s }
.nice-btn:before { top: 100%; box-shadow: 1.3em 0.5em 0 0 var(--water-color), 2.5em 0.1em 0 0 var(--water-color), 3.5em 0.2em 0 0 var(--water-color), 4.7em 0.5em 0 0 var(--water-color), 5.5em 0.1em 0 0 var(--water-color), 6.5em 0.5em 0 0 v }
.nice-btn:after { top: 130% }
.nice-btn:hover:before { top: -10% }
.nice-btn:hover:after { top: 0 }
.nice-btn:active { box-shadow: 0 0 1em 1em var(--hue-color) }
```

### [Parrot](https://codepen.io/comehope/pen/vrRmWy)

on scroll: span.outer: transform, span.middle: transform, span.inner: transform | made with: transition · :hover

```css
.parrot { position: relative }
.parrot > * { position: absolute; transform: rotate(45deg); transition: 0.5s }
.parrot .inner::before { position: absolute; top: -0.5em }
.parrot:hover .outer { transform: rotate(225deg) }
.parrot:hover .middle { transform: rotate(calc(225deg - 360deg)) }
.parrot:hover .inner { transform: rotate(135deg) }
```

### [Floating forms with fancy hover buttons](https://codepen.io/moudstar/pen/OEjZoB)

on hover of a.btn: a.btn: background | made with: transition · :hover

```css
.block { box-shadow: rgba(0, 0, 0, 0.05) 0 0 20px, rgba(0, 0, 0, 0.4) 0 50px 100px -20px }
.col-xs-12 { position: relative }
.col-md-6 { position: relative }
.form-control { margin-bottom: 1rem !important }
.btn { transition: background-color 0.5s ease-in-out, text-shadow 0.5s ease-in-out }
.btn:after { top: 0 }
.btn:before { position: absolute; top: 50%; transition: all 0.25s ease }
.btn .btn__text { position: relative; transition: transform 0.5s ease }
.btn .btn__text:before, .btn .btn__text:after { position: absolute }
.btn .btn__text:before { top: 0; transition: width .15s .45s cubic-bezier(.4, 0, .2, 1) }
.btn .btn__text:after { bottom: 0; transition: width .15s .15s cubic-bezier(.4, 0, .2, 1) }
.btn .btn__text span:before, .btn .btn__text span:after { position: absolute; transition: all 0.2s cubic-bezier(0.2, 0.3, 0.25, 0.9) }
```

### [Icons and hover effect](https://codepen.io/moondust_kj/pen/WyEGNg)

on scroll: ul.: background+top | made with: position: fixed · scroll() timeline · transition · :hover

```css
.nav li { position: relative }
.nav li a::before { transition: all ease-out 0.2s }
.nav li a:hover::before { position: relative; top: 30px }
.scrollNav ul { position: fixed; top: 0 }
```

### [Ice lolly](https://codepen.io/comehope/pen/vrxzMw)

made with: @keyframes · :hover

```css
.flavors { position: relative }
.flavors::before { position: absolute; transform: rotate(-25deg); animation: moving 100s linear infinite; animation-play-state: paused }
.ice-lolly:hover .flavors::before { animation-play-state: running }
to { background-position: 0 1000vh }
.flavors::after { position: absolute; bottom: 2em }
.stick { position: relative }
.stick::after { position: absolute }
@keyframes moving animates background-position
```

### [Submit Button Hover Effect](https://codepen.io/AmanSilawat/pen/aKBKEO)

on scroll: input.: color | made with: transition · :hover

```css
.center { position: absolute; top: 50%; transform: translate(-50%, -50%) }
input[type="submit"] { transition: all .8s }
.submit { position: relative }
.submit:after { position: absolute; top: 0; transition: all .8s }
.submit:before { position: absolute; top: 0; transition: all .8s }
```

### [Background transition button effect](https://codepen.io/comehope/pen/XYKdwg)

on hover of li.: span.: color ×4 | made with: transition · :hover

```css
li { transition: 500ms }
li span { text-transform: uppercase; position: relative; transition: 500ms }
li span::before { position: absolute; transition: 500ms }
li:hover span::before { transform: rotate(-25deg) }
```

### [Blueoasis Dive Site](https://codepen.io/Budiasa/pen/JZdEqE)

on scroll: a.link: background+color+top | made with: transition · :hover

```css
.title h2 { margin-bottom: 10px; text-transform: uppercase; text-transform: uppercase }
.box1 { position: absolute; top: 2px; bottom: 2px }
.link { position: absolute; top: 0; bottom: 0; transition: 0.2s linear }
.caption { position: absolute; top: 50%; transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%) }
```

### [Stroke animation button effect](https://codepen.io/comehope/pen/mKdzZM)

on hover of li.: li.: color+shadow | made with: @keyframes · transition · :hover

```css
nav ul li { text-transform: uppercase; position: relative; transition: var(--t4x) }
nav ul li:hover { animation: pulse ease-out 1s var(--t4x) }
nav ul li::before, nav ul li::after { position: absolute }
nav ul li::before { top: -1px; transition: height linear var(--t1x) var(--t2x), width linear var(--t1x) var(--t3x), visibility 0s var(--t4x) }
nav ul li::after { bottom: -1px; transition: height linear var(--t1x), width linear var(--t1x) var(--t1x), visibility 0s var(--t2x) }
nav ul li:hover::before { transition: visibility 0s, width linear var(--t1x), height linear var(--t1x) var(--t1x) }
nav ul li:hover::after { transition: visibility 0s var(--t2x), width linear var(--t1x) var(--t2x), height linear var(--t1x) var(--t3x) }
from { box-shadow: 0 0 hsla(210, 100%, 56%, 0.5) }
to { box-shadow: 0 0 0 1em hsla(210, 100%, 56%, 0) }
@keyframes pulse animates box-shadow
```

### [Hexagonal button effects](https://codepen.io/comehope/pen/xjoOeM)

made with: transition · :hover

```css
ul li { position: relative }
ul li::before, ul li::after { position: absolute; top: 0; filter: opacity(0); transition: 0.3s }
ul li:hover::before, ul li:hover::after { filter: opacity(1); transform: rotate(calc(60deg * var(--direction))) }
```

### [anchor:hover css fancy animations](https://codepen.io/jlozovei/pen/xjBmZV)

made with: transition · :hover

```css
.container { box-shadow: 0 0 75px -25px #222 }
.container .links-wrapper a { margin-bottom: 2rem }
.animated { position: relative }
.animated:before { position: absolute }
.animated.scaleCenter:before { bottom: -6px; transform: scale(0); transition: all ease-in-out 200ms }
.animated.scaleCenter:hover:before { transform: scale(1) }
.animated.growBottom:before { bottom: -6px; transition: all ease-in-out 200ms }
.animated.fromLeft:before { bottom: -6px; transition: all ease-in-out 200ms }
.animated.fromRight:before { bottom: -6px; transition: all ease-in-out 200ms }
.animated.inAndOut:before { bottom: -6px; transition: all ease-in-out 200ms }
```

### [Set off paper button effects](https://codepen.io/comehope/pen/KRbXGe)

on hover of li.: li.: transform+shadow+top | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
nav { box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2) }
nav ul li { transition: 0.5s ease-out }
nav ul li:hover { box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.1), 0 8px 8px rgba(0, 0, 0, 0.1), 0 12px 12px rgba(0, 0, 0, 0.1); transform: scale(1.05) translateY(-0.25em) perspective(300px) rotateX(20deg) }
```

### [Button Hover Effects](https://codepen.io/umesh1984/pen/ELOjWB)

on hover of a.primary-btn: span.line: transform ×3, span.text: color, span.line: transform+top | made with: transition · :hover

```css
.common-transition { -webkit-transition: all 0.3s ease-in-out; -moz-transition: all 0.3s ease-in-out; -ms-transition: all 0.3s ease-in-out; -o-transition: all 0.3s ease-in-out; transition: all 0.3s ease-in-out }
.primary-btn { position: relative; margin-top: 25px; text-transform: uppercase; -webkit-transition: transform .4s cubic-bezier(.2, 0, 0, 1) .4s; -moz-transition: transform .4s cubic-bezier(.2, 0, 0, 1) .4s; -o-transition: transform .4s }
.primary-btn .text { position: relative; transform: translate3d(0, 0, 0); -webkit-transition: all .4s cubic-bezier(.2, 0, 0, 1) .4s; -moz-transition: all .4s cubic-bezier(.2, 0, 0, 1) .4s; -o-transition: all .4s cubic-bezier(.2, 0, 0, 1) .4s }
.primary-btn::after { position: absolute; bottom: -2px; transition: transform .8s cubic-bezier(1, 0, .37, 1) .2s, right .2s cubic-bezier(.04, .48, 0, 1) .6s, left .4s cubic-bezier(.04, .48, 0, 1) .6s }
.primary-btn.white .text { -webkit-transition: all .4s cubic-bezier(.2, 0, 0, 1) .4s; -moz-transition: all .4s cubic-bezier(.2, 0, 0, 1) .4s; -o-transition: all .4s cubic-bezier(.2, 0, 0, 1) .4s; transition: all .4s cubic-bezier(.2, 0, 0, 1) .4s }
.primary-btn .line { position: absolute }
.primary-btn .line.left, .primary-btn .line.right { bottom: -2px; top: -2px; transform: scale3d(1, 0, 1) }
.primary-btn .line.bottom, .primary-btn .line.top { transform: scale3d(0, 1, 1) }
.primary-btn .line.right { -webkit-transition: transform .1s cubic-bezier(1, 0, .65, 1.01) .23s; -moz-transition: transform .1s cubic-bezier(1, 0, .65, 1.01) .23s; -o-transition: transform .1s cubic-bezier(1, 0, .65, 1.01) .23s; transition: transf }
.primary-btn .line.top { top: -2px; -webkit-transition: transform 80ms linear .43s; -moz-transition: transform 80ms linear .43s; -o-transition: transform 80ms linear .43s; transition: transform 80ms linear .43s }
.primary-btn .line.left { -webkit-transition: transform 80ms linear .51s; -moz-transition: transform 80ms linear .51s; -o-transition: transform 80ms linear .51s; transition: transform 80ms linear .51s; transform-origin: bottom }
.primary-btn .line.bottom { bottom: -2px; -webkit-transition: transform .3s cubic-bezier(1, 0, .65, 1.01) 0s; -moz-transition: transform .3s cubic-bezier(1, 0, .65, 1.01) 0s; -o-transition: transform .3s cubic-bezier(1, 0, .65, 1.01) 0s; transition }
```

### [Reverse text color menu effects](https://codepen.io/comehope/pen/qYMoPo)

made with: transition · :hover · mix-blend-mode

```css
nav ul li { position: relative }
nav ul li span { mix-blend-mode: difference }
nav ul li::before { position: absolute; top: 0; transition: 0.5s ease-out }
nav ul li:hover::before { transform: scale(7) }
```

### [A text sliding effect UI](https://codepen.io/comehope/pen/QrxxaW)

made with: transition · :hover

```css
h1 { position: relative }
h1::after { position: absolute; top: -0.35em; transform: rotate(15deg); filter: opacity(0.3) }
p { box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2); position: relative }
p span { position: absolute; top: 0; transition: 0.5s ease-out }
p .answer { text-transform: uppercase }
```

### [Split text menu effects](https://codepen.io/comehope/pen/XqYroe)

made with: transition · :hover · clip-path

```css
.menu li { text-transform: uppercase; border-top: 1px solid transparent; position: relative; transition: 0.3s }
.menu li:hover { border-top: 1px solid yellow }
.menu li::before, .menu li::after { position: absolute; top: -0.5em; transition: 0.3s ease-out }
.menu li::before { clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%) }
.menu li::after { clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%) }
.menu li:hover::before, .menu li:hover::after { transition: left 0.3s ease-out }
```

### [Stroke morphing 404 effects](https://codepen.io/comehope/pen/ZoxjXm)

on scroll: span.: background+top ×6, span.: background ×4 | made with: transition · :hover

```css
.error > * { position: relative }
.error span { position: absolute; filter: opacity(0.8); transition: 0.3s }
.four span:nth-child(2) { top: 50% }
.zero span:nth-child(2) { top: 10% }
.zero span:nth-child(4) { bottom: 10% }
.error:hover .four span:nth-child(1) { top: 20% }
.error:hover .four span:nth-child(2) { top: 0 }
.error:hover .zero span:nth-child(2) { top: 0 }
.error:hover .zero span:nth-child(4) { bottom: 0 }
```

### [Broken text effects](https://codepen.io/comehope/pen/LmjNgL)

made with: transition · :hover · clip-path

```css
.text { position: relative }
.text::before, .text::after { position: absolute; top: 0; transition: 0.2s }
.text::before { clip-path: polygon(0 0, 60% 0, 30% 100%, 0 100%) }
.text::after { clip-path: polygon(60% 0, 100% 0, 100% 100%, 30% 100%) }
.text:hover::before { transform: rotate(-5deg); top: -0.05em }
.text:hover::after { transform: rotate(5deg); top: 0.05em }
```

### [Simple banner column hover effect](https://codepen.io/meinar/pen/xjdyoY)

on scroll: div.col: color, div.restaurant__title: color | made with: transition · :hover

```css
.banner { position: relative }
.banner .restaurant { transition: all 0.5s ease; position: static }
.banner .restaurant:before { position: absolute; top: 0; bottom: 0; transition: all 0.5s ease }
```

### [Aimed button effects](https://codepen.io/comehope/pen/ELWMLr)

on scroll: div.box: filter, span.top: filter, span.bottom: filter, span.left: filter, span.right: filter | made with: @keyframes · transition · :hover

```css
.box { position: relative; filter: blur(2px); transition: 0.5s }
.box:hover { filter: blur(0.2px) }
.box::after { position: absolute; filter: opacity(0) }
.box span:not(:first-child) { position: absolute; filter: opacity(0) }
.box span.top { top: -3em }
.box span.bottom { bottom: -3em }
.box span.left, .box span.right { top: 50% }
.box:hover::after, .box:hover span:not(:first-child) { animation: aim 1s linear infinite alternate }
from { filter: opacity(0.2) }
to { filter: opacity(0.8) }
@keyframes aim animates filter
```

### [Expanding Gradient Underline Effects](https://codepen.io/christopherware/pen/qYaXpY)

on hover of a.middle: a.middle: color | made with: transition · :hover

```css
a, a:visited, a:hover, a:active { position: relative; transition: 0.8s all ease }
a:link, a:visited { position: relative }
a:after { position: absolute; top: 100%; opacity: 0.3; transform: scaleX(0) }
a:hover:after { opacity: 1; transform: scaleX(1) }
```

### [Metallic glossy 3d button effects](https://codepen.io/comehope/pen/MGeRRO)

on scroll: div.box: transform+shadow | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.box { transform: perspective(500px) rotateY(-15deg); box-shadow: 2px 0 0 5px rgba(0, 0, 0, 0.2); transition: 0.5s; position: relative }
.box:hover { transform: perspective(500px) rotateY(15deg); box-shadow: -2px 0 0 5px rgba(0, 0, 0, 0.2) }
.box::before { position: absolute; transition: 0.5s }
```

### [Button text staggered sliding effects](https://codepen.io/comehope/pen/GdpPLE)

on scroll: span.: transform+top ×6 | made with: transition · :hover

```css
.box span { transition: 0.5s }
.box span:nth-child(odd) { transform: translateY(-100%) }
.box span:nth-child(even) { transform: translateY(100%) }
.box span::before { position: absolute }
.box span:nth-child(odd)::before { transform: translateY(100%) }
.box span:nth-child(even)::before { transform: translateY(-100%) }
.box:hover span { transform: translateY(0) }
```

### [Text Hover Effect](https://codepen.io/waveciou/pen/NMGWNG)

on scroll: h1.: transform+color+top | made with: transition

```css
body { position: relative; transition: all 0.6s ease }
.hoverBox { position: absolute; top: 50%; transform: translateY(-50%) }
h1 { position: relative; transition: all 1s ease }
h1::before { position: absolute; top: 0 }
body.is-active h1 { transform: translateY(-150%) }
```

```js
addEventListener("mouseenter", function() {
addEventListener("mouseleave", function() {
```

### [Responsive Flex Images](https://codepen.io/janmez/pen/xjKwEx)

on hover of img.image__main: img.image__main: transform+opacity+top, div.image__captioncontain: opacity+background, span.image__caption: transform+opacity+top | made with: transition · :hover

```css
.container { position: relative }
.container .image__cell { position: relative; box-shadow: 2px 2px 5px 0px rgba(158, 136, 159, 0.5) }
.container .image__cell .image__main { opacity: 1; transform: scale(1); transition: opacity 0.5s, transform 0.35s ease-in }
.container .image__cell .image__captioncontain { opacity: 0; position: absolute; transition: width 0.4s ease-in, opacity 0.25s ease-out }
.container .image__cell .image__captioncontain .image__caption { opacity: 0; position: absolute; top: 50%; transform: translateY(-50%) translateX(-50%); transition: opacity 0.4s ease-in }
.container .image__cell:hover .image__main { opacity: 0.75; transform: scale(1.2) }
.container .image__cell:hover .image__captioncontain { border-top: 2px solid #FFF; opacity: 1 }
.container .image__cell:hover .image__captioncontain .image__caption { opacity: 1 }
```

### [Button with animated gradient](https://codepen.io/alexlyul/pen/bvOXrM)

made with: nothing recognised — read the code

```css
.center { position: absolute; top: 50%; transform: translate(-50%, -50%) }
#btn { transform: translate(-50%, -50%) scale(1) }
#btn:active { transform: translate(-50%, -50%) scale(1.3) }
```

### [Button hover effect css3](https://codepen.io/dkprajapati/pen/bvvJXv)

made with: transition · :hover

```css
a { text-transform: uppercase; position: absolute; top: 50%; transform: translate(-50%,-50%) }
a:before { position: absolute; transform: translateY(-100%) rotateX(90deg); transform-origin: bottom; transition: 0.5s }
a:after { position: absolute; transform: translateY(0%) rotateX(0deg); transform-origin: top; transition: 0.5s }
a:hover:before { transform: translateY(0%) rotateX(0deg) }
a:hover:after { transform: translateY(100%) rotateX(90deg) }
```

### [How to make animated button using css](https://codepen.io/nikhilmangal/pen/geRvbP)

on hover of button.animated-button: button.animated-button: transform+shadow+top, i.fas: transform+top | made with: transition · :hover

```css
.animated-button { transition:all .3s linear; -webkit-transition:all .3s linear; -moz-transition:all .3s linear }
.animated-button:hover { transform:scale(1.2); box-shadow:0px 0px 20px rgba(0,0,0,.2) }
.animated-button i { transition:all .3s linear; -webkit-transition:all .3s linear; -moz-transition:all .3s linear }
.animated-button:hover i { transform:rotate(360deg) }
```

### [Lexi Hover Effect](https://codepen.io/prabiz/pen/ZxEVWx)

on hover of img.: img.: transform+opacity, div.content-wrap: transform+opacity+top | made with: transition · :hover

```css
.hover-content figure { position: relative }
.hover-content .effect img { position: relative }
.hover-content .effect:hover img { opacity: 0.6; -webkit-transform: translate3d(0, 0 ,0); -ms-transform: translate3d(0, 0 ,0); -o-transform: translate3d(0, 0 ,0); transform: translate3d(0, 0 ,0) }
.hover-content .effect figcaption { position: absolute; top: 0; text-transform: uppercase }
.hover-content .effect figcaption:before { bottom: -100px; box-shadow: 0 0 0 900px rgba(255,255,255,0.2); position: absolute; opacity: 0; -webkit-transform: scale3d(0.5,0.5,1); transform: scale3d(0.5,0.5,1) }
.hover-content .effect:hover figcaption:before { opacity: 1; -webkit-transform: scale3d(1,1,1); -ms-transform: scale3d(1,1,1); -o-transform: scale3d(1,1,1); transform: scale3d(1,1,1); -webkit-transition: opacity 0.35s, transform 0.35s; -o-transition: opacity 0.35s, tra }
.hover-content .effect figcaption h2 { opacity: 1; -webkit-transform: translate3d(5px, 5px, 0); -ms-transform: translate3d(5px, 5px, 0); -o-transform: translate3d(5px, 5px, 0); transform: translate3d(5px, 5px, 0); -webkit-transition: transform 0.35s; -o-trans }
.hover-content .effect figcaption .content-wrap { bottom: 65px; opacity: 0; position: absolute; -webkit-transform: translate3d(20px, 20px, 0); -ms-transform: translate3d(20px, 20px, 0); -o-transform: translate3d(20px, 20px, 0); transform: translate3d(20px, 20px, 0); -we }
.hover-content .effect:hover figcaption .content-wrap { opacity: 1; -webkit-transform: translate3d(0,0,0); -ms-transform: translate3d(0,0,0); -o-transform: translate3d(0,0,0); transform: translate3d(0,0,0) }
.hover-content .effect figcaption a { opacity: 0 }
.hover-content .effect figcaption > a { position: absolute; top: 0 }
```

### [Wanted](https://codepen.io/alphabetacoder/pen/MQZLpL)

made with: :hover

```css
figure { position: relative }
figcaption { position: absolute; top: 10px }
p { padding-top: 70% }
p:hover { padding-top: 100% }
```

### [Card image effect on hover](https://codepen.io/bettyst/pen/aqPdge)

on scroll: img.card-img-top: transform+filter+top | on hover of div.card-deck: img.card-img-top: transform+filter+top ×2 | made with: transition · :hover

```css
.card-deck .card .actions { position: absolute; top: 19% }
.card-deck .card .card-img-top { -webkit-transition: 0.3s linear; transition: 0.3s linear }
.card-deck .card:hover .card-img-top, .card-deck .card:focus .card-img-top { -webkit-transform: scale(1.1); transform: scale(1.1); -webkit-filter: grayscale(50%) }
.card-deck .card .card-body { position: relative }
```

### [Css Hover tabs Highlight](https://codepen.io/akky7777/pen/eVbYKR)

on scroll: a.link-1: opacity, a.link-2: opacity, a.link-3: opacity, a.link-5: opacity | on hover of li.: a.link-1: opacity, a.link-4: opacity | made with: transition · :hover

```css
.container-inner ul li a { text-transform: uppercase; transition: all ease 0.3s }
.container-inner ul li a:hover { opacity: 1 }
.container-inner ul:hover li a { opacity: 0.2 }
.container-inner ul li a:hover { opacity: 1 }
```

### [Stamp vignette hover effect](https://codepen.io/2kool2/pen/mXpwbL)

held: fixed footer.myStuff | on hover of button.: div.stamp_img-bg7: filter | made with: position: fixed · transition · :hover · custom properties driven by JS

```css
body { padding-bottom: 2rem }
[class^="stamp_link"] { transition: color .3s ease-out }
[class^="img_container"] { position: relative }
[class^="stamp_img-bg"] { background-position: center }
[data-vignetteOpacity]::after { position: absolute; top: 0; bottom: 0; opacity: var(--vignetteOpacity, .5); box-shadow: inset 0 0 1rem 0 hsla(0,0%,0%, calc(var(--vignetteOpacity, .5) / 2)); transition: opacity .3s ease-out }
a:hover [data-vignetteOpacity]::after, a:focus [data-vignetteOpacity]::after { will-change: opacity; opacity: 0 }
[data-imgBrightness] { transition: filter .3s ease-out }
a:hover [data-imgBrightness], a:focus [data-imgBrightness] { will-change: filter; filter: brightness(var(--imgBrightness, 100%)) }
```

```js
style.setProperty("--image", e.target.value)
```

### [Link hover effect](https://codepen.io/ellissei/pen/xYgdWo)

made with: transition · :hover

```css
a { position: relative }
a:after { position: absolute; transition: width 0.4s 0.3s }
```

### [Image hover effect with icon](https://codepen.io/saifah/pen/wpVzez)

on hover of img.img-responsive: img.img-responsive: opacity+filter, i.fa: transform+top, a.: color | made with: transition · :hover

```css
.image_item { position: relative }
.image_item { box-shadow: 0 0 5px rgba(0, 0, 0, 0.15) }
.image_item i { position: absolute; top: 50%; box-shadow: 0 0 5px rgba(0, 0, 0, 0.15); -webkit-transform: translate(-50%, -50%) scale(0); transform: translate(-50%, -50%) scale(0); transition: all 300ms 0ms cubic-bezier(0.6, -0.28, 0.73 }
.image_item a { top: 0; bottom: 0; position: absolute }
.image_item:hover img { opacity: 0.3; -webkit-filter: grayscale(100%); filter: grayscale(100%) }
.image_item:hover i { -webkit-transform: translate(-50%, -50%) scale(1); transform: translate(-50%, -50%) scale(1); transition: all 300ms 100ms cubic-bezier(0.175, 0.885, 0.32, 1.275) }
```

### [Background Image hover effect with icon](https://codepen.io/saifah/pen/baXwBw)

on scroll: div.hover: opacity, i.fa: transform+top | made with: transition · :hover

```css
.image_item { position: relative }
.bg_cover { background-position: center }
.image_item { position: relative; box-shadow: 0 0 5px rgba(0, 0, 0, 0.15) }
.image_item * { -webkit-transition: all 0.35s ease-in-out; transition: all 0.35s ease-in-out }
.image_item .hover { position: absolute; top: 0; bottom: 0; opacity: 0 }
.image_item .hover i { position: absolute; top: 50%; box-shadow: 0 0 5px rgba(0, 0, 0, 0.15); -webkit-transform: translate(-50%, -50%) scale(0); transform: translate(-50%, -50%) scale(0); transition: all 300ms 0ms cubic-bezier(0.6, -0.28, 0.73 }
.image_item:hover .hover { opacity: 1 }
.image_item:hover .hover i { -webkit-transform: translate(-50%, -50%) scale(1); transform: translate(-50%, -50%) scale(1); transition: all 300ms 100ms cubic-bezier(0.175, 0.885, 0.32, 1.275) }
```

### [Smiley animation](https://codepen.io/web-tiki/pen/zpmeKy)

made with: @keyframes · :hover

```css
svg { transform:rotateZ(0deg) }
svg:hover { animation:rotate 1.2s cubic-bezier(0.65, 0.000, 0.75, 1.000) }
svg:hover .smile { animation: smile 1s cubic-bezier(0.2, 0.000, 0.8, 1.000) }
svg:hover .eyes { animation: eyes 1s cubic-bezier(.7, 0.000, 0.4, 1.000) }
to { transform:rotateZ(720deg) }
@keyframes rotate animates transform
@keyframes smile animates stroke-dasharray
@keyframes eyes animates stroke-dasharray
```

### [Call To Action Button Animation](https://codepen.io/webdoktoru/pen/YYOQaO)

on scroll: div.ring: transform+opacity+color+top ×5, i.fa: color+top ×5, div.: color | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.digerleri { top: 800px }
.digerleri #ucbuton { position: absolute; top: 50%; -webkit-transform: translate(-50%, -50%); -moz-transform: translate(-50%, -50%); -o-transform: translate(-50%, -50%); transform: translate(-50%, -50%); -webkit-transition: all 0.6s cubic-bez }
.digerleri #ucbuton .ring { position: absolute; top: 40%; -webkit-transition: all 1s cubic-bezier(0.55, 0, 0.1, 1); -moz-transition: all 1s cubic-bezier(0.55, 0, 0.1, 1); -o-transition: all 1s cubic-bezier(0.55, 0, 0.1, 1); transition: all 1s cubic }
.digerleri #ucbuton:hover .one { transform: perspective(500px) translate3d(-90px, -50px, 150px); opacity: 1 }
.digerleri #ucbuton:hover .two { transform: perspective(800px) translate3d(-130px, 50px, 180px); opacity: 0.6 }
.digerleri #ucbuton:hover .three { transform: perspective(800px) translate3d(130px, 50px, 30px); opacity: 0.2 }
.digerleri #ucbuton:hover .four { transform: perspective(800px) translate3d(110px, -80px, 80px); opacity: 0.9 }
.digerleri #ucbuton:hover .five { transform: perspective(800px) translate3d(-20px, -120px, 70px); opacity: 0.9 }
.digerleri #ucbuton::after { position: absolute; top: -35px; transform: perspective(800px) scale(0) rotate(0deg); -webkit-transition: all 2s cubic-bezier(0.55, 0, 0.1, 1); -moz-transition: all 2s cubic-bezier(0.55, 0, 0.1, 1); -o-transition: all 2s  }
.digerleri #ucbuton:before { position: absolute; top: -40px; transform: perspective(800px) scale(0.4) rotate(0deg); -webkit-transition: all 2s cubic-bezier(0.55, 0, 0.1, 1); -moz-transition: all 2s cubic-bezier(0.55, 0, 0.1, 1); -o-transition: all 2 }
.digerleri #ucbuton:hover::after { transform: perspective(800px) scale(1) rotate(600deg) }
.digerleri #ucbuton:hover::before { transform: perspective(800px) scale(1) rotate(-100deg) }
```

### [Night sky through cat eyes/glasses (moving background hover effect)](https://codepen.io/SBDesign/pen/wpXEJe)

made with: nothing recognised — read the code

```css
body { position: 40% 60% }
.cat-glass { border-top: solid 15em; border-bottom: solid 5em }
body { position: 25% 35% }
```

### [CSS hover effects without animation](https://codepen.io/katako/pen/MrOmqP)

on hover of button.: button.: background | made with: :hover

```css
#second button { filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00b7ea', endColorstr='#009ec3',GradientType=0 ) }
#second button:hover { filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00b7ea', endColorstr='#00618e',GradientType=0 ) }
#third button { border-bottom: solid 6px coral; border-top:none }
#fourth button { box-shadow: 0 1px 2px rgba(0,0,0,0.15) }
#fourth button:hover { box-shadow: 0 5px 15px rgba(0,0,0,0.3) }
#fifth button:hover { padding-top:22px; padding-bottom:18px }
#sixth button { box-shadow: 0 1px 2px rgba(0,0,0,0.15) }
#sixth button:hover { box-shadow: 0 5px 15px rgba(0,0,0,0.3) }
```

### [Horizontal Picture Thumbnails](https://codepen.io/_NoobPanda_/pen/wprwPp)

on hover of a.: div.info-container: transform+shadow+top | made with: transition · :hover

```css
.info-container { position:relative; box-shadow: 0px 0px 50px 10px rgba(0,0,0,0.38); transition: all 200ms ease-out }
.info-container:hover { box-shadow: 0px 0px 100px #000000; transition: all 300ms ease-in; transform: scale(1.08) }
.info-container:active { transform: translateZ(2px); box-shadow: 0px 0px 100px rgba(0,0,0,0.38) }
.info-thumb-header { position: absolute; bottom:15% }
.info-thumb-section { bottom:10%; position: absolute }
```

### [Link hover effect with box-shadow](https://codepen.io/donroyco/pen/mpegLV)

on hover of a.: a.: shadow | made with: transition · :hover

```css
a { box-shadow: inset 0 -1px 0 rgba(211, 47, 47, 0.6); transition: box-shadow 0.3s ease-in-out }
a:hover { box-shadow: inset 0 -23px 0 rgba(211, 47, 47, 0.6) }
```

### [Awesome circle hover effect](https://codepen.io/poojavpatel/pen/LOXoKJ)

on scroll: div.photo: transform+top, div.content: transform+opacity | made with: transition · :hover

```css
.box { transition: all 0.35s ease-in-out }
.photo { background-position: 20% 20% }
.content p { border-top: 1px solid rgba(12, 11, 11, 0.5) }
.photo { transform: translatex(0%) scale(1); transition: all 0.35s ease-in-out }
.content { transform: translate(-100%, -100%); opacity: 0; transition: all 0.35s ease-in-out }
.box:hover .photo { transform: translatex(50%) scale(0.5); transition: all 0.35s ease-in-out }
.box:hover .content { transform: translate(0%, -100%); opacity: 1; transition: all 0.35s ease-in-out }
```

### [Awesome hover effect - video section for MFC](https://codepen.io/cssmfcpro/pen/RjqwZr)

on hover of img.: div.kin: transform+top ×2, img.: transform+opacity+shadow+top ×2, div.: opacity+top ×2, a.: background+color+top ×2 | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
section { box-shadow:4px 4px 4px #000 }
.scr::-webkit-scrollbar-track { -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3) }
.scr::-webkit-scrollbar-thumb { -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.7) }
abbr { border-bottom:1px dotted #ccc }
.xcr::-webkit-scrollbar-track { -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3) }
.xcr::-webkit-scrollbar-thumb { -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.7) }
#videos:hover h1.headerz:before, #videos:hover h1.headerz:after, #tippers:hover  { transition: all 0.5s }
.phto { perspective: 1000px }
.phto .kin { transition: all 0.5s }
.phto:hover .kin { transform: rotateX(80deg); transform-origin: bottom }
.phto .kin:after { position: absolute; bottom:0; background-position:center; transform: rotateX(90deg); transform-origin: bottom }
.phto .kin div { text-transform: uppercase; position: absolute; bottom: 100%; transform: rotateX(-89.99deg); transform-origin: bottom }
```

### [Letter Spacing Hover Effect](https://codepen.io/arturoalviar/pen/gXBgMw)

made with: transition · :hover

```css
h1 { text-transform: uppercase }
.heading-main { margin-bottom: 1rem }
.has-spacing-animation { position: relative; transition: all 0.6s ease }
ul li { position: relative }
```

### [Drawing svg animation on hover with css](https://codepen.io/jvicens/pen/aVqBwm)

made with: @keyframes · :hover

```css
.read-more p { margin-top: 50% }
.read-more a { position: absolute; top: 50px }
.read-more .encircle { position: absolute; top: 5px }
.read-more:hover .cls-1 { animation: dash 5s linear alternate infinite }
@keyframes dash animates stroke-dashoffset
```

### [D3 Donut Chart](https://codepen.io/JFlo/pen/QOMvOp)

made with: @keyframes · transition · :hover

```css
.pie { position: absolute; top: 50%; transform: translate(-50%, -50%); filter: drop-shadow(0 2px 0px #333) }
.data-text { transition: transform 0.2s ease-in-out }
.data-text__value { transform: translateY(-0.5rem); opacity: 0 }
.data-text__name { transform: translateY(0.5rem); opacity: 0 }
.data-text--show { transform: translateY(0); -webkit-animation: fadeGraphTextIn 0.5s forwards; animation: fadeGraphTextIn 0.5s forwards }
from { opacity: 0 }
to { opacity: 1 }
from { opacity: 0 }
to { opacity: 1 }
@keyframes fadeGraphTextIn animates opacity
```

### [Social media hover effect](https://codepen.io/dkprajapati/pen/EbKMVd)

made with: transition · :hover

```css
ul { position: absolute; top: 50%; transform: translate(-50%, -50%) }
ul li a { text-transform: capitalize; position: relative }
ul li a:after { position: absolute; top: 0; transform: scaleX(0); transition:transform 0.5s ease-in-out }
ul li a:hover:after { transform: scaleX(1) }
```

### [menu icon effect#1 : menu to close](https://codepen.io/mayurpunjabi/pen/zPxjyJ)

made with: transition · :hover

```css
.container { position: relative; transform: translateX(-50%) }
.container span { position: absolute; transition: .5s }
.container span:nth-child(1) { top: 20px }
.container span:nth-child(2) { top: 80px }
.container span:nth-child(3) { top: 80px }
.container span:nth-child(4) { top: 140px }
.container:hover span:nth-child(1) { top: -20px; opacity: 0 }
.container:hover span:nth-child(2) { transform: rotateZ(45deg) }
.container:hover span:nth-child(3) { transform: rotateZ(-45deg) }
.container:hover span:nth-child(4) { top: 200px; opacity: 0 }
```

### [Triangle UI concept test](https://codepen.io/web-tiki/pen/RLMaea)

made with: transition · :hover

```css
#wrap { position: relative; padding-bottom: 66.25% }
.top, .bottom { position: absolute; top: 0 }
.top::after, .bottom::after { position: absolute; top: 0; transition: opacity 0.2s; opacity: 0 }
.top:hover::after, .bottom:hover::after { opacity: 1 }
.bottom { top: 50% }
.left, .right { position: absolute; top: 50%; transform: rotate(33.5deg) skew(-23deg) }
.left::before, .left::after, .right::before, .right::after { position: absolute; top: 0; transform: skew(23deg) rotate(-33.5deg) }
.left::after, .right::after { opacity: 0; transition: opacity 0.2s }
.left:hover::after, .right:hover::after { opacity: 1 }
.right { transform: rotate(-33.5deg) skew(23deg) }
.right::before, .right::after { transform: skew(-23deg) rotate(33.5deg) }
```

### [Gradiant Hover Effect for Team Member Section)](https://codepen.io/iRoni/pen/OxOvzG)

on scroll: a.: transform+top ×3, div.member-overlay: transform+opacity+top, p.icon-links: transform+top | on hover of img.: a.: transform+top ×6, div.member-overlay: transform+opacity+top ×2, p.icon-links: transform+top ×2 | made with: transition · :hover · (hover: hover) gate

```css
.team-member { position: relative }
.team-member img { position: relative; -webkit-transition: all 0.4s ease-in; transition: all 0.4s ease-in }
.team-member .member-info h4 { text-transform: uppercase; opacity: 0.8 }
.member-hover { position: relative }
.member-overlay { position: absolute; top: 0; opacity: 0; filter: alpha(opacity=0); -webkit-transform: translate(460px, -100px) rotate(180deg); -ms-transform: translate(460px, -100px) rotate(180deg); transform: translate(460px, -100px) ro }
.member-hover:hover .member-overlay { opacity: 1; filter: alpha(opacity=100); -webkit-transform: translate(0px, 0px); -ms-transform: translate(0px, 0px); transform: translate(0px, 0px) }
p.icon-links { position: absolute; bottom: 0; margin-bottom: 0; -webkit-transition: -webkit-transform 0.35s ease-out; transition: transform 0.35s ease-out; -webkit-transform: translateY(52px); transform: translateY(52px) }
p.icon-links a { opacity: 0.7 }
p.icon-links a { -webkit-transition: -webkit-transform 0.35s; transition: transform 0.35s; -webkit-transform: translateY(52px); transform: translateY(52px) }
.member-hover:hover p.icon-links { -webkit-transform: translateY(0px); transform: translateY(0px) }
.member-hover:hover .icon-links a:nth-child(3) { -webkit-transform: translateY(0px); transform: translateY(0px) }
.member-hover:hover .icon-links a:nth-child(2) { -webkit-transform: translateY(0px); transform: translateY(0px) }
```

### [Nav hover effect](https://codepen.io/juan-frontdev/pen/wrrBxP)

on hover of li.: a.active: background+color | made with: transition · :hover

```css
nav ul li a { position: relative; text-transform: uppercase; transition: 0.5s }
nav ul li a::before { position: absolute; bottom: 10px; opacity: 0; transition: 0.5s }
nav ul li a:hover:before { bottom: -8px; opacity: 1 }
nav ul li a:after { position: absolute; top: 10px; opacity: 0; transition: 0.5s }
nav ul li a:hover:after { top: -8px; opacity: 1 }
```

### [TOTAL - Link Hover Effect](https://codepen.io/catjuice/pen/MEEWQo)

made with: @keyframes · transition · :hover · mix-blend-mode

```css
li { margin-bottom: 1rem }
li a { position: relative; border-bottom: 2px solid #222 }
li a:before { position: absolute; top: calc($test-size * 1.1); mix-blend-mode: multiply; transition: transform 350ms cubic-bezier(0.44, 0, 0, 1) }
li a:after { position: absolute; top: calc($test-size * 1.1); mix-blend-mode: multiply; transition: transform 350ms cubic-bezier(0.44, 0, 0, 1) }
li a:hover { border-bottom: 0px }
li a:hover:before { animation: orbitClock linear 1s infinite }
li a:hover:after { animation: orbitCounter linear 1s infinite }
from { transform: rotate(0deg) translateX(3px) rotate(0deg) }
to { transform: rotate(360deg) translateX(3px) rotate(-360deg) }
from { transform: rotate(360deg) translateX(3px) rotate(-360deg) }
to { transform: rotate(0deg) translateX(3px) rotate(0deg) }
@keyframes orbitClock animates transform
```

### [ZoomOut effect on Hover](https://codepen.io/Zorlimar/pen/zEwXmq)

on scroll: img.: transform+top | made with: transition · :hover · mix-blend-mode

```css
.wrapper { position: absolute; top: 0; transform: translate(-50%, 0%) }
.image__effect { padding-top: 40%; position: relative }
.image__effect:nth-child(2n+1) { transform: translateX(12.5%) }
.image__effect:nth-child(2n) { transform: translateX(77.5%) }
.image__effect img { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.image__effect:before, .image__effect:after { position: absolute; top: 0.5rem }
.image__effect.effect1 img { mix-blend-mode: screen; transform: translate(-50%, -50%) scale(2); transition: 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) }
.image__effect.effect1:after { mix-blend-mode: difference; opacity: 0.2 }
.image__effect.effect1:hover img { transform: translate(-50%, -50%) scale(1.3) }
.image__effect.effect2 img { mix-blend-mode: screen; transform: translate(-50%, -50%) scale(2); transition: 0.3s ease-in-out }
.image__effect.effect2:after { mix-blend-mode: difference; opacity: 0.2 }
.image__effect.effect2:hover img { transform: translate(-50%, -50%) scale(1.3) }
```

### [Memento Mori](https://codepen.io/hellomkreyes/pen/yzMXYE)

made with: transition · :hover

```css
body { position: relative }
.frame-container { position: relative; background-position: center top }
.frame-container:before { padding-top: 101% }
.glass { position: absolute; top: 50%; transform: translateX(-50%) translateY(-50%) }
.reflect { position: absolute; top: 35%; transform: translateX(-50%) translateY(-50%) rotate(35deg); box-shadow: 2px 10px 15px #666 }
.picture { position: absolute; top: 50%; transform: translateX(-50%) translateY(-50%) }
.picture:before { background-position: 80% 25%; opacity: 0; transition: all 900ms ease-in-out }
.frame-container:hover .picture:before { opacity: 1 }
```

### [text link underline effect](https://codepen.io/kuuurttyy/pen/RLpamW)

made with: transition · :hover

```css
a { background-position: 0 100%; transition: all 500ms cubic-bezier(0.62, 0.055, 0.52, 1.65) }
p { margin-bottom: 1em }
```

### [HOVER EFFECT](https://codepen.io/devMike/pen/YrpXRG)

on hover of img.: hr.: transform+opacity+top ×2, img.: transform+top, div.overlay: opacity | made with: transition · :hover

```css
.effect { position: relative }
.effect img { -webkit-transition: all 0.4s linear; transition: all 0.4s linear; position: relative }
.effect:hover img { -ms-transform: scale(1.3); -webkit-transform: scale(1.3); transform: scale(1.3) }
.effect .overlay { position: absolute; top: 0; opacity: 0; -webkit-transition: all 0.4s ease-in-out; transition: all 0.4s ease-in-out }
.effect .overlay:hover { opacity: 1 }
.effect hr { opacity: 0; position: absolute; top: 50%; -webkit-transition: opacity 0.35s, -webkit-transform 0.35s; transition: opacity 0.35s, transform 0.35s; -webkit-transform: translate3d(-50%, -50%, 0); transform: translate3d(-50% }
.effect hr:nth-child(3) { -webkit-transform: translate3d(-50%, -50%, 0) rotate3d(0, 0, 1, 90deg) scale3d(0, 0, 1); transform: translate3d(-50%, -50%, 0) rotate3d(0, 0, 1, 90deg) scale3d(0, 0, 1) }
.effect hr:nth-child(4) { -webkit-transform: translate3d(-50%, -50%, 0) rotate3d(0, 0, 1, 180deg) scale3d(0, 0, 1); transform: translate3d(-50%, -50%, 0) rotate3d(0, 0, 1, 180deg) scale3d(0, 0, 1) }
.package-1, .package-2 { position: absolute; -webkit-transition: opacity 0.35s, -webkit-transform 0.35s; transition: opacity 0.35s, transform 0.35s; -webkit-transform: translate3d(-50%, -50%, 0); transform: translate3d(-50%, -50%, 0) }
.package-1 { top: 40% }
.package-2 { top: 60% }
.effect p { text-transform: none }
```

### [Spring Text Hover Effect](https://codepen.io/nathantaylor/pen/veOGMo)

on hover of a.: span.: transform+top ×11 | made with: transition · :hover

```css
a { transform: translate3d(0, 0, 0); filter: blur(0) }
a span { position: relative; transition: transform cubic-bezier(0.77, 0, 0.175, 1) 250ms }
a span:after { position: absolute; top: 100%; transform: scaley(0.1); transition: transform cubic-bezier(0.77, 0, 0.175, 1) 250ms }
a:hover span { transform: translateY(-1em) }
a:hover span:after { transform: scaleY(1) }
a:active span { transform: translateY(0); transition: transform cubic-bezier(0.77, 0, 0.175, 1) 125ms }
a:active span:after { transform: scaleY(0.5); transition: transform cubic-bezier(0.77, 0, 0.175, 1) 125ms }
```

### [Our Team](https://codepen.io/rahuldhiman/pen/ZXYgzN)

on hover of img.: div.our_team: transform+shadow+top | made with: transition · :hover

```css
.wrapper_team .our_team { box-shadow:none; margin-bottom:10px; transform: translateY(0px); transition: all 0.5s ease 0s }
.wrapper_team .our_team .pro_detail .pro_desc { text-transform: uppercase }
.wrapper_team .our_team:hover { transform: translateY(-15px); box-shadow:0 10px 7px rgba(0, 0, 0, 0.5) }
.wrapper_our .wrap_item i { margin-bottom:6px }
```

### [Pure Css and Responsive Image Hover](https://codepen.io/Aashima/pen/RLwvvW)

on hover of img.: div.overlay: transform+opacity+top | made with: transition · :hover

```css
body { margin-top:50px !important }
.box { position: relative }
.box .overlay { position: absolute; top: 0; opacity: 0; transform:scale(0.5, 0.5); transition:all 450ms ease-out 0s }
.box:hover .overlay { opacity: 1; transform:rotateY(180deg) scale(1,1) }
.box .box-content { transform:rotateY(-180deg); padding-top: 30% }
.box .box-content h3 { margin-bottom: 10px }
.box .box-content ul li a { transition: all 0.35s ease 0s }
.box { margin-bottom: 30px }
```

### [Intense Hover Effect](https://codepen.io/kellyannmcnamara/pen/YrzYRR)

on hover of button.motumb-btn: span.: color+top ×3, button.motumb-btn: transform+color+shadow+top | made with: transition · :hover

```css
body { padding-top: 75px }
.motumb-btn { box-shadow: inset 0 0 0 3px #6495ED; text-transform: uppercase; position: relative; transition: 0.2s ease all; top: 50%; transform: translate(-50%, -50%) }
.motumb-btn span:before, .motumb-btn span:after { position: absolute; transition: 0.35s ease all }
.motumb-btn span:first-child:before { top: 0 }
.motumb-btn span:first-child:after { bottom: 0 }
.motumb-btn span:last-child:before { top: 0% }
.motumb-btn span:last-child:after { top: 100% }
.motumb-btn:before, .motumb-btn:after { position: absolute; top: 50%; transform: translateY(-50%); transition: all 0.25s ease-in-out 0.2s }
.motumb-btn:after { transition: 0.25s ease-in-out 0.2s }
.motumb-btn:hover, .motumb-btn:active, .motumb-btn:focus { box-shadow: inset 0 0 0 0 #36213E }
.motumb-btn:hover:before, .motumb-btn:active:before, .motumb-btn:focus:before { box-shadow: inset 0 0 0 4px #36213E }
.motumb-btn:hover:after, .motumb-btn:active:after, .motumb-btn:focus:after { box-shadow: inset 0 0 0 3px white }
```

### [Cool Button Hover Effects](https://codepen.io/mehra_as/pen/vJoypy)

on hover of button.btn-fade: button.btn-fade: background | made with: @keyframes · transition · :hover · 3D (perspective / preserve-3d)

```css
.btn-shake, .btn-overlay, .btn-bounce, .btn-fade { margin-bottom: 30px; box-shadow: 0px 5px 24px rgba(34, 34, 34, 0.3); text-transform: uppercase }
.button-group { margin-top: 100px }
.button-group h1 { margin-bottom: 70px; text-transform: uppercase }
.rotate { padding-top: 15px }
.btn-fade:hover { transition: 300ms ease-in }
.btn-bounce:hover { animation: bounce 1s cubic-bezier(0.075, 0.82, 0.165, 1) }
.btn-overlay { position: relative }
.btn-overlay:after { position: absolute; transform: translateY(-45%) skew(25deg) scale(0); transition: 200ms ease-in-out }
.btn-overlay:hover:after { transform: translateY(-45%) skew(25deg) scale(1) }
.btn-overlay span { position: relative }
.btn-shake:hover { animation: shake 100ms linear; animation-iteration-count: 5 }
from { transform: scale(1.1) }
```

### [Pure css and fully responsive Hover effect](https://codepen.io/Aashima/pen/GvVjeo)

on hover of img.: li.: transform+top ×2 | made with: transition · :hover

```css
.box { margin-top: 50px; position: relative }
.box:after { position: absolute; top: 0; opacity: 0; transition: all 0.5s ease 0s }
.box:hover:after { opacity: 1 }
.box .box-content { position: absolute; bottom: -100%; transition: all 0.5s ease 0s }
.box:hover .box-content { bottom: 0 }
.box h3 { text-transform: uppercase }
.box .social-links { position: absolute; top: 0 }
.box .social-links li { position: relative; transform: translateY(-100px); transition: all 0.5s ease 0s }
.box .social-links li:before { position: absolute; top: 0 }
.box:hover .social-links li { transform: translateY(0) }
.box .social-links li a { margin-top: 50px; opacity: 1; transition: all 0.3s ease 0s }
.box:hover .social-links li a { opacity: 1 }
```

### [Pure Css Hover Effect](https://codepen.io/Aashima/pen/WEmraL)

on hover of img.: a.fa: background ×2, img.: transform+top | made with: transition · :hover

```css
.box { margin-top: 50px !important }
.box .image { margin-bottom: 20px; position: relative }
.box .image:before, .box .image:after { box-shadow: 100px 0 0 rgba(255, 255, 255, 0.01) inset, 0 100px 0 rgba(255, 255, 255, 0.01) inset, -100px 0 0 rgba(255, 255, 255, 0.01) inset, 0 -100px 0 rgba(255, 255, 255, 0.01) inset; position: absolute; top: 0; transi }
.box .image:after { transform: rotate(45deg) }
.box:hover .image:after, .box:hover .image:before { box-shadow: 5px 0 0 rgba(255, 0, 0, 0.5) inset, 0 5px 0 rgba(252, 150, 0, 0.5) inset, -5px 0 0 rgba(0, 255, 0, 0.5) inset, 0 -5px 0 rgba(0, 150, 255, 0.5) inset }
.box .image img { transform: scale(1); transition: all 300ms linear 0s }
.box:hover .image img { transform: scale(1.1) }
.box .social li a { transition: all 300ms linear 0s }
.box { margin-bottom: 30px }
```

### [Pure Css service box](https://codepen.io/Aashima/pen/jLdQJx)

made with: transition · :hover

```css
body { margin-top: 50px !important }
.servicebox .service-icon { margin-bottom: 20px }
.servicebox .service-icon i.fa { transition:all 0.3s ease 0s }
.servicebox:hover .service-icon i.fa { transform:rotateY(180deg) }
.servicebox .title { border-bottom: 1px solid #DC6D99; padding-bottom: 20px; position: relative; text-transform: uppercase }
.servicebox .title:before, .servicebox .title:after { bottom: -5px; position: absolute; transition: all 0.4s ease 0s }
.servicebox .description { transition: all 300ms ease 0s }
.servicebox { margin-bottom: 30px }
```

### [Button hover effect](https://codepen.io/abadu/pen/YxJgoe)

on scroll: span.: transform+opacity+top ×6 | made with: transition · :hover

```css
.centered { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.h-button span { text-transform: uppercase; transition: 0.25s cubic-bezier(0.5, -1, 0.5, 2); opacity: 0; transform: translate(0, -20px) }
.h-button:before { position: absolute; transition: 0.25s cubic-bezier(0.5, -1, 0.5, 2); text-transform: uppercase; opacity: 1; transform: translate(0, 0px) }
.h-button:hover:before, .h-button:focus:before { opacity: 0; transform: translate(0, 20px) }
.h-button:hover span, .h-button:focus span { opacity: 1; transform: translate(0, 0) }
```

### [Social icons with css](https://codepen.io/RomanStudio/pen/qXKZOZ)

on scroll: li.icon: background, i.fa: opacity+top, i.fa: transform+opacity+top | on hover of li.icon: li.icon: background ×2, i.fa: opacity+top ×2, i.fa: transform+opacity+top ×2 | made with: @keyframes · transition · :hover

```css
.marco { position: relative; top: 50%; transform: translateY(-50%) }
.icon { position: relative }
.icon .fa { opacity: 1 }
.icon ul { position: absolute; top: 0 }
.icon ul li { position: relative; transition: all 0.5s ease }
.icon ul li .fa { position: absolute; transform: translateX(-50%); opacity: 0 }
.icon, .icon:hover:first-child, .icon:hover:nth-child(2), .icon:hover:nth-child( { transition: background 1s ease }
.icon:hover:first-child, .icon:hover:nth-child(2), .icon:hover:nth-child(3), .ic { border-bottom: 3px solid rgba(0,0,0,0.5) }
.icon:hover .fa { -webkit-animation: hidde_icons 0.65s linear forwards; animation: hidde_icons 0.65s linear forwards }
.icon:hover ul li .fa { -webkit-animation: icons .65s linear forwards; animation: icons .65s linear forwards; -webkit-animation-delay: 0.5s; animation-delay: 0.5s }
0% { opacity: 0 }
50% { opacity: 1 }
```

### [Rotating Gradient Hover Effect](https://codepen.io/andyranged/pen/gxvdXv)

on scroll: img.: filter+top, div.overlay: transform+opacity+top | on hover of img.: div.overlay: transform+top | made with: @keyframes · transition · :hover · mix-blend-mode

```css
figure { position: relative }
img { filter: saturate(1) brightness(1); transition: filter .5s }
0% { transform: rotate(0deg) }
100% { transform: rotate(359deg) }
0% { transform: rotate(0deg) }
100% { transform: rotate(359deg) }
.overlay { position: absolute; top: -50%; opacity: 0; mix-blend-mode: screen; -webkit-animation: spin 4s infinite linear; animation: spin 4s infinite linear; transition: opacity .5s }
figure:hover img { filter: saturate(0.5) brightness(1.3); transition: filter .2s }
figure:hover .overlay { opacity: 1; transition: opacity .2s }
@keyframes spin animates transform
```

### [Highlighter Hover State](https://codepen.io/viastudio/pen/gxoJOq)

made with: transition · :hover

```css
#main a { position: relative; transition: all 0.15s ease-out }
#main a:before { position: absolute; bottom: 3px; transform: scaleX(0); transition: all 0.3s ease-in-out 0s }
#main a:hover { transition: all 0.15s ease-out }
#main a:hover:before { transform: scaleX(1) }
```

### [Tabs with icons](https://codepen.io/konovalchik/pen/NvddEg)

on hover of li.active: img.: color ×2, a.: color, div.icons: background+color, div.icons: color | made with: transition · :hover

```css
#uslugi .nav li { position: relative }
#uslugi .nav li h3 { margin-top: 130px; margin-bottom: 5px; transition: all 0.1s ease-in-out }
#uslugi .nav>li>a:hover h3 { margin-top: 144px; margin-bottom: 5px }
#uslugi .nav .active h3 { margin-top: 144px; margin-bottom: 5px; opacity: 0 }
#uslugi .nav .icon_active { opacity: 0 }
#uslugi .nav .active .icon_pass { opacity: 0; transition: all 0.2s ease-in-out }
#uslugi .nav .active .icon_active { opacity: 1; transition: all 0.2s ease-in-out }
#uslugi .icons { position: absolute; transition: all 0.1s ease-in-out }
#uslugi .icon_active { top: 30px }
```

### [Untitled](https://codepen.io/ramkirat/pen/wqzBxb)

made with: transition · :hover

```css
.team { position: relative }
.text { position: absolute; top: 50%; transform: translateY(-50%) }
.overlay { position: absolute; bottom: 0; transform: translateY(100%); transform: translateY(-100%); transition: all 0.5s ease }
.team:hover .overlay { transform: translateY(0) }
```

### [Icon Hover](https://codepen.io/thelaazyguy/pen/OjXoYK)

held: fixed div.wrapper | on hover of li.: a.: color, i.fa: color | made with: position: fixed · transition · :hover

```css
.wrapper { position: fixed; top: 50%; transform: translate(-50%, -50%) }
li { position: relative }
a { position: relative; transition: all .35s }
.effect_1 li:after { position: absolute; top: 3px; bottom: 3px; transform: scale(0); transition: all .35s }
.effect_1 li:hover:after { transform: scale(1) }
.effect_2 li { position: relative }
.effect_2 li:before, .effect_2 li:after { position: absolute; top: 3px; bottom: 3px; transition: all .35s }
```

### [Split Image on Hover](https://codepen.io/masterpox/pen/PKzoMd)

made with: GSAP

```css
.placeholder { position:relative; margin-top:20px }
.gridTile { position:absolute; top:0px }
```

```js
addEventListener("mouseleave", function(e){
```

### [Move Over Effect](https://codepen.io/masterpox/pen/bRyNwb)

made with: transition

```css
.masterpoxImage { position: relative; top: 0; -webkit-transition: all .2s ease-in-out; -moz-transition: all .2s ease-in-out; -ms-transition: all .2s ease-in-out; -o-transition: all .2s ease-in-out; transition: all .2s ease-in-out }
.move { -webkit-transition: all .2s ease-in-out; -moz-transition: all .2s ease-in-out; -ms-transition: all .2s ease-in-out; -o-transition: all .2s ease-in-out; transition: all .2s ease-in-out }
```

### [Magazine Tiles w/hover effect](https://codepen.io/webdevlin/pen/QgPwWj)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
#Container { -webkit-perspective: 500px; perspective: 1000px; perspective-origin: top }
#Container { margin-bottom: 150px; -webkit-perspective: 0; perspective: 0px }
#Container { margin-bottom: 150px; -webkit-perspective: 0; perspective: 0px }
#Container { margin-bottom: 150px; -webkit-perspective: 0; perspective: 0px }
#Tiles { -webkit-transform: rotateZ(0deg); transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) }
.title:before { position: relative; -webkit-transition: all 0.3s; transition: all 0.3s; top: 82% }
.title:hover:before { text-transform: uppercase; border-bottom: 5px solid white; -webkit-transform: translate3d(0, 0, 20px); transform: translate3d(0, 0, 20px); box-shadow: 30px 30px 10px rgba(0, 0, 0, 0.5) }
[data-project-id] { background-position: center }
[data-project-id]:before { text-transform: uppercase }
.disclaimer { margin-top: 50px }
```

### [Transition Hover Effect](https://codepen.io/masterpox/pen/LLMKzB)

on hover of img.: div.auther-pic: transform+top | made with: transition · :hover

```css
.sf-featured-approve { position:absolute; top:120px; -webkit-transition: all 0.8s ease-out; -moz-transition: all 0.8s ease-out; -o-transition: all 0.8s ease-out; -ms-transition: all 0.8s ease-out; transition: all 0.8s ease-out }
.auther-bx { margin-top: 5px; background: url(inc/images/autherbg.jpg) no-repeat center top }
.auther-bx .auther-pic { transition: 2s ease; -moz-transition: 2s ease; -webkit-transition: 2s ease; -o-transition: 2s ease }
.auther-bx .auther-pic:hover { transform : rotateY(360deg) scale3d(1.1, 1.1, 1.1); -moz-transform : rotateY(360deg); -webkit-transform : rotateY(360deg) scale3d( 1.1, 1.1, 1.1); -o-transform : rotateY(360deg) }
.auther-bx .auther-pic img { -webkit-box-shadow: 3px 3px 10px 1px rgba(66,66,66,0.49); -moz-box-shadow: 3px 3px 10px 1px rgba(66,66,66,0.49); box-shadow: 3px 3px 10px 1px rgba(66,66,66,0.49) }
.auther-bx h6, .auther-bx p { text-transform: uppercase }
```

### [Pricing table](https://codepen.io/Nidheesh/pen/LLeaYe)

on scroll: div.listing-item: transform+top, figcaption.: background+top | on hover of img.: div.listing-item: transform+top ×2, figcaption.: background+top ×2 | made with: transition · :hover

```css
#title { text-transform: uppercase; margin-top: 100px }
.listing-item { margin-bottom:20px; -webkit-transition: all 0.3s ease; -moz-transition: all 0.3s ease; transition: all 0.3s ease; -webkit-box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.10); -moz-box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.10); box }
.listing-item:hover, .listing-item.active { -webkit-transform: scale(1.03); -moz-transform: scale(1.03); transform: scale(1.03); -webkit-transition: all 0.3s; -moz-transition: all 0.3s; transition: all 0.3s }
.listing-item .listing { position:relative }
.listing-item .listing:before { position:absolute; top:-15px; border-bottom:20px solid #fff }
figure.image { position: relative }
figure.image figcaption { position: absolute; top: 0; bottom: 4px }
figcaption .caption { position:relative; top:50%; -moz-transform:translateY(-50%); -webkit-transform:translateY(-50%); transform:translateY(-50%) }
figcaption h1 { text-transform: uppercase }
.listing h4:not(:last-child) { border-bottom: 1px solid #ccc }
```

### [Diagonal button hover](https://codepen.io/ladycarni/pen/Ogzmwr)

on hover of a.button: a.button: color | made with: transition · :hover

```css
html *, *:before, *:after { transition: 0.5s ease-in-out }
.button { position: relative; text-transform: uppercase }
.button:before, .button:after { position: absolute; top: 0; bottom: 0 }
.v1:before { transform: translateX(-125%) skew(35deg) }
.v1:after { transform: translateX(265%) skew(35deg) }
.v1:hover:before { transform: translateX(0) skew(35deg) }
.v1:hover:after { transform: translateX(140%) skew(35deg) }
.v2:before { transform: translateX(125px) skew(35deg) }
.v2:after { transform: translateX(125px) skew(35deg) }
.v2:hover:before { transform: translateX(125px) skew(35deg) }
.v2:hover:after { transform: translateX(12%) skew(35deg) }
```

### [Simple hover and click effect](https://codepen.io/VamOSGS/pen/JJOerm)

made with: @keyframes · transition

```css
body .screen { position: relative; bottom: 0; transition: 0.5s cubic-bezier(0.94, 0.21, 0.63, 1.09) 0.5s }
body .screen .clickedText { bottom: 50%; text-transform: uppercase }
body .screen.clicked { animation: widthAnim 0.5s cubic-bezier(0.17, 0.67, 0.86, -0.23) }
body .btn { text-transform: uppercase; position: relative }
body .btn::before { position: absolute; transition: 0.3s ease-in-out }
body .btn .click { position: absolute; top: -50px; transition: 0.2s linear }
body .btn .hov { position: relative; bottom: 0; transition: 0.2s linear }
body .btn.hoverd .click { top: 0 }
body .btn.hoverd .hov { bottom: -50px }
body .btn.hoverdOut .left { transition: 0.2s linear 0s }
body .btn.hoverdOut .top { transition: 0.2s linear 0.2s }
body .btn.hoverdOut .right { transition: 0.2s linear 0.4s }
```

### [Tribute to Vincent Van Gogh](https://codepen.io/Jiacomina/pen/jwBygP)

on scroll: img.picture1: opacity+top | on hover of a.: img.portrait: opacity, img.picture1: opacity | made with: transition · :hover

```css
.sub-title { margin-bottom: -10px; padding-top: 70px }
.title { margin-bottom: 50px }
.hover-effect { position: relative }
.image-row:last-child .hover-effect .text { top: 10% }
.hover-effect .text { position: absolute; top: 20%; bottom: 10% }
.hover-effect:hover img { opacity: 0; transition: all 0.1s ease-in-out 0.1s }
.wiki-link { padding-top: 30px; padding-bottom: 50px }
.wiki-hover-effect { position: relative }
.wiki-hover-effect:hover img { opacity: 0.5; transition: all 0.1s ease-in-out 0s }
```

### [Hover Effect - Catch him if you can](https://codepen.io/jlnljn/pen/MmMLwN)

made with: position: fixed · transition · :hover

```css
body { position: fixed }
body > div { position: absolute; top: 20%; bottom: 20% }
p { position: absolute; bottom: 60%; text-transform: uppercase }
p > span { text-transform: none; padding-top: 15px }
p > span > a { position: relative; border-bottom: 2px solid #E4F1FE; text-transform: uppercase; padding-bottom: 2px; transition: 0.75s }
p > span > a:hover { padding-bottom: 4px; transition: 0.25s }
a.link { position: absolute; top: 60%; transition: 0.5s; box-shadow: 0 0 10px rgba(0, 0, 0, 0.25) }
a.link > span { text-transform: uppercase }
```

### [Arrow Hover Animation Effect](https://codepen.io/vanss472/pen/GmzKQq)

on hover of li.unc-swiper-button-prev: button.swiper-button-prev: background | made with: transition · :hover

```css
ul.swiper-button-wrapper { position: relative }
ul.swiper-button-wrapper li.unc-swiper-button-prev button.swiper-button-prev::af { position: absolute; top: 47%; transition: width 0.3s 0.2s }
ul.swiper-button-wrapper li.unc-swiper-button-next button.swiper-button-next::af { position: absolute; top: 47%; transition: width 0.3s 0.2s }
```
