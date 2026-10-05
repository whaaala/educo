# CodePen · dialog — how each pen does it

484 pens, each opened, run and read (`cp-tag.js`); written by `cp-how.js` from the pen's own code and what it did when scrolled and hovered. The full code is in `raw/dialog.json`.

## Techniques, most used first

| Technique | Pens |
|---|---|
| :hover | 201 |
| <dialog> | 198 |
| transition | 190 |
| position: fixed | 159 |
| @keyframes | 102 |
| backdrop-filter | 51 |
| :focus-visible | 15 |
| @starting-style | 15 |
| popover | 14 |
| 3D (perspective / preserve-3d) | 11 |
| :has() | 10 |
| position: sticky | 10 |
| requestAnimationFrame | 10 |
| prefers-reduced-motion | 9 |
| Web Animations API (.animate) | 8 |
| clip-path | 5 |
| pointer / mouse tracking | 3 |
| custom properties driven by JS | 3 |
| GSAP | 3 |
| canvas 2D | 3 |
| mask | 2 |
| scroll() timeline | 2 |
| mix-blend-mode | 1 |
| view() timeline | 1 |
| scroll-snap | 1 |
| IntersectionObserver | 1 |
| scroll listener | 1 |

## Every pen

### [react-modal-port • Animation Examples](https://codepen.io/editor/oliverwehn/pen/01a0fb4d-2c07-7c34-af66-1ac02a634b22)

made with: position: fixed · @keyframes · :focus-visible · :has() · prefers-reduced-motion · <dialog> · Web Animations API (.animate)

```css
.lead { margin-bottom: 2rem }
.links a { text-underline-offset: 0.2em }
button:focus-visible { outline-offset: 2px }
.scrim { position: absolute; top: 0; bottom: 0; animation: fade-in 340ms ease-out both; animation: fade-in var(--enter) ease-out both }
.stack-badge { position: fixed; top: 1rem }
.modal .actions { margin-top: 1.25rem }
.frame { position: relative }
.modal, .ghost { box-shadow: 0 1.5rem 3rem rgba(0, 0, 0, 0.25) }
.ghost { transform: translateY(var(--y)) scale(var(--s)); filter: brightness(var(--b)) }
.frame[data-motion="pop"][data-enter="forward"] > .modal { animation: push-in 340ms cubic-bezier(0.2, 0.9, 0.3, 1.15) both; animation: push-in var(--enter) var(--ease-out) both }
.frame[data-motion="pop"][data-enter="forward"] > .ghost { animation: deepen 340ms cubic-bezier(0.2, 0.8, 0.2, 1) both; animation: deepen var(--enter) var(--ease-slide) both }
.frame[data-motion="pop"][data-enter="back"] > .modal { animation: reveal 340ms cubic-bezier(0.2, 0.8, 0.2, 1) both; animation: reveal var(--enter) var(--ease-slide) both }
```

```js
.animate([{ opacity: 1 }, { opacity: 0 }], timing))
```

### [Custom Select via Dialog](https://codepen.io/editor/iammindless/pen/01a0d06a-1d63-78fe-a487-60e7d3cc487f)

