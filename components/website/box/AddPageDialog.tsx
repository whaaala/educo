"use client";
/**
 * ADD A PAGE (BATCH LE-15, PS-5 (3) — box-builder-sections.feature "Adding a page from a template").
 *
 * A name, then where it starts: Blank · Duplicate this page · a page template (the built-in ones, drawn live in the wireframe
 * or a finish, RULE S) · My templates (rename, delete). A click adds the page; it is a copy, and takes the site's shared
 * header and footer (`addPage`). The shared Modal, FormInput, Button, CompactSelect — never `prompt()`.
 */
import { useEffect, useMemo, useState } from "react";
import TEMPLATES from "@/config/page-templates.json";
import INSPECTOR from "@/config/inspector.json";
import Modal from "@/components/shared/Modal";
import FormInput from "@/components/shared/FormInput";
import Button from "@/components/shared/Button";
import CompactSelect from "@/components/shared/CompactSelect";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import { FINISH_IDS, finishLabel, type SectionDef } from "@/lib/section-library";
import { templatePage } from "@/lib/page-templates";
import { myTemplates, MY_SECTIONS_EVENT, type SavedSection } from "@/lib/saved-sections";
import type { BoxNode } from "@/lib/box-model";
import type { SiteTheme } from "@/lib/site-storage";
import { Tile, loadAll } from "./SectionsPanel";
import NameDialog from "./NameDialog";
import { Segmented } from "./ui";

const T = INSPECTOR.sections;
const fill = (s: string, v: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");

export default function AddPageDialog({ open, theme, start, currentName, onClose, onBlank, onDuplicate, onTemplate }: {
  open: boolean; theme: SiteTheme; start: string; currentName: string; onClose: () => void;
  onBlank: (name: string) => void; onDuplicate: () => void; onTemplate: (name: string, root: BoxNode) => void;
}) {
  const [name, setName] = useState(start);
  useEffect(() => { if (open) setName(start); }, [open, start]);
  const [defs, setDefs] = useState<SectionDef[] | null>(null);
  useEffect(() => { if (open && !defs) loadAll().then((all) => setDefs(all.flatMap((c) => c.sections))); }, [open, defs]);
  const [look, setLook] = useState<"wireframe" | "designed">("designed");
  const [finish, setFinish] = useState(FINISH_IDS[0]);
  const [mine, setMine] = useState<SavedSection[]>([]);
  useEffect(() => { const read = () => setMine(myTemplates.list()); read(); window.addEventListener(MY_SECTIONS_EVENT, read); return () => window.removeEventListener(MY_SECTIONS_EVENT, read); }, []);
  const [renaming, setRenaming] = useState<SavedSection | null>(null);
  const [deleting, setDeleting] = useState<SavedSection | null>(null);
  const pages = useMemo(() => (defs ? TEMPLATES.templates.map((t) => ({ t, root: templatePage(t.sections, (id) => defs.find((d) => d.id === id), { finish, wireframe: look === "wireframe" }) })) : []), [defs, finish, look]);
  const pageName = name.trim() || start;

  return (
    <>
      <Modal isOpen={open} onClose={onClose} title={T.addPageTitle} maxWidth="3xl">
        <div className="space-y-4">
          <FormInput label={T.pageName} value={name} onChange={setName} />
          <div className="space-y-2">
            <span className="block text-[0.6875rem] font-bold uppercase tracking-wider text-muted">{T.startFrom}</span>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => onBlank(pageName)}>{T.blank}</Button>
              <Button variant="secondary" onClick={onDuplicate}>{fill(T.duplicate, { name: currentName })}</Button>
            </div>
          </div>
          <div className="space-y-2">
            <span className="block text-[0.6875rem] font-bold uppercase tracking-wider text-muted">{T.templates}</span>
            <p className="text-[0.75rem] text-muted">{T.templateHint}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Segmented full ariaLabel={T.look} value={look} onChange={setLook} options={[{ value: "wireframe" as const, label: T.wireframe }, { value: "designed" as const, label: T.designed }]} />
              {look === "designed" && <CompactSelect label={T.finish} value={finish} onChange={setFinish} options={FINISH_IDS.map((id) => ({ value: id, label: finishLabel(id) }))} />}
            </div>
            {!defs ? <p role="status" className="text-[0.8125rem] text-muted">{T.loading}</p> : (
              <div className="grid gap-3 sm:grid-cols-3">
                {pages.map(({ t, root }) => <Tile key={t.id} whole def={{ name: t.name }} cat={{ label: T.templates }} node={root} theme={theme} onAdd={() => onTemplate(pageName, root)} />)}
              </div>
            )}
          </div>
          {mine.length > 0 && (
            <div className="space-y-2">
              <span className="block text-[0.6875rem] font-bold uppercase tracking-wider text-muted">{T.myTemplates}</span>
              <div className="grid gap-3 sm:grid-cols-3">
                {mine.map((m) => (
                  <div key={m.id} className="space-y-1">
                    <Tile whole def={{ name: m.name }} cat={{ label: T.myTemplates }} node={m.node} theme={theme} onAdd={() => { const root = myTemplates.copy(m.id); if (root) onTemplate(pageName, root); }} />
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setRenaming(m)}>{T.rename}</Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleting(m)}>{T.delete}</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
      <NameDialog open={!!renaming} title={T.renameTemplateTitle} label={T.saveLabel} confirm={T.rename} start={renaming?.name ?? ""}
        onCancel={() => setRenaming(null)} onConfirm={(n) => { if (renaming) myTemplates.rename(renaming.id, n); setRenaming(null); }} />
      <DeleteConfirmationModal isOpen={!!deleting} onClose={() => setDeleting(null)} onConfirm={() => { if (deleting) myTemplates.remove(deleting.id); setDeleting(null); }}
        title={fill(T.deleteTemplateTitle, { name: deleting?.name ?? "" })} confirmButtonText={T.delete} warningMessage={T.deleteTemplateWarning} />
    </>
  );
}
