"use client";

/**
 * Box Builder — the recursive drag-and-drop website engine, now a MULTI-PAGE site. Each page is its own
 * BoxNode tree (stack of row bands; sections resize / float / multi-select / bulk-edit; every block carries
 * its own background, border, shadow, typography, radius; per-breakpoint responsive overrides). Pages,
 * navigation between them, a visitor Preview and HTML export turn the engine into an actual website.
 * The whole site persists to localStorage.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Smartphone, Tablet, Laptop, Monitor, Tv, Maximize2, RotateCw, Undo2, Redo2, Eye, X, Home, Trash2, Files, Download, Settings2, Palette, SlidersHorizontal, PanelRightClose, PanelRightOpen, AlertTriangle, ChevronUp, ChevronDown } from "lucide-react";
import { DEFAULT_THEME, resolveSiteTheme } from "@/lib/site-storage";
import { THEMES, type ThemeId } from "@/lib/theme-config";
import { RUNG_LABEL, RUNG_ORDER, RUNG_PX } from "@/lib/educo-ui/layout";
import {
  type BoxNode, type Breakpoint, createContainer, findBox, findParent, updateBox, insertBox, removeBox, duplicateBox, widthPct, makeRowBand, normalizeRowBands, groupBoxes, alignInRow, alignInRowOf, setSectionWidth, sectionWidthOf, pageBandOf,
  floatBox, unfloatBox, bringToFront, bringForward, sendBackward, sendToBack,
  resolveResponsive, updateBoxResponsive, clearOverride, hasOverride,
  gridColumns, retrackGrid, setColumnFraction, pinBlockedBy, fixedBlockedBy, blockedByLabel, pinScopeWords, isFloating,
} from "@/lib/box-model";
import { blockForKind } from "@/lib/box-presets";
import {
  type BoxSite, siteFromRoot, coerceSite, normalizeSite, setPageRoot, addPage, deletePage, renamePage, setHomePage, duplicatePage, emptyPageRoot, setSiteTheme,
} from "@/lib/box-site";
import { renderSitePage, renderSiteFiles, siteFileMap, downloadSite, fontFamiliesInSite } from "@/lib/box-export";
import { embedFontCss } from "@/lib/educo-ui/font-embed";
import { warmIcons, hasIcon } from "@/lib/educo-ui/icon-svg";
import BoxCanvas, { measureFloatGeom, measureFixedGeom, measureGroupGeom } from "@/components/website/box/BoxCanvas";
import BoxInspector from "@/components/website/box/BoxInspector";
import BulkInspector from "@/components/website/box/BulkInspector";
import BlocksPanel from "@/components/website/box/BlocksPanel";
import ThemeSwitcher from "@/components/shared/ThemeSwitcher";
import { ToolBtn, ToolDivider, Segmented } from "@/components/website/box/ui";
import PageLoader from "@/components/shared/PageLoader";
import CompactSelect from "@/components/shared/CompactSelect";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";

const KEY = "educo_box_site_v1"; // multi-page site
const LEGACY_KEY = "educo_box_demo_v9"; // old single-tree document (migrated on load)
const CLEANED_KEY = "educo_box_site_cleaned_v1"; // one-time flag: empty-section chrome already pruned
const PAGE_MIN_H = 160;
const ROW_GAP = 0;
const SECTION_TINTS = ["#eef2ff", "#faf5ff", "#ecfeff", "#fef2f2", "#f0fdf4", "#fffbeb"];

type Device = "mobile" | "tablet" | "laptop" | "desktop" | "wide" | "full";

/** Which layer each preview width edits. One table, so the chips and the model can never drift apart again. */
const DEVICE_RUNG: Record<Device, Breakpoint> = {
  mobile: "phone",
  tablet: "tabletPortrait",
  laptop: "tabletLandscape",
  desktop: "base",
  wide: "wide",
  full: "base",
};
/**
 * Each chip previews a width that sits INSIDE exactly one rung of the ladder, so switching chips shows you a
 * genuinely different layout rather than two chips that happen to render identically. The widths themselves are
 * representative rather than the rung's first pixel — nobody's screen is exactly 600px, and a preview pinned to
 * a boundary shows the one width where a rounding error is visible.
 *
 * Wide was 1536, which under this ladder is still the desktop rung — so it and Desktop drew the same page.
 */
const DEVICES: { id: Device; label: string; w: number | null; Icon: typeof Smartphone }[] = [
  { id: "mobile", label: "Mobile", w: 375, Icon: Smartphone }, // phone rung
  { id: "tablet", label: "Tablet", w: 768, Icon: Tablet }, // tablet portrait (600+)
  { id: "laptop", label: "Laptop", w: 1024, Icon: Laptop }, // tablet landscape (900+)
  { id: "desktop", label: "Desktop", w: 1280, Icon: Monitor }, // desktop (1200+)
  { id: "wide", label: "Wide", w: 1920, Icon: Tv }, // big desktop (1800+)
  { id: "full", label: "Full width", w: null, Icon: Maximize2 },
];

import { PREVIEW_PRESETS, PRESETS_FLAT } from "@/lib/preview-devices";

/** Zoom steps, matching what a browser's device mode offers. `fit` shrinks to whatever room there is. */
const ZOOMS = [
  { value: "fit", label: "Fit to window" },
  ...[0.5, 0.75, 1, 1.25, 1.5, 2].map((z) => ({ value: String(z), label: `${z * 100}%` })),
];

function pageRoot(rows: BoxNode[] = []): BoxNode {
  const r = createContainer("column", { layout: "flex", direction: "column", wrap: false, padding: 0, gap: 0, width: "fill", align: "stretch", justify: "start", baseFont: 10 });
  r.children = rows;
  return r;
}
const makeRow = (sections: BoxNode[] = []): BoxNode => makeRowBand(sections, ROW_GAP);
const makeSection = (bg: string): BoxNode => createContainer("column", { direction: "column", wrap: false, width: "100%", padding: 48, gap: 0, align: "stretch", justify: "start", background: bg });
const makeBlock = (bg: string, width: string): BoxNode => createContainer("column", { direction: "column", wrap: false, width, padding: 24, gap: 0, align: "stretch", justify: "start", background: bg });
// A fresh page starts BLANK — an empty, transparent canvas. Blocks you drop land standalone (no tinted band
// chrome around them); "Add a band" is how you deliberately create a tinted, padded layout container.
const starter = (): BoxNode => pageRoot([]);
const countSections = (root: BoxNode): number => (root.children ?? []).reduce((n, row) => n + (row.children?.length ?? 0), 0);

// One-time cleanup for pages saved by the OLD starter (which seeded 2 empty tinted sections). A root row is
// "empty chrome" when its whole subtree holds no real content — no element/component anywhere, just nested
// containers — so we drop it. Runs ONCE (guarded by a flag) so a section a user deliberately leaves empty
// from now on is never removed on reload.
const hasRealContent = (n: BoxNode): boolean => (n.type !== "container" ? true : (n.children ?? []).some(hasRealContent));
function pruneEmptyChrome(root: BoxNode): BoxNode {
  const rows = (root.children ?? []).filter(hasRealContent);
  return rows.length === (root.children?.length ?? 0) ? root : { ...root, children: rows };
}

type Hist = { present: BoxSite; past: BoxSite[]; future: BoxSite[] };
const HIST_CAP = 100;

/** Input types with no text in them, so the page's own undo keeps Ctrl+Z instead of the browser's. */
const NON_TEXT_INPUTS = new Set(["range", "checkbox", "radio", "color", "button", "submit", "file"]);

