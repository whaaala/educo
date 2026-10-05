# CodePen · scroll-animation — how each pen does it

171 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/scroll-animation.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| transition | 92 |
| @keyframes | 68 |
| position: fixed | 65 |
| :hover | 50 |
| scroll listener | 47 |
| position: sticky | 31 |
| scroll-driven animation (animation-timeline) | 29 |
| scroll() timeline | 29 |
| GSAP | 27 |
| view() timeline | 26 |
| backdrop-filter | 24 |
| IntersectionObserver | 23 |
| 3D (perspective / preserve-3d) | 21 |
| clip-path | 19 |
| requestAnimationFrame | 18 |
| animation-range | 18 |
| ScrollTrigger | 17 |
| mix-blend-mode | 15 |
| prefers-reduced-motion | 14 |
| mask | 9 |
| Lenis / smooth scroll | 9 |
| scroll-snap | 8 |
| custom properties driven by JS | 8 |
| pointer / mouse tracking | 5 |
| :focus-visible | 3 |
| :has() | 3 |
| Web Animations API (.animate) | 3 |
| canvas 2D | 2 |
| view transitions | 2 |
| @starting-style | 1 |
| container queries | 1 |
| anime.js | 1 |

## Every pen

### [Scroll-scrubbed fireworks · ScrollTrigger + motly](https://codepen.io/editor/realdreamer/pen/01a0f2af-63a4-70e2-aeeb-53aa7f193ecd)

on scroll: div.rocket: transform+top | made with: GSAP · ScrollTrigger

```css
.note { opacity: 0.7 }
.sky { position: relative }
.rocket { position: absolute; bottom: 0 }
```

```js
gsap.registerPlugin(ScrollTrigger)
scrollTrigger: { trigger: '.sky', start: 'top top', end: '+=2500', scrub: 1, pin: true }
```

### [Untitled](https://codepen.io/mojtabadini1/pen/jEByRBj)

made with: position: sticky · transition · :hover · clip-path · mask · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d) · GSAP · ScrollTrigger · Lenis / smooth scroll

```css
.nona-hero-scroll { position: relative }
.nona-hero-sticky { position: sticky; top: 0 }
.nona-hero-sticky::before { position: absolute; inset: 0; opacity: 0.18; mask-image: radial-gradient(circle at center, black, transparent 78%); -webkit-mask-image: radial-gradient(circle at center, black, transparent 78%) }
.nona-hero-prelude { position: absolute; top: var(--space-md); text-transform: uppercase; will-change: transform, opacity, filter }
.nona-hero-kicker { opacity: 0.75 }
.nona-hero-sidecopy { position: absolute; top: 50%; text-transform: uppercase; will-change: transform, opacity, filter }
.nona-hero-sidecopy span { will-change: transform, opacity }
.nona-hero-sidecopy-left { transform: translate(-50%, -50%) rotate(-90deg) }
.nona-hero-sidecopy-right { transform: translate(50%, -50%) rotate(90deg) }
.nona-hero-center-copy { position: absolute; perspective: 1000px; will-change: transform, opacity, filter }
.nona-hero-overline { text-transform: uppercase; will-change: transform, opacity, filter }
.nona-hero-intro-title { text-transform: uppercase }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(CustomEase)
gsap.to(introChars, {
gsap.to([introOverline, introText], {
gsap.to(videoFrame, {
gsap.timeline({
gsap.to(sideLeftItems, {
scrollTrigger: { trigger: hero, start: "top top", end: "45% top", scrub: true }
```

### [Scroll Animation Example](https://codepen.io/editor/tommyho/pen/01a0825f-ef3c-7056-8c83-a1a479a407a8)

held: fixed div.progress, fixed nav.nav, sticky div.hero-stage | on scroll: i.pulse: shadow, div.marquee-track: transform | on hover of a.brand: i.pulse: shadow, div.marquee-track: transform | made with: position: sticky · position: fixed · scroll-snap · @keyframes · transition · :hover · prefers-reduced-motion · backdrop-filter · mix-blend-mode · IntersectionObserver · scroll listener · requestAnimationFrame

```css
.eyebrow { text-transform:uppercase }
.nav { position:fixed; inset:0 0 auto 0; backdrop-filter:blur(0px); transition:background .45s var(--ease),backdrop-filter .45s var(--ease),border-color .45s; border-bottom:1px solid transparent }
.nav.solid { backdrop-filter:blur(18px) saturate(160%) }
.brand i { box-shadow:0 0 0 3px rgba(227,24,55,.25) }
.nav ul a { opacity:.78; transition:opacity .25s; position:relative }
.nav ul a:hover { opacity:1 }
.nav ul a::after { position:absolute; bottom:-5px; transition:width .3s var(--ease) }
.nav .cart { transition:transform .25s var(--ease),background .25s }
.nav .cart:hover { transform:translateY(-1px) }
.hero { position:relative }
.hero-stage { position:sticky; top:0 }
.hero-stage::after { position:absolute; inset:0; opacity:.16; mix-blend-mode:overlay }
```

```js
new IntersectionObserver((entries)=>{
addEventListener("scroll", ()=>{ if(!ticking){ ticking = true
requestAnimationFrame(frame)
```

### [NixRocketLaunch — 360° Scroll Progress Ring & Kinetic Rocket Blast-Off](https://codepen.io/editor/wptechnix/pen/01a07aa7-541f-7e41-8595-b27886797fe7)

held: fixed div.nix-rocket-wrapper | on hover of button.nix-theme-btn: button.nix-theme-btn: color, span.nix-theme-icon: color | made with: position: fixed · @keyframes · transition · :hover · :focus-visible · prefers-reduced-motion · backdrop-filter · scroll listener

```css
.nix-rocket-wrapper { position: fixed; opacity: 0; transform: translateY(1rem) scale(0.9); transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) }
.nix-rocket-wrapper.is-visible { opacity: 1; transform: translateY(0) scale(1) }
.nix-rocket-btn { position: relative }
.nix-rocket-btn::after { position: absolute; transform: translate(calc(-50% * var(--dir-factor, 1)), -0.5rem); opacity: 0; transition: opacity 0.2s ease, transform 0.2s ease; box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2) }
.nix-rocket-btn:hover::after { opacity: 1; transform: translate(calc(-50% * var(--dir-factor, 1)), -0.85rem) }
.nix-rocket-btn:focus-visible { outline-offset: 0.1875rem }
.nix-progress-ring { position: absolute; inset: 0; transform: rotate(-90deg) }
.nix-progress-ring-circle { transition: stroke-dashoffset 0.15s linear }
.nix-rocket-dock { backdrop-filter: blur(0.75rem); -webkit-backdrop-filter: blur(0.75rem); box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.15); transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease }
.nix-rocket-dock .nix-rocket-ship { position: relative }
.nix-rocket-dock .nix-rocket-svg { transform: scaleX(var(--dir-factor, 1)) rotate(317deg); transition: color 0.25s ease }
.nix-rocket-dock:hover { transform: scale(1.06); box-shadow: 0 0.5rem 1.25rem color-mix(in srgb, var(--nix-primary) 30%, transparent) }
```

```js
addEventListener('scroll', () => this.updateProgress(), { passive: true })
```

### [Interactive Scroll Timeline with Sticky Navigation | HTML CSS JavaScript](https://codepen.io/editor/Alexey-Kovalevsky-AKAVA/pen/01a06100-c0a4-7b35-b75c-d0d7f382c0c3)

held: sticky aside.story-timeline__sidebar | on hover of button.story-timeline__nav-item: strong.: color ×2, article.timeline-entry: opacity ×2, img.: transform+filter+top ×2, span.story-timeline__dot: transform+background+top, span.story-timeline__dot: transform+top | made with: position: sticky · transition · prefers-reduced-motion · backdrop-filter · custom properties driven by JS · IntersectionObserver · scroll listener · requestAnimationFrame

```css
.story-timeline__sidebar { position: relative }
.story-timeline__sticky { position: sticky; top: clamp(40px, 8vh, 100px) }
.story-timeline__heading { margin-bottom: clamp(45px, 6vw, 75px) }
.story-timeline__nav { position: relative }
.story-timeline__track, .story-timeline__progress { position: absolute; top: 7px; bottom: 7px }
.story-timeline__progress { bottom: auto; transition: height 80ms linear }
.story-timeline__nav-item { position: relative }
.story-timeline__dot { position: relative; margin-top: 2px; transition: background 220ms ease, border-color 220ms ease, transform 220ms ease }
.story-timeline__nav-item.is-active .story-timeline__dot { transform: scale(1.3) }
.story-timeline__nav-item.is-active .story-timeline__dot::after { position: absolute; inset: 2px }
.story-timeline__nav-copy strong { margin-top: -2px; transition: color 220ms ease, transform 220ms ease }
.story-timeline__nav-copy small { margin-top: 5px }
```

```js
style.setProperty( '--progress',
requestAnimationFrame(
addEventListener( 'scroll',
```

### [Untitled](https://codepen.io/Arman-Teimoori/pen/YPZPBzv)

held: sticky div.nona-hero-sticky | on scroll: div.char: transform+opacity+filter+top ×7, span.: transform+top ×6, span.: transform+opacity+top ×4, div.nona-hero-frame-label: transform+opacity+top ×2 | on hover of a.: span.: transform+opacity+top ×10, div.char: transform+opacity+filter+top ×7, div.nona-hero-sidecopy: transform+opacity+filter ×2, div.nona-hero-frame-label: transform+opacity+top ×2, div.nona-hero-prelude: transform+opacity+filter+top, div.nona-hero-center-copy: transform+filter+top | made with: position: sticky · transition · :hover · clip-path · mask · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d) · GSAP · ScrollTrigger · Lenis / smooth scroll

```css
.nona-hero-scroll { position: relative }
.nona-hero-sticky { position: sticky; top: 0 }
.nona-hero-sticky::before { position: absolute; inset: 0; opacity: 0.18; mask-image: radial-gradient(circle at center, black, transparent 78%); -webkit-mask-image: radial-gradient(circle at center, black, transparent 78%) }
.nona-hero-prelude { position: absolute; top: var(--space-md); text-transform: uppercase; will-change: transform, opacity, filter }
.nona-hero-kicker { opacity: 0.75 }
.nona-hero-sidecopy { position: absolute; top: 50%; text-transform: uppercase; will-change: transform, opacity, filter }
.nona-hero-sidecopy span { will-change: transform, opacity }
.nona-hero-sidecopy-left { transform: translate(-50%, -50%) rotate(-90deg) }
.nona-hero-sidecopy-right { transform: translate(50%, -50%) rotate(90deg) }
.nona-hero-center-copy { position: absolute; perspective: 1000px; will-change: transform, opacity, filter }
.nona-hero-overline { text-transform: uppercase; will-change: transform, opacity, filter }
.nona-hero-intro-title { text-transform: uppercase }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(CustomEase)
gsap.to(introChars, {
gsap.to([introOverline, introText], {
gsap.to(videoFrame, {
gsap.timeline({
gsap.to(sideLeftItems, {
scrollTrigger: { trigger: hero, start: "top top", end: "45% top", scrub: true }
```

### [Untitled](https://codepen.io/editor/Arman-Teimoori/pen/01a043dd-1ad1-7e2c-8471-47f2fee0cbab)

held: sticky div.nona-hero-sticky | on scroll: span.: transform+opacity ×10, div.char: transform+opacity+filter+top ×7, div.nona-hero-sidecopy: transform+opacity+filter ×2, div.nona-hero-frame-label: transform+opacity+top ×2 | on hover of a.: span.: transform+opacity ×10, div.char: transform+opacity+filter+top ×7, div.nona-hero-frame-label: transform+opacity+top ×2, div.nona-hero-prelude: transform+opacity+top, div.nona-hero-center-copy: transform+filter+top, p.nona-hero-overline: transform+opacity+filter+top | made with: position: sticky · transition · :hover · clip-path · mask · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d) · GSAP · ScrollTrigger · Lenis / smooth scroll

```css
.nona-hero-scroll { position: relative }
.nona-hero-sticky { position: sticky; top: 0 }
.nona-hero-sticky::before { position: absolute; inset: 0; opacity: 0.18; mask-image: radial-gradient(circle at center, black, transparent 78%); -webkit-mask-image: radial-gradient(circle at center, black, transparent 78%) }
.nona-hero-prelude { position: absolute; top: var(--space-md); text-transform: uppercase; will-change: transform, opacity, filter }
.nona-hero-kicker { opacity: 0.75 }
.nona-hero-sidecopy { position: absolute; top: 50%; text-transform: uppercase; will-change: transform, opacity, filter }
.nona-hero-sidecopy span { will-change: transform, opacity }
.nona-hero-sidecopy-left { transform: translate(-50%, -50%) rotate(-90deg) }
.nona-hero-sidecopy-right { transform: translate(50%, -50%) rotate(90deg) }
.nona-hero-center-copy { position: absolute; perspective: 1000px; will-change: transform, opacity, filter }
.nona-hero-overline { text-transform: uppercase; will-change: transform, opacity, filter }
.nona-hero-intro-title { text-transform: uppercase }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(CustomEase)
gsap.to(introChars, {
gsap.to([introOverline, introText], {
gsap.to(videoFrame, {
gsap.timeline({
gsap.to(sideLeftItems, {
scrollTrigger: { trigger: hero, start: "top top", end: "45% top", scrub: true }
```

### [testing things](https://codepen.io/VVV-enfantterrible/pen/QwpwmKq)

held: sticky div.nona-hero-sticky | on scroll: div.char: transform+opacity+filter+top ×12, span.: transform+opacity+top ×10, div.nona-hero-sidecopy: transform+opacity+filter+top ×2, div.nona-hero-frame-label: transform+opacity+top ×2 | on hover of a.: div.char: transform+opacity+filter+top ×12, span.: transform+opacity+top ×10, div.nona-hero-sidecopy: transform+opacity+filter+top ×2, div.nona-hero-frame-label: transform+opacity+top ×2, div.nona-hero-prelude: transform+opacity+filter+top, div.nona-hero-center-copy: transform+filter+top | made with: position: sticky · transition · :hover · clip-path · mask · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d) · GSAP · ScrollTrigger · Lenis / smooth scroll

```css
.nona-hero-scroll { position: relative }
.nona-hero-sticky { position: sticky; top: 0 }
.nona-hero-sticky::before { position: absolute; inset: 0; opacity: 0.18; mask-image: radial-gradient(circle at center, black, transparent 78%); -webkit-mask-image: radial-gradient(circle at center, black, transparent 78%) }
.nona-hero-prelude { position: absolute; top: var(--space-md); text-transform: uppercase; will-change: transform, opacity, filter }
.nona-hero-kicker { opacity: 0.75 }
.nona-hero-sidecopy { position: absolute; top: 50%; text-transform: uppercase; will-change: transform, opacity, filter }
.nona-hero-sidecopy span { will-change: transform, opacity }
.nona-hero-sidecopy-left { transform: translate(-50%, -50%) rotate(-90deg) }
.nona-hero-sidecopy-right { transform: translate(50%, -50%) rotate(90deg) }
.nona-hero-center-copy { position: absolute; perspective: 1000px; will-change: transform, opacity, filter }
.nona-hero-overline { text-transform: uppercase; will-change: transform, opacity, filter }
.nona-hero-intro-title { text-transform: uppercase }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(CustomEase)
gsap.to(introChars, {
gsap.to([introOverline, introText], {
gsap.to(videoFrame, {
gsap.timeline({
gsap.to(sideLeftItems, {
scrollTrigger: { trigger: hero, start: "top top", end: "45% top", scrub: true }
```

### [CSS Scroll-Driven Typography with animation-timeline: view()](https://codepen.io/AllThingsSmitty/pen/JoWoPBe)

held: fixed div.progress-track | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · prefers-reduced-motion

```css
& .progress-fill { animation: fill-progress linear forwards; animation-timeline: scroll(root); transform: scaleY(0); transform-origin: top }
from { transform: scaleY(0) }
to { transform: scaleY(1) }
& .chapter { border-top: 1px solid var(--muted); padding-top: 0.8rem; text-transform: uppercase }
&.s0 { animation-range: entry 0% cover 32% }
&.s1 { animation-range: entry 6% cover 40% }
&.s2 { animation-range: entry 12% cover 48% }
&.s3 { animation-range: entry 3% cover 36% }
&.s4 { animation-range: entry 9% cover 44% }
0% { opacity: 0.3; transform: skewX(-10deg) translateY(0.12em) }
100% { opacity: 1; transform: skewX(0deg) translateY(0) }
.word { animation: none; opacity: 1; transform: none }
```

### [Sticky Product Story — Scroll-Linked Car Showcase (No WebGL, Vanilla JS)](https://codepen.io/editor/Alexey-Kovalevsky-AKAVA/pen/01a01353-7569-7309-96b1-bcfab7c80fee)

held: sticky div.product-story__visual | on scroll: article.story-step: opacity+top ×2, span.product-stage__light: transform+top, div.product-stage__object: transform+top | made with: position: sticky · transition · :hover · prefers-reduced-motion · custom properties driven by JS · scroll listener · requestAnimationFrame

```css
.product-story { position: relative }
.product-story__visual { position: sticky }
.product-stage { --product-rotate: -4; --product-scale: 1; position: relative }
.product-stage__light { position: absolute; filter: blur(30px); transform: translate( calc(var(--product-x) * 4px), calc(var(--product-y) * 4px) ) scale(calc(.85 + var(--product-light) / 200)); transition: transform 700ms cubic-bezier(.2, .8, . }
.product-stage__object { position: relative; transform: translate3d( calc(var(--product-x) * 1px), calc(var(--product-y) * 1px), 0 ) rotate(calc(var(--product-rotate) * 1deg)) scale(var(--product-scale)); transition: transform 700ms cubic-bezier }
.product-stage__image { filter: drop-shadow(0 35px 45px rgba(0, 0, 0, .5)) }
.product-stage__meta { position: absolute; bottom: 0 }
.product-story__nav { position: absolute; top: 50%; transform: translateY(-50%) }
.product-story__nav button { transition: height 250ms ease, background 250ms ease, border-radius 250ms ease }
.product-story__content { position: relative }
.story-step { opacity: .38; transition: opacity 350ms ease }
.story-step.is-active { opacity: 1 }
```

