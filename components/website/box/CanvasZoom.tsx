"use client";
/**
 * ZOOMING THE EDITOR CANVAS — BATCH Z-1 (plan approved by the user 2026-10-01; research docs/web-anatomy/editor-zoom.md).
 * Scenarios: tests/features/components/website/box-builder-site.feature "Zooming the editor canvas".
 *
 * The zoom is the editor's only: the page frame is drawn at `fit × nothing` (Fit) or at the zoom the user chose, with the
 * same CSS `zoom` the fit already used, so every drag, drop and resize keeps reading it through `zoomOf`. The device
 * buttons still set the width the page is laid out at. Nothing here is saved into the site.
 *
 * Keys and the wheel act on the canvas ONLY while the pointer or focus is inside it — over the panels and the inspector
 * Ctrl + / Ctrl − stay the browser's own zoom, which a low-vision user needs for the builder itself (WCAG 1.4.4).
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { Minus, Plus } from "lucide-react";
import CompactSelect from "@/components/shared/CompactSelect";
import { ToolBtn } from "@/components/website/box/ui";
import { ZOOM_MAX, ZOOM_MENU, ZOOM_MIN, anchorDelta, clampZoom, readZoom, stepZoom, writeZoom, zoomLabel, zoomToFit } from "@/lib/canvas-zoom";

const local = () => { try { return typeof window === "undefined" ? undefined : window.localStorage; } catch { return undefined; } };
const editable = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
type Anchor = { lx: number; ly: number; clientX: number; clientY: number };

export function useCanvasZoom({ device, fit, scroller, frame, selectedId, ready }: {
  /** The canvas is on the page — the builder renders a loader first, so the listeners attach when this turns true. */
  ready: boolean;
  device: string; fit: number; scroller: RefObject<HTMLElement | null>; frame: RefObject<HTMLElement | null>; selectedId: string | null;
}) {
  const [user, setUser] = useState<number | null>(null);
  // A device never zoomed opens at Fit; one zoomed before opens where it was left (the user's decisions 3 and 4).
  useEffect(() => { setUser(readZoom(local(), device)); }, [device]);
  const z = user ?? fit;
  // Refs for the listeners registered once (rule 2: stale closures are how a shortcut acts on yesterday's state).
  const zRef = useRef(z); zRef.current = z;
  const fitRef = useRef(fit); fitRef.current = fit;
  const deviceRef = useRef(device); deviceRef.current = device;
  const selRef = useRef(selectedId); selRef.current = selectedId;
  const anchor = useRef<Anchor | null>(null);
  const centerOn = useRef<string | null>(null);

  /** Change the zoom, keeping the page point under `at` (the pointer; the middle of the view otherwise) where it is. */
  const setZoom = useCallback((next: number | null, at?: { clientX: number; clientY: number }) => {
    const fr = frame.current, sc = scroller.current;
    if (fr && sc && !anchor.current) { // a burst of wheel events between two paints keeps its first point
      const r = fr.getBoundingClientRect(), v = sc.getBoundingClientRect();
      const p = at ?? { clientX: v.left + v.width / 2, clientY: v.top + v.height / 2 };
      anchor.current = { lx: (p.clientX - r.left) / zRef.current, ly: (p.clientY - r.top) / zRef.current, clientX: p.clientX, clientY: p.clientY };
    }
    const value = next == null ? null : clampZoom(next);
    zRef.current = value ?? fitRef.current;
    setUser(value);
    writeZoom(local(), deviceRef.current, value);
  }, [frame, scroller]);

  const toSelection = useCallback(() => {
    const id = selRef.current, sc = scroller.current;
    const el = id ? document.querySelector<HTMLElement>(`[data-box-id="${CSS.escape(id)}"]`) : null;
    if (!el || !sc) return;
    const r = el.getBoundingClientRect();
    centerOn.current = id;
    setZoom(zoomToFit(r.width / zRef.current, r.height / zRef.current, sc.clientWidth, sc.clientHeight));
  }, [scroller, setZoom]);

  // After the frame is drawn at the new zoom: scroll so the anchored point is back under the pointer.
  // ponytail: only as far as the page can scroll — a page shorter than the window has no room above or below it, so
  // zooming there grows it downward from its top (measured: 33px off on a one-box page; ≤1px on a page that scrolls).
  // Design tools put empty room round the page for this; add it only if users miss it.
  useLayoutEffect(() => {
    const fr = frame.current, sc = scroller.current;
    if (!fr || !sc) return;
    if (centerOn.current) {
      document.querySelector(`[data-box-id="${CSS.escape(centerOn.current)}"]`)?.scrollIntoView({ block: "center", inline: "center" });
      centerOn.current = null; anchor.current = null; return;
    }
    const a = anchor.current; if (!a) return;
    anchor.current = null;
    const r = fr.getBoundingClientRect(), d = anchorDelta(a, { left: r.left, top: r.top }, z);
    sc.scrollLeft += d.dx; sc.scrollTop += d.dy;
  }, [z, frame, scroller]);

  // Keys, the wheel, pinch and pan — registered once, reading refs.
  useEffect(() => {
    const sc = scroller.current;
    if (!sc) return;
    // ON THE CANVAS = the pointer is inside its RECTANGLE, wherever the element under it lives. A selected block's handles
    // and toolbar are drawn in a layer outside the canvas element, and enter/leave events said the pointer had left the
    // canvas whenever it crossed them — so Ctrl + over a selected block zoomed the browser instead (Z1-h).
    let at: { x: number; y: number } | null = null, space = false;
    const onPoint = (e: PointerEvent) => { at = { x: e.clientX, y: e.clientY }; };
    const inCanvas = () => {
      if (sc.contains(document.activeElement)) return true;
      if (!at) return false;
      const r = sc.getBoundingClientRect();
      if (!(at.x >= r.left && at.x < r.right && at.y >= r.top && at.y < r.bottom)) return false;
      // …but not over a panel floating on it (the Blocks panel, a menu, a dialog): the editor's own UI keeps the browser's zoom.
      return !document.elementFromPoint(at.x, at.y)?.closest('[role="dialog"], [role="menu"], [role="listbox"]');
    };
    const onKey = (e: KeyboardEvent) => {
      if (!inCanvas()) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && !e.altKey) {
        if (e.code === "Equal" || e.code === "NumpadAdd") { e.preventDefault(); setZoom(stepZoom(zRef.current, 1)); }
        else if (e.code === "Minus" || e.code === "NumpadSubtract") { e.preventDefault(); setZoom(stepZoom(zRef.current, -1)); }
        else if (e.code === "Digit0" || e.code === "Numpad0") { e.preventDefault(); setZoom(1); }
        return;
      }
      if (editable(e.target) || e.altKey) return; // Shift 1 in a text block types "!"
      if (e.shiftKey && e.code === "Digit0") { e.preventDefault(); setZoom(1); }
      else if (e.shiftKey && e.code === "Digit1") { e.preventDefault(); setZoom(null); }
      else if (e.shiftKey && e.code === "Digit2") { e.preventDefault(); toSelection(); }
      // Space on a focused button or link IN THE PAGE still presses it. A toolbar button outside it keeps focus after a
      // click (a device chosen, then the pointer moved onto the page): there Space is the pan, and the key is kept from
      // pressing that button again (Z1-g).
      else if (e.code === "Space" && !e.shiftKey && !(e.target instanceof Element && sc.contains(e.target) && e.target.closest("button, a, [role=button], [role=menuitem]"))) {
        e.preventDefault(); space = true; sc.style.cursor = "grab";
      }
    };
    // A button is pressed by Space on key UP — kept from it too while the Space was the pan.
    const onKeyUp = (e: KeyboardEvent) => { if (e.code === "Space" && space) { e.preventDefault(); space = false; sc.style.cursor = ""; } };
    // Ctrl + wheel and a trackpad pinch (which arrives as Ctrl + wheel): zoom smoothly round the pointer.
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return; // the plain wheel scrolls (the user's decision 2)
      e.preventDefault();
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      setZoom(zRef.current * Math.exp(-dy * 0.0015), e);
    };
    // Pan: Space + drag, or the middle button — taken in the CAPTURE phase so the canvas does not start a box-select.
    let pan: { x: number; y: number; id: number } | null = null;
    const touches = new Map<number, { x: number; y: number }>();
    let pinch: { d: number; z: number } | null = null;
    const dist = () => { const [a, b] = [...touches.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (touches.size === 2) { pinch = { d: dist(), z: zRef.current }; e.preventDefault(); e.stopPropagation(); }
        return;
      }
      if (!(space && e.button === 0) && e.button !== 1) return;
      e.preventDefault(); e.stopPropagation();
      pan = { x: e.clientX, y: e.clientY, id: e.pointerId };
      sc.setPointerCapture(e.pointerId); sc.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" && touches.has(e.pointerId)) {
        touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pinch && touches.size === 2) {
          const [a, b] = [...touches.values()];
          setZoom(pinch.z * (dist() / pinch.d), { clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 });
        }
        return;
      }
      if (!pan || e.pointerId !== pan.id) return;
      sc.scrollLeft -= e.clientX - pan.x; sc.scrollTop -= e.clientY - pan.y;
      pan = { ...pan, x: e.clientX, y: e.clientY };
    };
    const onUp = (e: PointerEvent) => {
      touches.delete(e.pointerId); if (touches.size < 2) pinch = null;
      if (pan && e.pointerId === pan.id) { pan = null; sc.style.cursor = space ? "grab" : ""; }
    };
    // The middle button's own autoscroll would fight the pan.
    const onAux = (e: MouseEvent) => { if (e.button === 1) e.preventDefault(); };
    window.addEventListener("pointermove", onPoint, true); window.addEventListener("pointerdown", onPoint, true);
    sc.addEventListener("wheel", onWheel, { passive: false });
    sc.addEventListener("pointerdown", onDown, true); sc.addEventListener("mousedown", onAux, true);
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp); window.addEventListener("pointercancel", onUp);
    window.addEventListener("keydown", onKey, true); window.addEventListener("keyup", onKeyUp, true);
    return () => {
      window.removeEventListener("pointermove", onPoint, true); window.removeEventListener("pointerdown", onPoint, true);
      sc.removeEventListener("wheel", onWheel); sc.removeEventListener("pointerdown", onDown, true); sc.removeEventListener("mousedown", onAux, true);
      window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("keydown", onKey, true); window.removeEventListener("keyup", onKeyUp, true);
    };
  }, [ready, scroller, setZoom, toSelection]);

  return { z, user, setZoom, toSelection };
}

