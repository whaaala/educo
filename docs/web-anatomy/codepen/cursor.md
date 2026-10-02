# CodePen · cursor — how each pen does it

377 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/cursor.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| pointer / mouse tracking | 298 |
| transition | 189 |
| position: fixed | 177 |
| requestAnimationFrame | 126 |
| :hover | 116 |
| @keyframes | 71 |
| mix-blend-mode | 68 |
| canvas 2D | 54 |
| GSAP | 51 |
| backdrop-filter | 36 |
| custom properties driven by JS | 36 |
| 3D (perspective / preserve-3d) | 16 |
| three.js / WebGL | 13 |
| prefers-reduced-motion | 12 |
| clip-path | 9 |
| Web Animations API (.animate) | 9 |
| :has() | 8 |
| scroll listener | 7 |
| (hover: hover) gate | 6 |
| :focus-visible | 4 |
| mask | 4 |
| Lenis / smooth scroll | 2 |
| IntersectionObserver | 1 |
| anime.js | 1 |
| view() timeline | 1 |
| position: sticky | 1 |

## Every pen

### [Text pressure](https://codepen.io/editor/hipuku/pen/01a0f2bd-3102-73ac-ac78-fe407b73b6c0)

on scroll: span.char: color ×8 | on hover of a.: span.char: color ×8 | made with: prefers-reduced-motion · pointer / mouse tracking · requestAnimationFrame

```css
.char { will-change: font-variation-settings, color }
.caption a { text-underline-offset: 0.2em }
```

```js
addEventListener("pointermove", (e) => {
requestAnimationFrame(frame)
```

### [Crosshair Cursor Effect](https://codepen.io/editor/getcoderipple/pen/01a0e6c9-b084-7cb2-ab7f-0495f968502c)

on scroll: span.cr-crosshair__hint-dot: transform+opacity | on hover of button.cr-crosshair__target: span.cr-crosshair__line: background+top ×4, span.cr-crosshair__coordinate: background+color+top ×2, button.cr-crosshair__target: transform+background+shadow+top, span.cr-crosshair__hint-dot: transform+opacity, div.cr-crosshair__cursor: transform+opacity+top, span.cr-crosshair__ring: transform+background+shadow+top | made with: @keyframes · transition · :hover · :focus-visible · prefers-reduced-motion · backdrop-filter · pointer / mouse tracking · requestAnimationFrame

```css
.cr-crosshair__panel { position: relative; box-shadow: 0 30px 80px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.04) }
.cr-crosshair__panel::before, .cr-crosshair__panel::after { position: absolute; filter: blur(90px); opacity: 0.14 }
.cr-crosshair__panel::before { top: -120px }
.cr-crosshair__panel::after { bottom: -130px }
.cr-crosshair__content { position: relative }
.cr-crosshair__eyebrow { margin-bottom: 18px }
.cr-crosshair__targets { margin-top: 44px }
.cr-crosshair__target { position: relative; transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease }
.cr-crosshair__target::before { position: absolute; inset: 0; opacity: 0; transition: opacity 180ms ease }
.cr-crosshair__target:hover, .cr-crosshair__target:focus-visible { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25), 0 0 24px rgba(34, 211, 238, 0.08) }
.cr-crosshair__target:hover::before, .cr-crosshair__target:focus-visible::before { opacity: 1 }
.cr-crosshair__target-icon { position: relative }
```

```js
requestAnimationFrame(updateCursor)
addEventListener("mouseenter", (event) => {
addEventListener("mousemove", (event) => {
addEventListener("mouseleave", () => {
addEventListener("mouseenter", () => {
```

### [Rope Cursor Trail - elastic SVG polyline](https://codepen.io/editor/akap0009/pen/01a0dc63-85da-7bc2-8c47-d90cd62fe16f)

