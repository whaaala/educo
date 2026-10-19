# CodePen · layout — how each pen does it

337 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/layout.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| CSS grid | 181 |
| :hover | 104 |
| transition | 86 |
| flex-wrap | 65 |
| object-fit | 45 |
| aspect-ratio | 41 |
| auto-fit / auto-fill grid | 38 |
| @keyframes | 36 |
| position: fixed | 35 |
| position: sticky | 23 |
| inline SVG | 23 |
| grid spans (bento) | 22 |
| named grid areas | 19 |
| backdrop-filter | 18 |
| mix-blend-mode | 17 |
| :has() | 15 |
| CSS-only state (:checked / :target) | 13 |
| clip-path | 13 |
| :focus-visible | 13 |
| custom properties driven by JS | 11 |
| pointer / mouse tracking | 11 |
| requestAnimationFrame | 11 |
| prefers-reduced-motion | 11 |
| container queries | 7 |
| <details> | 7 |
| <figure> / <figcaption> | 7 |
| CSS trigonometry | 7 |
| mask | 7 |
| multi-column masonry (columns) | 7 |
| lazy loading | 6 |
| scroll-snap | 6 |
| 3D (perspective / preserve-3d) | 5 |
| scroll listener | 5 |
| CSS masonry (grid-lanes / masonry) | 5 |
| ScrollTrigger | 4 |
| GSAP | 4 |
| filter / sort library | 3 |
| canvas 2D | 3 |
| (hover: hover) gate | 3 |
| popover | 2 |
| arrow-key navigation | 2 |
| Lenis / smooth scroll | 2 |
| Motion / Framer | 1 |
| Web Animations API (.animate) | 1 |
| IntersectionObserver | 1 |
| srcset / sizes | 1 |
| @starting-style | 1 |
| carousel library | 1 |
| scroll-driven animation (animation-timeline) | 1 |
| view() timeline | 1 |
| scroll() timeline | 1 |
| animation-range | 1 |
| three.js / WebGL | 1 |
| view transitions | 1 |

## Every pen

### [overflow: clip なら sticky が生きる (hidden との比較)](https://codepen.io/editor/shunei/pen/01a07baf-ce46-7265-b6fb-7c073aa368c3)

held: sticky h2.c-panel__head, sticky h2.c-panel__head | made with: nothing recognised — read the code

### [spin animation on expand w/ motion](https://codepen.io/editor/vii120/pen/01a04432-913a-7786-9786-095079265399)

held: fixed div.fixed | on scroll: div.absolute: transform+top ×8 | made with: position: fixed · Motion / Framer · CSS grid · aspect-ratio

```css
sub,sup { position:relative }
sub { bottom:-.25em }
sup { top:-.5em }
button,input,select,optgroup,textarea { opacity:1 }
::file-selector-button { opacity:1 }
::placeholder { opacity:1 }
:-moz-ui-invalid { box-shadow:none }
.absolute { position:absolute }
.fixed { position:fixed }
.relative { position:relative }
.inset-0 { inset:0 }
.bottom-0 { bottom:0 }
```

### [rounded expand and spin](https://codepen.io/editor/vii120/pen/01a039e8-f053-7b48-ae25-d83d5b67fbfd)

held: fixed label | made with: position: fixed · transition · :has() · aspect-ratio · CSS-only state (:checked / :target)

```css
&::before { translate: calc(100cqi - 100%) 0 }
.card { rotate: 0deg; scale: 1.2 }
.box { position: relative }
label { position: fixed; top: 24px }
&::before { transition: all 0.2s }
```

### [scrollbar-gutter: stable — スクロールバーで中身の幅を動かさない](https://codepen.io/editor/shunei/pen/01a03378-0f82-7a74-9252-d29a6e431b54)

made with: nothing recognised — read the code

### [display: treemap — CSS doesn't have it. Try it anyway.](https://codepen.io/editor/surahotoke/pen/01a014c4-155a-70ea-a9d2-5466c75080e4)

made with: container queries · aspect-ratio

### [Untitled](https://codepen.io/gorge726/pen/NPdoQBL)

made with: CSS grid · named grid areas

### [PT James neu](https://codepen.io/literallyjustjames/pen/dPNaGbM)

on scroll: div.float: transform+opacity+top ×3, div.coverStars: opacity+filter, div.coverBigHalo: transform+top, div.coverHalo: transform | on hover of img.: div.float: transform+opacity+top ×3, div.coverStars: opacity+filter, div.coverBigHalo: transform+top, div.coverHalo: transform+top | made with: @keyframes · transition · :hover · backdrop-filter · mix-blend-mode · CSS grid · flex-wrap · object-fit

### [Tab Navigation with Isometric View](https://codepen.io/jkantner/pen/myRaNJw)

made with: nothing recognised — read the code

### [Sailor Moon Lesson / Article](https://codepen.io/mahricodes/pen/emgbVBv)

made with: backdrop-filter

```css
body { position: relative }
body:before { position: absolute; top: -100px; backdrop-filter: blur(15px) }
```

### [CSS Grid Page Layout](https://codepen.io/editor/bwoolbright/pen/019f810a-22bf-7ec7-8e57-6ff4d2809a0e)

held: sticky ul | on hover of li.: a.: background+color | made with: position: sticky · transition · :hover · CSS grid · named grid areas

```css
:is(h1, h2, h3, h4, h5, h6) { margin-top: 1.3rem }
> :first-child { margin-top: 0 }
```

### [SmolCSS - Smol Flexible Unbreakable Boxes](https://codepen.io/nsmsn/pen/NPbMjYw)

made with: nothing recognised — read the code

### [Mugsy's Mugs — Handcrafted Ceramic Shop #CodePenChallenge](https://codepen.io/jerora98/pen/ZYBvVza)

held: fixed div, fixed aside, sticky nav.nav, fixed nav | on hover of button.: div.ticker__inner: transform | made with: position: sticky · position: fixed · @keyframes · transition · :hover · backdrop-filter · inline SVG · CSS grid · auto-fit / auto-fill grid · flex-wrap · aspect-ratio · object-fit

```css
.nav { position: sticky; top: 0; border-bottom: 2px solid var(--black) }
.nav__links a { text-transform: uppercase; transition: color 0.15s, background 0.15s }
#cart-btn { text-transform: uppercase; transition: background 0.15s }
#cart-badge { transition: transform 0.2s }
#cart-badge.pop { animation: pop 0.3s ease }
0% { transform: scale(1) }
50% { transform: scale(1.5) }
100% { transform: scale(1) }
.hamburger span { transition: all 0.25s }
.hamburger.is-open span:nth-child(1) { transform: rotate(45deg) translate(4px, 4px) }
.hamburger.is-open span:nth-child(2) { opacity: 0 }
.hamburger.is-open span:nth-child(3) { transform: rotate(-45deg) translate(4px, -4px) }
```

### [The Frontend Dispatch - cpc-news-feed](https://codepen.io/ed-demircioglu/pen/dPOWXzO)

on scroll: span.: transform+opacity+top ×96 | on hover of button.view-button: span.: transform+opacity+top ×81, span.: transform+opacity ×15, button.view-button: transform+shadow+top | made with: custom properties driven by JS · pointer / mouse tracking · requestAnimationFrame

```js
requestAnimationFrame(renderSwitch))
requestAnimationFrame(applyQuickFilter)
requestAnimationFrame(applyQuickFilter))
style.setProperty("--micro-tilt", (((index % 5) - 2) * 0.18) + "deg")
addEventListener("pointermove", (event) => {
style.setProperty("--cursor-x", x + "%")
style.setProperty("--cursor-y", y + "%")
```

### [The Shore Shack — Beach Sandwich Bar Menu #CodepenChallenge](https://codepen.io/jerora98/pen/KwNNyjg)

held: fixed div, fixed div, fixed nav, fixed div.mobile-nav | on hover of a.nav-logo: div.: transform+top, div.: transform+opacity+top, div.hero-bg-img: transform+top, span.hero-badge-dot: opacity, div.hero-scroll-line: transform+opacity+top, div.marquee-inner: transform | made with: position: fixed · @keyframes · transition · :hover · :has() · clip-path · backdrop-filter · CSS grid · auto-fit / auto-fill grid · flex-wrap · aspect-ratio · object-fit

```css
body::after { position: fixed; inset: 0; opacity: 0.45 }
#cur { position: fixed; transform: translate(-50%, -50%); transition: width 0.15s, height 0.15s }
#cur-ring { position: fixed; transform: translate(-50%, -50%); transition: width 0.25s, height 0.25s, opacity 0.25s; opacity: 0.3 }
body:has(a:hover, button:hover) #cur-ring { opacity: 0.5 }
nav { position: fixed; top: 0; backdrop-filter: blur(16px); border-bottom: 1px solid var(--border2); transition: box-shadow 0.3s }
nav.scrolled { box-shadow: 0 2px 24px rgba(44, 44, 42, 0.07) }
.nav-cats a { text-transform: uppercase; transition: background 0.2s, color 0.2s }
.nav-cta { transition: background 0.2s, transform 0.15s }
.nav-cta:hover { transform: translateY(-1px) }
.hamburger span { transition: all 0.3s }
.mobile-nav { position: fixed; inset: 0; backdrop-filter: blur(16px); opacity: 0; transition: opacity 0.3s }
.mobile-nav.open { opacity: 1 }
```

### [CSS Subgrid — カードの縦ライン揃え](https://codepen.io/shunei/pen/azmRzpa)

made with: nothing recognised — read the code

### [CSS Layer Uses](https://codepen.io/editor/rahul__sharma/pen/019d4971-c4a1-7684-b40a-54dc8b3843cf)

made with: nothing recognised — read the code

### [SHOCKWAVE - Song Lyrics](https://codepen.io/DevDesLpz/pen/LERzNzN)

on scroll: div.bar: opacity+top ×48 | on hover of a.: div.bar: opacity+top ×40, div.bar: opacity ×8 | made with: nothing recognised — read the code

### [New Gods Chronik](https://codepen.io/mahricodes/pen/MYpQwWr)

made with: :hover · :focus-visible · prefers-reduced-motion · mix-blend-mode · <details> · CSS grid · flex-wrap · aspect-ratio · <figure> / <figcaption>

### [New Gods Onepage](https://codepen.io/mahricodes/pen/bNqYqdV)

made with: @keyframes · transition · :hover · :focus-visible · prefers-reduced-motion · mix-blend-mode · <details> · CSS grid · flex-wrap · aspect-ratio · <figure> / <figcaption>

### [February 2027 — The Four-Week Calendar Case](https://codepen.io/Karen-Cohen/pen/zxZzXbx)

made with: :focus-visible · CSS grid · flex-wrap · aspect-ratio

### [January 2027 — Calendar Row Geometry Lab](https://codepen.io/Karen-Cohen/pen/ZYeyZwd)

made with: @keyframes · transition · :focus-visible · prefers-reduced-motion · CSS grid · aspect-ratio

### [Vienna's PT](https://codepen.io/Jocelyn-Sun/pen/yyMaZXj)

on scroll: div.float: transform+opacity+top ×3, div.panel: background, div.coverStars: opacity+filter, div.coverBigHalo: transform+top, div.coverHalo: transform+top, div.open: transform+background+shadow+top | on hover of img.: div.float: transform+opacity+top ×3, div.coverStars: opacity+filter, div.coverBigHalo: transform+top, div.coverHalo: transform+top | made with: @keyframes · transition · :hover · backdrop-filter · mix-blend-mode · CSS grid · flex-wrap · object-fit

### [rounded layout: rotate & translate](https://codepen.io/editor/vii120/pen/01a039bf-cfa0-77df-9cee-45c0a01e702c)

held: fixed label | made with: position: fixed · transition · :has() · CSS trigonometry · flex-wrap · aspect-ratio · CSS-only state (:checked / :target)

```css
&::before { translate: calc(100cqi - 100%) 0 }
.box:before { bottom: 36% }
.card { rotate: 0deg }
.rotate .card { transform: rotate(var(--rotation)) translateX(var(--radius)) rotate(calc(var(--rotation) * -1)) }
.translate .card { transform: translate( calc(cos(var(--rotation)) * var(--radius)), calc(sin(var(--rotation)) * var(--radius)) ) }
&:before { position: absolute; bottom: 100%; margin-bottom: 8px; transition: all 0.5s }
label { position: fixed; top: 24px }
&::before { transition: all 0.2s }
```

### [ELRIEL: MINISTRY OF VESSEL LICENSING](https://codepen.io/editor/numbpill3d/pen/01a010a1-343b-7fe3-8e95-3641b234d147)

held: fixed div.modal | on hover of button.: div.marquee: transform | made with: position: fixed · @keyframes · inline SVG · CSS grid · flex-wrap

### [Sailor Saturn Lesson / Article](https://codepen.io/mahricodes/pen/vEgvrdP)

made with: transition · :hover · backdrop-filter · <details> · CSS grid · object-fit

```css
body { position: relative }
body:before { position: absolute; top: -100px; backdrop-filter: blur(15px) }
```

### [Sailor Mercury Lesson / Article](https://codepen.io/mahricodes/pen/RNKEJxO)

made with: transition · :hover · backdrop-filter · <details> · CSS grid · object-fit

```css
body { position: relative }
body:before { position: absolute; top: -100px; backdrop-filter: blur(15px) }
```

### [SmolCSS - Smol Responsive Flexbox Grid  via Stephanie Eckles ](https://codepen.io/keith-purtell/pen/xbgyxxb)

made with: CSS grid · flex-wrap

### [Scroll-proof autogrow textarea with locked chars per line](https://codepen.io/ycw/pen/bNgKqNe)

made with: CSS grid

### [Widget Grid Smart Layout Demo](https://codepen.io/demakov/pen/QwdrxQP)

made with: transition · :hover · prefers-reduced-motion · requestAnimationFrame · Web Animations API (.animate) · CSS grid · grid spans (bento) · flex-wrap

```css
.topbar { margin-bottom: 18px }
.board-wrap { box-shadow: 0 18px 50px rgba(0,0,0,0.3) }
.grid-label { margin-bottom: 8px }
.grid { position: relative; outline-offset: 0 }
.widget { position: relative; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.36); transition: border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease, background 160ms ease; will-change: transform }
.widget:hover { transform: translateY(-1px) }
.widget.is-open { box-shadow: inset 0 0 0 1px rgba(255,225,82,0.08), 0 14px 28px rgba(0,0,0,0.22) }
.expanded { margin-top: 14px }
.field { position: relative }
.field span { position: absolute; top: -7px }
.field input:focus { box-shadow: 0 0 0 3px rgba(255,225,82,0.18) }
.primary:hover { filter: brightness(1.04) }
```

```js
.animate([
requestAnimationFrame(() => {
```

### [min-inline-size: 0 — grid/flex 項目のはみ出しを止める](https://codepen.io/shunei/pen/PwWRZqp)

made with: CSS grid

### [DASHBOARD SHELL](https://codepen.io/editor/monapdx/pen/019f45a9-85e2-7996-9aa5-60386ffd86f0)

on scroll: div.personal-bests: transform+shadow+top | made with: position: fixed · transition · :hover · :has() · CSS grid · flex-wrap

```css
html::before { position: fixed; inset: 0; opacity: 0.6 }
```

### [Maledicta PROFILE CODE](https://codepen.io/mahricodes/pen/MYJrogQ)

on scroll: div.float: transform+opacity+top ×3, div.coverStars: opacity+filter, div.coverBigHalo: transform+top, div.coverHalo: transform+top | on hover of img.: div.float: transform+opacity+top ×3, div.coverStars: opacity+filter, div.coverBigHalo: transform+top, div.coverHalo: transform+top | made with: @keyframes · transition · :hover · backdrop-filter · mix-blend-mode · CSS grid · flex-wrap · object-fit

### [Minimalist Circular / Radial Calendar Layout — 27 CSS Calendar Designs](https://codepen.io/codefronts/pen/VYPypBy)

held: fixed a | on scroll: div.cal16__ticks: transform+top | on hover of div.cal16__nav-btn: div.cal16__ticks: transform, div.cal16__day: shadow, div.cal16__nav-btn: background+color | made with: position: fixed · @keyframes · transition · :hover · prefers-reduced-motion · backdrop-filter · CSS trigonometry

```css
from { opacity: 0; transform: scale(0.9) rotate(-8deg) }
to { opacity: 1; transform: scale(1) rotate(0) }
from { transform: rotate(0deg) }
to { transform: rotate(360deg) }
0%, 100% { box-shadow: 0 0 0 0 rgba(200,155,106,0.5) }
50% { box-shadow: 0 0 0 8px rgba(200,155,106,0) }
.cal16__stage { position: relative; animation: cal16-in 0.7s cubic-bezier(0.22,1,0.36,1) both }
.cal16__ring { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.cal16__ticks { position: absolute; top: 50%; animation: cal16-spin-ring 160s linear infinite }
.cal16__tick { position: absolute; top: 0 }
.cal16__day { position: absolute; top: 50%; transition: all 0.2s }
.cal16__day:hover { box-shadow: 0 4px 14px rgba(43,40,32,0.1) }
```

### [Container Queries — 置き場所に応じてカード自身がレイアウトを変える](https://codepen.io/shunei/pen/NPdgLqq)

on scroll: article.c-card: transform+shadow+top | made with: transition · :hover · prefers-reduced-motion · container queries · CSS grid · aspect-ratio

```css
.c-card { box-shadow: 0 1px 3px rgb(0 0 0 / .1); transition: transform .2s ease, box-shadow .2s ease }
.c-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgb(0 0 0 / .12) }
.c-card { transition: none }
.c-card:hover { transform: none }
```

### [gap decorations — Grid / Flexbox の gap に罫線（column-rule + row-rule）](https://codepen.io/shunei/pen/EaZNPma)

made with: CSS grid

```css
.p-grid.-decorated { column-rule-inset: 8px; row-rule-inset: 8px }
```

### [WooCommerce Store Layout](https://codepen.io/visaint/pen/emgpavQ)

held: sticky div.switcher-bar | made with: position: sticky · @keyframes · transition · :hover · CSS grid · auto-fit / auto-fill grid · flex-wrap · aspect-ratio

### [Nacho Power Rankings](https://codepen.io/editor/Dean110/pen/0161be61-7ee0-779a-9410-1628ba91d769)

made with: nothing recognised — read the code

### [Css Grid Template Custom Element](https://codepen.io/editor/jfrazz/pen/0167ee49-a4d8-708d-ad67-ce1fba0fe70a)

