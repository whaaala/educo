"use client";

/**
 * LinkDialog — the ONE link editor for every workspace.
 *
 * Reusable by the presentation editor, the work-document editor, the whiteboard, the admin
 * app, and any future surface. The host passes what it supports; the dialog adapts:
 *
 *   - `showTextField`  — editors that link *text* (docs) pass true to edit the display text.
 *   - `targets`        — editors with in-document destinations (e.g. slides) pass them to
 *                        offer "link to slide" alongside "link to URL".
 *   - `onRemove`       — pass when an existing link can be removed.
 *
 * All URL logic lives in the pure `lib/link-utils` module so behaviour is identical everywhere
 * (and unit-testable without a DOM).
 */

import React, { useMemo, useState } from "react";
import { Link2, Globe, Trash2 } from "lucide-react";
import { EditorDialog, EditorDialogButton } from "@/components/shared/EditorDialogs";
import { normalizeUrl, isValidUrl, isDangerousUrl, type LinkTarget, type LinkValue } from "@/lib/link-utils";

export interface LinkDialogProps {
  /** Existing URL, if editing an already-linked object/text. */
  initialUrl?: string;
  /** Existing in-document target id, if the link points at one. */
  initialTargetId?: string;
  /** Existing display text (only used when showTextField). */
  initialText?: string;
  /** Show a "Text" field — for editors that link a run of text (documents). */
  showTextField?: boolean;
  /** In-document destinations (e.g. slides). Omit for editors that have none. */
  targets?: LinkTarget[];
  /** Label for the targets group. Defaults to "Slides". */
  targetsLabel?: string;
  onSave: (value: LinkValue & { text?: string }) => void;
  /** Provide to show a "Remove link" action (only when a link already exists). */
  onRemove?: () => void;
  onClose: () => void;
}

export default function LinkDialog({
  initialUrl = "",
  initialTargetId,
  initialText = "",
  showTextField = false,
  targets,
  targetsLabel = "Slides",
  onSave,
  onRemove,
  onClose,
}: LinkDialogProps) {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);
  const [targetId, setTargetId] = useState<string | undefined>(initialTargetId);
  const [touched, setTouched] = useState(false);

  const usingTarget = !!targetId;
  const dangerous = !usingTarget && !!url.trim() && isDangerousUrl(url);
  const valid = usingTarget || isValidUrl(url);
  const showError = touched && !!url.trim() && !valid;

  const preview = useMemo(() => (usingTarget || !url.trim() ? "" : normalizeUrl(url)), [url, usingTarget]);

  const submit = () => {
    setTouched(true);
    if (usingTarget) {
      onSave({ targetId, text: showTextField ? text : undefined });
      return;
    }
    if (!isValidUrl(url)) return;
    onSave({ url: normalizeUrl(url), text: showTextField ? text : undefined });
  };

  return (
    <EditorDialog title="Link" onClose={onClose}>
      <div className="w-[400px] max-w-[calc(100vw-2rem)] space-y-3">
        {showTextField && (
          <label className="block">
            <span className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-1">Text</span>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Text to display"
              aria-label="Link display text"
              className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
        )}

        <label className="block">
          <span className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-1">Link</span>
          <div className="relative">
            <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" aria-hidden="true" />
            <input
              autoFocus
              value={url}
              onChange={(e) => { setUrl(e.target.value); setTargetId(undefined); }}
              onBlur={() => setTouched(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); submit(); }
                if (e.key === "Escape") { e.preventDefault(); onClose(); }
              }}
              placeholder="Paste a link or search"
              aria-label="Link URL"
              aria-invalid={showError}
              aria-describedby={showError ? "link-error" : undefined}
              disabled={usingTarget}
              className={`w-full pl-8 pr-3 py-2 text-[13px] rounded-lg border bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-800 dark:text-gray-100 outline-none focus:ring-2 disabled:opacity-50 ${
                showError
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 focus:ring-blue-400"
              }`}
            />
          </div>
          {showError && (
            <p id="link-error" role="alert" className="mt-1 text-[11px] text-red-500">
              {dangerous ? "That link type isn’t allowed." : "Enter a valid link (e.g. educo.com)."}
            </p>
          )}
          {!showError && preview && preview !== url.trim() && (
            <p className="mt-1 text-[11px] text-gray-400">Will link to <span className="font-medium">{preview}</span></p>
          )}
        </label>

        {/* In-document destinations (e.g. slides in this deck) */}
        {targets && targets.length > 0 && (
          <div>
            <span className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-1">{targetsLabel}</span>
            <div className="max-h-[132px] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 divide-y divide-gray-100 dark:divide-gray-800">
              {targets.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { setTargetId(t.id); setUrl(""); }}
                  aria-pressed={targetId === t.id}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left text-[12px] transition-colors cursor-pointer ${
                    targetId === t.id
                      ? "bg-blue-50 dark:bg-blue-900/25 midnight:bg-cyan-900/25 purple:bg-pink-900/25 text-blue-700 dark:text-blue-300"
                      : "hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5 flex-shrink-0 opacity-60" aria-hidden="true" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-1">
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="mr-auto inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              Remove link
            </button>
          )}
          <EditorDialogButton variant="secondary" onClick={onClose}>Cancel</EditorDialogButton>
          <button
            type="button"
            onClick={submit}
            disabled={!valid}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </EditorDialog>
  );
}
