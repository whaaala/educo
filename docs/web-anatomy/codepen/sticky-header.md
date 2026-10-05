# CodePen · sticky-header — how each pen does it

128 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/sticky-header.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| position: fixed | 87 |
| transition | 63 |
| :hover | 46 |
| scroll() timeline | 44 |
| position: sticky | 27 |
| scroll listener | 16 |
| Web Animations API (.animate) | 9 |
| @keyframes | 7 |
| IntersectionObserver | 4 |
| requestAnimationFrame | 4 |
| backdrop-filter | 2 |
| :has() | 2 |
| clip-path | 1 |
| view transitions | 1 |
| custom properties driven by JS | 1 |

## Every pen

### [demo sticky header grid](https://codepen.io/editor/cbolson/pen/01a081b7-563c-70e4-8f5b-ba3da08d0b5a)

held: sticky header | made with: position: sticky

```css
header { position: sticky; top: 0 }
```

### [Scrollable Table](https://codepen.io/darquiza/pen/PwbOrBw)

held: sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky td | on scroll: td.num: background+top ×5, td.: background+top ×3 | made with: position: sticky · :hover

```css
h2 { margin-bottom: 1rem }
thead th { position: sticky; top: 0 }
th, td { border-bottom: 1px solid #ddd8d0 }
th { text-transform: uppercase }
tbody tr:last-child td { border-bottom: none }
td:first-child, th:first-child { position: sticky }
```

### [Modern Responsive Navigation Menu with Mobile Hamburger](https://codepen.io/priyamakes/pen/azdGRPL)

held: fixed nav.navbar | on scroll: nav.navbar: shadow | made with: position: fixed · transition · :hover · scroll listener

```css
.navbar { position: fixed; top: 0; border-bottom: 1px solid var(--border-color); transition: all 0.3s ease }
.navbar.scrolled { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) }
.hamburger { transition: all 0.3s ease }
.hamburger-line { transition: all 0.3s ease }
.hamburger.active .hamburger-line:nth-child(1) { transform: translateY(9px) rotate(45deg) }
.hamburger.active .hamburger-line:nth-child(2) { opacity: 0 }
.hamburger.active .hamburger-line:nth-child(3) { transform: translateY(-9px) rotate(-45deg) }
.nav-link { transition: color 0.2s ease; position: relative }
.nav-link::after { position: absolute; bottom: -8px; transition: width 0.3s ease }
.nav-btn { transition: all 0.2s ease }
.nav-btn.primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25) }
.main-content { margin-top: var(--nav-height) }
```

```js
addEventListener('scroll', () => {
```

### [Natural Sticky Style On Scroll](https://codepen.io/kadykov/pen/XJXbYVX)

made with: transition

```css
header { margin-top: 0; transition: background-color 0.3s ease }
```

### [Natural Sticky Header Floating Events](https://codepen.io/kadykov/pen/ByjNVWP)

made with: transition

```css
.button-container { padding-top: 80px; position: absolute; top: 0 }
.floating-button { transition: background-color 0.3s ease }
```

### [Natural Sticky Header Events](https://codepen.io/kadykov/pen/RNrPyXV)

made with: transition

```css
header { margin-top: 0; transition: background-color 0.3s ease, color 0.3s ease }
```

### [Natural Sticky Top Floating Button](https://codepen.io/kadykov/pen/YPyMyJJ)

made with: nothing recognised — read the code

```css
.button-container { padding-top: 80px; position: absolute; top: 0 }
```

### [Natural Sticky Header](https://codepen.io/kadykov/pen/emprNoY)

made with: nothing recognised — read the code

```css
header { margin-top: 0 }
```

### [Modern Responsive Header with Scroll Effect Description](https://codepen.io/Kuldeep-Rajput-the-sasster/pen/RNWVbQo)

made with: position: fixed · transition · :hover · backdrop-filter · scroll listener

```css
:root { --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) }
.header { position: fixed; top: 0; transition: background-color 0.3s ease, backdrop-filter 0.3s ease }
.header.scrolled { backdrop-filter: blur(10px); box-shadow: var(--box-shadow) }
.logo { text-transform: uppercase; transition: transform 0.3s ease }
.logo:hover { transform: scale(1.05) }
.nav-link { position: relative; padding-bottom: 5px }
.nav-link::after { position: absolute; bottom: 0; transition: width 0.3s ease }
.nav-toggle { position: relative }
.hamburger { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: background-color 0.3s ease, transform 0.3s ease }
.hamburger::before, .hamburger::after { position: absolute; transition: transform 0.3s ease, top 0.3s ease }
.hamburger::before { top: -8px }
.hamburger::after { top: 8px }
```

```js
addEventListener('scroll', () => {
```

### [header_02](https://codepen.io/jtec_web/pen/emYJxRv)

held: sticky header.global_header, fixed div.modal_menu, fixed div | on hover of label.modal_toggle_btn: div.slide: transform+opacity+top ×2, div.slide: transform+top | made with: position: sticky · position: fixed · transition · :hover · :has() · clip-path

```css
header.global_header { position: sticky; top: 0 }
header.global_header label.modal_toggle_btn { position: absolute; top: 10px; transition: all 0.35s ease }
header.global_header label.modal_toggle_btn span { position: absolute; transform: translateX(-50%) }
header.global_header label.modal_toggle_btn span:first-of-type { top: calc(50% - 12px) }
header.global_header label.modal_toggle_btn span:last-of-type { top: 50% }
header.global_header label.modal_toggle_btn span:last-of-type::after { position: absolute; top: calc(50% + 8px); transform: translateX(-50%) }
header.global_header label.modal_toggle_btn:hover { transition: all 0.35s ease }
header.global_header .modal_menu { position: fixed; top: 0; transition: ALL 0.35s ease; opacity: 0 }
header.global_header .modal_menu div.global_menu ul li.main_menu a { border-bottom: 1px solid #999; transition: all 0.35s ease }
header.global_header .modal_menu div.global_menu ul li.main_menu a:hover { transition: all 0.35s ease }
header.global_header .modal_menu div.global_menu ul li.main_menu .sub_menu { position: static; transform: unset; opacity: 1 }
header.global_header:has(input:checked) .modal_menu { opacity: 1 }
```

### [Sticky Header Layout](https://codepen.io/christianWiersgowski/pen/eYaYGjE)

held: fixed header.header, sticky div.menu, fixed footer.footer | made with: position: sticky · position: fixed · transition · scroll listener

```css
.header { position: fixed; top: 0; transition: padding 0.3s, font-size 0.3s }
.menu { position: sticky; top: 140px; padding-top: 60px }
.footer { position: fixed; bottom: 0 }
```

```js
addEventListener('scroll', function() {
```

### [Sticky Header - Shrink & Opacity Effect](https://codepen.io/byKrissK/pen/rNoYaNP)

held: fixed header | on hover of a.: header.: background | made with: position: fixed · transition · :hover

```css
header { position: fixed; top: 0; transition: background-color 0.5s, padding 1s }
.content { margin-top: 30px }
h2 { text-transform: uppercase }
nav a:link, nav a:visited { text-transform: uppercase }
nav a:hover, nav a:active { transform: scale(1.1) }
section { background-position: center }
```

### [2022 Smooth Sticky Header w/IntersectionObserver + CSS Transitions](https://codepen.io/mandynicole/pen/oNqbadb)

made with: position: sticky · view transitions · :hover · backdrop-filter · IntersectionObserver

```css
a { text-underline-offset: 3px }
.message { margin-bottom: 3rem }
.message p:only-of-type, .message p:first-of-type { margin-top: 0 }
.message p:only-of-type, .message p:last-of-type { margin-bottom: 0 }
blockquote p:first-of-type { margin-top: 0 }
blockquote p:last-of-type { margin-bottom: 0 }
code { position: relative }
code:before { position: absolute; inset: -0.5ex -0.6ch }
strong.header { text-transform: uppercase }
strong.header + p { margin-top: 0 }
.subheading { margin-bottom: 3% }
.helper-title.for-sticky-wrapper { top: -0.78rem; position: relative }
```

```js
new IntersectionObserver(stickyWatch)
```

