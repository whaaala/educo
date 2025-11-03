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
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] transition-colors duration-300 overflow-x-hidden">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area - Responsive to Sidebar */}
      <div
        className={`flex-1 transition-all duration-500 relative z-0 lg:z-10 overflow-x-hidden ${
          isCollapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        <Header
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />
        <main className="pt-2 px-4 pb-6 lg:pt-2 lg:px-8 lg:pb-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
