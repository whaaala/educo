"use client";

/**
 * Shared Editor Menu Components — extracted from DocEditor
 * Uses the EXACT same portal + context + timer architecture that works in DocEditor.
 */

import React, { useState, useRef, useEffect, useCallback, useLayoutEffect, createContext, useContext, useMemo } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, Check } from "lucide-react";
import Tooltip from "@/components/shared/Tooltip";

// ── Contexts (same as DocEditor) ──
export const MenuCloseContext = createContext<(() => void) | null>(null);
export const SubmenuCloseContext = createContext<(() => void) | null>(null);
const SubmenuAnchorContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null);
const SubmenuTimerContext = createContext<{ cancelClose: () => void; scheduleClose: () => void } | null>(null);

// Global ref for tracking the active submenu panel element
const activeSubmenuPanelEl: { current: HTMLElement | null } = { current: null };

// ── Types ──
export interface EditorMenuItem {
  label: string;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  submenu?: EditorMenuItem[];
  isChecked?: boolean;
}

// ── Divider ──
export function EditorMenuDivider() {
  return <div className="my-1 h-px bg-gray-100 dark:bg-gray-800" />;
}

// ── SubmenuPanel (portalled, positioned relative to parent — exact DocEditor code) ──
function SubmenuPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const anchorRef = useContext(SubmenuAnchorContext);
  const timerCtx = useContext(SubmenuTimerContext);

  useLayoutEffect(() => {
    const el = panelRef.current;
    const anchor = anchorRef?.current;
    if (!el || !anchor) return;

    activeSubmenuPanelEl.current = el;

    const parentPanel = anchor.closest("[data-editor-menu-panel]");
    const itemRect = anchor.getBoundingClientRect();
    const panelRect = parentPanel?.getBoundingClientRect() ?? null;

    let left = panelRect ? panelRect.right : itemRect.right;
    let top = itemRect.top;

    const pw = el.offsetWidth;
    if (left + pw > window.innerWidth) {
      left = (panelRect ? panelRect.left : itemRect.left) - pw;
    }
    const ph = el.offsetHeight;
    if (top + ph > window.innerHeight) {
      top = Math.max(4, window.innerHeight - ph);
    }

    el.style.top = `${top}px`;
    el.style.left = `${left}px`;
  });

  useEffect(() => {
    return () => {
      if (activeSubmenuPanelEl.current === panelRef.current) {
        activeSubmenuPanelEl.current = null;
      }
    };
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <SubmenuCloseContext.Provider value={null}>
      <div
        ref={panelRef}
        data-editor-menu-panel
        className={`fixed z-[10000] rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl shadow-black/8 dark:shadow-black/30 overflow-visible ${className}`}
        onMouseEnter={() => timerCtx?.cancelClose()}
        onMouseLeave={() => timerCtx?.scheduleClose()}
      >
        {/* Invisible bridge */}
        <div className="absolute -left-4 top-0 w-4 h-full" />
        <div className="py-1">{children}</div>
      </div>
    </SubmenuCloseContext.Provider>,
    document.body,
  );
}

