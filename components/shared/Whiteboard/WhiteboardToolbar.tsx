"use client";

import { useState, useRef, useEffect } from "react";
import {
  MousePointer2,
  Hand,
  Pencil,
  Highlighter,
  Eraser,
  Square,
  Circle,
  Triangle,
  Diamond,
  Star,
  Hexagon,
  Minus,
  MoveRight,
  MoveHorizontal,
  Spline,
  Type,
  StickyNote,
  RectangleHorizontal,
  FileText,
  ChevronRight,
  LayoutTemplate,
  GraduationCap,
  Briefcase,
  Repeat,
  X,
} from "lucide-react";
import type { WhiteboardTool, WhiteboardElement } from "./whiteboard-types";
import { TEMPLATES, TEMPLATE_CATEGORIES } from "./whiteboard-templates";

// ─── Icon types ──────────────────────────────────────────

type IconComp = React.ComponentType<{ className?: string }>;

// Custom SVG icons for shapes that don't have lucide equivalents
function RoundedRectIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="4" ry="4" />
    </svg>
  );
}

function CylinderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v12c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
    </svg>
  );
}

function ParallelogramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="7,4 22,4 17,20 2,20" />
    </svg>
  );
}

function PillIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="10" rx="5" ry="5" />
    </svg>
  );
}

function FlowDataIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6,4 22,4 18,20 2,20" />
    </svg>
  );
}

// ─── Tool definitions ────────────────────────────────────

interface ToolDef {
  id: WhiteboardTool;
  icon: IconComp;
  label: string;
}

const PRIMARY_TOOLS: ToolDef[] = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "hand", icon: Hand, label: "Pan" },
  { id: "pen", icon: Pencil, label: "Pen" },
  { id: "highlighter", icon: Highlighter, label: "Highlighter" },
  { id: "eraser", icon: Eraser, label: "Eraser" },
];

interface ToolSection {
  id: string;
  label: string;
  icon: IconComp;
  tools: ToolDef[];
  columns?: number;
}

const SECTIONS: ToolSection[] = [
  {
    id: "shapes",
    label: "Shapes",
    icon: Square,
    columns: 3,
    tools: [
      { id: "rectangle", icon: Square, label: "Rectangle" },
      { id: "circle", icon: Circle, label: "Circle" },
      { id: "triangle", icon: Triangle, label: "Triangle" },
      { id: "diamond", icon: Diamond, label: "Diamond" },
      { id: "star", icon: Star, label: "Star" },
      { id: "hexagon", icon: Hexagon, label: "Hexagon" },
      { id: "rounded-rect", icon: RoundedRectIcon, label: "Rounded" },
      { id: "cylinder", icon: CylinderIcon, label: "Cylinder" },
      { id: "parallelogram", icon: ParallelogramIcon, label: "Slanted" },
    ],
  },
  {
    id: "lines",
    label: "Lines & Arrows",
    icon: MoveRight,
    columns: 2,
    tools: [
      { id: "line", icon: Minus, label: "Line" },
      { id: "arrow", icon: MoveRight, label: "Arrow" },
      { id: "double-arrow", icon: MoveHorizontal, label: "Both ways" },
      { id: "connector", icon: Spline, label: "Connector" },
    ],
  },
  {
    id: "text",
    label: "Text & Notes",
    icon: Type,
    columns: 2,
    tools: [
      { id: "text", icon: Type, label: "Text" },
      { id: "sticky", icon: StickyNote, label: "Sticky Note" },
    ],
  },
  {
    id: "flowchart",
    label: "Flowchart",
    icon: RectangleHorizontal,
    columns: 3,
    tools: [
      { id: "flowchart-process", icon: RectangleHorizontal, label: "Process" },
      { id: "flowchart-decision", icon: Diamond, label: "Decision" },
      { id: "flowchart-terminal", icon: PillIcon, label: "Terminal" },
      { id: "flowchart-data", icon: FlowDataIcon, label: "Data" },
      { id: "flowchart-document", icon: FileText, label: "Document" },
    ],
  },
];

// ─── Props ───────────────────────────────────────────────

interface WhiteboardToolbarProps {
  activeTool: WhiteboardTool;
  onToolChange: (tool: WhiteboardTool) => void;
  onLoadTemplate?: (elements: WhiteboardElement[]) => void;
  readOnly?: boolean;
}

