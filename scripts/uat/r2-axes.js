// AREA V · RULE MAP steps 2 + 3 — every axis of `docs/web-anatomy/area-v/AXIS-MAP.md` as CODE, once. Each family has axes,
// each axis its values (a label → a fragment), and `compose(pick)` turns one pick of every axis into the CSS (+ HTML) of a
// demo. The SAME definitions make the specimens (one example per value) and the random combinations (the proof), so an
// example can never say something the proof does not test. Pure: no browser here (r2-combos.js renders it).
const BRAND = 'oklch(62% .19 260)', ACCENT = 'oklch(72% .17 40)', PHOTO = `url('data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#0e7490"/><stop offset=".5" stop-color="#f59e0b"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs><rect width="400" height="260" fill="url(#g)"/><circle cx="120" cy="90" r="60" fill="#fde68a"/><rect x="220" y="120" width="140" height="110" fill="#1e293b"/></svg>')}')`;
const noise = ({ type = 'fractalNoise', freq = .8, oct = 3 } = {}) => `url('data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="n"><feTurbulence type="${type}" baseFrequency="${freq}" numOctaves="${oct}" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`)}')`;

// ── section-edge shapes: y(x) in 0..1 of the depth, x in 0..1; drawn as a clip-path polygon in % (works everywhere) ──
const seeded = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
const SHAPES = {
  slope: (x) => x, curve: (x) => 1 - 4 * (x - .5) ** 2, wave: (x) => .5 + .5 * Math.sin(x * Math.PI * 4), zigzag: (x) => Math.abs(((x * 8) % 2) - 1),
  triangle: (x) => 1 - Math.abs(x - .5) * 2, steps: (x) => Math.floor(x * 5) / 4, cloud: (x) => 1 - Math.abs(Math.sin(x * Math.PI * 6)),
  torn: (() => { const r = seeded(7); const pts = Array.from({ length: 61 }, () => r()); return (x) => pts[Math.round(x * 60)]; })(),
  blob: (x) => .5 + .3 * Math.sin(x * 5.3 + 1) + .2 * Math.sin(x * 11.7),
  // step 4, the gap check — families the crawl showed (Magnific's 548 dividers) that the map lacked
  scallop: (x) => { const u = ((x * 8) % 1) * 2 - 1; return 1 - Math.sqrt(Math.max(0, 1 - u * u)); },
  drip: (x) => Math.max(.2, ...[[.1, .9, .03], [.27, .5, .025], [.45, 1, .035], [.62, .4, .02], [.82, .7, .03]].map(([c, len, w]) => len * Math.exp(-(((x - c) / w) ** 2)))),
  mountain: (() => { const r = seeded(11); const pk = Array.from({ length: 13 }, (_, k) => (k % 2 ? .15 + .3 * r() : .55 + .45 * r())); return (x) => { const i = Math.min(11, Math.floor(x * 12)); const t = x * 12 - i; return pk[i] + (pk[i + 1] - pk[i]) * t; }; })(),
  brush: (() => { const r = seeded(23); const j = Array.from({ length: 61 }, () => r()); return (x) => .5 + .25 * Math.sin(x * 7) + .12 * (j[Math.round(x * 60)] - .5); })(),
};
// SVG filters used by name (`filter: url(#r2-…)`), defined ONCE per page (page() below) — every primitive the crawl used
const SVG_FILTERS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<filter id="r2-gooey"><feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b"/><feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="g"/><feComposite in="SourceGraphic" in2="g" operator="atop"/></filter>
<filter id="r2-duotone"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="table" tableValues=".1 .98"/><feFuncG type="table" tableValues=".05 .62"/><feFuncB type="table" tableValues=".45 .3"/></feComponentTransfer></filter>
<filter id="r2-displace"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="22" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="r2-morphology"><feMorphology operator="dilate" radius="2"/></filter>
<filter id="r2-emboss"><feGaussianBlur in="SourceAlpha" stdDeviation="2" result="b"/><feSpecularLighting in="b" surfaceScale="6" specularConstant="1" specularExponent="18" lighting-color="#fff" result="s"><feDistantLight azimuth="225" elevation="40"/></feSpecularLighting><feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/><feComposite in="SourceGraphic" in2="s2" operator="arithmetic" k1="0" k2="1" k3=".6" k4="0"/></filter>
<filter id="r2-blend"><feFlood flood-color="#7c3aed" result="f"/><feBlend in="SourceGraphic" in2="f" mode="multiply"/></filter>
<filter id="r2-sharpen"><feConvolveMatrix order="3" kernelMatrix="0 -1 0 -1 5 -1 0 -1 0"/></filter>
<filter id="r2-svgshadow" x="-20%" y="-20%" width="160%" height="160%"><feOffset in="SourceAlpha" dx="6" dy="8" result="o"/><feGaussianBlur in="o" stdDeviation="5" result="b"/><feFlood flood-color="#1e1b4b" flood-opacity=".6"/><feComposite in2="b" operator="in" result="s"/><feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs></svg>`;
// a fragment shader as a texture (the crawl: 150 noise pens, 83 texture pens) — a slow colour field + grain, optionally moving
const shader = (freq, moving, style) => `<canvas width="240" height="160" data-anim="${moving}" style="${style}"></canvas><script>(() => { const c = document.currentScript.previousElementSibling, g = c.getContext('webgl'); if (!g) return; const s = (t, src) => { const x = g.createShader(t); g.shaderSource(x, src); g.compileShader(x); return x; }; const p = g.createProgram(); g.attachShader(p, s(g.VERTEX_SHADER, 'attribute vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }')); g.attachShader(p, s(g.FRAGMENT_SHADER, 'precision mediump float; uniform float t; uniform float f; float h(vec2 q){ return fract(sin(dot(q, vec2(12.9898, 78.233))) * 43758.5453); } void main(){ vec2 q = gl_FragCoord.xy; float v = .5 + .5 * sin(q.x * .03 + t * .4) * cos(q.y * .045 - t * .3); vec3 col = mix(vec3(.25, .4, .95), vec3(.98, .6, .3), v) + (h(floor(q * f) + t) - .5) * .25; gl_FragColor = vec4(col, 1.); }')); g.linkProgram(p); g.useProgram(p); g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer()); g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW); const l = g.getAttribLocation(p, 'a'); g.enableVertexAttribArray(l); g.vertexAttribPointer(l, 2, g.FLOAT, false, 0, 0); g.uniform1f(g.getUniformLocation(p, 'f'), ${freq}); const T = g.getUniformLocation(p, 't'); const draw = (k) => { g.uniform1f(T, k); g.drawArrays(g.TRIANGLES, 0, 3); if (${moving}) setTimeout(() => requestAnimationFrame(() => draw(k + 1)), 90); }; draw(0); })();</script>`;
// a RASTER pixel tile (4 × 4 BMP, built here): image-rendering only changes a raster image scaled up — SVG and gradients are
// redrawn sharp at any size, so a vector tile can never show `pixelated`
const PIXELS = (() => { const w = 4, h = 4, row = w * 3, b = Buffer.alloc(54 + row * h); b.write('BM'); b.writeUInt32LE(b.length, 2); b.writeUInt32LE(54, 10); b.writeUInt32LE(40, 14); b.writeInt32LE(w, 18); b.writeInt32LE(h, 22); b.writeUInt16LE(1, 26); b.writeUInt16LE(24, 28); b.writeUInt32LE(row * h, 34);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const on = (x + y) % 2 ? 230 : 40, o = 54 + y * row + x * 3; b[o] = on; b[o + 1] = (x * 60) % 255; b[o + 2] = 255 - on; }
  return `url('data:image/bmp;base64,${b.toString('base64')}')`; })();
// a CSS Paint worklet (Houdini, Chromium only — 6 pens): registered once per page from a Blob module
const PAINT_WORKLET = `<script>if (window.CSS && CSS.paintWorklet && !window.r2paint) { window.r2paint = 1; CSS.paintWorklet.addModule(URL.createObjectURL(new Blob(["registerPaint('r2dots', class { static get inputProperties() { return ['--ink', '--tile']; } paint(x, size, props) { const t = parseFloat(props.get('--tile')) || 16; x.fillStyle = String(props.get('--ink')).trim() || '#fff'; for (let i = 0; i < size.width; i += t) for (let j = 0; j < size.height; j += t) { x.beginPath(); x.arc(i + t / 2, j + t / 2, t * (.15 + .3 * ((i * 7 + j * 13) % 10) / 10), 0, 6.3); x.fill(); } } });"], { type: 'text/javascript' }))); }</script>`;
const edgePolygon = (shape, depth, edge = 'bottom', invert = false) => {
  const f = SHAPES[shape]; const pts = [];
  for (let i = 0; i <= 60; i++) { const x = i / 60; let y = f(x); if (invert) y = 1 - y; pts.push([x * 100, y * depth]); }
  if (edge === 'bottom') return `polygon(0 0, 100% 0, ${pts.slice().reverse().map(([x, y]) => `${x.toFixed(2)}% calc(100% - ${y.toFixed(2)}%)`).join(', ')})`;
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(', ')}, 100% 100%, 0 100%)`;
};
/** The same edge as `shape()` — responsive like the polygon, but able to hold curves (CSS Shapes 2). */
const toShape = (poly) => { const pts = poly.slice(8, -1).split(', '); return `shape(from ${pts[0]}, ${pts.slice(1).map((q) => `line to ${q}`).join(', ')}, close)`; };

