"use client";
/**
 * THE SECTIONS GROUP of the Add panel (BATCH LE-15, ED-4+ (2) — box-builder-sections.feature).
 *
 * Categories down the side, a tile per layout, Wireframe | Designed and the Finish (the seven personalities). A tile is
 * the section's REAL published page, drawn small (RULE S): the same `renderSitePage` the Preview shows, so a tile can
 * never promise a look the page will not have. A category's layouts are read only when the panel opens (config/sections/).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import SECTIONS from "@/config/sections.json";
import INSPECTOR from "@/config/inspector.json";
import { buildSection, FINISH_IDS, finishLabel, type SectionDef } from "@/lib/section-library";
import { emptyPageRoot, type BoxSite } from "@/lib/box-site";
import { renderSitePage } from "@/lib/box-export";
import type { BoxNode } from "@/lib/box-model";
import type { SiteTheme } from "@/lib/site-storage";
import CompactSelect from "@/components/shared/CompactSelect";
import Button from "@/components/shared/Button";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import { listSaved, savedAsNode, renameSaved, deleteSaved, MY_SECTIONS_EVENT, type SavedSection } from "@/lib/saved-sections";
import NameDialog from "./NameDialog";
import { Segmented } from "./ui";

type Category = { id: string; label: string; group: string; count: number };
const T = INSPECTOR.sections;
const fill = (s: string, v: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");
/** The desktop width a tile is drawn at, then scaled to the tile (the Preview's Desktop rung). */
const TILE_PAGE_PX = 1280;

/** Every category that has its layouts written, with them — read once, the first time the group opens. */
let loaded: Promise<{ cat: Category; sections: SectionDef[] }[]> | null = null;
function loadAll() {
  loaded ??= Promise.allSettled((SECTIONS.categories as Category[]).map(async (cat) => {
    const mod = (await import(`@/config/sections/${cat.id}.json`)) as { default?: { sections: SectionDef[] }; sections?: SectionDef[] };
    return { cat, sections: (mod.default ?? mod).sections ?? [] };
  })).then((all) => all.flatMap((r) => (r.status === "fulfilled" && r.value.sections.length ? [r.value] : [])));
  return loaded;
}

/** The section on a page of its own, as the Preview draws it. */
function previewDoc(section: BoxNode, theme: SiteTheme): string {
  const site = { pages: [{ id: "p", name: "Preview", path: "p", root: emptyPageRoot(section) }], homeId: "p" } as BoxSite;
  return renderSitePage(site, theme, "p", { inlineShared: true });
}

function Tile({ def, cat, node, theme, onAdd }: { def: { name: string; needs?: string[] }; cat: { label: string }; node: BoxNode; theme: SiteTheme; onAdd: () => void }) {
  const box = useRef<HTMLButtonElement>(null);
  const [scale, setScale] = useState(0.2);
  const [h, setH] = useState(400);
  const [top, setTop] = useState(0);
  const doc = useMemo(() => previewDoc(node, theme), [node, theme]);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / TILE_PAGE_PX));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const name = fill(T.add, { name: def.name, category: cat.label });
  return (
    <button ref={box} type="button" onClick={onAdd} aria-label={name} title={name}
      className="group relative block w-full shrink-0 overflow-hidden rounded-lg border border-line bg-surface-2 text-left transition hover:ring-2 hover:ring-brand focus-visible:ring-2 focus-visible:ring-brand outline-none"
      style={{ height: `${Math.min(h, 720) * scale}px` }}>
      <iframe srcDoc={doc} title={def.name} aria-hidden="true" tabIndex={-1} loading="lazy"
        onLoad={(e) => {
          // Framed on the SECTION, not the page: a footer sits at the foot of a page shorter than the screen (the page's
          // own rule), so the whole page showed a tile of white with the footer at its bottom edge.
          const d = e.currentTarget.contentDocument; const el = d?.querySelector<HTMLElement>(node.tag ?? "section");
          if (!el) return; const r = el.getBoundingClientRect();
          setTop(Math.round(r.top + (d?.defaultView?.scrollY ?? 0))); setH(Math.max(80, Math.round(r.height)));
        }}
        // maxWidth none: globals.css carries an unlayered `iframe { max-width: 100% }`, which clamped the 1280px page to the
        // tile's width before it was scaled — the page was laid out as a thin strip (box-builder-site.feature names the trap)
        style={{ width: `${TILE_PAGE_PX}px`, maxWidth: "none", height: `${top + Math.min(h, 720)}px`, transform: `scale(${scale}) translateY(${-top}px)`, transformOrigin: "top left", pointerEvents: "none", border: 0 }} />
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-surface/90 px-2 py-1 text-[0.6875rem] font-semibold text-ink">
        <span className="truncate">{def.name}</span>
        {def.needs?.length ? <span className="shrink-0 font-medium text-muted">{fill(T.needs, { needs: def.needs.join(", ") })}</span> : null}
      </span>
    </button>
  );
}

const MINE = "mine";

