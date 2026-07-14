"use client";

import React, { useState, useEffect } from "react";
import {
  Folder, FolderOpen, FolderPlus, FileText, Presentation, Table2,
  Image as ImageIcon, File, MoreVertical, ChevronDown,
  LayoutGrid, List, Trash2, Pencil, X, FolderInput, Clock,
  Star, Users, HardDrive, Cloud, ArrowUp, LucideIcon,
  Download, Copy, Share2, Info, ExternalLink, Home, Search, Menu,
} from "lucide-react";
import SearchBar from "@/components/shared/SearchBar";
import CustomDropdown from "@/components/shared/CustomDropdown";
import ViewToggle from "@/components/shared/ViewToggle";
import ActionMenuDropdown, { type ActionMenuEntry } from "@/components/shared/ActionMenuDropdown";
import PeopleFilterDropdown, { type PersonItem } from "@/components/shared/PeopleFilterDropdown";
import SuggestedFiles, { type SuggestedFileItem } from "@/components/shared/SuggestedFiles";
import Tooltip from "@/components/shared/Tooltip";
import AvatarHover from "@/components/shared/AvatarHover";
import FileCardGrid, { type FileCardItem } from "@/components/shared/FileCardGrid";
import ResponsiveListTable, { type ColumnConfig } from "@/components/shared/ResponsiveListTable";

// ── Types ──

export interface FileBrowserItem {
  id: string;
  name: string;
  type: "file" | "folder";
  sourceType?: "document" | "presentation" | "spreadsheet" | "upload";
  size?: number;
  updatedAt: string;
  readOnly?: boolean;
  childCount?: number;
  folderName?: string;
  owner?: string;
  ownerAvatar?: string;
  /** HTML content for preview rendering */
  content?: string;
}

export interface BreadcrumbSegment { id: string; name: string; }

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
}

export interface FileBrowserProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  iconGradient?: string;
  breadcrumbs: BreadcrumbSegment[];
  items: FileBrowserItem[];
  /** All items across the entire drive — used for global search */
  allItems?: FileBrowserItem[];
  recentFiles?: FileBrowserItem[];
  sidebarItems?: SidebarNavItem[];
  storageUsed?: string;
  storageTotal?: string;
  storagePercent?: number;
  headerActions?: React.ReactNode;
  /** Menu items for the title dropdown (e.g. "New folder", "New document") */
  titleMenuItems?: ActionMenuEntry[];
  /** People who have shared files — for the People filter dropdown */
  people?: PersonItem[];
  /** Called when files are filtered by person */
  onPeopleFilter?: (person: PersonItem | null) => void;
  onNavigate?: (folderId: string) => void;
  onFileOpen?: (item: FileBrowserItem) => void;
  onRename?: (itemId: string, newName: string) => void;
  onMove?: (item: FileBrowserItem) => void;
  onDelete?: (item: FileBrowserItem) => void;
  onDownload?: (item: FileBrowserItem) => void;
  onCopy?: (item: FileBrowserItem) => void;
  onShare?: (item: FileBrowserItem) => void;
  onInfo?: (item: FileBrowserItem) => void;
  onCreateFolder?: (name: string) => void;
  onSidebarNavigate?: (id: string) => void;
  newFolderMode?: boolean;
  onNewFolderModeChange?: (active: boolean) => void;
  emptyTitle?: string;
  emptySubtitle?: string;
  emptyAction?: React.ReactNode;
  searchPlaceholder?: string;
  className?: string;
}

// ── Helpers ──

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getItemIcon(item: FileBrowserItem, size = "w-5 h-5") {
  if (item.type === "folder") return <Folder className={`${size} text-gray-500`} />;
  switch (item.sourceType) {
    case "presentation": return <Presentation className={`${size} text-amber-500`} />;
    case "document": return <FileText className={`${size} text-blue-500`} />;
    case "spreadsheet": return <Table2 className={`${size} text-green-600`} />;
    case "upload": return <ImageIcon className={`${size} text-red-500`} />;
    default: return <File className={`${size} text-gray-400`} />;
  }
}

