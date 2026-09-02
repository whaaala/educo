"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSidebar } from "@/contexts/SidebarContext";

interface MainLayoutProps {
  children: React.ReactNode;
  /**
   * Immersive/focus mode for full-screen workspace editors (presentation, document, whiteboard,
   * drive…). Auto-collapses the sidebar and hides the global top bar to maximise canvas space,
   * and restores the sidebar to its previous state when you leave. The top bar can be revealed
   * on demand with the reveal handle.
   */
  immersive?: boolean;
}

export default function MainLayout({ children, immersive = false }: MainLayoutProps) {
  const { isCollapsed, setIsCollapsed, isMobileSidebarOpen, setIsMobileSidebarOpen } = useSidebar();

  // Reveal state for the global top bar while immersive (hidden by default).
  const [topBarShown, setTopBarShown] = useState(false);

  // On entering immersive mode: remember the sidebar state and collapse it. Restore on exit.
  const prevCollapsedRef = useRef<boolean | null>(null);
  useEffect(() => {
    if (!immersive) return;
    prevCollapsedRef.current = isCollapsed;
    setIsCollapsed(true);
    setTopBarShown(false);
    return () => {
      if (prevCollapsedRef.current !== null) setIsCollapsed(prevCollapsedRef.current);
    };
    // Only run on mount/unmount of an immersive page — we intentionally don't resync on isCollapsed
    // changes (the user may re-expand the rail manually while editing).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immersive]);

  const showHeader = !immersive || topBarShown;
  const sidebarWidth = isCollapsed ? "80px" : "288px";

  return (
    <div
      className="flex h-screen print:h-auto bg-canvas transition-colors duration-300 print:bg-white"
      style={{ '--sidebar-width': sidebarWidth } as React.CSSProperties}
    >
      {/* Sidebar — hidden in print */}
      <div className="print:hidden">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />
      </div>

      {/* Main Content Area - Responsive to Sidebar */}
      <div
        className={`flex-1 flex flex-col transition-all duration-500 relative z-0 lg:z-10 h-screen overflow-hidden print:!ml-0 print:h-auto print:overflow-visible ${
          isCollapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        {/* Header — hidden in print, and hidden by default while immersive */}
        {showHeader && (
          <div className="print:hidden">
            <Header
              isMobileSidebarOpen={isMobileSidebarOpen}
              setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            />
          </div>
        )}

        {/* Reveal handle for the global top bar (immersive only). A slim, discoverable chevron. */}
        {immersive && (
          <button
            onClick={() => setTopBarShown((v) => !v)}
            aria-label={topBarShown ? "Hide top bar" : "Show top bar"}
            title={topBarShown ? "Hide top bar" : "Show top bar"}
            className="print:hidden fixed top-0 left-1/2 -translate-x-1/2 z-[60] inline-flex items-center gap-1 h-5 px-3 rounded-b-lg bg-gray-900/70 hover:bg-gray-900/90 text-white/80 text-[0.625rem] font-medium backdrop-blur-sm shadow-md transition-colors cursor-pointer"
          >
            {topBarShown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}

        {/* Editors manage their own spacing; other pages keep the comfortable page padding. */}
        <main
          className={
            immersive
              ? "flex-1 overflow-hidden print:!p-0 print:!m-0 print:overflow-visible"
              : "flex-1 overflow-y-auto pt-4 px-4 pb-4 lg:pt-6 lg:px-8 lg:pb-6 print:!p-0 print:!m-0 print:overflow-visible"
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}
