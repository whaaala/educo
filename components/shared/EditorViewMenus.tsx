"use client";

/**
 * Shared Editor View Menu Components — extracted from DocEditor
 *
 * Full midnight/purple theme support, mobile bottom sheet, glassmorphism.
 * Used as the standard rendering layer for all editor menus.
 */

import { useState, useRef, useEffect, useLayoutEffect, useCallback, useContext, useMemo, createContext } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, Check } from "lucide-react";

// ── Contexts ──
export const MenuCloseContext = createContext<(() => void) | null>(null);
export const SubmenuCloseContext = createContext<(() => void) | null>(null);
export const SubmenuAnchorContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null);
export const SubmenuTimerContext = createContext<{ cancelClose: () => void; scheduleClose: () => void } | null>(null);

/** Module-level ref tracking the currently-open submenu portal panel element. */
export const activeSubmenuPanelEl: { current: HTMLElement | null } = { current: null };

// ── SubmenuPanel (portalled, positioned relative to parent) ──
export function SubmenuPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const anchorRef = useContext(SubmenuAnchorContext);
  const timerCtx = useContext(SubmenuTimerContext);

  useLayoutEffect(() => {
    const el = panelRef.current;
    const anchor = anchorRef?.current;
    if (!el || !anchor) return;

    activeSubmenuPanelEl.current = el;

    const parentPanel = anchor.closest("[data-editor-menu-panel],[data-doc-menu-panel]");
    const itemRect = anchor.getBoundingClientRect();
    const panelRect = parentPanel?.getBoundingClientRect() ?? null;

    let left = panelRect ? panelRect.right : itemRect.right;
    let top = itemRect.top;

    const pw = el.offsetWidth;
    if (left + pw > window.innerWidth) {
      left = (panelRect ? panelRect.left : itemRect.left) - pw;
    }
    // Keep the WHOLE submenu on-screen with a clear top/bottom margin. We cap the inner
    // scroller's height directly (not via a Tailwind calc class, which can be a no-op) so a
    // long submenu (e.g. 19 chart types) shrinks to the viewport and scrolls instead of
    // running off the bottom.
    const MARGIN = 24;
    const scroller = el.querySelector<HTMLElement>("[data-submenu-scroll]");
    if (scroller) {
      scroller.style.maxHeight = `${Math.max(120, window.innerHeight - MARGIN * 2)}px`;
    }
    const ph = el.offsetHeight;                       // measured AFTER the cap above
    if (top + ph > window.innerHeight - MARGIN) {
      top = window.innerHeight - ph - MARGIN;
    }
    if (top < MARGIN) top = MARGIN;

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
        data-doc-menu-panel
        className={`fixed z-[10000] rounded-2xl border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white/95 dark:bg-[#0f1115]/95 midnight:bg-[#0a0e27]/95 purple:bg-[#1a0b2e]/95 backdrop-blur-xl shadow-xl shadow-black/8 dark:shadow-black/30 overflow-visible ${className}`}
        onMouseEnter={() => timerCtx?.cancelClose()}
        onMouseLeave={() => timerCtx?.scheduleClose()}
      >
        <div className="absolute -left-4 top-0 w-4 h-full" />
        {/* Height is capped to the viewport in the positioning effect (data-submenu-scroll),
            so a long submenu always fits with a top/bottom margin and scrolls. */}
        <div data-submenu-scroll className="py-1 overflow-y-auto overflow-x-hidden">{children}</div>
      </div>
    </SubmenuCloseContext.Provider>,
    document.body,
  );
}

