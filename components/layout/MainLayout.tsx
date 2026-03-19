"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSidebar } from "@/contexts/SidebarContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isCollapsed, setIsCollapsed, isMobileSidebarOpen, setIsMobileSidebarOpen } = useSidebar();

  // Calculate sidebar width for CSS variable (used by call overlays)
  const sidebarWidth = isCollapsed ? "80px" : "288px";

  return (
    <div
      className="flex h-screen print:h-auto bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] transition-colors duration-300 print:bg-white"
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
        {/* Header — hidden in print */}
        <div className="print:hidden">
          <Header
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          />
        </div>
        <main className="flex-1 overflow-y-auto pt-4 px-4 pb-4 lg:pt-6 lg:px-8 lg:pb-6 print:!p-0 print:!m-0 print:overflow-visible">{children}</main>
      </div>
    </div>
  );
}