held: fixed svg.[object | made with: position: fixed · pointer / mouse tracking · requestAnimationFrame

```css
.rope { position: fixed; inset: 0 }
```

```js
addEventListener('pointermove', function (e) { moveTo(e.clientX, e.clientY)
requestAnimationFrame(tick)
```

### [Multiplayer Cursor with Itty Sockets](https://codepen.io/editor/shshaw/pen/01a0b489-eb24-7949-84bb-3aa556d3ee31)

made with: transition · custom properties driven by JS · pointer / mouse tracking

```css
#map { position: relative; box-shadow: 0 10px 60px #0002 }
.cursor { position: absolute; top: 0; transform: translate(calc(var(--c-width) * -0.7), calc(var(--c-height) * -1)); translate: calc(var(--x, 0.5) * 100%) calc(var(--y, 0.5) * 100%); transition: translate 0.2s linear; filter: hue- }
```

```js
style.setProperty('--color', this.color)
style.setProperty('--x', x)
style.setProperty('--y', y)
addEventListener('pointermove', updateMeCursor)
```

### [Glitchy cursor](https://codepen.io/editor/shaynefortier/pen/01a0b03f-eab4-7cab-ab47-3e9bbfbdd9d4)

held: fixed div.glitch-cursor | made with: transition · (hover: hover) gate · prefers-reduced-motion

### [ASCII Cursor Trail (with options system)](https://codepen.io/editor/clapat/pen/01a0a532-2b86-78c0-9327-3ff52561ca32)

made with: mix-blend-mode · pointer / mouse tracking · requestAnimationFrame

```css
.trail-section { position: relative }
.trail-hint { text-transform: uppercase; mix-blend-mode: difference }
.trail-grid { position: absolute; inset: 0 }
.trail-cell { position: absolute }
```

```js
addEventListener('pointermove', function(event) {
requestAnimationFrame(tick)
```

### [Custom Cursor with Trailing Ring](https://codepen.io/AbdullahSajjad/pen/ZYeYZoY)

held: fixed div.cursor-dot, fixed div.cursor-ring | on scroll: div.cursor-dot: transform+top, div.cursor-ring: transform+top | on hover of a.: div.cursor-dot: transform+top, div.cursor-ring: transform+top | made with: position: fixed · transition · pointer / mouse tracking · requestAnimationFrame

```css
.demo-button { margin-top: 1rem }
.cursor-dot, .cursor-ring { position: fixed; top: 0 }
.cursor-ring { transition: width 0.2s ease, height 0.2s ease, margin 0.2s ease }
```

```js
addEventListener('mousemove', function (e) {
requestAnimationFrame(follow)
```

### [Mouse Velocity Effects - Speed Reactive Cursor & Particle Tutorial](https://codepen.io/editor/ash1198/pen/01a032fa-4279-71ad-8f61-9b798e4e0618)

held: fixed div.ambient, fixed div.ambient, fixed div.velocity-cursor, fixed div.velocity-cursor__glow, fixed div.velocity-cursor__ring, fixed div.velocity-cursor__dot, fixed canvas.page-particles | on hover of a.brand: div.velocity-cursor__glow: transform+top, div.velocity-cursor__ring: transform+top, div.velocity-cursor__dot: transform+top | made with: position: fixed · transition · :hover · prefers-reduced-motion · backdrop-filter · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
.velocity-cursor { position: fixed; inset: 0; opacity: 0 }
.velocity-cursor__dot, .velocity-cursor__ring, .velocity-cursor__glow { position: fixed; top: 0; will-change: transform }
.velocity-cursor__dot { box-shadow: 0 0 12px rgba(255, 255, 255, 0.8) }
.velocity-cursor__ring { box-shadow: 0 0 25px rgba(99, 234, 255, 0.07) }
.velocity-cursor__glow { opacity: 0.2; filter: blur(6px) }
.page-particles { position: fixed; inset: 0 }
.ambient { position: fixed; filter: blur(125px) }
.ambient--one { top: 90px }
.ambient--two { top: 750px }
.header { border-bottom: 1px solid rgba(255, 255, 255, 0.065) }
.brand__text small { margin-top: 2px; text-transform: uppercase }
.status { text-transform: uppercase }
```

```js
requestAnimationFrame(
addEventListener( "pointermove",
```

### [Elastic Cursor - Magnetic Morphing Pointer JavaScript Tutorial](https://codepen.io/editor/ash1198/pen/01a032e2-e0b3-7e1f-8287-0defc2ae8355)

held: fixed div.ambient, fixed div.ambient, fixed div.cursor, fixed div.cursor__ring, fixed div.cursor__dot | on hover of a.brand: div.cursor__ring: transform+background+shadow+top, div.cursor__dot: transform+top | made with: position: fixed · transition · :hover · prefers-reduced-motion · backdrop-filter · pointer / mouse tracking · requestAnimationFrame

```css
.cursor { position: fixed; inset: 0 }
.cursor__dot, .cursor__ring { position: fixed; top: 0; transform: translate(-50%, -50%); will-change: transform, width, height, border-radius }
.cursor__dot { box-shadow: 0 0 12px rgba(255, 255, 255, 0.7) }
.cursor__ring { backdrop-filter: blur(2px); box-shadow: 0 0 25px rgba(255, 156, 90, 0.06); transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.3s cubic-bezier(0.16, 1, 0.3, 1) }
.cursor.is-magnetic .cursor__ring { box-shadow: 0 0 30px rgba(255, 115, 174, 0.08) }
.ambient { position: fixed; filter: blur(120px) }
.ambient--one { top: 100px }
.ambient--two { top: 700px }
.header { border-bottom: 1px solid rgba(255, 255, 255, 0.065) }
.brand__text small { margin-top: 2px; text-transform: uppercase }
.nav { text-transform: uppercase }
.nav a { transition: color 0.2s ease }
```

```js
requestAnimationFrame(
addEventListener( "pointermove",
addEventListener( "mouseleave",
addEventListener( "mouseenter",
```

### [Cursor Trail Particle System - Mouse Velocity JavaScript Tutorial](https://codepen.io/editor/ash1198/pen/01a032af-3c35-76c6-9956-344059500088)

held: fixed div.page-glow, fixed div.page-glow, fixed canvas.particle-canvas | made with: position: fixed · transition · :hover · prefers-reduced-motion · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
.particle-canvas { position: fixed; inset: 0 }
.page-glow { position: fixed; filter: blur(120px) }
.page-glow--one { top: 120px }
.page-glow--two { top: 750px }
.header { position: relative; border-bottom: 1px solid rgba(255, 255, 255, 0.06) }
.brand__text small { margin-top: 2px; text-transform: uppercase }
.status { text-transform: uppercase }
.status__dot { box-shadow: 0 0 13px rgba(98, 231, 255, 0.8) }
.hero { position: relative }
.label, .section-heading__label, .formula__label { text-transform: uppercase }
.label { margin-bottom: 26px }
.hero p { margin-top: 32px }
```

```js
requestAnimationFrame(
addEventListener( "pointermove",
```

### [Magnetic Button Effect - Cursor Attraction JavaScript Tutorial](https://codepen.io/editor/ash1198/pen/01a032a3-ef0a-7520-971a-8c2ddc4bc1de)

held: fixed div.ambient, fixed div.ambient, fixed div.cursor-dot | on hover of a.brand: div.cursor-dot: opacity+top | made with: position: fixed · transition · :hover · prefers-reduced-motion · backdrop-filter · custom properties driven by JS · pointer / mouse tracking

```css
body::before { position: fixed; inset: 0 }
.ambient { position: fixed; filter: blur(100px) }
.ambient--one { top: 120px }
.ambient--two { top: 520px }
.header { border-bottom: 1px solid rgba(255, 255, 255, 0.06) }
.brand__text small { margin-top: 2px; text-transform: uppercase }
.status { text-transform: uppercase }
.status__dot { box-shadow: 0 0 0 4px rgba(201, 255, 97, 0.07), 0 0 14px rgba(201, 255, 97, 0.6) }
.hero__label, .section-heading__label, .formula__label { text-transform: uppercase }
.hero__label { margin-bottom: 26px }
.hero p { margin-top: 32px }
.hero__link { margin-top: 32px; transition: background 0.2s ease, border-color 0.2s ease }
```

```js
style.setProperty( "--button-x",
style.setProperty( "--button-y",
style.setProperty( "--content-x",
style.setProperty( "--content-y",
addEventListener( "pointermove",
addEventListener( "mouseleave",
```

### [Live cursor CSS only #2026 #wip](https://codepen.io/editor/DenDionigi/pen/01a0201c-cf81-7bef-85f6-297a39e9e9ca)

held: fixed div.page, fixed div.p, fixed div.l | made with: position: fixed · transition · :hover · :has() · mix-blend-mode

```css
.page { position:fixed; inset:0; mix-blend-mode: difference }
small { text-transform:uppercase; opacity:.5 }
.p { position:fixed; top:50%; transition: left var(--x) linear, top var(--y) linear; will-change:left,top }
.p>i { position:absolute }
.p>i:nth-child(-n+2) { bottom:0 }
.p>i:nth-child(n+3) { top:0 }
.p:has(>i:hover) { top:calc(var(--b) + var(--Y)) }
.p :is(u,b) { position:absolute }
.p>i:nth-child(-n+2) u { bottom:0 }
.p>i:nth-child(n+3) u { top:0 }
.l { position:fixed; top:anchor(center); transition: left .07s ease-out, top .07s ease-out; will-change:left,top }
.l:before { position:absolute; translate:-50% -50%; mix-blend-mode: difference }
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

### [Water - WebGL Shader](https://codepen.io/TaminoMartinius/pen/PwWBZYM)

held: fixed canvas, fixed div, fixed div.dg | on hover of li.folder: li.cr: background | made with: position: fixed · three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

```css
#c { position: fixed; inset: 0 }
#fail { position: fixed; inset: 0 }
```

```js
addEventListener("pointermove", e => {
requestAnimationFrame(frame)
```

### [Magnetic Cursor](https://codepen.io/mzorn/pen/bNgvBqZ)

made with: position: fixed · transition · :hover · prefers-reduced-motion · mix-blend-mode · pointer / mouse tracking · requestAnimationFrame

```css
.stage { position: relative }
.glow { position: absolute; inset: -20% 20% auto -10%; filter: blur(20px) }
.eyebrow { text-transform: uppercase; margin-bottom: 1rem }
.lede { margin-top: 1rem }
.btn { will-change: transform; transition: transform .25s cubic-bezier(.2,.8,.2,1), box-shadow .25s; box-shadow: 0 10px 30px rgba(124,140,255,.25) }
.btn.ghost { box-shadow: none }
.link { will-change: transform; transition: transform .25s cubic-bezier(.2,.8,.2,1), color .25s }
.dot { will-change: transform; transition: transform .25s cubic-bezier(.2,.8,.2,1), color .25s, border-color .25s }
.hint { opacity: .7 }
.cursor { position: fixed; top: 0; mix-blend-mode: difference }
.cursor-dot { position: fixed; top: 0; transform: translate(-50%, -50%) }
.cursor-ring { position: fixed; top: 0; transition: border-color .2s, background .2s }
```

```js
addEventListener('mousemove', (e) => {
requestAnimationFrame(tick)
addEventListener('mouseleave', () => cursor.style.opacity = '0')
addEventListener('mouseenter', () => cursor.style.opacity = '1')
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [CAP WARS WebGPU](https://codepen.io/OSINT619/pen/vEgZJxw)

held: fixed canvas, fixed div, fixed div.lil-gui, fixed div, fixed canvas, fixed canvas, fixed canvas, fixed canvas | made with: position: fixed · @keyframes · transition · :hover · three.js / WebGL · pointer / mouse tracking

```js
addEventListener('mousemove', (e) => {
```

### [Vertical Distortion on Cursor](https://codepen.io/editor/keif/pen/019ed82a-6e93-7750-93da-7da29479dc54)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```js
addEventListener("pointermove", e => {
requestAnimationFrame(draw)
```

### [Interactive SVG Kaleidoscope](https://codepen.io/avathiery/pen/gbLjLMV)

on scroll: g.[object: transform, g.[object: transform+top | on hover of a.: g.[object: transform, g.[object: transform+top | made with: transition · clip-path · pointer / mouse tracking · requestAnimationFrame

```css
.kaleido { box-shadow: 0 1px 0 rgba(0,0,0,0.04), 0 30px 60px -20px rgba(0,0,0,0.25), inset 0 0 40px rgba(0,0,0,0.08); position: relative }
#wedges { transition: transform 1.4s cubic-bezier(0.22, 1, 0.36, 1) }
#sourceShapes { transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) }
.caption-eyebrow { margin-bottom: 6px }
.caption-text a { border-bottom: 1px solid #0a0a0a; padding-bottom: 1px }
```

```js
addEventListener('pointermove', (e) => {
requestAnimationFrame(tick)
requestAnimationFrame(driftTick)
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

### [Hero GSAP Templates (Long Body Cursor)](https://codepen.io/OSINT619/pen/dPOmeZa)

held: fixed canvas, fixed canvas, fixed div.grain, fixed div | made with: position: fixed · transition · :hover · :has() · mix-blend-mode · GSAP · canvas 2D · pointer / mouse tracking · requestAnimationFrame

### [Skeleton Hero w/ Cursor Lookat - Three.js](https://codepen.io/OSINT619/pen/dPOzwJv)

held: fixed div, fixed div, fixed div.hero-image | made with: position: fixed · @keyframes · transition · mix-blend-mode · three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

### [Liquid Button](https://codepen.io/sunspedro/pen/XJNMEWL)

made with: transition · :hover · mix-blend-mode · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
body { margin-top: 20px }
.ink-canvas { position: absolute; inset: 0; filter: blur(var(--ink-blur)) contrast(var(--ink-contrast)); mix-blend-mode: difference }
```

```js
addEventListener('mouseenter', this._onEnter)
addEventListener('mouseleave', this._onLeave)
addEventListener('mousemove', this._onMove)
requestAnimationFrame(() => this._loop())
```

### [Laggy Cursor effect](https://codepen.io/nodws/pen/gbLmrpP)

held: sticky div.infobox, fixed div | on hover of a.anchor-link: a.anchor-link: color, span.w-3: opacity | made with: position: fixed · transition · :hover · mix-blend-mode · pointer / mouse tracking

```css
.anchor-link { position: relative; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) }
.anchor-link::after { position: absolute; bottom: -2px; transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) }
.infobox { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) }
.infobox:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) }
.toc a { transition: all 0.2s ease }
.section-heading { position: relative }
.section-heading::before { position: absolute; opacity: 0; transition: all 0.3s ease }
.section-heading:hover::before { opacity: 1 }
.flag { transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) }
.flag:hover { transform: scale(1.08) }
#custom-cursor { position: fixed; transform: translate(-50%, -50%); opacity: 1; mix-blend-mode: difference; transition:all 0.2s, transform .1s }
#custom-cursor.diamond { transform: translate(-50%, -50%) }
```

```js
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
addEventListener('mousemove', updateCursor)
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

### [Cursor](https://codepen.io/annu98/pen/wBoMaLW)

held: fixed div, fixed canvas, fixed div, fixed div.cor, fixed div.cor, fixed div.cor, fixed div.cor, fixed div, fixed div, fixed div.pills | on scroll: span.letter: transform ×5 | made with: position: fixed · transition · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
body { position:relative }
#gsvg { position:absolute }
#blobs { position:fixed; inset:0 }
.b { position:absolute; transform:translate(-50%,-50%); will-change:left,top,transform; transition:width .12s, height .12s }
#burst { position:fixed; inset:0 }
.cor { position:fixed; text-transform:uppercase }
.tl { top:28px }
.tr { top:28px }
.bl { bottom:28px }
.br { bottom:28px }
#speedbar { position:fixed; top:50%; transform:translateY(-50%) }
#speedfill { position:absolute; bottom:0; transition:height .08s linear, background .3s }
```

```js
addEventListener('mousemove', e => { mx = e.clientX
addEventListener('mouseleave', () => { mx = -500
requestAnimationFrame(loop)
```

### [NEON PLAYGROUND](https://codepen.io/gabezink17-cmd/pen/WbGmeyR)

made with: mix-blend-mode · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
#app { position: relative }
.ui { position: absolute; top: 20px; mix-blend-mode: difference }
p { opacity: 0.7 }
.hint { margin-top: 10px; opacity: 0.5 }
```

```js
addEventListener("mousemove", (e)=>{
requestAnimationFrame(animate)
```

### [JS Cursor Trail Particles · Canvas](https://codepen.io/Jiironimo/pen/vEXbVNP)

held: fixed div, fixed canvas | on scroll: div.: transform, p.hint: opacity | made with: position: fixed · @keyframes · transition · mix-blend-mode · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
#cursor { position: fixed; transform: translate(-50%, -50%); mix-blend-mode: difference; transition: transform 0.08s ease, width 0.2s ease, height 0.2s ease }
canvas { position: fixed; inset: 0 }
.content { position: relative; opacity: 0; animation: fadeIn 1.2s ease 0.5s forwards }
.label { text-transform: uppercase; margin-bottom: 1.2rem }
.big { text-transform: uppercase }
.big span { margin-top: 0.4em; text-transform: uppercase }
.hint { margin-top: 3rem; text-transform: uppercase; animation: pulse-hint 3s ease-in-out infinite 1.5s }
0%, 100% { opacity: 0.4 }
50% { opacity: 1 }
to { opacity: 1 }
@keyframes pulse-hint animates opacity
@keyframes fadeIn animates opacity
```

```js
addEventListener('mousemove', e => {
requestAnimationFrame(loop)
```

### [Cursor Flow](https://codepen.io/perror12/pen/JoRwZwg)

on scroll: div.trail: transform+opacity+top ×41, div.trail: transform+top ×20, div.spark: transform+opacity+top ×5 | made with: @keyframes · mix-blend-mode · custom properties driven by JS · pointer / mouse tracking · requestAnimationFrame

```css
.canvas-wrap { position: relative }
.cursor-glow, .cursor-core, .trail, .spark { position: absolute; transform: translate(-50%, -50%) }
.cursor-glow { filter: blur(10px); mix-blend-mode: screen }
.cursor-core { box-shadow: 0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(34,211,238,0.8), 0 0 40px rgba(34,211,238,0.4) }
.trail { filter: blur(2px); mix-blend-mode: screen; animation: fadeTrail linear forwards }
.spark { box-shadow: 0 0 10px rgba(103, 232, 249, 0.9); animation: sparkFly 800ms linear forwards }
.title { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.title h1 { text-transform: uppercase }
.title p { margin-top: 12px; text-transform: uppercase }
0% { opacity: 1; transform: translate(-50%, -50%) scale(1) }
100% { opacity: 0; transform: translate(-50%, -50%) scale(0.2) }
0% { opacity: 1; transform: translate(-50%, -50%) scale(1) }
```

```js
style.setProperty("--dx", dx)
style.setProperty("--dy", dy)
addEventListener("mousemove", (e) => {
requestAnimationFrame(animate)
```

### [Interactive Exploding and Imploding Orbs - Three.js](https://codepen.io/OSINT619/pen/ogzQEgr)

held: fixed div.labels, fixed div | made with: position: fixed · transition · three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

### [CSS/JS Spotlight Cards · Cursor Glow Effect](https://codepen.io/Jiironimo/pen/OPRBNXx)

held: fixed div.ambient-glow | on scroll: span.card-tag: color | on hover of div.card: span.card-tag: color ×2 | made with: position: fixed · @keyframes · transition · :hover · mask · custom properties driven by JS · pointer / mouse tracking

```css
body::before { position: fixed; inset: 0 }
.ambient-glow { position: fixed; transform: translate(-50%, -50%); transition: left 0.6s ease, top 0.6s ease }
header { position: relative; margin-bottom: 3.5rem; opacity: 0; animation: up 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s forwards }
.eyebrow { text-transform: uppercase; margin-bottom: 0.8rem }
.grid { position: relative; opacity: 0; animation: up 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s forwards }
.card { position: relative; transition: background 0.3s }
.card::before { position: absolute; inset: 0; opacity: 0; transition: opacity 0.4s ease }
.card:hover::before { opacity: 1 }
.card::after { position: absolute; inset: 0; opacity: 0; transition: opacity 0.4s ease; -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude }
.card:hover::after { opacity: 1 }
.card-content { position: relative }
.card-icon { margin-bottom: 1.4rem; transition: background 0.3s, border-color 0.3s }
```

```js
addEventListener('mousemove', e => {
style.setProperty('--mx', x + 'px')
style.setProperty('--my', y + 'px')
addEventListener('mouseleave', () => {
style.setProperty('--mx', '-200px')
style.setProperty('--my', '-200px')
```

### [Cursor Reverser - CodePen Opposite Directions Challenge](https://codepen.io/wpgmb/pen/dPpVaKp)

held: fixed div | on scroll: div.: transform+top | made with: position: fixed · pointer / mouse tracking · requestAnimationFrame

```css
body { position: relative }
.bg { position: absolute; inset: 0 }
#fakeCursor { position: fixed; top: 0; transform: translate3d(50vw, 50vh, 0); will-change: transform; filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.45)) }
```

```js
requestAnimationFrame(render)
addEventListener("mousemove", (e) => {
addEventListener("mouseleave", () => {
```

### [mouse-animations Custom Image Cursor](https://codepen.io/tgomilar/pen/zxKEaoQ)

held: fixed div.orb, fixed div.orb, fixed div, fixed div.__ma-img | on scroll: span.badge: background+color+top ×8, div.: transform | made with: position: fixed · transition · :hover · backdrop-filter

```css
.orb { position: fixed; filter: blur(100px); opacity: 0.25 }
.o1 { top: -80px }
.o2 { bottom: 60px }
.pill { text-transform: uppercase }
.label { text-transform: uppercase }
.zone { transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s; position: relative }
.zone::before { position: absolute; inset: 0; opacity: 0; transition: opacity 0.4s }
.zone:hover { transform: translateY(-4px) }
.zone-star:hover { box-shadow: 0 0 30px rgba(124, 106, 247, 0.15) }
.zone-star:hover::before { opacity: 1 }
.zone-gem:hover { box-shadow: 0 0 30px rgba(34, 211, 238, 0.15) }
.zone-gem:hover::before { opacity: 1 }
```

```js
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
```

### [Cursor Shader](https://codepen.io/Md-Mosabbir-Hossain-Khan/pen/azmWrBm)

made with: three.js / WebGL

### [Tentacle Cursor](https://codepen.io/annu98/pen/vEXmeLd)

held: fixed canvas, fixed div, fixed div | made with: position: fixed · @keyframes · transition · :hover · mix-blend-mode · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
#c { position: fixed; inset: 0 }
.page { position: relative }
.page::before { position: absolute; inset: 0 }
.page::after { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.hint { position: absolute; top: 32px; transform: translateX(-50%); text-transform: uppercase }
.eyebrow { text-transform: uppercase; margin-bottom: 22px; position: relative }
h1 { position: relative; margin-bottom: 28px }
.sub { position: relative; margin-bottom: 44px }
.pill-row { position: relative }
.pill { text-transform: uppercase; transition: border-color 0.3s, color 0.3s }
.click-ripple { position: fixed; transform: translate(-50%, -50%) scale(0); animation: ripple-out 0.6s ease-out forwards }
to { transform: translate(-50%, -50%) scale(1); opacity: 0 }
```

```js
addEventListener('mousemove', e => {
addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'))
addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'))
requestAnimationFrame(loop)
```

### [mouse-animations — Showcase](https://codepen.io/tgomilar/pen/myrWzzg)

held: fixed div.grid, fixed div.blob, fixed div.blob, fixed div.blob, fixed div.__ma-img | on hover of div.effect-card: div.effect-card: background, div.__ma-img: transform+top | made with: position: fixed · @keyframes · transition · :hover · mix-blend-mode · 3D (perspective / preserve-3d)

```css
body::before { position: fixed; inset: 0 }
.grid { position: fixed; inset: 0; opacity: 0.3 }
.blob { position: fixed; filter: blur(80px); opacity: 0.12 }
.blob-1 { top: -100px }
.blob-2 { bottom: -80px }
.blob-3 { top: 40% }
.wrapper { position: relative }
header { margin-bottom: 4rem }
.pkg-badge { text-transform: uppercase; margin-bottom: 1.5rem }
.pkg-badge::before { animation: blink 1.8s infinite }
0%, 100% { opacity: 1 }
50% { opacity: 0.2 }
```

### [mouse-animations Trail and Custom Cursor](https://codepen.io/tgomilar/pen/wBzJYMO)

held: fixed div.grid-bg, fixed div.glow, fixed canvas, fixed div.__ma-cursor-dot, fixed div.__ma-cursor-ring | on hover of div.cards: div.card: transform+top | made with: position: fixed · @keyframes · transition · :hover

```css
.grid-bg { position: fixed; inset: 0; opacity: 0.4 }
.glow { position: fixed; top: 50%; transform: translate(-50%, -50%) }
.scene { position: relative }
.cards { margin-top: 1rem }
.card { transition: border-color 0.3s, transform 0.3s }
.card:hover { transform: translateY(-3px) }
.card-label { text-transform: uppercase }
.hint { bottom: 2rem }
.hint::before { animation: pulse 1.5s infinite }
0%, 100% { opacity: 1; transform: scale(1) }
50% { opacity: 0.4; transform: scale(0.6) }
@keyframes pulse animates opacity, transform
```

### [The Sims Game Plumbob 3D Spin Animation - Motherlode Cheat Code Motion Design](https://codepen.io/Margarita-the-solid/pen/LERbOMR)

held: fixed svg.[object, fixed div.ghost, fixed div.pt, fixed div.pt, fixed div.pt | on scroll: div.halo: transform+opacity+top ×2, div.pt: transform+opacity+color+top ×2, div.gem-wrap: transform+top, svg.[object: filter+top, em.: transform+opacity+color+top, span.dot: transform+opacity | on hover of a.sub-btn: div.pt: transform+opacity+color+top ×4, div.halo: transform+opacity+top ×2, div.gem-wrap: transform+top, svg.[object: filter+top, em.: transform+opacity+color+top, a.sub-btn: background+color | made with: position: fixed · @keyframes · transition · :hover · 3D (perspective / preserve-3d) · custom properties driven by JS · pointer / mouse tracking · requestAnimationFrame

```css
body::before { position: fixed; inset: 0 }
#cur { position: fixed; transform: translate(-50%, -50%); transition: opacity 0.15s }
.ghost { position: fixed; opacity: 0.022; top: 50%; transform: translate(-50%, -50%) }
.stage { position: relative }
.gem-wrap { position: relative; animation: bob 3.6s ease-in-out infinite }
0%, 100% { transform: translateY(0px) }
50% { transform: translateY(-20px) }
.halo { position: absolute; top: 50% }
.h1 { transform: translate(-50%, -50%); animation: halo 2.6s ease-in-out infinite }
.h2 { transform: translate(-50%, -50%); animation: halo 2.6s ease-in-out infinite 0.7s }
0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1) }
50% { opacity: 0.1; transform: translate(-50%, -50%) scale(1.12) }
```

```js
addEventListener("mousemove", (e) => {
requestAnimationFrame(render)
style.setProperty("--d", d + "s")
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

### [Custom cursor with mix-blend-mode](https://codepen.io/thevasya/pen/QwKjRGJ)

held: fixed div.custom-cursor | on hover of button.button: button.button: background, div.custom-cursor: transform+top | made with: position: fixed · transition · :hover · mix-blend-mode · custom properties driven by JS · pointer / mouse tracking

```css
:root { --cursor-scale: 1; --transition: 0.15s ease-in; --fancy-transition: 0.25s cubic-bezier(0.78, 0, 0.22, 1) }
.uppercase { text-transform: uppercase }
.button { transition: background-color var(--transition) }
.image-container img { transition: transform var(--transition) }
.image-container a { position: relative }
.image-container p { position: absolute; bottom: 0; transition: color var(--transition); mix-blend-mode: difference }
.image-container a:hover img, .image-container a:active img { transform: scale(1.2) }
.custom-cursor { position: fixed; top: var(--cursor-y); mix-blend-mode: difference; transform: translate(-50%, -50%) scale(var(--cursor-scale)); transition: transform var(--fancy-transition), border-width var(--transition) }
```

```js
addEventListener('mousemove', (e) => {
style.setProperty('--cursor-x', `${e.clientX}px`)
style.setProperty('--cursor-y', `${e.clientY}px`)
style.setProperty('--cursor-scale', cursorScale)
style.setProperty('--cursor-scale', 0)
```

### [Custom Cursor with Blood Drop Effect](https://codepen.io/dream-state/pen/GgjpeKw)

made with: position: fixed · pointer / mouse tracking

```css
.blood-drop { position: fixed; will-change: transform, opacity }
```

```js
addEventListener('mousemove', function(e) {
```

### [AETHER — Kinetic Geometry & Neural Distortion Cursor](https://codepen.io/Dharuneyyyyyy/pen/ogzjejK)

held: fixed div.fixed | on scroll: div.bracket: transform+top ×2, div.fixed: transform+top | made with: GSAP · pointer / mouse tracking

### [color under cursor](https://codepen.io/TikiHead/pen/WbGvxbw)

made with: canvas 2D · pointer / mouse tracking

```js
addEventListener('mousemove', function(event) {
addEventListener('mouseleave', function(event) {
```

### [Cursor State](https://codepen.io/Jadersweeper/pen/XJjJGoo)

on scroll: div.stage: background | made with: transition · :hover · backdrop-filter

```css
.glass-container { backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3) }
p { opacity: 0.7; margin-bottom: 25px }
.controls { margin-bottom: 20px }
.stage { margin-top: 20px; transition: background 0.2s, transform 0.1s }
.stage:active { transform: scale(0.98) }
.status { margin-top: 25px }
```

### [Cursor Follower & Mouse Out](https://codepen.io/GreenSock/pen/YPGKMoO)

made with: GSAP · pointer / mouse tracking

```css
.follower { opacity: 0 }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseleave", () => {
gsap.to(follower, {
```

### [Pure CSS Effects Showcase · glitch / aurora / glass / scramble](https://codepen.io/Margarita-the-solid/pen/ByzgBxm)

held: fixed div, fixed div, fixed div.aurora, fixed div.noise | on scroll: div.aurora-blob: transform+top ×3, div.card: transform+opacity+top ×3 | on hover of div.cards-grid: div.aurora-blob: transform+top ×3, div.marquee-track: transform | made with: position: fixed · @keyframes · transition · :hover · :has() · clip-path · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d) · GSAP · canvas 2D · IntersectionObserver · pointer / mouse tracking · requestAnimationFrame

```css
#cursor-dot { position: fixed; top: 0; transform: translate(-50%, -50%); transition: transform 0.1s, width 0.2s, height 0.2s, background 0.2s; mix-blend-mode: exclusion }
#cursor-ring { position: fixed; top: 0; transform: translate(-50%, -50%); transition: transform 0.12s cubic-bezier(0.23, 1, 0.32, 1), width 0.3s, height 0.3s, border-color 0.3s }
.aurora { position: fixed; inset: 0 }
.aurora-blob { position: absolute; filter: blur(80px); opacity: 0.18; animation: aurora-drift 16s ease-in-out infinite alternate }
.aurora-blob:nth-child(1) { top: -20%; animation-duration: 14s }
.aurora-blob:nth-child(2) { top: 20%; animation-duration: 18s; animation-delay: -6s }
.aurora-blob:nth-child(3) { bottom: -10%; animation-duration: 20s; animation-delay: -3s }
0% { transform: translate(0, 0) scale(1) }
33% { transform: translate(6vw, -4vh) scale(1.08) }
66% { transform: translate(-4vw, 5vh) scale(0.95) }
100% { transform: translate(3vw, 2vh) scale(1.05) }
.noise { position: fixed; inset: 0; opacity: 0.045 }
```

```js
addEventListener("mousemove", (e) => {
requestAnimationFrame(lerpRing)
addEventListener("mouseleave", () => {
addEventListener("mouseenter", () => {
requestAnimationFrame(drawSpotlight)
new IntersectionObserver(
requestAnimationFrame(tick)
```

### [target cursor 🖱️](https://codepen.io/stazie/pen/zxBjZRM)

held: fixed span.corner, fixed span.corner, fixed span.corner, fixed span.corner, fixed span.center-dot | on scroll: span.center-dot: transform+background+shadow+top, span.dot-text: transform+opacity+top | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · pointer / mouse tracking

```css
.card { backdrop-filter: blur(10px) }
.center-dot { position: fixed; transform: translate(-50%, -50%); transition: background 0.3s ease, box-shadow 0.3s ease, border 0.3s ease, backdrop-filter 0.3s ease }
.center-dot.locked { box-shadow: 0 10px 40px rgba(0, 247, 231, 0.15); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); animation: dot-morph 0.42s cubic-bezier(.22,.61,.36,1) forwards }
0% { box-shadow: 0 0 12px rgba(0,247,231,0.9) }
30% { box-shadow: 0 0 22px rgba(0,247,231,0.6) }
65% { box-shadow: 0 8px 30px rgba(0, 247, 231, 0.25) }
100% { box-shadow: 0 12px 40px rgba(0, 247, 231, 0.18) }
.corner { position: fixed }
.locked .corner { transition: all 0.3s cubic-bezier(.2,.8,.2,1) }
.tl { border-top: 2px solid #F3A5D8 }
.tr { border-top: 2px solid #F3A5D8 }
.bl { border-bottom: 2px solid #F3A5D8 }
```

```js
addEventListener("mousemove", (e) => {
```

### [Dragon Cursor](https://codepen.io/Umair-zia-the-vuer/pen/ogLjJrm)

made with: pointer / mouse tracking · requestAnimationFrame

```css
body, html { position: absolute }
svg { position: absolute; filter: sepia(100%) }
```

```js
addEventListener( "pointermove",
requestAnimationFrame(run)
```

### [Untitled](https://codepen.io/Justin-Tharp/pen/OPXyEjW)

made with: @keyframes · transition · :hover · 3D (perspective / preserve-3d) · requestAnimationFrame

```css
.browsehappy { position: absolute; top: 20% }
abbr[title] { border-bottom: 1px dotted }
sub, sup { position: relative }
sup { top: -0.5em }
sub { bottom: -0.25em }
button, select { text-transform: none }
[id=center] { position: absolute; top: 50% }
[id=container] { padding-top: 200px }
[id=container] { padding-top: 40px }
[id=container] .sonic-wrapper { top: 280px }
[id=container] { padding-top: 0; margin-top: -40px }
[id=container] .sonic-wrapper { top: 200px }
```

```js
requestAnimationFrame( loop, element )
```

### [GreenSock Tutorial - Mouse Follow (Exact Cursor + Orb)Untitled](https://codepen.io/ash1198/pen/myEepob)

held: fixed div.orb, fixed div.modal, fixed div.cursor | on scroll: article.card: transform, article.card: transform+shadow+top, div.cursor: transform+top, span.cursorRing: transform+background+top | on hover of article.card: div.cursor: transform+top | made with: position: fixed · transition · :hover · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d) · GSAP · pointer / mouse tracking

```css
.top p { margin-top: 10px }
.stage { position: relative }
.grid { position:relative }
.card { box-shadow: 0 18px 40px rgba(10,10,20,.08); transform: translateZ(0); will-change: transform; transition: box-shadow .2s ease, border-color .2s ease }
.card:hover { box-shadow: 0 26px 70px rgba(99,102,241,.14) }
.card p { margin-top: 10px }
.link { margin-top: 12px; transition: transform .15s ease, background .15s ease, border-color .15s ease }
.link:hover { transform: translateY(-1px) }
.orb { position: fixed; opacity: .95; mix-blend-mode: multiply; will-change: transform; transform: translate(-50%, -50%) }
.cursor { position: fixed; top: 0 }
.cursorRing { position:absolute; transform: translate(-50%, -50%); transition: transform .18s ease, border-color .18s ease, background .18s ease }
.cursorDot { position:absolute; transform: translate(-50%, -50%) }
```

```js
addEventListener("mousemove", (e) => {
gsap.to(orb, {
gsap.to()</code> with a duration of 0.65 seconds and "power3.out" easing, which creates that satisfying trailing effect. The orb
gsap.fromTo('.modalContent',
gsap.to('.modalContent', {
addEventListener("mouseenter", () => cursor.classList.add("hover"))
addEventListener("mouseleave", () => cursor.classList.remove("hover"))
gsap.to(card, {
```

### [Spotlight Cursor Text Screen (Reveal on Hover)](https://codepen.io/ash1198/pen/zxBvpJR)

held: fixed div.fxCursor | on scroll: div.blob: transform+top ×3, div.fxCursor: transform+top | made with: position: fixed · mix-blend-mode · GSAP · pointer / mouse tracking

```css
.blobStage { position: relative }
.blob { position: absolute; top: 0; will-change: transform; filter: saturate(1.04) }
.screenInk { position: absolute; inset: 0; mix-blend-mode: screen }
h1 { text-transform: lowercase }
.fxCursor { position: fixed; box-shadow: 0 14px 32px rgba(13,18,128,0.22); will-change: transform }
```

```js
addEventListener("mousemove", (e) => {
gsap.to(".blob", {
addEventListener("mouseleave", () => {
```

### [Neon Flux Cursor](https://codepen.io/perror12/pen/gbMpXVy)

held: fixed canvas | made with: position: fixed · three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

```css
#webgl { position: fixed; inset: 0 }
```

```js
addEventListener('mousemove', (e) => {
requestAnimationFrame(animate)
```

### [Cursor effect](https://codepen.io/Liubomyr-Ulytskyi/pen/ByzyjBo)

held: fixed div.cursor, fixed svg.[object, fixed div.cursor-dot | on scroll: span.: transform+color+top ×9, span.: transform ×8, div.cube: transform+opacity+top ×6, span.: transform+top ×3, div.cube: transform+top | on hover of button.btn-text: span.: transform ×9, span.: transform+top ×6, span.: transform+color+top ×6, div.cube: transform+opacity+top | made with: position: fixed · transition · :hover · :focus-visible · :has() · mix-blend-mode · custom properties driven by JS · GSAP · pointer / mouse tracking · requestAnimationFrame

```css
body { transition: background-color 900ms ease, color 900ms ease }
.app { position: relative }
.cubes { position: absolute; inset: var(--pad); transition: color var(--cubeThemeMs) ease }
.cube { position: absolute; mix-blend-mode: exclusion; will-change: opacity, transform, background-color; transition: opacity 350ms ease, transform 350ms ease, background-color var(--cubeThemeMs) ease }
.cube.is-dying { opacity: 0; transform: scale(0.85) }
.cursor { position: fixed; inset: 0% auto auto 0%; opacity: 0; text-transform: lowercase; transition: opacity 0.2s ease }
body:has([data-cursor]:hover):not(.cursor-line-mode) .cursor { opacity: 1 }
body.cursor-line-mode .cursor { opacity: 0 !important }
.cursor-trail { position: fixed; inset: 0 }
.cursor-trail path { opacity: 0 }
.cursor-dot { position: fixed; top: 0; opacity: 0; margin-top: -2.5px; transition: opacity 0.2s ease }
body.cursor-line-mode .cursor-dot { opacity: 1 }
```

```js
style.setProperty("--bg", bg)
style.setProperty("--fg", fg)
style.setProperty("--cubeThemeMs", `${ms}ms`)
requestAnimationFrame(tickLineTrail)
addEventListener("pointermove", (e) => {
requestAnimationFrame(onMoveRaf)
addEventListener("mousemove", (e) => {
addEventListener("mouseenter", () => {
```

### [WebGPU Particle Cursor](https://codepen.io/vuolter/pen/dPXbOKm)

made with: pointer / mouse tracking

```js
addEventListener("pointermove", this._onPointerHandler, {
```

### [CSS ( mainly ) Mouse Effects w/ Filters](https://codepen.io/Woods369/pen/zxqyGKO)

made with: position: fixed · transition · :hover · mask · backdrop-filter · custom properties driven by JS · pointer / mouse tracking

```css
:root { --cursor-click-filter: blur(0) invert(1); --reflection-opacity: 0.3 }
&::before, &::after { position: absolute; transform: translateX(-50%) }
&::before { top: 50%; transform: translate(-50%, -50%) }
&::after { top: calc(50% + var(--text-size) - 30px); transform: translate(-50%, -50%) scaleY(-1); opacity: var(--reflection-opacity); mask-image: linear-gradient( to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.3) 100% ); -webkit-m }
html::before, html::after { position: fixed; opacity: 0; transform: translate(-50%, -50%); top: var(--cursor-y, -9999px) }
html::before { transition: width 0.3s, height 0.3s, backdrop-filter 0.3s, opacity 0.3s; backdrop-filter: var(--cursor-blur); -webkit-backdrop-filter: var(--cursor-blur) }
html::after { transition: transform 0.3s, opacity 0.3s }
html:hover::before { opacity: 1 }
html:active::before { backdrop-filter: var(--cursor-click-filter); -webkit-backdrop-filter: var(--cursor-click-filter) }
html:active::after { opacity: 0.5; transform: translate(-50%, -50%) scale(1.5) }
```

```js
style.setProperty('--cursor-x', `${e.clientX}px`)
style.setProperty('--cursor-y', `${e.clientY}px`)
addEventListener('mousemove', updateCursorPosition)
```

### [Neon Cursor](https://codepen.io/jayramoliya/pen/xbVpKbx)

held: fixed canvas | made with: position: fixed

```css
#app h1 { text-transform: uppercase }
#app a { margin-top: 10px }
#app canvas { position: fixed; top: 0 }
```

### [Tubes Cursor](https://codepen.io/jayramoliya/pen/emZeqob)

held: fixed canvas | made with: position: fixed · requestAnimationFrame

```css
#app { position: relative }
#canvas { position: fixed; top: 0 }
.hero { position: relative }
h1 { text-transform: uppercase }
h2 { text-transform: uppercase }
h3 { opacity: 0.9 }
```

```js
requestAnimationFrame(rainbowLoop)
```

### [console-style input (with block cursor)](https://codepen.io/joao-m-santos-the-bashful/pen/vEGyRPa)

made with: @keyframes · :focus-visible

```css
.console { box-shadow: 0.25rem 0.25rem 0 0 var(--sign-color) }
.console__textbox { position: relative }
.console__cursor { animation: blink 1.2s step-end infinite; opacity: 0; position: absolute; top: 2px }
@keyframes blink animates display
```

### [Motion MouseFollow-004 | magnetic hover — lerp](https://codepen.io/atibonibon/pen/azNOeJN)

on scroll: div.magnetic: transform+top | made with: backdrop-filter · pointer / mouse tracking · requestAnimationFrame

```css
.magnetic { will-change: transform }
.magnetic.primary { box-shadow: 0 8px 40px rgba(21, 38, 50, 0.13) }
.magnetic.ghost { backdrop-filter: blur(8px) }
```

```js
addEventListener('mousemove', (e) => {
addEventListener('mouseleave', () => {
requestAnimationFrame(animate)
```

### [Motion MouseFollow-004 | magnetic hover — gsap](https://codepen.io/atibonibon/pen/zxqGgZv)

on scroll: div.magnetic: transform+top | made with: backdrop-filter · GSAP · pointer / mouse tracking

```css
.magnetic { will-change: transform }
.magnetic.primary { box-shadow: 0 8px 40px rgba(21, 38, 50, 0.13) }
.magnetic.ghost { backdrop-filter: blur(8px) }
```

```js
addEventListener('mousemove', (e) => {
gsap.to(el, {
addEventListener('mouseleave', () => {
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

### [Motion MouseFollow-013 | cursor text distortion — SVG filter turbulence](https://codepen.io/atibonibon/pen/xbZoWwr)

made with: transition · pointer / mouse tracking · requestAnimationFrame

```css
.distortion-section { position: relative }
.distorted-text { text-transform: uppercase; transition: filter 0.2s ease }
```

```js
requestAnimationFrame(animate)
addEventListener('mousemove', (e) => {
addEventListener('mouseleave', () => {
```

### [Motion MouseFollow-012 | cursor image reveal — blend-mode spotlight](https://codepen.io/atibonibon/pen/zxrVWYo)

on scroll: div.spotlight: opacity | made with: transition · mix-blend-mode · pointer / mouse tracking · requestAnimationFrame

```css
.spotlight-section { position: relative }
.bg { position: absolute; inset: 0; filter: brightness(0.4) contrast(1.2) }
.spotlight { position: absolute; inset: 0; mix-blend-mode: screen; opacity: 0.8; transition: opacity 0.3s ease }
.text { position: relative; top: 50%; transform: translateY(-50%) }
.text p { opacity: 0.7 }
```

```js
requestAnimationFrame(animate)
addEventListener('mousemove', (e) => {
addEventListener('mouseleave', () => {
```

### [Make the cursor happy 😍](https://codepen.io/BlogFire/pen/gbPJNrE)

on hover of button.: button.: transform+background+shadow+top | made with: :hover · custom properties driven by JS · pointer / mouse tracking

```css
button { position: absolute; top: var(--mouse-y); box-shadow: 0px 0px 15px #0000; transform: rotate(35deg) }
button:hover { box-shadow: 0px 0px 15px 10px gold; transform: rotate(0deg) }
```

```js
addEventListener("mousemove", (e) => {
style.setProperty("--mouse-x", e.clientX - 45 + "px")
style.setProperty("--mouse-y", e.clientY - 80 + "px")
```

### [Tron-Style Glowing Cursor Trail](https://codepen.io/codypearce/pen/YPwbQPJ)

on scroll: button.color-btn: transform+shadow+top ×3 | on hover of button.color-btn: button.color-btn: transform+shadow+top | made with: transition · :hover · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
body { position: relative }
.demo-canvas { position: relative }
#grid-canvas { position: absolute; top: 0 }
.title-overlay { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.title-overlay p { text-transform: uppercase }
#color-picker { position: absolute; top: 2rem }
.color-btn { transition: all 0.3s ease }
.color-btn[data-color="cyan"] { box-shadow: 0 0 10px #00ffff }
.color-btn[data-color="orange"] { box-shadow: 0 0 10px #ff6b1a }
.color-btn[data-color="pink"] { box-shadow: 0 0 10px #ff00ff }
.color-btn[data-color="green"] { box-shadow: 0 0 10px #00ff00 }
.color-btn[data-color="purple"] { box-shadow: 0 0 10px #9d00ff }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseleave", () => {
requestAnimationFrame(animate)
```

### [cursor-types](https://codepen.io/htmlhuggiu/pen/wBMNJNb)

made with: 3D (perspective / preserve-3d)

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

### [Motion MouseFollow-002 | smooth follow — lerp()](https://codepen.io/atibonibon/pen/MYKPKjp)

held: fixed div.custom-cursor | on scroll: div.custom-cursor: transform+top | made with: position: fixed · pointer / mouse tracking · requestAnimationFrame

```css
.custom-cursor { position: fixed; top: -50px }
```

```js
addEventListener('mousemove', e => {
requestAnimationFrame(animate)
```

### [Dots Following Cursor](https://codepen.io/OuterVale/pen/NPxLjqX)

made with: canvas 2D · requestAnimationFrame

```js
requestAnimationFrame(draw)
```

### [Rocket cursor](https://codepen.io/telecasteren/pen/qEbpmov)

made with: pointer / mouse tracking

```css
.rocketCursor { transform: translate(-50%, -50%); rotate: -30deg }
```

```js
addEventListener("mousemove", moveCursor)
```

### [Saturation Cursor](https://codepen.io/OuterVale/pen/EaPbWmv)

held: fixed div.flashlight | made with: position: fixed · mix-blend-mode · pointer / mouse tracking

```css
img { filter: brightness(0.1) saturate(0.1) sepia(0.1) }
.flashlight { position: fixed; mix-blend-mode: saturation; transform: translate(-50%, -50%) }
```

```js
addEventListener("mousemove", (e) => {
```

### [Cool Cursor Follow with Shape Falling by Flash Web](https://codepen.io/Flash-Web/pen/MYKvRym)

made with: pointer / mouse tracking · Web Animations API (.animate)

```css
.shape { position: absolute }
```

```js
addEventListener('mousemove', (e) => {
addEventListener('mouseleave', () => {
.animate([
```

### [Minimalist custom cursor](https://codepen.io/polymathdigital/pen/LEGjzNE)

held: fixed canvas | on scroll: canvas.: opacity | made with: position: fixed · transition · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
#custom-cursor { position: fixed; inset: 0; transition: opacity 500ms ease-in-out }
```

```js
addEventListener("mousemove", (e) => {
requestAnimationFrame(animate)
addEventListener("mouseenter", () => {
```

### [Halloween Countdown Landing Page 🎃](https://codepen.io/bato-web-agency/pen/KwVmOOG)

held: fixed div.preview | on scroll: div.spider: transform+top ×5, div.eye: transform+top ×2 | on hover of img.: div.spider: transform+top ×5, div.eye: transform ×2 | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · custom properties driven by JS · pointer / mouse tracking · requestAnimationFrame

```css
.preview { position: fixed; inset: 0 }
.preview img { -o-object-position: center; object-position: center }
body { position: relative }
.spiders { position: absolute; top: 0 }
.spider { position: absolute; -webkit-animation: spider-jump 1.5s ease-in-out infinite alternate; animation: spider-jump 1.5s ease-in-out infinite alternate }
.spider img { margin-top: -0.625rem }
.header { position: absolute; top: 0 }
.button { transition: background-color 0.4s ease, color 0.4s ease }
.main { position: relative }
.main::before { position: absolute; top: -300px; filter: blur(250px); -webkit-animation: gradient 10s ease-in-out infinite; animation: gradient 10s ease-in-out infinite }
.main::after { position: absolute; bottom: 0 }
h1 span { opacity: 0; transform: translateY(-20px) rotate(-10deg); -webkit-animation: letter-reveal 0.2s forwards; animation: letter-reveal 0.2s forwards }
```

```js
addEventListener("mousemove", (event) => {
requestAnimationFrame(animate)
style.setProperty("--spider-line-height", heights[i] + "px")
```

### [3D Parallax Cursor – Interactive Tilt & Mouse Effects in React](https://codepen.io/Rebecca-Gilbert/pen/YPwXKGr)

held: fixed div | on scroll: div.: transform+top | made with: transition · 3D (perspective / preserve-3d) · pointer / mouse tracking

```js
addEventListener("mousemove", handleMove)
```

### [Blob Cursor – Smooth Lagging Mouse Effect in React](https://codepen.io/Rebecca-Gilbert/pen/NPxqKqE)

held: fixed div | made with: pointer / mouse tracking · requestAnimationFrame

```js
addEventListener("mousemove", handleMove)
requestAnimationFrame(animate)
```

### [Interactive Magnetic Cursor – React Cursor Effects Demo](https://codepen.io/Rebecca-Gilbert/pen/emJmqaq)

held: fixed div | on hover of button.: div.: transform+top | made with: transition · pointer / mouse tracking

```js
addEventListener("mousemove", handleMove)
```

### [Interactive Mouse Trail with React – Configurable Cursor Animation](https://codepen.io/Rebecca-Gilbert/pen/KwVwOMo)

on scroll: div.: opacity+background+top, div.: background+top | made with: transition · pointer / mouse tracking

```js
addEventListener("mousemove", handleMove)
```

### [Fondo particulas brillantes, cursor y estela](https://codepen.io/Sofia-Naruto/pen/dPYEGKr)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```js
addEventListener("mousemove", e => { mouse.x = e.clientX
requestAnimationFrame(animate)
```

### [Cursor cuadrado de linea arcoiris](https://codepen.io/Sofia-Naruto/pen/YPybwZB)

held: fixed div.ring | made with: position: fixed · pointer / mouse tracking · anime.js

```css
.ring { position: fixed; transform: translate(-50%, -50%) }
```

```js
addEventListener("mousemove", e=>{
```

### [Arrow Following Cursor](https://codepen.io/kaushalpahilwani/pen/EaVGaJP)

held: fixed div.cursor-arrow-container, fixed div.control-panel | on hover of button.toggle-btn: path.[object: opacity+top, path.[object: opacity, button.toggle-btn: background | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · scroll listener · pointer / mouse tracking · requestAnimationFrame

```css
.cursor-arrow-container { position: fixed; top: 0 }
.cursor-arrow-svg { position: absolute; top: 0 }
.cursor-arrow-path { opacity: 0; filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3)); transition: opacity 0.3s ease }
.cursor-arrow-head { opacity: 0; filter: drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.4)); transition: opacity 0.3s ease }
.target-button { transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3) }
.target-button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4) }
```

```js
addEventListener( "mousemove",
addEventListener( "scroll",
requestAnimationFrame(() => this.animate())
```

### [Emoji as Mouse Cursor!](https://codepen.io/0x04/pen/VYvxxXO)

made with: nothing recognised — read the code

### [WebGL Rainbow Behind Glass Reflection](https://codepen.io/sijad/pen/zxvWaOX)

held: fixed div | made with: position: fixed · pointer / mouse tracking · requestAnimationFrame

```css
[data-app-container] { position: fixed; top: 0 }
```

```js
requestAnimationFrame(update)
addEventListener( "pointermove",
addEventListener("pointermove", onMouseMove)
requestAnimationFrame(manualMouseMove)
```

### [Rainbow Mouse Animation Effect (WebGL)](https://codepen.io/sijad/pen/XJmZLgg)

held: fixed div | made with: position: fixed · pointer / mouse tracking · requestAnimationFrame

```css
[data-app-container] { position: fixed; top: 0 }
```

```js
addEventListener( "pointermove",
addEventListener("pointermove", onMouseMove)
requestAnimationFrame(update)
requestAnimationFrame(manualMouseMove)
```

### [Reptile Interactive Cursor](https://codepen.io/WhiteHatDesigner/pen/VYvbxed)

held: fixed a | on hover of a.: a.: transform+shadow+top | made with: position: fixed · transition · backdrop-filter · canvas 2D · pointer / mouse tracking

```js
addEventListener("mousemove", function (event) {
```

### [Cursor Move Effect](https://codepen.io/vstefanova/pen/yyYVpbj)

made with: nothing recognised — read the code

### [Mousewheel Changes Cursor - Javascript](https://codepen.io/samsimite/pen/NPGrVdV)

made with: nothing recognised — read the code

```css
.box { position: absolute; top: 0; bottom: 0 }
```

```js
addEventListener('wheel', function (event) {
```

### [Particle-Based Circle Animation Following Cursor](https://codepen.io/Bhanuweb/pen/ogjLOdz)

on scroll: span.box: transform+top ×35 | made with: custom properties driven by JS · GSAP · pointer / mouse tracking

```css
.cursor { position: relative }
.cursor .box { position: absolute; top: -50px; box-shadow: 0 0 15px #00ff9a, 0 0 50px #00ff9a }
```

```js
style.setProperty('--i', i+1)
addEventListener("mousemove", (e) => {
gsap.to(".box", {
```

### [Emoji Follows Your Cursor](https://codepen.io/codewithhooria/pen/ZYbQYGY)

held: fixed div | made with: position: fixed

```css
#emoji { position: fixed }
```

### [threejs ❍ Collection of Glowing Noise Cursor Effects N°1](https://codepen.io/filipz/pen/pvjjogQ)

held: fixed div, fixed div.title-grid-container, fixed div.corner-label, fixed div.corner-label, fixed div.corner-label, fixed div.corner-label, fixed div.corner-label, fixed div.corner-label | made with: position: fixed · three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

```css
#fluid-grid-container { position: fixed; top: 0 }
.effect-container { position: relative }
.effect-container canvas { position: absolute; top: 0 }
.corner-label { position: fixed; text-transform: uppercase }
.top-left { top: 10px }
.top-center { top: 10px; transform: translateX(-50%) }
.top-right { top: 10px }
.bottom-left { bottom: 10px }
.bottom-center { bottom: 10px; transform: translateX(-50%) }
.bottom-right { bottom: 10px }
.title-grid-container { position: fixed; top: 0 }
```

```js
addEventListener("mousemove", onMouseMove)
addEventListener("mouseenter", onMouseEnter)
addEventListener("mouseleave", onMouseLeave)
requestAnimationFrame(animate)
```

### [Blurry red cursor](https://codepen.io/Vojtch-Kotr/pen/MYwLwLL)

held: fixed div.hero-blob, fixed div.cursor-dot | on scroll: div.hero-blob: transform+top, div.cursor-dot: transform+top | made with: position: fixed · transition · (hover: hover) gate · custom properties driven by JS · pointer / mouse tracking

```css
.hero-blob { --blob-dist-scale:1; --blob-opacity:1; position:fixed; top:0; filter:blur(10px); transform:translate(-50%,-50%) scale(var(--blob-dist-scale)); opacity:var(--blob-opacity); transition:transform .1s ease-out,opacity .2s ea }
.cursor-dot { --dot-opacity:1; position:fixed; top:0; transform:translate(-50%,-50%); opacity:var(--dot-opacity); transition:transform .05s ease-out,background .3s ease,opacity .2s ease }
.hero-blob--hidden { --blob-opacity:0 }
.cursor-dot--hidden { --dot-opacity:0 }
```

```js
style.setProperty("--blob-dist-scale", `${1 + dist / 1200}`)
addEventListener("mousemove", move)
```

### [Blob in the box - cursor reactive animation](https://codepen.io/Vojtch-Kotr/pen/myJvJGR)

made with: @keyframes · transition · mix-blend-mode · custom properties driven by JS · pointer / mouse tracking · requestAnimationFrame

```css
.section-hero { position:relative }
.grass-blob { animation:gradLR 12s ease-in-out infinite alternate; transform:translate(var(--blob-tx,-4%),var(--blob-ty,-4%)) scale(var(--blob-size)); transition:border-radius .25s ease-out,transform .25s ease-out; filter:blur(10px);  }
0% { background-position:0% 50% }
100% { background-position:100% 50% }
@keyframes gradLR animates background-position
```

```js
addEventListener('pointermove', e => {
style.setProperty('--blob-tx', `${(relX - .5) * 8}%`)
style.setProperty('--blob-ty', `${(relY - .5) * 8}%`)
requestAnimationFrame(animate)
```

### [3D Custom Cursor with Text Preview](https://codepen.io/devmmhs/pen/xbGmvEY)

held: fixed div.custom-cursor | on scroll: div.custom-cursor: transform+background+top | made with: position: fixed · transition · pointer / mouse tracking · requestAnimationFrame

```css
.custom-cursor { position: fixed; top: 0; transform: translate(-50%, -50%) scale(1); transition: background-color 0.3s, color 0.3s, font-size 0.3s, width 0.3s, height 0.3s, transform 0.15s ease-in-out; box-shadow: 0 5px 15px rgba(0, 0, 0 }
```

```js
addEventListener("mousemove", (e) => {
requestAnimationFrame(animateCursor)
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
```

### [gsap ❍ Hero Section with Advanced Image Cursor Trail Effects](https://codepen.io/filipz/pen/yyNGpmv)

held: fixed header | made with: position: fixed · @keyframes · transition · :hover · clip-path · mix-blend-mode · GSAP · scroll listener · pointer / mouse tracking · requestAnimationFrame

```css
body::after { position: fixed; top: 0; opacity: 0.05; mix-blend-mode: screen }
header { position: fixed; top: 0 }
.logo-container { position: relative }
.logo-circles { position: relative }
.circle { position: absolute; transition: transform 0.3s ease; top: 50% }
.circle-1 { transform: translate(0, -50%) }
.circle-2 { transform: translate(0, -50%); mix-blend-mode: exclusion }
.logo-container:hover .circle-1 { transform: translate(-0.5rem, -50%) }
.logo-container:hover .circle-2 { transform: translate(0.5rem, -50%) }
header a { position: relative; text-transform: uppercase; opacity: 0.7; transition: color 0.3s ease }
header a::after { position: absolute; top: 0; transition: width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) }
header a:hover { mix-blend-mode: difference; opacity: 1 }
```

```js
gsap.timeline()
requestAnimationFrame(() => {
addEventListener("mousemove", (e) => {
addEventListener( "scroll",
requestAnimationFrame(animate)
```

### [Pointing arrow towards button](https://codepen.io/sohrabzia/pen/wBaQaBp)

held: fixed div | on scroll: button.target-btn: background, div.: transform+top, svg.[object: transform+top | on hover of button.target-btn: button.target-btn: background ×2, svg.[object: transform+top | made with: position: fixed · transition · :hover · pointer / mouse tracking

```css
button.target-btn { text-transform: uppercase; box-shadow: 0 0 10px #00d0ff66; transition: background-color 0.2s ease }
#custom-cursor { position: fixed; top: 0; transform: translate(-50%, -50%); transition: width 0.15s ease, height 0.15s ease, background-color 0.15s ease }
#arrow { transition: transform 0.1s linear }
```

```js
addEventListener("mousemove", (e) => {
```

### [UCD Animation Concept 2](https://codepen.io/moh-mmth/pen/ogXaoya)

made with: prefers-reduced-motion · GSAP · pointer / mouse tracking

```js
addEventListener("mousemove", this.setMouseCoords.bind(this))
gsap.to(line, {
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

### [Cursor Comet](https://codepen.io/EmiliRaeder/pen/LEVBobj)

made with: position: fixed · mix-blend-mode · GSAP · pointer / mouse tracking · requestAnimationFrame

```css
.Cursor { position: fixed; mix-blend-mode: difference; top: 0; filter: url("#goo") }
.Cursor span { position: absolute; transform: translate(-50%, -50%) }
```

```js
requestAnimationFrame(render)
addEventListener("mousemove", onMouseMove)
```

### [Smoking Cursor](https://codepen.io/jsabutis/pen/MYwXbYy)

held: fixed canvas | made with: position: fixed · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
#smokeCanvas { position: fixed; top: 0 }
```

```js
addEventListener('mousemove', (e) => {
addEventListener('mouseleave', () => {
requestAnimationFrame(animate)
```

### [Amoeba Osmosis](https://codepen.io/jsabutis/pen/ogXyzRp)

held: fixed div, fixed div | made with: position: fixed · @keyframes

```css
#canvas-container { position: fixed; top: 0 }
#instructions { position: fixed; bottom: 20px; transform: translateX(-50%) }
#instructions p { animation: fadeIn 2s ease-out }
from { opacity: 0 }
to { opacity: 0.3 }
@keyframes fadeIn animates opacity
```

### [Etch A Sketch](https://codepen.io/jsabutis/pen/EajRgGZ)

held: fixed div, fixed div | on scroll: canvas.: shadow | made with: position: fixed · @keyframes · transition · canvas 2D · pointer / mouse tracking

```css
body { position: relative }
#etchCanvas { position: absolute; top: 0 }
#instructions { position: fixed; bottom: 20px; transition: opacity 0.3s ease }
#instructions.hidden { opacity: 0 }
#glitch-overlay { position: fixed; top: 0; opacity: 0 }
#glitch-overlay.active { animation: glitch 0.1s linear }
0%, 100% { opacity: 0 }
50% { opacity: 0.03 }
0%, 100% { box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05) }
50% { box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.08) }
#etchCanvas { animation: subtlePulse 4s ease-in-out infinite }
@keyframes glitch animates opacity, background
```

```js
addEventListener('mousemove', (e) => this.draw(e))
addEventListener('mouseleave', () => this.stopDrawing())
```

### [Arpeggiator](https://codepen.io/jsabutis/pen/wBaXzjR)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
.stats { position: absolute; top: 10px; opacity: 0.3 }
```

```js
addEventListener('mousemove', (e) => {
requestAnimationFrame(animate)
```

### [Murmuration](https://codepen.io/jsabutis/pen/MYwXjEg)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```js
addEventListener('mousemove', (e) => {
addEventListener('mouseleave', () => {
requestAnimationFrame(animate)
```

### [Tesla Coil Cursor Interaction](https://codepen.io/jsabutis/pen/NPqadKQ)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
.cursor { position: absolute; transform: translate(-50%, -50%) }
```

```js
addEventListener('mousemove', e => {
requestAnimationFrame(animate)
```

### [Cursor Pointing Text Arrow](https://codepen.io/OuterVale/pen/qEdRoyN)

made with: pointer / mouse tracking

```js
addEventListener("mousemove", (e) => {
```

### [Mouse Tracer Effect - Javascript](https://codepen.io/samsimite/pen/wBaWZrG)

on scroll: div.item: transform ×26, div.item: transform+background+top ×10, div.item: transform+background ×3 | made with: @keyframes · :hover

```css
.box { position: absolute; top: 0; bottom: 0 }
.box1 { position: absolute; top: 0; bottom: 0 }
0% { filter: blur(10px); transform: scale(1) }
100% { transform: scale(2) }
0% { transform: scale(2) }
.image { position: absolute; top: 0; bottom: 0 }
.cover { position: absolute; top: 0; bottom: 0; opacity: 0.1 }
.button { position: absolute; bottom: 10px }
@keyframes dog animates background-color, filter, transform
@keyframes cat animates background-color, transform
```

### [Sweet Cursor](https://codepen.io/udHD/pen/RNPPKaN)

made with: nothing recognised — read the code

```css
.cursor { position:absolute; top:0; border-top:solid 0.3rem hsl(330deg,70%,60%) }
.mousedown { filter:brightness(0.5) }
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

### [Luminous cursor](https://codepen.io/blackfrom80s/pen/dPPageq)

made with: transition · mix-blend-mode · pointer / mouse tracking · Web Animations API (.animate)

```css
.title { text-transform: uppercase }
.cursor__light { position: absolute; top: 0; will-change: transform; transition: all var(--cursor-light-duration) var(--cursor-light-easing); box-shadow: var(--cursor-light-initial-boxShadow); filter: blur(var(--cursor-light-blur)); mix- }
```

```js
.animate( [
addEventListener("mousemove", function (ev) {
```

### [Smoke Cursor Effect](https://codepen.io/mustafauncuoglu/pen/xbbjMpR)

held: fixed canvas | made with: position: fixed · three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

```css
#fluid { position: fixed; top: 0 }
```

```js
requestAnimationFrame(update)
addEventListener("mousemove", (e) => {
```

### [Found your cursor](https://codepen.io/JoaStuart/pen/xbbjKJL)

on scroll: div.arrow: transform+background+top ×18, div.arrow: transform+top ×12 | made with: mask · pointer / mouse tracking · Web Animations API (.animate)

```css
.arrow { mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Clin }
#cur-highlight { position: absolute; top: calc(50vh - 20vw) }
```

```js
.animate( [
.animate( [{ left: `${pos.x - w / 2}px`, top: `${pos.y - w / 2}px` }],
addEventListener("mousemove", (e) =>
```

### [Mousewheel Changes Cursor](https://codepen.io/samsimite/pen/VYYXzKa)

made with: nothing recognised — read the code

```css
.box { position: absolute; top: 0; bottom: 0 }
```

```js
addEventListener('wheel', function (event) {
```

### [Fuego Cursor](https://codepen.io/SaSo-the-scripter/pen/RNNMrmx)

made with: position: fixed · @keyframes · pointer / mouse tracking

```css
.intro { position: relative }
.cursor-flame { position: fixed; transform: translate(-50%, -50%); box-shadow: 0 0 15px #ff4500, 0 0 30px #ff3300, 0 0 45px #ff2200; animation: flameWiggle 0.3s infinite ease-in-out alternate }
0% { transform: translate(-50%, -50%) scale(1) rotate(0deg) }
100% { transform: translate(-50%, -50%) scale(1.05) rotate(4deg) }
.fire-particle { position: fixed; opacity: 0.9; transform: translate(-50%, -50%) scale(1) rotate(0deg); filter: blur(2px) brightness(1.2); animation: flameUp 1s ease-out forwards }
0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 0.95; filter: blur(2px) brightness(1.3) }
50% { transform: translate(-50%, -80%) scale(1.4) rotate(10deg); filter: blur(3px) brightness(1.8) }
100% { transform: translate(-50%, -140%) scale(0.4) rotate(-10deg); opacity: 0; filter: blur(4px) brightness(0.6) }
@keyframes flameWiggle animates transform
@keyframes flameUp animates transform, opacity, filter
```

```js
addEventListener('mousemove', (e) => {
```

### [Cube Exploder with Collision Detection](https://codepen.io/jsabutis/pen/WbbMygr)

made with: three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

### [Click Lightning Effect](https://codepen.io/jsabutis/pen/qEEPYMK)

held: fixed div.instruction, fixed canvas | made with: position: fixed · transition · canvas 2D

```css
.instruction { position: fixed; top: 50%; transform: translate(-50%, -50%); transition: opacity 0.5s }
canvas { position: fixed; top: 0 }
.fade { opacity: 0.2 }
```

### [cursor-blob](https://codepen.io/ux-ui/pen/bNNgBwZ)

held: fixed div.cursor, fixed div.cursor__rim, fixed div.cursor__dot | on scroll: div.cursor__rim: transform+top, div.cursor__dot: transform+top | made with: position: fixed · transition · mix-blend-mode · GSAP · pointer / mouse tracking · requestAnimationFrame

```css
.cursor { position: fixed }
.cursor__rim, .cursor__dot { position: fixed; inset: 0; will-change: transform }
.cursor__rim::after { position: absolute; inset: 0; box-shadow: 0 0 0 var(--size-border) inset var(--color); transform: scale(var(--scale, 1)); filter: blur(var(--blur, 0)); transition: transform 325ms, background-color 325ms }
.cursor__dot::after { transition: box-shadow 325ms, transform 325ms, color 325ms }
.cursor--blend { --scale: 3; mix-blend-mode: exclusion }
.cursor--text { --scale: 3 }
.cursor--text .cursor__rim::after { box-shadow: 0 0 0 0.5px white }
.cursor--fuzz { --scale: 2 }
.cursor--dot { --scale: 0.2 }
```

```js
requestAnimationFrame(this.animate)
addEventListener('pointermove', this.boundMove)
gsap.to(this.pos, {
```

### [Interactive Grid: Cursor Magic in Motion](https://codepen.io/blacklead-studio/pen/emmBRKP)

on scroll: div.subcell: transform ×2881 | made with: transition · :hover · backdrop-filter · mix-blend-mode · three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

```css
body, html { position: relative }
.container { position: relative }
#canvas { position: absolute; top: 0; opacity: 0.85 }
.grid { position: absolute }
.threejs-grid > div { transition: backdrop-filter 0.2s }
.threejs-grid > div.active { backdrop-filter: invert(1) }
.threejs-grid.fading > div > div { opacity: 0; transition: opacity 0.3s ease }
.css-svg-grid { transition: background-image 0.3s ease }
.css-svg-grid > div { transition: backdrop-filter 0.2s }
.css-svg-grid > div.active { backdrop-filter: invert(1) }
.css-svg-grid.fading > div > div { opacity: 0; transition: opacity 0.3s ease }
.css-glitch-grid { transition: background-image 0.3s ease }
```

```js
requestAnimationFrame(animate)
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
addEventListener("mousemove", (e) => {
```

### [Character Scramble Cursor Interaction](https://codepen.io/jsabutis/pen/bNNpjEL)

made with: pointer / mouse tracking · requestAnimationFrame

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

### [If mouse cursor was a hand](https://codepen.io/mtanmaym/pen/OPJempV)

made with: position: fixed · transition · :hover · pointer / mouse tracking

```css
body { position: relative }
#hand { position: absolute; transform: translate(-14%, -7%) }
#clicked-icon { position: absolute; transform: translate(-47%, -30%) }
.element-box { position: absolute; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5) }
h1 { position: absolute; top: 10px }
label { margin-bottom: 10px }
.slider { opacity: 0.7; transition: opacity .2s }
.slider:hover { opacity: 1 }
button { transition: all 0.3s }
button:hover { transform: scale(1.05); box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) }
.knob { box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 -2px 5px rgba(0, 0, 0, 0.1); position: relative }
.knob::after { position: absolute; top: 10px; transform: translateX(-50%) }
```

```js
addEventListener('mousemove', updateHandPosition)
addEventListener("mousemove", function (e) {
addEventListener('mousemove', (e) => {
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

### [Interactive Gooey Rope Cursor (SVG Filter Fun)](https://codepen.io/Lycor/pen/MYWLVWw)

held: fixed div.lil-gui | on scroll: div.blob: transform ×3, div.blob: transform+top ×2 | made with: transition · pointer / mouse tracking · requestAnimationFrame

```css
.gooey-container { filter: url("#gooey-filter"); position: relative }
.blob { position: absolute; transition: width 0.2s ease-out, height 0.2s ease-out }
```

```js
requestAnimationFrame(updateAnimation)
addEventListener('mousemove', updateMousePos)
```

### [Divine Entitiy AI cursor Interaction](https://codepen.io/jsabutis/pen/yyLZgEV)

held: fixed div.loading | made with: position: fixed · three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

### [Fluid Grid Network Mouse Interaction](https://codepen.io/jsabutis/pen/dPyaNzK)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

### [Rain Drops Cursor Interaction](https://codepen.io/jsabutis/pen/JojxjXO)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

### [Eyeball Cursor Tracking](https://codepen.io/jsabutis/pen/wBvRjXr)

on scroll: div.eye-parts-container: transform+top | made with: @keyframes · transition · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.eyeball-container { position: relative; perspective: 600px }
.eyeball { position: absolute; box-shadow: 0 0 30px 8px rgba(255, 255, 255, 0.2) }
.eye-parts-container { position: absolute; transform: translate(0, 0) rotateX(0deg) rotateY(0deg); transition: transform 0.08s ease-out }
.realistic-eye { position: absolute; top: -10%; background-position: center }
.eyelid { position: absolute; top: 0; animation: blink 6s infinite }
.bottom-eyelid { top: auto; bottom: 0; animation: blink-bottom 6s infinite }
0%, 95%, 98% { transform: scaleY(0) }
96%, 97% { transform: scaleY(1) }
0%, 95%, 98% { transform: scaleY(0) }
96%, 97% { transform: scaleY(0.8) }
.cursor { position: absolute; transform: translate(-50%, -50%) }
.instructions { position: absolute; bottom: 20px }
```

```js
addEventListener('mousemove', (e) => {
```

### [Chinese Dragon Cursor Interaction](https://codepen.io/jsabutis/pen/mydQbJL)

on scroll: div.tile: transform+background+top ×52 | made with: transition · pointer / mouse tracking · requestAnimationFrame

### [Mouse Repellant](https://codepen.io/jsabutis/pen/QwWZeKx)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```js
addEventListener('mousemove', function(event) {
requestAnimationFrame(animate)
```

### [Magnet Cursor Interaction](https://codepen.io/jsabutis/pen/wBvYLbe)

held: fixed div | on scroll: div.filament: transform+top ×196, div.filament: transform ×4 | made with: position: fixed · transition · pointer / mouse tracking · requestAnimationFrame

### [Cursor Interaction Blood Spray Effect](https://codepen.io/jsabutis/pen/zxYJyMK)

held: fixed div.blood-spray-container | made with: position: fixed · pointer / mouse tracking · requestAnimationFrame

```css
.blood-spray-container { position: fixed; inset: 0 }
.blood-drop { position: absolute; will-change: transform, opacity }
```

```js
addEventListener('mousemove', this.handleMouseMove.bind(this))
requestAnimationFrame(animate)
requestAnimationFrame(() => {
```

### [The Simple Magic](https://codepen.io/BlackStar1991/pen/pvoOzpP)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
#particleCanvas { position: absolute; top: 0 }
img { position: absolute; bottom: 0; transform: translateX(-50%) }
```

```js
requestAnimationFrame(animateParticles)
addEventListener('mousemove', (e) => {
```

### [Shattering Cursor](https://codepen.io/Juxtopposed/pen/JojLxRg)

held: fixed div.cursor | made with: position: fixed · GSAP · pointer / mouse tracking

```css
.cursor { position: fixed; top: 0; transform: translate(-50%, -50%) }
button { position: relative }
.btn-svg { position: absolute }
```

```js
addEventListener("mousemove", (e) => {
gsap.to(newSvg, {
```

### [Default Cursor Chooser](https://codepen.io/thesecondcatfish/pen/MYWVYRX)

made with: nothing recognised — read the code

```css
#cursor-selector { margin-top: 10px }
```

### [More Complex Custom Cursor](https://codepen.io/OuterVale/pen/MYWQQoR)

held: fixed div.cursor | made with: position: fixed · (hover: hover) gate · pointer / mouse tracking

```css
.cursor { position: fixed; transform: translate(-50%, -50%) }
.click { scale: 0.8 }
.pressable { scale: 1.3 }
```

```js
addEventListener("mousemove", (e) => {
addEventListener('mouseleave', () => {
```

### [Basic Custom Cursor](https://codepen.io/OuterVale/pen/raNJJLg)

held: fixed div.cursor | made with: position: fixed · (hover: hover) gate · pointer / mouse tracking

```css
.cursor { position: fixed; transform: translate(-50%, -50%) }
.click { scale: 0.8 }
```

```js
addEventListener("mousemove", (e) => {
```

### [404 WebGL](https://codepen.io/sijad/pen/WbNZaYQ)

made with: pointer / mouse tracking · requestAnimationFrame

```css
canvas { position: absolute; top: 0; transform: translate3d(0, 0, 0) }
```

```js
requestAnimationFrame(this.tick)
addEventListener("mousemove", this.updateMouse, false)
```

### ["The Bugliest Bug" - custom cursors](https://codepen.io/cbolson/pen/qEBjpeo)

made with: nothing recognised — read the code

```css
.ladybug { " d="M337.645,380.993c-4.143,0-7.5-3.358-7.5-7.5c0-18.034-14.672-32.706-32.707-32.706 c-4.143,0-7.5-3.358-7.5-7.5c0-4.142,3.357-7.5,7.5-7.5c26.306,0,47.707,21.401,47.707,47.706 C345.145,377.635,341.787,380.993,337.645,38 }
.cricket { " d="M368.578,162.501H86.342c-14.695,0-26.611,11.914-26.611,26.612c0,4.284,1.02,8.328,2.818,11.913 c7.504,15.901,38.953,53.135,55.873,66.726c0.377,0.311,0.77,0.604,1.154,0.906c0.072,0.057,0.148,0.12,0.223,0.174l0,0 c10.0 }
```

### [Luminova: Responsive Landing Page](https://codepen.io/AshlynD/pen/azbwdPV)

held: fixed div.cursor, fixed div.cursor-follower, fixed div.page-transition, fixed header | on scroll: div.floating-element: transform+top ×4 | on hover of li.: div.floating-element: transform+top ×4, span.logo-dot: transform+opacity ×2, div.cursor: opacity+top, div.cursor-follower: transform+top, a.nav-link: color, div.scroll-arrow: transform+top | made with: position: fixed · view() timeline · @keyframes · transition · :hover · backdrop-filter · mix-blend-mode · custom properties driven by JS · canvas 2D · scroll listener · pointer / mouse tracking

```css
0% { transform: translateY(0) rotate(0deg) }
50% { transform: translateY(-20px) rotate(5deg) }
100% { transform: translateY(0) rotate(0deg) }
0% { transform: rotate(0deg) }
100% { transform: rotate(360deg) }
0% { transform: scale(1); opacity: 1 }
50% { transform: scale(1.05); opacity: 0.8 }
100% { transform: scale(1); opacity: 1 }
from { opacity: 0; transform: translateY(20px) }
to { opacity: 1; transform: translateY(0) }
from { opacity: 0 }
to { opacity: 1 }
```

```js
addEventListener('mousemove', (e) => {
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
addEventListener('scroll', () => {
style.setProperty('--char-index', index)
style.setProperty('--animation-speed', `${animationSpeed}s`)
style.setProperty('--delay', `${i * 0.2}s`)
style.setProperty('--delay', `${i * 0.3}s`)
```

### [Mouse Wheel Changes Cursor](https://codepen.io/samsimite/pen/QwWEgmp)

held: fixed div.hair, fixed div.hair, fixed div | on scroll: div.: transform+top | on hover of img.: div.: transform+top | made with: position: fixed · transition · pointer / mouse tracking

```css
.box { position: absolute; top: 0; bottom: 0 }
.box1 { position: absolute; top: 0 }
.box2 { position: absolute; top: 0 }
.carousel { position: absolute; top: 0; bottom: 0 }
.carousel div { position: absolute; top: 0; bottom: 0 }
.spanner { position: absolute; top: 0; bottom: 0 }
#crosshair-h { margin-top: -1px }
.hair { position: fixed }
#ghost1 { position: fixed; transition: transform 4s }
```

```js
addEventListener('mousemove', function (ev) {
addEventListener('wheel', function (event) {
```

### [Mouse and Cursor Effects](https://codepen.io/samsimite/pen/dPyXPyP)

held: fixed div.hair, fixed div.hair, fixed div | on scroll: div.: transform+top | on hover of img.: div.: transform+top | made with: position: fixed · transition · pointer / mouse tracking

```css
.box { position: absolute; top: 0; bottom: 0 }
#crosshair-h { margin-top: -1px }
.hair { position: fixed }
#ghost1 { position: fixed; transition: transform 4s }
.box2, .box3, .box4, .box5, .box6, .box7, .box8, .box9 { position: absolute; top: 0; background-position: center }
.box13, .box14, .box15, .box16, .box17, .box18 { position: absolute; bottom: 20%; background-position: center }
.box21, .box22, .box23, .box24, .box25, .box26, .box27 { position: absolute; background-position: center }
.box21 { top: 10% }
.box22 { top: 20% }
.box23 { top: 30% }
.box24 { top: 40% }
.box25 { top: 50% }
```

```js
addEventListener('mousemove', function (ev) {
```

### [MATRIX-PHYSICS](https://codepen.io/Dr-Youvi-Avant/pen/JojGwyK)

held: fixed div | made with: position: fixed · transition · :hover · canvas 2D · requestAnimationFrame

```css
canvas { position: fixed; inset: 0 }
.controls-panel { position: absolute; top: 1rem }
.control-header { margin-bottom: 1rem }
input[type="range"]::-webkit-slider-thumb { margin-top: -4px }
button { transition: all 0.2s ease }
label { margin-bottom: 0.25rem }
.value-display { opacity: 0.8 }
.pause-indicator { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

```js
requestAnimationFrame(animate)
```

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

### [Minecraft cursor](https://codepen.io/Ada-Ash/pen/KwKKwZq)

made with: position: fixed · transition · :hover · pointer / mouse tracking

```css
body::before { position: fixed; top: 0; transition: transform 0.3s ease-in-out; transform: scale(1.05) }
body:hover::before { transform: scale(1) }
#custom-cursor { position: fixed; transition: 0s }
.sword_container { transition: 0.3s }
.sword_container:hover { transform: scale(1.2) }
```

```js
addEventListener("mousemove", (e) => {
```

### [Swirl Cursor Effect](https://codepen.io/jayramoliya/pen/WbeqJOM)

held: fixed div | made with: position: fixed · @keyframes · pointer / mouse tracking

```css
#cursor { position: fixed; top: 0 }
.smoke { position: absolute; animation: fadeOut 1s forwards }
0% { opacity: 1; transform: scale(1) }
100% { opacity: 0; transform: scale(2) }
@keyframes fadeOut animates opacity, transform
```

```js
addEventListener('mousemove', function(e) {
```

### [Magnifying glass cursor](https://codepen.io/BlogFire/pen/QwLRYNX)

on scroll: div.try-it: transform+opacity+top | on hover of div.card: div.try-it: transform+top | made with: transition · :hover · clip-path · mix-blend-mode · GSAP

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

### [Magic Custom Cursor](https://codepen.io/Zain-Raza-the-sasster/pen/ByBejbq)

held: fixed div.cursor | on scroll: div.cursor: transform+top | made with: position: fixed · @keyframes · mix-blend-mode · pointer / mouse tracking

```css
.cursor { position: fixed; mix-blend-mode: difference; animation: pulse 1.5s infinite }
0% { transform: scale(1) }
50% { transform: scale(1.5) }
100% { transform: scale(1) }
@keyframes pulse animates transform
```

```js
addEventListener('mousemove', (e) => {
```

### [Ripple Effect Cursor](https://codepen.io/alpaca34607/pen/ByBbMEz)

held: fixed div | on hover of a.: a.: color | made with: position: fixed · @keyframes · :hover · mix-blend-mode · pointer / mouse tracking

```css
#custom-cursor { position: fixed; mix-blend-mode: normal; transform: translate(-50%, -50%) }
#custom-cursor::after { position: absolute; top: 50%; transform: translate(-50%, -50%) scale(0.5); opacity: 0; animation: none }
#custom-cursor.hovered::after { opacity: 1; animation: expand 2.5s infinite linear }
0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1 }
100% { transform: translate(-50%, -50%) scale(3.5); opacity: 0 }
@keyframes expand animates transform, opacity
```

```js
addEventListener('mousemove', (e) => {
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [Neon Cursor](https://codepen.io/mihaiapostol14/pen/ogvVNaY)

made with: pointer / mouse tracking · requestAnimationFrame

```css
.neon-dot { position: absolute; box-shadow: 0 0 10px rgba(0, 255, 255, 0.7) }
```

```js
requestAnimationFrame(moveDots)
addEventListener('mousemove', e => {
```

### [Ripple Effect Cursor(React)](https://codepen.io/alpaca34607/pen/yyBZOrq)

held: fixed div.cursor | on hover of a.: a.: color, button.: background+color | made with: position: fixed · @keyframes · :hover · mix-blend-mode · pointer / mouse tracking

```css
#custom-cursor { position: fixed; mix-blend-mode: normal; transform: translate(-50%, -50%) }
#custom-cursor::after { position: absolute; top: 50%; transform: translate(-50%, -50%) scale(0.5); opacity: 0; animation: none }
a:hover #custom-cursor::after { opacity: 1; animation: expand 0.5s infinite linear }
button:hover #custom-cursor::after { opacity: 1; animation: expand 0.5s infinite linear }
#custom-cursor.hovered::after { opacity: 1; animation: expand 2.5s infinite linear }
0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1 }
100% { transform: translate(-50%, -50%) scale(3.5); opacity: 0 }
@keyframes expand animates transform, opacity
```

```js
addEventListener('mousemove', handleMouseMove)
addEventListener('mouseenter', handleMouseEnter)
addEventListener('mouseleave', handleMouseLeave)
```

### [Gooey Cursor](https://codepen.io/mustafauncuoglu/pen/gbYQQNq)

held: fixed div | made with: position: fixed · mix-blend-mode · pointer / mouse tracking · requestAnimationFrame

```css
#cursor { position: fixed; top: calc(2rem * -0.5); mix-blend-mode: difference; filter: url(#goo) }
.cursor-circle { position: absolute; top: 0 }
```

```js
requestAnimationFrame(updateCursor)
addEventListener("mousemove", onMouseMove, false)
```

### [Dot in a Dot Cursor](https://codepen.io/marieslo/pen/JoPeeWE)

held: fixed div.cursor-small-dot, fixed div.cursor-big-dot | on scroll: div.cursor-small-dot: transform+top, div.cursor-big-dot: transform+top | made with: position: fixed · @keyframes · transition · mix-blend-mode · pointer / mouse tracking · requestAnimationFrame

```css
body { animation: gradientAnimation 10s ease infinite }
0% { background-position: 0% 50% }
25% { background-position: 50% 50% }
50% { background-position: 100% 50% }
75% { background-position: 50% 50% }
100% { background-position: 0% 50% }
.cursor-small-dot { position: fixed; mix-blend-mode: difference; transition: transform 0.1s ease }
.cursor-big-dot { position: fixed; mix-blend-mode: difference; transition: transform 0.001s ease }
@keyframes gradientAnimation animates background-position
```

```js
requestAnimationFrame(() => handleMouseMove(e))
addEventListener("mousemove", mouseMoveHandler)
```

### [Magic Dots Cursor Effects Using Js](https://codepen.io/WhiteHatDesigner/pen/OPLavpo)

held: fixed a | on scroll: div.: transform+opacity+filter+top ×591, div.: transform+filter+top ×7, div.: transform+opacity+filter ×2 | on hover of a.: div.: transform+opacity+filter+top ×408, div.: transform+opacity+filter ×192, a.: transform+shadow+top | made with: position: fixed · transition · backdrop-filter · pointer / mouse tracking

```css
section { position: absolute }
section div { position: relative }
section div::before { position: absolute; top: 0; box-shadow: 0 40px 0 #00ff00, 0 0 5px #00ff00, 0 0 15px #00ff00 }
section div::after { position: absolute; bottom: 0; box-shadow: 0 -40px 0 #00ff00, 0 0 5px #00ff00, 0 0 15px #00ff00 }
```

```js
addEventListener("mousemove", function (e) {
```

### [Animated Cursor Using Vanilla JS](https://codepen.io/gianluca-giuliano/pen/NPKyEQe)

held: fixed div.outline, fixed div.cursor | on scroll: div.outline: transform+top | made with: position: fixed · transition · pointer / mouse tracking

```css
.outline { transition: all 200ms ease-out; position: fixed; top: 0; transform: translate(calc(-50% + 15px), -50%) }
.cursor { opacity: .5; position: fixed; transform: translate(-50%, -50%); transition: width .3s, height .3s, opacity .3s }
.hover { opacity: 0.5 }
```

```js
addEventListener('mousemove', function(e){
addEventListener('mouseleave', () => {
```

### [Bubble Cursor](https://codepen.io/haripadajena/pen/dPbJYaJ)

held: fixed a.meta-link, fixed a.meta-link | on scroll: div.: transform+top | on hover of a.meta-link: div.: transform+top | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · pointer / mouse tracking

```css
bubles { position: absolute; box-shadow: 0px 0px 15px 0px #de1293 inset; transform: translate(-50%, -50%); animation: colorgen 8s infinite, float 2s infinite }
0% { opacity: 1; transform: translatey(0px) }
100% { opacity: 0; transform: translatey(-1000px) }
#bubbles { box-shadow: 174px 1592px var(--coloring), 948px 1588px var(--coloring), 1243px 869px var(--coloring), 682px 1624px var(--coloring), 1175px 1877px var(--coloring), 1544px 1830px var(--coloring), 1213px 792px var(--colorin }
#bubbles:after { position: absolute; top: -2000px }
from { transform: translateY(-200px) }
to { transform: translateY(-2000px) }
#made-by { backdrop-filter: blur(3px); box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1); position: absolute; bottom: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) }
#tel-link { top: 60px }
#whats-link { top: 110px }
#yt-link { top: 10px }
.meta-link { backdrop-filter: blur(3px); box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1); position: fixed; transition: background-color 600ms, border-color 600ms }
```

```js
addEventListener("mousemove", (e) => {
```

### [Cursor Customized here! and Button with Smooth Transition](https://codepen.io/darshit_tank/pen/OPLOXee)

on hover of button.: button.: transform+top | made with: transition · :hover

```css
body { margin-top: 100px }
button { text-transform: uppercase; transition: 0.5s; box-shadow: 0 0 20px #eee; text-transform:uppercase }
button:hover { background-position: right center; transform: scale(1.1) }
button:active { transform: scale(1); box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1) }
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

### [Custom Cursor](https://codepen.io/thecose/pen/JoPyXME)

held: fixed div.center, fixed div.outerCircle | on hover of a.logo: div.outerCircle: transform+top | made with: position: fixed · @keyframes · transition · :hover · pointer / mouse tracking

```css
.center, .outerCircle { position: fixed; top: 0; transform: translate(-50%, -50%) }
.outerCircle { transition: 0.1s ease }
.click { animation: click 300ms ease 1 }
ul a { transition: color 300ms ease; text-transform: uppercase }
.logo { position: relative }
.logo::before { position: absolute; top: 20%; scale: 1.1; transition: 300ms ease }
@keyframes click animates width, height
```

```js
addEventListener('mousemove',(e) => {
```

### [Circle Cursor Js #GSAP](https://codepen.io/Bluxart/pen/azomomX)

held: fixed div.cursor | on scroll: div.cursor__circle: transform+opacity+top, div.cursor__circle: transform+top | made with: position: fixed · GSAP · pointer / mouse tracking

```css
html { position: relative; top: auto }
body { position: relative }
.hero-header { position: relative }
.hero-header__grid { position: relative }
.hero-header__grid-overlay { position: absolute; top: 0 }
.hero-header__content { position: relative }
.hero-header__description { text-transform: uppercase; margin-top: 20px }
.cursor { position: fixed; top: 0 }
.cursor__circle { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

```js
gsap.to(cursorLarge, { scale: 2, opacity: 1, duration: 0.3 })
gsap.to(cursorSmall, { scale: 0, opacity: 0, duration: 0.3 })
gsap.to(cursorLarge, { scale: 1, opacity: 1, duration: 0.3 })
gsap.to(cursorSmall, { scale: 1, opacity: 1, duration: 0.3 })
addEventListener('mouseenter', handlePointerEnter)
addEventListener('mouseleave', handlePointerLeave)
addEventListener('mousemove', handleMouseMove)
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

### [Animated Click Effect using CSS & Js](https://codepen.io/WhiteHatDesigner/pen/EaYKdmq)

held: fixed a | on hover of a.: a.: transform+shadow+top | made with: position: fixed · @keyframes · transition · backdrop-filter

```css
.spark { position: absolute; transform: translateY(-20px) }
.spark span { position: absolute; transform-origin: bottom; filter: drop-shadow(0 0 20px #0f0) drop-shadow(0 0 40px #0f0) }
.spark span::before { position: absolute; animation: animate 2s ease-in-out forwards }
0% { transform: translateY(100%) }
100% { transform: translateY(1000%) }
@keyframes animate animates transform
```

### [Smoke cursor effect](https://codepen.io/creativejeff/pen/qEWbLmw)

held: fixed canvas | made with: position: fixed · three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

```css
#fluid { position: fixed; top: 0 }
```

```js
requestAnimationFrame(update)
addEventListener('mousemove', e => {
```

### [Change Element's Colour Based on Colours Under Cursor in Background Image](https://codepen.io/elias-proctor/pen/YzmmXop)

held: fixed div, fixed div, fixed div, fixed div | on scroll: div.: background+color, h2.: color, p.: color, a.: background+color, div.: transform+top | on hover of a.: div.: transform+top ×2, div.: background, a.: transform+color+top | made with: position: fixed · transition · :hover · backdrop-filter · canvas 2D · pointer / mouse tracking

```css
#background { position: fixed; top: 0; background-position: center }
#cursor-ring { position: fixed; transition: all 0.15s ease; transform: translate(-50%, -50%); backdrop-filter: blur(50px) }
#color-code { position: absolute; bottom: -20px; transform: translateX(-50%) }
#content-container, #inner { position: fixed; transition: background-color 0.2s, color 0.2s; bottom: 0; top: 0 }
#inner { inset: 30px }
a { margin-top: 20px; transition: background-color 0.2s, color 0.2s, transform 0.2s }
a:hover { transform: scale(1.15) }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
```

### [cursor chaser & covered effect](https://codepen.io/keiyashi/pen/ZEgNgXa)

made with: @keyframes · transition · :hover · pointer / mouse tracking

```css
.backboard .cursor-ball { top: 0; position: absolute }
.backboard .cursor-heartbeat { top: 0; position: absolute; animation-name: heartbeat; animation-duration: 1.2s; animation-iteration-count: infinite; animation-timing-function: ease-out; transition: top 0.1s, left 0.1s }
0% { transform: scale(1, 1) }
100% { transform: scale(3, 3) }
.backboard .target { position: absolute; top: 0 }
.backboard .target .cover { position: absolute; top: 0; bottom: 0 }
.backboard .target .cover .front { transition: opacity 0.3s ease-in, r 0.5s ease-in; opacity: 0 }
.backboard .target .cover:hover .front { opacity: 1 }
@keyframes heartbeat animates transform
```

```js
addEventListener("mousemove", movefunction)
addEventListener("mouseenter", cursorIntersecting)
addEventListener("mouseleave", cursorleaving)
```

### [Cursor Changer - Jquery](https://codepen.io/samsimite/pen/gOVJoGp)

made with: nothing recognised — read the code

```css
.box { position: absolute; top: 0; bottom: 0 }
.box2, .box3, .box4, .box5, .box6, .box7, .box8, .box9 { position: absolute; top: 0; background-position: center }
.box13, .box14, .box15, .box16, .box17, .box18 { position: absolute; bottom: 20%; background-position: center }
.box21, .box22, .box23, .box24, .box25, .box26, .box27 { position: absolute; background-position: center }
.box21 { top: 10% }
.box22 { top: 20% }
.box23 { top: 30% }
.box24 { top: 40% }
.box25 { top: 50% }
.box26 { top: 60% }
.box27 { top: 70% }
.box29, .box30, .box31, .box32, .box33, .box34, .box35 { position: absolute; background-position: center }
```

### [Interactive Magnetic Text Animation with Custom Cursor Effect](https://codepen.io/VoXelo/pen/OJKGZNN)

held: fixed div | made with: position: fixed · transition · mix-blend-mode · pointer / mouse tracking

### [Draw Paint - Jquery](https://codepen.io/samsimite/pen/ExqJogd)

on scroll: td.td1: background ×87 | made with: nothing recognised — read the code

```css
.box { position: absolute; top: 0; bottom: 0 }
.box1 { position: absolute; top: 0; border-bottom: solid 2px #b3b3b3 }
.box2 { position: absolute; top: 77px; bottom: 0 }
```

### [Smooth Custom Cursor Movement](https://codepen.io/SpectacledCoder/pen/XWvoZbN)

on scroll: div.cursor: transform+top | made with: transition · :hover · scroll listener · pointer / mouse tracking

```css
.cursor { position: absolute; box-shadow: 1px 1px 50px #ffffff; transition: all 0.2s }
.disclaimer { position: absolute; bottom: 0px }
```

```js
addEventListener('mousemove', positionElement)
addEventListener('scroll', positionElement)
```

### [Cursor in & Out Ripple Effect](https://codepen.io/WhiteHatDesigner/pen/jOgXLeo)

held: fixed a | on hover of a.: a.: transform+shadow+top | made with: position: fixed · transition · :hover · backdrop-filter · custom properties driven by JS

```css
.container .box { position: relative }
.container .box::before { position: absolute; top: var(--y); transform: translate(-50%, -50%); transition: 0.5s, top 0s, left 0s }
```

```js
style.setProperty("--x", x + "px")
style.setProperty("--y", y + "px")
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

### [Focus an image with a mouse or touch](https://codepen.io/swc9803/pen/dyxjxOj)

on scroll: img.: opacity | made with: transition · pointer / mouse tracking

```css
.container { position: absolute; top: 0 }
h1 { position: absolute; top: 50%; transform: translate(-50%, -50%) }
img { vertical-align: bottom; opacity: 0.1; transition: opacity 0.1s; will-change: opacity }
```

```js
addEventListener("mousemove", onMouseMove)
```

### [Custom Cursor](https://codepen.io/arnilrashid/pen/mdNjXxR)

made with: @keyframes · pointer / mouse tracking

```css
.cursor { position: absolute; box-shadow: 0 0 10px #ff007f, 0 0 20px #ff007f, 0 0 30px #ff007f; transform: translate(-50%, -50%); animation: fadeOut 0.5s forwards }
to { opacity: 0; transform: scale(2) }
@keyframes fadeOut animates opacity, transform
```

```js
addEventListener('mousemove', (e) => {
```

### [Cursor Blob Animation](https://codepen.io/Rahulive/pen/JjgBWew)

on scroll: div.blob-cursor__bg: opacity+top | made with: @keyframes · pointer / mouse tracking

```css
body { position: relative }
.blob-cursor__bg { position: absolute; top: 0; bottom: auto; opacity: 1; -webkit-filter: blur(120px); filter: blur(120px); -webkit-animation: blobAnimation 2s Linear Infinite; animation: blobAnimation 2s Linear Infinite }
from { transform: scale(1) }
to { transform: scale(.8) }
0% { opacity: 1 }
50% { opacity: 0.6 }
100% { opacity: 1 }
0% { opacity: 1 }
50% { opacity: 0.6 }
100% { opacity: 1 }
@keyframes moveCursor1 animates transform
@keyframes blobAnimation animates opacity
```

```js
addEventListener('mousemove', e => {
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [Cursor Fade Effect](https://codepen.io/gustavo61128980/pen/wvVxgpN)

made with: @keyframes

```css
span { position: absolute; opacity: 0 }
0% { opacity: 1 }
100% { opacity: 0 }
h1 { position: absolute; opacity: 0.3; top: 50%; transform: translate(-50%, -50%) }
@keyframes fade animates opacity
```

### [Cursor show Border](https://codepen.io/swc9803/pen/GRVBrgy)

made with: transition · :hover · custom properties driven by JS · pointer / mouse tracking · requestAnimationFrame

```css
.card { position: relative }
.card::before, .card::after { position: absolute }
.card::before { top: var(--cardBorderStroke); bottom: var(--cardBorderStroke) }
.card::after { top: 0; bottom: 0; opacity: 0; transition: opacity 0.2s ease-in }
.container:hover .card::after { opacity: 1 }
.back { position: absolute }
```

```js
requestAnimationFrame(() => {
style.setProperty("--x", `${x}px`)
style.setProperty("--y", `${y}px`)
addEventListener("mousemove", moveCursor)
```

### [Full-Screen Overlay Menu](https://codepen.io/pixelgridui/pen/QWeBwog)

held: fixed div.cursor, fixed div.cursor, fixed div.creativeMenu, fixed div.pp-widget, fixed button.pp-reopen | on scroll: span.pp-reopen-dot: transform+opacity+top | on hover of a.logo: div.cursor: transform+top ×2, span.pp-reopen-dot: transform+opacity+top | made with: position: fixed · @keyframes · transition · :hover · mix-blend-mode

```css
:root { --top-position: 4rem; --left-position: 3rem; --animation-duration-menu: 0.6s }
body, html { position: relative }
body main { position: relative }
body main h1 { text-transform: uppercase }
.hamburger { position: absolute; top: var(--top-position) }
.hamburger .hamburger--container { position: relative }
.hamburger .hamburger--bars { position: absolute; top: 0.9em; transition: var(--transition-duration) var(--transition-ease) }
.hamburger .hamburger--bars:before, .hamburger .hamburger--bars:after { position: absolute; transition: var(--transition-duration) var(--transition-ease) }
.hamburger .hamburger--bars:before { top: -0.5em }
.hamburger .hamburger--bars:after { top: 0.5em }
.logo { position: absolute; top: var(--top-position) }
.creativeMenu { position: fixed; top: 0 }
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

### [Custom cursor](https://codepen.io/ceciliaets/pen/zYgPXmK)

made with: :hover

### [Modified Cursor](https://codepen.io/nk2552003/pen/ExqvZey)

held: fixed div.cursor-dot, fixed div.cursor-outline | made with: position: fixed · @keyframes · pointer / mouse tracking

```css
.cursor-dot { animation: AnimationName 3s ease infinite }
.cursor-dot, .cursor-outline { position: fixed; top: 0; transform: translate(-50%, -50%) }
0% { background-position: 28% 0% }
50% { background-position: 73% 100% }
100% { background-position: 28% 0% }
@keyframes AnimationName animates background-position
```

```js
addEventListener("mousemove", function (e) {
```

### [Ghost Looks at Cursor](https://codepen.io/Abdul-Samad-Unar/pen/eYqWvoL)

on scroll: div.pupil: transform ×2, div.ghost: transform | made with: clip-path · 3D (perspective / preserve-3d) · GSAP · pointer / mouse tracking

```css
.ghost { position: relative; box-shadow: 0 0 20px rgba(0, 0, 0, 0.5) }
.horn { position: absolute; top: -30px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5) }
.horn.left { transform: rotate(-30deg) }
.horn.right { transform: rotate(30deg) }
.face { position: relative }
.eye { position: absolute }
.eye.left { top: 60px }
.eye.right { top: 60px }
.mouth { position: absolute; bottom: 30px; clip-path: polygon( 0% 100%, 10% 60%, 20% 100%, 30% 60%, 40% 100%, 50% 60%, 60% 100%, 70% 60%, 80% 100%, 90% 60%, 100% 100% ); transform: translateX(-50%) }
```

```js
addEventListener("mousemove", (e) => {
gsap.to(ghost, {
gsap.to(eyes, {
```

### [Sticky Cursor](https://codepen.io/JoaStuart/pen/mdNRpZw)

held: fixed div.trailer-style, fixed div.trailer-style | on scroll: path.[object: color ×2, div.trailer-style: transform+opacity+top ×2, svg.[object: color | made with: position: fixed · pointer / mouse tracking · Web Animations API (.animate)

```css
.trailer-style { position: fixed; top: 0; transform: translateX(-50%) translateY(-50%); opacity: 0 }
```

```js
.animate([{ left: px(x), top: px(y) }], {
.animate([{ opacity: "1" }], medTiming)
.animate([{ opacity: "0" }], shortTiming)
.animate( [
.animate([{ color: "white" }], longTiming)
.animate( [{ width: px(TRAILER_DEFAULT_RADIUS), height: px(TRAILER_DEFAULT_RADIUS) }],
.animate([{ color: "black", transform: "none" }], {
.animate( [{ left: px(center.left + tx), top: px(center.top + ty) }],
```

### [Magnetic Cursor Ball](https://codepen.io/federico-bottaro/pen/YzmWbzv)

on scroll: div.ball: transform+top, div.flame: transform+opacity+top | made with: @keyframes · transition · pointer / mouse tracking · requestAnimationFrame

```css
.hero { position: relative }
.ball { position: absolute; box-shadow: 0 0 20px rgba(255, 255, 255, 0.8); transition: transform 0.1s ease-out }
.flame { position: absolute; top: 50%; transform: translate(-50%, -50%); animation: flame 1s infinite; opacity: 0.7 }
0% { opacity: 0.7; transform: translate(-50%, -50%) scale(1) }
50% { opacity: 0.3; transform: translate(-50%, -60%) scale(1.5) }
100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1) }
@keyframes flame animates opacity, transform
```

```js
addEventListener('mousemove', (e) => {
addEventListener('mouseleave', () => {
requestAnimationFrame(animate)
```

### [Particles distortion on cursor](https://codepen.io/Lucas_Mes/pen/vYoOeGK)

made with: three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

### [Spotlight Cursor Effect GSAP](https://codepen.io/Joseph-Barrios/pen/xxvbxvy)

on scroll: section.overlay: clip-path | on hover of span.hover-btn: section.overlay: clip-path | made with: transition · clip-path · custom properties driven by JS · GSAP · pointer / mouse tracking

```css
section, .overlay { position: absolute; top: 0 }
.overlay { clip-path: circle(20vmin at calc(var(--x, 50%) * 1%) calc(var(--y, 50%) * 1%)); transition: clip-path 100ms }
.is-open { clip-path: circle(200% at 100% 100%); transition: clip-path 1.3s }
.hover-btn, .hover-btn2 { margin-top: 20px }
```

```js
addEventListener('mousemove', (e) => {
style.setProperty('--x', `${x}`)
style.setProperty('--y', `${y}`)
```

### [S.T.A.L.K.E.R. 2 Inventory](https://codepen.io/BlackStar1991/pen/BagEKNK)

made with: @keyframes · :hover · :has() · pointer / mouse tracking

```css
.custom-cursor { position: absolute; animation: cursor-animation 1s steps(8) infinite }
from { background-position: 0 0 }
to { background-position: -256px 0 }
.screen { position: relative }
#background-video { position: absolute; top: 0 }
.main { text-transform: uppercase }
.gr { position: relative; box-shadow: inset 0 0 40px 0 rgba(0, 0, 0, 0.9) }
.anomalies .gr:empty:after { position: absolute; top: 0 }
.gr2 { box-shadow: inset 0 0 40px 0 rgba(0, 0, 0, 0.9) }
.dem:after { position: absolute; top: 8px }
video { opacity: 1 }
.armor_head video { opacity: 0 }
```

```js
addEventListener('mousemove', (e) => {
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

### [Cat follow mouse cursor jquery](https://codepen.io/TikiHead/pen/WNqPQab)

made with: Web Animations API (.animate)

```css
#cat { position:absolute }
```

```js
.animate({left:mouse.pageX, top:mouse.pageY})
```

### [shinobi | a sneaky minimalist menu](https://codepen.io/delvignefred/pen/oNrJROW)

held: fixed footer | made with: position: fixed · @keyframes · transition · :hover · :has() · mix-blend-mode

```css
& cite { position: relative }
&:has(details[open]) summary::after { transform: rotate(var(--shuriken-rotation-angle)) }
&::after { transition: var(--shuriken-transition-property) var(--shuriken-transition-duration) var(--shuriken-timing-function) var(--shuriken-transition-delay) var(--shuriken-transition-behavior) }
&::after { position: absolute; mix-blend-mode: darken; animation: smoke-animation-1 var(--smoke-animation-duration) var(--smoke-animation-timing-function) var(--smoke-animation-fill-mode) }
&::after { position: absolute; mix-blend-mode: darken; animation: smoke-animation-2 var(--smoke-animation-duration) var(--smoke-animation-timing-function) var(--smoke-animation-fill-mode) }
&::after { position: absolute; mix-blend-mode: darken; animation: smoke-animation-3 var(--smoke-animation-duration) var(--smoke-animation-timing-function) var(--smoke-animation-fill-mode) }
&:hover { opacity: 1 }
from { opacity: 0; filter: grayscale(100%) }
to { opacity: 1; filter: grayscale(0%) }
& cite { inset: auto auto 2vmin auto }
& cite { inset: auto auto 2vmin auto }
& .main__aside__profil { background-position: 30% 100% !important }
```

### [Cursor Following + Rolling Text Link](https://codepen.io/mustafauncuoglu/pen/BagOvJr)

on scroll: span.: transform+top ×5, div.: transform+opacity, div.: transform+opacity+top | made with: transition · :hover · GSAP · pointer / mouse tracking

```css
#container { position: relative }
#dot, #ball { position: absolute; top: 0 }
.rolling-text { transform: translateY(0); transition: transform 0.4s ease, box-shadow 0.4s ease; position: relative }
.rolling-text::after { position: absolute; bottom: -5px; transition: width 0.4s ease }
.rolling-text div span { transition: transform 0.4s ease; transform: translateY(0) }
.rolling-text:hover span { transform: translateY(-20px) }
.rolling-text:hover ~ #dot, .rolling-text:hover ~ #ball { opacity: 0 }
```

```js
addEventListener("mousemove", (e) => {
```

### [Elastic Custom Cursor Following Mouse (Squeeze and Rotate) w/ JavaScript](https://codepen.io/mustafauncuoglu/pen/qBzYeYx)

held: fixed div.circle | on scroll: div.circle: transform+top | made with: position: fixed · 3D (perspective / preserve-3d) · pointer / mouse tracking · requestAnimationFrame

```css
.circle { position: fixed; top: calc(var(--circle-size) / 2 * -1); will-change: transform }
```

```js
addEventListener("mousemove", (e) => {
requestAnimationFrame(tick)
```

### [Sticky and Skewed Cursor](https://codepen.io/maghno/pen/wvLmvpN)

held: fixed button, fixed div.mf-cursor | on scroll: div.mf-cursor: transform+top, div.mf-cursor-inner: transform+top | made with: position: fixed · transition · mix-blend-mode · GSAP

```css
button { position: relative; transition: all 0.2s ease-out; position: fixed; top: 50%; transform: translate(-50%, -50%); mix-blend-mode: difference }
button .btn-inner { position: absolute; top: 50%; transform: translate(-50%, -50%) }
button .btn-inner > span:nth-child(1) { position: absolute; top: 50%; transform: translate(-50%, -50%) }
button .btn-inner > span:nth-child(2) { position: absolute; top: 50%; transform: translate(-50%, -50%) rotate(90deg) }
button.active { transform: translate(-50%, -50%) rotate(45deg) }
.mf-cursor { position: fixed; top: 0; transition: opacity 0.3s, color 0.4s }
.mf-cursor:before { position: absolute; top: -24px; transform: scale(0.5); transition: transform 0.25s ease-in-out, opacity 0.1s, background-color 0.2s 0.1s }
.mf-cursor.-exclusion { mix-blend-mode: exclusion }
.mf-cursor.-active:before { transform: scale(1.2) }
.mf-cursor.-pointer:before { transform: scale(2); transform: scale(2) }
.mf-cursor.-text:before { opacity: 0.85; transform: scale(1.7) }
.mf-cursor.-text.-active:before { transform: scale(1.6) }
```

### [Smoothed Cursor](https://codepen.io/maghno/pen/qBzxGrW)

held: fixed span | on scroll: span.: transform+background+top | made with: position: fixed · transition · pointer / mouse tracking · requestAnimationFrame

```css
#cursor { position: fixed }
#cursor #cursor__inner { transition: all 0.4s ease }
#cursor.data-cursor-active #cursor__inner { transform: scale(0.7) }
#cursor.data-cursor-active.data-cursor-type-1 #cursor__inner { transform: scale(1.2) }
```

```js
addEventListener('mousemove', (e) => this.onMouseMove(e))
addEventListener('mouseenter', () => this.onHover(elem))
addEventListener('mouseleave', () => this.onLeave(elem))
requestAnimationFrame(() => this.render())
```

### [Basic Custom Cursor](https://codepen.io/maghno/pen/NWZymmp)

held: fixed span | on scroll: span.: transform+background+top | on hover of button.: span.data-cursor-active: transform, span.: transform+background+top | made with: position: fixed · transition · pointer / mouse tracking

```css
#cursor { position: fixed }
#cursor #cursor__inner { transition: all 0.4s ease }
#cursor.data-cursor-active #cursor__inner { transform: scale(0.7) }
#cursor.data-cursor-active.data-cursor-type-1 #cursor__inner { transform: scale(1.2) }
```

```js
addEventListener('mousemove', (e) => this.onMouseMove(e))
addEventListener('mouseenter', () => this.onHover(elem))
addEventListener('mouseleave', () => this.onLeave(elem))
```

### [Basic Custom Cursor TS](https://codepen.io/maghno/pen/QWXQrLj)

held: fixed span | on scroll: span.: transform+top | on hover of button.: span.: transform+background+top | made with: position: fixed · transition · pointer / mouse tracking

```css
#cursor { position: fixed }
#cursor #cursor__inner { transition: all 0.4s ease }
#cursor.data-cursor--active #cursor__inner { transform: scale(0.7) }
```

```js
addEventListener('mousemove', (e) => this.onMouseMove(e))
addEventListener('mouseenter', () => this.onHover())
addEventListener('mouseleave', () => this.onLeave())
```

### [Particle and line animation on cursor hover](https://codepen.io/saheeranas/pen/PorEBOL)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
#banner div { position: relative }
#canvas { position: absolute; top: 0; bottom: 0 }
```

```js
addEventListener("mousemove", function (evt) {
addEventListener("mouseleave", function (evt) {
requestAnimationFrame(animate)
```

### [some cursor trailers](https://codepen.io/acctforjudge/pen/yLdXpRy)

made with: pointer / mouse tracking

```css
h1 { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.dot { position: absolute; transform: translate(-50%, -50%) }
```

```js
addEventListener("mousemove", (e) => {
```

### [Simple Custom Cursor when Hovering an Image](https://codepen.io/Lefteris/pen/NWZrMMw)

held: fixed div.cursor | on scroll: div.cursor: transform+opacity+background+top | made with: position: fixed · transition · :hover · backdrop-filter · pointer / mouse tracking

```css
img { vertical-align: top }
.cursor { position: fixed; top: 0; transition: transform 0.2s ease, background-color 0.2s ease, opacity 0.2s ease, filter 0.2s ease; will-change: transform, background-color, opacity, filter }
.custom-cursor-element:hover ~ .cursor { transform: scale(10); opacity: 1; backdrop-filter: blur(10px) }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
```

### [Ripple Effect](https://codepen.io/freemqn/pen/YzoXZyr)

made with: @keyframes · pointer / mouse tracking

```css
.ripple { position: absolute; animation: ripple-effect 0.6s ease-out forwards }
to { opacity: 0 }
@keyframes ripple-effect animates width, height, opacity
```

```js
addEventListener('mousemove', (e) => {
```

### [Growing Circle on Hover](https://codepen.io/freemqn/pen/abgOJOZ)

on scroll: div.circle: transform+top | made with: transition · :hover · pointer / mouse tracking

```css
.circle { position: absolute; transform: translate(-50%, -50%); transition: width 0.3s ease, height 0.3s ease }
```

```js
addEventListener('mousemove', (e) => {
```

### [Follow the Cursor](https://codepen.io/freemqn/pen/QWXbpWY)

made with: transition · pointer / mouse tracking

```css
.cursor { position: absolute; transform: translate(-50%, -50%); transition: transform 0.1s ease }
```

```js
addEventListener('mousemove', (e) => {
```

### [Interactive Image Hover with Custom Cursor Animation](https://codepen.io/shyamtala003/pen/PorYGVz)

held: fixed div | on scroll: div.: transform+top | made with: position: fixed · GSAP · pointer / mouse tracking

```css
#cursor { position: fixed; top: 0 }
.img-container { position: relative }
.img-container img { position: absolute }
.img-container .overlay { position: absolute }
```

```js
addEventListener("mousemove", (e) => {
gsap.to(cursor, {
```

### [Spray Paint Trail](https://codepen.io/pleasedonotdisturb/pen/NWVZMya)

held: sticky nav | made with: position: sticky · mix-blend-mode · Lenis / smooth scroll · canvas 2D · scroll listener · pointer / mouse tracking · requestAnimationFrame

```css
canvas { position: absolute; top: 0 }
.container { position: relative; mix-blend-mode: exclusion }
nav { position: sticky; top: 2em; margin-bottom: 2em; text-transform: uppercase; mix-blend-mode: difference }
.header { position: relative }
.header:not(:last-child) { margin-bottom: 1em }
.hero-img { margin-bottom: 1em }
.copy p { margin-bottom: 1.25em }
```

```js
requestAnimationFrame(raf)
addEventListener("mousemove", function (event) {
addEventListener("scroll", function () {
```

### [SVG Cursor Trail](https://codepen.io/HackyG/pen/zYQaoJZ)

made with: pointer / mouse tracking

```css
body { text-transform: uppercase }
#svgCanvas { position: absolute }
```

```js
addEventListener('mousemove', (event) => {
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

### [custom mouse pointer](https://codepen.io/avikaco/pen/mdYxZRJ)

on scroll: div.: transform+top | on hover of a.: a.: color, div.: transform+top | made with: :hover · pointer / mouse tracking

```css
#pointer { background-position: -23px -16px }
#pointer.mouse-down { margin-top: -16px; background-position: center }
```

```js
addEventListener("mousemove", positionElement)
```

### [cursor](https://codepen.io/ithar/pen/VwOrxyE)

on scroll: div.pointer: transform+top ×3 | made with: @keyframes · pointer / mouse tracking

```css
.bubble { position: relative; top: 30px }
#pointer2 { position: absolute; top: 100px; animation: move1 5s infinite }
#pointer3 { position: absolute; top: 200px; animation: move2 10s infinite }
0% { transform: translate(10px, 10px) }
25% { transform: translate(-300px, 50px) }
50% { transform: translate(100px, 50px) }
100% { transform: translate(10px, 10px) }
0% { transform: translate(10px, 10px) }
50% { transform: translate(300px, 250px) }
75% { transform: translate(150px, 250px) }
100% { transform: translate(10px, 10x) }
@keyframes move1 animates transform
```

```js
addEventListener('mousemove', moveCursor)
```

### [Cursor Following](https://codepen.io/mustafauncuoglu/pen/PovJRPe)

on scroll: div.: transform+opacity, div.: transform+opacity+top | made with: :hover · GSAP · pointer / mouse tracking

```css
#container { position: relative }
#dot, #ball { position: absolute; top: 0 }
.center-link { position: relative }
.center-link:hover ~ #dot, .center-link:hover ~ #ball { opacity: 0 }
```

```js
addEventListener("mousemove", (e) => {
```

### [Sticky Text Button](https://codepen.io/mustafauncuoglu/pen/rNgzPJE)

on hover of div.btn: div.btn: background, div.btn_text: transform | made with: transition · :hover · pointer / mouse tracking

```css
.btn { transition: 0.2s ease }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseenter", (e) => {
addEventListener("mouseleave", (e) => {
```

### [Swipe in Style: Custom Swipe Cursor](https://codepen.io/mark_sottek/pen/rNgwEZz)

made with: :hover

```css
div { text-transform:uppercase }
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

### [Mouse button hover](https://codepen.io/JepardMay/pen/rNgmaZX)

held: fixed div.cursor | on scroll: svg.[object: transform, div.cursor: opacity+top | on hover of button.button: div.cursor: opacity+top | made with: position: fixed · transition · :hover · (hover: hover) gate · pointer / mouse tracking

```css
:root { --position-top: 50% }
.button { position: relative }
.button span { position: relative }
.button svg { margin-top: 0.4em; transition: transform ease-out 0.6s }
.button::before { position: absolute; top: var(--position-top); transform: translate3d(-50%, -50%, 0) scale(0); transition: transform ease-out 0.6s }
.button:hover::before { transform: translate3d(-50%, -50%, 0) scale(1) }
.button:hover svg { transform: translateX(10px) }
.cursor { position: fixed; top: var(--position-top); opacity: 0.5; transform: translate3d(-50%, -50%, 0); transition: opacity 0.6s ease-out 0.3s }
.cursor.transparent { opacity: 0; transition: opacity 0.6s ease-out }
```

```js
addEventListener("mousemove", (evt) => {
addEventListener("mouseleave", (evt) => {
```

### [Variable Font + Cursor Position](https://codepen.io/elias-proctor/pen/YzbZLgx)

on hover of a.btn: a.btn: background+color | made with: transition · :hover · backdrop-filter · GSAP · pointer / mouse tracking

```css
#custom-cursor:after { position: absolute; filter: blur(30px); -webkit-backdrop-filter: drop-shadow(2px 4px 6px black); backdrop-filter: drop-shadow(2px 4px 6px black); opacity: 0.4; transition: all 0.3s ease }
body { position: relative }
#wrapper { position: relative }
.text-container { position: relative; opacity: 0 }
.frame { position: relative }
.text-container { padding-top: 4.18vh }
.grid { position: absolute; top: 0; bottom: 0 }
.axis-wrapper { position: absolute; inset: 3vw 5rem }
.axis-line { transform: scale(0) }
.axis-line.horizontal { position: absolute }
.axis-line.vertical { position: absolute }
.label { position: absolute; opacity: 0 }
```

```js
gsap.timeline()
addEventListener("mousemove", updateText)
```

### [Custom Cursor using GSAP](https://codepen.io/mKaran243/pen/QWRKBXo)

on scroll: div.cursor-follower: transform+opacity+top, div.cursor: transform+opacity+top | made with: transition · :hover · mix-blend-mode · GSAP · pointer / mouse tracking

```css
.cursor-class, .cursor-follower, .cursor { position: absolute; mix-blend-mode: difference }
.cursor { transition: 0.3s ease transform, 0.2s linear opacity }
.cursor-follower { opacity: 0.3; transition: 0.6s cubic-bezier(0.75, -1.27, 0.3, 2.33) transform, 0.2s cubic-bezier(0.75, -0.27, 0.3, 1.33) opacity }
.btn { position: relative; transition: all 0.3s linear }
.btn span.btnSpan { position: absolute; top: 0; transform: translate(-50%, -50%); transition: width 0.7s ease, height 0.7s ease }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseenter", (e) => {
addEventListener("mouseleave", (e) => {
```

### [The Cursors](https://codepen.io/mustafauncuoglu/pen/pomEpmN)

on scroll: div.col-resize: background | made with: :hover

### [Awesome Cursor Animation on Mouse-move](https://codepen.io/WhiteHatDesigner/pen/gOJwOLG)

held: fixed a | on hover of a.: a.: transform+shadow+top | made with: position: fixed · @keyframes · transition · backdrop-filter · custom properties driven by JS · pointer / mouse tracking

```css
i { position: absolute; animation: animate 2s linear forwards }
0% { opacity: 1; transform: translate(0, 0) }
100% { opacity: 0; transform: translate(var(--x), var(--y)) }
@keyframes animate animates opacity, transform
```

```js
style.setProperty("--x", getRandomTransitionValue())
style.setProperty("--y", getRandomTransitionValue())
addEventListener("mousemove", spark)
```

### [Bob the blob cursor](https://codepen.io/mnjmaverick/pen/ExzKqOR)

on scroll: svg.[object: transform+top | made with: pointer / mouse tracking · requestAnimationFrame

```css
#blob { position: absolute; transform: translate(-50%, -50%) }
```

```js
addEventListener('mousemove', (event) => {
requestAnimationFrame(animate)
```

### [Circle Cursor with Mix-Blend-Mode](https://codepen.io/mustafauncuoglu/pen/PovZVwW)

held: fixed div.cursor__ball, fixed div.cursor__ball | on scroll: div.cursor__ball: transform+top ×2 | on hover of a.hoverable: div.cursor__ball: transform+top ×2 | made with: position: fixed · mix-blend-mode · GSAP · pointer / mouse tracking

```css
body a { border-bottom: 2px solid #fff; margin-top: 25px }
body .cursor__ball { position: fixed; top: 0; mix-blend-mode: difference }
body .cursor__ball circle { background-position: center center }
body .right a { border-bottom: 2px solid #000 }
```

```js
addEventListener("mousemove", onMouseMove)
addEventListener("mouseenter", onMouseHover)
addEventListener("mouseleave", onMouseHoverOut)
```

### [Interactive Custom Cursor](https://codepen.io/mustafauncuoglu/pen/VwOembm)

held: fixed div.custom-cursor, fixed div.custom-cursor-dot | on scroll: div.custom-cursor: transform+top, div.custom-cursor-dot: transform+top | on hover of li.gsap: div.custom-cursor: transform+opacity+top, div.custom-cursor-dot: transform+opacity+top | made with: position: fixed · :hover · GSAP · pointer / mouse tracking

```css
h1 { margin-bottom: 10px }
p:not(:last-child) { margin-bottom: 20px }
.custom-cursor, .custom-cursor-dot { position: fixed; top: 0; transform: translate(-50%, -50%); opacity: 0 }
```

```js
addEventListener("mousemove", init)
addEventListener("mousemove", (e) => {
gsap.to([cursor, dot], { scale: 1 })
gsap.to([cursor, dot], { opacity: 0 })
addEventListener("mouseleave", () => {
addEventListener("mouseenter", (e) => {
gsap.to([cursor, dot], {
addEventListener("mouseenter", () => {
```

### [Trippy SVG filter](https://codepen.io/Pedro-Ondiviela/pen/dyEoBwr)

on scroll: img.example: transform | made with: pointer / mouse tracking

```css
img { margin-bottom: 2rem; filter: url(#3d) }
.footer { position: absolute; bottom: 0; text-transform: uppercase }
```

```js
addEventListener("mousemove", mouseFunction)
```

### [Custom cursor](https://codepen.io/alexerlandsson/pen/xxNbMdd)

held: fixed div.cursor | on scroll: div.cursor: transform+top, div.cursor__pointer: transform+top | on hover of button.button: div.cursor: transform+top, div.cursor__pointer: transform+top | made with: position: fixed · transition · :hover · :has() · mix-blend-mode · pointer / mouse tracking

```css
.cursor { position: fixed; mix-blend-mode: difference }
.cursor__pointer { --_pointer-offset: -8px; transform: translate(-50%, -50%) translate(var(--_pointer-offset), var(--_pointer-offset)) scale(var(--cursor-scale, 1)); transition: transform 300ms cubic-bezier(0.47, 1.64, 0.41, 0.8) }
:has(button:hover) { --cursor-scale: 2 }
```

```js
addEventListener('mousemove', moveCursor)
addEventListener('mouseleave', hideCursor)
addEventListener('mouseenter', showCursor)
```

### [Track mouse position in forest in night](https://codepen.io/TidyCoder/pen/JjqoRoP)

held: fixed img | on scroll: img.: transform+top | made with: position: fixed · transition · backdrop-filter · pointer / mouse tracking

```css
img { position: absolute; top: 50vh }
#imgHere { position: fixed; top: 0; transition: 557ms all; transform: translate(-50%, -50%) }
```

```js
addEventListener("mousemove", function(e){
```

### [Interactive Mouse Cursor Tracker](https://codepen.io/dmmotionarts/pen/YzbPwgr)

held: fixed div.custom-cursor | on scroll: div.custom-cursor: transform+opacity+top, div.image-icon: opacity+top | on hover of a.item: div.video-icon: opacity+top, div.image-icon: opacity+top | made with: position: fixed · transition · pointer / mouse tracking

```css
.explain { position:absolute; bottom:0 }
.custom-cursor { position:fixed; transform: translate(-50%, -50%) scale(0.20); transition: opacity 0.3s, transform 0.3s; opacity:0 }
.video-icon, .image-icon, .link-icon { position:absolute; top:50%; transform:translate(-50%, -50%); opacity:0 }
.item[data-type="video"] { background-position:center center }
.item[data-type="image"] { background-position:center center }
.item[data-type="link"] { background-position:center center }
```

```js
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
addEventListener('mousemove', e => {
```

### [Forest filter cursor](https://codepen.io/TidyCoder/pen/yLWyeaG)

held: fixed div | made with: position: fixed · :hover · pointer / mouse tracking

```css
body:before { position: fixed; top: 0; filter: brightness(0.3); background-position: top }
a { text-transform: uppercase }
```

```js
addEventListener("mousemove", function(e){
```

### [Blur Custom Cursor](https://codepen.io/mustafauncuoglu/pen/NWVPKvK)

held: fixed div.cursor | made with: position: fixed · backdrop-filter · GSAP

```css
.cursor { position: fixed; top: 50%; transform: translate(-50%, -50%); backdrop-filter: blur(10px) }
```

### [Digital Rain Particles](https://codepen.io/Vlatko-Magjer/pen/BaeBmyp)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```js
addEventListener("mousemove", this.update)
requestAnimationFrame(digitalRain.tick)
```

### [Cursor Star Trail](https://codepen.io/Jake-Hehir/pen/LYoPYzp)

made with: @keyframes

```css
.glow-point { position: absolute; box-shadow: 0rem 0rem 1.2rem 0.6rem rgb(var(--glow-rgb)) }
.star { position: absolute; animation-duration: 1500ms; animation-fill-mode: forwards }
0% { transform: translate(0px, 0px) rotateX(45deg) rotateY(30deg) rotateZ(0deg) scale(0.25); opacity: 0 }
5% { transform: translate(10px, -10px) rotateX(45deg) rotateY(30deg) rotateZ(0deg) scale(1); opacity: 1 }
100% { transform: translate(25px, 200px) rotateX(180deg) rotateY(270deg) rotateZ(90deg) scale(1); opacity: 0 }
0% { transform: translate(0px, 0px) rotateX(-20deg) rotateY(10deg) scale(0.25); opacity: 0 }
10% { transform: translate(-10px, -5px) rotateX(-20deg) rotateY(10deg) scale(1); opacity: 1 }
100% { transform: translate(-10px, 160px) rotateX(-90deg) rotateY(45deg) scale(0.25); opacity: 0 }
0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(45deg) scale(0.5); opacity: 0 }
15% { transform: translate(7px, 5px) rotateX(0deg) rotateY(45deg) scale(1); opacity: 1 }
100% { transform: translate(20px, 120px) rotateX(-180deg) rotateY(-90deg) scale(0.5); opacity: 0 }
@keyframes fall-1 animates transform, opacity
```

### [Mix Blend Mode Buttons](https://codepen.io/mustafauncuoglu/pen/oNOKrJY)

on hover of button.: span.: transform+top | made with: transition · :hover · :focus-visible · mix-blend-mode · custom properties driven by JS · pointer / mouse tracking

```css
button { position: relative; transition: background 0.1s ease-in-out, transform 0.1s ease-in-out; will-change: transform, background }
button .back { position: absolute; inset: 0 }
.back > span { top: calc(var(--y, 0) * 1px); transform: translate(-50%, -50%) scale(var(--active, 0)); transition: transform 0.1s ease-in-out, left 0.1s ease-in-out, top 0.1s ease-in-out; position: absolute; mix-blend-mode: difference }
button:active .back > span { transition: transform 0.075s ease-in-out }
```

```js
style.setProperty("--x", x - bounds.left)
style.setProperty("--y", y - bounds.top)
addEventListener("pointermove", UPDATE))
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

### [Neon Cursor Effect | 02](https://codepen.io/lloret-adrien/pen/ZEZdrVm)

held: fixed canvas.orb-canvas | made with: position: fixed · transition · :hover · prefers-reduced-motion · mix-blend-mode · custom properties driven by JS

```css
canvas:not(.orb-canvas) { mix-blend-mode: color-dodge }
.orb-canvas { position: fixed; top: 0 }
.overlay { box-shadow: 0 0.75rem 2rem 0 rgba(0, 0, 0, 0.1) }
.overlay__title { margin-bottom: 2rem }
.overlay__description { margin-bottom: 3rem }
.overlay__btn { transition: transform 150ms ease }
.overlay__btn:hover { transform: scale(1.05) }
.overlay__title { margin-bottom: 1.5rem }
.overlay__description { margin-bottom: 2.5rem }
.overlay__btn:first-child { margin-bottom: 1rem }
```

```js
style.setProperty("--hue", this.hue)
style.setProperty( "--hue-complimentary1",
style.setProperty( "--hue-complimentary2",
addEventListener("mouseleave", () => {
```

### [CURSORS](https://codepen.io/ismadvl/pen/wvZLaEr)

on hover of a.: a.: color+shadow+top | made with: @keyframes · transition · :hover · (hover: hover) gate

```css
a { box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3); transition: all .5s }
a:hover { box-shadow: 5px 20px 5px rgba(0, 0, 0, 0.3) }
.glow-on-hover { position: relative }
.glow-on-hover:before { position: absolute; top: -2px; filter: blur(5px); animation: glowing 20s linear infinite; opacity: 0; transition: opacity .3s ease-in-out }
.glow-on-hover:hover:before { opacity: 1 }
.glow-on-hover:after { position: absolute; top: 0 }
0% { background-position: 0 0 }
50% { background-position: 400% 0 }
100% { background-position: 0 0 }
h1 { padding-bottom: var(--s); transition: 0.5s }
@keyframes glowing animates background-position
```

### [Circle Cursor w/ JS + CSS](https://codepen.io/jagcruz/pen/LYvapQJ)

on scroll: h1.title: color, p.content: color | made with: transition · :hover · custom properties driven by JS · pointer / mouse tracking

```css
&::before { position: absolute; top: -10%; transform: scale(1); transition: transform 0.35s ease-out }
& .title { margin-bottom: 0.5em }
&::before { transform: scale(30) }
& .title, & .content { transition: all 0.5s ease-out }
&::before, &::after { position: absolute; top: 50%; transform: translate3d( calc(var(--cursor-x) - 50%), calc(var(--cursor-y) - 50%), 0 ) }
&::after { opacity: 0.3; transition: width 0.3s, height 0.3s, opacity 0.3s }
&::before { transition: all 200ms ease-out }
.circle-cursor, .cursor { opacity: 0 }
```

```js
addEventListener("mousemove", (e) => {
style.setProperty("--cursor-x", `${x}px`)
style.setProperty("--cursor-y", `${y}px`)
addEventListener("mouseleave", () => cursor.classList.remove("hover"))
```

### [Sticky Cursor](https://codepen.io/meluiz/pen/RwOEjOr)

on scroll: div.cursor: transform+top | made with: transition · pointer / mouse tracking · requestAnimationFrame

```css
html, body { position: relative }
.cursor { position: absolute; top: var(--cursor-y, 0px); transform: translate(-50%, -50%) }
.cursor.outer { transition: 50ms linear; transform: translate(-50%, -50%) scale(var(--scale-x, 1), var(--scale-y)) rotate(var(--angle)) }
```

```js
requestAnimationFrame(this.#loop.bind(this))
addEventListener("mousemove", (event) => {
addEventListener("mouseenter", this.#getAttributes)
addEventListener("mouseleave", this.#clear)
```

### [Sticky cursor](https://codepen.io/EspressoCat/pen/poBQpbq)

held: fixed div.cursor, fixed svg.[object | on scroll: div.cursor: transform+top | on hover of button.btn: button.btn: transform, div.: transform+top, div.cursor: transform+top | made with: position: fixed · :hover · mix-blend-mode · GSAP · pointer / mouse tracking

```css
[data-hover-bounds] { position: absolute; top: 0; inset: 0 }
[data-hover-bounds] { transform: scale(4) }
.cursor { position: fixed; top: 0; transform: translate(-50%, -50%); mix-blend-mode: difference }
.cta { position: fixed; top: -999px }
```

```js
gsap.to(this.el, {
addEventListener("pointermove", (event) => {
addEventListener("pointermove", onMouseMove)
```

### [Custom Cursor](https://codepen.io/DamianS-eng/pen/qBwJbar)

made with: canvas 2D · pointer / mouse tracking

```css
canvas { position: relative }
```

```js
addEventListener('pointermove', function (e) {
```

### [Star Trails](https://codepen.io/Pixelsiam/pen/zYXaQXg)

held: fixed div | made with: position: fixed · transition · clip-path · pointer / mouse tracking

```css
#star-container { position: fixed; top: 0 }
.star { position: absolute; clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); opacity: 0.8; transition: transform 0.5s ease-out, opacity 0.5s ease-out }
```

```js
addEventListener('mousemove', function(e) {
```

### [3D PIXEL CURSOR](https://codepen.io/Tcip/pen/GRLdExP)

made with: :hover

```css
div { position: relative; margin-bottom: 2rem }
div:last-child { margin-bottom: 0 }
div p { position: absolute; top: 50%; transform: translate(-50%, -50%) }
div p:after { position: absolute; top: -30px }
._3d-pixel-cursor__arrow { background-position: center }
._3d-pixel-cursor__pointer { background-position: center }
```

### [Cursor Directional Hover Effect](https://codepen.io/siwuxie/pen/eYoMeLE)

made with: transition · :hover · custom properties driven by JS

```css
body #btn { position: relative }
body #btn::after { position: absolute; top: var(--y, 0px); translate: -50% -50%; transition: 0.6s ease-out, top 0s, left 0s }
```

```js
style.setProperty("--x", `${x}px`)
style.setProperty("--y", `${y}px`)
```

### [Worm Cursor](https://codepen.io/vuolter/pen/bGJLgBd)

held: fixed svg.[object, fixed svg.[object, fixed svg.[object | made with: position: fixed · GSAP · pointer / mouse tracking

```js
addEventListener("pointermove", updatePointer, { passive: true })
gsap.to(line, {
```

### [Responsive interactive mouse cursor effect](https://codepen.io/sirfros/pen/zYXRBOd)

made with: transition · :hover

```css
h1 { position: absolute; top:50%; transform:translate(-50%, -50%) }
.boxWrapper { padding-top:4%; position: relative }
.box { position:absolute }
.boxWrapper .box { transition: all 10s ease }
.box:first-child { top:0 }
.box:nth-child(2) { top:0 }
.box:nth-child(3) { bottom:0 }
.box:nth-child(4) { bottom:0 }
.boxWrapper:hover .box { transition: all 0.1s ease }
.boxWrapper { padding-top:5% }
.boxWrapper { padding-top:10% }
```

### [CPChallenge: Colorful bubble trailers](https://codepen.io/tommyho/pen/oNOoPvj)

held: fixed div.modal | on hover of button.: button.: transform+shadow+top | made with: position: fixed · @keyframes · transition · :hover · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
.modal { position: fixed; top: 0 }
.modal-content { box-shadow: inset 0px 0px 5px 5px rgba(0,0,0,0.3); animation: fadeInModal 1s ease-in-out forwards }
&:hover { box-shadow: rgba(44,187,99,.35) 0 -25px 18px -14px inset,rgba(44,187,99,.25) 0 1px 2px,rgba(44,187,99,.25) 0 2px 4px,rgba(44,187,99,.25) 0 4px 8px,rgba(44,187,99,.25) 0 8px 16px,rgba(44,187,99,.25) 0 16px 32px; transform }
from { opacity: 0 }
to { opacity: 1 }
@keyframes fadeInModal animates opacity
```

```js
addEventListener("mousemove", function(event){
requestAnimationFrame(animate)
```

### [Untitled](https://codepen.io/aowgiwdq-the-lessful/pen/mdgRZMQ)

made with: position: fixed · @keyframes · transition · :hover · mix-blend-mode · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
body { -webkit-transition: all 300ms linear; transition: all 300ms linear }
.cursor, .cursor2, .cursor3 { position: fixed; transform: translateX(-50%) translateY(-50%); top: 50%; mix-blend-mode: difference; -webkit-transition: all 300ms linear; transition: all 300ms linear }
.cursor2,.cursor3 { -webkit-transition:all 0.3s ease-out; transition:all 0.3s ease-out }
.cursor2.hover, .cursor3.hover { -webkit-transform:scale(2) translateX(-25%) translateY(-25%); transform:scale(2) translateX(-25%) translateY(-25%) }
.cursor2 { box-shadow: 0 0 22px rgba(255, 255, 255, 0.6) }
.cursor2.hover { box-shadow: 0 0 12px rgba(255, 255, 255, 0.2) }
.section { position: relative }
.cd-header { position: fixed; top:0 }
.header-wrapper { position: relative }
.logo-wrap { position: absolute; top: 40px }
.logo-wrap a { text-transform: uppercase; transition : all 0.3s ease-out }
.logo-wrap a:hover { opacity: 0.9 }
```

```js
addEventListener("mousemove", function(n) {
```

### [Custom Cursor](https://codepen.io/Sanskrati01/pen/mdgRYxB)

made with: transition · mix-blend-mode · pointer / mouse tracking

```css
.cursor { mix-blend-mode: difference; position: absolute; transition: all linear 0.1s }
```

```js
addEventListener("mousemove", function(pos){
```

### [Letters mouse follow](https://codepen.io/supah/pen/vYMGREY)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```js
addEventListener('mousemove', onMouseMove)
requestAnimationFrame(animate)
```

### [Custom cursor examples](https://codepen.io/perpetual-education/pen/ZEZbQQO)

made with: nothing recognised — read the code

### [focus](https://codepen.io/Atuatu_Hhakumai/pen/qBwBLYG)

made with: position: fixed · GSAP · pointer / mouse tracking

```css
body { background-position: center }
* { will-change: filter; transform: translateZ(0); transform: translate3d(0,0,0); filter: blur(0px) }
.cursor-background { position: fixed; background-position: center }
.image-cursor { position: fixed; top: 0; box-shadow: 0 0 8px 0px #111; opacity: 0 }
```

```js
addEventListener('mousemove', (event) => {
gsap.to(imageCursor, {
gsap.to(image, {
```

### [Flying pig of night](https://codepen.io/cwglyyai-the-bold/pen/GReLpwy)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
main { position: relative }
.pig { position: absolute }
```

```js
requestAnimationFrame(frame)
addEventListener('mousemove', (e) => {
```

### [SO: cursor svg clock](https://codepen.io/herrstrietzel/pen/PoLVqjp)

held: fixed input | made with: position: fixed · pointer / mouse tracking

```css
#pc { position: fixed; top: 50% }
```

```js
addEventListener("mousemove", function (event) {
```

### [Elastic Cursor Follow Animation](https://codepen.io/micke_berg/pen/rNRqMGP)

held: fixed div.circle | made with: position: fixed · pointer / mouse tracking · requestAnimationFrame

```css
.circle { position: fixed; top: calc(var(--circle-size) / 2 * -1) }
```

```js
addEventListener("mousemove", (e) => {
requestAnimationFrame(tick)
```

### [Cursor Movement](https://codepen.io/ambresh20/pen/BabVGYR)

held: fixed div.links | made with: position: fixed · :hover · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
.links { position: fixed; bottom: 10px }
```

```js
addEventListener("mousemove", e => {
requestAnimationFrame(update)
```

### [Menu Hover Effect Gsap](https://codepen.io/uzitrake/pen/poYLgwy)

made with: position: fixed · transition · :hover · mix-blend-mode · GSAP · Lenis / smooth scroll · pointer / mouse tracking · requestAnimationFrame

```css
.frame { position: relative; text-transform: uppercase }
.frame__demos a { border-bottom: 1px solid currentColor; transition: 0.2s border-color }
.menu { position: relative }
.menu__item { position: relative }
.menu__item::before { position: absolute; top: 20%; opacity: 0; transform: translateX(-1rem); transition: transform 0.3s, opacity 0.3s }
.menu__item:hover::before { opacity: 1; transform: translateX(0) }
.menu__item-text { position: relative }
.menu__item-textinner { text-transform: uppercase }
.js .menu__item-textinner { transform: translateY(100%) }
.menu__item-sub { position: relative; opacity: 0; transform: translateX(-1rem); transition: transform 0.3s, opacity 0.3s; mix-blend-mode: difference }
.menu__item:hover .menu__item-sub { opacity: 1; transform: translateX(0) }
.menu__item-sub::before { position: absolute; top: 50%; transform: scale3d(0,1,1); transition: transform 0.3s }
```

```js
addEventListener("mousemove", (ev) => (mouse = getMousePos(ev)))
gsap.to(this.DOM.el, {
requestAnimationFrame(() => this.render())
addEventListener("mousemove", this.onMouseMoveEv)
addEventListener("mousemove", (ev) => (mousepos = getMousePos(ev)))
addEventListener("mouseenter", this.mouseenterFn)
addEventListener("mouseleave", this.mouseleaveFn)
gsap.to(
```

### [Center of Gravity & Mouse Interaction w/ Spline](https://codepen.io/gusevdigital/pen/xxBWwVG)

held: fixed div.loader, fixed div.big-circle, fixed div.small-circle | on scroll: div.: transform+top ×4, div.word: transform+top ×3, div.big-circle: transform+top, div.small-circle: transform+top, header.: opacity, div.word: transform | on hover of li.: div.: transform+top ×4, div.big-circle: transform+top, div.small-circle: transform+top | made with: position: fixed · @keyframes · transition · :hover · GSAP · pointer / mouse tracking · requestAnimationFrame

```css
.loader { position: fixed; top: 50%; transform: translate(-50%, -50%) }
.loader div { position: absolute; animation: loading-animation 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite }
.loader div:nth-child(1) { animation-delay: -0.45s }
.loader div:nth-child(2) { animation-delay: -0.3s }
.loader div:nth-child(3) { animation-delay: -0.15s }
0% { transform: rotate(0deg) }
100% { transform: rotate(360deg) }
.cursor .big-circle, .cursor .small-circle { position: fixed; top: calc(var(--circle-size) / 2 * -1) }
.hero { position: relative }
.hero spline-viewer { position: absolute; inset: 0; opacity: 0 }
header, .content { position: relative }
header { opacity: 0 }
```

```js
gsap.timeline()
addEventListener('mousemove', e => {
requestAnimationFrame(tick)
addEventListener('mousemove', (e) => {
gsap.to(button, {
addEventListener('mouseleave', () => {
```

### [Trail Cursor](https://codepen.io/agarciaBCN/pen/YzgYYmP)

made with: pointer / mouse tracking · requestAnimationFrame

```css
body { position: relative }
.orbiting-sphere { background-position: center; top: -5px; position: absolute }
.surface { position: absolute }
.brillo { position: absolute; top: 4px }
.debug-values { position: absolute }
```

```js
addEventListener("mousemove", logKey)
requestAnimationFrame(updateSpherePosition)
```

### [Custom Cursor with PNG image](https://codepen.io/reikasan/pen/eYXGgOB)

made with: transition

```css
a { transition: all 0.2s ease-out }
section, footer { position: relative }
.button { margin-top: 2rem }
.button { margin-top: 1rem }
.container .side-image { position: absolute; top: 130px }
.container .side-image { bottom: 5vw; top: unset }
div img.butterfly:last-of-type { margin-bottom: 10px }
```

### [Hive - Beware of the bees!](https://codepen.io/Pedro-Ondiviela/pen/MWxEYKX)

on scroll: div.bee: opacity+top ×4 | made with: @keyframes · pointer / mouse tracking

```css
.hive-line { position: absolute; box-shadow: 2rem -0.5rem 1rem 0 rgba(0, 0, 56, 0.5) }
.hive-line--provoked { animation: swing; animation-duration: 1s; animation-iteration-count: 2 }
0%, 100% { transform: rotate(0deg) }
33.33% { transform: rotate(-10deg) }
66.66% { transform: rotate(10deg) }
.hive-text { position: absolute; top: 1rem }
.hive-text:before { position: absolute; bottom: -2rem; transform: rotate(-45deg) }
.hive { position: relative; margin-top: 3rem; box-shadow: 2rem 1rem 2rem 0 rgba(0, 0, 56, 0.5) }
.hive--provoked { animation: swing; animation-duration: 1s; animation-iteration-count: 2 }
0%, 100% { transform: rotate(0deg) }
33.33% { transform: rotate(-10deg) }
66.66% { transform: rotate(10deg) }
```

```js
addEventListener('mousemove', cursorFunction)
```

### [Gradial Cursor](https://codepen.io/shshaw/pen/jOJLaBV)

made with: @keyframes · mix-blend-mode · custom properties driven by JS · pointer / mouse tracking

```css
.gradient { position: absolute; top: 0; -webkit-animation: rotate 20s linear infinite; animation: rotate 20s linear infinite; background-position: center center; --offset-x: calc(var(--x) * 1px); --offset-y: calc(var(--y) * 1px); ba }
h1 { mix-blend-mode: overlay }
@keyframes rotate animates --turn
```

```js
addEventListener("mousemove", (e) => {
style.setProperty("--x", e.clientX)
style.setProperty("--y", e.clientY)
```

### [Custom Cursor Stalker](https://codepen.io/reikasan/pen/VwRzeZL)

held: fixed div.mouse-stalker | on scroll: div.mouse-stalker: transform+top, div.mouse-stalker--circle: transform+background+top, p.mouse-stalker--text: opacity+top | on hover of button.button: div.mouse-stalker: transform+top, div.mouse-stalker--circle: transform+background+top, p.mouse-stalker--text: opacity+top | made with: position: fixed · transition · mix-blend-mode · pointer / mouse tracking · requestAnimationFrame

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

### [Navigation Menu with Animated Cursor](https://codepen.io/Suneharakhan/pen/xxBLbvE)

held: fixed div.cursor | made with: position: fixed · transition · :hover · mix-blend-mode

```css
.menu-link { transition: all 1s linear }
.cursor { position: fixed; transition: 0.1s; transform: translate(-50%, -50%); mix-blend-mode: difference }
li:hover ~ .cursor { transform: scale(4) }
.navbar-menus { opacity: 0; position: fixed; top: 0; transition: 0.25s ease }
.sidebar-open .navbar-menus { opacity: 1 }
.navbar-menus .menu-list { transition: 0.25s ease; transform: translateX(-100%) }
.sidebar-open .navbar-menus .menu-list { transform: translateX(0) }
.navbar-menus .menu-link { transition: 0.3s ease }
```

### [Neumorphism RGB Cursor Styles](https://codepen.io/festive_world/pen/dyrRZZx)

on hover of a.custom-button: a.custom-button: shadow | made with: transition · :hover · pointer / mouse tracking

```css
.custom-button { transition: cursor 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease }
.custom-button:hover { box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1) }
.custom-button.context-menu { position: relative }
.context-menu { position: absolute; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) }
.context-menu button { margin-bottom: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) }
```

```js
addEventListener("mousemove", handleMouseMove)
```

### [window](https://codepen.io/Atuatu_Hhakumai/pen/gOEwRoQ)

made with: position: fixed · transition · pointer / mouse tracking

```css
* { transform: translate3d(0, 0, 0) }
#cursor { position: fixed; transition: transform ease-out 70ms }
#stalker { position: fixed; margin-top: -15px; box-shadow: 0px 0px 9px 10px #d5d5d522; transition: transform ease-out 160ms }
.window { position: relative; top: 0% }
.foreground { position: absolute }
#foreground { position: absolute; filter: blur(0.5px) }
#background { position: absolute; top: -10%; filter: blur(2px); transition: transform ease-out 150ms }
```

```js
addEventListener('mousemove', event => {
```

### [Cursor phobic moving particles in Canvas](https://codepen.io/saheeranas/pen/OJqRMMJ)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```js
addEventListener("mousemove", function (evt) {
addEventListener("mouseleave", function (evt) {
requestAnimationFrame(animate)
```

### [Following cursor (Small circle inside big circle)](https://codepen.io/BluishGlacier/pen/OJqRLRj)

held: fixed div.cursor, fixed div.cursor2 | made with: position: fixed · transition · :hover · pointer / mouse tracking

```css
.cursor { position: fixed; top: 50%; transform:translate(-50%, -50%); transition: all .1s }
.cursor2 { position: fixed; top: 50%; transform:translate(-50%, -50%); transition: .15s }
.content:hover~.cursor { transform: translate(-50%, -50%) scale(1.5); opacity: .4 }
.content:hover~.cursor2 { opacity: 0 }
```

```js
addEventListener("mousemove", function(e){
```

### [HTML Canvas animation with cursor tracking](https://codepen.io/prajotsurey/pen/oNVLrGE)

held: fixed canvas, fixed canvas, fixed canvas, fixed canvas | made with: position: fixed · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
#canvas2 { position: fixed; top: 60% }
#canvas3,#canvas4,#canvas5 { position: fixed; top: 0 }
```

```js
addEventListener('mousemove', e => {
requestAnimationFrame(() => {
```

### [Animated canvas grid following mouse](https://codepen.io/prajotsurey/pen/oNVLrep)

made with: canvas 2D · pointer / mouse tracking

```js
addEventListener('mousemove', e=> {
```

### [GSAP mouse move reveal animation](https://codepen.io/prajotsurey/pen/ZEPOdeQ)

made with: GSAP · pointer / mouse tracking

```css
.item { position: absolute; transform: scale(0) }
```

```js
gsap.registerPlugin(Observer)
gsap.to(pos, {
gsap.to(items[index], {
gsap.timeline()
addEventListener("mousemove", (e) => {
```

### [Cursor tracking experiment - HTML Canvas](https://codepen.io/saheeranas/pen/WNmwqpb)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```js
addEventListener("mousemove", function (evt) {
requestAnimationFrame(drawAll)
```

### [Elastic Custom Cursor Following Mouse (Squeeze and Rotate) w/ JavaScript](https://codepen.io/gusevdigital/pen/MWxyXRa)

held: fixed div.circle | on scroll: div.circle: transform+top | made with: position: fixed · pointer / mouse tracking · requestAnimationFrame

```css
.circle { position: fixed; top: calc(var(--circle-size) / 2 * -1) }
```

```js
addEventListener('mousemove', (e) => {
requestAnimationFrame(tick)
```

### [Pacman cursor tracker](https://codepen.io/LuisAldrichGuz/pen/abMNNOv)

made with: @keyframes · GSAP · requestAnimationFrame

```css
.follower { transform: translate(-50%, -50%); position: absolute; top: -25px }
.follower:before { border-top: 30px solid #000; position: absolute; top: 70%; rotate: 90deg; animation: scaleTriangle 0.7s ease-in-out infinite }
0%, 100% { transform: translate(-40%, -70%) }
50% { transform: translate(-40%, 67%) }
.trail-circle { position: absolute }
@keyframes scaleTriangle animates transform
```

```js
requestAnimationFrame(draw)
```

### [Cutom Cursor](https://codepen.io/jaisayush/pen/rNRxZLQ)

held: fixed div, fixed div | on scroll: div.: transform+top ×2 | made with: position: fixed · transition · pointer / mouse tracking

```css
#cursor { position: fixed; transition: transform ease-out 10ms }
#stalker { position: fixed; margin-top: -15px; opacity: 30%; transition: transform ease-out 100ms }
```

```js
addEventListener("mousemove", (event) => {
```

### [cursor stalker](https://codepen.io/Atuatu_Hhakumai/pen/zYbrYMM)

made with: position: fixed · transition · pointer / mouse tracking

```css
#cursor { position: fixed; transition: transform ease-out 10ms }
#stalker { position: fixed; margin-top: -15.5px; transition: transform ease-out 120ms }
```

```js
addEventListener('mousemove', (event) => {
```

### [dot-follow-cursor](https://codepen.io/siwuxie/pen/PoLPWrm)

on scroll: div.: opacity+top ×2 | on hover of a.: div.: transform+background+top | made with: transition · :hover · :has() · pointer / mouse tracking · requestAnimationFrame

```css
body { position: relative }
#cursor-dot { position: absolute; top: 0; opacity: 0; transform: translate(-50%, -50%); transition: opacity 1s linear }
#cursor-circle { position: absolute; opacity: 0; transform: translate(-50%, -50%); transition: background-color 0.3s linear, border 0.3s linear, width 0.2s linear, height 0.2s linear, opacity 0.7s 0.3s linear }
a { transition: 0.3s linear }
```

```js
addEventListener("mousemove", (e) => {
requestAnimationFrame(circleAnimation)
addEventListener("mouseleave", (e) => {
```

### [Trail Effect](https://codepen.io/MinerStudio/pen/VwRvZWB)

made with: transition · pointer / mouse tracking

```css
.trail { position: absolute; opacity: 0.8; transition: opacity 0.5s ease-out }
```

```js
addEventListener('mousemove', (e) => {
```

### [Click Spark](https://codepen.io/hexagoncircle/pen/bGZdWyw)

made with: custom properties driven by JS

```js
style.setProperty("--click-spark-color", e.target.value)
```

### [Following Eyes](https://codepen.io/ggs_go_next/pen/dyrPZMP)

on scroll: div.: transform+top ×2, div.eye1: transform | made with: pointer / mouse tracking

```css
.eye1 { position: absolute; top: calc(50% - 67.5px) }
#eyew1 { top: 50%; position: absolute }
#eyelidtop { border-bottom: 5px solid black; position: relative; top: -28% }
#eyelidbot { border-top: 5px solid black; position: relative; top: -10% }
```

```js
addEventListener('mousemove', e => {
```

### [Custom Cursors for Website. using html, css and js.](https://codepen.io/davidreddy293/pen/gOEbbeZ)

held: fixed div.cursor, fixed div.cursor-follower | on hover of a.: a.: background, div.cursor: transform+background+top | made with: position: fixed · transition · :hover · pointer / mouse tracking · requestAnimationFrame

```css
.heading { margin-bottom: 1rem }
.links { margin-top: 1rem; margin-bottom: 1rem }
.links a { transition: all 0.3s ease-in-out; margin-top: 1rem }
.cursor { position: fixed; transform: translate(-50%, -50%) }
.cursor-follower { position: fixed; transform: translate(-50%, -50%) }
.default-cursor-follower { opacity: 0.2 }
.link-cursor-follower { opacity: 1 }
```

```js
addEventListener("mousemove", function (e) {
requestAnimationFrame(animate)
```

### [Circle Following Mouse Cursor JS](https://codepen.io/gusevdigital/pen/ZEPEbgb)

held: fixed div.circle | made with: position: fixed · pointer / mouse tracking · requestAnimationFrame

```css
.circle { position: fixed; top: calc(-1 * var(--cursor-size) / 2) }
```

```js
addEventListener('mousemove', e => {
requestAnimationFrame(tick)
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

### [Stylish Cursor Effect for Navigation Menu](https://codepen.io/Suneharakhan/pen/LYqMPqK)

held: fixed div.cursor | on hover of li.: div.cursor: transform+top | made with: position: fixed · transition · :hover · mix-blend-mode

```css
ul { position: relative }
a { position: relative; text-transform: capitalize; transition: 0.2s }
.cursor { position: fixed; transition: 0.1s; transform: translate(-50%, -50%); mix-blend-mode: difference }
li:hover ~ .cursor { transform: scale(4) }
```

### [Untitled](https://codepen.io/jhirschberg70/pen/vYbrZBa)

made with: custom properties driven by JS

```css
#caret { filter:invert(1) }
#input { box-shadow:none }
```

```js
style.setProperty("--col", inputStartCol + caretPosition)
style.setProperty("--col", inputStartCol + caretPosition - 1)
```

### [Simple Mouse Cursor Animation](https://codepen.io/saaim-k/pen/ExrRygw)

held: fixed div.cursor | on scroll: div.ring: transform+top ×2 | made with: position: fixed · transition

```css
.cursor { position: fixed; top: 0 }
.cursor div { position: absolute }
.cursor div div { animation: pulse 2.5s linear infinite; box-shadow: 0 0 50px 5px #d7abff6e }
.cursor div:nth-child(1) { transition: transform 0.2s ease-out }
.cursor div:nth-child(2) { transition: transform 0.1s ease-out }
```

### [Untitled](https://codepen.io/jhirschberg70/pen/MWLXgqw)

on scroll: span.: filter | made with: custom properties driven by JS

```css
#caret { filter:invert(1) }
#input { box-shadow:none }
```

```js
style.setProperty("--col", inputStartCol + caretPosition)
style.setProperty("--col", inputStartCol + caretPosition - 1)
```

### [Thor hammer Cursor](https://codepen.io/valdyl/pen/gOqzbVe)

on scroll: svg.[object: transform+top | made with: @keyframes · transition · pointer / mouse tracking

```css
body { position:relative }
.controls { position:absolute; bottom: 0 }
#wip { position:absolute }
svg { position:absolute; top:0 }
.shadow { opacity:0 }
#shadow { filter: blur(8px) }
#shadow2 { filter: blur(40px) }
.shadow.charged { transition : 300ms opacity ease; animation: glowing .8s linear infinite alternate }
.thunder-shadow { filter: blur(20px) }
from { transform: scale(1); opacity: 1 }
to { transform: scale(1); opacity: .4 }
@keyframes glowing animates transform, opacity
```

```js
addEventListener('mousemove', handleMove)
```

### [Mause Move Animation](https://codepen.io/Pragatitendolkar/pen/JjxMzGV)

on scroll: div.center: background+color, h1.: color | made with: transition · GSAP · pointer / mouse tracking

```css
.center { position: absolute; top: 50%; transform: translate(-50%, -50%); transition:0.5s all; box-shadow:1px 1px 100px -10px #000 }
```

```js
addEventListener("mousemove", function (dets) {
addEventListener("mouseleave", function (dets) {
```

### [iPadOS like dynamic cursor](https://codepen.io/tijnjh/pen/LYqeRom)

made with: transition · backdrop-filter · custom properties driven by JS · pointer / mouse tracking

```css
&.hovering { scale: 1.1; opacity: 0 }
&.being-hovered { scale: 1.1 }
.fancy-hover-overlay { translate: -33% -33%; background-position: center center }
```

```js
addEventListener("mousemove", (event) => {
style.setProperty("--mouse-x", mouseX + "px")
style.setProperty("--mouse-y", mouseY + "px")
addEventListener("mouseenter", () => {
style.setProperty("--object-height", e.offsetHeight + "px")
style.setProperty("--object-width", e.offsetWidth + "px")
style.setProperty("--object-radius", elementRadius)
addEventListener("mousemove", () => {
```

### [Simple Cursor Trail - HTML, CSS and JS only](https://codepen.io/icka-dev/pen/ZEwJJzL)

on scroll: circle.[object: transform+top ×2 | made with: pointer / mouse tracking

```css
#animated-icon { position: absolute }
```

```js
addEventListener('mousemove', updateIconPosition)
```

### [fluid container html css javascript](https://codepen.io/manaregr8/pen/NWogZbm)

held: fixed div | made with: position: fixed · @keyframes

```css
#bubble-wrapper { position:fixed; bottom:0px }
.bubble { position:absolute; top:100%; animation:wave 2s ease-in-out infinite }
0% { transform: translate(-50%,0%) }
50% { transform: translate(-50%,-20%) }
100% { transform: translate(-50%,0%) }
@keyframes wave animates transform
```

### [Dancing bubble](https://codepen.io/Pedro-Ondiviela/pen/OJdmGmX)

on scroll: div.bubble: transform+top | made with: @keyframes · transition · pointer / mouse tracking

```css
body { background-position: center }
.bubble { position: relative; transform: translate(calc(var(--left) - 50vw), calc(var(--top) - 50vh)); transition: transform 2s ease-in-out; animation: bubble-waving; animation-duration: 5s; animation-timing-function: ease-in-out; }
.bubble:before { position: absolute; top: 0; background-position: center; background-position: calc(10rem - var(--left)) calc(10rem - var(--top)); opacity: 0.8; transition: background-position 2s ease-in-out; filter: blur(5px); animation }
0%, 100% { transform: scale(-1, -1.2) }
20% { transform: scale(-1.2, -1) }
40% { transform: scale(-1, -1.2) }
60% { transform: scale(-1, -1) }
80% { transform: scale(-1.2, -1.2) }
.bubble__rainbow { position: absolute; top: 0 }
.bubble__white { position: absolute; top: 0 }
.bubble__bright-circle { position: absolute; animation: bubble-waving; animation-duration: 3s; animation-timing-function: ease-in-out; animation-iteration-count: infinite }
.bubble__bright-circle--first { top: 5% }
```

```js
addEventListener('mousemove', mouseFunction)
```

### [Cartoon character - following you](https://codepen.io/Pedro-Ondiviela/pen/BaMRQyY)

made with: @keyframes · transition · pointer / mouse tracking

```css
.smiley { position: relative }
.smiley__wrapper { position: relative; top: -1rem }
.smiley__wrapper--left .smiley__nose { box-shadow: -4px 4px 0 0 #12486B }
.smiley__wrapper--left .smiley__neck { background-position: 80% 0 }
.smiley__wrapper--right .smiley__nose { box-shadow: 4px 4px 0 0 #12486B }
.smiley__wrapper--right .smiley__neck { background-position: 20% 0 }
.smiley__wrapper--top .smiley__face { top: 10% }
.smiley__wrapper--top .smiley__hair-background { top: 5% }
.smiley__wrapper--top .smiley__hair { top: -38% }
.smiley__wrapper--top .smiley__hair-part:before { bottom: -60% }
.smiley__wrapper--top .smiley__neck { bottom: -10% }
.smiley__wrapper--bottom .smiley__face { top: 40% }
```

```js
addEventListener('mousemove', mouseFunction)
```

### [Canvas exploration](https://codepen.io/jpbelley/pen/ExrZENR)

held: fixed a | on scroll: svg.[object: filter | made with: position: fixed · transition · :hover · GSAP · canvas 2D · pointer / mouse tracking

```css
a { position: fixed; top: 50%; transform: translate(-50%, -50%) }
a span:after { position: absolute; bottom: 0px; transition: 0.2s; transition: 0.2s }
svg:hover { filter: grayscale(80%) }
span { position: relative }
a span:hover::after { opacity: 0.5 }
svg { position: relative; transition: 0.2s }
```

```js
addEventListener("mousemove", (e) => {
gsap.to(circle[index], {
addEventListener("mouseleave", (e) => {
```

### [Style <input> Caret (CSS grid and monospaced font only)](https://codepen.io/jhirschberg70/pen/mdvEWgg)

on scroll: span.: filter | made with: custom properties driven by JS

```css
#caret { filter:invert(1) }
#input { box-shadow:none }
```

```js
style.setProperty("--col", inputStartCol + caretPosition)
style.setProperty("--col", inputStartCol + caretPosition - 1)
```

### [Hover Image Reveal - Smooth Cursor Effect](https://codepen.io/Pragatitendolkar/pen/xxMZoQd)

held: fixed div.cursor, fixed div.img-follower | made with: position: fixed · transition · :hover · pointer / mouse tracking · requestAnimationFrame

```css
.wrap { position: relative }
.row { border-top: 1px solid #1a1a1a; position: relative }
.row:last-child { border-bottom: 1px solid #1a1a1a }
.row-bg { position: absolute; inset: 0; transform: scaleX(0); transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1) }
.row:hover .row-bg { transform: scaleX(1) }
.row-inner { position: relative }
.num { transition: color 0.3s }
.name { transition: color 0.3s ease }
.tag { text-transform: uppercase; transition: color 0.3s }
.cursor { position: fixed; transform: translate(-50%, -50%); transition: width 0.3s cubic-bezier(0.76, 0, 0.24, 1), height 0.3s cubic-bezier(0.76, 0, 0.24, 1), background 0.3s; will-change: transform }
.img-follower { position: fixed; transform: translate(-50%, -50%) scale(0) rotate(-6deg); transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.4s cubic-bezier(0.76, 0, 0.24, 1); opacity: 0; will-change: transform, opacit }
.img-follower.visible { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1 }
```

```js
addEventListener('mousemove', e => {
requestAnimationFrame(tick)
addEventListener('mouseenter', () => {
addEventListener('mouseleave', () => {
```

### [Custom cursor](https://codepen.io/Pragatitendolkar/pen/oNmbRxK)

made with: mix-blend-mode · pointer / mouse tracking

```css
.cursor { position: absolute; mix-blend-mode: difference }
```

```js
addEventListener("mousemove", function(dets){
```

### [scroll progress indicator cursor vue](https://codepen.io/swc9803/pen/vYvoPmL)

held: fixed svg.[object, fixed div.cursor | on scroll: div.wave: transform+top | made with: position: fixed · @keyframes · transition · GSAP · scroll listener · pointer / mouse tracking

```js
gsap.to(dashOffset, {
addEventListener("mousemove", onMouseMove)
addEventListener("scroll", onScroll)
```

### [Animated Fairy Cursor (Try It!) ✨](https://codepen.io/drewcarson/pen/poqmdLX)

on hover of a.btn: a.btn: transform+top | made with: transition · :hover · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
.container { background-position: center; opacity: 0.5 }
body .brand { opacity: var(--reflected-o); position: absolute; bottom: 10px }
body .brand .buttons .btn { transition: 0.2s ease-in-out }
body .brand .buttons .btn:hover { transform: translatey(-0.25em) }
```

```js
requestAnimationFrame(handleSparkles)
addEventListener("mousemove", e => {
```

### [Cursor follow with hidden text shown on link hover](https://codepen.io/natszafraniec/pen/xxmNOPE)

held: fixed svg.[object | on scroll: svg.[object: transform+top | on hover of a.section__link: svg.[object: transform+top, circle.[object: transform+top, text.[object: opacity+top, a.section__link: transform+top | made with: position: fixed · GSAP · pointer / mouse tracking

```css
.section__text { position: relative }
.section__link { position: relative }
.dot { position: fixed; top: -4em; opacity: 0; transform: scale(0) }
.dot text { text-transform: uppercase; opacity: 0 }
```

```js
addEventListener("mousemove", function (e) {
gsap.to(dot, {
addEventListener("mouseenter", e => {
gsap.to(link, {
gsap.to(circle, {
gsap.to(text, {
addEventListener("mouseleave", e => {
```

### [Default cursor styles for better UX](https://codepen.io/rvwebdev/pen/ExGJvPb)

on scroll: button.button: background | on hover of button.button: button.button: background ×2 | made with: nothing recognised — read the code

```css
[disabled] { opacity: .7 }
```

### [Colorful Rubber Cursor](https://codepen.io/akarsh_sharma/pen/rNoqoJN)

on scroll: div.rubber-cursor: background | made with: transition · mix-blend-mode · pointer / mouse tracking

### [Custom Cursor](https://codepen.io/saaim-k/pen/YzdJLyp)

held: fixed div | made with: position: fixed · pointer / mouse tracking

```css
#cursor-custom { position: fixed; box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #fff, 0 0 70px #fff, 0 0 80px #fff, 0 0 100px #fff, 0 0 150px #fff }
```

```js
addEventListener("mousemove", (e) => {
```

### [Cursor Animation on hover over text](https://codepen.io/Mahe76/pen/MWZqwBr)

held: fixed div.cursor | made with: position: fixed · transition · :hover · mix-blend-mode · pointer / mouse tracking

```css
body { margin-top: 5em }
.text { position: relative }
.cursor { position: fixed; transform: translate(-50%, -50%); transition: transform 0.2s ease; mix-blend-mode: difference }
p:hover ~ .cursor { transform: scale(6); box-shadow: 0 0 10px #fff }
```

```js
addEventListener('mousemove', (e) => {
```

### [Mouse Follow Cursor](https://codepen.io/samsimite/pen/LYMrWRQ)

held: fixed div | on scroll: div.: transform+top | on hover of img.: div.: transform+top | made with: position: fixed · transition · pointer / mouse tracking

```css
#ghost1 { position: fixed; transition: transform 4s }
```

```js
addEventListener('mousemove', function(ev){
```

### [CSS+JS cursor glow effect](https://codepen.io/dentednerd/pen/zYyWQzQ)

made with: @keyframes · backdrop-filter · Web Animations API (.animate)

```css
#glow { position: absolute; top: 50%; translate: -50% -50%; animation: rotate 20s infinite }
from { rotate: 0deg }
50% { scale: 1 1.5 }
to { rotate: 360deg }
#blur { position: absolute; backdrop-filter: blur(100px) }
@keyframes rotate animates rotate, scale
```

```js
.animate({
```

### [CSS+JS sliding screen effect](https://codepen.io/dentednerd/pen/gOZeLLR)

made with: nothing recognised — read the code

```css
.side { position: absolute }
```

### [cursor interaction animation](https://codepen.io/Master1Dev/pen/XWoVQXP)

made with: nothing recognised — read the code

```css
#Particles:after { position: absolute; top: -2000px }
```

### [I follow cursors - Explained - 01](https://codepen.io/AudreyRBC/pen/LYMONwJ)

on scroll: div.cursor: transform+opacity+top, div.circle: transform+top | made with: transition · GSAP · pointer / mouse tracking

```css
:root { --scale: 1 }
.cursor { position: absolute; top: 0; opacity: 0 }
.cursor.visible { opacity: 1 }
.cursor.scale { --scale: 1.8 }
.circle { transform: scale(var(--scale)); transition: transform 0.3s ease-out }
.link { text-transform: uppercase }
```

```js
addEventListener('mousemove', (evt) => this._onMouseMove(evt))
addEventListener('mouseenter', (evt) => this._onMouseOver(evt, true, classAttr))
addEventListener('mouseleave', (evt) => this._onMouseOver(evt, false, classAttr))
gsap.to(this.$el, {
```

### [Cursor Aware Dot Grid](https://codepen.io/finnchillah/pen/GRPOJab)

made with: transition · mix-blend-mode · custom properties driven by JS

```css
div { position: absolute }
.dots:nth-child(2) { background-position: 3.5vmin 3.5vmin }
.mouse-gradient { background-position: calc(var(--mouse-x) - 100vmax) calc(var(--mouse-y) - 100vmax); transition: background-position 2s cubic-bezier(0, 0, 0, 1); mix-blend-mode: lighten }
.mouse-gradient:nth-child(4) { mix-blend-mode: difference }
.max-rgb { mix-blend-mode: darken }
```

```js
style.setProperty("--mouse-x", `${e.clientX}px`)
style.setProperty("--mouse-y", `${e.clientY}px`)
```

### [custome cursor + tailwind](https://codepen.io/emelyanova/pen/BavZZYY)

held: fixed div.circle | on hover of button.btn: span.line: background ×3, div.circle: transform+background+top | made with: position: fixed · transition · :hover · pointer / mouse tracking

```css
.line { position: relative; transition: background 0.3s }
#menu { transition: background 0.3s }
#menu.open { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) }
#menu .btn .line { transition: transform 0.3s, opacity 0.3s }
#menu.open .btn .line:nth-of-type(1) { transform: rotate(45deg) }
#menu.open .btn .line:nth-of-type(2) { opacity: 0 }
#menu.open .btn .line:nth-of-type(3) { transform: rotate(-45deg) }
#menu nav { transition: transform 0.3s; transform: scale(0) }
#menu.open nav { transform: scale(1) }
.hov { position: relative }
.hov::before { opacity: 0; position: absolute; top: 0; transition: opacity 0.3s }
.hov:hover::before { opacity: 1 }
```

```js
addEventListener('mousemove', (e) => {
```

### [Glowing Hover Effect](https://codepen.io/finnchillah/pen/bGOqrXg)

on scroll: img.: filter | on hover of div.card: img.: filter ×2 | made with: transition · :hover · mix-blend-mode · custom properties driven by JS

```css
.card { background-position: calc(var(--mouse-x) * 1px - var(--grad-size) / 2) calc(var(--mouse-y) * 1px - var(--grad-size) / 2); transition: background-position 2s cubic-bezier(0, 0, 0, 1) }
.card::before { position: absolute; background-position: 100% 100%; transition: background-position 0.3s linear }
.card:hover::before { background-position: 0% 0% }
.card > :first-child { mix-blend-mode: multiply; position: absolute; filter: blur(min(3vh, 1vw)) brightness(0%); transition: filter 0.5s ease }
.card:hover > :first-child { filter: blur(min(4.5vh, 1.5vw)) brightness(100%) }
.card > :nth-child(2) { mix-blend-mode: plus-lighter }
```

```js
style.setProperty("--mouse-x", e.clientX)
style.setProperty("--mouse-y", e.clientY)
```

### [Crosshair Cursor](https://codepen.io/Klax/pen/mdaWmye)

on scroll: hr.hrline: background+top, hr.vrline: background+top, div.target: transform+top | made with: transition · :hover · pointer / mouse tracking

```css
:root { --transition: 300ms linear }
.hrline, .vrline { position: absolute; transition: var(--transition); transform: translate(-50%, -50%) }
.vrline { rotate: 90deg }
.target { position: absolute; transform: translate(-50%, -50%); transition: var(--transition) }
.corner { position: absolute; scale: 1 }
.corner:nth-child(1) { top: 0; border-top: 2px solid var(--border-color) }
.corner:nth-child(2) { top: 0; border-top: 2px solid var(--border-color) }
.corner:nth-child(3) { bottom: 0; border-bottom: 2px solid var(--border-color) }
.corner:nth-child(4) { bottom: 0; border-bottom: 2px solid var(--border-color) }
#container:hover ~ .target > .corner { scale: 1.5 }
```

```js
addEventListener("mousemove", function (dets) {
```

### [svg animation + custom cursor](https://codepen.io/emelyanova/pen/bGOgZdQ)

held: fixed div.cursor-inner, fixed div.cursor-outer | on scroll: g.[object: opacity ×2 | made with: position: fixed · @keyframes · transition · :hover · mix-blend-mode · pointer / mouse tracking · Web Animations API (.animate)

```css
.cursor-inner, .cursor-outer { position: fixed; top: 0; transform: translate(-50%, -50%) }
.cursor-inner { mix-blend-mode: exclusion; transition: transform 0.35s }
.cursor-inner.hovered { transform: translate(-50%, -50%) scale(6) }
.cursor-inner.disabled { transform: translate(-50%, -50%) scale(0) }
```

```js
addEventListener('mousemove', function(e){
.animate({
```

### [Circle Cursor Hover Effect](https://codepen.io/Iftekhar16/pen/rNojZYd)

made with: position: fixed · transition · mix-blend-mode · pointer / mouse tracking

```css
.cursor { position: fixed; transition: ease-in-out; transform: translate(-50%, -50%); mix-blend-mode: difference }
.cursor-effect-container { padding-top: 0px; padding-bottom: 0px }
```

```js
addEventListener('mousemove', function(e) {
addEventListener('mouseenter', function(){
addEventListener('mouseleave', function(){
```

### [Image Mover Through Cursor](https://codepen.io/Klax/pen/rNojORz)

on scroll: div.image-container: transform | made with: transition · pointer / mouse tracking

```css
.container { box-shadow: 0 0 5px #ffffff10 }
.image-container { background-position: center; transition: all 300ms ease }
```

```js
addEventListener("mousemove", function (dets) {
```

### [Snapping Cursor](https://codepen.io/N-Nair/pen/ZEVpGPp)

made with: position: fixed · transition · :hover

```css
body:hover > #cursor { opacity: 1 }
body:hover > #pointer { opacity: 1 }
#cursor { position: fixed; top: 0px; opacity: 0; transition: opacity 200ms ease, background-color 200ms ease }
#pointer { position: fixed; top: 0px; opacity: 0; transition: opacity 200ms ease }
.pressable-1 { transition: all 200ms ease; box-shadow: 4px 4px #FAFAFF }
.pressable-1:hover { box-shadow: 7px 7px #FAFAFF }
.pressable-1:active { box-shadow: none }
.pressable-2 { background-position: right; transition: all 200ms ease }
.pressable-2:hover { background-position: left }
.pressable-3 { transition: all 200ms ease }
```

### [Custom Cursor Follower](https://codepen.io/Klax/pen/WNLxBMq)

made with: pointer / mouse tracking

```css
.cursor { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

```js
addEventListener("mousemove", function (dets) {
```

### [A dot cursor with a link hover animation](https://codepen.io/natszafraniec/pen/dywMxRp)

held: fixed svg.[object | on scroll: svg.[object: transform+top, circle.[object: transform+top | on hover of li.menu__item: svg.[object: transform+top | made with: position: fixed · GSAP · pointer / mouse tracking

```css
.menu__item + .menu__item { margin-top: 60px }
.menu__link { position: relative }
.dot { position: fixed; top: -4em; opacity: 0; transform: scale(0) }
```

```js
addEventListener("mousemove", function (e) {
gsap.to(dot, {
addEventListener("mouseenter", e => {
gsap.to(circle, {
addEventListener("mouseleave", e => {
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

### [Custom Cursor](https://codepen.io/zain-blh/pen/NWeqBdz)

made with: position: fixed · transition · pointer / mouse tracking

```css
#cursor { position: fixed; top: 50%; transform: translate(-50%, -50%); transition: 200ms linear }
#cursor .short { position: fixed; top: 50%; transform: translate(-50%, -50%); transition: 250ms linear }
```

```js
addEventListener("mousemove", (e) => {
```

### [Logo With Cursor Follow](https://codepen.io/Klax/pen/QWzbmyB)

made with: transition · pointer / mouse tracking

```css
#container { position: relative; position: relative }
#container .logo { position: absolute; transition: 200ms ease }
```

```js
addEventListener("mousemove", function (dets) {
```

### [Custom Cursor for website](https://codepen.io/santoshcodes/pen/MWZwjoj)

made with: GSAP · pointer / mouse tracking · requestAnimationFrame

```css
.Cursor { position: "fixed"; top: "0" }
.Cursor span { position: absolute; transform: translate(-50%, -50%) }
```

```js
addEventListener("mousemove", onMouseMove)
requestAnimationFrame(render)
```

### [Blob Cursor](https://codepen.io/Klax/pen/yLGyGQX)

on scroll: div.: transform+top | made with: @keyframes · transition · backdrop-filter · pointer / mouse tracking

```css
#blob { animation: blobanimate 10s infinite linear forwards; position: absolute; transition: 750ms linear }
#overlay { position: absolute; backdrop-filter: blur(100px) }
0% { transform: rotate(0deg) scaley(100%) }
50% { transform: rotate(180deg) scaley(70%) }
100% { transform: rotate(360deg) scaley(100%) }
h1 { text-transform: uppercase }
@keyframes blobanimate animates transform
```

```js
addEventListener("mousemove", function (dets) {
```

### [Target Cursor](https://codepen.io/Klax/pen/zYyxpwP)

made with: transition · pointer / mouse tracking

```css
#cursor { position: absolute; transition: all 300ms linear }
#cursor-corner { position: absolute }
#cursor-corner:nth-child(1) { top: 0; border-top: var(--border-cursor) }
#cursor-corner:nth-child(2) { top: 0; border-top: var(--border-cursor) }
#cursor-corner:nth-child(3) { bottom: 0; border-bottom: var(--border-cursor) }
#cursor-corner:nth-child(4) { bottom: 0; border-bottom: var(--border-cursor) }
#text { transition: display 4s ease }
```

```js
addEventListener("mousemove", function (dets) {
addEventListener("mousemove", function () {
addEventListener("mouseleave", function () {
```

### [Cursor Ball Follower](https://codepen.io/Klax/pen/poqzpOV)

made with: transition · pointer / mouse tracking

```css
#cursor { position: absolute; transition: 300ms linear }
```

```js
addEventListener("mousemove", (dets) => {
```

### [Experiment #003, Cursor](https://codepen.io/wiljam144/pen/gOZYRLq)

made with: pointer / mouse tracking · Web Animations API (.animate)

```css
#inner { position: absolute }
#outer { position: absolute }
```

```js
addEventListener("mousemove", (e) => {
.animate({
```

### [Custom cursor with exclusion bend-mode](https://codepen.io/charlene-bx/pen/mdQZMQB)

held: fixed aside.cursor--fill | on hover of img.: div.: transform+background+top | made with: position: fixed · transition · mix-blend-mode · pointer / mouse tracking

```js
addEventListener("mousemove", this.onMouseMove)
```

### [fancy cursor](https://codepen.io/wxrcxrz/pen/zYMXWKM)

made with: transition · :hover · mix-blend-mode · pointer / mouse tracking

```css
.cursor { filter: invert(100%); position: absolute; mix-blend-mode: difference; transition: transform ease-out 0.1s }
.button { transition: background ease-in-out 0.1s }
img { transition: transform ease 0.2s }
img:hover { transform: scale(1.5) }
.img-wrapper { margin-bottom: 30px; transition: box-shadow ease-in-out 1s }
.hover-shadow:hover { box-shadow: 0px 0px 97px -33px rgba(255, 255, 255, 1); -webkit-box-shadow: 0px 0px 97px -33px rgba(255, 255, 255, 1); -moz-box-shadow: 0px 0px 97px -33px rgba(255, 255, 255, 1) }
```

```js
addEventListener("mousemove", (event) => {
addEventListener("mousemove", (e) => {
```

### [Customized cursor](https://codepen.io/lalBi94/pen/gOQEdqE)

made with: pointer / mouse tracking

```css
* #cursor { position: absolute }
```

```js
addEventListener("mousemove", (event) => {
```

### [Simple button fill following cursor](https://codepen.io/ashraf-asif/pen/vYQPROL)

made with: transition · :hover

```css
.btn { position: relative }
.label { position: relative; text-transform: uppercase; transition: color 0.3s ease-out }
.bg { position: absolute; top: 0; transform: translate(-50%, -50%) scale(0); transition: transform 0.5s ease-out }
.btn:hover .bg { transform: translate(-50%, -50%) scale(1) }
```

```js
addEventListener("mouseenter", handleOrigin)
addEventListener("mouseleave", handleOrigin)
```

### [Custom Cursor V2](https://codepen.io/snoblomma/pen/PoxLGZd)

made with: @keyframes · transition · :hover · pointer / mouse tracking

```css
.container { background-position: 1rem 1rem }
.cursor-wrapper { position: relative }
.cursor { position: absolute }
.cursor:before, .cursor:after { position: absolute }
.cursor:after { top: 0; bottom: 0 }
.outline { position: absolute; top: 100% }
50% { scale: 2 }
100% { scale: 2 }
0% { scale: 2 }
.outline.expand { animation: cursorAnim 0.3s forwards }
.outline.hover { animation: cursorHover 0.3s forwards }
.outline:not(.hover) { animation: cursorDefault 0.3s forwards }
```

```js
addEventListener("mousemove", handleMouseMove)
```

### [particles cursor colored bubbles](https://codepen.io/tofjadesign/pen/WNYPdwV)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
#canvas { position: absolute; top: 0 }
```

```js
addEventListener('mousemove', (event) => {
requestAnimationFrame(animate)
```

### [Motion MouseFollow-001 | basic cursor follow — JS transform](https://codepen.io/atibonibon/pen/LYXqYoz)

held: fixed div.custom-cursor | made with: position: fixed · transition · pointer / mouse tracking

```css
.custom-cursor { position: fixed; top: -50px; transition: all ease-out 0.09s }
```

```js
addEventListener('mousemove', (e) => {
```

### [Trailing Images Drawn on Canvas](https://codepen.io/freedommayer/pen/WNYYpgj)

held: fixed canvas | made with: position: fixed · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
canvas { position: fixed; top: 0 }
```

```js
requestAnimationFrame(drawImageTrail)
addEventListener("mousemove", onMouseMove)
```

### [shapes take over your screen try to remove them!](https://codepen.io/tofjadesign/pen/ExOdvBB)

held: fixed div | made with: position: fixed

```css
#particles-js { position: fixed; top: 0 }
h1 { margin-top: 40px }
```

### [CircleCursor](https://codepen.io/Tushar-Sandhu/pen/XWyPQRx)

made with: transition · pointer / mouse tracking

```css
.mymouse { position:absolute; transform: translateX(-50%) translateY(-50%); transition: all 100ms ease-out }
```

```js
addEventListener("mousemove", function(e){
```

### [Cursor colorfull particle bars](https://codepen.io/tofjadesign/pen/GRwXreg)

held: fixed canvas | made with: position: fixed · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
#canvas { position: fixed; top: 0 }
```

```js
addEventListener("mousemove", createParticles)
requestAnimationFrame(animate)
```

### [JS Canvas - Sparks along the cursor](https://codepen.io/tommyho/pen/GRwBqWR)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```js
addEventListener("mousemove", function(event){
requestAnimationFrame(animate)
```

### [JS Canvas - Falling Snow Particles Cursor](https://codepen.io/tommyho/pen/WNYKxoG)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```js
addEventListener("mousemove", function(event){
requestAnimationFrame(animate)
```

### [JS Canvas - Star Particles Cursor with joining sparkes](https://codepen.io/tommyho/pen/ZEmjWGY)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```js
addEventListener("mousemove", function(event){
requestAnimationFrame(animate)
```

### [Cursor Lens Image Zoom](https://codepen.io/Baiawai/pen/ZEmoJOg)

held: fixed div | made with: position: fixed · scroll listener · pointer / mouse tracking

```css
#zoomed-image { position: fixed; box-shadow: 0 12px 30px rgba(0,0,0,.35); transform: translateZ(0); will-change: left, top, background-position, background-size }
```

```js
addEventListener("pointermove", onPointerMove)
addEventListener("scroll", updateRect, { passive: true })
```

### [web](https://codepen.io/Mahi-K/pen/dyQmqWV)

made with: transition

```css
.cover { transition: 1s filter ease }
```

### [CodePen Challenge: Particle Cursors - Animated Cursor (CSS)](https://codepen.io/Azametzin/pen/vYQRrZw)

held: fixed div.overlay, fixed div.overlay, fixed div.overlay | made with: position: fixed · @keyframes · :hover

```css
.elemental-container { position: relative }
.elemental-container p { margin-top: 20px }
.sphere { position: absolute; top: 0; bottom: 0; box-shadow: 1px 1px 2px 1px #000000, 1px 1px 2px 1px #000000 inset }
.g { animation: green-cursor 1440ms step-end infinite }
.r { animation: red-cursor 1440ms step-end infinite }
.b { animation: blue-cursor 1440ms step-end infinite }
.overlay-g { animation: green-cursor 1440ms step-end infinite }
.overlay-r { animation: red-cursor 1440ms step-end infinite }
.overlay-b { animation: blue-cursor 1440ms step-end infinite }
.overlay { position: fixed; top: 0; top: 0 }
@keyframes green-cursor animates cursor, data
@keyframes red-cursor animates cursor, data
```

### [Button Cursor Follow Shadow](https://codepen.io/creativenines/pen/ExOEZQx)

on hover of button.button: div.shadow: transform+top | made with: transition · 3D (perspective / preserve-3d) · pointer / mouse tracking

```css
.button { position: relative; box-shadow: inset 0px 0px 2px 1px rgb(196 192 202), inset 0px 0px 0px 3px white, rgb(205 205 230 / 60%) 0px 2px 2px, rgb(178 174 198) 0px 5px, rgb(77 77 122 / 90%) 0px 4px 2px 0px; transform: perspect }
.button span { position: relative }
.button:active { box-shadow: inset 0px 0px 2px 1px rgb(196 192 202), inset 0px 0px 0px 3px white; transform: translateY(5px) perspective(6rem) rotateX(5deg) }
.shadow { position: absolute; top: 0; transform: translate(0, 0); opacity: 1 }
```

```js
addEventListener('pointermove', (e) => {
```

### [ParticlesCursor-Threejs-toys](https://codepen.io/RiniSW/pen/GRwxoGP)

held: fixed canvas | made with: position: fixed

```css
#app a { margin-top: 10px }
#app canvas { position: fixed; top: 0 }
```

### [Cursor Following Pet](https://codepen.io/Abinbn/pen/dyQmGYV)

held: fixed div.content | on scroll: div.content: opacity, div.: opacity | made with: position: fixed · @keyframes · pointer / mouse tracking · requestAnimationFrame

```css
#pet { box-shadow: 0 0 10px yellow; filter: blur(5%); position: absolute; top: 50%; transform: translate(-50%, -50%); animation: flicker 2s infinite }
.content { position: fixed; animation: flicker 2s infinite }
0% { opacity: 0.3 }
50% { opacity: 1 }
100% { opacity: 0.3 }
@keyframes flicker animates opacity
```

```js
requestAnimationFrame(updatePosition)
addEventListener('mousemove', trackMouse)
```

### [Particle cursor effect - Starry Night](https://codepen.io/DenDionigi/pen/oNQEyKX)

held: fixed span, fixed span | made with: position: fixed · transition · :hover · canvas 2D · pointer / mouse tracking

```css
:root { position:relative }
html:hover span, body:hover span { opacity: 0 }
span { position: fixed; transition: all 0.45s ease-in-out }
#info:after { position: absolute; bottom: -3em; transition: all 0.3s ease }
```

```js
addEventListener("pointermove", r, !1),
```

### [cpc-particle-cursors](https://codepen.io/Mahi-K/pen/yLQvEVz)

made with: nothing recognised — read the code

```css
.card { position: relative }
```

### [JS Canvas - Particles Cursor with joining sparks](https://codepen.io/tommyho/pen/ExOomWM)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```js
addEventListener("mousemove", function(event){
requestAnimationFrame(animate)
```

### [Challenge: CursorViewer](https://codepen.io/HebertCordero/pen/xxQpwQr)

on scroll: div.hero-slider: transform | on hover of img.hero-img: div.hero-slider: transform | made with: transition

```css
picture { position: relative }
canvas { position: absolute; top: 0 }
.hero-img { position: relative }
.hero { position: relative }
.hero-slider { transition: transform 0.5s ease-in-out }
.hero-slide { position: relative }
.hero-slide__info { bottom: 40px; position: absolute }
.hero-slide__button { text-transform: uppercase }
.hero-bullets > span { position: relative }
.hero-bullets > span.active { transform: scale(1.1) }
.hero-bullets span::after { position: absolute; top: 0; transition: width 5s linear }
```

### [Cursor blinking animation](https://codepen.io/Gallium/pen/GRwOovg)

made with: @keyframes

```css
.input-cursor { animation: blink 0.6s linear infinite alternate }
0% { opacity: 1 }
40% { opacity: 1 }
60% { opacity: 0 }
100% { opacity: 0 }
@keyframes blink animates opacity
```

### [mouse track](https://codepen.io/Konrad-Wittich/pen/wvQrKYa)

made with: position: fixed · @keyframes · pointer / mouse tracking

```css
.swipe { position: fixed; box-shadow: 0.1rem 0.1rem 0.4rem rgb(0, 2, 128), inset 0.1rem 0.1rem 1rem purple; animation: roll 0.6s linear forwards }
0% { transform: scale(0.1) }
50% { transform: scale(1.4) }
100% { transform: scale(0.1) }
@keyframes roll animates border, transform
```

```js
addEventListener('mousemove', cursorStyle)
```

### [Мутация курсора (custom cursor)](https://codepen.io/woobla/pen/YzRQKRJ)

made with: @keyframes · transition · pointer / mouse tracking · requestAnimationFrame

```css
.svg-cursor { position: absolute }
.svg-cursor__lines { transform: scale(0.8) rotate(0); transition: all 0.6s cubic-bezier(0.76, -0.53, 0.32, 1.4) }
.svg-cursor__lines line { transition: all 0.6s cubic-bezier(0.76, -0.53, 0.32, 1.4) }
.svg-cursor__lines line:nth-of-type(1) { transform: rotate(45deg) }
.svg-cursor__lines line:nth-of-type(2) { transform: scaleX(0.65) translateY(-0.35em) }
.svg-cursor__lines line:nth-of-type(3) { transform: scaleY(0.65) rotate(90deg) translateY(0.35em) }
.svg-cursor__action { -webkit-animation: bounce 1s linear infinite; animation: bounce 1s linear infinite }
.svg-cursor__close .svg-cursor__lines { transform: scale(0.8) rotate(360deg) }
.svg-cursor__close .svg-cursor__lines line:nth-child(1) { transform: rotate(45deg) }
.svg-cursor__close .svg-cursor__lines line:nth-child(2) { transform: scaleX(0) translateY(0) }
.svg-cursor__close .svg-cursor__lines line:nth-child(3) { transform: scaleY(1) rotate(-45deg) translateY(0) }
.svg-cursor__left { -webkit-animation: bounceL 1s linear infinite; animation: bounceL 1s linear infinite }
```

```js
addEventListener("mousemove", function(event) {
requestAnimationFrame(() => {moveCursor(event)})
```

### [Animated cursor](https://codepen.io/ed-demircioglu/pen/wvQzxpY)

held: fixed div.circle, fixed div.circle, fixed div.circle, fixed div.circle, fixed div.circle, fixed div.circle, fixed div.circle, fixed div.circle, fixed div.circle, fixed div.circle | made with: position: fixed · pointer / mouse tracking · requestAnimationFrame

```css
body { bacground-position: center }
.circle { position: absolute; top: 0; position: fixed }
```

```js
addEventListener('mousemove', function(e) {
requestAnimationFrame(animateCircles)
```

### [Eye rotation](https://codepen.io/nayan101viper/pen/zYMqwWG)

on scroll: img.front: transform, img.magnetic-image: transform+top | made with: transition · mix-blend-mode · pointer / mouse tracking

```css
.holder { position: relative }
.circle-mask { position: relative }
.magnetic-image { position: absolute; top: 25%; transform: translate(-50%, -50%); transition: transform 0.3s ease }
.glare { position: absolute; top: 45%; opacity: 50%; mix-blend-mode: overlay; filter: blur(1px) }
.front { position: absolute; top: 0; filter: blur(0.1px) }
.glare { mix-blend-mode: overlay }
.magnetic-image { transform: translate(-50%, -50%); filter: saturate(0%) }
```

```js
addEventListener("mousemove", (event) => {
```

### [Rainbow Cursor i made](https://codepen.io/melonn_-gaming/pen/QWJjxVL)

made with: @keyframes · pointer / mouse tracking

```css
.container { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) }
.cursor { position: absolute; animation: rainbow 2s infinite }
@keyframes rainbow animates background-color
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
```

### [Weird and cool cursors](https://codepen.io/melonn_-gaming/pen/yLQYpmW)

made with: transition

```css
.cursor-item { margin-bottom: 20px; transition: background-color 0.3s ease }
```

### [Rainbow cursor tail](https://codepen.io/jakeBacon/pen/rNQVRbQ)

held: fixed div.cursor, fixed div.cursor, fixed div.cursor, fixed div.cursor, fixed div.cursor, fixed div.cursor | on hover of button.: div.cursor: transform+top ×6, button.: transform+top | made with: position: fixed · transition · :hover · prefers-reduced-motion · GSAP · pointer / mouse tracking

```js
addEventListener('mousemove', this.setMousePosition)
gsap.to(`.${color.name}`, {
gsap.to(`.${color.name}`, {\n x: this.currentMousePosX,\n\t\t\t\t\ty: this.currentMousePosY,\n\t\t\t\t\tduration: 0.05,
```

### [Custom Cursor + Magnetic Link ( Linear Interpolation )](https://codepen.io/noirsociety/pen/BaGNrdz)

held: fixed div.magnet-cursor, fixed div.magnet-circle | on scroll: a.magnet-link: color, span.magnet-border: transform+opacity, div.magnet-cursor: transform+background+top, div.magnet-circle: transform | made with: position: fixed · transition · :hover · custom properties driven by JS · pointer / mouse tracking · requestAnimationFrame

```css
.magnet-item { position: relative }
.magnet-link { text-transform: uppercase }
.magnet-border { position: absolute; top: 0; opacity: 0; transition: 0.2s }
.magnet-item:hover .magnet-border { opacity: 1; transform: rotate(-360deg) }
.magnet-cursor, .magnet-circle { position: fixed; top: 0 }
.magnet-cursor { transform: translate(var(--x),var(--y)) }
```

```js
requestAnimationFrame(updateCircle)
style.setProperty('--x',`${e.clientX - cursor.clientWidth/2}px`)
style.setProperty('--y',`${e.clientY - cursor.clientHeight/2}px`)
addEventListener('pointermove',init,false)
```

### [Image overlay](https://codepen.io/GuiFSouzah/pen/yLQNvMY)

made with: pointer / mouse tracking

```css
main { position: relative }
#cursor { position: absolute; filter: drop-shadow(6px 6px 6px black) }
main, #cursor { background-position: center }
```

```js
addEventListener('mousemove', function (event) {
```

### [Cursors](https://codepen.io/melonn_-gaming/pen/YzRPMjE)

made with: transition · :hover

### [Trail Cursor](https://codepen.io/sukhbir_singh/pen/abQbzzm)

held: fixed div | made with: position: fixed · mix-blend-mode · pointer / mouse tracking · requestAnimationFrame

```css
#trail-cursor { position: fixed; mix-blend-mode: difference; top: 0 }
.circle { position: absolute; top: 0 }
```

```js
addEventListener("mousemove", function (e) {
requestAnimationFrame(animeCircle)
```

### [2D Cursor Trainer](https://codepen.io/zcom/pen/XWxvvdp)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
#infoButton { position: absolute; top: 10px }
```

```js
addEventListener('mousemove', function (event) {
requestAnimationFrame(gameLoop)
addEventListener('mousemove', function () {
```

### [Smooth Spring Cursor Animation](https://codepen.io/AureleJ/pen/MWPNRje)

held: fixed div | made with: position: fixed · transition · pointer / mouse tracking · requestAnimationFrame

```css
#custom-cursor { position: absolute; top: 0; transform: translate(-50%, -50%); transition: background-color 0.3s ease-in-out }
#little-cursor { position: absolute; top: 0; transform: translate(-50%, -50%) }
#support { position: fixed; bottom: 30px }
#paypal { margin-top: 15px }
```

```js
addEventListener("mousemove", updateCursorPosition)
addEventListener("mouseenter", handleLinkHover)
addEventListener("mouseleave", handleLinkLeave)
requestAnimationFrame(animateCursor)
requestAnimationFrame(animateCursorLittle)
```

### [SVG Eye Tracking Animation](https://codepen.io/flexcode/pen/mdzgJvG)

made with: GSAP · pointer / mouse tracking · requestAnimationFrame

```css
body { position: relative }
body::after { position: absolute; top: 0; opacity: 0.05 }
#svg { position: absolute !important; top: 50% !important; transform: translate(-50%, -50%) }
```

```js
addEventListener("mousemove", onMouseMove)
requestAnimationFrame(onFrame)
```

### [Custom Text as Cursor](https://codepen.io/mobamba/pen/OJBqvzV)

made with: nothing recognised — read the code

```css
.custom-div { position: relative }
.custom-div .text { position: absolute }
```

### [Mouse cursor Custom](https://codepen.io/web_walking_nak/pen/OJBdEpd)

held: fixed div.js-cursor | made with: position: fixed · mix-blend-mode · pointer / mouse tracking · requestAnimationFrame

```css
.js-cursor { opacity: 0; position: fixed; top: 0; mix-blend-mode: difference; transition-property: visibility, opacity }
.js-cursor:before, .js-cursor:after { position: absolute; top: 50%; transform: translate3d(-50%, -50%, 0) }
.js-cursor:after { transition-property: border-color, background, transform }
.js-cursor.is-active { opacity: 1; will-change: transform }
.js-cursor.is-focus:after { transform: translate3d(-50%, -50%, 0) scale(2.75) }
.js-cursor.is-hidden { opacity: 0 }
```

```js
requestAnimationFrame(render)
addEventListener('mousemove', function(e) {
addEventListener('mouseenter',function() {
addEventListener('mouseleave',function() {
```

### [Untitled](https://codepen.io/taxus/pen/gOBqMEg)

made with: nothing recognised — read the code

```css
.shots-timeline img.focus { transform: scale(1.1) }
.shots-timeline.focus img.unfocus { opacity: 0.5 }
```

### [Satisfying Cursor Effect - webgl fluid](https://codepen.io/ElTjempo/pen/RweeEay)

held: fixed canvas | on scroll: h1.: opacity | made with: position: fixed · @keyframes

```css
.bname { position: absolute; top: 1% }
.content h1 { animation: blinker 1s linear infinite }
canvas { position:fixed; inset:0 }
50% { opacity: 0.3 }
@keyframes blinker animates opacity
```

### [Cursor chaser](https://codepen.io/vincentscotto/pen/yLRxLXm)

made with: transition · pointer / mouse tracking

```css
body { text-transform: uppercase }
p { margin-top: 25vh; border-bottom: 2px solid var(--highlight) }
.cursor { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: all 0.1s }
.chaser { box-shadow: 0 0 45px 5px white; transition: all 0.5s ease-in-out }
```

```js
addEventListener("mousemove", mouseCursor)
```

### [(Not so) smart cursor](https://codepen.io/Ukitsu/pen/NWOzZpV)

held: fixed div.mouse | made with: position: fixed · transition · mix-blend-mode · pointer / mouse tracking

```css
.mouse { position: fixed; top: 0; transition: all 1s ease }
.mouse__home, .mouse__clic, .mouse__link { position: absolute; opacity: 0; transition: all 0.5s ease; top: 50%; transform: translateX(-50%) translateY(-50%) }
.mouse[data-attribute=home] { mix-blend-mode: normal }
.mouse[data-attribute=home] .mouse__home { transform: translateX(-50%) translateY(-50%) scale(1.5); opacity: 1 }
.mouse[data-attribute=link] { mix-blend-mode: normal }
.mouse[data-attribute=link] .mouse__link { transform: translateX(-50%) translateY(-50%) scale(1.5); opacity: 1 }
.mouse[data-attribute=button] { mix-blend-mode: normal }
.mouse[data-attribute=button] .mouse__clic { transform: translateX(-50%) translateY(-50%) scale(1.5); opacity: 1 }
```

```js
addEventListener('mousemove', (event) => {
```

### [Move your fingers or mouse](https://codepen.io/Rakeshid03/pen/BaqYLLJ)

made with: position: fixed · @keyframes · pointer / mouse tracking

```css
.bubble { position: fixed; animation: float 3s ease-in-out; box-shadow: 0 0 0 7px #fff, 0 0 15px 10px rgba(0, 0, 0, 0.5); filter: blur(20px); transform: translateZ(-40px) }
0% { opacity: 0.8 }
50% { opacity: 1 }
100% { opacity: 0 }
input[type=color] { position: absolute; bottom: 1rem }
@keyframes float animates opacity
```

```js
addEventListener("mousemove", function(event) {
```

### [Custom Cursor](https://codepen.io/rahulbaran/pen/xxyXJRx)

made with: transition · prefers-reduced-motion · pointer / mouse tracking

```css
.circles { position: absolute }
.small-circle { position: absolute; top: 50%; translate: -50% -50%; transition: transform 300ms ease-out, inline-size 50ms ease }
.large-circle { transition: transform 300ms linear }
```

```js
addEventListener("mousemove", (e) => {
```

### [GSAP Follow Mouse Animation](https://codepen.io/alex-streza/pen/eYPEExe)

held: fixed div | made with: position: fixed · backdrop-filter · GSAP · pointer / mouse tracking

```css
#cursor-follow { position: fixed; top: 0; transform: translate(-50%, -50%); backdrop-filter: invert(100%) }
```

```js
addEventListener("mousemove", (ev) => {
gsap.to("#cursor-follow", {
addEventListener("mouseenter", (ev) => {
addEventListener("mouseleave", (ev) => {
```

### [CodePen Home Steps Following The Cursor (GSAP)](https://codepen.io/robin-ivi/pen/abRWyNj)

on hover of a.: use.[object: transform+top ×9 | made with: GSAP · pointer / mouse tracking · requestAnimationFrame

```js
addEventListener("mousemove", (e) => {
requestAnimationFrame(render)
```

### [Steps Following The Cursor (SVG + GSAP)](https://codepen.io/ksenia-k/pen/jOeBjRV)

made with: GSAP · pointer / mouse tracking · requestAnimationFrame

```js
addEventListener("mousemove", (e) => {
requestAnimationFrame(render)
gsap.timeline({
```

### [Ring Cursor Trailer](https://codepen.io/MaxVdp/pen/bGmqzrj)

made with: position: fixed · @keyframes · Web Animations API (.animate)

```css
#ring { position: fixed; top: 50%; transform: translate(-50%, -50%); animation: ringRotate 5s infinite }
#ring::before { position: absolute; top: 50%; transform: translate(-50%, -50%) }
from { transform: translate(-50%, -50%) rotate(0deg) }
to { transform: translate(-50%, -50%) rotate(360deg) }
@keyframes ringRotate animates transform
```

```js
.animate({
```

### [Text Shadow Following Mouse Position](https://codepen.io/freedommayer/pen/zYmodrQ)

made with: GSAP · pointer / mouse tracking

```js
gsap.to(text, {
addEventListener('mousemove', updateShadow)
```

### [Custom Name Cursor](https://codepen.io/Darshil_varia/pen/BaqjbjJ)

made with: pointer / mouse tracking

```css
.items { position: relative }
.item { position: absolute }
```

```js
addEventListener("mousemove", (e) => {
```

### [Custom cursor](https://codepen.io/Darshil_varia/pen/qBJbLOP)

made with: transition · pointer / mouse tracking

```css
#cursor { position: absolute; transform: translate(-9px, -9px) }
```

```js
addEventListener("mousemove", (e) => {
```

### [GSAP - Intro - Text animation / Cursor](https://codepen.io/Tiopayo/pen/KKGVWWz)

held: fixed nav.menu, fixed section.intro, fixed div.cursor, fixed div.noise | made with: position: fixed · clip-path · GSAP · pointer / mouse tracking

```css
.menu { position: fixed; top: 0; transform: translatex(-50%) }
.intro { position: fixed; top: 0; transform-origin: top }
.intro__red { position: absolute; bottom: 0; transform: scaleY(0); transform-origin: bottom }
.intro__red div { transform: scaleX(0.5) scaleY(1.5) }
.clip { position: relative }
.clip h1, .clip .h1__stroke { position: absolute; top: 50%; text-transform: uppercase; transform: translate(-50%, -50%) scaleY(2) }
.clip p { position: absolute; bottom: 20px; transform: translateX(-50%) }
.clip figure { position: absolute; top: 50%; transform: translate(-60%, -50%) scaleX(-1); clip-path: url(#svgClipPath) }
.clip figure video { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.clip__bg { position: absolute; top: 0 }
.cursor { position: fixed; top: 0; transform: translate(-50%, -50%) scale(0) }
.cursor::after { position: absolute; top: 0; transform: rotate(-15deg) }
```

```js
gsap.timeline()
gsap.to(clipH1Letters, {duration: 1.5, y: "10%", scale: 1, ease: "expo.inOut", delay: 0.6, stagger: 0.025})
gsap.to(clipH1StrokeLetters, {duration: 1.5, y: "10%", scale: 1, ease: "expo.inOut", delay: 0.6, stagger: 0.025})
addEventListener("mousemove", (e) => {
gsap.to(".cursor", .5, {duration: 0, x: x, y: y})
addEventListener("mouseenter", () => {
gsap.to(".cursor", .5, {scale: 1, ease: "expo.inOut"})
addEventListener("mouseleave", () => {
```

### [マウスカーソルに丸がついてくる](https://codepen.io/hrshishym/pen/bGmVXod)

held: fixed div | made with: position: fixed · transition · pointer / mouse tracking

```css
#stalker { position: fixed; top: -8px; transition: transform 0.2s, top, 0.5s, left 0.5s, width 0.5s, height 0.5s, background-color 0.5s }
#stalker.hov_ { top: -32px; transition: 0.5s }
img { vertical-align: bottom }
```

```js
addEventListener('mousemove', function (e) {
```
