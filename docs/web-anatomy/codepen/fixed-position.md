# CodePen · fixed-position — how each pen does it

24 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/fixed-position.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| position: fixed | 20 |
| :hover | 6 |
| scroll() timeline | 3 |
| transition | 3 |
| position: sticky | 3 |
| (hover: hover) gate | 1 |
| clip-path | 1 |
| scroll listener | 1 |
| requestAnimationFrame | 1 |

## Every pen

### [Css Layouting Position](https://codepen.io/dediindrawan/pen/jOzrVMw)

held: fixed div.header | made with: position: fixed · :hover

```css
.header { position: fixed }
.brand { margin-top: -7px }
.nav-link { margin-top: 10px }
.nav-link a:hover { border-bottom: 2px solid rgb(53, 73, 90); padding-bottom: 3px }
.container { position: relative }
img { background-position: center; margin-top: 80px }
.note { margin-top: 50px }
.note a:hover { border-bottom: 2px solid rgb(53, 73, 90) }
```

### [Grid - Fix position until target is reached](https://codepen.io/antoniolee/pen/WNvJxdO)

held: fixed div.intro | made with: position: fixed · scroll() timeline · transition · :hover · (hover: hover) gate

```css
section.home div.intro div.blurb { margin-top: 90px }
section.home div.grid div.tile { position: relative }
section.home div.grid div.bg-img { background-position: center; transition: all 0.33s ease }
section.home div.grid div.bg-img a { position: absolute; top: 0; bottom: 0 }
section.home div.grid div.bg-img::before { position: absolute; top: 0; transition: all 0.33s ease }
section.home div.grid .tile-hover:hover .bg-img, section.home div.grid .tile-hov { transform: scale(1.2) }
section.home div.intro { position: fixed }
section#footer h4 { text-transform: uppercase }
section#footer div.blurb { margin-bottom: 60px }
section#footer div.blurb p { text-transform: uppercase }
section#footer div.explore h4 { margin-bottom: 20px }
section#footer div.explore ul li { margin-top: 10px }
```

### [CSS Scroll Reveal Sections](https://codepen.io/hexagoncircle/pen/PXVEVZ)

held: fixed figure, fixed h2.hero__title, fixed figure, fixed h2.hero__title, fixed figure, fixed h2.hero__title, fixed figure, fixed h2.hero__title | made with: position: fixed · clip-path

```css
blockquote { position: relative }
blockquote:before { position: absolute; top: 0 }
figure { position: fixed; top: 0 }
.hero { position: relative }
.hero-inner { position: absolute }
.hero-inner { -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%); clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%) }
.hero__title { position: fixed; top: 0 }
.content { position: relative }
.content:before { position: absolute; top: -100px; -webkit-clip-path: polygon(50% 0%, 0% 100%, 100% 100%); clip-path: polygon(50% 0%, 0% 100%, 100% 100%) }
.content__inner > * + * { margin-top: 1.5rem }
.content__author { margin-bottom: 4rem }
```

### [Chess With CSS Positioning](https://codepen.io/malekz/pen/yRoJXR)

made with: nothing recognised — read the code

```css
#chess { margin-top: 50px; position: relative }
.second { position: absolute; bottom: 0 }
.third { position: absolute; bottom: 0 }
.fourth { position: absolute; bottom: 0 }
.fifth { position: absolute; bottom: 0 }
```

### [Technical Documentation Template | Sidebar Navigation & Fixed Layout](https://codepen.io/karlhorning/pen/pxgybR)

held: fixed nav | made with: position: fixed · :hover

```css
h1 { border-bottom: 3px solid #ffffff; margin-bottom: 30px; margin-top: 0; padding-bottom: 30px; padding-top: 55px }
hr { border-bottom: 1px solid #bdbdbd }
section { border-bottom: 1px solid #bdbdbd; margin-bottom: 60px; padding-bottom: 40px }
section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0 }
#main-doc li { padding-bottom: 1.5em }
#main-doc li:last-child { padding-bottom: 0 }
code { margin-bottom: 30px }
h1 { margin-top: 10px }
#navbar { position: fixed }
h1 { margin-top: 0 }
```

