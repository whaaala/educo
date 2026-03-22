"use client";

import React, { useState } from "react";
import {
  X, Download, FileText, Image as ImageIcon, File, Check, Loader2,
  FileType, FileImage, FileCode,
} from "lucide-react";

// ── Types ──
export interface DownloadFormat {
  id: string;
  label: string;
  extension: string;
  description: string;
  icon: "pptx" | "odp" | "pdf" | "txt" | "jpg" | "png" | "svg";
  category: "document" | "image";
  /** If true, exports only the current/active item (e.g., current slide) */
  currentOnly?: boolean;
}

export interface DownloadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  /** The content to export — array of HTML strings (one per slide/page) */
  content: string[];
  /** Index of the currently active item (for single-item exports) */
  activeIndex?: number;
  /** Background colors per slide */
  backgrounds?: string[];
  /** Available formats (defaults to presentation formats) */
  formats?: DownloadFormat[];
  /** Called after download completes */
  onDownload?: (formatId: string) => void;
}

// ── Default presentation formats ──
const PRESENTATION_FORMATS: DownloadFormat[] = [
  { id: "pptx", label: "Presentation (PDF)", extension: ".pdf", description: "Slide-formatted PDF — compatible with all viewers", icon: "pptx", category: "document" },
  { id: "odp", label: "Presentation (PDF)", extension: ".pdf", description: "Slide-formatted PDF — print or share", icon: "odp", category: "document" },
  { id: "pdf", label: "PDF Document", extension: ".pdf", description: "Best for sharing and printing", icon: "pdf", category: "document" },
  { id: "txt", label: "Plain Text", extension: ".txt", description: "Text content only, no formatting", icon: "txt", category: "document" },
  { id: "jpg", label: "JPEG Image", extension: ".jpg", description: "Current slide as image", icon: "jpg", category: "image", currentOnly: true },
  { id: "png", label: "PNG Image", extension: ".png", description: "Current slide with transparency support", icon: "png", category: "image", currentOnly: true },
  { id: "svg", label: "Scalable Vector Graphics", extension: ".svg", description: "Current slide as vector graphic", icon: "svg", category: "image", currentOnly: true },
];

// ── Format icon component ──
function FormatIcon({ type, className }: { type: string; className?: string }) {
  const baseClass = className || "w-5 h-5";
  switch (type) {
    case "pptx": return <FileType className={`${baseClass} text-orange-500`} />;
    case "odp": return <File className={`${baseClass} text-blue-500`} />;
    case "pdf": return <FileText className={`${baseClass} text-red-500`} />;
    case "txt": return <FileCode className={`${baseClass} text-gray-500`} />;
    case "jpg": return <FileImage className={`${baseClass} text-green-500`} />;
    case "png": return <ImageIcon className={`${baseClass} text-purple-500`} />;
    case "svg": return <FileCode className={`${baseClass} text-cyan-500`} />;
    default: return <File className={`${baseClass} text-gray-400`} />;
  }
}

// ── File size estimation ──
function estimateSize(content: string[], format: string): string {
  const totalChars = content.join("").length;
  const sizes: Record<string, number> = {
    pptx: totalChars * 3, odp: totalChars * 2.5, pdf: totalChars * 2,
    txt: totalChars * 0.5, jpg: 150000, png: 250000, svg: totalChars * 1.5,
  };
  const bytes = sizes[format] || totalChars;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Safe filename ──
function safeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9\s\-_]/g, "").trim().replace(/\s+/g, "_") || "presentation";
}

// ── Export functions ──
function generateSlideHtml(content: string, bg: string, slideNum: number, total: number): string {
  const bgStyle = bg.includes("gradient") ? `background:${bg};` : `background-color:${bg};`;
  return `<div class="slide" style="${bgStyle}">
    <div class="slide-content">${content}</div>
    <div class="slide-number">${slideNum} / ${total}</div>
  </div>`;
}

