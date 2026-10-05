"use client";

/**
 * THE PAGE CHECK (semantics decision C1) — only what needs the user's own words, in plain language, with the fix
 * right beside it. Everything that could be corrected without a person was already corrected by `resolvePage`; those
 * are listed as "fixed for you" so nothing is a mystery. No jargon: never "landmark" or "banner".
 * Behaviours: tests/features/components/website/box-builder-semantics.feature
 */
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";
import CompactField from "@/components/shared/CompactField";
import type { BoxNode } from "@/lib/box-model";
import { resolvePage, pageCheck, corrections } from "@/lib/semantics";

/** How many things need the user — for the toolbar badge. */
export function pageCheckCount(root: BoxNode): number {
  return pageCheck(root).length;
}

export default function PageCheck({ root, isOpen, onClose, onShow, onPatch }: {
  root: BoxNode;
  isOpen: boolean;
  onClose: () => void;
  /** Select the block on the canvas (and close). */
  onShow: (id: string) => void;
  onPatch: (id: string, patch: Partial<BoxNode>) => void;
}) {
  const sem = resolvePage(root);
  const issues = pageCheck(root, sem);
  const fixed = corrections(sem);
  const [alt, setAlt] = useState<Record<string, string>>({});
  const text = "text-[0.8125rem] text-gray-800 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50";
  const muted = "text-[0.75rem] text-gray-500 dark:text-gray-400 midnight:text-slate-400 purple:text-purple-200";
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Page check" subtitle="Makes sure everyone can use this page — including people using screen readers" icon={<ShieldCheck className="w-5 h-5" />} maxWidth="lg">
      <div className="space-y-5">
        <section aria-labelledby="pc-needs">
          <h3 id="pc-needs" className={`${text} font-semibold mb-2`}>
            {issues.length ? `Needs your words (${issues.length})` : "Nothing needs your words — this page is ready."}
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
                <Button size="sm" variant="ghost" onClick={() => onShow(i.id)}>Show me</Button>
              </li>
            ))}
          </ul>
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
