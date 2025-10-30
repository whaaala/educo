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
  ChevronRight,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
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
      { id: "classes", label: "Classes", icon: <BookOpen className="w-4 h-4" />, href: "/classes" },
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
        className="mb-1 relative"
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
                "w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors",
                level > 0 && "pl-8"
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {/* Show label based on mobile/collapsed state */}
                {(isMobile === true || (isMobile === false && !isCollapsed)) && (
                  <span className="font-medium">{item.label}</span>
                )}
              </div>
              {/* Show chevron based on mobile/collapsed state */}
              {(isMobile === true || (isMobile === false && !isCollapsed)) && (
                <span className="text-gray-400">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </span>
              )}
            </button>

            {/* Popover menu for collapsed sidebar */}
            {isCollapsedDesktop && level === 0 && hoveredItem === item.id && (
              <div
                className="absolute left-full top-0 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2"
                style={{
                  zIndex: 9999,
                  marginLeft: '4px', // Minimal gap to prevent hover break
                }}
                onMouseEnter={() => handleMouseEnterItem(item.id)}
                onMouseLeave={() => handleMouseLeaveItem(item.id)}
              >
                <div className="px-4 py-2 text-sm font-semibold text-gray-900 border-b border-gray-100">
                  {item.label}
                </div>
                {item.children?.map((child) => (
                  <Link
                    key={child.id}
                    href={child.href || "#"}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    {child.icon}
                    <span>{child.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <Link
              href={item.href || "#"}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors",
                level > 0 && "pl-8"
              )}
            >
              {item.icon}
              {/* Show label based on mobile/collapsed state */}
              {(isMobile === true || (isMobile === false && !isCollapsed)) && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>

            {/* Tooltip for collapsed sidebar */}
            {isCollapsedDesktop && level === 0 && hoveredItem === item.id && (
              <div
                className="absolute left-full top-0 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap"
                style={{
                  zIndex: 9999,
                  marginLeft: '8px',
                }}
                onMouseEnter={() => handleMouseEnterItem(item.id)}
                onMouseLeave={() => handleMouseLeaveItem(item.id)}
              >
                {item.label}
              </div>
            )}
          </>
        )}

        {/* Show children based on mobile/collapsed state */}
        {hasChildren && isExpanded && (isMobile === true || (isMobile === false && !isCollapsed)) && (
          <div className="mt-1 ml-4 space-y-1">
            {item.children?.map((child) => renderMenuItem(child, level + 1))}
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
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md lg:hidden"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
          "fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40",
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
            "flex items-center px-4 py-6 border-b border-gray-200",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            {isCollapsed ? (
              // Collapsed state: Show only logo icon centered with expand button below
              <div className="flex flex-col items-center gap-2">
                <Link href="/" className="flex items-center justify-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                </Link>
                {/* Collapse button - only show on desktop */}
                {isMobile === false && (
                  <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:block p-2 rounded-lg hover:bg-gray-100"
                    title="Expand sidebar"
                  >
                    <ChevronsRight className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
            ) : (
              // Expanded state: Show logo and text with collapse button on the right
              <>
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  {/* Show logo text when expanded */}
                  {(isMobile === true || (isMobile === false && !isCollapsed)) && (
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Educo</h1>
                      <p className="text-xs text-gray-500">School ERP</p>
                    </div>
                  )}
                </Link>
                {/* Collapse button - only show on desktop */}
                {isMobile === false && (
                  <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:block p-2 rounded-lg hover:bg-gray-100"
                    title="Collapse sidebar"
                  >
                    <ChevronsLeft className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Navigation Menu */}
          <nav
            className="flex-1 p-4"
            style={isCollapsed && isMobile === false ? { overflow: 'visible' } : { overflowY: 'auto' }}
          >
            <div className="space-y-2">
              {menuItems.map((item) => renderMenuItem(item))}
            </div>
          </nav>

          {/* Footer - Show based on mobile/collapsed state */}
          {(isMobile === true || (isMobile === false && !isCollapsed)) && (
            <div className="p-4 border-t border-gray-200">
              <div className="px-4 py-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Need Help?</p>
                <p className="text-xs text-blue-700 mt-1">Check our documentation</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