### [Sticky Header](https://codepen.io/emreerdendev/pen/zYRQOaV)

held: sticky h1, sticky h1, sticky h1, sticky h1, sticky h1, sticky h1, sticky h1, sticky h1, sticky h1, sticky h1 | made with: position: sticky

```css
.container { position: relative }
.container h1 { position: sticky; top: 0 }
```

### [CSS: Sticky Header Description List](https://codepen.io/iamsaief/pen/eYVjJjW)

held: sticky dt, sticky dt, sticky dt, sticky dt | made with: position: sticky

```css
.description-list { position: relative; box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.1) }
.description-list dt { position: sticky; top: 0 }
```

### [CSS: Sticky Header and Sidebar](https://codepen.io/iamsaief/pen/eYZRZPB)

held: sticky header.navigation, sticky ol, sticky ul | made with: position: sticky · scroll() timeline · :hover

```css
h1, h2, h3, h4 { margin-bottom: 1rem }
p { margin-bottom: 1rem }
header.navigation { position: sticky; top: 0 }
main aside, main section { padding-top: 50px; padding-bottom: 50px }
main aside > ol, main aside > ul { position: sticky; top: 80px }
.scroll-to-top-btn { position: absolute }
```

### [Scrolling Navigation](https://codepen.io/multanisadik/pen/NWxbEej)

on scroll: ul.nav: background+shadow+top | made with: position: fixed · scroll() timeline · Web Animations API (.animate)

```css
.navigation-wrapper { box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.09); -webkit-box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.09) }
.navigation-wrapper ul.nav { border-bottom: 2px solid #dee2e7; top: 0 }
.navigation-wrapper ul.nav li { margin-bottom: -2px; border-bottom: 4px solid transparent }
.navigation-wrapper ul.nav li a { text-transform: uppercase }
.navigation-wrapper ul.nav.fixed-nav { position: fixed; border-top: 0; box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.09); -webkit-box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.09) }
```

```js
.animate({
```

### [Sticky navigation bar on scroll](https://codepen.io/Marty-Development/pen/abdZgwM)

on hover of li.: i.fas: transform+color+top, i.far: transform+color+top | made with: position: fixed · transition · :hover · scroll listener

```css
.nav { border-bottom: 1px solid #000; transition: all 0.4s ease }
.nav ul li i { transition: 0.4s ease-out }
.nav ul li i:hover { transform: scale(1.1) }
.nav.sticky { position: fixed; top: 0; border-bottom: 3px solid #fbfb6a }
```

```js
addEventListener('scroll', function() {
```

### [Bookmark Offset](https://codepen.io/richwertz/pen/WNrwxGJ)

held: fixed header.primary-header | made with: position: fixed · @keyframes · :hover · Web Animations API (.animate)

```css
header { position: fixed; top: 0 }
h3:target { animation: highlight 4s ease }
@keyframes highlight animates background-color
```

```js
.animate( {
```

### [Spotify UI (SCSS / jQuery)](https://codepen.io/kelly0524/pen/wvKbyaB)

held: fixed div.main__wrap, fixed div.main__wrap, fixed div.main__wrap, fixed div.bg-area, fixed div.modal | on hover of li.nav__list: i.nav__icon: color, p.nav__text: color | made with: position: fixed · scroll() timeline · @keyframes · :hover

```css
input[type=range]::-webkit-slider-thumb { box-shadow: 0 0 1px 0px rgba(0, 0, 0, 0.1); opacity: 0 }
input[type=range]:hover::-webkit-slider-thumb { opacity: 1 }
.side { position: relative }
.side__nav .nav { padding-top: 64px }
.side__contents .contents { margin-bottom: 26px }
.side__contents .contents__box { margin-top: -10px }
.side__contents .contents__list { position: relative }
.side__contents .contents__list.on::before { position: absolute }
.side__new-list { border-top: 1px solid rgba(255, 255, 255, 0.1) }
.side__new-list .new-list { position: relative; top: 50%; transform: translateY(-50%) }
.side__new-list .new-list__icon { transform: rotate(45deg) }
.main { position: relative }
```

### [Sticky site title with jQuery](https://codepen.io/uxmoon/pen/bGVZMBG)

on scroll: div.logo-container: background+color+top, h1.logo: color+top | made with: position: fixed · transition

```css
.logo { transition: color 0.5s ease-in-out }
.logo-container { transition: background-color 0.5s ease-in-out }
.logo-container.is-active { position: fixed; top: 0 }
.spacer { padding-top: 10rem }
```

### [Sticky Header Using Intersection Observer](https://codepen.io/colinlord/pen/vYNZVKV)

held: fixed div.sticky-header | on scroll: div.sticky-header: transform+top | made with: position: fixed · transition · :hover · IntersectionObserver

```css
p { margin-top: 0 }
a { transition: 0.2s all }
.content { margin-top: 30px; box-shadow: 0 0 0px 4px rgba(0, 0, 0, 0.05) }
button { text-transform: none; position: relative; border-bottom: 5px solid #630e1a }
.sticky-header { position: fixed; border-bottom: 2px solid white; top: 0; transform: translateY(-200%); transition: all 0.5s }
.sticky-header.visible { transform: none }
```

```js
new IntersectionObserver(obCallback)
```

### [React Sticky Header](https://codepen.io/shashankp250/pen/OJVWqbX)

held: fixed div, fixed div.footer | made with: position: fixed · transition · scroll listener

```css
#header { position: fixed; top: 0; transition: 0.8s }
.footer { position: fixed; bottom: 0 }
```

```js
addEventListener('scroll', this.handleScroll)
```

### [Responsive CSS Grid with sticky header](https://codepen.io/maximum-pixels/pen/vYOgRLB)

held: fixed header.header | made with: position: fixed

```css
.container { margin-top: calc(3em + (2 * 1em)) }
.grid-item:first-of-type:not(ul) { margin-top: 1em }
header { position: fixed; top: 0 }
```

### [Comparison table with sticky column and header](https://codepen.io/praliedutzel/pen/zYxVwxL)

held: sticky div.ComparisonTable__left, sticky div.ComparisonColumn__header, sticky div.ComparisonColumn__header, sticky div.ComparisonColumn__header, sticky div.ComparisonColumn__header, sticky div.ComparisonColumn__header, sticky div.ComparisonColumn__header, sticky div.ComparisonColumn__header, sticky div.ComparisonColumn__header, sticky div.ComparisonColumn__header | made with: position: sticky

```css
.ComparisonTable { position: absolute }
.ComparisonTable__left { position: sticky; top: 0 }
.ComparisonColumn { padding-top: 100px }
.ComparisonTable__left .ComparisonColumn { padding-top: 0 }
.ComparisonColumn__header { top: 0; position: sticky }
.ComparisonColumn__title { margin-bottom: 16px; padding-top: 16px }
.ComparisonColumn__image { padding-bottom: 53.6% }
.ComparisonColumn__row { border-bottom: 1px solid #3e4d5e }
.ComparisonColumn__row:last-child { border-bottom: none }
```

### [Simple Sticky Header Table](https://codepen.io/Hiero23/pen/OJJNmPQ)

made with: position: fixed

```css
.naglowekKlon { box-shadow: 0px 0px 5px 5px #ededed }
```

### [Responsive CSS Grid Table with a Sticky Header](https://codepen.io/lanaenko/pen/gOOarQV)

held: sticky div.item-a, sticky div.item-b, sticky div.item-c, sticky div.item-d, sticky div.item-d, sticky div.item-d, sticky div.item-d, sticky div.item-d, sticky div.item-d, sticky div.item-d | made with: position: sticky

```css
.wrapper { position:relative }
.grid-table { position: relative }
.grid-table div { border-bottom: 1px solid #ccc }
.grid-table div.row-title { position: sticky }
.grid-table div.item-a { position: sticky; top: 0; border-top: 1px solid #eee }
.grid-table div.item-b { position: sticky; top: 0 }
.grid-table div.item-c { position: sticky; top: 0 }
.grid-table div.item-d { position: sticky; top: calc(3.2em + 1px) }
```

### [Bootstrap Sticky Header](https://codepen.io/md-asaduzzaman-muhid/pen/GRRpgzG)

