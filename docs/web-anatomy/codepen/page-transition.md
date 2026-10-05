# CodePen · page-transition — how each pen does it

43 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/page-transition.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| transition | 25 |
| position: fixed | 20 |
| :hover | 18 |
| @keyframes | 13 |
| GSAP | 11 |
| clip-path | 4 |
| requestAnimationFrame | 3 |
| anime.js | 3 |
| custom properties driven by JS | 2 |
| position: sticky | 2 |
| three.js / WebGL | 2 |
| 3D (perspective / preserve-3d) | 2 |
| prefers-reduced-motion | 1 |
| view transitions | 1 |
| backdrop-filter | 1 |
| ScrollTrigger | 1 |
| scroll listener | 1 |
| mix-blend-mode | 1 |
| mask | 1 |

## Every pen

### [Creative Split Page Transition | CSS + Vanilla JS](https://codepen.io/editor/Alexey-Kovalevsky-AKAVA/pen/01a0519b-f54f-7832-9ea4-079a6ab053c5)

held: fixed div.page-wipe, fixed header.demo-header | made with: position: fixed · transition · :hover · prefers-reduced-motion · clip-path · custom properties driven by JS · requestAnimationFrame

```css
.page-wipe { position: fixed; inset: 0 }
.page-wipe__row { position: relative }
.page-wipe__half { position: absolute; top: 0; bottom: 0; transition: width var(--wipe-duration) cubic-bezier(.76, 0, .24, 1) }
.page-wipe__title { position: absolute; top: calc(var(--row) * -20dvh) }
.page-wipe__row:nth-child(3)::after { position: absolute; top: 50%; opacity: 0; transform: translate(-50%, -50%) scale(.3); transition: opacity 160ms ease 280ms, transform 280ms ease 280ms }
.page-wipe.is-covering .page-wipe__row:nth-child(3)::after { opacity: 1; transform: translate(-50%, -50%) scale(1) }
.page-wipe.is-covered .page-wipe__half { transition: none }
.demo-header { position: fixed; top: 0 }
.demo-header__label { opacity: .55 }
.demo-eyebrow { margin-bottom: 28px }
.demo-home__intro { margin-bottom: clamp(70px, 9vw, 140px) }
.demo-card { position: relative }
```

```js
requestAnimationFrame(() => {
requestAnimationFrame(resolve)
style.setProperty( '--wipe-bg',
style.setProperty( '--wipe-color',
style.setProperty( '--wipe-accent',
```

### [Animated Page Transition on Load](https://codepen.io/editor/pamcy/pen/01682cff-ace0-780c-b309-853f9277347e)

made with: nothing recognised — read the code

### [Animated Page Transition](https://codepen.io/editor/aykutkapisiz/pen/016a926a-4840-7c1a-a7ed-24c66dd87ccd)

made with: nothing recognised — read the code

### [Barba.js + Locomotive Scroll](https://codepen.io/editor/radoslav-valchev/pen/0173dd29-1560-7db8-9773-81acc8a53f74)

made with: nothing recognised — read the code

### [GSAP Page Transition: Diagonal Pill Bars Sweep Bottom-Left to Top-Right](https://codepen.io/syxriffkml/pen/qEqOXyP)

held: fixed nav.navbar, fixed div.transition-container | made with: position: fixed · transition · :hover · GSAP

```css
.navbar { position: fixed; top: 0 }
.nav-link { text-transform: uppercase; opacity: 0.5; transition: opacity 0.2s }
.nav-link:hover { opacity: 1 }
.nav-link.active { opacity: 1 }
.transition-container { position: fixed; top: 50%; margin-top: -150vmax; transform: rotate(-45deg) }
.bar { transform: translateX(-110%) }
```

```js
gsap.timeline({ onComplete: () => { locked = false
```

### [3D Page Transition from Codrops](https://codepen.io/editor/Ash_318/pen/019df1e7-0e9a-7d43-b9fd-0491116a2dec)

