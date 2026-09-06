/**
 * Educo UI — the TWO STACKING LADDERS (Phase 2).
 *
 * A page and the editor that draws it are two different worlds sharing one screen, and until this module they
 * shared one range of z-index numbers as well. The audit that opened Phase 2 found the editor's own furniture
 * at `z-20` … `z-50` — resize handles at 30, the block toolbar at 40, the blocks panel at 50 — sitting in
 * exactly the range a page uses: the site nav at 30, a toast at 60, and a floating section at whatever number
 * the user's last "Bring to front" produced, which was unbounded.
 *
 * So this was not a tidiness problem. **A float brought to front enough times rendered ON TOP of the handles
 * that resize it and the toolbar that deletes it** — the controls for a block, covered by the block. There is
 * no way out of that state with the mouse, because the thing you need to click is underneath.
 *
 * THE RULE, and it is the whole module: the two ladders may never meet.
 *
 *   page   0 … 998        everything a visitor can see
 *   —— a gap nothing is allowed to occupy ——
 *   chrome 9000 …         everything only the editor sees
 *
 * The gap is deliberate and large. A near-miss ladder (page to 99, chrome from 100) fails the first time
 * someone types 150 into a z-index field; a thousand-fold gap fails only if someone is trying to break it, and
 * `clampPageZ` means even that cannot reach.
 *
 * WHY NAMED TIERS AND NOT NUMBERS. Every value below is a name for a *situation* — a thing that is pinned, a
 * thing that floats, a message that must be read. Numbers spread through a codebase drift the moment two
 * people pick one on the same afternoon; that is exactly how the interleave above happened. Nothing outside
 * this file should write a z-index literal.
 */

/**
 * The PAGE ladder — what a visitor sees. Gaps of ten leave room for a tier between two of these without
 * renumbering the ones around it.
 */
export const PAGE_Z = {
  /** Normal flow. Named so that "no z-index" is a choice rather than an omission. */
  base: 0,
  /**
   * A block lifted out of the flow onto its own layer — the builder's free-positioning mode.
   *
   * One, not ten, because that is what the stored data already says: "Bring to front" hands out 1, 2, 3 … and
   * every float on every saved page sits in that band. A tier that named a number the model does not use would
   * be a second ladder wearing this one's clothes.
   */
  raised: 1,
  /** Anything pinned while the page scrolls: the site nav, a sticky sidebar. */
  sticky: 30,
  /** A menu or panel the page itself opens, which must clear pinned furniture. */
  overlay: 100,
  /** A scrim dimming the page beneath a menu. */
  scrim: 150,
  /** A message that must be readable over everything else on the page. */
  toast: 200,
} as const;

/** No page value may reach this. One below the round number, so the boundary reads as deliberate. */
export const PAGE_Z_CEILING = 998;

/**
 * The CHROME ladder — editor furniture, which must clear ANY page content including a toast.
 *
 * The order is the order things sit on top of each other while editing, and it is not arbitrary: a drag ghost
 * has to clear the drop indicator it is being dragged towards, and the cursor veil during a resize has to
 * clear everything, or the pointer changes back the moment it crosses a handle.
 */
export const CHROME_Z = {
  /** The outline drawn around a component's items while its CRUD layer is open. */
  itemBox: 9100,
  /** That layer's own little toolbar, which must clear the outline. */
  itemBar: 9110,
  /** A selected block's resize handles. */
  handle: 9200,
  /** The floating toolbar above or below a selected block. */
  toolbar: 9300,
  /** The blocks palette and any docked editing panel. */
  panel: 9400,
  /** The marquee rectangle drawn while selecting several blocks. */
  marquee: 9600,
  /** Snap guides shown while free-dragging, above the marquee that may have started the selection. */
  snapGuide: 9620,
  /** Where a dragged block would land — above the guides that helped aim it. */
  dropZone: 9640,
  /** A dropdown opened from editor chrome — it must clear the chrome that opened it. */
  menu: 9700,
  /** The block following the cursor during a drag. */
  dragGhost: 9800,
  /** A full-window veil that holds one cursor for the whole gesture (resize, drag). Above everything. */
  veil: 9900,
} as const;

/** No chrome value may fall below this. */
export const CHROME_Z_FLOOR = 9000;

export type PageZTier = keyof typeof PAGE_Z;
export type ChromeZTier = keyof typeof CHROME_Z;

/**
 * Bring a user-set stacking order into the page ladder.
 *
 * "Bring to front" is `max + 1` over a block's floating siblings, which climbs without limit — twenty presses
 * on a page that already had a float at 900 is all it takes. Clamping here rather than at the control means
 * every path in (the control, a pasted node, an imported tree, a hand-edited store) lands inside the ladder,
 * and a caller cannot forget.
 *
 * A negative order is honest — "put this behind its siblings" — so the floor is the tier below `base` rather
 * than zero; it is still nowhere near the chrome ladder.
 */
export function clampPageZ(z: number | undefined, fallback: number = PAGE_Z.raised): number {
  if (typeof z !== "number" || !Number.isFinite(z)) return fallback;
  return Math.max(-PAGE_Z_CEILING, Math.min(PAGE_Z_CEILING, Math.trunc(z)));
}

/** True when a number would break the rule this module exists for. Used by the guards, and readable in a test name. */
export function laddersAreDisjoint(): boolean {
  const page = Object.values(PAGE_Z);
  const chrome = Object.values(CHROME_Z);
  return page.every((z) => z <= PAGE_Z_CEILING) && chrome.every((z) => z >= CHROME_Z_FLOOR) && PAGE_Z_CEILING < CHROME_Z_FLOOR;
}
