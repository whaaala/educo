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
};
const edgePolygon = (shape, depth, edge = 'bottom', invert = false) => {
  const f = SHAPES[shape]; const pts = [];
  for (let i = 0; i <= 60; i++) { const x = i / 60; let y = f(x); if (invert) y = 1 - y; pts.push([x * 100, y * depth]); }
  if (edge === 'bottom') return `polygon(0 0, 100% 0, ${pts.slice().reverse().map(([x, y]) => `${x.toFixed(2)}% calc(100% - ${y.toFixed(2)}%)`).join(', ')})`;
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(', ')}, 100% 100%, 0 100%)`;
};

const FAMILIES = {
  colour: {
    axes: {
      notation: { hex: '#3b82f6', rgb: 'rgb(59 130 246)', hsl: 'hsl(217 91% 60%)', hwb: 'hwb(217 23% 4%)', oklch: 'oklch(62% .19 260)', oklab: 'oklab(62% -.04 -.18)', lab: 'lab(54% 9 -66)', lch: 'lch(54% 67 278)', p3: 'color(display-p3 .27 .5 .95)', named: 'royalblue' },
      alpha: { '100%': 1, '75%': .75, '50%': .5, '25%': .25 }, // labels with a unit: whole-number keys are REORDERED by JavaScript (the base became 25%)
      mix: { none: null, 'with white 40%': 'white 40%', 'with black 40%': 'black 40%', 'with accent 50%': `${ACCENT} 50%`, 'with accent, longer hue': `${ACCENT} 50%|longer` },
      relative: { none: null, lighter: 'l+.15', darker: 'l-.2', muted: 'c*.3', 'hue +120': 'h+120' },
    },
    sameByDesign: ['notation'], // one colour written ten ways looks the same — that is the point of the axis
    compose: ({ notation, alpha, mix, relative }) => {
      let c = notation;
      if (mix) { const [m, hue] = mix.split('|'); c = `color-mix(in oklch${hue ? ' ' + hue + ' hue' : ''}, ${c}, ${m})`; }
      if (relative || alpha < 1) {
        const [l, ch, h] = ['l', 'c', 'h'].map((k) => relative && relative.startsWith(k) ? `calc(${k} ${relative.slice(1, 2)} ${relative.slice(2)})` : k);
        c = `oklch(from ${c} ${l} ${ch} ${h}${alpha < 1 ? ` / ${alpha}` : ''})`;
      }
      return { css: `background: ${c};` };
    },
  },
  gradient: {
    axes: {
      type: { linear: 'linear', radial: 'radial', conic: 'conic' },
      repeating: { off: false, on: true },
      direction: { '90deg': '90deg', '135deg': '135deg', 'to top': 'to top', '200deg': '200deg' },
      shape: { 'circle closest-side': 'circle closest-side', 'ellipse farthest-corner': 'ellipse farthest-corner', 'circle 120px': 'circle 120px' },
      position: { centre: '50% 50%', 'top left': '20% 15%', 'bottom right': '85% 80%' },
      stops: { two: `${BRAND}, ${ACCENT}`, three: `${BRAND}, white, ${ACCENT}`, 'hard edge': `${BRAND} 0 50%, ${ACCENT} 50% 100%`, 'with alpha': `${BRAND}, transparent`, hint: `${BRAND}, 20%, ${ACCENT}` },
      space: { srgb: 'srgb', oklch: 'oklch', 'oklch longer': 'oklch longer hue' },
      paints: { background: 'background', text: 'text', border: 'border' },
      motion: { static: false, turning: true },
    },
    // an axis that only applies when another has a value: its specimens hold that value (shape and position are radial's)
    when: { shape: { type: 'radial' }, position: { type: 'radial' } },
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
      if (p.paints === 'text') return { css: 'background: #fff;', html: `<span class="words big" style="background: ${g}; -webkit-background-clip: text; background-clip: text; color: transparent; ${anim}">Gradient</span>` }; // on the WORDS: `background-clip: text` does not reach a positioned child's text (R2-9)
      if (p.paints === 'border') return { css: `border: .5rem solid transparent; background: linear-gradient(#fff, #fff) padding-box, ${g} border-box; ${anim}` };
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
    },
    base: { size: '50%' }, // a tile smaller than the stage, so repeat / space / round can show
    compose: (p) => ({ css: `border: .5rem dashed #0003; padding: 1rem; background: ${PHOTO} ${p.position} / ${p.size} ${p.repeat} ${p.attachment} ${p.origin}, ${p.base};` }),
  },
  overlay: {
    axes: {
      layer: { colour: 'colour', scrim: 'scrim', pattern: 'pattern', blur: 'blur' },
      opacity: { '20': .2, '45': .45, '70': .7 },
      direction: { 'to bottom': 'to bottom', 'to top': 'to top', 'to right': 'to right', vignette: 'radial' },
      blend: { normal: 'normal', multiply: 'multiply', screen: 'screen', overlay: 'overlay', 'soft-light': 'soft-light', color: 'color' },
      scope: { band: 'band', words: 'words' },
    },
    when: { direction: { layer: 'scrim' } },
    compose: (p) => {
      const tint = `oklch(25% .08 260 / ${p.opacity})`;
      const layer = p.layer === 'colour' ? `linear-gradient(${tint}, ${tint})`
        : p.layer === 'scrim' ? (p.direction === 'radial' ? `radial-gradient(transparent 30%, ${tint})` : `linear-gradient(${p.direction}, transparent, ${tint})`)
        : p.layer === 'pattern' ? `repeating-linear-gradient(45deg, oklch(100% 0 0 / ${p.opacity}) 0 .25rem, transparent .25rem .75rem)` : null;
      if (p.layer === 'blur') return { css: `background: ${PHOTO} center / cover;`, html: `<div class="glass" style="${p.scope === 'words' ? 'inset:auto 1rem 1rem 1rem' : 'inset:0'}; position:absolute; backdrop-filter: blur(${Math.round(p.opacity * 20)}px); background: oklch(100% 0 0 / .1)"></div><span class="words light">Over the photo</span>` };
      if (p.scope === 'words') return { css: `background: ${PHOTO} center / cover;`, html: `<span class="words light" style="padding:.5rem;background:${layer};background-blend-mode:${p.blend}">Over the photo</span>` };
      return { css: `background: ${layer}, ${PHOTO} center / cover; background-blend-mode: ${p.blend}, normal;`, html: '<span class="words light">Over the photo</span>' };
    },
  },
  shadow: {
    axes: {
      kind: { box: 'box', drop: 'drop', text: 'text' },
      x: { '0': 0, '0.25rem': .25, '-0.5rem': -.5, '1rem': 1 },
      y: { '0.125rem': .125, '0.5rem': .5, '1.5rem': 1.5, '-0.25rem': -.25 },
      blur: { hard: 0, soft: .75, wide: 2.5 },
      spread: { '0': 0, negative: -.25, ring: .2 },
      colour: { black: 'oklch(0% 0 0 / .25)', tinted: 'oklch(45% .12 260 / .35)', glow: `oklch(70% .2 300 / .8)` },
      inset: { out: false, in: true },
      layers: { '1 layer': 1, '2 layers': 2, '3 layers': 3 },
    },
    base: { x: '0.25rem', y: '0.5rem', blur: 'soft', colour: 'tinted' }, // a shadow you can SEE, so every other value's change shows
    compose: (p) => {
      const one = (k) => `${p.inset && p.kind === 'box' ? 'inset ' : ''}${p.x * k}rem ${p.y * k}rem ${p.blur * k}rem${p.kind === 'box' ? ` ${p.spread}rem` : ''} ${p.colour}`;
      const list = Array.from({ length: p.layers }, (_, i) => one(i + 1));
      if (p.kind === 'text') return { css: `text-shadow: ${list.join(', ')};`, html: '<span class="words big">Shadow</span>' };
      if (p.kind === 'drop') return { css: `filter: ${list.map((l) => `drop-shadow(${l})`).join(' ')}; background: transparent;`, html: `<div style="width:6rem;height:6rem;background:${BRAND};clip-path:polygon(50% 0,100% 100%,0 100%)"></div>` };
      // on a CARD inside the stage: a shadow on the stage itself falls outside the picture (R2-7)
      return { css: 'background: #eef2f7;', html: `<div style="width:8rem;height:5rem;background:#fff;border-radius:.5rem;box-shadow:${list.join(', ')}"></div>` };
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
      blend: { normal: 'normal', multiply: 'multiply', difference: 'difference', 'color-dodge': 'color-dodge', luminosity: 'luminosity' },
    },
    compose: (p) => {
      const fill = p.fill < 0 ? `oklch(15% 0 0 / ${-p.fill})` : `oklch(100% 0 0 / ${p.fill})`;
      const edge = p.edge === 'highlight' ? 'box-shadow: inset 0 1px 0 oklch(100% 0 0 / .6);' : p.edge === 'border' ? 'border: 1px solid oklch(100% 0 0 / .4);' : '';
      const g = `position:absolute; inset:1rem; border-radius:.75rem; backdrop-filter: blur(${p.blur}px) saturate(${p.saturate}); -webkit-backdrop-filter: blur(${p.blur}px) saturate(${p.saturate}); background: ${p.grain ? noise() + ' 0 0 / 120px, ' : ''}${fill}; background-blend-mode: ${p.grain ? 'overlay, normal' : 'normal'}; ${edge}`;
      return { css: `background: ${PHOTO} center / cover; filter: ${p.filter};`, html: `<div style="${g}"></div><span class="words" style="mix-blend-mode:${p.blend}">Glass</span>` };
    },
  },
  texture: {
    axes: {
      source: { noise: 'noise', dots: 'dots', stripes: 'stripes', grid: 'grid', photo: 'photo' },
      noiseType: { fractalNoise: 'fractalNoise', turbulence: 'turbulence' },
      grain: { fine: 1.4, medium: .8, coarse: .3 },
      detail: { '1': 1, '3': 3, '6': 6 },
      strength: { '8%': .08, '20%': .2, '45%': .45 },
      blend: { normal: 'normal', multiply: 'multiply', screen: 'screen', overlay: 'overlay', 'soft-light': 'soft-light' },
      tile: { '0.5rem': .5, '1.5rem': 1.5, '6rem': 6 },
      over: { colour: BRAND, photo: 'photo' },
      ink: { light: 'light', dark: 'dark' },
    },
    // ink colours a DRAWN pattern (dots / stripes / grid); noise and a photo have their own
    when: { ink: { source: 'dots' }, noiseType: { source: 'noise' }, grain: { source: 'noise' }, detail: { source: 'noise' } },
    base: { source: 'dots', strength: '45%', tile: '1.5rem' },
    // combinations that change NOTHING by nature — the builder should steer away from them, the proof names them
    noop: (p) => (p.source !== 'noise' && p.source !== 'photo' && ((p.ink === 'light' && p.blend === 'multiply') || (p.ink === 'dark' && p.blend === 'screen'))) ? `${p.ink} ink × ${p.blend} draws nothing` : null,
    compose: (p) => {
      const ink = `oklch(${p.ink === 'dark' ? '0%' : '100%'} 0 0 / ${p.strength})`;
      const layer = p.source === 'noise' ? `${noise({ type: p.noiseType, freq: p.grain, oct: p.detail })} 0 0 / ${p.tile * 4}rem`
        : p.source === 'dots' ? `radial-gradient(${ink} 25%, transparent 26%) 0 0 / ${p.tile}rem ${p.tile}rem`
        : p.source === 'stripes' ? `repeating-linear-gradient(45deg, ${ink} 0 ${p.tile / 4}rem, transparent ${p.tile / 4}rem ${p.tile / 2}rem)`
        : p.source === 'grid' ? `linear-gradient(${ink} 1px, transparent 1px) 0 0 / ${p.tile}rem ${p.tile}rem, linear-gradient(90deg, ${ink} 1px, transparent 1px) 0 0 / ${p.tile}rem ${p.tile}rem`
        : `${PHOTO} 0 0 / ${p.tile * 4}rem repeat`;
      const below = p.over === 'photo' ? `${PHOTO} center / cover` : p.over;
      const n = p.source === 'grid' ? 2 : 1;
      return { css: `background: ${layer}, ${below}; background-blend-mode: ${Array(n).fill(p.blend).join(', ')}, normal;${p.source === 'noise' ? ` opacity: ${1 - p.strength / 3};` : ''}` };
    },
  },
  shape: {
    axes: {
      shape: Object.fromEntries(Object.keys(SHAPES).map((k) => [k, k])),
      method: { 'clip-path': 'clip', mask: 'mask', 'svg divider': 'svg' },
      edge: { bottom: 'bottom', top: 'top' },
      depth: { '8%': 8, '18%': 18, '35%': 35 },
      invert: { no: false, yes: true },
      layers: { '1': 1, '2': 2, '3': 3 },
      fill: { cut: 'cut', 'next band': 'next' },
      overlap: { none: 0, '2rem': 2 },
      motion: { static: false, drifting: true },
    },
    sameByDesign: ['method', 'motion'], // three ways to draw ONE edge must look the same; motion is proven by frames
    noop: (p) => (p.overlap && p.edge === 'bottom' && p.overlap >= (p.depth / 100) * 6) ? `a ${p.overlap}rem overlap covers a ${p.depth}% edge — the shape (and its motion) is hidden` : null,
    compose: (p) => {
      const poly = edgePolygon(p.shape, p.depth, p.edge, p.invert);
      const top = p.edge === 'top';
      const svgPath = (() => { const f = SHAPES[p.shape]; let d = 'M0,0 '; for (let i = 0; i <= 60; i++) { const x = i / 60; let y = f(x); if (p.invert) y = 1 - y; d += `L${(x * 100).toFixed(2)},${(y * 100).toFixed(2)} `; } return d + 'L100,0 Z'; })();
      // A REAL mask: the edge strip is an SVG of the shape (opaque above the line), the rest of the band a solid mask
      const maskPath = (() => { const f = SHAPES[p.shape]; let d = 'M0,0 '; for (let k = 0; k <= 60; k++) { const x = k / 60; let y = f(x); if (p.invert) y = 1 - y; d += `L${(x * 100).toFixed(2)},${((1 - y) * 100).toFixed(2)} `; } return d + 'L100,0 Z'; })(); // R2-11: 1 − f, as the clip-path cuts
      const maskSvg = `url('data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${maskPath}" transform="${top ? 'scale(1,-1) translate(0,-100)' : ''}" fill="#000"/></svg>`)}')`;
      const strip = `${maskSvg} ${top ? 'top' : 'bottom'} / 100% ${p.depth}% no-repeat, linear-gradient(#000,#000) ${top ? 'bottom' : 'top'} / 100% ${100 - p.depth}% no-repeat`;
      const shapeCss = p.method === 'clip' ? `clip-path: ${poly};`
        : p.method === 'mask' ? `-webkit-mask: ${strip}; mask: ${strip};`
        : '';
      // R2-10: extra layers sit BEHIND the band, a little deeper, so they peek out under its edge (inside the band they vanished)
      const layers = Array.from({ length: p.layers - 1 }, (_, k) => `<div style="position:absolute;left:0;right:0;${top ? 'bottom:0' : 'top:0'};height:calc(60% + ${(k + 1) * .6}rem);background:${BRAND};opacity:${.45 - k * .15};${`clip-path:${edgePolygon(p.shape, Math.min(60, p.depth + 12 * (k + 1)), p.edge, p.invert)}`};transform:translateX(${(k + 1) * 4}%)"></div>`).join('');
      const svg = p.method === 'svg' ? `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;left:0;${top ? 'top:0;transform:scaleY(-1)' : 'bottom:0'};width:100%;height:${p.depth}%;${p.motion ? 'animation:r2drift 1.2s ease-in-out infinite alternate' : ''}"><path d="${svgPath}" transform="scale(1,-1) translate(0,-100)" fill="${p.fill === 'next' ? ACCENT : '#fff'}"/></svg>` : '';
      // full WIDTH bands in a column that fills the stage (the stage centres its content: a band with no width drew nothing, R2-4)
      const band = `<div class="band" style="position:relative;flex:0 0 60%;width:100%;background:${BRAND};${shapeCss}${p.motion && p.method !== 'svg' ? 'animation:r2drift 1.2s ease-in-out infinite alternate;' : ''}">${svg}</div>`;
      const next = `<div class="band" style="position:relative;flex:1 0 40%;width:100%;background:${ACCENT};margin-${top ? 'bottom' : 'top'}:-${p.overlap}rem;z-index:${p.overlap ? 1 : 0};box-shadow:${p.overlap ? '0 -.5rem 1rem #0004' : 'none'}"></div>`;
      return { css: `background: ${p.fill === 'next' ? ACCENT : '#fff'}; padding: 0;`, html: `<div style="position:absolute;inset:0;display:flex;flex-direction:column">${layers}${top ? next + band : band + next}</div>` };
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
/** A page of demos — each a 15rem × 10rem stage (the specimen sheet and the proof use the same page). */
function page(title, demos) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>
@property --a { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
@keyframes r2spin { to { --a: 360deg; } } @keyframes r2drift { to { transform: translateX(-4%); } } @keyframes r2pan { to { background-position: 100% 100%; } }
body { font: 16px/1.4 system-ui, sans-serif; margin: 0; padding: 1rem; background: #f8fafc; color: #0f172a; display: grid; grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr)); gap: 1rem; }
figure { margin: 0; } figcaption { font-size: .75rem; color: #475569; margin-top: .25rem; word-break: break-word; }
.stage { position: relative; height: 10rem; overflow: hidden; display: grid; place-items: center; border-radius: .25rem; outline: 1px solid #e2e8f0; }
.words { font-weight: 800; font-size: 1.75rem; position: relative; } .big { font-size: 3rem; } .light { color: #fff; }
</style></head><body>${demos.map((d, i) => `<figure><div class="stage" data-demo="${i}" data-id="${d.id}" style="${d.css.replace(/"/g, '&quot;')}">${d.html || ''}</div><figcaption>${d.id}${d.labels ? ' · ' + Object.entries(d.labels).map(([a, v]) => `${a}: ${v}`).join(' · ') : ''}</figcaption></figure>`).join('\n')}</body></html>`;
}
// ── RULE MAP step 3, ACROSS FAMILIES: every family STACKED on one block (a hero band + a glass card + the next band) ──
// Each ingredient can be left OUT (`omit`), so a clash is found by ablation: if removing an ingredient changes nothing you
// can see, the others hid or broke it. Values come from the families' own axes, so the stack proves the same vocabulary.
const STACK = {
  axes: {
    base: { colour: 'colour', linear: 'linear', radial: 'radial', conic: 'conic' },
    photo: { off: false, on: true },
    overlay: { off: null, 'tint 40%': 'tint', 'scrim 60%': 'scrim', 'pattern 30%': 'pattern' },
    overlayBlend: { normal: 'normal', multiply: 'multiply', 'soft-light': 'soft-light', screen: 'screen' },
    texture: { off: null, grain: 'grain', dots: 'dots', stripes: 'stripes' },
    edge: { off: null, wave: 'wave', slope: 'slope', curve: 'curve', zigzag: 'zigzag', torn: 'torn' },
    edgeMethod: { 'clip-path': 'clip', mask: 'mask' },
    bandShadow: { off: false, 'on the wrapper': 'wrapper', 'on the band': 'band' },
    card: { off: false, glass: 'glass', solid: 'solid' },
    cardBlur: { '6px': 6, '16px': 16 },
    cardShadow: { off: null, soft: 'soft', glow: 'glow', hard: 'hard' },
    heading: { solid: 'solid', gradient: 'gradient' },
  },
  // the ingredients an ablation can take out, and the axis value that removes each
  parts: { photo: ['photo', false], overlay: ['overlay', null], texture: ['texture', null], edge: ['edge', null], bandShadow: ['bandShadow', false], card: ['card', false], cardShadow: ['cardShadow', null], gradientHeading: ['heading', 'solid'], cardBlur: ['cardBlur', 0] },
  compose: (p) => {
    const base = p.base === 'colour' ? BRAND : p.base === 'linear' ? `linear-gradient(135deg in oklch, ${BRAND}, ${ACCENT})` : p.base === 'radial' ? `radial-gradient(ellipse at 30% 30% in oklch, ${ACCENT}, ${BRAND})` : `conic-gradient(from 45deg at 60% 40% in oklch, ${BRAND}, ${ACCENT}, ${BRAND})`;
    const ov = p.overlay === 'tint' ? 'linear-gradient(oklch(20% .05 260 / .4), oklch(20% .05 260 / .4))' : p.overlay === 'scrim' ? 'linear-gradient(to bottom, transparent, oklch(15% .04 260 / .6))' : p.overlay === 'pattern' ? 'repeating-linear-gradient(45deg, oklch(100% 0 0 / .3) 0 .25rem, transparent .25rem .75rem)' : null;
    const tx = p.texture === 'grain' ? `${noise({ freq: .9, oct: 3 })} 0 0 / 8rem` : p.texture === 'dots' ? 'radial-gradient(oklch(100% 0 0 / .35) 25%, transparent 26%) 0 0 / 1rem 1rem' : p.texture === 'stripes' ? 'repeating-linear-gradient(-45deg, oklch(0% 0 0 / .18) 0 .2rem, transparent .2rem .6rem)' : null;
    const layers = [tx, ov, p.photo ? `${PHOTO} center / cover` : null, base].filter(Boolean);
    const blends = [tx ? 'overlay' : null, ov ? p.overlayBlend : null, p.photo ? 'normal' : null, 'normal'].filter(Boolean);
    let edge = '';
    if (p.edge) {
      const poly = edgePolygon(p.edge, 14, 'bottom');
      const f = SHAPES[p.edge]; let d = 'M0,0 '; for (let k = 0; k <= 60; k++) { const x = k / 60; d += `L${(x * 100).toFixed(2)},${((1 - f(x)) * 100).toFixed(2)} `; } d += 'L100,0 Z';
      const m = `url('data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${d}" fill="#000"/></svg>`)}') bottom / 100% 14% no-repeat, linear-gradient(#000,#000) top / 100% 86% no-repeat`;
      edge = p.edgeMethod === 'clip' ? `clip-path: ${poly};` : `-webkit-mask: ${m}; mask: ${m};`;
    }
    const sh = 'oklch(10% .05 260 / .55)';
    // the band's shadow: on a WRAPPER (a drop-shadow follows the shaped edge) or on the band itself (a box-shadow the edge cuts — V-10)
    const bandSh = p.bandShadow === 'band' ? `box-shadow: 0 .75rem 1.25rem ${sh};` : '';
    const wrapSh = p.bandShadow === 'wrapper' ? `filter: drop-shadow(0 .75rem .75rem ${sh});` : '';
    const cardSh = p.cardShadow === 'soft' ? 'box-shadow: 0 .5rem 1.5rem oklch(10% .05 260 / .35);' : p.cardShadow === 'glow' ? 'box-shadow: 0 0 1.5rem oklch(80% .18 300 / .9);' : p.cardShadow === 'hard' ? 'box-shadow: .375rem .375rem 0 oklch(10% 0 0 / .8);' : '';
    const fill = p.card === 'glass' ? 'oklch(100% 0 0 / .14)' : 'oklch(98% .01 260)';
    const blur = p.card === 'glass' && p.cardBlur ? `backdrop-filter: blur(${p.cardBlur}px) saturate(1.4); -webkit-backdrop-filter: blur(${p.cardBlur}px) saturate(1.4);` : '';
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
    const used = Object.entries(STACK.parts).filter(([part, [axis, offValue]]) => pick[axis] !== offValue && !(part === 'cardBlur' && pick.card !== 'glass') && !(part === 'cardShadow' && !pick.card));
    return { id: `stack#${seed}.${i}`, labels, pick, ...STACK.compose(pick), without: used.map(([part, [axis, offValue]]) => ({ part, ...STACK.compose({ ...pick, [axis]: offValue }) })) };
  });
}
module.exports = { FAMILIES, specimens, combos, page, SHAPES, STACK, stacks };
