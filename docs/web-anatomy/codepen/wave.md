# CodePen · wave — how each pen does it

51 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/wave.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| @keyframes | 22 |
| requestAnimationFrame | 19 |
| canvas 2D | 16 |
| transition | 16 |
| :hover | 14 |
| position: fixed | 9 |
| pointer / mouse tracking | 8 |
| 3D (perspective / preserve-3d) | 6 |
| custom properties driven by JS | 4 |
| backdrop-filter | 3 |
| mix-blend-mode | 3 |
| prefers-reduced-motion | 2 |
| mask | 2 |
| three.js / WebGL | 2 |
| :has() | 2 |
| GSAP | 1 |
| position: sticky | 1 |
| clip-path | 1 |

## Every pen

### [CSS Sine Wave with sin() and sibling-index()](https://codepen.io/editor/mobalti/pen/01a09b5b-9afb-7e7e-b706-5fb0dad9d800)

made with: @keyframes · prefers-reduced-motion

### [CSS Sine Wave Animation with sibling-index() and sibling-count()](https://codepen.io/editor/mobalti/pen/01a09b3b-3152-74c0-8add-cb751712f259)

made with: @keyframes · prefers-reduced-motion

### [Wavy image effect](https://codepen.io/editor/D-Davidson/pen/019ff321-ed09-700c-bdd7-401f831efd9a)

made with: position: fixed · canvas 2D · requestAnimationFrame

```css
html::before { position: fixed; inset: 0; opacity: 0.6 }
```

### [Customizable Wave Text Path](https://codepen.io/editor/BlackStar1991/pen/019fb71f-d611-798d-92e8-a877f4ebd6ff)

made with: transition · :hover · backdrop-filter · requestAnimationFrame

```css
.demo__panel { box-shadow: 0 30px 90px rgb(0 0 0 / 45%); backdrop-filter: blur(16px) }
.demo__heading { margin-bottom: 24px }
.text-path { position: relative }
.controls { margin-top: 24px }
.controls input[type="text"]:focus { box-shadow: 0 0 0 3px rgb(142 118 255 / 18%) }
.code-panel { margin-top: 28px }
.code-panel__header { margin-bottom: 16px }
.copy-button { transition: transform 160ms ease, background-color 160ms ease }
.copy-button:hover { transform: translateY(-1px) }
.copy-button:active { transform: translateY(0) }
```

```js
requestAnimationFrame(animate)
```

### [Minimalist Ocean Wave SVG](https://codepen.io/editor/WyrlightStudio/pen/019f88fd-0a8b-772c-99cd-f4f536da307c)

