# CodePen · fixed-header — how each pen does it

97 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/fixed-header.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| position: fixed | 54 |
| transition | 37 |
| :hover | 31 |
| scroll() timeline | 21 |
| scroll listener | 9 |
| position: sticky | 6 |
| Web Animations API (.animate) | 4 |
| requestAnimationFrame | 3 |
| @keyframes | 2 |
| backdrop-filter | 1 |
| pointer / mouse tracking | 1 |

## Every pen

### [Bootstrap Responsive Fixed header with logo](https://codepen.io/editor/programmingwithbasics/pen/0164a485-2e88-724c-a295-e726ad25975a)

made with: nothing recognised — read the code

### [The Glitch Frontier Hero Section](https://codepen.io/Kuldeep-Rajput-the-sasster/pen/wBKdBWv)

made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · pointer / mouse tracking

```css
0% { transform: scale(0.8); opacity: 0; filter: hue-rotate(180deg) }
50% { transform: scale(1.1); opacity: 0.5; filter: hue-rotate(0deg) }
100% { transform: scale(1); opacity: 1; filter: hue-rotate(0deg) }
0% { transform: translateY(20px); opacity: 0 }
100% { transform: translateY(0); opacity: 1 }
0% { box-shadow: 0 0 5px var(--primary-color), 0 0 10px rgba(57, 255, 20, 0.5) }
50% { box-shadow: 0 0 10px var(--primary-color), 0 0 20px rgba(57, 255, 20, 0.8) }
100% { box-shadow: 0 0 5px var(--primary-color), 0 0 10px rgba(57, 255, 20, 0.5) }
body { padding-top: var(--header-height) }
.header { position: fixed; top: 0; backdrop-filter: blur(5px) }
.menu-toggle { position: relative }
.hamburger, .hamburger::before, .hamburger::after { position: absolute; transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55) }
```

```js
addEventListener('mousemove', (e) => {
addEventListener('mouseleave', () => {
```

### [show/hide header with scolldown/up](https://codepen.io/alipalvane/pen/yLxMqpW)

held: fixed header | made with: position: fixed · transition

```css
#navbar { position: fixed; top: 0; transition: top 0.3s }
```

### [Dynamic scroll view in the middle with fixed header and footer on top and bottom](https://codepen.io/fathy_ar/pen/YzarYzj)

made with: nothing recognised — read the code

```css
.content-outer-wrapper { position: absolute; top: 2px; bottom: 2px }
.content-wrapper { position: relative }
.hidden-selectable { opacity: 0 }
```

### [html table fixed-header(css position:sticky)](https://codepen.io/cfd-ack/pen/mdxRQKe)

held: sticky thead, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky td, sticky td, sticky td | made with: position: sticky

```css
.tableBase { position: relative }
.scrollBox { position: relative }
.tbl thead { position: sticky; top: 0 }
.tbl th, .tbl td { position: relative; border-top: 1px solid var(--cell-bg, white); border-bottom: 1px solid var(--border-color, silver) }
.tbl th:nth-child(1), .tbl td:nth-child(1) { position: sticky }
.tbl th:nth-child(2), .tbl td:nth-child(2) { position: sticky }
.tbl th:nth-child(3), .tbl td:nth-child(3) { position: sticky }
```

### [Bootstrap Sticky Header](https://codepen.io/marufalbashir/pen/pobbLyN)

held: sticky header | made with: position: sticky

```css
header { position: sticky; top: 0 }
section { padding-top: 100px }
```

### [Basic Page Layout](https://codepen.io/richwertz/pen/PoqMMRN)

held: fixed header, fixed nav | made with: position: fixed · :hover

```css
header { position: fixed }
nav { position: fixed }
nav ul li:last-child { border-bottom: none }
.anchor { padding-top: 100px }
h2 { padding-bottom: 0.2em }
```

### [fixed header](https://codepen.io/sden4tech/pen/rNVdJgJ)

held: sticky header.header | on scroll: header.header: opacity+background | on hover of a.header__link: a.header__link: color | made with: position: sticky · transition · :hover · scroll listener

```css
.wrapper { position: relative }
.header { position: sticky; top: 0; transition: 0.5s }
.header .header__link { transition: 0.5s }
.header_scroll { opacity: 0.2 }
```

```js
addEventListener("scroll", function() {
```

### [Sticky Table Header using Flexbox](https://codepen.io/JefMari/pen/oNNWLQx)

made with: nothing recognised — read the code

### [Transition header colour between dark and light backgrounds](https://codepen.io/jasonadam/pen/pozRwqL)

held: fixed div.header, fixed div.header | made with: position: fixed

```css
.header { position: fixed; top: 0 }
.clipped-area { position: absolute; top: 0; bottom: 0 }
.text-area { position: relative }
```

### [Fixed header](https://codepen.io/arman_bag/pen/ZdXRqz)

