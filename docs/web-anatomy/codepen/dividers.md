# CodePen · dividers — how each pen does it

11 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/dividers.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| clip-path | 1 |

## Every pen

### [Grid dividers/rulers.](https://codepen.io/cbolson/pen/ExBGzeV)

made with: clip-path

```css
.grid-with-divider-lines { clip-path:inset(var(--divider-lines-width)) }
.grid-with-divider-lines > .card { position: relative }
.grid-with-divider-lines > .card:after { position: absolute; top: 0; bottom: calc(var(--divider-lines-width) / 2 * -1); border-bottom: var(--divider-lines) }
```

### [CSS Grid divider lines (with outer border)](https://codepen.io/cbolson/pen/qBzLGoN)

made with: nothing recognised — read the code

```css
.grid-with-divider-lines { border-top: var(--divider-lines) }
.grid-with-divider-lines > .card { border-bottom: var(--divider-lines) }
body::after { position: absolute; top: 1rem }
```

### [Dividers](https://codepen.io/adacggcw-the-styleful/pen/eYbJGEE)

made with: nothing recognised — read the code

```css
.primary { box-shadow: var(--Btn-shadow) }
.secondary { box-shadow: var(--Btn-shadow) }
```

### [Dividers](https://codepen.io/a7rarpress/pen/xxyyqRr)

made with: nothing recognised — read the code

### [Hide separators/dividers when text wraps without media queries](https://codepen.io/mandymichael/pen/rgagME)

made with: nothing recognised — read the code

```css
.item2 { transform: translateX(-10px); position: relative }
.item2::before { position: absolute; top: 0 }
```

### [Gradient-based divider](https://codepen.io/sunpatrick/pen/QKpywK)

made with: nothing recognised — read the code

```css
.divider .right { background-position: 0% 0%, 0% 100% }
.divider .left { background-position: 0% 0%, 0% 100% }
```

### [Easy Section Dividers](https://codepen.io/mattgrosswork/pen/PZebbp)

made with: nothing recognised — read the code

```css
div { position: relative }
div:before, div:after { position: absolute }
div:before { top: 0; border-top: 20px solid #fff; border-bottom: 30px solid transparent }
div:after { bottom: 0; border-bottom: 20px solid #fff; border-top: 60px solid transparent }
div { position: relative }
```

### [HR / Divider style 1](https://codepen.io/martinxo/pen/waLvmL)

made with: nothing recognised — read the code

```css
hr.style-eight { border-top: medium double #A0A4BD }
hr.style-eight:after { position: relative; top: -0.7em }
```

### [Dividers](https://codepen.io/ramonmcros/pen/KpEbaR)

made with: nothing recognised — read the code

```css
.one { box-shadow: 0 1px black, 0 3px white, 0 7px black }
.two { box-shadow: 0 4px black, 0 6px white, 0 7px black }
.three { box-shadow: 0 3px black, 0 5px white, 0 6px black, 0 8px white, 0 11px black }
.four { box-shadow: 0 1px black, 0 4px white, 0 7px black, 0 10px white, 0 11px black }
div { margin-top: 100px }
.five { box-shadow: 1px 0 black, 3px 0 white, 7px 0 black }
.six { box-shadow: 4px 0 black, 6px 0 white, 7px 0 black }
.seven { box-shadow: 3px 0 black, 5px 0 white, 6px 0 black, 8px 0 white, 11px 0 black }
.eight { box-shadow: 1px 0 black, 4px 0 white, 7px 0 black, 10px 0 white, 11px 0 black }
```

### [Separators](https://codepen.io/specoff/pen/wBLLBg)

made with: nothing recognised — read the code

```css
.breads { margin-bottom: 5px }
.breadcrumb li a { position: relative; border-bottom: 0 }
.breadcrumb li a:before { border-top: 50px solid transparent; border-bottom: 50px solid transparent; position: absolute; top: 50%; margin-top: -50px }
.breadcrumb li a:after { border-top: 50px solid transparent; border-bottom: 50px solid transparent; position: absolute; top: 50%; margin-top: -50px }
```

### [Ionic list with dividers](https://codepen.io/brandyshea/pen/gbZrNQ)

on scroll: div.scroll: transform+top, div.scroll-bar-indicator: transform+opacity+top | made with: nothing recognised — read the code

```css
.button.button-icon.input-button { position: absolute; top: 5px }
.item img { margin-top: 20px }
.my-item.item { padding-top: 0; padding-bottom: 0 }
```
