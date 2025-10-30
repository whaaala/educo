"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Bus,
  Home,
  Calendar,
  FileText,
  Settings,
  ChevronDown,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
  Building2,
  Network,
  ClipboardList,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: "/",
  },
  {
    id: "school-management",
    label: "School Management",
    icon: <Building2 className="w-5 h-5" />,
    children: [
      { id: "school-info", label: "School Information", icon: <Building2 className="w-4 h-4" />, href: "/school/info" },
      { id: "branches", label: "Branches", icon: <Network className="w-4 h-4" />, href: "/school/branches" },
      { id: "academic-years", label: "Academic Years", icon: <Calendar className="w-4 h-4" />, href: "/school/academic-years" },
      { id: "classes", label: "Classes", icon: <Boxes className="w-4 h-4" />, href: "/school/classes" },
      { id: "sections", label: "Sections", icon: <ClipboardList className="w-4 h-4" />, href: "/school/sections" },
      { id: "departments", label: "Departments", icon: <Network className="w-4 h-4" />, href: "/school/departments" },
    ],
  },
  {
    id: "peoples",
    label: "Peoples",
    icon: <Users className="w-5 h-5" />,
    children: [
      { id: "students", label: "Students", icon: <GraduationCap className="w-4 h-4" />, href: "/students" },
      { id: "parents", label: "Parents", icon: <Users className="w-4 h-4" />, href: "/parents" },
      { id: "teachers", label: "Teachers", icon: <Users className="w-4 h-4" />, href: "/teachers" },
      { id: "staff", label: "Staff", icon: <Users className="w-4 h-4" />, href: "/staff" },
    ],
  },
  {
    id: "academic",
    label: "Academic",
    icon: <BookOpen className="w-5 h-5" />,
    children: [
      { id: "subjects", label: "Subjects", icon: <BookOpen className="w-4 h-4" />, href: "/subjects" },
      { id: "exams", label: "Exams", icon: <FileText className="w-4 h-4" />, href: "/exams" },
      { id: "syllabus", label: "Syllabus", icon: <FileText className="w-4 h-4" />, href: "/syllabus" },
      { id: "assignments", label: "Assignments", icon: <FileText className="w-4 h-4" />, href: "/assignments" },
    ],
  },
  {
    id: "management",
    label: "Management",
    icon: <Settings className="w-5 h-5" />,
    children: [
      { id: "fees", label: "Fees", icon: <DollarSign className="w-4 h-4" />, href: "/fees" },
      { id: "library", label: "Library", icon: <BookOpen className="w-4 h-4" />, href: "/library" },
      { id: "dormitory", label: "Dormitory", icon: <Home className="w-4 h-4" />, href: "/dormitory" },
      { id: "transport", label: "Transport", icon: <Bus className="w-4 h-4" />, href: "/transport" },
    ],
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: <Calendar className="w-5 h-5" />,
    href: "/attendance",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    children: [
      { id: "general", label: "General Settings", icon: <Settings className="w-4 h-4" />, href: "/settings/general" },
      { id: "schools", label: "Schools & Branches", icon: <Home className="w-4 h-4" />, href: "/settings/schools" },
      { id: "users", label: "User Management", icon: <Users className="w-4 h-4" />, href: "/settings/users" },
    ],
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState<boolean | null>(null); // null on server, boolean on client
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  // Handle delayed hide
  const handleMouseEnterItem = (itemId: string) => {
    // Clear any existing timeout
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    // Immediately show the new item
    setHoveredItem(itemId);
  };

  const handleMouseLeaveItem = (itemId: string) => {
    // Only hide if we're leaving the currently hovered item
    const timeout = setTimeout(() => {
      setHoveredItem((current) => {
        // Only clear if we're still on the same item
        return current === itemId ? null : current;
      });
    }, 150); // 150ms delay
    setHideTimeout(timeout);
  };

  // Detect if we're on mobile and close menu when resized to desktop
  useEffect(() => {
    const checkMobile = () => {
      // Use the same breakpoint as Tailwind's lg (1024px)
      const mobile = window.innerWidth <= 1023;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    checkMobile(); // Check on mount immediately
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isCollapsedDesktop = isMobile === false && isCollapsed;

    return (
      <div
        key={item.id}
        className="mb-1.5 relative group"
        onMouseEnter={() => {
          if (isCollapsedDesktop && level === 0) {
            handleMouseEnterItem(item.id);
          }
        }}
        onMouseLeave={() => {
          if (isCollapsedDesktop && level === 0) {
            handleMouseLeaveItem(item.id);
          }
        }}
      >
        {hasChildren ? (
          <>
            <button
              onClick={() => !isCollapsedDesktop && toggleExpanded(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm",
                "text-gray-600 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100",
                "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50",
                "dark:hover:from-blue-500/10 dark:hover:to-indigo-500/10",
                "midnight:hover:from-cyan-500/10 midnight:hover:to-blue-500/10",
                "purple:hover:from-pink-500/10 purple:hover:to-purple-500/10",
                "hover:text-blue-700 dark:hover:text-blue-300 midnight:hover:text-cyan-300 purple:hover:text-pink-300",
                "hover:shadow-sm hover:scale-[1.02]",
                "transition-all duration-200 ease-in-out",
                "border border-transparent hover:border-blue-200/50 dark:hover:border-blue-500/20",
                "midnight:hover:border-cyan-500/20 purple:hover:border-pink-500/20",
                level > 0 && "pl-8 ml-2"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg",
                  "bg-gray-100 dark:bg-gray-800/50 midnight:bg-cyan-500/10 purple:bg-pink-500/10",
                  "group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20",
                  "midnight:group-hover:bg-cyan-500/20 purple:group-hover:bg-pink-500/20",
                  "transition-colors duration-200"
                )}>
                  {item.icon}
                </div>
                {/* Show label based on mobile/collapsed state */}
                {(isMobile === true || (isMobile === false && !isCollapsed)) && (
                  <span className="flex-1 text-left">{item.label}</span>
                )}
              </div>
              {/* Show chevron based on mobile/collapsed state */}
              {(isMobile === true || (isMobile === false && !isCollapsed)) && (
                <div className={cn(
                  "transition-transform duration-200",
                  isExpanded && "rotate-180"
                )}>
                  <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </div>
              )}
            </button>

            {/* Popover menu for collapsed sidebar */}
            {isCollapsedDesktop && level === 0 && hoveredItem === item.id && (
              <div
                className="absolute left-full top-0 w-56 bg-white dark:bg-[#1e2128] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700/50 midnight:border-cyan-500/20 purple:border-pink-500/20 py-2 backdrop-blur-sm animate-in fade-in slide-in-from-left-2 duration-200"
                style={{
                  zIndex: 9999,
                  marginLeft: '8px',
                }}
                onMouseEnter={() => handleMouseEnterItem(item.id)}
                onMouseLeave={() => handleMouseLeaveItem(item.id)}
              >
                <div className="px-4 py-2.5 text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 border-b border-gray-100 dark:border-gray-800 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50">
                  {item.label}
                </div>
                <div className="py-1">
                  {item.children?.map((child) => (
                    <Link
                      key={child.id}
                      href={child.href || "#"}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-blue-50 dark:hover:bg-blue-500/10 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 hover:text-blue-600 dark:hover:text-blue-300 midnight:hover:text-cyan-300 purple:hover:text-pink-300 transition-all duration-150 rounded-lg mx-2"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-700/50">
                        {child.icon}
                      </div>
                      <span className="font-medium">{child.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <Link
              href={item.href || "#"}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm",
                "text-gray-600 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100",
                "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50",
                "dark:hover:from-blue-500/10 dark:hover:to-indigo-500/10",
                "midnight:hover:from-cyan-500/10 midnight:hover:to-blue-500/10",
                "purple:hover:from-pink-500/10 purple:hover:to-purple-500/10",
                "hover:text-blue-700 dark:hover:text-blue-300 midnight:hover:text-cyan-300 purple:hover:text-pink-300",
                "hover:shadow-sm hover:scale-[1.02]",
                "transition-all duration-200 ease-in-out",
                "border border-transparent hover:border-blue-200/50 dark:hover:border-blue-500/20",
                "midnight:hover:border-cyan-500/20 purple:hover:border-pink-500/20",
                level > 0 && "pl-8 ml-2"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg",
                "bg-gray-100 dark:bg-gray-800/50 midnight:bg-cyan-500/10 purple:bg-pink-500/10",
                "group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20",
                "midnight:group-hover:bg-cyan-500/20 purple:group-hover:bg-pink-500/20",
                "transition-colors duration-200"
              )}>
                {item.icon}
              </div>
              {/* Show label based on mobile/collapsed state */}
              {(isMobile === true || (isMobile === false && !isCollapsed)) && (
                <span className="flex-1">{item.label}</span>
              )}
            </Link>

            {/* Tooltip for collapsed sidebar */}
            {isCollapsedDesktop && level === 0 && hoveredItem === item.id && (
              <div
                className="absolute left-full top-0 px-3 py-2 bg-gray-900 dark:bg-gray-800 midnight:bg-cyan-600 purple:bg-pink-600 text-white text-sm font-medium rounded-lg whitespace-nowrap shadow-lg animate-in fade-in slide-in-from-left-1 duration-150"
                style={{
                  zIndex: 9999,
                  marginLeft: '12px',
                }}
                onMouseEnter={() => handleMouseEnterItem(item.id)}
                onMouseLeave={() => handleMouseLeaveItem(item.id)}
              >
                {item.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-800 midnight:border-r-cyan-600 purple:border-r-pink-600"></div>
              </div>
            )}
          </>
        )}

        {/* Show children based on mobile/collapsed state */}
        {hasChildren && isExpanded && (isMobile === true || (isMobile === false && !isCollapsed)) && (
          <div className="mt-2 ml-2 space-y-1 pl-4 border-l-2 border-gray-200 dark:border-gray-700/50 midnight:border-cyan-500/20 purple:border-pink-500/20">
            {item.children?.map((child) => (
              <Link
                key={child.id}
                href={child.href || "#"}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium group",
                  "text-gray-600 dark:text-gray-400 midnight:text-cyan-200 purple:text-pink-200",
                  "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50/50",
                  "dark:hover:from-blue-500/5 dark:hover:to-indigo-500/5",
                  "midnight:hover:from-cyan-500/5 midnight:hover:to-blue-500/5",
                  "purple:hover:from-pink-500/5 purple:hover:to-purple-500/5",
                  "hover:text-blue-700 dark:hover:text-blue-300 midnight:hover:text-cyan-300 purple:hover:text-pink-300",
                  "hover:translate-x-1 hover:shadow-sm",
                  "transition-all duration-200 ease-out",
                  "border border-transparent hover:border-blue-200/30 dark:hover:border-blue-500/10",
                  "midnight:hover:border-cyan-500/10 purple:hover:border-pink-500/10"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-lg shrink-0",
                  "bg-gradient-to-br from-gray-100 to-gray-50",
                  "dark:from-gray-800/50 dark:to-gray-700/30",
                  "midnight:from-cyan-500/10 midnight:to-blue-500/5",
                  "purple:from-pink-500/10 purple:to-purple-500/5",
                  "group-hover:from-blue-100 group-hover:to-indigo-50",
                  "dark:group-hover:from-blue-500/15 dark:group-hover:to-indigo-500/10",
                  "midnight:group-hover:from-cyan-500/20 midnight:group-hover:to-blue-500/15",
                  "purple:group-hover:from-pink-500/20 purple:group-hover:to-purple-500/15",
                  "group-hover:scale-110 group-hover:rotate-3",
                  "transition-all duration-200 shadow-sm"
                )}>
                  <div className="scale-90">
                    {child.icon}
                  </div>
                </div>
                <span className="flex-1 tracking-wide">{child.label}</span>
                <svg
                  className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile screens */}
      {isMobile === true && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-lg shadow-md lg:hidden transition-colors duration-300"
        >
          {isMobileOpen ? <X className="w-6 h-6 text-gray-900 dark:text-white" /> : <Menu className="w-6 h-6 text-gray-900 dark:text-white" />}
        </button>
      )}

      {/* Mobile Overlay - Only shows on mobile when menu is open */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen",
          "bg-gradient-to-b from-white via-gray-50/50 to-white",
          "dark:from-[#1a1d23] dark:via-[#1e2128] dark:to-[#1a1d23]",
          "midnight:from-[#0f1729] midnight:via-[#0d1220] midnight:to-[#0f1729]",
          "purple:from-[#2a1a3e] purple:via-[#1f0d33] purple:to-[#2a1a3e]",
          "border-r border-gray-200/80 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20",
          "shadow-xl shadow-gray-200/50 dark:shadow-black/20",
          "backdrop-blur-xl",
          "transition-all duration-300 z-40",
          // On mobile: always full width (w-64) when open
          // On desktop: w-20 when collapsed, w-64 when expanded
          "w-64 lg:w-auto",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          // Mobile visibility
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={isCollapsed && isMobile === false ? { overflow: 'visible' } : undefined}
      >
        <div className="flex flex-col h-full" style={isCollapsed && isMobile === false ? { overflow: 'visible' } : undefined}>
          {/* Logo Section */}
          <div className={cn(
            "flex items-center px-4 py-5 border-b border-gray-200/80 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20",
            "bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-500/5 dark:to-indigo-500/5",
            "midnight:from-cyan-500/5 midnight:to-blue-500/5 purple:from-pink-500/5 purple:to-purple-500/5",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            {isCollapsed ? (
              // Collapsed state: Show only logo icon centered with expand button below
              <div className="flex flex-col items-center gap-3">
                <Link href="/" className="flex items-center justify-center group">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 dark:shadow-blue-400/20 group-hover:scale-110 transition-transform duration-200">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                </Link>
                {/* Collapse button - only show on desktop */}
                {isMobile === false && (
                  <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex items-center justify-center p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/10 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-200 hover:scale-110"
                    title="Expand sidebar"
                  >
                    <ChevronsRight className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
                  </button>
                )}
              </div>
            ) : (
              // Expanded state: Show logo and text with collapse button on the right
              <>
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 dark:shadow-blue-400/20 group-hover:scale-110 transition-transform duration-200">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  {/* Show logo text when expanded */}
                  {(isMobile === true || (isMobile === false && !isCollapsed)) && (
                    <div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 midnight:from-cyan-50 midnight:to-cyan-200 purple:from-pink-50 purple:to-pink-200 bg-clip-text text-transparent">Educo</h1>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">School ERP System</p>
                    </div>
                  )}
                </Link>
                {/* Collapse button - only show on desktop */}
                {isMobile === false && (
                  <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex items-center justify-center p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/10 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-200 hover:scale-110"
                    title="Collapse sidebar"
                  >
                    <ChevronsLeft className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Navigation Menu */}
          <nav
            className="flex-1 p-4"
            style={isCollapsed && isMobile === false ? { overflow: 'visible' } : { overflowY: 'auto', overflowX: 'hidden' }}
          >
            <div className="space-y-2">
              {menuItems.map((item) => renderMenuItem(item))}
            </div>
          </nav>

          {/* Footer - Show based on mobile/collapsed state */}
          {(isMobile === true || (isMobile === false && !isCollapsed)) && (
            <div className="p-4 border-t border-gray-200/80 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-500/5 dark:to-indigo-500/5 midnight:from-cyan-500/5 midnight:to-blue-500/5 purple:from-pink-500/5 purple:to-purple-500/5">
              <div className="px-4 py-3.5 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-500/10 dark:via-indigo-500/10 dark:to-blue-600/10 midnight:from-cyan-500/10 midnight:via-blue-500/10 midnight:to-cyan-600/10 purple:from-pink-500/10 purple:via-purple-500/10 purple:to-pink-600/10 rounded-xl border border-blue-200/50 dark:border-blue-500/20 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-all duration-200">
                <p className="text-sm font-bold text-blue-900 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Need Help?
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-1.5 font-medium">Check our documentation & support</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
