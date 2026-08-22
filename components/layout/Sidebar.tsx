"use client";

import { useState, useEffect, useRef, memo } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Bus,
  Home,
  Calendar,
  FileText,
  Settings,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Building2,
  Network,
  ClipboardList,
  Boxes,
  Briefcase,
  ArrowRight,
  AlertTriangle,
  UserCheck,
  ClipboardCheck,
  Upload,
  Award,
  BarChart3,
  CalendarClock,
  Star,
  MessageSquare,
  Receipt,
  Video,
  LifeBuoy,
  ExternalLink,
  Presentation,
  HardDrive,
  Globe,
} from "lucide-react";
import TenantSwitcher from "@/components/admin/TenantSwitcher";
import { useUser } from "@/contexts/UserContext";
import CurrencyIcon from "@/components/shared/CurrencyIcon";
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
      { id: "sections", label: "Sections", icon: <ClipboardList className="w-4 h-4" />, href: "/school/sections" },
      { id: "departments", label: "Departments", icon: <Network className="w-4 h-4" />, href: "/school/departments" },
    ],
  },
  {
    id: "peoples",
    label: "Peoples",
    icon: <Users className="w-5 h-5" />,
    children: [
      {
        id: "students",
        label: "Students",
        icon: <GraduationCap className="w-4 h-4" />,
        children: [
          { id: "all-students", label: "All Students", icon: <GraduationCap className="w-4 h-4" />, href: "/students?view=grid" },
          { id: "student-list", label: "Student List", icon: <GraduationCap className="w-4 h-4" />, href: "/students?view=list" },
          { id: "attendance", label: "Attendance", icon: <UserCheck className="w-4 h-4" />, href: "/students/attendance" },
          { id: "grading", label: "Grading", icon: <ClipboardCheck className="w-4 h-4" />, href: "/students/grading" },
          { id: "report-cards", label: "Report Cards", icon: <FileText className="w-4 h-4" />, href: "/students/report-cards" },
          { id: "cumulative-report", label: "Cumulative Report", icon: <BarChart3 className="w-4 h-4" />, href: "/students/cumulative-report" },
          { id: "transcripts", label: "Transcripts", icon: <Award className="w-4 h-4" />, href: "/students/transcripts" },
          { id: "student-promotion", label: "Student Promotion", icon: <GraduationCap className="w-4 h-4" />, href: "/students/promotion" },
          { id: "transfer-requests", label: "Transfer Requests", icon: <ArrowRight className="w-4 h-4" />, href: "/students/transfers" },
          { id: "discipline", label: "Discipline", icon: <AlertTriangle className="w-4 h-4" />, href: "/students/discipline" },
          { id: "bulk-import", label: "Bulk Import", icon: <Upload className="w-4 h-4" />, href: "/students/bulk-import" },
        ]
      },
      {
        id: "parents",
        label: "Parents",
        icon: <Users className="w-4 h-4" />,
        children: [
          { id: "parents-overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" />, href: "/admin/parents/dashboard" },
          { id: "all-parents", label: "All Parents", icon: <Users className="w-4 h-4" />, href: "/admin/parents?view=grid" },
          { id: "parent-list", label: "Parent List", icon: <Users className="w-4 h-4" />, href: "/admin/parents?view=list" },
          { id: "parent-fees", label: "Fee Records", icon: <CurrencyIcon className="w-4 h-4 text-inherit" />, href: "/admin/parents/fees" },
          { id: "parent-messages", label: "Messages", icon: <MessageSquare className="w-4 h-4" />, href: "/admin/parents/messages" },
          { id: "parent-chat", label: "Chat", icon: <MessageSquare className="w-4 h-4" />, href: "/admin/parents/chat" },
          { id: "parent-events", label: "Events", icon: <Calendar className="w-4 h-4" />, href: "/admin/parents/events" },
        ]
      },
      {
        id: "personnel",
        label: "Personnel",
        icon: <Users className="w-4 h-4" />,
        children: [
          { id: "all-personnel", label: "All Personnel", icon: <Users className="w-4 h-4" />, href: "/staff?view=grid" },
          { id: "personnel-list", label: "Personnel List", icon: <Users className="w-4 h-4" />, href: "/staff?view=list" },
          { id: "leave-requests", label: "Leave Requests", icon: <CalendarClock className="w-4 h-4" />, href: "/staff/leave-requests" },
          { id: "performance-reviews", label: "Performance Reviews", icon: <Star className="w-4 h-4" />, href: "/staff/performance-reviews" },
          { id: "staff-discipline", label: "Discipline & Complaints", icon: <MessageSquare className="w-4 h-4" />, href: "/staff/discipline" },
        ]
      },
    ],
  },
  {
    id: "academic",
    label: "Academic",
    icon: <BookOpen className="w-5 h-5" />,
    children: [
      {
        id: "classes",
        label: "Classes",
        icon: <Boxes className="w-4 h-4" />,
        children: [
          { id: "all-classes", label: "All Classes", icon: <Boxes className="w-4 h-4" />, href: "/classes?view=grid" },
          { id: "class-list", label: "Class List", icon: <Boxes className="w-4 h-4" />, href: "/classes?view=list" },
        ]
      },
      { id: "subjects", label: "Subjects", icon: <BookOpen className="w-4 h-4" />, href: "/subjects" },
      { id: "exams", label: "Exams", icon: <FileText className="w-4 h-4" />, href: "/exams" },
      { id: "syllabus", label: "Syllabus", icon: <FileText className="w-4 h-4" />, href: "/syllabus" },
      { id: "assignments", label: "Assignments", icon: <FileText className="w-4 h-4" />, href: "/assignments" },
    ],
  },
  {
    id: "management",
    label: "Management",
    icon: <Briefcase className="w-5 h-5" />,
    children: [
      {
        id: "fees",
        label: "Finance",
        icon: <CurrencyIcon className="w-4 h-4 text-inherit" />,
        children: [
          { id: "fee-structure", label: "Fee Structure", icon: <FileText className="w-4 h-4" />, href: "/finance/fee-structure" },
          { id: "installment-plans", label: "Installment Plans", icon: <Boxes className="w-4 h-4" />, href: "/finance/installments" },
          { id: "receipts", label: "Receipts", icon: <Receipt className="w-4 h-4" />, href: "/finance/receipts" },
        ]
      },
      {
        id: "library",
        label: "Library",
        icon: <BookOpen className="w-4 h-4" />,
        children: [
          { id: "book-catalog", label: "Book Catalog", icon: <BookOpen className="w-4 h-4" />, href: "/library" },
          { id: "borrowing", label: "Borrowing & Returns", icon: <ArrowRight className="w-4 h-4" />, href: "/library/borrowing" },
          { id: "members", label: "Library Members", icon: <Users className="w-4 h-4" />, href: "/library/members" },
          { id: "fines", label: "Fines & Payments", icon: <Receipt className="w-4 h-4" />, href: "/library/fines" },
        ]
      },
      { id: "dormitory", label: "Dormitory", icon: <Home className="w-4 h-4" />, href: "/dormitory" },
      { id: "transport", label: "Transport", icon: <Bus className="w-4 h-4" />, href: "/transport" },
    ],
  },
  {
    id: "workspace",
    label: "Workspace",
    icon: <FileText className="w-5 h-5" />,
    children: [
      { id: "drive", label: "My Drive", icon: <HardDrive className="w-4 h-4" />, href: "/drive" },
      { id: "documents", label: "Documents", icon: <FileText className="w-4 h-4" />, href: "/documents" },
      { id: "presentations", label: "Presentations", icon: <Presentation className="w-4 h-4" />, href: "/presentations" },
      { id: "website-builder", label: "Website Builder", icon: <Globe className="w-4 h-4" />, href: "/website" },
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
      { id: "overview", label: "Settings Overview", icon: <Settings className="w-4 h-4" />, href: "/settings" },
      { id: "general", label: "General Settings", icon: <Settings className="w-4 h-4" />, href: "/settings/general" },
      { id: "communication", label: "Communication", icon: <Video className="w-4 h-4" />, href: "/admin/settings/communication" },
      { id: "schools", label: "Schools & Branches", icon: <Home className="w-4 h-4" />, href: "/settings/schools" },
      { id: "users", label: "User Management", icon: <Users className="w-4 h-4" />, href: "/settings/users" },
      { id: "admin-console", label: "Admin Console", icon: <ExternalLink className="w-4 h-4" />, href: "http://localhost:3001" },
    ],
  },
];