```js
style.setProperty( '--product-x',
style.setProperty( '--product-y',
style.setProperty( '--product-rotate',
style.setProperty( '--product-scale',
style.setProperty( '--product-light',
requestAnimationFrame(() => {
addEventListener( 'scroll',
```

### [CSS-Only Animated Cards on Scroll](https://codepen.io/mejiaj/pen/JoEwzwj)

on scroll: p.lead-in: transform+top | on hover of a.: p.lead-in: transform+top | made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · transition

```css
.float { -webkit-animation: var(--animation-float) forwards; animation: var(--animation-float) forwards }
to { transform: translateX(var(--spread-x)) }
to { transform: translateX(var(--spread-x)) }
.card-spread { position: relative }
.card { box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.02); transition: transform 300ms ease-in-out; -webkit-animation: original-position ease-in-out both; animation: original-position ease-in-out b }
@keyframes original-position animates --spread-x, transform, grid-area
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

### [Interactive Scroll-Driven Company Milestone Timeline](https://codepen.io/editor/Mathanraj-Selvaraj/pen/019facda-58aa-7346-821b-de42bb2e7b61)

held: sticky div.controls-wrapper | on scroll: div.timeline-item: transform+opacity+top ×3, div.timeline-dot: shadow+top ×3, div.year-btn: transform+background+color+shadow+top ×2 | made with: position: sticky · transition · :hover · backdrop-filter · IntersectionObserver · scroll listener

```css
.controls-wrapper { position: sticky; top: 20px; margin-bottom: 50px }
.year-nav { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); box-shadow: 0 10px 30px rgba(6, 91, 170, 0.08) }
.year-btn { transition: all 0.3s ease }
.year-btn:hover, .year-btn.active { box-shadow: 0 4px 4px var(--accent-glow); transform: translateY(-1px) }
.timeline-container { position: relative }
.timeline-track { position: absolute; top: 0; bottom: 0; transform: translateX(-50%) }
.timeline-progress { position: absolute; top: 0; transform: translateX(-50%); transition: height 0.1s linear; box-shadow: 0 0 12px var(--accent-glow) }
.timeline-item { position: relative; margin-bottom: 50px; opacity: 0; transform: translateY(35px) scale(0.6); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) }
.timeline-item.show { opacity: 1; transform: translateY(0) scale(1) }
.timeline-dot { position: absolute; top: 24px; transform: translateX(-50%); box-shadow: 0 0 0 4px rgba(6, 91, 170, 0.12); transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) }
.dot-inner { transition: all 0.3s ease }
.timeline-item.show .timeline-dot { box-shadow: 0 0 0 6px rgba(6, 91, 170, 0.4) }
```

```js
new IntersectionObserver((entries) => {
addEventListener('scroll', updateProgressLine)
```

### [Hydra VR Landing Page - SVG Animation](https://codepen.io/editor/zulalnb/pen/019fa4cd-76c6-7511-be41-d02110556605)

held: fixed header.group | made with: @keyframes · transition · :hover · prefers-reduced-motion · clip-path · scroll listener

```css
html { scroll-padding-top: 116px }
html { scroll-padding-top: 151px }
.gradient-text { background-position: 160% 0, 0 0; animation: gradient-text-shine 3s ease-in-out infinite }
0%, 15% { background-position: 160% 0, 0 0 }
65%, 100% { background-position: -60% 0, 0 0 }
:is([data-reveal], [data-reveal-scale]) { opacity: 0 }
:is([data-step-circle], [data-step-label]) { opacity: 0 }
.animate-scale-in { animation: scale-in 0.9s linear both }
from { opacity: 0; transform: scale(0) }
to { opacity: 1; transform: scale(1) }
.animate-bounce-x { animation: bounce-x 1.6s ease-in-out infinite }
0%, 100% { transform: translateX(0) }
```

```js
addEventListener("scroll", syncHeaderScrolled, { passive: true })
```

### [Untitled](https://codepen.io/estilo247/pen/GgrvEOd)

held: sticky div.nona-hero-sticky | on scroll: span.: transform+opacity+top ×10, div.char: transform+opacity+filter+top ×7, div.nona-hero-sidecopy: transform+opacity+filter+top ×2, div.nona-hero-frame-label: transform+opacity+top ×2 | on hover of a.: div.char: transform+opacity+filter+top ×7, span.: transform+opacity+top ×6, div.nona-hero-frame-label: transform+opacity+top ×2, div.nona-hero-prelude: transform+opacity+top, div.nona-hero-center-copy: transform+filter+top | made with: position: sticky · transition · :hover · clip-path · mask · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d) · GSAP · ScrollTrigger · Lenis / smooth scroll

```css
.nona-hero-scroll { position: relative }
.nona-hero-sticky { position: sticky; top: 0 }
.nona-hero-sticky::before { position: absolute; inset: 0; opacity: 0.18; mask-image: radial-gradient(circle at center, black, transparent 78%); -webkit-mask-image: radial-gradient(circle at center, black, transparent 78%) }
.nona-hero-prelude { position: absolute; top: var(--space-md); text-transform: uppercase; will-change: transform, opacity, filter }
.nona-hero-kicker { opacity: 0.75 }
.nona-hero-sidecopy { position: absolute; top: 50%; text-transform: uppercase; will-change: transform, opacity, filter }
.nona-hero-sidecopy span { will-change: transform, opacity }
.nona-hero-sidecopy-left { transform: translate(-50%, -50%) rotate(-90deg) }
.nona-hero-sidecopy-right { transform: translate(50%, -50%) rotate(90deg) }
.nona-hero-center-copy { position: absolute; perspective: 1000px; will-change: transform, opacity, filter }
.nona-hero-overline { text-transform: uppercase; will-change: transform, opacity, filter }
.nona-hero-intro-title { text-transform: uppercase }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(CustomEase)
gsap.to(introChars, {
gsap.to([introOverline, introText], {
gsap.to(videoFrame, {
gsap.timeline({
gsap.to(sideLeftItems, {
scrollTrigger: { trigger: hero, start: "top top", end: "45% top", scrub: true }
```

### [Very Simple Animated Number Counter](https://codepen.io/bokac/pen/JoEYdbj)

on scroll: span.: transform+top ×11 | made with: transition · mask · IntersectionObserver

```css
.counter { mask-image: linear-gradient( to bottom, transparent 0, black var(--top-bottom-padding), black calc(100% - var(--top-bottom-padding)), transparent 100% ); position: relative }
.counter > span[data-value] { transition: transform 2s ease; transform: translateY(0) }
```

```js
new IntersectionObserver((entries) => {
```

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

### [Scroll-Reel Hero — Cinematic GSAP Video Landing Page](https://codepen.io/nonatizedpen/pen/pvNpYMP)

held: sticky div.nona-hero-sticky | on scroll: span.: transform+opacity+top ×8, div.char: transform+opacity+filter+top ×7, span.: transform+top ×2, div.nona-hero-frame-label: transform+opacity+top ×2 | on hover of a.: span.: transform+opacity+top ×8, div.char: transform+opacity+filter+top ×7, div.nona-hero-frame-label: transform+opacity+top ×2, div.nona-hero-prelude: transform+opacity+top, div.nona-hero-center-copy: transform+filter+top | made with: position: sticky · transition · :hover · clip-path · mask · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d) · GSAP · ScrollTrigger · Lenis / smooth scroll

```css
.nona-hero-scroll { position: relative }
.nona-hero-sticky { position: sticky; top: 0 }
.nona-hero-sticky::before { position: absolute; inset: 0; opacity: 0.18; mask-image: radial-gradient(circle at center, black, transparent 78%); -webkit-mask-image: radial-gradient(circle at center, black, transparent 78%) }
.nona-hero-prelude { position: absolute; top: var(--space-md); text-transform: uppercase; will-change: transform, opacity, filter }
.nona-hero-kicker { opacity: 0.75 }
.nona-hero-sidecopy { position: absolute; top: 50%; text-transform: uppercase; will-change: transform, opacity, filter }
.nona-hero-sidecopy span { will-change: transform, opacity }
.nona-hero-sidecopy-left { transform: translate(-50%, -50%) rotate(-90deg) }
.nona-hero-sidecopy-right { transform: translate(50%, -50%) rotate(90deg) }
.nona-hero-center-copy { position: absolute; perspective: 1000px; will-change: transform, opacity, filter }
.nona-hero-overline { text-transform: uppercase; will-change: transform, opacity, filter }
.nona-hero-intro-title { text-transform: uppercase }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(CustomEase)
gsap.to(introChars, {
gsap.to([introOverline, introText], {
gsap.to(videoFrame, {
gsap.timeline({
gsap.to(sideLeftItems, {
scrollTrigger: { trigger: hero, start: "top top", end: "45% top", scrub: true }
```

### [Dark Editorial | Char-by-Char Text Reveal on Scroll](https://codepen.io/jpbelley/pen/VYmpXMb)

held: fixed nav.site-nav | on hover of a.btn-inquire: a.btn-inquire: background, img.: filter | made with: position: fixed · transition · :hover · IntersectionObserver

```css
.t-upper { text-transform: uppercase }
.site-nav { position: fixed; top: 0; border-bottom: 1px solid var(--inverse-surface) }
.nav-logo { text-transform: uppercase }
.btn-inquire { text-transform: uppercase; transform: scale(0.95); transition: background 200ms, transform 200ms }
.btn-inquire:active { transform: scale(0.9) }
.site-main { padding-top: var(--section) }
.editorial-header { margin-bottom: var(--gutter); border-bottom: 1px solid var(--inverse-surface) }
.editorial-title { margin-bottom: 16px }
.bento-grid { border-top: 1px solid var(--inverse-surface) }
.bento-cell { border-bottom: 1px solid var(--inverse-surface) }
.bento-hero { position: relative }
.bento-hero img { filter: grayscale(100%) brightness(0.75); transition: filter 700ms }
```

```js
new IntersectionObserver((entries) => {
```

### [Scroll-animation using siblings-function ( chromium )](https://codepen.io/Taluska/pen/WboQmBK)

held: sticky div.viewport, sticky section.panel, sticky section.panel, sticky section.panel, sticky section.panel, sticky section.panel, sticky section.panel | on scroll: section.panel: transform+opacity+top ×5 | made with: position: sticky · scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @keyframes

```css
body { position: relative }
.viewport { position: sticky; top: 0 }
.panel { position: sticky; top: 0; outline-offset: -2px; animation: shrinkToCenter linear forwards; animation-timeline: scroll(root); animation-range: calc((sibling-index() - 1) * (100% / sibling-count())) calc(sibling-index() *  }
.panel:last-child { animation: none }
0% { transform: scale(1); opacity: 1 }
100% { transform: scale(0); opacity: 0.3 }
@keyframes shrinkToCenter animates transform, opacity
```

### [Scroll Animation Image Grid – Motion One Scaling + Layered Gallery Effect](https://codepen.io/Gopi-Chakradhar/pen/dPOoMWE)

held: sticky div.content | made with: position: sticky · scroll() timeline · prefers-reduced-motion

### [CSS Simple Scroll Animation](https://codepen.io/editor/Debbie-Meda/pen/019de6a1-96d5-7820-abd1-47f064c7c524)

on scroll: div.elem: opacity+top | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · @keyframes

```css
html::before { position: fixed; inset: 0; opacity: 0.6 }
0% { opacity: 0 }
100% { opacity: 1 }
.elem { animation: fadeIn; animation-timeline: view() }
@keyframes fadeIn animates opacity
```

### [njX UI — 60+ CSS only Animation Utility Classes](https://codepen.io/njbSaab/pen/NPbWVxj)

held: sticky nav.top | on scroll: div.demo-box: transform+top ×12 | on hover of a.brand: div.demo-box: transform+top ×8, div.demo-card: shadow ×6, div.demo-box: transform ×4, div.demo-box: shadow ×2, div.demo-box: transform+opacity+top ×2 | made with: position: sticky · transition · :hover · backdrop-filter · IntersectionObserver

### [Scroll Reveal — Text Cascade](https://codepen.io/editor/AhmedTalbii/pen/019d7977-0eb0-71c5-866c-f9fe601db972)

held: sticky h1.reveal-section__text | on scroll: span.word: color+top ×4 | made with: position: sticky · transition · scroll listener

```css
.reveal-section__text { position: sticky; top: 40vh }
.reveal-section__text .word { transition: color 0.3s ease }
```

```js
addEventListener("scroll", () => {
```

### [Liquid Scroll Masterpiece animation](https://codepen.io/editor/Sujaicodes/pen/019d4c8a-15de-70e1-a312-05b24ca50a84)

held: fixed div.progress-bar, fixed div.glass-overlay, fixed div.liquid-bg, fixed div.scroll-hint | on scroll: div.parallax-text: transform+top ×4, div.blob: transform+top ×2, div.content: transform+opacity+top | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · 3D (perspective / preserve-3d)

### [High Contrast Radial Smoke](https://codepen.io/editor/WebRuin/pen/019d4991-1a94-71dc-9a25-b9c13923c2c1)

held: sticky div.sticky-container | on scroll: h1.: transform+opacity+filter+top, div.radial-smoke: transform+top | made with: position: sticky · GSAP · ScrollTrigger

```css
h1 { text-transform: uppercase; margin-bottom: 2rem }
.sticky-container { position: sticky; top: 0 }
.radial-smoke { filter: url('#smoke-filter') }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline({
scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1 }
```

### [Scroll Trigger Animation with Intersection Observer](https://codepen.io/tkdev-hub/pen/PwGKRPX)

made with: transition · IntersectionObserver

```css
.section-title { margin-bottom: 32px }
.js-scroll-item { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease }
.js-scroll-item.is-visible { opacity: 1; transform: translateY(0) }
```

```js
new IntersectionObserver((entries, obs) => {
```

### [12 Principles - Brutalist Scroll Page with GSAP](https://codepen.io/Margarita-the-solid/pen/JoRYWKq)

held: fixed div.cursor-dot, fixed div.scroll-progress | on hover of article.card: article.card: transform+opacity ×6, article.card: transform+opacity+top ×3, article.card: transform ×2 | made with: position: fixed · transition · :hover · mix-blend-mode · GSAP · ScrollTrigger · IntersectionObserver · pointer / mouse tracking

```css
.hero::after, section::after { position: absolute; inset: 0; opacity: 0.26; mix-blend-mode: color-dodge }
.principles { position: relative }
.principles__header { border-bottom: var(--border-thick); position: relative }
.principles__header-title { text-transform: uppercase; position: relative }
.principles__header-ghost { position: absolute; top: 50%; transform: translateY(-50%) }
.card { position: relative; border-bottom: var(--border-thick) }
.card::after { position: absolute; inset: 0; opacity: 0.22; mix-blend-mode: color-dodge }
.card__top { position: relative }
.card__icon { opacity: 0.5 }
.card__body { position: relative }
.card__title { text-transform: uppercase; margin-bottom: clamp(12px, 2vw, 22px) }
.card__desc { border-top: var(--border); padding-top: 14px; margin-top: 6px }
```

```js
gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
addEventListener("mousemove", (e) => {
gsap.to(dot, {
addEventListener("mouseenter", () =>
addEventListener("mouseleave", () =>
gsap.to("#scrollProgress", {
scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true }
gsap.to(".principles__header-ghost", {
```

### [The Maker's Manifesto — GSAP Scroll-Driven Motion Path + Clip-Path Reveal](https://codepen.io/Margarita-the-solid/pen/zxKGPXM)

on scroll: div.ks-arr: transform+opacity+top ×3 | on hover of div.stop-card: div.ks-arr: transform+opacity+top ×3, div.box: transform+top, span.gem-inner: transform+top | made with: position: fixed · @keyframes · transition · :hover · clip-path · GSAP · ScrollTrigger

```css
.manifesto-title { position: relative }
.manifesto-title::before { position: absolute; top: 50%; transform: translateY(-50%) }
.manifesto-eyebrow { text-transform: uppercase; opacity: 0.5; margin-bottom: 20px; position: relative }
.manifesto-name { position: relative }
.mn-the { opacity: 0.55; text-transform: uppercase; margin-bottom: 4px }
.mn-manifesto { margin-top: -4px }
.mn-rule { position: relative }
.mn-rule::after { position: absolute; top: 50%; transform: translateY(-50%) }
.manifesto-tagline { margin-top: 28px; opacity: 0.6; position: relative }
.scroll-marker { opacity: 0.55; margin-top: 40px }
.scroll-arrow { border-bottom: 2.5px solid var(--pink); transform: rotate(45deg) translateY(-3px); animation: arrow-bounce 1.4s ease-in-out infinite }
.scroll-arrow-wrap { margin-top: 2px }
```

```js
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)
gsap.timeline({
gsap.to(path, {
scrollTrigger: { trigger: ".mstop.initial", start: "clamp(top center)", endTrigger: ".path-end", end: "clamp(top center)", scrub: 1 }
gsap.to(el, {
scrollTrigger: { trigger: el, start: "top 82%", end: "top 18%", scrub: true }
ScrollTrigger.create({
```

### [Sticky Card Curtain Reveal Animation](https://codepen.io/nandhu279/pen/pvbMEdb)

held: fixed nav.nav, sticky div.sticky, sticky div.sticky, sticky div.sticky, sticky div.col, sticky div.sticky, sticky div.sticky, sticky div.sticky, sticky div.m-sticky, sticky div.m-sticky | on scroll: div.mask: clip-path+top ×2, img.img: transform+top ×2, div.nav-scroll: transform+opacity+top | on hover of img.img: div.scroll-hint: opacity, div.scroll-line: transform+opacity+top | made with: position: sticky · position: fixed · @keyframes · transition · :hover · clip-path · mask · Lenis / smooth scroll · requestAnimationFrame

```css
.nav { position: fixed; top: 0 }
.logo { transition: transform 0.3s }
.logo:hover { transform: scale(1.05) }
.nav-scroll { text-transform: uppercase; opacity: 0; transform: translateY(-5px); transition: all 0.4s }
.nav-scroll.visible { opacity: 1; transform: translateY(0) }
.main { position: relative }
.col { position: relative }
.col-center { position: sticky; top: 0 }
.track { position: relative }
.col-left .track:nth-child(1) { margin-top: 10vh }
.col-left .track:nth-child(2), .col-left .track:nth-child(3) { margin-top: 90vh }
.col-right .track:nth-child(1) { margin-top: 70vh }
```

```js
requestAnimationFrame(raf)
```

### [Sticky Media + Scroll-Stacked Service Cards (Two-Column Layout)](https://codepen.io/daviderik/pen/ogLRqQq)

held: sticky aside.svc__media, sticky div.svc__stage | on hover of img.svc__img: div.svc__progressFill: transform | made with: position: sticky · transition · :hover · prefers-reduced-motion · GSAP · ScrollTrigger

```css
:root { --svc-top: clamp(14px, 2vh, 24px) }
.svc__media, .svc__stage { position: relative; top: auto }
.svc__media { position: sticky; top: var(--svc-top) }
.svc__mediaInner { position: relative }
.svc__images { position: absolute; inset: 0 }
.svc__img { position: absolute; inset: 0; opacity: 0; transform: scale(1.03); transition: opacity 180ms linear }
.svc__img.is-active { opacity: 1 }
.svc__mediaOverlay { position: absolute; inset: 0 }
.svc__progress { position: absolute; bottom: calc(var(--svc-pad) * 0.65) }
.svc__progressFill { transform: scaleX(0) }
.svc__right { position: relative }
.svc__stage { position: sticky; top: var(--svc-top) }
```

```js
gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.create({
gsap.to(progressFill, {
gsap.timeline({
```

### [CSS-Only Scroll to Reveal Effect](https://codepen.io/aarontgrogg/pen/pvbqbbW)

held: fixed section, fixed div | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes

```css
aside { position: absolute }
section { position: fixed; view-timeline: --scroller }
& + span { animation-name: zoom-text-from-right; translate: 50vw }
div { position: fixed; top: 0 }
img { position: absolute; scale: 0; animation: zoom-image linear both; animation-timeline: --scroller; animation-range: exit }
from { opacity: 1 }
to { opacity: 0 }
from { translate: -50vw }
to { translate: 0 }
from { translate: 50vw }
to { translate: 0 }
from { scale: 0 }
```

### [Hyper-Kinetic Brutalism](https://codepen.io/aleksa-rakocevic/pen/JoKKjwd)

held: fixed div.noise, fixed div, fixed nav.brutal-nav | on scroll: div.: transform+top ×2, nav.brutal-nav: transform+background+shadow+top | on hover of a.nav-logo: span.char: transform+color ×6, span.char: transform+color+top ×5, nav.brutal-nav: background+top, a.nav-logo: transform+top, div.: transform+top | made with: position: fixed · @keyframes · transition · :hover · clip-path · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d) · scroll listener · pointer / mouse tracking · requestAnimationFrame

```css
.noise { position: fixed; top: 0; opacity: 0.07 }
#scroll-content { will-change: transform }
#cursor { position: fixed; top: 0; mix-blend-mode: difference; transform: translate(-50%, -50%); transition: width 0.3s var(--easing), height 0.3s var(--easing), transform 0.05s linear }
#cursor.magnet { backdrop-filter: blur(0px) }
#cursor.magnet::after { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.brutal-nav { position: fixed; top: 0; transition: padding 0.7s var(--easing), top 0.7s var(--easing), width 0.7s var(--easing), background 0.5s var(--easing), border-radius 0.7s var(--easing); mix-blend-mode: exclusion; perspective:  }
.brutal-nav.scrolled { top: 1.5rem; transform: translateX(-50%); backdrop-filter: blur(12px); mix-blend-mode: normal; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6) }
.nav-logo { position: relative }
.nav-logo:hover { animation: glitch-anim 0.3s infinite }
.nav-logo::before, .nav-logo::after { position: absolute; top: 0; opacity: 0.8 }
.nav-logo:hover::before { transform: translate(-2px, -2px); clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%); animation: glitch-anim-2 0.5s infinite linear alternate-reverse }
.nav-logo:hover::after { transform: translate(2px, 2px); clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%); animation: glitch-anim-2 0.5s infinite linear alternate-reverse }
```

```js
addEventListener('mousemove', e => {
requestAnimationFrame(animateCursor)
addEventListener('mousemove', (e) => {
addEventListener('mouseleave', () => {
addEventListener('scroll', () => {
requestAnimationFrame(scrollLoop)
addEventListener('mouseenter', event => {
addEventListener('mouseleave', e => {
```

### [Word-by-Word Scroll Color Fill Animation](https://codepen.io/baahubali92/pen/ogLxdoG)

made with: transition · scroll listener

```css
.scroll-section p { margin-bottom: 20 }
.word { background-position: 100% 0; transition: background-position 0.12s linear }
```

```js
addEventListener("scroll", () => {
```

### [PinStack Showcase - Premium ScrollTrigger Panels](https://codepen.io/ash1198/pen/JoKXJYQ)

held: fixed header.topbar | on scroll: span.blob: transform+top ×6 | on hover of button.chip: a.tile: transform+opacity+top ×4, img.: transform+opacity+top ×4, div.kicker: transform+opacity ×2, div.device: transform+opacity, span.pulse: shadow | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · mix-blend-mode · GSAP · ScrollTrigger

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

### [PulseTrail Timeline (Scroll Reveal Milestones)](https://codepen.io/ash1198/pen/RNRWLBG)

held: fixed button.toTop | on scroll: article.timelineItem: transform+opacity+top ×3 | on hover of div.card: article.timelineItem: transform+opacity ×2, div.card: transform+shadow+top, img.: transform+top, article.timelineItem: transform+opacity+top | made with: position: fixed · @keyframes · transition · :hover · IntersectionObserver · scroll listener

```css
.timeline { position: relative }
.container { position: relative }
.hero { margin-bottom: 70px }
.hero h1 { margin-top: 14px }
.timelineRail { position: absolute; top: 190px; bottom: 40px; transform: translateX(-50%); box-shadow: 0 0 0 6px rgba(197, 202, 233, 0.12) }
.timelineItem { position: relative }
.timelineDot { position: absolute; transform: translateX(-50%); top: 28px; box-shadow: 0 0 0 6px rgba(197, 202, 233, 0.35), 0 18px 40px rgba(63, 81, 181, 0.25) }
.card { box-shadow: var(--cardShadow); position: relative; transition: transform 0.18s ease, box-shadow 0.18s ease }
.card:hover { transform: translateY(-4px); box-shadow: 0 26px 38px -18px rgba(0, 0, 0, 0.42) }
.cardTop { position: relative }
.imgWrap img { transform: scale(1.02); transition: transform 0.35s ease }
.card:hover .imgWrap img { transform: scale(1.06) }
```

```js
new IntersectionObserver(
addEventListener("scroll", onScroll, { passive: true })
```

### [Pinned Page Animation](https://codepen.io/Mohish-Padave/pen/zxqVoZE)

made with: transition · :hover · GSAP · ScrollTrigger

```css
#projects { position: relative }
.overline { text-transform: uppercase; margin-bottom: 1.5rem }
.project-title { margin-bottom: 2rem }
.project-description { margin-bottom: 3rem }
.btn-arrow { text-transform: uppercase; transition: all 0.3s ease }
.btn-arrow svg { transition: transform 0.3s ease }
.btn-arrow:hover svg { transform: translateX(5px) }
.project-right { position: relative }
.img-wrapper img { transition: transform 0.7s cubic-bezier(0.165, 0.84, 0.44, 1) }
.project-card:hover .img-wrapper img { transform: scale(1.05) }
.card-meta { border-top: 1px solid rgba(0,0,0,0.1); padding-top: 1rem }
.meta-left h3 { margin-bottom: 0.25rem }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to(grid, {
scrollTrigger: { trigger: projectsSection, start: "top top", end: `+=${distance}
```

### [Scroll Animation](https://codepen.io/Yvonne-Angelica/pen/PwNvrgO)

on scroll: div.box: transform+top ×3 | made with: transition · scroll listener

```css
.box { box-shadow: 2px 4px 5px rgba(0, 0, 0, 0.3); transform: translateX(400%); transition: transform 0.4s ease }
.box:nth-of-type(even) { transform: translateX(-400%) }
.box.show { transform: translateX(0) }
```

```js
addEventListener("scroll", checkBoxes)
```

### [Untitled](https://codepen.io/sgalway524/pen/ZYWNmGR)

made with: position: sticky · position: fixed · @keyframes · GSAP · requestAnimationFrame

```css
#v0 { position: fixed; bottom: 0 }
section { position: relative }
.content { position: sticky; position: -webkit-sticky; top: 33.3% }
.entered { -webkit-animation: text-focus-in 1s cubic-bezier(0.55, 0.085, 0.68, 0.53) both; animation: text-focus-in 1s cubic-bezier(0.55, 0.085, 0.68, 0.53) both }
0% { -webkit-filter: blur(12px); filter: blur(12px); opacity: 0 }
100% { -webkit-filter: blur(0px); filter: blur(0px); opacity: 1 }
0% { -webkit-filter: blur(12px); filter: blur(12px); opacity: 0 }
100% { -webkit-filter: blur(0px); filter: blur(0px); opacity: 1 }
@keyframes text-focus-in animates -webkit-filter, filter, opacity
```

```js
requestAnimationFrame(scrollPlay)
```

### [Breadcrumb-Bottom-Nav-2 - With Scroll indicator](https://codepen.io/axmr97/pen/vEGbBVZ)

held: fixed nav.breadcrumb | on scroll: nav.breadcrumb: transform+opacity+background+shadow+top, div.breadcrumb-progress-bar: transform+top | on hover of li.breadcrumb-item: nav.breadcrumb: transform+opacity+background+shadow+top, div.breadcrumb-progress-bar: transform+top | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · scroll listener · requestAnimationFrame

```css
.breadcrumb { backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); box-shadow: 0 18px 45px rgba(15, 23, 42, 0.7); position: fixed; bottom: 1rem; transform: translate(-50%, 0); opacity: 1; transition: transform 0.25s ease, }
.breadcrumb:not(.breadcrumb--hidden) { animation: navGlow 8s ease-in-out infinite }
.breadcrumb.breadcrumb--scrolled { box-shadow: 0 24px 60px rgba(56, 189, 248, 0.4) }
.breadcrumb.breadcrumb--hidden { transform: translate(-50%, 140%); opacity: 0; animation: none }
.breadcrumb-item { position: relative; opacity: 0; transform: translateY(6px); transition: opacity 0.4s ease, transform 0.4s ease }
.breadcrumb-item--visible { opacity: 1; transform: translateY(0) }
.breadcrumb-item a { transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease, background-position 0.4s ease }
.breadcrumb-item a:hover { transform: translateY(-1px); box-shadow: 0 4px 18px rgba(15, 23, 42, 0.6); background-position: 0% 50% }
.breadcrumb-item.is-active a { box-shadow: 0 4px 22px rgba(15, 23, 42, 0.9); animation: activeCrumbGlow 4s ease-in-out infinite }
.breadcrumb-back::before { opacity: 0.6 }
.crumb-icon { transition: transform 0.2s ease, filter 0.2s ease }
.breadcrumb-item a:hover .crumb-icon { transform: translateY(-1px) rotate(-8deg); filter: drop-shadow(0 0 4px rgba(125, 211, 252, 0.9)) }
```

```js
addEventListener("scroll", () => {
requestAnimationFrame(handleScroll)
```

### [Gradient text reveal on scroll](https://codepen.io/yel_un/pen/GgZGJbZ)

made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes

```css
p { animation: reveal forwards linear; animation-timeline: view(); animation-range: contain }
p { animation: colorStop forwards linear; animation-timeline: view(); animation-range: contain cover 70% }
@keyframes reveal animates background-size
@keyframes colorStop animates --colorstop
```

### [Pinned Scroll Card Stack Animation (jQuery + Rotating Cards)](https://codepen.io/gap3agency/pen/ByKxRPp)

held: sticky div.stack-wrapper, sticky div.stack-wrapper, fixed div.info, fixed div.progress | on scroll: div.card: transform+opacity+top | made with: position: sticky · position: fixed · requestAnimationFrame

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

### [The Green Pulse — Animated Nature Experience](https://codepen.io/monta99/pen/QwyVOve)

held: fixed div.scroll-progress, fixed nav, fixed div, fixed div, fixed div | on scroll: div.leaf: transform+top ×5, div.card: transform+top ×3 | on hover of li.: div.leaf: transform+top ×5, div.card: transform+top ×3, div.: transform+opacity+top ×3, div.leaf: transform+opacity+top ×2, div.leaf: transform+opacity | made with: position: fixed · view transitions · @keyframes · transition · :hover · backdrop-filter · 3D (perspective / preserve-3d) · custom properties driven by JS · IntersectionObserver · scroll listener

### [Color Journey – A Scroll Through the Color Wheel](https://codepen.io/jerora98/pen/EaPVGdr)

held: fixed div.background | on scroll: div.background: background | made with: position: fixed · transition · scroll listener

```css
.background { position: fixed; inset: 0; transition: background 0.1s linear }
h1, h2 { margin-bottom: 1rem }
p { opacity: 0.9 }
```

```js
addEventListener("scroll", updateBackground)
```

### [Basic scroll animation demo](https://codepen.io/JBuma/pen/gbaxpBr)

held: fixed div.progress | on hover of div.card: div.card: opacity+top ×8 | made with: position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · @keyframes

```css
&:after { position: absolute; -webkit-animation-name: inline-grow; animation-name: inline-grow; animation-timeline: scroll() }
from { opacity: 0.2 }
to { opacity: 1 }
from { opacity: 0.2 }
to { opacity: 1 }
.card { -webkit-animation-name: fade-in; animation-name: fade-in; animation-timeline: view(block 0% 0%) }
@keyframes inline-grow animates inline-size
@keyframes fade-in animates opacity
```

### [Smooth Scroll Animations with IntersectionObserver & CSS Transitions](https://codepen.io/roniee_1993/pen/jEbwPbm)

on scroll: div.reveal: transform+opacity+top ×2, div.reveal: transform+top ×2 | made with: transition · IntersectionObserver

```css
.section-title { margin-bottom: 3rem }
.reveal { margin-bottom: 3rem; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); opacity: 0; transform: translateY(40px); transition: all 0.8s ease; will-change: transform, opacity }
.reveal.active { opacity: 1; transform: none }
.fade-in { transform: translateY(40px) }
.slide-left { transform: translateX(-60px) }
.zoom-in { transform: scale(0.8) }
.flip-up { transform: rotateX(90deg); transform-origin: bottom }
.slide-right { transform: translateX(60px) }
.flip-down { transform: rotateX(-90deg); transform-origin: top }
.fade-up { transform: translateY(40px); opacity: 0 }
.reveal.slide-right.active, .reveal.flip-down.active, .reveal.fade-up.active { transform: none; opacity: 1 }
.reveal.fade-in.active, .reveal.slide-left.active, .reveal.zoom-in.active, .reve { transform: none }
```

```js
new IntersectionObserver((entries) => {
```

### [Spinny scroll animation](https://codepen.io/JBuma/pen/RNWpbwR)

held: fixed div.spinner | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes

```css
from { offset-path: circle(0px); offset-distance: calc(var(--position) * 1%) }
to { offset-path: circle(calc(0.5vh * var(--position))); offset-distance: calc(var(--position) * 10%) }
from { offset-path: circle(0px); offset-distance: calc(var(--position) * 1%) }
to { offset-path: circle(calc(0.5vh * var(--position))); offset-distance: calc(var(--position) * 10%) }
.dot { --position: calc((sibling-index() / sibling-count()) * 100); offset-path: circle(25vh); offset-distance: calc(var(--position) * 1%); -webkit-animation: spin; animation: spin; animation-timeline: scroll() }
@keyframes spin animates offset-path, offset-distance, block-size, inline-size
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

### [Isometric Scroll Animation](https://codepen.io/ash1198/pen/JodQaBX)

on scroll: div.iso-card: transform+opacity+top | made with: transition · scroll listener

```css
.iso-card { transform: skewY(-15deg) rotateX(10deg) scale(0.9); opacity: 0; transition: all 0.8s ease-out; box-shadow: 0 10px 30px #0ff6 }
```

```js
addEventListener("scroll", reveal)
```

### [Scribble Reveal Animation](https://codepen.io/nickcosmo/pen/raVLGJX)

made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes

```css
path { view-timeline-name: --scribble-path; view-timeline-axis: block; animation: linear draw both; animation-timeline: --scribble-path; animation-range: entry 20% cover 40% }
@keyframes draw animates stroke-dashoffset
```

### [Untitled](https://codepen.io/Phil-mann/pen/yyyqPgy)

made with: transition · :hover

```css
.site-header { border-bottom: 1px solid #e0e0e0 }
.site-nav a { transition: color 0.3s ease }
.hero h2 { margin-bottom: 1rem }
.hero p { margin-bottom: 2rem }
.btn-primary { box-shadow: var(--shadow); transition: background 0.3s ease, transform 0.2s ease }
.btn-primary:hover { transform: scale(1.03) }
.feature-card { box-shadow: var(--shadow) }
.feature-card h3 { margin-bottom: 10px }
.site-footer { border-top: 1px solid #e0e0e0 }
```

### [Parallax 1 (Tailwind v4)](https://codepen.io/sfearl1/pen/ogNzmPw)

on scroll: img.w-full: transform+top ×3 | made with: scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes

```css
from { transform: translate(0%, -50%) }
to { transform: translate(0%, 50%) }
img { transform: translate(0%, 0%) !important }
@keyframes parallax animates transform
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

### [The void](https://codepen.io/d4rek/pen/EaYdbwX)

held: fixed li, fixed li, fixed li, fixed li, fixed li, fixed li, fixed li, fixed li | on scroll: li.: opacity+top | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · mask

```css
.list li { position: fixed; top: 50%; translate: -50% -50%; -webkit-mask-image: linear-gradient( 90deg, rgb(0 0 0 / 0) calc(33.33% - 1px), rgb(0 0 0 / 1) 33.33%, rgb(0 0 0 / 1) calc(66.66% - 1px), rgb(0 0 0 / 0) 66.66% ); mask-imag }
.list li:first-of-type { -webkit-animation: line-1 auto linear; animation: line-1 auto linear; animation-timeline: scroll() }
0% { -webkit-mask-position: 50% 0%; mask-position: 50% 0%; rotate: 0deg }
12.5% { -webkit-mask-position: 100% 0; mask-position: 100% 0; rotate: 1deg; opacity: 1 }
12.6% { -webkit-mask-position: 100% 0; mask-position: 100% 0; rotate: 1deg; opacity: 0 }
87.4% { -webkit-mask-position: 0% 0; mask-position: 0% 0; rotate: -1deg; opacity: 0 }
87.5% { -webkit-mask-position: 0% 0; mask-position: 0% 0; rotate: -1deg; opacity: 1 }
100% { -webkit-mask-position: 50% 0%; mask-position: 50% 0%; rotate: 0deg }
0% { -webkit-mask-position: 50% 0%; mask-position: 50% 0%; rotate: 0deg }
12.5% { -webkit-mask-position: 100% 0; mask-position: 100% 0; rotate: 1deg; opacity: 1 }
12.6% { -webkit-mask-position: 100% 0; mask-position: 100% 0; rotate: 1deg; opacity: 0 }
87.4% { -webkit-mask-position: 0% 0; mask-position: 0% 0; rotate: -1deg; opacity: 0 }
```

### [CSS Only Mask Scroll](https://codepen.io/pixelgridui/pen/GgKdoYB)

held: fixed div.text, fixed div.text, fixed div.text, fixed div.pp-widget, fixed button.pp-reopen | on scroll: span.pp-reopen-dot: transform+opacity+top | on hover of a.pp-btn-yt: a.pp-btn-yt: background, span.pp-reopen-dot: transform+opacity+top | made with: position: fixed · clip-path

```css
.row { background-position: 0 0; position: relative }
.text-holder { position: absolute; inset: 0%; -webkit-clip-path: inset(0px 0px 0px 0px); clip-path: inset(0px 0px 0px 0px) }
.text { transform: translateZ(0); margin-top: 0; margin-bottom: 0; position: fixed; inset: 0% }
```

### [Cards Stacking with GSAP](https://codepen.io/pixelgridui/pen/mybLVxL)

held: fixed div.pp-widget, fixed button.pp-reopen | on hover of a.pp-btn-yt: div.item: transform+top ×2, span.pp-reopen-dot: transform+opacity+top | made with: transition · GSAP · ScrollTrigger

```css
body { transition: color 0.3s, background-color 0.3s }
h2 { margin-top: 0; margin-bottom: 1rem }
.list { position: relative }
.item { position: absolute; inset: 0%; box-shadow: rgb(149, 157, 165, 0.2) 0px 8px 24px }
.item_number { margin-bottom: 0.5rem; position: absolute; top: 6rem }
.item_content { position: relative }
.item_content, .item_media { padding-top: 0; padding-bottom: 0 }
.item_number { top: 1.5rem }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.timeline({
scrollTrigger: { trigger: section, pin: true, start: "top top", end: () => `+=${items.length * 100}
```

### [CryptoCap Landing Page](https://codepen.io/zulalnb/pen/EaYjMZL)

held: fixed header.fixed | made with: transition · clip-path · canvas 2D

```css
body { transition: background 0.2s linear }
.clip-ellipse:before { clip-path: ellipse(closest-side farthest-side) }
.blob-1:before { clip-path: path( "M322.242 0C355.213 32.7021 375 79.1231 375 142.021C375 265.322 262.714 474.875 147.481 545.499H0.368164C0.24493 545.41 0.123025 545.32 0 545.23V0H322.242Z" ) }
.blob-2:before { clip-path: path( "M438.963 0C514.458 4.8639e-05 576.256 34.3 621.08 86.5186V419.766C578.056 437.125 525.674 449.047 483.188 474H46.7295C-19.1065 388.448 -28.4322 298.282 114.4 264.376C483.446 176.772 274.022 0 438.963 0Z }
```

### [Rotating in Motion](https://codepen.io/mahboube89/pen/XJrJxvZ)

held: fixed div.cube-wrapper | on scroll: div.cube: transform | made with: position: fixed · @keyframes · 3D (perspective / preserve-3d) · scroll listener

```css
.cube-wrapper { position: fixed; top: 50%; transform: translate(-50%, -50%); perspective: 1000px }
.cube { position: relative; animation: rotateCube 3s linear infinite; animation-play-state: paused }
.face { position: absolute }
.front { transform: translateZ(100px) }
.back { transform: rotateY(180deg) translateZ(100px) }
.left { transform: rotateY(-90deg) translateZ(100px) }
.right { transform: rotateY(90deg) translateZ(100px) }
.top { transform: rotateX(90deg) translateZ(100px) }
.bottom { transform: rotateX(-90deg) translateZ(100px) }
.side1 { transform: rotateY(45deg) translateZ(100px) }
.side2 { transform: rotateY(-45deg) translateZ(100px) }
.side3 { transform: rotateY(135deg) translateZ(100px) }
```

```js
addEventListener('scroll', () => {
```

### [Parallax Scroll Animation](https://codepen.io/procoderawais/pen/VYZYjLo)

on scroll: div.parallax-layer: transform+top ×4, div.card: transform+opacity+top ×2, header.header: opacity+top | on hover of div.card: div.card: transform+opacity | made with: transition · backdrop-filter · 3D (perspective / preserve-3d) · IntersectionObserver · scroll listener

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

### [Eigeen webseite](https://codepen.io/philcool/pen/KKOEbvo)

made with: position: fixed · transition · :hover

```css
section { border-top: 1px dashed #ff8bc5 }
section h2 { margin-bottom: 20px }
header { background-position: center; position: relative }
.header_text p { margin-bottom: 50px }
#header_button { transition: padding 0.5s }
#main_menu { position: fixed; top: 0 }
#angebote { border-top: 1px dashed #84c3ff }
.flex_list li { margin-bottom: 10px }
footer { border-top: 1px dashed #ff8bc5 }
.box { position: relative }
.grid_container { margin-top: 20px }
section { border-top: 1px dashed #ff8bc5 }
```

### [🕺 Disco Ball rotation on scroll (with JS)](https://codepen.io/cbolson/pen/YzmOwZJ)

held: fixed div.disco | made with: position: fixed · clip-path · backdrop-filter · scroll listener

```css
.disco { position: fixed; top: 0; translate: -25% -25%; clip-path: circle(50%) }
section { margin-bottom: 8rem }
```

```js
addEventListener('scroll', () => {
```

### [Slide in Text with Scroll CSS Only](https://codepen.io/66kesara99/pen/abeEgrr)

on scroll: p.slide-right: transform+top ×3, p.slide-left: transform+top ×2 | made with: scroll-driven animation (animation-timeline) · view() timeline · @keyframes

```css
.title { margin-top: 4rem }
.container { padding-top: 10rem; padding-bottom: 10rem }
.slide-left { animation: slideLeftAnimation both; animation-timeline: view() }
0% { transform: translateX(1000px) }
50% { transform: translateX(0px) }
.slide-right { animation: slideRightAnimation both; animation-timeline: view() }
0% { transform: translateX(-1000px) }
50% { transform: translateX(0px) }
@keyframes slideLeftAnimation animates transform
@keyframes slideRightAnimation animates transform
```

### [Blur with Scroll CSS Only](https://codepen.io/66kesara99/pen/eYqyayg)

on scroll: p.blur: filter+top ×4 | made with: scroll-driven animation (animation-timeline) · view() timeline · @keyframes

```css
.title { margin-top: 4rem }
.container { padding-top: 10rem; padding-bottom: 10rem }
.blur { animation: blurAnimation both; animation-timeline: view() }
0% { filter: blur(20px) }
45%, 55% { filter: blur(0px) }
100% { filter: blur(20px) }
@keyframes blurAnimation animates filter
```

### [Scroll-based animation](https://codepen.io/ponycorn/pen/vYoOJPO)

on scroll: section.section-1: background+top, div.scroll-text: transform+background+top, section.section-2: background+top | made with: transition · GSAP · ScrollTrigger

```css
section { position: relative; transition: background-color 0.1s linear }
.scroll-text { transition: transform 0.1s linear; will-change: transform }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to("#text1", {
gsap.to("#text2", {
gsap.to("#text3", {
gsap.to("#text4", {
```

### [Simple Animation on Scroll - Intersection Observer API](https://codepen.io/syahrizaldev/pen/KKOpgOo)

on scroll: div.content: transform+opacity+top | made with: transition · IntersectionObserver

```css
.header-title { text-transform: capitalize }
.content { position: relative }
.content-image { filter: grayscale(100) }
.content-title { position: absolute; text-transform: capitalize }
.content-left > .content-title { bottom: 9rem }
.content-right > .content-title { bottom: 9rem }
.animate { opacity: 0; transition: all 1.2s ease-out }
.animate.fade-up { transform: translate3d(0, 200px, 0) }
.animate.fade-down { transform: translate3d(0, -200px, 0) }
.animate.fade-right { transform: translate3d(200px, 0, 0) }
.animate.fade-left { transform: translate3d(-200px, 0, 0) }
.animate.visible { opacity: 1; transform: translate3d(0, 0, 0) }
```

```js
new IntersectionObserver(trigger, options)
```

### [Scroll driven indicator using animation-timeline](https://codepen.io/cbolson/pen/OJeaYgZ)

held: fixed nav, sticky h1 | on hover of li.: a.: color | made with: position: sticky · position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · transition · :hover

```css
html { scroll-padding-top: 90px; scroll-timeline: --page-scroll block; scroll-timeline: --page-scroll vertical }
nav { position: fixed; top: 0 }
nav > ul { position: relative; text-transform: capitalize }
nav > ul::before, nav > ul::after { position: absolute; top: 0 }
nav > ul::after { animation-name: progress-bar; animation-duration: 1ms; animation-timeline: --page-scroll }
nav a { transition: color 125ms ease-in-out }
from { top: 0 }
to { top: calc(100% - var(--_height)) }
main > h1 { position: sticky; top: 0 }
section { text-transform: capitalize }
@keyframes progress-bar animates top
```

### [Animate Scroll-In](https://codepen.io/el22or/pen/QWXOKpa)

made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @starting-style · @keyframes

```css
from { opacity: 0; scale: 0.75 }
to { opacity: 1; scale: 1 }
@starting-style { opacity: 0; scale: 0.75 }
@keyframes scroll-in animates opacity, scale
```

### [Sequential Animation](https://codepen.io/nathan-sr/pen/LYKyXjE)

on scroll: div.animated: background+shadow+top, span.icon: transform+top | made with: scroll-snap · @keyframes · transition · :hover · prefers-reduced-motion · IntersectionObserver

```css
> section { // scroll-snap-align: start; // scroll-snap-stop: always }
[data-animation] { animation: none }
&.animate { opacity: 1 }
.icon { transition: transform 0.3s ease }
.icon { transform: scale(1.1) }
&:nth-child(1) { animation-delay: 100ms }
&:nth-child(2) { animation-delay: 500ms }
&:nth-child(3) { animation-delay: 900ms }
&:nth-child(4) { animation-delay: 1300ms }
.text { transition: transform 0.3s ease }
.animated { animation-duration: 1s; animation-duration: var(--animate-duration); animation-fill-mode: both }
20% { -webkit-transform: rotate(15deg); transform: rotate(15deg) }
```

```js
new IntersectionObserver((entries) => {
```

### [Animate On Scroll (appear in)](https://codepen.io/Andrew-Neely-82/pen/qBzmYNr)

made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes

```css
from { opacity: 0; scale: 0 }
to { opacity: 1; scale: 1 }
from { opacity: 0; scale: 0 }
to { opacity: 1; scale: 1 }
.block { -webkit-animation: appear linear; animation: appear linear; animation-timeline: view(); animation-range: entry 0% cover 15% }
.block { box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset }
@keyframes appear animates opacity, scale
```

### [Dynamic Content Lockups V2 - Open Props](https://codepen.io/mobalti/pen/WNBZJdG)

held: fixed nav.navbar, sticky div.video-visual, sticky div.visual | on scroll: div.card: opacity+top ×3, div.video-visual: filter | on hover of a.nav-cta-btn: a.nav-cta-btn: color | made with: position: sticky · position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · :hover · prefers-reduced-motion · mix-blend-mode

```css
&::before { position: absolute; inset: 0; mix-blend-mode: screen }
&::before { mix-blend-mode: normal }
.video { position: relative }
.video-visual { position: sticky; filter: hue-rotate(210deg) }
.card { scale: 0.4 }
.card-1 { scale: 1 }
.card-2 { translate: -35cqi 30cqb; opacity: 0.3 }
.card-3 { translate: 0cqi 50cqb; opacity: 0.5 }
.card-4 { translate: 45cqi 40cqb; opacity: 0.5 }
.section { view-timeline-name: --section }
.content-1 { view-timeline-name: --content-1 }
.content-2 { view-timeline-name: --content-2 }
```

### [Easy Animate on scroll ( aos ) with animate.css 76 examples](https://codepen.io/nathan-sr/pen/KKYOype)

on scroll: div.aos-item: transform+top | made with: position: fixed

```css
.scroll-counter { position: fixed; top: 0 }
.aos-item::before { position: relative }
.aos-item { margin-bottom: 20px }
.aos-item { margin-bottom: 20px }
.aos-anchors__lines { position: fixed; top: 0; bottom: 0; border-top: 2px solid blue; border-bottom: 2px solid red }
.aos-anchors__lines::before { position: absolute; top: 0; bottom: 0 }
.aos-anchors__sidebar { position: fixed; top: 0 }
.aos-anchors__content > div { position: relative; margin-bottom: 50px }
.aos-anchors__content > div::before { position: absolute }
.aos-anchors__content > div::after { position: relative }
.aos-anchors__content > div[data-placement^="top-"]::before { top: 0 }
.aos-anchors__content > div[data-placement^="center-"]::before { top: 0; bottom: 0 }
```

### [Practical Card Animations Website](https://codepen.io/nathan-sr/pen/NWmQrrY)

held: fixed ul.navLinks | on hover of li.active: div.w3-center: transform ×3, div.w3-col: transform ×3, a.nav-link: background+color, div.w3-container: transform, div.w3-col: transform+shadow | made with: nothing recognised — read the code

### [Add remove Class on scroll](https://codepen.io/sunny_thakor/pen/dyLJVZm)

on scroll: div.text: opacity | made with: transition · clip-path · backdrop-filter · IntersectionObserver

```css
.investment_support .wrapper .item .item_wrap .head:before { position: relative; top: 3px; transition: all 0.4s ease-in-out }
.investment_support .wrapper .item { position: relative }
.investment_support .head h4 { text-transform: uppercase; position: absolute; transform: translate3d(0px, 0px, 0px); transition: all 0.4s ease-in-out }
.investment_support .wrapper .item:after { position: absolute; transition: all 0.4s ease-in-out }
.investment_support .wrapper .item:nth-child(1):after { top: 55%; transform: translate(50%, 0%) rotate(90deg) }
.investment_support .wrapper .item:nth-child(2):after { top: 100%; transform: translate(0%, 0%) rotate(0deg) }
.investment_support .wrapper .item:nth-child(3):after { top: 0%; transform: translate(0%, 0%) rotate(0deg) }
.investment_support .wrapper .item:nth-child(4):after { top: 45%; transform: translate(-50%, 0%) rotate(90deg) }
.investment_support .wrapper .item .item_wrap { transition: all 0.4s ease-in-out; backdrop-filter: blur(50px) }
.investment_support .wrapper .item .item_wrap:before { position: absolute; top: 0; bottom: 0; clip-path: polygon(4% 0, 100% 0, 100% 100%, 0 100%, 0 7%); opacity: 0 }
.investment_support .wrapper.active .item .item_wrap:before { opacity: 1 }
.investment_support .wrapper .item:nth-child(1) .head h4 { top: calc(100% - 60px) }
```

```js
new IntersectionObserver((entries, observer) => {
```

### [Onscroll Animation: Dynamic Content Scroll with ScrollMagic](https://codepen.io/yudizsolutions/pen/JjVbVgd)

held: fixed div | on scroll: span.: transform+opacity+top | made with: position: fixed · @keyframes · transition · :hover · Lenis / smooth scroll · scroll listener · requestAnimationFrame

```css
.overflow-hidden { position: fixed }
h1, h2, h3 { margin-bottom: 30px; text-transform: capitalize; -webkit-text-transform: capitalize; -webkit-text-transform: uppercase; text-transform: uppercase }
.pinWrapper { position: relative }
.scrollmagic-pin-spacer { position: absolute !important }
.event { position: relative; background-position: center center }
.event::before { position: absolute; top: 0 }
.image { top: 0%; position: absolute; background-position: center center; transition: width 1s, height 1s; -webkit-transition: width 1s, height 1s; box-shadow: 2px 2px 10px 10px rgb(0 0 0 / 12%); -webkit-box-shadow: 2px 2px 10px  }
.image:not(#loaderVideo) { top: -50%; position: absolute; transform: translate(0%, -50%); -webkit-transform: translate(0%, -50%) }
#section1 .image video { object-position: center center; position: absolute; top: 0 }
.text { top: -50%; position: absolute; transform: translate(100px, -50%); -webkit-transform: translate(100px, -50%) }
#section1 .text { top: 50% }
.scrollBtn { position: absolute; bottom: 2.5%; transform: translate(-50%, 0); -webkit-transform: translate(-50%, 0); transition: all ease-in-out 0.35s; -webkit-transition: all ease-in-out 0.35s }
```

```js
requestAnimationFrame(raf)
addEventListener('scroll', function () {
```

### [Content-aware collapsing menu using CSS scroll animations](https://codepen.io/giana/pen/gOEQmVW)

held: sticky label | on hover of li.: a.: color | made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · transition · :hover · :has()

```css
&::after { position: absolute; view-timeline: --trigger-view inline }
0%, 100% { opacity: 1 }
[for=toggle] { animation: hide-toggle; animation-timeline: --trigger-view }
.navigation-height-wrapper { animation: expand-toggle; animation-timeline: --trigger-view }
& .nav-list { opacity: 1 }
& .navigation-height-wrapper { transition: grid-template-rows 0.25s ease-in-out }
& p { margin-bottom: 0 }
&::before { position: absolute; view-timeline: --scrollport inline }
&::before { position: absolute; view-timeline: --scrollport inline }
.collapse-demo-5 { animation-name: collapse-demo; animation-timeline: --scrollport }
@keyframes navigation-styling animates background-color
@keyframes expand-navigation animates width, opacity, padding, visibility
```

### [CSS Only Scroll Animations](https://codepen.io/weboccult/pen/KKEVvrb)

made with: scroll-driven animation (animation-timeline) · view() timeline · animation-range · @keyframes · clip-path · 3D (perspective / preserve-3d)

```css
.img_container img, .tWrap img { object-position: center }
.anime_img { animation: img_key linear forwards; animation-timeline: view(block); animation-range: cover 0% cover 20% }
.top_img { position: relative }
.top_img img { position: absolute; animation: fade-out linear forwards; animation-timeline: view(); animation-range: exit; top: 0px }
section .tWrap { perspective: 1000px }
.box { animation: noTransformAnim linear forwards normal; animation-timeline: view(); transform: rotateX(40deg); opacity: 0 }
50% { transform: none; opacity: 1 }
100% { transform: none; opacity: 1 }
0% { clip-path: polygon(50% 0, 50% 0, 50% 100%, 50% 100%) }
100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%) }
100% { opacity: 0; scale: 1.5 }
@keyframes noTransformAnim animates transform, opacity
```

### [CSS scroll-driven animation timer](https://codepen.io/hexagoncircle/pen/dyrooOq)

held: fixed figure.component | made with: position: fixed · scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @keyframes

```css
.component { position: fixed; inset: 0 }
:is(.component, .timer-wrapper, .timer, .timer-hand, .timer-switch) { -webkit-animation-fill-mode: both; animation-fill-mode: both; -webkit-animation-timing-function: linear; animation-timing-function: linear; animation-timeline: scroll() }
.component { --plunge-offset: 10rem; -webkit-animation-name: progress; animation-name: progress; animation-range: 0 var(--plunge-start) }
.timer-wrapper { -webkit-animation-name: progress, turn-upright; animation-name: progress, turn-upright; animation-range: 0 var(--plunge-start), var(--plunge-start) var(--plunge-end) }
.timer { -webkit-animation-name: plunge; animation-name: plunge; animation-range: var(--plunge-start) var(--plunge-end) }
.timer-switch { -webkit-animation-name: plunge; animation-name: plunge; animation-range: var(--plunge-start) var(--plunge-end) }
.timer-hand { rotate: calc((var(--progress) / 100) * 360deg); -webkit-animation-name: progress; animation-name: progress; animation-range: 0 var(--plunge-start) }
from { rotate: -10deg }
to { rotate: 0 }
from { rotate: -10deg }
to { rotate: 0 }
50% { translate: 0 var(--plunge-depth) }
```

### [Open Props - Dynamic Content Lockups with Scroll-Driven Animations](https://codepen.io/mobalti/pen/Jjxqjxe)

held: sticky nav.Nav, fixed div.Visual, fixed div.SmallScreenContent, fixed div.pagination | on scroll: a.: background ×3, picture.SecondPic: transform+opacity+top, picture.ThirdPic: transform+opacity+top | made with: position: sticky · position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · backdrop-filter

```css
> a { box-shadow: var(--shadow-2) }
media (width >= 1024px) { position: sticky }
& img { object-position: center center }
> p { box-shadow: var(--shadow-1) }
> img { box-shadow: var(--shadow-4) }
> img { rotate: 8deg }
> img { rotate: -5deg }
> img { rotate: 20deg }
.FirstLockup { view-timeline-name: --first-lockup }
.SecondLockup { view-timeline-name: --second-lockup }
.ThirdLockup { view-timeline-name: --third-lockup }
> p { animation: auto reveal linear both; animation-range: cover 45% }
```

### [Scroll with light (CSS only)](https://codepen.io/gayane-gasparyan/pen/wvNXyYR)

on scroll: div.scrollbar: background+top | made with: scroll-driven animation (animation-timeline) · scroll() timeline · animation-range · @keyframes

```css
.scrollbar { animation: on-scrolling both linear; animation-timeline: scroll(); animation-range: 10vh }
.container { position: relative }
.container::before, .container::after { position: absolute; top: 0; animation: on-scrolling both linear; animation-timeline: scroll(); animation-range: 10vh }
.container::before { filter: blur(1px) }
.container::after { filter: blur(10px) }
main { margin-top: 40vh; padding-bottom: 40vh }
p { --text-offset-1: 10; --text-offset-2: 10; --text-offset-3: 10; --text-offset-4: 10; animation: on-scrolling both linear; animation-timeline: scroll(); animation-range: 10vh }
p:nth-child(1) { opacity: var(--opacity-1); transform: translateY(calc(var(--text-offset-1) * 1px)) }
p:nth-child(2) { opacity: var(--opacity-2); transform: translateY(calc(var(--text-offset-2) * 1px)) }
p:nth-child(3) { opacity: var(--opacity-3); transform: translateY(calc(var(--text-offset-3) * 1px)) }
p:nth-child(4) { opacity: var(--opacity-4); transform: translateY(calc(var(--text-offset-4) * 1px)) }
0% { --scroll-y-position: -10%; --reflection-y-position: -22% }
```

### [Open Props - Landing Page with Scroll-Driven Animations](https://codepen.io/mobalti/pen/rNPvMPB)

held: sticky nav.Navbar | on scroll: a.NavLink: color ×2 | made with: position: sticky · position: fixed · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · view transitions · @keyframes · transition · :hover · :has() · prefers-reduced-motion · IntersectionObserver · scroll listener

```css
:root { view-transition-name: none }
> header { border-bottom: var(--border-size-2) solid var(--text-1) }
& h1 { text-transform: uppercase }
& h2 { text-transform: uppercase }
> img { animation: fade-overlay linear both; animation-timeline: --showcase; animation-range: 20% 40% }
.schedule { animation: to-white linear both; animation-timeline: view(); animation-range-start: 4%; animation-range-end: 10% }
.cards { animation: to-brand linear both; animation-timeline: view(); animation-range-start: 4%; animation-range-end: 16% }
.about { animation: to-black linear both; animation-timeline: view(); animation-range-start: 4%; animation-range-end: 16% }
to { scale: 3.5; opacity: 0 }
.subject { opacity: 0 }
.reveal-up { animation: fade-in 660ms ease forwards, slide-up 1000ms cubic-bezier(0, 0, 0.1, 1) forwards }
.reveal-down { animation: fade-in 660ms ease forwards, slide-down 1000ms cubic-bezier(0, 0, 0.1, 1) forwards }
```

```js
startViewTransition(() => updateDom())
addEventListener( 'scroll',
new IntersectionObserver(
```

### [CSS scroll animations exploration](https://codepen.io/andrewrock/pen/NWoRavN)

held: sticky header, sticky div.horizontal-section-wrapper | on scroll: div.progress: transform+top ×2, span.headline: transform ×2, ul.: transform+top, li.: filter+top | made with: position: sticky · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · transition · :has() · clip-path · backdrop-filter · mix-blend-mode · 3D (perspective / preserve-3d) · container queries

```css
:root { --flip-in-start-perspective: 25rem; --flip-in-middle-perspective: 25rem; --flip-in-end-perspective: 25rem; --flip-in-start-rotate: 90deg; --flip-in-middle-rotate: -20deg; --flip-in-end-rotate: 0deg; --flip-out-start-pers }
main { animation: opacity linear forwards; animation-range: entry 296vh exit 301vh; animation-timeline: scroll(); margin-top: 200vh; opacity: var(--opacity-start); position: relative }
section { position: relative }
.progress { position: absolute }
.progress.vertical { top: 0 }
.year { animation: rubber-band linear forwards, rubber-band linear forwards, rubber-band linear forwards, rotate-scale linear forwards; animation-range: entry 120vh exit 150vh, entry 170vh exit 210vh, entry 260vh exit 290vh, ent }
header { animation: position-switch linear forwards; animation-range: contain 295vh contain 300vh; animation-timeline: scroll(root); position: sticky; top: 0 }
header::before { animation: opacity linear forwards; animation-range: entry 280vh exit 290vh; animation-timeline: scroll(); position: absolute; top: 0; filter: drop-shadow(0rem 0.0625rem 0rem var(--blue)) drop-shadow(0rem -0.0625rem 0rem }
header::after { animation: opacity linear forwards; animation-range: contain 280vh contain 285vh; animation-timeline: scroll(); background-position: var(--dots-position); inset: 0; mix-blend-mode: multiply; opacity: 0.2; position: absol }
header .progress { animation: grow-progress linear forwards; animation-range: entry 60vh cover 66vh; animation-timeline: scroll(); filter: blur(0.0625rem) brightness(0.5); mix-blend-mode: color-burn; top: var(--top-amount); transform: scal }
header .subtitle + .subtitle { margin-top: var(--margin-top-amount) }
header h1 { animation: flip-out-x linear forwards, opacity linear forwards; animation-range: entry 120vh exit 130vh, entry 128vh cover 130vh; animation-timeline: scroll() }
```

### [Progressively Enhanced Curved CSS Gallery](https://codepen.io/fimion/pen/YzBWzaQ)

made with: scroll-driven animation (animation-timeline) · view() timeline · @keyframes · transition · :hover · 3D (perspective / preserve-3d) · custom properties driven by JS · scroll listener

```css
.curved-grid { perspective: calc(var(--x) * 1vw); animation: animate-perspective-origin linear 2s; animation-play-state: paused; animation-delay: calc(var(--scroll, 0) * -1s); animation-iteration-count: 1; animation-fill-mode: both }
.curved-grid { animation: animate-perspective-origin-timeline linear 2s; animation-play-state: revert; animation-timeline: view() }
.curved-grid li { transition: transform 0.5s ease-in-out; transform: translatez(var(--translatez)) rotatey(var(--angle)) }
.curved-grid li:hover { transform: none }
@keyframes animate-perspective-origin animates perspective-origin
@keyframes animate-perspective-origin-timeline animates perspective-origin
```

```js
addEventListener( "scroll",
style.setProperty( "--scroll",
```

### [Scroll reveal animation GSAP](https://codepen.io/jonybekov/pen/LYqGWwK)

held: sticky div.overlay | on scroll: div.text-inner: transform, div.rotate: transform+top | made with: position: sticky · mix-blend-mode · custom properties driven by JS · GSAP · scroll listener

```css
.overlay { position: sticky; top: 0 }
.text { position: absolute; top: 0; bottom: 0 }
.text-inner { transform: translatex(50vw) }
.gradient { position: absolute; top: 0%; bottom: 0% }
.shape { mix-blend-mode: multiply }
.shape .img { transform: rotate(45deg) }
```

```js
gsap.timeline({ paused: true })
addEventListener( "scroll",
style.setProperty( "--scroll",
```

### [Scrolling Animation](https://codepen.io/Diana-Moretti/pen/dywLZam)

on scroll: div.content-list: transform+top | made with: @keyframes

```css
.content-para { position: absolute; top: 0 }
.content-list { position: relative; top: 0; animation-name: scroll; animation-duration: 8s; animation-delay: 2s; animation-iteration-count: infinite; animation-direction: alternate }
.content-item { margin-bottom: 1rem }
0% { transform: translate3d(0, 0, 0) }
25% { transform: translate3d(0, -25%, 0) }
50% { transform: translate3d(0, -50%, 0) }
75% { transform: translate3d(0, -25%, 0) }
100% { transform: translate3d(0, 0, 0) }
@keyframes scroll animates transform
```

### [f8](https://codepen.io/opxamx/pen/RwEqQpJ)

made with: scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · scroll-snap · @keyframes · transition · :hover · 3D (perspective / preserve-3d)

```css
.controls { position: absolute }
& button { position: center }
> * { scroll-snap-align: center }
& img { view-timeline-axis: inline; perspective: var(1--size) }
.pagination > button { animation: scale linear both }
.next { animation: auto next ease; animation-timeline: --carousel }
.previous { animation: auto prev ease; animation-timeline: --carousel }
0%, 100% { scale: 0.65 }
100% { scale: 1 }
@keyframes scale animates scale, background-color
@keyframes prev animates visibility
@keyframes next animates visibility
```

### [Social Media Carousel with Scroll-Driven Animations](https://codepen.io/mobalti/pen/GRPMpyj)

made with: scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · scroll-snap · @keyframes · transition · :hover · 3D (perspective / preserve-3d)

```css
.controls { position: absolute }
> * { scroll-snap-align: center }
& img { view-timeline-axis: inline; perspective: var(--size) }
.pagination > button { animation: scale linear both }
.next { animation: auto next ease; animation-timeline: --carousel }
.previous { animation: auto prev ease; animation-timeline: --carousel }
0%, 100% { scale: 0.75 }
50% { scale: 1 }
@keyframes scale animates scale, background-color
@keyframes prev animates visibility
@keyframes next animates visibility
```

### [Scroll-based 3D cards](https://codepen.io/nelsonleite/pen/PoXzoKZ)

made with: scroll-driven animation (animation-timeline) · scroll() timeline · @keyframes · 3D (perspective / preserve-3d)

```css
from { transform: rotateY(8deg) }
to { transform: rotateY(-8deg) }
.carousel-wrap { perspective: 600px }
.carousel { scroll-timeline: --carousel-scroll inline; animation: anim-rotate auto linear; animation-timeline: --carousel-scroll }
.card { box-shadow: var(--shadow-x) 5px 0px 2px rgba(0, 0, 0, 0.75); animation: anim-shadow auto linear; animation-timeline: --carousel-scroll }
@keyframes anim-rotate animates transform
@keyframes anim-shadow animates --shadow-x
```

### [GSAP On-Scroll Walking Cycle](https://codepen.io/ksenia-k/pen/wvQeOVg)

held: fixed div.content, fixed div.animation-container | on scroll: g.[object: transform+top ×4, path.[object: transform+top ×3, path.[object: transform ×2, div.content: transform, p.arrow-animated: transform+top, g.[object: transform | on hover of a.: p.arrow-animated: transform+top | made with: position: fixed · @keyframes · GSAP · ScrollTrigger

```css
.animation-container { position: fixed; bottom: 0 }
.content { position: fixed; top: 0 }
.content-section > div { margin-top: -10vh }
.arrow-animated { animation: arrow-float 1s infinite }
0% { transform: translateY(0); animation-timing-function: ease-out }
60% { transform: translateY(50%); animation-timing-function: ease-in-out }
100% { transform: translateY(0); animation-timing-function: ease-out }
@keyframes arrow-float animates transform, animation-timing-function
```

```js
gsap.timeline({
scrollTrigger: { trigger: ".page", scrub: true, start: "0% 0%", end: "100% 100%", }
gsap.timeline({})
```

### [GSAP Infinite Scroll Animation](https://codepen.io/flexcode/pen/poxVRpN)

held: fixed section.first, fixed section.second, fixed section.third, fixed section.fourth, fixed section.fifth | on scroll: div.: transform+opacity+top ×23, div.bg: transform+top ×2, div.outer: transform+top, div.inner: transform | on hover of a.: div.: transform+opacity ×3, div.: transform ×2 | made with: position: fixed · GSAP

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

### [Venuelocity+MotionPath](https://codepen.io/jodadevcol/pen/PodeEwX)

made with: position: sticky · position: fixed · scroll-snap · @keyframes · transition · :hover · :focus-visible · clip-path · 3D (perspective / preserve-3d) · Lenis / smooth scroll · IntersectionObserver · scroll listener · pointer / mouse tracking · requestAnimationFrame

```css
.swiper,swiper-container { position: relative }
.swiper-wrapper { position: relative; transition-property: transform }
.swiper-android .swiper-slide,.swiper-wrapper { transform: translate3d(0px,0,0) }
.swiper-slide,swiper-slide { position: relative; transition-property: transform }
.swiper-backface-hidden .swiper-slide { transform: translateZ(0) }
.swiper-3d.swiper-css-mode .swiper-wrapper { perspective: 1200px }
.swiper-3d { perspective: 1200px }
.swiper-3d .swiper-slide-shadow,.swiper-3d .swiper-slide-shadow-bottom,.swiper-3 { position: absolute; top: 0 }
.swiper-css-mode>.swiper-wrapper>.swiper-slide { scroll-snap-align: start start }
.swiper-horizontal.swiper-css-mode>.swiper-wrapper { scroll-snap-type: x mandatory }
.swiper-vertical.swiper-css-mode>.swiper-wrapper { scroll-snap-type: y mandatory }
.swiper-centered>.swiper-wrapper>.swiper-slide { scroll-snap-align: center center; scroll-snap-stop:always }
```

```js
addEventListener("wheel", this._onWheel, this.listenerOptions),
requestAnimationFrame(t) : void 0
requestAnimationFrame(t))
addEventListener("mousemove", (function(e) {
addEventListener("scroll", this.onScroll),
requestAnimationFrame((function e(t) {
requestAnimationFrame(e)
addEventListener("scroll", (function() {
```

### [Banner animation on scroll (paper plane)](https://codepen.io/yudizsolutions/pen/PodRRyx)

on hover of img.paper-plane: div.plane-wrapper: transform+top, img.paper-plane: transform+top | made with: scroll() timeline

```css
.animation { position: relative }
.plane-wrapper { position: absolute; top: 50% }
.plane-wrapper-2 { position: absolute; top: 50% }
.plane-wrapper-2 .paper-plane { transform: scaleY(-1) }
.content-two { position: relative }
.content-two h2 { text-transform: uppercase }
.scrolling_up img { transform: scaleX(-1) }
.plane-wrapper-2.scrolling_up img { transform: scaleX(-1) scaleY(-1) }
.animation-pun { position: relative }
.animation-pun h2 { text-transform: uppercase; position: relative }
```

### [Banner animation on scroll (paper plane)](https://codepen.io/abhiishek-10/pen/OJoMPmZ)

on scroll: div.plane-wrapper: transform+top | made with: scroll() timeline

```css
.animation { position: relative }
.plane-wrapper { position: absolute; top: 50% }
.plane-wrapper-2 { position: absolute; top: 50% }
.plane-wrapper-2 .paper-plane { transform: scaleY(-1) }
.content-two { position: relative }
.content-two h2 { text-transform: uppercase }
.scrolling_up img { transform: scaleX(-1) }
.plane-wrapper-2.scrolling_up img { transform: scaleX(-1) scaleY(-1) }
.animation-pun { position: relative }
.animation-pun h2 { text-transform: uppercase; position: relative }
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

### [Scroll-animation Jquery](https://codepen.io/Saini-deepak/pen/WNJzypj)

made with: view() timeline · transition · :hover

```css
.main-container { position: relative }
.container { position: relative }
.animation-element { position: relative }
.bounce-up .subject { -moz-transition: all 1000ms ease-out; -webkit-transition: all 1000ms ease-out; -o-transition: all 1000ms ease-out; transition: all 1000ms ease-out; -moz-transform: translate3d(0px, 100px, 0px); -webkit-transform: transla }
.bounce-up.in-view .subject { opacity: 1; -moz-transform: translate3d(0px, 0px, 0px); -webkit-transform: translate3d(0px, 0px, 0px); -o-transform: translate(0px, 0px); -ms-transform: translate(0px, 0px); transform: translate3d(0px, 0px, 0px) }
.subject.development { box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2) }
.subject.development:hover { transform: translateY(-10px) }
.subject .header .date, .subject .header .category { margin-bottom: 10px }
```

### [JS: Scroll Animation using Intersection Observer API](https://codepen.io/iamsaief/pen/qBYPdGx)

made with: scroll-snap · @keyframes · transition · :hover · prefers-reduced-motion · IntersectionObserver

```css
main { scroll-snap-type: y mandatory }
main > section { scroll-snap-align: start; scroll-snap-stop: always }
[data-animation] { animation: none }
.animation-group { margin-top: 30px }
.animation-group [data-animation] { box-shadow: inset 2px 2px 2px #232323; opacity: 0 }
.animation-group [data-animation].animate { opacity: 1 }
.animation-group [data-animation] .icon { transition: transform 0.3s ease }
.animation-group [data-animation]:hover { box-shadow: 0 4px 25px rgba(189, 50, 255, 0.25), inset 2px 2px 2px #393939 }
.animation-group [data-animation]:hover .icon { transform: scale(1.1) }
.animation-group [data-animation]:nth-child(1) { animation-delay: 100ms }
.animation-group [data-animation]:nth-child(2) { animation-delay: 500ms }
.animation-group [data-animation]:nth-child(3) { animation-delay: 900ms }
```

```js
new IntersectionObserver((entries) => {
```

### [Animated On Scroll! Vanilla JS](https://codepen.io/SkyeGideon/pen/LYmxZqj)

held: fixed div.say-hello, fixed div.togit | on scroll: section.hidden: opacity+filter+top ×3, h1.hidden: opacity+filter+top ×2, p.hidden: opacity+filter+top ×2, div.logos: opacity+filter+shadow+top, div.logo: opacity+filter+top | on hover of img.: div.logo: opacity ×4, h1.hidden: opacity | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · IntersectionObserver

```css
.h1, .say-hello h1 { text-transform: uppercase }
section { margin-bottom: 10% }
a { transition: all 1s }
.footer:hover a { text-transform: uppercase }
.hidden { opacity: 0; filter: blur(5px); translate: -100% 0; transition: all 1s }
.show { opacity: 1; filter: blur(0); translate: 0 0 }
.shadow { box-shadow: 0 30px 70px cyan; transition: box-shadow 700ms ease 500ms }
.logo img { transition: all 1s; filter: saturate(120%) }
.say-hello { position: fixed; top: 0; text-transform: uppercase; backdrop-filter: blur(12px); transition: all 1s }
.logos h1 { position: absolute; top: -30px }
.logo img { transition: all 1s }
.togit { position: fixed; bottom: 3em; box-shadow: -3px -3px 5px #00105b, 5px 5px 5px #000; transition: all 400ms ease; filter: brightness(120%); translate: 0 100px; animation: show-git 3s 1s cubic-bezier(0.22, 0.61, 0.26, 0.74)  }
```

```js
new IntersectionObserver((entries) => {
```

### [Scroll Transition](https://codepen.io/amithjayapraban/pen/JjvYoQJ)

on scroll: div.reveal: transform+opacity+top | made with: transition · scroll listener

```css
.reveal.active { transform: translateX(0); opacity: 1 }
.reveal { position: relative; transform: translateX(-150px); opacity: 0; transition: .5s all ease }
```

```js
addEventListener("scroll", show)
```

### [Create an Awesome Scroll-based HTML5 Video](https://codepen.io/Richard121/pen/abYzMWY)

held: sticky div.content, sticky div.content, sticky div.content, sticky div.content, sticky div.content, fixed video | made with: position: sticky · position: fixed · @keyframes · GSAP · requestAnimationFrame

```css
#v0 { position: fixed; bottom: 0 }
section { position: relative }
.content { position: sticky; position: -webkit-sticky; top: 33.3% }
.entered { -webkit-animation: text-focus-in 1s cubic-bezier(0.55, 0.085, 0.68, 0.53) both; animation: text-focus-in 1s cubic-bezier(0.55, 0.085, 0.68, 0.53) both }
0% { -webkit-filter: blur(12px); filter: blur(12px); opacity: 0 }
100% { -webkit-filter: blur(0px); filter: blur(0px); opacity: 1 }
0% { -webkit-filter: blur(12px); filter: blur(12px); opacity: 0 }
100% { -webkit-filter: blur(0px); filter: blur(0px); opacity: 1 }
@keyframes text-focus-in animates -webkit-filter, filter, opacity
```

```js
requestAnimationFrame(scrollPlay)
```

### [ScrollMagic - Basic](https://codepen.io/anushkachauhan/pen/RwQXQZz)

made with: transition

```css
.scroll { opacity: 0; transition: 0.5s }
.scroll.show { opacity: 1 }
```

### [CSS transition animations](https://codepen.io/OfekNakar/pen/Vwrorxy)

held: fixed div | made with: position: fixed

```css
.section { position: relative }
.card_text { opacity: 0; top: 25%; position: absolute; transform:rotate(180deg) }
.card_text { opacity: 0; top: 15%; position: absolute; transform:rotate(180deg) }
```

### [Image scrolling effect](https://codepen.io/sandeshsapkota/pen/RwjaGby)

held: fixed div.animating__circle, fixed div.animating__circle, fixed div.animating__circle, fixed a.link, fixed a.link, fixed a.link, fixed a.link, fixed div.scroll | on scroll: div.animating__circle: transform+top ×3, div.scroll: transform+opacity+top | on hover of a.link: div.animating__circle: transform+top ×3 | made with: position: fixed · @keyframes · transition · :hover · pointer / mouse tracking

```css
.animating__circle { position: fixed; top: -75% }
.animating__circle--one { animation: animateOne 50s linear infinite alternate }
.animating__circle--two { top: -25%; animation: animateTwo 50s linear infinite alternate }
.animating__circle--three { top: -40%; animation: animateThree 50s linear infinite alternate }
from { transform: translateX(0) }
to { transform: translateX(-200px) translateY(-400px) rotate(-360deg) }
from { transform: translateX(0) }
to { transform: translateX(500px) translateY(200px) }
from { transform: translateX(0) }
to { transform: translateX(-600px) translateY(-600px) rotate(-360deg) scale(0.9) }
.pos-center { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.transition-3s { transition: 0.3s all }
```

```js
addEventListener("mousemove", handleMagnetCursor)
```

### [Build a burger with ScrollTrigger](https://codepen.io/afa34/pen/abyRxGR)

made with: transition · GSAP

```css
html::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3) }
html::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3) }
.hamburger-wrapper { position: relative }
.hamburger { position: relative }
.hamburger div { position: relative; transition: all 0.65s }
.hamburger .sesame { position: absolute; top: 5%; box-shadow: 19px 2px rgba(255, 255, 175, 0.73), -25px 5px rgba(255, 255, 175, 0.73), 65px 5px rgba(255, 255, 175, 0.73), -55px 8px rgba(255, 255, 175, 0.73), 50px 15px rgba(255, 255, 175, 0.7 }
.hamburger .bread-top { box-shadow: inset -1px -1px 6px 1px #a54c04 }
.hamburger .tomato { box-shadow: inset -2px -2px 1px 0 #c90909 }
.hamburger .cheese { position: relative }
.hamburger .cheese::before { position: absolute; bottom: 0; transform: translate(0, 65%) }
.hamburger .cheese .cheese-melt { position: absolute; bottom: 0; transform: translate(0, 100%) }
.hamburger .lettuce { position: relative; box-shadow: 0px -1px 1px 2px #158311 }
```

```js
gsap.timeline({
scrollTrigger: { trigger: ".hamburger", start: "top center", // end: "bottom top", end: "+=350%", scrub: true, pin: true // markers: true }
```

### [Justified Scroll Animation](https://codepen.io/ykadosh/pen/MWmGbVG)

made with: custom properties driven by JS

```css
.column { transform: translateY(calc(var(--scrollable-scroll-top) * var(--gap))) }
.box { background-position: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) }
```

```js
style.setProperty('--col-height', height + 'px')
style.setProperty('--height', height + 'px')
```

### [Crossing on scroll](https://codepen.io/OfekNakar/pen/dyvJXXM)

on scroll: div.text0: transform+top, div.text1: transform+top, div.text2: transform+top, div.text3: transform+top | made with: GSAP

```css
#text { position:relative; top:200px }
#dummy { position:relative }
#back { position:relative; padding-top:50% }
#text { top:70px }
```

```js
gsap.to('.text0',{
scrollTrigger:{ trigger:'.text0', scrub:true, start:'top 20%' }
gsap.to('.text2',{
scrollTrigger:{ trigger:'.text2', scrub:true, start:'top 40%' }
gsap.to('.text1',{
scrollTrigger:{ trigger:'.text1', scrub:true, start:'top 30%' }
gsap.to('.text3',{
scrollTrigger:{ trigger:'.text3', scrub:true, start:'top 40%' }
```

### [Scroll Animation](https://codepen.io/YuriDevAT/pen/WNRprYO)

on scroll: div.box: transform+top ×3 | made with: transition · scroll listener

```css
.box { box-shadow: 2px 4px 5px rgba(0,0,0,0.3); transform: translateX(200%); transition: transform 0.4s ease-in }
.box:nth-of-type(even) { transform: translateX(-200%) }
.box.show { transform: translateX(0) }
```

```js
addEventListener('scroll', checkBoxes)
```

### [Scroll Animation](https://codepen.io/kostastepetes/pen/jOVxXYg)

on scroll: div.box: transform+top ×3 | made with: transition · scroll listener

```css
.box { box-shadow: 2px 4px 5px rgba(0, 0, 0, 0.3); transform: translateX(400%); transition: transform 0.4s ease }
.box:nth-of-type(even) { transform: translateX(-400%) }
.box.show { transform: translateX(0) }
```

```js
addEventListener("scroll", checkBoxes)
```

### [Animated-Scroll-Icon](https://codepen.io/skalar/pen/oNzjbbJ)

on scroll: path.[object: transform+top ×2 | made with: @keyframes

```css
.scrl-body { animation: scroll-parallax 1.5s cubic-bezier(.41,.07,.83,.67) infinite running }
25% { transform:translateY(0) }
75% { transform:translateY(-20%) }
.scrl-wheel { transform-origin:bottom; animation: scroll-animation 1.5s linear infinite running; will-change:transform }
0% { transform: translateY(-90%) scale(0.7, 0.1) }
10% { transform: translateY(-90%) scaleY(0.3) }
25% { transform: translateY(-20%) scaleY(1) }
75% { transform: translateY(40%) scaleY(1) }
100% { transform: translateY(20%) scale(0.8, 0.1) }
@keyframes scroll-parallax animates transform
@keyframes scroll-animation animates transform
```

### [Intersection Observer API](https://codepen.io/jemin/pen/XWXrQvJ)

made with: @keyframes · IntersectionObserver

```css
.box { border-bottom: 2px solid rgba(255, 255, 255, 0.1); padding-top: 125px }
.box p { opacity: 0 }
.bounce-me { opacity: 1 !important; animation: bounce-in-top 1s both }
0% { -webkit-transform: translateY(-500px); transform: translateY(-500px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in; opacity: 0 }
38% { -webkit-transform: translateY(0); transform: translateY(0); -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out; opacity: 1 }
55% { -webkit-transform: translateY(-65px); transform: translateY(-65px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in }
72% { -webkit-transform: translateY(0); transform: translateY(0); -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out }
81% { -webkit-transform: translateY(-28px); transform: translateY(-28px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in }
90% { -webkit-transform: translateY(0); transform: translateY(0); -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out }
95% { -webkit-transform: translateY(-8px); transform: translateY(-8px); -webkit-animation-timing-function: ease-in; animation-timing-function: ease-in }
100% { -webkit-transform: translateY(0); transform: translateY(0); -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out }
@keyframes bounce-in-top animates -webkit-transform, transform, -webkit-animation-timing-function, animation-timing-function, opacity
```

```js
new IntersectionObserver(
```

### [Intersection Observer Example](https://codepen.io/knyttneve/pen/eYpeJeb)

made with: transition · IntersectionObserver

```css
section { transition: 0.3s; position: relative }
img { transition: 0.3s; margin-top: 25vh; -o-object-position: center; object-position: center; box-shadow: 0 40px 100px rgba(0, 0, 0, 0.4); opacity: 0 }
.animate { opacity: 1 }
```

```js
new IntersectionObserver(
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

### [Scroll Path](https://codepen.io/paolopersia/pen/MWwMREX)

held: fixed div | made with: position: fixed

```css
h1 { margin-bottom: 0px }
.container { position: relative }
#fixed_path { position: fixed; top: 0px }
```

### [Content Animation With Scroll](https://codepen.io/sanjitbrwnsmith/pen/PowJweX)

on scroll: h1.: opacity+top | made with: transition

```css
h1 { position: absolute; top:100vh; opacity: 0; transition: 1s; box-shadow: 0px 0px rgba(255, 255, 255, 0.2) }
h2 { box-shadow: 0px 0px rgba(255, 255, 255, 0.2); position: absolute; top:200vh; opacity: 0; transition: all 1s ease-out }
.left { transition: all 1s ease-out; box-shadow: 0px 0px 30 rgba(255, 255, 255, 0.2) }
.right { transition: all 1s ease-out; box-shadow: 0px 0px 30 rgba(255, 255, 255, 0.2) }
```

### [My simple one page website](https://codepen.io/blaustern_fotografie/pen/OJJvbzb)

held: fixed ul | made with: position: fixed · transition · :hover

```css
section { border-top: 1px dashed #ff8bc5 }
section h2 { margin-bottom: 20px }
header { background-position: center; position: relative }
.header_text p { margin-bottom: 50px }
#header_button { transition: padding 0.5s }
#main_menu { position: fixed; top: 0 }
#angebote { border-top: 1px dashed #84c3ff }
.flex_list li { margin-bottom: 10px }
footer { border-top: 1px dashed #ff8bc5 }
.box { position: relative }
.grid_container { margin-top: 20px }
section { border-top: 1px dashed #ff8bc5 }
```

### [Scroll Animations (pageYOffset)](https://codepen.io/MJ-Media/pen/jONMyLK)

held: fixed div | on scroll: div.intro-img: transform+top, div.intro-txt: transform+top, div.small-block-one: transform+opacity+top, div.small-block-two: transform+opacity+top | on hover of img.: h1.txt: transform | made with: position: fixed · transition · scroll listener

```css
#count { position: fixed; top: 50px; transform: translateX(-50%) }
#count:before { position: absolute; bottom: 100%; transform: translateX(-50%) }
.container { margin-bottom: 5rem }
.container .intro-img { position: relative; transition: all 0.3s ease; transform: translateX(-400px) scale(0) }
.container .intro-img img { position: absolute }
.container .animates { transform: translateX(0) scale(1) }
.container .intro-txt { transform: translateX(1100px); transition: all 1.5s ease }
.container .animates { transform: translateX(0) }
.two .blocks-cover { margin-top: 3em }
.two .blocks-cover .small-block-one { position: relative; transition: all 1s ease; opacity: 0 }
.two .blocks-cover .small-block-one img { position: absolute }
.two .blocks-cover .animates { opacity: 1 }
```

```js
addEventListener('scroll', () => {
```

### [Smooth Section Auto-Scroll with jQuery](https://codepen.io/azamat-design/pen/xxKwPYX)

made with: Web Animations API (.animate)

```js
.animate({
```

### [scroll animation with CSS — week 32/52](https://codepen.io/knyttneve/pen/oKELoP)

held: sticky span.c1, sticky span.c2, sticky span.c3, sticky span.c4, sticky span.c5, sticky span.c6, sticky span.c7, sticky span.c8, sticky a, fixed a.scroll | made with: position: sticky · position: fixed · mix-blend-mode

```css
.bg { position: absolute; top: -50vw; filter: blur(120px) }
span { position: sticky; top: calc(50% - 50px); mix-blend-mode: overlay }
.c2 { margin-top: 100vw }
.c3 { margin-top: 200vw }
.c4 { margin-top: 300vw }
.c5 { margin-top: 400vw }
.c6 { margin-top: 500vw }
.c7 { margin-top: 600vw }
.c8 { margin-top: 700vw }
a { position: sticky; bottom: -80px; mix-blend-mode: overlay }
.scroll { position: fixed; bottom: 0 }
```

### [Follow scroll line](https://codepen.io/taimursaeed/pen/ordRQJ)

made with: scroll listener

```js
addEventListener("scroll", function (e) {
```

### [React back to top](https://codepen.io/AdamMorsi/pen/OeZxQP)

held: fixed button.back-to-top | on scroll: button.back-to-top: opacity | made with: position: fixed · transition · scroll listener · requestAnimationFrame

```css
h1 { margin-bottom: 20px }
.back-to-top { position: fixed; bottom: 30px; opacity: 0; transition: background-color 0.3s, opacity 0.4s, visibility 0.4s }
.back-to-top.show-back-to-top { opacity: 1 }
```

```js
addEventListener('scroll', showHideScrollBtn)
requestAnimationFrame(animate)
```

### [Text fade on scroll](https://codepen.io/KamilDyrek/pen/bPqeXK)

held: sticky div.text-wrapper, sticky div.text-wrapper, sticky div.text-wrapper, sticky div.text-wrapper, sticky div.text-wrapper, sticky div.text-wrapper, sticky div.text-wrapper | made with: position: sticky

```css
body { position: relative }
section:first-child { margin-top: 30vh }
.text-wrapper { position: sticky; top: 6rem }
```

### [React ScrollSpy (functional component)](https://codepen.io/AdamMorsi/pen/vwOGyg)

held: fixed header.sidebar | made with: position: fixed · transition · :hover · scroll listener · requestAnimationFrame

```css
.link:hover { opacity: 0.7 }
.sidebar { position: fixed; transition: all 0.3s ease-in-out }
.sidebar a:hover { opacity: 0.7 }
.sidebar a.active:hover { opacity: 1 }
```

```js
requestAnimationFrame(animate)
addEventListener('scroll', debounceScroll)
```

### [Scroll Progress Bar](https://codepen.io/marhdev/pen/vMPKxd)

held: fixed div.scroll-progress, fixed div.scroll-down | made with: position: fixed · transition · scroll listener

```css
.scroll-progress { position: fixed; top: 0 }
.scroll-progress__bar { position: absolute; top: 0; bottom: 0; transition: width 0.05s linear }
.scroll-down { position: fixed; top: 15px; box-shadow: 0px 2px 10px -5px #6a6a6a }
```

```js
addEventListener("scroll", updateProgress)
```

### [CSS/JS Fadeout scroll animation](https://codepen.io/elwinvdhazel/pen/rbPbVG)

held: fixed nav.nav-main, fixed header.header-main, sticky nav.nav-tags, sticky li.list__item, sticky header.list__item-header | on scroll: div.container: transform+opacity+top | made with: position: sticky · position: fixed · backdrop-filter · 3D (perspective / preserve-3d) · scroll listener

```css
.nav-main { position: fixed; top: 0; box-shadow: 0 0 2rem rgba(0, 0, 0, 0.1) }
.nav-tags { position: sticky; top: 4rem }
.nav-tags__item { -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px) }
.header-main { position: fixed; top: 4rem; perspective: 100px }
.main { position: relative }
.list__item { background-position: center center; margin-bottom: 1rem }
.list__item:first-child { position: sticky; top: 8rem; margin-bottom: 0 }
.list__item:first-child .list__item-header { position: sticky; bottom: 0 }
.list__item:nth-child(2) { margin-top: calc(-100vh + 9rem) }
.list__item:last-child { margin-bottom: 0 }
```

```js
addEventListener("scroll", updateHeader)
```

### [css scroll snap + scroll reveal js](https://codepen.io/loganliffick/pen/xezrKo)

on scroll: div.slide-up: transform+opacity+top ×2, div.animation: transform+shadow+top | made with: scroll-snap · transition · :hover

```css
html,body { scroll-snap-type: y mandatory }
section { scroll-snap-align: start }
.animation { transition: 0.5s ease }
.animation:hover { box-shadow: 0 15px 25px -25px #1F1F46; transform: translateY(-8px) }
```

### [css scroll snap](https://codepen.io/loganliffick/pen/VNyWvx)

on scroll: div.aos-init: transform+opacity+top ×2 | made with: scroll-snap

```css
html,body { scroll-snap-type: y mandatory }
section { scroll-snap-align: start }
```

### [Simple scroll reveal with jQuery & animejs](https://codepen.io/hmongouachon/pen/XQRojd)

on scroll: div.media--wrapper: transform+opacity+top, p.scroll-anime-translateY: transform+opacity+top | made with: view() timeline · anime.js

```css
.scroll-anime-translateY { -moz-transform: translateY(100px); -o-transform: translateY(100px); -ms-transform: translateY(100px); -webkit-transform: translateY(100px); transform: translateY(100px); opacity: 0 }
.scroll-anime-translateX-left { -moz-transform: translateX(-100px); -o-transform: translateX(-100px); -ms-transform: translateX(-100px); -webkit-transform: translateX(-100px); transform: translateX(-100px); opacity: 0 }
.scroll-anime-translateX-right { -moz-transform: translateX(100px); -o-transform: translateX(100px); -ms-transform: translateX(100px); -webkit-transform: translateX(100px); transform: translateX(100px); opacity: 0 }
.scroll-anime-scale { -moz-transform: scale(0.8); -o-transform: scale(0.8); -ms-transform: scale(0.8); -webkit-transform: scale(0.8); transform: scale(0.8); opacity: 0 }
```

### [Video expand on scroll](https://codepen.io/Sidstumple/pen/pYexRJ)

held: fixed video.video, fixed video.video, fixed video.video, fixed h1 | on scroll: video.video: transform+top ×3 | made with: position: fixed · transition · custom properties driven by JS · scroll listener

```css
h1 { position: fixed; top: 60vh }
:root { --scale: 0.3; --top: 0 }
section { position: relative }
.video { position: fixed; transition: 1s ease-out; transform: scale(var(--scale)); top: var(--top) }
.video:nth-of-type(1) { top: calc(var(--top) - 15vh); transform: scale(calc(var(--scale) / 2)) }
.video:nth-of-type(2) { top: calc(var(--top) - 30vh); transform: scale(calc(var(--scale) / 1.5)) }
```

```js
addEventListener('scroll', function(e) {
style.setProperty('--top', `0px`)
style.setProperty('--top', `${ratio}px`)
style.setProperty('--scale', `${ scrollY }`)
```

### [Variable fonts with CSS variables](https://codepen.io/Sidstumple/pen/wOJgjd)

on scroll: h1.title: transform+top | made with: transition · mix-blend-mode · custom properties driven by JS · scroll listener · pointer / mouse tracking

```css
:root { --translate: 100%; --scale: 0 }
section { position: relative }
.variable-font--mousemove:before { position: absolute; mix-blend-mode: exclusion; top: 0; transform: translateY(var(--translate)); transition: 0.4s cubic-bezier(0.64, 0.57, 0.67, 1.53) }
.variable-font--mousemove .title { position: relative; transition: 0.8s; mix-blend-mode: overlay }
.variable-font--scroll:before { padding-bottom: 120%; position: absolute; bottom: -60%; transform: scale(calc(var(--scale) / 10)) }
.variable-font--scroll .title { position: relative; transform: rotate(var(--translate)); mix-blend-mode: overlay; transition: transform 0.5s cubic-bezier(0.64, 0.57, 0.67, 1.53) }
```

```js
addEventListener('mousemove', function(e) {
style.setProperty('--font-weight', `${ clientY }`)
style.setProperty('--translate', `${ clientY }px`)
addEventListener('scroll', function(e) {
style.setProperty('--font-weight', `${ windowY }`)
style.setProperty('--translate', `${ window.scrollY / window.innerHeight * 100 }deg`)
style.setProperty('--scale', `${ window.scrollY / window.innerHeight * 10 }`)
```

### [Scroll Animations](https://codepen.io/jaymierosen/pen/LqOexb)

held: fixed svg.[object, fixed svg.[object | made with: position: fixed · scroll listener

```css
h1 { text-transform: uppercase }
#female-svg, #male-svg { position: fixed; top: 50% }
```

```js
addEventListener("scroll", function(e) {
```

### [Scroll animation](https://codepen.io/joerivanderstek/pen/VqVxVv)

on scroll: div.b-m: opacity | made with: @keyframes

```css
html { position:absolute; top: 0 }
.b-c_2 { position: relative }
.b-m { position: absolute; animation: scrollMe 1.2s linear infinite }
0% { opacity: 0 }
50% { opacity: 0.8 }
100% { opacity: 0 }
@keyframes scrollMe animates left, opacity
```

### [Scroll Effects](https://codepen.io/Allaiuzzu/pen/vVywmZ)

made with: @keyframes · transition

```css
.card { position: absolute; top: 100vh; transition: top 700ms cubic-bezier(.25,.56,.46,1.04) }
article { position: absolute; top: 100vh; transition: top 750ms ease; background-position: center center }
.art1 { top: 0 }
.sec1 { top: 0 }
.scroll-container { position: relative }
.scroller { position: absolute; top: 4px; bottom: 34px; animation: scroller 1500ms ease-out infinite }
0% { bottom: 34px }
5% { top: 4px }
32% { bottom: 4px }
66% { top: 34px; bottom: 4px }
100% { top: 4px; bottom: 34px }
@keyframes scroller animates bottom, top
```

### [Amazing Scroll](https://codepen.io/Mr_Neo/pen/KGgBzM)

on scroll: li.: transform+top ×30, div.main: transform+top, ul.nav__fr: transform+top, ul.nav__bc: transform+top | on hover of li.: li.: transform ×30, div.main: transform+top | made with: requestAnimationFrame

```css
.main { position: absolute; top: 0 }
.section { background-position: 50% 50% }
.nav { position: absolute; top: 0 }
.nav > div { position: absolute; top: 0 }
.nav__2 { transform: skewY(3deg) }
ul { position: absolute; top: 0 }
.line { position: absolute }
```

```js
addEventListener("wheel", function(e) {
requestAnimationFrame(Velocity)
```

### [Window Scroll Fades](https://codepen.io/kayfo23/pen/EeqYJw)

held: fixed div.header | on scroll: div.header: opacity, div.panel: transform+opacity+top | on hover of img.: div.panel: transform+opacity+top ×2 | made with: position: fixed · transition · scroll listener

```css
:root { --transition: all 1s }
.hero { background-position: center }
.header { position: fixed; top: 50%; text-transform: uppercase; opacity: 1; transform: translate(-50%, -50%); transition: var(--transition) }
.headline, .subheadline { transform: translateY(10%); opacity: 0; transition: var(--transition) }
.header-slide-in { transform: translate(0); opacity: 1 }
.header-fade-out { opacity: 0 }
.panel { opacity: 0; transform: translateY(10%); transition: var(--transition) }
.panel img { box-shadow: 0 20px 25px -10px rgba(0,0,0,.6) }
.panel-fade-in { opacity: 1; transform: translate(0) }
```

```js
addEventListener('scroll', debounce(function() {
```

### [scroll-down animation](https://codepen.io/mehrandabi/pen/NBwGaz)

on scroll: span.glyphicon: opacity | made with: @keyframes · transition

```css
.scroll-down { position: absolute; transform: translateX(-50%); transition: height 0.25s ease }
.scroll-down .glyphicon-chevron-down:nth-child(1) { animation: opacityChange1 0.7s infinite }
.scroll-down .glyphicon-chevron-down:nth-child(2) { animation: opacityChange2 0.7s infinite }
.scroll-down .glyphicon-chevron-down:nth-child(3) { animation: opacityChange3 0.7s infinite }
.scroll-down .chevron-container { position: absolute; transform: translateX(-50%) }
0%,100% { opacity: 0.2 }
33% { opacity: 1 }
0%,33%,100% { opacity: 0.2 }
66% { opacity: 1 }
0%,66% { opacity: 0.2 }
100% { opacity: 1 }
@keyframes opacityChange1 animates opacity
```

### [Scroll Animation with pure JavaScript](https://codepen.io/iamsurajsharma/pen/zjNQYw)

on scroll: div.left: opacity+top, div.right: opacity+top | on hover of img.: div.foot: opacity+top | made with: @keyframes · scroll listener

```css
#naruto { background-position: center; opacity: 0.7; position: relative }
.left, .right { margin-bottom: 50px; margin-top: 50px; position: relative }
#left { opacity: 0 }
#right { opacity: 0 }
.foot { margin-top: 30px; margin-bottom: 50px; opacity: 0 }
.animation-right { animation: righty 2s forwards; position: relative }
0% { opacity: 0 }
100% { opacity: 1 }
.animation-left { animation: lefty 2s forwards; position: relative }
0% { opacity: 0 }
100% { opacity: 1 }
.animation-top { animation: toping 2s forwards; position: relative; animation-delay: 1s }
```

```js
addEventListener('scroll', animation)
```

### [Content scroll animation](https://codepen.io/jlozovei/pen/QmeXzo)

on scroll: p.text: opacity+top ×2, h1.title: opacity+top, img.animated: opacity+top | made with: @keyframes · transition

```css
.wrapper { position: absolute; top: 50%; transform: translate(-50%, -50%); box-shadow: 0px 0px 20px #a4a4a4 }
.wrapper .chip, .wrapper .reset { transform: translateX(-50%) }
.wrapper .chip { position: absolute; top: 0.5rem; -webkit-animation: float 1.2s cubic-bezier(0.4, 0, 1, 1) infinite; animation: float 1.2s cubic-bezier(0.4, 0, 1, 1) infinite }
.wrapper .reset { position: relative }
.wrapper .title { padding-bottom: 0.5rem; border-bottom: 1px solid #f1f2f3 }
.animated { opacity: 0; transition: all ease-in-out 230ms }
.animated.active { opacity: 1 }
0%, 100% { top: 0.5rem }
50% { top: 0.85rem }
0%, 100% { top: 0.5rem }
50% { top: 0.85rem }
@keyframes float animates top
```

### [CSS vars : Article progress bar](https://codepen.io/hamzaiqbal/pen/Brzowd)

held: fixed div | on hover of a.: a.: color | made with: position: fixed · scroll listener

```css
#progress-bar { position: fixed; top: 0 }
```

```js
addEventListener('scroll', e => {
```

### [Scroll Based Image Pan, Zoom, and Color](https://codepen.io/heaversm/pen/KZEjER)

held: fixed div.room__container | made with: position: fixed · transition

```css
.room { position: absolute; top: 0; opacity: 0; object-position: 0% 50%; transition: all 0.5s ease-out }
.room.active { opacity: 1 }
.room__container { position: fixed; transition: all 0.5s linear }
.text { position: absolute }
.text__container { position: absolute; top: 0 }
.text--01 { top: 300px }
.text--01 p { margin-top: 20px }
.text--02 p, .text--03 p { margin-top: 24px }
.text--02 { top: 150vw }
.text--02 h3 { margin-top: 180px }
.text--03 { top: 350vh }
.text--03 h3 { margin-top: 130px }
```

### [Sections Counter](https://codepen.io/osorina/pen/vpvzmj)

held: fixed div.fixed-head, fixed div.btn-down, fixed div.slide_count | on hover of div.btn-down: li.active: opacity, li.: opacity | made with: position: fixed · scroll() timeline · transition · Web Animations API (.animate)

```css
section { position: relative }
section h1 { position: absolute; top: 40%; text-transform: uppercase }
section .fixed-head { position: fixed; top: 8px; text-transform: uppercase }
section .btn-down { position: fixed; bottom: 0 }
.slide_count { position: fixed; top: 40% }
.slide_count ul { position: relative }
.slide_count ul li { opacity: 0; top: 20px; position: absolute; transition: opacity 0.5s ease }
.slide_count ul li.active { opacity: 1 }
```

```js
.animate({
```

### [Moving flowers on scroll animation](https://codepen.io/woolandcotton/pen/KZMwEm)

made with: scroll() timeline · transition

```css
.main-container { position: relative }
.main-container .heading-wrapper { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.main-container .flower { position: absolute }
.main-container .flower.tl { top: 0; transition: 0.3s }
.main-container .flower.tl.active { top: -100px; transition: 0.3s }
.main-container .flower.bl { bottom: 0; transition: 0.3s }
.main-container .flower.bl.active { bottom: -100px; transition: 0.3s }
.main-container .flower.tr { top: 0; transition: 0.3s }
.main-container .flower.tr.active { top: -100px; transition: 0.3s }
.main-container .flower.br { bottom: 0; transition: 0.3s }
.main-container .flower.br.active { bottom: -100px; transition: 0.3s }
.content { margin-top: 20px }
```

### [Simple Scroll Down Mouse Animation](https://codepen.io/MD2Tech/pen/MOPvBw)

on scroll: div.: opacity+top | made with: @keyframes

```css
h4 { margin-top: 10px }
#mouse_body { margin-top: 150px !important }
#mouse_wheel { position: relative; -webkit-animation: wheel_animation 1.5s linear infinite; animation: wheel_animation 1.5s linear infinite }
0% { opacity: 0; top: 2px }
50% { opacity: 1; top: 50% }
100% { opacity: 0; top: 33px }
0% { opacity: 0; top: 2px }
50% { opacity: 1; top: 50% }
100% { opacity: 0; top: 33px }
@keyframes wheel_animation animates opacity, top
```

### [scroll animation](https://codepen.io/deepakrawat/pen/QOjZBq)

made with: scroll listener

```css
section { position: relative }
.service-section { position: relative }
.wow_imgage { position: relative }
.col_half, .col_third, .col_twothird, .col_fourth, .col_three_fourth, .col_fifth { position: relative; margin-bottom: 20px }
```

```js
addEventListener('scroll', this.scrollHandler, false)
```

### [Intersection Observer w/GSAP Trigger Test](https://codepen.io/PointC/pen/aLxmJp)

held: fixed div.trigger | on scroll: div.hello: transform+top | made with: position: fixed · GSAP · IntersectionObserver

```css
.content { position: relative }
.dog { position: absolute; top: 50% }
.woof { position: absolute; top: -60px }
.trigger { position: fixed }
.box { position: absolute; top: 25% }
.hello, .message, #morphIt, #drawIt { position: absolute; top:50% }
```

```js
new IntersectionObserver(animHandler, options)
```

### [Sticky Scrolling Animation Slider](https://codepen.io/kilianso/pen/NaLzVW)

held: sticky div.scroll__content, sticky div.scroll__content, sticky div.scroll__content, sticky div.scroll__content, sticky div.scroll__content | on scroll: div.rectangle: transform+top ×11 | made with: position: sticky · transition · scroll listener

```css
.scroll { position: relative; top: 0 }
.scroll__view { top: 0 }
.scroll__overlays { position: relative }
.scroll__content { top: 0; position: relative }
.scroll__content { position: sticky }
.scroll__content .scroll__text:before { position: absolute; top: 0; transform: translateY(calc(-100% + 1px)) }
.scroll__hero { position: sticky }
.scroll__sectionwrapper { position: relative; top: 50%; transform: translateY(-50%) }
.rectangles { position: relative; padding-top: 100% }
.rectangle { position: absolute; top: 50%; transition: background 1s cubic-bezier(0.41, 1.68, 0.55, 0.89); transform: translate(-50%, -50%); opacity: 1 }
.no-skrollr .rectangle { transition: all 1s cubic-bezier(0.41, 1.68, 0.55, 0.89) }
.scroll__view[data-current="1"] .rectangle-1 { top: 29.239%; transform: translate(-50%, -50%) rotate(-24deg) }
```

```js
addEventListener("scroll", () => {
```

### [Animation On Scroll](https://codepen.io/iampankajdhiman/pen/KqrERq)

made with: view() timeline · transition · :hover

```css
a { -webkit-transition: all 0.4s ease-in-out; -moz-transition: all 0.4s ease-in-out; -ms-transition: all 0.4s ease-in-out; -o-transition: all 0.4s ease-in-out }
.banner { position: relative; background-position: center center }
.banner .container { position: relative }
.banner .banner-text { position: absolute; top: 10%; -webkit-transform: translateY(0%); transform: translateY(0%); -webkit-transition: all 2s ease-in-out 0.2s; transition: all 2s ease-in-out 0.2s }
.banner-text h1 { text-transform: uppercase; margin-bottom: 20px; opacity: 0; -webkit-transition: all 2s ease-in-out 0.2s; transition: all 2s ease-in-out 0.2s }
.banner.start-animation .banner-text { top: 55%; -webkit-transform: translateY(-50%); transform: translateY(-50%) }
.banner.start-animation .banner-text h1 { opacity: 1 }
section { margin-top: 10px; position: relative }
section h1 { text-transform: uppercase; margin-bottom: 20px; position: relative; -webkit-transition: all 1.2s ease-in 0.2s; transition: all 1.2s ease-in 0.2s; opacity: 0.1; -webkit-filter:blur(5px); filter:blur(5px) }
section.start-animation h1 { -webkit-transform: translateY(0%); transform: translateY(0%); opacity: 1; -webkit-filter:blur(0px); filter:blur(0px) }
```

### [Connect bubbles by scrolling](https://codepen.io/roxi_t/pen/dRmVZX)

held: fixed main | on scroll: img.: filter | on hover of img.: div.element: shadow | made with: position: fixed · scroll() timeline · transition

```css
main { position: fixed }
.element { box-shadow: 1px 1px 4px 3px rgba(0, 0, 0, 0.08); transition: all ease-in-out 2s }
.element img { -webkit-filter: grayscale(100%); filter: grayscale(100%); transition: all ease-in-out 2s }
.instapage { margin-top: 100px }
.i1 { position: absolute; top: 50px }
.i2 { position: absolute; top: 20px }
.i3 { position: absolute; top: 300px }
.line { position: absolute; transition: height ease-in 1s }
.li1 { top: 150px; transform: rotate(-110deg) }
.li2 { top: 175px; transform: rotate(105deg) }
.li3 { top: 245px; transform: rotate(-13deg) }
.i2.scrolled img, .i1.scrolled img, .i3.scrolled img { transition: all ease-in-out 2s; -webkit-filter: grayscale(0%); filter: grayscale(0%) }
```

### [Scroll Animation](https://codepen.io/fdsea/pen/rwJvBp)

on hover of a.: div.col_item: transform ×2, div.block_2: filter ×2, div.col_item: transform+opacity+top, div.block_1: transform+opacity+top | made with: @keyframes · scroll listener

```css
.why { position: relative }
.why .col_item .img_container { padding-bottom: 2em }
.why .col_item .img_container .fa { position: relative }
.why .col_item .img_container .fa:after { position: absolute; top: -0.3em }
.block_item_1 .logo { position: absolute; top: 10px }
.block_item_1:before { position: absolute; top: 12%; transform: translateX(-50%) }
.block_item_1:after { position: absolute; border-top: 30px solid #fff; top: 55%; transform: translate(-50%, 0); animation: blink 0.3s linear infinite }
0% { transform: translate(-50%, 0) }
90% { transform: translate(-50%, 15%) }
100% { transform: translate(-50%, 0) }
.block_item_3 .block_2:nth-child(1) { border-top: 3px solid magenta }
.block_item_3 .block_2:nth-child(2) { border-bottom: 3px solid magenta }
```

```js
addEventListener('scroll', () => {
addEventListener('scroll', ()=>{
```

### [Scroll Wobble](https://codepen.io/bradarnett/pen/VWQYyY)

held: fixed h1 | made with: position: fixed · GSAP · scroll listener · requestAnimationFrame

```css
h1 { position: fixed; top: 50%; transform: translateX(-50%) translateY(-50%) }
main { bottom: 0; position: absolute; top: 0 }
```

```js
requestAnimationFrame(setWobble)
addEventListener('scroll', trackScroll)
requestAnimationFrame(trackScroll)
```

### [animate section when in viewport](https://codepen.io/plurivalence/pen/gRrWPQ)

on scroll: p.animated: transform+top | made with: @keyframes

```css
0% { -webkit-transform: scale(0.5); transform: scale(0.5) }
30% { -webkit-transform: scale(1.2); transform: scale(1.2) }
100% { -webkit-transform: scale(1); transform: scale(1) }
html, body { filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#ecec61", endColorstr="#ff7cd8",GradientType=1 ) }
section { border-bottom: 30px dashed #fff }
section p { box-shadow: 1px 1px 7px }
section p.anim { -webkit-animation: scale 1s 1 ease-in; animation: scale 1s 1 ease-in }
@keyframes scale animates -webkit-transform, transform
```

### [Anirudh Duggal: Portfolio](https://codepen.io/anirudhdggl/pen/JNqrYJ)

held: fixed div.setLeft | made with: position: fixed · scroll() timeline · transition

```css
#navBar { transition: all 0.3s }
#about img { margin-bottom: 15px }
.card { box-shadow: 2px 2px 6px 4px gray }
.linkButton { box-shadow: 1px 1px gray }
.serviceCard { box-shadow: 2px 2px 6px 6px gray }
#socialMedia { position: fixed; top: 25% }
.setLeft { transition: all 0.3s }
.setRight { transition: all 0.3s }
```

### [Animate Scroll](https://codepen.io/ravid7000/pen/LyaeXQ)

made with: scroll() timeline

### [Page scrolling with Velocity.js](https://codepen.io/antonietta/pen/ZewQrg)

made with: transition · :hover

```css
.container { position: relative }
.scroller { position: relative }
.main-title { margin-top: 2em }
.scroll-link { position: relative; transform: scale(1.1); transition: transform 0.5s }
.scroll-link::after { position: absolute; top: 0.3em; border-bottom: 1px solid red; transition: border-width 0.7, border-color 0.5s }
.scroll-link:hover, .croll-link:focus { transform: scale(1) }
```

### [On Scroll Animation](https://codepen.io/beatenbones/pen/OpaKvB)

on scroll: div.photo: transform+opacity+top ×2 | made with: nothing recognised — read the code

```css
.first { margin-top: 250px !important }
.photo { padding-top: 90px }
.last { margin-top: 250px }
```

### [Scroll Animation NoJquery](https://codepen.io/thayssn/pen/OpZVjw)

on scroll: div.scrollAnim: opacity+top ×2, h1.anim-left: transform+top, h2.anim-left: transform+top, p.anim-left: transform+top | made with: position: fixed · @keyframes · transition · :hover · scroll listener

```css
.scrollAnim { opacity: 0; transition: 0.8s }
.scrollAnim.anim { opacity: 1 }
h1, h2 { transition: all 0.8s }
p { transition: all 1.2s }
.anim-top { transform: translate(0,150px) }
.anim-left { transform: translate(-150px,0) }
.anim .anim-top { transform: translate(0,0) }
.anim .anim-left { transform: translate(0,0) }
button { text-transform: uppercase }
.scroller { position: fixed; top: 10px; transform: translateX(-50%) }
from { opacity: 0 }
to { opacity: 1 }
```

```js
addEventListener('scroll', () => {
```

### [Cloud Scroll](https://codepen.io/EssSaibot/pen/dNLMbL)

made with: @keyframes

```css
#banner { position: relative }
#cloud-scroll { top: 0; position: absolute; -webkit-animation: 900000s backgroundScroll infinite linear; -moz-animation: 900000s backgroundScroll infinite linear; -o-animation: 900000s backgroundScroll infinite linear; -ms-animation: 90 }
from { background-position: 0 0 }
to { background-position: -99999999px 0 }
from { background-position: 0 0 }
to { background-position: -99999999px 0 }
@keyframes backgroundScroll animates background-position
```

### [Fun with GSAP, ScrollMagic & SVG Pt.2](https://codepen.io/shadrech/pen/ZLrJJv)

on scroll: g.[object: opacity+top ×14, path.[object: opacity+top ×9, g.[object: transform+opacity+top ×2 | made with: nothing recognised — read the code

```css
#mob-wrap .notice-text { padding-top: 100px; margin-bottom: 500px }
#mob-wrap #trig { margin-bottom: 500px }
#mob-wrap #trig .theRightBrain #outlineR { animation-fill-mode: forwards; animation-iteration-count: 1 }
#mob-wrap #trig .theRightBrain #fadeR { opacity: 0 }
#mob-wrap #trig .theRightBrain .rb_txt { opacity: 0 }
#mob-wrap #trig .theRightBrain .color_bg { animation-fill-mode: forwards; opacity: 0 }
#mob-wrap #trig #trig p { padding-top: 200px }
div[id^=trig] p { padding-top: 10px }
```

### [Viewport Checker](https://codepen.io/daveamato/pen/mORNem)

made with: nothing recognised — read the code

### [scroll animate div / text / image](https://codepen.io/Navedkhan012/pen/OReBNN)

made with: nothing recognised — read the code

### [Untitled](https://codepen.io/ravid7000/pen/rMNGge)

held: fixed div.followMe | on hover of a.: div.button: transform+opacity, div.divider-center: transform+opacity+top, div.h1: transform+opacity+top, div.p: transform+opacity+top | made with: position: fixed · transition · :hover · scroll listener

```css
.format-heading, .section .h2, .section .h1 { margin-top: 10px; margin-bottom: 15px }
.section { padding-top: 160px; padding-bottom: 160px }
.section .divider-center { margin-top: 15px; margin-bottom: 20px }
.section .p .text-line { margin-top: 17px; margin-bottom: 17px }
.section .p .text-line:last-child { margin-bottom: 27px }
.section .button { box-shadow: 0 1px 4px #a6a6a6 }
.followMe { position: fixed; bottom: 0; box-shadow: 0 -1px 4px #cccccc; padding-bottom: 5px; padding-top: 3px }
.followMe a { padding-top: 7px }
```

```js
addEventListener('scroll', scrollHandler, false)
```

### [Home Page Template With Scroll Animation](https://codepen.io/knitesh/pen/VjRaWw)

on scroll: div.child-box: transform+opacity+top ×2 | on hover of button.btn: div.profile-child: transform+top ×3, div.child-box: transform+opacity ×2 | made with: position: fixed · scroll() timeline · transition · :hover

```css
.sticky { position: fixed; top: 0; border-top: 0 }
.nav-header { box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5) }
.nav-header .nav-menu { padding-top: 15px }
.hero-area { box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5) }
.btn-kn-cta { transition: all 0.25s ease-in }
.hero-social-buttons { margin-top: 30px }
#hero { padding-top: 20px }
#hero > .hero-main { margin-top: 20vh }
.banner { position: relative; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5) }
.three-boxes > .child-box { box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5) }
.profile-container .profile-child { box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.4) }
.recommendations .recommendation { box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.4) }
```

### [Smooth mouse scrolling animation](https://codepen.io/aaronwilliams/pen/MeGKZJ)

on scroll: span.scroll-down: opacity+top | made with: @keyframes

```css
0% { margin-top: 20%; opacity: 1 }
90% { margin-top: 60%; opacity: 0 }
100% { margin-top: 20%; opacity: 0 }
0% { margin-top: 20%; opacity: 1 }
90% { margin-top: 60%; opacity: 0 }
100% { margin-top: 20%; opacity: 0 }
.mouse-container { position: relative; top: 10vh }
.mouse { position: relative; opacity: 0.4 }
.mouse .scroll-down { -webkit-animation: scroll-inner 1.5s; animation: scroll-inner 1.5s; -webkit-animation-iteration-count: infinite; animation-iteration-count: infinite; -webkit-animation-timing-function: ease; animation-timing-function: ea }
@keyframes scroll-inner animates margin-top, opacity
```

### [Parallax Sample](https://codepen.io/cedrickcapacete/pen/ezZBVp)

on hover of img.: section.half: opacity, figure.parallax: transform+opacity | made with: view() timeline · @keyframes · transition

```css
from { opacity:0 }
to { opacity: 1 }
from { opacity:0 }
to { opacity: 1 }
from { opacity:0 }
to { opacity: 1 }
0% { transform: translate(3em, 0) }
100% { transform: translate(0em, 0) }
0% { transform: translate(3em, 0) }
100% { transform: translate(0em, 0) }
0% { transform: translate(3em, 0) }
100% { transform: translate(0em, 0) }
```

### [Button asking for attention on scroll](https://codepen.io/vajkri/pen/JXmEYX)

on scroll: span.button--attention__marker: transform+opacity+top | on hover of button.button: span.button--attention__marker: transform+opacity+top | made with: transition · GSAP

```css
body { text-transform: uppercase }
.c2a--fixed { position: absolute; top: 0; text-transform: none }
.deck { position: relative }
.button { text-transform: uppercase; transition: 0.4s ease all }
.button--attention { position: relative }
.button--attention__marker { position: absolute; top: -2px; bottom: -2px; transition: 0.5s ease all }
```

### [ScrollMagic Challenge](https://codepen.io/vajkri/pen/wMLeOY)

on scroll: h1.active: transform+opacity+top | made with: @keyframes · GSAP

```css
.scroll-deck { position: relative }
.scroll-deck1 h1 { opacity: 0 }
.scroll-deck1 h1.active { -webkit-animation: hi 0.5s ease 1s backwards; animation: hi 0.5s ease 1s backwards }
from { transform: translate3d(-20px, 0, 0); opacity: 0 }
to { transform: translate3d(0, 0, 0); opacity: 1 }
from { transform: translate3d(-20px, 0, 0); opacity: 0 }
to { transform: translate3d(0, 0, 0); opacity: 1 }
@keyframes hi animates transform, opacity
```

### [Animate CSS Scroll Gimmick](https://codepen.io/joe-watkins/pen/jWpwOx)

made with: @keyframes

```css
.scroll-effect-hidden { opacity: 0 }
.visible { opacity: 1 }
0% { transform: translate3d(0, -10%, 0) }
0% { transform: translate3d(0, -10%, 0) }
header { margin-bottom: 50px }
h1 { margin-top: 0 }
@keyframes fadeInDown animates transform
```

### [scrolling helix](https://codepen.io/brandonkennedy/pen/epRBYN)

held: fixed div.helix, fixed h1 | on scroll: div.helix: transform | made with: position: fixed · 3D (perspective / preserve-3d)

```css
body { position: relative }
h1 { position: fixed; top: 35%; transform: translateX(-50%) }
.helix { perspective: 1500px; position: fixed; top: -2vh }
.helix .segment:nth-child(1) { transform: rotateY(13deg) }
.helix .segment:nth-child(2) { transform: rotateY(26deg) }
.helix .segment:nth-child(3) { transform: rotateY(39deg) }
.helix .segment:nth-child(4) { transform: rotateY(52deg) }
.helix .segment:nth-child(5) { transform: rotateY(65deg) }
.helix .segment:nth-child(6) { transform: rotateY(78deg) }
.helix .segment:nth-child(7) { transform: rotateY(91deg) }
.helix .segment:nth-child(8) { transform: rotateY(104deg) }
.helix .segment:nth-child(9) { transform: rotateY(117deg) }
```

### [JQuery scrollTo function](https://codepen.io/theConstructor/pen/RPvQME)

made with: Web Animations API (.animate)

```css
.one,.two,.three,.four { position:relative; margin-bottom:500px }
```

```js
.animate({
```

### [Page Scroll Effects](https://codepen.io/slstudios/pen/XbgVBY)

held: fixed div, fixed div, fixed div, fixed div, fixed div, fixed ul.cd-vertical-nav | made with: position: fixed · transition · 3D (perspective / preserve-3d) · requestAnimationFrame

```css
.cd-section:first-of-type > div::before { position: absolute; top: 20px; text-transform: uppercase }
[data-animation="parallax"] .cd-section > div, [data-animation="fixed"] .cd-sect { background-position: center center }
[data-hijacking="on"] .cd-section { opacity: 0; position: absolute; top: 0 }
[data-hijacking="off"] .cd-section > div { opacity: 0 }
[data-animation="rotate"] .cd-section { -webkit-perspective: 1800px; -moz-perspective: 1800px; perspective: 1800px }
[data-animation="scaleDown"] .cd-section > div, [data-animation="gallery"] .cd-s { box-shadow: 0 0 0 rgba(25, 30, 46, 0.4) }
.cd-section > div { position: fixed; top: 0; -webkit-transform: translateZ(0); -moz-transform: translateZ(0); -ms-transform: translateZ(0); -o-transform: translateZ(0); transform: translateZ(0) }
[data-hijacking="on"] .cd-section > div { position: absolute }
[data-animation="rotate"] .cd-section > div { -webkit-transform-origin: center bottom; -moz-transform-origin: center bottom; -ms-transform-origin: center bottom; -o-transform-origin: center bottom; transform-origin: center bottom }
.cd-vertical-nav { position: fixed; top: 50%; bottom: auto; -webkit-transform: translateY(-50%); -moz-transform: translateY(-50%); -ms-transform: translateY(-50%); -o-transform: translateY(-50%); transform: translateY(-50%) }
.cd-vertical-nav a.cd-prev { -webkit-transform: rotate(180deg); -moz-transform: rotate(180deg); -ms-transform: rotate(180deg); -o-transform: rotate(180deg); transform: rotate(180deg); margin-bottom: 10px }
.cd-vertical-nav a.inactive { opacity: 0; -webkit-transition: opacity 0.2s 0s, visibility 0s 0.2s; -moz-transition: opacity 0.2s 0s, visibility 0s 0.2s; transition: opacity 0.2s 0s, visibility 0s 0.2s }
```

```js
requestAnimationFrame(animateSection)
```

### [Wow plugin](https://codepen.io/benoitalix/pen/wBWjVj)

made with: nothing recognised — read the code

```css
section { margin-bottom: 50px }
```

### [Simple jQuery Animation of clouds moving on scroll](https://codepen.io/brendamarienyc/pen/VwOxma)

on scroll: img.js-cloud-1: transform+top, img.js-cloud-2: transform+top | made with: scroll() timeline

```css
.chrysler-building { position: absolute; top: 70px }
.clouds { position: absolute; top: 90px }
.cloud-1 { position: absolute; top: 70 }
.cloud-2 { position: absolute; top: 130px }
```

### [Scroly Poly](https://codepen.io/Prince_Perry/pen/vYpzrv)

on scroll: div.fadeOut: opacity+top | made with: scroll() timeline

```css
.fadeOut { position: absolute; top: 0 }
.parallax { position: absolute; bottom: 0 }
```
