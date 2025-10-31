"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ThemeProvider } from "@/contexts/ThemeContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] transition-colors duration-300">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />

        {/* Main Content Area - Responsive to Sidebar */}
        <div
          className={`flex-1 transition-all duration-300 relative z-0 lg:z-10 ${
            isCollapsed ? "lg:ml-20" : "lg:ml-64"
          }`}
        >
          <Header
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          />
          <main className="pt-2 px-6 pb-6 lg:pt-2 lg:px-8 lg:pb-8">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