// Parent-specific navigation (used when a Parent user is logged in)
const parentMenuItems: MenuItem[] = [
  {
    id: "parent-dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: "/parents",
  },
  {
    id: "parent-children",
    label: "My Children",
    icon: <GraduationCap className="w-5 h-5" />,
    href: "/parents/children",
  },
  {
    id: "parent-fees",
    label: "Fees & Payments",
    icon: <CurrencyIcon className="w-5 h-5 text-inherit" />,
    href: "/parents/fees",
  },
  {
    id: "parent-messages",
    label: "Messages",
    icon: <MessageSquare className="w-5 h-5" />,
    href: "/parents/messages",
  },
  {
    id: "parent-chat",
    label: "Chat",
    icon: <MessageSquare className="w-5 h-5" />,
    href: "/parents/chat",
  },
  {
    id: "parent-meetings",
    label: "Video Calls & Meetings",
    icon: <Video className="w-5 h-5" />,
    href: "/parents/meetings",
  },
  {
    id: "parent-homework",
    label: "Homework",
    icon: <BookOpen className="w-5 h-5" />,
    href: "/parents/homework",
  },
  {
    id: "parent-results",
    label: "Results",
    icon: <FileText className="w-5 h-5" />,
    href: "/parents/results",
  },
  {
    id: "parent-support",
    label: "Support",
    icon: <LifeBuoy className="w-5 h-5" />,
    href: "/parents/support",
  },
];