// ── ViewMenuPanel (glassmorphism, mobile bottom sheet) ──
export function ViewMenuPanel({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const glassClasses = [
    "bg-white/80 dark:bg-[#0f1115]/95 midnight:bg-[#0a0e27]/80 purple:bg-[#1a0b2e]/80",
    "backdrop-blur-[20px] backdrop-saturate-[180%]",
    "border border-gray-300/60 dark:border-gray-600/50 midnight:border-cyan-400/20 purple:border-pink-400/20",
  ].join(" ");

  if (isMobile && typeof document !== "undefined") {
    return createPortal(
      <>
        <div data-doc-view-sheet-backdrop className="fixed inset-0 z-[300] bg-black/30 backdrop-blur-sm" />
        <div
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
            <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-[#2a2d35]" />
          </div>
          <div className="px-1 pb-6 max-h-[70vh] overflow-y-auto">{children}</div>
        </div>
      </>,
      document.body,
    );
  }

  return (
    <div
      data-editor-menu-panel
      data-doc-menu-panel
      data-doc-view-menu-panel
      className={[
        "absolute z-[120] mt-2 left-0 w-[300px] rounded-2xl overflow-visible",
        glassClasses,
        "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),0_12px_24px_-4px_rgba(0,0,0,0.08)]",
        "dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2),0_12px_24px_-4px_rgba(0,0,0,0.4)]",
      ].join(" ")}
    >
      <div className="py-1.5 max-h-[calc(100vh-120px)] overflow-y-auto">{children}</div>
    </div>
  );
}

// ── ViewMenuDivider ──
export function ViewMenuDivider() {
  return (
    <div className="my-1.5 mx-3 h-px bg-gradient-to-r from-transparent via-gray-200/80 dark:via-gray-700/60 midnight:via-cyan-500/15 purple:via-pink-500/15 to-transparent" />
  );
}

// ── ViewMenuItem ──
export function ViewMenuItem({
  label, description, shortcut, onClick, disabled,
  hasSubmenu, submenu, submenuContent,
  onHover, onLeave, isSubmenuOpen,
  icon: Icon, isChecked, activeMode,
}: {
  label: string;
  description?: string;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  hasSubmenu?: boolean;
  submenu?: React.ReactNode;
  submenuContent?: React.ReactNode;
  onHover?: () => void;
  onLeave?: () => void;
  isSubmenuOpen?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  isChecked?: boolean;
  activeMode?: string;
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
    cancelClose: () => { if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; } },
    scheduleClose: () => { closeTimerRef.current = setTimeout(() => { if (!isSubmenuOpenRef.current) return; onLeaveRef.current?.(); }, 350); },
  }), []);

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    if (!hasSubmenu) requestCloseMenus?.();
  };

  // Support both `submenu` and `submenuContent` props
  const submenuNode = submenu || submenuContent;

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
          "w-full flex items-center gap-2.5 px-3 text-left transition-all duration-150 min-h-[44px]",
          "font-[420] hover:font-[520]",
          disabled
            ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
            : "text-gray-700 dark:text-gray-200 midnight:text-cyan-50 purple:text-pink-50 hover:bg-gray-100/60 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/8 purple:hover:bg-pink-500/8 cursor-pointer",
          isChecked && !hasSubmenu
            ? "bg-blue-50/50 dark:bg-blue-500/10 midnight:bg-cyan-500/10 purple:bg-pink-500/10"
            : "",
        ].join(" ")}
      >
        <span className="w-5 flex-shrink-0 flex items-center justify-center">
          {isChecked ? (
            <Check className="w-4 h-4 text-blue-500 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]" />
          ) : Icon ? (
            <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70" />
          ) : null}
        </span>
        <div className="flex-1 min-w-0">
          <span className="block text-[13px] leading-tight truncate">{label}</span>
          {description && (
            <span className="block text-[11px] leading-tight text-gray-400 dark:text-gray-500 midnight:text-cyan-300/40 purple:text-pink-300/40 mt-0.5 truncate">{description}</span>
          )}
        </div>
        {activeMode && hasSubmenu && (
          <span className={[
            "text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none",
            activeMode === "suggesting"
              ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
              : activeMode === "viewing"
                ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                : "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300",
          ].join(" ")}>
            {activeMode.charAt(0).toUpperCase() + activeMode.slice(1)}
          </span>
        )}
        {shortcut && <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">{shortcut}</span>}
        {hasSubmenu && <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />}
      </button>
      <SubmenuTimerContext.Provider value={hasSubmenu ? timerCallbacks : null}>
        <SubmenuAnchorContext.Provider value={containerRef}>
          {submenuNode && isSubmenuOpen && submenuNode}
        </SubmenuAnchorContext.Provider>
      </SubmenuTimerContext.Provider>
    </div>
  );
}

