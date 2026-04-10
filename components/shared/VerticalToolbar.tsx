"use client";

import { useState, useRef, useEffect } from "react";

// ─── Types ──────────────────────────────────────────────────────────────

type IconComp = React.ComponentType<{ className?: string }>;

export interface ToolbarButtonEntry {
  type: "button";
  id: string;
  icon: IconComp;
  label: string;
  /** If provided, overrides the shared onSelect callback */
  onClick?: () => void;
}

export interface ToolbarSectionEntry {
  type: "section";
  id: string;
  icon: IconComp;
  label: string;
  columns?: number;
  tools: { id: string; icon: IconComp; label: string }[];
}

export interface ToolbarDividerEntry {
  type: "divider";
}

export interface ToolbarCustomEntry {
  type: "custom";
  render: () => React.ReactNode;
}

export type ToolbarEntry =
  | ToolbarButtonEntry
  | ToolbarSectionEntry
  | ToolbarDividerEntry
  | ToolbarCustomEntry;

export interface VerticalToolbarProps {
  /** List of toolbar entries (buttons, sections, dividers, custom) */
  entries: ToolbarEntry[];
  /** Currently active item id (for highlighting) */
  activeId?: string | null;
  /** Called when a button or section tool is clicked */
  onSelect?: (id: string) => void;
  /** Optional content to render at the top (e.g. expand/collapse toggle) */
  header?: React.ReactNode;
  /** Extra CSS class on the root container */
  className?: string;
}

// ─── Main Component ─────────────────────────────────────────────────────

export default function VerticalToolbar({
  entries,
  activeId,
  onSelect,
  header,
  className = "",
}: VerticalToolbarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Hover flyout state
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close flyouts on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setHoveredSection(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Cleanup hover timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // Check if activeId is inside any section
  const getActiveSection = (): string | null => {
    for (const entry of entries) {
      if (entry.type === "section" && entry.tools.some((t) => t.id === activeId)) {
        return entry.id;
      }
    }
    return null;
  };

  const activeSectionId = getActiveSection();

  const handleFlyoutEnter = (sectionId: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredSection(sectionId);
  };

  const handleFlyoutLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredSection(null);
    }, 150);
  };

  const handleToolSelect = (id: string) => {
    onSelect?.(id);
    setHoveredSection(null);
  };

  let dividerKey = 0;

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center w-11 py-1.5 gap-0.5 bg-white/95 dark:bg-[#0f1115]/95 midnight:bg-[#0a0e27]/95 purple:bg-[#1a0b2e]/95 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/80 midnight:border-cyan-500/15 purple:border-pink-500/15 rounded-xl shadow-lg shadow-black/5 dark:shadow-black/20 select-none ${className}`}
    >
      {header}

      {entries.map((entry) => {
        if (entry.type === "divider") {
          return (
            <div
              key={`divider-${dividerKey++}`}
              className="w-6 h-px bg-gray-200/60 dark:bg-[#22262e]/60 midnight:bg-cyan-500/10 purple:bg-pink-500/10 my-0.5"
            />
          );
        }

        if (entry.type === "custom") {
          return <div key="custom">{entry.render()}</div>;
        }

        if (entry.type === "button") {
          const Icon = entry.icon;
          const isActive = activeId === entry.id;
          return (
            <button
              key={entry.id}
              onClick={() => {
                if (entry.onClick) {
                  entry.onClick();
                } else {
                  handleToolSelect(entry.id);
                }
              }}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 midnight:bg-cyan-500/20 midnight:text-cyan-400 purple:bg-pink-500/20 purple:text-pink-400"
                  : "text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
              }`}
              title={entry.label}
            >
              <Icon className="w-[17px] h-[17px]" />
            </button>
          );
        }

        if (entry.type === "section") {
          return (
            <SectionButton
              key={entry.id}
              section={entry}
              isActive={activeSectionId === entry.id}
              isHovered={hoveredSection === entry.id}
              activeToolId={activeId ?? null}
              onFlyoutEnter={handleFlyoutEnter}
              onFlyoutLeave={handleFlyoutLeave}
              onToolSelect={handleToolSelect}
            />
          );
        }

        return null;
      })}
    </div>
  );
}

// ─── Section Button with Hover Flyout ───────────────────────────────────

function SectionButton({
  section,
  isActive,
  isHovered,
  activeToolId,
  onFlyoutEnter,
  onFlyoutLeave,
  onToolSelect,
}: {
  section: ToolbarSectionEntry;
  isActive: boolean;
  isHovered: boolean;
  activeToolId: string | null;
  onFlyoutEnter: (id: string) => void;
  onFlyoutLeave: () => void;
  onToolSelect: (id: string) => void;
}) {
  const Icon = section.icon;

  return (
    <div className="relative">
      <button
        onMouseEnter={() => onFlyoutEnter(section.id)}
        onMouseLeave={onFlyoutLeave}
        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 cursor-pointer ${
          isActive || isHovered
            ? "bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 midnight:bg-cyan-500/20 midnight:text-cyan-400 purple:bg-pink-500/20 purple:text-pink-400"
            : "text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
        }`}
        title={section.label}
      >
        <Icon className="w-[17px] h-[17px]" />
      </button>

      {/* Hover flyout popup */}
      {isHovered && (
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[60] animate-in fade-in slide-in-from-left-1 duration-150"
          onMouseEnter={() => onFlyoutEnter(section.id)}
          onMouseLeave={onFlyoutLeave}
        >
          {/* Arrow pointer */}
          <div className="absolute left-0 top-1/2 -translate-x-[5px] -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border-l border-b border-gray-200/80 dark:border-gray-700/80 midnight:border-cyan-500/15 purple:border-pink-500/15" />
          <div className="relative bg-white/95 dark:bg-[#1a1d24]/95 midnight:bg-[#0a0e27]/95 purple:bg-[#1a0b2e]/95 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/80 midnight:border-cyan-500/15 purple:border-pink-500/15 rounded-xl shadow-lg shadow-black/8 dark:shadow-black/30 p-2 min-w-[140px]">
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 midnight:text-cyan-500/50 purple:text-pink-500/50 px-1 mb-1.5">
              {section.label}
            </div>
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${section.columns || 3}, 1fr)` }}
            >
              {section.tools.map((tool) => {
                const ToolIcon = tool.icon;
                const isToolActive = activeToolId === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => onToolSelect(tool.id)}
                    className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-lg transition-all duration-100 cursor-pointer ${
                      isToolActive
                        ? "bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 midnight:bg-cyan-500/20 midnight:text-cyan-400 purple:bg-pink-500/20 purple:text-pink-400"
                        : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300/60 purple:text-pink-300/60 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
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
}
