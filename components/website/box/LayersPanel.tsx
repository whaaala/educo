"use client";

/**
 * ED-2b · THE LAYERS TREE (BATCH LE-14; design D3 — the WordPress editor's List View, Figma's keys, Webflow's Navigator).
 * Every block of the page in reading order, nested as it is built, row bands never shown (`layerRows`). A row selects its
 * block (Shift adds it), is renamed (F2, or a double-click), hidden on the screen being edited, locked, dragged to a new place
 * (`moveLayer`: the top or bottom quarter of a row puts it before / after, the middle of a box puts it inside), and has the
 * canvas's actions in its ⋮ menu. Built to the WAI-ARIA tree view pattern (docs/web-anatomy/components.md §Tree view):
 * one tab stop, the arrows, Home / End, Right opens or goes in, Left closes or goes out, Enter selects.
 * ponytail: no type-ahead (the pattern's optional key) — a page's blocks are few enough to arrow through.
 */
import { useMemo, useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { ChevronRight, Eye, EyeOff, Lock, LockOpen, MoreVertical, Copy, ArrowUp, ArrowDown, Trash2, Pencil, Globe } from "lucide-react";
import {
  type BoxNode, type Breakpoint, layerRows, moveLayer, updateBox, updateBoxResponsive, resolveResponsive, duplicateBox, deleteBox,
  moveBlock, canMoveBlock, findBox,
} from "@/lib/box-model";
import { RUNG_LABEL } from "@/lib/educo-ui/layout";
import { blockLabel } from "@/components/website/box/BoxInspector";
import { PortalMenu, MenuItem } from "@/components/website/box/ui";
import INSPECTOR from "@/config/inspector.json";

const L = INSPECTOR.layers;
type Place = "before" | "after" | "inside";

export default function LayersPanel({ root, selectedIds, breakpoint, onSelect, onChange }: {
  root: BoxNode;
  selectedIds: string[];
  breakpoint: Breakpoint;
  /** A row was chosen: select its block (`add`: Shift, add it to the selection) and bring it into view. */
  onSelect: (id: string, add: boolean) => void;
  /** One commit — one undo step. */
  onChange: (next: BoxNode) => void;
}) {
  const rows = useMemo(() => layerRows(root), [root]);
  const [shut, setShut] = useState<Set<string>>(new Set());
  const [focusId, setFocusId] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [drop, setDrop] = useState<{ id: string; place: Place } | null>(null);
  const [menu, setMenu] = useState<{ id: string; rect: DOMRect } | null>(null);
  // LE14-9: a touch screen has no Shift — "Select several" makes every tap on a row add its block, or take it out
  const [several, setSeveral] = useState(false);
  const dragId = useRef<string | null>(null);
  const rowEls = useRef(new Map<string, HTMLDivElement>());

  // a row under a shut one is not shown
  const shown = useMemo(() => {
    const out: typeof rows = []; const hiddenUnder = new Set<string>();
    for (const r of rows) {
      if (r.parentId && (hiddenUnder.has(r.parentId) || shut.has(r.parentId))) { hiddenUnder.add(r.node.id); continue; }
      out.push(r);
    }
    return out;
  }, [rows, shut]);
  const current = focusId && shown.some((r) => r.node.id === focusId) ? focusId : selectedIds.find((id) => shown.some((r) => r.node.id === id)) ?? shown[0]?.node.id ?? null;
  const screen = breakpoint === "base" ? L.everyScreen : (RUNG_LABEL[breakpoint] ?? "");
  const focusRow = (id: string | null | undefined) => { if (!id) return; setFocusId(id); requestAnimationFrame(() => rowEls.current.get(id)?.focus()); };
  const toggle = (id: string, open?: boolean) => setShut((s) => { const n = new Set(s); if (open ?? n.has(id)) n.delete(id); else n.add(id); return n; });

  const onKey = (e: KeyboardEvent, i: number) => {
    const r = shown[i]; if (!r || renaming) return;
    const open = r.kids > 0 && !shut.has(r.node.id);
    const go = (j: number) => { e.preventDefault(); focusRow(shown[Math.max(0, Math.min(shown.length - 1, j))]?.node.id); };
    if (e.key === "ArrowDown") go(i + 1);
    else if (e.key === "ArrowUp") go(i - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(shown.length - 1);
    else if (e.key === "ArrowRight") { e.preventDefault(); if (r.kids && !open) toggle(r.node.id, true); else if (open) focusRow(shown[i + 1]?.node.id); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); if (open) toggle(r.node.id, false); else focusRow(r.parentId); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(r.node.id, e.shiftKey); }
    else if (e.key === "F2") { e.preventDefault(); setRenaming(r.node.id); }
    // the row's controls by keyboard: its menu (Shift+F10 or the Menu key) holds Rename, Hide and Lock as well
    else if (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10")) { e.preventDefault(); setMenu({ id: r.node.id, rect: e.currentTarget.getBoundingClientRect() }); }
  };

  const placeAt = (e: DragEvent, r: (typeof rows)[number]): Place => {
    const b = e.currentTarget.getBoundingClientRect(), y = (e.clientY - b.top) / Math.max(1, b.height);
    const box = r.node.type === "container" && !r.node.preset;
    return box ? (y < 0.25 ? "before" : y > 0.75 ? "after" : "inside") : y < 0.5 ? "before" : "after";
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    const from = dragId.current; dragId.current = null; const at = drop; setDrop(null);
    if (from && at) { const next = moveLayer(root, from, at.id, at.place); if (next !== root) onChange(next); }
  };

  const hide = (n: BoxNode) => {
    const now = !!resolveResponsive(n, breakpoint).hidden;
    onChange(updateBoxResponsive(root, n.id, { hidden: now ? undefined : true }, breakpoint));
  };
  const menuNode = menu ? findBox(root, menu.id) : null;

  if (!rows.length) return <p className="px-4 py-3 text-xs text-muted">{L.empty}</p>;
  return (
    <div className="flex flex-col min-h-0 flex-1">
      <p className="px-4 pb-2 text-[0.6875rem] text-muted">{L.hint}</p>
      <label className="mx-4 mb-2 pointer-coarse:min-h-11 inline-flex items-center gap-2 text-xs text-ink">
        <input type="checkbox" checked={several} onChange={(e) => setSeveral(e.target.checked)} className="accent-brand" /> {L.several}
      </label>
      <div role="tree" aria-label={L.title} aria-multiselectable="true" className="px-2 pb-4 overflow-y-auto flex-1" onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDrop(null); }}>
        {shown.map((r, i) => {
          const n = r.node, name = blockLabel(n), sel = selectedIds.includes(n.id), open = r.kids > 0 && !shut.has(n.id);
          const hidden = !!resolveResponsive(n, breakpoint).hidden;
          const words = n.type !== "container" && n.text ? n.text.replace(/<[^>]+>/g, "").slice(0, 32) : "";
          const mark = drop?.id === n.id ? drop.place : null;
          return (
            <div key={n.id} ref={(el) => { if (el) rowEls.current.set(n.id, el); else rowEls.current.delete(n.id); }}
              role="treeitem" aria-level={r.level} aria-selected={sel} aria-expanded={r.kids ? open : undefined}
              aria-label={`${name}${words ? ` — ${words}` : ""}${n.globalId ? `, ${INSPECTOR.sections.globalMark.replace("{name}", n.globalName ?? "")}` : ""}${hidden ? `, ${L.hiddenHere.replace("{screen}", screen)}` : ""}${n.locked ? `, ${L.locked}` : ""}`}
              tabIndex={current === n.id ? 0 : -1} data-layer-id={n.id}
              draggable={renaming !== n.id}
              onDragStart={(e) => { dragId.current = n.id; e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", n.id); }}
              onDragOver={(e) => { if (!dragId.current) return; e.preventDefault(); const place = placeAt(e, r); if (drop?.id !== n.id || drop.place !== place) setDrop({ id: n.id, place }); }}
              onDrop={onDrop} onDragEnd={() => { dragId.current = null; setDrop(null); }}
              onClick={(e) => { setFocusId(n.id); onSelect(n.id, e.shiftKey || several); }}
              onDoubleClick={() => setRenaming(n.id)}
              onKeyDown={(e) => onKey(e, i)}
              onFocus={() => setFocusId(n.id)}
              style={{ paddingLeft: `${(r.level - 1) * 0.875 + 0.25}rem` }}
              className={`group relative flex items-center gap-1 rounded-lg pr-1 py-0.5 pointer-coarse:min-h-11 text-xs cursor-default outline-none focus-visible:ring-2 focus-visible:ring-brand
                ${sel ? "bg-brand/15 text-ink font-semibold" : "text-ink hover:bg-surface-2"} ${hidden ? "opacity-60" : ""}
                ${mark === "inside" ? "ring-2 ring-brand" : ""}`}>
              {mark === "before" && <span aria-hidden="true" className="absolute inset-x-1 top-0 h-0.5 rounded bg-brand" />}
              {mark === "after" && <span aria-hidden="true" className="absolute inset-x-1 bottom-0 h-0.5 rounded bg-brand" />}
              {r.kids ? (
                <button type="button" tabIndex={-1} aria-hidden="true" onClick={(e) => { e.stopPropagation(); toggle(n.id); }} className="grid place-items-center w-5 h-5 shrink-0 rounded text-muted hover:text-ink">
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform motion-reduce:transition-none ${open ? "rotate-90" : ""}`} />
                </button>
              ) : <span aria-hidden="true" className="w-5 shrink-0" />}
              {renaming === n.id ? (
                <input autoFocus defaultValue={n.layerName ?? ""} placeholder={name} aria-label={L.rename.replace("{name}", name)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Escape") { setRenaming(null); focusRow(n.id); }
                    if (e.key === "Enter") { const v = e.currentTarget.value.trim(); onChange(updateBox(root, n.id, { layerName: v || undefined })); setRenaming(null); focusRow(n.id); }
                  }}
                  onBlur={(e) => { const v = e.currentTarget.value.trim(); if (v !== (n.layerName ?? "")) onChange(updateBox(root, n.id, { layerName: v || undefined })); setRenaming(null); }}
                  className="flex-1 min-w-0 px-1.5 py-0.5 rounded border border-line bg-surface text-xs text-ink" />
              ) : (
                <span className="flex-1 min-w-0 truncate">{name}{words && <span className="ml-1 font-normal text-muted">{words}</span>}
                  {/* LE-15 PS-5 (2): a global section's copy — an icon, the word and its name, never colour alone (WCAG 1.4.1) */}
                  {n.globalId && <span className="ml-1 inline-flex items-center gap-0.5 font-semibold text-emerald-700 dark:text-emerald-300 midnight:text-emerald-300 purple:text-emerald-300"><Globe aria-hidden="true" className="w-3 h-3" />{INSPECTOR.sections.globalMark.replace("{name}", n.globalName ?? "")}</span>}
                </span>
              )}
              {/* the row's own controls: one tab stop is the tree's, so these are reached by the pointer and named for a screen reader through the row */}
              <span className={`flex items-center gap-0.5 shrink-0 ${hidden || n.locked ? "" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-coarse:opacity-100"}`}>
                <button type="button" tabIndex={-1} onClick={(e) => { e.stopPropagation(); hide(n); }} aria-label={(hidden ? L.show : L.hide).replace("{name}", name).replace("{screen}", screen)} title={(hidden ? L.show : L.hide).replace("{name}", name).replace("{screen}", screen)}
                  className="grid place-items-center w-6 h-6 pointer-coarse:w-11 pointer-coarse:h-11 rounded text-muted hover:text-ink hover:bg-surface-2">{hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                <button type="button" tabIndex={-1} onClick={(e) => { e.stopPropagation(); onChange(updateBox(root, n.id, { locked: n.locked ? undefined : true })); }} aria-label={(n.locked ? L.unlock : L.lock).replace("{name}", name)} title={(n.locked ? L.unlock : L.lock).replace("{name}", name)}
                  className="grid place-items-center w-6 h-6 pointer-coarse:w-11 pointer-coarse:h-11 rounded text-muted hover:text-ink hover:bg-surface-2">{n.locked ? <Lock className="w-3.5 h-3.5" /> : <LockOpen className="w-3.5 h-3.5" />}</button>
                <button type="button" tabIndex={-1} aria-haspopup="menu" onClick={(e) => { e.stopPropagation(); setMenu({ id: n.id, rect: e.currentTarget.getBoundingClientRect() }); }} aria-label={L.more.replace("{name}", name)}
                  className="grid place-items-center w-6 h-6 pointer-coarse:w-11 pointer-coarse:h-11 rounded text-muted hover:text-ink hover:bg-surface-2"><MoreVertical className="w-3.5 h-3.5" /></button>
              </span>
            </div>
          );
        })}
      </div>
      {menu && menuNode && (
        <PortalMenu anchor={{ top: menu.rect.top, left: menu.rect.left, bottom: menu.rect.bottom, right: menu.rect.right }} onClose={() => { setMenu(null); focusRow(menu.id); }} ariaLabel={L.more.replace("{name}", blockLabel(menuNode))} width={220}>
          <MenuItem Icon={Pencil} label={L.rename.replace("{name}", blockLabel(menuNode))} hint="F2" onClick={() => { setRenaming(menu.id); setMenu(null); }} />
          <MenuItem Icon={resolveResponsive(menuNode, breakpoint).hidden ? Eye : EyeOff} label={(resolveResponsive(menuNode, breakpoint).hidden ? L.show : L.hide).replace("{name}", blockLabel(menuNode)).replace("{screen}", screen)} onClick={() => { hide(menuNode); setMenu(null); }} />
          <MenuItem Icon={menuNode.locked ? LockOpen : Lock} label={(menuNode.locked ? L.unlock : L.lock).replace("{name}", blockLabel(menuNode))} hint="Ctrl+L" onClick={() => { onChange(updateBox(root, menu.id, { locked: menuNode.locked ? undefined : true })); setMenu(null); }} />
          <MenuItem Icon={Copy} label={L.duplicate} hint="Ctrl+D" onClick={() => { onChange(duplicateBox(root, menu.id)); setMenu(null); }} />
          <MenuItem Icon={ArrowUp} label={L.moveUp} disabled={!canMoveBlock(root, menu.id, -1)} onClick={() => { onChange(moveBlock(root, menu.id, -1)); setMenu(null); }} />
          <MenuItem Icon={ArrowDown} label={L.moveDown} disabled={!canMoveBlock(root, menu.id, 1)} onClick={() => { onChange(moveBlock(root, menu.id, 1)); setMenu(null); }} />
          <MenuItem Icon={Trash2} label={L.delete} danger hint="Delete" onClick={() => { onChange(deleteBox(root, menu.id)); setMenu(null); }} />
        </PortalMenu>
      )}
    </div>
  );
}
