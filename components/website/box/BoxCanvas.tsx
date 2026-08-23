"use client";

/**
 * Recursive box-tree canvas — the Framer/Webflow-style editor surface. Renders a BoxNode tree with
 * flex OR grid layout, layered backgrounds (colour / gradient / image / overlay), and inline editing.
 * Structure editing (add child, move, duplicate, delete) lives on a small per-node toolbar; styling
 * lives in BoxInspector. Everything flows — boxes can never overlap. Controlled: edits flow up via
 * onChange(root); selection via selectedId/onSelectId.
 */

import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, ChevronUp, ChevronDown, Copy, Scissors, ClipboardPaste, Trash2, Upload, GripVertical, MoreVertical, Rows3, Columns3, Grid3x3, Type, Heading as HeadingIcon, MousePointerClick, Image as ImageIcon } from "lucide-react";
import type { SiteTheme } from "@/lib/site-storage";
import {
  type BoxNode, type BoxType,
  containerStyle, childStyle, marginCSS, sizeToCSS, u, baseUnit, createContainer, createGrid, createElement,
  updateBox, removeBox, insertBox, moveBoxStep, duplicateBox, moveBox, cloneBox, findParent, isAncestor, isContainer, isEmptyBox,
} from "@/lib/box-model";
import { colorToCSS } from "@/components/shared/ColorPalettePicker";
import { EditableText, ImageBox } from "@/components/website/sections/SectionKit";

/** Layered background CSS: base fill (colour/gradient) → image → overlay; content renders above. */
function backgroundStyle(node: BoxNode): React.CSSProperties {
  const s: React.CSSProperties = {};
  const layers: string[] = [];
  const asGradient = (c: string) => { const css = colorToCSS(c); return css.startsWith("linear-gradient") ? css : `linear-gradient(${css}, ${css})`; };
  if (node.bgOverlay) layers.push(asGradient(node.bgOverlay));
  if (node.bgImage) layers.push(`url("${node.bgImage}")`);
  const baseGrad = node.background?.startsWith("gradient:");
  if (baseGrad && !node.bgImage) layers.push(colorToCSS(node.background!));
  if (layers.length) {
    s.backgroundImage = layers.join(", ");
    s.backgroundSize = node.bgImage ? (node.bgSize ?? "cover") : undefined;
    s.backgroundPosition = "center";
    s.backgroundRepeat = "no-repeat";
  }
  if (node.background && !baseGrad) s.backgroundColor = node.background;
  return s;
}

type Edge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
const HANDLES: { edge: Edge; pos: string; cursor: string; label: string; title: string }[] = [
  { edge: "n", pos: "left-1/2 -top-1 -translate-x-1/2 h-2.5 w-9 rounded-full", cursor: "cursor-ns-resize", label: "top edge", title: "Drag for space above (margin-top)" },
  { edge: "s", pos: "left-1/2 -bottom-1 -translate-x-1/2 h-2.5 w-9 rounded-full", cursor: "cursor-ns-resize", label: "bottom edge", title: "Drag to resize height" },
  { edge: "e", pos: "top-1/2 -right-1 -translate-y-1/2 w-2.5 h-9 rounded-full", cursor: "cursor-ew-resize", label: "right edge", title: "Drag to resize width" },
  { edge: "w", pos: "top-1/2 -left-1 -translate-y-1/2 w-2.5 h-9 rounded-full", cursor: "cursor-ew-resize", label: "left edge", title: "Drag for space on the left (margin-left)" },
  { edge: "ne", pos: "-top-1 -right-1 w-3 h-3 rounded-full", cursor: "cursor-nesw-resize", label: "top-right corner", title: "Drag: width + space above" },
  { edge: "nw", pos: "-top-1 -left-1 w-3 h-3 rounded-full", cursor: "cursor-nwse-resize", label: "top-left corner", title: "Drag: space above + left" },
  { edge: "se", pos: "-bottom-1 -right-1 w-3 h-3 rounded-full", cursor: "cursor-nwse-resize", label: "bottom-right corner", title: "Drag: width + height" },
  { edge: "sw", pos: "-bottom-1 -left-1 w-3 h-3 rounded-full", cursor: "cursor-nesw-resize", label: "bottom-left corner", title: "Drag: height + space left" },
];