// ── ViewMenuToggle ──
export function ViewMenuToggle({ label, description, shortcut, isOn, onToggle }: {
  label: string; description?: string; shortcut?: string; isOn: boolean; onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        "w-full flex items-center gap-2.5 px-3 text-left transition-all duration-150 min-h-[44px] cursor-pointer",
        "font-[420] hover:font-[520]",
        "text-gray-700 dark:text-gray-200 midnight:text-cyan-50 purple:text-pink-50",
        "hover:bg-gray-100/60 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/8 purple:hover:bg-pink-500/8",
      ].join(" ")}
      role="switch"
      aria-checked={isOn}
      aria-label={label}
    >
      <div className="flex-1 min-w-0 flex items-center gap-2.5">
        <div className="min-w-0">
          <span className="block text-[13px] leading-tight truncate">{label}</span>
          {description && (
            <span className="block text-[11px] leading-tight text-gray-400 dark:text-gray-500 midnight:text-cyan-300/40 purple:text-pink-300/40 mt-0.5 truncate">{description}</span>
          )}
        </div>
      </div>
      {shortcut && <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums mr-2">{shortcut}</span>}
      <div className={[
        "relative w-[38px] h-[22px] rounded-full flex-shrink-0 transition-colors duration-200",
        isOn
          ? "bg-blue-500 dark:bg-blue-500 midnight:bg-cyan-500 purple:bg-pink-500"
          : "bg-gray-300 dark:bg-[#2a2d35] midnight:bg-gray-600 purple:bg-gray-600",
      ].join(" ")}>
        <div className={[
          "absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-200",
          isOn ? "translate-x-[18px]" : "translate-x-[2px]",
        ].join(" ")} />
      </div>
    </button>
  );
}

// ── MenuPanel (compact, for non-View menus) ──
export function MenuPanel({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-editor-menu-panel
      data-doc-menu-panel
      className="absolute z-[120] mt-2 left-0 w-[260px] rounded-2xl border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white/95 dark:bg-[#0f1115]/95 midnight:bg-[#0a0e27]/95 purple:bg-[#1a0b2e]/95 backdrop-blur-xl shadow-xl shadow-black/8 dark:shadow-black/30 overflow-visible"
    >
      <div className="py-1 max-h-[calc(100vh-120px)] overflow-y-auto">{children}</div>
    </div>
  );
}

// ── MenuDivider (compact) ──
export function MenuDivider() {
  return <div className="my-1 h-px bg-gray-100 dark:bg-[#1a1d24] midnight:bg-cyan-500/10 purple:bg-pink-500/10" />;
}

// ── MenuRoot (top-level menu button) ──
export function MenuRoot({
  id, label, openMenu, onOpen, onClose, children, buttonRef,
}: {
  id: string;
  label: string;
  openMenu: string | null;
  onOpen: (id: string) => void;
  onClose: () => void;
  children: React.ReactNode;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  const isOpen = openMenu === id;
  return (
    <div className="relative z-[100]" data-doc-menu-root>
      <button
        ref={buttonRef}
        type="button"
        className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
          isOpen
            ? "bg-gray-100 dark:bg-[#1a1d24] midnight:bg-cyan-500/10 purple:bg-pink-500/10"
            : "hover:bg-gray-100/70 dark:hover:bg-[#22262e]/60 midnight:hover:bg-cyan-500/8 purple:hover:bg-pink-500/8"
        }`}
        onClick={() => (isOpen ? onClose() : onOpen(id))}
        onMouseEnter={() => openMenu && openMenu !== id && onOpen(id)}
      >
        {label}
      </button>
      {isOpen ? children : null}
    </div>
  );
}