export default function SectionsPanel({ theme, q, onInsert }: { theme: SiteTheme; q: string; onInsert: (section: BoxNode) => void }) {
  const [all, setAll] = useState<{ cat: Category; sections: SectionDef[] }[] | null>(null);
  const [catId, setCatId] = useState("hero");
  const [look, setLook] = useState<"wireframe" | "designed">("designed");
  const [finish, setFinish] = useState(FINISH_IDS[0]);
  useEffect(() => { let live = true; loadAll().then((a) => { if (live) setAll(a); }); return () => { live = false; }; }, []);
  // PS-5 (1) · MY SECTIONS: read on open, and again whenever one is saved, renamed or deleted (MY_SECTIONS_EVENT).
  const [mine, setMine] = useState<SavedSection[]>([]);
  useEffect(() => { const read = () => setMine(listSaved()); read(); window.addEventListener(MY_SECTIONS_EVENT, read); return () => window.removeEventListener(MY_SECTIONS_EVENT, read); }, []);
  const [renaming, setRenaming] = useState<SavedSection | null>(null);
  const [deleting, setDeleting] = useState<SavedSection | null>(null);

  const needle = q.trim().toLowerCase();
  const shown = useMemo(() => (all ?? []).flatMap(({ cat, sections }) =>
    sections.filter((s) => (needle ? `${s.name} ${cat.label}`.toLowerCase().includes(needle) : cat.id === catId)).map((def) => ({ def, cat }))), [all, needle, catId]);
  const mineShown = needle ? mine.filter((s) => `${s.name} ${T.mine}`.toLowerCase().includes(needle)) : catId === MINE ? mine : [];
  const wire = look === "wireframe";
  const nodes = useMemo(() => new Map(shown.map(({ def }) => [def.id, buildSection(def, { finish, wireframe: wire })])), [shown, finish, wire]);

  if (!all) return <p className="px-4 py-6 text-[0.8125rem] text-muted" role="status">{T.loading}</p>;
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-2 px-4 pb-3">
        <Segmented full ariaLabel={T.look} value={look} onChange={setLook}
          options={[{ value: "wireframe" as const, label: T.wireframe }, { value: "designed" as const, label: T.designed }]} />
        {!wire && <CompactSelect label={T.finish} value={finish} onChange={setFinish} options={FINISH_IDS.map((id) => ({ value: id, label: finishLabel(id) }))} />}
      </div>
      {/* The categories wrap as chips above the tiles, so a tile has the panel's whole width — on a phone's sheet too. */}
      {!needle && (
        <div role="tablist" aria-label={T.categories} className="flex flex-wrap gap-1 px-4 pb-3">
          {[...(mine.length ? [{ cat: { id: MINE, label: T.mine, group: "", count: 0 }, sections: mine }] : []), ...all].map(({ cat, sections }) => (
            <button key={cat.id} type="button" role="tab" aria-selected={cat.id === catId} onClick={() => setCatId(cat.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 pointer-coarse:min-h-11 pointer-coarse:px-3 text-[0.75rem] font-semibold transition-colors ${cat.id === catId ? "bg-brand text-brand-fg" : "text-muted hover:bg-surface-2 hover:text-ink"}`}>
              {cat.label}<span className="tabular-nums opacity-80">{sections.length}</span>
            </button>
          ))}
        </div>
      )}
      <div className="flex min-h-0 flex-1 px-3 pb-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2 overflow-y-auto">
          {/* My sections: as saved (no finish — they are the person's own design), each with Rename and Delete beside it. */}
          {mineShown.map((s) => (
            <div key={s.id} className="shrink-0 space-y-1">
              <Tile def={{ name: s.name }} cat={{ label: T.mine }} node={s.node} theme={theme} onAdd={() => { const n = savedAsNode(s.id); if (n) onInsert(n); }} />
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="sm" onClick={() => setRenaming(s)}>{T.rename}</Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleting(s)}>{T.delete}</Button>
              </div>
            </div>
          ))}
          {catId !== MINE || needle ? shown.map(({ def, cat }) => <Tile key={def.id} def={def} cat={cat} node={nodes.get(def.id)!} theme={theme} onAdd={() => onInsert(buildSection(def, { finish, wireframe: wire }))} />) : null}
          {needle && !shown.length && !mineShown.length && <p className="py-6 text-center text-[0.8125rem] text-muted">{fill(T.none, { q })}</p>}
        </div>
      </div>
      <NameDialog open={!!renaming} title={T.renameTitle} label={T.saveLabel} confirm={T.rename} start={renaming?.name ?? ""}
        onCancel={() => setRenaming(null)} onConfirm={(name) => { if (renaming) renameSaved(renaming.id, name); setRenaming(null); }} />
      <DeleteConfirmationModal isOpen={!!deleting} onClose={() => setDeleting(null)} onConfirm={() => { if (deleting) deleteSaved(deleting.id); setDeleting(null); }}
        title={fill(T.deleteTitle, { name: deleting?.name ?? "" })} confirmButtonText={T.delete} warningMessage={T.deleteWarning} />
    </div>
  );
}
