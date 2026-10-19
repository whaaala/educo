# CodePen · page-layout — how each pen does it

29 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/page-layout.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| transition | 6 |
| position: fixed | 4 |
| :hover | 4 |
| CSS grid | 3 |
| backdrop-filter | 2 |
| @keyframes | 2 |
| 3D (perspective / preserve-3d) | 2 |
| flex-wrap | 2 |
| clip-path | 1 |
| mask | 1 |
| multi-column masonry (columns) | 1 |
| CSS-only state (:checked / :target) | 1 |
| inline SVG | 1 |
| aspect-ratio | 1 |
| scroll() timeline | 1 |
| Web Animations API (.animate) | 1 |
| CSS masonry (grid-lanes / masonry) | 1 |
| filter / sort library | 1 |

## Every pen

### [NEO-BRUTALIST SALES PAGE](https://codepen.io/editor/monapdx/pen/019f45d1-0242-7e59-9a52-a5c763144de4)

held: fixed div.bg-scribble, fixed div.bg-lightning, fixed div.halftone-green | made with: position: fixed · transition · :hover · clip-path · mask · backdrop-filter

### [Two-Column Layout Using HTML and CSS](https://codepen.io/editor/siammakemoneyonline/pen/019f3658-5aa2-7ed5-993f-d4c14a9a030e)

made with: transition · :hover · CSS grid

```css
.topbar { margin-bottom: 22px }
.browser { box-shadow: 0 10px 30px rgba(36, 26, 107, 0.06); margin-bottom: 26px }
.site-nav { padding-bottom: 14px; margin-bottom: 18px; border-bottom: 1px solid var(--line) }
.site-nav .search { position: relative }
.article-card { border-bottom: 1px solid var(--line) }
.article-card:last-child { border-bottom: none }
.thumb { position: relative }
.thumb::before { position: absolute; top: 36px; border-bottom: 22px solid #aeb8e8 }
.thumb::after { position: absolute; top: 16px }
.widget { margin-bottom: 14px }
.widget:last-child { margin-bottom: 0 }
.sec-label { margin-bottom: 14px }
```

### [CSS GRID page layout](https://codepen.io/cesarrrguez/pen/PoPrmog)

on hover of li.: a.: background | made with: nothing recognised — read the code

### [Flexbox page layout](https://codepen.io/cesarrrguez/pen/GRpbWVP)

on hover of li.: a.: background | made with: nothing recognised — read the code

### [Article with text overlapping the initial image](https://codepen.io/dp_lewis/pen/wvKgjBL)

held: fixed header.page__header, fixed div.page__nav | made with: position: fixed · @keyframes · backdrop-filter · 3D (perspective / preserve-3d) · CSS grid

```css
.page__header { backdrop-filter: blur(5px); position: fixed; top: 20vh; transform: translate(0, 80vh); animation: slidedown .5s ease-in forwards }
.page__header.is-open { animation: slideup .5s ease-out forwards }
.page__title { text-transform: uppercase; position: absolute; bottom: 100%; backdrop-filter: blur(5px) }
.page__title:before { position: absolute; bottom: 100%; backdrop-filter: blur(5px) }
.page__nav { position: fixed; top: 0; bottom: 0; animation: rotate 3s linear infinite }
from { transform: perspective(1000px) rotate3d(0, 1, 0, 90deg) }
to { transform: perspective(1000px) rotate3d(0, 1, 0, 0deg) }
from { transform: translate(0, 80vh) }
to { transform: translate(0, 0) }
from { transform: initial }
to { transform: translate(0, 80vh) }
@keyframes rotate animates transform
```

### [css grid layout example](https://codepen.io/winstonmhango/pen/GPKGPm)

made with: nothing recognised — read the code

### [Responsive Magazine Layout 3](https://codepen.io/rvelarde/pen/xJJpGj)

made with: multi-column masonry (columns) · flex-wrap

