# CodePen · sticky-nav — how each pen does it

65 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/sticky-nav.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| position: fixed | 51 |
| transition | 44 |
| :hover | 28 |
| scroll() timeline | 25 |
| scroll listener | 16 |
| Web Animations API (.animate) | 11 |
| position: sticky | 10 |
| @keyframes | 4 |
| backdrop-filter | 1 |
| GSAP | 1 |
| ScrollTrigger | 1 |
| scroll-snap | 1 |
| IntersectionObserver | 1 |
| mix-blend-mode | 1 |

## Every pen

### [Smooth Scroll Navigation with CSS Color Cycling](https://codepen.io/aCajuliana/pen/RNRqvwY)

held: fixed nav.menu | made with: position: fixed

```css
html { scroll-padding-top: var(--menu) }
body { padding-top: var(--menu) }
nav { position: fixed; top: 0 }
```

### [Apple Website Clone: Sticky Sub-Nav & Smooth Scroll (HTML, CSS, JS)](https://codepen.io/Kuldeep-Rajput-the-sasster/pen/YPyZgLa)

made with: position: fixed · transition · :hover · backdrop-filter · scroll listener

```css
.main-header { position: fixed; top: 0 }
.main-nav { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px) }
.nav-left a, .nav-right a { transition: opacity 0.2s }
.nav-left a:hover, .nav-right a:hover { opacity: 0.7 }
.sub-nav { position: fixed; top: 0; border-bottom: 1px solid #d2d2d7; transform: translateY(-100%); transition: transform 0.3s ease-in-out }
.sub-nav.visible { transform: translateY(0) }
.buy-btn { transition: background-color 0.2s }
.section { padding-bottom: 15vh; background-position: center; position: relative }
.new-tag { text-transform: uppercase }
.sub-title { margin-top: 5px }
.cta-buttons { margin-top: 15px }
.cta-link { transition: opacity 0.2s }
```

```js
addEventListener('scroll', () => {
```

### [Gpt in comp](https://codepen.io/memaeee/pen/MWdKJvy)

made with: position: fixed · scroll() timeline · transition · :hover · Web Animations API (.animate)

```css
.et-hero-tabs, .et-slide { position: relative }
.et-hero-tabs h3, .et-slide h3 { opacity: 0.6 }
.et-hero-tabs-container { position: absolute; bottom: 0; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1) }
.et-hero-tabs-container--top { position: fixed; top: 0 }
.et-hero-tab { transition: all 0.5s ease }
.et-hero-tab:hover { transition: all 0.5s ease }
.et-hero-tab-slider { position: absolute; bottom: 0; transition: left 0.3s ease }
```

```js
.animate({ scrollTop: scrollTop }, 600)
```

### [Sticky Nav](https://codepen.io/BlogFire/pen/eYbybdj)

held: sticky div.bar | made with: position: sticky · GSAP · ScrollTrigger