// ── MenuItem (exact DocEditor pattern — external submenu state control) ──
function EditorMenuItem_Internal({
  label, shortcut, onClick, disabled, hasSubmenu, submenu,
  onHover, onLeave, isSubmenuOpen, icon: Icon, isChecked,
}: {
  label: string; shortcut?: string; onClick?: () => void; disabled?: boolean;
  hasSubmenu?: boolean; submenu?: React.ReactNode;
  onHover?: () => void; onLeave?: () => void; isSubmenuOpen?: boolean;
  icon?: React.ComponentType<{ className?: string }>; isChecked?: boolean;
}) {
  const requestCloseMenus = useContext(MenuCloseContext);
  const closeSubmenus = useContext(SubmenuCloseContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSubmenuOpenRef = useRef(isSubmenuOpen);
  isSubmenuOpenRef.current = isSubmenuOpen;
  const onLeaveRef = useRef(onLeave);
  onLeaveRef.current = onLeave;

  useEffect(() => {
    return () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); };
  }, []);

  const timerCallbacks = useMemo(() => ({
    cancelClose: () => {
      if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
    },
    scheduleClose: () => {
      closeTimerRef.current = setTimeout(() => {
        if (!isSubmenuOpenRef.current) return;
        onLeaveRef.current?.();
      }, 350);
    },
  }), []);

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    if (!hasSubmenu) requestCloseMenus?.();
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => {
        timerCallbacks.cancelClose();
        if (hasSubmenu) { onHover?.(); } else { closeSubmenus?.(); }
      }}
      onMouseLeave={() => {
        if (!hasSubmenu || !isSubmenuOpen || !onLeave) return;
        timerCallbacks.scheduleClose();
      }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={[
          "w-full flex items-center gap-2.5 px-3 py-1.5 text-left text-[13px] transition-colors",
          disabled
            ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
            : "text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-800/70 cursor-pointer",
        ].join(" ")}
      >
        <span className="w-5 flex-shrink-0 flex items-center justify-center">
          {isChecked ? (
            <Check className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          ) : Icon ? (
            <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          ) : null}
        </span>
        <span className="flex-1 min-w-0 truncate">{label}</span>
        {shortcut && <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">{shortcut}</span>}
        {hasSubmenu && <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />}
      </button>
      <SubmenuTimerContext.Provider value={hasSubmenu ? timerCallbacks : null}>
        <SubmenuAnchorContext.Provider value={containerRef}>
          {submenu && isSubmenuOpen && submenu}
        </SubmenuAnchorContext.Provider>
      </SubmenuTimerContext.Provider>
    </div>
  );
}

// ── EditorMenuItemRow — wraps data-driven items into the DocEditor MenuItem pattern ──
export function EditorMenuItemRow({ item, onClose }: { item: EditorMenuItem; onClose: () => void }) {
  const [openSub, setOpenSub] = useState<string | null>(null);

  if (item.divider) return <EditorMenuDivider />;

  if (item.submenu) {
    return (
      <EditorMenuItem_Internal
        label={item.label}
        shortcut={item.shortcut}
        icon={item.icon}
        disabled={item.disabled}
        isChecked={item.isChecked}
        hasSubmenu
        isSubmenuOpen={openSub === item.label}
        onHover={() => setOpenSub(item.label)}
        onLeave={() => setOpenSub(null)}
        submenu={
          <SubmenuPanel className="w-[220px]">
            {item.submenu.map((sub, i) => (
              <EditorMenuItemRow key={i} item={sub} onClose={onClose} />
            ))}
          </SubmenuPanel>
        }
      />
    );
  }

  return (
    <EditorMenuItem_Internal
      label={item.label}
      shortcut={item.shortcut}
      icon={item.icon}
      disabled={item.disabled}
      isChecked={item.isChecked}
      onClick={item.onClick}
    />
  );
}

