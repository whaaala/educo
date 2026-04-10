"use client";

import React from "react";
import {
  Folder, FileText, Presentation, Table2, Image as ImageIcon, File,
  Clock, Film, Music, FileArchive, FileSpreadsheet, Play, Headphones,
} from "lucide-react";
import Tooltip from "@/components/shared/Tooltip";
import AvatarHover from "@/components/shared/AvatarHover";

// ── Types ──

export interface SuggestedFileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  sourceType?: "document" | "presentation" | "spreadsheet" | "upload";
  updatedAt: string;
  owner?: string;
  ownerAvatar?: string;
  folderName?: string;
  /** HTML content for preview rendering */
  content?: string;
}

export interface SuggestedFilesProps {
  files: SuggestedFileItem[];
  title?: string;
  onFileOpen?: (file: SuggestedFileItem) => void;
  maxItems?: number;
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

function getTypeIcon(sourceType?: string, size = "w-5 h-5"): React.ReactNode {
  switch (sourceType) {
    case "presentation": return <Presentation className={`${size} text-amber-500`} />;
    case "document": return <FileText className={`${size} text-blue-500`} />;
    case "spreadsheet": return <Table2 className={`${size} text-green-600`} />;
    case "upload": return <ImageIcon className={`${size} text-red-500`} />;
    default: return <File className={`${size} text-gray-400`} />;
  }
}

function getTypeColor(sourceType?: string): string {
  switch (sourceType) {
    case "document": return "#3b82f6";
    case "presentation": return "#f59e0b";
    case "spreadsheet": return "#16a34a";
    case "upload": return "#ef4444";
    default: return "#9ca3af";
  }
}

type FileCategory = "document" | "presentation" | "spreadsheet" | "image" | "video" | "audio" | "archive" | "other";

function getFileCategory(name: string, sourceType?: string): FileCategory {
  if (sourceType === "document") return "document";
  if (sourceType === "presentation") return "presentation";
  if (sourceType === "spreadsheet") return "spreadsheet";
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["doc", "docx", "odt", "txt", "rtf", "pdf", "md"].includes(ext)) return "document";
  if (["ppt", "pptx", "odp", "key"].includes(ext)) return "presentation";
  if (["xls", "xlsx", "csv", "ods", "tsv"].includes(ext)) return "spreadsheet";
  if (["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp", "ico", "tiff"].includes(ext)) return "image";
  if (["mp4", "mov", "avi", "mkv", "webm", "flv", "wmv", "m4v"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg", "flac", "aac", "wma", "m4a"].includes(ext)) return "audio";
  if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(ext)) return "archive";
  return "other";
}

function getPreviewConfig(category: FileCategory): { bg: string; icon: React.ReactNode } {
  switch (category) {
    case "video":
      return {
        bg: "bg-gradient-to-br from-slate-900 to-slate-800",
        icon: (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
              <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
            </div>
            <div className="w-16 h-0.5 rounded-full bg-white/20">
              <div className="w-5 h-full bg-red-500 rounded-full" />
            </div>
          </div>
        ),
      };
    case "audio":
      return {
        bg: "bg-gradient-to-br from-violet-600 to-indigo-700",
        icon: (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-end gap-[2px] h-7">
              {[40, 65, 50, 80, 35, 60, 45, 75, 30, 55, 40, 70].map((h, i) => (
                <div key={i} className="w-[2px] rounded-full bg-white/50" style={{ height: `${h}%` }} />
              ))}
            </div>
            <Music className="w-4 h-4 text-white/40" />
          </div>
        ),
      };
    case "image":
      return {
        bg: "bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20",
        icon: (
          <div className="relative w-12 h-9 rounded-md bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] shadow-sm overflow-hidden border border-gray-200/50 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/50">
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-300" />
            <div className="absolute bottom-0 left-0 right-0 h-4">
              <svg viewBox="0 0 48 16" className="w-full h-full text-green-400/40 dark:text-green-600/30"><path d="M0 16 L16 6 L28 12 L48 2 L48 16 Z" fill="currentColor"/></svg>
            </div>
          </div>
        ),
      };
    case "spreadsheet":
      return {
        bg: "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/15 dark:to-green-900/15",
        icon: (
          <div className="grid grid-cols-3 gap-[1.5px] w-11 bg-green-200/50 dark:bg-green-700/20 rounded overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`h-2.5 ${i < 3 ? "bg-green-500/25" : "bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50"}`} />
            ))}
          </div>
        ),
      };
    case "document":
      return {
        bg: "bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]",
        icon: (
          <div className="flex flex-col gap-[5px] w-[70%] py-2">
            <div className="h-2 w-[60%] rounded-sm bg-gray-800/10 dark:bg-gray-400/10" />
            <div className="h-[3px] w-full rounded-sm bg-gray-400/15 dark:bg-gray-500/10 mt-1" />
            <div className="h-[3px] w-[90%] rounded-sm bg-gray-400/15 dark:bg-gray-500/10" />
            <div className="h-[3px] w-full rounded-sm bg-gray-400/15 dark:bg-gray-500/10" />
            <div className="h-[3px] w-[75%] rounded-sm bg-gray-400/15 dark:bg-gray-500/10" />
            <div className="h-[3px] w-full rounded-sm bg-gray-400/15 dark:bg-gray-500/10 mt-1" />
            <div className="h-[3px] w-[85%] rounded-sm bg-gray-400/15 dark:bg-gray-500/10" />
            <div className="h-[3px] w-[95%] rounded-sm bg-gray-400/15 dark:bg-gray-500/10" />
            <div className="h-[3px] w-[60%] rounded-sm bg-gray-400/15 dark:bg-gray-500/10" />
          </div>
        ),
      };
    case "presentation":
      return {
        bg: "bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]",
        icon: (
          <div className="w-[75%] aspect-video rounded bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-gray-200/50 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/30 flex flex-col items-center justify-center gap-1 p-2">
            <div className="h-2 w-[50%] rounded-sm bg-gray-800/10 dark:bg-gray-400/10" />
            <div className="h-[3px] w-[35%] rounded-sm bg-gray-400/15 dark:bg-gray-500/10" />
          </div>
        ),
      };
    case "archive":
      return {
        bg: "bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/20 dark:to-slate-800/15",
        icon: <FileArchive className="w-8 h-8 text-gray-300 dark:text-gray-600 midnight:text-cyan-500 purple:text-pink-500" />,
      };
    default:
      return {
        bg: "bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/30",
        icon: <File className="w-8 h-8 text-gray-300 dark:text-gray-600 midnight:text-cyan-500 purple:text-pink-500" />,
      };
  }
}

