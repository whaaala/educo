"use client";

import React, { useState, useEffect } from "react";
import {
  Folder, FileText, Presentation, Table2, Image as ImageIcon, File,
  MoreVertical, Play, Music,
} from "lucide-react";
import Tooltip from "@/components/shared/Tooltip";
import AvatarHover from "@/components/shared/AvatarHover";
import LoadMoreButton from "@/components/shared/LoadMoreButton";

// ── Types ──

export interface FileCardItem {
  id: string;
  name: string;
  type: "file" | "folder";
  sourceType?: "document" | "presentation" | "spreadsheet" | "upload";
  size?: number;
  updatedAt: string;
  owner?: string;
  ownerAvatar?: string;
  childCount?: number;
  content?: string;
}

export interface FileCardGridProps {
  items: FileCardItem[];
  /** Number of items to show initially */
  initialCount?: number;
  /** Number to load per "Load more" click */
  loadMoreCount?: number;
  /** Fired when a card is clicked */
  onItemClick?: (item: FileCardItem) => void;
  /** Fired when rename is submitted */
  onRename?: (itemId: string, newName: string) => void;
  /** Render the context menu for an item */
  renderMenu?: (item: FileCardItem, onClose: () => void) => React.ReactNode;
  /** Item currently being renamed */
  renamingId?: string | null;
  renameValue?: string;
  onRenameChange?: (value: string) => void;
  onRenameSubmit?: () => void;
  onRenameCancel?: () => void;
  /** Animation on mount */
  animate?: boolean;
  className?: string;
}

// ── Helpers ──

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getItemIcon(item: FileCardItem, size = "w-5 h-5") {
  if (item.type === "folder") return <Folder className={`${size} text-gray-500`} />;
  switch (item.sourceType) {
    case "presentation": return <Presentation className={`${size} text-amber-500`} />;
    case "document": return <FileText className={`${size} text-blue-500`} />;
    case "spreadsheet": return <Table2 className={`${size} text-green-600`} />;
    case "upload": return <ImageIcon className={`${size} text-red-500`} />;
    default: return <File className={`${size} text-gray-400`} />;
  }
}

function getTypeColor(item: FileCardItem): string {
  if (item.type === "folder") return "#9ca3af";
  switch (item.sourceType) {
    case "document": return "#3b82f6";
    case "presentation": return "#f59e0b";
    case "spreadsheet": return "#16a34a";
    case "upload": return "#ef4444";
    default: return "#9ca3af";
  }
}

function renderPreview(item: FileCardItem) {
  // Folder
  if (item.type === "folder") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/30 gap-1">
        <Folder className="w-12 h-12 text-gray-200 dark:text-gray-700" />
        {item.childCount !== undefined && (
          <span className="text-[10px] text-gray-400">{item.childCount} items</span>
        )}
      </div>
    );
  }

  // Real HTML content
  if (item.content) {
    return (
      <>
        <div className="w-[420px] origin-top-left pointer-events-none select-none" style={{ transform: "scale(0.30)" }}>
          <div className="px-6 pt-4 pb-8 text-[13px] leading-[1.6] text-gray-800 dark:text-gray-200 [&_h1]:text-[22px] [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-[16px] [&_h2]:font-bold [&_h2]:mt-3 [&_h3]:text-[14px] [&_h3]:font-semibold [&_p]:my-1 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:my-0.5 [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: item.content }} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
      </>
    );
  }

  // Type-specific fallbacks
  const ext = item.name.split(".").pop()?.toLowerCase() || "";
  const isVideo = ["mp4", "mov", "avi", "mkv", "webm", "flv"].includes(ext);
  const isAudio = ["mp3", "wav", "ogg", "flac", "aac"].includes(ext);
  const isImage = ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext);
  const isDoc = item.sourceType === "document" || ["doc", "docx", "txt", "pdf"].includes(ext);

  if (isVideo) return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center gap-2">
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><Play className="w-4 h-4 text-white ml-0.5" fill="white" /></div>
      <div className="w-16 h-0.5 rounded-full bg-white/20"><div className="w-5 h-full bg-red-500 rounded-full" /></div>
    </div>
  );
  if (isAudio) return (
    <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-700 flex flex-col items-center justify-center gap-2">
      <div className="flex items-end gap-[2px] h-7">
        {[40, 65, 50, 80, 35, 60, 45, 75, 30, 55, 40, 70].map((h, i) => (
          <div key={i} className="w-[2px] rounded-full bg-white/50" style={{ height: `${h}%` }} />
        ))}
      </div>
      <Music className="w-4 h-4 text-white/40" />
    </div>
  );
  if (isImage) return (
    <div className="w-full h-full bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 flex items-center justify-center">
      <div className="relative w-14 h-10 rounded-md bg-white dark:bg-gray-800 shadow-sm overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
        <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-300" />
        <div className="absolute bottom-0 left-0 right-0 h-5"><svg viewBox="0 0 48 16" className="w-full h-full text-green-400/40"><path d="M0 16 L16 6 L28 12 L48 2 L48 16 Z" fill="currentColor"/></svg></div>
      </div>
    </div>
  );
  if (isDoc) return (
    <div className="w-full h-full bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col gap-[5px] w-[65%]">
        <div className="h-2 w-[60%] rounded-sm bg-gray-800/10" />
        <div className="h-[3px] w-full rounded-sm bg-gray-400/15 mt-1" />
        <div className="h-[3px] w-[90%] rounded-sm bg-gray-400/15" />
        <div className="h-[3px] w-full rounded-sm bg-gray-400/15" />
        <div className="h-[3px] w-[75%] rounded-sm bg-gray-400/15" />
      </div>
    </div>
  );

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-800/30 flex items-center justify-center">
      {getItemIcon(item, "w-10 h-10 opacity-15")}
    </div>
  );
}