// ── MenuRoot (top-level menu button + panel) ──
export function EditorMenuRoot({
  id, label, openMenu, onOpen, onClose, items,
}: {
  id: string; label: string; openMenu: string | null;
  onOpen: (id: string) => void; onClose: () => void; items: EditorMenuItem[];
}) {
  const isOpen = openMenu === id;
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!isOpen || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.left });
  }, [isOpen]);

  return (
    <div className="relative z-[100]" data-editor-menu-root>
      <button
        ref={btnRef}
        type="button"
        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-[13px] font-[440] ${
          isOpen
            ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100"
        }`}
        onClick={() => (isOpen ? onClose() : onOpen(id))}
        onMouseEnter={() => openMenu && openMenu !== id && onOpen(id)}
      >
        {label}
      </button>
      {isOpen && typeof document !== "undefined" && createPortal(
        <div
          data-editor-menu-panel
          className="fixed z-[10000] w-[280px] rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl shadow-black/8 dark:shadow-black/30 overflow-visible"
          style={{ top: pos.top, left: pos.left }}
        >
          <SubmenuCloseContext.Provider value={() => {}}>
            <div className="py-1 max-h-[70vh] overflow-y-auto">
              {items.map((item, i) => (
                <EditorMenuItemRow key={i} item={item} onClose={onClose} />
              ))}
            </div>
          </SubmenuCloseContext.Provider>
        </div>,
        document.body,
      )}
    </div>
  );
}

// ── Full Menu Bar Component ──
export function EditorMenuBar({ menus, fileMenuConfig, editMenuConfig, viewMenuConfig, insertMenuConfig }: {
  menus: { id: string; label: string; items: EditorMenuItem[] }[];
  /** When provided, the "file" menu renders using EditorFileMenuPanel instead of EditorMenuRoot */
  fileMenuConfig?: import("@/components/shared/EditorFileMenu").FileMenuConfig;
  /** When provided, the "edit" menu renders using EditorEditMenuPanel instead of EditorMenuRoot */
  editMenuConfig?: import("@/components/shared/EditorEditMenu").EditMenuConfig;
  /** When provided, the "view" menu renders using EditorViewMenuPanel instead of EditorMenuRoot */
  viewMenuConfig?: import("@/components/shared/EditorViewMenu").ViewMenuConfig;
  /** When provided, the "insert" menu renders using EditorInsertMenuPanel instead of EditorMenuRoot */
  insertMenuConfig?: import("@/components/shared/EditorInsertMenu").InsertMenuConfig;
}) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const close = useCallback(() => setOpenMenu(null), []);
  const open = useCallback((id: string) => setOpenMenu(id), []);
  const menuBarRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!openMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuBarRef.current?.contains(e.target as Node)) return;
      // Check if click is inside a portalled submenu or doc menu panel
      if ((e.target as HTMLElement)?.closest?.("[data-editor-menu-panel],[data-doc-menu-panel]")) return;
      close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openMenu, close]);

  // Lazy imports to avoid circular dependency
  const FileMenuPanel = fileMenuConfig ? require("@/components/shared/EditorFileMenu").EditorFileMenuPanel : null;
  const EditMenuPanel = editMenuConfig ? require("@/components/shared/EditorEditMenu").EditorEditMenuPanel : null;
  const ViewMenuPanel_Shared = viewMenuConfig ? require("@/components/shared/EditorViewMenu").EditorViewMenuPanel : null;
  const InsertMenuPanel = insertMenuConfig ? require("@/components/shared/EditorInsertMenu").EditorInsertMenuPanel : null;

  return (
    <MenuCloseContext.Provider value={close}>
      <div ref={menuBarRef} className="flex items-center flex-wrap gap-0.5 px-2 py-0.5 text-[13px] text-gray-600 dark:text-gray-300 select-none border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        {menus.map(m => {
          // File menu uses EditorFileMenuPanel when config is provided
          if (m.id === "file" && fileMenuConfig && FileMenuPanel) {
            const isOpen = openMenu === "file";
            return (
              <FileMenuRoot key="file" isOpen={isOpen} onOpen={() => open("file")} onClose={close}
                openMenu={openMenu} fileMenuConfig={fileMenuConfig} FileMenuPanel={FileMenuPanel} />
            );
          }
          // Edit menu uses EditorEditMenuPanel when config is provided
          if (m.id === "edit" && editMenuConfig && EditMenuPanel) {
            const isOpen = openMenu === "edit";
            return (
              <EditMenuRoot key="edit" isOpen={isOpen} onOpen={() => open("edit")} onClose={close}
                openMenu={openMenu} editMenuConfig={editMenuConfig} EditMenuPanel={EditMenuPanel} />
            );
          }
          // View menu uses EditorViewMenuPanel when config is provided
          if (m.id === "view" && viewMenuConfig && ViewMenuPanel_Shared) {
            const isOpen = openMenu === "view";
            return (
              <ViewMenuRoot key="view" isOpen={isOpen} onOpen={() => open("view")} onClose={close}
                openMenu={openMenu} viewMenuConfig={viewMenuConfig} ViewMenuPanel={ViewMenuPanel_Shared} />
            );
          }
          // Insert menu uses EditorInsertMenuPanel when config is provided
          if (m.id === "insert" && insertMenuConfig && InsertMenuPanel) {
            const isOpen = openMenu === "insert";
            return (
              <InsertMenuRoot key="insert" isOpen={isOpen} onOpen={() => open("insert")} onClose={close}
                openMenu={openMenu} insertMenuConfig={insertMenuConfig} InsertMenuPanel={InsertMenuPanel} />
            );
          }
          return (
            <EditorMenuRoot key={m.id} id={m.id} label={m.label} items={m.items} openMenu={openMenu} onOpen={open} onClose={close} />
          );
        })}
      </div>
    </MenuCloseContext.Provider>
  );
}

// ── FileMenuRoot (manages button ref for portal positioning) ──
function FileMenuRoot({ isOpen, onOpen, onClose, openMenu, fileMenuConfig, FileMenuPanel }: {
  isOpen: boolean; onOpen: () => void; onClose: () => void; openMenu: string | null;
  fileMenuConfig: any; FileMenuPanel: any;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="relative z-[100]" data-editor-menu-root>
      <button
        ref={btnRef}
        type="button"
        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-[13px] font-[440] ${
          isOpen
            ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100"
        }`}
        onClick={() => (isOpen ? onClose() : onOpen())}
        onMouseEnter={() => openMenu && !isOpen && onOpen()}
      >
        File
      </button>
      {isOpen && <FileMenuPanel config={fileMenuConfig} onClose={onClose} anchorRef={btnRef} />}
    </div>
  );
}

