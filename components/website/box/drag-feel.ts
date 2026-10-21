/**
 * DRAG THAT FEELS LIKE PICKING IT UP — BATCH LE-15n (tests/features/components/website/drag-feel.feature; research
 * docs/web-anatomy/drag-and-drop/README.md; every number in config/layout.json `drag`, signed by the user 2026-10-21).
 *
 * The pieces BoxCanvas moves by writing to the page — never a React render while a block is dragged:
 *   · the LIFTED COPY — the block in its own shape, no larger than `previewMaxPx`, raised, following the pointer;
 *   · the NEIGHBOURS SLIDING apart in its own stack or row, so its new place opens before it lands;
 *   · the GLIDE — on release every block that moved slides from where it was seen to where it is (FLIP), or home on a cancel.
 * Only `transform` and `opacity` are animated (they never re-lay the page out), and with "reduce motion" nothing slides.
 */

/** How much the lifted copy is shrunk so its larger side is no more than `max` (never enlarged). */
export function previewScale(w: number, h: number, max: number): number {
  const big = Math.max(w, h);
  return big > max ? max / big : 1;
}

/**
 * Where each block of a single line (a stack's column, or a row on one line) moves when the one at `from` is put before the
 * one at `to` (`to` counts the blocks as they are now, the moved one included — as the drop slot does). Given each block's
 * start and end along the line, it returns how far each slides — the moved one to its new place, the ones it passes by its
 * size — so the line shows its new order before anything is written. The gap is the line's own (the first one between them).
 */
export function slideOffsets(starts: number[], ends: number[], from: number, to: number): number[] {
  const n = starts.length, out = new Array<number>(n).fill(0);
  if (from < 0 || from >= n) return out;
  const final = to > from ? to - 1 : to;
  if (final === from) return out;
  const gap = n > 1 ? Math.max(0, starts[1] - ends[0]) : 0;
  const order = Array.from({ length: n }, (_, i) => i).filter((i) => i !== from);
  order.splice(final, 0, from);
  let at = starts[0];
  for (const i of order) { out[i] = at - starts[i]; at += ends[i] - starts[i] + gap; }
  return out;
}

/** True when the reader asked for less motion — then nothing slides or glides; it is placed at once. */
export const lessMotion = (): boolean => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * THE LIFTED COPY. A clone of the block, its ids taken off (so nothing that looks blocks up by id finds it, and the drop never
 * lands on it), drawn at the block's own layout size inside `host` — the page, so it keeps the page's fonts and colours —
 * and shrunk to `scale` from its top-left corner. Pointer events off: the drop is worked out under it.
 */
export function makeLiftedCopy(src: HTMLElement, host: HTMLElement, scale: number, z: number): HTMLElement {
  const copy = src.cloneNode(true) as HTMLElement;
  for (const el of [copy, ...Array.from(copy.querySelectorAll<HTMLElement>("*"))]) {
    el.removeAttribute("data-box-id"); el.removeAttribute("id"); el.removeAttribute("contenteditable"); el.removeAttribute("tabindex");
  }
  copy.setAttribute("aria-hidden", "true");
  copy.setAttribute("data-drag-copy", "");
  Object.assign(copy.style, {
    position: "absolute", left: "0px", top: "0px", margin: "0px", width: `${src.offsetWidth}px`, height: `${src.offsetHeight}px`,
    pointerEvents: "none", transformOrigin: "0 0", willChange: "transform", zIndex: String(z), opacity: "0.95", // under the chip that names the place
    boxShadow: "0 1.25rem 2.5rem -0.75rem rgb(0 0 0 / 0.35), 0 0.25rem 0.75rem rgb(0 0 0 / 0.15)", transition: "none",
  });
  copy.dataset.scale = String(scale);
  // a block with no background of its own (words) would be lifted as bare words over the page: it takes what it stood on
  const clear = (c: string) => !c || c === "transparent" || c === "rgba(0, 0, 0, 0)";
  if (clear(getComputedStyle(src).backgroundColor)) {
    let on = "white";
    for (let n: Element | null = src.parentElement; n; n = n.parentElement) { const c = getComputedStyle(n).backgroundColor; if (!clear(c)) { on = c; break; } }
    copy.style.backgroundColor = on;
  }
  host.appendChild(copy);
  return copy;
}