const FAMILIES = {
  colour: {
    axes: {
      notation: { hex: '#3b82f6', 'hex 8': '#3b82f6ff', 'hex 4': '#38ff', rgb: 'rgb(59 130 246)', hsl: 'hsl(217 91% 60%)', hwb: 'hwb(217 23% 4%)', oklch: 'oklch(62% .19 260)', oklab: 'oklab(62% -.04 -.18)', lab: 'lab(54% 9 -66)', lch: 'lch(54% 67 278)', p3: 'color(display-p3 .27 .5 .95)', named: 'royalblue', currentColor: 'currentColor' },
      alpha: { '100%': 1, '75%': .75, '50%': .5, '25%': .25, '0% (transparent)': 0 }, // labels with a unit: whole-number keys are REORDERED by JavaScript (the base became 25%)
      mix: { none: null, 'with white 40%': 'white 40%', 'with black 40%': 'black 40%', 'with accent 50%': `${ACCENT} 50%`, 'with accent, longer hue': `${ACCENT} 50%|longer` },
      relative: { none: null, lighter: 'l+.15', darker: 'l-.2', muted: 'c*.3', 'hue +120': 'h+120' },
      // the gap check: light-dark() + color-scheme (6 + 42 pens) — the same token answering a dark theme with its own value
      scheme: { 'one value': null, 'light-dark() in a dark scheme': 'dark' },
      // the gap check: accent-color (39 pens) tints the native form controls; the native <input type=color> (85 pens) is the
      // smallest picker there is
      controls: { none: null, 'accent-color': 'accent', 'native picker': 'native' },
    },
    sameByDesign: ['notation'], // one colour written ten ways looks the same — that is the point of the axis
    noop: (p) => (p.alpha === 0 ? 'transparent paints nothing — by definition' : null),
    compose: ({ notation, alpha, mix, relative, scheme, controls }) => {
      let c = notation;
      if (mix) { const [m, hue] = mix.split('|'); c = `color-mix(in oklch${hue ? ' ' + hue + ' hue' : ''}, ${c}, ${m})`; }
      if (relative || alpha < 1) {
        const [l, ch, h] = ['l', 'c', 'h'].map((k) => relative && relative.startsWith(k) ? `calc(${k} ${relative.slice(1, 2)} ${relative.slice(2)})` : k);
        c = `oklch(from ${c} ${l} ${ch} ${h}${alpha < 1 ? ` / ${alpha}` : ''})`;
      }
      // the dark answer is DERIVED from the same colour (relative), so every other axis still shows through it
      const bg = scheme ? `light-dark(${c}, oklch(from ${c} calc(l - .3) c h))` : c;
      const html = controls === 'accent' ? `<div style="background:#fff;padding:.25rem .5rem;border-radius:.25rem;zoom:2;accent-color:${c}"><input type="checkbox" checked aria-label="on"> <input type="range" value="70" aria-label="level" style="width:4rem"></div>`
        : controls === 'native' ? '<input type="color" value="#7c3aed" aria-label="colour" style="width:5rem;height:3rem">' : '';
      return { css: `color: #3b82f6; ${scheme ? 'color-scheme: dark; ' : ''}background: ${bg};`, html };
    },
  },
  gradient: {
    axes: {
      // aurora: the gap check — blurred blobs (90 pens, filter: blur ≥ 40px), a soft field no gradient function draws
      type: { linear: 'linear', radial: 'radial', conic: 'conic', 'aurora (blurred blobs)': 'aurora' },
      repeating: { off: false, on: true },
      direction: { '90deg': '90deg', '135deg': '135deg', 'to top': 'to top', '200deg': '200deg', 'to bottom right': 'to bottom right' },
      shape: { 'circle closest-side': 'circle closest-side', 'ellipse farthest-corner': 'ellipse farthest-corner', 'circle 120px': 'circle 120px' },
      position: { centre: '50% 50%', 'top left': '20% 15%', 'bottom right': '85% 80%' },
      stops: { two: `${BRAND}, ${ACCENT}`, three: `${BRAND}, white, ${ACCENT}`, 'hard edge': `${BRAND} 0 50%, ${ACCENT} 50% 100%`, 'with alpha': `${BRAND}, transparent`, hint: `${BRAND}, 20%, ${ACCENT}` },
      space: { srgb: 'srgb', oklch: 'oklch', 'oklch longer': 'oklch longer hue' },
      // border (mask): the gap check — a ring cut out by mask-composite (40 pens): the inside stays SEE-THROUGH
      paints: { background: 'background', text: 'text', border: 'border', 'border (mask)': 'mask' },
      motion: { static: false, turning: true },
    },
    // an axis that only applies when another has a value: its specimens hold that value (shape and position are radial's)
    when: { shape: { type: 'radial' }, position: { type: 'radial' } },
    // DEPENDENT axes (measured, the look-alike groups): an aurora takes only the stops' COLOURS — repeating, direction, shape,
    // position, space, paints and stop positions do not apply to it; the builder shows them only for linear / radial / conic
    sameByDesign: ['motion'],
    compose: (p) => {
      const rep = p.repeating ? 'repeating-' : ''; const sp = `in ${p.space}`;
      // a repeating gradient needs stops that END before 100%, or it never repeats
      // R2-12: a repeating gradient REPEATS only when its stops end inside the box — each stop gets a position in a 20% period
      const split = (st) => st.split(/,(?![^(]*\))/).map((x) => x.trim()).filter((x) => !/^\d+%$/.test(x)).map((x) => x.replace(/(\s+[\d.]+%?)+$/, ''));
      const hard = /\d%?\s+\d+%\s*,/.test(p.stops); // double positions: a HARD edge stays hard when it repeats
      const stops = !p.repeating ? p.stops : (() => { const cs = split(p.stops); const step = 20 / cs.length; return hard ? cs.map((c, k) => `${c} ${(k * step).toFixed(1)}% ${((k + 1) * step).toFixed(1)}%`).join(', ') : cs.map((c, k) => `${c} ${(k * 20 / Math.max(1, cs.length - 1)).toFixed(1)}%`).join(', '); })();
      const g = p.type === 'linear' ? `${rep}linear-gradient(${p.motion ? 'var(--a)' : p.direction} ${sp}, ${stops})`
        : p.type === 'radial' ? `${rep}radial-gradient(${p.shape} at ${p.position} ${sp}, ${stops})`
        : `${rep}conic-gradient(from ${p.motion ? 'var(--a)' : '45deg'} at ${p.position} ${sp}, ${stops})`;
      // a radial gradient has no angle to turn: its motion PANS its position (a larger layer drifting) — "turning" on a radial
      // was a demo that never moved
      const anim = !p.motion ? '' : p.type === 'radial' ? 'background-size: 200% 200%; animation: r2pan 1.4s ease-in-out infinite alternate;' : 'animation: r2spin 2s linear infinite;';
      if (p.type === 'aurora') { // the stops' colours become blobs, blurred into one field over a dark base; motion drifts them
        const cs = split(p.stops).filter((c) => c !== 'transparent'); const at = [[-10, -25], [45, 5], [10, 45], [60, 50]];
        return { css: 'background: oklch(20% .05 270);', html: `<div style="position:absolute;inset:0;overflow:hidden">${cs.map((c, k) => `<div style="position:absolute;width:60%;aspect-ratio:1;border-radius:50%;background:${c};filter:blur(2.5rem);left:${at[k][0]}%;top:${at[k][1]}%;${p.motion ? `animation:r2drift ${1 + k * .3}s ease-in-out infinite alternate;` : ''}"></div>`).join('')}</div>` };
      }
      if (p.paints === 'text') return { css: 'background: #fff;', html: `<span class="words big" style="background: ${g}; -webkit-background-clip: text; background-clip: text; color: transparent; ${anim}">Gradient</span>` }; // on the WORDS: `background-clip: text` does not reach a positioned child's text (R2-9)
      // both rings sit OVER a photo, so the difference shows: the classic trick needs a solid inner fill, the mask ring is see-through
      const ring = (st) => ({ css: `background: ${PHOTO} center / cover;`, html: `<div style="position:absolute;inset:1rem;border-radius:.75rem;border:1rem solid transparent;${st}${anim}"></div>` });
      if (p.paints === 'border') return ring(`background: linear-gradient(#fff, #fff) padding-box, ${g} border-box;`);
      if (p.paints === 'mask') return ring(`background: ${g} border-box; -webkit-mask: linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0); mask-composite: exclude;`);
      return { css: `background: ${g}; ${anim}` };
    },
  },
  background: {
    axes: {
      size: { auto: 'auto', cover: 'cover', contain: 'contain', '50%': '50%' },
      position: { centre: 'center', 'top left': 'top left', 'bottom right': 'bottom right' },
      repeat: { 'no-repeat': 'no-repeat', repeat: 'repeat', 'repeat-x': 'repeat-x', space: 'space', round: 'round' },
      attachment: { scroll: 'scroll', fixed: 'fixed', local: 'local' },
      origin: { 'padding-box': 'padding-box', 'border-box': 'border-box', 'content-box': 'content-box' },
      base: { colour: '#e0f2fe', gradient: `linear-gradient(${BRAND}, ${ACCENT})` },
      // step 5: the clip box on its own (the origin's one value set both), and image-set() — one picture per screen density
      clip: { 'border-box': 'border-box', 'padding-box': 'padding-box', 'content-box': 'content-box' },
      source: { 'url()': 'url', 'image-set()': 'set' },
    },
    base: { size: '50%', clip: 'padding-box' }, // a tile smaller than the stage, so repeat / space / round can show
    // a clip box cuts only a picture that REACHES the padding (one centred tile never does); a FIXED picture is placed against
    // the window — an element shot is taken beyond the viewport, so that "window" is the whole sheet: tiled, it shows anywhere
    when: { clip: { repeat: 'repeat' }, attachment: { repeat: 'repeat' } },
    // url() = image-set(): 1x and 2x of one picture look the same on a 1x screen. scroll = local: `local` differs only once
    // the box ITSELF scrolls (a dependent axis — the builder offers it only on a scrolling box)
    sameByDesign: ['source', 'attachment'],
    noop: (p) => (p.attachment === 'fixed' && p.repeat === 'no-repeat') || (p.attachment === 'fixed' && /cover|contain/.test(p.size)) ? 'a fixed picture is placed against the WINDOW (here the whole sheet) — what a box shows of it depends on where the box sits' : null,
    compose: (p) => ({ css: `border: .5rem dashed #0003; padding: 1rem; background: ${p.source === 'set' ? `image-set(${PHOTO} 1x, ${PHOTO} 2x)` : PHOTO} ${p.position} / ${p.size} ${p.repeat} ${p.attachment} ${p.origin}${p.clip ? ' ' + p.clip : ''}, ${p.base};` }),
  },
  overlay: {
    axes: {
      // spotlight: the gap check — a window of light at the pointer (30 pens; it FOLLOWS the pointer in r2-states.js)
      layer: { colour: 'colour', scrim: 'scrim', pattern: 'pattern', blur: 'blur', spotlight: 'spotlight' },
      opacity: { '20': .2, '45': .45, '70': .7 },
      direction: { 'to bottom': 'to bottom', 'to top': 'to top', 'to right': 'to right', vignette: 'radial' },
      blend: { normal: 'normal', multiply: 'multiply', screen: 'screen', overlay: 'overlay', 'soft-light': 'soft-light', color: 'color' },
      scope: { band: 'band', words: 'words' },
    },
    when: { direction: { layer: 'scrim' } }, // DEPENDENT: direction is a scrim's only; blend does not apply to a blur layer
    // by nature (measured in the look-alike groups): a WHITE pattern × multiply draws nothing; a DARK tint × screen barely lightens
    noop: (p) => (p.layer === 'pattern' && p.blend === 'multiply') ? 'a white pattern × multiply draws nothing'
      : (['colour', 'scrim', 'spotlight'].includes(p.layer) && p.blend === 'screen' && p.opacity <= .2) ? 'a dark 20% tint × screen barely lightens' : null,
    compose: (p) => {
      const tint = `oklch(25% .08 260 / ${p.opacity})`;
      const layer = p.layer === 'colour' ? `linear-gradient(${tint}, ${tint})`
        : p.layer === 'scrim' ? (p.direction === 'radial' ? `radial-gradient(transparent 30%, ${tint})` : `linear-gradient(${p.direction}, transparent, ${tint})`)
        : p.layer === 'pattern' ? `repeating-linear-gradient(45deg, oklch(100% 0 0 / ${p.opacity}) 0 .25rem, transparent .25rem .75rem)`
        : p.layer === 'spotlight' ? `radial-gradient(circle at var(--x, 35%) var(--y, 40%), transparent 0 2.5rem, oklch(10% .05 260 / ${Math.min(.9, p.opacity + .25)}) 4.5rem)` : null;
      // R2-29a: the words' blur strip had `inset: auto …` and no height — it drew nothing; it now has its own height
      if (p.layer === 'blur') return { css: `background: ${PHOTO} center / cover;`, html: `<div class="glass" style="${p.scope === 'words' ? 'inset:auto 1rem 1rem 1rem; height:45%' : 'inset:0'}; position:absolute; backdrop-filter: blur(${Math.round(p.opacity * 20)}px); background: oklch(100% 0 0 / .1)"></div><span class="words light">Over the photo</span>` };
      // background-blend-mode blends only the layers INSIDE a box — the words' own box has nothing under it, so every blend
      // looked the same (measured). Blending WITH the photo behind takes mix-blend-mode: the builder rule, and the demo here
      if (p.scope === 'words') return { css: `background: ${PHOTO} center / cover;`, html: `<span class="words light" style="padding:.5rem;background:${layer};mix-blend-mode:${p.blend}">Over the photo</span>` };
      return { css: `background: ${layer}, ${PHOTO} center / cover; background-blend-mode: ${p.blend}, normal;`, html: '<span class="words light">Over the photo</span>' };
    },
  },
  shadow: {
    axes: {
      // reflection: the gap check (3 pens); outline letters: the census (-webkit-text-stroke, 47 pens) — an edge ON the letters
      kind: { box: 'box', drop: 'drop', text: 'text', 'reflection (box-reflect)': 'reflect', 'outline letters (text-stroke)': 'stroke' },
      x: { '0': 0, '0.25rem': .25, '-0.5rem': -.5, '1rem': 1 },
      y: { '0.125rem': .125, '0.5rem': .5, '1.5rem': 1.5, '-0.25rem': -.25 },
      blur: { hard: 0, soft: .75, wide: 2.5 },
      spread: { '0': 0, negative: -.25, ring: .2 },
      colour: { black: 'oklch(0% 0 0 / .25)', tinted: 'oklch(45% .12 260 / .35)', glow: `oklch(70% .2 300 / .8)` },
      inset: { out: false, in: true },
      layers: { '1 layer': 1, '2 layers': 2, '3 layers': 3 },
      // step 5: the dark-theme scale — on a dark surface a shadow needs more strength, plus a faint top highlight to lift the card
      theme: { light: 'light', dark: 'dark' },
    },
    base: { x: '0.25rem', y: '0.5rem', blur: 'soft', colour: 'tinted' }, // a shadow you can SEE, so every other value's change shows
    compose: (p) => {
      const dark = p.theme === 'dark'; const colour = dark ? p.colour.replace(/\/ ([\d.]+)\)/, (m, a) => `/ ${Math.min(1, a * 2.2).toFixed(2)})`) : p.colour;
      const one = (k) => `${p.inset && p.kind === 'box' ? 'inset ' : ''}${p.x * k}rem ${p.y * k}rem ${p.blur * k}rem${p.kind === 'box' ? ` ${p.spread}rem` : ''} ${colour}`;
      const list = Array.from({ length: p.layers }, (_, i) => one(i + 1));
      const surface = dark ? 'oklch(22% .02 260)' : '#eef2f7', card = dark ? 'oklch(30% .02 260)' : '#fff';
      if (p.kind === 'text') return { css: `background: ${surface}; text-shadow: ${list.join(', ')};${dark ? ' color: #fff;' : ''}`, html: '<span class="words big">Shadow</span>' };
      // hollow letters: a stroke in the shadow's colour, the fill see-through; the shadow list still falls behind them
      if (p.kind === 'stroke') return { css: `background: ${surface};`, html: `<span class="words big" style="color:transparent;-webkit-text-stroke:.09rem ${colour.replace(/\/ [\d.]+\)/, '/ 1)')};text-shadow:${list.join(', ')}">Shadow</span>` };
      // R2-29b: the filter belongs on a WRAPPER of the shape — on the stage, a dark surface made the stage an opaque box and the
      // drop shadow fell outside the picture (the V-10 rule again: a drop-shadow follows what is inside the element it is on)
      if (p.kind === 'drop') return { css: `background: ${dark ? surface : 'transparent'};`, html: `<div style="filter:${list.map((l) => `drop-shadow(${l})`).join(' ')}"><div style="width:6rem;height:6rem;background:${BRAND};clip-path:polygon(50% 0,100% 100%,0 100%)"></div></div>` };
      // a reflection is its own kind of shadow: the box mirrored below it, faded out by a gradient mask
      if (p.kind === 'reflect') return { css: `background: ${surface}; align-items: start; padding-top: .75rem;`, html: `<div style="width:8rem;height:4rem;border-radius:.5rem;background:linear-gradient(135deg, ${BRAND}, ${ACCENT});-webkit-box-reflect:below ${Math.max(0, p.y)}rem linear-gradient(transparent 30%, oklch(0% 0 0 / ${dark ? .5 : .35}))"></div>` };
      // on a CARD inside the stage: a shadow on the stage itself falls outside the picture (R2-7)
      return { css: `background: ${surface};`, html: `<div style="width:8rem;height:5rem;background:${card};border-radius:.5rem;box-shadow:${[...list, ...(dark ? ['inset 0 1px 0 oklch(100% 0 0 / .08)'] : [])].join(', ')}"></div>` };
    },
  },
  glass: {
    axes: {
      blur: { '4px': 4, '12px': 12, '24px': 24 },
      saturate: { '100%': 1, '160%': 1.6 },
      fill: { clear: .08, milky: .3, dark: -.35 },
      edge: { none: 'none', highlight: 'highlight', border: 'border' },
      grain: { off: false, on: true },
      filter: { none: 'none', grayscale: 'grayscale(1)', sepia: 'sepia(.8)', 'hue-rotate': 'hue-rotate(90deg)', contrast: 'contrast(1.6)', invert: 'invert(1)' },
      // ALL 16 modes (the map's values; live texture sites use darken too) — each with an example, none assumed
      blend: { normal: 'normal', multiply: 'multiply', screen: 'screen', overlay: 'overlay', darken: 'darken', lighten: 'lighten', 'color-dodge': 'color-dodge', 'color-burn': 'color-burn', 'hard-light': 'hard-light', 'soft-light': 'soft-light', difference: 'difference', exclusion: 'exclusion', hue: 'hue', saturation: 'saturation', color: 'color', luminosity: 'luminosity' },
      // the gap check — SVG filter primitives (feColorMatrix 121 pens, feBlend/feComposite 121, feDisplacementMap 96,
      // feGaussianBlur 59, feComponentTransfer 49, lighting 43, gooey 39, feMorphology 33, backdrop url() 9)
      svg: { none: null, gooey: 'gooey', duotone: 'duotone', displace: 'displace', morphology: 'morphology', emboss: 'emboss', 'feBlend': 'blend', 'liquid glass (backdrop)': 'liquid', 'sharpen (feConvolveMatrix)': 'sharpen', 'svg shadow (feOffset + feMerge)': 'svgshadow' },
      // the gap check — progressive blur (11 pens): the glass fades from clear to frosted along a mask
      progressive: { even: false, 'progressive (mask)': true },
      // step 5: the fallback where backdrop-filter is missing, and for a reader who asks for less transparency
      fallback: { none: false, '@supports + reduced transparency': true },
    },
    sameByDesign: ['fallback'], // Chrome has backdrop-filter and no reduced-transparency request: the fallback is PROVEN by emulation (r2-combos)
    compose: (p) => {
      const fill = p.fill < 0 ? `oklch(15% 0 0 / ${-p.fill})` : `oklch(100% 0 0 / ${p.fill})`;
      const edge = p.edge === 'highlight' ? 'box-shadow: inset 0 1px 0 oklch(100% 0 0 / .6);' : p.edge === 'border' ? 'border: 1px solid oklch(100% 0 0 / .4);' : '';
      const bf = `${p.svg === 'liquid' ? 'url(#r2-displace) ' : ''}blur(${p.blur}px) saturate(${p.saturate})`;
      const mask = p.progressive ? '-webkit-mask-image: linear-gradient(to bottom, transparent, #000 75%); mask-image: linear-gradient(to bottom, transparent, #000 75%);' : '';
      const g = `position:absolute; inset:1rem; border-radius:.75rem; backdrop-filter: ${bf}; -webkit-backdrop-filter: ${bf}; background: ${p.grain ? noise() + ' 0 0 / 120px, ' : ''}${fill}; background-blend-mode: ${p.grain ? 'overlay, normal' : 'normal'}; ${edge}${mask}`;
      // gooey thresholds ALPHA: on an opaque photo it changes nothing (measured: none = gooey), so it goes on the WORDS, whose
      // letters have see-through space around them to melt into
      // an SVG shadow, like a drop-shadow, follows what is INSIDE its element — it goes on the words (on the opaque photo it falls outside)
      const onWords = p.svg === 'gooey' || p.svg === 'svgshadow';
      const filter = [p.filter !== 'none' ? p.filter : '', p.svg && p.svg !== 'liquid' && !onWords ? `url(#r2-${p.svg})` : ''].filter(Boolean).join(' ') || 'none';
      // the fallback: author !important beats the inline glass, only when the browser lacks backdrop-filter or the reader asks
      const fb = p.fallback ? '<style>@supports not (backdrop-filter: blur(1px)) { .r2fb { background: oklch(96% 0 0 / .92) !important; } } @media (prefers-reduced-transparency: reduce) { .r2fb { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; background: oklch(96% 0 0 / .92) !important; } }</style>' : '';
      return { css: `background: ${PHOTO} center / cover; filter: ${filter};`, html: `${fb}<div${p.fallback ? ' class="r2fb"' : ''} style="${g}"></div><span class="words big" style="color:${ACCENT};mix-blend-mode:${p.blend};${p.svg === 'gooey' ? 'filter:url(#r2-gooey);letter-spacing:-.12em;' : p.svg === 'svgshadow' ? 'filter:url(#r2-svgshadow);' : ''}">Glass</span>` };
    },
  },
  texture: {
    axes: {
      // halftone (63 pens), shader (WebGL, 270 pens) and paint() (Houdini, 6 pens): the gap check
      source: { noise: 'noise', dots: 'dots', stripes: 'stripes', grid: 'grid', photo: 'photo', halftone: 'halftone', 'shader (WebGL)': 'shader', 'paint() worklet': 'paint', 'svg <pattern>': 'svgpattern', 'pixel tile (raster)': 'pixels' }, // svg pattern + a raster tile: the census (60 + 14 pens)
      // the census: image-rendering (14 pens) — a small tile scaled up stays CRISP (pixelated) instead of smoothed
      scaling: { smooth: 'auto', pixelated: 'pixelated' },
      noiseType: { fractalNoise: 'fractalNoise', turbulence: 'turbulence' },
      grain: { fine: 1.4, medium: .8, coarse: .3 },
      // numOctaves: 3 = 6 MEASURED at fine AND coarse grain — octaves above 3 are finer than a pixel at every tile size offered
      // (a cost with no look, RULE AF): the axis stops at 3
      detail: { 'one octave': 1, 'two octaves': 2, 'three octaves': 3 },
      strength: { '8%': .08, '20%': .2, '45%': .45 },
      blend: { normal: 'normal', multiply: 'multiply', screen: 'screen', overlay: 'overlay', 'soft-light': 'soft-light' },
      tile: { '0.5rem': .5, '1.5rem': 1.5, '6rem': 6 },
      over: { colour: BRAND, photo: 'photo' },
      ink: { light: 'light', dark: 'dark' },
      motion: { static: false, drifting: true }, // step 5: moving grain (steps() keyframes, 39 pens; a shader redraws)
    },
    sameByDesign: ['motion'], // a still frame of a moving texture is the same picture; motion is proven by frames
    // ink colours a DRAWN pattern (dots / stripes / grid); noise and a photo have their own
    // detail at COARSE grain: at fine grain octaves above 3 are finer than a pixel — 3 = 6 measured (a cost with no look, RULE AF)
    when: { ink: { source: 'dots' }, noiseType: { source: 'noise' }, grain: { source: 'noise' }, detail: { source: 'noise', grain: .3 }, blend: { source: 'noise' }, scaling: { source: 'pixels' } }, // blend on grey noise: light ink makes normal ≈ screen by nature
    base: { source: 'dots', strength: '45%', tile: '1.5rem' },
    // combinations that change NOTHING by nature — the builder should steer away from them, the proof names them
    noop: (p) => (['dots', 'stripes', 'grid', 'halftone'].includes(p.source) &&((p.ink === 'light' && p.blend === 'multiply') || (p.ink === 'dark' && p.blend === 'screen'))) ? `${p.ink} ink × ${p.blend} draws nothing` : null,
    compose: (p) => {
      const ink = `oklch(${p.ink === 'dark' ? '0%' : '100%'} 0 0 / ${p.strength})`;
      const below = p.over === 'photo' ? `${PHOTO} center / cover` : p.over;
      const drift = p.motion ? ' animation: r2grain .6s steps(4) infinite;' : '';
      // a shader and a paint worklet are not background layers you can stack: the canvas sits over the colour and blends
      if (p.source === 'shader') return { css: `background: ${below};`, html: shader(p.grain || .8, p.motion, `position:absolute;inset:0;width:100%;height:100%;mix-blend-mode:${p.blend};opacity:${Math.min(1, p.strength * 2)}`) };
      if (p.source === 'paint') return { css: `--ink: ${ink}; --tile: ${p.tile * 16}; background: paint(r2dots), ${below}; background-blend-mode: ${p.blend}, normal;${drift}`, html: PAINT_WORKLET };
      const layer = p.source === 'noise' ? `${noise({ type: p.noiseType, freq: p.grain, oct: p.detail })} 0 0 / ${p.tile * 4}rem`
        // halftone: soft dots + a contrast that snaps them into hard printed dots of varying size (63 pens)
        : p.source === 'halftone' ? `radial-gradient(closest-side, ${ink}, transparent) 0 0 / ${p.tile / 2}rem ${p.tile / 2}rem`
        // an SVG <pattern> of crosses, filling a rect: a tile any drawing tool can make (8 × 8 user units, so pixelated shows)
        : p.source === 'pixels' ? `${PIXELS} 0 0 / ${p.tile * 2}rem ${p.tile * 2}rem`
        : p.source === 'svgpattern' ? `url('data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><defs><pattern id="p" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M3 1h2v2h2v2H5v2H3V5H1V3h2z" fill="${p.ink === 'dark' ? '#000' : '#fff'}" fill-opacity="${p.strength}"/></pattern></defs><rect width="8" height="8" fill="url(#p)"/></svg>`)}') 0 0 / ${p.tile}rem ${p.tile}rem`
        : p.source === 'dots' ? `radial-gradient(${ink} 25%, transparent 26%) 0 0 / ${p.tile}rem ${p.tile}rem`
        : p.source === 'stripes' ? `repeating-linear-gradient(45deg, ${ink} 0 ${p.tile / 4}rem, transparent ${p.tile / 4}rem ${p.tile / 2}rem)`
        : p.source === 'grid' ? `linear-gradient(${ink} 1px, transparent 1px) 0 0 / ${p.tile}rem ${p.tile}rem, linear-gradient(90deg, ${ink} 1px, transparent 1px) 0 0 / ${p.tile}rem ${p.tile}rem`
        : `${PHOTO} 0 0 / ${p.tile * 4}rem repeat`;
      const n = p.source === 'grid' ? 2 : 1;
      return { css: `background: ${layer}, ${below}; background-blend-mode: ${Array(n).fill(p.blend).join(', ')}, normal;${p.source === 'noise' ? ` opacity: ${1 - p.strength / 3};` : ''}${p.source === 'halftone' ? ' filter: contrast(2.5);' : ''}${drift} image-rendering: ${p.scaling};` };
    },
  },
  shape: {
    axes: {
      shape: Object.fromEntries(Object.keys(SHAPES).map((k) => [k, k])),
      // step 5 + the gap check: shape() (responsive, %), path() (PIXELS — it cannot stretch: the builder uses shape()), an SVG
      // <clipPath> in objectBoundingBox units (48 + 25 pens), ellipse() / circle() (140), inset() round (103), a border-radius
      // blob (35). The last four make THEIR OWN shape — the shape axis does not apply to them.
      method: { 'clip-path': 'clip', mask: 'mask', 'svg divider': 'svg', 'shape()': 'shapefn', 'path() (px)': 'path', 'svg clipPath': 'svgclip', 'ellipse()': 'ellipse', 'circle()': 'circle', 'inset() round': 'inset', 'border-radius blob': 'radius', 'rect() round': 'rect', 'mask, tiled gradient': 'tiled' }, // rect() + a tiled mask: the census (20 + 10 pens)
      edge: { bottom: 'bottom', top: 'top' },
      depth: { '8%': 8, '18%': 18, '35%': 35 },
      invert: { no: false, yes: true },
      layers: { '1': 1, '2': 2, '3': 3 },
      fill: { cut: 'cut', 'next band': 'next', gradient: 'gradient' }, // gradient: the census (an SVG linearGradient fill, 43 pens)
      overlap: { none: 0, '2rem': 2 },
      motion: { static: false, drifting: true },
      // the gap check: corner-shape (5 pens, new in Chrome) on the next band's corners; words wrapping a shape (shape-outside, 19)
      corners: { square: null, round: 'round', squircle: 'squircle', scoop: 'scoop', notch: 'notch', bevel: 'bevel' },
      words: { none: null, 'beside a box': 'box', 'wrap the shape (shape-outside)': 'wrap' },
    },
    sameByDesign: ['method', 'motion'], // three ways to draw ONE edge must look the same; motion is proven by frames
    // the edge is depth% of a 6rem band; an overlap hiding 85% of it leaves a sliver no one sees (a 2rem overlap on a 35% edge: 0.1rem)
    noop: (p) => (p.overlap && p.edge === 'bottom' && p.overlap >= (p.depth / 100) * 6 * .85) ? `a ${p.overlap}rem overlap covers a ${p.depth}% edge — the shape (and its motion) is hidden`
      : (p.corners && p.fill === 'next') ? `${p.corners} corners on the next band vanish into a background of the same colour` : null,
    compose: (p) => {
      const poly = edgePolygon(p.shape, p.depth, p.edge, p.invert);
      const top = p.edge === 'top';
      const pts = Array.from({ length: 61 }, (_, i) => { const x = i / 60; let y = SHAPES[p.shape](x); if (p.invert) y = 1 - y; return [x, y * p.depth / 100]; });
      const shapeFn = toShape(poly);
      const H = 96, W = 1000; // path() takes PIXELS only: drawn for a 1000 × 96 band, it is cut off rather than stretched
      const pathFn = top ? `path('M0,${(pts[0][1] * H).toFixed(1)} ${pts.slice(1).map(([x, y]) => `L${(x * W).toFixed(1)},${(y * H).toFixed(1)}`).join(' ')} L${W},${H} L0,${H} Z')`
        : `path('M0,0 L${W},0 ${pts.slice().reverse().map(([x, y]) => `L${(x * W).toFixed(1)},${(H - y * H).toFixed(1)}`).join(' ')} Z')`;
      const clipId = `r2c-${p.shape}-${p.depth}-${p.edge}-${p.invert ? 1 : 0}`;
      const svgClip = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><clipPath id="${clipId}" clipPathUnits="objectBoundingBox"><path d="${top ? `M0,${pts[0][1].toFixed(4)} ${pts.slice(1).map(([x, y]) => `L${x.toFixed(4)},${y.toFixed(4)}`).join(' ')} L1,1 L0,1 Z` : `M0,0 L1,0 ${pts.slice().reverse().map(([x, y]) => `L${x.toFixed(4)},${(1 - y).toFixed(4)}`).join(' ')} Z`}"/></clipPath></svg>`;
      const d = p.depth / 100; const rx = (50 / Math.sqrt(1 - (1 - d) ** 2)).toFixed(1); // the ellipse whose sides meet the band's edge `depth` up
      const own = { ellipse: `clip-path: ellipse(${rx}% 100% at 50% ${top ? '100%' : '0'});`, circle: `clip-path: circle(${100 - p.depth}% at 50% 50%);`,
        inset: `clip-path: inset(0 round ${top ? `50% 50% 0 0 / ${p.depth}% ${p.depth}% 0 0` : `0 0 50% 50% / 0 0 ${p.depth}% ${p.depth}%`});`,
        radius: `border-radius: ${top ? `40% 60% 0 0 / ${p.depth * 1.6}% ${p.depth}% 0 0` : `0 0 60% 40% / 0 0 ${p.depth}% ${p.depth * 1.6}%`};`,
        rect: `clip-path: ${top ? `rect(${p.depth}% 100% 100% 0 round 3rem 3rem 0 0)` : `rect(0 100% ${100 - p.depth}% 0 round 0 0 3rem 3rem)`};`,
        // scallops with no SVG: a radial gradient TILED along the edge cuts a row of half-circles; a solid layer masks the rest
        tiled: (() => { const r = (p.depth / 100 * 6 / 1.5).toFixed(2); const m = `radial-gradient(circle at 50% ${top ? '0' : '100%'}, transparent ${r}rem, #000 calc(${r}rem + .06rem)) ${top ? 'top' : 'bottom'} / ${r * 2}rem ${r}rem repeat-x, linear-gradient(#000 0 0) ${top ? 'bottom' : 'top'} / 100% calc(100% - ${r}rem) no-repeat`; return `-webkit-mask: ${m}; mask: ${m};`; })() }[p.method] || '';
      const fillBg = p.fill === 'next' ? ACCENT : p.fill === 'gradient' ? `linear-gradient(90deg in oklch, ${ACCENT}, oklch(70% .2 330))` : '#fff';
      const svgPath = (() => { const f = SHAPES[p.shape]; let d = 'M0,0 '; for (let i = 0; i <= 60; i++) { const x = i / 60; let y = f(x); if (p.invert) y = 1 - y; d += `L${(x * 100).toFixed(2)},${(y * 100).toFixed(2)} `; } return d + 'L100,0 Z'; })();
      // A REAL mask: the edge strip is an SVG of the shape (opaque above the line), the rest of the band a solid mask
      const maskPath = (() => { const f = SHAPES[p.shape]; let d = 'M0,0 '; for (let k = 0; k <= 60; k++) { const x = k / 60; let y = f(x); if (p.invert) y = 1 - y; d += `L${(x * 100).toFixed(2)},${((1 - y) * 100).toFixed(2)} `; } return d + 'L100,0 Z'; })(); // R2-11: 1 − f, as the clip-path cuts
      const maskSvg = `url('data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${maskPath}" transform="${top ? 'scale(1,-1) translate(0,-100)' : ''}" fill="#000"/></svg>`)}')`;
      const strip = `${maskSvg} ${top ? 'top' : 'bottom'} / 100% ${p.depth}% no-repeat, linear-gradient(#000,#000) ${top ? 'bottom' : 'top'} / 100% ${100 - p.depth}% no-repeat`;
      const shapeCss = p.method === 'clip' ? `clip-path: ${poly};`
        : p.method === 'mask' ? `-webkit-mask: ${strip}; mask: ${strip};`
        : p.method === 'shapefn' ? `clip-path: ${shapeFn};` : p.method === 'path' ? `clip-path: ${pathFn};` : p.method === 'svgclip' ? `clip-path: url(#${clipId});`
        : own;
      const words = !p.words ? '' : `<div style="position:relative;padding:.4rem .6rem;color:#fff;font-size:.6rem;line-height:1.25">${`<div style="float:left;width:3.5rem;height:3.5rem;margin:0 .4rem .2rem 0;background:${ACCENT};${p.words === 'wrap' ? 'shape-outside:circle(50%);clip-path:circle(50%);' : ''}"></div>`}${'Words flow around the shape beside them, line after line, the way a magazine sets a caption. '.repeat(3)}</div>`;
      // R2-10: extra layers sit BEHIND the band, a little deeper, so they peek out under its edge (inside the band they vanished)
      const layers = Array.from({ length: p.layers - 1 }, (_, k) => `<div style="position:absolute;left:0;right:0;${top ? 'bottom:0' : 'top:0'};height:calc(60% + ${(k + 1) * .6}rem);background:${BRAND};opacity:${.45 - k * .15};${`clip-path:${edgePolygon(p.shape, Math.min(60, p.depth + 12 * (k + 1)), p.edge, p.invert)}`};transform:translateX(${(k + 1) * 4}%)"></div>`).join('');
      const svg = p.method === 'svg' ? `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;left:0;${top ? 'top:0;transform:scaleY(-1)' : 'bottom:0'};width:100%;height:${p.depth}%;${p.motion ? 'animation:r2drift 1.2s ease-in-out infinite alternate' : ''}"><path d="${svgPath}" transform="scale(1,-1) translate(0,-100)" fill="${p.fill === 'next' ? ACCENT : p.fill === 'gradient' ? 'url(#r2fill)' : '#fff'}"/></svg>` : '';
      // full WIDTH bands in a column that fills the stage (the stage centres its content: a band with no width drew nothing, R2-4)
      const band = `<div class="band" style="position:relative;flex:0 0 60%;width:100%;background:${BRAND};${shapeCss}${p.motion && p.method !== 'svg' ? 'animation:r2drift 1.2s ease-in-out infinite alternate;' : ''}">${svg}${words}</div>`;
      const corners = !p.corners ? '' : `border-radius:3rem;${p.corners === 'round' ? '' : `corner-shape:${p.corners};`}`;
      const next = `<div class="band" style="position:relative;flex:1 0 40%;width:100%;background:${ACCENT};margin-${top ? 'bottom' : 'top'}:-${p.overlap}rem;z-index:${p.overlap ? 1 : 0};box-shadow:${p.overlap ? '0 -.5rem 1rem #0004' : 'none'};${corners}"></div>`;
      return { css: `background: ${fillBg}; padding: 0;`, html: `${p.fill === 'gradient' && p.method === 'svg' ? `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><linearGradient id="r2fill"><stop offset="0" stop-color="oklch(72% .17 40)"/><stop offset="1" stop-color="oklch(70% .2 330)"/></linearGradient></svg>` : ''}${p.method === 'svgclip' ? svgClip : ''}<div style="position:absolute;inset:0;display:flex;flex-direction:column">${layers}${top ? next + band : band + next}</div>` };
    },
  },
};

