# CodePen · reduced-motion — how each pen does it

6 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/reduced-motion.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| prefers-reduced-motion | 6 |
| @keyframes | 3 |
| transition | 3 |
| :hover | 1 |
| position: fixed | 1 |

## Every pen

### [Prefers reduced motion example](https://codepen.io/perpetual-education/pen/wvmveeo)

on scroll: animated-box.: transform | made with: @keyframes · prefers-reduced-motion

```css
50% { transform: scale(1.2) }
animated-box { animation: .8s wiggle infinite }
@keyframes wiggle animates transform
```

### [Gallery with prefers-reduced-motion](https://codepen.io/michellebarker/pen/PoKwvod)

on hover of li.: img.: transform+top, figcaption.: transform+opacity+top | made with: transition · :hover · prefers-reduced-motion

```css
img { transition: transform 1000ms }
figure { position: relative }
figure::after { position: absolute; top: 50%; opacity: 0; transform: scale(2); transition: opacity 300ms }
figcaption { position: absolute; top: 0; opacity: 0; transition: opacity 600ms, transform 600ms }
a:is(:hover, :focus) figure::after { opacity: 1 }
a:is(:hover, :focus) figcaption { opacity: 1; transition: opacity 600ms }
figcaption { transform: translate3d(0, 2rem, 0) }
figure::after { opacity: 1; transform: scale(0); transition: transform 900ms }
a:is(:hover, :focus) figure::after { transform: scale(2.5) }
a:is(:hover, :focus) figcaption { opacity: 1; transform: translate3d(0, 0, 0); transition: opacity 600ms 400ms, transform 600ms 400ms }
a:is(:hover, :focus) img { transform: scale(1.2) }
```

### [Experiments | Custom Elements & WAAPI](https://codepen.io/blokche/pen/poEagXv)

made with: transition · prefers-reduced-motion

```css
.action { position: absolute; bottom: 0 }
#message:empty { opacity: 0 }
#message { transition: 0.2s linear; opacity: 1 }
#message a { transition: background 0.2s linear }
```

### [Reduced Motion Tester](https://codepen.io/badboy/pen/eavwRg)

on scroll: h1.no-margin: transform+top | on hover of li.: h1.no-margin: transform+top | made with: prefers-reduced-motion

### [Reduced Motion Mixin](https://codepen.io/bloqhead/pen/xepjwy)

held: fixed button.reduce-motion | on scroll: div.content: transform+filter+top ×2 | on hover of button.reduce-motion: div.content: transform+filter+top ×2 | made with: position: fixed · @keyframes · transition · prefers-reduced-motion

```css
#ContentSlug.reduce-motion * { transition: none; -webkit-animation: none; animation: none }
#ContentSlug * { transition: none; -webkit-animation: none; animation: none }
button { position: fixed; top: 10px; text-transform: uppercase }
.content { will-change: transform, filter; -webkit-animation: fun 1s infinite alternate ease-in-out; animation: fun 1s infinite alternate ease-in-out }
.content:nth-of-type(1) { -webkit-animation-delay: 750ms; animation-delay: 750ms }
.content:nth-of-type(2) { -webkit-animation-delay: 1500ms; animation-delay: 1500ms }
.content:nth-of-type(3) { -webkit-animation-delay: 2250ms; animation-delay: 2250ms }
.content:nth-of-type(4) { -webkit-animation-delay: 3000ms; animation-delay: 3000ms }
to { filter: hue-rotate(360deg); transform: scale(1.2) rotate(6deg) }
to { filter: hue-rotate(360deg); transform: scale(1.2) rotate(6deg) }
@keyframes fun animates filter, transform
```

### [Reduce Motion Media Query Example](https://codepen.io/ericwbailey/pen/PWJPrW)

on scroll: div.thingamabob: transform+background+shadow+top | made with: @keyframes · prefers-reduced-motion

```css
25% { box-shadow: 0 0 0 10vh #FCB100 }
75% { box-shadow: 0 0 0 0.25vh #F96700 }
25% { box-shadow: 0 0 0 10vh #FCB100 }
75% { box-shadow: 0 0 0 0.25vh #F96700 }
.thingamabob { position: absolute; top: 50%; transform: translate(-50%, -50%); box-shadow: 0 0 0 0.25vh #DB4700; -webkit-animation-duration: 1.75s; animation-duration: 1.75s; -webkit-animation-fill-mode: both; animation-fill-mode: both }
.thingamabob { -webkit-animation: none; animation: none; box-shadow: none }
@keyframes pulse animates height, width, background-color, border, box-shadow
```
