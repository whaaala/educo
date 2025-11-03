"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSidebar } from "@/contexts/SidebarContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isCollapsed, setIsCollapsed, isMobileSidebarOpen, setIsMobileSidebarOpen } = useSidebar();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] transition-colors duration-300">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area - Responsive to Sidebar */}
      <div
        className={`flex-1 flex flex-col transition-all duration-500 relative z-0 lg:z-10 h-screen overflow-hidden ${
          isCollapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        <Header
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto pt-2 px-4 pb-6 lg:pt-2 lg:px-8 lg:pb-8">{children}</main>
      </div>
    </div>
  );
}