function getAvatarColor(name: string): string {
  const colors = ["bg-violet-500", "bg-blue-500", "bg-green-500", "bg-amber-500", "bg-red-500", "bg-pink-500", "bg-cyan-500", "bg-indigo-500"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// ── Component ──

export default function SuggestedFiles({
  files,
  title = "Suggested",
  onFileOpen,
  maxItems = 5,
  className = "",
}: SuggestedFilesProps) {
  if (!files || files.length === 0) return null;

  const displayFiles = files.slice(0, maxItems);

  return (
    <section className={`mb-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-3.5 h-3.5 text-gray-400" />
        <h3 className="text-[13px] font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 uppercase tracking-wide">
          {title}
        </h3>
      </div>

      {/* Responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {displayFiles.map((file, idx) => (
          <div
            key={file.id}
            onClick={() => onFileOpen?.(file)}
            className="group cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "both" }}
          >
            {/* Card — title bar + preview + footer all inside */}
            <div
              className="rounded-xl border border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20/50 midnight:border-cyan-500/10 purple:border-pink-500/10 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] group-hover:border-blue-300 dark:group-hover:border-blue-500/30 overflow-hidden"
              style={{ borderTop: `3px solid ${getTypeColor(file.sourceType)}` }}
            >
              {/* Title bar — type icon + file name with tooltip */}
              <div className="flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-[#1e2028] midnight:bg-[#0a0e27] purple:bg-[#1e1030]">
                {getTypeIcon(file.sourceType, "w-[16px] h-[16px] flex-shrink-0")}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <Tooltip content={file.name} block>
                    <p className="text-[12px] font-semibold text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {file.name}
                    </p>
                  </Tooltip>
                </div>
              </div>

              {/* Preview area — real content or fallback icon */}
              <div className="h-[140px] bg-white dark:bg-[#0f1115] midnight:bg-[#0d1321] purple:bg-[#150d20] relative overflow-hidden">
                {file.content ? (
                  <>
                    <div className="w-[420px] origin-top-left pointer-events-none select-none" style={{ transform: "scale(0.28)" }}>
                      <div
                        className="px-6 pt-4 pb-8 text-[13px] leading-[1.6] text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 [&_h1]:text-[22px] [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:leading-tight [&_h2]:text-[16px] [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1 [&_h3]:text-[14px] [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:my-1 [&_ul]:pl-5 [&_ul]:my-1 [&_ul]:list-disc [&_li]:my-0.5 [&_hr]:my-2 [&_hr]:border-gray-200 [&_strong]:font-semibold"
                        dangerouslySetInnerHTML={{ __html: file.content }}
                      />
                    </div>
                    {/* Bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 midnight:from-[#0d1321] purple:from-[#150d20] to-transparent" />
                  </>
                ) : (() => {
                  const category = getFileCategory(file.name, file.sourceType);
                  const preview = getPreviewConfig(category);
                  return (
                    <div className={`w-full h-full flex items-center justify-center ${preview.bg}`}>
                      {preview.icon}
                    </div>
                  );
                })()}
              </div>

              {/* Footer — time + owner */}
              <div className="flex items-center justify-between px-3 py-2.5 bg-white dark:bg-[#1e2028] midnight:bg-[#0a0e27] purple:bg-[#1e1030] border-t border-gray-100/80 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10/60">
                <span className="text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">{timeAgo(file.updatedAt)}</span>
                {file.owner && (
                  <AvatarHover src={file.ownerAvatar} name={file.owner} size="w-5 h-5" initialSize="text-[8px]" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
