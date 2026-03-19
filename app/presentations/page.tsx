"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { slideStorage, type StoredPresentation } from "@/lib/slide-storage";
import { SLIDE_TEMPLATES, SLIDE_TEMPLATE_CATEGORIES, SLIDE_CATEGORY_COLORS } from "@/lib/slide-templates";
import {
  Plus, Search, LayoutGrid, List, Clock, ChevronDown,
  MoreVertical, Star, Trash2, Copy, ExternalLink, FolderOpen, Presentation,
} from "lucide-react";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
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

export default function PresentationsHomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"lastOpened" | "title">("lastOpened");
  const [sortOpen, setSortOpen] = useState(false);
  const [storedPres, setStoredPres] = useState<StoredPresentation[]>([]);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const refreshPres = useCallback(() => setStoredPres(slideStorage.list()), []);
  useEffect(() => { refreshPres(); }, [refreshPres]);

  const filteredPres = useMemo(() => {
    let result = storedPres;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => d.title.toLowerCase().includes(q));
    }
    if (sortBy === "title") result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [storedPres, searchQuery, sortBy]);

  const handleNewPres = (template?: typeof SLIDE_TEMPLATES[number]) => {
    if (template) {
      const id = slideStorage.create({ title: template.title, slides: template.slides, theme: template.theme });
      router.push(`/presentations/editor?id=${id}`);
    } else {
      router.push("/presentations/editor");
    }
  };

  const handleOpenPres = (id: string) => router.push(`/presentations/editor?id=${id}`);
  const toggleStar = (id: string) => { slideStorage.toggleStar(id); refreshPres(); };
  const deletePres = (id: string) => { slideStorage.remove(id); refreshPres(); };

  return (
    <MainLayout>
      <div className="max-w-[1200px] mx-auto">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-[720px] mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search presentations..."
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[14px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
          </div>
        </div>

        {/* Start a New Presentation */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Start a new presentation</h2>
            <button onClick={() => router.push("/presentations/templates")}
              className="text-[12px] font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
              Template gallery
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
            {/* Blank */}
            <button onClick={() => handleNewPres()} className="flex-shrink-0 w-[180px] group cursor-pointer">
              <div className="aspect-video rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 flex items-center justify-center transition-shadow duration-300 hover:border-blue-400 hover:shadow-lg">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  <Plus className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
              <p className="mt-2 text-[12px] font-medium text-gray-600 dark:text-gray-400 text-center">Blank</p>
            </button>
            {/* Template previews */}
            {SLIDE_TEMPLATES.slice(0, 5).map(tpl => (
              <SlideTemplateCard key={tpl.id} template={tpl} onClick={() => handleNewPres(tpl)} />
            ))}
          </div>
        </section>

        {/* Recent Presentations */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Recent presentations</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <Clock className="w-3.5 h-3.5" />
                  {sortBy === "lastOpened" ? "Last opened" : "Title"}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-1 w-[160px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-lg shadow-xl border border-gray-200/60 dark:border-gray-700/60 z-50 py-1">
                    {([["lastOpened", "Last opened"], ["title", "Title"]] as const).map(([key, label]) => (
                      <button key={key} onClick={() => { setSortBy(key); setSortOpen(false); }}
                        className={`w-full px-3 py-2 text-left text-[12px] cursor-pointer transition-colors ${sortBy === key ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20 font-medium" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button onClick={() => setViewMode("grid")}
                  className={`p-1.5 transition-colors cursor-pointer ${viewMode === "grid" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode("list")}
                  className={`p-1.5 transition-colors cursor-pointer ${viewMode === "list" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredPres.map(pres => (
                <div key={pres.id} className="group relative cursor-pointer" onClick={() => handleOpenPres(pres.id)}>
                  <div className="aspect-video rounded-xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/50 shadow-sm transition-shadow duration-300 group-hover:shadow-lg relative overflow-hidden">
                    {pres.slides[0] ? (
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="w-[640px] origin-top-left pointer-events-none" style={{ transform: "scale(0.28)" }}>
                          <div style={{ aspectRatio: "16/9", background: pres.slides[0].background || "#fff" }}
                            dangerouslySetInnerHTML={{ __html: pres.slides[0].content }} />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Presentation className="w-8 h-8 text-blue-400/30" />
                      </div>
                    )}
                    {/* Hover actions */}
                    <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <button onClick={e => { e.stopPropagation(); toggleStar(pres.id); }}
                        className={`p-1 rounded-full shadow-sm ${pres.starred ? "text-amber-400 bg-white" : "text-gray-400 bg-white/90"} cursor-pointer`}>
                        <Star className={`w-3 h-3 ${pres.starred ? "fill-current" : ""}`} />
                      </button>
                      <button onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === pres.id ? null : pres.id); }}
                        className="p-1 rounded-full text-gray-400 bg-white/90 cursor-pointer shadow-sm">
                        <MoreVertical className="w-3 h-3" />
                      </button>
                    </div>
                    {menuOpenId === pres.id && (
                      <div className="absolute top-8 right-1.5 w-[140px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-lg shadow-xl border border-gray-200/60 z-50 py-1"
                        onClick={e => e.stopPropagation()}>
                        <button className="w-full px-3 py-1.5 text-left text-[12px] text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                          onClick={() => { handleOpenPres(pres.id); setMenuOpenId(null); }}>
                          <ExternalLink className="w-3.5 h-3.5" /> Open
                        </button>
                        <button className="w-full px-3 py-1.5 text-left text-[12px] text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                          onClick={() => { deletePres(pres.id); setMenuOpenId(null); }}>
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    )}
                    <div className="absolute inset-[-1px] rounded-xl border-2 border-transparent group-hover:border-blue-400/50 transition-colors duration-300 pointer-events-none z-[5]" />
                  </div>
                  <div className="mt-2 px-0.5">
                    <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 truncate">{pres.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Presentation className="w-3 h-3 text-orange-500 flex-shrink-0" />
                      <span className="text-[11px] text-gray-400">{timeAgo(pres.updatedAt)}</span>
                      {pres.starred && <Star className="w-3 h-3 text-amber-400 fill-current" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
              <div className="grid grid-cols-[40%_20%_30%_10%] px-4 py-2 border-b border-gray-100 dark:border-gray-800 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                <span>Name</span><span>Owner</span><span>Last opened</span><span></span>
              </div>
              {filteredPres.map(pres => (
                <div key={pres.id} onClick={() => handleOpenPres(pres.id)}
                  className="grid grid-cols-[40%_20%_30%_10%] items-center px-4 h-[52px] border-b border-gray-50 dark:border-gray-800/50 last:border-b-0 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer group">
                  <div className="flex items-center gap-3 min-w-0">
                    <Presentation className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span className="text-[13px] text-gray-800 dark:text-gray-200 truncate">{pres.title}</span>
                    {pres.starred && <Star className="w-3 h-3 text-amber-400 fill-current flex-shrink-0" />}
                  </div>
                  <span className="text-[12px] text-gray-500">{pres.owner}</span>
                  <span className="text-[12px] text-gray-500">{timeAgo(pres.updatedAt)}</span>
                  <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === pres.id ? null : pres.id); }}
                      className="p-1 rounded text-gray-400 hover:text-gray-600 cursor-pointer relative">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredPres.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FolderOpen className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-[14px] font-medium">No presentations found</p>
              <p className="text-[12px] mt-1">Create a new presentation or try a different search</p>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}

// Slide template preview card
function SlideTemplateCard({ template, onClick }: { template: typeof SLIDE_TEMPLATES[number]; onClick: () => void }) {
  const accent = SLIDE_CATEGORY_COLORS[template.category] || "#6b7280";
  const firstSlide = template.slides[0];

  return (
    <button onClick={onClick} className="flex-shrink-0 w-[180px] group cursor-pointer text-left">
      <div className="aspect-video rounded-xl bg-white dark:bg-gray-900 relative transition-shadow duration-300 hover:shadow-xl overflow-hidden"
        style={{ borderTop: `3px solid ${accent}`, boxShadow: '0 0 0 1px rgba(0,0,0,0.06)' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="w-[640px] origin-top-left pointer-events-none" style={{ transform: "scale(0.28)" }}>
            <div style={{ aspectRatio: "16/9", background: firstSlide?.background || "#fff" }}
              dangerouslySetInnerHTML={{ __html: firstSlide?.content || "" }} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
        </div>
        <div className="absolute inset-[-1px] rounded-xl border-2 border-transparent group-hover:border-blue-400/50 transition-colors duration-300 pointer-events-none" />
      </div>
      <p className="mt-2 text-[12px] font-medium text-gray-700 dark:text-gray-300 truncate text-center">{template.label}</p>
    </button>
  );
}
