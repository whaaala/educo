"use client";

/**
 * Reusable View Menu — Data + Rendering
 *
 * `buildViewMenu(config)` generates the menu structure from config.
 * `<EditorViewMenuPanel>` renders it using ViewMenuItem/ViewMenuToggle (glassmorphism, portalled).
 *
 * Both DocEditor and SlideEditor use the same component — just pass different config.
 */

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { type EditorMenuItem, MENU_DIVIDER as D } from "@/components/shared/EditorMenus";
import {
  ViewMenuItem, ViewMenuDivider, ViewMenuToggle, SubmenuPanel, MenuCloseContext,
} from "@/components/shared/EditorViewMenus";
import { ZoomIn, Maximize, Maximize2, Minimize2 } from "lucide-react";

// ══════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════

export interface ViewMenuModeOption {
  label: string;
  description?: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ViewMenuToggleItem {
  type: "toggle";
  label: string;
  description?: string;
  shortcut?: string;
  isOn: boolean;
  onToggle: () => void;
}

export interface ViewMenuActionItem {
  type: "action";
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  onClick: () => void;
  disabled?: boolean;
  isChecked?: boolean;
}

export interface ViewMenuSubmenuItem {
  type: "submenu";
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  items: EditorMenuItem[];
}

export type ViewMenuSectionItem = ViewMenuToggleItem | ViewMenuActionItem | ViewMenuSubmenuItem;

export interface ViewMenuConfig {
  /** Mode submenu (Editing/Suggesting/Viewing etc.) */
  mode?: {
    current: string;
    options: ViewMenuModeOption[];
    onSelect: (value: string) => void;
  };
  /** Sections of items, each section separated by a divider */
  sections: ViewMenuSectionItem[][];
  /** Zoom submenu */
  zoom?: {
    current: number;
    levels: number[];
    onChange: (level: number) => void;
    showFit?: boolean;
    onFit?: () => void;
  };
  /** Full screen toggle */
  fullscreen?: {
    isActive: boolean;
    onToggle: () => void;
    shortcut?: string;
  };
}

// ══════════════════════════════════════════════════
// EditorViewMenuPanel — Rendering Component
// ══════════════════════════════════════════════════

export interface EditorViewMenuPanelProps {
  config: ViewMenuConfig;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLButtonElement | null>;
}

/** Renders an EditorMenuItem[] submenu recursively using ViewMenuItem. */
function SubmenuItemRenderer({ item }: { item: EditorMenuItem }) {
  const [openSub, setOpenSub] = useState<string | null>(null);

  if (item.divider) return <ViewMenuDivider />;

  if (item.submenu) {
    return (
      <ViewMenuItem
        label={item.label}
        icon={item.icon}
        shortcut={item.shortcut}
        disabled={item.disabled}
        hasSubmenu
        isSubmenuOpen={openSub === item.label}
        onHover={() => setOpenSub(item.label)}
        onLeave={() => setOpenSub(null)}
        submenu={
          <SubmenuPanel className="w-[220px]">
            {item.submenu.map((sub, j) => (
              <SubmenuItemRenderer key={j} item={sub} />
            ))}
          </SubmenuPanel>
        }
      />
    );
  }

  return (
    <ViewMenuItem
      label={item.label}
      icon={item.icon}
      shortcut={item.shortcut}
      disabled={item.disabled}
      isChecked={item.isChecked}
      onClick={item.onClick}
    />
  );
}

/**
 * Self-contained View menu panel — used by both DocEditor and SlideEditor.
 * Renders using ViewMenuItem/ViewMenuToggle style (glassmorphism, min-h-44px).
 * Portals to document.body for proper z-index stacking.
 */
export function EditorViewMenuPanel({ config, onClose, anchorRef }: EditorViewMenuPanelProps) {
  const { mode, sections, zoom, fullscreen } = config;
  const [openSub, setOpenSub] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Position below the trigger button (desktop only)
  useEffect(() => {
    if (isMobile) return;
    let btn = anchorRef?.current;
    if (!btn) {
      const roots = document.querySelectorAll("[data-doc-menu-root],[data-editor-menu-root]");
      roots.forEach(r => {
        const b = r.querySelector("button");
        if (b && b.textContent?.trim() === "View") btn = b as HTMLButtonElement;
      });
    }
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
  }, [anchorRef, isMobile]);

  const glassClasses = [
    "bg-white/80 dark:bg-[#121212]/80 midnight:bg-[#0a0e27]/80 purple:bg-[#1a0d2e]/80",
    "backdrop-blur-[20px] backdrop-saturate-[180%]",
    "border border-gray-300/60 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30/50 midnight:border-cyan-400/20 purple:border-pink-400/20",
  ].join(" ");

  if (typeof document === "undefined") return null;

  // Mobile: bottom sheet
  if (isMobile) {
    return createPortal(
      <MenuCloseContext.Provider value={onClose}>
        <div data-doc-view-sheet-backdrop className="fixed inset-0 z-[300] bg-black/30 backdrop-blur-sm" onClick={onClose} />
        <div
          ref={panelRef}
          data-editor-menu-panel
          data-doc-menu-panel
          data-doc-view-menu-panel
          data-doc-view-bottom-sheet
          className={[
            "fixed bottom-0 left-0 right-0 z-[301]",
            "rounded-t-3xl",
            glassClasses,
            "shadow-[0_-8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.4)]",
          ].join(" ")}
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700" />
          </div>
          <div className="px-1 pb-6 max-h-[70vh] overflow-y-auto">
            <ViewMenuContent mode={mode} sections={sections} zoom={zoom} fullscreen={fullscreen} openSub={openSub} setOpenSub={setOpenSub} />
          </div>
        </div>
      </MenuCloseContext.Provider>,
      document.body,
    );
  }

  // Desktop: fixed positioned dropdown
  const panelContent = (
    <MenuCloseContext.Provider value={onClose}>
      <div
        ref={panelRef}
        data-editor-menu-panel
        data-doc-menu-panel
        className={[
          "fixed z-[10000] w-[300px] rounded-2xl overflow-visible",
          glassClasses,
          "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),0_12px_24px_-4px_rgba(0,0,0,0.08)]",
          "dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2),0_12px_24px_-4px_rgba(0,0,0,0.4)]",
        ].join(" ")}
        style={pos
          ? { top: pos.top, left: pos.left, maxHeight: `calc(100vh - ${pos.top + 24}px)` }
          : { top: 0, left: 0, visibility: "hidden" as const }
        }
      >
        <div className="py-1.5 pb-4 overflow-y-auto" style={{ maxHeight: "inherit" }}>
            <ViewMenuContent mode={mode} sections={sections} zoom={zoom} fullscreen={fullscreen} openSub={openSub} setOpenSub={setOpenSub} />
        </div>
      </div>
    </MenuCloseContext.Provider>
  );

  return createPortal(panelContent, document.body);
}

// ══════════════════════════════════════════════════
// ViewMenuContent — shared between desktop & mobile
// ══════════════════════════════════════════════════

function ViewMenuContent({ mode, sections, zoom, fullscreen, openSub, setOpenSub }: {
  mode: ViewMenuConfig["mode"];
  sections: ViewMenuConfig["sections"];
  zoom: ViewMenuConfig["zoom"];
  fullscreen: ViewMenuConfig["fullscreen"];
  openSub: string | null;
  setOpenSub: (id: string | null) => void;
}) {
  return (
    <>
      {/* ── Mode submenu ── */}
      {mode && (
        <>
          <ViewMenuItem
            label="Mode"
            hasSubmenu
            onHover={() => setOpenSub("view-mode")}
            onClick={() => setOpenSub(openSub === "view-mode" ? null : "view-mode")}
            onLeave={() => setOpenSub(null)}
            isSubmenuOpen={openSub === "view-mode"}
            activeMode={mode.current}
            submenu={
              <SubmenuPanel className="w-[220px]">
                {mode.options.map(opt => (
                  <ViewMenuItem
                    key={opt.value}
                    label={opt.label}
                    description={opt.description}
                    icon={opt.icon}
                    isChecked={mode.current === opt.value}
                    onClick={() => mode.onSelect(opt.value)}
                  />
                ))}
              </SubmenuPanel>
            }
          />
          <ViewMenuDivider />
        </>
      )}

      {/* ── Sections ── */}
      {sections.map((section, si) => (
        <div key={si}>
          {si > 0 && <ViewMenuDivider />}
          {section.map((item, ii) => {
            if (item.type === "toggle") {
              return (
                <ViewMenuToggle
                  key={ii}
                  label={item.label}
                  description={item.description}
                  shortcut={item.shortcut}
                  isOn={item.isOn}
                  onToggle={item.onToggle}
                />
              );
            }
            if (item.type === "action") {
              return (
                <ViewMenuItem
                  key={ii}
                  label={item.label}
                  icon={item.icon}
                  shortcut={item.shortcut}
                  disabled={item.disabled}
                  isChecked={item.isChecked}
                  onClick={item.onClick}
                />
              );
            }
            if (item.type === "submenu") {
              const subKey = `section-${si}-${item.label}`;
              return (
                <ViewMenuItem
                  key={ii}
                  label={item.label}
                  icon={item.icon}
                  shortcut={item.shortcut}
                  hasSubmenu
                  isSubmenuOpen={openSub === subKey}
                  onHover={() => setOpenSub(subKey)}
                  onLeave={() => setOpenSub(null)}
                  submenu={
                    <SubmenuPanel className="w-[220px]">
                      {item.items.map((sub, j) => (
                        <SubmenuItemRenderer key={j} item={sub} />
                      ))}
                    </SubmenuPanel>
                  }
                />
              );
            }
            return null;
          })}
        </div>
      ))}

      {/* ── Full screen ── */}
      {fullscreen && (
        <>
          <ViewMenuDivider />
          <ViewMenuItem
            label="Full screen"
            icon={fullscreen.isActive ? Minimize2 : Maximize2}
            shortcut={fullscreen.shortcut ?? "F11"}
            onClick={fullscreen.onToggle}
          />
        </>
      )}

      {/* ── Zoom submenu ── */}
      {zoom && (
        <ViewMenuItem
          label="Zoom"
          icon={ZoomIn}
          hasSubmenu
          onHover={() => setOpenSub("view-zoom")}
          onClick={() => setOpenSub(openSub === "view-zoom" ? null : "view-zoom")}
          onLeave={() => setOpenSub(null)}
          isSubmenuOpen={openSub === "view-zoom"}
          submenu={
            <SubmenuPanel className="w-[180px]">
              {zoom.showFit !== false && (
                <>
                  <ViewMenuItem
                    label="Fit"
                    icon={Maximize}
                    isChecked={zoom.current === 100 && !zoom.levels.includes(100)}
                    onClick={() => zoom.onFit ? zoom.onFit() : zoom.onChange(100)}
                  />
                  <ViewMenuDivider />
                </>
              )}
              {zoom.levels.map(z => (
                <ViewMenuItem
                  key={z}
                  label={`${z}%`}
                  isChecked={z === zoom.current}
                  onClick={() => zoom.onChange(z)}
                />
              ))}
            </SubmenuPanel>
          }
        />
      )}
    </>
  );
}