held: sticky div.row-header, sticky div.row-header, sticky div.row-header | on hover of button.: button.: color, svg.[object: color, use.[object: color | made with: position: sticky · :hover · :focus-visible · :has() · <dialog>

```css
.field-group + .field-group { margin-top: 0.5rem }
button:focus-visible { outline-offset: -2px }
> input { margin-top: 0.5rem }
&:nth-child(1 of .row:not(.hidden)) { margin-top: 0 }
```

### [NixA11yCenter — WCAG 2.2 AAA Preference Modal Engine](https://codepen.io/editor/wptechnix/pen/01a07b03-581c-74dd-be61-e9577646322f)

made with: @keyframes · transition · :hover · :focus-visible · :has() · backdrop-filter · <dialog>

```css
.nix-a11y-dialog::backdrop { backdrop-filter: blur(0.5rem); -webkit-backdrop-filter: blur(0.5rem); animation: dialogFade 0.25s ease }
.nix-a11y-dialog[open] { animation: dialogScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) }
from { opacity: 0 }
to { opacity: 1 }
from { opacity: 0; transform: scale(0.96) }
to { opacity: 1; transform: scale(1) }
.nix-dialog-shell { box-shadow: 0 1.5625rem 3.75rem -0.9375rem rgba(0, 0, 0, 0.7) }
.nix-dialog-badge { text-transform: uppercase }
.nix-legend { text-transform: uppercase }
.nix-card-choice { position: relative }
.nix-card-choice .nix-choice-input { position: absolute; opacity: 0 }
.nix-card-choice .nix-choice-content { transition: all 0.2s ease }
```

### [Data Ownership v5 — 資料使用權限面板](https://codepen.io/dmaublmf-the-encoder/pen/JoWjyXW)

held: sticky header.dialog__header | made with: position: sticky · :hover · :focus-visible · backdrop-filter · <dialog>

```css
button:focus-visible, textarea:focus-visible, input:focus-visible, summary:focus { outline-offset: 3px }
.demo-intro { margin-bottom: 1.25rem }
.eyebrow { text-transform: uppercase }
.chat { box-shadow: 0 22px 60px rgba(26, 41, 71, .13) }
.chat__header { border-bottom: 1px solid var(--line) }
.button[aria-disabled="true"] { opacity: .62 }
.demo-controls { margin-top: 1rem }
.control-status { margin-bottom: 0 }
.ownership-dialog { box-shadow: 0 28px 90px rgba(5, 16, 38, .32) }
.ownership-dialog::backdrop { backdrop-filter: blur(2px) }
.dialog__header { position: sticky; top: 0; border-bottom: 1px solid var(--line) }
.choice small { margin-top: .22rem }
```

### [Pure CSS/HTML dialog with transition in AND out animations](https://codepen.io/ndne/pen/YPNgRgK)

on scroll: label.button: background+color+shadow, i.icon: color | made with: transition · :hover

```css
#dialog { position: absolute; top: 0; transition: visibility 0s linear 0.5s,opacity 0.5s linear; opacity: 0 }
.dialog_state { opacity: 0 }
.dialog_state:checked + #dialog, #dialog.dialog_open { opacity: 1 }
#dlg-back { position: absolute; top: 0 }
.dialog_state:checked + #dialog #dlg-wrap { opacity: 1 }
#dlg-wrap { position: relative; top: 50%; transform: translateY(-50%); box-shadow: 1px 1px 6px rgba(0,0,0,0.3); opacity: 0; padding-top: 0; padding-bottom: 0; transition: all .5s }
#dlg-close { position: absolute; top: 0 }
h2#dlg-header { text-transform: initial }
.main_area { transition: 500ms all 300ms ease-out }
.dialog_state:checked ~ .main_area, .main_area.dialog_open { filter: blur(6px); transform: scale(1.1) }
&:hover { box-shadow: 0 1px 1px rgba(0,0,0,0.05) }
.center { position: absolute; top: 50%; transform: translateY(-50%) }
```

### [<dialog>](https://codepen.io/editor/zerosonesfun/pen/019fe3bb-646e-77d0-81cd-ff63f991dbdd)

held: fixed div | made with: popover · <dialog>

### [anchor with dialog failing positioning](https://codepen.io/editor/ninetails/pen/019f95c2-8fef-7ae4-87fc-c09284df013e)

made with: :hover · <dialog>

```css
dialog { position: absolute; top: 50%; transform: translateX(-50%) translateY(-50%) }
.close { position: absolute; position-area: right top }
```

### [Fading Dialog](https://codepen.io/weaponsforge/pen/ogBdNxM)

made with: @starting-style · transition · :hover · prefers-reduced-motion · <dialog>

```css
dialog { opacity: 0; scale: 0.8; transition: opacity 400ms ease, scale 400ms ease, display 400ms allow-discrete, overlay 400ms allow-discrete }
@starting-style { opacity: 0; scale: 0.8 }
dialog::backdrop { opacity: 0; transition: opacity 400ms ease, scale 400ms ease, display 400ms allow-discrete, overlay 400ms allow-discrete }
@starting-style { opacity: 0 }
```

### [Modal Dialog](https://codepen.io/mzorn/pen/RNKMopy)

made with: position: fixed · transition · :hover · :focus-visible · prefers-reduced-motion · backdrop-filter

```css
.btn { transition: transform .18s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease }
.btn:focus-visible { outline-offset: 2px }
.btn--primary:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(124,140,255,.35) }
.btn--primary:active { transform: translateY(0) }
.backdrop { position: fixed; inset: 0; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); opacity: 0; transition: opacity .3s ease }
.backdrop.is-open { opacity: 1 }
.modal { position: fixed; inset: 0 }
.modal__card { position: relative; box-shadow: 0 30px 80px rgba(0,0,0,.55); opacity: 0; transform: scale(.94) translateY(10px); transition: opacity .3s ease, transform .35s cubic-bezier(.2,.9,.2,1) }
.modal.is-open .modal__card { opacity: 1; transform: scale(1) translateY(0) }
.modal__x { position: absolute; top: 1rem; transition: transform .18s ease, background .2s ease }
.modal__x:hover { transform: rotate(90deg) }
.modal__x:focus-visible { outline-offset: 2px }
```

### [Modals w/ Popover and Invoker API](https://codepen.io/mejiaj/pen/bNgaRPM)

held: fixed dialog | made with: popover · <dialog>

### [Semantic, dynamic dialog without JavaScript, powered by modern HTML and browser APIs](https://codepen.io/editor/andreruffert/pen/019e9869-9d5d-7d95-9125-ae04b0d2158a)

made with: @starting-style · transition · <dialog>

```css
@starting-style { opacity: 0; transform: scale(0.95) }
&::backdrop { transition: 150ms ease allow-discrete }
```

### [Modale à rendre accessible](https://codepen.io/christ-le-veaux/pen/KwNXOvx)

made with: position: fixed · transition

```css
.c-dialog { position: fixed; top: 0; bottom: 0; transition: 0.2s }
.c-dialog[aria-hidden="true"] { opacity: 0 }
```

### [Native HTML Dialog Modal with Dark Gray UI (Click Outside to Close)](https://codepen.io/SyntaxSidekick/pen/MYbvRNw)

on hover of button.: button.: background | made with: @keyframes · transition · :hover · backdrop-filter · <dialog>

```css
button { transition: background 0.2s ease, transform 0.1s ease }
button:active { transform: scale(0.98) }
dialog { box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7); animation: fadeIn 0.18s ease-out }
dialog::backdrop { backdrop-filter: blur(6px) }
from { opacity: 0; transform: translateY(6px) scale(0.98) }
to { opacity: 1; transform: translateY(0) scale(1) }
@keyframes fadeIn animates opacity, transform
```

### [Animated, accessible Modals without JS](https://codepen.io/editor/donnyburnside/pen/019dfebd-3f6e-7a18-a3c3-be31ddf686ca)

held: fixed dialog | made with: position: fixed · @starting-style · transition · backdrop-filter · popover · <dialog>

```css
#mymodal { position: fixed; inset: 0; opacity: 0; transform: scaleX(0); transition: opacity 0.7s, transform 0.7s, overlay 0.7s allow-discrete, display 0.7s allow-discrete }
#mymodal::backdrop { opacity: 0; backdrop-filter: blur(0px); transition: opacity 0.7s, backdrop-filter 0.7s }
@starting-style { opacity: 0; transform: scaleX(0) }
@starting-style { opacity: 0; backdrop-filter: blur(0px) }
```

### [Resizable browser lightbox overlay.](https://codepen.io/tomhermans/pen/yyadVXL)

made with: transition · :hover · <dialog> · requestAnimationFrame

```css
.screenshot-trigger { transition: border-color 0.2s }
.browser-shot { position: relative }
.browser-shot-content { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); position: relative }
.browser-shot .viewport { position: relative }
.browser-shot .image { position: relative }
.browser-shot .caption { margin-top: 1em }
#screenshot-dialog { opacity: 0; transition: opacity 0.2s ease-out }
#screenshot-dialog[open], #screenshot-dialog[data-visible] { opacity: 1 }
#dialog-image { opacity: 0; transition: opacity 0.2s ease-out 0.8s }
#screenshot-dialog[open] #dialog-image, #screenshot-dialog[data-visible] #dialog { opacity: 1 }
.dialog-header { border-bottom: 1px solid #eee }
```

```js
requestAnimationFrame(() => {
```

### [Interactive Modal Dialog](https://codepen.io/A-The-Dev/pen/JoKqEpr)

held: fixed div.modal-overlay | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · pointer / mouse tracking · requestAnimationFrame

```css
h1 { margin-bottom: 0.5rem }
.subtitle { margin-bottom: 3rem }
.button-grid { margin-top: 2rem }
.demo-btn { backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%); transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 8px 32px 0 rgba(102, 126, 234, 0.2), 0 1px 2px 0 rgba( }
.demo-btn::before { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: width 0.6s ease, height 0.6s ease }
.demo-btn:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 40px 0 rgba(102, 126, 234, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.6) }
.demo-btn:active { transform: translateY(-2px) scale(0.98) }
0% { background-position: 0% 50% }
50% { background-position: 100% 50% }
100% { background-position: 0% 50% }
.modal-overlay { position: fixed; inset: 0; backdrop-filter: blur(4px); opacity: 0; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) }
.modal-overlay.active { opacity: 1 }
```

```js
addEventListener('mousemove', (e) => {
requestAnimationFrame(updateMoodEffects)
```

### [Dialog Explanation](https://codepen.io/codePen234999/pen/azZjaOy)

made with: transition · :hover · <dialog>

```css
.container { box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.3) }
button { transition: background-color 0.2s ease-in-out }
.dialog { position: relative; box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.3) }
#close-btn { position: absolute; top: 0 }
.dialog-title { margin-bottom: 2px; margin-top: 2px }
.hidden-text { transition: background-color 0.2s ease-in-out }
```

### [Dialog](https://codepen.io/codePen234999/pen/XJKqyYg)

made with: transition · :hover · <dialog>

```css
button { transition: 0.2s ease-in-out }
.dialog { box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3) }
.dialog-title { margin-bottom: 10px; margin-top: 5px }
```

### [no-js basic bootstrap modal component](https://codepen.io/patrickliu/pen/pvbVNBz)

on hover of button.btn: button.btn: background | made with: @starting-style · transition · popover · <dialog>

```css
dialog.modal-dialog { --bs-modal-box-shadow: var(--bs-box-shadow-sm); box-shadow: var(--bs-modal-box-shadow); transform: translateY(-50px); opacity: 0 }
dialog.modal-dialog::backdrop { transition: background-color 0.3s ease }
dialog.modal-dialog:popover-open { transform: translateY(0); opacity: 1 }
dialog.modal-dialog:popover-open { transform: translateY(-50px); opacity: 0 }
```

### [dialog sample](https://codepen.io/higashiyuto/pen/wBWqGgo)

made with: <dialog>

```css
dialog { box-shadow: 0 4px 12px rgba(0,0,0,0.15) }
.actions { margin-top: 20px }
```

### [React Modal (dialog)](https://codepen.io/Giorgi_Mskhiladze/pen/KwMVybL)

on hover of button.btn: button.btn: transform+top | made with: @keyframes · transition · :hover · :focus-visible · :has() · prefers-reduced-motion · <dialog>

```css
.btn { transition: transform 0.15s ease, box-shadow 0.15s ease }
.btn:hover { transform: translateY(-1px) }
.btn:active { transform: translateY(0) }
.btn:focus-visible { outline-offset: 2px }
.modal { box-shadow: 0 20px 40px rgb(0 0 0 / 0.2); animation: modal-out 0.25s ease forwards }
.modal[open] { animation: modal-in 0.25s ease forwards }
from { opacity: 0; transform: translateY(1rem) scale(0.95) }
to { opacity: 1; transform: none }
from { opacity: 1 }
to { opacity: 0 }
.modal { animation: none }
@keyframes modal-in animates opacity, transform
```

### [Dialog vs Popover — Native HTML Modal Patterns](https://codepen.io/millisabel/pen/vEKBdYJ)

made with: position: fixed · @keyframes · transition · :hover · :focus-visible · backdrop-filter · popover · <dialog>

```css
:root { --filter: blur(16px) saturate(135%) }
body { position: relative }
body::before { position: fixed; inset: -20%; filter: blur(0px); animation: background-breathe 20s ease-in-out infinite, background-flow 26s ease-in-out infinite }
0%, 100% { filter: saturate(100%) }
50% { filter: saturate(150%) }
0% { transform: translate(0, 0) scale(1) }
25% { transform: translate(-15%, -15%) scale(1.5) }
50% { transform: translate(0, 0) scale(1) }
75% { transform: translate(15%, 15%) scale(2) }
100% { transform: translate(0, 0) scale(1) }
h1 { margin-bottom: 2rem }
.modal { position: relative; box-shadow: 0 26px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06); backdrop-filter: var(--filter); -webkit-backdrop-filter: var(--filter) }
```

### [HTML ColorPicker & Dialog](https://codepen.io/ardonjr/pen/pvyVEVb)

made with: <dialog>

### [CSS-only Dialog animation](https://codepen.io/claudialn/pen/xbVGZgg)

made with: @starting-style · transition · :has() · backdrop-filter · <dialog>

```css
.dialog_content { backdrop-filter: blur(4px) }
@starting-style { translate: 0 100vh }
&:not([open]) { translate: 0 100vh }
@starting-style { backdrop-filter: blur(0) }
```

### [Animated <dialog> element with Input Validation](https://codepen.io/Ilham-bouk/pen/bNpbPpj)

held: fixed div | on scroll: button.: transform+shadow+top | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · <dialog>

```css
button { transition: all 0.2s ease; position: relative }
button:active { transform: scale(0.9) }
button::before { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: width 0.6s, height 0.6s }
#open { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); transition: all 0.3s ease }
#open:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3) }
#message { position: fixed; top: 25px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); animation: slideInRight 0.4s ease-out }
from { opacity: 0; transform: translateX(100px) }
to { opacity: 1; transform: translateX(0) }
dialog { box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); animation: slideIn 0.3s ease-out }
from { opacity: 0; transform: translateY(-20px) }
to { opacity: 1; transform: translateY(0) }
dialog::backdrop { backdrop-filter: blur(4px); animation: fadeIn 0.3s ease-out }
```

### [Modern <dialog> with Backdrop Effect](https://codepen.io/Ilham-bouk/pen/YPwmoYL)

on hover of button.: button.: transform+background+shadow+top | made with: @keyframes · transition · :hover · backdrop-filter · <dialog>

```css
main { box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2) }
main h1 { margin-bottom: 10px }
main p { margin-bottom: 25px }
button { transition: all 0.3s ease; position: relative }
button::before { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: width 0.6s, height 0.6s }
button:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(28, 124, 86, 0.3) }
button:disabled { transform: none; box-shadow: none }
dialog { box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); animation: slideIn 0.3s ease-out }
from { opacity: 0; transform: translateY(-20px) scale(0.95) }
to { opacity: 1; transform: translateY(0) scale(1) }
dialog::backdrop { backdrop-filter: blur(10px) }
.dialog-content .btn { padding-top: 30px }
```

### [Dynamic <dialog> element Styling with JavaScript Classes](https://codepen.io/Ilham-bouk/pen/LEGwYZO)

on scroll: button.: background | made with: transition · :hover · <dialog>

```css
button { transition: 0.5s }
dialog { transition: 0.5s }
.warning { box-shadow: 0 0 20px rgba(255, 193, 7, 0.6) }
```

### [Simple HTML <dialog> Modal](https://codepen.io/Ilham-bouk/pen/emJaqao)

made with: transition · :hover · backdrop-filter · <dialog>

```css
button { transition: 0.5s }
dialog { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) }
dialog::backdrop { backdrop-filter: blur(4px) }
h2 { border-bottom: 2px solid #eee; margin-bottom: 20px }
```

### [Complete modal and dialog window - Javascrit Vanilla](https://codepen.io/marcusagm/pen/zxrmwvy)

held: fixed div.modal-container, fixed div.modal__backdrop | on hover of button.demo-button: button.demo-button: background | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · requestAnimationFrame

```css
.modal-container { position: fixed; top: 0 }
.modal__backdrop { position: fixed; top: 0; opacity: 0; transition: opacity var(--modal-transition-duration) ease-out }
.modal__backdrop--blur { backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px) }
.modal-container--is-open .modal__backdrop { opacity: 1 }
.modal { position: absolute; box-shadow: var(--modal-shadow); opacity: 0; transition: opacity var(--modal-transition-duration) ease-out, transform var(--modal-transition-duration) ease-out }
.modal--is-visible { opacity: 1 }
.modal--is-hidden { opacity: 0 }
.modal--is-leaving { opacity: 0 }
.modal--position-center { top: 50% }
.modal--position-center.modal--is-visible { transform: translate(-50%, -50%) scale(1) }
.modal--position-center.modal--is-leaving { transform: translate(-50%, -50%) scale(0.95) }
.modal--position-right { top: 0; transform: translateX(100%) }
```

```js
requestAnimationFrame(() => {
```

### [React Modal](https://codepen.io/adiadila123/pen/ZYQMMvv)

made with: position: fixed · @keyframes

```css
.btn:focus { outline-offset:2px }
.backdrop { position:fixed; inset:0; animation: fade .12s ease }
from { opacity:0 }
to { opacity:1 }
.modal { box-shadow:0 30px 120px rgba(0,0,0,.7); animation: pop .16s ease }
from { transform:translateY(6px) scale(.98); opacity:0 }
to { transform:translateY(0) scale(1); opacity:1 }
@keyframes fade animates opacity
@keyframes pop animates transform, opacity
```

### [Dialog with fixed close button](https://codepen.io/flostrasser/pen/QwyVBPj)

made with: @starting-style · transition · :hover · :focus-visible · :has() · backdrop-filter · <dialog>

```css
.close-container { position: absolute; top: 0 }
.dialog-footer { border-top: 1px solid lightgrey }
&::backdrop { backdrop-filter: var(--backdrop-filter) }
&:open { opacity: 1; scale: 1 }
&:open { opacity: 0; scale: var(--scale-start) }
&::backdrop { backdrop-filter: blur(0); transition: display var(--transition-duration) allow-discrete, overlay var(--transition-duration) allow-discrete, background-color var(--transition-duration), backdrop-filter var(--transition-du }
&:open::backdrop { backdrop-filter: var(--backdrop-filter) }
&:open::backdrop { backdrop-filter: blur(0) }
&:focus, &:focus-visible { outline-offset: 0.2rem }
```

### [dialog show/close Vs showModal](https://codepen.io/gc-nomade/pen/yyYZQGX)

held: fixed dialog.modal | made with: position: fixed · backdrop-filter · <dialog>

```css
.modal { position: fixed; inset: 0 }
.notification { position: absolute; top: 0 }
.modal[open] .modal-content::after { position: fixed; inset: 0; -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px) }
```

### [simple modal](https://codepen.io/megan-durham/pen/JoYbKmm)

made with: nothing recognised — read the code

```css
#openModal { position: absolute; top: 50%; transform: translate(-37.5px, -12.5px) }
.modal { position: absolute; top: calc(50% - 15em); box-shadow: 0 0 5px var(--accent2), inset 0 0 5px var(--accent2) }
.topbar { position: absolute }
.topbar:after { position: absolute }
.header { position: absolute }
.closebtn { position: absolute; top: 0.2em }
.content { position: absolute; top: 1.7em }
```

### [Dialog closedBy](https://codepen.io/akhmadullin/pen/wBKwjEr)

made with: <dialog>

### [Non-modal dialog closedBy](https://codepen.io/akhmadullin/pen/vENBjRL)

made with: <dialog>

```css
dialog { bottom: 20px }
```

### [Modal dialog closedBy](https://codepen.io/akhmadullin/pen/ogjvjJV)

made with: <dialog>

### [Dialog1](https://codepen.io/brunnock/pen/jEOKVQz)

made with: <dialog>

### [Odin-Etch-A-Sketch](https://codepen.io/chezseashell/pen/LEYmGgq)

on scroll: div.grid-item: background+top | on hover of button.: button.: background | made with: @keyframes · transition · :hover · <dialog>

```css
h1 { margin-top: 3vh }
#showPrompt { box-shadow: 5px 5px lightgreen; margin-top: 3vh; text-transform: uppercase }
#container { margin-top: 5vh }
.dialog[open] { animation: popup_open_animation .2s normal forwards }
.dialog.close { animation: popup_close_animation .2s normal forwards }
.dialog.close::backdrop { animation: popup_close_backdrop_animation .5s normal forwards }
.dialog_close { transform: scale(2.5); transition: opacity 0.5s }
.dialog_close:hover { opacity:0.7 }
.dialog_content { align-content: bottom }
.dialog i { top: 10%; animation-name: blink; animation-duration: 800ms; animation-iteration-count: infinite; opacity: 1 }
from { opacity: 1 }
to { opacity: 0 }
```

### [Lyoko dialog](https://codepen.io/Pigamer37/pen/gbOWNWx)

made with: @keyframes · transition · prefers-reduced-motion · <dialog>

```css
& * { opacity:0 }
& .dlg-content { box-shadow:0 0 0 .25rem black }
& * { transition:display var(--dialog-duration) allow-discrete; animation:txt-unflash var(--txt-flsh-dur) ease }
& * { animation:txt-flash var(--txt-flsh-dur) ease forwards; animation-delay:var(--dialog-duration) }
0% { opacity:0 }
75% { opacity:1 }
100% { opacity:1 }
0% { opacity:1 }
25% { opacity:1 }
100% { opacity:0 }
0% { opacity:0 }
20% { opacity:1 }
```

### [EZ Modal](https://codepen.io/kaylapratt/pen/jENJdzy)

made with: @starting-style · transition · :focus-visible · backdrop-filter · custom properties driven by JS · <dialog>

```css
.dialog { box-shadow: 0px 25px 40px 10px rgba(0, 0, 0, 0.2) }
.dialog.is-modal { translate: 0 50%; opacity: 0; transition-property: translate, display, overlay, opacity }
.dialog.is-modal[open] { translate: 0; opacity: 1 }
.dialog.is-modal[open] { translate: 0 -50%; opacity: 0 }
.dialog:is(.is-offcanvas-left, .is-offcanvas-right) { translate: var(--translate) }
.dialog:is(.is-offcanvas-left, .is-offcanvas-right)[open] { translate: 0 }
.dialog:is(.is-offcanvas-left, .is-offcanvas-right)[open] { translate: var(--translate) }
.dialog.is-offcanvas-left { --translate: -100% }
.dialog.is-offcanvas-right { --translate: 100%; inset: 0 0 auto auto }
.dialog::-webkit-backdrop { -webkit-transition: background var(--animation-speed), -webkit-backdrop-filter var(--animation-speed); transition: background var(--animation-speed), -webkit-backdrop-filter var(--animation-speed); transition: backdrop-f }
.dialog::backdrop { transition: background var(--animation-speed), -webkit-backdrop-filter var(--animation-speed); transition: backdrop-filter var(--animation-speed), background var(--animation-speed); transition: backdrop-filter var(--anim }
.dialog[open]::-webkit-backdrop { -webkit-backdrop-filter: blur(2px); backdrop-filter: blur(2px) }
```

```js
style.setProperty("--animation-speed", `${this.animationSpeed}ms`)
style.setProperty("--max-width", this.maxWidth)
```

### [Tailwind 4 Dialog w/ @starting-style](https://codepen.io/sfearl1/pen/ByBGddo)

on scroll: button.inline-flex: background | made with: @starting-style · 3D (perspective / preserve-3d) · popover

### [Confirm Dialog Popover / No JS](https://codepen.io/DuskoStamenic/pen/pvzWPJO)

held: fixed dialog | on hover of button.btn: button.btn: background+shadow | made with: :hover · :focus-visible · popover · <dialog>

```css
&:hover, &:focus-visible { outline-offset: 4px; box-shadow: 0px 3px 9px -1px oklch(28% 0.12 var(--color-primary-hue) / 50%) }
&:hover, &:focus-visible { outline-offset: 0.25rem; box-shadow: 0px 3px 9px -1px oklch(28% 0.012 var(--color-primary-hue) / 50%) }
[popover] { box-shadow: 2px 8px 16px oklch(28% 0.12 var(--color-primary-hue) / 25%) }
p, h3 { margin-bottom: 1rem }
```

### [HTML-Tag Dialog](https://codepen.io/axelf/pen/YPKxQpO)

made with: :has() · <dialog>

```css
dialog[open] { box-shadow: 6px 5px 15px rgba(0,0,0,0.15) }
```

### [Modal CSS only](https://codepen.io/beumsk/pen/EaYNBJV)

held: fixed div.modal-window, fixed a.modal-backdrop | made with: position: fixed · transition · :hover

```css
main a:not(.btn) { margin-top: 2em }
.modal-window { position: fixed; top: 0; bottom: 0; opacity: 0; transition: all 0.3s }
.modal-window:target { opacity: 1 }
.modal-window .modal-backdrop { position: fixed; top: 0; bottom: 0 }
.modal-window .modal { position: relative; box-shadow: 0 0 8px 1px rgba(0, 0, 0, 0.25) }
.modal-window .modal-close { position: absolute; top: 0 }
```

### [modal](https://codepen.io/yoraichi/pen/VYZLjWJ)

made with: transition · <dialog>

```css
dialog { opacity: 0 }
dialog[open] { transition: opacity 1s; opacity: 1 }
```

### [Responsive Slideshow in <dialog>](https://codepen.io/cbolson/pen/jENOaqY)

made with: @starting-style · transition · :hover · :focus-visible · backdrop-filter · <dialog> · requestAnimationFrame

```css
.gallery button { position: relative }
.gallery button::before { position: absolute; inset: 0rem; transition: inset 300ms ease-in-out }
.gallery button:focus-visible::before, .gallery button:hover::before { inset: -.25rem }
.gallery > .gallery-main-img { position: relative }
@starting-style { opacity: 0 }
@starting-style { opacity: 0 }
dialog[open] .btn-dialog-close { position: absolute; top: -1.5rem; transition: rotate 300ms, background-color 300ms ease-in-out }
dialog[open] .btn-dialog-close:focus-visible, dialog[open] .btn-dialog-close:hov { rotate: 90deg }
.slider-wrapper { position: relative }
.slider-wrapper > button { position: absolute; top: 50%; box-shadow: none }
[btn-slider="prev"] { translate: -50% -50% }
[btn-slider="next"] { translate: 50% -50% }
```

```js
requestAnimationFrame(() => {
```

### [Html dialog element with animations](https://codepen.io/vihanga/pen/XWvvEzJ)

on hover of button.trigger-btn: button.trigger-btn: background+color | made with: @keyframes · :hover · <dialog>

```css
.wrapper .modal-wrapper { transform: scale(0) }
.wrapper .modal-wrapper[open] { animation: popIn 0.2s ease forwards }
.wrapper .modal-wrapper.close-w-anim { animation: popOut 0.15s ease forwards }
.wrapper .modal-wrapper .modal-header { border-bottom: 1px solid rgba(0, 0, 0, 0.1) }
100% { transform: scale(1) }
0% { transform: scale(1) }
100% { transform: scale(0) }
@keyframes popIn animates transform
@keyframes popOut animates transform
```

### [Modern dialog](https://codepen.io/stormwarning/pen/WNVqzba)

made with: @starting-style · transition · <dialog>

```css
&::backdrop { transition: opacity var(--_duration) var(--ease-out-3); opacity: 0 }
&, &::backdrop { opacity: 1 }
& > section { opacity: 1; scale: 1; filter: blur(0px) }
&[open], &[open]::backdrop { opacity: 0 }
&[open] > section { opacity: 0; scale: 0.95; filter: blur(4px) }
```

### [Dialog ::backdrop](https://codepen.io/f10tme/pen/JjgemjO)

held: fixed dialog | made with: position: fixed · transition · :hover · backdrop-filter · <dialog>

```css
#dialog { position: fixed; top: 0; bottom: 0; opacity: 0; transform: translateY(-100%) scale(0); backdrop-filter: blur(2px); transition: 0.3s ease-in-out }
#dialog[open] { transform: translateY(0%); opacity: 1 }
#dialog::backdrop { transition: 0.3s; backdrop-filter: blur(2px) }
button { backdrop-filter: blur(2px); transition: 0.3s }
button:hover { transform: scale(1.1) }
body { background-position: center }
```

### [dialog](https://codepen.io/vijendrajangid/pen/YzmOyXN)

made with: <dialog>

```css
dialog { box-shadow:0 0 10px rgba(0,0,0,0.2); position:relative }
dialog button { position:absolute; bottom:20px }
p { padding-bottom:10px }
```

### [Grid module with dialogs](https://codepen.io/atelierbram/pen/WNVQRxL)

made with: transition · :hover · <dialog>

```css
.lfstrr-fctrn { position: relative }
.lfstrr-fctrn:after { position: absolute; top:0; background-position: center; filter: saturate(0.75) }
.lfstrr-fctrn_item { position: relative }
.lfstrr-fctrn_item_text h3, .lfstrr-fctrn_dialog_text h3 { margin-bottom: .5em }
.lfstrr-fctrn_trigger-modal { position: absolute; top:0; bottom:0 }
.lfstrr-fctrn { padding-top: 100% }
.lfstrr-fctrn:after { bottom:0 }
```

### [FAQ tiles](https://codepen.io/BlackStar1991/pen/JjgojmB)

made with: position: fixed · @starting-style · transition · :hover · mask · <dialog>

```css
body::before { position: fixed; top: 0; background-position: 50% 50%; -webkit-mask: linear-gradient(-20deg, transparent 50%, #ff0); mask: linear-gradient(-20deg, transparent 50%, #ff0) }
.wrapper { position: relative }
input[name=tip] { position: absolute; opacity: 0 }
input[name=tip]:nth-child(1) { top: 0 }
input[name=tip]:nth-child(2) { top: 30px }
input[name=tip]:nth-child(3) { top: 60px }
#tip1:checked ~ .tips #desc1 > .tip_item__wrapper, #tip2:checked ~ .tips #desc2  { transition: 0.2s ease-in }
#tip1:checked ~ .tips #desc1 > .tip_item__wrapper { transform: translate(calc(-100% - 20px), 0) }
#tip2:checked ~ .tips #desc2 > .tip_item__wrapper { transform: translate(calc(-100% - 20px), calc(-20vh - 20px)) }
#tip3:checked ~ .tips #desc3 > .tip_item__wrapper { transform: translate(calc(-100% - 20px), calc(-40vh - 40px)) }
.tips_big { position: relative }
.tips_item { position: relative }
```

### [Dialog Modal without javascript](https://codepen.io/cupy/pen/PoMYKxQ)

made with: transition · <dialog>

```css
dialog { opacity: 0; scale: 0; transition: all 2.5s }
dialog[open] { opacity: 1; scale: 2 }
button { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

### [no JS dialog](https://codepen.io/CLSPI/pen/LYKwYwp)

held: fixed dialog | made with: position: fixed · transition · <dialog>

```css
dialog::backdrop { opacity: 0.5 }
dialog { opacity:0; scale: 0; transition: all 1.1s; box-shadow: 2px 16px 28px 9px rgba(0,0,0,0.54); -webkit-box-shadow: 2px 16px 28px 9px rgba(0,0,0,0.54); -moz-box-shadow: 2px 16px 28px 9px rgba(0,0,0,0.54); position: fixed; top }
dialog[open] { opacity: 1; scale: 1.2 }
```

### [【Animation】Dialog（@starting-style / allow-discrete）](https://codepen.io/zaxrfawb-the-lessful/pen/MWMRQwE)

made with: @starting-style · transition · backdrop-filter · <dialog>

```css
::-webkit-backdrop { opacity: 0; -webkit-transition: opacity 1s, display 1s allow-discrete, overlay 1s allow-discrete; transition: opacity 1s, display 1s allow-discrete, overlay 1s allow-discrete }
dialog, ::backdrop { opacity: 0; transition: opacity 1s, display 1s allow-discrete, overlay 1s allow-discrete }
::-webkit-backdrop { -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px) }
::backdrop { -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px) }
dialog[open]::-webkit-backdrop { opacity: 1 }
dialog[open], dialog[open]::backdrop { opacity: 1 }
dialog[open]::-webkit-backdrop { opacity: 0 }
dialog[open], dialog[open]::backdrop { opacity: 0 }
```

### [Modal Sample](https://codepen.io/leezee/pen/XWLVBgp)

made with: @keyframes · <dialog>

```css
dialog { animation: zoom-out 0.5s ease-out }
dialog[open] { animation: zoom-in 0.5s ease-out }
0% { opacity: 0; transform: scale(0.1) }
100% { opacity: 1; transform: scale(1) }
0% { opacity: 1; transform: scale(1) }
100% { opacity: 0; transform: scale(0) }
@keyframes zoom-in animates opacity, transform, display
@keyframes zoom-out animates opacity, transform, display
```

### [HTML dialog element, no JS modal](https://codepen.io/pr0h0/pen/eYwEroN)

made with: <dialog>

### [prog-lightbox example](https://codepen.io/ndorfin/pen/qBzrQjb)

made with: <dialog>

### [popover - demo](https://codepen.io/lctech-jeff/pen/VwJZygo)

made with: @starting-style · transition · :hover · backdrop-filter · popover

```css
[popover] { opacity: 0; transform: translateY(-20px); transition: all 0.25s allow-discrete }
[popover]::backdrop { backdrop-filter: blur(0) }
[popover]::backdrop { transition: all 0.25s allow-discrete }
[popover]:popover-open { opacity: 1; transform: translateY(0) }
[popover]:popover-open::backdrop { backdrop-filter: blur(10px) }
[popover]:popover-open { opacity: 0; transform: translateY(-20px) }
[popover]:popover-open::backdrop { backdrop-filter: blur(0) }
```

### [Simple dialog modal](https://codepen.io/Gyome/pen/vYwMrdz)

held: sticky div.sticky | made with: position: sticky · transition · <dialog>

```css
.modal { box-shadow: 2px 0 9px rgba(0, 0, 0, 0.25) }
.modal[open] { opacity: 1; transition: opacity 0.5s allow-discrete }
.modal-body { margin-bottom: auto }
.sticky { position: sticky; top: 0; box-shadow: 0 0 5px rgba(0, 0, 0, 0.25) }
.title { margin-bottom: 1em }
```

### [html dialog enter/leave transition w/ @starting-style](https://codepen.io/vii120/pen/dyEWgEe)

made with: @starting-style · transition · :hover · :focus-visible · backdrop-filter · <dialog>

```css
body { position: relative }
body:before { position: absolute; inset: 0; opacity: 0.6 }
btn { backdrop-filter: blur(5px); box-shadow: 3px 5px white; transition: scale 0.3s }
btn:hover { scale: 1.05 }
dialog { --dialog-opacity: 0; --dialog-translate: 0 1rem; --mask-opacity: 0; opacity: var(--dialog-opacity); translate: var(--dialog-translate); transition: all 0.5s allow-discrete, opacity 0.5s, translate 0.5s }
dialog[open] { --dialog-opacity: 1; --dialog-translate: 0 0 }
dialog[open]::backdrop { --mask-opacity: 1 }
dialog::backdrop { opacity: var(--mask-opacity); backdrop-filter: blur(5px); transition: opacity 0.5s }
dialog[open] { --dialog-opacity: 0; --dialog-translate: 0 1rem }
dialog[open]::backdrop { --mask-opacity: 0 }
```

### [Pop-Up Confirm](https://codepen.io/lycaza/pen/ZENpWba)

made with: transition

```css
#cd-pop-up { top: 0; opacity: 0 }
.cd-popup-container { position: relative; box-shadow: 0 0 20px rgba(0,0,0,.2) }
div#cd-pop-up.is-visible { opacity: 1; -webkit-transition: opacity .3s 0.2s, visibility 0s 0s; -moz-transition: opacity .3s 0.2s, visibility 0s 0s; transition: opacity .3s 0.2s, visibility 0s 0s }
.cd-popup-container .cd-popup-close { position: absolute; top: 8px }
```

### [Popover Modal Demo](https://codepen.io/dustindowns/pen/dyEPbKq)

held: fixed dialog | on hover of button.: button.: background | made with: :hover · popover · <dialog>

```css
button { text-transform: uppercase; box-shadow: 0.2rem 0.2rem #085624 }
button:active { box-shadow: none; transform: translate(0.2rem, 0.2rem) }
dialog { box-shadow: 0.4rem 0.3rem 1rem #085624 }
dialog::backdrop { opacity: 0.5 }
```

### [Dialog Box](https://codepen.io/darquiza/pen/ExzxpzB)

made with: <dialog>

```css
.to-center { position: absolute; top: 50%; transform:translateY(-50%) }
```

### [off canvas dialog](https://codepen.io/sascha-davidson/pen/jORYgve)

held: sticky header, sticky footer | on hover of button.open-dialog: button.open-dialog: background | made with: position: sticky · position: fixed · @keyframes · transition · :hover · <dialog>

```css
.open-dialog { margin-top: 1.5rem }
dialog { top: 0; box-shadow: var(--_no-shadow); transition: box-shadow .2s; animation-fill-mode: forwards }
dialog[open] { -webkit-animation: float-in-right 1s ease normal; box-shadow: var(--_shadow) }
dialog.closing { -webkit-animation: float-out-right 1s ease normal }
from { -webkit-transform: translate(100%); -ms-transform: translate(100%); transform: translateX(100%) }
to { -webkit-transform: translate(0%); -ms-transform: translate(0%); transform: translateX(0%) }
from { -webkit-transform: translate(100%); -ms-transform: translate(100%); transform: translateX(100%) }
to { -webkit-transform: translate(0%); -ms-transform: translate(0%); transform: translateX(0%) }
from { -webkit-transform: translate(0%); -ms-transform: translate(0%); transform: translateX(0%) }
to { -webkit-transform: translate(100%); -ms-transform: translate(100%); transform: translateX(100%) }
from { -webkit-transform: translate(0%); -ms-transform: translate(0%); transform: translateX(0%) }
to { -webkit-transform: translate(100%); -ms-transform: translate(100%); transform: translateX(100%) }
```

### [#CodePenChallenge: Error Messages](https://codepen.io/vii120/pen/XWQRrxv)

made with: @keyframes

```css
.dialog { position: relative; -webkit-animation: zoomIn 0.6s; animation: zoomIn 0.6s }
.dialog .header { position: absolute; top: 0 }
.dialog .content { margin-top: 0.5rem }
from { opacity: 0; transform: translateY(3rem) scale(0.5) }
from { opacity: 0; transform: translateY(3rem) scale(0.5) }
@keyframes zoomIn animates opacity, transform
```

### [HTML5 Dialog - Error modal](https://codepen.io/fchaussin/pen/WNWpaLa)

held: fixed dialog.modal | made with: position: fixed · transition · <dialog>

```css
&::backdrop { opacity: 0.75; filter: blur(0.15em) }
```

### [Error Messages - Dialog](https://codepen.io/Diana-Moretti/pen/RwOKqrJ)

on hover of button.: button.: opacity | made with: :hover · <dialog>

```css
.event__container { background-position: center; box-shadow: 5px 5px 15px -4px #000000 }
#add__to__cart { text-transform: uppercase }
#add__to__cart:hover { opacity: 0.8 }
::backdrop { opacity: 0.80 }
dialog { box-shadow: 5px 5px 15px -4px #000000 }
dialog a:hover { opacity: 0.8 }
```

### [Dialog element](https://codepen.io/KImLungay2/pen/eYoZVoM)

made with: <dialog>

### [Simple Modal Dialog Popup with Html CSS JavaScript](https://codepen.io/ilkaytobello/pen/rNbNaMr)

held: fixed div.modal | made with: position: fixed · :hover

```css
.modal { position: fixed; top: 0 }
.modal-content { box-shadow: 0 0 10px rgb(173 148 148 / 70%); position: relative }
button.click-me { box-shadow: none }
button.click-me:hover { box-shadow: none }
button { box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) }
button:hover { box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24), 0 17px 50px 0 rgba(0, 0, 0, 0.19) }
```

### [Untitled](https://codepen.io/gorgonfreeman/pen/poYBQgV)

made with: transition

```css
.dialog { position: relative; transition: transform 300ms; transform: scale(0) }
.dialog._transition_in { transform: scale(1) }
.dialog._transition_out { transform: scale(0) }
.dialog_close { position: absolute; top: 0 }
```

### [Example usage of jQuery Timed Dialog](https://codepen.io/armino-dev/pen/zYbjdJw)

made with: nothing recognised — read the code

```css
button, [type="button"], [type="reset"], [type="submit"] { margin-top:10px }
```

### [Bash Dialog](https://codepen.io/jaxparrow07/pen/BabYZRO)

made with: :hover

```css
.back-header { position: absolute; border-bottom: 1px solid #00ffff; top: 0% }
.main { position: relative }
.dialog { position: relative; box-shadow: 26px 26px 0 black }
.wrapper-extrude { position: relative; border-top: 2px white solid; padding-top: 1rem }
.wrapper-extrude p { position: absolute; transform: translateY(calc(-50% - 1rem)) }
.controls { border-bottom: 2px solid black }
.controls .option { position: relative }
.controls .option::before { position: absolute }
.controls .option::after { position: absolute }
.wrapper-intrude { position: relative; border-top: 2px black solid; border-bottom: 2px white solid; margin-bottom: 2rem }
```

### [Subscription Cancellation Confirmation](https://codepen.io/archatas/pen/zYbPgby)

made with: nothing recognised — read the code

### [Adaptive comic book speech bubbles](https://codepen.io/axalex/pen/mdomKRv)

made with: clip-path

```css
section.demo { text-transform: uppercase }
.sr-hidden { clip-path: inset(50%); position: absolute }
section.prose { margin-top: 4rem }
.bubble-tail-container .bubble { filter: drop-shadow(0.125rem 0.125rem 0rem var(--outlines)) drop-shadow(0.0625rem -0.0625rem 0rem var(--outlines)) drop-shadow(-0.0625rem 0.0625rem 0rem var(--outlines)) }
.tail { margin-top: -0.025rem }
[data-tail-direction="left"] { transform: scalex(-1) }
.bubble-tail-container svg { filter: drop-shadow(0.046875rem 0rem 0rem var(--outlines)) }
.bubble-tail-container svg.embiggen { transform: scale(1.5) translateY(17%) }
```

### [WordPress Modal using GenerateBlocks](https://codepen.io/vj/pen/oNVYGqg)

made with: <dialog>

### [File dialog](https://codepen.io/SyntaxBreaker/pen/rNRxVwL)

made with: :hover

```css
.dialog__file-upload { position: relative }
.dialog__input { position: absolute; top: 0; opacity: 0 }
```

### [Accessible dialog](https://codepen.io/pranav-raut/pen/abMbzgK)

made with: <dialog>

```css
::backdrop { opacity: 0.75 }
```

### [Simplest Functioning Dialog](https://codepen.io/theraven-code/pen/mdodbed)

made with: <dialog>

```css
dialog::backdrop { opacity: 0.9 }
```

### [CSS :has() for disabling scroll](https://codepen.io/mvsde/pen/OJqLved)

made with: :has() · <dialog>

### [Native html dialog "nesting"](https://codepen.io/everdimension/pen/OJdYYVO)

made with: <dialog>

```css
#two { position: relative; top: 200px }
```

### [Semantic Popup from Dialog Tag with QoL Features](https://codepen.io/gorgonfreeman/pen/eYxoNmm)

made with: @keyframes · backdrop-filter · <dialog>

```css
dialog::backdrop { backdrop-filter: blur(5px) }
dialog[open] { animation: bounce 150ms ease-out forwards }
dialog[open]::backdrop { animation: fade_in 500ms forwards }
.dialog_close { position: absolute; top: 0 }
.dialog_close::before, .dialog_close::after { position: absolute; transform: rotate(45deg) }
.dialog_close::after { transform: rotate(-45deg) }
0% { transform: scale(0) }
70% { transform: scale(1.1) }
100% { transform: scale(1) }
0% { transform: scale(5) }
70% { transform: scale(0.9) }
100% { transform: scale(1) }
```

### [HTML 5 Dialog Box](https://codepen.io/qasimaaagency/pen/xxMmMem)

made with: <dialog>

```css
.wrapper { padding-top: 8rem }
```

### [HTML Dialog Element](https://codepen.io/carsonf92/pen/GRzxoqE)

made with: transition · :hover · <dialog>

```css
.btn { box-shadow: 0 4px 0 #d9c0b7; position: relative }
.btn:active { box-shadow: none }
.btn--small { box-shadow: none }
.btn__count { position: absolute; top: -1.4rem }
dialog { opacity: 0; transform: translateY(2rem); transition: opacity 0.2s ease, transform 0.2s ease }
dialog[open] { opacity: 1; transform: translateY(0) }
```

### [HTML/JS Built-in Dialog Modal - Made Easy](https://codepen.io/wesleybertipaglia/pen/LYqjpVW)

on scroll: button.btn-primary: background | made with: @keyframes · transition · :hover · <dialog>

```css
button { transition: all 0.2s ease-in-out }
dialog.modal { box-shadow: var(--shadow); animation: fadeIn 0.2s ease-out }
.modal-header { margin-bottom: 1rem }
.modal-body { margin-bottom: 1.5rem }
from { opacity: 0; transform: translateY(-10%) }
to { opacity: 1; transform: translateY(0) }
@keyframes fadeIn animates opacity, transform
```

### [HTML Dialog](https://codepen.io/ibz786/pen/GRzmgPm)

made with: position: fixed · backdrop-filter · <dialog>

```css
dialog { position: relative; top: 50%; transform: translate(-50%, -50%) }
dialog::backdrop { position: fixed; top: 0px; bottom: 0px; backdrop-filter: blur(3px) }
```

### [Plain JS Modal/Dialog](https://codepen.io/AppleSungPlusPhone/pen/WNLqapG)

made with: position: fixed · transition

```css
.small-image { box-shadow: 1px 1px 5px black }
.large-image { position: fixed; top: 50%; box-shadow: 4px 4px 15px black; transform: translate(-50%, -50%) scale(1); transition: transform 5s ease-in-out }
```

### [Animate <Dialog>](https://codepen.io/aceburgundy/pen/JjwwLWv)

made with: position: fixed · @keyframes · <dialog>

```css
dialog { top: 50% }
dialog::backdrop { position: fixed }
dialog[open], #backdrop { animation: fade-in 250ms forwards }
dialog[open].close-animate { animation: fade-out 250ms forwards }
0% { transform: translate(-50%, -10%); opacity: 0 }
100% { transform: translate(-50%, -50%); opacity: 1 }
0% { transform: translate(-50%, -50%); opacity: 1 }
100% { transform: translate(-50%, -10%); opacity: 0 }
@keyframes fade-in animates transform, opacity
@keyframes fade-out animates transform, opacity, display
```

### [Native HTML modal dialog](https://codepen.io/MizterJeeves/pen/ZEVqbeR)

made with: @keyframes · transition · :hover · backdrop-filter · <dialog>

```css
body { background-position: center }
p { margin-top: 0 }
button { transition: 0.22s ease }
form .form-col label { margin-bottom: 0.25rem }
input { transition: 0.1s ease }
.action { backdrop-filter: blur(12px) }
.stack.stack-horizontal .slot { margin-bottom: 1rem }
dialog { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.22); position: absolute; top: auto }
dialog.is-active { animation: animate-up-mobile 0.22s ease }
dialog.is-active { top: 0; animation: fade-in-up 0.22s ease; transform: translateY(0) }
dialog.is-active::backdrop { opacity: 1 }
dialog .modal-header { box-shadow: inset 0 -1px rgba(0, 0, 0, 0.1) }
```

### [Dialog '95](https://codepen.io/ideographist/pen/jOXvdRm)

made with: <dialog>

```css
::backdrop { opacity: 0.5 }
:modal { position: relative }
:modal header { position: absolute; top: 0 }
:modal form button:active { border: 2px lightgrey inset }
```

### [Creating a reusable pop-up modal in React from scratch - Part 1](https://codepen.io/gabrielizalo/pen/ExGEvqM)

made with: <dialog>

```css
.modal { box-shadow: 0 0 0.5rem 0.25rem hsl(0 0% 0% / 10%); position: relative }
.modal-close-btn { position: absolute; top: 0.25em }
```

### [Styled :modal | Click anywhere to close](https://codepen.io/Tcip/pen/RwEjpRo)

made with: <dialog>

```css
:modal { padding-top: 0; padding-bottom: 1.5em }
:modal:after { position: absolute; bottom: 0; border-top: 2px solid #deb887 }
```

### [html dialog](https://codepen.io/viT-1/pen/wvRMyQG)

made with: <dialog>

### [dialogタグを学ぶ](https://codepen.io/micche/pen/eYbJeWP)

made with: <dialog>

### [Modal / Tailwind CSS](https://codepen.io/lukebottle/pen/VwVoObb)

made with: <dialog>

### [Simple , fully functional, modal dialog](https://codepen.io/salmon/pen/xxQQeMm)

made with: <dialog>

### [Accessible Modal Window with Table](https://codepen.io/radoslavdurac/pen/wvQEKwV)

held: fixed div.modal | made with: position: fixed · :hover · clip-path · popover

```css
.modal { position: fixed; top: 0 }
.modal-content { position: relative }
.close { position: absolute; top: 0.5rem }
.sr-only { -webkit-clip-path: inset(50%) !important; clip-path: inset(50%) !important; position: absolute !important }
```

### [Html Dialog ( Modal ) Styling and Custom Animation](https://codepen.io/mftaskin/pen/PoxRRQJ)

held: fixed dialog.dialog, fixed dialog.dialog, fixed div | made with: position: fixed · transition · :hover · <dialog>

```css
.btn-modalshow { margin-top: 1rem }
.btn-close { position: absolute; top: 0 }
dialog.dialog { position: fixed; top: 0%; opacity: 0; transform: translate(-50%, -110%); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5); transition: top 250ms ease, opacity 250ms ease, transform 250ms ease }
dialog.dialog.active { top: 10%; opacity: 1; transform: translate(-50%, 0%) }
dialog.dialog .dialog-header { border-bottom: 1px solid #f4f4f4 }
dialog.dialog::backdrop { transition: background-color 250ms ease }
#qxt-links { position: fixed; bottom: 0 }
#qxt-links a { transition: color 200ms ease, background-color 200ms ease }
```

### [Native dialog and native popover test](https://codepen.io/ankedsgn/pen/WNYpXOZ)

held: fixed div | made with: backdrop-filter · popover · <dialog>

```css
.dialog::backdrop { backdrop-filter: blur(2px) }
.popover__container { position: relative }
```

### [Native <dialog> Example + Animations](https://codepen.io/dominik-kosic/pen/qBQOVVQ)

held: fixed main | made with: position: fixed · transition · <dialog>

```css
.modal { opacity: 0; transform: translateY(10px); transition: transform 0.15s ease, opacity 0.15s ease }
.modal::backdrop { transition: background-color 0.15s ease }
.modal--active { transform: translateY(0px); opacity: 1 }
main { position: fixed }
.modal p { margin-top: 0px }
```

### [dialog - new modal](https://codepen.io/jamxi/pen/xxQwPqz)

made with: <dialog>

```css
#ex3 { xmargin-top: 10px }
#ex3C { position: absolute; top: -10px }
```

### [Basic CSS Dialog](https://codepen.io/giancarlosgza/pen/WNaVbLR)

held: fixed dialog.dialog | on scroll: button.: background | made with: position: fixed · @starting-style · transition · :hover · <dialog>

```css
@starting-style { scale: 0.5; opacity: 0 }
```

### [New dialog (modal)](https://codepen.io/Semali/pen/KKGjvRq)

made with: :hover · <dialog>

```css
.dialog__form-field { margin-top: 16px }
.dialog__form-footer { margin-top: 16px }
```

### [Simple Spawnable Dialog with Choices JS Class](https://codepen.io/gorgonfreeman/pen/NWOEPrJ)

made with: transition

```css
.dialog { position: relative; transition: transform 300ms; transform: scale(0) }
.dialog._transition_in { transform: scale(1) }
.dialog._transition_out { transform: scale(0) }
.dialog_close { position: absolute; top: 0 }
```

### [HTML Dialog Element](https://codepen.io/alekzandriia/pen/MWPPNBe)

made with: <dialog>

```css
dialog::backdrop { opacity:60% }
.close { position:absolute; top:0 }
```

### [HTML5 Dialog](https://codepen.io/iammattburns/pen/oNaPEQX)

made with: position: fixed · @keyframes · :hover · backdrop-filter · <dialog>

```css
.dialog--with-backdrop::-webkit-backdrop { position: fixed; top: 0; bottom: 0; -webkit-backdrop-filter: blur(3px); backdrop-filter: blur(3px) }
.dialog--with-backdrop::backdrop { position: fixed; top: 0; bottom: 0; -webkit-backdrop-filter: blur(3px); backdrop-filter: blur(3px) }
.dialog--with-animation { -webkit-animation-name: animate-top; animation-name: animate-top; -webkit-animation-duration: 0.4s; animation-duration: 0.4s }
from { top:-100px; opacity:0 }
to { top:0; opacity:1 }
from { top:-100px; opacity:0 }
to { top:0; opacity:1 }
@keyframes animate-top animates top, opacity
```

### [Simple Modal](https://codepen.io/m_vd_e/pen/GRYBWrV)

made with: @keyframes · :hover · <dialog>

```css
body { padding-top: 4rem }
dialog { animation: animate 0.12s ease-out }
button[data-open-modal]:hover { outline-offset: 3px }
button[data-close-modal] { position: absolute; top: -1rem; outline-offset: -1px }
0% { transform: scaleY(0.2) }
80% { transform: scaleY(1.14) }
100% { transform: scaleY(1) }
@keyframes animate animates transform
```

### [Dialog Button](https://codepen.io/flexcode/pen/OJBQxPB)

held: fixed div.dialog, fixed div.watermark-ctr | made with: position: fixed · @keyframes · transition · :hover · :focus-visible · clip-path · mix-blend-mode · 3D (perspective / preserve-3d) · GSAP

```css
.cd-btn { position: relative; transition: 0.2s; will-change: transform }
.cd-btn:active { transform: translateY(2px) }
.cd-btn--primary { box-shadow: inset 0 1px 0 hsla(0, 0%, 100%, 0.15), 0 1px 3px hsla(250, 84%, 38%, 0.25), 0 2px 6px hsla(250, 84%, 38%, 0.1), 0 6px 10px -2px hsla(250, 84%, 38%, 0.25) }
.cd-btn--primary:hover { box-shadow: inset 0 1px 0 hsla(0, 0%, 100%, 0.15), 0 1px 2px hsla(250, 84%, 38%, 0.25), 0 1px 4px hsla(250, 84%, 38%, 0.1), 0 3px 6px -2px hsla(250, 84%, 38%, 0.25) }
.cd-btn--primary:focus-visible { box-shadow: inset 0 1px 0 hsla(0, 0%, 100%, 0.15), 0 1px 2px hsla(250, 84%, 38%, 0.25), 0 1px 4px hsla(250, 84%, 38%, 0.1), 0 3px 6px -2px hsla(250, 84%, 38%, 0.25), 0 0 0 2px hsl(0, 0%, 100%), 0 0 0 4px hsl(250, 84%, 54 }
.cd-btn--subtle { box-shadow: inset 0 1px 0 hsla(0, 0%, 100%, 0.1), 0 0 0 1px hsla(230, 13%, 9%, 0.02), 0 0.3px 0.4px hsla(230, 13%, 9%, 0.025), 0 1px 3px -1px hsla(230, 13%, 9%, 0.2), 0 3.5px 6px hsla(230, 13%, 9%, 0.12) }
.cd-btn--subtle:hover { box-shadow: inset 0 1px 0 hsla(0, 0%, 100%, 0.1), 0 0 0 1px hsla(230, 13%, 9%, 0.02), 0 0.1px 0.3px hsla(230, 13%, 9%, 0.06), 0 1px 2px hsla(230, 13%, 9%, 0.12), 0 1px 3px -1px hsla(230, 13%, 9%, 0.2) }
.cd-btn--subtle:focus-visible { box-shadow: inset 0 1px 0 hsla(0, 0%, 100%, 0.1), 0 0 0 1px hsla(230, 13%, 9%, 0.02), 0 0.3px 0.4px hsla(230, 13%, 9%, 0.025), 0 1px 3px -1px hsla(230, 13%, 9%, 0.2), 0 3.5px 6px hsla(230, 13%, 9%, 0.12), 0 0 0 2px hsl(0 }
.cd-btn--accent { box-shadow: inset 0 1px 0 hsla(0, 0%, 100%, 0.15), 0 1px 3px hsla(342, 89%, 38%, 0.25), 0 2px 6px hsla(342, 89%, 38%, 0.1), 0 6px 10px -2px hsla(342, 89%, 38%, 0.25) }
.cd-btn--accent:hover { box-shadow: inset 0 1px 0 hsla(0, 0%, 100%, 0.15), 0 1px 2px hsla(342, 89%, 38%, 0.25), 0 1px 4px hsla(342, 89%, 38%, 0.1), 0 3px 6px -2px hsla(342, 89%, 38%, 0.1) }
.cd-btn--accent:focus-visible { box-shadow: inset 0 1px 0 hsla(0, 0%, 100%, 0.15), 0 1px 2px hsla(342, 89%, 38%, 0.25), 0 1px 4px hsla(342, 89%, 38%, 0.1), 0 3px 6px -2px hsla(342, 89%, 38%, 0.1), 0 0 0 2px hsl(0, 0%, 100%), 0 0 0 4px hsl(342, 89%, 48% }
.cd-btn--disabled, .cd-btn[disabled], .cd-btn[readonly] { opacity: 0.6 }
```

```js
gsap.to(button, {
```

### [dialog element modal](https://codepen.io/TikiHead/pen/zYmpMxa)

made with: <dialog>

### [dialog on open](https://codepen.io/TikiHead/pen/NWOXEWR)

made with: <dialog>

### [New Dialog HTML Element Replaces Modal](https://codepen.io/jaredgroff/pen/NWOwgOz)

made with: transition · :hover · <dialog>

```css
.open-btn { transition: 350ms ease }
.close-btn { position: absolute; top: 16px; opacity: .8; transition: 350ms ease }
.close-btn:hover { opacity: 1; scale: 1.125 }
.modal { position: relative }
```

### [HTML dialog modal](https://codepen.io/Kasper-Trouwee/pen/mdzqVyX)

made with: <dialog>

### [Dialog Box](https://codepen.io/satchsStudio/pen/eYPGwJb)

made with: <dialog>

### [Glass UI Card](https://codepen.io/waseem-polus/pen/eYPYxmq)

made with: @keyframes · transition · :hover · backdrop-filter

```css
body { transition: background-color 0.3s ease-in-out, background-image 0.35s ease-in-out }
body, body * { transition: background-color 0.3s ease-in-out, background-image 0.35s ease-in-out, color 0.1s ease-in-out }
body #theme-label { position: absolute; top: 1rem; transition: transform 0.1s ease-in-out }
body #theme-label svg { transition: transform 0.1s ease-in-out }
body #theme-label:hover { transform: scale(1.05) }
body #theme-label:hover svg { transform: translateY(-15%) }
body .glass { backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); box-shadow: 0px 14px 24px rgba(0, 0, 0, 0.07) }
body #card p { filter: brightness(0.8) }
body #card button { backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); transition: filter 0.08s ease, transform 0.1s ease-in-out, color 0.1s ease-in-out }
body #card button:hover { transform: scale(1.05) }
body #card button:active { transform: scale(0.95) }
.dark-theme #theme-label svg { opacity: 50%; animation: spin 0.5s ease-in-out forwards }
```

### [Dialog element](https://codepen.io/dirkds/pen/qBJWYwq)

made with: backdrop-filter · <dialog>

```css
dialog::backdrop { backdrop-filter: blur(0.3rem) grayscale(0.7) }
```

### [2 Dialog Boxes With Toggle Effects With Different Colors](https://codepen.io/a7rarpress/pen/abaXaOY)

held: fixed div.dialog-overlay, fixed div, fixed div | made with: position: fixed · :hover

```css
#dialog-box { position:fixed; top:50px; box-shadow: 0 0 2px 1px black,0 0 10px black }
#dialog-box2 { position:fixed; top:50px; box-shadow: 0 0 2px 1px black,0 0 10px black }
.dialog-overlay { position:fixed !important; position:absolute; top:0px; bottom:0px }
.muncul { box-shadow:inset 1px 1px 0px 0px #ffffff }
.muncul2 { box-shadow:inset 1px 1px 0px 0px #FECCBF }
```

### [draggable dialog box](https://codepen.io/jbazant100/pen/MWqzEGw)

made with: <dialog>

```css
dialog { position: absolute; padding-bottom: 4px }
dialog > .topbox { border-bottom: solid blue 1px }
```

### [JavaScript - Dialog Boxes - Prompt, Alert](https://codepen.io/pyxofy/pen/eYLPQZG)

made with: nothing recognised — read the code

```css
button { margin-top: 30px }
.container { position: relative }
```

### [JavaScript - Dialog Boxes - Confirm, Alert](https://codepen.io/pyxofy/pen/vYzVQOP)

made with: nothing recognised — read the code

```css
button { margin-top: 30px }
.container { position: relative }
```

### [<dialog>](https://codepen.io/trevor1107/pen/oNPYxbj)

made with: :hover · backdrop-filter · <dialog>

```css
dialog::backdrop { backdrop-filter: blur(1px) }
```

### [Modal Wizard](https://codepen.io/darquiza/pen/ExeKajB)

held: fixed div.modal-container | made with: position: fixed · transition · :hover

```css
.modal-container { position: fixed; padding-top: 100px; top: 0 }
.modal-content { box-shadow: 4px 0 20px 0 rgba(0, 0, 105, 0.05); position: relative }
.modal-body { position: absoulte }
.modal-content .close { position: absolute; top: 16px }
label.custom-checkbox-button__square span { box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1) }
label[class^=custom-checkbox-button__], label[class*=" custom-checkbox-button__" { position: relative }
label[class^=custom-checkbox-button__] input, label[class*=" custom-checkbox-but { position: absolute; opacity: 0 }
label[class^=custom-checkbox-button__] span, label[class*=" custom-checkbox-butt { margin-bottom: 0.5rem }
label[class^=custom-checkbox-button__] span:before, label[class*=" custom-checkb { transition: 0.25s ease; box-shadow: inset 0 0 0 0.055em #111111 }
.chevron::before { position: relative; top: 50%; transform: rotate(-45deg) }
.chevron.right:before { transform: rotate(45deg) }
.chevron.bottom:before { top: 0; transform: rotate(135deg) }
```

### [Accessible dialog modal using <dialog>](https://codepen.io/rahulbaran/pen/QWVWJjZ)

made with: @keyframes · prefers-reduced-motion · backdrop-filter · <dialog>

```css
dialog { -webkit-backdrop-filter: blur(3px); backdrop-filter: blur(3px); -webkit-animation: dialog-animation 250ms ease-out; animation: dialog-animation 250ms ease-out }
dialog .box { position: absolute; top: 0; bottom: 0 }
dialog .btn { margin-top: calc(0.5em * 2); margin-top: calc(var(--base-margin) * 2) }
from { opacity: 0 }
to { opacity: 1 }
from { opacity: 0 }
to { opacity: 1 }
@keyframes dialog-animation animates opacity
```

### [<dialog> element with form](https://codepen.io/rahulbaran/pen/yLqemKp)

made with: transition · :hover · prefers-reduced-motion · <dialog>

```css
.btn { box-shadow: 0 0 3px oklch(0% .01 100 / .5); transition: opacity 250ms ease }
.btn:hover { opacity: .7 }
.form h2 { text-transform: uppercase; text-underline-offset: .125em }
```

### [Html dialog](https://codepen.io/aeischeid/pen/RwBNPZq)

held: fixed dialog | made with: position: fixed · transition · :hover · backdrop-filter · <dialog>

```css
dialog { box-shadow: 0 0 24px var(--modal-close-color); position: fixed }
::backdrop { backdrop-filter: blur(2px) }
dialog .x { filter: grayscale(1); position: absolute; top: 0 }
button { text-transform: none; transition: background 0.3s }
```

### [Form modal with <dialog>](https://codepen.io/angelovdev/pen/JjZZbOo)

made with: backdrop-filter · <dialog>

```css
dialog::backdrop { backdrop-filter: blur(1px) }
```

### [Open modal on anchor links](https://codepen.io/ind88/pen/JjZLxVN)

made with: transition · :hover · backdrop-filter · <dialog>

```css
a { transition: all 0.2s ease-in-out }
.dialog::backdrop { backdrop-filter: blur(4px) }
.dialog__wrapper { box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3) }
.dialog__close { position: absolute; top: 5px }
```

### [Open modal on anchor links](https://codepen.io/ind88/pen/xxzWMeq)

made with: transition · :hover · backdrop-filter · <dialog>

```css
a { transition: all 0.2s ease-in-out }
.dialog::backdrop { backdrop-filter: blur(4px) }
.dialog__wrapper { box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3) }
.dialog__close { position: absolute; top: 5px }
```

### [The Joy of Windows Errors](https://codepen.io/jkantner/pen/oNypPOZ)

held: fixed div.window, fixed div.window | made with: position: fixed · pointer / mouse tracking

```css
.window { box-shadow: -1px -1px 0 #000000 inset, 1px 1px 0 #dfdfdf inset, -2px -2px 0 #808080 inset, 2px 2px 0 #ffffff inset; position: fixed; top: calc(50% - 60px) }
.window__sprite { position: absolute; top: -1px }
.window__sprite--close { box-shadow: 5px 4px #000000, 6px 4px #000000, 6px 5px #000000, 7px 5px #000000, 7px 6px #000000, 8px 6px #000000, 9px 6px #000000, 10px 6px #000000, 10px 5px #000000, 11px 5px #000000, 11px 4px #000000, 12px 4px #000000, }
.window__sprite--close-disabled { box-shadow: 5px 4px #808080, 6px 4px #808080, 6px 5px #808080, 7px 5px #808080, 7px 6px #808080, 8px 6px #808080, 9px 6px #808080, 10px 6px #808080, 10px 5px #808080, 11px 5px #808080, 11px 4px #808080, 12px 4px #808080, }
.window__button { box-shadow: 1px 1px 0 #ffffff inset, -1px -1px 0 #808080 inset, 2px 2px 0 #dfdfdf inset, 1px 0 0 #000000, 0 1px 0 #000000, 1px 1px 0 #000000; position: relative }
.window__button:not(:disabled):active { box-shadow: 1px 1px 0 #000000 inset, -1px -1px 0 #c0c0c0 inset, 2px 2px 0 #808080 inset, 1px 0 0 #ffffff, 0 1px 0 #ffffff, 1px 1px 0 #ffffff }
.window__button--lg { box-shadow: -1px -1px 0 #000000 inset, 1px 1px 0 #ffffff inset, -2px -2px 0 #808080 inset }
.window__button--lg:not(:disabled):active { box-shadow: 0 0 0 1px #000000 inset, 0 0 0 2px #808080 inset }
.window__button:not(:disabled):active .window__sprite { transform: translate(1px, 1px) }
.window--active .window__button--lg { box-shadow: 0 0 0 1px #000000 inset, -2px -2px 0 #000000 inset, 2px 2px 0 #ffffff inset, -3px -3px 0 #808080 inset, 3px 3px 0 #dfdfdf inset }
.window--active .window__button--lg:before { position: absolute; inset: 4px }
.window__title { transform: translate(0, -1px) }
```

```js
addEventListener("mousemove", this.dragError.bind(this))
addEventListener("mouseleave", this.dragErrorEnd.bind(this))
```

### [Dialog UI](https://codepen.io/AdamBlum/pen/bGKYmmV)

held: fixed dialog | on hover of button.: button.: background | made with: position: fixed · <dialog>

```css
dialog { position: fixed; inset: 50vh 50vw; transform: translate(-50%, -50%) }
dialog > header > form[method="dialog"] button { background-position: center }
```

### [Modal](https://codepen.io/the-gureev/pen/jOKExLm)

made with: position: fixed · transition · :hover

```css
button.open { transition: all 0.3s; box-shadow: 0px 4px 27px -3px rgba(48, 168, 121, 0.6) }
button.open:hover { transform: scale(1.05); box-shadow: 0px 20px 27px -3px rgba(48, 168, 121, 0.6) }
button.open:active { box-shadow: 0px 4px 27px -3px rgba(48, 168, 121, 0.6) }
.modal-wrapper { position: fixed; top: 0; transition: all 0.3s }
.modal-wrapper.active { transition: all 0.3s }
.modal { position: fixed; top: -100%; transform: translateX(-50%) translateY(-50%); box-shadow: 0px 300vh 1200px -20px rgba(34, 60, 80, 0.2); transition: all 0.4s }
.modal.active { top: 50%; box-shadow: 0px 20px 60px -20px rgba(34, 60, 80, 0.2) }
.modal .modal-close { position: absolute; top: 0px; transform: translateX(30%) translateY(-30%); transition: transform 0.3s; box-shadow: 0 0 7px 0px #0000001c }
.btn { transform: translateY(0); transition: all 0.3s; box-shadow: 0px 0px 0px -8px rgba(34, 60, 80, 0.2) }
.btn:hover { transform: translateY(-3px); box-shadow: 0px 5px 20px -2px rgba(34, 60, 80, 0.2) }
```

### [Dialog Modal - HTML+JAVASCRIPT+CSS](https://codepen.io/iPingOi/pen/XWqQZdZ)

on hover of button.: button.: opacity | made with: transition · :hover · <dialog>

```css
#openModal { transition: opacity ease-in-out 0.2s }
#openModal:hover { opacity: 0.9 }
dialog { box-shadow: 0 0 1em rgb(0 0 0 /0.2) }
```

### [HTML Native Dialog Test](https://codepen.io/rpg2019/pen/bGMLLOv)

made with: transition · :hover · <dialog>

```css
p { margin-bottom: 1.6rem }
button { margin-bottom: 1.5rem; transition: background-color 0.2s linear }
dialog { box-shadow: -5px 5px 10px rgba(0, 0, 0, 0.4) }
dialog .model-content { position: relative }
dialog hr { margin-bottom: 1.5rem }
dialog button.close-modal { position: absolute; top: 0px }
```

### [Untitled](https://codepen.io/farif/pen/eYreaXN)

made with: backdrop-filter · <dialog>

```css
.container { position: relative }
.field { box-shadow: var(--shadow) }
.btn { text-transform: capitalize }
.iconbtn { box-shadow: none }
.box { box-shadow: var(--shadow) }
.borb { border-bottom: var(--border) }
.blur { filter: blur(6px) }
dialog::backdrop { backdrop-filter: blur(6px) }
```

### [Testing HTML dialog element](https://codepen.io/alexerlandsson/pen/eYreXdz)

made with: @keyframes · <dialog>

```css
0% { opacity: 0 }
100% { opacity: 1 }
0% { opacity: 0 }
100% { opacity: 1 }
dialog:modal { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 100vmax rgba(0, 0, 0, 0.2); -webkit-animation: fade-in 200ms ease; animation: fade-in 200ms ease }
dialog::-webkit-backdrop { opacity: 0 }
dialog::backdrop { opacity: 0 }
@keyframes fade-in animates opacity
```

### [Dialog Device authorisation](https://codepen.io/asmirbe/pen/QWrGorR)

held: fixed dialog | made with: transition · <dialog>

```css
dialog { box-shadow: 0px 10px 15px rgba(31, 41, 55, 0.1), 0px 0px 6px rgba(31, 41, 55, 0.05) }
dialog article .title p { margin-top: 16px }
dialog footer { margin-top: 16px }
input[type=radio] { box-shadow: 0px 1px 2px rgba(31, 41, 55, 0.1); transition: 0.2s ease-in }
input[type=radio]:before { position: absolute; transition: 0.2s ease-in }
.dropdown-btn { box-shadow: 0px 1px 2px rgba(31, 41, 55, 0.08) }
```

### [Nav access dialog](https://codepen.io/natjo/pen/rNvWmJR)

held: fixed div | made with: position: fixed · @keyframes · clip-path

```css
to { transform: translateX(0%) }
to { transform: translateX(0%) }
from { transform: translateX(0%) }
from { transform: translateX(0%) }
#nav [role="dialog"] { position: fixed; top: 0 }
#nav .dialog-content { transform: translateX(-100%) }
#nav.open .dialog-content { -webkit-animation: open .25s ease both; animation: open .25s ease both }
#nav.open.close .dialog-content { -webkit-animation: close .25s ease both; animation: close .25s ease both }
@keyframes open animates transform
@keyframes close animates transform
```

### [Popup Modal using html Dialog tag](https://codepen.io/mchawande/pen/NWMxjgZ)

made with: backdrop-filter · <dialog>

```css
.container { position: relative }
.field { box-shadow: var(--shadow) }
.btn { text-transform: capitalize }
.iconbtn { box-shadow: none }
.box { box-shadow: var(--shadow) }
.borb { border-bottom: var(--border) }
.blur { filter: blur(6px) }
dialog::backdrop { backdrop-filter: blur(6px) }
```

### [HTML Dialog Modal](https://codepen.io/saheeranas/pen/Baxyzxr)

on hover of button.: button.: background | made with: :hover · <dialog>

```css
dialog { position: relative }
dialog .btnCloseRightTop { position: absolute; top: 15px }
```

### [combo-box & dialog (pure javascript) beta](https://codepen.io/cfd-ack/pen/WNJNVGq)

held: fixed dialog.comboDropDown, fixed dialog.normal | made with: position: fixed · :hover · <dialog> · pointer / mouse tracking

```css
:root { --dialog-box-shadow: rgba(128, 96, 96, 0.5) }
body { position: relative }
.comboBox:focus-within { box-shadow: 0 0 1px 1px var(--outline-color, cyan) }
.comboBox > input[type="text"] + input[type="button"] { transform: scaleY(0.6); transform-origin: top }
dialog.comboDropDown { position: fixed }
dialog.comboDropDown:focus-within { box-shadow: 0 0 1px 1px var(--outline-color, cyan) }
dialog.normal { position: fixed; box-shadow: 0 0 2px 2px var(--dialog-box-shadow, rgba(128, 128, 128, 0.5)) }
.dialogTitleBar > .closeButton { position: relative }
.dialogTitleBar > .closeButton > span { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

```js
addEventListener('mousemove', dialogEvents.mousemove)
```

### [Portrait & dialogs on click](https://codepen.io/aelweak/pen/yLKrBOy)

made with: transition · :hover

```css
.dialogs-container { position: relative }
.dialog { position: absolute; opacity: 0; transition: all 1s ease-out }
.dialog:nth-child(odd) { transform: translateX(-500px) }
.dialog:nth-child(even) { transform: translateX(500px) }
.dialog.active { opacity: 1 }
.dialog.active:nth-child(odd) { transform: translateX(-300px) }
.dialog.active:nth-child(even) { transform: translateX(300px) }
.dialog::after { position: absolute; top: 50%; border-top: 10px solid transparent; border-bottom: 10px solid transparent }
.dialog:nth-child(odd)::after { transform: scaleX(-1) }
```

### [Tailwind UI html modal dialog, ft Alpinejs](https://codepen.io/npmhieu/pen/mdxaEbE)

held: fixed div.fixed, fixed div.fixed | made with: transition

### [Accessibility-Dialog](https://codepen.io/carlafranca/pen/xxWamBM)

made with: position: fixed

### [Dialog Element](https://codepen.io/loughlin/pen/dymjGeP)

made with: <dialog>

```css
dialog::backdrop { opacity: 0.5 }
button { box-shadow: 1px 1px 2px grey }
.blur { filter: blur(2px) }
```

### [Native modal dialog](https://codepen.io/clementmartin17/pen/NWYMzpJ)

made with: position: fixed · @keyframes · transition · :hover · <dialog>

```css
button { transition: background-color 0.25 ease-in-out }
dialog { box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25) }
dialog[open] { transform: scale(0); animation: dialog-show 0.5s 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) forwards }
0% { transform: scale(0) }
100% { transform: scale(1) }
dialog.hide { transform: scale(1); animation: dialog-hide 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards }
0% { transform: scale(1) }
100% { transform: scale(0) }
dialog::backdrop { position: fixed; top: 0; bottom: 0 }
dialog[open]::backdrop { transform: scaleY(0.01) scaleX(0); animation: dialog-show-backdrop 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards }
0% { transform: scaleY(0.005) scaleX(0) }
50% { transform: scaleY(0.005) scaleX(1) }
```

### [Native Dialog element](https://codepen.io/brumgb/pen/Yzawaea)

made with: :focus-visible · backdrop-filter · <dialog>

```css
dialog::-webkit-backdrop { -webkit-backdrop-filter: blur(0.15rem); backdrop-filter: blur(0.15rem) }
dialog::backdrop { -webkit-backdrop-filter: blur(0.15rem); backdrop-filter: blur(0.15rem) }
button:focus-visible, a:focus-visible { outline-offset: 2px }
```

### [Native Dialog Animations](https://codepen.io/brookesb91/pen/rNdVgVE)

made with: @keyframes · <dialog>

```css
dialog.zoom-in { animation-name: zoom-in; animation-duration: 0.6s }
dialog.slide-in { animation-name: slide-in; animation-duration: 0.6s }
dialog.fade-in { animation-name: fade-in; animation-duration: 0.6s }
from { transform: translatey(100%); opacity: 0 }
to { transform: translatey(0); opacity: 1 }
from { transform: scale(0) }
to { transform: scale(1) }
from { opacity: 0 }
to { opacity: 1 }
@keyframes slide-in animates transform, opacity
@keyframes zoom-in animates transform
@keyframes fade-in animates opacity
```

### [<dialog> element](https://codepen.io/galinhalx/pen/mdXvQOa)

made with: backdrop-filter · <dialog>

```css
dialog::backdrop { backdrop-filter: blur(3px) }
```

### [Hangman (Javascript for Kids) - Pre-Fixing Challenges](https://codepen.io/shikkaba/pen/RwQBGpY)

made with: nothing recognised — read the code

### [Set inert when opening modal](https://codepen.io/utilitybend/pen/rNJmpRp)

held: sticky header | on hover of button.btn: button.btn: background | made with: position: sticky · @keyframes · transition · :hover · <dialog>

```css
dialog { box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px; animation: scale-in 0.4s ease-out }
dialog header { position: sticky; top: 0; padding-bottom: 24px; border-bottom: 1px solid rgba(238, 118, 116, 1) }
dialog footer { border-top: 1px solid rgba(238, 118, 116, 1) }
dialog p:last-of-type { margin-bottom: 0 }
0% { opacity: 0 }
50% { opacity: 1; transform: scale(0.9) }
100% { transform: scale(1) }
.btn-primary { transition: all 0.24s }
.btn-primary-outline { transition: all 0.24s }
a { margin-top: 10px }
@keyframes scale-in animates opacity, transform
```

### [Nano dialog - HTMLDialogElement (v.0.1)](https://codepen.io/mi2oon/pen/ZErONaW)

made with: @keyframes · :has() · backdrop-filter · <dialog>

```css
main { -webkit-backdrop-filter: blur(0.2rem); backdrop-filter: blur(0.2rem) }
[data-component*=dialog] { box-shadow: var(--dialog-box-shadow, 0 25px 50px -12px rgba(0, 0, 0, 0.25)) }
[data-component*=dialog][open] { -webkit-animation: appear 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); animation: appear 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) }
[data-component*=dialog]::-webkit-backdrop { -webkit-backdrop-filter: blur(0.1rem); backdrop-filter: blur(0.1rem) }
[data-component*=dialog]::backdrop { -webkit-backdrop-filter: blur(0.1rem); backdrop-filter: blur(0.1rem) }
from { opacity: 0; transform: translateY(8rem) }
to { opacity: 1; transform: translateY(0) }
from { opacity: 0; transform: translateY(8rem) }
to { opacity: 1; transform: translateY(0) }
@keyframes appear animates opacity, transform
```

### [<dialog> Error Modal * shake animation | CPC](https://codepen.io/TheMOZZARELLA/pen/BaYKWbM)

made with: @keyframes · transition · :hover · backdrop-filter · <dialog>

```css
body { background-position: center }
article button { position: relative; transition: all 0.3s ease-in-out }
article > button { box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px }
article button:hover { transition: all 0.3s ease-in-out }
article button::after { position: absolute; transition: all 0.3s ease-in-out }
article button:hover::after { transition: all 0.3s ease-in-out }
article button label { position: absolute; top: 0 }
#popupOpen:checked ~ #popupShake { background-position: 30px 0, 30px 0, 0 0, 0 0; animation: shake 0.4s ease-in-out 1; animation-fill-mode: forwards }
#popupShake::backdrop { backdrop-filter: blur(10px) }
#popupShake > div { margin-bottom: 30px }
0% { transform: translateX(0px); opacity: 0 }
10% { transform: translateX(-10px) }
```

### [Dynamic Modal Dialog Box with Custom Style](https://codepen.io/thenanosoft/pen/vYdYprE)

made with: transition · :hover · <dialog>

```css
#dialogButtons { padding-top: 0 }
#dialogButtons button { box-shadow: #afafaf 5px 5px 10px 3px; transition: ease-in-out .3s }
#dialogButtons button:hover { transform: scale(1.1) }
dialog { box-shadow: #00000000 2px 2px 5px 2px }
#closeDialog { position: absolute; top: 10px }
#closeDialog:hover { transform: scale(1.2) }
#dialogBox span { margin-bottom: 10px }
dialog::backdrop { opacity: 0.3 }
#footer { margin-top: 100px }
```

### [Dialog with backdrop click close](https://codepen.io/utilitybend/pen/XWVxREm)

held: sticky header | made with: position: sticky · @keyframes · transition · :hover · <dialog>

```css
dialog { box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px; animation: scale-in 0.4s ease-out }
dialog header { position: sticky; top: 0; padding-bottom: 24px; border-bottom: 1px solid rgba(238, 118, 116, 1) }
dialog footer { border-top: 1px solid rgba(238, 118, 116, 1) }
dialog p:last-of-type { margin-bottom: 0 }
0% { opacity: 0 }
50% { opacity: 1; transform: scale(0.9) }
100% { transform: scale(1) }
.btn-primary { transition: all 0.24s }
.btn-primary-outline { transition: all 0.24s }
@keyframes scale-in animates opacity, transform
```

### [A dialog inside a dialog inside a dialog](https://codepen.io/utilitybend/pen/ZEvqLwX)

held: sticky header, sticky header, sticky header | on hover of button.btn: button.btn: background | made with: position: sticky · @keyframes · transition · :hover · <dialog>

```css
dialog { box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px; animation: scale-in 0.4s ease-out }
dialog header { position: sticky; top: 0; padding-bottom: 24px; border-bottom: 1px solid var(--theme-color) }
dialog footer { border-top: 1px solid var(--theme-color) }
dialog p:last-of-type { margin-bottom: 0 }
.confirm-dialog h2 { padding-bottom: 0 }
0% { opacity: 0 }
50% { opacity: 1; transform: scale(0.9) }
100% { transform: scale(1) }
body { background-position: 0 0, 3px 3px }
.btn-primary { transition: all 0.24s }
@keyframes scale-in animates opacity, transform
```

### [Accessible Modal Dialog](https://codepen.io/mikemai2awesome/pen/dyJgPxX)

held: sticky header | made with: position: sticky · position: fixed · @keyframes · :hover · :has() · prefers-reduced-motion · backdrop-filter · <dialog>

```css
.dialog { --animation-in-settings: 500ms cubic-bezier(0.25, 0, 0.3, 1) normal; --animation-out-settings: 500ms cubic-bezier(0.5, -0.5, 0.1, 1.5) normal }
.dialog[open] { -webkit-animation: slidein var(--animation-in-settings); animation: slidein var(--animation-in-settings) }
.dialog[open] { -webkit-animation: fadein var(--animation-in-settings); animation: fadein var(--animation-in-settings) }
.dialog.is-hidden { -webkit-animation: minimize var(--animation-out-settings); animation: minimize var(--animation-out-settings) }
.dialog.is-hidden { -webkit-animation: fadeout var(--animation-out-settings); animation: fadeout var(--animation-out-settings) }
.dialog header { position: sticky; top: 0; border-bottom: var(--border-width) solid }
.dialog::-webkit-backdrop { position: fixed; inset: 0; -webkit-backdrop-filter: blur(0.5rem); backdrop-filter: blur(0.5rem); -webkit-animation: none; animation: none }
.dialog::backdrop { position: fixed; inset: 0; -webkit-backdrop-filter: blur(0.5rem); backdrop-filter: blur(0.5rem); -webkit-animation: none; animation: none }
.dialog[open]::-webkit-backdrop { -webkit-animation: fadein var(--animation-in-settings); animation: fadein var(--animation-in-settings) }
.dialog[open]::backdrop { -webkit-animation: fadein var(--animation-in-settings); animation: fadein var(--animation-in-settings) }
.dialog.is-hidden::-webkit-backdrop { -webkit-animation: fadeout var(--animation-out-settings); animation: fadeout var(--animation-out-settings) }
.dialog.is-hidden::backdrop { -webkit-animation: fadeout var(--animation-out-settings); animation: fadeout var(--animation-out-settings) }
```

### [dialog modal / HTMLDialogElement](https://codepen.io/tomhermans/pen/abEaewx)

made with: :hover · <dialog>

```css
#dialog { position: relative; box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.2) }
#dialog h2 { margin-top: 0 }
#dialog p { margin-bottom: 1.6rem }
button.close { position: absolute; top: 4px }
```

### [Native Confirm Modal Dialog](https://codepen.io/deovenk/pen/oNpoJoV)

made with: @keyframes · <dialog>

```css
button small { opacity: 0.9 }
dialog { box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25) }
dialog[open] { animation: scale 0.3s ease normal }
dialog[open]::backdrop { animation: backdrop 0.3s ease normal }
dialog.hide { animation-direction: reverse }
from { transform: scale(0) }
to { transform: scale(1) }
from { opacity: 0 }
to { opacity: 1 }
@keyframes scale animates transform
@keyframes backdrop animates opacity
```

### [Dialog with sticky header in HTML](https://codepen.io/utilitybend/pen/mdpRoZq)

held: sticky header | made with: position: sticky · @keyframes · transition · :hover · <dialog>

```css
dialog { box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px; animation: scale-in 0.4s ease-out }
dialog header { position: sticky; top: 0; padding-bottom: 24px; border-bottom: 1px solid rgba(216, 209, 116, 1) }
dialog footer { border-top: 1px solid rgba(216, 209, 116, 1) }
dialog p:last-of-type { margin-bottom: 0 }
0% { opacity: 0 }
50% { opacity: 1; transform: scale(0.9) }
100% { transform: scale(1) }
body { background-position: 0 0, 3px 3px }
.btn-primary { transition: all 0.24s }
.btn-primary-outline { transition: all 0.24s }
@keyframes scale-in animates opacity, transform
```

### [HTML5 <dialog> with accessibility](https://codepen.io/didof/pen/QWadWYo)

held: fixed menu.center | made with: position: fixed · backdrop-filter · <dialog>

### [Popup modal with <dialog>](https://codepen.io/DuskoStamenic/pen/KKZVQdJ)

held: fixed div.modal-header | made with: position: fixed · :hover · <dialog>

```css
dialog { box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15); position: relative }
dialog::backdrop { opacity: .25 }
.modal-header { position: fixed; margin-top: -16px; padding-bottom: 10px; padding-top: 12px }
p { margin-bottom: 1.2em }
img { margin-top: 50px; margin-bottom: 20px }
button { margin-top: 20px }
```

### [Dialog element](https://codepen.io/mburridge/pen/eYyNgZM)

made with: @keyframes · <dialog>

```css
.container { padding-top: 32px }
button { margin-bottom: 16px }
dialog h2 { margin-bottom: 8px }
from { opacity: 0 }
to { opacity: 1 }
@keyframes fade-in animates opacity
```

### [Draggable MUI Dialog](https://codepen.io/tornadicshark/pen/QWaLNGg)

made with: nothing recognised — read the code

### [Modal Pure CSS](https://codepen.io/robsonklein23/pen/OJzLLNX)

held: fixed div.modal | on hover of label.btn: label.btn: transform+shadow+top | made with: position: fixed · transition · :hover

```css
h1 { margin-bottom: 1em }
.btn { box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15), inset 0 -3px 0 rgba(0, 0, 0, 0.1), inset 0 3px 0 rgba(255, 255, 255, 0.2); transition: all 0.3s ease }
.btn:hover { transform: scale(1.05); box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3) }
footer { position: absolute; bottom: 8vh }
footer ol li a { transition: all 0.3s ease }
footer ol li a:hover { opacity: 0.45 }
#target-modal:checked ~ .modal { opacity: 1 }
#target-modal:checked ~ .modal .modal-inner { transform: none }
.modal { position: fixed; top: 0; bottom: 0; opacity: 0; transition: all 0.3s ease-in-out }
.modal .modal-inner { position: relative; box-shadow: 0 4px 22px rgba(0, 0, 0, 0.45); transform: translate(0, 100%); transition: all 0.3s ease }
.modal .modal-inner .close-modal { position: absolute; top: 1.2rem; transition: all 0.3s ease }
.modal .modal-inner .close-modal:hover { opacity: 0.45 }
```

### [Dialog.js](https://codepen.io/jadsonlucena/pen/abVPvEe)

held: fixed custom-dialog, fixed custom-dialog | made with: nothing recognised — read the code

### [Modal](https://codepen.io/uxmankabir/pen/OJOBMqP)

held: fixed div.modal | made with: position: fixed · transition

```css
button { box-shadow: 0 0 3px -1px black }
.modal { position: fixed; top: 0 }
.modal .modal-dialog { box-shadow: 0 0 15px 0 black; transform: scale(0.9); transition: transform 0.3s ease-in-out }
.modal--show .modal-dialog { transform: scale(1) }
.modal__header { box-shadow: 0 0 3px -1px black }
```

### [Thin UI Modal Dialog (Vanilla JavaScript)](https://codepen.io/ciprian/pen/qBVpQNw)

made with: position: fixed · transition · :hover · popover

```css
.thin-ui-grid-push { margin-bottom: 16px }
.thin-ui-form input[type="text"], .thin-ui-form input[type="url"], .thin-ui-form { box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); transition: 100ms all ease-in-out }
.thin-ui-form input:hover, .thin-ui-form button:hover, .thin-ui-form select:hove { box-shadow: 0 4px 8px rgba(0, 0, 0, 0.075) }
.thin-ui-button { position: relative }
.thin-ui-button:hover { box-shadow: inset 0 99px 0 rgba(0, 0, 0, 0.05) }
.thin-ui-checkblock + label, .thin-ui-group-switch label { transition: all 0.1s ease-in-out }
.thin-ui-switch-container { position: relative }
.thin-ui-switch-container .thin-ui-switch { position: relative }
.thin-ui-switch-container .thin-ui-switch .thin-ui-switch-track { position: absolute; top: 0; transition: background-color 0.1s ease }
.thin-ui-switch .thin-ui-switch-button { position: absolute; top: 2px; bottom: 2px; transition: left 0.1s ease-in-out, right 0.1s ease-in-out }
.col--inner { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.025), 0 2px 4px rgba(0, 0, 0, 0.025), 0 4px 8px rgba(0, 0, 0, 0.025), 0 8px 16px rgba(0, 0, 0, 0.025) }
.col--inner-blank { box-shadow: none }
```

### [test scramble](https://codepen.io/yanwenge/pen/oNoNPdb)

made with: nothing recognised — read the code

### [Tailwind Modal + AlpineJS](https://codepen.io/christiaansnoei/pen/jOGgZvV)

held: fixed div.overflow-y-auto, fixed div.fixed | made with: transition

### [Vanilla JS Modal](https://codepen.io/allzen/pen/gOGqvNK)

made with: transition · :hover · backdrop-filter

```css
.modal__overlay { position: absolute; top: 0; -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px) }
.modal__wrapper { -webkit-box-shadow: -2px 4px 10px rgba(0, 0, 0, 0.2); box-shadow: -2px 4px 10px rgba(0, 0, 0, 0.2); position: absolute; opacity: 1; -webkit-transform: translateY(0px); -ms-transform: translateY(0px); transform: translate }
.modal__wrapper.hidden { opacity: 0; -webkit-transform: translateY(-50px); -ms-transform: translateY(-50px); transform: translateY(-50px) }
.modal__header { position: relative }
.modal__close { position: absolute; top: 0; -webkit-transition: -webkit-transform 0.4s ease; transition: -webkit-transform 0.4s ease; -o-transition: transform 0.4s ease; transition: transform 0.4s ease; transition: transform 0.4s ease,  }
.modal__close:hover { -webkit-transform: rotate(90deg); -ms-transform: rotate(90deg); transform: rotate(90deg) }
.btn { -webkit-box-shadow: -2px 4px 10px rgba(0, 0, 0, 0.2); box-shadow: -2px 4px 10px rgba(0, 0, 0, 0.2); -webkit-transition: background-position 1.5s ease; -o-transition: background-position 1.5s ease; transition: background- }
.btn:hover { background-position: 100% 0; -webkit-transition: background-position 0.5s ease; -o-transition: background-position 0.5s ease; transition: background-position 0.5s ease }
```

### [Simple HTML CSS Popup Dialog Box](https://codepen.io/code-boxx/pen/bGoOEVq)

made with: transition · backdrop-filter · <dialog>

```css
#ezpop { opacity: 0; transition: opacity 0.5s }
#ezpop[open] { opacity: 1 }
#ezclose { position: absolute; top: 0 }
body { background-position:center; backdrop-filter:blur(10px) }
#cbtitle { text-transform:uppercase }
#cbinfo { margin-top:30px; padding-top:15px; border-top:1px solid #ddd }
```

### [HTML dialog Modal PopUp](https://codepen.io/jonvemodev/pen/poWOydR)

made with: <dialog>

```css
.source { margin-bottom: 0 }
```

### [Drop File Upload Front-End CSS/JS Day 15](https://codepen.io/deboracamargos/pen/QWqqRER)

made with: @keyframes · transition · :hover

```css
.frame { position: absolute; top: 50%; margin-top: -200px; box-shadow: 4px 8px 16px 0 rgba(0, 0, 0, 0.1) }
.center { position: absolute }
.title { position: absolute; top: 50%; transform: translate(-200px, -200px); border-bottom: 5px solid #d9d9d9 }
.title h3 { margin-top: 7.5px }
.dropzone { position: absolute }
#img { position: absolute; opacity: 0 }
.syncing { opacity: 0.3 }
.upload { position: absolute; opacity: 0 }
.upload.active-b { -webkit-animation: load 3.8s ease-in-out forwards; animation: load 3.8s ease-in-out forwards }
.done { position: absolute; opacity: 0; transition: all 1s }
.done.active-c { -webkit-animation: done 1s ease-in 3.8s forwards; animation: done 1s ease-in 3.8s forwards }
.upload-btn { position: absolute; top: 80%; box-shadow: inset -3px -3px 5px #00000060 }
```

### [Popin](https://codepen.io/natjo/pen/LYzRKqJ)

held: fixed div.popin | made with: position: fixed · @keyframes · :focus-visible

```css
to { opacity: 1 }
to { opacity: 1 }
from { opacity: 1 }
from { opacity: 1 }
.popin { position: fixed; top: 0; opacity: 0 }
.popin .btn-close { margin-top: -25px }
.popin[aria-hidden="false"] { -webkit-animation: popin-open .3s ease both; animation: popin-open .3s ease both }
.popin[aria-hidden="false"].close { -webkit-animation: popin-close .3s ease both; animation: popin-close .3s ease both }
@keyframes popin-open animates opacity
@keyframes popin-close animates opacity
```

### [Full-height scrollable dialog](https://codepen.io/Timotej/pen/MWEjGbQ)

made with: nothing recognised — read the code

```css
.popup { position: absolute; -webkit-box-shadow: 5px 5px 15px 5px #c5c9d5; box-shadow: 5px 5px 15px 5px #c5c9d5 }
.popup__footer hr { opacity: 0.5 }
.popup__cross { opacity: 0.75 }
.popup__header>hr { margin-top: 62px; opacity: 0.5 }
.form__stats { margin-bottom: 30px }
.form__stats_btn p { opacity: 0.65 }
.form__stats_btn .fa-circle { margin-top: 4px }
.form__stats_btn .fa-flag-checkered { transform: rotate(30deg) }
.form__textarea::placeholder { opacity:0.6 }
.form__title { margin-bottom: 35px; margin-top:0 }
.form__attach { margin-top: 30px }
```

### [Bottom Dialog Popup](https://codepen.io/johfarrell/pen/yLorEyN)

held: fixed div.overlay, fixed div.popUpContainer | made with: position: fixed · transition

```css
.overlay { position: fixed; top: 0; bottom: 0 }
.popUpContainer { position: fixed; bottom: -250px; box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2); transition: 0.3s ease-in-out }
.popUpActive { bottom: 0px }
button:active { box-shadow: 0 0 0; transform: translateY(5px) }
.closeBtn { box-shadow: 0 5px 0 #990d35 }
.openBtn { box-shadow: 0 5px 0 #638475 }
```

### [测试dialog窗](https://codepen.io/liu-surname/pen/porpBzz)

made with: view() timeline

### [Native Dialog](https://codepen.io/Oblomoff/pen/yLXGJqE)

made with: <dialog>

### [CSS練習](https://codepen.io/afa34/pen/PojoaOa)

held: fixed div.container | on scroll: div.dot: shadow | made with: position: fixed · @keyframes

```css
.container { position: fixed; top: 0 }
.dialog { position: relative }
.dialog::before { position: absolute; bottom: -50px }
.dialog::after { position: absolute; top: 0 }
.moon { box-shadow: inset -35px 0px 10px rgba(255, 215, 1, 0.8) }
.loading-container .dot { box-shadow: 80px 0 #EBE421, 0 80px #EBE421, -80px 0 #EBE421, 0 -80px #EBE421, -56.5px -56.5px #EBE421, 56.5px -56.5px #EBE421, -56.5px 56.5px #EBE421, 56.5px 56.5px #EBE421; animation: loading 0.6s infinite }
0%, 100% { box-shadow: 80px 0 #EBE421, 0 80px #EBE421, -80px 0 #EBE421, 0 -80px #BAB414, -56.5px -56.5px #EBE421, 56.5px -56.5px #EBE421, -56.5px 56.5px #EBE421, 56.5px 56.5px #EBE421 }
12.5% { box-shadow: 80px 0 #EBE421, 0 80px #EBE421, -80px 0 #EBE421, 0 -80px #EBE421, -56.5px -56.5px #EBE421, 56.5px -56.5px #BAB414, -56.5px 56.5px #EBE421, 56.5px 56.5px #EBE421 }
25% { box-shadow: 80px 0 #BAB414, 0 80px #EBE421, -80px 0 #EBE421, 0 -80px #EBE421, -56.5px -56.5px #EBE421, 56.5px -56.5px #EBE421, -56.5px 56.5px #EBE421, 56.5px 56.5px #EBE421 }
37.5% { box-shadow: 80px 0 #EBE421, 0 80px #EBE421, -80px 0 #EBE421, 0 -80px #EBE421, -56.5px -56.5px #EBE421, 56.5px -56.5px #EBE421, -56.5px 56.5px #EBE421, 56.5px 56.5px #BAB414 }
50% { box-shadow: 80px 0 #EBE421, 0 80px #BAB414, -80px 0 #EBE421, 0 -80px #EBE421, -56.5px -56.5px #EBE421, 56.5px -56.5px #EBE421, -56.5px 56.5px #EBE421, 56.5px 56.5px #EBE421 }
62.5% { box-shadow: 80px 0 #EBE421, 0 80px #EBE421, -80px 0 #EBE421, 0 -80px #EBE421, -56.5px -56.5px #EBE421, 56.5px -56.5px #EBE421, -56.5px 56.5px #BAB414, 56.5px 56.5px #EBE421 }
```

### [Simple Todo, No Framework/Library](https://codepen.io/litjog/pen/qBjWzaK)

made with: :hover · backdrop-filter · <dialog>

```css
dialog { box-shadow: 0 3px 10px rgb(0 0 0 / 0.2) }
dialog::backdrop { backdrop-filter: blur(10px) }
.mb-1 { margin-bottom: 0.25rem }
.m-1 { margin-bottom: 0.25rem }
```

### [Fylgja Base - Showcasing the power of classless styling with the HTML Dialog](https://codepen.io/Fylgja/pen/rNmXjRo)

held: fixed dialog, fixed dialog.offcanvas | made with: <dialog>

### [::backdrop for a dialog](https://codepen.io/seyedi/pen/QWvdNrm)

made with: <dialog>

### [Dialog - LogoAnimation](https://codepen.io/vihanga/pen/wvJpzWO)

made with: @keyframes

```css
.logo { position: absolute; top: 50%; transform: translate(-50%, -50%) }
svg { transform: scale(3) }
0% { transform: translate(729.9955px, 0px) }
27.0625% { transform: translate(729.9955px, 0px) }
36.75% { transform: translate(0px, 0px) }
43.75% { transform: translate(29.9955px, 0px) }
50% { transform: translate(0.2155px, 0.000011px) }
100% { transform: translate(0.2155px, 0.000011px) }
0% { opacity: 0 }
25% { opacity: 0 }
37.5% { opacity: 1 }
100% { opacity: 1 }
```

### [a11y : Dialog Modal](https://codepen.io/hello-antonio/pen/qBrXeeG)

held: fixed div, fixed div.dialog, fixed div.dialog-mask | made with: position: fixed

```css
#dialog { position: fixed }
.dialog-mask { position: fixed }
.dialog-wrap { position: relative }
.dialog { position: fixed; top: 25vh }
```

### [Concept A11y Lightbox](https://codepen.io/JMChristensen/pen/dyvPeWG)

held: fixed div.dialog, fixed div.dialog__overlay, fixed button.dialog__close, fixed button.dialog__fullscreen, fixed button.dialog__previous, fixed button.dialog__next | made with: position: fixed · scroll() timeline · scroll-snap · @keyframes · :hover · clip-path · mask · IntersectionObserver · requestAnimationFrame

```css
.dialog { bottom: 0; position: fixed; top: 0 }
.dialog:-webkit-full-screen .dialog__fullscreen { -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M15.984 8.016h3v1.969h-4.969V5.016h1.969v3zm-1.968 10.968v-4.969h4.969v1.969h-3v3h-1.969zm-6-10.968v- }
.dialog:-ms-fullscreen .dialog__fullscreen { mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M15.984 8.016h3v1.969h-4.969V5.016h1.969v3zm-1.968 10.968v-4.969h4.969v1.969h-3v3h-1.969zm-6-10.968v-3h1.969v }
.dialog:fullscreen .dialog__fullscreen { -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M15.984 8.016h3v1.969h-4.969V5.016h1.969v3zm-1.968 10.968v-4.969h4.969v1.969h-3v3h-1.969zm-6-10.968v- }
.dialog__overlay { -webkit-animation: fade-in 200ms both; animation: fade-in 200ms both; bottom: 0; position: fixed; top: 0 }
.dialog__content { -webkit-animation: fade-in 400ms 200ms both; animation: fade-in 400ms 200ms both }
.dialog__region { -ms-scroll-snap-type: x mandatory; scroll-snap-type: x mandatory }
.dialog__region:focus { outline-offset: -6px }
.dialog__images-item { scroll-snap-align: center }
.dialog__controls { position: absolute; top: 0 }
.dialog__control { -webkit-mask-position: center; mask-position: center; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-size: 2rem; mask-size: 2rem; opacity: 0.5; position: fixed; transition-property: border-color, op }
.dialog__control:hover, .dialog__control:focus { opacity: 1 }
```

```js
requestAnimationFrame()
requestAnimationFrame(function () {
new IntersectionObserver(callback, options)
```

### [Pop-up / dialog toggle](https://codepen.io/ind88/pen/ExWawVy)

held: fixed button.dialog__button, fixed div.dialog, fixed div.credits | made with: position: fixed · transition

```css
.credits { position: fixed; bottom: 0 }
.dialog { position: fixed; transition: opacity 300ms ease-in-out, visibility 300ms ease-in-out }
.dialog[aria-hidden=true] { opacity: 0 }
.dialog[aria-hidden=true] .dialog__wrapper { transform: scale(0.8) }
.dialog__wrapper { box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16); position: relative; transition: transform 300ms ease-in-out }
.dialog__button { transition: all 300ms ease-in-out }
.dialog__button--close { position: absolute; top: 20px }
.dialog__button--open { position: fixed; bottom: 0; opacity: 0; transform: translateY(100%) }
.dialog__button--open.dialog__button--toggle { transform: translateY(0) }
.dialog__button--toggle { opacity: 1 }
.dialog__button-icon { vertical-align: top }
```

### [Random Doodle 7](https://codepen.io/thefeldkircher/pen/GRrLWYo)

on scroll: li.: transform+top ×8 | on hover of li.: li.: transform+top ×8 | made with: @keyframes · :hover

```css
.topHalf { position: relative }
.topHalf p { margin-bottom: 30px }
.bg-bubbles { position: absolute; top: 0 }
li { position: absolute; bottom: -160px; -webkit-animation: square 20s infinite; animation: square 20s infinite }
li:nth-child(2) { animation-delay: 2s; animation-duration: 17s }
li:nth-child(3) { animation-delay: 4s }
li:nth-child(4) { animation-duration: 22s }
li:nth-child(6) { animation-delay: 3s }
li:nth-child(7) { animation-delay: 7s }
li:nth-child(8) { animation-delay: 15s; animation-duration: 40s }
li:nth-child(9) { animation-delay: 2s; animation-duration: 40s }
li:nth-child(10) { animation-delay: 11s }
```

### [Retro style dialog w/ stutter effect](https://codepen.io/chipmo/pen/abpQYjM)

held: fixed div.dg | made with: nothing recognised — read the code

```css
#retroDialogWrapper { padding-top: 5em }
#retroDialogWrapper .dialogWindow { position: absolute; padding-bottom: 1em }
#retroDialogWrapper .dialogWindow .topBar { position: relative; bottom: 2px }
#retroDialogWrapper .dialogWindow .topBar button { position: relative }
#retroDialogWrapper .dialogWindow .topBar button span { position: relative; bottom: 1px }
#retroDialogWrapper .dialogInner p { margin-top: 0px; padding-bottom: 6px }
button.resetButton { position: absolute; bottom: 10px }
```

### [From button to dialog](https://codepen.io/camilleguy/pen/bGgYgaW)

made with: @keyframes

```css
.animated-in .content { animation: fadeIn 0.3s ease-out both }
.animated-in .content:nth-child(1) { animation-delay: 0.12s }
.animated-in .content:nth-child(2) { animation-delay: 0.24s }
.animated-in .content:nth-child(3) { animation-delay: 0.36s }
.animated-in .content:nth-child(4) { animation-delay: 0.48s }
0% { opacity: 0; transform: translateY(20px) }
100% { opacity: 1 }
@keyframes fadeIn animates opacity, transform
```

### [Dialog Pop-up](https://codepen.io/skoliver89/pen/OJWLGGj)

held: fixed div, fixed div | made with: position: fixed

```css
div#dialog-wrapper { position: fixed }
div#dialog-wrapper div#dialog-background { position: absolute }
div#dialog-wrapper div#dialog { position: fixed; top: 50%; transform: translate(-50%, -50%); box-shadow: -4px 0 10px 0 rgba(0, 0, 0, 0.4) }
div#dialog-wrapper div#dialog div#dialog-header { border-bottom: 1px solid rgba(0, 0, 0, 0.3) }
div#dialog-wrapper div#dialog div#dialog-body { bottom: 80px }
```

### [Modal dialog with vanilla CSS](https://codepen.io/max131/pen/oNYdjyL)

held: fixed div.donate | on hover of a.button: a.button: shadow | made with: position: fixed · transition · :hover

```css
* { transition: 0.15s }
body { position: relative }
.button:hover { box-shadow: 0 0 3px dimgray }
.modal:target { opacity: 1 }
.modal { position: absolute; top: 0; opacity: 0 }
.modal-header { margin-top: 1rem; margin-bottom: 1rem }
.buttons { margin-top: 1rem }
.donate { position: fixed; bottom: 0.25rem }
.donate a { border-bottom: 2px solid transparent; transition: 0.35s }
```

### [System 1 Inspired Dialog](https://codepen.io/fbry/pen/vYyZRWB)

made with: nothing recognised — read the code

```css
.dialog { position: relative; padding-top: calc(var(--unit) * 3); box-shadow: 0.125rem 0.25rem currentcolor }
.dialog::before { position: absolute; top: 0 }
.dialog::after { position: absolute; top: 0; box-shadow: 0px 2px var(--black) }
h1 { margin-bottom: var(--baseline) }
```

### [Untitled](https://codepen.io/brock8282/pen/oNzRemj)

held: fixed div.modalbg | made with: position: fixed · @keyframes · transition · :hover

```css
.button { position: relative; top: 50px; box-shadow: 1px 1px 1px #fff; -moz-box-shadow: 1px 1px 1px #fff; -webkit-box-shadow: 1px 1px 1px #fff; -moz-transition: all 0.5s ease-out; -webkit-transition: all 0.5s ease-out; -o-transiti }
.button:hover { -moz-transition: all 0.5s ease-out; -webkit-transition: all 0.5s ease-out; -o-transition: all 0.5s ease-out; transition: all 0.5s ease-out }
.modalbg { position: fixed; top: 0; bottom: 0; -moz-transition: all 2s ease-out; -webkit-transition: all 2s ease-out; -o-transition: all 2s ease-out; transition: all 2s ease-out }
.modalbg .dialog { position: relative; top: -1000px; box-shadow: 0 0 10px #000; -moz-box-shadow: 0 0 10px #000; -webkit-box-shadow: 0 0 10px #000 }
.modalbg .dialog .ie7 { filter: progid:DXImageTransform.Microsoft.Shadow(color='#000', Direction=135, Strength=3) }
.modalbg:target { -moz-transition: all 0.5s ease-out; -webkit-transition: all 0.5s ease-out; -o-transition: all 0.5s ease-out; transition: all 0.5s ease-out }
.modalbg:target .dialog { top: -20px; -moz-transition: all 0.8s ease-out; -webkit-transition: all 0.8s ease-out; -o-transition: all 0.8s ease-out; transition: all 0.8s ease-out }
.close { position: absolute; top: -10px; box-shadow: 0 0 10px #000; -moz-box-shadow: 0 0 10px #000; -webkit-box-shadow: 0 0 10px #000; -moz-transition: all 0.5s ease-out; -webkit-transition: all 0.5s ease-out; -o-transition: all  }
.close .ie7 { filter: progid:DXImageTransform.Microsoft.Shadow(color='#000', Direction=135, Strength=3) }
.close:hover { -moz-transition: all 0.5s ease-out; -webkit-transition: all 0.5s ease-out; -o-transition: all 0.5s ease-out; transition: all 0.5s ease-out }
.tab_container { padding-top: 0px; position: relative }
input, section { padding-top: 10px }
```

### [Biden Clock](https://codepen.io/jrcharney/pen/LYRawGY)

held: fixed div.modal | made with: position: fixed · transition · :hover

```css
body > #vertical > header, body > #vertical > footer { opacity: 0; transition: opacity 0.5s ease }
body:hover > #vertical > header, body:hover > #vertical > footer { opacity: 1 }
.modal { position: fixed; top: 0 }
.modal-content { padding-top: 0px }
.modal-title { position: relative }
.close { position: absolute; top: 0px; transition: color 0.5s ease }
```

### [Input form on <dialog>](https://codepen.io/azuki9/pen/KKgEdeZ)

made with: <dialog>

### [Date Picker inside dialog - Vuetify](https://codepen.io/abdelsalam-shahlol/pen/poEYJqN)

made with: nothing recognised — read the code

### [Pure CSS | Contact Form Dialog | Concept Design](https://codepen.io/takaneichinose/pen/poEqojV)

held: fixed div.contact-modal | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter

```css
.front-text { filter: drop-shadow(0, 0, 0.1em, #000000) }
.btn-open { margin-top: 0.5em; box-shadow: 0 0.1em 0.3em rgba(0, 0, 0, 0.5), 0 -0.5em 1em rgba(0, 0, 0, 0.4) inset; transition: box-shadow 32ms ease-out, color 32ms ease-out }
.btn-open:active { box-shadow: 0 0 0 rgba(0, 0, 0, 0.5), 0 1em 2em rgba(0, 0, 0, 0.5) inset }
#frmContactForm:checked + .contact-modal { opacity: 1; transition: opacity 160ms ease-out, width 0ms ease-out, height 0ms ease-out }
#frmContactForm:checked + .contact-modal .contact-form { animation: contact-form-show 160ms ease-out }
0% { transform: translateY(-100%); opacity: 0 }
100% { transform: translateY(0); opacity: 1 }
.contact-modal { position: fixed; top: 0; opacity: 0; transition: opacity 160ms ease-out, width 0ms ease-out 160ms, height 0ms ease-out 160ms }
.contact-form { box-shadow: 0 2em 3em rgba(0, 0, 0, 0.5); backdrop-filter: blur(0.4em) }
.contact-section { padding-bottom: 1.5em }
.contact-section:last-child { padding-bottom: 0 }
.mb-whole { margin-bottom: 1em }
```

### [Speech bubble with pointer](https://codepen.io/bytrangle/pen/WNGyggX)

made with: nothing recognised — read the code

```css
.image-wrapper { position: relative }
.image-wrapper img { padding-top: 2% }
#speech-bubble { position: absolute; top: 86% }
#speech-bubble::before, #speech-bubble::after { position: absolute; bottom: 100%; transform-origin: left bottom; transform: skewX(15deg) }
#speech-bubble::before { border-bottom: solid 14px var(--orange) }
#speech-bubble::after { border-bottom: solid 12px white }
.box { box-shadow: 0 3px 6px var(--grey4) }
.btn__close { position: absolute; top: -15% }
```

### [Promise-based Alert, Confirm, Prompt dialog box Web Components](https://codepen.io/takaneichinose/pen/LYRrQmW)

made with: position: fixed · @keyframes · transition

```css
.btn { margin-top: 0.9em; box-shadow: 0 0.4em #1123c2, 0 0.5em 1em rgba(0, 0, 0, 0.8); transition: box-shadow 125ms ease-out, transform 125ms ease-out }
.btn:focus, .btn:active { box-shadow: 0 0 #1123c2, 0 0 0 rgba(0, 0, 0, 0.8); transform: translateY(0.4em) }
```

### [HTML dialog element as a modal/pop-up](https://codepen.io/nikitahl/pen/qBaNbvK)

made with: @keyframes · <dialog>

```css
dialog { box-shadow: 0 3px 10px 2px rgba(0, 0, 0, 0.5) }
dialog[open] { -webkit-animation: toggle-modal .3s ease-in-out; animation: toggle-modal .3s ease-in-out }
input, button { margin-bottom: 5px }
.open-modal { margin-bottom: 40px }
from { opacity: 0 }
to { opacity: 1 }
from { opacity: 0 }
to { opacity: 1 }
@keyframes toggle-modal animates opacity
```

### [React Dialog Modal](https://codepen.io/masha_tatosh/pen/wvzGxVN)

held: fixed div.overlay | made with: position: fixed · transition · :hover

```css
.confirm { transition: .6s; position: absolute; top: -280px }
.confirm.show { top: calc(50% - 140px) }
.confirm-content h4 { position: relative }
.confirm-content h4::after { position: absolute; bottom: -7px }
.confirm-content h2 { margin-top: 3rem }
.confirm-content p { margin-top: .5rem }
.overlay { position: fixed; top: 0 }
```

### [TO-DO List JS](https://codepen.io/mkgbri18/pen/bGeKYyz)

made with: transition · :hover · <dialog>

```css
.modal { position: absolute; top: 10%; box-shadow: 0 3px 15px rgba(100, 100, 100, 0.5) }
.modal__close { position: absolute; top: 20px }
.modal__close--icon { position: absolute }
.modal__close--icon::before, .modal__close--icon::after { position: absolute }
.modal__close--icon::before { transform: rotate(45deg) }
.modal__close--icon::after { transform: rotate(-45deg) }
.modal .task__form { padding-top: 0.6em }
.modal .task__form input[class*=task__] { border-bottom: 1px solid #333; margin-bottom: 1em }
.modal .task__cta--add, .modal .task__cta--clean { margin-top: 1em; margin-bottom: 0.5em }
.modal .task__cta--add:disabled, .modal .task__cta--clean:disabled { filter: grayscale(60%) }
.container { box-shadow: 0 2px 5px -1px #000 }
.container .task__new--btn { position: relative }
```

### [A11y Modal](https://codepen.io/jackdomleo7/pen/yLJLOQr)

held: fixed dialog.modal__content, fixed div.modal__overlay | made with: position: fixed · transition · <dialog>

```css
.modal__overlay { position: fixed; top: 0; bottom: 0 }
.modal__content { position: fixed; top: 50%; transform: translate(-50%, -50%) }
.modal__close { position: absolute !important; top: 0.5rem; transition: 0.15s }
.modal__close { top: 1rem }
```

### [dialog(not:JS)](https://codepen.io/shoegaze-k/pen/xxVaBpY)

held: fixed label | made with: position: fixed · @keyframes

```css
.modalPopup01 > input:nth-child(1) + label { position: fixed; top: 50%; transform: translate(-50%, -50%) }
.modalPopup01 > input:nth-child(1):checked + label + input:nth-child(3) + label  { position: fixed; top: 50%; transform: translate3d(-50%, -50%, 1px) }
.modalPopup01 > input:nth-child(1):checked + label + input:nth-child(3) + label { position: fixed; top: 0; transform: translate3d(0, 0, 1px) }
.modalPopup01 > input:nth-child(1):checked + label + input:nth-child(3) + label  { position: fixed; bottom: 5%; animation: fadeIn 1s ease 0s 1 normal; transform: translate3d(-50%, 0, 1px) }
.modalPopup02 { animation: fadeIn 1s ease 0s 1 normal }
0% { opacity: 0 }
100% { opacity: 1 }
@keyframes fadeIn animates opacity
```

### [Firework Dialog](https://codepen.io/alphardex/pen/yLOxaxR)

held: fixed div.backdrop, fixed div.dialog | on scroll: div.: transform+opacity+top ×298, div.: transform+opacity ×2, div.dialog: transform+top | made with: custom properties driven by JS · GSAP

```css
.-top-6 { top: -6rem }
.emitter { position: relative }
.emitter div { position: absolute; top: 0 }
```

```js
gsap.registerPlugin(Physics2DPlugin)
style.setProperty("--particle-color", sample(colors))
gsap.timeline({
```

### [Dialog](https://codepen.io/oagoulart/pen/NWNXzPb)

held: fixed div.dialog-fade, fixed div.dialog-content | on scroll: button.button: background | made with: position: fixed · @keyframes

```css
0% { opacity: 0 }
100% { opacity: 1 }
0% { opacity: 0 }
100% { opacity: 1 }
.dialog .dialog-content { position: fixed; transform: translate(-50%, 50%) }
.dialog .dialog-content .dialog-close { position: absolute; top: 14px }
.dialog .dialog-fade { position: fixed; top: 0 }
.dialog.is-active .dialog-content, .dialog.is-active .dialog-fade { -webkit-animation-name: fade-in; animation-name: fade-in; -webkit-animation-duration: 0.3s; animation-duration: 0.3s; -webkit-animation-fill-mode: both; animation-fill-mode: both }
@keyframes fade-in animates opacity
```

### [Simple form modal with vuetify](https://codepen.io/leticiacardoso/pen/wvGpzbW)

made with: nothing recognised — read the code

### [Simple modal with vuetify](https://codepen.io/leticiacardoso/pen/XWdVjVz)

made with: nothing recognised — read the code

### [Just another basic modal](https://codepen.io/BlitzCaser/pen/rNxXNKx)

held: fixed div.basic-layer__wrapper | made with: position: fixed · :hover

```css
pre { border-bottom: 0.1rem solid #071e18; position: relative; margin-bottom: 1.618rem }
pre:before { position: absolute; bottom: 0 }
h1, h2, p { margin-bottom: 1.618rem }
li { position: relative }
li:before { position: absolute; top: 0.682rem }
.basic-layer__wrapper { position: fixed; top: 0 }
.basic-layer__content { position: absolute; padding-bottom: 20px; transform: translate(-50%, -50%); top: 50% }
.basic-layer__close { position: absolute; top: 22px }
.basic-layer__close:before, .basic-layer__close:after { position: absolute }
.basic-layer__close:before { transform: rotate(45deg) }
.basic-layer__close:after { transform: rotate(-45deg) }
```

### [Basic modal](https://codepen.io/BlitzCaser/pen/MWKdMpw)

made with: position: fixed · :hover

```css
pre { border-bottom: 0.1rem solid #071e18; position: relative; margin-bottom: 1.618rem }
pre:before { position: absolute; bottom: 0 }
h1, h2, p { margin-bottom: 1.618rem }
li { position: relative }
li:before { position: absolute; top: 0.682rem }
.layer__wrapper { position: fixed; top: 0 }
.layer__content { position: absolute; padding-bottom: 20px; transform: translate(-50%, -50%); top: 50% }
.layer__close { position: absolute; top: 22px }
.layer__close:before, .layer__close:after { position: absolute }
.layer__close:before { transform: rotate(45deg) }
.layer__close:after { transform: rotate(-45deg) }
```

### [AngularJs Modal](https://codepen.io/ashokpurohit/pen/abdaRpQ)

made with: @keyframes · transition

```css
body { position: relative }
.btn-modal { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.btn-modal .btn-text { transition: 1 ease-in-out }
.card { position: absolute; top:0; animation-name: card-anim; animation-duration: 1s; animation-fill-mode: forwards }
from { opacity: 0 }
to { opacity: 1 }
.card .modal-wrap { position: relative }
.btn { margin-bottom: 0 }
.show-anim { animation: modal-anim 1s }
from { opacity: 0; transform: scale(0) }
to { opacity: 1; transform: scale(1) }
@keyframes card-anim animates opacity
```

### [ReactJS Dialog Box Component With Dark Mode](https://codepen.io/takaneichinose/pen/jOWBpxq)

on hover of button.dialog-trigger-button: button.dialog-trigger-button: background | made with: position: fixed · @keyframes · transition · :hover

```css
.dialog-overlay { position: fixed; top: 0; animation: dialog-overlay-show 225ms ease-out }
.dialog-overlay .dialog-box { box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.5); transform: scale(0); animation: dialog-box-show 250ms cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards }
.dialog-overlay .dialog-box .dialog-input input[type=text] { box-shadow: 0 0 0 0 rgba(59, 180, 255, 0.75); transition: box-shadow 150ms ease-out }
.dialog-overlay .dialog-box .dialog-input input[type=text]:focus { box-shadow: 0 0 0 0.25rem rgba(59, 180, 255, 0.75) }
.dialog-overlay .dialog-box .dialog-command .dialog-button { transition: background-color 150ms ease-out }
0% { opacity: 0 }
100% { opacity: 1 }
0% { transform: scale(0) }
100% { transform: scale(1) }
.dialog-trigger-button { box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.5); transition: background-color 150ms ease-out, box-shadow 150ms ease-out, transform 150ms ease-out }
.dialog-trigger-button:active { box-shadow: 0 0rem 0rem rgba(0, 0, 0, 0.5); transform: translateY(0.2rem) }
@keyframes dialog-overlay-show animates opacity
```

### [Black Lives Matter Dialog Boxes](https://codepen.io/riojosdev/pen/RwrROqy)

made with: nothing recognised — read the code

```css
.box { position: relative }
.center { padding-top: 50% }
.dialog-1 { position: absolute }
.left-point { border-top: 10vh solid var(--main-dark-color); position: absolute; top: 45%; transform: rotate(60deg) }
.dialog-2 { position: absolute }
.right-point { border-top: 10vh solid var(--main-light-color); position: absolute; top: 45%; transform: rotate(-60deg) }
```

### [TicTacToe v.3.5 In ReactJS](https://codepen.io/takaneichinose/pen/qBOxYyg)

made with: @keyframes · transition

```css
.tiles { --shadow-opacity: 0.4; box-shadow: 0 1.5vmin rgba(0, 0, 0, var(--shadow-opacity)) }
.tile { box-shadow: 0 var(--shadow-size) rgba(0, 0, 0, var(--shadow-opacity)), 0 0 0 rgba(0, 0, 0, var(--shadow-opacity)) inset; transition: background-color var(--transition-time) ease-out, box-shadow var(--transition-time) eas }
.tile:active:not(.disabled), .tile.active, .tile.disabled.active { box-shadow: 0 0 rgba(0, 0, 0, var(--shadow-opacity)), 0 var(--shadow-size) calc(var(--shadow-size) * 2) rgba(0, 0, 0, var(--shadow-opacity)) inset; transform: translateY(var(--shadow-size)) }
.turn { vertical-align: top }
.turn-0 { position: relative }
.turn-0:before, .turn-0:after { position: absolute; top: 22% }
.turn-0:before { transform: rotate(-45deg); animation: turn-0 var(--draw-time) ease-out forwards }
.turn-0:after { transform: rotate(45deg); animation: turn-0 var(--draw-time) ease-out var(--draw-time) forwards }
.turn-1 { transform: rotate(-90deg); animation: turn-1 500ms ease-out forwards }
.modal-window { position: absolute; top: 0; transform: scale(0); transition: transform 250ms ease-out }
.modal-window.shown { transform: scale(1) }
.btn { --shadow-opacity: 0.5 }
```

### [Dialog](https://codepen.io/iounini/pen/mderVqV)

held: fixed div.dialog, fixed div.dialog | made with: position: fixed · transition · backdrop-filter

```css
.btn { position: absolute; top: 8% }
.dialog { position: fixed; top: 0; bottom: 0 }
.dialog-active { opacity: 0; transition: 0.6s ease }
.dialog-active.active { opacity: 1 }
.dialog:before { position: fixed }
.dialog-active:before { backdrop-filter: blur(0px); transition: 0.6s ease }
.dialog-active.active:before { backdrop-filter: blur(6px); transition: 3s ease-in-out }
.dialog-content { position: relative; box-shadow: 0 0 1rem #00000030 }
.dialog-body { position: relative }
```

### [User friendly Modal with vanilla JS](https://codepen.io/iamrubberducky/pen/GRpKdjb)

held: fixed div.modal-container | made with: position: fixed · scroll listener

```css
.modal-container { opacity: 0; position: fixed; top: 0 }
.is-open { opacity: 1 }
#close { position: absolute; top: 0 }
```

```js
addEventListener('scroll', onScroll)
```

### [Modal Box](https://codepen.io/Beni70/pen/ExjpmYx)

made with: transition · :hover

```css
.center, .content { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.click-me { transition: 0.5s }
.content { opacity: 0; transition: 0.3s ease-in; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4) }
#click:checked ~ .content { opacity: 1 }
.header { box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2) }
.fa-times { position: absolute; top: 20px }
.fa-check { padding-top: 13px }
p { padding-top: 10px }
.line { position: absolute; bottom: 65px }
.close-btn { position: absolute; bottom: 12px }
.close-btn:hover { transition: 0.5s }
```

### [TicTacToe v.3 with multiple options](https://codepen.io/takaneichinose/pen/poJVpvZ)

made with: @keyframes · transition

```css
.tiles { --shadow-opacity: 0.4; box-shadow: 0 1.5vmin rgba(0, 0, 0, var(--shadow-opacity)) }
.tile { box-shadow: 0 var(--shadow-size) rgba(0, 0, 0, var(--shadow-opacity)), 0 0 0 rgba(0, 0, 0, var(--shadow-opacity)) inset; transition: background-color var(--transition-time) ease-out, box-shadow var(--transition-time) eas }
.tile:active:not(.disabled), .tile.active, .tile.disabled.active { box-shadow: 0 0 rgba(0, 0, 0, var(--shadow-opacity)), 0 var(--shadow-size) calc(var(--shadow-size) * 2) rgba(0, 0, 0, var(--shadow-opacity)) inset; transform: translateY(var(--shadow-size)) }
.turn { vertical-align: top }
.turn-0 { position: relative }
.turn-0:before, .turn-0:after { position: absolute; top: 22% }
.turn-0:before { transform: rotate(-45deg); animation: turn-0 var(--draw-time) ease-out forwards }
.turn-0:after { transform: rotate(45deg); animation: turn-0 var(--draw-time) ease-out var(--draw-time) forwards }
.turn-1 { transform: rotate(-90deg); animation: turn-1 500ms ease-out forwards }
.modal-window { position: absolute; top: 0; transform: scale(0); transition: transform 250ms ease-out }
.modal-window.shown { transform: scale(1) }
.btn { --shadow-opacity: 0.5 }
```

### [HTML, CSS tutorials Dialog / Modal without JS](https://codepen.io/ng-ngc-sn-the-bashful/pen/RwPjexr)

held: fixed div.dialog | made with: position: fixed · transition

```css
.dialog { position: fixed; top: 0; bottom: 0; opacity: 0; transition: opacity linear 0.2s }
.overlay-close { position: absolute }
.dialog:target { opacity: 1 }
.dialog-body { position: relative }
.dialog-close-btn { position: absolute; top: 2px }
```

### [CSS: ::backdrop dialog](https://codepen.io/acwilldev/pen/ExaMBxN)

made with: <dialog>

### [CSS only modal/dialog](https://codepen.io/ananyaneogi/pen/LYEPXEQ)

on hover of a.button: a.button: background | made with: transition · :hover

```css
.overlay { position: absolute; top: 0; bottom: 0; transition: opacity 250ms; opacity: 0 }
.overlay:target { opacity: 1 }
.dialog-body { position: relative; box-shadow: 0 0 50px rgba(0, 0, 0, 0.5) }
.dialog-body h2 { margin-top: 0 }
.dialog-body .close { position: absolute; top: 20px }
```

### [backdrop filter example for Dialog html element](https://codepen.io/chergav/pen/zYYbjaE)

made with: transition · :hover · backdrop-filter · <dialog>

```css
dialog#dialog_test { opacity: 0 }
button { transition: .1s }
#blur::backdrop { backdrop-filter: blur(5px) }
#brightness::backdrop { backdrop-filter: brightness(50%) }
#contrast::backdrop { backdrop-filter: contrast(175%) }
#grayscale::backdrop { backdrop-filter: grayscale(90%) }
#hue-rotate::backdrop { backdrop-filter: hue-rotate(180deg) }
#invert::backdrop { backdrop-filter: invert(100%) }
#opacity::backdrop { backdrop-filter: opacity(20%) }
#sepia::backdrop { backdrop-filter: sepia(100%) }
#saturate::backdrop { backdrop-filter: saturate(200%) }
```

### [Blur a background](https://codepen.io/ryanparag/pen/vYYvrjx)

held: fixed div.c-modal, fixed div.c-modal__overlay | made with: position: fixed · @keyframes · transition · :hover · backdrop-filter · custom properties driven by JS

```css
h1, h2, h3, h4, h5, h6 { margin-top: 0; margin-bottom: 2.4rem }
.c-img-header { margin-bottom: 4.8rem }
.c-modal { position: fixed; top: 0; bottom: 0; transition: all 100ms ease-out 0s }
.c-modal__overlay { position: fixed; top: 0; bottom: 0; -webkit-backdrop-filter: blur(var(--blur)); backdrop-filter: blur(var(--blur)) }
.c-modal__dialog { position: relative; opacity: 0 }
.c-modal--open .c-modal__overlay { -webkit-animation: fade 200ms ease-out 0s forwards; animation: fade 200ms ease-out 0s forwards }
.c-modal--open .c-modal__dialog { -webkit-animation: modalAnimate 300ms ease-out 50ms forwards; animation: modalAnimate 300ms ease-out 50ms forwards }
.c-button { transition: all 200ms ease-out 0s }
.c-button:hover { opacity: 0.8 }
.c-button:focus { box-shadow: 0px 0px 0.4rem var(--primary) }
.c-button:active { box-shadow: inset 0px 0px 0.4rem rgba(0, 0, 0, 0.3) }
.c-input-stepper__btn { transition: all 200ms ease-out 0s }
```

```js
style.setProperty('--blur', `${updVal}px`)
```

### [Modal UI](https://codepen.io/Shruti-Ag/pen/oNNbqxa)

made with: transition · :hover

```css
button { position: absolute; text-transform: uppercase; transform: scale(1); transition: 0.5s }
#modal { transform: scale(0); transition: 0.5s; box-shadow: 0 0 2px rgba(0, 0, 0, 0.4), 0 0 10px rgba(0, 0, 0, 0.1) inset }
h1 { margin-bottom: 0 }
.close_button { transform: scale(1); margin-top: 8px }
svg { margin-top: 25px }
#circle { transition: 1.2s }
#check { transition: 1.2s }
```

### [Confirm Dialog](https://codepen.io/onuraslan/pen/KKKPXGB)

made with: nothing recognised — read the code

### [Pointy dialog box with shadow](https://codepen.io/shadone/pen/eYYOJyG)

made with: transition · :hover

```css
.button-holder { position: relative }
.button-holder::before { position: absolute; top: 0; bottom: 0; box-shadow: 0px 2px 15px 0px #7b7b7b75 }
.button-holder:hover > .button { top: -10px; transition: top 100ms ease-in-out }
.button { position: absolute; top: 5px; transition: top 100ms ease-in-out }
.button::before { position: absolute; top: 0px; bottom: -10px; transform: rotate(45deg); box-shadow: 0px 2px 15px 0px #7b7b7b75 }
```

### [Bootstrap 4 Modal Dialog](https://codepen.io/joshuaguyette/pen/JjPrJqy)

held: fixed div.modal | on hover of button.btn: button.btn: background | made with: nothing recognised — read the code

```css
.modal { padding-top: 15% }
.modal-header { padding-top: 2px; padding-bottom: 2px }
.dark-overlay { position: absolute; top: 0px }
```

### [Vanilla JS Popup Overlay Directive](https://codepen.io/niallains/pen/dxbOyX)

held: fixed div, fixed div, fixed div.overlayBg | made with: position: fixed · transition · :hover

```css
body > button { margin-bottom: 20px }
.overlayBg { position: fixed; top: 0 }
[overlay] { position: fixed; top: 50%; transform: translate(-50%, -50%); box-shadow: 0 3px 5px #0005; opacity: 0; transition: visibility 0s linear 0.4s, opacity 0.4s, transform 0.4s }
[overlay].open { opacity: 1; transition: opacity 0.7s, transform 0.7s }
[overlay] button.close { position: absolute; top: 0 }
```

### [HTML5 Dialog](https://codepen.io/igorskyflyer/pen/agrGXm)

made with: @keyframes · transition · :hover · <dialog>

```css
main dialog { position: relative }
main dialog[open] { top: 17.5%; transform: scale(0); box-shadow: 0 0 20px 2px rgba(255, 255, 255, 0.3); transition: transform linear 0.2s }
main dialog.show { transform: scale(1) }
main dialog.close { transform: scale(0) }
main dialog h2 { text-transform: uppercase }
from { background-position: 0 0 }
to { background-position: 500% 500% }
from { background-position: 0 0 }
to { background-position: 500% 500% }
main button#btn-dialog { box-shadow: 2px 2px 8px 4px rgba(0, 0, 0, 0.4); transition: all linear 0.3s }
main button#btn-dialog:hover { background-position: 0 0; box-shadow: 2px 2px 80px 4px rgba(0, 0, 0, 0.6); -webkit-animation: animate-button linear 2s alternate infinite; animation: animate-button linear 2s alternate infinite }
main dialog button#btn-close { position: absolute; top: 0 }
```

### [Accessible non-modal dialog example WIP](https://codepen.io/angelagiese/pen/GarKPz)

on hover of button.btn: button.btn: background | made with: :hover

```css
.container { margin-top: 5% }
footer { margin-top: 40px }
```

### [modal simple](https://codepen.io/simon-jaeger/pen/KLdMzj)

held: fixed div.modal | on hover of button.button: button.button: background | made with: position: fixed · transition · :hover

```css
.button { text-transform: uppercase; box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23) }
.modal { position: fixed; top: 0; bottom: 0; transition: all 0.3s }
.modal_inner { box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23); opacity: 0; transform: scale(0.8); transition: all 0.3s }
.modal.-open .modal_inner { opacity: 1; transform: scale(1) }
```

### [Toaster Modal](https://codepen.io/borntofrappe/pen/dEPJwY)

made with: @keyframes · transition · :hover · <dialog>

```css
.modal { margin-bottom: 3rem; border-top: 4px solid currentColor; box-shadow: 0 2px 7px -5px currentColor; opacity: 0; transform: translateY(3rem); transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) }
.modal.active { transform: translateY(0); opacity: 1 }
.modal button.close--modal { transition: transform 0.1s ease-out }
.modal button.close--modal:hover, .modal button.close--modal:focus { transform: translateY(-2px) }
button.open--modal.active svg { animation: scaleDown 0.5s 1.7s cubic-bezier(0.5, -0.42, 0.07, 1.57) }
button.open--modal.active svg g.toaster { animation: translateUp 0.5s 2s cubic-bezier(0.5, -0.42, 0.37, 1.82) }
button.open--modal.active svg g.lever { animation: translateDown 4s cubic-bezier(0.72, 0.07, 0.38, 1.82) forwards }
50% { transform: scaleY(0.85) }
50% { transform: translateY(-20px) }
10%, 53% { transform: translate(0, 30px) }
57%, 100% { transform: initial }
@keyframes scaleDown animates transform
```

### [Easy select](https://codepen.io/axpy/pen/XQYBoJ)

made with: transition · :hover

```css
.output { margin-bottom: 20px }
.select { position: relative }
.select__button { box-shadow: 5px 5px rgba(0, 0, 0, 0.1); transition: all 0.2s }
.select__button:active { box-shadow: none; transform: translate(2.5px, 2.5px) }
.select__select { position: absolute; top: 40px; box-shadow: 5px 5px rgba(0, 0, 0, 0.1) }
.select__item:not(:last-child) { border-bottom: 1px solid #f0f0f0 }
```

### [jQuery Dialog Testing](https://codepen.io/mlawless/pen/WWoELE)

made with: nothing recognised — read the code

### [Responsive button area with flex](https://codepen.io/iagoqo/pen/bZJXmm)

made with: nothing recognised — read the code

```css
.wrapper + .wrapper { margin-top: 32px }
```

### [react-modal-queue](https://codepen.io/rlmcneary2/pen/LaMJVz)

made with: nothing recognised — read the code

```css
.modal-queue-overlay { bottom: 0; position: absolute; top: 0 }
```

### [Vanilla JS Modal](https://codepen.io/edeesims/pen/rRMORx)

on scroll: a.button: background+color+shadow | made with: position: fixed · transition · :hover

```css
.button { text-transform: uppercase; box-shadow: 0 1px 0 0 seagreen; transition: all 300ms linear; box-shadow: 0 0 15px rgba(0, 0, 0, 0.5) }
.button:hover { box-shadow: 0 0 0 }
.modal { position: fixed; top: 60%; transform: translate(-50%, -50%); opacity: 0; transition: opacity 300ms, top 600ms }
.modal--open { top: 50%; opacity: 1 }
.modal__overlay { opacity: 0; position: fixed; top: 0; transition: opacity 500ms }
.modal__overlay--open { opacity: 1 }
.modal__close { position: absolute; top: 0; transition: all 300ms }
.modal__close::before, .modal__close::after { position: absolute; top: 50%; transform: translate(-50%, -50%) rotate(45deg) }
.modal__close::after { transform: translate(-50%, -50%) rotate(-45deg) }
```

### [Creating a custom modal window using HTML, CSS & JavaScript! - Web Tutorial](https://codepen.io/dcode-software/pen/zeWXrL)

held: fixed div.modal__overlay | made with: position: fixed

```css
.modal__overlay { position: fixed; top: 0 }
.modal__window { box-shadow: 0 0 15px rgba(0, 0, 0, 0.25) }
.modal__close:active { transform: scale(0.9) }
```

### [Simple Loading dialog](https://codepen.io/shentengtu/pen/gqOeeN)

held: fixed dialog.message | made with: @keyframes · :hover · <dialog>

```css
dialog .panel .header.loading { position: relative }
dialog .panel .header.loading::before { position: absolute; top: 0; animation-duration: 0.8s; animation-iteration-count: infinite; animation-name: loader-animate; animation-timing-function: linear }
0% { transform: translate3d(-100%, 0, 0) }
100% { transform: translate3d(100%, 0, 0) }
dialog button { box-shadow: 0 2px 0 0 #D0D3D2 }
@keyframes loader-animate animates transform
```

### [Drag & Drop Social Media Icon Manager](https://codepen.io/JeffOlivier/pen/roQNyw)

made with: position: fixed · transition · :hover

```css
.order_change_button { padding-top: 100px }
.socialmedia_single_icon { position: relative; opacity: 1 }
.socialmedia_single_icon i { position: absolute; transform: translate(-50%, -50%) }
.socialmedia_single_icon i:first-of-type { top: 50% }
.socialmedia_single_icon i.sm_icon_edit:hover { box-shadow: 0 0 10px gray }
.ver1 .socialmedia_single_icon i { top: 50% }
.notUsedIcons .socialmedia_single_icon { opacity: 0.5 }
.sm_icon_edit:after { position: absolute; opacity: 0; transition: opacity 250ms linear }
.sm_icon_edit:hover:after { opacity: 1 }
.sm_icon_edit:hover ~ .pointerDown { opacity: 1 }
.ver1 .sm_icon_edit { margin-top: -35px }
.ver1 .sm_icon_edit:after { top: -74px }
```

### [React Modal Dialogs](https://codepen.io/ronhook/pen/PXqyrZ)

made with: position: fixed · @keyframes · transition · :hover

```css
body { position: relative }
h1, h2, h3 { margin-top: 0; margin-bottom: 0.6em }
h4, h5, h6 { margin-top: 0; margin-bottom: 0.8em }
h6 { border-bottom: 1px solid #43657d; text-transform: uppercase }
p:first-child { margin-top: 0 }
p:last-child { margin-bottom: 0 }
ul li { position: relative }
ul.drop-down-menu { position: relative }
ul.drop-down-menu li { position: relative }
ul.drop-down-menu li > a { position: relative; transition: background 0.5s }
ul.drop-down-menu li div { position: absolute; top: 100% }
ul.drop-down-menu li div li > a { border-bottom: 1px dashed rgba(255, 255, 255, 0.3) }
```

### [Progressively-enhanced Refresh This Page message](https://codepen.io/tigt/pen/VVNEoE)

made with: <dialog>

```css
.updateAlert { border-top: 0; box-shadow: 0 0.2em 0.2em rgba(155, 87, 0, 0.6) }
```

### [Dialog box](https://codepen.io/biruktesfayeve/pen/gQwoOe)

held: fixed div.dialog-container | made with: position: fixed · @keyframes · transition · :hover

```css
.container .btn-container { position: absolute; top: 55%; transform: translate(-50%, -50%) }
.container .btn-container button { position: absolute; transition: 0.2s all }
.container .btn-container .top { top: 0 }
.container .btn-container .left { top: 25% }
.container .btn-container .right { top: 25% }
.container .btn-container .bottom { top: 50% }
.dialog-container { position: fixed; top: 0; opacity: 0 }
.dialog-container .dialogbox { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: 0.1s all }
.anime-top { animation: slide-top 0.65s }
0% { top: 0 }
50% { top: 80% }
100% { top: 50% }
```

### [Dialog 2 template](https://codepen.io/Cephalopodium/pen/YRzbKE)

held: fixed div, fixed div | made with: position: fixed

```css
canvas { vertical-align: top }
#dialogoverlay { opacity: .8; position: fixed; top: 0px }
#dialogbox { position: fixed }
```

### [A11y Dialog](https://codepen.io/colinlord/pen/dgqYwN)

held: fixed div.dialog-overlay, fixed dialog.dialog-content | made with: position: fixed · @keyframes · transition · :hover · <dialog>

```css
p { margin-top: 0 }
a { transition: 0.2s all }
.content { margin-top: 30px; box-shadow: 0 0 0px 4px rgba(0, 0, 0, 0.05) }
button { text-transform: none; position: relative; border-bottom: 5px solid #630e1a }
.dialog-overlay { position: fixed; top: 0; bottom: 0 }
.dialog-content { position: fixed; top: 50%; transform: translate(-50%, -50%) }
from { opacity: 0 }
to { opacity: 1 }
from { opacity: 0 }
to { opacity: 1 }
from { transform: translate(-50%, -40%); opacity: 0 }
to { transform: translate(-50%, -50%); opacity: 1 }
```

### [Native Dialog Demo](https://codepen.io/lucasljordan/pen/MPGJQK)

made with: <dialog>

```css
.wrapper { position: relative }
.wrapper .content { position: absolute; top: 50%; transform: translate(-50%, -50%) }
```

### [<dialog> Demo](https://codepen.io/nickalcantara/pen/xyPagx)

made with: transition · :hover · <dialog>

```css
dialog { position: absolute; top: 40%; transform: translateY(-50%); box-shadow: 1rem 1rem 8rem 0rem rgba(0, 0, 0, 0.8) }
dialog span:nth-of-type(1) { position: absolute; top: 1rem }
dialog a, dialog a:visited, dialog a:focus { transition: transform 0.2s }
dialog::backdrop { filter: brightness(0.4) }
.hero { margin-top: 5rem; position: relative; box-shadow: 0 0 5rem 0 rgba(0, 0, 0, 0.5) }
.hero a, .hero a:visited, .hero a:focus { transition: transform 0.2s ease-in }
.hero a:hover, .hero a:visited:hover, .hero a:focus:hover { transform: translateY(-0.25rem); box-shadow: 0 1rem 2rem 0 rgba(0, 0, 0, 0.2) }
```

### [Auto Center Dialog](https://codepen.io/fmontes/pen/mzWeGQ)

made with: nothing recognised — read the code

```css
.overlay { position: absolute; top: 0; bottom: 0 }
```

### [HTML5 dialog element](https://codepen.io/robsimpson/pen/OoGreG)

held: fixed dialog.o-dialog | on hover of button.a-button: button.a-button: background | made with: position: fixed · @keyframes · transition · :hover · prefers-reduced-motion · <dialog>

```css
.a-button { transition: background-color 0.3s cubic-bezier(0.5, 0.61, 0.355, 1), box-shadow 0.3s cubic-bezier(0.5, 0.61, 0.355, 1) }
.a-button:focus { box-shadow: 0 0 0 0.25rem #31cc89 }
.o-dialog { box-shadow: 0 1.25rem 2.5rem 0 rgba(33, 43, 54, 0.25); position: fixed; top: 50%; transform: translateY(-50%) }
.o-dialog + .backdrop, ._dialog_overlay { bottom: 0; position: fixed; top: 0 }
.o-dialog__close { position: absolute; top: 0.625rem; transition: background-color 0.3s cubic-bezier(0.5, 0.61, 0.355, 1), box-shadow 0.3s cubic-bezier(0.5, 0.61, 0.355, 1), color 0.3s cubic-bezier(0.5, 0.61, 0.355, 1) }
.o-dialog__close:focus { box-shadow: 0 0 0 0.25rem #31cc89 }
.o-dialog[open] { animation: o-dialog-show 0.45s cubic-bezier(0.5, 0.61, 0.355, 1) normal }
.o-dialog[open]::backdrop { animation: o-dialog-backdrop-show 0.45s cubic-bezier(0.5, 0.61, 0.355, 1) normal }
.o-dialog[open] + .backdrop { animation: o-dialog-backdrop-show 0.45s cubic-bezier(0.5, 0.61, 0.355, 1) normal }
0% { opacity: 0; transform: translateY(-25%) }
50% { opacity: 1 }
100% { opacity: 1; transform: translateY(-50%) }
```

### [basicLightbox Events Demo](https://codepen.io/electerious/pen/pOBLQQ)

made with: nothing recognised — read the code

### [basicLightbox Create Demo](https://codepen.io/electerious/pen/wEZmQy)

made with: nothing recognised — read the code

### [basicLightbox DOM Demo](https://codepen.io/electerious/pen/pOBLxQ)

made with: nothing recognised — read the code

### [Vuetify Desktop/Mobile Overlay Navbar](https://codepen.io/kematzy/pen/zJmXwJ)

held: fixed div.v-dialog__content, fixed div.v-dialog, fixed nav.hidden-xs-and-down, fixed nav.hidden-sm-and-up | made with: nothing recognised — read the code

### [HTML5 Dialog](https://codepen.io/ingomc/pen/PBdrZE)

made with: <dialog>

### [<dialog>](https://codepen.io/chris22smith/pen/gjwyjK)

made with: <dialog>

### [Password generator flow w/ React + Dialog 🔑🤓 #CodePenChallenge](https://codepen.io/jh3y/pen/WKrygM)

made with: position: fixed · @keyframes · transition · :hover · <dialog>

```css
h1 { transition: color 0.25s }
dialog + .backdrop { -webkit-animation: fadeIn 0.25s; animation: fadeIn 0.25s }
.dialog { -webkit-animation: bounceIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275); animation: bounceIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: fixed; top: 50%; transform: translate(-50%, -50%) scale(1); transiti }
.dialog::-webkit-backdrop { -webkit-animation: fadeIn 0.25s; animation: fadeIn 0.25s }
.dialog::backdrop { -webkit-animation: fadeIn 0.25s; animation: fadeIn 0.25s }
dialog ~ div label { margin-bottom: 10px }
dialog ~ div input { margin-bottom: 10px }
.check { position: relative }
.check input { position: absolute; opacity: 0 }
.check input:checked ~ span:nth-of-type(2) { transform: translate(100%, 0) }
.check span { position: absolute; top: 0; transition: transform 0.1s, background 0.1s }
input[type=range]::-webkit-slider-thumb { margin-top: -5px }
```

### [Vuetify FullScreen Dialog Example](https://codepen.io/kematzy/pen/OEKRVv)

held: fixed div.v-dialog__content, fixed div.v-dialog | made with: nothing recognised — read the code

### [8 | Notification Popover](https://codepen.io/yitliu/pen/jKGGQq)

on scroll: div.annotation: transform | on hover of div.btn_all: div.annotation: transform | made with: @keyframes · transition · :hover · popover

```css
.container { position:relative }
.popover { padding-top:8px; transition: .5s ease-in-out; transform:scale(0); opacity:0 }
.msg_container { border-bottom:1px solid #efefef; position:relative }
.text { position:absolute }
.info_1 { opacity:.4 }
.info_2 { opacity:.2; top:8px }
.info_3 { opacity:.2; top:26px }
.info_4 { opacity:.3; top:44px }
.hint { opacity:.5; position:relative }
.btn_all { padding-top:6px }
.navbar { padding-bottom:8px }
.navbar .icon { position:relative }
```

### [Bootstrap Success message alert](https://codepen.io/harish-gadhari/pen/OEVYVJ)

made with: nothing recognised — read the code

```css
.alert-box .alert-icon { padding-bottom: 20px }
```

### [HTML5 Dialog Element (Currently Chrome Only)](https://codepen.io/manifoldkaizen/pen/WyvdVw)

made with: <dialog>

```css
.dialog { box-shadow: 0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07) }
```

### [Native Dialog Element/API Example](https://codepen.io/sjmcpherson/pen/PawdeM)

made with: <dialog>

```css
dialog { box-shadow: 0 0 10px rgba(0, 0, 0, 0.3) }
```

### [Dialog Tag (<dialog> | Native Modal HTML5)](https://codepen.io/dougfani/pen/bKNrQE)

held: fixed dialog | made with: position: fixed · <dialog>

```css
#my-dialog { position: fixed }
```

### [Message Dialog Touch](https://codepen.io/wilsoncodes/pen/rvoGYq)

made with: @keyframes · transition · :hover

```css
.dialogTouch { position: absolute; top: 50%; transform: translate(-50%,-50%); transition: .40s }
.dialogTouch:hover { transition: .40s }
.messageDialog { opacity: 0 }
.showMessage { position: absolute; bottom: 0; animation: 2s messageDialogAnim linear; opacity: 0 }
0%,100% { opacity: 0; bottom: 0 }
20%,70% { opacity: 1; bottom: 20px }
@keyframes messageDialogAnim animates opacity, bottom
```

### [Realistic macOS like Window](https://codepen.io/eip/pen/xjQbmM)

held: fixed div.overlay | made with: position: fixed · :hover

```css
.overlay { position: fixed; top: 0 }
.sample { position: absolute; top: 0 }
.dialog-window { position: absolute; top: 479px; filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.25)) drop-shadow(0 15px 10px rgba(0, 0, 0, 0.05)) drop-shadow(0 24px 24px rgba(0, 0, 0, 0.47)) }
.dialog-window:after { position: absolute; top: -1px }
.sample > .dialog-window { top: 37px; opacity: 0 }
.sample > .dialog-window:hover { opacity: 1 }
.dialog-header { position: relative }
.dialog-content { position: relative }
.dialog-content:after { position: absolute; top: -1px; border-top: 1px solid #b2b1b2 }
.dialog-window:after { top: -50%; transform: scale(0.5) translate(-2px, -2px) }
.dialog-header { margin-bottom: 0; transform: translatey(-0.5px) }
.dialog-header-buttons, .dialog-header-title { position: relative; transform: translateY(0.5px) }
```

### [Native Modal with Dialog Element](https://codepen.io/felipexperto/pen/gzWrzE)

made with: @keyframes · <dialog>

```css
dialog { box-shadow: 0 0 40px rgba(0,0,0,0.1), 0 0 10px rgba(0,0,0,0.25) }
dialog[open] { animation: appear .15s cubic-bezier(0, 1.8, 1, 1.8) }
from { opacity: 0; transform: translateX(-3rem) }
to { opacity: 1; transform: translateX(0) }
@keyframes appear animates opacity, transform
```

### [Simple modal dialog lib JS v0.2](https://codepen.io/quick-brown-fox/pen/GxBYOj)

made with: :hover

```css
.dialog { position: absolute; top: 0; bottom: 0 }
.dialog__content { box-shadow: 0 0.2em 0.7em rgba(0, 0, 0, 0.3) }
.dialog__content *::before, .dialog__content *::after { position: absolute }
.dialog__content--alert .dialog__header::before, .dialog__content--warning .dial { top: 1rem }
.dialog__content--custom .dialog__header { border-bottom: 1px solid #000 }
.dialog__header, .dialog__message, .dialog__footer { position: relative }
.dialog__header { border-bottom: 1px solid #ccc }
.dialog__return-value { margin-top: 1rem }
```

### [HTML5 Dialog-Modal](https://codepen.io/jessegilbride/pen/LddrdL)

made with: <dialog>

### [Confirm modal dialog](https://codepen.io/nodws/pen/RMRRYK)

held: fixed div.alert | made with: position: fixed · transition · :hover

```css
.item { border-bottom: 1px solid #dddddd }
.alert { position: fixed; top: 0; opacity: 0; transition: opacity 0.3s 0s, visibility 0s 0.3s }
.alert.is-visible { opacity: 1; transition: opacity 0.3s 0s, visibility 0s 0s }
.alert-container { position: relative; box-shadow: 0 0 20px rgba(0, 0, 0, 0.2); transform: translateY(-40px); transition-property: transform }
.alert-container footer a { text-transform: uppercase; transition: background-color 0.2s }
.alert-container footer a:hover { box-shadow: 0 0 100em 100em rgba(0, 0, 0, 0.2) inset }
.alert-container .alert-close { position: absolute; top: 8px }
.is-visible .alert-container { transform: translateY(0) }
```

### [BootstrapDialog](https://codepen.io/vitor_gja_/pen/rJXMNb)

made with: nothing recognised — read the code

### [Responsive HTML5 Dialog with Polyfill Fallback](https://codepen.io/manjitkarve/pen/LQovVb)

made with: position: fixed · transition · 3D (perspective / preserve-3d) · <dialog>

```css
dialog { position: absolute }
dialog + .backdrop { position: fixed; top: 0; bottom: 0 }
dialog.fixed { position: fixed; top: 50%; transform: translate(0, -50%) }
._dialog_overlay { position: fixed; top: 0; bottom: 0 }
dialog { position: absolute; top: 50%; transform: translate(-50%, -50%); box-shadow: 1rem 1rem 6rem -2rem #2d3047 }
dialog .title { text-transform: uppercase; position: relative }
dialog .title button.close { position: absolute; top: 50%; transform: translateY(-50%); box-shadow: none }
dialog::backdrop { position: fixed; top: 0; bottom: 0 }
button, dialog .button-bar stretch button { box-shadow: 2px 2px 5px -3px #2d3047 }
section.portfolio img { position: absolute; transform: translateX(-100%); opacity: 0; transition: transform 0.5s ease-in-out, opacity 0.5s ease-out }
section.portfolio img.active { position: relative; transform: none; opacity: 1; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) }
section.portfolio img.active + img, section.portfolio img:first-child:not(.activ { transform: translateX(100%); opacity: 0; transition: none }
```

### [Forgot Password - Confirmation](https://codepen.io/csudh-krave/pen/oEQrxE)

made with: nothing recognised — read the code

### [HTML 5.2 Dialog](https://codepen.io/eduardosada/pen/KQyPMY)

made with: @keyframes · <dialog> · canvas 2D · requestAnimationFrame

```css
dialog { box-shadow: 2px 2px 8px 1px rgba(0, 0, 0, 0.2); will-change: transform; animation: modalEntry 400ms 200ms ease backwards }
dialog .modal-body { will-change: transform; animation: modalContentEntry 200ms 330ms ease backwards }
dialog::backdrop { animation: overlay 200ms ease; opacity: 0.5 }
from { opacity: 0; transform: scale(0.5) }
65.5% { transform: scale(1.05) }
from { opacity: 0; transform: scale(0.8) }
from { opacity: 0 }
@keyframes modalEntry animates opacity, transform
@keyframes modalContentEntry animates opacity, transform
@keyframes overlay animates opacity
```

```js
requestAnimationFrame(this.render)
```

### [Native Dialog with Polyfill](https://codepen.io/amybrowndesign/pen/bLqLJr)

on hover of button.: button.: background+color | made with: @keyframes · transition · :hover · <dialog>

```css
button { box-shadow: none }
button, button:hover, button:focus { transition: all 0.17s ease-in-out }
from { margin-top: -50px; opacity: 0 }
to { margin-top: 0; opacity: 1 }
from { margin-top: -50px; opacity: 0 }
to { margin-top: 0; opacity: 1 }
dialog { top: 50%; transform: translate(-50%, -50%); -webkit-animation: appear 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards; animation: appear 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards; box-shadow: 1px 5px 5px #9 }
dialog button { margin-bottom: 20px }
@keyframes appear animates margin-top, opacity
```

### [HTML 5.2 new dialog tag](https://codepen.io/john_be/pen/ZrLzQR)

made with: transition · :hover · <dialog>

```css
menu.card { box-shadow: 5px 5px 100px rgba(0, 0, 0, 0.1) }
button { box-shadow: 5px 5px 100px rgba(0, 0, 0, 0.1); transition: background 500ms ease }
```

### [Native Modal](https://codepen.io/helljohnston/pen/qxaayz)

held: fixed dialog.js-nativeDialog | made with: <dialog>

```css
dialog { box-shadow: 0 0 1em #444 }
.modal-header { border-bottom: 1px solid #ccc }
.modal-footer { border-top: 1px solid #ccc }
```

### [Nested Dialogs](https://codepen.io/stephenjwatkins/pen/NyrgEr)

held: fixed div.dialog-container, sticky div.dialog-header, sticky div.dialog-footer | made with: position: sticky · position: fixed · transition

```css
.dialog-container { position: fixed; top: 0 }
.dialog-overlay { position: absolute; top: 0 }
.dialog-frame { position: absolute; top: 0 }
.dialog-window { position: relative; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1) }
.dialog-header { position: sticky; top: 0; border-bottom: 1px solid rgba(0, 0, 0, 0.05) }
.dialog-footer { position: sticky; bottom: 0; border-top: 1px solid rgba(0, 0, 0, 0.05) }
.dialog-frame { transform: scale(1) translateY(16px); opacity: 0; transition: opacity 0.35s ease-out, transform 0.35s ease-out }
.dialog-frame.mounted { opacity: 1; transform: scale(1) translateY(0) }
.dialog-frame[data-frame="1-2"], .dialog-frame[data-frame="2-3"], .dialog-frame[ { transform: scale(0.95) translateY(-8px) }
.dialog-frame[data-frame="1-3"], .dialog-frame[data-frame="2-4"], .dialog-frame[ { transform: scale(0.9) translateY(-16px) }
.dialog-frame[data-frame="1-4"], .dialog-frame[data-frame="2-5"] { transform: scale(0.85) translateY(-24px) }
.dialog-frame[data-frame="1-5"] { transform: scale(0.8) translateY(-32px) }
```

### [Dialog Modal](https://codepen.io/balocodes/pen/KQVzbg)

made with: transition · :hover · <dialog>

```css
.check:hover { transition: 2s }
```

### [Native Dialog As Image Lightbox](https://codepen.io/benrobyg/pen/qpGWqm)

held: fixed dialog | made with: position: fixed · <dialog>

```css
h3 { margin-bottom: 10px }
h3:not(:first-of-type) { margin-top: 40px }
p + p { margin-top: 20px }
.site-content { padding-top: 30px; padding-bottom: 30px }
.site-header, .site-footer { padding-top: 20px; padding-bottom: 20px }
.site-header { box-shadow: 0 1px 1px #222 }
dialog { position: fixed; top: 50%; transform: translate(-50%,-50%) }
.dialog-close { position: absolute; top: 5px }
.dialog-previous, .dialog-next { position: absolute; top: 50%; transform: translateY(-50%) }
```

### [Native dialog element](https://codepen.io/RSH87/pen/RxdGMQ)

made with: @keyframes · <dialog>

```css
.button { box-shadow: 0 10px 25px #3c4a5645 }
h3 { margin-bottom: 15px }
.button-close { box-shadow: none }
dialog { -webkit-animation: appear 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards; animation: appear 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards; box-shadow: 0 25px 40px -20px #3c4a56 }
.dialog__animate-out { -webkit-animation: dissappear 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards; animation: dissappear 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards }
from { opacity: 0; transform: translateY(20px) }
to { opacity: 1; transform: translateY(0) }
from { opacity: 0; transform: translateY(20px) }
to { opacity: 1; transform: translateY(0) }
from { opacity: 1; transform: translateY(0) }
to { opacity: 0; transform: translateY(20px) }
from { opacity: 1; transform: translateY(0) }
```

### [New HTML dialog element](https://codepen.io/fyodorio/pen/Leqwbx)

made with: <dialog>

### [Dialog focus trapping with CSS](https://codepen.io/chinchang/pen/GywdLK)

made with: transition · <dialog>

```css
dialog[open]:not(:focus-within) { transition: background-color 0.01s ease }
```

### [HTML 5.2 Dialog](https://codepen.io/juwanpetty/pen/vpzwJy)

made with: @keyframes · <dialog>

```css
body { position: relative }
h1, h2 { margin-top: 0 }
.wrapper { position: absolute; top: 0 }
.profile__user { margin-bottom: 1rem }
.profile__info .profile__name { margin-bottom: 0.5rem }
.profile__info .profile__status { position: relative }
.profile__info .profile__status:after { position: absolute; top: 25% }
.profile__bio { margin-bottom: 3rem }
.dialog { box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.1); -webkit-animation: dialogSlide 0.3s; animation: dialogSlide 0.3s }
.dialog button { margin-top: 2rem }
.dialog::-webkit-backdrop { -webkit-animation: dialogBackdropFade 0.2s; animation: dialogBackdropFade 0.2s }
.dialog::backdrop { -webkit-animation: dialogBackdropFade 0.2s; animation: dialogBackdropFade 0.2s }
```

### [HTML 5.2 - <dialog> example](https://codepen.io/gregrickaby/pen/wpEKvN)

made with: <dialog>

### [HTML 5.2 dialog element](https://codepen.io/SimonEvans/pen/MrXLyM)

made with: @keyframes · transition · :hover · <dialog>

```css
dialog[open], dialog::backdrop { animation: show 500ms ease }
button { position: relative; top: 50%; transform: translateY(-50%); transition: background 300ms ease, color 300ms ease }
h1 { margin-top: 0 }
p { margin-bottom: 0 }
0% { opacity: 0 }
@keyframes show animates opacity
```

### [HTML 5.2 dialog example](https://codepen.io/liamj/pen/WdJyBQ)

made with: <dialog>

```css
.small { margin-top: 3rem }
dialog { box-shadow: 0 0 5rem 1rem rgba(0, 0, 0, 0.9) }
.dialog-content { padding-top: 20px; padding-bottom: 20px }
```

### [Dialog - Disable outside clicks](https://codepen.io/brunolucena/pen/xpjbrw)

held: fixed div.dialog, fixed div.dialog, fixed div.dialog, fixed div.dialog, fixed div.dialog | made with: position: fixed · :hover

```css
.dialog-container { position: fixed; top: 0; bottom: 0 }
.dialog { position: fixed; top: 10%; transform: translateX(-50%); box-shadow: 0 24px 24px 0 rgba(0, 0, 0, 0.11), 0 0 24px 0 rgba(0, 0, 0, 0.11) }
.dialog > .header { margin-bottom: 2rem }
.dialog > .body { margin-top: 1rem }
.dialog > .footer { margin-top: 2rem }
```

### [HTML 5.2 - dialog test.](https://codepen.io/Krol22/pen/WdJNoR)

made with: position: fixed · @keyframes · :hover · <dialog>

```css
dialog[open] { animation: show 1s ease }
dialog::backdrop { position: fixed; top: 0; bottom: 0; animation: none; opacity: 0.4 }
dialog[open]::backdrop { animation: show-backdrop 1s ease }
dialog.close::backdrop { animation: hide-backdrop 1s ease }
dialog.close { animation: hide 1s ease }
from { opacity: 0; transform: translateY(-110%) }
to { opacity: 1; transform: translateY(0%) }
to { opacity: 0; transform: translateY(-110%) }
from { opacity: 0 }
to { opacity: 0.4 }
to { opacity: 0 }
h2 { text-transform: uppercase }
```

### [HTML 5.2 Dialog Demo](https://codepen.io/chrisshaw/pen/OzvrzZ)

made with: transition · <dialog>

```css
button { box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2); margin-top: 20px; text-transform: uppercase }
dialog { box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); top: 50%; transform: translateY(-50%) scale(1, 1); transition: all 200ms ease, visibility 0s }
dialog button { margin-top: 0; position: absolute; top: 20px }
dialog:not(.open) { transform: scale(0.5, 0.5) }
dialog::-webkit-backdrop { opacity: 0; -webkit-transition: opacity 200ms ease-in-out; transition: opacity 200ms ease-in-out }
dialog::backdrop { opacity: 0; transition: opacity 200ms ease-in-out }
dialog.open::-webkit-backdrop { opacity: 1 }
dialog.open::backdrop { opacity: 1 }
```

### [React Dialog](https://codepen.io/elainehuang/pen/EoooBo)

held: fixed div.dialog | made with: position: fixed · @keyframes

```css
.container .btn { margin-top: 30px }
.dialog { position: fixed; top: 0 }
.dialog.show-dialog .modal-md { box-shadow: 0 0 8px rgba(0, 0, 0, 0.3); -webkit-animation: dialog-scale-start 0.3s ease-in-out forwards; animation: dialog-scale-start 0.3s ease-in-out forwards }
.dialog h1 { position: relative }
.dialog h1 .close { position: absolute; top: 15px }
0% { opacity: 0.5; transform: scale(1.15) }
100% { opacity: 1; transform: scale(1) }
0% { opacity: 0.5; transform: scale(1.15) }
100% { opacity: 1; transform: scale(1) }
@keyframes dialog-scale-start animates opacity, transform
```

### [The (still new) HTML 5.2 dialog element](https://codepen.io/2kool2/pen/xppLgd)

held: fixed footer.myStuff | made with: position: fixed · transition · :hover · <dialog>

```css
body { padding-bottom: 2rem }
h1,h2 { margin-top: 2rem; margin-bottom: 1rem }
.lnk { transition: background-color .3s }
.lnk:hover, .lnk:focus { transition: outline .3s }
button { box-shadow: 0 2px 4px rgba(0,0,0,.5); transition: all .3s ease-out }
button:hover { box-shadow: 0 4px 8px rgba(0,0,0,.25) }
dialog, dialog[close], dialog[aria-hidden="true"] { opacity: 0; transition: display 0s linear 2s, visibility 0s linear 2s, opacity 1s ease-out 0s }
dialog[open], dialog[aria-hidden="false"] { opacity: 1; transition: display 0s linear 0s, visibility 0s linear 0s, opacity 1s ease-out 0s }
dialog[aria-hidden][data-dialog-type="showModal"] { position: fixed; top: 50%; transform: translate3d(-50%, -50%, 0) }
dialog[aria-hidden][data-dialog-type="show"] { position: absolute; transform: translate3d(-50%, 0, 0) }
.-js-dialogBg { position: fixed; top: 0; bottom: 0 }
```

### [7Zip Windows Extraction](https://codepen.io/srsgores/pen/aEwzbR)

made with: transition · :hover

```css
.window-action-icon { opacity: 0.7; transition: 0.1s ease background, 0.1s ease opacity, 0.1s ease color }
.window-action-icon:hover { opacity: 1 }
```

### [HTML5 Dialog API demo](https://codepen.io/d2phap/pen/xpqepb)

held: fixed dialog.modal, fixed dialog.modal, fixed dialog.modal-dialog, fixed div.ref | made with: position: fixed · @keyframes · backdrop-filter · <dialog>

```css
.modal { position: fixed; top: 10vh }
.modal[open] { backdrop-filter: blur(15px); animation: open-dialog 0.8s ease normal }
0% { backdrop-filter: blur(0px); transform: scale(0.5) }
33% { transform: scale(0.9) }
80% { transform: scale(0.8) }
100% { backdrop-filter: blur(20px); transform: scale(1) }
.modal-dialog { position: fixed; top: 0 }
.modal-dialog .modal-content { margin-top: 10vh; margin-bottom: 10vh }
.modal-dialog[open] .modal-content { backdrop-filter: blur(15px); animation: open-dialog 0.8s ease normal }
.ref { position: fixed; bottom: 0; -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px) }
@keyframes open-dialog animates backdrop-filter, transform
```

### [Modal Dialog without aria-hidden but using aria-modal](https://codepen.io/TimA11y/pen/VyKgOw)

made with: position: fixed

```css
#modalOverlay { opacity:0.5; position:fixed; top:0 }
[role=dialog] { position:fixed; top:25% }
button[aria-label="Close Dialog"] { position:absolute; top: 0px }
```

### [vue-material issue #1097](https://codepen.io/VdustR/pen/BweOXb)

made with: nothing recognised — read the code

### [Futuristic UI - Control Console](https://codepen.io/leocreatini/pen/veMMWR)

held: fixed section.sc-bdVaJa | made with: position: fixed · transition · :hover

### [Overlay Blur](https://codepen.io/hedlro/pen/XaoBEQ)

made with: transition · :hover

```css
#content { position: absolute }
#frostedBk { position: absolute; top: 0px; transition: background .2s; box-shadow: inset 0 0 100px rgba(255, 255, 255, .25) }
#frostedBk p { position: absolute; bottom: 20px; text-transform: uppercase; margin-top: 238px; opacity: .8; transition: all .2s; transform: translate3d(0, 0, 0) }
#frostedBk:hover p { transform: translate3d(-3px, -3px, 0) }
#blurredContentFrame { top:0; position: absolute }
#blurredContent { position: absolute; filter:blur(8px); -webkit-filter:blur(8px) }
```

### [Modal window with dialog element of HTML 5.1](https://codepen.io/dsheiko/pen/yozmoO)

made with: <dialog>

```css
.dialog-default { box-shadow: 0 0 .1rem rgba(0,0,0,.3); position: relative }
.dialog-default .btn-close { position: absolute; top: 1rem }
```

### [Password dialog with Vue](https://codepen.io/Detlef1914/pen/vJXOLb)

made with: nothing recognised — read the code

### [JavaScript Confirmation Dialog Alternative](https://codepen.io/leeshin/pen/PjVYrX)

held: fixed div.awsm-dialog | made with: position: fixed · :hover

```css
.container { position: absolute; top: 45% }
.btn { text-transform: uppercase }
.awsm-dialog { position: fixed; top: calc(50% - 80px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4) }
.awd-message { margin-bottom: 30px }
```

### [Native <dialog> Element Demo](https://codepen.io/freMea/pen/RgeEML)

made with: @keyframes · transition · :hover · backdrop-filter · <dialog>

```css
button { border-bottom: 1px solid #498b50; transition: transform .15s ease-out, box-shadow .15s ease-out }
button:hover, button:focus { transform: scale(1.04); box-shadow: 0 0 10px rgba(0, 0, 0, .5) }
button:active { opacity: 1; box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.1) inset }
#styledModal { border-top: 5px solid #69c773; box-shadow:0px 7px 20px 0px rgba(0, 0, 0, .5); animation: DialogIn .5s }
0% { transform: scale(0) }
80% { transform: scale(1.2) }
100% { transform: scale(1) }
0% { transform: scale(1) }
20% { transform: scale(1.2) }
100% { transform: scale(0) }
h3 { margin-top:1rem; margin-bottom:1.5rem }
@keyframes DialogIn animates transform
```

### [Simple modal dialog](https://codepen.io/Zoxon/pen/zzajWd)

held: fixed div.modal-dialog | made with: position: fixed

```css
.modal-dialog { position: fixed; top: 0 }
.modal-dialog__backdrop { position: absolute; top: 0; opacity: 0; transition-property: opacity }
.modal-dialog__dialog { opacity: 0; transition-property: opacity, transform; transform: translateY(-4rem) }
.modal-dialog_active .modal-dialog__backdrop { opacity: 0.6 }
.modal-dialog_active .modal-dialog__dialog { opacity: 1; transform: translateY(0) }
.dialog_style_default { box-shadow: 0 19px 60px rgba(0,0,0,0.3), 0 15px 20px rgba(0,0,0,0.22) }
```

### [Simple modal](https://codepen.io/larsmagnus/pen/PjOrYv)

held: fixed div.modal__wrapper, fixed span.modal__overlay, fixed div | made with: position: fixed · transition · :hover · 3D (perspective / preserve-3d) · Web Animations API (.animate)

```css
html.no-scroll { position: fixed; position: static; top: 0px }
.section { transition: filter 0.3s ease }
.modal--is-open .section { filter: blur(8px) }
.modal__wrapper, .modal__overlay { position: fixed; top: 0; bottom: 0 }
.modal__dialog { margin-top: 10vh; position: relative; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) }
.modal__close { position: absolute; top: 20px; background-position: center }
.modal__subtitle { margin-bottom: 0.75em }
.modal__text { margin-bottom: 2em }
```

```js
.animate({
```

### [x-dialog](https://codepen.io/tianxiangbing/pen/ybZXPr)

made with: nothing recognised — read the code

### [Windows Dialog Box with Html & Css & Javascript](https://codepen.io/cakirefekan/pen/PmxJpm)

made with: transition · :hover

```css
.active { position:relative; top:50px; -webkit-box-shadow: 0px 0px 19px 0px rgba(0,0,0,0.4); -moz-box-shadow: 0px 0px 19px 0px rgba(0,0,0,0.4); box-shadow: 0px 0px 19px 0px rgba(0,0,0,0.4); transition:0s }
.deactive { position:relative; top:50px; -webkit-box-shadow: 0px 0px 19px 0px rgba(0,0,0,0.2); -moz-box-shadow: 0px 0px 19px 0px rgba(0,0,0,0.2); box-shadow: 0px 0px 19px 0px rgba(0,0,0,0.2); transition:0s }
.active .title-box span { padding-top:4px }
.deactive .title-box span { padding-top:4px }
.title-box span:hover { transition: .4s }
.content-box .logo { margin-top:10px }
.content-box .text { margin-top: 13px }
.button-box .active-border { margin-top:14px }
.button-box .deactive-border { margin-top:15px }
button#restart { position:relative; margin-top:10px }
```

### [Dialog Demo](https://codepen.io/rynpsc/pen/YVVGdr)

held: fixed div.c-modal, fixed div.backdrop | made with: position: fixed · transition

```css
.button { text-transform: uppercase; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) }
.button:active { transform: translateY(1px) }
.button:focus { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(255, 255, 255, 1), 0 0 0 4px rgba(82, 108, 204, 1) }
.button--alt:focus { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(255, 255, 255, 1), 0 0 0 4px rgba(216, 85, 200, 1) }
.backdrop { position: fixed; top: 0; bottom: 0; opacity: 1 }
.c-modal { position: fixed; top: 0; bottom: 0; transition: opacity 100ms linear, visibility 100ms 0s linear; opacity: 0; will-change: opacity }
.c-modal.is-open { transition: opacity 100ms linear, visibility 0s linear; opacity: 1 }
.c-modal-content { position: relative }
legend { margin-bottom: 1em }
```

### [Confirmation popup for submit](https://codepen.io/curnsey/pen/yMPyJB)

held: fixed div.BlockUIConfirm | made with: position: fixed

```css
.BlockUIConfirm { position: fixed; top: 0 }
.blockui-mask { position: absolute; top: 0; opacity: 0.4 }
.RowDialogBody { position: absolute; top: 50%; transform: translate(-50%, -50%); opacity: 1 }
.row-dialog-hdr-success { border-top: 4px solid #5cb85c; border-bottom: 1px solid transparent }
.row-dialog-hdr-info { border-top: 4px solid #5bc0de; border-bottom: 1px solid transparent }
.confirm-body { border-top: 1px solid #ccc; border-bottom: 1px solid #ccc }
```

### [jquery.dialog.js](https://codepen.io/etiennemartin/pen/mWVWEQ)

made with: position: fixed · @keyframes · transition · :hover · 3D (perspective / preserve-3d)

```css
#dialog-holder,#dialog-overlay { position:absolute; top:0; transform:translateZ(0) }
#dialog-overlay { bottom:0; opacity:0; transition:opacity .5s }
#dialog-overlay.dialog-closing { transition:opacity .25s }
#dialog-overlay.dialog-visible { opacity:1 }
#dialog-holder.dialog-fixed { position:fixed }
#dialog-holder #dialog-center td { perspective:1000px }
#dialog-holder #dialog-center td .dialog-alert { position:relative; box-shadow:rgba(0,0,0,.1) 0 2px 3px,rgba(0,0,0,.2) 0 5px 15px; opacity:0; transition:transform .5s,opacity .45s }
20%,60% { transform:translateX(-12px) rotateY(-8deg) }
40%,80% { transform:translateX(12px) rotateY(8deg) }
#dialog-holder #dialog-center td .dialog-alert[data-dialog-animation=scale] { -ms-transform:scale(.8); transform:scale(.8) }
#dialog-holder #dialog-center td .dialog-alert[data-dialog-animation=slide] { -ms-transform:translateY(-50%); transform:translateY(-50%) }
#dialog-holder #dialog-center td .dialog-alert.dialog-closing { transition:transform .25s,opacity .2s }
```

### [Modal](https://codepen.io/RRoberts/pen/ggZxOb)

made with: transition · :hover

```css
.container { position: relative }
.wrapper { position: absolute; top: 0 }
.overlay { position: absolute; top: 0 }
.button, .submit { transition: all 0.3s ease-in-out }
.modal form .submit { margin-top: 20px }
.modal { opacity: 0; -webkit-transform: rotate(20deg); -ms-transform: rotate(20deg); -o-transform: rotate(20deg); transform: rotate(20deg) }
.modal.is-active { opacity: 1; -webkit-transform: rotate(0deg); -ms-transform: rotate(0deg); -o-transform: rotate(0deg); transform: rotate(0deg); -webkit-transition: all 0.3s ease-in-out; -o-transition: all 0.3s ease-in-out; transition: al }
.close { margin-top: 20px }
```

### [Display UI Datepicker in UI Dialog](https://codepen.io/jasonday/pen/qRoPEw)

made with: nothing recognised — read the code

```css
#ui-datepicker-div { position: relative !important; top: 0 !important }
```

### [Simple responsive modal dialog](https://codepen.io/shellbryson/pen/bgrbeX)

held: fixed div.modal | made with: position: fixed

```css
.page p { margin-bottom: 20px }
.modal { position: fixed; top: 0; bottom: 0; opacity: 0.95 }
.modal { top: 10%; bottom: 15%; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) }
.modal__inner { position: absolute; top: 54px; bottom: 10px }
.modal__inner { top: 54px; bottom: 20px }
.modal__intro { margin-bottom: 20px }
.modal__toggle { position: absolute; top: 0 }
.fixed:after { position: fixed; top: 0; bottom: 0 }
```

### [Pokemon Go UI Dialog](https://codepen.io/Rplus/pen/wgapbw)

held: fixed div.dialog | made with: position: fixed · transition · :hover

```css
.dialog { position: fixed; top: 0; bottom: 0 }
.dialog::before { position: absolute; top: 0; bottom: 0; background-position: 25vw 50vh }
.dialog::before { background-position: left calc(45vw - 35vmin) top calc(90vh - 70vmin) }
.intro { position: absolute; bottom: 1em }
.intro__item:not(:empty) { position: absolute; bottom: calc(100% + 10vmin) }
.intro__item:not(:empty)::before { position: absolute; top: 0; bottom: 0; opacity: 0.75; box-shadow: inset 0 0 0 0.8vmin rgba(255, 255, 255, 0.5), 0 0 0 1vmin rgba(255, 255, 255, 0.75); transition: transform 0.3s, opacity 0.3s }
.intro__item:not(:empty):hover::before { transform: scale(1.1); opacity: 1 }
.intro__content { position: relative; box-shadow: 0 0 0.25em }
.intro__content::before { position: absolute; bottom: 100%; border-bottom: 1em solid; filter: drop-shadow(0 -0.125em 0.125em rgba(0, 0, 0, 0.3)) }
```

### [A demonstration of window.confirm()](https://codepen.io/demifiend/pen/WRbKoy)

made with: nothing recognised — read the code

```css
.button { margin-bottom: 1em }
```

### [Bootstrap dialog box](https://codepen.io/takaneichinose/pen/PbrgRW)

held: fixed div.modal, fixed div.modal, fixed div.modal | made with: nothing recognised — read the code

### [Angular Material Pizza Dialog](https://codepen.io/CthuKi/pen/QGrBPa)

made with: <dialog>

```css
#popupContainer { position: relative }
```

### [Untitled](https://codepen.io/jasondavis/pen/aBEaPE)

made with: position: fixed · transition

```css
.lnv-dialog { position: fixed; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%) }
.lnv-dialog-ft { position: relative; margin-top: 20px }
.lnv-dialog-ft:after { position: absolute; top: 0; border-top: 1px solid #D5D5D6; -webkit-transform: scaleY(0.5); transform: scaleY(0.5) }
.lnv-dialog-confirm .lnv-dialog-ft a { position: relative }
.lnv-dialog-confirm .lnv-dialog-ft a:after { position: absolute; top: 0; -webkit-transform: scaleX(0.5); transform: scaleX(0.5) }
.lnv-mask { position: fixed; top: 0 }
.lnv-mask-transparent { position: fixed; top: 0 }
.lnv-mask-transition { position: fixed; top: 0; -webkit-transition: background .3s; transition: background .3s }
```

### [Angular Dialogs As Factory](https://codepen.io/fahimmahmoodmir/pen/YprgNr)

made with: nothing recognised — read the code

```css
.dialogdemoBasicUsage #popupContainer { position: relative }
.dialogdemoBasicUsage .footer, .dialogdemoBasicUsage .footer > code { margin-top: 50px }
.dialogdemoBasicUsage .dialog-demo-prerendered md-checkbox { margin-bottom: 0 }
```

### [Angular StartUp Template](https://codepen.io/fahimmahmoodmir/pen/RoLvZG)

made with: nothing recognised — read the code

### [dialog, (almost) no JS!](https://codepen.io/adahei/pen/jMdEqz)

made with: <dialog>

### [Moodle](https://codepen.io/wosevision/pen/EgpGPW)

held: fixed div.moodle-window, fixed div.moodle-overlay | made with: position: fixed · requestAnimationFrame

```css
a { border-bottom: dotted 1px }
.sr-label { position: absolute }
kbd { box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2), 0 0 0 2px #fff inset }
.moodle-window { position: fixed }
.moodle-window h2 { text-transform: uppercase }
.moodle-close { position: absolute; top: 10px }
.moodle-overlay { opacity: 0.8; position: fixed; top: 0 }
.show-moodle { text-transform: uppercase }
```

```js
requestAnimationFrame(fade)
```

### [The Great Exploding Dialog](https://codepen.io/lokesh/pen/pELyoq)

on hover of button.: button.: background | made with: @keyframes · transition · :hover · canvas 2D · requestAnimationFrame

```css
canvas { position: absolute; top: 0 }
.dialog { position: absolute; top: 100px; opacity: 0; transform: scale(0.6); transition: opacity 0.5s 0.2s, transform 0.5s 0.2s }
.dialog.is-in { opacity: 1; transform: scale(1) }
.dialog-body { text-transform: uppercase }
button { text-transform: uppercase; text-transform: uppercase }
#ui { position: absolute; top: calc(50vh - 40px) }
.shaker.is-shaking { -webkit-animation-name: shake; animation-name: shake; -webkit-animation-duration: 0.3s; animation-duration: 0.3s; -webkit-animation-iteration-count: infine; animation-iteration-count: infine; -webkit-animation-fill-mode: }
0% { transform: translate(0, 0) }
15% { transform: translate(0, -12px) }
30% { transform: translate(24px, 12px) }
45% { transform: translate(-12px, -12px) }
60% { transform: translate(0, -12px) }
```

```js
requestAnimationFrame(loop)
```

### [Newsletter form](https://codepen.io/wanbinkimoon/pen/KgXLJm)

made with: :hover

```css
body { background-position: center }
aside { position: relative; top: 150px; box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.75), 0 10px 45px -5px rgba(0, 0, 0, 0.35) }
p { margin-top: 30px }
.mercurio__text { position: relative }
.mercurio__btn { position: relative; top: -1px; text-transform: capitalize }
```

### [Horrible award winner](https://codepen.io/wanbinkimoon/pen/NRvOjR)

made with: nothing recognised — read the code

```css
section { position: relative; top: 50vh; transform: translate(-50%, -50%); position: relative; box-shadow: 10px 20px 25px 5px rgba(0, 0, 0, 0.3), 35px 50px 100px 0px rgba(0, 0, 0, 0.5) }
header { position: relative }
header h1 { position: absolute; bottom: 20px }
header p { position: absolute; bottom: 20px; text-transform: uppercase }
article img { bottom: 0; position: absolute }
```

### [Material Design Modal](https://codepen.io/mdbootstrap/pen/xERmMb)

held: fixed div.modal | on hover of button.btn: button.btn: background+shadow | made with: nothing recognised — read the code

### [Details and Dialog Elements](https://codepen.io/alemieux/pen/NRbbwm)

made with: <dialog>

```css
.dbutton { margin-top: 1em; text-transform: uppercase }
```

### [Angular Matching Game](https://codepen.io/aquavis/pen/amBvRR)

on scroll: div.card: transform+background+shadow ×3, img.: opacity ×3, div.card: transform, div.card: transform+background+shadow+top, img.: opacity+top, div.card: transform+shadow+top | on hover of div.card-container: div.card: transform+background+shadow, img.: opacity | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
0% { opacity: 0 }
49% { opacity: 0 }
50% { opacity: 1 }
100% { opacity: 1 }
0% { opacity: 1 }
49% { opacity: 1 }
50% { opacity: 0 }
100% { opacity: 0 }
0% { background-position: 10% 0% }
50% { background-position: 91% 100% }
100% { background-position: 10% 0% }
body { opacity: 0; transition: opacity cubic-bezier(0.6, 0, 0.4, 1) 0.5s }
```

### [Simple vex.js dialog example](https://codepen.io/i_cant_rap/pen/wzWzoX)

made with: nothing recognised — read the code

### [Easy Modal (WIP)](https://codepen.io/davevasquez/pen/dpPBvV)

held: fixed div.screen, fixed aside.modal, fixed aside.modal, fixed aside.modal, fixed aside.modal | made with: position: fixed · transition · :hover

```css
.modal { position: fixed; top: 50%; transform: translate(-50%, -50%); box-shadow: 0 0 5px 2px rgba(0,0,0,0.3) }
.screen { position: fixed; top: 0 }
.modal[aria-hidden='false'], .screen[aria-hidden='false'] { opacity: 1; transition: all 0.2s ease-in-out }
.modal[aria-hidden='true'], .screen[aria-hidden='true'] { opacity: 0; transition: all 0.2s ease-in-out }
.modal[aria-hidden='true'] { transform: translate(-50%, -60%) }
.screen[aria-hidden='true'] { transform: translateY(-50%) }
nav { padding-bottom: 20px; margin-bottom: 20px; border-bottom: 1px solid #333 }
nav a { text-transform: uppercase }
.modal p:last-child { margin-bottom: 0 }
.button-close { position: absolute; top: 10px }
.button-close::after { transition: all .15s ease-in-out }
```

### [Simple HTML5 Dialog Example](https://codepen.io/i_cant_rap/pen/XjWaJq)

made with: <dialog>

### [Dialog: Delete Collection](https://codepen.io/romshark/pen/WGeaWV)

made with: transition · :hover

```css
#viewport { position: absolute }
.card { transition: all 0.3s cubic-bezier(.25,.8,.25,1); box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23) }
.card p { margin-top: 1rem }
.card > .buttons { margin-top: 2rem }
.card button { transition: all 500ms cubic-bezier(0.190, 1.000, 0.220, 1.000); text-transform: uppercase }
.card .item { transition: all 500ms cubic-bezier(0.190, 1.000, 0.220, 1.000); margin-top: 1rem; position: relative }
.card .item-checkbox { margin-top: 1rem }
```

### [JS: Accessible Dialog](https://codepen.io/anthonyhastings/pen/OXeByr)

held: fixed div.dialog, fixed div.dialog-overlay | made with: position: fixed

```css
.dialog-overlay { position: fixed; top: 0 }
.dialog { position: fixed; top: 50%; transform: translate(-50%, -50%) }
.sr-only { opacity: 0; position: absolute }
```

### [Dynamically modal dialog bootstrap jquery](https://codepen.io/sheldonchaves/pen/KMLvqj)

made with: nothing recognised — read the code

### [Pure CSS Dialog Popup](https://codepen.io/chalarangelo/pen/xOeqOq)

made with: position: fixed · :hover

```css
#buttonCheck:checked + div.shadow { position: fixed; top: 0px; margin-top: 0px }
#buttonCheck:checked + div.shadow + div { position: fixed; margin-top: 0px; top: 20px }
```

### [Windows HTML5](https://codepen.io/Yoshi101/pen/oLqXLR)

made with: nothing recognised — read the code

### [In Defence of Dialog](https://codepen.io/samthor/pen/OXzjXP)

made with: :hover · <dialog>

### [Responsive Modal](https://codepen.io/asperellis/pen/gMXXBN)

held: fixed div.modal | made with: nothing recognised — read the code

### [Simple dialog demo](https://codepen.io/Harrewarre/pen/EyvyeO)

made with: <dialog>

### [Pseudo Element ::backdrop on Dialog Element](https://codepen.io/peterdillon/pen/ZOedmZ)

made with: position: fixed · :hover · <dialog>

```css
.ct p { margin-bottom: 1rem }
dialog { box-shadow: 0 5px 20px #222 }
dialog .close { position: absolute; transform: translate(16.5rem, -0.5rem) }
dialog::-webkit-backdrop { position: fixed; opacity: 0.5 }
dialog::backdrop { position: fixed; opacity: 0.5 }
```

### [Dialog element - React component](https://codepen.io/IbeVanmeenen/pen/RRpLxb)

made with: @keyframes · <dialog>

```css
hr { border-top: 1px solid #E0E4E8 }
.btn { text-transform: uppercase }
.dialog { box-shadow: 0 0 5px rgba(101, 110, 119, .2) }
.dialog[open] { animation: .2s linear slidein }
.dialog::backdrop { animation: .4s ease fade }
.dialog__btn { margin-top: 2rem }
from { transform: translate3d(0, 5px, 0) }
from { opacity: .3 }
to { opacity: 1 }
@keyframes slidein animates transform, transfrom
@keyframes fade animates opacity
```

### [Expanding Content Box Animation](https://codepen.io/kitsune/pen/mERPYR)

made with: @keyframes · transition

```css
from { opacity: 0 }
to { opacity: 1 }
from { opacity: 0 }
to { opacity: 1 }
from { opacity: 0 }
to { opacity: 1 }
h2 { margin-top: 0 }
.block { border-top: 1px solid rgba(255, 255, 255, 0.1); border-bottom: 1px solid rgba(0, 0, 0, 0.1); position: relative; box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22); transition: 0.3s all ease }
.block .smallblockcontent { opacity: 0; -webkit-animation: fadein 2s forwards; animation: fadein 2s forwards; animation-delay: 0.5s }
.block.expanded { transition: 0.3s all ease }
.block .content { opacity: 0 }
.block .content.display { -webkit-animation: fadein 2s forwards; animation: fadein 2s forwards; animation-delay: 0.5s }
```

### [Dialog Element](https://codepen.io/IbeVanmeenen/pen/BzzVLJ)

made with: @keyframes · <dialog>

```css
hr { border-top: 1px solid #E0E4E8 }
.btn { text-transform: uppercase }
.dialog { box-shadow: 0 0 5px rgba(101, 110, 119, .2) }
.dialog[open] { animation: .2s linear slidein }
.dialog::backdrop { animation: .4s ease fade }
.dialog__btn { margin-top: 2rem }
from { transform: translate3d(0, 5px, 0) }
from { opacity: .3 }
to { opacity: 1 }
@keyframes slidein animates transform, transfrom
@keyframes fade animates opacity
```

### [Angular Simple Popup - Static HTML](https://codepen.io/jtcraddock/pen/ezOEVG)

held: fixed div.popup-modal, fixed div.popup-modal, fixed div.popup-modal, fixed div.popup-overlay | made with: nothing recognised — read the code

### [Responsive Message Box with JavaScript Class](https://codepen.io/takaneichinose/pen/eZoZxv)

held: fixed div.msgbox-area | made with: position: fixed · transition · :hover · backdrop-filter

```css
.msgbox-area { position: fixed; bottom: 15px }
.msgbox-box { position: relative; box-shadow: 0 10px 15px rgba(0, 0, 0, 0.65); -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); transition: opacity 256ms ease-in }
.msgbox-box.msgbox-box-hide { opacity: 0 }
.msgbox-content { padding-bottom: 0.75rem }
.msgbox-command { padding-top: 0.75rem }
.msgbox-close { position: relative; transition: color 64ms ease-out, text-shadow 64ms ease-out }
.msgbox-area { top: 15px }
.msgbox-message-container { box-shadow: 0 0.3rem 0.5rem rgba(0, 0, 0, 0.5) }
.msgbox-message-container h1:first-child, .msgbox-message-container h3:first-chi { padding-top: 0 }
.msgbox-message-container h1:last-child, .msgbox-message-container h3:last-child { padding-bottom: 0 }
.msgbox-message-container p:first-child { padding-top: 0 }
.msgbox-message-container p:last-child { padding-bottom: 0 }
```

### [Wechat Dialog Mimicking](https://codepen.io/Simona_Deng/pen/JXarqK)

on scroll: div.message: transform+top | on hover of img.: p.J_noticeInput: opacity | made with: scroll() timeline · @keyframes · transition

```css
.avatar { background-position: center center }
.chat { position: relative }
.chat .box_hd { position: absolute; top: 0 }
.chat .box_hd .title_wrapper { position: relative }
.chat .box_bd { position: absolute; top: 0; bottom: 3.188rem }
.chat .box_ft { position: absolute; bottom: 0 }
.message { margin-bottom: 1.25rem; animation: goup 0.5s }
.message .avatar { margin-top: 0.938rem }
0% { transform: translate(0, 1.875rem) }
100% { transform: translate(0, 0) }
.bubble { vertical-align: top; position: relative }
.bubble:before { position: absolute; top: 0.938rem }
```

### [pop-up dialog with jquery](https://codepen.io/Bantina/pen/reZOPm)

made with: Web Animations API (.animate)

```css
.modal-mask { opacity: 0.4; filter:alpha(opacity=40); position: absolute; top:0 }
.modal-dialog { position: absolute; box-shadow: 0 0 15px #333232 }
```

```js
.animate({'bottom':-diabo-100+'px'},400)
.animate({'bottom':wHeight+10+'px'},400)
```

### [Form Modal example by using JQuery-UI](https://codepen.io/cmlonder/pen/BKPZJg)

made with: nothing recognised — read the code

```css
body { filter: progid: DXImageTransform.Microsoft.gradient( startColorstr='#fefefe', endColorstr='#e2e2e2', GradientType=0) }
input.text { margin-bottom: 20px }
#add-book { position: absolute; top: -1000px }
```

### [HTML5 Dialog](https://codepen.io/dwidomski/pen/rezQdL)

held: fixed menu.main-trigger | made with: position: fixed · @keyframes · <dialog>

```css
select { margin-bottom: 0 }
dialog[open] { -webkit-animation: pop 0.4s cubic-bezier(1, 0, 0.5, 1.5) 0s 1; animation: pop 0.4s cubic-bezier(1, 0, 0.5, 1.5) 0s 1 }
0% { transform: scale(0.2) }
100% { transform: scale(1) }
0% { transform: scale(0.2) }
100% { transform: scale(1) }
.button { margin-bottom: 0 }
.main-trigger { position: fixed; top: 50%; transform: translate(-50%, -50%) }
@keyframes pop animates transform
```

### [CSS-only link confirm dialog](https://codepen.io/kevinweber/pen/LNLNNG)

made with: :hover

```css
.link-confirm { position: relative }
.link-confirm input, .link-confirm a { position: absolute; top: 0 }
.link-confirm input { opacity: 0 }
```

### [Modal Layout](https://codepen.io/steviewondrs/pen/wGobjv)

held: fixed div.Modal | made with: position: fixed

```css
.Modal { position: fixed; top: 0 }
.ModalHeader { border-bottom: 1px solid #e5e5e5 }
.ModalHeader .close { opacity: 0.2 }
.ModalFooter { border-top: 1px solid #e5e5e5 }
```

### [Simple overlay dialog](https://codepen.io/kamalx/pen/yOVwNz)

held: fixed div.container, fixed div.overlay, fixed div.popover | made with: position: fixed · transition · :hover · popover

```css
.container { position: fixed; top: 0; bottom: 0 }
header, main, nav { position: relative }
nav { border-bottom: 1px solid #efefef }
.overlay { position: fixed; top: -120vh; transition: all 0.1s ease-in; opacity: 0 }
.overlay.active { top: 0; opacity: 1 }
.popover { position: fixed; transform: translateX(-50%); transition: all 0.3s ease-in; opacity: 0; margin-top: -120vh }
.popover.active { margin-top: 10rem; opacity: 1 }
.close-button { position: absolute; top: -1rem }
main { filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#9edff7', endColorstr='#a48df4', GradientType=1) }
nav h1 { opacity: 0.8 }
```

### [jQuery Dialog With Tabs](https://codepen.io/AllThingsSmitty/pen/yOVBbg)

held: fixed div.ui-widget-overlay | made with: Web Animations API (.animate)

```css
body { background-position: center center }
.ui-tabs .footer { bottom: 0; position: absolute }
```

```js
.animate({ top: offset.top }, { duration: 150 })
```

### [DailyUI #001: Steam Login](https://codepen.io/ivankahl/pen/GZjaaJ)

made with: :hover

```css
.container .content .form .separator { margin-top: 10px }
.btn { text-transform: uppercase }
```

### [react dialog](https://codepen.io/link0047/pen/PNNXbL)

held: fixed div | made with: transition

```css
html, body, #root, .app_root, .app_shell { position: relative }
.btn { margin-bottom: 0 }
.btn-toggle { position: absolute; top: 4px }
```

### [Comic Book Dialog: Staggered & Fainting Text](https://codepen.io/dudleystorey/pen/mPeaLJ)

made with: nothing recognised — read the code

### [Mario Maker Dialog](https://codepen.io/pasaribu/pen/grOxKv)

held: fixed div.refresh, fixed div.screen, fixed div.screen | on scroll: div.bar: transform+opacity ×20 | made with: position: fixed · GSAP

```css
.star { position: absolute; top: 50%; opacity: 0 }
.star.one { margin-top: -60px }
.refresh { position: fixed; top: 15px; -webkit-transform-origin: right top; -moz-transform-origin: right top; -ms-transform-origin: right top; -o-transform-origin: right top; transform-origin: right top; -webkit-transform: scale(0. }
.screen { position: fixed; top: 0; bottom: 0 }
.screen.top { -webkit-transform: translateY(-100%); -moz-transform: translateY(-100%); -ms-transform: translateY(-100%); -o-transform: translateY(-100%); transform: translateY(-100%) }
.screen.bottom { -webkit-transform: translateY(100%); -moz-transform: translateY(100%); -ms-transform: translateY(100%); -o-transform: translateY(100%); transform: translateY(100%) }
.par { position: absolute; top: 50%; margin-top: -50px; text-transform: uppercase }
.par.big { opacity: 0 }
```

### [Bootstrap Modal with react & fluxify](https://codepen.io/ducman/pen/WwNxXO)

made with: <dialog>

### [jQuery - simple dialog](https://codepen.io/uixcrazy/pen/LNPXjK)

held: fixed div.popup, fixed div.popup, fixed div.popup-backdrop | made with: position: fixed · @keyframes

```css
.popup-backdrop { position: fixed; top: 0; bottom: 0; opacity: 0.8; -webkit-animation: fadeIn 0.5s ease-in alternate; animation: fadeIn 0.5s ease-in alternate }
.popup { position: fixed; top: 0; bottom: 0 }
.popup .popup-ct { position: relative; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5); -webkit-animation: fadeInTo100 0.5s ease-in alternate; animation: fadeInTo100 0.5s ease-in alternate }
.popup .btn-popupclose { top: 11px; position: absolute }
.popup .btn-popupclose:after { margin-top: 2px }
from { opacity: 0 }
to { opacity: 0.8 }
from { opacity: 0 }
to { opacity: 0.8 }
from { opacity: 0 }
to { opacity: 1 }
from { opacity: 0 }
```

### [015 - Upload](https://codepen.io/roydigerhund/pen/ZQdbeN)

made with: @keyframes · transition · :hover

```css
.frame { position: absolute; top: 50%; margin-top: -200px; box-shadow: 1px 2px 10px 0px rgba(0, 0, 0, 0.3); filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#3A92AF", endColorstr="#5CA05A",GradientType=1 ) }
.center { position: absolute; top: 70px; box-shadow: 8px 10px 15px 0 rgba(0, 0, 0, 0.2) }
.title { border-bottom: 1px solid #D8D8D8 }
.dropzone { position: absolute; top: 86px }
.dropzone .input { position: absolute; top: 0; bottom: 0; opacity: 0 }
.upload-btn { position: absolute; bottom: 24px; box-shadow: 0 2px 0 0 #498C25; transition: all 0.2s ease-in-out }
.upload-btn:hover { box-shadow: 0 2px 0 0 #498C25, 0 2px 10px 0 #6ECE3B }
.bar { position: absolute; top: 49px; transition: all 3s ease-out; transform: scaleX(0) }
.bar.active { transform: scaleX(1) translate3d(0, 0, 0) }
.syncing { position: absolute; top: 109px; opacity: 0 }
.syncing.active { -webkit-animation: syncing 3.2s ease-in-out; animation: syncing 3.2s ease-in-out }
.done { position: absolute; top: 112px; opacity: 0 }
```

### [Angular Material Dialog Test](https://codepen.io/kylepaul/pen/YwvVJq)

made with: nothing recognised — read the code

### [UI Challenge - Budget Selector](https://codepen.io/AgentRR007/pen/adYQXV)

made with: :hover

```css
li:last-child { margin-top: -5px }
.container { box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2) }
.range { position: relative }
#line { position: relative }
.buttonBar { margin-top: 10px }
.circle { position: absolute; top: -18px; border-opacity: 0.1 }
```

### [dialog](https://codepen.io/linjiyeah/pen/LGQgbZ)

held: fixed div.mask, fixed div.dlg-fixer, fixed div.dlg-fixer | made with: position: fixed

```css
.mask { position: fixed }
.dlg-fixer { position:fixed; top:0 }
```

### [Dialog Component](https://codepen.io/xcb/pen/qbpeoB)

held: fixed div.c-dialog | made with: position: fixed

```css
.c-dialog { position: fixed; bottom: 0; top: 0 }
.c-dialog .c-content { position: absolute; top: 45%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%) }
.c-dialog .c-title { border-bottom: 1px solid #ddd }
```

### [ngEasyModal](https://codepen.io/lorenzodianni/pen/adLbBX)

held: fixed svg.[object | made with: position: fixed · @keyframes · :hover

### [Modal Dialog](https://codepen.io/dfitzy/pen/yeoeGO)

held: fixed div.modal_overlay | on scroll: a.open_button: background | made with: position: fixed · transition · :hover

```css
.modal { opacity: 0; position: absolute; -webkit-transition: opacity 600ms linear 600ms; -moz-transition: opacity 600ms linear 600ms; -ms-transition: opacity 600ms linear 600ms; -o-transition: opacity 600ms linear 600ms; transiti }
.modal_overlay { bottom: 0; opacity: 0; position: fixed; top: 0; -webkit-transition: opacity 200ms linear; -moz-transition: opacity 200ms linear; -ms-transition: opacity 200ms linear; -o-transition: opacity 200ms linear; transition: opac }
.display { opacity: 1 }
.open_button { position: relative; -webkit-transition: opacity 100ms linear; -moz-transition: opacity 100ms linear; -ms-transition: opacity 100ms linear; -o-transition: opacity 100ms linear; transition: opacity 100ms linear }
a.open_button { text-transform: uppercase }
a.open_button.load { opacity: 0 }
button.modal_close { position: absolute; top: 30px; -webkit-transition: -webkit-transform 600ms; -moz-transition: -moz-transform 600ms; -ms-transition: -ms-transform 600ms; -o-transition: -o-transform 600ms; transition: transform 600ms }
button.modal_close:hover { -webkit-transform: rotate(360deg) scale(1.10); -moz-transform: rotate(360deg) scale(1.10); -ms-transform: rotate(360deg) scale(1.10); -o-transform: rotate(360deg) scale(1.10); transform: rotate(360deg) scale(1.10); -webk }
button.modal_close span, span:before, span:after { position: absolute }
button.modal_close span:first-child { bottom: 0; position: absolute; top: 0 }
button.modal_close span:before { -webkit-transform: rotate(45deg); -moz-transform: rotate(45deg); -ms-transform: rotate(45deg); -o-transform: rotate(45deg); transform: rotate(45deg) }
button.modal_close span:after { -webkit-transform: translateY(-2px) rotate(-45deg); -moz-transform: translateY(-2px) rotate(-45deg); -ms-transform: translateY(-2px) rotate(-45deg); -o-transform: translateY(-2px) rotate(-45deg); transform: translateY(-2 }
```

### [Trans'connexion | Admin page + modal form dialog](https://codepen.io/naomihauret/pen/mVwGGa)

held: fixed aside, fixed div | made with: position: fixed · transition · :hover

```css
input { border-bottom: solid white 1px }
button { margin-top: 10px; margin-bottom: 10px }
#button_deconnexion { border-bottom: solid 4px #4581b3 }
#button_deconnexion:active { border-top: solid 4px #4078a6 }
aside { position: fixed; margin-top: auto }
#socialmedias li:nth-child(6) { border-bottom: solid darkred 4px }
header { border-bottom: solid 4px black }
nav { margin-top:20px }
.selected:hover, .unselected:hover { border-bottom: gold solid 8px; transition:0.2s }
nav ul { position:relative }
.unselected { border-bottom: solid rgba(80, 80, 80, 0.6) 8px; padding-top:5px }
.selected { border-bottom:solid 8px rgba(500, 500, 500, ) }
```

### [Confirm box](https://codepen.io/arshsingh/pen/GoEBQv)

held: fixed div.confirm_box | made with: position: fixed · :hover

```css
.confirm_box { position:fixed; top:0 }
.confirm_box .overlay { position:absolute; top:0 }
.confirm_box .confirm_model { position:absolute; top:0 }
.confirm_box .confirm_model .model .header { border-bottom:solid 2px #ccc }
.confirm_box .confirm_model .model .content .buttons_container .button { border-bottom:solid 2px transparent }
.confirm_box .confirm_model .model .content .buttons_container .button:hover { border-bottom:solid 2px rgba(0,0,0,0.4) }
```

### [Mac OS X Dialog Box](https://codepen.io/aarjithn/pen/yeMNjG)

made with: nothing recognised — read the code

```css
body { background-position: center }
.dialogue { box-shadow: 0px 15px 25px 0px rgba(50, 50, 50, 0.7) }
.titlebar { border-bottom: 1px solid #9e9e9e }
.body { position: relative }
.icon { position: absolute; top: 25px }
.hint { margin-top: 8px }
```

### [Bootstrap Modal](https://codepen.io/emotioner/pen/rxjeGX)

held: fixed div.modal | made with: nothing recognised — read the code

### [Modal Contact Form](https://codepen.io/tari/pen/zrYrVb)

held: fixed div.overlay | made with: position: fixed · transition · :hover · 3D (perspective / preserve-3d)

```css
body { perspective: 1000px }
.overlay { position: fixed; top: 0; bottom: 0 }
span { margin-top: 20px }
.contents { position: absolute; top: 50%; margin-top: -150px }
.contents__front { position: relative; box-shadow: 0 3px 15px rgba(0, 0, 0, 0.45) }
.contents__btn { position: absolute; bottom: 0; box-shadow: 0 1px 1px rgba(255, 255, 255, 0.25) inset }
.contents__btn:before { position: absolute; top: 50%; transform: translate(-50%, -50%); transition: width 0.175s ease }
.contents__back { position: absolute; top: 0; box-shadow: 0 3px 15px rgba(0, 0, 0, 0.45); transform: rotateX(-90deg) translateZ(150px); opacity: 0; transition-property: transform, opacity }
.contents__back label { margin-bottom: 3px }
.contents__back input[type=text] { margin-bottom: 10px; border-bottom: 1px solid #aaa }
.contents__back input[type=text]:focus { border-bottom: 1px solid #309E72 }
.contents__back input[type=submit] { margin-top: 15px }
```

### [Facebook Modal / Dialog](https://codepen.io/Mestika/pen/JYgzem)

held: fixed div.overlay | made with: position: fixed · :hover · Web Animations API (.animate)

```css
.facebook_dialog { opacity: 0; -webkit-box-shadow: 0 2px 26px rgba(0, 0, 0, .3), 0 0 0 1px rgba(0, 0, 0, .1); box-shadow: 0 2px 26px rgba(0, 0, 0, .3), 0 0 0 1px rgba(0, 0, 0, .1); -moz-box-shadow: 0 2px 26px rgba(0, 0, 0, .3), 0 0 0 1px r }
.inner_gray { border-bottom: 1px solid #e5e5e5 }
.inner_buttons { border-top: 1px solid #e9eaed }
.okay_button { -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05); box-shadow: 0 1px 1px rgba(0, 0, 0, .05); -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, .05); position: relative }
.cancel_button { -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05); box-shadow: 0 1px 1px rgba(0, 0, 0, .05); -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, .05); position: relative }
.close { background-position: 0 0 }
.close:hover { background-position: -13px 0 }
.overlay { position: fixed; top: 0 }
.show-dialog { -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05); box-shadow: 0 1px 1px rgba(0, 0, 0, .05); -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, .05); position: relative }
.greyBg { border-top: 1px solid #e1e2e3 }
.greyBg1 { border-top: 1px solid #e1e2e3 }
```

```js
.animate({
```

### [WIPThe list dialog using jQuery UI with ES5](https://codepen.io/tobynet/pen/pjMppZ)

made with: nothing recognised — read the code

### [ltdc ux cb ext dialog](https://codepen.io/ltdc_ux_cookbook/pen/GpLebE)

made with: nothing recognised — read the code

### [Pure CSS Only Awesome Dialog](https://codepen.io/w3core/pen/VvRqyX)

held: fixed div.dialog | on scroll: label.switch: background | on hover of a.: label.switch: background | made with: position: fixed · transition · :hover · 3D (perspective / preserve-3d)

```css
.dialog { top: 0; bottom: 0; opacity: 0; position: fixed; transition: opacity 0.4s linear, visibility 0.4s linear; perspective: 5px }
.dialog-body { position: absolute; top: 50%; transform: translateX(-50%) translateY(400px) scaleX(0) scaleY(0) rotateX(-60deg); transition: transform 0.4s, box-shadow 0.4s, border-radius 0.4s; box-shadow: 0 2em 1em #fff }
.dialog-body > * { transition: opacity 0.2s linear; opacity: 0 }
input:checked + .switch + .dialog, .dialog.visible { opacity: 1 }
input:checked + .switch + .dialog > .dialog-body, .dialog.visible > .dialog-body { transform: translateX(-50%) translateY(-50%) scaleX(1) scaleY(1) rotateX(0deg); box-shadow: 0 0 1em rgba(0, 0, 0, 0.5) }
input:checked + .switch + .dialog > .dialog-body > *, .dialog.visible > .dialog- { opacity: 1 }
.dialog-close { position: absolute; top: 0 }
```

### [Hotspot dialog](https://codepen.io/quilan84/pen/PPypGN)

on scroll: button.hotspot: transform+opacity | on hover of button.hotspot: button.hotspot: transform+opacity+top | made with: @keyframes · transition · :hover

```css
.hotspot-container { position: relative }
.hotspot-container .hotspot { position: absolute }
.focus { position: absolute; top: 6px; animation: focus 1.4s infinite cubic-bezier(0.165, 0.840, 0.440, 1.000); animation-fill-mode: both }
0% { opacity: 0; transform: scale(0.5,0.5); filter: blur(20px) }
50% { opacity: 1; transform: scale(1.0,1.0) }
100% { opacity: 0; transform: scale(2.0,2.0); filter: blur(20px) }
.ui-dialog { -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,0.3); -moz-box-shadow: 0 2px 4px 0 rgba(0,0,0,0.3); box-shadow: 0 2px 4px 0 rgba(0,0,0,0.3) }
.ui-dialog-titlebar { border-bottom: 1px solid rgba(255,255,255,0.1) }
.ui-button { box-shadow: inset 0px -1px 0px rgba(0,0,0,0.3), 0px 1px 1px rgba(0,0,0,0.3); -webkit-transition: all ease .3s; -moz-transition: all ease .3s; -o-transition: all ease .3s; transition: all ease .3s }
.ui-button:hover, .ui-button:focus { box-shadow: inset 0px -1px 0px rgba(0,0,0,0.3), 0px 1px 1px rgba(0,0,0,0.3), inset 0px 0px 0px 40px rgba(255,255,255,0.1) }
.ui-button:active { box-shadow: inset 0px -1px 0px rgba(0,0,0,0), 0px -1px 1px rgba(0,0,0,0.3), inset 0px 0px 0px 40px rgba(0,0,0,0.2) }
.ui-dialog-titlebar-close { top: 8px; position: absolute }
```

### [HTML 5 Dialog example with styles](https://codepen.io/davidjsalazarmoreno/pen/Xmxrab)

made with: transition · :hover · <dialog>

```css
#DialogoDribbble button { position: relative; margin-top: 7%; transition: background-color 500ms ease }
#DialogoDribbble button:hover { transition: background-color 500ms ease }
#DialogoDribbble dialog { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) }
#DialogoDribbble dialog header { margin-top: -19px; transition: background-color 350ms ease }
#DialogoDribbble dialog header a.fa-close { top: 0%; position: absolute; transition: color 350ms ease, transform 600ms ease }
#DialogoDribbble dialog header .fa-share-alt { position: absolute; top: 12% }
#DialogoDribbble dialog header h2:after { position: absolute }
#DialogoDribbble dialog footer li { transition: all 500ms ease }
#DialogoDribbble dialog footer li:hover { transition: all 500ms ease }
```

```js
addEventListener("mouseenter", cambioHeader, false)
```

### [Ejemplo HTML5 Dialog - HTML5 Dialog Example](https://codepen.io/davidjsalazarmoreno/pen/vNzovX)

made with: <dialog>

```css
#PrimerEjemploDialog button, #PrimerEjemploDialog p { position: relative }
#PrimerEjemploDialog p { margin-top: 7%; transform: translateX(-50%) }
#PrimerEjemploDialog button { transform: translateX(-50%) }
```

### [Dialog TAB Loop](https://codepen.io/rikschennink/pen/RWJPWY)

held: fixed section.dialog, fixed div.dialog-overlay | made with: position: fixed · requestAnimationFrame

```css
input { margin-bottom: 1em }
.dialog { position: fixed; top: 25% }
.dialog-overlay { position: fixed; bottom: 0; top: 0 }
.dialog-overlay:focus::after { position: absolute; top: 1em }
```

```js
requestAnimationFrame(function(){
```

### [DIY Custom Modal](https://codepen.io/joeaugie/pen/yYjMBr)

held: fixed div.overlay | made with: position: fixed · :hover

```css
.modal { position: relative }
.close { position: absolute; top: 0 }
.js .overlay { position: fixed; top: 0 }
.js .modal { position: absolute; top: 20px }
```

### [Dialog Example](https://codepen.io/neutraltone/pen/OyzGeM)

made with: <dialog>

### [Dialog Box Jquery](https://codepen.io/quangquanb2/pen/gaGpZj)

made with: position: fixed · :hover

```css
#over { position: fixed; top: 0; opacity: 0.8 }
#login-box { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.button { text-transform: uppercase }
.text-box { margin-top: 5px; box-shadow: none }
#login-box { padding-top: 10px }
#login-box .login-content { margin-top: 10px }
#login-box .login-content .username { padding-top: 10px }
#login-box .login-content .forgot { margin-top: 20px }
```

### [Responsive Modal jQuery Plugin](https://codepen.io/renanpupin/pen/KdmPxN)

made with: position: fixed · transition · :hover

```css
.modal { position: fixed; top: 0; bottom: 0; -webkit-transition: visibility 0.5s, opacity 0.5s cubic-bezier(0.55, 0, 0.1, 1); -o-transition: visibility 0.5s, opacity 0.5s cubic-bezier(0.55, 0, 0.1, 1); transition: visibility 0.5s }
.modal.open { opacity: 1 }
.modal .modal-dialog { position: relative }
.modal .modal-dialog .modal-content { position: relative; -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5); transition: all 1s cubic-bezier(0.55, 0, 0.1, 1) }
.modal .modal-dialog .modal-header { border-bottom: 1px solid #e5e5e5 }
.modal .modal-dialog .modal-header button.close { margin-top: -2px; filter: alpha(opacity=20); opacity: 0.2 }
.modal .modal-dialog .modal-header button.close:hover { opacity: 0.7 }
.modal .modal-dialog .modal-body { position: relative }
.modal .modal-dialog .modal-footer { border-top: 1px solid #e5e5e5 }
.modal .modal-dialog .modal-footer button#btnCloseModal, .modal .modal-dialog .m { opacity: 0.5 }
.modal .modal-dialog .modal-footer button#btnCloseModal:hover, .modal .modal-dia { opacity: 1 }
#modal { position: absolute }
```

### [iOs Style dialogs and options](https://codepen.io/JoaoAntonioMaruti/pen/EVZejK)

made with: :hover

```css
.openDialog { position: absolute; top: 10px }
.openOptions { position: absolute; top: 10px }
.optionsMenu { position: absolute; bottom: 0 }
.optionsMenu .optionsMenuItem:nth-last-child(1) { margin-top: 30px }
.dialog { position: absolute; top: 50%; margin-top: -175px }
.dialog-header { border-bottom: #b4b4b4 solid 1px }
.dialog-button a { position: relative; border-top: #b4b4b4 solid 1px }
.dialog-button a:nth-child(2) { bottom: 39px }
```

### [simple modal](https://codepen.io/joercamu/pen/RWKoMw)

held: fixed div.modal, fixed div.dialog | made with: position: fixed

```css
.modal { top: 0; position: fixed }
.modal .dialog { top: 25%; position: fixed; box-shadow: 0px 0px 15px 3px rgba(0, 0, 0, 0.5) }
```

### [iOS Dialog](https://codepen.io/ivankahl/pen/jbyVGm)

made with: :hover

```css
.flex-container { position:absolute; top:0; bottom:0 }
.dialog-header { border-bottom: rgb(180,180,180) solid 1px }
.dialog-button a { border-top: rgb(180,180,180) solid 1px }
```

### [Prompt Dialog with background blur](https://codepen.io/ndne/pen/NGbgYE)

made with: transition · :hover

```css
#dialog { position: absolute; top: 0; transition: visibility 0s linear 0.5s,opacity 0.5s linear; opacity: 0 }
.dialog_state { opacity: 0 }
.dialog_state:checked + #dialog, #dialog.dialog_open { opacity: 1 }
#dlg-back { position: absolute; top: 0 }
.dialog_state:checked + #dialog #dlg-wrap { opacity: 1 }
#dlg-wrap { position: relative; top: 50%; transform: translateY(-50%); box-shadow: 1px 1px 6px rgba(0,0,0,0.3); opacity: 0; padding-top: 0; padding-bottom: 0; transition: all .5s }
#dlg-close { position: absolute; top: 0 }
h2#dlg-header { text-transform: initial }
.main_area { transition: all 0.5s ease-out }
.dialog_state:checked ~ .main_area, .main_area.dialog_open { filter: blur(6px) }
.button, a.button { transition: .1s all }
.button:hover, a.button:hover { box-shadow: 0 1px 1px rgba(0,0,0,0.05) }
```

### [Status dialog boxes CSS only](https://codepen.io/ashwinsaxena/pen/gawayq)

made with: :hover

```css
.notif { position: relative }
.notif:before { position: absolute; top: 25px }
.notif-title:before, .notif-title:after { position: absolute }
.notif-notice .notif-title:before, .notif-notice .notif-title:after { top: 44px; -webkit-transform: rotate(45deg); -moz-transform: rotate(45deg); -ms-transform: rotate(45deg); -o-transform: rotate(45deg); transform: rotate(45deg) }
.notif-notice .notif-title:after { top: 50px }
.notif-alert .notif-title:before, .notif-alert .notif-title:after { top: 43px; -webkit-transform: rotate(45deg); -moz-transform: rotate(45deg); -ms-transform: rotate(45deg); -o-transform: rotate(45deg); transform: rotate(45deg) }
.notif-alert .notif-title:after { top: 48px }
.notif-warn .notif-title:before, .notif-warn .notif-title:after { top: 42px }
.notif-warn .notif-title:after { top: 54px }
.notif-controls { position: absolute; top: 0 }
.notif-controls > a { position: relative }
.notif-minimize:before { position: absolute; top: 11px }
```

### [Long modal window solution](https://codepen.io/uicodesign/pen/XmKwRG)

held: fixed div.modal-bg | made with: position: fixed · transition · :hover

```css
h1 { margin-bottom: 40px }
.modal-bg { position: fixed; top: 0; -webkit-transition: all 0.4s ease; -moz-transition: all 0.4s ease; transition: all 0.4s ease }
.modal-bg .modal-close { position: absolute; top: 0; opacity: 0.5 }
.modal-bg .modal-close:hover { opacity: 1 }
.modal-bg .modal { transform: translateY(150px); opacity: 0; box-shadow: 0px 15px 30px 0px rgba(58, 66, 85, 0.1), 0px 7px 10px 0px rgba(58, 66, 85, 0.05) }
.modal-bg.show .modal { transform: translateY(0); opacity: 1; -webkit-transition: all 0.4s ease; -moz-transition: all 0.4s ease; transition: all 0.4s ease }
```

### [My modal](https://codepen.io/sam0var/pen/xwGpRG)

held: fixed div.modal | made with: position: fixed

```css
body { position: relative }
.modal { position: fixed; top: 0; bottom: 0 }
.modal:before { position: relative }
```

### [showModalUsingDialog](https://codepen.io/echoeCode/pen/dYyjpo)

made with: <dialog>

### [lumx tooltip dialog test](https://codepen.io/beholderrk/pen/rONvWx)

held: fixed lx-dialog.dialog | made with: nothing recognised — read the code

### [Simple Confirmation dialog](https://codepen.io/pdjkeelan/pen/ZbEWdM)

held: fixed div.dialogOpen | made with: position: fixed

```css
body .dialogOpen { position: fixed; top: 26%; box-shadow: 4px 4px 10px black }
body .dialogOpen { top: 5% }
body .dialogOpen .buttons { margin-top: 25px }
body .dialogOpen .buttons .btn { box-shadow: 1px 1px 2px #5e7280 }
body .dialogOpen .buttons .btn:active { box-shadow: 0 0 0 }
```

### [Dialog with a "Pop!"](https://codepen.io/Made-of-Clay/pen/gpyXMy)

on hover of button.ui-button: button.ui-button: shadow | made with: transition · :hover

```css
.ui-button { transition: box-shadow 0.3s }
.ui-button.open { box-shadow: 0 0 3px rgba(0, 0, 0, 0.25) }
.ui-button.open:hover { box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25) }
.ui-dialog { box-shadow: 0 5px 10px rgba(0, 0, 0, 0.25) }
.ui-dialog.animated { animation-duration: 0.5s }
.ui-dialog.zoomIn { animation-timing-function: cubic-bezier(0.65, -0.45, 0.4, 1.96) }
.ui-dialog.zoomOut { animation-timing-function: cubic-bezier(0.69, -0.99, 0.69, 1.1) }
```

### [Drag'n'Drop](https://codepen.io/curdwithraisins/pen/OVrRbE)

made with: @keyframes

```css
.wrapper { position: absolute; top: 50%; margin-top: -100px }
.wrapper .circle-wrapper { animation: pop 0.5s ease }
.wrapper .nav .start#nav-1 { animation: disp 0.25s ease 0s, nav 0.5s ease 0.25s }
.wrapper .nav .start#nav-2 { animation: disp 0.5s ease 0s, nav 0.5s ease 0.5s }
.wrapper .nav .start#nav-3 { animation: disp 0.75s ease 0s, nav 0.5s ease 0.75s }
.wrapper .nav .start#nav-4 { animation: disp 1s ease 0s, nav 0.5s ease 1s }
.wrapper .nav #nav-1 { top: 0 }
.wrapper .nav #nav-2 { top: 0 }
.wrapper .nav #nav-3 { bottom: 0 }
.wrapper .nav #nav-4 { bottom: 0 }
.wrapper .drop { position: absolute; top: 50%; margin-top: -66.6666666667px; animation: drop 2s ease }
.wrapper .drop span { text-transform: uppercase }
```

### [Message Instruction](https://codepen.io/curdwithraisins/pen/waYdNq)

held: fixed header | on scroll: div.click-button: shadow | on hover of li.: div.click-button: shadow | made with: position: fixed · @keyframes · transition · Web Animations API (.animate)

```css
header { position: fixed; box-shadow: 0 0 3px rgba(0, 0, 0, 0.08) }
.back { position: absolute; top: 50%; margin-top: -3em }
.back .name { margin-bottom: 1em }
.back .click-button { animation: blink 1.5s infinite }
.shadow { position: absolute; opacity: 0 }
.message-wrapper { position: absolute }
.message-wrapper .message { position: relative; -webkit-box-shadow: 0 0 10px rgba(100, 100, 100, 0.6); -moz-box-shadow: 0 0 10px rgba(100, 100, 100, 0.6); -ms-box-shadow: 0 0 10px rgba(100, 100, 100, 0.6); box-shadow: 0 0 10px rgba(100, 100, 100, 0 }
.message-wrapper .message .message-text .title { padding-bottom: 3% }
.message-wrapper .message .message-nav { position: absolute; bottom: 0 }
.message-wrapper .message .message-nav .message-indicate .number li { opacity: 0.8 }
.message-wrapper .message .message-nav .message-indicate .number li:nth-child(1) { position: absolute; margin-top: 3px; opacity: 0.5 }
.message-wrapper .message .message-nav .message-indicate .number li:nth-child(1) { margin-top: 1px }
```

```js
.animate({'opacity': '0'}, 300)
.animate({'opacity': '1'}, 300)
```

### [Message chat](https://codepen.io/expdev/pen/LVgEvX)

on hover of button.btn: button.btn: background+color | made with: transition · :hover · Web Animations API (.animate)

```css
#wrapperchat { position: relative }
.chat .message-item .you { margin-top: 10px }
.dialog .btn { text-transform: uppercase; transition: 0.2s }
```

```js
.animate({
```

### [Just a material dialog](https://codepen.io/wortmann/pen/ZGjxmp)

made with: transition · :hover

```css
.ZebraDialog { box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22); opacity: 0; transition: opacity 0.4s 0.1s, visibility 0s 0s }
.ZebraDialog.ZebraTransition { transition: opacity 0s 0s, top 0s 1s, visibility 0s 1s }
.ZebraDialog_BodyOuter a { border-bottom: 1px solid rgba(0, 0, 0, 0.1) }
.ZebraDialog_Buttons > * { text-transform: uppercase; transition: all 0.4s }
button { text-transform: uppercase }
```

### [Modal](https://codepen.io/semenchenko/pen/KpRRzX)

made with: transition · :hover

```css
button { -webkit-box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.35); box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.35); position: relative }
.after { position: absolute; top: 0px }
.modal-wrap { position: relative }
.blur { -webkit-filter: blur(5px); filter: blur(5px); position: absolute; top: 0; bottom: 0 }
.mask { position: absolute; top: 0; bottom: 0 }
.m-content { position: absolute; top: 50%; margin-top: -150px; -webkit-box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.35); box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.35) }
.close { position: absolute; top: 10px }
#m-2 { margin-top: -200px }
#m-2 .title { padding-bottom: 20px }
.img-wrap { -webkit-transition: all .35s ease-in-out; -o-transition: all .35s ease-in-out; transition: all .35s ease-in-out }
.img-wrap:hover { -webkit-transform: rotate(360deg); -ms-transform: rotate(360deg); -o-transform: rotate(360deg); transform: rotate(360deg) }
#m-2 h3 { margin-bottom: 10px }
```

### [Modal Dialog](https://codepen.io/ryanmorr/pen/BNwKNj)

held: fixed div.dialog | on hover of button.: button.: background | made with: position: fixed · :hover

```css
.container { position: absolute; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%) }
button { margin-top: 4em }
.dialog, .dialog-overlay { top: 0 }
.dialog { position: fixed }
.dialog-overlay { position: absolute; opacity: 0; transition-property: opacity }
.dialog-content { position: absolute; top: 50%; position: relative; box-shadow: 0 0 8px rgba(0,0,0,.3); opacity: 0; -webkit-transform: translate(-50%, -50%) scale(1.15); transform: translate(-50%, -50%) scale(1.15); transition-property: o }
.show-dialog .dialog-overlay { opacity: 1 }
.dialog.show-dialog .dialog-content { opacity: 1; -webkit-transform: translate(-50%, -50%) scale(1); transform: translate(-50%, -50%) scale(1) }
```

### [AngularMaterial Dialogs](https://codepen.io/clairebones/pen/dozJOj)

made with: nothing recognised — read the code

### [Dialog with Date Picker](https://codepen.io/thelostbrain/pen/oXbJXp)

on hover of button.btn: button.btn: background | made with: nothing recognised — read the code

### [Dialog with Date Picker](https://codepen.io/thelostbrain/pen/LVGMVO)

on hover of button.btn: button.btn: background | made with: nothing recognised — read the code

### [jQueryUI Dialogs](https://codepen.io/chris-hore/pen/OVMPay)

on hover of a.: a.: color, span.glyphicons: color | made with: :hover

```css
textarea { box-shadow: inset 0 0 0.25rem #ddd }
textarea:focus { box-shadow: inset 0 0 1rem #EEEEEE }
.sr-only { position: absolute }
.form [class*='col'] { border-top: 0; position: relative }
.form > .row:nth-of-type(1) > div, .form > .row:nth-of-type(2) > div.col-md-6 { border-top: solid 2px #a0a0a0 }
.form label { position: absolute; top: 1em }
.form input[type="text"]:before, .form input[type="password"]:before { position: absolute; top: 0 }
.instructions { top: 0px; -webkit-box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.63); -moz-box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.63); box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.63) }
```

### [Modal Effects](https://codepen.io/enPep/pen/VLYVmd)

held: fixed div.modalDialog | on hover of button.: button.: background | made with: position: fixed · :hover

```css
.modalDialog { position: fixed; top: 0; bottom: 0; opacity: 0 }
.modalDialog:target { opacity: 1 }
.modalDialog > .div { position: relative }
.close { position: absolute; top: -10px }
```

### [Show HTML5 Dialog](https://codepen.io/tfirdaus/pen/eNYZyz)

on hover of button.btn: button.btn: background | made with: :hover · <dialog>

```css
.site-header h1, .site-header a { text-transform: uppercase }
.boxed-group { margin-top: 50px }
.boxed-group section:first-child { border-bottom: 1px solid #e6e9ed }
.boxed-group section:only-of-type, .boxed-group section:only-child { border-bottom: 0 }
```

### [Flexbox dialog](https://codepen.io/greg-dorrian/pen/YPmNzm)

held: fixed div.flex-outer-container | on hover of a.btn: a.btn: background | made with: position: fixed · transition

```css
.flex-outer-container { position: fixed; top: 0%; -webkit-opacity: 0; -moz-opacity: 0; opacity: 0; -webkit-transition: all 0.5s; -moz-transition: all 0.5s; -ms-transition: all 0.5s; -o-transition: all 0.5s }
.flex-outer-container.active { -webkit-opacity: 1; -moz-opacity: 1; opacity: 1 }
.flex-outer-container .flex-inner-container { -webkit-transition: all 0.5s; -moz-transition: all 0.5s; -ms-transition: all 0.5s; -o-transition: all 0.5s; -webkit-box-shadow: 0px 5px 8px rgba(0, 0, 0, 0.1); -moz-box-shadow: 0px 5px 8px rgba(0, 0, 0, 0.1); box-shadow: }
.flex-outer-container .flex-inner-container .title { padding-bottom: 20px }
.flex-outer-container .flex-inner-container .footer { margin-top: 24px }
.flex-outer-container .flex-inner-container .footer a { text-transform: uppercase; -webkit-transition: all 0.5s; -moz-transition: all 0.5s; -ms-transition: all 0.5s; -o-transition: all 0.5s }
```

### [Incoming Call](https://codepen.io/shiroari/pen/QwXQGN)

on hover of li.action: a.: background | made with: @keyframes · transition · :hover · 3D (perspective / preserve-3d) · canvas 2D · requestAnimationFrame

```css
.container { position: relative; perspective: 600px }
.call { position: absolute; transition: all 1s, background-color 600ms, opacity 600ms }
.-fadeout { filter: blur(6px); opacity: 0 }
.-drop { filter: blur(6px); opacity: 0; transform: translateY(20%) rotateX(20deg) }
.-flip { transform: rotateY(180deg) }
.flipback { transform: rotateY(-180deg) }
.-ringing { -webkit-animation: _ringing 600ms infinite; animation: _ringing 600ms infinite; -webkit-animation-fill-mode: forward; animation-fill-mode: forward; -webkit-animation-direction: normal; animation-direction: normal; -webki }
0% { transform: translate(0, 0) }
10% { transform: translate(6px, 0px); transform: rotateZ(2deg) }
20% { transform: translate(-6px, 0px); transform: rotateZ(-2deg) }
30% { transform: translate(3px, 0px); transform: rotateZ(1deg) }
40% { transform: translate(-3px, 0px); transform: rotateZ(-1deg) }
```

```js
requestAnimationFrame(animate)
```

### [Material Dialogs](https://codepen.io/TylerThompson/pen/azrmBW)

on hover of button.: button.: background | made with: :hover

```css
.dialog { padding-bottom: 8px; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.23), 0 10px 40px rgba(0, 0, 0, 0.19) }
.title { text-transform: capitalize; margin-bottom: 15px }
p.content { padding-bottom: 16px }
.dialog-actions button { text-transform: uppercase }
```

### [jQuery-UI: Dialog popup with buttons](https://codepen.io/itsthomas/pen/pvGmvV)

made with: nothing recognised — read the code

### [CSS Animated Dialog Box](https://codepen.io/ashwinsaxena/pen/PwVaJO)

held: fixed div.dialog | made with: position: fixed · @keyframes · transition

```css
.dialog, .dialog__overlay { top: 0 }
.dialog { position: fixed }
.dialog__overlay { position: absolute; opacity: 0; -webkit-transition: opacity 0.3s; transition: opacity 0.3s }
.dialog--open .dialog__overlay { opacity: 1 }
.dialog__content { position: relative; opacity: 0 }
.dialog.dialog--open .dialog__content { opacity: 1 }
.morph-shape { position: absolute; top: -2px }
.dialog--open .morph-shape svg rect { -webkit-animation: anim-dash 0.6s forwards; animation: anim-dash 0.6s forwards }
.dialog-inner { opacity: 0 }
.dialog--open .dialog-inner { opacity: 1; -webkit-transition: opacity 0.85s 0.35s; transition: opacity 0.85s 0.35s }
.dialog.dialog--open h2 { -webkit-animation: anim-elem-1 0.7s ease-out both; animation: anim-elem-1 0.7s ease-out both }
.dialog.dialog--open button { -webkit-animation: anim-elem-2 0.7s ease-out both; animation: anim-elem-2 0.7s ease-out both }
```

### [Modern dialog drawing time](https://codepen.io/the_joshb/pen/MYZwza)

made with: nothing recognised — read the code

```css
#triangle-topleft { border-top: 50px solid #f00; position: relative; top: 20px }
.container { position: relative; top: 20px }
```

### [Modal Dialog with pure CSS3](https://codepen.io/mel/pen/bNQvGb)

held: fixed div.overlay, fixed div.overlay, fixed div.overlay, fixed div.overlay, fixed div.overlay | made with: position: fixed · transition · :hover

```css
input[type=checkbox] + label { position: absolute; top: 0 }
input[type=checkbox] + label:hover:after { transform: scale(2) }
input[type=checkbox] + label:after { transform: rotate(70deg); transition: transform 1s }
input[type=checkbox] + label h2 { position: absolute; top: 50%; transform: translate(-50%, -50%) }
p { position: absolute; opacity: 0; transition: width 1s }
p > label { position: absolute; top: 10px }
p > span > span { margin-bottom: 20px }
.overlay { position: fixed; top: 0 }
input[type=checkbox]:checked + label + .overlay + p { opacity: 1; position: relative; transition: opacity 1s 0.5s }
```

### [Dual axes responsive dialog](https://codepen.io/sandrojohanides/pen/azQNML)

held: fixed div.modal | made with: position: fixed

```css
.modal { position: fixed; top: 0 }
main { padding-bottom: 0 }
header { text-transform: uppercase; border-bottom: 1px solid #ccc }
footer { border-top: 1px solid #ccc }
```

### [A Progressively Enhanced Lightbox with srcset and CSS Animation](https://codepen.io/dudleystorey/pen/LEBjyL)

held: fixed dialog | made with: position: fixed · @keyframes · transition · :hover · <dialog>

```css
to { top: 50% }
to { top: 50% }
to { top: 200% }
to { top: 200% }
dialog { position: fixed; top: -50%; transform: translate(-50%, -50%) }
dialog[open] { -webkit-animation: fallDown 1s 0.4s forwards; animation: fallDown 1s 0.4s forwards }
dialog.closer { top: 50%; -webkit-animation: fallOff 1s 0.4s forwards; animation: fallOff 1s 0.4s forwards }
#closeDetails { position: fixed; top: -10px; transition: 0.3s background; padding-top: 0.3rem; box-shadow: 0 0 8px rgba(0, 0, 0, 0.3) }
dialog[open]::-webkit-backdrop { -webkit-animation: fadeToNearBlack 1s forwards; animation: fadeToNearBlack 1s forwards }
dialog[open]::backdrop { -webkit-animation: fadeToNearBlack 1s forwards; animation: fadeToNearBlack 1s forwards }
dialog.closer::-webkit-backdrop { -webkit-animation: fadeToClear 1s 1s forwards; animation: fadeToClear 1s 1s forwards }
dialog.closer::backdrop, dialog.closer + .backdrop { -webkit-animation: fadeToClear 1s 1s forwards; animation: fadeToClear 1s 1s forwards }
```

### [Modal/Dialog example](https://codepen.io/oscarpersson/pen/PwaBNm)

held: fixed div.modal | made with: position: fixed · transition

```css
.modal { position: fixed; top: 0; opacity: 0 }
.modal.is-open { opacity: 1 }
.modal-inner { position: absolute; top: 0; -webkit-transform: translate3d(0,-1000px,0); -moz-transform: translate3d(0,-1000px,0); -o-transform: translate3d(0,-1000px,0); transform: translate3d(0,-1000px,0) }
.trans-opacity { -webkit-transition: opacity 150ms ease-out; -moz-transition: opacity 150ms ease-out; -o-transition: opacity 150ms ease-out; transition: opacity 150ms ease-out }
.trans-transform { -webkit-transition: -webkit-transform 400ms cubic-bezier(.13,1.07,.5,1.01) 80ms; -moz-transition: -moz-transform 400ms cubic-bezier(.13,1.07,.5,1.01) 80ms; -o-transition: -o-transform 400ms cubic-bezier(.13,1.07,.5,1.01) }
```

### [Responsive Dialog](https://codepen.io/Cel/pen/pvVPOZ)

held: fixed div.dialog | on hover of a.btn: a.btn: background | made with: position: fixed · @keyframes · transition · :hover

```css
.dialog, .dialog__overlay { top: 0 }
.dialog { position: fixed }
.dialog__overlay { position: absolute; opacity: 0; transition: all 0.3s }
.dialog__content { position: relative; opacity: 0 }
.dialog--open h2, .dialog--open button { -webkit-animation: anim-elem 0.4s both; animation: anim-elem 0.4s both }
.dialog--open h2 { -webkit-animation-delay: 0.25s; animation-delay: 0.25s }
.dialog--open button { -webkit-animation-delay: 0.15s; animation-delay: 0.15s }
.dialog--open .dialog__overlay, .dialog--open .dialog__content { -webkit-animation-duration: 0.4s; animation-duration: 0.4s; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards }
.dialog--open .dialog__overlay { opacity: 1 }
.dialog--open .dialog__content { -webkit-animation-name: anim-open; animation-name: anim-open; -webkit-animation-timing-function: cubic-bezier(0.7, 0, 0.3, 1); animation-timing-function: cubic-bezier(0.7, 0, 0.3, 1) }
.dialog--open .dialog__content, .dialog--close .dialog__content { -webkit-animation-duration: 0.4s; animation-duration: 0.4s; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards }
.dialog--close .dialog__content { -webkit-animation-name: anim-close; animation-name: anim-close }
```

### [Google Material Design Dialog](https://codepen.io/bwilsonvi/pen/VYygGz)

on hover of a.buttonTouchTarget: div.buttonFlat: background | made with: nothing recognised — read the code

```css
body { margin-top: 0; margin-bottom: 0 }
.dialogContainer { -webkit-box-shadow: 0 -2px 25px 0 rgba(0, 0, 0, 0.15), 0 13px 25px 0 rgba(0, 0, 0, 0.3); padding-top: 0; padding-bottom: 0; margin-top: 0; margin-bottom: 0 }
.dialogContent { padding-top: 21px; padding-bottom: 12px; margin-top: 0; margin-bottom: 0 }
.dialogContentTitle { padding-top: 0; padding-bottom: 0; margin-top: 0; margin-bottom: 0 }
.dialogContentBody { padding-top: 14px; padding-bottom: 0; margin-top: 0; margin-bottom: 0 }
.dialogActionBar { padding-top: 0; padding-bottom: 8px; margin-top: 0; margin-bottom: 0 }
.buttonFlat { padding-top: 0; padding-bottom: 0; margin-top: 6px; margin-bottom: 6px }
```

### [dialog](https://codepen.io/SivaKranthiKumar/pen/EaoEXw)

made with: <dialog>

### [vModal](https://codepen.io/LukaszWatroba/pen/MYOBKb)

on scroll: path.[object: color ×2, a.u-inlineBlock: color, svg.[object: color, g.[object: color, br.: color, small.: color | on hover of button.Button: path.[object: color ×2, button.Button: background, a.u-inlineBlock: color, svg.[object: color, g.[object: color, br.: color | made with: position: fixed · @keyframes · transition · :hover

```css
v-modal { position: fixed; top: 0 }
v-modal v-close { position: absolute; top: 0 }
v-dialog { position: relative }
.vModal--default { transition: opacity 0.25s }
.vModal--default v-dialog { will-change: transform; -webkit-animation: vDialog-enter 0.5s; animation: vDialog-enter 0.5s }
.vModal--default v-close::after, .vModal--default v-close::before { position: absolute; top: 50% }
.vModal--default v-close::before { transform: rotate(-45deg) }
.vModal--default v-close::after { transform: rotate(45deg) }
.vModal--default v-close::after, .vModal--default v-close::before { transition: background-color 0.25s }
.vModal--default.ng-enter { opacity: 0 }
.vModal--default.ng-enter-active { opacity: 1 }
.vModal--default.ng-leave { opacity: 1 }
```

### [CSS and Pure Javascript Dialog](https://codepen.io/desertlion/pen/XJMWJr)

made with: transition · :hover

```css
h1 { border-bottom: 1px solid #eee }
p { margin-bottom: 0.5em }
ul { margin-bottom: 1.3rem }
#container { box-shadow: 0 0 15px rgba(0, 0, 0, 0.3) }
#showDialogBtn { margin-bottom: 1.3rem; border-bottom: 5px solid #001a16; transition: all 0.32s }
#showDialogBtn:focus, #showDialogBtn:active { box-shadow: 0 0 7px rgba(0, 0, 0, 0.7) }
#overlay { position: absolute; top: 0 }
#dialog { position: absolute; top: -150%; margin-top: -150px; box-shadow: 0 0 17px rgba(0, 0, 0, 0.5); transition: all 0.32s }
#dialog h2 { margin-bottom: 1.5rem }
#dialog.maximize { top: 0 }
.dialog--toolbar { position: absolute; top: 10px }
```

### [Modal concept](https://codepen.io/ilanf/pen/vEXoqK)

held: fixed div.modal-wrapper | made with: position: fixed · :hover · Web Animations API (.animate)

```css
.center-page { position: absolute; top: 50%; transform: translate(-50%, -50%) }
.modal .modal-overlay { position: absolute; top: 0; bottom: 0; transform: translate3d(0, 0, 0) }
.modal .modal-wrapper { border-top: 0; box-shadow: 0 1px 10px rgba(0, 0, 0, 0.4); position: fixed; top: -100%; transform: translateX(-50%) }
.modal .modal-title { border-bottom: 1px solid #eee }
.modal .modal-buttons { border-top: 1px solid #eee; position: absolute; bottom: 0 }
```

```js
.animate({top: 0}, 'fast')
.animate({top: '-100%'}, 'fast', function() {
```

### [Jelly Bouncy Modal](https://codepen.io/nodws/pen/vELwJz)

held: fixed div.dialog | on hover of a.open: a.open: background | made with: position: fixed · @keyframes · transition · :hover

```css
h1 { box-shadow:0 200px 150px -150px rgba(0,0,0,0.7) inset }
.btn { position: relative; transition: all 0.2s }
.dialog, .dialog-overlay { top: 0 }
.dialog { position: fixed }
.dialog-overlay { position: absolute; opacity: 0; -webkit-transition: opacity 0.3s; transition: opacity 0.3s }
.dialog-open .dialog-overlay { opacity: 1 }
.dialog-content { position: relative; opacity: 0; box-shadow:0 3px 36px 0 rgba(0, 0, 0, 0.6) }
.dialog.dialog-open .dialog-content, .dialog.dialog-close .dialog-content { -webkit-animation-duration: 1s; animation-duration: 1s; -webkit-animation-timing-function: linear; animation-timing-function: linear; -webkit-animation-fill-mode: forwards; animation-fill-mode: forwards }
.dialog.dialog-open .dialog-content { -webkit-animation-name: anim-open; animation-name: anim-open }
.dialog.dialog-close .dialog-content { -webkit-animation-name: anim-close; animation-name: anim-close; -webkit-animation-duration: 0.3s; animation-duration: 0.3s; -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out }
0% { opacity: 0; -webkit-transform: matrix3d(0.7, 0, 0, 0, 0, 0.7, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(0.7, 0, 0, 0, 0, 0.7, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1) }
2.083333% { -webkit-transform: matrix3d(0.75266, 0, 0, 0, 0, 0.76342, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); transform: matrix3d(0.75266, 0, 0, 0, 0, 0.76342, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1) }
```

### [jQuery UI dialog box](https://codepen.io/starlitewalker/pen/OPMMMQ)

made with: nothing recognised — read the code

### [HTML5 Dialog Sample](https://codepen.io/ianaya89/pen/JoYzdz)

held: fixed div | made with: position: fixed · transition · <dialog>

```css
button { position: relative; transition: all 0.1s; -webkit-transition: all 0.1s }
.red { border-bottom: 5px solid #BD3E31 }
.green { border-bottom: 5px solid #669644 }
.blue { border-bottom: 5px solid #2980B9 }
#dialogBG { position: fixed; top: 0 }
```

### [CSS Toggleable Dialog Box](https://codepen.io/kzf/pen/dPYbKE)

made with: transition

```css
.info { position: absolute; bottom: 20px; transform: translateY(0); transition: transform 0.3s ease-out }
.info-label { position: absolute; top: 3px }
input:checked ~ .info { transform: translateY(100%) }
```

### [Modern HTML5 Lightbox in 12 Lines of JavaScript](https://codepen.io/dudleystorey/pen/bNdvym)

held: fixed dialog | made with: position: fixed · @keyframes · <dialog>

```css
dialog { position: fixed; top: 50%; transform: translate(-50%, -50%); opacity: 0 }
.backdrop { position: fixed; top: 0; bottom: 0 }
to { opacity: 1 }
to { opacity: 1 }
dialog[open] { -webkit-animation: goBig 1s .4s forwards; animation: goBig 1s .4s forwards }
dialog[open]::-webkit-backdrop { -webkit-animation: fadeToNearBlack 1s forwards; animation: fadeToNearBlack 1s forwards }
dialog[open]::backdrop { -webkit-animation: fadeToNearBlack 1s forwards; animation: fadeToNearBlack 1s forwards }
.backdrop { -webkit-animation: fadeToNearBlack 1s forwards; animation: fadeToNearBlack 1s forwards }
@keyframes fadeToNearBlack animates background
@keyframes goBig animates opacity
```

### [Alert, confirm and prompt dialogs](https://codepen.io/onsen/pen/Qwwxyp)

made with: nothing recognised — read the code

### [Dialog example](https://codepen.io/onsen/pen/zxxaGa)

made with: nothing recognised — read the code

### [Onsen UI dialog example](https://codepen.io/argelius/pen/zxxaYj)

made with: nothing recognised — read the code

### [Warning dialog ARIA](https://codepen.io/design8383/pen/RNNwrg)

made with: position: fixed · <dialog>

```css
dialog[open] { position: fixed; top: 0; bottom: 0 }
```

### [HTML5 Animated Dialog Element](https://codepen.io/dudleystorey/pen/EaYEGw)

made with: position: fixed · @keyframes · transition · <dialog>

```css
figure#launchtime button { box-shadow: 0 8px 0 rgb(183,9,0),0 15px 20px rgba(0,0,0,.35); text-transform: uppercase; transition: .4s all ease-in }
figure#launchtime button span { position:relative }
figure#launchtime button.pressed { padding-top: 3px; transform: translateY(4px); box-shadow: 0 4px 0 rgb(183,0,0), 0 8px 6px rgba(0,0,0,.45) }
figure#launchtime figcaption { margin-top: 2rem }
dialog { position: absolute }
dialog::-webkit-backdrop { -webkit-animation: fadeIn .5s forwards; animation: fadeIn .5s forwards }
dialog::backdrop { -webkit-animation: fadeIn .5s forwards; animation: fadeIn .5s forwards }
.backdrop { position: fixed; top: 0; bottom: 0; -webkit-animation: fadeIn .5s forwards; animation: fadeIn .5s forwards }
@keyframes fadeIn animates background
```

### [Dialog window](https://codepen.io/wontem/pen/NWZdOb)

made with: @keyframes · transition

```css
body:active .inner { transition: none }
.wrapper { position: absolute; bottom: 0; top: 0; transform: translateZ(0) }
.inner { transition: all 0.3s }
.inner::after { position: absolute; top: 0; transition: all 0.2s ease-out }
h1 { margin-bottom: 1em; text-transform: uppercase }
.btn-ok, .btn-cancel { position: absolute; top: 0 }
.btn-ok::after, .btn-cancel::after { position: absolute; top: 0; bottom: 0 }
.cancel .btn-ok::after, .ok .btn-ok::after, .cancel .btn-cancel::after, .ok .btn { -webkit-animation: pulse 0.2s 2 alternate ease-in-out; animation: pulse 0.2s 2 alternate ease-in-out }
from { transform: scale(1) }
to { transform: scale(0.7); opacity: 0.7 }
from { transform: scale(1) }
to { transform: scale(0.7); opacity: 0.7 }
```

### [jQuery Confirmation Dialog](https://codepen.io/jasondavis/pen/LYoZPJ)

made with: position: fixed · :hover

```css
.item { padding-bottom: 6px; margin-bottom: 30px; position:relative }
.item .delete { position:absolute; top:10px }
#confirmOverlay { position:fixed; top:0 }
#confirmBox { position:fixed; top:50%; -moz-box-shadow: 0 0 2px rgba(255, 255, 255, 0.6) inset; -webkit-box-shadow: 0 0 2px rgba(255, 255, 255, 0.6) inset; box-shadow: 0 0 2px rgba(255, 255, 255, 0.6) inset }
#confirmBox p { padding-top: 35px }
#confirmBox .button { position:relative }
#confirmBox .button span { position:absolute; top:0 }
#confirmBox .blue { background-position:left top }
#confirmBox .blue span { background-position:-195px 0 }
#confirmBox .blue:hover { background-position:left bottom }
#confirmBox .blue:hover span { background-position:-195px bottom }
#confirmBox .gray { background-position:-200px top }
```

### [Flat confirm dialog](https://codepen.io/lahphim/pen/rNbXxb)

on hover of span.dg-close-btn: span.dg-close-btn: background | made with: transition · :hover

```css
.dg-container { box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.3); transition: all 0.2s; position: relative }
.dg-container.hide { opacity: 0 }
.dg-container .dg-header { box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1) }
.dg-container .dg-header .dg-close-btn { transition: all 0.2s }
.dg-container .dg-footer { box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.1) }
.dg-container .dg-footer .dg-ok-btn, .dg-container .dg-footer .dg-cancel-btn { transition: all 0.2s }
```

### [Youtube Video in Modal/Dialog stops when closed](https://codepen.io/kruxor/pen/qBwOLE)

made with: nothing recognised — read the code

### [Loading dialogs](https://codepen.io/Designer023/pen/abxody)

held: fixed div.toggler, fixed div.toggler, fixed div.toggler, fixed div.dialog-bg | made with: position: fixed · @keyframes

```css
from, to { opacity: 0 }
100% { opacity: 1 }
from, to { opacity: 0 }
100% { opacity: 1 }
from, to { transform: rotate(0deg) }
5% { transform: rotate(0deg) }
45% { transform: rotate(180deg) }
55% { transform: rotate(180deg) }
95% { transform: rotate(360deg) }
100% { transform: rotate(360deg) }
from, to { transform: rotate(0deg) }
5% { transform: rotate(0deg) }
```

### [Dialog Boilerplate](https://codepen.io/nagarajhubli/pen/vYPOqE)

held: fixed div.dialog-overlay, fixed div.dialog | made with: position: fixed

```css
.dialog-overlay { position: fixed; top: 0; bottom: 0 }
.dialog { position: fixed; top: 50%; margin-top: -50px }
```

### [subscription dialog](https://codepen.io/cv2k10/pen/QWYZGK)

made with: nothing recognised — read the code

```css
#testBlockl h1 { margin-bottom: 0; margin-top: 0 }
#testBlockl p { margin-bottom: 5px; margin-top: -10px }
#testBlockl img { margin-top: 0 }
#testBlockl ul { margin-bottom: 0 }
#testBlockl li { margin-bottom: 5px; margin-bottom: 10px }
#ctl00_content_txtEmail { margin-top: 3px }
#testBlockl p.privacy { margin-top: 2px }
```

### [Responsive and nice modal](https://codepen.io/tsotsoblotso/pen/ExeZmv)

made with: transition · :hover

```css
.modal { position: absolute; top: 0; bottom: 0 }
.modal-dialog { position: relative; box-shadow: 15px 0 20px rgba(0, 0, 0, 0.16), -15px 0 20px rgba(0, 0, 0, 0.16), 0 15px 20px rgba(0, 0, 0, 0.16), 0 -15px 20px rgba(0, 0, 0, 0.16); transition: 0.3s }
.modal-dialog-closed { margin-top: -110% }
.modal-content > .modal-header { border-bottom: 1px solid rgba(0, 0, 0, 0.2) }
.modal-content > .modal-body { position: absolute; top: 51px; bottom: 60px }
.modal-content > .modal-footer { position: absolute; top: auto; bottom: 0; border-top: 1px solid rgba(0, 0, 0, 0.2) }
```

### [Dialog](https://codepen.io/thanhnguyenit2011/pen/bGxeRG)

held: fixed a.showfr | on scroll: a.showfr: background | made with: position: fixed · :hover

```css
#over { position: fixed; top: 0; opacity: 0.8 }
.login a { position:fixed; top:50% }
#flogin { position:absolute; top:5% }
#flogin h1 { border-bottom: 1px solid; padding-bottom:7px }
#flogin .close { position:absolute; top:0 }
.fr { padding-bottom:10% }
.fr input { padding-top:5px; padding-bottom:5px }
.fr .btnlogin { margin-top:5px }
```

### [Paper like dialog compoent](https://codepen.io/uniqname/pen/zYJvXj)

held: fixed div.lds-dialog | made with: position: fixed · @keyframes · transition

```css
0% { transform: scaleY(0) translate(-50%, -50%) }
100% { transform: scaleY(1) translate(-50%, -50%) }
0% { transform: scaleY(0) translate(-50%, -50%) }
100% { transform: scaleY(1) translate(-50%, -50%) }
0% { transform: scaleY(1) translate(-50%, -50%) }
100% { transform: scaleY(0) translate(-50%, -50%) }
0% { transform: scaleY(1) translate(-50%, -50%) }
100% { transform: scaleY(0) translate(-50%, -50%) }
0% { transform: scale(0) translate(-100%, -100%) }
100% { transform: scale(1) translate(-50%, -50%) }
0% { transform: scale(0) translate(-100%, -100%) }
100% { transform: scale(1) translate(-50%, -50%) }
```

### [Fancy Modal Window without JavaScript](https://codepen.io/dsheiko/pen/PoabVr)

held: fixed span.target, fixed span.target, fixed div.modal | made with: position: fixed · transition

```css
.target { position: fixed; top: 0 }
.modal { position: fixed; top: 0; bottom: 0 }
.modal > .content { position: relative }
.modal > .content .close-btn { position: absolute; top: 18px }
.modal.is-expanded > .content { top: 50%; margin-top: -45px }
:root .target:target ~ .page-container { filter: blur(5px); -webkit-filter: blur(5px); filter: url("data:image/svg+xml; // for Firefox filter:progid:DXImageTransform.Microsoft.Blur(PixelRadius='5') }
:root span[id="start"]:target ~ .page-container { filter: none; -webkit-filter: none }
:root .modal { transition: transform 0.3s cubic-bezier(0.5, -0.5, 0.5, 1.5); transform: scale(0, 0) }
:root .modal > .content { box-shadow: 0 5px 20px rgba(0,0,0,0.5) }
:root .target:target + .modal { transform: scale(1, 1) }
```

### [jQuery UI hidden menu](https://codepen.io/tran2/pen/WNJowe)

made with: nothing recognised — read the code

### [自己写的弹出层效果](https://codepen.io/MRain/pen/qBjmJX)

made with: nothing recognised — read the code

```css
.test button { margin-top: 1500px }
.overLay { position: absolute; top: 0; opacity: 0.5 }
.dialog { position: absolute; box-shadow: 0 0 10px rgba(0,0,0,0.6) }
.dialog h1 { filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#E48034,endColorstr=#CF6D30,grandientType=1) }
.dialog table { margin-top: 25px }
```

### [iOS7-like Confirm Dialog](https://codepen.io/Venerons/pen/eYgVyE)

on hover of button.: button.: background | made with: @keyframes · :hover

```css
from { opacity: 0; transform: translate(-50%, -50%) scale(0.8) }
to { opacity: 1; transform: translate(-50%, -50%) scale(1) }
from { opacity: 0; transform: translate(-50%, -50%) scale(0.8) }
to { opacity: 1; transform: translate(-50%, -50%) scale(1) }
.confirm { position: absolute; top: 50%; transform: translate(-50%, -50%); border-top: 1px solid white; -webkit-animation: fade 1s ease 1 forwards; animation: fade 1s ease 1 forwards }
.confirm button { position: absolute; bottom: 0 }
.confirm button:nth-of-type(1) { border-top: 1px solid #B4B4B4 }
.confirm button:nth-of-type(2) { border-top: 1px solid #B4B4B4 }
@keyframes fade animates opacity, transform
```

### [Edit User Details in Dialog](https://codepen.io/m-e-conroy/pen/mdOWPL)

on hover of button.btn: button.btn: background | made with: nothing recognised — read the code

### [AngularJS Dialog Service, with i18n](https://codepen.io/m-e-conroy/pen/yLVBOX)

on hover of a.: a.: color | made with: nothing recognised — read the code

### [Dialog with Date Picker](https://codepen.io/m-e-conroy/pen/GRjVjX)

on hover of button.btn: button.btn: background | made with: nothing recognised — read the code

### [Absolute Centering in CSS](https://codepen.io/supermrji/pen/jOrPjQ)

made with: nothing recognised — read the code

```css
.dialog { position: absolute; bottom: 0; top: 0 }
.effect { box-shadow: 3px 2px 3px rgba(0,0,0,0.5) }
```

### [AngularJS BootStrap 3 Template](https://codepen.io/petarivacic/pen/zYvxoe)

made with: nothing recognised — read the code

### [AngularJS BootStrap 3 Modal Dialogs](https://codepen.io/petarivacic/pen/RwWwzN)

made with: nothing recognised — read the code

### [CSS Modal](https://codepen.io/syamsudar/pen/WNvyeL)

held: fixed div.modalbg | on hover of a.button: a.button: background+color | made with: position: fixed · transition · :hover

```css
.button { position: relative; top: 50px; box-shadow: 1px 1px 1px #fff; -moz-box-shadow: 1px 1px 1px #fff; -webkit-box-shadow: 1px 1px 1px #fff; -moz-transition: all 0.5s ease-out; -webkit-transition: all 0.5s ease-out; -o-transiti }
.button:hover { -moz-transition: all 0.5s ease-out; -webkit-transition: all 0.5s ease-out; -o-transition: all 0.5s ease-out; transition: all 0.5s ease-out }
.modalbg { position: fixed; top: 0; bottom: 0; -moz-transition: all 2s ease-out; -webkit-transition: all 2s ease-out; -o-transition: all 2s ease-out; transition: all 2s ease-out }
.modalbg .dialog { position: relative; top: -1000px; box-shadow: 0 0 10px #000; -moz-box-shadow: 0 0 10px #000; -webkit-box-shadow: 0 0 10px #000 }
.modalbg .dialog .ie7 { filter: progid:DXImageTransform.Microsoft.Shadow(color='#000', Direction=135, Strength=3) }
.modalbg:target { -moz-transition: all 0.5s ease-out; -webkit-transition: all 0.5s ease-out; -o-transition: all 0.5s ease-out; transition: all 0.5s ease-out }
.modalbg:target .dialog { top: -90px; -moz-transition: all 0.8s ease-out; -webkit-transition: all 0.8s ease-out; -o-transition: all 0.8s ease-out; transition: all 0.8s ease-out }
.close { position: absolute; top: -10px; box-shadow: 0 0 10px #000; -moz-box-shadow: 0 0 10px #000; -webkit-box-shadow: 0 0 10px #000; -moz-transition: all 0.5s ease-out; -webkit-transition: all 0.5s ease-out; -o-transition: all  }
.close .ie7 { filter: progid:DXImageTransform.Microsoft.Shadow(color='#000', Direction=135, Strength=3) }
.close:hover { -moz-transition: all 0.5s ease-out; -webkit-transition: all 0.5s ease-out; -o-transition: all 0.5s ease-out; transition: all 0.5s ease-out }
```

### [CSS Only Dialog](https://codepen.io/zvona/pen/poJwrw)

made with: nothing recognised — read the code

```css
.shroud { position: absolute; top: 0px; bottom: 0px }
.dialog { position: absolute; top: 0px; bottom: 0px }
```

### [AngularJS BootStrap 3 Modal Dialogs](https://codepen.io/Micka33/pen/PoqNNd)

held: fixed div.modal, fixed div.modal, fixed div.modal-backdrop | made with: nothing recognised — read the code

### [AngularJS BootStrap 3 Modal Dialogs](https://codepen.io/diguinhorocks/pen/JjdoeK)

made with: nothing recognised — read the code

### [Popup: Nightly](https://codepen.io/ionic/pen/JjoBpz)

held: fixed div.backdrop | made with: nothing recognised — read the code

### [CSS Modal](https://codepen.io/hurtswith2/pen/QWLRZp)

held: fixed div.modalbg | on hover of a.button: a.button: background+color | made with: position: fixed · transition · :hover

```css
.button { position: relative; top: 50px; box-shadow: 1px 1px 1px #fff; -moz-box-shadow: 1px 1px 1px #fff; -webkit-box-shadow: 1px 1px 1px #fff; -moz-transition: all 0.5s ease-out; -webkit-transition: all 0.5s ease-out; -o-transiti }
.button:hover { -moz-transition: all 0.5s ease-out; -webkit-transition: all 0.5s ease-out; -o-transition: all 0.5s ease-out; transition: all 0.5s ease-out }
.modalbg { position: fixed; top: 0; bottom: 0; -moz-transition: all 2s ease-out; -webkit-transition: all 2s ease-out; -o-transition: all 2s ease-out; transition: all 2s ease-out }
.modalbg .dialog { position: relative; top: -1000px; box-shadow: 0 0 10px #000; -moz-box-shadow: 0 0 10px #000; -webkit-box-shadow: 0 0 10px #000 }
.modalbg .dialog .ie7 { filter: progid:DXImageTransform.Microsoft.Shadow(color='#000', Direction=135, Strength=3) }
.modalbg:target { -moz-transition: all 0.5s ease-out; -webkit-transition: all 0.5s ease-out; -o-transition: all 0.5s ease-out; transition: all 0.5s ease-out }
.modalbg:target .dialog { top: -90px; -moz-transition: all 0.8s ease-out; -webkit-transition: all 0.8s ease-out; -o-transition: all 0.8s ease-out; transition: all 0.8s ease-out }
.close { position: absolute; top: -10px; box-shadow: 0 0 10px #000; -moz-box-shadow: 0 0 10px #000; -webkit-box-shadow: 0 0 10px #000; -moz-transition: all 0.5s ease-out; -webkit-transition: all 0.5s ease-out; -o-transition: all  }
.close .ie7 { filter: progid:DXImageTransform.Microsoft.Shadow(color='#000', Direction=135, Strength=3) }
.close:hover { -moz-transition: all 0.5s ease-out; -webkit-transition: all 0.5s ease-out; -o-transition: all 0.5s ease-out; transition: all 0.5s ease-out }
```

### [AngularJS BootStrap 3 Modal Dialogs](https://codepen.io/sublimino/pen/pozYOQ)

made with: nothing recognised — read the code

```css
.answerBox { padding-top: 10px }
```

### [AngularJS BootStrap 3 Modal Dialogs](https://codepen.io/ishiijp/pen/ZEzYjB)

on hover of button.btn: button.btn: background | made with: nothing recognised — read the code

### [AngularJS BootStrap 3 Modal Dialogs](https://codepen.io/ishiijp/pen/bGbNvX)

on hover of button.btn: button.btn: background | made with: nothing recognised — read the code

### [dialog box](https://codepen.io/rahulsahu/pen/nZNwPN)

made with: nothing recognised — read the code

### [AngularJS Modal Factory](https://codepen.io/capelo/pen/kdEjed)

made with: position: fixed · :hover

```css
body { position: relative }
.ng-modal-overlay { position: fixed; top: 0; opacity: .5; -ms-filter: "alpha(opacity = 50)" }
.ng-modal-container { position: fixed; top: 0 }
.ng-modal-container .ng-modal { position: absolute; top: 50%; -webkit-transform: translate(-50%,-50%); -ms-transform: translate(-50%,-50%); transform: translate(-50%,-50%) }
.ng-modal-container .ng-modal .ng-modal-close { position: relative; top: 0 }
```

### [Add Event Dialog and Menubar Mockup](https://codepen.io/markthema3/pen/ALaeGo)

on hover of li.: a.button: shadow | made with: transition · :hover

```css
nav { border-bottom: 1px solid #C24032; box-shadow: 0px 0px 4px #C24032 }
.button { box-shadow: 0px 0px 4px #C24032; transition: box-shadow .2s linear }
nav ul li, .radio > .button { vertical-align:top }
.add { transition: box-shadow .2s linear, margin .3s linear .5s }
.add.active { transition: box-shadow .2s linear, margin .3s linear }
.button:hover { box-shadow:none }
.button:active, .button.active { box-shadow: 0px 0px 4px #C24032 inset }
.dialog { position: relative; box-shadow: 0px 0px 8px rgba(68, 140, 160, 0.5) }
.dialog:after, .dialog:before { bottom: 100%; position: absolute }
.dialog .title { margin-bottom: 4px; margin-top: 8px; box-shadow: 0px 1px 4px rgba(68, 120, 160, 0.1) }
.dialog .title:first-child { margin-top: -4px }
form { padding-top: 0 }
```

### [jQuery UI Dialog Customization](https://codepen.io/rachelbabiak/pen/kOdaLe)

held: fixed div.ui-widget-overlay | on scroll: button.ui-button: background+color, span.ui-button-icon-primary: color, span.ui-button-text: color | made with: position: fixed · :hover

```css
.ui-helper-hidden-accessible { position: absolute }
.ui-helper-zfix { top: 0; position: absolute; opacity: 0; filter:Alpha(Opacity=0) }
.ui-widget-overlay { position: fixed; top: 0 }
.ui-accordion .ui-accordion-header { position: relative; margin-top: 2px }
.ui-accordion .ui-accordion-header .ui-accordion-header-icon { position: absolute; top: 50%; margin-top: -8px }
.ui-accordion .ui-accordion-content { border-top: 0 }
.ui-autocomplete { position: absolute; top: 0 }
.ui-button { position: relative }
.ui-button-icon-only .ui-icon, .ui-button-text-icon-primary .ui-icon, .ui-button { position: absolute; top: 50%; margin-top: -8px }
.ui-datepicker .ui-datepicker-header { position: relative }
.ui-datepicker .ui-datepicker-prev, .ui-datepicker .ui-datepicker-next { position: absolute; top: 2px }
.ui-datepicker .ui-datepicker-prev-hover, .ui-datepicker .ui-datepicker-next-hov { top: 1px }
```

### [Untitled](https://codepen.io/affablekarthik/pen/DRvaEE)

made with: nothing recognised — read the code

### [Mac OSX Copy Dialog](https://codepen.io/yaoyi/pen/kvvVGj)

made with: :hover

```css
body { position: relative }
.centered { position: absolute; top: 0; bottom: 0 }
#titlebar { margin-top: -32px }
#dialog { border-top: 2px solid #43404c; box-shadow: 0 18px 55px rgba(0, 0, 0, 0.6) }
#help { position: absolute; top: calc(100% - 55px); box-shadow: 0 1px 2px #423e48 }
.file { margin-top: 30px; margin-bottom: 20px }
.path { margin-top: 10px }
.button { position: relative; box-shadow: inset 0 2px 2px #55515d }
.button:hover { box-shadow: inset 0 2px 2px #55515d, 0 0 25px -6px #55515d }
```

### [Twitter Dialog](https://codepen.io/stefanjudis/pen/nVVqEr)

made with: transition · :hover · <dialog>

```css
.twitter--button { position: relative }
.twitter--button__picture:before { position: absolute; bottom: 0 }
.twitter--button__location:before { position: absolute; bottom: 0 }
.twitter--button__tweet { -moz-box-shadow: inset 0 0.1em 0.2em #f5dcbc, 0 0.1em 0.25em #4d4d4d; -webkit-box-shadow: inset 0 0.1em 0.2em #f5dcbc, 0 0.1em 0.25em #4d4d4d; box-shadow: inset 0 0.1em 0.2em #f5dcbc, 0 0.1em 0.25em #4d4d4d }
.twitter--button__tweet:active { -moz-box-shadow: none; -webkit-box-shadow: none; box-shadow: none }
.twitter--dialog { position: relative }
.twitter--dialog--checkbox:checked ~ .twitter--dialog--dialog { -moz-transform: translate(0, 0); -ms-transform: translate(0, 0); -webkit-transform: translate(0, 0); transform: translate(0, 0) }
.twitter--dialog--checkbox:checked + .twitter--dialog--label { -moz-box-shadow: inset 0 0.125em 0.25em #333, inset 0 -0.125em 0.125em #fff; -webkit-box-shadow: inset 0 0.125em 0.25em #333, inset 0 -0.125em 0.125em #fff; box-shadow: inset 0 0.125em 0.25em #333, inset 0 -0.125em 0.125 }
.twitter--dialog--control { vertical-align: bottom }
.twitter--dialog--controls { vertical-align: bottom }
.twitter--dialog--dialog { position: absolute; bottom: 150%; -moz-transform: translate(0, -1000px); -ms-transform: translate(0, -1000px); -webkit-transform: translate(0, -1000px); transform: translate(0, -1000px); -moz-transition: -moz-transform 0 }
.twitter--dialog--dialog:before, .twitter--dialog--dialog:after { position: absolute }
```

### [iModal](https://codepen.io/stursby/pen/naaJWy)

held: fixed div.modal | on hover of button.button-border: button.button-border: background+color, span.icon: color | made with: position: fixed · :hover

```css
h2 { margin-bottom: 15px }
section { margin-top: 30px }
section p { margin-bottom: 20px }
.modal { position: fixed; top: 50%; margin-top: -150px; box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5) }
.modal header { position: relative }
.modal .close { position: absolute; top: 3px }
```

### [uSwitch responsive modal](https://codepen.io/pixelthing/pen/kQVdqJ)

held: fixed section.us-modal-box, fixed div.us-modal-overlay, fixed section.us-modal-box | made with: position: fixed · transition · :hover

```css
.us-modal-overlay { position: fixed; top: 0; bottom: 0; opacity: 0; -webkit-transition: opacity 0.4s; -moz-transition: opacity 0.4s; transition: opacity 0.4s }
.us-modal-on .us-modal-overlay { opacity: 0.7 }
.us-modal-box { position: fixed; top: 30px; top: 3vh; opacity: 0; -webkit-transform: scale3d(0.9, 0.9, 1); -moz-transform: scale(0.9); transform: scale(0.9); -webkit-transition: opacity, -webkit-transform 0.2s, 0.2s; -moz-transition: op }
.us-modal-box.us-modal-on, .us-modal-box.us-modal-on.us-modal-dir-bottom, .us-mo { opacity: 1; -webkit-transform: scale3d(1, 1, 1) translateY(0); -moz-transform: scale(1) translateY(0); transform: scale(1) translateY(0) }
.us-modal-box header, .us-modal-box footer { position: relative }
.us-modal-box footer { position: absolute; bottom: -62px }
.us-modal-close { position: absolute; top: 0; bottom: 0; background-position: 0 100%; -webkit-transition: background-position 200ms; -moz-transition: background-position 200ms; transition: background-position 200ms }
.us-modal-close:before { position: absolute; top: 0.5em }
.us-modal-close:hover { background-position: 0 0 }
.touch .us-modal-close:hover { background-position: 0 100% }
.us-modal-box header, .us-modal-xl header, .us-modal-l header, .us-modal-m heade { padding-top: 0.4em; padding-bottom: 0.2em }
.us-modal-box footer, .us-modal-xl footer, .us-modal-l footer, .us-modal-m foote { bottom: -50px }
```

### [AngularJS BootStrap 3 Modal Dialogs](https://codepen.io/m-e-conroy/pen/DvrpRo)

on hover of a.: a.: color | made with: nothing recognised — read the code

### [Dialog Element](https://codepen.io/felquis/pen/kxzPmX)

made with: :hover · <dialog>

```css
.close { position: absolute; top: 3px; -webkit-transform: rotate(45deg); -moz-transform: rotate(45deg); -o-transform: rotate(45deg); -ms-transform: rotate(45deg); transform: rotate(45deg) }
.close:after { position: absolute; top: 0; -webkit-transform: rotate(-90deg); -moz-transform: rotate(-90deg); -o-transform: rotate(-90deg); -ms-transform: rotate(-90deg); transform: rotate(-90deg) }
```

### [Basic window manager](https://codepen.io/pamgriffith/pen/naGNGN)

held: fixed div | made with: position: fixed · :hover

```css
#status-bar { position:fixed; bottom: 0; border-top: 1px solid #999 }
```

### [Pure CSS modal box](https://codepen.io/Idered/pen/DdeoeW)

held: fixed div.modal, fixed div.modal | on hover of label.btn: label.btn: background | made with: position: fixed · transition · :hover

```css
.modal { opacity: 0; position: fixed; top: 0; bottom: 0; transition: opacity .25s ease }
.modal__bg { position: absolute; top: 0; bottom: 0 }
.modal-state:checked + .modal { opacity: 1 }
.modal-state:checked + .modal .modal__inner { top: 0 }
.modal__inner { transition: top .25s ease; position: absolute; top: -20%; bottom: 0 }
.modal__close { position: absolute; top: 1em }
.modal__close:after, .modal__close:before { position: absolute; transform: rotate(45deg); top: 0 }
.modal__close:before { transform: rotate(-45deg) }
.btn:active { box-shadow: 0 1px 2px rgba(0,0,0, .2) inset }
```

### [User Message with Dynamic Delay](https://codepen.io/chris22smith/pen/AWzegq)

made with: nothing recognised — read the code

```css
#user-message { position: absolute; top: 60px; box-shadow:0 0 5px #ccc }
```

### [Mac OSX Copy Dialog](https://codepen.io/arendon/pen/kYeGep)

made with: :hover

```css
body { position: relative }
.centered { position: absolute; top: 0; bottom: 0 }
#titlebar { margin-top: -32px }
#dialog { border-top: 2px solid #43404c; box-shadow: 0 18px 55px rgba(0, 0, 0, 0.6) }
progress::-webkit-progress-bar { box-shadow: 0 1px 0 #4d4856 }
progress::-webkit-progress-value { box-shadow: 0 0 20px -1px #005db9 }
#help { position: absolute; top: calc(100% - 55px); box-shadow: 0 1px 2px #423e48 }
.file { margin-top: 30px; margin-bottom: 20px }
.path { margin-top: 10px }
.button { position: relative; box-shadow: inset 0 2px 2px #55515d }
.button:hover { box-shadow: inset 0 2px 2px #55515d, 0 0 25px -6px #55515d }
```

### [jQuery / jQuery UI Dialog Password Bug](https://codepen.io/manovotny/pen/nZvQRz)

made with: nothing recognised — read the code

### [jQuery UI Dialog flip](https://codepen.io/jdnichollsc/pen/AJOrZB)

on hover of button.ui-button: button.ui-button: background+color, span.ui-button-icon-primary: color, span.ui-button-text: color | made with: transition · 3D (perspective / preserve-3d)

```css
.flip-container { -webkit-perspective: 1000; -moz-perspective: 1000; perspective: 1000; position:relative }
.flip-container.flip .flipper { -webkit-transform: rotateY(180deg); -moz-transform: rotateY(180deg); transform: rotateY(180deg) }
.flipper { -webkit-transition: 0.6s; -moz-transition: 0.6s; transition: 0.6s; position: relative }
.front, .back { position: absolute; top: 0 }
.back { -webkit-transform: rotateY(180deg); -moz-transform: rotateY(180deg); transform: rotateY(180deg) }
```

### [Confirm jQuery UI](https://codepen.io/jdnichollsc/pen/DLWodZ)

made with: nothing recognised — read the code

### [Confirm appointment dialog](https://codepen.io/rendro/pen/kvxrgg)

on hover of span.btn: span.btn: shadow | made with: :hover

```css
.box .message { padding-top: 20px }
.box .submit { margin-top: 20px; padding-top: 20px; border-top: 2px solid #ECF0F1 }
.box .submit:before { margin-bottom: -1em }
.box .submit .btn { position: relative; top: 1em }
.btn:hover { box-shadow: 0 -4px #199319 inset }
.btn:active { box-shadow: none; padding-bottom: 6px }
.btn:active { -webkit-transform: translateY(4px); -moz-transform: translateY(4px); -ms-transform: translateY(4px); transform: translateY(4px) }
.btn i { vertical-align: text-top; margin-top: 1px }
.btn_gray:hover { box-shadow: 0 -4px #919191 inset }
.btn_gray:active { box-shadow: none; padding-bottom: 6px }
.btn_red:hover { box-shadow: 0 -4px #931a19 inset }
.btn_red:active { box-shadow: none; padding-bottom: 6px }
```

### [jQuery UI Dialog Extended](https://codepen.io/jasonday/pen/AYNWVd)

made with: nothing recognised — read the code

### [Comics dialog boxes (webkit)](https://codepen.io/fliptheweb/pen/AemLxL)

made with: transition · :hover

```css
.comics-dialog, .comics-thought { vertical-align: top; position: relative; -webkit-filter: drop-shadow(0 4px 0 #65c1ff); filter: drop-shadow(0 4px 0 #65c1ff); -moz-transition: 2s; -o-transition: 2s; -webkit-transition: 2s; transition: 2s }
.comics-dialog:after, .comics-thought:after { position: absolute }
.comics-dialog:hover, .comics-thought:hover { top: -30px; -webkit-filter: drop-shadow(0 10px 0 #65c1ff); filter: drop-shadow(0 10px 0 #65c1ff) }
.comics-dialog:after { bottom: -45px; -moz-transform: rotate(-30deg); -ms-transform: rotate(-30deg); -webkit-transform: rotate(-30deg); transform: rotate(-30deg) }
.comics-thought { -moz-box-shadow: -60px -50px 0 -20px #fff, 60px -45px 0 -40px #fff; -webkit-box-shadow: -60px -50px 0 -20px #fff, 60px -45px 0 -40px #fff; box-shadow: -60px -50px 0 -20px #fff, 60px -45px 0 -40px #fff }
.comics-thought:after { bottom: -10px; -moz-box-shadow: -140px 0px 0 #fff, -50px 30px 0 -10px #fff, -60px 120px 0 -60px #fff, -90px 155px 0 -65px #fff, -120px 175px 0 -70px #fff; -webkit-box-shadow: -140px 0px 0 #fff, -50px 30px 0 -10px #fff, - }
```

### [Page Flip modal dialog](https://codepen.io/emad_elsaid/pen/nKwaxM)

on hover of li.: a.: color | made with: transition · :hover · 3D (perspective / preserve-3d)

```css
#header { border-top: 1px solid #CCC; -webkit-box-shadow: 0 1px 3px #666; -moz-box-shadow: 0 1px 3px #666; box-shadow: 0 1px 3px #666 }
#header #logo { margin-top: 12px }
#header #menu li { box-shadow: inset 2px 0 2px -2px #666; -webkit-box-shadow: inset 2px 0 2px -2px #666; -moz-box-shadow: inset 2px 0 2px -2px #666 }
#header #menu ul li a:link, #header #menu ul li a:visited, #header #menu ul li a { text-transform: uppercase }
.panel { -webkit-box-shadow: 0 1px 3px #666; -moz-box-shadow: 0 1px 3px #666; box-shadow: 0 1px 3px #666 }
.metal { border-top: 1px solid #fff }
#banner-header .nav { -webkit-box-shadow: inset 0 0 5px #888, 0 1px 1px #fff; -moz-box-shadow: inset 0 0 5px #888, 0 1px 1px #fff; -ms-box-shadow: inset 0 0 5px #888, 0 1px 1px #fff; -o-box-shadow: inset 0 0 5px #888, 0 1px 1px #fff; box-shad }
#banner-header .nav .dot { -webkit-box-shadow: 0 1px 0 #fff; -moz-box-shadow: 0 1px 0 #fff; -ms-box-shadow: 0 1px 0 #fff; -o-box-shadow: 0 1px 0 #fff; box-shadow: 0 1px 0 #fff }
#banner-content { -webkit-box-shadow: inset 0px 4px 9px -5px #444; box-shadow: inset 0px 4px 9px -5px #444; -moz-box-shadow: inset 0px 4px 9px -5px #444; -ms-box-shadow: inset 0px 4px 9px -5px #444; -o-box-shadow: inset 0px 4px 9px -5px # }
#banner-content .text0 { -moz-transform: scale(1) rotate(90deg) translateX(110px) translateY(-350px) skewX(0deg) skewY(0deg); -webkit-transform: scale(1) rotate(90deg) translateX(110px) translateY(-350px) skewX(0deg) skewY(0deg); -o-transform: s }
#banner-content .text1 { -moz-transform: scale(1) rotate(0deg) translateX(85px) translateY(180px) skewX(0deg) skewY(0deg); -webkit-transform: scale(1) rotate(0deg) translateX(85px) translateY(180px) skewX(0deg) skewY(0deg); -o-transform: scale(1 }
#banner-content .text2 { -moz-transform: scale(1) rotate(45deg) translateX(0px) translateY(0px) skewX(0deg) skewY(0deg); -webkit-transform: scale(1) rotate(-90deg) translateX(-37px) translateY(310px) skewX(0deg) skewY(0deg); -o-transform: scale( }
```

### [CSS Modal](https://codepen.io/petebot/pen/AVYYyw)

held: fixed div.modalbg | on hover of a.button: a.button: background+color | made with: position: fixed · transition · :hover

```css
.button { position: relative; top: 50px; box-shadow: 1px 1px 1px #fff; -moz-box-shadow: 1px 1px 1px #fff; -webkit-box-shadow: 1px 1px 1px #fff; -moz-transition: all 0.5s ease-out; -webkit-transition: all 0.5s ease-out; -o-transiti }
.button:hover { -moz-transition: all 0.5s ease-out; -webkit-transition: all 0.5s ease-out; -o-transition: all 0.5s ease-out; transition: all 0.5s ease-out }
.modalbg { position: fixed; top: 0; bottom: 0; -moz-transition: all 2s ease-out; -webkit-transition: all 2s ease-out; -o-transition: all 2s ease-out; transition: all 2s ease-out }
.modalbg .dialog { position: relative; top: -1000px; box-shadow: 0 0 10px #000; -moz-box-shadow: 0 0 10px #000; -webkit-box-shadow: 0 0 10px #000 }
.modalbg .dialog .ie7 { filter: progid:DXImageTransform.Microsoft.Shadow(color='#000', Direction=135, Strength=3) }
.modalbg:target { -moz-transition: all 0.5s ease-out; -webkit-transition: all 0.5s ease-out; -o-transition: all 0.5s ease-out; transition: all 0.5s ease-out }
.modalbg:target .dialog { top: -20px; -moz-transition: all 0.8s ease-out; -webkit-transition: all 0.8s ease-out; -o-transition: all 0.8s ease-out; transition: all 0.8s ease-out }
.close { position: absolute; top: -10px; box-shadow: 0 0 10px #000; -moz-box-shadow: 0 0 10px #000; -webkit-box-shadow: 0 0 10px #000; -moz-transition: all 0.5s ease-out; -webkit-transition: all 0.5s ease-out; -o-transition: all  }
.close .ie7 { filter: progid:DXImageTransform.Microsoft.Shadow(color='#000', Direction=135, Strength=3) }
.close:hover { -moz-transition: all 0.5s ease-out; -webkit-transition: all 0.5s ease-out; -o-transition: all 0.5s ease-out; transition: all 0.5s ease-out }
```

### [Receding Background Dialog Box](https://codepen.io/chriscoyier/pen/nMYgbR)

held: fixed div | made with: position: fixed · transition

```css
#page-wrap { box-shadow: 0 0 100px black; -moz-transition: all 0.4s ease; -o-transition: all 0.4s ease; -webkit-transition: all 0.4s ease; transition: all 0.4s ease; -webkit-filter: blur(0) grayscale(0); filter: blur(0) grayscale(0) }
.dialogIsOpen #page-wrap { -webkit-filter: blur(5px) grayscale(50%); filter: blur(5px) grayscale(50%); -moz-transform: scale(0.9); -ms-transform: scale(0.9); -webkit-transform: scale(0.9); transform: scale(0.9) }
#dialog { -moz-transition: all 0.4s ease; -o-transition: all 0.4s ease; -webkit-transition: all 0.4s ease; transition: all 0.4s ease; position: fixed; box-shadow: 0 0 25px black; top: 50%; opacity: 0; -moz-transform: scale(1.5); - }
.dialogIsOpen #dialog { opacity: 1; -moz-transform: scale(1); -ms-transform: scale(1); -webkit-transform: scale(1); transform: scale(1) }
```

### [ID Card - Skills](https://codepen.io/TimPietrusky/pen/kGRdmZ)

on scroll: img.: filter+shadow | made with: transition · :hover

```css
body { margin-top:80px }
.card { position:relative; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .4), 0 0 10px rgba(0, 0, 0, .55), 0 2px 10px rgba(0, 0, 0, .6) }
.card:hover img { -webkit-filter:invert(100%); filter:invert(100%); box-shadow:0 0 3px rgba(255, 255, 255, .25) }
.card:before { position:absolute; top:-70px; box-shadow:0 0 0 1px rgba(0, 0, 0, .8); opacity:.5 }
.card:after { position:absolute; top:-55px; box-shadow: 0 0 0 5px rgba(255, 255, 255, .6), 0 0 10px rgba(0, 0, 0, .7), inset 2px 2px 2px rgba(0, 0, 0, .5) }
.card header { position:relative; border-bottom:2px solid rgba(180, 80, 80, .5); border-top:1px solid rgba(221, 108, 108, .8); box-shadow: inset 0 1px 0 0 rgba(255, 120, 120, .8), 0 1px 2px rgba(0, 0, 0, .4); opacity:.9 }
.card header:after { position:absolute; top:1px }
.card header:before { position:absolute; top:22px; box-shadow: inset 1px 1px 0 1px rgba(0, 0, 0, .3), inset -1px -1px 0 0 rgba(255, 255, 255, .5) }
.card article img { box-shadow:0 0 3px rgba(0, 0, 0, .25); transition:all .3s ease-in-out }
.card article .area { position:relative }
.card article .area ul li .bar { position:relative; opacity:.9; box-shadow: inset 0 2px 2px rgba(0, 0, 0, .35) }
.card article .area ul li .bar:before { position:absolute; box-shadow: inset 0 4px 4px rgba(255, 255, 255, .3), inset 0 -2px 3px rgba(0, 0, 0, .05), 0 1px 0 0px #D29D40 }
```

### [Battlefield 3 Patch: 13.37 GB Dialog](https://codepen.io/TimPietrusky/pen/kOommk)

on scroll: span.: filter, img.: opacity | on hover of img.: span.: filter, img.: opacity | made with: @keyframes

```css
#full_page { position:absolute; opacity:.3; animation: test 5s infinite ease-in-out forwards; animation-delay:1.5s }
.bf3-dialog { position:absolute; top:10%; text-transform: uppercase; animation: flattr 5s infinite ease-in forwards; animation-delay:1.5s }
.bf3-title { position:relative; border-top: 2px solid rgba(255, 255, 255, .6); border-bottom: 2px solid rgba(30, 30, 30, .5); box-shadow:0 2px 6px -2px rgba(0, 0, 0, .6) }
.bf3-title:after { position:absolute; top:-50%; box-shadow:0 0 0 1px rgba(255,255,255,.1), 0 0 8px rgba(0, 0, 0, .7) }
.bf3-content { border-top:none }
.bf3-slider { margin-top:3% }
.bf3-slider span[role="position"] { animation: slider 5s infinite ease-out forwards; animation-delay:1.5s }
0%, 5%, 100% { transform:translate(0, 0); opacity:1 }
1% { transform:translate(5px, 0); opacity:.6; -webkit-filter:blur(5px); filter:blur(5px) }
2% { transform:translate(-5px, 0); opacity:.6 }
3% { transform:translate(5px, 0); opacity:.6 }
4% { transform:translate(-5px, 0); opacity:.6 }
```