/** Puts the copy's top-left corner at a SCREEN point, whatever its holder's zoom and scroll. */
export function placeCopy(copy: HTMLElement, sx: number, sy: number): void {
  const op = (copy.offsetParent as HTMLElement | null) ?? document.body, r = op.getBoundingClientRect();
  const z = op.offsetWidth ? r.width / op.offsetWidth : 1, s = Number(copy.dataset.scale) || 1;
  copy.style.transform = `translate3d(${(sx - r.left) / z + op.scrollLeft - op.clientLeft}px, ${(sy - r.top) / z + op.scrollTop - op.clientTop}px, 0) scale(${s})`;
}

/** Slides each element by its offset along the line (screen px, turned into the page's own px by `zoom`), or back to 0. */
export function slide(els: HTMLElement[], offsets: number[], axis: "x" | "y", zoom: number, ms: number, ease: string): void {
  const still = lessMotion();
  els.forEach((el, i) => {
    const d = (offsets[i] ?? 0) / (zoom || 1);
    el.style.transition = still ? "none" : `transform ${ms}ms ${ease}`;
    el.style.transform = d ? `translate${axis.toUpperCase()}(${d}px)` : "";
  });
}

/** Takes every slide off at once (no transition) — before the page is rewritten, so the glide starts from what was seen. */
export function unslide(els: HTMLElement[]): void {
  for (const el of els) { el.style.transition = "none"; el.style.transform = ""; }
}

/**
 * THE GLIDE (FLIP). `seen` holds where each block was on screen at the release; called once the page has been rewritten, each
 * block found again by its id is put back where it was seen (no transition) and then let go to its new place over `ms`.
 * `scaleFrom` is the lifted copy's scale for the block that was carried, so it grows back to its size as it lands.
 */
export function glide(seen: Map<string, DOMRect>, ms: number, ease: string, carried?: { id: string; scale: number }): void {
  if (lessMotion()) return;
  const moving: HTMLElement[] = [];
  const carriedEl = carried ? document.querySelector<HTMLElement>(`[data-box-id="${CSS.escape(carried.id)}"]`) : null;
  for (const [id, was] of seen) {
    const el = document.querySelector<HTMLElement>(`[data-box-id="${CSS.escape(id)}"]`);
    if (!el || (carriedEl && el !== carriedEl && el.contains(carriedEl))) continue; // what holds the carried block: it alone glides

    const now = el.getBoundingClientRect(), op = el.offsetWidth ? now.width / el.offsetWidth : 1;
    const dx = (was.left - now.left) / op, dy = (was.top - now.top) / op;
    const s = carried && carried.id === id ? carried.scale : 1;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && s === 1) continue;
    el.style.transition = "none"; el.style.transformOrigin = "0 0";
    el.style.transform = `translate(${dx}px, ${dy}px)${s !== 1 ? ` scale(${s})` : ""}`;
    moving.push(el);
  }
  if (!moving.length) return;
  void moving[0].offsetWidth; // the start is drawn before the move begins
  for (const el of moving) {
    el.style.transition = `transform ${ms}ms ${ease}`; el.style.transform = "";
    const done = () => { el.style.transition = ""; el.style.transformOrigin = ""; el.removeEventListener("transitionend", done); };
    el.addEventListener("transitionend", done);
    setTimeout(done, ms + 100);
  }
}

/** A cancel: the copy flies back to the block's own place, then goes. */
export function flyHome(copy: HTMLElement, home: DOMRect, ms: number, ease: string): void {
  if (lessMotion()) { copy.remove(); return; }
  copy.style.transition = `transform ${ms}ms ${ease}, opacity ${ms}ms ${ease}`;
  copy.dataset.scale = "1";
  placeCopy(copy, home.left, home.top);
  copy.style.opacity = "0";
  setTimeout(() => copy.remove(), ms + 50);
}