/** − · the readout and its menu · + — beside the device buttons. Every control is named and works from the keyboard. */
export function ZoomControls({ z, user, fit, canSelect, onZoom, onSelection }: {
  z: number; user: number | null; fit: number; canSelect: boolean; onZoom: (z: number | null) => void; onSelection: () => void;
}) {
  const menu = [{ value: "fit", label: `Fit · ${Math.round(fit * 100)}%` }, ...ZOOM_MENU.map((m) => ({ value: String(m), label: `${m * 100}%` }))];
  // A stepped zoom (125%) is not on the menu: it is shown as itself so the readout never lies.
  if (user != null && !ZOOM_MENU.includes(user)) menu.push({ value: String(user), label: `${Math.round(user * 100)}%` });
  if (canSelect) menu.push({ value: "sel", label: "Zoom to selection" });
  return (
    <div role="group" aria-label="Canvas zoom" className="inline-flex items-center gap-0.5">
      <ToolBtn onClick={() => onZoom(stepZoom(z, -1))} disabled={z <= ZOOM_MIN + 0.001} title="Zoom canvas out (Ctrl −)" ariaLabel="Zoom canvas out" compact><Minus className="w-3.5 h-3.5" aria-hidden="true" /></ToolBtn>
      <CompactSelect ariaLabel={`Canvas zoom, ${zoomLabel(user, fit)}`} value={user == null ? "fit" : String(user)}
        onChange={(v) => (v === "sel" ? onSelection() : onZoom(v === "fit" ? null : Number(v)))} options={menu} />
      <ToolBtn onClick={() => onZoom(stepZoom(z, 1))} disabled={z >= ZOOM_MAX - 0.001} title="Zoom canvas in (Ctrl +)" ariaLabel="Zoom canvas in" compact><Plus className="w-3.5 h-3.5" aria-hidden="true" /></ToolBtn>
    </div>
  );
}