// ─── Component ───────────────────────────────────────────

export default function WhiteboardToolbar({
  activeTool,
  onToolChange,
  onLoadTemplate,
  readOnly = false,
}: WhiteboardToolbarProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateCategory, setTemplateCategory] = useState<string>("education");
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Close flyout when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setExpandedSection(null);
        setShowTemplates(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (readOnly) return null;

  const toggleSection = (id: string) => {
    setExpandedSection((prev) => (prev === id ? null : id));
    setShowTemplates(false);
  };

  const selectTool = (tool: WhiteboardTool) => {
    onToolChange(tool);
    setExpandedSection(null);
  };

  const toggleTemplates = () => {
    setShowTemplates((prev) => !prev);
    setExpandedSection(null);
  };

  const loadTemplate = (elements: WhiteboardElement[]) => {
    // Deep clone with fresh IDs
    const cloned = elements.map((el, i) => ({
      ...el,
      id: `tpl-${Date.now()}-${i}`,
      points: el.points ? el.points.map((p) => ({ ...p })) : undefined,
    }));
    onLoadTemplate?.(cloned);
    setShowTemplates(false);
  };

  // Check if active tool is in a section
  const getActiveSection = () => {
    for (const section of SECTIONS) {
      if (section.tools.some((t) => t.id === activeTool)) return section.id;
    }
    return null;
  };

  const activeSection = getActiveSection();

  return (
    <div
      ref={toolbarRef}
      className="flex flex-col bg-white dark:bg-gray-800 midnight:bg-[#0f1729] purple:bg-[#2a1a3e] border-r border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm select-none overflow-y-auto overflow-x-hidden scrollbar-thin"
      style={{ width: 180 }}
    >
      {/* Primary tools — always visible */}
      <div className="flex flex-wrap gap-1 p-2 pb-1">
        {PRIMARY_TOOLS.map((tool) => (
          <PrimaryToolButton
            key={tool.id}
            tool={tool}
            isActive={activeTool === tool.id}
            onClick={() => {
              onToolChange(tool.id);
              setExpandedSection(null);
              setShowTemplates(false);
            }}
          />
        ))}
      </div>

      <Divider />

      {/* Accordion sections */}
      {SECTIONS.map((section) => (
        <div key={section.id}>
          <SectionHeader
            section={section}
            isExpanded={expandedSection === section.id}
            isActive={activeSection === section.id}
            onClick={() => toggleSection(section.id)}
          />
          {expandedSection === section.id && (
            <SectionGrid
              section={section}
              activeTool={activeTool}
              onSelect={selectTool}
            />
          )}
          <Divider />
        </div>
      ))}

      {/* Templates section */}
      <div>
        <button
          onClick={toggleTemplates}
          className={`flex items-center gap-2 w-full px-3 py-2.5 text-left transition-colors duration-150 cursor-pointer ${
            showTemplates
              ? "bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20"
              : "hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"
          }`}
        >
          <LayoutTemplate className="w-4 h-4 text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 flex-shrink-0" />
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 flex-1 truncate">
            Templates
          </span>
          <ChevronRight
            className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-transform duration-200 flex-shrink-0 ${
              showTemplates ? "rotate-90" : ""
            }`}
          />
        </button>

        {showTemplates && (
          <TemplatePanel
            category={templateCategory}
            onCategoryChange={setTemplateCategory}
            onSelect={loadTemplate}
            onClose={() => setShowTemplates(false)}
          />
        )}
      </div>
    </div>
  );
}

// ─── Primary tool button ─────────────────────────────────

function PrimaryToolButton({
  tool,
  isActive,
  onClick,
}: {
  tool: ToolDef;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = tool.icon;
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 cursor-pointer ${
        isActive
          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 midnight:bg-cyan-900/30 midnight:text-cyan-400 purple:bg-pink-900/30 purple:text-pink-400 shadow-sm ring-1 ring-blue-200 dark:ring-blue-800 midnight:ring-cyan-700 purple:ring-pink-700"
          : "text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
      }`}
      title={tool.label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

// ─── Accordion section header ────────────────────────────

function SectionHeader({
  section,
  isExpanded,
  isActive,
  onClick,
}: {
  section: ToolSection;
  isExpanded: boolean;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = section.icon;
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 w-full px-3 py-2.5 text-left transition-colors duration-150 cursor-pointer ${
        isExpanded
          ? "bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20"
          : isActive
          ? "bg-gray-50 dark:bg-gray-700/30 midnight:bg-cyan-900/10 purple:bg-pink-900/10"
          : "hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"
      }`}
    >
      <Icon
        className={`w-4 h-4 flex-shrink-0 ${
          isActive
            ? "text-blue-500 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
            : "text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70"
        }`}
      />
      <span
        className={`text-xs font-semibold flex-1 truncate ${
          isActive
            ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-300 purple:text-pink-300"
            : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
        }`}
      >
        {section.label}
      </span>
      <span className="text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0">
        {section.tools.length}
      </span>
      <ChevronRight
        className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-transform duration-200 flex-shrink-0 ${
          isExpanded ? "rotate-90" : ""
        }`}
      />
    </button>
  );
}

// ─── Section tool grid ───────────────────────────────────

function SectionGrid({
  section,
  activeTool,
  onSelect,
}: {
  section: ToolSection;
  activeTool: WhiteboardTool;
  onSelect: (tool: WhiteboardTool) => void;
}) {
  const cols = section.columns || 3;
  return (
    <div
      className="grid gap-1 p-2 pt-1 bg-gray-50/50 dark:bg-gray-800/50 midnight:bg-cyan-900/5 purple:bg-pink-900/5"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {section.tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.id;
        return (
          <button
            key={tool.id}
            onClick={() => onSelect(tool.id)}
            className={`flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-lg transition-all duration-150 cursor-pointer ${
              isActive
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 midnight:bg-cyan-900/30 midnight:text-cyan-400 purple:bg-pink-900/30 purple:text-pink-400 shadow-sm ring-1 ring-blue-200 dark:ring-blue-800 midnight:ring-cyan-700 purple:ring-pink-700"
                : "text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 hover:bg-white dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 hover:shadow-sm"
            }`}
            title={tool.label}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[9px] font-medium leading-tight truncate w-full text-center">
              {tool.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Template panel ──────────────────────────────────────

const CATEGORY_ICONS: Record<string, IconComp> = {
  education: GraduationCap,
  agile: Repeat,
  project: Briefcase,
};

function TemplatePanel({
  category,
  onCategoryChange,
  onSelect,
  onClose,
}: {
  category: string;
  onCategoryChange: (cat: string) => void;
  onSelect: (elements: WhiteboardElement[]) => void;
  onClose: () => void;
}) {
  const templates = TEMPLATES.filter((t) => t.category === category);

  return (
    <div className="bg-gray-50/50 dark:bg-gray-800/50 midnight:bg-cyan-900/5 purple:bg-pink-900/5 border-t border-gray-100 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10">
      {/* Category tabs */}
      <div className="flex gap-0.5 px-2 pt-2">
        {TEMPLATE_CATEGORIES.map((cat) => {
          const CatIcon = CATEGORY_ICONS[cat.id] || LayoutTemplate;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-semibold transition-colors duration-150 cursor-pointer ${
                category === cat.id
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 midnight:bg-cyan-900/30 midnight:text-cyan-400 purple:bg-pink-900/30 purple:text-pink-400"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
              }`}
              title={cat.label}
            >
              <CatIcon className="w-3 h-3" />
              <span className="hidden lg:inline">{cat.label.split(" ")[0]}</span>
            </button>
          );
        })}
        <div className="flex-1" />
        <button
          onClick={onClose}
          className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          title="Close templates"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Template list */}
      <div className="flex flex-col gap-1 p-2 max-h-[280px] overflow-y-auto scrollbar-thin">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => onSelect(tpl.elements)}
            className="flex flex-col gap-0.5 px-3 py-2 rounded-lg text-left transition-all duration-150 cursor-pointer hover:bg-white dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 hover:shadow-sm group"
          >
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 midnight:group-hover:text-cyan-400 purple:group-hover:text-pink-400 transition-colors">
              {tpl.name}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50 leading-tight">
              {tpl.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────

function Divider() {
  return (
    <div className="h-px mx-3 bg-gray-100 dark:bg-gray-700/50 midnight:bg-cyan-500/10 purple:bg-pink-500/10" />
  );
}
