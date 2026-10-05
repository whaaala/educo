# CodePen · divider — how each pen does it

75 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/divider.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| :hover | 11 |
| transition | 8 |
| clip-path | 7 |
| mask | 4 |
| @keyframes | 3 |
| pointer / mouse tracking | 1 |
| canvas 2D | 1 |

## Every pen

### [Section Separators](https://codepen.io/Umgori/pen/KwgpyLZ)

made with: nothing recognised — read the code

```css
section { position: relative }
.column { vertical-align: top }
section::before, section::after { position: absolute }
.ss-style-triangles::before, .ss-style-triangles::after { -webkit-transform: translateX(-50%) rotate(45deg); transform: translateX(-50%) rotate(45deg) }
.ss-style-triangles::before { top: -50px }
.ss-style-triangles::after { bottom: -50px }
.ss-style-doublediagonal { padding-top: 6em }
.ss-style-doublediagonal::before, .ss-style-doublediagonal::after { top: 0; -webkit-transform: rotate(-2deg); transform: rotate(-2deg) }
.ss-style-doublediagonal::before { -webkit-transform: rotate(-3deg); transform: rotate(-3deg) }
.ss-style-halfcircle::before, .ss-style-halfcircle::after { -webkit-transform: translateX(-50%); transform: translateX(-50%) }
.ss-style-halfcircle::before { top: -50px }
.ss-style-halfcircle::after { bottom: -50px }
```

### [GOV.BR-DS - Components - Divider](https://codepen.io/malves-dev/pen/vENmLwB)

made with: nothing recognised — read the code

### [Beautiful Modern Responsive Footer UI with Animated Social Icons, Links, and Brand Logo Divider](https://codepen.io/0xERR0R/pen/GgRLgyK)