// ── EditMenuRoot (manages button ref for portal positioning) ──
function EditMenuRoot({ isOpen, onOpen, onClose, openMenu, editMenuConfig, EditMenuPanel }: {
  isOpen: boolean; onOpen: () => void; onClose: () => void; openMenu: string | null;
  editMenuConfig: any; EditMenuPanel: any;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="relative z-[100]" data-editor-menu-root>
      <button
        ref={btnRef}
        type="button"
        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-[13px] font-[440] ${
          isOpen
            ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100"
        }`}
        onClick={() => (isOpen ? onClose() : onOpen())}
        onMouseEnter={() => openMenu && !isOpen && onOpen()}
      >
        Edit
      </button>
      {isOpen && <EditMenuPanel config={editMenuConfig} onClose={onClose} anchorRef={btnRef} />}
    </div>
  );
}

// ── ViewMenuRoot (manages button ref for portal positioning) ──
function ViewMenuRoot({ isOpen, onOpen, onClose, openMenu, viewMenuConfig, ViewMenuPanel }: {
  isOpen: boolean; onOpen: () => void; onClose: () => void; openMenu: string | null;
  viewMenuConfig: any; ViewMenuPanel: any;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="relative z-[100]" data-editor-menu-root>
      <button
        ref={btnRef}
        type="button"
        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-[13px] font-[440] ${
          isOpen
            ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100"
        }`}
        onClick={() => (isOpen ? onClose() : onOpen())}
        onMouseEnter={() => openMenu && !isOpen && onOpen()}
      >
        View
      </button>
      {isOpen && <ViewMenuPanel config={viewMenuConfig} onClose={onClose} anchorRef={btnRef} />}
    </div>
  );
}

