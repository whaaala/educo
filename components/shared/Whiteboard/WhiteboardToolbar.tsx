"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MousePointer2,
  Hand,
  PenLine,
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
  ChevronDown,
  LayoutTemplate,
  GraduationCap,
  Briefcase,
  Repeat,
  PanelLeftOpen,
  PanelLeftClose,
  Check,
  Shapes,
  ImagePlus,
  Table2,
  BarChart3,
  LineChart,
  PieChart,
  Download,
  Copy,
  Palette,
  Ban,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronsUpDown,
} from "lucide-react";
import type { WhiteboardTool, WhiteboardElement, FontFamily, TextAlign, StrokeDashPattern } from "./whiteboard-types";
import {
  DEFAULT_COLORS,
  FILL_COLORS,
  FILL_TOOLS,
  STICKY_COLORS,
  STROKE_WIDTHS,
  FONT_FAMILIES,
  FONT_SIZES,
  LINE_SPACINGS,
  STROKE_DASH_PATTERNS,
  EXTENDED_STROKE_WIDTHS,
  LINE_TOOLS,
  BBOX_SHAPE_TOOLS,
} from "./whiteboard-types";
import { TEMPLATES, TEMPLATE_CATEGORIES } from "./whiteboard-templates";

// ─── Custom SVG icons (refined) ─────────────────────────

type IconComp = React.ComponentType<{ className?: string }>;

function RoundedRectIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="5" ry="5" />
    </svg>
  );
}

function CylinderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v12c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
    </svg>
  );
}

function ParallelogramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="7,4 22,4 17,20 2,20" />
    </svg>
  );
}

function PillIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="10" rx="5" ry="5" />
    </svg>
  );
}

function FlowDataIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6,4 22,4 18,20 2,20" />
    </svg>
  );
}

function CurvedConnectorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6 C12 6 12 18 20 18" />
      <circle cx="4" cy="6" r="1.5" fill="currentColor" />
      <circle cx="20" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}

function CurveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 18 Q12 2 20 18" />
    </svg>
  );
}

function PolylineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4,18 9,8 15,14 20,4" />
      <circle cx="4" cy="18" r="1.5" fill="currentColor" />
      <circle cx="9" cy="8" r="1.5" fill="currentColor" />
      <circle cx="15" cy="14" r="1.5" fill="currentColor" />
      <circle cx="20" cy="4" r="1.5" fill="currentColor" />
    </svg>
  );
}

function ScribbleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16 C6 10 8 14 10 8 C12 2 14 12 16 6 C18 0 20 10 20 8" />
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
  { id: "pen", icon: PenLine, label: "Pen" },
  { id: "highlighter", icon: Highlighter, label: "Highlight" },
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
    icon: Shapes,
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
      { id: "connector", icon: Spline, label: "Elbow" },
      { id: "curved-connector", icon: CurvedConnectorIcon, label: "Curved" },
      { id: "curve", icon: CurveIcon, label: "Curve" },
      { id: "polyline", icon: PolylineIcon, label: "Polyline" },
      { id: "scribble", icon: ScribbleIcon, label: "Scribble" },
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
  activeColor: string;
  activeStrokeWidth: number;
  activeFillColor: string | null;
  activeFontSize: number;
  activeStickyColor: string;
  activeFontFamily: FontFamily;
  activeFontWeight: "normal" | "bold";
  activeFontStyle: "normal" | "italic";
  activeTextDecoration: "none" | "underline";
  activeTextAlign: TextAlign;
  activeLineSpacing: number;
  activeStrokeDash: StrokeDashPattern;
  onColorChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
  onFillColorChange: (color: string | null) => void;
  onFontSizeChange: (size: number) => void;
  onStickyColorChange: (color: string) => void;
  onFontFamilyChange: (font: FontFamily) => void;
  onFontWeightToggle: () => void;
  onFontStyleToggle: () => void;
  onTextDecorationToggle: () => void;
  onTextAlignChange: (align: TextAlign) => void;
  onLineSpacingChange: (spacing: number) => void;
  onStrokeDashChange: (pattern: StrokeDashPattern) => void;
  onLoadTemplate?: (elements: WhiteboardElement[]) => void;
  onInsertImage?: () => void;
  onInsertTable?: (rows: number, cols: number) => void;
  onInsertChart?: (type: "bar" | "column" | "line" | "pie") => void;
  onExportPNG?: () => void;
  onExportJSON?: () => void;
  onCopyToClipboard?: () => void;
  readOnly?: boolean;
}

// ─── Main Component ──────────────────────────────────────