export { type MenuItem };

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (value: boolean) => void;
  customMenuItems?: MenuItem[];
  showTenantSwitcher?: boolean;
}

function Sidebar({ isCollapsed, setIsCollapsed, isMobileSidebarOpen, setIsMobileSidebarOpen, customMenuItems, showTenantSwitcher = true }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isParent } = useUser();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState<boolean | null>(null); // null on server, boolean on client
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredSubmenuItem, setHoveredSubmenuItem] = useState<string | null>(null);
  const [hideTimeout, setHideTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [submenuHideTimeout, setSubmenuHideTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [showLogoText, setShowLogoText] = useState(false);
  const logoTextTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper function to check if a link is active
  const isLinkActive = (href: string) => {
    if (!href || href === "#") return false;

    // Parse the href to get pathname and search params
    // Use typeof window check to prevent SSR errors
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const url = new URL(href, origin);
    const linkPathname = url.pathname;
    const linkSearch = url.search;

    // Check if pathname matches
    if (pathname !== linkPathname) return false;

    // If there are search params in the link, check them too
    if (linkSearch) {
      const currentSearch = searchParams.toString();
      return linkSearch === `?${currentSearch}`;
    }

    // If no search params in link, it's active if pathname matches
    return true;
  };

  // Helper function to check if a parent item has any active children
  const hasActiveChild = (item: MenuItem): boolean => {
    if (!item.children) return false;

    for (const child of item.children) {
      if (child.href && isLinkActive(child.href)) return true;
      if (child.children && hasActiveChild(child)) return true;
    }

    return false;
  };

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

  const handleMouseEnterSubmenuItem = (itemId: string) => {
    // Clear any existing timeout
    if (submenuHideTimeout) {
      clearTimeout(submenuHideTimeout);
      setSubmenuHideTimeout(null);
    }
    // Immediately show the new submenu
    setHoveredSubmenuItem(itemId);
  };

  const handleMouseLeaveSubmenuItem = (itemId: string) => {
    // Only hide if we're leaving the currently hovered submenu item
    const timeout = setTimeout(() => {
      setHoveredSubmenuItem((current) => {
        // Only clear if we're still on the same item
        return current === itemId ? null : current;
      });
    }, 150); // 150ms delay
    setSubmenuHideTimeout(timeout);
  };

  // Detect if we're on mobile and close menu when resized to desktop
  useEffect(() => {
    const checkMobile = () => {
      // Use the same breakpoint as Tailwind's lg (1024px)
      const mobile = window.innerWidth <= 1023;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileSidebarOpen(false);
      }
    };

    checkMobile(); // Check on mount immediately
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle delayed logo text visibility
  useEffect(() => {
    // Clear any existing timeout
    if (logoTextTimeoutRef.current) {
      clearTimeout(logoTextTimeoutRef.current);
      logoTextTimeoutRef.current = null;
    }

    if (isMobile === true || (isMobile === false && !isCollapsed)) {
      // Show logo text after 500ms delay
      logoTextTimeoutRef.current = setTimeout(() => {
        setShowLogoText(true);
      }, 500);
    } else {
      // Hide immediately when collapsing
      setShowLogoText(false);
    }

    return () => {
      if (logoTextTimeoutRef.current) {
        clearTimeout(logoTextTimeoutRef.current);
      }
    };
  }, [isCollapsed, isMobile]);

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
                "w-full flex items-center gap-3 px-3 py-2.5 pr-3 rounded-xl font-medium text-sm cursor-pointer",
                "transition-all duration-200 ease-out",
                "border",
                hasActiveChild(item)
                  ? "bg-blue-50/40 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 text-blue-600 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 border-blue-200/30 dark:border-blue-700 midnight:border-cyan-500 purple:border-pink-500/20 midnight:border-cyan-700/20 purple:border-pink-700/20"
                  : "text-gray-600 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-100/50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 border-transparent",
                level > 0 && "pl-3"
              )}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0",
                  "transition-all duration-200",
                  hasActiveChild(item)
                    ? "bg-blue-100/30 dark:bg-blue-800/20 midnight:bg-cyan-800/20 purple:bg-pink-800/20"
                    : "bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-cyan-500/10 purple:bg-pink-500/10"
                )}>
                  {item.icon}
                </div>
                {/* Show label based on mobile/collapsed state */}
                <span
                  className="text-left transition-all ease-in-out"
                  style={{
                    width: (isMobile === true || (isMobile === false && !isCollapsed)) ? 'auto' : '0px',
                    overflow: (isMobile === true || (isMobile === false && !isCollapsed)) ? 'visible' : 'hidden',
                    transitionDuration: '300ms'
                  }}
                >
                  <span
                    className="whitespace-nowrap transition-opacity ease-in-out block"
                    style={{
                      opacity: (isMobile === true || (isMobile === false && !isCollapsed)) ? 1 : 0,
                      transitionDuration: '200ms',
                      transitionDelay: (isMobile === true || (isMobile === false && !isCollapsed)) ? '200ms' : '0ms'
                    }}
                  >
                    {item.label}
                  </span>
                </span>
              </div>
              {/* Show chevron based on mobile/collapsed state - with fixed width for rotation */}
              <div className={cn(
                "transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] flex-shrink-0 w-8 flex items-center justify-center ml-auto",
                isExpanded && "rotate-180",
                !(isMobile === true || (isMobile === false && !isCollapsed)) && "opacity-0"
              )}>
                <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
            </button>

            {/* Popover menu for collapsed sidebar */}
            {isCollapsedDesktop && level === 0 && hoveredItem === item.id && (
              <div
                className="absolute left-full top-0 w-56 bg-white dark:bg-[#1e2128] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 py-2 backdrop-blur-sm animate-in fade-in slide-in-from-left-2 duration-200"
                style={{
                  zIndex: 9999,
                  marginLeft: '8px',
                }}
                onMouseEnter={() => handleMouseEnterItem(item.id)}
                onMouseLeave={() => handleMouseLeaveItem(item.id)}
              >
                <div className="px-4 py-2.5 text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 border-b border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50">
                  {item.label}
                </div>
                <div className="py-1">
                  {item.children?.map((child) => {
                    const childHasChildren = child.children && child.children.length > 0;

                    if (childHasChildren) {
                      // Render item with nested submenu on hover
                      const childIsActive = hasActiveChild(child);
                      return (
                        <div
                          key={child.id}
                          className="relative mx-2"
                          onMouseEnter={() => handleMouseEnterSubmenuItem(child.id)}
                          onMouseLeave={() => handleMouseLeaveSubmenuItem(child.id)}
                        >
                          <div className={cn(
                            "flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-all duration-200 rounded-xl cursor-pointer",
                            childIsActive
                              ? "bg-blue-50/40 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 text-blue-600 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 border border-blue-200/30 dark:border-blue-700 midnight:border-cyan-500 purple:border-pink-500/20 midnight:border-cyan-700/20 purple:border-pink-700/20"
                              : "text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 hover:text-blue-600 dark:hover:text-blue-300 midnight:hover:text-cyan-300 purple:hover:text-pink-300"
                          )}>
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200",
                                childIsActive
                                  ? "bg-blue-100/30 dark:bg-blue-800/20 midnight:bg-cyan-800/20 purple:bg-pink-800/20"
                                  : "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50"
                              )}>
                                {child.icon}
                              </div>
                              <span className={cn("font-medium")}>{child.label}</span>
                            </div>
                            <ChevronDown className={cn("w-4 h-4 -rotate-90 transition-transform duration-200")} />
                          </div>

                          {/* Nested submenu popup */}
                          {hoveredSubmenuItem === child.id && (
                            <div
                              className="absolute left-full top-0 w-52 bg-white dark:bg-[#1e2128] midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 py-2 backdrop-blur-sm animate-in fade-in slide-in-from-left-2 duration-200"
                              style={{
                                zIndex: 10000,
                                marginLeft: '8px',
                              }}
                              onMouseEnter={() => handleMouseEnterSubmenuItem(child.id)}
                              onMouseLeave={() => handleMouseLeaveSubmenuItem(child.id)}
                            >
                              <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 uppercase tracking-wide border-b border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/20 purple:border-pink-500/20">
                                {child.label}
                              </div>
                              <div className="py-1">
                                {child.children?.map((grandchild) => {
                                  const isActive = isLinkActive(grandchild.href || "");
                                  return (
                                    <Link
                                      key={grandchild.id}
                                      href={grandchild.href || "#"}
                                      className={cn(
                                        "flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 rounded-xl mx-2 cursor-pointer",
                                        isActive
                                          ? "bg-blue-50/40 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 text-blue-600 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 border border-blue-200/30 dark:border-blue-700 midnight:border-cyan-500 purple:border-pink-500/20 midnight:border-cyan-700/20 purple:border-pink-700/20"
                                          : "text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-100/80 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 hover:text-blue-600 dark:hover:text-blue-300 midnight:hover:text-cyan-300 purple:hover:text-pink-300"
                                      )}
                                    >
                                      <div className={cn(
                                        "flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200",
                                        isActive
                                          ? "bg-blue-100/30 dark:bg-blue-800/20 midnight:bg-cyan-800/20 purple:bg-pink-800/20"
                                          : "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50"
                                      )}>
                                        {grandchild.icon}
                                      </div>
                                      <span className="font-medium">{grandchild.label}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={child.id}
                        href={child.href || "#"}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100 hover:bg-blue-50 dark:hover:bg-blue-500/10 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 hover:text-blue-600 dark:hover:text-blue-300 midnight:hover:text-cyan-300 purple:hover:text-pink-300 transition-all duration-150 rounded-lg mx-2 cursor-pointer"
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50">
                          {child.icon}
                        </div>
                        <span className="font-medium">{child.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <Link
              href={item.href || "#"}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 pr-3 rounded-xl font-medium text-sm cursor-pointer",
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
                level > 0 && "pl-3"
              )}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0",
                  "bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-cyan-500/10 purple:bg-pink-500/10",
                  "group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20",
                  "midnight:group-hover:bg-cyan-500/20 purple:group-hover:bg-pink-500/20",
                  "transition-colors duration-200"
                )}>
                  {item.icon}
                </div>
                {/* Show label based on mobile/collapsed state */}
                <span
                  className="text-left transition-all ease-in-out"
                  style={{
                    width: (isMobile === true || (isMobile === false && !isCollapsed)) ? 'auto' : '0px',
                    overflow: (isMobile === true || (isMobile === false && !isCollapsed)) ? 'visible' : 'hidden',
                    transitionDuration: '300ms'
                  }}
                >
                  <span
                    className="whitespace-nowrap transition-opacity ease-in-out block"
                    style={{
                      opacity: (isMobile === true || (isMobile === false && !isCollapsed)) ? 1 : 0,
                      transitionDuration: '200ms',
                      transitionDelay: (isMobile === true || (isMobile === false && !isCollapsed)) ? '200ms' : '0ms'
                    }}
                  >
                    {item.label}
                  </span>
                </span>
              </div>
              {/* Spacer to match chevron width and maintain alignment */}
              <div className="flex-shrink-0 w-8 ml-auto"></div>
            </Link>

            {/* Tooltip for collapsed sidebar */}
            {isCollapsedDesktop && level === 0 && hoveredItem === item.id && (
              <div
                className="absolute left-full top-0 px-3 py-2 bg-gray-900 dark:bg-[#1a1d24] midnight:bg-cyan-600 purple:bg-pink-600 text-white text-sm font-medium rounded-lg whitespace-nowrap shadow-lg animate-in fade-in slide-in-from-left-1 duration-150"
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
        {hasChildren && (isMobile === true || (isMobile === false && !isCollapsed)) && (
          <div
            className={cn(
              "overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
              isExpanded ? "max-h-[2000px] opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
            )}
          >
            <div className={cn(
              "space-y-1 pl-6 transition-all duration-[500ms] ease-out delay-[80ms]",
              isExpanded ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            )}>
            {item.children?.map((child) => {
              const childHasChildren = child.children && child.children.length > 0;

              // If child has children, render it recursively
              if (childHasChildren) {
                return renderMenuItem(child, level + 1);
              }

              // Otherwise render as a simple link
              const childIsActive = isLinkActive(child.href || "");
              return (
                <Link
                  key={child.id}
                  href={child.href || "#"}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 pr-3 rounded-xl text-sm font-medium cursor-pointer",
                    "transition-all duration-200",
                    childIsActive
                      ? "bg-blue-50/40 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 text-blue-600 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 border border-blue-200/30 dark:border-blue-700 midnight:border-cyan-500 purple:border-pink-500/20 midnight:border-cyan-700/20 purple:border-pink-700/20"
                      : "text-gray-600 dark:text-gray-400 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100/50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 hover:text-blue-600 dark:hover:text-blue-300 midnight:hover:text-cyan-300 purple:hover:text-pink-300"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={cn(
                      "flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-all duration-200",
                      childIsActive
                        ? "bg-blue-100/30 dark:bg-blue-800/20 midnight:bg-cyan-800/20 purple:bg-pink-800/20"
                        : "bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-cyan-500/10 purple:bg-pink-500/10"
                    )}>
                      {child.icon}
                    </div>
                    <span className="tracking-wide">{child.label}</span>
                  </div>
                  {/* Spacer to match parent items' chevron width and maintain alignment */}
                  <div className="flex-shrink-0 w-8 ml-auto"></div>
                </Link>
              );
            })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay - Only shows on mobile when menu is open */}
      {isMobile && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileSidebarOpen(false)}
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
          "border-r border-gray-200/80 dark:border-[#1a1d24] midnight:border-cyan-500/20 purple:border-pink-500/20",
          "shadow-xl shadow-gray-200/50 dark:shadow-black/20",
          "backdrop-blur-xl",
          "transition-all duration-500 ease-in-out z-40",
          // On mobile: always full width (w-72) when open
          // On desktop: w-20 when collapsed, w-72 when expanded
          "w-72 lg:w-auto",
          isCollapsed ? "lg:w-20" : "lg:w-72",
          // Mobile visibility
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{
          ...(isCollapsed && isMobile === false ? { overflow: 'visible' } : {}),
          // Set CSS variable for sidebar width so other components can use it
          '--sidebar-width': isMobile ? '0px' : (isCollapsed ? '80px' : '288px'),
        } as React.CSSProperties}
      >
        <div className="flex flex-col h-full" style={isCollapsed && isMobile === false ? { overflow: 'visible' } : undefined}>
          {/* Logo Section */}
          <div className={cn(
            "flex items-center px-4 py-5 border-b border-gray-200/80 dark:border-[#1a1d24] midnight:border-cyan-500/20 purple:border-pink-500/20",
            "bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-500/5 dark:to-indigo-500/5",
            "midnight:from-cyan-500/5 midnight:to-blue-500/5 purple:from-pink-500/5 purple:to-purple-500/5",
            "transition-all duration-500 ease-in-out",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            {isCollapsed ? (
              // Collapsed state: Show only logo icon centered with expand button below
              <div className="flex flex-col items-center gap-3">
                <Link href="/" className="flex items-center justify-center group cursor-pointer">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 dark:shadow-blue-400/20 group-hover:scale-110 transition-transform duration-200">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                </Link>
                {/* Collapse button - only show on desktop */}
                {isMobile === false && (
                  <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex items-center justify-center p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/10 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-200 hover:scale-110 cursor-pointer"
                    title="Expand sidebar"
                  >
                    <ChevronsRight className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
                  </button>
                )}
              </div>
            ) : (
              // Expanded state: Show logo and text with collapse button on the right
              <>
                <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 dark:shadow-blue-400/20 group-hover:scale-110 transition-transform duration-200">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  {/* Show logo text when expanded - only render after delay */}
                  {showLogoText && (
                    <div className="ml-3 animate-in fade-in slide-in-from-left-2 duration-200">
                      <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 midnight:from-cyan-50 midnight:to-cyan-200 purple:from-pink-50 purple:to-pink-200 bg-clip-text text-transparent">Educo</h1>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">School ERP System</p>
                    </div>
                  )}
                </Link>
                {/* Close button for mobile */}
                {isMobile === true && (
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="lg:hidden flex items-center justify-center p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/10 midnight:hover:bg-red-500/10 purple:hover:bg-red-500/10 transition-all duration-200 hover:scale-110 cursor-pointer"
                    title="Close sidebar"
                  >
                    <ChevronsLeft className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
                  </button>
                )}
                {/* Collapse button - only show on desktop */}
                {isMobile === false && (
                  <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex items-center justify-center p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/10 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-200 hover:scale-110 cursor-pointer"
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
            className="flex-1 min-h-0 p-4"
            style={isCollapsed && isMobile === false ? { overflow: 'visible' } : { overflowY: 'auto', overflowX: 'hidden' }}
          >
            <div className="space-y-2">
              {(customMenuItems ?? (isParent ? parentMenuItems : menuItems)).map((item) => renderMenuItem(item))}
            </div>
          </nav>

          {/* Footer - Show based on mobile/collapsed state */}
          {(isMobile === true || (isMobile === false && !isCollapsed)) && (
            <div className="flex-shrink-0 p-4 border-t border-gray-200/80 dark:border-[#1a1d24] midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-500/5 dark:to-indigo-500/5 midnight:from-cyan-500/5 midnight:to-blue-500/5 purple:from-pink-500/5 purple:to-purple-500/5 space-y-3">
              {/* Tenant Switcher */}
              {showTenantSwitcher && !isParent && <TenantSwitcher />}

              {/* Help Section */}
              <div className="px-4 py-3.5 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-500/10 dark:via-indigo-500/10 dark:to-blue-600/10 midnight:from-cyan-500/10 midnight:via-blue-500/10 midnight:to-cyan-600/10 purple:from-pink-500/10 purple:via-purple-500/10 purple:to-pink-600/10 rounded-xl border border-blue-200/50 dark:border-blue-500 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-all duration-200">
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

export default memo(Sidebar);
