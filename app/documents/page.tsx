"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { docStorage, type StoredDocument } from "@/lib/doc-storage";
import { DOC_TEMPLATES, TEMPLATE_CATEGORIES, CATEGORY_COLORS } from "@/lib/doc-templates";
import {
  Plus, Search, FileText, LayoutGrid, List, Clock, ChevronDown,
  MoreVertical, Star, Trash2, Copy, ExternalLink, FolderOpen,
} from "lucide-react";

/** Format a date string to relative time (e.g. "2 hours ago") */
function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── Component ──
export default function DocumentsHomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"lastOpened" | "lastModified" | "title">("lastOpened");
  const [sortOpen, setSortOpen] = useState(false);
  const [storedDocs, setStoredDocs] = useState<StoredDocument[]>([]);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Load documents from storage on mount
  const refreshDocs = useCallback(() => setStoredDocs(docStorage.list()), []);
  useEffect(() => { refreshDocs(); }, [refreshDocs]);

  const filteredDocs = useMemo(() => {
    let result = storedDocs;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => d.title.toLowerCase().includes(q) || d.owner.toLowerCase().includes(q));
    }
    if (sortBy === "title") result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    // Default sort (updatedAt desc) is already done by docStorage.list()
    return result;
  }, [storedDocs, searchQuery, sortBy]);

  const handleNewDoc = (template?: typeof DOC_TEMPLATES[number]) => {
    if (template?.html) {
      const id = docStorage.create({
        title: template.title || `Untitled ${template.label}`,
        html: template.html,
        language: "en",
      });
      router.push(`/doc-editor-test?id=${id}`);
    } else {
      router.push("/doc-editor-test");
    }
  };
  const handleOpenDoc = (id: string) => router.push(`/doc-editor-test?id=${id}`);
  const toggleStar = (id: string) => { docStorage.toggleStar(id); refreshDocs(); };
  const deleteDoc = (id: string) => { docStorage.remove(id); refreshDocs(); };

  return (
    <MainLayout>
      <div className="max-w-[1200px] mx-auto">
        {/* ── Search Bar ── */}
        <div className="mb-6">
          <div className="relative max-w-[720px] mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-[14px] text-gray-800 dark:text-gray-200 midnight:text-cyan-50 purple:text-pink-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
            />
          </div>
        </div>

        {/* ── Start a New Document ── */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wide">Start a new document</h2>
            <button
              onClick={() => router.push("/documents/templates")}
              className="text-[12px] font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Template gallery
            </button>
          </div>

          {/* Template cards — top 5 previews + blank */}
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
            {/* Blank document */}
            <button onClick={() => handleNewDoc()} className="flex-shrink-0 w-[150px] group cursor-pointer">
              <div className="aspect-[3/4] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] flex flex-col items-center justify-center gap-2 transition-shadow duration-300 hover:border-blue-400 hover:shadow-lg">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0f1330] purple:bg-[#251340] flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  <Plus className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
              <p className="mt-2 text-[12px] font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 text-center">Blank</p>
            </button>

            {/* First 5 templates as preview cards */}
            {DOC_TEMPLATES.slice(0, 5).map(tpl => (
              <TemplatePreviewCard key={tpl.id} template={tpl} onClick={() => handleNewDoc(tpl)} />
            ))}
          </div>
        </section>

        {/* ── Recent Documents ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wide">Recent documents</h2>
            <div className="flex items-center gap-2">
              {/* Sort dropdown */}
              <div className="relative">
                <button onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer">
                  <Clock className="w-3.5 h-3.5" />
                  {sortBy === "lastOpened" ? "Last opened" : sortBy === "lastModified" ? "Last modified" : "Title"}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-1 w-[180px] bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 z-50 py-1">
                    {([["lastOpened", "Last opened by me"], ["lastModified", "Last modified"], ["title", "Title"]] as const).map(([key, label]) => (
                      <button key={key} onClick={() => { setSortBy(key); setSortOpen(false); }}
                        className={`w-full px-3 py-2 text-left text-[12px] transition-colors cursor-pointer ${sortBy === key ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20 font-medium" : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* View toggle */}
              <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden">
                <button onClick={() => setViewMode("grid")}
                  className={`p-1.5 transition-colors cursor-pointer ${viewMode === "grid" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-400 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"}`}>
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode("list")}
                  className={`p-1.5 transition-colors cursor-pointer ${viewMode === "list" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-400 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ── Grid View ── */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 transition-opacity duration-300">
              {filteredDocs.map(doc => (
                <div key={doc.id} className="group relative cursor-pointer" onClick={() => handleOpenDoc(doc.id)}>
                  {/* Card with real HTML preview */}
                  <div className="aspect-[3/4] rounded-xl bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border border-gray-200/60 dark:border-gray-700/50 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-shadow duration-300 group-hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] relative">
                    {/* Clip container */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      {/* Scaled-down real document preview */}
                      {doc.html ? (
                        <div className="w-[420px] origin-top-left pointer-events-none" style={{ transform: "scale(0.38)" }}>
                          <div
                            className="px-7 pt-5 pb-8 text-[13px] leading-[1.6] text-gray-800 dark:text-gray-200 midnight:text-cyan-50 purple:text-pink-50 [&_h1]:text-[22px] [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:leading-tight [&_h2]:text-[16px] [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-1 [&_h3]:text-[14px] [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_p]:my-1 [&_ul]:pl-5 [&_ul]:my-1 [&_ul]:list-disc [&_li]:my-0.5 [&_hr]:my-3 [&_hr]:border-gray-200 [&_strong]:font-semibold"
                            dangerouslySetInnerHTML={{ __html: doc.html }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <FileText className="w-10 h-10 text-blue-400/30" />
                        </div>
                      )}
                      {/* Bottom fade */}
                      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-gray-900 midnight:from-[#0d1526] purple:from-[#1f1035] to-transparent" />
                    </div>
                    {/* Hover border — on top, outside clip */}
                    <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-400/50 transition-colors duration-300 pointer-events-none z-[5]" />
                    {/* Star + menu — positioned outside overflow */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <button onClick={e => { e.stopPropagation(); toggleStar(doc.id); }}
                        className={`p-1.5 rounded-full shadow-sm ${doc.starred ? "text-amber-400 bg-white dark:bg-[#1a1d24] midnight:bg-[#0f1330] purple:bg-[#251340]" : "text-gray-400 hover:text-amber-400 bg-white/90 dark:bg-[#1a1d24]/90 midnight:bg-[#0f1330]/90 purple:bg-[#251340]/90"} backdrop-blur-sm cursor-pointer transition-colors`}>
                        <Star className={`w-3 h-3 ${doc.starred ? "fill-current" : ""}`} />
                      </button>
                      <button onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === doc.id ? null : doc.id); }}
                        className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 bg-white/90 dark:bg-[#1a1d24]/90 midnight:bg-[#0f1330]/90 purple:bg-[#251340]/90 backdrop-blur-sm cursor-pointer shadow-sm transition-colors">
                        <MoreVertical className="w-3 h-3" />
                      </button>
                    </div>
                    {/* Context menu */}
                    {menuOpenId === doc.id && (
                      <div className="absolute top-10 right-2 w-[160px] bg-white/95 dark:bg-[#0f1115]/95 midnight:bg-[#0a0e27]/95 purple:bg-[#1a0b2e]/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 z-50 py-1"
                        onClick={e => e.stopPropagation()}>
                        <button className="w-full px-3 py-2 text-left text-[12px] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 flex items-center gap-2 cursor-pointer transition-colors"
                          onClick={() => { handleOpenDoc(doc.id); setMenuOpenId(null); }}>
                          <ExternalLink className="w-3.5 h-3.5" /> Open
                        </button>
                        <button className="w-full px-3 py-2 text-left text-[12px] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 flex items-center gap-2 cursor-pointer transition-colors"
                          onClick={() => setMenuOpenId(null)}>
                          <Copy className="w-3.5 h-3.5" /> Make a copy
                        </button>
                        <button className="w-full px-3 py-2 text-left text-[12px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 cursor-pointer transition-colors"
                          onClick={() => { deleteDoc(doc.id); setMenuOpenId(null); }}>
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Metadata below card */}
                  <div className="mt-2.5 px-0.5">
                    <p className="text-[14px] font-semibold text-gray-800 dark:text-gray-200 midnight:text-cyan-50 purple:text-pink-50 truncate leading-tight">{doc.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <FileText className="w-3 h-3 text-blue-500 flex-shrink-0" />
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">{timeAgo(doc.updatedAt)}</span>
                      {doc.starred && <Star className="w-3 h-3 text-amber-400 fill-current flex-shrink-0" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── List View ── */}
          {viewMode === "list" && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] overflow-hidden transition-opacity duration-300">
              {/* Header */}
              <div className="grid grid-cols-[40%_20%_30%_10%] px-4 py-2 border-b border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/20 purple:border-pink-500/20 text-[11px] font-semibold text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wide">
                <span>Name</span>
                <span>Owner</span>
                <span>Last opened</span>
                <span></span>
              </div>
              {/* Rows */}
              {filteredDocs.map(doc => (
                <div key={doc.id}
                  onClick={() => handleOpenDoc(doc.id)}
                  className="grid grid-cols-[40%_20%_30%_10%] items-center px-4 h-[52px] border-b border-gray-50 dark:border-[#1a1d24]/50 midnight:border-cyan-500/10 purple:border-pink-500/10 last:border-b-0 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-[13px] text-gray-800 dark:text-gray-200 midnight:text-cyan-50 purple:text-pink-50 truncate">{doc.title}</span>
                    {doc.starred && <Star className="w-3 h-3 text-amber-400 fill-current flex-shrink-0" />}
                  </div>
                  <span className="text-[12px] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">{doc.owner}</span>
                  <span className="text-[12px] text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">{timeAgo(doc.updatedAt)}</span>
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={e => { e.stopPropagation(); toggleStar(doc.id); }}
                      className={`p-1 rounded cursor-pointer ${doc.starred ? "text-amber-400" : "text-gray-400 hover:text-amber-400"}`}>
                      <Star className={`w-3.5 h-3.5 ${doc.starred ? "fill-current" : ""}`} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === doc.id ? null : doc.id); }}
                      className="p-1 rounded text-gray-400 hover:text-gray-600 cursor-pointer relative">
                      <MoreVertical className="w-3.5 h-3.5" />
                      {menuOpenId === doc.id && (
                        <div className="absolute top-full right-0 mt-1 w-[160px] bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 z-50 py-1"
                          onClick={e => e.stopPropagation()}>
                          <button className="w-full px-3 py-1.5 text-left text-[12px] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 flex items-center gap-2 cursor-pointer"
                            onClick={() => { handleOpenDoc(doc.id); setMenuOpenId(null); }}>
                            <ExternalLink className="w-3.5 h-3.5" /> Open
                          </button>
                          <button className="w-full px-3 py-1.5 text-left text-[12px] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 flex items-center gap-2 cursor-pointer"
                            onClick={() => setMenuOpenId(null)}>
                            <Copy className="w-3.5 h-3.5" /> Make a copy
                          </button>
                          <button className="w-full px-3 py-1.5 text-left text-[12px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 cursor-pointer"
                            onClick={() => { deleteDoc(doc.id); setMenuOpenId(null); }}>
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredDocs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FolderOpen className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-[14px] font-medium">No documents found</p>
              <p className="text-[12px] mt-1">Try a different search or create a new document</p>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}

// ── Template Preview Card — renders real HTML content as a scaled-down preview ──
// CATEGORY_COLORS imported from lib/doc-templates

function TemplatePreviewCard({ template, onClick }: { template: typeof DOC_TEMPLATES[number]; onClick: () => void }) {
  const accent = CATEGORY_COLORS[template.category || ""] || "#9ca3af";

  return (
    <button onClick={onClick} className="flex-shrink-0 w-[150px] group cursor-pointer text-left">
      <div className="aspect-[3/4] rounded-xl bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] relative transition-shadow duration-300 hover:shadow-xl"
        style={{ borderTop: `3px solid ${accent}`, boxShadow: '0 0 0 1px rgba(0,0,0,0.06)' }}>
        {/* Clip container — starts below accent border */}
        <div className="absolute left-0 right-0 top-0 bottom-0 overflow-hidden rounded-b-xl">
          {/* Scaled-down real HTML preview */}
          <div className="w-[420px] origin-top-left pointer-events-none" style={{ transform: "scale(0.355)" }}>
            <div
              className="px-7 pt-5 pb-8 text-[13px] leading-[1.6] text-gray-800 dark:text-gray-200 midnight:text-cyan-50 purple:text-pink-50 [&_h1]:text-[22px] [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:leading-tight [&_h2]:text-[16px] [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-1 [&_h3]:text-[14px] [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_p]:my-1 [&_ul]:pl-5 [&_ul]:my-1 [&_ul]:list-disc [&_li]:my-0.5 [&_hr]:my-3 [&_hr]:border-gray-200 [&_strong]:font-semibold [&_em]:italic"
              dangerouslySetInnerHTML={{ __html: template.html || "" }}
            />
          </div>
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-gray-900 midnight:from-[#0d1526] purple:from-[#1f1035] to-transparent" />
        </div>
        {/* Hover border highlight */}
        <div className="absolute inset-[-1px] rounded-xl border-2 border-transparent group-hover:border-blue-400/50 transition-colors duration-300 pointer-events-none" />
      </div>
      <p className="mt-2 text-[12px] font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 truncate text-center">{template.label}</p>
    </button>
  );
}