```css
main { position: relative; transform: translate(-50%, 0) }
.h1-divider { margin-bottom: 37px }
section p { margin-bottom: 40px }
article p { margin-top: 0; margin-bottom: 50px }
.placeHolder_img { background-position: center }
h1 { margin-bottom: 20px }
.h1-divider { margin-bottom: 53px }
article p { margin-bottom: 40px }
h1 { margin-bottom: 30px }
.h1-divider { margin-bottom: 38px }
.h1-divider { margin-bottom: 45px }
```

### [Basic page layout with Materialize](https://codepen.io/ssbeighley/pen/EEPgvv)

made with: nothing recognised — read the code

```css
.sidebar { margin-top: 2rem }
```

### [CSCIE12 | WK5 | CSS | E | Page layout III: responsive](https://codepen.io/bymushfiq/pen/OQzaZY)

on hover of a.: a.: color, img.: color | made with: transition · :hover

```css
a { -moz-transition: 0.2s color linear; -webkit-transition: 0.2s color linear; transition: 0.2s color linear }
h1 a { padding-top: 117px }
.intro { margin-top: 117px }
ul.nav { border-top: 1px solid #888583 }
ul.nav a { margin-bottom: -1em; text-transform: uppercase }
ul.nav a:hover { background-position: 50% 100% }
li.first a { border-top: 1px solid #FFF9EF; padding-top: 1.25em }
.intro h2 { margin-bottom: 0.25em }
.main h2 { text-transform: lowercase }
.figure { text-transform: uppercase }
.figure img { -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); -moz-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) }
.footer p { margin-bottom: 0.5em }
```

### [CSCIE12 | WK5 | CSS | E | Page layout II: fluid/liquid](https://codepen.io/bymushfiq/pen/JpMmrY)

made with: nothing recognised — read the code

### [CSCIE12 | WK5 | CSS | E | Page layout II: elastic](https://codepen.io/bymushfiq/pen/aqERLz)

made with: nothing recognised — read the code

### [CSCIE12 | WK5 | CSS | E | Page layout II: 3 columns](https://codepen.io/bymushfiq/pen/yvpRoZ)

made with: nothing recognised — read the code

### [CSCIE12 | WK5 | CSS | E | Page layout I: fixed width](https://codepen.io/bymushfiq/pen/KQZGWG)

made with: nothing recognised — read the code

### [The Times Literary Supplement front page](https://codepen.io/IevaOzolite/pen/WZKdKY)

made with: nothing recognised — read the code

### [Just a page](https://codepen.io/everdimension/pen/pJradV)

made with: nothing recognised — read the code

### [Flexbox Topbar with Garand Sticky](https://codepen.io/davidgk/pen/NPyrOq)

held: fixed div.content__top | made with: position: fixed

```css
.container { margin-top: 100px; position: relative }
.content__top { position: fixed }
```

### [Setting Page Layout Using Grid System in CSS](https://codepen.io/AliQas/pen/kBLPVQ)

made with: nothing recognised — read the code

### [facebook pages UI Layout with css grids](https://codepen.io/winstonmhango/pen/zMXwEN)

made with: CSS grid

```css
.pagecover-bg { margin-top: 8px }
.profiles { margin-top: 10px }
.pgprofile { margin-top: 20px }
.areanav { margin-top: 10px }
.advertsm { margin-bottom: 10px; margin-top: 10px }
```

### [Basic page layout with Bootstrap 4](https://codepen.io/ssbeighley/pen/dmGXZv)

made with: nothing recognised — read the code

### [Circle Nav](https://codepen.io/JustMeToby/pen/LLgEeW)

made with: @keyframes · transition · :hover · CSS-only state (:checked / :target)

```css
body, html { position:absolute; top:0; bottom:0 }
.circle-nav { position: absolute }
.circle { box-shadow: 0px 8px 10px 0px #666; transition: all 0.8s }
.circle:hover { margin-top: 0vw; box-shadow: 0px 10px 20px #444; transition:all 0.5s }
.nav-block { top:0px }
.nav-block-main { top:0px }
.circle-main:hover { margin-top:0vw }
.circle-main { margin-top:1vw }
h1 { position: relative; top: 50%; transform: translate(-50%, -50%) }
.circle h2 { position: relative; top: 50%; transform: translate(-50%, -50%) }
.overlay { position:absolute; opacity:0; transition: opacity 1100ms ease 0ms, xheight 0.1s ease 600ms }
.overlay:target { top:0; opacity:1; transition: opacity 600ms ease 100ms, xheight 0.1s ease }
```