// ── Component ──

export default function FileCardGrid({
  items,
  initialCount = 10,
  loadMoreCount = 10,
  onItemClick,
  renderMenu,
  renamingId,
  renameValue = "",
  onRenameChange,
  onRenameSubmit,
  onRenameCancel,
  animate = false,
  className = "",
}: FileCardGridProps) {
  // Responsive initial count based on viewport height
  const [visibleCount, setVisibleCount] = useState(() => {
    if (typeof window === "undefined") return initialCount;
    return window.innerHeight >= 900 ? Math.max(initialCount, 10) : Math.max(initialCount, 5);
  });
  const [loading, setLoading] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Update on resize
  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(prev => {
        const minForHeight = window.innerHeight >= 900 ? 10 : 5;
        // Only increase, never decrease what's already showing
        return Math.max(prev, minForHeight);
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = items.length > visibleCount;

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + loadMoreCount);
      setLoading(false);
    }, 400);
  };

  return (
    <div className={className}>
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${animate ? "animate-in fade-in slide-in-from-bottom-2 duration-300" : ""}`}>
        {visibleItems.map((item, idx) => (
          <div
            key={item.id}
            className="group cursor-pointer animate-in fade-in duration-200 relative"
            style={{ animationDelay: `${Math.min(idx, 9) * 30}ms`, animationFillMode: "both" }}
            onClick={() => onItemClick?.(item)}
          >
            <div
              className="rounded-xl border border-gray-200/60 dark:border-gray-700/50 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] group-hover:border-blue-300 dark:group-hover:border-blue-500/30"
              style={{ borderTop: `3px solid ${getTypeColor(item)}` }}
            >
              {/* Title bar */}
              <div className="flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-[#1e2028]">
                {getItemIcon(item, "w-4 h-4 flex-shrink-0")}
                <div className="min-w-0 overflow-hidden flex-1">
                  {renamingId === item.id ? (
                    <input
                      type="text" value={renameValue}
                      onChange={e => onRenameChange?.(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") onRenameSubmit?.(); if (e.key === "Escape") onRenameCancel?.(); }}
                      onBlur={onRenameSubmit} autoFocus
                      onClick={e => e.stopPropagation()}
                      className="w-full px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 border border-blue-200 text-[12px] outline-none"
                    />
                  ) : (
                    <Tooltip content={item.name} block>
                      <p className="text-[12px] font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.name}</p>
                    </Tooltip>
                  )}
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === item.id ? null : item.id); }}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all cursor-pointer flex-shrink-0"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Context menu */}
              {menuOpenId === item.id && renderMenu && (
                <div className="absolute right-2 top-10 z-50" onClick={e => e.stopPropagation()}>
                  {renderMenu(item, () => setMenuOpenId(null))}
                </div>
              )}

              {/* Preview area — fixed height for all types */}
              <div className="h-[180px] bg-white dark:bg-gray-900 relative overflow-hidden">
                {renderPreview(item)}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-[#1e2028] border-t border-gray-100/80 dark:border-gray-800/60">
                <span className="text-[10px] text-gray-400">{timeAgo(item.updatedAt)}</span>
                {item.owner && (
                  <AvatarHover src={item.ownerAvatar} name={item.owner} size="w-5 h-5" initialSize="text-[8px]" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <LoadMoreButton
          onClick={handleLoadMore}
          isLoading={loading}
          text={`Show more (${items.length - visibleCount} remaining)`}
          loadingText="Loading..."
        />
      )}
    </div>
  );
}
