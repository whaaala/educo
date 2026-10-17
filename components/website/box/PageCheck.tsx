"use client";

/**
 * THE PAGE CHECK (semantics decision C1) — only what needs the user's own words, in plain language, with the fix
 * right beside it. Everything that could be corrected without a person was already corrected by `resolvePage`; those
 * are listed as "fixed for you" so nothing is a mystery. No jargon: never "landmark" or "banner".
 * Behaviours: tests/features/components/website/box-builder-semantics.feature
 */
import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";
import CompactField from "@/components/shared/CompactField";
import { type BoxNode, findBox } from "@/lib/box-model";
import { CHECK_HEIGHT, CHECK_WIDTHS, measureSpace, screensInWords, spaceName, type SpaceKind } from "@/lib/space-check";
import type { RungName } from "@/lib/educo-ui/layout";
import InPageSpinner from "@/components/shared/InPageSpinner";
import { resolvePage, pageCheck, corrections, type SiteFonts } from "@/lib/semantics";
import { familyOf } from "@/lib/educo-ui/fonts";

/** How many things need the user — for the toolbar badge. */
export function pageCheckCount(root: BoxNode, fonts?: SiteFonts): number {
  return pageCheck(root, undefined, fonts).length;
}

type Measured = { id: string; kind: SpaceKind; rungs: RungName[] };

/**
 * LE-1 (S-3): the published page measured at every width of CHECK_WIDTHS, one hidden frame at a time — the space the tree
 * cannot tell (words at an edge, touching their box, sections whose words touch, a word broken in a narrow column).
 * ponytail: measured in the fonts the frame has (the site's web fonts are not fetched here), and only while the check is
 * open — the toolbar badge counts the tree's checks.
 */
function useMeasuredSpace(html: string | undefined, open: boolean): Measured[] | null {
  const [found, setFound] = useState<Measured[] | null>(null);
  useEffect(() => {
    if (!open || !html) { setFound(null); return; }
    let live = true;
    const all = new Map<string, Measured>();
    const frame = document.createElement("iframe");
    frame.setAttribute("aria-hidden", "true"); frame.tabIndex = -1; frame.title = "Page check measurement";
    // LE1-6: the app's stylesheet caps an iframe at `max-width: 100%` — from a 375 editor every width was measured at 375
    Object.assign(frame.style, { position: "fixed", left: "-200vw", top: "0", height: `${CHECK_HEIGHT}px`, maxWidth: "none", minWidth: "0", border: "0", opacity: "0", pointerEvents: "none" });
    document.body.appendChild(frame);
    const at = async (i: number): Promise<void> => {
      if (!live) return;
      if (i >= CHECK_WIDTHS.length) { setFound(Array.from(all.values())); return; }
      const { rung, px } = CHECK_WIDTHS[i];
      frame.style.width = `${px}px`; // a screen's CSS px: the width under measure, not a size drawn on the page
      await new Promise<void>((done) => { frame.onload = () => done(); frame.srcdoc = html; });
      const doc = frame.contentDocument;
      if (doc) {
        await doc.fonts?.ready;
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        for (const h of measureSpace(doc)) {
          const k = `${h.id}|${h.kind}`, m = all.get(k);
          if (m) m.rungs.push(rung); else all.set(k, { ...h, rungs: [rung] });
        }
      }
      return at(i + 1);
    };
    setFound(null);
    at(0).catch(() => { if (live) setFound([]); }).finally(() => frame.remove());
    return () => { live = false; frame.remove(); };
  }, [html, open]);
  return found;
}

const SPACE_WORDS: Record<SpaceKind, (name: string, screens: string) => string> = {
  "words-near-edge": (b, on) => `Words in this ${b} come closer than 1rem to the page's edge on ${on}, which makes them hard to read. Give its section some space at the sides.`,
  "words-touch-box": (b, on) => `Words in this ${b} touch the edge of their coloured box on ${on}. Give the box some inner spacing.`,
  "sections-close": (b, on) => `The words of this ${b} and the section under it are closer than 1rem on ${on}, so they run together. Add space between them.`,
  "words-broken": (b, on) => `This ${b} is too narrow for its words on ${on} — a word breaks in the middle. Give it more room there, or let the blocks stack.`,
};