function exportAsHtml(title: string, slides: string[], backgrounds: string[]): string {
  const slidesHtml = slides.map((s, i) => generateSlideHtml(s, backgrounds[i] || "#ffffff", i + 1, slides.length)).join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>${title}</title>
<style>
  @page { size: 10in 5.625in; margin: 0; }
  @media print {
    body { margin: 0; padding: 0; }
    .slide { width: 10in !important; height: 5.625in !important; page-break-after: always; box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; }
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { margin: 0; padding: 20px; background: #e5e7eb; font-family: 'Segoe UI', Arial, Helvetica, sans-serif; }
  .slide { width: 960px; height: 540px; position: relative; overflow: hidden; margin: 20px auto; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
  .slide-content { width: 100%; height: 100%; padding: 60px 80px; display: flex; flex-direction: column; justify-content: center; }
  .slide-content h1 { font-size: 36px; font-weight: 700; margin-bottom: 16px; line-height: 1.2; }
  .slide-content h2 { font-size: 24px; font-weight: 600; margin-bottom: 12px; line-height: 1.3; }
  .slide-content h3 { font-size: 20px; font-weight: 600; margin-bottom: 8px; }
  .slide-content p { font-size: 18px; line-height: 1.6; margin-bottom: 8px; color: #4b5563; }
  .slide-content ul, .slide-content ol { padding-left: 24px; margin-bottom: 8px; }
  .slide-content li { font-size: 16px; line-height: 1.5; margin-bottom: 4px; color: #4b5563; }
  .slide-number { position: absolute; bottom: 16px; right: 24px; font-size: 11px; color: rgba(156,163,175,0.6); }
  body { margin: 0; padding: 0; background: #f3f4f6; }
  @media print { body { background: white; } }
</style>
</head>
<body>${slidesHtml}</body>
</html>`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function exportSlideAsImage(content: string, bg: string, format: "png" | "jpg"): Promise<Blob> {
  // Render slide to canvas
  const container = document.createElement("div");
  container.style.cssText = `position:fixed;left:-9999px;top:0;width:1920px;height:1080px;background:${bg};font-family:Arial,Helvetica,sans-serif;overflow:hidden;`;
  container.innerHTML = `<div style="width:100%;height:100%;padding:96px;display:flex;align-items:center;justify-content:center;">${content}</div>`;
  document.body.appendChild(container);

  // Use html2canvas-like approach with canvas
  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d")!;

  // Draw background
  ctx.fillStyle = bg.startsWith("linear") ? "#1e40af" : bg;
  ctx.fillRect(0, 0, 1920, 1080);

  // Draw text content
  const text = container.innerText;
  ctx.fillStyle = "#111827";
  ctx.font = "bold 64px Arial";
  ctx.textAlign = "center";
  const lines = text.split("\n").filter(l => l.trim());
  lines.forEach((line, i) => {
    ctx.font = i === 0 ? "bold 64px Arial" : "32px Arial";
    ctx.fillStyle = i === 0 ? "#111827" : "#6b7280";
    ctx.fillText(line.trim(), 960, 400 + i * 80, 1600);
  });

  document.body.removeChild(container);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), format === "jpg" ? "image/jpeg" : "image/png", 0.95);
  });
}

// ── Main Component ──
export default function DownloadDialog({
  isOpen, onClose, title, content, activeIndex = 0, backgrounds = [],
  formats = PRESENTATION_FORMATS, onDownload,
}: DownloadDialogProps) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string | null>(null);

  if (!isOpen) return null;

  const filename = safeFilename(title);
  const bgs = content.map((_, i) => backgrounds[i] || "#ffffff");
  const docFormats = formats.filter(f => f.category === "document");
  const imgFormats = formats.filter(f => f.category === "image");

  const handleDownload = async (format: DownloadFormat) => {
    setDownloading(format.id);

    try {
      switch (format.id) {
        case "pdf": {
          // Open print dialog for PDF export
          const pdfHtml = exportAsHtml(title, content, bgs);
          const pdfWin = window.open("", "_blank");
          if (pdfWin) {
            pdfWin.document.write(pdfHtml);
            pdfWin.document.close();
            setTimeout(() => { pdfWin.print(); }, 500);
          }
          break;
        }
        case "pptx": {
          // Export as presentation-style PDF via print dialog
          // User can save as PDF and then convert to PPTX using online tools
          const pptxHtml = exportAsHtml(title, content, bgs);
          const pptxWin = window.open("", "_blank");
          if (pptxWin) {
            pptxWin.document.write(pptxHtml);
            pptxWin.document.close();
            setTimeout(() => { pptxWin.print(); }, 500);
          }
          break;
        }
        case "odp": {
          // ODP: open print dialog for presentation-style export
          const odpHtml = exportAsHtml(title, content, bgs);
          const odpWin = window.open("", "_blank");
          if (odpWin) {
            odpWin.document.write(odpHtml);
            odpWin.document.close();
            setTimeout(() => { odpWin.print(); }, 500);
          }
          break;
        }
        case "txt": {
          // Extract plain text from all slides
          const div = document.createElement("div");
          const textParts = content.map((slide, i) => {
            div.innerHTML = slide;
            return `--- Slide ${i + 1} ---\n${div.innerText.trim()}`;
          });
          const text = `${title}\n${"=".repeat(title.length)}\n\n${textParts.join("\n\n")}`;
          const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
          downloadBlob(blob, `${filename}.txt`);
          break;
        }
        case "jpg":
        case "png": {
          const blob = await exportSlideAsImage(content[activeIndex] || "", bgs[activeIndex] || "#fff", format.id as "jpg" | "png");
          downloadBlob(blob, `${filename}_slide${activeIndex + 1}.${format.id}`);
          break;
        }
        case "svg": {
          const div = document.createElement("div");
          div.innerHTML = content[activeIndex] || "";
          const text = div.innerText.trim();
          const lines = text.split("\n").filter(l => l.trim());
          const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="1920" height="1080">
            <rect width="960" height="540" fill="${bgs[activeIndex] || "#fff"}" rx="4"/>
            ${lines.map((line, i) => `<text x="480" y="${200 + i * 60}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${i === 0 ? 36 : 20}" font-weight="${i === 0 ? "bold" : "normal"}" fill="${i === 0 ? "#111827" : "#6b7280"}">${line.replace(/[<>&]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] || c))}</text>`).join("\n")}
          </svg>`;
          const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
          downloadBlob(blob, `${filename}_slide${activeIndex + 1}.svg`);
          break;
        }
      }

      setDownloading(null);
      setCompleted(format.id);
      onDownload?.(format.id);
      setTimeout(() => setCompleted(null), 2000);
    } catch (err) {
      console.error("Download failed:", err);
      setDownloading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[480px] max-w-[92vw] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-black/20 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm shadow-green-500/20">
            <Download className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">Download</h2>
            <p className="text-[11px] text-gray-400 truncate">{title}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Format list */}
        <div className="overflow-y-auto max-h-[80vh]">
          {/* Document formats */}
          <div className="px-5 pt-4 pb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Document formats</p>
            <div className="space-y-1">
              {docFormats.map(f => (
                <FormatRow key={f.id} format={f} filename={filename} estimatedSize={estimateSize(content, f.id)}
                  isDownloading={downloading === f.id} isCompleted={completed === f.id} onDownload={() => handleDownload(f)} />
              ))}
            </div>
          </div>

          {/* Image formats */}
          <div className="px-5 pt-3 pb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Image formats <span className="font-normal text-gray-300">(slide {activeIndex + 1})</span>
            </p>
            <div className="space-y-1">
              {imgFormats.map(f => (
                <FormatRow key={f.id} format={f} filename={`${filename}_slide${activeIndex + 1}`} estimatedSize={estimateSize(content, f.id)}
                  isDownloading={downloading === f.id} isCompleted={completed === f.id} onDownload={() => handleDownload(f)} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
          <p className="text-[11px] text-gray-400 text-center">
            {content.length} slide{content.length !== 1 ? "s" : ""} · Click a format to download
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Format Row ──
function FormatRow({ format, filename, estimatedSize, isDownloading, isCompleted, onDownload }: {
  format: DownloadFormat; filename: string; estimatedSize: string;
  isDownloading: boolean; isCompleted: boolean; onDownload: () => void;
}) {
  return (
    <button
      onClick={onDownload}
      disabled={isDownloading}
      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer group ${
        isCompleted
          ? "bg-green-50 dark:bg-green-900/15 border border-green-200 dark:border-green-800"
          : isDownloading
            ? "bg-blue-50 dark:bg-blue-900/15 border border-blue-200 dark:border-blue-800"
            : "border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/30 hover:shadow-sm"
      }`}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        isCompleted ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-50 dark:bg-gray-800"
      }`}>
        {isCompleted ? <Check className="w-5 h-5 text-green-600" /> : <FormatIcon type={format.icon} />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {format.label}
          </span>
          <span className="text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
            {format.extension}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-0.5 truncate">{format.description}</p>
      </div>

      {/* Size / Status */}
      <div className="flex-shrink-0 text-right">
        {isDownloading ? (
          <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
        ) : isCompleted ? (
          <span className="text-[10px] font-medium text-green-600">Downloaded</span>
        ) : (
          <span className="text-[10px] text-gray-400 group-hover:text-gray-600 transition-colors">~{estimatedSize}</span>
        )}
      </div>
    </button>
  );
}
