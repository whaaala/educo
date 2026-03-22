"use client";

import { useState, useEffect, useRef } from "react";
import { Folder, X } from "lucide-react";
import Portal from "@/components/shared/Portal";

export interface NewFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  defaultName?: string;
  title?: string;
}

export default function NewFolderDialog({
  isOpen,
  onClose,
  onSubmit,
  defaultName = "Untitled folder",
  title = "New folder",
}: NewFolderDialogProps) {
  const [name, setName] = useState(defaultName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(defaultName);
      setTimeout(() => inputRef.current?.select(), 80);
    }
  }, [isOpen, defaultName]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[9000] flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />

        {/* Dialog */}
        <div className="relative z-10 w-[440px] max-w-[92vw] bg-white dark:bg-[#1e2028] midnight:bg-[#111827] purple:bg-[#1e1030] rounded-2xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.25)] animate-in zoom-in-95 fade-in duration-200">

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 midnight:bg-amber-500/10 purple:bg-amber-500/10 flex items-center justify-center">
                <Folder className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-[17px] font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Input */}
          <div className="px-6 pb-2">
            <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 midnight:text-cyan-400/60 purple:text-pink-400/60 uppercase tracking-wider mb-2">
              Folder name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }}
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 midnight:bg-white/[0.03] purple:bg-white/[0.03] border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-[15px] font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 outline-none focus:bg-white dark:focus:bg-white/8 focus:border-blue-400 dark:focus:border-blue-500 midnight:focus:border-cyan-400 purple:focus:border-pink-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 midnight:focus:ring-cyan-400/10 purple:focus:ring-pink-400/10 transition-all duration-200"
              placeholder="Enter folder name"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 px-6 pt-4 pb-6">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-gray-100 dark:hover:bg-white/5 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="px-6 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
