"use client";

import React, { useState, useEffect } from "react";
import {
  Folder, FolderOpen, FolderPlus, FileText, Presentation, Table2,
  Image as ImageIcon, File, MoreVertical, ChevronDown,
  LayoutGrid, List, Trash2, Pencil, X, FolderInput, Clock,
  Star, Users, HardDrive, Cloud, ArrowUp, LucideIcon,
  Download, Copy, Share2, Info, ExternalLink, Home, Search,
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
import DataTable, { type ColumnConfig } from "@/components/shared/DataTable";

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
  useEffect(() => {
    const handler = () => onClose();
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [onClose]);

  return (
    <div className="absolute top-full right-0 mt-1 w-[180px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 z-50 py-1" onClick={e => e.stopPropagation()}>
      <button className="w-full px-3 py-2 text-left text-[12px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2.5 cursor-pointer transition-colors" onClick={onRename}>
        <Pencil className="w-3.5 h-3.5 text-gray-400" /> Rename
      </button>
      <button className="w-full px-3 py-2 text-left text-[12px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2.5 cursor-pointer transition-colors" onClick={onMove}>
        <FolderInput className="w-3.5 h-3.5 text-gray-400" /> Move to
      </button>
      <button className="w-full px-3 py-2 text-left text-[12px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2.5 cursor-pointer transition-colors" onClick={() => { onDownload?.(); onClose(); }}>
        <Download className="w-3.5 h-3.5 text-gray-400" /> Download
      </button>
      <button className="w-full px-3 py-2 text-left text-[12px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2.5 cursor-pointer transition-colors" onClick={() => { onCopy?.(); onClose(); }}>
        <Copy className="w-3.5 h-3.5 text-gray-400" /> Make a copy
      </button>
      <div className="my-1 h-px bg-gray-100 dark:bg-gray-800" />
      <button className="w-full px-3 py-2 text-left text-[12px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2.5 cursor-pointer transition-colors" onClick={() => { onShare?.(); onClose(); }}>
        <Share2 className="w-3.5 h-3.5 text-gray-400" /> Share
      </button>
      <button className="w-full px-3 py-2 text-left text-[12px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2.5 cursor-pointer transition-colors" onClick={() => { onInfo?.(); onClose(); }}>
        <Info className="w-3.5 h-3.5 text-gray-400" /> File information
      </button>
      {!item.readOnly && (
        <>
          <div className="my-1 h-px bg-gray-100 dark:bg-gray-800" />
          <button className="w-full px-3 py-2 text-left text-[12px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2.5 cursor-pointer transition-colors" onClick={onDelete}>
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
    <div className={`flex gap-0 min-h-[500px] ${className}`}>
      {/* ══════ LEFT SIDEBAR ══════ */}
      {sidebarItems && sidebarItems.length > 0 && (
        <div className="hidden md:flex flex-col w-[220px] flex-shrink-0 border-r border-gray-100 dark:border-gray-800 pr-4 mr-4">
          {headerActions && <div className="mb-5">{headerActions}</div>}
          <nav className="flex flex-col gap-0.5">
            {sidebarItems.map(nav => (
              <button key={nav.id} onClick={() => onSidebarNavigate?.(nav.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-[14px] font-medium transition-all cursor-pointer ${
                  nav.active
                    ? "bg-blue-100/80 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}>
                <nav.icon className={`w-5 h-5 flex-shrink-0 ${nav.active ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}`} />
                {nav.label}
              </button>
            ))}
          </nav>
          {storageUsed && storageTotal && (
            <div className="mt-auto pt-8 pb-2">
              <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${storagePercent ?? 0}%` }} />
              </div>
              <p className="text-[12px] text-gray-500 dark:text-gray-400">{storageUsed} of {storageTotal} used</p>
            </div>
          )}
        </div>
      )}

      {/* ══════ MAIN CONTENT ══════ */}
      <div className="flex-1 min-w-0">
        {/* Title + Search + View toggle */}
        <div className="flex items-center gap-4 mb-3">
          {/* Title — as dropdown trigger if titleMenuItems provided, else plain text */}
          {titleMenuItems && titleMenuItems.length > 0 ? (
            <ActionMenuDropdown
              trigger={(menuOpen) => (
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[18px] font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer flex-shrink-0">
                  {breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 1]?.name : title}
                  <ChevronDown className={`w-4 h-4 transition-all duration-[120ms] ease-out ${menuOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : "rotate-0 text-gray-500"}`} />
                </button>
              )}
              items={titleMenuItems}
              width="w-[260px]"
            />
          ) : (
            <h2 className="text-[18px] font-bold text-gray-900 dark:text-white flex-shrink-0">
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

        {/* Filters — using existing CustomDropdown and PeopleFilterDropdown components */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
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
            className="w-[150px]"
          />
          {people && people.length > 0 && (
            <PeopleFilterDropdown
              people={people}
              selectedPerson={selectedPerson}
              onSelect={(person) => {
                setSelectedPerson(person);
                onPeopleFilter?.(person);
              }}
            />
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
            className="w-[150px]"
          />
        </div>

        {/* New folder inline */}
        {newFolderMode && (
          <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50/60 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-500/20">
            <FolderPlus className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <input type="text" value={newFolderName} onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleCreateFolder(); if (e.key === "Escape") { onNewFolderModeChange?.(false); setNewFolderName(""); } }}
              placeholder="Untitled folder" autoFocus
              className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-[13px] text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" />
            <button onClick={handleCreateFolder} disabled={!newFolderName.trim()} className="px-4 py-1.5 rounded-lg text-[12px] font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-30 cursor-pointer shadow-sm">Create</button>
            <button onClick={() => { onNewFolderModeChange?.(false); setNewFolderName(""); }} className="p-1 rounded-lg hover:bg-gray-200/60 dark:hover:bg-gray-700 cursor-pointer"><X className="w-4 h-4 text-gray-400" /></button>
          </div>
        )}

        {/* ── SEARCH RESULTS HEADER ── */}
        {isSearching && (
          <div className="flex items-center justify-between mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <Search className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-200">
                  Search results for &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-[11px] text-gray-400">
                  {sortedItems.length} {sortedItems.length === 1 ? "item" : "items"} found
                </p>
              </div>
            </div>
            <button
              onClick={() => setSearchQuery("")}
              className="text-[12px] font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
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
                <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-200">
                  Files from {selectedPerson!.name}
                </p>
                <p className="text-[11px] text-gray-400">
                  {sortedItems.length} {sortedItems.length === 1 ? "file" : "files"} found
                </p>
              </div>
            </div>
            <button
              onClick={() => { setSelectedPerson(null); onPeopleFilter?.(null); }}
              className="text-[12px] font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
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
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200/60 dark:border-gray-700/40" /></div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#1e1030] px-4 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Folder className="w-3 h-3" />
                    All files
                    <span className="text-[10px] font-normal text-gray-300 dark:text-gray-600">({sortedItems.length})</span>
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── LIST VIEW — uses existing DataTable component ── */}
        {viewMode === "list" && sortedItems.length > 0 && (
          <div className={`transition-all duration-300 ${isSearching || isPersonFiltering ? "animate-in fade-in slide-in-from-bottom-2 duration-300" : ""}`}>
            <DataTable<FileBrowserItem>
              data={sortedItems}
              columns={[
                {
                  key: "name",
                  label: "Name",
                  sortable: true,
                  className: "w-[45%]",
                  sortValue: (item) => `${item.type === "folder" ? "0" : "1"}_${item.name}`,
                  render: (item) => (
                    <div className="flex items-center gap-3 min-w-0 py-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        item.type === "folder" ? "bg-gray-100 dark:bg-gray-800" :
                        item.sourceType === "document" ? "bg-blue-50 dark:bg-blue-500/10" :
                        item.sourceType === "presentation" ? "bg-amber-50 dark:bg-amber-500/10" :
                        item.sourceType === "spreadsheet" ? "bg-green-50 dark:bg-green-500/10" :
                        "bg-red-50 dark:bg-red-500/10"
                      }`}>
                        {getItemIcon(item, "w-4 h-4")}
                      </div>
                      {renamingId === item.id ? (
                        <input type="text" value={renameValue} onChange={e => setRenameValue(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") submitRename(); if (e.key === "Escape") setRenamingId(null); }}
                          onBlur={submitRename} autoFocus onClick={e => e.stopPropagation()}
                          className="flex-1 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20" />
                      ) : (
                        <div className="min-w-0 overflow-hidden flex-1">
                          <Tooltip content={item.name} block>
                            <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 truncate block">{item.name}</span>
                          </Tooltip>
                          {item.type === "folder" && item.childCount !== undefined && (
                            <span className="text-[10px] text-gray-400 dark:text-gray-500">{item.childCount} items</span>
                          )}
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  key: "owner",
                  label: "Owner",
                  sortable: true,
                  sortValue: (item) => `${item.type === "folder" ? "0" : "1"}_${item.owner || "me"}`,
                  hidden: { mobile: true, tablet: true },
                  render: (item) => (
                    <div className="flex items-center gap-2.5 min-w-0">
                      <AvatarHover
                        src={item.ownerAvatar}
                        name={item.owner || "me"}
                      />
                      <div className="min-w-0 overflow-hidden flex-1">
                        <Tooltip content={item.owner || "me"} block>
                          <span className="text-[12px] font-medium text-gray-600 dark:text-gray-400 truncate block">{item.owner || "me"}</span>
                        </Tooltip>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "updatedAt",
                  label: "Last modified",
                  sortable: true,
                  sortValue: (item) => (item.type === "folder" ? 0 : 1e15) + new Date(item.updatedAt).getTime(),
                  hidden: { mobile: true },
                  render: (item) => (
                    <span className="text-[12px] text-gray-500 dark:text-gray-400">{timeAgo(item.updatedAt)}</span>
                  ),
                },
                {
                  key: "size",
                  label: "File size",
                  sortable: true,
                  sortValue: (item) => (item.type === "folder" ? -1 : (item.size || 0)),
                  hidden: { mobile: true, tablet: true },
                  render: (item) => (
                    <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
                      {item.type === "folder" ? "—" : formatSize(item.size)}
                    </span>
                  ),
                },
                {
                  key: "actions",
                  label: "",
                  sortable: false,
                  className: "w-12",
                  render: (item) => (
                    <div className="flex items-center justify-end relative">
                      <button onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === item.id ? null : item.id); }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
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
              title=""
              showSearch={false}
              enablePagination={true}
              enableItemsPerPage={true}
              defaultItemsPerPage={10}
              stickyColumnCount={0}
              disableHorizontalScroll
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
      </div>
    </div>
  );
}

export type { FileBrowserItem as FileBrowserItemType };