### [Windowed Scroll](https://codepen.io/jaredsmith/pen/wxxyyy)

held: fixed div, fixed div.window, fixed div.window, fixed div.window | on scroll: div.window: opacity | made with: position: fixed

```css
#fixedContainer { position: fixed; top: 0 }
#fixedContainer .window { position: fixed; top: 0 }
#fixedContainer .window.stuck { opacity: 1 }
.scroller { position: relative }
.content, .window { box-shadow: 0px 18px 51px -20px #3c3c3c }
.window + .content, .window + .window { box-shadow: 0px -18px 51px -20px #3c3c3c }
.window { opacity: 0 }
```

### [fixed scroll navigation](https://codepen.io/tailofmoon/pen/VzXmpX)

made with: position: fixed · scroll() timeline

```css
.s1, .s2, .s3 { position: relative }
.s1 nav { position: absolute; bottom: 0 }
.s1 nav.active { position: fixed; top: 0 }
```

### [Fix for position:fixed on iPhone/iOS Safari (v1)](https://codepen.io/thdoan/pen/JWYQeN)

held: fixed div | made with: position: fixed · scroll() timeline

```css
#navbar { position: fixed }
#body { padding-top: 50px }
```

### [Stickybits Demo](https://codepen.io/yowainwright/pen/QdedaO)

held: sticky div.child | made with: position: sticky · position: fixed · :hover · scroll listener · requestAnimationFrame

```css
header h1 { margin-bottom: 0 }
main { position: absolute; top: 150px }
.parent { position: relative }
.parent:before { position: absolute; top: 1rem }
.child.js-is-sticky { top: 0 }
.child.js-is-stuck { bottom: 0 }
```

```js
addEventListener('scroll', item.stateContainer)
```

### [scroll line](https://codepen.io/carlasboa/pen/oLKVMO)

held: fixed div.main, fixed div.main | made with: position: fixed

```css
.main { position: fixed; top: 0 }
.square-content { margin-top: 200px }
.scroll-line { border-top: 1px solid #000; position: absolute }
```

### [Always-visible sidebar](https://codepen.io/tomhazledine/pen/LZvYJb)

made with: position: fixed

```css
.main { position: relative }
.primary .divider { border-bottom: 0.2em solid #ccc }
.secondaryWrapper { position: relative }
.secondary { position: relative }
.secondary.fixed { position: fixed; top: 0 }
.secondary.fixedBottom { position: relative }
.secondary .divider { border-bottom: 0.2em solid #bbb }
```

### [Sticky Bits (with Sticky Position support](https://codepen.io/yowainwright/pen/XKyLwz)

held: sticky nav.nav | made with: position: sticky · position: fixed

```css
[data-position-sticky=true] { bottom: auto; position: -moz-sticky; position: -ms-sticky; position: -o-sticky; position: sticky }
[data-stickybits-sticky=true] .nav--two { top: 0; position: fixed }
.section--first { margin-top: 300px }
.footer { margin-top: 600px }
.footer__text { margin-bottom: 0 }
```

### [chrome dev tool fixed position error](https://codepen.io/salzz4u/pen/bpPmXO)

held: fixed div.fixeds | made with: position: fixed

```css
.fixeds { position: fixed; top: 0 }
.why { position: relative }
```

### [position: fixed;](https://codepen.io/seyedi/pen/mPxZYP)

held: fixed nav | on hover of a.: a.: color | made with: position: fixed · :hover

```css
nav { position: fixed; top: 0 }
```

### [Polyfill for CSS, Fixed - WIP](https://codepen.io/Unillu/pen/KVZqZW)

held: sticky p.sticky, sticky p.sticky, sticky p.sticky, sticky p.sticky, sticky p.sticky, sticky p.sticky | made with: position: sticky · position: fixed

