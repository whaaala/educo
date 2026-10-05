# CodePen · sticky-sidebar — how each pen does it

22 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/sticky-sidebar.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| position: fixed | 12 |
| :hover | 8 |
| position: sticky | 7 |
| transition | 5 |
| scroll() timeline | 5 |
| @keyframes | 4 |
| clip-path | 1 |

## Every pen

### [Your Inspired Page](https://codepen.io/Yvonne-Angelica/pen/WbwYQee)

held: sticky aside.sidebar | on scroll: div.glitch-title: transform+top | on hover of a.: div.glitch-title: transform+top | made with: position: sticky · @keyframes · transition · :hover · clip-path

```css
.header-wrapper { position: relative; transition: filter 0.3s ease }
[data-theme="dark"] .header-wrapper { filter: invert(1) brightness(0.95) contrast(1.1) }
.header-image { will-change: transform; transform: translateZ(0) }
.glitch-title { position: absolute; top: 50%; transform: translate(-50%, -50%); animation: glitchTitle 1s linear infinite; will-change: transform; transform: translateZ(0) }
0% { transform: translate(-50%, -50%) }
2%, 64% { transform: translate(calc(-50% + 2px), -50%) skew(0deg) }
4%, 60% { transform: translate(calc(-50% - 2px), -50%) skew(0deg) }
62% { transform: translate(-50%, -50%) skew(5deg) }
.glitch-title::before, .glitch-title::after { position: absolute; top: 0 }
.glitch-title::before { clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%); animation: glitchTitleTop 1s linear infinite }
2%, 64% { transform: translate(2px, -2px) }
4%, 60% { transform: translate(-2px, 2px) }
```

### [Sticky Sidebar](https://codepen.io/lionschellenberg/pen/VwNpeEw)

held: fixed aside | made with: position: fixed · @keyframes · transition · :hover