export default function BoxDemoPage() {
  const [hist, setHist] = useState<Hist | null>(null);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const pendingReveal = useRef<string | null>(null); // id of a just-added block to select + scroll into view
  // The block the BUILDER selected for you on add. Cleared the moment you select anything yourself — see
  // insertBlock for why a selection you did not make is not a place to insert into.
  const autoSelectedId = useRef<string | null>(null);
  // The container the last palette insert went into, so repeating the click repeats the result.
  const lastInsertParent = useRef<string | null>(null);
  /**
   * Selection the USER made — which, unlike one the builder made, IS a place to insert into.
   *
   * Declared up here with the other hooks, and not beside `revealBox` where it reads more naturally: this
   * component returns early while the site is loading (`PageLoader` below), so a `useCallback` placed after
   * that point is a CONDITIONAL hook. React then sees a different hook order once the site arrives and
   * throws "change in the order of Hooks". Every hook in this component has to sit above that return.
   */
  const selectByUser = useCallback((ids: string[]) => { autoSelectedId.current = null; lastInsertParent.current = null; setSelectedIds(ids); }, []);
  const [device, setDevice] = useState<Device>("full");
  const [preview, setPreview] = useState(false);
  const [pageMenu, setPageMenu] = useState(false); // page-settings popover open
  const [confirmDeletePage, setConfirmDeletePage] = useState(false); // delete-page confirmation modal
  const [inspectorOpen, setInspectorOpen] = useState(true); // right Inspector panel collapsed?

  const site = hist?.present ?? null;
  const activePage = site ? (site.pages.find((p) => p.id === activePageId) ?? site.pages[0]) : null;
  const root = activePage?.root ?? null;

  useEffect(() => {
    let loaded: BoxSite | null = null;
    try { const raw = localStorage.getItem(KEY); if (raw) loaded = coerceSite(JSON.parse(raw)); } catch { /* ignore */ }
    if (!loaded) { try { const legacy = localStorage.getItem(LEGACY_KEY); if (legacy) loaded = coerceSite(JSON.parse(legacy)); } catch { /* ignore */ } }
    // One-time: strip empty tinted sections left by the old starter from previously-saved sites.
    if (loaded) {
      try {
        if (!localStorage.getItem(CLEANED_KEY)) {
          loaded = { ...loaded, pages: loaded.pages.map((p) => ({ ...p, root: pruneEmptyChrome(p.root) })) };
          localStorage.setItem(CLEANED_KEY, "1");
        }
      } catch { /* ignore */ }
    }
    const s = normalizeSite(loaded ?? siteFromRoot(starter()), ROW_GAP);
    setHist({ present: s, past: [], future: [] });
    setActivePageId(s.homeId);
  }, []);
  /**
   * A SAVE THAT FAILS MUST SAY SO.
   *
   * This was `catch { /* ignore *\/ }`, and the thing it was ignoring is the browser's storage filling up.
   * An uploaded picture is kept as a `data:` URL inside the saved site and the store holds about 5MB —
   * measured, one 3000×2000 photograph off a phone is 1,260 KB, so the FIFTH one throws. Swallowed, the
   * page went on looking perfectly fine and every edit since the last good save was gone at the next
   * reload. Silent data loss is the worst failure this editor can have, and it was one line.
   *
   * `importPhoto` now downscales on the way in, which is what stops this happening at all. This is the
   * backstop for when it happens anyway — a page of very many pictures, or a browser with a smaller store.
   */
  const [saveError, setSaveError] = useState<string | null>(null);
  useEffect(() => {
    if (!site) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(site));
      setSaveError((prev) => (prev === null ? prev : null)); // recovered — say so by going quiet
    } catch (err) {
      const full = err instanceof DOMException
        && (err.name === "QuotaExceededError" || err.name === "NS_ERROR_DOM_QUOTA_REACHED");
      setSaveError(full
        ? "Your browser's storage is full, so this page is no longer being saved. Remove some pictures, or export the site now to keep your work."
        : "This page could not be saved. Export the site now to keep your work.");
    }
  }, [site]);
  // After the tree changes, scroll a freshly-added block into view (set via revealBox) so it's never lost.
  useEffect(() => {
    const id = pendingReveal.current;
    if (!id) return;
    pendingReveal.current = null;
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-box-id="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  }, [site]);

  /**
   * ONE GESTURE IS ONE UNDO.
   *
   * Every edit used to push its own history entry, which is right for "delete this block" and quite wrong
   * for a control you *adjust*: dragging the spacing slider from nothing to 3rem left THIRTY entries, so
   * Ctrl+Z walked back one pixel of spacing at a time and the thing the user actually did was unreachable.
   *
   * Two edits merge when they are the SAME control on the SAME block, close together in time — the rule a
   * text editor uses for typing, and for the same reason: a continuous adjustment is one act. The key is
   * derived from the patch's own field names, so every control in the inspector gets this without being
   * changed, and any control that writes a DIFFERENT field (or lands on a different block) starts a new
   * entry immediately, however fast it follows.
   */
  const MERGE_MS = 700;
  const mergeAt = useRef<{ key: string; at: number } | null>(null);

  const pushSite = (next: BoxSite) => setHist((h) => (h ? { present: next, past: [...h.past, h.present].slice(-HIST_CAP), future: [] } : h));
  const resetSite = (next: BoxSite) => { const s = normalizeSite(next, ROW_GAP); setHist({ present: s, past: [], future: [] }); setActivePageId(s.homeId); setSelectedIds([]); };
  // An edit to the ACTIVE page's tree.
  const commit = (nextRoot: BoxNode, mergeKey?: string) => {
    // Worked out BEFORE the updater, never inside it: a state updater may be called more than once for one
    // update, and a ref written in there would see the second call as a repeat of the first.
    const now = Date.now();
    const merge = !!mergeKey && mergeAt.current?.key === mergeKey && now - mergeAt.current.at < MERGE_MS;
    mergeAt.current = mergeKey ? { key: mergeKey, at: now } : null;
    setHist((h) => {
      if (!h || !activePage) return h;
      const present = setPageRoot(h.present, activePage.id, normalizeRowBands(nextRoot, ROW_GAP));
      // Merging REPLACES what the gesture has produced so far and leaves `past` alone, so the entry already
      // sitting there is still the state from before the gesture began — which is what one Ctrl+Z returns to.
      return merge ? { ...h, present } : { present, past: [...h.past, h.present].slice(-HIST_CAP), future: [] };
    });
  };
  // Race-safe edit: `fn` receives the LATEST committed root (not a possibly-stale render closure), so rapid
  // successive actions (e.g. adding several blocks fast) each build on the previous result — every new block
  // lands in its OWN full-width row instead of being grouped into a shared row band with clamped widths.
  const commitWith = (fn: (currentRoot: BoxNode) => BoxNode) => setHist((h) => {
    if (!h || !activePage) return h;
    const cur = h.present.pages.find((p) => p.id === activePage.id)?.root;
    if (!cur) return h;
    const next = normalizeRowBands(fn(cur), ROW_GAP);
    return { present: setPageRoot(h.present, activePage.id, next), past: [...h.past, h.present].slice(-HIST_CAP), future: [] };
  });

  const undo = useCallback(() => setHist((h) => (h && h.past.length ? { present: h.past[h.past.length - 1], past: h.past.slice(0, -1), future: [h.present, ...h.future].slice(0, HIST_CAP) } : h)), []);
  const redo = useCallback(() => setHist((h) => (h && h.future.length ? { present: h.future[0], past: [...h.past, h.present].slice(-HIST_CAP), future: h.future.slice(1) } : h)), []);
  const canUndo = !!hist?.past.length, canRedo = !!hist?.future.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // UNDO STEPS ASIDE FOR A TEXT FIELD, AND ONLY FOR A TEXT FIELD.
      //
      // This used to hand every Ctrl+Z to any focused `<input>`, which is right for one you TYPE in — the
      // browser's own text undo is what you want there — and wrong for one you DRAG. A range slider holds no
      // text to undo, so after adjusting the spacing the focus was still on the slider and Ctrl+Z did
      // absolutely nothing: measured at sixty presses without a single change reversed.
      const ae = document.activeElement as HTMLElement | null;
      const typedInto = ae?.tagName === "TEXTAREA" || !!ae?.isContentEditable
        || (ae?.tagName === "INPUT" && !NON_TEXT_INPUTS.has((ae as HTMLInputElement).type));
      if (typedInto) return;
      const mod = e.ctrlKey || e.metaKey; const k = e.key.toLowerCase();
      if (mod && k === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      else if (mod && (k === "y" || (k === "z" && e.shiftKey))) { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  // The WEBSITE's theme (saved with the site) drives the canvas + content + export — independent of the editor's
  // own appearance. Defaults to Light for a fresh site.
  const siteThemeId = site?.themeId ?? "light";
  const renderTheme = useMemo(() => resolveSiteTheme(DEFAULT_THEME, siteThemeId), [siteThemeId]);
  const setWebsiteTheme = (id: string) => setHist((h) => (h ? { present: setSiteTheme(h.present, id), past: [...h.past, h.present].slice(-HIST_CAP), future: [] } : h));

  // ── Isolated preview (Phase 0.4): render the ACTUAL export HTML in a sandboxed iframe, so the
  // preview is a true WYSIWYG of the exported, self-contained site — no editor styles bleed in. ──
  const previewFrameRef = useRef<HTMLIFrameElement>(null);
  // The preview shows the REAL exported page — same markup, same nav, same links — one page at a time, exactly
  // as a visitor meets it. (It inlines the shared stylesheet because a srcdoc document has no styles.css to
  // fetch; that is the only difference between this and the file on disk.)
  const previewHTML = useMemo(
    () => (preview && site && activePage ? renderSitePage(site, renderTheme, activePage.id, { inlineShared: true }) : ""),
    [preview, site, activePage, renderTheme],
  );



  const switchPage = (id: string) => { setActivePageId(id); setSelectedIds([]); setPageMenu(false); };

  // Inside the iframe the site's nav points at real files (`admissions.html`), which a srcdoc document cannot
  // navigate to. Intercepting the click and switching the previewed page keeps the markup honest — the preview
  // shows the exact link a visitor will click — while still letting you walk the whole site.
  const fileToPage = useMemo(() => {
    const m = new Map<string, string>();
    if (site) for (const [id, file] of siteFileMap(site)) m.set(file, id);
    return m;
  }, [site]);

  /**
   * THE BAR'S SHORTCUT, AND WHY IT IS DECLARED UP HERE.
   *
   * The preview is an IFRAME, and the first thing anyone does is click or scroll the page inside it. From
   * that moment a key press is delivered to the frame's own document and never reaches this one: measured,
   * the bar toggled while focus sat on `body` and did nothing at all once `activeElement` was the `IFRAME`.
   * A shortcut that stops working the instant you touch the thing it acts on is worse than none, because
   * you learn it and then it lies to you.
   *
   * So it is attached to BOTH documents, and it sits above `wirePreviewNav` because that is where the
   * frame's copy is bound — on every load, for the same reason the link handler is.
   */
  const onPreviewKey = useCallback((e: KeyboardEvent) => {
    // Not while a number is being typed into the width/height boxes, and never on top of a browser shortcut.
    const el = e.target as HTMLElement | null;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
    if (e.key === "h" || e.key === "H") { e.preventDefault(); setBarShown((s) => !s); }
  }, []);

  const wirePreviewNav = useCallback(() => {
    const doc = previewFrameRef.current?.contentDocument;
    if (!doc) return;
    doc.addEventListener("click", (e) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const pageId = fileToPage.get(href);
      if (!pageId) return;              // external or in-page link — leave it alone
      e.preventDefault();
      switchPage(pageId);
    });
    // The bar's shortcut, inside the frame — so it keeps working after the first click on the page itself.
    doc.addEventListener("keydown", onPreviewKey);
  }, [fileToPage, switchPage, onPreviewKey]);

  /**
   * THE PREVIEW HAS TO GIVE THE PAGE THE WIDTH IT PROMISES — measured, and it did not.
   *
   * `globals.css` carries an UNLAYERED `img, picture, video, svg, iframe, embed, object { max-width: 100% }`,
   * which beats every Tailwind utility on the element (the cascade trap this project has hit before, when
   * `h-full` never applied to an `<img>`). So the preview frame was silently clamped to the space available.
   *
   * Measured on a 1440px screen: choosing **Wide** asked for 1920px and rendered 1392px — and the frame's own
   * `innerWidth` was 1392 too, so the page inside laid itself out at the DESKTOP rung (1200+) instead of the
   * big-desktop rung (1800+). The preview was not merely small; it was showing a different layout from the one
   * the label named, with nothing to say so. Every narrower device was honest, which is what kept it hidden.
   *
   * So the frame is given its true width (`max-width: none`) and SCALED DOWN to fit, the way a browser's own
   * device mode does: the page inside still sees 1920 CSS pixels and picks the right rung, and what you look
   * at is that layout, shrunk. The zoom is stated in the bar rather than left to be guessed at.
   *
   * Declared HERE, above the loading guard, for the reason the note below spells out — written first next to
   * the preview markup it serves, which put a `useRef` after the guard and crashed the builder on the hook
   * order. The note existed; it still caught me. It is repeated in the comment on `fitScale` at its use site.
   */
  const stageRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    /**
     * THE CONTENT BOX, not the padded one — `clientWidth` INCLUDES padding.
     *
     * Fitting to `clientWidth` fits the frame to the stage's border box, so a scaled screen came out exactly
     * as wide as the stage and ate the 24px gutter whole: at Wide on a 1440px window the frame was drawn
     * 1440px across, flush to both edges, and the card's rounded corners, ring and shadow were all outside
     * the window. It looked like the padding had been forgotten rather than like a preview of a screen.
     */
    const read = () => {
      const cs = getComputedStyle(el);
      const padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
      const padY = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
      setStage({ w: Math.max(0, el.clientWidth - padX), h: Math.max(0, el.clientHeight - padY) });
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [preview]); // the stage only exists while previewing, so it is re-observed each time preview opens

  /**
   * THE PREVIEW'S SCREEN, as a browser's device mode models it: a size, a zoom and an orientation.
   *
   * ONE source of truth — the size in portrait. The preset dropdown does not hold the selection; it is
   * DERIVED by matching this size against the list, so typing a width by hand moves the dropdown to "Custom"
   * by itself and picking a preset back again needs nothing extra. Two pieces of state that each believed
   * they owned the selection is how a control like this normally goes wrong.
   */
  const [screen, setScreen] = useState<{ w: number; h: number } | null>(null); // null = Responsive: fill the stage
  const [zoom, setZoom] = useState("fit");
  const [rotated, setRotated] = useState(false);
  /**
   * A WIDTH SWEPT BY DRAGGING AN EDGE, in Responsive — null is the whole window. It narrows from both sides
   * at once so the page stays centred while the breakpoints change under it, which is the point of sweeping.
   */
  const [previewFluidW, setPreviewFluidW] = useState<number | null>(null);
  /**
   * THE PREVIEW BAR IS HIDDEN BECAUSE YOU ASKED, NEVER BECAUSE TIME PASSED.
   *
   * It floats over the page rather than sitting in the flow, so it costs the preview no height either way —
   * the only thing hiding buys is an unobstructed top edge, and that is a choice, not a default.
   *
   * It used to hide itself: a timer, plus `onPointerLeave` on the bar. Both were wrong in the same way, and
   * the second was the worse of the two. A menu is portalled OUT of the bar, so choosing a device moved the
   * pointer "off" the bar and the whole strip left the screen the instant the choice was made — pick iPhone
   * SE, then want to rotate it, and the controls are gone. Measured as six guards timing out on a control
   * that was visible, enabled, and translated off the top of the window: `-translate-y-full` keeps an
   * element clickable in the DOM's opinion and entirely unreachable in a person's.
   *
   * So: a button says Hide, `H` toggles it, and a labelled handle at the top brings it back. Nothing
   * disappears on its own, and there is always something on screen to press.
   */
  const [barShown, setBarShown] = useState(true);
  useEffect(() => {
    if (!preview) return;
    window.addEventListener("keydown", onPreviewKey);
    return () => window.removeEventListener("keydown", onPreviewKey);
  }, [preview, onPreviewKey]);
  // Rotation is a VIEW of the size, never a write to it — so turning the phone twice lands on exactly the
  // numbers you started with, and a preset stays recognisable while it is on its side.
  const screenW = screen ? (rotated ? screen.h : screen.w) : null;
  const screenH = screen ? (rotated ? screen.w : screen.h) : null;
  /**
   * WHAT IS IN THE BOX WHILE YOU ARE STILL TYPING IT.
   *
   * The two number fields were bound straight to the size and refused anything outside 120–4000. That reads
   * as a sensible clamp and makes the control unusable: to type "500" you must first type "5", which is
   * below the floor, so the commit was skipped, the controlled input re-rendered from the unchanged size and
   * the keystroke vanished. Every digit after it met the same fate. Only a paste — or a test calling
   * `fill()`, which is exactly what mine did — could ever set a number, so the guard sailed over it.
   *
   * A draft holds the half-typed value; the size is committed only once the number is a real one. Typing
   * therefore works digit by digit, and the frame still never gets a nonsense width.
   */
  const [wDraft, setWDraft] = useState("");
  const [hDraft, setHDraft] = useState("");
  useEffect(() => { setWDraft(screenW ? String(screenW) : ""); }, [screenW]);
  useEffect(() => { setHDraft(screenH ? String(screenH) : ""); }, [screenH]);
  // 5120 because a 32:9 super-ultrawide is a real thing people browse on, and a cap below the catalogue
  // would offer a screen the controls then refused to accept.
  const SIZE_MIN = 120, SIZE_MAX = 6000;
  /** Commit a typed side, in the orientation the person is looking at. */
  const typeSide = (side: "w" | "h", text: string) => {
    (side === "w" ? setWDraft : setHDraft)(text);
    const n = Math.round(Number(text));
    if (!screen || !Number.isFinite(n) || n < SIZE_MIN || n > SIZE_MAX) return;
    const wantsW = side === "w" ? !rotated : rotated; // rotated, the box labelled "width" drives the height
    setScreen(wantsW ? { w: n, h: screen.h } : { w: screen.w, h: n });
  };
  /**
   * THE PREVIEW CHANGES NOTHING OUTSIDE ITSELF.
   *
   * This used to push the previewed width back into `device`, so choosing "iPhone SE" to LOOK at something
   * silently re-pointed the editor's canvas and its per-device editing layer. Looking is not editing: the
   * editor has its own size control and that is the only thing that should move it. Removed at the user's
   * explicit instruction not to touch the non-preview page — and it was the right call anyway, since a
   * free-typed preview width would have been quietly rewriting which breakpoint their next edit landed on.
   */

  // NOTE: every hook above runs on EVERY render. React counts hooks by call order, so a `useMemo` or
  // `useCallback` placed AFTER this guard is called only sometimes — which crashes the whole builder with
  // "Rendered more hooks than during the previous render". That is precisely what happened when the preview
  // callback was first written next to `switchPage` below the guard; `switchPage` moved up instead.
  if (!site || !activePage || !root) return <PageLoader isLoading loadingText="Box Builder" subText="Preparing your canvas…" />;

  const selected = selectedIds.length === 1 ? findBox(root, selectedIds[0]) : null;
  const bulk = selectedIds.length > 1;
  // Each preview width edits its OWN layer. This line used to read
  //   device === "mobile" ? "mobile" : device === "tablet" ? "tablet" : "base"
  // which sent Laptop, Desktop AND Wide to the same place: switching to Wide to fix how something looked on a
  // big screen silently rewrote the layer driving every screen from 900px up, including the Desktop view you
  // had just tuned, with nothing on screen to say so. "Full width" is a preview convenience with no rung of
  // its own, so it edits the desktop base — the same thing it shows.
  const bp: Breakpoint = DEVICE_RUNG[device];
  const CONTENT_KEYS = new Set(["text", "href", "newTab", "anchor", "src", "icon", "html", "listItems", "listStyle"]);
  const patchAt = (base: BoxNode, id: string, patch: Partial<BoxNode>): BoxNode => {
    if (bp === "base") return updateBox(base, id, patch);
    const content: Partial<BoxNode> = {}, style: Partial<BoxNode> = {};
    for (const [k, v] of Object.entries(patch)) (CONTENT_KEYS.has(k) ? content : style)[k as keyof BoxNode] = v as never;
    let next = base;
    if (Object.keys(content).length) next = updateBox(next, id, content);
    if (Object.keys(style).length) next = updateBoxResponsive(next, id, style, bp);
    return next;
  };

  // ── Page management ──
  const onAddPage = () => { const { site: s, id } = addPage(site, `Page ${site.pages.length + 1}`, emptyPageRoot()); pushSite(s); setActivePageId(id); setSelectedIds([]); };
  const onDuplicatePage = () => { const { site: s, id } = duplicatePage(site, activePage.id); pushSite(s); setActivePageId(id); setPageMenu(false); };
  const onRenamePage = (name: string) => pushSite(renamePage(site, activePage.id, name));
  const onDeletePage = () => { if (site.pages.length <= 1) return; const s = deletePage(site, activePage.id); pushSite(s); setActivePageId(s.homeId); setSelectedIds([]); setPageMenu(false); setConfirmDeletePage(false); };
  const onSetHome = () => { pushSite(setHomePage(site, activePage.id)); setPageMenu(false); };

  const addSection = () => { const sec = makeSection(SECTION_TINTS[countSections(root) % SECTION_TINTS.length]); sec.width = "100%"; commit(insertBox(root, root.id, root.children?.length ?? 0, makeRow([sec]))); };
  // The merge key is the block plus the FIELDS being written, so "drag the spacing slider" coalesces while
  // "set the spacing, then the colour" does not — no control had to be told about any of this.
  const onPatch = (patch: Partial<BoxNode>) => {
    if (!selected) return;
    /**
     * A FLOATED BLOCK LIFTED TO THE WINDOW KEEPS THE PLACE IT IS SITTING IN.
     *
     * Its `left`/`top` are percentages of the section it was placed in, and a percentage of a tall section
     * is not the same place as a percentage of the window — measured, 720px down became 240px. So the spot
     * is measured at the moment of the switch and stored in a unit that means the same in both boxes. The
     * percentages are left alone, so putting it back in the layout returns it exactly where it was.
     */
    let p = patch;
    if (isFloating(selected)) {
      if (patch.hold === "fixed") {
        const g = measureFixedGeom(root.id, selected.id);
        if (g) p = { ...patch, pinX: g.x, pinY: g.y };
      } else if ("hold" in patch || "pin" in patch) {
        p = { ...patch, pinX: undefined, pinY: undefined };
      }
    }
    commit(patchAt(root, selected.id, p), `${selected.id}:${Object.keys(p).sort().join(",")}`);
  };
  const resetOverride = () => { if (selected && bp !== "base") commit(clearOverride(root, selected.id, bp)); };

  // ── The twelve-column grid: the three things a block cannot patch on its OWN node ──
  // A block's width in named fractions and a row's column count both write UPWARD (the row's children move
  // with it), so they come through here rather than through `onPatch`, the same shape as "Content width".
  const parentGrid = selected ? findParent(root, selected.id)?.parent : undefined;
  const gridTrack = parentGrid?.layout === "grid" ? gridColumns(parentGrid) : undefined;
  const setFraction = (num: number, den: number) => { if (selected) commit(setColumnFraction(root, selected.id, num, den, bp)); };
  // Only at the BASE: re-cutting a row rescales its CHILDREN's placement, and a rung override carries style,
  // never structure. At a rung the count is a plain per-rung override and the spans clamp to it instead.
  const retrackSelected = selected && bp === "base" && selected.layout === "grid"
    ? (columns: number) => commit(updateBox(root, selected.id, retrackGrid(selected, columns)))
    : undefined;
  const addChildSection = () => { if (!selected) return; const tint = SECTION_TINTS[(countSections(selected) + 1) % SECTION_TINTS.length]; const child = makeBlock(tint, "100%"); const pid = selected.id; commitWith((cur) => insertBox(cur, pid, findBox(cur, pid)?.children?.length ?? 0, child)); revealBox(child.id); };

  const floatSelected = () => { if (!selected) return; const g = measureFloatGeom(root, selected.id); if (g) commit(floatBox(root, selected.id, g.parentId, g.left, g.top, g.width, g.height)); };
  const unfloatSelected = () => { if (selected) commit(unfloatBox(root, selected.id)); };
  const LAYER_OPS = { front: bringToFront, forward: bringForward, backward: sendBackward, back: sendToBack };
  const layerSelected = (dir: keyof typeof LAYER_OPS) => { if (selected) commit(LAYER_OPS[dir](root, selected.id)); };

  const bulkPatch = (patch: Partial<BoxNode>) => { commit(selectedIds.reduce((next, id) => patchAt(next, id, patch), root)); };
  const bulkStepWidth = (dir: -1 | 1) => { commit(selectedIds.reduce((next, id) => { const n = findBox(next, id); if (!n) return next; const w = Math.max(5, Math.min(100, Math.round(widthPct(resolveResponsive(n, bp).width) + dir * 5))); return patchAt(next, id, { width: `${w}%` }); }, root)); };
  const bulkStepHeight = (dir: -1 | 1) => {
    commit(selectedIds.reduce((next, id) => {
      const n = findBox(next, id); if (!n) return next;
      let base = resolveResponsive(n, bp).minHeight;
      if (base == null && typeof document !== "undefined") { const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`); base = el ? el.getBoundingClientRect().height : 120; }
      return patchAt(next, id, { minHeight: Math.max(16, Math.round((base ?? 120) + dir * 24)), height: undefined });
    }, root));
  };
  const bulkDuplicate = () => { commit(selectedIds.reduce((next, id) => duplicateBox(next, id), root)); };
  const bulkDelete = () => { commit(selectedIds.reduce((next, id) => (id !== root.id ? removeBox(next, id) : next), root)); setSelectedIds([]); };
  const bulkFloat = () => { commit(selectedIds.reduce((next, id) => { const g = measureFloatGeom(next, id); return g ? floatBox(next, id, g.parentId, g.left, g.top, g.width, g.height) : next; }, root)); };
  const bulkGroup = () => {
    const g = measureGroupGeom(root, selectedIds);
    if (!g) return;
    const next = groupBoxes(root, selectedIds, g);
    commit(next);
    const groupId = (next.children ?? []).filter((c) => c.position === "absolute").slice(-1)[0]?.id; // new group = root's last float
    if (groupId) setSelectedIds([groupId]);
  };

  // Non-lucide icons (Brands/Google/Ionicons) load lazily, so warm every icon the site uses BEFORE
  // building the HTML — otherwise iconSvg() would return "" for icons whose source isn't in memory yet.
  const onExport = async () => {
    const names: string[] = [];
    const walk = (v: unknown) => {
      if (typeof v === "string") { if (hasIcon(v)) names.push(v); }
      else if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object") Object.values(v as Record<string, unknown>).forEach(walk);
    };
    walk(site);
    await warmIcons(names);
    // Fonts are embedded into the stylesheet rather than linked, so the exported site renders in the typeface
    // the school chose without asking their visitors' browsers to call a third party. If this cannot be
    // fetched the export still goes ahead — the font stack's fallback applies — so a download never fails
    // over a typeface.
    const fontCss = await embedFontCss(fontFamiliesInSite(site, renderTheme));
    // A multi-page site is several files, so it arrives as a ZIP to unzip and upload.
    downloadSite(renderSiteFiles(site, renderTheme, fontCss), "site.zip");
  };

  // Click-to-add from the palette: insert into the selected container (or the page) with an optional style.
  const insertBlock = (kind: string, patch: Partial<BoxNode> = {}) => {
    const node = blockForKind(kind, patch);
    /**
     * Drop where YOU target: into the selected container if one is selected, else onto the page. Every block
     * (element OR component) sits in its own TRANSPARENT, hug-to-content wrapper — the only visible box is
     * the one the block itself paints. The tinted band chrome only appears when you deliberately Add a band.
     *
     * ADDING A BLOCK NEVER MOVES YOUR INSERTION POINT.
     *
     * Two deliberate behaviours used to collide here. A block is inserted into the selected container, which
     * is what makes "select a cell, add a Columns block inside it" work. And a freshly added block is
     * SELECTED, so you can see and style what just landed. Together they meant every click went one level
     * deeper: clicking Stack three times gave three boxes nested inside one another rather than three down
     * the page, and there was no way to stop it short of clicking somewhere else between every add.
     *
     * So a selection the builder made for you is not treated as a place to insert into — only one YOU made
     * is. The new block is still selected and still scrolled into view; the next block simply lands beside
     * it. To put something inside instead, click the box first (or use "+ Add a block inside").
     */
    // Where the LAST block went, if the only thing selected is the block that add itself selected. Not
    // "one level up from the selection": the first block lands on the page root and is wrapped in its own
    // row band, so stepping up from it reaches that band and the next block would land BESIDE it instead of
    // beneath. Repeating the previous target keeps repeated clicks doing the same thing each time.
    /**
     * A PALETTE CLICK ADDS AFTER WHAT YOU HAVE SELECTED — never inside it.
     *
     * It used to insert INTO the selected container, so that "select a grid cell, add a Grid inside it"
     * worked. The rule was real, and it had a blind spot it was never designed against: an empty container
     * is the commonest thing to have selected, and a new block inside an EMPTY one is pixel-identical to
     * it — same width, same height, same position, stacked exactly on top.
     *
     * Measured: with a stack selected, the added block rendered 432×150 at y=88, which is precisely the
     * stack's own box. Nothing on screen changed, so the click read as having failed — and clicking again
     * put a SECOND block inside, at which point the parent finally grew and it looked like the second click
     * was the one that worked. Two nested blocks where the user wanted one, and no way to tell.
     *
     * So the palette places a SIBLING, which is always somewhere new and visible, and nesting keeps the
     * explicit route it already had: the inspector's "+ Add a block inside".
     *
     * Going up past a BAND is what makes "after" mean what it looks like. A band lays its children out side
     * by side, so inserting after a block inside one puts the newcomer BESIDE it; stepping up to the band's
     * own parent gives it a line of its own, underneath — which is where a person looks for it.
     */
    /**
     * THE ONE EXCEPTION: A GRID, AND A GRID CELL, STILL RECEIVE THE BLOCK INSIDE.
     *
     * This is not a special case for its own sake — it is the same test applied honestly. "Inside" is
     * confusing exactly when the container has no shape of its own, and an empty Stack has none: its child
     * lands on the identical pixels. A grid CELL is the opposite. It is a bounded slot that exists in order
     * to hold something, drawn at a fixed place in the grid, so a block arriving in it is visible at once.
     *
     * It also keeps an earlier report fixed rather than trading one for another: "I can no longer add
     * grid/grids within an already added grid" is the reason the insert-into-selection rule exists at all.
     */
    const here = selected ? findParent(root, selected.id) : null;
    const intoSelection = !!selected && (selected.layout === "grid" || here?.parent.layout === "grid");
    const band = !intoSelection && here?.parent.rowBand ? findParent(root, here.parent.id) : null;
    const at = intoSelection ? null : (band ?? here);
    const parentId = intoSelection
      ? selected!.id
      : at && findBox(root, at.parent.id) ? at.parent.id : root.id;
    const index = intoSelection
      ? (findBox(root, selected!.id)?.children?.length ?? 0)
      : at ? at.index + 1 : (findBox(root, root.id)?.children?.length ?? 0);
    lastInsertParent.current = parentId;
    commitWith((cur) => {
      const target = findBox(cur, parentId) ?? cur;
      const max = target.children?.length ?? 0;
      return insertBox(cur, findBox(cur, parentId) ? parentId : cur.id, Math.min(index, max), node);
    });
    // "Flow + auto-reveal": a new block joins the normal flow (a floating sibling overlays it), so SELECT it and
    // scroll it into view — you always see exactly what landed and where, never lost behind a floating card.
    revealBox(node.id);
  };

  // Select a box and scroll it into view AFTER the tree re-renders (so a just-added block is never hidden —
  // e.g. behind a floating sibling on the overlay layer). The reveal id is consumed by the effect below.
  const revealBox = (id: string) => { pendingReveal.current = id; autoSelectedId.current = id; setSelectedIds([id]); };

  const frameW = DEVICES.find((d) => d.id === device)!.w;
  const pageList = site.pages.map((p) => ({ id: p.id, name: p.name }));

  /**
   * How big the frame is DRAWN, as distinct from how big the page thinks it is.
   *
   * `Fit to window` shrinks on BOTH axes — a tall phone on a short stage is as much of a problem as a wide
   * desktop on a narrow one, and fitting only the width would push the bottom of the screen out of sight.
   * It never grows past 1: a 375px phone is drawn at 375px on a big monitor, not blown up to fill it.
   *
   * An explicit percentage is obeyed exactly, including when it overflows — that is what asking for 200% on
   * a small screen means, and the stage scrolls rather than silently ignoring you.
   */
  const fitScale = screenW
    ? Math.min(1, stage.w ? stage.w / screenW : 1, screenH && stage.h ? stage.h / screenH : 1)
    : 1;
  const scale = screenW ? (zoom === "fit" ? fitScale : Number(zoom)) : 1;
  /** The preset this size IS, or null when the numbers have been typed by hand. */
  const activePreset = screen ? PRESETS_FLAT.find((p) => p.w === screen.w && p.h === screen.h) ?? null : null;

  /**
   * RESPONSIVE MEANS THE SCREEN THEY ARE ACTUALLY LOOKING AT — asked for directly: "preview should take the
   * monitor screen that I'm using by default; the viewport width and height should always be taken".
   *
   * It did not. The stage carried 24px of padding and the frame carried rounded corners, a ring and a
   * shadow, so even Responsive letterboxed the page inside a card and handed it a width the visitor's
   * browser would never give it. Framing is right for a DEVICE — an iPhone should look like an iPhone on a
   * surface — and wrong for "show me my site". So the chrome now belongs to the presets alone.
   */
  const framed = !!screen;
  /**
   * …AND THE WIDTH CAN BE SWEPT. `fluidW` is a width chosen by dragging either edge, which narrows the page
   * SYMMETRICALLY so it stays centred while the rungs change under it. Null is the whole window.
   */
  /**
   * RESPONSIVE IS NOT A MEASUREMENT — it is `100%` of the window, so moving this browser to another monitor
   * or dragging it wider re-lays the page out at the new size with nothing stored. A number only ever
   * appears when the PERSON picks one: a device, typed digits, or a width they swept.
   *
   * And a swept width is clamped to the window it is being shown in, so shrinking the browser afterwards
   * cannot leave the preview wider than the space it has.
   */
  const fluidW = previewFluidW == null ? null : Math.min(previewFluidW, stage.w || previewFluidW);
  const liveW = framed ? (screenW ?? 0) : (fluidW ?? stage.w);
  /** Which rung a width lands on — the thing being explored, named rather than left to be inferred. */
  const rungOf = (w: number): string => {
    const hit = [...RUNG_ORDER].reverse().find((r) => w >= RUNG_PX[r]) ?? "phone";
    return RUNG_LABEL[hit];
  };

  // ── Visitor preview ──
  if (preview) {
    return (
      <div
        className="h-screen relative overflow-hidden bg-gray-100 dark:bg-gray-950 midnight:bg-[#060a1e] purple:bg-[#120722]"
        onPointerMove={(e) => { if (e.clientY < 64) setBarShown(true); }}
      >
        {/**
          * THE BAR STEPS OUT OF THE WAY. It used to sit in the flow and take 48px off the top, so the page
          * was handed a shorter viewport than the visitor's — and "one screen tall" is a real design
          * decision that then rendered differently here than on the published site. It now floats over the
          * preview and hides itself, leaving the page the WHOLE window; moving the pointer near the top
          * brings it back, and the Exit pill never leaves.
          */}
        <div
          data-preview-bar
          className={`absolute inset-x-0 top-0 z-20 h-12 flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-800 midnight:border-cyan-500/10 purple:border-pink-500/10 bg-white/95 dark:bg-[#161922]/95 backdrop-blur transition-transform duration-200 ${barShown ? "translate-y-0" : "-translate-y-full"}`}
          aria-hidden={!barShown}
        >
          <button onClick={() => setPreview(false)} className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"><X className="w-3.5 h-3.5" /> Exit preview</button>
          <nav className="flex items-center gap-1 overflow-x-auto" aria-label="Pages">
            {site.pages.map((p) => (
              <button key={p.id} onClick={() => switchPage(p.id)} aria-current={p.id === activePage.id} className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap ${p.id === activePage.id ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold" : "text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"}`}>{p.name}{p.id === site.homeId ? " ·" : ""}</button>
            ))}
          </nav>
          {/* ── The screen: a size, its exact numbers, a zoom and an orientation ── */}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <div className="w-52">
              <CompactSelect
                ariaLabel="Preview screen size"
                value={activePreset?.id ?? (screen ? "custom" : "responsive")}
                onChange={(v) => {
                  // Responsive is 1:1 on the real stage, so any zoom is dropped with it — a disabled box
                  // still SHOWING "50%" while nothing is scaled is a control lying about what it is doing.
                  if (v === "responsive") { setScreen(null); setRotated(false); setZoom("fit"); return; }
                  if (v === "custom") return; // "Custom" only ever REPORTS typed numbers; it is not a destination
                  const p = PRESETS_FLAT.find((x) => x.id === v);
                  if (p) setScreen({ w: p.w, h: p.h });
                }}
                optionGroups={[
                  { group: "Fit the window", items: [{ value: "responsive", label: "Responsive" }] },
                  ...PREVIEW_PRESETS.map((g) => ({ group: g.group, items: g.items.map((p) => ({ value: p.id, label: p.label })) })),
                  // Listed only while it applies, so the menu never offers a choice that does nothing.
                  ...(screen && !activePreset ? [{ group: "Typed by hand", items: [{ value: "custom", label: `Custom — ${screen.w} × ${screen.h}` }] }] : []),
                ]}
              />
            </div>

            {/* The exact numbers, editable — the size is a decision, not only a menu pick. */}
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
              <input
                type="number" min={SIZE_MIN} max={SIZE_MAX} aria-label="Preview width in pixels"
                value={wDraft} placeholder="auto" disabled={!screen}
                onChange={(e) => typeSide("w", e.target.value)}
                className="w-16 px-1.5 py-1 rounded-md border border-gray-300 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-transparent tabular-nums outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-40"
              />
              <span aria-hidden="true">×</span>
              <input
                type="number" min={SIZE_MIN} max={SIZE_MAX} aria-label="Preview height in pixels"
                value={hDraft} placeholder="auto" disabled={!screen}
                onChange={(e) => typeSide("h", e.target.value)}
                className="w-16 px-1.5 py-1 rounded-md border border-gray-300 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-transparent tabular-nums outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-40"
              />
            </div>

            <div className="w-36">
              <CompactSelect ariaLabel="Preview zoom" value={zoom} onChange={setZoom} options={ZOOMS} disabled={!screen} />
            </div>

            <button
              onClick={() => setRotated((v) => !v)} disabled={!screen}
              aria-label="Rotate the preview" aria-pressed={rotated}
              title={rotated ? "Back to portrait" : "Turn it on its side"}
              className={`p-1.5 rounded-md border border-gray-300 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 disabled:opacity-40 ${rotated ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"}`}
            ><RotateCw className="w-4 h-4" /></button>

            {/* What the page inside is ACTUALLY being given, and the zoom it is drawn at — never left to guess. */}
            {/* The width it is really being given, and the RUNG that width lands on — the thing a sweep is
                for. "1024 px · Tablet landscape" says what a visitor on that screen gets. */}
            <output aria-live="polite" data-preview-readout className="text-[0.6875rem] tabular-nums text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 whitespace-nowrap w-44 text-right">
              {liveW ? `${Math.round(liveW)} px · ${rungOf(liveW)}` : "Responsive"}{scale !== 1 ? ` · ${Math.round(scale * 100)}%` : ""}
            </output>

            {/* Hiding is a DECISION, and it is stated where the decision is made — not a timer, and not a
                pointer that happened to move. The same key toggles it back. */}
            <button
              onClick={() => setBarShown(false)} data-preview-bar-hide
              aria-label="Hide the preview controls" aria-expanded title="Hide the controls (H)"
              className="p-1.5 rounded-md border border-gray-300 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"
            ><ChevronUp className="w-4 h-4" /></button>
          </div>
        </div>

        {/* THE WAY BACK IS ALWAYS ON SCREEN. A hidden bar is translated off the top of the window, where
            nothing can reach it — so the handle that brings it back is a real, focusable button sitting in
            the viewport, not a region of the page you have to know to wave the pointer at. */}
        {!barShown && (
          <button
            onClick={() => setBarShown(true)} data-preview-bar-show
            aria-label="Show the preview controls" aria-expanded={false} title="Show the controls (H)"
            className="absolute top-0 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-1 px-3 py-1 rounded-b-lg bg-white/95 dark:bg-[#161922]/95 midnight:bg-[#0b1220]/95 purple:bg-[#1a1020]/95 backdrop-blur shadow-md text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:text-gray-900 dark:hover:text-white"
          ><ChevronDown className="w-4 h-4" /><span className="text-[0.6875rem]">Controls</span></button>
        )}
        {/* `overflow-auto`, not hidden: at an explicit zoom the frame may be larger than the stage, and a
            preview you cannot scroll to the rest of is the defect this whole area exists to avoid. */}
        {/**
          * A BLOCK stage with an `auto`-margined sizer, NOT a centring flex row with a rigid item.
          *
          * `justify-content: center` on an item WIDER than its container overflows it equally on BOTH
          * sides, and the start-side overflow of a scroll container can never be scrolled to — measured at
          * 200% on a 1440px window, 560px of the page sat off the left with no way to reach it.
          *
          * Auto margins do not have that fault: they absorb free space when there is some and resolve to
          * ZERO the moment there is none, so an oversized frame starts flush at the left, its overflow goes
          * entirely to the end edge where scrolling can reach it, and a smaller one is still centred.
          *
          * Both halves matter, which mutating them proved one at a time: with the stage left as flex,
          * `mx-auto` alone still holds the rule (auto margins win over `justify-content`), and dropping
          * `shrink-0` hid it a third way by simply squashing the sizer. It takes a rigid item in a centring
          * flex row to lose the left-hand side — which is exactly the arrangement this replaced.
          */}
        <div ref={stageRef} data-preview-stage className={`absolute inset-0 overflow-auto ${framed ? "p-6 pt-14" : "p-0"}`}>
          {/**
            * A SIZER THAT RESERVES THE SCALED BOX, with the frame scaled from its TOP-LEFT inside it.
            *
            * The frame used to be scaled in place, from `top center`. A CSS transform does not change the
            * box layout reserves, and it only ever creates SCROLLABLE overflow towards the end edge — so
            * above 100% the frame grew out of both sides of the stage and the left-hand part became
            * permanently unreachable: measured at 200% on a 1900px window, the frame's left edge sat at
            * -78px while `scrollLeft` could only travel 0…78. Scrolling right went further right; nothing
            * could ever bring the lost strip back. On a narrower window it was hundreds of pixels, and it
            * is exactly what "none of the zoom options is being followed" looks like from the outside.
            *
            * With a wrapper of the SCALED size, ordinary layout does all of it: centring stays centring,
            * the stage's own `overflow-auto` produces real scrollbars, and scaling from `top left` keeps
            * every pixel inside the box that was reserved for it. The `margin-bottom` hack that used to
            * claw back the unscaled height goes too — the wrapper is simply the right size.
            */}
          <div
            className="mx-auto relative"
            style={screenW && screenH
              ? { width: Math.round(screenW * scale), height: Math.round(screenH * scale) }
              : { width: fluidW ?? "100%", height: "100%" }}
          >
            {/**
              * THE TWO EDGES YOU CAN SWEEP. Only in Responsive — a device preset IS its size, and a handle
              * that contradicts the name of the device would be a control lying about what it does.
              * Dragging either edge narrows the page from BOTH sides so it stays centred while the rungs
              * change under it; a double-click gives the whole window back.
              */}
            {!framed && (["left", "right"] as const).map((side) => (
              <div
                key={side}
                role="separator"
                aria-orientation="vertical"
                aria-label={`Drag the ${side} edge to narrow the preview`}
                title="Drag to sweep the width · double-click for the full window"
                data-preview-grip={side}
                onDoubleClick={() => setPreviewFluidW(null)}
                onPointerDown={(e) => {
                  e.preventDefault();
                  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                  const stageW = stageRef.current?.clientWidth ?? window.innerWidth;
                  const startW = fluidW ?? stageW;
                  const startX = e.clientX;
                  const onMove = (ev: PointerEvent) => {
                    // Both sides give, so the page stays centred: one edge moving in by `d` takes 2d off.
                    const d = (side === "left" ? ev.clientX - startX : startX - ev.clientX) * 2;
                    setPreviewFluidW(Math.max(SIZE_MIN, Math.min(stageW, Math.round(startW - d))));
                  };
                  const onUp = () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
                  window.addEventListener("pointermove", onMove);
                  window.addEventListener("pointerup", onUp);
                }}
                /**
                 * INSIDE the edge, not straddling it. Half-outside put the right-hand grip at 1436…1444 in a
                 * 1440px window, so the half a person can actually reach was 4px — and a press aimed at its
                 * middle landed off the screen entirely, which is how it was found: the left one worked and
                 * the right one did nothing at all.
                 */
                className={`group absolute inset-y-0 ${side === "left" ? "left-0" : "right-0"} z-10 flex w-4 cursor-ew-resize items-center justify-center bg-transparent hover:bg-indigo-500/15 active:bg-indigo-500/25 transition-colors`}
              >
                {/* VISIBLE, or it does not exist. The first version was a transparent strip that only showed
                    itself on hover, and the person it was built for could not find it at all: "there's no way
                    I can do that, it doesn't show me". A handle you have to discover by accident is not a
                    handle. */}
                <span aria-hidden="true" className="pointer-events-none h-10 w-1.5 rounded-full bg-indigo-500/70 shadow ring-1 ring-white/70 group-hover:h-16 group-hover:bg-indigo-600 transition-all" />
              </div>
            ))}
            <iframe
              ref={previewFrameRef}
              title="Site preview"
              srcDoc={previewHTML}
              onLoad={wirePreviewNav}
              sandbox="allow-same-origin allow-scripts allow-popups"
              /**
               * The card look belongs to a DEVICE. Responsive is the visitor's own screen, and a rounded,
               * ringed, shadowed card with padding around it is not what their browser shows them.
               */
              className={`bg-white border-0 block ${framed ? "shadow-2xl rounded-xl ring-1 ring-black/10" : ""}`}
              style={{
                width: screenW ?? "100%",
                /**
                 * `none` in BOTH cases, and for two different reasons.
                 *
                 * With a chosen screen: the global `iframe{max-width:100%}` is unlayered and would clamp it.
                 *
                 * On Responsive: it used to be capped at `64rem`. That is a sensible reading width for an
                 * article and the wrong thing entirely for a preview — on a wide monitor the page was drawn
                 * 1024px across with empty gutters either side, which is neither what the person's screen
                 * shows nor what a visitor would see. Responsive means "the screen I am actually on".
                 */
                maxWidth: "none",
                // Laid out at the page's OWN size and scaled visually, so the page keeps the viewport it was
                // promised. Height follows the chosen screen; Responsive just fills the stage.
                height: screenH ?? "100%",
                transform: scale !== 1 ? `scale(${scale})` : undefined,
                transformOrigin: "top left",
              }}
            />
          </div>
        </div>
        {/* THE WAY OUT NEVER HIDES. The bar steps aside so the page gets the whole window; leaving without a
            way back would be a trap, so this pill stays put and also brings the bar back. */}
        {!barShown && (
          <button
            onClick={() => setPreview(false)}
            onPointerEnter={() => setBarShown(true)}
            className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-1 text-xs px-3 py-2 rounded-full bg-indigo-600/90 text-white shadow-lg backdrop-blur hover:bg-indigo-700"
          ><X className="w-3.5 h-3.5" /> Exit preview</button>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-canvas">
      {/* THE SAVE HAS STOPPED WORKING — said plainly, and never dismissible.
          This is not a notification, it is the state of the document: everything from here on is being
          lost. `role="alert"` so a screen reader is told the moment it appears, and it names the one
          action that recovers the work (Export) rather than only stating the problem. */}
      {saveError && (
        <div role="alert" className="shrink-0 flex items-center gap-2 px-4 py-2 text-xs font-medium bg-red-50 text-red-800 border-b border-red-200 dark:bg-red-950/50 dark:text-red-200 dark:border-red-900 midnight:bg-red-950/50 midnight:text-red-200 midnight:border-red-900 purple:bg-red-950/50 purple:text-red-200 purple:border-red-900">
          <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{saveError}</span>
        </div>
      )}
      {/* ── Top app bar ── */}
      {/**
        * IT WRAPS RATHER THAN SCROLLS, AND THAT IS THE WHOLE REASON IT WORKS.
        *
        * Measured at 768px: the device chips, the base size and both theme switchers sat off the right-hand
        * edge, reachable only by scrolling the whole PAGE sideways; at 375px the toolbar had lost Preview,
        * Export and Reset entirely. Controls that exist and cannot be reached are controls that are not there.
        *
        * The obvious remedy — `overflow-x-auto` on this bar — is the wrong one here, and trying it is how
        * that was learned: a scroll container clips its absolutely positioned descendants, and THREE menus
        * hang off this header (page settings, the website theme, the editor theme). Two of them belong to
        * `ThemeSwitcher`, a SHARED component that other pages use, so making them fit would mean portalling
        * a component this page does not own.
        *
        * Wrapping needs none of that. Every control stays on screen, nothing is clipped because nothing
        * overflows, and at desktop widths there is room for one row so the bar looks exactly as it did.
        * `min-h-14` keeps that single row the same height it always was.
        */}
      <header className="min-h-14 shrink-0 flex flex-wrap items-center gap-2 gap-y-1.5 py-1.5 px-4 border-b border-line bg-surface z-30">
        <span className="text-sm font-bold text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 mr-1 shrink-0">Box Builder</span>
        <ToolDivider />

        {/* Page tabs */}
        {/* `shrink-0`, for the same reason as `ToolBtn`: at 768px the flex row squeezed this group until the
            home page's name read "Hom". A tab already truncates at 9rem when a NAME is long — being clipped
            because the window is narrow is a different thing, and not one the user can do anything about. */}
        <div className="relative flex items-center gap-0.5 rounded-xl bg-gray-100 dark:bg-white/5 p-1 shrink-0" role="group" aria-label="Pages">
          {site.pages.map((p) => (
            <button key={p.id} onClick={() => switchPage(p.id)} aria-current={p.id === activePage.id} title={p.name} className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium max-w-[9rem] truncate ${p.id === activePage.id ? "bg-white dark:bg-white/15 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 shadow-sm" : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:text-gray-800 dark:hover:text-gray-200 midnight:hover:text-cyan-100 purple:hover:text-pink-100"}`}>{p.id === site.homeId && <Home className="w-3 h-3 shrink-0" />}{p.name}</button>
          ))}
          <button onClick={onAddPage} aria-label="Add page" title="Add page" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 midnight:hover:text-cyan-100 purple:hover:text-pink-100 hover:bg-white dark:hover:bg-white/10"><Plus className="w-4 h-4" /></button>
          <button onClick={() => setPageMenu((v) => !v)} aria-label="Page settings" aria-expanded={pageMenu} title="Page settings" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 midnight:hover:text-cyan-100 purple:hover:text-pink-100 hover:bg-white dark:hover:bg-white/10"><Settings2 className="w-4 h-4" /></button>
          {pageMenu && (
            <div className="absolute top-full left-0 mt-2 z-40 w-60 rounded-xl border border-line bg-surface shadow-2xl p-2.5 space-y-2">
              <label className="block"><span className="text-[0.625rem] font-medium text-gray-500">Page name</span>
                <input value={activePage.name} onChange={(e) => onRenamePage(e.target.value)} aria-label="Page name" className="w-full text-sm px-2.5 py-1.5 rounded-lg border border-line bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 mt-0.5" />
              </label>
              <div className="text-[0.625rem] text-gray-400">/{activePage.path}{activePage.id === site.homeId ? " · home page" : ""}</div>
              <div className="grid grid-cols-2 gap-1.5">
                <button onClick={onSetHome} disabled={activePage.id === site.homeId} className="flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded-lg border border-line text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-40"><Home className="w-3.5 h-3.5" /> Home</button>
                <button onClick={onDuplicatePage} className="flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded-lg border border-line text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-white/10"><Files className="w-3.5 h-3.5" /> Duplicate</button>
              </div>
              <button onClick={() => { setPageMenu(false); setConfirmDeletePage(true); }} disabled={site.pages.length <= 1} title={site.pages.length <= 1 ? "A site needs at least one page" : "Delete this page"} className="w-full flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-40"><Trash2 className="w-3.5 h-3.5" /> Delete page</button>
            </div>
          )}
        </div>
        <ToolDivider />

        {/* "Add a band", not "Add section": this makes a TINTED, 48px-padded, full-width strip, which is a
            different thing from the palette's Stack tile (a plain transparent box). Both were called
            "Section", and a user had no way to know which one they were getting. */}
        <ToolBtn onClick={addSection} primary title="Add a full-width, tinted band across the page"><Plus className="w-3.5 h-3.5" /> Add a band</ToolBtn>
        <div className="flex items-center gap-0.5">
          <ToolBtn onClick={undo} disabled={!canUndo} ariaLabel="Undo" title="Undo (Ctrl+Z)"><Undo2 className="w-4 h-4" /></ToolBtn>
          <ToolBtn onClick={redo} disabled={!canRedo} ariaLabel="Redo" title="Redo (Ctrl+Y)"><Redo2 className="w-4 h-4" /></ToolBtn>
        </div>
        <ToolDivider />
        <ToolBtn onClick={() => setPreview(true)} title="See it as a visitor"><Eye className="w-3.5 h-3.5" /> Preview</ToolBtn>
        <ToolBtn onClick={onExport} title="Download the whole site as HTML"><Download className="w-3.5 h-3.5" /> Export</ToolBtn>
        <ToolBtn onClick={() => resetSite(siteFromRoot(starter()))} title="Start over">Reset</ToolBtn>

        {/* This group wraps too. Left as one unbreakable row it was still 417px wide on a 375px screen, so
            the editor's own theme switcher — the last control in it — hung off the edge while everything
            else had been rescued. `ml-auto` still pushes it right whenever there IS room. */}
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2 gap-y-1.5">
          <Segmented ariaLabel="Preview screen size" value={device} onChange={setDevice} options={DEVICES.map((d) => ({ value: d.id, Icon: d.Icon, title: `${d.label}${d.w ? ` (${d.w}px)` : ""}` }))} />
          <label className="flex items-center gap-1 text-[0.6875rem] text-gray-400" title="Base size in px — everything scales off this so text stays readable when zoomed (WCAG)">
            <span className="hidden lg:inline">Base size</span>
            <input type="number" min={6} max={24} value={root.baseFont ?? 10} onChange={(e) => commit(updateBox(root, root.id, { baseFont: Number(e.target.value) || 10 }))} aria-label="Base size (px)" className="w-12 text-xs px-1.5 py-1 rounded-lg border border-line bg-transparent" />
          </label>
          {/* WEBSITE theme (saved with the site → canvas + content + export). Distinct from the editor-appearance switcher. */}
          <ThemeSwitcher align="right" value={siteThemeId as ThemeId} onChange={setWebsiteTheme} ariaLabel="Website theme" triggerIcon={Palette} triggerLabel={THEMES[siteThemeId as ThemeId]?.label ?? "Theme"} />
          {/* EDITOR appearance (how the builder UI looks). */}
          <ThemeSwitcher compact align="right" />
        </div>
      </header>

      {/* ── Body: Canvas (with the FLOATING Blocks panel over it) · Inspector ── */}
      <div className="flex-1 flex min-h-0">
        {/* The Blocks panel floats over this column, so the canvas keeps its full width. */}
        <div className="relative flex-1 min-w-0 flex">
          <div className="flex-1 min-w-0 overflow-auto">
            <div className="p-8 flex justify-center min-h-full">
              <div className={`shadow-sm rounded-xl ring-1 ring-black/10 dark:ring-white/10 shrink-0 h-fit transition-[width] duration-300 ${device === "full" ? "w-full max-w-5xl" : ""}`} style={{ width: frameW ?? undefined, background: renderTheme.background, color: renderTheme.text, fontFamily: renderTheme.bodyFont, containerType: "inline-size" }}>
                <BoxCanvas root={root} theme={renderTheme} minHeight={PAGE_MIN_H} selectedIds={selectedIds} onSelectIds={selectByUser} onChange={commit} breakpoint={bp} />
              </div>
            </div>
          </div>
          <BlocksPanel theme={renderTheme} onPick={insertBlock} />
        </div>

        {inspectorOpen ? (
          <aside className="w-[22rem] shrink-0 border-l border-line bg-surface flex flex-col">
            <div className="h-11 shrink-0 flex items-center gap-2 px-3.5 border-b border-line">
              <span className="grid place-items-center w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"><SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={2} /></span>
              <span className="flex-1 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Inspector</span>
              <button onClick={() => setInspectorOpen(false)} aria-label="Collapse inspector" title="Collapse panel" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"><PanelRightClose className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {bulk ? (
                <BulkInspector count={selectedIds.length} theme={renderTheme} sample={(() => { const f = findBox(root, selectedIds[0]); return f ? resolveResponsive(f, bp) : null; })()} onStepWidth={bulkStepWidth} onStepHeight={bulkStepHeight} onPatch={bulkPatch} onDuplicate={bulkDuplicate} onDelete={bulkDelete} onFloatAll={bulkFloat} onGroup={bulkGroup} />
              ) : selected ? (
                <BoxInspector pinBlockedBy={blockedByLabel(pinBlockedBy(root, selected.id, bp))} fixedBlockedBy={blockedByLabel(fixedBlockedBy(root, selected.id, bp))} pinScope={pinScopeWords(root, selected.id, bp)} node={bp === "base" ? selected : resolveResponsive(selected, bp)} theme={renderTheme} onPatch={onPatch} onAddChild={addChildSection} onFloat={floatSelected} onUnfloat={unfloatSelected} onLayer={layerSelected} onAlignInRow={(j) => commit(alignInRow(root, selected.id, j))} rowJustify={alignInRowOf(root, selected.id)} onSectionWidth={pageBandOf(root, selected.id) ? (v) => commit(setSectionWidth(root, selected.id, v)) : undefined} sectionWidth={sectionWidthOf(root, selected.id)} canFloat={selected.id !== root.id} inGrid={gridTrack !== undefined} inMasonry={parentGrid?.rowFlow === "masonry"} gridTrack={gridTrack} onSetFraction={setFraction} onRetrack={retrackSelected} breakpoint={bp} overridden={hasOverride(selected, bp)} onResetOverride={resetOverride} pages={pageList} currentPageId={activePage.id} />
              ) : (
                <div className="p-6 text-xs text-gray-400 text-center mt-6">Click a block to edit it — or drag a box on empty canvas to select several at once.</div>
              )}
            </div>
          </aside>
        ) : (
          <aside className="w-11 shrink-0 border-l border-line bg-surface flex flex-col items-center pt-3 gap-2">
            <button onClick={() => setInspectorOpen(true)} aria-label="Expand inspector" title="Open Inspector" className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"><PanelRightOpen className="w-4 h-4" /></button>
            <span className="mt-1 text-[0.625rem] font-semibold uppercase tracking-wide text-gray-400 [writing-mode:vertical-rl] rotate-180">Inspector</span>
          </aside>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={confirmDeletePage}
        onClose={() => setConfirmDeletePage(false)}
        onConfirm={onDeletePage}
        title="Delete this page?"
        itemName={activePage.name}
        itemId={`/${activePage.path}`}
        confirmButtonText="Delete page"
        warningMessage={`Deleting “${activePage.name}” permanently removes the page and everything on it. You'll need to rebuild it from scratch — though you can still Undo (Ctrl+Z) right after.`}
      />
    </div>
  );
}