export default function WhiteboardToolbar({
  activeTool,
  onToolChange,
  activeColor,
  activeStrokeWidth,
  activeFillColor,
  activeFontSize,
  activeStickyColor,
  activeFontFamily,
  activeFontWeight,
  activeFontStyle,
  activeTextDecoration,
  activeTextAlign,
  activeLineSpacing,
  activeStrokeDash,
  onColorChange,
  onStrokeWidthChange,
  onFillColorChange,
  onFontSizeChange,
  onStickyColorChange,
  onFontFamilyChange,
  onFontWeightToggle,
  onFontStyleToggle,
  onTextDecorationToggle,
  onTextAlignChange,
  onLineSpacingChange,
  onStrokeDashChange,
  onLoadTemplate,
  onInsertImage,
  onInsertTable,
  onInsertChart,
  onExportPNG,
  onExportJSON,
  onCopyToClipboard,
  readOnly = false,
}: WhiteboardToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateCategory, setTemplateCategory] = useState<string>("education");
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Hover flyout state for collapsed mode
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Color flyout state for collapsed mode
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setExpandedSection(null);
        setShowTemplates(false);
        setHoveredSection(null);
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Cleanup hover timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (colorPickerTimeoutRef.current) clearTimeout(colorPickerTimeoutRef.current);
    };
  }, []);

  if (readOnly) return null;

  const toggleSection = (id: string) => {
    if (!isOpen) {
      setIsOpen(true);
      setExpandedSection(id);
      setShowTemplates(false);
    } else {
      setExpandedSection((prev) => (prev === id ? null : id));
      setShowTemplates(false);
    }
  };

  const selectTool = (tool: WhiteboardTool) => {
    onToolChange(tool);
    setExpandedSection(null);
    setHoveredSection(null);
  };

  const toggleTemplates = () => {
    if (!isOpen) {
      setIsOpen(true);
      setShowTemplates(true);
      setExpandedSection(null);
    } else {
      setShowTemplates((prev) => !prev);
      setExpandedSection(null);
    }
  };

  const loadTemplate = useCallback(
    (elements: WhiteboardElement[]) => {
      const cloned = elements.map((el, i) => ({
        ...el,
        id: `tpl-${Date.now()}-${i}`,
        points: el.points ? el.points.map((p) => ({ ...p })) : undefined,
      }));
      onLoadTemplate?.(cloned);
      setShowTemplates(false);
    },
    [onLoadTemplate]
  );

  // Flyout hover handlers
  const handleFlyoutEnter = (sectionId: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredSection(sectionId);
  };

  const handleFlyoutLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredSection(null);
    }, 150);
  };

  // Check if active tool is in a section
  const getActiveSection = () => {
    for (const section of SECTIONS) {
      if (section.tools.some((t) => t.id === activeTool)) return section.id;
    }
    return null;
  };

  const activeSection = getActiveSection();

  // Property visibility
  const showProperties = !["select", "eraser", "hand"].includes(activeTool);
  const showStrokeWidth = [
    "pen", "highlighter", "line", "arrow", "double-arrow", "connector",
    "rectangle", "circle", "triangle", "diamond", "star", "hexagon",
    "rounded-rect", "cylinder", "parallelogram",
    "flowchart-process", "flowchart-decision", "flowchart-terminal",
    "flowchart-data", "flowchart-document",
  ].includes(activeTool);
  const showFillColors = FILL_TOOLS.includes(activeTool);
  const showFontSize = activeTool === "text" || activeTool === "sticky";
  const showTextFormatting = activeTool === "text" || activeTool === "sticky";
  const showStrokeDash = [...BBOX_SHAPE_TOOLS, ...LINE_TOOLS, "pen", "highlighter", "polyline", "scribble"].includes(activeTool);
  const showStickyColors = activeTool === "sticky";

  // ─── Collapsed view ─────────────────────────────────────

  if (!isOpen) {
    return (
      <div
        ref={sidebarRef}
        className="absolute left-3 top-3 z-[50] flex flex-col items-center w-11 py-1.5 gap-0.5 bg-white/95 dark:bg-gray-900/95 midnight:bg-[#0d1526]/95 purple:bg-[#1f1035]/95 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/80 midnight:border-cyan-500/15 purple:border-pink-500/15 rounded-xl shadow-lg shadow-black/5 dark:shadow-black/20 select-none"
      >
        {/* Toggle open */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-150 cursor-pointer mb-0.5"
          title="Expand toolbar"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>

        <div className="w-6 h-px bg-gray-200/60 dark:bg-gray-700/60 midnight:bg-cyan-500/10 purple:bg-pink-500/10" />

        {/* Primary tools */}
        {PRIMARY_TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => onToolChange(tool.id)}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 midnight:bg-cyan-500/20 midnight:text-cyan-400 purple:bg-pink-500/20 purple:text-pink-400"
                  : "text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
              }`}
              title={tool.label}
            >
              <Icon className="w-[17px] h-[17px]" />
            </button>
          );
        })}

        <div className="w-6 h-px bg-gray-200/60 dark:bg-gray-700/60 midnight:bg-cyan-500/10 purple:bg-pink-500/10 my-0.5" />

        {/* Section icons with hover flyout */}
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          const isHovered = hoveredSection === section.id;
          return (
            <div key={section.id} className="relative">
              <button
                onMouseEnter={() => handleFlyoutEnter(section.id)}
                onMouseLeave={handleFlyoutLeave}
                onClick={() => toggleSection(section.id)}
                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 cursor-pointer ${
                  isActive || isHovered
                    ? "bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 midnight:bg-cyan-500/20 midnight:text-cyan-400 purple:bg-pink-500/20 purple:text-pink-400"
                    : "text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                }`}
                title={section.label}
              >
                <Icon className="w-[17px] h-[17px]" />
              </button>

              {/* Hover flyout popup */}
              {isHovered && (
                <div
                  className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[60] animate-in fade-in slide-in-from-left-1 duration-150"
                  onMouseEnter={() => handleFlyoutEnter(section.id)}
                  onMouseLeave={handleFlyoutLeave}
                >
                  {/* Arrow pointer */}
                  <div className="absolute left-0 top-1/2 -translate-x-[5px] -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-white dark:bg-gray-800 midnight:bg-[#0d1526] purple:bg-[#1f1035] border-l border-b border-gray-200/80 dark:border-gray-700/80 midnight:border-cyan-500/15 purple:border-pink-500/15" />
                  <div className="relative bg-white/95 dark:bg-gray-800/95 midnight:bg-[#0d1526]/95 purple:bg-[#1f1035]/95 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/80 midnight:border-cyan-500/15 purple:border-pink-500/15 rounded-xl shadow-lg shadow-black/8 dark:shadow-black/30 p-2 min-w-[140px]">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 midnight:text-cyan-500/50 purple:text-pink-500/50 px-1 mb-1.5">
                      {section.label}
                    </div>
                    <div
                      className="grid gap-1"
                      style={{ gridTemplateColumns: `repeat(${section.columns || 3}, 1fr)` }}
                    >
                      {section.tools.map((tool) => {
                        const ToolIcon = tool.icon;
                        const isToolActive = activeTool === tool.id;
                        return (
                          <button
                            key={tool.id}
                            onClick={() => selectTool(tool.id)}
                            className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-lg transition-all duration-100 cursor-pointer ${
                              isToolActive
                                ? "bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 midnight:bg-cyan-500/20 midnight:text-cyan-400 purple:bg-pink-500/20 purple:text-pink-400"
                                : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300/60 purple:text-pink-300/60 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                            }`}
                            title={tool.label}
                          >
                            <ToolIcon className="w-[18px] h-[18px]" />
                            <span className="text-[8px] font-medium leading-none truncate w-full text-center opacity-70">
                              {tool.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div className="w-6 h-px bg-gray-200/60 dark:bg-gray-700/60 midnight:bg-cyan-500/10 purple:bg-pink-500/10 my-0.5" />

        {/* Color picker flyout */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker((prev) => !prev)}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 cursor-pointer ${
              showColorPicker
                ? "bg-blue-500/12 dark:bg-blue-500/20 midnight:bg-cyan-500/20 purple:bg-pink-500/20"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
            }`}
            title="Color palette"
          >
            <div className="relative w-[18px] h-[18px]">
              <Palette className="w-[18px] h-[18px] text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60" />
              {/* Active color dot indicator */}
              <div
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-[1.5px] border-white dark:border-gray-900 midnight:border-[#0d1526] purple:border-[#1f1035]"
                style={{ backgroundColor: activeColor }}
              />
            </div>
          </button>

          {showColorPicker && (
            <ColorPickerFlyout
              activeColor={activeColor}
              activeFillColor={activeFillColor}
              activeStrokeWidth={activeStrokeWidth}
              activeFontSize={activeFontSize}
              activeTool={activeTool}
              onColorChange={(c) => { onColorChange(c); }}
              onFillColorChange={onFillColorChange}
              onStrokeWidthChange={onStrokeWidthChange}
              onFontSizeChange={onFontSizeChange}
              onClose={() => setShowColorPicker(false)}
            />
          )}
        </div>

        <div className="w-6 h-px bg-gray-200/60 dark:bg-gray-700/60 midnight:bg-cyan-500/10 purple:bg-pink-500/10 my-0.5" />

        {/* Templates shortcut */}
        <button
          onClick={toggleTemplates}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-150 cursor-pointer"
          title="Templates"
        >
          <LayoutTemplate className="w-[17px] h-[17px]" />
        </button>

        {/* Insert image */}
        <button
          onClick={onInsertImage}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-150 cursor-pointer"
          title="Insert image"
        >
          <ImagePlus className="w-[17px] h-[17px]" />
        </button>

        {/* Export */}
        <button
          onClick={onExportPNG}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-150 cursor-pointer"
          title="Download as PNG"
        >
          <Download className="w-[17px] h-[17px]" />
        </button>
      </div>
    );
  }

  // ─── Expanded view ──────────────────────────────────────

  return (
    <div
      ref={sidebarRef}
      className="absolute left-3 top-3 z-[50] flex flex-col w-[220px] max-h-[calc(100%-24px)] bg-white/95 dark:bg-gray-900/95 midnight:bg-[#0d1526]/95 purple:bg-[#1f1035]/95 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/80 midnight:border-cyan-500/15 purple:border-pink-500/15 rounded-xl shadow-lg shadow-black/5 dark:shadow-black/20 select-none overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-800 midnight:border-cyan-500/10 purple:border-pink-500/10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 midnight:text-cyan-500/60 purple:text-pink-500/60">
          Tools
        </span>
        <button
          onClick={() => setIsOpen(false)}
          className="flex items-center justify-center w-6 h-6 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-150 cursor-pointer"
          title="Collapse toolbar"
        >
          <PanelLeftClose className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
        {/* Primary tools row */}
        <div className="flex items-center gap-0.5 px-2.5 py-2">
          {PRIMARY_TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  onToolChange(tool.id);
                  setExpandedSection(null);
                  setShowTemplates(false);
                }}
                className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 midnight:bg-cyan-500/20 midnight:text-cyan-400 purple:bg-pink-500/20 purple:text-pink-400 ring-1 ring-blue-500/15 dark:ring-blue-500/25 midnight:ring-cyan-500/25 purple:ring-pink-500/25"
                    : "text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                }`}
                title={tool.label}
              >
                <Icon className="w-[17px] h-[17px]" />
              </button>
            );
          })}
        </div>

        <SectionDivider />

        {/* Accordion sections */}
        {SECTIONS.map((section) => (
          <div key={section.id}>
            <AccordionHeader
              section={section}
              isExpanded={expandedSection === section.id}
              isActive={activeSection === section.id}
              onClick={() => toggleSection(section.id)}
            />
            {expandedSection === section.id && (
              <ToolGrid
                section={section}
                activeTool={activeTool}
                onSelect={selectTool}
              />
            )}
          </div>
        ))}

        <SectionDivider />

        {/* Templates */}
        <AccordionHeaderSimple
          icon={LayoutTemplate}
          label="Templates"
          isExpanded={showTemplates}
          onClick={toggleTemplates}
        />
        {showTemplates && (
          <TemplatePanel
            category={templateCategory}
            onCategoryChange={setTemplateCategory}
            onSelect={loadTemplate}
          />
        )}

        <SectionDivider />

        {/* Insert section */}
        <div className="px-3 py-2 space-y-1.5">
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 midnight:text-cyan-500/40 purple:text-pink-500/40 block">
            Insert
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={onInsertImage}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-medium text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
              title="Insert image"
            >
              <ImagePlus className="w-3.5 h-3.5" />
              Image
            </button>
            <TableSizePicker onSelect={onInsertTable} />
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => onInsertChart?.("bar")}
              className="flex items-center gap-1 px-1.5 py-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
              title="Bar chart"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onInsertChart?.("line")}
              className="flex items-center gap-1 px-1.5 py-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
              title="Line chart"
            >
              <LineChart className="w-4 h-4" />
            </button>
            <button
              onClick={() => onInsertChart?.("pie")}
              className="flex items-center gap-1 px-1.5 py-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
              title="Pie chart"
            >
              <PieChart className="w-4 h-4" />
            </button>
          </div>
        </div>

        <SectionDivider />

        {/* Save / Export */}
        <div className="px-3 py-2 space-y-1.5">
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 midnight:text-cyan-500/40 purple:text-pink-500/40 block">
            Save & Share
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={onExportPNG}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-medium text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
              title="Download as PNG"
            >
              <Download className="w-3.5 h-3.5" />
              PNG
            </button>
            <button
              onClick={onExportJSON}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-medium text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
              title="Download as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              JSON
            </button>
            <button
              onClick={onCopyToClipboard}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-medium text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
              title="Copy to clipboard"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy
            </button>
          </div>
        </div>

        <SectionDivider />

        {/* Properties */}
        {showProperties && (
          <div className="px-3 py-2 space-y-3">
            {/* Stroke color */}
            <PropertySection label="Stroke">
              <div className="grid grid-cols-5 gap-1.5">
                {DEFAULT_COLORS.map((color) => (
                  <ColorSwatch
                    key={color}
                    color={color}
                    isSelected={activeColor === color}
                    onClick={() => onColorChange(color)}
                  />
                ))}
              </div>
            </PropertySection>

            {/* Fill color */}
            {showFillColors && (
              <PropertySection label="Fill">
                <div className="grid grid-cols-5 gap-1.5">
                  {FILL_COLORS.map((color) => (
                    <button
                      key={color ?? "no-fill"}
                      onClick={() => onFillColorChange(color)}
                      className={`w-7 h-7 rounded-lg border-2 transition-all duration-150 cursor-pointer hover:scale-110 flex items-center justify-center ${
                        activeFillColor === color
                          ? "border-blue-500 dark:border-blue-400 midnight:border-cyan-400 purple:border-pink-400 shadow-sm"
                          : "border-gray-200/80 dark:border-gray-700 midnight:border-gray-700 purple:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                      style={{ backgroundColor: color ?? "transparent" }}
                      title={color ?? "No fill"}
                    >
                      {color === null ? (
                        <svg viewBox="0 0 20 20" className="w-4 h-4">
                          <line x1="4" y1="16" x2="16" y2="4" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      ) : (
                        activeFillColor === color && (
                          <Check className={`w-3.5 h-3.5 ${color === "#ffffff" || color === "#fefce8" ? "text-gray-600" : "text-gray-500"}`} />
                        )
                      )}
                    </button>
                  ))}
                </div>
              </PropertySection>
            )}

            {/* Stroke width */}
            {showStrokeWidth && (
              <PropertySection label="Size">
                <div className="flex items-center gap-1.5">
                  {STROKE_WIDTHS.map((w) => (
                    <button
                      key={w}
                      onClick={() => onStrokeWidthChange(w)}
                      className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 cursor-pointer ${
                        activeStrokeWidth === w
                          ? "bg-blue-500/12 dark:bg-blue-500/20 midnight:bg-cyan-500/20 purple:bg-pink-500/20 ring-1 ring-blue-500/15 dark:ring-blue-500/25 midnight:ring-cyan-500/25 purple:ring-pink-500/25"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                      }`}
                      title={`${w}px`}
                    >
                      <div
                        className="rounded-full bg-gray-700 dark:bg-gray-300 midnight:bg-cyan-300 purple:bg-pink-300"
                        style={{
                          width: Math.min(w * 1.8, 20),
                          height: Math.min(w * 1.8, 20),
                        }}
                      />
                    </button>
                  ))}
                </div>
              </PropertySection>
            )}

            {/* Font family */}
            {showTextFormatting && (
              <PropertySection label="Font">
                <FontFamilyDropdown
                  value={activeFontFamily}
                  onChange={onFontFamilyChange}
                />
              </PropertySection>
            )}

            {/* Font size with +/- */}
            {showFontSize && (
              <PropertySection label="Font Size">
                <FontSizeInput
                  value={activeFontSize}
                  onChange={onFontSizeChange}
                />
              </PropertySection>
            )}

            {/* Bold / Italic / Underline */}
            {showTextFormatting && (
              <PropertySection label="Style">
                <div className="flex items-center gap-1">
                  <ToggleButton active={activeFontWeight === "bold"} onClick={onFontWeightToggle} title="Bold (B)">
                    <Bold className="w-3.5 h-3.5" />
                  </ToggleButton>
                  <ToggleButton active={activeFontStyle === "italic"} onClick={onFontStyleToggle} title="Italic (I)">
                    <Italic className="w-3.5 h-3.5" />
                  </ToggleButton>
                  <ToggleButton active={activeTextDecoration === "underline"} onClick={onTextDecorationToggle} title="Underline (U)">
                    <Underline className="w-3.5 h-3.5" />
                  </ToggleButton>
                </div>
              </PropertySection>
            )}

            {/* Text alignment */}
            {showTextFormatting && (
              <PropertySection label="Alignment">
                <div className="flex items-center gap-1">
                  <ToggleButton active={activeTextAlign === "left"} onClick={() => onTextAlignChange("left")} title="Align left">
                    <AlignLeft className="w-3.5 h-3.5" />
                  </ToggleButton>
                  <ToggleButton active={activeTextAlign === "center"} onClick={() => onTextAlignChange("center")} title="Align center">
                    <AlignCenter className="w-3.5 h-3.5" />
                  </ToggleButton>
                  <ToggleButton active={activeTextAlign === "right"} onClick={() => onTextAlignChange("right")} title="Align right">
                    <AlignRight className="w-3.5 h-3.5" />
                  </ToggleButton>
                </div>
              </PropertySection>
            )}

            {/* Line spacing */}
            {showTextFormatting && (
              <PropertySection label="Line Spacing">
                <div className="flex items-center gap-1">
                  {LINE_SPACINGS.map((ls) => (
                    <button
                      key={ls.value}
                      onClick={() => onLineSpacingChange(ls.value)}
                      className={`flex items-center justify-center px-2 h-7 rounded-lg text-[10px] font-bold transition-all duration-150 cursor-pointer ${
                        Math.abs(activeLineSpacing - ls.value) < 0.05
                          ? "bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 midnight:bg-cyan-500/20 midnight:text-cyan-400 purple:bg-pink-500/20 purple:text-pink-400"
                          : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                      }`}
                      title={ls.label}
                    >
                      {ls.label}
                    </button>
                  ))}
                </div>
              </PropertySection>
            )}

            {/* Stroke dash pattern */}
            {showStrokeDash && (
              <PropertySection label="Line Style">
                <StrokeDashControl
                  value={activeStrokeDash}
                  onChange={onStrokeDashChange}
                />
              </PropertySection>
            )}

            {/* Sticky note color */}
            {showStickyColors && (
              <PropertySection label="Note Color">
                <div className="flex items-center gap-1.5">
                  {STICKY_COLORS.map((color) => (
                    <ColorSwatch
                      key={color}
                      color={color}
                      isSelected={activeStickyColor === color}
                      onClick={() => onStickyColorChange(color)}
                    />
                  ))}
                </div>
              </PropertySection>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────

function AccordionHeader({
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
      className={`flex items-center gap-2.5 w-full px-3 py-2 text-left transition-all duration-150 cursor-pointer ${
        isExpanded
          ? "bg-blue-50/60 dark:bg-blue-500/8 midnight:bg-cyan-500/8 purple:bg-pink-500/8"
          : isActive
          ? "bg-gray-50/80 dark:bg-gray-800/40 midnight:bg-cyan-500/5 purple:bg-pink-500/5"
          : "hover:bg-gray-50/80 dark:hover:bg-gray-800/40 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"
      }`}
    >
      <Icon
        className={`w-4 h-4 flex-shrink-0 ${
          isActive || isExpanded
            ? "text-blue-500 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
            : "text-gray-400 dark:text-gray-500 midnight:text-cyan-500/50 purple:text-pink-500/50"
        }`}
      />
      <span
        className={`text-[11px] font-semibold flex-1 ${
          isActive || isExpanded
            ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-300 purple:text-pink-300"
            : "text-gray-600 dark:text-gray-300 midnight:text-cyan-200/80 purple:text-pink-200/80"
        }`}
      >
        {section.label}
      </span>
      <span className="text-[10px] text-gray-400 dark:text-gray-600 tabular-nums">
        {section.tools.length}
      </span>
      <ChevronDown
        className={`w-3 h-3 text-gray-400 dark:text-gray-600 transition-transform duration-200 ${
          isExpanded ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

function AccordionHeaderSimple({
  icon: Icon,
  label,
  isExpanded,
  onClick,
}: {
  icon: IconComp;
  label: string;
  isExpanded: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 w-full px-3 py-2 text-left transition-all duration-150 cursor-pointer ${
        isExpanded
          ? "bg-blue-50/60 dark:bg-blue-500/8 midnight:bg-cyan-500/8 purple:bg-pink-500/8"
          : "hover:bg-gray-50/80 dark:hover:bg-gray-800/40 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"
      }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0 text-gray-400 dark:text-gray-500 midnight:text-cyan-500/50 purple:text-pink-500/50" />
      <span className="text-[11px] font-semibold flex-1 text-gray-600 dark:text-gray-300 midnight:text-cyan-200/80 purple:text-pink-200/80">
        {label}
      </span>
      <ChevronDown
        className={`w-3 h-3 text-gray-400 dark:text-gray-600 transition-transform duration-200 ${
          isExpanded ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

function ToolGrid({
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
      className="grid gap-1 px-3 py-2 bg-gray-50/40 dark:bg-gray-800/20 midnight:bg-cyan-500/3 purple:bg-pink-500/3"
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
                ? "bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 midnight:bg-cyan-500/20 midnight:text-cyan-400 purple:bg-pink-500/20 purple:text-pink-400 ring-1 ring-blue-500/15 dark:ring-blue-500/25 midnight:ring-cyan-500/25 purple:ring-pink-500/25"
                : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300/60 purple:text-pink-300/60 hover:bg-white dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
            }`}
            title={tool.label}
          >
            <Icon className="w-[18px] h-[18px]" />
            <span className="text-[9px] font-medium leading-tight truncate w-full text-center opacity-75">
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
}: {
  category: string;
  onCategoryChange: (cat: string) => void;
  onSelect: (elements: WhiteboardElement[]) => void;
}) {
  const templates = TEMPLATES.filter((t) => t.category === category);

  return (
    <div className="px-3 py-2 bg-gray-50/40 dark:bg-gray-800/20 midnight:bg-cyan-500/3 purple:bg-pink-500/3">
      {/* Category tabs */}
      <div className="flex gap-1 mb-2">
        {TEMPLATE_CATEGORIES.map((cat) => {
          const CatIcon = CATEGORY_ICONS[cat.id] || LayoutTemplate;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-150 cursor-pointer ${
                category === cat.id
                  ? "bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 midnight:bg-cyan-500/20 midnight:text-cyan-400 purple:bg-pink-500/20 purple:text-pink-400"
                  : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
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
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => onSelect(tpl.elements)}
            className="flex flex-col gap-0.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150 cursor-pointer hover:bg-white dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 group"
          >
            <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 midnight:group-hover:text-cyan-400 purple:group-hover:text-pink-400 transition-colors">
              {tpl.name}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400/40 purple:text-pink-400/40 leading-tight">
              {tpl.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Property helpers ────────────────────────────────────

function PropertySection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 midnight:text-cyan-500/40 purple:text-pink-500/40 mb-1.5 block">
        {label}
      </span>
      {children}
    </div>
  );
}

function ColorSwatch({
  color,
  isSelected,
  onClick,
}: {
  color: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isLight = color === "#ffffff" || color === "#fef08a" || color === "#fefce8";
  return (
    <button
      onClick={onClick}
      className={`w-7 h-7 rounded-lg border-2 transition-all duration-150 cursor-pointer hover:scale-110 flex items-center justify-center ${
        isSelected
          ? "border-blue-500 dark:border-blue-400 midnight:border-cyan-400 purple:border-pink-400 shadow-sm scale-105"
          : "border-gray-200/80 dark:border-gray-700 midnight:border-gray-700 purple:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      }`}
      style={{ backgroundColor: color }}
      title={color}
    >
      {isSelected && (
        <Check className={`w-3.5 h-3.5 ${isLight ? "text-gray-700" : "text-white"}`} />
      )}
    </button>
  );
}

function SectionDivider() {
  return (
    <div className="h-px mx-3 bg-gray-100 dark:bg-gray-800/60 midnight:bg-cyan-500/6 purple:bg-pink-500/6" />
  );
}

// ─── Color Picker Flyout (collapsed toolbar) ─────────────
// A sleek gradient-styled flyout for quick color access.

const GRADIENT_COLORS: { color: string; gradient: string; label: string }[] = [
  { color: "#000000", gradient: "linear-gradient(135deg, #1a1a2e, #16213e)", label: "Black" },
  { color: "#374151", gradient: "linear-gradient(135deg, #4b5563, #374151)", label: "Gray" },
  { color: "#ef4444", gradient: "linear-gradient(135deg, #f87171, #dc2626)", label: "Red" },
  { color: "#f97316", gradient: "linear-gradient(135deg, #fb923c, #ea580c)", label: "Orange" },
  { color: "#eab308", gradient: "linear-gradient(135deg, #fbbf24, #ca8a04)", label: "Yellow" },
  { color: "#22c55e", gradient: "linear-gradient(135deg, #4ade80, #16a34a)", label: "Green" },
  { color: "#3b82f6", gradient: "linear-gradient(135deg, #60a5fa, #2563eb)", label: "Blue" },
  { color: "#8b5cf6", gradient: "linear-gradient(135deg, #a78bfa, #7c3aed)", label: "Purple" },
  { color: "#ec4899", gradient: "linear-gradient(135deg, #f472b6, #db2777)", label: "Pink" },
  { color: "#06b6d4", gradient: "linear-gradient(135deg, #22d3ee, #0891b2)", label: "Cyan" },
  { color: "#14b8a6", gradient: "linear-gradient(135deg, #2dd4bf, #0d9488)", label: "Teal" },
  { color: "#ffffff", gradient: "linear-gradient(135deg, #ffffff, #e5e7eb)", label: "White" },
];

const GRADIENT_FILLS: { color: string | null; gradient: string; label: string }[] = [
  { color: null, gradient: "none", label: "No fill" },
  { color: "#fef2f2", gradient: "linear-gradient(135deg, #fef2f2, #fecaca)", label: "Light red" },
  { color: "#fff7ed", gradient: "linear-gradient(135deg, #fff7ed, #fed7aa)", label: "Light orange" },
  { color: "#fefce8", gradient: "linear-gradient(135deg, #fefce8, #fef08a)", label: "Light yellow" },
  { color: "#f0fdf4", gradient: "linear-gradient(135deg, #f0fdf4, #bbf7d0)", label: "Light green" },
  { color: "#eff6ff", gradient: "linear-gradient(135deg, #eff6ff, #bfdbfe)", label: "Light blue" },
  { color: "#f5f3ff", gradient: "linear-gradient(135deg, #f5f3ff, #ddd6fe)", label: "Light purple" },
  { color: "#fdf2f8", gradient: "linear-gradient(135deg, #fdf2f8, #fbcfe8)", label: "Light pink" },
  { color: "#f3f4f6", gradient: "linear-gradient(135deg, #f3f4f6, #d1d5db)", label: "Light gray" },
];

function ColorPickerFlyout({
  activeColor,
  activeFillColor,
  activeStrokeWidth,
  activeFontSize,
  activeTool,
  onColorChange,
  onFillColorChange,
  onStrokeWidthChange,
  onFontSizeChange,
  onClose,
}: {
  activeColor: string;
  activeFillColor: string | null;
  activeStrokeWidth: number;
  activeFontSize: number;
  activeTool: WhiteboardTool;
  onColorChange: (color: string) => void;
  onFillColorChange: (color: string | null) => void;
  onStrokeWidthChange: (width: number) => void;
  onFontSizeChange: (size: number) => void;
  onClose: () => void;
}) {
  const showFill = FILL_TOOLS.includes(activeTool);
  const showWidth = ![
    "select", "eraser", "hand", "text", "sticky",
  ].includes(activeTool);
  const showFontSize = activeTool === "text" || activeTool === "sticky";

  return (
    <div
      className="absolute left-full top-1/2 -translate-y-1/2 ml-2.5 z-[60] animate-in fade-in slide-in-from-left-1 duration-150"
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Arrow pointer */}
      <div className="absolute left-0 top-1/2 -translate-x-[5px] -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-white dark:bg-gray-800 midnight:bg-[#0d1526] purple:bg-[#1f1035] border-l border-b border-gray-200/80 dark:border-gray-700/60 midnight:border-cyan-500/15 purple:border-pink-500/15" />

      <div className="relative bg-white/95 dark:bg-gray-800/95 midnight:bg-[#0d1526]/95 purple:bg-[#1f1035]/95 backdrop-blur-md border border-gray-200/80 dark:border-gray-700/60 midnight:border-cyan-500/15 purple:border-pink-500/15 rounded-2xl shadow-xl shadow-black/8 dark:shadow-black/30 p-3 min-w-[200px]">
        {/* Stroke Colors */}
        <div className="mb-3">
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 midnight:text-cyan-500/50 purple:text-pink-500/50 mb-2 block">
            Stroke Color
          </span>
          <div className="grid grid-cols-6 gap-1.5">
            {GRADIENT_COLORS.map((c) => {
              const isSelected = activeColor === c.color;
              const isLight = c.color === "#ffffff" || c.color === "#fefce8";
              return (
                <button
                  key={c.color}
                  onClick={() => onColorChange(c.color)}
                  className={`group relative w-7 h-7 rounded-xl transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "ring-2 ring-offset-1 ring-blue-500 dark:ring-blue-400 midnight:ring-cyan-400 purple:ring-pink-400 dark:ring-offset-gray-800 midnight:ring-offset-[#0d1526] purple:ring-offset-[#1f1035] scale-110"
                      : "hover:scale-110 hover:shadow-md"
                  }`}
                  style={{ background: c.gradient }}
                  title={c.label}
                >
                  {isSelected && (
                    <Check className={`absolute inset-0 m-auto w-3 h-3 ${isLight ? "text-gray-700" : "text-white"} drop-shadow-sm`} />
                  )}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 ring-1 ring-inset ring-white/20" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Fill Colors — only for shape tools */}
        {showFill && (
          <div className="mb-3">
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 midnight:text-cyan-500/50 purple:text-pink-500/50 mb-2 block">
              Fill Color
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {GRADIENT_FILLS.map((c) => {
                const isSelected = activeFillColor === c.color;
                return (
                  <button
                    key={c.color ?? "no-fill"}
                    onClick={() => onFillColorChange(c.color)}
                    className={`group relative w-7 h-7 rounded-xl transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-offset-1 ring-blue-500 dark:ring-blue-400 midnight:ring-cyan-400 purple:ring-pink-400 dark:ring-offset-gray-800 midnight:ring-offset-[#0d1526] purple:ring-offset-[#1f1035] scale-110"
                        : "hover:scale-110 hover:shadow-md"
                    }`}
                    style={{ background: c.color ? c.gradient : "transparent" }}
                    title={c.label}
                  >
                    {c.color === null ? (
                      <Ban className={`absolute inset-0 m-auto w-3.5 h-3.5 ${isSelected ? "text-red-500" : "text-gray-400 dark:text-gray-500 midnight:text-cyan-500/40 purple:text-pink-500/40"}`} />
                    ) : (
                      isSelected && (
                        <Check className="absolute inset-0 m-auto w-3 h-3 text-gray-600 drop-shadow-sm" />
                      )
                    )}
                    {c.color !== null && (
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 ring-1 ring-inset ring-white/20" />
                    )}
                    {c.color === null && (
                      <div className={`absolute inset-0 rounded-xl border-2 border-dashed ${
                        isSelected
                          ? "border-red-400/60"
                          : "border-gray-300 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20"
                      }`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stroke Width */}
        {showWidth && (
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 midnight:text-cyan-500/50 purple:text-pink-500/50 mb-2 block">
              Stroke Width
            </span>
            <div className="flex items-center gap-1">
              {STROKE_WIDTHS.map((w) => (
                <button
                  key={w}
                  onClick={() => onStrokeWidthChange(w)}
                  className={`flex items-center justify-center w-8 h-7 rounded-lg transition-all duration-150 cursor-pointer ${
                    activeStrokeWidth === w
                      ? "bg-blue-500/12 dark:bg-blue-500/20 midnight:bg-cyan-500/20 purple:bg-pink-500/20 ring-1 ring-blue-500/20 dark:ring-blue-500/30 midnight:ring-cyan-500/30 purple:ring-pink-500/30"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                  }`}
                  title={`${w}px`}
                >
                  <div
                    className="rounded-full"
                    style={{
                      width: Math.min(w * 1.5, 16),
                      height: Math.min(w * 1.5, 16),
                      background: activeColor === "#ffffff"
                        ? "linear-gradient(135deg, #9ca3af, #6b7280)"
                        : `linear-gradient(135deg, ${activeColor}88, ${activeColor})`,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Font Size — for text/sticky tools */}
        {showFontSize && (
          <div className="mt-3">
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 midnight:text-cyan-500/50 purple:text-pink-500/50 mb-2 block">
              Font Size
            </span>
            <div className="flex items-center gap-1">
              {[12, 16, 20, 28, 36, 48].map((size) => (
                <button
                  key={size}
                  onClick={() => onFontSizeChange(size)}
                  className={`flex items-center justify-center w-8 h-7 rounded-lg text-[10px] font-bold transition-all duration-150 cursor-pointer ${
                    activeFontSize === size
                      ? "bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 midnight:bg-cyan-500/20 midnight:text-cyan-400 purple:bg-pink-500/20 purple:text-pink-400"
                      : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                  }`}
                  title={`${size}px`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Table size picker (Google Slides style grid) ────────

function TableSizePicker({
  onSelect,
}: {
  onSelect?: (rows: number, cols: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverRow, setHoverRow] = useState(0);
  const [hoverCol, setHoverCol] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const maxRows = 6;
  const maxCols = 6;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-medium text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
        title="Insert table"
      >
        <Table2 className="w-3.5 h-3.5" />
        Table
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 z-[60] p-2 bg-white dark:bg-gray-800 midnight:bg-[#0d1526] purple:bg-[#1f1035] border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-xl shadow-lg">
          <div className="text-[10px] text-gray-500 dark:text-gray-400 text-center mb-1.5 font-medium">
            {hoverRow > 0 ? `${hoverRow} × ${hoverCol}` : "Select size"}
          </div>
          <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${maxCols}, 1fr)` }}>
            {Array.from({ length: maxRows * maxCols }, (_, i) => {
              const r = Math.floor(i / maxCols) + 1;
              const c = (i % maxCols) + 1;
              const isHighlighted = r <= hoverRow && c <= hoverCol;
              return (
                <button
                  key={i}
                  onMouseEnter={() => {
                    setHoverRow(r);
                    setHoverCol(c);
                  }}
                  onClick={() => {
                    onSelect?.(r, c);
                    setIsOpen(false);
                    setHoverRow(0);
                    setHoverCol(0);
                  }}
                  className={`w-5 h-5 rounded border transition-colors cursor-pointer ${
                    isHighlighted
                      ? "bg-blue-500/20 border-blue-400 dark:bg-blue-500/30 midnight:bg-cyan-500/30 purple:bg-pink-500/30 midnight:border-cyan-400 purple:border-pink-400"
                      : "bg-gray-50 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 border-gray-200 dark:border-gray-600 midnight:border-gray-700 purple:border-gray-700"
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Toggle button (for B/I/U and alignment) ─────────────

function ToggleButton({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 cursor-pointer ${
        active
          ? "bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 midnight:bg-cyan-500/20 midnight:text-cyan-400 purple:bg-pink-500/20 purple:text-pink-400 ring-1 ring-blue-500/15 dark:ring-blue-500/25 midnight:ring-cyan-500/25 purple:ring-pink-500/25"
          : "text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
      }`}
      title={title}
    >
      {children}
    </button>
  );
}

// ─── Font family dropdown ─────────────────────────────────

function FontFamilyDropdown({
  value,
  onChange,
}: {
  value: FontFamily;
  onChange: (font: FontFamily) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-2 py-1.5 rounded-lg text-[11px] font-medium text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 bg-gray-50 dark:bg-gray-800 midnight:bg-gray-800/50 purple:bg-gray-800/50 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        style={{ fontFamily: `${value}, system-ui, sans-serif` }}
      >
        <span className="truncate">{value}</span>
        <ChevronDown className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 z-[60] w-full max-h-[200px] overflow-y-auto scrollbar-thin bg-white dark:bg-gray-800 midnight:bg-[#0d1526] purple:bg-[#1f1035] border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-xl shadow-lg">
          {FONT_FAMILIES.map((font) => (
            <button
              key={font}
              onClick={() => { onChange(font); setIsOpen(false); }}
              className={`w-full text-left px-2.5 py-1.5 text-[11px] transition-colors cursor-pointer ${
                value === font
                  ? "bg-blue-50 dark:bg-blue-500/15 midnight:bg-cyan-500/15 purple:bg-pink-500/15 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                  : "text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
              }`}
              style={{ fontFamily: `${font}, system-ui, sans-serif` }}
            >
              {font}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Font size input with +/- buttons ─────────────────────

function FontSizeInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (size: number) => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isDropdownOpen]);

  const decrease = () => {
    const idx = FONT_SIZES.findIndex((s) => s >= value);
    const prev = idx > 0 ? FONT_SIZES[idx - 1] : FONT_SIZES[0];
    onChange(prev);
  };

  const increase = () => {
    const idx = FONT_SIZES.findIndex((s) => s > value);
    const next = idx >= 0 ? FONT_SIZES[idx] : FONT_SIZES[FONT_SIZES.length - 1];
    onChange(next);
  };

  return (
    <div ref={ref} className="relative flex items-center gap-0.5">
      <button
        onClick={decrease}
        className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer text-sm font-bold"
        title="Decrease font size"
      >
        −
      </button>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-center min-w-[36px] h-7 px-1 rounded-lg text-[11px] font-bold text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 bg-gray-50 dark:bg-gray-800 midnight:bg-gray-800/50 purple:bg-gray-800/50 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
      >
        {value}
      </button>
      <button
        onClick={increase}
        className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer text-sm font-bold"
        title="Increase font size"
      >
        +
      </button>
      {isDropdownOpen && (
        <div className="absolute left-0 top-full mt-1 z-[60] w-full max-h-[180px] overflow-y-auto scrollbar-thin bg-white dark:bg-gray-800 midnight:bg-[#0d1526] purple:bg-[#1f1035] border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-xl shadow-lg">
          {FONT_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => { onChange(size); setIsDropdownOpen(false); }}
              className={`w-full text-left px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                value === size
                  ? "bg-blue-50 dark:bg-blue-500/15 midnight:bg-cyan-500/15 purple:bg-pink-500/15 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {size}px
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Stroke dash control with SVG previews ────────────────

function StrokeDashControl({
  value,
  onChange,
}: {
  value: StrokeDashPattern;
  onChange: (pattern: StrokeDashPattern) => void;
}) {
  const dashArrays: Record<StrokeDashPattern, string> = {
    solid: "",
    dashed: "8 6",
    dotted: "2 4",
    "dash-dot": "8 4 2 4",
    "dash-dot-dot": "8 4 2 4 2 4",
  };

  return (
    <div className="flex flex-col gap-1">
      {STROKE_DASH_PATTERNS.map((pattern) => (
        <button
          key={pattern}
          onClick={() => onChange(pattern)}
          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
            value === pattern
              ? "bg-blue-500/12 dark:bg-blue-500/20 midnight:bg-cyan-500/20 purple:bg-pink-500/20 ring-1 ring-blue-500/15 dark:ring-blue-500/25"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
          }`}
          title={pattern}
        >
          <svg width="60" height="8" className="flex-shrink-0">
            <line
              x1="2" y1="4" x2="58" y2="4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={dashArrays[pattern] || undefined}
              className="text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300"
            />
          </svg>
          <span className="text-[9px] font-medium text-gray-400 dark:text-gray-500 capitalize">
            {pattern}
          </span>
        </button>
      ))}
    </div>
  );
}