held: sticky nav.navbar | made with: nothing recognised — read the code

### [Sticky Header CSS Transition](https://codepen.io/hakeemhaki/pen/gOYdoRY)

held: fixed header | on scroll: header.: background | made with: position: fixed · scroll() timeline · transition · :hover

```css
body { padding-top: 330px; -moz-transition: padding-top 0.5s ease; -o-transition: padding-top 0.5s ease; -webkit-transition: padding-top 0.5s ease; transition: padding-top 0.5s ease }
header { position: relative; position: fixed; top: 0; -moz-transition: all 0.5s ease; -o-transition: all 0.5s ease; -webkit-transition: all 0.5s ease; transition: all 0.5s ease }
header h1 { text-transform: uppercase; -moz-transition: all 0.3s ease; -o-transition: all 0.3s ease; -webkit-transition: all 0.3s ease; transition: all 0.3s ease }
header nav { position: absolute; bottom: 0 }
header nav a:hover { -moz-box-shadow: 0 0 0 1px #fff; -webkit-box-shadow: 0 0 0 1px #fff; box-shadow: 0 0 0 1px #fff }
h2 { text-transform: uppercase }
p { margin-bottom: 2rem }
section { margin-bottom: 40px; -moz-box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2); -webkit-box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2); box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2) }
body.sticky-header { padding-top: 100px }
body.sticky-header header h1 { -moz-transform: scale(0, 0); -ms-transform: scale(0, 0); -webkit-transform: scale(0, 0); transform: scale(0, 0) }
```

### [StickyHeader Hook](https://codepen.io/pd-smith/pen/BaBmKZL)

made with: scroll listener

```js
addEventListener('scroll', checkIfSticky)
```

### [Toggle Header Depending on Scrolling Direction 👆👇](https://codepen.io/tutsplus/pen/WNerWWp)

held: fixed div.trigger-menu-wrapper, fixed ul.menu, fixed a.lottie-wrapper, fixed footer.page-footer | on scroll: div.trigger-menu-wrapper: transform+top, a.lottie-wrapper: background | made with: position: fixed · transition · scroll listener

```css
body { position: relative }
.trigger-menu-wrapper { position: fixed; top: 0; transition: transform 0.4s }
.page-header .trigger-menu svg { transition: transform 0.3s }
.page-header .menu { position: fixed; top: 0; bottom: 0 }
.lottie-wrapper { position: fixed; bottom: 50px }
.page-main section { position: relative; background-position: center }
.page-main section::before { position: absolute; top: 0; bottom: 0 }
.menu-open .page-header svg { transform: rotate(45deg) }
.scroll-down .trigger-menu-wrapper { transform: translate3d(0, -100%, 0) }
.scroll-up .trigger-menu-wrapper { transform: none }
.scroll-up:not(.menu-open) .trigger-menu-wrapper { box-shadow: 0 0 10px rgba(0, 0, 0, 0.35) }
.page-footer { position: fixed; bottom: 10px }
```

```js
addEventListener("scroll", () => {
```

### [StickyHeader with jQuery](https://codepen.io/artursopelnik/pen/NZXxWW)

made with: position: fixed · @keyframes · requestAnimationFrame

```css
.header, .sticky-header { position: relative; top: 0 }
.content { box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.15), 0 1px 1px 0 rgba(0, 0, 0, 0.05) }
.stucked { position: fixed; animation-duration: 0.5s; animation-timing-function: ease; animation-name: showStickyHeader }
0% { transform: translateY(-100%) }
100% { transform: translateY(0) }
@keyframes showStickyHeader animates transform, height
```

```js
requestAnimationFrame(run)
```

### [CSS-grid list alignment by first space](https://codepen.io/lmoroz/pen/vwQYQZ)

held: sticky div.row | on scroll: div.row: background+shadow+top | made with: position: sticky · transition · IntersectionObserver

```css
.gridNamesContainer .row { margin-top: 0; margin-bottom: 0 }
.gridNamesHeader { position: sticky; top: 0; transition: all 0.5s ease }
.gridNamesHeader.pinned { box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3) }
```

```js
new IntersectionObserver(
```

### [Fix header when scrolling with animation](https://codepen.io/minhluan/pen/vwKVqY)

made with: position: fixed · scroll() timeline · transition

```css
* { box-shadow: border-box }
p { margin-bottom: 1em }
ol, ul { list-style-position: inside }
.header { box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.8) }
.header.fixed { position: fixed; top: 0; transition: transform 0.3s; transform: translateY(-200%) }
.header.slide-down { transform: translateY(0); transition: transform 0.3s }
```

### [Fixed Menu with active link populated on scroll](https://codepen.io/P1xt/pen/VNrPbg)

held: fixed header.template__header | made with: position: fixed · scroll listener

```css
.template__brand { text-transform: uppercase }
.template__header { position: fixed; top: 0 }
.template__nav-item { text-transform: uppercase }
.template__section { padding-top: 50px }
```

