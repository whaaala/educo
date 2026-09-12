"use client";

import { useMemo, useState } from "react";
import { FilePlus2, Check, ArrowRight, Link2, Eye } from "lucide-react";
import Modal from "@/components/shared/Modal";
import SitePreviewThumb from "@/components/website/SitePreviewThumb";
import { resolveIcon } from "@/components/website/sections/icons";
import { PAGE_TEMPLATES, createPageFromTemplate, pageNavItem, slugify, type Site, type SiteTheme } from "@/lib/site-storage";

export interface AddPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteName: string;
  theme: SiteTheme;
  onCreate: (name: string, path: string, templateKey: string, showInNav: boolean) => void;
}

/**
 * "Add a page" — combines Hostinger's page-template gallery (pick a layout) with WordPress's
 * page basics (title, URL slug, add to navigation). Component-based, themed, live previews.
 */
export default function AddPageModal({ isOpen, onClose, siteName, theme, onCreate }: AddPageModalProps) {
  const [name, setName] = useState("");
  const [templateKey, setTemplateKey] = useState("landing");
  const [path, setPath] = useState("");
  const [pathEdited, setPathEdited] = useState(false);
  const [showInNav, setShowInNav] = useState(true);

  // Live preview site per template (rendered by the same section components as the real site).
  const previews = useMemo(
    () => PAGE_TEMPLATES.reduce<Record<string, Site>>((acc, t) => {
      const page = createPageFromTemplate("Preview", "/", t.key, { isHome: true });
      acc[t.key] = { id: `prev-${t.key}`, name: siteName, pages: [page], theme, nav: [pageNavItem(page.id, "Preview")], createdAt: "", updatedAt: "" };
      return acc;
    }, {}),
    [siteName, theme],
  );

  const effectivePath = pathEdited ? path : slugify(name || PAGE_TEMPLATES.find((t) => t.key === templateKey)!.name);

  const submit = () => {
    const finalName = name.trim() || PAGE_TEMPLATES.find((t) => t.key === templateKey)!.name;
    onCreate(finalName, effectivePath || slugify(finalName), templateKey, showInNav);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add a page"
      subtitle="Pick a layout, name it, and it's added to your site"
      icon={<FilePlus2 className="w-5 h-5" />}
      maxWidth="3xl"
      footer={
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 cursor-pointer">
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
            <span className="inline-flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Show in navigation</span>
          </label>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22262e]">Cancel</button>
            <button onClick={submit} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 inline-flex items-center gap-1.5">Add page <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      }
    >
      {/* Name + URL */}
      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        <label className="block">
          <span className="text-xs font-medium text-muted">Page name</span>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. About Us"
            aria-label="Page name"
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-muted">Page URL</span>
          <div className="mt-1 flex items-center rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 focus-within:ring-2 focus-within:ring-indigo-500">
            <span className="pl-3 pr-1 text-gray-400"><Link2 className="w-4 h-4" /></span>
            <input
              value={effectivePath}
              onChange={(e) => { setPathEdited(true); setPath(e.target.value.startsWith("/") ? e.target.value : `/${e.target.value}`); }}
              aria-label="Page URL"
              className="flex-1 py-2 pr-3 bg-transparent text-gray-900 dark:text-white outline-none text-sm"
            />
          </div>
        </label>
      </div>

      {/* Template gallery */}
      <span className="text-xs font-medium text-muted">Choose a layout</span>
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PAGE_TEMPLATES.map((t) => {
          const Icon = resolveIcon(t.icon);
          const active = templateKey === t.key;
          return (
            <div
              key={t.key}
              role="button"
              tabIndex={0}
              onClick={() => setTemplateKey(t.key)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setTemplateKey(t.key); } }}
              aria-pressed={active}
              aria-label={`${t.name} layout`}
              className={`group cursor-pointer text-left rounded-xl overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${active ? "border-indigo-500 shadow-lg" : "border-line hover:border-gray-300 dark:hover:border-gray-600"}`}
            >
              <div className="relative border-b border-gray-100 dark:border-gray-800">
                <SitePreviewThumb site={previews[t.key]} heightClass="h-24" />
                {active && <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow"><Check className="w-3 h-3" /></span>}
              </div>
              <div className="p-2.5 flex items-start gap-2">
                <span className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center shrink-0"><Icon className="w-3.5 h-3.5" /></span>
                <span className="min-w-0">
                  <span className="text-sm font-semibold block text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">{t.name}</span>
                  <span className="text-[0.6875rem] text-gray-400 leading-tight block">{t.description}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
