# CodePen · horizontal-scroll — how each pen does it

91 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/horizontal-scroll.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| :hover | 30 |
| transition | 26 |
| position: fixed | 19 |
| Web Animations API (.animate) | 12 |
| scroll-snap | 11 |
| GSAP | 11 |
| @keyframes | 10 |
| 3D (perspective / preserve-3d) | 8 |
| scroll() timeline | 8 |
| pointer / mouse tracking | 7 |
| scroll listener | 7 |
| requestAnimationFrame | 4 |
| ScrollTrigger | 4 |
| mix-blend-mode | 4 |
| prefers-reduced-motion | 2 |
| backdrop-filter | 1 |
| Lenis / smooth scroll | 1 |
| :focus-visible | 1 |
| position: sticky | 1 |
| mask | 1 |
| scroll-driven animation (animation-timeline) | 1 |
| view() timeline | 1 |
| animation-range | 1 |
| clip-path | 1 |
| IntersectionObserver | 1 |
| custom properties driven by JS | 1 |

## Every pen

### [Interactive Media Clipping Slider](https://codepen.io/editor/Mathanraj-Selvaraj/pen/019facc1-56e9-7fb8-ba4f-24849bb0c5c0)

on scroll: svg.[object: transform+opacity ×2, span.grrendot: transform+background+shadow+top, div.newimg: transform+top | on hover of div.newcards: svg.[object: transform+opacity ×2 | made with: @keyframes · transition · :hover · pointer / mouse tracking · requestAnimationFrame

```css
.newtitlecon { margin-bottom: 12px }
.grrendot { position: relative; margin-top: 4px; box-shadow: 0 0 10px rgba(101, 188, 70, 0.8); transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s ease }
.grrendot::after { position: absolute; top: -4px; bottom: -4px; animation: radarPulse 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite }
.newcards:hover .grrendot, .grrendot:hover { transform: scale(1.35); box-shadow: 0 0 16px rgba(130, 226, 91, 1) }
0% { transform: scale(0.6); opacity: 0.9 }
50% { opacity: 0.4 }
100% { transform: scale(1.8); opacity: 0 }
.newttile p b { margin-bottom: 2px }
.newimg { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35); transition: transform 0.3s ease }
.newcards:hover .newimg { transform: translateY(-4px) }
.scroll-indicator-minimal { margin-top: 25px }
.scroll-indicator-minimal .arrow-left { animation: nudgeLeft 1.8s infinite }
```

```js
addEventListener('wheel', (e) => {
addEventListener('mouseleave', () => {
addEventListener('mousemove', (e) => {
requestAnimationFrame(stepMomentum)
```

### [Horizontal Corporate Directory Slider (Glassmorphic Theme)](https://codepen.io/Mathanraj-Selvaraj/pen/YPNQMab)

on scroll: li.: color+top ×4, span.section-title: color+top ×2, div.CIcard: transform+background+shadow+top, p.name-highlight: color+top | made with: scroll-snap · transition · :hover · backdrop-filter

```css
.CIwrap { scroll-snap-type: x mandatory }
.CIcard { scroll-snap-align: start; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); position: relative }
.CIcard:hover { transform: translateY(-8px); box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.85) }
.CIcard::before { position: absolute; top: 0 }
.card-section { margin-bottom: 20px }
.card-section:last-of-type { margin-bottom: 0 }
.section-title { text-transform: uppercase; margin-bottom: 6px }
.sub-text { margin-top: 4px !important }
.member-list li, .banker-list li { margin-bottom: 6px }
.member-list li:last-child, .banker-list li:last-child { margin-bottom: 0 }
.contact-grid { margin-top: 15px }
.web-link { transition: all 0.3s ease }
```

```js
addEventListener('wheel', (evt) => {
```

### [GSAP Horizontal Scroll Showcase – Pinned ScrollTrigger Slider](https://codepen.io/shivc8658/pen/EaZWRyj)

on hover of a.cta: div.panel__img: transform+top ×4, section.showcase: background+top | made with: transition · :hover · GSAP · ScrollTrigger · Lenis / smooth scroll

```css
.eyebrow { text-transform: uppercase }
.cta { margin-top: 1.8rem; transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease; box-shadow: 0 10px 30px rgba(234,88,12,.25) }
.cta svg { transition: transform .35s cubic-bezier(.2,.8,.2,1) }
.cta:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(234,88,12,.4) }
.cta:hover svg { transform: translate(3px,-3px) }
.showcase { position: relative }
.track { will-change: transform }
.panel { position: relative; transform: scale(.86); will-change: transform }
.panel__media { position: relative; box-shadow: 0 40px 120px rgba(0,0,0,.5) }
.panel__img { position: absolute; inset: -14% -8%; background-position: center; will-change: transform }
.hud { position: absolute; top: 2rem }
.progress { position: absolute; bottom: 0 }
```

```js
gsap.registerPlugin(ScrollTrigger, SplitText)
gsap.from(inners, {
scrollTrigger: { trigger: el, start: "top 85%" }
gsap.to(track, {
gsap.fromTo(img, { xPercent: -12 }, {
scrollTrigger: { trigger: panel, containerAnimation: horizontal, start: "left right", end: "right left", scrub: true }
gsap.fromTo(panel.querySelector(".panel__media"),
scrollTrigger: { trigger: panel, containerAnimation: horizontal, start: "left right", end: "left center", scrub: true }
```

### [Infinite Project Showcase — Horizontal Scroll Transition Animation](https://codepen.io/nandhu279/pen/ByppXmd)

held: fixed header, fixed main | on scroll: div.scroll-wrapper: transform, img.: filter, path.[object: opacity, circle.[object: transform+opacity+top, span.anim-pulse: opacity, div.orbit-ring: transform | on hover of button.pill-btn: div.orbit-ring: transform+top ×2, button.pill-btn: transform, div.scroll-wrapper: transform, img.: filter, path.[object: opacity, span.anim-pulse: opacity | made with: position: fixed · @keyframes · transition · :hover · :focus-visible · prefers-reduced-motion · mix-blend-mode · GSAP · requestAnimationFrame

```css
#viewport { position: fixed; inset: 0 }
.project-page { position: absolute; inset: 0; opacity: 0 }
.project-page.active { opacity: 1 }
.project-page.next { opacity: 0 }
.scroll-wrapper { will-change: transform }
.section { position: relative }
.hero-section { padding-top: 80px }
.hero-visual { position: relative; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) }
.media { position: relative; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) }
.media img { opacity: 0.7; filter: grayscale(1) contrast(1.25); transition: filter 1s }
.media img:hover { filter: grayscale(0) contrast(1.25) }
.cta { margin-top: 1rem }
```

```js
requestAnimationFrame(render)
gsap.timeline({
addEventListener("wheel", (e) => scrollBy(e.deltaY || e.deltaX, WHEEL_SPEED), {
```

### [Hero section: GSAP Horizontal Scroll Carousel](https://codepen.io/dermalhealth/pen/azBpoyo)

held: fixed nav.nav-reveal | on scroll: div.scroll-dot: transform+opacity+top | on hover of button.nav-btn: div.scroll-dot: transform+opacity+top, div.carousel-track: transform, div.product-card: transform+shadow+top, img.: transform+top | made with: position: fixed · @keyframes · transition · :hover · GSAP · ScrollTrigger

```css
.clay-element { box-shadow: var(--clay-box); transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) }
.clay-element:hover { box-shadow: var(--clay-box-hover); transform: translateY(-5px) }
nav { position: fixed; top: 0 }
.nav-logo { box-shadow: var(--clay-btn) }
.nav-btn { box-shadow: 6px 6px 12px rgba(255, 138, 101, 0.3), -6px -6px 12px var(--shadow-light), inset 2px 2px 4px rgba(255, 255, 255, 0.5), inset -2px -2px 4px rgba(0, 0, 0, 0.1); transition: transform 0.2s }
.nav-btn:active { transform: scale(0.95) }
.hero { position: relative }
.hero h1 { margin-bottom: 1.5rem }
.scroll-indicator { position: absolute; bottom: 40px; padding-top: 10px; box-shadow: var(--clay-btn) }
.scroll-dot { animation: scrollDown 2s infinite ease-in-out }
0% { transform: translateY(0); opacity: 1 }
100% { transform: translateY(40px); opacity: 0 }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline()
gsap.to(track, {
ScrollTrigger.create({
gsap.from(".scroll-reveal", {
scrollTrigger: { trigger: ".footer", start: "top 80%" }
```

### [Sticky Nature Scroll | Vanilla JS](https://codepen.io/kazmi066/pen/Wbwzovj)

held: sticky div.scroll-section__sticky | on hover of button.hero__badge: button.hero__badge: background+color | made with: position: sticky · transition · :hover · mask · scroll listener · requestAnimationFrame

```css
.hero { position: relative; border-bottom: 1px solid var(--border-color) }
.hero__bg { position: absolute; inset: 0; mask-image: radial-gradient(circle at center, black 40%, transparent 100%) }
.hero__title { margin-bottom: clamp(1rem, 2vh, 1.5rem) }
.hero__subtitle { margin-bottom: clamp(2rem, 4vh, 3rem) }
.hero__badge { transition: background 0.3s }
.scroll-section { position: relative }
.scroll-section__sticky { position: sticky; top: 0 }
.scroll-section__track { will-change: transform }
.card { transition: transform 0.3s ease, border-color 0.3s ease }
.card:hover { transform: translateY(-8px) }
.card__image { transition: transform 0.5s ease; filter: grayscale(20%) }
.card:hover .card__image { transform: scale(1.05); filter: grayscale(0%) }
```

```js
addEventListener("scroll", () => {
requestAnimationFrame(() => {
```

### [2025-08-26 - theme transitioning on horizontal scroll](https://codepen.io/loiclaudet/pen/VYvBRZv)

held: fixed svg.[object, fixed section, fixed section | on scroll: div.pane: transform ×3 | on hover of img.: div.pane: transform ×3 | made with: position: fixed · prefers-reduced-motion · GSAP · ScrollTrigger

```css
& p:nth-of-type(2) { position: absolute; bottom: 5vh }
& p:nth-of-type(3) { position: absolute; top: 50% }
.pane { position: relative }
& img { translate: -200% -70% }
& img { translate: -150% -50% }
img { position: absolute; top: 50%; translate: -100% 0 }
svg { position: fixed }
```

```js
gsap.to(panes, {
gsap.to(document.documentElement, {
```

### [Infinite Scroll Animation](https://codepen.io/uxmankabir/pen/bNVdOdP)

on scroll: div.scroller-wrapper: transform | on hover of img.: div.scroller-wrapper: transform | made with: @keyframes

```css
.scroller-container { position: relative }
.scroller-container::before { position: absolute; top: 0; bottom: 0 }
.scroller-container::after { position: absolute; top: 0; bottom: 0 }
.scroller-wrapper { animation: moveLeft 8s linear infinite }
from { transform: translatex(0) }
to { transform: translatex(-100%) }
img { object-position: center }
@keyframes moveLeft animates transform
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

### [Infinite Horizontal Scroll with Progress Tracking](https://codepen.io/haptichash/pen/LEVpqOO)

held: fixed div.container, fixed div.progress-bar, fixed div.progress-counter | on scroll: div.progress-bar: transform, div.scroller: transform | made with: position: fixed · requestAnimationFrame

```css
h1 { text-transform: uppercase; padding-top: 0.25rem }
.container { position: fixed; top: 0 }
.progress-bar { position: fixed; top: 0; transform: scaleX(0%); will-change: transform }
.progress-counter { position: fixed; bottom: 1rem }
.scroller { position: relative; will-change: transform; transform: translateX(0) }
section { position: relative }
.story h1 { padding-top: 0 }
.about .row p { margin-bottom: 1rem }
```

```js
requestAnimationFrame(() => animate(sequenceWidth))
addEventListener( "wheel",
requestAnimationFrame(() => animate(sequenceWidth, needsReset)
requestAnimationFrame(decayVelocity)
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

### [Horizontal Scroll with vanilla HTML & CSS.](https://codepen.io/Meet-the-reactor/pen/xxNpJOK)

made with: nothing recognised — read the code

```css
.container { transform: rotate(-90deg) translateY(-100px) }
img { transform: rotate(90deg) }
```

### [Smooth Horizontal Scroll for Product Cards in Vanila JavaScript](https://codepen.io/DevBillyM/pen/mdaOYPW)

made with: :hover

```css
.product-list-container { position: relative }
.product-card { position: relative; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) }
.new-badge { position: absolute; top: 5px }
```

### [10 Simple Yet Cool Popular Effects in Modern UI (ft. GSAP, Color Blending, etc.)](https://codepen.io/Juxtopposed/pen/NWExxja)

held: fixed p.sitename, fixed div.custom-cursor | on hover of a.link: p.fadein: transform+top ×3 | made with: position: fixed · @keyframes · transition · :hover · clip-path · mix-blend-mode · GSAP · scroll listener · pointer / mouse tracking

```css
.hero { opacity: 0; transition: opacity 1s ease-in }
.road { clip-path: polygon(50% 0, 100% 100%, 0 100%); position: relative; bottom: 0; mix-blend-mode: difference }
.semicircle { position: relative; mix-blend-mode: difference; position: absolute; bottom: 0 }
.sun { position: relative }
#loading-screen { position: absolute; top: 0; opacity: 1; transition: opacity 0.5s ease-out }
#progress-bar { bottom: 0; position: absolute; mix-blend-mode: difference; transition: width 0.5s ease-in-out }
#progress-counter { mix-blend-mode: difference }
.part1 { position: relative; padding-bottom: 2em }
.sitename { position: fixed; mix-blend-mode: difference; top: 0; opacity: 0; animation: fade-in 0.5s forwards }
.sitename.relative { position: relative }
0% { opacity: 0 }
100% { opacity: 1 }
```

```js
addEventListener('wheel', handleScroll)
addEventListener('scroll', () => {
gsap.to(window, {
gsap.to(container, {
addEventListener("scroll", function() {
gsap.timeline({
scrollTrigger: { trigger: ".zoom", scrub: true, start: "top top", end: "+=1000%", pin: true, }
addEventListener('mousemove', function(e) {
```

### [ES6 - Horizontal Fluid Carousel Scroll Container - Spotify Style](https://codepen.io/samwong/pen/xxJMaMP)

made with: scroll() timeline · scroll listener · pointer / mouse tracking

```css
.carousel img { margin-bottom: 16px }
.carousel h3 { margin-bottom: 4px }
.carousel .carousel__wrapper { position: relative; margin-bottom: 24px }
.carousel .carousel__header { margin-bottom: 16px }
.carousel .carousel__item a { position: relative }
.carousel .carousel__arrow { box-shadow: none }
.carousel .carousel__arrow:before { filter: brightness(5) }
.carousel .carousel__arrow.arrow-prev:before { transform: rotate(90deg) }
.carousel .carousel__arrow.arrow-next:before { transform: rotate(-90deg) }
.carousel .carousel__arrow.disabled::before { filter: brightness(2) }
```

```js
addEventListener( 'mousemove', mousemoveHandler )
addEventListener( 'scroll', scrollHandler )
addEventListener( 'mouseleave', mouseupHandler )
```

### [CSS Horizontal Page Scrolling | Wheel Only | Scrolljack](https://codepen.io/mlorberdev/pen/vYRLJgM)

held: fixed main | made with: position: fixed · scroll-snap

```css
main { position: fixed; top: 0; transform: rotate(-90deg) translateX(-100vh) }
article { transform: rotate(90deg) translateY(-100vh) }
```

### [Horizontal Scroll Menu with dropdown submenu](https://codepen.io/thisusedtobeanemail/pen/VwQpbNp)

on hover of li.nav-active: div.nav-horizontal-scroll-onhover-items: opacity+top, ul.: shadow+top | made with: transition · :hover

```css
.nav-horizontal-scroll-onhover-items { opacity: 0 }
.nav-horizontal-scroll ul { box-shadow: 0px 4px 10px rgb(50 54 57) }
.nav-horizontal-scroll ul li { box-shadow: inset 0px 0px 5px 5px rgb(40 44 47) }
.nav-horizontal-scroll ul li.nav-active, .nav-horizontal-scroll ul li:hover, .na { box-shadow: inset 0px 0px 5px 5px rgb(20 24 27) }
.nav-horizontal-scroll-onhover-items { position: absolute }
.nav-horizontal-scroll-onhover-items.nav-show { opacity: 1; transition: opacity 0.5s ease }
.nav-horizontal-scroll-onhover-items.nav-show ul { box-shadow: 0px 0px 5px rgb(30, 34, 37) }
```

```js
addEventListener("mouseleave", self.mouseLeaveEvent)
```

### [Horizontal scroll snapping](https://codepen.io/uxmankabir/pen/NWwoPzo)

made with: scroll-snap

```css
.mobile { background-position: center }
.mobile__content { scroll-snap-type: x mandatory }
.mobile__content .screen { scroll-snap-align: center }
.mobile__content .screen-3 .group-list .item:not(:last-child) { border-bottom: 1px solid #e5e5e5 }
```

### [CSS scroll-snap example with JS scroll-to buttons, using scrollIntoView()](https://codepen.io/andreamorosi/pen/oNoyqvG)

on hover of div.btns: div.btn: background+color | made with: scroll-snap · transition · :hover

```css
main { position: absolute }
.wrapper { -ms-scroll-snap-type: x mandatory; scroll-snap-type: x mandatory }
.item { scroll-snap-align: start; text-transform: uppercase }
.item span { margin-top: 8px }
.side { position: absolute; bottom: 0 }
.btn { margin-bottom: 4px; transition: all ease-in 0.15s }
```

### [Horizontal Scroll Snap](https://codepen.io/zackshave/pen/oNwLWJm)

made with: scroll-snap

```css
.horizontal-scroll { -ms-scroll-snap-type: x mandatory; scroll-snap-type: x mandatory }
.horizontal-scroll__item { scroll-snap-align: start }
```

### [Hold Down Button To Horizontal Scroll](https://codepen.io/zackshave/pen/LYLYWPv)

on hover of button.scroll-toggle__button: button.scroll-toggle__button: background | made with: transition · :hover

```css
.scroll-toggle__button { position: relative; transition: all 0.1s ease }
```

### [Image Slider / Carousel - Intersection Observer Horizontal Scroll](https://codepen.io/elisavetTriant/pen/OJWvOyr)

made with: scroll-snap · @keyframes · IntersectionObserver · pointer / mouse tracking

```css
.gallery_wrapper { box-shadow: 0 4px 8px 4px rgba(0, 0, 0, 0.3) }
.gallery_wrapper .active { scroll-snap-type: unset }
.gallery_wrapper ul { scroll-snap-type: x mandatory }
.gallery_wrapper ul li { box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1); scroll-snap-align: center }
.gallery_wrapper ul li.active { box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2) }
.gallery_wrapper ul li:last-child { position: relative }
.gallery_wrapper ul li:last-child::after { position: absolute }
.gallery_wrapper ul li img { padding-bottom: 20px; vertical-align: bottom }
.gallery_wrapper .indicatorsList .paging { -webkit-animation: fadeinout 4s linear forwards; animation: fadein 1.5s linear forwards; opacity: 0 }
100% { opacity: 1 }
50% { opacity: 1 }
.gallery_wrapper .indicatorsList button, .gallery_wrapper .indicatorsList .indic { box-shadow: 0 2px 1px black }
```

```js
new IntersectionObserver(
addEventListener("mouseenter", (e) => {
addEventListener("mouseleave", (e) => {
addEventListener("mousemove", (e) => {
```

### [Full width sections with horizontal scroll](https://codepen.io/nikki-peel/pen/zYoXvVv)

made with: :hover

```css
::-webkit-scrollbar { transform: translateY(-10px) }
.outer-wrapper { transform: rotate(-90deg) translateX(-100vh); position: absolute }
.wrapper { transform: rotate(90deg) translateY(-100vh) }
```

### [UX Rules - Skew Horizontal Scroll](https://codepen.io/Danak-UY/pen/zYoKQOJ)

on hover of img.: div.horizontal-scroll: transform | made with: nothing recognised — read the code

```css
.item { box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 50px; transform: translateY(-50%) }
.item .header h1 { opacity: 0.8 }
.item .header img { filter: invert(1); opacity: 0.3 }
.item .body .footer { opacity: 0.2 }
```

### [Responsive Horizontal Scroll Section](https://codepen.io/syahrizaldev/pen/JjKQGXN)

made with: scroll-snap · pointer / mouse tracking

```css
.paragraph { text-transform: unset }
.main .scroll { position: relative; -ms-scroll-snap-type: x mandatory; scroll-snap-type: x mandatory }
.main .scroll .card { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) }
.main .scroll .card-image { position: relative; padding-top: 110% }
.main .scroll .card-image img.responsive { position: absolute; top: 0 }
```

```js
addEventListener("mouseleave", () => {
addEventListener("mousemove", (e) => {
```

### [Horizontal scroll progress using JavaScript](https://codepen.io/rohitutekar/pen/mdPYgOW)

made with: scroll listener

```css
#scroll-progress { margin-top: 32px }
```

```js
addEventListener("scroll", function () {
```

### [Horizontal Mobile Scroll (flexbox)](https://codepen.io/ricardospalves/pen/qBbYGjZ)

made with: nothing recognised — read the code

### [Horizontal scrolling](https://codepen.io/saranya-mohan/pen/ExPvVqW)

made with: nothing recognised — read the code

```css
.container { transform: rotate(-90deg) translateX(-100%); transform-origin: left top }
.container .sub-container { transform: rotate(90deg) translateY(-100%); transform-origin: left top }
.container .sub-container .child { vertical-align: top }
```

### [Horizontal Scrolling Resume Template](https://codepen.io/Wildtype/pen/OJyYeev)

on hover of li.: a.: shadow | made with: transition · :hover

```css
:root { --transition: 110ms ease }
a { transition: var(--transition) }
a:hover { box-shadow: 0px 4px 0px var(--hover) }
h2 { margin-bottom: 3rem }
nav { margin-top: 1.8rem }
ul { position: relative }
#skill-blocks { position: relative }
.lessx { opacity: 0.74 }
.experience h2 { margin-bottom: 1.25rem }
.experience h3 { margin-bottom: 1.75rem }
.experience ul { margin-top: 2rem }
.experience li { margin-bottom: 0.75rem }
```

### [auto hscroll](https://codepen.io/oriadam/pen/OJyYZOd)

made with: nothing recognised — read the code

```css
.item { box-shadow: 2px 2px 4px #000 }
```

### [Gallery - Tilt Hover Effect](https://codepen.io/TKS31/pen/abvxNeo)

made with: nothing recognised — read the code

```css
.gallery__img { padding-top: calc(3 / 2 * 15%); box-shadow: 8px 8px 60px rgba(0, 0, 0, 0.5) }
```

### [Horizontal scroll cards (shrink your browser screen to take effect)](https://codepen.io/kztn/pen/gOaeZQO)

made with: scroll-snap · pointer / mouse tracking

```css
.wrapper { scroll-snap-type: x mandatory }
.card p { margin-bottom: 10px }
.card span { text-transform: uppercase }
.card { scroll-snap-align: start }
```

```js
addEventListener('mouseleave', () => {
addEventListener('mousemove', (e) => {
```

### [Hide Scrollbar using CSS with scroll](https://codepen.io/vigu_madurai/pen/QWjpeJj)

made with: nothing recognised — read the code

```css
.other-contents { opacity: 0.3 }
.magic { padding-bottom: 30px }
```

### [Horizontal scrolling using Flexbox](https://codepen.io/sheikh_ishaan/pen/MWaeXRa)

on scroll: div.item: transform+top, img.: filter+top | on hover of img.: div.item: transform+top ×2, img.: filter+top ×2 | made with: transition · :hover

```css
h1 { margin-bottom: 2rem }
.container .item { transition: 0.3s all }
.container .item img { filter: contrast(90%); transition: 0.3s all }
.container .item img:hover { filter: contrast(100%) }
.container .item:hover { transform: translateY(-4px) }
```

### [UI 007: Horizontal-Scroll](https://codepen.io/hello-antonio/pen/jOPbNzj)

made with: nothing recognised — read the code

```css
.hs { position: relative }
```

### [Horizontal Scrolling ScrollSpy Responsive Menu Bootstrap 4.3.1](https://codepen.io/mohan-aiyer/pen/dyyWOyK)

held: sticky header.secondary-nav | on scroll: a.nav-link: color+shadow, a.dropdown-item: background+color | on hover of li.nav-item: a.nav-link: color | made with: transition · :hover · Web Animations API (.animate)

```css
body { position: relative }
header.secondary-nav .submenu { position: absolute; top: 100%; box-shadow: 0 0.3rem 0.3rem rgba(0, 0, 0, 0.15) !important }
header.secondary-nav .submenu.visible { border-top: 1px solid #e8e8e8 }
header.secondary-nav .dropdown { position: inherit }
header.secondary-nav { position: relative; -webkit-transform: translateZ(0); transform: translateZ(0); will-change: transform; -webkit-transition: -webkit-transform 0.5s; transition: -webkit-transform 0.5s; transition: transform 0.5s; transiti }
header.secondary-nav::after { position: absolute; top: 0; transition: opacity 0.2s }
header.secondary-nav .nav-link.active { box-shadow: inset 0px -3px 0px 0px #fdac00 }
```

```js
.animate({
```

### [horizontal slide](https://codepen.io/Ishrat_Pinky/pen/eYYpbNx)

on scroll: div.sections: transform+top | made with: 3D (perspective / preserve-3d) · GSAP

```css
.wrapper { -webkit-perspective: 1000; perspective: 1000 }
.section { position: relative }
```

### [Red Stapler's Horizontal Scroll](https://codepen.io/franknoirot/pen/qzvyVd)

held: fixed div.social-badge | made with: position: fixed · transition · :hover

```css
.horiz-scroll-wrapper { transform: rotate(-90deg) translateX(-100vh); position: absolute }
.horiz-scroll-inner { transform: rotate(90deg) translateY(-100vh) }
.slide { transform: translateX(10vw) skew(45deg) scale(1.2); --anti-transform: translateX(-10vw) skew(-45deg) scale(.8) }
.slide * { transform: var(--anti-transform) }
.social-badge { position: fixed; top: 10px; box-shadow: 0 4px 1px var(--twitter-light); transition: all .2s ease-in-out }
a .social-badge:hover { transform: translateY(-2px); box-shadow: 0 6px 3px var(--twitter-light) }
.social-badge span { text-transform: uppercase }
```

### [Horizontal Scroll Containers Mobile & Desktop - Spotify Style](https://codepen.io/kilianso/pen/XQOGXX)

made with: mix-blend-mode · Web Animations API (.animate)

```css
.hs__arrows .arrow:before { filter: brightness(5) }
.hs__arrows .arrow.disabled:before { filter: brightness(2) }
.hs__arrows .arrow.arrow-prev:before { transform: rotate(90deg) }
.hs__arrows .arrow.arrow-next:before { transform: rotate(-90deg) }
.hs__item { position: relative }
.hs__item:last-child:after { position: absolute }
.hs__item__image__wrapper { position: relative; padding-bottom: 100% }
.hs__item__image { position: absolute }
.container { mix-blend-mode: invert; position: relative }
.container:after { position: absolute; top: 0; transform: translateX(-50%) }
```

```js
.animate({
```

### [Pure CSS Horizontal Mobile Navigation](https://codepen.io/vicainelli/pen/eXMLWY)

made with: nothing recognised — read the code

```css
.scroll-area { position: relative }
.scroll-area .scroll-area__body { position: relative }
.scroll-area__column { vertical-align: top }
.scroll-area__column a span.selected { border-bottom: 2px solid #3578e5 }
```

### [horizontal-scrolling no-scrollbar panel](https://codepen.io/mclisak/pen/VRLVKq)

made with: scroll-snap · transition · scroll listener

```css
.container { position: relative }
.scroll-off { position: relative; -webkit-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23); -moz-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23); -ms-box-shadow: 0 10px 20px rgba(0, }
.scroll-on { position: relative; scroll-snap-type: x mandatory }
li { scroll-snap-align: start }
.scroll-overlay { position: absolute; top: 0; bottom: 0; transition: opacity 200ms ease }
.scroll-overlay:first-of-type { opacity: 0 }
```

```js
addEventListener( "scroll",
```

### [jInvert Scroll Test](https://codepen.io/escadesign/pen/MLwRro)

made with: nothing recognised — read the code

```css
.one { position: absolute }
.two { position: absolute }
.three { position: absolute }
.four { position: absolute }
.five { position: absolute }
```

### [Horizontal Page](https://codepen.io/Marcos_Feijo/pen/LMNGBG)

held: fixed div.barNav, fixed div.fullBorder | made with: position: fixed · scroll() timeline · transition · :hover · scroll listener

```css
.barNav { position: fixed; bottom: 20px; border-bottom: 1px solid #555555; filter: sepia(1); -webkit-filter: sepia(1) }
.barNavFuel { transition: width 0.5s; opacity: .8 }
.arrows { position: absolute; top: -25px; filter: sepia(1); -webkit-filter: sepia(1) }
.arrows i { position: relative; opacity: .5 }
.arrows i:hover { opacity: .8 }
.fullBorder { position: fixed; top: 0 }
.fullBorder div { position: absolute; filter: sepia(1); -webkit-filter: sepia(1); opacity: .5 }
.fullBorder .top { border-bottom: 1px solid #FAFAFA; top: 20px }
.fullBorder .leftTop { position: absolute; top: 21px }
.fullBorder .left { top: 71px }
.fullBorder .leftBot { bottom: 21px }
.fullBorder .rightTop { top: 21px }
```

```js
addEventListener("wheel", function(event) {
addEventListener("scroll", function(event){
```

### [horizontal-scroll-study](https://codepen.io/LucasZapico/pen/KbKxXV)

held: fixed div | made with: position: fixed

```css
#page { position: fixed; top: 0; bottom: 0 }
#page div { position: relative }
```

### [Horizontal Scrolling Based on Cursor (Vanilla JS)](https://codepen.io/rootr/pen/XyOgjy)

on scroll: a.: background+color, span.title: color, div.bottom-info: color+top | made with: transition · :hover · custom properties driven by JS · pointer / mouse tracking

```css
.menu { position: relative }
.menu ul { position: absolute; transition: left 0.1s }
.menu ul > li > a { -webkit-transition: background-color 0.3s; transition: background-color 0.3s }
.menu ul > li > a > .bottom-info { position: absolute; bottom: -30px; -webkit-transition: bottom 0.3s; transition: bottom 0.3s }
.menu ul > li > a:hover .bottom-info { bottom: 40px }
```

```js
addEventListener('mousemove', e => {
style.setProperty('--pos-x', offset + 'px')
```

### [Horizontal navigation carousel, with scroll on touch](https://codepen.io/maks-kul/pen/XyJwvR)

made with: nothing recognised — read the code

```css
.add-item-btn { text-transform: uppercase }
.items-main-container { margin-bottom: 20px; position: relative }
.item:first-child { box-shadow: 13px -2px 16px -10px rgba(200, 200, 200, 1); position: absolute; top: 0 }
.item.last { box-shadow: -13px -2px 16px -10px rgba(200, 200, 200, 1); position: absolute; top: 0 }
.item-title, .item-content { position: relative }
.item-title { border-bottom: 1px solid #a9a9a9 }
.delete-item-btn { position: absolute; top: 5px }
```

### [Horizontal scroll with next element shown](https://codepen.io/techentertainer/pen/BqpPea)

made with: nothing recognised — read the code

### [Easy horizontal scroll](https://codepen.io/codepenner-pen/pen/wYGWEP)

made with: nothing recognised — read the code

### [Overflow scroll example](https://codepen.io/frogmcw/pen/gdJoaG)

made with: nothing recognised — read the code

```css
body { margin-top: 40px }
.mobile-device { box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1) }
.tabbed-icon__link { margin-top: 10px }
```

### [Horizontal Scrolling Navbar](https://codepen.io/csinghofen/pen/NBQYrO)

held: fixed div.nav-side-menu | on hover of a.: a.: background | made with: position: fixed · transition · :hover

```css
.nav-side-menu { position: fixed }
.nav-side-menu ul .sub-menu li, .nav-side-menu li .sub-menu li { border-bottom: 1px solid #333 }
.nav-side-menu li:hover { -webkit-transition: all 1s ease; -moz-transition: all 1s ease; -o-transition: all 1s ease; -ms-transition: all 1s ease; transition: all 1s ease }
.nav-side-menu { position: relative; margin-bottom: 10px }
.nav-side-menu .toggle-btn { position: absolute; top: 10px }
```

### [horizontal scroll on clicking button](https://codepen.io/vfxravi/pen/YjPPgN)

made with: Web Animations API (.animate)

```css
.srcl div { position: relative }
.slide-sample { position: relative }
.preSlide { position: absolute; top: 11px }
.nextSlide { position: absolute; top: 11px }
```

```js
.animate({
```

### [Horizontal scroll window](https://codepen.io/joeygrable94/pen/yEgzgq)

made with: nothing recognised — read the code

```css
#page { position: relative }
.grid-horizontal { position: absolute; top: 100vh; transform: rotate(-90deg) }
.grid-horizontal > div { position: relative; transform: rotate(90deg) }
.grid-horizontal > div > .grid-inner { position: relative }
```

### [Easy Horizontal Masonry Effect with CSS Grid](https://codepen.io/andybarefoot/pen/BxwXNa)

made with: nothing recognised — read the code

```css
h1 { margin-top: 3vh }
h1 { margin-top: 4vh }
h1 { margin-top: 5vh }
```

### [Horizontal Scroll with Flex-box](https://codepen.io/csinghofen/pen/erEwMv)

made with: nothing recognised — read the code

```css
figcaption { position: absolute; top: 200px }
```

### [JQuery Horizontal Scroll Arrows](https://codepen.io/wirkawayan/pen/GxeMxB)

made with: scroll() timeline · :hover · Web Animations API (.animate)

```css
.jquery-horizontal-scroll-wrap { position: relative }
.jquery-horizontal-scroll { position: relative }
.jquery-horizontal-scroll-wrap .nav-next, .jquery-horizontal-scroll-wrap .nav-pr { position: absolute; top: 50%; margin-top: -40px }
.jquery-horizontal-scroll-wrap .nav-next:hover, .jquery-horizontal-scroll-wrap . { opacity: 1 }
```

```js
.animate({
```

### [Contrast Text Color on Image](https://codepen.io/iamryanyu/pen/VXMbJY)

held: fixed div.p-hero, fixed div.c-logo | on scroll: span.p-hero__vivid: transform ×2, span.p-hero__sydney: transform ×2 | made with: position: fixed · @keyframes · transition · :hover · mix-blend-mode · 3D (perspective / preserve-3d)

```css
:root { --transition: .5s cubic-bezier(.77, 0, .175, 1) }
.anchor { position: absolute; top: 100vh; opacity: 0 }
.c-scroll { -webkit-animation: upAndDown 2s infinite; animation: upAndDown 2s infinite; position: absolute; transform: translateX(-50%); top: 1.25rem; text-transform: uppercase }
.p-hero { position: fixed; transform: translateX(-50%) }
.p-hero::before, .p-hero::after { mix-blend-mode: multiply; opacity: 0.9; position: absolute; top: 0 }
.p-hero__header { position: relative }
.p-hero__img { position: absolute }
.p-hero__heading { position: absolute; top: 50%; transform: translateY(-50%) }
.p-hero__vivid { position: absolute; top: 30%; transform: translateX(var(--hero-vivid-x)) }
.p-hero__sydney { position: absolute; top: 50%; transform: translateX(var(--hero-sydney-x)) }
.c-logo { -webkit-animation: fe30-anime 1s ease-in-out 4s forwards; animation: fe30-anime 1s ease-in-out 4s forwards; opacity: 0; bottom: 20px; position: fixed }
.c-ryanyu { position: relative }
```

### [Horizontal Scroll Site](https://codepen.io/waleedanwar/pen/WzoZmb)

made with: scroll listener

```css
#container #wrapper { box-shadow: 0 2rem 4rem 0.25rem rgba(46, 43, 55, 0.575) }
```

```js
addEventListener('scroll', function(e){
```

### [Horizontal scroll with ScrollMagic](https://codepen.io/psoares/pen/MrWjqW)

held: fixed div, fixed div | on scroll: div.: transform | made with: 3D (perspective / preserve-3d) · GSAP

```css
body { position: absolute }
#triggers { position: absolute }
#triggers .trigger { position: relative }
#pin { perspective: 1000 }
#pin .progressBarWrapper { position: absolute; top: 0 }
#pin .progressBarWrapper #progressBar { position: relative }
section { text-transform: uppercase }
section p ~ p { opacity: 0.5; padding-top: 10px }
```

### [Horizontal scroll with GSAP](https://codepen.io/exploretheworld/pen/bomYWN)

on scroll: section.: transform ×2 | made with: GSAP

```css
section { position: absolute; top: 0px }
```

### [Multiple Image with Horizontal Custom ScrollLeft](https://codepen.io/asrulnurrahim/pen/pWedmY)

held: fixed div.centered | on hover of li.: a.: color, img.img-circle: color | made with: position: fixed · :hover · Web Animations API (.animate)

```css
.centered { position: fixed; top: 50%; transform: translate(-50%, -50%) }
.box-scroll { position: relative }
.image-scroll { padding-top: 5px; box-shadow: 0px 1px 3px #c8c8c8; margin-bottom: 5px }
.image-scroll ul { margin-bottom: 5px }
.x-btn, .y-btn { position: absolute; top: 0%; opacity: 0.5 }
.x-btn:hover, .x-btn:focus, .y-btn:hover, .y-btn:focus { opacity: 0.9 }
```

```js
.animate({
```

### [mobile page](https://codepen.io/tailofmoon/pen/oeYxQJ)

made with: transition

```css
body { position: relative }
header { position: relative }
.gnb li.active { border-bottom: 3px solid #6cf }
main { position: relative }
#toggle_gnb { position: absolute; top: 80px; transition: 0.5s }
```

### [Horizontal Scroll CSS](https://codepen.io/stealthygripen/pen/ZJWpzW)

made with: nothing recognised — read the code

```css
.quoteColumn { margin-top: auto; margin-bottom: auto }
.textColumn { margin-top: auto; margin-bottom: auto }
.horizontal-parent { position: absolute; top: 0 }
.horizontal-child { position: relative; transform: rotate(-90deg) translateY(-100vh) }
.horizontal-child .slide { position: absolute }
.horizontal-child .slide:after { position: absolute; background-position: 0 0 }
.horizontal-child .slide:nth-child(1) { transform: rotate(90deg) translateY(-100%) translateX(0vw) }
.horizontal-child .slide:nth-child(2) { transform: rotate(90deg) translateY(-100%) translateX(99.9vw) }
.horizontal-child .slide:nth-child(3) { transform: rotate(90deg) translateY(-100%) translateX(199.9vw) }
.horizontal-child .slide:nth-child(4) { transform: rotate(90deg) translateY(-100%) translateX(299.9vw) }
```

### [Horizontal Infinite "Out of Synch" Scroll Effect](https://codepen.io/jlnljn/pen/gWedPe)

held: fixed div.box, fixed div.box, fixed div.box | made with: position: fixed · scroll() timeline

```css
.box { position: fixed }
.box > div { position: relative }
#box2 { top: 50% }
#box3 { top: 80% }
p { position: relative }
```

### [horizontal scrollable list/table w/ same row height](https://codepen.io/Breaker222/pen/rmGvjd)

made with: nothing recognised — read the code

```css
.col { vertical-align: top }
```

### [3d carousel concept test](https://codepen.io/web-tiki/pen/pRKmdP)

on hover of img.: div.: transform | made with: 3D (perspective / preserve-3d)

```css
body { perspective: 1000px }
#imgs { position: absolute; top: 50% }
#imgs img { position: absolute; top: 0; transform: translate3d(-50%, -50%, 0) }
#imgs img:nth-child(1) { transform: translate3d(-50%, -50%, 0) rotate3d(0, 1, 0, 0deg) }
#imgs img:nth-child(2) { transform: translate3d(-50%, -50%, 0) rotate3d(0, 1, 0, 36deg) }
#imgs img:nth-child(3) { transform: translate3d(-50%, -50%, 0) rotate3d(0, 1, 0, 72deg) }
#imgs img:nth-child(4) { transform: translate3d(-50%, -50%, 0) rotate3d(0, 1, 0, 108deg) }
#imgs img:nth-child(5) { transform: translate3d(-50%, -50%, 0) rotate3d(0, 1, 0, 144deg) }
#imgs img:nth-child(6) { transform: translate3d(-50%, -50%, 0) rotate3d(0, 1, 0, 180deg) }
#imgs img:nth-child(7) { transform: translate3d(-50%, -50%, 0) rotate3d(0, 1, 0, 216deg) }
#imgs img:nth-child(8) { transform: translate3d(-50%, -50%, 0) rotate3d(0, 1, 0, 252deg) }
#imgs img:nth-child(9) { transform: translate3d(-50%, -50%, 0) rotate3d(0, 1, 0, 288deg) }
```

### [Horizontal Scroll with GSAP and ScrollMagic](https://codepen.io/nailaahmad/pen/BpJPJg)

on scroll: div.sections: transform | made with: 3D (perspective / preserve-3d) · GSAP

```css
.wrapper { perspective: 1000 }
.section { position: relative }
.section__title { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

### [Dynamic Number of Columns, Horizontal Scroll](https://codepen.io/pixxelia/pen/gLNqgo)

made with: nothing recognised — read the code

### [scrollable WORLD SERIES tabs](https://codepen.io/jaamesw/pen/JRwPvL)

made with: scroll() timeline · Web Animations API (.animate)

```js
.animate({
```

### [Horizontal Scroll Section Demo](https://codepen.io/harwoodjp/pen/yaRjNW)

made with: nothing recognised — read the code

### [Customer Checkout](https://codepen.io/beeg/pen/ozoBLr)

held: fixed nav, fixed ul.navStep | made with: position: fixed · transition · :hover · Web Animations API (.animate)

```css
nav { position: fixed }
nav .navStep { position: fixed }
nav .navStep li { text-transform: uppercase }
input, select { border-bottom: 1px solid #ccc }
.sideBySide label.small { top: 0 }
.group { position: relative }
.group label { position: absolute; top: 8px; transition: 0.2s ease all; -moz-transition: 0.2s ease all; -webkit-transition: 0.2s ease all }
button.submit { text-transform: uppercase }
.arrow { position: relative }
.arrow:after { position: absolute; top: 0; border-top: 11px solid transparent; border-bottom: 12px solid transparent }
.productDescription .item { border-top: 1px solid #ccc }
.productDescription .item:last-child { border-bottom: 1px solid #ccc }
```

```js
.animate({
```

### [Horizontal Scroll 'n Show](https://codepen.io/DXC/pen/JKzmGe)

on scroll: div.: opacity ×2 | made with: position: fixed · Web Animations API (.animate)

```css
.contain { position: relative }
.contain:after { opacity: 0.25; position: fixed; top: 50%; -webkit-transform: translate(-50%, -50%); -moz-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); -o-transform: translate(-50%, -50%); transform: translate(- }
.row { position: relative }
.row div { opacity: 0.3 }
```

```js
.animate({opacity: 1.0}, 250)
```

### [JuegoFut Floating Header For Mobile Responsive](https://codepen.io/mladjaPinbox/pen/pbxPdz)

made with: position: fixed · scroll() timeline

```css
.grid { position: absolute }
.grid-canvas { position: relative }
.header-wrapper { position: absolute; top: 0 }
.row-wrapper { position: absolute; top: 0; padding-top: 18px }
```

### [Horizontal Scroll Menu](https://codepen.io/jeff_winegar/pen/RamyBG)

made with: @keyframes

```css
0% { opacity: 0 }
1% { transform: translateX(160px) }
100% { opacity: 1; transform: translateX(0) }
0% { opacity: 0 }
1% { transform: translateX(160px) }
100% { opacity: 1; transform: translateX(0) }
.horizontal-menu .horizontal-menu-items { padding-bottom: 50px }
.horizontal-menu .horizontal-menu-items > .horizontal-menu-item { -webkit-animation-name: slidein-animation; animation-name: slidein-animation; -webkit-animation-duration: 350ms; animation-duration: 350ms; -webkit-animation-fill-mode: backwards; animation-fill-mode: backwards }
body { padding-top: 40px }
@keyframes slidein-animation animates opacity, transform
```

### [Horizontal Scroll](https://codepen.io/james_rock96/pen/NNoYaa)

made with: transition · :hover · Web Animations API (.animate)

```css
#menu { position: absolute }
#menu-toggle { position: absolute }
a, li { padding-top: 30px; -webkit-transition: color .2s; Safari transition: color .2s }
```

```js
.animate({
```

### [Horizontal scroll concept test](https://codepen.io/web-tiki/pen/NNLyqv)

on scroll: div.: transform | made with: 3D (perspective / preserve-3d)

```css
#imgs { position:absolute; top:0 }
#imgs > div { perspective:500px }
```

### [Cross-browser horizontal mousewheel scroll](https://codepen.io/coddess/pen/GoadwV)

held: fixed header | made with: position: fixed

```css
header { position: fixed; border-bottom: 1px solid }
```

### [Horizontal Gallery](https://codepen.io/edwardwilson/pen/BjxzRG)

made with: nothing recognised — read the code

### [App-Inspired Momentum Sidescroll](https://codepen.io/cooper_hu/pen/GoEmBo)

on hover of div.content-card: a.inner-wrapper: color, h3.: color, p.: color | made with: :hover

```css
body { padding-top: 40px }
.scroller .scroller-inner-wrapper { position: relative }
.thumbnail { margin-bottom: 0 !important }
```

### [portfolio page](https://codepen.io/RCMiron/pen/EPKOKp)

held: fixed nav.center, fixed div.knob, fixed div.motto, fixed div.content | on scroll: div.inline: color ×3, div.content: transform+opacity | on hover of a.[object: path.[object: color ×5, a.[object: color, svg.[object: color, style.[object: color, g.[object: color | made with: position: fixed · scroll() timeline · scroll-snap · @keyframes · transition · :hover · Web Animations API (.animate)

```css
::-webkit-scrollbar { -webkit-transform: translate(-20px) }
.center { position: fixed; bottom: 10px }
.knob { position: fixed; bottom: 59.6px }
.horizontal { position: relative; margin-bottom: -4px; scroll-snap-coordinate: 50% 50% }
.motto { position: fixed }
.content { position: absolute; top: 30px }
#welcome1 { animation: type 4s steps(80, end) }
#welcome2 { animation: type2 5s steps(40, end) }
#welcome3 { animation: type2 7s steps(80, end) }
#welcome4 { animation: type2 9s steps(50, end) }
#welcome5 { animation: type2 13s steps(80, end) }
#welcome6 { animation: type2 18s steps(10, end) }
```

```js
.animate({
```

### [Horizontal Scroll with Scroll Magic Test](https://codepen.io/anastasialanz/pen/ZbRYBd)

held: fixed div, fixed div | on scroll: div.: transform | made with: 3D (perspective / preserve-3d) · GSAP

```css
body { text-transform: uppercase }
#pinContainer { -webkit-perspective: 1000; perspective: 1000 }
h1 { margin-top: 100px }
.three { position: relative }
.horizontal-line { border-top: 4px solid #FFF; position: absolute }
```

### [Responsive Tables](https://codepen.io/danieldespain/pen/xGZXob)

made with: nothing recognised — read the code

```css
table.responsive { margin-bottom: 0 }
.pinned { position: absolute; top: 0 }
.pinned td:last-child { border-bottom: 0 }
div.table-wrapper { position: relative; margin-bottom: 20px }
table.responsive td, table.responsive th { position: relative }
```

### [Horizontal Scroll Cards | Ionic Framework](https://codepen.io/drewrygh/pen/jEJGLx)

made with: nothing recognised — read the code

```css
div.hscroller { position: relative; top: 50%; -webkit-transform: translateY(-50%); -ms-transform: translateY(-50%); transform: translateY(-50%) }
```

### [Pure CSS Horizontal Slide](https://codepen.io/davidicus/pen/pvObpV)

made with: transition · :hover

```css
.wrap { position: relative }
header { box-shadow: 0 0.5em 1em #111; position: absolute; top: 0 }
.slide { position: absolute; top: 0; background-position: 50% 50%; transition: left 0s 0.75s }
.slide h1 { opacity: 0; transform: translateY(100%); transition: transform 0.5s 0.5s, opacity 0.5s }
[id^=slide]:checked + .slide { transition: left 0.65s ease-out }
[id^=slide]:checked + .slide h1 { opacity: 1; transform: translateY(0); transition: all 0.5s 0.5s }
```

### [Overflow Horizontal Scroll](https://codepen.io/dylanbox/pen/azyMmR)

made with: nothing recognised — read the code

### [Same HTML, different layout](https://codepen.io/markdebeer/pen/rawWVw)

made with: nothing recognised — read the code

```css
.section-title { text-transform: uppercase }
#toggle-layout { margin-top: 17px }
```

### [Colorful Portfolio](https://codepen.io/thibault-mahe/pen/vEXrxm)

held: fixed header, fixed ul | on scroll: img.img: opacity+top, img.img-hover: opacity+top | on hover of a.: img.img: opacity+top, img.img-hover: opacity+top | made with: position: fixed · scroll() timeline · transition · :hover

```css
header { position: fixed; top: 0 }
header { position: absolute }
header h1 { position: absolute; top: 20px }
header h2 { position: absolute; top: 100px; padding-top: 5px }
header h1 { top: 20px }
header h2 { top: 110px }
ul#filtres { position: fixed; top: 165px; border-top: 1px solid rgb(63,63,63); border-bottom : 1px solid rgb(63,63,63) }
.panels { position: absolute; top: 215px; bottom: 20px }
.panels { position: relative; top: 260px }
.panel-wrapper { position: absolute; -webkit-transition: width 0.3s, opacity 0.3s, margin 0.3s, top 0.35s; -moz-transition: width 0.3s, opacity 0.3s, margin 0.3s, top 0.35s; -ms-transition: width 0.3s, opacity 0.3s, margin 0.3s, top 0.35 }
.panel-wrapper { position: relative }
article.down { margin-top: 70px; -webkit-transition: all 1s ease; transition: all 1s ease; moz-transition: all 1s ease }
```

### [Horizontal Scrolling](https://codepen.io/Prince_Perry/pen/KKRNad)

on hover of a.: button.: opacity | made with: :hover · Web Animations API (.animate)

```css
#galleryWrapper { position: relative }
#prevThumb, #nextThumb { position: absolute; top: 30px }
button { opacity: .5 }
button:hover { opacity: 1 }
#p1 { background-position: 0 0 }
#p2 { background-position: -96px 0 }
#p3 { background-position: -182px 0 }
#p4 { background-position: -288px 0 }
#p5 { background-position: -384px 0 }
#p6 { background-position: -480px 0 }
#p7 { background-position: -576px 0 }
#p8 { background-position: -672px 0 }
```

```js
.animate({scrollLeft: leftPos - 500}, 300)
.animate({scrollLeft: leftPos + 500}, 300)
```

### [Scroll text horizontally](https://codepen.io/subfuzion/pen/JjvRzN)

made with: nothing recognised — read the code

### [Horizontal scroll on cursor position](https://codepen.io/oleole90/pen/kvPBxp)

made with: nothing recognised — read the code

```css
#container { position: relative }
#thumbs { position: absolute; top: 0px }
```

### [Flexbox Scroll Container](https://codepen.io/argyleink/pen/AoLYJm)

made with: nothing recognised — read the code

```css
ul { box-shadow:0 0 10px black inset }
```

### [Responsive Textcolumns](https://codepen.io/DavidWi/pen/DqboBB)

made with: :hover · Web Animations API (.animate)

```css
p:last-child, ul:last-child, ol:last-child, dl:last-child, blockquote:last-child { margin-bottom: 0 }
li p, li ul { margin-top: 0; margin-bottom: 0 }
nav ul li { box-shadow: 0 1px 0 #DFDFDF inset }
nav ul li:hover a span { box-shadow: none }
```

```js
.animate({marginLeft: "0"}, 300)
.animate({marginLeft: "-100%"}, 300)
.animate({marginLeft: "-200%"}, 300)
```