```css
aside { position: fixed }
aside svg:hover { transition: 0.5s }
#scroll-down-button { position: absolute; bottom: 2.5vw; animation: example 1.5s infinite }
0% { bottom: 2.5vw }
50% { bottom: 3vw }
100% { bottom: 2.5vw }
#bottomSection { padding-top: 5vw }
@keyframes example animates bottom
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

### [Fixed Sidebar, with Pure CSS](https://codepen.io/abhisheko_o/pen/YzyMVgq)

held: sticky div.left-side | on scroll: span.: transform+opacity+top ×3 | on hover of a.: span.: transform+opacity+top ×3 | made with: position: sticky · @keyframes · :hover

```css
.left-side { position:sticky; top:50px }
.right-side { vertical-align:top }
.right-side div + div { margin-top:50px }
a { position:relative }
a:hover:after { position:absolute; bottom:4px }
.box { position: absolute; top: 150px; transform: translate(-50%, -50%) }
.box span { border-bottom: 2px solid #000; transform: rotate(45deg); animation: animate 2s infinite }
.box span:nth-child(2) { animation-delay: -0.2s }
.box span:nth-child(3) { animation-delay: -0.4s }
0% { opacity: 0; transform: rotate(45deg) translate(-20px, -20px) }
50% { opacity: 1 }
100% { opacity: 0; transform: rotate(45deg) translate(20px, 20px) }
```

### [Fixed Sidebar](https://codepen.io/abhisheko_o/pen/pojQMqO)

on scroll: span.: transform+opacity+top ×3 | on hover of a.: span.: transform+opacity+top ×3 | made with: position: fixed · @keyframes · :hover

```css
.left-side.fixed { position:fixed; top:50px }
.right-side { vertical-align:top }
.right-side div + div { margin-top:50px }
a { position:relative }
a:hover:after { position:absolute; bottom:4px }
.box { position: absolute; top: 150px; transform: translate(-50%, -50%) }
.box span { border-bottom: 2px solid #000; transform: rotate(45deg); animation: animate 2s infinite }
.box span:nth-child(2) { animation-delay: -0.2s }
.box span:nth-child(3) { animation-delay: -0.4s }
0% { opacity: 0; transform: rotate(45deg) translate(-20px, -20px) }
50% { opacity: 1 }
100% { opacity: 0; transform: rotate(45deg) translate(20px, 20px) }
```

### [Simple sticky sidebar using container](https://codepen.io/fishondor/pen/YzyKroQ)

held: fixed ol.sticky-sidebar | made with: position: fixed

```css
.main .sidebar-container { position: relative }
.sidebar-container ol, .content p { margin-bottom: 0 }
```

### [Sticky Sidebar on scroll](https://codepen.io/pardeepchauhan/pen/gObOZVm)

made with: position: fixed · scroll() timeline

```css
div { box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.3) }
#sidebarWrap { position: relative; box-shadow: none }
#sidebar { position: absolute }
#header { margin-bottom: 10px }
#sidebar.fixed { position: fixed; top: 0 }
```

### [CSS Sticky Sidebar](https://codepen.io/florantara/pen/jogxqP)

held: sticky aside.sidebar | made with: position: sticky · transition · :hover

```css
.sidebar { position: sticky; top: 0; padding-top: 0px }
.sidebar { position: static }
.sidebar ul li { margin-bottom: 1em; box-shadow: 0 0 0 rgba(0, 0, 0, 0); transition: box-shadow 200ms linear }
.sidebar ul li:hover { box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1) }
```

### [Scroll Spy / Content Parallax](https://codepen.io/cpandya/pen/WWqqXd)

held: sticky nav.col-sm-3 | on hover of li.: a.: background+color | made with: position: sticky · position: fixed

```css
#myScrollspy { position: sticky; top: 20px }
```

### [Sticky Test I](https://codepen.io/gabydevdev/pen/dLXVbN)

held: sticky div.sidebar | made with: position: sticky

```css
.site-content { margin-top: 3rem; margin-bottom: 3rem }
#primary { position: relative }
.sidebar-area { position: relative }
.sidebar-area .sidebar { position: -webkit-sticky; position: sticky; bottom: 3rem; margin-top: auto }
.site-logo { padding-top: 5px }
.site-header { margin-bottom: 40px }
article { margin-bottom: 80px }
.sidebar-area article { margin-bottom: 0 }
footer { margin-top: 40px }
```

### [jQuery Plugin - tsukiSticky - sticky sidebar/element on scroll](https://codepen.io/sparkspion/pen/LBeYpw)

held: fixed a | made with: position: fixed

```css
section { margin-bottom: 20px }
#footer { position: fixed; bottom: 1.5em; box-shadow: 0px 0px 25px -4px #1A237E }
```

### [Sticky Sidebar Panel](https://codepen.io/asif-shahzad-baloch/pen/rvqOqw)

made with: position: fixed

```css
.white-box { margin-bottom: 30px }
.sticky-panel { position: fixed; top: 50px }
```

### [bootstrap sticky bar](https://codepen.io/Navedkhan012/pen/yKKVJd)

held: fixed div.col-sm-4 | made with: nothing recognised — read the code

### [Dynamic Fix sidebar with jQuery](https://codepen.io/mrseankumar25/pen/jYOqaq)

on hover of a.: header.: background, div.owl-stage: transform | made with: position: fixed · transition · :hover

```css
.createdby { margin-bottom: 30px; margin-top: 30px }
h1, h2, h3, h4, h5, h6 { text-transform: uppercase }
p + h1, ul + h1, ol + h1, p + h2, ul + h2, ol + h2, p + h3, ul + h3, ol + h3, p  { margin-top: 1em }
#header { position: absolute; transition: all .75s ease-in-out }
#header.fixedNav { position: fixed }
.logoContainer h1 { text-transform: none }
.navContainer a { text-transform: uppercase }
.innerContainer { background-position: center }
.icon i { margin-bottom: .5em }
.startNow a { box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.3); margin-top: .5em; transition: .1s ease; vertical-align: top }
.startNow a:hover { box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.3); transform: translate(2px, 2px) }
.content { position: relative }
```

### [CSS Sticky Sidebar](https://codepen.io/onefastsnail/pen/KXOgOY)

held: sticky div.col-xs-5, sticky dt, sticky dt, sticky dt, sticky dt | on hover of a.: a.: color | made with: position: sticky

```css
.c-sidebar { position: -webkit-sticky; position: sticky; top: 1em; bottom: 1em }
.c-description-list dt { position: -webkit-sticky; position: sticky; top: 0 }
.c-description-list + .c-description-list { padding-top: 2em }
.container + .container { margin-top: 1em }
```

### [Sticky Sidebar](https://codepen.io/HanumanSahay/pen/GMopjV)

made with: position: fixed · scroll() timeline

```css
.mainContent { position: relative }
.sidebar.fixed { position: fixed; top: 0 }
```

### [sticky sidebar for squishy and more-complex flex-box layouts](https://codepen.io/sheriffderek/pen/XMXRqo)

made with: position: fixed

```css
body.sticky-sidebar .master aside .widget-list { position: fixed; top: 10px }
.master aside .widget-list .widget:not(:first-of-type) { margin-top: 10px }
```

### [Sticky Sidebar](https://codepen.io/ccurtin/pen/MjLrMd)

made with: position: fixed

```css
.wrapper { position: relative }
.header { border-bottom: 1px solid #CCC }
.header h1, .footer h1 { padding-top: 50px }
.sidebar { position: relative }
.sidebar:not(.sticky) { top:0 }
.sidebar.sticky { position: absolute }
.sidebar.sticky.stickyBottom { position: absolute }
```

### [Sticky Kit Implementaion](https://codepen.io/frensuren/pen/vXBKzo)

made with: nothing recognised — read the code

```css
.sidebar { padding-top: 40px; padding-bottom: 40px; position: static }
.main { position: static }
```

### [sticky sidebar](https://codepen.io/derwinsadiwa/pen/vNpKVr)

made with: position: fixed · transition · :hover

```css
nav ul li a:link, nav ul li a:visited { transition: color 0.15s linear }
#sidebar.sticky { position: fixed; top: 20px }
```

### [jQuery Sticky Sidebar](https://codepen.io/perminder-klair/pen/wvqEBM)

made with: scroll() timeline

```css
.container { position: relative }
.header { margin-bottom: 10px }
.footer { margin-top: 10px }
```

### [Sticky Sidebar](https://codepen.io/cheryllaird/pen/nQZEvx)

made with: scroll() timeline

```css
.sticky { position: relative; top: 0 }
```
