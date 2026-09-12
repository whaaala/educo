"use client";

import { useState, type ComponentType } from "react";
import {
  GraduationCap,
  Repeat,
  Briefcase,
  Users,
  Lightbulb,
  Compass,
  GitBranch,
  TrendingUp,
  Heart,
  LayoutTemplate,
  Search,
} from "lucide-react";
import { TEMPLATES, TEMPLATE_CATEGORIES } from "./Whiteboard/whiteboard-templates";
import type { WhiteboardTemplate, TemplateCategory } from "./Whiteboard/whiteboard-templates";
import type { WhiteboardElement } from "./Whiteboard/whiteboard-types";

// ─── Category Icons ──────────────────────────────────────

type IconComp = ComponentType<{ className?: string }>;

const CATEGORY_ICONS: Record<string, IconComp> = {
  education: GraduationCap,
  agile: Repeat,
  strategy: Briefcase,
  meetings: Users,
  brainstorming: Lightbulb,
  design: Compass,
  diagrams: GitBranch,
  marketing: TrendingUp,
  teambuilding: Heart,
};

// ─── Props ───────────────────────────────────────────────

export interface TemplatePickerProps {
  /** Called when a template is selected */
  onSelect: (elements: WhiteboardElement[], template: WhiteboardTemplate) => void;
  /** Optional: restrict to specific categories */
  categories?: TemplateCategory[];
  /** Compact mode for inline usage (e.g., toolbar panel) */
  compact?: boolean;
  /** Optional CSS class */
  className?: string;
}

// ─── Main Component ──────────────────────────────────────

export default function TemplatePicker({
  onSelect,
  categories,
  compact = false,
  className = "",
}: TemplatePickerProps) {
  const availableCategories = categories
    ? TEMPLATE_CATEGORIES.filter((c) => categories.includes(c.id))
    : TEMPLATE_CATEGORIES;

  const [activeCategory, setActiveCategory] = useState<string>(
    availableCategories[0]?.id || "education"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = TEMPLATES.filter((t) => {
    const matchesCategory = t.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return searchQuery ? matchesSearch : matchesCategory;
  });

  const handleSelect = (tpl: WhiteboardTemplate) => {
    // Clone elements with fresh IDs so each usage is independent
    const cloned = tpl.elements.map((el, i) => ({
      ...el,
      id: `tpl-${Date.now()}-${i}`,
      points: el.points ? el.points.map((p) => ({ ...p })) : undefined,
    }));
    onSelect(cloned, tpl);
  };

  if (compact) {
    return (
      <div className={`${className}`}>
        {/* Category tabs */}
        <div className="flex flex-wrap gap-1 mb-2">
          {availableCategories.map((cat) => {
            const CatIcon = CATEGORY_ICONS[cat.id] || LayoutTemplate;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSearchQuery(""); }}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[0.625rem] font-semibold transition-all duration-150 cursor-pointer ${
                  activeCategory === cat.id && !searchQuery
                    ? "bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 midnight:bg-cyan-500/20 midnight:text-cyan-400 purple:bg-pink-500/20 purple:text-pink-400"
                    : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                }`}
                title={cat.label}
              >
                <CatIcon className="w-3 h-3" />
                <span>{cat.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Template list */}
        <div className="flex flex-col gap-0.5 max-h-[240px] overflow-y-auto scrollbar-thin">
          {filteredTemplates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => handleSelect(tpl)}
              className="flex flex-col gap-0.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150 cursor-pointer hover:bg-white dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 group"
            >
              <span className="text-[0.6875rem] font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 midnight:group-hover:text-cyan-400 purple:group-hover:text-pink-400 transition-colors">
                {tpl.name}
              </span>
              <span className="text-[0.625rem] text-gray-400 dark:text-gray-500 midnight:text-cyan-400/40 purple:text-pink-400/40 leading-tight">
                {tpl.description}
              </span>
            </button>
          ))}
          {filteredTemplates.length === 0 && (
            <div className="text-[0.6875rem] text-gray-400 dark:text-gray-500 text-center py-4">
              No templates found
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Full-size mode (for standalone pages, modals, sidebars) ────

  return (
    <div className={`flex flex-col bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/15 purple:border-pink-500/15 shadow-lg overflow-hidden ${className}`}>
      {/* Header with search */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 mb-2">
          Templates
        </h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-[0.75rem] bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 border border-line text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/30 dark:focus:ring-blue-500/40"
          />
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Category sidebar */}
        <div className="w-[140px] flex-shrink-0 border-r border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 overflow-y-auto py-2">
          {availableCategories.map((cat) => {
            const CatIcon = CATEGORY_ICONS[cat.id] || LayoutTemplate;
            const isActive = activeCategory === cat.id && !searchQuery;
            const count = TEMPLATES.filter((t) => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSearchQuery(""); }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-left transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-blue-50/60 dark:bg-blue-500/8 midnight:bg-cyan-500/8 purple:bg-pink-500/8"
                    : "hover:bg-gray-50 dark:hover:bg-[#22262e]/40 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"
                }`}
              >
                <CatIcon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive
                      ? "text-blue-500 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-[0.6875rem] font-semibold block truncate ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-300 purple:text-pink-300"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {cat.label}
                  </span>
                  <span className="text-[0.5625rem] text-gray-400 dark:text-gray-600">
                    {count} templates
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Template grid */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-2">
            {filteredTemplates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleSelect(tpl)}
                className="flex flex-col gap-1 p-3 rounded-xl text-left transition-all duration-150 cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-500/20 midnight:hover:border-cyan-500/20 purple:hover:border-pink-500/20 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 group"
              >
                {/* Template preview placeholder */}
                <div className="w-full h-16 rounded-lg bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 flex items-center justify-center">
                  <LayoutTemplate className="w-6 h-6 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 dark:group-hover:text-blue-500 transition-colors" />
                </div>
                <span className="text-[0.6875rem] font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 midnight:group-hover:text-cyan-400 purple:group-hover:text-pink-400 transition-colors">
                  {tpl.name}
                </span>
                <span className="text-[0.5625rem] text-gray-400 dark:text-gray-500 midnight:text-cyan-400/40 purple:text-pink-400/40 leading-tight line-clamp-2">
                  {tpl.description}
                </span>
              </button>
            ))}
          </div>
          {filteredTemplates.length === 0 && (
            <div className="text-[0.75rem] text-gray-400 dark:text-gray-500 text-center py-8">
              No templates found for &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
