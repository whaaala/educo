"use client";

/**
 * Recursive box-tree canvas — the Framer/Webflow-style editor surface. Renders a BoxNode tree with
 * flex OR grid layout, layered backgrounds (colour / gradient / image / overlay), and inline editing.
 * Structure editing (add child, move, duplicate, delete) lives on a small per-node toolbar; styling
 * lives in BoxInspector. Everything flows — boxes can never overlap. Controlled: edits flow up via
 * onChange(root); selection via selectedId/onSelectId.
 */

import { useRef, useState } from "react";
import { Plus, ChevronUp, ChevronDown, Copy, Trash2, Upload, Box as BoxIcon, Rows3, Columns3, Grid3x3, Type, Heading as HeadingIcon, MousePointerClick, Image as ImageIcon } from "lucide-react";
import type { SiteTheme } from "@/lib/site-storage";
import {
  type BoxNode, type BoxType,
  containerStyle, childStyle, marginCSS, sizeToCSS, createContainer, createGrid, createElement,
  updateBox, removeBox, insertBox, moveBoxStep, duplicateBox, isContainer,
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
const HANDLES: { edge: Edge; pos: string; cursor: string; label: string }[] = [
  { edge: "n", pos: "left-1/2 -top-1 -translate-x-1/2 h-2.5 w-9 rounded-full", cursor: "cursor-ns-resize", label: "top edge" },
  { edge: "s", pos: "left-1/2 -bottom-1 -translate-x-1/2 h-2.5 w-9 rounded-full", cursor: "cursor-ns-resize", label: "bottom edge" },
  { edge: "e", pos: "top-1/2 -right-1 -translate-y-1/2 w-2.5 h-9 rounded-full", cursor: "cursor-ew-resize", label: "right edge" },
  { edge: "w", pos: "top-1/2 -left-1 -translate-y-1/2 w-2.5 h-9 rounded-full", cursor: "cursor-ew-resize", label: "left edge" },
  { edge: "ne", pos: "-top-1 -right-1 w-3 h-3 rounded-full", cursor: "cursor-nesw-resize", label: "top-right corner" },
  { edge: "nw", pos: "-top-1 -left-1 w-3 h-3 rounded-full", cursor: "cursor-nwse-resize", label: "top-left corner" },
  { edge: "se", pos: "-bottom-1 -right-1 w-3 h-3 rounded-full", cursor: "cursor-nwse-resize", label: "bottom-right corner" },
  { edge: "sw", pos: "-bottom-1 -left-1 w-3 h-3 rounded-full", cursor: "cursor-nesw-resize", label: "bottom-left corner" },
];

const ADD_ITEMS: { type: BoxType | "row" | "grid"; label: string; Icon: typeof Type }[] = [
  { type: "container", label: "Stack (column)", Icon: Rows3 },
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
  const [addMenuFor, setAddMenuFor] = useState<string | null>(null);
  const [resizing, setResizing] = useState(false);
  const select = (id: string | null) => onSelectId?.(id);

  // Drag-to-resize: grab an edge handle and change the box's width/height in px; flexible siblings
  // reflow live. On release we notify (onResized) so the page can offer to reflow the rest.
  const startResize = (e: React.MouseEvent, id: string, edge: Edge) => {
    if (!editable) return;
    e.preventDefault(); e.stopPropagation();
    const el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // WIDTH is capped to the container (the page). HEIGHT is free — the page grows and scrolls.
    const maxW = el.parentElement?.clientWidth ?? Infinity;
    const affectsW = edge.includes("e") || edge.includes("w");
    const affectsH = edge.includes("n") || edge.includes("s");
    const signW = edge.includes("w") ? -1 : 1; // west handle: drag outward (left) grows width
    const signH = edge.includes("n") ? -1 : 1; // north handle: drag outward (up) grows height
    const startX = e.clientX, startY = e.clientY, startW = rect.width, startH = rect.height;
    setResizing(true);
    const onMove = (ev: MouseEvent) => {
      const patch: Partial<BoxNode> = {};
      if (affectsW) patch.width = `${Math.max(24, Math.min(maxW, Math.round(startW + signW * (ev.clientX - startX))))}px`;
      if (affectsH) patch.height = `${Math.max(1, Math.round(startH + signH * (ev.clientY - startY)))}px`;
      onChange(updateBox(root, id, patch));
    };
    const onUp = () => { setResizing(false); document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); onResized?.(id, affectsH && !affectsW ? "height" : "width"); };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const addChild = (parentId: string, kind: BoxType | "row" | "grid") => {
    const node =
      kind === "row" ? createContainer("row")
      : kind === "grid" ? createGrid(3)
      : kind === "container" ? createContainer("column")
      : createElement(kind as Exclude<BoxType, "container">);
    // append at end of the container's children
    const parent = findByIdLocal(root, parentId);
    const index = parent?.children?.length ?? 0;
    onChange(insertBox(root, parentId, index, node));
    select(node.id);
    setAddMenuFor(null);
  };

  const renderNode = (node: BoxNode, parent: BoxNode | null): React.ReactNode => {
    const isSel = editable && selectedId === node.id;
    const isRoot = parent === null;
    const fixedH = !!node.height && node.height !== "auto" && node.height !== "fill";
    const wrapStyle: React.CSSProperties = {
      position: "relative",
      borderRadius: node.radius,
      ...marginCSS(node),
      opacity: node.opacity !== undefined ? node.opacity / 100 : undefined,
      overflow: node.radius || fixedH ? "hidden" : undefined, // clip content when height is fixed (shrunk)
      // Root fills at least one viewport but GROWS with content (page height = total section heights).
      ...(parent ? childStyle(node, parent) : { width: "100%", minHeight }),
      ...backgroundStyle(node),
    };

    // Visible drag-to-resize handles on every edge + corner, so you can resize from any side.
    const resizeHandles = isSel && editable && !isRoot ? (
      <>
        {HANDLES.map((h) => (
          <div key={h.edge} onMouseDown={(e) => startResize(e, node.id, h.edge)} aria-label={`Resize ${h.label}`} title="Drag to resize" className={`absolute ${h.pos} ${h.cursor} bg-indigo-500 border-2 border-white shadow z-30`} />
        ))}
      </>
    ) : null;

    // Select on mousedown (fires before the inline editor's click-guard) and stop propagation so the
    // DEEPEST box under the pointer wins and the canvas-background deselect doesn't also fire.
    const onSelectDown = (e: React.MouseEvent) => { if (editable) { e.stopPropagation(); select(node.id); setAddMenuFor(null); } };

    // ── container ──
    if (isContainer(node)) {
      return (
        <div
          key={node.id}
          data-box-id={node.id}
          onMouseDown={onSelectDown}
          style={{ ...containerStyle(node), ...wrapStyle }}
          className={`${editable ? "transition-shadow" : ""} ${isSel ? "outline outline-2 outline-indigo-500 outline-offset-[-2px]" : editable ? "hover:outline hover:outline-1 hover:outline-indigo-300/70 hover:outline-offset-[-1px]" : ""}`}
        >
          {(node.children ?? []).map((c) => renderNode(c, node))}
          {editable && (node.children?.length ?? 0) === 0 && (
            <div className="w-full py-6 text-center text-xs text-gray-400 border border-dashed border-gray-300 rounded-lg pointer-events-none">Empty container — select it and press <b className="mx-0.5">＋</b> to add blocks</div>
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
        style={wrapStyle}
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
    return (
      <div className="absolute top-1.5 left-1.5 z-40 flex items-center gap-0.5 rounded-lg bg-indigo-600 px-1.5 py-1 shadow-xl ring-1 ring-white/20" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
        <span className="inline-flex items-center gap-1 pl-0.5 pr-1.5 text-[11px] font-bold text-white border-r border-white/25 mr-0.5"><BoxIcon className="w-3.5 h-3.5" />{node.type === "container" ? (node.layout === "grid" ? "Grid" : node.direction === "row" ? "Row" : "Stack") : node.type}</span>
        {isContainer(node) && (
          <div className="relative">
            <button onClick={() => setAddMenuFor(addMenuFor === node.id ? null : node.id)} aria-label="Add block" title="Add a block inside" className="p-1 rounded text-white/90 hover:bg-white/15"><Plus className="w-3.5 h-3.5" /></button>
            {addMenuFor === node.id && (
              <div className="absolute top-full mt-1 left-0 z-40 w-40 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden" role="menu" aria-label="Add block">
                {ADD_ITEMS.map(({ type, label, Icon }) => (
                  <button key={type} onClick={() => addChild(node.id, type)} className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-left text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"><Icon className="w-3.5 h-3.5 text-gray-400" /> {label}</button>
                ))}
              </div>
            )}
          </div>
        )}
        {!isRoot && <>
          <button onClick={() => onChange(moveBoxStep(root, node.id, -1))} aria-label="Move block up" className="p-1 rounded text-white/90 hover:bg-white/15"><ChevronUp className="w-3.5 h-3.5" /></button>
          <button onClick={() => onChange(moveBoxStep(root, node.id, 1))} aria-label="Move block down" className="p-1 rounded text-white/90 hover:bg-white/15"><ChevronDown className="w-3.5 h-3.5" /></button>
          <button onClick={() => onChange(duplicateBox(root, node.id))} aria-label="Duplicate block" className="p-1 rounded text-white/90 hover:bg-white/15"><Copy className="w-3.5 h-3.5" /></button>
          <button onClick={() => { onChange(removeBox(root, node.id)); select(null); }} aria-label="Delete block" className="p-1 rounded text-red-300 hover:bg-red-500/30"><Trash2 className="w-3.5 h-3.5" /></button>
        </>}
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
      return <h2 style={{ color: node.color || theme.text, fontFamily: theme.headingFont, fontSize: node.fontSize ?? 32, fontWeight: node.bold ? 800 : 600, textAlign: align, width: "100%" }}><EditableText value={node.text} editable={editable} onChange={onText} placeholder="Heading" /></h2>;
    case "button":
      return <a href={node.href || "#"} onClick={(e) => editable && e.preventDefault()} className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm" style={{ background: node.background ? colorToCSS(node.background) : theme.primary, color: node.color || "#fff" }}><EditableText value={node.text} editable={editable} onChange={onText} placeholder="Button" /></a>;
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
      return <p style={{ color: node.color || theme.textMuted, fontSize: node.fontSize ?? 16, textAlign: align, width: "100%" }}><EditableText value={node.text} editable={editable} onChange={onText} placeholder="Add text" /></p>;
  }
}