function getTypeColor(item: FileBrowserItem): string {
  if (item.type === "folder") return "#9ca3af";
  switch (item.sourceType) {
    case "document": return "#3b82f6";
    case "presentation": return "#f59e0b";
    case "spreadsheet": return "#16a34a";
    case "upload": return "#ef4444";
    default: return "#9ca3af";
  }
}

function formatSize(bytes?: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Context Menu ──

function ItemContextMenu({ item, onRename, onMove, onDelete, onDownload, onCopy, onShare, onInfo, onClose }: {
  item: FileBrowserItem; onRename: () => void; onMove: () => void; onDelete: () => void; onClose: () => void;
  onDownload?: () => void; onCopy?: () => void; onShare?: () => void; onInfo?: () => void;
}) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [openUpward, setOpenUpward] = React.useState(false);

  useEffect(() => {
    const handler = () => onClose();
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [onClose]);

  // Check if menu would overflow below viewport — if so, open upward
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 20) {
        setOpenUpward(true);
      }
    }
  }, []);

  return (
    <div ref={menuRef} className={`absolute right-0 w-[180px] bg-white/95 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 z-50 py-1 ${openUpward ? "bottom-full mb-1" : "top-full mt-1"}`} onClick={e => e.stopPropagation()}>
      <button className="w-full px-3 py-2 text-left text-[12px] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 flex items-center gap-2.5 cursor-pointer transition-colors" onClick={onRename}>
        <Pencil className="w-3.5 h-3.5 text-gray-400" /> Rename
      </button>
      <button className="w-full px-3 py-2 text-left text-[12px] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 flex items-center gap-2.5 cursor-pointer transition-colors" onClick={onMove}>
        <FolderInput className="w-3.5 h-3.5 text-gray-400" /> Move to
      </button>
      <button className="w-full px-3 py-2 text-left text-[12px] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 flex items-center gap-2.5 cursor-pointer transition-colors" onClick={() => { onDownload?.(); onClose(); }}>
        <Download className="w-3.5 h-3.5 text-gray-400" /> Download
      </button>
      <button className="w-full px-3 py-2 text-left text-[12px] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 flex items-center gap-2.5 cursor-pointer transition-colors" onClick={() => { onCopy?.(); onClose(); }}>
        <Copy className="w-3.5 h-3.5 text-gray-400" /> Make a copy
      </button>
      <div className="my-1 h-px bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]" />
      <button className="w-full px-3 py-2 text-left text-[12px] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 flex items-center gap-2.5 cursor-pointer transition-colors" onClick={() => { onShare?.(); onClose(); }}>
        <Share2 className="w-3.5 h-3.5 text-gray-400" /> Share
      </button>
      {!item.readOnly && (
        <>
          <div className="my-1 h-px bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]" />
          <button className="w-full px-3 py-2 text-left text-[12px] text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-900/20 purple:hover:bg-red-900/20 flex items-center gap-2.5 cursor-pointer transition-colors" onClick={onDelete}>
            <Trash2 className="w-3.5 h-3.5" /> Move to bin
          </button>
        </>
      )}
    </div>
  );
}

// FilterChip removed — using existing CustomDropdown component instead

// ── Main Component ──

