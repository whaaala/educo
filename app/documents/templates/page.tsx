"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { DOC_TEMPLATES, TEMPLATE_CATEGORIES, CATEGORY_COLORS } from "@/lib/doc-templates";
import { docStorage } from "@/lib/doc-storage";
import { ArrowLeft, Search, Plus, FileText } from "lucide-react";

export default function TemplateGalleryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = searchQuery
    ? DOC_TEMPLATES.filter(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : activeCategory
      ? DOC_TEMPLATES.filter(t => t.category === activeCategory)
      : DOC_TEMPLATES;

  const handleUseTemplate = (tpl: typeof DOC_TEMPLATES[number]) => {
    const id = docStorage.create({ title: tpl.title, html: tpl.html, language: "en" });
    router.push(`/doc-editor-test?id=${id}`);
  };

  return (
    <MainLayout>
      <div className="max-w-[1200px] mx-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push("/documents")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
          </button>
          <div>
            <h1 className="text-[1.25rem] font-bold text-ink">Template Gallery</h1>
            <p className="text-[0.8125rem] text-muted">{DOC_TEMPLATES.length} templates across {TEMPLATE_CATEGORIES.length} categories</p>
          </div>
        </div>

        {/* Search + category filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setActiveCategory(null); }}
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-line bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-[0.8125rem] text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { setActiveCategory(null); setSearchQuery(""); }}
              className={`px-3 py-1.5 rounded-lg text-[0.75rem] font-medium transition-colors cursor-pointer ${!activeCategory && !searchQuery ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"}`}
            >
              All
            </button>
            {TEMPLATE_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setSearchQuery(""); }}
                className={`px-3 py-1.5 rounded-lg text-[0.75rem] font-medium transition-colors cursor-pointer ${activeCategory === cat ? "text-white" : "bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"}`}
                style={activeCategory === cat ? { backgroundColor: CATEGORY_COLORS[cat] || "#6b7280" } : undefined}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blank document card */}
        {!searchQuery && !activeCategory && (
          <div className="mb-6">
            <button
              onClick={() => router.push("/doc-editor-test")}
              className="w-full sm:w-auto flex items-center gap-3 px-5 py-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] flex items-center justify-center">
                <Plus className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-left">
                <p className="text-[0.875rem] font-semibold text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">Blank document</p>
                <p className="text-[0.75rem] text-gray-400">Start from scratch</p>
              </div>
            </button>
          </div>
        )}

        {/* Template grid by category */}
        {!searchQuery && !activeCategory ? (
          // Show all categories with headers
          TEMPLATE_CATEGORIES.map(cat => {
            const catTemplates = DOC_TEMPLATES.filter(t => t.category === cat);
            return (
              <div key={cat} className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] || "#6b7280" }} />
                  <h2 className="text-[0.875rem] font-bold text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">{cat}</h2>
                  <span className="text-[0.6875rem] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 ml-1">{catTemplates.length} templates</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {catTemplates.map(tpl => (
                    <GalleryCard key={tpl.id} template={tpl} onClick={() => handleUseTemplate(tpl)} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          // Filtered results
          <div>
            <p className="text-[0.75rem] text-muted mb-4">
              {filtered.length} template{filtered.length !== 1 ? "s" : ""} found
              {activeCategory && <span> in <strong>{activeCategory}</strong></span>}
              {searchQuery && <span> matching &quot;<strong>{searchQuery}</strong>&quot;</span>}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map(tpl => (
                <GalleryCard key={tpl.id} template={tpl} onClick={() => handleUseTemplate(tpl)} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <FileText className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-[0.875rem] font-medium">No templates found</p>
                <p className="text-[0.75rem] mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

// Gallery card with real HTML preview
function GalleryCard({ template, onClick }: { template: typeof DOC_TEMPLATES[number]; onClick: () => void }) {
  const accent = CATEGORY_COLORS[template.category] || "#9ca3af";

  return (
    <button onClick={onClick} className="group cursor-pointer text-left w-full">
      <div className="aspect-[3/4] rounded-xl bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] relative transition-shadow duration-300 hover:shadow-xl"
        style={{ borderTop: `3px solid ${accent}`, boxShadow: '0 0 0 1px rgba(0,0,0,0.06)' }}>
        <div className="absolute left-0 right-0 top-0 bottom-0 overflow-hidden rounded-b-xl">
          <div className="w-[420px] origin-top-left pointer-events-none" style={{ transform: "scale(0.355)" }}>
            <div
              className="px-7 pt-5 pb-8 text-[0.8125rem] leading-[1.6] text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 [&_h1]:text-[1.375rem] [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:leading-tight [&_h2]:text-[1rem] [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-1 [&_h3]:text-[0.875rem] [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_p]:my-1 [&_ul]:pl-5 [&_ul]:my-1 [&_ul]:list-disc [&_li]:my-0.5 [&_hr]:my-3 [&_hr]:border-gray-200 [&_strong]:font-semibold [&_em]:italic"
              dangerouslySetInnerHTML={{ __html: template.html }}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
        </div>
        <div className="absolute inset-[-1px] rounded-xl border-2 border-transparent group-hover:border-blue-400/50 transition-colors duration-300 pointer-events-none" />
      </div>
      <div className="mt-2 px-0.5">
        <p className="text-[0.8125rem] font-semibold text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 truncate">{template.label}</p>
        <p className="text-[0.6875rem] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 mt-0.5">{template.category}</p>
      </div>
    </button>
  );
}