held: fixed header.cf | made with: position: fixed · transition

```css
header { position: fixed; box-shadow: 0 4px 4px rgba(0,0,0,0.1) }
.small .logo { margin-top: 5px }
.logo { margin-top: 25px }
header, .logo { -webkit-transition: all 1s; transition: all 1s }
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

### [Scroll back fixed header](https://codepen.io/johndownie/pen/ywZbpP)

held: fixed header | made with: position: fixed · scroll() timeline · transition

```css
header { position: fixed; top: 0; transition: top 0.5s ease-in-out; box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05) }
.hide-nav { top: -70px }
```

### [Transparent & Fixed Header - CSS only](https://codepen.io/glebkema/pen/RdWJzB)

held: fixed header.header | made with: position: fixed

```css
.header { position: fixed; top: 0 }
```

### [Sticky table header with scroll (h & v) - css only](https://codepen.io/bcarpenter/pen/exaxKo)

held: sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th, sticky th | made with: position: sticky

```css
th { position: sticky; top: 0 }
td { border-bottom: 1px solid #ddd }
::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.9) }
::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.9) }
```

### [Hide header on scroll down](https://codepen.io/onur_kaplan/pen/omzZQZ)

held: fixed header.header | made with: position: fixed · scroll() timeline · transition

```css
header { position: fixed; top: 0; transition: top 0.2s ease-in-out }
```

### [Add class on scrolling for header](https://codepen.io/nikstech/pen/dwmbYx)

on scroll: div.main_header: background+shadow | made with: position: fixed · scroll() timeline · transition

```css
.main_header.header_bg { position: fixed; top:0; transition:all 0.9s ease-in-out; box-shadow:0px 0px 5px 1px #555 }
```

### [Fixed Header Monospace](https://codepen.io/luisfrancisco02/pen/ebpWNz)

on hover of a.header__tools-links: a.header__tools-links: color | made with: position: fixed · transition · :hover · scroll listener

```css
.link-button { text-transform: uppercase }
.header__wrap { position: absolute; top: 0 }
.header--main-nav { position: static; transition: 250ms }
.header--main-nav.fixed { position: fixed; top: 0 }
.hero__wrap h2, .hero__wrap p { margin-top: 0 }
```

```js
addEventListener('scroll', stickyHeader)
```

### [A fixed web header || Flexbox](https://codepen.io/coderduckies/pen/EOqpQW)

held: fixed header | made with: position: fixed

```css
header { position:fixed }
```

### [CSS Flexbox Sticky Header](https://codepen.io/cpettydesigns/pen/pxVeoE)

held: fixed nav | made with: position: fixed · transition · :hover

```css
html body nav { padding-top: 5px; position: fixed }
html body nav a { transition: all 1s ease }
html body section { border-top: 1px dotted white }
```

### [Fun with CSS3 grids](https://codepen.io/klattman/pen/NLmzjx)

held: sticky div.header, sticky div.header, sticky div.header, sticky div.header, sticky div.header, sticky div.header, sticky div.header, sticky div.header, sticky div.header, sticky div.header | made with: position: sticky

```css
main > .data > *.fixedToTop { position: sticky; top: 0 }
main > .data > *.fixedToLeft { position: sticky }
main > .data > *.fixedToBoth { position: sticky; top: 0 }
```

### [Fixed Header in CSS Grid Exploration](https://codepen.io/frogmcw/pen/YOEWvJ)

held: fixed div.header-fixed | made with: position: fixed

```css
.header-fixed { position: fixed; top: 0; border-bottom: 1px solid var(--global-gray) }
.content__copy + .content__copy { margin-top: 20px }
.footer { border-top: 1px solid var(--global-gray) }
```

### [Scrolling fixed header jQuery](https://codepen.io/LiamKarlMitchell/pen/VGmjzW)

held: sticky div | made with: position: sticky · scroll() timeline · transition

```css
#block-header { position: sticky; top: 0; border-bottom: 1px solid black }
:target { padding-top: 80px }
.navbar-scrolled { transition: background-color 0.25s linear }
body { filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#b7deed', endColorstr='#ffffff',GradientType=0 ) }
```

### [Table with Fixed Header. ADA Compliant.](https://codepen.io/luisleguisamo/pen/GBbKRr)

made with: nothing recognised — read the code

```css
.table__fixed-header tr { border-bottom: 1px dotted #ededed }
```

### [Mobile-First Fixed Flexbox Navigation](https://codepen.io/melvinlim/pen/mjLeYJ)

held: fixed header | on hover of li.: a.smooth-scroll: color | made with: position: fixed · scroll() timeline · transition · :hover · Web Animations API (.animate)

```css
header { position: fixed; top: 0 }
#logo { margin-top: 20px; text-transform: uppercase }
header { -webkit-transition: all 0.5s ease-out; transition: all 0.5s ease-out }
#logo { margin-top: 2px }
```

```js
.animate({
```

### [Kendo UI Table](https://codepen.io/asif7774/pen/RJxJrg)

on hover of a.k-link: tr.: background | made with: nothing recognised — read the code

```css
.customer-photo { background-position: center center; box-shadow: inset 0 0 1px #999, inset 0 0 10px rgba(0,0,0,.2) }
```

### [DataTable + Angular JS + Fixed Headers](https://codepen.io/mankalp/pen/XYKJeL)

made with: nothing recognised — read the code

### [scroll2fix](https://codepen.io/hakankoesekadam/pen/yKMLKg)

made with: position: fixed · transition · :hover

```css
nav.sticky { -webkit-box-shadow: 0px 5px 10px 0px lightblue; -moz-box-shadow: 0px 5px 10px 0px lightblue; box-shadow: 0px 5px 10px 0px lightblue; position: fixed; top: 0 }
p { padding-bottom: 16px }
a { border-bottom: 2px solid lightblue; padding-bottom: 2px; transition: all .5s }
a:hover { border-bottom: 2px solid #fff }
```

### [Table responsive with fixed header v1](https://codepen.io/normancarcamo/pen/MQBdZo)

made with: nothing recognised — read the code

```css
.containerTable { position: relative }
```

### [Fixed table header and footer - Firefox only](https://codepen.io/Lasheimok/pen/jZqRvp)

made with: nothing recognised — read the code

```css
th, td { padding-top: 2px; padding-bottom: 3px }
.mirror-header { border-bottom: 1px solid #999 }
.mirror-footer { border-top: 1px solid #999 }
.hide_footer { position: relative; top: -20px }
.mirrored { margin-top: -20px; margin-bottom: -20px }
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

### [Glossary With A Fixed Header](https://codepen.io/SteveClason/pen/bYvaew)

held: fixed header | made with: position: fixed

```css
header { position: fixed }
dl { position: relative }
dt::before { margin-top: -120px }
```

### [Scroll Down](https://codepen.io/shishak/pen/qVNpoa)

made with: position: fixed · :hover

```css
.sticky { position: fixed; top: 0 }
.sticky + .content { padding-top: 60px }
```

### [CSS-Only Fixed Header Table](https://codepen.io/she_codes/pen/mBZeEy)

held: fixed aside, fixed nav, fixed table.header-table | made with: position: fixed

```css
aside { position: fixed; top: 0; transform: translate3d(0, 0, 0) }
aside .brand { position: absolute; top: 25px; transform: translateX(-50%) }
aside .brand .fa-beer { position: absolute; top: 50%; transform: translateY(-50%) }
aside h1 { padding-top: 205px }
aside h2 { padding-bottom: 40px }
aside li { margin-bottom: 30px }
nav { position: fixed }
.main { padding-top: 50px }
.header-table { position: fixed }
.header-table th { text-transform: uppercase }
```

### [Responsive Pseudo Table](https://codepen.io/johnfinkdesign/pen/Qqrzme)

on scroll: div.pseudo-cell: background+top ×7, i.fa: opacity+color+top ×4, div.pseudo-row: shadow+top | made with: position: fixed · transition · :hover

```css
[data-spy=affix].affix { position: fixed; top: 0 }
[data-spy=affix].affix .pseudo-row { box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) }
.pseudo-row { border-bottom: 1px solid #ddd; position: relative; transition: all 0.15s ease-in-out }
.pseudo-row:hover .pseudo-cell.icon-only i { opacity: 1 }
.pseudo-row .pseudo-cell { transition: all 0.15s ease-in-out }
.pseudo-row .pseudo-cell.icon-only i { opacity: 0.2; transition: all 0.15s ease-in-out }
.pseudo-row .pseudo-cell { position: relative }
.pseudo-row .pseudo-cell.first-data-cell { padding-top: 10px }
.pseudo-row .pseudo-cell.icon-only { position: absolute; top: 0 }
.pseudo-row .pseudo-cell.icon-only:first-of-type { position: absolute; bottom: 0 }
.pseudo-row .pseudo-cell.icon-only:nth-last-of-type(2) { margin-top: 40px }
.pseudo-row .pseudo-cell.icon-only:nth-last-of-type(3) { margin-top: 80px }
```

### [Scrollable Table with Fixed Header](https://codepen.io/bmarshall/pen/KXQymY)

on scroll: thead.: transform | made with: scroll listener

```css
.content { padding-top: 30px }
```

```js
addEventListener("scroll", function() {
```

### [Sticky header](https://codepen.io/gokvikash/pen/rzjyjg)

held: fixed header.top-header | made with: position: fixed · transition · scroll listener

```css
#wrap { position: relative }
.top-header { position: fixed; top: 0 }
.menu-icon { position: absolute }
.search { position: absolute; top: 200px }
.search input { position: absolute; transition: width 0.2s }
.fix-search .search { position: fixed; top: 2px }
```

```js
addEventListener("scroll",function(e){
```

### [CSS-Only responsive table with fixed header and footer and scrollable body made with Flexbox](https://codepen.io/izambl/pen/pPZrQG)

on scroll: tr.: background | made with: :hover

```css
main { position: absolute; top: 0; bottom: 0 }
table thead, table tbody, table tfoot { position: relative }
```

### [Sticky Navbar with Flexbox](https://codepen.io/jrothra/pen/jmMbWX)

held: fixed div | made with: position: fixed

```css
#navbar { position: fixed }
h1 { margin-top: 0 }
```

### [Fixed Header w/ animation](https://codepen.io/manabox/pen/WpRmvN)

held: fixed header | made with: position: fixed · scroll() timeline · @keyframes · transition

```css
header { position: fixed; top: 0; transition: all 0.3s ease }
.fixed { animation: move-from-top 1s ease forwards }
p { margin-bottom: 20px }
0% { opacity: 0 }
100% { opacity: .9 }
@keyframes move-from-top animates opacity
```

### [Flexbox - Fixed Header Sticky Footer](https://codepen.io/45leopard/pen/qrOdbe)

made with: nothing recognised — read the code

### [Fixed header and HTML anchor](https://codepen.io/subin/pen/dvyqBp)

held: fixed div.header | made with: position: fixed · Web Animations API (.animate)

```css
.header { position: fixed; top: 0 }
.content { padding-top: 120px }
.goto { margin-top: -95px }
```

```js
.animate({
```

### [Scroll-to sections with fixed header](https://codepen.io/sheriffderek/pen/xqKKoj)

made with: position: fixed · scroll() timeline · Web Animations API (.animate)

```css
body.fixed-header .site-header { position: fixed; top: 0 }
```

```js
.animate({
```

### [Flexbox Fixed Header / Sidebar & Footer](https://codepen.io/jquere/pen/egPymQ)

made with: position: fixed · :hover

```css
nav a { text-transform: uppercase }
header nav { position: fixed }
aside { position: fixed }
section p { margin-bottom: 32px }
footer { position: fixed; bottom: 0 }
```

### [Layout with Fixed Header](https://codepen.io/cliffpyles/pen/oBExWx)

on scroll: div.layout: background, div.layout-main: background, div.layout-subsection: background | made with: transition · :hover

```css
.layout, *[class^=layout-] { transition: all 0.4s ease-in-out }
.layout:hover, *[class^=layout-]:hover { transition: all 0.3s ease-in-out }
.layout-main > .layout-subsection + .layout-subsection { margin-top: 1.25rem }
```

### [Many Head(er)ed Monster](https://codepen.io/carlfeberhard/pen/QdpRgv)

held: fixed h1 | made with: scroll listener · requestAnimationFrame

```css
section { padding-top: 44px }
section h1 { position: absolute; top: 0 }
section { position: relative }
section h1 { border-top: 2px solid black; border-bottom: 1px solid rgba(192, 192, 192, 0.6) }
```

```js
requestAnimationFrame(() => {
addEventListener( 'scroll',
```

### [tablemodify.js](https://codepen.io/dhansmair/pen/ZLpzKg)

made with: nothing recognised — read the code

### [Table with fixed header, no pseudo-classes, no dirty elements](https://codepen.io/timhecker/pen/JbGvxq)

made with: nothing recognised — read the code

```css
.table-fixed-header { position: relative; padding-top: 55px; padding-bottom: 0.5rem; box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px }
.table-fixed-header .table__head { position: absolute; top: 0 }
.table__head .table__cell { box-shadow: inset 0 -1px 0 0 #333 }
.table__body { position: relative }
```

### [Flexbox Fixed Header + Sticky Footer](https://codepen.io/mcraiganthony/pen/RGyyBP)

made with: nothing recognised — read the code

### [Fixed Header, Sortable Table](https://codepen.io/brianmaw/pen/RGRZdy)

made with: :hover

### [jQuery Scrolling Single Page Website Template](https://codepen.io/rachel_web/pen/ORXXKO)

held: fixed header.fixed-header | made with: position: fixed · scroll() timeline · :hover · Web Animations API (.animate)

```css
body .fixed-header { position: fixed; top: 0; border-bottom: 1px solid #CCCCCC; box-shadow: 0px 0px 10px 0 rgba(0, 0, 0, 0.5); opacity: 0.9 }
```

```js
.animate({
```

### [Horizontal scrolling table. Fixed left header.](https://codepen.io/solipsistacp/pen/BLajmW)

made with: nothing recognised — read the code

```css
input { box-shadow: inset 0 0 1em 1em dimgrey }
```

### [Fixed table header](https://codepen.io/genome2/pen/QNXJOw)

made with: :hover

```css
h1 { text-transform: uppercase; margin-bottom: 15px }
.tbl-content { margin-top: 0px }
th { text-transform: uppercase }
td { border-bottom: solid 1px rgba(255,255,255,0.1) }
.made-with-love { margin-top: 40px }
.made-with-love i { position: relative; top: 2px }
::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3) }
::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3) }
```

### [Fixed header table](https://codepen.io/jihgao666/pen/BKgzVB)

made with: nothing recognised — read the code

```css
.matrixTable__wrapper { position: absolute; top: 50vh; transform: translate(0, -50%) }
.matrixTable .matrixTable__header, .matrixTable .matrixTable__footer { padding-top: 10px; border-bottom: 1px solid #5E2F46 }
.matrixTable .matrixTable__body.matrixTable__body--headerFixed .matrixTable__bod { position: relative }
.matrixTable .matrixTable__body--bottom .matrixTable__cell { border-bottom: 1px solid #5E2F46 }
.matrixTable .matrixTable__body--top { border-bottom: 1px solid #5E2F46 }
.matrixTable .matrixTable__table { position: relative }
.matrixTable .matrixTable__table tr:last-child .matrixTable__cell { border-bottom: none }
.matrixTable .matrixTable__footer { border-bottom: none; border-top: 1px solid #5E2F46 }
```

### [stickEmUp sticky header jquery plugin](https://codepen.io/devinargenta/pen/reGNLa)

on scroll: header.: transform+top | made with: position: fixed · :hover · requestAnimationFrame

```css
.stickEm-fixed header { position: fixed; top: 0 }
.lol { box-shadow: inset 0 -3px 3px #ddd }
header { box-shadow: 0 3px 3px #ddd; top: 0 }
nav ul a { text-transform: uppercase }
main { text-transform: uppercase }
```

```js
requestAnimationFrame(
```

### [Material Design Fixed & Responsive Header with Sidebar](https://codepen.io/rkchauhan/pen/VamPVa)

held: fixed nav.sidebar, fixed header, fixed div.overlay | made with: position: fixed · transition · :hover

```css
.overlay { position: fixed; top: 0px }
header { position: fixed; top: 0px }
header .header-inner { box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.3) }
header .header-categories { position: relative }
header .header-search { position: relative }
header .header-search .search { position: relative }
header .header-search .search i { position: absolute; top: 8px }
header .header-menu ul li { position: relative }
header .header-menu ul li a:hover { opacity: 0.6 }
nav { position: fixed; top: 0px; transition: all 0.3s ease; opacity: 0.9 }
nav .nav-header .nav-search { position: relative }
nav .nav-header .nav-search .search { position: relative }
```

### [Mk TableFloat](https://codepen.io/MarkitDigital/pen/eJQoWX)

made with: nothing recognised — read the code

### [Video Bg with Fixed Header](https://codepen.io/jpixelwebdesign/pen/NxBqoa)

made with: nothing recognised — read the code

```css
.jumbotron h1 { position: absolute; top: 10px }
.jumbotron h3 { position: absolute; top: 0; text-transform: uppercase }
#black { background-position: center center; opacity: 0.7 }
footer { position: absolute; bottom: 0 }
```

### [HTML position: fixed page header and in-page anchors](https://codepen.io/swed/pen/RrZBJo)

made with: nothing recognised — read the code

### [Fixed header](https://codepen.io/thanhrossi/pen/MKbbax)

made with: position: fixed · scroll() timeline · transition · :hover

```css
.top-nav { position: relative; top: 0; transition: top 0.3s ease-in-out }
.fixed .top-nav { position: fixed; top: 0 }
.top-nav li a { transition: all 0.3s ease-in-out }
```

### [Datatable](https://codepen.io/getchsch/pen/qbZVPG)

made with: nothing recognised — read the code

### [Fixed header](https://codepen.io/vulchivijay/pen/gPrOyR)

held: fixed header.headerNav, fixed footer | made with: position: fixed · scroll() timeline · transition

```css
header { position: fixed; top: 0; transition: height 300ms }
.logo { transition: all 0.3s }
nav { position: relative }
.content { margin-top: 200px }
footer { position: fixed; bottom: 0 }
```

### [Fixed header](https://codepen.io/TincanPipPip/pen/GpPxoy)

held: fixed header | made with: position: fixed · transition

```css
body { padding-top: 80px }
#header { position: fixed; top: 0; box-shadow: 0 0 3px #ccc; transition: all 0.2s ease-in-out }
```

### [Fixed Header Dynamic Table](https://codepen.io/gha/pen/EVQJGo)

held: fixed div.fixed-table-clone | made with: position: fixed

```css
.fixed-table-clone { top: 0; position: fixed }
```

### [StickyStackyScrollr](https://codepen.io/SamPedley/pen/jbWGyJ)

made with: :hover · scroll listener

```js
addEventListener('scroll', this.onScroll.bind(this))
```

### [Table with fixed header](https://codepen.io/monochromer/pen/Yyydwy)

on scroll: th.table__cell: transform ×5, td.table__cell: background+top ×4, div.ps-scrollbar-x-rail: opacity, div.ps-scrollbar-y-rail: opacity | made with: transition · :hover · scroll listener

```css
.table-wrap { position: absolute; top: 50px; bottom: 50px }
.table__head { position: relative }
.table__cell { position: relative; border-bottom: 1px solid #ccc; vertical-align: top; transition: background .12s linear }
.table__cell_head { transition: 0s; box-shadow: 0 4px 6px -1px rgba(77, 77, 77, 0.3) }
```

```js
addEventListener('scroll', function() {
```

### [Table fixed header](https://codepen.io/cnascimentobr/pen/vNEyOV)

held: fixed table | made with: position: fixed

```css
#header-fixed { position: fixed; top: 0px }
```

### [Fixed table header](https://codepen.io/nikhil8krishnan/pen/WvYPvv)

made with: :hover

```css
h1 { text-transform: uppercase; margin-bottom: 15px }
.tbl-content { margin-top: 0px }
th { text-transform: uppercase }
td { border-bottom: solid 1px rgba(255,255,255,0.1) }
.made-with-love { margin-top: 40px }
.made-with-love i { position: relative; top: 2px }
::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3) }
::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3) }
```

### [Table with fixed col and row headers (prototype)](https://codepen.io/rniswonger/pen/WvaaWX)

held: fixed thead, fixed th.blank, fixed th, fixed th, fixed th, fixed th, fixed th, fixed th, fixed th, fixed th | made with: position: fixed · transition · requestAnimationFrame

```css
table { position: relative }
table:after, table:before { position: fixed; top: 0; transition: box-shadow 250ms ease-out }
table.moreLeft:after { box-shadow: 4px 0 14px rgba(0, 0, 0, 0.2) }
table.moreTop:before { box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2) }
table tbody { margin-top: 40px; position: relative }
table tbody th { position: fixed }
table thead { position: fixed; top: 0 }
table thead th.blank { position: fixed; top: 0 }
```

```js
requestAnimationFrame(repositionFixedHeaders)
```

### [Fixed Header and Footer](https://codepen.io/iDavemay/pen/XbBXEY)

held: fixed header | on hover of li.: a.: background | made with: position: fixed · transition · :hover

```css
header { position:fixed; top:0 }
header h1 { position: relative; top: 50%; transform: translateY(-50%) }
.main { margin-top:300px; position:relative }
nav > ul > li > a { transition:all 0.3s ease }
```

### [Table Fixed Header](https://codepen.io/ralgh/pen/GJvYMq)

made with: position: fixed

```css
table { position: relative }
```

### [Really smooth shrinking header](https://codepen.io/sebastianbaumann/pen/EjZzeZ)

held: fixed header | made with: position: fixed · scroll() timeline · transition · :hover

```css
.row { margin-bottom: 2rem }
header { will-change: height; position: fixed; top: 0; transition: all 300ms ease }
nav a { text-transform: uppercase; transition: color 0.3s ease }
.logo { text-transform: uppercase }
.hero { margin-bottom: 3rem }
.hero img { opacity: 0.5 }
main { margin-top: 13rem }
```

### [Fixed Header & Image Positioning](https://codepen.io/ChrisofArabia/pen/JdRjwd)

held: fixed div | made with: position: fixed

```css
section { margin-top: 25px; margin-bottom: 25px }
.shaded, .unshaded { padding-top: 25px; padding-bottom: 25px }
```

### [Nav fixed when you scroll up](https://codepen.io/mdf/pen/KpVGre)

held: fixed header | made with: position: fixed · transition · scroll listener

```css
body { padding-top: 50px }
header { position: fixed; top: 0; transition: top 0.15s ease-out }
.header-hidden { top: -50px }
p { margin-top: 0 }
```

```js
addEventListener('scroll', function() {
```

### [Fixed Header Module](https://codepen.io/kyleshrives/pen/PqoRJo)

held: fixed div.fixed-element | on scroll: div.fixed-element: transform+top | made with: position: fixed · transition · :hover

```css
.fixed-element { position: fixed; top: 0 }
.fixed-element.activated { transition: transform 0.5s ease }
.fixed-element.activated { transform: translateY(-100px) }
.fixed-element.scrolling-up, .fixed-element:hover { transform: translateY(0) }
```

### [Previoustop Fixed Header](https://codepen.io/yusufbkr/pen/XJGLgm)

held: fixed header.visible | made with: position: fixed · transition · :hover

```css
header { position: fixed; top: 0; box-shadow: 0 0 5px rgba(0, 0, 0,.3); transition:500ms; -ms-transform: translate(0px,-100px); -webkit-transform:translate(0px,-100px); -moz-transform:translate(0px,-100px); transform: translate(0 }
.visible { -ms-transform: translate(0px,0px); -moz-transform: translate(0px,0px); -webkit-transform: translate(0px,0px); transform: translate(0px,0px) }
.nav li { position: relative }
.nav li a { position: relative; transition:500ms }
.nav li:after { position: absolute; bottom: 0; transition:500ms }
.nav li:hover:after { top: 0 }
.nav li.active:after { top: 0 }
.logo { position: relative; top: 0px }
.logo img { position: relative; top: 10px }
```

### [Fixed Header on Scroll Bootstrap](https://codepen.io/ssbalakumar/pen/xbMeRJ)

made with: scroll() timeline · transition · :hover

```css
body, html { position: relative }
h3, h4, h5 { margin-top: 5px }
a { -webkit-transition: All 0.5s ease; -moz-transition: All 0.5s ease; -ms-transition: All 0.5s ease; -o-transition: All 0.5s ease; transition: All 0.5s ease }
.header-inner { position: reltive; -webkit-box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1), 0 1px 0 0 rgba(0, 0, 0, 0.06); box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1), 0 1px 0 0 rgba(0, 0, 0, 0.06); -webkit-transform: translate3d(0, 0, 0); -m }
.top-line { transition: all 0.2s ease-in-out; -moz-transition: all 0.2s ease-in-out; -webkit-transition: all 0.2s ease-in-out; -o-transition: all 0.2s ease-in-out }
.top-line ul.social-icons li a { transition: all 0.2s ease-in-out; -moz-transition: all 0.2s ease-in-out; -webkit-transition: all 0.2s ease-in-out; -o-transition: all 0.2s ease-in-out }
.main-nav .sf-menu li { position: relative }
.main-nav .sf-menu li:hover, .sf-menu li.sfHover { -webkit-transition: none; transition: none }
.main-nav .sf-menu li a { position: relative; text-transform: capitalize }
.main-nav .sf-menu ul { position: absolute; top: 99%; border-top: solid 2px #c44741; -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, .05); box-shadow: 0 1px 3px rgba(0, 0, 0, .05) }
.main-nav .sf-menu a { position: relative }
.main-nav .sf-menu ul li { border-bottom: solid 1px #ddd }
```

### [Fixed header with hidden menu](https://codepen.io/sfurley/pen/RNvJao)

held: fixed div.header, fixed div.shadow | on scroll: div.icon: opacity, div.nav-menu: opacity+top, div.shadow: shadow | on hover of li.: li.: background+color | made with: position: fixed · scroll() timeline · transition · :hover

```css
.header-wrap { position: relative }
.shadow { box-shadow: 0 0 0; position: fixed; top: 30px }
.shadow.shad { box-shadow: 0 0 5px }
.header { position: fixed; top: 0 }
.nav-menu { position: relative; top: 50px }
.nav-menu.fixed { position: fixed; top: 50px; opacity: 1 }
.nav-menu.hidden { opacity: 0 }
.nav-menu ul li { margin-top: 7px; text-transform: capitalize }
.icon { opacity: 0; position: absolute; top: 10px; transition: 250ms ease-in-out }
.icon.fixed { opacity: 1 }
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

### [fixed header](https://codepen.io/tailofmoon/pen/VYQNzN)

on scroll: div.top: background+top | made with: position: fixed

```css
div.top.fix { position: fixed; top:0 }
```

### [Animated Fixed Header](https://codepen.io/draftmethod/pen/wBqBOO)

held: fixed header.header | on scroll: header.header: background | made with: position: fixed · scroll() timeline · transition

```css
header { position:fixed; top:0; -webkit-transition: all 0.75s cubic-bezier(0.175, 0.885, 0.32, 1.275); -moz-transition: all 0.75s cubic-bezier(0.175, 0.885, 0.32, 1.275); transition: all 0.75s cubic-bezier(0.175, 0.885, 0.32, 1.2 }
header a { -webkit-transition: all 0.75s cubic-bezier(0.175, 0.885, 0.32, 1.275); -moz-transition: all 0.75s cubic-bezier(0.175, 0.885, 0.32, 1.275); transition: all 0.75s cubic-bezier(0.175, 0.885, 0.32, 1.275) }
header nav { -webkit-transition: all 0.75s cubic-bezier(0.175, 0.885, 0.32, 1.275); -moz-transition: all 0.75s cubic-bezier(0.175, 0.885, 0.32, 1.275); transition: all 0.75s cubic-bezier(0.175, 0.885, 0.32, 1.275) }
```

### [Fixed header table](https://codepen.io/glauberramos/pen/QwdQbq)

made with: nothing recognised — read the code

### [Fixed Header Responsive Table](https://codepen.io/caseybaggz/pen/PwwXMo)

made with: nothing recognised — read the code

```css
.container table { position: relative }
.container table thead { position: absolute; top: 0 }
.container table tbody { position: relative; margin-top: 58px }
.container table tbody td { border-top: none }
```

### [Untitled](https://codepen.io/amitabha197/pen/jENyxP)

on scroll: header.header: background | made with: scroll() timeline · transition

```css
.header { position : relative }
body { transition : height 2s ease }
.scroll { position : fixed; margin-top : 0; transition: height 2s, background 2s }
```

### [Of fixed and sticky headers and footers](https://codepen.io/BigAB/pen/MWLXXQ)

made with: transition · :hover

```css
body { position: relative }
body > header, #main, body > footer { position: absolute; top: 0; bottom: 0 }
body > header { bottom: auto }
#main { top: 102px; bottom: 1em; -webkit-transition:top 0.5s, padding-top 0.5s; transition:top 0.5s, padding-top 0.5s; -webkit-transform : translateZ(0); -o-transform : translateZ(0); -moz-transform : translateZ(0); transform :  }
body > footer { top: auto }
.main-content { margin-bottom: -80px; padding-bottom: 80px }
.main-content h1 { margin-top: 0 }
.footer__sticky { border-top: 1px dotted darkslategray }
.header__sticky { position: relative }
.header__dynamic { -webkit-transition: margin-top 0.5s; transition: margin-top 0.5s; -webkit-transform : translateZ(0); -o-transform : translateZ(0); -moz-transform : translateZ(0); transform : translateZ(0) }
.collapsed .header__dynamic { margin-top: -62px }
.collapsed + #main { top: 0; padding-top: 40px }
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

### [Fixed header and footer without fixed position](https://codepen.io/ukneeq/pen/OJjzJV)

made with: nothing recognised — read the code

```css
header { position: absolute; top: 0px }
#content { position: absolute; top:70px; bottom: 0px }
footer { position: absolute; bottom: 0px }
```

### [Fixed table header with x/y scrolling](https://codepen.io/joelPrz/pen/PomRZY)

made with: nothing recognised — read the code

```css
.container { outline-offset: 0px }
.tabWrap { margin-bottom: 0 }
```

### [Fixed Header on top](https://codepen.io/waqasali/pen/qBmREy)

held: fixed div.header | made with: position: fixed · scroll() timeline · transition

```css
.header { position: fixed; top: 0; -webkit-transition: height 0.3s; -moz-transition: height 0.3s; transition: height 0.3s }
.header h1 { -webkit-transition: all 0.3s; -moz-transition: all 0.3s; transition: all 0.3s }
.header.shrink h1 { -webkit-transition: all 0.3s; -moz-transition: all 0.3s; transition: all 0.3s }
```

### [cabecera fija](https://codepen.io/FranciscoAMK/pen/gOmggP)

held: fixed div | made with: position: fixed

```css
#header { position: fixed; top: 0 }
```

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

### [Bootstrap 3.1.1 demo (light)](https://codepen.io/eaglejs/pen/BaoJGm)

held: fixed header.navbar, fixed footer.navbar | made with: transition · :hover

```css
header a { padding-top: 15px; -webkit-transition: background .2s .1s; -moz-transition: background .2s .1s; transition: background .2s .1s }
header a:hover, header a.selected { -webkit-transition: background .2s .1s; -moz-transition: background .2s .1s; transition: background .2s .1s }
footer p { padding-top: 15px }
```

### [Complex scrolling table](https://codepen.io/AaronRose/pen/VwZdZE)

made with: nothing recognised — read the code

### [Sticky Section](https://codepen.io/jamiepaul/pen/naMNey)

made with: position: fixed · scroll() timeline

```css
.stickyBar { position: relative }
.stickyIsFixed { position: fixed; top: 0 }
```

### [Fixed Header](https://codepen.io/jermbo/pen/kBwXpO)

held: fixed div.fixed-header | on hover of a.: a.: color | made with: position: fixed · transition · :hover

```css
.fixed-header { position: fixed; top: 0; -webkit-transition: all 0.3s ease; -moz-transition: all 0.3s ease; transition: all 0.3s ease }
.fixed-header h1, .fixed-header nav { position: relative }
.fixed-header h1 { text-transform: uppercase; -webkit-transition: all 0.3s ease; -moz-transition: all 0.3s ease; transition: all 0.3s ease }
.fixed-header nav a { -webkit-transition: all 0.3s ease; -moz-transition: all 0.3s ease; transition: all 0.3s ease }
```

### [Header Stick to top on scroll](https://codepen.io/abhaysharma/pen/Aayjwz)

made with: position: fixed · scroll() timeline

```css
ul li { vertical-align: top }
.fixed-nav { position: fixed; top: 0 }
```

### [Grids with and without scrollable rows](https://codepen.io/davidlaym/pen/nMaVJM)

made with: nothing recognised — read the code

```css
table.tx-dataGrid thead { border-bottom: 1px solid black }
table.tx-dataGrid tbody tr td { border-bottom: 1px solid black }
table.tx-dataGrid.con-scroll tr { position: relative }
```