// ── InsertMenuRoot ──
function InsertMenuRoot({ isOpen, onOpen, onClose, openMenu, insertMenuConfig, InsertMenuPanel }: {
  isOpen: boolean; onOpen: () => void; onClose: () => void; openMenu: string | null;
  insertMenuConfig: any; InsertMenuPanel: any;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="relative z-[100]" data-editor-menu-root>
      <button
        ref={btnRef}
        type="button"
        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-[13px] font-[440] ${
          isOpen
            ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100"
        }`}
        onClick={() => (isOpen ? onClose() : onOpen())}
        onMouseEnter={() => openMenu && !isOpen && onOpen()}
      >
        Insert
      </button>
      {isOpen && <InsertMenuPanel config={insertMenuConfig} onClose={onClose} anchorRef={btnRef} />}
    </div>
  );
}

// ── Helper ──
export const MENU_DIVIDER: EditorMenuItem = { label: "", divider: true };

// ═══════════════════════════════════════════════════════════════
// VIEW MENU COMPONENTS
// ═══════════════════════════════════════════════════════════════

export function ViewMenuPanel({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const glassClasses = "bg-white/80 dark:bg-[#121212]/80 backdrop-blur-[20px] backdrop-saturate-[180%] border border-gray-300/60 dark:border-gray-600/50";

  if (isMobile && typeof document !== "undefined") {
    return createPortal(
      <>
        <div className="fixed inset-0 z-[300] bg-black/30 backdrop-blur-sm" />
        <div className={`fixed bottom-0 left-0 right-0 z-[301] rounded-t-3xl ${glassClasses} shadow-[0_-8px_32px_rgba(0,0,0,0.15)]`}>
          <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" /></div>
          <div className="px-1 pb-6 max-h-[70vh] overflow-y-auto">{children}</div>
        </div>
      </>,
      document.body,
    );
  }

  return (
    <div className={`absolute z-[120] mt-2 left-0 w-[300px] rounded-2xl overflow-visible ${glassClasses} shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_12px_24px_-4px_rgba(0,0,0,0.08)]`}>
      <div className="py-1.5 max-h-[calc(100vh-120px)] overflow-y-auto">{children}</div>
    </div>
  );
}

export function ViewMenuDivider() {
  return <div className="my-1.5 mx-3 h-px bg-gradient-to-r from-transparent via-gray-200/80 dark:via-gray-700/60 to-transparent" />;
}

export function ViewMenuItem({
  label, description, shortcut, onClick, disabled, hasSubmenu, submenuContent,
  onHover, onLeave, isSubmenuOpen, icon: Icon, isChecked,
}: {
  label: string; description?: string; shortcut?: string; onClick?: () => void; disabled?: boolean;
  hasSubmenu?: boolean; submenuContent?: React.ReactNode; onHover?: () => void; onLeave?: () => void;
  isSubmenuOpen?: boolean; icon?: React.ComponentType<{ className?: string }>; isChecked?: boolean;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { return () => { if (timerRef.current) clearTimeout(timerRef.current); }; }, []);

  return (
    <div
      className="relative"
      onMouseEnter={() => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } if (hasSubmenu) onHover?.(); }}
      onMouseLeave={() => { if (!hasSubmenu || !isSubmenuOpen || !onLeave) return; timerRef.current = setTimeout(() => onLeave?.(), 350); }}
    >
      <button type="button" disabled={disabled} onClick={() => { if (!disabled) onClick?.(); }}
        className={["w-full flex items-center gap-2.5 px-3 text-left transition-all duration-150 min-h-[44px]", "font-[420] hover:font-[520]",
          disabled ? "text-gray-300 dark:text-gray-600 cursor-not-allowed" : "text-gray-700 dark:text-gray-200 hover:bg-gray-100/60 dark:hover:bg-white/5 cursor-pointer",
          isChecked ? "bg-blue-50/50 dark:bg-blue-500/10" : "",
        ].join(" ")}
      >
        <span className="w-5 flex-shrink-0 flex items-center justify-center">
          {isChecked ? <Check className="w-4 h-4 text-blue-500 dark:text-blue-400" /> : Icon ? <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" /> : null}
        </span>
        <div className="flex-1 min-w-0">
          <span className="block text-[13px] leading-tight truncate">{label}</span>
          {description && <span className="block text-[11px] leading-tight text-gray-400 dark:text-gray-500 mt-0.5 truncate">{description}</span>}
        </div>
        {shortcut && <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">{shortcut}</span>}
        {hasSubmenu && <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />}
      </button>
      {submenuContent && isSubmenuOpen && submenuContent}
    </div>
  );
}

export function ViewMenuToggle({ label, description, shortcut, isOn, onToggle }: {
  label: string; description?: string; shortcut?: string; isOn: boolean; onToggle: () => void;
}) {
  return (
    <button type="button" onClick={onToggle}
      className="w-full flex items-center gap-2.5 px-3 text-left transition-all duration-150 min-h-[44px] cursor-pointer font-[420] hover:font-[520] text-gray-700 dark:text-gray-200 hover:bg-gray-100/60 dark:hover:bg-white/5"
      role="switch" aria-checked={isOn} aria-label={label}
    >
      <div className="flex-1 min-w-0">
        <span className="block text-[13px] leading-tight truncate">{label}</span>
        {description && <span className="block text-[11px] leading-tight text-gray-400 dark:text-gray-500 mt-0.5 truncate">{description}</span>}
      </div>
      {shortcut && <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums mr-2">{shortcut}</span>}
      <div className={`relative w-[38px] h-[22px] rounded-full flex-shrink-0 transition-colors duration-200 ${isOn ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}`}>
        <div className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${isOn ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
      </div>
    </button>
  );
}