on scroll: svg.[object: transform+top | on hover of li.ms-0: a.icon-link: color, svg.[object: transform+color, path.[object: color, svg.[object: transform+top | made with: @keyframes · transition · :hover

```css
a.icon-link:hover svg { animation: Buzz0xERR0R 0.75s linear 1 }
10% { transform: translateX(0.1875rem) rotate(2deg) }
40% { transform: translateX(-0.1875rem) rotate(-2deg) }
50% { transform: translateX(0.125rem) rotate(1deg) }
60% { transform: translateX(-0.125rem) rotate(-1deg) }
70% { transform: translateX(0.125rem) rotate(1deg) }
80% { transform: translateX(-0.125rem) rotate(-1deg) }
90% { transform: translateX(0.0625rem) rotate(0) }
100% { transform: translateX(-0.0625rem) rotate(0deg) }
.footer-section-top-column-one a { position: relative }
.footer-section-top-column-one a::after { bottom: 0; transition: width .4s ease; position: absolute }
.footer-section-top-column-two a { position: relative }
```

### [GOV.BR-DS - Components - Divider](https://codepen.io/tiago-alexandre-the-decoder/pen/qEWaLNV)

made with: nothing recognised — read the code

```css
.divider { position: relative }
.divider::before, .divider::after { border-top: 1px solid var(--divider-color, #ccc) }
.divider.vertical::before, .divider.vertical::after { border-top: none }
```

### [Dynamic Grid line Dividers](https://codepen.io/philhoyt/pen/YzmxxxJ)

made with: transition · :hover

```css
.features { margin-bottom: 2rem }
```

### [Blizzard - Divider using BG IMG](https://codepen.io/Fotek/pen/qBzoyeP)

made with: nothing recognised — read the code

```css
.divider-container-top { top: 50px; position: relative }
.divider-top::before { position: absolute; top: -50px; background-position: center }
.divider-container-bottom { top: 50px; position: relative }
.divider-bottom::before { position: absolute; bottom: -150px; background-position: center }
```

### [Wavy divider (JS)](https://codepen.io/_bear/pen/vYqedyd)

made with: nothing recognised — read the code

### [GOV.BR-DS - Components - Divider](https://codepen.io/Nadson-Hisatomi/pen/mdZwjMP)

made with: nothing recognised — read the code

### [Linear background for each section](https://codepen.io/pratik-khose/pen/XWOqVzQ)

made with: nothing recognised — read the code

```css
main { position: relative }
section { position: relative }
```

### [Wave section divider](https://codepen.io/pratik-khose/pen/WNPzpoy)

made with: nothing recognised — read the code

```css
main { position: relative }
.custom-shape-divider-top-1700550481 { position: absolute }
.custom-shape-divider-top-1700550481 svg { position: relative }
```

### [Dividers](https://codepen.io/a7rarpress/pen/xxyyqRr)

made with: nothing recognised — read the code

### [Pure CSS Horizontal Divider With Star Icon](https://codepen.io/a7rarpress/pen/OJBjQWR)

made with: mask

```css
.astrodivider { position:relative }
.astrodividermask:after { box-shadow:0 0 8px #049372 }
.astrodivider span { position:absolute; bottom:100%; margin-bottom:-25px; box-shadow:0 2px 4px #4fb39c }
.astrodivider i { position:absolute; top:4px; bottom:4px }
```

### [Section Divider Starter Kit](https://codepen.io/elvann/pen/WNaQKNa)

made with: nothing recognised — read the code

```css
.section { position: relative }
```

### [Pure CSS Horizontal Divider text With Star Icon فاصل بين المنشورات](https://codepen.io/a7rarpress/pen/jOePEGL)

made with: mask

```css
.astrodivider { position:relative }
.astrodividermask:after { box-shadow:0 0 8px #049372 }
.astrodivider span { position:absolute; bottom:100%; margin-bottom:-25px; box-shadow:0 2px 4px #4fb39c }
.astrodivider i { position:absolute; top:4px; bottom:4px }
```

### [horizontal divider Border css](https://codepen.io/a7rarpress/pen/JjamzBx)

made with: nothing recognised — read the code

```css
.h-divider { margin-top: 80px; position: relative }
.h-divider .shadow:after { box-shadow: 0 0 8px black }
.h-divider .text { position: absolute; bottom: 100%; margin-bottom: -33px; box-shadow: 0 2px 4px #999 }
.h-divider .text i { position: absolute; top: 4px; bottom: 4px }
.h-divider .text2 { position: absolute; bottom: 100%; margin-bottom: -35px; box-shadow: 0 2px 4px #999 }
.h-divider img { position: absolute }
```

### [Waves Content Divider Using CSS](https://codepen.io/a7rarpress/pen/JjamzWa)

on scroll: use.[object: transform ×4 | made with: @keyframes

```css
.editorial { bottom:0; position:absolute }
&:nth-child(1) { animation-delay: -2s }
&:nth-child(1) { animation-delay: -2s }
&:nth-child(1) { animation-delay: -2s }
&:nth-child(1) { animation-delay: -2s }
0% { transform: translate(85px, 0%) }
100% { transform: translate(-90px, 0%) }
0% { transform: translate(-90px, 0%) }
100% { transform: translate(85px, 0%) }
0% { transform: translate(85px, 0%) }
100% { transform: translate(-90px, 0%) }
0% { transform: translate(-90px, 0%) }
```

### [Non-rectangular Sections | CSS clip-path](https://codepen.io/cgrkzlkn/pen/qBKaZxx)

made with: clip-path

```css
section h1 { text-transform: uppercase }
.tilt { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - var(--cut))); position: relative }
.triangle { clip-path: polygon( 0 0, 100% 0, 100% calc(100% - var(--cut)), 50% 100%, 0 calc(100% - var(--cut)) ); margin-top: calc(var(--cut) * -1); position: relative }
.polygon { clip-path: polygon( 0 0, 100% 0, 100% 100%, 80% calc(100% - var(--cut)), 20% calc(100% - var(--cut)), 0 100% ); margin-top: calc(var(--cut) * -1); position: relative }
.last { margin-top: calc(var(--cut) * -1) }
```

### [Grid Tile Divider](https://codepen.io/NeoBats/pen/OJEXVbe)

made with: nothing recognised — read the code

### [Div Divider](https://codepen.io/moohka/pen/YzayewG)

made with: clip-path

```css
.main { position:relative }
.pointer { position: absolute }
#border { bottom: -20px; transform:translate(-50%); border-top: 20px solid purple }
label[for="border"] { position: absolute; bottom:20px; transform:translate(-50%) }
#clip-path { bottom: -20px; transform:translate(-50%); clip-path: polygon(50% 100%, 0 0, 100% 0) }
label[for="clip-path"] { position: absolute; bottom:20px; transform:translate(-50%) }
```

### [Otter: divider > vertical](https://codepen.io/sogyeokdong/pen/QWQNErQ)

on hover of a.: a.: color | made with: transition · :hover · clip-path

```css
a { transition: color 0.3s }
button { position: relative }
button:not([disabled]):active, button:not([disabled]):focus { box-shadow: none }
hr:after { position: relative; top: 10px; transform: rotate(45deg) }
.a11y-hidden { position: absolute; clip-path: polygon(0 0, 0 0, 0 0) }
:root { --otter-divider-top: var(--otter-divider-border); --otter-divider-with-text-border-top: var(--otter-divider-border); --otter-tooltip-arrow-top-box-shadow: rgba(0, 0, 0, 0.1); --otter-tooltip-arrow-bottom-box-shadow: rgba }
.otter-divider-vertical { position: relative; top: -0.06em }
.otter-divider { border-top: 1px solid var(--otter-divider-top) }
.otter-divider-horizontal.otter-divider-with-text { border-top: 0 }
.otter-divider-horizontal.otter-divider-with-text::before, .otter-divider-horizo { position: relative; top: 50%; border-top: 1px solid transparent; border-bottom: 0; transform: translateY(50%) }
.otter-divider-horizontal.otter-divider-with-text.otter-divider-with-text-left:: { top: 50% }
.otter-divider-horizontal.otter-divider-with-text.otter-divider-with-text-left:: { top: 50% }
```

### [Otter: divider > text-without-heading-style](https://codepen.io/sogyeokdong/pen/vYdGKpL)

made with: transition · :hover · clip-path

```css
a { transition: color 0.3s }
button { position: relative }
button:not([disabled]):active, button:not([disabled]):focus { box-shadow: none }
hr:after { position: relative; top: 10px; transform: rotate(45deg) }
.a11y-hidden { position: absolute; clip-path: polygon(0 0, 0 0, 0 0) }
:root { --otter-divider-top: var(--otter-divider-border); --otter-divider-with-text-border-top: var(--otter-divider-border); --otter-tooltip-arrow-top-box-shadow: rgba(0, 0, 0, 0.1); --otter-tooltip-arrow-bottom-box-shadow: rgba }
.otter-divider-vertical { position: relative; top: -0.06em }
.otter-divider { border-top: 1px solid var(--otter-divider-top) }
.otter-divider-horizontal.otter-divider-with-text { border-top: 0 }
.otter-divider-horizontal.otter-divider-with-text::before, .otter-divider-horizo { position: relative; top: 50%; border-top: 1px solid transparent; border-bottom: 0; transform: translateY(50%) }
.otter-divider-horizontal.otter-divider-with-text.otter-divider-with-text-left:: { top: 50% }
.otter-divider-horizontal.otter-divider-with-text.otter-divider-with-text-left:: { top: 50% }
```

### [Otter: divider > divide-with-title](https://codepen.io/sogyeokdong/pen/jOZqrwY)

made with: transition · :hover · clip-path

```css
a { transition: color 0.3s }
button { position: relative }
button:not([disabled]):active, button:not([disabled]):focus { box-shadow: none }
hr:after { position: relative; top: 10px; transform: rotate(45deg) }
.a11y-hidden { position: absolute; clip-path: polygon(0 0, 0 0, 0 0) }
:root { --otter-divider-top: var(--otter-divider-border); --otter-divider-with-text-border-top: var(--otter-divider-border); --otter-tooltip-arrow-top-box-shadow: rgba(0, 0, 0, 0.1); --otter-tooltip-arrow-bottom-box-shadow: rgba }
.otter-divider-vertical { position: relative; top: -0.06em }
.otter-divider { border-top: 1px solid var(--otter-divider-top) }
.otter-divider-horizontal.otter-divider-with-text { border-top: 0 }
.otter-divider-horizontal.otter-divider-with-text::before, .otter-divider-horizo { position: relative; top: 50%; border-top: 1px solid transparent; border-bottom: 0; transform: translateY(50%) }
.otter-divider-horizontal.otter-divider-with-text.otter-divider-with-text-left:: { top: 50% }
.otter-divider-horizontal.otter-divider-with-text.otter-divider-with-text-left:: { top: 50% }
```

### [Otter: divider > horizontal](https://codepen.io/sogyeokdong/pen/xxYVOOM)

made with: transition · :hover · clip-path

```css
a { transition: color 0.3s }
button { position: relative }
button:not([disabled]):active, button:not([disabled]):focus { box-shadow: none }
hr:after { position: relative; top: 10px; transform: rotate(45deg) }
.a11y-hidden { position: absolute; clip-path: polygon(0 0, 0 0, 0 0) }
:root { --otter-divider-top: var(--otter-divider-border); --otter-divider-with-text-border-top: var(--otter-divider-border); --otter-tooltip-arrow-top-box-shadow: rgba(0, 0, 0, 0.1); --otter-tooltip-arrow-bottom-box-shadow: rgba }
.otter-divider-vertical { position: relative; top: -0.06em }
.otter-divider { border-top: 1px solid var(--otter-divider-top) }
.otter-divider-horizontal.otter-divider-with-text { border-top: 0 }
.otter-divider-horizontal.otter-divider-with-text::before, .otter-divider-horizo { position: relative; top: 50%; border-top: 1px solid transparent; border-bottom: 0; transform: translateY(50%) }
.otter-divider-horizontal.otter-divider-with-text.otter-divider-with-text-left:: { top: 50% }
.otter-divider-horizontal.otter-divider-with-text.otter-divider-with-text-left:: { top: 50% }
```

### [Nested Split Pane using CSS Grid](https://codepen.io/donalfonsnisnoni/pen/jOZNaRy)

made with: pointer / mouse tracking

```css
.main { margin-top: 2rem }
```

```js
addEventListener('mousemove', handler, { passive: true })
```

### [CSS "or" style dividers](https://codepen.io/cbracco/pen/mdBEOOx)

made with: nothing recognised — read the code

```css
.or--y { position: relative }
.or--y::before, .or--y::after { position: absolute }
.or--y::before { top: 0 }
.or--y::after { bottom: 0 }
.or--x::before, .or--x::after { position: relative; border-top: 1px solid #ccc; margin-bottom: 0.15em }
.demo .or { text-transform: uppercase }
```

### [Quick Trick - Slanted Divider](https://codepen.io/fcarlin/pen/dyzbypM)

made with: nothing recognised — read the code

```css
.example-section-two { position: relative }
.example-section-two::before { position: absolute; top: 0; bottom: 0; transform: skewY(4deg) }
```

### [Line divider](https://codepen.io/luisangelmaciel/pen/KKqRbbQ)

made with: nothing recognised — read the code

```css
.container-80 { padding-top: 50px }
.line-divider { margin-top: 10px; position: relative; margin-bottom: 60px }
.line-divider:before { border-top: solid 2px #999; position: absolute; top: 17px }
.line-divider .span-line-divider { position: relative }
.margin-bottom-20px { margin-bottom: 20px }
```

### [Divider](https://codepen.io/Calleb/pen/jOmvEZd)

made with: nothing recognised — read the code

### [Basic SVG Shape Divider](https://codepen.io/Calleb/pen/JjNJxYy)

on hover of a.: a.: background | made with: :hover

```css
h1 { margin-bottom: 1em }
a { text-transform: uppercase }
.copy { margin-bottom:4em }
.copyok { animation-name: copyani; animation-duration: 0.3s; animation-iteration-count: 1; animation-timing-function: ease }
0% { transform: scale(1) }
50% { transform: scale(1.1) }
100% { transform: scale(1) }
.shape { position: absolute; top: 0px }
```

### [Cookies Order Responsive - Bootstrap](https://codepen.io/psyloute/pen/WNpYxEL)

on scroll: img.img-fluid: transform+top ×3 | on hover of img.img-fluid: img.img-fluid: transform+top ×3 | made with: nothing recognised — read the code

```css
section.headbg { background-position-y:bottom }
#overlay { position: relative; top: 0; bottom: 0 }
section.services div.col-sm-12:nth-child(odd) { margin-top:-10vw }
section.services div.col-sm-12:nth-child(2) { margin-top:-5vw }
section.services div.col-sm-12 h3 { position:absolute; top: 35% }
section.services div.col-sm-12 { -webkit-filter: drop-shadow(5px 5px 5px #00000047); filter: drop-shadow(5px 5px 5px #00000047) }
0% { transform: translateY(0) }
100% { transform: translateY(-10px) }
.mover { -webkit-animation: mover 2s infinite alternate; animation: mover 2s infinite alternate }
.divider-top { position:relative }
.divider-home { margin-top: -150px }
.divider-top:before { position:absolute; top:100%; transform:skewY(8deg) }
```

### [login with vertical divider](https://codepen.io/AleaQ/pen/rNWzOYd)

made with: nothing recognised — read the code

```css
.login-card-container { position: relative }
```

### [Horizontal Dividers](https://codepen.io/nikki-peel/pen/zYoZXgw)

made with: clip-path

```css
h3 { margin-bottom: 2rem }
span:nth-of-type(1) { box-shadow: 0 0 12px 2px #F87171; margin-top: -2px }
span:nth-of-type(2) { opacity: .8; box-shadow: 0 0 12px 2px #FECACA; margin-top: -2px }
span:nth-of-type(3) { opacity: .6; box-shadow: inset 0 0 12px 2px #FEF2F2; margin-top: -2px }
#section2 { transform: skew(0, -2deg) }
#section2 h3, #section2 p { transform: skew(0, 2deg) }
#section3 { margin-top: -5%; padding-top: 8%; padding-bottom: 8% }
svg { margin-top: -4rem }
#section4 { margin-top: -10%; padding-top: 10%; padding-bottom: 12% }
.footer-bg { position: relative; margin-top: -18%; clip-path: polygon(0% 65%, 1% 64.95%, 2% 64.8%, 3% 64.6%, 4% 64.3%, 5% 63.9%, 6% 63.45%, 7% 62.9%, 8% 62.25%, 9% 61.55%, 10% 60.8%, 11% 59.95%, 12% 59.05%, 13% 58.1%, 14% 57.1%, 15%  }
footer { margin-top: -5px }
#section3 { margin-top: -8%; padding-bottom: 20% }
```

### [Text Dividers](https://codepen.io/will-1-am-the-Iceman/pen/LYbbLVN)

made with: nothing recognised — read the code

```css
&:before { position: absolute; top: 50% }
&:after { position: relative }
```

### [CSS Semi Circle Section Divider](https://codepen.io/mark_sottek/pen/rNWBbQG)

made with: nothing recognised — read the code

```css
.semiCircleBottom { position: relative }
.semiCircleBottom::before { position: absolute; transform: translateX(-50%) translateY(50%); bottom: 0px }
```

### [Triangle section Divider](https://codepen.io/mark_sottek/pen/VwmZNQG)

made with: nothing recognised — read the code

```css
.triangle { position: relative }
.triangle::before { position: absolute; bottom: 0; transform: translateX(-50%) translateY(100%) }
```

### [Rounded Section Dividers](https://codepen.io/alexrnm/pen/zYBWExe)

made with: nothing recognised — read the code

```css
section { position: relative }
section:nth-of-type(2) img { margin-top: -10vw; box-shadow: 0 8px 35px rgba(21, 21, 21, 0.15) }
section:nth-of-type(2)::before { position: absolute; top: 100% }
h1 { margin-bottom: 2.5rem }
```

### [Gradient Mask Divider](https://codepen.io/alphardex/pen/WNwyjqw)

made with: mask

```css
.divider-grad-mask { -webkit-mask: linear-gradient(-90deg, black, transparent); mask: linear-gradient(-90deg, black, transparent) }
```

### [Shape-Divider](https://codepen.io/eyupucmaz/pen/wvMgBdr)

made with: nothing recognised — read the code

```css
.image { position: relative }
.divider { position: absolute; top: 0 }
.divider svg { position: relative }
```

### [Text Dividers](https://codepen.io/saldoc/pen/RwPMqGN)

made with: nothing recognised — read the code

### [SVG Section Divider | Design in Code](https://codepen.io/codyhouse/pen/Powbyma)

made with: nothing recognised — read the code

```css
.has-section-divider { position: relative; padding-bottom: var(--section-divider-ratio) }
.section-divider { position: absolute; bottom: -1px }
```

### [Divider Text Headings](https://codepen.io/draney/pen/PowZoZj)

made with: nothing recognised — read the code

```css
.divider:before, .divider:after { position: relative }
```

### [Cheeky little % - based table data cell divider border](https://codepen.io/matt_w/pen/qeXLWZ)

made with: nothing recognised — read the code

```css
tr { border-bottom: 0.3rem solid transparent }
tr td:first-child { background-position: right }
```

### [vertical divider](https://codepen.io/jelenagav/pen/yWoZpj)

made with: nothing recognised — read the code

```css
html { top: 0%; -webkit-animation: slide 1s 1 ease-out }
```

### [Bootrap Responsive Divider with Text](https://codepen.io/WolfInStep/pen/oVoeEQ)

made with: nothing recognised — read the code

```css
.contentDivider .dividedText:before, .contentDivider .dividedText:after { border-top: 2px solid }
.contentDivider { position: relative }
.contentDivider .dividedText:before, .contentDivider .dividedText:after { position: absolute }
.contentDivider .dividedText:before { bottom: 50%; top: 0; margin-bottom: 20px }
.contentDivider .dividedText:after { top: 50%; bottom: 0; margin-top: 20px }
```

### [Resonsive Divider with Content](https://codepen.io/WolfInStep/pen/JzbvQp)

made with: nothing recognised — read the code

```css
.col.col-auto { position: relative }
.item > .head .title { margin-bottom: 10px }
.item > .head .icon { margin-bottom: 10px }
.contentDivider .dividedText:before, .contentDivider .dividedText:after { border-top: 2px solid }
.contentDivider { position: relative }
.contentDivider .dividedText:before, .contentDivider .dividedText:after { position: absolute }
.contentDivider .dividedText:before { bottom: 50%; top: 0; margin-bottom: 20px }
.contentDivider .dividedText:after { top: 50%; bottom: 0; margin-top: 20px }
```

### [Scss: shapes after a section](https://codepen.io/havutcuoglu/pen/QYaJEG)

made with: nothing recognised — read the code

```css
.wrapper { position: relative }
.container1 { position: relative }
.container1:after { position: absolute; bottom: -22.5px }
.container2 { position: relative }
.container2:after { position: absolute; border-top: 20px solid orange; bottom: -20px }
.container3 { position: relative }
.container3:after { position: absolute; bottom: -17.5px }
.container4 { border-bottom: 1px solid black }
```

### [Diagonal Split Screen](https://codepen.io/chris22smith/pen/vvYBGY)

made with: nothing recognised — read the code

```css
.view { bottom:0; position:absolute; top:0; transform:skew(-5deg) }
.left, .right { bottom:0; position:absolute; top:0 }
.divider { bottom:-5%; position:absolute; top:-5% }
.sun, .moon { bottom:-5%; position:absolute; top:-5%; transform:skew(5deg) }
.sun { background-position:center center }
.moon { background-position:center center }
```

### [Gradient <hr /> line](https://codepen.io/wetandsalty/pen/XBaEEd)

made with: nothing recognised — read the code

```css
h1 { text-transform: uppercase }
.subheadline { text-transform: uppercase }
```

### [Page Divide - Single element HR](https://codepen.io/jnowland/pen/PBjOpy)

made with: nothing recognised — read the code

```css
hr { position: relative }
hr:before { position: absolute; top: 0; transform: translate(-50%, -50%) }
```

### [Pure CSS Responsive Divider with Text/Copy](https://codepen.io/MarkJMoyer/pen/eGogbq)

made with: nothing recognised — read the code

```css
div h3 span { position: relative }
div h3 span::before, div h3 span::after { position: absolute; top: 35% }
```

### [Pure CSS Horizontal Divider With Star Icon](https://codepen.io/isabelc/pen/MmrJgx)

made with: mask

```css
.astrodivider { position: relative }
.astrodividermask:after { box-shadow: 0 0 8px #049372 }
.astrodivider span { position: absolute; bottom: 100%; margin-bottom: -25px; box-shadow: 0 2px 4px #4fb39c }
.astrodivider i { position: absolute; top: 4px; bottom: 4px }
.purple .astrodividermask:after { box-shadow: 0 0 8px #886fac }
.astrodivider.purple span { box-shadow: 0 2px 4px #ab9ac4 }
.neonpurple .astrodividermask:after { box-shadow: 0 0 8px #9d00ff }
.astrodivider.neonpurple span { box-shadow: 0 2px 4px #ba4cff }
.astrodivider { margin-bottom: 100px }
```

### [Text Divider](https://codepen.io/lyndenoliver/pen/WpYPBp)

made with: nothing recognised — read the code

### [Divider Experiments #1](https://codepen.io/Oddgson/pen/VPrYbv)

made with: nothing recognised — read the code

```css
.wrapper { padding-bottom: 90px }
.divider { position: relative; margin-top: 90px }
.div-transparent:before { position: absolute; top: 0 }
.div-arrow-down:after { position: absolute; top: -7px; transform: rotate(45deg); border-bottom: 1px solid rgb(48,49,51) }
.div-tab-down:after { position: absolute; top: 0; border-bottom: 1px solid rgb(48,49,51) }
.div-stopper:after { position: absolute; top: -6px }
.div-dot:after { position: absolute; top: -9px; box-shadow: inset 0 0 0 2px white, 0 0 0 4px white }
```

### [Divider with a circle](https://codepen.io/rinatoptimus/pen/WRQdGY)

made with: nothing recognised — read the code

```css
.content { position: relative; border-bottom: 2px solid }
.header { position: relative; border-bottom: 2px solid }
.circle-border { bottom: -32px; position: absolute }
.circle { bottom: -30px; position: absolute }
```

### [Subtle divider using pseudo elements](https://codepen.io/stphn/pen/XjoXom)

made with: nothing recognised — read the code

```css
.section { position: relative }
.section--dark::before, .section--dark::after { position: absolute; transform: scaley(0.5) }
.section--dark::before { top: 0; transform-origin: top }
.section--dark::after { top: 100%; margin-top: -1px; transform-origin: bottom }
```

### [Pizza Slice Devider](https://codepen.io/CM85/pen/OXzmav)

made with: :hover · canvas 2D

```css
#header { position: relative; margin-top: -20px; margin-bottom: 10px }
#about { position: relative; margin-bottom: 5px }
#calculator { position: relative; margin-bottom: 5px }
#notice { position: relative; margin-bottom: 5px }
#footer { position: relative }
#copy { position: relative }
```

### [Zigzag Divider](https://codepen.io/Ninjaweb/pen/yJeYjp)

made with: nothing recognised — read the code

```css
hr { position: relative; padding-top:23px }
hr:before { position: relative; top: -21px }
```

### [Simple "or divider"](https://codepen.io/ckristhoff/pen/EKZerP)

made with: nothing recognised — read the code

### [Box-Shadows as Page Dividers](https://codepen.io/careecodes/pen/vGyNxN)

on hover of a.: a.: color | made with: :hover

```css
div:first-child { margin-top:25px }
div { box-shadow: 0 1em 1em -1em rgba(0, 0, 0, .25) }
```

### [CSS3 Jagged Triangle divider](https://codepen.io/pixel-smooth/pen/RWxzvy)

made with: nothing recognised — read the code

### [Fish logo in line](https://codepen.io/partisan1991/pen/vNgwpq)

made with: nothing recognised — read the code

```css
.fish-row { border-bottom: #888888 1px double; border-top: #888888 1px double; margin-top: 2em }
```

### [Vertical dividers for 4 column grid](https://codepen.io/riogrande/pen/avbozG)

made with: nothing recognised — read the code

```css
body { text-transform:uppercase }
i { margin-top:50px }
```

### [Section Breaks](https://codepen.io/joshuar/pen/MwdYLP)

made with: transition · :hover

```css
main { position: relative; box-shadow: 0 0 10rem rgba(0, 0, 0, 0.3) }
.sb-index, .intro, .colophon { border-bottom: 1px solid rgba(0, 0, 0, 0.1) }
.sb { margin-bottom: 0.5rem; position: relative }
.sb small { box-shadow: 0 0.1rem 0.1rem 0 rgba(0, 0, 0, 0.15); opacity: 0; position: absolute; transform: translate(-50%, 0); transition: opacity 1s ease-out, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) }
.sb:hover > small { opacity: 1; transform: translate(-50%, -75%) }
.section-break-1 { border-top: 3px double #c8c8c8 }
.section-break-1:before { position: absolute; transform: translate(-50%, -65%) }
.section-break-2 { border-top: 1px solid #c8c8c8 }
.section-break-2:before { transform: translateY(-53%) }
.section-break-3 { border-top: 1px solid #4d4d4d }
.section-break-3:before { transform: translateY(-53%) }
.section-break-4:before, .section-break-4:after { position: absolute }
```

### [Rainbowy Dashed Divider](https://codepen.io/simeydotme/pen/rVqrrN)

made with: @keyframes · transition · :hover

```css
.hr { position: relative; margin-bottom: 0em }
.hr:after, .hr:before { position: absolute; bottom: 50% }
.hr:before { background-position: center }
.hr:after { transition: opacity 0.3s ease, -webkit-animation 0.3s ease; transition: opacity 0.3s ease, animation 0.3s ease; transition: opacity 0.3s ease, animation 0.3s ease, -webkit-animation 0.3s ease; background-position: 0%; -w }
0% { background-position: 0% }
100% { background-position: 200% }
0% { background-position: 0% }
100% { background-position: 200% }
.hr.anim:before { background-position: center; -webkit-animation: bar 120s linear infinite; animation: bar 120s linear infinite }
.hr.anim:hover:before { -webkit-animation-duration: 20s; animation-duration: 20s }
.hr.anim:hover:after { -webkit-animation-duration: 2s; animation-duration: 2s }
h1, h2 { margin-bottom: -0.5em }
```

### [Simple stylish divider with a little help of span.](https://codepen.io/HummixX/pen/RPeROM)

made with: nothing recognised — read the code

```css
.heading-1 { text-transform: uppercase }
.heading-2 { text-transform: uppercase }
.heading-3 { text-transform: uppercase }
.divider-1 { border-bottom: 1px solid #FFF }
.divider-2 { border-bottom: 1px solid #FFF }
.divider-3 { border-bottom: 1px solid #FFF }
```

### [Seperator Example](https://codepen.io/tutuncu/pen/yNMROw)

made with: nothing recognised — read the code

```css
.divider:before, .divider:after { vertical-align:top; border-bottom:1px solid #ccc }
```

### [Section Divider](https://codepen.io/Mestika/pen/vOxYrw)

made with: nothing recognised — read the code

```css
body { margin-top: 40px }
.section-divider { border-top: 1px solid #DDD; margin-top: 40px; margin-bottom: 40px }
.section-divider > span { position: relative; top: -11px }
```

### [Divider](https://codepen.io/venuslangmuir/pen/eNmzNB)

made with: nothing recognised — read the code

```css
hr.divider { border-top: 5px double #fafffc; border-bottom: 5px double #fafffc }
hr.divider:after { position: relative; top: -0.1em }
```

### [Lines and Dots - Dividers](https://codepen.io/cbhoweth/pen/raRVBq)

made with: nothing recognised — read the code

```css
.v-bar { position: relative }
.v-bar:before { position: absolute; top: 0 }
.v-bar:after { position: absolute; bottom: 0 }
.h-bar { position: relative }
.h-bar:before { position: absolute; top: -3.5px }
.h-bar:after { position: absolute; top: -3.5px }
```

### [Nested Select with Option Section Divider](https://codepen.io/mtclmn/pen/NPdXpG)

made with: nothing recognised — read the code

### [Easy divider](https://codepen.io/stg/pen/ZYYQMJ)

made with: nothing recognised — read the code

```css
.divider span { position: relative }
.divider span:first-child, .divider span:last-child { top: 13px; background-position: 0 0, 0 100% }
```

### [Page dividers](https://codepen.io/cbhoweth/pen/vYqqxv)

made with: nothing recognised — read the code

```css
.x-on-top { position: relative; border-top: 2px solid #222 }
.x-on-top:after { position: absolute; top: -40px }
.x-on-bottom { position: relative; border-bottom: 2px solid #222 }
.x-on-bottom:after { position: absolute; bottom: -40px }
```

### [Divider Mixin](https://codepen.io/john-cheesman/pen/wvLPwV)

made with: nothing recognised — read the code

```css
.divider-heading { position: relative }
.divider-heading .heading { position: relative }
.divider-heading hr { position: absolute; top: 50%; border-top: 4px double gray; border-bottom: none }
```

### [Easy Page Divider](https://codepen.io/damienWebDev/pen/LYoNwJ)

made with: nothing recognised — read the code

```css
.page-divider { margin-top:15px }
.page-divider div .image-link { margin-top:10px }
.page-divider div .image-link img { vertical-align: text-top }
.page-divider div .header-link { text-transform:uppercase; margin-top:10px }
.page-divider div { margin-top:2px }
.page-divider div .header-link { margin-top:4px !important }
.page-divider div .image-link { margin-top:4px !important }
.page-divider div { margin-top:2px }
.page-divider div .header-link { margin-top:4px !important }
.page-divider div .image-link { margin-top:4px !important }
.page-divider div { margin-top:2px }
.page-divider div .header-link { margin-top:4px !important }
```

### [Flexbox Text Dividers](https://codepen.io/oldmoodycomputer/pen/dyjQzg)

made with: nothing recognised — read the code

```css
.or-divider.italic::before, .or-divider.italic::after { transform: skew(-18deg) }
```