export default function PageCheck({ root, fonts, html, isOpen, onClose, onShow, onPatch, onSideSpace }: {
  root: BoxNode;
  /** The PUBLISHED page (`renderSitePage`) — measured at every screen size for space and narrow columns (LE-1). */
  html?: string;
  /** The site's heading + body fonts — what a block without a font of its own is drawn in (A-1b). */
  fonts?: SiteFonts;
  isOpen: boolean;
  onClose: () => void;
  /** Select the block on the canvas (and close). */
  onShow: (id: string) => void;
  onPatch: (id: string, patch: Partial<BoxNode>) => void;
  /** Set the site's side space (Layout guides' "Side space") — the fix for words at the page's edge. */
  onSideSpace?: (value: number) => void;
}) {
  const sem = resolvePage(root);
  const issues = pageCheck(root, sem, fonts);
  const fixed = corrections(sem);
  const measured = useMeasuredSpace(html, isOpen);
  // a block the tree already flags at the page edge (with its one-click fix) is not listed twice
  const spaced = (measured ?? []).filter((m) => findBox(root, m.id) && !(m.kind === "words-near-edge" && issues.some((i) => i.kind === "words-at-edge")));
  const [alt, setAlt] = useState<Record<string, string>>({});
  const text = "text-[0.8125rem] text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50";
  const muted = "text-[0.75rem] text-gray-500 dark:text-gray-400 midnight:text-slate-400 purple:text-purple-200";
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Page check" subtitle="Makes sure everyone can use this page — including people using screen readers" icon={<ShieldCheck className="w-5 h-5" />} maxWidth="lg">
      <div className="space-y-5">
        <section aria-labelledby="pc-needs">
          <h3 id="pc-needs" className={`${text} font-semibold mb-2`}>
            {issues.length + spaced.length ? `Needs your words (${issues.length + spaced.length})` : measured || !html ? "Nothing needs your words — this page is ready." : "Checking the page…"}
          </h3>
          <ul className="space-y-3">
            {issues.map((i) => (
              <li key={i.id + i.kind} className="rounded-xl border border-line p-3 space-y-2">
                <p className={text}>{i.message}{i.blocks ? "" : " (a suggestion — it won't stop you publishing)"}</p>
                {i.kind === "image-description" && (
                  <div className="flex flex-wrap items-end gap-2">
                    <div className="flex-1 min-w-[12rem]">
                      <CompactField label="What does the picture show?" ariaLabel="Picture description" value={alt[i.id] ?? ""} placeholder="e.g. Pupils reading in the library"
                        onChange={(v) => setAlt((a) => ({ ...a, [i.id]: String(v) }))} />
                    </div>
                    <Button size="sm" disabled={!(alt[i.id] ?? "").trim()} onClick={() => onPatch(i.id, { alt: (alt[i.id] ?? "").trim() })}>Save description</Button>
                    <Button size="sm" variant="outline" onClick={() => onPatch(i.id, { alt: "" })}>It&rsquo;s only decoration</Button>
                  </div>
                )}
                {i.kind === "heading-jump" && i.fix?.level && (
                  <Button size="sm" onClick={() => onPatch(i.id, { level: i.fix!.level })}>Make it level {i.fix.level}</Button>
                )}
                {i.kind === "words-at-edge" && i.fix?.sideSpace !== undefined && onSideSpace && (
                  <Button size="sm" onClick={() => onSideSpace(i.fix!.sideSpace!)}>Add space at the sides</Button>
                )}
                {i.kind === "font-letters" && i.fix?.font && (
                  <Button size="sm" onClick={() => onPatch(i.id, { fontFamily: i.fix!.font })}>Use {familyOf(i.fix.font)} for this block</Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => onShow(i.id)}>Show me</Button>
              </li>
            ))}
            {spaced.map((m) => (
              <li key={m.id + m.kind} className="rounded-xl border border-line p-3 space-y-2" data-space-kind={m.kind}>
                <p className={text}>{SPACE_WORDS[m.kind](spaceName(findBox(root, m.id)), screensInWords(m.rungs))} (a suggestion — it won&rsquo;t stop you publishing)</p>
                <Button size="sm" variant="ghost" onClick={() => onShow(m.id)}>Show me</Button>
              </li>
            ))}
          </ul>
          {html && !measured && <InPageSpinner loadingText="Measuring the page at every screen size…" />}
        </section>
        {fixed.length > 0 && (
          <section aria-labelledby="pc-fixed">
            <h3 id="pc-fixed" className={`${text} font-semibold mb-2`}>Fixed for you ({fixed.length})</h3>
            <ul className="space-y-2">
              {fixed.map((f) => (
                <li key={f.id} className="flex items-start justify-between gap-3">
                  <p className={muted}>{f.message}</p>
                  <Button size="sm" variant="ghost" onClick={() => onShow(f.id)}>Show me</Button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Modal>
  );
}