const ADD_ITEMS: { type: BoxType | "row" | "grid"; label: string; Icon: typeof Type }[] = [
  { type: "container", label: "Section (stack)", Icon: Rows3 },
  { type: "row", label: "Row", Icon: Columns3 },
  { type: "grid", label: "Grid", Icon: Grid3x3 },
  { type: "heading", label: "Heading", Icon: HeadingIcon },
  { type: "text", label: "Text", Icon: Type },
  { type: "button", label: "Button", Icon: MousePointerClick },
  { type: "image", label: "Image", Icon: ImageIcon },
];

export default function BoxCanvas({
  root, theme, editable = true, selectedId, onSelectId, onChange, onResized, minHeight = 600,
}: {
  root: BoxNode;
  theme: SiteTheme;
  editable?: boolean;
  selectedId?: string | null;
  onSelectId?: (id: string | null) => void;
  onChange: (root: BoxNode) => void;
  onResized?: (id: string, axis: "width" | "height") => void;
  minHeight?: number; // the page's minimum height (≈ a viewport); the page GROWS past this with content
}) {
  const [menuFor, setMenuFor] = useState<string | null>(null); // which box's actions dropdown is open
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null); // fixed pos of the ⋯ menu (portaled to body so it never gets clipped by the box)
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = () => { setMenuFor(null); setMenuPos(null); };
  const [resizing, setResizing] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null); // box being dragged
  const [dropTarget, setDropTarget] = useState<{ parentId: string; index: number } | null>(null);
  const [clip, setClip] = useState<BoxNode | null>(null); // copy/cut clipboard (a cloned subtree)
  const select = (id: string | null) => onSelectId?.(id);

  // ── Copy / cut / paste (mouse buttons + keyboard). Paste drops INSIDE a selected container, else
  // right AFTER the selected box; with nothing selected it appends to the page. ──
  const copyBox = (id: string) => { const n = findByIdLocal(root, id); if (n) setClip(cloneBox(n)); };
  const cutBox = (id: string) => { if (id === root.id) return; const n = findByIdLocal(root, id); if (n) { setClip(cloneBox(n)); onChange(removeBox(root, id)); select(null); } };
  const pasteBox = (id: string | null) => {
    if (!clip) return;
    const node = cloneBox(clip);
    const target = id ? findByIdLocal(root, id) : null;
    if (target && isContainer(target)) onChange(insertBox(root, target.id, target.children?.length ?? 0, node));
    else if (target) { const p = findParent(root, target.id); onChange(p ? insertBox(root, p.parent.id, p.index + 1, node) : insertBox(root, root.id, root.children?.length ?? 0, node)); }
    else onChange(insertBox(root, root.id, root.children?.length ?? 0, node));
    select(node.id);
  };

  // Keyboard operations on the selected box (WCAG): copy/cut/paste, duplicate, delete, reorder, deselect.
  useEffect(() => {
    if (!editable) return;
    const onKey = (e: KeyboardEvent) => {
      const ae = document.activeElement as HTMLElement | null;
      if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.isContentEditable)) return; // never hijack text editing
      const id = selectedId ?? null;
      const mod = e.ctrlKey || e.metaKey;
      const k = e.key.toLowerCase();
      if (mod && k === "c") { if (id) { copyBox(id); e.preventDefault(); } }
      else if (mod && k === "x") { if (id) { cutBox(id); e.preventDefault(); } }
      else if (mod && k === "v") { if (clip) { pasteBox(id); e.preventDefault(); } }
      else if (mod && k === "d") { if (id) { onChange(duplicateBox(root, id)); e.preventDefault(); } }
      else if ((e.key === "Delete" || e.key === "Backspace") && id && id !== root.id) { onChange(removeBox(root, id)); select(null); e.preventDefault(); }
      else if (e.key === "ArrowUp" && id) { onChange(moveBoxStep(root, id, -1)); e.preventDefault(); }
      else if (e.key === "ArrowDown" && id) { onChange(moveBoxStep(root, id, 1)); e.preventDefault(); }
      else if (e.key === "Escape") { select(null); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [editable, selectedId, root, clip, onChange]); // eslint-disable-line react-hooks/exhaustive-deps

  // The ⋯ actions menu is portaled to <body> at a fixed position so it's never clipped by a small box.
  // Close it on outside-click, and dismiss on scroll/resize (its anchored position would go stale).
  useEffect(() => {
    if (!menuFor) return;
    const onDown = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) closeMenu(); };
    const onGone = () => closeMenu();
    document.addEventListener("mousedown", onDown);
    window.addEventListener("scroll", onGone, true);
    window.addEventListener("resize", onGone);
    return () => { document.removeEventListener("mousedown", onDown); window.removeEventListener("scroll", onGone, true); window.removeEventListener("resize", onGone); };
  }, [menuFor]);

  const endDrag = () => { setDragId(null); setDropTarget(null); };

  // While dragging, decide where a drop would land: BEFORE/AFTER this box (among its siblings) when
  // near an edge, or INSIDE it (as a child) when hovering the middle of a container.
  const onBoxDragOver = (e: React.DragEvent, node: BoxNode, parent: BoxNode | null) => {
    if (!dragId || dragId === node.id || isAncestor(root, dragId, node.id)) return;
    e.preventDefault(); e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const isRowParent = (parent?.direction ?? "column") === "row";
    const frac = isRowParent ? (e.clientX - rect.left) / rect.width : (e.clientY - rect.top) / rect.height;
    const EDGE = 0.3;
    if (isContainer(node) && frac >= EDGE && frac <= 1 - EDGE) {
      setDropTarget({ parentId: node.id, index: node.children?.length ?? 0 }); // drop inside
    } else if (parent) {
      const idx = parent.children!.indexOf(node) + (frac < 0.5 ? 0 : 1);
      setDropTarget({ parentId: parent.id, index: idx });
    }
  };
  const onBoxDrop = (e: React.DragEvent) => {
    if (dragId && dropTarget) { e.preventDefault(); e.stopPropagation(); onChange(moveBox(root, dragId, dropTarget.parentId, dropTarget.index)); }
    endDrag();
  };
  // A thin insertion line between children (horizontal for a column, vertical for a row).
  const dropLine = (parentId: string, index: number, isRow: boolean) =>
    dragId && dropTarget && dropTarget.parentId === parentId && dropTarget.index === index ? (
      <div key={`dl-${index}`} aria-hidden="true" className={`${isRow ? "w-1 self-stretch min-h-[24px]" : "h-1 w-full"} rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.7)]`} />
    ) : null;

  // Drag-to-resize: grab an edge handle and change the box's width/height in px; flexible siblings
  // reflow live. On release we notify (onResized) so the page can offer to reflow the rest.
  const startResize = (e: React.MouseEvent, id: string, edge: Edge) => {
    if (!editable) return;
    e.preventDefault(); e.stopPropagation();
    const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`);
    const node = findByIdLocal(root, id);
    if (!el || !node) return;
    const rect = el.getBoundingClientRect();
    const maxW = el.parentElement?.clientWidth || 1;
    const vhPx = window.innerHeight || 800;
    // Which side is being dragged. Bottom(s)/Right(e) = SIZE (grow down/right). Top(n)/Left(w) = SPACE
    // on that side (margin-top / margin-left), so you can add space wherever you grab.
    const hasE = edge.includes("e"), hasW = edge.includes("w"), hasS = edge.includes("s"), hasN = edge.includes("n");
    const startX = e.clientX, startY = e.clientY, startW = rect.width, startH = rect.height;
    const startMT = node.marginTop ?? node.margin ?? 0;
    const startML = node.marginLeft ?? node.margin ?? 0;

    // Issue 1: resizing WIDTH inside a row → its row-mates fill the leftover space automatically.
    let base = root;
    if (hasE) {
      const info = findParent(root, id);
      if (info && (info.parent.direction ?? "column") === "row") {
        for (const c of info.parent.children!) if (c.id !== id) base = updateBox(base, c.id, { width: "fill" });
        if (base !== root) onChange(base);
      }
    }

    setResizing(true);
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX, dy = ev.clientY - startY;
      const patch: Partial<BoxNode> = {};
      if (hasE) patch.width = `${Math.max(3, Math.min(100, ((startW + dx) / maxW) * 100)).toFixed(1)}%`; // % of parent, capped to the page
      if (hasS) patch.height = `${Math.max(0.1, ((startH + dy) / vhPx) * 100).toFixed(1)}vh`;             // screen-relative height
      if (hasN) patch.marginTop = Math.max(0, Math.round(startMT - dy));   // drag up → more space ABOVE
      if (hasW) patch.marginLeft = Math.max(0, Math.round(startML - dx));  // drag left → more space to the LEFT
      onChange(updateBox(base, id, patch));
    };
    const onUp = () => { setResizing(false); document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); onResized?.(id, hasS && !hasE ? "height" : "width"); };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const addChild = (parentId: string, kind: BoxType | "row" | "grid") => {
    const node =
      kind === "row" ? createContainer("row")
      : kind === "grid" ? createGrid(3)
      : kind === "container" ? createContainer("column")
      : createElement(kind as Exclude<BoxType, "container">);
    // append at end of the container's children. NOTE: we intentionally do NOT select the new box —
    // the current selection (usually the parent you're adding into) stays put, so you can keep adding.
    const parent = findByIdLocal(root, parentId);
    const index = parent?.children?.length ?? 0;
    onChange(insertBox(root, parentId, index, node));
    closeMenu();
  };

  const renderNode = (node: BoxNode, parent: BoxNode | null): React.ReactNode => {
    const isSel = editable && selectedId === node.id;
    const isRoot = parent === null;
    const wrapStyle: React.CSSProperties = {
      position: "relative",
      borderRadius: node.radius,
      ...marginCSS(node),
      opacity: node.opacity !== undefined ? node.opacity / 100 : undefined,
      overflow: node.clip || node.radius ? "hidden" : undefined, // clip only when opted-in or rounded (never clip the selection chrome)
      // Root fills at least one viewport but GROWS with content (page height = total section heights).
      // The root also defines the global base unit (--box-u, rem-based) that every size scales off.
      ...(parent ? childStyle(node, parent) : { width: "100%", minHeight, ["--box-u" as string]: baseUnit(node.baseFont ?? 10) }),
      ...backgroundStyle(node),
    };

    // Visible drag-to-resize handles on every edge + corner, so you can resize from any side.
    const resizeHandles = isSel && editable && !isRoot ? (
      <>
        {HANDLES.map((h) => (
          <div key={h.edge} onMouseDown={(e) => startResize(e, node.id, h.edge)} aria-label={`Resize ${h.label}`} title={h.title} className={`absolute ${h.pos} ${h.cursor} bg-indigo-500 border-2 border-white shadow z-30`} />
        ))}
      </>
    ) : null;

    // Select on mousedown (fires before the inline editor's click-guard) and stop propagation so the
    // DEEPEST box under the pointer wins and the canvas-background deselect doesn't also fire.
    const onSelectDown = (e: React.MouseEvent) => { if (editable) { e.stopPropagation(); select(node.id); closeMenu(); } };

    const isDropInside = !!dragId && dropTarget?.parentId === node.id;
    const isDragging = dragId === node.id;

    // ── container ──
    if (isContainer(node)) {
      const childIsRow = (node.direction ?? "column") === "row";
      const kids = node.children ?? [];
      return (
        <div
          key={node.id}
          data-box-id={node.id}
          onMouseDown={onSelectDown}
          onDragOver={editable ? (e) => onBoxDragOver(e, node, parent) : undefined}
          onDrop={editable ? onBoxDrop : undefined}
          style={{ ...containerStyle(node), ...wrapStyle, ...(isDragging ? { opacity: 0.4 } : {}) }}
          className={`${editable ? "transition-shadow" : ""} ${isSel ? "outline outline-2 outline-indigo-500 outline-offset-[-2px]" : isDropInside ? "outline outline-2 outline-dashed outline-indigo-400" : editable ? "hover:outline hover:outline-1 hover:outline-indigo-300/70 hover:outline-offset-[-1px]" : ""}`}
        >
          {kids.map((c, i) => (
            <Fragment key={c.id}>
              {dropLine(node.id, i, childIsRow)}
              {renderNode(c, node)}
            </Fragment>
          ))}
          {dropLine(node.id, kids.length, childIsRow)}
          {editable && kids.length === 0 && (
            <div className="w-full flex items-center justify-center gap-1 py-3 text-gray-400 border border-dashed border-gray-300 rounded-lg pointer-events-none" style={{ fontSize: u(11) }}><Plus className="w-3 h-3 shrink-0" /> Add</div>
          )}
          {isSel && <NodeToolbar node={node} isRoot={isRoot} />}
          {resizeHandles}
        </div>
      );
    }

    // ── element ──
    return (
      <div
        key={node.id}
        data-box-id={node.id}
        onMouseDown={onSelectDown}
        onDragOver={editable ? (e) => onBoxDragOver(e, node, parent) : undefined}
        onDrop={editable ? onBoxDrop : undefined}
        style={{ ...wrapStyle, ...(isDragging ? { opacity: 0.4 } : {}) }}
        className={`${isSel ? "outline outline-2 outline-indigo-500 outline-offset-[-2px]" : editable ? "hover:outline hover:outline-1 hover:outline-indigo-300/70 hover:outline-offset-[-1px]" : ""}`}
      >
        <ElementView node={node} theme={theme} editable={editable} onText={(v) => onChange(updateBox(root, node.id, { text: v }))} onSrc={(v) => onChange(updateBox(root, node.id, { src: v }))} />
        {isSel && <NodeToolbar node={node} isRoot={isRoot} />}
        {resizeHandles}
      </div>
    );
  };

  // Small floating structure toolbar for the selected node.
  function NodeToolbar({ node, isRoot }: { node: BoxNode; isRoot: boolean }) {
    // COLLAPSED bar: just a drag grip + a ⋯ button (tiny, never covers the box). All actions live in
    // the ⋯ dropdown, opened on demand, so you can always see and work on the element itself.
    const open = menuFor === node.id;
    const MenuItem = ({ onClick, Icon, label, danger, disabled }: { onClick: () => void; Icon: typeof Copy; label: string; danger?: boolean; disabled?: boolean }) => (
      <button
        disabled={disabled}
        onClick={() => { onClick(); closeMenu(); }}
        role="menuitem"
        className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-left disabled:opacity-40 ${danger ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40" : "text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"}`}
      ><Icon className="w-3.5 h-3.5 text-gray-400" /> {label}</button>
    );
    return (
      <div className="absolute top-1.5 left-1.5 z-40 flex items-center gap-0.5 rounded-lg bg-indigo-600 px-1 py-1 shadow-xl ring-1 ring-white/20" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
        {!isRoot && (
          <span
            draggable
            onDragStart={(e) => { setDragId(node.id); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", node.id); }}
            onDragEnd={endDrag}
            title="Drag to move this block"
            aria-label="Drag to move"
            className="cursor-grab active:cursor-grabbing text-white/80 hover:text-white px-0.5"
          ><GripVertical className="w-3.5 h-3.5" /></span>
        )}
        <button
          onClick={(e) => {
            if (open) { closeMenu(); return; }
            const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
            setMenuPos({ top: r.bottom + 4, left: r.left });
            setMenuFor(node.id);
          }}
          aria-label="Block actions" aria-expanded={open} title="Actions"
          className="p-1 rounded text-white/90 hover:bg-white/15"
        ><MoreVertical className="w-3.5 h-3.5" /></button>
        {open && menuPos && createPortal(
          // Portaled to <body> at a fixed position so the menu is ALWAYS fully visible — a narrow box can
          // never clip it, and it floats above the canvas, inspector and everything else.
          <div
            ref={menuRef}
            style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}
            className="z-[9999] w-44 max-h-[70vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl py-1"
            role="menu" aria-label="Block actions"
            onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}
          >
            {isContainer(node) && (<>
              <div className="px-2.5 pt-0.5 pb-1 text-[9px] font-semibold uppercase tracking-wide text-gray-400">Add inside</div>
              {ADD_ITEMS.map(({ type, label, Icon }) => <MenuItem key={type} onClick={() => addChild(node.id, type)} Icon={Icon} label={label} />)}
              {!isRoot && <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />}
            </>)}
            {!isRoot && (<>
              <MenuItem onClick={() => onChange(moveBoxStep(root, node.id, -1))} Icon={ChevronUp} label="Move up" />
              <MenuItem onClick={() => onChange(moveBoxStep(root, node.id, 1))} Icon={ChevronDown} label="Move down" />
              <MenuItem onClick={() => onChange(duplicateBox(root, node.id))} Icon={Copy} label="Duplicate" />
              <MenuItem onClick={() => copyBox(node.id)} Icon={Copy} label="Copy" />
              <MenuItem onClick={() => cutBox(node.id)} Icon={Scissors} label="Cut" />
              <MenuItem onClick={() => pasteBox(node.id)} Icon={ClipboardPaste} label="Paste" disabled={!clip} />
              <MenuItem onClick={() => { onChange(removeBox(root, node.id)); select(null); }} Icon={Trash2} label="Delete" danger />
            </>)}
          </div>,
          document.body,
        )}
      </div>
    );
  }

  return (
    <div onMouseDown={() => editable && select(null)} className="w-full">
      {renderNode(root, null)}
    </div>
  );
}