export default function FileBrowser({
  title, subtitle, icon: Icon, iconGradient = "from-blue-500 to-blue-600",
  breadcrumbs, items, allItems, recentFiles, sidebarItems, storageUsed, storageTotal, storagePercent,
  headerActions, titleMenuItems, people, onPeopleFilter, onNavigate, onFileOpen, onRename, onMove, onDelete, onDownload, onCopy, onShare, onInfo, onCreateFolder,
  onSidebarNavigate, newFolderMode = false, onNewFolderModeChange,
  emptyTitle, emptySubtitle, emptyAction, searchPlaceholder = "Search in Drive...", className = "",
}: FileBrowserProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [modifiedFilter, setModifiedFilter] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<PersonItem | null>(null);
  const [sortField, setSortField] = useState<"name" | "modified" | "size">("name");
  const [sortAsc, setSortAsc] = useState(true);

  // When searching or filtering by person, search across ALL items in the drive
  const isSearching = searchQuery.length > 0;
  const isPersonFiltering = selectedPerson !== null;
  const useGlobalSource = isSearching || isPersonFiltering;
  const searchSource = useGlobalSource ? (allItems || items) : items;

  // Filter
  let filteredItems = isSearching
    ? searchSource.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : searchSource;
  if (typeFilter) filteredItems = filteredItems.filter(i => typeFilter === "folder" ? i.type === "folder" : i.sourceType === typeFilter);
  // Person filter — show only files owned by / associated with the selected person
  if (isPersonFiltering) {
    const personName = selectedPerson!.name.toLowerCase();
    filteredItems = filteredItems.filter(i =>
      i.type === "file" && (
        (i.owner && i.owner.toLowerCase().includes(personName)) ||
        // For "Anyone with the link", show all shared files
        selectedPerson!.id === "anyone"
      )
    );
  }
  if (modifiedFilter) {
    const now = Date.now();
    filteredItems = filteredItems.filter(i => {
      const t = new Date(i.updatedAt).getTime();
      if (modifiedFilter === "today") return now - t < 86400000;
      if (modifiedFilter === "7days") return now - t < 7 * 86400000;
      if (modifiedFilter === "30days") return now - t < 30 * 86400000;
      return true;
    });
  }

  // Sort
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    let cmp = 0;
    if (sortField === "name") cmp = a.name.localeCompare(b.name);
    else if (sortField === "modified") cmp = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    else if (sortField === "size") cmp = (a.size || 0) - (b.size || 0);
    return sortAsc ? cmp : -cmp;
  });

  const handleItemClick = (item: FileBrowserItem) => {
    if (item.type === "folder") onNavigate?.(item.id);
    else onFileOpen?.(item);
  };

  const startRename = (item: FileBrowserItem) => { setRenamingId(item.id); setRenameValue(item.name); setMenuOpenId(null); };
  const submitRename = () => { if (renamingId && renameValue.trim()) onRename?.(renamingId, renameValue.trim()); setRenamingId(null); setRenameValue(""); };
  const handleCreateFolder = () => { if (!newFolderName.trim()) return; onCreateFolder?.(newFolderName.trim()); setNewFolderName(""); onNewFolderModeChange?.(false); };
  const toggleSort = (field: "name" | "modified" | "size") => { if (sortField === field) setSortAsc(!sortAsc); else { setSortField(field); setSortAsc(true); } };

  return (
    <div className={`flex gap-0 ${className}`}>
      {/* ══════ LEFT SIDEBAR — desktop only (lg+), fixed position ══════ */}
      {sidebarItems && sidebarItems.length > 0 && (
        <>
          {/* Spacer to reserve width — desktop only */}
          <div className="hidden lg:block w-[220px] flex-shrink-0" />
          {/* Fixed sidebar panel — desktop only */}
          <div className="hidden lg:flex flex-col fixed top-[5.75rem] bottom-0 w-[220px] bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] z-20 transition-[left] duration-500 ease-in-out" style={{ left: 'var(--sidebar-width)' }}>
            {headerActions && <div className="px-4 mb-4 relative z-30">{headerActions}</div>}
            <div className="flex-1 px-4 overflow-y-auto">
              <nav className="flex flex-col gap-0.5">
                {sidebarItems.map(nav => (
                  <button key={nav.id} onClick={() => onSidebarNavigate?.(nav.id)}
                    className={`group flex items-center gap-3 px-3 py-[7px] rounded-lg text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                      nav.active
                        ? "bg-blue-50 dark:bg-blue-500/10 midnight:bg-blue-500/10 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 font-semibold shadow-sm shadow-blue-100/50 dark:shadow-none"
                        : "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100/80 dark:hover:bg-white/5 midnight:hover:bg-white/5"
                    }`}>
                    <nav.icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors duration-150 ${
                      nav.active
                        ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                        : "text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                    }`} />
                    {nav.label}
                  </button>
                ))}
              </nav>
            </div>
            {storageUsed && storageTotal && (
              <div className="flex-shrink-0 px-4 pb-4 pt-3 border-t border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10">
                <div className="h-1.5 bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all" style={{ width: `${storagePercent ?? 0}%` }} />
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">{storageUsed} of {storageTotal} used</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ══════ MAIN CONTENT ══════ */}
      <div className="flex-1 min-w-0 flex flex-col h-[calc(100vh-5rem)] lg:h-[calc(100vh-6rem)] overflow-hidden px-1 sm:px-2 lg:pr-8 lg:pl-0">
        {/* ── Fixed header area (title, search, filters) ── */}
        <div className="flex-shrink-0">
        {/* Title + Search + View toggle */}
        <div className="flex items-center gap-2 sm:gap-4 mb-3">
          {/* Title — as dropdown trigger if titleMenuItems provided, else plain text */}
          {titleMenuItems && titleMenuItems.length > 0 ? (
            <ActionMenuDropdown
              trigger={(menuOpen) => (
                <button className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[15px] sm:text-[18px] font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer flex-shrink-0">
                  {breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 1]?.name : title}
                  <ChevronDown className={`w-4 h-4 transition-all duration-[120ms] ease-out ${menuOpen ? "rotate-180 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" : "rotate-0 text-gray-500"}`} />
                </button>
              )}
              items={titleMenuItems}
              width="w-[260px]"
            />
          ) : (
            <h2 className="text-[18px] font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 flex-shrink-0">
              {breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 1]?.name : title}
            </h2>
          )}
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={searchPlaceholder}
              size="md"
              fullWidth
              debounce={200}
            />
          </div>
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>

        {/* Filters — with mobile hamburger inline */}
        <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-3 sm:mb-5 flex-nowrap">
          {/* ── Mobile-only hamburger menu (< md) — first in filter row ── */}
          {sidebarItems && sidebarItems.length > 0 && (
            <div className="relative md:hidden">
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className={`flex items-center gap-1.5 px-3 py-[7px] rounded-full text-[12px] font-medium transition-all cursor-pointer border ${
                  mobileNavOpen
                    ? "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500 midnight:border-cyan-500 purple:border-pink-500/30 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300"
                    : "border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                <Menu className="w-3.5 h-3.5" />
                <span>{sidebarItems.find(n => n.active)?.label || "Menu"}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${mobileNavOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileNavOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMobileNavOpen(false)} />
                  <div className="absolute left-0 top-full mt-1.5 z-50 w-[220px] bg-white dark:bg-[#1e2028] rounded-xl shadow-xl border border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                    {headerActions && (
                      <div className="px-3 pb-2 mb-1 border-b border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10">
                        {headerActions}
                      </div>
                    )}
                    {sidebarItems.map(nav => (
                      <button key={nav.id} onClick={() => { onSidebarNavigate?.(nav.id); setMobileNavOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-[13px] font-medium transition-all cursor-pointer ${
                          nav.active
                            ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 font-semibold"
                            : "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-50 dark:hover:bg-white/5"
                        }`}>
                        <nav.icon className={`w-4 h-4 flex-shrink-0 ${nav.active ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" : "text-gray-400"}`} />
                        {nav.label}
                      </button>
                    ))}
                    {storageUsed && storageTotal && (
                      <div className="mx-3 mt-2 pt-2 border-t border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10">
                        <div className="h-1.5 bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50 rounded-full overflow-hidden mb-1.5">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: `${storagePercent ?? 0}%` }} />
                        </div>
                        <p className="text-[10px] text-gray-400 pb-1">{storageUsed} of {storageTotal} used</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          {/* Spacer to push filters right on mobile when hamburger is present */}
          {sidebarItems && sidebarItems.length > 0 && <div className="flex-1 md:hidden" />}
          <CustomDropdown
            value={typeFilter || "all"}
            options={[
              { label: "All types", value: "all" },
              { label: "Folders", value: "folder" },
              { label: "Documents", value: "document" },
              { label: "Presentations", value: "presentation" },
              { label: "Spreadsheets", value: "spreadsheet" },
              { label: "Photos & images", value: "upload" },
            ]}
            onChange={(v) => setTypeFilter(v === "all" ? "" : String(v))}
            className="w-auto min-w-0 flex-shrink-0"
          />
          {people && people.length > 0 && (
            <div className="flex-shrink-0">
            <PeopleFilterDropdown
              people={people}
              selectedPerson={selectedPerson}
              onSelect={(person) => {
                setSelectedPerson(person);
                onPeopleFilter?.(person);
              }}
            />
            </div>
          )}
          <CustomDropdown
            value={modifiedFilter || "anytime"}
            options={[
              { label: "Any time", value: "anytime" },
              { label: "Today", value: "today" },
              { label: "Last 7 days", value: "7days" },
              { label: "Last 30 days", value: "30days" },
            ]}
            onChange={(v) => setModifiedFilter(v === "anytime" ? "" : String(v))}
            className="w-auto min-w-0 flex-shrink-0"
          />
        </div>

        {/* ── Tablet horizontal nav (md to lg) ── */}
        {sidebarItems && sidebarItems.length > 0 && (
          <div className="hidden md:flex lg:hidden items-center gap-2 mb-3 overflow-x-auto pb-1 flex-shrink-0">
            {headerActions && <div className="flex-shrink-0">{headerActions}</div>}
            <div className="flex items-center gap-1 flex-shrink-0">
              {sidebarItems.map(nav => (
                <button key={nav.id} onClick={() => onSidebarNavigate?.(nav.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                    nav.active
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 font-semibold"
                      : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}>
                  <nav.icon className={`w-3.5 h-3.5 flex-shrink-0 ${nav.active ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" : "text-gray-400"}`} />
                  {nav.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* New folder inline */}
        {newFolderMode && (
          <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50/60 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10 border border-blue-200/50 dark:border-blue-500 midnight:border-cyan-500 purple:border-pink-500/20">
            <FolderPlus className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <input type="text" value={newFolderName} onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleCreateFolder(); if (e.key === "Escape") { onNewFolderModeChange?.(false); setNewFolderName(""); } }}
              placeholder="Untitled folder" autoFocus
              className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-[13px] text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" />
            <button onClick={handleCreateFolder} disabled={!newFolderName.trim()} className="px-4 py-1.5 rounded-lg text-[12px] font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-30 cursor-pointer shadow-sm">Create</button>
            <button onClick={() => { onNewFolderModeChange?.(false); setNewFolderName(""); }} className="p-1 rounded-lg hover:bg-gray-200/60 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 cursor-pointer"><X className="w-4 h-4 text-gray-400" /></button>
          </div>
        )}

        </div>{/* end fixed header */}

        {/* ── Scrollable content area (suggested + file list) ── */}
        <div className="flex-1 min-h-0 drive-scroll-area pt-2 pb-4 px-2 sm:px-3">

        {/* ── SEARCH RESULTS HEADER ── */}
        {isSearching && (
          <div className="flex items-center justify-between mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <Search className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">
                  Search results for &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-[11px] text-gray-400">
                  {sortedItems.length} {sortedItems.length === 1 ? "item" : "items"} found
                </p>
              </div>
            </div>
            <button
              onClick={() => setSearchQuery("")}
              className="text-[12px] font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline cursor-pointer"
            >
              Clear search
            </button>
          </div>
        )}

        {/* ── PERSON FILTER RESULTS HEADER ── */}
        {isPersonFiltering && !isSearching && (
          <div className="flex items-center justify-between mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-violet-500" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">
                  Files from {selectedPerson!.name}
                </p>
                <p className="text-[11px] text-gray-400">
                  {sortedItems.length} {sortedItems.length === 1 ? "file" : "files"} found
                </p>
              </div>
            </div>
            <button
              onClick={() => { setSelectedPerson(null); onPeopleFilter?.(null); }}
              className="text-[12px] font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline cursor-pointer"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* ── SUGGESTED (recent files) — uses reusable SuggestedFiles component ── */}
        {recentFiles && recentFiles.length > 0 && !isSearching && !isPersonFiltering && !typeFilter && !modifiedFilter && (
          <>
            <SuggestedFiles
              files={recentFiles as SuggestedFileItem[]}
              title="Suggested"
              onFileOpen={(file) => onFileOpen?.(file as FileBrowserItem)}
              maxItems={5}
            />
            {/* Divider between Suggested and Files — only in grid view */}
            {sortedItems.length > 0 && viewMode === "grid" && (
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20" /></div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#1e1030] px-4 text-[11px] font-semibold text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 uppercase tracking-widest flex items-center gap-2">
                    <Folder className="w-3 h-3" />
                    All files
                    <span className="text-[10px] font-normal text-gray-300 dark:text-gray-600 midnight:text-cyan-500 purple:text-pink-500">({sortedItems.length})</span>
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── LIST VIEW — uses existing DataTable component ── */}
        {viewMode === "list" && sortedItems.length > 0 && (
          <div className={`transition-all duration-300 mx-3 sm:mx-2 lg:mx-0 ${isSearching || isPersonFiltering ? "animate-in fade-in slide-in-from-bottom-2 duration-300" : ""}`}>
            <ResponsiveListTable<FileBrowserItem>
              data={sortedItems}
              columns={[
                {
                  key: "name",
                  label: "Name",
                  className: "min-w-[120px] md:min-w-[160px]",
                  sortable: true,
                  sortValue: (item) => `${item.type === "folder" ? "0" : "1"}_${item.name}`,
                  render: (item) => (
                    <div className="flex items-center gap-2">
                      <div className="relative cursor-pointer group/avatar flex-shrink-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          item.type === "folder" ? "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/50" :
                          item.sourceType === "document" ? "bg-blue-50 dark:bg-blue-500/10" :
                          item.sourceType === "presentation" ? "bg-amber-50 dark:bg-amber-500/10" :
                          item.sourceType === "spreadsheet" ? "bg-green-50 dark:bg-green-500/10" :
                          "bg-red-50 dark:bg-red-500/10"
                        }`}>
                          {getItemIcon(item, "w-3.5 h-3.5")}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        {renamingId === item.id ? (
                          <input type="text" value={renameValue} onChange={e => setRenameValue(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") submitRename(); if (e.key === "Escape") setRenamingId(null); }}
                            onBlur={submitRename} autoFocus onClick={e => e.stopPropagation()}
                            className="w-full px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500 midnight:border-cyan-500 purple:border-pink-500/30 text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20" />
                        ) : (
                          <>
                            <Tooltip content={item.name} block>
                              <p className={`text-xs sm:text-sm truncate leading-tight ${
                                item.type === "folder" ? "font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50" : "font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
                              }`}>{item.name}</p>
                            </Tooltip>
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 truncate leading-tight">
                              {item.type === "folder"
                                ? `${item.childCount ?? 0} items`
                                : item.owner || "Me"
                              }
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  ),
                },
                {
                  key: "details",
                  label: "Details",
                  className: "min-w-[150px] md:min-w-[200px]",
                  sortable: true,
                  sortValue: (item) => item.sourceType || "folder",
                  render: (item) => (
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 truncate leading-tight">
                        {item.type === "folder" ? "Folder" :
                         item.sourceType === "document" ? "Document" :
                         item.sourceType === "presentation" ? "Presentation" :
                         item.sourceType === "spreadsheet" ? "Spreadsheet" :
                         "File"}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 truncate mt-0.5 leading-tight">
                        {item.type === "folder" ? `${item.childCount ?? 0} items inside` : formatSize(item.size)}
                      </p>
                    </div>
                  ),
                },
                {
                  key: "owner",
                  label: "Owner",
                  className: "min-w-[80px] md:min-w-[90px]",
                  hidden: { mobile: true, tablet: true },
                  sortable: true,
                  sortValue: (item) => `${item.type === "folder" ? "0" : "1"}_${item.owner || "me"}`,
                  render: (item) => (
                    <div className="flex items-center gap-2 min-w-0">
                      <AvatarHover
                        src={item.ownerAvatar}
                        name={item.owner || "me"}
                      />
                      <span className="text-xs text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 truncate">
                        {(item.owner || "me").split(" ")[0]}
                      </span>
                    </div>
                  ),
                },
                {
                  key: "size",
                  label: "Size",
                  className: "min-w-[75px] md:min-w-[85px]",
                  hidden: { mobile: true, tablet: true },
                  sortable: true,
                  sortValue: (item) => (item.type === "folder" ? -1 : (item.size || 0)),
                  render: (item) => (
                    <span className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                      {item.type === "folder" ? "—" : formatSize(item.size)}
                    </span>
                  ),
                },
                {
                  key: "actions",
                  label: "",
                  className: "min-w-[80px] md:min-w-[130px] text-right pr-2",
                  render: (item) => (
                    <div className="flex items-center justify-end gap-0.5 relative">
                      <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mr-1 sm:mr-1.5 whitespace-nowrap">
                        {timeAgo(item.updatedAt)}
                      </span>
                      <div className="hidden sm:flex items-center gap-0.5">
                        <Tooltip content="Open">
                          <button onClick={e => { e.stopPropagation(); handleItemClick(item); }}
                            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer">
                            <ExternalLink className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
                          </button>
                        </Tooltip>
                        <button onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === item.id ? null : item.id); }}
                          className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 midnight:hover:text-cyan-100 purple:hover:text-pink-100 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 cursor-pointer transition-colors">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex sm:hidden">
                        <button onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === item.id ? null : item.id); }}
                          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer">
                          <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
                        </button>
                      </div>
                      {menuOpenId === item.id && (
                        <ItemContextMenu item={item} onRename={() => startRename(item)}
                          onMove={() => { onMove?.(item); setMenuOpenId(null); }}
                          onDelete={() => { onDelete?.(item); setMenuOpenId(null); }}
                          onDownload={() => onDownload?.(item)}
                          onCopy={() => onCopy?.(item)}
                          onShare={() => onShare?.(item)}
                          onInfo={() => onInfo?.(item)}
                          onClose={() => setMenuOpenId(null)} />
                      )}
                    </div>
                  ),
                },
              ] as ColumnConfig<FileBrowserItem>[]}
              getRowKey={(item) => item.id}
              onRowClick={handleItemClick}
              variant="contained"
              showColumnHeaders={true}
              enablePagination={true}
              enableItemsPerPage={true}
              defaultItemsPerPage={15}
              stickyColumnCount={1}
              disableHorizontalScroll={false}
              emptyMessage="No files or folders"
            />
          </div>
        )}

        {/* ── GRID VIEW — uses reusable FileCardGrid component ── */}
        {viewMode === "grid" && sortedItems.length > 0 && (
          <FileCardGrid
            items={sortedItems as FileCardItem[]}
            initialCount={5}
            loadMoreCount={10}
            onItemClick={(item) => handleItemClick(item as FileBrowserItem)}
            renamingId={renamingId}
            renameValue={renameValue}
            onRenameChange={setRenameValue}
            onRenameSubmit={submitRename}
            onRenameCancel={() => setRenamingId(null)}
            animate={isSearching || isPersonFiltering}
            renderMenu={(item, onClose) => (
              <ItemContextMenu
                item={item as FileBrowserItem}
                onRename={() => startRename(item as FileBrowserItem)}
                onMove={() => { onMove?.(item as FileBrowserItem); onClose(); }}
                onDelete={() => { onDelete?.(item as FileBrowserItem); onClose(); }}
                onDownload={() => onDownload?.(item as FileBrowserItem)}
                onCopy={() => onCopy?.(item as FileBrowserItem)}
                onShare={() => onShare?.(item as FileBrowserItem)}
                onInfo={() => onInfo?.(item as FileBrowserItem)}
                onClose={onClose}
              />
            )}
          />
        )}

        {/* ── Empty state ── */}
        {sortedItems.length === 0 && !newFolderMode && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FolderOpen className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-[14px] font-medium">{emptyTitle || (searchQuery ? "No results found" : "This folder is empty")}</p>
            <p className="text-[12px] mt-1">{emptySubtitle || "Try different filters or create a new file"}</p>
            {!searchQuery && !typeFilter && emptyAction}
          </div>
        )}
        </div>{/* end scrollable file list */}
      </div>
    </div>
  );
}

export type { FileBrowserItem as FileBrowserItemType };