held: fixed button.button1, fixed div, fixed button.button1, fixed button.button1 | made with: position: fixed · flex-wrap

```css
body { position:absolute; top:-6px; bottom:0 }
#button { position: fixed; opacity: 1; box-shadow:2px 3px 2px 1px #030303; top:20px }
button { box-shadow:2px 3px 2px 1px #030303; top:12px }
#drawermenu { position: fixed; top: 0px; opacity: .77 }
.increment { position: absolute; top: 85% }
label { opacity: 1 }
.scrolltabs { box-shadow:inset 3px 3px 2px 1px #0e0e0e }
header { box-shadow: 4px 3px 2px 1px #0e0e0e; margin-bottom: 4px; border-bottom: 2px solid black; margin-bottom: 10px }
```

### [Google responsive form layout](https://codepen.io/editor/dheerajbaghel/pen/0164fb62-b338-72c6-a0e4-f35a2f2119a5)

made with: popover

### [Simple Blog Card Layout](https://codepen.io/Tanzeela_Fatima12/pen/ZYBvMxM)

on scroll: article.blog-card: transform+shadow+top, img.: transform+top | on hover of a.blog-view-all: a.blog-view-all: color, article.blog-card: transform+shadow+top, img.: transform+top | made with: transition · :hover · CSS grid · object-fit

```css
.blog-header { margin-bottom: 32px }
.blog-view-all { transition: color 0.2s ease }
.blog-card { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04); transition: all 0.3s ease }
.blog-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08) }
.blog-image { position: relative }
.blog-image img { transition: transform 0.4s ease }
.blog-card:hover .blog-image img { transform: scale(1.05) }
.blog-category { position: absolute; top: 12px; text-transform: uppercase; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1) }
```

### [Shopping Layout - allow varying content sizes for cards](https://codepen.io/pursuitofleisure/pen/bNBodWX)

held: sticky header | made with: position: sticky · :has() · prefers-reduced-motion · inline SVG · CSS grid · auto-fit / auto-fill grid · grid spans (bento)

### [Evidence Board | The Source Files](https://codepen.io/Alansdead/pen/xbRdXeN)

held: fixed div.notes | on hover of button.ctrl: button.ctrl: transform+top | made with: position: fixed · @keyframes · transition · :hover · prefers-reduced-motion · backdrop-filter · mix-blend-mode · custom properties driven by JS · inline SVG · pointer / mouse tracking · requestAnimationFrame · CSS grid · auto-fit / auto-fill grid · flex-wrap · filter / sort library

```css
.board { position: relative; box-shadow: inset 0 0 120px rgba(60, 30, 10, 0.5), 0 20px 60px rgba(0, 0, 0, 0.6) }
.board-grain { position: absolute; inset: 0; opacity: 0.5 }
.board-flicker { position: absolute; inset: 0; mix-blend-mode: multiply; animation: flick 6s infinite steps(1) }
0%, 93%, 100% { opacity: 0 }
94% { opacity: 0.5 }
95% { opacity: 0.05 }
96% { opacity: 0.35 }
.classified { position: absolute; top: 38%; transform: translate(-50%, -50%) rotate(-18deg); transition: none }
.classified.show { animation: bleed 2.4s ease forwards }
.case-header { position: relative; margin-bottom: 1.5rem }
.stamp { transform: rotate(-4deg); opacity: 0.85; margin-bottom: 0.6rem }
.case-title .r { box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3) }
```

```js
style.setProperty("--rot", rot+"deg")
style.setProperty("--x", positions[a.i].x+"px")
style.setProperty("--y", positions[a.i].y+"px")
requestAnimationFrame(()=>stringsEl.classList.add("show"))
style.setProperty("--x", s.x+"px")
style.setProperty("--y", s.y+"px")
addEventListener("pointermove", e=>{
style.setProperty("--x", x+"px")
```

### [DEV/FEED — Editorial News Feed #CodePenChallenge](https://codepen.io/jerora98/pen/LEbyWOQ)

held: fixed div, sticky header.masthead | on hover of button.filter-btn: span.live-dot: opacity, div.ticker-inner: transform, article.hero-card: background | made with: position: sticky · position: fixed · @keyframes · transition · :hover · clip-path · mix-blend-mode · 3D (perspective / preserve-3d) · ScrollTrigger · IntersectionObserver · pointer / mouse tracking · CSS grid · grid spans (bento) · flex-wrap · filter / sort library

```css
body::before { position: fixed; inset: 0; opacity: 0.6 }
#cur { position: fixed; transform: translate(-50%, -50%); transition: width 0.12s, height 0.12s, border-radius 0.12s; mix-blend-mode: difference }
.masthead { border-bottom: 3px solid var(--ink); position: sticky; top: 0 }
.masthead-top { border-bottom: 1px solid var(--border) }
.live-dot { animation: blink 1.4s ease-in-out infinite }
0%, 100% { opacity: 1 }
50% { opacity: 0.2 }
.filter-btn { text-transform: uppercase; transition: all 0.15s }
.masthead-title h1 { opacity: 0; animation: stamp-in 0.5s 0.05s cubic-bezier(0.16, 1, 0.3, 1) forwards }
from { opacity: 0; transform: scale(1.06) skewX(-1deg) }
to { opacity: 1; transform: scale(1) skewX(0) }
.masthead-sub { text-transform: uppercase; margin-top: 4px }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseenter", () => cur.classList.add("on-link"))
addEventListener("mouseleave", () => cur.classList.remove("on-link"))
new IntersectionObserver(
```

### [The Front-End Daily — CPC News Feed](https://codepen.io/Raed-Ennab/pen/emBvxJV)

made with: transition · :hover · prefers-reduced-motion · popover · CSS grid · auto-fit / auto-fill grid · grid spans (bento) · flex-wrap · filter / sort library

```css
.skip-link { position: absolute; top: 0 }
.skip-link:focus { top: 1rem }
a { text-underline-offset: 0.18em; transition: text-decoration-color 0.2s, color 0.2s }
.masthead { border-bottom: 1px solid var(--rule) }
.masthead__eyebrow { text-transform: uppercase }
.masthead__meta { border-top: 1px solid var(--rule) }
.masthead__meta { border-top: none; padding-top: 0 }
.masthead__meta dt { text-transform: uppercase }
.filters { padding-bottom: 1.25rem }
.filter { transition: background 0.15s, color 0.15s, border-color 0.15s }
.article { position: relative; box-shadow: 0 1px 0 color-mix(in oklab, var(--ink) 4%, transparent), 0 12px 24px -18px color-mix(in oklab, var(--ink) 30%, transparent); transition: transform 0.25s ease, box-shadow 0.25s ease, opacit }
.article:hover { transform: translateY(-2px); box-shadow: 0 1px 0 color-mix(in oklab, var(--ink) 6%, transparent), 0 22px 40px -22px color-mix(in oklab, var(--ink) 40%, transparent) }
```

### [The Surfin' Bird — Beach Shack Menu](https://codepen.io/Raed-Ennab/pen/xbRRJNY)

made with: inline SVG · CSS grid · named grid areas

```css
.paper { background-position: 0 0, 1px 1px; box-shadow: var(--shadow); position: relative }
.paper::before, .paper::after { position: absolute; inset: 10px }
.paper::after { inset: 16px; opacity: 0.35 }
.masthead { position: relative }
.sun { position: absolute; top: -90px; transform: translateX(-50%); filter: blur(2px) }
.kicker { transform: rotate(-2deg) }
.logo__the { transform: rotate(-6deg) translateY(0.4em) }
.tagline { text-transform: uppercase; border-top: 2px solid var(--ink); border-bottom: 2px solid var(--ink) }
.wave { position: absolute; bottom: -1px }
.menu { position: relative }
.section__title { padding-bottom: 0.75rem; border-bottom: 3px dashed var(--ink); position: relative }
.item__name { text-transform: uppercase }
```

### [Surfin Bird Menu Layout](https://codepen.io/TheMOZZARELLA/pen/EaNgvQM)