### [Page Layout](https://codepen.io/cliffpyles/pen/WpKrpx)

made with: transition · inline SVG · flex-wrap

```css
.layout__header { position: relative }
.layout__logo { margin-bottom: 0.5rem }
.layout__nav-toggle { margin-bottom: 0.5rem }
.layout__nav { position: absolute; top: 100%; transition: all 0.2s ease-in-out; transform: scaleY(0) }
.layout__nav.is-toggled { transform: none }
.layout__header { position: relative }
.layout__logo { margin-bottom: 0px }
.layout__nav { position: static; top: auto; transform: none }
```

### [Angular CSS Divisions](https://codepen.io/joshbader/pen/bggBMa)

made with: aspect-ratio

```css
h1 { position: relative }
h2 { margin-bottom: 1.5rem }
.hero, .footer-content { position: relative; transform: skewY(6deg) }
.hero > * { transform: skewY(-6deg) }
.hero .bg { position: absolute; top: 50%; transform: skewY(-6deg) translate(-50%, -50%); opacity: 0.7 }
.footer { padding-bottom: 15% }
.footer-content { margin-bottom: -15%; transform: skewY(-6deg) }
.footer-content > * { transform: skewY(6deg) }
.sub-section { position: relative }
.sub-section::before { position: absolute; top: 50%; padding-bottom: 25%; transform: rotate(6deg) translate(10%, -40%); background-position: center; box-shadow: 0 1em 2em -1em rgba(0,0,0,0.5) }
.sub-section:nth-child(even)::before { transform: rotate(-6deg) translate(-10%, -50%) }
.sub-section::before { position: static; padding-bottom: 37.5%; transform: rotate(6deg) }
```

### [Page Layout](https://codepen.io/vadimzaharov/pen/mrdyJy)

made with: nothing recognised — read the code

```css
header { margin-bottom: 10px }
.content-big { margin-bottom: 10px }
footer { margin-top: 10px }
```

### [Page Layout](https://codepen.io/itsumrat/pen/VeKBGN)

held: fixed div, fixed button | made with: position: fixed · scroll() timeline · Web Animations API (.animate)

```css
#hero { position:relative }
#hero ul.entry-meta { margin-top: 20px }
.header { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.header h1 { text-transform: uppercase }
.metabar { border-top: 1px solid #394264 }
.metabar .postmetas { margin-top: 11px }
.metabar .social-share { margin-top: 11px }
button { position: fixed; bottom: 20px }
#navigation { position: fixed }
```

```js
.animate({
```

### [Basic Flexbox Panel Layout](https://codepen.io/rstrahl/pen/adbRKz)

made with: nothing recognised — read the code

### [Book Page Layout](https://codepen.io/zachary_price/pen/vObvBG)

made with: nothing recognised — read the code

```css
article { border-bottom: 2px solid grey }
article > h1 { margin-top: 40px }
section > h1 { text-transform: normal }
.line { border-top: 2px solid grey; margin-bottom: 48px }
section p:first-of-type { margin-top: 32px }
```

### [Masonry Layout Practice](https://codepen.io/Milmon/pen/MWpdLJ)

made with: transition · 3D (perspective / preserve-3d) · CSS masonry (grid-lanes / masonry) · filter / sort library

```css
#container { margin-bottom: 20px }
```

### [An Elegant Typography Hierarchy](https://codepen.io/kabirsingh/pen/PoqdZW)

made with: nothing recognised — read the code

### [Resize to fit height jQquery](https://codepen.io/HamsterCoder/pen/nLJaXb)

made with: nothing recognised — read the code

```css
.container { position: absolute }
.header, .body { margin-bottom: 20px }
.body { position: relative }
.body-child { margin-bottom: 20px }
.last { margin-bottom: 0 }
.body-target { position: absolute; top: 0; bottom: 0 }
```