on scroll: svg.[object: transform+top | made with: @keyframes

```css
#MinimalistOceanWave { animation: zoom-in-zoom-out 6s ease infinite }
0% { transform: scale(1) }
50% { transform: scale(1.25) }
100% { transform: scale(1) }
@keyframes zoom-in-zoom-out animates transform
```

### [css wave mask w/ mask-composite](https://codepen.io/vii120/pen/GgrrwzJ)

made with: mask

```css
.card { position: relative; box-shadow: 2px 2px 12px #0003 }
.mask { position: absolute; bottom: -40px; translate: -50% 0; --mask: var(--wave-outside) no-repeat 0% 80% / var(--wave-size), var(--wave-outside) no-repeat 50% 80% / var(--wave-size), var(--wave-outside) no-repeat 100% 80% / va }
```

### [Dot Grid | Wave & Glue](https://codepen.io/jpbelley/pen/XJpmdMQ)

held: fixed div, fixed a | on hover of a.: a.: color | made with: position: fixed · transition · :hover · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
#wrap { position: fixed; inset: 50px; filter: blur(8px) contrast(28) }
#cv { position: absolute; inset: 0 }
#credit { position: fixed; bottom: 20px; transition: color 0.2s }
```

```js
addEventListener('mousemove', e => {
addEventListener('mouseleave', () => { mouse.on = false
requestAnimationFrame(loop)
```

### [CSS Houdini Background Animation](https://codepen.io/editor/alvov/pen/016cca97-8f50-7d4c-9d1f-340463d9df3e)

made with: nothing recognised — read the code

### [Liquid Jelly Chroma Wave Image Reveal Animation](https://codepen.io/JAY-Konva/pen/pvNBKaV)

made with: canvas 2D · requestAnimationFrame

```css
#main-canvas { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) }
```

```js
requestAnimationFrame(animate)
```

### [CSS/JS Mosaic Grid · Wave Propagation](https://codepen.io/Jiironimo/pen/bNBrQjr)

made with: @keyframes · transition · :hover · custom properties driven by JS

```css
header { position: relative; opacity: 0; animation: up .8s cubic-bezier(.22,1,.36,1) .1s forwards }
.eyebrow { text-transform:uppercase; margin-bottom:.5rem }
.grid-wrap { position: relative; opacity: 0; animation: up .8s cubic-bezier(.22,1,.36,1) .3s forwards }
.cell { transition: background .25s ease, transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s }
.cell:hover { transform: scale(1.3) }
.cell.wave-1 { box-shadow: 0 0 8px var(--c1, #7c3aed); transform: scale(1.15) }
.cell.wave-2 { box-shadow: 0 0 6px var(--c2, #0ea5e9); transform: scale(1.08) }
.cell.wave-3 { box-shadow: 0 0 4px var(--c3, #6d28d9) }
.controls { position: relative; opacity: 0; animation: up .8s ease .8s forwards }
.ctrl { text-transform: uppercase; transition: color .2s, border-color .2s, background .2s }
.hint { position: relative; text-transform: uppercase; opacity: 0; animation: up .8s ease 1s forwards }
from { opacity:0; transform:translateY(12px) }
```

```js
style.setProperty('--cols', COLS)
style.setProperty('--c1', p.c1)
style.setProperty('--c2', p.c2)
style.setProperty('--c3', p.c3)
addEventListener('mouseenter', () => {
```

### [GD Wave Trainer](https://codepen.io/editor/lecubbe/pen/019df8e0-920e-779d-a25a-a74e7b663b73)

made with: canvas 2D · pointer / mouse tracking · requestAnimationFrame

### [Bar Wave Visualizer - KamUIX](https://codepen.io/kam_UIX/pen/ZYpmzpq)

on scroll: div.visualizer-wave: transform+opacity ×12 | on hover of button.flex: div.visualizer-wave: transform+opacity ×12, button.flex: background | made with: @keyframes · transition · :hover · custom properties driven by JS · pointer / mouse tracking

```css
.visualizer-wave { transform: scaleX(var(--scale, 0.3)); animation: wave var(--duration, 1.5s) ease-in-out infinite; animation-delay: var(--delay, 0s); transition: transform 0.1s ease, background 0.3s ease }
.visualizer-wave.gradient-1 { box-shadow: 0 0 20px rgba(161, 255, 98, 0.3) }
.visualizer-wave.gradient-2 { box-shadow: 0 0 20px rgba(255, 107, 107, 0.3) }
.visualizer-wave.gradient-3 { box-shadow: 0 0 20px rgba(0, 210, 255, 0.3) }
.visualizer-wave.gradient-4 { box-shadow: 0 0 20px rgba(247, 151, 30, 0.3) }
.visualizer-wave.gradient-5 { box-shadow: 0 0 20px rgba(225, 0, 255, 0.3) }
0%, 100% { transform: scaleX(var(--base-scale, 0.3)); opacity: 0.5 }
50% { transform: scaleX(var(--peak-scale, 1)); opacity: 1 }
.visualizer-wave:nth-child(odd) { animation-duration: 1.3s }
.visualizer-wave:nth-child(3n) { animation-duration: 1.8s }
.visualizer-wave:nth-child(5n) { animation-duration: 1s }
.visualizer-wave:nth-child(7n) { animation-duration: 2.2s }
```

```js
style.setProperty("--base-scale", baseScale)
style.setProperty("--peak-scale", peakScale)
style.setProperty("--duration", `${duration}s`)
style.setProperty("--delay", `${delay}s`)
style.setProperty("--scale", baseScale)
style.setProperty("--peak-scale", newPeak)
addEventListener("mousemove", (e) => {
style.setProperty( "--peak-scale",
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

### [MInimal Sway Slider](https://codepen.io/aliabdullah-the-dev/pen/NPrVewr)

made with: GSAP

```css
.slider-wrapper { position: relative }
.nav-buttons { position: absolute; top: -60px; transform: translate(-200%, -100%) }
.nav-buttons button:disabled { opacity: 0.3 }
.card { opacity: 0.4 }
.card h2 { margin-top: 5px }
```

```js
gsap.to(card, {
gsap.to(cards, {
gsap.to(slider, {
```

### [Advanced CSS Dots Loader Animation (Wave Effect)](https://codepen.io/bharatmer/pen/LEZeZmw)

on scroll: span.: transform+opacity+top ×4 | made with: @keyframes

```css
.loader span { animation: wave 1.2s infinite ease-in-out }
.loader span:nth-child(1) { animation-delay: 0s }
.loader span:nth-child(2) { animation-delay: 0.15s }
.loader span:nth-child(3) { animation-delay: 0.3s }
.loader span:nth-child(4) { animation-delay: 0.45s }
0%, 100% { transform: translateY(0) scale(1); opacity: 0.6 }
50% { transform: translateY(-18px) scale(1.3); opacity: 1 }
@keyframes wave animates transform, opacity
```

### [Desert Mountains](https://codepen.io/gsiennavia/pen/WbxpJmX)

held: fixed a.the-most, fixed div.dg | made with: position: fixed

```css
.the-most { position: fixed; bottom: 5 }
```

### [Multi-Directional Wave Scroll (LTR & RTL)](https://codepen.io/themaulikshah/pen/MYeyXGO)

on scroll: text.[object: transform+top ×128, image.[object: transform+top ×8 | made with: requestAnimationFrame

```js
requestAnimationFrame(animate)
```

### [Liquid / Wave Progress - Pro (Tilt + Bubbles + Caustics)](https://codepen.io/ash1198/pen/qENdeYJ)

held: sticky header.top | on hover of button.btn: button.btn: transform+background | made with: position: sticky · transition · :hover · backdrop-filter · mix-blend-mode · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
.top { box-shadow: var(--shadow); backdrop-filter: blur(10px); position: sticky; top: 12px }
.logo { box-shadow: 0 0 18px rgba(52, 241, 200, 0.55) }
.btn { transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease }
.btn:hover { transform: translateY(-1px) }
.btn:active { transform: translateY(0px) scale(0.98) }
.grid { margin-top: 16px }
.card { box-shadow: 0 16px 50px rgba(0, 0, 0, 0.35); backdrop-filter: blur(10px); position: relative }
.card::before { position: absolute; inset: -1px; opacity: 0.9 }
.head { position: relative; margin-bottom: 10px }
.stage { position: relative }
.hud { position: absolute; inset: 0 }
.gloss { position: absolute; inset: 0; mix-blend-mode: screen; opacity: 0.85 }
```

```js
addEventListener("mousemove", (e) => setFromClientX(e.clientX), {
addEventListener( "mouseleave",
requestAnimationFrame(smooth)
requestAnimationFrame(loop)
```

### [Wave (Pure CSS)](https://codepen.io/guillhermm/pen/WbxvwPa)

on scroll: div.wave: transform+opacity+top | made with: @keyframes

```css
.fluid-container { position: relative }
.wave { position: absolute; top: 50%; animation: waveMovement 5s ease-in-out infinite; opacity: 0.8; margin-top: 0 }
.wave::before { position: absolute; top: -100%; animation: waveRipple 5s ease-in-out infinite }
0% { transform: rotate(45deg) translateY(0); opacity: 0.8 }
50% { transform: rotate(225deg) translateX(30px) translateY(30px); opacity: 1 }
100% { transform: rotate(405deg) translateY(0); opacity: 0.8 }
0% { transform: rotate(0deg); opacity: 0.5 }
25% { transform: rotate(90deg); opacity: 0.8 }
50% { transform: rotate(180deg); opacity: 0.5 }
75% { transform: rotate(270deg); opacity: 0.8 }
100% { transform: rotate(360deg); opacity: 0.5 }
@keyframes waveMovement animates transform, opacity
```

### [Surf The Wave -- CSS / JS Animation](https://codepen.io/soprannaturale/pen/raeZVQz)

held: fixed div.canvas-container, fixed div.title, fixed div.instruction | on scroll: div.instruction: transform+top | made with: position: fixed · @keyframes · transition · canvas 2D · requestAnimationFrame

```css
.scroll-container { position: relative }
.canvas-container { position: fixed; top: 0 }
.instruction { position: fixed; bottom: 40px; transform: translateX(-50%); animation: pulse 2s infinite; opacity: 0; transition: opacity 0.5s }
.instruction.visible { opacity: 1 }
0%, 100% { transform: translateX(-50%) scale(1) }
50% { transform: translateX(-50%) scale(1.05) }
.title { position: fixed; top: 50%; transform: translate(-50%, -50%); opacity: 0; transition: opacity 0.5s }
.title.visible { opacity: 1 }
@keyframes pulse animates transform
```

```js
requestAnimationFrame(draw)
```

### [Wave Balls](https://codepen.io/Josiah-Legg/pen/gbPeYmy)

made with: @keyframes · 3D (perspective / preserve-3d)

```css
.wave { perspective: 600px }
.dot { position: absolute; box-shadow: 0 0 1vh #005a2d, 0 0 2vh #005a2d, 0 0 4vh #005a2d; animation: move 3s ease-in-out infinite }
0%, 100% { transform: translateY(0) scale(1); opacity: 1 }
50% { transform: translateY(-40px) scale(1.4); opacity: 0.9 }
@keyframes move animates transform, opacity
```

### [半円形の波形（sin/cos関数風）](https://codepen.io/wakana-k/pen/LEGjwjX)

made with: canvas 2D

```css
canvas { margin-top: 20px }
```

### [半円形の波形の比較](https://codepen.io/wakana-k/pen/RNrZXoO)

made with: canvas 2D

### [Cyberpunk Text Energy Waves](https://codepen.io/daniel-mu-oz/pen/YPydmbZ)

made with: canvas 2D · requestAnimationFrame

```js
requestAnimationFrame(draw)
```

### [Solfeggio 3D Wave](https://codepen.io/BoocaAI/pen/NPGvgrw)

held: fixed div, fixed div | on scroll: div.menu-button: transform+background | made with: position: fixed · transition · :hover · three.js / WebGL · canvas 2D · pointer / mouse tracking · requestAnimationFrame

### [Waved 4: Mechanical Wave](https://codepen.io/WindOso/pen/WbvKGoy)

made with: canvas 2D · requestAnimationFrame

```js
requestAnimationFrame(gameMove)
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

### [WebGL Interactive Neon Wave Effect](https://codepen.io/phillip-gimmi/pen/raNRYpM)

made with: three.js / WebGL · pointer / mouse tracking · requestAnimationFrame

```css
#container { position: absolute }
```

```js
addEventListener('mousemove', (e) => {
requestAnimationFrame(render)
```

### [BootLib: Wave theme for tables](https://codepen.io/ascoos/pen/ZYEjmrw)

made with: transition · :hover

```css
.blib-theme-table-wave thead th { border-bottom: 2px solid #00796b }
.blib-theme-table-wave tbody td { position: relative; border-bottom: 1px solid #ddd; transition: all 0.4s ease-in-out }
.blib-theme-table-wave tbody td:hover { transform: translateY(-5px); box-shadow: 0px 4px 8px rgba(0,0,0,0.2) }
```

### [Sine Wave Animation](https://codepen.io/itelmen/pen/YPzQRPP)

made with: canvas 2D · requestAnimationFrame

```js
requestAnimationFrame(() => this.animate())
```

### [Gradient Wave Blend Text](https://codepen.io/z-rayc/pen/azbwLrX)

on scroll: div.wave-whitespace-1: transform+top, div.wave-whitespace-2: transform+top | made with: @keyframes · transition · clip-path · mix-blend-mode · custom properties driven by JS

```css
:root { --animation: spin linear infinite; --clip-path: inset(0 0 0 0 round 45%) }
.input-container { position: absolute; top: 0 }
.text { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.circle { position: relative; clip-path: circle(); box-shadow: inset 0 0 40px 20px rgba(0, 0, 0, 0.2) }
.bg-field, .bg-field-2 { position: absolute; bottom: calc(var(--circle-size) * var(--fill) / 100); transition: bottom 350ms }
.bg-field::before, .bg-field::after, .bg-field-2::before, .bg-field-2::after { position: absolute; inset: 0; clip-path: var(--clip-path); animation: var(--animation); animation-duration: var(--duration-1) }
.bg-field::before, .bg-field::after { mix-blend-mode: difference }
.bg-field-2::before, .bg-field-2::after { clip-path: var(--clip-path-2); transform: translateX(50px); animation-duration: var(--duration-2) }
.wave-whitespace-1, .wave-whitespace-2 { position: relative; clip-path: var(--clip-path); animation: var(--animation); animation-duration: var(--duration-1) }
.wave-whitespace-2 { position: absolute; animation: var(--animation); animation-duration: var(--duration-2) }
0% { transform: rotate(0deg) }
100% { transform: rotate(360deg) }
```

```js
style.setProperty('--fill', event.target.value)
```

### [Soundwave animation](https://codepen.io/janoamaral/pen/zxYvred)

made with: @keyframes

```css
#soundwave div:nth-child(1) { animation: waveAnimation 1s infinite }
#soundwave div:nth-child(2) { animation: waveAnimation 1.2s infinite }
#soundwave div:nth-child(3) { animation: waveAnimation 1.4s infinite }
#soundwave div:nth-child(4) { animation: waveAnimation 1.6s infinite }
@keyframes waveAnimation animates height
```

### [list wave selection:: choose :: CSS ONLY](https://codepen.io/sonnykoh/pen/emYYjag)

on scroll: a.: transform+top ×2, a.: transform | on hover of li.: a.: transform+top ×4, a.: transform | made with: transition · :hover · :has() · mix-blend-mode · 3D (perspective / preserve-3d)

```css
input.rad__li { position: absolute; top: 0px }
input.rad__li:after, input.rad__li:before { position: absolute; top: 50%; transform: translateY(-65%) }
input.rad__li:after { top: 50%; transform: translateY(-50%) }
ol { position: relative; transform: scale(0.98) }
ol:after { position: absolute; top: 40%; mix-blend-mode: screen; opacity: 0; position: absolute; transition: top 0.3s ease-out, transform 0.3s ease }
ol > li { padding-bottom: 6px; perspective: 500px }
ol > li:hover:not(:has(a > input.rad-on:checked)) { padding-bottom: 10px }
ol > li:hover:not(:has(a > input.rad-on:checked)) > a { transform: scale(1.02) translateZ(30px); transition: transform 0.2s ease, border-color 0.25s ease }
ol > li:hover + li > a { transform: scale(1.06) rotateX(-23deg); transition: transform 0.15s ease }
ol > li:has(+ li:hover) { padding-bottom: 12px }
ol > li:has(+ li:hover) > a { transform: scale(1.06) rotateX(16deg); transition: transform 0.15s ease }
ol:has(li:hover):after { opacity: 0.5; margin-top: -1px; transform: scale(1) translateZ(36px); transition: all 0.2s ease, opacity 0.2s ease, top 0.2s ease-in }
```

### [Animated Flag – Real-Time Configurable](https://codepen.io/mickaellherminez/pen/raBqedN)

held: fixed button.toggle-controls, fixed div, fixed div.stars | on scroll: div.block: transform+background+top ×137, div.star: transform+opacity ×127, div.star: transform+opacity+top ×23, div.block: background ×10, div.block: transform+background ×3 | on hover of button.toggle-controls: div.block: transform+background+top ×120, div.star: transform+opacity ×113, div.star: transform+opacity+top ×37, div.block: transform+background ×17, div.block: background ×10, div.block: transform+top ×3 | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · custom properties driven by JS · requestAnimationFrame

```css
html, body { filter: brightness(0.9) }
.scene { position: relative }
.flag-assembly { position: relative }
.flag-pole { position: absolute; top: -20px; box-shadow: -1px 0 8px rgba(0, 0, 0, 0.5), 1px 0 8px rgba(0, 0, 0, 0.5), inset 1px 0 3px rgba(255, 255, 255, 0.2) }
.flag-pole::before { position: absolute; top: 0; transform: translate(-50%, -50%); box-shadow: 0 3px 10px rgba(0, 0, 0, 0.6), inset 0 -1px 3px rgba(255, 255, 255, 0.4) }
.block { position: relative; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); transition: transform 0.15s ease, background-color 0.15s ease }
.block::after { position: absolute; top: -25%; bottom: -25%; filter: blur(calc(var(--block-size) * 0.4)); opacity: 0.8 }
.toggle-controls { position: fixed; top: 20px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); transition: all 0.3s ease }
.toggle-controls:hover { transform: scale(1.1) }
#controls { position: fixed; top: 80px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); transform: translateX(120%); transition: transform 0.3s ease; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) }
#controls.visible { transform: translateX(0) }
.slider-container label { margin-bottom: 5px }
```

```js
style.setProperty('--duration', (2 + Math.random() * 4) + 's')
style.setProperty('--delay', Math.random() * -5 + 's')
requestAnimationFrame(updateBlocks)
```

### [Beautiful particle wave animation](https://codepen.io/Southern-Frogs/pen/WbeKyPe)

made with: position: fixed · @keyframes · 3D (perspective / preserve-3d) · canvas 2D · pointer / mouse tracking · requestAnimationFrame

```css
.container { perspective: 1000px; position: relative }
.tunnel { position: absolute; animation: tunnelRotate 20s linear infinite }
.tunnel::before { position: absolute }
.segment { position: absolute; top: 50% }
.overlay { position: fixed; top: 0 }
.title { opacity: 0.8; animation: pulseText 2s ease-in-out infinite }
.subtitle { margin-top: 2vh; text-transform: uppercase; animation: fadeInOut 4s ease-in-out infinite }
0% { transform: rotateZ(0deg) }
100% { transform: rotateZ(360deg) }
0%, 100% { opacity: 0.8; transform: scale(1) }
50% { opacity: 1; transform: scale(1.05) }
0%, 100% { opacity: 0.2 }
```

```js
addEventListener("mousemove", (e) => {
requestAnimationFrame(() => this.animate())
requestAnimationFrame(animate)
```

### [Gradient Wave Background](https://codepen.io/andiriyansah/pen/KwPojBB)

made with: canvas 2D · requestAnimationFrame

```css
canvas { position: absolute; top: 0 }
```

```js
requestAnimationFrame(animate)
```

### [Wave Underline Decorator with CSS `mask-image` and SVG](https://codepen.io/6chinwei/pen/JoPRMeB)

made with: mask

```css
.section-title--pink { position: relative }
.section-title--pink::after { position: absolute; bottom: 0; transform: translate(0, 50%); mask-image: url('data:image/svg+xml; mask-repeat: repeat-x }
.section-title--blue { position: relative }
.section-title--blue::after { position: absolute; bottom: 0; transform: translate(0, 50%); mask-image: url('data:image/svg+xml; mask-repeat: repeat-x }
.section-title--green { position: relative }
.section-title--green::after { position: absolute; bottom: 0; transform: translate(0, 50%); mask-image: url('data:image/svg+xml; mask-repeat: repeat-x }
```

### [Klaviyo Flag Animation](https://codepen.io/photodow/pen/bNbELJZ)

on scroll: div.flag: transform+top | made with: @keyframes

```css
.flag-wrapper { transform: scale(0.5) }
.flag { animation-name: flag-wave-stabilize, tilt-flag; animation-duration: 1s, 5s; animation-iteration-count: infinite, infinite; animation-timing-function: ease-in-out, ease-in-out }
.flag > div { translate: 0 0; animation-name: flag-wave; animation-duration: 1s; animation-iteration-count: infinite; animation-timing-function: ease-in-out }
.flag > div:nth-child(1) { animation-delay: 0.0025s }
.flag > div:nth-child(2) { animation-delay: 0.005s }
.flag > div:nth-child(3) { animation-delay: 0.0075s }
.flag > div:nth-child(4) { animation-delay: 0.01s }
.flag > div:nth-child(5) { animation-delay: 0.0125s }
.flag > div:nth-child(6) { animation-delay: 0.015s }
.flag > div:nth-child(7) { animation-delay: 0.0175s }
.flag > div:nth-child(8) { animation-delay: 0.02s }
.flag > div:nth-child(9) { animation-delay: 0.0225s }
```

### [Pure CSS Mexican Wave Image Slider](https://codepen.io/Avoloch/pen/xbKwJqW)

on scroll: div.card: transform+top ×6, div.card: transform+filter+top | on hover of div.card: div.card: transform+top ×5, div.card: transform+filter+top ×2 | made with: transition · :hover · :has() · 3D (perspective / preserve-3d)

```css
.container { transform: perspective(1000px); box-shadow: 0.3em 0.3em 1em #CCC, -0.3em -0.3em 1em #CCC }
.card { transition: .3s ease; filter: brightness(0.4) blur(5px); position: relative }
.container .card img { object-position: center }
.card:hover { filter: brightness(1) blur(0); transform: translateZ(200px) translateY(-20px) }
.card:hover + * { transform: translateZ(100px) translateY(-10px) rotateY(40deg) rotateZ(20deg) }
.card:hover + * + * { transform: translateZ(50px) translateY(10px) rotateY(20deg) rotateZ(10deg) }
.card:hover + * + * + * { transform: translateZ(25px) translateY(20px) rotateY(10deg) rotateZ(5deg) }
.card:hover + * + * + * + * { transform: translateZ(10px) translateY(30px) rotateY(5deg) }
.card:hover + * + * + * + * + * { transform: translateZ(5px) translateY(40px) }
.card:hover + * + * + * + * + * + * { transform: translateZ(5px) translateY(50px) }
.card:has(+ *:hover) { transform: translateZ(100px) translateY(-10px) rotateY(-40deg) rotateZ(-20deg) }
.card:has(+ * + *:hover) { transform: translateZ(50px) translateY(10px) rotateY(-20deg) rotateZ(-10deg) }
```

### [Circles in a wave motion](https://codepen.io/RonakDesai007/pen/YPKzGoO)

on scroll: div.circle: transform+top ×4, div.circle: transform | made with: @keyframes

```css
.circle { animation: waveAnimation 1.5s ease-in-out infinite }
.circle:nth-child(1) { animation-delay: 0s }
.circle:nth-child(2) { animation-delay: 0.2s }
.circle:nth-child(3) { animation-delay: 0.4s }
.circle:nth-child(4) { animation-delay: 0.6s }
.circle:nth-child(5) { animation-delay: 0.8s }
0%, 100% { transform: translateY(0) }
50% { transform: translateY(-40px) }
@keyframes waveAnimation animates transform
```

### [Liquid Wave](https://codepen.io/RonakDesai007/pen/XJrWKBv)

on scroll: div.liquid: transform+opacity+top | made with: @keyframes

```css
.visualizer { position: relative }
.liquid { position: absolute; animation: pulse 2s ease-in-out infinite, morph 3s ease-in-out infinite }
0% { transform: scale(0.95); opacity: 0.7 }
50% { transform: scale(1.05); opacity: 1 }
100% { transform: scale(0.95); opacity: 0.7 }
0% { transform: translateY(0) }
25% { transform: translateY(-20px) }
50% { transform: translateY(20px) }
75% { transform: translateY(-20px) }
100% { transform: translateY(0) }
@keyframes pulse animates transform, opacity
@keyframes morph animates border-radius, transform
```

### [Wavy Responsive Footer](https://codepen.io/SpectacledCoder/pen/yLmrKPa)

made with: transition · :hover

```css
.spectacledcoder-footer { margin-bottom: 0px; position:relative' width='3000' height='588' preserveAspectRatio='xMidYMid' viewBox='0 0 3000 588'><g transform='translate(1500,294) scale(-1,-1) translate(-1500,-294)'><linearGradient id='lg-0.999782 }
.d-footer-li { margin-bottom: 5px }
.d-footer-li:hover { transform: translateX(10px); transition: all 0.4s }
.d-footer-li-h { margin-bottom: 10px }
.logo { margin-top: 10px }
.spectacledcoder-footer { margin-bottom: 0px; background-position: bottom; position:relative' width='3000' height='588' preserveAspectRatio='xMidYMid' viewBox='0 0 3000 588'><g transform='translate(1500,294) scale(-1,-1) translate(-1500,-294)'><l }
.spectacledcoder-footer-bottom { margin-bottom: 0px }
.d-footer-li { margin-bottom: 5px }
.d-footer-li-h { margin-bottom: 10px }
```

### [canvas wave animation](https://codepen.io/sohrabzia/pen/OJKZzOb)

made with: canvas 2D · requestAnimationFrame

```css
canvas { position:absolute }
```

```js
requestAnimationFrame(animate)
```

### [Animated Wavy Background](https://codepen.io/AliKh01/pen/dyxmjzQ)

made with: position: fixed · @keyframes

```css
.page::before { position: fixed; top: 50%; transform: translateX(-50%) skew(0deg, -10deg); animation: waving 6s ease-in-out infinite alternate }
from { transform: translateX(-50%) skew(0deg, -10deg) }
to { transform: translateX(-30%) skew(10deg, 0deg) }
.card { position: absolute; top: 50%; transform: translate(-50%, -50%); box-shadow: 0 0 10px #ddd inset }
@keyframes waving animates transform
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

### [Flow Field Art](https://codepen.io/zimquadery/pen/VwoeRGW)

made with: nothing recognised — read the code

### [css waves](https://codepen.io/dmbdesignpdx/pen/ExBeaVx)

made with: @keyframes · 3D (perspective / preserve-3d)

```css
#back { fill-opacity: 0.6; animation: back-motion 8s linear infinite both }
#front { animation: front-motion 6s linear infinite both }
@keyframes back-motion animates d
@keyframes front-motion animates d
```

### [Wavy divider (JS)](https://codepen.io/_bear/pen/vYqedyd)

made with: nothing recognised — read the code

### [Bublles](https://codepen.io/Vini-Vieira-the-styleful/pen/rNEVpwe)

on scroll: div.bubble: transform+top ×2 | made with: @keyframes

```css
#bubbles-container { position: absolute; bottom: 0 }
.bubble { position: absolute; bottom: 0; animation: rise 10s linear infinite }
0% { transform: translateY(0) scale(1); opacity: 1 }
80% { opacity: 1 }
100% { transform: translateY(-30vh) scale(0.5); opacity: 0 }
@keyframes rise animates transform, opacity
```

### [Animated Wave Icons](https://codepen.io/megh-bari/pen/KKjPQJb)

on scroll: a.icon: transform+top ×5 | on hover of a.icon: a.icon: transform+top ×5 | made with: @keyframes · transition · :hover

```css
.icon { position: relative; animation: wave 4s ease-in-out infinite; transition: transform 0.3s ease, background-image 0.3s ease }
.icon::before { position: absolute; top: -400px; transform: translateX(-50%) }
.icon:hover { transform: scale(1.1) }
.instagram { animation-delay: 1s }
.x { animation-delay: 1.5s }
.codepen { animation-delay: 2s }
.linkedin { animation-delay: 2.5s }
.github { animation-delay: 3s }
0%, 100% { transform: translate(0) }
25% { transform: translateY(-20px) }
50% { transform: translateY(10px) }
75% { transform: translateY(-20px) }
```

### [Tunnel](https://codepen.io/daniel-mu-oz/pen/GRbKpod)

on scroll: i.: transform+top ×39, div.ball: transform+top, i.: transform | made with: @keyframes · 3D (perspective / preserve-3d)

```css
body { perspective: 1200px }
.scene { transform: rotateZ(45deg) }
.move { position: relative; perspective: 1000px }
.move .waves { position: absolute; perspective: 1500px }
.move .waves i { position: absolute; animation: scale 4.8s cubic-bezier(0.61, 1, 0.88, 1) infinite; box-shadow: 0 0 2px 2px #fff, 0 0 5px 4px #fff, 0 0 10px 4px #00e5ff, 0 0 15px 5px #00e5ff }
.move .waves i:nth-of-type(1) { transform: rotateY(60deg) translateZ(-30px) var(--scale); animation-delay: calc(sin(3deg) * 1s) }
.move .waves i:nth-of-type(2) { transform: rotateY(60deg) translateZ(-30px) var(--scale); animation-delay: calc(sin(3deg) * 2s) }
.move .waves i:nth-of-type(3) { transform: rotateY(60deg) translateZ(-30px) var(--scale); animation-delay: calc(sin(3deg) * 3s) }
.move .waves i:nth-of-type(4) { transform: rotateY(60deg) translateZ(-30px) var(--scale); animation-delay: calc(sin(3deg) * 4s) }
.move .waves i:nth-of-type(5) { transform: rotateY(60deg) translateZ(-30px) var(--scale); animation-delay: calc(sin(3deg) * 5s) }
.move .waves i:nth-of-type(6) { transform: rotateY(60deg) translateZ(-30px) var(--scale); animation-delay: calc(sin(3deg) * 6s) }
.move .waves i:nth-of-type(7) { transform: rotateY(60deg) translateZ(-30px) var(--scale); animation-delay: calc(sin(3deg) * 7s) }
```
