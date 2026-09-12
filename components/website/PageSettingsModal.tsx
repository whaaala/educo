"use client";

import { useEffect, useState } from "react";
import { Settings2, Link2, Eye, Trash2 } from "lucide-react";
import Modal from "@/components/shared/Modal";
import type { Page } from "@/lib/site-storage";

export interface PageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: Page | null;
  /** Whether the page is currently shown in the navigation. */
  inNav: boolean;
  /** False for the last remaining page. */
  canDelete: boolean;
  onSave: (pageId: string, patch: { name: string; path: string; showInNav: boolean }) => void;
  onDelete: (pageId: string) => void;
}

/**
 * Page settings (General) — rename, URL slug, and show/hide in navigation. Combines Hostinger's
 * page-settings popup with WordPress's title + permalink. Themed + component-based.
 */
export default function PageSettingsModal({ isOpen, onClose, page, inNav, canDelete, onSave, onDelete }: PageSettingsModalProps) {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [showInNav, setShowInNav] = useState(true);

  useEffect(() => {
    if (page) { setName(page.name); setPath(page.path); setShowInNav(inNav); }
  }, [page, inNav]);

  if (!page) return null;

  const save = () => onSave(page.id, { name: name.trim() || page.name, path: path.startsWith("/") ? path : `/${path}`, showInNav });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Page settings"
      subtitle={page.isHome ? "Home page" : undefined}
      icon={<Settings2 className="w-5 h-5" />}
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between gap-3">
          {canDelete ? (
            <button onClick={() => onDelete(page.id)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash2 className="w-4 h-4" /> Delete page
            </button>
          ) : <span />}
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22262e]">Cancel</button>
            <button onClick={save} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700">Save</button>
          </div>
        </div>
      }
    >
      <label className="block mb-4">
        <span className="text-xs font-medium text-muted">Page name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Page name"
          className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </label>

      <label className="block mb-4">
        <span className="text-xs font-medium text-muted">Page URL</span>
        <div className="mt-1 flex items-center rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 focus-within:ring-2 focus-within:ring-indigo-500">
          <span className="pl-3 pr-1 text-gray-400"><Link2 className="w-4 h-4" /></span>
          <input value={path} onChange={(e) => setPath(e.target.value)} disabled={page.isHome} aria-label="Page URL" className="flex-1 py-2 pr-3 bg-transparent text-gray-900 dark:text-white outline-none text-sm disabled:opacity-50" />
        </div>
        {page.isHome && <span className="text-[0.6875rem] text-gray-400 mt-1 block">The home page always lives at /</span>}
      </label>

      <div className="flex items-center justify-between p-3 rounded-lg border border-line">
        <span className="inline-flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300"><Eye className="w-4 h-4" /> Show in navigation</span>
        <button
          type="button"
          role="switch"
          aria-checked={showInNav}
          aria-label="Show in navigation"
          onClick={() => setShowInNav((v) => !v)}
          className={`relative w-9 h-5 rounded-full transition-colors ${showInNav ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${showInNav ? "translate-x-4" : ""}`} />
        </button>
      </div>
    </Modal>
  );
}