/** Local id lookup without importing findBox twice (keeps the render path tiny). */
function findByIdLocal(node: BoxNode, id: string): BoxNode | null {
  if (node.id === id) return node;
  for (const c of node.children ?? []) { const f = findByIdLocal(c, id); if (f) return f; }
  return null;
}

function ElementView({ node, theme, editable, onText, onSrc }: {
  node: BoxNode; theme: SiteTheme; editable?: boolean; onText: (v: string) => void; onSrc: (v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const align = node.textAlign ?? "left";
  switch (node.type) {
    case "heading":
      return <h2 style={{ color: node.color || theme.text, fontFamily: theme.headingFont, fontSize: u(node.fontSize ?? 32), fontWeight: node.bold ? 800 : 600, textAlign: align, width: "100%" }}><EditableText value={node.text} editable={editable} onChange={onText} placeholder="Heading" /></h2>;
    case "button":
      return <a href={node.href || "#"} onClick={(e) => editable && e.preventDefault()} className="inline-flex items-center gap-2 rounded-full font-semibold" style={{ background: node.background ? colorToCSS(node.background) : theme.primary, color: node.color || "#fff", fontSize: u(node.fontSize ?? 14), padding: `${u(12)} ${u(24)}` }}><EditableText value={node.text} editable={editable} onChange={onText} placeholder="Button" /></a>;
    case "image":
      return (
        <div className="relative w-full" style={{ height: sizeToCSS(node.height) ?? 260 }}>
          <ImageBox theme={theme} src={node.src} />
          {editable && (<>
            <button onClick={() => fileRef.current?.click()} className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-900/80 text-white shadow-lg hover:bg-gray-900"><Upload className="w-3.5 h-3.5" /> {node.src ? "Replace" : "Upload"}</button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" aria-label="Upload image" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => onSrc(String(r.result)); r.readAsDataURL(f); e.target.value = ""; }} />
          </>)}
        </div>
      );
    default:
      return <p style={{ color: node.color || theme.textMuted, fontSize: u(node.fontSize ?? 16), textAlign: align, width: "100%" }}><EditableText value={node.text} editable={editable} onChange={onText} placeholder="Add text" /></p>;
  }
}
