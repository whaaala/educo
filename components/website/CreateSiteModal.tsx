"use client";

import { useState } from "react";
import { Globe, LayoutTemplate, FileStack, ArrowRight } from "lucide-react";
import Modal from "@/components/shared/Modal";

export type SiteStarter = "starter" | "blank";

export interface CreateSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, starter: SiteStarter) => void;
}

/**
 * Reusable "create a new site" dialog for the website builder. Wraps the shared Modal so it
 * inherits the app's themed header/backdrop, and is fully theme-aware + responsive.
 */
export default function CreateSiteModal({ isOpen, onClose, onCreate }: CreateSiteModalProps) {
  const [name, setName] = useState("");
  const [starter, setStarter] = useState<SiteStarter>("starter");

  const submit = () => onCreate(name.trim() || "My School", starter);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create a new site"
      subtitle="Give your school website a name and a starting point"
      icon={<Globe className="w-5 h-5" />}
      maxWidth="md"
      footer={
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 inline-flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
          >
            Create <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      }
    >
      <label className="block mb-4">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">School / site name</span>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          placeholder="e.g. Greenfield Academy"
          aria-label="Site name"
          className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-transparent text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </label>

      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Start from</span>
      <div className="mt-1.5 grid grid-cols-2 gap-3">
        {([
          ["starter", LayoutTemplate, "Starter", "Hero, About & CTA — ready to edit"],
          ["blank", FileStack, "Blank", "One empty page to build freely"],
        ] as const).map(([key, Icon, label, desc]) => (
          <button
            key={key}
            onClick={() => setStarter(key)}
            aria-pressed={starter === key}
            className={`text-left p-3 rounded-xl border-2 transition-colors ${
              starter === key
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 midnight:bg-cyan-950/30 purple:bg-purple-950/30"
                : "border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <Icon className={`w-5 h-5 mb-1.5 ${starter === key ? "text-indigo-600 dark:text-indigo-400 midnight:text-cyan-400 purple:text-pink-400" : "text-gray-400"}`} />
            <div className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">{label}</div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 leading-tight mt-0.5">{desc}</div>
          </button>
        ))}
      </div>
    </Modal>
  );
}