held: fixed div.mza-grid-lines, fixed div.mza-page-ornaments, sticky aside.mza-sidebar | on hover of div.mza-meta-card: div.mza-wave-track: transform ×3, svg.[object: transform ×2 | made with: position: sticky · position: fixed · @keyframes · transition · :hover · :focus-visible · mask · backdrop-filter · mix-blend-mode · inline SVG · CSS grid · grid spans (bento) · flex-wrap

```css
:root { --mza-transition: 220ms ease }
.mza-page { position: relative }
.mza-page::before, .mza-page::after { position: fixed }
.mza-page::before { bottom: -6rem; filter: blur(8px) }
.mza-page::after { bottom: 5rem; filter: blur(12px) }
.mza-page-ornaments { position: fixed; inset: 0 }
.mza-page-graphic { position: absolute }
.mza-page-graphic--left { top: 124px; animation: mzaPageGraphicDrift 18s ease-in-out infinite }
.mza-page-graphic--bottom { bottom: 18px; opacity: 0.9; animation: mzaPageWaveRoll 22s linear infinite }
.mza-grid-lines { position: fixed; inset: 0; opacity: 0.14; mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.5), transparent 85%) }
.mza-board::before, .mza-board::after { position: absolute; opacity: 0.45 }
.mza-board::before { top: 120px; box-shadow: 0 0 0 22px rgba(255, 255, 255, 0.08), 0 0 0 44px rgba(12, 58, 102, 0.04) }
```

### [SURFIN' BIRD: Vintage Beach Town Menu](https://codepen.io/Chathura-Jayasanka/pen/GgNqBMV)

on hover of li.: span.: opacity, div.stamp: transform+top, div.float-burst: transform+top | made with: @keyframes · transition · :hover · clip-path · mix-blend-mode · inline SVG · pointer / mouse tracking · requestAnimationFrame · CSS grid · flex-wrap

```css
.paper { position: relative; box-shadow: 0 1px 0 rgba(0, 0, 0, 0.4), 0 12px 24px rgba(0, 0, 0, 0.35), 0 30px 60px rgba(0, 0, 0, 0.25) }
.grain { position: absolute; inset: 0; opacity: 0.22; mix-blend-mode: multiply }
.masthead { border-bottom: 3px double var(--ink); border-top: 1px solid var(--ink); text-transform: uppercase; position: relative }
.m-center { text-transform: uppercase }
.hero { border-bottom: 1px solid var(--ink); position: relative }
.kicker-row { margin-bottom: 12px; text-transform: uppercase }
.title { margin-bottom: 10px }
.t1 { margin-bottom: -4px }
.t2 { text-transform: uppercase }
.tag-line { margin-bottom: 14px }
.hero-meta { border-top: 1px solid var(--ink); margin-top: 14px; padding-top: 10px }
.hero-meta div { text-transform: uppercase }
```

```js
addEventListener("mouseenter", () => {
addEventListener("mouseleave", () => {
addEventListener("mousemove", (e) => {
requestAnimationFrame(() => {
```

### [Surfin' Bird — Beach Shack Menu (CodePen Challenge: Menu Layout)](https://codepen.io/Deva-Kumar-the-bold/pen/EaNyLbz)

held: fixed button.scroll-top | on scroll: span.menu-section__icon: transform+top ×6 | on hover of li.menu-item: span.menu-section__icon: transform+top ×6, span.menu-item__badge: transform ×3, span.header__badge: shadow, span.accent: transform, span.neon-sign: opacity, li.menu-item: transform+background+shadow | made with: position: fixed · @keyframes · transition · :hover · scroll listener · CSS grid · grid spans (bento) · flex-wrap

### [Responsive Grid Layout](https://codepen.io/alexander-sands/pen/azBbWvM)

made with: CSS grid · grid spans (bento)

### [CSS Bento Grid Layout · Hover Effects](https://codepen.io/Jiironimo/pen/pvNoNPZ)

on hover of div.card: div.card: transform+top ×2 | made with: @keyframes · transition · :hover · custom properties driven by JS · pointer / mouse tracking · CSS grid · grid spans (bento)

```css
header { margin-bottom: 2.2rem; opacity: 0; animation: up 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s forwards }
.eyebrow { text-transform: uppercase; margin-bottom: 0.55rem }
.bento { opacity: 0; animation: up 0.8s cubic-bezier(0.22,1,0.36,1) 0.25s forwards }
.card { position: relative; transition: border-color 0.3s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1) }
.card:hover { transform: translateY(-2px) }
.card::before { position: absolute; inset: 0; opacity: 0; transition: opacity 0.4s }
.card:hover::before { opacity: 1 }
.c1-bg { position: absolute; inset: 0 }
.c1-content { position: relative }
.c1-tag { text-transform: uppercase; margin-bottom: 1.2rem }
.c1-title { margin-bottom: 0.8rem }
.c1-bottom { position: relative; padding-top: 1.4rem; border-top: 1px solid var(--border); margin-top: 1.4rem }
```

```js
addEventListener('mousemove', e => {
style.setProperty('--mx', (e.clientX - r.left) + 'px')
style.setProperty('--my', (e.clientY - r.top) + 'px')
```

### [Grid layout columns. center column](https://codepen.io/tomhermans/pen/RNowROq)

made with: mix-blend-mode · CSS grid · aspect-ratio · object-fit

```css
.features__header { margin-bottom: var(--spacing-lg) }
.features__column { position: relative }
.features__image { transform: translatey(-4vw); mix-blend-mode: multiply }
.features__header { margin-bottom: var(--spacing-md) }
```

### [Flexbox Layout](https://codepen.io/alexander-sands/pen/VYmZrbX)

made with: flex-wrap

```css
.page .header { margin-bottom: var(--mainPadding) }
.page .footer { margin-top: var(--mainPadding) }
.page .header .links { margin-top: var(--mainPadding) }
```

### [Article with sidebar containing sticky element](https://codepen.io/mdove-sm/pen/EagrOKz)

held: sticky div.sticky | made with: position: sticky · CSS grid

```css
.layout__sticky .sticky { position: sticky; top: 10px }
.layout__main { position: relative }
.layout__main { margin-top: 4rem }
.layout__main { padding-top: 1rem }
```

### [CSS Grid Page Layout](https://codepen.io/kistasaurus/pen/LERXazW)

made with: container queries · CSS grid · object-fit

```css
.margin-width { margin-top: var(--margin); margin-bottom: var(--margin) }
& > p:last-child { margin-bottom: 0 }
h1 { margin-top: 0; margin-bottom: calc(var(--margin) / 2) }
h2 { margin-bottom: calc(var(--margin) / 2) }
& > h2:first-child { margin-top: 0 }
& > p:last-child { margin-bottom: 0 }
```

### [UX Stuff](https://codepen.io/John-Carruthers/pen/ByLGpLO)

on hover of button.order-tracking: button.order-tracking: background | made with: :hover · :focus-visible

```css
.order-header { box-shadow: 0px 0px 10px 1px #CFD8DC }
```

### [Candy Heart Grid - Responsive Layout with CSS Grid & Interactive Transformation](https://codepen.io/l2chisholm/pen/ogzqoOL)

made with: transition · :hover · 3D (perspective / preserve-3d) · CSS grid · auto-fit / auto-fill grid · CSS-only state (:checked / :target)

```css
.heart { position: relative; transform: rotate(-45deg) perspective(500px) rotateX(8deg); box-shadow: inset -4px -4px 8px rgba(0, 0, 0, 0.12), inset 4px 4px 8px rgba(255, 255, 255, 0.35), 0 6px 12px rgba(0, 0, 0, 0.18); transition }
.heart::before, .heart::after { position: absolute }
.heart::before { top: -45px }
.heart::after { top: 0 }
.heart span { position: absolute; inset: 0; transform: rotate(45deg) }
.heart:hover { transform: rotate(-45deg) perspective(500px) rotateX(0deg) scale(1.06); box-shadow: inset -4px -4px 8px rgba(0, 0, 0, 0.12), inset 4px 4px 8px rgba(255, 255, 255, 0.35), 0 10px 18px rgba(0, 0, 0, 0.22) }
#toggle:checked ~ .grid .heart:first-child { transform: rotate(-45deg) perspective(500px) rotateX(0deg) scale(1.06) }
.message { margin-top: 16px; opacity: 0; transition: opacity 0.4s ease }
#toggle:checked ~ .message { opacity: 1 }
```

### [Responsive Layout Without Media Queries](https://codepen.io/l2chisholm/pen/EagEwQL)

on hover of div.card: div.card: transform+color+shadow+top | made with: transition · :hover · CSS grid · auto-fit / auto-fill grid

```css
.title { margin-bottom: 10px }
.instruction { margin-bottom: 30px }
.card { transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.1) }
.card:hover { transform: scale(1.08); box-shadow: 0 10px 25px rgba(0,0,0,0.25) }
```

### [y2k button menu bar webpage layout](https://codepen.io/boyblythe/pen/wBzKEOp)

held: sticky nav | made with: position: sticky · :hover

```css
nav { position: sticky; top: 0px }
nav a { text-transform: uppercase }
nav a:hover { border-style: inset; position: relative; top: 2px }
header { margin-top: 10px }
```

### [phone app button menu webpage layout](https://codepen.io/boyblythe/pen/QwKjVYx)

on hover of a.: a.: shadow | made with: :hover · flex-wrap

```css
#phone-case { position: relative; top: 100px }
nav { border-top: 15px solid black; border-bottom: none; box-shadow: 2px 2px grey }
nav a { box-shadow: 2px 2px 3px grey }
nav a:hover { box-shadow: 2px 2px 3px grey inset }
#home-button { border-bottom: 3px solid black; box-shadow: 2px 2px grey }
main { box-shadow: 2px 2px 3px lightgrey }
```

### [minimal tiny 3 column website layout](https://codepen.io/boyblythe/pen/qEaOMJE)

made with: :hover

```css
main { border-bottom: 1px dashed black }
footer { padding-top: 3px }
```

### [utterly puny webpage layout](https://codepen.io/boyblythe/pen/LERPqga)

made with: nothing recognised — read the code

```css
#title { border-bottom: 1px dashed black }
#nav { position: absolute }
footer { position: absolute; top: 328px; padding-top: 5px }
```

### [Prototype - CSS](https://codepen.io/tillfour/pen/NPrZgRE)

made with: nothing recognised — read the code

### [Prototype - Pesticide](https://codepen.io/tillfour/pen/xbONZNN)

made with: nothing recognised — read the code

### [cute simple dashed border website blog layout](https://codepen.io/boyblythe/pen/QwEzedx)

made with: :hover · CSS grid

```css
nav a { margin-bottom: 10px; border-bottom: 1px dashed black }
#corner { border-bottom: 1px dashed black }
#header { border-bottom: 1px dashed black }
#footer { border-top: 1px dashed black }
```

### [responsive masonry layout with column-count](https://codepen.io/vii120/pen/MYeZYGg)

made with: transition · multi-column masonry (columns) · aspect-ratio · CSS-only state (:checked / :target)

```css
.wrapper .img-box { margin-bottom: var(--gap) }
.title { margin-bottom: 12px }
label { margin-bottom: 24px }
label .toggle-btn:before { transition: all 0.25s; position: relative }
input:checked ~ .wrapper .img-box:before { opacity: 1 }
.img-box { position: relative }
.img-box:before { position: absolute; inset: 0; opacity: 0; transition: all 0.2s }
```

### [File Browser](https://codepen.io/jkantner/pen/PwzaqxR)

on scroll: button.view-list__item: background | made with: transition · :hover · :focus-visible · backdrop-filter · CSS grid · auto-fit / auto-fill grid · grid spans (bento) · flex-wrap · aspect-ratio · arrow-key navigation

```css
body, button, input, select { transition: background-color var(--trans-dur), border-color var(--trans-dur), color var(--trans-dur) }
header { border-bottom: 1px solid var(--border); margin-bottom: 1px; transition: border-color var(--trans-dur) }
*:focus-visible { outline-offset: 2px }
[dir=rtl] .lucide-arrow-left, [dir=rtl] .lucide-chevron-right, [dir=rtl] .lucide { transform: scaleX(-1) }
.card { transition: background-color var(--trans-dur) }
.card__title { margin-bottom: 1em }
.file-browser { transition: background-color var(--trans-dur), border-color var(--trans-dur) }
.file-browser__back-button:disabled { opacity: 0.5 }
.file-browser__empty .lucide { margin-bottom: 1em; transition: color var(--trans-dur) }
.file-info { border-top: 1px solid var(--border); box-shadow: 0 0 0.75em rgba(0, 0, 0, 0.2); position: absolute; bottom: 0; transform: translateY(100%); transition: background-color var(--trans-dur), border-color var(--trans-dur), vi }
.file-info--in { transform: translateY(0) }
.file-info__close { transition: background-color var(--trans-dur) }
```

### [Win98 layout](https://codepen.io/Trash-Orbit_404/pen/ogLGNXg)

made with: CSS grid

```css
.win98-window { border-top: 1px solid #FFFFFF; border-bottom: 1px solid #404040 }
.win98-btn { border-top: 1px solid #FFFFFF; border-bottom: 1px solid #404040 }
.win98-content { border-bottom: 2px solid #FFFFFF }
.win98-post img { border-top: 2px solid #404040; border-bottom: 2px solid #FFFFFF }
.win98-img-row img { border-top: 2px solid #404040; border-bottom: 2px solid #FFFFFF; margin-bottom: 0 }
```

### [AI Chat Layout](https://codepen.io/jkantner/pen/NPrbXVL)

on scroll: button.chatbot__suggestion: color+shadow | made with: @keyframes · transition · :hover · :focus-visible · mask · requestAnimationFrame · CSS grid · flex-wrap · arrow-key navigation

```css
body, button, input, textarea { transition: background-color var(--trans-dur), box-shadow var(--trans-dur), color var(--trans-dur), opacity var(--trans-dur) }
.chatbot__icon--gradient { box-shadow: 0 0.75em 2em rgba(0, 0, 0, 0.3); position: relative }
.chatbot__icon--gradient::before { position: absolute; inset: 10% }
.chatbot__icon-wrapper { margin-bottom: 0.75em }
.chatbot__title { margin-bottom: 3.5rem }
.chatbot__suggestion { position: relative }
.chatbot__suggestion:before { box-shadow: 0 0.375em 0.5em rgba(255, 255, 255, 0.2) inset, 0 -0.25em 0.25em rgba(0, 0, 0, 0.1) inset; position: absolute; inset: 0; opacity: 0; transition: opacity var(--trans-dur) }
.chatbot__suggestion:hover, .chatbot__suggestion:focus-visible { box-shadow: 0 0.75em 1em var(--blue600-02) }
.chatbot__suggestion:hover:before, .chatbot__suggestion:focus-visible:before { opacity: 1 }
.chatbot__suggestion-tag:disabled { opacity: 0.5 }
.chatbot__suggestion-tags { margin-bottom: 0.75em }
.chatbot__suggestions-box { box-shadow: 0 4.5em 4.5em rgba(0, 0, 0, 0.2); transition: background-color var(--trans-dur) }
```

```js
requestAnimationFrame(calculateWidth)
```

### [Blog Page with Grid Breakouts](https://codepen.io/MarkimusMaximus/pen/azZBEJg)

made with: CSS grid · aspect-ratio · object-fit

```css
img { object-position: top }
```

### [Blog Layout](https://codepen.io/kirbypoyo100/pen/raLxxvw)

made with: nothing recognised — read the code

```css
article { margin-bottom: 1rem; box-shadow: 0 0 5px rgba(0,0,0,0.1) }
```

### [Corner Ribbon Card (CSS Only)](https://codepen.io/craftcodestudio/pen/gbMaXXz)

made with: CSS grid

```css
.ccs-ribCard { box-shadow: 0 18px 40px rgba(0, 87, 189,.3); position:relative }
.ccs-rib { position:absolute; top:14px; transform: rotate(45deg) }
```

### [Sticky Navbar with “Active Pill” Hover (CSS Only)](https://codepen.io/craftcodestudio/pen/LEZpOEN)

held: sticky nav.ccs-pillNav | on hover of a.ccs-pillItem: a.ccs-pillItem: transform+background+top | made with: position: sticky · transition · :hover

```css
.ccs-pillNav { position:sticky; top:16px; box-shadow: 0 18px 40px rgba(0,0,0,.08) }
.ccs-pillItem { transition: background .18s ease, transform .18s ease }
.ccs-pillItem:hover { transform: translateY(-1px) }
```

### [Pricing Cards with “Featured” Badge (CSS Only)](https://codepen.io/craftcodestudio/pen/jErPojQ)

made with: CSS grid

```css
.ccs-priceCard { position:relative; box-shadow: 0 18px 40px rgba(0,0,0,.08) }
.ccs-priceCard.is-featured { transform: translateY(-4px) }
.ccs-badge { position:absolute; top:12px }
```

### [Step Progress (CSS Only)](https://codepen.io/craftcodestudio/pen/GgqJabM)

made with: CSS grid

```css
.ccs-steps { box-shadow: 0 18px 40px rgba(0,0,0,.08) }
```

### [Icon Sidebar Mini (CSS Only)](https://codepen.io/craftcodestudio/pen/qENdMvv)

on hover of a.ccs-sideItem: a.ccs-sideItem: transform+background+color+top | made with: transition · :hover · CSS grid

```css
.ccs-side { box-shadow: 0 18px 40px rgba(0,0,0,.08) }
.ccs-sideItem { transition: transform .15s ease, background .15s ease }
.ccs-sideItem:hover { transform: translateY(-2px) }
```

### [Smart CSS Cards | Hover Highlight Layout](https://codepen.io/fyildiz1974/pen/QwELmNN)

on hover of div.cards: div.card: transform+opacity+top ×2, div.card: transform+top | made with: transition · :hover · CSS grid

```css
h1 { margin-bottom: 24px }
.card { transition: 0.3s ease }
.cards:hover .card { opacity: 0.4; transform: scale(0.96) }
.cards .card:hover { opacity: 1; transform: scale(1.05) }
.card h3 { margin-top: 0 }
.card p { opacity: 0.8 }
```

### [App Layout #1](https://codepen.io/Destro-ze-worldo/pen/bNpZpBW)

made with: CSS grid

```css
nav, section, main, aside { padding-top: 24px }
```

### [Snow Shelves (Colliders)](https://codepen.io/kitjenson/pen/EaKexmd)

made with: canvas 2D · CSS grid · auto-fit / auto-fill grid

```css
#snowCanvas { position: absolute; top: 0 }
header { top: 0; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) }
.content { position: relative }
.product-hero { margin-bottom: 80px }
.product-image { box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) }
.image-placeholder { opacity: 0.7 }
button { margin-top: 20px }
.features { margin-bottom: 80px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) }
.product-card { box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) }
footer { margin-top: 50px; position: relative }
```

### [Flex Box](https://codepen.io/Yatharth-Baranwal/pen/myPjwvR)

made with: flex-wrap

### [Simple Article (Grid, Full Bleed)](https://codepen.io/adamstuartclark/pen/jEqxrQR)

made with: :hover · :focus-visible · CSS grid

```css
&::before { position: absolute; top: 0; box-shadow: inset 0 -1ex 0 0 var(--clr-brand) }
:where(h2, h3, h4, h5, h6) { margin-top: 0 }
.action { margin-top: 2em }
img { outline-offset: 0.5rem }
&:focus-visible { outline-offset: 2px }
```

### [Interactive display: block Demo](https://codepen.io/ajay-dhangar/pen/EaKEPeL)

made with: nothing recognised — read the code

### [Login/Register](https://codepen.io/mollerstudio/pen/pvyayWx)

on scroll: div.blob: transform+top, div.blob-2: transform+top | on hover of div.btn-row: div.blob: transform+top, div.blob-2: transform+top | made with: @keyframes · transition · :hover · CSS grid · CSS-only state (:checked / :target)

```css
:root { --blob-opacity: 1.0; --blob2-opacity: 1.0 }
:root { --blob-opacity: 1.0; --blob2-opacity: 1.0 }
& footer { margin-top: 2rem; border-top: var(--line); padding-top: 1.5rem }
h1 { text-transform: uppercase }
label { text-transform: uppercase }
input { border-bottom: 2px solid var(--input-border); transition: border-color 0.3s ease }
.btn-row { margin-top: 0.5rem }
button { text-transform: uppercase; transition: all 0.3s var(--ease) }
.btn-login:hover { box-shadow: 0 8px 20px rgba(228, 255, 26, 0.4); transform: translateY(-2px) }
.btn-register:hover { box-shadow: 0 8px 20px rgba(0,0,0,0.1); transform: translateY(-2px) }
.checkbox-label, .forgot { text-transform: uppercase; transition: color 0.2s }
.custom-check { transition: all 0.2s }
```

### [Art-Directed Fullscreen Background Images using Picture](https://codepen.io/mark_sottek/pen/LENeQNV)

held: fixed div.marquis-cover | made with: position: fixed · object-fit · srcset / sizes

```css
.marquis-cover { position: fixed; inset: 0 }
.marquis-cover picture, .marquis-cover img { object-position: center }
```

### [CSS Perspective & Transform: Stacked Card](https://codepen.io/kazmi066/pen/bNpYqZL)

on scroll: div.layer: transform+top ×4, div.card-visual: transform+top, div.card-description: transform+opacity+top | made with: transition · :hover · 3D (perspective / preserve-3d) · inline SVG

```css
.card-container { position: relative; perspective: 1200px }
.card-visual { position: relative; transition: transform 0.6s var(--transition-curve) }
.card-container:hover .card-visual { transform: rotateX(5deg) rotateY(-5deg) translateY(-10px) }
.layer { position: absolute; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); transition: all 0.6s var(--transition-curve) }
.layer-phone { top: 50%; transform: translate(-50%, -50%) scale(0.9) }
.phone-notch { position: absolute; top: 0 }
.phone-ui-row { margin-top: 10px }
.layer-diagram { top: 45%; transform: translate(-50%, -50%) scale(0.9) }
.layer-map { top: 40%; transform: translate(-50%, -20%) }
.map-path { position: absolute; opacity: 0.5 }
.layer-white-card { position: absolute; bottom: 20px; box-shadow: 0 -10px 20px rgba(255, 255, 255, 0.5); transition: transform 0.6s var(--transition-curve) }
.card-container:hover .layer-phone { transform: translate(-90%, -60%) rotate(-15deg) scale(1) }
```

### [SmolCSS - Smol Responsive Flexbox Grid](https://codepen.io/mirko68/pen/xbVxoyE)

made with: CSS grid · flex-wrap

### [Creepy Newspaper Mask Animated Frames](https://codepen.io/hernandack/pen/zxrJVEo)

held: fixed div.hint, fixed div.overlay-darkness, fixed div.overlay-hidden-text | made with: position: fixed · mask · custom properties driven by JS · pointer / mouse tracking · CSS grid · multi-column masonry (columns) · aspect-ratio · object-fit

```css
.hint { position: fixed; top: 10px; transform: translateX(-50%) }
.news__header { padding-bottom: 1rem }
.news__header__title { padding-top: 0.2em }
.news__info { text-transform: capitalize }
img { object-position: center top }
.news__column { padding-top: 1rem }
.overlay-darkness { position: fixed; inset: 0; mask-image: radial-gradient( circle at var(--mouse-x) var(--mouse-y), transparent 120px, black 130px ); -webkit-mask-image: radial-gradient( circle at var(--mouse-x) var(--mouse-y), transparent }
.overlay-hidden-text { position: fixed; inset: 0; mask-image: radial-gradient( circle at var(--mouse-x) var(--mouse-y), black 120px, transparent 130px ); -webkit-mask-image: radial-gradient( circle at var(--mouse-x) var(--mouse-y), black 120px }
&:nth-child(1) { top: 25% }
&:nth-child(2) { top: 80% }
&:nth-child(3) { top: 50% }
```

```js
addEventListener("mousemove", (e) => {
style.setProperty("--mouse-x", `${e.clientX}px`)
style.setProperty("--mouse-y", `${e.clientY}px`)
addEventListener("mousemove", handleMouseMove)
```

### [Flexbox Playground – Interactive Panel for CSS Flex Properties](https://codepen.io/adiadila123/pen/ogbPxLb)

on hover of button.btn: button.btn: filter, div.item: transform+top | made with: transition · :hover · backdrop-filter · <details> · CSS grid · flex-wrap

```css
.btn:hover { filter: brightness(1.08) }
.panel { backdrop-filter: blur(8px) }
.panel h2 { margin-top: 6px }
.preview { position: relative }
.item { transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease }
.item:hover { transform: translateY(-2px) }
.item.selected { box-shadow: 0 18px 50px rgba(56, 189, 248, 0.35) }
.hint { position: absolute; bottom: 10px }
pre { padding-top: 8px }
```

### [Grid composition](https://codepen.io/kazmi066/pen/jEWYXqo)

made with: transition · :hover · custom properties driven by JS · CSS grid · auto-fit / auto-fill grid

```css
.demo-row { margin-bottom: 2rem }
.item { transition: all 0.3s ease; position: relative }
.item::before { position: absolute; inset: 0; opacity: 0; transition: opacity 0.3s ease }
.item:hover { transform: translateY(-2px) }
.item:hover::before { opacity: 1 }
.controls { margin-bottom: 1.5rem }
.control-group { margin-bottom: 1rem }
.control-group:last-child { margin-bottom: 0 }
.control-group label { margin-bottom: 0.5rem }
input[type="range"]::-webkit-slider-thumb { transition: all 0.2s ease }
input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.1) }
input[type="range"]::-moz-range-thumb { transition: all 0.2s ease }
```

```js
style.setProperty('--grid-min-item-size', `${value}rem`)
style.setProperty('--gutter', `${value}rem`)
```

### [Article Card Layout (inspired by Arstechnica)](https://codepen.io/MarkimusMaximus/pen/jEWYGwB)

made with: CSS grid · aspect-ratio · object-fit

```css
&:after { position: absolute; bottom: 3px }
&:after { bottom: 0; position: absolute }
```

### [SmolCSS - Smol Responsive CSS Grid](https://codepen.io/BiljanaB/pen/XJXeVOq)

made with: CSS grid · auto-fit / auto-fill grid

### [Minimal Portfolio](https://codepen.io/ffffacsimile/pen/MYKpmBe)

held: sticky header.site-header | on hover of a.brand: a.brand: background | made with: position: sticky · transition · :hover · :focus-visible · backdrop-filter · CSS masonry (grid-lanes / masonry) · multi-column masonry (columns) · flex-wrap · lazy loading · <figure> / <figcaption>

```css
.site-header { position:sticky; top:0; backdrop-filter:blur(var(--blur)); -webkit-backdrop-filter:blur(var(--blur)); border-bottom:1px solid color-mix(in oklab, var(--text), transparent 90%) }
.button { box-shadow:var(--shadow) }
.button:hover,.button:focus-visible { filter:brightness(1.05) contrast(1.05) }
.button.ghost { box-shadow:none }
.card { box-shadow:var(--shadow); transition:transform .15s ease, box-shadow .15s ease }
.card:hover { transform: translateY(-2px) }
.card img { opacity:.001; transform: translateY(6px); transition: opacity .35s ease, transform .35s ease }
.card img.is-loaded { opacity:1; transform:none }
.card figcaption { border-top:1px solid color-mix(in oklab, var(--text), transparent 88%) }
.about,.contact { margin-top: clamp(40px, 8vw, 90px) }
.about h2,.contact h2 { margin-bottom:8px }
.contact-actions { margin-top:12px }
```

### [Rectpackr Layout Demo - Interactive Playground](https://codepen.io/styiannis/pen/qEbqMBZ)

made with: container queries · flex-wrap · aspect-ratio

```css
.controls-attributes { margin-bottom: 1em }
rectpackr-layout > * { opacity: 0.9 }
```

### [Elzero CSS-Assignments57-64_6](https://codepen.io/Akheel-A-Saleh/pen/OPMbRxB)

made with: CSS grid

```css
.grid > div { position: relative }
.grid > div::before { position: absolute; bottom: 0 }
.grid > div::after { position: absolute; bottom: 35px; transform: rotate(15deg) }
```

### [SmolCSS - Smol Responsive Flexbox Grid](https://codepen.io/dindinet-the-scripter/pen/YPwGRLp)

made with: CSS grid · flex-wrap

### [Rectpackr Layout Demo - Mixed Dimension Gallery](https://codepen.io/styiannis/pen/XJXjayR)

made with: flex-wrap · aspect-ratio

### [Rectpackr Layout Demo - Consistent Width Gallery](https://codepen.io/styiannis/pen/ogbzBXg)

made with: flex-wrap

### [SmolCSS - Smol Breakout Grid](https://codepen.io/lozenges/pen/emJZZow)

made with: CSS grid

### [Jurassic World](https://codepen.io/Jules-Miguel/pen/WbrQXZb)

made with: CSS grid · auto-fit / auto-fill grid

```css
.card { box-shadow: 0 4px 8px rgba(0,0,0,0.1) }
.flex-container { margin-top: 2rem }
.flex-container { box-shadow: 0 0 30px rgba(141, 154, 55) }
```

### [round layout with css sin/cos](https://codepen.io/vii120/pen/ByjopxB)

made with: @starting-style · transition · :hover · mix-blend-mode · CSS trigonometry · custom properties driven by JS

```css
.wrapper { position: relative }
.circle { position: absolute; inset: 0; transform: translate(calc(cos(var(--rotation)) * var(--radius)), calc(sin(var(--rotation)) * var(--radius))); transition: all 0.3s; will-change: background, box-shadow }
.circle:before { position: absolute; mix-blend-mode: screen; opacity: 0; transition: all 0.3s }
.circle:hover { box-shadow: 2px 2px 12px var(--color) }
.circle:hover:before { opacity: 1 }
.circle { opacity: 0; transform: none }
```

```js
style.setProperty('--total', avatars.length)
style.setProperty('--i', i)
```

### [Search](https://codepen.io/John-Carruthers/pen/vELEaxw)

on hover of li.fruit: li.fruit: shadow | made with: transition · :hover · inline SVG · CSS grid · auto-fit / auto-fill grid

```css
input, label { filter: none }
.frm-group { box-shadow: -6px -6px 6px #FFF, 6px 6px 6px #90CAF9 }
.list-wrapper { position: relative }
.fruit { box-shadow: -3px -3px 3px #FFF, 3px 3px 3px #90CAF9; transition: box-shadow .4s ease }
.fruit:hover { box-shadow: 3px 3px 3px #FFF, -3px -3px 3px #90CAF9; transition: box-shadow .2s ease }
```

### [css-flexbox-grid](https://codepen.io/Hi-mohammad/pen/gbPbowm)

made with: CSS grid · object-fit

```css
.header { margin-bottom: 15px }
```

### [Container Queries: Diseño adaptable con HTML y CSS](https://codepen.io/CarlosAndresAlzate/pen/PwZYqwv)

made with: CSS grid

```css
.hero-title { text-transform: uppercase }
.hero-img { box-shadow: 3px 3px 25px 5px rgba(0, 0, 0, 0.5) }
```

### [Hexagons](https://codepen.io/matthewcsimpson/pen/KwdELrY)

on hover of li.hexagon: div.hexagon_content: background | made with: transition · :hover · clip-path · flex-wrap

```css
.hexagons { padding-bottom: 11.2% }
.hexagon { position: relative; will-change: transform }
.hexagon::after { padding-bottom: 86.6% }
.hexagon .hexagon_rotate { position: absolute; padding-bottom: 110.851%; transform: rotate3d(0, 0, 1, -60deg) skewY(30deg) }
.hexagon .hexagon_rotate * { position: absolute }
.hexagon .hexagon_rotate .hexagon_content { transform: skewY(-30deg) rotate3d(0, 0, 1, 60deg) }
.hexagon_title { text-transform: capitalize; bottom: 50%; padding-top: 50% }
.hexagon_text { top: 50%; text-transform: uppercase }
.hexagon_image { position: absolute; inset: 0; background-position: center center; -webkit-clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%) }
.hexagon_image::before, .hexagon_image::after { position: absolute; inset: 0; opacity: 0 }
.hexagon_image::after { transition: opacity 0.3s ease }
.hexagon_content__active:hover .hexagon_image::after { opacity: 1 }
```

### [Petshop_landing_desktop](https://codepen.io/Forte_high/pen/KwdbraN)

made with: CSS grid

```css
.home { position: relative; background-position: center left }
#c1, #c2 , #c3 { position: relative }
.home .steps .circles { position: absolute; top: -10px }
.home .steps { border-top: 3px solid var(--logo-beige-color); position: relative }
.dogscontainer { position: relative }
.tag { position: absolute }
.dogbox { position: relative }
.t1 { bottom: 50% }
.t2 { bottom: 50% }
.t3 { top: 15% }
.t4 { top: 15% }
.t5 { top: 5% }
```

### [grid-system-implementation](https://codepen.io/Hi-mohammad/pen/XJmyorG)

made with: nothing recognised — read the code

### [Responsive CSS Grid Layout – Holy Grail Design](https://codepen.io/sumanssaurabhdev/pen/YPyJLeE)

made with: CSS grid · named grid areas

### [Dumpstergram – Review Assignment](https://codepen.io/lizzyle/pen/QwjrMNE)

held: sticky aside.sidebar | made with: position: sticky · :hover · CSS grid · auto-fit / auto-fill grid · object-fit · lazy loading

```css
.app { position: relative }
.sidebar { position: sticky; top: 24px; box-shadow: var(--shadow) }
.nav { margin-top: 8px }
.nav-link { opacity:.9 }
.nav-link:is(:hover,.is-active) { opacity:1 }
.search { margin-top:auto; box-shadow: inset 0 1px 0 rgba(255,255,255,.03) }
.search img { opacity:.7 }
.card { box-shadow: var(--shadow) }
.avatar { box-shadow: inset 0 0 0 2px color-mix(in oklab, black 20%, transparent) }
.card-copy { margin-top: auto }
.sidebar { position: static }
```

### [vomit heart](https://codepen.io/marycuntrarian/pen/ogjdBjw)

made with: :hover · <details>

### [Responsive CSS Grid](https://codepen.io/cfunderburk/pen/KwdoNGL)

made with: CSS grid · auto-fit / auto-fill grid

```css
.smol-css-grid { margin-bottom: 48px }
```

### [Layout with some full-width / full-bleed - old school](https://codepen.io/atelierbram/pen/EaVEVQb)

made with: nothing recognised — read the code

```css
.inner-content h3 + p { padding-top: calc(var(--line-height) * .25em) }
```

### [SmolCSS - Smol Intrinsic Container](https://codepen.io/serkangundogdu13/pen/MYarobo)

made with: CSS grid

### [SmolCSS - Smol Responsive Flexbox Grid](https://codepen.io/den_smith/pen/ogjoXKm)

made with: CSS grid · flex-wrap

### [Command Menu](https://codepen.io/dilums/pen/NPGvPEW)

on hover of button.focus:outline-none: button.focus:outline-none: background | made with: carousel library

```css
.glow-online { box-shadow: 0px 0px 8.3px 3px rgba(185, 245, 152, 0.74) }
.glow-busy { box-shadow: 0px 0px 8.3px 3px #ff6c7b }
.contact { box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25) }
.cover { box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.25) }
```

### [Animated Text Branding with Neon Nav Menu || Gradient Text Logo & Stylized Nav Buttons || Split Layout with Glowing Text and Vertical Nav by - gopi chakradhar](https://codepen.io/Gopi-Chakradhar/pen/jEbwxJr)

on scroll: div.nav-button: transform+top | made with: @keyframes · transition · :hover

```css
.left-section { position: relative }
.left-section::before { position: absolute; top: -50%; animation: float 20s ease-in-out infinite }
0%, 100% { transform: translate(-50%, -50%) rotate(0deg) }
50% { transform: translate(-50%, -60%) rotate(180deg) }
.brand { position: relative }
.brand-title { margin-bottom: 2rem; position: relative }
.brand-title::after { position: absolute; bottom: -10px; transform: translateX(-50%); animation: glow 2s ease-in-out infinite alternate }
from { box-shadow: 0 0 10px #00f5ff, 0 0 20px #00f5ff, 0 0 30px #00f5ff }
to { box-shadow: 0 0 20px #ff0080, 0 0 30px #ff0080, 0 0 40px #ff0080 }
.nav-button { transition: all 0.5s ease }
.nav-button:hover { transform: scale(1.05) }
.nav-button:hover { transform: scale(1.03) }
```

### [whoa guess what its html only :0](https://codepen.io/Gia-Linh-Nguyn-ChiDaiNgocNghech/pen/YPyVaJe)

made with: nothing recognised — read the code

### [CSS - Practice - Card Layout](https://codepen.io/rzkvsoth-the-decoder/pen/azvWoEe)

on scroll: div.card: transform+shadow+top | made with: transition · :hover · flex-wrap · object-fit

```css
p { margin-bottom: 40px }
.card { box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease, box-shadow 0.3s ease }
.card:hover { transform: translateY(-5px); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) }
.card-content h3 { margin-top: 0 }
.card-content p { margin-bottom: 20px }
.card-button { transition: background-color 0.3s ease }
```

### [CSS - Practice - Navigation Bar](https://codepen.io/rzkvsoth-the-decoder/pen/gbaWYRg)

on hover of li.: a.nav-link: background+color | made with: transition · :hover · flex-wrap

```css
header { box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) }
.nav-link { transition: all 0.3s ease }
.nav-list { margin-top: 10px }
```

### [CSS - Practice - Image Text Layout](https://codepen.io/rzkvsoth-the-decoder/pen/ZYbeXYM)

made with: object-fit

```css
h1 { margin-bottom: 40px }
h2 { border-bottom: 2px solid #ddd; padding-bottom: 5px; margin-top: 40px; margin-bottom: 20px }
.pattern-section { margin-bottom: 30px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) }
.text-content h3 { margin-top: 0 }
.card { box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) }
```

### [CSS - Layout Advanced - Grid Details](https://codepen.io/rzkvsoth-the-decoder/pen/bNVqqMB)

made with: CSS grid · grid spans (bento) · named grid areas

```css
h1 { margin-bottom: 40px }
h2 { border-bottom: 2px solid #ddd; padding-bottom: 5px; margin-top: 40px; margin-bottom: 20px }
section { margin-bottom: 30px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) }
p { margin-bottom: 15px }
```

### [CSS - Layout Advanced - Flexbox Details](https://codepen.io/rzkvsoth-the-decoder/pen/ogjZNGp)

made with: flex-wrap

```css
h1 { margin-bottom: 40px }
h2 { border-bottom: 2px solid #ddd; padding-bottom: 5px; margin-top: 40px; margin-bottom: 20px }
section { margin-bottom: 30px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) }
p { margin-bottom: 15px }
.flex-container { margin-bottom: 20px }
```

### [CSS - Layout Basic - Flexbox](https://codepen.io/rzkvsoth-the-decoder/pen/OPypJgd)

made with: flex-wrap

```css
h1 { margin-bottom: 40px }
h2 { border-bottom: 2px solid #ddd; padding-bottom: 5px; margin-top: 40px; margin-bottom: 20px }
section { margin-bottom: 30px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) }
p { margin-bottom: 15px }
.flex-container { margin-bottom: 20px }
```

### [CSS - Box Model - Content Box Border Box](https://codepen.io/rzkvsoth-the-decoder/pen/myeWdrK)

made with: nothing recognised — read the code

```css
h1 { margin-bottom: 40px }
h2 { border-bottom: 2px solid #ddd; padding-bottom: 5px; margin-top: 40px; margin-bottom: 20px }
section { margin-bottom: 30px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) }
.description { margin-top: 15px }
.global-setting-section .container { box-shadow: inset 0 1px 3px rgba(0,0,0,0.1) }
```

### [Twine UI](https://codepen.io/megan-durham/pen/QwjKQQe)

on hover of a.button_link: div.button_front: background, a.button_link: color | made with: :hover · :has() · clip-path

```css
#interface { position: absolute; top: calc(5% + 1em) }
#top_menu { position: relative; top: 0 }
#content { position: absolute; top: 2.5em; bottom: 2.5em }
#status_pane { position: absolute; bottom: 0 }
.button_container { position: relative; top: 0 }
.half_button_container { position: relative; top: 0 }
.button_front { position: relative; top: calc(-100% + 1px) }
.button_back { position: relative; top: 0 }
.clip1 { clip-path: polygon( 10% 0%, 0% 50%, 10% 100%, 80% 100%, 100% 0%, 10% 0% ) }
.clip2 { clip-path: polygon( 0% 0%, 10% 100%, 90% 100%, 100% 0%, 0% 0% ) }
.clip3 { clip-path: polygon( 10% 0%, 0% 100%, 100% 100%, 90% 0%, 0% 0% ) }
.clip4 { clip-path: polygon( 20% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 20% 0% ) }
```

### [CSS - Layout Advanced - Flexbox Grid](https://codepen.io/rzkvsoth-the-decoder/pen/azvZjKX)

made with: CSS grid · grid spans (bento) · named grid areas · flex-wrap

```css
h1 { margin-bottom: 40px }
h2 { border-bottom: 2px solid #ccc; padding-bottom: 10px; margin-top: 40px; margin-bottom: 20px }
h3 { margin-top: 30px; margin-bottom: 15px }
.flexbox-section { margin-bottom: 40px }
.flex-container { margin-bottom: 20px }
.grid-container { margin-bottom: 20px }
```

### [google-search](https://codepen.io/Hi-mohammad/pen/ByozYba)

held: fixed a.github-link | made with: position: fixed · transition · :hover · object-fit

```css
a.github-link { position:fixed; bottom:40px }
```

### [CSS - Layout Basic - Display Position](https://codepen.io/rzkvsoth-the-decoder/pen/GgpZZEa)

held: fixed header.fixed-header, sticky div.sticky-example | made with: position: sticky · position: fixed

```css
body { padding-top: 60px }
h1, h2, h3 { margin-top: 0 }
.fixed-header { position: fixed; top: 0; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) }
.display-container { margin-bottom: 30px }
.position-container { margin-bottom: 30px; position: relative }
.static-box { position: static }
.relative-box { position: relative; top: 20px; margin-bottom: 20px }
.absolute-box { position: absolute; top: 50px }
.z-index-container { position: absolute; top: 100px }
.z-box { position: absolute }
.z-box1 { top: 10px }
.z-box2 { top: 30px }
```

### [grid pattern , alternate size and img position](https://codepen.io/gc-nomade/pen/QwjyPBe)

on scroll: div.: color+top ×2 | on hover of a.: div.: color ×2, a.: background, article.: color, img.: color, h2.: color, p.: color | made with: :hover · inline SVG · CSS grid · auto-fit / auto-fill grid · grid spans (bento) · object-fit

### [HTML - Semantic Layout - Nav Aside Main](https://codepen.io/rzkvsoth-the-decoder/pen/XJmmzPb)

on hover of li.: a.: background | made with: transition · :hover · CSS grid

```css
h1 { margin-bottom: 20px }
h2 { margin-top: 15px; margin-bottom: 10px }
h3 { margin-top: 15px; margin-bottom: 8px }
p { margin-bottom: 10px }
.layout-container { box-shadow: 0 2px 5px rgba(0,0,0,0.08) }
.main-nav li { margin-bottom: 10px }
.main-nav a { transition: background-color 0.3s }
.main-content section { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #eee }
.main-content section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0 }
.ad-block { margin-top: 15px }
.ad-block h3 { margin-top: 0 }
.ad-block a { margin-top: 10px }
```

### [HTML - Semantic Structure - Section Article Header Footer](https://codepen.io/rzkvsoth-the-decoder/pen/WbQQXxJ)

made with: :hover

```css
h1 { margin-bottom: 20px }
h2 { margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px }
h3 { margin-top: 20px; margin-bottom: 10px }
p { margin-bottom: 10px }
.example-section { margin-bottom: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.08) }
header.page-header { border-bottom: 2px solid #a7d9ff; margin-bottom: 20px }
header.page-header p { margin-top: 5px }
footer.page-footer { border-top: 1px solid #ccc; margin-top: 20px }
article { margin-bottom: 20px }
header.article-header { border-bottom: 1px dashed #ddd; padding-bottom: 10px; margin-bottom: 15px }
header.article-header h2 { margin-top: 0; border-bottom: none; padding-bottom: 0 }
footer.article-footer { border-top: 1px dashed #ddd; padding-top: 10px; margin-top: 15px }
```

### [HTML - div vs span](https://codepen.io/rzkvsoth-the-decoder/pen/NPGqwYo)

made with: nothing recognised — read the code

```css
h1 { margin-bottom: 20px }
h2 { margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px }
p { margin-bottom: 15px }
.example-section { margin-bottom: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.08) }
.div-example { margin-top: 15px }
.note { margin-top: 10px }
```

### [castle](https://codepen.io/gc-nomade/pen/GgpgrGw)

held: sticky nav, fixed input.sr-only, fixed div.scroll-indicator | on hover of a.active: div.: opacity+filter | made with: position: sticky · position: fixed · transition · :hover · :has() · clip-path · backdrop-filter · mix-blend-mode · custom properties driven by JS · scroll listener · CSS grid · CSS masonry (grid-lanes / masonry) · flex-wrap · object-fit · lazy loading · CSS-only state (:checked / :target)

```css
:root { --bg-top: url(https://images.pexels.com/photos/2832061/pexels-photo-2832061.jpeg); --bg-bottom: url(https://cdn.pixabay.com/photo/2018/01/30/22/39/architecture-3119812_640.jpg); --bgcolor-bottom: #333d }
a { text-transform: capitalize }
.sr-only { position: fixed; top: -100vh }
label[for="tognav"] { position:relative; transition: 0.2s }
[for="tognav"] b { position:absolute; top:-10px; bottom:-10px }
[for="tognav"]::before, [for="tognav"]::after { position: absolute; transition: 0.5; transition: 0.2s }
[for="tognav"]::before { margin-top: -10px }
[for="tognav"]::after { margin-top: 6px }
#tognav:checked ~ [for="tognav"]::before { rotate: 35deg; translate: 3px 0 }
#tognav:checked ~ [for="tognav"]::after { rotate: -35deg; translate: 3px 0 }
#tognav:checked ~ a , #nav:has(a:focus) a { opacity: 1 }
body::before, #nav::before { position: absolute; top: 0 }
```

```js
style.setProperty('--deg', deg+'deg')
addEventListener("scroll", scroll)
```

### [Happy baby and parent](https://codepen.io/Devendra-Singh-the-sans/pen/myJNxKd)

on hover of section.hero-section: a.nav-button: background+color | made with: transition · :hover · CSS grid · auto-fit / auto-fill grid · grid spans (bento) · flex-wrap · object-fit

```css
.container { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) }
.card { box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05) }
h1, h2, h3, h4, h5, h6 { margin-top: 0 }
p { margin-bottom: 0.5rem }
.hero-subtitle { margin-bottom: var(--gap-sm) }
.hero-title { margin-bottom: var(--gap-lg) }
.hero-nav .nav-button { transition: background-color 0.2s, color 0.2s, border-color 0.2s }
.hero-image img { box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) }
.section-definition h2 { margin-bottom: var(--gap-md) }
.definition-text p { margin-bottom: var(--gap-sm) }
.chart-bar-container { position: relative }
.chart-bar { position: absolute }
```

### [Inventory UI (Based on In Sound Mind)](https://codepen.io/Coconats/pen/yyNddwK)

held: sticky a.close, sticky a.close, sticky a.close | on hover of li.: li.: background | made with: position: sticky · transition · :hover · backdrop-filter · CSS grid · lazy loading · <figure> / <figcaption> · CSS-only state (:checked / :target)

```css
main { backdrop-filter: blur(5px); position: absolute; top: 0px }
.description { margin-top:0.75em; backdrop-filter: blur(5px) }
nav { padding-bottom:1em }
nav li { transition: 0.25s }
.stats { position: absolute; bottom: 0px }
.item { margin-top:-350px }
.held-item { position: absolute; bottom: 0px }
.tooltip { position: absolute; top:2.1em }
.map { position: absolute; top: 0px }
.content { position: absolute; top:2.1em }
.close { position: sticky; bottom: 0 }
```

### [Responsive Retro: Email Form Layout](https://codepen.io/Ngawang-Choeden/pen/NPqmrZO)

held: fixed div.crt-effect | on scroll: form.form-container: transform | on hover of button.submit-btn: button.submit-btn: transform+shadow+top | made with: position: fixed · @keyframes · transition · :hover · CSS grid · CSS-only state (:checked / :target)

```css
body { position: relative }
body::before { position: absolute; top: 0 }
.crt-effect { position: fixed; top: 0; animation: scanline 8s linear infinite }
0% { background-position: 0 0 }
100% { background-position: 0 100% }
.glitch-text { position: relative; animation: glitch 5s infinite }
0% { transform: translate(0) }
1% { transform: translate(-2px, 2px) }
2% { transform: translate(-2px, -2px) }
3% { transform: translate(2px, 2px) }
4% { transform: translate(2px, -2px) }
5% { transform: translate(0) }
```

```js
addEventListener('mouseenter', function() {
addEventListener('mouseleave', function() {
```

### [gsap/layout ❍ Color Spectrum Layout - Inspired by Dia Browser](https://codepen.io/filipz/pen/NPqJJyz)

held: fixed header, fixed div.nav-item, fixed div.nav-item, fixed div.nav-item, fixed div.nav-item, fixed div.nav-item, fixed div.bg-gradients, fixed div.gradient-overlay, fixed div.footer-container | on scroll: div.: opacity+filter ×15, div.nav-item: opacity ×3 | on hover of div.color-btn: div.: opacity+filter ×15, div.svg-container: transform+opacity+top, div.main-title: opacity, div.text-grid: opacity | made with: position: fixed · @keyframes · transition · :hover · clip-path · custom properties driven by JS · inline SVG · GSAP · ScrollTrigger · CSS grid

```css
body { text-transform: uppercase; transition: background-color 0.3s ease }
.svg-container, .text-grid, .main-title { opacity: 0 }
header { position: fixed; top: 0 }
.color-switcher { position: absolute; top: 2rem; transform: translateX(-50%) }
.color-btn { transition: transform 0.2s ease }
.color-btn:hover { transform: scale(1.2) }
.color-btn.active { transform: scale(1.3) }
.blur-toggle { position: absolute; top: 4.5rem; transform: translateX(-50%) }
.randomize-toggle { position: absolute; top: 4.5rem; transform: translateX(-50%) }
.blur-btn, .randomize-btn { text-transform: uppercase; position: relative; transition: transform 0.2s cubic-bezier(0.23, 1, 0.32, 1), color 0.3s ease }
.blur-btn::before, .randomize-btn::before { position: absolute; top: 0; opacity: 0; transition: opacity 0.2s cubic-bezier(0.23, 1, 0.32, 1), color 0.3s ease }
.blur-toggle:hover .blur-btn, .randomize-toggle:hover .randomize-btn { transform: translateX(8px) }
```

```js
gsap.registerPlugin(ScrollTrigger, SplitText)
style.setProperty( "--color-bg",
style.setProperty( "--color-text",
style.setProperty( "--color-text-light",
style.setProperty( "--color-text-lighter",
style.setProperty( "--bg-color",
style.setProperty( "--hover-color",
style.setProperty("--grad-color-1", colors[0])
```

### [Highlight Cards](https://codepen.io/jkantner/pen/ogXJXzX)

made with: transition · CSS grid · grid spans (bento) · aspect-ratio

```css
body { transition: background-color var(--trans-dur), color var(--trans-dur) }
.card, .card__header, .card__content { position: relative }
.card__bg { position: absolute; top: 0 }
.card__category { position: relative }
.card__category-icon { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.card__description { margin-bottom: 1.6em; opacity: 0.9 }
```

### [SmolCSS - Smol Document Styles](https://codepen.io/mrentropy/pen/qEdJYgE)

made with: nothing recognised — read the code

```css
main { margin-top: var(--layout-spacing) }
footer { margin-top: auto; padding-top: var(--layout-spacing) }
footer p { border-top: 1px solid #ccc; padding-top: 0.25em }
:is(h2, h3):not(:first-child) { margin-top: 2em }
article * + * { margin-top: 1em }
a { text-underline-offset: 0.15em }
```

### [CSS Subgrid - Horizontal Card Grid Demo](https://codepen.io/vtlanglois/pen/LEVgdqX)

made with: CSS grid · grid spans (bento)

```css
.grid-card { box-shadow: 0px 11px 15px -1px rgba(0, 0, 0, 0.54) }
section:not(:last-child) { margin-bottom: 32px }
```

### [magnews - newspaper theme](https://codepen.io/gc-nomade/pen/OPVBvoJ)

on hover of li.: a.: color | made with: :hover · :has() · mix-blend-mode · inline SVG · CSS grid · flex-wrap · object-fit

```css
h1 { text-transform: uppercase; filter:drop-shadow(0 0 2px) }
article P::first-letter { margin-top:.1em; text-transform:uppercase }
body { position:relative }
.pic img { mix-blend-mode:overlay; filter:brightness(120%) contrast(200%) grayscale(90%); position:relative }
.pic:hover img { filter:initial; mix-blend-mode:hard-light }
section { box-shadow:1px 0 }
article { box-shadow: 0 1px }
article:has(.pic):before { padding-top:9em }
article:nth-child(even):has(.pic):before { padding-top:0 }
:is(h2, h3, h4, h5, h6) { mix-blend-mode:difference }
:is(h2, h3, h4, h5, h6):first-child { border-bottom: double silver }
nav { margin-bottom:.25rem }
```

### [named layouts with variants](https://codepen.io/dmbdesignpdx/pen/JodZZgm)

made with: CSS grid · aspect-ratio · object-fit

```css
* { position: relative }
img { object-position: center }
```

### [Sticky Edge Two-Column Layout with CSS Variables](https://codepen.io/Keval-Virja/pen/YPXLbZd)

made with: custom properties driven by JS

```css
h1 { margin-bottom: 10px }
.layout-wrapper { --offset: ((100vw - var(--scrollbar-width, 0px) - 100%) / 2) }
.content-column { padding-top: var(--gap) }
```

```js
style.setProperty( "--scrollbar-width",
```

### [SaaS Landing Page](https://codepen.io/jkantner/pen/QwbrVXw)

held: fixed div.backdrop, fixed div.backdrop | made with: position: fixed · @keyframes · transition · :hover · :focus-visible · mask · backdrop-filter · 3D (perspective / preserve-3d) · CSS grid · aspect-ratio · CSS-only state (:checked / :target)

```css
h1, h2 { margin-bottom: 1.5rem }
h1 { padding-top: 5.5rem }
header { animation: fade-in 0.5s var(--ease-out-sine); box-shadow: 0 1px 0 light-dark(var(--gray200), var(--gray700)) }
nav { position: fixed; top: 0 }
nav a { transition: background-color var(--trans-dur) }
nav.closing, nav.open { animation: slide-from-left var(--trans-dur) var(--ease-in-out-sine) }
[dir=rtl] nav.closing, [dir=rtl] nav.open { animation-name: slide-from-right }
nav.closing { animation-name: slide-to-left }
[dir=rtl] nav.closing { animation-name: slide-to-right }
p { margin-bottom: 1.5em }
section { animation: fade-slide-up 1s 0.5s var(--ease-out-sine) forwards; opacity: 0; padding-top: 4.5em }
.backdrop { position: fixed; inset: 0 }
```

### [flexbox-and-grid](https://codepen.io/Hi-mohammad/pen/xbGXZob)

made with: CSS grid

### [Grid Layout | CSS](https://codepen.io/lutfiismail47/pen/raVzRMw)

made with: CSS grid · named grid areas

### [Portfolio Hero Section with Debug Borders | CSS Layout Tutorial](https://codepen.io/jamesneufeld/pen/VYLKOvZ)

on hover of a.: a.: color | made with: @keyframes · :hover

```css
h1 { margin-bottom: 1.5rem; text-transform: lowercase }
h2 { margin-bottom: 0.6rem }
h3 { margin-bottom: 0.5rem }
p { margin-bottom: auto }
0% { background-position: 0% }
100% { background-position: 100% }
.hero-top { margin-top: 30px }
.box { margin-bottom: 120px }
@keyframes bg-animation animates background-position
```

### [Roblox Arsenal UI](https://codepen.io/doel_javid/pen/QwbNjgy)

made with: transition · :hover · CSS grid · flex-wrap · object-fit

```css
footer { position: absolute; bottom: 8px; opacity: 0.5 }
img { filter: invert() }
#shop { position: relative }
#currency { position: absolute; bottom: 100% }
#product-preview { position: absolute; bottom: 0; box-shadow: 0 0 0 5px #000; transition: width 0.3s, height 0.3s }
```

### [gsap/lenis ❍ Layout Explorations with Gsap, Lenis and ScrollTrigger N°5](https://codepen.io/filipz/pen/ogXXXPJ)

held: fixed header.site-header, fixed div.gradient-reveal, fixed div.audio-enable, fixed div.preloader, fixed div.geometric-background, fixed div.center-circle | made with: clip-path · inline SVG

### [Masonry layout](https://codepen.io/blackfrom80s/pen/ByNBKbm)

made with: CSS masonry (grid-lanes / masonry) · multi-column masonry (columns)

```css
img { margin-bottom: 0.5rem }
```

### [responsive grid-row placement](https://codepen.io/Taluska/pen/YPPmQjL)

made with: nothing recognised — read the code

### [SmolCSS - Smol Scroll Snap](https://codepen.io/noobcoder137/pen/wBBLPdZ)

made with: scroll-snap · CSS grid

```css
.smol-scroll-snap { scroll-snap-type: x mandatory }
.smol-scroll-snap > * { scroll-snap-align: center; scroll-snap-stop: always }
```

### [SmolCSS - Smol Breakout Grid](https://codepen.io/arosesiejdev/pen/JooZOPJ)

made with: nothing recognised — read the code

### [layout / theme vS1](https://codepen.io/Nijikokun/pen/ByyxpdN)

on hover of a.: a.: color | made with: transition · :hover · flex-wrap · object-fit · CSS-only state (:checked / :target)

```css
.greyscale, .grayscale { filter: grayscale(0.9); transition: all .5s ease-in }
.greyscale:hover, .grayscale:hover { filter: grayscale(0.2) }
a { transition: color .2s ease-in }
nav { text-transform: uppercase }
.header { border-bottom: 1px solid var(--color-border-lighter) }
.footer { border-top: 1px solid var(--color-border-lighter) }
.header h1, .footer h1 { text-transform: uppercase }
.header h2, .footer h2 { text-transform: uppercase }
.legend { position: relative; margin-top: calc(var(--padding-sm) / 1.5) }
.legend-title { position: absolute; top: calc(var(--padding-sm) * -1.5) }
.legend-title h1 { text-transform: uppercase }
.avatar img { object-position: top }
```

### [Bootstrap Grid Responsive](https://codepen.io/Suneharakhan/pen/MYYwNNq)

made with: nothing recognised — read the code

```css
.box { margin-bottom: 20px }
```

### [SmolCSS - Smol Responsive CSS Grid](https://codepen.io/puckstein/pen/NPWmRzr)

made with: nothing recognised — read the code

### [Few minute landing, hero - When in doubt.](https://codepen.io/Bembit/pen/GgRzYex)

on hover of li.: a.: opacity | made with: transition · :hover · flex-wrap

```css
header { position: absolute; top: 0 }
.nav-links li a { transition: opacity 0.3s ease }
.nav-links li a:hover { opacity: 0.8 }
.btn { transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease }
.btn:hover { transform: translateY(-2px) }
.btn-cta { margin-top: 1.5rem }
.main-heading { margin-bottom: 1rem }
.main-heading span { opacity: 0; transform: translateY(30px) }
.sub-heading { opacity: 0.9 }
nav { position: relative }
.nav-links.active { position: absolute; top: calc(100% + 10px) }
.hero { padding-top: 80px }
```

### [SmolCSS - Smol Responsive Flexbox Grid](https://codepen.io/Bellette/pen/YPzBYvX)

made with: CSS grid · flex-wrap

### [Image to ASCII Art](https://codepen.io/jkantner/pen/OPJrMbp)

on hover of button.i2a__button: button.i2a__button: background | made with: canvas 2D · requestAnimationFrame

```js
requestAnimationFrame(textareaHeightUpdate)
```

### [Grid Template Areas with optional child elements](https://codepen.io/robert-hoekstra/pen/raNJeNb)

made with: :has() · CSS grid · named grid areas

```css
h1, h2 { margin-bottom: 10px }
h1 { border-bottom: 2px solid #eee; padding-bottom: 10px }
.section-grid { margin-bottom: 40px }
```

### [Mobile Responsive Grid & Flexbox Layout](https://codepen.io/wjhames/pen/bNGYdpz)

on hover of a.: a.: color | made with: transition · :hover · CSS grid · auto-fit / auto-fill grid · named grid areas

```css
p { padding-top: 2rem }
.nav-menu a:hover { transition: all 0.3s ease-in }
.footer-content .footer-links a:hover { transition: all 0.3s ease-in }
.features .feature-grid, .testimonials .testimonial-grid, .gallery .gallery-grid { margin-top: 1rem }
.testimonial-grid cite { margin-top: 0.5rem }
.contact-form { margin-top: 1rem }
.contact-form button:hover { transition: all 0.3s ease-in }
.faq-item { margin-bottom: 1rem }
```

### [Interactive CSS Grid Layout Visualizer and Editor with HTML/CSS/JS Code Export](https://codepen.io/haroon-brokha/pen/EaxXMjr)

on hover of button.button: button.button: background | made with: nothing recognised — read the code

### [CSS Grid Layout - No Flexbox](https://codepen.io/plaidpixel/pen/NPWRMey)

made with: nothing recognised — read the code

### [Fill the page Header, Body, Footer](https://codepen.io/yogit/pen/JoPBqzr)

made with: nothing recognised — read the code

### [Pricing](https://codepen.io/angrycat/pen/emOjbQo)

made with: nothing recognised — read the code

### [SmolCSS - Smol Responsive Sidebar Layout](https://codepen.io/Peter-Yarensky/pen/VYZBpYY)

made with: CSS grid

### [Challenge 15](https://codepen.io/Ajay-Kushwaha-the-scripter/pen/ZYzymMa)

made with: aspect-ratio

### [Challenge 11](https://codepen.io/Ajay-Kushwaha-the-scripter/pen/jENwexg)

made with: aspect-ratio

```css
.container { position: relative }
.div1 { position: absolute }
```

### [Challenge 3](https://codepen.io/Ajay-Kushwaha-the-scripter/pen/gbYRXOy)

made with: nothing recognised — read the code

### [Challenge 2](https://codepen.io/Ajay-Kushwaha-the-scripter/pen/jENwLQe)

made with: nothing recognised — read the code

### [Challenge 1](https://codepen.io/Ajay-Kushwaha-the-scripter/pen/jENwLmx)

made with: nothing recognised — read the code

### [WIP Email Email testing: Check tables have the correct roles](https://codepen.io/2kool2/pen/wBwBBXR)

made with: :has()

### [Content Break Out](https://codepen.io/lokmansalikoon/pen/qEWBNYO)

made with: object-fit

### [SmolCSS - Smol Responsive Flexbox Grid](https://codepen.io/jeffkwanyh/pen/azooKbY)

made with: CSS grid · flex-wrap

### [SmolCSS - Smol Document Styles](https://codepen.io/emarake/pen/qBewNBV)

made with: nothing recognised — read the code

### [SmolCSS - Smol Responsive Sidebar Layout](https://codepen.io/emarake/pen/vYoMBYx)

made with: CSS grid

### [SmolCSS - Smol Responsive Padding](https://codepen.io/emarake/pen/xxveKKG)

made with: CSS grid

### [SmolCSS - Smol Stack Layout](https://codepen.io/emarake/pen/zYgbggO)

made with: CSS grid · named grid areas · aspect-ratio

```css
.smol-stack-layout--video small { opacity: 0.8 }
.smol-stack-layout h3, .smol-stack-layout small { position: relative }
```

### [SmolCSS - Smol Breakout Grid](https://codepen.io/emarake/pen/wvVOVLy)

made with: CSS grid

### [SmolCSS - Smol Intrinsic Container](https://codepen.io/emarake/pen/yLmwmWG)

made with: CSS grid

### [SmolCSS - Smol Modern Centering](https://codepen.io/emarake/pen/OJKqKYO)

made with: CSS grid

### [SmolCSS - Smol Responsive Flexbox Grid](https://codepen.io/emarake/pen/OJKqKGO)

made with: CSS grid · flex-wrap

### [SmolCSS - Smol Responsive CSS Grid](https://codepen.io/emarake/pen/rNXRXRg)

made with: CSS grid · auto-fit / auto-fill grid

### [SmolCSS - Smol Document Styles](https://codepen.io/Bendroid23/pen/VwoRLzy)

made with: nothing recognised — read the code

```css
main { margin-top: var(--layout-spacing) }
footer { margin-top: auto; padding-top: var(--layout-spacing) }
footer p { border-top: 1px solid #ccc; padding-top: 0.25em }
:is(h2, h3):not(:first-child) { margin-top: 2em }
article * + * { margin-top: 1em }
a { text-underline-offset: 0.15em }
```

### [SmolCSS - Smol Scroll Snap](https://codepen.io/Bendroid23/pen/XWvGbgK)

made with: scroll-snap · CSS grid

```css
.smol-scroll-snap { scroll-snap-type: x mandatory }
.smol-scroll-snap > * { scroll-snap-align: center; scroll-snap-stop: always }
```

### [Dashboard Layout](https://codepen.io/Mohamed-Manbar/pen/eYqxXNR)

made with: CSS grid

### [joesaverage.blog](https://codepen.io/GarbledHamster/pen/PoMXdvd)

made with: nothing recognised — read the code

### [testwebpage](https://codepen.io/Jorge-Samuelle/pen/mdNzWPK)

held: fixed header | made with: position: fixed · lazy loading · <figure> / <figcaption>

```css
header { position: fixed }
.caja { padding-top: 40px; padding-bottom: 40px }
figure figcaption { margin-top: 20px }
#menu { padding-top: 50px; padding-bottom: 50px }
#menu article { vertical-align: top }
.card figure figcaption { margin-top: 20px }
label { margin-bottom: 10px }
```

### [SmolCSS - Smol Responsive CSS Grid](https://codepen.io/xogoddessdesigns/pen/zYgLBgz)

made with: CSS grid · auto-fit / auto-fill grid

### [MiniBlog (admin) 0.995](https://codepen.io/GarbledHamster/pen/dyxeOop)

held: fixed div.add-page-form, fixed div.expanded-overlay | on hover of button.: button.: background+color | made with: position: fixed · transition · :hover · scroll listener · CSS grid · auto-fit / auto-fill grid · flex-wrap · object-fit

```css
body { position: relative }
button:not([type="color"]) { transition: border-radius 0.3s ease, background 0.3s, color 0.3s }
.latest { text-transform: uppercase }
#command-input { transition: border-color 0.3s }
#status-message { margin-top: 10px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15); margin-bottom: 25px }
.add-page-form { margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); position: fixed; top: 50%; transform: translate(-50%, -50%) }
.add-page-form h2 { margin-bottom: 15px }
.form-buttons { margin-top: 15px }
.form-buttons button { transition: background-color 0.3s }
.latest-grid { position: relative }
.latest-grid-item { position: relative; transition: all 0.3s ease; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) }
.latest-grid-item:hover { transform: scale(1.05); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3) }
```

```js
addEventListener("scroll", () => handleCardScroll(item))
```

### [Flexible Gallery](https://codepen.io/kistasaurus/pen/jOgaqGV)

made with: container queries · flex-wrap

```css
.gallery { margin-bottom: 4rem }
&:before { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

### [Sua's light blue layout!](https://codepen.io/rosewoodhana/pen/zYgEbrb)

on hover of button.: button.: background | made with: :hover

```css
.wrapper { outline-offset: -1px; box-shadow: rgba(0, 0, 0, 0.7) 0px 5px 15px }
#left { padding-top: 20px }
#center { outline-offset: 1px }
button { margin-top: 10px }
.message { margin-bottom: 10px }
.message p { margin-top: 0 }
ul { list-style-position: inside }
#avatar { margin-top: 20px; outline-offset: 1px }
#right button { margin-bottom: 10px }
.message { margin-bottom: 10px }
```

### [Easy Tailwind Grid Layouts - RAM (repeat auto minmax)](https://codepen.io/sfearl1/pen/RwXZQyr)

on scroll: div.absolute: opacity | made with: mask · inline SVG · CSS grid · auto-fit / auto-fill grid

```css
&::after { top: -40%; translate: -50% -20%; filter: blur(130px); position: absolute }
.bevel { filter: drop-shadow(0 -1px 0px #fff) }
```

### [SmolCSS - Smol Flexible Unbreakable Boxes](https://codepen.io/faeworks/pen/dyxvJOB)

made with: CSS grid

```css
.smol-unbreakable-box footer { margin-top: 1rem }
```

### [SmolCSS - Smol Responsive Sidebar Layout](https://codepen.io/faeworks/pen/xxvqpRm)

made with: CSS grid

### [Unreality CyberTerminal Nexus Entropic Realm 9](https://codepen.io/aeon-flexx-dead-girl/pen/dyxNmYK)

on scroll: div.: background+top | on hover of li.: a.: color | made with: @keyframes · transition · :hover · pointer / mouse tracking

### [Cards Highlight Hover Effect](https://codepen.io/freeplayg/pen/VwomzWj)

on hover of img.: article.: transform+opacity+top ×4, article.: transform+background+top, img.: opacity+top | made with: transition · :hover · CSS grid · flex-wrap · object-fit

```css
article { transition: transform .2s, background .2s, opacity .2s }
section:hover article { transform: translateY(6px); opacity: .5; transition: transform 1s, background .2s, opacity .2s }
section article:hover { transform: translateY(-6px); opacity: 1 }
article img { object-position: center; opacity: 0; transition: opacity .2s }
section article:hover img { opacity: 1 }
```

### [Responsive layout with header, footer, nav using flexbox (2)](https://codepen.io/r-w-c/pen/abeZEvv)

made with: nothing recognised — read the code

```css
footer { bottom: 0 }
```

### [theForm](https://codepen.io/Quuui/pen/rNXeezv)

made with: nothing recognised — read the code

```css
p { margin-top: -10px; margin-bottom: 2em }
label { margin-top: 15px; margin-bottom: 5px }
input, select, textarea { margin-top: 5px }
```

### [Smart Layout](https://codepen.io/David-front/pen/jOgWQQR)

made with: container queries · CSS grid · auto-fit / auto-fill grid

### [Container queries Layout](https://codepen.io/David-front/pen/zYgrMmv)

made with: transition · :hover · :focus-visible · :has() · container queries · CSS grid · auto-fit / auto-fill grid · grid spans (bento) · object-fit

```css
h1, h2, h3 { text-transform: uppercase }
```

### [Fluid Lyaout](https://codepen.io/David-front/pen/qBebQoa)

on hover of a.btn: a.btn: color | made with: transition · :hover · :focus-visible · CSS grid

```css
:root { --content-inset: min(clamp(30rem, 52vw, 60rem), 100% - var(--gap)) }
.grid-breakout > * + * { margin-top: 2rem }
.btn { transition: color 250ms ease-in-out, border 250ms ease-in-out }
```

### [How to animate CSS Grid layouts (image grid project)](https://codepen.io/tutsplus/pen/ZEgYaOO)

held: fixed footer.page-footer | on scroll: article.card: filter+top | on hover of article.card: article.card: filter+top, article.card: filter, figcaption.: opacity | made with: position: fixed · transition · :hover · :has() · (hover: hover) gate · CSS grid · object-fit · <figure> / <figcaption>

```css
:root { --transition: all 1s }
.notification { position: absolute; top: 0 }
.grid, .sub-grid, .grid .card { transition: var(--transition) }
.grid { box-shadow: 0 15px 30px rgba(0, 0, 0, 0.35) }
figure { position: relative }
figcaption { opacity: 0 }
figcaption { opacity: 1; transition: opacity 0.5s 0.5s }
.page-footer { position: fixed; bottom: 50px }
```

### [Responsive Masonry Grid](https://codepen.io/DuskoStamenic/pen/YzmzOpP)

made with: CSS grid · auto-fit / auto-fill grid · grid spans (bento) · CSS masonry (grid-lanes / masonry)

### [Colorful Clouds](https://codepen.io/mountainash/pen/Yzombye)

on scroll: div.: transform+top ×2 | on hover of button.: div.: transform+top ×2 | made with: @keyframes · transition · :hover · aspect-ratio

```css
#colorfulclouds { position: absolute }
#colorfulclouds div { position: absolute; top: 10%; filter: blur(30px); opacity: 0.75; transition: all 3s; animation: rotate 10s linear infinite }
#colorfulclouds div:last-child { animation: rotate 10s linear infinite reverse; animation-delay: -5s }
from { transform: rotate(0deg) translate(50px) rotate(0deg) }
to { transform: rotate(360deg) translate(50px) rotate(-360deg) }
form { box-shadow: var(--c-shadow) }
legend { margin-bottom: 1em }
label { margin-bottom: 16px }
@keyframes rotate animates transform
```

### [Quiz. CSS Only](https://codepen.io/g0xff/pen/JjQQppB)

made with: :hover · :has() · flex-wrap · CSS-only state (:checked / :target)

```css
button[type="reset"] { box-shadow: 0px 1px 2px 1px #343 }
&:not(:has(input[type="checkbox"]:checked))::after { position: absolute; transform: translateX(-2vmin) translateY(-2vmin) }
&::after { position: relative }
& + article { opacity: 0.5 }
&::after { box-shadow: 0px 1px 2px 1px #343 }
&::before { position: absolute; transform: translateX(-2vmin) translateY(-2vmin) }
```

### [Demo: Netflix](https://codepen.io/peterbenoit/pen/ExBGKjY)

held: fixed div.sidebar, fixed a.ui-badge | made with: position: fixed · transition · :hover · scroll listener · object-fit

```css
.sidebar { position: fixed; top: 0 }
.nav-item { transition: color 0.3s, border-bottom 0.3s; border-bottom: 2px solid transparent }
.nav-item.active, .nav-item:hover { border-bottom: 2px solid #e50914 }
.main-content { padding-top: 0 }
.background-video { position: absolute; top: 0 }
.header { position: relative }
.header-info { position: absolute; top: 0 }
.header-info h1 { margin-bottom: 10px; text-transform: uppercase; margin-top: 0 }
.btn { transition: transform 0.3s ease, background-color 0.3s ease }
.btn:hover { transform: scale(1.05) }
.section { margin-bottom: 0; position: relative }
.section h2 { margin-bottom: 0 }
```

```js
addEventListener("scroll", () => {})
addEventListener("mouseenter", function () {
addEventListener("mouseleave", function () {
```

### [Navbar design with media query](https://codepen.io/Shrinithi-Murali/pen/QWXJWYv)

held: sticky nav.nav-bar | made with: position: sticky · :hover

```css
nav { box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); position: sticky; top: 0 }
```

### [SmolCSS - Smol Intrinsic Container](https://codepen.io/editor/vivalapanda/pen/0191a973-29db-7a29-83f7-9a67481f25af)

made with: CSS grid

### [layout8](https://codepen.io/Natural-Spi/pen/RwzByxQ)

made with: CSS grid · auto-fit / auto-fill grid

```css
#feature .grid li { box-shadow:0 0 6px rgba(0,0,0,0.5) }
```

### [layout7](https://codepen.io/Natural-Spi/pen/NWZBMxL)

made with: CSS grid · object-fit

```css
.content-wrapper { margin-bottom:5rem }
.products .image { margin-top:10rem; position:relative }
#products1 .text { position:absolute; top:12rem }
#products2 .text { position:absolute; top:12rem }
.content-wrapper { margin-bottom:5rem }
#products1 .text { position:absolute; top:4cqb }
#products2 .text { position:absolute; top:4cqb }
```

### [layout6](https://codepen.io/Natural-Spi/pen/gONjXem)

made with: flex-wrap · object-fit

```css
.section-title { margin-bottom:50px }
.section-title .en { margin-bottom:10px }
.section-title .ja { margin-bottom:36px }
#company { position:relative; margin-bottom:5rem }
#company .right { position: absolute; top: 115px }
#company .left { padding-top:5rem }
#company .info dt , #company .info dd { margin-bottom:0 }
#company .info dt { margin-top:10px }
#company .info dd { margin-top:10px }
#company { position:static }
#company .left, #company .right { position:static }
#company .right img { position:static }
```

### [layout3](https://codepen.io/Natural-Spi/pen/PorBJLP)

made with: nothing recognised — read the code

### [layout2](https://codepen.io/Natural-Spi/pen/jOjpGOP)

made with: nothing recognised — read the code

### [layout2](https://codepen.io/Natural-Spi/pen/WNqKZNN)

made with: nothing recognised — read the code

```css
#fashion { margin-top:5rem; background-position:center top; padding-top:60px }
```

### [SmolCSS - Smol Document Styles](https://codepen.io/dindinet-the-scripter/pen/KKjyjog)

made with: nothing recognised — read the code

### [Pokedex Page design](https://codepen.io/beteer/pen/oNrwPvx)

made with: nothing recognised — read the code

```css
.search-bar { position: relative }
.btn-submit { position: absolute; top: 0; bottom: 0 }
```

### [Useful & Responsive Layouts, no Media Queries required](https://codepen.io/Andrew-Neely-82/pen/bGPWMmP)

made with: nothing recognised — read the code

### [Notion Coding Page Gallery Layout](https://codepen.io/jaylemoigne/pen/JjQWXBQ)

on scroll: a.gallery-item: background | on hover of a.gallery-item: a.gallery-item: background ×2 | made with: nothing recognised — read the code

### [SmolCSS - Smol Responsive CSS Grid](https://codepen.io/davidlbowman-the-bashful/pen/mdZrRKo)

made with: nothing recognised — read the code

### [Responsive blog using Flex](https://codepen.io/Shrinithi-Murali/pen/jOjOrao)

held: sticky nav.nav-bar, fixed footer | made with: position: sticky · position: fixed · :hover

```css
nav { box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); position: sticky; top: 0 }
footer { bottom: 0; position: fixed }
main { margin-bottom: 50px }
.btn { margin-top: 38px }
```

### [SmolCSS - Smol Scroll Snap](https://codepen.io/rockij/pen/gONYLKG)

made with: scroll-snap · CSS grid

```css
.smol-scroll-snap { scroll-snap-type: x mandatory }
.smol-scroll-snap > * { scroll-snap-align: center; scroll-snap-stop: always }
```

### [SmolCSS - Smol Avatar List Component](https://codepen.io/rockij/pen/vYqByrx)

on hover of li.: a.: transform ×2 | made with: transition · :hover · (hover: hover) gate · CSS grid · object-fit

```css
.smol-avatar-list li:hover ~ li a, .smol-avatar-list li:focus-within ~ li a { transform: translateX(33%) }
.smol-avatar-list a { transition: transform 180ms ease-in-out }
.smol-avatar-list img { box-shadow: 0 0 0 0.05em #fff, 0 0 0 0.08em rgba(0, 0, 0, 0.15) }
.smol-avatar-list a:focus { box-shadow: 0 0 0 0.08em #29344B, 0 0 0 0.12em white }
```

### [2-3 Spalten- Layout dynamisch mit JavaScript](https://codepen.io/christianWiersgowski/pen/pomMQag)

made with: CSS grid

### [2-3 Spalten- Layout](https://codepen.io/christianWiersgowski/pen/GRaVYbx)

made with: CSS grid · grid spans (bento)

### [SmolCSS - Smol Breakout Grid](https://codepen.io/MarwanShehata/pen/VwOJdZK)

made with: CSS grid

### [Holy Grail Grid](https://codepen.io/BlogFire/pen/MWdMYzZ)

made with: transition · :hover · <details> · CSS grid

```css
.grid { box-shadow: 0 0 3px rgba(0, 0, 0, 0.33) }
header { background-position: 80% 60% }
nav a { transition: 0.2s ease }
details, summary { margin-bottom: 10px }
header h2, h3 { text-transform: capitalize }
p { text-transform: none }
a:not(nav a) { transition: 0.3s ease }
```

### [Responsive website layout using flex](https://codepen.io/Shrinithi-Murali/pen/gOJJzLg)

held: sticky nav.nav-bar, fixed footer | made with: position: sticky · position: fixed · :hover · flex-wrap · object-fit

```css
nav { box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); position: sticky; top: 0 }
.con { object-position: center }
.pword { padding-top: 12px }
main { margin-bottom: 50px }
```

### [Mobile-first layout](https://codepen.io/tofjadesign/pen/NWVVjwV)

on hover of a.active: a.active: background+color, i.fa: color | made with: transition · :hover · flex-wrap

```css
.mobile-container { margin-top: 5% }
.topnav { position: relative }
.icon-bar a { transition: all 0.3s ease }
.topnav a.icon { position: absolute; top: 0 }
header { margin-bottom: 1em }
.column { margin-bottom: 1em }
```

### [Responsive Header (OLD)](https://codepen.io/makamat/pen/GRazwdm)

made with: :hover · CSS grid · named grid areas

```css
.art__desc { margin-bottom: var(--size-3) }
```

### [Layout 2 columns + main box (OLD)](https://codepen.io/makamat/pen/VwOgYdd)

made with: CSS grid

```css
.grid__title { margin-bottom: 0.35em }
```

### [4x6 grid (OLD)](https://codepen.io/makamat/pen/GRazgmX)

made with: CSS grid

```css
.grid { position: relative }
.grid__title { position: absolute }
```

### [Section 4 - Challenge #3](https://codepen.io/najmoaden/pen/zYQWPzy)

made with: :hover · CSS grid

```css
.product { position: relative }
.product-title { text-transform: uppercase }
.product-info { margin-top: 20px }
.product-price { margin-bottom: 20px }
.shipping { text-transform: uppercase }
.sale { text-transform: uppercase; position: absolute; top: -17px }
.product-description { margin-bottom: 10px }
.more-info:link, .more-info:visited { margin-bottom: 30px }
.product-details { margin-top: 20px }
.details-title { text-transform: uppercase; margin-bottom: 15px }
.details-list { margin-bottom: 15px }
.details-list li { margin-bottom: 10px }
```

### [SmolCSS - Smol Breakout Grid](https://codepen.io/Mo-Cha-Cha/pen/eYaMeOV)

made with: CSS grid

### [Section 4 - Challenge #2](https://codepen.io/najmoaden/pen/PovQBeK)

made with: :hover

```css
.product { position: relative }
.product-title { text-transform: uppercase }
.product-info { margin-top: 20px }
.product-price { margin-bottom: 20px }
.shipping { text-transform: uppercase }
.sale { text-transform: uppercase; position: absolute; top: -17px }
.product-description { margin-bottom: 10px }
.more-info:link, .more-info:visited { margin-bottom: 30px }
.product-details { margin-top: 20px }
.details-title { text-transform: uppercase; margin-bottom: 15px }
.details-list { margin-bottom: 15px }
.details-list li { margin-bottom: 10px }
```

### [Gridlayout mit Css-Areas](https://codepen.io/christianWiersgowski/pen/pomdraN)

held: fixed div.footer | made with: position: fixed · CSS grid

```css
.footer { position:fixed; bottom:0 }
.menu { position: relative; top: 140px; padding-top: 60px }
```

### [CSS Layout - Final - Four columns](https://codepen.io/Shvarcs/pen/GRavrWw)

on hover of a.: path.[object: color ×5, a.: color, svg.[object: color, g.[object: color | made with: transition · :hover · :has() · inline SVG · CSS grid · auto-fit / auto-fill grid · object-fit

```css
p { margin-top: 1rem }
a { transition: color 0.3s }
.cols-4 > div > div { box-shadow: #ffffff50 0 0 5px 0 }
footer { margin-top: auto; border-top: 1px solid var(--burgundy) }
```

### [CSS Layout- Footer](https://codepen.io/Shvarcs/pen/VwOzmOM)

on hover of a.: path.[object: color ×5, a.: color, svg.[object: color, g.[object: color | made with: transition · :hover · inline SVG

```css
p { margin-top: 1rem }
a { transition: color 0.3s }
footer { margin-top: auto; border-top: 1px solid var(--burgundy) }
```

### [ y2k  n e o x p r e s s](https://codepen.io/Nijikokun/pen/abrwrbo)

made with: inline SVG · CSS grid

```css
footer { margin-top: 10px; border-top: 4px solid #00A0C6; padding-top: 40px }
footer .info { border-top: 1px solid #fff; margin-top: 5px }
nav { border-bottom: 4px solid #009FC6; margin-bottom: 10px }
header h2 { transition-property: opacity, transform; opacity: 1 }
.box { box-shadow: inset 0 0 0 1px white, inset 0 0 0 2px #33B2D0; margin-bottom: 5px }
.box-title { box-shadow: inset 0 -1px 0 0 white; border-bottom: 1px solid #009FC6; margin-bottom: -1px }
.article { box-shadow: 0 0 0 1px #009FC6 }
```

### [Semantic Document Responsive Spacing](https://codepen.io/uicoded/pen/ExzXGjp)

made with: nothing recognised — read the code

```css
main { margin-top: var(--layout-spacing) }
footer { margin-top: auto; padding-top: var(--layout-spacing) }
footer p { border-top: 1px solid #ccc; padding-top: 0.25em }
:is(h2, h3):not(:first-child) { margin-top: 2em }
article * + * { margin-top: 1em }
a { text-underline-offset: 0.15em }
```

### [Layout: Center Box by Grid layout](https://codepen.io/uicoded/pen/XWwgyGV)

made with: CSS grid

```css
.box { box-shadow: 3px 3px 5px 2px rgba(0,0,0, .14) }
```

### [CSS Columns Layout](https://codepen.io/steeven7/pen/vYwZQJQ)

made with: multi-column masonry (columns)

### [CSS Layout - Two cols](https://codepen.io/Shvarcs/pen/wvbeeRM)

on hover of a.: path.[object: color ×5, a.: color, svg.[object: color, g.[object: color | made with: transition · :hover · inline SVG

```css
p { margin-top: 1rem }
a { transition: color 0.3s }
footer { margin-top: auto; border-top: 1px solid var(--burgundy) }
```

### [JS panel content changes with button](https://codepen.io/MrCoder74/pen/YzbQNoo)

made with: nothing recognised — read the code

```css
.buttons button { border-top: 0 }
.content { margin-top: 1rem; box-shadow: 0 4px 8px black }
```

### [Responsive CSS Winding Road Content Blocks](https://codepen.io/schwiiiii/pen/bGyREQa)

made with: CSS grid

```css
.winding-road { filter: drop-shadow(0 0 10px rgba(0,0,0,.2)) }
&:before { position: absolute; top: 50%; transform: translate(-50%, -50%) }
&:after { position: absolute; top: 50% }
&:after { transform: translate(-50%, -50%) }
&:after { transform: translate(50%, -50%) }
```

### [CSS Layout - add reset.css](https://codepen.io/Shvarcs/pen/ExzmOVw)

made with: nothing recognised — read the code

### [SmolCSS - Smol Modern Centering](https://codepen.io/hijack-621/pen/LEpvJxg)

made with: nothing recognised — read the code

### [Untitled](https://codepen.io/Era-secrets/pen/LExKXQz)

made with: @keyframes · transition · :hover · mask · backdrop-filter · mix-blend-mode · pointer / mouse tracking · CSS grid · grid spans (bento) · flex-wrap

### [Vue.js Doc Reader](https://codepen.io/editor/ericthayer/pen/015add64-acd8-75d4-accd-ff3945f0f38f)

made with: nothing recognised — read the code

### [CSS Grid - Production Use Case](https://codepen.io/editor/pherodine/pen/015dcd8f-2240-736f-8fb9-fc78a3af88ed)

made with: nothing recognised — read the code

### [CSS GRID: Nesting Grid with Album Layout Exercise](https://codepen.io/editor/milos-caki-tanaskovic/pen/0169fd19-df08-7546-ab7b-625e3099e0e7)

made with: nothing recognised — read the code

### [Sky Factory](https://codepen.io/editor/jbruni/pen/0170ba7a-fbf8-73e5-a18e-fe4190e9a31a)

made with: nothing recognised — read the code

### [Something from Nothing](https://codepen.io/editor/jesseaborden/pen/0172cd68-f010-7ae7-a0d0-c142667bc0a1)

made with: nothing recognised — read the code

### [Musical production ( YouTube layout )](https://codepen.io/editor/dracorfs/pen/017407c1-a3c8-7fee-8cf2-3e4549787ff2)

made with: nothing recognised — read the code

### [organize](https://codepen.io/editor/lanyuechen/pen/0164018c-2498-7b21-afb7-19a8a3cd36f1)

made with: nothing recognised — read the code

### [Barebones Flexbox Starter](https://codepen.io/editor/mjgartendev/pen/01659c7f-ae10-7d09-96f5-8076e43ec5ec)

made with: nothing recognised — read the code

### [Twitter Style Feed](https://codepen.io/kirbypoyo100/pen/OPXMMaL)

made with: nothing recognised — read the code

```css
.tweet { border-bottom: 1px solid #ccc }
```

### [James Man's Radical Website](https://codepen.io/James-the-Great/pen/jEqzPdp)

made with: nothing recognised — read the code

```css
.landing { text-transform: uppercase }
footer { padding-top: 1rem }
```

### [Pinterest_style_layout](https://codepen.io/saeedwebmaster/pen/JoGRbzq)

made with: nothing recognised — read the code

```css
.items { margin-bottom: 0.8em }
```

### [SmolCSS - Smol Document Styles](https://codepen.io/nwpcgn/pen/raxLJpZ)

made with: nothing recognised — read the code

```css
main { margin-top: var(--layout-spacing) }
footer { margin-top: auto; padding-top: var(--layout-spacing) }
footer p { border-top: 1px solid #ccc; padding-top: 0.25em }
:is(h2, h3):not(:first-child) { margin-top: 2em }
article * + * { margin-top: 1em }
a { text-underline-offset: 0.15em }
```

### [SmolCSS - Smol Flexible Unbreakable Boxes](https://codepen.io/hijack-621/pen/xbwNdxM)

made with: CSS grid

```css
.smol-unbreakable-box footer { margin-top: 1rem }
.smol-unbreakable-box1 footer { margin-top: 1rem }
```

### [SmolCSS - Smol Responsive Sidebar Layout](https://codepen.io/hijack-621/pen/GgpaWra)

made with: CSS grid

### [SmolCSS - Smol Responsive Sidebar Layout](https://codepen.io/hijack-621/pen/myeYWRg)

made with: CSS grid

### [SmolCSS - Smol Responsive Padding](https://codepen.io/hijack-621/pen/PwPvpqg)

made with: CSS grid

### [SmolCSS - Smol Modern Centering](https://codepen.io/hijack-621/pen/ZYbZMKX)

made with: CSS grid

### [SmolCSS - Smol Responsive CSS Grid](https://codepen.io/Matthias-Budding/pen/wBKRMKr)

made with: CSS grid · auto-fit / auto-fill grid

### [Magazine](https://codepen.io/Naseem-Fatima/pen/QwjZKXW)

made with: :hover · CSS grid · object-fit · lazy loading

```css
.hero { position: relative }
.text-with-images { margin-bottom: 3rem }
.lists { margin-top: 2rem }
.lists li { margin-bottom: 1.5rem }
```

### [Newspaper article](https://codepen.io/Naseem-Fatima/pen/RNWZYeY)

made with: nothing recognised — read the code

```css
.name, .author { text-transform: uppercase }
.author { text-transform: uppercase }
```

### [Beautiful cats gallery](https://codepen.io/Naseem-Fatima/pen/dPYRoVb)

made with: flex-wrap · object-fit

```css
.header { text-transform: uppercase; border-bottom: 4px solid #fdb347 }
```

### [CSS - Layout Basic - Grid](https://codepen.io/rzkvsoth-the-decoder/pen/KwdWWaa)

made with: CSS grid

```css
h1 { margin-bottom: 40px }
h2 { border-bottom: 2px solid #ddd; padding-bottom: 5px; margin-top: 40px; margin-bottom: 20px }
section { margin-bottom: 30px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) }
p { margin-bottom: 15px }
```

### [SmolCSS - Smol Document Styles](https://codepen.io/nwpcgn/pen/zxGLZvV)

made with: nothing recognised — read the code

```css
main { margin-top: var(--layout-spacing) }
footer { margin-top: auto; padding-top: var(--layout-spacing) }
footer p { border-top: 1px solid #ccc; padding-top: 0.25em }
:is(h2, h3):not(:first-child) { margin-top: 2em }
article * + * { margin-top: 1em }
a { text-underline-offset: 0.15em }
```

### [SmolCSS - Smol Stack Layout](https://codepen.io/Patrick-Bateman-the-sans/pen/pvJZvdY)

made with: CSS grid · named grid areas · aspect-ratio

```css
.smol-stack-layout--video small { opacity: 0.8 }
.smol-stack-layout h3, .smol-stack-layout small { position: relative }
```

### [SmolCSS - Smol Breakout Grid](https://codepen.io/nwpcgn/pen/ogXyPyW)

made with: CSS grid

### [Mondrian Clock](https://codepen.io/Ray0601/pen/pvJbaYm)

made with: nothing recognised — read the code

```css
#outer-frame { position: absolute }
.clock-box { position: absolute; box-shadow: 0 0 0 2px black }
```

### [ccr. skin](https://codepen.io/oricodes/pen/NPqPbQj)

held: sticky div.bottom-navbar | made with: nothing recognised — read the code

### [unconventional desktop environment](https://codepen.io/numbpill3d/pen/bNNymVv)

on scroll: div.data-beam: opacity ×4 | on hover of a.: div.data-beam: opacity ×4 | made with: position: fixed · @keyframes · transition · :hover · clip-path · 3D (perspective / preserve-3d) · flex-wrap · aspect-ratio

### [everskies html widgets](https://codepen.io/xxdagger/pen/RNNpeJM)

made with: position: fixed

```css
.vignette { position: fixed; top: 0; box-shadow: inset 0px 0px 200px 10px #000000; filter: opacity(100%) }
.fixed1 { position: fixed; bottom: 0px }
.fixed2 { position: fixed; top: 70px }
.fixed3 { position: fixed; bottom: 0px }
.header { position: fixed; top: 55px; background-position: left top }
.footer { position: fixed; bottom: 0px; background-position: left bottom }
```

### [CSS Scroll-Driven Animations For Landing Page](https://codepen.io/jkantner/pen/raaeQWE)

held: sticky header, sticky section, sticky section, sticky section, sticky section | made with: position: sticky · scroll-driven animation (animation-timeline) · view() timeline · scroll() timeline · animation-range · @keyframes · transition · :hover · CSS grid · object-fit

```css
body { transition: background-color var(--trans-dur), color var(--trans-dur) }
header, section { position: sticky }
header { top: calc(-100% + var(--header-height)); transition: background-color var(--trans-dur), color var(--trans-dur) }
img, section { animation-duration: 1ms; animation-fill-mode: both; animation-timing-function: var(--trans-timing) }
img { animation-name: zoom-out; animation-timeline: view(); will-change: transform }
section { animation-name: slide-in; animation-timeline: view(); top: calc(var(--header-height) + 1px); will-change: opacity, transform }
section:nth-child(1) { animation-range: entry 0% cover 25% }
section:nth-child(1) img { animation-range: entry 0% cover 25% }
section:nth-child(2) { animation-range: entry 10% cover 35% }
section:nth-child(2) img { animation-range: entry 10% cover 35% }
section:nth-child(3) { animation-range: entry 20% cover 45% }
section:nth-child(3) img { animation-range: entry 20% cover 45% }
```

### [小測試頁面表示無障礙語法](https://codepen.io/Quuui/pen/pvvvQaR)

made with: :hover · prefers-reduced-motion · clip-path · flex-wrap · aspect-ratio

```css
header { top: 0 }
main { padding-top: 50px }
h2 { border-bottom: 4px solid #dfdfe2; margin-top: 0px; padding-top: 60px }
.formrow { margin-top: 30px }
.question-block { margin-top: 20px; padding-top: 5px }
h3 { margin-top: 5px }
.question { padding-bottom: 0 }
.sr-only { position: absolute; clip-path: inset(50%) }
```

### [使用CSS 僞選擇器的資產負債表](https://codepen.io/Quuui/pen/ZYYYmvy)

held: sticky div | made with: position: sticky · :hover · clip-path

```css
span[class~="sr-only"] { clip-path: inset(50%) !important; position: absolute !important }
#years { position: sticky; top: 0 }
table { position: relative; margin-top: 3rem }
table caption { position: absolute; top: -2.25rem }
tr[class="total"] { border-bottom: 4px double #0a0a23 }
tr.data th { padding-top: 0.3rem }
tr.data td { vertical-align: top }
```

### [webgl ❍ Thoughts about Creativity](https://codepen.io/filipz/pen/PwwYKvd)

held: fixed div.content, fixed div.custom-cursor, fixed div.profile-card | made with: position: fixed · transition · :hover · mix-blend-mode · CSS trigonometry · canvas 2D · pointer / mouse tracking · requestAnimationFrame · object-fit

```css
html, body { position: relative }
body::before { position: absolute; top: 0 }
body::after { position: absolute; top: 0 }
canvas { position: absolute; top: 0 }
.content { position: fixed; top: 0 }
.custom-cursor { position: fixed; transform: translate(-50%, -50%); mix-blend-mode: difference; transition: width 0.2s, height 0.2s; will-change: transform }
.quote { margin-bottom: 5vh; opacity: 1; text-transform: uppercase }
.author { opacity: 1; margin-top: 2vh; text-transform: uppercase }
.book { opacity: 0.5; margin-top: 1vh }
.custom-quote { position: absolute; top: 50%; transform: translate(-50%, -50%) rotate(-5deg) }
.custom-cursor { position: fixed; transform: translate(-50%, -50%); mix-blend-mode: difference; transition: width 0.2s, height 0.2s; will-change: transform }
.info { position: fixed; bottom: 10px }
```

```js
addEventListener("mousemove", (e) => {
addEventListener("mouseleave", () => {
addEventListener("mouseenter", (e) => {
requestAnimationFrame(render)
```

### [gsap/lenis ❍ Layout Explorations with Gsap, Flip, Lenis and ScrollTrigger N°2](https://codepen.io/filipz/pen/PwoMgqO)

held: fixed div | made with: position: fixed · @keyframes · transition · :hover · clip-path · mix-blend-mode · inline SVG · GSAP · ScrollTrigger · Lenis / smooth scroll · scroll listener · pointer / mouse tracking · requestAnimationFrame · CSS grid · aspect-ratio · object-fit

```css
body { text-transform: uppercase; position: relative }
body::before { position: fixed; top: -50%; animation: noise-animation 0.3s steps(5) infinite; opacity: 0.9; will-change: transform }
0% { transform: translate(0, 0) }
10% { transform: translate(-2%, -3%) }
20% { transform: translate(-4%, 2%) }
30% { transform: translate(2%, -4%) }
40% { transform: translate(-2%, 5%) }
50% { transform: translate(-4%, 2%) }
60% { transform: translate(3%, 0) }
70% { transform: translate(0, 3%) }
80% { transform: translate(-3%, 0) }
90% { transform: translate(2%, 2%) }
```

```js
gsap.registerPlugin(window.Flip)
gsap.registerPlugin(window.ScrollTrigger)
gsap.registerPlugin(window.CustomEase)
gsap.to(".header-logo", {
gsap.to(headerLogoPaths, {
ScrollTrigger.create({
gsap.to(footerLogoPaths, {
gsap.from(batch, {
```

### [SmolCSS - Smol Stack Layout](https://codepen.io/nwpcgn/pen/VYwJBXK)

made with: CSS grid · named grid areas · aspect-ratio

```css
.smol-stack-layout > * { position: relative }
.smol-stack-layout--video small { opacity: 0.8 }
.smol-stack-layout h3, .smol-stack-layout small { position: relative }
```

### [SmolCSS - Smol Stack Layout](https://codepen.io/nwpcgn/pen/dPyBjmX)

made with: CSS grid · named grid areas · aspect-ratio

```css
.smol-stack-layout > * { position: relative }
.smol-stack-layout--video small { opacity: 0.8 }
.smol-stack-layout h3, .smol-stack-layout small { position: relative }
```

### [gsap/lenis ❍ Inverted Scroll Sections with mix-blend-mode and Sticky Header](https://codepen.io/filipz/pen/MYWdxmx)

held: fixed header, fixed button | on hover of li.: li.: color | made with: position: sticky · position: fixed · @keyframes · transition · :hover · mix-blend-mode · custom properties driven by JS · inline SVG · GSAP · Lenis / smooth scroll · requestAnimationFrame · CSS grid

```css
h2 { text-transform: none }
li { position: relative }
li:first-child { margin-top: 0 }
li::after { position: absolute; top: 0; transition: width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) }
li:hover { mix-blend-mode: difference }
button { text-transform: uppercase }
body::before { position: fixed; top: -50%; animation: noise-animation 0.3s steps(5) infinite; opacity: 0.03; will-change: transform }
0% { transform: translate(0, 0) }
10% { transform: translate(-2%, -3%) }
20% { transform: translate(-4%, 2%) }
30% { transform: translate(2%, -4%) }
40% { transform: translate(-2%, 5%) }
```

```js
requestAnimationFrame(raf)
addEventListener("mouseenter", () => {
gsap.to(middleBox, {
gsap.to(circleSvg, {
addEventListener("mouseleave", () => {
style.setProperty( "--header-height",
```

### [SmolCSS - Smol Responsive CSS Grid](https://codepen.io/Patrick-Bateman-the-sans/pen/ZYEZXOR)

made with: CSS grid · auto-fit / auto-fill grid

### [SmolCSS - Smol Responsive CSS Grid](https://codepen.io/Patrick-Bateman-the-sans/pen/MYWREeG)

made with: CSS grid · auto-fit / auto-fill grid

### [SmolCSS - Smol Responsive Padding](https://codepen.io/puckstein/pen/OPJGREV)

made with: CSS grid

### [SmolCSS - Smol Responsive Sidebar Layout](https://codepen.io/nwpcgnpro/pen/bNGJbNW)

made with: CSS grid · named grid areas · aspect-ratio

```css
.smol-stack-layout--video small { opacity: 0.8 }
.smol-stack-layout h3, .smol-stack-layout small { position: relative }
```

### [SmolCSS - Smol Stack Layout](https://codepen.io/nwpcgnpro/pen/gbOEVVr)

made with: CSS grid · named grid areas · aspect-ratio

```css
.smol-stack-layout--video small { opacity: 0.8 }
.smol-stack-layout h3, .smol-stack-layout small { position: relative }
```

### [PersonalDetails Form](https://codepen.io/Quuui/pen/LEYaMLX)

made with: nothing recognised — read the code

```css
form { box-shadow: 0px 0px 10px #bebcbf }
h1 { margin-bottom: 40px }
.item { margin-top: 20px }
input, textarea, select { border-top: 2px solid #ffffff; border-bottom: 2px solid #bebcbf; box-shadow: 2px 2px 5px #bebcbf, -2px -2px 5px #ffffff }
input:focus, textarea:focus, select:focus { border-top: 2px solid #bebcbf; border-bottom: 2px solid #f2f0f3; box-shadow: inset 2px 2px 5px #bebcbf, inset -2px -2px 5px #ffffff }
```

### [Few minute landing, hero - Every second.](https://codepen.io/Bembit/pen/LEYajda)

held: sticky header.site-header | on scroll: span.: transform+opacity+top ×4, button.btn: background+top | on hover of li.: span.: transform+opacity+top ×4, a.: color, button.btn: background | made with: position: sticky · @keyframes · transition · :hover · flex-wrap

```css
h1, h2 { margin-bottom: 0.75em }
p { margin-bottom: 1em }
.btn { transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out }
.site-header { border-bottom: 1px solid #e9ecef; position: sticky; top: 0 }
.hero .hero-indicators { transform: translateY(-30px) }
.hero .hero-indicators span { animation: pulse 1.5s infinite }
0% { transform: scale(0.95); opacity: 1 }
70% { transform: scale(1); opacity: 0.7 }
100% { transform: scale(0.95); opacity: 1 }
.hero p { margin-bottom: 30px }
.demo-placeholder { box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); background-position: top center; transform: translateY(-100px) }
.partner-logos { margin-top: 40px }
```

### [Content Container: Fixed/Scroll Behavior](https://codepen.io/britbuck/pen/KwKENOL)

made with: nothing recognised — read the code

```css
.cc-fixed-header { border-bottom: 1px solid #e0e0e0 }
```

### [SmolCSS - Smol Responsive CSS Grid](https://codepen.io/Bellette/pen/EaxroLr)

made with: CSS grid · auto-fit / auto-fill grid

```css
.tamarind-layout-grid { margin-bottom: 50px }
```

### [CoffeeMenu](https://codepen.io/Quuui/pen/dPywYJa)

made with: nothing recognised — read the code

```css
.menu { background-position: -40px 0px; box-shadow: -10px 10px 50px 0px rgba(10, 10, 10, 0.8) }
main { padding-bottom: 40px }
h1 { margin-top: 30px; margin-bottom: -10px }
.established { margin-bottom: 25px }
h2 { margin-bottom: 0px }
.item { position: relative; border-bottom: 1px dashed rgb(30, 60, 50) }
.item p { margin-bottom: 0px }
```

### [Masonry (CSS + JS)](https://codepen.io/pd-alejandro/pen/EaxOVdG)

made with: custom properties driven by JS · CSS grid · auto-fit / auto-fill grid · grid spans (bento) · CSS masonry (grid-lanes / masonry)

```css
.masonry__item { position: relative; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1) }
```

```js
style.setProperty("--height", Math.ceil(item.clientHeight / 4 + 4))
```

### [gsap ❍ Layout Exploration with Scroll Trigger and Split-Type](https://codepen.io/filipz/pen/MYWPEby)

on scroll: div.word: transform+opacity+top ×23, span.char: transform+opacity+top ×7, p.hero__main-text: opacity+top | made with: position: fixed · @keyframes · transition · CSS trigonometry · GSAP · ScrollTrigger · pointer / mouse tracking · requestAnimationFrame

```css
body { position: relative }
body::before { position: fixed; top: -50%; animation: noise-animation 0.3s steps(5) infinite; opacity: 0.9; will-change: transform }
0% { transform: translate(0, 0) }
10% { transform: translate(-2%, -3%) }
20% { transform: translate(-4%, 2%) }
30% { transform: translate(2%, -4%) }
40% { transform: translate(-2%, 5%) }
50% { transform: translate(-4%, 2%) }
60% { transform: translate(3%, 0) }
70% { transform: translate(0, 3%) }
80% { transform: translate(-3%, 0) }
90% { transform: translate(2%, 2%) }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.fromTo(
scrollTrigger: { trigger: ".hero", start: "top 75%", end: "center center", toggleActions: "play none none reverse" }
scrollTrigger: { trigger: ".hero__content", start: "top 75%", end: "center center", toggleActions: "play none none reverse" }
ScrollTrigger.create({
gsap.to(words, {
scrollTrigger: { trigger: ".hero", start: "top 65%", end: "center center", toggleActions: "play none none reverse" }
addEventListener("mousemove", (e) => {
```

### [mossrot- neocities/nekoweb template](https://codepen.io/lusynth/pen/ZYEqXzb)

on hover of a.nav-item: div.floating-image: transform+top ×4, a.nav-item: color, div.marquee-content: transform | made with: @keyframes · transition · :hover · CSS trigonometry · inline SVG · three.js / WebGL · requestAnimationFrame · flex-wrap

### [SmolCSS - Smol Responsive CSS Grid](https://codepen.io/johntom/pen/yyLEGvO)

made with: CSS grid · auto-fit / auto-fill grid

### [Responsive layout with header, footer, nav using flexbox (3)](https://codepen.io/r-w-c/pen/NPWYBbo)

made with: nothing recognised — read the code

```css
footer { bottom: 0 }
```

### [creative profile picture](https://codepen.io/1bbnuuu/pen/mydEWRO)

made with: nothing recognised — read the code

### [Grid Layouts](https://codepen.io/HugoSalazar/pen/pvoJXQB)

made with: scroll-snap · CSS grid · multi-column masonry (columns)

```css
.l-layout__section-description { margin-bottom: 24px }
.c-slider { scroll-snap-type: x mandatory }
.c-slider__item { scroll-snap-align: start }
```

### [SmolCSS - Smol Document Styles](https://codepen.io/ScoShi/pen/VYwLqYr)

made with: nothing recognised — read the code

```css
& p { border-top: 1px solid #ccc; padding-top: 0.25em }
a { text-underline-offset: 0.15em }
```

### [SmolCSS - Smol Scroll Snap](https://codepen.io/stefaniadt/pen/ByaNGdY)

made with: scroll-snap · CSS grid

```css
.smol-scroll-snap { scroll-snap-type: x mandatory }
.smol-scroll-snap > * { scroll-snap-align: center; scroll-snap-stop: always }
```

### [SmolCSS - Smol Responsive Flexbox Grid](https://codepen.io/SwiftOne/pen/xbKoYER)

made with: CSS grid · flex-wrap

### [Responsive Grid Layout: Dynamic 1-3 Column Adaptation Version One](https://codepen.io/mark_sottek/pen/wBwZjVZ)

made with: CSS grid · grid spans (bento)

### [The Python Times: Template Demo](https://codepen.io/nickrg/pen/vEBQrYO)

made with: inline SVG · CSS grid · <figure> / <figcaption>

```css
article h1 { margin-top: 0 }
article h2, article h3, article h4, article h5, article h6 { margin-top: 0 }
figcaption { opacity: 0.5 }
article span { margin-top: 1rem }
footer span { opacity: 0.5 }
```

### [Responsive Mosaic Grid Layout](https://codepen.io/ahoidahl/pen/vEBQgBe)

made with: transition · CSS grid · grid spans (bento)

```css
body { text-transform:uppercase }
.grid_item { transition:all .2s ease-in-out }
```

### [Responsive grid layout with overflow](https://codepen.io/TenCzwarty/pen/RNbeLpp)

made with: CSS grid · aspect-ratio

```css
main { position: relative }
main > #wrapper { position: absolute; top: 50%; transform: translate(-50%, -50%) }
#wrapper > div { position: relative }
```

### [Grid layout quick start](https://codepen.io/star5/pen/azoLXPd)

made with: CSS grid · named grid areas

### [Quick Layout Test - HTML/CSS](https://codepen.io/John2606/pen/OPLxxMj)

made with: CSS grid · multi-column masonry (columns) · object-fit

```css
& .title { text-transform: uppercase }
& img { object-position: center }
```

### [Mobile Screen UI – Bottom Navigation & App Icons Layout](https://codepen.io/grauconejo13/pen/JoPrKwv)

on hover of a.: div.app: transform+background+top | made with: transition · :hover · CSS grid · aspect-ratio

```css
.split h1 { margin-bottom: 20px }
.phone-screen { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) }
.date { margin-top: 5px }
.app { transition: transform 0.2s ease, background-color 0.2s ease }
.app:hover { transform: translateY(-5px) }
.nav-item { transition: color 0.3s ease }
#calendar-header { margin-bottom: 10px }
.nav-item { position: relative }
.nav-item .badge { position: absolute; top: -5px }
```

### [Challenge 1](https://codepen.io/ANAND-SWAROOP/pen/LEPLMVK)

made with: nothing recognised — read the code

```css
.parent { position: relative }
.box3 { position: absolute; top: 0px }
.box2 { position: absolute; top: 0px }
```

### [Challenge 14](https://codepen.io/Ajay-Kushwaha-the-scripter/pen/NPKgEBR)

made with: nothing recognised — read the code

```css
.container { position: relative }
.div2 { position: absolute; top: 50% }
```

### [Challenge 13](https://codepen.io/Ajay-Kushwaha-the-scripter/pen/WbeOYMx)

made with: aspect-ratio

```css
.div1 { position: relative }
.div2 { position: absolute; top: 50% }
.div3 { position: absolute; top: 50% }
.div4 { position: absolute; top: 50% }
.div5 { position: absolute; top: 50% }
```

### [Challenge 12](https://codepen.io/Ajay-Kushwaha-the-scripter/pen/xbKrQRW)

made with: aspect-ratio

```css
.container { position: relative }
.div1 { position: absolute }
.div2 { position: absolute }
.div3 { position: absolute; top: 82% }
```

### [Challenge 10](https://codepen.io/Ajay-Kushwaha-the-scripter/pen/emORPVJ)

made with: aspect-ratio

```css
.container { position: relative }
.div1 { position: absolute }
```

### [Challenge 9](https://codepen.io/Ajay-Kushwaha-the-scripter/pen/MYgoPrY)

made with: nothing recognised — read the code

```css
.container { position: relative }
.div1 { position: absolute }
```

### [Challenge 8](https://codepen.io/Ajay-Kushwaha-the-scripter/pen/RNbgYvV)

made with: nothing recognised — read the code

```css
.container { position: relative }
.div2 { position: absolute; top: 0 }
```

### [Challenge 7](https://codepen.io/Ajay-Kushwaha-the-scripter/pen/GgKEXwE)

made with: nothing recognised — read the code

```css
.container { position: relative }
.div2 { position: absolute; top: 50% }
```

### [Challenge 6](https://codepen.io/Ajay-Kushwaha-the-scripter/pen/PwYjBrN)

made with: nothing recognised — read the code

```css
.container { position: relative; position: absolute; bottom: 0 }
.div1 { position: absolute }
```

### [Challenge 5](https://codepen.io/Ajay-Kushwaha-the-scripter/pen/zxOzLXJ)

made with: nothing recognised — read the code

### [Challenge 4](https://codepen.io/Ajay-Kushwaha-the-scripter/pen/emORjLV)

made with: nothing recognised — read the code

```css
.container { position: relative }
.div2 { position: absolute; top: 50% }
```

### [SmolCSS - Smol Responsive CSS Grid](https://codepen.io/Bendroid23/pen/gbYRrMK)

made with: CSS grid · auto-fit / auto-fill grid

### [SmolCSS - Smol Responsive Flexbox Grid](https://codepen.io/Bendroid23/pen/dPbRMXz)

made with: CSS grid · flex-wrap

### [SmolCSS - Smol Document Styles](https://codepen.io/ScoShi/pen/dPbRYyq)

made with: nothing recognised — read the code

```css
main { margin-top: var(--layout-spacing) }
footer { margin-top: auto; padding-top: var(--layout-spacing) }
footer p { border-top: 1px solid #ccc; padding-top: 0.25em }
:is(h2, h3):not(:first-child) { margin-top: 2em }
article * + * { margin-top: 1em }
a { text-underline-offset: 0.15em }
```

### [HTML Table Showcase](https://codepen.io/govindvyas/pen/zxOzxqb)

on scroll: div.table-wrapper: shadow+top | made with: transition · :hover · CSS grid · auto-fit / auto-fill grid

```css
.table-wrapper { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: box-shadow 0.3s ease }
.table-wrapper:hover { box-shadow: 0 6px 10px rgba(0, 0, 0, 0.19) }
h3 { opacity: 0.8 }
footer { position: relative; bottom: 0 }
```

### [Animated Grid](https://codepen.io/mzungu/pen/emOBPXL)

made with: @keyframes · CSS grid · named grid areas

```css
from { opacity: 0; transform: scale(0.3); filter: hue-rotate(180deg) }
to { opacity: 1; transform: scale(1); filter: hue-rotate(0deg) }
.card { animation: cardEntrance 700ms ease-out; animation-fill-mode: backwards }
.card:nth-child(1) { animation-delay: calc(1 * var(--stagger-delay)) }
.card:nth-child(2) { animation-delay: calc(2 * var(--stagger-delay)) }
.card:nth-child(3) { animation-delay: calc(3 * var(--stagger-delay)) }
.card:nth-child(4) { animation-delay: calc(4 * var(--stagger-delay)) }
.card:nth-child(5) { animation-delay: calc(5 * var(--stagger-delay)) }
.card:nth-child(6) { animation-delay: calc(6 * var(--stagger-delay)) }
.card:nth-child(7) { animation-delay: calc(7 * var(--stagger-delay)) }
.card:nth-child(8) { animation-delay: calc(8 * var(--stagger-delay)) }
.card:nth-child(9) { animation-delay: calc(9 * var(--stagger-delay)) }
```

### [Grid Auto Fit](https://codepen.io/mzungu/pen/wBwzVbK)

on scroll: section.card: transform+background+top | on hover of section.card: section.card: transform+background+top ×2 | made with: transition · :hover · CSS grid · auto-fit / auto-fill grid

```css
:root { --transition: 0.5s }
.card { box-shadow: var(--shadow-1); transition: all 500ms }
.card:hover { box-shadow: var(--shadow-1); transform: translateY(-2px) scale(1.05) }
```

### [Grid Layout classless boilerplate](https://codepen.io/villepreux/pen/YPKGORB)

held: fixed fieldset, fixed a | made with: position: sticky · position: fixed · view transitions · @keyframes · :has() · prefers-reduced-motion · clip-path · mask · CSS trigonometry · inline SVG · CSS grid · auto-fit / auto-fill grid · named grid areas · flex-wrap · aspect-ratio · object-fit · CSS-only state (:checked / :target)

### [SmolCSS - Smol Flexible Unbreakable Boxes](https://codepen.io/phonoarchive/pen/gbYrKpg)

made with: CSS grid

```css
.smol-unbreakable-box footer { margin-top: 1rem }
```

### [Responsive content using Pseudo-element](https://codepen.io/Shrinithi-Murali/pen/gOVNpwg)

held: sticky nav.nav-bar | made with: position: sticky · :hover

```css
.container { position: relative }
.container::after { position: absolute; top: 50%; transform: translateX(-50%) }
nav { box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); position: sticky; top: 0 }
```

### [SmolCSS - Smol Breakout Grid](https://codepen.io/emarake/pen/KKOLayp)

made with: CSS grid

### [SmolCSS - Smol Intrinsic Container](https://codepen.io/emarake/pen/WNVBRjV)

made with: CSS grid

### [SmolCSS - Smol Modern Centering](https://codepen.io/emarake/pen/dyxENNd)

made with: CSS grid

### [Animated UI Elements Demo](https://codepen.io/vizua/pen/WNVWZby)

on scroll: div.box-block: transform+opacity+top ×2 | made with: @keyframes · transition · CSS-only state (:checked / :target)

```css
.box { position: relative; box-shadow: 0px 14px 25px 0px #2c303822 }
.box1 { padding-top: 3% }
.chart { position: relative }
.chart-data span.chart-trend { opacity: 0.4 }
.chart [class*="bar"] { position: absolute; bottom: 20px; transform: translateY(0) }
.chart [class*="bar"].appear { .webkit-animation: grow 2s ease forwards; -moz-animation: grow 2s ease forwards; -o-animation: grow 2s ease forwards; animation: grow 2s ease forwards }
.chart [class*="bar"] span { position: absolute; bottom: -20px; opacity: 0.4 }
input[type="checkbox"] { opacity: 0 }
.checkbox { position: relative }
.checkbox label { position: absolute; top: 0 }
.checkbox input[type="checkbox"]:checked + label { transition: all 0.7s ease-in-out }
.checkbox label:after { position: absolute; top: 6px; transform: rotate(-50deg); transition: all 0.7s ease-in-out }
```

### [SmolCSS - Smol Scroll Snap](https://codepen.io/emarake/pen/KKOYMKw)

made with: scroll-snap

### [SmolCSS - Smol Avatar List Component](https://codepen.io/emarake/pen/bGXJeby)

on hover of li.: a.: transform ×2 | made with: transition · :hover · (hover: hover) gate · CSS grid · object-fit

```css
.smol-avatar-list li:hover ~ li a, .smol-avatar-list li:focus-within ~ li a { transform: translateX(33%) }
.smol-avatar-list a { transition: transform 180ms ease-in-out }
.smol-avatar-list img { box-shadow: 0 0 0 0.05em #fff, 0 0 0 0.08em rgba(0, 0, 0, 0.15) }
.smol-avatar-list a:focus { box-shadow: 0 0 0 0.08em #29344B, 0 0 0 0.12em white }
```

### [SmolCSS - Smol Flexible Unbreakable Boxes](https://codepen.io/emarake/pen/dyxLXbd)

made with: CSS grid

```css
.smol-unbreakable-box footer { margin-top: 1rem }
```