```css
.bar { position: sticky; top: 0 }
```

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to("nav", {
scrollTrigger: { trigger: "nav", markers: false, start: "top 20%", end: "bottom top", scrub: 3 }
gsap.to("nav a", {
scrollTrigger: { trigger: "nav", markers: false, start: "top 20%", end: "bottom top", scrub: 2 }
```

### [Sticky Navigations](https://codepen.io/AlperZM/pen/eYbezXP)

held: sticky nav, sticky div.sub-sticky, sticky div.sub-sticky, sticky div.sub-sticky, sticky div.sub-sticky, sticky nav | made with: position: sticky

```css
nav { position: sticky; top: 0 }
.container { position: relative }
.sub-sticky { position: sticky; top: 0 }
```

### [Untitled](https://codepen.io/caoc/pen/NWvrKxa)

on hover of a.et-hero-tab: a.et-hero-tab: background+color, br.: color | made with: position: fixed · scroll() timeline · transition · :hover · Web Animations API (.animate)

```css
.et-hero-tabs, .et-slide { position: relative }
.et-hero-tabs h3, .et-slide h3 { opacity: 0.6 }
.et-hero-tabs-container { position: absolute; bottom: 0; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1) }
.et-hero-tabs-container--top { position: fixed; top: 0 }
.et-hero-tab { transition: all 1.5s ease }
.et-hero-tab:hover { transition: all 0.5s ease }
.et-hero-tab-slider { position: absolute; bottom: 0; transition: left 0.3s ease }
```

```js
.animate({ scrollTop: scrollTop }, 700)
```

### [Sticky RWD Nav with Section Observer](https://codepen.io/mw_codes/pen/Exmvqea)

on scroll: div.: background, div.: opacity | made with: position: sticky · position: fixed · scroll-snap · transition · :hover · IntersectionObserver

```css
.mw-sticky-nav-section { position: sticky; top: 0; box-shadow: 0 0.9px 0.9px rgba(0, 0, 0, 0.01), 0 2.5px 2.5px rgba(0, 0, 0, 0.015), 0 6px 6px rgba(0, 0, 0, 0.02), 0 20px 20px rgba(0, 0, 0, 0.03) }
.mw-sticky-nav__overlay { position: fixed; top: 0 }
.mw-sticky-nav-wrapper { position: relative }
.mw-sticky-nav-btn-mobile { transition: transform 300ms ease }
.mw-sticky-nav-btn-mobile--rotate { transform: rotate(180deg) }
.mw-sticky-nav { padding-top: 4px }
.mw-sticky-nav { transition: max-height 300ms ease, padding 300ms ease }
.mw-sticky-nav--expanded { padding-top: 10px }
.mw-sticky-nav__item { position: relative }
.mw-sticky-nav__item { border-top: 1px solid #000 }
.mw-sticky-nav__item:last-child { padding-bottom: 5px }
.mw-sticky-nav__item:not(.mw-sticky-nav__item--active):hover .mw-sticky-nav__ite { position: absolute; bottom: -5px }
```

```js
new IntersectionObserver(sectionsHandler, {
```

### [sticky-nav](https://codepen.io/legionista1994/pen/gOwqVXo)

made with: position: sticky · transition · scroll listener

```css
header { transition: 400ms ease-in-out; box-shadow: 0 0 0 3px #333 }
ul li { transition: 400ms ease-in-out }
.sticky { position: sticky; top: 0 }
```

```js
addEventListener("scroll", stickyHandler)
```

### [Untitled](https://codepen.io/DJSvenB/pen/pobLPpQ)

held: fixed div | made with: position: fixed · scroll() timeline · transition · :hover · Web Animations API (.animate)

```css
#cookie-popup { position: fixed; bottom: 0px; box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2) }
.videoWrapper { position: relative; padding-bottom: 56.25%; padding-top: 25px }
.videoWrapper iframe { position: absolute; top: 0 }
.topnav { margin-top: 0px }
article { padding-top: 20px; padding-bottom: 20px; box-shadow: inset 0 0 10px #e6e6e6 }
Article div.brett { margin-bottom: 1.2em; box-shadow: 1px 2px 2px 2px rgba(0, 0, 0, 0.5) }
Article div.brett2 { box-shadow: 1px 2px 2px 0px rgba(0, 0, 0, 0.8) }
Article div.brettlink { box-shadow: 1px 2px 2px 2px rgba(0, 0, 0, 0.5) }
Article div.brettbewertung { margin-bottom: 5px; box-shadow: 1px 2px 2px 2px rgba(0, 0, 0, 0.5) }
img.contentimgleft { transition: transform 0.8s; -moz-transition: transform 0.8s; -webkit-transition: transform 0.8s; -o-transition: transform 0.8s; -ms-transition: transform 0.8s }
img.contentimgleft:hover { transform: scale(1.3, 1.3); -moz-transform: scale(1.3, 1.3); -webkit-transform: scale(1.3, 1.3); -o-transform: scale(1.3, 1.3); -ms-transform: scale(1.3, 1.3) }
.contentimgright { padding-top: 20px; padding-bottom: 20px }
```

```js
.animate( {
.animate({ scrollTop: scrollTop }, 600)
```

### [Untitled](https://codepen.io/DJSvenB/pen/VwjXbpa)

held: fixed div | made with: position: fixed · scroll() timeline · transition · :hover · Web Animations API (.animate)

```css
#cookie-popup { position: fixed; bottom: 0px; box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2) }
.videoWrapper { position: relative; padding-bottom: 56.25%; padding-top: 25px }
.videoWrapper iframe { position: absolute; top: 0 }
.topnav { margin-top: 0px }
article { padding-top: 20px; padding-bottom: 20px; box-shadow: inset 0 0 10px #e6e6e6 }
Article div.brett { margin-bottom: 1.2em; box-shadow: 1px 2px 2px 2px rgba(0, 0, 0, 0.5) }
Article div.brett2 { box-shadow: 1px 2px 2px 0px rgba(0, 0, 0, 0.8) }
Article div.brettlink { box-shadow: 1px 2px 2px 2px rgba(0, 0, 0, 0.5) }
Article div.brettbewertung { margin-bottom: 5px; box-shadow: 1px 2px 2px 2px rgba(0, 0, 0, 0.5) }
img.contentimgleft { transition: transform 0.8s; -moz-transition: transform 0.8s; -webkit-transition: transform 0.8s; -o-transition: transform 0.8s; -ms-transition: transform 0.8s }
img.contentimgleft:hover { transform: scale(1.3, 1.3); -moz-transform: scale(1.3, 1.3); -webkit-transform: scale(1.3, 1.3); -o-transform: scale(1.3, 1.3); -ms-transform: scale(1.3, 1.3) }
.contentimgright { padding-top: 20px; padding-bottom: 20px }
```

```js
.animate( {
.animate({ scrollTop: scrollTop }, 600)
```

### [Side nav becomes sticky top nav](https://codepen.io/rustyn/pen/gOadboe)

held: sticky nav.navbar | made with: scroll() timeline

### [Sticky Nav](https://codepen.io/ascvetkovic/pen/bGdrdba)

on scroll: nav.: shadow+top, div.site-wrap: transform+top | made with: position: fixed · transition · scroll listener

```css
.site-wrap { box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.05); transform: scale(0.98); transition: transform 0.5s }
.fixed-nav .site-wrap { transform: scale(1) }
nav { top: 0; transition: all 0.5s; position: relative }
.fixed-nav nav { position: fixed; box-shadow: 0 5px rgba(0, 0, 0, 0.1) }
li.logo { transition: all 0.5s }
nav a { transition: all 0.2s; text-transform: uppercase }
```

```js
addEventListener("scroll", fixNav)
```

### [Fly-Out Sticky Nav](https://codepen.io/Fyresite/pen/mZeWjM)

held: fixed header.navigation | on scroll: header.navigation: shadow+top | on hover of a.: a.: color, img.: color | made with: position: fixed · transition

```css
.navigation { position: relative; transition: all .2s ease-in-out }
.sticky-header { position: fixed; top: -200px }
.sticky-header.sticky { top: 0; box-shadow: 0px 0px 10px 0 rgba(0,0,0,.15); transition: all .5s ease-in-out }
```

### [Fashion Landing Page Design + Sticky Nav Pure CSS](https://codepen.io/arron21/pen/eodERj)

held: sticky div.logo, sticky nav | made with: position: sticky · @keyframes · transition · :hover · mix-blend-mode

```css
.logo { position: sticky; margin-top: -60px; top: 0 }
.hero button { margin-top: 80px; text-transform: uppercase; transition: all 0.3s }
.hero button:hover { transform: scale(1.1) }
.hero img { opacity: 0.8; position: absolute; mix-blend-mode: exclusion }
nav { position: sticky; top: 0 }
nav a { text-transform: uppercase; position: relative }
nav a:before { transition: 150ms all; opacity: 0 }
nav a:hover:before { -webkit-animation: squigle 2s infinite; animation: squigle 2s infinite; opacity: 1 }
footer { text-transform: uppercase }
.items img { transition: 0.3s all }
.items div { position: relative }
.items div:hover img { transform: scale(1.1) }
```

### [Sticky Nav](https://codepen.io/colinlord/pen/oOLjVR)

on scroll: nav.: shadow+top, div.site-wrap: transform+top | made with: position: fixed · transition · scroll listener

```css
.site-wrap { box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.05); transform: scale(0.98); transition: transform 0.5s }
.fixed-nav .site-wrap { transform: scale(1) }
nav { top: 0; transition: all 0.5s; position: relative }
.fixed-nav nav { position: fixed; box-shadow: 0 5px rgba(0, 0, 0, 0.1) }
li.logo { transition: all 0.5s }
nav a { transition: all 0.2s; text-transform: uppercase }
```

```js
addEventListener('scroll', fixNav)
```

### [Coffee Landing Page Design + Sticky Nav](https://codepen.io/juliepark/pen/ROrxgZ)

made with: position: fixed · transition · :hover

```css
#navbar a { text-transform: uppercase }
.bottom { position: absolute; bottom: 0 }
.sticky { position: fixed; top: 0 }
.landing--container { position: relative; background-position: center }
.landing--title { position: absolute; top: 40% }
.landing--title p { text-transform: uppercase }
.landing--title h1 { margin-top: -20px }
.primary-btn { text-transform: uppercase; transition: all 0.4s ease }
.primary-btn:hover { transition: all 0.4s ease; transform: scale(1.05) }
.landing--line { top: 125%; position: absolute }
footer { position: relative }
.footer--social { padding-top: 15px }
```

### [Sticky header without js/jQuery](https://codepen.io/devparth/pen/vPPGKb)

held: sticky header | made with: position: sticky

```css
p { margin-bottom: 30px }
#wrapper { position: relative }
header { position: -webkit-sticky; position: sticky; top: 0 }
header li a { text-transform: uppercase }
.box { margin-bottom: 30px; position: sticky; top: 0px }
```

### [JS Sticky Nav with Smooth Scroll](https://codepen.io/timgorsuch/pen/Odbrzg)

made with: position: fixed · scroll() timeline · scroll listener

```css
.section--hero { background-position: top center }
.subnav { border-bottom: 1px solid white }
.sticky { position: fixed; top: 0; margin-bottom: 3em }
.sticky-padding { margin-top: 4.5% }
```

```js
addEventListener('scroll', function(ev) {
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

### [Scroll-Away Sticky Nav](https://codepen.io/quinlo/pen/yQGOKp)

held: fixed div | made with: position: fixed · scroll listener

```css
header { box-shadow: 1px 1px 23px rgba(0, 0, 0, 0.75) }
#copybutton { position: fixed; bottom: 20px }
.main { margin-top: 80px; padding-bottom: 90px }
.example { margin-top: 20px }
```

```js
addEventListener('scroll', function (e) {
```

### [Sticky Nav](https://codepen.io/feizc002/pen/eQRjqG)

on scroll: i.arrowdown: transform+top | on hover of li.: i.arrowdown: transform+top | made with: position: fixed · @keyframes · transition

```css
.hero { background-position: center }
.hero .arrowdown { transform: rotate(45deg); animation: slide-bottom 2.5s ease-in-out infinite alternate both }
0% { -webkit-transform: translateY(0); transform: translateY(0) rotate(45deg) }
100% { -webkit-transform: translateY(100px); transform: translateY(100px) rotate(45deg) }
nav { transition: 0.2s ease }
.fixed { position: fixed; top: 0; transition: 0.2s ease }
@keyframes slide-bottom animates -webkit-transform, transform
```

### [Sticky Navbar](https://codepen.io/kayfo23/pen/bmgGOV)

made with: position: fixed · transition · :hover · scroll listener

```css
.header { background-position: bottom }
.fixed-nav .nav { position: fixed }
.nav { position: relative; top: 0 }
.nav-item.logo { transition: all .5s }
```

```js
addEventListener('scroll', fixNav)
```

### [Peekaboo Header Nav Demo](https://codepen.io/kevinweber/pen/MPjYyP)

held: sticky nav.stickyNav | on scroll: nav.stickyNav: transform+top | made with: position: sticky · transition · scroll listener

```css
.stickyNav { position: sticky; top: 0; transform: translateY(0); transition: transform 0.3s }
.stickyNav[data-hidden=true] { transform: translateY(-100%) }
```

```js
addEventListener('scroll', this.handleScroll.bind(this), false)
```

### [Sticky Nav](https://codepen.io/trobes/pen/oPEeey)

on scroll: nav.: shadow+top, div.site-wrap: transform+top | made with: position: fixed · transition · scroll listener

```css
.site-wrap { box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.05); transform: scale(0.98); transition: transform 0.5s }
body.fixed-nav .site-wrap { transform: scale(1) }
nav { top:0; transition:all 0.5s; position: relative }
body.fixed-nav nav { position: fixed; box-shadow:0 5px 0 rgba(0,0,0,0.1) }
li.logo { transition: all 0.5s }
nav a { transition:all 0.2s; text-transform: uppercase }
```

```js
addEventListener('scroll', fixNav)
```

### [Sticky Bootstrap Nav with hidden scroll navigation and mobile social links](https://codepen.io/RickRX/pen/GXJpro)

held: fixed nav.navbar | on scroll: nav.navbar: transform+opacity+top | on hover of a.navbar-brand: nav.navbar: transform+opacity+top | made with: scroll() timeline

```css
nav#main-nav { padding-top: 0; padding-bottom: 0 }
nav#main-nav ul:last-of-type { padding-bottom: 10px }
```

### [#javascript30 Simple sticky nav](https://codepen.io/jonathanbell/pen/VBNYNP)

on scroll: nav.: shadow+top | made with: position: fixed · transition · scroll listener

```css
.site-wrap { box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.05); transform: scale(0.98); transition: transform 0.5s }
nav { top: 0; transition: all 0.5s; position: relative }
.fixed-nav nav { position: fixed; box-shadow: 0 5px rgba(0, 0, 0, 0.5) }
li.logo { transition: all 0.5s }
nav a { transition: all 0.2s; text-transform: uppercase }
```

```js
addEventListener('scroll', fixNav)
```

### [Full-Width Grid w/ Sticky Nav and Sidebar](https://codepen.io/davidleininger/pen/PBxGxv)

held: sticky div.sticky, sticky div, sticky div.grid-item | on hover of li.: li.: color | made with: position: sticky · transition · :hover

```css
.content-grid .grid-item { padding-top: 24px }
.content-grid .sticky { top: 0; position: sticky }
.content-grid .sticky div { box-shadow: 0 0 5px grey; margin-bottom: 24px; top: 24px; position: sticky }
.content-grid .nav li { border-bottom: 4px solid #234; transition: all 0.3s; padding-top: 20px }
.content-grid .nav li:hover { border-bottom: 4px solid #41d6c3 }
.content-grid .item2 { box-shadow: 0 1px 4px 0 rgba(53, 53, 53, 0.25); padding-top: 0; position: sticky; top: -1px }
```

### [Sticky nav](https://codepen.io/ShadiMuma/pen/VxBmKM)

on scroll: li.: color+top ×4, nav.nav: transform+background+color, ul.: color+top | on hover of li.: li.: color ×3, nav.nav: background+color, ul.: color, li.: transform+color+top | made with: position: fixed · transition · :hover · scroll listener

```css
.main { position: relative }
.main .nav { box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3); transition: all 0.6s cubic-bezier(0.86, 0, 0.07, 1), transform 0s }
.main .nav ul li { transition: transform 0.3s ease-out }
.main .nav ul li:hover { transform: scale(1.1) }
.main .fixed { position: fixed; box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3); transition: all 0.6s cubic-bezier(0.86, 0, 0.07, 1) }
.main .text { position: absolute; top: 30%; transform: translateX(-50%) }
.main .text h1 { text-transform: uppercase }
.main .text button { position: relative; transition: 0.5s cubic-bezier(0.86, 0, 0.07, 1) 1s }
.main .text button::before, .main .text button::after { position: absolute; transition: all 0.5s cubic-bezier(0.86, 0, 0.07, 1) 1s, width 0.5s cubic-bezier(0.86, 0, 0.07, 1), height 0.5s cubic-bezier(0.86, 0, 0.07, 1) 0.5s, background 0.5s cubic-bezier(0.86, 0, 0.07, 1), box- }
.main .text button::before { border-bottom: 3px solid #fff; bottom: -10px }
.main .text button::after { border-top: 3px solid #fff; top: -10px }
.height h1 { border-bottom: 3px dotted #333 }
```

```js
addEventListener('scroll', comeIn)
```

### [Sticky Top Navbar (Stick on Scroll Past)](https://codepen.io/jthomasson/pen/zRXraP)

held: fixed header | made with: position: fixed · scroll() timeline

```css
body { padding-top: 99px }
.main-nav, .main { position: relative }
.main-nav { margin-bottom: -60px; box-shadow: 0 2px 3px rgba(0,0,0,.1) }
header, .main-nav-scrolled { position: fixed; top: 0 }
```

### [Sticky-nav](https://codepen.io/H1manshu01/pen/EoGoag)

on scroll: i.fa: transform+top ×12, div.header: background+color+top, div.container: color+top | on hover of img.bg: i.fa: transform+top ×13 | made with: position: fixed · scroll() timeline

```css
.header { margin-top: -48px }
.col-1 { margin-top: 20px; margin-bottom: 20px }
footer { margin-top: 10px; padding-top:5px }
.show { top: 0; position: fixed }
```

### [#JavaScript30 Day 24 : Sticky Nav](https://codepen.io/theBhavikJoshi/pen/mpwmqp)

on scroll: nav.: shadow+top, div.site-wrap: transform+top | made with: position: fixed · transition · scroll listener

```css
.site-wrap { box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.05); transform: scale(0.98); transition: transform 0.5s }
.fixed-nav .site-wrap { transform: scale(1) }
nav { top:0; transition:all 0.5s; position: relative }
.fixed-nav nav { position: fixed; box-shadow:0 5px 0 rgba(0,0,0,0.1) }
li.logo { transition: all .5s }
nav a { transition:all 0.2s; text-transform: uppercase }
```

```js
addEventListener('scroll', fixNav)
```

### [Simple - Make Navigation Sticky Once it Hits the Top of Window](https://codepen.io/blakeleykilgore/pen/KZzxQa)

on scroll: li.: color+top ×5, ul.: color+top | made with: position: fixed · scroll() timeline · transition

```css
nav { transition: background-color 0.5s linear }
.fixed-nav { position: fixed; top: 0; transition: background-color 0.5s linear }
```

### [Sticky nav with hover effect](https://codepen.io/arisusaktos/pen/gGodZa)

held: fixed ul | on hover of li.: a.: background+color+top | made with: position: fixed · transition · :hover

```css
#top-nav { position: fixed }
#top-nav li a { text-transform: uppercase; -webkit-transition: all 0.7s; transition: all 0.7s }
.mid-section { padding-top: 150px }
.mid-section p { padding-bottom: 60px }
```

### [#Javascript30 Day 24: Sticky Nav](https://codepen.io/AdHasbun/pen/KvoPOa)

on scroll: nav.: shadow+top, div.site-wrap: transform+top | made with: position: fixed · transition · scroll listener

```css
.site-wrap { box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.05); transform: scale(0.98); transition: transform 0.5s }
body.fixed-nav .site-wrap { transform: scale(1) }
nav { top:0; transition:all 0.5s; position: relative }
body.fixed-nav nav { position: fixed; box-shadow:0 5px 0 rgba(0,0,0,0.1) }
li.logo { transition: all 0.5s }
nav a { transition:all 0.2s; text-transform: uppercase }
```

```js
addEventListener('scroll', fixNav)
```

### [#JavaScript30 Day 24: Sticky Nav](https://codepen.io/kathykato/pen/YQrEQK)

on scroll: nav.: background+shadow, img.align-right: transform+opacity+top | on hover of li.logo: img.align-right: transform+opacity ×2, nav.: background+shadow, a.: color | made with: position: fixed · transition · :hover · scroll listener

```css
nav { top: 0; transition: all 0.5s; position: relative }
.fixed-nav nav { position: fixed; box-shadow: 0px 6px 9px 0px rgba(0,0,0,.12),0px 0px 6px 0px rgba(0,0,0,.03) }
li.logo { transition: all .5s }
nav a { transition: all 0.2s; text-transform: lowercase }
.slide-in { opacity: 0; transition: all .5s }
.align-left.slide-in { transform:translateX(-30%) scale(0.95) }
.align-right.slide-in { transform:translateX(30%) scale(0.95) }
.slide-in.active { opacity: 1; transform:translateX(0%) scale(1) }
```

```js
addEventListener('scroll', fixNav)
addEventListener('scroll', debounce(checkSlide))
```

### [Sticky Nav - Pure CSS](https://codepen.io/marv117/pen/BRpLzq)

held: sticky div.navbar__component, fixed div.navbar__component | made with: position: sticky · position: fixed · @keyframes · transition

```css
.navbar__component { border-top: 4px solid rgb(98, 162, 116); box-shadow: 0 0 10px #777 }
.navbar--slideup { animation: slideUp 1s forwards }
.navbar__title, .navbar__nav { vertical-align: top }
.navbar__title { position: relative }
.navbar__title .navbar__list { position: relative; top: 0; transition: 0.3s ease-in-out }
.navbar--link { text-transform: capitalize }
.navbar--bottom { position: fixed; bottom: 0 }
.navbar--sticky { position: -webkit-sticky; position: sticky; top: 0; bottom: initial }
.navbar__item .minutes-icon + span { vertical-align: top }
.navbar__nav .navbar__list { position: relative }
.navbar__slider { position: absolute; bottom: 0; transition: 0.3s ease-in-out }
.section { margin-top: 100px }
```

### [Sticky Slider Navigation v2 (Responsive)](https://codepen.io/m0ni2/pen/wJBypx)

held: fixed header.et-header | on scroll: header.et-header: transform+background+shadow | made with: position: fixed · scroll() timeline · transition · :hover · Web Animations API (.animate)

```css
.et-header { position: fixed; top: 0; transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1) }
.et-header--scrolled { box-shadow: 0 0 20px rgba(0, 0, 0, 0.3) }
.et-header--move-up { transform: translateY(-75px); transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1) }
.et-hero-tabs, .et-slide { position: relative }
.et-hero-tabs h3, .et-slide h3 { opacity: 0.6 }
.et-hero-tabs-container { position: absolute; bottom: 0; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1) }
.et-hero-tabs-container--top-first { position: fixed; top: 75px; transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1) }
.et-hero-tabs-container--top-second { position: fixed; top: 0 }
.et-hero-tab { transition: all 0.5s ease }
.et-hero-tab:hover { transition: all 0.5s ease }
.et-hero-tab-slider { position: absolute; bottom: 0; transition: left 0.3s ease }
```

```js
.animate({ scrollTop: scrollTop }, 600)
```

### [Semantic-UI - Sticky Nav](https://codepen.io/WEBteam/pen/QdrYrq)

held: fixed div.ui | on hover of a.header: a.header: background+color, img.logo: color | made with: nothing recognised — read the code

```css
.main.container { margin-top: 7em }
.wireframe { margin-top: 2em }
```

### [Sticky Nav](https://codepen.io/EleftheriaBatsou/pen/JEMpoo)

on scroll: nav.: shadow+top, div.site-wrap: transform+top | made with: position: fixed · transition · scroll listener

```css
.site-wrap { box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.05); transform: scale(0.98); transition: transform 0.5s }
body.fixed-nav .site-wrap { transform: scale(1) }
nav { top:0; transition:all 0.5s; position: relative }
body.fixed-nav nav { position: fixed; box-shadow:0 5px 0 rgba(0,0,0,0.1) }
li.logo { transition: all 0.5s }
nav a { transition:all 0.2s; text-transform: uppercase }
```

### [Sticky Nav Transition](https://codepen.io/jessicakoch136/pen/LxOqYN)

on scroll: nav.: shadow+top, div.site-wrap: transform+top | made with: position: fixed · transition · scroll listener

```css
.site-wrap { box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.05); transform: scale(0.98); transition: transform 0.5s }
.fixed-nav .site-wrap { transform: scale(1) }
nav { top:0; transition:all 0.5s; position: relative }
.fixed-nav nav { position: fixed; box-shadow: 0 5px 3px 0px rgba(0,0,0,0.1) }
li.logo { transition: all 5s }
nav a { transition:all 0.2s; text-transform: uppercase }
```

```js
addEventListener('scroll', fixNav)
```

### [Bubble Text](https://codepen.io/jessicakoch136/pen/VPrqVa)

on hover of li.: span.highlight: transform+top | made with: transition

```css
.wrapper { position: relative }
.highlight { color: transparent transition: all 0.2s; border-bottom:2px solid white; position: absolute; top:0; box-shadow: 0 0 10px rgba(0,0,0,0.2) }
```

```js
addEventListener('mouseenter', highlightLink))
```

### [Sticky Slider Navigation (Responsive)](https://codepen.io/ettrics/pen/WRbGRN)

on hover of a.et-hero-tab: a.et-hero-tab: background+color | made with: position: fixed · scroll() timeline · transition · :hover · Web Animations API (.animate)

```css
.et-hero-tabs, .et-slide { position: relative }
.et-hero-tabs h3, .et-slide h3 { opacity: 0.6 }
.et-hero-tabs-container { position: absolute; bottom: 0; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1) }
.et-hero-tabs-container--top { position: fixed; top: 0 }
.et-hero-tab { transition: all 0.5s ease }
.et-hero-tab:hover { transition: all 0.5s ease }
.et-hero-tab-slider { position: absolute; bottom: 0; transition: left 0.3s ease }
```

```js
.animate({ scrollTop: scrollTop }, 600)
```

### [Multiple Sticky Nav](https://codepen.io/max1128/pen/MeVYOJ)

on scroll: div.breadcrumb-container: background+top | on hover of li.: a.: color | made with: position: fixed · scroll() timeline

```css
.fixed { position: fixed }
```

### [Sticky Name Brand Navbar](https://codepen.io/aaronguernsey/pen/NrvdGx)

on hover of li.: nav.: shadow, a.: background | made with: position: fixed · scroll() timeline · transition · :hover

```css
header { padding-top: 50px }
main { position: relative; margin-top: 150px }
nav { position: relative; margin-bottom: -50px; transition: box-shadow 0.5s ease }
nav li { text-transform: uppercase }
.navScrolled { position: fixed; top: 0; box-shadow: 0px 1px 5px #000 }
```

### [Light HTML5+CSS OnePage Layout](https://codepen.io/fchaussin/pen/bpwydb)

held: sticky div.fixed, sticky a | made with: position: sticky · position: fixed · transition · :hover

```css
body { position: relative }
h1, h2, h3 { margin-bottom: 1.2em }
a { transition: all 300ms ease }
#navbar.fixed { position: sticky; top: 0 }
#navbar ul li, #footer ul li { position: relative }
#navbar ul li a, #footer ul li a { text-transform: uppercase }
#navbar ul li a:after { bottom: 0; position: absolute; transition: width 0.3s ease 0s, left 0.3s ease 0s }
.scrolltop-wrap { position: absolute; top: 12rem; bottom: 0 }
.scrolltop-wrap a { position: fixed; position: sticky; top: -5rem; margin-bottom: -5rem; transform: translateY(100vh) }
.scrolltop-wrap a svg path { transition: all 0.1s }
.scrolltop-wrap a #scrolltop-arrow { transform: scale(0.66) }
#navbar { position: absolute; top: 0 }
```

### [Sticky Menu/Navigation](https://codepen.io/selwynorren/pen/NxQpdJ)

made with: scroll() timeline · transition

```css
header { margin-bottom: 160px; position: absolute; top: 0; transition: all 0.4s ease }
header.sticky { top: 0; position: absolute; margin-bottom: 160px }
#logo { transition: all 0.4s ease }
```

### [Demo Pen for css-tricks forum post](https://codepen.io/mhodges44/pen/mVbJVM)

held: fixed div.overlay, fixed div.header | made with: position: fixed

```css
.header { position: fixed; top: 0; background-position: bottom }
.body { position: absolute; top: 300px }
.overlay { position: fixed; top: 0; filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#a6000000', endColorstr='#00000000',GradientType=0 ) }
```

### [Lower Navigation Sticky on Scroll](https://codepen.io/slstudios/pen/pJMWEa)

on scroll: div.tabs: background+top | made with: position: fixed · scroll() timeline · transition · :hover

```css
header { transition: ease .35s }
header h3 { margin-top:15px }
.scrolling { position:fixed; top:0 }
.tabs li { transition: ease .3s }
.inputbox { position: absolute; top: 22%; -webkit-transform: translate(-50%, -50%) scale(.72); -ms-transform: translate(-50%, -50%) scale(.72); transform: translate(-50%, -50%) scale(.72) }
.inputbox input { position: absolute; top: 0; -webkit-transform: translateX(-50%); -ms-transform: translateX(-50%); transform: translateX(-50%); -webkit-transition: width 0.4s ease-in-out, border-radius 0.4s ease-in-out, padding 0.2s; tra }
.inputbox input:focus + .del:focus, .inputbox input:valid + .del:focus { box-shadow: 0 0 0 1px currentColor }
.inputbox input:focus + .del:before, .inputbox input:valid + .del:before { -webkit-transform: translate(-50%, -50%) rotate(-45deg) scaleY(0.7); -ms-transform: translate(-50%, -50%) rotate(-45deg) scaleY(0.7); transform: translate(-50%, -50%) rotate(-45deg) scaleY(0.7) }
.inputbox input:focus + .del:after, .inputbox input:valid + .del:after { -webkit-transform: translate(-50%, -50%) rotate(45deg) scaleY(0.7); -ms-transform: translate(-50%, -50%) rotate(45deg) scaleY(0.7); transform: translate(-50%, -50%) rotate(45deg) scaleY(0.7) }
.inputbox .del { position: absolute; top: 50%; -webkit-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%); -webkit-transition: left 0.4s ease-in-out; transition: left 0.4s ease-in-out }
.inputbox .del:before { position: absolute; top: 50%; -webkit-transform: translate(32.25px, 32.25px) translate(-50%, -50%) rotate(-45deg) scaleY(1); -ms-transform: translate(32.25px, 32.25px) translate(-50%, -50%) rotate(-45deg) scaleY(1); tran }
.inputbox .del:after { position: absolute; top: 50%; -webkit-transform: translate(-50%, -50%) rotate(45deg) scaleY(0); -ms-transform: translate(-50%, -50%) rotate(45deg) scaleY(0); transform: translate(-50%, -50%) rotate(45deg) scaleY(0); -web }
```

### [Sticky Navigation on Scroll/Click](https://codepen.io/sanjeevks121/pen/mJgyRE)

held: fixed nav | on hover of li.: a.: color | made with: position: fixed · transition · :hover · Web Animations API (.animate)

```css
nav { position: fixed; top: 0 }
nav ul li a { transition: all 0.2s ease }
a.active { border-bottom: 2px solid #ecf0f1 }
section { border-bottom: 1px solid #ccc }
.sections section:first-child { margin-top: 60px }
```

```js
.animate({
```

### [Parallax Header w/jQuery](https://codepen.io/ege/pen/bdzmJd)

held: fixed div.header | on scroll: img.banner: opacity+top, div.logo: opacity+top | made with: position: fixed · scroll() timeline · transition · :hover

```css
a, a:visited { transition: ease 0.2s all }
.header { padding-bottom: 40%; position: fixed; top: 0 }
.header { padding-bottom: 25% }
.header:before { position: absolute }
.header > .banner { position: absolute; top: 0 }
.header > .banner.blurred { opacity: 0 }
.header > .logo { position: absolute; top: 50%; margin-top: -30px }
.header ul.nav { position: absolute; bottom: 0 }
.header ul.nav > li > a { transition: ease 0.1s all }
.content p + p { margin-top: 2em }
```

### [Simple Magellan Sticky Nav](https://codepen.io/allizad/pen/JdmopL)

held: fixed nav | on scroll: a.scroll-button: color ×2 | on hover of li.: nav.: opacity | made with: position: fixed · scroll() timeline · transition · :hover · Web Animations API (.animate)

```css
html { text-transform: uppercase }
a { transition: all 0.5s }
nav { position: fixed; top: 0 }
nav ul li h3 { margin-top: 0; margin-bottom: 0 }
```

```js
.animate({
```

### [Sticky Nav On Scroll](https://codepen.io/leetoufong/pen/zxeMmz)

on scroll: a.: color+top ×3 | on hover of li.: a.: color | made with: position: fixed · transition · :hover

```css
nav { border-bottom: 1px solid; border-top: 1px solid; box-shadow: 0 1px 0 #d5d5d5; position: relative; top: 0; transition: background-color 125ms ease-out }
nav.is-sticky { position: fixed }
nav a { text-transform: uppercase }
```

### [Sticky Navigation or Section with jQuery](https://codepen.io/mrs_snow/pen/qELwxz)

made with: position: fixed · scroll() timeline

```css
.stickycontainer { position:relative }
.stickynav { box-shadow: 0 3px 8px -2px rgba(0, 0, 0, 0.3); -webkit-box-shadow: 0 3px 8px -2px rgba(0, 0, 0, 0.3); position:absolute; top: 0 }
.sticktotop { position:fixed; top: 0 }
.container { box-shadow: 0 0 12px 4px rgba(0,0,0,.3), 0 0 120px 80px rgba(255,255,255,.3) }
```

### [Working with the WordPress Admin Bar on a Site with a Sticky Navigation Bar](https://codepen.io/ControlledChaos/pen/bNOgdX)

held: fixed div | made with: position: fixed · transition

```css
#wpadminbar { position: fixed; top: 0px }
.is-sticky > .nav.logged-in { margin-top: 32px; transition: all .35s }
h2 { margin-bottom: 0.8em }
p { margin-bottom: 1em }
hr { border-top: 1px solid #ccc }
.is-sticky > .nav.logged-in { margin-top: 46px }
#wpadminbar { position: absolute; top: 0 }
.is-sticky > .nav.logged-in { margin-top: 0px }
```

### [fancy sticky nav](https://codepen.io/scottbranch/pen/VYGwOK)

made with: position: fixed · transition

```css
.container header { position: relative; top: 0; transition: background 500ms ease; -webkit-transition: background 500ms ease }
.container header.scrolled { position: fixed; top: -70px; transform: translateY(70px); transition: transform 500ms ease, background 900ms ease; -webkit-transition: transform 500ms ease, background 900ms ease }
.container header nav ul { position: relative; top: 50%; transform: translateY(-50%) }
.container .title h1 { margin-top: 150px }
```

### [Navigation - appear on scroll up](https://codepen.io/leahschuster/pen/myxjVq)

held: fixed header.default | made with: position: fixed · scroll() timeline · transition

```css
.logo { padding-top: 30px }
header.default { border-bottom: 1px solid #f7f7f7; position: fixed; -moz-transform: translateY(0px); -ms-transform: translateY(0px); -webkit-transform: translateY(0px); transform: translateY(0px); -moz-transition: all 500ms; -o-transitio }
header.default.nav-down { -moz-transform: translateY(0px); -ms-transform: translateY(0px); -webkit-transform: translateY(0px); transform: translateY(0px) }
header.default.nav-up { -moz-transform: translateY(-100px); -ms-transform: translateY(-100px); -webkit-transform: translateY(-100px); transform: translateY(-100px) }
.content { padding-bottom: 500px }
```

### [Sticky nav after scrolling past the hero section](https://codepen.io/stacigh/pen/ExqByW)

made with: position: fixed · scroll() timeline

```css
nav { text-transform: uppercase }
nav.sticky { position: fixed; top: 0 }
```

### [Sticky Header](https://codepen.io/zeusfactor/pen/wvQgeQ)

on hover of li.: a.: color | made with: position: fixed · :hover

```css
#menu ul li { text-transform: uppercase }
#menu.fixed { position:fixed; top:0 }
#menu.fixed+#main { margin-top:45px }
```

### [One Page Scroll w/ Sticky Nav](https://codepen.io/twelve31/pen/XWxQMV)

made with: scroll() timeline · Web Animations API (.animate)

```js
.animate({
```

### [Sticky Navigation with jQuery](https://codepen.io/bourkekev/pen/eYPQKd)

made with: scroll() timeline · :hover

```css
#sticky_navigation { -moz-box-shadow: 0 0 5px #999; -webkit-box-shadow: 0 0 5px #999; box-shadow: 0 0 5px #999 }
```

### [Simple Site Template w/ Sticky Nav](https://codepen.io/jparkerweb/pen/vYRPzK)

made with: position: fixed · scroll() timeline · transition · :hover · Web Animations API (.animate)

```css
body.nav-fixed-top { padding-top: 45px }
a { text-transform: uppercase; transition: color 0.35s ease }
.nav { transition: all 0.15s ease }
.nav.nav-fixed-top { top: 0; position: fixed }
```

```js
.animate({ scrollTop: 0 }, 600)
```

### [Animated scroll navigation layout](https://codepen.io/ashdurham/pen/WNwXqv)

held: fixed div.wrapper | on scroll: h1.: opacity+top | made with: position: fixed · scroll() timeline

```css
#header { position: fixed; top: 0; bottom: 0 }
#header a { text-transform: uppercase }
#content { margin-top: 200px }
```

### [Sticky Navigation](https://codepen.io/andreaswiesenhofer/pen/JjXGVq)

made with: position: fixed

```css
.logo { text-transform:uppercase }
li:before { background-position:0px 3px }
a { text-transform:uppercase }
section { text-transform:uppercase }
p { margin-bottom:20px }
.sticky { position:fixed; top:0 }
```

### [Fixed Nav on Scroll](https://codepen.io/atelierbram/pen/xxxjrO)

held: fixed header.banner, fixed footer.footer | on scroll: a.: color+top ×4 | made with: position: fixed · @keyframes · transition · :hover · Web Animations API (.animate)

```css
.banner { -webkit-transition: background .4s; -moz-transition: background .4s; transition: background .4s; border-bottom: 10px solid #8291a4 }
.banner.clone { position: fixed; top: -175px; border-bottom: none }
.has-scrolled .banner.clone { top: 0 }
.nav_list { text-transform: uppercase }
.nav_list a { position: relative }
.has-scrolled .nav { position: fixed; top: 0 }
.has-scrolled .nav_list { padding-top: .25em }
section { padding-top: 3em }
section h2 { position: relative }
section h2:after { position: absolute; top: 0; margin-top: -48px }
.footer { position: fixed; bottom: 0 }
:target { -webkit-animation: highlight 3s ease; -moz-animation: highlight 3s ease; animation: highlight 3s ease; -webkit-animation-fill-mode: forwards; -moz-animation-fill-mode: forwards; animation-fill-mode: forwards }
```

```js
.animate({scrollTop: targetOffset}, 400, function() {
```

### [Sticky Nav with Scrollto](https://codepen.io/BottomlineInteractive/pen/nZrzwL)

held: fixed ul | made with: position: fixed · :hover

```css
#stickynav #nav { position: fixed }
#stickynav #nav li a { box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 3px 0px }
```
