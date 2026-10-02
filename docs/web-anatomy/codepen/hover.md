# CodePen · hover — how each pen does it

500 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/hover.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| :hover | 417 |
| transition | 406 |
| @keyframes | 103 |
| pointer / mouse tracking | 85 |
| position: fixed | 64 |
| backdrop-filter | 59 |
| 3D (perspective / preserve-3d) | 53 |
| requestAnimationFrame | 41 |
| mix-blend-mode | 39 |
| :has() | 37 |
| custom properties driven by JS | 35 |
| GSAP | 33 |
| clip-path | 30 |
| mask | 21 |
| prefers-reduced-motion | 17 |
| :focus-visible | 13 |
| canvas 2D | 10 |
| (hover: hover) gate | 9 |
| position: sticky | 8 |
| IntersectionObserver | 5 |
| three.js / WebGL | 5 |
| Web Animations API (.animate) | 4 |
| Lenis / smooth scroll | 4 |
| view() timeline | 3 |
| scroll listener | 3 |
| view transitions | 3 |
| scroll-driven animation (animation-timeline) | 3 |
| ScrollTrigger | 3 |
| anime.js | 2 |
| animation-range | 2 |
| scroll() timeline | 2 |
| popover | 2 |
| @starting-style | 1 |
| container queries | 1 |

## Every pen

### [Interactive Service Cards — Mouse Spotlight Effect](https://codepen.io/editor/izrada-sajtova-rs/pen/01a0f3c0-a424-7039-8b33-090e949f1236)

on scroll: div.border-glow: transform+top ×2 | on hover of div.cards: div.border-glow: transform+top ×3, article.card: transform+shadow | made with: @keyframes · transition · :hover · pointer / mouse tracking

```css
.card { position: relative; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25); transition: transform 0.35s ease, box-shadow 0.35s ease }
.card:hover { transform: translateY(-10px); box-shadow: 0 38px 85px rgba(0, 0, 0, 0.42), 0 0 45px rgba(212, 175, 55, 0.06) }
.border-glow { position: absolute; inset: -120%; opacity: 0; animation: border-spin 4.5s linear infinite; transition: opacity 0.35s ease }
.card:hover .border-glow { opacity: 1 }
.card::after { position: absolute; inset: 2px }
to { transform: rotate(360deg) }
.spotlight { position: absolute; filter: blur(10px); transform: translate(-50%, -50%); opacity: 0; transition: opacity 0.25s ease }
.card:hover .spotlight { opacity: 1 }
.number { position: absolute; top: 22px }
.icon { margin-bottom: 75px; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04) }
.card a { position: absolute; bottom: 28px; transition: color 0.3s ease, transform 0.35s cubic-bezier(.2,.8,.2,1) }
.card a:hover { transform: scaleX(1.16) }
```

```js
addEventListener("mousemove", (e) => {
```

### [late hour](https://codepen.io/editor/fede_cp/pen/01a04d59-8450-709e-8543-9777b00c1959)

held: fixed canvas, fixed a | on scroll: p.hint: opacity+color | made with: position: fixed · transition · :hover · :focus-visible · prefers-reduced-motion · GSAP · canvas 2D · requestAnimationFrame

```css
#ambient { position: fixed; inset: 0 }
.card { position: relative; transition: border-color 800ms cubic-bezier(0.45, 0, 0.55, 1) }
.card::before { position: absolute; inset: 0; box-shadow: var(--ink) -0.5cqi 0.5cqi 2.5cqi inset; transition: opacity 900ms cubic-bezier(0.5, 1, 0.89, 1) }
.card::after { position: absolute; inset: 0; opacity: 0; transition: opacity 800ms cubic-bezier(0.5, 1, 0.89, 1) }
.card:where(:hover, :focus-within)::before { opacity: 0 }
.card:where(:hover, :focus-within)::after { opacity: 1 }
.page { position: relative }
.eyebrow { text-transform: uppercase; opacity: 0.85 }
.poem { transition: background 300ms ease, box-shadow 300ms ease }
.poem.editing { box-shadow: 0 0 0 1px var(--ember) }
.hint { text-transform: uppercase; opacity: 0; transition: opacity 400ms ease, color 400ms ease }
.card:where(:hover, :focus-within) .hint { opacity: 0.65 }
```

```js
addEventListener("mouseenter", this)
addEventListener("mouseleave", this)
requestAnimationFrame(() => this.animate(fnName))
requestAnimationFrame(tick)
addEventListener('mouseenter', setTarget)
addEventListener('mouseleave', clearTarget)
gsap.from('#card', { opacity: 0, y: 24, duration: 1.1, ease: 'power3.out' })
```

### [Three CSS Button Hover Effects](https://codepen.io/AbdullahSajjad/pen/MYpYRBW)

on hover of a.btn: a.btn: transform+shadow+top | made with: transition · :hover

```css
.btn-lift { transition: transform 0.2s ease, box-shadow 0.2s ease }
.btn-lift:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18) }
.btn-wipe { position: relative; transition: color 0.25s ease }
.btn-wipe::before { position: absolute; inset: 0; transform: scaleX(0); transition: transform 0.25s ease }
.btn-wipe:hover::before { transform: scaleX(1) }
.btn-spread { transition: letter-spacing 0.25s ease }
```

### [GSAP Cursor Follow Blob Button Hover Animation](https://codepen.io/editor/CoderBaljit/pen/01a00b80-bfa8-7300-a6d2-838b5afc6ecf)

on scroll: button.: color, span.blob: transform+color+top | made with: transition · pointer / mouse tracking

```css
button { position: relative; transition: color ease-out 0.3s }
.blob { position: absolute; top: 0; transform: translate(-50%, 50%) scale(0); transition: transform ease-out 0.3s }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseleave", ()=>{
```

### [Anti-Gravity Tech Simulator (Includes Anti-Matter Suspension)](https://codepen.io/editor/Sammysamuel/pen/019fe21d-3d01-7ca1-b012-29b981a4d1c8)

held: fixed button | on hover of button.: button.: opacity | made with: position: fixed · transition · :hover · canvas 2D · requestAnimationFrame

### [Button Hover Animations](https://codepen.io/editor/nintendo-sixty-paul/pen/019f8f62-a56c-7a2c-89f2-60c66788cd7e)

on scroll: a.btn: color | on hover of a.btn: a.btn: color ×2, span.text: color | made with: @keyframes · transition · :hover

```css
.btn-icon { transition: color .2s ease .1s }
.btn-icon .icon { position: relative }
.btn-icon .icon:before { position: absolute; top: 50%; transform: translate(-50%, -50%) scale(1); transition: transform .4s ease-in-out }
.btn-icon .icon svg { position: relative }
.btn-icon:hover { transition: color .2s ease .2s }
.btn-icon:hover .icon:before { transform: translate(-50%, -50%) scale(10) }
.btn-gradient-border { animation: borderGradient 7s infinite linear; background-position: 400% 0; transition: border .3s ease, color .3s ease }
0% { background-position: 0% }
100% { background-position: 400% }
.btn-rollover { position: relative; transition: color .3s ease }
.btn-rollover span { animation: rolloverTextOut .5s forwards; position: relative }
.btn-rollover:before { position: absolute; top: 100%; transform: translate(-50%, -50%); transition: transform 0.75s ease, width 0.75s ease, height 0.75s ease }
```

### [WebGL Text Hover](https://codepen.io/editor/mustafauncuoglu/pen/019f8639-7463-7ed2-a7ad-da19d1f5ef9f)

made with: position: fixed · mix-blend-mode · GSAP · pointer / mouse tracking · requestAnimationFrame

```css
body { position: fixed }
canvas { position: absolute; top: 0 }
.mask { position: absolute; mix-blend-mode: screen }
svg { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

```js
addEventListener("mousemove", updateMouse, false)
requestAnimationFrame(update)
```

### [Animated Hover Reveal Card UI | Pure CSS](https://codepen.io/editor/IreneMariyamPrince/pen/019f652b-9bad-73ee-aeb7-0f372fd6a832)

made with: transition · :hover

```css
.hover-card { position: relative; box-shadow: 0 10px 20px rgba(0,0,0,0.1) }
.card-img { transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease }
.card-overlay { position: absolute; top: 0; opacity: 0; transition: opacity 0.6s ease }
.card-content { transform: translateY(40px); transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) }
.category { text-transform: uppercase; margin-bottom: 10px; opacity: 0; transform: translateY(20px); transition: all 0.4s ease 0.1s }
.description { opacity: 0; transform: translateY(20px); transition: all 0.4s ease 0.2s }
.read-more { opacity: 0; transform: translateY(20px); transition: all 0.4s ease 0.3s }
.read-more span { transition: transform 0.3s ease }
.read-more:hover span { transform: translateX(5px) }
.hover-card:hover .card-img { transform: scale(1.1); opacity: 0.6 }
.hover-card:hover .card-overlay { opacity: 1 }
.hover-card:hover .card-content { transform: translateY(0) }
```

### [Hover Preview Directory](https://codepen.io/axmr97/pen/rajdzOo)

held: fixed nav.jump-rail, fixed aside.section-preview, fixed button.back-to-top | on scroll: button.jump-button: transform+shadow | on hover of button.jump-button: aside.section-preview: transform+top | made with: position: fixed · view() timeline · transition · :hover · :focus-visible · prefers-reduced-motion · backdrop-filter · IntersectionObserver · scroll listener

### [Multi-line Underline Hover Effect (CSS Only)](https://codepen.io/jupa8712/pen/ogBERQy)

made with: transition · :hover

### [Carousel CSS only!](https://codepen.io/tofjadesign/pen/XJpVjWr)

held: fixed div.bg, fixed div.bg2 | on scroll: img.: transform+top ×12, div.bg: transform+top, div.bg2: transform+top, div.track: transform | on hover of div.card: img.: transform+top ×12, div.bg: transform+top, div.bg2: transform+top, div.track: transform | made with: position: fixed · @keyframes · transition · :hover · mask · backdrop-filter

```css
.bg, .bg2 { position: fixed; inset: auto; filter: blur(90px); animation: f 12s ease-in-out infinite }
.bg { top: -10vw }
.bg2 { bottom: -10vw; animation-delay: -6s }
50% { transform: translate(30px, 40px) scale(1.1) }
h1 { animation: g 8s linear infinite }
to { background-position: 300% }
p { opacity: 0.75 }
.slider { position: relative; margin-top: 4rem }
.fade { position: absolute; top: 0 }
.track { animation: s 30s linear infinite }
.slider:hover .track { animation-play-state: paused }
to { transform: translateX(-2064px) }
```

### [Rotating Gradient Border](https://codepen.io/editor/TenCzwarty/pen/019f148a-7bb5-75e5-8eaa-3eb309138952)

made with: @keyframes · :hover · (hover: hover) gate · prefers-reduced-motion · mask

```css
.mock-thumb svg { opacity: 0.18 }
.mock-sub { margin-top: 3px }
.border-rotation { position: relative }
.border-rotation::before { position: absolute; inset: calc(var(--border-width) * -1); animation: gradient-rotate var(--anim) linear infinite; animation-play-state: paused; mask-image: linear-gradient(#0000 0 0), linear-gradient(#fff 0 0); mask-cli }
.border-rotation--on-hover:hover::before { animation-play-state: running }
.border-rotation--continuous::before { animation-play-state: running }
@keyframes gradient-rotate animates --border-rotation-angle
```

### [floating preview menu](https://codepen.io/vii120/pen/rajzoEJ)

on hover of img.absolute: div.absolute: opacity | made with: transition

### [Smooth Gradient Background](https://codepen.io/editor/TenCzwarty/pen/019f0a2b-5839-74b6-aa57-2e10a7ab21ae)

made with: prefers-reduced-motion · custom properties driven by JS · pointer / mouse tracking · requestAnimationFrame

```css
.mock-thumb svg { opacity: 0.18 }
.mock-sub { margin-top: 3px }
```

```js
style.setProperty('--grad-bg-x', cur.x + '%')
style.setProperty('--grad-bg-y', cur.y + '%')
requestAnimationFrame(tick)
addEventListener('mouseenter', () => {
addEventListener('mousemove', e => {
addEventListener('mouseleave', () => {
```

### [Smooth Border Glow](https://codepen.io/editor/TenCzwarty/pen/019f0a1a-613c-7372-901b-0be6f754f9d8)

made with: transition · :hover · prefers-reduced-motion · mask · custom properties driven by JS · pointer / mouse tracking · requestAnimationFrame

```css
.mock-thumb svg { opacity: 0.18 }
.mock-sub { margin-top: 3px }
.border-glow { position: relative }
.border-glow::before, .border-glow::after { position: absolute; inset: calc(var(--border-width) * -1); opacity: 0; transition: opacity var(--trans) ease-in-out; mask-image: linear-gradient(#0000 0 0), conic-gradient( from calc(var(--border-glow-start) - var(--bord }
.border-glow::after { filter: blur(2px) }
.border-glow:hover::before, .border-glow:hover::after { opacity: 1 }
```

```js
style.setProperty('--border-glow-start', cur + 'deg')
requestAnimationFrame(tick) : null
addEventListener('mousemove', e => {
requestAnimationFrame(tick)
addEventListener('mouseenter', () => { hovered = true
addEventListener('mouseleave', () => { hovered = false
```

### [A kind of a slider](https://codepen.io/nitnelav/pen/yygMGzj)

made with: transition

```css
.slider-container { box-shadow: rgba(0, 0, 0, 0.2) 0px 18px 24px; transition: all 0.5s }
.pic-container { filter: saturate(1) }
.pic { transition: all 0.5s }
.controls { margin-top: 1em }
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

### [Fancy slideshow and gallery.](https://codepen.io/tofjadesign/pen/gbgPvjm)

held: fixed div.modal | on scroll: div.slide: opacity+top ×2, div.dot: transform+background+top ×2 | on hover of img.: div.slide: opacity ×2, div.dot: transform+background+top ×2 | made with: position: fixed · @keyframes · transition · :hover

```css
.slideshow-container { position: relative; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) }
.slide { position: absolute; opacity: 0; transition: opacity 0.8s ease }
.slide.active { opacity: 1 }
.prev, .next { position: absolute; top: 50%; transform: translateY(-50%); transition: 0.3s }
.prev:hover, .next:hover { transform: translateY(-50%) scale(1.08) }
.dots { position: absolute; bottom: 20px; transform: translateX(-50%) }
.dot { transition: 0.3s }
.dot.active { transform: scale(1.2) }
.section-title { animation: fadeUp 1s ease forwards; opacity: 0 }
from { opacity: 0; transform: translateY(40px) }
to { opacity: 1; transform: translateY(0) }
.gallery-item { position: relative }
```

### [CLOSE/OPEN button effect](https://codepen.io/editor/chipxack/pen/01637319-21e8-7379-8f29-58d5bf60e7a6)

made with: nothing recognised — read the code

### [Anim Design](https://codepen.io/editor/Eklor/pen/0167997f-44d0-7037-b935-17e6acfa5370)

made with: nothing recognised — read the code

### [Hover Me Button](https://codepen.io/editor/Mag_90/pen/01753bc0-55b0-74ce-a832-d39ba9dbf7c2)

on scroll: button.: transform+color+shadow+top | made with: nothing recognised — read the code

### [hover breaking image, text glitch by Onin Ookami](https://codepen.io/editor/nieliecious/pen/0175969c-8328-7933-a8d7-52d3de9b55c8)

made with: nothing recognised — read the code

### [boton rotable](https://codepen.io/editor/redmustache-mustache/pen/017bccbb-aa00-7be2-aee1-be0c9da699b0)

made with: nothing recognised — read the code

### [button](https://codepen.io/editor/mvalida/pen/017ce64f-ed4b-7fca-9e61-08685273957c)

made with: transition · :hover

### [Neon border Gradient Animated Button](https://codepen.io/sevwnyre-the-bashful/pen/gbLZgjY)

made with: @keyframes · transition · :hover

```css
.neon-button { margin-top: 5rem; position:relative }
.neon-button::after, .neon-button::before { animation:colorChangeAnimation 5s ease infinite; inset: -4px; position: absolute }
.neon-button::after { filter: blur(1rem); opacity: 0; transition: opacity 0.3s ease }
.neon-button:hover::after { opacity: 1 }
0% { background-position: 0% 50% }
50% { background-position: 100% 0% }
100% { background-position: 0% 50% }
```

### [Change button text on hover](https://codepen.io/editor/Kenpachi-Zaraki/pen/0166c586-f8a8-771b-8a4f-77d84ba05781)

made with: nothing recognised — read the code

### [Untitled](https://codepen.io/Viel-the-styleful/pen/qEqJXgR)

held: fixed div.cursor, fixed div.cursor2, fixed div.cursor3 | on scroll: a.hover-target: transform+top ×4 | on hover of li.: a.hover-target: transform ×4 | made with: position: fixed · @keyframes · transition · :hover · mix-blend-mode

```css
.cursor, .cursor2, .cursor3 { position: fixed; transform: translateX(-50%) translateY(-50%); top: 50%; mix-blend-mode: difference; -webkit-transition: all 300ms linear; transition: all 300ms linear }
.cursor2,.cursor3 { -webkit-transition:all 0.3s ease-out; transition:all 0.3s ease-out }
.cursor2.hover, .cursor3.hover { -webkit-transform:scale(2) translateX(-25%) translateY(-25%); transform:scale(2) translateX(-25%) translateY(-25%) }
.cursor2 { box-shadow: 0 0 12px rgba(255, 255, 255, 0.2) }
.cursor2.hover { box-shadow: 0 0 0 rgba(255, 255, 255, 0.2) }
.logo { position: absolute; top: 25px; transition: all 250ms linear }
a { margin-bottom: 0.6rem; transition: all 250ms linear }
a1 { margin-bottom: 0.6rem; transition: all 250ms linear }
.section { position: relative }
.section ul, .section li { position: relative }
.section ul li a { position: relative; transform: translate3d(var(--initial), 0, 0); animation: slide 5s linear infinite; animation-play-state: running; opacity: 0.2 }
.section ul li:nth-child(3) a, .section ul li:nth-child(5) a { transform: translate3d(var(--initial-2), 0, 0); animation: slide-2 5s linear infinite }
```

### [Cursor-Aware Bento Cards — Hover Glow Effect](https://codepen.io/avathiery/pen/MYbXRpw)

on hover of a.: a.: color, a.card: transform+top, div.glow: opacity+top | made with: transition · :hover · mask · custom properties driven by JS · pointer / mouse tracking

```css
.credit a { border-bottom: 1px solid #333; transition: color 0.2s, border-color 0.2s }
.header h1 { margin-bottom: 16px }
.card { position: relative; transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1) }
.glow { position: absolute; top: 0; opacity: 0; transition: opacity 0.35s ease }
.card::before { position: absolute; inset: 0; -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0; transition: opacity 0.35s ease }
.card:hover .glow, .card:hover::before { opacity: 1 }
.card:hover { transform: translateY(-2px) }
.card-inner { position: relative }
.tag { text-transform: uppercase }
.card h2 { margin-top: 4px }
.meta { padding-top: 8px }
```

```js
addEventListener('pointermove', (e) => {
style.setProperty('--mx', `${x}px`)
style.setProperty('--my', `${y}px`)
style.setProperty('--mx', `50%`)
style.setProperty('--my', `50%`)
```

### [Portfolio + Design](https://codepen.io/editor/Sam941/pen/01659d95-f070-710a-bca8-68dd2ba8f358)

made with: nothing recognised — read the code

### [hover practice](https://codepen.io/Myself-Love/pen/VYmxKBg)

made with: transition · :hover

```css
.neon-btn { transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); position: relative }
.neon-btn:hover { transform: translateY(-12px); box-shadow: 0 0 20px #00f3ff, 0 0 60px #00f3ff, 0 0 120px #00f3ff }
```

### [Slot Machine Hover Effect](https://codepen.io/suryanewa/pen/pvNdNjX)

on hover of a.logo-slot-machine: span.logo-slot-machine__reel: transform+top ×2, span.logo-slot-machine__reel: transform | made with: (hover: hover) gate · prefers-reduced-motion · 3D (perspective / preserve-3d) · Web Animations API (.animate)

```css
.demo-container p { margin-top: 1rem; opacity: 0.6; text-transform: uppercase }
.logo-slot-machine { position: relative }
.logo-slot-machine__stage { position: relative; will-change: transform }
.logo-slot-machine__reel { position: absolute; inset: 0; transform: translateZ(calc(var(--logo-wheel-radius) * -1)) rotateX(0deg); will-change: transform }
.logo-slot-machine__cell { position: absolute; inset: 0; transform: rotateX(calc(var(--slot-index) * 60deg)) translateZ(var(--logo-wheel-radius)) }
.logo-slot-machine__svg { transform: translateZ(0) }
.sr-only { position: absolute }
.logo-slot-machine__stage, .logo-slot-machine__reel, .logo-slot-machine__cell { transform: none !important }
```

```js
.animate( [
```

### [Buttons with Square Fill Hover Animations](https://codepen.io/suryanewa/pen/myOqOyp)

made with: transition · mix-blend-mode · custom properties driven by JS

```css
.nav-link { position: relative; text-transform: uppercase }
.nav-link::after { position: absolute; mix-blend-mode: difference; transform: translate(-50%, -50%) scale(0) rotate(0.001deg); transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1) }
.nav-link.is-hovered::after, .nav-link.is-selected::after { transform: translate(-50%, -50%) scale(170) rotate(0.001deg) }
.nav-link.is-deselecting::after { transform: translate(-50%, -50%) scale(0) rotate(0.001deg) !important }
.fill-top-left::after { top: 0 }
.fill-top-right::after { top: 0 }
.fill-bottom-left::after { top: 100% }
.fill-bottom-right::after { top: 100% }
.fill-center::after { top: 50% }
.fill-closest::after { top: var(--fill-y, 0%) }
```

```js
addEventListener("mouseenter", (e) => {
style.setProperty("--fill-x", `${fillX}%`)
style.setProperty("--fill-y", `${fillY}%`)
addEventListener("mouseleave", () => {
```

### [Pure CSS Expanding Cards (Hover Accordion Layout)](https://codepen.io/bokac/pen/WboOKYy)

on hover of div.cards: div.: shadow ×2, button.: opacity ×2, div.: opacity ×2 | made with: transition · :hover · :has() · mix-blend-mode

```css
.card-tag { margin-bottom: 8px; text-transform: uppercase }
.card-title { text-transform: capitalize }
.cards { margin-bottom: 52px }
.cards > * { box-shadow: 5px 5px 10px #00000000, -5px -5px 10px #00000000; position: relative; transition: grid-template-columns .45s cubic-bezier(.4, 0, .2, 1), box-shadow .9s cubic-bezier(.4, 0, .2, 1) }
.cards > * > *:first-child { position: relative; transition: border-radius .45s cubic-bezier(.4, 0, .2, 1) }
.cards > * > *:first-child img { mix-blend-mode: multiply; position: absolute; transition: scale .9s cubic-bezier(0.4, 0, 0.2, 1) }
.cards > * > *:first-child button { position: absolute; inset: auto 14px 14px auto; transition: opacity .7s cubic-bezier(.4, 0, .2, 1), translate 1.3s linear(0, 0.009 1.4%, 0.032 2.8%, 0.131 6%, 0.265 9.1%, 0.675 17.6%, 0.88 22.8%, 0.953 25.2%, 1.014 27.7% }
.cards:not(:hover) > *:first-child > *:first-child button, .cards > *:hover > *: { opacity: 0; translate: 50px 0 }
.cards > * > *:first-child > div { position: absolute; inset: 0 }
.text-inner { transition: translate .65s cubic-bezier(.4, 0, .2, 1); translate: 20% 0 }
.cards:not(:hover) > *:first-child .text-inner, .cards > *:hover .text-inner { translate: 0 }
.cards > *:not(:last-child):after { position: absolute; inset: 0 calc(var(--cards-gap) * -1) auto auto }
```

### [SVG hover feSpecularLighting + fePointLight](https://codepen.io/yethranayeh/pen/wBooYOx)

on hover of a.: a.: color | made with: transition · :hover · pointer / mouse tracking

```css
header { border-bottom: 1px solid var(--border) }
.panel-label { border-top: 1px solid var(--border) }
footer { border-top: 1px solid var(--border) }
footer a { transition: color 0.15s }
```

```js
addEventListener("mousemove", (e) => {
```

### [Elevator](https://codepen.io/Taluska/pen/ZYBBGPY)

made with: transition · :hover · mask · mix-blend-mode

```css
.frame { position: relative; box-shadow: 0 1.5em 2.375em -0.26em #0006 }
.frame::after { position: absolute; inset: 0; box-shadow: 0 10px 14px 8px #0005 inset }
.inside { position: absolute; inset: 0 }
.doors { position: relative }
.door { position: absolute; inset: 0; transition: translate 900ms cubic-bezier(0.77, 0, 0.18, 1); will-change: translate }
.door::after { position: absolute; inset: 0; mix-blend-mode: multiply; filter: url(#brushedMetalEffect) invert(7%) contrast(105%) }
.door::before { position: absolute }
.left-door { box-shadow: inset -2px 0 2.5px -1px #0007 }
.left-door::before { mask-image: linear-gradient(to right, black 50%, transparent 50%) }
.right-door { box-shadow: inset 2px 0 2.5px -1px #0007 }
.right-door::before { mask-image: linear-gradient(to left, black 50%, transparent 50%) }
.frame:hover .left-door { translate: -72% 0 }
```

### [Cinematic Image Reveal — CSS Hover Transition](https://codepen.io/izrada-sajtova-rs/pen/NPbRVBE)

on scroll: img.img: transform+opacity+clip-path+filter+top ×2, div.card: transform+shadow+top, div.shine: transform+opacity+top | made with: transition · :hover · clip-path

```css
.card { position: relative; box-shadow: 0 30px 70px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.02); transition: transform 0.6s cubic-bezier(.2,.8,.2,1), box-shadow 0.6s ease }
.card:hover { transform: translateY(-10px) scale(1.025); box-shadow: 0 40px 90px rgba(0, 0, 0, 0.55), 0 0 35px rgba(212, 175, 55, 0.10) }
.img { position: absolute; inset: 0; will-change: transform, opacity, filter, clip-path; transition: transform 1.1s cubic-bezier(.16,1,.3,1), opacity 0.8s ease, filter 1s ease, clip-path 1.1s cubic-bezier(.16,1,.3,1) }
.img2 { opacity: 1; transform: scale(1) translateY(0); filter: blur(0) brightness(1); clip-path: inset(0 0 0 0) }
.img1 { opacity: 0; transform: scale(1.12) translateY(-45px); filter: blur(14px) brightness(1.1); clip-path: inset(0 0 100% 0) }
.card:hover .img2 { opacity: 0; transform: scale(1.12) translateY(45px); filter: blur(14px) brightness(0.75); clip-path: inset(100% 0 0 0) }
.card:hover .img1 { opacity: 1; transform: scale(1) translateY(0); filter: blur(0) brightness(1); clip-path: inset(0 0 0 0) }
.shine { position: absolute; inset: -40%; transform: translateX(-70%) rotate(3deg); opacity: 0; transition: transform 1.1s cubic-bezier(.16,1,.3,1), opacity 0.3s ease }
.card:hover .shine { opacity: 1; transform: translateX(70%) rotate(3deg) }
.card::after { position: absolute; inset: 8px; transition: border-color 0.5s ease, box-shadow 0.5s ease }
.card:hover::after { box-shadow: inset 0 0 20px rgba(212, 175, 55, 0.04) }
```

### [Orbit Hover](https://codepen.io/OSINT619/pen/GgNjZoM)

held: fixed div, fixed div, fixed div | on scroll: div.: opacity | made with: position: fixed · transition · pointer / mouse tracking

### [Subscribe button hover animation](https://codepen.io/editor/jasonheecs/pen/019e1b2e-d4de-7779-b4bd-d00fa458c23a)

on scroll: button.subscribe-btn: transform+background+color | made with: @keyframes · transition · :hover

```css
sub,sup { position:relative }
sub { bottom:-.25em }
sup { top:-.5em }
button,input,select,optgroup,textarea { opacity:1 }
::file-selector-button { opacity:1 }
::placeholder { opacity:1 }
:-moz-ui-invalid { box-shadow:none }
.subscribe-btn { position:relative }
.subscribe-btn:before { opacity:.4; position:absolute; inset:-20px; transform:scale(.8,.5) }
.subscribe-btn:hover { transition:background-color .1s .3s,color .1s .3s; animation:.3s forwards subscribe-pulse-1 }
.subscribe-btn:hover:before { animation:.3s .3s forwards subscribe-pulse-2 }
60% { transform:scale(.9) }
```

### [Cool Hover Effect](https://codepen.io/danuvip/pen/GgNqKVL)

made with: mask · mix-blend-mode · custom properties driven by JS · pointer / mouse tracking

```css
.hero { position: relative }
.grid, .grid-highlight { position: absolute; inset: 0 }
.grid { mask-image: radial-gradient( circle clamp(120px, 20vw, 220px) at var(--x) var(--y), black 0%, rgba(0,0,0,0.9) 25%, rgba(0,0,0,0.45) 55%, transparent 100% ); -webkit-mask-image: radial-gradient( circle clamp(120px, 20vw,  }
.grid-highlight { mask-image: radial-gradient( circle clamp(160px, 24vw, 320px) at var(--x) var(--y), white 0%, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.2) 65%, transparent 100% ); -webkit-mask-image: radial-gradient( circle clamp(16 }
.cursor-glow { position: absolute; transform: translate(-50%, -50%); mix-blend-mode: screen }
.content { position: relative }
```

```js
addEventListener('mousemove', (e) => {
style.setProperty('--x', `${x}px`)
style.setProperty('--y', `${y}px`)
```

### [Text Lift on Hover](https://codepen.io/smammar14/pen/OPbNKbg)

on scroll: span.depth: transform+top ×38, span.depth: transform, span.top: transform+top | made with: position: fixed · :hover · custom properties driven by JS · GSAP

```css
body::before { position: fixed; inset: 0 }
h1 { text-transform: uppercase; position: relative }
.letter > span { position: relative; will-change: transform }
.letter .depth { transform: translate( calc(var(--i) * -1 * var(--d)), calc(var(--i) * 1 * var(--d)) ) }
.letter:hover { position: relative }
```

```js
style.setProperty('--i', i)
addEventListener('mouseenter', () => {
gsap.to(depths, {
gsap.to(top, { x: LIFT, y: -LIFT, ease: 'elastic.out(1, 0.4)', duration: 1.1, overwrite: true })
addEventListener('mouseleave', () => {
gsap.to(top, { x: 0, y: 0, ease: 'elastic.out(1, 0.5)', duration: 1.25, overwrite: true })
```

### [Article feed hover effects](https://codepen.io/editor/jasonheecs/pen/019e0c19-fe01-7b26-bc10-86c0b7e77d1b)

on scroll: img.h-full: opacity+top | made with: transition · :hover · (hover: hover) gate

```css
sub,sup { position:relative }
sub { bottom:-.25em }
sup { top:-.5em }
button,input,select,optgroup,textarea { opacity:1 }
::file-selector-button { opacity:1 }
::placeholder { opacity:1 }
:-moz-ui-invalid { box-shadow:none }
h1 { margin-bottom:1rem; position:relative }
.title1 h1:before,.title1 h1:after { opacity:.6; transition:transform .35s cubic-bezier(.7,0,.3,1); position:absolute }
.title1 h1:before { top:0; transform:translate(-101%) }
.title1 h1:after { bottom:0; transform:translate(101%) }
.title1 .group:hover h1:before,.title1 .group:hover h1:after { transform:translate(0) }
```

### [Liquid Morph Button Hover Effect](https://codepen.io/avathiery/pen/KwNVJEN)

on hover of a.btn: span.blob: transform+color+top ×3, a.btn: color, span.btn-bg: color, span.btn-label: color | made with: transition · :hover

```css
.defs { position: absolute }
.header { margin-bottom: 80px }
.eyebrow { text-transform: uppercase; margin-bottom: 24px }
.grid { margin-bottom: 96px }
.btn { position: relative; transition: color 0.5s cubic-bezier(0.23, 1, 0.32, 1) }
.btn-label { position: relative; transition: color 0.5s cubic-bezier(0.23, 1, 0.32, 1) }
.btn-bg { position: absolute; inset: 0; filter: url(#goo) }
.blob { position: absolute; bottom: -32px; transform: translateY(0) scale(0); transition: transform 0.7s cubic-bezier(0.23, 1, 0.32, 1) }
.btn:hover .blob { transform: translateY(-200%) scale(3.5) }
.btn-outline { box-shadow: inset 0 0 0 1px #0a0a0a }
.caption-link { border-bottom: 1px solid #e5e5e5; padding-bottom: 2px; transition: border-color 0.3s ease }
```

### [Custom Cursor That Morphs Over Different Elements](https://codepen.io/avathiery/pen/YPpwBdB)

held: fixed div.cursor | on hover of a.link: div.cursor: transform+background+top | made with: position: fixed · transition · :hover · pointer / mouse tracking · requestAnimationFrame

```css
.header { margin-bottom: 96px }
.eyebrow { text-transform: uppercase; margin-bottom: 24px }
.block { margin-bottom: 96px }
.link { border-bottom: 1px solid #e5e5e5; padding-bottom: 2px; transition: border-color 0.3s ease }
.label { text-transform: uppercase; margin-bottom: 20px }
.image { background-position: center }
.thumb { background-position: center }
.caption { margin-top: 64px }
.cursor { position: fixed; top: 0; transform: translate(-50%, -50%); transition: width 0.35s cubic-bezier(0.23, 1, 0.32, 1), height 0.35s cubic-bezier(0.23, 1, 0.32, 1), background 0.3s ease, border 0.3s ease; will-change: transfo }
.cursor-label { text-transform: uppercase; opacity: 0; transition: opacity 0.3s ease }
.cursor.is-view .cursor-label { opacity: 1 }
.cursor.is-drag .cursor-label { opacity: 1 }
```

```js
addEventListener('mousemove', (e) => {
requestAnimationFrame(animate)
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [Image gallery with cursor-follow caption](https://codepen.io/avathiery/pen/jEVWdKq)

held: fixed div.cursor-image | on scroll: li.item: opacity+top ×5, div.cursor-image: transform+opacity+top | on hover of li.item: li.item: opacity ×2, div.cursor-image: transform+top | made with: position: fixed · transition · :hover · pointer / mouse tracking · requestAnimationFrame

```css
.header { margin-bottom: 56px; padding-bottom: 16px; border-bottom: 1px solid #d4c8b8 }
.eyebrow { text-transform: uppercase }
.meta { text-transform: uppercase }
.item { border-bottom: 1px solid #e6dccb; transition: opacity 0.5s ease, color 0.5s ease }
.list:hover .item { opacity: 0.35 }
.list .item:hover { opacity: 1 }
.cursor-image { position: fixed; top: 0; opacity: 0; transform: translate(-50%, -50%) scale(0.92); transition: opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1), scale 0.6s cubic-bezier(0.23, 1, 0.32, 1); will-change: transform }
.cursor-image.visible { opacity: 1; transform: translate(-50%, -50%) scale(1) }
.caption { margin-top: 80px }
.caption a { border-bottom: 1px solid #d4c8b8; padding-bottom: 2px; transition: border-color 0.3s ease }
.list:hover .item { opacity: 1 }
```

```js
addEventListener('mousemove', (e) => {
requestAnimationFrame(animate)
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [Magnetic Button Cursor Effect (Pure HTML + CSS + JS)](https://codepen.io/avathiery/pen/QwGyVdZ)

on scroll: button.magnetic-btn: transform+top, span.btn-text: transform+top | on hover of button.magnetic-btn: button.magnetic-btn: transform+background+top, span.btn-text: transform+top | made with: transition · :hover · pointer / mouse tracking

```css
.magnetic-btn { position: relative; transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1) }
.btn-text { transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1) }
.caption { margin-top: 48px }
.caption a { border-bottom: 1px solid #333; padding-bottom: 2px; transition: border-color 0.3s ease }
```

```js
addEventListener('mousemove', (e) => {
```

### [Flilp Bento Hover Effect](https://codepen.io/GreenSock/pen/raWxpXL)

made with: :hover · GSAP

```css
img { position: absolute; inset: 0 }
.image-overlay { position: absolute; inset: 0; opacity: 0 }
```

```js
gsap.registerPlugin(Flip)
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
```

### [Text Link Hover Effects](https://codepen.io/editor/nintendo-sixty-paul/pen/019dc049-fed0-73dc-bff5-b16089874982)

on hover of a.wave-link: span.: transform+top ×16 | made with: transition · :hover

```css
.wave-link { position: relative }
.wave-link__group span { transition: transform .5s cubic-bezier(.31,.47,.37,.95); transform: translateY(0) }
.wave-link__group--reveal { position: absolute }
.arrow-link { background-position: 100% 0; position: relative; transition: background-position .25s ease-out .2s }
.arrow-link:hover, .arrow-link:focus { background-position: 0 0; transition: background-position .2s ease-out }
.arrow-link:hover:before, .arrow-link:focus:before { transition: margin-left .45s ease .2s }
.arrow-link:before { transition: margin-left .5s ease }
.ripple-link { background-position: center; position: relative }
.ripple-link span { transition: color 1s ease }
.link-example + .link-example { margin-top: 24px }
```

```js
addEventListener('mouseenter', (e) => {
addEventListener('mouseleave', (e) => {
```

### [Link Hover Effect](https://codepen.io/lxpermyakov/pen/QwKPRdW)

held: fixed svg.[object | on hover of a.d-link: a.d-link: color | made with: position: fixed · transition · :hover

```css
.svg-pattern { position: fixed; top: 0 }
.c-wrap { padding-top: 125px }
.c-desc { position: relative }
.c-desc::after { position: absolute; top: -10px }
.d-link { position: relative; transition: all 250ms linear }
.d-link::after { position: absolute; bottom: 0; transition: all 250ms linear }
```

### [Sliding Line Hover Effect](https://codepen.io/hodo7/pen/YPGgMov)

made with: transition · :hover

```css
.cta-style { position: relative }
.cta-style::before { position: absolute; bottom: 0; transform: scaleX(0); transition: transform var(--line-transition-duration) var(--line-easing) }
.cta-style:hover::before { transform: scaleX(1) }
.cta-style span::before { position: absolute; bottom: 0px; transition: transform var(--line-arrow-transition-duration) }
.cta-style span::before { transform: rotate(-90deg) }
*, *::after, a::before { position: relative }
```

### [Hover Text Animation w/ CSS,JS](https://codepen.io/editor/alishata/pen/019d9d1f-8a3b-77b8-ac2b-ee3e18bfc3ef)

on scroll: i.: transform+top ×4 | made with: transition · :hover · custom properties driven by JS

### [Hover Interactive Button - KamUIX](https://codepen.io/kam_UIX/pen/YPGRKYG)

on scroll: path.[object: color+top ×3, svg.[object: color+top ×2, button.action-button: transform+color+shadow+top, span.: color+top | made with: transition · :hover

```css
.action-button { position: relative; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) }
.action-button::before { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: width 0.6s ease, height 0.6s ease }
.action-button:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) }
.action-button:active { transform: translateY(-1px) scale(0.98) }
.action-button i { transition: transform 0.3s ease }
.action-button:hover i[data-lucide="arrow-right"] { transform: translateX(5px) }
```

### [AI Intelligence Button with Glow Effects](https://codepen.io/kam_UIX/pen/azmRQNm)

on scroll: span.btn-letter: color ×12, svg.[object: opacity+filter | made with: @keyframes · transition · :hover · mask

```css
.btn-wrapper { position: relative }
.btn { --transition: 0.4s; box-shadow: inset 0px 1px 1px rgba(255, 255, 255, 0.2), inset 0px 2px 2px rgba(255, 255, 255, 0.15), inset 0px 4px 4px rgba(255, 255, 255, 0.1), inset 0px 8px 8px rgba(255, 255, 255, 0.05), inset 0px  }
.btn::before { position: absolute; top: calc(0px - var(--padding)); transition: box-shadow var(--transition), filter var(--transition); box-shadow: 0 -8px 8px -6px #0000 inset, 0 -16px 16px -8px #00000000 inset, 1px 1px 1px rgba(255, 2 }
.btn::after { position: absolute; top: 0; background-position: 0 0; opacity: 0; transition: opacity var(--transition), filter var(--transition) }
.btn-svg { animation: flicker 2s linear infinite; animation-delay: 0.5s; filter: drop-shadow(0 0 2px #fff9); transition: fill var(--transition), filter var(--transition), opacity var(--transition) }
50% { opacity: 0.3 }
.txt-wrapper { position: relative }
.txt-1, .txt-2 { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.txt-1 { animation: appear-anim 1s ease-in-out forwards }
.txt-2 { opacity: 0 }
0% { opacity: 0 }
100% { opacity: 1 }
```

### [some nav idea](https://codepen.io/tomhermans/pen/pvEOLQR)

held: fixed header | made with: position: fixed · transition · :hover

```css
header { position: fixed }
header svg, header svg path { position: relative }
nav ul li a { text-transform: uppercase; transition: all 0.15s ease-in-out }
nav ul li a:before { opacity: 0; transform: rotate(45deg) translateX(1rem) translateY(1rem); transition: all 0.15s ease-in-out }
nav ul li a.active:before, nav ul li a:hover:before { opacity: 0.75; transform: rotate(45deg) }
```

### [kurukuru](https://codepen.io/erwinkoharu/pen/KwgeeQw)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.square-flip { -webkit-perspective: 1000; -moz-perspective: 1000; -ms-perspective: 1000; perspective: 1000; -webkit-transform: perspective(1000px); -moz-transform: perspective(1000px); -ms-transform: perspective(1000px); transform: per }
.square { background-position:center center; -ms-transition: transform 0.60s cubic-bezier(.5,.3,.3,1); transition: transform 0.60s cubic-bezier(.5,.3,.3,1); -webkit-transition: transform 0.60s cubic-bezier(.5,.3,.3,1); position:ab }
.square-flip .square { -webkit-transform: rotateY(0deg); -moz-transform: rotateY(0deg); -o-transform: rotateY(0deg); -ms-transform: rotateY(0deg); transform: rotateY(0deg) }
.square-flip:hover .square { -webkit-transform: rotateY(-180deg); -moz-transform: rotateY(-180deg); -o-transform: rotateY(-180deg); -ms-transform: rotateY(-180deg); transform: rotateY(-180deg) }
.square2 { background-position:center center; -ms-transition: transform 0.60s cubic-bezier(.5,.3,.3,1); transition: transform 0.60s cubic-bezier(.5,.3,.3,1); -webkit-transition: transform 0.60s cubic-bezier(.5,.3,.3,1); position:ab }
.square-flip .square2 { -webkit-transform: rotateY(180deg); -moz-transform: rotateY(180deg); -o-transform: rotateY(180deg); -ms-transform: rotateY(180deg); transform: rotateY(180deg) }
.square-flip:hover .square2 { -webkit-transform: rotateY(0deg); -moz-transform: rotateY(0deg); -o-transform: rotateY(0deg); -ms-transform: rotateY(0deg); transform: rotateY(0deg) }
.square-container { position:relative; top:50%; -ms-transition: transform 0.60s cubic-bezier(.5,.3,.3,1); transition: transform 0.60s cubic-bezier(.5,.3,.3,1); -webkit-transition: transform 0.60s cubic-bezier(.5,.3,.3,1); -webkit-transform: }
.square-flip:hover .square-container { -webkit-transform: translateY(-50%) translateX(-650px) scale(.88); -ms-transform: translateY(-50%) translateX(-650px) scale(.88); transform: translateY(-50%) translateX(-650px) scale(.88) }
.square-container2 { position:relative; top:50%; -ms-transition: transform 0.60s cubic-bezier(.5,.3,.3,1); transition: transform 0.60s cubic-bezier(.5,.3,.3,1); -webkit-transition: transform 0.60s cubic-bezier(.5,.3,.3,1); -webkit-transform: }
.square-flip:hover .square-container2 { -webkit-transform: translateY(-50%) translateX(0px) translateZ(0px) scale(1); -ms-transform: translateY(-50%) translateX(0px) translateZ(0px) scale(1); transform: translateY(-50%) translateX(0px) translateZ(0px) scale(1) }
.flip-overlay { position:absolute; top:0 }
```

### [ASCII Radial Wave Text Effect](https://codepen.io/erevan/pen/qEaYQPw)

held: fixed div.lil-gui | on hover of button.title: button.title: opacity | made with: position: fixed · pointer / mouse tracking · requestAnimationFrame

```css
.so { position: absolute }
body::after { position: fixed; inset: 0 }
```

```js
requestAnimationFrame(loop)
addEventListener('mousemove', (e) => {
addEventListener('mouseenter', e => e.stopPropagation())
addEventListener('mousemove', e => e.stopPropagation())
```

### [njX UI — 40+ CSS Hover Effects (scale, lift, glow, fill...)](https://codepen.io/njbSaab/pen/XJjqMJL)

held: sticky div.demo-topbar | made with: position: sticky · view transitions · @keyframes · transition · :hover · backdrop-filter · 3D (perspective / preserve-3d)

### [njX UI — 30+ CSS Animations & Motion utilities](https://codepen.io/njbSaab/pen/OPRZpJO)

held: sticky div.demo-topbar | on scroll: div.anim-icon: transform+top ×11 | on hover of a.demo-brand: div.anim-icon: transform ×6, div.anim-icon: transform+top ×5, div.glow-box: shadow ×4, div.animate-border-pulse: shadow, svg.[object: transform, div.animate-bounce: transform+top | made with: position: sticky · view transitions · transition · :hover · backdrop-filter

### [High resolution CSS-only cursor highlight effect](https://codepen.io/editor/GRA0007/pen/019d471e-f10e-79f4-b277-ad4eb874e881)

made with: :hover

```css
.button { position: relative; box-shadow: 0 2px 10px rgb(0 0 0 / .5) }
.hover { position: absolute; inset: 0 }
&:hover { box-shadow: 0 0 40px 15px rgb(255 255 255 / .5) }
```

### [njX UI — 40+ CSS Hover Effects (scale, lift, glow, fill...)](https://codepen.io/editor/njbSaab/pen/019d404b-23f7-7737-85bd-4a24dcdc5704)

held: sticky div.demo-topbar | made with: position: sticky · view transitions · @keyframes · transition · :hover · backdrop-filter · 3D (perspective / preserve-3d)

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

### [Opposite Hover](https://codepen.io/sonnykoh/pen/RNGxJpN)

held: fixed i, fixed i | on hover of button.: button.: transform+top | made with: position: fixed · transition · :hover · :has() · mix-blend-mode · 3D (perspective / preserve-3d)

```css
body { position: relative; perspective: 400px }
i { position: fixed; top: 100px; transform: translateZ(50px) }
i:nth-child(2) { transform: translateX(-100%) translateZ(50px) }
button { position: absolute; top: 150px; transform: translate3d(-50%, 0%, 0px); outline-offset: 10px; transition: transform 0.3s ease-in, all 0.3s ease }
button:before, button:after { position: absolute; top: 0px; mix-blend-mode: multiply; transition: all 0.3s ease, font-size 0.2s ease }
body:has(i:first-of-type:hover) button:before { transition: left 0.3s ease-in }
body:has(i:last-of-type:hover) button:after { transition: right 0.3s ease-in }
body:has(i:first-of-type:hover) button { transform: rotateY(-30deg) scaleX(1.05) translate3d(-40%, -20px, 200px) skewX(-15deg) rotate(-12deg); transition: transform 0.4s ease, font-size 0.3s ease }
body:has(i:last-of-type:hover) button { transform: rotateY(40deg) scaleX(1.03) skewX(10deg) rotate(12deg) translate3d(-50%, 20px, -100px); transition: transform 0.4s ease, font-size 0.3s ease }
body:has(i:hover) { transition: background 0.5s ease }
```

### [Button Hover Styles](https://codepen.io/Umgori/pen/bNwYqQw)

made with: position: fixed · @keyframes · transition · :hover · :focus-visible · clip-path · mix-blend-mode

```css
.js .loading::before, .js .loading::after { position: fixed }
.js .loading::before { top: 0 }
.js .loading::after { top: 50%; opacity: 0.4; animation: loaderAnim 0.7s linear infinite alternate forwards }
to { opacity: 1; transform: scale3d(0.5, 0.5, 1) }
a:focus-visible, button:focus-visible { outline-offset: 3px }
.frame { position: relative }
.frame__related h3 { padding-top: 1rem }
.content__item { position: relative }
.content__item::before { position: absolute; top: 0 }
.button { position: relative }
.button::before, .button::after { position: absolute; top: 0 }
.button--pan span { position: relative; mix-blend-mode: difference }
```

### [mask hover effect 🌼](https://codepen.io/vii120/pen/vEXZmQr)

made with: transition · :hover · mask

```css
.image { mask: radial-gradient(#000 70%, transparent 0), radial-gradient(#000 70%, transparent 0), radial-gradient(#000 70%, transparent 0); mask-repeat: no-repeat; mask-position: 20% 50%, 50% 50%, 80% 50%; mask-size: 40% 80%; tr }
.image:hover { mask-position: 10% 50%, 50% 50%, 90% 50% }
```

### [Direction-Aware Hover with Modern CSS](https://codepen.io/Taluska/pen/VYKpmzG)

on scroll: li.item: transform ×10, li.item: transform+filter+shadow+top | on hover of li.item: li.item: transform ×4, li.item: transform+filter+shadow+top ×2 | made with: transition · :hover · :has() · custom properties driven by JS · requestAnimationFrame

```css
:root { --overlap-offset: calc(var(--item-size) / 2) }
.item { position: relative; box-shadow: -6px 0px 10px -3px hsl(var(--shadow-color) / 0.3); transition: transform 500ms ease }
.item::before { position: absolute }
.item:hover { transform: scale(1.25); box-shadow: unset; filter: saturate(140%) }
.item { transition: transform 700ms }
.horizontal-stack:has(.item:hover) .item:hover ~ .item { transform: translateX( calc( min( 15px * (sibling-count() - sibling-index()), var(--overlap-offset) ) ) ) }
.horizontal-stack:has(.item:hover) .item:has(~ .item:hover) { transform: translateX( calc(-1 * min(15px * (sibling-index() - 1), var(--overlap-offset))) ) }
```

```js
style.setProperty("--bg-color", `oklch(80% 0.15 ${(i + 1) * 30})`)
requestAnimationFrame(fn)
addEventListener( "mouseenter",
addEventListener("mouseleave", () => {
```

### [Hover Animation UI Feedback Demo](https://codepen.io/tkdev-hub/pen/gbwmMWr)

made with: transition · :hover

```css
.btn { transform:translateY(0) scale(1); box-shadow:0 6px 14px rgba(0,0,0,0.25); transition: transform 0.18s ease, box-shadow 0.18s ease }
.btn:hover { transform:translateY(-4px) scale(1.04); box-shadow:0 14px 28px rgba(0,0,0,0.35) }
.btn:active { transform:translateY(1px) scale(0.98) }
```

### [tracing border on hover](https://codepen.io/tortaruga/pen/EagyyaV)

made with: transition · :hover

```css
div { position: relative }
div::before, div::after, div span::before, div span::after { position: absolute }
div::before { border-top: 1px solid; top: 0 }
div:hover:before { transition: width .25s }
div::after { top: 0 }
div:hover:after { transition: height .25s .25s }
div span { position: absolute; top: 0 }
div span:before { border-bottom: 1px solid; bottom: 0 }
div:hover span:before { transition: width .25s .5s }
div span:after { bottom: 0 }
div:hover span:after { transition: height .25s .75s }
```

### [Hover Image Tooltip - Javascript](https://codepen.io/samsimite/pen/zxKqJpa)

made with: pointer / mouse tracking

```css
.box { position: absolute; top: 0; bottom: 0 }
.cell { position: relative }
.dot { position: absolute; top: 0; bottom: 0 }
.js-tooltip { position: absolute }
```

```js
addEventListener('mouseenter', function (e) {
addEventListener('mouseleave', function () {
addEventListener('mousemove', function (e) {
```

### [Image Hotspot — Web Component](https://codepen.io/AgnusDei/pen/GgjZdYp)

made with: @keyframes · transition · :hover · backdrop-filter

```css
.header { margin-bottom: 36px }
.header .eyebrow { text-transform: uppercase; margin-bottom: 10px; opacity: .8 }
.footer { margin-top: 24px; text-transform: uppercase }
```

```js
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
```

### [Custom Cursor](https://codepen.io/RoshitShrestha/pen/KwgVGwB)

held: fixed div.custom-cursor | on scroll: path.[object: transform+top | made with: position: fixed · :hover · mix-blend-mode · GSAP · pointer / mouse tracking

```css
.custom-cursor { position: fixed; top: 0; transform: translate(-50%, -50%); mix-blend-mode: difference }
.custom-cursor .outer { position: absolute }
.custom-cursor .inner { top: 50%; transform: translate(-50%, -50%); position: absolute }
```

```js
gsap.registerPlugin(MorphSVGPlugin)
addEventListener("mousemove", (e) => {
gsap.timeline({
gsap.to("#cursorDot", {
addEventListener("mouseenter", () => cursorTl.play())
addEventListener("mouseleave", () => cursorTl.reverse())
```

### [Modern Image Effect Blur Reveal Hover Animation](https://codepen.io/hwfoibtz-the-reactor/pen/emdJOQp)

on hover of img.: img.: transform+opacity+filter | made with: transition · :hover

```css
img { transition: 0.8s }
&::before { position: absolute; inset: 0; background-position: center; filter: blur(8px); opacity: 0; transform: scaleX(1.5); transition: 0.8s }
img { filter: blur(8px); opacity: 0; transform: scaleX(1.5) }
&::before { filter: blur(0); opacity: 1; transform: scaleX(1) }
```

### [Hover Drop Down MENU -Javascript](https://codepen.io/samsimite/pen/XJjbOpd)

made with: :hover

```css
.box { position: absolute; top: 0; bottom: 0 }
.linksbox1 { position: absolute; top: 0 }
.linksbox2 { position: absolute; bottom: 0 }
.dot1, .dot2, .dot3, .dot4, .dot5, .dot6, .dot7, .dot8, .dot9, .dot10 { position: absolute; top: 0; bottom: 0 }
.cell { position: relative }
.box1, .box2, .box3, .box4, .box5 { position: absolute; top: 50px }
.box6, .box7, .box8, .box9, .box10 { position: absolute; bottom: 50px }
.boxxy { position: absolute; top: 25px; bottom: 25px }
.boxxer { position: absolute; top: 5px; bottom: 5px }
.main { position: absolute; top: 50px; bottom: 50px }
.mySlides { position: absolute; top: 0; bottom: 0 }
```

```js
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [:hover-states](https://codepen.io/synphod2/pen/gbwpomW)

made with: transition · :hover

```css
a { position: relative }
nav.one a::before { position: absolute; bottom: 2px; scale: 0 1; transition: scale 0.125s 0.25s ease-in }
nav.one a:hover::before { scale: 1 1 }
```

### [Staggered Link Hover Animation](https://codepen.io/barhatsor/pen/JoRPNmz)

made with: @keyframes · clip-path · custom properties driven by JS · requestAnimationFrame

```css
from { clip-path: inset(0 0 0 0); translate: 0 0 }
49.99% { clip-path: inset(100% 0 0 0); translate: 0 -50px }
50% { clip-path: inset(0 0 100% 0); translate: 0 50px }
to { clip-path: inset(0 0 0 0); translate: 0 0 }
.progress-bar { position: relative }
.progress-bar::before { position: absolute }
@keyframes rotate animates clip-path, translate
```

```js
style.setProperty( '--progress', progress + '%'
requestAnimationFrame(updateProgressBar)
```

### [Balatro's Card Burn](https://codepen.io/plutocrat/pen/bNeXOgy)

held: fixed canvas, fixed canvas | on hover of button.: button.: transform+shadow+top | made with: position: fixed · transition · :hover · three.js / WebGL · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
#bgCanvas { position: fixed; top: 0; opacity: 0.55 }
#wrapper { position: relative }
#glCanvas { filter: drop-shadow(0 8px 32px rgba(0, 0, 0, 0.9)); transition: filter 0.4s }
#glCanvas.burning { filter: drop-shadow(0 0 40px rgba(255, 120, 0, 0.8)) drop-shadow(0 0 80px rgba(255, 50, 0, 0.4)) }
#burnBtn { text-transform: uppercase; box-shadow: 0 4px 20px rgba(255, 80, 0, 0.4); transition: all 0.2s }
#burnBtn:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(255, 80, 0, 0.6) }
#redoBtn { text-transform: uppercase; transition: all 0.2s }
#hint { text-transform: uppercase }
#pCanvas { position: fixed; top: 0 }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseleave", () => {
requestAnimationFrame(render)
```

### [Stack of Cards](https://codepen.io/arvingarciabtw/pen/yyJmbpK)

made with: transition · :hover

```css
.stack { position: relative }
.card { position: absolute; transition: ease 0.3s }
.stack:hover > .x1 { transform: translateY(4%) rotate(-2deg) }
.stack:hover > .x2 { transform: translateY(2%) rotate(-1deg) }
.stack:hover > .x3 { transform: translateY(0) rotate(0deg) }
.stack:hover > .x4 { transform: translateY(-2%) rotate(1deg) }
.stack:hover > .x5 { transform: translateY(-4%) rotate(2deg) }
```

### [Untitled](https://codepen.io/weiwei5280/pen/OPXYJzG)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.icon-list { transform: rotateX(30deg) rotateZ(0deg) }
.icon-list .icon-list__item a .box { position: relative; transition: 0.5s }
.icon-list .icon-list__item a .box .box__face { position: absolute }
.icon-list .icon-list__item a .box .box__face--top, .icon-list .icon-list__item  { top: calc((var(--box-height) - var(--box-depth)) / 2) }
.icon-list .icon-list__item a .box .box__face--front { transition: 0.25s }
.icon-list .icon-list__item a .box .box__face--front svg { transform: rotate(270deg); transition: 0.5s }
.icon-list .icon-list__item a .box .box__face--right { transition: 0.25s }
.icon-list .icon-list__item a .box .box__face--bottom { transition: 0.25s }
.icon-list .icon-list__item a .box .box__face--front { transform: rotateY(0deg) translateZ(calc(var(--box-depth) / 2)) }
.icon-list .icon-list__item a .box .box__face--back { transform: rotateY(180deg) translateZ(calc(var(--box-depth) / 2)) }
.icon-list .icon-list__item a .box .box__face--right { transform: rotateY(90deg) translateZ(calc(var(--box-width) / 2)) }
.icon-list .icon-list__item a .box .box__face--left { transform: rotateY(-90deg) translateZ(calc(var(--box-width) / 2)) }
```

### [🎵 Vinyl Record Micro Interaction](https://codepen.io/felippecav/pen/EayGMyR)

on scroll: img.: transform, section.info: opacity | made with: transition · :hover · Lenis / smooth scroll

```css
.album { position: relative }
.cover img { position: relative; box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px }
.disk img { position: absolute; top: 10px; transform: translateX(0) rotate(0deg); transition: transform 1s ease }
.album:hover .disk img { transform: translateX(250px) rotate(90deg) }
.info { margin-top: 20px; opacity: 0; transition: opacity 0.8s ease }
.container:hover ~ .info { opacity: 1 }
```

### [배경 그라디언트 hover 시 CSS](https://codepen.io/yam_eo/pen/EayGZxR)

made with: transition · :hover

```css
.box { position:relative }
.box:before { position: absolute; top:0; opacity: 0; transition: opacity 0.4s ease }
.box:hover:before { opacity:1 }
```

### [Button hover - Text + bg](https://codepen.io/Mvcuijk/pen/azZQQoR)

on scroll: span.text: transform | made with: transition · :hover

```css
.btn-fill { position: relative }
.btn-fill::before { position: absolute; inset: 0; transform: scaleX(0); transition: transform 1s cubic-bezier(0.65, 0.05, 0.36, 1) }
.btn-fill:hover::before { transform: scaleX(1) }
.text-wrap { position: relative }
.text-wrap::after { position: absolute; inset: 0; transform: translateX(100%); transition: transform 1s cubic-bezier(0.65, 0.05, 0.36, 1) }
.text { transition: transform 1s cubic-bezier(0.65, 0.05, 0.36, 1) }
.default { transform: translateX(0) }
.btn-fill:hover .default { transform: translateX(-100%) }
.btn-fill:hover .text-wrap::after { transform: translateX(0) }
```

### [Shiny Animated Button](https://codepen.io/bill-knighly/pen/pvbOamK)

made with: @keyframes · transition · :hover · (hover: hover) gate

```css
.glow-on-hover { position: relative }
.glow-on-hover:before { position: absolute; top: -2px; filter: blur(0px); animation: glowing 20s linear infinite; opacity: 0; transition: opacity 0.3s ease-in-out }
.glow-on-hover:before { opacity: 1 }
.glow-on-hover:hover { box-shadow: 2.0px 5.0px 4.0px black }
0% { background-position: 0 0 }
50% { background-position: 1000% 0 }
100% { background-position: 0 0 }
@keyframes glowing animates background-position
```

### [Underline Takeover · Button Hover Effect](https://codepen.io/larguar/pen/zxBJowm)

made with: transition · :hover

```css
.btn-outline .btn-inner, .btn-outline-light .btn-inner { position: relative }
.btn-outline .btn-inner::before, .btn-outline .btn-inner::after, .btn-outline-li { position: absolute; bottom: 0; transition: width 0.2s ease-out 0.4s }
.btn-outline .btn-inner .link-text, .btn-outline-light .btn-inner .link-text { position: relative }
.btn-outline .btn-inner .link-text::before, .btn-outline .btn-inner .link-text:: { position: absolute; opacity: 0; transition: width 0.2s ease-in, height 0.2s linear 0.2s, opacity 0s ease 0.4s; bottom: 0; border-top: 2px solid }
.btn-outline:hover .btn-inner::before, .btn-outline:hover .btn-inner::after, .bt { transition: width 0.2s ease-in }
.btn-outline:hover .btn-inner .link-text::before, .btn-outline:hover .btn-inner  { opacity: 1; transition: height 0.2s ease-in 0.2s, width 0.2s linear 0.4s, opacity 0s ease 0.2s }
```

### [Snake Border · Button Hover Effect](https://codepen.io/larguar/pen/yyJqwgr)

made with: transition · :hover

```css
.btn-outline .link-text, .btn-outline-light .link-text { position: relative }
.btn-outline .link-text::before, .btn-outline .link-text::after, .btn-outline-li { position: absolute }
.btn-outline .link-text::before, .btn-outline-light .link-text::before { top: 0; transition: width 0.1s ease-out 0.3s, height 0.1s ease-out 0.2s, border-color 0s ease-out 0.4s }
.btn-outline .link-text::after, .btn-outline-light .link-text::after { bottom: 0; transition: height 0.1s ease-out, width 0.1s ease-out 0.1s, border-color 0s ease-out 0.2s }
.btn-outline:hover .link-text::before, .btn-outline-light:hover .link-text::befo { transition: width 0.2s ease-out, height 0.2s ease-out 0.2s, border-color 0s }
.btn-outline:hover .link-text::after, .btn-outline-light:hover .link-text::after { transition: width 0.2s ease-out 0.4s, height 0.2s ease-out 0.6s, border-color 0s ease-out 0.4s }
.btn-outline .link-text { box-shadow: inset 0 0 0 2px black }
.btn-outline-light .link-text { box-shadow: inset 0 0 0 2px #F4EB6D }
```

### [Untitled](https://codepen.io/Loubna-Ch/pen/YPWjxbm)

made with: transition · :hover · (hover: hover) gate · 3D (perspective / preserve-3d)

```css
.fancy-button { text-transform: uppercase; position: relative }
.fancy-button:before { position: absolute; bottom: -1px; filter: blur(14px) brightness(0.9); transition: all 0.3s ease-out }
.fancy-button i { margin-top: -2px }
.fancy-button span { position: relative; will-change: transform, filter; transition: all 0.3s ease-out }
.fancy-button:hover span { filter: brightness(0.9) contrast(1.2); transform: scale(0.96) }
.fancy-button:hover:before { bottom: 3px; filter: blur(6px) brightness(0.8) }
.fancy-button:active span { filter: brightness(0.75) contrast(1.7) }
.fancy-button.pop-onhover:before { opacity: 0; bottom: 10px }
.fancy-button.pop-onhover:hover:before { bottom: -7px; opacity: 1; filter: blur(16px) }
.fancy-button.pop-onhover:hover span { transform: scale(1) }
.fancy-button.pop-onhover:hover:active span { filter: brightness(1) contrast(1); transform: scale(1); transition: all 0.2s ease-out }
.fancy-button.pop-onhover:hover:active:before { bottom: 0; filter: blur(5px) brightness(0.85); transition: all 0.2s ease-out }
```

### [gradient hover effect w/ css @property](https://codepen.io/vii120/pen/ByzPyeL)

on scroll: div.btn: shadow | made with: transition · :hover

```css
.btn { box-shadow: 0 0 0 5px #e9e0ff, 2px 8px 12px #0006; transition: all 0.15s ease, --gradient-1 0.25s, --gradient-2 0.25s }
.btn:hover { box-shadow: 0 0 0 5px #ffe5ef, 2px 8px 12px #0006 }
.btn:active { scale: 0.98; box-shadow: 0 0 0 5px #ffe5ef, 2px 8px 8px #0008 }
```

### [Hover-to-Decode Scramble Buttons](https://codepen.io/chekromul/pen/PwzKvEZ)

made with: transition · :hover · prefers-reduced-motion · requestAnimationFrame

```css
&::before { position: absolute; inset: 0; transform: scaleX(0); transition: transform 0.3s }
&:hover::before { transform: scaleX(100%) }
&::before { transform: scaleX(100%) }
&::before { position: absolute; inset: 0; transform: scaleX(0); transition: transform 0.3s }
```

```js
requestAnimationFrame(frame)
```

### [CSS Mask Underline Hover Effects (5 Variations, Touch + Keyboard Friendly)](https://codepen.io/fyildiz1974/pen/ogLWRYN)

on hover of div.card: button.fx: color | made with: transition · :hover · :focus-visible · prefers-reduced-motion · mask · backdrop-filter

```css
header { backdrop-filter: blur(10px) }
.card { backdrop-filter: blur(10px) }
.fx:focus-visible { box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08), 0 0 0 6px var(--ring) }
.fx { -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0) var(--_mask-pos) / var(--_mask-size) padding-box no-repeat; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0) var(--_mas }
.fx--slide { transition: color var(--t) ease, -webkit-mask-size var(--t) ease, mask-size var(--t) ease, -webkit-mask-position 0s var(--t), mask-position 0s var(--t) }
.fx--split { -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0) 0% 100% / var(--_p) padding-box no-repeat, linear-gradient(#000 0 0) 100% 100% / var(--_p) padding-box no-repeat; mask: linear-gradient(#000  }
.fx { transition: color var(--t) ease, background-size var(--t) ease }
.fx { transition: none !important }
```

### [Love you](https://codepen.io/jayramoliya/pen/KwMWWzq)

on hover of button.yes-btn: button.yes-btn: transform+background+shadow+top | made with: @keyframes · transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%, -50%); -o-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); -webkit-transform: translate(-50%, -50%); -moz-transform: translate(-100%, -50%); }
.question-container { position: absolute; top: 40%; transition: 0.2s }
.question { margin-bottom: 1rem }
.btn { position: absolute; transition: all 0.3s ease; transform: scale(1.05); box-shadow: 0px 4px 15px rgba(255, 107, 129, 0.5) }
.btn:hover { transform: scale(1.1); box-shadow: 0px 6px 20px rgba(255, 107, 129, 0.7) }
.result-container { position: absolute; top: 40%; transform: translate(-50%, -50%); -o-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); -webkit-transform: translate(-50%, -50%); -moz-transform: translate(-100%, -50%); }
.gif-result { margin-bottom: 2rem }
.cssload-main { position: absolute; top: 17%; transform: translate(-100%, -50%); -o-transform: translate(-100%, -240%); -ms-transform: translate(-100%, -240%); -webkit-transform: translate(-100%, -240%); -moz-transform: translate(-100%, }
.cssload-heart { animation: cssload-heart 2.88s cubic-bezier(0.75, 0, 0.5, 1) infinite normal; -o-animation: cssload-heart 2.88s cubic-bezier(0.75, 0, 0.5, 1) infinite normal; -ms-animation: cssload-heart 2.88s cubic-bezier(0.75, 0, 0.5, }
.cssload-heartL { position: absolute; animation: cssload-heartL 2.88s cubic-bezier(0.75, 0, 0.5, 1) infinite normal; -o-animation: cssload-heartL 2.88s cubic-bezier(0.75, 0, 0.5, 1) infinite normal; -ms-animation: cssload-heartL 2.88s cub }
.cssload-heartR { position: absolute; transform: translate(28px, -27px); -o-transform: translate(28px, -27px); -ms-transform: translate(28px, -27px); -webkit-transform: translate(28px, -27px); -moz-transform: translate(28px, -27px); anima }
.cssload-square { position: relative; transform: scale(1) rotate(-45deg); -o-transform: scale(1) rotate(-45deg); -ms-transform: scale(1) rotate(-45deg); -webkit-transform: scale(1) rotate(-45deg); -moz-transform: scale(1) rotate(-45deg);  }
```

### [Gradient-button](https://codepen.io/Ashmita-Kumari/pen/GgqrQjO)

on scroll: button.: shadow+top | made with: :hover

```css
button { position: relative }
button::after { position: absolute }
button:hover { box-shadow: 50px 0 110px blue, -50px 0 110px rgb(189, 54, 166) }
```

### [Spotlight · Button Hover Effect](https://codepen.io/larguar/pen/bNegrMY)

on scroll: a.btn-outline: color+top, span.btn-inner: color+top, span.btn-flair: transform+color+top, span.link-text: color+top | on hover of div.btn-wrap: a.btn-outline: color, span.btn-inner: color, span.btn-flair: transform+color, span.link-text: color | made with: transition · :hover · GSAP · pointer / mouse tracking

```css
.btn-solid:not(.active), .btn-outline:not(.active), .btn-solid-light:not(.active { transition: background-color 0.2s ease }
.btn-solid .btn-inner, .btn-outline .btn-inner, .btn-solid-light .btn-inner, .bt { position: relative }
.btn-solid .btn-inner::before, .btn-outline .btn-inner::before, .btn-solid-light { position: absolute; bottom: 0; top: 0 }
.btn-solid .btn-inner .link-text, .btn-outline .btn-inner .link-text, .btn-solid { position: relative; transition: color 0.1s ease-out }
.btn-solid .btn-inner .btn-flair, .btn-outline .btn-inner .btn-flair, .btn-solid { bottom: 0; position: absolute; top: 0; transform: scale(0); will-change: transform }
.btn-solid .btn-inner .btn-flair::before, .btn-outline .btn-inner .btn-flair::be { position: absolute; top: 0; transform: translate(-50%, -50%) }
.btn-solid .btn-inner:hover .link-text, .btn-outline .btn-inner:hover .link-text { transition: color 0.1s ease-in }
```

```js
addEventListener('mouseenter', (e) => {
gsap.to(flair, {
addEventListener('mouseleave', (e) => {
addEventListener('mousemove', (e) => {
```

### [Gradient Buttuon on Hover](https://codepen.io/ancryne/pen/VYjPjWV)

on scroll: button.: shadow+top | made with: :hover

```css
button { position: relative }
button::after { position: absolute }
button:hover { box-shadow: 40px 0 100px rgba(28, 112, 176, 0.3), -40px 0 100px rgba(225, 0, 255, 0.35) }
```

### [CSS Button - Efeito Wiggle no Hover](https://codepen.io/felippecav/pen/QwEdjRv)

on scroll: button.: transform+filter | on hover of button.: button.: transform+top | made with: @keyframes · :hover

```css
button:hover { filter: brightness(1.1); animation: wiggle 2s linear infinite }
0% { transform: rotate(0) }
15% { transform: rotate(-15deg) }
20% { transform: rotate(10deg) }
25% { transform: rotate(-10deg) }
30% { transform: rotate(10deg) }
35% { transform: rotate(-10deg) }
40%, 100% { transform: rotate(0) }
@keyframes wiggle animates transform
```

### [Fancy Business Card B](https://codepen.io/tofjadesign/pen/QwEEzmo)

on scroll: div.card: transform, div.color-splash: transform+top, div.watermark: transform+top | on hover of div.card: div.card: transform, div.color-splash: transform, div.watermark: transform+top | made with: transition · :hover · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d) · GSAP · pointer / mouse tracking

```css
.bg { position: absolute; inset: -50%; filter: blur(140px); opacity: 0.25 }
.card { position: relative; backdrop-filter: blur(16px); box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.06) }
.card::after { position: absolute; inset: 0; mix-blend-mode: overlay }
.role { margin-top: 12px; text-transform: uppercase }
.divider { opacity: 0.2 }
.accent-dot { opacity: 0.7 }
.icon { opacity: 0.65 }
.item span { position: relative; transition: color 0.3s ease }
.item span::before { position: absolute; opacity: 0; transition: opacity 0.3s ease }
.item:hover .icon { opacity: 0 }
.item:hover span::before { opacity: 1 }
.watermark { position: absolute; bottom: -30px; transform: rotate(-8deg); mix-blend-mode: overlay }
```

```js
gsap.from(".card", { y: 60, opacity: 0, duration: 1.2, ease: "power4.out" })
gsap.from(".name span", {
gsap.to(".icon", {
gsap.to(".watermark", {
gsap.to(".color-splash", {
addEventListener("mousemove", (e) => {
gsap.to(card, {
addEventListener("mouseleave", () => {
```

### [Animated buttons](https://codepen.io/manu_sk/pen/bNeEdgg)

on scroll: div.: transform+opacity ×3, div.glossy-button: shadow | made with: @keyframes · transition · :hover · anime.js

```css
.container { position: relative }
.glossy-button { box-shadow: 0 0 10px #ffffff47 }
100% { transform: rotate(1turn) }
100% { transform: rotate(1turn) }
.glossy-button { position: relative }
.glossy-button:hover { box-shadow: 0px 7px 20px #a8efff33 }
.glossy-button::before { position: absolute; top: -210%; background-position: 0 0; animation: none }
.glossy-button:hover::before { animation: rotate 1s ease-in-out forwards }
.glossy-button::after { position: absolute; top: 2px; background-position: 0% 50%; transition: none }
.glossy-button:hover::after { animation: moveGradient 0.5s linear forwards }
0% { background-position: 0% 50% }
100% { background-position: 100% 50% }
```

```js
addEventListener('mouseenter', () => {
addEventListener('mouseleave', clearParticles)
```

### [ToolTip](https://codepen.io/Tanzeela_Fatima12/pen/Wbxreoj)

made with: :hover

```css
.tooltip { position: relative }
.tooltip::after { position: absolute }
.tooltip.top::after { top: 0; transform: translate(-50%, calc(-100% - 10px)) }
.tooltip.bottom::after { bottom: 0; transform: translate(-50%, calc(100% + 10px)) }
.tooltip.right::after { top: 0; transform: translateX(calc(100% + 10px)) }
.tooltip.left::after { top: 0; transform: translateX(calc(-100% - 10px)) }
.tooltip::before { position: absolute }
.tooltip.top::before { top: 0; transform: translate(-50%, calc(-100% - 5px)) rotate(45deg) }
.tooltip.bottom::before { bottom: 0; transform: translate(-50%, calc(100% + 5px)) rotate(45deg) }
.tooltip.right::before { top: 50%; transform: translate(calc(100% + 5px), -50%) rotate(45deg) }
.tooltip.left::before { top: 50%; transform: translate(calc(-100% - 5px), -50%) rotate(45deg) }
```

### [Aurora Cards — Interactive Glass UI](https://codepen.io/Timur1616/pen/raLOqqP)

on hover of article.card: article.card: transform+filter | made with: transition · :hover · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking

```css
.card { position:relative; transform: perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateZ(0); transition: transform 220ms ease, filter 220ms ease; box-shadow: var(--shadow); backdrop-filter: blur(10px) }
.card:hover { filter: saturate(1.1) }
.card__glow { position:absolute; inset:-40%; transform: translateZ(-1px); opacity:.95; filter: blur(22px) saturate(1.25); mix-blend-mode: screen }
.card__content { position:absolute; inset: 0; transform: translateZ(30px) }
.btn { transition: transform 160ms ease, background 160ms ease, border-color 160ms ease }
.btn:hover { transform: translateY(-1px) }
.dot { box-shadow: 0 0 18px rgba(0,255,213,.25) }
```

```js
style.setProperty("--mx", `${mx}%`)
style.setProperty("--my", `${my}%`)
style.setProperty("--rx", `${rx}deg`)
style.setProperty("--ry", `${ry}deg`)
addEventListener("mousemove", (e) => {
addEventListener("mouseleave", () => {
style.setProperty("--rx", `0deg`)
style.setProperty("--ry", `0deg`)
```

### [CSS Button Hover Effects Library](https://codepen.io/fyildiz1974/pen/OPXVaEr)

held: sticky nav.main-nav, fixed button.floating-top, fixed div.toast, fixed div.modal-overlay, fixed div.modal | on scroll: div.button-card: transform+opacity+top ×130 | made with: position: sticky · position: fixed · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · transition · :hover · :focus-visible · :has() · prefers-reduced-motion · clip-path · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d) · custom properties driven by JS · IntersectionObserver · scroll listener · pointer / mouse tracking

```css
html { scroll-padding-top: calc(var(--nav-height) + var(--space-lg)) }
*, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important }
:focus-visible { outline-offset: 2px }
.sr-only { position: absolute }
.main-nav { position: sticky; top: 0; border-bottom: 1px solid var(--border-color); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px) }
.nav-link { transition: var(--transition-fast) }
.search-box { position: relative }
.search-input-wrapper { position: relative }
.search-icon { position: absolute; opacity: 0.6; transition: var(--transition-fast) }
.search-input { transition: var(--transition-base) }
.search-input:focus { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) }
.search-input:focus + .search-icon, .search-input:not(:placeholder-shown) + .sea { opacity: 1 }
```

```js
addEventListener("scroll", () => {
new IntersectionObserver((entries) => {
addEventListener('mousemove', (e) => {
style.setProperty('--x', (e.clientX - rect.left) + 'px')
style.setProperty('--y', (e.clientY - rect.top) + 'px')
addEventListener("mousemove", (e) => {
style.setProperty("--x", x + "px")
style.setProperty("--y", y + "px")
```

### [ZIGZAG a New Underline Text Decoration by the Bell Brothers](https://codepen.io/Music47ell/pen/OPXVjaX)

made with: @keyframes · :hover

```css
.zigzag { position: relative }
.zigzag:after { position: absolute; top: 47px; bottom: 0; -webkit-animation: zigzagplay 2s infinite linear; -moz-animation: zigzagplay 2s infinite linear; -ms-animation: zigzagplay 2s infinite linear; -o-animation: zigzagplay 2s infinit }
.zigzag:hover:after { -webkit-animation-play-state: running; -moz-animation-play-state: running; -o-animation-play-state: running; animation-play-state: running }
0% { background-position: 0 }
100% { background-position: -96px }
0% { background-position: 0 }
100% { background-position: -96px }
0% { background-position: 0 }
100% { background-position: -96px }
0% { background-position: 0 }
100% { background-position: -96px }
0% { background-position: 0 }
```

### [CSS Button Power Lab | 60+ Pure CSS Buttons & Effects - No JavaScript](https://codepen.io/fyildiz1974/pen/azZOOYz)

held: fixed div.scroll-progress, fixed div.bg-effects, fixed header.header, fixed a.back-to-top | on hover of a.skip-link: span.: transform+top ×4, span.: transform+opacity+top ×3, span.: transform+opacity ×2, button.btn: shadow ×2, div.bg-aurora: transform, span.hero-badge-dot: opacity+shadow | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · transition · :hover · :focus-visible · :has() · prefers-reduced-motion · clip-path · mask · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d)

```css
*, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important }
:focus-visible { outline-offset: 3px }
.skip-link { position: absolute; top: -100%; transition: top var(--duration-fast) var(--ease-out) }
.skip-link:focus { top: var(--space-4) }
.section { position: relative }
.sr-only { position: absolute }
.bg-effects { position: fixed; inset: 0 }
.bg-aurora { position: absolute; inset: -50%; filter: blur(80px); animation: aurora-drift 30s ease-in-out infinite alternate }
0% { transform: translate(0, 0) rotate(0deg) scale(1) }
50% { transform: translate(-20px, 15px) rotate(2deg) scale(1.03) }
100% { transform: translate(10px, -10px) rotate(-1deg) scale(1.01) }
.bg-noise { position: absolute; inset: 0; opacity: 0.03; mix-blend-mode: overlay }
```

### [Pure CSS Elastic Responsive Accordion Cards - No JS Required](https://codepen.io/fyildiz1974/pen/RNRwEjr)

held: fixed footer.site-footer | on scroll: div.card: shadow, img.: transform+filter+top, div.card-title: transform+background+color+top, p.card-desc: transform+top | made with: position: fixed · @keyframes · transition · :hover · :focus-visible · prefers-reduced-motion

```css
.cards { box-shadow: 0 26px 70px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.5) }
.card { transition: flex 0.5s ease; position: relative; will-change: flex }
.card:hover { box-shadow: 0 0 15px rgba(0, 0, 0, 0.7) }
.card img { transition: transform 0.5s ease, filter 0.5s ease; filter: grayscale(100%); will-change: transform, filter; animation: shimmer 1.5s infinite }
0% { background-position: 200% 0 }
100% { background-position: -200% 0 }
.card:hover img { transform: scale(1.2); filter: grayscale(0%) }
.card::after { position: absolute; inset: 0; opacity: 0; transition: opacity 0.3s ease }
.card:hover::after { opacity: 1 }
.card-title { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: background 0.3s ease, transform 0.3s ease }
.card:hover .card-title { transform: translate(-50%, -50%) scale(1.1) }
.card-desc { position: absolute; bottom: 0; transform: translateY(100%); transition: transform 0.3s ease }
```

### [Tiny CSS Micro Interactions | One Class, Multiple Effects](https://codepen.io/fyildiz1974/pen/NPrKYxq)

made with: transition · :hover

```css
.box { transition: 0.3s ease }
.pop:hover { transform: scale(1.1) }
.lift:hover { transform: translateY(-8px); box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4) }
.glow:hover { box-shadow: 0 0 0 2px #4dabf7, 0 0 20px #4dabf7 }
.rotate:hover { transform: rotate(-3deg) scale(1.05) }
.fade:hover { opacity: 0.6 }
.label { margin-top: 12px; opacity: 0.7 }
```

### [One Class, Endless Magic | Easy CSS Hover Effects](https://codepen.io/fyildiz1974/pen/MYegQNj)

made with: transition · :hover

```css
.magic { position: relative }
.magic::after { position: absolute; inset: 0; transform: translateX(-100%); transition: transform 0.6s ease }
.magic:hover::after { transform: translateX(100%) }
```

### [Stacked war-up menu](https://codepen.io/Catalin-Bordea/pen/RNRboBY)

made with: :hover

```css
.dropdown { position:absolute; top:100% }
.dropdown-2 { position:absolute; top:0 }
.info-for { position:relative }
.info-for-2 { position:relative }
.give-search { position:relative }
```

### [Light Sweep Variants](https://codepen.io/Mahesh-S-the-decoder/pen/KwzOeyp)

made with: @keyframes · :hover

### [Hover Me Button](https://codepen.io/s198p/pen/WbwVbez)

made with: @keyframes · :hover

```css
.cp-btn { position: relative }
.cp-btn::before { position: absolute; inset: -2px; opacity: 0 }
.cp-btn::after { position: absolute; inset: 2px }
.cp-btn:hover::before { opacity: 5; animation: spin 2s linear infinite }
to { transform: rotate(360deg) }
@keyframes spin animates transform
```

### [bouncing decorations on hover w/ motion](https://codepen.io/vii120/pen/JoXqRrJ)

on scroll: span.inline-block: transform+color+top ×2, div.relative: transform+color+top | made with: transition

### [Pixel hover reveal](https://codepen.io/Luke-Reynolds/pen/VYagROd)

made with: GSAP

```css
.cloneable { position: relative }
.pixelated-image-card { position: relative }
.before__100 { padding-top: 100% }
.pixelated-image-card__default, .pixelated-image-card__img, .pixelated-image-car { position: absolute; top: 0 }
.pixelated-image-card__pixel { position: absolute }
.bio-content h2 { margin-top: 0; margin-bottom: 20px }
```

```js
gsap.to(pixels, {
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
```

### [Bolb Shape img hover effect](https://codepen.io/Aryan-maurya-amsr/pen/ogxQpNO)

on hover of img.: img.: clip-path | made with: transition · :hover · clip-path

```css
:nth-child(1 of img) { clip-path: shape(from 99.33% 44.23%,curve to 99.33% 55.77% with 100.00% 50.00%,curve to 96.67% 66.99% with 98.65% 61.53%,curve to 91.49% 77.29% with 94.68% 72.44%,curve to 84.08% 86.12% with 88.30% 82.14%,curve to 74.83% }
:nth-child(1 of img):hover { clip-path: shape(from 90.22% 45.50%,curve to 94.24% 55.45% with 92.50% 50.00%,curve to 92.78% 65.39% with 95.97% 60.90%,curve to 84.28% 72.10% with 89.59% 69.88%,curve to 78.78% 81.35% with 78.97% 74.31%,curve to 72.84%  }
:nth-child(2 of img) { clip-path: shape(from 97.98% 62.80%,curve to 93.74% 73.52% with 96.49% 68.41%,curve to 87.14% 82.97% with 90.99% 78.63%,curve to 78.53% 90.65% with 83.28% 87.31%,curve to 68.39% 96.13% with 73.78% 93.98%,curve to 57.25%  }
:nth-child(2 of img):hover { clip-path: shape(from 92.03% 61.37%,curve to 90.36% 71.84% with 91.98% 66.62%,curve to 81.74% 77.40% with 88.73% 77.05%,curve to 70.96% 79.74% with 74.75% 77.75%,curve to 63.31% 83.42% with 67.16% 81.74%,curve to 55.39%  }
img { transition: .3s }
img:hover { transition: 1.3s var(--spring-easing) }
```

### [Hover to Preview MP4](https://codepen.io/samsimite/pen/emZQdEP)

made with: nothing recognised — read the code

```css
.box { position: absolute; top: -20px; bottom: 0 }
.box1, .box2, .box3, .box4, .box5, .box6 { position: absolute }
.box1 { top: 10% }
.box2 { top: 10% }
.box3 { top: 10% }
.box4 { top: 60% }
.box5 { top: 60% }
.box6 { top: 60% }
.pop1, .pop2, .pop3, .pop4, .pop5, .pop6 { position: absolute; top: 0; bottom: 0 }
.box1b, .box2b, .box3b, .box4b, .box5b, .box6b { position: absolute; top: 10%; bottom: 10% }
```

```js
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [Sketchy Scribble Underline Animated Link](https://codepen.io/wadi3_lwardy/pen/QwNmZXr)

on scroll: path.[object: opacity | on hover of a.scribble-link: path.[object: opacity ×2 | made with: @keyframes · transition · :hover

```css
.scribble-link { position: relative }
.scribble-link svg { position: absolute; top: 100%; scale: 1.2 1.2; margin-top: 10px }
.scribble-link svg path { opacity: 0; transition: all 75ms }
.scribble-link.active svg path { opacity: 1 }
.scribble-link:not(.active):hover path { animation: draw 1s linear alternate; animation-fill-mode: forwards; opacity: 1 }
@keyframes draw animates stroke-dasharray
```

### [Flip card on hover - CSS only](https://codepen.io/ol-ivier/pen/yyOpxKp)

on scroll: div.flip-box-inner: transform | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
h1 { margin-bottom: 50px }
.flip-box { perspective: 1000px }
.flip-box-inner { position: relative; transition: transform 0.6s; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2) }
.flip-box:hover .flip-box-inner { transform: rotateY(180deg) }
.flip-box-front, .flip-box-back { position: absolute }
.flip-box-back { transform: rotateY(180deg) }
.flip-box h2 { margin-bottom: 10px }
.icon { margin-bottom: 15px }
.instructions { margin-top: 50px }
.instructions h2 { margin-bottom: 10px }
```

### [Image Hover](https://codepen.io/jayramoliya/pen/zxqpEqV)

held: fixed label | on scroll: a.: transform+filter+top ×8, a.: transform ×4 | on hover of a.: a.: transform+filter+top ×10 | made with: position: fixed · transition · :hover · :focus-visible · :has() · backdrop-filter · 3D (perspective / preserve-3d)

```css
:root { --perspective: 2000px }
a { position: relative; transition: scale var(--op, .15s), filter var(--fs), transform var(--ts, var(--fall-smoothness)), flex .3s }
a { transform: translateZ(calc(var(--falloff) * var(--hover-intensity))) rotateY(calc(var(--tilt) * cos(var(--dir)))) rotateX(calc(var(--tilt) * sin(var(--dir)))); filter: brightness(max(.5, var(--falloff, 0) * 1.2)) saturat }
.img { background-position: center }
> i { transition: .3s }
&::after { position: absolute; inset: 0 }
&:hover { opacity: .5 }
&::after { transition: .3s }
&:has(> :checked) { opacity: 1 }
#dbg { position: absolute; opacity: 0 }
nav::before { position: fixed; transform: translateY(100%); opacity: 0; transition: opacity .3s }
.img::before { position: fixed; opacity: .0; transition: .3s }
```

### [Untitled](https://codepen.io/Deepak-jpg-byte/pen/JoXMGxg)

made with: transition · :hover

```css
.container { position: relative }
.hover-img { transition: 0.1s }
.btn-img { position: absolute; top: 70%; transform: translateX(-50%) }
```

### [Glow Grid](https://codepen.io/donny-c-1/pen/xbVPaXB)

on scroll: div.glow_cell: background | made with: :hover · 3D (perspective / preserve-3d)

```css
.container { perspective: 2000px; position: relative }
.glow_grid { position: absolute; margin-top: -40%; background-position: 50% 50%; transform: rotateX(60deg) rotateY(-5deg) rotateZ(10deg) }
```

### [Text effects](https://codepen.io/baahubali92/pen/EaKmMvJ)

on scroll: span.split-heading-title: transform+top ×12 | made with: @keyframes · transition · :hover · IntersectionObserver

```css
&:before { position: absolute; top: 0; animation: text-fill 2s ease-in-out alternate infinite }
.split-heading-title { -webkit-animation: animation-txt 3.5s cubic-bezier(0.72, 0, 0.18, 1) infinite; animation: animation-txt 3.5s cubic-bezier(0.72, 0, 0.18, 1) infinite; text-transform: none }
0% { transform: translate(0px, 0px); -webkit-transform: translate(0px, 0px) }
20% { transform: translate3d(0px, 0px, 0px) scale(1, 0.6862) translate(0%, -0.3549%); -webkit-transform: translate3d(0px, 0px, 0px) scale(1, 0.862) translate(0%, -0.3549%) }
30% { transform: translate(0%, 1.8549%) scale(1, 1.2862); -webkit-transform: translate(0%, 1.8549%) scale(1, 1.2862) }
35% { transform: translate(0%, 0%) scale(1, 1); -webkit-transform: translate(0%, 0%) scale(1, 1) }
40% { transform: translate(0%, 0%) scale(1, 1); -webkit-transform: translate(0%, 0%) scale(1, 1) }
45% { transform: translate(0%, 0%) scale(1, 1); -webkit-transform: translate(0%, 0%) scale(1, 1) }
50% { transform: translate(0%, 0%) scale(1, 1.05); -webkit-transform: translate(0%, 0%) scale(1, 1.05) }
55% { transform: translate(0%, 0%) scale(1, 0.9); -webkit-transform: translate(0%, 0%) scale(1, 0.9) }
60% { transform: translate(0%, 0%) scale(1, 1); -webkit-transform: translate(0%, 0%) scale(1, 1) }
100% { transform: translate(0px, 0px); -webkit-transform: translate(0px, 0px) }
```

```js
new IntersectionObserver((entries) => {
```

### [CSS Glassmorphism Button Hover Effects](https://codepen.io/Yvonne-Angelica/pen/MYywLbJ)

made with: transition · :hover · backdrop-filter

```css
body { position: relative }
.container .btn { position: relative }
.container .btn a { position: absolute; top: 0; box-shadow: 0 15px 35px var(--color-3); border-top: 1px solid var(--color-4); border-bottom: 1px solid var(--color-4); transition: 0.8s; backdrop-filter: blur(15px) }
.container .btn a::before { position: absolute; top: 0; transform: skewX(45deg) translateX(0); transition: 0.8s }
.container .btn:hover a::before { transform: skewX(45deg) translateX(200%) }
.container .btn::before { position: absolute; transform: translateX(-50%); bottom: -5px; transition: 0.8s }
.container .btn:hover::before { bottom: 0 }
.container .btn::after { position: absolute; transform: translateX(-50%); top: -5px; transition: 0.8s }
.container .btn:hover::after { top: 0 }
.container .btn:nth-child(1)::before, .container .btn:nth-child(1)::after { box-shadow: 0 0 5px #ff1f71, 0 0 15px #ff1f71, 0 0 30px #ff1f71, 0 0 60px #ff1f71 }
.container .btn:nth-child(2)::before, .container .btn:nth-child(2)::after { box-shadow: 0 0 5px #2bd2ff, 0 0 15px #2bd2ff, 0 0 30px #2bd2ff, 0 0 60px #2bd2ff }
.container .btn:nth-child(3)::before, .container .btn:nth-child(3)::after { box-shadow: 0 0 5px #1eff45, 0 0 15px #1eff45, 0 0 30px #1eff45, 0 0 60px #1eff45 }
```

### [Motion MouseFollow-004 | magnetic hover](https://codepen.io/atibonibon/pen/ogxXQZN)

on scroll: div.magnetic: transform+top | made with: transition · backdrop-filter · pointer / mouse tracking

```css
.magnetic { transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1); will-change: transform }
.magnetic.primary { box-shadow: 0 8px 40px rgba(21, 38, 50, 0.13) }
.magnetic.ghost { backdrop-filter: blur(8px) }
```

```js
addEventListener('mousemove', (e) => {
addEventListener('mouseleave', () => {
```

### [position and hover](https://codepen.io/Mostafa-Saffarian-moghaddam/pen/LENEvPx)

made with: transition · :hover

```css
* { opacity: 1 }
* { position: absolute; opacity: 0; text-transform: capitalize; transition: .6s }
&:hover { text-transform: uppercase }
&:hover { text-transform: uppercase }
&:hover { text-transform: uppercase }
&:hover { text-transform: uppercase }
```

### [image Map Highlighter - Jquery](https://codepen.io/samsimite/pen/xbZeBXa)

made with: nothing recognised — read the code

```css
.box { position: absolute; top: 0; bottom: 0 }
.mapbox { position: absolute; top: 25px }
.tabcontent1 { position: absolute; top: 0; bottom: 0 }
.title { position: absolute; top: 0 }
.info { position: absolute; top: 85px; bottom: 0 }
.picture { position: absolute; top: 75px }
```

### [Buttons on hover](https://codepen.io/codePen234999/pen/JoGxwvW)

made with: transition · :hover

```css
.container { box-shadow: 3px 7px 20px rgba(0, 0, 0, 0.3) }
.text { margin-bottom: 7px }
.text2 { margin-bottom: 3px }
.bottom-margin { margin-bottom: 4px }
#button1 { transition: 0.3s ease-in-out }
#button2 { transition: 0.7s ease-in-out }
#button3 { transition: 0.1s ease-in-out }
#button4 { transition: 0.45s ease-in-out }
#button5 { transition: 1.7s ease-in-out }
#button6 { transition: 0.12s ease-in-out }
#button7 { transition: 3s ease-in-out }
#button9 { transition: 0.5s ease-in-out }
```

### [HoverProgressBtnFx](https://codepen.io/jgreen721/pen/yyeQoxM)

on scroll: div.mouse-tracker-content: shadow | made with: @keyframes · transition · mix-blend-mode · custom properties driven by JS

```css
.mouse-tracker-parent { position: relative; transition: 0.5s ease; transform: scale(0); animation: inflateintro 1s linear forwards }
100% { transform: scale(1) }
.mouse-tracker-content { position: absolute; top: 5px; transition: 0.25s ease; box-shadow: 0px 0px 0px rgba(25, 25, 25, 0.65) inset, 0px 0px 0px rgba(25, 25, 25, 0.65) inset }
.pressed { box-shadow: 20px 0px 20px rgba(25, 25, 25, 0.65) inset, 5px 10px 5px rgba(25, 25, 25, 0.65) inset }
.mouse-glow, .mouse-progress { position: absolute; inset: 0 }
.mouse-glow { filter: blur(5px) }
.glow-shadow { position: absolute; inset: 0; filter: blur(5px); opacity: 75%; transform: scale(0); mix-blend-mode: multiply }
.glow-shadow-1 { animation: popshadow 1.25s var(--delay) cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite }
0% { transform: scale(1) }
50% { transform: scale(1.5) }
100% { transform: scale(1) }
.glow-shadow-2 { animation: popshadow1 1.25s var(--delay) cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite }
```

```js
addEventListener("mouseenter", (e) => {
style.setProperty("--progress", `${progress}%`)
addEventListener("mouseleave", (e) => {
```

### [3D Hover Effect by Flash Web](https://codepen.io/Flash-Web/pen/vELQNxJ)

on scroll: section.card-3d: transform | made with: transition · :hover · backdrop-filter · 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking

```css
.card-3d { position: relative; transform: perspective(1000px); transition: transform 0.1s ease-out }
.card-3d::before { position: absolute; inset: 0; opacity: 0; transition: opacity 0.5s }
.card-3d:hover::before { opacity: 1 }
.card-content { position: absolute; inset: 5px; backdrop-filter: blur(10px) }
.card-content h3 { margin-bottom: 0.5rem }
```

```js
style.setProperty("--x", `${x}px`)
style.setProperty("--y", `${y}px`)
addEventListener("mousemove", handleMouseMove)
addEventListener("mouseleave", handleMouseLeave)
```

### [Motion MouseFollow-005 | cursor morph — circle to text](https://codepen.io/atibonibon/pen/WbraypX)

held: fixed div.custom-cursor | on scroll: div.custom-cursor: transform+top | on hover of a.hover-target: div.custom-cursor: transform+background+top, span.custom-cursor__label: opacity+top | made with: position: fixed · transition · mix-blend-mode · pointer / mouse tracking · requestAnimationFrame

```css
.custom-cursor { position: fixed; top: 0; transform: translate(-100px, -100px); transition: width 0.25s ease, height 0.25s ease, background 0.25s ease, border 0.25s ease, opacity 0.25s ease; opacity: 1; mix-blend-mode: difference }
.custom-cursor__label { opacity: 0; transition: opacity 0.2s ease }
.custom-cursor.is-hidden { opacity: 0 }
.custom-cursor.is-active .custom-cursor__label { opacity: 1 }
```

```js
addEventListener('mousemove', (e) => {
requestAnimationFrame(animate)
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [Motion MouseFollow-004a | magnetic hover — attraction effect](https://codepen.io/atibonibon/pen/emJPBXw)

on scroll: button.magnetic: transform+background+top | on hover of button.magnetic: button.magnetic: transform+background, button.magnetic: transform+background+top | made with: transition · :hover · backdrop-filter · pointer / mouse tracking

```css
.magnetic { transition: background 0.2s ease, box-shadow 0.2s ease; will-change: transform }
.magnetic.primary { box-shadow: 0 15px 25px rgba(37, 99, 235, 0.25) }
.magnetic.ghost { backdrop-filter: blur(8px) }
```

```js
addEventListener('mousemove', (e) => {
addEventListener('mouseleave', () => {
```

### [Transition 4 childs](https://codepen.io/alobuuls/pen/XJXPjrz)

on scroll: div.right: transform, div.bottom: transform+top, div.left: transform, div.top: transform+top | made with: transition · :hover

```css
.parent { position: relative }
.parent > div { position: absolute; top: 0 }
.right { transform: translateX(100%); transition: transform 0.5s 1.5s ease-in }
.bottom { transform: translateY(100%); transition: transform 0.5s 1s ease-in }
.left { transform: translateX(-100%); transition: transform 0.5s 0.5s ease-in }
.top { transform: translateY(-100%); transition: transform 0.5s 0s ease-in }
.parent:hover > div { transform: translate(0, 0) }
.parent:hover .right { transition: transform 0.5s ease-in }
.parent:hover .bottom { transition: transform 0.5s 0.5s ease-in }
.parent:hover .left { transition: transform 0.5s 1s ease-in }
.parent:hover .top { transition: transform 0.5s 1.5s ease-in }
```

### [Transition delay split letters](https://codepen.io/alobuuls/pen/VYeBpxL)

on scroll: span.: transform+top ×2, span.: transform | made with: transition · :hover

```css
span:nth-of-type(1) { transition: transform 0.3s 0.9s ease-in-out }
span:nth-of-type(2) { transition: transform 0.3s 0.6s ease-in-out }
span:nth-of-type(3) { transition: transform 0.3s 0.3s ease-in-out }
div:hover span:nth-of-type(1) { transform: translateY(100%); transition: transform 0.3s ease-in-out }
div:hover span:nth-of-type(2) { transform: translateY(-100%); transition: transform 0.3s 0.3s ease-in-out }
div:hover span:nth-of-type(3) { transform: translateX(100%); transition: transform 0.3s 0.6s ease-in-out }
```

### [Pop up hover](https://codepen.io/alobuuls/pen/VYeBPrE)

made with: transition · :hover

```css
.ctn { position: relative }
.ctn:before { position: absolute; bottom: 0; transform: translate(50%, 50%); transition: transform 0.3s ease-in-out }
.ctn:after { position: absolute; top: 0; transform: translate(-50%, -50%); transition: transform 0.3s 0.3s ease-in-out }
.ctn:hover:before, .ctn:hover:after { transform: scale(10) }
```

### [ASCII Glitch Ripple Hover Effect](https://codepen.io/erevan/pen/MYKBjdZ)

made with: transition · :hover · requestAnimationFrame

```css
html { --u-offset: 0.2rem }
.ct { position: relative }
li { position: relative }
a { position: relative }
.h a::after { position: absolute; bottom: calc(-1.1 * var(--u-offset)); transition: background 0.3s ease-out; opacity: 0.75 }
header { margin-bottom: 1.5em }
small { margin-top: 1.5em }
a.as:hover { position: relative }
.pt li::before { position: absolute; top: 68%; transform: scaleX(1); transition: transform 1s ease }
.pt li:hover::before { transform: scaleX(2) }
.so { position: absolute }
```

```js
requestAnimationFrame(animate)
```

### [cards with hover](https://codepen.io/ingegus-dev/pen/bNEjbOZ)

on hover of div.card__types: div.card__content: opacity, div.card__hover-text: opacity | made with: transition · :hover

```css
.card__types { transition: background-color 0.3s ease; position: relative }
.card__content { transition: opacity 0.3s ease }
.card__types:hover .card__content { opacity: 0 }
.card__hover-text { position: absolute; inset: 0; opacity: 0; transition: opacity 0.3s ease }
.card__types:hover .card__hover-text { opacity: 1 }
.card__hover-text p { margin-top: 0 }
```

### [hover-underline--animation](https://codepen.io/girafficsworks/pen/vELrrqa)

made with: transition · :hover

```css
body { padding-top: 1rem }
.link { position: relative }
.link::after { position: absolute; bottom: -2px; transform: scaleX(0); transition: transform 0.25s }
.link:hover::after { transform: scaleX(1) }
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

### [Nesting, drop-shadow](https://codepen.io/alobuuls/pen/raxvQQr)

made with: @keyframes · transition · :hover

```css
&:hover { box-shadow: 0 0 1px darkred, 1px 1px 1px darkred, 2px 2px 1px darkred, 3px 3px 1px darkred, 4px 4px 1px darkred, 5px 5px 1px darkred, 6px 6px 1px darkred, 7px 7px 1px darkred }
&:active { box-shadow: 0 0 1px darkred, 1px 1px 1px darkred, 2px 2px 1px darkred, 3px 3px 1px darkred, 4px 4px 1px darkred, 5px 5px 1px darkred }
&.enabled { box-shadow: 0 0 1px #1c1c1c, 1px 1px 1px #1c1c1c, 2px 2px 1px #1c1c1c, 3px 3px 1px #1c1c1c, 4px 4px 1px #1c1c1c, 5px 5px 1px #1c1c1c }
&.enabled { filter: drop-shadow(0 0 1rem green); -webkit-animation: blink 0.2s alternate infinite steps(3); animation: blink 0.2s alternate infinite steps(3) }
to { filter: drop-shadow(0 0 4rem green) }
to { filter: drop-shadow(0 0 4rem green) }
@keyframes blink animates filter
```

### [YouTube Home: Video UI (2025)](https://codepen.io/makesomelayouts/pen/GgodGNB)

made with: transition · :hover

```css
.video-link { position: relative }
.video-link::before { position: absolute; top: -20px; bottom: 0; opacity: 0; transform: scale(0.7); transition: 0.5s cubic-bezier(0.05, 0, 0, 1) }
.video-link:hover::before { opacity: 1; transform: scale(1) }
.video-image__wrapper { position: relative }
.wrapper { position: relative }
.additional { margin-top: 8px }
.author { margin-bottom: 4px }
```

### [hover button from cursor entry](https://codepen.io/sonnykoh/pen/xbZjqVK)

on hover of button.: button.: transform+shadow+top | made with: transition · :hover · :has() · mix-blend-mode

```css
body { position: relative }
button { margin-top: 10%; position: relative; outline-offset: 0px; transform: scale(1.3) }
button:after { position: absolute; top: 20%; transform: translateX(-50%) }
button i { mix-blend-mode: multiply; position: relative }
button i:after { position: absolute; top: -24px; transition: all 0.3s ease, transform 0.1s ease, background 0 ease-out }
button i:nth-child(4):after, button i:nth-child(5):after { top: -24px }
button i:nth-child(6):after, button i:nth-child(7):after, button i:nth-child(8): { top: auto; bottom: -60px }
button i:nth-child(8):after, button i:nth-child(9):after, button i:nth-child(10) { top: auto }
button:hover i:hover:after { top: 0px; transform: scale(9); transition: all 0.2s ease, transform 0.3s ease, width 0.5s ease, height 0.6s ease }
button:hover i:nth-child(1):hover:after, button:hover i:nth-child(5):hover:after { transform: scale(10) }
button:hover i:nth-child(6):after, button:hover i:nth-child(10):after { transform-origin: bottom }
button:hover i:nth-child(10):hover:after, button:hover i:nth-child(7):hover:afte { transform: scale(9.5) translateY(5px) translateX(-2px) }
```

### [Pseudoelements & transitions hover](https://codepen.io/alobuuls/pen/PwZePrp)

made with: transition · :hover

```css
.square { position: relative }
.square:before, .square:after { position: absolute; transition: transform 1s ease-in-out }
.vtl:before { top: 0 }
.vtl:after { bottom: 0 }
.vtl:hover:before { transform: translateY(-100%) }
.vtl:hover:after { transform: translateY(100%) }
.hzl:hover:before { transform: translateX(-100%) }
.hzl:hover:after { transform: translateX(100%) }
.rotate { transform: rotateZ(45deg) }
.dgl:before { top: 50%; transform: scale(1.5) translateY(-50%) rotate(45deg) }
.dgl:after { bottom: 50%; transform: scale(1.5) translateY(50%) rotate(45deg) }
.dgl:hover:before { transform: scale(1.5) translateY(-50%) rotate(45deg) translateX(-100%) }
```

### [Amazing Hover Reveal Effect by Flash Web](https://codepen.io/Flash-Web/pen/pvgLBGX)

on scroll: img.: filter+top | made with: transition · :hover

```css
.card p { transition: all .8s }
img { filter:blur(10px); transition: all 1s }
img:hover { filter: none }
```

### [Blob Effect Button Hover](https://codepen.io/mj-watts/pen/jEWZpLZ)

on scroll: path.[object: color ×3, button.button: color, span.circle: transform+color, span.text: color, span.icon: color, svg.[object: color | made with: transition · :hover · custom properties driven by JS

```css
.button { position: relative; transition: color 200ms ease-out, border-color 200ms ease-in-out }
.circle { position: absolute; top: var(--y, 0); transform: scale(0); will-change: transform; transition: transform 800ms ease-in-out }
.button:hover .circle { transform: scale(2) }
.icon { position: absolute; top: 0; transform: translateY(calc(var(--button-height) / 4.4)); transition: right 200ms ease-in-out }
```

```js
style.setProperty("--width", target.offsetWidth + "px")
style.setProperty( "--x",
style.setProperty( "--y",
```

### [Pseudoclass hover](https://codepen.io/alobuuls/pen/xbZYdXz)

made with: transition · :hover · :has()

```css
.ball { box-shadow: 0 0 5px inset #000, 0 0 5px #000; position: relative; transition: 0.5s ease-in-out }
.ball .square { transition: 0.4s ease-in }
.ball:before { position: absolute; bottom: 0; transition: 0.4s ease }
```

### [Div Animation with Hover Effect by Flash Web](https://codepen.io/Flash-Web/pen/myVXOba)

on scroll: span.: transform+top | made with: transition · :hover

```css
.card p { transition: all .5s }
.card p span { transform: rotate(-90deg); transition: all .5s; text-transform: uppercase }
.card p:hover span { transform: rotate(0) }
```

### [Animated Circle Button by Flash Web](https://codepen.io/Flash-Web/pen/LEGOzrP)

on scroll: svg.[object: transform+top ×2, button.button: transform+background+top | made with: @keyframes · transition · :hover

```css
.button { position: relative; transition: background 300ms, transform 200ms }
.button__text { position: absolute; inset: 0; animation: text-rotation 8s linear infinite }
.button__text span { position: absolute; transform: rotate(calc(19deg * var(--index))); inset: 7px }
.button__circle { position: relative }
.button__icon--copy { position: absolute; transform: translate(-150%, 150%) }
.button:hover { transform: scale(1.05) }
.button:hover .button__icon:first-child { transition: transform 0.3s ease-in-out; transform: translate(150%, -150%) }
.button:hover .button__icon--copy { transition: transform 0.3s ease-in-out 0.1s; transform: translate(0) }
to { rotate: 360deg }
@keyframes text-rotation animates rotate
```

### [Glowing Hover Effect](https://codepen.io/Ragavan-Ranjithkumar/pen/WbrZpBj)

on scroll: button.: transform+top, div.hover-show: transform+top | made with: transition · :hover · pointer / mouse tracking

```css
button { position: relative; transition: all 0.4s ease-in-out }
.bg { position: relative }
.bg::before { position: absolute; top: 0; filter: blur(2px); transition: all 0.4s ease-in-out }
.bg:hover > button { transform: translateY(-3px) }
.bg:hover::before { transform: translateY(-3px); filter: blur(8px) }
.hover-show { position: absolute; top: 0; transform: translate(-50%, -50%) rotateZ(40deg); filter: blur(20px) }
```

```js
addEventListener("mousemove", (e) => {
```

### [Interactive Hover Effects Catalog](https://codepen.io/pixelmasters/pen/KwVvjBw)

held: fixed div.modal, fixed div.toast | on hover of button.btn: button.btn: transform+background+top, span.heart: transform | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking

```css
:root { --transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) }
body { transition: background 0.3s ease }
.header { margin-bottom: 3rem }
.header h1 { margin-bottom: 1rem }
.header p { opacity: 0.9 }
.controls-panel { backdrop-filter: blur(10px); margin-bottom: 2rem }
.btn { transition: var(--transition) }
.btn:hover { transform: translateY(-2px) }
.cards-grid { margin-bottom: 3rem }
.card { box-shadow: var(--shadow); transition: var(--transition); position: relative }
.card-content { position: relative }
.card h3 { margin-bottom: 1rem }
```

```js
style.setProperty('--transition', `all ${speedValue} cubic-bezier(0.175, 0.885, 0.32, 1.275)`)
addEventListener('mousemove', function(e) {
style.setProperty('--x', `${x}px`)
style.setProperty('--y', `${y}px`)
```

### [Interactive Hover Grid with Colorful Lighting Effects](https://codepen.io/MDJAmin/pen/ogbexzb)

made with: position: fixed · @keyframes · transition · :hover

```css
100% { filter: hue-rotate(360deg) }
.square { box-shadow: 0 0 2px #343434; transition: all 1s }
.MDJAminDiv { position: fixed; bottom: 5% }
.MDJAmin { border-top: 1px dashed white !important; border-bottom: 1px dashed white !important; transition: all 0.5s }
@keyframes colorful animates filter
```

### [hover tracking effect (css only)](https://codepen.io/dmbdesignpdx/pen/emJRJGL)

held: fixed aside | on hover of li.: a.: color | made with: position: fixed · transition · :hover

```css
& ul::before { opacity: 0; transition: all var(--duration) }
&:hover ul::before { opacity: 1 }
& ul:not(:hover) li a { transition: color var(--duration), anchor-name 0s var(--duration) allow-discrete }
nav { box-shadow: var(--shadow-md) }
&::before { position: absolute }
*, *::before, *::after { position: relative }
[data-sr] { position: absolute }
[data-support] { position: fixed }
```

### [gsap/image ❍ Multi-Effect 3D Image Hover](https://codepen.io/filipz/pen/myVWGZq)

held: fixed a.credit | on scroll: div.image-layer: transform+opacity+top ×9 | on hover of button.shape-btn: div.image-layer: transform+opacity+top ×6, div.image-layer: opacity | made with: position: fixed · transition · :hover · clip-path · 3D (perspective / preserve-3d) · GSAP · pointer / mouse tracking · requestAnimationFrame

```css
:root { --stack-scale: 1 }
body { position: relative }
.image-container { position: relative }
.image-container.is-3d { perspective: 1600px }
.image-stack { position: absolute; inset: 0; will-change: transform }
.image-layer { position: absolute; inset: 0; background-position: center; will-change: transform, opacity }
.image-layer:not(:first-child) { opacity: 0; transform: scale(0.95) }
.image-layer.rectangle { -webkit-clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%); clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%) }
.image-layer.circle { -webkit-clip-path: circle(45% at 50% 50%); clip-path: circle(45% at 50% 50%) }
.image-layer.diamond { -webkit-clip-path: polygon(50% 0%, 14.1% 50%, 50% 100%, 85.9% 50%); clip-path: polygon(50% 0%, 14.1% 50%, 50% 100%, 85.9% 50%) }
.image-layer.hexagon { -webkit-clip-path: polygon( 25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50% ); clip-path: polygon( 25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50% ) }
.controls { position: relative }
```

```js
gsap.to(layer, {
gsap.to(stackEl, {
gsap.to(rev, {
requestAnimationFrame(processMouseMove)
addEventListener("mousemove", onMove)
addEventListener("mouseenter", onEnter)
addEventListener("mouseleave", onLeave)
```

### [Jquery Harp - Hover](https://codepen.io/samsimite/pen/zxromgL)

made with: nothing recognised — read the code

```css
.box { position: absolute; top: 0; bottom: 0 }
.harp { position: absolute; top: 25px }
.string1, .string2, .string3, .string4, .string5, .string6, .string7, .string8,  { position: absolute; top: 80px }
.theslider { position: absolute; top: 90px }
input[type="range"]::-webkit-slider-thumb { margin-top: -12px }
input[type="range"]:focus::-webkit-slider-thumb { outline-offset: 0.125rem }
input[type="range"]:focus::-moz-range-thumb { outline-offset: 0.125rem }
```

### [Search icon effect replica](https://codepen.io/3P-Cycling/pen/emJBNYv)

on hover of button.search-button: button.search-button: transform+background+shadow+top | made with: transition · :hover

```css
.container { box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2) }
h1 { margin-bottom: 10px }
h2 { margin-top: 30px; margin-bottom: 15px }
p { margin-bottom: 20px }
.search-button { transition: all 0.3s ease }
.search-button:hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(233, 30, 99, 0.4) }
.search-button:active { transform: scale(0.95) }
.info-section ul { margin-top: 15px }
.info-section li { margin-bottom: 8px }
.code-section { margin-top: 40px }
```

### [CSS Has() Hover](https://codepen.io/hernandack/pen/yyeJYoW)

on scroll: figure.gallery__item: transform+filter+top ×5 | on hover of img.gallery__item__img: figure.gallery__item: transform+filter+top ×6 | made with: transition · :hover · :has()

```css
.gallery__item:has(+ * + *:hover) { transform: scale(1.1) translateY(-5%); filter: grayscale(70%) }
.gallery__item:has(+ *:hover) { transform: scale(1.2) translateY(-10%); filter: grayscale(50%) }
.gallery__item:hover { transform: scale(1.5) translateY(-14%); filter: grayscale(0%) }
.gallery__item:hover + * { transform: scale(1.2) translateY(-10%); filter: grayscale(50%) }
.gallery__item:hover + * + * { transform: scale(1.12) translateY(-5%); filter: grayscale(70%) }
```

### [Botones con transiciones](https://codepen.io/OsvaldoZakowicz/pen/OPMNZwV)

on hover of button.btn-elevated: button.btn-elevated: transform+shadow+top | made with: transition · :hover · backdrop-filter

```css
button { position: relative }
.btn-elevated { box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: transform 0.3s ease, box-shadow 0.3s ease, gap 0.3s ease }
.btn-elevated:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5) }
.btn-elevated:active { transform: translateY(0); box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3) }
.btn-fill::before { position: absolute; top: 0; transition: height 0.4s ease-in }
.btn-fill__text { position: relative; transition: color 0.4s ease }
.btn-glass { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(249, 220, 92, 0.3); transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease }
.btn-glass__shine { position: absolute; top: 0; filter: blur(8px); transition: left 0.4s ease-in-out }
.btn-glass:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(250, 214, 67, 0.8) }
.btn-skew__text { text-transform: uppercase; transition: color 1s }
.btn-skew::before { position: absolute; top: 0; transform: skewX(25deg); transition: width 1s }
```

### [Article News Card Concept](https://codepen.io/esedic/pen/QwyyoKP)

on hover of img.: div.post-module: shadow, img.: transform+opacity+top | made with: transition · :hover

```css
.post-module { position: relative; -webkit-box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.15); -moz-box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.15); box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.15); -webkit-transition: all 0.3s linear 0s;  }
.post-module:hover, .hover { -webkit-box-shadow: 0px 1px 35px 0px rgba(0, 0, 0, 0.3); -moz-box-shadow: 0px 1px 35px 0px rgba(0, 0, 0, 0.3); box-shadow: 0px 1px 35px 0px rgba(0, 0, 0, 0.3) }
.post-module:hover .thumbnail img, .hover .thumbnail img { -webkit-transform: scale(1.1); -moz-transform: scale(1.1); transform: scale(1.1); opacity: .6 }
.post-module .thumbnail .date { position: absolute; top: 20px }
.post-module .thumbnail .date .month { text-transform: uppercase }
.post-module .thumbnail img { -webkit-transition: all 0.3s linear 0s; -moz-transition: all 0.3s linear 0s; -ms-transition: all 0.3s linear 0s; -o-transition: all 0.3s linear 0s; transition: all 0.3s linear 0s }
.post-module .post-content { position: absolute; bottom: 0; -webkit-transition: all 0.3s cubic-bezier(0.37, 0.75, 0.61, 1.05) 0s; -moz-transition: all 0.3s cubic-bezier(0.37, 0.75, 0.61, 1.05) 0s; -ms-transition: all 0.3s cubic-bezier(0.37, 0.75, 0. }
.post-module .post-content .category { position: absolute; top: -39px; text-transform: uppercase }
.hover .post-content .description { opacity: 1 !important }
.container .column .demo-title { text-transform: uppercase }
```

### [Animated Fancy Cards](https://codepen.io/esedic/pen/ogbbVzw)

on scroll: article.fancy-card: shadow, div.bg-overlay: background, div.primary: transform+opacity+top, div.secondary: transform+opacity+top | made with: transition · :hover

```css
.header { margin-bottom: 30px }
.fancy-card { position: relative; box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0); transition: all 250ms ease-in; background-position: center center; margin-bottom: 30px }
.fancy-card .bg-overlay { position: absolute; top: 0px; transition: all 200ms linear }
.fancy-card .content { position: absolute; top: 0px }
.fancy-card .content .primary { text-transform: uppercase; transition: all 250ms ease-out 200ms; opacity: 1; transform: translate3d(0px, 0px, 1px) }
.fancy-card .content .secondary { position: absolute; opacity: 0; transform: translate3d(0px, 30px, 1px); transition: all 200ms linear 0ms }
.fancy-card .v-border { position: absolute; top: 0% }
.fancy-card .v-border:before, .fancy-card .v-border:after { transition: all 250ms ease-out }
.fancy-card .v-border:before { top: 10%; position: absolute }
.fancy-card .v-border:after { bottom: 10%; position: absolute }
.fancy-card .h-border { position: absolute; top: 0% }
.fancy-card .h-border:before, .fancy-card .h-border:after { top: 50%; transition: all 250ms ease-out }
```

### [Animated Flipping Cards](https://codepen.io/esedic/pen/XJXXGKX)

on scroll: figure.: transform+top | on hover of li.flip-container: figure.: transform ×2 | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
body { position: relative }
.flip-container { vertical-align: top; -webkit-perspective: 1000px; perspective: 1000px }
.flip-container figure { padding-top: 100%; position: relative; -webkit-transition: -webkit-transform .3s ease-out; transition: -webkit-transform .3s ease-out; transition: transform .3s ease-out; transition: transform .3s ease-out, -webkit-trans }
.flip-container figure img { position: absolute; top: 0 }
.flip-container figure figcaption { text-transform: uppercase; position: absolute; top: 0; -webkit-transform: rotateY(180deg); transform: rotateY(180deg) }
.flip-container figure figcaption p { position: absolute; top: 50%; -webkit-transform: translateY(-75%); transform: translateY(-75%) }
.flip-container:hover figure, .flip-container.hover figure { -webkit-transform: rotateY(180deg); transform: rotateY(180deg) }
```

### [Animated cards example](https://codepen.io/esedic/pen/dPGGrMR)

on hover of div.card: div.card: transform+top | made with: transition · :hover

```css
.container { margin-top: 40px }
.card { position: relative; box-shadow: 0 23px 23px 7px rgba(0, 0, 0, 0.04); transition: all 200ms ease-out }
.card:hover { transform: scale(1.05); transition: all 200ms ease-out }
.card:hover .overlay { bottom: -30px; transition: all 200ms ease-out }
.card .overlay { position: absolute; bottom: -120px; transition: all 200ms ease-in }
.heart-container { position: absolute; bottom: 20px }
.heart { position: relative; top: 0; transform: rotate(-45deg) }
.heart:before, .heart:after { position: absolute }
.heart:before { top: -12px }
.heart:after { top: 0 }
```

### [CSS animated cards](https://codepen.io/esedic/pen/yyeewNd)

on scroll: div.face: transform+background+top, div.face: transform+top | on hover of div.card: div.face: transform+background+top ×2, div.face: transform+top ×2 | made with: transition · :hover

```css
.container { position: relative }
.container .card { position: relative }
.container .card .icon { position: absolute; top: 0; transition: 0.7s }
.container .card .icon .fa { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: 0.7s }
i { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: 0.7s }
.container .card .face { transition: 0.5s }
.container .card .face.face1 { position: relative; transform: translateY(100px) }
.container .card:hover .face.face1 { transform: translateY(0px) }
.container .card .face.face1 .content { opacity: 1; transition: 0.5s }
.container .card:hover .face.face1 .content { opacity: 1 }
.container .card .face.face2 { position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.3); transform: translateY(-100px) }
.container .card:hover .face.face2 { transform: translateY(0) }
```

### [Swap cards on hover](https://codepen.io/esedic/pen/MYKKxgN)

made with: transition · :hover

```css
.wrapper { position: relative }
.child { position: absolute; transform: translate(0, 0) translate(0, 0) scale(1, 1); transition: 0.3s ease-out; transition-property: opacity, transform, filter }
.el1 { opacity: 1 }
.el2 { opacity: 0 }
.wrapper:hover .el1 { opacity: 0 }
.wrapper:hover .el2 { opacity: 1 }
```

### [Cards with animated overlay](https://codepen.io/esedic/pen/ZYQQwwd)

on scroll: a.: transform+top ×3, div.plx-item--holder: transform+opacity, h4.card-item--title: transform+opacity+top, div.card-item--position: transform+opacity+top | made with: transition · :hover

```css
.cards-grid-container { position: relative }
.cards-grid-wrapper { position: relative; transition-property: transform }
.cards-grid-slide { position: relative }
.card-item--inner { position: relative; box-shadow: 0 2px 8px rgb(0 0 0 / 8%) }
.plx-item--holder { position: absolute; top: 0; bottom: 0; transform: translateX(-50%)scaleX(0); transition: 0.3s cubic-bezier(0.24, 0.74, 0.58, 1); opacity: 0 }
.card-item--inner:hover .plx-item--holder { transform: translateX(-50%)scaleX(1); opacity: 1 }
.card-item--title { transform: translateY(8px); transition: all 200ms linear 0ms; opacity: 0; margin-bottom: 20px }
.card-item--inner:hover .card-item--title { transform: translateY(0); opacity: 1 }
.card-item--position { transform: translateY(8px); transition: all 200ms linear 0ms; margin-bottom: 20px; opacity: 0 }
.card-item--inner:hover .card-item--position { transform: translateY(0); opacity: 1 }
.card-item--social a { transform: translateY(100%); transition: all 0.3s ease-in-out }
.card-item--inner:hover .card-item--social a { transform: translateY(0) }
```

### [UIkit animated card](https://codepen.io/esedic/pen/YPwwBdZ)

on hover of a.uk-link-toggle: div.uk-card-body: opacity, h3.el-title: transform+opacity+top, div.el-meta: transform+opacity+top | made with: transition · :hover

```css
.gallery-item .el-item .uk-card-body { position: absolute; bottom: 0; opacity: 0; -webkit-transition: 0.3s ease-out; transition: 0.3s ease-out; -webkit-transition-property: opacity, -webkit-transform, -webkit-filter; transition-property: opacity, -webkit-tran }
.gallery-item .el-item:hover .uk-card-body { opacity: 1 }
.gallery-item .el-item .el-title, .gallery-item .el-item .el-meta { opacity: 0; -webkit-transform: translateY(100%); transform: translateY(100%); -webkit-transition: 0.5s ease-out; transition: 0.5s ease-out; -webkit-transition-property: opacity, -webkit-transform, -webkit-filter; transit }
.gallery-item .el-item:hover .el-title, .gallery-item .el-item:hover .el-meta { opacity: 1; -webkit-transform: translate(0, 0); transform: translate(0, 0) }
```

### [Interactive Magnetic Cursor – React Cursor Effects Demo](https://codepen.io/Rebecca-Gilbert/pen/emJmqaq)

held: fixed div | on hover of button.: div.: transform+top | made with: transition · pointer / mouse tracking

```js
addEventListener("mousemove", handleMove)
```

### [Neon Pricing Cards](https://codepen.io/tofjadesign/pen/OPMPYyE)

held: sticky header | on hover of div.card: div.card: transform+shadow+top | made with: position: sticky · transition · :hover

```css
header { position: sticky; top: 0 }
.card { transition: transform 0.3s ease, box-shadow 0.3s ease; position: relative }
.card h2 { margin-bottom: 1rem }
.card p { margin-bottom: 1rem; opacity: 0.8 }
.card button { transition: background 0.3s ease, transform 0.2s ease }
.card button:hover { transform: scale(1.05) }
.card::before { position: absolute; inset: 0; opacity: 0; transition: opacity 0.4s ease }
.card:hover::before { opacity: 0.15 }
.card:hover { transform: translateY(-10px); box-shadow: 0 0 25px #0ff }
.card * { position: relative }
```

### [Hover-Based Color Harmony](https://codepen.io/Hangga-Aji-Sayekti/pen/WbrNBKv)

made with: transition

```css
.box { transition: background-color 0.4s ease }
```

```js
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [image popup on hover w/ motion](https://codepen.io/vii120/pen/PwZoxqw)

on scroll: div.text-bold: color+top | on hover of img.w-full: div.text-bold: color+top, div.absolute: transform+opacity+top | made with: transition

### [Shopping Card](https://codepen.io/jayramoliya/pen/jEWOzqm)

made with: transition · :hover

```css
.card { position: relative; box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24) }
.card-img { transition: .3s ease }
.card-footer { padding-top: 10px; border-top: 1px solid #ddd }
.text-body { padding-bottom: 10px }
.card-button { transition: .3s ease-in-out }
.card-img:hover { transform: translateY(-25%); box-shadow: rgba(226, 196, 63, 0.25) 0px 13px 47px -5px, rgba(180, 71, 71, 0.3) 0px 8px 16px -8px }
```

### [Card animation - CSS only](https://codepen.io/faridvatani/pen/jEWNRjN)

on scroll: div.card: transform+top | made with: transition · :hover · clip-path

```css
.card { position: relative; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25); transition: transform 0.5s ease-in-out }
.card:hover { transform: translateY(-10px) }
.card:before { position: absolute; bottom: 0; clip-path: circle(0% at 100% 100%); transition: clip-path 0.9s ease-in-out }
.card:hover:before { clip-path: circle(200% at 100% 100%) }
```

### [CSS Variables & Hover](https://codepen.io/rhernando/pen/LEGPdmE)

made with: GSAP

```css
.box-container { margin-bottom: 10px }
.box { transform: translateX(var(--my-progress)) }
```

```js
gsap.to(e.querySelector(".box"), {
addEventListener("mouseenter", () => t.play())
addEventListener("mouseleave", () => t.reverse())
```

### [Gallery 3D - css - (Infinite - hover)](https://codepen.io/daniel-mu-oz/pen/gbaVNwL)

on scroll: img.: transform+top ×5, img.: transform+opacity+top ×5 | on hover of img.: img.: transform+top ×6, img.: transform+opacity+top ×3, img.: transform | made with: @keyframes · :hover · 3D (perspective / preserve-3d) · custom properties driven by JS

```css
section, section > div { position: absolute; perspective: 1000px }
.title { position: absolute; top: 50%; transform: translate(-50%, -50%) }
&:hover { animation-play-state: paused }
&:hover { animation-play-state: paused }
0% { opacity: 0 }
20%,80% { opacity: 1 }
90%,100% { opacity: 0 }
0% { opacity: 0 }
@keyframes opacity animates opacity
@keyframes move animates opacity, --translate-z
```

```js
style.setProperty('--left', left)
style.setProperty('--right', right)
```

### [Facebook hover button](https://codepen.io/CoderRvrse/pen/ByoXrGr)

on hover of a.fb-btn: i.sp: transform+opacity+top ×5, a.fb-btn: transform+background+shadow+top, svg.[object: color+top, path.[object: color+top, span.ring: shadow+top | made with: @keyframes · transition · :hover · :focus-visible · prefers-reduced-motion · backdrop-filter · pointer / mouse tracking

```css
.fb-btn { position:relative; backdrop-filter:saturate(140%) blur(2px); box-shadow: inset 0 0 0 1px #0e1c23, 0 6px 18px rgba(0,0,0,.45); transition:transform .25s ease, box-shadow .25s ease, background .25s ease; will-change:transf }
.fb-btn .ico { filter:drop-shadow(0 0 6px rgba(0,230,195,.45)) }
.fb-btn .ring { position:absolute; inset:-2px; box-shadow:0 0 0 0 rgba(0, 230, 195, 0.0); transition:box-shadow .25s ease }
.fb-btn::after { position:absolute; inset:0; translate:-120% 0; transform:skewX(-15deg); transition:translate .8s ease }
.sp { position:absolute; opacity:0 }
.s1 { top:6px }
.s2 { top:8px }
.s3 { bottom:10px }
.s4 { bottom:12px }
.s5 { top:50% }
0% { transform:translateY(0) scale(.5); opacity:0 }
25% { opacity:.9 }
```

```js
addEventListener('pointermove', onMove)
```

### [Yeti login page](https://codepen.io/jayramoliya/pen/empqWNE)

on hover of button.: button.: background | made with: transition · :hover · clip-path · GSAP

```css
body { position: relative }
form { position: absolute; top: 50%; transform: translate(-50%, -50%) }
form .svgContainer { position: relative }
form .svgContainer div { position: relative; padding-bottom: 100% }
form .svgContainer .mySVG { position: absolute; top: 0 }
form .svgContainer:after { position: absolute; top: 0 }
form .inputGroup { position: relative }
form .inputGroup:last-of-type { margin-bottom: 0 }
form input[type=email], form input[type=text], form input[type=number], form inp { transition: box-shadow 0.2s linear, border-color 0.25s ease-out }
form input[type=email]:focus, form input[type=text]:focus, form input[type=numbe { box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1) }
form button { box-shadow: none; transition: background-color 0.2s ease-out }
form .inputGroup1 .helper { position: absolute }
```

### [Grid with cards with animated overlay](https://codepen.io/esedic/pen/YPyoYxO)

on scroll: div.overlay-content: opacity+top, div.bg: opacity | on hover of div.card: div.overlay-content: opacity+top ×2, div.bg: opacity ×2 | made with: transition · :hover

```css
:root { --overlay-position: 10px }
.card { position: relative; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) }
.card .bg { position: absolute; top: 0; bottom: 0; opacity: 0; transition: opacity 0.6s ease-in }
.card:hover .bg { opacity: 1 }
.overlay { position: absolute; bottom: calc(var(--overlay-position) * (-1)) }
.overlay .overlay-content { opacity: 0; transition: max-height 0.3s ease, opacity 0.3s ease }
.card:hover .overlay .overlay-content { opacity: 1 }
```

### [Vortex Card Image Hover Animation](https://codepen.io/nintendo-sixty-paul/pen/OPyYQjp)

on scroll: span.vortex-card__image: transform+top ×3 | made with: transition · :hover · pointer / mouse tracking

```css
.vortex-card { text-transform: uppercase }
.vortex-card__title { margin-bottom: 16px }
.vortex-card__image-holder { padding-bottom: 60%; position: relative }
.vortex-card__image { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: height .5s cubic-bezier(0.23, 1, 0.32, 1), width .5s cubic-bezier(0.23, 1, 0.32, 1),translate .5s cubic-bezier(0.23, 1, 0.32, 1),rotate .25s cub }
.vortex-card__image:nth-child(1) { opacity: .55 }
.vortex-card__image:nth-child(2) { opacity: .7 }
.vortex-card__image:nth-child(3) { opacity: .85 }
.vortex-card__image img { object-position: center }
```

```js
addEventListener("mousemove",(event) => {
addEventListener("mouseleave", () => {
```

### [Exploding confetti on hover](https://codepen.io/3Diversity-com/pen/JoYVwQV)

held: fixed div.bg, fixed div.grain | made with: position: fixed · @keyframes · transition · :hover · :focus-visible · prefers-reduced-motion · backdrop-filter · mix-blend-mode · custom properties driven by JS

### [Link line hover](https://codepen.io/francoiscoron/pen/ByobVOP)

made with: transition · :hover

```css
.link { position: relative }
.link::before, .link::after { position: absolute; inset: auto 0 calc(var(--_line-h) * 2 * -1) }
.link::after { transition: scale 0.8s cubic-bezier(0.77, 0, 0.175, 1) }
.link::before { scale: 0 1; transition: scale 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) }
.link:hover::before { scale: 1 1; transition: scale 0.8s cubic-bezier(0.77, 0, 0.175, 1) }
.link:hover::after { scale: 0 1; transition: scale 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) }
```

### [Simpe Glowing Glassmorphism Button](https://codepen.io/VertexIT/pen/ogjVvNx)

made with: @keyframes · transition · :hover · backdrop-filter

```css
.btn { position: relative; text-transform: uppercase; transition: all 0.5s; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 0 10px #00d9ff, 0 0 20px #00d9ff, 0 0 40px #00d9ff }
.btn:hover { box-shadow: 0 0 15px #ff00de, 0 0 30px #ff00de, 0 0 60px #ff00de }
.btn span { transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) }
.btn:hover span { transform: translateY(-5px) scale(1.1) }
.btn::before { position: absolute; top: 0; transition: left 0.6s }
.ripple { position: absolute; transform: scale(0); animation: ripple-effect 0.6s linear }
to { transform: scale(4); opacity: 0 }
@keyframes ripple-effect animates transform, opacity
```

### [Glitchy Button Hover Effect — CSS clip-path Glitch + Cyan & Red RGB Split](https://codepen.io/Ahmod-Musa/pen/wBKNpVm)

made with: position: fixed · @keyframes · transition · :hover · clip-path · mix-blend-mode

### [CSS 3D Flip Card with Hover Effect](https://codepen.io/MDJAmin/pen/NPGezzQ)

made with: position: fixed · @keyframes · transition · :hover · 3D (perspective / preserve-3d)

```css
.myCard { perspective: 1000px }
.innerCard { position: relative; transition: transform 0.8s }
.myCard:hover .innerCard { transform: rotateY(180deg) }
.frontSide, .backSide { position: absolute; box-shadow: 0 0 0.3em rgba(255, 255, 255, 0.5) }
.backSide { transform: rotateY(180deg) }
.frontSide::before, .backSide::before { top: 50%; transform: translate(-50%, -50%); position: absolute; filter: blur(20px); animation: animate 5s linear infinite }
0% { opacity: 0.3 }
80% { opacity: 1 }
100% { opacity: 0.3 }
.MDJAminDiv { position: fixed; bottom: 5% }
.MDJAmin { border-bottom: 1px dashed rgb(231, 231, 231); border-top: 1px dashed rgb(231, 231, 231); transition: all 0.5s }
@keyframes animate animates opacity
```

### [effet hover + css](https://codepen.io/h-lautre/pen/bNVQxvj)

on scroll: div.option-card: transform+top | on hover of div.option-card: div.option-card: transform+top ×2 | made with: @keyframes · transition · :hover · backdrop-filter · custom properties driven by JS

```css
header { margin-bottom: 50px }
h1 { margin-top: 15px }
.subtitle { opacity: 0.9 }
.options-grid { margin-top: 40px }
.option-card { backdrop-filter: blur(10px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); transition: transform 0.3s ease }
.option-card:hover { transform: translateY(-5px) }
.option-title { margin-bottom: 20px }
.profile-img { backdrop-filter: blur(15px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2); transition: all 0.4s ease }
.option-1 .profile-img:hover { transform: scale(1.1); box-shadow: 0 0 25px rgba(255, 107, 107, 0.5) }
.option-2 .profile-img:hover { filter: blur(2px) brightness(1.2); box-shadow: 0 0 30px rgba(255, 215, 0, 0.6) }
.option-3 .profile-img:hover { transform: rotateY(180deg); box-shadow: -10px 10px 20px rgba(0, 0, 0, 0.4) }
.option-4 .profile-img:hover { filter: sepia(1) }
```

### [Responsive Social Media Card Hover Effect | HTML & CSS](https://codepen.io/MDJAmin/pen/NPGEXbz)

made with: position: fixed · transition · :hover

```css
.container { position: relative }
.container .card { position: relative }
.container .card .icon { position: absolute; top: 0; transition: 0.7s }
.container .card .icon .fa { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: 0.7s }
i { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: 0.7s }
.container .card .face { transition: 0.5s }
.container .card .face.face1 { position: relative; transform: translateY(100px) }
.container .card:hover .face.face1 { transform: translateY(0px) }
.container .card .face.face1 .content { opacity: 1; transition: 0.5s }
.container .card:hover .face.face1 .content { opacity: 1 }
.container .card .face.face2 { position: relative; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8); transform: translateY(-100px) }
.container .card:hover .face.face2 { transform: translateY(0) }
```

### [Image hover effect using GSAP](https://codepen.io/dm81/pen/NPGEwjp)

made with: transition · GSAP · Lenis / smooth scroll · pointer / mouse tracking · requestAnimationFrame

```css
main { transition: opacity 1s }
.hoverAnimation--01 .hoverAnimation-container .hoverAnimation-text { position: relative }
.hoverAnimation--01 .hoverAnimation-container .hoverAnimation-image { position: relative }
.hoverAnimation--01 .hoverAnimation-container .hoverAnimation-image img { position: absolute }
.hoverAnimation--01 .hoverAnimation-container + .hoverAnimation-container { margin-top: 24px }
.hoverAnimation--01 .hoverAnimation-container + .hoverAnimation-container { margin-top: 12px }
```

```js
requestAnimationFrame(raf)
addEventListener('mousemove', (e) => {// マウスの動きを監視して、画像の位置を更新
gsap.to(img, {
addEventListener('mouseleave', () => {// マウス追従範囲からマウスが離れたときにすべての画像をリセット
gsap.to(hoverImages, {
addEventListener('mouseenter', () => {// マウスが要素に入ったとき
gsap.to(targetImage, {
gsap.to(hoverTextsArr2, {
```

### [Image Sync Grid with Hover & Click](https://codepen.io/baahubali92/pen/qEOJaNq)

on hover of div.image-card: div.image-card: transform+top, img.img-fluid: opacity | made with: transition · :hover

```css
.image-sync-grid { box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) }
.image-card { margin-bottom: 20px; transition: all 0.3s ease-in-out }
.image-card:hover { transform: translateY(-4px) }
.main-image img { transition: opacity 0.4s ease-in-out; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15) }
.main-image img { margin-top: 30px }
```

### [2025-08-28 - text balancing on hover](https://codepen.io/loiclaudet/pen/YPyOEqw)

made with: @keyframes · :hover · prefers-reduced-motion

```css
& path { transform-origin: center bottom }
& path { animation-name: balance; animation-duration: 0.3s; animation-timing-function: linear; animation-direction: alternate; animation-fill-mode: forwards; animation-iteration-count: 2 }
0% { rotate: x 0deg }
100% { rotate: x 160deg }
@keyframes balance animates rotate
```

### [Untitled](https://codepen.io/Tamana-Hussaini/pen/OPyoWgx)

made with: transition · :hover · backdrop-filter · mix-blend-mode

```css
body { transition: 0.5s }
.container { position: relative }
.card { position: absolute; top: 0; transform: translateX(-50%) translateY(calc(50px * var(--card))) rotate(45deg) skew(-15deg, -10deg) scale(0.8); box-shadow: 25px 20px 100px rgba(0, 0, 0, 0.2); transition: 0.5s }
.card:nth-child(3) { box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px) }
.container:hover .card { position: absolute; transform: translateX(calc(-50% + calc(115% * var(--card)))) }
.card__content { position: relative }
.card__icon--mastercard { position: relative }
.card__icon--mastercard::before, .card__icon--mastercard::after { position: absolute }
.card__icon--mastercard::before { opacity: 0.9; top: 0 }
.card__icon--mastercard::after { opacity: 0.75; mix-blend-mode: hard-light; top: 0 }
.card:nth-child(2)::before { position: absolute; top: 50%; opacity: 0.1 }
.card:nth-child(2)::after { position: absolute; top: 30%; transform: translate(-50%, -50%); opacity: 0.1 }
```

### [Magic Spells - Javascript](https://codepen.io/samsimite/pen/ogjyEJb)

held: sticky div.header | made with: position: sticky · :hover

```css
.box { position: absolute; top: 0; bottom: 0 }
.header { position: sticky; top: 0 }
.content { position: relative; top: 0 }
.dropdown-content { position: absolute; box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2) }
.tabcontent1 { position: absolute; top: 32px; bottom: 0 }
.typeof { position: absolute; top: 50px }
.spell { position: absolute; top: 110px; bottom: 0 }
.ingred { position: absolute; top: 110px; bottom: 0 }
```

### [Examples of some CSS Tooltips and Popovers](https://codepen.io/topherlen/pen/gbaedxa)

held: fixed div | made with: position: fixed · transition · :hover · backdrop-filter · popover

```css
:where(dialog, [popover]) { position: fixed }
:where([popover]) { inset: auto }
.tooltip-Parent { top: -10px }
.tooltip-Parent[data-tooltip] { position: relative; will-change: opacity }
.tooltip-Parent[data-tooltip]::after { opacity: 0; transition: opacity 0.3s ease }
.tooltip-Parent[data-tooltip]:hover::after { position: absolute; inset: auto auto calc(100% + 6px) 50%; transform: translateX(-50%); box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12); opacity:  }
#demo-Basic::-webkit-backdrop { -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px) }
#demo-Basic::backdrop { -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px) }
ol { list-style-position: inside }
```

### [Whimsical SVG hover animation with GSAP](https://codepen.io/jdillon/pen/ByorPXy)

made with: GSAP

```js
gsap.to("#top", {
```

### [Holographic Projection Button](https://codepen.io/ibrahim-anwar/pen/zxvWpBa)

on scroll: div.hki_holo_layer: opacity ×2 | on hover of button.hki_interactive_button: div.hki_holo_layer: opacity+top ×2, div.hki_holo_base: transform+shadow+top, div.hki_holo_projection: transform+opacity+top | made with: @keyframes · transition · :hover · 3D (perspective / preserve-3d) · pointer / mouse tracking · requestAnimationFrame

```css
#hki_header { margin-bottom:4rem }
.hki_interactive_button { perspective:1000px }
.hki_holo_base { transition:transform .3s,box-shadow .3s; box-shadow:0 5px 20px -5px rgba(0,0,0,.5),inset 0 1px 1px rgba(255,255,255,.1) }
.hki_interactive_button:hover .hki_holo_base { transform:translateY(2px); box-shadow:0 2px 10px -5px rgba(0,0,0,.5),inset 0 1px 1px rgba(255,255,255,.1) }
.hki_holo_projection { position:absolute; bottom:90%; transform:translateX(-50%) rotateX(75deg); transition:transform .5s cubic-bezier(.22,1,.36,1),opacity .5s; opacity:0 }
.hki_interactive_button:hover .hki_holo_projection { opacity:1; transform:translateX(-50%) rotateX(75deg) scale(1.2) }
.hki_holo_layer { position:absolute; inset:0; animation:hki_holo_flicker 3s infinite linear }
.hki_holo_layer svg { filter:drop-shadow(0 0 10px var(--hki-accent)) }
.hki_holo_layer_1 { transform:translateZ(0); animation-delay:-.1s }
.hki_holo_layer_2 { transform:translateZ(-10px); opacity:.5; animation-delay:-.2s }
0%,100% { opacity:1 }
50% { opacity:.8 }
```

```js
addEventListener('mousemove', (e) => {
requestAnimationFrame(() => {
addEventListener('mouseleave', () => {
```

### [Image Hover Effect](https://codepen.io/kolonatalie/pen/RNWxMBw)

on scroll: div.shimmer-container: shadow, img.: transform+filter+top, div.image-overlay: opacity, h1.: transform+top, p.: transform+top | made with: transition · :hover · mix-blend-mode

```css
.shimmer-container { position: relative; box-shadow: 0 1rem 2rem hsla(207, 100%, 12%, 0.3); transition: box-shadow 0.5s ease }
.shimmer-container img { transition: all 0.5s ease }
.image-overlay { position: absolute; top: 0; mix-blend-mode: screen; opacity: 0; transition: all 0.5s ease }
.image-overlay h1 { margin-bottom: 0.6rem; transform: translateY(-20px); transition: all 0.3s ease }
.image-overlay p { transform: translateY(20px); transition: all 0.3s ease }
.shimmer-container:hover { box-shadow: 0 1rem 4rem hsla(207, 100%, 12%, 0.5) }
.shimmer-container:hover img { transform: scale(1.1); filter: brightness(0.6) }
.shimmer-container:hover .image-overlay { opacity: 1 }
.shimmer-container:hover .image-overlay h1 { transform: translate(0) scale(1.4) }
.shimmer-container:hover .image-overlay p { transform: translateY(0) }
.shimmer-container::after { position: absolute; top: 0; transform: skewX(-25deg) translateX(-200%); transition: transform 0.6s ease }
.shimmer-container:hover::after { transform: skewX(-25deg) translateX(300%) }
```

### [Hover Kitty](https://codepen.io/MXFrench/pen/RNWxpWR)

on scroll: div.card-front: opacity, div.card-back: transform+opacity+top | made with: transition · :hover

```css
.card { box-shadow: 0 0 2rem rgba(255,255,255,.2); position: relative }
.card-back { position: absolute; inset: 0; transition: all .5s ease-in }
.card-front { transition: all .7s ease-out }
.card:not(:hover) .card-back { transform: scale(0) rotate(45deg) translateY(-50%); opacity: 0 }
.card:hover .card-front { opacity: 0 }
```

### [Animal Flex Expand Thing](https://codepen.io/MXFrench/pen/YPyYNMP)

on hover of div.card: div.card: filter, img.: transform+top | made with: transition · :hover

```css
.card { transition: .7s; filter: grayscale(100%) }
.card:hover { filter: none }
.card:hover img { transform: scale(1.2) }
.card img { transition: all .7s }
```

```js
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
```

### [Floating Action Button (FAB) – Animated Hover Effects](https://codepen.io/roniee_1993/pen/NPGwobV)

on scroll: a.fab-btn: transform+shadow+top | on hover of a.fab-btn: a.fab-btn: transform | made with: @keyframes · transition · :hover

```css
.fab-container { position: relative }
.fab-btn { box-shadow: 0 6px 20px rgba(0,0,0,0.4); position: relative; animation: float 3s ease-in-out infinite, gradientMove 4s ease infinite; transition: transform 0.3s ease, box-shadow 0.3s ease }
.fab-btn:hover { transform: scale(1.2) rotate(15deg); box-shadow: 0 12px 30px rgba(0,0,0,0.6); background-position: 100% 100% }
0%, 100% { transform: translateY(0) }
50% { transform: translateY(-8px) }
0% { background-position: 0% 50% }
50% { background-position: 100% 50% }
100% { background-position: 0% 50% }
.fab-btn:after { position: absolute; top: 0; transform: scale(0); opacity: 0 }
.fab-btn.clicked:after { animation: ripple 0.6s forwards }
0% { transform: scale(0); opacity: 0.5 }
100% { transform: scale(2.5); opacity: 0 }
```

### [Animated Navigation Menu – Modern CSS](https://codepen.io/roniee_1993/pen/xbwPMbg)

on scroll: a.: color | on hover of li.: a.: color ×2 | made with: transition · :hover

```css
.nav-bar a { position: relative; transition: color 0.3s ease }
.nav-bar a::after { position: absolute; bottom: 0; transition: width 0.3s ease }
```

### [CSS Image Hover Effects – Modern & Interactive](https://codepen.io/roniee_1993/pen/ByomvXq)

on scroll: img.: transform+filter+top, div.overlay: opacity | on hover of div.image-card: img.: transform+filter+top ×2, div.overlay: opacity ×2 | made with: transition · :hover

```css
.image-card { position: relative; transition: transform 0.3s ease }
.image-card img { transition: transform 0.5s ease, filter 0.5s ease }
.image-card .overlay { position: absolute; inset: 0; opacity: 0; transition: opacity 0.3s ease }
.image-card:hover img { transform: scale(1.1); filter: brightness(0.8) }
.image-card:hover .overlay { opacity: 1 }
```

### [Glassmorphism UI Cards – Modern CSS Design](https://codepen.io/roniee_1993/pen/wBKPRLQ)

on hover of div.cards-wrapper: div.ui-card: transform+shadow+top | made with: transition · :hover · backdrop-filter

```css
.ui-card { backdrop-filter: blur(12px); box-shadow: 0 4px 20px rgba(0,0,0,0.2); transition: transform 0.3s ease, box-shadow 0.3s ease }
.ui-card:hover { transform: translateY(-10px); box-shadow: 0 10px 30px rgba(0,0,0,0.3) }
.ui-card h3 { margin-top: 0 }
```

### [Creative Gradient Button Hover Animation – Pure CSS](https://codepen.io/roniee_1993/pen/PwPOXva)

on scroll: a.animated-btn: color ×2 | made with: transition · :hover

```css
.animated-btn { position: relative; transition: color 0.3s ease }
.animated-btn::before { position: absolute; inset: 0; transition: background-position 0.5s ease }
.animated-btn::after { position: absolute; inset: 2px }
.animated-btn:hover::before { background-position: 100% 0 }
```

### [Glassmorphism Cards Hover Effect – Pure CSS](https://codepen.io/roniee_1993/pen/zxvPyQr)

on scroll: div.glass-card: transform+shadow+top | on hover of div.card-container: div.glass-card: transform+shadow+top | made with: transition · :hover · backdrop-filter

```css
.glass-card { backdrop-filter: blur(10px); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease, box-shadow 0.3s ease }
.glass-card:hover { transform: translateY(-10px); box-shadow: 0 8px 40px rgba(255, 255, 255, 0.2) }
.glass-card h3 { margin-top: 0 }
```

### [Cat theme | Hover Effect](https://codepen.io/thej1812/pen/LEpOxaY)

made with: transition · :hover

```css
.container { position: relative }
.hover-img { transition: 0.1s }
.btn-img { position: absolute; top: 70%; transform: translateX(-50%) }
```

### [Up You Go | Click effect | Draggable](https://codepen.io/thej1812/pen/qEOVRJe)

on scroll: img.back-img: transform+top | on hover of img.back-img: img.back-img: transform+top | made with: transition · pointer / mouse tracking · requestAnimationFrame

```css
body { position: relative }
.image-button { position: relative }
.back-img { position: absolute; top:38%; will-change: transform, top, left; transition: transform 0.2s ease }
```

```js
requestAnimationFrame(animate)
addEventListener("mousemove", (e) => {
```

### [Hover Theme Changer](https://codepen.io/Deva-Kumar-the-bold/pen/ogjGoQj)

on hover of img.gallery-img: img.gallery-img: transform+top, img.gallery-img: filter | made with: transition · :hover · 3D (perspective / preserve-3d)

### [900 M](https://codepen.io/jayramoliya/pen/myemNma)

made with: @keyframes

```css
.outer { position: relative }
.dot { position: absolute; box-shadow: 0 0 10px #ffffff; top: 10%; animation: moveDot 6s linear infinite }
0%, 100% { top: 10% }
25% { top: 10% }
50% { top: calc(100% - 30px) }
75% { top: calc(100% - 30px) }
.card { position: relative }
.ray { position: absolute; opacity: 0.4; box-shadow: 0 0 50px #fff; filter: blur(10px); top: 0%; transform: rotate(40deg) }
.line { position: absolute }
.topl { top: 10% }
.bottoml { bottom: 10% }
@keyframes moveDot animates top, right
```

### [Scroll Button - V1](https://codepen.io/LASJE/pen/pvjeXoY)

on scroll: span.scroll-arrow: transform+top | on hover of button.scroll-button: button.scroll-button: transform+shadow+top, span.scroll-arrow: transform | made with: @keyframes · transition · :hover · backdrop-filter

```css
body { box-shadow: inset 0 0 180px 24px rgba(30,30,80,0.15) }
.scroll-button { position: absolut; margin-top: 0rem; backdrop-filter: blur(8px); transition: all 0.4s ease-in-out; box-shadow: 0 15px 25px -4px rgba(0,0,0,0.4), inset 0 -8px 25px -1px rgba(255, 255, 255, 0.9), 0 -10px 15px -1px rgba(255 }
.scroll-button::before { position: absolute; top: 5px; backdrop-filter: blur(4px); transition: all 0.4s ease; opacity: 1.0 }
.scroll-button::after { position: absolute; inset: 0; box-shadow: 0 0 0 2px rgba(255,255,255,0.2) }
.scroll-button:hover { transform: scale(1.08); box-shadow: inset 0 4px 6px rgba(255,255,255,0.7), inset 0 -4px 6px rgba(0,0,0,0.05), 0 12px 24px rgba(0,0,0,0.15), 0 6px 10px rgba(0,0,0,0.08) }
.scroll-arrow { transform: translateY(0); transition: transform 2.3s ease-in-out }
.scroll-button:hover::before { transform: translateY(10px); animation: smooth-float-before 2.75s cubic-bezier(0.645, 0.045, 0.355, 1) infinite }
.scroll-button:hover .scroll-arrow { animation: smooth-float-arrow 2.75s cubic-bezier(0.645, 0.045, 0.355, 1) infinite }
0% { transform: translateY(0) }
50% { transform: translateY(6px) }
100% { transform: translateY(0) }
0% { transform: translateY(0) }
```

### [Quick test with oklch calc'ed hover state and re-setting primary color per element](https://codepen.io/tomhermans/pen/jEbBmLp)

on scroll: a.: color | on hover of li.: a.: color | made with: :hover

### [WebGL Image Multilayering](https://codepen.io/dm81/pen/QwjpbaV)

made with: transition · :hover · GSAP · three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

```css
.section--01 .section-contents .section-text { position: absolute; bottom: -100%; opacity: 0; transition: bottom 0.5s, opacity 0.5s }
.section--01 .section-contents a:hover .section-text { bottom: 0; opacity: 1; transition: bottom 0.5s 0.5s, opacity 0.5s 0.8s }
.section--01 .section-contents .section-item > .section-inner { position: relative }
.section--01 .section-contents .section-item > .section-inner + * { margin-top: 12px }
.lil-gui { bottom: 0 !important; top: auto !important }
```

```js
gsap.timeline({ paused: true })
gsap.to(this.hoverTimeline, {
requestAnimationFrame(this.animate)
gsap.to(layer.position, {
addEventListener('mousemove', this.onMouseMove)
addEventListener('mouseenter', this.onMouseEnter)
addEventListener('mouseleave', this.onMouseLeave)
gsap.to(this.layers.children.map(layer => layer.position), {
```

### [Interactive Displacement Effects using Three.js and GPGPU](https://codepen.io/dm81/pen/Kwdaweo)

made with: position: fixed · @starting-style · transition · :focus-visible · :has() · clip-path · Lenis / smooth scroll · three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

```css
:focus-visible { outline-offset: 3px }
:where(del,ins,s)::before, :where(del,ins,s)::after { clip-path: inset(100%); position: absolute }
:where(dialog), :where(dialog)::backdrop { opacity: 0; transition: opacity 300ms ease-out, display 300ms allow-discrete, overlay 300ms allow-discrete }
:where(dialog[open]), :where(dialog[open])::backdrop { opacity: 1 }
:where(dialog[open]), :where(dialog[open])::backdrop { opacity: 0 }
body.displacement-effect-enabled img.js-displacement-image { opacity: 0 }
body.displacement-effect-enabled .webgl-canvas .webgl-canvas__body { position: fixed; top: 0 }
body.displacement-effect-enabled .wrapper { position: fixed; top: 0 }
body.displacement-effect-enabled .scrollable { position: absolute; top: 0 }
body.displacement-effect-disabled .container:before { background-position: center; position: fixed; top: 0 }
.gridView-contents .gridView-item img { opacity: 0 }
.boxx--01 { position: relative }
```

```js
requestAnimationFrame(loop)
addEventListener('mousemove', onMouseMove)
```

### [Hover Effects: GSAP & Three.js](https://codepen.io/dm81/pen/RNWoOzK)

made with: transition · :hover · clip-path · 3D (perspective / preserve-3d) · GSAP · ScrollTrigger · Lenis / smooth scroll · three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

```css
main { opacity: 1; transition: opacity 0.6s 0.4s }
#contents { border-top: 1px solid #27272c; position: relative }
#contents::before { position: absolute; top: 0 }
#contents .section--01 { position: relative }
#contents .section--01:before { border-bottom: 1px solid #27272c; bottom: 0; position: absolute }
.section--00 { position: relative }
.section--00 .section-header { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.section--00 .section-header .section-title { text-transform: uppercase }
.section--00 .section-contents { position: relative }
.section--00 .section-contents .section-scroll { text-transform: uppercase; background-position: right center }
#Jw27 .hover .hover-anchor { perspective: 600px }
#Jw27 .hover .hover-anchor > .hover-inner { position: relative; transform: translateZ(calc(-1 * 120px / 2)) rotateX(0deg) }
```

```js
gsap.registerPlugin(ScrollTrigger)
requestAnimationFrame(raf)
gsap.timeline({paused: true})
addEventListener('mouseenter', e=>{
addEventListener('mouseleave', e=>{
gsap.to(e.target, {
requestAnimationFrame(()=>{
addEventListener('mouseenter', e=>onMouseEnter(e))
```

### [gsap/component ❍ Interactive Table with Image Hover & Idle Animation](https://codepen.io/filipz/pen/EaVNXmb)

held: fixed div.background-image, fixed aside.corner-elements | on scroll: li.project-item: opacity ×19, span.project-data: color ×5, li.project-item: shadow, div.background-image: opacity, span.time-blink: opacity | on hover of li.project-item: span.project-data: color ×10, li.project-item: opacity+shadow ×2, div.background-image: transform+top | made with: position: fixed · @keyframes · transition · :hover · mix-blend-mode · GSAP · requestAnimationFrame

```css
body { text-transform: uppercase; position: relative }
body::after { position: absolute; top: 0 }
.portfolio-container::before { position: fixed; top: 0; opacity: 0.3; mix-blend-mode: overlay }
.portfolio-container { position: relative }
.project-item { border-bottom: 1px solid rgba(200, 255, 200, 0.1); transition: all 0.3s ease; opacity: 1; position: relative }
.project-item.active { opacity: 1; box-shadow: inset 0 1px 0 rgba(200, 255, 200, 0.2), inset 0 -1px 0 rgba(200, 255, 200, 0.2) }
.portfolio-container.has-active .project-item { opacity: 0.3 }
.portfolio-container.has-active .project-item.active { opacity: 1 }
.project-item::before { opacity: 0.6; position: relative; transition: opacity 0.1s ease }
.project-item.counter-hidden::before { opacity: 0.05 }
.project-data { position: relative; transition: all 0.3s ease }
.project-data::after { position: absolute; top: 0; transition: transform 0.3s ease; transform: scaleX(0) }
```

```js
addEventListener("mouseleave", () => {
gsap.to(element, {
addEventListener("mouseenter", handleMouseEnter)
addEventListener("mouseleave", handleMouseLeave)
requestAnimationFrame(() => {
gsap.timeline({
```

### [Modern Hover Button Effects Using SCSS](https://codepen.io/joydippaul9/pen/RNWRmjY)

on scroll: button.franchise-btn: color, span.btn-text: color, div.btn-icon: background+color, svg.[object: color, path.[object: color | made with: @keyframes · transition · :hover

```css
&::before { position: absolute; top: 0; transition: left 0.4s ease }
.btn-text { position: relative }
&:active { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) }
.btn-text { position: relative }
svg { transition: all 0.4s ease }
&::after { position: absolute; transform: translate(-50%, -50%); transition: width 0.6s, height 0.6s }
&:focus { box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.3) }
0% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.4) }
70% { box-shadow: 0 0 0 10px rgba(14, 165, 233, 0) }
100% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0) }
@keyframes pulse animates box-shadow
```

### [Gradient Text with Hover Effect](https://codepen.io/KhawajaHaider/pen/GgpqaWX)

on scroll: h1.gradient-text: opacity+color | made with: transition · :hover

```css
.gradient-text { transition: color .2s }
.gradient-text:hover { opacity: .7 }
```

### [Grainy Gradient Hover Effect](https://codepen.io/tainks/pen/MYaeeMP)

made with: :hover · mix-blend-mode

```css
.under { filter: brightness(120%) contrast(130%); mix-blend-mode: screen }
.over { position: relative; top: -100%; mix-blend-mode: color }
```

### [Responsive hover cards with image mask effect](https://codepen.io/Pixelrobin/pen/gbaMrYd)

on hover of a.hover-feature: h3.hover-feature__title: transform+top, p.hover-feature__description: opacity+top | made with: @keyframes · transition · :hover · prefers-reduced-motion · mask

```css
from { transform: translateY(var(--hover-feature-transition-offset)); opacity: 0 }
to { transform: none; opacity: 1 }
.hover-feature { --hover-feature-gradient-top: black; --hover-feature-gradient-bottom: transparent; --hover-feature-transition-offset: 10px; position: relative }
.hover-feature__content { transition: background-color 400ms }
.hover-feature__description-more { margin-top: 0.5em; text-underline-offset: 0.25em }
.hover-feature { transition: --hover-feature-gradient-top 300ms, --hover-feature-gradient-bottom 300ms }
.hover-feature__image { position: absolute; inset: 0 }
.hover-feature__content { position: relative; transition: background-color 300ms; padding-bottom: calc(25px + var(--hover-feature-transition-offset)) }
.hover-feature__title { transform: translateY(var(--hover-feature-transition-offset)); transition: transform var(--hover-feature-transition-duration) }
.hover-feature__description { opacity: 0 }
.hover-feature:hover, .hover-feature:focus { --hover-feature-gradient-top: rgba(0, 0, 0, 0.2); --hover-feature-gradient-bottom: rgba(0, 0, 0, 0.2) }
.hover-feature:hover .hover-feature__description, .hover-feature:focus .hover-fe { opacity: 1; animation-name: hoverFeatureDescriptionEnter; animation-duration: var(--hover-feature-transition-duration); animation-fill-mode: backwards; animation-timing-function: var(--hover-feature-transition-timing); a }
```

### [button practice via log-in form](https://codepen.io/bdanahy/pen/VYveVRP)

on scroll: input.form__input: shadow | on hover of button.form__button_submit: input.form__input: shadow, button.form__button_submit: background | made with: :hover

```css
.form { box-shadow: 3px 3px 5px #2f71e5 }
.form__title { margin-bottom: 10px }
.form__fieldset { margin-bottom: 30px }
.form__label { margin-bottom: 12px; margin-top: 32px }
.form__input[type="text"]:hover, .form__input[type="password"]:hover { box-shadow: 3px 3px 5px #2f71e5 }
.form__input[type="checkbox"]:hover { box-shadow: 1px 1px 3px #2f71e5 }
.form__button_submit { box-shadow: 1px 2px 3px #000 }
.form__button_submit:active { transform: translate(1px, 2px); box-shadow: inset 1px 2px 3px #0b0b0b }
```

### [Menu CSS hover](https://codepen.io/Volkiw/pen/gbaaxxq)

made with: transition · :hover

```css
.menu { padding-bottom: 3rem }
&::before { position: absolute; transition: all ease 1.4s; top: 0; border-bottom: 2px solid #ffffff }
```

### [Underline Link Hover Animation](https://codepen.io/nintendo-sixty-paul/pen/YPyXObb)

on scroll: a.underline-link: color+top, span.: color+top | made with: @keyframes · transition · :hover

```css
a { text-transform: uppercase; transition: color .35s ease }
a span { background-position: 100% 100%; padding-bottom: 6px }
a:hover span { transition: background-position .5s cubic-bezier(.5,0,.2,1) }
a.out span { animation: animate-in .5s cubic-bezier(.5,0,.2,1) }
0% { background-position: 200% 100% }
100% { background-position: 100% 100% }
@keyframes animate-in animates background-position
```

### [Hover Tabs - Javascript](https://codepen.io/samsimite/pen/MYawvYy)

made with: :hover · clip-path

```css
.box { position: absolute; top: 0; bottom: 0 }
.tabbox { position: absolute; top: 0 }
.tab1, .tab2, .tab3, .tab4, .tab5, .tab6 { position: absolute; top: 0; clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%) }
.catagory { position: absolute; bottom: 0; top: 40px }
.back1, .back2, .back3, .back4, .back5, .back6 { position: absolute; top: 0; bottom: 0; padding-top: 20px }
.buttons2:hover { box-shadow: 0 0 0 5px #3b83f65f }
.buttons2:focus { box-shadow: 0 0 0 5px #3b83f65f }
.tabcontent1 { position: absolute; top: 0; bottom: 0 }
.tabcontent2 { position: absolute; top: 130px; bottom: 50px }
.picture { position: absolute; top: 0; bottom: 0 }
```

### [Hover effect](https://codepen.io/thej1812/pen/empYXjg)

held: fixed div.project-image, fixed div.project-image, fixed div.project-image | on scroll: div.project-item: background, div.project-image: transform+opacity+top | made with: position: fixed · transition · :hover · pointer / mouse tracking

```css
body { padding-bottom: 10px; padding-top: 0px }
.project-title { margin-bottom: 10px }
.project-item { position: relative; border-bottom: 2px solid #ddd; transition: all 0.3s ease }
.project-image { position: fixed; opacity: 0; transform: scale(0.8); transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); background-position: center }
.project-item:hover .project-image { opacity: 1; transform: scale(2) }
```

```js
addEventListener('mouseenter', function() {
addEventListener('mouseleave', function() {
addEventListener('mousemove', function(e) {
```

### [justForFun](https://codepen.io/abdAlhadyAlboshy/pen/RNWwBmd)

made with: :hover

```css
div { position: relative }
div:after { position: absolute; transform: translate(-50%, -50%) }
div:before { position: absolute; transform: translate(50%, 50%) }
div:hover:before, div:hover:after { transform: translate(0%, 0%) }
```

### [Smooth Letter Slide-Out Effect](https://codepen.io/SultanKhanCQ/pen/empOVdq)

on scroll: div.cursor-hint: opacity, span.letter-l: opacity, span.letter-i1: opacity, span.letter-i2: opacity, span.letter-i3: opacity, span.letter-i4: opacity | on hover of a.: div.credit: opacity | made with: transition · :hover

```css
.container { position: relative; padding-top: 3rem }
.cursor-hint { opacity: 0.5; transition: opacity 0.3s ease }
.container:hover .cursor-hint { opacity: 0 }
.letter-s { position: relative }
.letter-l, .letter-i1, .letter-i2, .letter-i3, .letter-i4, .letter-i5, .letter-d { opacity: 0; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) }
.container:hover .letter-l { opacity: 1 }
.container:hover .letter-i1 { opacity: 1 }
.container:hover .letter-i2 { opacity: 1 }
.container:hover .letter-i3 { opacity: 1 }
.container:hover .letter-i4 { opacity: 1 }
.container:hover .letter-i5 { opacity: 1 }
.container:hover .letter-d { opacity: 1 }
```

```js
addEventListener("mouseleave", function () {
addEventListener("mouseenter", function () {
```

### [Discord-like Emoji Animations](https://codepen.io/ArsenTech/pen/wBKwPJw)

on scroll: p.: transform+filter+top | made with: transition · :hover

```css
.box p { filter: grayscale(1); transition: 0.4s all }
.box p:hover { filter: grayscale(0); transform: scale(1.2) }
```

### [javascript/component ❍ Full Screen Image Zoom on Hover with Proximity](https://codepen.io/filipz/pen/PwqMvWa)

held: fixed div.bg-container, fixed div.gradient-top, fixed div.gradient-bottom, fixed div.cursor-image | on scroll: img.bg-image: transform+opacity+top, section.projects: transform+top, div.project-title: transform+top, img.: transform+top | made with: position: fixed · @keyframes · transition · :hover · mix-blend-mode · pointer / mouse tracking · requestAnimationFrame

```css
html, body { text-transform: uppercase }
body::before { position: fixed; top: -50%; -webkit-animation: noise 0.2s steps(8) infinite; animation: noise 0.2s steps(8) infinite; opacity: 0.6 }
0% { transform: translate(0, 0) }
12.5% { transform: translate(-1%, -2%) }
25% { transform: translate(-2%, 1%) }
37.5% { transform: translate(1%, -2%) }
50% { transform: translate(-1%, 3%) }
62.5% { transform: translate(-2%, 1%) }
75% { transform: translate(2%, 0) }
87.5% { transform: translate(0, 2%) }
100% { transform: translate(-1%, 0) }
0% { transform: translate(0, 0) }
```

```js
requestAnimationFrame(() => {
addEventListener("mouseenter", (e) => handleEnter(item, e))
addEventListener("mouseleave", () => handleLeave(item))
addEventListener("mouseleave", () => {
addEventListener("mousemove", updateCursor)
```

### [Animated Sketch Hover with SVG Filter Effects](https://codepen.io/johndjameson/pen/xbGvXop)

on scroll: a.: filter+color | made with: :hover · clip-path

```css
.visually-hidden { -webkit-clip-path: inset(50%); clip-path: inset(50%); position: absolute }
&:hover { filter: url("#wiggle") }
```

### [Image Hover Zoom with Info Overlay](https://codepen.io/ash1198/pen/azOgEWz)

made with: transition · :hover

```css
.card { position: relative }
.card img { transition: transform 0.4s ease }
.overlay { position: absolute; inset: 0; opacity: 0; transform: translateY(20px); transition: all 0.4s ease }
.card:hover img { transform: scale(1.05) }
.card:hover .overlay { opacity: 1; transform: translateY(0) }
```

### [Simple Popover](https://codepen.io/Jack-Shaw/pen/wBabGWw)

on hover of button.popover-container: div.popover-content: transform+opacity+top | made with: transition · :hover · popover

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

### [Death Stranding inspired menu](https://codepen.io/yexx/pen/bNdyVmL)

made with: @keyframes · :hover · :has() · clip-path · mix-blend-mode · 3D (perspective / preserve-3d)

```css
main { perspective: 90vw }
.overlay { position: absolute; inset: 0; transform: rotateY(-12deg); opacity: 0.18; mix-blend-mode: overlay }
&:before { position: absolute; inset: 0 -50%; opacity: 0 }
&:after { inset: 0 }
&:has(span.l:hover):before { animation: enter-hover-left 160ms forwards steps(2), blink 1200ms ease-in 114ms infinite }
&:has(span.r:hover):before { animation: enter-hover-right 160ms forwards steps(2), blink 1200ms ease-in 114ms infinite }
from { opacity: 0.5; clip-path: polygon(0 0, 25% 0, 25% 100%, 0 100%) }
25% { clip-path: polygon(0 0, 75% 0, 25% 100%, 0 100%) }
50% { clip-path: polygon(0 0, 75% 0, 75% 100%, 0 100%) }
75% { clip-path: polygon(0 0, 75% 0, 75% 100%, 25% 100%) }
to { opacity: 1; clip-path: polygon(25% 0, 75% 0, 75% 100%, 25% 100%) }
from { opacity: 0.5; clip-path: polygon(75% 0, 100% 0, 100% 100%, 75% 100%) }
```

### [Hover-Cards](https://codepen.io/sitesoch/pen/ByNEEEE)

on scroll: div.card__data: transform+top, div.card__data: transform+opacity+top | made with: @keyframes · transition · :hover

```css
.card__article { position: relative }
.card__data { box-shadow: 0 8px 24px hsla(0, 0%, 0%, .15); position: absolute; bottom: -9rem; opacity: 0; transition: opacity 1s 1s }
.card__description { margin-bottom: .25rem }
.card__title { margin-bottom: .75rem }
.card__article:hover .card__data { animation: show-data 1s forwards; opacity: 1; transition: opacity .3s }
.card__article:hover { animation: remove-overflow 2s forwards }
.card__article:not(:hover) { animation: show-overflow 2s forwards }
.card__article:not(:hover) .card__data { animation: remove-data 1s forwards }
50% { transform: translateY(-10rem) }
100% { transform: translateY(-7rem) }
50% { transform: translateY(-10rem) }
@keyframes show-data animates transform
```

### [otherCardEffect](https://codepen.io/abdAlhadyAlboshy/pen/wBaZwVd)

on scroll: div.: transform+filter+top ×2 | made with: transition · :hover · :has() · backdrop-filter

```css
div { backdrop-filter: blur(10px); transition: 0.3s; box-shadow: 0px 0px 4px white }
div:hover { transform: scale(1.3) }
body:has(div:hover) div:not(:hover) { transform: scale(0.8); filter: blur(5px) }
```

### [Hover-Triggered Image Follow Animation 🖼️](https://codepen.io/bato-web-agency/pen/raVROyX)

held: fixed div.preview, fixed div.list-images__image-box, fixed aside.contact-menu | on hover of img.: div.list-images__item: background, h2.list-images__item-heading: color, p.list-images__item-text: color, a.list-images__item-btn: color, div.list-images__image-box: transform+opacity+top | made with: position: fixed · transition · :hover · (hover: hover) gate · backdrop-filter · pointer / mouse tracking · requestAnimationFrame

```css
.list-images__heading { text-transform: uppercase }
.list-images__item { border-top: 1px solid rgba(255, 255, 255, 0.3); border-bottom: 1px solid rgba(255, 255, 255, 0.3); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); transition: background-color 0.3s ease }
.list-images__item-heading { transition: color 0.3s ease }
.list-images__item-text, .list-images__item-date { transition: color 0.3s ease }
.list-images__item-image img { -o-object-position: center center; object-position: center center }
.list-images__item-btn { transition: color 0.3s ease, border-color 0.3s ease, background-color 0.3s ease }
.list-images__image-box { position: fixed; opacity: 0; transform: translate(-50%, -50%) rotate(4deg); will-change: transform; transition: opacity 0.3s ease }
.list-images__image-box.active { opacity: 1 }
.list-images__image-box img { -o-object-position: center center; object-position: center center }
```

```js
requestAnimationFrame(animateImage)
addEventListener("mousemove", showImage, false)
```

### [Interactive Scroll + Hover + Mouse + Particles](https://codepen.io/Mahesh-S-the-decoder/pen/xbGmyjx)

made with: transition · :hover · IntersectionObserver · pointer / mouse tracking · anime.js

```css
.particle { position: absolute; opacity: 0.3 }
header { position: relative }
.card { transition: transform 0.3s ease, box-shadow 0.3s ease; opacity: 0; transform: translateY(50px); will-change: transform }
.card:hover { transform: scale(1.05) rotate(1deg); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4) }
```

```js
new IntersectionObserver(
addEventListener("mousemove", (e) => {
```

### [Hyperlink Hover Highlighters](https://codepen.io/vtlanglois/pen/WbvYpNx)

made with: transition · :hover

```css
a { background-position: left; transition: background 0.4s cubic-bezier(0.1, 0.89, 0.21, 0.93) }
```

### [Hover Image gallery](https://codepen.io/harshchauhan525/pen/LEVgLaM)

made with: transition · :hover

```css
.main-section div.galary-data-container .galary-items-data .galary-item { position: relative; transition: all 0.3s ease-in-out }
.main-section div.galary-data-container .galary-items-data .galary-item .card-bo { position: absolute; bottom: -100%; transition: all 0.5s ease-in-out }
.main-section div.galary-data-container .galary-items-data .galary-item:hover .c { bottom: 0 }
```

### [Card Animation : Gallery](https://codepen.io/harshchauhan525/pen/MYwPmPw)

on scroll: div.card: opacity+top ×4, div.card: transform+top | on hover of div.card: div.card: transform+opacity+top ×2 | made with: transition · :hover

```css
.image-gallary-section { transition: all 0.5s ease-in-out }
.image-gallary-section:hover > :not(:hover) { opacity: 0.4 }
.image-gallary-section .card { transition: transform 0.5s ease }
.image-gallary-section .card:hover { transform: scale(1.1) }
```

### [Glowing Cards](https://codepen.io/sakshishukla/pen/MYwqNWV)

made with: @keyframes · transition · :hover

```css
body { padding-top: 3rem }
.heading { margin-bottom: 2rem; animation: typing 3s steps(19) 1 forwards,blink 0.7s step-end infinite }
.card-container { margin-top:25px }
.card { transition: 0.3s ease; box-shadow:0 0 20px #444 }
.card:hover { box-shadow: 0 0 20px #ff00ff; transform: scale(1.05) }
@keyframes typing animates width
@keyframes blink animates border-color
```

### [Custom oval cursor](https://codepen.io/maramaramara/pen/azOaaBx)

held: fixed div.custom-cursor | made with: position: fixed · transition · :hover · mix-blend-mode · pointer / mouse tracking

```css
.card { box-shadow: 1px 8px 16px rgba(0,0,0,0.15) }
h1 { margin-top: 8px }
.custom-cursor { position: fixed; top: 0; transform: translate(-50%, -50%); mix-blend-mode: difference; transition: transform 0.05s ease-out }
.custom-cursor.hovering { transform: translate(-50%, -50%) scale(3) }
```

```js
addEventListener('mousemove', function(e) {
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [Tailwind CSS Button Designs](https://codepen.io/sakshishukla/pen/YPXOZMV)

made with: nothing recognised — read the code

### [Hover effect](https://codepen.io/plutocrat/pen/xbGJMJP)

on scroll: div.content: transform+top, p.: opacity | made with: @keyframes · transition · :hover

```css
.card { position:relative }
.card:before { position:absolute; top:0; background-position:0% 0%; transition: background-position 350ms ease, transform 350ms ease }
.card:hover:before { transform:scale(1.08, 1.03); background-position:100% 100% }
.content { position:relative; background-position:0% 0%; transition:background-position 380ms ease, transform 380ms ease, background-image 380ms ease }
.card:hover > .content { background-position:-10% 0%; transform: scale(1.08, 1.03) }
p { position:relative; opacity:0; transition:opacity 240ms ease }
.card:hover p { opacity: 1 }
span { animation: background-pan 3s ease-in-out infinite }
from { background-position: 0% center }
to { background-position: -250% center }
@keyframes background-pan animates background-position
```

### [Just a neat little bit of UI.](https://codepen.io/peterbenoit/pen/EajvqbJ)

held: fixed a.ui-badge | on hover of a.: svg.[object: opacity, a.: opacity | made with: transition · :hover

```css
.outer { position: relative }
.ring { position: absolute; inset: 0 }
.ring::before { position: absolute; inset: -20%; transform: rotate(0deg); transition: transform 0.2s linear, opacity 0.2s ease; opacity: 0 }
.outer:hover .ring::before { transform: rotate(80deg); opacity: 1 }
.inner { position: relative }
.content { transition: opacity 0.3s ease }
.content svg, .content a { opacity: 0.4; transition: opacity 0.3s ease }
.content span { opacity: 0.4 }
.outer:hover .content svg, .outer:hover .content a { opacity: 1 }
```

### [button hover effect](https://codepen.io/coder-masud/pen/pvJNMPg)

made with: transition · :hover

```css
.beautiful-btn { box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); transition: all 0.3s ease-out; position: relative }
.beautiful-btn:hover { transform: translateY(-3px) scale(1.05); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) }
.beautiful-btn:active { transform: translateY(1px) scale(0.98); box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) }
.beautiful-btn.alt-style { box-shadow: 0 4px 15px rgba(255, 154, 158, 0.4) }
.beautiful-btn.alt-style:hover { box-shadow: 0 8px 25px rgba(255, 154, 158, 0.5) }
.beautiful-btn.alt-style:active { box-shadow: 0 2px 10px rgba(255, 154, 158, 0.3) }
.beautiful-btn::before { position: absolute; top: 0; transition: all 0.5s ease-in-out }
```

### [Slideshow Pause on Hover - Javascript](https://codepen.io/samsimite/pen/myJrKde)

made with: @keyframes · :hover

```css
.box { position: absolute; top: 0; bottom: 0 }
.box1 { position: relative; box-shadow: 0px 20px 0px -10px #6A6A6A, 0px -20px 0px -10px #6A6A6A, 20px 0px 0px -10px #6A6A6A, -20px 0px 0px -10px #6A6A6A, 0px 0px 0px 10px #FF0000, 5px 5px 15px 5px rgba(0, 0, 0, 0) }
.box1:hover { box-shadow: 0px 20px 0px -10px #6A6A6A, 0px -20px 0px -10px #6A6A6A, 20px 0px 0px -10px #6A6A6A, -20px 0px 0px -10px #6A6A6A, 0px 0px 0px 10px #2a2461, 5px 5px 15px 5px rgba(0, 0, 0, 0) }
.box2 { position: absolute; top: 0; bottom: 0; animation: dog 100s linear infinite }
@keyframes dog animates left
```

### [Confetti Button Hover 🎉 | Webflow-Ready Effect](https://codepen.io/Franbeltramella/pen/emNdVBP)

held: fixed canvas | on scroll: button.: background+color | on hover of button.: button.: background+color | made with: position: fixed · transition · :hover · canvas 2D · requestAnimationFrame

```css
#confetti-btn { position: relative; transition: color 0.3s ease, background 0.3s ease }
#confetti-canvas { position: fixed; top: 0 }
```

```js
addEventListener('mouseenter', (e) => {
requestAnimationFrame(animate)
```

### [An animated svg border ( on hover)](https://codepen.io/Nelenik/pen/gbpMxxa)

made with: @keyframes · :hover

```css
svg:hover { animation: move 10s linear infinite }
@keyframes move animates stroke-dashoffset
```

### [3d test](https://codepen.io/Pedro-Inacio/pen/JodXJqm)

made with: transition · :hover · 3D (perspective / preserve-3d)

### [Elevating Levels](https://codepen.io/mpdagang/pen/VYLaprY)

made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.plains { transition: 0.5s ease-in-out }
.cell { position: relative; transition: 0.2s }
.plains { transform: rotateX(60deg) rotateZ(45deg) }
.test { transition: 0.3s; transform: rotateY(-5deg) }
.plains:hover .cell .test { transform: rotateY(-90deg) }
.bottom { position: absolute; bottom: -35px; transition: 5s ease-out }
.cell:hover .bottom { transition: 0.1s; bottom: -10px }
```

### [3D Card Hover Example v3 - HTML/CSS/JS](https://codepen.io/John2606/pen/jEPWrXL)

on scroll: div.: transform+shadow, div.: opacity+top | made with: transition · :hover · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
html, body { perspective: 1000px }
#card { position: relative; transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease }
#info { position: absolute; bottom: 0.75rem; opacity: 0; transition: opacity 0.2s ease }
#card:hover #info { opacity: 1 }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseleave", () => {
```

### [3d Card Hover Example v2 - HTML/CSS](https://codepen.io/John2606/pen/LEVGPvm)

on scroll: div.card-holder: transform+filter+top | on hover of div.card-holder: div.card-holder: transform+filter+top | made with: transition · :hover · :has() · 3D (perspective / preserve-3d)

```css
.wrapper { perspective: 600px }
.card-holder { position: relative; transition: all 0.5s ease }
.card { position: absolute; top: 0; filter: drop-shadow(0px 0px 0px green) }
.card .top-image { object-position: center }
.card .card-name { text-transform: uppercase }
.card .card-info { position: absolute; bottom: 1rem }
.card-sensors { position: absolute; top: 0 }
.card-holder:has(> .card-sensors .card-sensor-tl:hover) { transform: rotateX(15deg) rotateY(-15deg); filter: drop-shadow(30px 30px 60px var(--shadow-color)) }
.card-holder:has(> .card-sensors .card-sensor-tr:hover) { transform: rotateX(15deg) rotateY(15deg); filter: drop-shadow(-30px 30px 60px var(--shadow-color)) }
.card-holder:has(> .card-sensors .card-sensor-bl:hover) { transform: rotateX(-15deg) rotateY(-15deg); filter: drop-shadow(30px -30px 60px var(--shadow-color)) }
.card-holder:has(> .card-sensors .card-sensor-br:hover) { transform: rotateX(-15deg) rotateY(15deg); filter: drop-shadow(-30px -30px 60px var(--shadow-color)) }
```

### [Glassmorphic Card with Glow Cursor & Reactive Border](https://codepen.io/Franbeltramella/pen/bNddaqj)

on scroll: div.card: transform, div.glow: opacity+top | on hover of div.card-container: div.card: transform | made with: transition · :hover · mask · backdrop-filter · 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking

```css
body { position: relative }
body::before, body::after { position: absolute; filter: blur(120px); opacity: 0.2 }
body::before { top: 10% }
body::after { bottom: 10% }
.card-container { perspective: 1000px }
.card::after { position: absolute; inset: 0; opacity: 0.05 }
.card { position: relative; backdrop-filter: blur(14px); box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4); transition: transform 0.1s ease }
.card::before { position: absolute; inset: 0; -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; transition: background 0.2s ease }
.glow { position: absolute; top: var(--y, 50%); transform: translate(-50%, -50%); opacity: 0; transition: top 0.1s, left 0.1s, opacity 0.3s ease }
.card:hover .glow { opacity: 1 }
```

```js
addEventListener('mousemove', (e) => {
style.setProperty('--x', `${x}px`)
style.setProperty('--y', `${y}px`)
style.setProperty('--angle', `${angle}deg`)
addEventListener('mouseleave', () => {
style.setProperty('--angle', `135deg`)
```

### [Interactive Line Text Distortion on Hover](https://codepen.io/blacklead-studio/pen/azOzePJ)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
body, html { position: relative }
.container { position: relative }
.footer_hover-effect canvas { position: absolute; top: 2px }
.footer_hover-effect canvas { top: 15vh }
```

```js
requestAnimationFrame(animateFooterLines)
addEventListener("mousemove", (e) => {
```

### [Button Hover Effect: Cursor-Based Glow Pulse](https://codepen.io/Franbeltramella/pen/RNPNMzg)

on scroll: button.button-creative: color | made with: transition · :hover · custom properties driven by JS · pointer / mouse tracking

```css
.button-creative { position: relative; transition: color 0.3s }
.button-creative::before { position: absolute; top: var(--y, 50%); transform: translate(-50%, -50%) scale(0); transition: transform 0.4s ease; opacity: 0.5 }
.button-creative:hover::before { transform: translate(-50%, -50%) scale(1.2) }
```

```js
addEventListener('mousemove', (e) => {
style.setProperty('--x', `${x}px`)
style.setProperty('--y', `${y}px`)
```

### [Expanding Sections CSS Only](https://codepen.io/daemonxx/pen/gbpOPyV)

on scroll: div.content: opacity+top ×2 | on hover of li.: div.content: opacity+top ×2 | made with: transition · :hover

```css
ul { position: absolute; top: 0 }
ul li { position: relative; transition: 0.5s }
ul li:nth-child(1) { background-position: center }
ul li:nth-child(2) { background-position: center }
ul li:nth-child(3) { background-position: center }
ul li:nth-child(4) { background-position: center }
ul li:nth-child(5) { background-position: center }
ul li .content { position: absolute; bottom: -100%; opacity: 0 }
ul li:hover .content { bottom: 0; transition: 0.4s ease-in-out; opacity: 1 }
h1 { text-transform: uppercase; padding-bottom: 25px }
a { transition: 0.5s }
a:hover { opacity: 0.75 }
```

### [Staganography splash screen with Transitions and Transforms](https://codepen.io/hirako2000/pen/jEPNxrE)

held: fixed div.background-particles, fixed div.background-particles | on scroll: div.particle: transform+top ×6, div.particle: transform ×5 | made with: position: fixed · @keyframes · transition · :hover

```css
body { position: relative }
canvas#background-grid { position: absolute; top: 0 }
.frame .corner { position: absolute }
.frame .tl { top: 0; border-bottom: none }
.frame .tr { top: 0; border-bottom: none }
.frame .bl { bottom: 0; border-top: none }
.frame .br { bottom: 0; border-top: none }
.decorations .circle, .decorations .diamond, .decorations .plus, .decorations .s { position: absolute; opacity: 0.1 }
.diamond { transform: rotate(45deg) }
.decorations:hover .diamond:hover. .circle:hover { opacity: 0.8 }
.plus::before, .plus::after { position: absolute }
.plus::before { top: -5px }
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

### [3D Card Hover Example - HTML/CSS](https://codepen.io/John2606/pen/XJJwoBo)

on scroll: div.card: transform | on hover of div.card: div.card: transform | made with: transition · :hover · :has() · 3D (perspective / preserve-3d)

```css
body { perspective: 500px }
.card { background-position: center; transition: all 0.5s ease }
.card:has(> .tl:hover) { transform: rotateX(15deg) rotateY(-15deg) }
.card:has(> .tm:hover) { transform: rotateX(15deg) }
.card:has(> .tr:hover) { transform: rotateX(15deg) rotateY(15deg) }
.card:has(> .bl:hover) { transform: rotateX(-15deg) rotateY(15deg) }
.card:has(> .bm:hover) { transform: rotateX(-15deg) }
.card:has(> .br:hover) { transform: rotateX(-15deg) rotateY(-15deg) }
```

### [Hover To Long Scroll](https://codepen.io/Pragatitendolkar/pen/ZYYZMEo)

on scroll: img.: transform+top, div.hover-text: opacity | made with: transition · :hover

```css
.image-box { position: relative; position: absolute; top: 50%; transform: translate(-50%, -50%) }
.image-box img { position: absolute; top: 0; transition: transform 1s ease-in-out }
.image-box:hover img { transform: translateY(calc(-100% + 400px)) }
.hover-text { position: absolute; bottom: 12px; transition: opacity 0.3s ease }
.image-box:hover .hover-text { opacity: 0 }
```

### [Clicked Button Animation](https://codepen.io/Amr-Elshabrawy-Dev/pen/JooVBGp)

made with: transition · :hover

```css
&:hover { box-shadow: 0px 7px 0px 0px hsl(from var(--secondary-color) H S L / 20%) }
&:active { box-shadow: none; transform: translateY(3px); transition: 35ms cubic-bezier(0.5, 0.7, 0.4, 1) }
& .btn-wrapper, & .btn-text, & .btn-icon { position: absolute }
& .btn-wrapper { top: 0 }
& .btn-text, & .btn-icon { transition: top 0.5s ease-in-out }
& .btn-text { top: 0 }
& .btn-icon { top: 100% }
&:hover .btn-text { top: -100% }
&:hover .btn-icon { top: 0 }
```

### [More hover effects using css.](https://codepen.io/Nick-13/pen/pvvGgvq)

on scroll: span.: color ×3, div.container: background+color | made with: @keyframes · transition · :hover · backdrop-filter

```css
.container { position: relative; animation: opacity 5s linear alternate infinite; transition: all 0.5s }
.container::before, .container::after { position: absolute; bottom: -4px; top: -4px; animation: hue-rotate 3s linear infinite }
.container::after { filter: blur(10px) brightness(200%) }
from { backdrop-filter: hue-rotate(0deg) }
to { backdrop-filter: hue-rotate(360deg) }
.creator { margin-top: 50px; filter: drop-shadow(0 0 15px rgba(255,255,255, 0.75)); transition: all 0.5s }
.creator:hover { filter: drop-shadow(0 0 25px rgba(255,255,255, 1)); transform: scale(1.05) }
@keyframes hue-rotate animates backdrop-filter
@keyframes opacity animates --color
```

### [amazing Hover effect using CSS](https://codepen.io/Nick-13/pen/vEEzdNO)

made with: @keyframes · transition · :hover · backdrop-filter

### [Good Hover effect~](https://codepen.io/Nick-13/pen/gbbdojb)

made with: transition · :hover

### [Neon Folder Hover Animation with Floating Files](https://codepen.io/ygnanil/pen/Qwwxpyv)

on scroll: div.file: transform+opacity+top ×3, div.folder: shadow+top | made with: transition · :hover

```css
.folder-container { position: relative }
.folder { box-shadow: 0 0 20px #4a9fff; transition: all 0.3s ease }
.folder:hover { box-shadow: 0 0 40px #4a9fff }
.folder-icon { margin-bottom: 20px }
.files { transition: all 0.3s ease }
.file { transform: translateX(-20px); opacity: 0; transition: all 0.3s ease }
.folder:hover .file { transform: translateX(0); opacity: 1 }
```

### [shopping card hover effect](https://codepen.io/alonegirl1378/pen/OPPZrWW)

on scroll: div.card-image: transform+top, img.: transform+top, h3.card-title: transform+top, div.card-content: opacity | made with: transition · :hover · backdrop-filter

```css
* { transition: 400ms }
.card { backdrop-filter: blur(2px); box-shadow: 0 20px 30px rgba(0, 0, 0, 0.5) }
.card-title { margin-top: 8px }
.card-content { position: absolute; bottom: 48px; opacity: 0 }
.card:hover .card-image { transform: translateY(-48px) }
.card:hover .card-title { transform: translateY(-60px) }
.card:hover .card-image img { transform: translate(-16px , -42px) rotate(-16deg) scale(1.4) }
.card:hover .card-content { opacity: 1 }
```

### [Cyberpunk Theme Interactive Buttons](https://codepen.io/Avoloch/pen/OPPZveN)

held: fixed div | on scroll: div.: transform, span.: transform | on hover of div.btn-border: div.pixel-grid: opacity+top, div.: transform, span.: transform+top | made with: @keyframes · transition · :hover · clip-path · custom properties driven by JS · requestAnimationFrame

```css
.btn-base { position: relative }
.btn-base.edgy { clip-path: polygon(0 0, 100% 0, 100% 80%, 60% 80%, 40% 100%, 0 100%) }
.btn-border.edgy { position: relative; clip-path: none }
.btn-border.edgy::after { position: absolute; bottom: 0.3em; clip-path: polygon(35% 0, 100% 0, 100% 100%, 0 100%, 0 90%) }
.edgy::before { position: absolute; clip-path: polygon(0 0, 0% 100%, 100% 0); top: 0; opacity: 0.2 }
.cutted { clip-path: polygon(0 0, 100% 0, 100% 80%, 60% 80%, 40% 100%, 0 100%) }
.cutted::before { position: absolute; top: 1em; transition: all 0.3s ease; animation: pulsar 2s infinite linear; opacity: 0 }
0% { top: 1em; transform: rotate(0deg) translateX(2em) rotate(0deg) }
15% { top: 1em; transform: rotate(45deg) translateX(2em) rotate(-45deg) }
30% { top: 1em; transform: rotate(90deg) translateX(2em) rotate(-90deg) }
45% { top: 1em; transform: rotate(135deg) translateX(2em) rotate(-135deg) }
70% { top: 1em; transform: rotate(180deg) translateX(2em) rotate(-180deg) }
```

```js
addEventListener("mouseenter", () => this.startPixelCreation())
addEventListener("mouseleave", () => this.stopEverything())
addEventListener("mouseenter", () =>
addEventListener("mouseleave", () =>
style.setProperty("--gradient-angle", `${this.gradientAngle}deg`)
requestAnimationFrame(() =>
style.setProperty("--gradient-angle", "0deg")
```

### [Table Hover transitions](https://codepen.io/kazmi066/pen/oggqwxJ)

made with: transition · :hover · :has()

```css
th { text-transform: uppercase; border-bottom: 1px solid var(--border) }
td { border-bottom: 1px solid var(--border) }
tr { transition: all .3s ease }
tr:last-child td { border-bottom: none }
.table-ocean tr:hover td { box-shadow: 0 0 12px #a855f7, 0 0 30px #f472b6; transition: all 0.2s ease-in-out }
.table-ember:focus-within tbody tr:not(:focus-within) { filter: blur(2px); opacity: 0.5 }
h2 { margin-bottom: 1rem }
```

### [Image Hover Effect](https://codepen.io/THOZ/pen/wBBybaN)

on scroll: div.card: opacity ×4, div.card: transform+top | on hover of div.card: div.card: transform+opacity+top ×2 | made with: transition · :hover

```css
.container:hover > :not(:hover) { opacity: 0.3 }
.card { transition: 0.2s ease }
.card:hover { transform: scale(1.05) }
```

### [Hovering Rainbow Keys](https://codepen.io/travisarnold/pen/oggEyaP)

made with: transition · :hover · :has()

```css
.box { position: relative }
.swatch { transition: height 0.1s cubic-bezier(0.4, 0, 0.2, 1); will-change: height }
```

### [Spiderman Card Trick](https://codepen.io/code_latte/pen/VYYQpEM)

on scroll: div.wrapper: transform+shadow+top, img.cover-image: opacity+top, img.character: transform+opacity+top | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.card { position: relative; perspective: 2500px }
.wrapper { position: absolute; transition: all 0.5s; box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 20px, rgba(0, 0, 0, 0.22) 0px 10px 10px }
.card:hover .wrapper { transform: perspective(900px) translateY(-5%) rotateX(25deg) translateZ(0); box-shadow: 2px 35px 32px -8px rgba(0, 0, 0, 0.75) }
.wrapper::before, .wrapper::after { opacity: 0; transition: all 0.5s; position: absolute }
.wrapper::before { top: 0 }
.wrapper::after { bottom: 0; opacity: 1 }
.card:hover .wrapper::before, .card:hover .wrapper::after { opacity: 1 }
.card:hover .cover-image { opacity: 0.3 }
.character { opacity: 0; transition: all 0.5s; filter: drop-shadow(2px 2px 2px black); position: absolute }
.card:hover .character { opacity: 1; transform: translate3d(10px, -20px, 200px) }
```

### [project-38](https://codepen.io/DominicNikolai/pen/wBBPVNL)

held: sticky main.container-general | on scroll: main.container-general: transform+top | made with: position: sticky · position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · transition · :hover · clip-path · 3D (perspective / preserve-3d)

```css
body { perspective: var(--persp); position: fixed }
.container-general { position: sticky; transform: scale(.8); top: 0; transition: 5s; perspective: var(--persp); animation: rotarX auto linear forwards; animation-timeline: scroll(y root) }
.container-front, .container-back { clip-path: polygon(7% 4%, 19% 4%, 27% 4%, 74% 4%, 74% 5%, 76% 5%, 78% 4%, 89% 4%, 93% 8%, 93% 64%, 93% 93%, 7% 94%); position: relative }
&::before { position: absolute; top: 14px; clip-path: polygon(0% 0%, 100% 0%, 75% 100%, 25% 100%) }
&::before { position: absolute; top: 40px }
.cuadradito { box-shadow: inset 0 0 8px 0 #0008; position: absolute; bottom: 38px }
.tab { box-shadow: inset 0 0 8px 0 #0008; position: absolute }
.gap { position: absolute; box-shadow: inset 0 0 8px 0 #0008; bottom: 15px }
.row { position: absolute; box-shadow: inherit; top: 0 }
&::before { position: absolute; top: 40px }
&::after { position: absolute; top: 40px }
.cuadradito { position: absolute; bottom: 38px }
```

### [Fullscreen Parent Hover Example - HTML/CSS](https://codepen.io/John2606/pen/xbbPzNe)

made with: @keyframes · transition · :hover · :has()

```css
body { background-position: center }
body:has(> .holder .row1:hover) { animation: zoom 3s forwards }
body:has(> .holder .row2:hover) { animation: zoom 3s forwards }
body:has(> .holder .row3:hover) { animation: zoom 3s forwards }
.row { transition: all 0.3s ease }
.row:not(:first-of-type) { margin-top: 1rem }
@keyframes zoom animates background-size
```

### [Treinando Botões](https://codepen.io/FernandoCarre/pen/jEEaENj)

on hover of button.: button.: background | made with: transition · :hover

```css
span { margin-bottom: 20px }
button { transition: 0.5s; margin-bottom: 20px }
a { transition: 0.5s; margin-bottom: 20px }
```

### [Glow Cards two sides](https://codepen.io/tofjadesign/pen/GggZrmO)

on scroll: div.front: shadow ×4, div.back: shadow ×4 | on hover of div.card: div.front: shadow ×4, div.back: shadow ×4, div.card: transform, div.card-inner: transform+top | made with: @keyframes · transition · :hover · backdrop-filter · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.container { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.card { perspective: 1000px }
.card-inner { position: relative; transition: transform 0.8s; animation-name: gradientGlow; animation-duration: 3s; animation-timing-function: ease-in-out; animation-iteration-count: infinite; animation-direction: alternate }
.card:hover .card-inner { transform: rotateY(180deg) }
.card .front, .card .back { position: absolute }
.card .front { background-position: center; animation-name: borderAnimate; animation-duration: 3s; animation-timing-function: ease-in-out; animation-iteration-count: infinite; animation-direction: alternate; box-shadow: inset 0 0 10px  }
.card .back { transform: rotateY(180deg); animation-name: borderAnimate; animation-duration: 3s; animation-timing-function: ease-in-out; animation-iteration-count: infinite; animation-direction: alternate; box-shadow: 0 0 10px #d12c03 }
0% { box-shadow: 0 0 10px #d12c03 }
25% { box-shadow: 0 0 10px #ecf009 }
50% { box-shadow: 0 0 10px #018a08 }
75% { box-shadow: 0 0 10px #0967e2 }
100% { box-shadow: 0 0 10px #d70ce9 }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseleave", () => {
```

### [Gradient Button](https://codepen.io/IrinaKaradimova/pen/pvvyJGO)

made with: transition · :hover

```css
.news-image-button { position: absolute; bottom: 50%; transition: background 0.3s ease }
```

### [DistortedPixels recreated using OGL](https://codepen.io/sijad/pen/jEEPjEj)

held: fixed div | on hover of button.tp-rotv_b: button.tp-rotv_b: background | made with: pointer / mouse tracking · requestAnimationFrame

```css
[data-app-container] { position: absolute; top: 0 }
canvas { position: absolute; top: 0 }
```

```js
addEventListener("mousemove", this.onMouseMove)
requestAnimationFrame(this.update)
```

### [Button Hover Effect](https://codepen.io/wahidullah_karimi/pen/MYYWzmo)

on hover of button.: button.: color, svg.[object: color, path.[object: color, span.: color | made with: transition · :hover

```css
button { position: relative; transition: color 0.3s 0.1s ease-out }
button::before { position: absolute; top: 0; bottom: 0; transition: box-shadow 0.5s ease-out }
button:hover::before { box-shadow: inset 0 0 0 10em rgb(255, 0, 0) }
```

### [Image hover effect](https://codepen.io/wahidullah_karimi/pen/MYYWYzM)

on hover of img.: div.content: opacity, h1.: transform+top, p.: transform+top | made with: transition · :hover

```css
.wrapper { margin-top: 50px }
.image { position: relative }
.content { position: absolute; top:0; opacity: 0; transition: all 0.3s }
.content:hover { opacity: 1 }
.content h1 { margin-bottom: 10px }
.content > * { transform: translateY(25px); transition: transform 0.6s }
.content:hover > * { transform: translateY(0px) }
```

### [Change Image with scroll animation GSAP](https://codepen.io/Dimasariza-the-flexboxer/pen/WbbNNMj)

held: fixed div.gsap-marker-scroller-end, fixed div.gsap-marker-scroller-start, fixed div.container | on scroll: div.container: transform+top, div.after: opacity+top, div.box: clip-path+top | made with: clip-path · backdrop-filter · GSAP · ScrollTrigger

```css
.welcome { position: relative }
.welcome .after { inset: 0; position: absolute; opacity: 0 }
.box { position: absolute; transform: translate(-50%, -50%); top: 50%; -webkit-clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%); clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%) }
.hover-image { position: absolute; inset: 0; -webkit-clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%); clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%) }
.container { position: relative }
.img-wrapper::after { position: absolute; inset: 0; -webkit-backdrop-filter: blur(15px); backdrop-filter: blur(15px) }
```

```js
gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
ScrollTrigger.create({
gsap.to(".after", {
addEventListener("mouseenter", () => {
gsap.fromTo(hoverImg, {
addEventListener("mouseleave", () => {
gsap.to(box, {
```

### [Steampunk Card Gallery with Animated Hover Glow #CodePenChallenge: Card Glow](https://codepen.io/Avoloch/pen/pvvzLEr)

held: fixed div | on scroll: svg.[object: transform+top ×30, div.compass-pointer: transform+top ×10 | on hover of div.card: svg.[object: transform ×18, svg.[object: transform+top ×10, div.compass-pointer: transform ×9, svg.[object: transform+filter+top ×2, div.container: transform+filter+top, div.card: shadow+top | made with: @keyframes · transition · :hover · 3D (perspective / preserve-3d)

```css
.container { position: relative; perspective: 1000px; filter: grayscale(100%); transition: all 0.5s ease }
.container:hover { filter: grayscale(0%); transform: translateZ(200px) translateY(-20px) }
.container:hover .card-front { box-shadow: 0 0 0 3px #b39055, 0 0 0 5px #442b0b, 0 0 25px rgba(233, 184, 95, 0.8); animation: steam-glow 3s ease-in-out infinite alternate, border-rotate 8s linear infinite }
0% { box-shadow: 0 0 0 3px #b39055, 0 0 0 5px #442b0b, 0 0 15px rgba(233, 184, 95, 0.5) }
50% { box-shadow: 0 0 0 3px #c19e5c, 0 0 0 5px #442b0b, 0 0 25px rgba(233, 184, 95, 0.8), 0 0 35px rgba(255, 215, 140, 0.4) }
100% { box-shadow: 0 0 0 3px #b39055, 0 0 0 5px #442b0b, 0 0 15px rgba(233, 184, 95, 0.5) }
.card { position: absolute }
.card-front { box-shadow: 0 0 0 3px #b39055, 0 0 0 5px #442b0b, 0 0 10px rgba(0, 0, 0, 0.6) }
.card-front::before { position: absolute; top: -150%; transform: rotate(30deg); opacity: 0; transition: opacity 0.5s ease }
.container:hover .card-front::before { animation: light-sweep 3s ease-in-out infinite; opacity: 1 }
0% { top: -150%; opacity: 0 }
10% { opacity: 0.8 }
```

### [AIR Icons — динамическая галерея PNG иконок с поддержкой mask-image](https://codepen.io/dan_zakirov/pen/gbOVEKg)

held: fixed div.air__fixed-tabs, fixed div.air__modal, fixed div.air__modal, fixed div.air__modal, fixed div.air__toast-container | made with: position: fixed · @keyframes · transition · :hover · mask · backdrop-filter

```css
body .air__container .air__quote, body .air__container .air__style-block, body . { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) }
body .air__container .air__quote h3, body .air__container .air__style-block h3,  { margin-top: 0 }
body .air__container .air__style-switcher, body .air__container .air__copy-optio { margin-top: 12px }
body .air__container .air__style-switcher label input[type=radio], body .air__co { position: relative }
body .air__container .air__style-switcher label input[type=radio]:checked::befor { position: absolute; top: 2px }
body .air__container .air__wrapper .air__button { transition: all 0.3s ease; animation: fadeInUp 0.4s ease forwards; opacity: 0; transform: translateY(10px) }
body .air__container .air__wrapper .air__button .air__icon { mask-size: cover; mask-repeat: no-repeat; -webkit-mask-size: cover; -webkit-mask-repeat: no-repeat; transition: background-color 0.3s ease }
body .air__container .air__wrapper .air__button.style-default:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1) }
body .air__container .air__search-block .air__search-input { transition: border-color 0.3s ease }
body .air__container .air__search-block .air__no-results { margin-top: 20px }
body .air__container .air__copy-size-options { margin-top: 12px }
body .air__container .air__copy-size-options .air__copy-size-option { transition: all 0.2s ease }
```

### [Untitled](https://codepen.io/Mammoth_art/pen/dPyxgXK)

made with: position: fixed · mix-blend-mode · GSAP · pointer / mouse tracking · requestAnimationFrame

```css
body { position: fixed }
canvas { position: absolute; top: 0 }
.mask { position: absolute; mix-blend-mode: screen }
svg { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

```js
addEventListener("mousemove", updateMouse, false)
requestAnimationFrame(update)
```

### [Creatory fluid](https://codepen.io/Mammoth_art/pen/LEYwgVQ)

made with: position: fixed · mix-blend-mode · GSAP · pointer / mouse tracking · requestAnimationFrame

```css
body { position: fixed }
canvas { position: absolute; top: 0 }
.mask { position: absolute; mix-blend-mode: screen }
svg { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

```js
addEventListener("mousemove", updateMouse, false)
requestAnimationFrame(update)
```

### [Simple GSAP Button Hover Effect](https://codepen.io/mustafauncuoglu/pen/GgRVmOV)

on scroll: span.button__spotlight: transform+top, span.button__text: color | on hover of a.button: span.button__spotlight: transform | made with: transition · :hover · GSAP · pointer / mouse tracking

```css
a.button { position: relative }
.button__wrapper { position: relative }
.button__text { position: relative; transition: 300ms ease }
.button__spotlight { position: absolute; opacity: 1; inset: 0; top: 50%; transform: scale(0) }
```

```js
addEventListener("mousemove", function (evt) {
gsap.to(".button__spotlight", {
addEventListener("mouseleave", function (evt) {
```

### [Dead Simple Click Event Demo](https://codepen.io/AdanRod133/pen/gbOVpdp)

made with: transition · :hover

```css
.student { margin-top: 5px; transition: background .233s }
```

### [Fluid mouse interactions | Hover interactions](https://codepen.io/Juba-Loudahi/pen/GgRVgJy)

held: fixed div.cursor, fixed div.cursor-follower, fixed canvas.blob-canvas | on hover of li.: div.cursor: transform+top, div.cursor-follower: transform+top, a.nav-link: color, span.highlight-text: color | made with: position: fixed · transition · :hover · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d) · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
.container { position: relative }
nav a { position: relative; transition: all 0.3s }
nav a::after { position: absolute; bottom: 0; transition: width 0.3s }
.hero { position: relative }
.hero h1 { margin-bottom: 1.5rem; position: relative }
.hero p { margin-bottom: 2rem; position: relative }
.btn { transition: transform 0.3s, box-shadow 0.3s; position: relative }
.btn:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(98, 70, 234, 0.3) }
.blob-container { position: fixed; top: 0 }
.blob { position: absolute; filter: blur(60px); opacity: 0.8 }
.liquid-items { margin-top: 5rem }
.liquid-item { backdrop-filter: blur(10px); transition: all 0.3s; position: relative }
```

```js
addEventListener('mousemove', (e) => {
requestAnimationFrame(animateCursors)
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
requestAnimationFrame(animateBlobs)
requestAnimationFrame(animateHighlight)
```

### [Hover Opening Envelope - Fly Away Animation](https://codepen.io/ahoidahl/pen/mydZXQJ)

made with: @keyframes · transition · :hover · clip-path

```css
.env_wrap { position:relative; padding-top:110% }
.env_top { filter: drop-shadow(0px 6px 3px rgba(50, 50, 0, 0.1)); position:absolute; top:45%; transition:all .2s ease-in-out; transform-origin:top }
.env_top:before { position:absolute; transform-origin:top; clip-path: polygon(50% 100%, 0 0, 100% 0); transition:all .2s ease-in-out }
#envelope_form:hover .env_top { -ms-transform: rotatex(-180deg); -webkit-transform: rotatex(-180deg); transform: rotatex(-180deg) }
.env_bottom_wrap { bottom:0; position:absolute; filter: drop-shadow(0px -6px 3px rgba(50, 50, 0, 0.1)) }
.env_bottom { clip-path: polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0) }
.env_bottom:before, .env_bottom:after { position:absolute }
.env_bottom:before { clip-path: polygon(100% 50%, 0 0, 0 100%) }
.env_bottom:after { clip-path: polygon(0 50%, 100% 0, 100% 100%) }
.env_form_wrap { position:absolute; transition:all .4s ease-in-out; top:100% }
#envelope_form:hover .env_form_wrap { top:0 }
.submit { position:relative; margin-top:10px }
```

### [HoverBar](https://codepen.io/faelpatrick/pen/ByaebLm)

made with: transition · :hover

```css
.mainbox { position: relative }
.line { transition: width .5s }
```

### [Bubble Wave animation effect](https://codepen.io/immanuel1004/pen/wBvbvPE)

on scroll: div.bubble: transform+top ×300 | made with: @keyframes · transition · :hover

```css
.bubble { position: relative; transition: 0.5s; box-shadow: 0 0 20px #eeeeeed9; animation: wave 3s infinite }
.bubble:hover { transform: scale(1.1); background-position: right center }
.bubble:active, .bubble.popped { opacity: 0.6; transform: scale(0.9); box-shadow: inset -2px -2px 5px rgba(112, 112, 112, 0.2), inset 2px 2px 5px rgb(207 207 207 / 50%); filter: blur(3px) }
.bubble.bottom { bottom: 10px }
0%, 100% { transform: translateY(0) }
50% { transform: translateY(-6px) }
@keyframes wave animates transform
```

### [Animated hand-drawn hover effect](https://codepen.io/lewster32/pen/EaxJBeg)

made with: transition · :hover · mask

```css
.draw { --offset: 60deg; transition: --reveal ease-in-out 0.3s; position: relative }
.draw::before { mask-image: conic-gradient(from var(--offset, 0deg), #fff0 calc(var(--reveal) - var(--fade)), #ffff calc(var(--reveal) + var(--fade))); position: absolute; inset: 0 }
```

### [Creative Pointer Box hover effect](https://codepen.io/immanuel1004/pen/wBvZrQp)

on scroll: div.container: transform+top, div.circle: transform+top | made with: transition · :hover · pointer / mouse tracking

```css
.container { position: relative; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); transition: transform 0.5s }
.container:hover { transform: scale(1.05) }
.circle { position: absolute; transition: transform 0.1s }
.text { position: absolute; bottom: 20px }
```

```js
addEventListener("mousemove", function (e) {
```

### [Hover Effect Using Flex Property](https://codepen.io/amjadham001/pen/jEORqXv)

on hover of a.article__author-link: img.figure__image: filter | made with: transition · :hover

```css
.figure__caption { margin-bottom: 10px }
.figure__image-container { position: relative }
.figure__image { filter: blur(5px); transition: filter 0.3s ease }
.image-wrapper { transition: flex-grow 0.5s ease, filter 0.3s ease }
.image-wrapper:hover .figure__image { filter: blur(0) }
.article { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5) }
.article__header { margin-bottom: 20px }
.article__divider { border-top: 2px solid var(--accent-color) }
```

### [gsap hover effect](https://codepen.io/nischal-lc/pen/xbxBzrK)

on scroll: div.cursor: transform+top | made with: mix-blend-mode · GSAP · pointer / mouse tracking

```css
.cursor { position: absolute; mix-blend-mode: difference; transform: translate(-50%, -50%) }
```

```js
addEventListener("mousemove", (e) => {
gsap.to(cursor, {
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
```

### [CSS Link Hover Animation](https://codepen.io/mustafauncuoglu/pen/pvoYwdJ)

on scroll: svg.[object: transform ×2, div.link-container: transform+top, span.link-title1: transform+top, span.link-title2: transform+top | made with: transition · :hover

```css
.mask { position: relative }
.link-container { transition: transform 0.4s ease }
.title { transition: transform 0.4s ease }
.link-title2 { transform: rotate(20deg) }
.link-icon { position: relative }
.icon { position: absolute; transition: transform 0.4s ease }
.icon:nth-child(2) { transform: translate(-40px) }
.link:hover .link-container { transform: translateY(-20px) }
.link:hover .link-title1 { transform: rotate(20deg) }
.link:hover .link-title2 { transform: rotate(0) }
.link:hover .icon:first-child { transform: translate(40px) }
.link:hover .icon:nth-child(2) { transform: translate(0px) }
```

### [Simple Gsap Hover Animation](https://codepen.io/AdanRod133/pen/pvoGYag)

made with: GSAP

```js
gsap.timeline({paused:true})
addEventListener("mouseleave", function(event){
```

### [Simple Card UI frame hover Effect](https://codepen.io/immanuel1004/pen/NPWopbd)

on hover of a.: img.: transform+top | made with: transition · :hover

```css
.container { position: relative }
.news-left-item { border-bottom: 1px solid #ffffff40 }
.news-left-item:hover .news-item-thum img, .news-right-item:hover a img { transform: scale(1.1) }
.news-right-item a:first-child img { transition: 0.35s }
.news-right-item a:last-child { transition: 0.35s }
.news-item-thum img { transition: 0.35s }
.news-item-desc a { transition: 0.35s }
```

### [Neumorphism Buttons](https://codepen.io/Kateryna-Ruchka/pen/zxYyYzR)

on hover of button.btn-1: button.btn-1: color | made with: transition · :hover

```css
button { transition: all 0.5s }
.btn-1 { box-shadow: 4px 4px 10px #000, -4px -4px 10px #353535, inset -2px -2px 4px #353535, inset 2px 2px 4px #000 }
.btn-2 { box-shadow: 4px 4px 10px #000, -4px -4px 10px #353535 }
.btn-2:hover { box-shadow: 4px 4px 10px #000, -4px -4px 10px #353535, inset -2px -2px 4px #353535, inset 2px 2px 4px #000 }
```

### [Neon Button](https://codepen.io/Kateryna-Ruchka/pen/ogNQKMx)

made with: @keyframes · transition · :hover

```css
button { position: relative }
button::after, button::before { position: absolute; top: -5%; transition: --rotate 9999s linear }
button:hover::after, button:hover::before { --rotate: 3600deg; transition: --rotate 20s linear }
button:hover::before { animation: fade 1.2s }
0% { opacity: 1; transform: scale(1); filter: blur(10px) }
100% { opacity: 0; transform: scale(1.4); filter: blur(10px) }
@keyframes fade animates opacity, transform, filter
```

### [Space Product card hover UI](https://codepen.io/immanuel1004/pen/bNGQJrY)

on scroll: img.: transform+filter+top | on hover of a.: img.: transform+filter+top ×2, div.best-item: transform+top | made with: transition · :hover

```css
.container { position: relative }
.best-item { transition: 0.35s; box-shadow: 0 0 15px rgba(149, 89, 86, 0.3) }
.best-item.active, .best-item:hover { transform: translateY(-20px) }
.best-item:hover .best-thum a img { transform: scale(1.1); filter: none }
.best-thum img { transition: 0.35s; filter: grayscale() }
.ranking span { margin-top: 2px }
```

### [Simple Product card UI Plant shop](https://codepen.io/immanuel1004/pen/EaxOOMO)

on scroll: div.number: background+color | on hover of a.: div.number: background+color ×2 | made with: transition · :hover

```css
section { margin-top: 100px }
.item { box-shadow: 0 25px 40px rgba(116, 141, 113, 0.729) }
.photo { position: relative }
.photo img { position: absolute; top: 0; transition: 0.35s }
.number { position: absolute; top: 0; transition: 0.35s }
.wish { position: absolute; bottom: 20px }
.item a:before { position: absolute; bottom: 0 }
```

### [Seleccionar elementos anteriores al hover](https://codepen.io/DHardySD/pen/ZYEmqMO)

made with: transition · :hover · :has()

```css
.item:has(+ .item:hover) { translate: 0 10px }
.item:has(+ .item + .item:hover) { translate: 0 20px }
.item:has(+ .item + .item + .item:hover) { translate: 0 30px }
.item:has(+ .item + .item + .item + .item:hover) { translate: 0 40px }
& .item { transition: translate 200ms linear }
```

### [simple shopping mall card UI](https://codepen.io/immanuel1004/pen/vEYQzrg)

made with: transition · :hover

```css
.item_box { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.item { position: relative; box-shadow: 0 0 10px #cecece }
.item:nth-child(2).active summery, .item:hover summery { bottom: 0 }
summery { position: absolute; bottom: -135px; transition: 0.5s }
.title { border-bottom: 1px solid #d4d4d4 }
.like { position: absolute; top: 66% }
.like:before { transition: 0.35s }
.color-detail em { transition: 0.35s }
summery > a { margin-top: 8px; transition: 0.35s }
summery > a:hover { box-shadow: 0 5px 10px rgba(94, 94, 94, 0.43) }
```

### [GSAP Hearts Hover Effect](https://codepen.io/tristankappel/pen/OPJBxrL)

on scroll: button.button: transform+shadow+top | made with: transition · :hover · GSAP

```css
.button-container { position: relative }
.button { box-shadow: 0 4px 30px rgba(47, 17, 24, 0.3); text-transform: uppercase; position: relative; opacity: 1; transition: all 0.3s; transform: scale(1) }
.button:hover { transform: scale(0.95); box-shadow: 0 1px 2px rgba(47, 17, 24, 0.1) }
.heart { opacity: 0; position: absolute; transform: rotate(-45deg) translateX(-50%) translateY(-50%); top: 50% }
.heart::before, .heart::after { position: absolute }
.heart::before { top: -10px }
.heart::after { top: 0 }
```

```js
addEventListener("mouseenter", animateHearts, false)
gsap.to(hearts, {
```

### [CTA Button Animation](https://codepen.io/LucipherDev/pen/dPyqeGN)

on scroll: div.arrow: opacity ×5 | on hover of button.: div.arrow: opacity ×5 | made with: @keyframes · transition · :hover

```css
button { position: relative }
button .cta { top: 0; position: absolute; transition: right 0.3s ease-in-out }
button .cta .arrows .arrow { animation: PointAnimation 1s infinite }
button .cta .arrows .arrow:nth-of-type(1) { animation-delay: 0s }
button .cta .arrows .arrow:nth-of-type(2) { animation-delay: 0.2s }
button .cta .arrows .arrow:nth-of-type(3) { animation-delay: 0.4s }
button .cta .arrows .arrow:nth-of-type(4) { animation-delay: 0.6s }
button .cta .arrows .arrow:nth-of-type(5) { animation-delay: 0.8s }
0% { opacity: 1 }
50% { opacity: 0.25 }
100% { opacity: 1 }
@keyframes PointAnimation animates opacity
```

### [Glitchy button hover effect with VFX-JS](https://codepen.io/jdillon/pen/azbaYqr)

on scroll: button.: opacity+top, canvas.: transform | made with: nothing recognised — read the code

```css
button { text-transform: uppercase; transform: skewX(-15deg) }
```

```js
addEventListener("mouseenter", (e) => {
addEventListener("mouseleave", (e) => {
```

### [3D Carousel WebComponent](https://codepen.io/quan-pham-the-selector/pen/EaxeNMe)

on scroll: img.: opacity+top ×4 | on hover of img.: img.: opacity+top ×4 | made with: position: fixed · transition · mask · 3D (perspective / preserve-3d) · pointer / mouse tracking · requestAnimationFrame

```js
addEventListener("mousemove", (event) => {
requestAnimationFrame(() => this.rotateCarousel())
```

### [Tilt Hover WebComponent](https://codepen.io/quan-pham-the-selector/pen/jEOvVpy)

made with: 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking

```js
style.setProperty("--before-border-radius", borderRadius)
addEventListener("mousemove", (event) => {
style.setProperty("--shadow-translate", `
style.setProperty("--shadow-gradient", `
```

### [Button Hover Effect](https://codepen.io/giandev10/pen/emYLBvR)

on scroll: svg.[object: transform | on hover of button.btn: svg.[object: transform | made with: @keyframes · transition · :hover

```css
.btn { position: relative; box-shadow: inset 0 0 1.6em -0.6em rgba(0, 0, 0, 0.3); transition: background 0.3s ease-in-out }
.btn .arrow-icon { box-shadow: inset 0 0 1.6em -0.6em rgba(0, 0, 0, 0.2); position: absolute; transition: width 0.3s ease-out, transform 0.3s ease-out }
.btn .arrow-icon svg { transition: width 0.3s ease-out }
.btn:hover .arrow-icon svg { animation: move-arrow 0.5s ease-in-out infinite alternate }
.btn:active .arrow-icon { transform: scale(0.9) }
from { transform: translateX(-6px) }
to { transform: translateX(6px) }
@keyframes move-arrow animates transform
```

### [CSS_Focus Effect with :has(:hover)](https://codepen.io/shiuh-li/pen/XJWBxBY)

made with: transition · :hover · :has()

```css
.card-item { position:relative; filter:drop-shadow(0px 0px 0px var(--drop-shadow-focus)) brightness(1); transition:filter 1s, transform 0.5s,margin-inline 0.5s }
.card-item-con { opacity:0; transition:all 0.5s; position:relative }
.card-item-con > div { padding-bottom:0; transition:padding-bottom 0.5s }
.card-list h2 { margin-top:var(--margin-hidden); margin-bottom:0.9rem; opacity:1; transition:color 0.5s,opacity 0.5s, transform 0.8s; position:relative }
.card-list p { margin-bottom:0.9rem; transform:translateY(25%); opacity:0; transition:opacity 0.5s, transform 0.5s }
.card-list button { transform:translateY(25%); opacity:0; transition:opacity 0.5s, transform 0.5s }
.card-list p { margin-bottom:min(1.8vw, 0.9rem) }
.card-list p { margin-bottom:min(3.25vw, 0.8rem) }
.card-item .bg { filter:brightness(1) contrast(105%); transition:filter 1s, background-size 1s; position:absolute; inset:0 }
.card-item:nth-of-type(1) .bg { background-position: 38% 98% }
.card-item:nth-of-type(2) .bg { background-position: 46% 95% }
.card-item:nth-of-type(3) .bg { background-position: 44% 76% }
```

### [smooth hover menu](https://codepen.io/alonegirl1378/pen/ogNMEXP)

made with: transition · backdrop-filter

```css
.menu { position: relative; box-shadow: 5px 5px 5px 5px rgba(0,0, 0, 0.25) }
.menu ul li { position: relative }
.menu .icon { position: relative; transition: 0.5s }
.menu li.active .icon { transform: translateY(-35px) }
.menu .text { position: absolute; opacity: 0; transition: 0.5s; transform: translateY(20px) }
.menu li.active .text { opacity: 1; transform: translateY(10px) }
.indicator { position: absolute; top: -50%; backdrop-filter: blur(15px); transition: 0.5s }
.indicator::before { position: absolute; top: 50%; box-shadow: 1px -10px 0 0 #041897 }
.indicator::after { position: absolute; top: 50%; box-shadow: -1px -10px 0 0 #041897 }
.menu li:first-child.active ~ .indicator { transform: translateX(calc(70px * 0)) }
.menu li:nth-child(2).active ~ .indicator { transform: translateX(70px) }
.menu li:nth-child(3).active ~ .indicator { transform: translateX(calc(70px * 2)) }
```

### [Modern Article Hover Effect](https://codepen.io/emilandersson/pen/KwKeBKe)

on scroll: div.front-blog-item-thumbnail: opacity ×2, div.front-blog-item-thumbnail: background, div.front-blog-item-content: background+top, div.article__excerpt: opacity+top, span.footer__readmore-text: transform+top | on hover of a.btn-Fx: div.front-blog-item-thumbnail: opacity ×2, a.btn-Fx: color, span.: color, i.bi: color, div.front-blog-item-thumbnail: background, div.front-blog-item-content: background+top | made with: transition · :hover · backdrop-filter

```css
body { position: relative }
a { transition: all 0.3s ease }
h1, h2, h3, h4, h5, h6 { margin-top: 0; margin-bottom: 0.5rem }
.btn-Fx { position: relative; box-shadow: var(--shadow-button) }
.btn-Fx span { position: relative }
.btn-Fx:before { position: absolute; padding-bottom: 120%; top: -110%; transform: translate3d(0, 68%, 0) scale3d(0, 0, 0) }
.btn-Fx:hover:before { transform: translateZ(0) scaleZ(1); transition: transform 0.4s cubic-bezier(0.1, 0, 0.3, 1) }
.btn-Fx:after { position: absolute; top: 0; transform: translate3d(0, -101%, 0); transition: transform 0.4s }
.btn-Fx:hover:after { transform: translateZ(0) }
.content-container { position: relative }
.front-blog-top { margin-bottom: 2rem }
.front-blog-top .btn-Fx { text-transform: uppercase }
```

```js
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
```

### [More CSS masking, makeup reveal on hover](https://codepen.io/Bembit/pen/ogNyZyM)

made with: :hover · mask · custom properties driven by JS · pointer / mouse tracking

```css
.container { position: relative }
.radial-cover { position: absolute; top: 0 }
.background { position: absolute; top: 0 }
.top-image { position: absolute; top: 0; mask-image: radial-gradient( circle 150px at var(--mouse-x) var(--mouse-y), white 40%, transparent 100% ); -webkit-mask-image: radial-gradient( circle 150px at var(--mouse-x) var(--mouse-y), w }
```

```js
addEventListener("mousemove", (e) => {
style.setProperty("--mouse-x", `${x}px`)
style.setProperty("--mouse-y", `${y}px`)
addEventListener("mouseleave", () => {
style.setProperty("--mouse-x", "-9999px")
style.setProperty("--mouse-y", "-9999px")
```

### [Colorama](https://codepen.io/divulture/pen/yyLjmWX)

made with: transition

```css
.letter { transition: color 0.3s ease }
```

```js
addEventListener('mouseenter', () => {
```

### [button hover effects](https://codepen.io/alonegirl1378/pen/XJWqLjr)

made with: @keyframes · transition · :hover

```css
button { position: relative; transition:all .4s ease-in }
button::after , button::before { position: absolute }
.btn-1::after { top: 0 }
.btn-2::after { top: 0 }
.btn-3::after { bottom: 0 }
.btn-4:hover { box-shadow: 10px 10px 0px #ff96ad; top: -5px }
.btn-5:hover { box-shadow: 0 0 5px #ff96ad , 0 0 25px #ff96ad , 0 0 50px #ff96ad , 0 0 200px #ff96ad }
.btn-7:hover { box-shadow: inset -5.5rem 0 0 0 #ff96ad , inset 5.5rem 0 0 0 #ff96ad }
.btn-8 { position: absolute; animation: active 1s ease-out; animation-fill-mode: backwards }
0% { opacity: 0; transform: translateY(30px) }
100% { opacity: 1; transform: translateY(0px) }
.btn-8:hover { transform: translateY(-3px); box-shadow: 0 10px 20px #ff96ad }
```

### [Navigation_Bar_V2](https://codepen.io/nikhil-keolan-gounden/pen/dPyeMQX)

on scroll: nav.navbar: shadow, a.profile: transform+background+shadow+top, div.label: transform+opacity+top | on hover of a.browse: div.label: transform+opacity+top ×2, a.browse: transform+background+shadow+top, a.profile: transform+background+shadow+top | made with: transition · :hover · GSAP

```css
.navbar { box-shadow: 0px 20px 60px rgba(0, 0, 0, 0.3); transition: all 0.4s ease }
.navbar:hover { box-shadow: 0px 30px 80px rgba(0, 0, 0, 0.5) }
a { position: relative; transition: all 0.3s ease; box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2) }
a:hover { transform: translateY(-5px); box-shadow: 0px 15px 40px rgba(0, 0, 0, 0.4) }
.icon { margin-bottom: 8px }
.label { opacity: 0; transform: translateY(10px); transition: opacity 0.3s ease, transform 0.3s ease }
a:hover .label { opacity: 1; transform: translateY(0) }
```

```js
gsap.to(nodes[0], {
gsap.to(nodes[1], {
```

### [Glowing Buttons on Hover Effect](https://codepen.io/vedzzb/pen/GgRQoEo)

made with: transition · :hover · backdrop-filter

```css
&::before { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: 0.8s }
&::before { transform: skewX(45deg) translateX(-200%) }
&::before { position: absolute; top: 0; transition: 0.8s; transform: skewX(45deg) translateX(-150%) }
.group:nth-child(2) .button::before { transform: translate(-50%,-50%) rotate(45deg) }
.group .button:nth-child(1)::before { box-shadow: 0 0 5px #ff1f72, 0 0 15px #ff1f72, 0 0 30px #ff1f72, 0 0 60px #ff1f72 }
.group .button:nth-child(2)::before { box-shadow: 0 0 5px #AB40FF, 0 0 15px #AB40FF, 0 0 30px #AB40FF, 0 0 60px #AB40FF }
.group .button:nth-child(3)::before { box-shadow: 0 0 5px #ffbc00, 0 0 15px #ffbc00, 0 0 30px #ffbc00, 0 0 60px #ffbc00 }
.group:nth-child(2) .button:hover::before { transform: translate(-50%,-50%) rotate(0deg) }
```

### [Hover on Grid](https://codepen.io/ryomario/pen/LEYQVpG)

made with: transition · :hover · backdrop-filter · custom properties driven by JS · pointer / mouse tracking

```css
.grid { position: relative }
.grid::before { position: absolute; top: calc(var(--center-y) - 200px); opacity: 0; transition: opacity 300ms, top 100ms, left 100ms }
.grid:hover::before { opacity: 1 }
.grid-item { --bg-opacity: 1; backdrop-filter: blur(50px); margin-top: calc(-1 * var(--gap)); transition: border-color 500ms, background-color 300ms }
.grid-item:hover { --bg-opacity: 0.8 }
```

```js
addEventListener('mousemove',function(e) {
style.setProperty('--center-x', x + 'px')
style.setProperty('--center-y', y + 'px')
```

### [utility to animate between 2 emoji icons wip](https://codepen.io/nonsalant/pen/yyLpwVJ)

made with: :has() · prefers-reduced-motion

```js
addEventListener("mouseenter", this.startAnimation)
addEventListener("mouseleave", this.stopAnimation)
```

### [Interactive grid bubbles with gradient on hover](https://codepen.io/maramaramara/pen/RNwxgKv)

on scroll: div.grid-item: transform+background+shadow+top | made with: transition · :hover

```css
.grid-item { transition: all 0.2s ease-in-out; box-shadow: inset 0 0 1rem rgba(0,0,0,0.05) }
.grid-item:hover { transform: scale(1.025); box-shadow: inset 0 0 1rem rgba(0,0,0,0.05), inset -3rem 1px 3rem rgba(255,255,255,0.05), inset 2rem -1px 3rem rgba(255,255,255,0.03) }
```

### [Hover Glow Animation](https://codepen.io/yasmo-yasmoo/pen/EaxbXBr)

made with: @keyframes · custom properties driven by JS · pointer / mouse tracking

```css
body { position: relative }
h1 { position: absolute; animation: glow 1.5s ease-in-out infinite alternate }
.star { position: absolute; box-shadow: 0 0 6px rgba(255, 255, 255, 0.9), 0 0 12px rgba(128, 0, 255, 0.6), 0 0 20px rgba(255, 0, 255, 0.4); animation: spread 4s ease-out forwards }
0% { transform: scale(1) translate(0, 0); opacity: 1 }
100% { transform: scale(5) translate(var(--x), var(--y)); opacity: 0 }
@keyframes glow animates text-shadow
@keyframes spread animates transform, opacity
```

```js
addEventListener("mousemove", function(e) {
style.setProperty('--x', `${Math.cos(angle) * distance}px`)
style.setProperty('--y', `${Math.sin(angle) * distance}px`)
```

### [Minimal Cards](https://codepen.io/abmuhammadhamza/pen/GgRMzOP)

made with: transition · :hover · backdrop-filter

```css
.card { background-position: center; transition: all 0.3s ease; position: relative }
.card h4 { backdrop-filter: blur(5px); transition: all 0.3s ease; margin-bottom: 0; position: absolute }
.card:hover h4 { margin-bottom: 10px }
```

### [Stacked Cards Animation](https://codepen.io/yossyadirta/pen/vEYeQrE)

on scroll: div.card: transform+top ×3 | made with: transition · :hover · backdrop-filter · mix-blend-mode

```css
body { transition: 0.5s }
.container { position: relative }
.card { position: absolute; top: 0; transform: translateX(-50%) translateY(calc(50px * var(--card))) rotate(45deg) skew(-15deg, -10deg) scale(0.8); box-shadow: 25px 20px 100px rgba(0, 0, 0, 0.2); transition: 0.5s }
.card:nth-child(3) { box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px) }
.container:hover .card { position: absolute; transform: translateX(calc(-50% + calc(115% * var(--card)))) }
.card__content { position: relative }
.card__icon--mastercard { position: relative }
.card__icon--mastercard::before, .card__icon--mastercard::after { position: absolute }
.card__icon--mastercard::before { opacity: 0.9; top: 0 }
.card__icon--mastercard::after { opacity: 0.75; mix-blend-mode: hard-light; top: 0 }
.card:nth-child(2)::before { position: absolute; top: 50%; opacity: 0.1 }
.card:nth-child(2)::after { position: absolute; top: 30%; transform: translate(-50%, -50%); opacity: 0.1 }
```

### [CSS HOVER ANIMATION (pure css)](https://codepen.io/immanuel1004/pen/xbxXaJV)

on scroll: span.: transform+opacity+background+top ×3, a.: background | on hover of a.: span.: transform+top ×3, a.: shadow | made with: @keyframes · transition · :hover

```css
.frame { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.frame span { position: absolute; transition: 0.5s }
.frame:hover span:nth-child(1) { opacity: 0.4 }
.frame:hover span:nth-child(2) { opacity: 0.2 }
.frame:hover span:nth-child(3) { opacity: 0.6 }
.frame span:nth-child(1) { animation: ani 6s linear infinite }
.frame span:nth-child(2) { animation: ani 4s linear infinite reverse }
.frame span:nth-child(3) { animation: ani 10s linear infinite }
0% { transform: rotate(0) }
100% { transform: rotate(360deg) }
.content { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.content p { padding-bottom: 15px }
```

### [SPLIT CARD HOVER (pure css)](https://codepen.io/immanuel1004/pen/ZYEXMXN)

on scroll: div.items-inner: transform+top, h1.: opacity, div.up: background+top | on hover of img.: div.up: background+top ×2 | made with: transition · :hover

```css
.items-inner { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.items-inner h1 { transition: 0.3s }
.item { position: relative }
.item div { position: absolute; transition: 0.5s }
.up { top: 0; padding-top: 5px; box-shadow: 0 0 10px #ddd }
.up h3 { margin-top: -5px }
.item:hover .up { top: -50% }
.down { bottom: -0 }
.item:hover .down { bottom: -50% }
.down p { margin-top: 10px }
.down a { transition: 0.3s }
.down a:hover { box-shadow: 0 0 5px #b490ca }
```

### [3D Card Deck hover animation (pure css)](https://codepen.io/immanuel1004/pen/jEOGprB)

on scroll: img.: transform+opacity+top ×3, div.app-ui: background+shadow, img.: transform+top | made with: transition · :hover

```css
.app-ui-inner { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.app-ui { position: relative; transform: rotate(-30deg) skew(30deg); box-shadow: -5px 5px 10pxrgb (213, 213, 213) e; transition: 1s }
.app-ui:hover { box-shadow: -50px 100px 60px #eeee }
.app-ui img { position: absolute; transition: 0.5s }
.app-ui:hover img:nth-child(1) { transform: translate(40px, -40px); opacity: 0.2 }
.app-ui:hover img:nth-child(2) { transform: translate(80px, -80px); opacity: 0.4 }
.app-ui:hover img:nth-child(3) { transform: translate(120px, -120px); opacity: 0.6 }
.app-ui:hover img:nth-child(4) { transform: translate(160px, -160px) }
```

### [halftone show image](https://codepen.io/joaocoimbra/pen/dPyVZKb)

on hover of button.tp-rotv_b: div.: transform+top ×384 | made with: GSAP

```css
.box { background-position: center }
.block { position: relative }
.block div { transform: scale(1.25) }
```

```js
gsap.timeline({
addEventListener("mouseenter", () => tl.play())
addEventListener("mouseleave", () => tl.reverse())
```

### [Card Transition Shift layout](https://codepen.io/Shababul-Alam/pen/yyLzbWb)

on scroll: div.card-d3: shadow+top, div.card-description: opacity+top | made with: transition · :hover

```css
.card-container { position: relative }
.card { position: absolute; transition: all 0.5s ease; background-position: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) }
.card:hover { top: 0 !important; bottom: auto !important; box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2) }
.card-d3 { position: absolute; transition: all 0.5s ease; background-position: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) }
.card-d3:hover { top: auto !important; bottom: 0 !important; box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2) }
.card-content { position: absolute; bottom: 0; transition: all 0.3s ease }
.card:hover .card-content, .card-d3:hover .card-content { padding-bottom: 2.5rem }
.card-title { margin-bottom: 0.5rem }
.card-description { opacity: 0; transition: all 0.3s ease }
.card:hover .card-description, .card-d3:hover .card-description { opacity: 1 }
```

### [Animated Steampunk Card: Interactive Victorian Machinery](https://codepen.io/Avoloch/pen/dPyzmBX)

held: fixed div | on scroll: div.steam: transform+opacity+top ×2, div.gear: transform+top ×2, div.card: transform+top | on hover of div.card: div.steam: transform+opacity+top ×2, div.gear: transform+top ×2, div.card: transform, div.: transform, span.: transform+top | made with: @keyframes · transition · :hover · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
body { perspective: 1000px }
.card { box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5); position: relative; transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) }
.card:hover { transform: rotateY(5deg) rotateX(5deg) }
.card-border { position: absolute; top: 0; bottom: 0 }
.card-border::before { position: absolute; top: 0; bottom: 0 }
.card-content { position: relative }
.gear { position: absolute; opacity: 0.25; animation: rotate 4s linear infinite }
.gear::before { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.gear::after { position: absolute; top: 0; opacity: 0.8 }
.gear-1 { top: -20px; animation-duration: 120s }
.gear-2 { bottom: -30px; animation-direction: reverse }
from { transform: rotate(0deg) }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseleave", () => {
```

### [Hover me!](https://codepen.io/unseen-ninja/pen/PwoKJjM)

on scroll: span.default-text: transform+opacity, span.default-circle: transform+top, span.hover-text: transform+opacity, svg.[object: transform+top | made with: transition · :hover

```css
button { position: relative; box-shadow: 0 6px 12px color-mix(in srgb, var(--blackberry), transparent 90%) }
button .default-text, button .default-circle, button .hover-text { transition: all 300ms ease-in-out }
button .hover-circle { transition: all 300ms cubic-bezier(0.67, 0.66, 0.75, 1.47) }
button .default-circle, button .hover-circle { transform: translateY(1px); opacity: 1 }
button .hover-text { position: absolute; top: 12px; transform: translateX(24px); opacity: 0 }
button .hover-circle { position: absolute; top: 18px; transform: scale(0) }
button:hover .default-text { transform: translateX(-24px); opacity: 0 }
button:hover .default-circle { transform: translateY(1px) scale(2400%) }
button:hover .hover-text { transform: translateX(0); opacity: 1 }
button:hover .hover-circle { transform: scale(2.5) }
```

### [CTA button - slide left](https://codepen.io/vincentscotto/pen/qEBjMXj)

made with: transition · :hover

```css
.button-container button { box-shadow: 0 0 1.25rem rgba(0, 0, 0, 0.2); position: relative; margin-bottom: 1rem }
.button-container button:after { position: absolute; top: 0; transition: all 0.3s ease }
.button-container button span { position: relative }
```

### [Outlined Mobile Cards v1](https://codepen.io/mandynicole/pen/JojJOZY)

made with: @keyframes · :hover · :has() · mix-blend-mode · 3D (perspective / preserve-3d)

```css
.preview:not(:hover, :focus) { opacity: 0.4 }
&:focus-within, &:hover { mix-blend-mode: initial; filter: none; opacity: 1; outline-offset: calc(var(--outline-w) / 2); scale: 1; rotate: 0deg }
@keyframes bg-scroll animates background-position-y
```

### [アイコンホバーエフェクト](https://codepen.io/lensnote/pen/EaxmMpj)

made with: @keyframes · transition · :hover

```css
i { position:relative }
.ico-circle::before { position:absolute }
.i-circle { position:absolute; transition:stroke-dasharray .6s cubic-bezier(0.22,1,0.36,1), opacity 0s 6s }
.i-circle:hover { opacity: 1; transition:stroke-dasharray .6s cubic-bezier(0.22,1,0.36,1), opacity 0s }
.ico-rect::before { position:absolute }
.i-rect { position:absolute; transition:stroke-dasharray .6s cubic-bezier(0.22,1,0.36,1), opacity 0s 6s }
.i-rect:hover { opacity: 1; transition:stroke-dasharray .6s cubic-bezier(0.22,1,0.36,1), opacity 0s }
.ico01:hover .mask { animation: reveal-fill .5s forwards }
.ico02 svg { transform:translateX(0); transition: .3s }
.ico02:hover svg { transform:translateX(20px) }
@keyframes reveal-fill animates width
```

### [Focus by negation](https://codepen.io/julbrn/pen/EaxWgLL)

on hover of li.: li.: transform+opacity+top ×6 | made with: transition · :hover · prefers-reduced-motion

```css
& > li { transition: transform 0.3s ease, opacity 0.3s ease }
&:hover > li:not(:hover) { opacity: 0.25; transform: scale(0.8) }
```

### [Shader transform hero demo with ThreeJS v1](https://codepen.io/Bembit/pen/raNjqpb)

held: fixed canvas | made with: position: fixed · @keyframes · transition · :hover · three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

```css
body { position: relative }
a.btn { box-shadow: 2px 2px 150px 75px rgba(255, 141, 236, 0.1) }
.gradient-button { animation: gradientMove 4s infinite linear }
0% { background-position: 0% 50% }
50% { background-position: 100% 50% }
100% { background-position: 0% 50% }
canvas { position: fixed; top: 0 }
.hero-container { margin-top: 20svh }
.hero-headings { position: relative }
div.hover-info-container { position: absolute; top: 33% }
.hero-container > *:not(.btn-container) { margin-bottom: 25px }
.effects-container { position: absolute; margin-top: 10svh }
```

```js
requestAnimationFrame(animate)
addEventListener("mousemove", (event) => {
addEventListener("mouseenter", (event) => {
addEventListener("mouseleave", () => {
```

### [Button with Hover Effect](https://codepen.io/mihaiapostol14/pen/XJWpWQa)

on scroll: button.button: transform+shadow+top | made with: transition · :hover

```css
.button { box-shadow: 0 4px 15px rgba(255, 0, 102, 0.4); transition: box-shadow 0.3s ease, transform 0.3s ease }
.button:hover { box-shadow: 0 10px 20px rgba(255, 0, 102, 0.5); transform: translateY(-3px) }
```

### [JS/CSS hover radial-gradient effect w/border illumination](https://codepen.io/SGM1992/pen/vEYywVJ)

on scroll: div.card-border: opacity ×6 | made with: transition · :hover · custom properties driven by JS

```css
#cards:hover > .card > .card-border { opacity: 1 }
.card { position: relative }
.card:hover::before { opacity: 1 }
.card::before, .card > .card-border { position: absolute; top: 0px; opacity: 0; transition: opacity 500ms }
.card > .card-content { position: relative }
```

```js
style.setProperty("--mouse-x", `${x}px`)
style.setProperty("--mouse-y", `${y}px`)
```

### [JS/CSS hover radial-gradient effect](https://codepen.io/SGM1992/pen/XJWNwxJ)

made with: transition · :hover · custom properties driven by JS

```css
.card { position: relative }
.card:hover::before { opacity: 1 }
.card::before { position: absolute; top: 0px; opacity: 0; transition: opacity 500ms }
```

```js
style.setProperty("--mouse-x", `${x}px`)
style.setProperty("--mouse-y", `${y}px`)
```

### [Untitled](https://codepen.io/0xNinshu/pen/ZYEBLxL)

on scroll: div.card: color+top | made with: @keyframes · transition · :hover

```css
body { padding-top: 2rem; padding-bottom: 2rem }
.card { position: relative }
.card:hover { transition: color 1s }
.card:hover:before, .card:hover:after { animation: none; opacity: 0 }
.card::before { position: absolute; top: -1%; animation: spin 2.5s linear infinite }
.card::after { position: absolute; top: calc(var(--card-height) / 6); transform: scale(0.8); filter: blur(calc(var(--card-height) / 6)); opacity: 1; transition: opacity 0.5s; animation: spin 2.5s linear infinite }
0% { --rotate: 0deg }
100% { --rotate: 360deg }
a { margin-top: 2rem }
@keyframes spin animates --rotate
```

### [Animated gradient Button](https://codepen.io/zain-muhammad/pen/VYwmwRg)

on scroll: span.: transform+top ×4, div.subscribe-animated-btn: shadow+top, svg.[object: transform+top | on hover of div.subscribe-animated-btn: span.: transform ×2, span.: transform+top ×2 | made with: @keyframes · transition · :hover

```css
.subscribe-animated-btn { position: relative; box-shadow: 0px 0px 4px 0px #ff5f6d; transition: 0.2s ease-in-out }
.subscribe-animated-btn .icon { transition: 0.1s ease-in-out }
.subscribe-animated-btn:hover { box-shadow: 0px 0px 15px 0px #ff5f6d }
.subscribe-animated-btn:active { transform: scale(0.95) }
.subscribe-animated-btn:hover .icon { transform: rotate(-45deg) }
.subscribe-animated-btn span:nth-child(1) { position: absolute; top: 0; animation: animate1 6s linear infinite }
0% { transform: translateX(-100%) }
100% { transform: translateX(100%) }
.subscribe-animated-btn span:nth-child(2) { position: absolute; top: 0; animation: animate2 6s linear infinite; animation-delay: 3s }
0% { transform: translateY(-100%) }
100% { transform: translateY(100%) }
.subscribe-animated-btn span:nth-child(3) { position: absolute; bottom: 0; animation: animate3 6s linear infinite }
```

### [Particles interaction](https://codepen.io/divulture/pen/wBvWmav)

held: fixed div | on scroll: div.: transform+top | made with: position: fixed · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
#customCursor { position: fixed; transform: translate(-50%, -50%) }
```

```js
addEventListener("mousemove", (e) => {
requestAnimationFrame(animate)
```

### [25% - 50% OFF SALE](https://codepen.io/sonnykoh/pen/wBvWzLE)

made with: transition · :hover · :has() · mix-blend-mode · 3D (perspective / preserve-3d)

```css
body { perspective: 400px; padding-top: 4% }
div { position: relative; top: 74px; outline-offset: 3px; transition: all 0.45s, transform 0.3s ease-out, opacity 0.3s ease, filter 0.5 ease }
div:after { position: absolute; margin-top: 20px }
div:before { position: absolute; top: 40px; mix-blend-mode: highlight }
div:hover { outline-offset: 6px; transform: scale(1.075) translateZ(10px); transition: transform 0.16s ease-out }
body:has(div:hover) div:not(:hover) { transform: scale(0.97) rotateY(6deg); opacity: 0.4; filter: blur(3px) grayscale(0.65); transition: all 0.45s ease, opacity 0.3s ease-in }
```

### [create me a sign up page](https://codepen.io/Siddhi-Soliwal/pen/emYZbBX)

made with: nothing recognised — read the code

### [create me a sign up page](https://codepen.io/Siddhi-Soliwal/pen/MYWyZbZ)

made with: nothing recognised — read the code

### [Fogged glass](https://codepen.io/divulture/pen/azbdvPb)

made with: transition · mask · canvas 2D · pointer / mouse tracking

```css
.container { position: relative; text-transform: uppercase }
.blurred-text { filter: blur(14px) }
.clear-text { position: absolute; top: 0; mask-image: none; -webkit-mask-image: none; opacity: 1; transition: opacity 1s ease }
```

```js
addEventListener('mousemove', (e) => {
addEventListener('mouseleave', () => {
```

### [4 type of neumorphism with hover effect](https://codepen.io/vedzzb/pen/ByaoGXx)

made with: :hover

```css
.box-one { box-shadow: 20px 20px 60px #bababa, -20px -20px 60px #ffffff }
.box-one:hover { box-shadow: 24px 24px 48px #c2c2c2, -24px -24px 48px #ffffff }
.box-two { box-shadow: 20px 20px 60px #bababa, -20px -20px 60px #ffffff }
.box-two:hover { box-shadow: 20px 20px 60px #bababa, -20px -20px 60px #ffffff }
.box-three { box-shadow: 20px 20px 60px #bababa, -20px -20px 60px #ffffff }
.box-three:hover { box-shadow: inset 20px 20px 60px #bababa,inset -20px -20px 60px #ffffff }
.box-four { box-shadow: inset 20px 20px 60px #bababa,inset -20px -20px 60px #ffffff }
.box-four:hover { box-shadow: 24px 24px 48px #c2c2c2, -24px -24px 48px #ffffff }
```

### [Add to cart animations](https://codepen.io/jayramoliya/pen/ZYEbqGe)

held: fixed div.cart-count | on scroll: button.cart-button: background | made with: position: fixed · @keyframes · transition · :hover

### [Add to cart](https://codepen.io/jayramoliya/pen/LEYpgEm)

on scroll: button.cart-button: background+top | made with: @keyframes · transition · :hover

### [GSAP animation images following the mouse cursor](https://codepen.io/pierrinho/pen/EaxaLBp)

made with: GSAP · pointer / mouse tracking

```css
.hero { position: relative }
.title { transform: scale(0.7); opacity: 1; background-position: 100% }
.cursor-picture { position: absolute; opacity: 0; transform: scale(0.8) }
```

```js
gsap.timeline({
addEventListener("mousemove", (e) => {
gsap.timeline()
```

### [Dithering Background with Hover Animation](https://codepen.io/jayramoliya/pen/mydbXyO)

made with: transition · :hover

```css
body { background-position: 0 0, 5px 5px; transition: background-color 0.5s ease }
```

### [CSS carousel w/ links & stop animation](https://codepen.io/SGM1992/pen/KwKPpMr)

on scroll: div.carousel-track: transform | made with: @keyframes · transition · :hover

```css
.carousel-container { position: relative; margin-top: 10px; box-shadow: 0 5px 15px rgba(200, 16, 46, 0.9) }
.carousel-container:hover .carousel-track { animation-play-state: paused }
.carousel-title { margin-top: 5vh }
.carousel-track { animation: 10s slide infinite linear }
.carousel-item { transition: transform 0.3s; background-position: center }
.carousel-item:hover { transform: scale(1.2) }
from { transform: translate(0) }
to { transform: translate(-91.6%) }
@keyframes slide animates transform
```

### [Angular Rainbow Hover Underline Effect](https://codepen.io/kazmi066/pen/ByBXzda)

made with: transition · :hover

```css
.rainbow-underline { position: relative }
.rainbow-underline::after { position: absolute; bottom: -2px; transform: scaleX(0); transition: transform .3s ease }
.rainbow-underline:hover::after { transform: scaleX(1) }
```

### [Simple Image Hover Effect with Eyeball Entity Symbol](https://codepen.io/mark_sottek/pen/QwLXJdN)

on scroll: figure.gallery-image: transform+top, img.: transform+opacity+top, span.eye-overlay: opacity+top | made with: transition · :hover

```css
.gallery-image { position: relative; transition: transform 0.3s ease }
.gallery-image:hover { transform: scale(1.02) }
.gallery-image .image-wrapper { position: relative }
.gallery-image .image-wrapper img { transition: transform 0.3s ease, opacity 0.3s ease }
.gallery-image:hover .image-wrapper img { transform: scale(1.1); opacity: 0.9 }
.gallery-image .eye-overlay { position: absolute; top: 50%; transform: translate(-50%, -50%); opacity: 0; transition: opacity 0.3s ease }
.gallery-image:hover .eye-overlay { opacity: 1 }
.gallery-image figcaption h2 { text-transform: uppercase }
```

### [Tooltip](https://codepen.io/t_herper/pen/OPLeBqG)

made with: nothing recognised — read the code

```css
.tooltip { position: absolute }
```

```js
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
addEventListener("mouseenter", showTooltip)
addEventListener("mouseleave", (event) => {
```

### [hover effects](https://codepen.io/jayramoliya/pen/ZYzdojP)

on scroll: div.circle: transform+opacity+top | made with: transition · :hover

### [Quiz (pick any one)](https://codepen.io/Ashmita-Kumari/pen/YPKoqJj)

on hover of button.btn1: button.btn1: background+shadow | made with: transition · :hover

```css
body { background-position: center }
.app { background-position: center }
.app h1 { border-bottom: 1px solid black; padding-bottom: 20px }
.btn1 { transition: all 0.3s }
.btn1:hover { box-shadow: 3px 3px 4px red }
.btn2 { transition: all 0.3s }
.btn2:hover { box-shadow: 3px 3px 4px green }
```

### [Fun "quick flip" effect](https://codepen.io/kevinpowell/pen/ZYzNjbX)

on scroll: a.: transform | made with: transition · :hover · :has()

```css
> * { transition: transform var(--transition-duration) var(--timing-function), translate 0ms calc(var(--transition-duration) / 2) }
&:is(:hover, :focus-within) > * { transform: translateY(-2lh); translate: 0 2lh }
h1 { text-transform: uppercase }
```

### [Title Image Hover](https://codepen.io/GreenSock/pen/qEWGNgW)

on hover of li.: img.: transform+opacity | made with: GSAP

```css
.header nav ul li { position: relative }
.header nav ul img { position: absolute; top: 100%; opacity: 0 }
```

```js
addEventListener("mouseenter", () => t.reversed(!t.reversed()))
addEventListener("mouseleave", () => t.reversed(!t.reversed()))
```

### [Hover-Animation](https://codepen.io/VoaryLuciano/pen/raBbZqx)

on scroll: img.: filter+top | on hover of img.: img.: filter+top ×2 | made with: transition · :hover · clip-path

```css
img { clip-path:inset(0 round 0.5em); filter:grayscale(1); transition : ease-in-out 0.5s }
.container > div { transition: ease-in-out 0.5s }
div:hover > img, div:active > img { filter:grayscale(0) }
.container > div::after { transition : ease-in-out 0.5s }
```

### [Button Skewed](https://codepen.io/MatteoPeroniDev/pen/xbKeGjJ)

on scroll: button.: transform, div.text: transform | made with: transition · :hover

```css
button { text-transform: uppercase; transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94); transform: skew(-15deg) }
button .text { transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94); transform: skew(15deg) }
button:hover { transform: skew(0deg) }
button:hover .text { transform: skew(0deg) }
```

### [effect](https://codepen.io/jayramoliya/pen/xbKBPEo)

on scroll: div.particle: transform+top, h2.glitch-text: transform+top, div.holographic: shadow+top | on hover of div.card: div.particle: transform+top, h2.glitch-text: transform+top, div.holographic: shadow | made with: @keyframes · transition · :hover · 3D (perspective / preserve-3d) · IntersectionObserver · pointer / mouse tracking

### [Interactive Color Reveal](https://codepen.io/abdelhakcode/pen/KwPJbpO)

on scroll: img.b-w-image: transform+top, img.colurful-image: transform+top | made with: transition · :hover · mask · pointer / mouse tracking

```css
.image-container { position: relative }
.image-container img { position: absolute; transition: transform 0.3s }
.image-container:hover img { transform: scale(1.01) }
.image-container img.b-w-image { filter: grayscale(100%) }
.image-container img.colurful-image { mask: url(#mask) }
svg { position: absolute; top: 0 }
svg .mask-circle { transition: 0.3s }
```

```js
addEventListener('mousemove', function(e){
addEventListener('mousemove', ()=>{
```

### [Tooltip](https://codepen.io/t_herper/pen/YPKBYQv)

on hover of div.card: div.card: transform+shadow+top | made with: transition · :hover

```css
#cards-wrapper .card { position: relative; transition: all ease-in-out 160ms; transform: translateZ(0) }
#cards-wrapper .card:hover { -webkit-box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.1); box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.1); transform: scale(1.016) }
#cards-wrapper .card .card-tag { position: absolute; top: 16px }
#cards-wrapper .card .card-description { position: relative }
#cards-wrapper .card .card-button { transition: all ease-in-out 200ms }
.tooltip { position: absolute; top: 0; box-shadow: 0px 6px 8px 4px #00000014 }
```

```js
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
addEventListener("mouseenter", showTooltip)
addEventListener("mouseleave", (event) => {
```

### [Floating elements and scroll-based text reveal](https://codepen.io/abdelhakcode/pen/ogvmwQZ)

held: fixed div.images-gallery, fixed div.content | on scroll: div.image-container: transform ×6, img.image: transform ×6, span.slide-text: transform+top ×6 | on hover of img.image: div.image-container: transform+top ×6, img.image: transform+top ×6, span.slide-text: transform+top ×6 | made with: position: fixed · transition · scroll listener · pointer / mouse tracking · requestAnimationFrame · Web Animations API (.animate)

```css
.images-gallery { position: fixed }
.images-gallery .image-container { position: absolute; transition: transform 0.2s }
.--i-0 { top: 1% }
.--i-1 { bottom: -3% }
.--i-2 { top: -15% }
.--i-3 { top: 10% }
.--i-4 { bottom: -20% }
.--i-5 { bottom: -10% }
.images-gallery .image-container .image { transition: transform 0.2s }
.middle-content .content { position: fixed; top: 50%; transform: translate(-50%, -50%) }
.middle-content .upper-text-container, .middle-content .lower-text-container { margin-bottom: 10px }
.middle-content .upper-text-container .text-slider { margin-top: clamp(-25px, -2vw, -5px) }
```

```js
addEventListener('mousemove', function(e){
requestAnimationFrame(() => {
addEventListener('scroll', function(){
.animate([
```

### [Glowing Neon Button](https://codepen.io/mihaiapostol14/pen/bNbOrXw)

on scroll: button.neon-btn: shadow | made with: :hover

```css
.neon-btn { box-shadow: 0 0 5px cyan, 0 0 25px cyan }
.neon-btn:hover { box-shadow: 0 0 5px cyan, 0 0 50px cyan, 0 0 100px cyan, 0 0 200px cyan }
```

### [Hover Marquee Reveal Animation](https://codepen.io/BooGhost/pen/qEWLjxr)

on scroll: div.marquee_content: transform+top ×3, h1.title: transform+top, div.marquee_container: transform+top | made with: GSAP

```css
.marquee_container { transform: scaleY(0) }
.h5 { text-transform:uppercase }
```

```js
gsap.fromTo(marquee.children,{x:0},{ x: distanceToTranslate, duration:8, repeat:-1, ease:'none'
gsap.timeline({duration:0.9, paused:true})
addEventListener('mouseenter',()=>tl.play())
addEventListener('mouseleave',()=>tl.reverse())
```

### [Text reveal CSS only](https://codepen.io/enryuu/pen/yyBRbGm)

made with: transition · :hover · mix-blend-mode

```css
#text { text-transform: uppercase; mix-blend-mode: difference }
&:hover #overlay { inset:0 }
#overlay { position: absolute; inset: 0; bottom: 80%; transition: all 0.4s ease }
```

### [Hover Fonts](https://codepen.io/cfabregas01/pen/ZYzMwGP)

on scroll: span.: opacity | made with: transition · :hover

```css
.cfabregas { text-transform: lowercase }
.name { position: relative }
span { transition: 0.4s }
&:hover span { opacity: 0 }
&::before { position: absolute; top: 0; transition: 0.4s }
&:hover::before { filter: drop-shadow(0 0 5px var(--color)) }
```

### [effect of moving cards](https://codepen.io/z5code/pen/emOLbBr)

on scroll: article.child: transform | made with: transition · :hover

```css
&:hover { transform: translateX(-20px) }
& ~ .child { transform: translateX($translateX) }
&:hover { transform: scale(1.05) }
h2 { margin-bottom: .5rem }
p { margin-bottom: 1rem }
```

### [Responsive Cards CSS](https://codepen.io/z5code/pen/zxOJwgN)

on scroll: div.content: background, a.: background+color | made with: transition · :hover

```css
.cards h2.header { text-transform: uppercase }
.content { transition: all .3s ease }
.content h2 { text-transform: uppercase }
.content a { text-transform: uppercase; transition: .3s ease }
```

### [Hover Effect](https://codepen.io/Nima-Navabi/pen/yyBxMEx)

made with: transition · :hover

```css
button { transition: all 0.5s; box-shadow: 0 10px 20px -8px rgba(0, 0, 0,.7) }
button { position: relative; transition: 0.5s }
button:after { position: absolute; opacity: 0; top: 14px; transition: 0.5s }
button:hover:after { opacity: 1 }
```

### [wp wooCommerce category list groups nav](https://codepen.io/annabananajennings/pen/EaYpvmz)

made with: transition · :hover

```css
#catalog details { transition: 300ms ease-in-out 100ms }
#catalog details summary { transition: 300ms ease-in-out 100ms }
#catalog details summary:hover { transition: 300ms ease-in 200ms }
#catalog details summary::after { transition: 0.2s }
#catalog details[open] summary { opacity: 0.5 }
#catalog details[open] > summary::after { transform: rotate(180deg) translatey(3px) }
#catalog ul { transition: 300ms ease-in-out 100ms }
#catalog ul:hover { transition: 300ms ease-in 200ms }
#catalog ul li { text-transform: uppercase; opacity: 0.8; transition: 300ms ease-in-out 100ms }
#catalog ul li a { transition: 300ms ease-in 200ms }
#catalog ul li a:hover { transition: 300ms ease-in 200ms }
#catalog ul li:hover { opacity: 1; transition: 300ms ease-in 200ms }
```

### [Swiper Vertical Ticker - Highlighting Brands 🚀](https://codepen.io/bato-web-agency/pen/jENpNBg)

held: fixed div.preview, fixed aside.contact-menu | on scroll: div.swiper-wrapper: transform+top ×2 | on hover of img.: div.swiper-wrapper: transform+top ×2 | made with: transition · :hover · (hover: hover) gate · backdrop-filter

```css
.vertical-ticker__slide-content { position: relative; -webkit-backdrop-filter: blur(50px); backdrop-filter: blur(50px) }
.vertical-ticker__slide img { transition: opacity 0.6s ease-out }
.vertical-ticker__slide img:last-child { position: absolute; inset: 0; opacity: 0 }
.vertical-ticker__slide:hover img:last-child { opacity: 1 }
```

### [Product Card Box Design](https://codepen.io/leonam-silva-de-souza/pen/jENzQoQ)

on scroll: img.card-img: transform+top, div.card-data: transform+top, h1.card-title: transform+top, span.card-price: transform+top, p.card-description: opacity+top, a.card-button: opacity+top | made with: transition · :hover

```css
.container { background-position: center }
.card-img, .card-data, .card-title, .card-price, .card-description { transition: .5s }
.card-img { position: absolute; filter: drop-shadow(5px 10px 5px rgba(8, 9, 13, .4)) }
.card:hover .card-img { transform: translate(-1.5rem, -9.5rem) rotate(-20deg) }
.card-data { transform: translateY(13.2rem) }
.card:hover .card-data { transform: translateY(4.8rem) }
.card-title { margin-bottom: 0.5rem }
.card:hover .card-title { transform: translateX(-2.3rem); margin-bottom: 0 }
.card-price { margin-bottom: 1.25rem }
.card:hover .card-price { transform: translateX(-6.8rem) }
.card-description { margin-bottom: 1.25rem; opacity: 0 }
.card-button { transition: .2s; opacity: 0 }
```

### [Four Season Effect](https://codepen.io/cssHacker/pen/EaYEQJd)

on hover of div.card: div.card: transform+top | made with: transition · :hover · mix-blend-mode

```css
.card { background-position: center; box-shadow: 15px 15px 30px rgba(0,0,0,.5); transition: 0.6s }
.card:hover { transform: scale(1.25) }
.card h1 { mix-blend-mode: difference }
```

### [Fancy Hover Shadow](https://codepen.io/cssHacker/pen/xbKWYay)

on scroll: div.card: transform+shadow+top | made with: transition · :hover

```css
.card { background-position: center; box-shadow: 15px 15px 0px rgba(120,0,120,.3); transition: 0.4s }
.card:hover { transform: scale(1.05,1.05); box-shadow: -15px -15px 0px rgba(120,0,120,.3) }
.card .bottom { transition: 0.5s }
```

### [Tilt And Slide ! Hover To See The Magic !](https://codepen.io/Avoloch/pen/ByBYgeP)

on scroll: div.card: transform+top | made with: @keyframes · transition · :hover · backdrop-filter

```css
.card { backdrop-filter: blur(5px); box-shadow: -4em 4em 2em rgba(0, 0, 0, 0.3); transform: skewX(10deg); transition: all 0.4s ease; position: relative }
.dot-wrapper { position: absolute; top: 10px }
.dot { box-shadow: -5px 5px 5px rgba(0, 0, 0, 0.280) }
.card h1 { position: absolute; top: 20px }
.card p { position: absolute; bottom: -110px; transition: 1s ease }
.light-slide { position: absolute; top: -150px; box-shadow: 0 0 5px rgb(240, 255, 240), 0 0 10px rgb(240, 255, 240); transform: rotate(-45deg) }
.card:hover { transform: skew(0deg) }
.card:hover p { bottom: 10px }
.card:hover .light-slide { animation: slide 2s infinite }
@keyframes slide animates right
```

### [Text Hover Animation With JavaScript](https://codepen.io/Cyber_King/pen/ZYzvNvR)

made with: transition · :hover

```css
ul li a { text-transform: uppercase; transition: color 0.4s linear; -webkit-transition: color 0.4s linear; -moz-transition: color 0.4s linear; -ms-transition: color 0.4s linear; -o-transition: color 0.4s linear }
```

### [Skateboard Product Grid](https://codepen.io/a-trost/pen/QwLaPMb)

held: fixed div.promo-container | on scroll: svg.[object: filter+top ×4 | on hover of div.product-card: svg.[object: opacity ×4, svg.[object: filter ×4, img.product-image: transform, div.product-button-wrapper: opacity, div.button-outer: filter, a.button-middle: transform | made with: position: fixed · @keyframes · transition · :hover · clip-path

```css
.title-section h2 { opacity: 0; text-transform: uppercase; margin-bottom: 16px; animation: slideInFromLeft 600ms linear(0, 0.464 8.3%, 0.819 17%, 0.956 21.5%, 1.069 26.2%, 1.156 31%, 1.219 36%, 1.252 40.2%, 1.271 44.5%, 1.275 49.1%, 1.265 5 }
.subtitle-section p { opacity: 0; margin-bottom: 40px; animation: slideInFromLeft 600ms linear(0, 0.464 8.3%, 0.819 17%, 0.956 21.5%, 1.069 26.2%, 1.156 31%, 1.219 36%, 1.252 40.2%, 1.271 44.5%, 1.275 49.1%, 1.265 54.1%, 1.215 63.4%, 1.041 86 }
.product-card:nth-child(even) { margin-top: 4rem }
.product-card { position: relative; position: relative; opacity: 0; transform: translateY(50px); animation: slideInFromBottom 0.8s linear(0, 0.464 8.3%, 0.819 17%, 0.956 21.5%, 1.069 26.2%, 1.156 31%, 1.219 36%, 1.252 40.2%, 1.271 44.5% }
.product-card:nth-child(1) { animation-delay: 0.8s }
.product-card:nth-child(2) { animation-delay: 1s }
.product-card:nth-child(3) { animation-delay: 1.2s }
.product-card:nth-child(4) { animation-delay: 1.4s }
.product-card:nth-child(5) { animation-delay: 1.6s }
.product-card:nth-child(6) { animation-delay: 1.8s }
.product-card:nth-child(7) { animation-delay: 2s }
.product-card:nth-child(8) { animation-delay: 2.2s }
```

### [Fancy Card](https://codepen.io/cssHacker/pen/gbYXVWN)

on scroll: div.card: transform+shadow+top | made with: transition · :hover · backdrop-filter · mix-blend-mode

```css
.card { background-position: center; box-shadow: 0 0 30px rgba(0,0,0,.7); transition: 0.3s; transform: scale(0.8) }
.card:hover { transform: scale(0.9,0.9); box-shadow: 0 0 60px rgba(0,0,0,.7) }
.card h1 { mix-blend-mode: none }
.card .bottom { -webkit-backdrop-filter: blur(0px) }
.flagger .flag { box-shadow: 0 0 10px rgba(0,0,0,.5) }
.flagger p.rating { margin-top: 0px; margin-bottom: 0 }
.bottom .text p { opacity: 1 }
.bottom .text button { text-transform: uppercase; transition: 0.3s }
```

### [Product card with interactive border](https://codepen.io/Northstrix/pen/EaYbRxG)

on scroll: h1.text: color, span.title: color, span.text-effect: clip-path+color | on hover of img.file-image: h1.text: color ×2, span.title: color ×2, span.text-effect: clip-path+color ×2 | made with: transition · :hover · clip-path · custom properties driven by JS · pointer / mouse tracking

```css
.file-container { position: relative }
.file-container .text { transition: color 0.3s ease }
.image-container { position: relative }
.text { margin-bottom: 5px; transition: color 0.3s ease; position: relative }
.title { position: relative }
.text-effect { clip-path: polygon(0 50%, 100% 50%, 100% 50%, 0 50%); transition: all cubic-bezier(.1,.5,.5,1) 0.4s; position: absolute; top: -4px; bottom: -4px }
.file-container:hover .text-effect { clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%) }
```

```js
style.setProperty('--border-color', borderColor)
style.setProperty('--hover-text-color', hoverTextColor)
style.setProperty('--borderGradient', `conic-gradient(from var(--rotation),
addEventListener('mousemove', (e) => {
style.setProperty("--rotation", `${angle}rad`)
```

### [Image Map Hover Functions](https://codepen.io/samsimite/pen/wBwPpqK)

made with: nothing recognised — read the code

```css
.box { position: absolute; top: 0; bottom: 0 }
.tabcontent1 { position: absolute; top: 60px }
.map { position: absolute; top: 0 }
.fullscreen { position: absolute; top: 20px }
```

### [Effet Hover CSS - Soulignement Lien Fluide CSS](https://codepen.io/romain-tortosa/pen/bNbYrPq)

on hover of a.link: a.link: color | made with: transition · :hover

```css
.link { position: relative; transition: all 0.3s ease }
.link::after { position: absolute; bottom: 0; transform: scaleX(0); transition: transform 0.3s ease }
.link:hover::after { transform: scaleX(1) }
h2 { margin-bottom: 1rem }
```

### [Cursor Customized here! and Button with Smooth Transition](https://codepen.io/darshit_tank/pen/OPLOXee)

on hover of button.: button.: transform+top | made with: transition · :hover

```css
body { margin-top: 100px }
button { text-transform: uppercase; transition: 0.5s; box-shadow: 0 0 20px #eee; text-transform:uppercase }
button:hover { background-position: right center; transform: scale(1.1) }
button:active { transform: scale(1); box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1) }
```

### [Duolingo Buttons](https://codepen.io/cssHacker/pen/GgKMYpr)

made with: nothing recognised — read the code

```css
button { box-shadow: 0 5px green }
button:active { box-shadow: 0 0px green, inset 0px 0px 30px rgba(0,0,0,.1); transform: translate(0px, 5px) }
```

### [Hover Card with Sliding Icons and Customizable Delays](https://codepen.io/Sxzarr/pen/EaYvzVY)

on hover of div.card: div.icon: transform+opacity ×3 | made with: transition · :hover

```css
.card { position: relative; box-shadow: 12px 12px 20px -12px rgba(0, 0, 0, 0.35) }
.icon { position: relative; transform: translate( var(--slide-x), var(--slide-y) ); opacity: 0; transition: transform var(--transition-duration) ease, opacity var(--transition-duration) ease }
.card:hover .icon { transform: translate( var(--slide-end-x), var(--slide-end-y) ); opacity: 1 }
```

### [Rotation interaction](https://codepen.io/abdelhakcode/pen/vEBJwEy)

held: fixed div.noise-effect-container | on scroll: img.image: transform | made with: position: fixed · pointer / mouse tracking · Web Animations API (.animate)

```css
.noise-effect-container { position: fixed; opacity: 0.02 }
```

```js
addEventListener('mousemove', function(e){
.animate([
addEventListener('mouseleave', function(e){
```

### [Pixel hover effect](https://codepen.io/abdelhakcode/pen/MYgvOqm)

held: fixed div.noise-effect-container | made with: position: fixed · Web Animations API (.animate)

```css
.noise-effect-container { position: fixed; opacity: 0.02 }
.image-container { position: relative }
.pixel-grid { position: absolute }
.pixel { opacity: 0 }
```

```js
.animate( [
```

### [Cursor ripple effect inside card](https://codepen.io/vedzzb/pen/jENLBwY)

made with: transition · :hover · custom properties driven by JS

```css
.container { position: relative }
.container .box { position: relative }
.container .box::before { position: absolute; top: var(--y); transform: translate(-50%,-50%); transition: 0.5s, top 0s, left 0s }
```

```js
style.setProperty('--x', x+'px')
style.setProperty('--y', y+'px')
```

### [CSS Hover Blur Effect for Cards (No JS)](https://codepen.io/mazalovalex/pen/gbYRqXj)

on scroll: div.card: opacity+filter+background ×4 | on hover of div.card: div.card: opacity+filter+background | made with: transition · :hover

```css
.card { transition: all 0.4s ease-in-out }
.wrapper:hover .card:not(:hover) { filter: blur(3px); opacity: 0.5 }
```

### [Nice text hover](https://codepen.io/antoine-favereau/pen/VYZbbNV)

made with: pointer / mouse tracking

```css
.text { position: relative }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseleave", (e) => {
```

### [Interactive code block with hoverable attributes in a canvas](https://codepen.io/martagodoy/pen/zxOZMva)

made with: canvas 2D · pointer / mouse tracking

```css
#hoverText { position: absolute }
```

```js
addEventListener("mousemove", function(event) {
```

### [CSS 3D Isometric Social Media Icon Hover Effects](https://codepen.io/Virender-Prasad/pen/EaYZBBx)

on scroll: span.: transform+opacity+background+color+top ×3, span.: transform+opacity+background+color, span.fa-brands: transform+background+color+top | on hover of li.: span.: transform+opacity+background+color+top ×6, span.: transform+opacity+background+color ×2, span.fa-brands: transform+background+color+top ×2 | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
ul { position: relative; transform: rotate(-25deg) skew(25deg) }
ul li { position: relative }
ul li:before { position: absolute; bottom: -10px; transform-origin: top; transform: skewX(-41deg) }
ul li:after { position: absolute; top: 0; transform: skewY(-49deg) }
ul li span { position: absolute; top: 0; transition: 0.2s }
ul li:hover span { transition: 0.5s; box-shadow: -1px 1px 1px rbga(0, 0, 0, 0.05) }
ul li:hover span:nth-child(5) { transform: translate(40px, -40px); opacity: 1 }
ul li:hover span:nth-child(4) { transform: translate(30px, -30px); opacity: 0.8 }
ul li:hover span:nth-child(3) { transform: translate(20px, -20px); opacity: 0.6 }
ul li:hover span:nth-child(2) { transform: translate(10px, -10px); opacity: 0.4 }
ul li:hover span:nth-child(1) { transform: translate(0px, 0px); opacity: 0.2 }
```

### [Not clickable... or is it?](https://codepen.io/RonakDesai007/pen/raBjmWG)

on scroll: a.underline-button: color | made with: transition · :hover

```css
.underline-button { position: relative; transition: color 0.3s ease }
.underline-button::after { position: absolute; bottom: 0; transition: width 0.4s ease, background-color 0.4s ease }
```

### [Mouse Stalker](https://codepen.io/masakazuimai/pen/NPKbxVx)

made with: transition · :hover · requestAnimationFrame

```css
.cursor { position: absolute; box-shadow: 0 0 10px rgba(255, 255, 255, 0.6); transition: width 0.2s, height 0.2s, border-color 0.2s, box-shadow 0.2s }
.hover-link { position: relative }
.hover-link::after { position: absolute; bottom: -5px; transition: all 0.3s ease; transform: translateX(-50%) }
.hovering { box-shadow: 0 0 20px rgba(255, 107, 107, 0.8) }
```

```js
requestAnimationFrame(animate)
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

### [Magnetic button](https://codepen.io/RobinLopezDesign/pen/zxOBBOG)

held: fixed div.magnetic-cursor__dot | on scroll: button.magnetic-button: transform, svg.[object: opacity+color, path.[object: color, div.magnetic-highlight: transform+opacity+top, div.magnetic-cursor__dot: transform+opacity+top | on hover of button.magnetic-button: button.magnetic-button: transform ×2, svg.[object: opacity+color ×2, path.[object: color ×2, div.magnetic-highlight: transform+opacity+top ×2 | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · custom properties driven by JS · pointer / mouse tracking · requestAnimationFrame

```css
:root { --cursor-scale: 1.5 }
.magnetic-button { position: relative; backdrop-filter: blur(10px) }
.magnetic-button svg { opacity: 0.8; transition: 240ms ease-in-out }
.magnetic-button:hover svg { transition: 240ms ease-in-out; opacity: 1 }
.magnetic-button:active { transition: transform 180ms ease-in-out; transform: scale(0.95) !important }
.magnetic-highlight { position: absolute; top: 0; opacity: 0; transform: scale(0); transition: transform var(--transition-duration) ease, opacity var(--transition-duration) ease }
.magnetic-highlight::after { position: absolute; filter: blur(24px); opacity: 0.6; transform: translate(-50%, -50%) scale(0.8); transition: opacity 0.5s ease-out, transform 0.5s ease-out; top: var(--highlight-y) }
.magnetic-highlight.active { animation: appearInHighlight 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both }
.magnetic-cursor__dot { position: fixed; backdrop-filter: blur(4px); transform: translate(-50%, -50%); transition: transform var(--cursor-transition-duration), opacity var(--cursor-transition-duration), scale var(--cursor-transition-duration) }
0% { transform: scale(0); opacity: 1 }
100% { transform: scale(1); opacity: 1 }
0% { transform: scale(1); opacity: 1 }
```

```js
requestAnimationFrame(animateMagnet)
addEventListener("mousemove", (e) => {
style.setProperty('--highlight-x', `${offsetX}px`)
style.setProperty('--highlight-y', `${offsetY}px`)
addEventListener("mouseleave", () => {
```

### [Text Animation](https://codepen.io/deepakkv/pen/yyBJLrJ)

made with: transition · :hover · backdrop-filter

```css
.animate-letters { text-transform: uppercase }
.container { box-shadow: 0 0 40px rgba(255, 97, 96, 0.3); position: relative }
.sun { position: relative }
.sun:before { position: absolute; bottom: -50%; backdrop-filter: blur(35px) }
.btns { position: relative; margin-top: 40px }
.wrap-btn { margin-bottom: 16px }
.btn { transition: all ease 0.3s }
.btn:hover { box-shadow: 0 7px 20px rgba(65, 81, 141, 0.5); transform: translateY(-2px) }
.btn-close { position: absolute; top: 20px }
```

### [CSS_Fix Hover Font Weight & Spacing Changes](https://codepen.io/shiuh-li/pen/yyBOwgy)

on hover of button.btn: span.tt-block: color | made with: transition · :hover

```css
.btn { position: relative }
.btn::before { transition: all 0.45s; position: absolute; top:0 }
.arrow-block { position: absolute; top:0 }
.arrow-icon { transition: all 0.5s; position: relative; border-top: var(--line-width) solid #fff; transform: rotate(45deg) }
.arrow-icon::before { border-top: var(--line-width) solid #fff; position: absolute; top: 0%; transition: all 0.5s; opacity: 0; transform: rotate(-45deg) translateY(72%) translateX(-40%) scaleX(0) }
.btn:hover .arrow-icon::before { opacity: 1; transform: rotate(-45deg) translateY(72%) translateX(-40%) scaleX(1) }
.tt-block { text-transform: uppercase; transition: color 0.5s, letter-spacing 0.5s }
.font-weight .tt-block { transition: color 0.5s, text-shadow 0.5s }
```

### [Service card box with icon](https://codepen.io/hwfoibtz-the-reactor/pen/raBxLzw)

made with: transition · :hover

```css
.services__title { margin-bottom: 1.5rem }
.services .service { transition: transform 0.3s ease, background-color 0.3s ease }
.services .service i.icon { margin-bottom: 0.5rem }
.services .service h3 { margin-bottom: 0.5rem }
.services .service:hover { transform: translateY(-10px) }
```

### [css Hover animation](https://codepen.io/m2techweb/pen/LEPpMrV)

on scroll: div.element: shadow+top | made with: transition · :hover

```css
.element { box-shadow: none; transition: 300ms ease }
.element:hover { box-shadow: 12px 12px 32px rgba(0, 0, 0, 0.1), -5px -5px 15px #ffffff }
.element.el2:hover { box-shadow: 12px 12px 32px rgba(0, 0, 0, 0.1) inset, -5px -5px 15px #ffffff inset }
```

### [Info Box](https://codepen.io/hwfoibtz-the-reactor/pen/XJrmKjz)

on hover of a.learn-more: div.infobox: transform+top | made with: transition · :hover

```css
.infobox-section h1 { margin-bottom: 10px }
.infobox-section p { margin-bottom: 30px }
.infobox { transition: transform 0.3s ease; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) }
.infobox:hover { transform: translateY(-10px) }
.infobox .icon { margin-bottom: 15px }
.infobox h2 { margin-bottom: 10px }
.infobox p { margin-bottom: 20px }
```

### [Sidebar navigation Hoverable Buttons](https://codepen.io/oathanrex/pen/XJrbqWO)

held: fixed div.sidenav | on hover of a.: a.: color+shadow, span.icon: color, i.fas: color, span.text: opacity | made with: position: fixed · transition · :hover

```css
.sidenav { position: fixed; top: 50%; transform: translateY(-50%); box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.7); transition: width 0.3s ease-in-out }
.sidenav a { transition: all 0.3s ease; position: relative }
.sidenav a:hover { box-shadow: inset 0 0 12px 6px #555555 }
.sidenav a .icon { transition: margin-right 0.3s, color 0.3s }
.sidenav a .text { opacity: 0; transition: opacity 0.3s, margin-left 0.3s }
.sidenav a:hover .text { opacity: 1 }
```

### [CSS only card with hover effect](https://codepen.io/cycosta/pen/ZYzGKVe)

on scroll: img.card__image: transform+top, figcaption.card__caption: transform+top | made with: transition · :hover

```css
.card { box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.5) }
.card:hover .card__caption { top: 50%; transform: translateY(-50%) }
.card:hover .card__image { transform: translateY(-10px) }
.card:hover .card__thumb::after { top: 0 }
.card__thumb { position: relative }
.card__thumb::after { position: absolute; top: 0; transition: 0.3s }
.card__thumb::after { top: calc(100% - 140px) }
.card__image { transition: 0.5s ease-in-out }
.card__caption { position: absolute; top: 50%; transform: translateY(-50%); transition: 0.3s }
.card__caption { top: calc(100% - 110px); transform: unset }
.card__snippet { transition: 0.5s ease-in-out }
.card__button { transition: 0.3s }
```

### [Snacks Landing Page](https://codepen.io/leonam-silva-de-souza/pen/vEBOBjQ)

made with: transition · :hover

```css
nav { position: absolute; top: 0 }
.home-img img { object-position: center }
.box:hover, .active { transition: all .5s ease; box-shadow: 10px 10px 41px rgba(0, 0, 0, .5) }
.product-heading p { margin-top: 6px }
.product-img img { object-position: center }
.p-box { box-shadow: 5px 12px 41px rgba(0, 0, 0, .1); margin-top: 1.4rem }
.home-text { padding-bottom: 15px }
.contact-us h1 { padding-bottom: 15px }
.product-box h1 { padding-top: 25px }
```

### [SVG Text Hover](https://codepen.io/yoann-b/pen/qEWEVYe)

made with: transition · :hover · custom properties driven by JS

```css
.LinkContainer { position: relative }
.LinkContainer svg { --svg-inset: 30%; position: absolute; top: calc(0% - var(--svg-inset)); transform: translateX(calc(var(--svg-inset) / 6)) scale(1.3) }
.LinkContainer path { transition: stroke-dashoffset 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) }
.LinkContainer:hover path { transition: stroke-dashoffset 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) }
```

```js
style.setProperty("--path-length", length)
```

### [Menu Glitch Effect HTML and CSS and no JS](https://codepen.io/alexdx/pen/OPLJGpE)

made with: @keyframes · :hover · :focus-visible

```css
.nav a span { position: relative }
.nav a:focus-visible { position: relative }
.nav a:focus-visible::before { position: absolute; top: -5px; border-bottom: none }
.nav a:focus-visible::after { position: absolute; bottom: -5px; border-top: none }
.nav a:hover span, .nav a:focus-visible span { animation: glitch 0.5s infinite }
@keyframes glitch animates text-shadow
```

### [Neon Profile Card](https://codepen.io/procoderawais/pen/MYgWBgQ)

made with: @keyframes · transition · :hover

```css
.card { position: relative; box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2) }
.card .lines { position: absolute; inset: 0 }
.card .lines::before { position: absolute; top: 50%; animation: animate 4s linear infinite }
0% { transform: rotate(0deg) }
100% { transform: rotate(360deg) }
.card .lines::after { position: absolute; inset: 3px }
.card .imgBx { position: relative }
.card .imgBx img { position: absolute; top: 20px; transform: translateX(-50%) }
.card .content { position: relative }
.card .content .details h2 span { opacity: 0.75 }
.card .content .details .data h3 span { opacity: 0.75 }
.card .content .details .actionBtn button { opacity: 0.9; transition: 0.3s }
```

### [Card with Gradient Border](https://codepen.io/procoderawais/pen/YPKzvaM)

made with: @keyframes · transition · :hover · backdrop-filter

```css
.card { position: relative; backdrop-filter: blur(10px); transition: 0.5s }
.card::before { position: absolute; animation: animate 4s linear infinite; opacity: 0; transition: 0.5s }
.card:hover::before { opacity: 1 }
0% { transform: rotate(0deg) }
100% { transform: rotate(360deg) }
.card .content { position: relative }
.card .content h2 { margin-bottom: 5px }
.card .content h3 { margin-bottom: 10px }
.card .content p { margin-bottom: 20px }
.card .content a { transition: 0.5s }
.card .content a:hover { transform: scale(1.1); box-shadow: 0 0 20px rgba(255, 60, 123, 0.4) }
@keyframes animate animates transform
```

### [Animated Underline Hover](https://codepen.io/nguyenanhtuan/pen/PwYYooj)

on scroll: a.hoverBorder: color | made with: position: fixed · transition · :hover · mask

```css
body:before { position: fixed; top: -7px; -webkit-mask: linear-gradient(-20deg, transparent 50%, white); mask: linear-gradient(-20deg, transparent 50%, white) }
a { margin-bottom: 30px }
.hoverBorder { border-bottom: 1px solid transparent; transition: 0.25s }
.hoverBorder:hover { border-bottom: 1px solid #2962ff }
.hoverBackground { background-position: left bottom; transition: 0.25s }
.hoverPseudo { transition: 0.25s }
.hoverPseudo:after { transition: 0.25s }
```

### [Card hover effect with Figcaption](https://codepen.io/leonam-silva-de-souza/pen/QWeRpgp)

on scroll: img.: opacity, h2.: transform+opacity, p.: transform+opacity | on hover of figure.card: img.: opacity ×2, h2.: transform+opacity ×2, p.: transform+opacity ×2 | made with: transition · :hover

```css
figure.card { position: relative }
figure.card img { opacity: 1; transition: opacity .35s; -webkit-transition: opacity .35s; -moz-transition: opacity .35s; -ms-transition: opacity .35s; -o-transition: opacity .35s }
figure.card:hover img { opacity: .7 }
figure.card figcaption { position: absolute; top: 0 }
figure.card figcaption > div { position: relative }
figure.card figcaption::before { position: absolute; top: 50%; bottom: 50%; opacity: 0; transition: all .4s ease; -webkit-transition: all .4s ease; -moz-transition: all .4s ease; -ms-transition: all .4s ease; -o-transition: all .4s ease }
figure.card h2, figure.card p { opacity: 0; position: absolute; top: 0; transition: opacity .45s; -webkit-transition: opacity .45s; -moz-transition: opacity .45s; -ms-transition: opacity .45s; -o-transition: opacity .45s }
figure.card h2 { text-transform: uppercase; bottom: 0; transform: translate3d(50%, 0%, 0); -webkit-transform: translate3d(50%, 0%, 0); -ms-transform: translate3d(50%, 0%, 0); -o-transform: translate3d(50%, 0%, 0) }
figure.card p { bottom: 0; top: 0%; transform: translate3d(-50%, 0%, 0); -webkit-transform: translate3d(-50%, 0%, 0); -ms-transform: translate3d(-50%, 0%, 0); -o-transform: translate3d(-50%, 0%, 0) }
figure.card a { top: 0; bottom: 0; position: absolute }
figure.card:hover figcaption h2, figure.card:hover figcaption p { transform: translate3d(0%, 0%, 0); -webkit-transform: translate3d(0%, 0%, 0); -ms-transform: translate3d(0%, 0%, 0); -o-transform: translate3d(0%, 0%, 0) }
figure.card:hover figcaption h2 { opacity: 1 }
```

### [card hover](https://codepen.io/Patrik-Syrov-tko/pen/LYwvEQY)

made with: transition · :hover · backdrop-filter

```css
.card { position: relative }
.card .content { backdrop-filter: blur(20px); box-shadow: 0 0 30px rgba(0, 0, 0, 0.055); transition: all .4s }
.card::before, .card::after { position: absolute; transition: all .4s }
.card::before { top: 0 }
.card::after { bottom: 0 }
.card:hover::before { transform: translate(20px, -20px) }
.card:hover::after { transform: translate(-20px, 20px) }
```

### [Button Hover Fold Effect](https://codepen.io/yoann-b/pen/OJKqBEa)

held: fixed div | on scroll: li.: transform+top ×6 | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.Button { perspective: 700px }
.Button > li { transition: transform var(--transition-time) cubic-bezier(0.175, 0.885, 0.32, 1.275), margin var(--transition-time) cubic-bezier(0.175, 0.885, 0.32, 1.275), border-radius var(--transition-time) cubic-bezier(0.175, 0.885, }
.ButtonContainer:hover > .Button > li:nth-child(even) { transform: rotateY(var(--angle)) }
.ButtonContainer:hover > .Button > li:nth-child(odd) { transform: rotateY(calc(-1 * var(--angle))) }
```

### [media query: hover, pointer, any-pointer](https://codepen.io/VdustR/pen/YzmgXXx)

made with: (hover: hover) gate

### [Magnifying Glass Web Component v2 with Configurable Zoom](https://codepen.io/gorgonfreeman/pen/qBevEQZ)

on scroll: div.lens: transform+opacity+top, img.: transform+top | on hover of img.: div.lens: opacity | made with: transition · custom properties driven by JS · pointer / mouse tracking

```css
magnifiable-image { position: relative }
magnifiable-image .lens { position: absolute; top: 0; transform: translate(calc(-50% + var(--posx)), calc(-50% + var(--posy))); transition: transform 100ms, opacity 300ms; opacity: var(--show) }
magnifiable-image .lens img { transform: translate(var(--bgx), var(--bgy)); transition: transform 100ms }
div { position: relative }
div > span { position: absolute; top: 0; opacity: 0.9 }
```

```js
addEventListener('mousemove', e => {
style.setProperty('--show', 1)
style.setProperty('--posx', `${ offsetX }px`)
style.setProperty('--posy', `${ offsetY }px`)
style.setProperty('--bgx', `${ bgx }px`)
style.setProperty('--bgy', `${ bgy }px`)
addEventListener('mouseenter', e => {
addEventListener('mouseleave', e => {
```

### [Interactive Wafer-Style Image Cards with Lightbox"](https://codepen.io/tofjadesign/pen/NWQePVZ)

held: fixed div | on scroll: div.card: transform+shadow+top ×2, img.: transform+top ×2 | made with: position: fixed · transition · :hover

```css
.cards-container { position: relative }
.card { position: absolute; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); transition: transform 0.4s ease, box-shadow 0.4s ease }
.card:hover { transform: scale(1.05) rotate(3deg); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4) }
.card img { transition: transform 0.4s ease }
.card:hover img { transform: scale(1.1) }
button { margin-top: 2.5rem; transition: background-color 0.3s; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3) }
#lightbox { position: fixed; top: 0 }
.lightbox-content { box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5) }
```

### [Interactive Hover Spotlight with Smooth Follow Effect](https://codepen.io/samvgm/pen/PoMxmBq)

on scroll: img.: clip-path+top ×2 | on hover of img.: img.: clip-path+top ×2 | made with: transition · :hover · :has() · clip-path · custom properties driven by JS · container queries · pointer / mouse tracking · requestAnimationFrame

```css
&:has(a:hover) #circle { opacity: 0.2 }
#circle { position: absolute; translate: var(--xpos) var(--ypos); transition: width .2s ease-in-out, height .2s ease-in-out, border-radius .4s ease-in-out, opacity .2s ease-in-out }
&:hover { translate: 0 -20%; scale: 2; clip-path: inset(0px 0px round 12px); transition: translate .2s cubic-bezier(0.4, 0, 0.2, 1), scale .6s cubic-bezier(0.22, 0.61, 0.36, 1), clip-path 0.4s cubic-bezier(0.4, 0, 0.2, 1) }
&:hover { scale: 1.3 }
```

```js
addEventListener("pointermove", (evt) => {
style.setProperty("--xpos", `${currentX}px`)
style.setProperty("--ypos", `${currentY}px`)
requestAnimationFrame(animateCircle)
addEventListener("mouseenter", () => {
addEventListener("mouseleave", (evt) => {
```

### [Link Hover Effect w/ CSS](https://codepen.io/jagcruz/pen/OJKabeR)

on scroll: a.: color ×2 | on hover of a.: a.: color | made with: :hover

```css
body { position: relative }
&::before { transform: translate(10px, -10px) }
&::after { transform: translate(20px, -20px) }
&::before, &::after { position: absolute; text-transform: uppercase; transform: translate(0, 0); transition-property: color, -webkit-text-stroke, transform }
```

### [3D Hover Card](https://codepen.io/Bj-rnar-Frigaard/pen/dyxgyXM)

on scroll: div.card-conteiner: transform+top, span.icon: transform+top, h2.card-title: transform+top | on hover of div.card-conteiner: span.icon: transform+top | made with: @keyframes · transition · :hover · mix-blend-mode · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.card-paragraph { margin-bottom: 13px; margin-top: 13px }
.card-conteiner { position: relative; perspective: 1000px; box-shadow: 0 4px 8px rgba(0,0,0,0.2), 0 6px 20px rgba(0,0,0,0.19); transition: transform 0.2s ease }
.card-rotate { transition: transform 0.2s ease }
.image-container { position: relative }
.image { border-bottom: 3px solid var(--color-accent-light) }
0% { transform: rotate(0deg) }
15% { transform: rotate(15deg) }
30% { transform: rotate(-15deg) }
45% { transform: rotate(10deg) }
60% { transform: rotate(-10deg) }
75% { transform: rotate(5deg) }
100% { transform: rotate(0deg) }
```

```js
addEventListener('mouseenter', () => {
addEventListener('mousemove', rotateToMouse)
addEventListener('mouseleave', () => {
```

### [Glassmophism Landing Page](https://codepen.io/leonam-silva-de-souza/pen/GRVXdWP)

made with: transition · :hover · backdrop-filter

```css
.main-box { backdrop-filter: blur(2rem) }
.circle1, .circle2 { position: absolute }
.circle1 { top: 4% }
.circle2 { bottom: 4% }
.main-text::after { position: absolute; top: 9.4rem }
.btn2 { transition: .5s ease }
.main-img img { object-position: center }
```

### [Landing Page Example](https://codepen.io/leonam-silva-de-souza/pen/NWQLvvP)

made with: transition · :hover · backdrop-filter

```css
body { background-position: center }
li a { text-transform: uppercase; position: relative }
li a::after { position: absolute; top: 90%; transition: all .3s ease-in-out; -webkit-transition: all .3s ease-in-out; -moz-transition: all .3s ease-in-out; -ms-transition: all .3s ease-in-out; -o-transition: all .3s ease-in-out }
.basel { margin-top: 10rem }
.basel .text-content { backdrop-filter: blur(10px) }
.basel .button { margin-top: 2rem }
.btn i { transition: all .2s ease; -webkit-transition: all .2s ease; -moz-transition: all .2s ease; -ms-transition: all .2s ease; -o-transition: all .2s ease }
.btn:hover i { transform: translateX(5px); -webkit-transform: translateX(5px); -moz-transform: translateX(5px); -ms-transform: translateX(5px); -o-transform: translateX(5px) }
```

### [feturbulence fractalnoise svg dynamic follow mouse hover cursor reactive text distortion effect v1](https://codepen.io/aosceola56/pen/jOgvwBX)

made with: backdrop-filter · pointer / mouse tracking · requestAnimationFrame

```css
p:nth-of-type(2) { position: absolute; top: calc(50% + 4em); translate: -50% 0 }
svg { position: absolute }
.background { position: relative }
.distortion-window { position: absolute; top: 50%; transform: translate(-50%, -50%); backdrop-filter: url(#dynamicDistortion) }
```

```js
requestAnimationFrame(updateDistortion)
addEventListener("mousemove", (e) => {
addEventListener("mouseleave", () => {
```

### [30 Seconds of Knowledge Snippet: Aspect ratio](https://codepen.io/kerwin/pen/eYqKWJx)

on scroll: img.: transform+top | on hover of img.: img.: transform+top | made with: transition · :hover

```css
.container { position: relative; padding-bottom: calc(100% / (var(--aspect-ratio))) }
.container > * { position: absolute; top: 0; transition: all 1.5s }
.container:hover > * { transform: scale(1.2); transition: all 1s }
```

### [Rainbow Hover Border](https://codepen.io/lesbaa/pen/gOVzWQj)

made with: @keyframes · transition · :hover

```css
.filter { position: absolute }
.card { position: relative; transition: all 0.3s ease }
.animated-border:before { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: opacity 0.3s ease; opacity: 0; box-shadow: none }
.animated-border:before { animation: rotate-rotation 1.5s linear infinite; opacity: 0.75 }
.animated-border:hover::before { animation: rotate-rotation 1.5s linear infinite }
.card-title { margin-bottom: 20px; text-transform: uppercase }
.card-title { margin-top: 0 }
.card-content { margin-bottom: 1.5rem }
.card-button { text-transform: uppercase; transition: all 0.3s ease; position: relative }
.rainbow::before { filter: blur(0.75rem) }
.rainbow:hover::before { opacity: 0.5 }
@keyframes rotate-rotation animates --gradient-rotation
```

### [CSS | Curve Outside Card UI Design with Hover Effect](https://codepen.io/dian1127/pen/NWQYmzX)

on hover of div.card: div.imgBx: filter+top, p.: opacity+top | made with: transition · :hover

```css
.container { position: relative }
.container .card { position: relative; box-shadow: 0 20px 25px rgba(0, 0, 0, 0.25); transition: 0.5s }
.container .card .imgBx { position: relative; background-position: center; transition: 0.5s; filter: blur(25px) }
.container .card .imgBx::before { position: absolute; bottom: -40px }
.container .card .imgBx::after { position: absolute; bottom: 40px; box-shadow: 75px 70px 0px 40px #fff }
.container .card .content { position: relative; top: -40px; transition: 0.5s }
.container .card .content h3 { position: relative }
.container .card .content h3 span { position: absolute; bottom: -15px; opacity: 0.75 }
.container .card .content p { position: relative; opacity: 0; transition: 0.5s }
.container .card:hover .imgBx { filter: blur(0px) }
.container .card:hover .content p { opacity: 1 }
```

### [Shiny CSS Only Image Hover Effect](https://codepen.io/kistasaurus/pen/mdNxMXR)

made with: transition · :hover

```css
&::after { position: absolute; top: 0; transition: 0.4s; transform: skewX(10deg) }
h1 { margin-bottom: 1em }
```

### [Hover Reveal Peeping Effect](https://codepen.io/noirsociety/pen/xxvpvEb)

held: fixed div.control | made with: position: fixed · transition · :hover · clip-path · custom properties driven by JS · pointer / mouse tracking

```css
&::after { position: absolute; inset: 0; background-position: center; clip-path: circle(var(--size) at var(--x) var(--y)) }
&:hover::after { clip-path: circle(center center) }
&::after { position: absolute; bottom: 0; transition: height 0.5s }
& .info { position: absolute }
```

```js
style.setProperty('--height',`${value*10}%`)
style.setProperty('--size',`${value}rem`)
style.setProperty('--x',`${e.pageX}px`)
style.setProperty('--y',`${e.pageY}px`)
style.setProperty( '--image',
addEventListener('pointermove',updateXY,false)
```

### [Smooth Wave Animation on Hover](https://codepen.io/yasirali9/pen/OJKzyzp)

on scroll: div.card: transform+top, div.wave-container: opacity+top | made with: transition · :hover · canvas 2D · requestAnimationFrame

```css
.card { position: relative; transition: transform 0.3s ease }
.card:hover { transform: translateY(-5px) }
.wave-container { position: absolute; inset: 0; opacity: 0; transition: opacity 0.3s }
.card:hover .wave-container { opacity: 1 }
canvas { position: absolute; top: 0 }
.card-content { position: relative }
```

```js
requestAnimationFrame(drawWaves)
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [October beware do not hover!](https://codepen.io/tofjadesign/pen/XWvVmdB)

on scroll: div.: color+top | on hover of img.trail: div.: color+top | made with: @keyframes · transition · :hover · pointer / mouse tracking

```css
#trail-container { position: relative }
.trail { position: absolute; opacity: 1; animation: fade 1.5s forwards ease-out }
0% { opacity: 1; transform: scale(1) }
100% { opacity: 0; transform: scale(0.5) }
.halloween { margin-top: -0.6rem }
h1.ml12 { text-transform: uppercase }
#screen { position: absolute; top: 6% }
.container { background-position: center }
.calendar { padding-top: 1rem }
.day { margin-bottom: 1rem }
.column { position: relative; margin-bottom: 1rem }
.test { position: relative; margin-bottom: 2rem }
```

```js
addEventListener("mousemove", (e) => {
```

### [Custom cursor](https://codepen.io/ceciliaets/pen/zYgPXmK)

made with: :hover

### [Halloween movie cards](https://codepen.io/tofjadesign/pen/bGXYKRd)

made with: @keyframes · transition · :hover

```css
.container { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.movie-cover { box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75); transition: 0.5s }
#hand { position: absolute; top: 100px }
#booo { position: absolute; bottom: 280px }
#booo span { margin-bottom: 0 }
#halloween { position: absolute; bottom: 280px }
#halloween span { position: absolute; top: -100px }
#two:hover #knife, #two:hover #halloween, #two:hover #stap { animation-name: upDown; animation-duration: 0.8s; animation-iteration-count: 1; animation-timing-function: linear; animation-fill-mode: forwards }
from { top: 0px }
to { top: 150px }
#knife { position: absolute; top: 100px }
#knifeText { position: absolute; bottom: 280px }
```

### [Hover Info Card](https://codepen.io/Basswood/pen/BaXdGGO)

on scroll: a.: transform+opacity+top ×4, div.card__info-wrapper: transform+top, div.card__image-wrapper: transform+shadow+top, h2.card__name: transform+top, p.card__description: opacity+top | made with: @keyframes · transition · :hover

```css
.card { position: relative }
.card__border { position: absolute; top: 0 }
.card__border::before { position: absolute; top: 50%; transform: translate(-50%, -50%); animation: rotate 5s linear infinite forwards }
.card:hover .card__border::before { box-shadow: 0 0 200px 100px #ffffff, 0 0 100px 200px #f5f5f5 }
50% { box-shadow: 0 0 40px 60px #ffffff }
100% { transform: translate(-50%, -50%) rotate(360deg) }
.card__info-wrapper { transform: translateY(50%); transition: var(--ms-3) }
.card:hover .card__info-wrapper { transform: translateY(0%) }
.card__image-wrapper { box-shadow: 0px 0px 0px .5px var(--white-color); background-position: left }
.card__image-wrapper, .card__name { position: relative; transition: .3s; transform: translateX(-50%); scale: 1.4 }
.card:hover .card__image-wrapper { scale: 1; transform: translateX(0); box-shadow: 0px 0px 5px .5px var(--white-color) }
.card__name { margin-top: 15px }
```

### [Orbital Mobile](https://codepen.io/Philip-Walsh/pen/PoMKbMK)

made with: transition · :hover · :has() · clip-path · mix-blend-mode

```css
nav a { background-position: 100%; transition: background-position 0.4s ease; box-shadow: 0 4px 6px rgb(0 0 0 / 10%), 0 1px 3px rgb(0 0 0 / 8%) }
nav a:hover, nav a:has(*:hover), nav li:hover>a, nav li:hover a:hover { background-position: 0; box-shadow: 0 8px 12px rgb(0 0 0 / 20%), 0 3px 6px rgb(0 0 0 / 15%) }
body { background-position: -19px -19px }
main h2 { margin-bottom: 15px }
main section { margin-bottom: 1em }
main article { box-shadow: 0 4px 6px rgb(0 0 0 / 50%), 0 1px 3px rgb(0 0 0 / 8%) }
main article h3 { margin-top: 10px }
main section:last-of-type li { box-shadow: 0 4px 6px rgb(0 0 0 / 50%), 0 1px 3px rgb(0 0 0 / 8%) }
```

### [Card Hover Blur](https://codepen.io/BluishGlacier/pen/bGXreVM)

on scroll: div.cardSlide: transform+shadow+top, div.card-text: opacity+top | made with: transition · :hover · backdrop-filter

```css
section .cardSlide { box-shadow: 5px 5px 0 0.1rem #3e5e51; position: relative; background-position: center center; transition: .3s }
section .cardSlide .card-text { position: absolute; top: 0; backdrop-filter: blur(5px); opacity: 0; transition: opacity 0.3s ease }
section .cardSlide:hover .card-text { opacity: 1 }
section .cardSlide:hover { transform: translateY(-.5%); box-shadow: 0 14px 8px rgba(0, 0, 0, .4) }
```

### [Hover effect on siblings - .child:not(:hover)](https://codepen.io/DuskoStamenic/pen/LYwLjZr)

made with: transition · :hover · :has()

```css
.parent { margin-top: 40px }
.child { transition: 250ms ease-in }
.parent:has(.child:hover) .child:not(:hover) { scale: 0.85 }
```

### [Glow Board Cards](https://codepen.io/Horadrim/pen/dyxRMZG)

made with: nothing recognised — read the code

```css
.card { position: relative }
.card::before { inset:0px; position: absolute }
```

### [Hover Cards Effect](https://codepen.io/waffleflopper/pen/YzmQXBZ)

on scroll: div.item: transform+filter+top ×7 | on hover of img.: div.item: transform+filter+top ×9, div.item: transform | made with: transition · :hover · :has() · 3D (perspective / preserve-3d)

```css
.list { transform: perspective(1500px) }
.list .item { transition: 0.7s; filter: brightness(0) }
.list .item:hover { filter: brightness(1); transform: translateZ(150px) }
.list .item:hover + * { filter: brightness(0.6); transform: translateZ(75px) rotateY(20deg) }
.list .item:hover + * + * { filter: brightness(0.3); transform: translateZ(50px) rotateY(10deg) }
.list .item:hover + * + * + * { filter: brightness(0.1); transform: translateZ(10px) rotateY(3deg) }
.list .item:has(+ *:hover) { filter: brightness(0.6); transform: translateZ(75px) rotateY(-20deg) }
.list .item:has(+ * + *:hover) { filter: brightness(0.3); transform: translateZ(50px) rotateY(-10deg) }
.list .item:has(+ * + * + *:hover) { filter: brightness(0.1); transform: translateZ(10px) rotateY(-3deg) }
```

### [CSS Circle Hover Animation](https://codepen.io/Vignesh46/pen/eYqWorV)

made with: transition · :hover

```css
.circle { position:relative }
.circle::before { position:absolute; bottom:100%; transform:translateX(-50%); transform-origin:bottom; transition:1s linear }
.circle::after { position:absolute; background-position:center; top:50%; transform:translate(-50%,-50%); box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px }
.circle:hover::before { transform:translateX(-50%) rotate(180deg) }
```

### [Radio Listing Effect](https://codepen.io/sumit_evince/pen/wvVJYQY)

made with: @keyframes · transition · :hover · :has()

```css
.radio-input label { position: relative }
.radio-input label::before { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) }
.radio-input label:hover::before { transition: all 0.2s ease }
.radio-input .label input[type="radio"]:checked { -webkit-animation: puls 0.7s forwards; animation: pulse 0.7s forwards }
.radio-input .label input[type="radio"]:before { transition: all 0.1s cubic-bezier(0.165, 0.84, 0.44, 1); transform: scale(0) }
.radio-input .label input[type="radio"]:checked::before { transform: scale(1) }
0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4) }
70% { box-shadow: 0 0 0 8px rgba(255, 255, 255, 0) }
100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0) }
@keyframes pulse animates box-shadow
```

### [Cool Animated Button](https://codepen.io/HASSAM-the-decoder/pen/QWepBKL)

made with: @keyframes · transition · :hover

### [Gradient Hover Box](https://codepen.io/efelezki/pen/bGXgaEW)

made with: transition · :hover

```css
.link { border-top:1px solid white; position:relative }
.link:nth-child(3) { border-bottom:1px solid white }
.soru { transition:margin-left 300ms ease-out }
.link:nth-child(1):hover + .link:nth-child(2) { border-top:none }
.link:nth-child(2):hover + .link:nth-child(3) { border-top:none }
.link span { position:relative; transition: left 400ms }
.link:hover span { position:absolute }
```

### [Text Animation](https://codepen.io/raghavbudhiraja/pen/xxvgdBL)

on scroll: span.: transform+opacity+filter ×9 | made with: transition · :hover

```css
section { position: relative }
h2 span { transition: 1.5s }
h2:hover span { filter:blur(20px); opacity: 0; transform: scale(2) }
```

### [icons Github, Linkedin, Codepen](https://codepen.io/ogreogles/pen/dyxNOyN)

on hover of li.social__item: a.social__link: background+color, svg.[object: color, path.[object: color | made with: transition · :hover · (hover: hover) gate

```css
.social__link { position: relative; transition: color 0.3s ease-in-out, fill 0.3s ease-in-out, background-color 0.3s ease-in-out }
.github { transition: color 0.3s ease-in-out, fill 0.3s ease-in-out, background-color 0.3s ease-in-out }
.linkedin { transition: color 0.3s ease-in-out, fill 0.3s ease-in-out, background-color 0.3s ease-in-out }
```

### [Underline Hover](https://codepen.io/RicardoYare/pen/XWvpbBN)

made with: transition · :hover

```css
#words { position: relative }
#words::before { position: absolute; bottom: 0%; transition: all 0.7s }
```

### [Cards Highlight Hover Effect](https://codepen.io/freeplayg/pen/VwomzWj)

on hover of img.: article.: transform+opacity+top ×4, article.: transform+background+top, img.: opacity+top | made with: transition · :hover

```css
article { transition: transform .2s, background .2s, opacity .2s }
section:hover article { transform: translateY(6px); opacity: .5; transition: transform 1s, background .2s, opacity .2s }
section article:hover { transform: translateY(-6px); opacity: 1 }
article img { object-position: center; opacity: 0; transition: opacity .2s }
section article:hover img { opacity: 1 }
```

### [Arrow Hover Animation](https://codepen.io/GreenSock/pen/eYqBZMB)

on scroll: svg.[object: transform ×2 | on hover of button.: svg.[object: transform ×2 | made with: GSAP

```css
.content { position: relative }
.buttons { margin-bottom: 20px }
```

```js
gsap.to(arrows, {
addEventListener("mouseenter", () => t.restart())
```

### [button hover with direction](https://codepen.io/antoine-favereau/pen/abemgvK)

on hover of a.button: div.background-left: transform+top, div.background-right: transform | made with: transition · :hover

```css
span { position: relative }
&~.background-left { transform: scaleX(1) }
&~.background-right { transform: scaleX(1) }
```

### [Modern Button Border Hover Effect](https://codepen.io/SpectacledCoder/pen/ZEgpoZG)

made with: transition · :hover · mix-blend-mode

```css
.spectacledcoder-btn { mix-blend-mode: difference; transition: all 0.2s }
.spectacledcoder-btn .top { position: absolute }
.spectacledcoder-btn .top .rect { transition: all 0.5s }
.spectacledcoder-btn .bottom { position: absolute; margin-top: 40px }
.spectacledcoder-btn .bottom .rect { transition: all 0.5s }
.spectacledcoder-btn .left { position: absolute; margin-top: -5px }
.spectacledcoder-btn .left .rect { margin-top: 0px; transition: all 0.5s }
.spectacledcoder-btn .right { position: absolute; margin-top: -5px }
.spectacledcoder-btn .right .rect { margin-bottom: 0px; transition: all 0.5s }
.disclaimer { position: absolute; bottom: 0px }
```

### [Dock magnification (no JS)](https://codepen.io/cbolson/pen/jOgMaXz)

held: fixed nav.dock | made with: position: fixed · transition · :hover · :focus-visible · :has() · backdrop-filter

```css
.dock { position: fixed; bottom: 1rem }
.dock::before { position: absolute; bottom: 0; backdrop-filter: blur(var(--dock-blur)) }
.dock > button { transition: width 150ms linear, height 150ms linear, border-radius 150ms linear; position: relative }
.dock > button::before { position: absolute; bottom: 100%; translate: -50% -.75rem; opacity: var(--label-opacity,0); transform: translateY(var(--label-y,30px)); transition: transform 150ms cubic-bezier(0.47, 1.64, 0.41, 0.8), opacity 150ms ease- }
button:hover, button:focus-visible { --label-opacity: 1 }
h1 { margin-top: 10vh }
body::before { position: fixed; inset: 0 }
body::after { position: fixed; top: 1rem }
```

### [The Hidden Hover Effect](https://codepen.io/jonkab/pen/dyxXeoN)

on scroll: div.box: transform+background+top | made with: transition · :hover

```css
.box { transition: background-color 0.3s ease, transform 0.3s ease }
.box:hover { transform: scale(1.1) }
```

### [Javascript Modal open hover <a> link-href, close on click](https://codepen.io/EmanueleTinari/pen/dyxXyzY)

held: fixed div | on hover of a.ftn: div.modal: transform+top | made with: position: fixed · transition · :hover

```css
#modal-background { position: fixed; top: 0; opacity: 0; transition: opacity 0.15s ease-out, width 0s linear 0.15s, height 0s linear 0.15s }
#modal-background.visible { opacity: 1; transition: opacity 0.15s ease-out }
.modal { position: relative; top: 50%; transform: translateY(-50%) }
.close { transform: translate(-5px, -0px) }
```

```js
addEventListener("mouseenter", openModal)
```

### [waves](https://codepen.io/Philip-Walsh/pen/GRVZavK)

made with: transition · :hover

```css
.main { padding-bottom:10em }
.waves svg:nth-of-type(1) { margin-bottom:1.2em }
.waves svg:nth-of-type(2) { margin-bottom:.2em }
.waves svg { margin-top: auto; position: absolute; bottom:9.5em }
.socials span { transition: --fill-percent 0.6s ease-in-out }
.socials span:hover svg path, .socials .animated svg path { transition: fill 0.3s ease-in }
```

### [Vertical Slider with Tooltip and Dots](https://codepen.io/filipz/pen/MWNyPrO)

on scroll: div.dot: transform+opacity ×7, div.dot: transform+opacity+top ×3, span.tooltip: opacity | made with: transition · pointer / mouse tracking

```css
.slider { position: relative }
.slider__track { position: relative }
.dot-container { position: relative }
.dot { position: relative; transition: transform 0.3s ease, opacity 0.3s ease }
.dot::before, .dot::after { position: absolute; transform: translate(-50%, -50%) }
.dot::before { top: -15px }
.dot::after { top: 21px }
.tooltip { position: absolute; top: 50%; transform: translateY(-50%); opacity: 0; transition: opacity 0.2s ease, visibility 0.2s ease }
.tooltip::before { position: absolute; top: 50%; transform: translateY(-50%); border-top: 5px solid transparent; border-bottom: 5px solid transparent }
```

```js
addEventListener( "mousemove",
addEventListener("mouseleave", () => {
```

### [tiles hover effect](https://codepen.io/Philip-Walsh/pen/bGXpWgp)

on scroll: div.shape: transform+opacity+top ×27, div.shape: transform+opacity+shadow+top | made with: transition · :hover

```css
.shape { transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, box-shadow 0.3s ease; opacity: 0.9; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) }
.shape:hover { transform: scale(1.15); box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3) }
.hovered { transform: scale(1.1) }
.wave-effect { transform: scale(1.05) }
```

### [card hover effect](https://codepen.io/Philip-Walsh/pen/VwoajgW)

on hover of section.card: section.card: transform+filter+shadow+top ×4 | made with: transition · :hover · :has() · 3D (perspective / preserve-3d)

```css
body { perspective: 1000px }
body .card { transition: 0.2s ease-in-out; filter: brightness(0) }
body .card:hover, body .hovered { filter: brightness(1); transform: translateZ(200px); box-shadow: 0 0 20px var(--glow-color), 0 0 30px var(--glow-color) }
body .card:hover + *, body .hovered + * { filter: brightness(0.6); transform: translateZ(150px) rotateY(40deg); box-shadow: 0 0 10px var(--glow-color), 0 0 15px var(--glow-color) }
body .card:has(+ *:hover), body .card:has(+ .hovered) { filter: brightness(0.6); transform: translateZ(150px) rotateY(-40deg); box-shadow: 0 0 10px var(--glow-color), 0 0 15px var(--glow-color) }
body .card:hover + * + *, body .hovered + * + * { filter: brightness(0.4); transform: translateZ(70px) rotateY(20deg); box-shadow: 0 0 5px var(--glow-color), 0 0 7.5px var(--glow-color) }
body .card:has(+ * + *:hover), body .card:has(+ * + .hovered) { filter: brightness(0.4); transform: translateZ(70px) rotateY(-20deg); box-shadow: 0 0 5px var(--glow-color), 0 0 7.5px var(--glow-color) }
body .card:hover + * + * + *, body .hovered + * + * + * { filter: brightness(0.2); transform: translateZ(30px) rotateY(10deg); box-shadow: 0 0 2.5px var(--glow-color), 0 0 3.75px var(--glow-color) }
body .card:has(+ * + * + *:hover), body .card:has(+ * + * + .hovered) { filter: brightness(0.2); transform: translateZ(30px) rotateY(-20deg); box-shadow: 0 0 2.5px var(--glow-color), 0 0 3.75px var(--glow-color) }
```

### [Tech Icons](https://codepen.io/Ian-Fontanellaz/pen/eYqZYqN)

made with: transition · :hover

```css
.titulo { margin-bottom: 30px; margin-top: 80px; text-transform: uppercase }
.sub-titulo { margin-bottom: 30px; margin-top: 20px; text-transform: uppercase }
.tecnologia:hover { background-position: 100% 0; moz-transition: all 4s ease-in-out; -o-transition: all 4s ease-in-out; -webkit-transition: all 5s ease-in-out; transition: all 4s ease-in-out }
.tecnologia { margin-top: 25px; margin-bottom: 10px; moz-transition: all .4s ease-in-out; -o-transition: all .4s ease-in-out; -webkit-transition: all .4s ease-in-out; transition: all .4s ease-in-out }
.tecnologia:hover { background-position: 100% 0; moz-transition: all .4s ease-in-out; -o-transition: all .4s ease-in-out; -webkit-transition: all .4s ease-in-out; transition: all .4s ease-in-out }
.tecnologia.html { box-shadow: 0 4px 15px 0 #973911 }
.tecnologia.css { box-shadow: 0 4px 15px 0 #0f2791 }
.tecnologia.js { box-shadow: 0 4px 15px 0 #2e280a }
.tecnologia.php { box-shadow: 0 4px 15px 0 #1d248d }
.tecnologia.react { box-shadow: 0 4px 15px 0 #000733 }
.tecnologia.mysql { box-shadow: 0 4px 15px 0 #04435e }
.tecnologia.wordpress { box-shadow: 0 4px 15px 0 #173f52 }
```

### [Underline + hover](https://codepen.io/David-front/pen/gOVPQyK)

made with: transition · :hover

### [Glowing hover effect](https://codepen.io/David-front/pen/ZEgQmog)

made with: :hover · :has() · mask · custom properties driven by JS · pointer / mouse tracking

```css
p { opacity: 0.6 }
.grid { position: relative }
.card { position: relative }
.card::after { position: absolute; inset: -1px }
// .card:has(+ .card:hover)::before { // position: absolute; // inset: 0; // mask: radial-gradient(circle at var(--border-x, 0) var(--border-y, 0), white, transparent 20%) // }
```

```js
addEventListener("mousemove", (e) => {
style.setProperty("--x", e.x + "px")
style.setProperty("--y", e.y + "px")
style.setProperty("--glow-x", glowX + "px")
style.setProperty("--glow-y", glowY + "px")
style.setProperty("--border-x", borderX + "px")
style.setProperty("--border-y", borderY + "px")
```

### [Sliding hover effect](https://codepen.io/David-front/pen/jOgWQLQ)

made with: transition · :hover · :has()

```css
ul:before { position: absolute; inset: auto anchor(right) anchor(bottom) anchor(left); transition: .2s .2s }
ul li { position: relative }
ul li:before { position: absolute; inset: 100% -.15em 0; transition: .2s }
ul li:is(:hover,.active):before { top: 0; transition: .2s .4s }
ul:has(li:hover) li.active:not(:hover):before { inset: 100% -.15em 0; transition: .2s }
```

### [Parallax effect image moving](https://codepen.io/baahubali92/pen/QWejVNb)

on scroll: div.ps-lg-5: transform | on hover of img.w-100: div.ps-lg-5: transform+top | made with: nothing recognised — read the code

### [button hover test](https://codepen.io/RicardoYare/pen/VwovxzV)

made with: transition · :hover

```css
#cont { position: relative }
#gradiant { position: absolute; background-position: -420px; transition: 0.5s all; top: -10px }
#but { background-position: 350px; transition: 0.5s all }
#cont:hover #gradiant { background-position: 0px }
#cont:hover #but { background-position: 0px }
```

### [Animated Underlined Hover Glow](https://codepen.io/JetBoom/pen/JjgYEqO)

made with: transition · :hover

```css
&::after, &::before { position: absolute; top: 110%; transition: all 200ms }
&::before { opacity: 0.25 }
&::after { opacity: 0 }
&:hover::after { opacity: 1; box-shadow: 0px 0px 4px currentColor }
```

### [3D Animated Hover Card](https://codepen.io/morganmsrn/pen/PoMPqvE)

on scroll: div.: transform | on hover of img.: div.: transform | made with: @keyframes · transition · pointer / mouse tracking

```css
#card { transition: 0.1s ease-out; box-shadow: 10px 20px 20px rgba(0, 0, 0, 0.4); position: relative }
#gradient { opacity: 0.3; position: absolute; top: 0; animation: animateGradient 30s linear infinite }
0% { background-position: 0% 50% }
50% { background-position: 100% 50% }
100% { background-position: 0% 50% }
@keyframes animateGradient animates background-position
```

```js
addEventListener("mousemove", (e) => {
```

### [Header with language menu (flags)](https://codepen.io/r-w-c/pen/RwXNOBW)

held: sticky header.flex | on hover of a.: div.flex: opacity | made with: position: sticky · transition · :hover

```css
header { position: sticky; margin-bottom: 10px }
#flags:hover #otherFlags { opacity: 1; transition: opacity 0.75s linear }
#otherFlags { opacity: 0; transition: visibility 0s 0.75s, opacity 0.75s linear }
```

### [Retro Terminal Shuffle Hover Animation](https://codepen.io/bigapplemonkey/pen/zYgxMwZ)

made with: mix-blend-mode · GSAP

```css
body { text-transform: uppercase; position: relative }
.hover-effect { position: relative }
.hover-effect--cursor-square .char::after { position: absolute; opacity: var(--opa) }
.hover-effect--bg::after, .hover-effect--bg-south::after { position: absolute; top: 0; mix-blend-mode: overlay; transform: scaleX(var(--anim)) }
.hover-effect--bg-south::after { top: -8px; bottom: -8px; transform: scaleY(var(--anim)) }
```

```js
gsap.fromTo(
addEventListener("mouseenter", () => {
```

### [30個網頁動態提案 練習](https://codepen.io/dian1127/pen/rNXaLbp)

on hover of a.: a.: color, a.effect-1: color | made with: @keyframes · transition · :hover

```css
body { margin-top: 20px }
body a { transition: 0.5s; position: relative }
body a:before, body a:after { position: absolute; transition: 0.3s }
.effect-1:before { bottom: 0; transform: scale(0) }
.effect-1:hover:before { transform: scale(1) }
.effect-2:after { top: 3px }
.effect-3:after { top: 0% }
.effect-3:hover:after { top: 0 }
button { position: relative; margin-bottom: 20px; transition: 0.3s }
button:before, button:after { position: absolute; transition: 0.3s }
span, button { position: relative }
.btn1:before { top: 50% }
```

### [Jquery Hover Tabs](https://codepen.io/samsimite/pen/QWewbgz)

on hover of button.: div.box11: background | made with: :hover

```css
.box { position: absolute; top: 0; bottom: 0 }
.bottom { position: absolute; bottom: 0; border-top: solid 3px #000000 }
.box1, .box2, .box3, .box4, .box5, .box6, .box7, .box8, .box9, .box10 { background-position: center }
.top { position: absolute; top: 0; border-bottom: solid 3px #000000 }
.box11, .box12, .box13, .box14, .box15, .box16, .box17, .box18, .box19, .box20 { background-position: center }
.middle { position: absolute; top: calc(20vh + 3px); bottom: calc(20vh + 3px) }
.tabcontent { position: absolute; top: 0; bottom: 0 }
.title { position: absolute; top: 2vh }
.pop { position: absolute; top: 12vh }
.currency { position: absolute; top: 22vh }
.leader { position: absolute; top: 32vh }
.anthem { position: absolute; top: 42vh }
```

### [Navigation link bottom border](https://codepen.io/irvirty/pen/abeojKR)

made with: transition · :hover

```css
.linkH { text-underline-offset: 4px }
.linkH:hover { transition: 0.3s }
```

### [HoverEffect3D](https://codepen.io/faelpatrick/pen/OJeKedW)

on scroll: div.text: opacity+top ×5, div.all: transform+top, div.lefter: opacity+top, div.left: opacity+top, div.center: background+shadow+top, div.explainer: opacity+top | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.all { perspective: 10px; transform: perspective(300px) rotateX(20deg); will-change: perspective; transition: all 1.3s ease-out; filter: grayscale(0.5) }
.all:hover { perspective: 1000px; transition: all 1.3s ease-in; transform: perspective(10000px) rotateX(0deg) }
.all:hover .text { opacity: 1 }
.all:hover > div { opacity: 1 }
.all:hover .explainer { opacity: 0 }
.left, .center, .right, .lefter, .righter { box-shadow: 0 0 20px 5px rgba(1, 35, 82, 0.4); opacity: 0; transition: all 0.3s ease; position: relative; background-position: center center }
.left:hover, .center:hover, .right:hover, .lefter:hover, .righter:hover { box-shadow: 0 0 30px 10px rgba(1, 35, 82, 0.6) }
.text { transform: translateY(30px); opacity: 0; transition: all 0.3s ease; bottom: 0; position: absolute; will-change: transform }
.lefter { transform: translateX(-60px) translateZ(-50px) rotateY(-10deg) }
.left { transform: translateX(-30px) translateZ(-25px) rotateY(-5deg) }
.center { opacity: 1 }
.right { transform: translateX(30px) translateZ(-25px) rotateY(5deg) }
```

### [Invision card design](https://codepen.io/jmmolina/pen/gONVOmr)

on scroll: div.split-square: transform+top, img.: transform+top | made with: transition · :hover

```css
.split-square { transform: translate(48px, -48px) }
img { transform: scale(1.1) }
.split-square { position: absolute; bottom: -48px; will-change: transform; transition: transform 0.2s ease-in-out }
img { will-change: transform; transition: transform 0.2s ease-in-out }
.tag { text-transform: uppercase }
.author { text-transform: uppercase }
```

### [Cool Gradient Buttons with hover animation](https://codepen.io/Vojtch-Kotr/pen/yLddgjR)

on hover of a.buttons: a.buttons: transform | made with: transition · :hover

```css
.buttons { transition: all .4s ease-in-out !important; padding-bottom: 20px !important; padding-top: 20px !important; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important }
.buttons:hover { background-position: 100% 0 !important; transform: scale(1.05) !important; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important; transition: all .4s ease-in-out !important }
.buttonsKonv { transition: all .4s ease-in-out !important; padding-bottom: 20px !important; padding-top: 20px !important; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important }
.buttonsKonv:hover { background-position: 100% 0 !important; transform: scale(1.05) !important; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important; transition: all .4s ease-in-out !important }
```

### [Hoverable Dropdown](https://codepen.io/ankitvermaonline/pen/qBzGyWz)

on hover of button.dropbtn: button.dropbtn: background | made with: :hover

```css
.dropdown { position: relative }
.dropdown-content { position: absolute; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2) }
```

### [Efecto Hover](https://codepen.io/Vicente-Alcazar/pen/qBzGpdR)

made with: transition · :hover

```css
.container { position: relative }
.image-container { position: relative }
.info { position: absolute; top: 0; box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5); transition: right 0.5s ease }
p { margin-bottom: 10px }
```

### [Reveal Gif On Hover (buttery smooth)](https://codepen.io/aintyourcupoftea/pen/poXmvdj)

made with: transition · pointer / mouse tracking · requestAnimationFrame

```css
.container { position: relative }
.hover-target { position: relative }
#hoverImage { position: absolute; opacity: 0; transition: opacity 0.3s ease; bottom: 100%; transform: translateX(-50%) }
#hoverImage.visible { opacity: 1 }
```

```js
requestAnimationFrame(updatePosition)
addEventListener("mouseenter", showImage)
addEventListener("mouseleave", hideImage)
addEventListener("mousemove", moveImage)
```

### [Reveal Gif On Hover](https://codepen.io/aintyourcupoftea/pen/VwJOYmQ)

on scroll: img.: transform+top | on hover of img.: img.: transform+top | made with: pointer / mouse tracking

```css
#hoverImage { position: absolute; transform: translateX( -50% ) }
```

```js
addEventListener("mouseenter", (e) => {
addEventListener("mouseleave", () => {
addEventListener("mousemove", (e) => {
```

### [card news](https://codepen.io/chivornkang/pen/JjQVoWM)

on scroll: div.news-item: transform+background+shadow+top | on hover of button.button-click: div.news-item: transform+background+shadow+top ×2, button.button-click: shadow+top | made with: transition · :hover

```css
.news { box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1) }
.news-item { margin-bottom: 20px; transition: transform 0.3s, box-shadow 0.3s }
.news-item1 { margin-bottom: 20px; transition: transform 0.3s, box-shadow 0.3s }
.news-item2 { margin-bottom: 20px; transition: transform 0.3s, box-shadow 0.3s }
.news-item h3 { margin-bottom: 10px }
.news-item:hover { transform: translateY(-5px); box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2) }
.button-click { -webkit-box-shadow: 10px 10px 0px 3px rgba(0, 0, 0, 1); -moz-box-shadow: 10px 10px 0px 3px rgba(0, 0, 0, 1); box-shadow: 3px 4px 0px 3px rgba(0, 0, 0, 1); transition: ease all 0.5s }
.button-click:hover { -webkit-box-shadow: 10px 10px 0px 3px rgba(0, 0, 0, 1); -moz-box-shadow: 10px 10px 0px 3px rgba(0, 0, 0, 1); box-shadow: -3px -4px 0px 3px rgba(0, 0, 0, 1); transition: ease all 0.5s }
```

### [Illustration card](https://codepen.io/jmmolina/pen/dyBrvzQ)

on scroll: div.card: transform+shadow+top | made with: transition · :hover

```css
.container { position: relative }
&:active { box-shadow: 0 0 0 0 black; transform: translate(calc(-50% + var(--push)), calc(-50% + var(--push))) }
&:not(:active):hover { box-shadow: var(--push) var(--push) 0 0 black; transform: translate(calc(-50% + var(--push)), calc(-50% + var(--push))) }
.image { background-position: center }
.user-info { margin-top: 8px }
```

### [Spreading Cards](https://codepen.io/BetaNow/pen/XWLGKgX)

on scroll: div.card: transform+shadow+top ×4 | made with: transition · :hover

```css
.title { text-transform: uppercase }
.spread { position: relative }
.card { position: absolute; top: 0; transition: top 1s ease, left 1s ease, transform 1s ease, box-shadow 1s ease }
.spread:hover [data-symbol=diamond] { top: 5px; transform: rotate(-15deg) }
.spread:hover [data-symbol=heart] { top: 0; transform: rotate(-5deg) }
.spread:hover [data-symbol=club] { top: 0; transform: rotate(5deg) }
.spread:hover [data-symbol=spade] { top: 5px; transform: rotate(15deg) }
.spread:hover .card { box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) }
```

### [Card Hover with sibling effect](https://codepen.io/lksvn/pen/zYVepem)

on scroll: div.item: transform+filter+top ×5 | made with: transition · :hover · :has() · 3D (perspective / preserve-3d)

```css
.list { transform: perspective(1000px) }
.list .item { background-position: center center; box-shadow: 0 3px 10px 2px rgba(0, 0, 0, 0.4); transition: all 0.25s ease-in-out; filter: brightness(0.2) grayscale(1) }
.list .item:hover { filter: brightness(1) grayscale(0); transform: translateZ(120px) }
.list .item:hover + * { filter: brightness(0.5) grayscale(0.75); transform: translateZ(80px) rotateY(12deg) }
.list .item:hover + * + * { filter: brightness(0.5) grayscale(0.8); transform: translateZ(30px) rotateY(8deg) }
.list .item:has(+ *:hover) { filter: brightness(0.5) grayscale(0.75); transform: translateZ(80px) rotateY(-12deg) }
.list .item:has(+ * + *:hover) { filter: brightness(0.5) grayscale(0.8); transform: translateZ(30px) rotateY(-8deg) }
```

### [ImageProcessor.js: Interactive Event Handling](https://codepen.io/peterbenoit/pen/NWZoGYK)

held: fixed a.ui-badge | made with: nothing recognised — read the code

### [Button | Light Over Hover](https://codepen.io/marina-agliullina/pen/rNEoZvZ)

on scroll: button.custom-button: background | made with: transition · :hover · backdrop-filter

```css
.custom-button { position: relative; transition: all 0.3s ease; backdrop-filter: blur(4px) }
.custom-button::before { position: absolute; top: -18px; background-filter: blur(100px); opacity: 30%; transition: transform 0.3s ease }
.custom-button:hover::before { transform: translateY(2px) }
.custom-button:active { transform: scale(0.98) }
```

### [JS Random Color on Hover/Refresh](https://codepen.io/KieranCanter/pen/abgQRBd)

on hover of a.: i.fa-regular: opacity+color | made with: transition · :hover

```css
* { transition: all 0.25s ease }
.container { position: relative }
.container .icon-hover { position: relative }
.container .icon-hover a i { position: relative; opacity: 0.6 }
.container .icon-refresh { position: relative }
.container .icon-refresh a i { position: relative; opacity: 0.6 }
.container .icon-refresh a i:hover { opacity: 0.87 }
.container .icon-refresh a i:active { opacity: 0.6 }
.container h1 { position: relative; margin-top: 1rem }
```

### [ボタンホバーエフェクト](https://codepen.io/lensnote/pen/VwJEBGJ)

on hover of button.b01: button.b01: background+color | made with: @keyframes · transition · :hover

```css
section+section { margin-top:40px }
button { transition:.3s }
.b02:hover { box-shadow:inset 0 0 0 2em #777 }
.b03 { position:relative }
.b03::after { position:absolute; top:0; transform:translateX(-50%); transition:width .3s }
.b04:hover { box-shadow:inset -90px 0 0 0 #777, inset 90px 0 0 0 #777 }
.b05:hover { box-shadow:inset -140px 0 0 0 #777, inset 140px 0 0 0 #777 }
.b06:hover { box-shadow:0 .5em .5em -.4em #777; transform:translateY(-.25em) }
.b07 { box-shadow:0 .5em .5em -.4em #777; transform:translateY(-.25em) }
.b07:hover { box-shadow:none; transform:translateY(0) }
.b08 { box-shadow:.3em .3em 0 0 #555, inset .3em .3em 0 0 #555 }
.b08:hover { box-shadow:0 0 0 0 #777, inset 6em 3.5em 0 0 #777 }
```

### [New card, what do you think?](https://codepen.io/KieranCanter/pen/gONBvzZ)

on scroll: span.card: transform | on hover of span.card: span.card: transform | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
* { transition: all 0.25s ease }
.container { position: relative }
.scene { perspective: 30rem }
.card { position: relative; box-shadow: 0rem 0.1rem 0.4rem 0rem rgba(0, 0, 0, 0.3); transform: perspective(1000px) }
.card .phone { position: absolute; top: 0; margin-top: 1rem }
.card .logo { position: absolute; top: 0; margin-top: 1rem }
.card .logo a i { position: relative }
.card .title { position: absolute; top: 0; bottom: 0 }
.card .links { position: absolute; bottom: 0; margin-bottom: 1rem }
.card .links a i { position: relative }
```

### [card](https://codepen.io/chivornkang/pen/YzoJEpg)

on scroll: div.pricing-card: shadow | made with: transition · :hover

```css
.pricing-card { box-shadow: 12px 12px 5px 0000; transition: box-shadow 0.3s ease }
.pricing-card:hover { box-shadow: -12px -12px 5px 0000 }
.pricing-features li { margin-bottom: 10px }
.pricing-button { transition: background-color 0.3s ease }
```

### [Responsive CSS 3D Image Hover Effects](https://codepen.io/Mohamed_Abdulsalam/pen/mdZzrQB)

on hover of div.card: div.box: transform+top | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
section .card { position: relative; perspective: 1000px }
section .card .box { position: absolute; top: 0; transition: 1s ease; -webkit-transition: 1s ease; -moz-transition: 1s ease; -ms-transition: 1s ease; -o-transition: 1s ease }
section .card:hover .box { transform: rotateY(180deg); -webkit-transform: rotateY(180deg); -moz-transform: rotateY(180deg); -ms-transform: rotateY(180deg); -o-transform: rotateY(180deg) }
section .card .box .imgBx { position: absolute; top: 0 }
section .card .box .imgBx img { position: absolute; top: 0 }
section .card .box .contentBx { position: absolute; top: 0; transform: rotateY(180deg); -webkit-transform: rotateY(180deg); -moz-transform: rotateY(180deg); -ms-transform: rotateY(180deg); -o-transform: rotateY(180deg) }
section .card .box .contentBx div { transform: translateZ(100px); -webkit-transform: translateZ(100px); -moz-transform: translateZ(100px); -ms-transform: translateZ(100px); -o-transform: translateZ(100px) }
```

### [CSS Only 6 Simple Buttons Hover Effects](https://codepen.io/Mohamed_Abdulsalam/pen/vYqVXdx)

made with: transition · :hover

```css
a { position: relative; text-transform: uppercase; transition: 0.5s; -webkit-transition: 0.5s; -moz-transition: 0.5s; -ms-transition: 0.5s; -o-transition: 0.5s }
a::before { position: absolute; inset: 0 8px; transition: 1s; -webkit-transition: 1s; -moz-transition: 1s; -ms-transition: 1s; -o-transition: 1s }
a::after { position: absolute; inset: 8px 0; border-top: 2px solid #fff; border-bottom: 2px solid #fff; transition: 1s; -webkit-transition: 1s; -moz-transition: 1s; -ms-transition: 1s; -o-transition: 1s }
a.btn1:hover::before { inset: 16px 8px }
a.btn1:hover::after { inset: 8px 16px 8px }
a.btn2:hover::before { inset: 0px 8px; transform: rotateY(180deg); -webkit-transform: rotateY(180deg); -moz-transform: rotateY(180deg); -ms-transform: rotateY(180deg); -o-transform: rotateY(180deg) }
a.btn2:hover::after { inset: 8px 0px; transform: rotateX(180deg); -webkit-transform: rotateX(180deg); -moz-transform: rotateX(180deg); -ms-transform: rotateX(180deg); -o-transform: rotateX(180deg) }
a.btn3:hover::before { inset: 0px -12px; transform: skewY(15deg); -webkit-transform: skewY(15deg); -moz-transform: skewY(15deg); -ms-transform: skewY(15deg); -o-transform: skewY(15deg) }
a.btn3:hover::after { inset: -12px 0px; transform: skewX(15deg); -webkit-transform: skewX(15deg); -moz-transform: skewX(15deg); -ms-transform: skewX(15deg); -o-transform: skewX(15deg) }
a.btn4:hover::before { inset: 0px 30px; transform: skew(25deg); -webkit-transform: skew(25deg); -moz-transform: skew(25deg); -ms-transform: skew(25deg); -o-transform: skew(25deg) }
.btn4:hover::after { inset: 10px 0px; transform: skew(-25deg); -webkit-transform: skew(-25deg); -moz-transform: skew(-25deg); -ms-transform: skew(-25deg); -o-transform: skew(-25deg) }
a.btn5:hover::before, a.btn5:hover::after { inset: 0px }
```

### [Card list preview animation | CSS only](https://codepen.io/IrtezaAsad/pen/BagOewE)

held: fixed div.logo, fixed p | made with: position: fixed · transition · :hover · :has()

```css
body { transition: background-color 0.5s ease-in-out }
p, .logo { position: fixed; transform: translateX(-50%); transition: opacity 0.5s ease-in-out }
p { bottom: 30px }
.logo { top: calc(50% - 250px); opacity: 0 }
.list .item { transition: 0.5s; filter: brightness(0) }
.list .item:hover { filter: brightness(1); transform: scale(1.5) }
.list .item:hover + * { filter: brightness(0.6); transform: scale(1.3) rotateY(40deg) }
.list .item:has(+ *:hover) { filter: brightness(0.6); transform: scale(1.3) rotateY(-40deg) }
.list .item:hover + * + * { filter: brightness(0.4); transform: scale(1.1) rotateY(20deg) }
.list .item:has(+ * + *:hover) { filter: brightness(0.4); transform: scale(1.1) rotateY(-20deg) }
.list .item:hover + * + * + * { filter: brightness(0.2); transform: scale(1.05) rotateY(10deg) }
.list .item:has(+ * + * + *:hover) { filter: brightness(0.2); transform: scale(1.05) rotateY(-10deg) }
```

### [Untitled](https://codepen.io/KhanKakar/pen/MWMqxGV)

on scroll: div.square: transform, div.square-container: transform+top, img.boxshadow: shadow+top, h2.textshadow: shadow+top, h3.textshadow: shadow+top, div.square2: transform | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.square-flip { -webkit-perspective: 1000; -moz-perspective: 1000; -ms-perspective: 1000; perspective: 1000; -webkit-transform: perspective(1000px); -moz-transform: perspective(1000px); -ms-transform: perspective(1000px); transform: per }
.square { background-position:center center; -ms-transition: transform 0.60s cubic-bezier(.5,.3,.3,1); transition: transform 0.60s cubic-bezier(.5,.3,.3,1); -webkit-transition: transform 0.60s cubic-bezier(.5,.3,.3,1); position:ab }
.square-flip .square { -webkit-transform: rotateY(0deg); -moz-transform: rotateY(0deg); -o-transform: rotateY(0deg); -ms-transform: rotateY(0deg); transform: rotateY(0deg) }
.square-flip:hover .square { -webkit-transform: rotateY(-180deg); -moz-transform: rotateY(-180deg); -o-transform: rotateY(-180deg); -ms-transform: rotateY(-180deg); transform: rotateY(-180deg) }
.square2 { background-position:center center; -ms-transition: transform 0.60s cubic-bezier(.5,.3,.3,1); transition: transform 0.60s cubic-bezier(.5,.3,.3,1); -webkit-transition: transform 0.60s cubic-bezier(.5,.3,.3,1); position:ab }
.square-flip .square2 { -webkit-transform: rotateY(180deg); -moz-transform: rotateY(180deg); -o-transform: rotateY(180deg); -ms-transform: rotateY(180deg); transform: rotateY(180deg) }
.square-flip:hover .square2 { -webkit-transform: rotateY(0deg); -moz-transform: rotateY(0deg); -o-transform: rotateY(0deg); -ms-transform: rotateY(0deg); transform: rotateY(0deg) }
.square-container { position:relative; top:50%; -ms-transition: transform 0.60s cubic-bezier(.5,.3,.3,1); transition: transform 0.60s cubic-bezier(.5,.3,.3,1); -webkit-transition: transform 0.60s cubic-bezier(.5,.3,.3,1); -webkit-transform: }
.square-flip:hover .square-container { -webkit-transform: translateY(-50%) translateX(-650px) scale(.88); -ms-transform: translateY(-50%) translateX(-650px) scale(.88); transform: translateY(-50%) translateX(-650px) scale(.88) }
.square-container2 { position:relative; top:50%; -ms-transition: transform 0.60s cubic-bezier(.5,.3,.3,1); transition: transform 0.60s cubic-bezier(.5,.3,.3,1); -webkit-transition: transform 0.60s cubic-bezier(.5,.3,.3,1); -webkit-transform: }
.square-flip:hover .square-container2 { -webkit-transform: translateY(-50%) translateX(0px) translateZ(0px) scale(1); -ms-transform: translateY(-50%) translateX(0px) translateZ(0px) scale(1); transform: translateY(-50%) translateX(0px) translateZ(0px) scale(1) }
.flip-overlay { position:absolute; top:0 }
```

### [Variable Text Hover Effect](https://codepen.io/milind537/pen/wvLEjOQ)

held: fixed p | on scroll: span.: color ×5 | made with: position: fixed · transition · :hover · :has()

```css
span { text-transform: uppercase; transition: font-weight 0.25s, font-variation-settings 0.25s }
p { position: fixed; top: 1rem }
body { position: relative }
body::before { position: absolute; inset: 0; background-position: center; opacity: 5% }
```

### [CSS Directional Hover effect | left top right bottom hovers](https://codepen.io/prahalad-jake/pen/VwJGadV)

on hover of div.card: img.: transform+top, h3.: transform+opacity+top | made with: @keyframes · transition · :hover · :has()

```css
.holder { position: relative }
.left, .top, .right, .bottom { position: absolute }
.left span, .right span, .top span, .bottom span { position: absolute; opacity: 0.7 }
.left, .left span { top: 0 }
.right, .right span { top: 0 }
.top, .top span { top: -50px }
.bottom, .bottom span { top: 50px }
.left:before, .right:before, .top:before, .bottom:before { position: absolute; transform: rotate(45deg) translateX(29%); opacity: 0 }
.left:hover:before, .right:hover:before, .top:hover:before, .bottom:hover:before { transform: rotate(45deg) translateX(-38%) }
.bottom:hover span { top: -50px; animation: movefrombottom 0.25s }
.top:hover span { top: 50px; animation: movefromtop 0.25s }
.left:hover span { animation: movefromleft 0.25s }
```

### [Navigation menu with rotate on hover](https://codepen.io/cazbrunnen/pen/poXZZvW)

on hover of a.navigation-link: a.navigation-link: transform+color+top, div.navigation-text: color+top | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
.menu-container { position: relative }
.navigation-link { text-transform: uppercase; margin-bottom: 12px; transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) }
.navigation-link:hover, .navigation-link:focus { transform: rotate(3deg) }
.navigation-text { transform: translate3d(0px, 0%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg) }
```

### [3D Follow Hover Card](https://codepen.io/alexdulemba/pen/qBzKVPd)

made with: transition · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
body > .interactable { position: relative; transition: 0.12s ease transform, 0.44s ease width; transform: perspective(4000px) rotateX(0deg) rotateY(0deg) }
body > .interactable > img { transition: 0.44 ease width }
body > .interactable > p { position: absolute }
body > .interactable::before, body > .interactable::after { position: absolute }
body > .interactable::before { transform: translateZ(-50px); inset: -1em }
body > .interactable::after { transform: translateZ(-49px); inset: 0; filter: blur(12px) }
```

```js
addEventListener("mousemove", (event) => {
addEventListener("mouseleave", () => {
```

### [Expanding Text Animation on Hover (3 Different)](https://codepen.io/filipz/pen/qBzKadr)

on scroll: span.: clip-path | made with: transition · :hover · clip-path · GSAP

```css
.text-expand span { -webkit-clip-path: inset(0 100% 0 0); clip-path: inset(0 100% 0 0); transition: -webkit-clip-path 0.5s ease-in-out; transition: clip-path 0.5s ease-in-out; transition: clip-path 0.5s ease-in-out, -webkit-clip-path 0.5s e }
.text-expand:hover span { -webkit-clip-path: inset(0 0 0 0); clip-path: inset(0 0 0 0) }
```

```js
gsap.timeline({ paused: true, reversed: true })
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [Glitch effect animation](https://codepen.io/Rudransh-Kumar-the-reactor/pen/WNqJKwJ)

on scroll: span.danger-symbol: transform, button.: background+shadow | on hover of button.: span.danger-symbol: transform+top, button.: shadow | made with: @keyframes · transition · :hover

```css
body { animation: background-animation 10s infinite alternate }
#container { position: relative }
.glitch { position: relative; text-transform: uppercase; transition: transform 1s ease-in-out }
.glitch::before, .glitch::after { position: absolute; top: 0; opacity: 0.8 }
.glitch::before { animation: glitch-anim 2s infinite linear alternate-reverse }
.glitch::after { animation: glitch-anim2 1s infinite linear alternate-reverse }
#glitchButton { margin-top: 20px; position: relative; animation: button-glow 2s infinite alternate; transition: transform 0.5s ease-in-out }
from { box-shadow: 0 0 10px #ff4d4d, 0 0 20px #ff4d4d }
to { box-shadow: 0 0 20px #ff4d4d, 0 0 40px #ff4d4d }
#glitchButton:hover { box-shadow: 0 0 30px #ff3333, 0 0 50px #ff3333 }
.danger-symbol { position: relative; animation: danger-move 2s infinite alternate ease-in-out, danger-swing 1.5s infinite ease-in-out }
from { transform: translateY(-5px) }
```

### [Experimenting hover::after](https://codepen.io/danielgomes312/pen/abgGVyO)

made with: transition · :hover

```css
.column h2 { margin-bottom: 10px }
.column ul li { margin-bottom: 5px; position: relative }
.column ul li::after { position: absolute; bottom: 0; transition: width 0.3s ease, left 0.3s ease }
```

### [Circle mouse](https://codepen.io/Globy/pen/vYqjeoK)

held: fixed p.credit | on scroll: button.: transform+top, p.credit: transform+top, div.cursor: transform+top | on hover of button.: p.credit: transform+top | made with: position: fixed · @keyframes · transition · :hover · pointer / mouse tracking

```css
.cursor { position: absolute; transform: translate(-50%, -50%); transition: width 0.2s ease, height 0.2s ease }
button { transition: background-color 0.3s, transform 0.3s }
button:hover { transform: scale(1.05) }
p.credit { position: fixed; bottom: 2%; transition: transform 0.5s ease-in-out }
from { transform: rotate(0deg) }
to { transform: rotate(360deg) }
@keyframes rotate animates transform
```

```js
addEventListener('mousemove', (event) => {
```

### [Button Hover](https://codepen.io/Nitesh-Pawar/pen/zYVWVEv)

on scroll: div.btn-outter: transform+top, div.btn-inner: transform+background+top, button.button: background+color | made with: transition · :hover

```css
.btn-wrapp { position: relative }
.btn-outter { transform: skew(20deg, 15deg); transition: all ease-in-out 0.5s }
.btn-inner { transform: skew(0deg, 0deg); transition: all ease-in-out 0.5s }
.button { position: absolute; top: 50%; transform: translate(50%, -50%); text-transform: uppercase; transition: all; transition: all ease-in-out 0.8s }
.btn-wrapp:hover .btn-inner { transform: skew(-15deg, 0deg) }
.btn-wrapp:hover .btn-outter { transform: rotateX(45deg) }
```

### [Image Card Hover Info](https://codepen.io/KieranCanter/pen/poXaoxy)

on scroll: span.image-card: transform+shadow+top, div.unfocused-title: opacity+top, img.: transform+opacity+filter+top | made with: transition · :hover · backdrop-filter

```css
* { transition: all 0.25s ease }
.image-card { position: relative; box-shadow: 0 8px 8px -6px }
.image-card:hover { box-shadow: 0 8px 8px -2px; transform: translateY(-5px) }
.image-card:hover .unfocused-title { opacity: 0%; backdrop-filter: blur(0rem) }
.image-card:hover img { filter: blur(0.5rem) grayscale(50%); -webkit-filter: blur(0.5rem) grayscale(50%); -moz-filter: blur(0.5rem) grayscale(50%); transform: scale(1.05); opacity: 50% }
.image-card:active { opacity: 80% }
.image-card img { position: absolute; top: 0 }
.image-card .unfocused-title { position: absolute }
.image-card .unfocused-title h1 { backdrop-filter: blur(0.5rem); padding-top: 1rem; padding-bottom: 1rem }
.image-card .text-container { position: relative; backdrop-filter: blur(1rem) opacity(0%) }
.image-card .text-container .footer { position: relative; margin-top: auto }
.image-card .text-container .footer h4 { margin-top: auto; margin-bottom: auto }
```

### [CTA button](https://codepen.io/vincentscotto/pen/abgEQJW)

on hover of a.button: a.button: color | made with: transition · :hover

```css
.button { text-transform: uppercase; transition: all 200ms linear; background-position: 100% 50% }
.turquoise-border { background-position: 100% 50% }
.turquoise-border:hover { background-position: 0% 50% }
.turquoise-light { background-position: 100% 50% }
.turquoise-light:hover { background-position: 0% 50% }
```

### [A button that follows](https://codepen.io/Globy/pen/vYqpRMP)

held: fixed p.credit | on scroll: button.button: transform+background+top, p.credit: transform | made with: position: fixed · @keyframes · transition · :hover · GSAP

```css
.button { transition: background-color 0.3s ease }
p.credit { position: fixed; bottom: 2%; transition: transform 0.5s ease-in-out }
from { transform: rotate(0deg) }
to { transform: rotate(360deg) }
@keyframes rotate animates transform
```

```js
gsap.to(button, {
```

### [Fullscreen Button - Javascript](https://codepen.io/samsimite/pen/jOjYyvr)

on hover of button.butt1: button.butt1: background | made with: :hover

```css
.box { position: absolute; top: 0; bottom: 0 }
.butt1 { position: absolute; top: 100px }
.butt2 { position: absolute; top: 100px }
```

### [Hover Dropdown Menu](https://codepen.io/FingerGuns/pen/KKjZpOP)

on hover of button.: button.: background | made with: transition · :hover · backdrop-filter

### [Card Hover (CSS)](https://codepen.io/newreality/pen/gONXJrX)

on scroll: div.card: background, div.number: color | on hover of div.card: div.card: background ×2, div.number: color ×2 | made with: transition · :hover

```css
.card { transition: background-color 0.1s, color 0.5s }
.number { transition: all 0.3s }
.card:hover .number { padding-top: 16px }
```

### [Glow Cards](https://codepen.io/Christian-Seymour/pen/mdZMrrw)

made with: @keyframes · transition · :hover

```css
.card { position: relative; transition: 0.5s }
.card:after, .card:before { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: 0.5s; animation: rotate-glow 4s infinite linear; animation-play-state: paused; opacity: 0 }
.card:before { filter: blur(20px) }
.card:hover:after, .card:hover:before { animation-play-state: running; opacity: 1 }
@keyframes rotate-glow animates --rotation
```

### [Untitled](https://codepen.io/svarion1/pen/qBzjWBx)

held: fixed div.intro | on scroll: span.: opacity+top ×6, div.intro: transform+top, div.black-box: transform+top | made with: GSAP · ScrollTrigger

```css
.intro { position: relative }
.background-video { position: absolute; top: 0 }
.black-box { position: absolute; top: 20px }
.content-wrapper { position: relative }
.content-section { border-bottom: 1px solid #ccc }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to(".black-box", {
gsap.to(chars, {
ScrollTrigger.create({
```

### [Interactive Image Zoom Lens Effect](https://codepen.io/nmorajda/pen/wvLdgwd)

on hover of img.zoom: div.lens: opacity+top | made with: transition · pointer / mouse tracking

```css
.lens { position: absolute; box-shadow: 0 5px 10px -2px rgba(0, 0, 0, 0.3); opacity: 0; transition: opacity 0.2s }
```

```js
addEventListener('mousemove', (e) => {
addEventListener('mouseleave', () => {
```

### [line expand on hover](https://codepen.io/vincentscotto/pen/yLdbNbo)

made with: transition · :hover

```css
.box { position: relative }
.box .line { position: absolute; top: -1px }
.box .line:after { position: absolute; top: 1px; transition: all 0.5s ease-in-out; border-bottom: 4px solid red }
```

### [Opening Curtain Animation](https://codepen.io/yasmo-yasmoo/pen/gONmVrd)

on scroll: div.curtain-image: transform ×2, div.text: opacity ×2 | made with: transition · :hover

```css
.container { position: relative }
.curtain { position: relative }
.curtain-image { position: absolute; transition: all 2s ease }
.background-image { position: absolute; top: 0 }
.text { position: absolute; transition: opacity 1s ease; top: 50%; transform: translateY(-50%) }
.text.hidden { opacity: 0 }
.curtain:hover .curtain-left { transform: translateX(-100%) }
.curtain:hover .curtain-right { transform: translateX(100%) }
.curtain:hover .text { opacity: 0 }
.curtain:hover .text.hidden { opacity: 1 }
```

### [Register And Login Form](https://codepen.io/yasmo-yasmoo/pen/gONmJOV)

made with: transition · :hover

```css
.container { box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) }
.tabs { margin-bottom: 20px }
.tab-button { transition: color 0.3s }
.tab-button.active { border-bottom: 2px solid #FFFFFF }
form h2 { margin-bottom: 20px; border-bottom: 1px solid white }
form input { margin-bottom: 15px }
form input:focus { box-shadow: 0 0 5px rgba(0, 0, 0, 0.2) }
form button { transition: background-color 0.3s, color 0.3s }
form button:hover { box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4) }
```

### [テキストホバーエフェクト](https://codepen.io/lensnote/pen/ExBZJLo)

made with: transition · :hover

```css
.txt01 { position:relative; transition:color ease .1s }
.txt01::before, .txt01::after { bottom:0; position:absolute }
.txt01::before { transition:width ease .3s }
.txt01::after { transition:ease .3s }
.txt01:hover::after { transition:ease .2s }
.txt02 { position:relative; transition:.3s }
.txt02::after { bottom:0; position:absolute; transition:.2s; transform:translateX(-50%) }
.txt03 { position:relative; transition:.3s }
.txt03::after { bottom:0; position:absolute; transition:.2s }
.txt04 { background-position:bottom right; padding-bottom:3px; transition:background-size .3s }
.txt04:hover { background-position:bottom left }
.txt05 { background-position:bottom right; padding-bottom:3px; position:relative; transition:background-size ease .3s }
```

```js
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [Button3](https://codepen.io/Dhruvil-chauhan_CO_44/pen/RwzKerN)

on scroll: div.: shadow, h1.: color | made with: transition · :hover · backdrop-filter

```css
#b { position: relative; box-shadow: 0 0 35vh 1vh #df8d8d }
#b h1 { transition: 1s }
#overlay { top: -10vh; position: absolute; transform: rotate(-25deg); backdrop-filter: 100px; transition: 0.65s ease }
#b:hover { box-shadow: 0 0 35vh 5vh #FFF500 }
```

### [website template](https://codepen.io/Anshika-Yadav-the-encoder/pen/LYKxzap)

made with: transition · :hover

```css
.banner { background-position: center }
.bar ul li { position: relative }
.bar ul li a { text-transform: uppercase }
.bar ul li::after { position: absolute; bottom: -10px; transition: 0.5s }
.content { position: absolute; top: 50%; transform: translateY(-50%) }
.content h1 { margin-top: 80px }
button { position: relative; margin-top: 50px }
span { position: absolute; bottom: 0; transition: 0.3s }
```