```js
addEventListener("scroll", () => {
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

### [Scroll back fixed header](https://codepen.io/johndownie/pen/ywZbpP)

held: fixed header | made with: position: fixed · scroll() timeline · transition

```css
header { position: fixed; top: 0; transition: top 0.5s ease-in-out; box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05) }
.hide-nav { top: -70px }
```

### [sticky header](https://codepen.io/ritesh-singh/pen/vbVZVm)

made with: position: fixed · :hover

```css
.sticky + .content { padding-top: 60px }
```

### [📌Sticky Header Table](https://codepen.io/jakob-e/pen/ZVNOdg)

held: sticky th.ascending, sticky th, sticky th, sticky th, sticky th | on scroll: td.: background+top ×5 | made with: position: sticky · scroll() timeline · transition · :hover

```css
*, *::before, *::after { position: relative }
table thead th { position: sticky; top: 0 }
table td { border-top: 0 }
table th { box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.1) }
table th { transition: background-color 150ms }
table th:before { transition: transform 300ms, color 300ms; position: absolute; top: calc(50% - 9px) }
table .ascending:before { transform: rotate(-90deg) }
table .descending:before { transform: rotate(90deg) }
h1 { margin-bottom: 48px }
```

### [Animated Sticky Header with Clickable Scroll Indicator](https://codepen.io/lbenmore/pen/bONaRJ)

held: fixed div.header | on scroll: div.header: transform+top | made with: position: fixed · transition · custom properties driven by JS · scroll listener

```css
.header--rel { position: relative }
.header--fix { position: fixed; top: 0; transform: translateY(-100%); transition: transform 0.5s }
.header__indicator { position: absolute; top: 0 }
.header__indicator::before { position: absolute; top: 0 }
```

```js
addEventListener('scroll', () => {
style.setProperty('--scroll-perc', `${scrollPerc * 100}%`)
```

### [3 tips about position: sticky](https://codepen.io/nabaroa/pen/aQKMVq)

held: sticky ul.sticky, sticky ul.sticky | made with: position: sticky

```css
.sticky { position: sticky; top: 50px }
```

### [Sticky header with Scrollup Reveal](https://codepen.io/dicson/pen/yQKZbe)

on scroll: div.component-header: transform+shadow+top | made with: position: fixed · scroll() timeline · transition

```css
header { position: rlative }
header .component-header { position: absolute; top: 0; text-transform: uppercase }
header .component-header.sticky { position: fixed; transform: translate3d(0, -100%, 0); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) }
header .component-header.sticky.animation { will-change: transform; transition: transform 0.4s ease-in-out }
header .component-header.sticky.reveal { transform: translate3d(0, 0, 0) }
header .component-header h1 small { opacity: 0.5 }
```

### [sticky header](https://codepen.io/shagunjusta/pen/RePLRN)

held: fixed header.stickyHeader | on hover of li.: li.: background | made with: position: fixed · transition · :hover

```css
body { opacity:1 }
.navbar ul li a { border-bottom:none }
.navbar { box-shadow: 0 5px 10px #0000003d, 0 5px 10px #0000003d; position: relative }
.stickyHeader { position: fixed; top: 0 }
.navbar ul li { text-transform: uppercase }
.navbar ul li:hover { transition: 0.4s ease-in-out }
```

### [Sticky header hover opacity](https://codepen.io/Buddhalimbu/pen/pOrbZr)

on scroll: div.header: opacity | made with: position: fixed · transition · :hover

```css
.container:hover .header { opacity: 1; transition :0.9s }
.header { opacity:0 }
.sticky { position: fixed; top: 0 }
.sticky + .content { padding-top: 102px }
```

### [Sticky List Headers](https://codepen.io/ahoefling/pen/vzgaMJ)

held: sticky li.title, sticky li.title, sticky li.title, sticky li.title, sticky li.title | made with: position: sticky · :hover

```css
.search-results { margin-bottom: 5em }
.search-results .title { position: sticky; position: -webkit-sticky; top: 1em }
.search-results .results ol { margin-top: -2.5em }
.search-results .results ol li:first-child { padding-top: 0 }
.search-results .results ol li ol li:last-child { padding-bottom: 0 }
.search-results .results ol li ol li:last-child::after { border-bottom: solid 1px #c3c3c3 }
```

### [Sticky header](https://codepen.io/chirag-front-end-designer/pen/pOEEZr)

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

### [Dropdown Example](https://codepen.io/participator/pen/OwdroE)

held: sticky h1 | made with: position: sticky · position: fixed

```css
h1 { margin-top: 0; padding-top: 10px; position: fixed; position: sticky; top: 0 }
.main { position: relative }
.space { padding-top: 10px }
.symbol { margin-top: 5px }
```

### [Digital Resume](https://codepen.io/lafrish/pen/ZjrgXN)

held: sticky header.subBanner | on hover of a.: a.: color, i.far: color | made with: position: sticky · scroll() timeline · transition · :hover

```css
body .banner { margin-top: 0 }
body .banner .heading { margin-top: 9% }
body .banner .subHeading { margin-top: 0% }
body header { position: sticky; top: 0; border-bottom: 3px solid #070707; -moz-transition: all 0.5s ease-in-out; -o-transition: all 0.5s ease-in-out; -webkit-transition: all 0.5s ease-in-out; transition: all 0.5s ease-in-out }
body header .email a { margin-top: 15px }
body header .email a i { padding-top: 4px }
body header .tel a { margin-top: 17px }
body header .tel a i { transform: rotate(100deg); -ms-transform: rotate(100deg); -webkit-transform: rotate(100deg) }
body header .website a { margin-top: 15px }
body header .website a i { padding-top: 3px }
body .container .mainRow .leftColumn { position: relative }
body .container .mainRow .leftColumn .section { margin-bottom: 50px }
```

### [CSS Grid w/sticky header](https://codepen.io/krystyna93/pen/KBZLBN)

held: sticky header | on hover of li.: a.: color | made with: position: sticky · :hover

```css
a { text-transform: capitalize }
ul li { text-transform: capitalize }
header { position: sticky; position: -webkit-sticky; top: 0 }
.sidebar ul { border-top: 1px solid var(--element-dark-color) }
.sidebar ul li { border-bottom: 1px solid var(--element-dark-color) }
```

### [React Sorted Table with Sticky Header](https://codepen.io/briancribb/pen/WJGWaQ)

made with: nothing recognised — read the code

### [responsive header](https://codepen.io/navidesigns/pen/Kogyro)

held: fixed header.top, fixed section.product_overlay | made with: position: fixed · scroll() timeline · transition · :hover

```css
.top { position: fixed; top: 0 }
.logo { position: relative; top: 4px }
.mobile_bg { position: fixed; top: 45px; bottom: 0 }
.product_overlay { position: fixed; top: 50px }
nav.products { position: absolute; top: 50%; transform: translate(-50%, calc(-50% + 0%)) }
nav.products .nav-head { margin-bottom: 10px; position: relative }
nav.products .nav-head:before { position: absolute }
nav.products .pro-nav { margin-bottom: 20px }
nav.products .pro-nav a { opacity: 0.6 }
.navbtn { position: absolute; top: 13px }
.bar { position: relative; transform: translateY(7px); transition: all 0ms 300ms }
.bar:before { position: absolute; bottom: 7px; transition: bottom 300ms 300ms cubic-bezier(0.23, 1, 0.32, 1), transform 300ms cubic-bezier(0.23, 1, 0.32, 1) }
```

### [Auto-Hide Sticky Header](https://codepen.io/emelyanova/pen/GxKKpG)

held: fixed header.header | on scroll: header.header: transform+top | on hover of img.: header.header: transform+top | made with: position: fixed · :hover · scroll listener

```css
.header { position: fixed; top: 0; box-shadow: 0 0.063em 0.25em rgba(37, 50, 55, 0.25); transition-property: transform }
.header--hidden { transform: translateY(-100%) }
.header a { text-transform: uppercase }
.content > *:not(:last-child) { margin-bottom: 1.875rem }
.content hr { opacity: 0.1 }
```

```js
addEventListener( 'scroll', throttle( throttleTimeout, function()
```

### [table with sticky header and columns](https://codepen.io/jodaks/pen/yvMoMY)

held: sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th | made with: position: sticky

```css
.sticky-container { margin-top: 25px }
.sticky-table th { position: sticky; top: 0; border-bottom: 1px solid #888 }
.sticky-table th:first-child, .sticky-table td:first-child { position: sticky }
.sticky-table th:nth-child(2), .sticky-table td:nth-child(2) { position: sticky }
```

### [CSS sticky header](https://codepen.io/abbeyjfitzgerald/pen/LexmVG)

held: sticky header.navbar-fixed-top | made with: position: sticky

```css
.navbar-fixed-top { position: sticky; position: -webkit-sticky; top: 0 }
```

### [Sticky Header & Footer Template](https://codepen.io/jtodd22/pen/gXqOPN)

held: fixed header.header-main, fixed footer.main-footer | made with: position: fixed

```css
.scroll-wrap { top: 50px; bottom: 0 }
.header-main { position:fixed; top: 0px }
.content { padding-bottom: 30%; padding-top: 2rem }
p { margin-bottom: 2rem }
.main-footer { position: fixed; bottom: 0px }
```

### [Sticky Header, sticks only on scroll UP](https://codepen.io/theaemarie/pen/YEOpqM)

made with: position: fixed · @keyframes · scroll listener

```css
.header-docked .header { position: absolute; top: 0 }
.header-docked .header-search { position: fixed }
.header-docked .header--out { position: fixed; top: 0; animation-name: header-slide-out; animation-fill-mode: forwards; animation-duration: 0.2s; animation-delay: 0.2s }
.header-docked .header--sticky { position: fixed; top: -54px; animation-name: header-slide-in; animation-fill-mode: forwards; animation-duration: 0.2s }
from { top: -54px }
to { top: 0 }
from { top: 0 }
to { top: -54px }
@keyframes header-slide-in animates top
@keyframes header-slide-out animates top
```

```js
addEventListener('scroll', throttle(stickHeader, 200) )
```

### [Simple parallax example](https://codepen.io/Aleix/pen/gXRywB)

on scroll: nav.navbar: shadow+top | made with: position: fixed · scroll() timeline · transition · :hover · Web Animations API (.animate)

```css
.fixed-navbar { position: fixed; top:0; box-shadow: 0px 1px 10px 1px gray }
.bgimg-1, .bgimg-2, .bgimg-3 { position: relative; background-position: center }
.bgimg-1 { opacity: 0.65 }
.bgimg-3::after { position: absolute; opacity: 0.65; background-position: center }
.scroller { position: absolute }
.link-1 { padding-bottom: 30px }
.link-1::after { border-top: 0px; transform: rotateZ(45deg); transition: all .3s }
.link-1:hover::after { border-top: 0px }
.go-down { background-position: center }
.go-down-2 { position: relative; background-position: center; transition: all .3s }
.go-down-2:hover { transform: translateY(10px) }
```

```js
.animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear')
```

### [Gradual sticky header](https://codepen.io/Totati/pen/oGddbW)

held: fixed nav.navbar | made with: requestAnimationFrame

```js
requestAnimationFrame( setHeight )} )
```

### [Sticky menu](https://codepen.io/an-ska/pen/Jyapad)

made with: position: fixed · scroll() timeline

```css
.header.sticky { position: fixed; top: 0 }
.header.sticky + tr { margin-top: 50px }
```

### [Sticky headers with IntersectionObserver](https://codepen.io/danirod/pen/preJgX)

held: sticky nav.navigation-menu | made with: position: sticky · :hover · IntersectionObserver

```css
body { padding-top: 0; margin-top: 0 }
header.site-header { position: relative }
nav.navigation-menu { position: sticky; top: 0 }
nav.navigation-menu ul { border-top: 1px solid #6497ca; border-bottom: 1px solid #c8c8c8 }
nav.navigation-menu ul li { vertical-align: top }
main h1 { margin-top: 0; padding-top: 0.6em }
```

```js
new IntersectionObserver((entries, observer) => {
```

### [Sticky header with css transitions (Bootstrap compatible)](https://codepen.io/onegrumpybunny/pen/mMRdoE)

made with: position: fixed · scroll() timeline · transition · :hover

```css
.header-banner { background-position: center }
.membercard h4 { border-bottom: 2px solid #922433 }
.logosm img { margin-top: 5px; position: relative }
header h1 { position: absolute; top: 72px }
.fixed-header { position: fixed; top:0; -webkit-transition: opacity 1.0s ease-in; -moz-transition: opacity 1.0s ease-in; -o-transition: opacity 1.0s ease-in; opacity: .9 }
```

### [Highly performant sticky header](https://codepen.io/2kool2/pen/GErgKb)

held: sticky header.sticky_header, fixed footer.myStuff | on scroll: header.sticky_header: transform+top | on hover of li.: header.sticky_header: transform+top | made with: position: sticky · position: fixed · transition · :hover · requestAnimationFrame

```css
.body_copy { border-bottom: 1px solid transparent }
.sticky_header { position: -webkit-sticky; position: sticky; top: 0; box-shadow: 0 .25rem .25rem var(--shadow); transform: translateY(0); transition: transform .4s ease-out }
.sticky_header-hidden { transform: translateY(-100%) }
```

```js
requestAnimationFrame(_redraw)
requestAnimationFrame(_onScroll)
```

### [Sticky Navbar with Flexbox](https://codepen.io/jrothra/pen/jmMbWX)

held: fixed div | made with: position: fixed

```css
#navbar { position: fixed }
h1 { margin-top: 0 }
```

### [jQuery Sticky Header Appears on Upscrolling](https://codepen.io/Freizeitler/pen/MpvBex)

held: fixed header.header | on scroll: header.header: transform+top | made with: position: fixed · scroll() timeline · transition

```css
p { margin-bottom: 1em }
.header { border-bottom: 1px solid #fff; box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.3); position: fixed; top: 0; transform: translateY(0); transition: transform 0.3s }
.header-hidden { transform: translateY(-100px); transition: transform 0.6s }
```

### [FlexGrid/Column/Sticky Headers](https://codepen.io/MESCIUS-Korea/pen/mWrYmQ)

held: fixed div, fixed div | on scroll: div.wj-cell: background+color | on hover of a.: a.: color | made with: nothing recognised — read the code

### [Bid Activity Exploration](https://codepen.io/shaheeb/pen/NpRBYv)

held: sticky div.text_normal, sticky div.dateHeader, sticky div.dateHeader, sticky div.dateHeader | made with: position: sticky

```css
.dateHeader { position: -webkit-sticky; position: -moz-sticky; position: -o-sticky; position: -ms-sticky; position: sticky; top: 0px; #box-shadow: 2px 2px }
```

### [Sticky Header](https://codepen.io/marufalbashir/pen/MpWNGq)

on scroll: div.header-outer: background+shadow+top, div.header-inner: color+top | made with: position: fixed

```css
.fixed { position:fixed; top: 0; box-shadow: 0px 3px 5px rgba(0, 0, 0, .4) }
.content { position: relative }
.content span { position: absolute; top: 0 }
```

### [Hide header on scroll down, show on scroll up](https://codepen.io/sajjad/pen/vgEZNy)

held: fixed header.nav-down | made with: position: fixed · scroll() timeline · transition

```css
body { padding-top: 40px }
header { position: fixed; top: 0; transition: top 0.2s ease-in-out }
.nav-up { top: -40px }
```

### [ScrollMagic Pin Menu to top after scroll](https://codepen.io/jonathanphz/pen/MjYQVx)

made with: nothing recognised — read the code

### [Foundation Flex Layout](https://codepen.io/RickHocutt/pen/mENVoX)

on hover of a.: a.: color, div.info: color | made with: nothing recognised — read the code

### [Flexbox sticky header and footer & centered content.](https://codepen.io/JackEdwardLyons/pen/JKebgJ)

made with: nothing recognised — read the code

### [shrink header on scroll, sticky header, and scroll to top](https://codepen.io/Navedkhan012/pen/EyVGMK)

held: fixed header, fixed a.scroll-top | on scroll: a.scroll-top: transform+top | on hover of a.scroll-top: header.: background, a.scroll-top: transform+top | made with: position: fixed · scroll() timeline · transition · :hover · Web Animations API (.animate)

```css
header { position: fixed; transition: all 1s }
.sticky { position: fixed }
.scroll-top { position: fixed; bottom: 20px; transition: all 1s }
.scroll-top:hover { transform: scale(1.1, 1.1); transition: all 1s }
.hide { transform: scale(0, 0) }
```

```js
.animate({
```

### [Pure CSS Sticky header](https://codepen.io/wakh/pen/LZpRJW)

held: fixed div.nav | on scroll: div.nav: opacity, div.Blogo: opacity+top, div.Slogo: opacity+top | made with: position: fixed · transition · :hover

```css
.nav { position: fixed; transition: all .8s ease .2s; top: 0px }
.content:hover ~.nav { padding-top: 0px; opacity: 0.5 }
.nav, .slider:hover ~.nav { padding-top: 50px }
.content:hover ~.nav .Blogo { opacity:0; transition: all .6s ease-in .0s }
.content:hover ~.nav .Slogo { opacity:1; transition: all .6s ease-out .5s }
.slider:hover ~.nav .Blogo { opacity:1; transition: all .6s ease-in .5s }
.slider:hover ~.nav .Slogo { opacity:0; transition: all .6s ease-out .0s }
.Blogo { bottom:18%; opacity:1; position: absolute }
.Slogo { bottom:20%; opacity:0; position: absolute }
.content:hover ~.nav .Mlogo:after { opacity:0; transition: all .6s ease-in .0s }
.content:hover ~.nav .Mlogo:before { opacity:1; transition: all .6s ease-out .5s }
.slider:hover ~.nav .Mlogo:after { opacity:1; transition: all .6s ease-in .5s }
```

### [CSS Only Shrinking Header Effect](https://codepen.io/mosesserapio/pen/ezmMgb)

held: fixed div | made with: position: fixed

```css
#shrinking-header { position: relative }
#sticky-header { position: fixed; top: 0 }
#main { position: relative }
```

### [Sticky Header](https://codepen.io/vijendrajangid/pen/PzwoGj)

held: fixed a.scrollToTop | on scroll: div.wrap: background | on hover of a.scrollToTop: header.: background | made with: position: fixed · scroll() timeline · transition · :hover · Web Animations API (.animate)

```css
header { margin-bottom: 20px; position: relative; transition:all 0.7s ease-in-out; -webkit-transition:all 0.7s ease-in-out; -moz-transition:all 0.7s ease-in-out }
.logo { position: relative }
.sticky { top:0 }
.scrollToTop { position:fixed; bottom:60px }
.scrollToTop:hover { opacity:0.8 }
```

```js
.animate({scrollTop : 0},800)
```

### [Sticky header table](https://codepen.io/Kamilius/pen/RaOXMo)

made with: nothing recognised — read the code

### [Responsive Scrolling Sticky Header](https://codepen.io/tomhodgins/pen/BKPJaN)

on scroll: header.: background+shadow+top | made with: position: fixed · transition · :hover

```css
section span { padding-top: calc(50vh - 20pt) }
header { position: absolute; top: 100vh; transition: opacity .2s ease-in-out }
nav a { opacity: .7; transition: opacity .2s ease-in-out }
nav a:hover, nav a:focus { opacity: 1 }
article { box-shadow: rgba(0,0,0,.05) 0 3px 15px }
article p + p { margin-top: .7em }
header { position: fixed; top: 0; box-shadow: rgba(0,0,0,.05) 0 3px 15px }
```

### [In-page link with sticky header](https://codepen.io/altaf7422/pen/oxdaqo)

made with: Web Animations API (.animate)

```js
.animate({
```

### [Sticky Header](https://codepen.io/petrushonis/pen/grRMxE)

held: fixed div.nav-container | made with: position: fixed · transition · :hover

```css
.nav-container { position: fixed; top: 0 }
.nav-controls .main a { transition: all 0.3s ease-out }
.nav-controls ul li a { transition: all 0.3s ease-out }
```

### [Unstickable Sticky Elements](https://codepen.io/clockworkdaniel/pen/obrayr)

made with: position: fixed · scroll() timeline

```css
.other-element p { padding-top: 20px }
.sticky-element { position: static }
.sticky-element.sticky-element-sticky { position: fixed; top: 0 }
.sticky-element-positioner { position: static }
```

### [Simple Sticky Navigation Bar](https://codepen.io/webdevstudios/pen/qbMdGG)

on hover of li.: a.: background | made with: position: fixed · transition · :hover

```css
.pen-title { margin-bottom: 0 }
.pen-description { margin-bottom: 3rem }
.image-as-background { background-position: center center }
.screen-reader-text { position: absolute !important }
.screen-reader-text:hover, .screen-reader-text:active, .screen-reader-text:focus { box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.6); top: 0.3125rem }
.menu a { transition: all 0.2s ease-in-out }
.menu-item-has-children { position: relative }
.menu-item-has-children a:after { border-top: 7px solid #000000; position: absolute; top: 50% }
.sub-menu { position: absolute }
.sub-menu .sub-menu { top: 0 }
.sticky-nav .navigation-menu { position: fixed; top: 0 }
.sticky-nav .site-content { padding-top: 3.25rem }
```

### [Sticky header footer](https://codepen.io/e4sternwind/pen/Qyqjaa)

made with: position: fixed · scroll() timeline · transition

```css
.page-wrap { margin-bottom: -48px; margin-top: 0 }
.header-banner { background-position: center -170px }
header .logo { background-position: center top; position: absolute; top: 72px }
header h1 { position: absolute; top: 72px }
header h1 span { border-bottom: 2px solid #e8f380; padding-bottom: 12px }
.fixed-header { opacity: 0.8; position: fixed; top: 0; border-bottom: 2px solid orange }
nav { -webkit-transition: all .4s ease; transition: all .4s ease }
.site-footer { padding-top: 20px }
```

### [Responsive Flexbox Sticky Header](https://codepen.io/maccgizzle/pen/wMdare)

made with: scroll() timeline

### [Sticky Header on Scroll](https://codepen.io/nailaahmad/pen/vLyLaK)

held: fixed nav.nav | made with: position: sticky · position: fixed

```css
.nav__state { margin-top: 1em }
.nav.stuck { position: fixed; top: 0 }
```

### [Sticky Header!](https://codepen.io/pixeluh/pen/zvMOdO)

held: fixed nav | on hover of li.: a.: color | made with: position: fixed · :hover

```css
header nav { position: fixed; top: 0 }
section { padding-top: 90px }
```

### [Sticky Header](https://codepen.io/pixeluh/pen/qOJoNV)

held: fixed nav | on hover of li.: a.: color | made with: position: fixed · :hover

```css
header nav { position: fixed; top: 0 }
section { padding-top: 90px }
```

### [Sticky Headers on Scroll](https://codepen.io/michaelbowlin/pen/QjZWvj)

made with: position: fixed · scroll() timeline

```css
.followMeBar { border-bottom: solid 1px #111; border-top: solid 1px #444; position: relative }
.followMeBar.fixed { position: fixed; top: 0 }
.followMeBar.fixed.absolute { position: absolute }
```

### [c-sticky-head](https://codepen.io/jamiecam43/pen/OyxWXq)

held: fixed div.o-sticky-head | made with: position: fixed · transition

```css
body { padding-top: 200px }
.o-sticky-head { position: fixed; top: 0; transition: height 0.3s; border-bottom: 2px solid orange }
.o-sticky-head__logo { transition: all 0.3s; position: relative }
.o-sticky-head__nav { position: relative }
.o-sticky-head__item { transition: all 0.3s }
```

### [Sticky Menu](https://codepen.io/mahdi-alavi/pen/BoBOwe)

on scroll: div.site-navigation: shadow+top | made with: position: fixed · scroll() timeline · transition

```css
.site-navigation.sticky { position:fixed; top:-70px; -webkit-box-shadow:0px 1px 10px 0px rgba(0,0,0,0.1); -moz-box-shadow: 0px 1px 10px 0px rgba(0,0,0,0.1); box-shadow: 0px 1px 10px 0px rgba(0,0,0,0.1); -webkit-transition:all .5s; -moz-transition }
.site-navigation.nav-appear { top:0 }
```

### [Header change color on scroll](https://codepen.io/alessandrocataldi/pen/EVYZPY)

held: fixed header | on hover of li.: a.: color | made with: position: fixed · scroll() timeline · transition · :hover

```css
* { transition: all 0.3s ease 0s }
header { position: fixed }
.menu a { text-transform: uppercase }
article { margin-top: 4em; margin-bottom: 4em }
h2 { margin-top: 1em; margin-bottom: 1em }
p { margin-top: 1em; margin-bottom: 1em }
```

### [Sticky Header with vanilla JS](https://codepen.io/abhisack/pen/NqQdje)

made with: position: fixed · transition · scroll listener

```css
header { position: relative; top: 0; transition: all 0.3s ease-in-out }
.sticky { position: fixed }
```

```js
addEventListener("scroll", function() {
```

### [Simple Sticky Header](https://codepen.io/viablethought/pen/MwLoYv)

held: fixed header.fixed-header | made with: position: fixed · scroll() timeline · transition · :hover · :has()

```css
header { position: relative }
header.fixed-header { position: fixed }
.head-control { position: relative }
.head-wrap { position: relative }
.head-contact-item { vertical-align: top }
.head-social { vertical-align: top }
.head-social-item { position: relative }
.head-social-item a { position: relative }
.head-social-item i { position: relative; vertical-align: top }
.head-social-item a:before { position: absolute; top: 0px; transition: height 0.3s ease 0s }
.header-mid { box-shadow: 0px 2px 0px -1px rgba(0, 0, 0, 0.08) }
.logo { position: relative }
```

### [Headroom.js — Basic header example](https://codepen.io/xtianmiller/pen/bdmxzN)

held: fixed header.headroom | made with: position: fixed · transition

```css
.headroom { position: fixed; top: 0; transition: all 0.25s ease-in-out }
.headroom h1 { position: relative; top: 50%; transform: translateY(-50%); margin-top: -2px }
.headroom nav { position: relative; top: 50%; transform: translateY(-50%); margin-top: -2px }
.headroom--pinned { transform: translateY(0%) }
.headroom--unpinned { transform: translateY(-100%) }
.instructions { padding-top: 8em }
```

### [Sticky Header color change](https://codepen.io/MJLim/pen/PqQXBQ)

held: fixed header | on scroll: header.: background | made with: position: fixed · scroll() timeline · transition

```css
header { position: fixed; transition: all 0.5s ease-in }
```

### [Multiple Sticky Titles with CSS and JS](https://codepen.io/hardik004/pen/KpXomr)

made with: position: fixed

```css
.followMeBar { position: relative }
.followMeBar.fixed { position: fixed; top: 0 }
.followMeBar.fixed.absolute { position: absolute }
```

### [FlyIn Top Sticky Header onScroll](https://codepen.io/JohnnyJuarez/pen/mJMQzL)

held: fixed header.yahoo | made with: position: fixed · transition · scroll listener · requestAnimationFrame

```css
.yahoo { position: fixed; top: 0; transform: translateY(20%); opacity: 0; transition: all 0.3s }
.yes .yahoo { transform: translateY(0); opacity: 1 }
```

```js
addEventListener('scroll', onScroll, false)
```

### [AR header & nav mockup](https://codepen.io/TincanPipPip/pen/rVOMmp)

held: fixed header, fixed nav | on scroll: a.: transform+top | on hover of a.: span.: background | made with: position: fixed · scroll() timeline · transition · :hover

```css
body { padding-top: 140px }
header { position: fixed; top: 0; border-bottom: 1px solid #ccc; transition: all 200ms ease-in-out }
header.scrolled #nav-toggle { transform: translateY(-15px) }
#nav-toggle { position: relative; top: 35px; transition: all 200ms ease-in-out }
#nav-toggle span, #nav-toggle span:before, #nav-toggle span:after { position: absolute; transition: all 200ms ease-in-out }
#nav-toggle span:before { top: -8px }
#nav-toggle span:after { bottom: -8px }
#nav-toggle.active span:before, #nav-toggle.active span:after { top: 0 }
#nav-toggle.active span:before { transform: rotate(45deg) }
#nav-toggle.active span:after { transform: rotate(-45deg) }
nav { transition: all 200ms ease-out; position: fixed; top: 0 }
nav a { margin-bottom: 0.5em; transition: all 150ms ease-in-out }
```

### [Sticky/Persistent Headers](https://codepen.io/amayem/pen/zxQLgr)

on scroll: div.section-header: background+top ×3 | made with: position: fixed · scroll() timeline · transition

```css
.section { position: relative }
.section-header { transition: all 0.4s ease }
.sticky-active { position: fixed; top: 0 }
.sticky-parked { position: absolute; bottom: 0px }
```

### [Shrinking Sticky Header](https://codepen.io/halfapx/pen/NPVXdZ)

made with: position: fixed · scroll() timeline · transition · :hover

```css
.header { background-position: center; position: fixed; top: 0 }
.header nav { position: relative }
.header nav a { transition: 0.3s all ease }
.header nav a:hover { opacity: 0.7 }
.header .bg { top: 0; position: absolute }
body p { margin-bottom: 10px }
.wrapper p { padding-bottom: 5px }
```

### [Peek-a-boo sticky header](https://codepen.io/gjcarrow/pen/gbZQeJ)

held: fixed header.peek | made with: position: fixed · transition

```css
body { margin-top:160px }
header { position: fixed; top: -140px; transition:top .5s linear; border-bottom:1px solid transparent; box-shadow:0px 24px 12px rgba(0,0,0,.5); padding-top:20px }
header.peek { top:0 }
```

### [Sticky Header with Color Change](https://codepen.io/milesdfonda/pen/WbLzEv)

held: fixed header | made with: position: fixed · scroll() timeline · transition

```css
#mainNav { position: fixed; top:0 }
#theTop { padding-top: 100px }
#subNav { position: relative; top:0; transition: background-color 200ms }
#subNav.sticky { position:fixed; top:100px }
```

### [CSS offset for internal links (sticky header)](https://codepen.io/rileyjshaw/pen/OPBBGK)

held: fixed ul.sticky | made with: position: fixed

```css
.content li { border-top: 60px solid transparent }
body { padding-top: 84px; padding-bottom: 1px }
.sticky { position: fixed; top: 0 }
```

### [Fixed header jquery](https://codepen.io/deyand/pen/xbYNaw)

made with: position: fixed · scroll() timeline

```css
.header-banner { background-position: center -300px }
header .logo { background-position: center top; position: absolute; top: 72px }
header h1 { position: absolute; top: 72px }
.fixed-nav { position: fixed; top:0 }
.content { padding-top: 60px }
article p:first-of-type { margin-top: 0 }
```

### [Fixed header](https://codepen.io/deyand/pen/ByYeWw)

held: fixed div.cloned | made with: nothing recognised — read the code

### [Fade in Sticky Navigation using animate.css](https://codepen.io/patricklittle/pen/bNLyEo)

held: fixed div.header, fixed div.header-sticky | on scroll: div.header: transform+opacity, div.header-sticky: transform+opacity | on hover of li.: div.header: transform+opacity, div.header-sticky: transform+opacity+top | made with: position: fixed · scroll() timeline

```css
.header { position: fixed; top: 0 }
.header-sticky { position: fixed; opacity: 0 }
```

### [Sticky header with offcanvas menu](https://codepen.io/CrocoDillon/pen/QwQLmz)

on scroll: header.header: transform+top | made with: transition · scroll listener

```css
.container.inner { position: relative; transition: transform 0.4s cubic-bezier(0.75, 0.1, 0.5, 1) }
.container.inner:before { position: absolute; top: 0; bottom: 0 }
.container[data-offcanvas=left] { transform: translateX(80%) }
.container[data-offcanvas=left] { transform: translateX(24em) }
```

```js
addEventListener('scroll', updatePosition)
```

### [A Nice Sticky Header css/jQuery](https://codepen.io/HanieelR/pen/QwgvRg)

made with: position: fixed · scroll() timeline · transition

```css
header.sticky { position: fixed; top:0; opacity:.70; transition: height 0.5s ease; border-bottom: 5px solid #000; box-shadow: 0px -1px 27px #000 }
```

### [Sticky Element](https://codepen.io/gssi-fe/pen/azdYZR)

on scroll: nav.: transform+top | made with: position: fixed · scroll() timeline · @keyframes · transition · :hover

```css
.section-inner { position: relative }
#header a { text-transform: uppercase; -webkit-transition: all 0.3s ease-out; transition: all 0.3s ease-out }
#mainnav { -webkit-transition: all 0.3s ease; transition: all 0.3s ease }
.sticky-in #mainnav { position: fixed; top: 0; -webkit-animation-name: fadeInDown; animation-name: fadeInDown; -webkit-animation-duration: 0.3s; animation-duration: 0.3s; -webkit-animation-fill-mode: both; animation-fill-mode: both }
0% { opacity: 0; -webkit-transform: translate3d(0, -100%, 0); transform: translate3d(0, -100%, 0) }
100% { opacity: 1; -webkit-transform: none; transform: none }
0% { opacity: 0; -webkit-transform: translate3d(0, -100%, 0); transform: translate3d(0, -100%, 0) }
100% { opacity: 1; -webkit-transform: none; transform: none }
@keyframes fadeInDown animates opacity, -webkit-transform, transform
```

### [WIP: Sticky header experiment, v1](https://codepen.io/timsamoff/pen/jEbLWJ)

held: fixed header | on scroll: header.: opacity | on hover of a.: header.: opacity | made with: position: fixed · scroll() timeline · transition · Web Animations API (.animate)

```css
header { position:fixed; top:0; opacity: 1.0; -webkit-transition: all 0.3s; -moz-transition: all 0.3s; -ms-transition: all 0.3s; -o-transition: all 0.3s; transition: all 0.3s }
h1 a { margin-top:0; opacity: 1.0; -webkit-transition: all 0.3s; -moz-transition: all 0.3s; -ms-transition: all 0.3s; -o-transition: all 0.3s; transition: all 0.3s }
```

```js
.animate({
```

### [Sticky Two-Part Header w/ CSS Slide Animation](https://codepen.io/jonwinton/pen/raNKQg)

on scroll: div.header-wrapper: transform+top | made with: position: fixed · transition

```css
.header { margin-bottom: 10px }
.header-wrapper { margin-bottom: 10px }
.header-wrapper-top { border-bottom: 2px solid rgba(155, 89, 182, 0.25) }
.header-wrapper-bottom { border-bottom: 3px solid rgba(155, 89, 182, 0.75) }
.anim { -moz-transition: -moz-transform 1000ms ease; -o-transition: -o-transform 1000ms ease; -webkit-transition: -webkit-transform 1000ms ease; transition: transform 1000ms ease }
.isFixed { position: fixed; top: 0 }
.userContent p + p { margin-top: 10px }
```

### [Sticky Header CSS Transition](https://codepen.io/soulrider911/pen/MWdxJo)

held: fixed header | on scroll: header.: background, h1.: transform+top | on hover of a.: a.: shadow | made with: position: fixed · scroll() timeline · transition · :hover

```css
body { padding-top: 330px; -moz-transition: padding-top 0.5s ease; -o-transition: padding-top 0.5s ease; -webkit-transition: padding-top 0.5s ease; transition: padding-top 0.5s ease }
header { position: relative; position: fixed; top: 0; -moz-transition: all 0.5s ease; -o-transition: all 0.5s ease; -webkit-transition: all 0.5s ease; transition: all 0.5s ease }
header h1 { text-transform: uppercase; -moz-transition: all 0.3s ease; -o-transition: all 0.3s ease; -webkit-transition: all 0.3s ease; transition: all 0.3s ease }
header nav { position: absolute; bottom: 0 }
header nav a:hover { -moz-box-shadow: 0 0 0 1px #fff; -webkit-box-shadow: 0 0 0 1px #fff; box-shadow: 0 0 0 1px #fff }
h2 { text-transform: uppercase }
p { margin-bottom: 2rem }
section { margin-bottom: 40px; -moz-box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2); -webkit-box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2); box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2) }
body.sticky-header { padding-top: 100px }
body.sticky-header header h1 { -moz-transform: scale(0, 0); -ms-transform: scale(0, 0); -webkit-transform: scale(0, 0); transform: scale(0, 0) }
```

### [Simple Sticky header](https://codepen.io/amyth91/pen/QWoWBB)

on scroll: h1.: opacity+top | made with: position: fixed · scroll() timeline · transition · :hover

```css
.ease { transition: all 0.3s ease-in-out }
.sticky { position: fixed; top: 0 }
header > h1 { opacity: 0; transition: all 0.3s ease-in-out }
header.sticky h1 { opacity: 1 }
header nav ul li a { transition: all 0.3s ease-in-out }
```

### [Sticky Header](https://codepen.io/AndreasFrontDev/pen/jOdQRd)

made with: position: fixed · scroll() timeline

```css
.sticky-header { position:fixed; -moz-box-shadow: 0px 0px 3px 0px #444; -webkit-box-shadow: 0px 0px 3px 0px #444; box-shadow: 0px 0px 3px 0px #444 }
```

### [Sticky header with CSS animation and jQuery](https://codepen.io/daveontrak/pen/LYgbbp)

made with: position: fixed · scroll() timeline · transition

```css
header { // set animation -webkit-transition: all 0.4s ease; transition: all 0.4s ease }
header.sticky { position: fixed }
```

### [Magic Header](https://codepen.io/chandresh/pen/jOvvZa)

held: fixed div | made with: position: fixed · transition · scroll listener

```css
#pagetop { position: fixed; top: 0px; padding-top: 50px; transition: height 0.3s linear 0s, padding 0.3s linear 0s }
#pagetop > #menu { position: absolute; bottom: 0px; transition: height 0.3s linear 0s }
#wrapper { margin-top: 230px }
```

```js
addEventListener("scroll", yScroll)
```

### [Sticky Header Example](https://codepen.io/Martyr2/pen/mdwqzb)

made with: scroll() timeline

### [StickyHeader](https://codepen.io/theallenquinto/pen/LYbrxg)

held: fixed header | made with: position: fixed · scroll() timeline · :hover

```css
header { position: fixed; top: 0; border-bottom: 3px solid #63a5c4 }
nav ul li a { padding-top: 20px; border-top: 3px #fff solid }
header.sticky nav ul li a { padding-top: 0; border-top: none; margin-top: 15px }
#main { margin-top: 120px }
#main h2 { margin-bottom: 30px }
#main p { margin-bottom: 10px }
footer p { margin-top: 40px; margin-bottom: 50px }
```

### [Fixed Nav on Scroll](https://codepen.io/atelierbram/pen/xxxjrO)

held: fixed header.banner, fixed footer.footer | on scroll: a.: color+top ×4, header.banner: background+top | made with: position: fixed · @keyframes · transition · :hover · Web Animations API (.animate)

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

### [Header](https://codepen.io/Behzad_ne_77/pen/wvzEGJr)

held: fixed header, fixed div.search-bar | made with: position: fixed · @keyframes · transition · :hover

```css
header { position: fixed; top: 0 }
.header-tag { margin-bottom: 20px; transition: 2s ease; margin-top: 35px }
.header-tag >i { margin-bottom: 10px }
.header-tag>ul { position: absolute; transition: opacity 2s }
.header-tag >ul >li { margin-top: 3px; transition: all 2s ease }
.header-tag >ul >li:first-child { margin-top: 25px }
.header-tag >ul >li:hover { box-shadow: 1px 1px 7px black }
.header-tag >ul >li >a { transition: all 2s ease }
.header-tag:hover > ul { animation: fade-in 3s }
0% { opacity: 0 }
100% { opacity: 1 }
.search-bar { transition: 2s ease; position: fixed; top: 25px; margin-top: 40px }
```

### [Sticky header with background on scroll](https://codepen.io/nico_sh/pen/VwvJNXM)

held: sticky div, sticky h1 | on scroll: div.: background | made with: position: sticky · transition · scroll listener

```css
#wrap { box-shadow: 0 0 5px #999; position: relative }
h1 { position: sticky; margin-top: 0; top: 0.5rem; padding-top: 0.4rem; transition: font 0.1s ease-out }
h1.sticky { transition: font 0.3s ease-in }
#topbar { position: sticky; top: 0; transition: background 0.3s ease-in-out }
#logo { position: absolute; top: 0 }
#close { position: absolute; top: 10px }
ul { margin-top: 1rem }
#content { margin-top: 3rem; margin-bottom: 2.4rem }
nav #prev:before, nav #next:after { border-top: 4px solid white }
nav #prev:before { transform: rotate(-135deg) }
nav #next:after { transform: rotate(45deg) }
```

```js
addEventListener('scroll', function() {
```

### [Complex scrolling table](https://codepen.io/AaronRose/pen/VwZdZE)

made with: nothing recognised — read the code

### [Sticky Secondary Header/CTA](https://codepen.io/colinlord/pen/npZGpL)

made with: position: fixed · scroll() timeline

```css
.hero { background-position: 50% 0; border-bottom: 1px solid white }
.hero h1 { padding-top: 10px }
.hero h2 { padding-top: 5px }
.content { position: relative }
#cta { top: 0px; position: absolute }
#cta.fixed { position: fixed }
```

### [Multiple sticky headers (in progress)](https://codepen.io/renby/pen/AwmyOO)

held: fixed li.listHeader | made with: position: fixed · scroll() timeline

```css
.listHeader.sticky { position:fixed; top:0 }
```

### [Header Stick to top on scroll](https://codepen.io/abhaysharma/pen/Aayjwz)

made with: position: fixed · scroll() timeline

```css
ul li { vertical-align: top }
.fixed-nav { position: fixed; top: 0 }
```

### [Sticky Header Visual Trick](https://codepen.io/mintyfloss/pen/kXaEob)

held: fixed div | on hover of li.: a.: color, span.icon-stack: color, i.icon-circle: color, span.text: color | made with: position: sticky · position: fixed · transition · :hover

```css
#main { position: relative }
ul.nav li a:hover { transition: color 400ms ease-out }
#stickyContent { position: fixed; top: 0 }
```

### [jQuery and CSS Sticky Header](https://codepen.io/chrissp26/pen/AqEJoZ)

made with: position: fixed

```css
.fixed { position: fixed; top: 0 }
```

### [Multiple Sticky Titles with CSS and JS](https://codepen.io/chrissp26/pen/AwBYPm)

made with: position: fixed

```css
.followMeBar { position: relative }
.followMeBar.fixed { position: fixed; top: 0 }
.followMeBar.fixed.absolute { position: absolute }
```

### [Table with Sticky Header in pure Css](https://codepen.io/Kseso/pen/DdywQo)

held: sticky thead | on hover of a.: a.: background+color | made with: position: sticky · :hover

```css
.data thead { position: -webkit-sticky; position: sticky; top: -5px }
.data thead th { box-shadow: 0 0 15px 2px rgba(0, 0, 0, .5) }
```