```css
p, li { margin-bottom: 5px }
.content { position: relative }
.sticky { position: sticky }
.top .sticky { top: -5px; box-shadow: 0 2px 0 #fff, 0 4px 2px rgba(0, 0, 0, 0.4) }
.left .sticky { box-shadow: 2px 0 0 #fff, 4px 0 2px rgba(0, 0, 0, 0.4) }
.left ul { margin-bottom: 0 }
.no-csspositionsticky .sticky { position: fixed }
.no-csspositionsticky .top .content-contain { position: relative }
.no-csspositionsticky .top .content-contain .content { position: absolute }
.no-csspositionsticky .top .content-contain .content ul { margin-top: 40px }
.no-csspositionsticky .top .content-contain .content:nth-child(2) { top: 205px }
.no-csspositionsticky .top .content-contain .content:nth-child(3) { top: 410px }
```

### [Centering a Fixed Position <div> in CSS](https://codepen.io/merb/pen/LGbXxQ)

held: fixed div.popup_box | on hover of a.button_blue: a.button_blue: background | made with: position: fixed · transition · :hover

```css
.popup_box { position:fixed; top: 50%; -webkit-transform: translate(-50%,-50%); -moz-transform: translate(-50%,-50%); -ms-transform: translate(-50%,-50%); transform: translate(-50%,-50%) }
.pop_up { position:relative }
.button_blue { transition: all .5s; margin-top: 20px }
.button_blue:active { transition: none }
```

### [Fixed overlapping](https://codepen.io/DiegoVillasenor/pen/wMoPdV)

held: fixed div.fixed-content, fixed div.fixed-content | made with: position: fixed

```css
.centro-triple-minus, .centro-double-minus, .centro-minus, .centro-extra { position: relative; top: 40vh }
.fixed-content { position: fixed }
.absolute-positioning { position: absolute }
```

### [Hack for fixed position element has parent that has transform value](https://codepen.io/krozzwu/pen/zvbzxb)

held: fixed header, fixed button, fixed nav, fixed div.fixedEle | made with: position: fixed · transition

```css
button { position: fixed; top: 0 }
.wrapper header { position: fixed; top: 0 }
.wrapper header nav { position: fixed; top: 0; transform: translateX(-360px); transition: 0.3s ease-in-out }
.wrapper header nav.is-opened { transform: translateX(0) }
.wrapper header nav li { margin-bottom: 20px }
.wrapper .content { padding-top: 44px; transition: 0.3s ease-in-out; transform: translateX(0) }
.wrapper .content.is-pushed { transform: translateX(360px) }
.wrapper aside { vertical-align: top }
.fixedEle { position: fixed; top: 80px }
.transform-none { transform: none !important }
```

### [Scrolling fixed position elements](https://codepen.io/SandraArato/pen/PqEoVJ)

made with: position: fixed

```css
button { position: fixed; top: 0; margin-bottom: 2em }
```

### [Fixed position with transform: translate parent](https://codepen.io/isaiahmg/pen/wBxmmP)

made with: nothing recognised — read the code

```css
aside { position: absolute; top: 50%; transform: translate(0px,-50%) }
.fixed { position: absolute; bottom: 0 }
```

### [IE6 FIXED POSITION EXPRESSION](https://codepen.io/soberdash/pen/WbXxmj)

made with: nothing recognised — read the code

### [Fixed Position Images with Scrolling](https://codepen.io/j2made/pen/dPPYvv)

made with: nothing recognised — read the code

```css
.image-bkg { position: relative }
.image-bkg h1 { position: absolute; top: 43% }
.image-3 h1 { top: auto; bottom: 20px }
```

### [Using JQuery to reserve space for fixed elements](https://codepen.io/KristinB/pen/azbGJq)

held: fixed nav.js-fixed, fixed ol.js-fixed | made with: position: fixed

```css
p + p { margin-top: 1em }
nav { position: fixed; top: 0 }
ol { position: fixed }
.placeholder { position: static !important }
```

### [Fixed Position and Width](https://codepen.io/brittneykernan/pen/GRYozq)

held: fixed header | made with: position: fixed

```css
header { position: fixed; top: 30px }
```
