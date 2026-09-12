"use client";

/**
 * Freeform, draggable website header. Direct manipulation: click an element to select it (selection
 * is lifted to the parent so the right-hand Header Inspector can edit every property), then DRAG THE
 * ELEMENT ITSELF to move it; double-click (or click again when selected) text/buttons to edit inline.
 * The nav stays ONE element rendering the real dropdown menu. Reuses EditableText + the Menu renderer.
 */

import { useEffect, useRef, useState } from "react";
import { Trash2, Type, Square, Move, Plus, Minus, Paintbrush, Menu as MenuIcon } from "lucide-react";
import type { Site, SiteTheme, HeaderEl } from "@/lib/site-storage";
import { EditableText, tint } from "./sections/SectionKit";
import { HeaderMenu } from "./sections/Menu";
import { colorToCSS } from "@/components/shared/ColorPalettePicker";

const FONT_FALLBACK: Record<string, number> = { text: 18, button: 14, nav: 14 };

const DEFAULT_HEIGHT = 78;
let _c = 0;
const hid = () => `hel-${Date.now()}-${(++_c).toString(36)}`;
const clamp = (v: number, max: number) => Math.max(0, Math.min(max, v));

export default function HeaderBar({
  site, theme, layout, editable = true, onChange, selectedId: controlledSelectedId = null, onSelectId,
}: {
  site: Site;
  theme: SiteTheme;
  layout: HeaderEl[];
  editable?: boolean;
  onChange: (layout: HeaderEl[]) => void;
  selectedId?: string | null;
  onSelectId?: (id: string | null) => void;
}) {
  const bandRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef(layout); layoutRef.current = layout;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const [dropActive, setDropActive] = useState(false); // a "block" is being dragged over the header
  const hasNav = layout.some((e) => e.type === "nav");
  // Controlled selection when the parent passes onSelectId; otherwise fall back to internal state.
  const [internalSel, setInternalSel] = useState<string | null>(null);
  const selectedId = onSelectId ? controlledSelectedId : internalSel;
  const select = (id: string | null) => (onSelectId ? onSelectId(id) : setInternalSel(id));
  const height = site.header?.height ?? DEFAULT_HEIGHT;
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({}); // measured element boxes for collision
  const rootRef = useRef<HTMLDivElement>(null);
  const addBarRef = useRef<HTMLDivElement>(null);
  const [addPos, setAddPos] = useState<{ x: number; y: number } | null>(null); // draggable "Add" toolbar (null = default top-right)

  const pendingResolve = useRef<string | null>(null); // id of a just-added element to de-overlap after paint
  const update = (id: string, patch: Partial<HeaderEl>) => onChange(layout.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const remove = (id: string) => { onChange(layout.filter((e) => e.id !== id)); select(null); setEditingId(null); };
  const add = (el: HeaderEl) => { pendingResolve.current = el.id; onChange([...layout, el]); select(el.id); };

  // Collision resolution: given a proposed %-position for `id`, nudge it (in pixel space, using the
  // real measured element boxes) until it no longer overlaps any sibling. Elements can be placed
  // freely but can NEVER sit on top of one another — they snap to abut their neighbours instead.
  const resolveOverlap = (id: string, nx: number, ny: number): { x: number; y: number } => {
    const band = bandRef.current; const node = nodeRefs.current[id];
    if (!band || !node) return { x: nx, y: ny };
    const br = band.getBoundingClientRect();
    const size = node.getBoundingClientRect();
    const w = size.width, h = size.height;
    if (!br.width || !br.height || !w || !h) return { x: nx, y: ny }; // not measured yet (SSR/jsdom)
    const GAP = 6; // px breathing room between elements
    let left = br.left + (nx / 100) * br.width;
    let top = br.top + ((ny + 6) / 100) * br.height - h / 2; // wrappers are vertically centred
    const others = layoutRef.current
      .filter((e) => e.id !== id)
      .map((e) => nodeRefs.current[e.id]?.getBoundingClientRect())
      .filter((r): r is DOMRect => !!r);
    for (let iter = 0; iter < 12; iter++) {
      let moved = false;
      for (const o of others) {
        const ox = Math.min(left + w, o.right) - Math.max(left, o.left);
        const oy = Math.min(top + h, o.bottom) - Math.max(top, o.top);
        if (ox > 0 && oy > 0) {
          if (ox <= oy) { // separate horizontally (least penetration) — the header's natural axis
            left += (left + w / 2) < (o.left + o.right) / 2 ? -(ox + GAP) : (ox + GAP);
          } else { // separate vertically
            top += (top + h / 2) < (o.top + o.bottom) / 2 ? -(oy + GAP) : (oy + GAP);
          }
          moved = true;
        }
      }
      if (!moved) break;
    }
    // keep the whole box inside the header band
    left = Math.max(br.left, Math.min(left, br.right - w));
    top = Math.max(br.top, Math.min(top, br.bottom - h));
    const x = clamp(((left - br.left) / br.width) * 100, 96);
    const y = clamp((((top + h / 2) - br.top) / br.height) * 100 - 6, 84);
    return { x, y };
  };

  // After a new element is added (or dropped), nudge it off any element it landed on.
  useEffect(() => {
    const id = pendingResolve.current;
    if (!id) return;
    pendingResolve.current = null;
    const cur = layoutRef.current.find((e) => e.id === id);
    if (!cur) return;
    const pos = resolveOverlap(id, cur.x, cur.y);
    if (Math.abs(pos.x - cur.x) > 0.5 || Math.abs(pos.y - cur.y) > 0.5) {
      onChange(layoutRef.current.map((e) => (e.id === id ? { ...e, x: pos.x, y: pos.y } : e)));
    }
  });

  // Direct drag: grab the element body and move it. Click (no move) selects; click again edits text.
  const onElMouseDown = (e: React.MouseEvent, el: HeaderEl) => {
    if (!editable || editingId === el.id) return;
    e.preventDefault(); e.stopPropagation();
    const wasSelected = selectedId === el.id;
    select(el.id);
    const band = bandRef.current!.getBoundingClientRect();
    const start = { mx: e.clientX, my: e.clientY, ex: el.x, ey: el.y };
    let moved = false;
    const onMove = (ev: MouseEvent) => {
      if (!moved && (Math.abs(ev.clientX - start.mx) > 3 || Math.abs(ev.clientY - start.my) > 3)) moved = true;
      if (!moved) return;
      setDrag({ id: el.id, x: clamp(start.ex + ((ev.clientX - start.mx) / band.width) * 100, 96), y: clamp(start.ey + ((ev.clientY - start.my) / band.height) * 100, 84) });
    };
    const onUp = (ev: MouseEvent) => {
      if (moved) {
        const nx = clamp(start.ex + ((ev.clientX - start.mx) / band.width) * 100, 96);
        const ny = clamp(start.ey + ((ev.clientY - start.my) / band.height) * 100, 84);
        const pos = resolveOverlap(el.id, nx, ny); // never drop on top of another element
        onChange(layoutRef.current.map((x) => (x.id === el.id ? { ...x, x: pos.x, y: pos.y } : x)));
      } else if (wasSelected && (el.type === "text" || el.type === "button")) {
        setEditingId(el.id); // second click on a selected text → edit
      }
      setDrag(null);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  // Keyboard operability (WCAG 2.1.1): focus an element, arrow-nudge to move (Shift = bigger step),
  // Enter to edit/select, Delete to remove — a full alternative to mouse dragging.
  const onElKeyDown = (e: React.KeyboardEvent, el: HeaderEl) => {
    if (!editable || editingId === el.id) return;
    const step = e.shiftKey ? 5 : 2;
    const nudge = (dx: number, dy: number) => {
      e.preventDefault();
      select(el.id);
      const pos = resolveOverlap(el.id, clamp(el.x + dx, 96), clamp(el.y + dy, 84));
      update(el.id, { x: pos.x, y: pos.y });
    };
    switch (e.key) {
      case "ArrowLeft": nudge(-step, 0); break;
      case "ArrowRight": nudge(step, 0); break;
      case "ArrowUp": nudge(0, -step); break;
      case "ArrowDown": nudge(0, step); break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (el.type === "text" || el.type === "button") setEditingId(el.id); else select(el.id);
        break;
      case "Delete":
      case "Backspace":
        if (el.type !== "logo") { e.preventDefault(); remove(el.id); }
        break;
    }
  };

  const renderEl = (el: HeaderEl) => {
    const isEditing = editingId === el.id;
    switch (el.type) {
      case "logo": {
        const w = el.width ?? 36, h = el.height ?? 36;
        const src = el.src || site.header?.logoUrl;
        const transparent = el.bg === "transparent";
        if (src) {
          return <img src={src} alt="logo" className="rounded-xl object-contain pointer-events-none" style={{ width: w, height: h, background: transparent ? "transparent" : el.bg ? colorToCSS(el.bg) : "#fff" }} />;
        }
        const initial = (site.name || "S").charAt(0);
        return (
          <span
            className="rounded-xl flex items-center justify-center font-bold pointer-events-none"
            style={{
              width: w, height: h,
              fontSize: Math.round(Math.min(w, h) * 0.5),
              color: transparent ? theme.text : "#fff",
              background: transparent ? "transparent" : el.bg ? colorToCSS(el.bg) : `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            }}
          >{initial}</span>
        );
      }
      case "nav":
        return (
          <div className={editable && !isEditing ? "pointer-events-none" : ""}>
            <HeaderMenu items={site.nav} theme={theme} style={{ color: el.color, fontSize: el.fontSize, fontFamily: el.fontFamily, gap: el.gap }} />
          </div>
        );
      case "button":
        return (
          <span className="inline-flex px-5 py-2 rounded-full font-semibold whitespace-nowrap" style={{ background: el.bg ? colorToCSS(el.bg) : theme.primary, color: el.color || "#fff", fontSize: el.fontSize || 14, fontFamily: el.fontFamily || theme.headingFont }}>
            <EditableText value={el.text} editable={isEditing} onChange={(v) => update(el.id, { text: v })} placeholder="Button" />
          </span>
        );
      default: // text
        return (
          <span className="whitespace-nowrap" style={{ color: el.color || theme.text, fontSize: el.fontSize || 18, fontWeight: el.bold ? 700 : 500, fontFamily: el.fontFamily || theme.headingFont }}>
            <EditableText value={el.text} editable={isEditing} onChange={(v) => update(el.id, { text: v })} placeholder="Text" />
          </span>
        );
    }
  };

  // Drag the "Add" toolbar itself so it never has to sit on top of header content.
  const onAddBarDown = (e: React.MouseEvent) => {
    if (!editable) return;
    e.preventDefault(); e.stopPropagation();
    const root = rootRef.current!.getBoundingClientRect();
    const bar = addBarRef.current!.getBoundingClientRect();
    // Allow the toolbar to be parked BELOW the header (over the page), not just inside the band.
    // Bound it to the surrounding canvas card so it can't be dragged off-screen and lost.
    const card = rootRef.current!.closest(".overflow-hidden")?.getBoundingClientRect();
    const maxY = (card ? card.bottom - root.top : root.height + 600) - bar.height - 4;
    const offX = e.clientX - bar.left, offY = e.clientY - bar.top;
    const onMove = (ev: MouseEvent) => {
      const x = Math.max(0, Math.min(ev.clientX - root.left - offX, root.width - bar.width));
      const y = Math.max(2, Math.min(ev.clientY - root.top - offY, maxY));
      setAddPos({ x, y });
    };
    const onUp = () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  // Native drop of a "block" dragged from the builder panel (e.g. a Navigation menu).
  const onBandDragOver = (e: React.DragEvent) => {
    if (!editable || !e.dataTransfer.types.includes("application/x-educo-block")) return;
    e.preventDefault();
    if (!dropActive) setDropActive(true);
  };
  const onBandDrop = (e: React.DragEvent) => {
    if (!editable) return;
    const block = e.dataTransfer.getData("application/x-educo-block");
    setDropActive(false);
    if (block !== "nav") return;
    e.preventDefault();
    const band = bandRef.current!.getBoundingClientRect();
    const x = clamp(((e.clientX - band.left) / band.width) * 100, 96);
    const y = clamp(((e.clientY - band.top) / band.height) * 100, 84);
    add({ id: hid(), type: "nav", x, y });
  };

  return (
    <div ref={rootRef} className={`relative ${editable ? "z-20" : ""}`} style={{ borderBottom: `1px solid ${tint(theme.text, 0.08)}`, background: theme.background }}>
      {editable && (
        <div
          ref={addBarRef}
          className="absolute z-30 flex items-center gap-1 rounded-lg bg-gray-900/90 backdrop-blur px-1 py-1 shadow-lg"
          style={addPos ? { left: addPos.x, top: addPos.y } : { top: 6, right: 8 }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <span onMouseDown={onAddBarDown} role="button" aria-label="Move the Add toolbar" title="Drag to move this toolbar" className="flex items-center gap-0.5 pl-0.5 pr-1 cursor-grab active:cursor-grabbing text-white/50 hover:text-white/80 select-none"><Move className="w-3 h-3" /><span className="text-[0.625rem] font-semibold">Add</span></span>
          <button onClick={() => add({ id: hid(), type: "text", x: 40, y: 34, text: "Text", fontSize: 15, color: theme.textMuted })} title="Add text" aria-label="Add header text" className="p-1 rounded text-white/90 hover:bg-white/15"><Type className="w-3.5 h-3.5" /></button>
          <button onClick={() => add({ id: hid(), type: "button", x: 42, y: 28, text: "Button" })} title="Add button" aria-label="Add header button" className="p-1 rounded text-white/90 hover:bg-white/15"><Square className="w-3.5 h-3.5" /></button>
          <button onClick={() => add({ id: hid(), type: "nav", x: 42, y: 34 })} title={hasNav ? "Add another navigation menu" : "Add navigation menu"} aria-label="Add navigation menu" className="p-1 rounded text-white/90 hover:bg-white/15"><MenuIcon className="w-3.5 h-3.5" /></button>
        </div>
      )}

      <div ref={bandRef} className="relative w-full" style={{ height }} onMouseDown={() => { if (editable) { select(null); setEditingId(null); } }} onDragOver={onBandDragOver} onDragLeave={() => setDropActive(false)} onDrop={onBandDrop}>
        {layout.map((el) => {
          const pos = drag && drag.id === el.id ? drag : el;
          const isSel = editable && selectedId === el.id;
          const isEditing = editingId === el.id;
          return (
            <div
              key={el.id}
              ref={(n) => { nodeRefs.current[el.id] = n; }}
              className={`absolute -translate-y-1/2 rounded-md ${editable ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1" : ""} ${editable && !isEditing ? (isSel ? "cursor-move" : "cursor-pointer") : ""} ${drag?.id === el.id ? "opacity-90" : ""}`}
              style={{ left: `${pos.x}%`, top: `${pos.y + 6}%` }}
              tabIndex={editable && !isEditing ? 0 : undefined}
              role={editable ? "button" : undefined}
              aria-label={editable ? `${el.type} header element${isSel ? ", selected" : ""}. Arrow keys move it, Enter to ${el.type === "text" || el.type === "button" ? "edit" : "select"}${el.type !== "logo" ? ", Delete to remove" : ""}.` : undefined}
              onFocus={() => { if (editable) select(el.id); }}
              onKeyDown={(e) => onElKeyDown(e, el)}
              onMouseDown={(e) => onElMouseDown(e, el)}
              onDoubleClick={() => { if (editable && (el.type === "text" || el.type === "button")) setEditingId(el.id); }}
            >
              <div className={`relative rounded-md ${isSel ? "ring-2 ring-indigo-500 ring-offset-1" : editable ? "hover:ring-2 hover:ring-indigo-300/60" : ""}`}>
                {renderEl(el)}
                {isSel && (
                  <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-0.5 rounded-md bg-gray-900/90 px-1 py-0.5 shadow-lg whitespace-nowrap" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                    <span className="inline-flex items-center text-white/50 pl-0.5 pr-1" title="Drag the element to move it"><Move className="w-3 h-3" /></span>
                    {(el.type === "text" || el.type === "button" || el.type === "nav") && (<>
                      <button onClick={() => update(el.id, { fontSize: Math.max(9, (el.fontSize || FONT_FALLBACK[el.type]) - 1) })} title="Smaller text" aria-label="Decrease font size" className="p-1 rounded text-white/90 hover:bg-white/15"><Minus className="w-3 h-3" /></button>
                      <button onClick={() => update(el.id, { fontSize: Math.min(56, (el.fontSize || FONT_FALLBACK[el.type]) + 1) })} title="Bigger text" aria-label="Increase font size" className="p-1 rounded text-white/90 hover:bg-white/15"><Plus className="w-3 h-3" /></button>
                    </>)}
                    {el.type !== "logo" && <span className="inline-flex items-center gap-0.5 text-[0.625rem] text-white/45 px-1" title="Colours, fonts & links are in the panel on the right"><Paintbrush className="w-3 h-3" /> colours →</span>}
                    {el.type !== "logo" && <button onClick={() => remove(el.id)} title="Delete" aria-label="Delete element" className="p-1 rounded text-red-300 hover:bg-red-500/30"><Trash2 className="w-3.5 h-3.5" /></button>}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Drop indicator when dragging a "Navigation menu" (or other) block onto the header */}
        {dropActive && (
          <div className="absolute inset-1 z-50 rounded-lg border-2 border-dashed border-indigo-500 bg-indigo-500/10 flex items-center justify-center pointer-events-none">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-white/90 rounded-full px-3 py-1 shadow"><MenuIcon className="w-3.5 h-3.5" /> Drop the menu here</span>
          </div>
        )}

        {/* Empty-header hint so the header never looks "broken" with nothing in it */}
        {editable && layout.length === 0 && !dropActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xs text-gray-400">Use the <b className="mx-1">Add</b> toolbar or drag a block here to build your header.</span>
          </div>
        )}
      </div>
    </div>
  );
}