/** Every value of every axis, the others at their first value — the specimens (step 2). */
function specimens(fam) {
  const F = FAMILIES[fam]; const base = Object.fromEntries(Object.entries(F.axes).map(([a, vs]) => [a, F.base && F.base[a] !== undefined ? vs[F.base[a]] : Object.values(vs)[0]]));
  const out = [];
  for (const [axis, vs] of Object.entries(F.axes)) for (const [label, v] of Object.entries(vs)) { const pick = { ...base, ...((F.when || {})[axis] || {}), [axis]: v }; out.push({ id: `${fam}.${axis}.${label}`, axis, label, pick, noop: F.noop ? F.noop(pick) : null, ...F.compose(pick) }); }
  return out;
}
/** `n` random combinations across every axis (step 3), seeded so a failure can be re-run exactly. */
function combos(fam, n, seed = 1) {
  const F = FAMILIES[fam]; const r = seeded(seed * 7919 + fam.length);
  return Array.from({ length: n }, (_, i) => {
    const labels = {}; const pick = {};
    for (const [axis, vs] of Object.entries(F.axes)) { const ks = Object.keys(vs); const k = ks[Math.floor(r() * ks.length)]; labels[axis] = k; pick[axis] = vs[k]; }
    return { id: `${fam}#${seed}.${i}`, labels, pick, noop: F.noop ? F.noop(pick) : null, ...F.compose(pick) };
  });
}
// R2-31: a label like "svg <pattern>" was parsed as an HTML tag in the caption (the sheet read "texture.source.svg")
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** A page of demos — each a 18rem × 10rem stage (the specimen sheet and the proof use the same page). */
function page(title, demos) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>
@property --a { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
@keyframes r2spin { to { --a: 360deg; } } @keyframes r2drift { to { transform: translateX(-4%); } } @keyframes r2pan { to { background-position: 100% 100%; } } @keyframes r2grain { to { background-position: 2.3rem 1.7rem; } }
body { font: 16px/1.4 system-ui, sans-serif; margin: 0; padding: 1rem; background: #f8fafc; color: #0f172a; display: grid; grid-template-columns: repeat(auto-fill, 18rem); gap: 1rem; }
/* R2-27: FIXED columns — 1fr columns came out 296.25px beside a scrollbar, tiles alternated 296 / 297px, and two pictures of
   different sizes compare as 100% different: same-look values read as distinct. Every tile is now the same size. */
figure { margin: 0; } figcaption { font-size: .75rem; color: #475569; margin-top: .25rem; word-break: break-word; height: 4.5rem; overflow: auto; }
/* R2-27: every stage EXACTLY 18rem × 10rem — captions of different lengths left rows at fractional y (shots 160 or 161px tall),
   and a stage's own border made it taller; both read as "different pictures" */
.stage { box-sizing: border-box; position: relative; height: 10rem; overflow: hidden; display: grid; place-items: center; border-radius: .25rem; outline: 1px solid #e2e8f0; }
.words { font-weight: 800; font-size: 1.75rem; position: relative; } .big { font-size: 3rem; } .light { color: #fff; }
</style></head><body>${SVG_FILTERS}${demos.map((d, i) => `<figure><div class="stage" data-demo="${i}" data-id="${d.id}" style="${d.css.replace(/"/g, '&quot;')}">${d.html || ''}</div><figcaption>${esc(d.id)}${d.labels ? ' · ' + esc(Object.entries(d.labels).map(([a, v]) => `${a}: ${v}`).join(' · ')) : ''}</figcaption></figure>`).join('\n')}</body></html>`;
}
// ── RULE MAP step 3, ACROSS FAMILIES: every family STACKED on one block (a hero band + a glass card + the next band) ──
// Each ingredient can be left OUT (`omit`), so a clash is found by ablation: if removing an ingredient changes nothing you
// can see, the others hid or broke it. Values come from the families' own axes, so the stack proves the same vocabulary.
const STACK = {
  axes: {
    base: { colour: 'colour', linear: 'linear', radial: 'radial', conic: 'conic' },
    photo: { off: false, on: true },
    // step 4 — the gap check's values join the stack: a spotlight, halftone, the new edge families, shape(), liquid glass
    overlay: { off: null, 'tint 40%': 'tint', 'scrim 60%': 'scrim', 'pattern 30%': 'pattern', spotlight: 'spotlight' },
    overlayBlend: { normal: 'normal', multiply: 'multiply', 'soft-light': 'soft-light', screen: 'screen' },
    texture: { off: null, grain: 'grain', dots: 'dots', stripes: 'stripes', halftone: 'halftone' },
    edge: { off: null, wave: 'wave', slope: 'slope', curve: 'curve', zigzag: 'zigzag', torn: 'torn', scallop: 'scallop', drip: 'drip', mountain: 'mountain' },
    edgeMethod: { 'clip-path': 'clip', mask: 'mask', 'shape()': 'shapefn' },
    bandShadow: { off: false, 'on the wrapper': 'wrapper', 'on the band': 'band' },
    card: { off: false, glass: 'glass', solid: 'solid', 'liquid glass': 'liquid' },
    cardBlur: { '6px': 6, '16px': 16 },
    cardShadow: { off: null, soft: 'soft', glow: 'glow', hard: 'hard' },
    heading: { solid: 'solid', gradient: 'gradient' },
  },
  // the ingredients an ablation can take out, and the axis value that removes each
  parts: { photo: ['photo', false], overlay: ['overlay', null], texture: ['texture', null], edge: ['edge', null], bandShadow: ['bandShadow', false], card: ['card', false], cardShadow: ['cardShadow', null], gradientHeading: ['heading', 'solid'], cardBlur: ['cardBlur', 0] },
  compose: (p) => {
    const base = p.base === 'colour' ? BRAND : p.base === 'linear' ? `linear-gradient(135deg in oklch, ${BRAND}, ${ACCENT})` : p.base === 'radial' ? `radial-gradient(ellipse at 30% 30% in oklch, ${ACCENT}, ${BRAND})` : `conic-gradient(from 45deg at 60% 40% in oklch, ${BRAND}, ${ACCENT}, ${BRAND})`;
    const ov = p.overlay === 'tint' ? 'linear-gradient(oklch(20% .05 260 / .4), oklch(20% .05 260 / .4))' : p.overlay === 'scrim' ? 'linear-gradient(to bottom, transparent, oklch(15% .04 260 / .6))' : p.overlay === 'pattern' ? 'repeating-linear-gradient(45deg, oklch(100% 0 0 / .3) 0 .25rem, transparent .25rem .75rem)'
      : p.overlay === 'spotlight' ? 'radial-gradient(circle at 70% 30%, transparent 0 2.5rem, oklch(10% .05 260 / .6) 4.5rem)' : null;
    const tx = p.texture === 'grain' ? `${noise({ freq: .9, oct: 3 })} 0 0 / 8rem` : p.texture === 'dots' ? 'radial-gradient(oklch(100% 0 0 / .35) 25%, transparent 26%) 0 0 / 1rem 1rem' : p.texture === 'stripes' ? 'repeating-linear-gradient(-45deg, oklch(0% 0 0 / .18) 0 .2rem, transparent .2rem .6rem)'
      : p.texture === 'halftone' ? 'radial-gradient(closest-side, oklch(0% 0 0 / .4), transparent) 0 0 / .6rem .6rem' : null;
    const layers = [tx, ov, p.photo ? `${PHOTO} center / cover` : null, base].filter(Boolean);
    const blends = [tx ? 'overlay' : null, ov ? p.overlayBlend : null, p.photo ? 'normal' : null, 'normal'].filter(Boolean);
    let edge = '';
    if (p.edge) {
      const poly = edgePolygon(p.edge, 14, 'bottom');
      const f = SHAPES[p.edge]; let d = 'M0,0 '; for (let k = 0; k <= 60; k++) { const x = k / 60; d += `L${(x * 100).toFixed(2)},${((1 - f(x)) * 100).toFixed(2)} `; } d += 'L100,0 Z';
      const m = `url('data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${d}" fill="#000"/></svg>`)}') bottom / 100% 14% no-repeat, linear-gradient(#000,#000) top / 100% 86% no-repeat`;
      edge = p.edgeMethod === 'clip' ? `clip-path: ${poly};` : p.edgeMethod === 'shapefn' ? `clip-path: ${toShape(poly)};` : `-webkit-mask: ${m}; mask: ${m};`;
    }
    const sh = 'oklch(10% .05 260 / .55)';
    // the band's shadow: on a WRAPPER (a drop-shadow follows the shaped edge) or on the band itself (a box-shadow the edge cuts — V-10)
    const bandSh = p.bandShadow === 'band' ? `box-shadow: 0 .75rem 1.25rem ${sh};` : '';
    const wrapSh = p.bandShadow === 'wrapper' ? `filter: drop-shadow(0 .75rem .75rem ${sh});` : '';
    const cardSh = p.cardShadow === 'soft' ? 'box-shadow: 0 .5rem 1.5rem oklch(10% .05 260 / .35);' : p.cardShadow === 'glow' ? 'box-shadow: 0 0 1.5rem oklch(80% .18 300 / .9);' : p.cardShadow === 'hard' ? 'box-shadow: .375rem .375rem 0 oklch(10% 0 0 / .8);' : '';
    const glassy = p.card === 'glass' || p.card === 'liquid';
    const fill = glassy ? 'oklch(100% 0 0 / .14)' : 'oklch(98% .01 260)';
    const bfv = `${p.card === 'liquid' ? 'url(#r2-displace) ' : ''}blur(${p.cardBlur}px) saturate(1.4)`;
    const blur = glassy && p.cardBlur ? `backdrop-filter: ${bfv}; -webkit-backdrop-filter: ${bfv};` : '';
    const hd = p.heading === 'gradient' ? `background: linear-gradient(90deg in oklch, oklch(85% .15 90), oklch(75% .2 330)); -webkit-background-clip: text; background-clip: text; color: transparent;` : `color: ${p.card === 'solid' ? '#0f172a' : '#fff'};`;
    const card = p.card ? `<div style="position:absolute;left:14%;right:14%;top:14%;height:46%;border-radius:.75rem;background:${fill};border:1px solid oklch(100% 0 0 / .35);${blur}${cardSh}display:grid;place-items:center"><span style="font-weight:800;font-size:1.5rem;${hd}">Heading</span></div>` : `<span style="position:absolute;left:0;right:0;top:30%;text-align:center;font-weight:800;font-size:1.5rem;${hd}">Heading</span>`;
    const band = `<div style="position:relative;flex:1 1 100%;width:100%;background:${layers.join(', ')};background-blend-mode:${blends.join(', ')};${edge}${bandSh}">${card}</div>`;
    return { css: 'background: #fff; padding: 0;', html: `<div style="position:absolute;inset:0;display:flex;flex-direction:column"><div style="position:relative;flex:0 0 70%;width:100%;z-index:1;display:flex;${wrapSh}">${band}</div><div style="flex:1 0 30%;width:100%;background:${ACCENT}"></div></div>` };
  },
};
/** `n` random stacked blocks, each with the ablations of every ingredient it uses (the cross-family proof). */
function stacks(n, seed = 1) {
  const r = seeded(seed * 104729 + 7);
  return Array.from({ length: n }, (_, i) => {
    const labels = {}; const pick = {};
    for (const [axis, vs] of Object.entries(STACK.axes)) { const ks = Object.keys(vs); const k = ks[Math.floor(r() * ks.length)]; labels[axis] = k; pick[axis] = vs[k]; }
    // an ingredient is "used" when it is on — and a card's shadow / blur only when there IS a card (blur: a glass one)
    const used = Object.entries(STACK.parts).filter(([part, [axis, offValue]]) => pick[axis] !== offValue && !(part === 'cardBlur' && pick.card !== 'glass' && pick.card !== 'liquid') && !(part === 'cardShadow' && !pick.card));
    return { id: `stack#${seed}.${i}`, labels, pick, ...STACK.compose(pick), without: used.map(([part, [axis, offValue]]) => ({ part, ...STACK.compose({ ...pick, [axis]: offValue }) })) };
  });
}
// ── RULE MAP step 3c — EVERY LEVEL, NESTED: section → card → button → text (card / button may be absent). Each level gets its
// own random mix, made the way THAT level needs (texture in the LETTERS is a noise background clipped to the text; a shape
// on a button is a clip-path). `data-level` marks each level so the cascade can be checked: a colour / font set above flows
// DOWN unless a level sets its own. Each level's ingredients are ablatable, as in the stack proof.
const NEST = {
  axes: {
    'section.bg': { colour: 'colour', gradient: 'gradient', photo: 'photo' }, 'section.overlay': { off: null, tint: 'tint', scrim: 'scrim', 'dark pattern': 'pattern', spotlight: 'spotlight' },
    'section.texture': { off: null, grain: 'grain', dots: 'dots' }, 'section.edge': { off: null, wave: 'wave', slope: 'slope' },
    'section.color': { white: '#ffffff', ink: '#0f172a' }, 'section.font': { sans: 'system-ui, sans-serif', serif: 'Georgia, serif' },
    'card.present': { yes: true, no: false }, 'card.bg': { solid: 'solid', gradient: 'gradient', glass: 'glass' }, 'card.overlay': { off: null, tint: 'tint' },
    'card.texture': { off: null, grain: 'grain', stripes: 'stripes' }, 'card.shadow': { off: null, soft: 'soft', hard: 'hard' }, 'card.clip': { off: false, on: true },
    'card.color': { inherit: null, own: '#7c2d12' },
    'button.present': { yes: true, no: false }, 'button.bg': { solid: 'solid', gradient: 'gradient', textured: 'textured' }, 'button.shadow': { off: null, glow: 'glow', soft: 'soft' },
    'button.shape': { pill: 'pill', 'cut corner': 'cut', squircle: 'squircle' }, 'button.color': { inherit: null, own: '#ffffff' },
    'text.fill': { inherit: 'inherit', solid: 'solid', gradient: 'gradient', texture: 'texture' }, 'text.shadow': { off: null, soft: 'soft', outline: 'outline' }, 'text.blend': { normal: 'normal', overlay: 'overlay' },
  },
  // ingredients an ablation can take out → [axis, the value that removes it]
  parts: { 'section.overlay': null, 'section.texture': null, 'section.edge': null, 'card.overlay': null, 'card.texture': null, 'card.shadow': null, 'button.shadow': null, 'text.shadow': null },
  compose: (p) => {
    const sh = 'oklch(10% .05 260 / .5)';
    const tex = (t, dark) => t === 'grain' ? `${noise({ freq: .9, oct: 3 })} 0 0 / 6rem` : t === 'dots' ? 'radial-gradient(oklch(100% 0 0 / .4) 25%, transparent 26%) 0 0 / .9rem .9rem' : t === 'stripes' ? `repeating-linear-gradient(-45deg, oklch(${dark ? '0%' : '100%'} 0 0 / .22) 0 .2rem, transparent .2rem .55rem)` : null;
    // SECTION
    const sBase = p['section.bg'] === 'colour' ? BRAND : p['section.bg'] === 'gradient' ? `linear-gradient(135deg in oklch, ${BRAND}, ${ACCENT})` : `${PHOTO} center / cover`;
    const sOv = p['section.overlay'] === 'tint' ? 'linear-gradient(oklch(15% .05 260 / .35), oklch(15% .05 260 / .35))' : p['section.overlay'] === 'scrim' ? 'linear-gradient(to bottom, transparent, oklch(10% .04 260 / .65))' : p['section.overlay'] === 'pattern' ? 'repeating-linear-gradient(45deg, oklch(0% 0 0 / .25) 0 .25rem, transparent .25rem .75rem)'
      : p['section.overlay'] === 'spotlight' ? 'radial-gradient(circle at 25% 30%, transparent 0 2.5rem, oklch(10% .05 260 / .6) 4.5rem)' : null;
    const sLayers = [tex(p['section.texture']), sOv, sBase].filter(Boolean); const sBlend = [p['section.texture'] ? 'overlay' : null, sOv ? 'normal' : null, 'normal'].filter(Boolean);
    const sEdge = p['section.edge'] ? `clip-path: ${edgePolygon(p['section.edge'], 12, 'bottom')};` : '';
    // TEXT — made the way LETTERS need it
    const tFill = p['text.fill'] === 'solid' ? 'color: oklch(85% .15 90);' : p['text.fill'] === 'gradient' ? 'background: linear-gradient(90deg in oklch, oklch(85% .15 90), oklch(72% .2 330)); -webkit-background-clip: text; background-clip: text; color: transparent;' : p['text.fill'] === 'texture' ? `background: ${noise({ freq: .6, oct: 2 })} 0 0 / 4rem, linear-gradient(${ACCENT}, ${BRAND}); background-blend-mode: overlay, normal; -webkit-background-clip: text; background-clip: text; color: transparent;` : '';
    const tSh = p['text.shadow'] === 'soft' ? `text-shadow: 0 .2rem .4rem ${sh};` : p['text.shadow'] === 'outline' ? 'text-shadow: 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;' : '';
    const text = `<span data-level="text" style="font-weight:800;font-size:1.35rem;${tFill}${tSh}mix-blend-mode:${p['text.blend']}">Aa Button</span>`;
    // BUTTON
    const bBg = p['button.bg'] === 'solid' ? 'oklch(45% .18 290)' : p['button.bg'] === 'gradient' ? 'linear-gradient(90deg in oklch, oklch(55% .2 300), oklch(65% .18 20))' : `${tex('stripes', true)}, oklch(60% .16 160)`;
    const bSh = p['button.shadow'] === 'glow' ? 'box-shadow: 0 0 1.25rem oklch(80% .2 300 / .95);' : p['button.shadow'] === 'soft' ? `box-shadow: 0 .35rem .8rem ${sh};` : '';
    const bShape = p['button.shape'] === 'cut' ? 'clip-path: polygon(0 0, calc(100% - .75rem) 0, 100% .75rem, 100% 100%, .75rem 100%, 0 calc(100% - .75rem));' : p['button.shape'] === 'squircle' ? 'border-radius: 1rem; corner-shape: squircle;' : 'border-radius: 999px;';
    // a CUT button cannot carry its own shadow (the clip-path removes it) — its shadow goes on a wrapper as a drop-shadow, the V-10 rule
    const btn = (inner) => { const box = `<span data-level="button" style="display:inline-block;padding:.5rem 1rem;background:${bBg};${bShape}${p['button.color'] ? `color:${p['button.color']};` : ''}${p['button.shape'] === 'cut' ? '' : bSh}">${inner}</span>`; return p['button.shape'] === 'cut' && bSh ? `<span style="display:inline-block;filter:drop-shadow(${p['button.shadow'] === 'glow' ? '0 0 .6rem oklch(80% .2 300 / .95)' : `0 .35rem .4rem ${sh}`})">${box}</span>` : box; };
    // CARD
    const cBg = p['card.bg'] === 'solid' ? 'oklch(97% .01 260)' : p['card.bg'] === 'gradient' ? 'linear-gradient(160deg in oklch, oklch(95% .04 90), oklch(88% .06 30))' : 'oklch(100% 0 0 / .16)';
    const cLayers = [tex(p['card.texture'], p['card.bg'] !== 'glass'), p['card.overlay'] ? 'linear-gradient(oklch(60% .15 260 / .25), oklch(60% .15 260 / .25))' : null, cBg].filter(Boolean);
    const cSh = p['card.shadow'] === 'soft' ? `box-shadow: 0 .6rem 1.4rem ${sh};` : p['card.shadow'] === 'hard' ? 'box-shadow: .4rem .4rem 0 oklch(10% 0 0 / .8);' : '';
    const card = (inner) => `<div data-level="card" style="position:relative;padding:1rem;border-radius:.75rem;display:grid;place-items:center;background:${cLayers.join(', ')};${p['card.bg'] === 'glass' ? 'backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);' : ''}${cSh}${p['card.clip'] ? 'overflow:hidden;' : ''}${p['card.color'] ? `color:${p['card.color']};` : ''}">${inner}</div>`;
    let inner = text; if (p['button.present']) inner = btn(inner); if (p['card.present']) inner = card(inner);
    const section = `<div data-level="section" style="position:absolute;inset:0 0 25% 0;display:grid;place-items:center;background:${sLayers.join(', ')};background-blend-mode:${sBlend.join(', ')};color:${p['section.color']};font-family:${p['section.font']};${sEdge}">${inner}</div>`;
    return { css: 'background: #fff; padding: 0;', html: `${section}<div style="position:absolute;left:0;right:0;bottom:0;height:25%;background:${ACCENT}"></div>` };
  },
};
/** `n` random nested trees, each with an ablation of every ingredient it uses (a part is "used" when it is on AND its level exists). */
function nests(n, seed = 1) {
  const r = seeded(seed * 130363 + 11);
  return Array.from({ length: n }, (_, i) => {
    const labels = {}; const pick = {};
    for (const [axis, vs] of Object.entries(NEST.axes)) { const ks = Object.keys(vs); const k = ks[Math.floor(r() * ks.length)]; labels[axis] = k; pick[axis] = vs[k]; }
    const exists = (lvl) => lvl === 'section' || lvl === 'text' || pick[`${lvl}.present`];
    const used = Object.entries(NEST.parts).filter(([axis, off]) => pick[axis] !== off && exists(axis.split('.')[0]));
    // what the text's colour should come from when it inherits: the nearest level that sets its own
    const from = [['button', pick['button.present'] && pick['button.color']], ['card', pick['card.present'] && pick['card.color']], ['section', pick['section.color']]].find(([, c]) => c);
    // by-nature no-ops the builder should warn about: a tint the SAME colour as what shows through a see-through card
    const noop = { 'card.overlay': pick['card.bg'] === 'glass' && pick['section.bg'] === 'colour' ? 'a blue tint on a glass card over a blue section shows nothing (same colour as what shows through)' : null };
    return { id: `nest#${seed}.${i}`, labels, pick, expect: pick['text.fill'] === 'inherit' ? { color: from[1], from: from[0], font: pick['section.font'] } : { font: pick['section.font'] }, ...NEST.compose(pick), without: used.map(([axis, off]) => ({ part: axis, noop: noop[axis] || null, ...NEST.compose({ ...pick, [axis]: off }) })) };
  });
}
// ── RULE MAP step 3d — STATES, EFFECTS, TRANSITIONS at every level, both ways, WCAG first. A tree (section → card → button →
// words) carries a scoped <style>: the card's hover (and whether it DRIVES its button and words — the cascade down), the
// button's hover / press / focus ring, the words' hover, one transition timing for all, and a reduced-motion block. The
// button is a real link so the keyboard reaches it.
const STATES = {
  axes: {
    'card.hover': { off: null, lift: 'lift', glow: 'glow', tint: 'tint', 'overlay fades in': 'overlay' }, 'card.drives': { no: false, yes: true },
    // step 4 + 5 — the gap check: a spotlight / a shadow that FOLLOW the pointer (91 pens set a custom property from JS), and
    // scroll-linked states (an overlay that darkens, an edge that reshapes as the section scrolls)
    'card.pointer': { off: null, spotlight: 'spotlight', 'shadow follows': 'shadow' }, 'section.scroll': { off: null, 'overlay darkens': 'dim', 'edge reshapes': 'edge' },
    'button.hover': { off: null, darken: 'darken', 'gradient swap': 'swap', grow: 'grow' }, 'button.press': { off: false, shrink: true },
    'button.focus': { ring: 'ring', 'ring + offset': 'offset' }, 'text.hover': { off: null, underline: 'underline', colour: 'colour' },
    timing: { 'fast 150ms': '150ms ease-out', 'slow 320ms': '320ms ease-in-out', spring: '280ms cubic-bezier(.34,1.56,.64,1)' },
  },
  compose: (p, id) => {
    const T = `[data-tree="${id}"]`;
    const css = [
      `${T} [data-level="card"] { position: relative; padding: 1.25rem 1.5rem; border-radius: .75rem; background: oklch(97% .01 260); } ${T} [data-level="button"] { position: relative; z-index: 1; display: inline-block; padding: .5rem 1rem; border-radius: 999px; background: oklch(45% .18 290); color: #fff; text-decoration: none; } ${T} [data-level="text"] { font-weight: 800; font-size: 1.2rem; }`,
      `${T} [data-level] { transition: transform ${p.timing}, box-shadow ${p.timing}, background ${p.timing}, filter ${p.timing}, color ${p.timing}, outline-offset ${p.timing}; }`,
      p['card.hover'] === 'lift' ? `${T} [data-level="card"]:hover { transform: translateY(-.375rem); box-shadow: 0 1rem 1.75rem oklch(10% .05 260 / .45); }` : '',
      p['card.hover'] === 'glow' ? `${T} [data-level="card"]:hover { box-shadow: 0 0 1.5rem oklch(80% .18 300 / .9); }` : '',
      p['card.hover'] === 'tint' ? `${T} [data-level="card"]:hover { background: oklch(88% .08 200); }` : '',
      p['card.hover'] === 'overlay' ? `${T} [data-level="card"]::after { content: ''; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(transparent 20%, oklch(25% .12 290 / .65)); opacity: 0; transition: opacity ${p.timing}; pointer-events: none; } ${T} [data-level="card"]:hover::after { opacity: 1; }` : '',
      // the pointer: after the hover looks, so a card that follows the pointer keeps doing so while hovered
      p['card.pointer'] === 'spotlight' ? `${T} [data-level="card"]:hover { background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), oklch(100% 0 0 / .95), transparent 4rem), oklch(86% .06 260); }` : '',
      p['card.pointer'] === 'shadow' ? `${T} [data-level="card"]:hover { box-shadow: calc(var(--dx, 0) * -.08rem) calc(var(--dy, 0) * -.08rem) 1.25rem oklch(10% .05 260 / .55); }` : '',
      // scroll-linked: the section is sticky inside a scroller, its overlay / edge driven by the scroll position
      p['section.scroll'] === 'dim' ? `${T} [data-level="section"]::before { content: ''; position: absolute; inset: 0; background: oklch(10% .05 260); opacity: 0; animation: r2dim linear both; animation-timeline: scroll(nearest block); pointer-events: none; } @keyframes r2dim { to { opacity: .65; } }` : '',
      p['section.scroll'] === 'edge' ? `${T} [data-level="section"] { background: oklch(72% .17 40); animation: r2edge linear both; animation-timeline: scroll(nearest block); } @keyframes r2edge { from { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); } to { clip-path: polygon(0 0, 100% 0, 100% 70%, 0 100%); } }` : '',
      // a state DRIVEN from above carries no specificity (:where) — a level's OWN state always beats it (the cascade clash the proof found)
      p['card.drives'] ? `${T} :where([data-level="card"]:hover) [data-level="button"] { filter: brightness(1.25) saturate(1.2); } ${T} :where([data-level="card"]:hover) [data-level="text"] { letter-spacing: .06em; }` : '',
      p['button.hover'] === 'darken' ? `${T} [data-level="button"]:hover { filter: brightness(.7); }` : '',
      p['button.hover'] === 'swap' ? `${T} [data-level="button"]:hover { background: linear-gradient(90deg in oklch, oklch(65% .18 20), oklch(55% .2 300)); }` : '',
      p['button.hover'] === 'grow' ? `${T} [data-level="button"]:hover { transform: scale(1.12); }` : '',
      p['button.press'] ? `${T} [data-level="button"]:active { transform: scale(.92); }` : '',
      // WCAG 2.4.7: focus ALWAYS visible — 3px, high contrast, never removed
      `${T} [data-level="button"]:focus-visible { outline: 3px solid oklch(20% .1 260); outline-offset: ${p['button.focus'] === 'offset' ? '4px' : '0px'}; box-shadow: 0 0 0 6px oklch(98% 0 0); }`,
      p['text.hover'] === 'underline' ? `${T} [data-level="text"]:hover { text-decoration: underline 3px; }` : '',
      p['text.hover'] === 'colour' ? `${T} [data-level="text"]:hover { color: oklch(85% .17 90); }` : '',
      // WCAG 2.3.3: a reader who asks for less motion gets none
      `@media (prefers-reduced-motion: reduce) { ${T} [data-level], ${T} [data-level]::before, ${T} [data-level]::after { transition-duration: 0s !important; animation: none !important; } }`,
    ].filter(Boolean).join('\n');
    const card = '<div data-level="card">' /* base looks in the stylesheet, never inline (R2-22) */
      + '<a href="#" data-level="button">'
      + '<span data-level="text">Apply now</span></a></div>';
    // the pointer → custom properties (what 91 pens do): --x / --y for a spotlight, --dx / --dy (−10…10) for a shadow
    const follow = p['card.pointer'] ? `<script>(() => { const c = document.querySelector('[data-tree="${id}"] [data-level="card"]'); c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; c.style.setProperty('--x', x + 'px'); c.style.setProperty('--y', y + 'px'); c.style.setProperty('--dx', (x / r.width * 20 - 10).toFixed(1)); c.style.setProperty('--dy', (y / r.height * 20 - 10).toFixed(1)); }); })();</script>` : '';
    const inner = p['section.scroll'] ? `<div style="position:relative;height:250%"><div data-level="section" style="position:sticky;top:0;height:40%;display:grid;place-items:center">${card}</div></div>` : card;
    const html = `<style>${css}</style><div data-tree="${id}" style="position:absolute;inset:0;background:${BRAND};${p['section.scroll'] ? 'overflow-y:auto;scrollbar-width:none' : 'display:grid;place-items:center'}">${inner}</div>${follow}`; // R2-30: a moving scrollbar thumb passed the SCROLL check on its own
    return { css: 'padding: 0;', html };
  },
};
function stateTrees(n, seed = 1) {
  const r = seeded(seed * 15485863 + 3);
  return Array.from({ length: n }, (_, i) => {
    const labels = {}; const pick = {};
    for (const [axis, vs] of Object.entries(STATES.axes)) { const ks = Object.keys(vs); const k = ks[Math.floor(r() * ks.length)]; labels[axis] = k; pick[axis] = vs[k]; }
    return { id: `state${i}`, labels, pick, ...STATES.compose(pick, `state${i}`) };
  });
}
module.exports = { STATES, stateTrees, FAMILIES, specimens, combos, page, SHAPES, STACK, stacks, NEST, nests };
