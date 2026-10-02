# CodePen · position-sticky — how each pen does it

12 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/position-sticky.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| position: sticky | 9 |
| position: fixed | 5 |
| :hover | 3 |
| transition | 2 |
| :has() | 1 |
| prefers-reduced-motion | 1 |
| scroll listener | 1 |

## Every pen

### [Sticky stackable headers with variable height](https://codepen.io/casperbrike/pen/mydpPeq)

held: sticky h2, sticky h2, sticky h2, sticky h2, sticky h2 | made with: position: sticky

```css
h2 { position: sticky; top: 0 }
p { padding-top: 1rem }
.wrapper { margin-bottom: 1rem }
```

### [Demo, css fixed position and transform](https://codepen.io/jonathanzuniga/pen/abRXyrm)

held: fixed div.fixed | made with: position: fixed

```css
.topbar { transform: translateY(10px) }
.fixed { position: fixed; top: 0 }
```

### [Position-Sticky Enables Button Magic](https://codepen.io/jggeorge/pen/zYmwXZj)

held: sticky p.hello | made with: position: sticky

```css
.hello { margin-top: 3rem; position: sticky; bottom: 0px }
```

### [position sticky & fixed bootstrap 5.3](https://codepen.io/maulwys/pen/YzJZbzG)

held: fixed div.fixed-bottom, fixed div.fixed-top, sticky div.sticky-top, sticky div.sticky-bottom | made with: position: fixed

### [Sticky Header](https://codepen.io/tamas100/pen/YzJKzOX)

held: sticky header.item--menu | made with: position: sticky · :hover

```css
.container { position: relative }
.item { top: 100px }
.item--menu { position: sticky; top: 0px }
.close { position: absolute; top: 15px }
.close:hover { box-shadow: 4px 4px 10px rgba(0, 55, 0, 0.6) }
```

### [Sticky Notes](https://codepen.io/rahulbaran/pen/qBydPjj)

held: sticky main.container, sticky section.container, sticky section.container, sticky section.container, fixed button.btn | made with: position: sticky · position: fixed · :hover · :has() · prefers-reduced-motion

```css
.container { --top: 0; position: sticky; top: var(--top); padding-top: calc(0.5em * 2); padding-bottom: calc(0.5em * 2); padding-top: calc(var(--base-padding) * 2); padding-bottom: calc(var(--base-padding) * 2) }
.container[\:has\(.first-note\)] > * { rotate: z -1.5deg }
.container:has(.first-note) > * { rotate: z -1.5deg }
.container[\:has\(.second-note\)] { --top: 4em }
.container:has(.second-note) { --top: 4em }
.container[\:has\(.second-note\)] > :only-child { rotate: z 1.5deg }
.container:has(.second-note) > :only-child { rotate: z 1.5deg }
.container[\:has\(.third-note\)] { --top: 8em }
.container:has(.third-note) { --top: 8em }
.container[\:has\(.third-note\)] > :first-child { rotate: z -4deg }
.container:has(.third-note) > :first-child { rotate: z -4deg }
.container[\:has\(.fourth-note\)] { --top: 12em }
```

### [Scroll Sticky Navbar React](https://codepen.io/chriiss/pen/MWGypaG)

made with: position: fixed · transition · scroll listener

```css
nav { box-shadow: -1px 12px 17px 1px var(--primary_color) }
.active { position: fixed; top: 0; transition: all .5s ease-in-out }
.text { margin-top: 70px }
.text p { margin-top: 20px }
```

```js
addEventListener('scroll', handleScroll)
```

### [Page concept with sticky image sections](https://codepen.io/mperetto/pen/LYygGWV)

held: sticky div.media, sticky div.media | made with: position: sticky

```css
.header, footer { text-transform: uppercase; background-position: center center }
.header h1, .footer h4 { opacity: 0.7 }
.media { position: sticky; top: 0 }
.media { position: relative }
```

### [A Sticky Stack of Photos CSS only](https://codepen.io/BlogFire/pen/PoGMjaX)

held: sticky div.photos, sticky div.photos, sticky div.photos, sticky div.photos, sticky div.photos | made with: position: sticky

```css
.photos { margin-top: 18vh }
.photos { position: sticky }
.photos img { box-shadow: 0 0 40px 5px rgba(0, 0, 102, 0.5) }
.one { top: 8em; transform: rotate(-2deg) }
.two { top: 9em; transform: rotate(3deg) }
.three { top: 10em; transform: rotate(-5deg) }
.four { top: 11em; transform: rotate(5deg) }
.five { top: 12em; transform: rotate(-7deg) }
.wrapper { position: relative; padding-bottom: 120vh }
```

### [Positon Property CSS](https://codepen.io/ManthanLaad/pen/WNxVpZW)

held: sticky nav, fixed div.it3, sticky div.it4 | made with: position: sticky · position: fixed

```css
.welcome { padding-bottom:0; margin-bottom:0 }
.box { position: relative }
.it1 { position: relative; top:200px }
.it2 { position: absolute; top:0 }
.it3 { position:fixed; top:50%; transform : translateY(-50%) }
.it4 { position: sticky; top:0 }
nav { position: sticky; top:0 }
```

### [PURE modern HTML + CSS Storytelling Web Design _ Tribute Project __ Dr. Norman Borlaug / FreeCodeCamp](https://codepen.io/skalar/pen/jOqgqOQ)

held: sticky header, sticky div.life_mask-div, sticky h2.title, sticky figure.life_img-div, sticky div.tile_div, sticky h2.title, sticky p.quiz_desc | made with: position: sticky · transition · :hover

```css
* { transition: .3s ease-in-out }
h1, h2, h3 { margin-bottom:1em; text-transform:uppercase }
::before, ::after { top:0; bottom:0 }
::before { position:absolute }
::after { position:relative }
.sr-only { position:absolute; opacity:.01 }
.mirror { transform:rotateY(180deg) }
.display_block { margin-bottom:15px }
header { margin-top:15px; padding-top:15px; position:sticky; top:0 }
footer { border-top: 1px solid rgba(255,255,255,.2) }
.logo_div svg { transform:rotate(-54deg) }
.section-grid { margin-bottom:100px }
```

### [position sticky bottom](https://codepen.io/myjessijess/pen/NWqQKoJ)

held: sticky footer.footer | made with: position: sticky

```css
.footer { position: sticky; bottom: 0 }
```
