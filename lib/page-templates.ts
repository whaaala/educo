/**
 * A NEW PAGE FROM A TEMPLATE (BATCH LE-15, PS-5 (3) — box-builder-sections.feature).
 *
 * A template is a list of sections (config/page-templates.json, or a page a person saved as their own, lib/saved-sections
 * `myTemplates`). The page made from it is a COPY — its sections ordinary blocks, each a band, on the page grid — and
 * `addPage` gives it the site's shared header and footer when the site has them. Linked page frames (Framer's layout
 * templates) are Nice, BATCH L-24 (D8). Pure and portable (rule 20).
 */
import { buildSection, type SectionDef } from "@/lib/section-library";
import { makeRowBand, normalizeRowBands, markPageGrid, type BoxNode } from "@/lib/box-model";
import { emptyPageRoot } from "@/lib/box-site";

export type SectionLookup = (id: string) => SectionDef | undefined;

/** The page a built-in template makes, in the finish chosen; a section id the library does not hold is left out. */
export function templatePage(sectionIds: string[], lookup: SectionLookup, opts: { finish: string; wireframe: boolean }): BoxNode {
  const root = emptyPageRoot();
  root.children = sectionIds.flatMap((id) => { const def = lookup(id); return def ? [makeRowBand([buildSection(def, opts)])] : []; });
  return markPageGrid(normalizeRowBands(root));
}