on scroll: button.nav-btn: opacity, svg.[object: transform | made with: transition · :hover · GSAP

```css
#wrapper { position: relative }
.page { position: absolute; inset: 0 }
.nav-btn { position: relative; text-transform: uppercase; transition: opacity 0.2s }
.nav-btn:hover { opacity: 0.75 }
.nav-btn:active { opacity: 0.5 }
.nav-btn svg { transition: transform 0.3s ease }
.nav-btn:hover svg { transform: translateX(4px) }
.page-b .nav-btn:hover svg { transform: translateX(-4px) rotate(180deg) }
.corner-label { position: absolute; bottom: 24px; text-transform: uppercase; opacity: 0.25 }
```

```js
gsap.timeline({
```

### [Untitled](https://codepen.io/Sedict/pen/ogzVNXv)

made with: position: fixed · transition · :hover · GSAP

```css
#app { position: relative }
.logo-container { position: fixed; top: 2rem }
.source-link, .demo-link { position: fixed }
.source-link { top: 2rem }
.demo-link { bottom: 2rem }
.source-link::after, .demo-link::after { position: absolute; bottom: -2px; transform: scaleX(0); transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1) }
.source-link:hover::after, .demo-link:hover::after { transform: scaleX(1) }
.copyright { position: fixed; bottom: 2rem; opacity: 0.7 }
.page { position: absolute; top: 0 }
.nav-links a { position: relative }
.nav-links a::after { position: absolute; bottom: -4px; transform: scaleX(0); transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1) }
.nav-links a.active::after, .nav-links a:hover::after { transform: scaleX(1) }
```

```js
gsap.timeline()
```

### [View Transition API Demo – Pseudo Page Transition](https://codepen.io/tkdev-hub/pen/bNwKyQX)

made with: position: sticky · view transitions · @keyframes · transition · :hover · backdrop-filter

```css
.topbar { border-bottom: 1px solid var(--line); backdrop-filter: blur(10px); position: sticky; top: 0 }
.eyebrow { text-transform: uppercase }
.demo-card { box-shadow: var(--shadow); transition: transform 0.18s ease, border-color 0.18s ease }
.demo-card:hover { transform: translateY(-2px) }
.demo-card strong { margin-bottom: 10px }
.card-label { margin-bottom: 14px; text-transform: uppercase }
.back-button { margin-bottom: 20px }
.detail-panel { box-shadow: var(--shadow) }
::view-transition-old(root), ::view-transition-new(root) { animation-duration: 0.4s; animation-timing-function: ease }
::view-transition-old(root) { animation-name: page-out }
::view-transition-new(root) { animation-name: page-in }
from { opacity: 1; transform: scale(1); filter: blur(0) }
```

```js
startViewTransition(() => {
```

### [Column-Drop-Page-Transition-V1](https://codepen.io/IntellarisStudio/pen/KwgPvyw)

made with: position: fixed · transition · :hover · GSAP

```css
#app { position: relative }
.logo-container { position: fixed; top: 2rem }
.source-link, .demo-link { position: fixed }
.source-link { top: 2rem }
.demo-link { bottom: 2rem }
.source-link::after, .demo-link::after { position: absolute; bottom: -2px; transform: scaleX(0); transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1) }
.source-link:hover::after, .demo-link:hover::after { transform: scaleX(1) }
.copyright { position: fixed; bottom: 2rem; opacity: 0.7 }
.page { position: absolute; top: 0 }
.nav-links a { position: relative }
.nav-links a::after { position: absolute; bottom: -4px; transform: scaleX(0); transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1) }
.nav-links a.active::after, .nav-links a:hover::after { transform: scaleX(1) }
```

```js
gsap.timeline()
```

### [Ripple Effect Page Transition](https://codepen.io/TenCzwarty/pen/NPKMzQR)

made with: position: fixed · @keyframes · transition · custom properties driven by JS

```css
.page-transition-circle-wrapper { position: fixed; top: 0 }
.page-transition-circle { position: absolute; transform: translate(-50%, -50%) scale(0); transition: opacity var(--animation-duration-opacity) ease-in-out; animation: circle-expand var(--animation-duration-circle) ease-out forwards }
to { transform: translate(-50%, -50%) scale(1) }
@keyframes circle-expand animates transform
```

```js
style.setProperty( "--animation-duration-circle",
style.setProperty( "--animation-duration-opacity",
```

### [On-Scroll Fire Transition (WebGL + GSAP ScrollTrigger)](https://codepen.io/ksenia-k/pen/GRLqZVR)

held: fixed canvas, fixed div.scroll-msg | on scroll: div.scroll-msg: opacity, div.arrow-animated: transform+top | on hover of a.: div.scroll-msg: opacity, div.arrow-animated: transform | made with: position: fixed · @keyframes · GSAP · ScrollTrigger · three.js / WebGL · requestAnimationFrame

```css
.page { opacity: 0 }
.page .header { text-transform: uppercase; margin-top: 20vh }
.page .last-line { padding-top: 1em }
.scroll-msg { position: fixed; top: 0; padding-top: 2em }
.scroll-msg > div:nth-child(1) { margin-top: -10vh; padding-bottom: 1em; text-transform: uppercase }
canvas#fire-overlay { position: fixed; top: 0 }
.arrow-animated { animation: arrow-float 1s infinite }
0% { transform: translateY(0); animation-timing-function: ease-out }
60% { transform: translateY(50%); animation-timing-function: ease-in-out }
100% { transform: translateY(0); animation-timing-function: ease-out }
@keyframes arrow-float animates transform, animation-timing-function
```

```js
gsap.timeline({
gsap.to(params, {
requestAnimationFrame(render)
```

### [Harry's House](https://codepen.io/valerioio/pen/xxJjdLP)

made with: scroll listener

```js
addEventListener("scroll", () => {
```

### [Page transition animation w/CSS](https://codepen.io/sacsam005/pen/qBpXxWZ)

held: fixed div.cover, fixed div.cover, fixed div.cover, sticky header | made with: position: sticky · position: fixed · @keyframes · transition · :hover

```css
#home { position: -webkit-sticky; position: sticky; top: 0; box-shadow: 0px 4px 10px rgba(52, 72, 115, 0.35); -webkit-box-shadow: 0px 4px 10px rgba(52, 72, 115, 0.35) }
.navbar { -webkit-transition: all 0.5s; transition: all 0.5s }
a.nav-link { -webkit-transition: 0.5s; transition: 0.5s }
a.nav-link:hover { transition: 0.5s ease }
.bar { -webkit-transition: 0.5s; transition: 0.5s }
.cover { position: fixed; top: 0 }
.transition.slide .cover1 { -webkit-animation: slide 0.3s ease-in-out forwards; animation: slide 0.3s ease-in-out forwards }
.transition.slide .cover2 { -webkit-animation: slide 0.3s ease-in-out forwards; animation: slide 0.3s ease-in-out forwards; -webkit-animation-delay: 0.3s; animation-delay: 0.3s }
.transition.slide .cover3 { -webkit-animation: slide 0.3s ease-in-out forwards; animation: slide 0.3s ease-in-out forwards; -webkit-animation-delay: 0.6s; animation-delay: 0.6s }
.active .bar:nth-child(2) { opacity: 0 }
.active .bar:nth-child(1) { -webkit-transform: translateY(8px) rotate(-315deg); transform: translateY(8px) rotate(-315deg) }
.active .bar:nth-child(3) { -webkit-transform: translateY(-10px) rotate(-45deg); transform: translateY(-10px) rotate(-45deg) }
```

### [Page Transition](https://codepen.io/kraver/pen/JjYvbZQ)

made with: @keyframes · transition · :hover

```css
body::after { position: absolute; top: 0; bottom: 0; background-position: center; opacity: 0.3 }
h1 { position: relative; top: 0px; animation: title 2s ease-in forwards }
0% { top: -100vh }
100% { top: 0 }
.content { position: relative; bottom: 0; animation: content 2s ease-in forwards }
0% { bottom: -100vh }
100% { bottom: 0 }
.btn { text-transform: uppercase; opacity: 0; transition: all .3s linear; animation: btn 1.5s ease-in 1.5s forwards }
0% { opacity: 0 }
100% { opacity: 1 }
@keyframes title animates top
@keyframes content animates bottom
```

### [Flashy page transition](https://codepen.io/rgembalik/pen/RwWQjdE)

held: fixed div.overlay | on scroll: div.overlay__ribbon: transform+top ×15, a.: background+color | on hover of a.: div.overlay__ribbon: transform+top ×12, div.overlay__ribbon: transform ×3, a.: background+color | made with: position: fixed · @keyframes · transition · :hover · mix-blend-mode · 3D (perspective / preserve-3d)

```css
.overlay { position: fixed; top: 0; perspective: 1000px }
.overlay__scene { position: absolute; top: 0; perspective: 500px; transform: skew(20deg) translateX(172.794%) }
.overlay__scene--in { -webkit-animation: overlayIn 400ms ease-in-out 1 both; animation: overlayIn 400ms ease-in-out 1 both }
.overlay__scene--in .overlay__label { -webkit-animation: labelIn 2s ease-in-out 1 forwards; animation: labelIn 2s ease-in-out 1 forwards }
.overlay__scene--out { -webkit-animation: overlayOut 400ms ease-in-out 1 both; animation: overlayOut 400ms ease-in-out 1 both }
.overlay__scene--out .overlay__label { -webkit-animation: none; animation: none }
from { transform: skewY(-10deg) translateY(-50%) rotatey(10deg) }
to { transform: skewY(-10deg) translateY(-50%) rotatey(-10deg) }
from { transform: skewY(-10deg) translateY(-50%) rotatey(10deg) }
to { transform: skewY(-10deg) translateY(-50%) rotatey(-10deg) }
from { transform: skew(20deg) translate3d(172.794%, 0, 0) }
to { transform: skew(20deg) translate3d(0, 0, 0) }
```

### [Page Transition - GSAP - Curtains](https://codepen.io/plenge/pen/zYvdVEL)

held: fixed div.loader | on scroll: div.loader__element: transform | on hover of img.: div.loader__element: transform | made with: position: fixed · GSAP

```css
.image { position: absolute; top: 0 }
.image img { position: absolute }
.loader { position: fixed }
.loader__element { position: absolute; top: 0; transform: scaleX(0) }
```

```js
gsap.timeline({})
```

### [Kill the Ketchup](https://codepen.io/lerida/pen/QWjwvJa)

on scroll: g.[object: transform+top ×5, g.[object: transform ×2, path.[object: transform+top | made with: clip-path · GSAP

```css
svg { transform: scale(.5); position: absolute }
#dead-eye-l, #dead-eye-r, #dead-mouth, #dead-tongue, #dead-slobber-l, #dead-slob { opacity: 0 }
#ketchup-sauce { margin-top: -600px; transform: translateX(-30px); opacity: 0 }
#transition { transform: scale(1); position: absolute; top: -3050px }
```

```js
gsap.timeline({repeat: -1})
gsap.to("#body", .25, {y: 120, ease: Bounce.easeOut})
gsap.to("#body-base", .15, {morphSVG: {
gsap.to("#body-shadow", .15, {morphSVG: {
gsap.to("#body-light-2", .15, {morphSVG: {
gsap.to("#body-light-3", .15, {morphSVG: {
gsap.to("#body-light-4", .15, {morphSVG: {
gsap.to("#label-wrapper-l", .15, {morphSVG: {
```

### [Radial Clip Reveal](https://codepen.io/dpkmcateer/pen/LYVrGJZ)

made with: clip-path · anime.js

```css
.page { position: absolute }
.usage { position: absolute; top: calc(50vh - 50px) }
```

### [page transition](https://codepen.io/animationbro/pen/WNvperV)

on scroll: div.content: transform+top | on hover of a.: div.content: transform+top | made with: position: fixed · transition · :hover

```css
header { box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.2) }
nav span .bar { position: relative }
nav span .bar:before, nav span .bar:after { position: absolute }
nav span .bar:before { bottom: 5px }
nav span .bar:after { top: 5px }
section .content { -webkit-transform: rotate(-90deg); transform: rotate(-90deg) }
section .content .heading { margin-bottom: 20px }
section { -webkit-transition: all 0.4s cubic-bezier(0.61, -0.44, 0.33, 1.39); transition: all 0.4s cubic-bezier(0.61, -0.44, 0.33, 1.39) }
section:nth-child(1):hover .content { -webkit-transform: rotate(0deg); transform: rotate(0deg) }
section:nth-child(2):hover .content { -webkit-transform: rotate(0deg); transform: rotate(0deg) }
section:nth-child(3):hover .content { -webkit-transform: rotate(0deg); transform: rotate(0deg) }
section:nth-child(4):hover .content { -webkit-transform: rotate(0deg); transform: rotate(0deg) }
```

### [Play with Header on Page Transitions](https://codepen.io/pehaa/pen/wvBLpNK)

held: fixed nav | made with: position: fixed · @keyframes · transition · mask

```css
.bg { transition: background 0s 1s, color 0.6s }
.bg:after { position: fixed; top: 0; bottom: 0; transition: 1s }
.transition { top: 0; position: absolute; opacity: 0; transition: transform 0.6s ease-in-out; transform: scale(0.1) }
.bio .transition-bio, .projects .transition-projects, .find-me .transition-find- { opacity: 1 }
.bio .transition-bio { transform: scale(1) }
.projects .transition-projects { transform: scale(1) translateX(-7.5rem) }
.find-me .transition-find-me { transform: scale(1) translateX(-15rem) }
.dots:before, .dots:after { position: fixed; top: 0; bottom: 0; opacity: 0.5; background-position: 0 0; -webkit-animation: movebg 0.2s linear infinite; animation: movebg 0.2s linear infinite; will-change: transform }
.dots:after { animation-direction: reverse }
0% { transform: translate3d(0, 0, 0) }
100% { transform: translate3d(0, var(--dots-gap), 0) }
0% { transform: translate3d(0, 0, 0) }
```

### [Mobile app (cars)](https://codepen.io/co0kie/pen/OJJdVbp)

held: fixed a | made with: position: fixed · transition · :hover

```css
:root { --transition: 200ms }
.container { position: relative }
.navigation { position: relative }
.navigation > button { position: relative; border-top: 0; border-bottom: 2px solid black }
.navigation > button::after, .navigation > button::before { transition: var(--transition); position: absolute }
.navigation > button::before { top: 0 }
.navigation > button::after { bottom: 6px }
.navigation > button.active { border-bottom: 0 }
.navigation > button.active::before { top: 7px; transform: rotate(45deg); bottom: 0 }
.navigation > button.active::after { bottom: 0; transform: rotate(-45deg); top: 7px }
.header { transition: var(--transition) ease-in-out; opacity: 1 }
.show .header { opacity: 0 }
```

### [Awsome animated navigation](https://codepen.io/Maurokaan/pen/PvQVqd)

held: fixed nav | on hover of li.: a.: color | made with: position: fixed · transition · :hover · anime.js

```css
body::after { position: fixed; top: 0; transition: all 0.8s ease }
body::before { position: fixed; bottom: 0; transition: all 0.8s ease }
nav { padding-top: 50px; padding-bottom: 50px; position: fixed }
nav ul li a { position: relative; transition: all 0.2s ease }
nav ul li a:after { position: absolute; bottom: 0; transition: 0.2s ease }
nav ul li a:hover:after { position: absolute; bottom: 0 }
#header { padding-top: 150px; padding-bottom: 150px }
```

### [Stunning Page Transition](https://codepen.io/Unleashed-Design/pen/JZwexa)

made with: anime.js

```css
body .intro-screen, html .intro-screen { position: relative }
body .intro-screen .intro-screen__titel, html .intro-screen .intro-screen__titel { top: -0.2rem; position: relative }
body .intro-screen .intro-screen__shape, html .intro-screen .intro-screen__shape { position: relative }
```

### [Gsap right to left page transition](https://codepen.io/jgatjens/pen/QrBqKo)

held: fixed div.m-page--transition | on hover of button.btn-r: button.btn-r: background+color | made with: position: fixed · transition · :hover

```css
.m-page--transition { position: fixed }
button { text-transform: uppercase; position: relative; transition: all 0.3s }
```

### [Page Transition - Fade](https://codepen.io/SB-Steve/pen/ddKVLx)

made with: transition

```css
body { transition:opacity 1s ease-out }
body.fadeOut { opacity:0 }
```

### [Slide-in page transition](https://codepen.io/chrishenke/pen/WMEOPX)

made with: transition

```css
header { transition: transform 1s linear }
header.load-in { transform: translateY(-100%) scale(0.1, 0.1) }
```

### [webgl exercise](https://codepen.io/gbnikolov/pen/LOrMvq)

made with: three.js / WebGL · requestAnimationFrame

```js
requestAnimationFrame(renderFrame)
```

### [Milk Flooding](https://codepen.io/Dinkelborg/pen/dVRXxY)

held: fixed div.view | made with: position: fixed · @keyframes · :hover

```css
.view { position: fixed; top: 0 }
#flood { filter: url('#goo'); position:absolute; top: 100%; transform: translateX(-50%) }
#flood.flooded { top: -25% }
#flood.in { animation: rise 3s forwards ease-in }
#flood.out { animation: rise 3s backwards reverse ease-in-out }
#flood.in .wave { animation: flow 3s linear infinite }
#flood.out .wave { animation: flow 3s linear reverse infinite }
.wave { position: absolute; top: 0 }
#flood .wave:nth-child(1) { animation-delay: 0.7s }
#flood .wave:nth-child(2) { animation-delay: 1.5s }
#flood .wave:nth-child(3) { animation-delay: 2s }
.surface { position: absolute; top: 50px }
```

### [Lo-Fi clipping transition](https://codepen.io/tt9/pen/gxZWjp)

held: fixed div.view, fixed div.view | made with: position: fixed · clip-path

```css
.view { position: fixed; top: 0; bottom: 0 }
.content { margin-top: 64px }
.content-1 { position: relative }
.content-2 { position: relative }
.content-3 { position: relative }
.content-small { margin-top: 32px }
.button { margin-top: 48px; position: relative }
.button-primary::after, .button-secondary::after { position: absolute; top: 12px; bottom: 12px }
.content-small-1 { position: relative }
.content-small-1::after { position: absolute; top: 12px; bottom: 12px }
.view-content { position: relative }
#page-1 { clip-path: url(#clipping-path-1) }
```

### [Page Transition](https://codepen.io/HarryRay/pen/XgoWWg)

made with: nothing recognised — read the code

```css
#transition_div { box-shadow:5px 5px 5px -3px black }
```

### [project detail transition](https://codepen.io/m_90/pen/xgzpQP)

made with: GSAP

```css
#heroTitle { position: absolute; bottom: 0; transform: translate(0, 25%) }
#projectTitle { position: absolute; top: 50%; transform: translate(-50%, -50%); text-transform: uppercase }
#projectImg { position: absolute; background-position: 50% 50%; top: 50%; transform: translate(-50%, -50%) }
#projectDescription::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.2) }
#projectDescription a { border-bottom: 1px solid #cecece }
p.intro { text-transform: uppercase }
```

### [Presentation Pages](https://codepen.io/chris22smith/pen/BLzVwX)

on scroll: i.fa: opacity ×7 | made with: @keyframes · transition · :hover

```css
.container { position: absolute; top: 0; transition: all 1s ease-in-out }
.container.bottom { top: -100% }
.page { box-shadow: 0 0 20px 10px rgba(0, 0, 0, 0.25) inset; position: absolute }
.page.pink { bottom: 50%; top: 0 }
.page.blue { bottom: 50%; top: 0 }
.page.yellow { bottom: 0; top: 50% }
.page.green { bottom: 0; top: 50% }
.fa { animation: pulse 2s infinite linear alternate; opacity: 0.5; position: absolute }
.fa:hover { opacity: 1 }
.fa.fa-chevron-right { margin-top: -30px; top: 50% }
.fa.fa-chevron-left { margin-top: -30px; top: 50% }
.fa.fa-chevron-down { bottom: 10px }
```

### [Login page - old](https://codepen.io/ccromjongh/pen/mrymLM)

made with: @keyframes · transition · :hover

```css
.page-wrap { position: absolute; animation-duration: 0.5s; animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94); animation-fill-mode: forwards }
#login-wrapper { -webkit-box-shadow: 0px 2px 10px rgba(0,0,0,0.50); box-shadow: 0px 2px 10px rgba(0,0,0,0.50); position: relative; top: 50%; -webkit-transform: translateY(-50%) translateZ(0); transform: translateY(-50%) translateZ(0) }
label:first-child { margin-top: 0 }
input { transition: background-color 0.3s }
:-moz-placeholder { opacity: 1 }
::-moz-placeholder { opacity: 1 }
#loginBtn { margin-top: 16px }
#errMessage { margin-top: 11px }
#logo { margin-bottom: 10px }
#i { position: absolute; top: 20px }
#mainPage { opacity: 0 }
.bar { border-bottom: 1px solid #EEE }
```

### [Thumbnail to fullscreen page transition](https://codepen.io/ste-vg/pen/NrLWMj)

held: fixed div.fullscreen-background, fixed div.scroller, fixed a.close-button, fixed svg.[object | made with: position: fixed · @keyframes · transition · :hover

```css
from { opacity: 0; bottom: 0% }
to { opacity: 1; bottom: 50% }
from { opacity: 0; bottom: 0% }
to { opacity: 1; bottom: 50% }
.fill { background-position: center center }
.container { position: relative }
.grid .grid-item { position: relative }
.grid .grid-item:after { margin-top: 100% }
.box { position: absolute; top: 10px; bottom: 10px; background-position: center top }
.box img { transition: transform 0.6s ease }
.box.selected { opacity: 0 }
.box.on-top { transition: all 0.4s ease; box-shadow: 2px 2px 19px -2px rgba(0, 0, 0, 0.44) }
```

### [Responsive bodymovin modal / page transition](https://codepen.io/sandstedt/pen/vKWzWE)

held: fixed button | made with: position: fixed · transition

```css
#bodymovin { transform: translate3d(0, 0, 0); opacity: 1 }
#close { transition: opacity 0.4s ease 0.1s, color 0.2s, transform 0.2s; opacity: 0; position: fixed; top: 1em }
.open #close { opacity: 1 }
#close:focus { transform: scale(1.1) }
.modal { position: absolute; top: 0 }
.modal__content { opacity: 0; transform: scale(0.8) translate3D(0, -20px, 0); transition: opacity 0.2s, transform 0.8s cubic-bezier(0.09, 0.52, 0.25, 1) }
.modal h1 { text-transform: uppercase }
.open .modal__content { opacity: 1; transform: scale(1) translate3D(0, 0, 0) }
```

### [Page Transition](https://codepen.io/GA-MO/pen/jqpvEV)

made with: transition

```css
#kuy { position: absolute; top: 0; bottom: 0 }
#kuy.active { transform: translate(100px, 0) }
#menu-left { position: absolute; transform: translate3d(-100%, 0, 0) }
#menu-left.active { box-shadow: 0px 0px 42px 1px rgba(0, 0, 0, 0.2); transform: translate3d(0, 0, 0) }
#close-menu-left.active { position: absolute }
.page { opacity: 0; animation-duration: 0.75s; box-shadow: 0px 0px 42px 1px rgba(0, 0, 0, 0.2); position: absolute; top: 0; bottom: 0 }
.page.active { opacity: 1 }
.box-mobile { box-shadow: 0 0 20px #ccc; position: relative }
#modal-bottom { position: absolute; bottom: 0; transform: translate3d(0, 100%, 0) }
#modal-bottom.active { box-shadow: 0 0 20px #333; transform: translate3d(0, 0, 0) }
a, .page, #menu-left, #modal-bottom { transition: all 0.3s ease-in-out; -o-transition: all 0.3s ease-in-out; -moz-transition: all 0.3s ease-in-out; -webkit-transition: all 0.3s ease-in-out }
```

### [SVG page transition](https://codepen.io/neiltron/pen/QNmwjB)

on scroll: rect.[object: transform ×4, h1.: transform+opacity+top | made with: 3D (perspective / preserve-3d) · GSAP

```css
div { top: 5vh; position: absolute }
div h1 { position: absolute; top: 0; transform: translateY(10px); opacity: 0 }
div svg g#bars rect.bar { position: absolute }
div svg g#bars rect:first-child { transform: scaleX(1); position: relative }
```

### [Page transition / Preloader](https://codepen.io/bhrt/pen/Vabpom)

held: fixed div.div, fixed div.div, fixed div.div, fixed div.div | on scroll: li.: transform+opacity+top ×2, li.: transform+opacity | on hover of li.: li.: transform+opacity+top, li.: transform+opacity | made with: position: fixed · GSAP

```css
.page-transition .div { position:fixed; bottom:100% }
.preload { position:absolute; top:50%; transform:translate(-50% , -50%) }
```

### [udemy page transitions](https://codepen.io/hamzaerbay/pen/mPrgLK)

on scroll: path.[object: opacity ×10 | made with: @keyframes

```css
.panel { position: relative }
.ud-logo { top: 50%; position: absolute; transform: translateY(-50%) }
.ud-logo__char { -webkit-animation: stroke-draw 1.5s cubic-bezier(0.77, 0, 0.175, 1) infinite alternate; animation: stroke-draw 1.5s cubic-bezier(0.77, 0, 0.175, 1) infinite alternate }
.ud-logo__char:nth-child(0) { -webkit-animation-delay: 0s; animation-delay: 0s }
.ud-logo__char:nth-child(1) { -webkit-animation-delay: 0.25s; animation-delay: 0.25s }
.ud-logo__char:nth-child(2) { -webkit-animation-delay: 0.5s; animation-delay: 0.5s }
.ud-logo__char:nth-child(3) { -webkit-animation-delay: 0.75s; animation-delay: 0.75s }
.ud-logo__char:nth-child(4) { -webkit-animation-delay: 1s; animation-delay: 1s }
.ud-logo__char:nth-child(5) { -webkit-animation-delay: 1.25s; animation-delay: 1.25s }
from { opacity: 0.1 }
to { opacity: 1 }
from { opacity: 0.1 }
```

### [Pagination & layout with clipped background div's](https://codepen.io/suez/pen/bNdbww)

made with: transition · :hover

```css
.scene.active .heading, .scene.active .scroll-down, .scene.active .click-blocks, { opacity: 0 }
.scene.active .heading { transform: translateX(-50%) translateY(-50%) scale(0.5) }
.scene.active .scroll-down { transform: rotate(-90deg) scale(0.5) }
.scene.active .click-blocks { transform: rotate(-90deg) scale(0.5) }
.scene.active .pagination { transform: translateX(-50%) translateY(-50%) scale(0.5) }
.scene.active .img-cont.active { margin-top: -10vh !important; transition: margin 0.3s, width 0.3s, height 0.3s }
.heading { position: absolute; top: 50%; transform: translateX(-50%) translateY(-50%); opacity: 0.7; transition: opacity 0.3s, transform 0.3s; will-change: opacity, transform }
.scroll-down { position: absolute; bottom: 13%; transform: rotate(-90deg); transition: opacity 0.3s, transform 0.3s; will-change: opacity, transform }
.click-blocks { position: absolute; top: 23%; transform: rotate(-90deg); transition: opacity 0.3s, transform 0.3s, color 0.3s; will-change: opacity, transform }
.pagination { position: absolute; top: 95%; transform: translateX(-50%) translateY(-50%); transition: opacity 0.3s, transform 0.3s; will-change: opacity, transform }
.pagination .page-names { margin-bottom: 1vh }
.pagination .page-names li { will-change: opacity }
```

### [DROP](https://codepen.io/immarcelo/pen/YzqqdQ)

made with: transition

```css
body { padding-top: 40px }
nav ul { text-transform: uppercase }
nav ul li { position: relative; -webkit-transform: translate3d(0,0,0) }
nav ul li .nav-item-bg { position: absolute; top:0; -webkit-transition: top .7s cubic-bezier(0.740, 0.035, 0.685, 0.425) }
.content { margin-top: 150px; position: relative }
.content-a { position: absolute; top:0; -webkit-transform:rotate(0deg); -webkit-transition: top 1s ease-out, -webkit-transform .8s 0.1s ease-in }
.content-b { position: absolute }
nav ul li.dropping .nav-item-bg { top: 100vh }
.content-a.dropping { top: 100vh; -webkit-transform:rotate(-5deg) }
```

### [Page Transition/Preloader animation](https://codepen.io/robbue/pen/AWjEyR)

held: fixed div, fixed div.vic-gb, fixed div | on scroll: div.square: transform+top ×2, div.: transform+top | made with: position: fixed · GSAP

```css
#pagetransition { position: fixed; top: 0; -webkit-transform: translate3d(0, 0, 0); -moz-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0) }
#bg { position: fixed; top: 0 }
.square { position: absolute; -webkit-transform: translate3d(0, 0, 0); -moz-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0) }
.square.black { top: -50% }
.square.white { top: -130% }
.square.gold { bottom: -50% }
.square.grey { bottom: -130% }
.vic-gb { position: fixed; top: 50%; margin-top: -98px }
```

### [We Don't Need No Stinking AJAX](https://codepen.io/hkfoster/pen/kGrpvb)

on scroll: span.loader: transform+top | on hover of a.: span.loader: transform | made with: @keyframes · transition

```css
body { position: relative }
.loader { position: absolute; top: 25%; -webkit-animation: rotate 1s linear 0s infinite normal; -moz-animation: rotate 1s linear 0s infinite normal; animation: rotate 1s linear 0s infinite normal }
from { -webkit-transform: rotate(0deg) }
to { -webkit-transform: rotate(360deg) }
from { -moz-transform: rotate(0deg) }
to { -moz-transform: rotate(360deg) }
from { transform: rotate(0deg) }
to { transform: rotate(360deg) }
main { opacity: 0 }
body.loaded main { -webkit-transition: .15s 1s opacity; -moz-transition: .15s 1s opacity; transition: .15s 1s opacity; opacity: 1 }
body.loaded .loader { -webkit-transition: 0s 1s visibility; -moz-transition: 0s 1s visibility; transition: 0s 1s visibility }
@keyframes rotate animates transform
```
