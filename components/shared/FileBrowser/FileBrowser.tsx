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

function ItemContextMenu({ item, onRename, onMove, onDelete, onClose }: {
  item: FileBrowserItem; onRename: () => void; onMove: () => void; onDelete: () => void; onClose: () => void;
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
      <button className="w-full px-3 py-2 text-left text-[12px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2.5 cursor-pointer transition-colors" onClick={onClose}>
        <Download className="w-3.5 h-3.5 text-gray-400" /> Download
      </button>
      <button className="w-full px-3 py-2 text-left text-[12px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2.5 cursor-pointer transition-colors" onClick={onClose}>
        <Copy className="w-3.5 h-3.5 text-gray-400" /> Make a copy
      </button>
      <div className="my-1 h-px bg-gray-100 dark:bg-gray-800" />
      <button className="w-full px-3 py-2 text-left text-[12px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2.5 cursor-pointer transition-colors" onClick={onClose}>
        <Share2 className="w-3.5 h-3.5 text-gray-400" /> Share
      </button>
      <button className="w-full px-3 py-2 text-left text-[12px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2.5 cursor-pointer transition-colors" onClick={onClose}>
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
  headerActions, titleMenuItems, people, onPeopleFilter, onNavigate, onFileOpen, onRename, onMove, onDelete, onCreateFolder,
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

        {/* ── SUGGESTED (recent files) ── */}
        {recentFiles && recentFiles.length > 0 && !isSearching && !isPersonFiltering && !typeFilter && !modifiedFilter && (
          <section className="mb-6">
            <h3 className="text-[13px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">Suggested</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {recentFiles.slice(0, 5).map(file => (
                <div key={file.id} onClick={() => onFileOpen?.(file)}
                  className="flex-shrink-0 w-[180px] group cursor-pointer">
                  <div className="aspect-[4/3] rounded-xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/50 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-shadow duration-300 group-hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] relative overflow-hidden"
                    style={{ borderTop: `3px solid ${getTypeColor(file)}` }}>
                    <div className="w-full h-full flex items-center justify-center">
                      {getItemIcon(file, "w-10 h-10 opacity-20")}
                    </div>
                    <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-400/50 transition-colors duration-300 pointer-events-none" />
                  </div>
                  <div className="mt-2 px-0.5">
                    <p className="text-[13px] font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {getItemIcon(file, "w-3 h-3")}
                      <span className="text-[11px] text-gray-400">{timeAgo(file.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── LIST VIEW (matches Documents page pattern) ── */}
        {viewMode === "list" && sortedItems.length > 0 && (
          <div className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden transition-all duration-300 ${isSearching ? "animate-in fade-in slide-in-from-bottom-2 duration-300" : ""}`}>
            {/* Header */}
            <div className="grid grid-cols-[1fr_120px_130px_80px_40px] px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              <button className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-left" onClick={() => toggleSort("name")}>
                Name {sortField === "name" && <ArrowUp className={`w-3 h-3 transition-transform ${sortAsc ? "" : "rotate-180"}`} />}
              </button>
              <span className="hidden lg:block">Owner</span>
              <button className="hidden sm:flex items-center gap-1 cursor-pointer hover:text-gray-700 transition-colors" onClick={() => toggleSort("modified")}>
                Last modified {sortField === "modified" && <ArrowUp className={`w-3 h-3 transition-transform ${sortAsc ? "" : "rotate-180"}`} />}
              </button>
              <button className="hidden md:flex items-center gap-1 cursor-pointer hover:text-gray-700 transition-colors" onClick={() => toggleSort("size")}>
                File size
              </button>
              <span />
            </div>
            {sortedItems.map(item => (
              <div key={item.id} onClick={() => handleItemClick(item)}
                className="grid grid-cols-[1fr_120px_130px_80px_40px] items-center px-4 h-[52px] border-b border-gray-50 dark:border-gray-800/50 last:border-b-0 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3 min-w-0">
                  {getItemIcon(item, "w-5 h-5 flex-shrink-0")}
                  {renamingId === item.id ? (
                    <input type="text" value={renameValue} onChange={e => setRenameValue(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") submitRename(); if (e.key === "Escape") setRenamingId(null); }}
                      onBlur={submitRename} autoFocus onClick={e => e.stopPropagation()}
                      className="flex-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-[13px] outline-none" />
                  ) : (
                    <span className="text-[13px] text-gray-800 dark:text-gray-200 truncate">{item.name}</span>
                  )}
                </div>
                <div className="hidden lg:flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                    {(item.owner || "me")[0].toUpperCase()}
                  </div>
                  <span className="text-[12px] text-gray-500 truncate">{item.owner || "me"}</span>
                </div>
                <span className="hidden sm:block text-[12px] text-gray-500">{timeAgo(item.updatedAt)}</span>
                <span className="hidden md:block text-[12px] text-gray-500">{item.type === "folder" ? "—" : formatSize(item.size)}</span>
                <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity relative">
                  <button onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === item.id ? null : item.id); }}
                    className="p-1 rounded text-gray-400 hover:text-gray-600 cursor-pointer">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                  {menuOpenId === item.id && (
                    <ItemContextMenu item={item} onRename={() => startRename(item)}
                      onMove={() => { onMove?.(item); setMenuOpenId(null); }}
                      onDelete={() => { onDelete?.(item); setMenuOpenId(null); }}
                      onClose={() => setMenuOpenId(null)} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── GRID VIEW (matches Documents page pattern) ── */}
        {viewMode === "grid" && sortedItems.length > 0 && (
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 transition-all duration-300 ${isSearching ? "animate-in fade-in slide-in-from-bottom-2 duration-300" : ""}`}>
            {sortedItems.map(item => (
              <div key={item.id} className="group relative cursor-pointer" onClick={() => handleItemClick(item)}>
                <div className="aspect-[3/4] rounded-xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/50 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-shadow duration-300 group-hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] relative"
                  style={{ borderTop: `3px solid ${getTypeColor(item)}` }}>
                  {/* Preview area */}
                  <div className="absolute inset-0 rounded-b-xl overflow-hidden flex items-center justify-center">
                    {item.type === "folder" ? (
                      <Folder className="w-16 h-16 text-gray-200 dark:text-gray-700" />
                    ) : (
                      getItemIcon(item, "w-14 h-14 opacity-15")
                    )}
                  </div>
                  {/* Hover border */}
                  <div className="absolute inset-[-1px] rounded-xl border-2 border-transparent group-hover:border-blue-400/50 transition-colors duration-300 pointer-events-none z-[5]" />
                  {/* Menu trigger */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === item.id ? null : item.id); }}
                      className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm cursor-pointer shadow-sm transition-colors">
                      <MoreVertical className="w-3 h-3" />
                    </button>
                  </div>
                  {menuOpenId === item.id && (
                    <div className="absolute top-10 right-2 z-50" onClick={e => e.stopPropagation()}>
                      <ItemContextMenu item={item} onRename={() => startRename(item)}
                        onMove={() => { onMove?.(item); setMenuOpenId(null); }}
                        onDelete={() => { onDelete?.(item); setMenuOpenId(null); }}
                        onClose={() => setMenuOpenId(null)} />
                    </div>
                  )}
                </div>
                {/* Metadata below card */}
                <div className="mt-2.5 px-0.5">
                  {renamingId === item.id ? (
                    <input type="text" value={renameValue} onChange={e => setRenameValue(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") submitRename(); if (e.key === "Escape") setRenamingId(null); }}
                      onBlur={submitRename} autoFocus onClick={e => e.stopPropagation()}
                      className="w-full px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 border border-blue-200 text-[13px] outline-none" />
                  ) : (
                    <p className="text-[14px] font-semibold text-gray-800 dark:text-gray-200 truncate leading-tight">{item.name}</p>
                  )}
                  <div className="flex items-center gap-1.5 mt-1">
                    {getItemIcon(item, "w-3 h-3 flex-shrink-0")}
                    <span className="text-[11px] text-gray-400">{timeAgo(item.updatedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
